import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight } from 'react-icons/fa'; // Importing arrow icon

// Initiatives data
const initiativesData = [
  {
    title: 'Computer Literacy Program',
    description: 'Join us in empowering the community! Last year, we introduced guests from Gala, Ozamiz City the essential Microsoft Office skills, setting them up for success in the digital age.',
    link: 'https://www.facebook.com/share/p/YoBUcga9FjumYkHe/',
  },
  {
    title: 'Hands-On Workshops',
    description: 'Unlock your potential with our diverse workshops! Whether you’re into game development, website design or video editing, we have something tailored just for you.',
    link: 'https://www.facebook.com/share/p/YHPC1TFgeVXyfNhm/',
  },
  {
    title: 'CS/IT Team Building',
    description: 'Each year, we bring CS and IT students together for a day of fun, teamwork, and lasting friendships through our team-building activities.',
    link: 'https://www.facebook.com/share/p/9339s7hnTKikcNo9/',
  },
];

function InitiativesSection() {
  const [textHeight, setTextHeight] = useState(0);
  const textDivRef = useRef(null);

  useEffect(() => {
    // Update the text height on mount and window resize
    const updateHeight = () => {
      if (textDivRef.current) {
        setTextHeight(textDivRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '0px',
    adaptiveHeight: false, // Use consistent height for all images
  };

  return (
    <div className="bg-white py-8">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Static Text */}
        <div
          ref={textDivRef}
          className="md:w-1/2 mb-8 md:mb-0 md:pr-8 flex flex-col justify-center"
        >
          {initiativesData.map((initiative, index) => (
            <div key={index} className="mb-8">
              <a
                href={initiative.link}
                className="flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-300 transform hover:translate-x-2"
              >
                <h3 className="text-2xl font-semibold mr-2">{initiative.title}</h3>
                <FaArrowRight className="text-gray-700" />
              </a>
              <p className="text-gray-600 mt-2 text-lg">{initiative.description}</p>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div
          className="md:w-1/2 flex justify-end overflow-hidden"
          style={{ height: textHeight }}
        >
          <div className="relative w-full h-full flex-shrink-0">
            <Slider {...settings} className="w-full h-full">
              {initiativesData.map((initiative, index) => (
                <div key={index} className="relative w-full h-full flex items-center justify-center">
                  <div className="w-full h-full overflow-hidden flex items-center justify-center">
                    <img
                      src={require(`../assets/initiatives-img/${index + 1}.jpg`)}
                      alt={initiative.title}
                      className="object-cover w-full"
                      style={{
                        height: '100%', // Ensure all images fill the container height
                        width: 'auto', // Allow width to adjust based on height
                      }}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitiativesSection;
