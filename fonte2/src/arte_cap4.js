// ================= ARTE DO CAP. 4 (Parte 1): A CASA DOS QUE ESQUECEM =================
// Ladrilho verde-água de hospital, paredes de azulejo com faixa, fachada da Casa de Saúde do Largo (três andares,
// janelas acesas, emblema da vela), camas de ferro com potes de âmbar presos em fios que sobem pelo teto, e os
// bichos da Ala do Descanso: PESADELO, LENÇOL e o mini-chefe RELÓGIO DE PLANTÃO.

RAMPA_CHAO.ladrilho = ['#1e3438', '#36585a', '#5a8682', '#8ab8aa', '#c8e8d8'].map(hex3);
CHAO_PISO.add('ladrilho');
const KEY_HOSP = { 'h': { t: 'ladrilho' }, 'W': { t: 'parH', solid: true }, 'r': { t: 'tapete' }, '=': { t: 'escada' } };
{ const _ta5 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'ladrilho' && k !== 'parH') return _ta5(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  if (k === 'ladrilho') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const rej = x % 8 === 7 || y % 8 === 7, xadrez = ((x >> 3) + (y >> 3)) % 2; P.p(x, y, rej ? '#4a6e6c' : xadrez ? '#9ac8bc' : '#b8e0d2'); }
    if (hash(v, 3, 7) % 5 === 0) { P.p(3, 4, '#7aa89c'); P.p(4, 4, '#7aa89c'); }
  } else {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, y < 9 ? (x % 4 === 3 || y % 4 === 3 ? '#a8bab4' : '#d8e4dc') : y < 11 ? '#3a7a7a' : '#5a6a7a');
    P.rect(0, 15, 16, 1, '#2a3440');
  }
  return TILE2[key] = P.canvas();
}; }

