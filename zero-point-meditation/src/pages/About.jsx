import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Trees, Sparkles, Compass, HeartHandshake, CheckCircle2, Building2, BookOpen } from 'lucide-react';

// Local Image Imports
import profileMain from '../assets/profile.jpg';
import profile1 from '../assets/profile 1.jpg';
import profile2 from '../assets/profile 2.jpg';
import gegyeYongyalRinpoche from '../assets/Teams/Gegye Yongyal Rinpoche\'s.png';
import tenzingNorkaySherpa from '../assets/Teams/Tenzing Norkay Sherpa.webp';
import smrityPhoto from '../assets/Teams/Smty.jpeg';

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
  return (
    
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <Helmet>
        <title>About Our Center & Spiritual Guide | Zero Point Meditation Center</title>
        <meta name="description" content="Learn about Zero Point Meditation Center, its mission, H.E. Gegye Yongyal Tulku Rinpoche, and the team supporting meditation, Buddhist learning and community service."/>
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
      {/* Hero Title Section - Center & Spiritual Director */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Building2 size={14} /> Tibetan Buddhist Sanctuary & Meditation Center
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">
          About Zero Point Meditation Center
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          The story of Zero Point Meditation Center is one of a growing community bringing people together through meditation, compassion, and shared humanity. From its beginnings in 2024 through the community-building work of 2025 and into 2026, the center has developed its vision of making inner wellbeing and interfaith understanding more accessible. Guided by <strong>H.E. Gegye Yongyal Tulku Rinpoche</strong>, we connect Himalayan Buddhist wisdom with practical support for people and communities today.
        </p>
      </motion.div>

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
            Our mission is to support mental wellbeing, nurture compassion, and encourage peace across faiths and cultures. Through accessible meditation, learning, and community gatherings, we hope to create welcoming spaces where people can pause, learn from one another, and build resilience. Buddhist practice is at the heart of our work, while kindness, respect, and interfaith understanding help shape how we welcome the wider community.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2 text-center">
          <h3 className="font-serif font-bold text-buddhist-burgundy text-lg">Join Our Sangha</h3>
          <p className="text-stone-600 text-xs">Explore free community classes, weekly discourses, and ritual gatherings.</p>
          <div className="pt-2">
            <a 
              href="#team" 
              className="inline-block px-5 py-2.5 bg-buddhist-burgundy text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
            >
              Check Our Team
            </a>
          </div>
        </div>
      </div>

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
        <div className="grid md:grid-cols-3 gap-5">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-buddhist-burgundy">2024 · Beginnings</span>
            <h3 className="font-serif text-xl font-bold text-stone-900">A place to pause and practice</h3>
            <p className="text-stone-600 text-sm leading-relaxed">The center’s story began with a commitment to share meditation and Buddhist mind-training in a welcoming setting. The aim was to make time for stillness, self-awareness, and compassion available to people navigating the pressures of everyday life.</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-buddhist-burgundy">2025 · Community</span>
            <h3 className="font-serif text-xl font-bold text-stone-900">Growing through shared purpose</h3>
            <p className="text-stone-600 text-sm leading-relaxed">As the vision developed, community connection and collaboration became increasingly important. Meditation, learning, and interfaith dialogue offered ways for people from different backgrounds to listen, learn, and build understanding around shared human concerns.</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-buddhist-burgundy">2026 · Wider connection</span>
            <h3 className="font-serif text-xl font-bold text-stone-900">Bringing care closer to the community</h3>
            <p className="text-stone-600 text-sm leading-relaxed">Today, the center is working toward stronger connections between the community and people whose work supports others, including healthcare workers and life coaches. By creating opportunities to meet, share knowledge, and collaborate, we aim to help make wellbeing support more connected, compassionate, and accessible.</p>
          </article>
        </div>
        <div className="rounded-3xl bg-amber-50/70 border border-amber-200/70 p-7 sm:p-9">
          <h3 className="font-serif text-2xl font-bold text-buddhist-burgundy mb-3">Our mission: mental wellbeing and interfaith peace</h3>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">We believe mental wellbeing is strengthened by reflection, supportive relationships, and a sense of belonging. Our mission is to share meditation and compassionate practice, encourage respectful relationships across religious and cultural traditions, and connect healthcare workers, life coaches, and community members so that experience and care can be shared for the benefit of all.</p>
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

      {/* Team Section */}
      <section id="team" className="space-y-8 pt-4 scroll-mt-24" aria-labelledby="team-heading">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Users size={14} /> The People Behind the Center
          </span>
          <h2 id="team-heading" className="font-serif text-3xl font-bold text-buddhist-burgundy">
            Our Team
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Meet the people who guide the center’s spiritual work and support its technology and operations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            {
              name: "Gegye Yongyal Rinpoche",
              role: "Founder & Teacher",
              image: gegyeYongyalRinpoche,
              alt: "Gegye Yongyal Rinpoche, Founder and Teacher"
            },
            {
              name: "Tenzing Norkay Sherpa",
              role: "IT Head (Nepal Team)",
              image: tenzingNorkaySherpa,
              alt: "Tenzing Norkay Sherpa, IT Head of the Nepal Team"
            },
            {
              name: "Smirti Pradhan",
              role: "Analytics and Development Manager",
              image: smrityPhoto,
              alt: "Smirti Pradhan, Analytics and Development Manager"
            },
            {
              name: "Mimi Lama",
              role: "Public Relations",
              image: null,
              alt: "Profile placeholder for Mimi Lama"
            },
            {
              name: "Dawa Dorje Sherpa",
              role: "Member",
              image: null,
              alt: "Profile placeholder for Dawa Dorje Sherpa"
            },
            {
              name: "Maya Karma Jinpa",
              role: "Advisor",
              image: null,
              alt: "Profile placeholder for Maya Karma Jinpa, Advisor"
            }
          ].map((member) => (
            <motion.article
              key={member.name}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-amber-50">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-buddhist-burgundy/70" aria-label={member.alt}>
                    <Users size={36} strokeWidth={1.4} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Photo coming soon</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 p-3 sm:p-4 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug">{member.name}</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-buddhist-gold">{member.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

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
    </div>
  );
}