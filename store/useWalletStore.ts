import { walletDatabase } from "@/database/useWalletDatabase";
import { WalletDto, Wallets, WalletType } from "@/types/wallet";
import { useSQLiteContext } from "expo-sqlite";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WalletStore = {
  wallets: Wallets;
  activeWallet: WalletType;
  loading: boolean;
  setActiveWallet: (wallet: WalletType) => void;
  loadWallets: (db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  addWallet: (wallet: WalletDto, db: ReturnType<typeof useSQLiteContext>) => Promise<WalletType | void>;
  deleteWallet: (walletId: number, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
};

const defaultWallet: WalletType = {
  id: 0,
  name: "Default Wallet",
  balance: 0
};

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallets: [],
  loading: false,
  activeWallet: defaultWallet,

  setActiveWallet: (wallet) => set({ activeWallet: wallet }),

  loadWallets: async (db) => {
    const walletDb = walletDatabase(db);
    set({ loading: true });
    try {
      const data = await walletDb.listarCarteiras();
      set({ wallets: data, loading: false });
      const { activeWallet } = get();
      const updatedActive = data.find(w => w.id === activeWallet.id);
      if (updatedActive) {
        set({ activeWallet: updatedActive });
      }
    } catch (error) {
      console.error("Erro ao carregar carteiras:", error);
      set({ loading: false });
    }
  },

  addWallet: async (wallet, db) => {
    const walletDb = walletDatabase(db);
    try {
      await walletDb.salvarCarteira(wallet);
      await get().loadWallets(db);
      const wallets = get().wallets;
      const newWallet = wallets.find(w => w.name === wallet.name);
      if (newWallet) {
        get().setActiveWallet(newWallet);
      }
    } catch (error) {
      console.error("Erro ao salvar carteira:", error);
    }
  },

  deleteWallet: async (walletId, db) => {
    const walletDb = walletDatabase(db);
    try {
      const { activeWallet } = get();
      
      // Deletar a carteira (o CASCADE vai deletar tudo relacionado automaticamente)
      await walletDb.deletarCarteira(walletId);
      
      // Recarregar as carteiras
      await get().loadWallets(db);
      
      // Se a carteira deletada era a ativa, selecionar outra ou limpar
      if (activeWallet.id === walletId) {
        const { wallets } = get();
        if (wallets.length > 0) {
          // Selecionar a primeira carteira disponível
          get().setActiveWallet(wallets[0]);
          await AsyncStorage.setItem('@active_wallet', JSON.stringify(wallets[0]));
        } else {
          // Se não houver mais carteiras, resetar para a padrão
          get().setActiveWallet(defaultWallet);
          await AsyncStorage.removeItem('@active_wallet');
        }
      }
    } catch (error) {
      console.error("Erro ao deletar carteira:", error);
      throw error;
    }
  },
}));