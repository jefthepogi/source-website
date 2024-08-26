import React, { useState } from 'react';
import Slider from 'react-slick';
import newsData from '../data/news.json'; // Ensure the path is correct
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,  // Ensures no large size issues
    centerPadding: '0px',
    afterChange: (index) => setCurrentIndex(index),
  };

  return (
    <div className="flex flex-col md:flex-row items-start max-w-6xl mx-auto p-4">
      {/* Slider */}
      <div className="w-full md:w-2/5" style={{ flex: '0 0 auto' }}>
        <Slider {...settings}>
          {newsData.map((news, index) => (
            <div key={index} className="relative" style={{ width: '100%' }}>
              <img
                src={require(`../assets/news-img/${news.image}`)}
                alt={news.title}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Info Content */}
      <div className="w-full md:w-3/5 md:ml-4 mt-4 md:mt-0 flex pt-12">
        <div className="p-4 text-black">
          <h3 className="text-3xl text-[#087830] font-bold">{newsData[currentIndex]?.title}</h3>
          <p className="mt-1 text-md text-gray-600">{newsData[currentIndex]?.date}</p>
          <div className="mt-2 flex flex-wrap justify-center space-x-2">
            {newsData[currentIndex]?.tags?.map((tag, index) => (
              <span key={index} className="bg-[#087830] text-white text-sm rounded-full px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-justify">{newsData[currentIndex]?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default NewsCarousel;
