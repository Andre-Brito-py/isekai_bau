// ================= ARTE DO CAP. 7 — A MINA DE ORIGEM =================
// Tiles (rocha, chão de rocha, musgo, veio de âmbar, trilho, respiro de vapor, ponte de cristal), o acampamento da serra
// (boca da mina, canos de âmbar, barracas, galpão, vagonetes, fogueira), a galeria de bombas (bombas, válvulas, vapor),
// o Coração (pedras de eco, pontes de cristal), o Andar 1 do jogo 1 (pedestal do despertar, gancho do lustre, estantes
// afogadas), o EXTRATOR; inimigos (Cão-Lanterna, Válvula Viva, Rato-de-Vela Ambarino, Cogumelo de Âmbar, Morcego
// Carimbado), mini-chefes (A BROCA, o GUARDA-MUSGO AMBARINO), o chefe (O EXTRATOR) e fundos de batalha.
const KEY7 = Object.assign({}, KEY2, {
  'R': { t: 'rocha', solid: true }, 'r': { t: 'chaoRocha' }, 'm': { t: 'musgo7' }, 'a': { t: 'veio' }, 't': { t: 'trilho7' },
  'v': { t: 'respiro' }, 'b': { t: 'cristal7' }, ' ': { t: 'abismo', solid: true }, 'X': { t: 'chaoRocha', solid: true }
});
{ const _ta8 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (!['rocha', 'chaoRocha', 'musgo7', 'veio', 'trilho7', 'respiro', 'cristal7'].includes(k)) return _ta8(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y, s = 5) => hash(x + v * 13, y + v * 29, s) % 100;
  const chao = (x, y) => { const r = h(x, y, 3); return r < 10 ? '#4a3e3a' : r < 22 ? '#5a4c46' : r < 26 ? '#6a5a52' : '#52443e'; };
  if (k === 'rocha') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x >> 1, y >> 1, 8); P.p(x, y, r < 15 ? '#1e1820' : r < 50 ? '#2a2228' : r < 80 ? '#342a30' : '#3e3238'); } if (v % 5 === 2) { P.p(6, 5, '#c8902a'); P.p(7, 5, '#ffd070'); } }
  else if (k === 'chaoRocha') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, chao(x, y)); if (v % 4 === 1) { P.rect(4, 9, 3, 2, '#3a302c'); } }
  else if (k === 'musgo7') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x, y, 11); P.p(x, y, r < 30 ? '#2a4a2e' : r < 60 ? '#3a5a36' : r < 75 ? '#4a6a3e' : '#4a4038'); } if (v % 3 === 0) { P.p(4, 4, '#8ac860'); P.p(11, 10, '#8ac860'); } }
  else if (k === 'veio') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, chao(x, y)); for (let i = 0; i < 16; i++) { const y = 8 + Math.round(Math.sin((i + v * 3) / 3) * 3); P.p(i, y, f % 2 ? '#ffd070' : '#e8a030'); P.p(i, y + 1, '#a86a20'); } }
  else if (k === 'trilho7') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, h(x, y, 4) < 30 ? '#5a4a3a' : '#4a3e32'); for (let y = 1; y < 16; y += 4) P.rect(1, y, 14, 2, '#6a4a2a'); P.rect(3, 0, 1, 16, '#9a9aa8'); P.rect(12, 0, 1, 16, '#9a9aa8'); }
  else if (k === 'respiro') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, chao(x, y)); P.rect(2, 2, 12, 12, '#2a2228'); for (let i = 3; i < 14; i += 2) P.rect(i, 3, 1, 10, '#6a6470'); P.rect(2, 2, 12, 1, '#8a8490'); }
  else { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, (x + y) % 5 === 0 ? '#e8fbff' : (x * 3 + y) % 7 < 3 ? '#8ad8f0' : '#5ab0d8'); }
  return TILE2[key] = P.canvas();
}; }
const OBJ7 = {};
const o7 = (k, f) => OBJ7[k] || (OBJ7[k] = f());
// ---------- o acampamento ----------
function bocaMinaArt() { return o7('boca', () => {
  const P = new Pix(96, 96), Md = ramp('#6a4430'), Rk = ['#1e1820', '#2a2228', '#342a30', '#3e3238', '#4a3e44'];
  P.ball(48, 70, 48, 40, Rk, { amb: 0.2 });
  P.rect(30, 46, 36, 50, '#0a0608');
  for (let y = 48; y < 96; y++) for (let x = 32; x < 64; x++) if ((x + y) % 11 === 0) P.p(x, y, '#1a1014');
  P.rect(26, 40, 6, 56, Md[1]); P.rect(64, 40, 6, 56, Md[1]); P.rect(22, 36, 52, 8, Md[2]); P.rect(22, 36, 52, 2, Md[4]);
  for (let x = 28; x < 70; x += 8) P.p(x, 39, '#2a1a10');
  P.rect(40, 26, 16, 10, '#2a1a10'); P.rect(41, 27, 14, 8, '#c8902a');                                     // placa
  for (const x of [24, 70]) { P.rect(x, 46, 4, 6, '#3a3048'); P.rect(x + 1, 47, 2, 4, '#ffd070'); }        // lampiões
  P.line(34, 96, 46, 50, '#9a9aa8'); P.line(62, 96, 50, 50, '#9a9aa8');                                    // trilhos entrando
  return P.outline().canvas(); }); }
