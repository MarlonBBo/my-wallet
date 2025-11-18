import { TouchableOpacity, View, Text, Image, StatusBar, BackHandler, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import WalletComponent from "./Wallets.Component";
import { THEME } from "@/lib/theme";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { WalletType } from "@/types/wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { formatarValorBr } from "@/utils/FormatCurrent";
import EmptyWallets from "./EmptyComponent";
import { useCategoryStore } from "@/store/useCategoryStore";
import { SkeletonCategoryRow } from "./SkeletonComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function WalletsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const db = useSQLiteContext();
  const { wallets, loadWallets, setActiveWallet, loading, deleteWallet, activeWallet } = useWalletStore();
  const { cleanCategories } = useCategoryStore();
  const { loadTransactions } = useTransactionsStore();

  const handleAddWallet = async(item: WalletType) => {
    await AsyncStorage.setItem('@active_wallet', JSON.stringify(item));
    setActiveWallet(item);
    cleanCategories();
    router.push("/drawer/(tabs)/home");
    StatusBar.setBarStyle(colorScheme === "dark" ? "dark-content" : "light-content");
  }

  const handleDeleteWallet = (wallet: WalletType) => {
    Alert.alert(
      "Deletar Carteira",
      `Tem certeza que deseja deletar a carteira "${wallet.name}"?\n\nEsta ação não pode ser desfeita e todos os dados relacionados serão excluídos permanentemente.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWallet(wallet.id, db);
              // Recarregar transações se necessário
              if (activeWallet.id === wallet.id) {
                const { wallets: updatedWallets } = useWalletStore.getState();
                if (updatedWallets.length > 0) {
                  await loadTransactions(updatedWallets[0].id, db);
                }
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar a carteira. Tente novamente.");
              console.error("Erro ao deletar carteira:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }; 

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      if (db) {
        loadWallets(db);
      }
    }, [colorScheme, db, loadWallets])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; 
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    if (db) {
      loadWallets(db);
    }
  }, [db, loadWallets]);

  const totalSaldo = wallets.reduce((acc, w) => acc + w.balance, 0);

  return (
    <SafeAreaView className="flex-1 p-4 bg-background">
      <View className="rounded-3xl border border-border p-6 mb-8 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="color-foreground text-4xl font-bold mb-3">
            Suas Carteiras
          </Text>
          <Text className="color-foreground text-lg font-medium">Saldo Total</Text>
          <Text className="color-foreground text-3xl font-bold mt-2">
            {loading ? <Skeleton className="h-6 w-32" /> : formatarValorBr(totalSaldo)}
          </Text>
        </View>
      </View>
        <FlatList
          data={wallets}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                key={item.id}
                onPress={() => handleAddWallet(item)}
                activeOpacity={0.7}
              >
                <WalletComponent 
                  amount={item.balance} 
                  title={item.name}
                  isActive={activeWallet.id === item.id}
                  onDelete={() => handleDeleteWallet(item)}
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={loading ? <SkeletonCategoryRow /> : <EmptyWallets />}
        />

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

      <OnboardingModal
        screenKey="wallets"
        title="Carteiras"
        description="Organize suas finanças criando múltiplas carteiras para diferentes propósitos."
        icon="credit-card"
        features={[
          "Crie carteiras separadas para diferentes objetivos (pessoal, trabalho, viagem, etc.)",
          "Cada carteira tem seu próprio saldo e histórico de transações",
          "Toque em uma carteira para torná-la ativa e começar a usar",
          "Visualize o saldo total de todas as suas carteiras no topo",
          "Use o botão + para criar novas carteiras quando precisar"
        ]}
      />
    </SafeAreaView>
  );
}
