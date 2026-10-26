import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag, Sparkles, Heart, Compass, Flower2, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

import butterLamp from '../assets/Merchandise/Butter lamp.jpg';
import bodhiMala from '../assets/Merchandise/Hand-Crafted Bodhi Seed Mala.jpg';
import rosaryMala from '../assets/Merchandise/Rosary Mala.jpg';
import mandalaSet from '../assets/Merchandise/Mandala offering set.jpg';
import ritualItems from '../assets/Merchandise/Ritual Items.webp';
import sacredIncense from '../assets/Merchandise/Sacred Incense.jpg';
import waterBowl from '../assets/Merchandise/Water bowl.jpg';

const products = [
  { id: 'bodhi-mala', name: 'Hand-Crafted Bodhi Seed Mala', category: 'Meditation & Prayer', image: bodhiMala, description: 'A traditional 108-bead mala for mantra recitation, mindful pauses, and personal meditation practice.', alt: 'Hand-crafted Bodhi seed prayer mala' },
  { id: 'rosary-mala', name: 'Prayer & Rosary Malas', category: 'Meditation & Prayer', image: rosaryMala, description: 'Explore prayer beads suited to your personal practice, with details available from the centre.', alt: 'Prayer and rosary mala beads' },
  { id: 'mandala-set', name: 'Mandala Offering Set', category: 'Altar & Offerings', image: mandalaSet, description: 'A traditional offering set for creating a dedicated practice space and supporting altar rituals.', alt: 'Traditional mandala offering set' },
  { id: 'butter-lamp', name: 'Traditional Butter Lamp', category: 'Altar & Offerings', image: butterLamp, description: 'A traditional lamp for light offerings and a peaceful home altar.', alt: 'Traditional butter lamp for an altar' },
  { id: 'water-bowls', name: 'Water Offering Bowls', category: 'Altar & Offerings', image: waterBowl, description: 'Offering bowls for arranging a traditional Buddhist altar with care and intention.', alt: 'Water offering bowls for a Buddhist altar' },
  { id: 'incense', name: 'Tibetan Incense', category: 'Meditation Space', image: sacredIncense, description: 'Incense for those who enjoy incorporating a familiar scent into their meditation or reflection space.', alt: 'Tibetan incense products' },
  { id: 'ritual-items', name: 'Ritual & Practice Items', category: 'Practice Essentials', image: ritualItems, description: 'Discover additional traditional objects and practice accessories. Ask us about current selection and availability.', alt: 'Traditional ritual and spiritual practice items' },
];

export default function Merchandise() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeProduct = products[activeIndex];

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + products.length) % products.length);
  };

  return (
    <>
      <Helmet>
        <title>Buddhist Art & Meditation Items | Zero Point Meditation Center</title>
        <meta name="description" content="Explore traditional Buddhist meditation and altar items at Zero Point Meditation Center, including prayer malas, mandala sets, offering bowls, lamps and incense. Contact us for availability and pricing." />
        <link rel="canonical" href="https://zeropointmeditationcenter.org/merchandise" />
        <meta property="og:title" content="Buddhist Art & Meditation Items | Zero Point Meditation Center" />
        <meta property="og:description" content="Explore traditional Buddhist meditation and altar items. Contact Zero Point Meditation Center for current availability and pricing." />
        <meta property="og:url" content="https://zeropointmeditationcenter.org/merchandise" />
      </Helmet>

      <main className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-5 py-12 text-center sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-amber-200/70" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full border border-amber-200/70" />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-buddhist-burgundy">
            <ShoppingBag size={15} /> The Centre's Collection
          </span>
          <h1 className="relative mx-auto mt-6 max-w-3xl font-serif text-4xl font-bold leading-tight text-buddhist-burgundy sm:text-5xl lg:text-6xl">
            Art & Objects for a Meaningful Practice
          </h1>
          <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Explore traditional Buddhist items for meditation, prayer, and a thoughtfully arranged home altar. Browse the collection and contact the centre to ask about current availability, details, and pricing.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3 text-xs font-semibold text-stone-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2"><Sparkles size={14} className="text-amber-700" /> Traditional practice items</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2"><Heart size={14} className="text-buddhist-burgundy" /> Support the centre</span>
          </div>
        </motion.header>

        <section aria-labelledby="collection-heading" className="space-y-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700"><Flower2 size={15} /> Explore the collection</span>
              <h2 id="collection-heading" className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">Selected Items</h2>
              <p className="text-sm leading-6 text-stone-600">Use the arrows or choose a slide to explore each item. Product details and prices can be confirmed with the centre.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="min-w-16 text-sm font-semibold tabular-nums text-stone-500">{String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => move(-1)} aria-label="Previous product" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-buddhist-burgundy transition hover:border-amber-500 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"><ArrowLeft size={19} /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next product" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-buddhist-burgundy transition hover:border-amber-500 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"><ArrowRight size={19} /></button>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-72 overflow-hidden bg-stone-100 sm:min-h-[430px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeProduct.id}
                  initial={reduceMotion ? false : { opacity: 0, x: 42 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -42 }}
                  transition={{ duration: reduceMotion ? 0 : 0.38, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <img src={activeProduct.image} alt={activeProduct.alt} className="h-full w-full object-cover" fetchPriority={activeIndex === 0 ? 'high' : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 rounded-full border border-white/40 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-buddhist-burgundy">{activeProduct.category}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeProduct.id + '-details'}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="space-y-5"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Item {String(activeIndex + 1).padStart(2, '0')}</span>
                  <h3 className="font-serif text-3xl font-bold leading-tight text-buddhist-burgundy sm:text-4xl">{activeProduct.name}</h3>
                  <p className="text-sm leading-7 text-stone-600">{activeProduct.description}</p>
                  <div className="border-t border-stone-200 pt-5">
                    <p className="text-sm text-stone-500">For pricing and availability, please contact the centre.</p>
                  </div>
                  <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-buddhist-burgundy px-6 py-3 text-sm font-bold text-amber-50 transition hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
                    Ask about this item <ArrowUpRight size={17} />
                  </Link>
                </motion.div>
              </AnimatePresence>
              <div className="mt-9 flex flex-wrap gap-2" aria-label="Choose a product">
                {products.map((product, index) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${product.name}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${index === activeIndex ? 'w-8 bg-buddhist-burgundy' : 'w-2.5 bg-stone-300 hover:bg-amber-500'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3" aria-label="Collection information">
          <article className="rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-burgundy"><Compass size={21} /></div>
            <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">For Your Practice</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Find items for meditation, mantra recitation, offerings, and a dedicated space for reflection.</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-burgundy"><ShoppingBag size={21} /></div>
            <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">Ask Before Ordering</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Contact the centre to confirm current stock, product details, delivery options, and prices before placing an order.</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-buddhist-burgundy"><HandHeart size={21} /></div>
            <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">Support the Centre</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Ask the team how merchandise purchases support the centre and its community activities.</p>
          </article>
        </section>

        <section className="rounded-[1.75rem] bg-stone-900 px-6 py-10 text-center text-amber-50 sm:px-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Questions about an item?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold sm:text-4xl">We’ll help you find the right details.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-300">Contact Zero Point Meditation Center to ask about an item, current availability, pricing, or delivery.</p>
          <Link to="/contact" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-100 px-6 py-3 text-sm font-bold text-stone-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Contact the centre <ArrowUpRight size={17} /></Link>
        </section>
      </main>
    </>
  );
}
