import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      member: null,
      isLoggedIn: null,

      login: (data) => {
        set((state) => ({
          ...state, // 기존 카트 데이터 유지
          isLoggedIn: true,
          token: data.token,
          member: data.member,
        }));
      },

      logout: () => {
        set((state) => ({
          ...state, 
          isLoggedIn: false,
          token: null,
          member: null,
          items: [],         // 로그아웃 시 장바구니 초기화
          checkedKeys: [],    // 체크 항목 초기화
          hasMerged: false,   // 병합 플래그 초기화
        }));
      },
    }),
    {
      name: "auth-storage",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState),
      }),
    }
  )
);