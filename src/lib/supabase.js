import { createClient } from '@supabase/supabase-js';

// Updated for Vite environment variable loading
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add a quick safeguard check to warn you if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Initialization Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keeps your UI smooth for standard email/password admin logins
    detectSessionInUrl: false,
  }
});