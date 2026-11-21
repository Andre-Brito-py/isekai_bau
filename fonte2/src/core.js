// ================= MOTOR =================
'use strict';
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0; h = (h ^ (h >> 13)) * 1274126177 >>> 0; return (h ^ (h >> 16)) >>> 0; }
const W = 240, H = 240, TS = 16;
const cvs = document.getElementById('screen'), ctx = cvs.getContext('2d');
const buf = mk(W, H), bx = buf.getContext('2d'); bx.imageSmoothingEnabled = false;
const lightC = mk(W, H), lx = lightC.getContext('2d');
let S = 3, DPR = 1, TSD = 2, FRAME = 0;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pickOne = a => a[Math.floor(Math.random() * a.length)];

// ---------- estado ----------
const V = { fade: 0, tw: null, shake: 0, busy: 0, banner: null, scene: 'boot' };
let G = newState();
function newState() {
  return { name: 'Davi', species: 'caixote', diff: 'desafio', flags: {}, her: null, time: 0, ch: 1, items: { frasco: 3, tinta: 2 } };
}
const DIFF = {
  desafio: { name: 'Desafio', atk: 1.25, hp: 1.25, boss: 1.15, ring: 1.12, perfect: [8.8, 11.6], good: [6.8, 13.6], flask: 0.35, flee: 0.5, bite: 3.6, tricks: true },
  historia: { name: 'História', atk: 1, hp: 1, boss: 1, ring: 1, perfect: [8, 12.5], good: [6, 15], flask: 0.45, flee: 0.7, bite: 3.2, tricks: false }
};
const DF = () => DIFF[G.diff] || DIFF.desafio;

