import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flower2, Globe2, Users } from 'lucide-react';
import BookingModal from '../components/BookingModal.jsx';

const registrationOptions = [
  {
    service: 'Free Meditation Class',
    eyebrow: 'Weekly practice',
    title: 'Free Morning Meditation',
    description: 'Join our guided morning meditation sessions online. Saturday sessions are in Nepali and Sunday sessions are in English.',
    details: ['6:30–7:15 AM US Eastern Time', 'Online via Zoom', 'Choose an announced upcoming date'],
    icon: Flower2,
    action: 'Register for a free session',
  },
  {
    service: 'Free Weekend Community Classes',
    eyebrow: 'Community learning',
    title: 'Free Weekend Community Classes',
    description: 'Register your interest in an upcoming Saturday or Sunday community class. The center will confirm the session details with you.',
    details: ['Saturday and Sunday dates', 'Open to the community', 'Session details confirmed by the center'],
    icon: Users,
    action: 'Register for a community class',
  },
  {
    service: 'Special Events',
    eyebrow: 'Special teachings',
    title: 'Special Events & Teaching Series',
    description: 'Register directly with the event organiser using the official partner booking page linked from our event calendar.',
    details: ['Official event-partner registration', 'Booking and payment handled by the organiser', 'See the event calendar for current dates and details'],
    icon: Globe2,
    action: 'Register with event organiser',
    href: 'https://shop.thus.org/products/the-three-principle-stages-of-the-buddhist-path-lam-rim',
  },
];

export default function EventRegistration() {
  const [activeService, setActiveService] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);

  const openRegistration = (service) => {
    setActiveService(service);
    setBookingOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-5 py-12 sm:px-6 sm:py-16">
      <Helmet>
        <title>Event & Session Registration | Zero Point Meditation Center</title>
        <meta name="description" content="Register for free meditation sessions, community classes, Buddhist teachings and special events with Zero Point Meditation Center." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/event-registration" />
        <meta property="og:title" content="Event & Session Registration | Zero Point Meditation Center" />
        <meta property="og:description" content="Find registration information for meditation sessions, community classes and special teachings." />
      </Helmet>

      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-buddhist-gold">
          <CalendarDays size={15} /> Join a gathering
        </span>
        <h1 className="font-serif text-4xl font-bold text-buddhist-burgundy sm:text-5xl">Event & Session Registration</h1>
        <p className="text-sm leading-7 text-stone-600 sm:text-base">
          Find a meditation session, community class, or special teaching and register in one place. Choose an option below to begin.
        </p>
      </header>

      <section aria-label="Registration options" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {registrationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <article key={option.service} className="flex flex-col rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-buddhist-gold">
                <Icon size={23} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-buddhist-gold">{option.eyebrow}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-buddhist-burgundy">{option.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{option.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-stone-600">
                {option.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-buddhist-gold" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              {option.href ? (
                <a
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-4 py-3 text-sm font-bold text-amber-50 transition-colors hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  {option.action} <ArrowRight size={15} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => openRegistration(option.service)}
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-4 py-3 text-sm font-bold text-amber-50 transition-colors hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  {option.action} <ArrowRight size={15} />
                </button>
              )}
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-6 py-7 text-center sm:px-9">
        <h2 className="font-serif text-2xl font-bold text-buddhist-burgundy">Looking for event details first?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Browse upcoming announcements, event highlights, photographs, and community news on our Events page.
        </p>
        <Link to="/events" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-buddhist-burgundy px-5 py-2.5 text-sm font-bold text-buddhist-burgundy transition-colors hover:bg-white">
          Explore events <ArrowRight size={15} />
        </Link>
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialType="event"
        initialService={activeService}
        fixedSelection
      />
    </div>
  );
}
