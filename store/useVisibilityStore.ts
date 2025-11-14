import { create } from "zustand";

type VisibilityStore = {
  valuesVisible: boolean;
  toggleValuesVisibility: () => void;
};

export const useVisibilityStore = create<VisibilityStore>((set) => ({
  valuesVisible: true,
  toggleValuesVisibility: () => set((state) => ({ valuesVisible: !state.valuesVisible })),
}));

