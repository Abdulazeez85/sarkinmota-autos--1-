let enqData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Name</th><th>Phone</th><th>Email</th><th>Vehicle</th><th>Message</th><th>Source</th><th>Date</th><th>Status</th><th>Actions</th></tr>';
  await loadEnquiries();
});
async function loadEnquiries() {
  try {
    enqData = await adminFetch('/api/enquiries');
    renderEnquiries(enqData);
  } catch { adminToast('Could not load enquiries', 'error'); }
}
function renderEnquiries(data) {
  document.getElementById('tableInfo').textContent = `${data.length} enquiries`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(e => `<tr>
        <td><strong>${e.name}</strong></td>
        <td><a href="tel:${e.phone}" style="color:var(--text-gold)">${e.phone}</a></td>
        <td style="font-size:12px">${e.email||'—'}</td>
        <td>${e.car_name||'—'}</td>
        <td style="max-width:180px;font-size:12px;color:var(--text-muted)">${e.message||'—'}</td>
        <td style="font-size:11px;text-transform:capitalize">${e.source?.replace(/-/g,' ')||'website'}</td>
        <td style="font-size:12px">${adminFormatDate(e.date_submitted)}</td>
        <td><span class="pill pill-${e.status?.toLowerCase()||'new'}">${e.status||'New'}</span></td>
        <td><div class="action-actions">
          <a href="https://wa.me/234${e.phone?.replace(/^0/,'')}" target="_blank" class="action-btn action-btn-approve">WhatsApp</a>
          <button onclick="updateStatus('${e.id}','Contacted')" class="action-btn action-btn-edit">Contacted</button>
          <button onclick="deleteEnq('${e.id}')" class="action-btn action-btn-delete">Delete</button>
        </div></td>
      </tr>`).join('')
    : '<tr><td colspan="9" class="table-empty">No enquiries yet</td></tr>';
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase()||'';
  renderEnquiries(enqData.filter(e => e.name?.toLowerCase().includes(q)||e.phone?.includes(q)||e.car_name?.toLowerCase().includes(q)));
}
async function deleteEnq(id) {
  if (!confirmDelete()) return;
  await adminFetch(`/api/enquiries/${id}`,{method:'DELETE'});
  adminToast('Enquiry deleted','success'); loadEnquiries();
}
async function updateStatus(id,status) {
  await adminFetch(`/api/enquiries/${id}`,{method:'PUT',body:JSON.stringify({status})});
  adminToast('Status updated','success'); loadEnquiries();
}
window.deleteEnq=deleteEnq; window.updateStatus=updateStatus; window.filterTable=filterTable;
