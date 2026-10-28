import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, CalendarDays, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal.jsx';
import karmaGyatsoPhoto from '../assets/Teams/Teachers/karma Gyatso lopon la .jpeg';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

export default function Teachings() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12">
      <Helmet>
        <title>Our Teachers | Zero Point Meditation Center</title>
        <meta name="description" content="Meet the teachers at Zero Point Meditation Center and explore meditation, Buddhist practices and upcoming online prayer programs." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/teachers" />
        <meta property="og:title" content="Our Teachers | Zero Point Meditation Center" />
        <meta property="og:description" content="Meet our teachers and explore meditation and Buddhist practices at Zero Point Meditation Center." />
      </Helmet>

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl space-y-4 text-center"
      >
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold">
          <BookOpen size={15} /> Learn and practice
        </span>
        <h1 className="font-serif text-4xl font-bold text-buddhist-burgundy sm:text-5xl">Meet Our Teachers</h1>
        <p className="leading-relaxed text-stone-600">
          Meet the teachers who share Buddhist wisdom, meditation practices and opportunities for spiritual learning with our community.
        </p>
      </motion.header>

      <section aria-labelledby="teacher-list-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="teacher-list-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Our Teachers</h2>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm md:grid-cols-[minmax(260px,0.8fr)_1.2fr]"
        >
          <div className="min-h-[320px] bg-stone-100 sm:min-h-[400px]">
            <img
              src={karmaGyatsoPhoto}
              alt="Karma Gyatso Lopon La"
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold">
                <GraduationCap size={15} /> Teacher
              </span>
              <h3 className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Karma Gyatso Lopon La</h3>
              <p className="font-semibold text-stone-700">Teaches: Meditation &amp; Buddhist Practices</p>
            </div>

            <p className="leading-relaxed text-stone-600">
              Karma Gyatso Lopon La completed his Grade 12 education in India and spent more than ten years studying the Buddhist sutra tradition at Bokar Shedra. He is currently a student researcher at Emory University.
            </p>
            <p className="leading-relaxed text-stone-600">
              At Zero Point Meditation Center, he will teach meditation and facilitate online Buddhist prayer programs planned for 2027. Program details and dates will be shared when they are confirmed.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-amber-100 pt-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-medium text-buddhist-burgundy">
                <CalendarDays size={16} /> Future programs planned for 2027
              </span>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Book a lecture <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm md:grid-cols-[minmax(260px,0.8fr)_1.2fr]"
        >
          <div className="min-h-[320px] bg-stone-100 sm:min-h-[400px]">
            <img
              src={gegyeYongyalRinpoche}
              alt="H.E. Gegye Yongyal Rinpoche"
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold">
                <GraduationCap size={15} /> Teacher &amp; Spiritual Guide
              </span>
              <h3 className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">H.E. Gegye Yongyal Rinpoche</h3>
              <p className="font-semibold text-stone-700">Teaches: Meditation &amp; Buddhist Practices</p>
            </div>

            <p className="leading-relaxed text-stone-600">
              H.E. Gegye Yongyal Rinpoche offers Buddhist spiritual guidance and traditional prayer services through Zero Point Meditation Center.
            </p>
            <p className="leading-relaxed text-stone-600">
              Learn more about his spiritual guidance and enquire about opportunities for Buddhist practice through the centre.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-amber-100 pt-5">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Book a lecture <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.article>
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialType="service"
        initialService="Meditation & Buddhist Practices"
        fixedSelection
      />
    </div>
  );
}
