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
          <p className="mt-6 rounded-xl bg-white/80 p-4 text-xs leading-relaxed text-stone-600">Choose bank transfer or Zelle. Card donations will be available after secure card processing is connected. This form does not collect payment or financial account information.</p>
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
              <div><label htmlFor="donation-method" className="mb-2 block text-sm font-semibold text-stone-700">Payment method</label><select id="donation-method" value={form.paymentMethod} onChange={(e)=>setForm({...form,paymentMethod:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"><option value="bank_transfer">Bank transfer (ACH)</option><option value="zelle">Zelle</option><option value="card" disabled>Credit/debit card (coming soon)</option></select></div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">Donation amount (USD)</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {amounts.map((value) => <button key={value} type="button" onClick={() => setForm({...form, amount:value})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount===value?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>$${value}</button>)}
                  <button type="button" onClick={() => setForm({...form, amount:'custom'})} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${form.amount==='custom'?'border-buddhist-burgundy bg-amber-50 text-buddhist-burgundy':'border-stone-200 text-stone-700 hover:border-amber-400'}`}>Other</button>
                </div>
                {form.amount === 'custom' && <input required type="number" min="1" step="0.01" value={form.customAmount} onChange={(e)=>setForm({...form,customAmount:e.target.value})} placeholder="Enter amount in USD" className="mt-3 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-buddhist-gold focus:outline-none"/>}
              </div>
              <div>
                <label htmlFor="donation-purpose" className="mb-2 block text-sm font-semibold text-stone-700">Donation purpose</label>
                <select id="donation-purpose" value={form.purpose} onChange={(e)=>setForm({...form,purpose:e.target.value})} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm">
                  {purposes.map((purpose)=><option key={purpose}>{purpose}</option>)}
                </select>
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
