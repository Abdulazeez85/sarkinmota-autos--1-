# 🗺️ Sarkinmota Autos — Project Roadmap

---

## ✅ Version 1.0 — Current Build (MVP)

### Frontend
- [x] Cinematic homepage with animated hero
- [x] Stats counter section
- [x] Car categories section
- [x] Featured inventory grid
- [x] Car of the Month spotlight
- [x] VIP Concierge section
- [x] Installment plan banner
- [x] Hall of Fame (sold cars)
- [x] Reviews / testimonials section
- [x] FAQ accordion
- [x] Referral strip
- [x] Embedded Google Maps
- [x] Newsletter subscription
- [x] Press mentions ("As Seen In")
- [x] Social proof ticker
- [x] WhatsApp floating action button
- [x] Dark / Light theme toggle with localStorage persistence
- [x] Scroll reveal animations
- [x] Page loader

### Inventory
- [x] Full inventory page with sidebar filters
- [x] Filter by type, condition, status, fuel, price range
- [x] Search by name / brand / model
- [x] Sort by newest, price, brand
- [x] Active filter tags with remove option
- [x] Car card with wishlist + compare + WhatsApp buttons
- [x] Badges: Hot Deal, Just Arrived, Last Unit, Price Drop
- [x] Duty Paid badge
- [x] Status: Available, Sold, On Order, Coming Soon
- [x] ₦ / $ currency toggle

### Single Car Detail Page
- [x] Full image gallery with thumbnails
- [x] Price in ₦ and $
- [x] Specs, features, and description tabs
- [x] Wishlist button
- [x] Compare button
- [x] Test drive booking CTA
- [x] WhatsApp pre-built enquiry message
- [x] 40% deposit lock CTA
- [x] Loan calculator pre-fill link
- [x] Share car link
- [x] Inline enquiry form

### Tools & Calculators
- [x] Loan / installment calculator
- [x] Price slider + down payment slider + rate slider
- [x] Tenure selector (12/24/36/48/60 months)
- [x] Quick pick car from inventory
- [x] Monthly payment result
- [x] Total repayment + interest breakdown
- [x] Pie chart (principal vs interest)
- [x] Full amortization table
- [x] Send summary to WhatsApp
- [x] Compare cars page (side-by-side, up to 3 cars)
- [x] Wishlist page with localStorage persistence

### Forms & Bookings
- [x] Test drive booking form
- [x] Pre-order / VIP Concierge form
- [x] Sell or Swap form
- [x] Contact form
- [x] Newsletter subscription

### Pages
- [x] Homepage
- [x] Inventory
- [x] Car Detail
- [x] Loan Calculator
- [x] Compare Cars
- [x] Wishlist
- [x] Book Test Drive
- [x] Pre-Order
- [x] Sell or Swap
- [x] News & Events
- [x] News Article Detail
- [x] About
- [x] Contact
- [x] Brokers Network
- [x] FAQ
- [x] Referral Program
- [x] Installment Plans
- [x] Nationwide Delivery
- [x] Custom 404

### Backend
- [x] Express server with rate limiting
- [x] Cars API (full CRUD)
- [x] Bookings API
- [x] Enquiries API (with car enquiry count increment)
- [x] Pre-orders API
- [x] Swaps API
- [x] Newsletter API
- [x] News API
- [x] Admin auth (token-based)
- [x] Input sanitization (XSS protection)
- [x] JSON file storage for all data
- [x] Car view counter (auto-increment on detail page visit)

### Admin Dashboard
- [x] Secure login page
- [x] Dashboard with 8 stat cards
- [x] Most viewed cars analytics
- [x] Most enquired cars analytics
- [x] Recent bookings widget
- [x] Recent enquiries widget
- [x] Full inventory management (add, edit, delete, quick status)
- [x] Add / Edit vehicle form (full fields)
- [x] Test drive bookings management
- [x] Enquiries management
- [x] Pre-orders management
- [x] Sell/Swap requests management
- [x] News & Events management (publish, delete)
- [x] Newsletter subscribers list

