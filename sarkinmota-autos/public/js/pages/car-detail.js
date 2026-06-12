let car = null;

document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return window.location.href = '/pages/inventory.html';
  await loadCarDetail(id);
});

async function loadCarDetail(id) {
  try {
    car = await apiFetch(`/api/cars/${id}`);
    if (car.error) return window.location.href = '/pages/404.html';
    renderDetail(car);
    document.title = `${car.name} — Sarkinmota Autos`;
    const breadcrumb = document.getElementById('breadcrumbCar');
    if (breadcrumb) breadcrumb.textContent = car.name;
  } catch {
    window.location.href = '/pages/404.html';
  }
}

function renderDetail(car) {
  const container = document.getElementById('detailContent');
  if (!container) return;

  const waMsg = buildWALink(WA_MESSAGES.car(car.name));
  const waTestDrive = buildWALink(WA_MESSAGES.testDrive(car.name));
  const isWishlisted = wishlistManager.has(car.id);
  const images = car.images?.length ? car.images : ['/assets/images/cars/placeholder.jpg'];
  const thumbs = images.map((img, i) => `<div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage(${i})" data-thumb="${i}"><img src="${img}" alt="${car.name}"></div>`).join('');
  const specsHTML = Object.entries(car.specs || {}).map(([k, v]) => `<div class="spec-row"><span class="spec-key">${k.replace(/_/g,' ')}</span><span class="spec-val">${v}</span></div>`).join('');
  const featuresHTML = (car.features || []).map(f => `<span class="feature-tag">${f}</span>`).join('');
  const shareUrl = window.location.href;

  container.innerHTML = `
    <!-- Gallery -->
    <div class="gallery reveal-left">
      <div class="gallery-main"><img src="${images[0]}" alt="${car.name}" id="mainImage"></div>
      ${images.length > 1 ? `<div class="gallery-thumbs">${thumbs}</div>` : ''}
    </div>

    <!-- Info -->
    <div class="reveal-right">
      <div class="detail-header">
        <div class="detail-brand">${car.brand} • ${car.year}</div>
        <h1 class="detail-name">${car.name}</h1>
        <div class="detail-badges">
          ${getBadgeHTML(car.badge, car.status)}
          ${getStatusBadge(car.status)}
          ${car.duty_paid ? '<span class="badge badge-duty">✓ Duty Paid</span>' : ''}
          <span class="badge" style="background:rgba(255,255,255,0.06);color:var(--text-secondary);border:1px solid var(--divider)">${car.condition}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="detail-price-block">
        <div class="detail-price-label">Asking Price</div>
        <div class="detail-price-ngn">${formatNGN(car.price_ngn)}</div>
        <div class="detail-price-usd">${formatUSD(car.price_usd)}</div>
        ${car.price_ngn ? `<div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--divider);font-size:var(--text-sm);color:var(--text-secondary)">Est. monthly from <strong style="color:var(--text-gold)">${formatNGN(Math.round(car.price_ngn * 0.6 / 24))}</strong> with 40% deposit, 24 months · <a href="/pages/calculator.html?price=${car.price_ngn}&name=${encodeURIComponent(car.name)}" style="color:var(--text-gold)">Calculate →</a></div>` : ''}
      </div>

      <!-- Meta grid -->
      <div class="detail-meta-grid">
        <div class="detail-meta-item"><div class="detail-meta-label">Fuel</div><div class="detail-meta-val">${car.fuel || '—'}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Transmission</div><div class="detail-meta-val">${car.transmission || '—'}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Mileage</div><div class="detail-meta-val">${car.mileage || '—'}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Seats</div><div class="detail-meta-val">${car.seats || '—'} Seats</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Engine</div><div class="detail-meta-val">${car.engine || '—'}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Color</div><div class="detail-meta-val">${car.color || '—'}</div></div>
      </div>

      <!-- Actions -->
      <div class="detail-actions">
        <a href="${waMsg}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg btn-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.544 4.124 1.5 5.867L0 24l6.317-1.473A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.359-.214-3.741.872.937-3.628-.234-.373A9.783 9.783 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818S21.818 6.579 21.818 12c0 5.421-4.397 9.818-9.818 9.818z"/></svg>
          Enquire on WhatsApp
        </a>
        <div class="detail-actions-row">
          <a href="/pages/booking.html?car=${encodeURIComponent(car.name)}&id=${car.id}" class="btn btn-outline">Book Test Drive</a>
          <button class="btn btn-ghost" onclick="toggleWishlist('${car.id}')" id="wishlistBtn">${isWishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}</button>
        </div>
        <div class="detail-actions-row">
          <button class="btn btn-ghost" onclick="addToCompare('${car.id}')">⚖️ Add to Compare</button>
          <button class="btn btn-ghost" onclick="shareCarLink()">🔗 Share</button>
        </div>
      </div>

      <!-- Deposit lock CTA -->
      <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-4);margin-bottom:var(--space-6)">
        <div style="font-family:var(--font-display);font-size:var(--text-sm);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-2)">🔒 Lock This Car with 40% Deposit</div>
        <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">Deposit <strong style="color:var(--text-gold)">${formatNGN(Math.round(car.price_ngn * 0.4))}</strong> to secure this vehicle. Pay the rest over time.</div>
        <a href="${waMsg}" target="_blank" class="btn btn-primary btn-sm">Lock This Car Now</a>
      </div>
    </div>
  `;

  // Tabs section below
  container.insertAdjacentHTML('afterend', `
    <div style="padding-bottom:var(--space-16)">
      <div class="container">
        <!-- Tabs -->
        <div class="detail-tabs">
          <button class="detail-tab active" onclick="switchTab('description')">Description</button>
          <button class="detail-tab" onclick="switchTab('specs')">Specifications</button>
          <button class="detail-tab" onclick="switchTab('features')">Features</button>
          <button class="detail-tab" onclick="switchTab('enquiry')">Send Enquiry</button>
        </div>

        <div id="tab-description" class="tab-panel active">
          <p style="color:var(--text-secondary);line-height:1.9;max-width:800px">${car.description || 'No description available.'}</p>
        </div>

        <div id="tab-specs" class="tab-panel">
          <div class="specs-grid">${specsHTML || '<p style="color:var(--text-secondary)">No specifications available.</p>'}</div>
        </div>

        <div id="tab-features" class="tab-panel">
          <div class="features-list">${featuresHTML || '<p style="color:var(--text-secondary)">No features listed.</p>'}</div>
        </div>

        <div id="tab-enquiry" class="tab-panel">
          <div class="enquiry-block" style="max-width:560px">
            <div class="enquiry-title">Send an Enquiry</div>
            <form id="enquiryForm" style="display:flex;flex-direction:column;gap:var(--space-4)">
              <input type="hidden" id="enqCarId" value="${car.id}">
              <input type="hidden" id="enqCarName" value="${car.name}">
              <div class="form-group"><label class="form-label">Full Name *</label><input type="text" class="form-input" id="enqName" placeholder="Your name" required></div>
              <div class="form-group"><label class="form-label">Phone / WhatsApp *</label><input type="tel" class="form-input" id="enqPhone" placeholder="08XXXXXXXXX" required></div>
              <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="enqEmail" placeholder="your@email.com"></div>
              <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" id="enqMessage" placeholder="Any specific questions about this vehicle?"></textarea></div>
              <button type="submit" class="btn btn-primary btn-full">Send Enquiry</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `);

  initEnquiryForm();
  initReveal();
  window.car = car;
}

function switchImage(idx) {
  const img = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (img && car?.images?.[idx]) { img.src = car.images[idx]; }
  thumbs.forEach(t => t.classList.remove('active'));
  thumbs[idx]?.classList.add('active');
}

function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${name}`)?.classList.add('active');
  event.target.classList.add('active');
}

function shareCarLink() {
  if (navigator.share) {
    navigator.share({ title: car?.name, text: `Check out this ${car?.name} at Sarkinmota Autos!`, url: window.location.href });
  } else {
    navigator.clipboard?.writeText(window.location.href).then(() => showToast('Link Copied', 'Share this car with anyone.', 'success'));
  }
}

function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('enqName').value,
          phone: document.getElementById('enqPhone').value,
          email: document.getElementById('enqEmail').value,
          message: document.getElementById('enqMessage').value,
          car_id: document.getElementById('enqCarId').value,
          car_name: document.getElementById('enqCarName').value,
          source: 'car-detail'
        })
      });
      if (res.success) { showToast('Enquiry Sent!', 'We will contact you shortly.', 'success'); form.reset(); }
      else showToast('Error', res.error, 'error');
    } catch { showToast('Error', 'Please try again.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Send Enquiry'; }
  });
}

window.switchImage = switchImage;
window.switchTab = switchTab;
window.shareCarLink = shareCarLink;
