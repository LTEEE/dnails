// ─── Nav: solid on scroll ─────────────────────
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 80);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── Mobile Nav Toggle ────────────────────────
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ─── Smooth Anchor Scroll ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 20);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Hero Canvas Shimmer ──────────────────────
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['rgba(201,137,107,', 'rgba(184,151,90,', 'rgba(232,180,154,', 'rgba(255,240,220,'];
  let W, H, particles, frame = 0;

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = Math.min(Math.floor((W * H) / 22000), 20);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 100 + 30,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      base: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.18 + 0.06,
      phase: Math.random() * Math.PI * 2,
      freq: Math.random() * 0.002 + 0.001
    }));
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      const r = p.r * (1 + 0.1 * Math.sin(frame * p.freq + p.phase));
      const grad = ctx.createRadialGradient(p.x - r * 0.2, p.y - r * 0.2, r * 0.05, p.x, p.y, r);
      grad.addColorStop(0, p.base + (p.a * 1.5) + ')');
      grad.addColorStop(1, p.base + '0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
    });
    frame++; requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();

// ─── Universal Scroll Observer ────────────────
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains('fade-in')) {
      const idx = [...entry.target.parentElement.children].filter(c => c.classList.contains('fade-in')).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 80, 400));
    } else if (entry.target.classList.contains('hero__stats')) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / 1800, 1);
          el.textContent = Math.round((1 - Math.pow(1 - progress, 3)) * target);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
    scrollObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .hero__stats').forEach(el => scrollObserver.observe(el));

// ─── Hero Load Animation ──────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-up').forEach((el, i) => setTimeout(() => el.classList.add('visible'), 200 + i * 120));
});

// ─── Parallax Effect ──────────────────────────
const parallaxBgs = document.querySelectorAll('.parallax-bg');
const updateParallax = () => {
  parallaxBgs.forEach(bg => {
    const rect = (bg.closest('.booking-cta') || bg.parentElement).getBoundingClientRect();
    bg.style.transform = `translateY(${(rect.top + rect.height / 2 - window.innerHeight / 2) * (bg.dataset.speed || 0.3)}px)`;
  });
};
window.addEventListener('scroll', updateParallax, { passive: true });

// ─── Tab Switcher ─────────────────────────────
document.querySelectorAll('.social-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.social-tab, .social-panel').forEach(el => el.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab)?.classList.add('active');
  });
});

// ─── Gallery Hover ────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  const img = item.querySelector('img');
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5, y = (e.clientY - rect.top) / rect.height - 0.5;
    if (img) img.style.transform = `scale(1.07) translate(${x * 8}px, ${y * 8}px)`;
  });
  item.addEventListener('mouseleave', () => img && (img.style.transform = ''));
});

// ─── Marquee Pause ────────────────────────────
const marquee = document.querySelector('.marquee__track');
const marqueeWrap = document.querySelector('.marquee-wrap');
marqueeWrap?.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
marqueeWrap?.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');

// ─── Form Handling ────────────────────────────
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form-submit');
  const oldText = btn.textContent;
  btn.textContent = 'Wiadomość wysłana!'; btn.style.background = 'var(--accent-gold)'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = oldText; btn.style.background = ''; btn.disabled = false;
    contactForm.reset();
  }, 4000);
});

