/* ═══════════════════════════════════════════════════════
   SAIFUL — 3D SCENE
   One fixed WebGL stage behind the whole site. Backdrop is a
   liquid shader that shifts between the light and navy zones of
   the page; a pool of metal / glass / liquid-chrome objects is
   re-formed per page ("scene presets") and scroll-driven.
═══════════════════════════════════════════════════════ */
import * as THREE from '/assets/vendor/three.module.min.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

const CFG = {
  home:     { layout: 'scatter', n: [15, 9],  mix: [['blob', 'liquid'], ['ico', 'glass'], ['torus', 'chrome'], ['oct', 'steel'], ['knot', 'chrome'], ['sphere', 'navy'], ['ico', 'steel'], ['torus', 'glass']] },
  services: { layout: 'helix',   n: [14, 9],  mix: [['torus', 'chrome'], ['ico', 'glass'], ['torus', 'steel'], ['oct', 'chrome'], ['sphere', 'navy']] },
  results:  { layout: 'bars',    n: [17, 11], mix: [['sphere', 'chrome'], ['torus', 'glass'], ['oct', 'steel'], ['ico', 'chrome']], bars: 8 },
  seo:      { layout: 'network', n: [15, 10], mix: [['sphere', 'glow'], ['oct', 'chrome'], ['sphere', 'steel']] },
  cases:    { layout: 'stack',   n: [12, 8],  mix: [['screen', 'ice'], ['screen', 'glass'], ['ring', 'chrome'], ['screen', 'steel']] },
  case:     { layout: 'stack',   n: [10, 7],  mix: [['screen', 'steel'], ['screen', 'ice'], ['ring', 'chrome'], ['screen', 'glass']] },
  reviews:  { layout: 'orbs',    n: [14, 9],  mix: [['sphere', 'chrome'], ['sphere', 'glass'], ['oct', 'steel'], ['sphere', 'navy'], ['blob', 'liquid']] },
  consult:  { layout: 'rings',   n: [14, 9],  mix: [['sphere', 'chrome'], ['blob', 'liquid'], ['sphere', 'glass'], ['oct', 'steel']], rings: 6 }
};

