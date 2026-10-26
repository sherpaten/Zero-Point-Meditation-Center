import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, HeartHandshake, Flower2, BookOpen, Sparkles, Users, Clock, ChevronLeft, ChevronRight, HandHeart } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export default function Services() {
  const [monthOffset, setMonthOffset] = useState(0);
  const current = new Date();
  const displayed = new Date(current.getFullYear(), current.getMonth() + monthOffset, 1);
  const calendarCells = useMemo(() => {
    const firstDay = new Date(displayed.getFullYear(), displayed.getMonth(), 1).getDay();
    const days = new Date(displayed.getFullYear(), displayed.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [displayed.getFullYear(), displayed.getMonth()]);

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
          { icon: <BookOpen size={24}/>, title: 'Prayers & Spiritual Guidance', text: 'Traditional prayers and Buddhist spiritual guidance.', price: '$500 for a 4-hour prayer service' },
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
          <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><HandHeart size={14}/> Meet your service provider</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Prayer Services with Gegye Yongyal Rinpoche</h2>
          <p className="text-stone-600 leading-relaxed">Learn about prayer services led by our Rinpoche. The service has a fixed price of $500 for a four-hour prayer session.</p>
        </div>
        <article className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm md:grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="min-h-72 bg-stone-100">
            <img src={gegyeYongyalRinpoche} alt="Gegye Yongyal Rinpoche" className="h-full min-h-72 w-full object-cover object-top" loading="lazy"/>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center gap-4">
            <div><p className="text-xs font-bold uppercase tracking-widest text-buddhist-gold">Service provider</p><h3 className="mt-2 font-serif text-2xl font-bold text-buddhist-burgundy">Gegye Yongyal Rinpoche</h3><p className="mt-1 text-sm text-stone-500">Rinpoche · Lama</p></div>
            <p className="text-sm leading-relaxed text-stone-600">Prayer services and Buddhist spiritual guidance, with a fixed four-hour session.</p>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4"><p className="text-xs uppercase tracking-wide text-stone-600">Fixed service price</p><p className="mt-1 text-2xl font-bold text-buddhist-burgundy">$500</p><p className="mt-1 text-sm font-medium text-stone-700">For a 4-hour prayer session</p></div>
            <a href="/contact" className="inline-flex w-fit items-center justify-center rounded-full bg-buddhist-burgundy px-5 py-3 text-sm font-semibold text-white hover:opacity-90">Enquire about prayer services</a>
          </div>
        </article>
      </section>

      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div className="space-y-4"><span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Clock size={14}/> Weekly schedule</span><h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">Classes & Practice</h2><p className="text-stone-600 text-sm leading-relaxed">Please confirm class times, location, online access, and registration details with the centre before attending.</p>
          <div className="rounded-2xl bg-white border border-stone-200 p-5"><div className="flex items-start gap-4"><CalendarDays className="text-buddhist-gold shrink-0" size={22}/><div><h3 className="font-bold text-stone-800">Sunday community class</h3><p className="text-sm text-stone-600 mt-1">Free class — time and format to be confirmed.</p><span className="inline-block mt-3 text-xs rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-stone-700">Free · Schedule confirmation pending</span></div></div></div>
          <div className="rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-5 text-sm text-stone-600">More weekly classes will be listed here when confirmed.</div>
        </div>
        <div className="rounded-3xl bg-white border border-stone-200 p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between gap-3"><div><span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">Monthly view</span><h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">{monthNames[displayed.getMonth()]} {displayed.getFullYear()}</h2></div><div className="flex gap-2"><button aria-label="Previous month" onClick={() => setMonthOffset(v => v - 1)} className="p-2 rounded-lg border border-stone-200 hover:bg-amber-50"><ChevronLeft size={18}/></button><button aria-label="Next month" onClick={() => setMonthOffset(v => v + 1)} className="p-2 rounded-lg border border-stone-200 hover:bg-amber-50"><ChevronRight size={18}/></button></div></div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <div key={day} className="py-2">{day}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">{calendarCells.map((day, i) => <div key={i} className={`min-h-10 sm:min-h-12 rounded-lg flex items-center justify-center text-sm ${day ? 'bg-stone-50 text-stone-700' : ''}`}>{day || ''}</div>)}</div>
          <p className="text-xs text-stone-500">Event dates will appear here once the centre confirms them. No events are scheduled in this calendar yet.</p>
        </div>
      </section>
      <p className="text-xs text-stone-500 text-center max-w-3xl mx-auto">Important: spiritual guidance and community activities are not a replacement for licensed mental health care. If you need clinical support, contact a qualified professional or local health service.</p>
    </div>
  );
}
