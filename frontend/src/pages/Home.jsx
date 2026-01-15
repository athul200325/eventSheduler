import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../services/api';
import EventCard from '../components/EventCard.jsx';
import { toast } from 'react-toastify';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events?date=${selectedDate}`);
      setEvents(data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Upcoming Events</h1>
        <p className="text-gray-400">Browse and discover events happening around you</p>
      </div>

      <div className="border-2 border-primary rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="text-lg font-semibold text-gray-300">Select Date:</label>
          </div>
          <input
            style={{backgroundColor: '#2A2A2A'}}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} isAdmin={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Events Found</h3>
          <p className="text-gray-500">No events scheduled for this date.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
