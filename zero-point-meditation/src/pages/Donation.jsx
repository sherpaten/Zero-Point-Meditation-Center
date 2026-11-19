import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';

const purposes = [
  'General support for ZPMC',
  'Support an upcoming event',
  'Free meditation programs',
  'Monastery and sangha activities',
  'Other'
];
const amounts = ['25', '50', '100', '250', '500'];
const zelleQrValue = 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiWkVSTyBQT0lOVCBNRURJVEFUSU9OIENFTlRFUiBJTkMuIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNjQ2NDU2MDg0MyJ9';

export default function Donation() {
  const [form, setForm] = useState({ name: '', email: '', amount: '50', customAmount: '', purpose: purposes[0], paymentMethod: 'zelle', message: '', website: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [zelleQrOpen, setZelleQrOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPath, setProofPath] = useState('');
  const [proofStatus, setProofStatus] = useState('idle');
  const [proofError, setProofError] = useState('');
  const amount = form.amount === 'custom' ? form.customAmount : form.amount;

  const uploadDonationProof = async (file) => {
    setProofFile(file || null); setProofPath(''); setProofError('');
    if (!file) { setProofStatus('idle'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) { setProofStatus('idle'); setProofError('Upload a JPG, PNG, WebP, or PDF receipt.'); return; }
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) { setProofStatus('idle'); setProofError('The payment proof must be no larger than 10 MB.'); return; }
    if (!supabase) { setProofStatus('idle'); setProofError('Secure upload is unavailable. Please contact ZPMC.'); return; }
    setProofStatus('uploading');
    try {
      const prepared = await fetch('/api/donation-proof-upload-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contentType: file.type, size: file.size }) });
      const upload = await prepared.json();
      if (!prepared.ok) throw new Error(upload.error || 'Could not prepare the upload.');
      const { error: uploadError } = await supabase.storage.from('membership-payment-proofs').uploadToSignedUrl(upload.path, upload.token, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      setProofPath(upload.path); setProofStatus('success');
    } catch (err) { setProofStatus('idle'); setProofError(err.message || 'Upload failed. Please try again.'); }
  };


  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/donation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount, paymentProofPath: proofPath })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit your donation request.');
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please email info@zeropointmeditationcenter.org.');
      setStatus('idle');
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <Helmet>
        <title>Donate & Support | Zero Point Meditation Center</title>
        <meta name="description" content="Support Zero Point Meditation Center's teachings, meditation programs, community events, sangha and future activities." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/donate" />
      </Helmet>
      <section className="mx-auto w-full max-w-3xl min-w-0 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><Sparkles size={15}/> Generosity & Compassion</span>
        <h1 className="mt-3 break-words font-serif text-3xl font-bold leading-tight text-buddhist-burgundy sm:text-5xl">Support Our Mission</h1>
        <p className="mx-auto mt-5 max-w-2xl break-words text-sm leading-relaxed text-stone-600 sm:text-base">Your generosity helps Zero Point Meditation Center share Buddhist teachings, offer free meditation programs, support the sangha, and bring future events and community activities to life.</p>
      </section>
      <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:mt-10 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <aside className="min-w-0 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-8">
          <Heart size={30} className="text-buddhist-burgundy" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-buddhist-burgundy">Every contribution makes a difference</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">Donations may support any of our current or future events and programs, including teachings, meditation classes, monastery and sangha activities, or the center's general mission.</p>
          <ul className="mt-5 space-y-3 text-sm text-stone-700">
            {['Buddhist teachings and special events', 'Free meditation classes and community programs', 'Monastery and sangha activities', 'General support and future initiatives'].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-700"/>{item}</li>)}
          </ul>
          <p className="mt-6 rounded-xl bg-white/80 p-4 text-xs leading-relaxed text-stone-600">Choose one of the available transfer methods. This form does not collect payment or financial account information.</p>
        </aside>
        <section className="min-w-0 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-8">
          {status === 'success' ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="text-emerald-600"/>
              <h2 className="mt-4 font-serif text-2xl font-bold text-buddhist-burgundy">Thank you for your generosity</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">{form.paymentMethod === 'zelle' ? 'Thank you for your generosity. Your donation submission has been received. We are grateful for your support of Zero Point Meditation Center.' : 'Your donation request has been received. We will email the bank transfer instructions so you can complete your contribution.'}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="min-w-0 space-y-5">
              <h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">Donation details</h2>
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">Donation amount (USD)</label>
                <div className="grid grid-cols-2 gap-2 min-[380px]:grid-cols-3 sm:grid-cols-5">
                  {amounts.map((value) => <button key={value} type="button" onClick={() => setForm({...form, amount:value})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount===value?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>{'$'}{value}</button>)}
                  <button type="button" onClick={() => setForm({...form, amount:'custom'})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount==='custom'?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>Other</button>
                </div>
                {form.amount === 'custom' && <input required type="number" min="1" step="0.01" value={form.customAmount} onChange={(e)=>setForm({...form,customAmount:e.target.value})} placeholder="Enter amount in USD" className="mt-3 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-buddhist-gold focus:outline-none"/>}
              </div>
              <div>
                <label htmlFor="donation-purpose" className="mb-2 block text-sm font-semibold text-stone-700">Donation purpose</label>
                <select id="donation-purpose" value={form.purpose} onChange={(e)=>setForm({...form,purpose:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm">{purposes.map((purpose)=><option key={purpose}>{purpose}</option>)}</select>
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label htmlFor="donor-name" className="mb-2 block text-sm font-semibold text-stone-700">Full name</label><input id="donor-name" required maxLength="120" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
                <div><label htmlFor="donor-email" className="mb-2 block text-sm font-semibold text-stone-700">Email address</label><input id="donor-email" type="email" required maxLength="254" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
              </div>
              <div><label htmlFor="donation-message" className="mb-2 block text-sm font-semibold text-stone-700">Message (optional)</label><textarea id="donation-message" rows="3" maxLength="1500" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} placeholder="Any note or dedication…" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
              <div className="space-y-3 border-t border-stone-200 pt-5">
                <h3 className="text-lg font-bold text-buddhist-burgundy">Choose how you would like to donate</h3>
                <label htmlFor="donation-method" className="mb-2 block text-sm font-semibold text-stone-700">Payment method</label>
                <select id="donation-method" value={form.paymentMethod} onChange={(e)=>setForm({...form,paymentMethod:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm">
                  <option value="zelle">Zelle (recommended)</option>
                  <option value="bank_transfer">Bank transfer (ACH)</option>
                </select>
                {form.paymentMethod === 'zelle' && (
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 text-center">
                    <p className="text-sm text-stone-700">Pay securely using Zelle. Open the QR code only when you are ready to scan.</p>
                    <button type="button" onClick={() => setZelleQrOpen(true)} className="mt-3 inline-flex items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-3 text-sm font-bold text-purple-900 shadow-sm transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">Pay Using Zelle QR</button>
                  </div>
                )}
                {zelleQrOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation" onClick={() => setZelleQrOpen(false)}>
                    <div role="dialog" aria-modal="true" aria-labelledby="zelle-qr-title" className="relative w-full max-w-md rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
                      <button type="button" onClick={() => setZelleQrOpen(false)} aria-label="Close Zelle QR popup" className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-2xl text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-purple-500">&times;</button>
                      <h3 id="zelle-qr-title" className="pr-8 text-lg font-bold text-stone-900">Donate with Zelle</h3>
                      <p className="mt-2 text-sm text-stone-600">Scan this QR code using your banking app.</p>
                      <div role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm leading-relaxed text-amber-950">
                        <p className="font-bold">Important — Verify Before Sending</p>
                        <p className="mt-1">Carefully check the recipient name and all payment details before sending money. Confirm the recipient is <strong>ZERO POINT MEDITATION CENTER INC.</strong> before completing your Zelle payment. If anything looks incorrect, do not proceed.</p>
                      </div>
                      <div className="mx-auto mt-4 inline-flex max-w-full items-center justify-center rounded-xl bg-white p-3"><QRCodeSVG value={zelleQrValue} size={260} level="H" bgColor="#ffffff" fgColor="#000000" includeMargin /></div>
                      <p className="mt-3 text-sm font-semibold text-stone-800">Recipient: ZERO POINT MEDITATION CENTER INC.</p>
                      <div role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm leading-relaxed text-amber-950">
                        <p className="font-bold">Important — Verify Before Sending</p>
                        <p className="mt-1">Carefully check the recipient name and all payment details before sending money. Confirm the recipient is <strong>ZERO POINT MEDITATION CENTER INC.</strong> before completing your Zelle payment. If anything looks incorrect, do not proceed.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {form.paymentMethod === 'zelle' && (
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <label htmlFor="donation-proof" className="block text-sm font-semibold text-stone-800">Upload payment proof (JPG, PNG, WebP, or PDF · max 10 MB)</label>
                  <input id="donation-proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => uploadDonationProof(e.target.files?.[0])} className="block w-full text-sm text-stone-700" />
                  {proofFile && <p className="break-all text-xs text-stone-600">{proofFile.name}</p>}
                  {proofStatus === 'uploading' && <p role="status" className="text-sm text-stone-600">Uploading securely…</p>}
                  {proofStatus === 'success' && <p role="status" className="text-sm font-semibold text-emerald-700">Payment proof uploaded successfully.</p>}
                  {proofError && <p role="alert" className="text-sm text-red-700">{proofError}</p>}
                  <p className="text-xs leading-relaxed text-stone-600">Complete your Zelle payment and upload the receipt before submitting your donation.</p>
                </div>
              )}
              <input tabIndex="-1" autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})}/>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={status==='sending' || (form.paymentMethod==='zelle' && proofStatus!=='success')} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-900 disabled:cursor-wait disabled:opacity-60">{status==='sending'?'Submitting…':form.paymentMethod==='bank_transfer'?'Request bank transfer instructions':"I've paid with Zelle — Submit donation"} <ArrowRight size={16}/></button>
              {form.paymentMethod === 'zelle' ? (
                <p className="break-words text-center text-xs leading-relaxed text-stone-600">Please scan the QR code, complete your Zelle payment, upload your receipt, and then submit your donation.</p>
              ) : (
                <p className="break-words text-center text-xs leading-relaxed text-stone-600">Click above to request the bank transfer instructions. We will email the ACH details so you can complete your donation.</p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
