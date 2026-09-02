import React from 'react';
import { Link } from 'react-router-dom';

// Import LOGO asset (uses LOGO.svg, update extension if using LOGO.png)
import logo from '../public/LOGO.png'; 

// Custom icons imported directly from src/assets/Icons/
import facebookIcon from '../assets/Icons/facebook.jpg';
import instagramIcon from '../assets/Icons/Instagram.jpg';
import linkedinIcon from '../assets/Icons/LinkedIn.png';
import twitterIcon from '../assets/Icons/Twitter.png';

const socialLinks = [
  { name: 'Facebook', icon: facebookIcon, url: 'https://www.facebook.com/share/1DUU1HaMm2/' },
  { name: 'Instagram', icon: instagramIcon, url: 'https://instagram.com' },
  { name: 'LinkedIn', icon: linkedinIcon, url: 'https://www.linkedin.com/company/zero-point-meditation-center-in-usa/' },
  { name: 'Twitter', icon: twitterIcon, url: 'https://x.com/ZeroCenter79031' },
];

export default function Footer() {
  return (
    <footer className="bg-buddhist-card text-buddhist-charcoal border-t border-amber-900/20 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Sanctuary Summary with Logo */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Zero Point Meditation Center Logo"
              className="w-12 h-12 object-contain"
            />
            <h3 className="font-serif font-bold text-xl text-buddhist-burgundy leading-tight">
              Zero Point Meditation Center
            </h3>
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            A spiritual refuge dedicated to Himalayan mindfulness meditation, peace prayer assemblies, and ecological stewardship.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-base text-buddhist-burgundy">Navigation</h4>
          <ul className="space-y-2.5 text-sm text-stone-800 font-medium">
            <li><Link to="/home" className="hover:text-buddhist-gold transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-buddhist-gold transition-colors">About Rinpoche</Link></li>
            <li><Link to="/teachings" className="hover:text-buddhist-gold transition-colors">Teachings</Link></li>
            <li><Link to="/events" className="hover:text-buddhist-gold transition-colors">Events & Programs</Link></li>
            <li><Link to="/merchandise" className="hover:text-buddhist-gold transition-colors">Merchandise</Link></li>
            <li><Link to="/contact" className="hover:text-buddhist-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Location & Contact Information */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-base text-buddhist-burgundy">Location & Contact</h4>
          <div className="text-sm text-stone-800 space-y-3 leading-relaxed font-medium">
            <p className="flex items-start gap-2.5">
              <span className="text-base">📍</span>
              <span>New York, United States</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-base">📞</span>
              <span>+1 (347) 804-4551</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="text-base">✉️</span>
              <span>info@zeropointmeditation.org</span>
            </p>
          </div>
        </div>

        {/* Social Media Icons Section */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-base text-buddhist-burgundy">Connect With Us</h4>
          <p className="text-sm text-stone-700">Follow our daily discourses and sangha updates.</p>
          
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="w-11 h-11 rounded-full overflow-hidden border border-amber-900/20 hover:border-buddhist-gold transition-all transform hover:scale-110 shadow-sm bg-white flex items-center justify-center group"
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:brightness-105"
                />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Copyright Footer */}
      <div className="border-t border-amber-900/20 max-w-6xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 font-medium">
        <p>© {new Date().getFullYear()} Zero Point Meditation Center. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Preserving Himalayan Lineage Wisdom</p>
      </div>
    </footer>
  );
}