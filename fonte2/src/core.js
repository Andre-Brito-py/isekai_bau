// ================= MOTOR =================
'use strict';
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0; h = (h ^ (h >> 13)) * 1274126177 >>> 0; return (h ^ (h >> 16)) >>> 0; }
let W = 240, H = 240; const TS = 16;   // W cresce com o celular deitado (tela larga); H é sempre 240
const cvs = document.getElementById('screen'), ctx = cvs.getContext('2d');
const buf = mk(W, H); let bx = buf.getContext('2d'); bx.imageSmoothingEnabled = false;
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
  const sw = Math.max(120, st.width) * DPR, sh = Math.max(120, st.height) * DPR;
  // celular DEITADO: a altura manda (240 px de jogo) e a largura do jogo cresce até preencher a tela (mapa mais largo)
  if (st.width > st.height * 1.05) { S = DPR >= 2 ? sh / H : Math.max(1, Math.floor(sh / H)); S = Math.max(1, S); W = Math.max(240, Math.min(520, Math.floor(sw / S))); }
  else { W = 240; const avail = Math.min(sw, sh); S = DPR >= 2 ? avail / W : Math.max(1, Math.floor(avail / W)); }
  S = Math.max(1, S);
  if (buf.width !== W) { buf.width = W; lightC.width = W; buf.getContext('2d').imageSmoothingEnabled = false; }
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
// câmera de longe no mapa: o mundo é desenhado num quadro maior (ZOOM_MUNDO x) e esticado na tela; o texto do mundo
// entra na fila já dividido por TXZ (fica do tamanho certo) e o painel do mapa é desenhado depois, em tamanho normal
let TXZ = 1, HUD_ADIA = false, HUD_PEND = null, ZOOM_MUNDO = 1.5, ZOOM_INT = 0.9, MUNDO_BIG = false;
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
    TQ.push({ chars: ln, x: (xx + TXO.x) / TXZ, y: (y + TXO.y + i * (o.lh || 12 * sz)) / TXZ, n: 1e9, sz: sz / TXZ, shadow: o.shadow, alpha: o.alpha, fx: o.fx });
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
      TQ.push({ chars: ln, x: (x + TXO.x) / TXZ, y: (y + TXO.y + i * lh) / TXZ, n: rem, sz: 1 / TXZ, fx: this.fx, shadow: o.shadow });
      rem -= ln.length;
    }
  }
}

