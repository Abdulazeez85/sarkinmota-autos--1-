let newsData = [];
document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard(); if (!ok) return;
  document.getElementById('tableHead').innerHTML = '<tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Featured</th><th>Actions</th></tr>';
  await load();
  addNewsForm();
});
async function load() {
  try {
    newsData = await adminFetch('/api/news');
    render(newsData);
  } catch { adminToast('Could not load news','error'); }
}
function render(data) {
  document.getElementById('tableInfo').textContent = `${data.length} articles`;
  document.getElementById('tableBody').innerHTML = data.length
    ? data.map(n => `<tr>
        <td><strong style="font-size:13px">${n.title}</strong></td>
        <td style="font-size:12px">${n.category||'—'}</td>
        <td style="font-size:12px">${n.author||'—'}</td>
        <td style="font-size:12px">${adminFormatDate(n.date)}</td>
        <td>${n.featured?'⭐':'—'}</td>
        <td><div class="action-actions">
          <a href="/pages/news-detail.html?slug=${n.slug}" target="_blank" class="action-btn action-btn-view">View</a>
          <button onclick="del('${n.id}')" class="action-btn action-btn-delete">Delete</button>
        </div></td>
      </tr>`).join('')
    : '<tr><td colspan="6" class="table-empty">No articles yet</td></tr>';
}
function addNewsForm() {
  const content = document.getElementById('pageContent');
  if (!content) return;
  const form = document.createElement('div');
  form.className = 'admin-form-panel'; form.style.marginBottom = '20px';
  form.innerHTML = `<div class="admin-form-title">➕ Add News Article</div>
    <div class="admin-form-grid" style="margin-bottom:16px">
      <div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="nTitle" placeholder="Article title" required></div>
      <div class="form-group"><label class="form-label">Category</label><input type="text" class="form-input" id="nCat" placeholder="e.g. New Arrivals"></div>
      <div class="form-group"><label class="form-label">Slug (URL)</label><input type="text" class="form-input" id="nSlug" placeholder="article-slug-here"></div>
      <div class="form-group"><label class="form-label">Author</label><input type="text" class="form-input" id="nAuthor" placeholder="Sarkinmota Autos Team" value="Sarkinmota Autos Team"></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">Excerpt</label><input type="text" class="form-input" id="nExcerpt" placeholder="Short description..."></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">Content</label><textarea class="form-textarea" id="nContent" rows="5" placeholder="Full article content..."></textarea></div>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <label class="form-checkbox"><input type="checkbox" id="nFeatured"><span class="form-checkbox-label">Featured Article</span></label>
      <button onclick="addArticle()" class="admin-btn admin-btn-primary">Publish Article</button>
    </div>`;
  content.insertBefore(form, content.firstChild);
}
async function addArticle() {
  const payload = {
    title: document.getElementById('nTitle').value,
    slug: document.getElementById('nSlug').value || document.getElementById('nTitle').value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
    category: document.getElementById('nCat').value,
    author: document.getElementById('nAuthor').value,
    excerpt: document.getElementById('nExcerpt').value,
    content: document.getElementById('nContent').value,
    featured: document.getElementById('nFeatured').checked,
  };
  if (!payload.title) return adminToast('Title is required','error');
  try {
    const res = await adminFetch('/api/news', {method:'POST', body:JSON.stringify(payload)});
    if (res.success) { adminToast('Article published!','success'); load(); }
    else adminToast(res.error,'error');
  } catch { adminToast('Server error','error'); }
}
async function del(id) {
  if (!confirmDelete()) return;
  await adminFetch(`/api/news/${id}`,{method:'DELETE'});
  adminToast('Article deleted','success'); load();
}
function filterTable() {
  const q = document.getElementById('tableSearch')?.value?.toLowerCase()||'';
  render(newsData.filter(n => n.title?.toLowerCase().includes(q)));
}
window.addArticle=addArticle; window.del=del; window.filterTable=filterTable;
