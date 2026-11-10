/**
 * LUSION (https://lusion.co/) ELEVATED 3D PHYSICS & MOTION ENGINE v9.0
 * Fixed Viewport 3D Canvas, Monumental Scroll Choreography, Lenis Easing, Audio Synth
 * Sitewide Integration for Saiful Islam Mollah Multi-Page Portfolio
 */

(function () {
  'use strict';

  // 1. Lenis Smooth Scroll Setup with Inertial Velocity
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', () => {
      updateScrollDynamics();
    });
  }

  // 2. Sitewide Fixed Three.js 3D Viewport Engine
  let scene, camera, renderer, jacks = [], orbitRing, crystal1, particles;
  let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
  let scrollOffset = 0;

  function initLusion3D() {
    const canvas = document.getElementById('lusionCanvas') || document.getElementById('canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Ensure fixed full-screen positioning across the entire website
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lusion Cross Jack Mesh Constructor
    function createJack(colorHex, scale = 1.0, roughness = 0.12, metalness = 0.85) {
      const group = new THREE.Group();
      const cylGeo = new THREE.CylinderGeometry(0.52 * scale, 0.52 * scale, 3.8 * scale, 32);
      
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: roughness,
        metalness: metalness,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });

      const c1 = new THREE.Mesh(cylGeo, mat);
      const c2 = new THREE.Mesh(cylGeo, mat);
      c2.rotation.z = Math.PI / 2;
      const c3 = new THREE.Mesh(cylGeo, mat);
      c3.rotation.x = Math.PI / 2;

      group.add(c1, c2, c3);
      return group;
    }

    // Element 1: Luminous Torus Orbit Ring (Electric Cyan Glow)
    const ringGeo = new THREE.TorusGeometry(6.8, 0.22, 24, 100);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x00F2FE,
      emissive: 0x002244,
      roughness: 0.15,
      metalness: 0.9,
      clearcoat: 1.0
    });
    orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 3;
    orbitRing.rotation.y = Math.PI / 6;
    scene.add(orbitRing);

    // Element 2: Geometric Crystal (Icosahedron in Electric Royal Blue)
    const crystalGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0044FF,
      roughness: 0.08,
      metalness: 0.95,
      clearcoat: 1.0
    });
    crystal1 = new THREE.Mesh(crystalGeo, crystalMat);
    crystal1.position.set(-6.8, -2.5, -1);
    scene.add(crystal1);

    // 4 Cross Jack Objects in Lusion Signature Palette
    jacks = [
      { mesh: createJack(0x0044FF, 1.25, 0.1, 0.85), x: 0.2, y: 0.4, z: 2, rx: 0.007, ry: 0.01 }, // Central Blue Jack
      { mesh: createJack(0xFFFFFF, 1.1, 0.05, 0.9), x: -4.8, y: 3.2, z: -1, rx: -0.009, ry: 0.006 }, // Top White Jack
      { mesh: createJack(0x111111, 1.15, 0.15, 0.85), x: 5.2, y: 2.5, z: -2, rx: 0.006, ry: -0.008 }, // Top Obsidian Jack
      { mesh: createJack(0xFFFFFF, 1.05, 0.08, 0.9), x: 5.4, y: -2.8, z: 1, rx: -0.005, ry: -0.009 } // Bottom White Jack
    ];

    jacks.forEach(j => {
      j.mesh.position.set(j.x, j.y, j.z);
      scene.add(j.mesh);
    });

    // Ambient floating starlight particles
    const pCount = 420;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 50;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.12, color: 0x00F2FE, transparent: true, opacity: 0.65 });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00F2FE, 3.8, 65);
    keyLight.position.set(12, 16, 20);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x0044FF, 3.5, 55);
    fillLight.position.set(-16, -10, 15);
    scene.add(fillLight);

    // Mouse Tracking across entire window
    window.addEventListener('pointermove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Scroll reactive tumbling
      const scrollDrift = scrollOffset * 0.001;

      jacks.forEach((j, i) => {
        j.mesh.rotation.x += j.rx + mouseX * 0.004;
        j.mesh.rotation.y += j.ry + mouseY * 0.004 + scrollDrift * 0.02;
        j.mesh.position.y = j.y + Math.sin(time * 1.3 + i * 1.2) * 0.3 - scrollDrift * 2.0;
        j.mesh.position.x = j.x + Math.cos(time * 1.0 + i * 0.9) * 0.2;
      });

      // Orbit Ring Dynamic Wobble
      orbitRing.rotation.z = time * 0.15 + scrollDrift * 0.5;
      orbitRing.rotation.y = Math.PI / 6 + Math.sin(time * 0.8) * 0.15;

      // Crystal Floating
      crystal1.rotation.x += 0.01;
      crystal1.rotation.y += 0.015;
      crystal1.position.y = -2.5 + Math.sin(time * 1.5) * 0.25 - scrollDrift * 1.5;

      particles.rotation.y = time * 0.012 + scrollDrift * 0.1;

      // Parallax Camera Sway
      camera.position.x += (mouseX * 3.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // 3. Scroll Dynamics: Moving Scenes & Parallax
  function updateScrollDynamics() {
    scrollOffset = window.pageYOffset || document.documentElement.scrollTop;

    // Moving Scene Frames Parallax & Zoom
    const sceneFrames = document.querySelectorAll('.lusion-work-img-frame img, .service-img-wrap img, .proof-img-wrap img');
    const vh = window.innerHeight;

    sceneFrames.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const yOffset = (progress - 0.5) * 35;
        img.style.transform = 'scale(1.06) translate3d(0, ' + yOffset.toFixed(2) + 'px, 0)';
      }
    });

    // Update floating HUD chips subtle sway
    const chips = document.querySelectorAll('.lusion-metric-chip');
    chips.forEach((c, idx) => {
      const offset = Math.sin(scrollOffset * 0.005 + idx) * 8;
      c.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
    });
  }

  window.__lusionUpdateScroll = updateScrollDynamics;
  window.addEventListener('scroll', updateScrollDynamics, { passive: true });

  // 4. Staggered Scroll Reveal System (IntersectionObserver)
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.lusion-reveal, .reveal, .service-group, .lusion-work-card, .proof-card, .home-review-card, .lusion-service-row');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 5. Fullscreen Navigation Menu Overlay
  function initMenuOverlay() {
    const menuBtn = document.getElementById('lusionMenuBtn');
    const closeBtn = document.getElementById('lusionMenuClose');
    const overlay = document.getElementById('lusionMenuOverlay');
    if (!menuBtn || !overlay) return;

    function openMenu() {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });

    const menuLinks = overlay.querySelectorAll('.menu-nav-links a');
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 6. Interactive Filter Chips (Services, Skills, Results Proof)
  function initInteractiveFilters() {
    // Skills radar filter pills
    const skillBtns = document.querySelectorAll('.skill-cat-btn');
    const skillCards = document.querySelectorAll('.skill-card-3d');
    if (skillBtns.length && skillCards.length) {
      skillBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          skillBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const cat = btn.getAttribute('data-cat');

          skillCards.forEach(c => {
            if (cat === 'all' || c.getAttribute('data-cat') === cat) {
              c.style.display = 'block';
              setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 20);
            } else {
              c.style.opacity = '0';
              c.style.transform = 'translateY(15px)';
              setTimeout(() => { c.style.display = 'none'; }, 250);
            }
          });
        });
      });
    }

    // Results / Proof filter pills
    const proofBtns = document.querySelectorAll('.proof-tab-btn, .filter-btn');
    const proofCards = document.querySelectorAll('.proof-card, .proof-item, .result-card');
    if (proofBtns.length && proofCards.length) {
      proofBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          proofBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const cat = btn.getAttribute('data-filter') || btn.getAttribute('data-cat');

          proofCards.forEach(c => {
            const cardCat = c.getAttribute('data-cat') || c.getAttribute('data-category');
            if (cat === 'all' || cardCat === cat) {
              c.style.display = '';
              setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'scale(1)'; }, 20);
            } else {
              c.style.opacity = '0';
              c.style.transform = 'scale(0.96)';
              setTimeout(() => { c.style.display = 'none'; }, 200);
            }
          });
        });
      });
    }

    // Form interactive interest & budget selection chips
    const chipGroups = document.querySelectorAll('[data-target-input]');
    chipGroups.forEach(grp => {
      const targetInputId = grp.getAttribute('data-target-input');
      const targetInput = document.getElementById(targetInputId);
      const chips = grp.querySelectorAll('.lusion-chip');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
          if (targetInput) {
            targetInput.value = chip.textContent.trim();
          }
        });
      });
    });
  }

  // 7. Ambient Audio Synthesizer (Lusion Signature Sound Pill)
  function initAudioSynthesizer() {
    const soundBtn = document.getElementById('lusionSoundBtn');
    if (!soundBtn) return;

    let audioCtx = null;
    let isPlaying = false;
    let osc1, osc2, gainNode;

    soundBtn.addEventListener('click', () => {
      if (!isPlaying) {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          osc1 = audioCtx.createOscillator();
          osc2 = audioCtx.createOscillator();
          gainNode = audioCtx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // Deep A2 Drone
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(220, audioCtx.currentTime); // Atmospheric Harmonics

          gainNode.gain.setValueAtTime(0.045, audioCtx.currentTime);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
        } else {
          gainNode.gain.setTargetAtTime(0.045, audioCtx.currentTime, 0.2);
        }
        isPlaying = true;
        soundBtn.classList.add('is-active');
        soundBtn.setAttribute('title', 'Mute ambient sound');
      } else {
        if (gainNode && audioCtx) {
          gainNode.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.2);
        }
        isPlaying = false;
        soundBtn.classList.remove('is-active');
        soundBtn.setAttribute('title', 'Play ambient sound');
      }
    });
  }

  // 8. Bootstrap All Systems on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  function bootstrap() {
    initLusion3D();
    initScrollReveals();
    initMenuOverlay();
    initInteractiveFilters();
    initAudioSynthesizer();
    updateScrollDynamics();
  }
})();