// ---------- tela ----------
function resize() {
  DPR = window.devicePixelRatio || 1;
  const st = document.getElementById('stage').getBoundingClientRect();
  const avail = Math.max(120, Math.min(st.width, st.height)) * DPR;
  S = DPR >= 2 ? avail / W : Math.max(1, Math.floor(avail / W));
  S = Math.max(1, S);
  cvs.width = Math.round(W * S); cvs.height = Math.round(H * S);
  S = cvs.width / W;
  cvs.style.width = (cvs.width / DPR) + 'px'; cvs.style.height = (cvs.height / DPR) + 'px';
  TSD = DPR >= 2 ? S * 0.75 : Math.max(1, Math.floor(S * 0.75));
  ctx.imageSmoothingEnabled = false;
}
addEventListener('resize', resize); addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------- fonte pixel ----------
const FG = {}; let FA; const TINT = {};
function buildFont() {
  let total = 0; for (const k in FONT) total += FONT[k][0];
  FA = mk(total, 16); const fx = FA.getContext('2d'); fx.fillStyle = '#fff'; let x = 0;
  for (const ch in FONT) { const [w, rows] = FONT[ch]; FG[ch] = { x, w }; rows.forEach((v, j) => { for (let i = 0; i < w; i++) if (v >> i & 1) fx.fillRect(x + i, j, 1, 1); }); x += w; }
}
function tint(col) {
  if (TINT[col]) return TINT[col];
  const c = mk(FA.width, 16), x = c.getContext('2d'); x.drawImage(FA, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, 16);
  return TINT[col] = c;
}
const TC = { y: '#ffe066', c: '#8fe3ff', r: '#ff6b6b', g: '#9be58a', o: '#ffa94d', p: '#d0a8ff', w: '#ffffff', d: '#8a8099' };
function rich(s, def = '#ffffff') {
  const out = []; let col = def; s = String(s);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') { const j = s.indexOf('}', i); if (j > i) { const tag = s.slice(i + 1, j); col = tag === '/' ? def : (TC[tag] || (tag[0] === '#' ? tag : def)); i = j; continue; } }
    out.push({ c: ch, col });
  }
  return out;
}
const cw = c => (FG[c] && FG[c].w > 8) ? 2 : 1;
function wrapRich(arr, max) {
  const lines = []; let line = [], lw = 0, word = [], ww = 0;
  const flush = () => {
    if (!word.length) return;
    if (lw + ww > max && line.length) { while (line.length && line[line.length - 1].c === ' ') { line.pop(); } lines.push(line); line = []; lw = 0; }
    line.push(...word); lw += ww; word = []; ww = 0;
  };
  for (const ch of arr) {
    if (ch.c === '\n') { flush(); lines.push(line); line = []; lw = 0; continue; }
    if (ch.c === ' ') { flush(); if (line.length && lw + 1 <= max) { line.push(ch); lw++; } continue; }
    word.push(ch); ww += ch.c === '|' ? 0 : cw(ch.c);
  }
  flush(); lines.push(line);
  return lines;
}
const TQ = []; const TXO = { x: 0, y: 0 };
function glyph(c, col, lx_, ly, sz) {
  const g = FG[c] || FG['?']; const gs = TSD * sz; const cellW = 6 * sz * (g.w > 8 ? 2 : 1);
  const dx = Math.round(lx_ * S + (cellW * S - g.w * gs) / 2), dy = Math.round(ly * S + (12 * sz * S - 16 * gs) / 2);
  ctx.drawImage(tint(col), g.x, 0, g.w, 16, dx, dy, Math.round(g.w * gs), Math.round(16 * gs));
}
function lineW(chars, sz = 1) { let w = 0; for (const ch of chars) if (ch.c !== '|') w += 6 * sz * cw(ch.c); return w; }
function txt(s, x, y, o = {}) {
  const sz = o.sz || 1;
  const lines = o.w ? wrapRich(rich(s, o.col), o.w) : [rich(s, o.col)];
  lines.forEach((ln, i) => {
    let xx = x; if (o.align === 'center') xx = x - lineW(ln, sz) / 2; else if (o.align === 'right') xx = x - lineW(ln, sz);
    TQ.push({ chars: ln, x: xx + TXO.x, y: y + TXO.y + i * (o.lh || 12 * sz), n: 1e9, sz, shadow: o.shadow, alpha: o.alpha, fx: o.fx });
  });
  return lines.length;
}
function flushText() {
  const fa = 1 - V.fade;
  for (const t of TQ) {
    ctx.globalAlpha = clamp((t.alpha ?? 1) * fa, 0, 1); if (ctx.globalAlpha <= 0) continue;
    let cx = t.x, cnt = 0;
    for (const ch of t.chars) {
      if (cnt >= t.n) break; cnt++;
      if (ch.c === '|') continue;
      let ox = 0, oy = 0;
      if (t.fx === 'shake') { ox = Math.round(rand(-1, 1) * 0.75 * 10) / 10; oy = Math.round(rand(-1, 1) * 0.75 * 10) / 10; }
      else if (t.fx === 'wave') oy = Math.sin(FRAME * 0.12 + cnt * 0.6) * 1.5;
      if (ch.c !== ' ') {
        if (t.shadow) glyph(ch.c, '#000000', cx + ox + 0.75 * t.sz, t.y + oy + 0.75 * t.sz, t.sz);
        glyph(ch.c, ch.col, cx + ox, t.y + oy, t.sz);
      }
      cx += 6 * t.sz * cw(ch.c);
    }
  }
  ctx.globalAlpha = 1; TQ.length = 0;
}
// máquina de escrever
class TW {
  constructor() { this.lines = []; this.flat = []; this.n = 0; this.done = true; }
  set(s, max, o = {}) {
    this.lines = wrapRich(rich(s, o.col || '#ffffff'), max); this.flat = this.lines.flat();
    this.n = 0; this.acc = 0; this.wait = 0; this.done = false; this.speed = o.speed || 0.55; this.voice = o.voice; this.fx = o.fx;
    if (o.instant) this.skip();
  }
  skip() { this.n = this.flat.length; this.done = true; }
  update() {
    if (this.done) return;
    if (this.wait > 0) { this.wait--; return; }
    this.acc += this.speed;
    while (this.acc >= 1 && this.n < this.flat.length) {
      this.acc--; const ch = this.flat[this.n++];
      if (ch.c === '|') { this.wait = 16; this.acc = 0; break; }
      if ('.!?'.includes(ch.c) && this.flat[this.n] && this.flat[this.n].c === ' ') { this.wait = 6; this.acc = 0; }
      if (ch.c !== ' ' && this.n % 2 === 0 && this.voice) this.voice();
    }
    if (this.n >= this.flat.length) this.done = true;
  }
  draw(x, y, lh = 12, o = {}) {
    let rem = this.n;
    for (let i = 0; i < this.lines.length; i++) {
      const ln = this.lines[i]; if (rem <= 0) break;
      TQ.push({ chars: ln, x: x + TXO.x, y: y + TXO.y + i * lh, n: rem, sz: 1, fx: this.fx, shadow: o.shadow });
      rem -= ln.length;
    }
  }
}

