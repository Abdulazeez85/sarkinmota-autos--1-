// admin-bookings.js
let bookingsData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Name</th><th>Phone</th><th>Vehicle</th><th>Date</th><th>Time</th><th>Message</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>';
  await loadBookings();
});
async function loadBookings() {
  try {
    bookingsData = await adminFetch('/api/bookings');
    renderBookings(bookingsData);
  } catch { adminToast('Could not load bookings', 'error'); }
}
function renderBookings(data) {
  document.getElementById('tableInfo').textContent = `${data.length} bookings`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(b => `<tr>
        <td><strong>${b.name}</strong></td>
        <td><a href="tel:${b.phone}" style="color:var(--text-gold)">${b.phone}</a></td>
        <td>${b.car_name || '—'}</td>
        <td>${b.date || '—'}</td>
        <td>${b.time || '—'}</td>
        <td style="max-width:200px;font-size:12px;color:var(--text-muted)">${b.message || '—'}</td>
        <td style="font-size:12px">${adminFormatDate(b.date_submitted)}</td>
        <td><span class="pill pill-${b.status?.toLowerCase()||'pending'}">${b.status||'Pending'}</span></td>
        <td><div class="action-actions">
          <a href="https://wa.me/234${b.phone?.replace(/^0/,'')}" target="_blank" class="action-btn action-btn-approve">WhatsApp</a>
          <button onclick="updateBookingStatus('${b.id}','Confirmed')" class="action-btn action-btn-edit">Confirm</button>
          <button onclick="deleteBooking('${b.id}')" class="action-btn action-btn-delete">Delete</button>
        </div></td>
      </tr>`).join('')
    : '<tr><td colspan="9" class="table-empty">No bookings yet</td></tr>';
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase() || '';
  renderBookings(bookingsData.filter(b => b.name?.toLowerCase().includes(q) || b.phone?.includes(q) || b.car_name?.toLowerCase().includes(q)));
}
async function deleteBooking(id) {
  if (!confirmDelete()) return;
  await adminFetch(`/api/bookings/${id}`, {method:'DELETE'});
  adminToast('Booking deleted','success'); loadBookings();
}
async function updateBookingStatus(id, status) {
  await adminFetch(`/api/bookings/${id}`, {method:'PUT', body:JSON.stringify({status})});
  adminToast(`Status updated to ${status}`,'success'); loadBookings();
}
window.deleteBooking=deleteBooking; window.updateBookingStatus=updateBookingStatus; window.filterTable=filterTable;
