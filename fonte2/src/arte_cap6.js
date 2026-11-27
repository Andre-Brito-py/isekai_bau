// ================= ARTE DO CAP. 6 — A CIDADE DOS PAVIOS =================
// Tiles novos (chão de fábrica, faixa amarela, esteira, prensa, tapete do cofre), a Vila dos Pavios (casinhas iguais e
// numeradas, torre do relógio parado, varal de casacos cinza, cancela da guarita, muro e portão da Casa do Selo), a
// fábrica (máquinas, prensas, alavancas, estantes de frascos, a Seladora), inimigos (Selo Vivo, Frasco Rachado,
// Caçadora de Recompensa), o mini-chefe TIAGO (Herói nº 30) e o chefe SELADORA REAL, e os FIGURINOS do disfarce.
const KEY6 = Object.assign({}, KEY2, {
  'c': { t: 'fabrica' }, 'f': { t: 'faixa' }, 'e': { t: 'esteira' }, 'P': { t: 'prensaChao' }, 'k': { t: 'cofre' }, 'X': { t: 'paredeF', solid: true }
});
{ const _dcS = desenhaCeu; desenhaCeu = function (m, ox, oy) { if (m && m.semCeu) return; return _dcS(m, ox, oy); }; }
{ const _ta7 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (!['fabrica', 'faixa', 'esteira', 'prensaChao', 'cofre', 'paredeF'].includes(k)) return _ta7(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y, s = 5) => hash(x + v * 13, y + v * 29, s) % 100;
  const piso = (x, y) => { const r = h(x, y); return (x === 15 || y === 15) ? '#4a4450' : r < 8 ? '#7a7280' : r < 14 ? '#625a6a' : '#6e6676'; };
  if (k === 'fabrica') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, piso(x, y)); if (v % 3 === 0) { P.p(2, 2, '#6a6470'); P.p(13, 13, '#6a6470'); } if (v % 5 === 1) { P.rect(5, 8, 4, 2, '#2e2a34'); P.p(9, 9, '#2e2a34'); } }
  else if (k === 'faixa') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, piso(x, y)); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if ((x < 2 || x > 13 || y < 2 || y > 13) && ((x + y) >> 2) % 2 === 0) P.p(x, y, '#e8c040'); else if (x < 2 || x > 13 || y < 2 || y > 13) P.p(x, y, '#2a2420'); }
  else if (k === 'esteira') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, x < 1 || x > 14 ? '#6a6a7a' : (y % 4 === 0) ? '#1a181e' : '#2a2830'); P.rect(0, 0, 1, 16, '#8a8a9a'); P.rect(15, 0, 1, 16, '#4a4a5a'); }
  else if (k === 'prensaChao') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, (x + y) % 6 < 3 ? '#5a5a66' : '#6a6a76'); for (let i = 0; i < 16; i++) { if (((i >> 2) % 2) === 0) { P.p(i, 0, '#e8c040'); P.p(i, 15, '#e8c040'); } } P.rect(6, 6, 4, 4, '#3a3a44'); }
  else if (k === 'paredeF') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const row = y >> 2, off = (row % 2) * 4, edge = (y % 4 === 3) || ((x + off) % 8 === 7); P.p(x, y, edge ? '#2a1418' : (hash(x >> 3, row + v * 4, 6) % 5 === 0) ? '#5a2e2a' : '#4a2624'); } }
  else { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const borda = x === 0 || x === 15; P.p(x, y, borda ? '#3a1a1a' : ((x + y * 3) % 11 === 0) ? '#8a5a2a' : (y % 8 === 3 && x % 4 === 1) ? '#c89a30' : '#5a2428'); } }
  return TILE2[key] = P.canvas();
}; }
const OBJ6 = {};
const o6 = (k, f) => OBJ6[k] || (OBJ6[k] = f());
// ---------- a Vila ----------
// casinha de Pavio: todas iguais, cinza, porta no meio, um número esmaltado; muda só o número
function numeroArt(n) { return o6('num' + n, () => { const c = mk(14, 9), x = c.getContext('2d'); x.fillStyle = '#e8e4d8'; x.fillRect(0, 0, 14, 9); x.fillStyle = '#2a3a6a'; x.fillRect(1, 1, 12, 7); x.fillStyle = '#e8e4d8'; const s = String(n), D = { 0: [7, 5, 5, 5, 7], 1: [2, 6, 2, 2, 7], 2: [7, 1, 7, 4, 7], 3: [7, 1, 3, 1, 7], 4: [5, 5, 7, 1, 1], 5: [7, 4, 7, 1, 7], 6: [7, 4, 7, 5, 7], 7: [7, 1, 1, 2, 2], 8: [7, 5, 7, 5, 7], 9: [7, 5, 7, 1, 7] }; const w = s.length * 4 - 1; for (let i = 0; i < s.length; i++) { const L = D[s[i]]; for (let r = 0; r < 5; r++) for (let b = 0; b < 3; b++) if (L[r] & (4 >> b)) x.fillRect(Math.round(7 - w / 2) + i * 4 + b, 2 + r, 1, 1); } return c; }); }
function relogioVilaArt() { return o6('relogio', () => {
  const W_ = 48, H_ = 150, P = new Pix(W_, H_), Pd = ramp('#8a8494'), Tl = ramp('#4a3a5a');
  for (let y = 40; y < 146; y++) for (let x = 4; x < 44; x++) { const row = y >> 3, off = (row % 2) * 6, edge = (y % 8 === 7) || ((x + off) % 12 === 11); P.p(x, y, edge ? Pd[0] : P.tone(Pd, 0.6 - x / 80 + ((hash(x >> 3, row, 4) % 5) - 2) * 0.04, x, y)); }
  P.poly([[0, 42], [24, 4], [48, 42]], (x, y) => P.tone(Tl, 0.7 - x / 70 + (y % 5 === 0 ? -0.15 : 0), x, y));
  P.rect(22, 0, 4, 6, '#c89a30');
  // o mostrador: parado nas 3h17 (ninguém conserta)
  P.ball(24, 62, 14, 14, ['#2a2430', '#c8c0b0', '#e8e0d0', '#f4eee0', '#ffffff'], { amb: 0.7 });
  for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; P.p(Math.round(24 + Math.cos(an) * 11), Math.round(62 + Math.sin(an) * 11), '#2a2430'); }
  P.line(24, 62, 31, 62, '#1a1418'); P.line(24, 62, 26, 52, '#1a1418'); P.p(24, 62, '#c83a3a');
  P.line(14, 52, 20, 70, '#5a5050');                                                // uma rachadura no vidro
  P.rect(18, 108, 12, 38, '#3a2a2a'); P.rect(19, 109, 10, 36, '#5a3a2a'); P.rect(23, 126, 2, 2, '#c89a30');
  P.rect(10, 90, 28, 3, '#5a5260'); P.rect(12, 84, 24, 6, '#e8e4d8'); P.rect(13, 85, 22, 4, '#2a3a6a');
  return P.outline().canvas(); }); }
