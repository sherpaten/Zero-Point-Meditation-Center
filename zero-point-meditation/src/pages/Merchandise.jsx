import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, CheckCircle, Tag, X, ShieldCheck, Sparkles, HelpCircle, Heart, Compass } from 'lucide-react';

// Local Asset Imports
import butterLamp from '../assets/Merchandise/Butter lamp.jpg';
import bodhiMala from '../assets/Merchandise/Hand-Crafted Bodhi Seed Mala.jpg';
import rosaryMala from '../assets/Merchandise/Rosary Mala.jpg';
import mandalaSet from '../assets/Merchandise/Mandala offering set.jpg';
import ritualItems from '../assets/Merchandise/Ritual Items.webp';
import sacredIncense from '../assets/Merchandise/Sacred Incense.jpg';
import waterBowl from '../assets/Merchandise/Water bowl.jpg';

const categories = [
  {
    id: 'mala',
    name: '108-Bead Rosary Malas',
    count: 'Bodhi Seed & Gemstone Malas',
    image: rosaryMala,
    price: '$35 - $120',
    description: 'Handcrafted Bodhi seed, sandalwood, and gemstone prayer beads blessed by H.E. Gegye Yongyal Rinpoche for daily mantra recitation, breath awareness, and Tibetan mind-training practice.'
  },
  {
    id: 'mandala',
    name: 'Mandala Offering Sets',
    count: 'Copper & Brass Plate Sets',
    image: mandalaSet,
    price: '$85 - $250',
    description: 'Authentic Himalayan mandala sets crafted for traditional visualization practices, ritual offerings, and merit accumulation on home altars.'
  },
  {
    id: 'butter-lamp',
    name: 'Traditional Butter Lamps',
    count: 'Bronze & Brass Lamps',
    image: butterLamp,
    price: '$25 - $75',
    description: 'Hand-carved bronze and brass butter lamps designed for sacred light offerings, symbolizing the dispelling of ignorance and the cultivation of spiritual wisdom.'
  },
  {
    id: 'water-bowl',
    name: 'Seven Water Offering Bowls',
    count: 'Set of 7 Offering Bowls',
    image: waterBowl,
    price: '$45 - $110',
    description: 'Hand-turned brass water bowl sets essential for building a traditional Tibetan Buddhist altar representation of the seven limbs of practice.'
  },
  {
    id: 'incense',
    name: 'Organic Tibetan Herbal Incense',
    count: 'Monastic Recipe Formulas',
    image: sacredIncense,
    price: '$15 - $30',
    description: 'Pure, chemical-free incense sticks prepared from ancient monastic recipes to cleanse meditation spaces, alleviate stress, and foster focus.'
  },
  {
    id: 'others',
    name: 'Ritual Items & Sacred Objects',
    count: 'Prayer Flags, Bells & Dorjes',
    image: ritualItems,
    price: '$20 - $180',
    description: 'Windhorse prayer flags, singing bowls, ritual bells, dorjes, and consecrated sangha practice accessories for home shrines.'
  }
];

const featuredProduct = {
  title: "Hand-Crafted Bodhi Seed Mala (108 Beads)",
  price: "$40.00",
  category: "Rosary Mala",
  image: bodhiMala,
  description: "Crafted with authentic Bodhi seeds harvested in Nepal, this 108-bead prayer mala is individually hand-strung and blessed by Rinpoche for meditation, mindfulness, and mantra repetition practice.",
  features: [
    "Authentic Bodhi seeds", 
    "Blessed by Rinpoche", 
    "Includes protective pouch", 
    "100% non-profit proceeds"
  ]
};

const reviews = [
  {
    id: 1,
    name: "Nyla H.",
    role: "Sangha Member",
    comment: "The Bodhi seed mala is crafted with genuine care. Using it during morning prayers brings a quiet grounding to my daily practice.",
    rating: 5
  },
  {
    id: 2,
    name: "Hope D.",
    role: "Practitioner",
    comment: "The water bowls and incense arrived quickly and beautifully packaged. Knowing purchases support Zero Point Center makes it extra meaningful.",
    rating: 5
  }
];

