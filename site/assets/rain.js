/* shared v1.16 rain, mode toggle, and hint. jay 2026.09.30 v1.25: + the homepage's intro-only "finish the dump" hint state, a page tap hook, and the back-navigation note */
(()=>{
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS='0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz'.split('');
  let seed=7; const rnd=()=> (seed=(seed*16807)%2147483647,(seed-1)/2147483646);
  const glyph=()=>GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const sm=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0));return t*t*(3-2*t)};
  const DPR=Math.min(window.devicePixelRatio||1,2);
  const T=[26,173,179], RAIN_ORANGE=[255,77,26];
  const modeName=()=>document.documentElement.dataset.mode==='fast'?'fast':'normal';
function Rain(cv, o){
  const R = {cv, o, drops:[], rects:[], ptr:{x:-9999,y:-9999}, last:0};
  // v1.14 preview: both palette families ease together, including drops already mid-fall.
  R.tint = o.tint ? {from: o.tint, to: o.tint, t0: 0, dur: 1} : null;
  R.paleTint = o.paleTint ? {from: o.paleTint, to: o.paleTint, t0: 0, dur: 1} : null;
  R.speed = {from: 1, to: 1, t0: 0, dur: 1}; R.fast = modeName()==='fast';
  R.au = null; R.gh = [255,215,0].map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62))); R.gph = [255,236,150].map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62)));   // v1.52: gold heads
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
    const sp = R.speedAt(now);   // jay 2026.09.30 v1.33: 20fps up to 2x as before; faster rain (the homepage's skip-to-end, up to 6x) draws up to 60fps so drops glide instead of skipping rows
    if (now - R.last < (sp > 2 ? Math.max(16, 100/sp) : 50)) return; R.last = now;
    const all = window.__rainAll, vt = all ? 0 : Math.max(0, scrollY - 60), vb = all ? R.H : Math.min(R.H, scrollY + innerHeight + 60), ctx = R.ctx, lh = R.lh;
    ctx.clearRect(0, vt, R.w, vb - vt);
    const speed = R.speedAt(now);
    R.fast = modeName()==="fast";
    const tc = R.tint && R.tintAt(now);
    const pc = R.paleTint && R.paleTintAt(now);
    const th = tc && tc.map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62)));
    const ph = pc && pc.map((c, i) => Math.round(c + (o.head[i] - c)*(o.headMix ?? .62)));   // family-matched tips ease with their bodies
    const A = R.au, gk = !A ? null : A.out ? (k => () => k)(1 - clamp((now - A.out.t0)/A.out.ms)) : y => clamp((now - A.t0 - Math.min(1, Math.abs(y - A.y)/A.maxD)*A.ms)/A.fade);   // v1.52: the gold pulse (per glyph, by distance from its line) / the fade back
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
        if (gk){ const k = gk(y); if (k > 0){ const g = d.pal === o.paleTint ? (i === 0 ? R.gph : GOLD_PALE) : (i === 0 ? R.gh : GOLD); col = col.map((c, j) => Math.round(c + (g[j] - c)*k)); } }
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
  const arrows=n=>`<svg class="speed-arrows" data-count="${n}" viewBox="0 0 20 24" preserveAspectRatio="xMinYMid meet" aria-label="${n===1?'one':'two'} speed arrow${n===1?'':'s'}"><path d="${n===1?'M1.5 8.5L10 15.5 18.5 8.5':'M1.5 4.5L10 11.5 18.5 4.5M1.5 12.5L10 19.5 18.5 12.5'}"/></svg>`;
  // jay 2026.09.30 v1.32: the chevrons point DOWN, with the rain (were ›› / ›). the old ones rotated 90deg about the box centre; same box, stroke and colour, so nothing moves
  // jay 2026.09.30 v1.25: "finish the dump" glyph ››| (fast-forward to the end). same 20x24 box, stroke, and caps as the chevrons, so the hint never changes width; orange (see rain.css)
  const DUMP_GLYPH=`<svg class="speed-arrows dump" data-count="end" viewBox="0 0 20 24" preserveAspectRatio="xMinYMid meet" aria-label="skip to the end"><path d="M1.5 3.6L10 10.1 18.5 3.6M1.5 10.6L10 17.1 18.5 10.6M1.5 20.4H18.5"/></svg>`;   // v1.32: two down chevrons over a bar (was ››|)
  let rain=null,hint=null,down=null,booted=false,onMode=null,onTap=null,dumpHint=false;
  // jay 2026.09.30 v1.25: while a page has the dump state on (only the homepage intro turns it on, at 2x), the hint shows ››| instead of the 1x/2x chevrons
  const setHintMode=fast=>{if(!hint)return;const speed=hint.querySelector('.speed-label')||hint.querySelector('.speed');if(speed){speed.className='speed-label';speed.innerHTML=`anywhere for${dumpHint?DUMP_GLYPH:arrows(fast?1:2)}`;}};
  // v1.20: each teal background glow gets an orange twin that fades in at >> speed (both pages via this shared file)
  const glowTwins=()=>document.querySelectorAll('.glow:not(.glow-fast):not([data-twin])').forEach(g=>{g.dataset.twin='1';const t=g.cloneNode(false);t.classList.add('glow-fast');t.setAttribute('style',(g.getAttribute('style')||'').replace(/rgba\(26,\s*173,\s*179,/g,'rgba(255,77,26,'));g.after(t);const u=g.cloneNode(false);u.classList.add('glow-au');u.setAttribute('style',(g.getAttribute('style')||'').replace(/rgba\(26,\s*173,\s*179,/g,'rgba(255,215,0,'));t.after(u);});   // v1.52: + a gold twin (shown while .gld)
  const ensure=()=>{
    glowTwins();
    hint=document.querySelector('.tap-hint');
    if(hint){const legacy=hint.querySelector('.speed-label')||hint.querySelector('.speed')||hint.querySelector(':scope > span');if(legacy)legacy.className='speed-label';}
    if(!hint){ hint=document.createElement('div'); hint.className='tap-hint'; hint.setAttribute('aria-hidden','true'); hint.innerHTML=ICON+'<span class="speed-label"></span>'; (document.querySelector('.scan')||document.body).after(hint); }
    setHintMode(modeName()==='fast'); hint.classList.add('ready'); requestAnimationFrame(()=>hint.classList.add('ready')); place();
  };
  const place=()=>{if(!hint)return;const copy=document.querySelector('.copy');if(!copy)return;const r=copy.getBoundingClientRect();const mobile=innerWidth<760;const lh=parseFloat(getComputedStyle(copy.querySelector('.hello')||copy).lineHeight)||30;hint.style.top=mobile?`calc(env(safe-area-inset-top,0px) + 11px)`:`${Math.max(11,r.top-2*lh)}px`;if(mobile){hint.style.right=`calc(env(safe-area-inset-right,0px) + 14px)`;return;}let right=0;for(const el of copy.querySelectorAll('.hello,.para,.sig,.prompt')){const range=document.createRange();range.selectNodeContents(el);for(const q of range.getClientRects())right=Math.max(right,q.right);}if(!right)right=r.right;hint.style.right=Math.max(14,innerWidth-right-16)+'px';};
  const mode=fast=>{const next=fast?'fast':'normal';document.documentElement.dataset.mode=next;document.documentElement.classList.toggle('fast',fast);if(hint){setHintMode(fast);hint.classList.toggle('settled',fast||hint.classList.contains('settled'));}if(rain){rain.fast=fast;rain.setSpeed(fast?2:1,250);rain.setTint(fast?RAIN_ORANGE:T,250);}if(onMode)onMode(fast);};
  const boot=()=>{if(booted)return;booted=true;ensure();document.addEventListener('pointerdown',e=>{down=e.isPrimary&&e.button===0&&!e.target.closest('a,button,input,label')?{x:e.clientX,y:e.clientY}:null});document.addEventListener('pointercancel',()=>down=null);document.addEventListener('pointerup',e=>{if(!down||!e.isPrimary||Math.hypot(e.clientX-down.x,e.clientY-down.y)>10||String(getSelection()))return;down=null;if(onTap&&onTap())return;mode(!document.documentElement.classList.contains('fast'));});addEventListener('resize',place);if(window.ResizeObserver){const c=document.querySelector('.copy');c&&new ResizeObserver(place).observe(c)}};
  // jay 2026.09.30 v1.25: optional tap hook. if it returns true the page used the tap (the homepage's terminal dump) and the 1x/2x toggle is skipped
  const register=(r,cb,tap)=>{rain=r;onMode=cb||null;onTap=tap||null;boot()};
  const dump=on=>{dumpHint=!!on;setHintMode(modeName()==='fast')};
  // jay 2026.09.30 v1.25: back-navigation note. off the homepage (/song-of-the-day/, /quote-of-the-day/), a plain same-tab click on a link home ("← jaytha.ninja") leaves a one-shot sessionStorage note; the homepage reads + clears it and opens fully loaded
  const HOME=/^\/(index\.html)?$/;
  if(!HOME.test(location.pathname))document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(a.target&&a.target!=='_self'))return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&HOME.test(u.pathname)){try{sessionStorage.setItem('jtn.back','1')}catch(_){}}},true);
  // jay 2026.10.01 v1.41: the homepage's terminal state for the other typed pages (/song-of-the-day/, /quote-of-the-day/). the homepage keeps its own copy and never calls these.
  // returning(ver): true when this tab has already shown this page's current content (ver = the entry's date) AND this load is a back/forward navigation or a same-tab click on an
  // in-site link to it (a one-shot "jtn.via" note, like the homepage's "jtn.back"). the page then opens fully loaded. a new tab, a new visit, a reload or a new day's entry still types.
  // seen(ver) is set when the page finishes and whenever it is left (pagehide), as on the homepage.
  // burst(tape, done): the homepage's terminal dump: every remaining typing step plays in one ~1.2s burst (14ms a step at most) while the rain runs at 6x, then the rain eases back to the mode's speed
  const PATH=p=>p.replace(/index\.html$/,'').replace(/([^/])$/,'$1/'), HERE=PATH(location.pathname);
  const ss=(()=>{try{return window.sessionStorage}catch(_){return null}})(), ssGet=k=>{try{return ss&&ss.getItem(k)}catch(_){return null}}, ssSet=(k,v)=>{try{ss&&ss.setItem(k,v)}catch(_){}};
  const via=ssGet('jtn.via')===HERE; try{ss&&ss.removeItem('jtn.via')}catch(_){}
  const navType=((performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{}).type||'';
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(a.target&&a.target!=='_self'))return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&!HOME.test(u.pathname))ssSet('jtn.via',PATH(u.pathname))},true);
  let seenVer=null; const seen=ver=>{if(ver!=null)seenVer=String(ver);if(seenVer!=null)ssSet('jtn.seen:'+HERE,seenVer)};
  const returning=ver=>{const back=ssGet('jtn.seen:'+HERE)===String(ver)&&(navType==='back_forward'||via);seenVer=String(ver);return back};
  addEventListener('pagehide',()=>seen());
  const burst=(tape,done,o={})=>{const total=tape.length,D=Math.max(1,Math.min(o.ms||1200,total*(o.perStep||14))),t0=performance.now();let at=0,raf=0,live=true;
    const back=ms=>{if(rain)rain.setSpeed(modeName()==='fast'?2:1,ms)};
    if(rain)rain.setSpeed(o.rain||6,o.rainUp||220);
    if(o.gold!==false)gold({ms:o.goldMs||260,y:o.goldY});   // v1.52: the skip-to-end gold flash
    const frame=now=>{const k=Math.min(total,Math.ceil((now-t0)/D*total));while(at<k)tape[at++]();if(at<total){raf=requestAnimationFrame(frame);return}raf=0;live=false;back(o.rainDown||1100);if(o.gold!==false)goldOff({hold:1000,ms:700,first:true});if(done)done()};
    raf=requestAnimationFrame(frame);
    return {stop(){if(!live)return;live=false;cancelAnimationFrame(raf);back(250);if(o.gold!==false)goldOff({hold:1000,ms:700,first:true})}};};
  document.documentElement.dataset.mode=document.documentElement.dataset.mode==='fast'?'fast':'normal';

  /* v1.52 (jay 2026.10.02): gold. gold(o) turns everything coloured gold in a pulse that spreads out from a line (o.y, viewport px; default the middle of the screen) up to
     the top and down to the bottom at the same time: each element (and each rain glyph) turns gold as the pulse reaches it, over o.ms (signup: ~1.7s; the skip-to-end
     flash: ~260ms). it works by putting .gld on each element (the gold values of --c / --f, see rain.css) in distance order, then .gld on <html> when the pulse is done.
     white stays white (only the colour variables change), nothing moves. o.lock (the signup) keeps it gold for the rest of the visit, speed taps included.
     goldOff(o): unless locked, hold o.hold ms (1000), then fade everything back over o.ms (700); o.first also returns to the first state (1x, teal).
     the skip-to-end on every page (burst() here, the homepage's own dump()) flashes gold while it fast-forwards, then holds 1s and fades back to teal 1x */
  const GOLD=[255,215,0], GOLD_PALE=[255,236,150];
  let auLock=false, auTimers=[], auRaf=0;
  const auClear=()=>{auTimers.forEach(clearTimeout);auTimers=[];if(auRaf)cancelAnimationFrame(auRaf);auRaf=0;};
  const auWave=t=>{const h=document.documentElement;h.style.setProperty('--au-t',t+'ms');h.classList.add('au-wave');};
  const gold=(o={})=>{
    if(auLock)return Promise.resolve();
    auClear();const h=document.documentElement;h.classList.remove('gld-out');
    const ms=REDUCED?0:(o.ms??1700); if(o.lock)auLock=true;
    const vh=innerHeight, y0=o.y??vh/2, maxD=Math.max(y0,vh-y0,1), fade=Math.max(120,Math.min(450,ms*.25));
    if(rain)rain.au={y:y0+scrollY,t0:performance.now(),ms,maxD,fade:ms?fade:1,out:null};
    if(!ms){h.classList.add('gld');return Promise.resolve();}
    auWave(fade);
    const els=[...document.body.querySelectorAll('*')].filter(e=>{const tg=e.tagName.toLowerCase();if(tg!=='svg'&&e.closest('svg'))return false;if(/^(script|style|canvas|br|noscript)$/.test(tg))return false;if(e.classList.contains('glow'))return true;const r=e.getBoundingClientRect();return r.height<=160&&(r.width>0||r.height>0);})
      .map(e=>{const r=e.getBoundingClientRect(),d=r.top>y0?r.top-y0:r.bottom<y0?y0-r.bottom:0;return{e,t:Math.min(1,d/maxD)*ms};}).sort((a,b)=>a.t-b.t);
    return new Promise(res=>{const t0=performance.now();let i=0;const step=now=>{const el=now-t0;while(i<els.length&&els[i].t<=el)els[i++].e.classList.add('gld');
      if(i<els.length){auRaf=requestAnimationFrame(step);return;}auRaf=0;h.classList.add('gld');auTimers.push(setTimeout(()=>h.classList.remove('au-wave'),fade+60));res();};auRaf=requestAnimationFrame(step);});
  };
  const goldOff=(o={})=>{
    if(auLock)return;auClear();const h=document.documentElement,hold=o.hold??1000,ms=REDUCED?0:(o.ms??700);
    auTimers.push(setTimeout(()=>{if(auLock)return;if(ms){auWave(ms);h.classList.add('gld-out');}
      if(o.first&&modeName()==='fast')mode(false);
      h.classList.remove('gld');document.querySelectorAll('.gld').forEach(e=>e.classList.remove('gld'));
      if(rain&&rain.au)rain.au.out={t0:performance.now(),ms:Math.max(1,ms)};
      auTimers.push(setTimeout(()=>{h.classList.remove('au-wave','gld-out');if(rain)rain.au=null;},ms+60));},hold));
  };
  window.JayRain={Rain,register,mode,dump,smooth:sm,returning,seen,burst,gold,goldOff,golden:()=>auLock};
  if(document.readyState!=='loading')boot();else addEventListener('DOMContentLoaded',boot,{once:true});
})();
