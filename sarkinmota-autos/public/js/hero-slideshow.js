document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('[data-hero-img]');
  if (images.length < 2) return;

  let current = 0;
  const SLIDE_DURATION = 6000; // 6 seconds per image

  setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  }, SLIDE_DURATION);
});