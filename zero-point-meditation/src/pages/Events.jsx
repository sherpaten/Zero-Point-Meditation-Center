import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Image as ImageIcon, FileText, Newspaper, X, Eye, Handshake } from 'lucide-react';

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
import post3 from '../assets/Post 3.jpg';
import poster1 from '../assets/Poste 1.webp';
import poster2 from '../assets/Poste 2.jpeg';

/*
  HOW TO ADD NEW CONTENT:
  1. Add an image import above. Example:
     import event2024Photo1 from '../assets/Events/2024/EXACT-FILENAME.jpg';
  2. Add a new object to galleryItems below, copying one of the examples.
  3. Set group to exactly one of: '2024', '2025', 'Current', or 'Poste&News'.
  4. Replace the title, date, location and description with verified information.
  5. Keep old entries below; do not delete them.
  The folder and filename in each import must match the real filename and capitalization.
*/

const galleryItems = [
  // ==================== OLDER ARCHIVE — PRESERVED EXISTING CONTENT ====================
  {
    id: 1, group: 'Older', title: 'Mid-Autumn Cultural Festival & Community Gathering',
    type: 'photo', category: 'Event Photos', date: 'September 2023',
    location: 'Crest Hollow, Long Island, NY', image: event1,
    description: 'H.E. Gegye Yongyal Rinpoche and Zero Point Meditation Center joined Director Meng Li (Nassau County Asian American Affairs), Ning Lu, Shirley (V.P of PR, CAIPA), Mimi Lama, Tsering Dolma Lama, Mr. Takla, Miss Sushma, and Long Island community leaders to celebrate harmony, cultural heritage, and mindfulness.'
  },
  {
    id: 2, group: 'Poste&News', title: 'Manhattan Buddhist Prayer Gathering & Spiritual Class Partnership',
    type: 'news', category: 'News', date: 'January 13 (year to confirm)',
    location: 'Manhattan, New York', image: news1,
    description: 'Invited by the Amitabha Society of Philadelphia, Zero Point Meditation Center joined community prayers in Manhattan. H.E. Gegye Yongyal Rinpoche officially partnered with Mr. Shu Hong Liang of A&C Culture Center to offer free spiritual classes and meditation training to the public.'
  },
  {
    id: 3, group: 'Current', title: 'Healing and Prayers for Nepal: Standing Together in Compassion',
    type: 'news', category: 'New News', date: 'August 2026',
    location: 'Global / Nepal', image: post3,
    description: 'With a deeply saddened heart, we offer our thoughts and prayers for Nepal and everyone impacted by this devastating natural disaster. May all those affected receive swift support, strength, and healing. Honoring lives lost, strength for families, safety and care, and a collective call to compassion through the blessings of the Three Jewels. Om Mani Padme Hum. 🙏🙏🙏'
  },
  {
    id: 4, group: '2024', title: 'Global Peace & Dharma Discourse Poster',
    type: 'poster', category: 'Posters', date: '2024', location: 'Taipei, Taiwan',
    image: poster1, description: 'Official promotional poster for an international peace rally and mind-training retreat.'
  },
  {
    id: 5, group: 'Older', title: 'Retreat & Meditation Workshop Announcement',
    type: 'poster', category: 'Posters', date: '2023', location: 'New York, USA',
    image: poster2, description: 'Event announcement flyer for public lectures on Buddhist philosophy.'
  },
  {
    id: 6, group: 'Older', title: 'Interfaith Prayer & Unity Assembly',
    type: 'photo', category: 'Event Photos', date: '2023', location: 'UN Plaza, NY',
    image: event2, description: 'Interfaith dialogue promoting global harmony and community peace.'
  },
  {
    id: 7, group: 'Older', title: 'Lamp Offering & Blessing Ceremony',
    type: 'photo', category: 'Event Photos', date: '2023', location: 'New York Center',
    image: event3, description: 'Traditional butter lamp offerings led by Rinpoche for world peace.'
  },
  {
    id: 8, group: 'Older', title: 'Youth Mind-Training & Meditation Session',
    type: 'photo', category: 'Event Photos', date: '2023', location: 'Community Hall',
    image: event4, description: 'Interactive workshop introducing young adults to mindfulness techniques.'
  },
  {
    id: 9, group: 'Older', title: 'Rubin Museum Public Discourse',
    type: 'photo', category: 'Event Photos', date: '2022', location: 'Rubin Museum of Art, NY',
    image: event5, description: 'Public talk on timeless wisdom and compassion in daily life.'
  },
  {
    id: 10, group: 'Older', title: 'Community Health & Culture Assembly',
    type: 'photo', category: 'Event Photos', date: '2023', location: 'Long Island, NY',
    image: event6, description: 'Supporters gathering to foster cultural exchange and local wellness initiatives.'
  },
  {
    id: 11, group: 'Older', title: 'Sacred Chanting & Meditation Assembly',
    type: 'photo', category: 'Event Photos', date: '2022', location: 'Monastery Center',
    image: event7, description: 'Traditional Tibetan Buddhist chanting and group contemplation.'
  },
  {
    id: 12, group: 'Older', title: 'Individual Blessings & Sangha Meet',
    type: 'photo', category: 'Event Photos', date: '2022', location: 'Taipei, Taiwan',
    image: event8, description: 'Personal blessings and spiritual guidance offered to community members.'
  },
  {
    id: 13, group: 'Older', title: 'Guided Meditation Instruction',
    type: 'photo', category: 'Event Photos', date: '2021', location: 'Online Center',
    image: event9, description: 'Demonstration of posture, breathing, and alignment for beginners.'
  },
  {
    id: 14, group: 'Older', title: 'Annual Peace Gathering Highlights',
    type: 'photo', category: 'Event Photos', date: '2021', location: 'New York',
    image: event10, description: 'Group portrait of practitioners, guests, and community supporters.'
  },
  {
    id: 15, group: 'Older', title: 'Dharma & Wisdom Exchange',
    type: 'photo', category: 'Event Photos', date: '2021', location: 'New York',
    image: event11, description: 'Open forum exploring Buddhist philosophy and stress-reduction methods.'
  },

  // ==================== ADD NEW EVENT PHOTOS BELOW ====================
  // 2024: Add one object per photo. Use group: '2024'.
  // Example:
  // { id: 16, group: '2024', title: 'ADD EVENT TITLE', type: 'photo',
  //   category: 'Event Photos', date: 'ADD DATE', location: 'ADD LOCATION',
  //   image: event2024Photo1, description: 'ADD VERIFIED EVENT DESCRIPTION' },

  // 2025: Add one object per photo. Use group: '2025'.
  // Example:
  // { id: 17, group: '2025', title: 'ADD EVENT TITLE', type: 'photo',
  //   category: 'Event Photos', date: 'ADD DATE', location: 'ADD LOCATION',
  //   image: event2025Photo1, description: 'ADD VERIFIED EVENT DESCRIPTION' },

  // Current / 2026: Add current or upcoming event objects here. Use group: 'Current'.
  // Example:
  // { id: 18, group: 'Current', title: 'ADD EVENT TITLE', type: 'photo',
  //   category: 'Event Photos', date: 'ADD DATE', location: 'ADD LOCATION',
  //   image: currentEventPhoto1, description: 'ADD VERIFIED EVENT DESCRIPTION' },

  // Posters & News: Add posters, announcements, and news here. Use group: 'Poste&News'.
  // Example:
  // { id: 19, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE', type: 'poster',
  //   category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION',
  //   image: newPoster1, description: 'ADD VERIFIED POSTER OR NEWS DESCRIPTION' },
];

