import { categoryDatabase } from "@/database/useCategoryDatabase";
import { Categories, CategoryDto, CategoryType } from "@/types/category";
import { useSQLiteContext } from "expo-sqlite";
import { create } from "zustand";
import { useTransactionsStore } from "./useTransactionStore";

type CategoryStore = {
  categories: Categories;
  filteredCategories: Categories;
  loading: boolean;

  loadCategorys: (
    wallet_id: number,
    db: ReturnType<typeof useSQLiteContext>
  ) => Promise<void>;
  addCategory: (
    category: CategoryDto,
    db: ReturnType<typeof useSQLiteContext>
  ) => Promise<void>;
  filterCategories: (type: string) => void;
  filterCategoryById: (id: number) => CategoryType | undefined;
  cleanCategories: () => void;
  deleteCategory: (
    id: number,
    wallet_id: number,
    db: ReturnType<typeof useSQLiteContext>
  ) => Promise<void>;
  updateCategoryTitle: (
    id: number,
    title: string,
    wallet_id: number,
    db: ReturnType<typeof useSQLiteContext>
  ) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  filteredCategories: [],
  loading: false,

  loadCategorys: async (wallet_id: number, db) => {
    const categoryDb = categoryDatabase(db);
    set({ loading: true });
    try {
      const data = await categoryDb.CategoryList(wallet_id);
      set({ categories: data, filteredCategories: data, loading: false }); 
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      set({ loading: false });
    }
  },

  addCategory: async (category: CategoryDto, db) => {
    if(!db){
      console.log("db não iniciado: ", db)
      return
    }

    const categoryDb = categoryDatabase(db);
    try {
      await categoryDb.saveCategory(category);
      await get().loadCategorys(category.wallet_id, db); 
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  },

  filterCategories: (type: string) => {
  const all = get().categories;

  if (type === "all") {
    set({ filteredCategories: all });
  } else {
    set({ filteredCategories: all.filter((c) => c.type === type) });
  }
},

  filterCategoryById: (id: number) => {
    const all = get().categories;
    const category = all.find((c) => c.id === id);
    return category;
  },

  cleanCategories: () => {
    set({ categories: [], filteredCategories: [] });
  },

  deleteCategory: async (id: number, wallet_id: number, db) => {
    const categoryDb = categoryDatabase(db);
    try {
      await categoryDb.deleteCategory(id);
      await get().loadCategorys(wallet_id, db);
      
      // Recarregar transações para atualizar a lista
      const { loadTransactions } = useTransactionsStore.getState();
      await loadTransactions(wallet_id, db);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
  },

  updateCategoryTitle: async (id: number, title: string, wallet_id: number, db) => {
    const categoryDb = categoryDatabase(db);
    try {
      await categoryDb.updateCategoryTitle(id, title);
      await get().loadCategorys(wallet_id, db);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  },
}));
