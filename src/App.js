import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingRequestDetails from './BookingRequestDetails';
import HotelAdmin from './HotelAdmin';  // New component
import HomePage from './HomePage';
import ViewBookingsByEmail from './ViewBookingsByEmail';
import HotelBookingPage from './HotelBookingPage';
import HotelsPage from './HotelsPage';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/view-bookings" element={<ViewBookingsByEmail />} />
            <Route path="/hotel/:hotelCode" element={<HotelBookingPage />} />
            <Route path="/booking/:bookingId" element={<BookingRequestDetails />} />
            <Route path="/hotel-admin" element={<HotelAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
