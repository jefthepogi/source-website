import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HeaderBgImage from '../assets/officer_header-bg.jpg';
import officerStructure from '../assets/officer-structure.png';

export default function OfficersPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    supabase.from('officers').select('*').eq('published', true).order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          const grouped = data.reduce((acc, o) => { if (!acc[o.category]) acc[o.category] = []; acc[o.category].push(o); return acc; }, {});
          setCategories(Object.entries(grouped).map(([cat, officers]) => ({ category: cat, officers })));
          if (data.length) setAcademicYear(data[0].academic_year || '2025–2026');
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="officers-root">

        {/* Hero */}
        <div style={{ position: 'relative', height: 'clamp(280px,45vw,420px)', overflow: 'hidden', background: '#0a0c0b' }}>
          <img src={HeaderBgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.7) 50%, rgba(8,12,10,0.4) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 11vw 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>A.Y. {academicYear}</span>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f0f2f1', lineHeight: 1.05, marginBottom: 12 }}>
              Meet the Officers
            </h1>
            <p style={{ color: 'rgba(240,242,241,0.45)', fontWeight: 300, maxWidth: '400px' }}>
              A dedicated team working towards the advancement of ICT.
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
        </div>

        {/* Officers grid */}
        <div style={{ padding: '80px 11vw' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ width: 28, height: 28, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : categories.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#5a6560', fontStyle: 'italic' }}>No officers listed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
              {categories.map((cat, i) => <CategorySection key={i} {...cat} delay={i * 60} />)}
            </div>
          )}
        </div>

        {/* Org chart */}
        <div style={{ background: '#0a0c0b', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '80px 11vw' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              Structure
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
            </span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#f0f2f1', marginBottom: 12 }}>
              Organizational Chart
            </h2>
            <p style={{ color: '#9aa39d', fontWeight: 300, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Nine core committees plus year-level representatives make up the SOURCE Student Council.
            </p>
          </div>
          <img src={officerStructure} alt="Org chart" style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'block', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </div>
    </>
  );
}

function CategorySection({ category, officers, delay }) {
  return (
    <div className="fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 3, height: 20, background: '#22c55e', borderRadius: 2, flexShrink: 0 }} />
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#f0f2f1' }}>{category}</h3>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,160px), 1fr))', gap: 16 }}>
        {officers.map((o) => (
          <div key={o.id} className="officer-card">
            <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#191c1a' }}>
              <img src={o.image_url || 'https://placehold.co/300x300/191c1a/22c55e?text=Photo'} alt={o.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontWeight: 600, color: '#f0f2f1', fontSize: '0.85rem', lineHeight: 1.3 }}>{o.name}</p>
              <p style={{ fontSize: 11, color: '#22c55e', fontWeight: 500, marginTop: 6, letterSpacing: '0.04em' }}>{o.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