function semNumeroArt() { return o6('pv', () => { const c = mk(22, 6), x = c.getContext('2d'); x.fillStyle = '#e8e4d8'; for (let i = 0; i < 22; i += 2) x.fillRect(i, 2, 1, 1); return c; }); }
function cancelaArt(aberta) { return o6('can' + (aberta ? 1 : 0), () => {
  const P = new Pix(40, 30); P.rect(2, 10, 5, 20, '#4a4a5a'); P.rect(1, 9, 7, 3, '#6a6a7a');
  if (aberta) { for (let i = 0; i < 22; i++) P.rect(4 + Math.round(i * 0.2), 9 - i, 3, 1, i % 6 < 3 ? '#e83a3a' : '#f0f0f0'); }
  else for (let i = 0; i < 34; i++) P.rect(5 + i, 12, 1, 3, (i >> 2) % 2 ? '#e83a3a' : '#f0f0f0');
  return P.outline().canvas(); }); }
// varal com casacos cinza de Pavio (n = quantos sobraram)
function varalCasacosArt(n) { return o6('vc' + n, () => {
  const P = new Pix(80, 46); P.rect(2, 8, 2, 38, '#5a4a3a'); P.rect(76, 8, 2, 38, '#5a4a3a'); P.line(3, 9, 77, 11, '#c8c0b0');
  for (let i = 0; i < n; i++) { const x0 = 10 + i * 16, Cz = ramp('#6a6a7a'); P.rect(x0 + 5, 9, 2, 2, '#3a3a44'); P.poly([[x0, 12], [x0 + 12, 12], [x0 + 13, 34], [x0 - 1, 34]], (x, y) => P.tone(Cz, 0.6 - (x - x0) / 30 + (y % 6 === 0 ? -0.1 : 0), x, y)); P.rect(x0 + 5, 12, 2, 20, Cz[1]); P.p(x0 + 3, 18, '#c89a30'); P.rect(x0 + 4, 4, 4, 5, '#f2ecdc'); P.p(x0 + 5, 3, '#ff9a30'); }
  return P.outline().canvas(); }); }
// o muro da Casa do Selo: tijolo escuro, janelas altas, chaminés (a fumaça é a VIDA), letreiro e portão
function muroSeloArt() { return o6('muro', () => {
  const W_ = 50 * 16, H_ = 140, P = new Pix(W_, H_), Tj = ramp('#6a3a30');
  for (let y = 40; y < H_; y++) for (let x = 0; x < W_; x++) { const row = (y - 40) >> 2, off = (row % 2) * 4, edge = ((y - 40) % 4 === 3) || ((x + off) % 8 === 7); P.p(x, y, edge ? Tj[0] : P.tone(Tj, 0.5 - (y - 40) / 300 + ((hash(x >> 3, row, 6) % 5) - 2) * 0.05, x, y)); }
  for (let x = 20; x < W_ - 20; x += 48) { if (Math.abs(x - 392) < 40) continue; P.rect(x, 58, 18, 30, '#1a1418'); P.rect(x + 1, 59, 16, 28, (x / 48) % 3 === 0 ? '#ffd070' : '#3a3a5a'); P.rect(x + 8, 59, 1, 28, '#1a1418'); P.rect(x + 1, 72, 16, 1, '#1a1418'); }
  for (const cx of [90, 250, 560, 700]) { P.rect(cx, 0, 18, 44, Tj[1]); P.rect(cx - 2, 0, 22, 4, Tj[3]); P.rect(cx + 2, 10, 14, 2, Tj[0]); }
  P.rect(0, 38, W_, 4, '#3a2a2a');
  // letreiro
  P.rect(330, 44, 140, 14, '#1a1418'); P.rect(331, 45, 138, 12, '#c89a30'); P.rect(333, 47, 134, 8, '#2a1a14');
  // portão do turno da noite (2 tiles, no meio da largura 25..26 do mapa = x 384..416)
  P.rect(376, 92, 48, 48, '#2a2228'); P.rect(380, 96, 40, 44, '#4a3a3a'); for (let x = 382; x < 420; x += 6) P.rect(x, 96, 2, 44, '#2a2228'); P.rect(380, 112, 40, 2, '#c89a30');
  return P.canvas(); }); }
