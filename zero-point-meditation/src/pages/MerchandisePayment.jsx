import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, ShieldCheck, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';

const zelleQrValue = 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiWkVSTyBQT0lOVCBNRURJVEFUSU9OIENFTlRFUiBJTkMuIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNjQ2NDU2MDg0MyJ9';
const formatMoney = (amount,currency='USD') => currency+' '+Number(amount || 0).toFixed(2);

export default function MerchandisePayment() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || '';
  const token = params.get('token') || '';
  const [order,setOrder] = useState(null);
  const [loading,setLoading] = useState(true);
  const [file,setFile] = useState(null);
  const [proofPath,setProofPath] = useState('');
  const [uploading,setUploading] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!orderId || !token) { setError('This private order link is incomplete. Please use the link in your ZPMC email.'); setLoading(false); return; }
      try {
        const response = await fetch('/api/merchandise?orderId='+encodeURIComponent(orderId)+'&token='+encodeURIComponent(token));
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load this order.');
        if (active) setOrder(result.order);
      } catch (err) { if (active) setError(err.message); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  },[orderId,token]);

  async function uploadProof(nextFile) {
    setFile(nextFile || null); setProofPath(''); setError(''); setNotice('');
    if (!nextFile) return;
    if (!['image/jpeg','image/png','image/webp','application/pdf'].includes(nextFile.type)) { setError('Upload a JPG, PNG, WebP, or PDF receipt.'); return; }
    if (nextFile.size <= 0 || nextFile.size > 10*1024*1024) { setError('Payment proof must be no larger than 10 MB.'); return; }
    setUploading(true);
    try {
      const prepared = await fetch('/api/merchandise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'upload_url',orderId,token,contentType:nextFile.type,size:nextFile.size})});
      const upload = await prepared.json();
      if (!prepared.ok) throw new Error(upload.error || 'Could not prepare secure upload.');
      if (!supabase) throw new Error('Secure upload is unavailable. Please contact ZPMC.');
      const {error:uploadError} = await supabase.storage.from('membership-payment-proofs').uploadToSignedUrl(upload.path,upload.token,nextFile,{contentType:nextFile.type,upsert:false});
      if (uploadError) throw uploadError;
      setProofPath(upload.path); setNotice('Payment proof uploaded securely.');
    } catch (err) { setError(err.message || 'Upload failed. Please try again.'); }
    finally { setUploading(false); }
  }

  async function submitProof(event) {
    event.preventDefault(); setSubmitting(true); setError('');
    try {
      const response = await fetch('/api/merchandise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'submit_payment',orderId,token,paymentProofPath:proofPath})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not submit payment proof.');
      setOrder(current => ({...current,status:'payment_submitted'}));
      setNotice('Your payment proof has been submitted. ZPMC will verify the payment and email your official receipt.');
    } catch (err) { setError(err.message || 'Could not submit payment proof.'); }
    finally { setSubmitting(false); }
  }

  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <Helmet><title>Merchandise Payment | Zero Point Meditation Center</title><meta name="robots" content="noindex,nofollow"/></Helmet>
    <header className="mb-7 text-center"><ShoppingBag className="mx-auto text-buddhist-gold" size={32}/><h1 className="mt-3 font-serif text-3xl font-bold text-buddhist-burgundy">Your Merchandise Order</h1><p className="mt-2 text-sm text-stone-600">Secure ZPMC order payment and proof submission</p></header>
    {loading ? <p className="rounded-xl bg-white p-6 text-center">Loading your order…</p> : error && !order ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</div> : order && <div className="space-y-5">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Order reference</p><p className="mt-1 break-all text-sm font-semibold">{order.id}</p></div><span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">{order.status.replaceAll('_',' ')}</span></div>
        <div className="mt-5 space-y-2 text-sm"><p><strong>Item:</strong> {order.product_name}</p><p><strong>Quantity:</strong> {order.quantity}</p><p><strong>Listed price:</strong> {order.listed_price || 'To confirm'}</p><p><strong>Delivery to:</strong> {Object.values(order.delivery_address || {}).filter(Boolean).join(', ')}</p></div>
        {order.total_amount && <div className="mt-5 rounded-xl bg-amber-50 p-4"><div className="flex justify-between text-sm"><span>Items</span><strong>{formatMoney(order.item_amount,order.currency)}</strong></div><div className="mt-2 flex justify-between text-sm"><span>Shipping</span><strong>{formatMoney(order.shipping_amount,order.currency)}</strong></div><div className="mt-3 flex justify-between border-t border-amber-200 pt-3 text-lg font-bold text-buddhist-burgundy"><span>Total due</span><span>{formatMoney(order.total_amount,order.currency)}</span></div></div>}
      </section>
      {order.status === 'pending_confirmation' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">ZPMC is checking availability and confirming the final item price and shipping. Please do not send payment yet. We will email you when the final amount is ready.</div>}
      {order.status === 'awaiting_payment' && <section className="rounded-2xl border border-purple-200 bg-white p-5 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 font-bold text-buddhist-burgundy"><ShieldCheck size={19}/> Pay the confirmed amount using Zelle</div>
        <p className="mt-2 text-sm text-stone-600">Scan the QR code with your banking app and enter the exact total shown above.</p>
        <div className="mx-auto mt-4 inline-flex rounded-xl border bg-white p-3"><QRCodeSVG value={zelleQrValue} size={250} level="H" includeMargin/></div>
        <p className="mt-3 text-sm font-semibold">Recipient: ZERO POINT MEDITATION CENTER INC.</p>
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-950">Before sending, confirm the recipient name is exactly ZERO POINT MEDITATION CENTER INC. If the recipient or details differ, do not proceed. The QR code is the same official ZPMC Zelle payment QR used on the Donation page.</p>
        <form onSubmit={submitProof} className="mt-6 space-y-3 border-t pt-5 text-left">
          <label className="block text-sm font-semibold">Upload your Zelle payment confirmation (JPG, PNG, WebP or PDF · max 10 MB)
            <input required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={e=>uploadProof(e.target.files?.[0])} className="mt-2 block w-full text-sm"/>
          </label>
          {file && <p className="text-xs text-stone-500">{file.name}</p>}
          {uploading && <p role="status" className="text-sm text-stone-600">Uploading securely…</p>}
          {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={!proofPath || uploading || submitting} className="w-full rounded-xl bg-buddhist-burgundy px-5 py-3 font-bold text-white disabled:opacity-50">{submitting?'Submitting…':'Submit payment proof'}</button>
          <p className="text-xs text-stone-500">Submitting proof does not automatically mark the order as paid. ZPMC will independently verify the funds before issuing your receipt.</p>
        </form>
      </section>}
      {order.status === 'payment_submitted' && <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-950"><CheckCircle className="mb-2" size={22}/>Your payment proof has been received. ZPMC will verify the payment and email your official merchandise purchase receipt.</div>}
      {order.status === 'paid' && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"><CheckCircle className="mb-2" size={22}/>Your payment has been verified. Your official receipt has been issued. Fulfillment status: {order.fulfillment_status.replaceAll('_',' ')}{order.tracking_number ? ' · Tracking: '+order.tracking_number : ''}.</div>}
      {order.status === 'rejected' && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">ZPMC could not verify the submitted payment. Please contact the centre before sending another payment.</div>}
      {notice && order.status !== 'awaiting_payment' && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
      {error && order.status === 'awaiting_payment' && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>}
  </main>;
}
