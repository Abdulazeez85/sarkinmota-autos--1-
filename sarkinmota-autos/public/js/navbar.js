document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  hamburger?.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      hamburger?.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Active nav link
  const current = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && current.includes(href) && href !== '/') {
      link.classList.add('active');
    }
    if (href === '/' && (current === '/' || current === '/index.html')) {
      link.classList.add('active');
    }
  });
});