function letreiroSeloTxt(ox, oy) { /* o texto do letreiro (com a fonte do jogo) é escrito em cima, no HOOK_AR */ }
function chamineFumaca(x, y, t) { // fumaça subindo em bolinhas de pixel
  for (let i = 0; i < 5; i++) { const k = ((t * 0.4 + i * 22) % 110) / 110, r = 3 + k * 6; bx.globalAlpha = 0.35 * (1 - k); bx.fillStyle = '#9a9aa8'; bx.fillRect(Math.round(x + Math.sin(k * 6 + i) * 5 - r / 2 + k * 10), Math.round(y - k * 60 - r / 2), Math.round(r), Math.round(r)); }
  bx.globalAlpha = 1;
}
// ---------- a fábrica ----------
function maquinaArt(w) { return o6('maq' + w, () => {
  const W_ = w * 16, P = new Pix(W_, 64), Fe = ramp('#5a5a6a'), Lt = ramp('#c89a30');
  P.rect(2, 20, W_ - 4, 40, Fe[1]); for (let x = 4; x < W_ - 4; x++) for (let y = 22; y < 58; y++) P.p(x, y, P.tone(Fe, 0.62 - (x / W_) * 0.3 + (y % 9 === 0 ? -0.15 : 0), x, y));
  for (let x = 6; x < W_ - 6; x += 10) { P.p(x, 24, Lt[4]); P.p(x, 54, Lt[4]); }
  P.ball(16, 18, 10, 9, ramp('#8a6a30')); P.rect(W_ - 22, 4, 8, 20, Fe[2]); P.rect(W_ - 24, 2, 12, 4, Fe[3]);
  P.ball(W_ / 2, 38, 9, 9, ['#1a1418', '#2a2430', '#ffd070', '#fff0a0', '#ffffff'], { amb: 0.7 });               // visor com âmbar dentro
  for (let i = 0; i < 4; i++) P.rect(8 + i * 8, 46, 5, 6, i % 2 ? '#e83a3a' : '#3ac860');
  return P.outline().canvas(); }); }
function prensaArt(baixa) { // a cabeça da prensa (2 tiles de largura) e a haste
  return o6('pr' + baixa, () => { const P = new Pix(32, 110), Fe = ramp('#6a6a7a');
    const y0 = Math.round(baixa * 76);
    P.rect(12, 0, 8, y0 + 8, Fe[2]); P.rect(13, 0, 2, y0 + 8, Fe[3]);
    P.rect(1, y0 + 8, 30, 18, Fe[1]); for (let x = 2; x < 30; x++) for (let y = y0 + 9; y < y0 + 25; y++) P.p(x, y, P.tone(Fe, 0.7 - x / 50 + (y === y0 + 24 ? -0.4 : 0), x, y));
    for (let x = 2; x < 30; x += 4) P.rect(x, y0 + 22, 2, 2, '#e8c040');
    P.rect(4, y0 + 12, 24, 4, '#c83a3a'); P.rect(6, y0 + 13, 20, 2, '#ffe0a0');                                   // o carimbo da Coroa
    return P.outline().canvas(); }); }
function alavancaArt(on) { return o6('alav' + on, () => { const P = new Pix(16, 26); P.rect(3, 18, 10, 8, '#4a4a5a'); P.rect(4, 19, 8, 2, '#6a6a7a'); P.line(8, 19, on ? 13 : 3, 6, '#8a8a9a', 2); P.ball(on ? 13 : 3, 5, 3, 3, on ? ['#1a3a1a', '#2a8a3a', '#3ac860', '#8af0a0', '#ffffff'] : ['#3a1a1a', '#8a2a2a', '#e83a3a', '#ff9a9a', '#ffffff']); return P.outline().canvas(); }); }
function quadroTurnoArt() { return o6('qt', () => { const P = new Pix(30, 40); P.rect(13, 20, 4, 20, '#4a3a2a'); P.rect(0, 0, 30, 22, '#2a3a2a'); P.rect(1, 1, 28, 20, '#3a5a3a'); for (let i = 0; i < 5; i++) P.rect(3, 3 + i * 4, 10 + (i * 7) % 13, 1, '#e8e4d8'); P.rect(20, 4, 7, 9, '#e8e4d8'); P.rect(21, 5, 5, 7, '#c83a3a'); return P.outline().canvas(); }); }
// estante de frascos: cada frasco brilha numa cor (a lembrança dentro)
function estanteFrascosArt(w, vazios) { return o6('est' + w + '_' + (vazios || 0), () => {
  const W_ = w * 16, P = new Pix(W_, 58), Md = ramp('#5a3a2a');
  P.rect(0, 6, W_, 52, Md[1]); P.rect(0, 4, W_, 4, Md[3]);
  for (let s = 0; s < 3; s++) { const y = 10 + s * 16; P.rect(2, y + 12, W_ - 4, 2, Md[3]); P.rect(2, y, W_ - 4, 12, Md[0]);
    for (let x = 4; x < W_ - 6; x += 6) { if (vazios && hash(x, s, 7) % 4 === 0) continue; const cs = [['#ffd070', '#fff0b0'], ['#ff9a6a', '#ffd0b0'], ['#9ad0ff', '#e0f0ff'], ['#c8a0ff', '#f0e0ff'], ['#a0f0b0', '#e0ffe8']][hash(x, s, 3) % 5]; P.rect(x, y + 4, 4, 8, '#e8e4f0'); P.rect(x + 1, y + 6, 2, 5, cs[0]); P.p(x + 1, y + 6, cs[1]); P.rect(x, y + 3, 4, 1, '#c83a3a'); P.rect(x + 1, y + 2, 2, 1, '#8a6a30'); }
  }
  return P.outline().canvas(); }); }
