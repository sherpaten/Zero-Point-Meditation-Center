import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Calendar, Sparkles, X, ChevronRight, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

// Local Asset Imports
import teaching1 from '../assets/Teaching 1.webp';
import teaching2 from '../assets/Teaching 2.jpg';
import teaching3 from '../assets/Teaching 3.webp';

const teachingsList = [
  {
    id: 'mindfulness-discourse',
    tag: 'Public Talk',
    title: 'Mindfulness Meditation Discourse',
    venue: 'The Rubin Museum of Art, New York',
    date: 'Spring 2024',
    image: teaching1,
    summary: 'An insightful talk exploring how traditional Tibetan meditation techniques apply directly to reducing anxiety and developing presence in modern urban life.',
    fullContent: 'In this recorded discourse delivered at the Rubin Museum of Art, H.E. Gegye Yongyal Rinpoche bridges ancient Himalayan mind-training (Lojong) with contemporary psychological challenges. Rinpoche discusses methods for observing thoughts without attachment, transforming daily stress into spiritual clarity, and anchoring awareness in busy environments.',
    takeaways: [
      'Applying Shamatha (calm-abiding) in noisy urban settings',
      'Recognizing the difference between intellectual focus and open awareness',
      'Practical breathwork for anxiety relief and mental decompression'
    ]
  },
  {
    id: 'mind-training-retreat',
    tag: 'Retreat Series',
    title: 'Retreat on Mind Training & Compassion',
    venue: 'Monastery in Connecticut, US',
    date: 'Autumn 2024',
    image: teaching2,
    summary: 'In-depth teaching series on cultivating Bodhicitta (the compassionate intent to benefit all beings) and establishing a daily practice routine.',
    fullContent: 'Recorded during an intensive weekend retreat in rural Connecticut, this series provides a step-by-step guide to generating Bodhicitta—the altruistic heart of enlightenment. Rinpoche shares traditional commentary on Seven-Point Mind Training, guiding practitioners through Tonglen (sending and taking meditation) to dissolve self-cherishing attitudes.',
    takeaways: [
      'The foundational practice of Tonglen (compassionate breath exchange)',
      'Structuring a sustainable daily meditation schedule at home',
      'Converting difficult life circumstances into pathways of wisdom'
    ]
  },
  {
    id: 'interfaith-peace',
    tag: 'Global Prayer',
    title: 'Interfaith World Peace Gathering',
    venue: 'The 3rd World Peace Prayer, Taiwan',
    date: 'Winter 2025',
    image: teaching3,
    summary: 'Discourse delivered alongside global spiritual leaders emphasizing environmental harmony and universal responsibility.',
    fullContent: 'Addressing an international delegation of spiritual representatives in Taiwan, Rinpoche speaks on universal interdependence (Pratītyasamutpāda) as the foundation for global peace. The discourse outlines how personal inner quietude directly impacts ecological stewardship, social harmony, and cross-cultural dialogue.',
    takeaways: [
      'Interdependence as a framework for environmental ethics',
      'Cultivating unconditional goodwill across religious traditions',
      'The role of collective prayer and intention in peace-building'
    ]
  }
];

export default function Teachings() {
  const [selectedTeaching, setSelectedTeaching] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header & SEO Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <BookOpen size={14} /> Sacred Wisdom & Dhamma Discourses
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">
          Teachings & Discourses
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Explore wisdom shared by H.E. Gegye Yongyal Rinpoche across global meditation centers, universities, and international peace forums. These discourses blend classical Himalayan Buddhist philosophy, Vajrayana mind training (Lojong), and practical mindfulness techniques designed to transform daily challenges into spiritual growth.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Sparkles size={13} className="text-buddhist-gold" /> Tibetan Mind Training (Lojong)
          </span>
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Compass size={13} className="text-buddhist-burgundy" /> Cultivating Bodhicitta
          </span>
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <HeartHandshake size={13} className="text-emerald-700" /> Interfaith Peace & Ethics
          </span>
        </div>
      </motion.div>

      {/* Main Teachings Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-stone-200 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">
            Featured Discourses & Lectures
          </h2>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">
            Click any card to read full teaching notes
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachingsList.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              key={item.id}
              onClick={() => setSelectedTeaching(item)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-100/90 backdrop-blur-md text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200/50">
                    {item.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif font-bold text-xl text-buddhist-burgundy group-hover:text-amber-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-stone-500 font-medium">
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-buddhist-gold shrink-0" /> {item.venue}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-buddhist-gold shrink-0" /> {item.date}
                    </p>
                  </div>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pt-1">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-buddhist-burgundy group-hover:translate-x-1 transition-transform">
                  Read Teaching Notes <ChevronRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SEO Pillar / Core Philosophy Section */}
      <div className="bg-amber-50/60 rounded-3xl p-8 sm:p-10 border border-amber-200/60 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">
            Core Foundations of Tibetan Mind Training
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            H.E. Gegye Yongyal Rinpoche's discourses center on integrating ancient wisdom into everyday life through three fundamental pillars.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">1. Shamatha (Calm Abiding)</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Developing a stable, uncluttered mind using breath awareness and focused meditation to quiet internal mental commentary.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">2. Lojong (Attitude Transformation)</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Traditional Tibetan slogans and cognitive reframing techniques designed to turn daily obstacles into tools for emotional resilience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">3. Bodhicitta (Universal Benevolence)</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Expanding self-directed awareness into boundless empathy, cultivating compassion as a practical force for world peace.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedTeaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeaching(null)}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-stone-200"
            >
              <button
                onClick={() => setSelectedTeaching(null)}
                className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors text-stone-600"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={selectedTeaching.image}
                  alt={selectedTeaching.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">
                  {selectedTeaching.tag} • {selectedTeaching.venue}
                </span>
                <h3 className="font-serif text-3xl font-bold text-buddhist-burgundy">
                  {selectedTeaching.title}
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {selectedTeaching.fullContent}
                </p>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                  <ShieldCheck size={16} className="text-buddhist-burgundy" /> Key Takeaways & Practice Points
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedTeaching.takeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-buddhist-gold font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setSelectedTeaching(null)}
                  className="px-8 py-3 bg-buddhist-burgundy text-amber-50 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
                >
                  Close Teaching Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}