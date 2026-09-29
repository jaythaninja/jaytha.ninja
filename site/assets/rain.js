/* shared v1.16 rain, mode toggle, and hint */
(()=>{
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS='0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz'.split('');
  let seed=7; const rnd=()=> (seed=(seed*16807)%2147483647,(seed-1)/2147483646);
  const glyph=()=>GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const sm=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0));return t*t*(3-2*t)};
  const DPR=Math.min(window.devicePixelRatio||1,2);
  const T=[26,173,179], RAIN_ORANGE=[255,136,56];
  const modeName=()=>document.documentElement.dataset.mode==='fast'?'fast':'normal';
function Rain(cv, o){
  const R = {cv, o, drops:[], rects:[], ptr:{x:-9999,y:-9999}, last:0};
  // v1.14 preview: both palette families ease together, including drops already mid-fall.
  R.tint = o.tint ? {from: o.tint, to: o.tint, t0: 0, dur: 1} : null;
  R.paleTint = o.paleTint ? {from: o.paleTint, to: o.paleTint, t0: 0, dur: 1} : null;
  R.speed = {from: 1, to: 1, t0: 0, dur: 1}; R.fast = modeName()==='fast';
  const easeTint = (q, now) => { const k = Math.min(1, Math.max(0, (now - q.t0)/q.dur)), e = k*k*(3 - 2*k); return q.from.map((c, i) => Math.round(c + (q.to[i] - c)*e)); };
  R.tintAt = now => easeTint(R.tint, now);
  R.paleTintAt = now => easeTint(R.paleTint, now);
  R.speedAt = now => { const q = R.speed, k = Math.min(1, Math.max(0, (now - q.t0)/q.dur)), e = k*k*(3 - 2*k); return q.from + (q.to - q.from)*e; };
  R.setSpeed = (to, dur = 250) => { const now = performance.now(); R.speed = {from: R.speedAt(now), to, t0: now, dur}; R.last = 0; };
  R.setTint = (to, dur = 250) => {
    if (!R.tint || !R.paleTint) return;
    const now = performance.now();
    const fast = modeName()==='fast'; R.fast = fast;
    R.tint = {from: R.tintAt(now), to, t0: now, dur};
    R.paleTint = {from: R.paleTintAt(now), to: fast ? o.paleOrange : o.paleTint, t0: now, dur}; R.last = 0;
  };
  R.build = () => {
    const w = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    R.w = w; R.H = H; cv.style.height = H + 'px';
    cv.width = Math.round(w*DPR); cv.height = Math.round(H*DPR);
    const ctx = cv.getContext('2d'); ctx.setTransform(DPR,0,0,DPR,0,0); R.ctx = ctx;
    const fs = w < 600 ? o.fsMobile : o.fs; R.fs = fs; R.lh = Math.round(fs*1.32); R.cw = Math.round(fs*1.12);
    ctx.font = `500 ${fs}px ${o.mono}`; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    seed = o.seed || 17; R.drops = [];
    for (const band of o.bands(w, H)){
      const rows = Math.ceil((band.y1 - band.y0)/R.lh);
      for (let x = 2; x < w; x += R.cw){
        let n = band.perCol * (band.colDensity ? band.colDensity(x, w) : 1);
        let k = Math.floor(n) + (rnd() < n % 1 ? 1 : 0);
        for (let j=0;j<k;j++){
          const len = band.lenMin + Math.floor(rnd()*(band.lenMax - band.lenMin));
          const pal = o.palette(x, w, rnd()); const hm = o.headMix ?? .62; const head = pal.map((c,i) => Math.round(c + (o.head[i] - c)*hm));
          R.drops.push({x, y0:band.y0, y1:band.y1, rows, row: Math.floor(rnd()*(rows + len)), len, pal, head, a:band.alpha*(.55 + rnd()*.45),
            every: band.stepMin + rnd()*(band.stepMax - band.stepMin), last:0, clock:0, g:Array.from({length:len}, () => GLYPHS[Math.floor(rnd()*GLYPHS.length)])});
        }
      }
    }
    R.measure();
  };
  R.measure = () => { R.rects = o.partSel ? [...document.querySelectorAll(o.partSel)].map(el => { const r = el.getBoundingClientRect(); return {l:r.left, t:r.top + scrollY, r:r.right, b:r.bottom + scrollY}; }) : []; };
  const part = (x, y) => { let f = 1; for (const q of R.rects){ const dx = Math.max(q.l - x, 0, x - q.r), dy = Math.max(q.t - y, 0, y - q.b); const d = Math.hypot(dx, dy); f = Math.min(f, o.partFloor + (1 - o.partFloor)*sm(0, o.partPad, d)); } return f; };
  R.frame = (now) => {
    requestAnimationFrame(R.frame);
    if (now - R.last < 50) return; R.last = now;
    const all = window.__rainAll, vt = all ? 0 : Math.max(0, scrollY - 60), vb = all ? R.H : Math.min(R.H, scrollY + innerHeight + 60), ctx = R.ctx, lh = R.lh;
    ctx.clearRect(0, vt, R.w, vb - vt);
    const speed = R.speedAt(now);
    R.fast = modeName()==="fast";
    const tc = R.tint && R.tintAt(now);
    const pc = R.paleTint && R.paleTintAt(now);
    const th = tc && tc.map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62)));
    const ph = pc && pc.map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62)));   // family-matched tips ease with their bodies
    for (const d of R.drops){
      if (!REDUCED){
        if (!d.last){ d.last = now; d.clock = d.every; }
        else { d.clock += (now - d.last) * speed; d.last = now; }
        while (d.clock >= d.every){ d.clock -= d.every; d.row++; d.g.unshift(glyph()); d.g.pop(); if (d.row - d.len > d.rows) d.row = -Math.floor(Math.random()*12); }
      }
      const headY = d.y0 + d.row*lh; if (headY < vt - 4 || headY - d.len*lh > vb) continue;
      for (let i=0;i<d.len;i++){
        const y = headY - i*lh; if (y < vt || y > vb || y < d.y0 || y > d.y1 - lh) continue;
        if (Math.random() < .004) d.g[i] = glyph();
        let a = d.a * o.alphaAt(d.x, y, R) * part(d.x + R.cw/2, y + lh/2);
        const pd = Math.hypot(d.x - R.ptr.x, y - R.ptr.y); let boost = 0;
        if (pd < 110){ boost = (1 - pd/110); a = Math.min(1, a + boost*.5); }
        if (a < .012) continue;
        let col;
        if (i === 0){ col = R.fast ? (d.pal === o.paleTint ? ph : th) : d.head; a = Math.min(1, a*1.9); }
        else { const t = i / d.len; a *= i < 3 ? 1 : Math.pow(1 - t, 1.5); col = R.fast ? (d.pal === o.paleTint ? pc : tc) : d.pal; }
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
        ctx.fillText(boost > .4 && Math.random() < .3 ? glyph() : d.g[i], d.x, y);
      }
    }
  };
  addEventListener('pointermove', e => { R.ptr.x = e.clientX; R.ptr.y = e.clientY + scrollY; });
  document.addEventListener('pointerleave', () => { R.ptr.x = R.ptr.y = -9999; });
  return R;
}
  const ICON=`<svg viewBox="0 0 256 256" role="img" aria-label="backhand pointing down">
    <defs><linearGradient id="hintSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD766"/><stop offset="1" stop-color="#F5B835"/></linearGradient></defs>
    <!-- redrawn narrower geometry: 78% width, full height, centered; silhouette proportions stay emoji-like -->
    <g transform="translate(28.2 0) scale(.78 1)">
    <!-- traced, simplified 👇 silhouette: palm, three curled fingertips, thumb, and long index -->
    <path d="M44 18c-7 21-10 43-10 70v36c0 18 11 27 27 30 5 1 8 6 9 12 2 8 11 11 17 7 7-4 6-15 6-20 0 11 5 22 14 23 10 1 16-7 16-19 0 9 5 18 14 18 10 0 16-9 17-22l3-3v72c0 17 8 25 20 25 13 0 21-9 21-26v-89c0-7 4-11 11-11s11 5 11 12v3c0 8 9 12 18 11 11-1 19-9 18-19-1-11-13-15-26-17-14-2-27-5-35-18-8-15-17-38-30-56-8-12-18-19-31-20H57c-6 0-10 0-13 1Z" fill="currentColor"/>
    <!-- skin edge shading and highlight copied in the ninja spirit -->
    <path d="M74 38c13-13 29-20 49-20 14 0 26 5 36 15l-6 12c-9-7-20-11-34-11-17 0-31 5-42 14Z" fill="#FFE89A" opacity=".34"/>
    <!-- fingerless glove: palm and upper index only; yellow lower finger, thumb tip, and curled tips remain visible -->
    <path d="M45 19c-7 21-10 43-10 69v35c0 17 11 26 27 29 5 1 8 6 9 11 2 7 9 10 15 7 5-3 7-8 6-15 2 8 7 14 14 14 8 0 13-6 13-15 2 8 7 14 14 14 9 0 14-7 15-17l3-3v20c13 4 27 5 40 0v-57c0-7 4-11 11-11l-1-20c-10-11-17-27-23-41-8-14-18-20-31-20H57c-6 0-9 0-12 1Z" fill="currentColor"/>
    <path d="M157 121h40v51c-12 5-27 5-40 0Z" fill="currentColor"/>
    <!-- rolled cuff across the index opening -->
    <path d="M157 166c12 5 27 5 40 0v12c-12 5-27 5-40 0Z" fill="#000" opacity=".2"/>
    <path d="M158 167c12 5 26 5 38 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/>
    <!-- soft glove shade, highlight, and two restrained crease lines -->
    <path d="M38 113c0 24 10 39 29 45 17 6 39 7 69 4v16c-17 4-42 4-62-1-24-6-36-21-36-45 0-7 0-13 0-19Z" fill="#000" opacity=".15"/>
    <path d="M76 54c12-11 28-17 47-17 15 0 27 5 37 14l-7 10c-9-7-20-10-34-10-16 0-29 4-40 12Z" fill="#fff" opacity=".24"/>
    <path d="M78 111c7 8 17 11 29 10M81 131c8 7 18 9 29 8" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="5" stroke-linecap="round"/>
    <path d="M163 214h17v12c0 7-4 11-9 11s-9-4-9-11v-7c0-2 0-4 1-5Z" fill="#FFE8A0" opacity=".82"/>
    </g>
  </svg>`;
  let rain=null,hint=null,down=null,booted=false,onMode=null;
  const ensure=()=>{
    hint=document.querySelector('.tap-hint');
    if(!hint){ hint=document.createElement('div'); hint.className='tap-hint'; hint.setAttribute('aria-hidden','true'); hint.innerHTML=ICON+'<span>anywhere for <b>2x</b></span>'; (document.querySelector('.scan')||document.body).after(hint); }
    hint.classList.add('ready'); requestAnimationFrame(()=>hint.classList.add('ready')); place();
  };
  const place=()=>{if(!hint)return;const copy=document.querySelector('.copy');if(!copy)return;const r=copy.getBoundingClientRect();const mobile=innerWidth<760;const lh=parseFloat(getComputedStyle(copy.querySelector('.hello')||copy).lineHeight)||30;hint.style.top=mobile?`calc(env(safe-area-inset-top,0px) + 11px)`:`${Math.max(11,r.top-2*lh)}px`;if(mobile){hint.style.right=`calc(env(safe-area-inset-right,0px) + 14px)`;return;}let right=0;for(const el of copy.querySelectorAll('.hello,.para,.sig,.prompt')){const range=document.createRange();range.selectNodeContents(el);for(const q of range.getClientRects())right=Math.max(right,q.right);}if(!right)right=r.right;hint.style.right=Math.max(14,innerWidth-right-16)+'px';};
  const mode=fast=>{const next=fast?'fast':'normal';document.documentElement.dataset.mode=next;document.documentElement.classList.toggle('fast',fast);if(hint){hint.querySelector('b').textContent=fast?'1x':'2x';hint.classList.toggle('settled',fast||hint.classList.contains('settled'));}if(rain){rain.fast=fast;rain.setSpeed(fast?2:1,250);rain.setTint(fast?RAIN_ORANGE:T,250);}if(onMode)onMode(fast);};
  const boot=()=>{if(booted)return;booted=true;ensure();document.addEventListener('pointerdown',e=>{down=e.isPrimary&&e.button===0&&!e.target.closest('a,button,input,label')?{x:e.clientX,y:e.clientY}:null});document.addEventListener('pointercancel',()=>down=null);document.addEventListener('pointerup',e=>{if(!down||!e.isPrimary||Math.hypot(e.clientX-down.x,e.clientY-down.y)>10||String(getSelection()))return;down=null;mode(!document.documentElement.classList.contains('fast'));});addEventListener('resize',place);if(window.ResizeObserver){const c=document.querySelector('.copy');c&&new ResizeObserver(place).observe(c)}};
  const register=(r,cb)=>{rain=r;onMode=cb||null;boot()};
  document.documentElement.dataset.mode=document.documentElement.dataset.mode==='fast'?'fast':'normal';
  window.JayRain={Rain,register,mode,smooth:sm};
  if(document.readyState!=='loading')boot();else addEventListener('DOMContentLoaded',boot,{once:true});
})();
