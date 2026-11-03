// ================= MOTOR =================
'use strict';
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
  return {
    name: 'Davi', species: 'caixote', lv: 1, xp: 0, hp: 30, mp: 12, st: { mhp: 30, mmp: 12, atk: 6, def: 2, mag: 4 },
    runes: [], rq: {}, spells: [], tech: [], items: {}, diff: 'desafio', flask: { n: 3, max: 3 }, flags: {}, gone: {}, map: 'despertar', x: 7, y: 6, dir: 'down', time: 0, battles: 0
  };
}
const spec = () => SPECIES[G.species];
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
function toggleMute() { unlockAudio(); setMuted(!AU.muted); document.getElementById('bs').textContent = AU.muted ? 'Mudo' : 'Som'; }
function setupTouch() {
  // direcional redondo: área de toque maior que o desenho, setores de 90° com margem (o dedo pode escorregar
  // para a diagonal sem trocar de direção) e vibração curta a cada troca
  const dp = document.getElementById('dpad'), dz = document.getElementById('dzone') || dp; let pid = null, cur = null;
  const ANG = { right: 0, down: 90, left: 180, up: -90 };
  const angDiff = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  const dirOf = e => {
    const r = dp.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), dist = Math.hypot(dx, dy);
    if (dist < (cur ? 8 : 14)) return cur && dist >= 8 ? cur : null;
    const a = Math.atan2(dy, dx) * 180 / Math.PI;
    if (cur && angDiff(a, ANG[cur]) < 45 + 14) return cur;
    let best = 'right', bd = 999; for (const k in ANG) { const d = angDiff(a, ANG[k]); if (d < bd) { bd = d; best = k; } } return best;
  };
  const setDir = d => {
    if (d === cur) return;
    for (const k of ['up', 'down', 'left', 'right']) { if (k === d) press(k); else release(k); }
    cur = d; dp.className = d ? 'on-' + d : '';
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
  cvs.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); if (V.scene === 'title' || UI.top()?.type === 'dialog' || BT.mode === 'text') { press('a'); setTimeout(() => release('a'), 60); } });
  addEventListener('contextmenu', e => e.preventDefault());
  document.getElementById('bs').textContent = AU.muted ? 'Mudo' : 'Som';
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
  me: { name: () => G.name, portrait: () => SP[spec().sp][Math.floor(FRAME / 6) % 2 ? 2 : 0], voice: () => sfx('blip', 560) },
  of: { name: () => 'Ofélia', portrait: () => SP.ofelia[0], voice: () => sfx('blipTri', 1050) },
  boss: { name: () => 'Guarda-Musgo', portrait: () => SP.boss[0], voice: () => sfx('blipLow', 95), fx: 'shake', col: '#d8f0b8' },
  hero: { name: () => '???', voice: () => sfx('blip', 760) },
  npc: { name: () => 'Voz', voice: () => sfx('blipTri', 1400) }
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
      if (V.scene === 'world' && WD.map && (WD.fy - WD.cy) > 128) y = 6;
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
const nameInput = () => textInput('[CATÁLOGO] Informe seu nome', 'Davi', 10, 'Até 10 letras. Pode ser o seu nome mesmo.');
function backupOverlay() {
  return new Promise(res => {
    const code = encodeSave();
    OVB.innerHTML = `<h2>Backup do save</h2><p>Copie este código e guarde num lugar seguro. Se o navegador apagar os dados, cole aqui para recuperar.</p>
      <textarea id="bc" readonly></textarea><div class="row"><button class="ob" id="bcp">Copiar</button></div>
      <p>Carregar um backup:</p><textarea id="bi" placeholder="Cole o código aqui"></textarea>
      <p id="msg"></p><div class="row"><button class="ob" id="bld">Carregar</button><button class="ob pri" id="bfc">Fechar</button></div>`;
    const bc = OVB.querySelector('#bc'), msg = OVB.querySelector('#msg'); bc.value = code; OV.hidden = false;
    OVB.querySelector('#bcp').onclick = () => { const sel = () => { bc.focus(); bc.select(); }; try { navigator.clipboard.writeText(code).then(() => msg.textContent = 'Copiado.', () => { sel(); msg.textContent = 'Texto selecionado. Copie manualmente.'; }); } catch (e) { sel(); msg.textContent = 'Texto selecionado. Copie manualmente.'; } };
    const close = v => { OV.hidden = true; for (const k in KEYS) KEYS[k] = false; res(v); };
    OVB.querySelector('#bfc').onclick = () => close(false);
    OVB.querySelector('#bld').onclick = () => {
      const d = decodeSave(OVB.querySelector('#bi').value.trim());
      if (!d) { msg.textContent = 'Código inválido. Confira se copiou tudo.'; return; }
      applySave(d); writeSave(); close(true);
    };
  });
}

