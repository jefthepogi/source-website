import React from 'react';
import HeaderBgImage from '../assets/header-bg.jpg';

function ContactsPage () {
  return (
    <>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center"> 
          <div>
            <h1 className="text-6xl font-bold">Contacts</h1>
          </div>
          <div>
            <p className="max-w-md text-xl italic text-end">
              Let us know about your concerns!
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
      <div className="p-20">
        <p className="text-center font-bold">We are working on it...</p>
      </div>
    </>
  );
}

export default ContactsPage;