function canoAmbarArt(w, vert) { return o7('cano' + w + (vert ? 'v' : 'h'), () => {
  const L = w * 16, P = vert ? new Pix(14, L) : new Pix(L, 14), Fe = ramp('#7a6a5a');
  for (let i = 0; i < L; i++) for (let j = 0; j < 12; j++) { const c = j < 2 || j > 9 ? Fe[1] : j < 4 ? Fe[3] : (i % 24 < 3) ? Fe[2] : j < 7 ? '#ffd070' : '#e8a030'; vert ? P.p(j + 1, i, c) : P.p(i, j + 1, c); }
  for (let i = 0; i < L; i += 24) for (let j = 0; j < 14; j++) vert ? P.p(j, i, Fe[0]) : P.p(i, j, Fe[0]);
  return P.outline().canvas(); }); }
function barracaGuardaArt(w) { return o7('bg' + w, () => {
  const W_ = w * 16, P = new Pix(W_, 70), Lo = ramp('#6a6a4a');
  P.poly([[0, 66], [W_ / 2, 8], [W_, 66]], (x, y) => P.tone(Lo, 0.75 - Math.abs(x - W_ / 2) / W_ - (y % 10 === 0 ? 0.1 : 0), x, y));
  P.poly([[W_ / 2 - 10, 66], [W_ / 2, 36], [W_ / 2 + 10, 66]], '#1a1418'); P.rect(W_ / 2 - 1, 2, 2, 8, '#5a3a24'); P.rect(W_ / 2 + 1, 2, 10, 6, '#2a3a7a'); P.rect(W_ / 2 + 3, 4, 4, 2, '#c89a30');
  return P.outline().canvas(); }); }
function galpaoBombasArt() { return o7('galp', () => {
  const W_ = 9 * 16, P = new Pix(W_, 110), Fe = ramp('#5a5a66'), Tj = ramp('#6a3a30');
  for (let y = 30; y < 106; y++) for (let x = 2; x < W_ - 2; x++) { const row = y >> 2, off = (row % 2) * 4, edge = (y % 4 === 3) || ((x + off) % 8 === 7); P.p(x, y, edge ? Tj[0] : P.tone(Tj, 0.5 - x / 400, x, y)); }
  P.poly([[0, 32], [W_ / 2, 6], [W_, 32]], (x, y) => P.tone(Fe, 0.7 - x / 300, x, y));
  for (const x of [20, 110]) { P.rect(x, 0, 12, 30, Fe[1]); P.rect(x - 2, 0, 16, 3, Fe[3]); }
  for (let x = 14; x < W_ - 14; x += 26) { P.rect(x, 48, 14, 18, '#1a1418'); P.rect(x + 1, 49, 12, 16, '#ffb050'); P.rect(x + 7, 49, 1, 16, '#1a1418'); }
  P.rect(W_ / 2 - 12, 74, 24, 32, '#2a2228'); P.rect(W_ / 2 - 10, 76, 20, 30, '#3a3240'); P.ball(W_ / 2, 92, 6, 6, ramp('#8a6a30'));
  return P.outline().canvas(); }); }
