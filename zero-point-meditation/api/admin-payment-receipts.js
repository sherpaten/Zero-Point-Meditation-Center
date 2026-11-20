import { createClient } from '@supabase/supabase-js';

const BUCKET = 'membership-payment-proofs';
const allowedOrigins = new Set(['https://www.zeropointmeditationcenter.org','https://zeropointmeditationcenter.org','https://zero-point-meditation-center.vercel.app']);
const isAllowedOrigin = (origin) => Boolean(origin) && (allowedOrigins.has(origin) || /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin));
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

function receiptHtml(record) {
  return `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,sans-serif;color:#292524"><div style="max-width:680px;margin:24px auto;background:#fff;border:1px solid #e7e5e4;border-radius:14px;overflow:hidden"><header style="background:#6b2636;color:#fff;padding:28px"><h1 style="margin:0;font-family:Georgia,serif">Zero Point Meditation Center Inc.</h1><p style="margin:8px 0 0">Official payment receipt</p></header><main style="padding:28px"><div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><p style="color:#78716c;margin:0">Receipt number</p><h2 style="margin:6px 0 0">${escapeHtml(record.receipt_number)}</h2></div><div><p style="color:#78716c;margin:0">Payment date</p><h3 style="margin:6px 0 0">${escapeHtml(formatDate(record.verified_at || new Date().toISOString()))}</h3></div></div><hr style="border:0;border-top:1px solid #e7e5e4;margin:24px 0"><p><strong>Received from:</strong> ${escapeHtml(record.payer_name)}</p><p><strong>Email:</strong> ${escapeHtml(record.payer_email)}</p><p><strong>Payment type:</strong> ${record.payment_type === 'membership' ? 'Membership' : 'Donation'}</p>${record.membership_plan ? `<p><strong>Membership plan:</strong> ${escapeHtml(record.membership_plan)}</p>` : ''}${record.purpose ? `<p><strong>Purpose:</strong> ${escapeHtml(record.purpose)}</p>` : ''}<p><strong>Payment method:</strong> ${escapeHtml(record.payment_method)}</p><div style="margin-top:24px;padding:20px;background:#faf7ed;border-radius:10px"><p style="margin:0;color:#78716c">Amount received</p><h1 style="margin:8px 0 0;color:#6b2636">${escapeHtml(record.currency)} ${Number(record.amount).toFixed(2)}</h1></div><p style="margin-top:28px">This receipt confirms that Zero Point Meditation Center Inc. has recorded the payment above as received.</p><p style="margin-top:28px">With gratitude,<br><strong>Zero Point Meditation Center Inc.</strong><br>https://www.zeropointmeditationcenter.org</p></main></div></body></html>`;
}

