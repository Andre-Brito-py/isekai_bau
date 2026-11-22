// ================= ARTE DO CAP. 3 (Parte 1): estrada, capital, festival e o interior do baú =================
// Tudo nasce no estilo do mapa (HLD): cor chapada em faixas, sombra puxando para o violeta, brilhos quadrados.
// Escala: adulto 48 px; poste de rua ~96 px; árvore ~70 px; barraca ~44 px; palco largo.

// ---------- tiles novos: terra (caminho) e mata (sólida) ----------
Object.assign(KEY2, { 't': { t: 'terra' }, 'T': { t: 'mata', solid: true } });
CHAO_PISO.add('terra');
RAMPA_CHAO.terra = ['#6a4a40', '#a07a60', '#d0aa80', '#e8cc9c', '#f8e8c0'].map(hex3);
{ const _ta3 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'terra' && k !== 'mata') return _ta3(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  if (k === 'terra') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, (hash(x + v * 9, y, 31) % 17 === 0) ? '#b8946c' : '#d4ae84');
    for (let i = 0; i < 3; i++) { const x = hash(i, v, 5) % 14, y = hash(v, i, 6) % 14; P.p(x, y, '#a07a5a'); P.p(x + 1, y, '#e8cca0'); }
  } else {
    // mata fechada vista de cima: copas redondas sobrepostas, três tons
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, '#12404a');
    for (let i = 0; i < 4; i++) { const cx = (hash(i, v, 11) % 12) + 2, cy = (hash(v, i, 12) % 12) + 2, r = 4 + (i % 2); for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) P.p(cx + x, cy + y, x < -1 && y < 0 ? '#2a7a72' : y > 1 ? '#1a5458' : '#226660'); }
    if (v === 1) P.p(5, 4, '#bff8e8');
  }
  return TILE2[key] = P.canvas();
}; }

