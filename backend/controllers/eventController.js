const Event = require('../models/Event');
const { validationResult } = require('express-validator');

const checkOverlap = (newStart, newEnd, existingStart, existingEnd) => {
  return newStart < existingEnd && newEnd > existingStart;
};

exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, date, startTime, endTime } = req.body;

    if (endTime <= startTime) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    const existingEvents = await Event.find({ date: eventDate });

    for (let event of existingEvents) {
      if (checkOverlap(startTime, endTime, event.startTime, event.endTime)) {
        return res.status(400).json({ success: false, message: 'Time slot already booked' });
      }
    }

    const event = await Event.create({
      title,
      description,
      date: eventDate,
      startTime,
      endTime,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const eventDate = new Date(date);
      eventDate.setHours(0, 0, 0, 0);
      query.date = eventDate;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, date, startTime, endTime } = req.body;

    if (endTime <= startTime) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    const existingEvents = await Event.find({
      date: eventDate,
      _id: { $ne: req.params.id }
    });

    for (let event of existingEvents) {
      if (checkOverlap(startTime, endTime, event.startTime, event.endTime)) {
        return res.status(400).json({ success: false, message: 'Time slot already booked' });
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date: eventDate, startTime, endTime },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
