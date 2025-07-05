'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';
import { logoutUser as logout } from '@readrelay/shared/api/auth';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@readrelay/shared/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    user,
    profile,
    setUser,
    setProfile,
    setLoading: setStoreLoading,
    clearAuth,
  } = useAuthStore();
  const supabase = createClient();

  const signOut = async () => {
    try {
      await logout();
      clearAuth();
      router.push('/auth/login');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing out:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (session?.user) {
        setUser(session.user);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error refreshing auth:', error);
      clearAuth();
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          setUser(session.user);

          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            if (profileError.code !== 'PGRST116') {
              // Not found error
              throw profileError;
            }
          } else if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        // Log error silently
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        setStoreLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);

        // Fetch user profile
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (profileData) {
            setProfile(profileData);
          }
        } catch (error) {
          // Handle error silently
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
      setStoreLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, setProfile, setStoreLoading]);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
