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

/* ── GSAP micro-interactions ── */
function initGsap() {
  if (typeof gsap === 'undefined' || prefersReducedMotion) return;

  /* Hero headline entrance */
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroH1      = document.querySelector('.hero-content h1');
  const heroP       = document.querySelector('.hero-content p');
  const heroActions = document.querySelector('.hero-actions');

  if (heroH1) {
    gsap.from([heroEyebrow, heroH1, heroP, heroActions].filter(Boolean), {
      y: 36,
      opacity: 0,
      duration: 0.85,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.25
    });
  }

  /* Service card visual icon bounce */
  document.querySelectorAll('.service-card-visual').forEach(el => {
    const icon = el.querySelector('span, div');
    if (!icon) return;
    el.closest('.service-card')?.addEventListener('mouseenter', () => {
      gsap.to(icon, { y: -6, duration: 0.25, ease: 'power2.out' });
    });
    el.closest('.service-card')?.addEventListener('mouseleave', () => {
      gsap.to(icon, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* CTA buttons scale on hover */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.04, duration: 0.2, ease: 'power1.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.out' });
    });
  });

  /* Phone float pulse */
  const phoneFloat = document.querySelector('.phone-float');
  if (phoneFloat) {
    gsap.to(phoneFloat, {
      boxShadow: '0 4px 28px rgba(217,119,6,.75)',
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: 'sine.inOut'
    });
  }

  /* Stat counter animation */
  document.querySelectorAll('.stat-item strong[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.from({ val: 0 }, {
            val: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            }
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

if (typeof gsap !== 'undefined') {
  initGsap();
} else {
  window.addEventListener('load', initGsap);
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