// ---------- fachada da Casa de Saúde do Largo (18 tiles de largura, 3 andares) ----------
let FACH_C = null;
function hospitalArt() {
  if (FACH_C) return FACH_C;
  const W_ = 18 * 16, H_ = 176, P = new Pix(W_, H_), Pd = ramp('#d8ccb8'), Tl = ramp('#5a6a8a');
  // corpo de pedra clara com cantaria
  for (let y = 40; y < H_; y++) for (let x = 0; x < W_; x++) { const junta = y % 12 === 11 || (x + (Math.floor(y / 12) % 2) * 12) % 24 === 23; P.p(x, y, junta ? '#a89a88' : P.tone(Pd, 0.62 - (x < 6 || x > W_ - 7 ? 0.22 : 0) - (y > H_ - 20 ? 0.1 : 0), x, y)); }
  // telhado de ardósia em duas águas + frontão central
  for (let y = 18; y < 42; y++) { const ins = Math.round((42 - y) * 0.5); for (let x = ins; x < W_ - ins; x++) P.p(x, y, P.tone(Tl, 0.35 + (y % 4 === 0 ? 0.15 : 0) + (x < W_ / 2 ? 0.12 : 0), x, y)); }
  for (let y = 0; y < 42; y++) { const w = Math.round(y * 1.4); for (let x = -w; x <= w; x++) P.p(W_ / 2 + x, y, y > 36 ? '#a89a88' : P.tone(Pd, 0.7 - Math.abs(x) / 120, W_ / 2 + x, y)); }
  P.rect(W_ / 2 - 46, 38, 92, 3, '#8a7a68');
  // emblema: uma vela dentro de um círculo (a casa é de caridade, não da Coroa: o emblema é antigo)
  P.ball(W_ / 2, 24, 9, 9, ['#3a4a6a', '#4a5a7a', '#5a6a8a', '#6a7a9a', '#7a8aaa']);
  P.rect(W_ / 2 - 2, 22, 4, 8, '#f2ecdc'); P.p(W_ / 2, 19, '#ffd060'); P.p(W_ / 2, 20, '#ffb040'); P.p(W_ / 2 - 1, 21, '#ff9a30');
  // janelas em três andares (acesas, uma apagada aqui e ali)
  const jan = (x, y, acesa) => { P.rect(x - 1, y - 1, 16, 22, '#8a7a68'); P.rect(x, y, 14, 20, acesa ? '#ffe8a0' : '#2a3448'); P.rect(x + 6, y, 2, 20, '#6a5a48'); P.rect(x, y + 9, 14, 2, '#6a5a48'); if (acesa) { P.rect(x + 1, y + 1, 4, 3, '#fff8d0'); } P.rect(x - 2, y + 20, 18, 2, '#c8bca8'); };
  for (let a = 0; a < 3; a++) for (let i = 0; i < 8; i++) { const x = 12 + i * 34 + (i >= 4 ? 8 : 0); if (a === 2 && i >= 3 && i <= 4) continue; jan(x, 50 + a * 40, hash(i, a, 11) % 4 !== 0); }
  // portal central com escada (a porta fica nos tiles 8 e 9 da fachada)
  const px = 8 * 16 - 4, pw = 40; P.rect(px - 6, 120, pw + 12, 56, '#a89a88'); for (let y = 120; y < 126; y++) { const w = Math.round(Math.sqrt(Math.max(0, 36 - (126 - y) * (126 - y))) * 3.5); P.rect(px + pw / 2 - w, y, w * 2, 1, '#8a7a68'); }
  P.rect(px, 128, pw, 48, '#4a3424'); P.rect(px + pw / 2 - 1, 128, 2, 48, '#2a1a14'); for (const dx of [6, pw - 10]) P.rect(px + dx, 146, 3, 3, '#c8a040');
  P.rect(px - 4, 124, pw + 8, 4, '#c8bca8');
  // placa
  P.rect(px - 18, 108, pw + 36, 9, '#2a3448'); P.rect(px - 17, 109, pw + 34, 7, '#3a4a6a'); for (let i = 0; i < 14; i++) P.rect(px - 13 + i * 5, 111, 3, 3, '#e8dcc0');
  // canos de cobre novos subindo pela parede até o telhado (detalhe sinistro: são novos demais)
  for (const x of [6, W_ - 10]) for (let y = 30; y < H_ - 4; y++) { P.p(x, y, '#e8a070'); P.p(x + 1, y, '#c87848'); P.p(x + 2, y, '#7a4028'); if (y % 24 === 10) P.rect(x - 1, y, 5, 2, '#5a5a6a'); }
  return FACH_C = P.outline().canvas();
}
// ---------- camas, potes, biombo, bancos ----------
const CAMAH_C = {};
function camaHArt(v, ocup, pote) {
  const key = v + '_' + ocup + '_' + pote; if (CAMAH_C[key]) return CAMAH_C[key];
  const P = new Pix(20, 44), Fe = ramp('#8a9aa8'), cob = ['#8ab0c8', '#c88aa0', '#a8c890', '#c8b07a'][v % 4];
  P.cyl(1, 8, 2, 30, Fe); P.cyl(17, 8, 2, 30, Fe); P.rect(1, 8, 18, 2, Fe[3]); for (let x = 4; x < 17; x += 3) P.rect(x, 10, 1, 6, Fe[2]);
  P.rect(2, 16, 16, 22, '#e8ecea'); P.rect(3, 17, 14, 5, '#ffffff');
  P.rect(2, 24, 16, 14, cob); P.rect(2, 24, 16, 1, '#ffffff'); for (let y = 26; y < 38; y += 4) P.rect(2, y, 16, 1, '#00000022');
  if (ocup) { P.ball(10, 20, 4, 3.5, ramp(['#e0b090', '#a8704a', '#c8906a'][v % 3])); P.rect(6, 17, 8, 2, ['#3a2a1a', '#d8d4d0', '#6a4a2a'][v % 3]); P.ball(10, 30, 5, 4, ramp(cob)); }
  P.rect(1, 38, 2, 6, Fe[1]); P.rect(17, 38, 2, 6, Fe[1]);
  if (pote) { P.rect(17, 0, 1, 14, '#c87848'); P.rect(15, 12, 5, 7, '#8a9aa8'); P.rect(16, 13, 3, 5, '#ffc040'); P.p(17, 14, '#fff0a0'); P.rect(12, 18, 6, 1, '#c87848'); }
  return CAMAH_C[key] = P.outline().canvas();
}
const POTE_C = {};
function potesArt(f) {
  if (POTE_C[f]) return POTE_C[f]; const P = new Pix(22, 40);
  P.rect(10, 0, 2, 16, '#c87848'); P.rect(2, 14, 18, 2, '#c87848'); P.rect(2, 14, 1, 8, '#c87848'); P.rect(19, 14, 1, 8, '#c87848');
  P.rect(0, 30, 22, 3, '#6a7a88'); P.rect(1, 33, 2, 7, '#4a5a68'); P.rect(19, 33, 2, 7, '#4a5a68');
  for (const x of [0, 7, 14]) { P.rect(x, 21, 7, 9, '#9aaab8'); P.rect(x + 1, 22, 5, 7, (f + x) % 3 ? '#ffc040' : '#d88a20'); P.p(x + 2, 23, '#fff0a0'); P.rect(x + 1, 20, 5, 1, '#5a5a6a'); }
  return POTE_C[f] = P.outline().canvas();
}
function bancoHArt() { const P = new Pix(32, 20), M = ramp('#6a4a3a'); P.cyl(0, 6, 32, 4, M, true); P.rect(0, 0, 32, 3, M[2]); P.rect(2, 10, 2, 10, M[1]); P.rect(28, 10, 2, 10, M[1]); return P.outline().canvas(); }
function biomboArt() { const P = new Pix(30, 40); for (let i = 0; i < 3; i++) { P.rect(i * 10, 2, 9, 32, i % 2 ? '#c8d8d4' : '#e0ece6'); P.rect(i * 10, 2, 1, 32, '#8a9aa8'); } P.rect(0, 0, 30, 2, '#8a9aa8'); for (const x of [1, 28]) P.rect(x, 34, 1, 6, '#6a7a88'); return P.outline().canvas(); }
function vasoArt() { const P = new Pix(14, 26); P.rect(3, 16, 8, 10, '#a85a3a'); P.rect(2, 16, 10, 2, '#c87a5a'); for (let i = 0; i < 6; i++) { const a = -1.2 + i * 0.5; P.line(7, 16, 7 + Math.round(Math.cos(a) * 6), 16 - 6 - Math.round(Math.abs(Math.sin(a)) * 8), '#4a9a6a'); } P.p(4, 5, '#ff9ab8'); P.p(10, 6, '#ffd060'); return P.outline().canvas(); }
function cartazHArt() { const P = new Pix(22, 18); P.rect(0, 0, 22, 18, '#e8dcc0'); P.rect(0, 0, 22, 3, '#3a7a7a'); for (let i = 0; i < 4; i++) P.rect(3, 6 + i * 3, 12 + (i % 2) * 4, 1, '#5a5048'); P.rect(16, 6, 4, 6, '#ffc040'); return P.outline().canvas(); }
function arquivoArt() { const P = new Pix(18, 30), M = ramp('#6a7a88'); P.rect(0, 0, 18, 30, M[2]); for (let i = 0; i < 3; i++) { P.rect(1, 2 + i * 9, 16, 8, M[3]); P.rect(7, 5 + i * 9, 4, 2, '#c8a040'); } return P.outline().canvas(); }

