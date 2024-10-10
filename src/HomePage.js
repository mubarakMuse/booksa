import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from './supabaseClient';  // Your Supabase client setup

function HomePage() {
  const [hotels, setHotels] = useState([]);

  // Fetch hotels from the database
  useEffect(() => {
    async function fetchHotels() {
      const { data, error } = await supabase
        .from('hotels')
        .select('*');
        
      if (error) {
        console.error('Error fetching hotels:', error.message);
      } else {
        setHotels(data);
      }
    }

    fetchHotels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          {/* Hero Section */}
          <section className="text-center mb-16 py-20  rounded-lg ">
            <h2 className="text-5xl font-bold mb-6 text-gray-800">Booksa Group Bookings</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
              Simplify your group bookings by directly booking with hotels and getting exclusive rates.
            </p>
            <Link to="/hotels" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Browse Hotels
            </Link>
          </section>

          {/* How It Works Section */}
          <section className="my-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">1. Find Your Hotel</h3>
                <p className="text-gray-600">Browse our curated list of top hotels in Madina, all offering special group rates.</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">2. Submit a Request</h3>
                <p className="text-gray-600">Fill out a simple form with your group details to receive personalized offers from hotels.</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">3. Get Confirmed</h3>
                <p className="text-gray-600">Hotels will review your request and confirm your booking with the best available rates.</p>
              </div>
            </div>
          </section>

          {/* Featured Hotels Section */}
          <section className="my-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">Featured Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {hotels.slice(0, 4).map(hotel => (
                <div key={hotel.id} className="card bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition duration-300">
                  <img 
                    src={hotel.image_url} 
                    alt={hotel.name} 
                    className="rounded-lg mb-4 w-full h-40 object-cover"
                  />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}</h2>
                  <p className="text-sm text-gray-600 mb-4">{hotel.description}</p>
                  <Link to={`/hotel/${hotel.code}`} className="text-blue-600 font-semibold hover:underline">
                    Book Now →
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/hotels" className="text-blue-600 font-semibold hover:underline">
                View All Hotels →
              </Link>
            </div>
          </section>

          {/* Admin and User Section */}
          <section className="my-16">
            <h2 className="text-3xl font-semibold mb-8 text-center text-black">Manage Your Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Link for Hotel Admins */}
              <div className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-md transition duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-black">Hotel Admins</h3>
                <p className="text-gray-700">Manage all booking requests and respond to customer inquiries through your admin dashboard.</p>
                <Link to="/hotel-admin">
                  <button className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">Admin Dashboard</button>
                </Link>
              </div>

              {/* Link for Users to Track Bookings */}
              <div className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-md transition duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-black">Track Your Booking</h3>
                <p className="text-gray-700">Check the status of your booking by entering your email address and viewing your requests.</p>
                <Link to="/view-bookings">
                  <button className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">Track Booking</button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}

    </div>
  );
}

export default HomePage;
