import React, { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HeartHandshake, Flower2, BookOpen, Sparkles, Users, HandHeart, Clock3, Landmark } from 'lucide-react';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import karmaGyatsoPhoto from "../assets/Teams/Teachers/karma Gyatso lopon la .jpeg";

const prayerServices = [
  { name: 'Short personal blessing and prayer', price: '$100–$250' },
  { name: 'House blessing ceremony', price: '$250–$500' },
  { name: 'New home or business blessing', price: '$300–$500' },
  { name: 'Family prayer ceremony', price: '$250–$500' },
  { name: 'Long-life prayer and blessing', price: '$250–$500' },
  { name: 'Tara prayer ceremony', price: '$250–$500' },
  { name: 'Medicine Buddha prayer ceremony', price: '$250–$500' },
  { name: 'Chenrezig compassion prayer', price: '$200–$500' },
  { name: 'Guru Rinpoche prayer ceremony', price: '$250–$500' },
  { name: 'Memorial prayer for a deceased loved one', price: '$250–$500' },
  { name: 'Extended prayer and dedication ceremony', price: '$500–$1,000' },
  { name: 'Special multi-monastic prayer gathering', price: '$1,000–$2,500+', detail: 'Depending on gathering size (approximately 400–2,000 monks)' },
];

const courses = [
  { name: 'Introduction to Buddhist Meditation', duration: '45 minutes', online: '$10', inPerson: '$15' },
  { name: 'Shamatha Meditation Workshop', duration: '2 hours', online: '$25', inPerson: '$60' },
  { name: 'Mindfulness and Emotional Awareness', duration: '2 hours', online: '$45', inPerson: '$99' },
  { name: 'Four Noble Truths Course', duration: '4 sessions', online: '$60', inPerson: '$120' },
  { name: 'Eightfold Path Course', duration: '4 sessions', online: '$60', inPerson: '$120' },
  { name: 'Introduction to Tibetan Buddhism', duration: '6 sessions', online: '$100', inPerson: '$180' },
  { name: 'Prajnaparamita and the Wisdom of Emptiness', duration: '6 sessions', online: '$110', inPerson: '$240' },
  { name: 'Madhyamaka Buddhist Philosophy', duration: '8 sessions', online: '$150', inPerson: '$320' },
  { name: 'Pramana: Buddhist Logic and Reasoning', duration: '8 sessions', price: '$320/person' },
  { name: 'Buddhist Tantra: Foundations and Context', duration: '4 sessions', price: '$160/person' },
  { name: 'Bardo and the Tibetan Buddhist Understanding of Death', duration: '4 sessions', price: '$160/person' },
  { name: 'Advanced Buddhist Philosophy Seminar', duration: '2 hours', price: '$75/person' },
];

const retreats = [
  { name: 'Introduction to Meditation Retreat', duration: 'Half day', price: '$75/person' },
  { name: 'Shamatha Meditation Retreat', duration: 'Full day', price: '$125/person' },
  { name: 'Buddhist Philosophy Day Retreat', duration: 'Full day', price: '$150/person' },
  { name: 'Noble Tara Practice Retreat', duration: 'Full day', price: '$150/person' },
  { name: 'Compassion and Bodhicitta Retreat', duration: 'Full day', price: '$125/person' },
  { name: 'Weekend Buddhist Meditation Retreat', duration: '2 days', price: '$275/person' },
  { name: 'Advanced Tibetan Buddhist Retreat', duration: '3 days', price: '$450/person' },
  { name: 'Private Family Retreat', duration: 'Half day', price: '$500–$750' },
  { name: 'Private Individual Retreat Instruction', duration: 'Full day', price: '$750–$1,000' },
  { name: 'Institutional Retreat for an Organization', duration: 'Full day', price: '$1,000–$2,000' },
];

const workplaceServices = [
  { name: 'Workplace Meditation Introduction', duration: '60 minutes', price: '$500' },
  { name: 'Corporate Mindfulness Workshop', duration: '90 minutes', price: '$750' },
  { name: 'Compassion and Leadership Workshop', duration: '2 hours', price: '$1,000' },
  { name: 'Buddhist Ethics and Leadership Seminar', duration: '2 hours', price: '$1,000' },
  { name: 'Corporate Half-Day Retreat', duration: '4 hours', price: '$1,500' },
  { name: 'Corporate Full-Day Retreat', duration: '6–8 hours', price: '$2,500' },
  { name: 'Executive Meditation Instruction', duration: '60 minutes', price: '$250' },
  { name: 'Monthly Corporate Meditation Program', duration: '4 sessions', price: '$2,000' },
  { name: 'Corporate Meditation Series', duration: '8 sessions', price: '$4,000' },
  { name: 'Leadership and Reflective Practice Program', duration: '3 months', price: '$6,000–$12,000' },
];

