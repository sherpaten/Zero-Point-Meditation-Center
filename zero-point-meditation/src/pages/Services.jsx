import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Flower2, BookOpen, Sparkles, Users, HandHeart, ArrowRight } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

export default function Services() {
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

      <p className="text-xs text-stone-500 text-center max-w-3xl mx-auto">Important: spiritual guidance and community activities are not a replacement for licensed mental health care. If you need clinical support, contact a qualified professional or local health service.</p>
    </div>
  );
}