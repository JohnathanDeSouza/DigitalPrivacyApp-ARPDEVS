import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white w-full py-6 mt-8">
      <div className="max-w-7xl mx-auto text-center px-4">
        <p className="text-sm text-gray-300">
          &copy; {currentYear} SafeNet. All Rights Reserved.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Created by ARP Devs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;