// ---------- input ----------
const KEYS = {}, JPQ = {}; let JP = {}; const HELD = {};
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right', KeyZ: 'a', Enter: 'a', Space: 'a', KeyJ: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b', KeyK: 'b', KeyC: 'menu', KeyQ: 'menu' };
function press(k) { if (!KEYS[k]) JPQ[k] = true; KEYS[k] = true; }
function release(k) { KEYS[k] = false; }
addEventListener('keydown', e => {
  if (!document.getElementById('ov').hidden) return;
  if (e.code === 'KeyM') { toggleMute(); return; }
  const k = KEYMAP[e.code]; if (k) { press(k); e.preventDefault(); unlockAudio(); }
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) release(k); });
function btnp(k) { if (JP[k]) { JP[k] = false; return true; } return false; }
function navp(k) {
  if (btnp(k)) { HELD[k] = 0; return true; }
  if (KEYS[k]) { HELD[k] = (HELD[k] || 0) + 1; if (HELD[k] > 18 && HELD[k] % 5 === 0) return true; } else HELD[k] = 0;
  return false;
}
function muteLabel() { const el = document.getElementById('bs'); if (!el) return; el.textContent = AU.muted ? 'Mudo' : 'Som'; el.style.color = AU.muted ? '#ff6b6b' : ''; el.style.borderColor = AU.muted ? '#ff6b6b' : ''; }
function toggleMute() { unlockAudio(); setMuted(!AU.muted); muteLabel(); }
function setupTouch() {
  // direcional redondo: área de toque maior que o desenho, setores de 90° com margem (o dedo pode escorregar
  // para a diagonal sem trocar de direção) e vibração curta a cada troca
  const dp = document.getElementById('dpad'), dz = document.getElementById('dzone') || dp; let pid = null, cur = null;
  const ANG = { right: 0, down: 90, left: 180, up: -90 };
  // no mapa (andar livre) o direcional também tem as 4 diagonais; em menus e batalha, só as 4 direções
  const ANG8 = { right: 0, 'down-right': 45, down: 90, 'down-left': 135, left: 180, 'up-left': -135, up: -90, 'up-right': -45 };
  const angDiff = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  const dirOf = e => {
    const r = dp.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), dist = Math.hypot(dx, dy);
    if (dist < (cur ? 8 : 14)) return cur && dist >= 8 ? cur : null;
    const a = Math.atan2(dy, dx) * 180 / Math.PI;
    const T = V.scene === 'world' ? ANG8 : ANG, half = V.scene === 'world' ? 22.5 : 45;
    if (cur && T[cur] != null && angDiff(a, T[cur]) < half + 8) return cur;
    let best = 'right', bd = 999; for (const k in T) { const d = angDiff(a, T[k]); if (d < bd) { bd = d; best = k; } } return best;
  };
  const setDir = d => {
    if (d === cur) return;
    const on = d ? d.split('-') : [];
    for (const k of ['up', 'down', 'left', 'right']) { if (on.includes(k)) press(k); else release(k); }
    cur = d; dp.className = on.map(k => 'on-' + k).join(' ');
    if (d && navigator.vibrate) { try { navigator.vibrate(8); } catch (_) { } }
  };
  dz.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); pid = e.pointerId; try { dz.setPointerCapture(pid); } catch (_) { } cur = null; setDir(dirOf(e)); });
  dz.addEventListener('pointermove', e => { if (e.pointerId === pid) setDir(dirOf(e)); });
  const end = e => { if (e.pointerId === pid) { pid = null; setDir(null); } };
  dz.addEventListener('pointerup', end); dz.addEventListener('pointercancel', end); dz.addEventListener('lostpointercapture', end);
  document.querySelectorAll('[data-k]').forEach(el => {
    const k = el.dataset.k;
    el.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); el.classList.add('down'); if (k === 'mute') toggleMute(); else press(k); });
    const up = () => { el.classList.remove('down'); if (k !== 'mute') release(k); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);
  });
  cvs.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); if (V.scene === 'title' || (UI.top() && UI.top().type === 'dialog')) { press('a'); setTimeout(() => release('a'), 60); } });
  addEventListener('contextmenu', e => e.preventDefault());
  muteLabel();
}

