import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { preload } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import HomeEventsCalendar from './HomeEventsCalendar';
import { Calendar, MapPin, ArrowRight, Sparkles, Compass, HeartHandshake, ShieldCheck, Flame, Users, BookOpen, Award, Volume2, VolumeX, Play, Pause, Quote } from 'lucide-react';

// Assets (Convert heavy images to .webp in src/assets for maximum speed on Vercel)
import buddhaLotus from "../assets/buddha-lotus.webp";
import morningMeditationUsPoster from '../assets/Classes/Poster 1.jpeg';
import morningMeditationNepalPoster from '../assets/Classes/Poster 2.jpeg';
import introductionVideo from "../assets/Introduction.mp4"; 
import rinpocheProfile from '../assets/profile.jpg';
import worldPeacePrayerDay from '../assets/Events/2025/2025 World Peace Prayer Day.jpg';
import weeklyMeditationMorning from '../assets/Events/2025/2025 Mindfulness Meditation.jpg';
import currentEventImage from '../assets/Event 3.jpeg';
import taraPrayerPoster from '../assets/poste/2026 the sacred Zabtik Dolma (Green Tara) Prayer.jpg';
import caipaFoundationLogo from '../assets/Partners Logo/CAIPA-Foundation_fus.png';
import chhayaLogo from '../assets/Partners Logo/Chhaya.png';
import nassauCountyLogo from '../assets/Partners Logo/Nassau County _0.jpg';
import ophcIfcLogo from '../assets/Partners Logo/OPHC-IFC_Clean1-01.jpg';
import plantingFieldsLogo from '../assets/Partners Logo/Planting Fields Foundation.png';
import rotaryQueensLogo from '../assets/Partners Logo/Rotary Queens.png';
import rubinLogo from '../assets/Partners Logo/Rubin.jpg';
import tibetHouseUsLogo from '../assets/Partners Logo/Tibet House US.jpg';

