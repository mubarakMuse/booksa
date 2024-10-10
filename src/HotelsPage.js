import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from './supabaseClient';

function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchHotels() {
      const { data, error } = await supabase
        .from('hotels')
        .select('*');
        
      if (error) {
        console.error('Error fetching hotels:', error.message);
      } else {
        setHotels(data);
        setFilteredHotels(data);
      }
    }

    fetchHotels();
  }, []);

  useEffect(() => {
    const filtered = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  }, [searchTerm, hotels]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <h2 className="text-3xl font-semibold mb-8 text-center">Hotels</h2>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search hotels..."
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Hotel List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHotels.map(hotel => (
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
        </div>
      </main>
    </div>
  );
}

export default HotelsPage;