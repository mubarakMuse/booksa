import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Booksa</h3>
            <p>Directly book with hotels for your group trips.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/view-bookings" className="hover:underline">Track Booking</Link></li>
              <li><Link to="/hotel-admin" className="hover:underline">Hotel Admins</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: Mubarak@Brightetunnel.com</p>
            <p>Phone: +1 (765) 351-1316</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Booksa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