const eventGallery = [
  {
    id: 1,
    category: 'Upcoming Event',
    title: 'Bardo at THUS',
    location: 'Tibet House US',
    date: 'Nov 20',
    image: currentEventImage,
    externalUrl: 'https://shop.thus.org/products/bardo-after-life-reincarnation-with-gegye-yongyal-rinpoche',
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

const testimonials = [
  { name: 'Maya Karma Jinpa', quote: "Rinpoche's teachings are deeply inspiring. His explanations of Buddhist philosophy make difficult subjects easy to understand and apply in everyday life." },
  { name: 'Maya Chen', quote: 'I found the meditation session incredibly peaceful. Rinpoche has a wonderful way of helping people reconnect with themselves and develop compassion.' },
  { name: 'Anjali Sharma', quote: 'The teachings on compassion and mindfulness touched my heart. I left feeling peaceful, encouraged, and motivated to become a kinder person.' },
  { name: 'Kenji Nakamura', quote: 'A beautiful experience. Rinpoche explains ancient Buddhist wisdom in a way that feels relevant to modern life.' },
  { name: 'Jessica Wu', quote: "Rinpoche's teachings reminded me of the importance of genuine compassion, patience, and developing a sincere heart toward all beings." },
  { name: 'Priya Patel', quote: 'I especially appreciated the practical meditation guidance. It was not simply philosophy; it was something I could bring into my daily life.' },
  { name: 'David Wong', quote: 'The atmosphere was welcoming, and the teachings were profound without being complicated. I would highly recommend attending.' },
  { name: 'Lhakpa Sherpa', quote: 'Rinpoche communicates with warmth and sincerity. His teachings on the mind, suffering, and compassion gave me a new perspective.' },
  { name: 'Sakura Tanaka', quote: 'An enriching spiritual experience. I appreciated the opportunity to learn about Tibetan Buddhist traditions and experience meditation in such a welcoming environment.' },
  { name: 'David Rosenberg', quote: 'I appreciated how Rinpoche presented compassion as something universal. His teachings connected with values I have always cherished.' },
  { name: 'Sarah Goldstein', quote: "The meditation was deeply calming. Rinpoche's message about kindness, compassion, and understanding others was especially meaningful to me." },
  { name: 'Michael Cohen', quote: 'I enjoyed the openness of the discussion. The teachings encouraged me to reflect on my own life and how I relate to other people.' },
  { name: 'Rachel Levine', quote: "Rinpoche has a gentle and thoughtful teaching style. I appreciated his reflections on suffering, impermanence, and the importance of living meaningfully." },
  { name: 'Daniel Friedman', quote: 'As someone raised in the Jewish tradition, I found the discussion of compassion across spiritual traditions particularly beautiful. It was an enriching experience.' },
  { name: 'Rebecca Stein', quote: 'The session offered a wonderful opportunity to slow down and reflect. I left with a greater appreciation for mindfulness and the importance of compassion.' },
  { name: 'Jonathan Weiss', quote: "Rinpoche's teachings on death and the meaning of life were thought-provoking. I appreciated the respectful and welcoming atmosphere." },
  { name: 'Esther Kaplan', quote: 'A beautiful gathering with a meaningful message. The teachings reminded me that compassion and love are values that bring people from different backgrounds together.' },
  { name: 'Aaron Bernstein', quote: 'I appreciated the depth of Tibetan Buddhist philosophy and the practical approach to meditation. Rinpoche made the teachings accessible and inspiring.' },
];

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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSourceReady, setVideoSourceReady] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  // Let the browser prioritize the visible hero image before loading lower-priority media.
  preload(buddhaLotus, { as: 'image', fetchPriority: 'high' });

  // Load the introduction video only when it approaches the viewport.
  // On mobile, this keeps the below-the-fold video out of the initial page request.
  // Once visible, it still autoplays muted and loops as before.
  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return undefined;

    if (!('IntersectionObserver' in window)) {
      setVideoSourceReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoSourceReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -120px 0px', threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleVideoPlayback = async () => {
    const video = introVideoRef.current;
    if (!video) return;
    if (!video.getAttribute('src')) {
      setVideoSourceReady(true);
      setVideoPlaying(true);
      return;
    }
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
    <LazyMotion features={domAnimation}>
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
                width="1536"
                height="1024"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f3]/95 via-[#fbf8f3]/65 to-[#fbf8f3]/45" />
              <div className="absolute inset-y-0 right-0 z-10 hidden w-28 bg-gradient-to-r from-transparent to-[#fbf8f3] lg:block" />
            </div>

            <div className="relative z-20 mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-10 lg:px-12">
              <m.div
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
              </m.div>
            </div>
          </div>

          {/* Introduction video: muted autoplay is permitted by most browsers */}
          <div className="relative flex min-h-[320px] flex-col items-center justify-center gap-5 bg-[#fbf8f3] px-4 py-10 sm:px-8 lg:min-h-[620px] lg:py-12">
            <div className="w-full max-w-3xl space-y-1 text-center">
              <h2 className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">
                Discover Our Center
              </h2>
              <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                Get to know our community, teachings, and vision.
              </p>
            </div>
            <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fbf8f3] shadow-xl">
              <video
                ref={introVideoRef}
                src={videoSourceReady ? introductionVideo : undefined}
                autoPlay
                muted={videoMuted}
                loop
                playsInline
                preload="none"
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                aria-label="Introduction to Zero Point Meditation Center"
                className="absolute inset-0 h-full w-full object-contain"
              />
              <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
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
        
        {/* Focused path from the homepage into the center's services */}
        <m.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          aria-labelledby="explore-services-heading"
          className="rounded-3xl border border-amber-200/70 bg-amber-50/70 px-6 py-8 sm:px-10 sm:py-9 text-center"
        >
          <h2 id="explore-services-heading" className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">
            Explore Our Services
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
            Discover meditation, Buddhist learning, retreats, prayer services, and remote teacher-led programmes.
          </p>
          <Link to="/services" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-buddhist-burgundy px-6 py-3 text-xs font-bold uppercase tracking-wider text-amber-50 shadow-md transition-colors hover:bg-red-900">
            Explore Services <ArrowRight size={14} />
          </Link>
        </m.section>


        {/* Free Morning Meditation posters */}
        <m.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          aria-labelledby="free-morning-meditation-heading"
          className="space-y-8"
        >
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <span className="text-buddhist-gold text-xs font-bold uppercase tracking-widest">
              Open to Everyone
            </span>
            <h2 id="free-morning-meditation-heading" className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">
              Free Morning Meditation
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Join our online morning meditation practice. The sessions are offered in two languages, and both schedules use US time.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-amber-200/70 bg-white p-3 shadow-sm">
              <a
                href="https://bit.ly/morningmeditation_zpmc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open registration for the Nepal-hosted morning meditation session"
                className="block aspect-[4/5] overflow-hidden rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <img
                  src={morningMeditationUsPoster}
                  alt="Morning Meditation weekly practice poster with registration QR code"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-xl object-contain transition-opacity hover:opacity-90"
                />
              </a>
              <a
                href="https://bit.ly/morningmeditation_zpmc"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wider text-amber-50 transition-colors hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Register for This Session <ArrowRight size={14} />
              </a>
              <figcaption className="px-2 pb-2 pt-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-600">
                Nepali language · US time
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-amber-200/70 bg-white p-3 shadow-sm">
              <a
                href="https://bit.ly/morningmeditation2_zpmc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open registration for the English morning meditation session"
                className="block aspect-[4/5] overflow-hidden rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <img
                  src={morningMeditationNepalPoster}
                  alt="English morning meditation weekly practice poster with registration QR code"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-xl object-contain transition-opacity hover:opacity-90"
                />
              </a>
              <a
                href="https://bit.ly/morningmeditation2_zpmc"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-5 py-3 text-xs font-bold uppercase tracking-wider text-amber-50 transition-colors hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Register for This Session <ArrowRight size={14} />
              </a>
              <figcaption className="px-2 pb-2 pt-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-600">
                English language · US time
              </figcaption>
            </figure>
          </div>
          <div className="text-center">
            <Link
              to="/home#home-calendar-heading"
              className="inline-flex items-center gap-2 rounded-xl bg-buddhist-burgundy px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-50 shadow-md transition-colors hover:bg-red-900"
            >
              View Schedule & Register <ArrowRight size={14} />
            </Link>
          </div>
        </m.section>

        {/* Community reflections */}
        <m.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          aria-labelledby="community-reflections-heading"
          className="space-y-8"
        >
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <span className="inline-flex items-center justify-center gap-2 text-buddhist-gold text-xs font-bold uppercase tracking-widest">
              <HeartHandshake size={15} /> Shared Experiences
            </span>
            <h2 id="community-reflections-heading" className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">
              Words from Our Community
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Reflections shared by people who have joined our teachings, meditation sessions, and community gatherings.
            </p>
          </div>

          <div id="community-testimonials-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, showAllTestimonials ? testimonials.length : 6).map((review, index) => (
              <m.article
                key={review.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
                className="flex h-full flex-col rounded-2xl border border-amber-200/70 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <Quote size={23} aria-hidden="true" className="mb-3 text-buddhist-gold/80" />
                <p className="flex-1 text-sm leading-relaxed text-stone-700">“{review.quote}”</p>
                <div className="mt-5 border-t border-stone-100 pt-4">
                  <p className="font-serif text-base font-bold text-buddhist-burgundy">{review.name}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">Community reflection</p>
                </div>
              </m.article>
            ))}
          </div>

          {testimonials.length > 6 && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowAllTestimonials((show) => !show)}
                aria-expanded={showAllTestimonials}
                aria-controls="community-testimonials-grid"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-buddhist-burgundy shadow-sm transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                {showAllTestimonials ? 'Show fewer reflections' : 'Show more reflections'}
                <ArrowRight size={14} className={showAllTestimonials ? '-rotate-90' : 'rotate-90'} />
              </button>
            </div>
          )}
        </m.section>

        <HomeEventsCalendar />

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
              <m.div
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
                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-buddhist-burgundy group-hover:underline group-hover:translate-x-1 transition-all"
                    >
                      View Event Details <ArrowRight size={13} />
                    </a>
                  ) : (
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-buddhist-burgundy group-hover:underline group-hover:translate-x-1 transition-all"
                    >
                      View Event Details <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </m.div>
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

        {/* Community partners */}
        <m.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          aria-labelledby="community-partners-heading"
          className="space-y-8 rounded-3xl border border-amber-200/70 bg-amber-50/60 px-6 py-10 sm:px-10 sm:py-12"
        >
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <span className="inline-flex items-center justify-center gap-2 text-buddhist-gold text-xs font-bold uppercase tracking-widest">
              <HeartHandshake size={16} /> Working Together
            </span>
            <h2 id="community-partners-heading" className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">
              Our Partners & Community Supporters
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              We are grateful to the organizations and community partners whose support helps bring people together through learning, compassion, and service.
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'CAIPA Foundation', image: caipaFoundationLogo },
              { name: 'Chhaya', image: chhayaLogo },
              { name: 'Nassau County', image: nassauCountyLogo },
              { name: 'OPHC-IFC', image: ophcIfcLogo },
              { name: 'Planting Fields Foundation', image: plantingFieldsLogo },
              { name: 'Rotary Queens', image: rotaryQueensLogo },
              { name: 'Rubin', image: rubinLogo },
              { name: 'Tibet House US', image: tibetHouseUsLogo },
            ].map((partner) => (
              <div
                key={partner.name}
                className="flex h-32 items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:h-36 sm:p-5"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </m.section>

      </div>

      </div>
    </LazyMotion>
  );
}