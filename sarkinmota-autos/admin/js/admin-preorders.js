let preData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Name</th><th>Phone</th><th>Brand</th><th>Car</th><th>Budget</th><th>Deposit</th><th>Notes</th><th>Date</th><th>Actions</th></tr>';
  await load();
});
async function load() {
  try {
    preData = await adminFetch('/api/preorders');
    render(preData);
  } catch { adminToast('Could not load pre-orders','error'); }
}
function render(data) {
  document.getElementById('tableInfo').textContent = `${data.length} pre-orders`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(p => `<tr>
        <td><strong>${p.name}</strong></td>
        <td><a href="tel:${p.phone}" style="color:var(--text-gold)">${p.phone}</a></td>
        <td>${p.brand||'—'}</td>
        <td>${p.car_name||'—'}</td>
        <td style="font-size:12px">${p.budget||'—'}</td>
        <td style="font-size:12px">${p.deposit||'—'}</td>
        <td style="max-width:160px;font-size:12px;color:var(--text-muted)">${p.notes||'—'}</td>
        <td style="font-size:12px">${adminFormatDate(p.date_submitted)}</td>
        <td><div class="action-actions">
          <a href="https://wa.me/234${p.phone?.replace(/^0/,'')}" target="_blank" class="action-btn action-btn-approve">WhatsApp</a>
          <button onclick="del('${p.id}')" class="action-btn action-btn-delete">Delete</button>
        </div></td>
      </tr>`).join('')
    : '<tr><td colspan="9" class="table-empty">No pre-orders yet</td></tr>';
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase()||'';
  render(preData.filter(p => p.name?.toLowerCase().includes(q)||p.brand?.toLowerCase().includes(q)));
}
async function del(id) {
  if (!confirmDelete()) return;
  await adminFetch(`/api/preorders/${id}`,{method:'DELETE'});
  adminToast('Pre-order deleted','success'); load();
}
window.del=del; window.filterTable=filterTable;
