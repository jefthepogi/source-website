import React, { useState, useEffect } from 'react';
import SliderModule from 'react-slick';
import { supabase } from '../lib/supabase';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// fixed slider module import for SSR (server-side rendering) compatibility
const Slider = SliderModule.default || SliderModule;

export default function NewsCarousel() {
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('news').select('*').eq('published', true).order('date', { ascending: false }).limit(10)
      .then(({ data, error }) => { if (!error && data) setNewsData(data); setLoading(false); });
  }, []);

  const settings = { dots: false, infinite: true, speed: 600, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4500, afterChange: (i) => setCurrentIndex(i), arrows: false };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{ width: 24, height: 24, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!newsData.length) return <p style={{ color: '#5a6560', textAlign: 'center', padding: '32px', fontFamily: "'Outfit',sans-serif" }}>No news available yet.</p>;

  const current = newsData[currentIndex];

  return (
    <>
      <div className="news-root" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div className="news-wrap" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr' }}>

          {/* Image side */}
          <div style={{ position: 'relative', minHeight: '280px' }} className="news-slider">
            <Slider {...settings} style={{ height: '100%' }}>
              {newsData.map((n) => (
                <div key={n.id} style={{ height: '100%' }}>
                  <img src={n.image_url || 'https://placehold.co/600x400/131615/22c55e?text=SOURCE'} alt={n.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '280px', maxHeight: '360px' }} loading="lazy" />
                </div>
              ))}
            </Slider>
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 6, zIndex: 10 }}>
              {newsData.map((_, i) => (
                <button key={i} className={`news-dot ${i === currentIndex ? 'active' : ''}`}
                  style={{ height: 6, width: i === currentIndex ? 20 : 6, border: 'none', padding: 0 }} />
              ))}
            </div>
          </div>

          {/* Text side */}
          <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              {current.tag && (
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', background: '#22c55e22', padding: '3px 10px', borderRadius: 100 }}>
                  {current.tag}
                </span>
              )}
              <span style={{ fontSize: 12, color: '#5a6560' }}>
                {current.date ? new Date(current.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
              </span>
            </div>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', color: '#f0f2f1', lineHeight: 1.2, marginBottom: 12 }}>
              {current.title}
            </h3>

            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: 14, color: '#9aa39d', lineHeight: 1.75, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
              {current.description || 'No description available.'}
            </p>

            {/* Progress bar */}
            <div style={{ marginTop: 28, height: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
              <div key={currentIndex} style={{ height: '100%', background: '#22c55e', animation: 'progress 4.5s linear forwards' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
