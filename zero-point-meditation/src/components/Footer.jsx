import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/LOGO-optimized.webp';
import facebookIcon from '../assets/Icons/facebook-optimized.webp';
import instagramIcon from '../assets/Icons/Instagram-optimized.webp';
import linkedinIcon from '../assets/Icons/LinkedIn-optimized.webp';
import twitterIcon from '../assets/Icons/Twitter-optimized.webp';

const socialLinks = [
  { name: 'Facebook', icon: facebookIcon, url: 'https://www.facebook.com/share/1Cu51tVsZb/?mibextid=wwXIfr' },
  { name: 'Instagram', icon: instagramIcon, url: 'https://www.instagram.com/zpmc_usa?cplk=eGxhbjFiMW1jNGlh' },
  { name: 'LinkedIn', icon: linkedinIcon, url: 'https://www.linkedin.com/company/zero-point-meditation-center-in-usa/' },
  { name: 'Twitter', icon: twitterIcon, url: 'https://x.com/ZeroCenter79031' },
];

export default function Footer() {
  return (
    <footer className="bg-buddhist-card text-buddhist-charcoal border-t border-amber-900/20 pt-6 pb-3">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Zero Point Meditation Center Logo" width="40" height="40" loading="lazy" decoding="async" className="w-8 h-8 object-contain" />
            <h3 className="font-serif font-bold text-base text-buddhist-burgundy leading-tight">
              Zero Point Meditation Center
            </h3>
          </div>
          <p className="text-stone-700 text-xs leading-relaxed">
            A spiritual refuge dedicated to Himalayan mindfulness meditation, peace prayer assemblies, and ecological stewardship.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-serif font-bold text-sm text-buddhist-burgundy">Quick Links</h4>
          <ul className="space-y-1 text-xs text-stone-800 font-medium">
            <li><Link to="/home" className="hover:text-buddhist-gold transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-buddhist-gold transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-buddhist-gold transition-colors">Services</Link></li>
            <li><Link to="/teachers" className="hover:text-buddhist-gold transition-colors">Teachers & Advisors</Link></li>
            <li><Link to="/about#members" className="hover:text-buddhist-gold transition-colors">Our Members</Link></li>
            <li><Link to="/events" className="hover:text-buddhist-gold transition-colors">Events & Programs</Link></li>
            <li><Link to="/donate" className="font-bold text-buddhist-burgundy hover:text-buddhist-gold transition-colors">Donate / Support Us</Link></li>
            <li><Link to="/merchandise" className="hover:text-buddhist-gold transition-colors">Merchandise</Link></li>
            <li><Link to="/contact" className="hover:text-buddhist-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-serif font-bold text-sm text-buddhist-burgundy">Location & Contact</h4>
          <div className="text-xs text-stone-800 space-y-1.5 leading-relaxed font-medium">
            <p className="flex items-start gap-2"><span>📍</span><span>New York, United States</span></p>
            <p className="flex items-center gap-2"><span>📞</span><a href="tel:+16464560843" className="hover:text-buddhist-gold transition-colors">+1 (646) 456-0843</a></p>
            <p className="flex items-center gap-2"><span>✉️</span><a href="mailto:info@zeropointmeditationcenter.org" className="hover:text-buddhist-gold transition-colors break-all">info@zeropointmeditationcenter.org</a></p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-serif font-bold text-sm text-buddhist-burgundy">Connect With Us</h4>
          <p className="text-xs text-stone-700">Follow our daily discourses and sangha updates.</p>
          <div className="flex items-center gap-2 pt-1">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.name} className="w-8 h-8 rounded-full overflow-hidden border border-amber-900/20 hover:border-buddhist-gold transition-all transform hover:scale-110 shadow-sm bg-white flex items-center justify-center group">
                <img src={item.icon} alt={item.name} width="48" height="48" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:brightness-105" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-amber-900/20 max-w-6xl mx-auto px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-3">
          <h5 className="font-serif font-bold text-xs text-buddhist-burgundy">Policies</h5>
          <Link to="/merchandise-policy" className="text-stone-700 hover:text-buddhist-gold transition-colors">Merchandise Policy</Link>
        </div>
      </div>

      <div className="border-t border-amber-900/20 max-w-6xl mx-auto px-6 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 font-medium">
        <p>© {new Date().getFullYear()} Zero Point Meditation Center. All rights reserved.</p>
        <p className="mt-1 sm:mt-0">Preserving Himalayan Lineage Wisdom</p>
      </div>
    </footer>
  );
}
