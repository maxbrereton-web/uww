import { createClient } from '@supabase/supabase-js';

// These two values are public by design — Supabase "publishable" keys and the
// project URL are meant to ship in the browser; access is controlled by Row
// Level Security policies on the database, not by hiding the key.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://spblobwslyextdqavpdp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Voy_QlgpoyrTy92m9RwaNg_HuKKG8PB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
