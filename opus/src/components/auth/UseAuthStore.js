import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,


      login: ({ token, user }) => {
        set({
          isLoggedIn: true,
          token,
          user,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          token: null,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
