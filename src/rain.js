import { RAIN_GLYPHS, randomGlyph } from "./glyphs.js";

// Glyph rain, ported from the approved homepage mock.
// Columns are seeded so the field is stable. Glyphs drift on their own.

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export function createRain(cv, o) {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647), (seed - 1) / 2147483646);

  const R = {
    cv,
    o,
    drops: [],
    rects: [],
    ptr: { x: -9999, y: -9999 },
    last: 0,
  };

  R.build = () => {
    const w = document.documentElement.clientWidth;
    const H = document.documentElement.scrollHeight;
    R.w = w;
    R.H = H;
    cv.style.height = H + "px";
    cv.width = Math.round(w * DPR);
    cv.height = Math.round(H * DPR);
    const ctx = cv.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R.ctx = ctx;
    const fs = w < 600 ? o.fsMobile : o.fs;
    R.fs = fs;
    R.lh = Math.round(fs * 1.32);
    R.cw = Math.round(fs * 1.12);
    ctx.font = `500 ${fs}px ${o.mono}`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    seed = o.seed || 17;
    R.drops = [];
    for (const band of o.bands(w, H)) {
      const rows = Math.ceil((band.y1 - band.y0) / R.lh);
      for (let x = 2; x < w; x += R.cw) {
        const n = band.perCol * (band.colDensity ? band.colDensity(x, w) : 1);
        const k = Math.floor(n) + (rnd() < n % 1 ? 1 : 0);
        for (let j = 0; j < k; j++) {
          const len = band.lenMin + Math.floor(rnd() * (band.lenMax - band.lenMin));
          const pal = o.palette(x, w, rnd());
          const hm = o.headMix ?? 0.62;
          const head = pal.map((c, i) => Math.round(c + (o.head[i] - c) * hm));
          R.drops.push({
            x,
            y0: band.y0,
            y1: band.y1,
            rows,
            row: Math.floor(rnd() * (rows + len)),
            len,
            pal,
            head,
            a: band.alpha * (0.55 + rnd() * 0.45),
            every: band.stepMin + rnd() * (band.stepMax - band.stepMin),
            last: 0,
            g: Array.from({ length: len }, () => RAIN_GLYPHS[Math.floor(rnd() * RAIN_GLYPHS.length)]),
          });
        }
      }
    }
    R.measure();
  };

  R.measure = () => {
    R.rects = o.partSel
      ? [...document.querySelectorAll(o.partSel)].map((el) => {
          const r = el.getBoundingClientRect();
          return { l: r.left, t: r.top + window.scrollY, r: r.right, b: r.bottom + window.scrollY };
        })
      : [];
  };

  const part = (x, y) => {
    let f = 1;
    for (const q of R.rects) {
      const dx = Math.max(q.l - x, 0, x - q.r);
      const dy = Math.max(q.t - y, 0, y - q.b);
      const d = Math.hypot(dx, dy);
      f = Math.min(f, o.partFloor + (1 - o.partFloor) * smooth(0, o.partPad, d));
    }
    return f;
  };

  let hidden = false;
  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
  });

  R.frame = (now) => {
    window.requestAnimationFrame(R.frame);
    if (hidden || now - R.last < 50) return;
    R.last = now;
    const all = window.__rainAll;
    const vt = all ? 0 : Math.max(0, window.scrollY - 60);
    const vb = all ? R.H : Math.min(R.H, window.scrollY + window.innerHeight + 60);
    const ctx = R.ctx;
    const lh = R.lh;
    ctx.clearRect(0, vt, R.w, vb - vt);
    for (const d of R.drops) {
      if (now - d.last > d.every) {
        d.last = now;
        d.row++;
        d.g.unshift(randomGlyph());
        d.g.pop();
        if (d.row - d.len > d.rows) d.row = -Math.floor(Math.random() * 12);
      }
      const headY = d.y0 + d.row * lh;
      if (headY < vt - 4 || headY - d.len * lh > vb) continue;
      for (let i = 0; i < d.len; i++) {
        const y = headY - i * lh;
        if (y < vt || y > vb || y < d.y0 || y > d.y1 - lh) continue;
        if (Math.random() < 0.004) d.g[i] = randomGlyph();
        let a = d.a * o.alphaAt(d.x, y, R) * part(d.x + R.cw / 2, y + lh / 2);
        const pd = Math.hypot(d.x - R.ptr.x, y - R.ptr.y);
        let boost = 0;
        if (pd < 110) {
          boost = 1 - pd / 110;
          a = Math.min(1, a + boost * 0.5);
        }
        if (a < 0.012) continue;
        let col;
        if (i === 0) {
          col = d.head;
          a = Math.min(1, a * 1.9);
        } else {
          const t = i / d.len;
          a *= i < 3 ? 1 : Math.pow(1 - t, 1.5);
          col = d.pal;
        }
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
        ctx.fillText(boost > 0.4 && Math.random() < 0.3 ? randomGlyph() : d.g[i], d.x, y);
      }
    }
  };

  window.addEventListener("pointermove", (e) => {
    R.ptr.x = e.clientX;
    R.ptr.y = e.clientY + window.scrollY;
  });
  document.addEventListener("pointerleave", () => {
    R.ptr.x = R.ptr.y = -9999;
  });

  return R;
}
