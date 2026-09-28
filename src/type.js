import { randomGlyph } from "./glyphs.js";

// Decode-type, ported from the approved mock.
// Each character scrambles for `window` ticks, then resolves.
// Callers pass the locked hello settings: { speed: 55, window: 4 }.

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function decodeType(el, text, opt = {}) {
  if (reducedMotion()) {
    el.textContent = text;
    const done = Promise.resolve();
    done.finish = () => {};
    return done;
  }

  const chars = Array.from(text);
  const win = opt.window ?? 4;
  const base = opt.speed ?? 45;
  el.innerHTML = '<span class="res"></span><span class="scr" aria-hidden="true"></span>';
  const res = el.firstChild;
  const scr = el.lastChild;
  let head = 0;
  let cancelled = false;
  const p = new Promise((resolve) => {
    const tick = () => {
      if (cancelled) return resolve();
      head++;
      const resolved = Math.max(0, head - win);
      res.textContent = chars.slice(0, resolved).join("");
      scr.textContent = chars
        .slice(resolved, Math.min(head, chars.length))
        .map((c) => (c === " " || c === "\n" ? c : randomGlyph()))
        .join("");
      if (resolved >= chars.length) {
        scr.textContent = "";
        return resolve();
      }
      const c = chars[Math.min(head, chars.length) - 1];
      const delay =
        head > chars.length
          ? base * 0.7
          : c === "."
            ? base * 3.2
            : c === ","
              ? base * 3
              : base * (0.75 + Math.random() * 0.6);
      window.setTimeout(tick, delay);
    };
    tick();
  });
  p.finish = () => {
    cancelled = true;
    res.textContent = text;
    scr.textContent = "";
  };
  return p;
}

export const wait = (ms) => new Promise((r) => window.setTimeout(r, reducedMotion() ? 0 : ms));