function ServiceSection({ id, eyebrow, title, description, icon, items, category }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <span className="inline-flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">{icon}{eyebrow}</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">{title}</h2>
        {description && <p className="text-stone-600 leading-relaxed">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {items.map((item) => (
          <article key={item.name} className="flex h-full flex-col rounded-2xl border border-amber-100 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">{icon}</div>
            <h3 className="font-serif text-lg font-bold leading-snug text-buddhist-burgundy">{item.name}</h3>
            {item.duration && <p className="mt-2 flex items-center gap-2 text-sm text-stone-500"><Clock3 size={15} />{item.duration}</p>}
            {item.online && item.inPerson ? (
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-stone-600">Online <strong className="text-buddhist-burgundy">{item.online}</strong></p>
                <p className="text-stone-600">In-person <strong className="text-buddhist-burgundy">{item.inPerson}</strong></p>
              </div>
            ) : (
              <p className="mt-4 text-sm font-bold text-buddhist-burgundy">{item.price}</p>
            )}
            {item.detail && <p className="mt-2 text-xs leading-relaxed text-stone-500">{item.detail}</p>}
            <button type="button" onClick={() => category(item)} className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-buddhist-burgundy px-4 py-2.5 mt-5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold focus-visible:ring-offset-2">Book / enquire</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Services() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState('service');
  const [bookingService, setBookingService] = useState('');
  const openBooking = (type, service) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'service_booking_click', { service_name: service, booking_type: type, button_location: 'services_page' });
    }
    setBookingType(type);
    setBookingService(service);
    setBookingOpen(true);
  };
  const bookPrayer = (item) => openBooking('service', item.name);
  const bookCourse = (item) => openBooking('service', item.name);
  const bookRetreat = (item) => openBooking('event', item.name);
  const bookWorkplace = (item) => openBooking('service', item.name);

  return (
    <div className="max-w-[1600px] mx-auto px-5 sm:px-6 py-12 space-y-16">
      <Helmet>
        <title>Prayer Services, Buddhist Courses & Retreats | Zero Point</title>
        <meta name="description" content="Explore prayer ceremonies, Buddhist meditation courses, retreats, and workplace programs offered by Zero Point Meditation Center. View recommended prices and enquire online." />
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

      <nav aria-label="Navigate service categories" className="sticky top-0 z-30 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3 border-y border-amber-100 bg-[#FAF6F0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-start sm:justify-center gap-2 overflow-x-auto">
          {[
            { label: 'Prayer Services', id: 'prayer-services' },
            { label: 'Courses', id: 'courses' },
            { label: 'Retreats', id: 'retreats' },
            { label: 'Corporate Programs', id: 'corporate-programs' },
            { label: 'Our Guides', id: 'our-guides' },
          ].map((tab) => (
            <button key={tab.id} type="button"
              onClick={() => document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="shrink-0 rounded-full border border-amber-200 bg-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-stone-600 transition-colors hover:border-buddhist-burgundy hover:bg-buddhist-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold">
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <ServiceSection
        id="prayer-services"
        eyebrow="Prayer & spiritual support"
        title="Prayer Services & Blessing Ceremonies"
        description="Traditional Buddhist prayers, blessings, dedications, and ceremonies for individuals, families, homes, and communities."
        icon={<Flower2 size={20} />}
        items={prayerServices}
        category={bookPrayer}
      />

      <ServiceSection
        id="courses"
        eyebrow="Learning & practice"
        title="Meditation & Buddhist Courses"
        description="Learn meditation, Buddhist teachings, philosophy, and traditional perspectives through guided sessions and multi-session courses."
        icon={<BookOpen size={20} />}
        items={courses}
        category={bookCourse}
      />

      <ServiceSection
        id="retreats"
        eyebrow="Practice in depth"
        title="Meditation & Buddhist Retreats"
        description="Half-day, full-day, multi-day, private, and organizational retreats for deeper study and practice."
        icon={<Sparkles size={20} />}
        items={retreats}
        category={bookRetreat}
      />

      <ServiceSection
        id="corporate-programs"
        eyebrow="Organizations & leadership"
        title="Workplace & Corporate Programs"
        description="Meditation, mindfulness, compassion, ethics, and reflective leadership programs for teams and organizations."
        icon={<Landmark size={20} />}
        items={workplaceServices}
        category={bookWorkplace}
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
      <p className="text-xs text-stone-500 text-center max-w-3xl mx-auto">Prices are recommended starting ranges and may vary depending on the service, location, group size, and arrangements. Please wait for the centre to confirm your booking and final amount before making payment. Spiritual guidance and community activities are not a replacement for licensed mental health care.</p>
    </div>
  );
}