// ---------- árvore HLD: copa grande e redonda, tronco torto, brilhos quadrados ----------
const ARV_C = {};
function arvoreArt(v = 0) {
  if (ARV_C[v]) return ARV_C[v];
  const W_ = 56, H_ = 72, P = new Pix(W_, H_), cx = 28;
  const TR = ['#3a2034', '#5a3044', '#7a4458'];
  for (let y = 44; y < H_ - 2; y++) { const w = 3 + (y > H_ - 8 ? 2 : 0); for (let x = -w; x < w; x++) P.p(cx + x + (y < 52 ? Math.round((52 - y) / 6) * (v % 2 ? 1 : -1) : 0), y, x < -1 ? TR[2] : x > 1 ? TR[0] : TR[1]); }
  P.rect(cx - 7, H_ - 3, 5, 2, TR[0]); P.rect(cx + 3, H_ - 3, 5, 2, TR[0]);
  const C = v % 3 === 2 ? ['#16404a', '#1e5a5c', '#2a7a72', '#4aa48c', '#8ad8b8'] : ['#123a48', '#1a5460', '#24706e', '#3a9484', '#7ad0b0'];
  const bolas = [[0, 26, 22], [-12, 30, 14], [12, 30, 14], [-6, 16, 14], [8, 16, 13], [0, 8, 10]];
  for (const [bx0, by0, r] of bolas) for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    if (x * x + y * y > r * r) continue; const X = cx + bx0 + x, Y = by0 + y;
    const k = (x + y * 0.6) / r; P.p(X, Y, k < -0.55 ? C[3] : k < -0.1 ? C[2] : k < 0.5 ? C[1] : C[0]);
  }
  for (let i = 0; i < 9; i++) { const x = cx - 18 + (hash(i, v, 21) % 36), y = 6 + (hash(v, i, 22) % 34); if (P.get(x, y)) P.p(x, y, i % 3 ? C[4] : '#ffffff'); }
  return ARV_C[v] = P.outline().canvas();
}
// ---------- poste da estrada / da capital (aceso ou apagado) ----------
const POSTE3 = {};
function poste3Art(aceso, capital) {
  const key = (aceso ? 1 : 0) + (capital ? 2 : 0); if (POSTE3[key]) return POSTE3[key];
  const P = new Pix(16, 96), M = capital ? ['#2a2440', '#4a4468', '#6a6890'] : ['#2a2026', '#4a3a3a', '#6a5650'];
  for (let y = 18; y < 94; y++) { P.p(7, y, M[2]); P.p(8, y, M[1]); P.p(9, y, M[0]); }
  P.rect(4, 92, 9, 3, M[0]); P.rect(5, 90, 7, 2, M[1]);
  P.rect(3, 6, 11, 2, M[1]); P.rect(4, 8, 9, 10, M[0]);
  P.rect(5, 9, 7, 8, aceso ? '#ffe08a' : '#3a3448'); if (aceso) { P.rect(6, 10, 3, 4, '#fff8d8'); }
  P.rect(5, 4, 7, 2, M[2]); P.p(8, 2, M[2]); P.p(8, 3, M[1]);
  if (!aceso) { P.p(7, 12, '#5a5470'); P.p(9, 14, '#5a5470'); }
  return POSTE3[key] = P.outline().canvas();
}
// ---------- barraca de feira com toldo listrado ----------
const BARR_C = {};
function barracaArt(cor, cor2) {
  const key = cor + cor2; if (BARR_C[key]) return BARR_C[key];
  const W_ = 48, H_ = 46, P = new Pix(W_, H_), T = ramp(cor), T2 = ramp(cor2 || '#f2ecdc'), MD = ['#3a2430', '#5a3a3a', '#8a5a48', '#b07a58'];
  for (let y = 0; y < 14; y++) for (let x = 0; x < W_; x++) { const lis = Math.floor((x + Math.floor(y / 2)) / 6) % 2; P.p(x, y, y < 2 ? (lis ? T[4] : T2[4]) : y > 11 ? (lis ? T[1] : T2[1]) : (lis ? T[2] : T2[2])); }
  for (let x = 0; x < W_; x += 6) { P.p(x + 2, 14, T[1]); P.p(x + 3, 14, T[1]); P.p(x + 2, 15, T[0]); }
  for (const x of [2, W_ - 4]) for (let y = 14; y < H_ - 1; y++) { P.p(x, y, MD[2]); P.p(x + 1, y, MD[1]); }
  P.rect(0, 30, W_, 4, MD[3]); P.rect(0, 34, W_, 10, MD[2]); P.rect(0, 44, W_, 2, MD[0]); for (let x = 3; x < W_; x += 8) P.rect(x, 35, 1, 9, MD[1]);
  return BARR_C[key] = P.outline().canvas();
}
// mercadoria em cima do balcão (pastel, lanterninhas, frutas, livros)
function mercadoria(P, tipo) {
  if (tipo === 'pastel') for (let i = 0; i < 4; i++) { P.rect(6 + i * 9, 27, 7, 3, '#e8b860'); P.rect(7 + i * 9, 26, 5, 1, '#f8d890'); P.p(9 + i * 9, 28, '#c88a40'); }
  if (tipo === 'lanterna') for (let i = 0; i < 5; i++) { const c = ['#ff7aa8', '#ffd060', '#8fe3d8', '#ff9a50', '#c8a0ff'][i]; P.rect(5 + i * 8, 24, 5, 6, c); P.rect(6 + i * 8, 25, 3, 2, '#ffffff'); P.p(7 + i * 8, 23, '#3a2430'); }
  if (tipo === 'fruta') for (let i = 0; i < 6; i++) { P.rect(5 + i * 7, 27, 4, 3, ['#e84a4a', '#f0a030', '#8ac850'][i % 3]); P.p(6 + i * 7, 27, '#ffffff'); }
  if (tipo === 'livro') for (let i = 0; i < 6; i++) P.rect(5 + i * 7, 24 + (i % 2), 5, 6 - (i % 2), ['#5a3a8a', '#a83a3a', '#3a6a8a', '#c8a040'][i % 4]);
}
const BARR_M = {};
function barracaCom(cor, cor2, tipo) { const key = cor + cor2 + tipo; if (BARR_M[key]) return BARR_M[key]; const base = barracaArt(cor, cor2), c = mk(base.width, base.height), x = c.getContext('2d'); x.drawImage(base, 0, 0); const P = new Pix(base.width, base.height); mercadoria(P, tipo); x.drawImage(P.canvas(), 0, 0); return BARR_M[key] = c; }

