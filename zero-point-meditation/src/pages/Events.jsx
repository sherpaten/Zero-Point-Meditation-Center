import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Image as ImageIcon, FileText, Newspaper, X, Eye, Handshake, ChevronLeft, ChevronRight } from 'lucide-react';

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

/* 2024 event photos — exact filenames from the synced folder */
import dharmaAug2024a from '../assets/Events/2024/August 2024 Dharma Teaching.jpg';
import dharmaAug2024b from '../assets/Events/2024/August 2024 Dharma teaching 1.jpg';
import mindfulAug2024 from '../assets/Events/2024/August 2024 Mindfulness Meditation.jpg';
import ubs2024a from '../assets/Events/2024/Long-life Prayer Ceremony for HH Dalai Lama at UBS Arena.jpg';
import ubs2024b from '../assets/Events/2024/Long-life Prayer Ceremony for HH Dalai Lama at UBS Arena 1.jpg';
import ubs2024c from '../assets/Events/2024/Long-life Prayer Ceremony for HH Dalai Lama at UBS Arena 2.jpg';
import shamathaOct2024a from '../assets/Events/2024/October 2024 - 9 Stages of Shamata Meditation Session.jpg';
import shamathaOct2024b from '../assets/Events/2024/October 2024 - 9 Stages of Shamata Meditation Session 1.jpg';
import shamathaOct2024c from '../assets/Events/2024/October 2024 - 9 Stages of Shamata Meditation Session 2.jpg';
import shamathaOct2024d from '../assets/Events/2024/October 2024 - 9 Stages of Shamata Meditation Session 3.jpg';
import dharmaSep2024a from '../assets/Events/2024/September 2024 - Dharma Teaching.jpg';
import dharmaSep2024b from '../assets/Events/2024/September 2024 - Dharma Teaching 1.jpg';
import midAutumn2024 from '../assets/Events/2024/September 2024 - Mid Autumn Festival.jpg';
import vesak2024a from '../assets/Events/2024/2024 Vesak Day Celebration.jpg';
import vesak2024b from '../assets/Events/2024/2024 Vesak Day Celebration 1.jpg';
import bodhisattva2024 from '../assets/Events/2024/2024 - Dharma Teaching on Thirty Seven Practices of Boddhisattva (7 Day Classes).jpg';

import peace2025a from '../assets/Events/2025/2025 World Peace Prayer Day.jpg';
import peace2025b from '../assets/Events/2025/2025 World Peace Prayer Day 1.jpg';
import peace2025c from '../assets/Events/2025/2025 World Peace Prayer Day 2.jpg';
import jewel2025a from '../assets/Events/2025/2025 Dharma Teaching Jewel Ornament of Liberation.jpg';
import jewel2025b from '../assets/Events/2025/2025 Dharma Teaching Jewel Ornament of Liberation 1.jpg';
import globalPeace2025a from '../assets/Events/2025/2025 Global Peace Prayer Day.jpg';
import globalPeace2025b from '../assets/Events/2025/2025 Global Peace Prayer Day 1.jpg';
import mindful2025a from '../assets/Events/2025/2025 Mindfulness Meditation.jpg';
import mindful2025b from '../assets/Events/2025/2025 Mindfulness Meditation 1.jpg';
import vesak2025a from '../assets/Events/2025/2025 Vesak Celeberation.jpg';
import vesak2025b from '../assets/Events/2025/2025 Vesak Celeberation  1.jpg';
import bbc2026 from '../assets/Events/2026/2026 BBC.jpg';
import tara2026 from '../assets/Events/2026/2026  Zabtik Dolma (Green Tara) Prayer.jpg';
import interfaith2026b from '../assets/Events/2026/2026 Interfaith 1.jpg';
import interfaith2026c from '../assets/Events/2026/2026 Interfaith 2.jpg';
import hill2026a from '../assets/Events/2026/2026 Mindfulness Meditation Session at Hill.jpg';
import hill2026b from '../assets/Events/2026/2026 Mindfulness Meditation Session at Hill 1.jpg';
import shamatha2026a from '../assets/Events/2026/2026 Teachings on The Nine Stages of Shamatha (Calm-Abiding) Meditation.jpg';
import shamatha2026b from '../assets/Events/2026/2026 Teachings on The Nine Stages of Shamatha (Calm-Abiding) Meditation 1.jpg';
import inaction2026a from '../assets/Events/2026/2026 The Immorality of Inaction.jpg';
import inaction2026b from '../assets/Events/2026/2026 The Immorality of Inaction 1.jpg';

