document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('preorderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Submitting...';
    try {
      const res = await apiFetch('/api/preorders', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('poName').value,
          phone: document.getElementById('poPhone').value,
          email: document.getElementById('poEmail').value,
          brand: document.getElementById('poBrand').value,
          car_name: document.getElementById('poCar').value,
          budget: document.getElementById('poBudget').value,
          deposit: document.getElementById('poDeposit').value,
          notes: document.getElementById('poNotes').value,
        })
      });
      if (res.success) { showToast('Request Submitted!', res.message, 'success'); e.target.reset(); }
      else showToast('Error', res.error, 'error');
    } catch { showToast('Error', 'Please try again.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Submit VIP Request'; }
  });
});
