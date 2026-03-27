// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .service-card, .price-card, .process-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '48px'; ring.style.height = '48px';
    ring.style.borderColor = 'rgba(0,255,148,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '32px'; ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0,255,148,0.4)';
  });
});

// Intersection observer for scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.service-card, .price-card, .process-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Form submit
document.querySelector('.form-submit').addEventListener('click', function() {
  this.textContent = '✓ Göndərildi — Tezliklə əlaqə saxlayacağıq';
  this.style.background = '#00C97A';
  this.disabled = true;
});