export function initScene({ page, low, gsap }) {
  const cfg = CFG[page] || CFG.home;

  /* ── renderer ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'gl-stage';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('webgl2', { antialias: !low, powerPreference: 'high-performance', alpha: false });
  if (!ctx) throw new Error('WebGL2 unavailable');
  const renderer = new THREE.WebGLRenderer({ canvas, context: ctx });
  const dprMax = low ? 1.5 : 2;
  let dpr = Math.min(window.devicePixelRatio || 1, dprMax);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  document.body.insertBefore(canvas, document.body.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 0, 10);

  const timeU = { value: 0 };
  const themeU = { value: 0 };

  /* ── procedural studio environment (reflections for metal/glass) ── */
  const env = (() => {
    const s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x0b2545 })));
    const panel = (w, h, x, y, z, c, i) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
    };
    panel(9, 3, 0, 6, 2, 0xffffff, 5);
    panel(3, 7, -6, 1, 2, 0x5b9fd5, 3.5);
    panel(3, 7, 6, 0, -2, 0x2e6da4, 3);
    panel(7, 2, 0, -5, 3, 0xebf3fc, 2.2);
    const pm = new THREE.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.04).texture;
    pm.dispose();
    s.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    return tex;
  })();
  scene.environment = env;

  /* ── liquid backdrop ── */
  const OCT = low ? 3 : 5;
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { uTime: timeU, uTheme: themeU, uScroll: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uEdge: { value: new Array(8).fill(1e5) }, uVal: { value: new Array(8).fill(0) }, uVh: { value: 800 } },
    vertexShader: 'void main(){gl_Position=vec4(position.xy,1.0,1.0);}',
    fragmentShader: `
      uniform float uTime,uTheme,uScroll; uniform vec2 uRes,uMouse; uniform float uEdge[8]; uniform float uVal[8]; uniform float uVh;
      float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<${OCT};i++){v+=a*noise(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/uRes;
        vec2 p=(uv-.5)*vec2(uRes.x/uRes.y,1.)*1.7; p.y+=uScroll*.9;
        float t=uTime*.055;
        vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
        vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.3),fbm(p+3.*q+vec2(8.3,2.8)-t*1.1));
        float f=fbm(p+3.*r);
        f+=smoothstep(.45,0.,distance(uv,uMouse))*.16;
        vec3 ice=vec3(.969,.980,.992), pale=vec3(.918,.953,.988), mist=vec3(.74,.85,.95);
        vec3 lt=mix(ice,pale,smoothstep(.2,.8,f)); lt=mix(lt,mist,smoothstep(.55,.98,f)*.6);
        float c=abs(fract(f*8.)-.5); float line=1.-smoothstep(0.,.035,c);
        lt-=line*.03;
        vec3 navy=vec3(.027,.09,.173), mid=vec3(.086,.227,.42), steel=vec3(.18,.43,.64);
        vec3 dk=mix(navy,mid,smoothstep(.25,.85,f)); dk=mix(dk,steel,smoothstep(.62,1.,f)*.55);
        dk+=line*.05*vec3(.35,.62,.9);
        float py=(1.-uv.y)*uVh;
        float th=uVal[0]; for(int i=1;i<8;i++){ th=mix(th,uVal[i],smoothstep(uEdge[i]-36.,uEdge[i]+36.,py)); }
        vec3 col=mix(lt,dk,th);
        float vig=smoothstep(1.25,.35,length(uv-.5)); col*=mix(.94,1.,vig);
        gl_FragColor=vec4(col,1.);
      }`,
    depthTest: false, depthWrite: false, toneMapped: false
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bg.frustumCulled = false; bg.renderOrder = -10;
  scene.add(bg);

  /* ── materials ── */
  const blobMat = new THREE.MeshStandardMaterial({ color: 0xd3e3f7, metalness: 1, roughness: 0.07, envMapIntensity: 1.5 });
  blobMat.onBeforeCompile = sh => {
    sh.uniforms.uTime = timeU;
    sh.vertexShader = sh.vertexShader
      .replace('void main() {', `uniform float uTime;
        float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
        float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
          return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
        vec3 disp(vec3 d){float n=n3(d*1.6+uTime*.35)*.6+n3(d*3.1-uTime*.5)*.25;return d*(.78+.6*n);}
        void main() {`)
      .replace('#include <beginnormal_vertex>', `vec3 dn=normalize(position);vec3 tt=normalize(cross(dn,vec3(0.,1.,.001)));vec3 bb=cross(dn,tt);
        vec3 p0=disp(dn);vec3 p1=disp(normalize(dn+tt*.03));vec3 p2=disp(normalize(dn+bb*.03));
        vec3 objectNormal=normalize(cross(p1-p0,p2-p0));`)
      .replace('#include <begin_vertex>', 'vec3 transformed=p0;');
  };
  const glassHigh = !low;
  const mats = {
    liquid: blobMat,
    chrome: new THREE.MeshStandardMaterial({ color: 0xbcd0ea, metalness: 1, roughness: 0.16, envMapIntensity: 1.25 }),
    steel:  new THREE.MeshStandardMaterial({ color: 0x2e6da4, metalness: 0.75, roughness: 0.28, envMapIntensity: 1.1 }),
    navy:   new THREE.MeshStandardMaterial({ color: 0x163a6b, metalness: 0.9, roughness: 0.22, envMapIntensity: 1.3 }),
    ice:    new THREE.MeshStandardMaterial({ color: 0xebf3fc, metalness: 0.25, roughness: 0.32 }),
    glow:   new THREE.MeshBasicMaterial({ color: 0x7db9ea }),
    glass:  glassHigh
      ? new THREE.MeshPhysicalMaterial({ color: 0xdbeaff, transmission: 1, thickness: 1.1, roughness: 0.06, ior: 1.45, attenuationColor: new THREE.Color(0x5b9fd5), attenuationDistance: 2.6, envMapIntensity: 1.2 })
      : new THREE.MeshStandardMaterial({ color: 0xcfe3fb, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.5, envMapIntensity: 1.2 })
  };
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x7db9ea, transparent: true, opacity: 0.8 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5b9fd5, transparent: true, opacity: 0.4 });

  const geos = {
    ico: new THREE.IcosahedronGeometry(0.8, 1),
    oct: new THREE.OctahedronGeometry(0.85),
    torus: new THREE.TorusGeometry(0.7, 0.2, 24, 72),
    ring: new THREE.TorusGeometry(1, 0.022, 12, 160),
    knot: new THREE.TorusKnotGeometry(0.55, 0.17, low ? 96 : 160, low ? 12 : 18),
    sphere: new THREE.SphereGeometry(0.6, 32, 24),
    box: new THREE.BoxGeometry(1, 1, 1),
    screen: new THREE.BoxGeometry(1.7, 1.05, 0.07),
    blob: new THREE.IcosahedronGeometry(1, low ? 14 : 30)
  };

  /* ── lights ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x5b9fd5, 1.4); rim.position.set(5, -2, -3); scene.add(rim);
  const pointer = new THREE.PointLight(0x7db9ea, 45, 16); pointer.position.set(0, 0, 3.5); scene.add(pointer);

  /* ── object pool ── */
  const N = low ? cfg.n[1] : cfg.n[0];
  const objs = [];
  const group = new THREE.Group();
  scene.add(group);
  for (let i = 0; i < N; i++) {
    let spec;
    if (cfg.layout === 'bars' && i < cfg.bars) spec = ['box', i % 2 ? 'steel' : 'chrome'];
    else if (cfg.layout === 'rings' && i < cfg.rings) spec = ['ring', i % 2 ? 'chrome' : 'steel'];
    else spec = cfg.mix[(i - (cfg.bars || cfg.rings || 0) + 100) % cfg.mix.length];
    const mesh = new THREE.Mesh(geos[spec[0]], mats[spec[1]]);
    mesh.frustumCulled = false;
    const r = rnd();
    const o = {
      mesh, type: spec[0], i,
      p: (i + 0.5) / N,
      side: i % 2 ? 1 : -1,
      fxa: 0.8 + rnd() * 0.26,
      z: -2.6 + rnd() * 4.0,
      s: (spec[0] === 'blob' ? 1.1 : spec[0] === 'screen' ? 1.1 : 0.75) + rnd() * 0.55,
      spin: new THREE.Vector3((rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.3),
      phase: rnd() * 6.28,
      par: 0.55 + r * 0.3,
      delay: 0.25 + i * 0.07,
      pulse: 0, sx: 1
    };
    mesh.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    mesh.scale.setScalar(0.0001);
    group.add(mesh);
    objs.push(o);
  }
  const barObjs = cfg.layout === 'bars' ? objs.slice(0, cfg.bars) : [];
  const ringObjs = cfg.layout === 'rings' ? objs.slice(0, cfg.rings) : [];

  /* network lines */
  let lines = null, linePos = null;
  if (cfg.layout === 'network') {
    linePos = new Float32Array(N * N * 3);
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lg.setDrawRange(0, 0);
    lines = new THREE.LineSegments(lg, lineMat);
    lines.frustumCulled = false;
    scene.add(lines);
  }

  /* portrait halo (home) — rings + orbiting beads track the real photo's position */
  const halo = [];
  const portraitEl = page === 'home' ? document.querySelector('.hero-portrait-frame') : null;
  if (portraitEl) {
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(geos.ring, ringMat);
      m.frustumCulled = false; m.rotation.set(0.9 + i * 0.35, i * 0.6, i * 0.9); scene.add(m);
      halo.push({ m, k: 0.62 + i * 0.13, sp: 0.18 + i * 0.07, dir: i % 2 ? -1 : 1 });
    }
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(geos.sphere, i % 2 ? mats.chrome : mats.glow);
      m.frustumCulled = false; scene.add(m);
      halo.push({ m, bead: true, k: 0.7 + i * 0.08, sp: 0.35 + i * 0.12, ph: i * 1.7, tilt: 0.5 + i * 0.4 });
    }
  }

  /* ── particles ── */
  const PN = low ? 150 : 520;
  const pg = new THREE.BufferGeometry();
  const pp = new Float32Array(PN * 3), ps = new Float32Array(PN * 3);
  for (let i = 0; i < PN; i++) {
    pp[i * 3] = (rnd() - 0.5) * 18; pp[i * 3 + 1] = (rnd() - 0.5) * 9; pp[i * 3 + 2] = -4 + rnd() * 7;
    ps[i * 3] = rnd(); ps[i * 3 + 1] = rnd(); ps[i * 3 + 2] = rnd();
  }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  pg.setAttribute('aSeed', new THREE.BufferAttribute(ps, 3));
  const pU = { uTime: timeU, uTheme: themeU, uScroll: { value: 0 }, uWpp: { value: 0.01 }, uH: { value: 9 }, uPR: { value: dpr } };
  const points = new THREE.Points(pg, new THREE.ShaderMaterial({
    uniforms: pU, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime,uScroll,uWpp,uH,uPR; attribute vec3 aSeed; varying float vA;
      void main(){ vec3 p=position; p.x+=sin(uTime*.2+aSeed.x*6.28)*.35;
        p.y=mod(p.y+uTime*.05*(.4+aSeed.y)-uScroll*uWpp*(.2+aSeed.z*.55)+uH*.5,uH)-uH*.5;
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
        gl_PointSize=(2.+aSeed.z*5.)*uPR*(9./-mv.z); vA=.25+.6*aSeed.z; }`,
    fragmentShader: `uniform float uTheme; varying float vA;
      void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d)*vA;
        vec3 col=mix(vec3(.18,.43,.64),vec3(.75,.88,1.),uTheme); gl_FragColor=vec4(col,a); }`
  }));
  points.frustumCulled = false;
  scene.add(points);

  /* ── state ── */
  const S = {
    vw: 1, vh: 1, visH: 2 * Math.tan(THREE.MathUtils.degToRad(20)) * 10, visW: 1, wpp: 0.01,
    mx: 0, my: 0, tx: 0, ty: 0, scrollY: 0, lastScroll: 0, vel: 0, maxS: 1, t: 0,
    sections: [], themeT: 0, themeCheck: 0, level: 0, frames: 0, acc: 0, fps: 60, running: true
  };
  const v3 = new THREE.Vector3();

  function measure() {
    S.vw = window.innerWidth; S.vh = window.innerHeight;
    renderer.setSize(S.vw, S.vh, false);
    canvas.style.width = '100%'; canvas.style.height = '100%';
    camera.aspect = S.vw / S.vh; camera.updateProjectionMatrix();
    S.visW = S.visH * camera.aspect;
    S.wpp = S.visH / S.vh;
    bgMat.uniforms.uRes.value.set(S.vw * dpr, S.vh * dpr);
    pU.uWpp.value = S.wpp; pU.uH.value = S.visH * 1.25; pU.uPR.value = dpr;
    S.maxS = Math.max(1, document.documentElement.scrollHeight - S.vh);
    const sc = window.scrollY;
    S.sections = [...document.querySelectorAll('main > section, footer')].map(el => {
      const r = el.getBoundingClientRect();
      return { top: r.top + sc, bottom: r.bottom + sc, dark: el.matches('#hero,.page-hero,#experience,#contact,footer') };
    });
  }
  measure();
  const mobile = () => S.vw < 768;

  /* ── input ── */
  const onMove = e => {
    S.tx = (e.clientX / S.vw) * 2 - 1; S.ty = -((e.clientY / S.vh) * 2 - 1);
    bgMat.uniforms.uMouse.value.set(e.clientX / S.vw, 1 - e.clientY / S.vh);
  };
  const onDown = e => {
    // tap / click: nearest objects get an impulse (touch + mouse interaction with the 3D layer)
    const sx = (e.clientX / S.vw) * 2 - 1, sy = -((e.clientY / S.vh) * 2 - 1);
    const ranked = objs.map(o => { v3.copy(o.mesh.position).project(camera); return { o, d: Math.hypot(v3.x - sx, v3.y - sy) }; }).sort((a, b) => a.d - b.d);
    ranked.slice(0, 3).forEach(r => { r.o.pulse = 1; r.o.spin.multiplyScalar(1.6).clampLength(0, 3); });
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  let rz; const onResize = () => { clearTimeout(rz); rz = setTimeout(measure, 120); };
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize); ro.observe(document.body);

  /* ── placement ── */
  function slot(o, k) {
    const sy = S.vh / 2 + (o.p * S.maxS - S.scrollY) * o.par;
    return { x: o.side * o.fxa * S.visW / 2 * k, y: -(sy - S.vh / 2) * S.wpp * k };
  }

  function update(dt) {
    const t = S.t, boost = 1 + Math.min(S.vel * 0.0016, 4);
    const m = mobile();
    const sizeK = m ? 0.62 : 1;
    const barsOn = cfg.layout === 'bars';
    const prog = clamp(S.scrollY / S.maxS, 0, 1);
    let P = null;
    if (portraitEl) {
      const r = portraitEl.getBoundingClientRect();
      if (r.bottom > -200 && r.top < S.vh + 200 && r.width > 0) {
        P = { x: ((r.left + r.width / 2) / S.vw - 0.5) * S.visW + S.mx * 0.12, y: -((r.top + r.height / 2) / S.vh - 0.5) * S.visH + S.my * 0.08, rad: r.width * S.wpp * 0.5 };
      }
    }

    objs.forEach(o => {
      const mesh = o.mesh;
      if (mesh.visible === false) return;
      const k = (10 - o.z) / 10;
      let { x, y } = slot(o, k);
      let sx = 1, sy = 1, sz = 1;
      let zz = o.z, anchorS = 0;
      const bob = Math.sin(t * 0.5 + o.phase) * 0.22;
      x += Math.sin(t * 0.27 + o.phase) * 0.25 + S.mx * (o.z + 3) * 0.14;
      y += bob + S.my * (o.z + 3) * 0.1;

      if (P && o.i < 2) { // hero companions: liquid chrome + glass solid orbit the real portrait
        const a = o.i === 0 ? 0.55 : 3.6;
        x = P.x + Math.cos(a + Math.sin(t * 0.25) * 0.15) * P.rad * (o.i ? 2.35 : 2.1) + 0;
        y = P.y + Math.sin(a + Math.sin(t * 0.25) * 0.15) * P.rad * (o.i ? 1.15 : 1.25);
        zz = o.i ? -0.2 : -1.4; anchorS = P.rad * (o.i ? 0.34 : 0.52);
      } else if (cfg.layout === 'helix') {
        const a = o.p * 22 + (o.side > 0 ? 3.14 : 0);
        x = o.side * (0.88 + 0.08 * Math.sin(a)) * S.visW / 2 * k;
        zz = 1.8 * Math.cos(a);
        sx = sy = sz = 0.82;
      } else if (cfg.layout === 'orbs') {
        x += Math.cos(t * 0.45 + o.phase) * 0.42; y += Math.sin(t * 0.45 + o.phase) * 0.42; sx = sy = sz = 1.15;
      } else if (cfg.layout === 'stack') {
        if (o.type === 'screen') { mesh.rotation.y = o.side * 0.55 + S.mx * 0.22 + Math.sin(t * 0.3 + o.phase) * 0.12; mesh.rotation.x = 0.12 + Math.sin(t * 0.25 + o.phase) * 0.08 + S.scrollY * 0.0003; mesh.rotation.z = o.side * -0.08; }
      } else if (barsOn && o.i < cfg.bars) {
        const g = ease(clamp(prog * 1.25 + 0.12, 0, 1));
        const h = 0.45 + (0.9 + o.i * 0.36) * g * (0.88 + 0.12 * Math.sin(t * 0.9 + o.i));
        const xs = m ? lerp(0.5, 0.94, o.i / (cfg.bars - 1)) : lerp(0.52, 0.94, o.i / (cfg.bars - 1));
        x = xs * S.visW / 2; y = -S.visH / 2 + h / 2 + 0.05; zz = -1.4;
        sx = sz = (m ? 0.2 : 0.3); sy = h;
        mesh.rotation.set(0, 0.45 + S.mx * 0.25 + t * 0.1, 0);
      } else if (cfg.layout === 'rings' && o.i < cfg.rings) {
        const cx = (m ? 0.5 : 0.62) * S.visW / 2, cy = -((S.vh * 0.36 - S.scrollY * 0.45) - S.vh / 2) * S.wpp;
        x = cx + S.mx * 0.3; y = cy + S.my * 0.2; zz = -1;
        const sc = (0.85 + o.i * 0.36) * (1 - 0.22 * prog) * (m ? 0.7 : 1);
        sx = sy = sz = sc / o.s;
        mesh.rotation.x = t * (0.18 + o.i * 0.05) * (o.i % 2 ? 1 : -1) + o.i;
        mesh.rotation.y = t * (0.12 + o.i * 0.04) + o.i * 0.6;
      }

      if (!(barsOn && o.i < cfg.bars) && !(cfg.layout === 'rings' && o.i < cfg.rings) && !(cfg.layout === 'stack' && o.type === 'screen')) {
        mesh.rotation.x += o.spin.x * dt * boost * (cfg.layout === 'helix' ? 1.6 : 1);
        mesh.rotation.y += o.spin.y * dt * boost * (cfg.layout === 'helix' ? 1.6 : 1);
        mesh.rotation.z += o.spin.z * dt * boost;
      }
      o.pulse *= Math.pow(0.04, dt);
      const ap = ease(clamp((t - o.delay) * 0.9, 0, 1));
      const base = (barsOn && o.i < cfg.bars) ? 1 : (anchorS || o.s * sizeK);
      const pul = 1 + o.pulse * 0.6 + (cfg.layout === 'network' ? 0.14 * Math.sin(t * 1.4 + o.phase) : 0);
      mesh.position.set(x, y, zz);
      mesh.scale.set(Math.max(1e-4, base * sx * ap * pul), Math.max(1e-4, base * sy * ap * pul), Math.max(1e-4, base * sz * ap * pul));
      if (barsOn && o.i < cfg.bars) mesh.scale.set(sx * ap, Math.max(1e-4, sy * ap), sz * ap);
    });

    if (lines) {
      let n = 0;
      const lim = m ? 2.6 : 3.4;
      for (let a = 0; a < N; a++) {
        const pa = objs[a].mesh.position;
        if (Math.abs(pa.y) > S.visH * 0.75) continue;
        for (let b = a + 1; b < N; b++) {
          const pb = objs[b].mesh.position;
          if (Math.abs(pb.y) > S.visH * 0.75) continue;
          if (pa.distanceTo(pb) < lim) { linePos.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], n * 6); n++; }
        }
      }
      lines.geometry.setDrawRange(0, n * 2);
      lines.geometry.attributes.position.needsUpdate = true;
    }

    if (halo.length && portraitEl) {
      if (P) {
        const wx = P.x, wy = P.y, rad = P.rad;
        const ap = ease(clamp((t - 0.9) * 0.8, 0, 1));
        halo.forEach(h => {
          h.m.visible = true;
          if (!h.bead) {
            h.m.position.set(wx, wy, -0.6);
            h.m.scale.setScalar(rad * h.k * 2.15 * ap + 1e-4);
            h.m.rotation.x += dt * h.sp * h.dir; h.m.rotation.y += dt * h.sp * 0.6;
          } else {
            const a = t * h.sp + h.ph, R = rad * h.k * 1.7;
            h.m.position.set(wx + Math.cos(a) * R, wy + Math.sin(a) * R * Math.cos(h.tilt), -0.6 + Math.sin(a) * R * 0.5);
            h.m.scale.setScalar((0.09 + 0.04 * Math.sin(t + h.ph)) * rad * ap + 1e-4);
          }
        });
      } else halo.forEach(h => { h.m.visible = false; });
    }
  }

  function themeTarget() {
    const y = S.scrollY + S.vh * 0.5;
    const s = S.sections.find(s => y >= s.top && y < s.bottom);
    return s ? (s.dark ? 1 : 0) : (S.themeT);
  }

  /* ── frame ── */
  let started = false, first = true;
  function frame(time, deltaMs) {
    if (!S.running) return;
    const dt = Math.min(deltaMs / 1000, 0.05) || 0.016;
    S.t += dt; timeU.value = S.t;
    S.scrollY = window.scrollY;
    const dv = Math.abs(S.scrollY - S.lastScroll) / Math.max(dt, 0.001);
    S.vel = lerp(S.vel, dv, 1 - Math.exp(-8 * dt)); S.lastScroll = S.scrollY;
    S.mx = lerp(S.mx, S.tx, 1 - Math.exp(-4 * dt)); S.my = lerp(S.my, S.ty, 1 - Math.exp(-4 * dt));
    S.themeCheck += dt;
    if (S.themeCheck > 0.08) { S.themeCheck = 0; S.themeT = themeTarget(); }
    themeU.value = lerp(themeU.value, S.themeT, 1 - Math.exp(-3.2 * dt));
    {
      const vis = S.sections.filter(x => x.bottom > S.scrollY && x.top < S.scrollY + S.vh).slice(0, 8);
      const E = bgMat.uniforms.uEdge.value, V = bgMat.uniforms.uVal.value;
      for (let i = 0; i < 8; i++) { if (vis[i]) { E[i] = vis[i].top - S.scrollY; V[i] = vis[i].dark ? 1 : 0; } else { E[i] = 1e5; V[i] = V[Math.max(0, i - 1)]; } }
      if (vis.length === 0) V[0] = S.themeT;
      bgMat.uniforms.uVh.value = S.vh;
    }
    bgMat.uniforms.uScroll.value = S.scrollY / S.vh; pU.uScroll.value = S.scrollY;
    camera.position.x = S.mx * 0.35; camera.position.y = S.my * 0.22; camera.lookAt(0, 0, 0);
    pointer.position.set(S.mx * S.visW / 2 * 0.9, S.my * S.visH / 2 * 0.9, 3.5);
    group.rotation.y = S.mx * 0.05;

    update(dt);
    renderer.render(scene, camera);

    if (first) { first = false; canvas.style.opacity = '1'; document.dispatchEvent(new CustomEvent('gl:ready')); }

    // adaptive quality governor
    S.frames++; S.acc += Math.max(deltaMs, 1) / 1000;
    if (S.acc > 2.2) {
      S.fps = S.frames / S.acc; S.frames = 0; S.acc = 0;
      if (S.fps < 38 && S.level < 3) {
        S.level++;
        if (S.level === 1 && dpr > 1) { dpr = 1; renderer.setPixelRatio(1); measure(); }
        else if (S.level === 2) { objs.forEach((o, i) => { if (i % 2 && !(cfg.layout === 'bars' && o.i < cfg.bars)) o.mesh.visible = false; }); }
        else if (S.level === 3) { mats.glass.transmission !== undefined && (mats.glass.transmission = 0, mats.glass.transparent = true, mats.glass.opacity = 0.45, mats.glass.needsUpdate = true); }
      }
    }
    window.__gl = { page, layout: cfg.layout, fps: Math.round(S.fps), level: S.level, objects: objs.length, theme: +themeU.value.toFixed(2), dpr };
  }

  window.__glSkip = sec => { S.t += sec; themeU.value = S.themeT; };
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity .9s ease';
  gsap.ticker.add(frame);

  /* context loss → hand the page back to the original design */
  const onLost = e => { e.preventDefault(); api.dispose(); document.documentElement.classList.remove('gl-on'); };
  canvas.addEventListener('webglcontextlost', onLost);

  const api = {
    dispose() {
      S.running = false;
      gsap.ticker.remove(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      Object.values(geos).forEach(g => g.dispose());
      Object.values(mats).forEach(m => m.dispose());
      pg.dispose(); renderer.dispose(); env.dispose();
      canvas.remove();
    },
    remeasure: measure
  };
  window.addEventListener('pagehide', () => api.dispose(), { once: true });
  return api;
}
