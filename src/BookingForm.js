import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import Select from 'react-select';

function BookingForm() {
  const [form, setForm] = useState({
    quadRooms: 0,
    tripleRooms: 0,
    doubleRooms: 0,
    singleRooms: 0,
    name: '',
    isBusiness: false,
    email: '',
    phoneNumber: '',
    country: '',
    checkInDate: '',
    checkOutDate: '',
    hotelIds: []
  });

  const [hotels, setHotels] = useState([]); // To store available hotels
  const [loading, setLoading] = useState(false);

  // Fetch hotels from Supabase on component mount
  useEffect(() => {
    async function fetchHotels() {
      const { data: hotelList, error } = await supabase
        .from('hotels')
        .select('id, name');

      if (error) {
        console.error('Error fetching hotels:', error.message);
      } else {
        setHotels(hotelList);
      }
    }

    fetchHotels();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle hotel selection (multi-select)
  const handleHotelChange = (selectedOptions) => {
    const hotelIds = selectedOptions.map((option) => option.value);
    setForm((prevForm) => ({ ...prevForm, hotelIds }));
  };

  // Handle form submission to create requests for each hotel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Iterate through each selected hotel and create a separate request
      for (const hotelId of form.hotelIds) {
        const { error } = await supabase
          .from('booking_requests')
          .insert([
            {
              hotelId,
              name: form.name,
              email: form.email,
              phoneNumber: form.phoneNumber,
              country: form.country,
              checkInDate: form.checkInDate,
              checkOutDate: form.checkOutDate,
              quadRooms: form.quadRooms,
              tripleRooms: form.tripleRooms,
              doubleRooms: form.doubleRooms,
              singleRooms: form.singleRooms,
              isBusiness: form.isBusiness
            }
          ]);

        if (error) {
          console.error(`Error submitting request for hotel ${hotelId}:`, error.message);
        }
      }

      alert('Booking requests submitted successfully!');
    } catch (err) {
      console.error('Error creating booking requests:', err.message);
      alert('Error submitting booking requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form max-w-xl mx-auto p-5 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Create a Group Booking Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Business Booking:</span> 
            <input type="checkbox" name="isBusiness" checked={form.isBusiness} onChange={handleChange} className="toggle toggle-primary ml-2" />
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email:</span>
          </label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number:</span>
          </label>
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="input input-bordered w-full" />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country:</span>
          </label>
          <input type="text" name="country" value={form.country} onChange={handleChange} required className="input input-bordered w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Check-In Date:</span>
            </label>
            <input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} required className="input input-bordered w-full" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Check-Out Date:</span>
            </label>
            <input type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Quad Rooms:</span>
            </label>
            <input type="number" name="quadRooms" value={form.quadRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Triple Rooms:</span>
            </label>
            <input type="number" name="tripleRooms" value={form.tripleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Double Rooms:</span>
            </label>
            <input type="number" name="doubleRooms" value={form.doubleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Single Rooms:</span>
            </label>
            <input type="number" name="singleRooms" value={form.singleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Hotels:</span>
          </label>
          <Select
            isMulti
            options={hotels.map((hotel) => ({ value: hotel.id, label: hotel.name }))}
            onChange={handleHotelChange}
            className="w-full"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
