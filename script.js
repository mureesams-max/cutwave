/* ========================================
   CUTWAVE v2 — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll ----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---- Mobile nav ----
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
      document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
      document.body.style.overflow = '';
    }));
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    q.addEventListener('click', () => {
      const open = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!open) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Waitlist form ----
  const form = document.getElementById('waitlist-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const btn = form.querySelector('.waitlist-submit');
      const email = emailInput.value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.textContent = 'Joining...';

      const key = form.querySelector('input[name="access_key"]');
      if (key && key.value && key.value !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: new FormData(form)
          });
          const data = await res.json();
          if (data.success) { showSuccess(); return; }
        } catch (_) {}
      }
      // Fallback
      saveLocal(email);
      showSuccess();
    });
  }

  function showSuccess() {
    const f = document.getElementById('waitlist-form');
    const s = document.getElementById('waitlist-success');
    const n = document.querySelector('.waitlist-note');
    const c = document.querySelector('.waitlist-counter');
    if (f) f.style.display = 'none';
    if (n) n.style.display = 'none';
    if (c) c.style.display = 'none';
    if (s) s.classList.add('show');
  }

  function saveLocal(email) {
    const list = JSON.parse(localStorage.getItem('cutwave_waitlist') || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem('cutwave_waitlist', JSON.stringify(list));
    }
  }

  // ---- Counter animation ----
  const counters = document.querySelectorAll('[data-count]');
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, e.target.dataset.count);
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  function animateCounter(el, target) {
    const suffix = target.replace(/[\d.]/g, '');
    const num = parseFloat(target);
    if (isNaN(num)) { el.textContent = target; return; }
    const duration = 2200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const val = num * eased;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- Video Modal ----
  const playBtn = document.getElementById('play-showreel');
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close-btn');
  const modalBg = document.getElementById('video-modal-close-bg');
  const iframe = document.getElementById('video-iframe');
  
  // Use a placeholder cinematic showcase video (e.g. from Vimeo or YouTube)
  const videoSrc = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=0";

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    iframe.src = videoSrc;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  if (playBtn && modal) {
    playBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modalBg.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });
  }

  // ---- Stat bar animation ----
  const bars = document.querySelectorAll('.showcase-stat-fill');
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => { b.style.width = '0%'; barObs.observe(b); });

  // ---- Hero orb parallax ----
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const s = (i + 1) * 12;
        orb.style.transform = `translate(${x * s}px, ${y * s}px)`;
      });
    }, { passive: true });
  }

  // ---- Particle canvas ----
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 50;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          o: Math.random() * 0.4 + 0.1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.o})`;
        ctx.fill();
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
  }
});
