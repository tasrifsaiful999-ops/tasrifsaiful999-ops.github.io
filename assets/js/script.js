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

// ── HERO INTERACTIVE CONSTELLATION CANVAS ──
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
  const mouse = { x: -9999, y: -9999, radius: 140 };

  const particleCount = 38;
  const particles = [];

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * (width || 800);
      this.y = Math.random() * (height || 600);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1.2;
      this.alpha = Math.random() * 0.5 + 0.35;
      this.color = Math.random() > 0.4 ? '125, 211, 252' : '91, 159, 213';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;

      // Subtle interaction with mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.6;
        this.y -= (dy / dist) * force * 1.6;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting hairline webs
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 125) {
          const alpha = (1 - dist / 125) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse if near
      const mdx = mouse.x - particles[i].x;
      const mdy = mouse.y - particles[i].y;
      const mdist = Math.hypot(mdx, mdy);
      if (mdist < 140) {
        const mAlpha = (1 - mdist / 140) * 0.38;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (isVisible) {
      animationId = requestAnimationFrame(render);
    }
  }

  init();
  animationId = requestAnimationFrame(render);

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
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

// ── INTERACTIVE 3D PERSPECTIVE CARD TILT ──
(function () {
  const tiltCards = document.querySelectorAll('.card-tilt-3d, .cs-card-agency, .dash-card, .proof-card-item, .hero-stat-pill, .brand-exp-card');
  if (!tiltCards.length) return;

  // Don't bind tilt on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  tiltCards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -y * 12;
        const tiltY = x * 12;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
})();

// ── CUSTOM GLOWING MAGNETIC CURSOR FOLLOWER ──
(function () {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) return;

  let dot = document.getElementById('cursorGlowDot');
  let ring = document.getElementById('cursorGlowRing');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursorGlowDot';
    dot.className = 'cursor-glow-dot';
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursorGlowRing';
    ring.className = 'cursor-glow-ring';
    document.body.appendChild(ring);
  }

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    if (!isMoving) {
      isMoving = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      animateRing();
    }
  }, { passive: true });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isMoving = false;
    }
  });

  function animateRing() {
    if (!isMoving) return;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX.toFixed(1)}px`;
    ring.style.top = `${ringY.toFixed(1)}px`;
    requestAnimationFrame(animateRing);
  }

  // Magnetic hover expansion on clickable items
  const interactiveTargets = 'a, button, .hero-stat-pill, .cs-card-agency, .dash-card, .proof-frame-wrap, .filter-tab-pill, .card-tilt-3d, .brand-exp-card, .brand-marquee-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      ring.classList.remove('hovering');
    }
  });
})();



