import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, CalendarDays, ArrowRight, X } from 'lucide-react';
import BookingModal from '../components/BookingModal.jsx';
import karmaGyatsoPhoto from '../assets/Teams/Teachers/karma Gyatso lopon la .jpeg';
import jamyangThuptenPhoto from '../assets/Teams/Teachers/Jamyang Thupten.jpeg';
import tashiDorjeePhoto from '../assets/Teams/Teachers/Tashi Dorjee.jpeg';
import thuptenSherapPhoto from '../assets/Teams/Teachers/Thupten Sherap.jpeg';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";

export default function Teachings() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedBio, setSelectedBio] = useState(null);

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
              name: 'Thupten Sherap',
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
                <button type="button" onClick={() => setSelectedBio({ name: teacher.name, image: teacher.image, biography: [teacher.biography, teacher.additional].filter(Boolean).join('\n\n') })} className="mt-auto w-fit text-sm font-semibold text-buddhist-burgundy underline decoration-amber-400 underline-offset-4 hover:text-amber-700">Read full bio</button>
              </div>
            </motion.article>
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