function fogueiraArt(f) { return o7('fog' + (f % 3), () => { const P = new Pix(22, 24); for (let i = 0; i < 5; i++) P.line(2 + i * 4, 22, 11, 16, '#5a3a20', 2); const hh = [10, 12, 9][f % 3]; P.poly([[5, 20], [11, 20 - hh - 4], [17, 20]], '#e86a20'); P.poly([[8, 20], [11, 20 - hh], [14, 20]], '#ffd070'); P.p(11, 20 - hh - 2, '#fff0c0'); return P.outline().canvas(); }); }
function pinheiroArt(v) { return o7('pin' + v, () => { const P = new Pix(34, 64), Vd = ramp(v % 2 ? '#2a5a3e' : '#3a6a46'); P.rect(15, 50, 4, 14, '#4a3020'); for (let k = 0; k < 4; k++) { const y0 = 6 + k * 12, w = 6 + k * 5; P.poly([[17 - w, y0 + 14], [17, y0], [17 + w, y0 + 14]], (x, y) => P.tone(Vd, 0.7 - (x - 17 + w) / (w * 3) - (y - y0) / 40, x, y)); } P.p(17, 4, '#e8f0e0'); return P.outline().canvas(); }); }
function caoMapaArt(f, amigo) { const k = 'cao' + f + (amigo ? 1 : 0); return o7(k, () => { const P = new Pix(26, 20), C = ramp(amigo ? '#a8784a' : '#7a6050'), b = f % 2; P.cyl(5, 6 + b, 15, 8, C, true); P.ball(21, 6 + b, 4, 4, C); P.rect(23, 7 + b, 3, 2, '#2a1a14'); P.p(21, 3 + b, '#2a1a14'); P.rect(6, 13, 2, 6 - b, C[1]); P.rect(17, 13, 2, 5 + b, C[1]); P.line(4, 8 + b, 1, 3 + b * 2, C[2], 2); if (!amigo) P.rect(18, 9 + b, 6, 1, '#c8c8d8'); else P.p(22, 9 + b, '#e86a8a'); return P.outline().canvas(); }); }
// ---------- galerias de bombas ----------
function bombaArt() { return o7('bomba', () => { const P = new Pix(32, 48), Fe = ramp('#5a5a66'); P.cyl(4, 14, 24, 32, Fe); for (let y = 18; y < 44; y += 6) P.rect(4, y, 24, 1, Fe[0]); P.ball(16, 12, 10, 8, Fe); P.rect(13, 0, 6, 8, Fe[2]); P.ball(16, 30, 5, 5, ['#3a1a0a', '#a86a20', '#ffd070', '#fff0c0', '#ffffff']); return P.outline().canvas(); }); }
function valvulaArt(aberta) { return o7('val' + (aberta ? 1 : 0), () => { const P = new Pix(22, 30); P.rect(9, 14, 4, 16, '#5a5a66'); P.ball(11, 11, 9, 9, ramp(aberta ? '#3a8a4a' : '#a83a2a')); P.ball(11, 11, 6, 6, ['#1a1418', '#2a2228', '#2a2228', '#2a2228', '#2a2228']); for (let a = 0; a < 4; a++) { const an = a / 4 * Math.PI * 2 + (aberta ? 0.4 : 0); P.line(11, 11, 11 + Math.cos(an) * 8, 11 + Math.sin(an) * 8, aberta ? '#8af0a0' : '#ff9a8a', 2); } P.ball(11, 11, 2, 2, ramp('#c89a30')); return P.outline().canvas(); }); }
function vaporFx(x, y, t, forte) { for (let i = 0; i < (forte ? 7 : 2); i++) { const k = ((t * 0.9 + i * 17) % 50) / 50, r = 3 + k * 9; bx.globalAlpha = (forte ? 0.55 : 0.2) * (1 - k); bx.fillStyle = '#e8e8f0'; bx.fillRect(Math.round(x + 8 + Math.sin(i * 2.1 + t * 0.05) * 5 - r / 2), Math.round(y + 8 - k * 26 - r / 2), Math.round(r), Math.round(r)); } bx.globalAlpha = 1; }
// ---------- o Coração e o Andar 1 ----------
function pedraEcoArt(ativa) { return o7('eco' + (ativa ? 1 : 0), () => { const P = new Pix(20, 22); P.ball(10, 14, 9, 8, ['#2a2430', '#4a4050', '#6a6070', '#8a8090', '#a8a0b0']); for (let i = 0; i < 5; i++) P.p(6 + i * 2, 12 + (i % 2), ativa ? '#fff0a0' : '#8fe3d8'); P.rect(9, 8, 2, 3, ativa ? '#ffd070' : '#8fe3d8'); return P.outline().canvas(); }); }
function pedestalArt() { return o7('ped', () => { const P = new Pix(40, 34), Pd = ['#3a3440', '#5a5260', '#7a7280', '#9a92a0', '#bab2c0']; P.rect(4, 18, 32, 16, Pd[1]); P.rect(2, 14, 36, 6, Pd[3]); P.rect(2, 14, 36, 1, Pd[4]); for (let x = 6; x < 34; x += 7) P.rect(x, 22, 3, 10, Pd[2]); P.rect(10, 8, 20, 7, '#2a1a10'); P.rect(11, 9, 18, 5, '#4a3020'); P.rect(18, 9, 4, 5, '#c8902a'); return P.outline().canvas(); }); }
function ganchoLustreArt() { return o7('gancho', () => { const P = new Pix(16, 40); P.rect(7, 0, 2, 26, '#5a5a66'); for (let i = 0; i < 6; i++) P.rect(6 + (i % 2), 4 + i * 4, 4, 2, '#7a7a86'); P.ball(8, 30, 5, 5, ramp('#8a8a96')); P.rect(7, 30, 2, 6, '#2a2228'); return P.outline().canvas(); }); }
function estanteAfogadaArt() { return o7('estA', () => { const P = new Pix(48, 50), Md = ramp('#4a3a2a'); P.rect(0, 4, 48, 46, Md[1]); for (let s = 0; s < 3; s++) { const y = 8 + s * 14; P.rect(2, y, 44, 12, Md[0]); for (let x = 4; x < 44; x += 4) P.rect(x, y + 2 + (x % 3), 3, 10 - (x % 3), ['#3a5a7a', '#7a3a3a', '#5a6a3a', '#6a5a7a'][(x + s) % 4]); } P.rect(0, 38, 48, 12, '#2a5a6a'); for (let x = 0; x < 48; x += 3) P.p(x, 38, '#8ad8f0'); return P.outline().canvas(); }); }
function extratorMapaArt(acordado) { return o7('extM' + (acordado ? 1 : 0), () => {
  const W_ = 192, H_ = 120, P = new Pix(W_, H_), Fe = ramp('#4a4450'), Lt = ramp('#c89a30');
  P.ball(96, 72, 90, 48, Fe, { amb: 0.3 });
  for (const s of [-1, 1]) { P.cyl(96 + s * 70 - 10, 10, 20, 100, Fe); for (let y = 14; y < 106; y += 10) P.rect(96 + s * 70 - 10, y, 20, 2, Lt[2]); }
  P.cyl(80, 0, 32, 60, ramp('#5a5060')); P.rect(84, 56, 24, 40, '#1a1418');
  for (let y = 60; y < 96; y += 6) P.rect(86, y, 20, 3, acordado ? '#ffd070' : '#5a4a3a');
  P.ball(96, 50, 14, 14, acordado ? ['#5a0a0a', '#c82a2a', '#ff6a5a', '#ffd0c0', '#ffffff'] : ['#1a1418', '#2a2430', '#3a3440', '#4a4450', '#5a5460'], { amb: 0.6 });
  for (let i = 0; i < 8; i++) { const x = 20 + i * 22; P.rect(x, 96, 14, 20, '#e8e4f0'); P.rect(x + 2, 99, 10, 15, '#ffd070'); P.rect(x, 95, 14, 2, '#c83a3a'); }
  return P.outline().canvas(); }); }
