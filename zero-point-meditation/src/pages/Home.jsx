import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles, Compass, HeartHandshake, ShieldCheck, Flame, Users, BookOpen, Award } from 'lucide-react';

// Assets (Convert heavy images to .webp in src/assets for maximum speed on Vercel)
import buddhaLotus from '../assets/buddha-lotus.webp'; 
import rinpocheProfile from '../assets/profile.jpg';
import event1 from '../assets/Event 1.jpeg';
import event2 from '../assets/Event 2.jpeg';
import event3 from '../assets/Event 3.jpeg';
import event4 from '../assets/Event 4.jpeg';
import event5 from '../assets/Event 5.jpeg';

const eventGallery = [
  {
    id: 1,
    category: 'Peace Rally',
    title: 'World Peace Prayer Gathering',
    location: 'Taipei, Taiwan',
    date: '2025',
    image: event1,
    description: 'International interfaith gathering bringing together spiritual leaders to chant sacred mantras and promote global ecological harmony.'
  },
  {
    id: 2,
    category: 'Public Teaching',
    title: 'Dharma & Mindfulness Discourse',
    location: 'Rubin Museum of Art, NY',
    date: '2024',
    image: event2,
    description: 'An illuminating lecture on integrating ancient Tibetan Lojong (Mind Training) practices into modern urban lifestyles.'
  },
  {
    id: 3,
    category: 'Retreat',
    title: 'Annual Meditation & Bodhicitta Retreat',
    location: 'Connecticut Monastery, US',
    date: '2024',
    image: event3,
    description: 'An intensive weekend immersion in Shamatha quietude, breath awareness, and compassionate mind-training meditation.'
  },
  {
    id: 4,
    category: 'Ceremony',
    title: 'Sacred Himalayan Sangha Assembly',
    location: 'Kathmandu, Nepal',
    date: '2023',
    image: event4,
    description: 'Traditional ceremonial blessings, butter lamp offerings, and monastic rituals for world peace and individual purification.'
  },
  {
    id: 5,
    category: 'Workshop',
    title: 'Youth Mindfulness & Interfaith Symposium',
    location: 'Zero Point Center, Online',
    date: '2025',
    image: event5,
    description: 'Empowering the next generation with practical emotional resilience tools, stress relief breathwork, and cross-cultural dialogue.'
  }
];

const features = [
  {
    icon: <Flame className="text-buddhist-gold" size={24} />,
    title: "Authentic Tibetan Lineage",
    desc: "Guided under the spiritual direction of H.E. Gegye Yongyal Tulku Rinpoche, preserving Kagyu and Nyingma wisdom traditions."
  },
  {
    icon: <Users className="text-buddhist-burgundy" size={24} />,
    title: "Inclusive Community Sangha",
    desc: "Open to all backgrounds, offering free meditation instruction, weekly prayers, and interfaith harmony gatherings."
  },
  {
    icon: <Compass className="text-emerald-600" size={24} />,
    title: "Mind Training (Lojong)",
    desc: "Transforming daily obstacles and emotional anxiety into clarity, inner strength, and universal compassion (Bodhicitta)."
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
              <Sparkles size={14} /> Tibetan Buddhist Sanctuary & Meditation Center
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-buddhist-burgundy leading-tight drop-shadow-sm">
              Welcome to Zero Point Meditation Center
            </h1>

            <p className="text-stone-800 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-sm">
              A non-profit spiritual refuge dedicated to authentic Himalayan mindfulness meditation, peace prayer assemblies, and ecological stewardship under the guidance of <strong>H.E. Gegye Yongyal Tulku Rinpoche</strong>.
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
                About Rinpoche
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

        {/* Spiritual Director Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-stone-900 text-amber-50 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl grid lg:grid-cols-12 gap-8 items-center"
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
              <Award size={15} /> Lineage Master & Scholar
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-50 leading-snug">
              H.E. Gegye Yongyal Tulku Rinpoche
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Recognized as the third seat reincarnate Trulku of Gegye Tashi Choling Monastery near Mount Kailash and an emanation of Lord Manjushri. Rinpoche holds a Master's degree in Buddhist philosophy and leads global projects in youth education, reforestation, and interfaith peace.
            </p>

            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-2">
              <p className="font-serif italic text-amber-200/90 text-xs sm:text-sm">
                "The teachings of the Buddha are so profound that achieving complete realization requires years of disciplined practice, study, and compassionate service."
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-buddhist-gold hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Learn More About Rinpoche <ArrowRight size={15} />
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
              Highlights from Rinpoche's international peace gatherings, public lectures, retreat programs, and sacred ceremonies.
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
              Cultivating Peace, Mindful Awareness & Merit
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              Zero Point Meditation Center operates as an open community hub dedicated to sharing authentic Tibetan Buddhist practices without commercial motive. All proceeds from our retreats and merchandise directly support our humanitarian programs, youth scholarships in Nepal, and regional tree-planting conservation projects.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" /> Free Community Classes
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-buddhist-gold" /> 100% Non-Profit Support
              </span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center">
            <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">
              Begin Your Practice Journey
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Whether you are looking to start a daily meditation routine or participate in our global world peace prayers, our Sangha warmly welcomes you.
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