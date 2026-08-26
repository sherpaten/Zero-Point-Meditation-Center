import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Welcome from './pages/Welcome';
import Home from './pages/Home';
import About from './pages/About';
import Teachings from './pages/Teachings';
import Events from './pages/Events';
import Merchandise from './pages/Merchandise';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />

        {/* Foreground Content Wrapper */}
        <div className="relative z-10 min-h-screen bg-buddhist-bg text-buddhist-charcoal font-sans flex flex-col justify-between selection:bg-buddhist-gold-light selection:text-buddhist-burgundy">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/teachings" element={<Teachings />} />
              <Route path="/events" element={<Events />} />
              <Route path="/merchandise" element={<Merchandise />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}