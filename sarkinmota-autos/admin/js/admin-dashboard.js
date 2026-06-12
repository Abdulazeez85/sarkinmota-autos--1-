document.addEventListener('DOMContentLoaded', async () => {
  const ok = await adminAuth.guard();
  if (!ok) return;
  loadStats();
});

async function loadStats() {
  try {
    const stats = await adminFetch('/api/admin/stats');

    // Stat cards
    document.getElementById('statCars').textContent = stats.total_cars;
    document.getElementById('statCarsub').textContent = `${stats.available_cars} available · ${stats.sold_cars} sold`;
    document.getElementById('statBookings').textContent = stats.total_bookings;
    document.getElementById('statBookingsSub').textContent = `${stats.pending_bookings} pending`;
    document.getElementById('statEnquiries').textContent = stats.total_enquiries;
    document.getElementById('statEnqSub').textContent = `${stats.new_enquiries} new`;
    document.getElementById('statNews').textContent = stats.newsletter_subscribers;
    document.getElementById('statViews').textContent = stats.total_views.toLocaleString();
    document.getElementById('statPreorders').textContent = stats.total_preorders;
    document.getElementById('statSwaps').textContent = stats.total_swaps;
    document.getElementById('statSwapsSub').textContent = `${stats.pending_swaps} pending`;
    document.getElementById('statSold').textContent = stats.sold_cars;

    // Sidebar badges
    if (stats.pending_bookings > 0) {
      const el = document.getElementById('sbBookings');
      if (el) { el.textContent = stats.pending_bookings; el.style.display = 'inline'; }
    }
    if (stats.new_enquiries > 0) {
      const el = document.getElementById('sbEnquiries');
      if (el) { el.textContent = stats.new_enquiries; el.style.display = 'inline'; }
    }

    // Most viewed
    const mvEl = document.getElementById('mostViewed');
    if (mvEl) {
      mvEl.innerHTML = stats.most_viewed?.length
        ? `<div class="top-list">${stats.most_viewed.map((c, i) => `<div class="top-list-item"><div class="top-list-rank">#${i+1}</div><div class="top-list-name">${c.name}</div><div class="top-list-count">${c.views} views</div></div>`).join('')}</div>`
        : '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px">No view data yet</div>';
    }

    // Most enquired
    const meEl = document.getElementById('mostEnquired');
    if (meEl) {
      meEl.innerHTML = stats.most_enquired?.length
        ? `<div class="top-list">${stats.most_enquired.map((c, i) => `<div class="top-list-item"><div class="top-list-rank">#${i+1}</div><div class="top-list-name">${c.name}</div><div class="top-list-count">${c.enquiries} enquiries</div></div>`).join('')}</div>`
        : '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px">No enquiry data yet</div>';
    }

    loadRecentBookings();
    loadRecentEnquiries();
  } catch (e) {
    console.error('Dashboard stats error:', e);
    adminToast('Could not load dashboard stats', 'error');
  }
}

async function loadRecentBookings() {
  try {
    const bookings = await adminFetch('/api/bookings');
    const tbody = document.getElementById('recentBookings');
    if (!tbody) return;
    const recent = bookings.slice(0, 5);
    tbody.innerHTML = recent.length
      ? recent.map(b => `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td><a href="tel:${b.phone}" style="color:var(--text-gold)">${b.phone}</a></td>
          <td>${b.car_name || '—'}</td>
          <td>${adminFormatDate(b.date)}</td>
          <td><span class="pill pill-${b.status?.toLowerCase() || 'pending'}">${b.status || 'Pending'}</span></td>
          <td><div class="action-actions">
            <a href="https://wa.me/234${b.phone?.replace(/^0/, '')}" target="_blank" class="action-btn action-btn-approve">WhatsApp</a>
            <button onclick="deleteBooking('${b.id}')" class="action-btn action-btn-delete">Delete</button>
          </div></td>
        </tr>`).join('')
      : '<tr><td colspan="6" class="table-empty">No bookings yet</td></tr>';
  } catch {}
}

async function loadRecentEnquiries() {
  try {
    const enquiries = await adminFetch('/api/enquiries');
    const tbody = document.getElementById('recentEnquiries');
    if (!tbody) return;
    const recent = enquiries.slice(0, 5);
    tbody.innerHTML = recent.length
      ? recent.map(e => `
        <tr>
          <td><strong>${e.name}</strong></td>
          <td><a href="tel:${e.phone}" style="color:var(--text-gold)">${e.phone}</a></td>
          <td>${e.car_name || '—'}</td>
          <td style="text-transform:capitalize">${e.source?.replace(/-/g,' ') || 'Website'}</td>
          <td>${adminFormatDate(e.date_submitted)}</td>
          <td><span class="pill pill-${e.status?.toLowerCase() || 'new'}">${e.status || 'New'}</span></td>
        </tr>`).join('')
      : '<tr><td colspan="6" class="table-empty">No enquiries yet</td></tr>';
  } catch {}
}

async function deleteBooking(id) {
  if (!confirmDelete()) return;
  try {
    await adminFetch(`/api/bookings/${id}`, { method: 'DELETE' });
    adminToast('Booking deleted', 'success');
    loadRecentBookings();
    loadStats();
  } catch { adminToast('Could not delete booking', 'error'); }
}

window.deleteBooking = deleteBooking;
