const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { eventValidation } = require('../utils/validators');

router.post('/', protect, authorize('admin'), eventValidation, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', protect, authorize('admin'), eventValidation, updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
