import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import logo from '../assets/LOGO.svg';

const navigation = [
  { to: '/home', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'What We Offer' },
  { to: '/events', label: 'Events' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/merchandise', label: 'Merchandise' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const linkStyles = ({ isActive }) =>
    `block rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buddhist-gold ${
      isActive
        ? 'bg-amber-50 text-buddhist-burgundy'
        : 'text-stone-700 hover:bg-stone-100 hover:text-buddhist-burgundy'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/home"
          className="group flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-buddhist-gold sm:gap-3"
          aria-label="Zero Point Meditation Center home"
        >
          <img
            src={logo}
            alt="Zero Point Meditation Center"
            className="h-9 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-10"
            width="40"
            height="40"
          />
          <span className="font-serif text-base font-bold leading-tight tracking-tight text-buddhist-burgundy sm:text-xl">
            Zero Point
            <span className="block">Meditation Center</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-xs uppercase tracking-wider md:flex lg:gap-7">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-buddhist-gold ${
                  item.to === '/contact'
                    ? 'border-b-2 border-buddhist-gold pb-1 font-bold text-buddhist-burgundy hover:text-stone-900'
                    : isActive
                      ? 'border-b-2 border-buddhist-gold pb-1 font-bold text-buddhist-burgundy'
                      : 'font-semibold text-stone-700 hover:text-buddhist-burgundy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-buddhist-burgundy transition-colors hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buddhist-gold md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-primary-navigation"
          aria-label="Mobile navigation"
          className="border-t border-stone-200 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden sm:px-6"
        >
          <ul className="mx-auto max-w-6xl space-y-1">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={linkStyles}
                >
                  {item.label}
                  {item.to === '/contact' && <Sparkles size={15} className="ml-2 inline text-buddhist-gold" aria-hidden="true" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
