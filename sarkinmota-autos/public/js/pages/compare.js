document.addEventListener('DOMContentLoaded', async () => {
  await loadCompareGrid();
});

async function loadCompareGrid() {
  const ids = compareManager.getAll();
  const grid = document.getElementById('compareGrid');
  const empty = document.getElementById('compareEmpty');
  if (!grid) return;
  if (!ids.length) {
    if (empty) empty.style.display = 'block';
    grid.style.display = 'none';
    return;
  }
  try {
    const allCars = await apiFetch('/api/cars');
    const selected = allCars.filter(c => ids.includes(c.id));
    if (!selected.length) { if (empty) empty.style.display = 'block'; return; }

    const allKeys = ['brand','year','type','condition','mileage','fuel','transmission','engine','seats','color','price_ngn'];
    const specKeys = Object.keys(selected[0]?.specs || {});

    let html = `<div style="display:grid;grid-template-columns:200px repeat(${selected.length},1fr);gap:0;border:1px solid var(--border-color);border-radius:var(--radius-md);overflow:hidden">`;

    // Header row
    html += `<div style="padding:var(--space-4);background:var(--bg-secondary);border-right:1px solid var(--border-color)"></div>`;
    selected.forEach(c => {
      html += `<div style="padding:var(--space-5);background:var(--bg-secondary);border-right:1px solid var(--border-color);text-align:center">
        <img src="${c.images?.[0] || '/assets/images/cars/placeholder.jpg'}" style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:var(--space-3)">
        <div style="font-family:var(--font-display);font-weight:800;font-size:var(--text-base);text-transform:uppercase;margin-bottom:var(--space-2)">${c.name}</div>
        <div style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:900;background:var(--gold-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${formatNGN(c.price_ngn)}</div>
        <div style="display:flex;gap:var(--space-2);justify-content:center;margin-top:var(--space-3)">
          <a href="/pages/car-detail.html?id=${c.id}" class="btn btn-primary btn-sm">View</a>
          <button class="btn btn-ghost btn-sm" onclick="removeFromCompare('${c.id}')">Remove</button>
        </div>
      </div>`;
    });

    // Data rows
    const rows = [
      { label: 'Brand', key: 'brand' }, { label: 'Year', key: 'year' }, { label: 'Type', key: 'type' },
      { label: 'Condition', key: 'condition' }, { label: 'Mileage', key: 'mileage' }, { label: 'Fuel', key: 'fuel' },
      { label: 'Transmission', key: 'transmission' }, { label: 'Engine', key: 'engine' }, { label: 'Seats', key: 'seats' },
      { label: 'Color', key: 'color' }, { label: 'Duty Paid', key: 'duty_paid' }, { label: 'Status', key: 'status' },
    ];

    rows.forEach((row, ri) => {
      const bg = ri % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)';
      html += `<div style="padding:var(--space-3) var(--space-4);background:${bg};border-right:1px solid var(--border-color);border-top:1px solid var(--divider);font-family:var(--font-display);font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center">${row.label}</div>`;
      selected.forEach(c => {
        let val = c[row.key];
        if (row.key === 'duty_paid') val = val ? '✓ Yes' : '✗ No';
        html += `<div style="padding:var(--space-3) var(--space-4);background:${bg};border-right:1px solid var(--border-color);border-top:1px solid var(--divider);text-align:center;font-size:var(--text-sm);color:var(--text-secondary)">${val || '—'}</div>`;
      });
    });

    // Spec rows
    if (specKeys.length) {
      specKeys.forEach((sk, si) => {
        const bg = (rows.length + si) % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)';
        html += `<div style="padding:var(--space-3) var(--space-4);background:${bg};border-right:1px solid var(--border-color);border-top:1px solid var(--divider);font-family:var(--font-display);font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center">${sk.replace(/_/g,' ')}</div>`;
        selected.forEach(c => {
          html += `<div style="padding:var(--space-3) var(--space-4);background:${bg};border-right:1px solid var(--border-color);border-top:1px solid var(--divider);text-align:center;font-size:var(--text-sm);color:var(--text-secondary)">${c.specs?.[sk] || '—'}</div>`;
        });
      });
    }

    html += '</div>';
    grid.innerHTML = html;
  } catch (e) { grid.innerHTML = '<div class="empty-state"><p>Could not load comparison.</p></div>'; }
}

function removeFromCompare(id) {
  compareManager.remove(id);
  updateCompareBadge();
  loadCompareGrid();
}

document.getElementById('clearCompareBtn')?.addEventListener('click', () => {
  compareManager.clear();
  updateCompareBadge();
  loadCompareGrid();
});

window.removeFromCompare = removeFromCompare;
