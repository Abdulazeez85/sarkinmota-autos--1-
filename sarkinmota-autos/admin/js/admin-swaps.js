let swapData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Name</th><th>Phone</th><th>Car Make</th><th>Model</th><th>Year</th><th>Mileage</th><th>Asking Price</th><th>Target Car</th><th>Status</th><th>Actions</th></tr>';
  await load();
});
async function load() {
  try {
    swapData = await adminFetch('/api/swaps');
    render(swapData);
  } catch { adminToast('Could not load swap requests','error'); }
}
function render(data) {
  document.getElementById('tableInfo').textContent = `${data.length} swap requests`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(s => `<tr>
        <td><strong>${s.name}</strong></td>
        <td><a href="tel:${s.phone}" style="color:var(--text-gold)">${s.phone}</a></td>
        <td>${s.car_make||'—'}</td><td>${s.car_model||'—'}</td>
        <td>${s.car_year||'—'}</td><td style="font-size:12px">${s.mileage||'—'}</td>
        <td style="font-size:12px;color:var(--text-gold)">${s.asking_price?'₦'+Number(s.asking_price).toLocaleString():'—'}</td>
        <td style="font-size:12px">${s.target_car||'—'}</td>
        <td><span class="pill pill-pending">${s.status||'Pending'}</span></td>
        <td><div class="action-actions">
          <a href="https://wa.me/234${s.phone?.replace(/^0/,'')}" target="_blank" class="action-btn action-btn-approve">WhatsApp</a>
          <button onclick="del('${s.id}')" class="action-btn action-btn-delete">Delete</button>
        </div></td>
      </tr>`).join('')
    : '<tr><td colspan="10" class="table-empty">No swap requests yet</td></tr>';
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase()||'';
  render(swapData.filter(s => s.name?.toLowerCase().includes(q)||s.car_make?.toLowerCase().includes(q)));
}
async function del(id) {
  if (!confirmDelete()) return;
  await adminFetch(`/api/swaps/${id}`,{method:'DELETE'});
  adminToast('Deleted','success'); load();
}
window.del=del; window.filterTable=filterTable;
