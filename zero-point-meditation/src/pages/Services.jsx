import React, { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Flower2, BookOpen, Sparkles, HandHeart, Clock3, Landmark } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import karmaGyatsoPhoto from "../assets/Teams/Teachers/karma Gyatso lopon la .jpeg";
import jamyangThuptenPhoto from "../assets/Teams/Teachers/Jamyang Thupten.jpeg";
import tashiDorjeePhoto from "../assets/Teams/Teachers/Tashi Dorjee.jpeg";
import thuptenSherapPhoto from "../assets/Teams/Teachers/Thupten Sherap.jpeg";

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
const serviceImages = {
  learning: [
    { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80', alt: 'A person sitting in meditation' },
    { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', alt: 'A peaceful yoga and mindfulness practice' },
    { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80', alt: 'A quiet natural setting for reflection' },
    { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'A peaceful landscape for contemplation' },
  ],
  retreat: [
    { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80', alt: 'Sunrise over a peaceful landscape' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80', alt: 'A quiet forest retreat setting' },
    { src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', alt: 'A tranquil mountain landscape' },
    { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80', alt: 'A calm lakeside landscape' },
  ],
  workplace: [
    { src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80', alt: 'Colleagues working together' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80', alt: 'A team collaborating around a table' },
    { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80', alt: 'A workplace team discussion' },
    { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', alt: 'A group workshop and discussion' },
  ],
  prayer: [
    { src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', alt: 'A peaceful spiritual setting' },
    { src: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=80', alt: 'A quiet meditation and prayer space' },
    { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80', alt: 'A peaceful natural scene for reflection' },
    { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80', alt: 'A serene mountain setting' },
  ],
};


function ServiceSection({ id, eyebrow, title, description, icon, items, imageKey, onAction }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">{icon}{eyebrow}</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">{title}</h2>
        {description && <p className="text-stone-600 leading-relaxed">{description}</p>}
      </div>
      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {items.map((item, index) => (
          <motion.article key={item.name} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }} whileHover={{ y: -5, transition: { duration: 0.18 } }} className="overflow-hidden bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="aspect-[16/9] overflow-hidden bg-amber-50">
              <img src={serviceImages[imageKey][index % serviceImages[imageKey].length].src} alt={serviceImages[imageKey][index % serviceImages[imageKey].length].alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
            </div>
            <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">{icon}</div>
            <h3 className="font-serif text-lg font-bold leading-snug text-buddhist-burgundy">{item.name}</h3>
            {item.duration && <p className="mt-2 flex items-center gap-2 text-sm text-stone-500"><Clock3 size={15} />{item.duration}</p>}
            {item.description && <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.description}</p>}
            {item.detail && <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.detail}</p>}
            <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onAction('booking', item.name)} className="rounded-full bg-buddhist-burgundy px-3 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">Book now</button>
              <button type="button" onClick={() => onAction('inquiry', item.name)} className="rounded-full border border-buddhist-burgundy px-3 py-2.5 text-xs sm:text-sm font-bold text-buddhist-burgundy transition hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">Enquire</button>
            </div>
            </div>
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
  const [bookingWorkflow, setBookingWorkflow] = useState('inquiry');
  const [activeServiceTab, setActiveServiceTab] = useState('prayer-services');
  const openBooking = (workflow, service) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', workflow === 'booking' ? 'service_booking_click' : 'service_enquiry_click', { service_name: service, booking_type: workflow, button_location: 'services_page' });
    }
    setBookingType('service');
    setBookingWorkflow(workflow);
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
        <button type="button" onClick={() => openBooking('inquiry', 'General services enquiry')} className="inline-flex items-center justify-center rounded-full bg-buddhist-burgundy px-7 py-3 text-sm font-bold text-amber-50 shadow-md transition-colors hover:bg-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold focus-visible:ring-offset-2">Enquire about a service</button>
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
        imageKey="learning"
        onAction={openBooking}
/>

      <ServiceSection
        id="retreats"
        eyebrow="Practice in depth"
        title="Meditation & Buddhist Retreats"
        description="Half-day, full-day retreats for deeper study and practice."
        icon={<Sparkles size={20} />}
        items={retreats}
        imageKey="retreat"
        onAction={openBooking}
/>

      <ServiceSection
        id="corporate-programs"
        eyebrow="Organizations & leadership"
        title="Workplace & Corporate Programs"
        description="Meditation, mindfulness, compassion, ethics, and reflective leadership programs for teams and organizations."
        icon={<Landmark size={20} />}
        items={workplaceServices}
        imageKey="workplace"
        onAction={openBooking}
/>

      <ServiceSection
        id="prayer-services"
        eyebrow="Prayer & spiritual support"
        title="Prayer Services & Blessing Ceremonies"
        description="Traditional Buddhist prayers, blessings, dedications, and ceremonies for individuals and families."
        icon={<Flower2 size={20} />}
        items={prayerServices}
        imageKey="prayer"
        onAction={openBooking}
/>


      <section id="our-guides" className="scroll-mt-32 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest"><HandHeart size={14} /> Meet our guides</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Prayer & Spiritual Guidance</h2>
          <p className="text-stone-600 leading-relaxed">Meet the teachers and spiritual guides who support our community.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Gegye Yongyal Rinpoche", image: gegyeYongyalRinpoche },
            { name: "Karma Gyatso Lopon La", image: karmaGyatsoPhoto },
            { name: "Venerable Geshe Jamyang Thupten", image: jamyangThuptenPhoto },
            { name: "Venerable Tashi Dorjee", image: tashiDorjeePhoto },
            { name: "Venerable Thupten Sherap", image: thuptenSherapPhoto },
          ].map((guide) => (
            <a key={guide.name} href="/teachers" aria-label={`View ${guide.name} on the Teachers page`} className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold">
              <div className="aspect-[4/3] overflow-hidden bg-amber-50">
                <img src={guide.image} alt={guide.name} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-serif text-lg font-bold text-buddhist-burgundy">{guide.name}</h3>
                <p className="mt-1 text-sm text-stone-500">View teacher profile</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} initialType={bookingType} initialService={bookingService} workflow={bookingWorkflow} />
    </div>
  );
}
