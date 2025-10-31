import { TouchableOpacity, View, Text, Image, StatusBar, BackHandler } from "react-native";
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

export default function WalletsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const db = useSQLiteContext();
  const { wallets, loadWallets, setActiveWallet, loading } = useWalletStore();
  const { cleanCategories } = useCategoryStore();

  const handleAddWallet = async(item: WalletType) => {
    await AsyncStorage.setItem('@active_wallet', JSON.stringify(item));
    setActiveWallet(item);
    cleanCategories();
    router.push("/drawer/(tabs)/home");
  } 

  useEffect(() => {
    loadWallets(db);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; 
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, [])
  );


  const totalSaldo = wallets.reduce((acc, w) => acc + w.balance, 0);

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
            {loading ? <Skeleton className="h-[35px] w-[110px] rounded-lg"/> : formatarValorBr(totalSaldo)}
          </Text>
        </View>
      </View>
        <FlatList
          data={wallets}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleAddWallet(item)}
            >
              <WalletComponent amount={item.balance} title={item.name} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={loading ? <SkeletonCategoryRow/> : <EmptyWallets />}
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
    </SafeAreaView>
  );
}
