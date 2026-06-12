// Admin auth guard — include on every admin page
const ADMIN_TOKEN_KEY = 'sarkinmota_admin_token';
const ADMIN_USER_KEY = 'sarkinmota_admin_user';

const adminAuth = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  getUser: () => localStorage.getItem(ADMIN_USER_KEY) || 'Admin',
  isLoggedIn: () => !!localStorage.getItem(ADMIN_TOKEN_KEY),
  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    window.location.href = '/admin/login.html';
  },
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY)}`
  }),
  guard: async () => {
    if (!adminAuth.isLoggedIn()) {
      window.location.href = '/admin/login.html';
      return false;
    }
    try {
      const res = await fetch('/api/admin/verify', { headers: adminAuth.headers() });
      const data = await res.json();
      if (!data.valid) { adminAuth.logout(); return false; }
      return true;
    } catch {
      return true; // allow offline
    }
  }
};

// API helper with auth
const adminFetch = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { ...adminAuth.headers(), ...(opts.headers || {}) }
  });
  return res.json();
};

// Admin toast
const adminToast = (msg, type = 'default') => {
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
};

// Confirm delete
const confirmDelete = (msg = 'Are you sure you want to delete this? This cannot be undone.') => {
  return window.confirm(msg);
};

// Format NGN
const adminFormatNGN = (n) => n ? '₦' + Number(n).toLocaleString('en-NG') : '—';

// Format date
const adminFormatDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

// Set active sidebar link
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && current.includes(href.replace('/admin/pages/', ''))) {
      link.classList.add('active');
    }
  });

  // Set user name
  document.querySelectorAll('.admin-username').forEach(el => {
    el.textContent = adminAuth.getUser();
  });

  // Bind logout buttons
  document.querySelectorAll('.admin-logout-btn').forEach(btn => {
    btn.addEventListener('click', adminAuth.logout);
  });

  // Hamburger
  const hamburger = document.querySelector('.admin-hamburger');
  const sidebar = document.querySelector('.admin-sidebar');
  hamburger?.addEventListener('click', () => sidebar?.classList.toggle('open'));
});

window.adminAuth = adminAuth;
window.adminFetch = adminFetch;
window.adminToast = adminToast;
window.confirmDelete = confirmDelete;
window.adminFormatNGN = adminFormatNGN;
window.adminFormatDate = adminFormatDate;
