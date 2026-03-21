import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SOURCELogo from '../assets/source-logo-minimal-white.png';
import LSULogo from '../assets/LSU-STAR-LOGO-whit.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/officers', label: 'Officers' },
  { href: '/events', label: 'Events' },
  { href: '/merch', label: 'Merch' },
  { href: '/contacts', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn(); // check immediately on mount and on every route change
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [location.pathname]); // re-run when route changes so scroll state resets correctly

  useEffect(() => setMenuOpen(false), [location]);

  // Transparent at top on all pages, green when scrolled.
  const isTransparent = !scrolled;

  return (
    <nav className={`nav-root fixed top-0 left-0 right-0 z-40 ${isTransparent ? '' : 'scrolled'}`}>
      <div className="padding h-[60px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <img src={SOURCELogo} alt="SOURCE"
            style={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
          <span className="nav-wordmark">SOURCE</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={`nav-link ${location.pathname === href ? 'active' : ''}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a href="https://lsu.edu.ph/" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex"
            style={{ opacity: 0.8, transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}>
            <img src={LSULogo} alt="LSU" style={{ height: 22, width: 'auto', display: 'block' }} />
          </a>

          <button className="hamburger lg:hidden flex flex-col gap-[5px] items-end p-1"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ width: '22px', ...(menuOpen ? { transform: 'rotate(45deg) translate(4px, 6px)' } : {}) }} />
            <span style={{ width: '14px', ...(menuOpen ? { opacity: 0, width: 0 } : {}) }} />
            <span style={{ width: '22px', ...(menuOpen ? { transform: 'rotate(-45deg) translate(4px, -6px)' } : {}) }} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="mobile-drawer lg:hidden"
        style={{ maxHeight: menuOpen ? '320px' : '0', opacity: menuOpen ? 1 : 0 }}>
        <div className="mobile-drawer-inner" style={{ padding: '14px 11vw 20px' }}>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} style={{
              display: 'block', padding: '11px 0',
              fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: location.pathname === href ? '#4ade80' : 'rgba(255,255,255,0.65)',
              textDecoration: 'none', transition: 'color 0.2s',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
