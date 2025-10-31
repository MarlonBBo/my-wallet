import { router, useFocusEffect, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";
import { Alert, BackHandler, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { useSQLiteContext } from "expo-sqlite";
import { WalletDto } from "@/types/wallet";

export default function CreateWalletScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const [walletName, setWalletName] = useState("");

  const { addWallet } = useWalletStore();
  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/drawer/wallets"); // volta para wallets sempre
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [])
  );


  async function handleSave() {
    if (!walletName.trim()) {
      Alert.alert("Erro", "O nome da carteira é obrigatório.");
      return;
    }
    await addWallet({ name: walletName }, db);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <View className="flex-1 mt-28 items-center">
        <View className="w-full max-w-md items-center">
          <Feather
            name="credit-card"
            size={60}
            color={theme.mutedForeground}
            style={{ marginBottom: 30 }}
          />

          <Text className="text-2xl font-semibold text-foreground mb-2">
            Nova Carteira
          </Text>
          <Text className="text-muted-foreground text-center mb-8">
            Escolha um nome para a sua nova carteira
          </Text>

          <Input
            placeholder="Ex: Carteira principal"
            value={walletName}
            onChangeText={setWalletName}
            className="mb-8"
          />

          <Button
            onPress={handleSave}
            disabled={!walletName.trim()}
            className="flex-row items-center justify-center w-full rounded-2xl"
          >
            <Feather name="plus" size={20} color={theme.background} />
            <Text className="text-background font-semibold text-base">
              Criar Carteira
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