function livroLotesArt() { return o6('livro', () => { const P = new Pix(22, 30); P.rect(9, 12, 4, 18, '#4a3020'); P.rect(4, 26, 14, 4, '#3a2418'); P.poly([[1, 8], [21, 8], [19, 14], [3, 14]], '#5a3a2a'); P.rect(3, 4, 16, 6, '#f2ecdc'); P.rect(11, 4, 1, 6, '#c8c0b0'); for (let i = 0; i < 3; i++) { P.rect(4, 5 + i * 2, 6, 1, '#6a6a7a'); P.rect(13, 5 + i * 2, 5, 1, '#6a6a7a'); } return P.outline().canvas(); }); }
function frascoItemArt(cor) { return o6('fi' + cor, () => { const P = new Pix(10, 14); P.rect(2, 4, 6, 9, '#e8e4f0'); P.rect(3, 6, 4, 6, cor); P.p(3, 6, '#ffffff'); P.rect(2, 3, 6, 1, '#c83a3a'); P.rect(3, 1, 4, 2, '#8a6a30'); return P.outline().canvas(); }); }
// a Seladora no mapa (10 tiles de largura): adormecida até alguém mexer nos frascos
function seladoraMapaArt(acordada) { return o6('selM' + (acordada ? 1 : 0), () => {
  const W_ = 160, H_ = 110, P = new Pix(W_, H_), Fe = ramp('#5a5060'), Lt = ramp('#c89a30');
  P.rect(8, 40, W_ - 16, 68, Fe[1]);
  for (let y = 42; y < 106; y++) for (let x = 10; x < W_ - 10; x++) P.p(x, y, P.tone(Fe, 0.65 - x / 400 - (y - 42) / 200 + ((x % 20 === 0) ? -0.2 : 0), x, y));
  for (const gx of [30, 130]) { P.ball(gx, 34, 16, 16, ramp('#8a6a30')); for (let a = 0; a < 10; a++) { const an = a / 10 * Math.PI * 2; P.rect(Math.round(gx + Math.cos(an) * 17) - 1, Math.round(34 + Math.sin(an) * 17) - 1, 3, 3, Lt[3]); } }
  P.rect(62, 4, 36, 40, Fe[2]); P.rect(66, 8, 28, 30, '#1a1418');
  P.ball(80, 23, 11, 11, acordada ? ['#5a0a0a', '#c82a2a', '#ff6a5a', '#ffd0c0', '#ffffff'] : ['#1a1418', '#2a2430', '#3a3440', '#4a4450', '#5a5460'], { amb: 0.6 });
  P.rect(40, 64, 80, 14, '#1a1418'); for (let x = 42; x < 118; x += 4) P.rect(x, 66, 2, 10, (x / 4) % 2 ? '#2a2830' : '#3a3840');           // a esteira de saída
  for (let i = 0; i < 6; i++) { const x = 48 + i * 11; P.rect(x, 60, 5, 8, '#e8e4f0'); P.rect(x + 1, 62, 3, 5, ['#ffd070', '#9ad0ff', '#ff9a6a'][i % 3]); P.rect(x, 59, 5, 1, '#c83a3a'); }
  P.rect(20, 84, 120, 6, Lt[2]); for (let x = 24; x < 136; x += 8) P.p(x, 86, Lt[4]);
  return P.outline().canvas(); }); }
// ---------- fundos de batalha ----------
const BG6 = {};
function bgVila() { if (BG6.v) return BG6.v; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? (y < 40 ? '#141828' : '#1c2234') : ((x >> 3) + (y >> 3)) % 2 ? '#4a4a56' : '#42424e');
  for (let i = 0; i < 40; i++) P.p((i * 61) % 240, (i * 19) % 36, '#d8d8ff');
  for (let k = 0; k < 6; k++) { const x0 = 4 + k * 40; P.poly([[x0, 62], [x0 + 18, 46], [x0 + 36, 62]], '#3a3a50'); P.rect(x0 + 2, 62, 32, 34, '#5a5a6a'); P.rect(x0 + 15, 76, 7, 20, '#2a2a34'); P.rect(x0 + 5, 68, 6, 6, k % 2 ? '#ffd070' : '#2a2a3a'); P.rect(x0 + 13, 64, 10, 5, '#2a3a6a'); }
  P.rect(112, 6, 16, 56, '#6a6474'); P.ball(120, 22, 6, 6, ['#2a2430', '#c8c0b0', '#e8e0d0', '#f4eee0', '#ffffff']);
  return BG6.v = P.canvas(); }