// ---------- input ----------
const KEYS = {}, JPQ = {}; let JP = {}; const HELD = {}; let JOYMAG = 1, JOYANG = null;
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
// ícones em pixel para os botões de toque (grade de 0/1 vira SVG nítido)
function pixSvg(rows, px, col) { const w = rows[0].length, h = rows.length; let r = ''; rows.forEach((l, y) => [...l].forEach((c, x) => { if (c !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c === 'x' ? col : c === 'o' ? 'rgba(0,0,0,.35)' : col}"/>`; })); return `<svg width="${w * px}" height="${h * px}" viewBox="0 0 ${w} ${h}">${r}</svg>`; }
const ICB = {
  a: ['..xxx..', '.xx.xx.', 'xx...xx', 'xx...xx', 'xxxxxxx', 'xx...xx', 'xx...xx'],
  b: ['xxxxx..', 'xx..xx.', 'xx..xx.', 'xxxxx..', 'xx..xx.', 'xx..xx.', 'xxxxx..'],
  menu: ['xxxxxxx', '.......', 'xxxxxxx', '.......', 'xxxxxxx'],
  som: ['...x....', '..xx..x.', 'xxxx...x', 'xxxx.x.x', 'xxxx...x', '..xx..x.', '...x....'],
  mudo: ['...x....', '..xx....', 'xxxx.x.x', 'xxxx..x.', 'xxxx.x.x', '..xx....', '...x....']
};
function muteLabel() { const el = document.getElementById('bs'); if (!el) return; el.innerHTML = pixSvg(AU.muted ? ICB.mudo : ICB.som, 3, AU.muted ? '#ff8a9a' : 'rgba(255,255,255,.85)'); }
function iconesToque() {
  const s = (id, ic, px, col) => { const el = document.getElementById(id); if (el) el.innerHTML = pixSvg(ICB[ic], px, col); };
  s('ba', 'a', 4, '#ffd870'); s('bb', 'b', 3, '#ff9ab4'); s('bm', 'menu', 3, 'rgba(255,255,255,.85)'); muteLabel();
}
function toggleMute() { unlockAudio(); setMuted(!AU.muted); muteLabel(); }
function setupTouch() {
  // ANALÓGICO: o pino segue o dedo (preso ao círculo). Direção pelo ângulo: 8 setores no mapa, 4 em menus e batalha,
  // com zona morta no centro e uma margem para o dedo não ficar trocando de direção na fronteira. A força (quanto o
  // pino está empurrado) vai em JOYMAG: empurrar só um pouco faz o baú andar devagar.
  const dp = document.getElementById('joy'), dz = document.getElementById('dzone') || dp, kn = document.getElementById('knob'); let pid = null, cur = null;
  const ANG = { right: 0, down: 90, left: 180, up: -90 };
  const ANG8 = { right: 0, 'down-right': 45, down: 90, 'down-left': 135, left: 180, 'up-left': -135, up: -90, 'up-right': -45 };
  const angDiff = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  const R = 46, DEAD = 12;
  const moveKnob = (x, y) => { kn.style.transform = `translate(${x}px,${y}px)`; };
  const dirOf = e => {
    const r = dp.getBoundingClientRect(); let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const dist = Math.hypot(dx, dy);
    const k = dist > R ? R / dist : 1; moveKnob(dx * k, dy * k);
    JOYMAG = Math.min(1, dist / R);
    JOYANG = dist >= DEAD ? Math.atan2(dy, dx) * 180 / Math.PI : null;   // ângulo fino (traçar o anel do círculo mágico)
    if (dist < (cur ? DEAD - 4 : DEAD)) return null;
    const a = Math.atan2(dy, dx) * 180 / Math.PI;
    const T = V.scene === 'world' ? ANG8 : ANG, half = V.scene === 'world' ? 22.5 : 45;
    if (cur && T[cur] != null && angDiff(a, T[cur]) < half + 8) return cur;
    let best = 'right', bd = 999; for (const q in T) { const d = angDiff(a, T[q]); if (d < bd) { bd = d; best = q; } } return best;
  };
  const setDir = d => {
    if (d === cur) return;
    const on = d ? d.split('-') : [];
    for (const q of ['up', 'down', 'left', 'right']) { if (on.includes(q)) press(q); else release(q); }
    cur = d; dp.className = on.map(q => 'on-' + q).join(' ') + (pid != null ? ' ativo' : '');
    if (d && navigator.vibrate) { try { navigator.vibrate(6); } catch (_) { } }
  };
  dz.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); pid = e.pointerId; try { dz.setPointerCapture(pid); } catch (_) { } cur = null; dp.classList.add('ativo'); setDir(dirOf(e)); });
  dz.addEventListener('pointermove', e => { if (e.pointerId === pid) setDir(dirOf(e)); });
  const end = e => { if (e.pointerId === pid) { pid = null; JOYMAG = 1; JOYANG = null; moveKnob(0, 0); setDir(null); dp.classList.remove('ativo'); } };
  dz.addEventListener('pointerup', end); dz.addEventListener('pointercancel', end); dz.addEventListener('lostpointercapture', end);
  document.querySelectorAll('[data-k]').forEach(el => {
    const k = el.dataset.k;
    el.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); el.classList.add('down'); if (k === 'mute') toggleMute(); else press(k); });
    const up = () => { el.classList.remove('down'); if (k !== 'mute') release(k); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);
  });
  cvs.addEventListener('pointerdown', e => { e.preventDefault(); unlockAudio(); if (V.scene === 'title' || (UI.top() && UI.top().type === 'dialog')) { press('a'); setTimeout(() => release('a'), 60); } });
  addEventListener('contextmenu', e => e.preventDefault());
  // no celular: no primeiro toque, tela cheia e trava DEITADO (no app instalado e no navegador que deixar)
  let deitou = false;
  addEventListener('pointerdown', () => {
    if (deitou || !matchMedia('(pointer:coarse)').matches) return; deitou = true;
    const trava = () => { try { const p = screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'); if (p && p.catch) p.catch(() => { }); } catch (_) { } };
    try { const el = document.documentElement; if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' }).then(trava, trava); else trava(); } catch (_) { trava(); }
  }, { capture: true });
  iconesToque();
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
// ---------- interface no estilo "vidro escuro": painel translúcido, cantos chanfrados, borda fina e cantoneiras de cor ----------
const UIC = { fill: 'rgba(9,12,22,0.86)', line: '#8fe3d8', accent: '#ff7aa8', dark: '#120c1c', sel: 'rgba(143,227,216,0.16)' };
function box(x, y, w, h, o = {}) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  const ed = o.edge && o.edge !== '#ffffff' ? o.edge : UIC.line;
  bx.fillStyle = o.fill || UIC.fill;
  bx.fillRect(x + 2, y, w - 4, 1); bx.fillRect(x + 1, y + 1, w - 2, 1); bx.fillRect(x, y + 2, w, h - 4); bx.fillRect(x + 1, y + h - 2, w - 2, 1); bx.fillRect(x + 2, y + h - 1, w - 4, 1);
  bx.globalAlpha = 0.42; bx.fillStyle = ed;
  bx.fillRect(x + 2, y, w - 4, 1); bx.fillRect(x + 2, y + h - 1, w - 4, 1); bx.fillRect(x, y + 2, 1, h - 4); bx.fillRect(x + w - 1, y + 2, 1, h - 4);
  bx.fillRect(x + 1, y + 1, 1, 1); bx.fillRect(x + w - 2, y + 1, 1, 1); bx.fillRect(x + 1, y + h - 2, 1, 1); bx.fillRect(x + w - 2, y + h - 2, 1, 1);
  bx.globalAlpha = 1;
  if (o.bw === 1 || w < 24 || h < 16) return;
  const k = Math.min(6, Math.floor(Math.min(w, h) / 4));
  bx.fillRect(x + 2, y, k, 1); bx.fillRect(x, y + 2, 1, k); bx.fillRect(x + w - 2 - k, y, k, 1); bx.fillRect(x + w - 1, y + 2, 1, k);
  bx.fillRect(x + 2, y + h - 1, k, 1); bx.fillRect(x, y + h - 2 - k, 1, k); bx.fillRect(x + w - 2 - k, y + h - 1, k, 1); bx.fillRect(x + w - 1, y + h - 2 - k, 1, k);
}
// moldura das laterais (quando o quadro de 240 fica no meio da tela larga): ladrilho de runas, como as da tampa do baú
let RUNA_PAT = null, RUNA_PAT_CTX = null;
function runaTile() {
  const c = mk(32, 32), x = c.getContext('2d'); x.fillStyle = '#0a1418'; x.fillRect(0, 0, 32, 32);
  const R = rng(7), L = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  for (let q = 0; q < 4; q++) {
    const ox = (q % 2) * 16, oy = (q >> 1) * 16, c1 = '#10232a', c2 = '#16303a';
    L(ox + 2, oy + 2, 12, 1, c1); L(ox + 2, oy + 13, 12, 1, c1); L(ox + 2, oy + 2, 1, 12, c1); L(ox + 13, oy + 2, 1, 12, c1);
    const t = Math.floor(R() * 4);
    if (t === 0) { L(ox + 5, oy + 5, 6, 1, c2); L(ox + 5, oy + 5, 1, 6, c2); L(ox + 8, oy + 8, 3, 3, c2); }
    else if (t === 1) { L(ox + 5, oy + 7, 6, 2, c2); L(ox + 7, oy + 5, 2, 6, c2); }
    else if (t === 2) { L(ox + 5, oy + 5, 2, 2, c2); L(ox + 9, oy + 9, 2, 2, c2); L(ox + 5, oy + 10, 6, 1, c1); }
    else { L(ox + 5, oy + 5, 6, 6, c1); L(ox + 7, oy + 7, 2, 2, '#0a1418'); }
  }
  return c;
}
function fundoRunas(x0, w) {
  if (RUNA_PAT_CTX !== bx) { RUNA_PAT = bx.createPattern(runaTile(), 'repeat'); RUNA_PAT_CTX = bx; }
  bx.fillStyle = RUNA_PAT; bx.fillRect(x0, 0, w, H);
}
// marcadores em pixel (no lugar dos símbolos da fonte): seta de seleção e "continua" piscando
function setaSel(x, y, col = UIC.accent) { bx.fillStyle = col; const o = Math.floor(FRAME / 10) % 2; bx.fillRect(x + o, y + 2, 1, 7); bx.fillRect(x + 1 + o, y + 3, 1, 5); bx.fillRect(x + 2 + o, y + 4, 1, 3); bx.fillRect(x + 3 + o, y + 5, 1, 1); }
function setaMais(x, y, col = UIC.line) { const o = Math.floor(FRAME / 12) % 2; bx.fillStyle = col; bx.fillRect(x, y + o, 7, 1); bx.fillRect(x + 1, y + 1 + o, 5, 1); bx.fillRect(x + 2, y + 2 + o, 3, 1); bx.fillRect(x + 3, y + 3 + o, 1, 1); }
function tagNome(x, y, nm, col) { const w = lineW(rich(nm)) + 10; bx.fillStyle = col || UIC.accent; bx.fillRect(x + 1, y, w - 2, 13); bx.fillRect(x, y + 1, w, 11); bx.fillStyle = 'rgba(0,0,0,0.25)'; bx.fillRect(x + 1, y + 12, w - 2, 1); txt(nm, x + 5, y + 1, { col: UIC.dark }); }
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
  // no mapa largo (celular deitado) a caixa de diálogo cresce, sem chegar nos controles dos cantos
  const DW = V.scene === 'world' && W > 240 ? Math.max(228, Math.min(310, W - 224)) : 228, DX = 120 - DW / 2;
  tw.set(text, isVoid ? 34 : Math.floor((DW - (hasP ? (wd.bigP ? 62 : 52) : 16) - 12) / 6), { voice: wd.voice, col: wd.col, fx: wd.fx, speed: isVoid ? 0.4 : 0.55 });
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
      if (isVoid) { this.tw.draw(18, 92, 14); if (this.tw.done) setaMais(220, 202); return; }
      let y = 156;
      if (V.boxTop) y = 6;
      const h = this.opts ? 78 : 78;
      box(DX + 6, y, DW, h, { edge: wd.edge });
      let tx = DX + 16;
      if (hasP) {
        const p = wd.portrait(!this.tw.done);
        if (wd.bigP) { box(DX + 9, y + 5, 48, 68, { bw: 1, edge: wd.edge, fill: 'rgba(30,24,44,0.9)' }); bx.drawImage(p, DX + 11, y + 7 + (wd.bob ? wd.bob(!this.tw.done) : 0)); tx = DX + 62; }
        else if (p.width >= 32) { box(DX + 10, y + 9, 36, 36, { bw: 1, edge: wd.edge, fill: 'rgba(30,24,44,0.9)' }); bx.drawImage(p, DX + 12, y + 11); }
        else { const sc = 32 / Math.max(p.width, p.height); bx.drawImage(p, DX + 12, y + 14, p.width * sc, p.height * sc); }
        if (!wd.bigP) tx = DX + 52;
      }
      if (wd.name) tagNome(DX + 12, y - 8, wd.name(), wd.edge);
      this.tw.draw(tx, y + 8, 12);
      if (this.opts && this.tw.done && this.lastPage) {
        const oy = y + 8 + this.tw.lines.length * 12 + 2;
        this.opts.forEach((o, i) => { if (i === this.idx) { bx.fillStyle = UIC.sel; bx.fillRect(tx - 2, oy + i * 12 - 1, DX + DW - tx, 12); setaSel(tx, oy + i * 12); } txt(o, tx + 9, oy + i * 12, { col: i === this.idx ? '#ffffff' : '#b8c8d0' }); });
      } else if (this.tw.done) setaMais(DX + DW - 6, y + 66);
    }
  };
  return openWin(w);
}
function choose(text, options, who = 'n', cancel = null) { return say(text, who, { choices: options, cancel }); }
// quantas linhas cabem na lista: respeita maxVis e, se a caixa tiver altura fixa, nunca passa da borda
function listHead(o) { const head = o.head || []; return (o.title ? 16 : 6) + head.length * 12 + (head.length ? 4 : 0); }
function listVis(o) { let mv = o.maxVis || 8; if (o.h) mv = Math.min(mv, Math.max(1, Math.floor((o.h - listHead(o) - 4) / 12))); return mv; }
function list(o) {
  // nenhuma opção vaza da caixa: se não cabe, a caixa alarga (e recua para dentro da tela)
  { const lw = (t) => t ? lineW(rich(String(t))) : 0;
    const need = Math.max(o.title ? 16 + lw(o.title) + (o.items.length > (o.maxVis || 8) ? 34 : 0) : 0, ...o.items.map(it => 22 + lw(it.label) + (it.right ? 12 + lw(it.right) : 0)));
    if (need > o.w) { o.w = Math.min(need, 236); o.x = Math.max(2, Math.min(o.x, 238 - o.w)); } }
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
      if (o.title) { txt(o.title, o.x + 8, o.y + 4, { col: UIC.line }); bx.fillStyle = UIC.line; bx.globalAlpha = 0.25; bx.fillRect(o.x + 6, o.y + 15, o.w - 12, 1); bx.globalAlpha = 1; }
      head.forEach((l, i) => txt(l, o.x + 8, o.y + (o.title ? 16 : 6) + i * 12));
      if (!it.length) txt(o.empty || '(vazio)', o.x + 14, o.y + hh, { col: '#8a8099' });
      for (let i = 0; i < mv && i + this.scroll < it.length; i++) {
        const k = i + this.scroll, item = it[k], sel = k === this.idx;
        const col = item.disabled ? '#6a6078' : sel ? '#ffffff' : (item.col || '#c8d4dc');
        const yy = o.y + hh + i * 12;
        if (sel) { bx.fillStyle = UIC.sel; bx.fillRect(o.x + 3, yy - 1, o.w - 6, 12); setaSel(o.x + 6, yy); }
        { let lb = item.label; const cab = Math.floor((o.w - 22 - (item.right ? String(item.right).length * 6 + 6 : 0)) / 6); if (typeof lb === 'string' && !lb.includes('{') && lb.length > cab && cab > 4) lb = lb.slice(0, cab - 2).trimEnd() + '..'; txt(lb, o.x + 16, yy, { col }); }
        if (item.right) txt(item.right, o.x + o.w - 8, yy, { align: 'right', col: item.disabled ? '#6a6078' : '#b8aecb' });
      }
      // setas de rolagem na linha do título (não cobrem nenhum item) e um contador
      const more = it.length > mv, ay = o.title ? o.y + 4 : o.y + h - 12;
      if (more) {
        if (this.scroll > 0) { bx.save(); bx.translate(o.x + o.w - 22 + 7, ay + 8); bx.scale(-1, -1); bx.translate(-7, 0); setaMais(0, 0); bx.restore(); }
        if (this.scroll + mv < it.length) setaMais(o.x + o.w - 13, ay + 4);
        if (o.title) txt(`${this.idx + 1}/${it.length}`, o.x + o.w - 28, ay, { align: 'right', col: '#8a8099' });
      }
      if (o.desc && it.length) { const d = o.desc(this.idx); if (d) {
        // a descrição nunca cobre a lista: se não cabe embaixo, vira páginas (troca sozinha ou com esquerda/direita)
        const cols = Math.floor((o.w - 16) / 6), L = wrapRich(rich(d), cols), nl = L.length, fundo = o.y + h + 2;
        let dh = Math.max(52, nl * 12 + 10), dy = Math.max(2, Math.min(o.descY ?? 182, 238 - dh));
        if (dy < fundo && 238 - fundo >= 34) {
          dy = fundo; dh = 238 - fundo; const cab = Math.max(1, Math.floor((dh - 10) / 12)), pags = Math.ceil(nl / cab);
          if (this._dIdx !== this.idx) { this._dIdx = this.idx; this._dPg = 0; this._dT = 0; }
          if (pags > 1) { if (++this._dT > 200) { this._dT = 0; this._dPg = (this._dPg + 1) % pags; } if (navp('right')) { this._dPg = (this._dPg + 1) % pags; this._dT = 0; sfx('move'); } if (navp('left')) { this._dPg = (this._dPg + pags - 1) % pags; this._dT = 0; sfx('move'); } }
          const pg = Math.min(this._dPg || 0, pags - 1);
          box(o.x, dy, o.w, dh, { bw: 1 });
          L.slice(pg * cab, pg * cab + cab).forEach((ln, i) => TQ.push({ chars: ln, x: (o.x + 8 + TXO.x) / TXZ, y: (dy + 5 + i * 12 + TXO.y) / TXZ, n: 1e9, sz: 1 / TXZ }));
          if (pags > 1) txt(`< ${pg + 1}/${pags} >`, o.x + o.w - 8, dy + dh - 12, { align: 'right', col: '#8a8099' });
        } else { box(o.x, dy, o.w, dh, { bw: 1 }); txt(d, o.x + 8, dy + 5, { w: cols }); }
      } }
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
      box(x, y, ww, h); if (o.title) txt(o.title, x + 8, y + 4, { col: UIC.line });
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
