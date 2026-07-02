import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '@ferramenta/shared';

interface AuthState {
  user: LoginResponse['user'] | null;
  tokens: { accessToken: string; refreshToken: string } | null;
  tenants: LoginResponse['tenants'];
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginResponse) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      tenants: [],
      isAuthenticated: false,
      isLoading: false,

      login: (data) =>
        set({
          user: data.user,
          tokens: data.tokens,
          tenants: data.tenants,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          tenants: [],
          isAuthenticated: false,
        }),

      setTokens: (tokens) => set({ tokens }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'ferramenta-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        tenants: state.tenants,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);