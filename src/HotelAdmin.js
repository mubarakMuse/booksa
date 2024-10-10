import React, { useState } from 'react';
import supabase from './supabaseClient';  // Supabase client setup
import { Bar } from 'react-chartjs-2';  // For rendering the chart
import 'chart.js/auto';  // Importing Chart.js
import _ from 'lodash';  // Import Lodash

function HotelAdmin() {
  const [passCode, setPassCode] = useState('');  // To store the entered code
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(null); // Track loading state for responses
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    declined: 0,
    requestsPerCountry: {},
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
   // Function to generate dynamic booking link for the hotel
   const getBookingLink = () => {
    const baseURL = window.location.origin;
    return `${baseURL}/hotel/${hotel.code}`;
  };

  // Function to copy the link to clipboard
  const copyToClipboard = () => {
    const link = getBookingLink();
    navigator.clipboard.writeText(link);
    showToast('Booking link copied to clipboard!', 'success');
  };

  // Handle form submission and validate the code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBookings([]);

    try {
      // Validate the code by checking the hotel table (assuming hotel table has a 'code' field)
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*')
        .eq('passCode', passCode)  // Check for hotel with the entered code
        .single();

      if (hotelError || !hotelData) {
        setError('Invalid PassCode. Please try again.');
      } else {
        // Fetch booking requests associated with the hotel
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('booking_requests')
          .select('*')
          .eq('hotelCode', hotelData.code);  // Get bookings for this hotel

        if (bookingsError) {
          setError('Error fetching booking requests.');
        } else {
          setBookings(bookingsData);
          setHotel(hotelData);
          calculateStats(bookingsData);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate stats (confirmed, declined, pending, requests per country)
  const calculateStats = (bookingsData) => {
    const stats = {
      pending: 0,
      confirmed: 0,
      declined: 0,
      requestsPerCountry: {},
    };

    bookingsData.forEach((booking) => {
      if (booking.status === 'pending') stats.pending++;
      else if (booking.status === 'confirmed') stats.confirmed++;
      else if (booking.status === 'declined') stats.declined++;

      // Count requests per country
      const country = booking.country || 'Unknown';
      if (stats.requestsPerCountry[country]) {
        stats.requestsPerCountry[country]++;
      } else {
        stats.requestsPerCountry[country] = 1;
      }
    });

    setStats(stats);
  };

  const respondToBooking = async (bookingId, action) => {
    setResponseLoading(bookingId);
    const reasonOrQuote = prompt(
      action === 'confirm' ? 'Enter your quote for the booking:' : 'Enter the reason for declining:'
    );

    if (reasonOrQuote) {
      const updateData = action === 'confirm' 
        ? { status: 'confirmed', quote: reasonOrQuote } 
        : { status: 'declined', declineReason: reasonOrQuote };

      const { error } = await supabase
        .from('booking_requests')
        .update(updateData)
        .eq('id', bookingId);

      if (error) {
        showToast('Error updating booking request.', 'error');
      } else {
        showToast('Booking request updated successfully!', 'success');
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, ...updateData } : booking
          )
        );
        calculateStats(bookings);  // Recalculate stats
      }
    }
    setResponseLoading(null);  // Reset loading state
  };

  // Generate data for the requests per country graph
  const getGraphData = () => {
    const sortedCountries = _.sortBy(
      Object.entries(stats.requestsPerCountry),
      ([, count]) => -count
    );

    return {
      labels: sortedCountries.map(([country]) => _.startCase(country)),
      datasets: [
        {
          label: 'Requests per Country',
          data: sortedCountries.map(([, count]) => count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Updated function to show toast notifications
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const renderBookingCard = (booking, statusColor) => (
    <li key={booking.id} className="bg-white shadow-lg p-6 rounded-lg border-l-4 border-l-blue-600 hover:shadow-xl transition-shadow duration-300">
      <div className="space-y-2">
        <p className="text-lg font-semibold">{booking.name} <span className="text-sm font-normal text-gray-600">({booking.email})</span></p>
        <p className="text-sm"><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{booking.status}</span></p>
        <p className="text-sm"><strong>Check-In:</strong> {booking.checkInDate}</p>
        <p className="text-sm"><strong>Check-Out:</strong> {booking.checkOutDate}</p>
        <p className="text-sm"><strong>Rooms:</strong> Quad: {booking.quadRooms}, Triple: {booking.tripleRooms}, Double: {booking.doubleRooms}, Single: {booking.singleRooms}</p>
        {booking.status === 'pending' && (
          <div className="flex space-x-2 mt-4">
            <button 
              className="btn btn-sm bg-green-500 hover:bg-green-600 text-white" 
              onClick={() => respondToBooking(booking.id, 'confirm')}
              disabled={responseLoading === booking.id}
            >
              {responseLoading === booking.id ? 'Confirming...' : 'Confirm'}
            </button>
            <button 
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white" 
              onClick={() => respondToBooking(booking.id, 'decline')}
              disabled={responseLoading === booking.id}
            >
              {responseLoading === booking.id ? 'Declining...' : 'Decline'}
            </button>
          </div>
        )}
      </div>
    </li>
  );

  return (
    <div className=" mx-auto p-5 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-black-800">Hotel Admin Dashboard</h1>

      {!hotel && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Enter your access code:</span>
              </label>
              <input 
                type="text" 
                value={passCode} 
                onChange={(e) => setPassCode(e.target.value)} 
                required 
                className="input input-bordered w-full text-lg" 
              />
            </div>

            <button type="submit" disabled={loading} className="btn w-full text-lg bg-gray-800 hover:bg-gray-900 text-white">
              {loading ? 'Checking...' : 'Enter'}
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      )}

      {hotel && (
        <>
          <h1 className="text-3xl text-center font-bold mb-8 text-blue-800">{hotel.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg text-center shadow-lg">
              <h2 className="text-3xl font-bold text-blue-800">{stats.confirmed}</h2>
              <p className="text-lg text-blue-600">Confirmed Requests</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg text-center shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-800">{stats.pending}</h2>
              <p className="text-lg text-yellow-600">Pending Requests</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center shadow-lg">
              <h2 className="text-3xl font-bold text-red-800">{stats.declined}</h2>
              <p className="text-lg text-red-600">Declined Requests</p>
            </div>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Share Booking Link</h2>
            <button className="btn  text-lg" onClick={copyToClipboard}>Copy Booking Link</button>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Requests per Country</h2>
            <div className="w-full" style={{ height: '400px' }}>
              <Bar 
                data={getGraphData()} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="space-y-8">
            {['pending', 'confirmed', 'declined'].map((status) => (
              <div key={status} className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className={`text-2xl font-semibold mb-4 ${
                  status === 'pending' ? 'text-yellow-600' :
                  status === 'confirmed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {_.startCase(status)} Requests
                </h3>
                <ul className="space-y-4">
                  {bookings.filter(booking => booking.status === status).map((booking) => (
                    renderBookingCard(booking, `bg-${
                      status === 'pending' ? 'yellow' :
                      status === 'confirmed' ? 'green' : 'red'
                    }-100 text-${
                      status === 'pending' ? 'yellow' :
                      status === 'confirmed' ? 'green' : 'red'
                    }-800`)
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {toast.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default HotelAdmin;