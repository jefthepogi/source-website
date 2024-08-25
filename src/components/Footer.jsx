import React from 'react';

function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content padding">
      <div className="text-center w-full">
        <p>&copy; {new Date().getFullYear()} SOURCE. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
