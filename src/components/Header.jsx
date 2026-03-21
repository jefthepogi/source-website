import React, { useState, useEffect } from 'react';
import HeaderBgImage from '../assets/header-bg.jpg';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
  :root { --accent:#22c55e; --text:#f0f2f1; --font-head:'Syne',sans-serif; --font-body:'Outfit',sans-serif; }
  .hero-root { font-family: var(--font-body); }
  .hero-img { opacity: 0; transform: scale(1.06); transition: opacity 0.9s ease, transform 9s ease; }
  .hero-img.loaded { opacity: 1; transform: scale(1); }
  .hero-tag   { opacity:0; transform:translateY(10px); transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s; }
  .hero-h1    { opacity:0; transform:translateY(20px); transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s; }
  .hero-sub   { opacity:0; transform:translateY(14px); transition: opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s; }
  .hero-cta   { opacity:0; transform:translateY(12px); transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s; }
  .hero-ready .hero-tag, .hero-ready .hero-h1, .hero-ready .hero-sub, .hero-ready .hero-cta { opacity:1; transform:none; }
  .hero-accent-line { width:0; transition: width 0.7s cubic-bezier(0.4,0,0.2,1) 0.65s; }
  .hero-ready .hero-accent-line { width: 32px; }
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background: #22c55e; color: #000;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:600;
    padding: 12px 24px; border-radius: 8px; text-decoration:none;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-primary:hover { background: #28d468; transform: translateY(-1px); }
  .btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    background: rgba(255,255,255,0.06); color: rgba(240,242,241,0.75);
    border: 1px solid rgba(255,255,255,0.1);
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:500;
    padding: 12px 24px; border-radius: 8px; text-decoration:none;
    transition: background 0.2s, color 0.2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #f0f2f1; }
  .scroll-indicator {
    position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:6px;
    opacity:0.35;
  }
  .scroll-dot {
    width:4px; height:4px; border-radius:50%; background:#22c55e;
    animation: scrollBounce 1.6s ease infinite;
  }
  .scroll-dot:nth-child(2) { animation-delay: 0.2s; }
  .scroll-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes scrollBounce { 0%,100%{opacity:0.2} 50%{opacity:1} }
`;

export default function Header() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div
        className={`hero-root relative overflow-hidden ${ready ? 'hero-ready' : ''}`}
        style={{ height: '92vh', minHeight: '580px', maxHeight: '820px', background: '#0a0c0b' }}
      >
        {/* Photo */}
        <img
          src={HeaderBgImage} alt=""
          className={`hero-img absolute inset-0 w-full h-full object-cover`}
          onLoad={(e) => e.target.classList.add('loaded')}
        />

        {/* Dark overlay with green tint at bottom */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.78) 45%, rgba(8,20,12,0.6) 100%)'
        }} />

        {/* Dot grid texture */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(34,197,94,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center padding">
          <div style={{ maxWidth: '680px' }}>
            {/* Tag */}
            <div className="hero-tag flex items-center gap-3 mb-5">
              <span className="hero-accent-line" style={{ height: '1px', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>
                CCSEA · La Salle University – Ozamiz
              </span>
            </div>

            {/* H1 */}
            <h1 className="hero-h1" style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
              color: '#f0f2f1', lineHeight: 1.02, marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}>
              Welcome to{' '}
              <span style={{ color: '#22c55e' }}>#LSU-SOURCE</span>
            </h1>

            {/* Sub */}
            <p className="hero-sub" style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 300,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: 'rgba(240,242,241,0.55)',
              lineHeight: 1.75, marginBottom: '36px', maxWidth: '480px',
            }}>
              An academic-based organization in CCSEA focused on the promotion and advancement of ICT in the community.
            </p>

            {/* CTAs */}
            <div className="hero-cta" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/officers" className="btn-primary">
                Meet the Team
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/events" className="btn-ghost">Upcoming Events</a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-dot" />
          <div className="scroll-dot" />
          <div className="scroll-dot" />
        </div>

        {/* Bottom fade to dark */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
      </div>
    </>
  );
}