// ---------- fundo de batalha: corredor do hospital, de noite ----------
let BG_HOSP = null;
function bgHospital() {
  if (BG_HOSP) return BG_HOSP;
  const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) {
    if (y < 92) P.p(x, y, y < 56 ? (x % 12 === 11 || y % 12 === 11 ? '#5a6a74' : '#7a8c90') : y < 62 ? '#2a5a5a' : '#3a4a58');
    else { const xadrez = ((x >> 4) + (y >> 3)) % 2; P.p(x, y, xadrez ? '#4a6a68' : '#5a7a76'); }
  }
  // janelas com luar
  for (const x of [20, 100, 180]) { P.rect(x, 14, 40, 34, '#1a2440'); P.rect(x + 19, 14, 2, 34, '#5a6a74'); P.rect(x, 30, 40, 2, '#5a6a74'); P.rect(x + 3, 16, 6, 4, '#c8d8f0'); for (let i = 0; i < 24; i++) P.p(x + 2 + hash(i, x, 2) % 36, 16 + hash(x, i, 3) % 30, '#8a9ac8'); }
  // fios e potes no alto
  for (let x = 0; x < 240; x++) P.p(x, 4 + Math.round(Math.sin(x / 20) * 2), '#c87848');
  for (const x of [60, 150, 220]) { P.rect(x, 4, 1, 22, '#c87848'); P.rect(x - 3, 26, 7, 9, '#9aaab8'); P.rect(x - 2, 27, 5, 7, '#ffc040'); }
  // luz do chão (lanterna de ronda passando)
  for (let y = 92; y < 150; y++) for (let x = 0; x < 240; x++) { const d = Math.hypot((x - 120) / 1.8, y - 140); if (d < 60 && (x + y) % 3 === 0) P.p(x, y, '#8aa89a'); }
  return BG_HOSP = P.canvas();
}

