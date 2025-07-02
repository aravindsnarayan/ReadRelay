import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@readrelay/shared/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    set => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: user =>
        set(
          state => ({
            ...state,
            user,
            isAuthenticated: !!user,
          }),
          false,
          'setUser'
        ),

      setProfile: profile =>
        set(
          state => ({
            ...state,
            profile,
          }),
          false,
          'setProfile'
        ),

      setLoading: isLoading =>
        set(
          state => ({
            ...state,
            isLoading,
          }),
          false,
          'setLoading'
        ),

      clearAuth: () =>
        set(
          {
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          },
          false,
          'clearAuth'
        ),
    }),
    {
      name: 'auth-store',
    }
  )
);
