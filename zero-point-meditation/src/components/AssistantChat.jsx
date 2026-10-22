import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, RotateCcw, Sparkles } from 'lucide-react';

const starterPrompts = [
  'How can I start meditating?',
  'What classes are available?',
  'How can I contact the centre?',
];

function demoReply(question) {
  const q = question.toLowerCase().replace(/[^a-z0-9\\s]/g, ' ');
  const asksAboutServices = /\\b(service|services|offer|offers|provide|provided|available|what do you do|what can i do|help with)\\b/.test(q);
  if (asksAboutServices) return 'Here are the services and activities currently listed on our website:\\n\\n• Meditation & Mindfulness — meditation practice and guidance for developing a personal practice.\\n• Prayer & Spiritual Guidance — spiritual learning, prayer, and guidance within the centre’s Buddhist tradition.\\n• Emotional Well-being — a compassionate community space and information about support resources.\\n• Community Gatherings — shared practice, cultural activities, and community events.\\n• Counselling Information — contact the centre to ask about current availability and verified referrals.\\n• Yoga — coming soon; the start date and schedule have not yet been confirmed.\\n\\nFor current class times, bookings, and availability, please contact the centre directly. Spiritual activities do not replace licensed mental-health care.';
  if (q.includes('meditat') || q.includes('mindful') || q.includes('start')) return 'Meditation and mindfulness are among the centre’s services. Ask the team about beginner-friendly guided practice and the next available class. Please confirm current times directly with the centre.';
  if (q.includes('class') || q.includes('schedule') || q.includes('sunday') || q.includes('when')) return 'The website lists a free Sunday community class, but its time and format still need confirmation. Please contact the centre before making plans to attend.';
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('address')) return 'You can use the contact details and enquiry form on this page to reach the centre.';
  if (q.includes('prayer') || q.includes('spiritual') || q.includes('guidance') || q.includes('teach')) return 'The centre describes spiritual learning, prayer, and guidance as areas to explore. Please contact the team to confirm what is currently offered.';
  if (q.includes('counsel') || q.includes('mental health') || q.includes('anxious') || q.includes('depress') || q.includes('emotional')) return 'The centre lists emotional well-being information and counselling enquiries. Please contact the centre to confirm available support and any verified referrals. Spiritual activities are not a replacement for licensed mental-health care.';
  if (q.includes('yoga')) return 'Yoga is marked as coming soon. There is not yet a confirmed start date or schedule.';
  if (q.includes('event') || q.includes('gather') || q.includes('community')) return 'Please explore the Events page and contact the centre to confirm upcoming dates and registration requirements.';
  if (q.includes('merch') || q.includes('art') || q.includes('shop') || q.includes('product')) return 'Please visit the Merchandise page to explore the centre’s art and merchandise.';
  return 'I can answer common questions about the centre’s listed services, classes, events, spiritual learning, and merchandise. Try asking “What services do you offer?” or choose one of the topics above. This preview uses prepared replies and is not connected to a live AI model yet.';
}

export default function AssistantChat() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hello! I can help you explore meditation, classes, spiritual learning, events, and other information about Zero Point Meditation Center. What would you like to know?' }]);
  const [draft, setDraft] = useState('');
  function sendMessage(text = draft) {
    const question = text.trim();
    if (!question) return;
    setMessages(prev => [...prev, { role: 'user', text: question }, { role: 'assistant', text: demoReply(question) }]);
    setDraft('');
  }
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white border border-stone-200 overflow-hidden">
      <div className="bg-buddhist-burgundy text-white p-6 sm:p-8">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-white/10 p-3"><Bot size={26}/></div><div><p className="text-xs uppercase tracking-widest text-amber-200 font-bold">Chat with us</p><h2 className="font-serif text-2xl sm:text-3xl font-bold">Zero Point Assistant</h2></div></div>
        <p className="mt-3 text-sm text-white/80 max-w-2xl">Have a question about meditation, classes, events, spiritual learning, or the centre? Start a conversation below.</p>
      </div>
      <div className="p-4 sm:p-6 space-y-5">
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-stone-700"><Sparkles size={16} className="text-buddhist-gold shrink-0 mt-0.5"/><p><strong>Preview mode:</strong> this chatbot currently uses sample replies and is not connected to a live AI model. Please confirm schedules and service details with the centre.</p></div>
        <div className="max-h-[420px] min-h-[220px] overflow-y-auto space-y-4 pr-1" aria-live="polite">
          {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'bg-buddhist-burgundy text-white rounded-br-md' : 'bg-stone-100 text-stone-800 rounded-bl-md'}`}>{message.text}</div></div>)}
        </div>
        {messages.length === 1 && <div className="flex flex-wrap gap-2">{starterPrompts.map(prompt => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="rounded-full border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-700 hover:border-buddhist-gold hover:bg-amber-50">{prompt}</button>)}</div>}
        <form onSubmit={event => { event.preventDefault(); sendMessage(); }} className="flex items-end gap-2 border border-stone-300 rounded-2xl p-2 focus-within:border-buddhist-gold">
          <label className="sr-only" htmlFor="contact-assistant-question">Your question</label><textarea id="contact-assistant-question" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} placeholder="Type your question..." className="min-h-11 max-h-28 flex-1 resize-y bg-transparent px-2 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"/>
          <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="inline-flex items-center justify-center rounded-xl bg-buddhist-burgundy p-3 text-white hover:bg-red-900 disabled:opacity-40"><Send size={18}/></button>
        </form>
        <div className="flex justify-between items-center gap-3"><p className="text-xs text-stone-500">Do not share private or sensitive personal information.</p><button type="button" onClick={() => { setMessages([{ role: 'assistant', text: 'Hello! I can help you explore meditation, classes, spiritual learning, events, and other information about Zero Point Meditation Center. What would you like to know?' }]); setDraft(''); }} className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-buddhist-burgundy"><RotateCcw size={13}/> Reset chat</button></div>
      </div>
    </motion.section>
  );
}
