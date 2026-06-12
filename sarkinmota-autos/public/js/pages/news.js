document.addEventListener('DOMContentLoaded', async () => {
  try {
    const news = await apiFetch('/api/news');
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = news.map(n => `
      <a href="/pages/news-detail.html?slug=${n.slug}" class="news-card">
        <div class="news-card-image"><img src="${n.image || '/assets/images/hero/news-placeholder.jpg'}" alt="${n.title}" loading="lazy"></div>
        <div class="news-card-body">
          <div class="news-card-category">${n.category}</div>
          <div class="news-card-title">${n.title}</div>
          <p class="news-card-excerpt">${truncate(n.excerpt, 120)}</p>
          <div class="news-card-meta"><span>${formatDate(n.date)}</span><span>•</span><span>${n.author}</span></div>
        </div>
      </a>`).join('');
    initReveal();
  } catch { console.error('News load error'); }
});