import poster2024 from '../assets/poste/2024 poste5.jpg';
import poster2025 from '../assets/poste/2025 poste4.jpg';
import poster2026Tara from '../assets/poste/2026 the sacred Zabtik Dolma (Green Tara) Prayer.jpg';
import posterExtra from '../assets/poste/poste.jpg';
import posterOneNew from '../assets/poste/Poste1.webp';
import posterTwoNew from '../assets/poste/Poste2.jpeg';
import posterThreeNew from '../assets/poste/poste3.jpg';
import posterSixNew from '../assets/poste/poste6.jpg';
import posterSevenNew from '../assets/poste/poste7.jpg';
import posterEightNew from '../assets/poste/poste8.jpg';


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


  // ==================== 2024 EVENT PHOTOS — EIGHT SEPARATE EVENTS ====================
  {
    id: 16, group: '2024', title: 'Dharma Teaching — August Session',
    type: 'photo', category: 'Event Photos', date: 'August 2024 — exact date to confirm',
    location: 'To be confirmed', image: dharmaAug2024a,
    images: [dharmaAug2024a, dharmaAug2024b],
    description: 'Dharma teaching event in August 2024. Further details to be confirmed.'
  },
  {
    id: 17, group: '2024', title: 'Mindfulness Meditation at the Rubin Museum',
    type: 'photo', category: 'Event Photos', date: 'August 2024 — exact date to confirm',
    location: 'Rubin Museum of Art, New York, USA', image: mindfulAug2024,
    videoUrl: 'https://youtu.be/N2XigLNT_Eo?si=rtwVgvYy_m4lVRhp',
    description: 'Mindfulness meditation at the Rubin Museum of Art. The exact date and additional details should be confirmed.'
  },
  {
    id: 18, group: '2024', title: 'Long-Life Prayer Ceremony for His Holiness the 14th Dalai Lama',
    type: 'photo', category: 'Event Photos', date: 'August 22, 2024',
    location: 'UBS Arena, New York, USA', image: ubs2024a,
    images: [ubs2024a, ubs2024b, ubs2024c],
    description: 'Long-life prayer ceremony for His Holiness the 14th Dalai Lama at UBS Arena in New York. Photo order follows the original file, then numbered images.'
  },
  {
    id: 19, group: '2024', title: 'Dharma Teaching — September Session',
    type: 'photo', category: 'Event Photos', date: 'September 2024 — exact date to confirm',
    location: 'To be confirmed', image: dharmaSep2024a,
    images: [dharmaSep2024a, dharmaSep2024b],
    description: 'Dharma teaching event in September 2024. Further details to be confirmed.'
  },
  {
    id: 20, group: '2024', title: 'Mid-Autumn Festival',
    type: 'photo', category: 'Event Photos', date: 'September 2024',
    location: 'To be confirmed', image: midAutumn2024,
    description: 'Mid-Autumn Festival gathering in September 2024.'
  },
  {
    id: 21, group: '2024', title: 'Teachings on the Thirty-Seven Practices of a Bodhisattva',
    type: 'photo', category: 'Event Photos', date: '2024 — seven-day class; exact dates to confirm',
    location: 'To be confirmed', image: bodhisattva2024,
    description: 'Seven-day Dharma teaching series on the Thirty-Seven Practices of a Bodhisattva.'
  },
  {
    id: 22, group: '2024', title: 'Teachings on the Nine Stages of Shamatha Meditation',
    type: 'photo', category: 'Event Photos', date: 'October 2024',
    location: 'To be confirmed', image: shamathaOct2024a,
    images: [shamathaOct2024a, shamathaOct2024b, shamathaOct2024c, shamathaOct2024d],
    description: 'Teachings on the Nine Stages of Shamatha (calm-abiding) meditation in October 2024. Photos are arranged in original filename order.'
  },
  {
    id: 23, group: '2024', title: 'Vesak Day Celebration',
    type: 'photo', category: 'Event Photos', date: '2024 — exact date to confirm',
    location: 'To be confirmed', image: vesak2024a,
    images: [vesak2024a, vesak2024b],
    description: 'Vesak Day celebration. Venue and additional details to be confirmed.'
  },

  // ==================== NEW 2025 EVENT PHOTOS ====================
  {
    id: 22, group: '2025', title: 'October 2025 — World Peace Prayer Day',
    type: 'photo', category: 'Event Photos', date: 'October 2025 — exact day to confirm',
    location: 'Planting Fields, Long Island, New York, USA',
    image: peace2025a, images: [peace2025a, peace2025b, peace2025c],
    description: 'On behalf of Zero Point Meditation Center, H.E. Gegye Yongyal Rinpoche expresses heartfelt gratitude to Gina, President of Planting Fields Foundation, for partnering to host World Peace Prayer Day—a celebration of harmony, compassion, and unity. Special thanks to the Shanghai Association in the USA; Nassau County Office of Asian American Affairs; CAIPA; Chinese Cultural Center; Rotary Club of Queens; Dr. Zoe Liang; Grace; Yangzi; the Rubin Museum team; Zao Zao and Tashi Choden La; the participating lamas; Youth Media NY; Fortune Star Band; Long Island Nepalese Society; Tibetan opera singer Tenzin Dolkar La; New York State Parks volunteers; Everest Vegetarian Food; photographer Jimmy Hong; Mr. Lee and Maya Karma Jinpa; Planting Fields stewardship director Lilly; and Shulin Liang of Zero Point Meditation Center. Deep thanks to Dannie and the Boston Vietnamese Dharma Group for leading Vietnamese prayers, and to Councilwoman Christine Liu for her presence and support. May we continue spreading peace, love, and compassion throughout the world. — H.E. Gegye Yongyal Rinpoche, President, Zero Point Meditation Center.'
  },
  {
    id: 23, group: '2025', title: 'Dharma Teaching: The Jewel Ornament of Liberation',
    type: 'photo', category: 'Event Photos', date: '2025',
    location: 'Tibetan Museum, New York, USA', image: jewel2025a, images: [jewel2025a, jewel2025b],
    description: 'Dharma teaching on The Jewel Ornament of Liberation. The exact date, venue, and additional event details are to be confirmed.'
  },
  {
    id: 24, group: '2025', title: 'Global Peace Prayer: More Love, Peace, Understanding, Compassion & Unity',
    type: 'photo', category: 'Event Photos', date: '2025 — date to confirm',
    location: 'Kathmandu, Nepal', image: globalPeace2025a, images: [globalPeace2025a, globalPeace2025b],
    description: 'World Peace Prayer for more love, peace, understanding, compassion, and unity in our world. Namaste. May our prayers and shared intentions help bring greater kindness, harmony, and peace to all beings.'
  },
  {
    id: 25, group: '2025', title: 'April 2025 — Mindfulness Meditation',
    type: 'photo', category: 'Event Photos', date: 'April 19, 2025',
    location: 'Main House (Coe Hall), Planting Fields Arboretum, Long Island, New York, USA',
    image: mindful2025a, images: [mindful2025a, mindful2025b],
    description: 'H.E. Gegye Yongyal Rinpoche led his first meditation class in the Main House (Coe Hall) at Planting Fields Arboretum. This free session welcomed friends of Planting Fields and people from Long Island. Rinpoche guided participants through breathing meditation and teachings on the mind, ending with a shamatha meditation. Participants thanked Rinpoche for the powerful teachings and step-by-step guided practice.'
  },
  {
    id: 26, group: '2025', title: 'Vesak Celebration (Buddha Jayanti)',
    type: 'photo', category: 'Event Photos', date: 'April 26, 2025',
    location: 'James Chapel, Union Theological Seminary, New York, USA',
    image: vesak2025a, images: [vesak2025a, vesak2025b],
    description: 'Happy Vesak Celebration (Buddha Jayanti). H.E. Gegye Yongyal Rinpoche was invited as the guest speaker at this auspicious gathering in James Chapel, Union Theological Seminary, where he offered chanting and a Dharma talk in celebration of the Buddha’s birth, enlightenment, and passing.'
  },

  // ==================== CURRENT EVENTS — 2026 ====================
  { id: 31, group: 'Current', title: '2026 Gathering at Boudhanath Stupa', type: 'photo', category: 'Event Photos', date: 'April 25, 2026', location: 'Boudhanath Stupa, Kathmandu, Nepal', image: bbc2026, description: 'A 2026 event at Boudhanath Stupa in Kathmandu, Nepal. This photograph has been added to the current events gallery.' },
  {
    id: 42, group: 'Current', title: 'Zabtik Dolma (Green Tara) Prayer', type: 'photo', category: 'Event Photos',
    date: 'July 25, 2026', location: 'Tibet House US', image: tara2026,
    description: 'On July 25, H.E. Gegye Yongyal Rinpoche, together with the monastic sangha, led the sacred Zabtik Dolma (Green Tara) Prayer. Participants experienced a deeply inspiring and peaceful practice, with many expressing great joy and appreciation for the prayers and guided Tara meditation. May the blessings of Noble Tara bring compassion, protection, wisdom, and swift accomplishment to all beings.'
  },
  {
    id: 43, group: 'Current', title: 'Interfaith Breakfast', type: 'photo', category: 'Event Photos',
    date: '2026 — exact date to confirm', location: 'New York City, USA',
    image: interfaith2026b, images: [interfaith2026b, interfaith2026c],
    description: 'New Yorkers share a common belief: that our city can be restored. It was an honor to attend an interfaith breakfast alongside many of New York’s faith leaders and chart a path forward where we welcome the stranger among us.'
  },
  {
    id: 44, group: 'Current', title: 'Eighty Years on the Hill: Art, Mindfulness & Celebration', type: 'photo', category: 'Event Photos',
    date: 'August 30, 2026', location: 'Tibetan Museum',
    image: hill2026a, images: [hill2026a, hill2026b],
    description: 'It was a great honor and privilege to attend “Eighty Years on the Hill: Art, Mindfulness & Celebration,” honoring eight decades of the Tibetan Museum’s dedication to preserving and sharing Tibetan and Himalayan wisdom, art, and cultural heritage. Heartfelt congratulations to Brandon, the newly appointed Executive Director, with prayers and best wishes for his leadership. Surrounded by precious historic art and cultural treasures, H.E. Gegye Yongyal Rinpoche offered blessings and guided a mindfulness meditation session. Deep gratitude to Kathleen Xu for the ride to the museum, and to the museum team, staff, organizers, and everyone who offered such a warm welcome. May the blessings of the Three Jewels continue to illuminate the museum’s work and inspire understanding and world peace.'
  },
  {
    id: 45, group: 'Current', title: 'Teachings on the Nine Stages of Shamatha (Calm-Abiding) Meditation', type: 'photo', category: 'Event Photos',
    date: 'July 10–11, 2026', location: 'Tibet House US',
    image: shamatha2026a, images: [shamatha2026a, shamatha2026b],
    description: 'On July 10–11, H.E. Gegye Yongyal Rinpoche offered profound teachings on Shamatha Meditation at Tibet House US, with many participants joining both in person and online. The teachings were received with great enthusiasm and provided a meaningful opportunity to deepen meditation practice. Gegye Tashi Choling Monastery warmly invited everyone to join the upcoming Tara Transmission and Tara Meditation Practice on July 24–25 to receive these precious teachings and blessings.'
  },
  {
    id: 46, group: 'Current', title: 'The Immorality of Inaction: Voicing Truth on Climate', type: 'photo', category: 'Event Photos',
    date: 'September 18, 2026', location: 'Riverside Church, New York City, USA',
    image: inaction2026a, images: [inaction2026a, inaction2026b],
    description: 'H.E. Gegye Yongyal Tulku Rinpoche was deeply honored to participate in “The Immorality of Inaction: Voicing Truth on Climate” at Riverside Church in New York City. He offered prayers and shared a reflection from the Buddhist understanding of dependent origination: all life exists through an intricate web of causes and conditions, and no being exists independently. Our relationship with Mother Earth is inseparable from our own lives—the air we breathe, the water we drink, the food we receive, and all living beings are deeply interconnected. To care for the Earth is to care for ourselves and future generations. Compassion must extend to all sentient life and the conditions that sustain life. It was a privilege to stand alongside Vice President Al Gore, Bishop William J. Barber II, and spiritual, environmental, Indigenous, and community leaders. With gratitude to the organizers and everyone who gathered with shared responsibility. May our prayers become compassionate action to protect this precious Earth and all beings. — H.E. Gegye Yongyal Tulku Rinpoche'
  },

  // ==================== POSTERS & NEWS ====================
  // Edit poster/news titles and descriptions. Year-specific posters stay in their matching collection.
  { id: 32, group: 'Poste&News', title: 'ADD TITLE — 2024 Poster', type: 'poster', category: 'Posters', date: '2024 — ADD DATE', location: 'ADD LOCATION', image: poster2024, description: 'ADD POSTER DETAILS.' },
  { id: 33, group: 'Poste&News', title: 'ADD TITLE — 2025 Poster', type: 'poster', category: 'Posters', date: '2025 — ADD DATE', location: 'ADD LOCATION', image: poster2025, description: 'ADD POSTER DETAILS.' },
  { id: 34, group: 'Poste&News', title: 'Sacred Zabtik Dolma (Green Tara) Prayer — EDIT DETAILS', type: 'poster', category: 'Posters', date: '2026 — ADD DATE', location: 'ADD LOCATION', image: poster2026Tara, description: 'ADD POSTER DETAILS.' },
  { id: 35, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterExtra, description: 'ADD POSTER DETAILS.' },
  { id: 36, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 1', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterOneNew, description: 'ADD POSTER DETAILS.' },
  { id: 37, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 2', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterTwoNew, description: 'ADD POSTER DETAILS.' },
  { id: 38, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 3', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterThreeNew, description: 'ADD POSTER DETAILS.' },
  { id: 39, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 6', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterSixNew, description: 'ADD POSTER DETAILS.' },
  { id: 40, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 7', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterSevenNew, description: 'ADD POSTER DETAILS.' },
  { id: 41, group: 'Poste&News', title: 'ADD POSTER OR NEWS TITLE — 8', type: 'poster', category: 'Posters', date: 'ADD DATE', location: 'ADD LOCATION', image: posterEightNew, description: 'ADD POSTER DETAILS.' },

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

const tabs = [{ label: 'Current', value: 'Current' }, { label: '2025', value: '2025' }, { label: '2024', value: '2024' }, { label: 'Older', value: 'Older' }, { label: 'Poster & News', value: 'Poste&News' }];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.16 } }
};

function EventPhotoSlider({ item, className = '' }) {
  const photos = item.images?.length ? item.images : [item.image];
  const [index, setIndex] = useState(0);
  const move = (direction, event) => {
    event?.stopPropagation();
    setIndex((current) => (current + direction + photos.length) % photos.length);
  };

  return (
    <div className={`relative isolate w-full h-full min-h-0 overflow-hidden ${className}`}>
      <div
        className="flex h-full w-full min-w-0 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {photos.map((src, photoIndex) => (
          <div key={src + '-' + photoIndex} className="relative h-full min-w-full w-full flex-none overflow-hidden">
            <img
              src={src}
              alt={`${item.title} — photo ${photoIndex + 1} of ${photos.length}`}
              loading="lazy"
              className={`block h-full w-full ${item.type === 'poster' ? 'object-contain' : 'object-cover'}`}
              style={{ width: '100%', height: '100%', maxWidth: '100%', flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && <>
        <button type="button" aria-label="Previous photo" onClick={(event) => move(-1, event)}
          className="absolute z-10 left-2 top-1/2 -translate-y-1/2 rounded-full bg-stone-950/80 text-white p-2 shadow-lg hover:bg-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label="Next photo" onClick={(event) => move(1, event)}
          className="absolute z-10 right-2 top-1/2 -translate-y-1/2 rounded-full bg-stone-950/80 text-white p-2 shadow-lg hover:bg-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          <ChevronRight size={18} />
        </button>
        <span className="absolute z-10 bottom-2 right-2 rounded-full bg-stone-950/80 text-white text-[11px] px-2.5 py-1">
          {index + 1} / {photos.length}
        </span>
      </>}
    </div>
  );
}

function getEventDateSortKey(dateLabel) {
  const value = String(dateLabel || '');
  const yearMatch = value.match(/\\b(20\\d{2}|19\\d{2})\\b/);
  const year = yearMatch ? Number(yearMatch[1]) : 0;
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const lower = value.toLowerCase();
  const month = monthNames.findIndex((name) => lower.includes(name)) + 1;
  const dayMatch = value.match(/\\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b/i)
    || value.match(/\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\\b/i);
  const day = dayMatch ? Number(dayMatch[1]) : 0;
  // Unknown years/dates are kept after dated entries rather than guessed.
  return { year, month, day, known: Boolean(yearMatch) };
}

function compareEventsNewestFirst(a, b) {
  const dateA = getEventDateSortKey(a.date);
  const dateB = getEventDateSortKey(b.date);
  if (dateA.known !== dateB.known) return dateA.known ? -1 : 1;
  return dateB.year - dateA.year || dateB.month - dateA.month || dateB.day - dateA.day;
}

export default function Events() {
  const [filter, setFilter] = useState('Current');
  const [selectedMedia, setSelectedMedia] = useState(null);
  // Reverse chronological order applies to every archive, including Older.
  const filteredItems = galleryItems
    .filter((item) => item.group === filter)
    .slice()
    .sort(compareEventsNewestFirst);

  const getBadgeIcon = (type) => {
    if (type === 'poster') return <FileText size={12} />;
    if (type === 'news') return <Newspaper size={12} />;
    return <ImageIcon size={12} />;
  };

  return (
    
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8 sm:space-y-10">
      <Helmet>
        <title>Events & Free Meditation Sessions | Zero Point Meditation Center</title>
        <meta name="description" content="Discover upcoming meditation sessions, Buddhist teachings, prayer gatherings and community events hosted by Zero Point Meditation Center."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/events"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/events"/>
        <meta property="og:title" content="Events & Free Meditation Sessions | Zero Point Meditation Center"/>
        <meta property="og:description" content="Discover upcoming meditation sessions, Buddhist teachings, prayer gatherings and community events hosted by Zero Point Meditation Center."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Events & Free Meditation Sessions | Zero Point Meditation Center"/>
        <meta name="twitter:description" content="Discover upcoming meditation sessions, Buddhist teachings, prayer gatherings and community events hosted by Zero Point Meditation Center."/>
      </Helmet>
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

      {/* Archive navigation follows the requested order. */}
      <nav aria-label="Filter event archive" className="flex justify-center gap-2 border-b border-stone-200 pb-4 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" onClick={() => setFilter(tab.value)}
            aria-pressed={filter === tab.value}
            className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-buddhist-gold ${filter === tab.value ? 'text-amber-50' : 'text-stone-600 hover:text-stone-900'}`}>
            {filter === tab.value && (
              <motion.span layoutId="activeEventTab" className="absolute inset-0 bg-buddhist-burgundy rounded-full shadow-md" />
            )}
            <span className="relative z-10">{tab.label}</span>
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
{/* Posters are displayed as artwork only; event cards retain their details. */}
              <div className={`relative overflow-hidden bg-stone-100 ${item.type === 'poster' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                <EventPhotoSlider item={item} />
                <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/30"><Eye size={20} /></span>
                </div>
                {item.type !== 'poster' && (
                  <span className="absolute top-3 left-3 bg-stone-950/80 text-amber-50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    {getBadgeIcon(item.type)} {item.category}{item.images?.length > 1 ? ` · ${item.images.length} photos` : ''}
                  </span>
                )}
              </div>
              {item.type !== 'poster' && (
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
              )}
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
              <div className="bg-black flex items-center justify-center max-h-[60vh] min-h-0 p-3">
                <div className="w-full h-[38vh] sm:h-[52vh] max-h-[60vh]">
                  <EventPhotoSlider item={selectedMedia} className="rounded-lg overflow-hidden" />
                </div>
              </div>
{selectedMedia.type !== 'poster' && (
                <div className="p-5 sm:p-6 bg-stone-900 space-y-2 overflow-y-auto">
                  <div className="flex flex-wrap items-center gap-2 text-buddhist-gold font-bold text-xs uppercase tracking-widest">
                    <span>{selectedMedia.category}</span><span>•</span><span>{selectedMedia.location}</span><span>•</span><span>{selectedMedia.date}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-50">{selectedMedia.title}</h2>
                  <p className="text-stone-300 text-sm leading-relaxed">{selectedMedia.description}</p>
                  {selectedMedia.videoUrl && (
                    <a href={selectedMedia.videoUrl} target="_blank" rel="noreferrer"
                      className="inline-flex mt-3 text-sm font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4">
                      Watch the Mindfulness Meditation video on YouTube
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
