import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from './supabaseClient';

function BookingRequestDetails() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      const { data: bookingData, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) {
        console.error('Error fetching booking:', error.message);
      } else {
        setBooking(bookingData);
      }
      setLoading(false);
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading booking details...</div>;
  if (!booking) return <div className="flex justify-center items-center h-screen">No booking found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking Request Details</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{booking.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Status" value={booking.status} />
            <InfoItem label="Email" value={booking.email} />
            <InfoItem label="Phone" value={booking.phoneNumber} />
            <InfoItem label="Country" value={booking.country} />
            <InfoItem label="Check-In Date" value={booking.checkInDate} />
            <InfoItem label="Check-Out Date" value={booking.checkOutDate} />
            <InfoItem label="Business Booking" value={booking.isBusiness ? 'Yes' : 'No'} />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Rooms Requested</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <RoomItem type="Quad" count={booking.quadRooms} />
              <RoomItem type="Triple" count={booking.tripleRooms} />
              <RoomItem type="Double" count={booking.doubleRooms} />
              <RoomItem type="Single" count={booking.singleRooms} />
            </div>
          </div>
          {booking.quote && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Quote</h3>
              <p className="bg-gray-100 p-3 rounded">{booking.quote}</p>
            </div>
          )}
          {booking.declineReason && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Decline Reason</h3>
              <p className="bg-gray-100 p-3 rounded">{booking.declineReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-medium text-gray-600">{label}:</span>{' '}
    <span className="text-gray-800">{value}</span>
  </div>
);

const RoomItem = ({ type, count }) => (
  <div className="bg-gray-100 p-3 rounded text-center">
    <div className="font-semibold text-gray-700">{type}</div>
    <div className="text-2xl text-gray-800">{count}</div>
  </div>
);

export default BookingRequestDetails;
