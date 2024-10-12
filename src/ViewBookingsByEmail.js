import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

function ViewBookingsByEmail() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHotels() {
      const { data: hotelsData, error } = await supabase
        .from('hotels')
        .select('code, name');

      if (error) {
        console.error('Error fetching hotels:', error.message);
      } else {
        const hotelMap = Object.fromEntries(hotelsData.map(hotel => [hotel.code, hotel.name]));
        setHotels(hotelMap);
        console.log(hotelMap);
      }
    }

    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBookings([]);

    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('email', email.trim().toLowerCase());

      if (error) throw error;
      setBookings(data);
      if (data.length === 0) {
        setError('No booking requests found for this email.');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
      setError('An error occurred while fetching your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="mx-auto p-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Track Booking Requests</h1>

      <form onSubmit={handleSubmit} className=" bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mb-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition"
          />
          <button 
            type="submit" 
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'View Bookings'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bookings.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Booking Requests</h2>
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{hotels[booking.hotelCode] || 'Unknown Hotel'}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status || 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <p><span className="font-semibold">Check-In:</span> {booking.checkInDate}</p>
                  <p><span className="font-semibold">Check-Out:</span> {booking.checkOutDate}</p>
                  <p><span className="font-semibold">Rooms:</span> Quad: {booking.quadRooms}, Triple: {booking.tripleRooms}, Double: {booking.doubleRooms}, Single: {booking.singleRooms}</p>
                  {booking.status === 'confirmed' && (
                    <p><span className="font-semibold">Confirmation Quote:</span> {booking.quote}</p>
                  )}
                  {booking.status === 'declined' && (
                    <p><span className="font-semibold">Decline Reason:</span> {booking.declineReason}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewBookingsByEmail;
