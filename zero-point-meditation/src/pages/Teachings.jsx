import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, CalendarDays, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal.jsx';
import karmaGyatsoPhoto from '../assets/Teams/Teachers/karma Gyatso lopon la .jpeg';
import jamyangThuptenPhoto from '../assets/Teams/Teachers/Jamyang Thupten.jpeg';
import tashiDorjeePhoto from '../assets/Teams/Teachers/Tashi Dorjee.jpeg';
import thuptenSherapPhoto from '../assets/Teams/Teachers/Thupten Sherap.jpeg';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

export default function Teachings() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');

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
          Whether you are new to meditation, seeking greater inner peace, or continuing a spiritual path, you are welcome here. Our teachers share Buddhist wisdom, meditation practices, and opportunities to learn in a supportive community.
        </p>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500">
          Explore at your own pace, ask questions, and discover practices that help you bring greater awareness and compassion into everyday life.
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
                onClick={() => { setSelectedTeacher('Karma Gyatso Lopon La'); setBookingOpen(true); }}
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
                onClick={() => { setSelectedTeacher('H.E. Gegye Yongyal Rinpoche'); setBookingOpen(true); }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Book a lecture <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.article>
      </section>

      <section aria-labelledby="additional-teachers-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="additional-teachers-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">More of Our Teachers</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Jamyang Thupten', image: jamyangThuptenPhoto },
            { name: 'Tashi Dorjee', image: tashiDorjeePhoto },
            { name: 'Thupten Sherap', image: thuptenSherapPhoto },
          ].map((teacher) => (
            <motion.article key={teacher.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <div className="space-y-1 p-4 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><GraduationCap size={14} /> Teacher</span>
                <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">{teacher.name}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialType="service"
        initialService="Meditation & Buddhist Practices"
        initialTeacher={selectedTeacher}
        fixedSelection
      />
    </div>
  );
}
