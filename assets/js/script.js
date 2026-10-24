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

if (hamburger && mobileNav) {
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
}

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

document.querySelectorAll('.reveal, .service-group, .cs-card-agency, .dash-card, .proof-card-item, .brand-exp-card, .seo-feature, .pricing-card, .review-card, .cs-metric-card, .consult-card, .stat-card, .service-media-banner').forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  revealObserver.observe(el);
});

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
  const rawTarget = el.dataset.target.replace(/,/g, '');
  const target = parseFloat(rawTarget);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = parseInt(el.dataset.duration, 10) || 1800;
  const startTime = performance.now();
  const isDecimal = String(target).includes('.');
  const useComma = el.dataset.comma !== 'false' && target >= 1000 && !isDecimal;

  function formatNum(v) {
    if (isDecimal) return v.toFixed(1);
    const intVal = Math.floor(v);
    return useComma ? intVal.toLocaleString('en-US') : intVal;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = prefix + formatNum(val) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (useComma ? Math.floor(target).toLocaleString('en-US') : (isDecimal ? target.toFixed(1) : target)) + suffix;
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
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

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

// ── AGENCY INTERACTIVE FILTER TABS (CASE STUDIES & PORTFOLIO) ──
(function () {
  const tabPills = document.querySelectorAll('.filter-tab-pill');
  if (!tabPills.length) return;
  
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tabPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const filter = pill.getAttribute('data-filter');
      const cards = document.querySelectorAll('[data-category]');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'meta' && cat.includes('meta')) || (filter === 'seo' && cat.includes('seo'))) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ── INTERACTIVE TESTIMONIAL SLIDER ──
(function () {
  const slider = document.querySelector('.rv-slider-container');
  if (!slider) return;

  const track = slider.querySelector('.rv-slides-track');
  const slides = Array.from(slider.querySelectorAll('.rv-slide-card'));
  const prevBtn = slider.querySelector('.rv-prev-btn');
  const nextBtn = slider.querySelector('.rv-next-btn');
  const dotsContainer = slider.querySelector('.rv-pagination-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleCount();
    return Math.max(0, slides.length - visible);
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = 'rv-p-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));
    const cardWidth = slides[0].getBoundingClientRect().width;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.rv-p-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const maxIdx = getMaxIndex();
      goTo(currentIndex === 0 ? maxIdx : currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxIdx = getMaxIndex();
      goTo(currentIndex >= maxIdx ? 0 : currentIndex + 1);
    });
  }

  // Touch Swipe
  let startX = 0;
  let currentX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }
    }
  });

  window.addEventListener('resize', () => {
    updateDots();
    goTo(currentIndex);
  });

  updateDots();
})();

// ── FAQ ACCORDION ──
(function () {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

// ── BACK TO TOP BUTTON ──
(function () {
  let btt = document.querySelector('.back-to-top');
  if (!btt) {
    btt = document.createElement('button');
    btt.className = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to top of page');
    btt.innerHTML = '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m18 15-6-6-6 6"/></svg>';
    document.body.appendChild(btt);
  }

  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 450);
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── INTERACTIVE CURSOR SPOTLIGHT GLOW (60FPS RAF THROTTLED) ──
(function () {
  const cards = document.querySelectorAll('.card-glow-interactive, .cs-card-agency, .dash-card, .proof-card-item, .case-card, .rv-slide-card, .srv-card');
  cards.forEach(card => {
    card.classList.add('card-glow-interactive');
    let ticking = false;
    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  });
})();

// ── PROOF SCREENSHOT LIGHTBOX MODAL ──
(function () {
  // Inject modal into DOM if not present
  let modalOverlay = document.getElementById('proofModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'proofModalOverlay';
    modalOverlay.className = 'proof-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="proof-modal-content" role="dialog" aria-modal="true" aria-labelledby="proofModalTitle">
        <div class="proof-modal-topbar">
          <div class="proof-modal-title" id="proofModalTitle">
            <span style="color:#00a400;">● Verified Client Data</span>
            <span id="proofModalSubtitle" style="color:rgba(255,255,255,0.7);font-size:0.86rem;font-weight:500;"></span>
          </div>
          <button class="proof-modal-close-btn" id="proofModalCloseBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="proof-modal-img-scroll">
          <img id="proofModalImg" src="" alt="Campaign Proof Screenshot" loading="lazy">
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modalImg = document.getElementById('proofModalImg');
  const modalSub = document.getElementById('proofModalSubtitle');
  const closeBtn = document.getElementById('proofModalCloseBtn');

  function openProofModal(src, title) {
    if (!modalImg || !modalOverlay) return;
    modalImg.src = src;
    if (modalSub) modalSub.textContent = title ? `— ${title}` : '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProofModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (modalImg) modalImg.src = '';
    }, 250);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeProofModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProofModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeProofModal();
    }
  });

  // Attach click listener to all proof targets
  document.querySelectorAll('[data-proof-src], .proof-frame-wrap, .cs-verified-img-box').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-proof-src') || el.querySelector('img')?.getAttribute('src');
      const title = el.getAttribute('data-proof-title') || el.querySelector('img')?.getAttribute('alt') || 'Meta Ads Manager / Analytics Proof';
      if (src) openProofModal(src, title);
    });
  });
})();

