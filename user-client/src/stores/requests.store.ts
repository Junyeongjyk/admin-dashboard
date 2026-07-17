import { create } from "zustand";
import type { Category } from "../types/category";

// 시스템 옵션 및 채팅 메시지의 JSON 구조를 표현하기 위한 안전한 객체 타입 정의
type JsonObject = Record<string, unknown>;

interface RequestsState {
  categoryList: Category[];
  locationList: string[];
  // [해결] any 제거: 시스템 옵션은 객체 형태이므로 JsonObject 또는 null 지정
  systemOption: JsonObject | null;
  // [해결] any 제거: 금지어는 보통 문자열 배열이므로 string[]으로 지정
  banWords: string[];
  // [해결] any 제거: 채팅 메시지는 dynamic object이므로 JsonObject 또는 null 지정
  chatMessage: JsonObject | null;
  
  setCategoryList: (list: Category[]) => void;
  setLocationList: (list: string[]) => void;
  setSystemOption: (option: JsonObject) => void;
  setBanWords: (words: string[]) => void;
  setChatMessage: (message: JsonObject) => void;
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