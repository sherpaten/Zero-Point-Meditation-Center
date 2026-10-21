import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, HeartHandshake, Flower2, BookOpen, Sparkles, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const questions = [
  { key: 'meditation', question: 'Would you like to learn or practise meditation?', yes: 'Guided meditation and teachings', no: null },
  { key: 'spiritual', question: 'Are you looking for spiritual learning or prayer?', yes: 'Prayer and spiritual guidance', no: null },
  { key: 'community', question: 'Would you like to join community gatherings or group activities?', yes: 'Community gatherings and events', no: null },
  { key: 'wellbeing', question: 'Would compassionate, non-clinical emotional well-being support be helpful?', yes: 'Emotional well-being resources and compassionate guidance', no: null },
  { key: 'professional', question: 'Would you like information about qualified counselling or professional support?', yes: 'Information about counselling and qualified professional support', no: null },
];

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Services() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const current = new Date();
  const displayed = new Date(current.getFullYear(), current.getMonth() + monthOffset, 1);
  const calendarCells = useMemo(() => {
    const firstDay = new Date(displayed.getFullYear(), displayed.getMonth(), 1).getDay();
    const days = new Date(displayed.getFullYear(), displayed.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [displayed.getFullYear(), displayed.getMonth()]);
  const recommendations = questions.filter(q => answers[q.key] === 'yes').map(q => q.yes);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Sparkles size={14}/> Find your next step</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">Services, Classes & Community</h1>
        <p className="text-stone-600 leading-relaxed">Explore meditation, spiritual guidance, community activities, and well-being resources. Use the guided finder to see which options may fit your interests.</p>
      </motion.header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: <Flower2 size={24}/>, title: 'Meditation & Mindfulness', text: 'Group practice, meditation instruction, and opportunities to build a personal practice.' },
          { icon: <BookOpen size={24}/>, title: 'Prayer & Spiritual Guidance', text: 'Spiritual learning and guidance within the centre’s Buddhist tradition.' },
          { icon: <HeartHandshake size={24}/>, title: 'Emotional Well-being', text: 'A compassionate, welcoming space and information about available support resources.' },
          { icon: <Users size={24}/>, title: 'Community Gatherings', text: 'Shared practice, cultural activities, and community events.' },
          { icon: <HeartHandshake size={24}/>, title: 'Counselling Information', text: 'Ask us about qualified professionals and the scope of any counselling services before booking.' },
          { icon: <Sparkles size={24}/>, title: 'Yoga — Coming Soon', text: 'Yoga sessions are being planned. Details will be added once the schedule is confirmed.' },
        ].map((item) => <article key={item.title} className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm space-y-3">
          <div className="text-buddhist-gold">{item.icon}</div><h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{item.title}</h2><p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
        </article>)}
      </section>

      <section className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-9 space-y-6">
        <div className="max-w-2xl space-y-2"><span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">Guided service finder</span><h2 className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">What are you looking for?</h2><p className="text-stone-600 text-sm">Answer five yes/no questions for suggested next steps. This simple guide is not a diagnostic tool or a substitute for professional advice.</p></div>
        <div className="space-y-4">
          {questions.map((q, index) => <div key={q.key} className="border-b border-stone-100 pb-4 last:border-0">
            <p className="font-semibold text-stone-800 mb-3">{index + 1}. {q.question}</p>
            <div className="flex gap-3">{['yes','no'].map(answer => <button key={answer} type="button" onClick={() => { setAnswers(prev => ({...prev, [q.key]: answer})); setShowResults(false); }} aria-pressed={answers[q.key] === answer} className={`px-5 py-2 rounded-full border text-sm font-semibold capitalize transition-colors ${answers[q.key] === answer ? 'bg-buddhist-burgundy text-white border-buddhist-burgundy' : 'border-stone-300 text-stone-700 hover:border-buddhist-gold'}`}>{answer}</button>)}</div>
          </div>)}
        </div>
        <div className="flex flex-wrap gap-3"><button onClick={() => setShowResults(true)} className="rounded-xl bg-buddhist-burgundy text-white px-6 py-3 font-semibold hover:bg-red-900">Show suggestions</button><button onClick={() => {setAnswers({});setShowResults(false);}} className="rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-700">Reset answers</button></div>
        {showResults && <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-3"><h3 className="font-serif text-xl font-bold text-buddhist-burgundy">Suggested next steps</h3>{recommendations.length ? <ul className="list-disc pl-5 space-y-1 text-sm text-stone-700">{recommendations.map(item => <li key={item}>{item}</li>)}</ul> : <p className="text-sm text-stone-700">You can start by exploring the centre’s teachings or contacting the team to discuss what is currently available.</p>}<p className="text-xs text-stone-600">Availability and professional credentials should be confirmed with the centre. This finder does not assess or diagnose mental health conditions.</p></div>}
      </section>

      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div className="space-y-4"><span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Clock size={14}/> Weekly schedule</span><h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">Classes & Practice</h2><p className="text-stone-600 text-sm leading-relaxed">The schedule below is a planning placeholder. Please confirm class times, location, online access, and registration details with the centre before attending.</p>
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
