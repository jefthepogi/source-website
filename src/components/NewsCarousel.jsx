import React, { useState } from 'react';
import Slider from 'react-slick';
import { useQuery, gql } from '@apollo/client';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define the GraphQL query
const GET_NEWS = gql`
  query {
    newsAPIConnection {
      edges {
        node {
          title
          date
          image {
            url
          }
          description {
            text
          }
          tag
        }
      }
    }
  }
`;

function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch data using Apollo Client
  const { data, loading, error } = useQuery(GET_NEWS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentIndex(index),
  };

  const newsData = data.newsAPIConnection.edges.map(edge => edge.node);

  const { title, date, description, tag } = newsData[currentIndex] || {};

  const renderImage = (news) => (
    <div key={news.title} className="relative">
      <img
        src={news.image ? news.image.url : 'https://via.placeholder.com/600x400'}
        alt={news.title}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        loading="lazy" // Lazy loading
      />
    </div>
  );

  const renderTags = (tags) => (
    tags?.map((tag, index) => (
      <span key={index} className="bg-[#087830] text-gray-100 text-sm rounded-full px-3 py-1">
        {tag}
      </span>
    ))
  );

  return (
    <div className="flex flex-col md:flex-row items-start max-w-6xl mx-auto p-4">
      {/* Slider */}
      <div className="w-full md:w-2/5">
        <Slider {...settings}>
          {newsData.map(renderImage)}
        </Slider>
      </div>

      {/* Info Content */}
      <div className="w-full md:w-3/5 md:ml-4 mt-4 md:mt-0 flex pt-12">
        <div className="p-4 text-black">
          <h3 className="text-3xl text-[#087830] font-bold">{title}</h3>
          <p className="mt-1 text-md text-gray-600">{date || 'Date not available'}</p>
          <div className="mt-2 flex flex-wrap justify-center space-x-2">
            {renderTags([tag])}
          </div>
          <p className="mt-4 text-justify">{description?.text || 'Description not available'}</p>
        </div>
      </div>
    </div>
  );
}

export default NewsCarousel;
