/* jaytha.ninja/habits/ (v1.84): four year graphs on one screen. cells use the state colour; a run of 10 or more active days is gold. a caffeine day without a zero-caffeine record stays the empty gray cell. */
(() => {
const VER = 'habits-1.84';
const TIMING = {kickerSpeed: 55, window: 4, afterKicker: 280};
const SHORT = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const LOWER = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RAIN_GLYPHS = '0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz'.split('');
const rg = () => RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', {granularity: 'grapheme'}) : null;
const graphemes = t => seg ? Array.from(seg.segment(t), x => x.segment) : Array.from(t);
const cursor = document.createElement('span'); cursor.className = 'cursor';
const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let pace = 2, skipped = false, ready = false, current = null;
const state = window.__intro = {head: 0, done: false, pace};
const final = new Map();

function parse(iso){
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}
function fmt(ms){
  const dt = new Date(ms);
  return dt.getUTCFullYear() + '-' + String(dt.getUTCMonth() + 1).padStart(2, '0') + '-' + String(dt.getUTCDate()).padStart(2, '0');
}
const addDays = (iso, n) => fmt(parse(iso) + n * 86400000);
const weekday = iso => new Date(parse(iso)).getUTCDay();
function chicagoToday(){
  return new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
}
function ordinal(n){
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return n + 'st';
  if (j === 2 && k !== 12) return n + 'nd';
  if (j === 3 && k !== 13) return n + 'rd';
  return n + 'th';
}
function unitWord(n, unit){
  if (n === 1) return unit;
  return unit.endsWith('s') ? unit : unit + 's';
}
function sentence(n, iso, unit, minutes){
  const when = LONG[+iso.slice(5, 7) - 1] + ' ' + ordinal(+iso.slice(8));
  const head = n + ' ' + unitWord(n, unit);
  if (minutes == null) return head + ' on ' + when + '.';
  return head + ' · ' + minutes + ' min on ' + when + '.';
}
function shortDate(iso){
  return SHORT[+iso.slice(5, 7) - 1] + ' ' + (+iso.slice(8));
}
function noteLine(n, iso){
  return shortDate(iso) + ': ' + n + ' ' + unitWord(n, 'note');
}
function sleepLine(iso, score, mins){
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return shortDate(iso) + ': score ' + score + ' · ' + h + 'h ' + String(m).padStart(2, '0') + 'm';
}
function labelCell(cell, text){
  if (!text){
    cell.removeAttribute('aria-label');
    cell.removeAttribute('role');
    return;
  }
  cell.setAttribute('role', 'img');
  cell.setAttribute('aria-label', text);
}
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function monthLabel(ym){
  if (!ym) return '—';
  return LOWER[+ym.slice(5) - 1] + ' ' + ym.slice(0, 4);
}

function gridFor(today){
  const start = addDays(today, -364);
  const gridStart = addDays(start, -weekday(start));
  const gridEnd = addDays(today, (6 - weekday(today) + 7) % 7);
  const weeks = [];
  for (let iso = gridStart; iso <= gridEnd;){
    const col = [];
    for (let i = 0; i < 7; i++){ col.push(iso); iso = addDays(iso, 1); }
    weeks.push(col);
  }
  return {start, today, weeks};
}

function build(section, model){
  const weeks = model.weeks;
  const graph = section.querySelector('.graph');
  graph.style.setProperty('--weeks', String(weeks.length));
  section.dataset.start = model.start;
  section.dataset.today = model.today;
  const labels = weeks.map(col => {
    const hit = col.find(d => d.slice(8) === '01' && d <= model.today);
    return hit ? SHORT[+hit.slice(5, 7) - 1] : '';
  });
  if (!labels[0]) labels[0] = SHORT[+weeks[0][0].slice(5, 7) - 1];
  let prev = -10;
  labels.forEach((lab, i) => {
    if (!lab) return;
    if (i - prev < 3) labels[i] = '';
    else prev = i;
  });
  const months = section.querySelector('.months');
  const box = section.querySelector('.weeks');
  months.replaceChildren();
  box.replaceChildren();
  weeks.forEach((col, i) => {
    const lab = mk('span');
    lab.textContent = labels[i];
    /* a label in the last two columns is wider than those cells. pin its right edge to the grid so the month stays on screen. */
    if (labels[i] && weeks.length - i <= 2){
      lab.classList.add('edge');
      lab.style.setProperty('--mc', String(i + 1));
    }
    months.appendChild(lab);
    col.forEach(iso => {
      const future = iso > model.today;
      const el = mk('span', 'cell' + (future ? ' future' : ''));
      el.dataset.date = iso;
      el.dataset.lv = '0';
      box.appendChild(el);
    });
  });
}

function thresholds(values){
  const pos = values.filter(v => v > 0).sort((a, b) => a - b);
  if (!pos.length) return null;
  const at = p => pos[Math.min(pos.length - 1, Math.max(0, Math.ceil(p * pos.length) - 1))];
  return [at(0.25), at(0.5), at(0.75)];
}
function level(v, t){
  if (!t || v <= 0) return 0;
  if (v <= t[0]) return 1;
  if (v <= t[1]) return 2;
  if (v <= t[2]) return 3;
  return 4;
}
function minutesLevel(mins, edges){
  if (mins <= 0) return 0;
  const cuts = edges && edges.length ? edges : [45, 90, 150];
  let lv = 1;
  for (let i = 0; i < cuts.length; i++){
    if (mins < cuts[i]) return lv;
    lv++;
  }
  return lv;
}
const SLEEP_STREAK = 70;
function scoreLevel(score){
  if (score < 50) return 1;
  if (score < 70) return 2;
  if (score < 85) return 3;
  return 4;
}
function markGold(dates, days, today, min){
  const gold = new Set();
  let run = [];
  const flush = () => { if (run.length >= min) run.forEach(d => gold.add(d)); run = []; };
  dates.forEach(iso => {
    if (iso > today){ flush(); return; }
    if (days[iso] && days[iso].total > 0) run.push(iso);
    else flush();
  });
  flush();
  return gold;
}
function computeStats(days, start, today, metric){
  let total = 0, longest = 0, run = 0, bestN = 0;
  let bestDay = '', bestMo = '', bestMoN = 0;
  const byMonth = {};
  for (let iso = start; iso <= today; iso = addDays(iso, 1)){
    const day = days[iso];
    const n = (day && day.total) || 0;
    const rank = metric === 'minutes' ? ((day && day.minutes) || 0) : n;
    total += n;
    if (n > 0){
      run++;
      if (run > longest) longest = run;
      const mo = iso.slice(0, 7);
      byMonth[mo] = (byMonth[mo] || 0) + rank;
      if (rank > bestN || (rank === bestN && iso > bestDay)){ bestN = rank; bestDay = iso; }
    } else run = 0;
  }
  Object.keys(byMonth).forEach(mo => {
    if (byMonth[mo] > bestMoN || (byMonth[mo] === bestMoN && mo > bestMo)){ bestMo = mo; bestMoN = byMonth[mo]; }
  });
  let current = 0;
  let cursorDay = (days[today] && days[today].total > 0) ? today : addDays(today, -1);
  if (days[cursorDay] && days[cursorDay].total > 0){
    while (days[cursorDay] && days[cursorDay].total > 0){ current++; cursorDay = addDays(cursorDay, -1); }
  }
  return {total, longest, current, bestDay, bestMo};
}
function computeSleepStats(days, start, today){
  let sum = 0, n = 0, longest = 0, run = 0;
  let bestScore = -1, bestDay = '';
  const byMonth = {};
  for (let iso = start; iso <= today; iso = addDays(iso, 1)){
    const day = days[iso];
    const recorded = !!(day && Number.isFinite(day.score));
    if (recorded && day.score >= SLEEP_STREAK){
      run++;
      if (run > longest) longest = run;
    } else run = 0;
    if (!recorded) continue;
    sum += day.score;
    n++;
    const mo = iso.slice(0, 7);
    if (!byMonth[mo]) byMonth[mo] = {sum: 0, n: 0};
    byMonth[mo].sum += day.score;
    byMonth[mo].n++;
    if (day.score > bestScore || (day.score === bestScore && iso > bestDay)){
      bestScore = day.score; bestDay = iso;
    }
  }
  let bestMo = '', bestAvg = -1;
  Object.keys(byMonth).forEach(mo => {
    const row = byMonth[mo];
    if (row.n < 7) return;
    const avg = row.sum / row.n;
    if (avg > bestAvg || (avg === bestAvg && mo > bestMo)){ bestMo = mo; bestAvg = avg; }
  });
  let current = 0;
  let cursorDay = days[today] ? today : addDays(today, -1);
  if (days[cursorDay] && days[cursorDay].score >= SLEEP_STREAK){
    while (days[cursorDay] && days[cursorDay].score >= SLEEP_STREAK){ current++; cursorDay = addDays(cursorDay, -1); }
  }
  const avg = n ? Math.round((sum / n) * 10) / 10 : 0;
  return {avg, longest, current, bestDay, bestScore, bestMo};
}
function fillStats(section, s){
  const set = (k, v) => { const el = section.querySelector('[data-k="' + k + '"]'); if (el) el.textContent = v; };
  set('total', commas(s.total));
  set('month', s.bestMo ? monthLabel(s.bestMo) : '—');
  set('day', s.bestDay ? s.bestDay.replace(/-/g, '.') : '—');
  set('longest', s.longest + 'd');
  set('current', s.current + 'd');
}
function fillSleepStats(section, s){
  const set = (k, v) => { const el = section.querySelector('[data-k="' + k + '"]'); if (el) el.textContent = v; };
  set('total', String(s.avg));
  set('month', s.bestMo ? monthLabel(s.bestMo) : '—');
  set('day', s.bestDay ? s.bestScore + ' · ' + shortDate(s.bestDay) : '—');
  set('longest', s.longest + 'd');
  set('current', s.current + 'd');
}
function paint(cell, lv, gold){
  cell.dataset.lv = String(lv);
  if (gold) cell.dataset.gold = '1';
  else delete cell.dataset.gold;
  cell.classList.remove('hot');
}
function paintAll(){
  final.forEach((fin, cell) => paint(cell, fin.lv, fin.gold));
}
function daysOf(section, data){
  const kind = section.dataset.kind || '';
  if (kind === 'journal'){
    const src = (data && data.days && typeof Object.values(data.days)[0] !== 'object') ? data.days : data;
    const days = {};
    Object.keys(src || {}).forEach(iso => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
      days[iso] = {total: Number(src[iso]) || 0};
    });
    return days;
  }
  if (kind === 'caffeine'){
    const days = {};
    const raw = (data && data.days) || {};
    Object.keys(raw).forEach(iso => {
      const success = raw[iso] === true;
      days[iso] = {total: success ? 1 : 0, success};
    });
    return days;
  }
  if (kind === 'sleep'){
    const days = {};
    const raw = (data && data.days) || {};
    Object.keys(raw).forEach(iso => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
      const row = raw[iso] || {};
      const score = Number(row.score);
      if (!Number.isFinite(score)) return;
      days[iso] = {total: score >= SLEEP_STREAK ? 1 : 0, score, asleep: Number(row.asleep_min) || 0};
    });
    return days;
  }
  return (data && data.days) || {};
}
function apply(section, days, meta){
  const kind = section.dataset.kind || '';
  const unit = section.dataset.unit || 'contribution';
  const metric = (meta && meta.intensity && meta.intensity.metric) || section.dataset.metric || '';
  const edges = (meta && meta.intensity && meta.intensity.edges) || (section.dataset.buckets || '').split(',').map(Number).filter(Boolean);
  const today = section.dataset.today;
  const start = section.dataset.start;
  const habitStart = (meta && meta.start) || '';
  const cells = [...section.querySelectorAll('.cell')];
  const dates = cells.map(c => c.dataset.date);
  const counted = [];
  dates.forEach(iso => {
    if (iso >= start && iso <= today) counted.push((days[iso] && days[iso].total) || 0);
  });
  const scale = thresholds(counted);
  const gold = markGold(dates, days, today, 10);
  cells.forEach(cell => {
    const iso = cell.dataset.date;
    if (iso > today) return;
    const day = days[iso];
    const n = (day && day.total) || 0;
    if (kind === 'caffeine'){
      const inRange = !!habitStart && iso >= habitStart && iso <= today;
      const success = !!(day && day.success);
      const on = success && gold.has(iso);
      final.set(cell, {lv: success ? 4 : 0, gold: on, n});
      if (inRange) labelCell(cell, shortDate(iso) + ': ' + (success ? 'zero caffeine' : 'caffeine'));
      else labelCell(cell, '');
      return;
    }
    if (kind === 'sleep'){
      const recorded = !!(day && Number.isFinite(day.score));
      const score = recorded ? day.score : 0;
      final.set(cell, {lv: recorded ? scoreLevel(score) : 0, gold: recorded && gold.has(iso), n: score});
      labelCell(cell, recorded ? sleepLine(iso, score, day.asleep) : '');
      return;
    }
    const minutes = metric === 'minutes' ? Math.round((day && day.minutes) || 0) : null;
    const lv = metric === 'minutes' || (kind === 'journal' && edges.length)
      ? minutesLevel(minutes != null ? minutes : n, edges)
      : level(n, scale);
    final.set(cell, {lv, gold: gold.has(iso), n, minutes});
    labelCell(cell, kind === 'journal' ? noteLine(n, iso) : sentence(n, iso, unit, minutes));
  });
  if (kind === 'sleep') fillSleepStats(section, computeSleepStats(days, start, today));
  else fillStats(section, computeStats(days, start, today, metric));
}

