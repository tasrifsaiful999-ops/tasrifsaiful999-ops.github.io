/* Standalone realtime WebGL2 ray-marched sculpture.
 * No external library, no Lusion 3D assets, no CDNs. Device pixel ratio capped.
 * Pointer and scroll responsive; reduced motion, low-power and visibility-aware.
 */
(()=>{
 const canvas=document.getElementById('hero-webgl'),stage=document.getElementById('hero-stage');
 if(!canvas||!stage)return;
 const g=canvas.getContext('webgl2',{antialias:false,alpha:true,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!g){stage.classList.add('webgl-fallback');return}
 const vs=`#version 300 es
 in vec2 position;out vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
 const fs=`#version 300 es
 precision highp float;
 in vec2 vUv;out vec4 fragColor;
 uniform vec2 uResolution;uniform float uTime;uniform float uScroll;uniform vec2 uPointer;
 #define PI 3.14159265
 mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
 float hash(float n){return fract(sin(n)*43758.5453123);}
 float torus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
 float capsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
 vec2 scene(vec3 p){
   float t=uTime*.21;vec3 q=p;
   q.xz*=rot(.22+t*.44+uPointer.x*.20);q.yz*=rot(uScroll*.22);q.xy*=rot(-.24+uPointer.y*.13);
   vec3 a=q; a.xy*=rot(.55+t*.30); a.yz*=rot(.88);float d1=torus(a,vec2(1.16,.285));
   vec3 b=q;b.xy*=rot(-.48-t*.27);b.yz*=rot(-.65);float d2=torus(b,vec2(1.10,.255));
   vec3 c=q;c.xz*=rot(1.10+t*.24);c.yz*=rot(.74);float d3=torus(c,vec2(.92,.20));
   vec3 z=q;z.yz*=rot(.45+t*.12);float d4=capsule(z,vec3(-.53,-.63,-.15),vec3(.58,.61,.1),.12);
   vec2 res=vec2(d1,1.);
   if(d2<res.x)res=vec2(d2,2.);
   if(d3<res.x)res=vec2(d3,3.);
   if(d4<res.x)res=vec2(d4,4.);
   return res;
 }
 vec3 norm(vec3 p){float e=.0018;return normalize(vec3(scene(p+vec3(e,0,0)).x-scene(p-vec3(e,0,0)).x,scene(p+vec3(0,e,0)).x-scene(p-vec3(0,e,0)).x,scene(p+vec3(0,0,e)).x-scene(p-vec3(0,0,e)).x));}
 vec3 env(vec3 r){float grad=pow(max(r.y*.5+.5,0.),2.);vec3 col=mix(vec3(.03,.055,.15),vec3(.45,.5,.8),grad);
  col+=vec3(.55,.60,.78)*pow(max(dot(r,normalize(vec3(-.55,.7,.5))),0.),15.);
  col+=vec3(.18,.21,.46)*pow(max(dot(r,normalize(vec3(.8,-.1,.6))),0.),20.);
  return col;
 }
 void main(){
  vec2 uv=(gl_FragCoord.xy-uResolution*.5)/uResolution.y;float aspect=uResolution.x/uResolution.y;
  vec3 background=mix(vec3(.011,.015,.042),vec3(.06,.07,.14),smoothstep(-.8,.9,uv.y));
  background+=vec3(.035,.055,.15)*(1.-smoothstep(.0,1.6,length(uv-vec2(.3,.12))));
  float vign=1.-.27*smoothstep(.13,1.25,length(uv)); background*=vign;
  vec2 cell=floor((uv+vec2(2.0))*88.);
  float seed=hash(dot(cell,vec2(127.1,311.7)));float st=step(.995,seed);
  vec2 fr=fract((uv+vec2(2.))*88.)-.5;
  background+=vec3(.20,.23,.42)*st*smoothstep(.043,.006,length(fr));
  vec3 ro=vec3(uPointer.x*.13, uPointer.y*.12,4.55);
  vec3 rd=normalize(vec3(uv*.93,-2.55));
  float fade=1.-smoothstep(1.6,2.5,length(uv));
  float dist=0.;float id=-1.;vec3 pos=ro;
  for(int i=0;i<56;i++){
    pos=ro+rd*dist;vec2 hit=scene(pos);
    if(hit.x<.0023){id=hit.y;break;}
    dist+=clamp(hit.x*.74,.013,.28);
    if(dist>9.0)break;
  }
  vec3 col=background;
  if(id>0.){
    vec3 n=norm(pos),v=normalize(ro-pos),refl=reflect(-v,n);
    vec3 lightA=normalize(vec3(-.6,1.1,1.5)),lightB=normalize(vec3(.8,-.3,-.6));
    float diff=max(dot(n,lightA),0.);
    float rim=pow(1.-max(dot(v,n),0.),3.2);
    float spec=pow(max(dot(refl,lightA),0.),65.);
    float spec2=pow(max(dot(refl,lightB),0.),36.);
    vec3 base=id<1.5?vec3(.65,.73,.90):id<2.5?vec3(.035,.085,.96):id<3.5?vec3(.22,.32,.74):vec3(.90,.93,1.);
    float metallic=id<1.5?.9:.78;
    col=base*(.18+.57*diff)+env(refl)*(.63+.25*metallic);
    col+=vec3(1.,1.,1.)*spec*1.6+vec3(.47,.55,1.)*spec2*.85;
    col+=rim*(id<2.5?vec3(.42,.58,1.2):vec3(.7,.76,1.));
    col*=mix(1.,.85,smoothstep(2.0,6.0,dist));
  }
  col=pow(max(col,vec3(0.)),vec3(.87));
  col+=.014*sin(gl_FragCoord.y*1.3+uTime*.6)*sin(gl_FragCoord.x*1.9);
  fragColor=vec4(col,fade);
 }`;
 const compile=(type,src)=>{const s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS)){console.warn('WebGL shader:',g.getShaderInfoLog(s));g.deleteShader(s);return null}return s};
 const a=compile(g.VERTEX_SHADER,vs),b=compile(g.FRAGMENT_SHADER,fs);if(!a||!b){stage.classList.add('webgl-fallback');return}
 const prog=g.createProgram();g.attachShader(prog,a);g.attachShader(prog,b);g.linkProgram(prog);if(!g.getProgramParameter(prog,g.LINK_STATUS)){stage.classList.add('webgl-fallback');console.warn(g.getProgramInfoLog(prog));return}
 g.useProgram(prog);const buffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,buffer);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),g.STATIC_DRAW);
 const loc=g.getAttribLocation(prog,'position');g.enableVertexAttribArray(loc);g.vertexAttribPointer(loc,2,g.FLOAT,false,0,0);
 const uRes=g.getUniformLocation(prog,'uResolution'),uTime=g.getUniformLocation(prog,'uTime'),uPointer=g.getUniformLocation(prog,'uPointer'),uScroll=g.getUniformLocation(prog,'uScroll');
 let mouse={x:0,y:0},cur={x:0,y:0},paused=matchMedia('(prefers-reduced-motion:reduce)').matches,visible=true,last=performance.now(),t=0,raf=0,resizeNeeded=true;
 const toggle=document.getElementById('motion-toggle');if(toggle){toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Play motion ▶':'Pause motion II';toggle.addEventListener('click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Play motion ▶':'Pause motion II';if(!paused&&!raf)raf=requestAnimationFrame(draw)})}
 stage.addEventListener('pointermove',e=>{if(paused)return;const r=stage.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width-.5)*2;mouse.y=-((e.clientY-r.top)/r.height-.5)*2},{passive:true});stage.addEventListener('pointerleave',()=>{mouse.x=mouse.y=0});
 const obs=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw)}, {threshold:0});obs.observe(stage);
 const ro=new ResizeObserver(()=>{resizeNeeded=true;if(!raf)raf=requestAnimationFrame(draw)});ro.observe(stage);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf)raf=requestAnimationFrame(draw)});
 function resize(){const rect=stage.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.2);const max=Math.min(innerWidth<720?390:760,Math.ceil(rect.width*dpr));const scale=max/rect.width;canvas.width=Math.ceil(rect.width*scale);canvas.height=Math.ceil(rect.height*scale);g.viewport(0,0,canvas.width,canvas.height);resizeNeeded=false}
 function draw(now){raf=0;if(!visible||document.hidden)return;const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused)t+=dt;cur.x+=(mouse.x-cur.x)*.045;cur.y+=(mouse.y-cur.y)*.045;if(resizeNeeded)resize();g.useProgram(prog);g.uniform2f(uRes,canvas.width,canvas.height);g.uniform1f(uTime,t);g.uniform2f(uPointer,cur.x,cur.y);g.uniform1f(uScroll,Math.min(1,scrollY/innerHeight));g.drawArrays(g.TRIANGLES,0,6);if(!paused)raf=requestAnimationFrame(draw)}
 raf=requestAnimationFrame(draw);
})();