// ---------- tempo / fade ----------
const WAITS = [];
const wait = n => new Promise(r => WAITS.push({ n, r }));
function fadeTo(v, n) { return new Promise(r => { V.tw = { from: V.fade, to: v, n: Math.max(1, n), t: 0, r }; }); }
const fadeIn = (n = 20) => fadeTo(0, n), fadeOut = (n = 20) => fadeTo(1, n);
function shake(n) { V.shake = n; }

// ---------- UI (janelas empilhadas) ----------
const UI = { stack: [], top() { return this.stack[this.stack.length - 1]; } };
function openWin(w) { return new Promise(r => { w.resolve = r; UI.stack.push(w); }); }
function closeWin(w, v) { const i = UI.stack.indexOf(w); if (i >= 0) UI.stack.splice(i, 1); w.resolve && w.resolve(v); }
function box(x, y, w, h, o = {}) {
  const bw = o.bw || 2;
  bx.fillStyle = o.edge || '#ffffff'; bx.fillRect(x, y, w, h);
  bx.fillStyle = o.fill || '#000000'; bx.fillRect(x + bw, y + bw, w - bw * 2, h - bw * 2);
}
const WHO = {
  n: { voice: () => sfx('blip', 420) },
  void: { voice: () => sfx('blip', 330) },
  cat: { voice: () => sfx('blipTri', 1500), col: '#a8ecff', edge: '#5fd0ff' },
  me: { name: () => G.name, portrait: () => PT('me'), voice: () => sfx('blip', 560) },
  lume: { name: () => 'Lume', portrait: () => PT('lumeh'), voice: () => sfx('blipTri', 1150), col: '#fff0c0' },
  rita: { name: () => 'Rita', portrait: () => PT('rita'), voice: () => sfx('blip', 700), col: '#ffd8c8' },
  jorge: { name: () => 'Seu Jorge', portrait: () => PT('jorge'), voice: () => sfx('blipLow', 170) },
  esp: { name: () => 'Espantalho', voice: () => sfx('blipLow', 90), fx: 'shake', col: '#f0d8a0', edge: '#c88040' }
};
function say(text, who = 'n', opt = {}) {
  text = String(text).replace(/@/g, G.name);
  const wd = WHO[who] || WHO.n, hasP = !!wd.portrait;
  const tw = new TW();
  const isVoid = who === 'void';
  tw.set(text, isVoid ? 34 : hasP ? 28 : 34, { voice: wd.voice, col: wd.col, fx: wd.fx, speed: isVoid ? 0.4 : 0.55 });
  // paginação: a caixa comporta 5 linhas; na última página, as opções também ocupam linhas
  const MAXL = isVoid ? 7 : 5, nOpt = opt.choices ? opt.choices.length : 0, lastCap = Math.max(1, MAXL - nOpt);
  const pages = [];
  for (let i = 0; i < tw.lines.length; i += MAXL) pages.push(tw.lines.slice(i, i + MAXL));
  if (!pages.length) pages.push([]);
  const lp = pages[pages.length - 1];
  if (lp.length > lastCap) { pages[pages.length - 1] = lp.slice(0, lp.length - lastCap); pages.push(lp.slice(lp.length - lastCap)); }
  const setPage = (tw, i) => { tw.lines = pages[i]; tw.flat = pages[i].flat(); tw.n = 0; tw.acc = 0; tw.wait = 0; tw.done = !tw.flat.length; };
  if (pages.length > 1) setPage(tw, 0);
  const w = {
    type: 'dialog', tw, who, wd, opts: opt.choices, idx: 0, page: 0,
    get lastPage() { return this.page >= pages.length - 1; },
    update() {
      this.tw.update();
      if (!this.lastPage) {
        if (btnp('a')) { if (!this.tw.done) this.tw.skip(); else { this.page++; setPage(this.tw, this.page); } }
        else if (btnp('b') && !this.tw.done) this.tw.skip();
        return;
      }
      if (this.opts && this.tw.done) {
        if (navp('up')) { this.idx = (this.idx + this.opts.length - 1) % this.opts.length; sfx('move'); }
        if (navp('down')) { this.idx = (this.idx + 1) % this.opts.length; sfx('move'); }
        if (btnp('a')) { sfx('select'); closeWin(this, this.idx); }
        if (btnp('b') && opt.cancel != null) { sfx('cancel'); closeWin(this, opt.cancel); }
        return;
      }
      if (btnp('a')) { if (!this.tw.done) this.tw.skip(); else { closeWin(this, 0); } }
      else if (btnp('b') && !this.tw.done) this.tw.skip();
    },
    draw() {
      if (isVoid) { this.tw.draw(18, 92, 14); if (this.tw.done && FRAME % 40 < 26) txt('▼', 222, 200, { col: '#8a8099' }); return; }
      let y = 156;
      if (V.boxTop) y = 6;
      const h = this.opts ? 78 : 78;
      box(6, y, 228, h, { edge: wd.edge || '#ffffff' });
      let tx = 16;
      if (hasP) {
        const p = wd.portrait(!this.tw.done);
        if (p.width >= 32) { box(10, y + 9, 36, 36, { bw: 1, edge: wd.edge || '#8a8099', fill: '#1a1424' }); bx.drawImage(p, 12, y + 11); }
        else { const sc = 32 / Math.max(p.width, p.height); bx.drawImage(p, 12, y + 14, p.width * sc, p.height * sc); }
        tx = 52;
      }
      if (wd.name) { const nm = wd.name(); const nw = nm.length * 6 + 10; box(12, y - 8, nw, 14, { bw: 1, edge: wd.edge || '#ffffff' }); txt(nm, 17, y - 7, { col: '#ffe066' }); }
      this.tw.draw(tx, y + 8, 12);
      if (this.opts && this.tw.done && this.lastPage) {
        const oy = y + 8 + this.tw.lines.length * 12 + 2;
        this.opts.forEach((o, i) => txt((i === this.idx ? '{y}►{/} ' : '  ') + o, tx, oy + i * 12, { col: i === this.idx ? '#ffe066' : '#ffffff' }));
      } else if (this.tw.done && FRAME % 40 < 26) txt('▼', 222, y + 64, { col: '#8a8099' });
    }
  };
  return openWin(w);
}
function choose(text, options, who = 'n', cancel = null) { return say(text, who, { choices: options, cancel }); }
// quantas linhas cabem na lista: respeita maxVis e, se a caixa tiver altura fixa, nunca passa da borda
function listHead(o) { const head = o.head || []; return (o.title ? 16 : 6) + head.length * 12 + (head.length ? 4 : 0); }
function listVis(o) { let mv = o.maxVis || 8; if (o.h) mv = Math.min(mv, Math.max(1, Math.floor((o.h - listHead(o) - 4) / 12))); return mv; }
function list(o) {
  const w = {
    type: 'list', o, idx: o.idx || 0, scroll: 0,
    update() {
      const it = o.items; if (!it.length) { if (btnp('b') || btnp('a')) closeWin(this, -1); return; }
      if (navp('up')) { this.idx = (this.idx + it.length - 1) % it.length; sfx('move'); }
      if (navp('down')) { this.idx = (this.idx + 1) % it.length; sfx('move'); }
      if (btnp('a')) { if (it[this.idx].disabled && !o.allowDisabled) sfx('cancel'); else { sfx('select'); closeWin(this, this.idx); } }
      else if (btnp('b') && o.cancel !== false) { sfx('cancel'); closeWin(this, -1); }
      const mv = listVis(o); if (this.idx < this.scroll) this.scroll = this.idx; if (this.idx >= this.scroll + mv) this.scroll = this.idx - mv + 1;
    },
    draw() {
      const it = o.items, mv = Math.min(listVis(o), it.length || 1), head = o.head || [];
      const hh = listHead(o);
      const h = o.h || hh + mv * 12 + 6;
      box(o.x, o.y, o.w, h, { edge: o.edge || '#ffffff' });
      if (o.title) txt(o.title, o.x + 8, o.y + 4, { col: '#ffe066' });
      head.forEach((l, i) => txt(l, o.x + 8, o.y + (o.title ? 16 : 6) + i * 12));
      if (!it.length) txt(o.empty || '(vazio)', o.x + 14, o.y + hh, { col: '#8a8099' });
      for (let i = 0; i < mv && i + this.scroll < it.length; i++) {
        const k = i + this.scroll, item = it[k], sel = k === this.idx;
        const col = item.disabled ? '#6a6078' : sel ? '#ffe066' : (item.col || '#ffffff');
        const yy = o.y + hh + i * 12;
        if (sel) txt('►', o.x + 6, yy, { col: '#ffe066' });
        txt(item.label, o.x + 16, yy, { col });
        if (item.right) txt(item.right, o.x + o.w - 8, yy, { align: 'right', col: item.disabled ? '#6a6078' : '#b8aecb' });
      }
      // setas de rolagem na linha do título (não cobrem nenhum item) e um contador
      const more = it.length > mv, ay = o.title ? o.y + 4 : o.y + h - 12;
      if (more) {
        if (this.scroll > 0) txt('▲', o.x + o.w - 22, ay, { col: '#ffe066' });
        if (this.scroll + mv < it.length) txt('▼', o.x + o.w - 12, ay, { col: '#ffe066' });
        if (o.title) txt(`${this.idx + 1}/${it.length}`, o.x + o.w - 28, ay, { align: 'right', col: '#8a8099' });
      }
      if (o.desc && it.length) { const d = o.desc(this.idx); if (d) { const dy = o.descY ?? 182; box(o.x, dy, o.w, 52, { bw: 1, edge: '#8a8099' }); txt(d, o.x + 8, dy + 5, { w: Math.floor((o.w - 16) / 6) }); } }
      if (o.extra) o.extra(this.idx);
    }
  };
  return openWin(w);
}
function panel(lines, o = {}) {
  const w = {
    type: 'panel', update() { if (btnp('a') || btnp('b')) { sfx('cancel'); closeWin(this); } },
    draw() {
      const x = o.x ?? 8, y = o.y ?? 8, ww = o.w ?? 224, h = o.h ?? (lines.length * 12 + (o.title ? 22 : 12));
      box(x, y, ww, h); if (o.title) txt(o.title, x + 8, y + 4, { col: '#ffe066' });
      lines.forEach((l, i) => txt(l, x + 10, y + (o.title ? 18 : 6) + i * 12));
    }
  };
  return openWin(w);
}

