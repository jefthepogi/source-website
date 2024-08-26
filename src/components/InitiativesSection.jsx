import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample initiatives data
const initiativesData = [
  {
    title: 'Computer Literacy Program',
    description: 'Guests from Gala, Ozamiz City learned the basics of Microsoft Office during our computer literacy program.',
    link: '#',
  },
  {
    title: 'Workshops',
    description: 'From game development to video editing, we have workshops for you!',
    link: '#',
  },
  {
    title: 'Team Building',
    description: 'idk',
    link: '#',
  },
  {
    title: 'Team Building',
    description: 'idk',
    link: '#',
  },
];

function InitiativesSection() {
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
  };

  return (
    <div className="bg-white py-8">
      <div className="flex flex-col md:flex-row items-center">
        {/* Static Text */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 flex flex-col justify-center">
          {initiativesData.map((initiative, index) => (
            <div key={index} className="mb-8">
              <a href={initiative.link}>
                <h3 className="text-2xl font-semibold text-gray-700">{initiative.title}</h3>
              </a>
              <p className="text-gray-600 mt-2 text-lg">{initiative.description}</p>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div className="md:w-1/2 flex justify-end">
          <div className="relative w-full h-80 max-w-xs">
            <Slider {...settings} className="h-full">
              {initiativesData.map((initiative, index) => (
                <div key={index} className="relative w-full h-full">
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={require(`../assets/initiatives-img/${index + 1}.jpg`)}
                      alt={initiative.title}
                      className="h-full w-auto min-w-full object-cover"
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
