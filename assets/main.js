/* Gosier Pneus — main.js */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Mobile Nav ── */
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });
}

/* ── Hero Parallax (rAF-throttled, 60fps) ── */
if (!prefersReducedMotion) {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          heroBg.style.transform = `translateY(${y * 0.32}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ── Intersection Observer fade-in ── */
if (!prefersReducedMotion) {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));
  }
}

/* ── Vanilla stat counter (rAF + IntersectionObserver) ── */
if (!prefersReducedMotion) {
  document.querySelectorAll('.stat-item strong[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    let fired = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          observer.unobserve(el);
          let startTime = null;
          function tick(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

/* ── Header scroll shadow ── */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,.16)'
      : '0 2px 12px rgba(0,0,0,.08)';
  }, { passive: true });
}

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a[href]').forEach(link => {
  const href = link.getAttribute('href').split('/').pop();
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.setAttribute('aria-current', 'page');
  }
});

/* ── Contact form (no-op submit with feedback) ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    if (btn) {
      btn.textContent = '✓ Message envoyé !';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Envoyer le message';
        btn.disabled = false;
        contactForm.reset();
      }, 3500);
    }
  });
}
