import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize with environment variables
let supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const initializeSupabase = (shopName: string) => {
  // Re-initialize with the same credentials
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
};

export { supabase };