import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.jsx';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      const formattedEvents = data.data.map(event => {
        const eventDate = event.date.split('T')[0];
        const [startHour, startMin] = event.startTime.split(':');
        const [endHour, endMin] = event.endTime.split(':');
        
        const start = new Date(eventDate);
        start.setHours(parseInt(startHour), parseInt(startMin), 0);
        
        const end = new Date(eventDate);
        end.setHours(parseInt(endHour), parseInt(endMin), 0);
        
        return {
          id: event._id,
          title: event.title,
          start,
          end,
          resource: event
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = useCallback((event) => {
    if (user?.role === 'admin') {
      navigate(`/admin/events/edit/${event.id}`, { state: { event: event.resource } });
    }
  }, [user, navigate]);

  const handleSelectSlot = useCallback(({ start }) => {
    if (user?.role === 'admin') {
      navigate('/admin/events/create');
    }
  }, [user, navigate]);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Calendar View</h1>
        <p className="text-gray-400">View all events in calendar format</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700" style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable={user?.role === 'admin'}
            views={['month']}
            defaultView="month"
            toolbar={true}
            popup
            style={{ height: '100%' }}
            components={{
              toolbar: (props) => (
                <div className="rbc-toolbar">
                  <span className="rbc-btn-group">
                    <button type="button" onClick={() => props.onNavigate('PREV')}>Back</button>
                    <button type="button" onClick={() => props.onNavigate('TODAY')}>Today</button>
                    <button type="button" onClick={() => props.onNavigate('NEXT')}>Next</button>
                  </span>
                  <span className="rbc-toolbar-label">{props.label}</span>
                </div>
              )
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;