// ---------- save ----------
// três espaços de save; o 1º usa a chave antiga, para os saves de antes continuarem valendo
const SAVE_KEYS = ['renasci_bau_v1', 'renasci_bau_v1_s2', 'renasci_bau_v1_s3'];
let SLOT = 0; try { SLOT = Math.min(2, Math.max(0, +(localStorage.getItem('rcb_slot') || 0))); } catch (e) { }
const SAVE_KEY = SAVE_KEYS[0];
function setSlot(i) { SLOT = i; try { localStorage.setItem('rcb_slot', String(i)); } catch (e) { } }
function chapterOf(d) { const f = (d && d.flags) || {}; return f.ch5open ? 5 : f.ch4open ? 4 : f.ch3open ? 3 : f.ch1done ? 2 : 1; }
function slotItems(mode) {
  return SAVE_KEYS.map((_, i) => { const d = readSave(i); return d ? { label: `${i + 1}. ${d.name || '???'}`, right: `Cap. ${chapterOf(d)}`, col: i === SLOT ? '#ffe066' : null } : { label: `${i + 1}. (vazio)`, right: '', disabled: mode === 'load' }; });
}
function slotDesc(i) { const d = readSave(i); if (!d) return 'Espaço livre.'; const sp = SPECIES[d.species]; return `${sp ? sp.name : '?'} nv ${d.lv} · ${MAPS[d.map] ? MAPS[d.map].name : ''} · Tempo ${fmtTime(d.time || 0)}`; }
async function pickSlot(title, mode) {
  while (true) {
    const r = await list({ title, x: 8, y: 8, w: 224, idx: SLOT, items: slotItems(mode), desc: slotDesc, allowDisabled: false });
    if (r < 0) return -1;
    if (mode === 'save' && r !== SLOT && readSave(r)) { const c = await choose(`* O espaço ${r + 1} já tem um save. Substituir?`, ['Substituir', 'Voltar'], 'n', 1); if (c !== 0) continue; }
    if (mode === 'new' && readSave(r)) { const c = await choose(`* O espaço ${r + 1} já tem um save. Ele será apagado no primeiro save do jogo novo. Usar mesmo assim?`, ['Usar este espaço', 'Voltar'], 'n', 1); if (c !== 0) continue; }
    return r;
  }
}
function snapshot() { return JSON.parse(JSON.stringify({ ...G, v: 1 })); }
function encodeSave() { return 'RCB1.' + btoa(unescape(encodeURIComponent(JSON.stringify(snapshot())))); }
function decodeSave(s) { try { if (!s.startsWith('RCB1.')) return null; const d = JSON.parse(decodeURIComponent(escape(atob(s.slice(5))))); return d && d.st && d.map ? d : null; } catch (e) { return null; } }
function writeSave() { try { localStorage.setItem(SAVE_KEYS[SLOT], JSON.stringify(snapshot())); localStorage.setItem('rcb_slot', String(SLOT)); return true; } catch (e) { return false; } }
function saveGame() { return writeSave(); }
function readSave(i = SLOT) { try { const s = localStorage.getItem(SAVE_KEYS[i]); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
const anySave = () => SAVE_KEYS.some((_, i) => readSave(i));
function applySave(d) {
  if (!d.flask) { const extra = ['c_p2', 'c_a1', 'c_t2'].filter(k => d.gone && d.gone[k]).length; d.flask = { n: 3 + extra, max: 3 + extra }; d.flags = d.flags || {}; }
  G = Object.assign(newState(), d); migrateRunes(d); loadMap(G.map, G.x, G.y, G.dir || 'down'); V.scene = 'world'; }

// ---------- mundo ----------
const WD = { trail: [], disg: false, land: 0, bump: 0, idle: 0, dust: [], map: null, id: null, w: 0, h: 0, x: 0, y: 0, fx: 0, fy: 0, dir: 'down', moving: 0, ents: [], cx: 0, cy: 0, step: 0, bumpCd: 0 };
const TILESETS = {};
function loadMap(id, tx, ty, dir) {
  const m = MAPS[id]; WD.map = m; WD.id = id; WD.w = m.rows[0].length; WD.h = m.rows.length;
  WD.x = tx; WD.y = ty; WD.fx = tx * TS; WD.fy = ty * TS; WD.moving = 0; if (dir) WD.dir = dir;
  if (!TILESETS[id]) { buildTiles(m.theme); TILESETS[id] = { ...TILE }; } Object.assign(TILE, TILESETS[id]);
  G.map = id; G.x = tx; G.y = ty;
  refreshEnts();
  V.scene = 'world';
  if (id === 'antessala') playMusic(G.flags.bossDone ? 'ending' : null); else playMusic(m.music);
  V.banner = { text: m.name, t: 150 };
  WD.trail = []; WD.lume = null; WD.disg = false;
}
function refreshEnts() {
  const m = WD.map;
  WD.ents = m.ents.filter(e => {
    if (e.kind === 'enemy' && G.gone[e.id]) return false;
    if (e.kind === 'boss' && G.flags.bossDone) return false;
    if (e.kind === 'patrol' && G.gone[e.id]) return false;
    if ((e.kind === 'boss3') && G.flags[e.done]) return false;
    if (e.kind === 'lume' && G.flags.lumeJoined) return false;
    if (e.kind === 'brida' && G.flags.bridaDone) return false;
    return true;
  }).map(e => ({ ...e, px: e.x * TS, py: e.y * TS, tx: e.x, ty: e.y, mv: 0, t: 60 + Math.random() * 90, stun: 0, dir: e.turn ? e.turn[0] : 'down', wp: 1, wait: 30, ti: 0 }));
}
const tileAt = (x, y) => (x < 0 || y < 0 || x >= WD.w || y >= WD.h) ? '#' : WD.map.rows[y][x];
function solidTile(c) { if (c === 'G') return !G.flags.gateOpen; return '#~Bcxr TKNPDHJY'.includes(c); }
function entAt(x, y, ignoreEnemies) {
  return WD.ents.find(e => {
    if (e.kind === 'enemy' || e.kind === 'patrol') return !ignoreEnemies && e.tx === x && e.ty === y;
    if (e.kind === 'door') return !G.flags[e.cond] && e.x === x && e.y === y;
    if (e.kind === 'seal') return !G.flags[e.flag] && e.x === x && e.y === y;
    if (e.kind === 'page' || e.kind === 'pickup') return !G.flags[e.id] && e.x === x && e.y === y;
    if (e.kind === 'npc2' && e.cond && !G.flags[e.cond]) return false;
    if (e.kind === 'npc2' && e.hide && G.flags[e.hide]) return false;
    if (e.kind === 'boss' || e.kind === 'brida') return (e.x === x || e.x + 1 === x) && e.y === y;
    return e.x === x && e.y === y;
  });
}
function passable(x, y, forEnemy) {
  if (!forEnemy && WD.ents.some(e => e.kind === 'seal' && e.bridge && G.flags[e.flag] && e.x === x && e.y === y)) return true;
  if (solidTile(tileAt(x, y))) return false;
  if (forEnemy && WD.map.exits.some(ex => ex.x === x && ex.y === y)) return false;
  const e = entAt(x, y, !forEnemy); if (e && (forEnemy || e.kind !== 'enemy')) return false;
  return true;
}
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
function worldBlocked() { return V.busy > 0 || UI.stack.length > 0 || V.tw; }
function runScript(fn) { V.busy++; return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => { V.busy = Math.max(0, V.busy - 1); }); }

function updateWorld() {
  if (V.banner && V.banner.t > 0) V.banner.t--;
  if (WD.bumpCd > 0) WD.bumpCd--;
  if (WD.land > 0) WD.land--; if (WD.bump > 0) WD.bump--;
  for (const d of WD.dust) { d.x += d.vx; d.y += d.vy; d.t--; } WD.dust = WD.dust.filter(d => d.t > 0);
  if (WD.moving > 0 || worldBlocked() || KEYS.up || KEYS.down || KEYS.left || KEYS.right || KEYS.a) { if (WD.idle > 400) WD.wake = 24; WD.idle = 0; } else WD.idle++;
  if (WD.wake > 0) WD.wake--;
  const blocked = worldBlocked();
  // movimento do jogador
  if (WD.moving > 0) {
    const [dx, dy] = DIRS[WD.dir]; WD.fx += dx * 2; WD.fy += dy * 2; WD.moving -= 2;
    if (WD.moving <= 0) {
      WD.fx = WD.x * TS; WD.fy = WD.y * TS; G.x = WD.x; G.y = WD.y; G.dir = WD.dir; WD.land = 6;
      for (const s_ of [-1, 1]) WD.dust.push({ x: WD.fx + 8 + s_ * 5, y: WD.fy + 14, vx: s_ * rand(0.3, 0.6), vy: -rand(0.05, 0.2), t: 16 });
      onStep();
    }
  } else if (!blocked) {
    let d = null; for (const k of ['up', 'down', 'left', 'right']) if (KEYS[k]) { d = k; break; }
    if (btnp('b') && G.flags.canDisguise) { WD.disg = !WD.disg; sfx(WD.disg ? 'guard' : 'move'); WD.land = 6; for (let i = 0; i < 6; i++) WD.dust.push({ x: WD.fx + 8 + rand(-7, 7), y: WD.fy + rand(4, 14), vx: rand(-0.5, 0.5), vy: -rand(0.1, 0.4), t: 18 }); }
    if (d && WD.disg) { WD.disg = false; WD.land = 4; }
    if (d) {
      WD.dir = d; const [dx, dy] = DIRS[d], nx = WD.x + dx, ny = WD.y + dy;
      if (passable(nx, ny, false)) { WD.x = nx; WD.y = ny; WD.moving = TS; if ((WD.step++) % 2 === 0) sfx('step'); }
      else if (WD.bump <= 0 && tileAt(nx, ny) !== 'G') { WD.bump = 10; sfx('bump'); }
      else if (tileAt(nx, ny) === 'G' && !G.flags.gateOpen && WD.bumpCd === 0) { WD.bumpCd = 90; runScript(STORY.gate); }
    }
    if (btnp('a')) interact();
    else if (btnp('menu')) runScript(pauseMenu);
  }
  // inimigos
  if (!blocked) for (const e of WD.ents) {
    if (e.kind !== 'enemy') continue;
    if (e.stun > 0) e.stun--;
    if (e.mv > 0) {
      e.px += Math.sign(e.tx * TS - e.px); e.py += Math.sign(e.ty * TS - e.py); e.mv--;
    } else if (--e.t <= 0) {
      e.t = 50 + Math.random() * 80;
      const dist = Math.abs(e.tx - WD.x) + Math.abs(e.ty - WD.y);
      let opts = Object.keys(DIRS);
      if (dist < 6 && e.stun === 0 && Math.random() < 0.65) {
        const ddx = WD.x - e.tx, ddy = WD.y - e.ty;
        opts = Math.abs(ddx) > Math.abs(ddy) ? [ddx > 0 ? 'right' : 'left', ddy > 0 ? 'down' : 'up'] : [ddy > 0 ? 'down' : 'up', ddx > 0 ? 'right' : 'left'];
        e.t = 28 + Math.random() * 20;
      } else opts = [pickOne(opts)];
      for (const d of opts) {
        const [dx, dy] = DIRS[d], nx = e.tx + dx, ny = e.ty + dy;
        if (Math.abs(nx - e.x) > 4 || Math.abs(ny - e.y) > 4) continue;
        if (!passable(nx, ny, true) || WD.ents.some(o => o !== e && o.kind === 'enemy' && o.tx === nx && o.ty === ny)) continue;
        e.tx = nx; e.ty = ny; e.mv = TS; e.face = dx || e.face; break;
      }
    }
    if (e.stun === 0 && !blocked && Math.abs(e.px - WD.fx) < 12 && Math.abs(e.py - WD.fy) < 12) { runScript(() => encounter(e)); break; }
  }
  if (!blocked) updatePatrols();
  // seguidora
  if (G.flags.lumeJoined) { const tgt = WD.trail.length > 10 ? WD.trail[WD.trail.length - 10] : [WD.fx, WD.fy]; WD.lume = WD.lume || [WD.fx, WD.fy]; WD.lume[0] += (tgt[0] - WD.lume[0]) * 0.2; WD.lume[1] += (tgt[1] - WD.lume[1]) * 0.2; }
  if (WD.moving > 0) { WD.trail.push([WD.fx, WD.fy]); if (WD.trail.length > 40) WD.trail.shift(); }
  // câmera
  const mw = WD.w * TS, mh = WD.h * TS;
  WD.cx = mw <= W ? -(W - mw) / 2 : clamp(WD.fx + 8 - W / 2, 0, mw - W);
  WD.cy = mh <= H ? -(H - mh) / 2 : clamp(WD.fy + 8 - H / 2, 0, mh - H);
}
function onStep() {
  const ex = WD.map.exits.find(e => e.x === WD.x && e.y === WD.y && (!e.cond || G.flags[e.cond]));
  if (ex) { runScript(async () => { await fadeOut(10); loadMap(ex.to, ex.tx, ex.ty); await fadeIn(10); await onEnter(ex.to); }); return; }
  if (WD.id === 'antessala' && !G.flags.bossDone && WD.y <= 7) { runScript(STORY.bossIntro); return; }
  if (WD.id === 'teatro' && !G.flags.octoDone && WD.y <= 5) { runScript(async () => { await STORY.octo(); await checkEvo(); }); return; }
  if (WD.id === 'ponte' && !G.flags.bridaDone && WD.y >= 18) { runScript(STORY.brida); return; }
  if (WD.id === 'ponte' && G.flags.ch2done && !G.flags.ch3open && WD.y >= 18 && STORY.ch3start) { runScript(STORY.ch3start); return; }
  if (STORY.onStep3 && STORY.onStep3()) return;
  if (tileAt(WD.x, WD.y) === '^') { runScript(async () => { await STORY.stairs(); WD.y++; WD.fy = WD.y * TS; G.y = WD.y; WD.dir = 'down'; }); }
}
async function onEnter(id) {
  const firsts = { patamar: 'patamarFirst', mercado: 'mercadoFirst', acampamento: 'acampFirst', teatro: 'teatroFirst', ponte: 'ponteFirst' };
  if (firsts[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[firsts[id]](); }
  if (id === 'galeria' && !G.flags.galeriaSeen) { G.flags.galeriaSeen = true; await STORY.galeriaFirst(); }
  if (id === 'poco' && !G.flags.pocoSeen) { G.flags.pocoSeen = true; await STORY.poçoFirst(); }
  if (id === 'galeria' && G.flags.gateOpen && !G.flags.gateAnim) {
    G.flags.gateAnim = true; await wait(20); sfx('gate'); shake(30);
    await say('* Ao norte, o Portão de Musgo range e se abre sozinho.');
  }
}
function interact() {
  const [dx, dy] = DIRS[WD.dir], x = WD.x + dx, y = WD.y + dy;
  const e = entAt(x, y, false);
  if (e) {
    if (e.kind === 'npc') return runScript(STORY.ofelia);
    if (e.kind === 'save') return runScript(lantern);
    if (e.kind === 'rune') return runScript(() => absorbRune(e));
    if (e.kind === 'chest') return runScript(() => openChest(e));
    if (e.kind === 'boss') return runScript(STORY.bossIntro);
    if (e.kind === 'enemy' || e.kind === 'patrol') return runScript(() => encounter(e));
    if (e.kind === 'door') return runScript(() => STORY.doorMsg(e));
    if (e.kind === 'keychest') return runScript(() => STORY.keyChest(e));
    if (e.kind === 'lume') return runScript(async () => { await STORY.octo(); await checkEvo(); });
    if (e.kind === 'brida') return runScript(STORY.brida);
    if (e.kind === 'seal') return runScript(() => useSeal(e));
    if (e.kind === 'page') return runScript(() => readPage(e));
    if (e.kind === 'pickup') return runScript(() => STORY[e.script](e));
    if (e.kind === 'npc2') return runScript(() => STORY[e.talk](e));
    if (e.kind === 'boss3') return runScript(() => STORY[e.script](e));
  }
  const c = tileAt(x, y);
  if (c === 'G') return runScript(STORY.gate);
  if (c === 'H' && G.flags.ch2done && !G.flags.ch3open && STORY.ch3start) return runScript(STORY.ch3start);
  const lines = lookLines(c); if (lines) runScript(() => say(lines[(x * 7 + y * 3) % lines.length]));
}
async function lantern() {
  await say('* Uma Lanterna de Âmbar. A luz é morna como cozinha em dia de chuva.');
  if (!G.flags.flaskTut) {
    G.flags.flaskTut = true; sfx('catalog');
    await say('[Você recebeu o {y}FRASCO DE ÂMBAR{/}. Cada gole cura parte dos PV e PM, dentro ou fora da batalha.]', 'cat');
    await say('[As Lanternas não curam. Elas guardam sua história e enchem o frasco de novo.]', 'cat');
    await say('[Procure {y}Fragmentos de Âmbar{/} em baús escondidos para aumentar o frasco.]', 'cat');
  }
  G.flask.n = G.flask.max; sfx('heal');
  const respawn = Object.keys(G.gone).some(k => k.startsWith('e_'));
  for (const k of Object.keys(G.gone)) if (k.startsWith('e_')) delete G.gone[k];
  refreshEnts();
  await say(`* O Frasco de Âmbar se enche de luz. (${G.flask.n}/${G.flask.max} goles)`);
  while (true) {
    const c = await choose('* A Lanterna espera. O que você faz?', ['Salvar o jogo', 'Fundir runas', 'Seguir viagem'], 'n', 2);
    if (c === 1) { await fuseMenu(); continue; }
    if (c === 0) {
      const k = await pickSlot('Salvar em qual espaço?', 'save'); if (k < 0) continue;
      setSlot(k);
      if (saveGame()) { sfx('save'); await say(`[Registro atualizado no espaço ${k + 1}.]`, 'cat'); } else await say('* Não foi possível salvar neste navegador. Use o Backup no MENU.');
    }
    break;
  }
  if (respawn) await say('* Ao longe, monstros da masmorra se espreguiçam e acordam.');
}
async function absorbRune(e) {
  if (G.gone[e.id]) { await say('* O pedestal está vazio agora. Só sobrou o cheiro de tinta.'); return; }
  await say('* Uma pedra coberta de símbolos flutua sobre o pedestal.');
  await say('* Você abre a tampa e...| {y}NHAC{/}.');
  G.gone[e.id] = true;
  await giveRune(e.rune, false, e.n);
}
// ---------- runas consumíveis e raridade (v1.6) ----------
const RARITY = {
  comum: { name: 'Comum', col: '#d8d0e4', n: 2 }, incomum: { name: 'Incomum', col: '#8ad06a', n: 2 },
  rara: { name: 'Rara', col: '#6ab0ff', n: 1 }, epica: { name: 'Épica', col: '#e08aff', n: 1 }
};
const RAR_ORDER = ['comum', 'incomum', 'rara', 'epica'];
const RUNE_RAR = { brasa: 'comum', geada: 'comum', seiva: 'comum', dardo: 'comum', onda: 'incomum', veu: 'incomum', faisca: 'incomum', vento: 'incomum', corrente: 'rara', eco: 'rara', selo: 'rara', sombra: 'rara', dreno: 'rara', foco: 'epica' };
// dificuldade de cada área (1 a 9): decide a raridade dos drops
const MAP_D = { despertar: 1, galeria: 1, biblioteca: 2, poco: 3, antessala: 3, patamar: 4, mercado: 4, acampamento: 5, teatro: 6, ponte: 6, escadaria3: 7, muralhas: 7, patio: 8, jaula: 8, scriptorium: 9 };
function rar(id) { return RUNES[id].rar || RUNE_RAR[id] || 'comum'; }
function rq(id) { return (G.rq && G.rq[id]) || 0; }
function addRune(id, n = 1) { if (!G.rq) G.rq = {}; G.rq[id] = rq(id) + n; if (!G.runes.includes(id)) G.runes.push(id); }
function useRune(id) { G.rq[id] = Math.max(0, rq(id) - 1); }
function runeTotal() { return G.runes.reduce((a, r) => a + rq(r), 0); }
function rarTag(id) { const k = RARITY[rar(id)]; return `{${k.col}}${k.name}{/}`; }
async function giveRune(id, quiet, n) {
  const r = RUNES[id], isNew = !G.runes.includes(id); n = n || RARITY[rar(id)].n;
  addRune(id, n); sfx('rune');
  if (isNew) await say(`* Runa absorvida: {${r.col}}${r.name.toUpperCase()}{/} ×${n} (${TYPE_LABEL[r.type]}, ${rarTag(id)}).\n* ${r.desc}`);
  else if (!quiet) await say(`* Runa {${r.col}}${r.name}{/} ×${n} (${rarTag(id)}). Agora você tem ${rq(id)}.`);
}
function pickRuneOf(k) { const ks = G.runes.filter(r => rar(r) === k); return ks.length ? pickOne(ks) : null; }
function rollRune(d, boss) {
  const w = boss ? { comum: 0, incomum: d < 6 ? 4 : 0, rara: d >= 6 ? 4 : d >= 3 ? 1 : 0, epica: d >= 8 ? 1 : 0 } : { comum: 10, incomum: d >= 3 ? d : 0, rara: d >= 6 ? (d - 5) * 1.5 : 0, epica: 0 };
  let tot = 0; for (const k in w) tot += w[k]; let x = Math.random() * tot, k = 'comum';
  for (const kk of RAR_ORDER) { if (x < w[kk]) { k = kk; break; } x -= w[kk]; }
  for (let i = RAR_ORDER.indexOf(k); i >= 0; i--) { const id = pickRuneOf(RAR_ORDER[i]); if (id) return id; }
  return null;
}
function runeDrops() {
  const d = MAP_D[WD.id] || 6, out = [], boss = BT.en.some(e => e.d.boss);
  if (boss) { const a = rollRune(d, true), b = rollRune(d); if (a) out.push(a); if (b) out.push(b); }
  else if (Math.random() < 0.12 + 0.02 * d + 0.05 * (BT.en.length - 1) + (BT.en.some(e => e.d.elite) ? 0.05 : 0)) { const a = rollRune(d); if (a) out.push(a); }
  out.forEach(id => addRune(id, 1));
  return out;
}
async function fuseMenu() {
  if (!G.flags.tut_fuse) {
    G.flags.tut_fuse = true; sfx('catalog');
    await say('[FUSÃO RÚNICA: o âmbar da Lanterna derrete runas e molda outras.]', 'cat');
    await say('[TROCAR: 2 runas da mesma raridade viram 1 runa que você já conhece, da mesma raridade.]', 'cat');
    await say('[ELEVAR: 3 runas da mesma raridade viram 1 runa conhecida da raridade de cima.]', 'cat');
  }
  while (true) {
    const m = await list({ title: 'Fundir runas', x: 8, y: 8, w: 224, items: [{ label: 'Trocar', right: '2 → 1' }, { label: 'Elevar', right: '3 → 1 acima' }],
      desc: i => i === 0 ? 'Gaste 2 runas da mesma raridade e escolha 1 runa conhecida dessa raridade.' : 'Gaste 3 runas da mesma raridade e escolha 1 runa conhecida da raridade seguinte.' });
    if (m < 0) return;
    const need = m === 0 ? 2 : 3;
    const opts = RAR_ORDER.filter((k, i) => m === 0 || i < 3).map(k => {
      const target = m === 0 ? k : RAR_ORDER[RAR_ORDER.indexOf(k) + 1];
      const have = G.runes.filter(r => rar(r) === k).reduce((a, r) => a + rq(r), 0);
      return { k, target, have, outs: G.runes.filter(r => rar(r) === target) };
    });
    const ri = await list({ title: m === 0 ? 'Trocar qual raridade?' : 'Elevar qual raridade?', x: 8, y: 8, w: 224,
      items: opts.map(o => ({ label: RARITY[o.k].name + (m === 1 ? ' → ' + RARITY[o.target].name : ''), col: RARITY[o.k].col, right: `${o.have} runas`, disabled: o.have < need || !o.outs.length })),
      desc: i => { const o = opts[i]; return !o.outs.length ? `Você ainda não conhece nenhuma runa ${RARITY[o.target].name.toLowerCase()}.` : o.have < need ? `Precisa de ${need} runas ${RARITY[o.k].name.toLowerCase()}s.` : `Gasta ${need} runas ${RARITY[o.k].name.toLowerCase()}s. Resultado: 1 runa ${RARITY[o.target].name.toLowerCase()}.`; } });
    if (ri < 0) continue;
    const o = opts[ri], pool = {}, used = [];
    G.runes.forEach(r => { if (rar(r) === o.k) pool[r] = rq(r); });
    let ok = true;
    for (let j = 0; j < need; j++) {
      const ks = Object.keys(pool);
      const pi = await list({ title: `Ingrediente ${j + 1}/${need}`, x: 8, y: 8, w: 224, idx: Math.max(0, ks.findIndex(r => pool[r] > 0)), items: ks.map(r => ({ label: RUNES[r].name, col: RUNES[r].col, right: '×' + pool[r], disabled: !pool[r] })), desc: i => RUNES[ks[i]].desc });
      if (pi < 0) { ok = false; break; }
      pool[ks[pi]]--; used.push(ks[pi]);
    }
    if (!ok) continue;
    const oi = await list({ title: 'Moldar qual runa?', x: 8, y: 8, w: 224, items: o.outs.map(r => ({ label: RUNES[r].name, col: RUNES[r].col, right: `tem ${rq(r)}` })), desc: i => `${TYPE_LABEL[RUNES[o.outs[i]].type]} · ${RARITY[o.target].name}. ${RUNES[o.outs[i]].desc}` });
    if (oi < 0) continue;
    used.forEach(useRune); addRune(o.outs[oi], 1); sfx('rune'); J.level();
    await say(`* O âmbar borbulha e engole ${used.map(r => RUNES[r].name).join(', ')}.\n* Sobra uma runa nova: {${RUNES[o.outs[oi]].col}}${RUNES[o.outs[oi]].name}{/}! (agora ${rq(o.outs[oi])})`);
  }
}
function migrateRunes(d) {
  if (d && d.rq) return;
  G.rq = {}; G.runes.forEach(r => G.rq[r] = 1);
  for (const k in MAPS) for (const e of MAPS[k].ents) if (e.kind === 'rune' && G.runes.includes(e.rune)) G.gone[e.id] = true;
}
async function openChest(e) {
  if (G.gone[e.id]) { await say('* Um baú comum, aberto e vazio. Você fica com pena dele.'); return; }
  await say('* Um baú comum. Não se mexe. Não respira. É só... um baú.');
  G.gone[e.id] = true; sfx('item');
  if (e.rune) { await say('* Dentro tinha uma pedra rúnica. Você abre a tampa e...| {y}NHAC{/}.'); await giveRune(e.rune, false, e.n || 1); return; }
  if (e.item === 'frag') { G.flask.max++; G.flask.n++; J.level(); await say(`* Dentro tinha: {y}Fragmento de Âmbar{/}!\n* O frasco agora tem ${G.flask.max} goles.`); return; }
  giveItem(e.item, e.n);
  await say(`* Dentro tinha: {y}${ITEMS[e.item].name}{/} ×${e.n}.`);
}
function giveItem(k, n = 1) { G.items[k] = (G.items[k] || 0) + n; }
async function encounter(e) {
  if (!WD.ents.includes(e)) return;
  const r = await battle(e.group);
  if (r === 'win') { G.gone[e.id] = true; refreshEnts(); }
  else if (r === 'flee') { e.stun = e.kind === 'patrol' ? 300 : 180; }
  if (r === 'win') await checkEvo();
}
async function checkEvo() {
  if (spec().evos && G.lv >= spec().evoLv) { if (G.species === 'caixote') await STORY.evolve(); else if (spec().tier === 2) await STORY.evolve2(); else await STORY.evolve3(); }
}

// ---------- render do mundo ----------
function tileCanvasFor(c, x, y) {
  switch (c) {
    case '#': { const b = tileAt(x, y + 1); if (b !== '#') return TILE.face; const b2 = tileAt(x, y + 2); return (y + 2 < WD.h && b2 !== '#') ? TILE.topEdge : TILE.top; }
    case '.': return TILE['.' + (hash(x, y) % 4)];
    case ',': return TILE[',' + (hash(x, y, 2) % 2)];
    case '~': return TILE['~' + (Math.floor(FRAME / 30 + (x + y) * 0.5) % 2)];
    case 'G': return G.flags.gateOpen ? TILE.Gopen : TILE.G;
    case ' ': return null;
    default: return TILE[c] || TILE['.0'];
  }
}
function drawWorld() {
  bx.fillStyle = '#000'; bx.fillRect(0, 0, W, H);
  const ox = Math.floor(WD.cx), oy = Math.floor(WD.cy);
  const x0 = Math.floor(ox / TS) - 1, y0 = Math.floor(oy / TS) - 1;
  const lights = [];
  for (let ty = y0; ty < y0 + 17; ty++) for (let tx = x0; tx < x0 + 17; tx++) {
    if (tx < 0 || ty < 0 || tx >= WD.w || ty >= WD.h) continue;
    const c = WD.map.rows[ty][tx], t = tileCanvasFor(c, tx, ty); if (!t) continue;
    const sx = tx * TS - ox, sy = ty * TS - oy;
    bx.drawImage(t, sx, sy);
    if (c === 'c') { const f = (FRAME >> 3) + tx * 3 & 3; bx.fillStyle = f === 0 ? '#ffd060' : '#ff9a30'; bx.fillRect(sx + 7, sy + 4, 2, 3); bx.fillStyle = '#fff4c0'; bx.fillRect(sx + 7 + (f === 2 ? 1 : 0), sy + 5, 1, 1); lights.push([sx + 8, sy + 5, 34 + (f & 1) * 3, 'rgba(255,170,80,0.18)']); }
    if (c === 'g') lights.push([sx + 8, sy + 8, 20, 'rgba(120,220,255,0.14)']);
  }
  drawPatrolVision(ox, oy);
  // entidades (ordenadas por y)
  const list_ = [...WD.ents, { kind: 'player', px: WD.fx, py: WD.fy }].sort((a, b) => a.py - b.py);
  for (const e of list_) {
    const sx = Math.round(e.px - ox), sy = Math.round(e.py - oy);
    if (sx < -40 || sy < -40 || sx > W + 40 || sy > H + 40) continue;
    switch (e.kind) {
      case 'player': {
        const set = SPD[spec().sp][WD.dir];
        const prog = WD.moving > 0 ? 1 - WD.moving / TS : 0, hop = Math.sin(prog * Math.PI);
        let fr = set[0], w = 16, h = 16, lift = 0, ox = 0;
        const side = WD.dir === 'left' || WD.dir === 'right';
        if (WD.moving > 0 && side) {
          lift = Math.round(hop * 2); fr = set[3 + (Math.floor((TS - WD.moving) / 4) % 2)];
          if (hop > 0.85) fr = set[5];
        } else if (WD.moving > 0) {
          lift = Math.round(hop * 5); fr = hop > 0.55 ? set[2] : set[0];
          if (prog < 0.2) { w = 14; h = 18; } else if (hop > 0.55) { w = 15; h = 17; }
        } else if (WD.land > 0) { w = 18 + (WD.land > 3 ? 1 : 0); h = 14 - (WD.land > 3 ? 1 : 0); }
        else if (WD.bump > 0) { const [bdx, bdy] = DIRS[WD.dir]; ox = bdx * (WD.bump > 5 ? 1 : 0); if (bdx) { w = 14; h = 17; } else { w = 18; h = 14; } fr = set[1]; }
        else if (WD.idle > 420) { fr = set[1]; h = (FRAME % 90 < 45) ? 15 : 16; w = 16 + (16 - h); }
        else {
          if (FRAME % 220 < 8) fr = set[1];
          if (WD.idle > 150 && WD.idle % 160 > 130) fr = set[2];
          if (FRAME % 70 < 35) { h = 15; w = 17; }
        }
        if (WD.wake > 0) { fr = set[2]; h = 18 - (WD.wake > 12 ? 0 : 1); w = 14; lift = WD.wake > 12 ? 3 : 1; }
        for (const d of WD.dust) { bx.fillStyle = d.t > 8 ? '#6a6080' : '#4a4060'; const z = d.t > 8 ? 2 : 1; bx.fillRect(Math.round(d.x - ox_(WD.cx)), Math.round(d.y - oy_(WD.cy)), z, z); }
        const shw = 12 - Math.round(hop * 4);
        bx.fillStyle = 'rgba(0,0,0,0.35)'; bx.fillRect(sx + 8 - shw / 2, sy + 14, shw, 2);
        if (WD.disg) { bx.drawImage(SP.chest[0], sx + Math.round((16 - w) / 2), sy + 16 - h, w, h); if (FRAME % 90 < 6) { bx.fillStyle = '#f0c040'; bx.fillRect(sx + 6, sy + 9, 1, 1); bx.fillRect(sx + 9, sy + 9, 1, 1); } }
        else bx.drawImage(fr, sx + Math.round((16 - w) / 2) + ox, sy + 15 - h + 1 - lift, w, h);
        if (WD.idle > 420) { const zt = (FRAME % 120) / 120; txt('z', (sx + 13 + zt * 6), sy - 4 - zt * 12, { col: '#b8aecb', alpha: 1 - zt }); if (FRAME % 120 > 60) txt('z', sx + 10 + (zt - .5) * 6, sy - 2 - (zt - .5) * 12, { col: '#8a8099', alpha: 1.5 - zt }); }
        lights.push([sx + 8, sy + 8, 70, null]);
        if (G.species === 'arcano') lights.push([sx + 8, sy + 8, 26, 'rgba(120,220,255,0.12)']);
        break;
      }
      case 'enemy': {
        const def = ENEMIES[e.group[0]], sp = SP[def.sp], fr = Math.floor(FRAME / 16 + e.x) % 2;
        if (e.stun > 0 && FRAME % 8 < 4) break;
        let fly = def.sp === 'bat' ? Math.round(Math.sin(FRAME * 0.1 + e.x) * 2) - 3 : 0;
        const ep = e.mv > 0 ? 1 - e.mv / TS : 0, eh = Math.sin(ep * Math.PI);
        let ew = 16, ehh = 16, efr = fr;
        if (def.sp === 'bat') { efr = e.mv > 0 ? Math.floor(FRAME / 5) % 2 : fr; bx.fillStyle = 'rgba(0,0,0,0.35)'; bx.fillRect(sx + 4, sy + 13, 8, 2); }
        else if (def.sp === 'rat') { efr = e.mv > 0 ? Math.floor(FRAME / 4) % 2 : fr; if (e.mv > 0) fly = -(Math.floor(FRAME / 3) % 2); }
        else if (def.sp === 'mush') { if (e.mv > 0) { fly = -Math.round(eh * 4); ehh = 16 + Math.round(eh * 2); ew = 16 - Math.round(eh * 2); } else { ehh = 16 - (FRAME % 50 < 25 ? 1 : 0); ew = 16 + (16 - ehh); } }
        else if (def.sp === 'slime') { if (e.mv > 0) { ew = 16 + Math.round(eh * 5); ehh = 16 - Math.round(eh * 4); } else { ehh = 16 - (FRAME % 40 < 20 ? 1 : 0); ew = 16 + (16 - ehh) * 2; } }
        const ex_ = sx + Math.round((16 - ew) / 2), ey_ = sy + 16 - ehh + fly;
        if (e.face > 0 && def.sp === 'rat') { bx.save(); bx.translate(ex_ + ew, ey_); bx.scale(-1, 1); bx.drawImage(sp[efr], 0, 0, ew, ehh); bx.restore(); }
        else bx.drawImage(sp[efr], ex_, ey_, ew, ehh);
        if (e.mv === 1 && def.sp === 'mush') for (const s_ of [-1, 1]) WD.dust.push({ x: e.px + 8 + s_ * 5, y: e.py + 14, vx: s_ * 0.4, vy: -0.1, t: 12 });
        if (e.group.length > 1) { bx.fillStyle = '#ffe066'; bx.fillRect(sx + 13, sy - 1 + fly, 2, 2); }
        if (def.sp === 'rat') lights.push([sx + 12, sy + 2, 22, 'rgba(255,170,80,0.15)']);
        break;
      }
      case 'npc': {
        const fl = Math.round(Math.sin(FRAME * 0.05) * 2);
        bx.globalAlpha = 0.88; bx.drawImage(SP.ofelia[0], sx, sy - 4 + fl); bx.globalAlpha = 1;
        lights.push([sx + 8, sy + 6, 44, 'rgba(190,160,255,0.16)']);
        break;
      }
      case 'save': { const f = (FRAME >> 4) % 2; bx.drawImage(SP.lantern[f], sx, sy); lights.push([sx + 8, sy + 5, 62 + f * 3, 'rgba(255,190,90,0.22)']); break; }
      case 'chest': bx.drawImage(SP.chest[G.gone[e.id] ? 1 : 0], sx, sy); break;
      case 'rune': {
        bx.drawImage(SP.pedestal[0], sx, sy);
        if (!G.gone[e.id]) {
          const col = RUNES[e.rune].col, fy = Math.round(Math.sin(FRAME * 0.08 + e.x) * 1.5);
          const cx_ = sx + 8, cy_ = sy + 4 + fy;
          bx.fillStyle = '#120e1a'; for (let i = -4; i <= 4; i++) { const w = 4 - Math.abs(i); bx.fillRect(cx_ - w - 1, cy_ + i, w * 2 + 2, 1); }
          bx.fillStyle = col; for (let i = -3; i <= 3; i++) { const w = 3 - Math.abs(i); bx.fillRect(cx_ - w, cy_ + i, w * 2, 1); }
          bx.fillStyle = '#ffffff'; bx.fillRect(cx_ - 1, cy_ - 1, 1, 1);
          lights.push([cx_, cy_, 30, hexA(col, 0.2)]);
        }
        break;
      }
      case 'patrol': {
        const sp = SP[e.sp], fr = e.mv > 0 ? Math.floor(FRAME / 6) % 2 : 0;
        const bob = e.mv > 0 ? -(Math.floor(FRAME / 6) % 2) : 0;
        bx.fillStyle = 'rgba(0,0,0,0.3)'; bx.fillRect(sx + 3, sy + 14, 10, 2);
        if (e.dir === 'left') { bx.save(); bx.translate(sx + 16, sy + bob); bx.scale(-1, 1); bx.drawImage(sp[fr], 0, 0); bx.restore(); } else bx.drawImage(sp[fr], sx, sy + bob);
        if (e.alert) txt('!', sx + 6, sy - 12, { col: '#ff6b6b', shadow: true });
        else if (e.stun > 0) txt('?', sx + 6, sy - 12, { col: '#b8aecb', shadow: true });
        else if (e.bubble && e.bubble.t > 0) txt(e.bubble.s, sx + 8, sy - 12, { align: 'center', col: '#ffffff', shadow: true });
        lights.push([sx + 8, sy + 8, 30, null]);
        break;
      }
      case 'door': {
        if (G.flags[e.cond]) break;
        bx.drawImage(SP.door[e.dark ? 1 : 0], sx, sy); break;
      }
      case 'keychest': bx.drawImage(SP.chest[G.flags.teatroKey ? 1 : 0], sx, sy); if (!G.flags.teatroKey) lights.push([sx + 8, sy + 8, 24, 'rgba(255,224,102,0.18)']); break;
      case 'lume': {
        const sw = Math.round(Math.sin(FRAME * 0.04) * 2);
        bx.fillStyle = '#5a5070'; bx.fillRect(sx + 7 + sw, sy - 16, 2, 16);
        bx.drawImage(SP.lume[Math.floor(FRAME / 20) % 2], sx + sw, sy);
        lights.push([sx + 8, sy + 8, 46, 'rgba(255,220,140,0.2)']);
        if (!G.flags.octoDone) { const f = Math.floor(FRAME / 24) % 2; bx.drawImage(SP.octo[f], sx - 8, sy + 22 + Math.round(Math.sin(FRAME * 0.05) * 2), 32, 32); }
        break;
      }
      case 'seal': drawSeal(e, sx, sy, lights); break;
      case 'page': if (!G.flags[e.id]) { const fy = Math.round(Math.sin(FRAME * 0.1 + e.x) * 1.5); bx.fillStyle = '#120e1a'; bx.fillRect(sx + 4, sy + 3 + fy, 9, 11); bx.fillStyle = '#e8dcc0'; bx.fillRect(sx + 5, sy + 4 + fy, 7, 9); bx.fillStyle = '#5a4a6a'; for (let k = 0; k < 4; k++) bx.fillRect(sx + 6, sy + 6 + k * 2 + fy, 5, 1); lights.push([sx + 8, sy + 8, 22, 'rgba(255,240,200,0.18)']); } break;
      case 'pickup': if (!G.flags[e.id]) { bx.drawImage(SP.chest[0], sx, sy); lights.push([sx + 8, sy + 8, 22, 'rgba(255,224,102,0.18)']); } break;
      case 'npc2': { if (e.cond && !G.flags[e.cond]) break; if (e.hide && G.flags[e.hide]) break; const sp = SP[e.sp]; const fl = e.float ? Math.round(Math.sin(FRAME * 0.06) * 2) : 0; if (e.flip) { bx.save(); bx.translate(sx + 16, sy + fl); bx.scale(-1, 1); bx.drawImage(sp[Math.floor(FRAME / 30) % sp.length], 0, 0); bx.restore(); } else bx.drawImage(sp[Math.floor(FRAME / 30) % sp.length], sx, sy + fl); if (e.glow) lights.push([sx + 8, sy + 8, 36, e.glow]); break; }
      case 'boss3': { const sp = SP[e.sp]; const f = Math.floor(FRAME / 30) % sp.length; const big = sp[0].width > 16; bx.drawImage(sp[f], big ? sx - 8 : sx, big ? sy - 16 : sy); if (e.glow) lights.push([sx + 8, sy + 4, 40, e.glow]); break; }
      case 'brida': {
        const f = Math.floor(FRAME / 30) % 2;
        bx.drawImage(SP.brida[f], sx, sy); bx.drawImage(SP.hound[f], sx + 16, sy + 2);
        lights.push([sx + 16, sy + 8, 40, 'rgba(255,120,120,0.12)']);
        break;
      }
      case 'boss': {
        const f = Math.floor(FRAME / 30) % 2;
        bx.drawImage(SP.boss[f], sx - 8, sy - 16);
        lights.push([sx + 8, sy - 2, 34, 'rgba(200,255,140,0.12)']);
        break;
      }
    }
  }
  if (G.flags.lumeJoined && WD.lume) {
    const lxp = Math.round(WD.lume[0] - ox - 6), lyp = Math.round(WD.lume[1] - oy - 12 + Math.sin(FRAME * 0.08) * 2);
    const fade = G.flags.lumeFading && (FRAME % 97 < 9 || FRAME % 211 < 5);
    bx.globalAlpha = fade ? 0.25 : 1; bx.drawImage(SP.lume[Math.floor(FRAME / 20) % 2], lxp, lyp); bx.globalAlpha = 1;
    if (!fade) lights.push([lxp + 8, lyp + 8, WD.id === 'ponte' ? 92 : 56, 'rgba(255,220,140,0.16)']);
  }
  // luz
  const amb = WD.map.dark || 0;
  if (amb > 0) {
    lx.globalCompositeOperation = 'source-over'; lx.clearRect(0, 0, W, H);
    lx.fillStyle = `rgba(6,3,14,${amb})`; lx.fillRect(0, 0, W, H);
    lx.globalCompositeOperation = 'destination-out';
    for (const [x, y, r] of lights) { const g = lx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(0.55, 'rgba(0,0,0,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); lx.fillStyle = g; lx.fillRect(x - r, y - r, r * 2, r * 2); }
    bx.drawImage(lightC, 0, 0);
    bx.globalCompositeOperation = 'lighter';
    for (const [x, y, r, col] of lights) { if (!col) continue; const g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(x - r, y - r, r * 2, r * 2); }
    bx.globalCompositeOperation = 'source-over';
  }
  if (V.banner && V.banner.t > 0 && !UI.stack.length) {
    const a = Math.min(1, V.banner.t / 30, (150 - V.banner.t) / 15);
    const w = V.banner.text.length * 6 + 20;
    bx.globalAlpha = a; box(120 - w / 2, 10, w, 18, { bw: 1, edge: '#8a8099' }); bx.globalAlpha = 1;
    txt(V.banner.text, 120, 13, { align: 'center', col: '#ffe066', alpha: a });
  }
}
const ox_ = c => Math.floor(c), oy_ = c => Math.floor(c);
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }

// ---------- MENU / GRIMÓRIO ----------
function miniStatus() {
  // painel do MENU: tudo cabe na largura (nomes longos quebram em duas linhas)
  const x = 112, y = 8, nl = lineW(rich(spec().name), 1) > 104 ? 2 : 1, h = 134 + (nl - 1) * 12;
  box(x, y, 120, h, { bw: 1, edge: '#8a8099' });
  txt(spec().name, x + 8, y + 5, { col: '#ffe066', w: 17, lh: 12 });
  let yy = y + 5 + nl * 12 + 2; const line = (t, col) => { txt(t, x + 8, yy, { col }); yy += 14; };
  line(`Nível ${G.lv}`); line(`EXP ${G.xp}/${xpNeed(G.lv)}`, '#b8aecb');
  txt(`PV ${G.hp}/${G.st.mhp}`, x + 8, yy); bar(x + 8, yy + 11, 104, 2, G.hp / G.st.mhp, '#4ad04a'); yy += 16;
  txt(`PM ${G.mp}/${G.st.mmp}`, x + 8, yy); bar(x + 8, yy + 11, 104, 2, G.mp / G.st.mmp, '#5fa8ff'); yy += 16;
  line(`Frasco ${G.flask.n}/${G.flask.max}`, '#b8aecb'); line(`Feitiços ${G.spells.length}/6`, '#b8aecb'); line(`Tempo ${fmtTime(G.time)}`, '#b8aecb');
}
function bar(x, y, w, h, p, col) { bx.fillStyle = '#2a2236'; bx.fillRect(x, y, w, h); bx.fillStyle = col; bx.fillRect(x, y, Math.round(w * clamp(p, 0, 1)), h); }
function fmtTime(t) { t = Math.floor(t); const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60; return h + ':' + String(m).padStart(2, '0'); }
async function pauseMenu() {
  sfx('select'); let idx = 0;
  while (true) {
    const r = await list({ title: G.name, x: 8, y: 8, w: 98, idx, items: [{ label: 'Grimório' }, { label: 'Runas' }, { label: 'Itens' }, { label: 'Status' }, { label: 'Dificuldade' }, { label: 'Backup' }, { label: 'Fechar' }], extra: miniStatus });
    if (r < 0 || r === 6) return; idx = r;
    if (r === 0) await grimoire(); else if (r === 1) await runesMenu(); else if (r === 2) await itemsMenu(); else if (r === 3) await statusPanel(); else if (r === 4) await diffMenu(); else if (r === 5) await backupOverlay();
  }
}
function spellCost(sp) { return Math.max(1, RUNES[sp.form].cost + (sp.mod ? RUNES[sp.mod].cost : 0) - (spec().discount || 0)); }
function spellPower(sp) { return (spec().passive2 === 'forbidden' ? 1.25 : 1) * RUNES[sp.el].pow * (RUNES[sp.form].mult || 1) * (sp.mod === 'foco' ? 1.6 : 1) * (1 + G.st.mag * 0.12); }
function veuText(sp) {
  const f = sp.mod === 'foco', e = sp.mod === 'eco';
  if (sp.el === 'brasa') return `Fúria: ataque ×${f ? 1.8 : 1.5} por ${e ? 5 : 3} turnos.`;
  if (sp.el === 'sombra') return `Manto: dano recebido -25% por ${e ? 5 : 3} turnos.`;
  if (sp.el === 'vento') return 'Redemoinho: remove proteções inimigas e aumenta seu ataque.';
  if (sp.el === 'faisca') return `Estática: ataque ×${f ? 1.6 : 1.35} e -20% de dano recebido por ${e ? 5 : 3} turnos.`;
  if (sp.el === 'sal') return `Crosta de sal: limpa efeitos ruins e impede novos por ${e ? 5 : 3} turnos.`;
  if (sp.el === 'geada') return `Casca de gelo: dano recebido ×${f ? 0.35 : 0.5} por ${e ? 5 : 3} turnos.`;
  return `Cura cerca de ${Math.round(healAmt(sp) * (e ? 1.6 : 1))} PV.`;
}
const healAmt = sp => (8 + G.st.mag * 2.2) * (sp.mod === 'foco' ? 1.6 : 1);
function spellDesc(sp) {
  const el = RUNES[sp.el];
  if (sp.form === 'veu') return `${spellCost(sp)} PM · Em você. ${veuText(sp)}`;
  const alvo = sp.form === 'onda' ? 'Todos os inimigos' : sp.form === 'corrente' ? 'Salta entre até 3' : sp.form === 'ancora' ? 'Um inimigo, fura proteções' : sp.form === 'mina' ? 'Um inimigo, mina' : 'Um inimigo';
  let extra = sp.el === 'sombra' ? ' Pode enfraquecer o próximo golpe do alvo.' : sp.el === 'vento' ? ' Remove proteções do alvo.' : sp.el === 'geada' ? ' Pode congelar.' : sp.el === 'seiva' ? ' Rouba metade do dano como PV.' : sp.el === 'faisca' ? ' Pode atordoar.' : sp.el === 'sal' ? ' Corrói a defesa do alvo.' : '';
  if (sp.form === 'ancora') extra += ' Afunda golpes preparados.';
  if (sp.form === 'mina') extra += ' Planta uma mina que explode quando o alvo agir.';
  if (sp.el === 'polvora') extra += ' Explode de novo em todos no fim da rodada.';
  if (sp.mod === 'bandeira') extra += ' Depois: ataque e magia +20%.';
  if (sp.mod === 'mare') extra += ' Volta no fim da rodada com 60%.';
  if (sp.mod === 'selo') extra += ' Selo: dano extra por 3 turnos.';
  if (sp.mod === 'dreno') extra += ' Drena PM.';
  if (sp.mod === 'eco') extra += ' Repete com 60%.';
  return `${spellCost(sp)} PM · ${alvo} · ${el.name}, poder ~${Math.round(spellPower(sp))}.${extra}`;
}
function suggestName(el, form, mod) {
  const fem = form === 'onda' || form === 'corrente' || form === 'ancora' || form === 'mina'; const base = `${RUNES[form].name} de ${RUNES[el].name}`;
  if (mod === 'selo') return base + (fem ? ' Selada' : ' Selado');
  if (mod === 'dreno') return base + ' Sedent' + (fem ? 'a' : 'o');
  if (mod === 'mare') return base + ' da Maré';
  if (mod === 'bandeira') return base + (fem ? ' Hasteada' : ' Hasteado');
  return mod === 'eco' ? base + ' em Eco' : mod === 'foco' ? base + (fem ? ' Focada' : ' Focado') : base;
}
async function diffMenu() {
  const c = await list({ title: 'Dificuldade', x: 8, y: 8, w: 224, idx: G.diff === 'historia' ? 1 : 0, items: [{ label: 'Desafio', right: G.diff !== 'historia' ? 'atual' : '' }, { label: 'História', right: G.diff === 'historia' ? 'atual' : '' }],
    desc: i => i === 0 ? 'Inimigos mais fortes e espertos: preparam golpes, ficam furiosos e às vezes fingem o ataque. Defesa mais justa. O frasco cura 35%.' : 'Para curtir a história. Inimigos mais fracos, defesa mais fácil e o frasco cura 45%.' });
  if (c < 0) return;
  G.diff = c === 0 ? 'desafio' : 'historia';
  await say(`* Dificuldade: {y}${DF().name}{/}. Vale a partir da próxima batalha.`);
}
async function grimoire() {
  let idx = 0;
  while (true) {
    const full = G.spells.length >= 6;
    const items = G.spells.map(s => ({ label: s.name, right: spellCost(s) + ' PM', col: RUNES[s.el].col }));
    items.push({ label: '+ Criar feitiço', right: full ? 'cheio' : '', col: '#ffe066', disabled: full });
    const r = await list({ title: `Grimório ${G.spells.length}/6`, x: 8, y: 8, w: 224, idx, items, allowDisabled: true,
      desc: i => i < G.spells.length ? spellDesc(G.spells[i]) : full ? 'O grimório está cheio. Escolha um feitiço e use ESQUECER para abrir espaço.' : 'Combine runas para criar um feitiço novo. Você escolhe o nome.' });
    if (r < 0) return; idx = r;
    if (r === G.spells.length) { await craft(); idx = G.spells.length - 1; continue; }
    const a = await list({ x: 130, y: 40, w: 96, items: [{ label: 'Renomear' }, { label: 'Esquecer' }, { label: 'Voltar' }] });
    if (a === 0) { const nm = await textInput('Novo nome do feitiço', G.spells[r].name, 18); if (nm) G.spells[r].name = nm; }
    else if (a === 1) { const c = await choose(`* Esquecer "${G.spells[r].name}"? As runas usadas nele se perdem.`, ['Esquecer', 'Manter'], 'n', 1); if (c === 0) { G.spells.splice(r, 1); idx = 0; } }
  }
}
async function craft() {
  const els = G.runes.filter(r => RUNES[r].type === 'el'), forms = G.runes.filter(r => RUNES[r].type === 'form'), mods = G.runes.filter(r => RUNES[r].type === 'mod');
  if (G.spells.length >= 6) { await say('* O grimório está cheio. Esqueça um feitiço antes de criar outro.'); return; }
  if (!els.some(rq) || !forms.some(rq)) { await say('* Faltam runas. Um feitiço gasta 1 runa de ELEMENTO e 1 de FORMA.\n* Procure pedestais e baús, vença monstros ou funda runas numa Lanterna.'); return; }
  if (!G.flags.tut_rq) {
    G.flags.tut_rq = true; sfx('catalog');
    await say('[Atenção: criar um feitiço CONSOME 1 de cada runa usada. O feitiço fica no grimório, mas as runas vão embora.]', 'cat');
    await say('[Runas raras são poucas. Mais runas: pedestais, baús, monstros vencidos, feitiços engolidos e a fusão nas Lanternas.]', 'cat');
  }
  const rit = r => ({ label: RUNES[r].name, col: RUNES[r].col, right: '×' + rq(r), disabled: !rq(r) });
  while (true) {
    const e = await list({ title: '1/3 · Elemento', x: 8, y: 8, w: 224, items: els.map(rit), desc: i => `${RARITY[rar(els[i])].name}. ${RUNES[els[i]].desc}` });
    if (e < 0) return;
    const f = await list({ title: '2/3 · Forma', x: 8, y: 8, w: 224, items: forms.map(rit), desc: i => `${RARITY[rar(forms[i])].name}. ${RUNES[forms[i]].desc}` });
    if (f < 0) continue;
    const m = await list({ title: '3/3 · Modificador', x: 8, y: 8, w: 224, items: [{ label: 'Nenhum' }, ...mods.map(rit)], desc: i => i === 0 ? 'Sem modificador. Mais barato e não gasta runa.' : `${RARITY[rar(mods[i - 1])].name}. ${RUNES[mods[i - 1]].desc}` });
    if (m < 0) continue;
    const sp = { el: els[e], form: forms[f], mod: m === 0 ? null : mods[m - 1] };
    sp.name = suggestName(sp.el, sp.form, sp.mod);
    const c = await list({ title: 'Prévia do feitiço', x: 8, y: 8, w: 224, head: [`{${RUNES[sp.el].col}}${RUNES[sp.el].name}{/} + ${RUNES[sp.form].name}${sp.mod ? ' + ' + RUNES[sp.mod].name : ''}`, '{d}Gasta 1 de cada runa.{/}'], items: [{ label: 'Gastar runas e gravar' }, { label: 'Recomeçar' }, { label: 'Cancelar' }], desc: () => spellDesc(sp) });
    if (c === 1) continue; if (c !== 0) return;
    sp.name = await textInput('Dê um nome ao feitiço', sp.name, 18, 'O nome aparece na batalha. Seja criativo.');
    useRune(sp.el); useRune(sp.form); if (sp.mod) useRune(sp.mod);
    G.spells.push(sp); sfx('rune');
    await say(`* {y}${sp.name}{/} foi gravado no grimório.`);
    if (!G.flags.firstSpell) { G.flags.firstSpell = true; sfx('catalog'); await say('[Primeiro feitiço registrado. O Catálogo está levemente impressionado.]', 'cat'); }
    return;
  }
}
async function runesMenu() {
  const ord = { el: 0, form: 1, mod: 2 }, rs = G.runes.slice().sort((a, b) => ord[RUNES[a].type] - ord[RUNES[b].type]);
  let idx = 0;
  while (true) {
    const r = await list({ title: `Runas (${runeTotal()})`, x: 8, y: 8, w: 224, idx, empty: 'Nenhuma runa ainda.', items: rs.map(k => ({ label: RUNES[k].name, right: `×${rq(k)} ${RARITY[rar(k)].name}`, col: rq(k) ? RUNES[k].col : null, disabled: !rq(k) })), allowDisabled: true, desc: i => `${TYPE_LABEL[RUNES[rs[i]].type]} · ${RARITY[rar(rs[i])].name}. ${RUNES[rs[i]].desc}` });
    if (r < 0) return; idx = r;
  }
}
async function itemsMenu() {
  let idx = 0;
  while (true) {
    const ks = ['flask', ...Object.keys(G.items).filter(k => G.items[k] > 0)];
    const r = await list({ title: 'Itens', x: 8, y: 8, w: 224, idx, items: ks.map(k => k === 'flask' ? flaskItem() : ({ label: ITEMS[k].name, right: '×' + G.items[k] })), desc: i => ks[i] === 'flask' ? FLASK_DESC() : ITEMS[ks[i]].desc });
    if (r < 0) return; idx = r;
    if (ks[r] === 'flask') { if (!G.flask.n) { await say('* O frasco está vazio. Descanse numa Lanterna de Âmbar.'); continue; } if (G.hp >= G.st.mhp && G.mp >= G.st.mmp) { await say('* Você está inteiro. Melhor guardar o gole.'); continue; } const t = drinkFlask(); sfx('heal'); await say(t); continue; }
    const it = ITEMS[ks[r]];
    if (it.world) { const ok = await it.world(); if (ok) return; continue; }
    if (it.fx) { await say('* Isso só funciona no meio de uma batalha.'); continue; }
    if ((it.hp && G.hp >= G.st.mhp) || (it.mp && G.mp >= G.st.mmp)) { await say('* Você já está cheio disso. Melhor guardar.'); continue; }
    useItemOut(ks[r]); sfx('heal'); await say(`* Você comeu ${it.name}. ${it.hp ? 'PV' : 'PM'} recuperados.`);
  }
}
const FLASK_DESC = () => `Cura ${Math.round(DF().flask * 100)}% dos PV e ${Math.round(FLASK_MP * 100)}% dos PM. As Lanternas enchem de novo.`;
const FLASK_MP = 0.3;
function flaskItem() { return { label: 'Frasco de Âmbar', right: `${G.flask.n}/${G.flask.max}`, col: '#f2b544', disabled: !G.flask.n }; }
function drinkFlask() {
  G.flask.n--; const h0 = G.hp, m0 = G.mp;
  G.hp = Math.min(G.st.mhp, G.hp + Math.round(G.st.mhp * DF().flask)); G.mp = Math.min(G.st.mmp, G.mp + Math.round(G.st.mmp * FLASK_MP));
  const st = BT.on && BT.ps && (BT.ps.poison > 0 || BT.ps.burn > 0); if (BT.on && BT.ps) { BT.ps.poison = 0; BT.ps.burn = 0; }
  return `* Um gole de âmbar morno. +${G.hp - h0} PV, +${G.mp - m0} PM.${st ? ' O veneno e a queimadura passaram.' : ''} (${G.flask.n}/${G.flask.max} goles)`;
}
function useItemOut(k) { const it = ITEMS[k]; G.items[k]--; if (it.hp) G.hp = Math.min(G.st.mhp, G.hp + it.hp); if (it.mp) G.mp = Math.min(G.st.mmp, G.mp + it.mp); }
function statusPanel() {
  const s = G.st;
  return panel([
    `{y}${G.name}{/} · Alma nº 31`,
    `${spec().name}, nível ${G.lv}`,
    `EXP ${G.xp} / ${xpNeed(G.lv)}`,
    `PV ${G.hp}/${s.mhp}    PM ${G.mp}/${s.mmp}`,
    `ATQ ${s.atk}   DEF ${s.def}   MAG ${s.mag}`,
    spec().passive ? `{c}${spec().tag}{/}: ${spec().desc[0]}` : spec().bite ? '{c}Mordida Férrea{/}: +25% de mordida' : spec().discount ? '{c}Boca de Runas{/}: feitiços -1 PM' : '{d}Evolui no nível 5{/}',
    `Técnicas: ${(G.tech || []).length}  ·  Batalhas: ${G.battles}`,
    `Tempo de jogo: ${fmtTime(G.time)} · ${DF().name}`
  ], { title: 'Status', h: 118 });
}

// ================= BATALHA =================
const BT = { on: false, en: [], mode: 'none', tw: new TW(), parts: [], nums: [], buff: {} };
const SIL = new Map();
function silhouette(c, col) { const k = col; let m = SIL.get(c); if (!m) { m = {}; SIL.set(c, m); } if (m[k]) return m[k]; const s = mk(c.width, c.height), x = s.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, s.width, s.height); return m[k] = s; }
function mkEnemy(id, i, n) {
  const d = ENEMIES[id], slot = enemySlot(i, n), sc = enemyScale(id, d), fh = ((SP[d.sp] || [])[0] || { height: 16 }).height * sc;
  const D = DF(), hm = D.hp * (d.boss ? D.boss : 1), hp = Math.round(d.hp * hm);
  return { id, d, name: d.name, hp, mhp: hp, atk: Math.round(d.atk * D.atk), def: d.def, x: slot[0], y: Math.round(slot[1] - fh / 2), h: fh, sc, shake: 0, flash: 0, hpShow: 0, alive: true, alpha: 1, frozen: 0, weak: { ...d.weak }, phase: 1, charge: false, turns: 0, sp: d.sp };
}
function bWait(mode, extra) { return new Promise(r => { BT.mode = mode; Object.assign(BT, extra || {}); BT.res = v => { BT.mode = 'none'; r(v); }; }); }
function bSay(text, o = {}) {
  BT.tw.set(String(text).replace(/@/g, G.name), 35, { voice: o.cat ? () => sfx('blipTri', 1500) : null, col: o.cat ? '#a8ecff' : o.col, fx: o.fx });
  BT.auto = o.auto || 0; BT.autoT = 0;
  if (BT.tw.lines.length <= 5) return bWait('text');
  // texto longo: mostra em páginas de 5 linhas
  const all = BT.tw.lines;
  return (async () => {
    let r;
    for (let i = 0; i < all.length; i += 5) {
      const pg = all.slice(i, i + 5);
      Object.assign(BT.tw, { lines: pg, flat: pg.flat(), n: 0, acc: 0, wait: 0, done: false });
      BT.autoT = 0; r = await bWait('text');
    }
    return r;
  })();
}
async function battle(group, opts = {}) {
  sfx('encounter');
  const prev = AU.curName; playMusic(null);
  for (let i = 0; i < 3; i++) { V.flashW = 1; await wait(4); V.flashW = 0; await wait(4); }
  await fadeOut(8);
  Object.assign(BT, { cd: {}, freeSpell: 0, bloodM: 1, magT: 0, bulwark: 0, frenzy: 0, starHeal: 0, powder: [], saltCrust: 0, reflect: 0, tideQ: null, tideRecast: false, acts: {}, lastAct: null, forgot: null, foneSaid: false, stance: 0, orbit: 0, dark: 0, star: 0, guildShield: 0, nextSpellM: 1, lastSpell: null, copy: false, ps: {}, on: true, opts, en: group.map((id, i) => mkEnemy(id, i, group.length)), mode: 'none', menuIdx: 0, parts: [], nums: [], buff: { atkT: 0, atkM: 1, defT: 0, defM: 1 }, hurt: 0, biteFx: null, turn: 0, tgt: 0, netted: false, marked: false, inked: false, lumeT: 0 }); FXL.length = 0; BT.flashT = 0; BT.dimT = 0;
  V.scene = 'battle'; playMusic(opts.music || 'battle');
  await fadeIn(10);
  const names = BT.en.map(e => e.name);
  const intro = opts.intro ? opts.intro : (opts.boss && group[0] === 'boss') ? '* O Guarda-Musgo bloqueia a escada!' : names.length === 1 ? `* Um ${names[0]} bloqueia o caminho!` : `* ${names.slice(0, -1).join(', ')} e ${names[names.length - 1]} aparecem!`;
  await bSay(intro);
  if (!G.flags.tutBattle) {
    G.flags.tutBattle = true;
    await bSay('[MORDER: aperte {y}A{/} quando o cursor passar pelo centro da barra.]', { cat: true });
    await bSay('[Na vez do inimigo, aperte {y}A{/} quando o anel encostar no círculo. Isso é DEFENDER.]', { cat: true });
    await bSay('[AVALIAR mostra os pontos fracos do inimigo e não gasta o seu turno.]', { cat: true });
  }
  if (G.tech && G.tech.length && !G.flags.tut_tecnica) {
    G.flags.tut_tecnica = true; sfx('catalog');
    await bSay('[O botão MORDER agora se chama {y}TÉCNICA{/}. A Mordida comum continua lá, em primeiro na lista.]', { cat: true });
  }
  let result = null;
  while (!result) {
    BT.turn++;
    const act = await playerTurn();
    if (act === 'fled') { result = 'flee'; break; }
    await killDead();
    if (G.flags.lumeJoined && BT.en.some(e => e.alive) && BT.turn % 3 === 0) { await lumeSing(); await killDead(); }
    if (BT.en.every(e => !e.alive)) { result = 'win'; break; }
    for (const e of BT.en) {
      if (!e.alive) continue;
      await enemyTurn(e);
      if (G.hp <= 0) { result = 'lose'; break; }
      await killDead();
      if (BT.en.every(x => !x.alive)) { result = 'win'; break; }
    }
    if (result !== 'lose' && !result) { await tickStatus(); }
    if (spec().passive === 'regen' && G.mp < G.st.mmp && result !== 'lose') { G.mp = Math.min(G.st.mmp, G.mp + 4); BT.nums.push({ x: BPX + 14, y: BPY - 48, s: '+4 PM', col: '#8fe3ff', t: 40 }); }
    if (!result) await roundEnd();
    if (BT.buff.atkT > 0 && --BT.buff.atkT === 0) { BT.buff.atkM = 1; await bSay('* A Fúria se apagou.', { auto: 30 }); }
    if (BT.buff.defT > 0 && --BT.buff.defT === 0) { BT.buff.defM = 1; await bSay('* A casca de gelo derreteu.', { auto: 30 }); }
  }
  if (result === 'win') await victory();
  if (result === 'lose') { await gameOver(); BT.on = false; return 'lose'; }
  await fadeOut(12);
  BT.on = false; V.scene = 'world';
  if (WD.id === 'antessala') playMusic(G.flags.bossDone || result === 'win' ? 'ending' : null); else playMusic(WD.map.music || prev);
  BT.netted = BT.marked = BT.inked = false;
  await fadeIn(12);
  return result;
}
function markAct(k) { BT.lastAct = k; BT.acts = BT.acts || {}; BT.acts[k] = (BT.acts[k] || 0) + 1; }
const forgot = k => BT.ps && BT.ps.forget > 0 && BT.forgot === k;
async function playerTurn() {
  if (BT.netted) { BT.netted = false; await bSay('* Você está preso na rede da Brida! Perdeu o turno se debatendo.', { auto: 50 }); return 'acted'; }
  while (true) {
    BT.flavor = pickOne(BT.en.find(e => e.alive && e.phase === 2)?.d.flavor2 || pickOne(BT.en.filter(e => e.alive)).d.flavor);
    BT.tw.set(BT.flavor, 35, { instant: false });
    const c = await bWait('main');
    if (c === 0) {
      if (G.tech && G.tech.length) {
        const ids = G.tech.filter(k => TECH[k]);
        const items = [{ label: 'Mordida', right: '' }, ...ids.map(k => { const T = TECH[k], cd = BT.cd[k] || 0, cost = T.pm ? techCost(T) : 0; return { label: T.name, right: forgot('tc:' + k) ? 'esquecida' : (T.need && !T.need()) ? '—' : cd ? `espera ${cd}` : T.pm ? cost + ' PM' : 'pronta', disabled: cd > 0 || (T.pm && cost > G.mp) || (T.need && !T.need()) || forgot('tc:' + k), col: T.pm ? '#8fe3ff' : '#ffa94d' }; })];
        const i = await list({ x: 8, y: 150, w: 224, h: 74, title: 'Técnicas', maxVis: 4, items, desc: k => k === 0 ? 'Mordida comum com a barra de tempo.' : TECH[ids[k - 1]].desc, descY: 40 });
        if (i < 0) continue;
        if (i > 0) { const k = ids[i - 1], T = TECH[k]; let tgt = null; if (T.target) { const t = await pickTarget(); if (t < 0) continue; tgt = BT.en[t]; } if (T.pm) G.mp -= techCost(T); if (T.cd) BT.cd[k] = T.cd + 1; markAct('tech'); pbPose('open', 22, { glow: T.pm ? '#8fe3ff' : '#ffa94d' }); await bSay(`* Técnica: {o}${T.name}{/}!`, { auto: 18 }); if (TECH_FX[k]) await TECH_FX[k](tgt || BT.en.find(e => e.alive)); await T.use(tgt); return 'acted'; }
      }
      const t = await pickTarget(); if (t < 0) continue; markAct('bite'); await doBite(BT.en[t]); return 'acted';
    }
    if (c === 1) {
      if (BT.ps && BT.ps.silence > 0) { await bSay('* Você está silenciado! As runas não saem da sua boca.'); continue; }
      if (!G.spells.length) { await bSay('* Você ainda não tem feitiços. Crie um no {y}Grimório{/} (MENU), fora da batalha.'); continue; }
      const items = G.spells.map((s, k) => ({ label: s.name, right: forgot('sp:' + k) ? 'esquecido' : BT.freeSpell ? 'grátis' : spellCost(s) + ' PM', disabled: (spellCost(s) > G.mp && !BT.freeSpell) || forgot('sp:' + k), col: RUNES[s.el].col }));
      const i = await list({ x: 8, y: 150, w: 224, items, maxVis: 5, title: `Feitiços · PM ${G.mp}/${G.st.mmp}`, h: 74, desc: k => spellDesc(G.spells[k]), descY: 40 });
      if (i < 0) continue;
      const sp = G.spells[i];
      let target = null;
      if (sp.form === 'dardo' || sp.form === 'corrente' || sp.form === 'ancora' || sp.form === 'mina') { const t = await pickTarget(); if (t < 0) continue; target = BT.en[t]; }
      if (BT.freeSpell > 0) BT.freeSpell--; else G.mp -= spellCost(sp); markAct('spell'); await castSpell(sp, target); return 'acted';
    }
    if (c === 2) {
      const ks = ['flask', ...Object.keys(G.items).filter(k => G.items[k] > 0)];
      const i = await list({ x: 8, y: 150, w: 224, h: 74, title: 'Itens', maxVis: 4, items: ks.map(k => k === 'flask' ? flaskItem() : ({ label: ITEMS[k].name, right: '×' + G.items[k] })), desc: k => ks[k] === 'flask' ? FLASK_DESC() : ITEMS[ks[k]].desc, descY: 40 });
      if (i < 0) continue;
      if (ks[i] === 'flask') { if (!G.flask.n) { await bSay('* O frasco está vazio.'); continue; } markAct('item'); const t = drinkFlask(); sfx('heal'); pbPose('win', 20); burst(BPX, BPY - 14, '#f2b544', 22); await bSay(t, { auto: 50 }); return 'acted'; }
      const it = ITEMS[ks[i]]; markAct('item');
      if (it.fx) { G.items[ks[i]]--; await it.fx(); return 'acted'; }
      if (it.world) { await bSay('* Isso não funciona no meio de uma batalha.'); continue; }
      useItemOut(ks[i]); sfx('heal'); pbPose('win', 20); burst(BPX, BPY - 14, it.hp ? '#9be58a' : '#5fa8ff', 18);
      if (it.cure) cureStatus();
      await bSay(`* Você comeu ${it.name}. ${it.hp ? `PV: ${G.hp}/${G.st.mhp}` : `PM: ${G.mp}/${G.st.mmp}`}.${it.cure ? ' Os efeitos ruins sumiram.' : ''}`, { auto: 50 });
      return 'acted';
    }
    if (c === 3) {
      const t = await pickTarget(); if (t < 0) continue; const e = BT.en[t];
      sfx('catalog');
      const wk = Object.entries(e.weak).filter(([k, v]) => k !== 'bite' && v > 1).map(([k]) => RUNES[k].name).join(', ') || 'nenhuma conhecida';
      await bSay(`[AVALIAÇÃO: {y}${e.name}{/}. PV ${e.hp}/${e.mhp} · ATQ ${e.atk} · DEF ${e.def}.]\n[Fraqueza: ${wk}.]`, { cat: true });
      await bSay(`[${e.d.check}]`, { cat: true });
      continue;
    }
    if (c === 4) {
      markAct('flee');
      if (BT.opts.noFlee) { await bSay(WD.id === 'antessala' ? '* Não dá pra fugir. O Guarda-Musgo tapa a saída com o próprio corpo.' : '* Não dá pra fugir desta luta!'); continue; }
      if (Math.random() < DF().flee) { sfx('flee'); await bSay('* Você fechou a tampa e saiu quicando. Fuga bem-sucedida!', { auto: 40 }); return 'fled'; }
      await bSay('* Você tentou fugir, mas tropeçou na própria dobradiça.', { auto: 50 }); return 'acted';
    }
  }
}
function pickTarget() {
  const alive = BT.en.map((e, i) => e.alive ? i : -1).filter(i => i >= 0);
  if (alive.length === 1) return Promise.resolve(alive[0]);
  if (!BT.en[BT.tgt] || !BT.en[BT.tgt].alive) BT.tgt = alive[0];
  return bWait('target');
}
const elTag = el => ({ brasa: 'o', geada: 'c', seiva: 'g', faisca: 'y', sombra: 'p', vento: 'w' })[el] || (RUNES[el] && RUNES[el].col) || 'w';
async function doBite(e, o = {}) {
  const t = await bWait('timing', { tm: { x: 24, v: BT.inked ? 5 : DF().bite, done: false } }); BT.inked = false;
  if (!t) { sfx('miss'); popNum(e, 'ERROU', '#bbbbbb'); await bSay('* Você mordeu o ar.', { auto: 40 }); return; }
  const crit = t >= 2;
  BT.biteFx = { e, t: 0 }; await wait(10); sfx('bite'); await wait(6); BT.biteFx = null;
  const ev = e.hide > 0 ? 0.7 : e.d.evade;
  if (ev && !crit && Math.random() < ev) { sfx('miss'); popNum(e, 'DESVIOU', '#bbbbbb'); await bSay(`* O ${e.name} desviou da mordida!`, { auto: 40 }); return; }
  let dmg = G.st.atk * t * (spec().bite || 1) * BT.buff.atkM * (o.m || 1) - e.def;
  dmg *= (e.weak.bite ?? 1); dmg = Math.max(1, Math.round(dmg * rand(0.9, 1.1)));
  hitEnemy(e, dmg, crit ? 'crit' : 'hit');
  let post = '';
  if (spec().passive2 === 'poisonBite' && e.hp > 0) { e.dot = { d: Math.max(1, Math.round(dmg * 0.2)), t: 3, icon: 'poison' }; post += '\n* O ferrão deixou veneno.'; }
  if (spec().passive2 === 'lifesteal') { const h = Math.round(dmg * 0.2); G.hp = Math.min(G.st.mhp, G.hp + h); post += `\n* Você recuperou ${h} PV mordendo.`; }
  if (o.onHit) post += o.onHit(e, dmg) || '';
  let msg = crit ? `* {y}CRÍTICO!{/} Sua mordida causou ${dmg} de dano!` : `* Você mordeu o ${e.name}. ${dmg} de dano.`;
  if ((e.weak.bite ?? 1) < 1) msg += '\n* ' + (e.d.biteMsg || 'A mordida rendeu pouco. Esse inimigo aguenta dentes.');
  msg += post;
  await bSay(msg, { auto: 45 });
}
function hitEnemy(e, dmg, kind, col) {
  if (e.shell > 0) dmg = Math.max(1, Math.round(dmg * 0.5));
  if (!e.d.guardian && BT.en.some(g => g !== e && g.alive && g.hp > 0 && g.d.guardian)) { dmg = Math.max(1, Math.round(dmg * 0.5)); e.guarded = 12; }
  e.hp = Math.max(0, e.hp - dmg); e.shake = 16; e.flash = 8; e.hpShow = 90;
  popNum(e, String(dmg), col || (kind === 'crit' ? '#ffe066' : '#ff6b6b'));
  sfx(kind === 'crit' ? 'crit' : 'hit');
  if (e.d.boss && e.phase === 1 && e.hp <= e.mhp * 0.5 && e.hp > 0) e.pendingPhase = kind;
}
async function killDead() {
  for (const e of BT.en) if (e.alive && e.hp <= 0) {
    e.alive = false; e.dying = 36; sfx('die');
    for (let i = 0; i < 24; i++) BT.parts.push({ x: e.x + rand(-20, 20), y: e.y + rand(-20, 20), vx: rand(-0.4, 0.4), vy: rand(-1.2, -0.2), life: rand(30, 60), col: pickOne(['#ffffff', '#b8aecb', '#8a8099']), sz: 1 });
    await wait(20);
    if (!e.d.boss) await bSay(`* O ${e.name} foi derrotado.`, { auto: 30 });
  }
}
async function castSpell(sp, target) {
  const el = RUNES[sp.el]; BT.lastSpell = sp; pbPose('open', 26, { glow: el.col }); const markM = (BT.nextSpellM || 1) * (BT.bloodM || 1) * (BT.magT > 0 ? 1.2 : 1); BT.nextSpellM = 1; BT.bloodM = 1;
  if (sp.mod === 'mare' && !BT.tideRecast) BT.tideQ = { sp, target };
  await bSay(`* Você conjura {${elTag(sp.el)}}${sp.name}{/}!`, { auto: 22 });
  if (sp.form === 'veu') {
    sfx(sp.el === 'seiva' ? 'heal' : 'buff'); await fxAura(sp.el);
    const f = sp.mod === 'foco', ec = sp.mod === 'eco';
    if (sp.el === 'sombra') { BT.dark = Math.max(BT.dark, (ec ? 5 : 3)); await bSay(`* Sombras envolvem você. Os inimigos erram mais: dano recebido -25% por ${BT.dark} turnos.`, { auto: 50 }); }
    else if (sp.el === 'vento') { for (const t of BT.en) { t.shell = 0; t.hide = 0; t.atkBuff = null; } BT.buff.atkM = Math.max(BT.buff.atkM, f ? 1.4 : 1.2); BT.buff.atkT = Math.max(BT.buff.atkT, 3); await bSay('* Um redemoinho varre todas as proteções inimigas e te deixa mais leve.', { auto: 50 }); }
    else if (sp.el === 'faisca') { BT.buff.atkM = f ? 1.6 : 1.35; BT.buff.atkT = (ec ? 5 : 3) + 1; BT.buff.defM = Math.min(BT.buff.defM, 0.8); BT.buff.defT = Math.max(BT.buff.defT, BT.buff.atkT); await bSay(`* Faíscas dançam na sua tampa. Ataque ×${BT.buff.atkM} e dano recebido -20% por ${BT.buff.atkT - 1} turnos.`, { auto: 50 }); }
    else if (sp.el === 'brasa') { BT.buff.atkM = f ? 1.8 : 1.5; BT.buff.atkT = (ec ? 5 : 3) + 1; await bSay(`* Uma Fúria de brasa envolve sua tampa. Ataque ×${BT.buff.atkM} por ${BT.buff.atkT - 1} turnos.`, { auto: 50 }); }
    else if (sp.el === 'sal') { cureStatus(); BT.saltCrust = Math.max(BT.saltCrust || 0, ec ? 5 : 3); if (f) { BT.buff.defM = Math.min(BT.buff.defM, 0.8); BT.buff.defT = Math.max(BT.buff.defT, 4); } await bSay(`* Uma crosta de sal cobre a sua tampa. Efeitos ruins sumiram e não pegam em você por ${BT.saltCrust} turnos.`, { auto: 50 }); }
    else if (sp.el === 'geada') { BT.buff.defM = f ? 0.35 : 0.5; BT.buff.defT = (ec ? 5 : 3) + 1; await bSay(`* Uma casca de gelo cobre você. Dano recebido reduzido por ${BT.buff.defT - 1} turnos.`, { auto: 50 }); }
    else {
      let h = Math.round(healAmt(sp) * markM * rand(0.95, 1.05)); const before = G.hp; G.hp = Math.min(G.st.mhp, G.hp + h);
      if (ec) { await wait(14); sfx('heal'); burst(BPX, BPY - 14, el.col, 20); G.hp = Math.min(G.st.mhp, G.hp + Math.round(h * 0.6)); }
      const hadSt = BT.ps && Object.values(BT.ps).some(v => v > 0); cureStatus();
      await bSay(`* A seiva fecha suas rachaduras. +${G.hp - before} PV.${hadSt ? ' Os efeitos ruins sumiram.' : ''}`, { auto: 50 });
    }
    return;
  }
  const passes = sp.mod === 'eco' ? [1, 0.6] : [1];
  if (spec().passive === 'echo' && Math.random() < 0.3) passes.push(0.5);
  const log = [];
  for (let pi = 0; pi < passes.length; pi++) {
    const pm = passes[pi];
    if (pi > 0 && pi === passes.length - 1 && spec().passive === 'echo' && !(sp.mod === 'eco' && pi === 1)) log.push('* {p}O grimório ecoa o feitiço de graça!{/}');
    let alive = BT.en.filter(e => e.alive && e.hp > 0);
    let first = target && target.hp > 0 ? target : alive[0];
    let targets, mults;
    if (sp.form === 'onda') { targets = alive; mults = alive.map(() => 1); }
    else if (sp.form === 'corrente') { targets = first ? [first, ...alive.filter(e => e !== first)].slice(0, 3) : []; mults = [1, 0.7, 0.5]; }
    else { targets = first ? [first] : []; mults = [1]; }
    if (!targets.length) break;
    if (BT.tideRecast) log.push('* {c}A maré devolveu o feitiço!{/}');
    sfx(sp.el); await spellAnim(sp, targets, pm);
    let drained = 0;
    targets.forEach((t, k) => {
      const wk = t.weak[sp.el] ?? 1;
      if (sp.el === 'faisca' && t.shell > 0) { t.shell = 0; log.push(`* A Faísca racha a proteção do ${t.name}!`); }
      if (sp.form === 'ancora') { if (t.shell > 0) { t.shell = 0; log.push(`* A âncora afunda a proteção do ${t.name}.`); } t.hide = 0; if (t.charge || t.proph) { t.charge = false; t.proph = null; log.push(`* O golpe que o ${t.name} preparava afundou junto!`); } }
      const dmg = Math.max(1, Math.round(spellPower(sp) * pm * mults[k] * wk * markM * (sp.el === 'sombra' && spec().passive2 === 'shadow' ? 1.3 : 1) * rand(0.9, 1.1)));
      if (sp.el === 'sombra' && t.hp - dmg > 0 && Math.random() < 0.35) { t.blinded = 1; log.push(`* O ${t.name} foi envolto em sombra: o próximo golpe dele perde força.`); }
      if (sp.el === 'vento' && (t.shell > 0 || t.hide > 0 || (t.atkBuff && t.atkBuff.t > 0))) { t.shell = 0; t.hide = 0; t.atkBuff = null; log.push(`* O vento varre as proteções do ${t.name}!`); }
      if (sp.mod === 'dreno') { const g = Math.max(1, Math.round(dmg * 0.2)); G.mp = Math.min(G.st.mmp, G.mp + g); log.push(`* Você drenou ${g} PM.`); }
      hitEnemy(t, dmg, wk > 1 ? 'crit' : 'hit', RUNES[sp.el].col);
      if (sp.el === 'seiva') drained += Math.round(dmg * 0.5);
      if (sp.el === 'geada' && t.hp > 0 && Math.random() < (t.d.boss ? 0.1 : sp.mod === 'foco' ? 0.4 : 0.25)) { t.frozen = 1; log.push(`* O ${t.name} congelou!`); }
      if (sp.el === 'faisca' && t.hp > 0 && !t.frozen && Math.random() < (t.d.boss ? 0.12 : sp.mod === 'foco' ? 0.35 : 0.2)) { t.stunned = 1; log.push(`* O ${t.name} ficou atordoado!`); }
      if (sp.form === 'mina' && t.hp > 0) { t.mine = (t.mine || 0) + Math.round(dmg * 1.7); log.push(`* Uma mina rúnica gruda no ${t.name}. Ela explode quando ele agir.`); }
      if (sp.el === 'sal' && t.hp > 0) { if (!t.corrode) { t.def0 = t.def; t.def = Math.round(t.def * 0.65); log.push(`* O sal corrói a defesa do ${t.name}.`); } t.corrode = 3; }
      if (sp.mod === 'selo' && t.hp > 0) { t.dot = { d: Math.max(1, Math.round(dmg * 0.35)), t: 3, icon: 'selo', col: RUNES[sp.el].col }; log.push(`* Um selo rosa queima no ${t.name}.`); }
      log.unshift(`* ${t.name}: ${dmg} de dano${wk > 1 ? ' {y}(ponto fraco!){/}' : wk < 1 ? ' (resistiu)' : ''}.`);
      if (t.d.boss && sp.el === 'brasa') t.lastFire = true;
    });
    if (sp.el === 'polvora') BT.powder.push(Math.max(1, Math.round(spellPower(sp) * pm * 0.4 * markM)));
    if (drained) { G.hp = Math.min(G.st.mhp, G.hp + drained); log.push(`* Você absorveu ${drained} PV.`); sfx('heal'); }
    await wait(16);
  }
  if (sp.mod === 'bandeira') { BT.magT = Math.max(BT.magT, 3); BT.buff.atkM = Math.max(BT.buff.atkM, 1.2); BT.buff.atkT = Math.max(BT.buff.atkT, 3); log.push('* {y}Bandeira hasteada!{/} Ataque e magia +20% por 2 turnos.'); }
  const uniq = [...new Set(log)].slice(0, 5);
  await bSay(uniq.join('\n'), { auto: 60 });
}
async function lumeSing() {
  sfx('blipTri', 1250);
  const hurt = G.hp < G.st.mhp * 0.55;
  if (G.flags.lumeFone && !BT.foneSaid) { BT.foneSaid = true; await bSay('* A Lume ajeita o fone remendado e canta mais alto.', { auto: 30 }); }
  const opts = hurt ? ['heal', 'heal', 'buff'] : ['buff', 'stun', 'heal', 'stun'];
  const k = pickOne(opts);
  BT.lumeT = 60; burst(220, 100, '#ffe066', 16);
  if (k === 'heal') { const h = Math.round(G.st.mhp * (G.flags.lumeFone ? 0.3 : 0.22)); G.hp = Math.min(G.st.mhp, G.hp + h); sfx('heal'); await bSay(`* {y}Lume{/} canta uma balada morna. +${h} PV.`, { auto: 50 }); }
  else if (k === 'buff') { BT.buff.atkM = Math.max(BT.buff.atkM, 1.4); BT.buff.atkT = Math.max(BT.buff.atkT, 3); sfx('buff'); await bSay('* {y}Lume{/} toca um refrão animado. Ataque ×1.4 por 2 turnos!', { auto: 50 }); }
  else { const t = pickOne(BT.en.filter(e => e.alive)); const dmg = Math.round(10 + G.lv * 3 + G.st.mag); hitEnemy(t, dmg, 'hit', '#ffe066'); if (!t.d.boss) t.stunned = 1; await bSay(`* {y}Lume{/} solta uma nota aguda! ${t.name}: ${dmg} de dano${t.d.boss ? '' : ' e atordoado'}.`, { auto: 50 }); }
}
function spellFx(sp, targets) {
  const col = RUNES[sp.el].col;
  for (const t of targets) {
    for (let i = 0; i < 18; i++) {
      const sx = sp.form === 'onda' ? rand(0, 240) : 120 + rand(-8, 8), sy = sp.form === 'onda' ? 112 : 200;
      const tt = rand(16, 22);
      BT.parts.push({ x: sx, y: sy, vx: (t.x - sx) / tt + rand(-0.3, 0.3), vy: (t.y - sy) / tt + rand(-0.3, 0.3), life: tt, col, sz: 2, then: true });
    }
    setTimeout(() => burst(t.x, t.y, col, 24), 330);
  }
}
function burst(x, y, col, n) { for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(0.5, 2.2); BT.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(18, 34), col: Math.random() < 0.3 ? '#ffffff' : col, sz: Math.random() < 0.5 ? 2 : 1 }); } }
function popNum(e, s, col) { BT.nums.push({ x: e.x, y: e.y - (e.h || 32) / 2 - 6, s, col, t: 50 }); }
async function victory() {
  const _v = await victory0(); if (G.flags._pendingTech) { G.flags._pendingTech = false; await grantTechs(true); } return _v;
}
async function victory0() {
  playMusic(null); J.victory();
  let xp = 0; const drops = [];
  for (const e of BT.en) { xp += e.d.xp; for (const [k, p] of (e.d.drops || [])) if (Math.random() < p) { giveItem(k); drops.push(ITEMS[k].name); break; } }
  G.xp += xp; G.battles++;
  const rds = runeDrops(); if (rds.length) drops.push(...rds.map(id => `{${RUNES[id].col}}runa ${RUNES[id].name}{/}`));
  await bSay(`* VOCÊ VENCEU!\n* Ganhou {y}${xp} EXP{/}.` + (drops.length ? `\n* Encontrou: ${drops.join(', ')}.` : ''));
  while (G.xp >= xpNeed(G.lv)) {
    G.xp -= xpNeed(G.lv); G.lv++;
    const g = spec().grow; for (const k in g) G.st[k] += g[k];
    G.hp = Math.min(G.st.mhp, G.hp + Math.round(G.st.mhp * 0.25)); G.mp = Math.min(G.st.mmp, G.mp + Math.round(G.st.mmp * 0.25)); J.level(); burst(BPX, BPY - 14, '#ffe066', 30);
    if (typeof grantTechs === 'function') G.flags._pendingTech = true;
    await bSay(`[Nível ${G.lv} alcançado! PV +${g.mhp}, PM +${g.mmp}, ATQ +${g.atk}, DEF +${g.def}, MAG +${g.mag}. +25% de PV e PM.]`, { cat: true });
  }
}
async function gameOver() {
  await fadeOut(30); BT.on = false; V.scene = 'black'; playMusic(null); await fadeIn(1);
  J.gameover(); await wait(30);
  await say('[Registro nº 31: tampa aberta. Conteúdo: vazio.]', 'cat');
  await say('[Arquivando...]', 'cat');
  await say('* ...mas a sua história ainda não terminou.', 'void');
  const sv = readSave();
  const c = await choose('* O que você faz?', [sv ? 'Voltar à última Lanterna' : 'Recomeçar do despertar', 'Tela de título'], 'n');
  if (c === 0) { if (sv) applySave(sv); else { const nm = G.name; G = newState(); G.name = nm; G.flags.introDone = true; loadMap('despertar', 7, 6, 'down'); } G.hp = G.st.mhp; G.mp = G.st.mmp; G.flask.n = G.flask.max; V.fade = 1; fadeIn(30); }
  else { setTimeout(titleFlow, 0); }
}

