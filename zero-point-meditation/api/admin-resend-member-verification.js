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
  const action = body.action || 'resend-verification';
  if (!['resend-verification', 'approve-membership'].includes(action)) {
    return res.status(400).json({ error: 'Unsupported administrator action.' });
  }
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
      .select('id, email, email_confirmed_at, full_name, status')
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

    if (action === 'approve-membership') {
      if (!['pending', 'active'].includes(member.status)) {
        return res.status(409).json({ error: 'Only pending applications can be approved. This member is currently ' + member.status + '.' });
      }

      let approvedMember = member;
      if (member.status === 'pending') {
        const { data, error } = await adminClient
          .from('members')
          .update({ status: 'active' })
          .eq('id', memberId)
          .eq('status', 'pending')
          .select('id, full_name, email, status')
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          return res.status(409).json({ error: 'This application changed while it was being reviewed. Refresh the member record and try again.' });
        }
        approvedMember = data;
      }

      const resendKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.BOOKING_FROM_EMAIL;
      if (!resendKey || !fromEmail) {
        return res.status(200).json({
          ok: true,
          emailSent: false,
          emailWarning: 'Membership is active, but the confirmation email service is not configured. Please contact the site administrator.',
          member: approvedMember,
        });
      }

      const emailText = [
        'Hello ' + (approvedMember.full_name || 'ZPMC member') + ',',
        '',
        'Your payment has been reviewed and your Zero Point Meditation Center community membership is now approved and active.',
        '',
        'You can sign in to your membership account to view your membership card and benefits:',
        'https://www.zeropointmeditationcenter.org/membership',
        '',
        'Thank you for supporting Zero Point Meditation Center.',
        '',
        'With warm regards,',
        'Zero Point Meditation Center',
      ].join('\n');

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [approvedMember.email],
          subject: 'Your ZPMC membership has been approved',
          text: emailText,
        }),
      });

      if (!emailResponse.ok) {
        const detail = await emailResponse.text();
        console.error('ZPMC membership approval email failed:', emailResponse.status, detail.slice(0, 300));
        return res.status(200).json({
          ok: true,
          emailSent: false,
          emailWarning: 'Membership is active, but the confirmation email could not be sent. Please contact the site administrator to arrange delivery.',
          member: approvedMember,
        });
      }

      return res.status(200).json({ ok: true, emailSent: true, member: approvedMember });
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
