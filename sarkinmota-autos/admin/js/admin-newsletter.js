let nlData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Email</th><th>Name</th><th>Date Subscribed</th><th>Actions</th></tr>';
  await load();
});
async function load() {
  try {
    nlData = await adminFetch('/api/newsletter');
    render(nlData);
  } catch { adminToast('Could not load subscribers','error'); }
}
function render(data) {
  document.getElementById('tableInfo').textContent = `${data.length} subscribers`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(n => `<tr>
        <td><a href="mailto:${n.email}" style="color:var(--text-gold)">${n.email}</a></td>
        <td>${n.name||'—'}</td>
        <td>${adminFormatDate(n.date)}</td>
        <td><button onclick="del('${n.id}')" class="action-btn action-btn-delete">Unsubscribe</button></td>
      </tr>`).join('')
    : '<tr><td colspan="4" class="table-empty">No subscribers yet</td></tr>';
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase()||'';
  render(nlData.filter(n => n.email?.toLowerCase().includes(q)||n.name?.toLowerCase().includes(q)));
}
async function del(id) {
  if (!confirmDelete('Remove this subscriber?')) return;
  await adminFetch(`/api/newsletter/${id}`,{method:'DELETE'});
  adminToast('Subscriber removed','success'); load();
}
window.del=del; window.filterTable=filterTable;
