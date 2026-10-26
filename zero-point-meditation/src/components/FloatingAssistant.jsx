
import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AssistantChat from './AssistantChat';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-assistant-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200"
          >
            <div className="flex items-center justify-between bg-buddhist-burgundy px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <span className="font-semibold">Zero Point Assistant</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[min(70vh,600px)] overflow-y-auto p-3">
              <AssistantChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close AI assistance' : 'Open AI assistance'}
        aria-expanded={isOpen}
        className="flex h-14 items-center gap-2 rounded-full bg-buddhist-burgundy px-5 text-white shadow-lg transition hover:scale-105 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-buddhist-gold focus:ring-offset-2"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={23} />}
        <span className="text-sm font-semibold">
          {isOpen ? 'Close' : 'AI Assistance'}
        </span>
      </button>
    </div>
  );
}
