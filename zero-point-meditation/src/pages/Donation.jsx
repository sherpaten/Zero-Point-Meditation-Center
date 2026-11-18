import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const purposes = [
  'General support for ZPMC',
  'Support an upcoming event',
  'Free meditation programs',
  'Monastery and sangha activities',
  'Other'
];
const amounts = ['25', '50', '100', '250', '500'];
const zelleQrDataUrl = 'data:image/png;base64,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';

export default function Donation() {
  const [form, setForm] = useState({ name: '', email: '', amount: '50', customAmount: '', purpose: purposes[0], paymentMethod: 'bank_transfer', message: '', website: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const amount = form.amount === 'custom' ? form.customAmount : form.amount;

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/donation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount })
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
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Helmet>
        <title>Donate & Support | Zero Point Meditation Center</title>
        <meta name="description" content="Support Zero Point Meditation Center's teachings, meditation programs, community events, sangha and future activities." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/donate" />
      </Helmet>
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><Sparkles size={15}/> Generosity & Compassion</span>
        <h1 className="mt-3 font-serif text-4xl font-bold text-buddhist-burgundy sm:text-5xl">Support Our Mission</h1>
        <p className="mt-5 text-base leading-relaxed text-stone-600">Your generosity helps Zero Point Meditation Center share Buddhist teachings, offer free meditation programs, support the sangha, and bring future events and community activities to life.</p>
      </section>
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.15fr]">
        <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-8">
          <Heart size={30} className="text-buddhist-burgundy" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-buddhist-burgundy">Every contribution makes a difference</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">Donations may support any of our current or future events and programs, including teachings, meditation classes, monastery and sangha activities, or the center's general mission.</p>
          <ul className="mt-5 space-y-3 text-sm text-stone-700">
            {['Buddhist teachings and special events', 'Free meditation classes and community programs', 'Monastery and sangha activities', 'General support and future initiatives'].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-700"/>{item}</li>)}
          </ul>
          <p className="mt-6 rounded-xl bg-white/80 p-4 text-xs leading-relaxed text-stone-600">Choose one of the available transfer methods. This form does not collect payment or financial account information.</p>
        </aside>
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          {status === 'success' ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="text-emerald-600"/>
              <h2 className="mt-4 font-serif text-2xl font-bold text-buddhist-burgundy">Thank you for your generosity</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">Your donation request has been received. We will email the payment instructions for your selected method to complete your contribution.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">Donation details</h2>
              <div>
                <label htmlFor="donation-method" className="mb-2 block text-sm font-semibold text-stone-700">Payment method</label>
                <select id="donation-method" value={form.paymentMethod} onChange={(e)=>setForm({...form,paymentMethod:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm">
                  <option value="bank_transfer">Bank transfer (ACH)</option>
                  <option value="zelle">Zelle</option>
                  <option value="international_usd">International wire (USD)</option>
                  <option value="international_foreign">International wire (foreign currency)</option>
                </select>
              </div>
              {form.paymentMethod === 'zelle' && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center">
                  <h3 className="text-lg font-bold text-stone-900">Pay securely with Zelle</h3>
                  <p className="mt-1 text-sm text-stone-600">Open your banking app, choose Zelle, and scan this QR code to pay Zero Point Meditation Center Inc.</p>
                  <img src={zelleQrDataUrl} alt="Zelle QR code for Zero Point Meditation Center Inc." className="mx-auto mt-4 h-auto w-full max-w-[280px] rounded-xl bg-white p-3" />
                  <p className="mt-3 text-xs text-stone-600">Please confirm the recipient name is ZERO POINT MEDITATION CENTER INC. before sending.</p>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">Donation amount (USD)</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {amounts.map((value) => <button key={value} type="button" onClick={() => setForm({...form, amount:value})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount===value?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>{'$'}{value}</button>)}
                  <button type="button" onClick={() => setForm({...form, amount:'custom'})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount==='custom'?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>Other</button>
                </div>
                {form.amount === 'custom' && <input required type="number" min="1" step="0.01" value={form.customAmount} onChange={(e)=>setForm({...form,customAmount:e.target.value})} placeholder="Enter amount in USD" className="mt-3 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-buddhist-gold focus:outline-none"/>}
              </div>
              <div>
                <label htmlFor="donation-purpose" className="mb-2 block text-sm font-semibold text-stone-700">Donation purpose</label>
                <select id="donation-purpose" value={form.purpose} onChange={(e)=>setForm({...form,purpose:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm">{purposes.map((purpose)=><option key={purpose}>{purpose}</option>)}</select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="donor-name" className="mb-2 block text-sm font-semibold text-stone-700">Full name</label><input id="donor-name" required maxLength="120" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
                <div><label htmlFor="donor-email" className="mb-2 block text-sm font-semibold text-stone-700">Email address</label><input id="donor-email" type="email" required maxLength="254" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
              </div>
              <div><label htmlFor="donation-message" className="mb-2 block text-sm font-semibold text-stone-700">Message (optional)</label><textarea id="donation-message" rows="3" maxLength="1500" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} placeholder="Any note or dedication…" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"/></div>
              <input tabIndex="-1" autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})}/>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={status==='sending'} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-900 disabled:cursor-wait disabled:opacity-60">{status==='sending'?'Sending…':'Request donation instructions'} <ArrowRight size={16}/></button>
              <p className="text-center text-xs text-stone-500">We will email your selected payment details and instructions to complete your donation.</p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
