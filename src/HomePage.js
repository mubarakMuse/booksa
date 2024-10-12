import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import supabase from './supabaseClient';  // Your Supabase client setup

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const howItWorksRef = useRef(null);
  const featuredHotelsRef = useRef(null);

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

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className=" bg-gray-100 py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-800">Simplify Group Hotel Bookings</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
             Connect directly with patrner hotels, 
              secure exclusive rates, and manage your bookings effortlessly.
            </p>
            <p className="text-md italic text-gray-600 max-w-2xl mx-auto mb-8">
              Perfect for corporate events, weddings, sports teams, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => scrollToSection(featuredHotelsRef)}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Find Hotels
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                How It Works
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-yellow-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">1. Find Your Hotel</h3>
                <p className="text-gray-600">Browse our curated list of top hotels, all offering special group rates.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">2. Submit a Request</h3>
                <p className="text-gray-600">Fill out a simple form with your group details to receive personalized offers.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">3. Get Confirmed</h3>
                <p className="text-gray-600">Hotels will review your request and confirm your booking with the best rates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Hotels Section */}
        <section ref={featuredHotelsRef} className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Featured Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {hotels.slice(0, 3).map(hotel => (
                <div key={hotel.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
                  <img 
                    src={hotel.image_url} 
                    alt={hotel.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}</h2>
                    <p className="text-gray-600 mb-4">{hotel.description}</p>
                    <Link to={`/hotel/${hotel.code}`} className="text-blue-600 font-semibold hover:underline">
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/hotels" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
                View All Hotels
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">"Booksa made organizing our company retreat a breeze. We got great rates and excellent service!"</p>
                <p className="font-semibold text-gray-800">- Sarah J., Marketing Director</p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">"I was amazed at how quickly hotels responded to our booking request. Highly recommended!"</p>
                <p className="font-semibold text-gray-800">- Mike T., Event Planner</p>
              </div>
            </div>
          </div>
        </section>

        {/* Admin and User Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Manage Your Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Link for Hotel Admins */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Hotel Admins</h3>
                <p className="text-gray-600 mb-6">Manage all booking requests and respond to customer inquiries through your admin dashboard.</p>
                <Link to="/hotel-admin" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
                  Admin Dashboard
                </Link>
              </div>

              {/* Link for Users to Track Bookings */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Track Your Booking</h3>
                <p className="text-gray-600 mb-6">Check the status of your booking by entering your email address and viewing your requests.</p>
                <Link to="/view-bookings" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
                  Track Booking
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}

export default HomePage;
