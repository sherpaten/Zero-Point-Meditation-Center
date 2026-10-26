import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, HeartHandshake, Flower2, BookOpen, Sparkles, Users, Clock, ChevronLeft, ChevronRight, HandHeart, MapPin, CalendarPlus, ArrowRight } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function makeCalendarInvite(date, title) {
  const datePart = date.replaceAll('-', '');
  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zero Point Meditation Center//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${datePart}-sunday-class@zeropointmeditationcenter.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\\.\\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${datePart}`,
    `DTEND;VALUE=DATE:${datePart}`,
    `SUMMARY:${title}`,
    'DESCRIPTION:Free Sunday community class. Please contact Zero Point Meditation Center to confirm the time and format before attending.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\\r\\n');
  const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `zero-point-sunday-class-${date}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Services() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const current = new Date();
  current.setHours(0, 0, 0, 0);
  const displayed = new Date(current.getFullYear(), current.getMonth() + monthOffset, 1);
  const year = displayed.getFullYear();
  const month = displayed.getMonth();
  const todayKey = dateKey(current.getFullYear(), current.getMonth(), current.getDate());
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [year, month]);

  const sundayEvents = useMemo(() => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1)
      .filter(day => new Date(year, month, day).getDay() === 0)
      .map(day => ({ day, date: dateKey(year, month, day), title: 'Free Sunday community class', time: 'Time to be announced', details: 'A free weekly community class. Please contact the centre to confirm the time, location, and format before attending.' }));
  }, [year, month]);

  const selectedEvent = selectedDate ? sundayEvents.find(event => event.date === selectedDate) : null;
  const firstUpcomingSunday = useMemo(() => {
    const start = new Date(current);
    for (let i = 0; i < 14; i += 1) {
      const candidate = new Date(start);
      candidate.setDate(start.getDate() + i);
      if (candidate.getDay() === 0) return dateKey(candidate.getFullYear(), candidate.getMonth(), candidate.getDate());
    }
    return todayKey;
  }, [todayKey]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Sparkles size={14}/> Explore and connect</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">Services, Classes & Community</h1>
        <p className="text-stone-600 leading-relaxed">Explore meditation, spiritual guidance, community activities, and well-being resources. Ask the centre’s chatbot preview a question to find your next step.</p>
      </motion.header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: <Flower2 size={24}/>, title: 'Meditation & Mindfulness', text: 'Group practice, meditation instruction, and opportunities to build a personal practice.', price: 'Contact us for pricing' },
          { icon: <BookOpen size={24}/>, title: 'Prayers & Spiritual Guidance', text: 'Traditional prayers and Buddhist spiritual guidance.', price: '$350 per lama / $1755 for 5 lamas' },
          { icon: <HeartHandshake size={24}/>, title: 'Emotional Well-being', text: 'A compassionate, welcoming space and information about available support resources.', price: 'Contact us for pricing' },
          { icon: <Users size={24}/>, title: 'Community Gatherings', text: 'Shared practice, cultural activities, and community events.', price: 'Contact us for pricing' },
          { icon: <HeartHandshake size={24}/>, title: 'Counselling Information', text: 'Ask the centre about qualified professionals and verified counselling referrals before booking.', price: 'Contact us for pricing' },
          { icon: <Sparkles size={24}/>, title: 'Yoga — Coming Soon', text: 'Yoga sessions are being planned. Details will be added once the schedule is confirmed.', price: 'Price to be announced' },
        ].map(item => <article key={item.title} className="rounded-2xl border border-amber-100 bg-white p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">{item.icon}</div>
          <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{item.title}</h2>
          <p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
          <div className="border-t border-amber-100 pt-3"><p className="text-sm font-bold text-buddhist-burgundy">{item.price}</p></div>
        </article>)}
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><HandHeart size={14}/> Meet your service providers</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Prayer Services & Spiritual Guidance</h2>
          <p className="text-stone-600 leading-relaxed">Meet our service providers and learn about their services and individual fixed prices.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="h-44 sm:h-48 bg-stone-100">
              <img src={gegyeYongyalRinpoche} alt="Gegye Yongyal Rinpoche" className="h-full w-full object-cover object-top" loading="lazy"/>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div><p className="text-xs font-bold uppercase tracking-widest text-buddhist-gold">Service provider</p><h3 className="mt-2 font-serif text-xl font-bold text-buddhist-burgundy">Gegye Yongyal Rinpoche</h3><p className="mt-1 text-sm text-stone-500">Rinpoche · Lama</p></div>
              <p className="text-sm leading-relaxed text-stone-600">Prayer services and Buddhist spiritual guidance, with a fixed four-hour session.</p>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3"><p className="text-xs uppercase tracking-wide text-stone-600">Fixed service price</p><p className="mt-1 text-2xl font-bold text-buddhist-burgundy">$500</p><p className="mt-1 text-sm font-medium text-stone-700">For a 4-hour prayer session</p></div>
              <a href="/contact" className="inline-flex w-fit items-center justify-center rounded-full bg-buddhist-burgundy px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Enquire about prayer services</a>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-buddhist-burgundy via-[#642b39] to-[#8b6340] p-6 sm:p-9 text-white shadow-lg">
          <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full border border-white/15" aria-hidden="true"/>
          <div className="absolute -right-1 top-8 h-28 w-28 rounded-full border border-white/10" aria-hidden="true"/>
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest"><HeartHandshake size={15}/> Open to everyone · No fee</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Find Your Moment of Peace</h2>
              <p className="max-w-xl leading-relaxed text-white/85">Join our free Sunday community class. Take time to pause, practise mindfulness, and connect with the community.</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-2"><CalendarDays size={17}/> Every Sunday</span>
                <span className="inline-flex items-center gap-2"><Clock size={17}/> Time to be announced</span>
                <span className="inline-flex items-center gap-2"><MapPin size={17}/> Confirm details with the centre</span>
              </div>
            </div>
            <a href="/contact" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-buddhist-burgundy transition hover:bg-amber-50">Ask about the class <ArrowRight size={17}/></a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Clock size={14}/> Weekly schedule</span>
            <h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">Classes & Practice</h2>
            <p className="text-stone-600 text-sm leading-relaxed">The free Sunday class is listed weekly. Its exact time, location, and format still need confirmation from the centre.</p>
            <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold"><CalendarDays size={23}/></div>
                <div className="min-w-0">
                  <h3 className="font-bold text-stone-800">Sunday community class</h3>
                  <p className="text-sm text-stone-600 mt-1">Every Sunday · Free</p>
                  <p className="text-sm text-stone-500 mt-1">Time and format to be announced.</p>
                  <a href="/contact" className="inline-flex mt-3 items-center gap-2 text-sm font-semibold text-buddhist-burgundy hover:underline">Confirm class details <ArrowRight size={15}/></a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-5 text-sm text-stone-600">More weekly classes will be listed here when their schedules are confirmed.</div>
          </div>

          <div className="rounded-3xl bg-white border border-stone-200 p-5 sm:p-7 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">Explore upcoming dates</span><h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">{monthNames[month]} {year}</h2></div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setMonthOffset(0); setSelectedDate(null); }} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-amber-50">Today</button>
                <button aria-label="Previous month" onClick={() => { setMonthOffset(v => v - 1); setSelectedDate(null); }} className="p-2 rounded-lg border border-stone-200 hover:bg-amber-50"><ChevronLeft size={18}/></button>
                <button aria-label="Next month" onClick={() => { setMonthOffset(v => v + 1); setSelectedDate(null); }} className="p-2 rounded-lg border border-stone-200 hover:bg-amber-50"><ChevronRight size={18}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500">{weekDays.map(day => <div key={day} className="py-2">{day}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, i) => {
                if (!day) return <div key={`blank-${i}`} className="min-h-11 sm:min-h-12" aria-hidden="true"/>;
                const key = dateKey(year, month, day);
                const isSunday = new Date(year, month, day).getDay() === 0;
                const isToday = key === todayKey;
                const isSelected = key === selectedDate;
                return <button key={key} type="button" onClick={() => setSelectedDate(key)} aria-pressed={isSelected} aria-label={`${monthNames[month]} ${day}${isSunday ? ', free Sunday community class, time to be announced' : ''}`} className={`relative flex min-h-11 sm:min-h-12 flex-col items-center justify-center rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-buddhist-gold ${isSelected ? 'bg-buddhist-burgundy text-white' : isSunday ? 'bg-amber-50 font-bold text-buddhist-burgundy hover:bg-amber-100' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'} ${isToday && !isSelected ? 'ring-2 ring-buddhist-gold ring-inset' : ''}`}>
                  {day}{isSunday && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-buddhist-gold'}`} aria-hidden="true"/>}
                </button>;
              })}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500"><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-buddhist-gold"/> Sunday free class (time to be announced)</span><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border-2 border-buddhist-gold"/> Today</span></div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:p-5" aria-live="polite">
              {selectedDate ? (
                selectedEvent ? <div className="space-y-3"><p className="text-xs font-bold uppercase tracking-widest text-buddhist-gold">Selected date · {new Date(year, month, selectedEvent.day).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h3 className="font-serif text-xl font-bold text-buddhist-burgundy">{selectedEvent.title}</h3><p className="text-sm text-stone-600">{selectedEvent.details}</p><div className="flex flex-wrap gap-2"><button onClick={() => makeCalendarInvite(selectedEvent.date, selectedEvent.title)} className="inline-flex items-center gap-2 rounded-full bg-buddhist-burgundy px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"><CalendarPlus size={16}/> Add to my calendar</button><a href="/contact" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Ask about this class</a></div></div> : <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-widest text-stone-500">Selected date</p><h3 className="font-serif text-lg font-bold text-buddhist-burgundy">{new Date(year, month, Number(selectedDate.slice(-2))).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3><p className="text-sm text-stone-600">No event is currently listed for this date. Please check back for confirmed events.</p></div>
              ) : <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-widest text-buddhist-gold">Select a date</p><h3 className="font-serif text-lg font-bold text-buddhist-burgundy">See what's happening</h3><p className="text-sm text-stone-600">Choose a date to view its event details. Sundays are highlighted for the free weekly class; its time and format are awaiting confirmation.</p><p className="text-xs text-stone-500">Next upcoming Sunday: {new Date(firstUpcomingSunday + 'T12:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}.</p></div>}
            </div>
            <p className="text-xs text-stone-500">Only the recurring free Sunday class is shown for now. Other events will be added when the centre confirms their dates and details.</p>
          </div>
        </div>
      </section>
      <p className="text-xs text-stone-500 text-center max-w-3xl mx-auto">Important: spiritual guidance and community activities are not a replacement for licensed mental health care. If you need clinical support, contact a qualified professional or local health service.</p>
    </div>
  );
}