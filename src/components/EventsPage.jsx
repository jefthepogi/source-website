import React from 'react';
import HeaderBgImage from '../assets/header-bg.jpg';

function EventsPage () {
  return (
    <>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold">Events</h1>
            <p className='px-1'>A.Y. 2024 - 2025</p>
          </div>
          <div>
            <p className="max-w-md text-xl italic text-end">
              A dedicated team working towards the advancement of ICT.
            </p>
          </div>
        </div>
      </div>

      {/* Background Image Section */}
      <div className="relative w-full" style={{ height: '400px' }}>
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
              backgroundColor: '#014018',
              opacity: 0.6,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default EventsPage;
