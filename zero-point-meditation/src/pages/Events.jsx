import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ImageIcon, FileText, Newspaper, X, Eye, Users, Handshake } from 'lucide-react';

import event1 from '../assets/Event 1.jpeg';
import event2 from '../assets/Event 2.jpeg';
import event3 from '../assets/Event 3.jpeg';
import event4 from '../assets/Event 4.jpeg';
import event5 from '../assets/Event 5.jpeg';
import event6 from '../assets/Event 6.jpeg';
import event7 from '../assets/Event 7.jpeg';
import event8 from '../assets/Event 8.jpeg';
import event9 from '../assets/Event 9.jpeg';
import event10 from '../assets/Event 10.webp';
import event11 from '../assets/Event 11.jpeg';

import news1 from '../assets/News 1.webp';
import post3 from '../assets/post 3.jpg';
import poster1 from '../assets/Poste 1.webp';
import poster2 from '../assets/Poste 2.jpeg';

// SEO-Optimized Real Event Data
const galleryItems = [
  // --- REAL EVENT 1 ---
  {
    id: 1,
    title: "Mid-Autumn Cultural Festival & Community Gathering",
    type: "photo",
    category: "Event Photos",
    date: "September 2023",
    location: "Crest Hollow, Long Island, NY",
    image: event1,
    description: "H.E. Gegye Yongyal Rinpoche and Zero Point Meditation Center joined Director Meng Li (Nassau County Asian American Affairs), Ning Lu, Shirley (V.P of PR, CAIPA), Mimi Lama, Tsering Dolma Lama, Mr. Takla, Miss Sushma, and Long Island community leaders to celebrate harmony, cultural heritage, and mindfulness.",
    keywords: "Mid-Autumn Festival, Crest Hollow, Nassau County Asian American Affairs, Long Island Buddhist Gathering, Gegye Yongyal Rinpoche"
  },

  // --- REAL EVENT 2 ---
  {
    id: 2,
    title: "Manhattan Buddhist Prayer Gathering & Spiritual Class Partnership",
    type: "news",
    category: "News",
    date: "January 13",
    location: "Manhattan, New York",
    image: news1,
    description: "Invited by the Amitabha Society of Philadelphia, Zero Point Meditation Center joined community prayers in Manhattan. H.E. Gegye Yongyal Rinpoche officially partnered with Mr. Shu Hong Liang of A&C Culture Center to offer free spiritual classes and meditation training to the public.",
    keywords: "Manhattan Buddhist Gathering, Amitabha Society of Philadelphia, A&C Culture Center, Free Spiritual Classes, Shu Hong Liang, Mind Training"
  },

  // --- RECENT UPDATE: PRAY FOR NEPAL ---
  {
    id: 3,
    title: "Healing and Prayers for Nepal: Standing Together in Compassion",
    type: "news",
    category: "News",
    date: "August 2026",
    location: "Global / Nepal",
    image: post3,
    description: "With a deeply saddened heart, we offer our thoughts and prayers for Nepal and everyone impacted by this devastating natural disaster. May all those affected receive swift support, strength, and healing. Honoring lives lost, strength for families, safety and care, and a collective call to compassion through the blessings of the Three Jewels. Om Mani Padme Hum. 🙏🙏🙏",
    keywords: "Pray for Nepal, Natural Disaster Relief, Buddhist Prayers, H.E. Gegye Yongyal Rinpoche, Compassion, Om Mani Padme Hum"
  },

  // --- POSTERS & OTHER ARCHIVE ITEMS ---
  { id: 4, title: "Global Peace & Dharma Discourse Poster", type: "poster", category: "Posters", date: "2024", location: "Taipei, Taiwan", image: poster1, description: "Official promotional poster for upcoming international peace rally and mind-training retreat." },
  { id: 5, title: "Retreat & Meditation Workshop Announcement", type: "poster", category: "Posters", date: "2023", location: "New York, USA", image: poster2, description: "Event announcement flyer for public lectures on Buddhist philosophy." },
  { id: 6, title: "Interfaith Prayer & Unity Assembly", type: "photo", category: "Event Photos", date: "2023", location: "UN Plaza, NY", image: event2, description: "Interfaith dialogue promoting global harmony and community peace." },
  { id: 7, title: "Lamp Offering & Blessing Ceremony", type: "photo", category: "Event Photos", date: "2023", location: "New York Center", image: event3, description: "Traditional butter lamp offerings led by Rinpoche for world peace." },
  { id: 8, title: "Youth Mind-Training & Meditation Session", type: "photo", category: "Event Photos", date: "2023", location: "Community Hall", image: event4, description: "Interactive workshop introducing young adults to modern mindfulness techniques." },
  { id: 9, title: "Rubin Museum Public Discourse", type: "photo", category: "Event Photos", date: "2022", location: "Rubin Museum of Art, NY", image: event5, description: "Public talk on timeless wisdom and compassion in modern daily life." },
  { id: 10, title: "Community Health & Culture Assembly", type: "photo", category: "Event Photos", date: "2023", location: "Long Island, NY", image: event6, description: "Supporters gathering to foster cultural exchange and local wellness initiatives." },
  { id: 11, title: "Sacred Chanting & Meditation Assembly", type: "photo", category: "Event Photos", date: "2022", location: "Monastery Center", image: event7, description: "Traditional Tibetan Buddhist chanting and group contemplation." },
  { id: 12, title: "Individual Blessings & Sangha Meet", type: "photo", category: "Event Photos", date: "2022", location: "Taipei, Taiwan", image: event8, description: "Personal blessings and spiritual guidance offered to community members." },
  { id: 13, title: "Guided Meditation Instruction", type: "photo", category: "Event Photos", date: "2021", location: "Online Center", image: event9, description: "Demonstrating posture, breathwork, and posture alignment for beginners." },
  { id: 14, title: "Annual Peace Gathering Highlights", type: "photo", category: "Event Photos", date: "2021", location: "New York", image: event10, description: "Group portrait of practitioners, guests, and community supporters." },
  { id: 15, title: "Dharma & Wisdom Exchange", type: "photo", category: "Event Photos", date: "2021", location: "New York", image: event11, description: "Open forum exploring Buddhist philosophy and stress-reduction methods." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function Events() {
  const [filter, setFilter] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const getBadgeIcon = (type) => {
    if (type === 'poster') return <FileText size={12} />;
    if (type === 'news') return <Newspaper size={12} />;
    return <ImageIcon size={12} />;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* SEO-Optimized Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Handshake size={14} /> Community, Peace & Cultural Gatherings
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">
          Events, News & Partnerships
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          Explore Zero Point Meditation Center’s events—from Long Island cultural celebrations and Manhattan interfaith prayer assemblies to free community spiritual classes led by H.E. Gegye Yongyal Rinpoche.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center gap-2 border-b border-stone-200 pb-4 flex-wrap"
      >
        {['All', 'Event Photos', 'News', 'Posters'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`relative px-5 py-2 rounded-full text-xs font-bold transition-colors ${
              filter === tab ? 'text-amber-50' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {filter === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-buddhist-burgundy rounded-full shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={filter}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer group flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/30 shadow-lg">
                    <Eye size={20} />
                  </span>
                </div>

                <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-amber-50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-white/10">
                  {getBadgeIcon(item.type)}
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-buddhist-burgundy leading-snug group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-xs mt-2 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={13} className="text-buddhist-gold" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={13} className="text-stone-400" /> {item.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col text-amber-50 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 bg-stone-950/80 hover:bg-stone-950 text-white p-2 rounded-full border border-white/20 transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[65vh]">
                <img
                  src={selectedMedia.image}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-stone-900 space-y-2 overflow-y-auto">
                <div className="flex items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">
                  <span>{selectedMedia.category}</span>
                  <span>•</span>
                  <span>{selectedMedia.location}</span>
                  <span>•</span>
                  <span>{selectedMedia.date}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-50">{selectedMedia.title}</h3>
                <p className="text-stone-300 text-sm leading-relaxed">{selectedMedia.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}