import { create } from "zustand";
import type { BanWords, SystemOption } from "src/types/system.type";

interface SystemState {
  systemOption: SystemOption | undefined;
  banWords: BanWords[] | undefined;
  setSystemOption: (option: SystemOption) => void;
  setBanWords: (words: BanWords[]) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  systemOption: undefined,
  banWords: undefined,
  setSystemOption: (option) => set({ systemOption: option }),
  setBanWords: (words) => set({ banWords: words }),
}));