import { create } from "zustand";
import type { Category } from "../types/category";

interface RequestsState {
  categoryList: Category[];
  locationList: string[];
  systemOption: any;
  banWords: any[];
  chatMessage: any;
  
  setCategoryList: (list: Category[]) => void;
  setLocationList: (list: string[]) => void;
  setSystemOption: (option: any) => void;
  setBanWords: (words: any[]) => void;
  setChatMessage: (message: any) => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  categoryList: [],
  locationList: [],
  systemOption: null,
  banWords: [],
  chatMessage: null,

  setCategoryList: (list) => set({ categoryList: list }),
  setLocationList: (list) => set({ locationList: list }),
  setSystemOption: (option) => set({ systemOption: option }),
  setBanWords: (words) => set({ banWords: words }),
  setChatMessage: (message) => set({ chatMessage: message }),
}));