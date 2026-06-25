// Vercel serverless function: sends a real Supabase invite email.
// Uses the SECRET service-role key, which must only ever live server-side
// (set as Vercel environment variables, never in the browser bundle).
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    res.status(500).json({ error: 'Invites are not configured yet (missing server keys).' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const email = (body && body.email ? String(body.email) : '').trim();
  const name = body && body.name ? String(body.name) : '';
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  const redirectTo = process.env.APP_URL || 'https://uww.vercel.app';
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name },
    redirectTo,
  });

  if (error) {
    // "already been registered" just means they were invited before — treat as success.
    if (/already.*registered|already.*exists/i.test(error.message)) {
      res.status(200).json({ ok: true, already: true });
      return;
    }
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json({ ok: true });
}
