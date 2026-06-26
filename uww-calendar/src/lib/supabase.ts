import { createClient } from '@supabase/supabase-js';

// These two values are public by design — Supabase "publishable" keys and the
// project URL are meant to ship in the browser; access is controlled by Row
// Level Security policies on the database, not by hiding the key.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://spblobwslyextdqavpdp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Voy_QlgpoyrTy92m9RwaNg_HuKKG8PB';

// Captured BEFORE the client below consumes & clears the URL hash: true when the
// page was opened from a Supabase invite / password-set email link.
export const INVITE_FLOW =
  typeof window !== 'undefined' && /[#&?]type=(invite|recovery|signup)/.test(window.location.hash + window.location.search);

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Upload a chat attachment to Supabase Storage and return a small public URL.
 * (Storing files as base64 in the message blew past Realtime's payload limit,
 * which made attachments arrive blank on the other device.)
 */
export async function uploadAttachment(file: File): Promise<{ name: string; url: string } | null> {
  try {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}_${safe}`;
    const { error } = await supabase.storage.from('chat-attachments').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) return null;
    const { data } = supabase.storage.from('chat-attachments').getPublicUrl(path);
    return { name: file.name, url: data.publicUrl };
  } catch {
    return null;
  }
}
