(() => {
  const root = document.querySelector("[data-warp-title]");
  const copy = root?.querySelector(".warp-title-copy");
  if (!root || !copy) return;

  const vertex = `#version 300 es
  in vec2 position; out vec2 vUv;
  void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment = `#version 300 es
  precision highp float;
  uniform sampler2D uTextTexture; uniform vec2 uResolution; uniform vec2 uPointer;
  uniform float uPointerActive; uniform float uTime; uniform float uMotion;
  in vec2 vUv; out vec4 fragColor;
  float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}
  vec4 sampleText(vec2 uv){if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return vec4(0);return texture(uTextTexture,uv);}
  void main(){
    vec2 uv=vUv;float aspect=uResolution.x/max(uResolution.y,1.);float time=uTime*.55;
    vec2 drift=vec2(time*.055,-time*.045);float n1=fbm(uv*5.27+drift),n2=fbm((uv+19.17)*5.78-drift.yx);
    vec2 ambient=(vec2(n1,n2)-.5)*.08*.045*uMotion;
    vec2 delta=uv-uPointer,ad=vec2(delta.x*aspect,delta.y);float dist=length(ad),radius=.42,t=clamp(dist/radius,0.,1.);
    float lens=smoothstep(radius,0.,dist)*uPointerActive,bulge=t*(1.-t)*(1.-t)*6.75*uPointerActive;
    vec2 dir=dist>.0001?vec2(ad.x/aspect,ad.y)/dist:vec2(0);
    float ring=(sin(dist*28.-time*4.2)*.5)*bulge*.38*.016;
    vec2 pointerWarp=-dir*bulge*.38*.045+dir*ring;
    vec2 displaced=uv+ambient+pointerWarp,splitDir=ambient+pointerWarp;float splitLen=length(splitDir);
    splitDir=splitLen>.00001?splitDir/splitLen:vec2(.7071);vec2 split=splitDir*.018*.16*(.35+lens*1.65);
    vec4 base=sampleText(displaced);float r=sampleText(displaced+split).r,g=base.g,b=sampleText(displaced-split).b;
    float alpha=max(max(sampleText(displaced+split).a,base.a),sampleText(displaced-split).a);
    fragColor=vec4(vec3(r,g,b)+lens*base.a*.055,alpha);
  }`;

  const gl = document.createElement("canvas").getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return;
  const canvas = gl.canvas;
  canvas.className = "warp-title-canvas";
  canvas.setAttribute("aria-hidden", "true");

  function shader(type, source) {
    const item = gl.createShader(type);
    gl.shaderSource(item, source); gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item));
    return item;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn("WarpText: WebGL shader initialization failed.", error);
    return;
  }

  root.appendChild(canvas);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program, "uTextTexture"), 0);
  const uniforms = {
    resolution: gl.getUniformLocation(program, "uResolution"), pointer: gl.getUniformLocation(program, "uPointer"),
    active: gl.getUniformLocation(program, "uPointerActive"), time: gl.getUniformLocation(program, "uTime"), motion: gl.getUniformLocation(program, "uMotion")
  };
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0,0,0,0);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x:.5, y:.5, tx:.5, ty:.5, active:0, target:0 };
  let visible = true, pageVisible = !document.hidden, raf = 0, start = performance.now();

  function titleText() { return (document.body.dataset.lang === "en" ? "The world of design is vast.\nStart exploring here" : "设计世界很大\n从这里开始找"); }
  function drawText(width, height, dpr) {
    const surface = document.createElement("canvas"); surface.width = Math.max(1, Math.floor(width*dpr)); surface.height = Math.max(1, Math.floor(height*dpr));
    const ctx = surface.getContext("2d"); ctx.scale(dpr,dpr); ctx.clearRect(0,0,width,height);
    const style = getComputedStyle(root); let size = parseFloat(style.fontSize); const family = style.fontFamily, weight = style.fontWeight;
    const lines = titleText().split("\n"), lineHeight = size*1.04; ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
    const fit = () => {ctx.font=`${weight} ${size}px ${family}`;return Math.max(...lines.map(line=>ctx.measureText(line).width));};
    let widest=fit();if(widest>width*.93){size*=width*.93/widest;widest=fit();}
    const step=size*1.04,startY=height/2-step*(lines.length-1)/2;lines.forEach((line,i)=>ctx.fillText(line,width/2,startY+i*step));return surface;
  }
  function resize() {
    const box=root.getBoundingClientRect();if(!box.width||!box.height)return;const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(box.width*dpr);canvas.height=Math.floor(box.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
    gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,drawText(box.width,box.height,dpr));
    root.classList.add("warp-ready");render(performance.now());
  }
  function render(now) {
    const elapsed=(now-start)*.001,idleX=.5+Math.sin(elapsed*.33)*.12,idleY=.5+Math.cos(elapsed*.27)*.1,targetX=pointer.target?pointer.tx:idleX,targetY=pointer.target?pointer.ty:idleY,damping=pointer.target?.12:.035;
    pointer.x+=(targetX-pointer.x)*damping;pointer.y+=(targetY-pointer.y)*damping;pointer.active+=((pointer.target?1:.18)-pointer.active)*.06;
    gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);gl.uniform1f(uniforms.active,reduced.matches?pointer.active*.35:pointer.active);gl.uniform1f(uniforms.time,reduced.matches?0:elapsed);gl.uniform1f(uniforms.motion,reduced.matches?0:1);
    gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function loop(now){render(now);raf=(visible&&pageVisible)?requestAnimationFrame(loop):0;}
  canvas.addEventListener("pointermove", event=>{if(event.pointerType==="touch")return;const box=canvas.getBoundingClientRect();pointer.tx=(event.clientX-box.left)/box.width;pointer.ty=1-(event.clientY-box.top)/box.height;pointer.target=1;});
  canvas.addEventListener("pointerleave",()=>{pointer.target=0;});
  const observer=new ResizeObserver(resize);observer.observe(root);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&pageVisible&&!raf)raf=requestAnimationFrame(loop);if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(root);
  document.addEventListener("visibilitychange",()=>{pageVisible=!document.hidden;if(pageVisible&&visible&&!raf)raf=requestAnimationFrame(loop);if(!pageVisible&&raf){cancelAnimationFrame(raf);raf=0;}});
  document.addEventListener("digest:language",resize);document.addEventListener("digest:theme",resize);reduced.addEventListener("change",()=>render(performance.now()));
  document.fonts?.ready.then(resize).catch(()=>resize());resize();raf=requestAnimationFrame(loop);
})();
