import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import supabase from './supabaseClient';

function HotelBookings() {
  const { hotelId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirm a booking request with a quote
  const confirmBooking = async (bookingId) => {
    const quote = prompt('Enter your quote for the booking:');
  
    if (quote) {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'confirmed', quote })
        .eq('id', bookingId);
  
      if (error) {
        console.error('Error confirming booking:', error.message);
      } else {
        alert('Booking confirmed with a quote!');
        window.location.reload();
      }
    }
  };
  
  // Decline a booking request with a reason
  const declineBooking = async (bookingId) => {
    const reason = prompt('Enter the reason for declining the booking:');
  
    if (reason) {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'declined', declineReason: reason })
        .eq('id', bookingId);
  
      if (error) {
        console.error('Error declining booking:', error.message);
      } else {
        alert('Booking request declined.');
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    async function fetchBookings() {
      const { data: bookingsData, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('hotelId', hotelId);
  
      if (error) {
        console.error('Error fetching bookings:', error.message);
      } else {
        setBookings(bookingsData);
      }
      setLoading(false);
    }

    fetchBookings();
  }, [hotelId]);

  if (loading) {
    return <p className="text-center">Loading booking requests...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center">No booking requests for this hotel yet.</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-4">Booking Requests for Hotel {hotelId}</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <li key={booking.id} className="card shadow-lg bg-white p-4">
            <p className="font-bold">Requester: {booking.name}</p>
            <p>Status: <span className={`badge ${booking.status === 'pending' ? 'badge-warning' : booking.status === 'confirmed' ? 'badge-success' : 'badge-error'}`}>{booking.status}</span></p>
            <p>Quote: {booking.quote || 'N/A'}</p>
            <p>Decline Reason: {booking.declineReason || 'N/A'}</p>
            <p>Email: {booking.email}</p>
            <p>Phone: {booking.phoneNumber}</p>
            <p>Country: {booking.country}</p>
            <p>Check-In Date: {booking.checkInDate}</p>
            <p>Check-Out Date: {booking.checkOutDate}</p>
            <p>Rooms: Quad: {booking.quadRooms}, Triple: {booking.tripleRooms}, Double: {booking.doubleRooms}, Single: {booking.singleRooms}</p>
            <p>Business Booking: {booking.isBusiness ? 'Yes' : 'No'}</p>


            {booking.status === 'pending' && (
              <div className="flex gap-4 mt-4">
                <button className="btn btn-success" onClick={() => confirmBooking(booking.id)}>Confirm</button>
                <button className="btn btn-error" onClick={() => declineBooking(booking.id)}>Decline</button>
              </div>
            )}
                        <Link to={`/booking/${booking.id}`} className="btn btn-primary mt-4">View Details</Link>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default HotelBookings;
