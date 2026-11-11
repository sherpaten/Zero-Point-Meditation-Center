import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, CalendarDays, ArrowRight, X, Users } from 'lucide-react';
import BookingModal from '../components/BookingModal.jsx';
import karmaGyatsoPhoto from '../assets/Teams/Teachers/karma Gyatso lopon la .jpeg';
import jamyangThuptenPhoto from '../assets/Teams/Teachers/Jamyang Thupten.jpeg';
import tashiDorjeePhoto from '../assets/Teams/Teachers/Tashi Dorjee.jpeg';
import thuptenSherapPhoto from '../assets/Teams/Teachers/Thupten Sherap.jpeg';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import mayaKarmaJinpaPhoto from "../assets/Teams/Maya Karma Jinpa.jpeg";
import ugenSherpaPhoto from '../assets/Teams/Ugen Sherpa.jpeg';
import gyanBahadurLamaPhoto from '../assets/Teams/Gyan Bahadur Lama .jpeg';
import tenzingNorkaySherpa from '../assets/Teams/Tenzing Norkay Sherpa.webp';
import smrityPhoto from '../assets/Teams/Smty.jpeg';
import mimiLamaPhoto from '../assets/Teams/Mimi Lama.jpeg';

export default function Teachings() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedBio, setSelectedBio] = useState(null);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12">
      <Helmet>
        <title>Our People | Zero Point Meditation Center</title>
        <meta name="description" content="Meet the teachers, advisors, team and members of Zero Point Meditation Center." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/teachers" />
        <meta property="og:title" content="Our People | Zero Point Meditation Center" />
        <meta property="og:description" content="Meet the teachers, advisors, team and members of Zero Point Meditation Center." />
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
        <h1 className="font-serif text-4xl font-bold text-buddhist-burgundy sm:text-5xl">Meet Our People</h1>
        <p className="leading-relaxed text-stone-600">
          Whether you are new to meditation, seeking greater inner peace, or continuing a spiritual path, you are welcome here. Our teachers share Buddhist wisdom, meditation practices, and opportunities to learn in a supportive community.
        </p>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500">
          Meet the teachers, advisors, team members, and community members who contribute to the center.
        </p>
      </motion.header>

      <section aria-labelledby="teacher-list-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="teacher-list-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Our Teachers</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-stone-100">
              <img src={karmaGyatsoPhoto} alt="Karma Gyatso Lopon La" className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="space-y-1 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><GraduationCap size={14} /> Teacher</span>
                <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">Karma Gyatso Lopon La</h3>
              </div>
              <p className="text-sm leading-relaxed text-stone-600">A Buddhist teacher and student researcher at Emory University, with more than ten years of study in the Buddhist sutra tradition.</p>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-buddhist-burgundy"><CalendarDays size={14} /> Future programs planned for 2027</span>
              <button type="button" onClick={() => setSelectedBio({ name: 'Karma Gyatso Lopon La', image: karmaGyatsoPhoto, biography: 'Karma Gyatso Lopon La completed his Grade 12 education in India and spent more than ten years studying the Buddhist sutra tradition at Bokar Shedra. He is currently a student researcher at Emory University. At Zero Point Meditation Center, he will teach meditation and facilitate online Buddhist prayer programs planned for 2027. Program details and dates will be shared when they are confirmed.' })} className="w-fit text-sm font-semibold text-buddhist-burgundy underline decoration-amber-400 underline-offset-4 hover:text-amber-700">Read full bio</button>
              <button type="button" onClick={() => { setSelectedTeacher('Karma Gyatso Lopon La'); setBookingOpen(true); }} className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover">Book a lecture <ArrowRight size={16} /></button>
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-stone-100">
              <img src={gegyeYongyalRinpoche} alt="H.E. Gegye Yongyal Rinpoche" className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="space-y-1 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><GraduationCap size={14} /> Teacher &amp; Spiritual Guide</span>
                <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">H.E. Gegye Yongyal Rinpoche</h3>
              </div>
              <p className="text-sm leading-relaxed text-stone-600">Offers Buddhist spiritual guidance and traditional prayer services through Zero Point Meditation Center.</p>
              <button type="button" onClick={() => setSelectedBio({ name: 'H.E. Gegye Yongyal Rinpoche', image: gegyeYongyalRinpoche, biography: 'H.E. Gegye Yongyal Rinpoche offers Buddhist spiritual guidance and traditional prayer services through Zero Point Meditation Center. Learn more about his spiritual guidance and enquire about opportunities for Buddhist practice through the centre.' })} className="w-fit text-sm font-semibold text-buddhist-burgundy underline decoration-amber-400 underline-offset-4 hover:text-amber-700">Read full bio</button>
              <button type="button" onClick={() => { setSelectedTeacher('H.E. Gegye Yongyal Rinpoche'); setBookingOpen(true); }} className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover">Book a lecture <ArrowRight size={16} /></button>
            </div>
          </motion.article>
          {[
            {
              name: 'Venerable Geshe Jamyang Thupten',
              image: jamyangThuptenPhoto,
              summary: 'A Tibetan monastic scholar from Sera Mey Monastery, with 25 years of Buddhist philosophical study and a Geshe Lharampa degree completed in 2024.',
              biography: 'Venerable Geshe Jamyang Thupten is a Tibetan monastic scholar from Sera Mey Monastery and is currently studying at Emory University. He has 25 years of experience studying Buddhist philosophy and tradition. In 2024, he completed the prestigious Geshe Lharampa degree, the highest academic distinction in traditional Buddhist studies in the Gelug tradition.'
            },
            {
              name: 'Venerable Tashi Dorjee',
              image: tashiDorjeePhoto,
              summary: 'A Tibetan monastic scholar from Tashi Lhunpo Monastery, exploring connections between Buddhist philosophy, science, compassion, and mental well-being.',
              biography: 'Venerable Tashi Dorjee is a Tibetan monastic scholar from Tashi Lhunpo Monastery. He has completed 18 years of extensive monastic study in Buddhist philosophy and is currently part of the eighth cohort of the Tenzin Gyatso Science Scholars at Emory University. Through his study of science, he seeks to integrate scientific knowledge with Buddhist philosophy to promote human values, scientific education, mental well-being, compassion, and ethical values in society.'
            },
            {
              name: 'Venerable Thupten Sherap',
              image: thuptenSherapPhoto,
              summary: 'A Tibetan Buddhist monk, researcher, and educator whose work connects traditional Buddhist philosophy, Tibetan culture, and modern science.',
              biography: 'Venerable Thupten Sherap is a Tibetan Buddhist monk from Drepung Loseling Monastery, a researcher, and an educator with extensive training in traditional Buddhist philosophy, equivalent to a master’s-level education. He has studied the Five Major Texts of Buddhist Philosophy and is currently pursuing his Geshe Lharampa degree, a doctoral-level qualification in the Geluk tradition, at Gelukpa University in India. He is also studying at Emory University as a member of the eighth cohort of the Tenzin Gyatso Science Scholar Program, exploring the intersection of Buddhist philosophy and modern science.',
              additional: 'Since 2019, Sherap has been involved in the International Tukdam Research Project, which investigates long-term meditation practitioners and the post-death meditative state known as Tukdam. His work also encompasses Tibetan language education, translation, editing, and teaching Buddhist philosophy and the relationship between Buddhism and science. Through his diverse experience, Sherap is committed to preserving Tibetan language and culture and fostering dialogue between Buddhist wisdom, scientific inquiry, and human compassion.'
            },
          ].map((teacher) => (
            <motion.article key={teacher.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="space-y-1 text-center">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><GraduationCap size={14} /> Teacher</span>
                  <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">{teacher.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-stone-600">{teacher.summary}</p>
                <button type="button" onClick={() => setSelectedBio({ name: teacher.name, image: teacher.image, biography: [teacher.biography, teacher.additional].filter(Boolean).join('\n\n') })} className="w-fit text-sm font-semibold text-buddhist-burgundy underline decoration-amber-400 underline-offset-4 hover:text-amber-700">Read full bio</button>
                <button type="button" onClick={() => { setSelectedTeacher(teacher.name); setBookingOpen(true); }} className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-full bg-buddhist-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-buddhist-burgundy-hover">Book a lecture <ArrowRight size={16} /></button>
              </div>
            </motion.article>
          ))}
      </div>
      </section>

      <section aria-labelledby="advisor-list-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="advisor-list-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Our Advisors</h2>
          <p className="mt-2 text-sm text-stone-600">People who offer guidance and experience to support the center and its community.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Maya Karma Jinpa', image: mayaKarmaJinpaPhoto },
            { name: 'Shirley Huang', image: null },
            { name: 'Ugen Sherpa', image: ugenSherpaPhoto },
            { name: 'Gyan Bahadur Lama', image: gyanBahadurLamaPhoto },
          ].map((advisor) => (
            <article key={advisor.name} className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="flex items-center justify-center overflow-hidden bg-stone-100">
                {advisor.image ? (
                  <img src={advisor.image} alt={advisor.name} loading="lazy" className="block h-auto max-h-[420px] w-full object-contain object-center" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-buddhist-burgundy/70">
                    <Users size={36} strokeWidth={1.4} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Photo coming soon</span>
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-buddhist-gold">Advisor</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-buddhist-burgundy">{advisor.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>


      <section aria-labelledby="team-list-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="team-list-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Our Team</h2>
          <p className="mt-2 text-sm text-stone-600">The people supporting the center’s day-to-day work.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Tenzing Norkay Sherpa', role: 'IT Head (Nepal Team)', image: tenzingNorkaySherpa },
            { name: 'Smirti Pradhan', role: 'Analytics and Development Manager', image: smrityPhoto },
            { name: 'Mimi Lama', role: 'Secretary of ZPMC', image: mimiLamaPhoto },
          ].map((person) => (
            <article key={person.name} className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={person.image} alt={person.name} loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-serif text-lg font-bold text-buddhist-burgundy">{person.name}</h3>
                <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-buddhist-gold">{person.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="member-list-heading" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 id="member-list-heading" className="font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">Our Members</h2>
          <p className="mt-2 text-sm text-stone-600">Part of our growing community.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Jessica' },
            { name: 'Dawa Dorje Sherpa' },
          ].map((member) => (
            <article key={member.name} className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
              <Users size={36} strokeWidth={1.4} className="text-buddhist-burgundy/70" />
              <h3 className="mt-3 font-serif text-lg font-bold text-buddhist-burgundy">{member.name}</h3>
              <span className="mt-1 text-xs font-bold uppercase tracking-widest text-buddhist-gold">Member</span>
            </article>
          ))}
        </div>
      </section>

      {selectedBio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 p-4 sm:p-6" onClick={() => setSelectedBio(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="teacher-bio-title" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedBio(null)} aria-label="Close biography" className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2 text-stone-700 shadow hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
              <X size={20} />
            </button>
            <div className="grid md:grid-cols-[minmax(220px,0.8fr)_1.2fr]">
              <div className="max-h-[320px] min-h-[240px] bg-stone-100 md:max-h-none md:min-h-[440px]">
                <img src={selectedBio.image} alt={selectedBio.name} className="h-full w-full object-cover object-top" />
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold"><GraduationCap size={15} /> Teacher biography</span>
                <h2 id="teacher-bio-title" className="pr-8 font-serif text-2xl font-bold text-buddhist-burgundy sm:text-3xl">{selectedBio.name}</h2>
                <div className="space-y-4 text-sm leading-relaxed text-stone-600">
                  {selectedBio.biography.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
                <button type="button" onClick={() => setSelectedBio(null)} className="rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-buddhist-burgundy transition hover:bg-amber-50">Close</button>
              </div>
            </div>
          </section>
        </div>
      )}

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
