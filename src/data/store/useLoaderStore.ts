import { create } from "zustand";

interface LoaderState {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  setLoading: (state) => set({ isLoading: state }),
}));
