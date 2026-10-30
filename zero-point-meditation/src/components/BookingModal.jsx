import React, { useEffect, useState } from 'react';
import { X, CalendarDays, CreditCard, ShieldCheck, CheckCircle2, LoaderCircle } from 'lucide-react';

const announcedMorningMeditationDates = [
  { value: '2026-11-07', label: 'Saturday, November 7, 2026' },
  { value: '2026-11-08', label: 'Sunday, November 8, 2026' },
  { value: '2026-11-14', label: 'Saturday, November 14, 2026' },
  { value: '2026-11-15', label: 'Sunday, November 15, 2026' },
];
function dateValue(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function weekendSessions() {
 const out=[], now=new Date(), d=new Date(now.getFullYear(),now.getMonth(),now.getDate()), end=new Date(2026,11,31);
 while(d<=end){if(d.getDay()===0||d.getDay()===6)out.push({value:dateValue(d),label:d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})});d.setDate(d.getDate()+1);}
 return out;
}
function sessionsFor(service) {
 if(service==='Free Weekend Community Classes')return weekendSessions();
 if(service==='Free Morning Meditation')return announcedMorningMeditationDates.filter(s=>s.value>=dateValue());
 return [];
}

const availableServices = [
  'Meditation & Mindfulness',
  'Meditation & Buddhist Practices',
  'Prayers & Spiritual Guidance',
  'Emotional Well-being',
  'Community Gatherings',
  'Counselling Information',
];

const fieldClass = 'mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20';

