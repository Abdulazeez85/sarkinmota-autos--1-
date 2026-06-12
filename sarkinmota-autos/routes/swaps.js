const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/swaps.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.post('/', sanitize, (req, res) => {
  try {
    const { name, phone, email, car_make, car_model, car_year, mileage, condition, asking_price, notes, target_car } = req.body;
    if (!name || !phone || !car_make) return res.status(400).json({ error: 'Name, phone, and car make required' });
    const data = read();
    const swap = {
      id: 'swap_' + uuidv4().slice(0, 8),
      name, phone, email, car_make, car_model, car_year, mileage, condition, asking_price, notes, target_car,
      status: 'Pending Review',
      date_submitted: new Date().toISOString()
    };
    data.unshift(swap);
    write(data);
    res.status(201).json({ success: true, message: 'Swap request submitted! We will evaluate and contact you within 24 hours.' });
  } catch { res.status(500).json({ error: 'Server error' }); }
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
  try { write(read().filter(d => d.id !== req.params.id)); res.json({ success: true }); }
  catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
