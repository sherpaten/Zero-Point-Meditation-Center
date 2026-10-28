import React, { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HeartHandshake, Flower2, BookOpen, Sparkles, Users, HandHeart, ArrowRight } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import karmaGyatsoPhoto from "../assets/Teams/Teachers/karma Gyatso lopon la .jpeg";

export default function Services() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState('service');
  const [bookingService, setBookingService] = useState('');
  const openBooking = (type, service) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'service_booking_click', {
        service_name: service,
        booking_type: type,
        button_location: 'services_page'
      });
    }
    setBookingType(type);
    setBookingService(service);
    setBookingOpen(true);
  };
  return (
    
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <Helmet>
        <title>Meditation, Prayer & Spiritual Support Services | Zero Point</title>
        <meta name="description" content="Explore meditation, Buddhist prayer, spiritual guidance and community support offered by Zero Point Meditation Center. Contact us to learn about current services."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/services"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/services"/>
        <meta property="og:title" content="Meditation, Prayer & Spiritual Support Services | Zero Point"/>
        <meta property="og:description" content="Explore meditation, Buddhist prayer, spiritual guidance and community support offered by Zero Point Meditation Center. Contact us to learn about current services."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Meditation, Prayer & Spiritual Support Services | Zero Point"/>
        <meta name="twitter:description" content="Explore meditation, Buddhist prayer, spiritual guidance and community support offered by Zero Point Meditation Center. Contact us to learn about current services."/>
      </Helmet>
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><Sparkles size={14}/> Explore and connect</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">Services, Classes & Community</h1>
        <p className="text-stone-600 leading-relaxed">Explore meditation, spiritual guidance, community activities, and well-being resources. Ask the centre’s chatbot preview a question to find your next step.</p>
      </motion.header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: <Flower2 size={24}/>, title: 'Meditation & Mindfulness', text: 'Group practice, meditation instruction, and opportunities to build a personal practice.', price: 'Contact us for pricing' },
          { icon: <BookOpen size={24}/>, title: 'Meditation & Buddhist Practices', text: 'Meditation instruction and Buddhist practices, including online prayer programs planned for 2027.', price: 'Contact us for details' },
          { icon: <BookOpen size={24}/>, title: 'Prayers & Spiritual Guidance', text: 'Traditional prayers and Buddhist spiritual guidance.', price: '$350 per lama / $1755 for 5 lamas' },
          { icon: <HeartHandshake size={24}/>, title: 'Emotional Well-being', text: 'A compassionate, welcoming space and information about available support resources.', price: 'Contact us for pricing' },
          { icon: <Users size={24}/>, title: 'Community Gatherings', text: 'Shared practice, cultural activities, and community events.', price: 'Contact us for pricing' },
          { icon: <HeartHandshake size={24}/>, title: 'Counselling Information', text: 'Ask the centre about qualified professionals and verified counselling referrals before booking.', price: 'Contact us for pricing' },
          { icon: <Sparkles size={24}/>, title: 'Yoga — Coming Soon', text: 'Yoga sessions are being planned. Details will be added once the schedule is confirmed.', price: 'Price to be announced' },
        ].map(item => <article key={item.title} className="rounded-2xl border border-amber-100 bg-white p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">{item.icon}</div>
          <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{item.title}</h2>
          <p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
          <div className="border-t border-amber-100 pt-3 space-y-3"><p className="text-sm font-bold text-buddhist-burgundy">{item.price}</p><button type="button" onClick={() => openBooking(item.title === 'Yoga — Coming Soon' ? 'event' : 'service', item.title)} disabled={item.title === 'Yoga — Coming Soon'} className="inline-flex w-full items-center justify-center rounded-full bg-buddhist-burgundy px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{item.title === 'Yoga — Coming Soon' ? 'Coming soon' : 'Book / enquire'}</button></div>
        </article>)}
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><HandHeart size={14}/> Prayer & Spiritual Guidance</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Prayer Services & Spiritual Guidance</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-5xl mx-auto">
          {[
            {
              name: "Gegye Yongyal Rinpoche",
              image: gegyeYongyalRinpoche,
              alt: "Gegye Yongyal Rinpoche"
            },
            {
              name: "Karma Gyatso Lopon La",
              image: karmaGyatsoPhoto,
              alt: "Karma Gyatso Lopon La"
            }
          ].map((guide) => (
            <a key={guide.name} href="/teachers" aria-label={`Learn more about ${guide.name} on the Teachers page`} className="block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold focus-visible:ring-offset-2">
              <div className="aspect-square overflow-hidden bg-amber-50 flex items-center justify-center">
                <img
                  src={guide.image}
                  alt={guide.alt}
                  loading="lazy"
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <div className="space-y-1.5 p-3 sm:p-4 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug">{guide.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} initialType={bookingType} initialService={bookingService} />
      <p className="text-xs text-stone-500 text-center max-w-3xl mx-auto">Important: spiritual guidance and community activities are not a replacement for licensed mental health care. If you need clinical support, contact a qualified professional or local health service.</p>
    </div>
  );
}