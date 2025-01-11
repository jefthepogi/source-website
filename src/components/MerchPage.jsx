import React from 'react';
import HeaderBgImage from '../assets/header-bg.jpg';
import MerchPlaceholderImage from '../assets/merch.png'; // Placeholder for upcoming merch

function MerchPage() {
  return (
    <>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold">Merch</h1>
          </div>
          <div>
            <p className="max-w-md text-xl italic text-end">
              Check out our exciting upcoming merchandise!
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

      {/* Upcoming Merch Section */}
      <div className="p-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">Upcoming Merch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Placeholder for Upcoming Merch 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={MerchPlaceholderImage}
              alt="Upcoming Merch 1"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">Secret!</h3>
              <p className="text-gray-500">Coming Soon!</p>
            </div>
          </div>

          {/* Placeholder for Upcoming Merch 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={MerchPlaceholderImage}
              alt="Upcoming Merch 2"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">Secret!</h3>
              <p className="text-gray-500">Coming Soon!</p>
            </div>
          </div>

          {/* Placeholder for Upcoming Merch 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={MerchPlaceholderImage}
              alt="Upcoming Merch 3"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">Secret!</h3>
              <p className="text-gray-500">Coming Soon!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-[#087830] py-6 text-white text-center">
        <p>Stay tuned for updates on our merchandise! Exciting products are coming soon.</p>
      </div>
    </>
  );
}

export default MerchPage;
