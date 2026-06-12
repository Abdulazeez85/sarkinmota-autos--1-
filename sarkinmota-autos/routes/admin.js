const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

// Admin login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin dashboard stats
router.get('/stats', auth, (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    const cars = JSON.parse(fs.readFileSync(path.join(dataDir, 'cars.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(dataDir, 'bookings.json'), 'utf8'));
    const enquiries = JSON.parse(fs.readFileSync(path.join(dataDir, 'enquiries.json'), 'utf8'));
    const preorders = JSON.parse(fs.readFileSync(path.join(dataDir, 'preorders.json'), 'utf8'));
    const swaps = JSON.parse(fs.readFileSync(path.join(dataDir, 'swaps.json'), 'utf8'));
    const newsletter = JSON.parse(fs.readFileSync(path.join(dataDir, 'newsletter.json'), 'utf8'));
    const news = JSON.parse(fs.readFileSync(path.join(dataDir, 'news.json'), 'utf8'));

    res.json({
      total_cars: cars.length,
      available_cars: cars.filter(c => c.status === 'Available').length,
      sold_cars: cars.filter(c => c.status === 'Sold').length,
      total_bookings: bookings.length,
      pending_bookings: bookings.filter(b => b.status === 'Pending').length,
      total_enquiries: enquiries.length,
      new_enquiries: enquiries.filter(e => e.status === 'New').length,
      total_preorders: preorders.length,
      total_swaps: swaps.length,
      pending_swaps: swaps.filter(s => s.status === 'Pending Review').length,
      newsletter_subscribers: newsletter.length,
      total_news: news.length,
      total_views: cars.reduce((sum, c) => sum + (c.views || 0), 0),
      most_viewed: [...cars].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3).map(c => ({ id: c.id, name: c.name, views: c.views || 0 })),
      most_enquired: [...cars].sort((a, b) => (b.enquiries || 0) - (a.enquiries || 0)).slice(0, 3).map(c => ({ id: c.id, name: c.name, enquiries: c.enquiries || 0 }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
