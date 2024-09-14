import React from 'react';
import SOURCELogo from '../assets/source-logo-minimal-white.png';
import LSULogo from '../assets/LSU-STAR-LOGO-whit.png';

function Navbar() {
  return (
    <div className="navbar bg-[#087830] text-white padding h-20 sticky top-0 z-20">
      <div className="navbar-start">
        <a href="/" className="flex items-center space-x-2">
          <img src={SOURCELogo} alt="SOURCE Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold">SOURCE</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/" className="text-white font-bold">HOME</a></li>
          <li><a href="/officers" className="text-white font-bold">OFFICERS</a></li>
          <li><a href="/events" className="text-white font-bold">EVENTS</a></li>
          <li><a href="/contacts" className="text-white font-bold">CONTACTS</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a
            href="https://lsu.edu.ph/"
            className="btn btn-ghost	bg-[#087830] flex items-center item-center hover:bg-[#086329] transition-colors"
            >
            <img src={LSULogo} alt="Icon" className="h-8"/>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
