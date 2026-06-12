# 📖 Sarkinmota Autos — Developer Guidelines

> Everything you need to understand, run, modify, and maintain this project in VS Code.

---

## 🖥️ Setting Up in VS Code

### Step 1: Open the Project
```
File → Open Folder → Select sarkinmota-autos folder
```

### Step 2: Open Integrated Terminal
```
Terminal → New Terminal  (or Ctrl + `)
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Set Up Environment
```bash
cp .env.example .env
```
Then edit `.env` with your values. Never commit `.env` to Git.

### Step 5: Run the Server
```bash
npm run dev
```

You should see:
```
🚗 Sarkinmota Autos Server Running
📍 http://localhost:3000
🛠️  Admin: http://localhost:3000/admin
```

---

## 📁 Where Everything Lives

```
sarkinmota-autos/
│
├── server.js                    ← Express server. All routes registered here.
├── .env                         ← Your secrets. NEVER push to GitHub.
│
├── data/                        ← All data lives here as JSON files.
│   ├── cars.json                ← Vehicle inventory
│   ├── bookings.json            ← Test drive bookings
│   ├── enquiries.json           ← Customer enquiries
│   ├── preorders.json           ← Pre-order / VIP requests
│   ├── swaps.json               ← Sell / swap submissions
│   ├── newsletter.json          ← Email subscribers
│   ├── news.json                ← News articles
│   └── reviews.json            ← Customer reviews (static — edit manually)
│
├── routes/                      ← Backend API logic (one file per feature)
│   ├── cars.js                  ← GET/POST/PUT/DELETE /api/cars
│   ├── bookings.js              ← POST/GET/DELETE /api/bookings
│   ├── enquiries.js             ← POST/GET/DELETE /api/enquiries
│   ├── preorders.js             ← POST/GET/DELETE /api/preorders
│   ├── swaps.js                 ← POST/GET/DELETE /api/swaps
│   ├── newsletter.js            ← POST/GET/DELETE /api/newsletter
│   ├── news.js                  ← GET/POST/PUT/DELETE /api/news
│   └── admin.js                 ← POST /api/admin/login, GET /api/admin/stats
│
├── middleware/
│   ├── auth.js                  ← Protects admin-only routes
│   └── sanitize.js              ← Cleans all input against XSS
│
├── public/                      ← Everything the browser can see
│   ├── index.html               ← The homepage. This is the root page.
│   ├── css/
│   │   ├── root.css             ← ALL design tokens (colors, fonts, spacing)
│   │   ├── reset.css            ← Browser reset + base styles
│   │   ├── components.css       ← All reusable UI components
│   │   ├── navbar.css           ← Navigation styles
│   │   ├── footer.css           ← Footer + WhatsApp FAB
│   │   ├── hero.css             ← Homepage hero styles
│   │   ├── animations.css       ← All animation keyframes
│   │   └── responsive.css       ← All media queries
│   │
│   ├── js/
│   │   ├── theme.js             ← Dark/light toggle. Runs on every page.
│   │   ├── utils.js             ← Shared helpers (formatNGN, buildCarCard, etc.)
│   │   ├── wishlist.js          ← Wishlist manager (localStorage)
│   │   ├── currency.js          ← ₦/$ toggle manager
│   │   ├── navbar.js            ← Navbar scroll + hamburger logic
│   │   ├── whatsapp.js          ← WhatsApp link builder + bindings
│   │   ├── social-ticker.js     ← Social proof ticker data
│   │   ├── animations.js        ← Scroll reveal + compare manager
│   │   └── pages/
│   │       ├── index.js         ← Homepage data loading
│   │       ├── inventory.js     ← Inventory filter + render logic
│   │       ├── car-detail.js    ← Car detail page logic
│   │       ├── calculator.js    ← Loan calculator + pie chart
│   │       ├── booking.js       ← Test drive form submit
│   │       ├── preorder.js      ← Pre-order form submit
│   │       ├── sell-swap.js     ← Sell/swap form submit
│   │       ├── contact.js       ← Contact form submit
│   │       ├── news.js          ← News listing loader
│   │       ├── news-detail.js   ← Article detail loader
│   │       ├── wishlist.js      ← Wishlist page loader
│   │       └── compare.js       ← Compare page + table builder
│   │
│   ├── pages/                   ← All inner HTML pages
│   └── assets/
│       └── images/
│           ├── logo/            ← logo-dark.png, logo-light.png
│           ├── cars/            ← Car photos (name them clearly)
│           └── hero/            ← Hero background images
│
└── admin/                       ← Admin dashboard (separate from public)
    ├── login.html               ← Admin login page
    ├── css/
    │   ├── admin-root.css       ← Admin CSS variables
    │   ├── admin-layout.css     ← Sidebar + main layout
    │   └── admin-components.css ← Tables, forms, buttons
    ├── js/
    │   ├── admin-auth.js        ← Auth guard + shared admin utilities
    │   ├── admin-dashboard.js   ← Dashboard stats loader
    │   ├── admin-cars.js        ← Inventory table management
    │   ├── admin-bookings.js    ← Bookings table
    │   ├── admin-enquiries.js   ← Enquiries table
    │   ├── admin-preorders.js   ← Pre-orders table
    │   ├── admin-swaps.js       ← Swap requests table
    │   ├── admin-news.js        ← News management
    │   └── admin-newsletter.js  ← Newsletter subscribers
    └── pages/                   ← All admin HTML pages
```

