import React from 'react';
import { format } from 'date-fns';

const EventCard = ({ event, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="bg-dark-card rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-white">{event.title}</h3>
        <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          {format(new Date(event.date), 'MMM dd')}
        </span>
      </div>
      
      {event.description && (
        <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
      )}
      
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-gray-300">{format(new Date(event.date), 'EEEE, MMM dd, yyyy')}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold text-gray-300">{event.startTime} - {event.endTime}</span>
      </div>
      
      {isAdmin && (
        <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
