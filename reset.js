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
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.querySelector('.form-submit');
  const form = this;

  btn.textContent = 'Göndərilir...';
  btn.disabled = true;

  const data = {
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    email: form.email.value.trim(),
    package: form.package.value,
    note: form.note.value.trim(),
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btn.textContent = '✓ Göndərildi — Tezliklə əlaqə saxlayacağıq';
      btn.style.background = '#00C97A';
      form.reset();
    } else {
      const err = await res.json();
      btn.textContent = '✗ Xəta baş verdi — Yenidən cəhd edin';
      btn.style.background = '#ff4444';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = 'Pulsuz Konsultasiya →';
        btn.style.background = '';
      }, 3000);
    }
  } catch (err) {
    btn.textContent = '✗ Xəta baş verdi — Yenidən cəhd edin';
    btn.style.background = '#ff4444';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Pulsuz Konsultasiya →';
      btn.style.background = '';
    }, 3000);
  }
});
