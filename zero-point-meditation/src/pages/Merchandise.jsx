import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, CheckCircle, Tag, X, ShieldCheck, Sparkles, HelpCircle, Heart, Compass } from 'lucide-react';

// Local Asset Imports
import butterLamp from '../assets/Merchandise/Butter lamp.jpg';
import bodhiMala from '../assets/Merchandise/Hand-Crafted Bodhi Seed Mala.jpg';
import rosaryMala from '../assets/Merchandise/Rosary Mala.jpg';
import beadMalasImage from '../assets/Merchandise/Bead Malas.jpeg';
import mala108 from '../assets/Merchandise/108-Bead Malas.jpeg';
import mala108One from '../assets/Merchandise/108-Bead Malas 1.jpeg';
import mala108Two from '../assets/Merchandise/108-Bead Malas 2.jpeg';
import mala108Three from '../assets/Merchandise/108-Bead Malas 3.jpeg';
import mala108Four from '../assets/Merchandise/108-Bead Malas 4.jpeg';
import mala108Five from '../assets/Merchandise/108-Bead Malas 5.jpeg';
import mala108Six from '../assets/Merchandise/108-Bead Malas 6.jpeg';
import mala108Seven from '../assets/Merchandise/108-Bead Malas 7.jpeg';
import mala108Eight from '../assets/Merchandise/108-Bead Malas 8.jpeg';
import ritualItems from '../assets/Merchandise/Ritual Items.webp';
import sacredIncense from '../assets/Merchandise/Sacred Incense.jpg';
import waterBowl from '../assets/Merchandise/Water bowl.jpg';
import modernArt from '../assets/Merchandise/Modern Art.jpg';
import modernArtOne from '../assets/Merchandise/Modern Art 1.jpg';
import modernArtTwo from '../assets/Merchandise/Modern Art 2.jpeg';
import modernArtThree from '../assets/Merchandise/Modern Art 3.jpeg';
import modernArtFour from '../assets/Merchandise/Modern Art 4.jpeg';
import modernArtFive from '../assets/Merchandise/Modern Art 5.jpeg';
import modernArtSix from '../assets/Merchandise/Modern Art 6.jpeg';
import originalDziBeads from '../assets/Merchandise/Original Dzi Beads.jpeg';
import originalDziBeadsOne from '../assets/Merchandise/Original Dzi Beads 1.jpeg';

const categories = [
  {
    id: 'mala',
    name: 'Bead Malas',
    count: 'Bodhi Seed & Gemstone Malas',
    image: beadMalasImage,
    price: '$150 - $250',
    description: 'A selection of prayer bead malas for daily mantra recitation, meditation, and personal spiritual practice.'
  },
  {
    id: '108-bead-malas',
    name: '108-Bead Malas',
    count: 'Traditional 108-Bead Prayer Malas',
    image: mala108,
    gallery: [mala108, mala108One, mala108Two, mala108Three, mala108Four, mala108Five, mala108Six, mala108Seven, mala108Eight, rosaryMala],
    price: 'Prices vary by design',
    galleryPrices: ['$550', '$423', '$575', '$423', '$400', '$575', '$470', '$510', '$423', 'Enquire for price'],
    description: 'Each 108-bead mala has its own price. Browse the gallery to see the price for each design. The Rosary Mala price is available on enquiry.'
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
  },
  {
    id: 'original-dzi-beads',
    name: 'Original Dzi Beads',
    count: 'Traditional Dzi Bead Collection',
    image: originalDziBeads,
    gallery: [originalDziBeads, originalDziBeadsOne],
    price: 'Enquire for price',
    galleryPrices: ['Enquire for price', 'Enquire for price'],
    description: 'Each Original Dzi Beads piece is individually priced. Please enquire with the centre for pricing and availability.'
  },
  {
    id: 'modern-art',
    name: 'Modern Art',
    count: 'Contemporary Spiritual Artwork',
    image: modernArt,
    gallery: [modernArt, modernArtOne, modernArtTwo, modernArtThree, modernArtFour, modernArtFive, modernArtSix],
    price: 'Prices vary by artwork',
    galleryPrices: ['$2,700', '$2,200', '$750', '$700', '$1,500', '$699', '$1,200'],
    description: 'Each artwork has its own price. Browse the gallery to view the listed price for each piece; Modern Art.jpg is $2,700 and Modern Art 1.jpg is $2,200.'
  }
];

 
// Expand galleries into individual product listings, each with its own image and price.
const displayCategories = categories.flatMap((category) => {
  if (!category.gallery) return [category];
  return category.gallery.map((image, index) => ({
    id: `${category.id}-${index + 1}`,
    parentCategoryId: category.id,
    name: category.id === '108-bead-malas'
      ? (index === 9 ? 'Rosary Mala' : '108-Bead Mala')
      : category.id === 'modern-art'
        ? 'Modern Art'
        : 'Original Dzi Bead',
    count: category.count,
    image,
    price: category.galleryPrices[index],
    description: category.description
  }));
});

