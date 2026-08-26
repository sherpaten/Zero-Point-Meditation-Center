import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import boudhaImg from '../assets/Boudha.jpg';

export default function Welcome() {
  const [isColorized, setIsColorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Triggers the smooth transition after component mounts
    const colorTimer = setTimeout(() => {
      setIsColorized(true);
    }, 150);

    return () => clearTimeout(colorTimer);
  }, []);

  return (
    /* fixed inset-0 z-50 covers the entire screen, hiding the Navbar & Footer */
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      
      {/* Background Image with guaranteed CSS Filter Transition */}
      <img
        src={boudhaImg}
        alt="Boudha Art Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: isColorized
            ? 'grayscale(0%) contrast(100%) sepia(0%)'
            : 'grayscale(100%) contrast(140%) sepia(40%)',
          transform: isColorized ? 'scale(1)' : 'scale(1.08)',
          transition: 'filter 4s ease-out, transform 4s ease-out',
        }}
      />

      {/* Subtle Ambient Vignette */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Animated Center Arrow Button */}
      <motion.button
        onClick={() => navigate('/home')}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Enter Home Page"
        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-buddhist-burgundy/85 hover:bg-buddhist-burgundy text-amber-200 border-2 border-amber-400/80 shadow-[0_0_35px_rgba(217,119,6,0.6)] backdrop-blur-md flex items-center justify-center group transition-all cursor-pointer"
      >
        <ChevronDown size={44} className="animate-bounce text-amber-300 group-hover:text-amber-100" />
      </motion.button>

    </div>
  );
}