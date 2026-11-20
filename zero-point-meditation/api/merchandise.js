import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const BUCKET = 'membership-payment-proofs';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const siteUrl = 'https://www.zeropointmeditationcenter.org';
const adminEmail = 'admin@zeropointmeditationcenter.org';
const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app'
]);
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const parseBody = req => typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
const previewOrigin = origin => typeof origin === 'string' && /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin);
const originAllowed = origin => Boolean(origin) && (allowedOrigins.has(origin) || previewOrigin(origin));
const supabaseClient = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Merchandise ordering is not configured.');
  return createClient(url, key, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
};
async function email(payload) {
  const key = process.env.RESEND_API_KEY, from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !from) throw new Error('Order email is not configured.');
  const response = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{ Authorization:'Bearer '+key, 'Content-Type':'application/json' },
    body:JSON.stringify({ from, ...payload })
  });
  if (!response.ok) throw new Error('Order email could not be sent.');
}
async function findPublicOrder(supabase, id, token) {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  const { data, error } = await supabase.from('merchandise_orders')
    .select('id,public_token,product_name,listed_price,quantity,payer_name,payer_email,delivery_address,currency,item_amount,shipping_amount,total_amount,status,fulfillment_status,tracking_number,created_at')
    .eq('id',id).eq('public_token',token).maybeSingle();
  if (error) throw error;
  return data;
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (!['GET','POST'].includes(req.method)) { res.setHeader('Allow','GET, POST'); return res.status(405).json({error:'Method not allowed.'}); }
  if (req.method === 'POST' && !originAllowed(req.headers.origin)) return res.status(403).json({error:'Request origin is not allowed.'});
  try {
    const supabase = supabaseClient();
    if (req.method === 'GET') {
      const id = clean(req.query?.orderId,50), token = clean(req.query?.token,50);
      const order = await findPublicOrder(supabase,id,token);
      if (!order) return res.status(404).json({error:'This merchandise order link is invalid or has expired.'});
      return res.status(200).json({order});
    }
    const body = parseBody(req);
    const action = clean(body.action,30);
    if (clean(body.website,200)) return res.status(200).json({ok:true});

    if (action === 'create_order') {
      const product = clean(body.product,160), listedPrice = clean(body.price,80);
      const name = clean(body.name,120), emailAddress = clean(body.email,254).toLowerCase();
      const phone = clean(body.phone,40), address = clean(body.address,180), city = clean(body.city,100);
      const region = clean(body.region,100), postalCode = clean(body.postalCode,30), country = clean(body.country,100);
      const quantity = Number(body.quantity || 1);
      if (!product || name.length < 2 || !validEmail(emailAddress) || !phone || !address || !city || !country || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({error:'Please complete the required order and delivery details.'});
      }
      const {data:order,error} = await supabase.from('merchandise_orders').insert({
        product_name:product, listed_price:listedPrice, quantity, payer_name:name, payer_email:emailAddress,
        phone, delivery_address:{address,city,region,postalCode,country}
      }).select('id,public_token').single();
      if (error) throw error;
      const addressText = [address,city,region,postalCode,country].filter(Boolean).join(', ');
      const customerLink = siteUrl + '/merchandise-payment?orderId=' + encodeURIComponent(order.id) + '&token=' + encodeURIComponent(order.public_token);
      const adminText = [
        'New ZPMC merchandise order request','',
        'Order ID: '+order.id,'Product: '+product,'Quantity: '+quantity,'Listed price: '+(listedPrice || 'To confirm'),
        'Customer: '+name,'Email: '+emailAddress,'Phone: '+phone,'Delivery address: '+addressText,'',
        'Please confirm stock, item price and shipping in Merchandise Orders Admin. The customer must not pay until the final amount is confirmed.',
        siteUrl+'/merchandise-admin'
      ].join('\n');
      const customerText = [
        'Hello '+name+',','',
        'We received your merchandise order request at Zero Point Meditation Center.',
        'Order reference: '+order.id,'Item: '+product,'Quantity: '+quantity,
        'The centre will confirm availability, final item price and shipping. Please do not send payment yet.',
        'You can use this private order link to view the confirmation and pay once the final amount is approved:',
        customerLink,'',
        'This is an order acknowledgement, not a payment receipt.'
      ].join('\n');
      try {
        await Promise.all([
          email({to:[adminEmail],reply_to:emailAddress,subject:'New merchandise order: '+product,text:adminText}),
          email({to:[emailAddress],subject:'ZPMC merchandise order received',text:customerText})
        ]);
      } catch (mailError) {
        console.error('Merchandise order email failed:',mailError);
        return res.status(200).json({ok:true,orderId:order.id,token:order.public_token,emailSent:false,warning:'Your order was saved, but the confirmation email could not be sent. Please contact ZPMC and quote your order ID.'});
      }
      return res.status(200).json({ok:true,orderId:order.id,token:order.public_token,emailSent:true});
    }

    if (action === 'upload_url') {
      const id = clean(body.orderId,50), token = clean(body.token,50);
      const order = await findPublicOrder(supabase,id,token);
      if (!order) return res.status(404).json({error:'Order not found.'});
      if (order.status !== 'awaiting_payment' || !order.total_amount) return res.status(409).json({error:'The centre has not confirmed the final amount yet.'});
      const contentType = clean(body.contentType,100), size = Number(body.size);
      if (!MIME_TYPES.has(contentType)) return res.status(400).json({error:'Upload a JPG, PNG, WebP, or PDF receipt.'});
      if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) return res.status(400).json({error:'Payment proof must be no larger than 10 MB.'});
      const extension = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'})[contentType];
      const path = 'merchandise/'+id+'/'+randomUUID()+'.'+extension;
      const {data,error} = await supabase.storage.from(BUCKET).createSignedUploadUrl(path,{upsert:false});
      if (error) throw error;
      return res.status(200).json({path,token:data.token});
    }

    if (action === 'submit_payment') {
      const id = clean(body.orderId,50), token = clean(body.token,50), proofPath = clean(body.paymentProofPath,400);
      const order = await findPublicOrder(supabase,id,token);
      if (!order) return res.status(404).json({error:'Order not found.'});
      if (order.status !== 'awaiting_payment' || !order.total_amount) return res.status(409).json({error:'This order is not ready for payment submission.'});
      if (!proofPath.startsWith('merchandise/'+id+'/') || proofPath.includes('..')) return res.status(400).json({error:'Please upload payment proof for this order.'});
      const sourceRef = 'merchandise:'+id;
      const {data:payment,error:paymentError} = await supabase.from('payment_records').upsert({
        source_ref:sourceRef,payment_type:'merchandise',payer_name:order.payer_name,payer_email:order.payer_email,
        amount:order.total_amount,currency:order.currency || 'USD',payment_method:'Zelle',
        purpose:'Merchandise order '+id+' — '+order.product_name+' × '+order.quantity,
        payment_proof_path:proofPath,status:'pending'
      },{onConflict:'source_ref',ignoreDuplicates:true}).select('id,status').maybeSingle();
      if (paymentError) throw paymentError;
      let paymentRecord = payment;
      if (!paymentRecord) {
        const {data:existing,error:existingError} = await supabase.from('payment_records').select('id,status').eq('source_ref',sourceRef).maybeSingle();
        if (existingError) throw existingError;
        paymentRecord = existing;
      }
      if (!paymentRecord) throw new Error('The payment record could not be confirmed. Please contact ZPMC before submitting again.');
      const {error:updateError} = await supabase.from('merchandise_orders').update({status:'payment_submitted',payment_record_id:paymentRecord.id,updated_at:new Date().toISOString()}).eq('id',id).eq('status','awaiting_payment');
      if (updateError) throw updateError;
      try {
        await email({to:[adminEmail],reply_to:order.payer_email,subject:'Merchandise payment proof submitted',text:'A customer submitted Zelle payment proof for merchandise order '+id+'.\nCustomer: '+order.payer_name+' ('+order.payer_email+')\nAmount expected: '+order.currency+' '+Number(order.total_amount).toFixed(2)+'\nReview in '+siteUrl+'/merchandise-admin and verify the payment in Merchandise Payment Receipts.'});
      } catch (mailError) { console.error('Merchandise payment notification failed:',mailError); }
      return res.status(200).json({ok:true});
    }
    return res.status(400).json({error:'Unknown merchandise action.'});
  } catch (error) {
    console.error('Merchandise API failed:',error);
    return res.status(502).json({error:error.message || 'Could not process this merchandise request.'});
  }
}
