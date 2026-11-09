/**
 * IMMERSIVE 3D UNIVERSE ENGINE — LUSION × CUBERTO × ACTIVE THEORY
 * Custom Creative Development Suite
 */

(function () {
  'use strict';

  const state = {
    audioEnabled: false,
    audioCtx: null,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0 },
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2
  };

  // ==========================================================================
  // 1. LUSION & FRANKY HUNG REAL-TIME 3D WEBGL SCENE (Three.js)
  // ==========================================================================
  function initLusion3DScene() {
    if (typeof THREE === 'undefined') return;

    let canvas = document.getElementById('universeCanvas3D');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'universeCanvas3D';
      document.body.prepend(canvas);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Franky Hung Iridescent Chromatic Fluid Sphere
    const sphereGeo = new THREE.SphereGeometry(4.2, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x00F2FE,
      emissive: 0x051a3a,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.45,
      transparent: true,
      opacity: 0.85
    });
    const mainSphere = new THREE.Mesh(sphereGeo, sphereMat);
    mainSphere.position.set(0, 0, -3);
    scene.add(mainSphere);

    // Glowing Wireframe Aura around Sphere
    const auraGeo = new THREE.SphereGeometry(4.6, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x4FACFE,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    mainSphere.add(auraMesh);

    // 2. Lusion Intersecting Physics Cross Jacks
    function createLusionJack(colorHex, scale = 1.0) {
      const jackGroup = new THREE.Group();
      const cylGeo = new THREE.CylinderGeometry(0.48 * scale, 0.48 * scale, 3.5 * scale, 32);
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.15,
        metalness: 0.85,
        clearcoat: 0.9
      });

      const c1 = new THREE.Mesh(cylGeo, mat);
      const c2 = new THREE.Mesh(cylGeo, mat);
      c2.rotation.z = Math.PI / 2;
      const c3 = new THREE.Mesh(cylGeo, mat);
      c3.rotation.x = Math.PI / 2;

      jackGroup.add(c1, c2, c3);
      return jackGroup;
    }

    const jacks = [
      { mesh: createLusionJack(0x00F2FE, 1.1), x: -8.5, y: 3.2, z: -1, rx: 0.007, ry: 0.009 },
      { mesh: createLusionJack(0xFFFFFF, 0.9), x: 8.5, y: -2.5, z: 1, rx: -0.008, ry: 0.006 },
      { mesh: createLusionJack(0x10E7C3, 0.75), x: -6.5, y: -4.5, z: 2, rx: 0.009, ry: -0.007 },
      { mesh: createLusionJack(0x8B5CF6, 1.0), x: 7.5, y: 4.5, z: -3, rx: -0.006, ry: -0.008 }
    ];

    jacks.forEach(j => {
      j.mesh.position.set(j.x, j.y, j.z);
      scene.add(j.mesh);
    });

    // 3. Volumetric Particle Cosmos
    const particleCount = 1000;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 65;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lights
    const ambLight = new THREE.AmbientLight(0x0a1e3f, 2.5);
    scene.add(ambLight);

    const light1 = new THREE.PointLight(0x00F2FE, 4, 60);
    light1.position.set(12, 12, 12);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x8B5CF6, 3, 50);
    light2.position.set(-12, -10, 6);
    scene.add(light2);

    // Mouse Tracking
    window.addEventListener('pointermove', function (e) {
      state.mouse.targetX = (e.clientX - state.windowHalfX) * 0.0008;
      state.mouse.targetY = (e.clientY - state.windowHalfY) * 0.0008;
    }, { passive: true });

    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Rotate sphere
      mainSphere.rotation.y = time * 0.15;
      mainSphere.rotation.x = Math.sin(time * 0.3) * 0.1;
      auraMesh.rotation.y -= 0.008;

      // Tumble jacks
      jacks.forEach(j => {
        j.mesh.rotation.x += j.rx;
        j.mesh.rotation.y += j.ry;
        j.mesh.position.y += Math.sin(time + j.x) * 0.008;
      });

      // Particle Drift
      particles.rotation.y = time * 0.015;

      // Camera parallax
      camera.position.x += (state.mouse.targetX * 14 - camera.position.x) * 0.05;
      camera.position.y += (-state.mouse.targetY * 14 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

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
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .chip-item, .portal-hud-card, .spatial-orbit-card');
    interactiveElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('is-hovering-button');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('is-hovering-button');
      });
    });

    // Project Cards Hover
    const cards = document.querySelectorAll('.cs-card, .spatial-orbit-card, .result-card, .review-card');
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
    const magneticBtns = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-outline, .btn-magnetic-epic, .audio-toggle-btn');
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
  // 3. ANDREAS ANTONSSON 3D TILTED PHOTO PORTAL
  // ==========================================================================
  function initPhotoPortalTilt() {
    const card = document.querySelector('.portal-stage-inner');
    if (!card) return;

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotX = -(y - 0.5) * 16;
      const rotY = (x - 0.5) * 16;

      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1200px) rotateX(6deg) rotateY(-3deg) scale3d(1, 1, 1)';
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

    document.querySelectorAll('a, button, .chip-item, .portal-hud-card, .spatial-orbit-card').forEach(function (el) {
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

  function start() {
    initLusion3DScene();
    initCubertoCursor();
    initPhotoPortalTilt();
    initActiveTheorySound();
    initLenisSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
