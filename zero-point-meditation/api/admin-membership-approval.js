import { createClient } from '@supabase/supabase-js';

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
  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const authorization = req.headers.authorization || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return res.status(401).json({ error: 'Administrator sign-in is required.' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!supabaseUrl || !anonKey) {
    return res.status(503).json({ error: 'Membership authentication is not configured.' });
  }

  const memberId = typeof parseBody(req.body).memberId === 'string'
    ? parseBody(req.body).memberId.trim()
    : '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) {
    return res.status(400).json({ error: 'A valid member ID is required.' });
  }

  const accessToken = tokenMatch[1];
  const adminClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: 'Bearer ' + accessToken } },
  });

  try {
    const { data: authData, error: authError } = await adminClient.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Your administrator session is invalid or expired.' });
    }

    const { data: adminRecord, error: adminError } = await adminClient
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();
    if (adminError || !adminRecord) {
      return res.status(403).json({ error: 'Only authorized ZPMC administrators can approve memberships.' });
    }

    const { data: member, error: memberError } = await adminClient
      .from('members')
      .select('id, full_name, email, status')
      .eq('id', memberId)
      .maybeSingle();
    if (memberError) throw memberError;
    if (!member) return res.status(404).json({ error: 'The membership application was not found.' });
    if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      return res.status(409).json({ error: 'The applicant does not have a valid registered email address.' });
    }
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
      if (!data) return res.status(409).json({ error: 'This application changed while it was being reviewed. Refresh the member record and try again.' });
      approvedMember = data;
    }

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
  } catch (error) {
    console.error('ZPMC membership approval failed:', error);
    return res.status(500).json({ error: 'Could not approve this membership. Please refresh and try again.' });
  }
}
