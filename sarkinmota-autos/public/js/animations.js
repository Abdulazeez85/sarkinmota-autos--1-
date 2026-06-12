document.addEventListener('DOMContentLoaded', () => {
  // Init scroll reveal
  initReveal();

  // Hide page loader
  hideLoader();

  // Counter observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
      const suffix = el.dataset.suffix || '';
      if (!isNaN(target)) animateCounter(el, target, 2000, suffix);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Compare manager
  initCompare();
});

// Compare cart (up to 3 cars)
const compareManager = (() => {
  const KEY = 'sarkinmota_compare';
  const get = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (ids) => localStorage.setItem(KEY, JSON.stringify(ids));
  return {
    getAll: get,
    has: (id) => get().includes(id),
    add: (id) => {
      const c = get();
      if (c.length >= 3) { showToast('Compare Limit', 'You can compare up to 3 cars at a time.', 'info'); return false; }
      if (!c.includes(id)) { c.push(id); save(c); return true; }
      return false;
    },
    remove: (id) => save(get().filter(i => i !== id)),
    clear: () => localStorage.removeItem(KEY),
    count: () => get().length
  };
})();

const addToCompare = (carId) => {
  if (compareManager.has(carId)) {
    showToast('Already Added', 'This car is already in your compare list.', 'info');
    return;
  }
  const added = compareManager.add(carId);
  if (added) {
    updateCompareBadge();
    showToast('Added to Compare', `${compareManager.count()} car(s) selected. View comparison.`, 'success');
  }
};

const updateCompareBadge = () => {
  const count = compareManager.count();
  document.querySelectorAll('.compare-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
};

const initCompare = () => {
  updateCompareBadge();
};

window.compareManager = compareManager;
window.addToCompare = addToCompare;
window.updateCompareBadge = updateCompareBadge;
