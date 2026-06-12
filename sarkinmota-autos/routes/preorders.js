const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/preorders.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.post('/', sanitize, (req, res) => {
  try {
    const { name, phone, email, car_name, brand, budget, deposit, notes } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    const data = read();
    const preorder = {
      id: 'pre_' + uuidv4().slice(0, 8),
      name, phone, email, car_name, brand, budget, deposit, notes,
      status: 'Pending',
      date_submitted: new Date().toISOString()
    };
    data.unshift(preorder);
    write(data);
    res.status(201).json({ success: true, message: 'Pre-order received! Our team will contact you within 24 hours.' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/', auth, (req, res) => {
  try { res.json(read()); } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, (req, res) => {
  try { write(read().filter(d => d.id !== req.params.id)); res.json({ success: true }); }
  catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
