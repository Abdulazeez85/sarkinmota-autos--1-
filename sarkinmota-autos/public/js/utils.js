// Format price in Naira
const formatNGN = (amount) => {
  if (!amount && amount !== 0) return '—';
  return '₦' + Number(amount).toLocaleString('en-NG');
};

// Format price in USD
const formatUSD = (amount) => {
  if (!amount && amount !== 0) return '—';
  return '$' + Number(amount).toLocaleString('en-US');
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Truncate text
const truncate = (text, len = 120) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
};

// Get badge HTML
const getBadgeHTML = (badge, status) => {
  if (status === 'Sold') return '<span class="badge badge-sold">Sold</span>';
  if (status === 'Coming Soon') return '<span class="badge badge-soon">Coming Soon</span>';
  if (!badge) return '';
  const map = {
    'Hot Deal': 'badge-hot',
    'Just Arrived': 'badge-new',
    'Last Unit': 'badge-last',
    'Price Drop': 'badge-drop',
  };
  return `<span class="badge ${map[badge] || ''}">${badge}</span>`;
};

// Get status badge HTML
const getStatusBadge = (status) => {
  const map = {
    'Available': 'status-available',
    'Sold': 'status-sold',
    'On Order': 'status-order',
    'Coming Soon': 'status-soon',
  };
  return `<span class="status-badge ${map[status] || ''}">${status || 'Available'}</span>`;
};

// Build car card HTML
const buildCarCard = (car, currency = 'ngn') => {
  const price = currency === 'ngn'
    ? `<div class="price-ngn">${formatNGN(car.price_ngn)}</div><div class="price-usd">${formatUSD(car.price_usd)}</div>`
    : `<div class="price-ngn">${formatUSD(car.price_usd)}</div><div class="price-usd">${formatNGN(car.price_ngn)}</div>`;

  const isWishlisted = wishlistManager.has(car.id);
  const waMsg = encodeURIComponent(`Hello, I'm interested in the ${car.name} listed on your website. Please send me more details.`);
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return `
    <div class="car-card" onclick="window.location.href='/pages/car-detail.html?id=${car.id}'" data-car-id="${car.id}">
      <div class="car-card-image">
        <img src="${car.images?.[0] || '/assets/images/cars/placeholder.jpg'}" alt="${car.name}" loading="lazy">
        <div class="car-card-overlay"></div>
        <div class="car-card-badges">
          ${getBadgeHTML(car.badge, car.status)}
          ${car.duty_paid ? '<span class="badge badge-duty">Duty Paid</span>' : ''}
        </div>
        <div class="car-card-actions">
          <button class="card-action-btn ${isWishlisted ? 'wishlisted' : ''}" onclick="event.stopPropagation(); toggleWishlist('${car.id}')" data-wishlist-btn="${car.id}" title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
          <button class="card-action-btn" onclick="event.stopPropagation(); addToCompare('${car.id}')" title="Compare">⚖️</button>
          <a href="${waLink}" target="_blank" rel="noopener" class="card-action-btn" onclick="event.stopPropagation()" title="WhatsApp Enquiry">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.544 4.124 1.5 5.867L0 24l6.317-1.473A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.359-.214-3.741.872.937-3.628-.234-.373A9.783 9.783 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818S21.818 6.579 21.818 12c0 5.421-4.397 9.818-9.818 9.818z"/></svg>
          </a>
        </div>
      </div>
      <div class="car-card-body">
        <div class="car-card-brand">${car.brand}</div>
        <div class="car-card-name">${car.name}</div>
        <div class="car-card-meta">
          <span class="car-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${car.year}
          </span>
          <span class="car-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            ${car.fuel}
          </span>
          <span class="car-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            ${car.condition}
          </span>
        </div>
        <div class="car-card-footer">
          <div class="car-card-price">${price}</div>
          ${getStatusBadge(car.status)}
        </div>
      </div>
    </div>`;
};

// Show toast notification
const showToast = (title, message, type = 'default') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { default: '🏆', success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.default}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Counter animation
const animateCounter = (el, target, duration = 2000, suffix = '') => {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// WhatsApp number constant
const WA_NUMBER = '2347015136111';

// Build WhatsApp link
const waLink = (message) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

// API base
const API = '';

// Fetch helper
const apiFetch = async (url, opts = {}) => {
  const res = await fetch(API + url, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts
  });
  return res.json();
};

// Scroll reveal observer
const initReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
    observer.observe(el);
  });
};

// Page loader hide
const hideLoader = () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
  }
};

window.formatNGN = formatNGN;
window.formatUSD = formatUSD;
window.formatDate = formatDate;
window.truncate = truncate;
window.getBadgeHTML = getBadgeHTML;
window.getStatusBadge = getStatusBadge;
window.buildCarCard = buildCarCard;
window.showToast = showToast;
window.animateCounter = animateCounter;
window.WA_NUMBER = WA_NUMBER;
window.waLink = waLink;
window.API = API;
window.apiFetch = apiFetch;
window.initReveal = initReveal;
window.hideLoader = hideLoader;
