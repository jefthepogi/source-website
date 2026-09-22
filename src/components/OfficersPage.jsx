import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getOptimizedImageUrl } from '../utils/imagekit';
import HeaderBgImage from '../assets/officer_header-bg.jpg';
import officerStructure from '../assets/officer-structure.png';

const FALLBACK_IMAGE = 'https://placehold.co/300x300/191c1a/22c55e?text=PHOTO';

export default function OfficersPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // Set default to the current 2026-2027 academic year 
  const [academicYear, setAcademicYear] = useState('2026–2027');

  useEffect(() => {
    let isMounted = true;

    // Queries the public.officers table schema
    supabase
      .from('officers')
      .select('id, name, position, image_url, category, academic_year')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          console.error('Supabase fetch error:', error);
          setFetchError(error.message);
        } else if (data) {
          // Group officers by the 'category' text column
          const grouped = data.reduce((acc, o) => {
            const cat = o.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(o);
            return acc;
          }, {});

          setCategories(
            Object.entries(grouped).map(([cat, officers]) => ({
              category: cat,
              officers,
            }))
          );

          // Dynamically set academic year from the first published record
          if (data.length > 0 && data[0].academic_year) {
            setAcademicYear(data[0].academic_year);
          }
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="officers-root">
      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(280px,45vw,420px)', overflow: 'hidden', background: '#0a0c0b' }}>
        <img src={HeaderBgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.7) 50%, rgba(8,12,10,0.4) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 11vw 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>
              A.Y. {academicYear}
            </span>
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

      {/* Officers Grid Section */}
      <div style={{ padding: '80px 11vw' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            {/* Swapped to SVG for cleaner rendering without injected inline <style> tags */}
            <svg style={{ width: 28, height: 28, color: '#22c55e', animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : fetchError ? (
          <p style={{ textAlign: 'center', color: '#ef4444' }}>
            Failed to load officers list: {fetchError}
          </p>
        ) : categories.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#5a6560', fontStyle: 'italic' }}>No officers listed yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {categories.map((cat, i) => (
              <CategorySection key={cat.category} {...cat} delay={i * 60} />
            ))}
          </div>
        )}
      </div>

      {/* Org Chart */}
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
        <img src={officerStructure} alt="SOURCE Organizational Structure Chart" style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'block', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>
    </div>
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
          // o.id utilizes the UUID primary key from the schema
          <div key={o.id} className="officer-card">
            <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#191c1a' }}>
              <img
              // using ImageKit API to host the images made easy with the helper function
                src={getOptimizedImageUrl(o.image_url, { width: 300 })}
                alt={o.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                  console.log(e);
                }}
              />
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