const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/bookings.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// POST new booking (public)
router.post('/', sanitize, (req, res) => {
  try {
    const { name, phone, email, car_id, car_name, date, time, message } = req.body;
    if (!name || !phone || !car_name || !date) {
      return res.status(400).json({ error: 'Name, phone, car, and date are required' });
    }
    const bookings = read();
    const booking = {
      id: 'book_' + uuidv4().slice(0, 8),
      name, phone, email, car_id, car_name, date, time, message,
      status: 'Pending',
      date_submitted: new Date().toISOString()
    };
    bookings.unshift(booking);
    write(bookings);
    res.status(201).json({ success: true, message: 'Test drive booked! We will contact you to confirm.', id: booking.id });
  } catch {
    res.status(500).json({ error: 'Could not save booking' });
  }
});

// GET all bookings (admin)
router.get('/', auth, (req, res) => {
  try { res.json(read()); } catch { res.status(500).json({ error: 'Server error' }); }
});

// PUT update booking status (admin)
router.put('/:id', auth, sanitize, (req, res) => {
  try {
    const bookings = read();
    const idx = bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings[idx] = { ...bookings[idx], ...req.body };
    write(bookings);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE booking (admin)
router.delete('/:id', auth, (req, res) => {
  try {
    let bookings = read();
    bookings = bookings.filter(b => b.id !== req.params.id);
    write(bookings);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
