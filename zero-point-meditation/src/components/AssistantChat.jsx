import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  MessageCircle,
  X,
} from 'lucide-react';

const starterPrompts = [
  'How can I start meditating?',
  'What classes are available?',
  'How can I contact the centre?',
];

const welcomeMessage = {
  role: 'assistant',
  text: 'Hello! I can help you explore meditation, classes, spiritual learning, events, and other information about Zero Point Meditation Center. What would you like to know?',
};

function demoReply(question) {
  const q = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Contact questions
  if (
    /\b(contact|email|phone|address|reach you|reach the centre|reach the center)\b/.test(q) ||
    /\bhow can i (get in touch|contact)\b/.test(q)
  ) {
    return 'You can use the contact details and enquiry form on this page to reach the centre.';
  }

  // Counselling and mental-health questions
  // Keep this before general service questions.
  if (
    /\b(counsel\w*|therap\w*|mental health|anxious|anxiety|depress\w*|emotional support|psychological support)\b/.test(q) ||
    /\b(need|want|looking for)\b.*\b(support|help)\b/.test(q)
  ) {
    return 'The centre lists emotional well-being information and counselling enquiries. Please contact the centre to confirm whether counselling is currently available and whether verified referrals can be provided. Meditation and spiritual activities do not replace care from a licensed mental-health professional.';
  }

  // Yoga
  if (/\byoga\b/.test(q)) {
    return 'Yoga is marked as coming soon. There is not yet a confirmed start date or schedule. Please contact the centre for future updates.';
  }

  // Meditation and mindfulness
  if (/\b(meditat\w*|mindful\w*)\b/.test(q)) {
    return 'Meditation and mindfulness are among the centre’s listed services. If you are new to meditation, contact the team to ask about beginner-friendly guided practice and the next available class. Please confirm current times directly with the centre.';
  }

  // Classes and schedules
  if (
    /\b(class(?:es)?|schedule|timetable|sunday|session|sessions|workshop|beginner class)\b/.test(q) ||
    /\bwhen\b.*\b(class|session|open|meet|start)\b/.test(q)
  ) {
    return 'The website lists a free Sunday community class, but its time and format still need confirmation. Please contact the centre before making plans to attend.';
  }

  // Prayer and spiritual guidance
  if (/\b(prayer|spiritual|guidance|teachings?|buddhis\w*)\b/.test(q)) {
    return 'The centre describes spiritual learning, prayer, and guidance within its Buddhist tradition as areas to explore. Please contact the team to confirm what activities or guidance are currently available.';
  }

  // Events and community
  if (/\b(event\w*|gather\w*|community|celebration|retreat)\b/.test(q)) {
    return 'Please explore the Events page for information about the centre’s activities. Contact the centre to confirm upcoming dates, availability, and any registration requirements.';
  }

  // Merchandise
  if (/\b(merch\w*|artwork|shop|products?|buy|purchase)\b/.test(q)) {
    return 'Please visit the Merchandise page to explore the centre’s art and merchandise. Contact the centre if you need information about availability or purchasing.';
  }

  // General service questions
  const asksAboutServices =
    /\b(services?|offer(?:s|ing)?|provide(?:s|d)?|available|help with)\b/.test(q) ||
    /\bwhat do you do\b/.test(q) ||
    /\bwhat can (?:you|u) do\b/.test(q) ||
    /\bwhat can (?:you|u) help\b/.test(q) ||
    /\bwhat\b.*\b(centre|center)\b.*\b(do|offer|provide)\b/.test(q);

  if (asksAboutServices) {
    return 'Here are the services and activities currently listed on our website:\n\n• Meditation & Mindfulness — meditation practice and guidance for developing a personal practice.\n• Prayer & Spiritual Guidance — spiritual learning, prayer, and guidance within the centre’s Buddhist tradition.\n• Emotional Well-being — a compassionate community space and information about support resources.\n• Community Gatherings — shared practice, cultural activities, and community events.\n• Counselling Information — contact the centre to ask about current availability and verified referrals.\n• Yoga — coming soon; the start date and schedule have not yet been confirmed.\n\nFor current class times, bookings, and availability, please contact the centre directly. Spiritual activities do not replace licensed mental-health care.';
  }

  return 'I can answer common questions about the centre’s listed services, classes, events, spiritual learning, and merchandise. Try asking “What services do you offer?”, “Do you offer counselling?”, or “How can I contact the centre?” This preview uses prepared replies and is not connected to a live AI model yet.';
}

export default function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState('');

  function sendMessage(text = draft) {
    const question = text.trim();

    if (!question) return;

    const reply = demoReply(question);

    setMessages((previousMessages) => [
      ...previousMessages,
      { role: 'user', text: question },
      { role: 'assistant', text: reply },
    ]);

    setDraft('');
  }

  function resetChat() {
    setMessages([welcomeMessage]);
    setDraft('');
  }

  return (
    <div className="w-full">
      {/* Chatbot toggle button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="zero-point-chat-panel"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-buddhist-burgundy px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-buddhist-gold focus:ring-offset-2"
        >
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}

          <span>
            {isOpen ? 'Close Assistant' : 'Need Help? Get AI Assistance'}
          </span>

          {!isOpen && <Sparkles size={18} />}
        </button>

        {!isOpen && (
          <p className="mt-2 text-center text-sm text-stone-500">
            Have a question? Open our assistant for information about services,
            classes, events, and more.
          </p>
        )}
      </div>

      {/* Chat window: hidden until the visitor clicks the button */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id="zero-point-chat-panel"
            key="zero-point-chat-panel"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
          >
            {/* Header */}
            <div className="bg-buddhist-burgundy p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <Bot size={26} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-200">
                    Chat with us
                  </p>
                  <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                    Zero Point Assistant
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm text-white/80">
                Ask us about meditation, classes, events, spiritual learning,
                or the centre.
              </p>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              {/* Preview notice */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-stone-700">
                <Sparkles
                  size={16}
                  className="mt-0.5 shrink-0 text-buddhist-gold"
                />
                <p>
                  <strong>Preview mode:</strong> this chatbot currently uses
                  prepared replies and is not connected to a live AI model.
                  Please confirm schedules and service details with the centre.
                </p>
              </div>

              {/* Messages */}
              <div
                className="max-h-[420px] min-h-[220px] space-y-4 overflow-y-auto pr-1"
                aria-live="polite"
                aria-relevant="additions"
              >
                {messages.map((message, index) => (
                  <div
                    key={`${index}-${message.role}`}
                    className={`flex ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-buddhist-burgundy text-white'
                          : 'rounded-bl-md bg-stone-100 text-stone-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested questions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-stone-300 px-3 py-2 text-xs text-stone-700 transition hover:border-buddhist-gold hover:bg-amber-50 sm:text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
                className="flex items-end gap-2 rounded-2xl border border-stone-300 p-2 focus-within:border-buddhist-gold"
              >
                <label
                  className="sr-only"
                  htmlFor="contact-assistant-question"
                >
                  Your question
                </label>

                <textarea
                  id="contact-assistant-question"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Type your question..."
                  className="min-h-11 max-h-28 flex-1 resize-y bg-transparent px-2 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  className="inline-flex items-center justify-center rounded-xl bg-buddhist-burgundy p-3 text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>

              {/* Disclaimer and actions */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-stone-500">
                  Do not share private or sensitive personal information.
                </p>

                <button
                  type="button"
                  onClick={resetChat}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-stone-600 hover:text-buddhist-burgundy"
                >
                  <RotateCcw size={13} />
                  Reset chat
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}