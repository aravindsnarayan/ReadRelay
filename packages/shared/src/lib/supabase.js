import { createClient } from '@supabase/supabase-js';
// Environment variables with fallbacks for development
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';
// Type-safe Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
});
// Supabase client factory for custom configurations
export const createSupabaseClient = (url, anonKey, options) => {
    return createClient(url || SUPABASE_URL, anonKey || SUPABASE_ANON_KEY, {
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
// Connection health check
export const checkSupabaseConnection = async () => {
    try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        return !error;
    }
    catch {
        return false;
    }
};
