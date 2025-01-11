import React, { useState } from 'react';
import HeaderBgImage from '../assets/header-bg.jpg'; // Path to your header background image

function Header() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="relative w-full"
      style={{
        height: '400px', // Adjust this to the actual height of your image or a suitable value
      }}
    >
      <img
        src={HeaderBgImage}
        alt="Header background"
        className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#014018', // Overlay color
          opacity: 0.6, // Adjust opacity as needed
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center text-left text-white padding">
        <h1 className="text-5xl font-bold">Welcome to #LSU-SOURCE</h1>
        <p className="py-6 italic max-w-2xl">
          An academic-based organization in CCSEA, La Salle University - Ozamiz that focuses on the promotion of ICT in the community.
        </p>
      </div>
    </div>
  );
}

export default Header;
