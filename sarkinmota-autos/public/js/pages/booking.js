document.addEventListener('DOMContentLoaded', async () => {
  await loadCarOptions();
  setMinDate();
  readURLParams();
  bindForm();
});

async function loadCarOptions() {
  try {
    const cars = await apiFetch('/api/cars?status=Available');
    const sel = document.getElementById('bkCar');
    if (!sel) return;
    cars.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id; o.dataset.name = c.name;
      o.textContent = `${c.name} — ${formatNGN(c.price_ngn)}`;
      sel.appendChild(o);
    });
  } catch {}
}

function setMinDate() {
  const d = document.getElementById('bkDate');
  if (d) { const t = new Date(); t.setDate(t.getDate() + 1); d.min = t.toISOString().split('T')[0]; }
}

function readURLParams() {
  const p = new URLSearchParams(window.location.search);
  if (p.get('car')) {
    const sel = document.getElementById('bkCar');
    if (sel) {
      const opts = [...sel.options];
      const match = opts.find(o => o.dataset.name === p.get('car') || o.value === p.get('id'));
      if (match) match.selected = true;
    }
  }
}

function bindForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Booking...';
    const carSel = document.getElementById('bkCar');
    const carName = carSel?.options[carSel.selectedIndex]?.dataset?.name || carSel?.value;
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('bkName').value,
          phone: document.getElementById('bkPhone').value,
          email: document.getElementById('bkEmail').value,
          car_id: document.getElementById('bkCar').value,
          car_name: carName,
          date: document.getElementById('bkDate').value,
          time: document.getElementById('bkTime').value,
          message: document.getElementById('bkMessage').value,
        })
      });
      if (res.success) {
        showToast('Booking Confirmed!', 'We will contact you within 2 hours to confirm your test drive.', 'success');
        form.reset();
      } else showToast('Error', res.error || 'Could not submit booking.', 'error');
    } catch { showToast('Error', 'Please try again.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Confirm Test Drive Booking'; }
  });
}
