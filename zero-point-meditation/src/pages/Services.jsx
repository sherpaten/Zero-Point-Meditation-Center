import React, { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Flower2, BookOpen, Sparkles, HandHeart, Clock3, Landmark } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import karmaGyatsoPhoto from "../assets/Teams/Teachers/karma Gyatso lopon la .jpeg";

const courses = [
  { name: 'Introduction to Buddhist Meditation', duration: '45 minutes', description: 'Serves as a low-commitment entry point for first-timers.' },
  { name: 'Shamatha Meditation Workshop', duration: '2 hours', description: 'Combines guided instruction and practice to help participants start a steady daily routine.' },
  { name: 'Mindfulness and Emotional Awareness', duration: '2 hours', description: 'Offers practical tools for stress, resilience, and emotional balance in daily life.' },
  { name: 'Four Noble Truths Course', duration: '4 sessions', description: 'Gives a philosophical grounding that complements the meditation practices.' },
];

const retreats = [
  { name: 'Introduction to Meditation Retreat', duration: 'Half day', description: 'Gives beginners a first taste of sustained practice beyond a single session.' },
  { name: 'Shamatha Meditation Retreat', duration: 'Full day', description: 'Deepens focus and mental stability for those ready to go beyond the 2-hour workshop.' },
  { name: 'Buddhist Philosophy Day Retreat', duration: 'Full day', description: 'Pairs study with contemplation, building on concepts like the Four Noble Truths.' },
  { name: 'Noble Tara Practice Retreat', duration: 'Full day', description: 'Offers a traditional compassion-focused practice experience for committed participants.' },
];

const workplaceServices = [
  { name: 'Workplace Meditation Introduction', duration: '60 minutes', description: 'Gives employees an easy, low-barrier start to reduce stress and improve focus.' },
  { name: 'Corporate Mindfulness Workshop', duration: '90 minutes', description: 'Helps teams build healthier habits and a calmer, more focused work culture.' },
  { name: 'Compassion and Leadership Workshop', duration: '2 hours', description: 'Equips leaders to manage with empathy while staying effective.' },
  { name: 'Buddhist Ethics and Leadership Seminar', duration: '2 hours', description: 'Supports reflective, values-driven leadership for managers and executives.' },
];

