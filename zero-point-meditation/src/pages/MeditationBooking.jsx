import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Clock3, Video, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const sessions = [
  { date: '2026-11-07', label: 'Saturday, November 7, 2026' },
  { date: '2026-11-08', label: 'Sunday, November 8, 2026' },
  { date: '2026-11-14', label: 'Saturday, November 14, 2026' },
  { date: '2026-11-15', label: 'Sunday, November 15, 2026' },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const backendReady = Boolean(supabaseUrl && supabaseAnonKey);

const inputClass = 'mt-1 block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20';

export default function MeditationBooking() {
  const [selectedDate, setSelectedDate] = useState(sessions[0].date);
  const [form, setForm] = useState({ name: '', email: '', phone: '', place: '', profession: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const selectedSession = useMemo(() => sessions.find((session) => session.date === selectedDate), [selectedDate]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!backendReady) {
      setStatus({ type: 'error', message: 'Online registration is not open yet while the secure booking service is being configured. Please check back soon.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/meditation_bookings`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          session_date: selectedDate,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          place: form.place.trim(),
          profession: form.profession.trim(),
        }),
      });

      if (response.status === 409) {
        throw new Error('A booking with this email address already exists for that session. Please choose another session or contact the center if you need help.');
      }
      if (!response.ok) {
        if (response.status === 400 || response.status === 422) {
          throw new Error('Please check your details. If the problem continues, contact the center.');
        }
        throw new Error('We could not complete your booking just now. Please try again in a moment.');
      }

      setStatus({
        type: 'success',
        message: 'Your registration has been received. The center still needs to configure its email confirmation service, so please watch for a separate confirmation with the Zoom details.',
      });
      setForm({ name: '', email: '', phone: '', place: '', profession: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Free Morning Meditation Booking | Zero Point Meditation Center</title>
        <meta name="description" content="Register for a free online morning meditation session with Zero Point Meditation Center on November 7, 8, 14 or 15, 2026." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/meditation-booking" />
        <meta property="og:title" content="Free Morning Meditation Booking | Zero Point Meditation Center" />
        <meta property="og:description" content="Reserve your place for a free online morning meditation session." />
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/meditation-booking" />
      </Helmet>

      <div className="min-h-screen bg-buddhist-bg">
        <section className="relative overflow-hidden bg-buddhist-burgundy px-5 py-14 text-white sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Zero Point Meditation Center</p>
            <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-5xl">Free Online Morning Meditation</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">Begin your weekend with a calm, guided meditation. Everyone is welcome; registration is free.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><CalendarDays size={17} /> November 7, 8, 14 &amp; 15</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Clock3 size={17} /> 6:30–7:15 AM</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Video size={17} /> Online via Zoom</span>
            </div>
            <p className="mt-4 text-xs text-white/70">Time zone will be confirmed by the center before registration opens.</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
          <div>
            <h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">Choose a session</h2>
            <p className="mt-2 leading-7 text-stone-600">Select the morning that works for you. You can register for a session at no cost.</p>
            <div className="mt-6 space-y-3">
              {sessions.map((session) => {
                const active = selectedDate === session.date;
                return (
                  <button
                    type="button"
                    key={session.date}
                    onClick={() => setSelectedDate(session.date)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 ${active ? 'border-buddhist-burgundy bg-white shadow-md' : 'border-stone-200 bg-white/60 hover:border-amber-700/50'}`}
                  >
                    <span>
                      <span className="block font-semibold text-stone-900">{session.label}</span>
                      <span className="mt-1 block text-sm text-stone-600">6:30–7:15 AM · Zoom</span>
                    </span>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${active ? 'border-buddhist-burgundy bg-buddhist-burgundy text-white' : 'border-stone-300 text-transparent'}`}><CheckCircle2 size={16} /></span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-900/10 bg-amber-50 p-5">
              <h3 className="font-semibold text-buddhist-burgundy">What happens next?</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">After the booking system is fully configured, you’ll receive a confirmation email with the Zoom meeting details and any joining instructions.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">Register for free</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Selected session: <strong className="text-stone-900">{selectedSession?.label}</strong></p>

            {!backendReady && (
              <div role="status" className="mt-5 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <span>Booking is not open yet. The secure Supabase project and server-side email service must be configured before participant details can be submitted.</span>
              </div>
            )}

            {status.message && (
              <div role="status" className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${status.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-800'}`}>
                {status.message}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="booking-name" className="text-sm font-medium text-stone-800">Full name *</label>
                <input id="booking-name" className={inputClass} name="name" value={form.name} onChange={updateField} autoComplete="name" required maxLength={120} />
              </div>
              <div>
                <label htmlFor="booking-email" className="text-sm font-medium text-stone-800">Email address *</label>
                <input id="booking-email" className={inputClass} name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required maxLength={254} />
              </div>
              <div>
                <label htmlFor="booking-phone" className="text-sm font-medium text-stone-800">Phone number *</label>
                <input id="booking-phone" className={inputClass} name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" required maxLength={40} />
              </div>
              <div>
                <label htmlFor="booking-place" className="text-sm font-medium text-stone-800">Place / city / country *</label>
                <input id="booking-place" className={inputClass} name="place" value={form.place} onChange={updateField} autoComplete="address-level2" required maxLength={120} />
              </div>
              <div>
                <label htmlFor="booking-profession" className="text-sm font-medium text-stone-800">Profession *</label>
                <input id="booking-profession" className={inputClass} name="profession" value={form.profession} onChange={updateField} autoComplete="organization-title" required maxLength={120} />
              </div>
              <button type="submit" disabled={!backendReady || submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy-hover focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Register for free'} <ArrowRight size={18} />
              </button>
              <p className="text-xs leading-5 text-stone-500">Your information will be used to manage your class registration and send session-related messages. Please don’t submit sensitive personal information.</p>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
