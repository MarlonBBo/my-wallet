import { TouchableOpacity, View, Text, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import WalletComponent from "./Wallets.Component";
import { THEME } from "@/lib/theme";

export default function WalletsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="rounded-3xl border border-border p-6 mb-8 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="color-foreground text-4xl font-bold mb-3">
            Suas Carteiras
          </Text>
          <Text className="color-foreground text-lg font-medium">Saldo Total</Text>
          <Text className="color-foreground text-3xl font-bold mt-2">
            R$ 55.000,00
          </Text>
        </View>
      </View>

      <View className="gap-4 flex-1">
        <WalletComponent title="Principal" amount="R$ 10.000,00" />
        <WalletComponent title="Secundário" amount="R$ 5.000,00" />
        <WalletComponent title="Tertiário" amount="R$ 10.000,00" />
        <WalletComponent title="Quaternário" amount="R$ 10.000,00" />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/new-wallet")}
        className="mt-8 bg-primary rounded-3xl flex-row items-center justify-center py-4 w-full shadow-xl"
      >
        <Feather name="plus" size={24} color={theme.background} />
        <Text className="ml-3 text-xl font-bold text-primary-foreground">
          Adicionar Nova Carteira
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
