import { create } from "zustand";
import { createJSONStorage, persist, type PersistOptions } from "zustand/middleware";

type AuthTokens = {
  accessToken: string;
};

type AuthState = {
  accessToken: string | null;
  isLogin: boolean;
};

type AuthActions = {
  setLogin: (tokens: AuthTokens) => void;
  setLogout: () => void;
};

export type AuthStore = AuthState & AuthActions;

type AuthPersistedState = Pick<AuthState, "accessToken" | "isLogin">;

const initialState: AuthState = {
  accessToken: null,
  isLogin: false,
};

const persistOptions: PersistOptions<AuthStore, AuthPersistedState> = {
  name: "auth-storage",
  storage: createJSONStorage<AuthPersistedState>(() => localStorage),
  partialize: ({ accessToken, isLogin }) => ({
    accessToken,
    isLogin,
  }),
  onRehydrateStorage: state => {
    if (!state) {
      return;
    }

    if (!state.accessToken) {
      state.isLogin = false;
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...initialState,
      setLogin: ({ accessToken }) => set({ accessToken, isLogin: true }),
      setLogout: () => set({ ...initialState }),
    }),
    persistOptions
  )
);
