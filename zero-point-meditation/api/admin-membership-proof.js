import { createClient } from '@supabase/supabase-js';

const BUCKET = 'membership-payment-proofs';
const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app',
]);

function isAllowedOrigin(origin) {
  return Boolean(origin) && (
    allowedOrigins.has(origin) ||
    /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin)
  );
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const authorization = req.headers.authorization || '';
  const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!accessToken) return res.status(401).json({ error: 'Administrator sign-in is required.' });

  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});
  const memberId = typeof body.memberId === 'string' ? body.memberId : '';
  if (!/^[0-9a-f-]{36}$/i.test(memberId)) {
    return res.status(400).json({ error: 'A valid member ID is required.' });
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Secure proof access is not configured.' });

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Your administrator session is invalid or expired.' });
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();
    if (adminError || !admin) return res.status(403).json({ error: 'Administrator access is required.' });

    const { data: memberData, error: memberError } = await supabase.auth.admin.getUserById(memberId);
    if (memberError || !memberData?.user) return res.status(404).json({ error: 'Member account not found.' });

    const path = memberData.user.user_metadata?.payment_proof_path;
    if (typeof path !== 'string' || !path.startsWith('applications/') || path.includes('..')) {
      return res.status(404).json({ error: 'No payment proof is attached to this membership.' });
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60);
    if (signedError) throw signedError;

    return res.status(200).json({ signedUrl: signed.signedUrl });
  } catch (error) {
    console.error('Could not create administrator payment proof link:', error);
    return res.status(502).json({ error: 'Could not open this payment proof. Please try again.' });
  }
}