---

## 🎨 How to Change Colors / Design Tokens

All design tokens are in **one file only:**
```
public/css/root.css
```

To change a color, find the variable and update it:
```css
/* Change gold color */
--gold-mid: #C9A84C;   ← Change this hex

/* Change background */
--bg-primary: #0A0A0A;  ← Change this hex
```

Everything on the site uses these variables. Changing them here changes the entire site instantly.

---

## 🚗 How to Add a New Car

### Method 1: Admin Panel (Recommended)
1. Go to `http://localhost:3000/admin`
2. Login with your credentials
3. Click **Add Vehicle**
4. Fill in all fields and save

### Method 2: Edit JSON Directly
1. Open `data/cars.json` in VS Code
2. Add a new object at the start of the array:
```json
{
  "id": "car_009",
  "name": "Rolls-Royce Cullinan",
  "brand": "Rolls-Royce",
  "model": "Cullinan",
  "year": 2024,
  "price_ngn": 980000000,
  "price_usd": 635000,
  "type": "SUV",
  "condition": "Brand New",
  "mileage": "0 km",
  "color": "Black Diamond",
  "transmission": "Automatic",
  "fuel": "Petrol",
  "engine": "6.75L V12 Twin-Turbo",
  "seats": 5,
  "duty_paid": true,
  "status": "Available",
  "badge": "Just Arrived",
  "featured": true,
  "car_of_month": false,
  "images": ["/assets/images/cars/rolls-royce-cullinan.jpg"],
  "description": "The ultimate Rolls-Royce SUV...",
  "features": ["Starlight Headliner", "Bespoke Audio", "Massage Seats"],
  "specs": { "horsepower": "563 hp", "0_to_100": "5.2s" },
  "views": 0,
  "enquiries": 0,
  "date_added": "2025-01-20T00:00:00.000Z"
}
```
3. Save the file — changes reflect immediately (no restart needed)

---

## 🖼️ How to Add Car Images

1. Name the image clearly: `rolls-royce-cullinan.jpg`
2. Place it in: `public/assets/images/cars/`
3. Reference it in cars.json: `"/assets/images/cars/rolls-royce-cullinan.jpg"`

**Logo files** go in: `public/assets/images/logo/`
- `logo-dark.png` — Used on dark backgrounds (the white+gold version)
- `logo-light.png` — Used on light backgrounds (dark version)

---

## 📝 How to Update Business Information

All business contact details are hardcoded in a few places. To update:

| Information | Files to Edit |
|---|---|
| WhatsApp number | `public/js/whatsapp.js` (line 1: `WA_NUM`) and `public/js/utils.js` (line near bottom: `WA_NUMBER`) |
| Address | `public/index.html` (map section + footer), `public/pages/contact.html` |
| Business hours | `public/index.html` (map section), `public/pages/contact.html` |
| Email | `public/index.html` (footer), `public/pages/contact.html` |
| Social media links | `public/index.html` (footer section) |

