import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.event) {
      const event = location.state.event;
      setFormData({
        title: event.title,
        description: event.description || '',
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        startTime: event.startTime,
        endTime: event.endTime
      });
    } else {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      const event = data.data;
      setFormData({
        title: event.title,
        description: event.description || '',
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        startTime: event.startTime,
        endTime: event.endTime
      });
    } catch (error) {
      toast.error('Failed to fetch event');
      navigate('/admin/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/events/${id}`, formData);
      toast.success('Event updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div style={{borderColor: '#4CD1D6'}} className="bg-dark-lighter rounded-2xl shadow-xl p-8 border-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Edit Event</h2>
          <p className="text-gray-400">Update event details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Event Title *</label>
            <input
              style={{backgroundColor: '#2A2A2A'}}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="100"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              style={{backgroundColor: '#2A2A2A'}}
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength="500"
              rows="4"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
              placeholder="Enter event description (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Date *</label>
            <input
              style={{backgroundColor: '#2A2A2A'}}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Start Time *</label>
              <input
                style={{backgroundColor: '#2A2A2A'}}
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">End Time *</label>
              <input
                style={{backgroundColor: '#2A2A2A'}}
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 border-2 border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