const featuredProduct = {
  title: "Hand-Crafted Bodhi Seed Mala (108 Beads)",
  price: "$200 - $500",
  category: "Hand-Crafted Bodhi Seed Mala",
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
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', address: '', city: '', region: '', postalCode: '', country: '' });

  return (
    
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <Helmet>
        <title>Buddhist Art & Spiritual Merchandise | Zero Point Meditation Center</title>
        <meta name="description" content="Explore Buddhist-inspired art and spiritual merchandise connected with Zero Point Meditation Center. Contact us for product details and availability."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/merchandise"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/merchandise"/>
        <meta property="og:title" content="Buddhist Art & Spiritual Merchandise | Zero Point Meditation Center"/>
        <meta property="og:description" content="Explore Buddhist-inspired art and spiritual merchandise connected with Zero Point Meditation Center. Contact us for product details and availability."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Buddhist Art & Spiritual Merchandise | Zero Point Meditation Center"/>
        <meta name="twitter:description" content="Explore Buddhist-inspired art and spiritual merchandise connected with Zero Point Meditation Center. Contact us for product details and availability."/>
      </Helmet>
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
          {displayCategories.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              key={item.id}
              onClick={() => { setSelectedItem(item); setOrderSent(false); setOrderError(''); }}
              className={`bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer`}
            >

              <div className={`relative aspect-[4/3] overflow-hidden ${'bg-stone-100'}`}>
                <motion.img
                  src={item.image}
                  alt={item.name}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`w-full h-full ${'object-cover group-hover:scale-105'} transition-transform duration-500`}
                />
                {item.price && (
                  <span className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-amber-50 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    {item.price}
                  </span>
                )}
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
                    Order / enquire →
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
          <p className="pt-4 text-xs text-stone-400">Browse the collection above for merchandise information.</p>
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

      {/* Merchandise order and Zelle enquiry modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { if (!orderSubmitting) setSelectedItem(null); }}
            className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <motion.section role="dialog" aria-modal="true" aria-labelledby="merch-order-title"
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto p-5 sm:p-8 space-y-5 shadow-2xl relative">
              <button type="button" onClick={() => setSelectedItem(null)} aria-label="Close order form"
                className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-stone-600"><X size={18}/></button>
              {!orderSent ? <>
                <div className="space-y-3 pr-10">
                  <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest">Zero Point Meditation Center · Merchandise order</span>
                  <h3 id="merch-order-title" className="font-serif text-2xl font-bold text-buddhist-burgundy">{selectedItem.name}</h3>
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full max-h-52 object-contain rounded-2xl bg-stone-50"/>
                  <p className="text-sm text-stone-600">{selectedItem.description}</p>
                  <p className="text-sm font-bold text-buddhist-burgundy">{selectedItem.price}</p>
                </div>
                <form className="space-y-4" onSubmit={async e => {
                  e.preventDefault(); setOrderSubmitting(true); setOrderError('');
                  try {
                    const response = await fetch('/api/merchandise', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ product: selectedItem.name, price: selectedItem.price, name: orderForm.name, email: orderForm.email, phone: orderForm.phone, address: orderForm.address, city: orderForm.city, region: orderForm.region, postalCode: orderForm.postalCode, country: orderForm.country, paymentMethod: 'zelle' }) });
                    const result = await response.json().catch(() => ({}));
                    if (!response.ok) throw new Error(result.error || 'We could not send your order enquiry. Please try again.');
                    setOrderSent(true);
                    setOrderForm({ name: '', email: '', phone: '', address: '', city: '', region: '', postalCode: '', country: '' });
                  } catch (err) { setOrderError(err.message || 'Unable to submit your order. Please try again.'); }
                  finally { setOrderSubmitting(false); }
                }}>
                  <h4 className="font-serif text-lg font-bold text-stone-900">Your details & delivery address</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="text-xs font-bold text-stone-700">Full name *<input required maxLength="120" autoComplete="name" value={orderForm.name} onChange={e=>setOrderForm(v=>({...v,name:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">Email address *<input required type="email" maxLength="254" autoComplete="email" value={orderForm.email} onChange={e=>setOrderForm(v=>({...v,email:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">Phone number *<input required type="tel" maxLength="40" autoComplete="tel" value={orderForm.phone} onChange={e=>setOrderForm(v=>({...v,phone:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700 sm:col-span-2">Street address *<input required maxLength="180" autoComplete="street-address" value={orderForm.address} onChange={e=>setOrderForm(v=>({...v,address:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">City *<input required maxLength="100" autoComplete="address-level2" value={orderForm.city} onChange={e=>setOrderForm(v=>({...v,city:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">State / Province<input maxLength="100" autoComplete="address-level1" value={orderForm.region} onChange={e=>setOrderForm(v=>({...v,region:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">Postal code<input maxLength="30" autoComplete="postal-code" value={orderForm.postalCode} onChange={e=>setOrderForm(v=>({...v,postalCode:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                    <label className="text-xs font-bold text-stone-700">Country *<input required maxLength="100" autoComplete="country-name" value={orderForm.country} onChange={e=>setOrderForm(v=>({...v,country:e.target.value}))} className="mt-1 w-full p-3 rounded-xl border border-stone-300 font-normal"/></label>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-buddhist-burgundy font-bold text-sm"><ShieldCheck size={17}/> Payment method: Zelle</div>
                    <p className="text-xs text-stone-700 leading-relaxed">After we receive your order, the centre will confirm availability, final price and shipping, then email you the authorised Zelle payment details. Please do not send payment before receiving that email.</p>
                  </div>
                  {orderError && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">{orderError}</p>}
                  <button type="submit" disabled={orderSubmitting} className="w-full py-3.5 bg-buddhist-burgundy hover:opacity-90 disabled:opacity-60 text-white font-bold rounded-xl text-sm">{orderSubmitting ? 'Sending order…' : 'Submit order enquiry'}</button>
                  <p className="text-[11px] text-stone-500 text-center">This submits an order enquiry only. No payment is collected and your order is not confirmed until the centre contacts you.</p>
                </form>
              </> : <div className="py-10 text-center space-y-4">
                <CheckCircle size={42} className="mx-auto text-emerald-600"/>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Order enquiry received</h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto">Thank you. The centre has received your order details. We’ll email you to confirm availability, shipping and the Zelle payment instructions. No payment has been taken.</p>
                <p className="text-stone-600 text-sm">You can also contact the centre on WhatsApp if you have questions about your order.</p>
                <a href="https://wa.me/16464560843" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-semibold">Contact us on WhatsApp</a>
                <button type="button" onClick={()=>{setSelectedItem(null);setOrderSent(false);}} className="px-6 py-3 rounded-xl bg-buddhist-burgundy text-white font-semibold">Close</button>
              </div>}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}