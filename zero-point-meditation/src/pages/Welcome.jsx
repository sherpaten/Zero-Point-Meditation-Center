import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import boudhaImg from '../assets/Boudha.jpg';

export default function Welcome() {
  const [isColorized, setIsColorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const colorTimer = window.setTimeout(() => setIsColorized(true), 150);
    return () => window.clearTimeout(colorTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <Helmet>
        <title>Welcome | Zero Point Meditation Center</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <img
        src={boudhaImg}
        alt="Boudha Art Background"
        fetchPriority="high"
        decoding="async"
        width="1600"
        height="1000"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: isColorized ? 'grayscale(0%) contrast(100%) sepia(0%)' : 'grayscale(100%) contrast(140%) sepia(40%)',
          transform: isColorized ? 'scale(1)' : 'scale(1.04)',
          transition: 'filter 2s ease-out, transform 2s ease-out',
        }}
      />

      <div className="absolute inset-0 bg-black/25" />

      <button
        type="button"
        onClick={() => navigate('/home')}
        aria-label="Enter Home Page"
        className="welcome-enter relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400/80 bg-buddhist-burgundy/85 text-amber-200 shadow-[0_0_35px_rgba(217,119,6,0.6)] transition-colors hover:bg-buddhist-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 sm:h-24 sm:w-24"
      >
        <ChevronDown size={44} className="animate-bounce text-amber-300" aria-hidden="true" />
      </button>
    </div>
  );
}