const today = chicagoToday();
const model = gridFor(today);
$$('.tracker').forEach(section => build(section, model));

const tip = mk('div', 'tip');
tip.hidden = true;
tip.setAttribute('role', 'tooltip');
document.body.appendChild(tip);
function hideTip(){ tip.hidden = true; }
function showTip(cell){
  const fin = final.get(cell);
  const unit = cell.closest('.tracker').dataset.unit || 'contribution';
  const label = cell.getAttribute('aria-label');
  if (!label){ hideTip(); return; }
  tip.textContent = label || sentence(fin ? fin.n : 0, cell.dataset.date, unit);
  tip.hidden = false;
  const r = cell.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(8, Math.min(left, innerWidth - w - 8));
  let top = r.top - h - 8;
  if (top < 8) top = Math.min(innerHeight - h - 8, r.bottom + 8);
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}
let armed = null;
document.addEventListener('pointerover', e => {
  const cell = e.target.closest && e.target.closest('.cell');
  if (!cell || e.pointerType === 'touch') return;
  showTip(cell);
});
document.addEventListener('pointerout', e => {
  const cell = e.target.closest && e.target.closest('.cell');
  if (!cell || e.pointerType === 'touch') return;
  hideTip();
});
document.addEventListener('focusin', e => {
  const cell = e.target.closest && e.target.closest('.cell');
  if (cell) showTip(cell);
});
document.addEventListener('focusout', () => hideTip());
document.addEventListener('pointerdown', e => {
  if (!e.target.closest || !e.target.closest('.cell')){ armed = null; hideTip(); }
});
document.addEventListener('click', e => {
  const cell = e.target.closest && e.target.closest('.cell');
  if (!cell) return;
  if (!matchMedia('(hover: none)').matches) return;
  if (armed !== cell){ e.preventDefault(); armed = cell; showTip(cell); }
});

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
      const c = all[Math.min(head, t.n) - 1];
      const delay = head > t.n ? base * .7 : c === '.' ? base * 1.6 : base * (.75 + Math.random() * .6);
      setTimeout(tick, reduced ? 0 : delay / pace);
    };
    tick();
  });
  p.stop = () => { cancelled = true; };
  return p;
}
const wait = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms / pace));

