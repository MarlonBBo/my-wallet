import { TransactionDto, Transactions } from "@/types/transactions";
import { useSQLiteContext } from "expo-sqlite";
import { create } from "zustand";
import { useCategoryStore } from "./useCategoryStore";
import { useWalletStore } from "./useWalletStore";
import { transactionDatabase } from "@/database/useTransactionDatabase";

type TransactionsStore = {
  transactions: Transactions;
  loading: boolean;

  loadTransactions: (wallet_id: number,db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  addTransaction: (transaction: TransactionDto, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  deleteTransaction: (id: number, wallet_id: number, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  filterType: (type: 'income' | 'expense') => number;
  filterByDate: (date: string, type: 'income' | 'expense') => number ;
  TransactionsByCategory: (wallet_id: number, category_id: number, db: ReturnType<typeof useSQLiteContext>) => Promise<Transactions | null>;
}

export const useTransactionsStore = create<TransactionsStore>((set, get) => ({
  transactions: [],
  loading: false,

  loadTransactions: async (wallet_id, db) => {
    const transactionDb = transactionDatabase(db);
    set({ loading: true });
    try {
      const data = await transactionDb.TransactionsList(wallet_id);
      const dataSort = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ transactions: dataSort, loading: false });
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      set({ loading: false });
    }
  },

  addTransaction: async (transaction, db) => {
    const transactionDb = transactionDatabase(db);
    try {
      await transactionDb.saveTransaction(transaction);
      await get().loadTransactions(transaction.walletId, db);

      const { loadWallets } = useWalletStore.getState();
      await loadWallets(db);

      const { loadCategorys } = useCategoryStore.getState();
      await loadCategorys(transaction.walletId, db);

      console.log("Transação adicionada com sucesso: ", transaction);
      
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  },

  deleteTransaction: async (id, wallet_id, db) => {
    const transactionDb = transactionDatabase(db);
    try {
      // Buscar a transação antes de deletar para obter os dados necessários
      const transaction = await db.getFirstAsync<{category_id: number, value: number, type: string}>(
        "SELECT category_id, value, type FROM transactions WHERE id = ?",
        [id]
      );

      if (!transaction) {
        throw new Error("Transação não encontrada");
      }

      await transactionDb.deleteTransaction(id);
      
      // Recarregar transações
      await get().loadTransactions(wallet_id, db);

      // Recarregar carteira
      const { loadWallets } = useWalletStore.getState();
      await loadWallets(db);

      // Recarregar categorias
      const { loadCategorys } = useCategoryStore.getState();
      await loadCategorys(wallet_id, db);
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    }
  },


  filterType: (type: 'income' | 'expense') => {
    return get().transactions.reduce((acc, transaction) => {
      return transaction.type === type ? acc + transaction.value : acc;
    }, 0);
  },

  filterByDate: (date: string, type: 'income' | 'expense') => {
    let target = "";
    try {
      target = new Date(date).toISOString().split("T")[0];
    } catch {
      return 0; 
    }

    return get().transactions.reduce((acc, t) => {
      if (!t.created_at) return acc; 

      let transDate = "";
      try {
        transDate = new Date(t.created_at).toISOString().split("T")[0];
      } catch {
        return acc; 
      }

      if (transDate === target && t.type === type) {
        return acc + t.value;
      }
      return acc;
    }, 0);
  },

  TransactionsByCategory: async (wallet_id, category_id, db) => {
    const transactionDb = transactionDatabase(db);
    set({ loading: true });
    try {
      const data = await transactionDb.TransactionsByCategory(wallet_id, category_id);
      if (data.length > 0) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao carregar transações por categoria:", error);
      set({ loading: false });
      return null;
    }
  }
}));
