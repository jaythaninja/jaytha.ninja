/* jaytha.ninja/habits/YYYY-MM-DD/ (v1.84): one day, every tracker, from the same json the year graph uses. journal is a count. caffeine is yes or no, and only from its start date. */
(() => {
const VER = 'habits-day-1.84';
const TIMING = {kickerSpeed: 55, window: 4};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RAIN_GLYPHS = '0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz'.split('');
const rg = () => RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', {granularity: 'grapheme'}) : null;
const graphemes = t => seg ? Array.from(seg.segment(t), x => x.segment) : Array.from(t);
const cursor = document.createElement('span'); cursor.className = 'cursor';
const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const $ = s => document.querySelector(s);
let pace = 2, skipped = false, ready = false, current = null;
const state = window.__intro = {head: 0, done: false, pace};
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function unitWord(n, unit){
  if (n === 1) return unit;
  return unit.endsWith('s') ? unit : unit + 's';
}
function metaLine(item){
  const repo = ((item.repo || '').split('/')[1]) || item.repo || '';
  if (item.kind === 'commit') return ['commit', repo, (item.sha || '').slice(0, 7)].filter(Boolean).join(' · ');
  if (item.kind === 'pr'){
    const role = item.role === 'merged' ? 'merged' : 'opened';
    return ['pull request #' + item.number, role, repo].filter(Boolean).join(' · ');
  }
  return item.kind || '';
}
function trimNum(n){
  const v = Math.round(Number(n) * 10) / 10;
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}
function clock(hhmm){
  return (hhmm || '').slice(0, 5);
}
function workoutCard(item){
  const card = mk('article', 'wo');
  const type = mk('h3', 'wo-type');
  type.textContent = (item.type || 'workout').replace(/_/g, ' ');
  card.appendChild(type);
  const when = mk('p', 'wo-when');
  const span = [clock(item.start), clock(item.end)].filter(Boolean).join('–');
  when.textContent = span;
  if (span) card.appendChild(when);
  const facts = mk('ul', 'wo-facts');
  const bits = [trimNum(item.duration_min) + ' min active'];
  if (item.distance_mi) bits.push(trimNum(item.distance_mi) + ' mi');
  if (item.kcal) bits.push(commas(item.kcal) + ' kcal');
  if (item.elevation_ft) bits.push(commas(item.elevation_ft) + ' ft');
  bits.forEach(text => { const li = mk('li'); li.textContent = text; facts.appendChild(li); });
  card.appendChild(facts);
  if (item.avg_hr || item.max_hr){
    const hr = mk('p', 'wo-hr');
    const parts = [];
    if (item.avg_hr) parts.push('avg ' + item.avg_hr);
    if (item.max_hr) parts.push('max ' + item.max_hr);
    hr.textContent = parts.join(' · ');
    card.appendChild(hr);
  }
  if (item.zones && item.zones.some(z => z > 0)){
    const wrap = mk('div', 'zonewrap');
    const bar = mk('div', 'zones');
    const sum = item.zones.reduce((a, b) => a + Number(b), 0) || 1;
    item.zones.forEach(z => {
      const seg = mk('i');
      seg.style.width = (100 * Number(z) / sum) + '%';
      bar.appendChild(seg);
    });
    const cap = mk('p', 'zonecap');
    cap.textContent = item.zones.map((z, i) => 'z' + (i + 1) + ' ' + trimNum(z)).join(' · ');
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', 'heart rate zones, ' + cap.textContent);
    wrap.append(bar, cap);
    card.appendChild(wrap);
  }
  if (item.strava){
    const p = mk('p', 'wo-link');
    const a = mk('a');
    a.href = item.strava;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = (item.name || 'strava').toLowerCase();
    p.appendChild(a);
    card.appendChild(p);
  }
  return card;
}
function sectionFor(tracker, file, iso){
  const sec = mk('section', 'daysec');
  const h = mk('h2', 'kicker');
  if (tracker.kind === 'caffeine' || tracker.id === 'caffeine'){
    const sr = mk('span', 'sr');
    sr.textContent = 'zero caffeine';
    const vis = mk('span', 'strike');
    vis.textContent = 'caffeine';
    vis.setAttribute('aria-hidden', 'true');
    h.append(sr, vis);
  } else {
    h.textContent = tracker.label || tracker.id;
  }
  sec.appendChild(h);
  if (!file || file.error){
    const p = mk('p', 'quiet');
    p.textContent = 'could not load this tracker';
    sec.appendChild(p);
    return sec;
  }
  if (tracker.kind === 'journal' || tracker.id === 'journal'){
    const raw = file[iso];
    const fromDays = file.days && file.days[iso];
    const n = typeof raw === 'number' ? raw : (typeof fromDays === 'number' ? fromDays : ((fromDays && fromDays.total) || 0));
    const total = mk('p', 'total');
    total.textContent = commas(n) + ' ' + unitWord(n, 'note');
    sec.appendChild(total);
    return sec;
  }
  if (tracker.kind === 'caffeine' || tracker.id === 'caffeine'){
    const start = file.start || '';
    if (!start || iso < start) return null;
    const raw = (file.days || {})[iso];
    const total = mk('p', 'total');
    total.textContent = raw === true ? 'zero caffeine' : 'caffeine';
    sec.appendChild(total);
    return sec;
  }
  const day = (file.days || {})[iso] || {};
  const n = day.total || 0;
  const workout = tracker.unit === 'workout' || tracker.id === 'workouts';
  const total = mk('p', 'total');
  if (workout){
    total.textContent = n
      ? commas(n) + ' ' + unitWord(n, 'workout') + ' · ' + commas(Math.round(day.minutes || 0)) + ' min'
      : '0 workouts';
  } else {
    total.textContent = commas(n) + ' ' + unitWord(n, tracker.unit || 'item');
  }
  sec.appendChild(total);
  if (workout){
    const items = day.items || [];
    if (!items.length){
      const p = mk('p', 'quiet');
      p.textContent = 'nothing recorded yet';
      sec.appendChild(p);
    } else items.forEach(item => sec.appendChild(workoutCard(item)));
    return sec;
  }
  const list = mk('ul', 'break');
  (tracker.sources || []).forEach(src => {
    const present = Object.prototype.hasOwnProperty.call(day, src.key);
    if (src.when === 'present' && !present) return;
    const li = mk('li');
    const name = mk('span');
    name.textContent = src.label;
    const b = mk('b');
    b.textContent = String(day[src.key] || 0);
    li.append(name, b);
    list.appendChild(li);
  });
  if (list.childNodes.length) sec.appendChild(list);
  const items = day.items || [];
  if (!n && !items.length){
    const p = mk('p', 'quiet');
    p.textContent = 'nothing recorded yet';
    sec.appendChild(p);
  } else if (items.length){
    const ul = mk('ul', 'items');
    items.forEach(item => {
      const li = mk('li');
      if (item.url){
        const a = mk('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = item.title || item.url;
        li.appendChild(a);
      } else {
        li.appendChild(document.createTextNode(item.title || 'item'));
      }
      const meta = mk('span', 'meta');
      meta.textContent = metaLine(item);
      li.appendChild(meta);
      ul.appendChild(li);
    });
    sec.appendChild(ul);
  }
  return sec;
}

function prepare(el, text){
  el.textContent = '';
  const node = mk('span'), res = mk('span', 'res'), scr = mk('span', 'scr'), ghost = mk('span', 'ghost');
  ghost.textContent = text; node.append(res, scr, ghost); el.appendChild(node);
  const g = graphemes(text);
  return {el, runs: [{node, res, scr, ghost, g, start: 0}], n: g.length};
}
function render(t, head, win){
  const resolved = Math.max(0, head - win), top = Math.min(head, t.n), r = t.runs[0], L = r.g.length;
  const a = Math.min(L, Math.max(0, resolved)), b = Math.min(L, Math.max(0, top));
  r.res.textContent = r.g.slice(0, a).join('');
  r.scr.textContent = r.g.slice(a, b).map(c => /\s/.test(c) ? c : rg()).join('');
  r.ghost.textContent = r.g.slice(b).join('');
  r.node.insertBefore(cursor, r.ghost);
}
function type(t, opt){
  const win = opt.window, base = opt.speed, all = t.runs[0].g;
  let head = 0, cancelled = false;
  const p = new Promise(resolve => {
    const tick = () => {
      if (cancelled) return resolve();
      head++; render(t, head, win); state.head = head;
      if (head - win >= t.n) return resolve();
      const delay = head > t.n ? base * .7 : base * (.75 + Math.random() * .6);
      setTimeout(tick, reduced ? 0 : delay / pace);
    };
    tick();
  });
  p.stop = () => { cancelled = true; };
  return p;
}
const wait = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms / pace));
const T = [26, 173, 179], PALE_TEAL = [121, 205, 207], HEAD = [255, 255, 255], PALE_ORANGE = [255, 150, 121];
const mob = () => document.documentElement.clientWidth < 760;
const rain = JayRain.Rain(document.getElementById('rain'), {
  fs: 16, fsMobile: 13, mono: '"JetBrains Mono", monospace', seed: 7, head: HEAD, headMix: .6,
  tint: T, paleTint: PALE_TEAL, paleOrange: PALE_ORANGE,
  palette: (x, w, r) => r < .84 ? T : PALE_TEAL,
  bands: (w, H) => [{y0: 0, y1: H, perCol: mob() ? 1.6 : 2.1, lenMin: 8, lenMax: 30, alpha: .56, stepMin: 60, stepMax: 170, colDensity: () => 1}],
  alphaAt: (x, y, R) => 1 - .45 * JayRain.smooth(R.H * .55, R.H, y),
  partSel: '.copy, .foot', partPad: 50, partFloor: .3
});
const fastNow = () => document.documentElement.dataset.mode === 'fast';
let line = null, wantNow = false;
const showBody = now => document.querySelectorAll('.late').forEach(x => { if (now) x.classList.add('now'); x.classList.add('in'); });
function finish(){
  if (state.done) return;
  showBody(false);
  if (line) line.el.appendChild(cursor);
  state.done = true;
  JayRain.dump && JayRain.dump(false);
  JayRain.rendered && JayRain.rendered();
  JayRain.seen && JayRain.seen();
}
function complete(){
  skipped = true;
  current && current.stop();
  showBody(true);
  if (line) render(line, line.n + TIMING.window, TIMING.window);
  finish();
}
window.__pageRain = rain;
JayRain.register(rain, fast => {
  pace = fast ? 4 : 2; state.pace = pace;
  if (ready && !state.done && !reduced) JayRain.dump(fast);
}, () => {
  if (!ready || state.done || reduced || !fastNow()) return false;
  complete();
  return true;
});
addEventListener('pageshow', e => { if (e.persisted && !state.done) wantNow = true; });

async function main(){
  const held = $('#day');
  const iso = (held && held.dataset.date) || ((location.pathname.match(/(\d{4}-\d{2}-\d{2})/) || [])[1]) || '';
  const kick = $('.kicker .kt');
  let cfg = {trackers: []};
  const files = {};
  try {
    const res = await fetch('/habits/trackers.json', {cache: 'no-cache'});
    if (res.ok) cfg = await res.json();
  } catch (err) { /* the day still shows the date */ }
  await Promise.all((cfg.trackers || []).filter(t => t.enabled !== false).map(async t => {
    try {
      const res = await fetch(t.data, {cache: 'no-cache'});
      if (!res.ok) throw new Error(String(res.status));
      files[t.id] = await res.json();
    } catch (err) {
      files[t.id] = {error: true, days: {}};
    }
  }));
  if (held){
    held.replaceChildren();
    (cfg.trackers || []).filter(t => t.enabled !== false).forEach(t => {
      const sec = sectionFor(t, files[t.id], iso);
      if (sec) held.appendChild(sec);
    });
  }
  await document.fonts.ready;
  line = prepare(kick, kick.textContent);
  render(line, 0, TIMING.window);
  cursor.remove();
  rain.build(); requestAnimationFrame(rain.frame);
  if (reduced || JayRain.returning(VER) || wantNow){ complete(); return; }
  ready = true;
  if (fastNow()) JayRain.dump(true);
  await wait(300);
  if (skipped) return;
  current = type(line, {speed: TIMING.kickerSpeed, window: TIMING.window});
  await current;
  if (skipped) return;
  finish();
}
main();
let lastW = innerWidth, rt;
addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(rain.build, 150); });
})();