// ---------- fundos de batalha ----------
const BG7 = {};
function bgMinaOrigem() { if (BG7.m) return BG7.m; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 60 ? (y < 24 ? '#101428' : '#1a2034') : y < 96 ? '#2a2228' : (hash(x >> 2, y >> 2, 3) % 7 === 0 ? '#3a3038' : '#4a3e3a'));
  for (let i = 0; i < 40; i++) P.p((i * 59) % 240, (i * 13) % 24, '#d8d8ff');
  for (let x = 0; x < 240; x++) { const hh = 34 + Math.round(10 * Math.sin(x / 19) + 6 * Math.sin(x / 7)); for (let y = 96 - hh; y < 96; y++) P.p(x, y, y < 96 - hh + 3 ? '#3a3238' : '#2a2228'); }
  P.rect(96, 52, 48, 44, '#0a0608'); P.rect(92, 48, 56, 6, '#6a4430'); P.rect(92, 52, 4, 44, '#5a3a24'); P.rect(144, 52, 4, 44, '#5a3a24');
  for (let x = 0; x < 240; x++) { P.p(x, 88, x % 24 < 3 ? '#7a6a5a' : '#ffd070'); P.p(x, 89, '#e8a030'); }
  return BG7.m = P.canvas(); }
function bgBombas() { if (BG7.b) return BG7.b; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((hash(x >> 3, y >> 3, 5) % 4 === 0) ? '#2e2630' : '#262028') : ((x + y) % 14 < 7 ? '#4a3e3a' : '#423630'));
  for (const x of [30, 120, 210]) { P.rect(x - 12, 30, 24, 66, '#4a4a56'); for (let y = 34; y < 96; y += 8) P.rect(x - 12, y, 24, 1, '#2a2a34'); P.ball(x, 60, 6, 6, ['#3a1a0a', '#a86a20', '#ffd070', '#fff0c0', '#ffffff']); }
  for (let x = 0; x < 240; x++) for (let j = 0; j < 8; j++) P.p(x, 14 + j, j < 2 || j > 5 ? '#6a5a4a' : x % 30 < 3 ? '#5a4a3a' : '#ffd070');
  return BG7.b = P.canvas(); }