// ---------- inimigos ----------
// PESADELO: o que sobra quando tiram a lembrança. Uma sombra de lençol rasgado cheia de olhos que piscam fora de tempo.
const PES_C = {};
function pesadeloArt(f) {
  if (PES_C[f]) return PES_C[f]; const P = new Pix(32, 34), cx = 16, R = ['#0a0612', '#1a1028', '#2a1a3e', '#3e2a58', '#5a4278'];
  P.ball(cx, 14, 12, 11, R, { amb: 0.15 });
  for (let y = 18; y < 34; y++) { const w = Math.round(11 - (y - 18) * 0.45); for (let x = -w; x <= w; x++) if ((y + Math.abs(x) + f * 2) % 5 !== 0 || y < 24) P.p(cx + x + Math.round(Math.sin((y + f * 3) / 3) * 2), y, y > 28 ? R[1] : R[2]); }
  const olhos = [[-5, 10], [4, 9], [-1, 15], [7, 15], [-8, 16], [2, 21]];
  olhos.forEach(([ox, oy], i) => { const ab = (i + f) % 4 !== 0; if (ab) { P.rect(cx + ox - 1, oy, 3, 2, '#e8e0f8'); P.p(cx + ox, oy, '#ff4a6a'); } else P.rect(cx + ox - 1, oy + 1, 3, 1, '#5a4278'); });
  return PES_C[f] = P.outline(0.3, '#000000').canvas();
}
// LENÇOL: lençol de cama que levantou sozinho; bordado da Casa de Saúde num canto; enrola quem chega perto.
const LEN_C = {};
function lencolArt(f) {
  if (LEN_C[f]) return LEN_C[f]; const P = new Pix(34, 40), cx = 17, Ln = ['#8a9aa8', '#b8c8d0', '#d8e4e8', '#eef4f4', '#ffffff'];
  P.ball(cx, 12, 11, 10, Ln, { amb: 0.35 });
  for (let y = 12; y < 38; y++) { const w = Math.round(11 + (y - 12) * 0.2); for (let x = -w; x <= w; x++) { const onda = Math.sin((x + f * 4) / 3) * 2; if (y > 34 + onda) continue; P.p(cx + x, y, x < -w * 0.4 ? Ln[1] : x > w * 0.5 ? Ln[0] : Ln[2]); } }
  for (let y = 16; y < 36; y += 5) P.line(cx - 6, y, cx - 2, y + 3, '#a8b8c0');
  P.rect(cx - 5, 10, 3, 4, '#1a1028'); P.rect(cx + 3, 10, 3, 4, '#1a1028');
  P.rect(cx + 6, 26, 5, 5, '#3a7a7a'); P.p(cx + 8, 27, '#ffd060');
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) P.p(cx + s * (12 + i), 18 + Math.round(Math.sin(i + f) * 2) + i, Ln[1]);
  return LEN_C[f] = P.outline().canvas();
}
// RELÓGIO DE PLANTÃO (mini-chefe): relógio de pêndulo do corredor que criou braços de ponteiro. O mostrador muda de
// cor com a HORA: manhã (azul-claro), tarde (laranja), noite (roxo com estrelas). Bem mais detalhado (chefe).
const REL_C = {};
function relogioArt(f, hora, armando) {
  const key = f + '_' + hora + '_' + (armando ? 1 : 0); if (REL_C[key]) return REL_C[key];
  const W_ = 72, H_ = 104, P = new Pix(W_, H_), cx = 36, Md = ramp('#6a3a24'), Ou = ['#5a3a10', '#8a5a18', '#c8902a', '#f0c050', '#fff0a0'];
  const FACE = { manha: ['#5a8ac8', '#8ab8e8', '#c8e4ff'], tarde: ['#c85a20', '#f09040', '#ffd8a0'], noite: ['#2a1a4a', '#4a2a7a', '#8a6ac8'] }[hora] || ['#5a8ac8', '#8ab8e8', '#c8e4ff'];
  // caixa do relógio (cilindro de madeira com molduras)
  P.cyl(cx - 14, 30, 28, 60, Md, false, { grain: 5 });
  P.rect(cx - 16, 30, 32, 3, Md[3]); P.rect(cx - 16, 86, 32, 4, Md[1]); P.rect(cx - 18, 90, 36, 6, Md[2]); P.rect(cx - 18, 90, 36, 1, Md[4]);
  // pés de garra
  for (const s of [-1, 1]) { P.rect(cx + s * 14 - 3, 96, 6, 6, Md[1]); for (let i = 0; i < 3; i++) P.p(cx + s * 14 - 2 + i * 2, 102, Ou[2]); }
  // ornamentos: filete dourado, entalhes em volutas e uma placa de latão "PLANTÃO"
  for (let y = 34; y < 86; y++) { P.p(cx - 12, y, Ou[1]); P.p(cx + 11, y, Ou[0]); }
  for (const s of [-1, 1]) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 1.5; P.p(cx + s * (9 + Math.round(Math.cos(a) * 3)), 38 + Math.round(Math.sin(a) * 3), Md[4]); P.p(cx + s * (9 + Math.round(Math.cos(a) * 3)), 84 - Math.round(Math.sin(a) * 3), Md[0]); }
  P.rect(cx - 7, 44, 14, 5, Ou[1]); P.rect(cx - 6, 45, 12, 3, Ou[2]); for (let i = 0; i < 5; i++) P.p(cx - 5 + i * 2 + 1, 46, Ou[0]);
  // engrenagens visíveis pelas frestas (é um relógio que ganhou vontade própria)
  for (const [gx, gy, r] of [[cx - 10, 60, 3], [cx + 10, 70, 3]]) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + f * 0.6 * (gx < cx ? 1 : -1); P.p(gx + Math.round(Math.cos(a) * r), gy + Math.round(Math.sin(a) * r), Ou[3]); P.p(gx, gy, Ou[4]); }
  // janela do pêndulo
  P.rect(cx - 8, 52, 16, 30, '#1a1020'); const sw = Math.round(Math.sin(f * Math.PI / 2) * 5);
  P.line(cx, 53, cx + sw, 74, Ou[2]); P.ball(cx + sw, 76, 4, 4, Ou); P.rect(cx - 8, 52, 16, 1, '#3a2a30');
  for (let i = 0; i < 9; i++) P.p(cx - 6 + i, 54 + i * 2, '#4a3a5a'); P.rect(cx - 9, 51, 18, 1, Ou[2]); P.rect(cx - 9, 82, 18, 1, Ou[1]);
  // cabeça: mostrador redondo com moldura dourada
  P.ball(cx, 22, 20, 20, Ou, { amb: 0.3 });
  for (let y = -16; y <= 16; y++) for (let x = -16; x <= 16; x++) { const d = x * x + y * y; if (d <= 256) P.p(cx + x, 22 + y, d > 196 ? FACE[0] : (x + y) % 9 === 0 ? FACE[2] : FACE[1]); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.rect(cx + Math.round(Math.cos(a) * 13) - (i % 3 === 0 ? 1 : 0), 22 + Math.round(Math.sin(a) * 13), i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1, '#1a1020'); }
  if (hora === 'noite') for (let i = 0; i < 6; i++) P.p(cx - 8 + hash(i, 2, 5) % 16, 14 + hash(5, i, 2) % 16, '#ffffff');
  // olhos no mostrador (dois furos de corda) e boca de algarismos
  for (const s of [-1, 1]) { P.ball(cx + s * 6, 18, 3, 3, ['#1a1020', '#2a1a30', '#3a2a40', '#4a3a50', '#5a4a60']); P.p(cx + s * 6, 18, armando ? '#ff4a4a' : '#ffd060'); }
  for (let x = -6; x <= 6; x++) P.p(cx + x, 29 + (x % 2 ? 1 : 0), '#1a1020');
  // ponteiros que viraram braços (giram com f)
  const ang = f * 0.5 + (armando ? 2.6 : 0);
  for (const [len, w, a, s] of [[34, 2, ang, -1], [28, 3, -ang * 0.6 + 1, 1]]) {
    const ox = cx + s * 18, oy = 34; P.line(cx + s * 4, 30, ox, oy, Ou[1], 2);
    const ex = ox + Math.round(Math.cos(Math.PI / 2 + s * 0.9 + a * 0.2) * len * 0.6 * s), ey = oy + Math.round(Math.sin(Math.PI / 2 + a * 0.2) * len * 0.7);
    P.line(ox, oy, ex, ey, '#2a1a20', w + 1); P.line(ox, oy, ex, ey, Ou[3], w); P.poly([[ex - 4, ey], [ex + 4, ey], [ex, ey + 7]], Ou[3]);
  }
  return REL_C[key] = P.outline().canvas();
}
