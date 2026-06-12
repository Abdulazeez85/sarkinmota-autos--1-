document.addEventListener('DOMContentLoaded', async () => {
  const ids = wishlistManager.getAll();
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('wishlistEmpty');
  const countEl = document.getElementById('wishlistPageCount');
  if (!grid) return;
  if (!ids.length) {
    if (emptyState) emptyState.style.display = 'block';
    grid.style.display = 'none';
    return;
  }
  if (countEl) countEl.textContent = ids.length;
  try {
    const allCars = await apiFetch('/api/cars');
    const wishlisted = allCars.filter(c => ids.includes(c.id));
    const currency = currencyManager.get();
    grid.innerHTML = wishlisted.length
      ? wishlisted.map(c => buildCarCard(c, currency)).join('')
      : '<div class="empty-state"><p>Some wishlisted cars are no longer available.</p></div>';
    window.addEventListener('currencyChanged', (e) => {
      grid.innerHTML = wishlisted.map(c => buildCarCard(c, e.detail.currency)).join('');
    });
    initReveal();
    const enquireAllBtn = document.getElementById('enquireAllBtn');
    if (enquireAllBtn && wishlisted.length) {
      const names = wishlisted.map(c => c.name).join(', ');
      enquireAllBtn.href = buildWALink(`Hello Sarkinmota Autos, I am interested in the following vehicles from my wishlist: ${names}. Please provide details and availability.`);
    }
  } catch { grid.innerHTML = '<div class="empty-state"><p>Could not load wishlist. Please refresh.</p></div>'; }
});