function bgCoracao() { if (BG7.c) return BG7.c; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) { const d = Math.hypot(x - 120, (y - 60) * 1.6); P.p(x, y, y >= 96 ? ((x + y) % 12 < 6 ? '#4a3e3a' : '#42363a') : d < 40 ? '#04020a' : d < 70 ? '#14101a' : '#221a24'); }
  for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2, r = 50 + (i % 3) * 14; P.p(Math.round(120 + Math.cos(a) * r), Math.round(60 + Math.sin(a) * r / 1.6), '#ffd070'); }
  for (let i = 0; i < 6; i++) P.rect(10 + i * 40, 0, 3, 96, '#8ad8f0');
  return BG7.c = P.canvas(); }
function bgAndar1() { if (BG7.a) return BG7.a; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((hash(x >> 4, y >> 4, 9) % 3 === 0) ? '#2a3a2e' : '#22302a') : ((x >> 3) + (y >> 3)) % 2 ? '#3a4a36' : '#34442e');
  for (const x of [40, 200]) { P.rect(x - 20, 20, 40, 76, '#3a2a20'); for (let s = 0; s < 5; s++) for (let i = 0; i < 9; i++) P.rect(x - 18 + i * 4, 24 + s * 14, 3, 10, ['#3a5a7a', '#7a3a3a', '#5a6a3a'][(i + s) % 3]); }
  P.rect(110, 0, 20, 96, '#5a5a66'); for (let y = 0; y < 96; y += 6) P.rect(110, y, 20, 2, '#ffd070');
  return BG7.a = P.canvas(); }
function bgFundo7() { if (BG7.f) return BG7.f; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((x + y * 2) % 23 === 0 ? '#c8902a' : '#1a1418') : ((x + y) % 10 < 5 ? '#3a302c' : '#342a28'));
  for (let i = 0; i < 12; i++) { const x = 8 + i * 20; P.rect(x, 70, 10, 26, '#e8e4f0'); P.rect(x + 2, 73, 6, 21, '#ffd070'); }
  return BG7.f = P.canvas(); }
// ---------- inimigos ----------
const INI7 = {};
function caoLanternaArt(f) { const k = 'cl' + f; if (INI7[k]) return INI7[k]; const P = new Pix(44, 34), C = ramp('#6a5040'), b = f % 2;
  P.cyl(8, 12 + b, 26, 12, C, true); P.ball(36, 10 + b, 7, 7, C); P.rect(40, 12 + b, 4, 3, '#1a1418'); P.p(38, 8 + b, '#ff3a2a'); P.p(34, 4 + b, C[1]); P.rect(33, 2 + b, 3, 4, C[1]);
  for (const x of [10, 16, 26, 32]) P.rect(x, 22, 3, 10 - (x % 2) * b, C[1]); P.line(8, 14 + b, 2, 6, C[2], 2);
  P.rect(18, 8 + b, 8, 3, '#2a3a7a'); P.rect(20, 2 + b, 5, 7, '#3a3048'); P.rect(21, 3 + b, 3, 5, '#ffd070');                       // a lanterna na coleira
  return INI7[k] = P.outline().canvas(); }