// ---------- o palco do festival: tablado, cortina, arco de lanternas e o brasão do sol ----------
let PALCO_C = null;
function palcoArt() {
  if (PALCO_C) return PALCO_C;
  const W_ = 192, H_ = 104, P = new Pix(W_, H_), MD = ['#3a2034', '#5a3044', '#8a4a50', '#b8705a', '#d89870'];
  for (let y = 70; y < H_; y++) for (let x = 0; x < W_; x++) P.p(x, y, y < 73 ? MD[4] : y < 76 ? MD[3] : (x % 24 === 0 ? MD[0] : MD[2]));
  for (let y = 76; y < H_; y += 8) for (let x = 0; x < W_; x++) P.p(x, y, MD[1]);
  // cortina vinho com dobras
  for (let y = 12; y < 70; y++) for (let x = 10; x < W_ - 10; x++) { const d = (x % 12); P.p(x, y, d < 3 ? '#a8284a' : d < 8 ? '#7a1a3a' : '#5a1030'); }
  for (let x = 10; x < W_ - 10; x++) { P.p(x, 12, '#e8b040'); P.p(x, 13, '#c88a30'); }
  // pilares com faixas
  for (const x0 of [2, W_ - 10]) for (let y = 6; y < 72; y++) for (let x = 0; x < 8; x++) P.p(x0 + x, y, x < 2 ? '#c8c0e0' : x > 5 ? '#6a6488' : '#9a94b8');
  // arco com sol de lata no meio
  for (let x = 0; x < W_; x++) { const y = Math.round(10 - Math.sin(x / W_ * Math.PI) * 8); P.p(x, y, '#e8b040'); P.p(x, y + 1, '#a87028'); }
  for (let a = 0; a < 16; a++) { const ang = a / 16 * Math.PI * 2; for (let r = 7; r < 12; r++) P.p(96 + Math.round(Math.cos(ang) * r), 30 + Math.round(Math.sin(ang) * r), '#f0c040'); }
  for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) if (x * x + y * y <= 36) P.p(96 + x, 30 + y, x + y < -3 ? '#fff0a0' : '#f0c040');
  return PALCO_C = P.outline().canvas();
}
// ---------- capital ao fundo: fachada alta com janelas e varandas (vira prop de casa larga) ----------
// usamos o casaArt do Cap. 2 (telhado HLD) com cores da capital: lilás, rosa, ardósia

// ---------- interior do baú (a base): vela, meia, estante, cama, canto da forja ----------
const BASE_C = {};
function baseArt(k) {
  if (BASE_C[k]) return BASE_C[k];
  let P;
  if (k === 'vela') { P = new Pix(12, 22); P.rect(4, 8, 4, 12, '#f2ecdc'); P.rect(4, 8, 1, 12, '#ffffff'); P.rect(3, 19, 6, 2, '#8a6a4a'); P.rect(5, 6, 2, 2, '#3a2430'); }
  else if (k === 'meia') { P = new Pix(14, 16); P.rect(4, 0, 5, 9, '#c84a5a'); P.rect(4, 2, 5, 1, '#f2ecdc'); P.rect(4, 5, 5, 1, '#f2ecdc'); P.rect(4, 9, 8, 4, '#c84a5a'); P.rect(9, 10, 3, 3, '#f2ecdc'); P.p(6, 12, '#5a2a34'); }
  else if (k === 'estante') { P = new Pix(40, 54); const MD = ['#2a1828', '#4a2a38', '#6a3e48']; P.rect(0, 0, 40, 54, MD[1]); P.rect(2, 2, 36, 50, MD[0]); for (let s = 0; s < 4; s++) { P.rect(2, 12 + s * 12, 36, 2, MD[2]); } }
  else if (k === 'cama') { P = new Pix(32, 30); P.rect(0, 8, 32, 20, '#5a3a3a'); P.rect(2, 10, 28, 14, '#8a6aa8'); P.rect(2, 10, 9, 8, '#e8dcc0'); P.rect(0, 26, 32, 3, '#3a2028'); P.rect(0, 0, 4, 28, '#6a4a3a'); }
  else if (k === 'forja') { P = new Pix(36, 30); P.rect(4, 14, 26, 6, '#4a4a5a'); P.rect(8, 20, 18, 8, '#3a3a48'); P.rect(2, 12, 30, 3, '#6a6a7a'); P.rect(26, 2, 6, 12, '#5a3a2a'); }
  else if (k === 'livro') { P = new Pix(16, 12); P.rect(0, 2, 16, 9, '#5a3a8a'); P.rect(1, 3, 6, 7, '#f2ecdc'); P.rect(9, 3, 6, 7, '#f2ecdc'); P.rect(7, 2, 2, 9, '#3a2050'); }
  else if (k === 'quadro') { P = new Pix(30, 24); P.rect(0, 0, 30, 24, '#8a6a3a'); P.rect(2, 2, 26, 20, '#2a2038'); }
  BASE_C[k] = P.outline().canvas(); return BASE_C[k];
}
// estante do Grimório com livros que acendem conforme as runas despertam
const EST_G = {};
function estanteGrim() {
  const n = (G.grim && G.grim.slots ? G.grim.slots.length : 0) + 3 + (G.grim && G.grim.fus ? Object.keys(G.grim.fus).length : 0);
  if (EST_G[n]) return EST_G[n];
  const c = EST_G[n] = mk(40, 54), x = c.getContext('2d'); x.drawImage(baseArt('estante'), 0, 0);
  const cores = ['#f07830', '#7ad0f0', '#9be58a', '#5a4a6a', '#d0a8ff', '#ffd060', '#ff7aa8'];
  for (let i = 0; i < Math.min(n, 12); i++) { const s = Math.floor(i / 4), j = i % 4; x.fillStyle = cores[i % cores.length]; x.fillRect(5 + j * 8, 4 + s * 12, 6, 8); x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(5 + j * 8, 4 + s * 12, 1, 8); }
  return c;
}

