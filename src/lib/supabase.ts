import { createClient } from '@supabase/supabase-js';

// استفاده از مقادیر پیش‌فرض برای توسعه محلی
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// بررسی وجود متغیرهای محیطی
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Export configuration status
export const supabaseConfig = {
  isConfigured: isSupabaseConfigured,
  url: SUPABASE_URL,
  hasValidUrl: SUPABASE_URL !== 'https://placeholder.supabase.co',
  hasValidKey: SUPABASE_ANON_KEY !== 'placeholder-key'
};