function valvulaVivaArt(f, cheia) { const k = 'vv' + f + (cheia ? 1 : 0); if (INI7[k]) return INI7[k]; const P = new Pix(38, 50), Fe = ramp('#6a6470'), b = f % 2;
  P.cyl(12, 26, 14, 22, Fe); P.ball(19, 18 + b, 16, 16, ramp(cheia ? '#c83a2a' : '#8a4a3a')); P.ball(19, 18 + b, 10, 10, ['#1a1418', '#2a2228', '#2a2228', '#3a3238', '#4a4450']);
  for (let a = 0; a < 6; a++) { const an = a / 6 * Math.PI * 2 + f * 0.3; P.line(19, 18 + b, 19 + Math.cos(an) * 14, 18 + b + Math.sin(an) * 14, '#e8a090', 2); }
  P.ball(19, 18 + b, 3, 3, ramp('#c89a30')); P.rect(14, 15 + b, 2, 2, '#ffd070'); P.rect(22, 15 + b, 2, 2, '#ffd070');
  return INI7[k] = P.outline().canvas(); }
function ratoVelaAArt(f) { const k = 'rva' + f; if (INI7[k]) return INI7[k]; const P = new Pix(34, 30), C = ramp('#8a7a6a'), b = f % 2;
  P.cyl(6, 14 + b, 20, 10, C, true); P.ball(27, 15 + b, 5, 5, C); P.p(30, 14 + b, '#1a1418'); P.rect(31, 17 + b, 2, 1, '#e8a0a0'); P.line(6, 18, 0, 12 + b * 2, '#c8a0a0');
  P.rect(12, 4 + b, 5, 10, '#f2ecdc'); P.p(14, 2 + b, '#ff9a30'); P.p(14, 1 + b, '#fff0c0'); P.rect(11, 12 + b, 7, 2, '#ffd070');   // a vela nas costas, agora com coleira de âmbar
  P.rect(20, 13 + b, 6, 2, '#c8902a'); P.p(23, 15 + b, '#ffd070');
  return INI7[k] = P.outline().canvas(); }
function cogumeloAArt(f) { const k = 'coa' + f; if (INI7[k]) return INI7[k]; const P = new Pix(34, 40), b = f % 2;
  P.cyl(12, 20, 10, 18, ramp('#d8c8a8')); P.ball(17, 16 + b, 15, 10, ramp('#c87a2a')); for (const [x, y] of [[10, 12], [20, 10], [25, 16], [13, 18]]) P.ball(x, y + b, 2, 2, ['#8a5a10', '#d8a030', '#ffd070', '#fff0b0', '#ffffff']);
  P.rect(13, 26, 2, 2, '#1a1418'); P.rect(19, 26, 2, 2, '#1a1418'); P.rect(15, 31, 4, 1, '#5a3a20');
  if (b) for (let i = 0; i < 4; i++) P.p(4 + i * 7, 4 + (i % 2) * 3, '#ffd070');
  return INI7[k] = P.outline().canvas(); }
function morcegoSeloArt(f) { const k = 'ms' + f; if (INI7[k]) return INI7[k]; const P = new Pix(40, 26), a = f % 2 ? 5 : 0;
  for (const s of [-1, 1]) P.poly([[20, 12], [20 + s * 19, 2 + a], [20 + s * 15, 14], [20 + s * 7, 20 - a]], (x, y) => (Math.abs(x - 20) + y) % 6 < 1 ? '#c8c0b0' : '#f2ecdc');
  P.ball(20, 13, 5, 5, ramp('#e8e0d0')); P.p(18, 12, '#1a1418'); P.p(22, 12, '#1a1418');
  for (const s of [-1, 1]) { P.rect(20 + s * 11 - 3, 6 + a, 6, 5, '#c83a3a'); P.rect(20 + s * 11 - 2, 7 + a, 4, 3, '#ffe0a0'); }   // o selo da Coroa nas asas de papel
  return INI7[k] = P.outline().canvas(); }