function bgFabrica() { if (BG6.f) return BG6.f; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((x % 40 === 0) ? '#2a2430' : y < 20 ? '#1a1620' : '#2e2836') : ((x + y) % 9 === 0) ? '#3a3440' : y % 16 === 0 ? '#2a2630' : '#423c48');
  for (let x = 0; x < 240; x += 4) { P.rect(x, 84, 2, 6, x % 8 ? '#1a181e' : '#2a2830'); } P.rect(0, 82, 240, 2, '#8a8a9a'); P.rect(0, 90, 240, 2, '#4a4a5a');
  for (let i = 0; i < 10; i++) { const x = 10 + i * 24; P.rect(x, 74, 6, 9, '#e8e4f0'); P.rect(x + 1, 76, 4, 6, ['#ffd070', '#9ad0ff', '#ff9a6a', '#c8a0ff'][i % 4]); P.rect(x, 73, 6, 1, '#c83a3a'); }
  for (const x of [30, 120, 200]) { P.rect(x, 0, 14, 50, '#4a4a5a'); P.rect(x - 4, 50, 22, 12, '#5a5a6a'); P.rect(x - 2, 60, 18, 3, '#e8c040'); }
  for (let x = 0; x < 240; x += 60) { P.rect(x + 20, 26, 20, 20, '#1a1418'); P.rect(x + 21, 27, 18, 18, '#ffd070'); P.rect(x + 29, 27, 2, 18, '#1a1418'); }
  return BG6.f = P.canvas(); }
function bgCofre() { if (BG6.c) return BG6.c; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? '#1a1018' : ((x + y * 3) % 11 === 0) ? '#8a5a2a' : '#5a2428');
  for (let k = 0; k < 4; k++) { const x0 = k * 62; P.rect(x0 + 4, 8, 54, 86, '#3a2418'); for (let s = 0; s < 5; s++) for (let x = x0 + 7; x < x0 + 55; x += 5) { const cs = ['#ffd070', '#9ad0ff', '#ff9a6a', '#c8a0ff', '#a0f0b0'][hash(x, s, 3) % 5]; P.rect(x, 12 + s * 16, 3, 7, '#e8e4f0'); P.rect(x + 1, 14 + s * 16, 1, 4, cs); } }
  return BG6.c = P.canvas(); }
function bgPalco() { if (BG6.p) return BG6.p; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? (y < 14 ? '#3a0a1a' : (x % 20 < 10 ? '#7a1a2a' : '#6a1424')) : ((x >> 3) % 2 ? '#8a5a30' : '#7a4a28'));
  for (let x = 0; x < 240; x += 12) P.poly([[x, 0], [x + 12, 0], [x + 6, 10]], '#c89a30');
  for (const x of [20, 220]) { P.rect(x - 2, 20, 4, 76, '#4a3a2a'); P.ball(x, 18, 6, 6, ['#8a6a30', '#ffd070', '#fff0a0', '#ffffff', '#ffffff']); }
  for (let i = 0; i < 30; i++) P.p((i * 37) % 240, 100 + (i * 7) % 40, '#ffd070');
  return BG6.p = P.canvas(); }
// ---------- inimigos ----------
const INI6 = {};
// SELO VIVO: um carimbo de latão do tamanho de um cachorro grande, perninhas de prensa, o cabo é a cabeça
function seloVivoArt(f, armado) { const key = 'sv' + f + (armado ? 1 : 0); if (INI6[key]) return INI6[key];
  const P = new Pix(40, 52), Lt = ramp('#c89a30'), Bo = ramp('#8a2a2a'), b = f % 2;
  for (const s of [-1, 1]) { P.line(20 + s * 8, 38, 20 + s * 13, 50, '#4a4a5a', 2); P.rect(20 + s * 13 - 2, 49, 5, 2, '#6a6a7a'); }
  P.cyl(6, 30 + b, 28, 10, Bo); P.rect(6, 38 + b, 28, 2, '#e83a3a');                                   // a base de borracha (o carimbo)
  P.cyl(12, 18 + b, 16, 13, Lt); for (let x = 13; x < 27; x += 3) P.p(x, 22 + b, Lt[4]);
  P.ball(20, 10 + b - (armado ? 4 : 0), 7, 8, ramp('#6a3a20'));                                       // o cabo de madeira
  P.rect(16, 9 + b - (armado ? 4 : 0), 2, 2, '#ffe08a'); P.rect(22, 9 + b - (armado ? 4 : 0), 2, 2, '#ffe08a');
  if (armado) { P.rect(4, 41, 32, 3, '#c83a3a'); }
  return INI6[key] = P.outline().canvas(); }
// FRASCO RACHADO: frasco de farmácia que escapou da prateleira; a lembrança vaza em fiapos dourados
function frascoRArt(f) { const key = 'fr' + f; if (INI6[key]) return INI6[key];
  const P = new Pix(30, 40), b = f % 2;
  P.ball(15, 26 + b, 11, 12, ['#8a8aa0', '#c8c8e0', '#e8e8f8', '#ffffff', '#ffffff'], { amb: 0.5 });
  P.ball(15, 28 + b, 8, 8, ['#8a5a10', '#d8a030', '#ffd070', '#fff0b0', '#ffffff'], { amb: 0.6 });
  P.rect(11, 8 + b, 8, 7, '#e8e8f8'); P.rect(10, 6 + b, 10, 3, '#c83a3a'); P.rect(12, 3 + b, 6, 3, '#8a6a30');
  P.line(10, 18 + b, 16, 30 + b, '#4a4a5a'); P.line(16, 30 + b, 13, 36 + b, '#4a4a5a');
  P.p(8, 26 + b, '#1a1418'); P.p(20, 26 + b, '#1a1418');
  return INI6[key] = P.outline().canvas(); }
