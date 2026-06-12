const currencyManager = (() => {
  const KEY = 'sarkinmota_currency';
  let rate = 1545; // Default NGN/USD rate

  return {
    get: () => localStorage.getItem(KEY) || 'ngn',
    set: (c) => { localStorage.setItem(KEY, c); },
    toggle: () => {
      const cur = currencyManager.get();
      const next = cur === 'ngn' ? 'usd' : 'ngn';
      currencyManager.set(next);
      return next;
    },
    getRate: () => rate,
    setRate: (r) => { rate = r; },
    formatPrice: (ngnAmount, usdAmount) => {
      const cur = currencyManager.get();
      return cur === 'ngn' ? formatNGN(ngnAmount) : formatUSD(usdAmount);
    }
  };
})();

const initCurrencyToggle = () => {
  document.querySelectorAll('[data-currency-toggle]').forEach(btn => {
    updateCurrencyUI();
    btn.addEventListener('click', () => {
      const next = currencyManager.toggle();
      updateCurrencyUI();
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: next } }));
    });
  });
};

const updateCurrencyUI = () => {
  const cur = currencyManager.get();
  document.querySelectorAll('[data-currency-toggle]').forEach(btn => {
    btn.textContent = cur === 'ngn' ? '₦ NGN' : '$ USD';
  });
  document.querySelectorAll('[data-price-ngn]').forEach(el => {
    const ngn = el.dataset.priceNgn;
    const usd = el.dataset.priceUsd;
    el.textContent = cur === 'ngn' ? formatNGN(ngn) : formatUSD(usd);
  });
};

document.addEventListener('DOMContentLoaded', initCurrencyToggle);

window.currencyManager = currencyManager;
window.updateCurrencyUI = updateCurrencyUI;
