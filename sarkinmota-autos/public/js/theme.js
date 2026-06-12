(() => {
  const THEME_KEY = 'sarkinmota_theme';

  const getTheme = () => localStorage.getItem(THEME_KEY) || 'dark';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.icon-moon').forEach(el => {
      el.style.display = theme === 'light' ? 'none' : '';
    });
    document.querySelectorAll('.icon-sun').forEach(el => {
      el.style.display = theme === 'dark' ? 'none' : '';
    });
  };

  const toggleTheme = () => {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Apply on load
  applyTheme(getTheme());

  // Bind toggle buttons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  window.themeToggle = toggleTheme;
  window.getTheme = getTheme;
})();
