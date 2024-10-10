import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-gray-100 text-black py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition duration-300">Booksa</Link>
        <nav>
          <Link to="/view-bookings" className="mr-4">Track Booking</Link>
          <Link to="/hotel-admin" className="mr-4">Hotel Admins</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
