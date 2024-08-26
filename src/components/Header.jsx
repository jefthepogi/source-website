import React from 'react';
import HeaderBgImage from '../assets/header-bg.jpg'; // Path to your header background image

function Header() {
  return (
    <div
      className="relative w-full"
      style={{
        height: '400px', // Adjust this to the actual height of your image or a suitable value
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeaderBgImage})`,
          height: '100%',
          width: '100%',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#014018', // Overlay color
            opacity: 0.6, // Adjust opacity as needed
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center text-left text-white padding">
          <h1 className="text-5xl font-bold">Welcome to #LSU-SOURCE</h1>
          <p className="py-6 italic max-w-2xl">An academic-based organization in CCSEA, La Salle University - Ozamiz that focuses on the promotion of ICT in the community.</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
