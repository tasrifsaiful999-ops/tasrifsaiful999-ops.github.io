/* ═══════════════════════════════════════════════════════
   SAIFUL — 3D EXPERIENCE ORCHESTRATOR (additive layer)
   Non-GL features (text, transitions, hero, images) run even if
   WebGL is unavailable. The original script.js is untouched.
═══════════════════════════════════════════════════════ */
const doc = document.documentElement;
const gsap = window.gsap, ST = window.ScrollTrigger;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function boot() {
  if (reduce || !gsap || !ST) { doc.classList.remove('pt-enter'); return; }
  gsap.registerPlugin(ST);
  doc.classList.add('js-3d');

  const path = location.pathname.replace('/saiful-3d-preview', '').replace(/index\.html$/, '') || '/';
  const page = path === '/' ? 'home'
    : /^\/services\/?$/.test(path) ? 'services'
    : /^\/results\/?$/.test(path) ? 'results'
    : /^\/seo-projects\/?$/.test(path) ? 'seo'
    : /^\/case-studies\/?$/.test(path) ? 'cases'
    : /^\/case-studies\/.+/.test(path) ? 'case'
    : /^\/reviews\/?$/.test(path) ? 'reviews'
    : /^\/consultation\/?$/.test(path) ? 'consult' : 'home';
  doc.dataset.page = page;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const low = window.innerWidth < 768 || coarse || (navigator.hardwareConcurrency || 8) <= 4;

  /* ── Lenis smooth scroll ── */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // pause while modal / mobile menu lock the body
    new MutationObserver(() => {
      document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
    // in-page anchors go through Lenis
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const tgt = document.querySelector(a.getAttribute('href'));
      if (!tgt) return;
      e.preventDefault(); e.stopImmediatePropagation();
      lenis.scrollTo(tgt, { offset: -76, duration: 1.2 });
    }, true);
    document.querySelectorAll('.mobile-nav, #proofModalOverlay').forEach(el => el.setAttribute('data-lenis-prevent', ''));
  }

  /* ── Split text ── */
  const SKIP = 'br,.text-rotator,svg,img,script,style,input,button';
  function split(el, mode) {
    const out = [];
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'sw';
            if (mode === 'chars') {
              w.setAttribute('aria-hidden', 'true');
              [...part].forEach(ch => { const i = document.createElement('i'); i.textContent = ch; w.appendChild(i); out.push(i); });
            } else {
              const i = document.createElement('i'); i.textContent = part; w.appendChild(i); out.push(i);
            }
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.matches(SKIP)) {
          const cs = getComputedStyle(n);
          if ((cs.webkitBackgroundClip || cs.backgroundClip) === 'text') { n.style.display = 'inline-block'; out.push(n); }
          else walk(n);
        }
      });
    })(el);
    if (mode === 'chars') el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    return out;
  }

  const entranceDelay = { v: 0 };
  const heroH1 = document.querySelector('#hero h1');

  // headings: character reveal on scroll
  const heads = [...document.querySelectorAll('main h1, main h2')].filter(h => h !== heroH1 && !h.closest('#hero') && h.textContent.trim().length < 140);
  heads.forEach(h => {
    const items = split(h, 'chars');
    gsap.set(items, { yPercent: 118, autoAlpha: 0 });
    ST.create({
      trigger: h, start: 'top 92%', once: true,
      onEnter: () => gsap.to(items, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: { each: 0.016, from: 'start' }, delay: h.closest('.page-hero') ? entranceDelay.v : 0 })
    });
  });

  // lead paragraphs: word reveal
  const leads = [...document.querySelectorAll('.section-sub, .page-hero p, .hero-sub-text')].filter(p => p.textContent.trim().split(/\s+/).length <= 45 && !p.querySelector('a,strong,em,span'));
  const leadItems = new Map();
  leads.forEach(p => {
    const items = split(p, 'words');
    gsap.set(items, { yPercent: 112, autoAlpha: 0 });
    leadItems.set(p, items);
    if (p.classList.contains('hero-sub-text')) return;
    ST.create({
      trigger: p, start: 'top 94%', once: true,
      onEnter: () => gsap.to(items, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', stagger: 0.012, delay: p.closest('.page-hero') ? entranceDelay.v + 0.25 : 0 })
    });
  });

  /* ── Images: clip reveal + parallax ── */
  const IMG = '.about-img-wrap img, img[src*="/about.webp"], img[src*="shirt.webp"], img[src*="/case-studies/"], img[src*="/services/"], img[src*="/consultation/"], img[src*="/reviews/"], .cs-verified-img-box img, .proof-frame-wrap img';
  const imgs = [...document.querySelectorAll(IMG)].filter(i => !i.closest('#hero, .brand-marquee, .marquee, [class*="logo"]'));
  imgs.forEach(img => {
    const framed = !!img.closest('.cs-verified-img-box, .proof-frame-wrap');
    // proof screenshots are evidence: reveal only, never crop or rest-scale them
    gsap.set(img, { clipPath: 'inset(0 0 100% 0)', scale: framed ? 1.05 : 1.16 });
    ST.create({
      trigger: img, start: 'top 94%', once: true,
      onEnter: () => gsap.to(img, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.3, ease: 'expo.out', clearProps: 'clipPath,transform' })
    });
    const box = img.closest('.cs-verified-img-box, .proof-frame-wrap');
    if (box && !coarse) box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); box.style.setProperty('--px', (e.clientX - r.left) + 'px'); box.style.setProperty('--py', (e.clientY - r.top) + 'px'); }, { passive: true });
  });
  // safety net: never leave an image clipped if its trigger could not fire
  setTimeout(() => imgs.forEach(img => { const r = img.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && getComputedStyle(img).clipPath.includes('100%')) gsap.to(img, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 0.8 }); }), 7000);

  /* ── Progress rail ── */
  const bar = document.createElement('div'); bar.className = 'gl-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  const setBar = gsap.quickSetter(bar, 'scaleX');
  gsap.ticker.add(() => setBar(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));

  /* ── Cursor ring (detail only) ── */
  if (!coarse) {
    const c = document.createElement('div'); c.className = 'gl-cursor'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
    const qx = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', e => { c.classList.add('on'); qx(e.clientX); qy(e.clientY); c.classList.toggle('hot', !!e.target.closest('a,button,[data-proof-src],.btn,input,textarea,select')); }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
  }

  /* ── Page transitions ── */
  const curtain = document.createElement('div');
  curtain.className = 'pt-curtain';
  curtain.innerHTML = '<div><div class="pt-mark">Saiful<span>.</span></div><div class="pt-label"></div></div>';
  document.body.appendChild(curtain);
  const ptLabel = curtain.querySelector('.pt-label');
  const reveal = () => { // wipe the curtain away
    gsap.set(curtain, { clipPath: 'inset(0% 0 0 0)' });
    doc.classList.remove('pt-enter');
    return gsap.to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut', delay: 0.25, onComplete: () => gsap.set(curtain, { clipPath: 'inset(100% 0 0 0)' }) });
  };
  let leaving = false;
  document.addEventListener('click', e => {
    if (e.defaultPrevented || leaving || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    e.preventDefault(); leaving = true;
    try { sessionStorage.setItem('pt', '1'); } catch (_) {}
    ptLabel.textContent = (a.textContent || '').replace(/→/g, '').trim().slice(0, 28);
    gsap.fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.65, ease: 'power4.inOut', onComplete: () => { location.href = u.href; } });
    setTimeout(() => { location.href = u.href; }, 1600); // failsafe
  });
  window.addEventListener('pageshow', e => { if (e.persisted) { leaving = false; gsap.set(curtain, { clipPath: 'inset(100% 0 0 0)' }); doc.classList.remove('pt-enter'); } });

  /* ── Hero entrance + portrait depth ── */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    entranceDelay.v = 0.1;
    gsap.fromTo('.nav-logo, .nav-links li', { y: -16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, delay: 0.5, clearProps: 'transform,opacity,visibility' });
    if (page !== 'home' || !heroH1) return;
    const lead = heroH1.firstChild && heroH1.firstChild.nodeType === 3 ? heroH1 : heroH1;
    const chars = split(lead, 'chars');
    const rot = heroH1.querySelector('.text-rotator');
    const sub = leadItems.get(document.querySelector('.hero-sub-text')) || [];
    gsap.set(chars, { yPercent: 118, autoAlpha: 0 });
    gsap.set(rot, { autoAlpha: 0, y: 28 });
    gsap.set('.hero-status-pill, .hero-kicker-title', { autoAlpha: 0, y: 18 });
    gsap.set('.hero-btns .btn', { autoAlpha: 0, y: 26 });
    gsap.set('.hero-side-badge-card', { autoAlpha: 0, x: 50 });
    gsap.set('.hero-portrait-frame', { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hero-portrait-img', { scale: 1.22 });
    tl.to('.hero-status-pill', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35)
      .to('.hero-kicker-title', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.45)
      .to(chars, { yPercent: 0, autoAlpha: 1, duration: 1.15, stagger: 0.014 }, 0.55)
      .to(rot, { autoAlpha: 1, y: 0, duration: 1 }, 1.05)
      .to(sub, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.012 }, 1.0)
      .to('.hero-btns .btn', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.25)
      .to('.hero-portrait-frame', { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.5)
      .to('.hero-portrait-img', { scale: 1, duration: 1.8 }, 0.5)
      .to('.hero-side-badge-card', { autoAlpha: 1, x: 0, duration: 1, stagger: 0.12 }, 1.3);

    // depth: idle sway (no cursor needed) + pointer tilt layered on a separate element
    const wrap = document.querySelector('.hero-sq-wrap'), stage = document.querySelector('.hero-portrait-stage'), frame = document.querySelector('.hero-portrait-frame');
    if (wrap && stage && frame) {
      const sheen = document.createElement('div'); sheen.className = 'hero-sheen'; sheen.setAttribute('aria-hidden', 'true'); frame.appendChild(sheen);
      gsap.to(wrap, { rotationY: 4, rotationX: -2.5, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformPerspective: 1100 });
      gsap.to(wrap, { y: -8, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      if (!coarse) {
        const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.8, ease: 'power3' }), ry = gsap.quickTo(stage, 'rotationY', { duration: 0.8, ease: 'power3' });
        gsap.set(stage, { transformPerspective: 1100 });
        const hero = document.getElementById('hero');
        hero.addEventListener('pointermove', e => {
          const r = hero.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          ry(nx * 9); rx(-ny * 7);
          sheen.style.setProperty('--sx', (50 + nx * 80) + '%'); sheen.style.setProperty('--sy', (40 + ny * 80) + '%');
        }, { passive: true });
        hero.addEventListener('pointerleave', () => { ry(0); rx(0); });
      }
    }
  }

  /* ── GL ── */
  let gl = null;
  async function initGL() {
    try {
      const { initScene } = await import('/assets/js/3d/scene.js');
      gl = initScene({ page, low, gsap });
      document.addEventListener('gl:ready', () => { doc.classList.add('gl-on'); ST.refresh(); }, { once: true });
    } catch (err) {
      console.warn('[3d] WebGL layer disabled, using original design:', err && err.message);
      doc.classList.remove('gl-on');
    }
  }

  /* ── go ── */
  const entering = doc.classList.contains('pt-enter');
  const start = () => { heroIntro(); initGL(); };
  if (entering) {
    gsap.set(curtain, { clipPath: 'inset(0% 0 0 0)' });
    ptLabel.textContent = '';
    doc.classList.remove('pt-enter');
    reveal();
    start();
  } else start();
  try { sessionStorage.removeItem('pt'); } catch (_) {}

  const refresh = () => ST.refresh();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener('load', () => setTimeout(refresh, 300));
  let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(refresh, 250); }).observe(document.querySelector('main') || document.body);
})();
