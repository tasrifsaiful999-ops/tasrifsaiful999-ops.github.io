/**
 * IMMERSIVE 3D UNIVERSE ENGINE — LUSION × CUBERTO × ACTIVE THEORY
 * Complete Creative Development Suite
 */

(function () {
  'use strict';

  // State Management
  const state = {
    audioEnabled: false,
    audioCtx: null,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0 },
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2
  };

  // ==========================================================================
  // 1. LUSION REAL-TIME 3D WEBGL SCENE (Three.js)
  // ==========================================================================
  function initLusion3DScene() {
    if (typeof THREE === 'undefined') return;

    // Create or select canvas
    let canvas = document.getElementById('universeCanvas3D');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'universeCanvas3D';
      document.body.prepend(canvas);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Central Floating Lusion Crystal Sculpture
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // Faceted Diamond Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00F2FE,
      emissive: 0x041936,
      roughness: 0.15,
      metalness: 0.85,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    crystalGroup.add(coreMesh);

    // Glowing Geometric Wireframe Cage
    const wireGeo = new THREE.IcosahedronGeometry(5.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4FACFE,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    crystalGroup.add(wireMesh);

    // Position crystal in upper right spatial horizon
    crystalGroup.position.set(7.5, 1.2, -4.0);

    // 2. Orbiting Satellite Nodes (4 Core Disciplines)
    const satellites = [];
    const satColors = [0x00F2FE, 0x10E7C3, 0x8B5CF6, 0x4FACFE];
    const satCount = 4;

    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 8.5;
      const satGeo = new THREE.OctahedronGeometry(0.8, 0);
      const satMat = new THREE.MeshPhysicalMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.userData = { angle: angle, radius: radius, speed: 0.008 + i * 0.003 };
      crystalGroup.add(satMesh);
      satellites.push(satMesh);
    }

    // 3. Volumetric Constellation / Active Theory Particle Nebula
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00F2FE);
    const c2 = new THREE.Color(0x8B5CF6);
    const c3 = new THREE.Color(0x10E7C3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      const mixedColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x061838, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00F2FE, 3.5, 60);
    keyLight.position.set(12, 10, 15);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x8B5CF6, 2.5, 50);
    rimLight.position.set(-15, -10, -5);
    scene.add(rimLight);

    // Cursor Tracking for 3D Camera
    window.addEventListener('pointermove', function (e) {
      state.mouse.targetX = (e.clientX - state.windowHalfX) * 0.0008;
      state.mouse.targetY = (e.clientY - state.windowHalfY) * 0.0008;
    }, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Main Crystal
      crystalGroup.rotation.y += 0.005;
      crystalGroup.rotation.x = Math.sin(time * 0.5) * 0.15;
      wireMesh.rotation.y -= 0.008;
      wireMesh.rotation.z += 0.004;

      // Orbiting Satellites
      satellites.forEach(function (sat) {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.position.y = Math.sin(time * 2 + sat.userData.angle) * 1.5;
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Particle Drift
      particles.rotation.y = time * 0.015;

      // Smooth Camera Parallax
      camera.position.x += (state.mouse.targetX * 15 - camera.position.x) * 0.05;
      camera.position.y += (-state.mouse.targetY * 15 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', function () {
      state.windowHalfX = window.innerWidth / 2;
      state.windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  }

  // ==========================================================================
  // 2. CUBERTO MORPHING MAGNETIC CURSOR
  // ==========================================================================
  function initCubertoCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let wrap = document.querySelector('.cuberto-cursor-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'cuberto-cursor-wrap';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = `
        <div class="cuberto-cursor-dot"></div>
        <div class="cuberto-cursor-ring"><span class="cuberto-cursor-text"></span></div>
      `;
      document.body.appendChild(wrap);
    }

    const dot = wrap.querySelector('.cuberto-cursor-dot');
    const ring = wrap.querySelector('.cuberto-cursor-ring');
    const label = wrap.querySelector('.cuberto-cursor-text');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('pointermove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
      // Smooth lerp
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .chip-item, .hero-quad-card');
    interactiveElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('is-hovering-button');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('is-hovering-button');
      });
    });

    // Project Cards Hover
    const cards = document.querySelectorAll('.cs-card, .interactive-3d-card, .result-card, .review-card, .lusion-holo-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        document.body.classList.add('is-hovering-card');
        label.textContent = card.dataset.cursor || 'EXPLORE';
      });
      card.addEventListener('mouseleave', function () {
        document.body.classList.remove('is-hovering-card');
        label.textContent = '';
      });
    });

    // Magnetic Button Physics
    const magneticBtns = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-outline, .btn-magnetic-epic');
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.28;
        const deltaY = (e.clientY - btnCenterY) * 0.28;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  // ==========================================================================
  // 3. LUSION 3D HOLOGRAPHIC PORTRAIT GYRO TILT
  // ==========================================================================
  function initHolographicPortraitTilt() {
    const card = document.querySelector('.lusion-holo-card, .hero-showcase-card');
    if (!card) return;

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotX = -(y - 0.5) * 20;
      const rotY = (x - 0.5) * 20;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Dynamic light coordinate
      card.style.setProperty('--mouse-x', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--mouse-y', (y * 100).toFixed(1) + '%');
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================================================
  // 4. ACTIVE THEORY SYNTHESIZED WEB AUDIO SOUND SYSTEM
  // ==========================================================================
  function initActiveTheorySound() {
    function getAudioContext() {
      if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioContext();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      return state.audioCtx;
    }

    // Play subtle synthesized sci-fi harmonic chime
    function playSciFiChime(freq = 520, duration = 0.4) {
      if (!state.audioEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (err) {}
    }

    // Play crisp crystal micro-click
    function playCrystalClick() {
      if (!state.audioEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (err) {}
    }

    // Audio Button in Header
    const audioBtns = document.querySelectorAll('.audio-toggle-btn');
    audioBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.audioEnabled = !state.audioEnabled;
        if (state.audioEnabled) {
          getAudioContext();
          btn.classList.add('is-playing');
          playSciFiChime(440, 0.6);
        } else {
          btn.classList.remove('is-playing');
        }
      });
    });

    // Attach click sounds to interactive items
    document.querySelectorAll('a, button, .chip-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        playCrystalClick();
      }, { passive: true });
    });
  }

  // ==========================================================================
  // 5. LENIS SMOOTH SCROLL INTEGRATION
  // ==========================================================================
  function initLenisSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Initialize All Systems on DOM Ready
  function start() {
    initLusion3DScene();
    initCubertoCursor();
    initHolographicPortraitTilt();
    initActiveTheorySound();
    initLenisSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
