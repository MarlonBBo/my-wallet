import { useColorScheme } from "nativewind";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/lib/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useAnotationStore } from "@/store/useAnotationStore";
import { useSQLiteContext } from "expo-sqlite";
import { handleChange } from "@/utils/TransformInInteger";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function AddItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const anotationId = id ? Number(id) : null;

  const db = useSQLiteContext();

  const [valorCentavos, setValorCentavos] = useState(0);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addItem, filterAnotation } = useAnotationStore();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const [anotation, setAnotation] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(
        colorScheme === "dark" ? "light-content" : "dark-content"
      );
    }, [colorScheme])
  );

  useEffect(() => {
    if (anotationId) {
      filterAnotation(anotationId).then(setAnotation).catch(console.error);
    }
  }, [anotationId]);

  const handleAddItem = async () => {
    setIsLoading(true);

    if (!title.trim() || valorCentavos <= 0 || !anotationId) {
      setIsLoading(false);
      return;
    }

    try {
      await addItem(
        {
          anotation_id: anotationId,
          category_id: null,
          title: title.trim(),
          value: valorCentavos,
          completed: false,
          created_at: new Date().toISOString(),
        },
        db
      );

      router.back();
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao adicionar item: ", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

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
    <View
      className="flex-1 bg-background px-6"
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="mt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: theme.foreground }}
                >
                  {anotation?.title || "Adicionar Item"}
                </Text>
                <Text
                  className="text-sm mt-1"
                  style={{ color: theme.mutedForeground }}
                >
                  Adicione um novo item à anotação
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                className="ml-4 p-2"
                hitSlop={10}
              >
                <Feather name="x" size={26} color={theme.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-8 mb-4">
            <Text
              className="text-xl font-bold text-center"
              style={{ color: theme.foreground }}
            >
              Qual é o valor do item?
            </Text>
          </View>

          <TextInput
            className="text-4xl font-extrabold text-center"
            style={{
              color: theme.foreground,
            }}
            placeholder="R$ 0,00"
            placeholderTextColor={theme.ring}
            keyboardType="numeric"
            value={valorCentavos === 0 ? "" : formatarValorBr(valorCentavos)}
            onChangeText={(text) => handleChange(text, setValorCentavos)}
          />

          <View className="mt-10 w-full gap-6">
            <View>
              <Text
                className="text-base font-medium mb-2"
                style={{ color: theme.foreground }}
              >
                Título do item
              </Text>
              <TextInput
                className="w-full text-base border-b pb-2"
                style={{
                  color: theme.foreground,
                  borderColor: theme.border,
                }}
                placeholder="Ex: Compra no supermercado"
                placeholderTextColor={theme.ring}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>
        </ScrollView>

        {isLoading ? (
          <Button
            disabled
            className="absolute bottom-20 w-full self-center rounded-md"
          >
            <View className="pointer-events-none animate-spin">
              <Icon as={Loader2} className="text-primary-foreground" />
            </View>
            <Text>Salvando...</Text>
          </Button>
        ) : (
          <Button
            onPress={handleAddItem}
            className="absolute bottom-20 w-full self-center rounded-md"
          >
            <Text className="text-background text-base font-semibold">
              Adicionar Item
            </Text>
          </Button>
        )}
      </SafeAreaView>
    </View>
  );
}

