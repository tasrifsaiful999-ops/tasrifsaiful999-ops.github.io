/**
 * IMMERSIVE 3D WEB EXPERIENCE & SPATIAL INTERACTION ENGINE
 * Google Deepmind Studio Standard · Saiful Islam Mollah Luxury Portfolio
 */

(function () {
  'use strict';

  // ── 1. LENIS SMOOTH SCROLL INITIALIZATION ──
  let lenisInstance = null;
  function initLenisSmoothScroll() {
    if (typeof window === 'undefined' || typeof window.Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      lenisInstance = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8
      });

      if (typeof window.ScrollTrigger !== 'undefined') {
        lenisInstance.on('scroll', window.ScrollTrigger.update);
      }

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }

  // ── 2. THREE.JS HERO 3D SPATIAL ENGINE ──
  function initHero3DScene() {
    if (typeof window === 'undefined' || typeof window.THREE === 'undefined') return;
    const canvas = document.getElementById('hero3DCanvas');
    const heroSection = document.getElementById('hero');
    if (!canvas || !heroSection) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      48,
      heroSection.offsetWidth / heroSection.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    // High-performance WebGL Renderer
    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGL not supported:', err);
      return;
    }
    renderer.setSize(heroSection.offsetWidth, heroSection.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0B2545, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x7DD3FC, 4.2, 70);
    keyLight.position.set(14, 12, 14);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x2E6DA4, 3.0, 60);
    rimLight.position.set(-14, -10, 10);
    scene.add(rimLight);

    const cursorLight = new THREE.PointLight(0x38BDF8, 2.6, 45);
    cursorLight.position.set(0, 0, 10);
    scene.add(cursorLight);

    // Group for 3D Polyhedron & Orbiting Elements
    const spatialGroup = new THREE.Group();
    scene.add(spatialGroup);

    // Central Faceted Diamond Polyhedron (Beside & Framing Portrait Showcase)
    const crystalGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x163A6B,
      emissive: 0x0B2545,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.82,
      reflectivity: 0.95
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(7.5, 0.8, -3.2);
    spatialGroup.add(crystalMesh);

    // Outer Glowing Cyan Wireframe Matrix
    const wireGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x5B9FD5,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.copy(crystalMesh.position);
    spatialGroup.add(wireMesh);

    // 4 Orbiting Discipline Crystal Satellites
    const satelliteDefs = [
      { geo: new THREE.OctahedronGeometry(1.2), dist: 5.6, speed: 0.8, yOffset: 0.8, phase: 0 },
      { geo: new THREE.DodecahedronGeometry(1.4), dist: 6.8, speed: 0.6, yOffset: -0.5, phase: Math.PI * 0.5 },
      { geo: new THREE.TetrahedronGeometry(1.1), dist: 5.2, speed: 0.9, yOffset: 1.4, phase: Math.PI },
      { geo: new THREE.IcosahedronGeometry(1.3), dist: 7.2, speed: 0.5, yOffset: -1.2, phase: Math.PI * 1.5 }
    ];

    const satellites = [];
    satelliteDefs.forEach((def) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x2E6DA4,
        emissive: 0x0B2545,
        roughness: 0.18,
        metalness: 0.78,
        transparent: true,
        opacity: 0.75
      });
      const mesh = new THREE.Mesh(def.geo, mat);
      mesh.position.set(
        crystalMesh.position.x + Math.cos(def.phase) * def.dist,
        crystalMesh.position.y + def.yOffset,
        crystalMesh.position.z + Math.sin(def.phase) * def.dist
      );
      spatialGroup.add(mesh);
      satellites.push({ mesh, def });
    });

    // Active Theory 3D Depth Particle Constellation
    const particleCount = 130;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 44;
      posArray[i + 1] = (Math.random() - 0.5) * 30;
      posArray[i + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0x7DD3FC,
      transparent: true,
      opacity: 0.85
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse & Pointer Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    function onPointerMove(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      cursorLight.position.x = x * 10;
      cursorLight.position.y = y * 8;
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Window Resize Handler
    function onResize() {
      if (!heroSection || !renderer) return;
      const width = heroSection.offsetWidth;
      const height = heroSection.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // Animation Loop with Visibility Safeguard
    let isVisible = true;
    let clock = new THREE.Clock();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Rotate Main Polyhedron
      crystalMesh.rotation.x = elapsedTime * 0.18;
      crystalMesh.rotation.y = elapsedTime * 0.28;
      wireMesh.rotation.x = -elapsedTime * 0.12;
      wireMesh.rotation.y = -elapsedTime * 0.22;

      // Orbit Satellites
      satellites.forEach(({ mesh, def }) => {
        const angle = def.phase + elapsedTime * def.speed;
        mesh.position.x = crystalMesh.position.x + Math.cos(angle) * def.dist;
        mesh.position.z = crystalMesh.position.z + Math.sin(angle) * def.dist;
        mesh.position.y = crystalMesh.position.y + def.yOffset + Math.sin(elapsedTime * 1.5 + def.phase) * 0.45;
        mesh.rotation.x += 0.015;
        mesh.rotation.y += 0.02;
      });

      // Subtle Particle Swarm Drift
      particleSystem.rotation.y = elapsedTime * 0.03;

      // Camera Smooth Tracking
      targetRotX += (mouseY * 0.18 - targetRotX) * 0.06;
      targetRotY += (mouseX * 0.25 - targetRotY) * 0.06;
      camera.position.x = targetRotY * 3.5;
      camera.position.y = targetRotX * 2.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();
  }

  // ── 3. FLUID CUSTOM SPATIAL FOLLOWER CURSOR ──
  function initSpatialCursor() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX - mouseX}px, ${ringY - mouseY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover States
    // Buttons
    const buttons = document.querySelectorAll('button, a, .btn, .nav-cta, .btn-magnetic');
    buttons.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover-button');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover-button');
      });
    });

    // Proof & Card Items (Pill Morph with Label)
    const proofCards = document.querySelectorAll(
      '.hero-stat-pill, .hero-side-badge-card, .cs-card-agency, .proof-card-item, .hero-quad-card, .service-card'
    );
    proofCards.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover-card');
        const customLabel = el.getAttribute('data-cursor-label') || 'VIEW PROOF ↗';
        if (label) label.textContent = customLabel;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover-card');
      });
    });

    // Carousel Areas (Drag Morph)
    const carousels = document.querySelectorAll('.reviews-track, .brand-carousel-track');
    carousels.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover-drag');
        if (label) label.textContent = 'DRAG ⟷';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover-drag');
      });
    });
  }

  // ── 4. 3D CARD TILT & SPECULAR BORDER BEAM ──
  function initCardTilt3D() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll(
      '.card-tilt-3d, .hero-stat-pill, .hero-side-badge-card, .cs-card-agency, .proof-card-item, .service-group, .review-card, .hero-quad-card, .hero-showcase-card'
    );

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set variables for border beam
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Calculate 3D tilt angles
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  // ── 5. KINETIC CLICK RIPPLE WAVE ──
  function initClickRipple() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple-pulse';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  }

  // ── 6. MULTI-LAYER MAGNETIC BUTTONS ──
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const magnetics = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-solid, .nav-cta a');
    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.28;

        btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

        const inner = btn.firstElementChild;
        if (inner && inner !== btn) {
          inner.style.transform = `translate3d(${(x * 0.4).toFixed(1)}px, ${(y * 0.4).toFixed(1)}px, 0)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        const inner = btn.firstElementChild;
        if (inner && inner !== btn) {
          inner.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    });
  }

  // ── 7. GSAP SCROLLTRIGGER STAGGER REVEAL ──
  function initScrollTriggers() {
    if (typeof window === 'undefined' || typeof window.gsap === 'undefined') return;
    if (typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    const revealSections = document.querySelectorAll('.section-header, .service-group, .proof-card-item, .brand-grid, .cs-card-agency');
    revealSections.forEach((el) => {
      window.gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ── EXECUTE ENGINE WHEN DOM IS READY ──
  function startSpatialEngine() {
    initLenisSmoothScroll();
    initHero3DScene();
    initSpatialCursor();
    initCardTilt3D();
    initClickRipple();
    initMagneticButtons();
    initScrollTriggers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSpatialEngine);
  } else {
    startSpatialEngine();
  }
})();