// ---------- fundos de batalha ----------
let BG_ESTRADA = null, BG_AUREN = null;
function bgEstrada() {
  if (BG_ESTRADA) return BG_ESTRADA;
  const P = new Pix(240, 150), sky = ['#3a2a5a', '#5a3a6a', '#8a4a6a', '#c86a6a', '#f0a070', '#f8c888'];
  for (let y = 0; y < 72; y++) { const f = y / 72 * (sky.length - 1), i = Math.floor(f); for (let x = 0; x < 240; x++) P.p(x, y, sky[Math.min(sky.length - 1, (f - i) > 0.5 ? i + 1 : i)]); }
  // serra roxa ao fundo
  for (let x = 0; x < 240; x++) { const h = 40 + Math.round(Math.sin(x / 23) * 8 + Math.sin(x / 9) * 3); for (let y = h; y < 74; y++) P.p(x, y, y < h + 2 ? '#8a5a8a' : '#6a4a7a'); }
  // campo
  for (let y = 74; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 78 ? '#3a9484' : '#24706e');
  for (let y = 96; y < 150; y++) for (let x = 0; x < 240; x++) { const c = Math.abs(x - 120 + (y - 96) * 0.2) < 30 + (y - 96) * 1.2; if (c) P.p(x, y, '#d0aa80'); }
  for (let i = 0; i < 40; i++) { const x = hash(i, 3, 7) % 240, y = 80 + hash(i, 5, 7) % 66; P.p(x, y, '#8af0c0'); P.p(x, y - 1, '#8af0c0'); }
  // postes da estrada sumindo na perspectiva
  for (const [x, s] of [[30, 1], [70, 0.7], [180, 0.7], [215, 1]]) { const h = Math.round(60 * s); for (let y = 88 - h; y < 88; y++) P.p(x, y, '#2a2026'); P.rect(x - 2, 88 - h - 4, 5, 5, '#3a3448'); }
  return BG_ESTRADA = P.canvas();
}
function bgAuren() {
  if (BG_AUREN) return BG_AUREN;
  const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 60 ? (y < 30 ? '#1a1438' : '#2a1e4a') : '#3a2e58');
  for (let i = 0; i < 40; i++) P.p(hash(i, 1, 2) % 240, hash(i, 2, 3) % 50, '#ffffff');
  // prédios altos da capital, lilás, com janelas acesas demais
  for (const [x, w, h] of [[0, 34, 70], [36, 28, 90], [66, 40, 60], [108, 30, 96], [140, 36, 74], [178, 26, 88], [206, 34, 66]]) {
    for (let y = 100 - h; y < 100; y++) for (let i = 0; i < w; i++) P.p(x + i, y, i < 3 ? '#8a7ab0' : i > w - 4 ? '#4a3e70' : '#6a5a90');
    for (let y = 100 - h + 6; y < 96; y += 9) for (let i = 4; i < w - 4; i += 7) P.rect(x + i, y, 3, 5, hash(x + i, y, 9) % 5 ? '#ffe08a' : '#3a2e58');
    P.rect(x, 100 - h, w, 3, '#c84a7a');
  }
  for (let y = 100; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, (x + y) % 16 < 8 ? '#5a5478' : '#4e4870');
  for (let i = 0; i < 12; i++) { const x = 10 + i * 20, y = 34 + Math.round(Math.sin(i) * 6); P.rect(x, y, 3, 4, ['#ff7aa8', '#ffd060', '#8fe3d8'][i % 3]); }
  return BG_AUREN = P.canvas();
}

