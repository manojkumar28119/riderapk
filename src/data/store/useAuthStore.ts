import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  sessionExpiry: string | null;
  tokenExpiry: number | null;
  lastActivityTime: number;
  setAccessToken: (token: string) => void;
  setSessionExpiry: (expiry: string) => void;
  setTokenExpiry: (expiry: number) => void;
  setLastActivityTime: (time: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  sessionExpiry: null,
  tokenExpiry: null,
  lastActivityTime: Date.now(),
  setAccessToken: (token) => set({ accessToken: token }),
  setSessionExpiry: (expiry) => set({ sessionExpiry: expiry }),
  setTokenExpiry: (expiry) => set({ tokenExpiry: expiry }),
  setLastActivityTime: (time) => set({ lastActivityTime: time }),
  clearAuth: () => set({ accessToken: null, sessionExpiry: null, tokenExpiry: null }),
}));
