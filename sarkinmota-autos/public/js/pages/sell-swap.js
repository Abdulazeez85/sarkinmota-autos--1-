document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('swapForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Submitting...';
    try {
      const res = await apiFetch('/api/swaps', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('swName').value,
          phone: document.getElementById('swPhone').value,
          email: document.getElementById('swEmail').value,
          car_make: document.getElementById('swMake').value,
          car_model: document.getElementById('swModel').value,
          car_year: document.getElementById('swYear').value,
          mileage: document.getElementById('swMileage').value,
          condition: document.getElementById('swCondition').value,
          asking_price: document.getElementById('swPrice').value,
          target_car: document.getElementById('swTarget').value,
          notes: document.getElementById('swNotes').value,
        })
      });
      if (res.success) { showToast('Request Submitted!', res.message, 'success'); e.target.reset(); }
      else showToast('Error', res.error, 'error');
    } catch { showToast('Error', 'Please try again.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Submit Sell / Swap Request'; }
  });
});
