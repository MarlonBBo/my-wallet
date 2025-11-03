import React, { useMemo, useState, useCallback } from "react";
import {
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { router } from "expo-router";
import { iconsTraduzidos } from "@/iconsTraduzidos";
import { IconComponent } from "./iconComponent";
import { useWalletStore } from "@/store/useWalletStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useSQLiteContext } from "expo-sqlite";
import { IconDto } from "@/types/iconType";
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react-native";

export default function CreateCategory() {
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconDto | null>(null);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

   const { activeWallet } = useWalletStore();
   const { addCategory } = useCategoryStore();

   const db = useSQLiteContext();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const filtrados = useMemo(
    () =>
      iconsTraduzidos.filter((i) =>
        i.nome.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

 const handleSave = async () => {

  setIsLoading(true)

  if (!title.trim() || !selectedIcon || type === ""){
    setIsLoading(false)
    return
  };

  try{
    await addCategory(
    {
      title,
      type,
      icon_name: selectedIcon.icon,
      icon_lib: selectedIcon.lib,
      wallet_id: activeWallet.id,
      total: 0,
      created_at: new Date().toISOString(),
    },
    db
  );

  router.push("/drawer/(tabs)/category");
  setIsLoading(false)

  }catch(err){
    console.error(err)
    setIsLoading(false)
  }finally{
    setIsLoading(false)
  }
};


  const handleSelectIcon = useCallback((icon: IconDto) => {
    setSelectedIcon(icon);
  }, []);

  console.log(selectedIcon)

  const renderItem = useCallback(
    ({ item }: any) => {
      const isSelected =
        selectedIcon &&
        selectedIcon.icon === item.icon &&
        selectedIcon.lib === item.lib;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelectIcon(item)}
          className={`items-center justify-center p-3 rounded-xl ${
            isSelected
              ? "bg-primary/20 border border-primary"
              : "bg-transparent"
          }`}
          style={{ width: "22%" }}
        >
          <IconComponent {...item} />
          <Text
            className={`text-xs mt-1 text-center ${
              isSelected ? "text-primary font-medium" : "text-foreground"
            }`}
            numberOfLines={1}
          >
            {item.nome}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedIcon, handleSelectIcon]
  );

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top", "bottom"]} className="px-5 pt-3 gap-6">

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/drawer/(tabs)/category")}
            hitSlop={10}
            activeOpacity={0.7}
            className="p-2"
          >
            <Feather name="arrow-left" size={26} color={theme.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold ml-3 text-foreground">
            Nova Categoria
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-base text-foreground font-medium">
            Nome da Categoria
          </Text>
          <Input 
            placeholder="Ex: Alimentação" 
            className="text-base" 
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="flex-row justify-center gap-4 mt-2">
          <Button
            variant={type === "income" ? "default" : "outline"}
            onPress={() => setType("income")}
            className="flex-1"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Feather
                name="arrow-down-circle"
                size={18}
                color={
                  type === "income" ? theme.background : theme.foreground
                }
              />
              <Text
                className={`font-medium ${
                  type === "income" ? "text-background" : "text-foreground"
                }`}
              >
                Entrada
              </Text>
            </View>
          </Button>

          <Button
            variant={type === "expense" ? "default" : "outline"}
            onPress={() => setType("expense")}
            className="flex-1"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Feather
                name="arrow-up-circle"
                size={18}
                color={
                  type === "expense" ? theme.background : theme.foreground
                }
              />
              <Text
                className={`font-medium ${
                  type === "expense" ? "text-background" : "text-foreground"
                }`}
              >
                Saída
              </Text>
            </View>
          </Button>
        </View>

        <Card className="p-4 mt-4 h-2/4">
          <View className="flex-row gap-2 mb-4">
            <Input
              placeholder="Buscar ícone..."
              value={search}
              onChangeText={setSearch}
              className="flex-1"
            />
            <Button variant="outline">
              <Feather name="search" size={18} color={theme.foreground} />
            </Button>
          </View>

          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.nome}
            numColumns={4}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            initialNumToRender={20}
            windowSize={5}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        </Card>

        <View className="mt-auto pb-4">
          {isLoading ?
          <Button disabled>
            <View className="pointer-events-none animate-spin">
              <Icon as={Loader2} className="text-primary-foreground" />
            </View>
            <Text>Por favor, aguarde</Text>
          </Button>
          :
          (<Button onPress={() => handleSave()}>
            <Text className="text-background text-base font-semibold">
              Salvar Categoria
            </Text>
          </Button>)
          }
        </View>
      </SafeAreaView>
    </View>
  );
}
