// ================= ARTE DO CAP. 3 (Parte 2): GALERIAS DE FULIGEM =================
// Chão de tijolo velho coberto de fuligem, rocha escura, grades de brasa, prateleiras de lanternas de vidro com fumaça
// dentro (etiquetadas com nomes), o veio de âmbar, a bigorna esquecida. Inimigos: Cinzinha, Rato-Pavio e o chefe
// MÃE-FULIGEM (montanha de fumaça e tijolo de chaminé, cheia de luzinhas: lembranças queimadas).

RAMPA_CHAO.chaoF = ['#1a1420', '#2e2434', '#463848', '#625060', '#82707c'].map(hex3);
CHAO_PISO.add('chaoF');
{ const _ta4 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'chaoF' && k !== 'rocha') return _ta4(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  if (k === 'chaoF') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const tij = (y % 8 === 7) || ((x + (Math.floor(y / 8) % 2) * 8) % 16 === 15); P.p(x, y, tij ? '#2a2030' : (hash(x, y + v * 5, 9) % 13 === 0 ? '#5a4a58' : '#463848')); }
  } else {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, y < 3 ? '#3a2e40' : '#1a1220');
    for (let i = 0; i < 3; i++) { const x = hash(i, v, 3) % 14, y = 4 + hash(v, i, 4) % 10; P.p(x, y, '#2a2032'); P.p(x + 1, y, '#2a2032'); }
    if (v % 4 === 0) { P.p(4, 1, '#6a5a72'); P.p(11, 2, '#6a5a72'); }
  }
  return TILE2[key] = P.canvas();
}; }
const KEY_GAL = { ',': { t: 'chaoF' }, 'X': { t: 'rocha', solid: true }, '_': { t: 'lodo' }, '~': { t: 'agua', water: true } };

// ---------- grade de brasa (luz no escuro) ----------
const GRADE_C = {};
function gradeBrasa(f) { if (GRADE_C[f]) return GRADE_C[f]; const P = new Pix(16, 10); P.rect(0, 2, 16, 8, '#2a1a1a'); for (let x = 1; x < 15; x += 3) P.rect(x, 3, 2, 6, f % 2 ? '#ff9a30' : '#e86a20'); P.rect(0, 2, 16, 1, '#5a4a4a'); for (let x = 2; x < 15; x += 5) P.p(x, 4 + (f % 3), '#fff0a0'); return GRADE_C[f] = P.outline().canvas(); }
// ---------- prateleira de lanternas (vidros com fumaça e etiqueta) ----------
const PRAT_C = {};
function prateleiraArt(v) {
  if (PRAT_C[v]) return PRAT_C[v];
  const W_ = 48, H_ = 58, P = new Pix(W_, H_), MD = ['#2a1820', '#4a2a30', '#6a4040'];
  P.rect(0, 0, 3, H_, MD[1]); P.rect(W_ - 3, 0, 3, H_, MD[1]);
  for (let s = 0; s < 3; s++) {
    const y = 16 + s * 18; P.rect(0, y, W_, 3, MD[2]); P.rect(0, y + 3, W_, 1, MD[0]);
    for (let i = 0; i < 5; i++) { const x = 5 + i * 8, h = 11, acesa = hash(i, s, v) % 3; P.rect(x, y - h, 6, h, '#8a9aa8'); P.rect(x + 1, y - h + 1, 4, h - 2, acesa ? (acesa === 1 ? '#c8a050' : '#7a6a80') : '#3a3040'); P.rect(x + 1, y - h - 2, 4, 2, '#4a4048'); P.rect(x + 1, y - 4, 4, 2, '#e8dcc0'); if (acesa === 1) P.p(x + 2, y - h + 3, '#fff0a0'); }
  }
  return PRAT_C[v] = P.outline().canvas();
}
// ---------- veio de âmbar (o coração do capítulo) ----------
const VEIO_C = {};
function veioArt(f, apagado) {
  const key = f + (apagado ? 'x' : ''); if (VEIO_C[key]) return VEIO_C[key];
  const W_ = 40, H_ = 56, P = new Pix(W_, H_), C = apagado ? ['#3a2a30', '#5a4448', '#7a6060', '#9a8080'] : ['#8a4a10', '#d88a20', '#ffc040', '#fff0a0'];
  P.rect(4, 44, 32, 12, '#2a2030'); P.rect(6, 42, 28, 3, '#3a2e40');
  const cris = [[20, 6, 7, 40], [11, 18, 5, 28], [29, 16, 5, 30], [15, 28, 4, 18], [26, 30, 4, 16]];
  for (const [x0, y0, w, h] of cris) for (let y = 0; y < h; y++) { const ww = Math.round(w * Math.min(1, (y + 2) / 6)); for (let x = -ww; x <= ww; x++) P.p(x0 + x, y0 + y, x < -ww / 3 ? C[3] : x > ww / 3 ? C[0] : C[(y + f) % 7 < 1 ? 3 : 2]); P.p(x0, y0 + y, C[3]); }
  return VEIO_C[key] = P.outline().canvas();
}
// ---------- bigorna velha ----------
let BIG_C = null;
function bigornaArt() { if (BIG_C) return BIG_C; const P = new Pix(28, 22); P.rect(2, 4, 24, 5, '#5a5a6a'); P.rect(0, 4, 6, 3, '#5a5a6a'); P.rect(2, 4, 24, 1, '#9a9aaa'); P.rect(8, 9, 12, 6, '#4a4a5a'); P.rect(4, 15, 20, 5, '#3a3a48'); P.rect(4, 20, 20, 2, '#2a2a34'); P.p(10, 6, '#c8c8d8'); return BIG_C = P.outline().canvas(); }
// ---------- canos de cobre que sobem para a cidade ----------
function canoArt(h) { const P = new Pix(8, h); for (let y = 0; y < h; y++) { P.p(2, y, '#e8a070'); P.p(3, y, '#c87848'); P.p(4, y, '#a85a38'); P.p(5, y, '#7a4028'); if (y % 20 === 6) P.rect(1, y, 6, 2, '#5a4a4a'); } return P.outline().canvas(); }

