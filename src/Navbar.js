import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Add this import

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center hover:text-blue-600 transition duration-300">
            <img src={logo} alt="Booksa Logo" className="h-8 mr-2" />
            <span className="text-2xl font-bold">Booksa</span>
          </Link>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex">
            <Link to="/view-bookings" className="mr-4 hover:text-blue-600 transition duration-300">Track Booking</Link>
            <Link to="/hotel-admin" className="hover:text-blue-600 transition duration-300">Hotel Admins</Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <Link to="/view-bookings" className="block py-2 hover:text-blue-600 transition duration-300">Track Booking</Link>
            <Link to="/hotel-admin" className="block py-2 hover:text-blue-600 transition duration-300">Hotel Admins</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