// CAÇADORA DE RECOMPENSA: capa curta, rede no ombro, besta pequena, o cartaz do baú enfiado no cinto
function cacaRecArt(f) { const key = 'cr' + f; if (INI6[key]) return INI6[key];
  const P = new Pix(36, 56), b = f % 2, Cp = ramp('#5a3a2a'), Pl = ramp('#c8906a');
  P.rect(12, 40, 5, 16, '#2a2420'); P.rect(19, 40, 5, 16, '#2a2420');
  P.cyl(10, 20 + b, 16, 22, ramp('#3a4a3a')); P.poly([[8, 18 + b], [28, 18 + b], [30, 34 + b], [6, 34 + b]], (x, y) => P.tone(Cp, 0.6 - x / 60, x, y));
  P.rect(10, 34 + b, 16, 2, '#8a6a30'); P.rect(22, 30 + b, 6, 8, '#e8e0d0'); P.rect(23, 31 + b, 4, 3, '#8a5a30');
  P.ball(18, 12 + b, 6, 6, Pl); P.rect(11, 4 + b, 14, 5, '#4a2a1a'); P.rect(10, 8 + b, 4, 10, '#4a2a1a');
  P.rect(15, 12 + b, 2, 2, '#1a1418'); P.rect(20, 12 + b, 2, 2, '#1a1418');
  for (let i = 0; i < 5; i++) P.line(2 + i * 2, 14 + b, 6 + i, 34 + b, '#a89870');                    // a rede
  P.rect(28, 24 + b, 8, 3, '#5a3a20'); P.line(30, 20 + b, 30, 31 + b, '#8a8a9a');                       // a besta
  return INI6[key] = P.outline().canvas(); }
// TIAGO, O HERÓI Nº 30: o ex-cobrador do 31 com o casaco azul e dourado da Coroa, o quepe de cobrador com pluma de
// herói, a bolsa do troco a tiracolo e o PICOTADOR de passagem (que virou arma)
function tiagoArt(f, pose) { const key = 'ti' + f + pose; if (INI6[key]) return INI6[key];
  const P = new Pix(52, 68), b = f % 2, Az = ramp('#2a4aa0'), Lt = ramp('#d8aa40'), Pl = ramp('#c8906a'), Cl = ramp('#2a2a3a'), cx = 24;
  const atk = pose === 'atk', tr = pose === 'troco', hes = pose === 'hes';
  // pernas: calça escura com listra dourada, botas
  for (const [x0, s] of [[cx - 8, -1], [cx + 2, 1]]) { P.cyl(x0, 44, 7, 18, Cl); P.rect(x0 + (s < 0 ? 1 : 5), 45, 1, 16, Lt[2]); P.rect(x0 - 1, 60, 9, 6, '#3a2418'); P.rect(x0 - 1, 60, 9, 1, '#6a4a30'); }
  // casaco azul de herói, abas compridas
  P.poly([[cx - 11, 22 + b], [cx + 11, 22 + b], [cx + 13, 50 + b], [cx - 13, 50 + b]], (x, y) => P.tone(Az, 0.72 - (x - cx + 13) / 40 + (y > 46 + b ? -0.2 : 0), x, y));
  P.rect(cx - 1, 22 + b, 2, 28, Lt[1]); for (let i = 0; i < 5; i++) P.p(cx + 2, 25 + i * 5 + b, Lt[4]);
  P.rect(cx - 11, 36 + b, 22, 3, '#3a2418'); P.rect(cx - 2, 36 + b, 4, 3, Lt[3]);                                  // cinto
  for (const s of [-1, 1]) { P.rect(cx + s * 12 - 4, 21 + b, 8, 3, Lt[3]); for (let i = 0; i < 4; i++) P.p(cx + s * 12 - 3 + i * 2, 24 + b, Lt[2]); }   // dragonas com franja
  P.rect(cx - 5, 26 + b, 4, 4, '#c83a3a'); P.p(cx - 4, 27 + b, '#ffe0a0');                                          // a medalha do Herói nº 30
  // bolsa do troco a tiracolo
  P.line(cx - 10, 23 + b, cx + 8, 42 + b, '#6a4a2a', 2); P.ball(cx + 9, 42 + b, 5, 4, ramp('#8a5a30')); P.p(cx + 9, 41 + b, Lt[4]);
  // cabeça
  P.ball(cx, 13 + b, 7, 8, Pl); P.rect(cx - 7, 8 + b, 14, 3, '#3a2a1a');
  P.rect(cx - 4, 13 + b, 2, 2, '#1a1418'); P.rect(cx + 2, 13 + b, 2, 2, '#1a1418'); P.rect(cx - 5, 11 + b, 3, 1, '#3a2a1a'); P.rect(cx + 2, 11 + b, 3, 1, '#3a2a1a');
  if (hes) { P.rect(cx - 2, 18 + b, 4, 1, '#7a4a3a'); P.p(cx - 3, 17 + b, '#7a4a3a'); } else P.rect(cx - 2, 18 + b, 5, 1, '#8a4a3a');
  // quepe de cobrador com aba, o número 30 e a pluma de herói
  P.rect(cx - 8, 2 + b, 16, 6, Az[1]); P.rect(cx - 8, 2 + b, 16, 1, Az[3]); P.rect(cx - 9, 8 + b, 19, 2, '#1a1a2a');
  P.rect(cx - 3, 3 + b, 7, 4, Lt[3]); P.p(cx - 2, 4 + b, '#2a4aa0'); P.p(cx, 4 + b, '#2a4aa0'); P.p(cx + 2, 4 + b, '#2a4aa0');
  P.poly([[cx + 6, 3 + b], [cx + 16, -2 + b], [cx + 13, 5 + b]], (x, y) => (x + y) % 3 ? '#f0f0f8' : '#c8c8e0'); P.p(cx + 15, -1 + b, '#e83a3a');
  // braço do picotador
  const ax = atk ? cx + 24 : tr ? cx - 18 : cx + 15, ay = atk ? 26 : tr ? 30 : 38;
  P.line(cx + 9, 25 + b, ax, ay + b, Az[2], 4); P.ball(ax, ay + b, 3, 3, Pl);
  P.rect(ax - 4, ay - 6 + b, 9, 6, '#6a6a7a'); P.rect(ax - 3, ay - 5 + b, 7, 2, '#c8c8d8'); P.rect(ax + 4, ay - 3 + b, 3, 1, '#c8c8d8'); P.p(ax, ay - 2 + b, '#1a1418');
  if (atk) for (let i = 0; i < 4; i++) P.rect(ax + 6 + i * 3, ay - 8 + i + b, 2, 2, '#f2ecdc');                       // confete de bilhete picotado
  if (tr) { for (let i = 0; i < 5; i++) P.ball(cx - 20 + i * 4, 18 - i * 3, 2, 2, ramp('#d8a040')); }                // moedas do troco no ar
  P.line(cx - 9, 25 + b, cx - 13, 40 + b, Az[2], 4); P.ball(cx - 13, 41 + b, 3, 3, Pl);
  return INI6[key] = P.outline().canvas(); }