// ---------- update / render da batalha ----------
const BTN = ['MORDER', 'MAGIA', 'ITEM', 'AVALIAR', 'FUGIR'];
// depois da primeira técnica, MORDER vira TÉCNICA (a Mordida comum fica no topo da lista)
const btnLabel = i => i === 0 && G.tech && G.tech.length ? 'TÉCNICA' : BTN[i];
function updateBattle() {
  for (const p of BT.parts) { p.x += p.vx; p.y += p.vy; p.life--; if (!p.then) p.vy += 0.03; }
  BT.parts = BT.parts.filter(p => p.life > 0);
  for (const n of BT.nums) { n.t--; n.y -= 0.35; } BT.nums = BT.nums.filter(n => n.t > 0);
  for (const e of BT.en) { if (e.shake > 0) e.shake--; if (e.flash > 0) e.flash--; if (e.hpShow > 0) e.hpShow--; if (e.dying > 0) e.dying--; }
  if (BT.hurt > 0) BT.hurt--;
  if (UI.stack.length) return;
  const m = BT.mode;
  if (m === 'text') {
    BT.tw.update();
    if (btnp('a')) { if (!BT.tw.done) BT.tw.skip(); else BT.res(); }
    else if (BT.tw.done && BT.auto && ++BT.autoT > BT.auto) BT.res();
  } else if (m === 'main') {
    BT.tw.update();
    if (navp('left')) { BT.menuIdx = (BT.menuIdx + 4) % 5; sfx('move'); }
    if (navp('right')) { BT.menuIdx = (BT.menuIdx + 1) % 5; sfx('move'); }
    if (btnp('a')) { sfx('select'); BT.res(BT.menuIdx); }
  } else if (m === 'target') {
    const alive = BT.en.map((e, i) => e.alive ? i : -1).filter(i => i >= 0);
    let k = alive.indexOf(BT.tgt); if (k < 0) k = 0;
    if (navp('left') || navp('up')) { k = (k + alive.length - 1) % alive.length; sfx('move'); }
    if (navp('right') || navp('down')) { k = (k + 1) % alive.length; sfx('move'); }
    BT.tgt = alive[k];
    if (btnp('a')) { sfx('select'); BT.res(BT.tgt); } else if (btnp('b')) { sfx('cancel'); BT.res(-1); }
  } else if (m === 'timing') {
    const t = BT.tm; t.x += t.v;
    if (btnp('a')) { const d = Math.abs(t.x - 120) / 96; BT.res(d < 0.06 ? 2.0 : Math.max(0.45, 1.75 - 1.3 * d)); }
    else if (t.x > 218) BT.res(0);
  } else if (DEFMODES[m]) DEFMODES[m].update();
  else if (m === 'guard') {
    const g = BT.ring;
    if (g.state === 0) {
      if (g.fake && !g.hold && g.r <= g.fake) { g.hold = Math.round(rand(14, 26)); g.fake = 0; }
      if (g.hold > 0) g.hold--; else g.r -= g.v;
      if (btnp('a')) { const P = DF().perfect, Gd = DF().good; if (g.r >= P[0] && g.r <= P[1]) g.res = 'perfect'; else if (g.r >= Gd[0] && g.r <= Gd[1]) g.res = 'good'; else g.res = 'fail'; g.state = 1; g.t = 14; }
      else if (g.r < 4) { g.res = 'fail'; g.state = 1; g.t = 10; }
    } else if (--g.t <= 0) BT.res(g.res);
  }
}
function circlePx(cx, cy, r, col) {
  bx.fillStyle = col; r = Math.max(0, Math.round(r));
  let x = r, y = 0, err = 1 - r;
  while (x >= y) {
    for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) bx.fillRect(cx + a, cy + b, 1, 1);
    y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
  }
}
function drawBattle() {
  bx.fillStyle = '#07050c'; bx.fillRect(0, 0, W, H);
  drawBattleBg();
  drawParty();
  for (const e of BT.en) {
    if (!e.alive && !(e.dying > 0)) continue;
    const sp = SP[e.sp], fr = sp[Math.floor(FRAME / 20) % sp.length];
    const w = fr.width * e.sc, h = fr.height * e.sc;
    let dx = Math.round(e.x - w / 2 + (e.shake ? Math.sin(e.shake * 1.7) * 4 : 0)), dy = Math.round(e.y - h / 2 + (e.d.sp === 'bat' ? Math.sin(FRAME * 0.08) * 3 : 0));
    if (e.d.boss) dy += Math.round(Math.sin(FRAME * 0.05) * 1.5);
    if (e.lunge > 0) { e.lunge--; dx -= Math.round(Math.sin((1 - e.lunge / 16) * Math.PI) * 16); }
    bx.globalAlpha = e.alive ? 1 : e.dying / 36;
    bx.drawImage(e.flash > 0 && e.flash % 4 < 2 ? silhouette(fr, '#ffffff') : fr, dx, dy, w, h);
    if (e.frozen > 0) { bx.globalAlpha = 0.45; bx.drawImage(silhouette(fr, '#7ad0f0'), dx, dy, w, h); }
    bx.globalAlpha = 1;
    if (e.alive && (e.hpShow > 0 || e.d.boss)) { const bw = e.d.boss ? 64 : Math.max(22, Math.min(36, w)); bar(e.x - bw / 2, dy + h + 3, bw, 4, e.hp / e.mhp, '#4ad04a'); bx.fillStyle = '#000'; }
    if (BT.mode === 'target' && BT.tgt === BT.en.indexOf(e) && FRAME % 30 < 20) txt('▼', e.x - 3, dy - 14, { col: '#ffe066' });
    if (e.alive && typeof enemyIcons === 'function') enemyIcons(e, dx, dy, w, h);
  }
  if (BT.biteFx) {
    const e = BT.biteFx.e, p = Math.min(1, (BT.biteFx.t = (BT.biteFx.t || 0) + 1) / 10), hw = Math.max(14, Math.round((e.h || 32) * 0.6)), gap = hw * (1 - p);
    for (const s of [-1, 1]) {
      const y0 = Math.round(e.y + s * (gap + 2));
      bx.fillStyle = '#120e1a'; bx.fillRect(e.x - hw - 1, s < 0 ? y0 - 8 : y0 + 2, hw * 2 + 2, 6);
      bx.fillStyle = '#7a4a2a'; bx.fillRect(e.x - hw, s < 0 ? y0 - 7 : y0 + 3, hw * 2, 4);
      bx.fillStyle = '#f2ecdc'; for (let i = -hw + 1; i < hw - 2; i += 4) for (let k = 0; k < 3; k++) { const ww = 3 - k; bx.fillRect(e.x + i + (3 - ww) / 2, s < 0 ? y0 - 3 + k : y0 + 2 - k, ww, 1); }
    }
  }
  drawFx();

  for (const p of BT.parts) { bx.fillStyle = p.col; bx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz); }
  // caixa (desenhada com deslocamento: a arena ficou maior)
  bx.save(); bx.translate(0, BOXDY); TXO.y = BOXDY;
  box(8, 116, 224, 72, { edge: BT.hurt > 0 && BT.hurt % 4 < 2 ? '#ff6b6b' : '#ffffff' });
  const m = BT.mode;
  if (m === 'text' || m === 'main') BT.tw.draw(16, 122, 12);
  else if (m === 'target') {
    txt('Escolha o alvo:', 16, 122, { col: '#b8aecb' });
    BT.en.forEach((e, i) => { if (!e.alive) return; const yy = 136 + i * 13; const sel = i === BT.tgt; txt((sel ? '{y}►{/} ' : '  ') + e.name, 16, yy, { col: sel ? '#ffe066' : '#ffffff' }); bar(160, yy + 3, 56, 5, e.hp / e.mhp, '#4ad04a'); });
  } else if (m === 'timing') {
    txt('MORDA!', 120, 124, { align: 'center', col: '#ffe066' });
    bx.fillStyle = '#5a1a2a'; bx.fillRect(24, 146, 192, 14);
    bx.fillStyle = '#c86a2a'; bx.fillRect(60, 146, 120, 14);
    bx.fillStyle = '#f0c040'; bx.fillRect(100, 146, 40, 14);
    bx.fillStyle = '#fff6c0'; bx.fillRect(114, 146, 12, 14);
    bx.fillStyle = '#000'; bx.fillRect(119, 144, 2, 18);
    const tx = Math.round(BT.tm.x); bx.fillStyle = '#000'; bx.fillRect(tx - 2, 141, 5, 24); bx.fillStyle = '#ffffff'; bx.fillRect(tx - 1, 142, 3, 22);
    txt('Aperte A no centro', 120, 170, { align: 'center', col: '#8a8099' });
  } else if (DEFMODES[m]) DEFMODES[m].draw();
  else if (m === 'guard') {
    const g = BT.ring, cx = 120, cy = 150;
    circlePx(cx, cy, 10, '#5a5070'); circlePx(cx, cy, 11, '#5a5070');
    const col = g.state === 1 ? (g.res === 'fail' ? '#ff6b6b' : g.res === 'perfect' ? '#8fe3ff' : '#ffe066') : (g.col || '#ffffff');
    if (g.state === 0) { circlePx(cx, cy, g.r, col); circlePx(cx, cy, g.r - 1, col); }
    else { circlePx(cx, cy, 10, col); circlePx(cx, cy, 11, col); circlePx(cx, cy, 12, col); }
    bx.fillStyle = '#f2ecdc'; bx.fillRect(cx - 4, cy - 3, 8, 6); bx.fillStyle = '#7a4a2a'; bx.fillRect(cx - 3, cy - 2, 6, 4);
    txt(g.state === 1 ? (g.res === 'fail' ? 'Tarde demais!' : g.res === 'perfect' ? 'PERFEITO!' : 'DEFENDEU!') : (g.label || 'DEFENDA!'), 120, 124, { align: 'center', col: g.state === 1 ? col : '#ffe066' });
    txt('A quando o anel tocar o círculo', 120, 170, { align: 'center', col: '#8a8099' });
  }
  if (m === 'text' && BT.tw.done && !BT.auto && FRAME % 40 < 26) txt('▼', 220, 174, { col: '#8a8099' });
  bx.restore(); TXO.y = 0;
  drawPartyStrip();
  for (let i = 0; i < 5; i++) {
    const x = 4 + i * 47, sel = m === 'main' && BT.menuIdx === i;
    const col = sel ? '#ffe066' : '#f28c28';
    box(x, 224, 44, 15, { bw: 1, edge: col, fill: '#000' });
    txt(btnLabel(i), x + 23, 225, { align: 'center', col });
  }
  for (const n of BT.nums) txt(n.s, n.x, n.y, { align: 'center', col: n.col, shadow: true, alpha: Math.min(1, n.t / 15) });
  if (typeof playerIcons === 'function') playerIcons();
}