### Pre-seeded Data
- [x] 8 luxury vehicles (real Sarkinmota inventory)
- [x] 6 customer reviews
- [x] 3 news articles
- [x] Social proof ticker events

---

## 🔜 Version 1.1 — Quick Wins (1–2 weeks post-launch)

### Frontend
- [ ] Image lightbox / zoom on car detail gallery
- [ ] "Notify me when available" form on sold-out cars
- [ ] Exit intent popup (WhatsApp CTA when user about to leave)
- [ ] Floating compare bar (shows selected cars at bottom of screen)
- [ ] Video embed support on car detail pages (YouTube/TikTok)
- [ ] Smooth loading transitions between pages

### Backend
- [ ] Rate limiting fine-tuning per endpoint
- [ ] Request logging middleware
- [ ] Better error messages with error codes
- [ ] Admin password change endpoint

### Admin
- [ ] Bulk status update on multiple cars
- [ ] Export leads (bookings, enquiries) as CSV
- [ ] Filter bookings by date range
- [ ] Mark enquiries as read/unread

---

## 🔜 Version 1.2 — Content & SEO (2–4 weeks post-launch)

- [ ] Dynamic meta tags per car page (for WhatsApp link previews)
- [ ] Open Graph image per car listing
- [ ] Auto-generated sitemap from inventory
- [ ] Structured data (JSON-LD) for car listings (Google rich results)
- [ ] Blog/article system for SEO content
- [ ] Image lazy loading optimization
- [ ] WebP image conversion on upload
- [ ] Google Analytics or Plausible integration

---

## 🔜 Version 2.0 — Advanced Features (1–3 months)

### Authentication & Users
- [ ] Customer accounts (save wishlist to account, not just localStorage)
- [ ] Order history per customer
- [ ] JWT-based session management for admin
- [ ] Admin activity log (who changed what and when)

### Payments
- [ ] Paystack integration for deposit booking
- [ ] Payment receipt generation (PDF)
- [ ] Partial payment tracking

### Advanced Admin
- [ ] Bulk car upload via CSV/Excel
- [ ] Image upload directly from admin (multer + local storage)
- [ ] Image optimization on upload (sharp.js compression)
- [ ] Revenue analytics dashboard
- [ ] Monthly lead trend charts
- [ ] Backup / restore data as ZIP

### Communication
- [ ] Email notification on new booking (Nodemailer / Resend)
- [ ] Email confirmation to customer on booking
- [ ] WhatsApp Business API integration (automated replies)
- [ ] SMS notification via Termii or Infobip

### Logistics
- [ ] Delivery cost estimator (by state)
- [ ] Delivery tracking page (order status updates)
- [ ] Shipping partner integration

---

## 🔜 Version 3.0 — Enterprise (3–6 months)

- [ ] Multi-branch support (Abuja HQ + Lagos branch)
- [ ] Staff accounts with role-based access (sales rep, manager, admin)
- [ ] CRM integration (leads pipeline, follow-up reminders)
- [ ] MongoDB migration for scale
- [ ] Real-time notifications (WebSocket — new booking alerts in admin)
- [ ] Mobile app (React Native)
- [ ] AI car recommendation engine
- [ ] Vehicle auction/bidding system
- [ ] Franchise/partner dealer portal
- [ ] Full accounting module

---

## 🐛 Known Limitations (v1.0)

| Issue | Impact | Fix Version |
|---|---|---|
| No image upload (URLs only) | Medium | v2.0 |
| Admin auth is token-based (not JWT expiry) | Low | v1.1 |
| No email notifications | Medium | v2.0 |
| JSON storage has no concurrent write protection | Low (single user) | v2.0 |
| No real-time admin notifications | Low | v3.0 |

---

*Last updated: January 2025*
*Built by **The Quantum Developer***
