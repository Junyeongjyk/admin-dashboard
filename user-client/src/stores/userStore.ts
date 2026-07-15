import { create } from "zustand";
import type { UserItem } from "../types/user.type";

interface UserState {
  userInfo: UserItem | null;
  isLoggedIn: boolean;
  setUserInfo: (info: UserItem | null) => void;
  setIsLoggedIn: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  isLoggedIn: false,
  setUserInfo: (info) => set({ userInfo: info }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));