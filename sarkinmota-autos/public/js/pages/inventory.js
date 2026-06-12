let allCars = [];
let activeFilters = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('type')) activeFilters.type = params.get('type');
  if (params.get('brand')) activeFilters.brand = params.get('brand');

  await loadInventory();
  bindFilterOptions();
  bindSearch();
  updateActiveFilterTags();
  window.addEventListener('currencyChanged', () => renderCars(getFilteredCars()));
});

async function loadInventory() {
  try {
    allCars = await apiFetch('/api/cars');
    renderCars(getFilteredCars());
  } catch {
    document.getElementById('inventoryGrid').innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🚗</div><div class="empty-state-title">Could not load inventory</div><p class="empty-state-text">Please refresh the page.</p></div>`;
  }
}

function getFilteredCars() {
  let cars = [...allCars];
  const sort = document.getElementById('sortSelect')?.value || 'newest';
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';

  if (activeFilters.type) cars = cars.filter(c => c.type === activeFilters.type);
  if (activeFilters.condition) cars = cars.filter(c => c.condition === activeFilters.condition);
  if (activeFilters.status) cars = cars.filter(c => c.status === activeFilters.status);
  if (activeFilters.fuel) cars = cars.filter(c => c.fuel === activeFilters.fuel);
  if (activeFilters.brand) cars = cars.filter(c => c.brand.toLowerCase() === activeFilters.brand.toLowerCase());

  const min = parseInt(document.getElementById('minPrice')?.value);
  const max = parseInt(document.getElementById('maxPrice')?.value);
  if (!isNaN(min) && min > 0) cars = cars.filter(c => c.price_ngn >= min);
  if (!isNaN(max) && max > 0) cars = cars.filter(c => c.price_ngn <= max);
  if (search) cars = cars.filter(c => c.name.toLowerCase().includes(search) || c.brand.toLowerCase().includes(search) || c.model.toLowerCase().includes(search));

  if (sort === 'price_asc') cars.sort((a, b) => a.price_ngn - b.price_ngn);
  else if (sort === 'price_desc') cars.sort((a, b) => b.price_ngn - a.price_ngn);
  else if (sort === 'brand') cars.sort((a, b) => a.brand.localeCompare(b.brand));
  else cars.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

  return cars;
}

function renderCars(cars) {
  const grid = document.getElementById('inventoryGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;
  const currency = currencyManager.get();
  if (countEl) countEl.textContent = cars.length;
  grid.innerHTML = cars.length
    ? cars.map(c => buildCarCard(c, currency)).join('')
    : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-title">No Vehicles Found</div><p class="empty-state-text">Try adjusting your filters or <button onclick="clearFilters()" style="color:var(--text-gold);background:none;border:none;cursor:pointer;font-size:inherit">clear all filters</button>.</p></div>`;
  initReveal();
}

function bindFilterOptions() {
  document.querySelectorAll('[data-filter]').forEach(opt => {
    const key = opt.dataset.filter;
    const val = opt.dataset.value;
    if (activeFilters[key] === val || (!activeFilters[key] && val === '')) opt.classList.add('active');
    opt.addEventListener('click', () => {
      document.querySelectorAll(`[data-filter="${key}"]`).forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (val === '') delete activeFilters[key];
      else activeFilters[key] = val;
      updateActiveFilterTags();
      renderCars(getFilteredCars());
    });
  });
}

function bindSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => renderCars(getFilteredCars()));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') renderCars(getFilteredCars()); });
}

function applyFilters() { renderCars(getFilteredCars()); updateActiveFilterTags(); }

function clearFilters() {
  activeFilters = {};
  document.querySelectorAll('[data-filter]').forEach(o => {
    o.classList.remove('active');
    if (o.dataset.value === '') o.classList.add('active');
  });
  const searchInput = document.getElementById('searchInput');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  if (searchInput) searchInput.value = '';
  if (minPrice) minPrice.value = '';
  if (maxPrice) maxPrice.value = '';
  updateActiveFilterTags();
  renderCars(getFilteredCars());
}

function updateActiveFilterTags() {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  const tags = Object.entries(activeFilters).map(([k, v]) => `
    <span class="active-filter-tag" onclick="removeFilter('${k}')">
      ${v} ✕
    </span>`).join('');
  container.innerHTML = tags;
}

function removeFilter(key) {
  delete activeFilters[key];
  document.querySelectorAll(`[data-filter="${key}"]`).forEach(o => {
    o.classList.remove('active');
    if (o.dataset.value === '') o.classList.add('active');
  });
  updateActiveFilterTags();
  renderCars(getFilteredCars());
}

window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.removeFilter = removeFilter;
