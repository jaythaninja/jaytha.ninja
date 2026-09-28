import { copy, typing } from "./copy.js";
import { createRain } from "./rain.js";
import { decodeType, wait } from "./type.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.getElementById("hero");
const b1 = document.querySelector(".b1");
const b2 = document.querySelector(".b2");
const b3 = document.querySelector(".b3");
const skip = document.querySelector(".skip");

const LINES = [
  [b1, copy.hello],
  [b2, copy.headline],
  [b3, copy.subline],
];

const cursor = document.createElement("span");
cursor.className = "cursor";
cursor.setAttribute("aria-hidden", "true");

let rain = null;

function finish() {
  if (hero.classList.contains("done")) return;
  for (const [el, text] of LINES) {
    if (el.firstChild && el.firstChild.className === "res") {
      el.firstChild.textContent = text;
      const scr = el.querySelector(".scr");
      if (scr) scr.textContent = "";
    } else {
      el.textContent = text;
    }
  }
  b3.appendChild(cursor);
  hero.classList.add("done");
  hero.dataset.intro = "done";
  if (skip) {
    skip.tabIndex = -1;
    skip.setAttribute("aria-hidden", "true");
  }
  if (rain) window.setTimeout(() => rain.measure(), 60);
}

if (reduced) {
  for (const [el, text] of LINES) el.textContent = text;
  b3.appendChild(cursor);
  hero.classList.add("done");
  hero.dataset.intro = "done";
  if (skip) skip.remove();
} else {
  const T = [26, 173, 179];
  const TL = [110, 214, 218];
  const O = [255, 77, 26];
  const OL = [255, 140, 100];
  const HEAD = [255, 248, 240];
  const mob = () => document.documentElement.clientWidth < 760;

  rain = createRain(document.getElementById("rain"), {
    fs: 16,
    fsMobile: 13,
    mono: '"JetBrains Mono", monospace',
    seed: 5,
    head: HEAD,
    headMix: 0.6,
    palette: (x, w, r) => (r < 0.3 ? O : r < 0.4 ? OL : r < 0.82 ? T : TL),
    bands: (w, H) => {
      const hh = hero.offsetHeight;
      return [
        {
          y0: 0,
          y1: hh + 160,
          perCol: mob() ? 1.5 : 1.9,
          lenMin: 8,
          lenMax: 30,
          alpha: 0.62,
          stepMin: 60,
          stepMax: 170,
          colDensity: (x, width) => (mob() ? 1 : 0.12 + 0.88 * smoothstep(width * 0.34, width * 0.66, x)),
        },
        {
          y0: hh - 160,
          y1: H,
          perCol: 0.3,
          lenMin: 5,
          lenMax: 18,
          alpha: 0.3,
          stepMin: 120,
          stepMax: 300,
          colDensity: (x, width) => 0.35 + 0.65 * smoothstep(width * 0.2, width * 0.9, x),
        },
      ];
    },
    alphaAt: (x, y, R) => {
      const hh = hero.offsetHeight;
      return y < hh ? 1 - 0.5 * smoothstep(hh * 0.6, hh + 80, y) : 0.5 * (1 - 0.6 * smoothstep(hh, R.H, y));
    },
    partSel: "[data-part]",
    partPad: 56,
    partFloor: 0,
  });

  let current = null;
  let skipped = false;

  skip.addEventListener("click", () => {
    skipped = true;
    if (current) current.finish();
    finish();
  });

  async function intro() {
    hero.dataset.intro = "playing";
    await wait(450);
    for (let i = 0; i < LINES.length; i++) {
      if (skipped) return;
      const [el, text] = LINES[i];
      // Every line, including hello, uses the locked settings.
      current = decodeType(el, text, typing);
      el.appendChild(cursor);
      await current;
      if (skipped) return;
      el.appendChild(cursor);
      await wait(i === 0 ? 550 : 300);
    }
    if (skipped) return;
    await wait(150);
    finish();
  }

  document.fonts.ready.then(async () => {
    await document.fonts.load('500 16px "JetBrains Mono"');
    await document.fonts.load('500 21px "JetBrains Mono"');
    rain.build();
    window.requestAnimationFrame(rain.frame);
    intro();
  });

  let lastW = window.innerWidth;
  let rt;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    window.clearTimeout(rt);
    rt = window.setTimeout(() => rain.build(), 150);
  });
}

function smoothstep(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