// ---------- inimigos: Mariposa-de-Lampião e a Mariposa-Rainha ----------
const MARI_C = {};
function mariposaArt(f, rainha, acesa) {
  const key = f + (rainha ? 'r' : '') + (acesa ? 'a' : ''); if (MARI_C[key]) return MARI_C[key];
  const s = rainha ? 3 : 1, W_ = 34 * s, H_ = 28 * s, P = new Pix(W_, H_), cx = W_ / 2, cy = H_ / 2;
  const asa = acesa ? ['#a86a30', '#e8a040', '#ffd060', '#fff0a0'] : ['#3a2a3a', '#6a4a5a', '#9a7a7a', '#c8a890'];
  const corpo = ['#2a1a28', '#4a3040', '#6a4a50'], bate = f ? 0.55 : 1;
  for (const lado of [-1, 1]) {
    for (let y = -11 * s; y <= 8 * s; y++) for (let x = 1; x <= 16 * s; x++) {
      const nx = x / (16 * s), ny = (y + 2 * s) / (11 * s * bate);
      if (nx * nx * 0.9 + ny * ny > 1) continue;
      const k = nx + ny * 0.4; P.p(cx + lado * x, cy + Math.round(y * bate), k < 0.35 ? asa[2] : k < 0.75 ? asa[1] : asa[0]);
    }
    // "olho" na asa
    const ox = cx + lado * 9 * s, oy = cy - Math.round(3 * s * bate), r = 2.5 * s;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) P.p(ox + x, oy + y, x * x + y * y <= r * r / 3 ? '#1a1020' : asa[3]);
  }
  // nervuras e franja das asas (mais detalhe na Rainha)
  for (const lado of [-1, 1]) {
    for (let v = 0; v < 4; v++) { const ang = -0.9 + v * 0.55; for (let r = 3 * s; r < 15 * s; r++) { const X = cx + lado * Math.round(Math.cos(ang) * r), Y = cy + Math.round(Math.sin(ang) * r * 0.8 * bate); if (P.get(X, Y)) P.p(X, Y, asa[0]); } }
    for (let a = -1.4; a < 1.4; a += 0.18) { const X = cx + lado * Math.round(Math.cos(a) * 15.5 * s), Y = cy + Math.round((Math.sin(a) * 10 * s - 2 * s) * bate); if (P.get(X, Y)) { P.p(X, Y, asa[3]); if (rainha) P.p(X - lado, Y, asa[3]); } }
  }
  for (let y = -6 * s; y <= 9 * s; y++) for (let x = -2 * s; x <= 2 * s; x++) if ((x * x) / (4 * s * s) + (y * y) / (81 * s * s) <= 1.1) P.p(cx + x, cy + y, x < 0 ? corpo[2] : corpo[1]);
  for (let y = -4 * s; y <= 8 * s; y += 2 * s) for (let x = -2 * s; x <= 2 * s; x++) if (P.get(cx + x, cy + y)) P.p(cx + x, cy + y, corpo[0]);
  if (rainha) for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; P.p(cx + Math.round(Math.cos(a) * 7), cy - 5 * s + Math.round(Math.sin(a) * 4), '#e8d8c0'); }
  for (let i = 0; i < 4 * s; i++) { P.p(cx - 2 - i, cy - 7 * s - i, corpo[0]); P.p(cx + 2 + i, cy - 7 * s - i, corpo[0]); }
  P.p(cx - 1, cy - 5 * s, acesa ? '#fff0a0' : '#ff7aa8'); P.p(cx + 1, cy - 5 * s, acesa ? '#fff0a0' : '#ff7aa8');
  if (rainha) { for (let i = 0; i < 5; i++) P.rect(cx - 8 + i * 4, cy - 8 * s - 4 - (i % 2) * 3, 2, 4, '#f0c040'); }
  return MARI_C[key] = P.outline().canvas();
}
