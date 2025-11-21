import { create } from "zustand";
import { createJSONStorage, persist, type PersistOptions } from "zustand/middleware";

type AuthTokens = {
  accessToken: string;
  refreshToken?: string | null;
  email?: string | null;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isLogin: boolean;
};

type AuthActions = {
  setLogin: (tokens: AuthTokens) => void;
  setLogout: () => void;
};

export type AuthStore = AuthState & AuthActions;

type AuthPersistedState = Pick<AuthState, "accessToken" | "refreshToken" | "email" | "isLogin">;

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  email: null,
  isLogin: false,
};

const persistOptions: PersistOptions<AuthStore, AuthPersistedState> = {
  name: "auth-storage",
  storage: createJSONStorage<AuthPersistedState>(() => localStorage),
  partialize: ({ accessToken, refreshToken, email, isLogin }) => ({
    accessToken,
    refreshToken,
    email,
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
    (set) => ({
      ...initialState,
      setLogin: ({ accessToken, refreshToken, email }) =>
        set((prev) => ({
          accessToken: accessToken ?? prev.accessToken,
          refreshToken:
            typeof refreshToken === "undefined"
              ? prev.refreshToken
              : refreshToken,
          email: typeof email === "undefined" ? prev.email : email,
          isLogin: Boolean(accessToken ?? prev.accessToken),
        })),
      setLogout: () => set({ ...initialState }),
    }),
    persistOptions
  )
);
