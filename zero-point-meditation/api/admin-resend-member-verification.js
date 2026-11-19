import { createClient } from '@supabase/supabase-js';

const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app'
]);

function parseBody(body) {
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return body || {};
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const isProjectPreviewOrigin = typeof origin === 'string'
    && /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin);

  if (!origin || (!allowedOrigins.has(origin) && !isProjectPreviewOrigin)) {
    return res.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const authorization = req.headers.authorization || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    return res.status(401).json({ error: 'Administrator sign-in is required.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(503).json({ error: 'Membership authentication is not configured.' });
  }

  const body = parseBody(req.body);
  const memberId = typeof body.memberId === 'string' ? body.memberId.trim() : '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) {
    return res.status(400).json({ error: 'A valid member record is required.' });
  }

  const accessToken = tokenMatch[1];
  const adminClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: { Authorization: 'Bearer ' + accessToken }
    }
  });

  try {
    const { data: authData, error: authError } = await adminClient.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Your administrator session is invalid or expired. Please sign in again.' });
    }

    const { data: adminRecord, error: adminError } = await adminClient
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      if (adminError) console.error('ZPMC admin authorization check failed:', adminError.message);
      return res.status(403).json({ error: 'Only authorized ZPMC administrators can resend verification emails.' });
    }

    const { data: member, error: memberError } = await adminClient
      .from('members')
      .select('id, email, email_confirmed_at, full_name')
      .eq('id', memberId)
      .maybeSingle();

    if (memberError) {
      console.error('ZPMC member lookup failed:', memberError.message);
      return res.status(500).json({ error: 'Could not retrieve the selected member. Confirm the verification migration has been run.' });
    }
    if (!member) {
      return res.status(404).json({ error: 'The selected member record was not found.' });
    }
    if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      return res.status(409).json({ error: 'This member does not have a valid registered email address.' });
    }
    if (member.email_confirmed_at) {
      return res.status(409).json({ error: 'This member has already verified their email address.' });
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const { error: resendError } = await authClient.auth.resend({
      type: 'signup',
      email: member.email,
      options: {
        emailRedirectTo: 'https://www.zeropointmeditationcenter.org/membership'
      }
    });

    if (resendError) {
      console.error('ZPMC verification email resend failed:', resendError.message);
      return res.status(502).json({ error: 'Supabase could not resend the verification email. The account may already be confirmed, or email delivery may be temporarily unavailable.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('ZPMC resend verification handler failed:', error);
    return res.status(500).json({ error: 'Could not resend the member verification email.' });
  }
}
