import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAnotationStore } from "@/store/useAnotationStore";
import { useSQLiteContext } from "expo-sqlite";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { FlatList } from "react-native-gesture-handler";
import { AnotationItemComponent } from "./AnotationItemComponent";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { formatToBR } from "@/utils/FormatDate";

export default function DetailAnotationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const anotationId = id ? Number(id) : null;

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { loadItens, itens, loading, filterAnotation, toggleItemCompleted, deleteItem } =
    useAnotationStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();
  const db = useSQLiteContext();

  const [anotation, setAnotation] = useState<any>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(
        colorScheme === "dark" ? "light-content" : "dark-content"
      );
      if (anotationId) {
        filterAnotation(anotationId)
          .then(setAnotation)
          .catch(console.error);
        loadItens(anotationId, db);
      }
    }, [colorScheme, anotationId, db, filterAnotation, loadItens])
  );

  useEffect(() => {
    if (anotationId) {
      filterAnotation(anotationId)
        .then(setAnotation)
        .catch(console.error);
      loadItens(anotationId, db);
    }
  }, [anotationId, db]);

  const handleToggleItem = async (itemId: number, completed: boolean) => {
    await toggleItemCompleted(itemId, completed, db);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (anotationId) {
      await deleteItem(itemId, anotationId, db);
    }
  };

  const totalValue = itens.reduce((acc, item) => acc + item.value, 0);
  const currentValue = itens
    .filter((item) => item.completed)
    .reduce((acc, item) => acc + item.value, 0);
  const completedItems = itens.filter((item) => item.completed).length;
  const totalItems = itens.length;

  if (!anotationId) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Anotação não encontrada</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <Text className="text-background">Voltar</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="mt-7 w-full">
        <Header
          viewDrawer={false}
          bg={theme.background}
          iconColor={theme.foreground}
          iconOne={
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/add-item",
                  params: { id: anotationId.toString() },
                });
              }}
            >
              <Feather name="plus" size={20} color={theme.foreground} />
            </TouchableOpacity>
          }
          iconFour={
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="log-out" size={20} color={theme.foreground} />
            </TouchableOpacity>
          }
          iconTree={
            <TouchableOpacity 
              onPress={() => setIsDeleteMode(!isDeleteMode)}
            >
              <Feather 
                name="trash-2" 
                size={18} 
                color={isDeleteMode ? theme.destructive : theme.foreground} 
              />
            </TouchableOpacity>
          }
          iconTwo={
            <TouchableOpacity onPress={toggleValuesVisibility}>
                  <Feather 
                    name={valuesVisible ? 'eye' : 'eye-off'} 
                    size={20} 
                    color={theme.foreground}
                  />
                </TouchableOpacity>
          }
        />
      </View>

      <View className="flex-1 px-5 pt-6">
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-2 gap-3">
            <Text className="text-3xl font-bold text-foreground flex-1">
              {anotation?.title || "Anotação"}
            </Text>
              <View className="flex-row items-center gap-2">
                <Feather
                  name="dollar-sign"
                  size={16}
                  color={theme.mutedForeground}
                />
                <Text className="text-lg font-bold text-foreground">
                  {valuesVisible ? formatarValorBr(currentValue) : 'R$ ••••••'}
                </Text>
              </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Feather
              name="calendar"
              size={14}
              color={theme.mutedForeground}
            />
            <Text className="text-sm text-muted-foreground">
              {formatToBR(anotation?.created_at)}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-4 mb-6">
          <Card className="h-[15vh] p-5 bg-card border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather
                name="dollar-sign"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total Previsto
              </Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              {valuesVisible ? formatarValorBr(totalValue) : 'R$ ••••••'}
            </Text>
          </Card>

          <Card className="h-[15vh] p-5 bg-card border-border justify-between">
            <View className="flex-row items-center gap-2">
              <Feather
                name="check-circle"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Progresso
              </Text>
            </View>
            {totalItems > 0 && (
              <View className="h-2 bg-muted rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(completedItems / totalItems) * 100}%`,
                  }}
                />
              </View>
            )}
            <View className="flex-row items-baseline gap-1 mb-2">
              <Text className="text-lg font-bold text-foreground">
                {completedItems}
              </Text>
              <Text className="text-sm text-muted-foreground">
                / {totalItems}
              </Text>
            </View>
          </Card>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">
              Itens
            </Text>
            <View className="flex-row items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <Feather
                name="list"
                size={14}
                color={theme.mutedForeground}
              />
              <Text className="text-sm font-medium text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </Text>
            </View>
          </View>
          <Card className="p-4 border-border h-[50vh]">
            <FlatList
              data={itens}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <AnotationItemComponent
                  item={item}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                  showDelete={isDeleteMode}
                />
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-16">
                  <View className="bg-muted/30 rounded-full p-6 mb-4">
                    <Feather
                      name="file-text"
                      color={theme.mutedForeground}
                      size={48}
                    />
                  </View>
                  <Text className="text-muted-foreground mt-2 text-center text-base font-medium">
                    Nenhum item adicionado ainda
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-center text-sm">
                    Comece adicionando seu primeiro item
                  </Text>
                  <TouchableOpacity
                    className="bg-primary px-6 py-3 rounded-xl mt-6"
                    style={{
                      shadowColor: theme.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                    onPress={() => {
                      router.push({
                        pathname: "/add-item",
                        params: { id: anotationId.toString() },
                      });
                    }}
                  >
                    <View className="flex-row items-center gap-2">
                      <Feather
                        name="plus"
                        size={18}
                        color={theme.primaryForeground || theme.background}
                      />
                      <Text className="text-background font-semibold text-base">
                        Adicionar primeiro item
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
          </Card>
        </View>
      </View>
    </View>
  );
}