const tabs = ['All', 'Older', '2024', '2025', 'Current', 'Poste&News'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.16 } }
};

export default function Events() {
  const [filter, setFilter] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filteredItems = filter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.group === filter);

  const getBadgeIcon = (type) => {
    if (type === 'poster') return <FileText size={12} />;
    if (type === 'news') return <Newspaper size={12} />;
    return <ImageIcon size={12} />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8 sm:space-y-10">
      <motion.header
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Handshake size={14} /> Community, Peace & Cultural Gatherings
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">
          Events, News & Partnerships
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          Explore the Zero Point Meditation Center archive. Choose a year or collection to browse the photographs, event records, posters, and news. More verified details will be added as they are provided.
        </p>
      </motion.header>

      {/* Navigation order requested: All, Older, 2024, 2025, Current, Poste&News */}
      <nav aria-label="Filter event archive" className="flex justify-center gap-2 border-b border-stone-200 pb-4 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setFilter(tab)}
            aria-pressed={filter === tab}
            className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold ${filter === tab ? 'text-amber-50' : 'text-stone-600 hover:text-stone-900'}`}>
            {filter === tab && (
              <motion.span layoutId="activeEventTab" className="absolute inset-0 bg-buddhist-burgundy rounded-full shadow-md" />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </nav>

      <motion.section key={filter} variants={containerVariants} initial="hidden" animate="visible"
        aria-live="polite" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.article key={item.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              whileHover={{ y: -5, transition: { duration: 0.18 } }}
              onClick={() => setSelectedMedia(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedMedia(item); } }}
              role="button" tabIndex={0} aria-label={`View details for ${item.title}`}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <motion.img src={item.image} alt={item.title} loading="lazy"
                  whileHover={{ scale: 1.05 }} transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-stone-950/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/30"><Eye size={20} /></span>
                </div>
                <span className="absolute top-3 left-3 bg-stone-950/80 text-amber-50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  {getBadgeIcon(item.type)} {item.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-base text-buddhist-burgundy leading-snug group-hover:text-amber-700 transition-colors">{item.title}</h2>
                  <p className="text-stone-600 text-xs mt-2 leading-relaxed line-clamp-3">{item.description}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-buddhist-gold" />{item.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} />{item.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {filteredItems.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
            <ImageIcon className="mx-auto mb-3 text-stone-400" size={28} />
            <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{filter} archive</h2>
            <p className="text-sm text-stone-600 mt-2">No entries have been added to this collection yet. Add the photo import and event details in the marked section of <code>src/pages/Events.jsx</code>.</p>
          </div>
        )}
      </motion.section>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
            onKeyDown={(e) => { if (e.key === 'Escape') setSelectedMedia(null); }}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-8">
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[92vh] flex flex-col text-amber-50 shadow-2xl relative">
              <button type="button" onClick={() => setSelectedMedia(null)} aria-label="Close event details"
                className="absolute top-3 right-3 z-10 bg-stone-950/80 hover:bg-stone-950 text-white p-2 rounded-full border border-white/20">
                <X size={20} />
              </button>
              <div className="bg-black flex items-center justify-center max-h-[60vh] min-h-0">
                <img src={selectedMedia.image} alt={selectedMedia.title} className="max-w-full max-h-[60vh] object-contain" />
              </div>
              <div className="p-5 sm:p-6 bg-stone-900 space-y-2 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">
                  <span>{selectedMedia.category}</span><span>•</span><span>{selectedMedia.location}</span><span>•</span><span>{selectedMedia.date}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-50">{selectedMedia.title}</h2>
                <p className="text-stone-300 text-sm leading-relaxed">{selectedMedia.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
