import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSQLiteContext } from "expo-sqlite";
import { WalletType } from "@/types/wallet";
import { useWalletStore } from "@/store/useWalletStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { View, ActivityIndicator } from "react-native";

export default function InitialScreen() {
  const [loading, setLoading] = useState(true);

  const db = useSQLiteContext();
  const { setActiveWallet, activeWallet } = useWalletStore();
  const { loadTransactions } = useTransactionsStore();

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const stored = await AsyncStorage.getItem("@active_wallet");

        if (stored) {
          const parsed: WalletType = JSON.parse(stored);

          const walletFromDb = await db.getFirstAsync<WalletType>(
            "SELECT * FROM wallets WHERE id = ?",
            [parsed.id]
          );

          if (walletFromDb) {
            setActiveWallet(walletFromDb);
            await loadTransactions(walletFromDb.id, db);
          }
        }
      } catch (e) {
        console.log("Erro ao carregar carteira", e);
      } finally {
        setLoading(false);
      }
    };

    if (db) loadWallet();
  }, [db]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (activeWallet?.id) {
    return <Redirect href="/drawer/(tabs)/home" />;
  }else{
    return <Redirect href={"/drawer/wallets" as any} />;
  }
}

