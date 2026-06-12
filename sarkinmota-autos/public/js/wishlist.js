const wishlistManager = (() => {
  const KEY = 'sarkinmota_wishlist';
  const get = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (ids) => localStorage.setItem(KEY, JSON.stringify(ids));

  return {
    getAll: get,
    has: (id) => get().includes(id),
    add: (id) => { const w = get(); if (!w.includes(id)) { w.push(id); save(w); } },
    remove: (id) => save(get().filter(i => i !== id)),
    toggle: (id) => {
      if (wishlistManager.has(id)) { wishlistManager.remove(id); return false; }
      else { wishlistManager.add(id); return true; }
    },
    count: () => get().length,
    clear: () => localStorage.removeItem(KEY)
  };
})();

const toggleWishlist = (carId) => {
  const added = wishlistManager.toggle(carId);
  updateWishlistBadge();
  const btn = document.querySelector(`[data-wishlist-btn="${carId}"]`);
  if (btn) {
    btn.textContent = added ? '❤️' : '🤍';
    btn.classList.toggle('wishlisted', added);
  }
  showToast(
    added ? 'Added to Wishlist' : 'Removed from Wishlist',
    added ? 'Car saved. View your wishlist anytime.' : 'Car removed from your wishlist.',
    added ? 'success' : 'default'
  );
};

const updateWishlistBadge = () => {
  const count = wishlistManager.count();
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
};

document.addEventListener('DOMContentLoaded', updateWishlistBadge);

window.wishlistManager = wishlistManager;
window.toggleWishlist = toggleWishlist;
window.updateWishlistBadge = updateWishlistBadge;
