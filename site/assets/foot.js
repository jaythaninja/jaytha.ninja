/* v1.61 (jay 2026.10.03): the subpages' footer signup (see foot.css). same buttondown flow as the homepage: incomplete email = nothing sent (a teal glow + a screen-reader
   note); a valid one posts with a cors fetch (multipart email + embed=1 + tag); a 2xx = the thank-you ("thanks! 💛 check your inbox to confirm") types in gold in the field's
   slot and the page turns gold for the visit (JayRain.gold lock, like the homepage); anything else or a network error = the native form post, so buttondown's own page can
   show a captcha or a typo. the tag: ?ref= from the visit (JayRain.ref, e.g. "x") or else the page's own (data-ref: song / quote / snap / update) */
(() => {
  const foot = document.querySelector('.foot'); if (!foot) return;
  const form = foot.querySelector('form'), input = form.querySelector('input[type=email]'), atIn = form.querySelector('#fs-at'), AT_KEY = 'metadata__username', tag = form.querySelector('input[name=tag]'), go = form.querySelector('.fs-go'), thx = foot.querySelector('.fs-thx'), note = foot.querySelector('.fs-note');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches, THANKS = 'thanks! 💛 check your inbox to confirm';
  const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', {granularity: 'grapheme'}) : null;
  const graphemes = t => seg ? Array.from(seg.segment(t), x => x.segment) : Array.from(t);
  const looksDone = () => input.validity.valid && /@[^@\s]+\.[^@\s.]{2,}$/.test(input.value.trim());   // = the homepage's check
  /* v1.61: the optional @ (see foot.css), always visible. sent as metadata__username, spaces + a leading @ stripped; empty sends nothing */
  const atVal = () => atIn ? atIn.value.trim().replace(/^@+/, '').trim() : '';
  foot.classList.add('live');
  input.addEventListener('input', () => { form.classList.toggle('ok', looksDone()); form.classList.remove('bad'); note.textContent = ''; });
  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (busy || form.classList.contains('sent')) return;
    if (!looksDone()){ form.classList.remove('bad'); void form.offsetWidth; form.classList.add('bad'); note.textContent = "that email isn't complete yet, try again (like you@email.com)"; return; }
    busy = true; go.disabled = true;
    tag.value = (window.JayRain && JayRain.ref && JayRain.ref()) || foot.dataset.ref || 'site';
    const fd = new FormData(form), u = atVal(); fd.delete(AT_KEY); if (u) fd.set(AT_KEY, u);
    let res = null; try { res = await fetch(form.action, {method: 'POST', body: fd, mode: 'cors'}); } catch (err) {}
    if (!res || !res.ok){ go.disabled = false; busy = false; if (atIn){ if (u){ atIn.name = AT_KEY; atIn.value = u; } else atIn.removeAttribute('name'); } HTMLFormElement.prototype.submit.call(form); return; }
    thanks();
  });
  function thanks(){
    const g = graphemes(THANKS); thx.textContent = '';
    const typed = document.createElement('span'), ghost = document.createElement('span'); ghost.className = 'gh'; ghost.textContent = THANKS; thx.append(typed, ghost);   // the whole line is laid out from the start (hidden), so it never reflows
    if (document.activeElement && foot.contains(document.activeElement)) document.activeElement.blur(); form.classList.add('sent'); window.__footSent = true;
    const r = foot.getBoundingClientRect();
    if (window.JayRain && JayRain.gold) JayRain.gold({ms: 1700, y: (r.top + r.bottom)/2, lock: true});
    let i = 0; const step = () => { i++; typed.textContent = g.slice(0, i).join(''); ghost.textContent = g.slice(i).join(''); if (i < g.length) setTimeout(step, 38); };
    if (REDUCED){ typed.textContent = THANKS; ghost.textContent = ''; } else setTimeout(step, 300);
  }
})();
