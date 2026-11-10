/**
 * CONTENT-FIRST IMMERSIVE MOTION ENGINE
 * References: Studio K95 (Typography) · Sarah McColgan (Photography) · CyberFiction (Storytelling)
 * Google Deepmind Studio Standard · Saiful Islam Mollah Portfolio
 */

(function () {
  'use strict';

  // ── 1. LENIS INERTIAL SMOOTH SCROLL ──
  let lenis = null;
  function initLenis() {
    if (typeof window === 'undefined' || typeof window.Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.8
      });

      if (typeof window.ScrollTrigger !== 'undefined') {
        lenis.on('scroll', window.ScrollTrigger.update);
      }

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis scroll initialized in fallback mode:', err);
    }
  }

  // ── 2. STUDIO K95 TYPOGRAPHIC ANIMATION ENGINE ──
  function initTypographyEngine() {
    // A. Content-First Heading Motion (Preserving exact DOM & Rotator)
    const headings = document.querySelectorAll('.hero-headline, .section-title, .contact-info-title');
    headings.forEach((h) => {
      h.style.opacity = '1';
      h.style.visibility = 'visible';
    });

    // B. Kinetic Typographic Rotator
    const rotator = document.getElementById('kineticTextRotator') || document.getElementById('heroTextRotator');
    if (rotator) {
      const items = Array.from(rotator.querySelectorAll('.kinetic-rot-item, .rotate-word'));
      if (items.length > 1) {
        let activeIdx = 0;
        setInterval(() => {
          const current = items[activeIdx];
          const nextIdx = (activeIdx + 1) % items.length;
          const next = items[nextIdx];

          current.classList.remove('active');
          current.classList.add('exit');

          setTimeout(() => {
            current.classList.remove('exit');
            next.classList.add('active');
          }, 400);

          activeIdx = nextIdx;
        }, 4200);
      }
    }

    // C. Monumental Metric Counter Rollups
    const counters = document.querySelectorAll('[data-target]');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    counters.forEach((c) => counterObserver.observe(c));

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = parseInt(el.getAttribute('data-duration') || '1400', 10);
      let startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = target * ease;

        if (Number.isInteger(target)) {
          el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        } else {
          el.textContent = prefix + current.toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + (Number.isInteger(target) ? target.toLocaleString() : target) + suffix;
        }
      }
      requestAnimationFrame(step);
    }
  }

  // ── 3. SARAH MCCOLGAN PHOTOGRAPHY & PROJECT SHOWCASE ──
  function initPhotographyEngine() {
    // A. Portrait Depth Parallax
    const portraitFrame = document.querySelector('.hero-portrait-frame');
    const portraitImg = document.querySelector('.hero-portrait-img');
    const heroSection = document.getElementById('hero');

    if (portraitFrame && heroSection && !window.matchMedia('(pointer: coarse)').matches) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        portraitFrame.style.transform = `perspective(1000px) rotateY(${(x * 7).toFixed(1)}deg) rotateX(${(-y * 7).toFixed(1)}deg) translateZ(10px)`;
        if (portraitImg) {
          portraitImg.style.transform = `scale(1.04) translate3d(${(-x * 6).toFixed(1)}px, ${(-y * 6).toFixed(1)}px, 0)`;
        }
      }, { passive: true });

      heroSection.addEventListener('mouseleave', () => {
        portraitFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
        if (portraitImg) portraitImg.style.transform = 'scale(1)';
      });
    }

    // B. Project & Proof Card Specular Tracking
    const visualCards = document.querySelectorAll('.cs-card-agency, .proof-card-item, .hero-stat-pill, .hero-side-badge-card, .service-group, .review-card');
    if (!window.matchMedia('(pointer: coarse)').matches) {
      visualCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 8;
          const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
          card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`;
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      });
    }
  }

  // ── 4. CYBERFICTION SCROLL STORYTELLING CHOREOGRAPHY ──
  function initScrollStorytelling() {
    if (typeof window === 'undefined' || typeof window.gsap === 'undefined') return;
    if (typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    // A. Illuminated Career Timeline Beam
    const timeline = document.querySelector('.timeline-beam-track') || document.querySelector('.brand-exp-grid');
    if (timeline) {
      timeline.classList.add('timeline-beam-track');
      const timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timeline.classList.add('is-illuminated');
            }
          });
        },
        { threshold: 0.15 }
      );
      timelineObserver.observe(timeline);
    }

    // B. Staggered Entrance of Section Narrative Blocks
    const chapters = document.querySelectorAll('#about, #skills, #services, #results, #case-studies-preview, #seo, #experience, #reviews, #contact');
    chapters.forEach((chap) => {
      const cards = chap.querySelectorAll('.service-group, .proof-card-item, .cs-card-agency, .brand-exp-card, .review-card, .skill-group');
      if (cards.length > 0) {
        window.gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chap,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
  }

  // ── 5. FLUID SPATIAL FOLLOWER CURSOR & MULTI-LAYER MAGNETIC BUTTONS ──
  function initSpatialInteractions() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Follower cursor
    let cursor = document.getElementById('spatialCursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'spatialCursor';
      cursor.innerHTML = `
        <div class="spatial-cursor-dot"></div>
        <div class="spatial-cursor-ring">
          <span class="spatial-cursor-label">VIEW PROOF ↗</span>
        </div>
      `;
      document.body.appendChild(cursor);
    }

    const ring = cursor.querySelector('.spatial-cursor-ring');
    const label = cursor.querySelector('.spatial-cursor-label');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function loopCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX - mouseX}px, ${ringY - mouseY}px, 0)`;
      requestAnimationFrame(loopCursor);
    }
    requestAnimationFrame(loopCursor);

    // Hover interactions
    const buttons = document.querySelectorAll('button, a, .btn, .nav-cta, .btn-magnetic');
    buttons.forEach((b) => {
      b.addEventListener('mouseenter', () => cursor.classList.add('is-hover-button'));
      b.addEventListener('mouseleave', () => cursor.classList.remove('is-hover-button'));

      // 2-Layer Magnetic Physics
      b.addEventListener('mousemove', (e) => {
        const rect = b.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.26;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.26;
        b.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        const inner = b.firstElementChild;
        if (inner && inner !== b) {
          inner.style.transform = `translate3d(${(x * 0.45).toFixed(1)}px, ${(y * 0.45).toFixed(1)}px, 0)`;
        }
      });
      b.addEventListener('mouseleave', () => {
        b.style.transform = '';
        const inner = b.firstElementChild;
        if (inner && inner !== b) inner.style.transform = '';
      });
    });

    const proofTargets = document.querySelectorAll('.hero-stat-pill, .hero-side-badge-card, .cs-card-agency, .proof-card-item');
    proofTargets.forEach((p) => {
      p.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover-card');
        if (label) label.textContent = p.dataset.proofSrc ? 'VIEW PROOF ↗' : 'EXPLORE ↗';
      });
      p.addEventListener('mouseleave', () => cursor.classList.remove('is-hover-card'));
    });

    // Kinetic Click Ripple
    window.addEventListener('click', (e) => {
      const rip = document.createElement('div');
      rip.className = 'click-ripple-pulse';
      rip.style.left = `${e.clientX}px`;
      rip.style.top = `${e.clientY}px`;
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });
  }

  // ── 6. INITIALIZE ──
  function start() {
    initLenis();
    initTypographyEngine();
    initPhotographyEngine();
    initScrollStorytelling();
    initSpatialInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
