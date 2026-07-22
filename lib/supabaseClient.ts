import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

if (supabaseUrl === 'https://dummy.supabase.co') {
  console.warn("⚠️ Missing Supabase environment variables! Using dummy values to prevent build crash. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting provider.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
