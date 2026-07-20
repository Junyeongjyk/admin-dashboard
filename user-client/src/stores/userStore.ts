import { create } from "zustand";
import type { UserItem } from "../types/user.type";

interface UserState {
  userInfo: UserItem | null;
  hasCookie: boolean;
  setUserInfo: (info: UserItem | null) => void;
  setHasCookie: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  hasCookie: false,
  setUserInfo: (info) => set({ userInfo: info }),
  setHasCookie: (status) => set({ hasCookie: status }),
}));