// A BROCA: a máquina que perfura até o Coração; cabeça em espiral, esteira de lagarta, cabine com lampião
function brocaArt(f, carga, fase) { const k = 'br' + f + (carga ? 1 : 0) + fase; if (INI7[k]) return INI7[k];
  const W_ = 110, H_ = 96, P = new Pix(W_, H_), Fe = ramp('#6a5a4a'), Lt = ramp('#c89a30'), b = f % 2;
  P.rect(10, 74, 70, 18, '#2a2228'); for (let x = 12; x < 80; x += 6) P.rect(x, 76 + ((x / 6 + f) % 2), 4, 14, '#4a4450'); P.ball(14, 83, 8, 8, ramp('#5a5a66')); P.ball(76, 83, 8, 8, ramp('#5a5a66'));
  P.cyl(16, 40 + b, 58, 34, Fe); for (let y = 44; y < 72; y += 7) P.rect(16, y + b, 58, 1, Fe[0]);
  P.rect(24, 22 + b, 26, 20, Fe[2]); P.rect(27, 25 + b, 20, 12, '#1a1418'); P.rect(28, 26 + b, 18, 10, fase >= 2 ? '#ff6a4a' : '#ffd070');   // cabine
  // a broca em espiral
  const g = carga ? 4 : 0;
  for (let i = 0; i < 36; i++) { const x = 74 + i, r = Math.max(1, 16 - i * 0.45), y = 56 + b; P.line(x, y - r, x, y + r, (Math.floor((i + f * 3) / 3) % 2) ? '#c8c8d8' : '#8a8a9a'); }
  if (carga) for (let i = 0; i < 6; i++) P.p(104 + (i % 3), 50 + i * 2, '#ffffff');
  P.rect(60, 30 + b, 6, 12, Fe[1]); P.rect(58, 28 + b, 10, 3, Lt[3]);
  if (fase >= 2) for (let i = 0; i < 5; i++) P.p(20 + i * 10, 42 + (i % 2) * 6, '#ffd070');
  return INI7[k] = P.outline().canvas(); }
// O GUARDA-MUSGO AMBARINO: o primeiro chefe do jogo 1, agora com um cano de âmbar enfiado nas costas, sendo drenado
function musgoAArt(f, fase) { const k = 'mg' + f + fase; if (INI7[k]) return INI7[k];
  const W_ = 96, H_ = 104, P = new Pix(W_, H_), Mg = ['#1a2a1a', '#2a4a2a', '#3a6a36', '#5a8a46', '#8ac860'], Pd = ['#2a2430', '#4a4050', '#6a6070', '#8a8090', '#a8a0b0'], b = f % 2;
  for (const s of [-1, 1]) P.cyl(48 + s * 14 - 7, 74, 14, 26, Pd);
  P.ball(48, 52 + b, 34, 30, Pd, { amb: 0.3 });
  for (let y = 24; y < 82; y++) for (let x = 14; x < 82; x++) if (P.get(x, y) && hash(x >> 2, y >> 2, 5) % 3 !== 0) P.p(x, y, P.tone(Mg, 0.55 - (y - 24) / 120 + ((x + y) % 7 === 0 ? 0.25 : 0), x, y));
  P.ball(48, 24 + b, 14, 12, Pd); for (let x = 36; x < 60; x++) if (hash(x, 1, 3) % 2) P.p(x, 14 + b + (x % 3), Mg[3]);
  P.rect(40, 22 + b, 5, 4, fase >= 2 ? '#ffd070' : '#8ac860'); P.rect(51, 22 + b, 5, 4, fase >= 2 ? '#ffd070' : '#8ac860');
  for (const s of [-1, 1]) { P.line(48 + s * 30, 40 + b, 48 + s * 42, 64 + b, Pd[2], 6); P.ball(48 + s * 42, 66 + b, 7, 7, Pd); }
  // o cano nas costas, sugando
  P.rect(70, 0, 10, 46 + b, '#7a6a5a'); P.rect(72, 0, 6, 46 + b, fase >= 2 ? '#ff9a30' : '#ffd070'); for (let y = 2; y < 46; y += 8) P.rect(70, y, 10, 2, '#5a4a3a');
  if (fase >= 2) { P.line(30, 36, 44, 60, '#ffd070'); P.line(56, 40, 64, 64, '#ffd070'); }
  return INI7[k] = P.outline().canvas(); }