// A SELADORA REAL: a máquina que tampa e carimba as lembranças; boca de prensa, dois braços-carimbo, esteira na
// barriga, o olho vermelho da caldeira. Fase 2: o tanque de lembranças racha e elas vazam.
function seladoraBossArt(f, fase, carga) { const key = 'sel' + f + fase + (carga ? 1 : 0); if (INI6[key]) return INI6[key];
  const W_ = 116, H_ = 118, P = new Pix(W_, H_), cx = 58, Fe = ramp('#5a5060'), Lt = ramp('#c89a30'), b = f % 2;
  for (const s of [-1, 1]) { P.rect(cx + s * 30 - 6, 96, 12, 18, Fe[1]); P.rect(cx + s * 30 - 9, 112, 18, 5, Fe[2]); }
  P.ball(cx, 66 + b, 42, 36, Fe, { amb: 0.35 });
  for (let x = cx - 30; x < cx + 30; x += 4) P.rect(x, 82 + b, 2, 8, (x >> 2) % 2 ? '#1a181e' : '#2a2830');             // a esteira da barriga
  for (let i = 0; i < 4; i++) { const x = cx - 22 + i * 13; P.rect(x, 74 + b, 6, 9, '#e8e4f0'); P.rect(x + 1, 76 + b, 4, 6, ['#ffd070', '#9ad0ff', '#ff9a6a', '#c8a0ff'][i]); P.rect(x, 73 + b, 6, 1, '#c83a3a'); }
  // tanque de vidro com lembranças (na fase 2, rachado e vazando)
  P.ball(cx, 34 + b, 20, 18, ['#3a3a50', '#8a8aa8', '#c8c8e8', '#e8e8ff', '#ffffff'], { amb: 0.4 });
  P.ball(cx, 38 + b, 15, 12, ['#8a5a10', '#d8a030', '#ffd070', '#fff0b0', '#ffffff'], { amb: 0.6 });
  if (fase >= 2) { P.line(cx - 10, 20 + b, cx + 4, 40 + b, '#1a1418'); P.line(cx + 4, 40 + b, cx - 2, 50 + b, '#1a1418'); for (let i = 0; i < 6; i++) P.p(cx - 14 + i * 5, 52 + b + (i % 2) * 3, '#ffd070'); }
  // o olho da caldeira
  P.ball(cx, 60 + b, 7, 7, carga ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] : ['#3a0a0a', '#a82a2a', '#ff5a4a', '#ffc0b0', '#ffffff'], { amb: 0.6 });
  // braços-carimbo
  const ar = carga ? -14 : b * 2;
  for (const s of [-1, 1]) { P.line(cx + s * 38, 56 + b, cx + s * 50, 40 + ar, Fe[3], 4); P.rect(cx + s * 50 - 8, 30 + ar, 16, 12, Lt[2]); P.rect(cx + s * 50 - 9, 41 + ar, 18, 4, '#c83a3a'); }
  P.rect(cx - 6, 8 + b, 12, 6, Lt[3]); P.rect(cx - 2, 2 + b, 4, 7, Fe[2]);
  for (let a = 0; a < 18; a++) { const an = a / 18 * Math.PI * 2; P.p(Math.round(cx + Math.cos(an) * 40), Math.round(66 + b + Math.sin(an) * 34), Lt[4]); }
  return INI6[key] = P.outline().canvas(); }