const prayerServices = [
  { name: 'Short personal blessing and prayer', duration: 'Not specified', description: 'A simple, accessible way to receive spiritual support for a personal moment or need.' },
  { name: 'House blessing ceremony', duration: 'Not specified', description: 'Suited to families settling in or renewing the atmosphere of their living space.' },
  { name: 'New home or business blessing', duration: 'Not specified', description: 'Seeks auspicious conditions, stability, and success for the space and those in it.' },
  { name: 'Family prayer ceremony', duration: 'Not specified', description: 'Strengthens family bonds and offers collective spiritual support.' },
  { name: 'Long-life prayer and blessing', duration: 'Not specified', description: 'Commonly requested to mark birthdays, recovery, or milestone occasions.' },
  { name: 'Tara prayer ceremony', duration: 'Not specified', description: 'Invoked for protection, overcoming obstacles, and fulfilling positive aspirations.' },
  { name: 'Medicine Buddha prayer ceremony', duration: 'Not specified', description: 'Offered for physical and mental wellbeing and for those facing illness.' },
  { name: 'Chenrezig compassion prayer', duration: 'Not specified', description: 'Cultivates loving-kindness and offers merit for the benefit of all beings.' },
  { name: 'Guru Rinpoche prayer ceremony', duration: 'Not specified', description: 'Performed to remove obstacles and bring blessings and protection.' },
  { name: 'Memorial prayer for a deceased loved one', duration: 'Not specified', description: 'Dedicates merit for a peaceful transition and comforts grieving family members.' },
  { name: 'Extended prayer and dedication ceremony', duration: 'Not specified', description: 'Suited to major occasions that call for a fuller, more elaborate offering.' },
  { name: 'Special multi-monastic prayer gathering', duration: 'Depends on gathering size (about 400–2,000 monks)', description: 'Reserved for significant community or extended dedication events.' },
];
function ServiceSection({ id, eyebrow, title, description, icon, items }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">{icon}{eyebrow}</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">{title}</h2>
        {description && <p className="text-stone-600 leading-relaxed">{description}</p>}
      </div>
      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {items.map((item) => (
          <motion.article key={item.name} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }} whileHover={{ y: -5, transition: { duration: 0.18 } }} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">{icon}</div>
            <h3 className="font-serif text-lg font-bold leading-snug text-buddhist-burgundy">{item.name}</h3>
            {item.duration && <p className="mt-2 flex items-center gap-2 text-sm text-stone-500"><Clock3 size={15} />{item.duration}</p>}
            {item.description && <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.description}</p>}
            {item.detail && <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.detail}</p>}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default function Services() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState('service');
  const [bookingService, setBookingService] = useState('');
  const [activeServiceTab, setActiveServiceTab] = useState('prayer-services');
  const openBooking = (type, service) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'service_booking_click', { service_name: service, booking_type: type, button_location: 'services_page' });
    }
    setBookingType(type);
    setBookingService(service);
    setBookingOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-5 sm:px-6 py-12 space-y-16">
      <Helmet>
        <title>Prayer Services, Buddhist Courses & Retreats | Zero Point</title>
        <meta name="description" content="Explore prayer ceremonies, Buddhist meditation courses, retreats, and workplace programs offered by Zero Point Meditation Center. Explore our services and contact the center to enquire." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/services" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Zero Point Meditation Center" />
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/services" />
        <meta property="og:title" content="Prayer Services, Buddhist Courses & Retreats | Zero Point" />
        <meta property="og:description" content="Explore prayer ceremonies, Buddhist meditation courses, retreats, and workplace programs offered by Zero Point Meditation Center." />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Prayer Services, Buddhist Courses & Retreats | Zero Point" />
        <meta name="twitter:description" content="Explore prayer ceremonies, Buddhist meditation courses, retreats, and workplace programs offered by Zero Point Meditation Center." />
      </Helmet>

      <section aria-label="About our services" className="mx-auto max-w-3xl space-y-3 text-center">
        <span className="text-buddhist-gold text-xs font-bold uppercase tracking-widest">Practice, prayer & spiritual support</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">A Welcoming Space to Learn, Reflect & Connect</h1>
        <p className="text-sm sm:text-base leading-relaxed text-stone-600">
          Explore meditation and Buddhist learning, join a retreat or community program, or enquire about prayer services and spiritual guidance. Whether you are taking a first step or deepening an established practice, we welcome you to find the support and opportunities that are right for you.
        </p>
        <button type="button" onClick={() => openBooking('service', 'General services enquiry')} className="inline-flex items-center justify-center rounded-full bg-buddhist-burgundy px-7 py-3 text-sm font-bold text-amber-50 shadow-md transition-colors hover:bg-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold focus-visible:ring-offset-2">Enquire about a service</button>
      </section>

      <nav aria-label="Navigate service categories" className="flex justify-center gap-2 border-b border-stone-200 pb-4 flex-wrap">
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { label: 'Learning & Practice', id: 'courses' },
            { label: 'Retreats', id: 'retreats' },
            { label: 'Corporate Programs', id: 'corporate-programs' },
            { label: 'Prayer Services', id: 'prayer-services' },
            { label: 'Our Guides', id: 'our-guides' },
          ].map((tab) => (
            <button key={tab.id} type="button"
              onClick={() => {
                setActiveServiceTab(tab.id);
                document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              aria-pressed={activeServiceTab === tab.id}
              className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold ${activeServiceTab === tab.id ? 'text-amber-50' : 'text-stone-600 hover:text-stone-900'}`}>
              {activeServiceTab === tab.id && (
                <motion.span layoutId="activeEventTab" className="absolute inset-0 bg-buddhist-burgundy rounded-full shadow-md" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <ServiceSection
        id="courses"
        eyebrow="Learning & practice"
        title="Meditation & Buddhist Courses"
        description="Learn meditation, Buddhist teachings, philosophy, and traditional perspectives through guided sessions and multi-session courses."
        icon={<BookOpen size={20} />}
        items={courses}
/>

      <ServiceSection
        id="retreats"
        eyebrow="Practice in depth"
        title="Meditation & Buddhist Retreats"
        description="Half-day, full-day retreats for deeper study and practice."
        icon={<Sparkles size={20} />}
        items={retreats}
/>

      <ServiceSection
        id="corporate-programs"
        eyebrow="Organizations & leadership"
        title="Workplace & Corporate Programs"
        description="Meditation, mindfulness, compassion, ethics, and reflective leadership programs for teams and organizations."
        icon={<Landmark size={20} />}
        items={workplaceServices}
/>

      <ServiceSection
        id="prayer-services"
        eyebrow="Prayer & spiritual support"
        title="Prayer Services & Blessing Ceremonies"
        description="Traditional Buddhist prayers, blessings, dedications, and ceremonies for individuals and families."
        icon={<Flower2 size={20} />}
        items={prayerServices}
/>


      <section id="our-guides" className="scroll-mt-32 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><HandHeart size={14} /> Meet our guides</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Prayer & Spiritual Guidance</h2>
          <p className="text-stone-600 leading-relaxed">Learn more about our teachers and spiritual guides.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-5xl mx-auto">
          {[
            { name: "Gegye Yongyal Rinpoche", image: gegyeYongyalRinpoche, alt: "Gegye Yongyal Rinpoche" },
            { name: "Karma Gyatso Lopon La", image: karmaGyatsoPhoto, alt: "Karma Gyatso Lopon La" }
          ].map((guide) => (
            <a key={guide.name} href="/teachers" aria-label={`Learn more about ${guide.name} on the Teachers page`} className="block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold focus-visible:ring-offset-2">
              <div className="aspect-square overflow-hidden bg-amber-50 flex items-center justify-center">
                <img src={guide.image} alt={guide.alt} loading="lazy" className="h-full w-full object-contain object-center" />
              </div>
              <div className="space-y-1.5 p-3 sm:p-4 text-center"><h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug">{guide.name}</h3></div>
            </a>
          ))}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} initialType={bookingType} initialService={bookingService} />
    </div>
  );
}
