import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Trees, Sparkles, Compass, HeartHandshake, CheckCircle2, Building2, BookOpen } from 'lucide-react';

// Local Image Imports
import profileMain from '../assets/profile.jpg';
import taraGoddess from '../assets/Tara Godesss.webp';
import profile1 from '../assets/profile 1.jpg';
import profile2 from '../assets/profile 2.jpg';
import gegyeYongyalRinpoche from "../assets/Teams/Gegye Yongyal Rinpoche's.png";
import journeyTeaching1 from '../assets/Teaching 1.webp';
import journeyTeaching2 from '../assets/Teaching 2.jpg';
import journeyTeaching3 from '../assets/Teaching 3.webp';

const globalProjects = [
  {
    name: "Zero Point Meditation Center",
    role: "Founding Spiritual Sanctuary",
    detail: "Providing accessible Tibetan Buddhist mindfulness instruction, daily practice spaces, and interfaith peace assemblies."
  },
  {
    name: "Gegye Tashi Choling Monastery",
    role: "Ancestral Lineage Seat",
    detail: "Preserving ancient Kagyu and Nyingma monastic traditions near sacred Mount Kailash."
  },
  {
    name: "Amala Center Nepal",
    role: "Humanitarian Partner",
    detail: "Directing community welfare projects, emergency relief, and youth educational development across Nepal."
  },
  {
    name: "Himalayan Buddhist Center Australia",
    role: "Sister Sangha Center",
    detail: "Fostering Southern Hemisphere meditation communities through traditional retreats and mind-training workshops."
  }
];

