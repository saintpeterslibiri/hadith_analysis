import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-100 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white "><Link to="/">HadisHub</Link></div>
        <div className="flex space-x-4">
          <Link to="/hadiths" className="hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white">Hadiths</Link>
          <Link to="/ravis" className="hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white">Ravis</Link>
          <Link to="/analysis" className="hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white">Charts</Link>
          <Link to="/ravimap" className="hover:underline px-4 py-2 text-sm bg-dark-blue rounded-full text-white">Similar Hadiths</Link>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;