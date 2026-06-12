const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/newsletter.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.post('/', sanitize, (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const data = read();
    if (data.find(d => d.email === email)) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }
    data.push({ id: uuidv4(), email, name, date: new Date().toISOString() });
    write(data);
    res.status(201).json({ success: true, message: 'You are now subscribed! We will notify you of new arrivals.' });
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