// ---------- FIGURINOS (disfarce em grupo) ----------
// Recolore as roupas da Rita e da Lume (tudo que não é pele nem cabelo, do pescoço para baixo) com a paleta do figurino
// e põe o acessório na cabeça: vela no chapéu (Pavio), lenço (Lavadeira), chapéu de pena (Trupe).
const FIG6 = {
  pavio: { nm: 'Pavios do turno', pal: ['#2a2a34', '#4a4a58', '#6a6a7a', '#8a8a98', '#a8a8b8'] },
  lavadeira: { nm: 'Lavadeiras do hospital', pal: ['#3a5a6a', '#6a9aaa', '#a8d0d8', '#e0f0f0', '#ffffff'] },
  trupe: { nm: 'Trupe do Seu Lúcio', pal: ['#5a1a3a', '#a82a4a', '#e8603a', '#f0c040', '#fff0a0'] }
};
const FIG6_C = new Map();
function figurino(fr, tipo, quem) {
  if (!fr || !FIG6[tipo]) return fr;
  let m = FIG6_C.get(fr); if (!m) { m = {}; FIG6_C.set(fr, m); }
  if (m[tipo]) return m[tipo];
  const w = fr.width, h = fr.height, c = mk(w, h + 6), x = c.getContext('2d'); x.drawImage(fr, 0, 6);
  const d = x.getImageData(0, 0, w, h + 6), D = d.data, pal = FIG6[tipo].pal;
  // a "cabeça" ocupa ~ o terço de cima do corpo desenhado
  let top = h + 6, bot = 0; for (let yy = 0; yy < h + 6; yy++) for (let xx = 0; xx < w; xx++) if (D[(yy * w + xx) * 4 + 3] > 0) { top = Math.min(top, yy); bot = Math.max(bot, yy); }
  const neck = top + Math.round((bot - top) * (quem === 'lume' ? 0.42 : quem === 'rita2' ? 0.30 : 0.34));
  for (let yy = neck; yy < h + 6; yy++) for (let xx = 0; xx < w; xx++) {
    const i = (yy * w + xx) * 4; if (D[i + 3] === 0) continue;
    const r = D[i], g = D[i + 1], bb = D[i + 2], lum = (r * 0.3 + g * 0.59 + bb * 0.11) / 255;
    const pele = r > 150 && r > g + 18 && g > bb && r - bb > 40 && r - bb < 140;
    if (pele || lum < 0.1) continue;
    const k = Math.max(0, Math.min(4, Math.round(lum * 5.2 - 0.3))), col = pal[k];
    D[i] = parseInt(col.slice(1, 3), 16); D[i + 1] = parseInt(col.slice(3, 5), 16); D[i + 2] = parseInt(col.slice(5, 7), 16);
  }
  x.putImageData(d, 0, 0);
  const cx = Math.round(w / 2), P = (col, a, b2, ww, hh) => { x.fillStyle = col; x.fillRect(a, b2, ww, hh); };
  if (tipo === 'pavio') { P('#2a2a30', cx - 5, top + 1, 10, 3); P('#1a1a20', cx - 6, top + 4, 12, 1); P('#f2ecdc', cx - 1, top - 4, 2, 5); P('#ff9a30', cx - 1, top - 5, 2, 1); P('#fff0c0', cx, top - 6, 1, 1); }
  else if (tipo === 'lavadeira') { P('#e8e8f0', cx - 5, top + 1, 10, 3); P('#c8d0d8', cx - 5, top + 4, 2, 3); P('#e8e8f0', cx + 4, top + 3, 3, 2); }
  else if (tipo === 'trupe') { P('#5a1a3a', cx - 6, top + 2, 12, 2); P('#a82a4a', cx - 4, top - 1, 8, 3); P('#f0c040', cx - 4, top + 1, 8, 1); P('#7ad0ff', cx + 3, top - 5, 2, 4); P('#e8e8ff', cx + 4, top - 6, 2, 2); }
  return (m[tipo] = c);
}
// o baú disfarçado: caixa de lanternas (Pavio), cesto de roupa (Lavadeira), baú de figurino (Trupe)
function enfeiteBau(tipo, x, y, t) {
  const P = (col, a, b2, w, h) => { bx.fillStyle = col; bx.fillRect(Math.round(x + a), Math.round(y + b2), w, h); };
  if (tipo === 'pavio') { for (let i = 0; i < 3; i++) { P('#4a4a5a', 2 + i * 4, -5, 3, 5); P(i === 1 ? '#ffd070' : '#ffb050', 3 + i * 4, -4, 1, 3); } P('#2a2a34', 1, -1, 14, 1); if (t % 40 < 20) P('#fff0c0', 7, -6, 1, 1); }
  else if (tipo === 'lavadeira') { P('#e8e8f0', 1, -3, 14, 3); P('#a8d0d8', 3, -5, 9, 2); P('#ffffff', 5, -6, 4, 1); P('#c8a060', 0, 0, 16, 1); P('#e8e8f0', 12, 0, 3, 6); }
  else if (tipo === 'trupe') { P('#a82a4a', 0, -2, 16, 3); P('#f0c040', 0, 0, 16, 1); P('#f0c040', 4, -1, 1, 1); P('#f0c040', 10, -1, 1, 1); P('#7ad0ff', 12, -7, 2, 5); P('#5a1a3a', 6, -5, 6, 3); }
}
