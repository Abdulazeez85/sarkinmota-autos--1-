let allCars = [];
let filteredCars = [];
let currentPage = 1;
const PER_PAGE = 15;
let statusFilter = '';

document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard();
  if (!ok) return;
  await loadCars();
});

async function loadCars() {
  try {
    allCars = await adminFetch('/api/cars');
    filteredCars = [...allCars];
    renderCars();
  } catch {
    document.getElementById('carsTableBody').innerHTML = '<tr><td colspan="8" class="table-empty">Could not load vehicles.</td></tr>';
    adminToast('Could not load inventory', 'error');
  }
}

function filterCars() {
  const q = document.getElementById('carsSearch')?.value?.toLowerCase() || '';
  filteredCars = allCars.filter(c => {
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  currentPage = 1;
  renderCars();
}

function filterByStatus(status) {
  statusFilter = status;
  document.querySelectorAll('[data-status]').forEach(btn => btn.classList.remove('active-filter', 'action-btn-view'));
  const active = document.querySelector(`[data-status="${status}"]`);
  if (active) active.classList.add('active-filter', 'action-btn-view');
  filterCars();
}

function renderCars() {
  const tbody = document.getElementById('carsTableBody');
  const countEl = document.getElementById('carsCount');
  const paginationInfo = document.getElementById('carsPaginationInfo');
  if (!tbody) return;

  const start = (currentPage - 1) * PER_PAGE;
  const paginated = filteredCars.slice(start, start + PER_PAGE);

  if (countEl) countEl.textContent = filteredCars.length;

  tbody.innerHTML = paginated.length
    ? paginated.map(c => `
      <tr>
        <td><img src="${c.images?.[0] || '/assets/images/cars/placeholder.jpg'}" class="table-car-img" onerror="this.src='/assets/images/cars/placeholder.jpg'"></td>
        <td><div class="table-car-name">${c.name}</div><div class="table-car-brand">${c.brand} · ${c.year}</div></td>
        <td style="font-weight:600;color:var(--text-gold);font-size:13px">${adminFormatNGN(c.price_ngn)}</td>
        <td style="font-size:12px">${c.type}</td>
        <td style="font-size:12px">${c.condition}</td>
        <td><span class="pill pill-${c.status?.toLowerCase().replace(' ','-') || 'available'}">${c.status || 'Available'}</span></td>
        <td style="color:var(--text-muted);font-size:12px">${c.views || 0}</td>
        <td>
          <div class="action-actions">
            <a href="/admin/pages/edit-car.html?id=${c.id}" class="action-btn action-btn-edit">Edit</a>
            <button onclick="quickStatus('${c.id}', '${c.status}')" class="action-btn action-btn-approve">Status</button>
            <button onclick="deleteCar('${c.id}')" class="action-btn action-btn-delete">Delete</button>
          </div>
        </td>
      </tr>`).join('')
    : '<tr><td colspan="8" class="table-empty">No vehicles found</td></tr>';

  if (paginationInfo) paginationInfo.textContent = `Showing ${start + 1}–${Math.min(start + PER_PAGE, filteredCars.length)} of ${filteredCars.length} vehicles`;
  renderPagination();
}

function renderPagination() {
  const container = document.getElementById('carsPaginationBtns');
  if (!container) return;
  const total = Math.ceil(filteredCars.length / PER_PAGE);
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="admin-page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

function goPage(p) { currentPage = p; renderCars(); }

async function deleteCar(id) {
  if (!confirmDelete('Delete this vehicle? This cannot be undone.')) return;
  try {
    await adminFetch(`/api/cars/${id}`, { method: 'DELETE' });
    adminToast('Vehicle deleted successfully', 'success');
    allCars = allCars.filter(c => c.id !== id);
    filteredCars = filteredCars.filter(c => c.id !== id);
    renderCars();
  } catch { adminToast('Could not delete vehicle', 'error'); }
}

async function quickStatus(id, current) {
  const statuses = ['Available', 'Sold', 'On Order', 'Coming Soon'];
  const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
  if (!confirm(`Change status to "${next}"?`)) return;
  try {
    await adminFetch(`/api/cars/${id}`, { method: 'PUT', body: JSON.stringify({ status: next }) });
    adminToast(`Status updated to ${next}`, 'success');
    const car = allCars.find(c => c.id === id);
    if (car) car.status = next;
    const fcar = filteredCars.find(c => c.id === id);
    if (fcar) fcar.status = next;
    renderCars();
  } catch { adminToast('Could not update status', 'error'); }
}

window.filterByStatus = filterByStatus;
window.deleteCar = deleteCar;
window.quickStatus = quickStatus;
window.goPage = goPage;
window.filterCars = filterCars;
