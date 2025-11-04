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
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react-native";

export default function CreateWalletScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const [walletName, setWalletName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addWallet } = useWalletStore();
  const db = useSQLiteContext();


  async function handleSave() {

    setIsLoading(true);

    if (!walletName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a carteira.");
      setIsLoading(false);
      return;
    }

    try{
    addWallet({ name: walletName }, db);
    router.back();
    }catch(err){
      setIsLoading(false);
      console.error("Erro ao criar carteira: ", err)
    }finally{
      setIsLoading(false);
    }
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

          {isLoading ?
          <Button disabled className="w-full">
            <View className="pointer-events-none animate-spin">
              <Icon as={Loader2} className="text-primary-foreground" />
            </View>
            <Text>Por favor, aguarde</Text>
          </Button>
          :
          (<Button onPress={() => handleSave()} className="w-full">
            <Text className="text-background text-base font-semibold">
              Adicionar Carteira
            </Text>
          </Button>)
          }
        </View>
      </View>
    </SafeAreaView>
  );
}
