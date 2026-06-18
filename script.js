/* ═══════════════════════════════════════
   script.js — Pravin Dabhade Portfolio
   Freelance AI Engineer & App Developer
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Header scroll effect ── */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── 2. Mobile menu toggle ── */
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('show')) {
        nav.classList.remove('show');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target.length > 1) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        if (nav && nav.classList.contains('show')) {
          nav.classList.remove('show');
          toggle && toggle.classList.remove('open');
          toggle && toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ── 4. Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 5. Active nav on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 6. Scroll reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.section-title, .section-kicker, .section-sub, ' +
    '.about-text, .about-card, ' +
    '.service-card, .project-card, ' +
    '.skills-cat, .timeline-card, ' +
    '.contact-item, .contact-form, ' +
    '.hero-content, .hero-card'
  ).forEach(el => {
    el.classList.add('pre-reveal');
    revealObserver.observe(el);
  });

  /* ── 7. Stagger reveal for grids ── */
  const staggerParents = document.querySelectorAll(
    '.services-grid, .projects-grid, .skills-categories, .contact-info'
  );
  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.service-card, .project-card, .skills-cat, .contact-item');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  /* ── 8. Contact form async submit ── */
  const form    = document.getElementById('contactForm');
  const status  = document.getElementById('formStatus');
  const btnText = document.getElementById('btnText');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btnText) btnText.textContent = 'Sending…';
      status.textContent = '';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          if (btnText) btnText.textContent = '✓ Message Sent!';
          status.textContent = "Thanks! I'll get back to you within 24 hours.";
          status.style.color = '#6ee7b7';
          form.reset();
          setTimeout(() => {
            if (btnText) btnText.textContent = 'Send Message →';
            status.textContent = '';
          }, 5000);
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (btnText) btnText.textContent = 'Send Message →';
        status.textContent = 'Could not send. Please email me directly.';
        status.style.color = '#f87171';
      }
    });
  }

  /* ── 9. Typed effect on hero subtitle ── */
  const roles = ['AI Engineer', 'App Developer', 'ML Specialist', 'Full Stack Dev', 'XAI Researcher'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    function typeLoop() {
      const current = roles[roleIndex];
      if (isDeleting) {
        typedEl.textContent = current.slice(0, --charIndex);
      } else {
        typedEl.textContent = current.slice(0, ++charIndex);
      }

      let delay = isDeleting ? 60 : 110;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

});