// ---------- overlay HTML (nome, backup) ----------
const OV = document.getElementById('ov'), OVB = document.getElementById('ovbox');
function cleanName(s, max) { return [...s].filter(c => FG[c] && c !== '{' && c !== '}' && c !== '|' && c !== '@').join('').trim().slice(0, max); }
function textInput(title, def = '', max = 12, hint = '') {
  return new Promise(res => {
    OVB.innerHTML = `<h2></h2>${hint ? '<p></p>' : ''}<input id="ti" maxlength="${max}" autocomplete="off" autocapitalize="words" spellcheck="false"><div class="row"><button class="ob pri" id="tok">Confirmar</button></div>`;
    OVB.querySelector('h2').textContent = title; if (hint) OVB.querySelector('p').textContent = hint;
    const inp = OVB.querySelector('#ti'); inp.value = def; OV.hidden = false;
    setTimeout(() => { inp.focus(); inp.select(); }, 50);
    const done = () => { const v = cleanName(inp.value, max) || def; OV.hidden = true; for (const k in KEYS) KEYS[k] = false; sfx('select'); res(v); };
    OVB.querySelector('#tok').onclick = done;
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); done(); } };
  });
}
const nameInput = () => textInput('Qual é o seu nome?', 'Davi', 10, 'Até 10 letras. Pode ser o seu nome mesmo.');