export default function About() {
  const journeySlides = [
    { year: '2024 · Beginnings', title: 'A place to pause and practice', detail: 'The center’s story began with a commitment to share meditation and Buddhist mind-training in a welcoming setting. The aim was to make time for stillness, self-awareness, and compassion available to people navigating the pressures of everyday life.', image: journeyTeaching1, alt: 'Buddhist teaching and meditation practice' },
    { year: '2025 · Community', title: 'Growing through shared purpose', detail: 'As the vision developed, community connection and collaboration became increasingly important. Meditation, learning, and interfaith dialogue offered ways for people from different backgrounds to listen, learn, and build understanding around shared human concerns.', image: journeyTeaching2, alt: 'Community gathering and shared learning' },
    { year: '2026 · Wider connection', title: 'Bringing care closer to the community', detail: 'Today, the center is working toward stronger connections between the community and people whose work supports others, including healthcare workers and life coaches. By creating opportunities to meet, share knowledge, and collaborate, we aim to help make wellbeing support more connected, compassionate, and accessible.', image: journeyTeaching3, alt: 'Spiritual practice and community connection' }
  ];
  const [journeyIndex, setJourneyIndex] = useState(0);
  const currentJourney = journeySlides[journeyIndex];
  return (
    
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <Helmet>
        <title>About Our Center & Spiritual Guide | Zero Point Meditation Center</title>
        <meta name="description" content="Learn about Zero Point Meditation Center, its mission, H.E. Gegye Yongyal Tulku Rinpoche, and its mission, spiritual guidance, and community initiatives."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/about"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/about"/>
        <meta property="og:title" content="About Our Center & Spiritual Guide | Zero Point Meditation Center"/>
        <meta property="og:description" content="Learn about Zero Point Meditation Center, its mission, H.E. Gegye Yongyal Tulku Rinpoche, and the team supporting meditation, Buddhist learning and community service."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="About Our Center & Spiritual Guide | Zero Point Meditation Center"/>
        <meta name="twitter:description" content="Learn about Zero Point Meditation Center, its mission, H.E. Gegye Yongyal Tulku Rinpoche, and the team supporting meditation, Buddhist learning and community service."/>
      </Helmet>
      {/* Split Hero: Tara image on the left, introduction on the right */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-12 w-screen overflow-hidden rounded-none border-0 shadow-none"
      >
        <div className="grid grid-cols-1 bg-[#f6f0e6] lg:grid-cols-2">
          <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#f6f0e6] sm:h-[380px] lg:h-[480px]">
            <img
              src={taraGoddess}
              alt="Tara Goddess"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex h-auto min-h-[300px] flex-col items-center justify-center bg-[#f6f0e6] px-5 py-8 text-center sm:min-h-[380px] sm:px-8 sm:py-9 lg:h-[480px] lg:min-h-0 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-2xl space-y-4">
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold shadow-md">
                <Building2 size={14} /> Tibetan Buddhist Sanctuary & Meditation Center
              </span>
              <h1 className="font-serif text-4xl font-bold leading-tight text-buddhist-burgundy sm:text-5xl xl:text-6xl">
                About Zero Point Meditation Center
              </h1>
              <p className="text-sm font-medium leading-relaxed text-stone-700 sm:text-base">
                The story of Zero Point Meditation Center is one of a growing community bringing people together through meditation, compassion, and shared humanity. From its beginnings in 2024 through the community-building work of 2025 and into 2026, the center has developed its vision of making inner wellbeing and interfaith understanding more accessible. Guided by <strong>H.E. Gegye Yongyal Tulku Rinpoche</strong>, we connect Himalayan Buddhist wisdom with practical support for people and communities today.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Zero Point Center Banner (SEO Block) */}
      <div className="bg-amber-50/70 p-8 sm:p-10 rounded-3xl border border-amber-200/70 grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} /> Our Spiritual Vision
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            A Peaceful Refuge for Mind-Training & Awareness
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            We spend time caring for our bodies through rest, nourishment, and movement. Our minds also need care, attention, and space to settle. We believe a healthy life includes opportunities to pause, reflect, and nurture inner balance.
          </p>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            Through meditation, Buddhist teachings, and community gatherings, we invite people to slow down, breathe, and reconnect with awareness, compassion, and the peaceful Buddha-nature within. Buddhist practice is at the heart of our work, while kindness, respect, and interfaith understanding shape how we welcome the wider community.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2 text-center">
          <h3 className="font-serif font-bold text-buddhist-burgundy text-lg">Join Our Sangha</h3>
          <p className="text-stone-600 text-xs">Explore free community classes, weekly discourses, and ritual gatherings.</p>
          <div className="pt-2">
            <a 
              href="/teachers" 
              className="inline-block px-5 py-2.5 bg-buddhist-burgundy text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
            >
              Meet Our People
            </a>
          </div>
        </div>
      </div>

      {/* Vision and Mission — presented together for clear visibility */}
      <section aria-labelledby="vision-mission-heading" className="relative overflow-hidden rounded-[2rem] bg-stone-900 px-7 py-10 sm:px-12 sm:py-14 text-amber-50 shadow-xl">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-buddhist-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-[0.2em]">Our purpose</span>
            <h2 id="vision-mission-heading" className="font-serif text-3xl sm:text-4xl font-bold">Our Vision & Mission</h2>
            <p className="mx-auto max-w-2xl text-stone-300 text-sm sm:text-base leading-relaxed">A shared commitment to inner wellbeing, compassionate action, and peace across communities and traditions.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <article className="rounded-2xl border border-amber-200/20 bg-white/5 p-6 sm:p-8 space-y-3">
              <span className="text-buddhist-gold text-xs font-bold uppercase tracking-widest">Our Vision</span>
              <h3 className="font-serif text-2xl font-bold">A more peaceful and mindful world</h3>
              <p className="text-stone-200 text-sm leading-relaxed">We envision a world where people from all backgrounds can access practices that nurture awareness, emotional balance, compassion, and mutual respect. We aspire to be a welcoming refuge where Himalayan Buddhist wisdom supports individual wellbeing and interfaith understanding.</p>
            </article>
            <article className="rounded-2xl border border-amber-200/20 bg-white/5 p-6 sm:p-8 space-y-3">
              <span className="text-buddhist-gold text-xs font-bold uppercase tracking-widest">Our Mission</span>
              <h3 className="font-serif text-2xl font-bold">Making care, practice, and connection accessible</h3>
              <p className="text-stone-200 text-sm leading-relaxed">Our mission is to share meditation and compassionate practice, encourage respectful relationships across religious and cultural traditions, and connect healthcare workers, life coaches, and community members so experience and care can be shared for the benefit of all.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Our Story: 2024–2026 */}
      <section aria-labelledby="our-story-heading" className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <BookOpen size={14} /> Our Journey
          </span>
          <h2 id="our-story-heading" className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">
            A Story of Wellbeing, Connection, and Peace
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            From 2024 to 2026, our story has been shaped by a simple belief: people and communities can thrive when they have space to reflect, care for their mental wellbeing, and meet one another with compassion.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[260px] md:min-h-[390px] bg-stone-100">
              <img src={currentJourney.image} alt={currentJourney.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-6">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-buddhist-burgundy">{currentJourney.year}</span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 space-y-5">
              <div className="space-y-3">
                <span className="text-buddhist-gold text-xs font-bold uppercase tracking-[0.18em]">Our story, year by year</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">{currentJourney.title}</h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">{currentJourney.detail}</p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex gap-2" aria-label="Choose a journey year">
                  {journeySlides.map((slide, index) => (
                    <button key={slide.year} type="button" onClick={() => setJourneyIndex(index)} aria-label={`Show ${slide.year}`} aria-pressed={journeyIndex === index} className={`h-2.5 rounded-full transition-all ${journeyIndex === index ? 'w-8 bg-buddhist-burgundy' : 'w-2.5 bg-stone-300 hover:bg-buddhist-gold'}`} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setJourneyIndex((journeyIndex + journeySlides.length - 1) % journeySlides.length)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-buddhist-burgundy hover:bg-amber-50" aria-label="Previous journey slide">←</button>
                  <button type="button" onClick={() => setJourneyIndex((journeyIndex + 1) % journeySlides.length)} className="rounded-full bg-buddhist-burgundy px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-red-900" aria-label="Next journey slide">→</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Biography & 3-Image Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Compass size={14} /> Founder & Spiritual Master
          </span>
          <h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">
            H.E. Gegye Yongyal Tulku Rinpoche
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Emanation of Lord Manjushri and Reincarnate Master of the Kagyu-Nyingma Himalayan Lineage.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column - Image Grid (3 Images) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Main Featured Image: profile.jpg */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/5] bg-stone-100">
              <img 
                src={profileMain} 
                alt="H.E. Gegye Yongyal Tulku Rinpoche - Founder of Zero Point Meditation Center"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex items-end p-6">
                <div className="text-amber-50 space-y-1">
                  <span className="bg-buddhist-gold text-stone-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Emanation of Lord Manjushri
                  </span>
                  <p className="text-xs font-serif italic text-stone-200 pt-1">
                    "Born to serve all sentient beings across the ten directions."
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Thumbnail Images: profile 1.jpg & profile 2.jpg */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-[4/3] bg-stone-100">
                <img 
                  src={profile1} 
                  alt="Rinpoche conducting sacred Tibetan ceremonies"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-stone-950/75 text-amber-50 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Sacred Ceremonies
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-[4/3] bg-stone-100">
                <img 
                  src={profile2} 
                  alt="Rinpoche at Global Interfaith Peace Assembly"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-stone-950/75 text-amber-50 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Global Outreach
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Research-Expanded Biography */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Quote Callout */}
            <div className="bg-amber-50/70 border-l-4 border-buddhist-gold p-6 rounded-r-2xl space-y-2">
              <div className="flex items-center gap-2 text-buddhist-burgundy font-bold text-xs uppercase tracking-wider">
                <Compass size={16} /> Sacred Lineage & Recognition
              </div>
              <p className="font-serif italic text-stone-800 text-sm sm:text-base leading-relaxed">
                "His Eminence Gegye Yongyal Tulku Rinpoche is recognized as the third seat reincarnate Trulku of Gegye Tashi Choling Monastery in Nyari (Mount Kailash). His hair-cutting and name-giving ceremony were conducted in India by His Holiness the 17th Gyalwa Karmapa."
              </p>
            </div>

            {/* Narrative Body Text */}
            <div className="space-y-4 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <p>
                As an ordained Buddhist teacher and lineage holder in both Kagyu and Nyingma traditions, Rinpoche established <strong>Zero Point Meditation Center</strong> to provide an authentic sanctuary for meditation, intellectual study, and emotional healing.
              </p>
              <p>
                Rinpoche completed extensive monastic training and holds a Master's degree in Buddhist philosophy. His scholar-level study spans the Five Major Canonical Treatises: <strong>Pramana</strong> (Logic & Epistemology), <strong>Prajnaparamita</strong> (Perfection of Wisdom), <strong>Madhyamika</strong> (Middle Way Philosophy), <strong>Abhidharma</strong> (Buddhist Metaphysics), and <strong>Vajrayana Tantra</strong>.
              </p>
              <p>
                Believing that spiritual realization must express itself through compassionate action, Rinpoche guides Zero Point Meditation Center to actively support Himalayan youth education, lead tree-planting reforestation projects, and organize global interfaith peace assemblies.
              </p>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-800 font-medium">
              <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <CheckCircle2 size={16} className="text-buddhist-burgundy shrink-0" />
                <span>Enthroned at Gegye Tashi Choling (Mt. Kailash)</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <CheckCircle2 size={16} className="text-buddhist-gold shrink-0" />
                <span>Name-giving ceremony by 17th Karmapa</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Master's Degree in Buddhist Philosophy</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <CheckCircle2 size={16} className="text-amber-700 shrink-0" />
                <span>Kagyu & Nyingma Lineage Master</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Institutional Leadership Section */}
      <div className="bg-stone-900 text-amber-50 rounded-3xl p-8 sm:p-12 border border-stone-800 space-y-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <HeartHandshake size={15} /> Global Network & Affiliations
          </span>
          <h2 className="font-serif text-3xl font-bold">
            Affiliated Centers & Humanitarian Initiatives
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Under Rinpoche's leadership, Zero Point Meditation Center collaborates with global monastic seats and NGOs to preserve Tibetan heritage and support community welfare worldwide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalProjects.map((proj, idx) => (
            <div 
              key={idx}
              className="bg-stone-800/80 border border-stone-700/80 p-5 rounded-2xl space-y-2 hover:border-buddhist-gold transition-colors"
            >
              <span className="text-buddhist-gold font-bold text-[11px] uppercase tracking-wider block">
                {proj.role}
              </span>
              <h4 className="font-serif font-bold text-base text-amber-50 leading-snug">
                {proj.name}
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                {proj.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
      <section id="join-sangha" aria-labelledby="join-sangha-heading" className="relative overflow-hidden rounded-[2rem] bg-amber-50 border border-amber-200 p-8 sm:p-12 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-[0.2em]">You are welcome here</span>
          <h2 id="join-sangha-heading" className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">Join Our Sangha</h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">Whether you are beginning a meditation practice, exploring Buddhist teachings, or looking for a supportive community, we welcome you. Take part in our community classes, teachings, and gatherings, and grow together through kindness and awareness.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a href="/contact" className="inline-flex items-center justify-center rounded-xl bg-buddhist-burgundy px-6 py-3 text-sm font-bold text-amber-50 hover:bg-red-900 transition-colors">Get in touch</a>
            <a href="/services" className="inline-flex items-center justify-center rounded-xl border border-buddhist-burgundy/30 px-6 py-3 text-sm font-bold text-buddhist-burgundy hover:bg-white transition-colors">Explore our offerings</a>
          </div>
        </div>
      </section>

    </div>
  );
}