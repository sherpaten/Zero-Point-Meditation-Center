import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import logo from '../public/LOGO.png';

export default function Navbar() {
  const linkStyles = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? 'text-buddhist-burgundy font-bold border-b-2 border-buddhist-gold pb-1'
        : 'text-stone-700 hover:text-buddhist-burgundy font-semibold'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Zero Point Meditation Center Logo" 
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          <span className="font-serif font-bold text-xl text-buddhist-burgundy tracking-tight">
            Zero Point
            Meditation Center
          </span>
          
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider">
          <NavLink to="/" className={linkStyles}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkStyles}>
            About
          </NavLink>
          <NavLink to="/events" className={linkStyles}>
            Events
          </NavLink>
          <NavLink to="/teachings" className={linkStyles}>
            Teachings
          </NavLink>
          <NavLink to="/merchandise" className={linkStyles}>
            Merchandise
          </NavLink>

          {/* Special Contact Link with Glow & Scale Effect */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bg-buddhist-burgundy text-amber-50 ring-2 ring-buddhist-gold ring-offset-2'
                  : 'bg-stone-900 text-amber-100 hover:bg-buddhist-burgundy hover:text-amber-50 hover:shadow-md hover:scale-105 border border-amber-500/40'
              }`
            }
          >
            <Sparkles size={13} className="text-buddhist-gold animate-pulse" />
            <span>Contact</span>
          </NavLink>
        </nav>

      </div>
    </header>
  );
}