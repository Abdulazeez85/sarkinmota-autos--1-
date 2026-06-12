document.addEventListener('DOMContentLoaded', async () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) return window.location.href = '/pages/news.html';
  try {
    const article = await apiFetch(`/api/news/${slug}`);
    if (article.error) return window.location.href = '/pages/404.html';
    document.title = `${article.title} — Sarkinmota Autos`;
    const container = document.getElementById('articleContent');
    if (!container) return;
    container.innerHTML = `
      <div style="margin-bottom:var(--space-4)">
        <span style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-gold)">${article.category}</span>
      </div>
      <h1 style="font-size:clamp(var(--text-3xl),5vw,var(--text-5xl));font-weight:900;text-transform:uppercase;line-height:1.05;margin-bottom:var(--space-5)">${article.title}</h1>
      <div style="display:flex;gap:var(--space-4);font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-8);padding-bottom:var(--space-8);border-bottom:1px solid var(--divider)">
        <span>${formatDate(article.date)}</span><span>•</span><span>${article.author}</span>
      </div>
      ${article.image ? `<img src="${article.image}" alt="${article.title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--radius-md);margin-bottom:var(--space-8)">` : ''}
      <div style="color:var(--text-secondary);line-height:2;font-size:var(--text-lg)">${(article.content || '').replace(/\n\n/g, '</p><p style="margin-bottom:var(--space-5)">').replace(/^/, '<p style="margin-bottom:var(--space-5)">').replace(/$/, '</p>')}</div>
    `;
    initReveal();
  } catch { window.location.href = '/pages/404.html'; }
});
