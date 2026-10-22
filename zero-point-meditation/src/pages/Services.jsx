import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, HeartHandshake, Flower2, BookOpen, Sparkles, Users, Clock, ChevronLeft, ChevronRight, Bot, Send, RotateCcw } from 'lucide-react';

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const starterPrompts = [
  'How can I start meditating?',
  'What classes are available?',
  'How can I contact the centre?',
];

function demoReply(question) {
  const q = question.toLowerCase();
  if (q.includes('meditat') || q.includes('mindful') || q.includes('start')) {
    return 'Meditation and mindfulness are among the services highlighted by the centre. A gentle first step is to ask the team about beginner-friendly guided practice and the next available class. Please confirm current times directly with the centre.';
  }
  if (q.includes('class') || q.includes('schedule') || q.includes('sunday') || q.includes('when')) {
    return 'The page currently lists a free Sunday community class, but its time and format still need confirmation. Other class dates will be added once confirmed. Please contact the centre before making plans to attend.';
  }
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('address')) {
    return 'Please use the Contact page on this website to reach the centre. I do not have verified contact details available in this preview, so I do not want to guess.';
  }
  if (q.includes('prayer') || q.includes('spiritual') || q.includes('guidance') || q.includes('teach')) {
    return 'The centre page describes spiritual learning, prayer, and guidance as areas to explore. Please contact the team to ask what guidance or teachings are currently offered and whether an appointment is needed.';
  }
  if (q.includes('counsel') || q.includes('mental health') || q.includes('anxious') || q.includes('depress') || q.includes('emotional')) {
    return 'The centre aims to provide a welcoming and compassionate environment. Spiritual activities are not a replacement for licensed mental-health care. For clinical concerns, please contact a qualified professional or local health service; ask the centre directly about any verified counselling referrals.';
  }
  if (q.includes('yoga')) {
    return 'Yoga is marked as coming soon on this page. There is not yet a confirmed start date or schedule.';
  }
  if (q.includes('event') || q.includes('gather') || q.includes('community')) {
    return 'You can explore the Events page for the centre’s event information. Please check with the centre to confirm upcoming dates, availability, and any registration requirements.';
  }
  if (q.includes('merch') || q.includes('art') || q.includes('shop') || q.includes('product')) {
    return 'Please visit the Merchandise page to explore the centre’s art and merchandise information.';
  }
  return 'Thanks for your question. This is a chatbot interface preview and is not connected to an AI service yet. I can only show sample responses for common topics right now. Please check the relevant page or contact the centre for confirmed information.';
}

export default function Services() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I can help you explore meditation, classes, spiritual learning, events, and other information about Zero Point Meditation Center. What would you like to know?' },
  ]);
  const [draft, setDraft] = useState('');
  const [monthOffset, setMonthOffset] = useState(0);
  const current = new Date();
  const displayed = new Date(current.getFullYear(), current.getMonth() + monthOffset, 1);
  const calendarCells = useMemo(() => {
    const firstDay = new Date(displayed.getFullYear(), displayed.getMonth(), 1).getDay();
    const days = new Date(displayed.getFullYear(), displayed.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [displayed.getFullYear(), displayed.getMonth()]);

  function sendMessage(text = draft) {
    const question = text.trim();
    if (!question) return;
    setMessages(prev => [...prev, { role: 'user', text: question }, { role: 'assistant', text: demoReply(question) }]);
    setDraft('');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Sparkles size={14}/> Explore and connect</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">Services, Classes & Community</h1>
        <p className="text-stone-600 leading-relaxed">Explore meditation, spiritual guidance, community activities, and well-being resources. Ask the centre’s chatbot preview a question to find your next step.</p>
      </motion.header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: <Flower2 size={24}/>, title: 'Meditation & Mindfulness', text: 'Group practice, meditation instruction, and opportunities to build a personal practice.' },
          { icon: <BookOpen size={24}/>, title: 'Prayer & Spiritual Guidance', text: 'Spiritual learning and guidance within the centre’s Buddhist tradition.' },
          { icon: <HeartHandshake size={24}/>, title: 'Emotional Well-being', text: 'A compassionate, welcoming space and information about available support resources.' },
          { icon: <Users size={24}/>, title: 'Community Gatherings', text: 'Shared practice, cultural activities, and community events.' },
          { icon: <HeartHandshake size={24}/>, title: 'Counselling Information', text: 'Ask the centre about qualified professionals and verified counselling referrals before booking.' },
          { icon: <Sparkles size={24}/>, title: 'Yoga — Coming Soon', text: 'Yoga sessions are being planned. Details will be added once the schedule is confirmed.' },
        ].map(item => <article key={item.title} className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm space-y-3">
          <div className="text-buddhist-gold">{item.icon}</div><h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{item.title}</h2><p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
        </article>)}
      </section>

      <section className="rounded-3xl bg-white border border-stone-200 overflow-hidden">
        <div className="bg-buddhist-burgundy text-white p-6 sm:p-8">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-white/10 p-3"><Bot size={26}/></div><div><p className="text-xs uppercase tracking-widest text-amber-200 font-bold">Ask us</p><h2 className="font-serif text-2xl sm:text-3xl font-bold">Zero Point Assistant</h2></div></div>
          <p className="mt-3 text-sm text-white/80 max-w-2xl">Ask a question about meditation, classes, events, spiritual learning, or the centre. The AI connection will be added after this interface is reviewed.</p>
        </div>
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-stone-700"><Sparkles size={16} className="text-buddhist-gold shrink-0 mt-0.5"/><p><strong>Preview mode:</strong> this interface currently uses sample replies and is not connected to a live AI model. Confirm schedules, services, and other details with the centre.</p></div>
          <div className="max-h-[420px] min-h-[220px] overflow-y-auto space-y-4 pr-1" aria-live="polite">
            {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'bg-buddhist-burgundy text-white rounded-br-md' : 'bg-stone-100 text-stone-800 rounded-bl-md'}`}>{message.text}</div></div>)}
          </div>
          {messages.length === 1 && <div className="flex flex-wrap gap-2">{starterPrompts.map(prompt => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="rounded-full border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-700 hover:border-buddhist-gold hover:bg-amber-50">{prompt}</button>)}</div>}
          <form onSubmit={event => { event.preventDefault(); sendMessage(); }} className="flex items-end gap-2 border border-stone-300 rounded-2xl p-2 focus-within:border-buddhist-gold">
            <label className="sr-only" htmlFor="assistant-question">Your question</label><textarea id="assistant-question" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} placeholder="Type your question..." className="min-h-11 max-h-28 flex-1 resize-y bg-transparent px-2 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"/>
            <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="inline-flex items-center justify-center rounded-xl bg-buddhist-burgundy p-3 text-white hover:bg-red-900 disabled:opacity-40"><Send size={18}/></button>
          </form>
          <div className="flex justify-between items-center gap-3"><p className="text-xs text-stone-500">Do not share private or sensitive personal information.</p><button type="button" onClick={() => { setMessages([{ role: 'assistant', text: 'Hello! I can help you explore meditation, classes, spiritual learning, events, and other information about Zero Point Meditation Center. What would you like to know?' }]); setDraft(''); }} className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-buddhist-burgundy"><RotateCcw size={13}/> Reset chat</button></div>
        </div>
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
