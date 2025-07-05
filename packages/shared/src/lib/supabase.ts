import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { getSupabaseConfig } from '../utils/env';

// Get validated Supabase configuration
const { url: SUPABASE_URL, key: SUPABASE_ANON_KEY } = getSupabaseConfig();

// Type-safe Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Supabase client factory for custom configurations
export const createSupabaseClient = (
  url?: string,
  anonKey?: string,
  options?: Record<string, unknown>
): SupabaseClient<Database> => {
  // Use provided values or fall back to validated environment config
  const config = url && anonKey ? { url, key: anonKey } : getSupabaseConfig();

  return createClient<Database>(config.url, config.key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    ...options,
  });
};

// Export types for external use
export type { Database, SupabaseClient };
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
};

// Connection health check
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};
