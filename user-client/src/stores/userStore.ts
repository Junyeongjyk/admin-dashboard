import { create } from 'zustand';
import type { UserItem } from "src/types/user.type";

// 스토어의 데이터(State)와 수정 함수(Actions)의 타입을 정의합니다.
interface UserState {
    userInfo: UserItem | null;
    // Svelte의 set/update 대신 setUserInfo 함수를 사용합니다.
    setUserInfo: (user: UserItem | null) => void;
    clearUserInfo: () => void;
}

export const userStore = create<UserState>((set) => ({
    // 초기값 (Svelte의 writable(null)과 동일)
    userInfo: null,

    // 상태 업데이트 함수
    setUserInfo: (user) => set({ userInfo: user }),
    
    // 로그아웃 등을 위한 초기화 함수
    clearUserInfo: () => set({ userInfo: null }),
}));