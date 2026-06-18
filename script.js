/* ========================================
   CUTWAVE — JavaScript (Interactions)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------- Smooth Scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Waitlist Form Handling ----------
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistSuccess = document.getElementById('waitlist-success');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = waitlistForm.querySelector('input[type="email"]');
      const submitBtn = waitlistForm.querySelector('.waitlist-submit');
      const email = emailInput.value.trim();

      if (!email) return;

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';

      // Check if Web3Forms access key is configured
      const accessKey = waitlistForm.querySelector('input[name="access_key"]');
      
      if (accessKey && accessKey.value && accessKey.value !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        // Send via Web3Forms (free, no backend needed)
        try {
          const formData = new FormData(waitlistForm);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          if (result.success) {
            showSuccess();
          } else {
            fallbackSubmit(email);
          }
        } catch (err) {
          fallbackSubmit(email);
        }
      } else {
        // Fallback: store locally and show success
        saveToLocalStorage(email);
        showSuccess();
      }
    });
  }

  function showSuccess() {
    const form = document.getElementById('waitlist-form');
    const success = document.getElementById('waitlist-success');
    if (form) form.style.display = 'none';
    document.querySelector('.waitlist-note').style.display = 'none';
    if (success) success.classList.add('show');
  }

  function saveToLocalStorage(email) {
    const emails = JSON.parse(localStorage.getItem('cutwave_waitlist') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('cutwave_waitlist', JSON.stringify(emails));
    }
  }

  function fallbackSubmit(email) {
    saveToLocalStorage(email);
    showSuccess();
  }

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('.hero-stat-value');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        if (!target) return;
        
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target) {
    const suffix = target.replace(/[0-9.]/g, '');
    const num = parseFloat(target);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = num * eased;

      if (Number.isInteger(num)) {
        el.textContent = Math.round(current) + suffix;
      } else {
        el.textContent = current.toFixed(1) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ---------- Parallax on Hero Orbs ----------
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 10;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }
});
