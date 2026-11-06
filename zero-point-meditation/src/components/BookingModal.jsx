import React, { useEffect, useState } from 'react';
import { X, CalendarDays, CreditCard, ShieldCheck, CheckCircle2, LoaderCircle } from 'lucide-react';

const announcedMorningMeditationDates = [
  { value: '2026-11-08', label: 'Sunday, November 8, 2026' },
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
 if(service==='Free Morning Meditation' || service==='Free Meditation Class')return announcedMorningMeditationDates.filter(s=>s.value>=dateValue());
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

export default function BookingModal({ open, onClose, initialType = 'event', initialService = '', initialTeacher = '', fixedSelection = false, workflow = 'standard' }) {
  const [type, setType] = useState(initialType);
  const [service, setService] = useState(initialService || 'Free Morning Meditation');
  const [externalEvent, setExternalEvent] = useState('lam-rim');
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
      setExternalEvent('lam-rim');
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

  const freeEventNames = ['Free Morning Meditation', 'Free Weekend Community Classes', 'Free Meditation Class', 'Free Event', 'Free Events'];
  const isExternalEvent = type === 'event' && service === 'Free Events';
  const isFree = type === 'event' && freeEventNames.includes(service);
  const serviceWorkflow = workflow === 'booking' || workflow === 'inquiry';
  const showPayment = workflow === 'booking' || (workflow === 'standard' && !isFree);
  const dateSessions = sessionsFor(service);
  const requiresDate = type === 'event' && ['Free Morning Meditation', 'Free Meditation Class', 'Free Weekend Community Classes'].includes(service);
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
        payment_preference: isFree ? 'not_applicable' : paymentPreference
      });
    }
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: serviceWorkflow ? 'service' : type,
          intent: workflow,
          service,
          externalEvent: isExternalEvent ? externalEvent : '',
          date: type === 'event' && ['Free Morning Meditation', 'Free Meditation Class', 'Free Weekend Community Classes'].includes(service) ? date : '',
          teacher: type === 'service' ? teacher : '',
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          place: form.place.trim(),
          profession: form.profession.trim(),
          paymentPreference: showPayment ? paymentPreference : 'not_applicable',
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
          payment_preference: showPayment ? paymentPreference : 'not_applicable'
        });
      }
      setMessage(workflow === 'inquiry'
        ? 'Thank you — your enquiry has been sent to the information team. A confirmation email has been sent to your address. The team will contact you with further details.'
        : isExternalEvent && result.externalEvent
          ? 'Thank you — we have emailed you the official registration link and event dates. Please complete your registration through the event organiser.'
        : isFree && result.confirmed
        ? `Your registration for ${service} is confirmed! No payment is required. The Zoom link and meeting ID for your selected session have been sent to your email.`
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
            <h2 id="booking-modal-title" className="mt-1 font-serif text-2xl font-bold text-buddhist-burgundy">{workflow === 'inquiry' ? 'Enquire about a service' : workflow === 'booking' ? 'Book this service' : 'Book a service or event'}</h2>
            <p className="mt-1 text-sm text-stone-600">{workflow === 'inquiry' ? 'Send a question to our information team. No payment details are required.' : 'Complete this form without leaving our website.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking form" className="rounded-full p-2 text-stone-600 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"><X size={22}/></button>
        </header>
        <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="booking-website">Leave this field empty</label>
            <input id="booking-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
          </div>
          {serviceWorkflow ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{workflow === 'booking' ? 'Service selected for booking' : 'Service selected for enquiry'}</p>
              <p className="mt-1 font-semibold text-buddhist-burgundy">{service}</p>
            </div>
          ) : fixedSelection ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Selected teacher service</p>
              <p className="mt-1 font-semibold text-buddhist-burgundy">{service}</p>
              {teacher && <p className="mt-1 text-sm text-stone-700">Teacher: {teacher}</p>}
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800">Step 1</p>
                <label htmlFor="booking-type" className="text-sm font-semibold text-stone-800">What would you like to book?</label>
                <select id="booking-type" value={type} onChange={event => { const nextType=event.target.value; const nextService=nextType==='event'?'Free Morning Meditation':'Meditation & Mindfulness'; setType(nextType); setService(nextService); setDate(sessionsFor(nextService)[0]?.value||''); setMessage(''); }} className={fieldClass}>
                  <option value="event">Event / class</option><option value="service">Service / appointment</option>
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800">Step 2</p>
                <label htmlFor="booking-service" className="text-sm font-semibold text-stone-800">{type === 'event' ? 'Choose an event or class' : 'Choose a service'}</label>
                <select id="booking-service" value={service} onChange={event => { setService(event.target.value); setDate(sessionsFor(event.target.value)[0]?.value||''); setMessage(''); }} className={fieldClass}>
                  {type === 'event' ? <>
                    <option>Free Meditation Class</option>
                    <option>Free Events</option>
                    <option>Other</option>
                  </> : <>
                    <optgroup label="Meditation & wellbeing">{availableServices.slice(0, 2).concat(availableServices[3]).map(item => <option key={item} value={item}>{item}</option>)}</optgroup>
                    <optgroup label="Guidance & community">{availableServices.slice(2, 3).concat(availableServices.slice(4)).map(item => <option key={item} value={item}>{item}</option>)}</optgroup>
                  </>}
                </select>
              </div>
            </div>
          )}
          {isExternalEvent && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-stone-700">
            <p className="font-semibold text-buddhist-burgundy">Choose an event package</p>
            <select value={externalEvent} onChange={event => setExternalEvent(event.target.value)} className={fieldClass}>
              <option value="lam-rim">The Three Principle Stages of the Buddhist Path: Lam Rim</option>
              <option value="bardo">Bardo, After-Life & Reincarnation with Gegye Yongyal Rinpoche</option>
            </select>
            <p className="mt-2">Each option is a multi-session package. We will email you the official registration link and all session dates.</p>
          </div>}
          {requiresDate && <div className="rounded-xl bg-amber-50 p-4 text-sm text-stone-700">
            <p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CalendarDays size={17}/> {['Free Morning Meditation', 'Free Meditation Class'].includes(service) ? 'Free Meditation Class · 6:30–7:15 AM' : 'Free Weekend Community Classes'}</p>
            <p className="mt-1">{['Free Morning Meditation', 'Free Meditation Class'].includes(service) ? 'Sunday morning sessions are held from 6:30–7:15 AM US Eastern Time. Your confirmation email includes the Zoom link and meeting ID for the selected date.' : 'Community classes are scheduled for Saturdays and Sundays through December 31, 2026. The center will confirm session details.'}</p>
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
          {showPayment && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-stone-700 space-y-3">
            <p className="flex items-center gap-2 font-semibold text-buddhist-burgundy"><CreditCard size={17}/> Payment preference</p>
            <p>The center will review your request and confirm availability and the final amount. If payment is required, the team will email you the authorised Zelle details. Please do not pay before receiving that email.</p>
            <fieldset className="space-y-2">
              <legend className="font-semibold text-stone-800">How would you prefer to pay?</legend>
              <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-white p-3">
                <input type="radio" name="paymentPreference" value="zelle" checked={paymentPreference === 'zelle'} onChange={() => setPaymentPreference('zelle')} className="mt-1 accent-amber-800" />
                <span><span className="block font-semibold text-stone-900">Zelle</span><span className="block text-xs text-stone-600">Zelle payment instructions will be emailed after the center confirms the booking and amount.</span></span>
              </label>

            </fieldset>
          </div>}
          {message && <p role="status" className={(message.startsWith('Thank you') || message.startsWith('Your registration')) ? 'rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950' : 'rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950'}>{(message.startsWith('Thank you') || message.startsWith('Your registration')) && <CheckCircle2 size={17} className="inline mr-2" />}{message}</p>}
          {(message.startsWith('Thank you') || message.startsWith('Your registration')) && <a href="https://wa.me/16464560843" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Questions? Contact us on WhatsApp</a>}
          <button type="submit" disabled={submitting || !hasAvailableDate} className="flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy-hover disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">{submitting && <LoaderCircle size={18} className="animate-spin" />}{submitting ? 'Sending…' : workflow === 'inquiry' ? 'Send enquiry' : workflow === 'booking' ? 'Send booking request' : isFree ? 'Register for free session' : type === 'service' ? 'Send booking enquiry' : 'Send event enquiry'}</button>
          <p className="flex items-start gap-2 text-xs leading-5 text-stone-500"><ShieldCheck size={15} className="mt-0.5 shrink-0"/> {workflow === 'inquiry' ? 'Your enquiry will be sent to the information team. No payment method or payment is required.' : isExternalEvent ? 'We will email the official external registration link. Your place is not reserved until you complete registration with the event organiser.' : isFree ? 'Free class registrations are confirmed automatically after successful submission. No payment is required.' : 'Your booking request will be sent to the bookings team. It is not confirmed until the center reviews and approves it. Do not pay before receiving authorised instructions.'}</p>
        </form>
      </section>
    </div>
  );
}
