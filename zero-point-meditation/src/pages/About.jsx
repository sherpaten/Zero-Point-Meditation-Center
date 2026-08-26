import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trees, Globe, Sparkles, Compass, HeartHandshake, CheckCircle2, Building2, Flame, Users, Heart } from 'lucide-react';

// Local Image Imports
import profileMain from '../assets/profile.jpg';
import profile1 from '../assets/profile 1.jpg';
import profile2 from '../assets/profile 2.jpg';

const centerPillars = [
  {
    icon: <Flame className="text-buddhist-gold" size={24} />,
    title: "Authentic Himalayan Tradition",
    description: "Preserving lineage teachings from the Kagyu and Nyingma schools of Tibetan Buddhism, offering genuine wisdom for modern spiritual seekers."
  },
  {
    icon: <Users className="text-buddhist-burgundy" size={24} />,
    title: "Inclusive Sangha & Community",
    description: "A sanctuary open to all individuals—regardless of background—seeking mindfulness meditation, emotional balance, and interfaith harmony."
  },
  {
    icon: <Trees className="text-emerald-600" size={24} />,
    title: "Eco-Dharma & Social Action",
    description: "Translating spiritual realization into practical action through youth education funding, tree-planting projects, and global climate advocacy."
  },
  {
    icon: <Heart className="text-amber-700" size={24} />,
    title: "100% Non-Profit Mission",
    description: "Every class, retreat contribution, and merchandise sale directly sustains free community meditation sessions and humanitarian outreach."
  }
];

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
          Zero Point Meditation Center is a non-profit spiritual haven dedicated to authentic Tibetan Buddhist mind training (Lojong), guided mindfulness meditation, and interfaith peace. Founded under the spiritual direction of <strong>H.E. Gegye Yongyal Tulku Rinpoche</strong>, our center serves as a bridge connecting ancient Himalayan wisdom with everyday modern living.
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
            At Zero Point Meditation Center, we provide accessible guided meditation, retreat programs, and authentic Buddhist discourse to relieve mental stress, cultivate Bodhicitta (universal compassion), and awaken inner peace. Whether you are beginner seeking daily breath awareness or an advanced practitioner deepening your Vajrayana study, our Sangha welcomes you.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2 text-center">
          <h3 className="font-serif font-bold text-buddhist-burgundy text-lg">Join Our Sangha</h3>
          <p className="text-stone-600 text-xs">Explore free community classes, weekly discourses, and ritual gatherings.</p>
          <div className="pt-2">
            <a 
              href="/events" 
              className="inline-block px-5 py-2.5 bg-buddhist-burgundy text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
            >
              View Upcoming Events
            </a>
          </div>
        </div>
      </div>

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

      {/* Zero Point Center Core Pillars Section */}
      <div className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">
            Core Pillars of Our Center
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            How Zero Point Meditation Center applies ancient Buddhist principles to foster individual quietude and global harmony.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centerPillars.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
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
    </div>
  );
}