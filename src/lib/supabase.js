import { createClient } from '@supabase/supabase-js';

// Strip all whitespace — Vercel can embed newlines when long values wrap in the UI
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/\s/g, '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
