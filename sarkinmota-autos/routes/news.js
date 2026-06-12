const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const sanitize = require('../middleware/sanitize');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/news.json');
const read = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const write = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  try { res.json(read()); } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:slug', (req, res) => {
  try {
    const article = read().find(n => n.slug === req.params.slug || n.id === req.params.slug);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', auth, sanitize, (req, res) => {
  try {
    const data = read();
    const article = {
      id: 'news_' + uuidv4().slice(0, 8),
      ...req.body,
      date: new Date().toISOString()
    };
    data.unshift(article);
    write(data);
    res.status(201).json({ success: true, article });
  } catch { res.status(500).json({ error: 'Server error' }); }
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