// O EXTRATOR: o coração mecânico do Coração. Uma bomba gigante que suga âmbar (lembranças) da masmorra lá de baixo.
function extratorArt(f, fase, carga) { const k = 'ex' + f + fase + (carga ? 1 : 0); if (INI7[k]) return INI7[k];
  const W_ = 124, H_ = 120, P = new Pix(W_, H_), cx = 62, Fe = ramp('#4a4450'), Lt = ramp('#c89a30'), b = f % 2;
  for (const s of [-1, 1]) { P.cyl(cx + s * 44 - 9, 20, 18, 96, Fe); for (let y = 24; y < 112; y += 9) P.rect(cx + s * 44 - 9, y, 18, 2, Lt[2]); P.rect(cx + s * 44 - 4, 30 + ((f * 7) % 70), 8, 10, '#ffd070'); }
  P.ball(cx, 66 + b, 38, 40, Fe, { amb: 0.3 });
  // o pistão principal subindo e descendo
  const pis = b * 4 + (carga ? -10 : 0);
  P.cyl(cx - 10, 4 + pis, 20, 36, ramp('#8a8a96')); P.rect(cx - 14, 36 + pis, 28, 6, Lt[3]);
  // o "coração": câmara de vidro com âmbar pulsando
  P.ball(cx, 70 + b, 22, 22, ['#3a3a50', '#8a8aa8', '#c8c8e8', '#e8e8ff', '#ffffff'], { amb: 0.4 });
  P.ball(cx, 72 + b, 17, 17, fase >= 3 ? ['#5a0a0a', '#c82a2a', '#ff6a5a', '#ffd0c0', '#ffffff'] : ['#8a5a10', '#d8a030', '#ffd070', '#fff0b0', '#ffffff'], { amb: 0.6 });
  for (let i = 0; i < 6; i++) { const a = (i / 6 + f * 0.1) * Math.PI * 2; P.p(Math.round(cx + Math.cos(a) * 10), Math.round(72 + b + Math.sin(a) * 10), '#ffffff'); }
  if (fase >= 2) { P.line(cx - 18, 54, cx - 4, 74, '#1a1418'); P.line(cx - 4, 74, cx - 12, 88, '#1a1418'); }
  // mangueiras para o chão (a masmorra)
  for (const s of [-1, 1]) P.line(cx + s * 20, 100 + b, cx + s * 30, 120, '#5a4a3a', 5);
  if (carga) P.ball(cx, 72 + b, 26, 26, ['#ffffff', '#ffffff', '#fff0c0', '#ffd070', '#ffd070'], { amb: 0.2 });
  return INI7[k] = P.outline().canvas(); }
// ---------- adereço da 2ª evolução (por cima do da 1ª) ----------
const ADER7 = {};
function aderecoEvo7(ev) {
  if (ADER7[ev]) return ADER7[ev]; const P = new Pix(24, 18);
  if (ev === 'guardiao') { P.rect(2, 8, 20, 3, '#c89a30'); P.rect(4, 4, 16, 4, '#ffe080'); P.rect(11, 0, 2, 4, '#fff0c0'); P.rect(1, 11, 2, 6, '#c89a30'); P.rect(21, 11, 2, 6, '#c89a30'); }
  else if (ev === 'tempestade') { P.line(6, 0, 2, 8, '#bff0ff', 1); P.line(2, 8, 8, 8, '#bff0ff'); P.line(8, 8, 4, 17, '#ffffff'); P.line(18, 0, 14, 8, '#fff0a0'); P.line(14, 8, 20, 8, '#fff0a0'); P.line(20, 8, 16, 17, '#ffffff'); }
  else if (ev === 'labirinto') { for (let i = 0; i < 4; i++) { P.rect(2 + i * 2, 2 + i * 2, 20 - i * 4, 1, '#c8a0ff'); P.rect(2 + i * 2, 2 + i * 2, 1, 14 - i * 4, '#c8a0ff'); P.rect(21 - i * 2, 2 + i * 2, 1, 14 - i * 4, '#8a60d0'); } }
  else if (ev === 'boca') { for (let i = 0; i < 5; i++) { P.poly([[2 + i * 4, 4], [6 + i * 4, 4], [4 + i * 4, 10]], '#ffffff'); P.poly([[2 + i * 4, 16], [6 + i * 4, 16], [4 + i * 4, 11]], '#e8e8f0'); } P.rect(1, 3, 22, 1, '#8a2a4a'); P.rect(1, 16, 22, 1, '#8a2a4a'); }
  else if (ev === 'bibliotecario') { P.rect(2, 6, 9, 11, '#3a5a9a'); P.rect(12, 4, 9, 13, '#9a3a3a'); P.rect(11, 4, 1, 13, '#f2ecdc'); P.rect(4, 2, 5, 4, '#5a8a3a'); for (let i = 0; i < 3; i++) { P.rect(4, 9 + i * 2, 5, 1, '#f2ecdc'); P.rect(14, 7 + i * 2, 5, 1, '#f2ecdc'); } }
  else { for (let y = 0; y < 18; y += 3) { P.rect(2, y, 20, 2, '#f2ecdc'); P.rect(4 + (y % 6), y, 8, 1, '#8fe3d8'); } P.line(2, 17, 22, 0, '#c83a3a'); }
  return ADER7[ev] = P.outline().canvas();
}
