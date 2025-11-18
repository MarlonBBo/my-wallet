
import { anotationDatabase } from "@/database/useAnotationDatabase";
import { AnotationDto, AnotationItemDto, AnotationItens, Anotations, AnotationType } from "@/types/anotation";
import { useSQLiteContext } from "expo-sqlite";
import { create } from "zustand";

type AnotationStore = {
  anotations: Anotations;
  loading: boolean;
  itens: AnotationItens;

  loadAnotations: (wallet_id: number,db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  addAnotation: (anotation: AnotationDto, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  loadItens: (anotation_id: number, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  addItem: (item: AnotationItemDto, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  toggleItemCompleted: (id: number, completed: boolean, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  deleteItem: (id: number, anotation_id: number, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  deleteAnotation: (id: number, wallet_id: number, db: ReturnType<typeof useSQLiteContext>) => Promise<void>;
  filterAnotation: (id: number) => Promise<AnotationType>;
}; 

export const useAnotationStore = create<AnotationStore>((set, get) => ({
  anotations: [],
  itens: [],
  loading: false,

  loadAnotations: async (wallet_id, db) => {
    const anotationDb = anotationDatabase(db);
    set({ loading: true });
    try {
      const data = await anotationDb.anotationsList(wallet_id);
      set({ anotations: data, loading: false });
    } catch (error) {
      console.error("Erro ao carregar anotações:", error);
      set({ loading: false });
    }
  },

  addAnotation: async (anotation, db) => {
    const anotationDb = anotationDatabase(db);
    try {
      await anotationDb.saveAnotation(anotation);
      await get().loadAnotations(anotation.wallet_id, db);
      
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  },

  loadItens: async (anotation_id, db) => {
    const anotationDb = anotationDatabase(db);
    set({loading: true});
    try {
      const data = await anotationDb.itemList(anotation_id);
      set({itens: data, loading: false});
    } catch (error) {
      console.error("Erro ao carregar itens: ", error);
      set({loading: false});
    }
  },

  addItem: async (item, db) => {
    const anotationDb = anotationDatabase(db);
    try {
      await anotationDb.saveItem(item);
      await get().loadItens(item.anotation_id, db);
      
    } catch (error) {
      console.error("Erro ao salvar item:", error);
    }
  },

  toggleItemCompleted: async (id, completed, db) => {
  const anotationDb = anotationDatabase(db);
  set({loading: true});
  try {
    await anotationDb.checkItem(id, completed);
    set((state) => ({
      itens: state.itens.map((item) =>
        item.id === id ? { ...item, completed: !!completed } : item
      ),
    loading: false}));

  } catch (error) {
    console.error("Erro ao atualizar item:", error);
  }
},

deleteItem: async (id, anotation_id, db) => {
  const anotationDb = anotationDatabase(db);
  try {
    await anotationDb.deleteItem(id);

    set((state) => ({
      itens: state.itens.filter((item) => item.id !== id)
    }));
     await get().loadItens(anotation_id, db);

  } catch (error) {
    console.error("Erro ao deletar item:", error);
  }
},

deleteAnotation: async (id, wallet_id, db) => {
  const anotationDb = anotationDatabase(db);
  try {
    await anotationDb.deleteAnotation(id);
    await get().loadAnotations(wallet_id, db);
  } catch (error) {
    console.error("Erro ao deletar anotação:", error);
  }
},

filterAnotation: async (id) => {
  const anotations = get().anotations;
  const anotation = anotations.find((a) => a.id === id);
  if (!anotation) {
    throw new Error("Anotação não encontrada");
  }
  return anotation;
}


}));