// ================= EVOLUÇÃO / FIM / TÍTULO =================
function evolveScreen() {
  const opts = spec().evos;
  const w = {
    type: 'evolve', idx: 0, conf: false,
    update() {
      if (this.locked) return;
      if (this.conf) {
        if (btnp('a')) { sfx('select'); const id = opts[this.idx]; this.locked = true; this.hidden = true; evolveAnim(id).then(() => closeWin(this, id)); }
        else if (btnp('b')) { sfx('cancel'); this.conf = false; }
        return;
      }
      if (navp('left') || navp('right')) { this.idx = 1 - this.idx; sfx('move'); }
      if (btnp('a')) { sfx('select'); this.conf = true; }
    },
    draw() {
      if (this.hidden) return;
      bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
      txt('ESCOLHA SUA EVOLUÇÃO', 120, 8, { align: 'center', col: '#ffe066' });
      opts.forEach((id, i) => {
        const s = SPECIES[id], x = 8 + i * 116, sel = i === this.idx;
        box(x, 22, 108, 162, { bw: sel ? 2 : 1, edge: sel ? '#ffe066' : '#5a5070' });
        const fr = SP[s.sp][Math.floor(FRAME / 30) % 2 ? 0 : 2];
        const bob = sel ? Math.round(Math.sin(FRAME * 0.15) * 2) : 0;
        bx.drawImage(fr, x + 34, 28 + bob, 40, 40);
        txt(s.name, x + 54, 71, { align: 'center', col: sel ? '#ffe066' : '#ffffff' });
        txt(s.tag, x + 54, 83, { align: 'center', col: id === 'ferro' ? '#ffa94d' : '#8fe3ff' });
        let yy = 98;
        s.desc.forEach(d => { yy += txt('· ' + d, x + 6, yy, { w: 16, lh: 11, col: '#d8d0e8' }) * 11 + 3; });
      });
      const sp = SPECIES[opts[this.idx]], s = sp.bonus;
      if (this.conf) {
        box(8, 188, 224, 48, { bw: 2, edge: '#ffe066' });
        txt(`Evoluir para {y}${sp.name}{/}?`, 120, 192, { align: 'center' });
        txt('Não dá pra voltar atrás.', 120, 204, { align: 'center', col: '#d8d0e8' });
        txt('A evoluir · B pensar mais', 120, 220, { align: 'center', col: '#8a8099' });
        return;
      }
      box(8, 188, 224, 48, { bw: 1, edge: '#8a8099' });
      txt(`Bônus: PV +${s.mhp}  PM +${s.mmp}  ATQ +${s.atk}`, 16, 192);
      txt(`       DEF +${s.def}  MAG +${s.mag}`, 16, 204);
      txt('◄ ► escolhe · A confirma', 120, 220, { align: 'center', col: '#8a8099' });
    }
  };
  return openWin(w);
}
async function evolveAnim(id) {
  V.evo = { from: SP[spec().sp], to: SP[SPECIES[id].sp], t: 0 };
  V.busy++;
  playMusic(null);
  for (let i = 0; i < 18; i++) { V.evo.t = i; await wait(Math.max(3, 16 - i)); }
  J.evolve(); V.evo.flash = 30; await wait(30);
  const b = SPECIES[id].bonus; for (const k in b) G.st[k] += b[k];
  G.species = id; G.lv = 1; G.xp = 0; G.hp = G.st.mhp; G.mp = G.st.mmp;
  await wait(60); V.evo = null; V.busy--;
  playMusic(WD.map.music);
}
function drawEvo() {
  const e = V.evo; bx.fillStyle = '#000'; bx.globalAlpha = 0.85; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1;
  const sp = e.flash != null ? e.to[0] : (e.t % 2 ? e.to[0] : e.from[0]);
  const sil = e.flash == null || e.flash > 0;
  bx.drawImage(sil && e.flash == null ? silhouette(sp, '#ffffff') : sp, 72, 72, 96, 96);
  if (e.flash > 0) { bx.fillStyle = `rgba(255,255,255,${e.flash / 30})`; bx.fillRect(0, 0, W, H); e.flash--; }
  for (let i = 0; i < 3; i++) { const a = FRAME * 0.05 + i * 2.1, r = 70; bx.fillStyle = '#ffe066'; bx.fillRect(120 + Math.cos(a) * r, 120 + Math.sin(a) * r, 2, 2); }
}
function endScreen(ch = 1) {
  playMusic('ending');
  const CH = { 1: ['FIM DO CAPÍTULO 1', 'Tente não ser aberto', 'Próximo: Capítulo 2 — Herói Número 30'], 2: ['FIM DO CAPÍTULO 2', 'Herói Número 30', 'Próximo: Capítulo 3 — Quem Escreve o Catálogo'] }[ch];
  const w = {
    type: 'end', t: 0,
    update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
    draw() {
      bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) { const x = (hash(i, 1) % 240 + FRAME * (0.1 + (i % 3) * 0.05)) % 240, y = hash(i, 2) % 240; bx.fillStyle = i % 4 ? '#3a3150' : '#8a8099'; bx.fillRect(x | 0, y, 1, 1); }
      const a = Math.min(1, this.t / 60);
      bx.globalAlpha = a; bx.drawImage(SP[spec().sp][Math.floor(FRAME / 40) % 2 ? 0 : 2], 96, 26, 48, 48); bx.globalAlpha = 1;
      txt(CH[0], 120, 84, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
      txt(CH[1], 120, 104, { align: 'center', col: '#b8aecb', alpha: a });
      const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Feitiços criados: ${G.spells.length}`, `Batalhas vencidas: ${G.battles}`, `Tempo: ${fmtTime(G.time)}`];
      L.forEach((l, i) => txt(l, 120, 128 + i * 12, { align: 'center', alpha: clamp((this.t - 40) / 40, 0, 1) }));
      txt(CH[2], 120, 186, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
      if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' });
    }
  };
  return openWin(w);
}
const DUST = Array.from({ length: 50 }, (_, i) => ({ x: Math.random() * 240, y: Math.random() * 240, v: 0.1 + Math.random() * 0.25, c: i % 5 ? '#2a2236' : '#5a5070' }));
function drawTitle() {
  bx.fillStyle = '#07050c'; bx.fillRect(0, 0, W, H);
  for (const d of DUST) { d.y -= d.v; if (d.y < 0) { d.y = 240; d.x = Math.random() * 240; } bx.fillStyle = d.c; bx.fillRect(d.x | 0, d.y | 0, 1, 1); }
  const g = bx.createRadialGradient(120, 150, 4, 120, 150, 90); g.addColorStop(0, 'rgba(242,181,68,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(0, 0, W, H);
  const hop = Math.max(0, Math.sin(FRAME * 0.06)) * 6 | 0;
  bx.fillStyle = 'rgba(0,0,0,0.5)'; bx.fillRect(98, 180, 44, 4);
  const fr = SP.mimic[(FRAME % 180) < 10 ? 1 : (FRAME % 300) > 280 ? 2 : 0];
  bx.drawImage(fr, 88, 116 - hop, 64, 64);
  // com a lista de saves ou uma pergunta aberta, o título some para não passar por cima
  if (UI.stack.some(w => (w.type === 'list' && w.o.title) || w.type === 'dialog')) return;
  txt('RENASCI', 120, 28, { align: 'center', sz: 2, col: '#ffe066', shadow: true });
  txt('COMO BAÚ', 120, 54, { align: 'center', sz: 2, col: '#ffe066', shadow: true });
  txt('e a masmorra quer me abrir', 120, 84, { align: 'center', col: '#b8aecb' });
  if (V.titleWait && FRAME % 60 < 40) txt('Toque na tela ou aperte A', 120, 200, { align: 'center', col: '#ffffff' });
  txt('Capítulos 1–5', 6, 226, { col: '#5a5070' }); txt('v2.0', 234, 226, { align: 'right', col: '#5a5070' });
}
async function titleFlow() {
  UI.stack.length = 0; V.busy = 0; BT.on = false; V.evo = null;
  V.scene = 'title'; V.fade = 1; fadeIn(30); playMusic('title');
  V.titleWait = true;
  const tok = V.titleTok = {}; await new Promise(r => { const f = () => { if (V.titleTok !== tok || V.scene !== 'title') return; if (btnp('a')) { r(); return; } requestAnimationFrame(f); }; f(); });
  if (V.titleTok !== tok || V.scene !== 'title') return;
  V.titleWait = false; unlockAudio(); sfx('select'); playMusic('title'); AU.curName === 'title' || playMusic('title');
  if (!readSave(SLOT)) { const k = SAVE_KEYS.findIndex((_, i) => readSave(i)); if (k >= 0) setSlot(k); }
  const has = anySave();
  const items = has ? [{ label: 'Continuar' }, { label: 'Carregar' }, { label: 'Novo jogo' }] : [{ label: 'Novo jogo' }];
  let r, slot = SLOT;
  while (true) {
    r = await list({ x: 70, y: 176, w: 100, items, cancel: false });
    const lb = items[r].label;
    if (lb === 'Carregar') { const k = await pickSlot('Carregar qual save?', 'load'); if (k < 0) continue; slot = k; break; }
    if (lb === 'Novo jogo' && has) { const k = await pickSlot('Novo jogo em qual espaço?', 'new'); if (k < 0) continue; slot = k; break; }
    break;
  }
  await fadeOut(30);
  setSlot(slot);
  if (items[r].label !== 'Novo jogo') { applySave(readSave(slot)); await fadeIn(30); return; }
  G = newState(); V.scene = 'black'; V.fade = 0;
  await runScript(STORY.intro);
}

// ================= LOOP =================
function frame() {
  FRAME++;
  JP = { ...JPQ }; for (const k in JPQ) delete JPQ[k];
  for (let i = WAITS.length - 1; i >= 0; i--) if (--WAITS[i].n <= 0) { const w = WAITS.splice(i, 1)[0]; w.r(); }
  if (V.tw) { const t = V.tw; t.t++; V.fade = t.from + (t.to - t.from) * Math.min(1, t.t / t.n); if (t.t >= t.n) { V.tw = null; t.r(); } }
  if (V.scene === 'world' || V.scene === 'battle') G.time += 1 / 60;
  // update
  const top = UI.top();
  if (top) top.update();
  if (V.scene === 'world' && !V.evo) updateWorld();
  else if (V.scene === 'battle') updateBattle();
  // render
  if (V.scene === 'world') drawWorld();
  else if (V.scene === 'battle') drawBattle();
  else if (V.scene === 'title') drawTitle();
  else { bx.fillStyle = '#000'; bx.fillRect(0, 0, W, H); }
  if (V.evo) drawEvo();
  for (const w of UI.stack) w.draw();
  if (V.flashW) { bx.fillStyle = '#ffffff'; bx.fillRect(0, 0, W, H); }
  if (V.fade > 0) { bx.fillStyle = `rgba(0,0,0,${V.fade})`; bx.fillRect(0, 0, W, H); }
  let sx = 0, sy = 0; if (V.shake > 0) { V.shake--; sx = Math.round(rand(-2, 2)); sy = Math.round(rand(-2, 2)); }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(buf, 0, 0, W, H, Math.round(sx * S), Math.round(sy * S), cvs.width, cvs.height);
  if (sx || sy) for (const t of TQ) { t.x += sx; t.y += sy; }
  flushText();
  requestAnimationFrame(frame);
}
function boot() {
  buildFont(); buildSprites(); buildTiles();
  resize(); setupTouch();
  try { window.claude?.hot?.snapshot?.(() => ({ save: V.scene === 'world' ? snapshot() : null })); } catch (e) { }
  requestAnimationFrame(frame);
  titleFlow();
}

// ================= PATRULHAS / DISFARCE =================
function patrolVision(e) {
  const out = [], [dx, dy] = DIRS[e.dir];
  for (let i = 1; i <= e.range; i++) {
    const x = e.tx + dx * i, y = e.ty + dy * i;
    if (solidTile(tileAt(x, y))) break;
    const o = entAt(x, y, true); if (o && o.kind !== 'patrol') break;
    out.push([x, y]);
  }
  return out;
}
function updatePatrols() {
  for (const e of WD.ents) {
    if (e.kind !== 'patrol') continue;
    if (e.stun > 0) e.stun--;
    if (e.alert > 0) continue;
    if (e.mv > 0) { e.px += Math.sign(e.tx * TS - e.px); e.py += Math.sign(e.ty * TS - e.py); e.mv--; }
    else if (--e.wait <= 0) {
      e.wait = e.delay;
      if (e.turn) { e.ti = (e.ti + 1) % e.turn.length; e.dir = e.turn[e.ti]; }
      else {
        const [gx, gy] = e.path[e.wp];
        if (e.tx === gx && e.ty === gy) { e.wp = (e.wp + 1) % e.path.length; e.wait = 50; }
        else {
          const dx = Math.sign(gx - e.tx), dy = Math.sign(gy - e.ty);
          e.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
          const nx = e.tx + dx, ny = e.ty + dy;
          if ((nx === WD.x && ny === WD.y) || !passable(nx, ny, true)) { e.wp = (e.wp + 1) % e.path.length; e.wait = 40; if (WD.disg && nx === WD.x && ny === WD.y && !e.saidBox) { e.saidBox = true; e.bubble = { t: 90, s: 'Só um baú.' }; } }
          else { e.tx = nx; e.ty = ny; e.mv = TS; }
        }
      }
    }
    if (e.bubble && e.bubble.t > 0) e.bubble.t--;
    if (e.stun > 0 || (WD.disg && !e.light)) continue;
    const seen = patrolVision(e).some(([x, y]) => x === WD.x && y === WD.y) || (Math.abs(e.px - WD.fx) < 12 && Math.abs(e.py - WD.fy) < 12);
    if (seen) {
      e.alert = 1; sfx('encounter');
      runScript(async () => { await wait(36); await STORY.spotted(e); e.alert = 0; await encounter(e); });
      break;
    }
  }
}
function drawPatrolVision(ox, oy) {
  for (const e of WD.ents) {
    if (e.kind !== 'patrol') continue;
    const col = e.stun > 0 ? 'rgba(140,140,170,0.10)' : e.alert ? 'rgba(255,80,80,0.30)' : e.light ? 'rgba(255,240,180,0.30)' : WD.disg ? 'rgba(160,220,255,0.10)' : 'rgba(255,224,102,0.16)';
    bx.fillStyle = col;
    for (const [x, y] of patrolVision(e)) bx.fillRect(x * TS - ox, y * TS - oy, TS, TS);
  }
}

// ================= IA DOS CHEFES =================

