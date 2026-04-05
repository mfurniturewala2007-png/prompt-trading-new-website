import { createClient } from '@supabase/supabase-js'

// Grabbing the keys from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy-url-prevent-crash.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