function columnCells(i){
  const out = [];
  $$('.tracker').forEach(sec => {
    const cells = sec.querySelectorAll('.cell');
    for (let r = 0; r < 7; r++){ const cell = cells[i * 7 + r]; if (cell) out.push(cell); }
  });
  return out;
}
async function sweep(){
  const columns = model.weeks.length;
  for (let i = 0; i < columns; i++){
    if (skipped) return;
    const live = columnCells(i).filter(c => { const f = final.get(c); return f && (f.lv > 0 || f.gold); });
    live.forEach(c => c.classList.add('hot'));
    await wait(18);
    if (skipped) return;
    live.forEach(c => { const f = final.get(c); paint(c, f.lv, f.gold); });
    await wait(26);
  }
}

const T = [26, 173, 179], PALE_TEAL = [121, 205, 207], HEAD = [255, 255, 255], PALE_ORANGE = [255, 150, 121];
const mob = () => document.documentElement.clientWidth < 760;
const rain = JayRain.Rain(document.getElementById('rain'), {
  fs: 16, fsMobile: 13, mono: '"JetBrains Mono", monospace', seed: 5, head: HEAD, headMix: .6,
  tint: T, paleTint: PALE_TEAL, paleOrange: PALE_ORANGE,
  palette: (x, w, r) => r < .84 ? T : PALE_TEAL,
  bands: (w, H) => [{y0: 0, y1: H, perCol: mob() ? 1.6 : 2.1, lenMin: 8, lenMax: 30, alpha: .56, stepMin: 60, stepMax: 170, colDensity: () => 1}],
  alphaAt: (x, y, R) => 1 - .45 * JayRain.smooth(R.H * .55, R.H, y),
  partSel: '.copy, .foot', partPad: 50, partFloor: .3
});
const fastNow = () => document.documentElement.dataset.mode === 'fast';
let lines = [], wantNow = false;
function finish(){
  if (state.done) return;
  cursor.remove();
  state.done = true;
  JayRain.dump && JayRain.dump(false);
  JayRain.rendered && JayRain.rendered();
  JayRain.seen && JayRain.seen();
}
function complete(){
  skipped = true;
  current && current.stop();
  lines.forEach(t => render(t, t.n + TIMING.window, TIMING.window));
  paintAll();
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

async function loadAll(){
  await Promise.all($$('.tracker').map(async section => {
    try {
      const res = await fetch(section.dataset.src, {cache: 'no-cache'});
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      apply(section, daysOf(section, data), data);
    } catch (err) {
      section.dataset.error = '1';
      const el = section.querySelector('[data-k="total"]');
      if (el) el.textContent = '—';
    }
  }));
}
const dataReady = loadAll();

async function main(){
  await document.fonts.ready;
  await dataReady;
  lines = $$('.tracker .kt').map(el => prepare(el, el.textContent));
  lines.forEach(t => render(t, 0, TIMING.window));
  cursor.remove();
  rain.build(); requestAnimationFrame(rain.frame);
  if (reduced || JayRain.returning(VER) || wantNow){ complete(); return; }
  ready = true;
  if (fastNow()) JayRain.dump(true);
  await wait(300);
  if (skipped) return;
  for (let i = 0; i < lines.length; i++){
    state.head = 0;
    current = type(lines[i], {speed: TIMING.kickerSpeed, window: TIMING.window});
    await current;
    if (skipped) return;
    if (i < lines.length - 1){ await wait(TIMING.afterKicker); if (skipped) return; }
  }
  await sweep();
  if (skipped) return;
  finish();
}
main();
let lastW = innerWidth, rt;
addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(rain.build, 150); });
})();
