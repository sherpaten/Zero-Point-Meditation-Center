import React, { useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAssistant from './components/FloatingAssistant';

const Welcome = lazy(() => import('./pages/Welcome.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Teachings = lazy(() => import('./pages/Teachings.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Merchandise = lazy(() => import('./pages/Merchandise.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const MeditationBooking = lazy(() => import('./pages/MeditationBooking.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SiteLayout() {
  const { pathname } = useLocation();
  const isWelcome = pathname === '/';

  return (
    <div className={isWelcome
      ? 'min-h-screen bg-black'
      : 'relative z-10 flex min-h-screen flex-col justify-between bg-buddhist-bg font-sans text-buddhist-charcoal selection:bg-buddhist-gold-light selection:text-buddhist-burgundy'}>
      {!isWelcome && <Navbar />}
      <main className={isWelcome ? '' : 'grow'}>
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-buddhist-burgundy" role="status">Loading page…</div>}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/teachings" element={<Teachings />} />
            <Route path="/events" element={<Events />} />
            <Route path="/merchandise" element={<Merchandise />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/meditation-booking" element={<MeditationBooking />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isWelcome && <Footer />}
      {!isWelcome && <FloatingAssistant />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <SiteLayout />
      </Router>
    </HelmetProvider>
  );
}
