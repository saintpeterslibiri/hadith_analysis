import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold hover:underline">
          <Link to="/" className="flex items-center space-x-2">
            <span>HadisHub</span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/hadiths"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/hadiths') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Hadiths
          </Link>
          <Link
            to="/ravis"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/ravis') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Ravis
          </Link>
          <Link
            to="/charts"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/charts') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Charts
          </Link>
          <Link
            to="/analysis"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/analysis') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Analysis
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-4">
          <Link
            to="/hadiths"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/hadiths') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Hadiths
          </Link>
          <Link
            to="/ravis"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/ravis') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Ravis
          </Link>
          <Link
            to="/charts"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/charts') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Charts
          </Link>
          <Link
            to="/analysis"
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${isActive('/analysis') ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
          >
            Analysis
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
