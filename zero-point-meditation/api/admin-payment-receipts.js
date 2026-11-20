import { createClient } from '@supabase/supabase-js';

const BUCKET = 'membership-payment-proofs';
const allowedOrigins = new Set(['https://www.zeropointmeditationcenter.org','https://zeropointmeditationcenter.org','https://zero-point-meditation-center.vercel.app']);
const isAllowedOrigin = (origin) => Boolean(origin) && (allowedOrigins.has(origin) || /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin));
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

function receiptHtml(record) {
  return `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,sans-serif;color:#292524"><div style="max-width:680px;margin:24px auto;background:#fff;border:1px solid #e7e5e4;border-radius:14px;overflow:hidden"><header style="background:#6b2636;color:#fff;padding:28px"><h1 style="margin:0;font-family:Georgia,serif">Zero Point Meditation Center Inc.</h1><p style="margin:8px 0 0">${record.payment_type === "donation" ? "Official donation receipt" : record.payment_type === "merchandise" ? "Official merchandise purchase receipt" : "Official membership payment receipt"}</p></header><main style="padding:28px"><div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><p style="color:#78716c;margin:0">Receipt number</p><h2 style="margin:6px 0 0">${escapeHtml(record.receipt_number)}</h2></div><div><p style="color:#78716c;margin:0">Payment date</p><h3 style="margin:6px 0 0">${escapeHtml(formatDate(record.verified_at || new Date().toISOString()))}</h3></div></div><hr style="border:0;border-top:1px solid #e7e5e4;margin:24px 0"><p><strong>Received from:</strong> ${escapeHtml(record.payer_name)}</p><p><strong>Email:</strong> ${escapeHtml(record.payer_email)}</p><p><strong>Payment type:</strong> ${record.payment_type === 'membership' ? 'Membership' : record.payment_type === 'merchandise' ? 'Merchandise' : 'Donation'}</p>${record.membership_plan ? `<p><strong>Membership plan:</strong> ${escapeHtml(record.membership_plan)}</p>` : ''}${record.purpose ? `<p><strong>Purpose:</strong> ${escapeHtml(record.purpose)}</p>` : ''}<p><strong>Payment method:</strong> ${escapeHtml(record.payment_method)}</p><div style="margin-top:24px;padding:20px;background:#faf7ed;border-radius:10px"><p style="margin:0;color:#78716c">Amount received</p><h1 style="margin:8px 0 0;color:#6b2636">${escapeHtml(record.currency)} ${Number(record.amount).toFixed(2)}</h1></div><p style="margin-top:28px">This receipt confirms that Zero Point Meditation Center Inc. has recorded the payment above as received.</p><p style="margin-top:28px">With gratitude,<br><strong>Zero Point Meditation Center Inc.</strong><br>https://www.zeropointmeditationcenter.org</p></main></div></body></html>`;
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
      subject: (record.payment_type === 'donation' ? 'Your ZPMC donation receipt — ' : record.payment_type === 'merchandise' ? 'Your ZPMC merchandise purchase receipt — ' : 'Your ZPMC membership payment receipt — ') + record.receipt_number,
      html,
      text: [
        record.payment_type === 'donation' ? 'Zero Point Meditation Center Inc. — Official Donation Receipt' : record.payment_type === 'merchandise' ? 'Zero Point Meditation Center Inc. — Official Merchandise Purchase Receipt' : 'Zero Point Meditation Center Inc. — Official Membership Payment Receipt',
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
  // Never pass malformed or non-ASCII text into the Authorization header
  // used by Supabase fetch; valid Supabase access tokens are three-part JWTs.
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken)) {
    console.error('Payment receipts received a malformed administrator JWT.');
    return res.status(401).json({ error:'Your administrator session token is damaged. Please sign out and sign in again.' });
  }
  // Match the working membership-proof admin API: verify the supplied user
  // access token with the server-side Supabase client, then check admin_users.
  // The service-role key stays server-side and is never returned to the browser.
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return res.status(503).json({ error:'Payment administration is not configured.' });

  try {
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      console.error('Payment receipts Auth verification failed:', authError?.status, authError?.name, authError?.message);
      return res.status(401).json({ error:'Your administrator session is invalid or expired.' });
    }
    const { data: admin, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', authData.user.id).maybeSingle();
    if (adminError || !admin) {
      // Diagnostic only: log the lookup outcome server-side without exposing
      // tokens, keys, email addresses, or database details to the browser.
      console.error('Payment receipts admin lookup failed:', {
        code: adminError?.code || null,
        message: adminError?.message || null,
        userId: authData.user.id,
        adminRecordFound: Boolean(admin)
      });
      return res.status(403).json({ error:'Administrator access is required.' });
    }

    if (req.method === 'GET') {
      if (req.query?.view === 'merchandise-orders') {
        const { data, error } = await supabase.from('merchandise_orders').select('*').order('created_at', { ascending:false }).limit(250);
        if (error) throw error;
        return res.status(200).json({ orders:data || [] });
      }
      const { data, error } = await supabase.from('payment_records').select('id, source_ref, payment_type, payer_name, payer_email, amount, currency, payment_method, purpose, membership_plan, member_id, payment_proof_path, status, receipt_number, admin_notes, created_at, verified_at, receipt_email_sent_at').order('created_at', { ascending:false }).limit(250);
      if (error) throw error;
      return res.status(200).json({ records:data || [] });
    }

    const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
    const id = clean(body.id, 50);
    const action = clean(body.action, 20);
    if (action === 'order_update') {
      const orderId = clean(body.orderId,50);
      if (!/^[0-9a-f-]{36}$/i.test(orderId)) return res.status(400).json({error:'A valid merchandise order is required.'});
      const {data:order,error:orderError} = await supabase.from('merchandise_orders').select('*').eq('id',orderId).maybeSingle();
      if (orderError) throw orderError;
      if (!order) return res.status(404).json({error:'Merchandise order not found.'});
      const status = clean(body.status,30) || order.status;
      const fulfillmentStatus = clean(body.fulfillmentStatus,30) || order.fulfillment_status;
      const allowedStatuses = ['pending_confirmation','awaiting_payment','payment_submitted','paid','rejected','cancelled'];
      const allowedFulfillment = ['not_started','processing','shipped','delivered','cancelled'];
      if (!allowedStatuses.includes(status) || !allowedFulfillment.includes(fulfillmentStatus)) return res.status(400).json({error:'Invalid order or fulfillment status.'});
      const itemAmount = body.itemAmount === undefined ? order.item_amount : Number(body.itemAmount);
      const shippingAmount = body.shippingAmount === undefined ? order.shipping_amount : Number(body.shippingAmount);
      const hasPricing = Number.isFinite(itemAmount) && itemAmount >= 0 && Number.isFinite(shippingAmount) && shippingAmount >= 0 && itemAmount + shippingAmount > 0;
      if (status === 'awaiting_payment' && !hasPricing) return res.status(400).json({error:'Enter a valid item price and shipping amount before requesting payment.'});
      const totalAmount = status === 'awaiting_payment' ? Number((itemAmount + shippingAmount).toFixed(2)) : order.total_amount;
      const update = {status,fulfillment_status:fulfillmentStatus,admin_notes:clean(body.adminNotes,1000) || null,tracking_number:clean(body.trackingNumber,120) || null,updated_at:new Date().toISOString()};
      if (status === 'awaiting_payment') Object.assign(update,{item_amount:itemAmount,shipping_amount:shippingAmount,total_amount:totalAmount});
      const {data:updated,error:updateError} = await supabase.from('merchandise_orders').update(update).eq('id',orderId).select('*').single();
      if (updateError) throw updateError;
      if (status === 'awaiting_payment' && order.status !== 'awaiting_payment') {
        const link = 'https://www.zeropointmeditationcenter.org/merchandise-payment?orderId='+encodeURIComponent(order.id)+'&token='+encodeURIComponent(order.public_token);
        const textBody = ['Hello '+order.payer_name+',','','ZPMC has confirmed your merchandise order.','Order: '+order.product_name,'Quantity: '+order.quantity,'Item amount: USD '+itemAmount.toFixed(2),'Shipping: USD '+shippingAmount.toFixed(2),'Total due: USD '+totalAmount.toFixed(2),'','Use your secure order link to view the Zelle QR code and submit your payment proof: '+link,'','Please verify the recipient is ZERO POINT MEDITATION CENTER INC. before sending payment.'].join('\n');
        const apiKey = process.env.RESEND_API_KEY, from = process.env.BOOKING_FROM_EMAIL;
        if (!apiKey || !from) return res.status(200).json({order:updated,emailSent:false,paymentLink:link,warning:'Final pricing was saved, but receipt email is not configured. Share the private payment link with the customer.'});
        const mail = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from,to:[order.payer_email],subject:'Your ZPMC merchandise order is ready for payment',text:textBody})});
        if(!mail.ok) return res.status(200).json({order:updated,emailSent:false,paymentLink:link,warning:'Order pricing was saved, but the customer email failed. Share the private payment link with the customer.'});
        return res.status(200).json({order:updated,emailSent:true});
      }
      return res.status(200).json({order:updated,emailSent:true});
    }
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
      if (current.payment_type === 'merchandise' && current.source_ref?.startsWith('merchandise:')) await supabase.from('merchandise_orders').update({status:'rejected',updated_at:new Date().toISOString()}).eq('id',current.source_ref.slice('merchandise:'.length));
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
    if (record.payment_type === 'merchandise' && record.source_ref?.startsWith('merchandise:')) await supabase.from('merchandise_orders').update({status:'paid',fulfillment_status:'processing',updated_at:new Date().toISOString()}).eq('id',record.source_ref.slice('merchandise:'.length));
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
