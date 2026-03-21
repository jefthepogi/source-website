import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FaArrowRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Outfit:wght@300;400;500&display=swap');
  .init-root { font-family: 'Outfit', sans-serif; }
  .init-link {
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none; color: #f0f2f1;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: clamp(1rem, 2vw, 1.2rem);
    transition: color 0.2s, gap 0.2s;
  }
  .init-link:hover { color: #22c55e; gap: 14px; }
  .init-link .arrow-icon { color: #22c55e; flex-shrink: 0; transition: transform 0.2s; }
  .init-link:hover .arrow-icon { transform: translateX(3px); }
  .init-item { padding-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 28px; }
  .init-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .init-slider .slick-dots li button:before { color: rgba(255,255,255,0.3) !important; }
  .init-slider .slick-dots li.slick-active button:before { color: #22c55e !important; }
  .init-num {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 0.75rem; color: #22c55e;
    letter-spacing: 0.15em; margin-bottom: 8px; display: block;
  }
`;

const initiativesData = [
  {
    title: 'Computer Literacy Program',
    description: 'Empowering the community with essential Microsoft Office skills. Last year, we introduced guests from Gala, Ozamiz City to digital tools that set them up for success.',
    link: 'https://www.facebook.com/share/p/YoBUcga9FjumYkHe/',
  },
  {
    title: 'Hands-On Workshops',
    description: 'Diverse workshops covering game development, website design, and video editing — something tailored for every student passionate about tech.',
    link: 'https://www.facebook.com/share/p/YHPC1TFgeVXyfNhm/',
  },
  {
    title: 'CS/IT Team Building',
    description: 'Each year, we bring CS and IT students together for a day of fun, teamwork, and lasting friendships that go beyond the classroom.',
    link: 'https://www.facebook.com/share/p/9339s7hnTKikcNo9/',
  },
];

export default function InitiativesSection() {
  const [textHeight, setTextHeight] = useState(0);
  const textDivRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => textDivRef.current && setTextHeight(textDivRef.current.offsetHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    centerMode: true,
    centerPadding: '0px',
    arrows: false,
  };

  return (
    <>
      <style>{S}</style>
      <div className="init-root">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} className="md:flex-row md:items-stretch">
          <div ref={textDivRef} style={{ flex: 1, paddingRight: 0 }} className="md:pr-12 mb-8 md:mb-0">
            {initiativesData.map(({ title, description, link }, i) => (
              <div key={i} className="init-item">
                <span className="init-num">0{i + 1}</span>
                <a href={link} target="_blank" rel="noopener noreferrer" className="init-link">
                  <span>{title}</span>
                  <FaArrowRight className="arrow-icon" size={14} />
                </a>
                <p style={{ color: '#9aa39d', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.75, marginTop: 8 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="init-slider md:w-1/2 overflow-hidden rounded-2xl" style={{ height: textHeight || 340, border: '1px solid rgba(255,255,255,0.07)' }}>
            <Slider {...settings} style={{ height: '100%' }}>
              {initiativesData.map((initiative, index) => (
                <div key={index} style={{ height: textHeight || 340, position: 'relative' }}>
                  <img
                    src={require(`../assets/initiatives-img/${index + 1}.jpg`)}
                    alt={initiative.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,10,0.6) 0%, transparent 50%)' }} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}
