document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadFeaturedCars(),
    loadCarOfMonth(),
    loadHallOfFame(),
    loadReviews(),
    loadCategoryCounts(),
  ]);
  initNewsletterForm();
});

// Load featured cars
async function loadFeaturedCars() {
  try {
    const cars = await apiFetch('/api/cars/featured');
    const grid = document.getElementById('featuredGrid');
    const countEl = document.getElementById('featuredCount');
    if (!grid) return;
    const currency = currencyManager.get();
    grid.innerHTML = cars.length
      ? cars.map(c => buildCarCard(c, currency)).join('')
      : '<div class="empty-state"><p>No featured vehicles at this time.</p></div>';
    if (countEl) countEl.textContent = cars.length;
    window.addEventListener('currencyChanged', (e) => {
      grid.innerHTML = cars.map(c => buildCarCard(c, e.detail.currency)).join('');
    });
    initReveal();
  } catch (e) {
    console.error('Featured cars error:', e);
  }
}

// Load car of the month
async function loadCarOfMonth() {
  try {
    const car = await apiFetch('/api/cars/car-of-month');
    if (!car || car.error) return;
    const img = document.getElementById('cotmImage');
    const name = document.getElementById('cotmName');
    const desc = document.getElementById('cotmDesc');
    const specs = document.getElementById('cotmSpecs');
    const detailBtn = document.getElementById('cotmDetailBtn');
    const waBtn = document.getElementById('cotmWABtn');

    if (img) img.src = car.images?.[0] || '/assets/images/cars/placeholder.jpg';
    if (name) name.textContent = car.name;
    if (desc) desc.textContent = car.description;
    if (detailBtn) detailBtn.href = `/pages/car-detail.html?id=${car.id}`;
    if (waBtn) waBtn.href = buildWALink(WA_MESSAGES.car(car.name));

    if (specs) {
      const specEntries = Object.entries(car.specs || {}).slice(0, 3);
      specs.innerHTML = specEntries.map(([k, v]) => `
        <div>
          <div class="cotm-spec-label">${k.replace(/_/g, ' ')}</div>
          <div class="cotm-spec-val">${v}</div>
        </div>`).join('') + `
        <div>
          <div class="cotm-spec-label">Price</div>
          <div class="cotm-spec-val" style="background:var(--gold-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${formatNGN(car.price_ngn)}</div>
        </div>`;
    }
  } catch (e) {
    console.error('Car of month error:', e);
  }
}

// Load hall of fame (sold cars)
async function loadHallOfFame() {
  try {
    const cars = await apiFetch('/api/cars/sold');
    const grid = document.getElementById('hofGrid');
    if (!grid) return;
    if (!cars.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>No sold cars yet.</p></div>`;
      return;
    }
    grid.innerHTML = cars.slice(0, 4).map(c => `
      <div class="hof-card">
        <img src="${c.images?.[0] || '/assets/images/cars/placeholder.jpg'}" alt="${c.name}" loading="lazy">
        <div class="hof-overlay"></div>
        <div class="hof-info">
          <div class="hof-sold-tag">✓ Sold</div>
          <div class="hof-car-name">${c.name}</div>
        </div>
      </div>`).join('');
  } catch (e) {
    console.error('Hall of fame error:', e);
  }
}

// Load reviews
async function loadReviews() {
  try {
    const reviews = await apiFetch('/api/cars');
    // Fetch reviews from a static endpoint or use embedded data
    const res = await fetch('/api/news'); // reuse same pattern
    // Load reviews directly from data - since there's no dedicated endpoint, embed them
    const reviewData = [
      { id: 1, name: 'Alhaji Musa Ibrahim', location: 'Abuja, FCT', rating: 5, text: 'I bought a Range Rover Sport from Sarkinmota last year. The process was smooth, the car was exactly as described, and delivery to my door was seamless. My bratha is the real deal.', car: 'Range Rover Sport HSE' },
      { id: 2, name: 'Mrs. Chioma Okafor', location: 'Lagos, Nigeria', rating: 5, text: 'Nationwide delivery really works! I was skeptical ordering a car from Abuja to Lagos but Sarkinmota made it happen. The Toyota Land Cruiser arrived in perfect condition. 10/10.', car: 'Toyota Land Cruiser 300' },
      { id: 3, name: 'Senator Bello Adamu', location: 'Kano, Nigeria', rating: 5, text: 'The armoured Coaster I purchased exceeded every expectation. The level of service and attention to detail is unmatched in Nigeria. This is what luxury should feel like.', car: 'Bulletproof Toyota Coaster' },
      { id: 4, name: 'Engr. Tunde Fashola', location: 'Port Harcourt', rating: 5, text: 'Used the installment plan. 40% deposit and I drove home in a BMW 7 Series the same week. The process was transparent and no hidden charges. Sarkinmota is trustworthy.', car: 'BMW 7 Series 740i' },
      { id: 5, name: 'Hajiya Fatima Sule', location: 'Kaduna, Nigeria', rating: 5, text: 'Swapped my old Lexus for a brand new Mercedes C300. Fair valuation, professional team, and the new car is absolutely gorgeous.', car: 'Mercedes-Benz C300' },
      { id: 6, name: 'Dr. Kayode Adeyemi', location: 'Ibadan, Oyo', rating: 5, text: 'I watched his TikTok videos for months before trusting him with ₦145M. Best decision I ever made. The Xiaomi YU7 is insane and Sarkinmota delivered as promised.', car: 'Xiaomi YU7 Ultra' },
    ];
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;
    grid.innerHTML = reviewData.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-author">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-location">📍 ${r.location}</div>
            <div class="review-car">🚗 ${r.car}</div>
          </div>
        </div>
      </div>`).join('');
    initReveal();
  } catch (e) {
    console.error('Reviews error:', e);
  }
}

// Load category counts
async function loadCategoryCounts() {
  try {
    const cars = await apiFetch('/api/cars');
    const countEls = document.querySelectorAll('[data-category]');
    countEls.forEach(el => {
      const cat = el.dataset.category;
      const count = cars.filter(c => c.type === cat && c.status !== 'Sold').length;
      el.textContent = `${count} vehicle${count !== 1 ? 's' : ''} available`;
    });
    const totalEl = document.getElementById('totalCarsCount');
    if (totalEl) {
      const total = cars.filter(c => c.status !== 'Sold').length;
      totalEl.textContent = `${total} vehicle${total !== 1 ? 's' : ''} available`;
    }
  } catch (e) { console.error('Category count error:', e); }
}

// Newsletter form
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    try {
      const res = await apiFetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      if (res.success) {
        showToast('Subscribed!', 'You will be notified of new arrivals.', 'success');
        form.reset();
      } else {
        showToast('Error', res.error || 'Could not subscribe.', 'error');
      }
    } catch {
      showToast('Error', 'Please try again later.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    }
  });
}