---

## 🎨 How to Change the Hero Image

1. Add your image to `public/assets/images/hero/`
2. Open `public/index.html`
3. Find the element with id `heroBgImg`:
```html
<img src="/assets/images/hero/hero-main.jpg" ... id="heroBgImg">
```
4. Change the `src` to your new image

For best results: Use a wide landscape photo (1920×1080px minimum), dark/dramatic lighting works best with the overlay.

---

## 💬 How WhatsApp Links Work

Every WhatsApp button on the site uses a pre-built message. The logic is in:
```
public/js/whatsapp.js
```

To change the message for a specific button:
```javascript
const WA_MESSAGES = {
  car: (carName) => `Hello, I'm interested in the *${carName}*...`,
  // Edit the message text here ↑
};
```

---

## 🔐 How Admin Authentication Works

1. Admin logs in at `/admin/login.html`
2. Credentials are sent to `POST /api/admin/login`
3. Server checks against `.env` values
4. Returns a base64 token (username:password encoded)
5. Token is stored in `localStorage` as `sarkinmota_admin_token`
6. Every admin API call sends `Authorization: Bearer <token>` header
7. `middleware/auth.js` decodes and validates the token

To change the admin password:
1. Open `.env`
2. Change `ADMIN_PASSWORD=newpassword`
3. Restart the server: `npm run dev`
4. Log out of admin and log back in with new password

---

## 📊 Understanding the Data Files

All data is stored in `data/*.json`. They are plain JSON arrays.

| File | What it stores | Managed by |
|---|---|---|
| `cars.json` | Vehicle inventory | Admin panel + direct edit |
| `bookings.json` | Test drive requests | Form submissions |
| `enquiries.json` | Car enquiries | Form submissions |
| `preorders.json` | Pre-order / VIP requests | Form submissions |
| `swaps.json` | Sell / swap submissions | Form submissions |
| `newsletter.json` | Email subscribers | Newsletter form |
| `news.json` | News articles | Admin panel |
| `reviews.json` | Customer reviews | Edit manually |

**To clear all bookings** (e.g. during testing):
```bash
echo "[]" > data/bookings.json
```

---

## 🧩 How to Add a New Page

1. Create the HTML file in `public/pages/newpage.html`
2. Copy the navbar + footer structure from any existing page
3. Create a JS file at `public/js/pages/newpage.js`
4. Link the JS at the bottom of the HTML:
```html
<script src="/js/pages/newpage.js"></script>
```
5. Add it to the navbar links in all pages

---

## 🔄 How to Add a New API Endpoint

1. Create or edit the relevant file in `routes/`
2. Add your route handler:
```javascript
router.get('/new-endpoint', (req, res) => {
  res.json({ data: 'your data' });
});
```
3. Register it in `server.js` if it's a new file:
```javascript
const newRouter = require('./routes/newroute');
app.use('/api/newroute', newRouter);
```

---

## 🚀 Before Going Live Checklist

```
[ ] Change ADMIN_PASSWORD in .env to something strong
[ ] Change SESSION_SECRET in .env to a random 32+ character string
[ ] Add real car images (replace placeholder references)
[ ] Add real logo files to public/assets/images/logo/
[ ] Add real hero image to public/assets/images/hero/
[ ] Update Google Maps embed URL with exact showroom coordinates
[ ] Test all forms submit correctly
[ ] Test admin login works
[ ] Test on mobile (WhatsApp links, forms, navigation)
[ ] Deploy to Render / Railway
[ ] Test the live URL
[ ] Share the Loom walkthrough
```

---

## 🐛 Debugging Tips

**Server not starting:**
```bash
node server.js  # Run directly to see full error
```

**API returning 404:**
- Check the route is registered in `server.js`
- Check the URL path matches exactly

**Admin login failing:**
- Check `.env` has `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Make sure there are no spaces around the `=` in `.env`

**Cars not showing on homepage:**
- Confirm `data/cars.json` has valid JSON (use https://jsonlint.com)
- Check `featured: true` is set on at least one car

**Wishlist / Compare not saving:**
- Check browser allows localStorage (private/incognito may block it)

---

*Built by **The Quantum Developer***
