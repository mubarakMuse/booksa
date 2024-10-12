import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from './supabaseClient';
import emailjs from 'emailjs-com';

function HotelBookingPage() {
  const { hotelCode } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [form, setForm] = useState({
    quadRooms: 0,
    tripleRooms: 0,
    doubleRooms: 0,
    singleRooms: 0,
    numberOfAdults: 1,
    numberOfChildren: 0,
    name: '',
    email: '',
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: '',
    country: '',
    breakfastIncluded: true,
    isBusiness: true,
    travelCompanyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestLink, setRequestLink] = useState('');

  // Fetch hotel data by hotelCode
  useEffect(() => {
    async function fetchHotelData() {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('code', hotelCode)  // Fetch hotel details based on the code, not the id
        .single(); 

      if (error) {
        console.error('Error fetching hotel data:', error.message);
      } else {
        setHotelData(data);
      }
    }

    fetchHotelData();
  }, [hotelCode]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Updated email content
  const sendEmails = (bookingDetails) => {
    const customerEmailBody = `
      Dear ${bookingDetails.name},

      Thank you for your booking request with Booksa. We have received your request for ${hotelData.name}. Here are the details:

      Check-In: ${bookingDetails.checkInDate}
      Check-Out: ${bookingDetails.checkOutDate}
      
      Room Configuration:
      - Quad Rooms (4 Beds): ${bookingDetails.quadRooms}
      - Triple Rooms (3 Beds): ${bookingDetails.tripleRooms}
      - Double Rooms (2 Beds): ${bookingDetails.doubleRooms}
      - Single Rooms (1 Bed): ${bookingDetails.singleRooms}

      Total Guests: ${bookingDetails.numberOfAdults} Adults, ${bookingDetails.numberOfChildren} Children
      Breakfast Included: ${bookingDetails.breakfastIncluded ? 'Yes' : 'No'}
      ${bookingDetails.isBusiness ? `Travel Company: ${bookingDetails.travelCompanyName}` : ''}

      You can track the status of your booking using this link:
      ${window.location.origin}/booking/${bookingDetails.bookingId}

      We will notify you once the hotel has reviewed your request.

      If you have any questions, please don't hesitate to contact us by replying to this email.

      Best regards,
      The Booksa Team
    `;

    const hotelEmailBody = `
      Dear ${hotelData.name} Admin,

      You have received a new booking request from a customer:

      Guest Name: ${bookingDetails.name}
      Email: ${bookingDetails.email}
      Phone: ${bookingDetails.phoneNumber}
      Check-In: ${bookingDetails.checkInDate}
      Check-Out: ${bookingDetails.checkOutDate}

      Room Configuration:
      - Quad Rooms (4 Beds): ${bookingDetails.quadRooms}
      - Triple Rooms (3 Beds): ${bookingDetails.tripleRooms}
      - Double Rooms (2 Beds): ${bookingDetails.doubleRooms}
      - Single Rooms (1 Bed): ${bookingDetails.singleRooms}

      Total Guests: ${bookingDetails.numberOfAdults} Adults, ${bookingDetails.numberOfChildren} Children
      Breakfast Included: ${bookingDetails.breakfastIncluded ? 'Yes' : 'No'}
      Business Booking: ${bookingDetails.isBusiness ? 'Yes' : 'No'}
      ${bookingDetails.isBusiness ? `Travel Company: ${bookingDetails.travelCompanyName}` : ''}
      Country: ${bookingDetails.country}

      Please log in to your hotel admin dashboard to view and manage this request:
      ${window.location.origin}/hotel-admin

      You can also view the booking request directly using this link:
      ${window.location.origin}/booking/${bookingDetails.bookingId}

      Best regards,
      Booksa Reservations
    `;

    // Email to customer
    const customerEmailParams = {
      to_email: bookingDetails.email,
      message: customerEmailBody,
      to_name: bookingDetails.name,
      reply_to: 'mubarak@brightertunnel.com',
      from_name: 'Booksa Reservations',
      subject: 'Booking Request Submitted',
    };

    // Email to hotel admin
    const hotelEmailParams = {
      to_email: hotelData.email,
      message: hotelEmailBody,
      to_name: `${hotelData.name} Admin`,
      reply_to: 'mubarak@brightertunnel.com',
      from_name: 'Booksa Reservations',
      subject: 'New Booking Request',
    };

    // Send email to customer
   emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      customerEmailParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    ).then((result) => {
      console.log('Email sent to customer:', result.text);
    }).catch((error) => {
      console.error('Error sending email to customer:', error.text);
    });

    // Send email to hotel admin
    emailjs.send(
      'service_z68t7kv',
      'template_1jr7eem',
      hotelEmailParams,
      '7D-QDpZH6Dfw3DdgI'
    ).then((result) => {
      console.log('Email sent to hotel admin:', result.text);
    }).catch((error) => {
      console.error('Error sending email to hotel admin:', error.text);
    });
  };

  // Handle form submission to create a booking request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .insert([{
          hotelCode,
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          checkInDate: form.checkInDate,
          checkOutDate: form.checkOutDate,
          quadRooms: form.quadRooms,
          tripleRooms: form.tripleRooms,
          doubleRooms: form.doubleRooms,
          singleRooms: form.singleRooms,
          numberOfAdults: form.numberOfAdults,
          numberOfChildren: form.numberOfChildren,
          country: form.country,
          breakfastIncluded: form.breakfastIncluded,
          isBusiness: form.isBusiness,
          travelCompanyName: form.isBusiness ? form.travelCompanyName : null,
        }]).select();
  
      if (error) {
        setErrorMessage('Error submitting booking request. Please try again.');
        console.error('Error submitting booking request:', error.message);
        return;
      }
  
      // Ensure data is not null and has at least one entry
      if (data && data.length > 0) {
        const bookingId = data[0].id;
        const bookingDetails = {
          ...form,
          hotelName: hotelData.name,
          bookingId,
          hotelEmail: hotelData.email, // Assuming you have the hotel's email
        };
  
        setRequestLink(`/booking/${bookingId}`);
        sendEmails(bookingDetails);  // Send the emails
        setSubmitted(true);  // Mark as submitted and hide the form
      } else {
        setErrorMessage('Booking request could not be created. Please try again.');
        console.error('No booking data returned from Supabase.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Error submitting booking request:', err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4 md:p-8  min-h-screen">
      {hotelData ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={hotelData.image_url} alt={hotelData.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{hotelData.name}</h1>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-yellow-500 mr-1">★</span>
                  <a href={hotelData.reviewsLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">Read Reviews</a>
                </div>
                <p className="text-gray-600 mb-4">{hotelData.description}</p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Location:</strong> {hotelData.location}</p>
                  <p><strong>Address:</strong> {hotelData.address}</p>
                  <p><strong>Phone:</strong> {hotelData.phone}</p>
                  {/* <p><strong>Email:</strong> {hotelData.email}</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Book a Stay at {hotelData.name}</h2>

                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name:</span>
                    </label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email:</span>
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">WhatsApp Phone Number:</span>
                    </label>
                    <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Country Of Residence:</span>
                    </label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} required className="input input-bordered w-full" />
                  </div>

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

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number of Adults (12+):</span>
                    </label>
                    <input type="number" name="numberOfAdults" value={form.numberOfAdults} onChange={handleChange} min="1" className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number of Children (11 or younger):</span>
                    </label>
                    <input type="number" name="numberOfChildren" value={form.numberOfChildren} onChange={handleChange} min="0" className="input input-bordered w-full" />
                  </div>
                </div>

                <div className="form-control mt-4">
                  <label className="cursor-pointer label justify-start">
                    <input type="checkbox" name="breakfastIncluded" checked={form.breakfastIncluded} onChange={handleChange} className="checkbox checkbox-primary mr-2" />
                    <span className="label-text">Include Breakfast</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Quad Rooms (4 Beds):</span>
                    </label>
                    <input type="number" name="quadRooms" value={form.quadRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Triple Rooms (3 Beds):</span>
                    </label>
                    <input type="number" name="tripleRooms" value={form.tripleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Double Rooms (2 Beds):</span>
                    </label>
                    <input type="number" name="doubleRooms" value={form.doubleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Single Rooms (1 Bed):</span>
                    </label>
                    <input type="number" name="singleRooms" value={form.singleRooms} onChange={handleChange} min="0" className="input input-bordered w-full" />
                  </div>
                </div>

                <div className="form-control mt-4">
                  <label className="cursor-pointer label justify-start">
                    <input type="checkbox" name="isBusiness" checked={form.isBusiness} onChange={handleChange} className="checkbox checkbox-primary mr-2" />
                    <span className="label-text">Is this a Business Booking?</span>
                  </label>
                </div>

                {form.isBusiness && (
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Travel Company Name (if applicable):</span>
                    </label>
                    <input type="text" name="travelCompanyName" value={form.travelCompanyName} onChange={handleChange} className="input input-bordered w-full" />
                  </div>
                )}

                <button type="submit" disabled={loading} className="bg-black text-white font-bold py-2 px-4 rounded w-full mt-6 hover:bg-gray-800 transition duration-300">
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Request Submitted!</h2>
                <p className="text-gray-600 mb-6">Thank you for choosing Booksa. We've received your booking request and will process it shortly.</p>
                <p className="text-gray-600 mb-4">You'll receive a confirmation email with further details. You can also track your booking status using the link below:</p>
                <a href={requestLink} className="inline-block bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
                  Track Your Booking
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-700">Loading hotel data...</p>
        </div>
      )}
    </div>
  );
}

export default HotelBookingPage;