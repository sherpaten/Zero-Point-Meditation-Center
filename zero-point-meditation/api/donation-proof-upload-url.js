import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const BUCKET = 'membership-payment-proofs';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app',
]);

function isAllowedOrigin(origin) {
  return Boolean(origin) && (allowedOrigins.has(origin) ||
    /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  if (!isAllowedOrigin(req.headers.origin)) return res.status(403).json({ error: 'Request origin is not allowed.' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const size = Number(body.size);
  if (!MIME_TYPES.has(contentType)) return res.status(400).json({ error: 'Upload a JPG, PNG, WebP, or PDF receipt.' });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) return res.status(400).json({ error: 'The payment proof must be no larger than 10 MB.' });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Secure donation upload is not configured.' });
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    const extension = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' })[contentType];
    const path = `donations/${randomUUID()}.${extension}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error) throw error;
    return res.status(200).json({ path, token: data.token });
  } catch (error) {
    console.error('Could not prepare secure donation proof upload:', error);
    return res.status(502).json({ error: 'Could not prepare the secure upload. Please try again.' });
  }
}
