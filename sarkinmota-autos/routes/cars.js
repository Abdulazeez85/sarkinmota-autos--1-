const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/cars.json');

const readCars = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeCars = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all cars (public)
router.get('/', (req, res) => {
  try {
    let cars = readCars();
    const { type, brand, status, min_price, max_price, sort, search, condition } = req.query;

    if (type) cars = cars.filter(c => c.type === type);
    if (brand) cars = cars.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
    if (status) cars = cars.filter(c => c.status === status);
    if (condition) cars = cars.filter(c => c.condition === condition);
    if (min_price) cars = cars.filter(c => c.price_ngn >= Number(min_price));
    if (max_price) cars = cars.filter(c => c.price_ngn <= Number(max_price));
    if (search) {
      const q = search.toLowerCase();
      cars = cars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') cars.sort((a, b) => a.price_ngn - b.price_ngn);
    else if (sort === 'price_desc') cars.sort((a, b) => b.price_ngn - a.price_ngn);
    else if (sort === 'newest') cars.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
    else if (sort === 'brand') cars.sort((a, b) => a.brand.localeCompare(b.brand));
    else cars.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Could not load inventory' });
  }
});

// GET featured cars (public)
router.get('/featured', (req, res) => {
  try {
    const cars = readCars().filter(c => c.featured && c.status !== 'Sold');
    res.json(cars);
  } catch {
    res.status(500).json({ error: 'Could not load featured cars' });
  }
});

// GET car of the month (public)
router.get('/car-of-month', (req, res) => {
  try {
    const car = readCars().find(c => c.car_of_month);
    if (!car) return res.status(404).json({ error: 'No car of the month set' });
    res.json(car);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET recently sold (public)
router.get('/sold', (req, res) => {
  try {
    const cars = readCars().filter(c => c.status === 'Sold');
    res.json(cars);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET brands list (public)
router.get('/brands', (req, res) => {
  try {
    const cars = readCars();
    const brands = [...new Set(cars.map(c => c.brand))].sort();
    res.json(brands);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single car (public) — increment view count
router.get('/:id', (req, res) => {
  try {
    const cars = readCars();
    const idx = cars.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Car not found' });
    cars[idx].views = (cars[idx].views || 0) + 1;
    writeCars(cars);
    res.json(cars[idx]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add car (admin only)
router.post('/', auth, sanitize, (req, res) => {
  try {
    const cars = readCars();
    const newCar = {
      id: 'car_' + uuidv4().slice(0, 8),
      ...req.body,
      views: 0,
      enquiries: 0,
      date_added: new Date().toISOString()
    };
    cars.unshift(newCar);
    writeCars(cars);
    res.status(201).json({ success: true, car: newCar });
  } catch {
    res.status(500).json({ error: 'Could not add car' });
  }
});

// PUT update car (admin only)
router.put('/:id', auth, sanitize, (req, res) => {
  try {
    const cars = readCars();
    const idx = cars.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Car not found' });
    cars[idx] = { ...cars[idx], ...req.body };
    writeCars(cars);
    res.json({ success: true, car: cars[idx] });
  } catch {
    res.status(500).json({ error: 'Could not update car' });
  }
});

// DELETE car (admin only)
router.delete('/:id', auth, (req, res) => {
  try {
    let cars = readCars();
    const idx = cars.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Car not found' });
    cars.splice(idx, 1);
    writeCars(cars);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Could not delete car' });
  }
});

module.exports = router;
