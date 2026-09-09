import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FaArrowRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  const textDivRef = useRef(null);
  const [sliderHeight, setSliderHeight] = useState(340);

  useEffect(() => {
    const update = () => {
      if (textDivRef.current) {
        setSliderHeight(textDivRef.current.offsetHeight);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    adaptiveHeight: false,
  };

  return (
    <>
      <div className="init-root">
        {/* Two-column layout: text left, slider right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'stretch',
        }}
          className="initiatives-grid"
        >
          {/* LEFT — text */}
          <div ref={textDivRef} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {initiativesData.map(({ title, description, link }, i) => (
              <div key={i} className="init-item">
                <span className="init-num">0{i + 1}</span>
                <a href={link} target="_blank" rel="noopener noreferrer" className="init-link">
                  <span>{title}</span>
                  <FaArrowRight className="arrow-icon" size={13} />
                </a>
                <p style={{ color: '#9aa39d', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.75, marginTop: 8 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT — image slider */}
          <div
            className="init-slider"
            style={{
              height: sliderHeight || 340,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              flexShrink: 0,
            }}
          >
            <Slider {...settings} style={{ height: '100%' }}>
              {initiativesData.map((initiative, index) => (
                <div key={index} style={{ height: sliderHeight || 340, position: 'relative' }}>
                  <img
                    src={new URL(`../assets/initiatives-img/${index + 1}.jpg`, import.meta.url).href}
                    alt={initiative.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(8,12,10,0.65) 0%, rgba(8,12,10,0.1) 50%, transparent 100%)'
                  }} />
                  {/* Slide label */}
                  <div style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '0.9rem', lineHeight: 1.3 }}>
                      {initiative.title}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Responsive: stack on mobile */}
        <style>{`
          @media (max-width: 767px) {
            .initiatives-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