export default function BookingModal({ open, onClose, initialType = 'event', initialService = '', initialTeacher = '', fixedSelection = false }) {
  const [type, setType] = useState(initialType);
  const [service, setService] = useState(initialService || 'Free Morning Meditation');
  const [teacher, setTeacher] = useState(initialTeacher);
  const [date, setDate] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', place: '', profession: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentPreference, setPaymentPreference] = useState('zelle');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (open) {
      setType(initialType);
      const nextService = initialService || (initialType === 'event' ? 'Free Morning Meditation' : 'Meditation & Mindfulness');
      setService(nextService);
      setTeacher(initialTeacher);
      setDate(sessionsFor(nextService)[0]?.value || '');
      setMessage('');
      setPaymentPreference('zelle');
      setWebsite('');
    }
  }, [open, initialType, initialService, initialTeacher]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const freeEventNames = ['Free Morning Meditation', 'Free Weekend Community Classes', 'Free Meditation Class', 'Free Event'];
  const isFree = type === 'event' && freeEventNames.includes(service);
  const dateSessions = sessionsFor(service);
  const requiresDate = type === 'event' && ['Free Morning Meditation', 'Free Weekend Community Classes'].includes(service);
  const hasAvailableDate = !requiresDate || dateSessions.length > 0;
  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }
  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'booking_form_submit_attempt', {
        service_name: service,
        booking_type: type,
        form_location: 'booking_modal',
        payment_preference: type === 'service' ? paymentPreference : 'not_applicable'
      });
    }
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          service,
          date: type === 'event' && ['Free Morning Meditation', 'Free Weekend Community Classes'].includes(service) ? date : '',
          teacher: type === 'service' ? teacher : '',
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          place: form.place.trim(),
          profession: form.profession.trim(),
          paymentPreference: type === 'service' ? paymentPreference : 'not_applicable',
          website
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your request right now.');
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'booking_enquiry_submitted', {
          service_name: service,
          booking_type: type,
          form_location: 'booking_modal',
          payment_preference: type === 'service' ? paymentPreference : 'not_applicable'
        });
      }
      setMessage(isFree && result.confirmed
        ? `Your registration for ${service} is confirmed! No payment is required. The center will share any additional session or joining details separately if needed.`
        : isFree
          ? `Thank you — your registration for ${service} has been sent. Please check your email for confirmation details.`
          : type === 'event'
            ? 'Thank you — your event registration request has been sent. The center will contact you to confirm your place and share any relevant details. No payment is collected through this form.'
            : 'Thank you — your enquiry has been sent to Zero Point Meditation Center. The team will contact you to confirm availability, pricing, and next steps. Please wait for confirmation before making any payment.');
      setForm({ name: '', email: '', phone: '', place: '', profession: '' });
      setWebsite('');
    } catch (error) {
      setMessage(error.message || 'We could not send your enquiry. Please try again or contact the center directly.');
    } finally {
      setSubmitting(false);
    }
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
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="booking-website">Leave this field empty</label>
            <input id="booking-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
          </div>
          {fixedSelection ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Selected teacher service</p>
              <p className="mt-1 font-semibold text-buddhist-burgundy">{service}</p>
              {teacher && <p className="mt-1 text-sm text-stone-700">Teacher: {teacher}</p>}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-type" className="text-sm font-semibold text-stone-800">What would you like to book?</label>
                <select id="booking-type" value={type} onChange={event => { const nextType=event.target.value; const nextService=nextType==='event'?'Free Morning Meditation':'Meditation & Mindfulness'; setType(nextType); setService(nextService); setDate(sessionsFor(nextService)[0]?.value||''); setMessage(''); }} className={fieldClass}>
                  <option value="event">Event / class</option><option value="service">Service / appointment</option>
                </select>
              </div>
              <div>
                <label htmlFor="booking-service" className="text-sm font-semibold text-stone-800">{type === 'event' ? 'Choose an event' : 'Choose a service'}</label>
                <select id="booking-service" value={service} onChange={event => { setService(event.target.value); setDate(sessionsFor(event.target.value)[0]?.value||''); setMessage(''); }} className={fieldClass}>
                  {type === 'event' ? <>
                    <option>Free Morning Meditation</option><option>Free Weekend Community Classes</option><option>Free Meditation Class</option><option>Free Event</option><option>Community Gathering</option><option>Prayer Event</option><option>Other Event</option>
                  </> : availableServices.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          )}
          {requiresDate && <div className="rounded-xl bg-amber-50 p-4 text-sm text-stone-700">
            <p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CalendarDays size={17}/> {service === 'Free Morning Meditation' ? 'Free Morning Meditation · 6:30–7:15 AM' : 'Free Weekend Community Classes'}</p>
            <p className="mt-1">{service === 'Free Morning Meditation' ? 'Only dates announced by the center are listed here. Time zone and joining details will be confirmed by the center.' : 'Community classes are scheduled for Saturdays and Sundays through December 31, 2026. The center will confirm session details.'}</p>
            {dateSessions.length ? <>
              <label htmlFor="booking-date" className="mt-3 block font-semibold">Choose a date</label>
              <select id="booking-date" value={date} onChange={event => setDate(event.target.value)} className={fieldClass} required>{dateSessions.map(session => <option key={session.value} value={session.value}>{session.label}</option>)}</select>
            </> : <p className="mt-3 font-semibold text-amber-900">No upcoming dates are currently announced. Please contact the center for the next session.</p>}
          </div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="booking-name" className="text-sm font-semibold text-stone-800">Full name *</label><input id="booking-name" className={fieldClass} name="name" autoComplete="name" value={form.name} onChange={update} maxLength={120} required /></div>
            <div><label htmlFor="booking-email" className="text-sm font-semibold text-stone-800">Email address *</label><input id="booking-email" className={fieldClass} name="email" type="email" autoComplete="email" value={form.email} onChange={update} maxLength={254} required /></div>
            <div><label htmlFor="booking-phone" className="text-sm font-semibold text-stone-800">Phone number *</label><input id="booking-phone" className={fieldClass} name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} maxLength={40} required /></div>
            <div><label htmlFor="booking-place" className="text-sm font-semibold text-stone-800">Place / city / country *</label><input id="booking-place" className={fieldClass} name="place" autoComplete="address-level2" value={form.place} onChange={update} maxLength={120} required /></div>
            <div className="sm:col-span-2"><label htmlFor="booking-profession" className="text-sm font-semibold text-stone-800">Profession *</label><input id="booking-profession" className={fieldClass} name="profession" autoComplete="organization-title" value={form.profession} onChange={update} maxLength={120} required /></div>
          </div>
          {type === 'service' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-stone-700 space-y-3">
            <p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CreditCard size={17}/> Payment preference</p>
            <p>Payment is only requested after the center reviews your enquiry and confirms the service and amount. Please do not pay before receiving confirmation.</p>
            <fieldset className="space-y-2">
              <legend className="font-semibold text-stone-800">How would you prefer to pay?</legend>
              <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-white p-3">
                <input type="radio" name="paymentPreference" value="zelle" checked={paymentPreference === 'zelle'} onChange={() => setPaymentPreference('zelle')} className="mt-1 accent-amber-800" />
                <span><span className="block font-semibold text-stone-900">Zelle</span><span className="block text-xs text-stone-600">I can use Zelle if the center confirms this option for my booking.</span></span>
              </label>
              <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-white p-3">
                <input type="radio" name="paymentPreference" value="other" checked={paymentPreference === 'other'} onChange={() => setPaymentPreference('other')} className="mt-1 accent-amber-800" />
                <span><span className="block font-semibold text-stone-900">Discuss another payment option</span><span className="block text-xs text-stone-600">Please contact me about another available payment method.</span></span>
              </label>
            </fieldset>
          </div>}
          {message && <p role="status" className={message.startsWith('Thank you') ? 'rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950' : 'rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950'}>{message.startsWith('Thank you') && <CheckCircle2 size={17} className="inline mr-2" />}{message}</p>}
          <button type="submit" disabled={submitting || !hasAvailableDate} className="flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy-hover disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">{submitting && <LoaderCircle size={18} className="animate-spin" />}{submitting ? 'Sending enquiry…' : isFree ? 'Register for free session' : type === 'service' ? 'Send booking enquiry' : 'Send event enquiry'}</button>
          <p className="flex items-start gap-2 text-xs leading-5 text-stone-500"><ShieldCheck size={15} className="mt-0.5 shrink-0"/> {isFree ? 'Free class registrations are confirmed automatically after successful submission. No payment is required.' : 'This form sends an enquiry only. Your booking is not confirmed and no payment is collected until the center contacts you.'}</p>
        </form>
      </section>
    </div>
  );
}
