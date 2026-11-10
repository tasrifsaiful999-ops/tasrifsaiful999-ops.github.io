/**
 * IMMERSIVE 3D CONTENT-FIRST STORY ENGINE
 * Where the Website Content Itself is the 3D Animated Experience
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
  // 1. CONTENT-FIRST 3D STORYTELLING SYSTEM (Three.js & Scroll Progress)
  // ==========================================================================
  function initContentStory3D() {
    const canvas = document.getElementById('storyCanvas3D');
    const wrapper = document.getElementById('storyWrapper');
    if (!canvas || !wrapper || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Saiful's Authentic Portrait as a 3D Textured Mesh
    const texLoader = new THREE.TextureLoader();
    const portraitTex = texLoader.load('/assets/images/hero.webp');
    const planeGeo = new THREE.PlaneGeometry(6.8, 8.8, 32, 32);
    const planeMat = new THREE.MeshPhysicalMaterial({
      map: portraitTex,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    });
    const portraitMesh = new THREE.Mesh(planeGeo, planeMat);
    portraitMesh.position.set(0, 0, 0);
    scene.add(portraitMesh);

    // Glowing Holographic Cage around Portrait Mesh
    const cageGeo = new THREE.BoxGeometry(7.2, 9.2, 1.2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    portraitMesh.add(cageMesh);

    // Studio Lights
    const ambLight = new THREE.AmbientLight(0xFFFFFF, 1.6);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight(0x00F2FE, 3.5, 60);
    pointLight.position.set(12, 12, 15);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0x8B5CF6, 2.5, 50);
    rimLight.position.set(-12, -10, 5);
    scene.add(rimLight);

    // Chapter Layers & Scroll Logic
    const layers = [
      document.getElementById('storyLayer1'),
      document.getElementById('storyLayer2'),
      document.getElementById('storyLayer3'),
      document.getElementById('storyLayer4'),
      document.getElementById('storyLayer5')
    ];
    const chapterNameEl = document.getElementById('storyChapterName');
    const progressBar = document.getElementById('storyProgressBar');

    const chapterTitles = [
      'Act 01 · Monumental Hero',
      'Act 02 · Quantitative Proof',
      'Act 03 · Anzara Case Study',
      'Act 04 · Elor CPR Record',
      'Act 05 · Initiate Growth'
    ];

    function updateStory() {
      const rect = wrapper.getBoundingClientRect();
      const totalDist = wrapper.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / totalDist));

      if (progressBar) {
        progressBar.style.width = (progress * 100).toFixed(1) + '%';
      }

      // Calculate active layer index (0 to 4)
      const activeIdx = Math.min(4, Math.floor(progress * 5));

      layers.forEach((layer, idx) => {
        if (!layer) return;
        if (idx === activeIdx) {
          layer.classList.add('is-active');
        } else {
          layer.classList.remove('is-active');
        }
      });

      if (chapterNameEl) {
        chapterNameEl.textContent = chapterTitles[activeIdx];
      }

      // Physical 3D Transformation of Portrait Mesh driven by scroll progress!
      portraitMesh.rotation.y = (progress * Math.PI * 2) * 0.45;
      portraitMesh.rotation.x = Math.sin(progress * Math.PI) * 0.28;
      portraitMesh.position.z = -progress * 16;
      portraitMesh.position.x = Math.sin(progress * Math.PI * 2) * 8.5;
    }

    window.addEventListener('scroll', updateStory, { passive: true });
    updateStory();

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
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
    const interactiveElements = document.querySelectorAll('a, button, .btn, .chip-item, .metric-monolith-card, .proof-monolith-box');
    interactiveElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('is-hovering-button');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('is-hovering-button');
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
  // 3. ACTIVE THEORY SYNTHESIZED WEB AUDIO SOUND SYSTEM
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

    document.querySelectorAll('a, button, .chip-item, .metric-monolith-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        playCrystalClick();
      }, { passive: true });
    });
  }

  // ==========================================================================
  // 4. LENIS SMOOTH SCROLL INTEGRATION
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
    initContentStory3D();
    initCubertoCursor();
    initActiveTheorySound();
    initLenisSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