// ── AUTOPLAY ENHANCEMENT FOR TESTIMONIALS ──
(function () {
  const slider = document.querySelector('.rv-slider-container');
  if (!slider) return;
  const nextBtn = slider.querySelector('.rv-next-btn');
  if (!nextBtn) return;

  let autoplayTimer = null;
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      nextBtn.click();
    }, 4500);
  }
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  startAutoplay();
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('touchstart', stopAutoplay, { passive: true });
  slider.addEventListener('touchend', () => setTimeout(startAutoplay, 2000));
})();

// ── HERO DYNAMIC TEXT ROTATOR (3D PERSPECTIVE FLIP) ──
(function () {
  const rotator = document.getElementById('heroTextRotator');
  if (!rotator) return;
  const words = Array.from(rotator.querySelectorAll('.rotate-word'));
  if (words.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    const currentWord = words[currentIndex];
    const nextIndex = (currentIndex + 1) % words.length;
    const nextWord = words[nextIndex];

    currentWord.classList.remove('active');
    currentWord.classList.add('exit');

    nextWord.classList.remove('exit');
    nextWord.classList.add('active');

    setTimeout(() => {
      currentWord.classList.remove('exit');
    }, 650);

    currentIndex = nextIndex;
  }, 2600);
})();

// ── HERO INTERACTIVE 3D MARKETING DATA GLOBE ──
(function () {
  const canvas = document.getElementById('heroParticles');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationId = null;
  let isVisible = true;
  let radius = 220;
  let cx = 0;
  let cy = 0;

  let angleX = 0.22;
  let angleY = 0;
  let targetAngleX = 0.22;
  let targetAngleY = 0;
  const autoSpin = 0.0024;

  const mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    radius = Math.min(width, height) * (width > 992 ? 0.38 : 0.33);
    if (radius < 140) radius = 140;
    if (radius > 310) radius = 310;
    cx = width > 992 ? (width * 0.72) : (width * 0.5);
    cy = height * (width > 992 ? 0.50 : 0.44);
    buildGlobe();
  }

  const specialMetrics = [
    { label: '6.1x ROAS', color: '#10b981' },
    { label: 'Top #1 SEO', color: '#38bdf8' },
    { label: '2.4M Reach', color: '#818cf8' },
    { label: '+210% Conv', color: '#34d399' },
    { label: 'Meta Ads', color: '#60a5fa' },
    { label: 'GA4 CAPI', color: '#38bdf8' }
  ];

  const nodeCount = 72;
  let rawPoints = [];
  let edges = [];

  function buildGlobe() {
    rawPoints = [];
    edges = [];

    // Fibonacci sphere distribution for uniform 3D sphere points
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const metric = i < specialMetrics.length ? specialMetrics[i] : null;

      rawPoints.push({
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.cos(phi),
        oz: Math.sin(phi) * Math.sin(theta),
        x: 0, y: 0, z: 0,
        px: 0, py: 0, pScale: 1,
        size: metric ? 3.5 : (Math.random() * 1.8 + 1.2),
        metric: metric,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Precalculate edges based on angular distance to guarantee smooth 60fps
    for (let i = 0; i < rawPoints.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < rawPoints.length; j++) {
        const dx = rawPoints[i].ox - rawPoints[j].ox;
        const dy = rawPoints[i].oy - rawPoints[j].oy;
        const dz = rawPoints[i].oz - rawPoints[j].oz;
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 0.46 && connections < 4) {
          edges.push({ a: i, b: j, baseDist: dist });
          connections++;
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic rotation with mouse inertia and continuous orbit
    angleY += autoSpin + (targetAngleY - angleY) * 0.06;
    angleX += (targetAngleX - angleX) * 0.06;

    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const fov = 500;

    // Project all points into 3D camera space
    for (let i = 0; i < rawPoints.length; i++) {
      const p = rawPoints[i];
      const bx = p.ox * radius;
      const by = p.oy * radius;
      const bz = p.oz * radius;

      // Rotate around Y
      const x1 = bx * cosY + bz * sinY;
      const z1 = -bx * sinY + bz * cosY;

      // Rotate around X
      const y2 = by * cosX - z1 * sinX;
      const z2 = by * sinX + z1 * cosX;

      p.x = x1;
      p.y = y2;
      p.z = z2;

      // Perspective projection
      const scale = fov / (fov + z2 + radius * 0.2);
      p.pScale = scale;
      p.px = cx + x1 * scale;
      p.py = cy + y2 * scale;
      p.pulse += 0.035;
    }

    // 1. Draw 3D Orbit Latitude Rings for depth
    const ringRadii = [radius * 1.05, radius * 0.65];
    ctx.lineWidth = 0.9;
    ringRadii.forEach((r, idx) => {
      ctx.beginPath();
      const segments = 48;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const rx = Math.cos(theta) * r;
        const rz = Math.sin(theta) * r;
        const ry = idx === 0 ? 0 : r * 0.4;

        const x1 = rx * cosY + rz * sinY;
        const z1 = -rx * sinY + rz * cosY;
        const y2 = ry * cosX - z1 * sinX;
        const z2 = ry * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + radius * 0.2);
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = idx === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.08)';
      ctx.stroke();
    });

    // 2. Draw 3D Connecting Edges with depth attenuation
    for (let e = 0; e < edges.length; e++) {
      const p1 = rawPoints[edges[e].a];
      const p2 = rawPoints[edges[e].b];
      const avgZ = (p1.z + p2.z) / 2;
      const depthFactor = (avgZ + radius) / (2 * radius); // 0 (far) to 1 (near)

      if (depthFactor > 0.1) {
        const alpha = Math.max(0.04, Math.min(0.26, depthFactor * 0.28));
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
        ctx.lineWidth = Math.max(0.5, depthFactor * 1.2);
        ctx.stroke();
      }
    }

    // 3. Draw 3D Data Nodes & Metric Badges
    for (let i = 0; i < rawPoints.length; i++) {
      const p = rawPoints[i];
      const depthFactor = (p.z + radius) / (2 * radius);
      if (depthFactor <= 0.05) continue;

      const alpha = Math.max(0.15, Math.min(0.95, depthFactor * 1.1));
      const renderedSize = Math.max(1, p.size * p.pScale * (0.6 + depthFactor * 0.5));

      // Draw node glow
      ctx.beginPath();
      ctx.arc(p.px, p.py, renderedSize, 0, Math.PI * 2);
      ctx.fillStyle = p.metric ? p.metric.color : `rgba(125, 211, 252, ${alpha})`;
      if (depthFactor > 0.55 && p.metric) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.metric.color;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw metric pill label if facing front
      if (p.metric && depthFactor > 0.45) {
        const pulseScale = 1 + Math.sin(p.pulse) * 0.08;
        ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
        const labelText = p.metric.label;
        const textWidth = ctx.measureText(labelText).width;
        const pillX = p.px + 8;
        const pillY = p.py - 10;
        const pillH = 18;
        const pillW = textWidth + 14;

        // Pill background
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(pillX, pillY, pillW, pillH, 9) : ctx.rect(pillX, pillY, pillW, pillH);
        ctx.fillStyle = 'rgba(7, 18, 36, 0.78)';
        ctx.fill();
        ctx.strokeStyle = `rgba(${p.metric.color === '#10b981' ? '16, 185, 129' : '56, 189, 248'}, ${depthFactor * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pill text
        ctx.fillStyle = p.metric.color;
        ctx.fillText(labelText, pillX + 7, pillY + 12);
      }
    }

    if (isVisible) {
      animationId = requestAnimationFrame(render);
    }
  }

  resize();
  animationId = requestAnimationFrame(render);

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    targetAngleY = ((mouse.x - cx) / width) * 0.85;
    targetAngleX = -((mouse.y - cy) / height) * 0.75;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    targetAngleX = 0.22;
    targetAngleY = 0;
  }, { passive: true });

  // IntersectionObserver: Pause canvas rendering when hero is off-screen (0% CPU impact)
  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animationId) animationId = requestAnimationFrame(render);
        } else {
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }
})();

// ── SUBPAGE INTERACTIVE 3D MARKETING CYBER-WAVE CANVAS ──
(function initSubpage3DMatrix() {
  const pageHero = document.querySelector('.page-hero');
  if (!pageHero) return;

  // 1. Inject canvas if not already present
  let canvas = pageHero.querySelector('.page-hero-3d-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'page-hero-3d-canvas';
    pageHero.insertBefore(canvas, pageHero.firstChild);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0;
  let animId = null;
  let isVisible = true;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let time = 0;

  function resize() {
    width = canvas.width = pageHero.offsetWidth;
    height = canvas.height = pageHero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  pageHero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = (e.clientX - rect.left - width / 2) * 0.0006;
    mouse.targetY = (e.clientY - rect.top - height / 2) * 0.0006;
  }, { passive: true });

  pageHero.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
  }, { passive: true });

  // Grid points for 3D Perspective Wave Mesh
  const cols = 22;
  const rows = 12;
  const spacingX = 42;
  const spacingZ = 42;

  function render() {
    ctx.clearRect(0, 0, width, height);
    time += 0.024;
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    const rotX = 0.45 + mouse.y;
    const rotY = mouse.x;
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const fov = 420;
    const cx = width * 0.58;
    const cy = height * 0.48;

    const projected = [];

    for (let r = 0; r < rows; r++) {
      projected[r] = [];
      for (let c = 0; c < cols; c++) {
        const ox = (c - cols / 2) * spacingX;
        const oz = (r - rows / 2) * spacingZ;
        const oy = Math.sin(c * 0.35 + time) * 22 + Math.cos(r * 0.4 + time * 0.8) * 18;

        // 3D rotation
        const x1 = ox * cosY + oz * sinY;
        const z1 = -ox * sinY + oz * cosY;
        const y2 = oy * cosX - z1 * sinX;
        const z2 = oy * sinX + z1 * cosX + 320;

        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        projected[r][c] = { px, py, scale, z: z2 };
      }
    }

    // Draw connecting lines with depth fade
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pt = projected[r][c];
        const alpha = Math.max(0.04, Math.min(0.35, 1 - pt.z / 650));

        // Horizontal line
        if (c < cols - 1) {
          const next = projected[r][c + 1];
          ctx.beginPath();
          ctx.moveTo(pt.px, pt.py);
          ctx.lineTo(next.px, next.py);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.75})`;
          ctx.lineWidth = pt.scale * 1.1;
          ctx.stroke();
        }

        // Vertical line
        if (r < rows - 1) {
          const down = projected[r + 1][c];
          ctx.beginPath();
          ctx.moveTo(pt.px, pt.py);
          ctx.lineTo(down.px, down.py);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.55})`;
          ctx.lineWidth = pt.scale * 1.1;
          ctx.stroke();
        }

        // Floating node glow
        if ((r + c) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, pt.scale * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125, 211, 252, ${alpha * 1.2})`;
          ctx.fill();
        }
      }
    }

    if (isVisible) {
      animId = requestAnimationFrame(render);
    }
  }

  animId = requestAnimationFrame(render);

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) animId = requestAnimationFrame(render);
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    obs.observe(pageHero);
  }

  // 2. Inject Subpage 3D Floating Ambient Badges
  const container = pageHero.querySelector('.container');
  if (container && !pageHero.querySelector('.subpage-3d-badges-wrap')) {
    const path = window.location.pathname.toLowerCase();
    let badges = [
      { text: '6.1x ROAS Scaling', dot: '' },
      { text: 'Top #1 SEO Ranked', dot: 'sky' },
      { text: 'GA4 / CAPI Verified', dot: 'purple' }
    ];
    if (path.includes('result')) {
      badges = [
        { text: '2.41M+ Reach Growth', dot: 'sky' },
        { text: '+210% Conversion Lift', dot: '' },
        { text: 'Enterprise Performance', dot: 'purple' }
      ];
    } else if (path.includes('case-stud')) {
      badges = [
        { text: 'Real Brands Audited', dot: '' },
        { text: 'Data-Backed Growth', dot: 'sky' },
        { text: 'Scale-Ready Funnels', dot: 'purple' }
      ];
    } else if (path.includes('seo')) {
      badges = [
        { text: 'Top #1 Search Console', dot: 'sky' },
        { text: 'Zero Spam / White-Hat', dot: '' },
        { text: '180K+ Organic Traffic', dot: 'purple' }
      ];
    } else if (path.includes('review')) {
      badges = [
        { text: '5.0★ Genuine Feedback', dot: '' },
        { text: 'Long-term Partnerships', dot: 'sky' },
        { text: '100% Client Verified', dot: 'purple' }
      ];
    } else if (path.includes('consult')) {
      badges = [
        { text: '1-on-1 Growth Audit', dot: 'sky' },
        { text: 'Full Funnel Roadmaps', dot: '' },
        { text: 'Strategy Session', dot: 'purple' }
      ];
    }

    const wrap = document.createElement('div');
    wrap.className = 'subpage-3d-badges-wrap';
    wrap.setAttribute('aria-hidden', 'true');
    badges.forEach(b => {
      const el = document.createElement('div');
      el.className = 'subpage-3d-badge';
      el.innerHTML = `<span class="s-badge-dot ${b.dot}"></span><span>${b.text}</span>`;
      wrap.appendChild(el);
    });
    pageHero.appendChild(wrap);
  }
})();

// ── AUTONOMOUS CONTINUOUS 3D LEVITATION & TILT ACROSS ALL CARDS & PAGES ──
(function initAutonomous3DFloating() {
  const cards = document.querySelectorAll(
    '.brand-exp-card, .service-group, .cs-card-agency, .dash-card, .proof-card-item, ' +
    '.seo-feature, .pricing-card, .review-card, .about-photo-wrap, .service-media-frame, ' +
    '.cs-hero-img-wrap, .hero-stat-pill, .hero-sq-wrap'
  );

  cards.forEach((card, index) => {
    // 1. Assign continuous 3D spatial levitation class
    const mod = index % 3;
    const levClass = mod === 0 ? 'card-levitate-3d-1' : (mod === 1 ? 'card-levitate-3d-2' : 'card-levitate-3d-3');
    card.classList.add(levClass);
    card.classList.add('holographic-3d-sheen');
    card.classList.add('card-tilt-3d');

    // 2. Interactive mouse tilt overlays seamlessly
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let ticking = false;
    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -y * 14;
        const tiltY = x * 14;

        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${xPct.toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${yPct.toFixed(1)}%`);

        card.style.animationPlayState = 'paused';
        card.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.animationPlayState = 'running';
      card.style.transform = '';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
})();



