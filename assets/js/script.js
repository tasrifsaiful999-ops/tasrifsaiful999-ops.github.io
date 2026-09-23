/* ═══════════════════════════════════════════════════════
   SAIFUL ISLAM MOLLAH — PORTFOLIO
   script.js
═══════════════════════════════════════════════════════ */

// ── NAVBAR ─────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (navbar) {
  const isHome = Boolean(document.getElementById('hero'));
  if (!isHome) {
    navbar.classList.add('scrolled', 'nav-solid');
  } else {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});

// ── ACTIVE NAV ─────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ── SCROLL REVEAL ──────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SKILL BARS ─────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('anim'));
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ── COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();
  const isDecimal = String(target).includes('.');

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── FORM SUBMIT — REAL FORMSPREE DELIVERY ──────────────
// Connected endpoint (Portfolio Project Enquiry): formspree.io/f/mljdneen
// set on the form's action attribute in /consultation/index.html
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

function setStatus(type, msg) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = 'form-status show ' + type;
}

if (form) {
  // mark fields as touched so invalid styling only appears after interaction
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('blur', () => el.classList.add('touched'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot — silently ignore bot submissions
    const hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) return;

    // required-field validation
    if (!form.checkValidity()) {
      form.querySelectorAll('input, textarea, select').forEach(el => el.classList.add('touched'));
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      setStatus('error', 'Please fill in all required fields with a valid email address.');
      return;
    }

    const endpoint = form.getAttribute('action') || '';
    if (endpoint.indexOf('YOUR_FORMSPREE_ID') !== -1) {
      setStatus('error', 'The enquiry form is not connected yet. Please email saifulislammollah09@gmail.com or message on WhatsApp.');
      return;
    }

    const original = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    if (formStatus) formStatus.className = 'form-status';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setStatus('success', 'Thank you — your enquiry has been sent. I usually respond within 24 hours.');
        form.reset();
        form.querySelectorAll('.touched').forEach(el => el.classList.remove('touched'));
      } else {
        let msg = 'Your message could not be sent. Please email saifulislammollah09@gmail.com or try WhatsApp.';
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(er => er.message).join(', ');
          }
        } catch (_) {}
        setStatus('error', msg);
      }
    } catch (err) {
      setStatus('error', 'Network error — please check your connection, or email saifulislammollah09@gmail.com directly.');
    } finally {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    }
  });
}

// ── SMOOTH SCROLL OFFSET ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
    }
  });
});

// ── CLIENT REVIEWS SLIDER (mobile) ─────────────────────
(function () {
  const track = document.getElementById('rvTrack');
  const prev  = document.getElementById('rvPrev');
  const next  = document.getElementById('rvNext');
  const dots  = document.getElementById('rvDots');
  if (!track || !prev || !next || !dots) return;

  const cards = Array.from(track.querySelectorAll('.rv-card'));
  if (!cards.length) return;
  let index = 0;

  cards.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rv-dot' + (i === 0 ? ' active' : '');
    b.setAttribute('aria-label', 'Go to review ' + (i + 1));
    b.addEventListener('click', () => goTo(i));
    dots.appendChild(b);
  });
  const dotEls = Array.from(dots.children);

  function isSlider() {
    return window.getComputedStyle(track).display === 'flex';
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, cards.length - 1));
    if (isSlider()) {
      track.scrollTo({ left: cards[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
    sync();
  }

  function sync() {
    dotEls.forEach((d, i) => {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  // keyboard support on the track
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); }
  });

  // keep dots in sync with manual swiping
  let raf;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (!isSlider()) return;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let closest = 0, dist = Infinity;
      cards.forEach((c, i) => {
        const cMid = c.offsetLeft - track.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cMid - mid);
        if (d < dist) { dist = d; closest = i; }
      });
      index = closest;
      sync();
    });
  }, { passive: true });

  sync();
})();

// ── REVIEW SUBMISSION FORM — REAL FORMSPREE DELIVERY ───
// Connected endpoint (Portfolio Client Review): formspree.io/f/mzezgbba
// set on the form's action attribute in /reviews/index.html
// Submitted reviews are never auto-published — they only reach
// the inbox for manual moderation.
(function () {
  const form = document.getElementById('reviewForm');
  const btn = document.getElementById('reviewSubmitBtn');
  const status = document.getElementById('reviewFormStatus');
  if (!form) return;

  function setStatus(type, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status show ' + type;
  }

  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('blur', () => el.classList.add('touched'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) return;

    if (!form.checkValidity()) {
      form.querySelectorAll('input, textarea, select').forEach(el => el.classList.add('touched'));
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      setStatus('error', 'Please fill in all required fields, including a star rating and consent.');
      return;
    }

    const endpoint = form.getAttribute('action') || '';
    if (endpoint.indexOf('YOUR_REVIEW_FORMSPREE_ID') !== -1) {
      setStatus('error', 'The review form is not connected yet. Please email saifulislammollah09@gmail.com directly.');
      return;
    }

    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    status.className = 'form-status';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setStatus('success', 'Thank you for your feedback. Your review has been submitted and will appear after approval.');
        form.reset();
        form.querySelectorAll('.touched').forEach(el => el.classList.remove('touched'));
      } else {
        let msg = 'Your review could not be sent. Please try again or email saifulislammollah09@gmail.com.';
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(er => er.message).join(', ');
          }
        } catch (_) {}
        setStatus('error', msg);
      }
    } catch (err) {
      setStatus('error', 'Network error — please check your connection and try again.');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
})();

// ── RESULTS PAGE — BRAND FILTER ────────────────────────
(function () {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const btns = Array.from(bar.querySelectorAll('.filter-btn'));
  const items = Array.from(document.querySelectorAll('.filterable'));
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      items.forEach(el => {
        el.hidden = !(f === 'all' || el.getAttribute('data-brand') === f);
      });
    });
  });
})();
