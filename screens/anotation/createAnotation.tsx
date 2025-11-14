import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { useWalletStore } from "@/store/useWalletStore";
import { useAnotationStore } from "@/store/useAnotationStore";
import { useSQLiteContext } from "expo-sqlite";
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function CreateAnotation() {
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { activeWallet } = useWalletStore();
  const { addAnotation } = useAnotationStore();
  const db = useSQLiteContext();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
    }, [colorScheme])
  );

  const handleSave = async () => {
    setIsLoading(true);

    if (!title.trim() || type === "") {
      setIsLoading(false);
      return;
    }

    try {
      await addAnotation(
        {
          title: title.trim(),
          type,
          wallet_id: activeWallet.id,
          created_at: new Date().toISOString(),
        },
        db
      );

      router.back();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top", "bottom"]} className="px-5 pt-3 gap-6">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={10}
              activeOpacity={0.7}
              className="p-2"
            >
              <Feather name="arrow-left" size={26} color={theme.foreground} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold ml-3 text-foreground">
              Nova Anotação
            </Text>
          </View>

          <View className="gap-3 mt-4">
            <Text className="text-base text-foreground font-medium">
              Título da Anotação
            </Text>
            <Input 
              placeholder="Ex: Compras do mês" 
              className="text-base" 
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View className="gap-3 mt-4">
            <Text className="text-base text-foreground font-medium">
              Tipo
            </Text>
            <View className="flex-row justify-center gap-4">
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
          </View>

          <View className="mt-6">
            <View className="bg-muted/30 p-4 rounded-xl border border-border">
              <View className="flex-row items-start gap-3">
                <Feather name="info" size={20} color={theme.mutedForeground} />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Você poderá adicionar itens específicos (com valores e categorias) após criar a anotação.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="mt-auto pb-4">
          {isLoading ? (
            <Button disabled>
              <View className="pointer-events-none animate-spin">
                <Icon as={Loader2} className="text-primary-foreground" />
              </View>
              <Text>Salvando...</Text>
            </Button>
          ) : (
            <Button onPress={handleSave}>
              <Text className="text-background text-base font-semibold">
                Criar Anotação
              </Text>
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

