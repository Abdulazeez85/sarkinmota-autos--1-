document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('ctName').value,
          phone: document.getElementById('ctPhone').value,
          email: document.getElementById('ctEmail').value,
          message: document.getElementById('ctMessage').value,
          source: 'contact-page'
        })
      });
      if (res.success) { showToast('Message Sent!', 'We will respond within 24 hours.', 'success'); e.target.reset(); }
      else showToast('Error', res.error, 'error');
    } catch { showToast('Error', 'Please try again.', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Send Message'; }
  });
});
