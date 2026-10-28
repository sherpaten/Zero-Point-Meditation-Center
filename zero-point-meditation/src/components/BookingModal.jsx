import React, { useEffect, useState } from 'react';
import { X, CalendarDays, CreditCard, ShieldCheck } from 'lucide-react';

const sessions = [
  { value: '2026-11-07', label: 'Saturday, November 7, 2026' },
  { value: '2026-11-08', label: 'Sunday, November 8, 2026' },
  { value: '2026-11-14', label: 'Saturday, November 14, 2026' },
  { value: '2026-11-15', label: 'Sunday, November 15, 2026' },
];

const availableServices = [
  'Meditation & Mindfulness',
  'Meditation & Buddhist Practices',
  'Prayers & Spiritual Guidance',
  'Emotional Well-being',
  'Community Gatherings',
  'Counselling Information',
];

const fieldClass = 'mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20';

export default function BookingModal({ open, onClose, initialType = 'event', initialService = '', fixedSelection = false }) {
  const [type, setType] = useState(initialType);
  const [service, setService] = useState(initialService || 'Free Morning Meditation');
  const [date, setDate] = useState(sessions[0].value);
  const [form, setForm] = useState({ name: '', email: '', phone: '', place: '', profession: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      setType(initialType);
      setService(initialService || (initialType === 'event' ? 'Free Morning Meditation' : 'Meditation & Mindfulness'));
      setMessage('');
    }
  }, [open, initialType, initialService]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isFree = type === 'event' && service === 'Free Morning Meditation';
  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }
  function submit(event) {
    event.preventDefault();
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'booking_form_submit_attempt', {
        service_name: service,
        booking_type: type,
        form_location: 'booking_modal'
      });
    }
    setMessage(isFree
      ? 'Your details are ready, but registration is not open yet. The center must finish configuring the secure booking database and confirmation email before submissions can be accepted.'
      : 'This is a booking enquiry. Online payment and confirmed bookings are not enabled yet; the center must finish configuring the booking system and confirm its payment gateway before paid bookings can be accepted.');
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-stone-950/70 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" className="my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Zero Point Meditation Center</p>
            <h2 id="booking-modal-title" className="mt-1 font-serif text-2xl font-bold text-buddhist-burgundy">Book a service or event</h2>
            <p className="mt-1 text-sm text-stone-600">Complete this form without leaving our website.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking form" className="rounded-full p-2 text-stone-600 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"><X size={22}/></button>
        </header>
        <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
          {fixedSelection ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Selected teacher service</p>
              <p className="mt-1 font-semibold text-buddhist-burgundy">{service}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-type" className="text-sm font-semibold text-stone-800">What would you like to book?</label>
                <select id="booking-type" value={type} onChange={event => { setType(event.target.value); setService(event.target.value === 'event' ? 'Free Morning Meditation' : 'Meditation & Mindfulness'); setMessage(''); }} className={fieldClass}>
                  <option value="event">Event / class</option><option value="service">Service / appointment</option>
                </select>
              </div>
              <div>
                <label htmlFor="booking-service" className="text-sm font-semibold text-stone-800">{type === 'event' ? 'Choose an event' : 'Choose a service'}</label>
                <select id="booking-service" value={service} onChange={event => { setService(event.target.value); setMessage(''); }} className={fieldClass}>
                  {type === 'event' ? <>
                    <option>Free Morning Meditation</option><option>Community Gathering</option><option>Prayer Event</option><option>Other Event</option>
                  </> : availableServices.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          )}
          {type === 'event' && service === 'Free Morning Meditation' && <div className="rounded-xl bg-amber-50 p-4 text-sm text-stone-700">
            <p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CalendarDays size={17}/> Free online session · 6:30–7:15 AM</p>
            <p className="mt-1">Time zone is to be confirmed by the center. Zoom joining details would be sent after the booking system is configured.</p>
            <label htmlFor="booking-date" className="mt-3 block font-semibold">Choose a date</label>
            <select id="booking-date" value={date} onChange={event => setDate(event.target.value)} className={fieldClass}>{sessions.map(session => <option key={session.value} value={session.value}>{session.label}</option>)}</select>
          </div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="booking-name" className="text-sm font-semibold text-stone-800">Full name *</label><input id="booking-name" className={fieldClass} name="name" autoComplete="name" value={form.name} onChange={update} maxLength={120} required /></div>
            <div><label htmlFor="booking-email" className="text-sm font-semibold text-stone-800">Email address *</label><input id="booking-email" className={fieldClass} name="email" type="email" autoComplete="email" value={form.email} onChange={update} maxLength={254} required /></div>
            <div><label htmlFor="booking-phone" className="text-sm font-semibold text-stone-800">Phone number *</label><input id="booking-phone" className={fieldClass} name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} maxLength={40} required /></div>
            <div><label htmlFor="booking-place" className="text-sm font-semibold text-stone-800">Place / city / country *</label><input id="booking-place" className={fieldClass} name="place" autoComplete="address-level2" value={form.place} onChange={update} maxLength={120} required /></div>
            <div className="sm:col-span-2"><label htmlFor="booking-profession" className="text-sm font-semibold text-stone-800">Profession *</label><input id="booking-profession" className={fieldClass} name="profession" autoComplete="organization-title" value={form.profession} onChange={update} maxLength={120} required /></div>
          </div>
          {type === 'service' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-stone-700"><p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CreditCard size={17}/> Payment will be added after gateway approval</p><p className="mt-1">The center is confirming its US bank/payment gateway. We will not collect card details here or mark paid bookings as confirmed until secure payment processing is connected.</p></div>}
          {message && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{message}</p>}
          <button type="submit" className="w-full rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">{isFree ? 'Continue with free registration' : type === 'service' ? 'Continue to booking request' : 'Continue with event booking'}</button>
          <p className="flex items-start gap-2 text-xs leading-5 text-stone-500"><ShieldCheck size={15} className="mt-0.5 shrink-0"/> Your information should only be submitted once secure booking is enabled. Do not enter payment-card details into this form.</p>
        </form>
      </section>
    </div>
  );
}
