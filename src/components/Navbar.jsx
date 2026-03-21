import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SOURCELogo from '../assets/source-logo-minimal-white.png';
import LSULogo from '../assets/LSU-STAR-LOGO-whit.png';

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Outfit:wght@400;500;600&display=swap');
  .nav-root {
    font-family: 'Outfit', sans-serif;
    background: #087830;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .nav-root.scrolled {
    background: rgba(5,55,20,0.97);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 2px 24px rgba(0,0,0,0.4);
  }
  .nav-link {
    position: relative;
    font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    text-decoration: none; padding: 4px 0;
    transition: color 0.2s;
  }
  .nav-link::after {
    content:''; position:absolute; bottom:-2px; left:0;
    width:0; height:1.5px; background:#4ade80;
    transition: width 0.25s ease;
  }
  .nav-link:hover { color:#fff; }
  .nav-link:hover::after, .nav-link.active::after { width:100%; }
  .nav-link.active { color:#fff; }
  .nav-wordmark { font-family:'Syne',sans-serif; font-weight:700; font-size:1.05rem; color:#fff; letter-spacing:0.06em; }
  .nav-logo-ring { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; transition:background 0.2s, transform 0.4s; }
  .nav-logo-ring:hover { background:rgba(255,255,255,0.25); transform:rotate(20deg); }
  .hamburger span { display:block; height:1.5px; background:rgba(255,255,255,0.9); transition:all 0.3s cubic-bezier(0.4,0,0.2,1); transform-origin:center; }
  .mobile-drawer { overflow:hidden; transition:max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease; }
`;

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
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <style>{NAV_STYLES}</style>
      <nav className={`nav-root sticky top-0 z-40 ${scrolled ? 'scrolled' : ''}`}>
        <div className="padding h-[58px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
            <div className="nav-logo-ring">
              <img src={SOURCELogo} alt="SOURCE" style={{ width: 18, height: 18 }} />
            </div>
            <span className="nav-wordmark">SOURCE</span>
          </a>

          <ul className="hidden lg:flex items-center gap-8" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={`nav-link ${location.pathname === href ? 'active' : ''}`}>{label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="https://lsu.edu.ph/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex"
              style={{ width: 34, height: 34, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.12)', transition: 'background 0.2s', display: 'flex' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <img src={LSULogo} alt="LSU" style={{ height: 20, opacity: 0.9 }} />
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

        <div className="mobile-drawer lg:hidden" style={{ maxHeight: menuOpen ? '320px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: '16px 11vw' }} className="flex flex-col">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '11px 0', fontSize: '12px', fontWeight: 500,
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
    </>
  );
}
