
import React, { useEffect } from 'react';
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

import Welcome from './pages/Welcome';
import Home from './pages/Home';
import About from './pages/About';
import Teachings from './pages/Teachings';
import Events from './pages/Events';
import Merchandise from './pages/Merchandise';
import Contact from './pages/Contact';
import Services from './pages/Services';

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

        {/* Main website layout */}
        <div className="relative z-10 flex min-h-screen flex-col justify-between bg-buddhist-bg font-sans text-buddhist-charcoal selection:bg-buddhist-gold-light selection:text-buddhist-burgundy">
          <Navbar />

          {/* Website pages */}
          <main className="grow">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/teachings" element={<Teachings />} />
              <Route path="/events" element={<Events />} />
              <Route path="/merchandise" element={<Merchandise />} />
              <Route path="/contact" element={<Contact />} />

              {/* Redirect unknown routes to Welcome */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Floating AI assistant available on every page */}
          <FloatingAssistant />
        </div>
      </Router>
    </HelmetProvider>
  );
}