// ---------- fundo de batalha: túnel de fuligem ----------
let BG_GAL = null;
function bgGalerias() {
  if (BG_GAL) return BG_GAL;
  const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) { const tij = (y % 10 === 9) || ((x + (Math.floor(y / 10) % 2) * 10) % 20 === 19); P.p(x, y, y > 96 ? ((x + y) % 18 < 9 ? '#2e2434' : '#28202e') : tij ? '#1e1624' : (y < 30 ? '#2a1e30' : '#382a3e')); }
  // arco do túnel
  for (let x = 0; x < 240; x++) { const h = Math.round(20 + Math.pow((x - 120) / 120, 2) * 40); for (let y = 0; y < h; y++) P.p(x, y, '#120c18'); }
  // canos e brasas
  for (const x of [30, 46, 196]) for (let y = 10; y < 96; y++) { P.p(x, y, '#c87848'); P.p(x + 1, y, '#7a4028'); }
  for (const x of [70, 160]) { P.rect(x, 90, 18, 6, '#2a1a1a'); for (let i = 0; i < 18; i += 3) P.rect(x + i, 91, 2, 4, '#ff9a30'); }
  for (let i = 0; i < 30; i++) P.p(hash(i, 4, 1) % 240, 30 + hash(i, 5, 1) % 60, '#ffb060');
  return BG_GAL = P.canvas();
}

