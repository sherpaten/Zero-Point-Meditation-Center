import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeEventsCalendar from './HomeEventsCalendar';
import { Calendar, MapPin, ArrowRight, Sparkles, Compass, HeartHandshake, ShieldCheck, Flame, Users, BookOpen, Award, Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Assets (Convert heavy images to .webp in src/assets for maximum speed on Vercel)
import buddhaLotus from "../assets/buddha-lotus.webp";
import introductionVideo from "../assets/Introduction.mp4"; 
import rinpocheProfile from '../assets/profile.jpg';
import worldPeacePrayerDay from '../assets/Events/2025/2025 World Peace Prayer Day.jpg';
import weeklyMeditationMorning from '../assets/Events/2025/2025 Mindfulness Meditation.jpg';
import currentEventImage from '../assets/Event 3.jpeg';
import taraPrayerPoster from '../assets/poste/2026 the sacred Zabtik Dolma (Green Tara) Prayer.jpg';

const eventGallery = [
  {
    id: 1,
    category: 'Upcoming Event',
    title: 'Bardo at THUS',
    location: 'Tibet House US',
    date: 'Nov 20',
    image: currentEventImage,
    description: 'An upcoming teaching exploring Buddhist perspectives on the bardo, life after death, and reincarnation.'
  },
  {
    id: 2,
    category: 'Meditation Practice',
    title: 'Weekly Meditation Morning',
    location: 'Zero Point Meditation Center',
    date: 'Nov 4th',
    image: weeklyMeditationMorning,
    description: 'Join the community for a morning of meditation, mindful breathing, and shared practice.'
  },
  {
    id: 3,
    category: 'Community Event',
    title: 'World Peace Prayer Day',
    location: 'Planting Fields, Long Island, New York',
    date: '2025',
    image: worldPeacePrayerDay,
    description: 'A major gathering hosted with community partners, bringing people together through prayer, compassion, unity, and a shared aspiration for world peace.'
  }
];;

const features = [
  {
    icon: <Flame className="text-buddhist-gold" size={24} />,
    title: "Make Space for Stillness",
    desc: "Take a breath, settle your attention, and explore practices that help you meet everyday life with greater clarity, patience, and kindness."
  },
  {
    icon: <Users className="text-buddhist-burgundy" size={24} />,
    title: "Grow Together",
    desc: "You do not need to have it all figured out. Come as you are and connect with others through shared practice, thoughtful conversation, and kindness."
  },
  {
    icon: <Compass className="text-emerald-600" size={24} />,
    title: "Bring Calm Into Daily Life",
    desc: "Carry the feeling of practice beyond the meditation space—with simple ways to nurture steadiness, compassion, and awareness in everyday moments."
  }
];

export default function Home() {
  const location = useLocation();
  const introVideoRef = useRef(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);

  const toggleVideoPlayback = async () => {
    const video = introVideoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setVideoPlaying(true);
      } catch {
        setVideoPlaying(false);
      }
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };
  useEffect(() => {
    if (location.hash === '#home-calendar-heading') {
      requestAnimationFrame(() => {
        document.getElementById('home-calendar-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

  return (
    
      <div className="w-full space-y-16 pb-16">
      <Helmet>
        <title>Meditation & Buddhist Community | Zero Point Meditation Center</title>
        <meta name="description" content="Explore free meditation sessions, Tibetan Buddhist teachings, community events and compassionate spiritual support at Zero Point Meditation Center."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/home"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/home"/>
        <meta property="og:title" content="Meditation & Buddhist Community | Zero Point Meditation Center"/>
        <meta property="og:description" content="Explore free meditation sessions, Tibetan Buddhist teachings, community events and compassionate spiritual support at Zero Point Meditation Center."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Meditation & Buddhist Community | Zero Point Meditation Center"/>
        <meta name="twitter:description" content="Explore free meditation sessions, Tibetan Buddhist teachings, community events and compassionate spiritual support at Zero Point Meditation Center."/>
      </Helmet>
      
      {/* Split Hero: keep the Buddha image and existing introduction text together, with autoplay video alongside */}
      <section className="relative w-full overflow-hidden bg-[#ded4c3]">
        <div className="grid lg:grid-cols-2 min-h-[620px]">
          {/* Buddha image with the original hero copy and calls to action */}
          <div className="relative flex min-h-[620px] items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={buddhaLotus}
                alt="Buddha seated on a lotus"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f3]/95 via-[#fbf8f3]/65 to-[#fbf8f3]/45" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-10 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-widest text-buddhist-gold shadow-md backdrop-blur-md">
                  <Sparkles size={14} /> Pause. Breathe. Find Your Center.
                </span>

                <h1 className="font-serif text-4xl font-bold leading-tight text-buddhist-burgundy drop-shadow-sm sm:text-6xl">
                  A Place to Pause, Reconnect & Find Peace
                </h1>

                <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-stone-800 drop-shadow-sm sm:text-lg">
                  Life can feel busy, noisy, and overwhelming. Zero Point Meditation Center is an invitation to slow down, breathe, and reconnect with what matters. Through meditation, Buddhist wisdom, shared learning, and compassionate community, we create space for greater awareness, inner balance, and peace—one moment at a time.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link
                    to="/home#home-calendar-heading"
                    className="flex items-center gap-2 rounded-xl bg-buddhist-burgundy px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-50 shadow-xl transition-all hover:scale-105 hover:bg-red-900"
                  >
                    Find Your Next Gathering <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/about"
                    className="rounded-xl border border-amber-300/80 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-buddhist-burgundy shadow-md transition-all hover:scale-105 hover:bg-amber-50"
                  >
                    About the Center
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Introduction video: muted autoplay is permitted by most browsers */}
          <div className="relative flex min-h-[320px] items-center justify-center bg-[#fbf8f3] p-4 sm:p-8 lg:min-h-[620px]">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fbf8f3] shadow-xl">
              <video
                ref={introVideoRef}
                src={introductionVideo}
                autoPlay
                muted={videoMuted}
                loop
                playsInline
                preload="auto"
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                aria-label="Introduction to Zero Point Meditation Center"
                className="block aspect-video h-full max-h-[560px] w-full object-contain"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVideoMuted((muted) => !muted)}
                  aria-label={videoMuted ? "Unmute introduction video" : "Mute introduction video"}
                  aria-pressed={!videoMuted}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-stone-950/75 text-white shadow-lg backdrop-blur transition-colors hover:bg-buddhist-burgundy focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {videoMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                </button>
                <button
                  type="button"
                  onClick={toggleVideoPlayback}
                  aria-label={videoPlaying ? "Pause introduction video" : "Play introduction video"}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-stone-950/75 text-white shadow-lg backdrop-blur transition-colors hover:bg-buddhist-burgundy focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {videoPlaying ? <Pause size={19} /> : <Play size={19} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-6 space-y-20">
        
        {/* Welcome message: caring for the mind */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          aria-labelledby="mind-care-heading"
          className="rounded-3xl border border-amber-200/70 bg-amber-50/70 px-6 py-8 sm:px-10 sm:py-10 text-center space-y-4"
        >
          <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">
            A moment for yourself
          </span>
          <h2 id="mind-care-heading" className="font-serif text-3xl sm:text-4xl font-bold text-buddhist-burgundy">
            Your Mind Deserves Care, Too
          </h2>
          <div className="mx-auto max-w-3xl space-y-3 text-stone-700 text-sm sm:text-base leading-relaxed">
            <p>
              We make time to care for our bodies, but our minds need care, attention, and room to rest as well. In a busy world, taking a moment to slow down and breathe can help us reconnect with what matters.
            </p>
            <p>
              At Zero Point Meditation Center, we welcome you to explore meditation, Buddhist wisdom, and shared practice in a supportive community. Whether you are beginning or continuing your journey, there is space here to learn, reflect, and reconnect with the peaceful Buddha-nature within.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/teachings" className="inline-flex items-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wider text-amber-50 shadow-md transition-colors hover:bg-red-900">
              Explore Our Teachings <ArrowRight size={14} />
            </Link>
            <Link to="/about" className="inline-flex items-center rounded-xl border border-amber-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-buddhist-burgundy transition-colors hover:bg-amber-50">
              Learn About Our Mission
            </Link>
          </div>
        </motion.section>

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

        <HomeEventsCalendar />

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
              A glimpse of the moments we share: prayer, learning, community, and the quiet intention to bring more compassion and peace into the world.
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
              <HeartHandshake size={15} /> A Space for Reflection & Connection
            </span>
            <h2 className="min-w-0 break-words font-serif text-2xl sm:text-3xl font-bold leading-tight text-stone-900">
              Come As You Are. Begin Where You Are.
            </h2>
            <p className="min-w-0 break-words text-stone-700 text-sm leading-relaxed">
              At Zero Point Meditation Center, there is room to pause, ask questions, learn, and simply be present. We bring people together through meditation, Buddhist teachings, prayer, and community activities—cultivating compassion within ourselves and extending it into the world around us.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs font-semibold text-stone-800 min-w-0">
              <span className="flex min-w-0 items-start gap-1.5 break-words">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="min-w-0 break-words">Free Community Classes Through 2026</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-buddhist-gold shrink-0 mt-0.5" /> <span className="min-w-0 break-words">Community & Spiritual Learning</span>
              </span>
            </div>
          </div>

          <div className="min-w-0 w-full max-w-full overflow-hidden bg-white p-4 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center">
            <h3 className="break-words font-serif text-xl sm:text-xl font-bold leading-snug text-buddhist-burgundy">
              Your Moment of Stillness Starts Here
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              New to meditation or returning to your practice? You are welcome here. Explore at your own pace, discover what resonates, and take a gentle first step toward a more mindful life.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/teachings"
                className="max-w-full whitespace-normal break-words px-4 sm:px-5 py-2.5 bg-buddhist-burgundy text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
              >
                Read Teachings
              </Link>
              <Link
                to="/merchandise"
                className="max-w-full whitespace-normal break-words px-4 sm:px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
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