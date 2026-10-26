import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles, Compass, HeartHandshake, ShieldCheck, Flame, Users, BookOpen, Award } from 'lucide-react';

// Assets (Convert heavy images to .webp in src/assets for maximum speed on Vercel)
import buddhaLotus from "../assets/buddha-lotus.webp"; 
import rinpocheProfile from '../assets/profile.jpg';
import event2025 from '../assets/Event 1.jpeg';
import event2024 from '../assets/Event 2.jpeg';
import currentEventImage from '../assets/Event 3.jpeg';
import taraPrayerPoster from '../assets/poste/2026 the sacred Zabtik Dolma (Green Tara) Prayer.jpg';

const eventGallery = [
  {
    id: 1,
    category: 'Community Event',
    title: 'Dharma Teaching & Mindfulness',
    location: 'Rubin Museum of Art, New York',
    date: '2024',
    image: event2024,
    description: 'A moment from the center’s wider community of Buddhist teachings, mindfulness, and shared learning.'
  },
  {
    id: 2,
    category: 'World Peace Gathering',
    title: 'World Peace Prayer Day',
    location: 'Community gathering',
    date: '2025',
    image: event2025,
    description: 'A gathering focused on prayer, compassion, and the shared aspiration for peace around the world.'
  },
  {
    id: 3,
    category: 'Upcoming Event',
    title: 'Bardo: After Life & Reincarnation',
    location: 'Hybrid event',
    date: 'Nov 20, 2026 · 6 PM',
    image: currentEventImage,
    description: 'An upcoming teaching exploring the Buddhist perspectives on the bardo, life after death, and reincarnation.'
  },
  {
    id: 4,
    category: 'Prayer Poster',
    title: 'The Sacred Zabtik Dolma (Green Tara) Prayer',
    location: 'Prayer & spiritual practice',
    date: '2026',
    image: taraPrayerPoster,
    description: 'A prayer poster highlighting the sacred Zabtik Dolma (Green Tara) practice.'
  }
];

const features = [
  {
    icon: <Flame className="text-buddhist-gold" size={24} />,
    title: "Mindfulness & Meditation",
    desc: "Explore meditation and Buddhist-inspired practices that can support awareness, reflection, and a more compassionate everyday life."
  },
  {
    icon: <Users className="text-buddhist-burgundy" size={24} />,
    title: "A Welcoming Community",
    desc: "A space for people from different backgrounds to connect through shared practice, learning, kindness, and community activities."
  },
  {
    icon: <Compass className="text-emerald-600" size={24} />,
    title: "Everyday Wellbeing",
    desc: "Discover practices and resources that encourage calm, emotional awareness, resilience, and compassion in daily life."
  }
];

export default function Home() {
  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* Full-Section Edge-to-Edge Hero */}
      <section className="relative w-full min-h-[620px] sm:min-h-[680px] flex items-center justify-center overflow-hidden bg-[#ded4c3]">
        
        {/* Full Image Container - Anchored to Top */}
        <div className="absolute inset-0 z-0">
          <img 
            src={buddhaLotus} 
            alt="Buddha Lotus Background" 
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-top"
          />
          {/* Vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f3] via-[#fbf8f3]/50 to-[#fbf8f3]/40" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border border-amber-300/80 shadow-md">
              <Sparkles size={14} /> A welcoming space for meditation, wellbeing & community
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-buddhist-burgundy leading-tight drop-shadow-sm">
              Welcome to Zero Point Meditation Center
            </h1>

            <p className="text-stone-800 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-sm">
              Zero Point Meditation Center welcomes people seeking greater peace, mindful awareness, compassionate connection, and spiritual learning. Discover our community, explore meditation and wellbeing resources, and find ways to practise, learn, and grow together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                to="/events" 
                className="px-8 py-3.5 bg-buddhist-burgundy hover:bg-red-900 text-amber-50 font-bold rounded-xl text-xs uppercase tracking-wider shadow-xl transition-all flex items-center gap-2 hover:scale-105"
              >
                Explore Events & Programs <ArrowRight size={14} />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-3.5 bg-white hover:bg-amber-50 text-buddhist-burgundy font-bold border border-amber-300/80 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
              >
                About the Center
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-6 space-y-20">
        
        {/* Core Features */}
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">{item.title}</h3>
              <p className="text-stone-600 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Spiritual Leader — a supporting part of the center's story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl grid lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 aspect-[4/5] bg-stone-800">
              <img 
                src={rinpocheProfile} 
                alt="H.E. Gegye Yongyal Tulku Rinpoche" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                <span className="bg-buddhist-gold text-stone-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Spiritual Master & Founder
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Award size={15} /> Our Spiritual Guide
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-50 leading-snug">
              H.E. Gegye Yongyal Tulku Rinpoche
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Gegye Yongyal Rinpoche offers spiritual guidance connected with the center's Buddhist traditions. Learn more about his background and teachings on our About page.
            </p>

            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-2">
              <p className="font-serif italic text-amber-200/90 text-xs sm:text-sm">
                "May our practice help nurture wisdom, compassion, and peace in everyday life."
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-buddhist-gold hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Meet Our Spiritual Guide <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Event & Practice Gallery */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
              <BookOpen size={14} /> Global Sangha Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">
              Event & Practice Gallery
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Explore moments from meditation practice, community gatherings, teachings, and events connected with our wider community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventGallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-amber-50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif font-bold text-xl text-buddhist-burgundy group-hover:text-amber-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-buddhist-gold shrink-0" /> {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-buddhist-gold shrink-0" /> {item.date}
                      </span>
                    </div>

                    <p className="text-stone-600 text-xs leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-buddhist-burgundy group-hover:underline group-hover:translate-x-1 transition-all"
                  >
                    View Event Details <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-buddhist-burgundy hover:bg-red-900 text-amber-50 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
            >
              Learn More on Events & Programs Page <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Mission & Overview */}
        <div className="bg-amber-50/70 rounded-3xl p-8 sm:p-12 border border-amber-200/70 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <HeartHandshake size={15} /> Spiritual Sanctuary & Outreach
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              A Community for Peace, Awareness & Connection
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              Zero Point Meditation Center is a welcoming space for meditation, spiritual learning, compassionate connection, and community participation. We aim to make it easier for visitors to explore practices, learn about upcoming activities, and discover ways to support the center's work.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" /> Free Community Classes
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-buddhist-gold" /> Community & Spiritual Learning
              </span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center">
            <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">
              Begin Your Practice Journey
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Whether you are new to meditation or continuing an established practice, we invite you to explore the center, learn at your own pace, and take part in community activities.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/teachings"
                className="px-5 py-2.5 bg-buddhist-burgundy text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
              >
                Read Teachings
              </Link>
              <Link
                to="/merchandise"
                className="px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
              >
                Sacred Merchandise
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}