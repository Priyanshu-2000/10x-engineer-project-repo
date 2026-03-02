import React from 'react';

/**
 * Application header component with logo and navigation links.
 *
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */
const Header = () => {
  return (
    <header className="bg-blue-600 text-white px-4 py-2 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          PromptLab
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
