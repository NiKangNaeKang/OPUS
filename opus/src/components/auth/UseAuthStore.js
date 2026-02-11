import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      member: null,
      isLoggedIn: false,

      login: (data) => {
        set({
          isLoggedIn: true,
          token: data.token,
          member: data.member,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          token: null,
          member: null,
        });
        localStorage.removeItem("auth-storage"); // persist 이름과 동일하게
      },
    }),
    {
      name: "auth-storage", // 로컬스토리지 저장 키
    }
  )
);