require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
//const rateLimit = require('express-rate-limit');

const carsRouter = require('./routes/cars');
const bookingsRouter = require('./routes/bookings');
const enquiriesRouter = require('./routes/enquiries');
const preordersRouter = require('./routes/preorders');
const swapsRouter = require('./routes/swaps');
const newsletterRouter = require('./routes/newsletter');
const newsRouter = require('./routes/news');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

/* Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
}); 

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many submissions, please try again later.' }
});
*/
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
//app.use(limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API Routes
app.use('/api/cars', carsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/enquiries',enquiriesRouter);
app.use('/api/preorders', preordersRouter);
app.use('/api/swaps', swapsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/news', newsRouter);
app.use('/api/admin', adminRouter);

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin login
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`\n🚗 Sarkinmota Autos Server Running`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🛠️  Admin: http://localhost:${PORT}/admin\n`);
});
