import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
export declare const supabase: SupabaseClient<Database>;
export declare const createSupabaseClient: (
  url?: string,
  anonKey?: string,
  options?: Record<string, unknown>
) => SupabaseClient<Database>;
export type { Database, SupabaseClient };
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
};
export declare const checkSupabaseConnection: () => Promise<boolean>;
//# sourceMappingURL=supabase.d.ts.map
