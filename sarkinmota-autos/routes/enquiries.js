const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/enquiries.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.post('/', sanitize, (req, res) => {
  try {
    const { name, phone, email, car_id, car_name, message, source } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    const enquiries = read();
    const enquiry = {
      id: 'enq_' + uuidv4().slice(0, 8),
      name, phone, email, car_id, car_name, message,
      source: source || 'website',
      status: 'New',
      date_submitted: new Date().toISOString()
    };
    enquiries.unshift(enquiry);
    write(enquiries);

    // increment car enquiry count
    if (car_id) {
      try {
        const carsFile = path.join(__dirname, '../data/cars.json');
        const cars = JSON.parse(fs.readFileSync(carsFile, 'utf8'));
        const idx = cars.findIndex(c => c.id === car_id);
        if (idx !== -1) {
          cars[idx].enquiries = (cars[idx].enquiries || 0) + 1;
          fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));
        }
      } catch {}
    }

    res.status(201).json({ success: true, message: 'Enquiry received! We will contact you shortly.', id: enquiry.id });
  } catch {
    res.status(500).json({ error: 'Could not save enquiry' });
  }
});

router.get('/', auth, (req, res) => {
  try { res.json(read()); } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', auth, sanitize, (req, res) => {
  try {
    const data = read();
    const idx = data.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    data[idx] = { ...data[idx], ...req.body };
    write(data);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, (req, res) => {
  try {
    write(read().filter(d => d.id !== req.params.id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