async function sendReceipt(record) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !from) throw new Error('Receipt email is not configured.');
  const html = receiptHtml(record);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [record.payer_email],
      subject: 'Your official ZPMC payment receipt — ' + record.receipt_number,
      html,
      text: [
        'Zero Point Meditation Center Inc. — Official Payment Receipt',
        'Receipt number: ' + record.receipt_number,
        'Payment date: ' + formatDate(record.verified_at),
        'Received from: ' + record.payer_name,
        'Payment type: ' + record.payment_type,
        record.membership_plan ? 'Membership plan: ' + record.membership_plan : '',
        record.purpose ? 'Purpose: ' + record.purpose : '',
        'Payment method: ' + record.payment_method,
        'Amount received: ' + record.currency + ' ' + Number(record.amount).toFixed(2),
        '',
        'This receipt confirms that ZPMC has recorded the payment as received.'
      ].filter(Boolean).join('\n')
    })
  });
  if (!response.ok) throw new Error('Email provider could not send the receipt.');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET','POST'].includes(req.method)) { res.setHeader('Allow','GET, POST'); return res.status(405).json({ error:'Method not allowed.' }); }
  const origin = req.headers.origin;
  if ((origin && !isAllowedOrigin(origin)) || (req.method === 'POST' && !origin)) return res.status(403).json({ error:'Request origin is not allowed.' });
  const authorization = req.headers.authorization || '';
  const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!accessToken) return res.status(401).json({ error:'Administrator sign-in is required.' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error:'Payment administration is not configured.' });

  try {
    const supabase = createClient(url, key, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) return res.status(401).json({ error:'Your administrator session is invalid or expired.' });
    const { data: admin, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', authData.user.id).maybeSingle();
    if (adminError || !admin) return res.status(403).json({ error:'Administrator access is required.' });

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('payment_records').select('id, source_ref, payment_type, payer_name, payer_email, amount, currency, payment_method, purpose, membership_plan, member_id, payment_proof_path, status, receipt_number, admin_notes, created_at, verified_at, receipt_email_sent_at').order('created_at', { ascending:false }).limit(250);
      if (error) throw error;
      return res.status(200).json({ records:data || [] });
    }

    const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
    const id = clean(body.id, 50);
    const action = clean(body.action, 20);
    if (!/^[0-9a-f-]{36}$/i.test(id) || !['issue','reject','resend','proof'].includes(action)) return res.status(400).json({ error:'A valid payment and action are required.' });
    const { data: current, error: findError } = await supabase.from('payment_records').select('*').eq('id',id).maybeSingle();
    if (findError) throw findError;
    if (!current) return res.status(404).json({ error:'Payment record not found.' });

    if (action === 'proof') {
      const path = current.payment_proof_path;
      if (typeof path !== 'string' || !path || path.includes('..')) return res.status(404).json({ error:'No payment proof is attached to this record.' });
      const { data: signed, error: signedError } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
      if (signedError) throw signedError;
      return res.status(200).json({ signedUrl:signed.signedUrl });
    }

    if (action === 'reject') {
      if (current.status === 'paid') return res.status(409).json({ error:'A paid receipt cannot be rejected. Contact the administrator responsible for financial records.' });
      const { data, error } = await supabase.from('payment_records').update({ status:'rejected', admin_notes:clean(body.notes,1000) || null }).eq('id',id).select('*').single();
      if (error) throw error;
      return res.status(200).json({ record:data });
    }

    let record = current;
    if (action === 'issue') {
      if (current.status === 'rejected') return res.status(409).json({ error:'This payment was rejected. It cannot receive a paid receipt.' });
      if (current.status !== 'paid') {
        const now = new Date().toISOString();
        const receiptNumber = 'ZPMC-' + now.slice(0,10).replace(/-/g,'') + '-' + id.slice(0,8).toUpperCase();
        const { data, error } = await supabase.from('payment_records').update({ status:'paid', verified_at:now, receipt_number:receiptNumber, admin_notes:clean(body.notes,1000) || null }).eq('id',id).eq('status','pending').select('*').maybeSingle();
        if (error) throw error;
        if (!data) {
          const { data: refreshed, error: refreshError } = await supabase.from('payment_records').select('*').eq('id',id).single();
          if (refreshError) throw refreshError;
          record = refreshed;
        } else record = data;
      }
    }
    if (record.status !== 'paid' || !record.receipt_number) return res.status(409).json({ error:'Only verified payments can receive an official receipt.' });
    try {
      await sendReceipt(record);
      const { data: updated, error: updateError } = await supabase.from('payment_records').update({ receipt_email_sent_at:new Date().toISOString() }).eq('id',id).select('*').single();
      if (updateError) throw updateError;
      return res.status(200).json({ record:updated, emailSent:true });
    } catch (emailError) {
      console.error('ZPMC receipt email failed:', emailError);
      return res.status(200).json({ record, emailSent:false, warning:'Payment is marked paid and receipt number created, but email delivery failed. Use Resend to try again.' });
    }
  } catch (error) {
    console.error('Payment receipt administration failed:', error);
    return res.status(502).json({ error:error.message || 'Could not process payment receipts.' });
  }
}