// ---------- inimigos ----------
const CINZA_C = {};
function cinzaArt(f) {
  if (CINZA_C[f]) return CINZA_C[f]; const P = new Pix(26, 24), cx = 13;
  for (let y = 0; y < 22; y++) { const w = Math.round(Math.sin((y + 2) / 24 * Math.PI) * 10 + (y % 3 === f % 3 ? 1 : 0)); for (let x = -w; x <= w; x++) P.p(cx + x, 2 + y, x < -w / 2 ? '#5a4a60' : x > w / 2 ? '#2a2030' : '#3e3248'); }
  for (let i = 0; i < 6; i++) P.p(cx - 8 + i * 3, 2 + (i % 2), '#6a5a70');
  P.rect(cx - 5, 10, 3, 3, '#ffb040'); P.rect(cx + 2, 10, 3, 3, '#ffb040'); P.p(cx - 4, 11, '#fff0a0'); P.p(cx + 3, 11, '#fff0a0');
  P.rect(cx - 2, 16, 4, 1 + f, '#1a1020');
  return CINZA_C[f] = P.outline().canvas();
}
const RATO_C = {};
function ratoArt(f) {
  if (RATO_C[f]) return RATO_C[f]; const P = new Pix(30, 22);
  for (let y = 0; y < 9; y++) for (let x = 0; x < 18; x++) if ((x - 9) * (x - 9) / 81 + (y - 4.5) * (y - 4.5) / 20 <= 1) P.p(6 + x, 11 + y, y < 3 ? '#8a7a80' : '#5a4a54');
  P.rect(1, 15, 6, 3, '#5a4a54'); P.p(0, 15, '#ff9aaa'); P.p(2, 15, '#1a1020'); P.rect(1, 12, 2, 2, '#c87a8a');
  for (let i = 0; i < 9; i++) P.p(24 + i * 0.6 | 0, 16 - Math.round(Math.sin(i / 2 + f) * 2), '#c87a8a');
  P.rect(12, 4, 3, 7, '#f2ecdc'); P.p(13, 3, '#ffd060'); P.p(13, 2, f ? '#fff0a0' : '#ff9a30');
  for (const x of [9, 19]) P.rect(x + (f ? 1 : 0), 19, 2, 3, '#3a2a34');
  return RATO_C[f] = P.outline().canvas();
}
// MÃE-FULIGEM: chefe. Montanha de fumaça e tijolo de chaminé, braços de fumaça, uma "boca" de fornalha e dezenas de
// luzinhas presas no corpo (lembranças que não queimaram direito). Fase 2: a fornalha abre e as luzinhas giram.
const MAE_C = {};
function maeFuligemArt(f, fase) {
  const key = f + '_' + fase; if (MAE_C[key]) return MAE_C[key];
  const W_ = 136, H_ = 120, P = new Pix(W_, H_), cx = 68;
  const FU = ['#140e18', '#241a2a', '#382a3e', '#504058', '#6e5c74'];
  // corpo de fumaça em bolhas
  const bolhas = [[0, 70, 46], [-30, 80, 28], [30, 80, 28], [-18, 46, 24], [20, 44, 24], [0, 30, 22], [-40, 98, 18], [40, 98, 18]];
  for (const [bx0, by0, r] of bolhas) for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    const d = x * x + y * y; if (d > r * r) continue; const X = cx + bx0 + x + Math.round(Math.sin((y + f * 3) / 6) * 1.5), Y = by0 + y; if (Y >= H_) continue;
    const k = (x * 0.6 + y * 0.8) / r; P.p(X, Y, k < -0.6 ? FU[4] : k < -0.15 ? FU[3] : k < 0.4 ? FU[2] : FU[1]);
  }
  // chaminé de tijolo saindo das costas
  for (let y = 0; y < 34; y++) for (let x = -9; x <= 9; x++) { const tij = (y % 5 === 4) || ((x + 20 + (Math.floor(y / 5) % 2) * 3) % 6 === 5); P.p(cx + 26 + x, y + 2, tij ? '#3a1a1a' : x < -4 ? '#a85a48' : x > 4 ? '#5a2a24' : '#8a4438'); }
  for (let x = -10; x <= 10; x++) P.p(cx + 26 + x, 2, '#c87a68');
  // braços de fumaça
  for (const L of [-1, 1]) for (let i = 0; i < 30; i++) { const t = i / 30, X = cx + L * Math.round(36 + t * 22 + Math.sin(t * 4 + f) * 3), Y = 60 + Math.round(t * 34 - Math.sin(t * Math.PI) * 14), r = Math.round(7 - t * 3); for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) P.p(X + x, Y + y, x * L < 0 ? FU[3] : FU[1]); }
  for (const L of [-1, 1]) for (let i = 0; i < 4; i++) P.rect(cx + L * (58 + i * 2) - 1, 92 + i, 2, 5, '#8a7a80');
  // fornalha (boca) e olhos
  const aberta = fase >= 2 ? 10 : 5;
  for (let y = -aberta; y <= aberta; y++) for (let x = -14; x <= 14; x++) if (x * x / 196 + y * y / (aberta * aberta) <= 1) P.p(cx + x, 70 + y, Math.abs(y) < aberta * 0.4 ? '#fff0a0' : Math.abs(y) < aberta * 0.75 ? '#ffb040' : '#e05a20');
  for (let x = -14; x <= 14; x += 4) { P.p(cx + x, 70 - aberta, '#2a1a1a'); P.p(cx + x + 1, 70 + aberta, '#2a1a1a'); }
  for (const L of [-1, 1]) { P.rect(cx + L * 10 - 2, 40, 5, 4, fase >= 2 ? '#ff5a3a' : '#ffb040'); P.rect(cx + L * 10 - 1, 41, 2, 1, '#fff0a0'); }
  // luzinhas presas (lembranças)
  for (let i = 0; i < 26; i++) { const a = i * 2.4 + (fase >= 2 ? f * 0.4 : 0), r = 16 + (i % 6) * 6, X = cx + Math.round(Math.cos(a) * r), Y = 72 + Math.round(Math.sin(a) * r * 0.7); if (P.get(X, Y)) { P.p(X, Y, ['#fff0a0', '#ffd8e8', '#bff0ff', '#ffe080'][i % 4]); if (i % 3 === 0) P.p(X + 1, Y, '#ffffff'); } }
  return MAE_C[key] = P.outline().canvas();
}
