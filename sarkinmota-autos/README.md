# 🚗 Sarkinmota Autos — Premium Luxury Car Dealership Platform

> Built by **The Quantum Developer**

A production-ready, full-stack luxury car dealership web application for **Sarkinmota Autos**, Nigeria's premier luxury vehicle dealer based in Abuja.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js + Express.js |
| Database | JSON file-based storage |
| Fonts | Barlow Condensed + Inter (Google Fonts) |
| Deployment | Render / Railway (backend) + Vercel (frontend optional) |

---

## 📁 Project Structure

```
sarkinmota-autos/
├── server.js              # Express server entry point
├── .env                   # Environment variables (never commit)
├── .env.example           # Environment variable template
├── package.json
│
├── data/                  # JSON databases
│   ├── cars.json
│   ├── bookings.json
│   ├── enquiries.json
│   ├── preorders.json
│   ├── swaps.json
│   ├── newsletter.json
│   ├── news.json
│   └── reviews.json
│
├── routes/                # Express API routes
│   ├── cars.js
│   ├── bookings.js
│   ├── enquiries.js
│   ├── preorders.js
│   ├── swaps.js
│   ├── newsletter.js
│   ├── news.js
│   └── admin.js
│
├── middleware/
│   ├── auth.js            # Admin authentication
│   └── sanitize.js        # Input sanitization
│
├── public/                # Frontend (served as static files)
│   ├── index.html         # Homepage
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── pages/             # Inner pages
│   └── assets/            # Images, icons
│
└── admin/                 # Admin dashboard
    ├── login.html
    ├── css/
    ├── js/
    └── pages/
```

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js v18 or higher
- npm v9 or higher

Check versions:
```bash
node --version
npm --version
```

### 2. Install Dependencies

```bash
cd sarkinmota-autos
npm install
```

### 3. Configure Environment Variables

Copy the example file and edit it:
```bash
cp .env.example .env
```

Open `.env` in VS Code and set your values:
```
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=change_this_to_something_random
WHATSAPP_NUMBER=2347015136111
SITE_URL=http://localhost:3000
```

### 4. Start the Development Server

```bash
npm run dev
```

The site will be available at:
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

### 5. Production Start

```bash
npm start
```

---

## 🔐 Admin Panel

**URL:** `/admin` or `/admin/login.html`

Default credentials (change in `.env`):
- **Username:** `admin`
- **Password:** `sarkinmota2025`

**⚠️ IMPORTANT:** Change the default password before deploying to production.

### Admin Features
- Full vehicle inventory management (add, edit, delete, status)
- View and manage test drive bookings
- View all customer enquiries
- Manage pre-orders and VIP concierge requests
- Handle sell/swap submissions
- Publish and manage news articles
- View newsletter subscribers
- Dashboard analytics (views, enquiries, most popular cars)

---

## 🚗 Managing Inventory

### Adding a Car via Admin
1. Go to `/admin/pages/add-car.html`
2. Fill in all vehicle details
3. Add image URLs (hosted images or local paths)
4. Click **Save Vehicle**

### Adding Cars Directly via JSON
Open `data/cars.json` and add an entry following this structure:
```json
{
  "id": "car_unique_id",
  "name": "Mercedes-Benz C300",
  "brand": "Mercedes-Benz",
  "model": "C300",
  "year": 2024,
  "price_ngn": 85000000,
  "price_usd": 55000,
  "type": "Executive",
  "condition": "Foreign Used",
  "mileage": "12,000 km",
  "color": "Obsidian Black",
  "transmission": "Automatic",
  "fuel": "Petrol",
  "engine": "2.0L Turbocharged",
  "seats": 5,
  "duty_paid": true,
  "status": "Available",
  "badge": "Hot Deal",
  "featured": true,
  "car_of_month": false,
  "images": ["/assets/images/cars/mercedes-c300.jpg"],
  "description": "Vehicle description here...",
  "features": ["Feature 1", "Feature 2"],
  "specs": {
    "horsepower": "255 hp",
    "0_to_100": "5.9s"
  },
  "views": 0,
  "enquiries": 0,
  "date_added": "2025-01-15T00:00:00.000Z"
}
```

---

## 🖼️ Adding Car Images

Place car images in:
```
public/assets/images/cars/
```

Recommended image specs:
- **Format:** JPG or WebP
- **Size:** 1200×800px minimum
- **Max file size:** 500KB per image

Reference in JSON:
```json
"images": ["/assets/images/cars/your-car-image.jpg"]
```

---

## 🌐 API Endpoints

### Cars (Public)
```
GET  /api/cars                    — All cars (filterable)
GET  /api/cars/featured           — Featured cars
GET  /api/cars/car-of-month       — Car of the month
GET  /api/cars/sold               — Sold cars
GET  /api/cars/brands             — List of brands
GET  /api/cars/:id                — Single car (increments view count)
```

### Forms (Public)
```
POST /api/bookings                — Submit test drive booking
POST /api/enquiries               — Submit enquiry
POST /api/preorders               — Submit pre-order
POST /api/swaps                   — Submit sell/swap request
POST /api/newsletter              — Subscribe to newsletter
```

### Admin (Protected — requires Authorization header)
```
POST /api/admin/login             — Login
GET  /api/admin/stats             — Dashboard stats
GET  /api/admin/verify            — Verify token
POST /api/cars                    — Add car
PUT  /api/cars/:id                — Update car
DELETE /api/cars/:id              — Delete car
GET/PUT/DELETE /api/bookings/:id
GET/PUT/DELETE /api/enquiries/:id
GET/DELETE /api/preorders/:id
GET/PUT/DELETE /api/swaps/:id
GET/DELETE /api/newsletter/:id
GET/POST /api/news
PUT/DELETE /api/news/:id
```

---

## 🚀 Deployment

### Option 1: Render (Recommended — Free tier available)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables from your `.env`
6. Deploy

### Option 2: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. `railway login`
3. `railway init`
4. `railway up`

### Option 3: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd sarkinmota-autos
npm install
cp .env.example .env
nano .env  # Edit your values

# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name sarkinmota
pm2 save
pm2 startup
```

---

## 🔧 VS Code Setup

### Recommended Extensions
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **Live Server** — Frontend preview (for static files only)
- **REST Client** — API testing
- **GitLens** — Git history

### Useful VS Code Commands
```
Ctrl+` (backtick)  — Open terminal
Ctrl+Shift+P       — Command palette
F5                 — Start debugging
Ctrl+Shift+`       — New terminal
```

---

## ⚠️ Common Issues

**Port already in use:**
```bash
# Kill whatever is on port 3000
npx kill-port 3000
npm run dev
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**JSON parse error on startup:**
- Check `data/*.json` files are valid JSON
- Use https://jsonlint.com to validate

**Admin login not working:**
- Verify `.env` has correct `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Restart the server after editing `.env`

---

## 📞 Business Contact

- **WhatsApp:** 07015136111
- **Address:** Olusegun Obasanjo Way, beside NNPC Mega Gas Station, CBD Abuja
- **Instagram:** @sarkinmota_cars
- **TikTok:** @alamin_sarkinmota

---

*Built with precision by **The Quantum Developer***