export default function Merchandise() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderSent, setOrderSent] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <ShoppingBag size={14} /> Sacred Items & Spiritual Store
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-buddhist-burgundy">
          Tibetan Buddhist Merchandise & Altar Supplies
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Welcome to the Zero Point Meditation Center Store, your trusted source for authentic Tibetan Buddhist ritual items, sacred shrine offerings, and daily meditation supplies. Every item—from our hand-strung 108-bead Bodhi seed malas to classic bronze butter lamps—is ethically sourced according to Himalayan traditions and consecrated through Sangha blessings. 100% of store proceeds directly support our free community mindfulness classes, interfaith peace assemblies, and spiritual outreach.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Sparkles size={13} className="text-buddhist-gold" /> Consecrated & Blessed
          </span>
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Heart size={13} className="text-buddhist-burgundy" /> 100% Non-Profit Support
          </span>
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <ShieldCheck size={13} className="text-emerald-600" /> Ethically Sourced
          </span>
        </div>
      </motion.div>

      {/* Main Categories Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-stone-200 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-buddhist-burgundy">
            Browse Shrine & Meditation Categories
          </h2>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">
            Blessed Ritual Artifacts
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-amber-50 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  {item.price}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-buddhist-burgundy group-hover:text-amber-700 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-buddhist-gold text-xs font-semibold mt-0.5">
                    {item.count}
                  </p>
                  <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-buddhist-burgundy group-hover:underline flex items-center gap-1">
                    View Details & Inquire →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Spotlight Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-stone-900 text-amber-50 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl grid md:grid-cols-2 items-center"
      >
        <div className="relative h-72 md:h-full bg-black">
          <img
            src={featuredProduct.image}
            alt={featuredProduct.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute top-4 left-4 bg-buddhist-gold text-stone-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
            <Tag size={12} /> Featured Item
          </div>
        </div>
        <div className="p-8 sm:p-10 space-y-5">
          <div className="space-y-1">
            <span className="text-buddhist-gold text-xs font-bold uppercase tracking-widest">
              {featuredProduct.category}
            </span>
            <h3 className="font-serif text-3xl font-bold">{featuredProduct.title}</h3>
            <p className="text-2xl font-bold text-buddhist-gold pt-1">{featuredProduct.price}</p>
          </div>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {featuredProduct.description}
          </p>
          <ul className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-2">
            {featuredProduct.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-buddhist-gold" /> {feat}
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <button
              onClick={() => setSelectedItem({ name: featuredProduct.title, price: featuredProduct.price, image: featuredProduct.image, description: featuredProduct.description })}
              className="w-full sm:w-auto px-8 py-3.5 bg-buddhist-burgundy hover:bg-red-900 text-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Request / Order Item
            </button>
          </div>
        </div>
      </motion.div>

      {/* Altar Guide & FAQ Section (SEO Content Block) */}
      <div className="grid md:grid-cols-2 gap-8 bg-amber-50/60 p-8 sm:p-10 rounded-3xl border border-amber-200/60">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-buddhist-burgundy font-bold text-xs uppercase tracking-wider">
            <Compass size={16} /> Spiritual Practice Guide
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            How to Choose Your Meditation Mala
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            Selecting a prayer mala depends on your personal intention. Bodhi seed malas are traditionally valued for all Tibetan Buddhist practices and mantra repetitions, bringing peaceful energy to daily mind-training. Sandalwood offers natural grounding aromas ideal for calm-abiding (<em>Shamatha</em>) meditation, while gemstone beads help anchor specific focus during visualization practice.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-buddhist-burgundy font-bold text-xs uppercase tracking-wider">
            <HelpCircle size={16} /> Authentic Sacred Goods
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Why Support Zero Point Meditation Center?
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            Unlike commercial retail importers, all ritual items and shrine accessories available through Zero Point Meditation Center are curated specifically for genuine spiritual practice. Each piece is blessed by resident monastic leaders to ensure standard ceremonial authenticity, and every purchase directly sustains our ongoing community programs.
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8 pt-2">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-buddhist-burgundy">
            Community Reviews
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Reflections from Sangha members and meditation practitioners using our sacred items.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="w-9 h-9 rounded-full bg-buddhist-burgundy text-amber-50 font-bold text-xs flex items-center justify-center">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{rev.name}</h4>
                  <p className="text-[10px] text-stone-500">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedItem(null); setOrderSent(false); }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-stone-200"
            >
              <button
                onClick={() => { setSelectedItem(null); setOrderSent(false); }}
                className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors text-stone-600"
              >
                <X size={18} />
              </button>

              {!orderSent ? (
                <>
                  <div className="space-y-2">
                    <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">
                      Item Inquiry
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-buddhist-burgundy">
                      {selectedItem.name}
                    </h3>
                    <p className="text-stone-600 text-xs">
                      {selectedItem.description}
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => { e.preventDefault(); setOrderSent(true); }}
                    className="space-y-3 pt-2"
                  >
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Name" 
                        className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-buddhist-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="email@example.com" 
                        className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-buddhist-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Note or Shipping Request</label>
                      <textarea 
                        rows={3} 
                        placeholder="Mention any specific details or preferences..." 
                        className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-buddhist-burgundy"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-buddhist-burgundy text-amber-50 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-900 transition-colors shadow-md"
                    >
                      Submit Order Inquiry
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Inquiry Received!</h3>
                  <p className="text-stone-600 text-xs max-w-xs mx-auto">
                    Thank you for reaching out. A sangha member will contact you shortly regarding item availability and delivery details.
                  </p>
                  <button
                    onClick={() => { setSelectedItem(null); setOrderSent(false); }}
                    className="px-6 py-2.5 bg-stone-900 text-amber-50 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}