const TICKER_EVENTS = [
  { name: 'Alhaji Musa', location: 'Abuja', action: 'just enquired about a Range Rover Sport' },
  { name: 'Mrs. Chioma', location: 'Lagos', action: 'just booked a test drive for a Toyota Land Cruiser' },
  { name: 'Dr. Kayode', location: 'Ibadan', action: 'just purchased a Xiaomi YU7 Ultra' },
  { name: 'Engr. Bello', location: 'Kano', action: 'just enquired about the installment plan for a BMW 7 Series' },
  { name: 'Senator Adamu', location: 'Kaduna', action: 'just purchased an Armoured Toyota Coaster' },
  { name: 'Mrs. Fatima', location: 'Abuja', action: 'just added a Porsche Cayenne to their wishlist' },
  { name: 'Chief Okafor', location: 'Port Harcourt', action: 'just submitted a sell/swap request' },
  { name: 'Alhaja Sule', location: 'Kano', action: 'just pre-ordered a Mercedes-Benz C300' },
];

const buildTicker = () => {
  const container = document.querySelector('.ticker-track');
  if (!container) return;

  // Build twice for seamless loop
  const items = [...TICKER_EVENTS, ...TICKER_EVENTS];
  container.innerHTML = items.map(e => `
    <span class="ticker-item">
      <span class="ticker-dot"></span>
      <span class="ticker-name">${e.name} (${e.location})</span>
      <span>${e.action}</span>
    </span>
  `).join('');
};

document.addEventListener('DOMContentLoaded', buildTicker);
