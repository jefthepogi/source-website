import React, { useState, useEffect } from 'react';
import HeaderBgImage from '../assets/header-bg.jpg';

export default function Header() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div
      className={`hero-root relative overflow-hidden ${ready ? 'hero-ready' : ''}`}
      style={{ height: '92vh', minHeight: '560px', maxHeight: '820px', background: '#0a0c0b' }}
    >
      <img src={HeaderBgImage} alt=""
        className="hero-img absolute inset-0 w-full h-full object-cover"
        onLoad={(e) => e.target.classList.add('loaded')} />

      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.78) 45%, rgba(8,20,12,0.6) 100%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(34,197,94,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

      <div className="absolute inset-0 flex flex-col justify-center padding">
        <div style={{ maxWidth: '680px' }}>
          <div className="hero-tag flex items-center gap-3 mb-5">
            <span className="hero-accent-line" style={{ height: '1px', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>
              CCSEA · La Salle University – Ozamiz
            </span>
          </div>

          <h1 className="hero-h1-anim" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
            color: '#f0f2f1', lineHeight: 1.02, marginBottom: '20px', letterSpacing: '-0.02em',
          }}>
            Welcome to{' '}
            <span style={{ color: '#22c55e' }}>SOURCE</span>
          </h1>

          <p className="hero-sub-anim" style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'rgba(240,242,241,0.55)', lineHeight: 1.75, marginBottom: '36px', maxWidth: '480px',
          }}>
            An academic-based organization in CCSEA focused on the promotion and advancement of ICT in the community.
          </p>

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

      <div className="scroll-indicator">
        <div className="scroll-dot" /><div className="scroll-dot" /><div className="scroll-dot" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
    </div>
  );
}
