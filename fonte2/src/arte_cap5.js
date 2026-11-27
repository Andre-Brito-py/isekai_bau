// ================= ARTE DO CAP. 5: CIDADE ALTA, ACENDEDORIA, TELHADOS =================
// Tiles novos (mármore, cascalho, sebe, parede de vidro, abismo dos telhados), a torre de vidro da Acendedoria, a
// estufa, o bondinho, os objetos de quebra-cabeça (vasos, espelhos, cristais, placas, alçapão, tábuas, escadinha),
// a estante das velas, a mesa do escritório, fundos de batalha e os inimigos (Vigia de Vidro, Mariposa de Vidro,
// Guarda Real, o Vitral Vivo e o Grande Holofote).
const KEY5 = { 'm': { t: 'marmore' }, 'g': { t: 'cascalho' }, 'S': { t: 'sebe', solid: true }, 'V': { t: 'parV', solid: true },
  ' ': { t: 'abismo', solid: true }, '.': { t: 'telha' }, 'p': { t: 'tabV' }, 'r': { t: 'tapete' }, ';': { t: 'grama' }, ',': { t: 'pedra' },
  '#': { t: 'muro', solid: true }, '=': { t: 'escada' }, 'X': { t: 'pedra', solid: true } };
{ const _ta6 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (!['marmore', 'cascalho', 'sebe', 'parV', 'abismo'].includes(k)) return _ta6(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y, s = 5) => hash(x + v * 13, y + v * 29, s) % 100;
  if (k === 'marmore') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const rej = x === 15 || y === 15, veio = Math.abs(Math.sin((x + y * 0.6 + v * 3) * 0.5)) < 0.06; P.p(x, y, rej ? '#8a8494' : veio ? '#b8b0c4' : ((x >> 3) + (y >> 3) + v) % 2 ? '#e4e0ea' : '#d6d0de'); }
  } else if (k === 'cascalho') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x, y); P.p(x, y, r < 12 ? '#8a7a62' : r < 30 ? '#c8b894' : r < 36 ? '#e8dcc0' : '#b4a482'); }
  } else if (k === 'sebe') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x, y, 9); P.p(x, y, y > 12 ? '#1e3a22' : r < 18 ? '#2a5a30' : r < 70 ? '#3a7a3e' : r < 90 ? '#4e9a4e' : '#6ab868'); }
    if (v % 4 === 0) { P.p(5, 4, '#f0e8f0'); P.p(11, 9, '#ffd0e0'); }
  } else if (k === 'parV') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const fr = x === 0 || y === 0 || x === 15; P.p(x, y, fr ? '#8a6a30' : y > 12 ? '#1a2a38' : (x + y + v) % 9 === 0 ? '#6ab8d8' : y < 6 ? '#2a5070' : '#1e3a54'); }
    P.p(3, 2, '#c8f0ff'); P.p(4, 3, '#c8f0ff'); P.rect(0, 13, 16, 1, '#c8a040');
  } else {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, y < 3 ? '#1a1420' : '#0a0810');
    if (h(1, 1, 11) < 35) { P.p(4 + (v % 7), 9, '#ffd060'); } if (h(2, 2, 13) < 20) P.p(10, 12, '#ffb040');
  }
  return TILE2[key] = P.canvas();
}; }

// ---------- a Acendedoria: torre de vidro e latão (20 tiles de largura) ----------
let TORRE_C = null;
function acendedoriaArt() {
  if (TORRE_C) return TORRE_C;
  const W_ = 320, H_ = 216, P = new Pix(W_, H_), Lt = ramp('#b8903a'), Vd = ['#14283a', '#1e3a54', '#2a5070', '#4a88a8', '#a8e0f0'], Pd = ramp('#cfc6d6');
  // base de pedra clara
  for (let y = 150; y < 210; y++) for (let x = 8; x < W_ - 8; x++) { const row = (y - 150) >> 3, off = (row % 2) * 8, edge = ((y - 150) % 8 === 7) || ((x + off) % 16 === 15); P.p(x, y, edge ? Pd[0] : P.tone(Pd, 0.62 - x / W_ * 0.2, x, y)); }
  // corpo de vidro em gomos, afinando para cima
  for (let y = 12; y < 150; y++) {
    const m = Math.round(24 + (150 - y) * 0.25);
    for (let x = m; x < W_ - m; x++) {
      const gomo = Math.floor((x - m) / 22), gx = (x - m) % 22, frame = gx === 0 || (y % 26) === 0;
      P.p(x, y, frame ? P.tone(Lt, 0.55 + (gx === 0 ? 0.2 : 0), x, y) : P.tone(Vd, 0.25 + (gx < 4 ? 0.45 : 0) + Math.sin(y * 0.08 + gomo) * 0.12 + ((x + y) % 31 === 0 ? 0.5 : 0), x, y));
    }
  }
  // janelas acesas (a Acendedoria nunca dorme)
  for (let y = 30; y < 140; y += 26) for (let x = 60; x < W_ - 60; x += 22) if (hash(x, y, 3) % 3) { P.rect(x + 6, y + 6, 10, 14, '#ffe08a'); P.rect(x + 7, y + 7, 4, 5, '#fff8d8'); }
  // coroa de latão e a lanterna do topo
  P.rect(40, 8, W_ - 80, 6, Lt[3]); P.rect(40, 8, W_ - 80, 2, Lt[4]);
  P.ball(W_ / 2, 6, 16, 10, ['#8a6a20', '#c89a30', '#f0c850', '#ffe8a0', '#fffbe8'], { amb: 0.5 });
  // o portão em arco
  const px = W_ / 2 - 26;
  P.poly([[px, 210], [px, 168], [px + 26, 150], [px + 52, 168], [px + 52, 210]], (x, y) => P.tone(Lt, 0.3 + (x - px) / 120, x, y));
  P.poly([[px + 4, 210], [px + 4, 170], [px + 26, 155], [px + 48, 170], [px + 48, 210]], (x, y) => (x + y) % 11 === 0 ? '#ffd870' : '#2a1e14');
  P.rect(W_ / 2 - 1, 156, 2, 54, '#8a6a20');
  // brasão: um sol com chama
  P.ball(W_ / 2, 132, 12, 12, ['#8a6a20', '#c89a30', '#f0c850', '#ffe8a0', '#ffffff'], { amb: 0.5 }); for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; P.line(W_ / 2 + Math.cos(an) * 14, 132 + Math.sin(an) * 14, W_ / 2 + Math.cos(an) * 19, 132 + Math.sin(an) * 19, '#f0c850'); }
  // lampiões dos dois lados do portão
  for (const s of [-1, 1]) { const lx = W_ / 2 + s * 46; P.rect(lx - 1, 166, 3, 34, Lt[1]); P.rect(lx - 5, 156, 11, 12, Lt[2]); P.rect(lx - 3, 158, 7, 8, '#ffe08a'); }
  return TORRE_C = P.outline().canvas();
}
// ---------- a estufa (16 tiles): ferro branco e vidro, plantas dentro ----------
let ESTUFA_C = null;
function estufaArt() {
  if (ESTUFA_C) return ESTUFA_C;
  const W_ = 256, H_ = 156, P = new Pix(W_, H_), Fe = ramp('#e8e4ea');
  for (let y = 40; y < 150; y++) for (let x = 4; x < W_ - 4; x++) { const fr = (x - 4) % 20 === 0 || (y - 40) % 22 === 0; P.p(x, y, fr ? P.tone(Fe, 0.7, x, y) : (x + y) % 17 === 0 ? '#c8f0e8' : y > 120 ? '#2a5a3a' : '#3a6a5a'); }
  for (let i = 0; i < 26; i++) { const x = 10 + (i * 37) % (W_ - 20), y = 70 + (i * 23) % 70; P.ball(x, y, 6 + i % 4, 5 + i % 3, ['#1e4a24', '#2e6a32', '#4a9a4a', '#7ac870', '#b8f0a0'], { amb: 0.35 }); if (i % 5 === 0) P.p(x, y - 3, '#ff8ab0'); }
  // telhado arredondado
  P.poly([[2, 42], [W_ / 2, 2], [W_ - 2, 42]], (x, y) => ((x >> 3) + (y >> 3)) % 2 ? '#a8d8d0' : '#c8ece6');
  for (let i = 0; i <= 12; i++) P.line(2 + i * (W_ - 4) / 12, 42, W_ / 2, 2, '#f0f0f4');
  P.rect(0, 40, W_, 4, Fe[3]);
  // porta dupla no meio
  const dx = 7 * 16 + 2; P.rect(dx - 2, 102, 32, 48, Fe[2]); P.rect(dx, 104, 28, 46, '#244a3a'); P.rect(dx + 13, 104, 2, 46, Fe[3]); P.rect(dx + 4, 108, 8, 12, '#a8e8d8'); P.rect(dx + 16, 108, 8, 12, '#a8e8d8');
  return ESTUFA_C = P.outline().canvas();
}
// fonte grande com a estátua do Acendedor erguendo uma lanterna
let FONTE5_C = null;
function fonteEstatuaArt() {
  if (FONTE5_C) return FONTE5_C;
  const P = new Pix(96, 92), Pd = ramp('#c8c0d0'), Ag = ['#2a5a8a', '#3a7ab8', '#6ab0e0', '#a8e0ff', '#ffffff'];
  P.ball(48, 78, 46, 12, Pd, { amb: 0.4 }); P.ball(48, 76, 40, 9, Ag, { amb: 0.5 });
  P.cyl(42, 52, 12, 24, Pd); P.rect(36, 50, 24, 4, Pd[3]);
  // a estátua: casaca, cartola, braço erguido com lanterna
  P.cyl(42, 18, 12, 32, ramp('#8a8494')); P.rect(40, 30, 16, 20, '#7a7484'); P.ball(48, 14, 5, 6, ramp('#9a94a4')); P.rect(43, 4, 10, 6, '#6a6474'); P.rect(41, 9, 14, 2, '#6a6474');
  P.line(52, 24, 62, 8, '#8a8494', 3); P.rect(60, 0, 7, 9, '#c89a30'); P.rect(61, 2, 5, 5, '#ffe08a');
  for (let i = 0; i < 6; i++) P.p(20 + i * 11, 73 + (i % 2), '#ffffff');
  return FONTE5_C = P.outline().canvas();
}
// bondinho parado na plataforma
let BOND_C = null;
function bondinhoArt() {
  if (BOND_C) return BOND_C;
  const P = new Pix(100, 54), Cor = ramp('#b83a3a'), Lt = ramp('#c89a30');
  P.rect(0, 2, 100, 2, '#3a3440'); P.line(50, 4, 50, 12, '#3a3440');
  P.poly([[6, 46], [10, 12], [90, 12], [94, 46]], (x, y) => P.tone(Cor, 0.6 - y / 120 + (x < 20 ? 0.15 : 0), x, y));
  for (let i = 0; i < 5; i++) { P.rect(16 + i * 15, 18, 11, 12, '#a8d8f0'); P.rect(17 + i * 15, 19, 4, 4, '#e8f8ff'); }
  P.rect(8, 34, 84, 3, Lt[3]); P.rect(4, 44, 92, 4, '#2a2430'); for (const x of [20, 80]) P.ball(x, 49, 5, 5, ramp('#4a4450'));
  P.rect(44, 34, 12, 10, '#7a2a2a'); P.rect(40, 6, 20, 6, Lt[2]); P.rect(44, 7, 12, 3, '#ffe08a');
  return BOND_C = P.outline().canvas();
}
let SORV_C = null;
function sorveteArt() {
  if (SORV_C) return SORV_C;
  const P = new Pix(34, 34); P.rect(4, 14, 26, 14, '#e8e0f0'); P.rect(4, 14, 26, 3, '#8ad8f0'); P.ball(10, 30, 3, 3, ramp('#4a4450')); P.ball(26, 30, 3, 3, ramp('#4a4450'));
  P.rect(15, 0, 2, 14, '#6a6474'); P.poly([[2, 4], [16, -2], [30, 4]], '#ff8ab0'); P.poly([[9, 4], [16, -1], [23, 4]], '#ffffff');
  for (const [x, c] of [[8, '#ffb0c8'], [14, '#fff0a0'], [20, '#a8f0c8'], [26, '#c8a8f0']]) P.ball(x, 12, 3, 3, [c, c, '#ffffff']);
  return SORV_C = P.outline().canvas();
}
// ---------- objetos de quebra-cabeça ----------
const OBJ5 = {};
function vasoMovelArt(k = 0) {
  const key = 'vaso' + k; if (OBJ5[key]) return OBJ5[key];
  const P = new Pix(18, 26), Cer = ramp(['#b8603a', '#8a6ab8', '#4a8ab0'][k % 3]);
  P.poly([[3, 14], [15, 14], [13, 25], [5, 25]], (x, y) => P.tone(Cer, 0.7 - (x - 3) / 16, x, y)); P.rect(2, 12, 14, 3, Cer[3]);
  P.ball(9, 8, 7, 6, ['#1e4a24', '#2e6a32', '#4a9a4a', '#7ac870', '#b8f0a0'], { amb: 0.35 }); if (k % 2) { P.p(6, 5, '#ff8ab0'); P.p(11, 7, '#ffd060'); }
  return OBJ5[key] = P.outline().canvas();
}
function espelhoArt(o) {
  const key = 'esp' + o; if (OBJ5[key]) return OBJ5[key];
  const P = new Pix(20, 30), Lt = ramp('#c89a30');
  P.rect(8, 22, 4, 6, Lt[1]); P.rect(4, 27, 12, 3, Lt[0]);
  // o vidro inclinado ( / ou \ ) visto de cima-frente
  const pts = o === '/' ? [[2, 22], [6, 22], [18, 4], [14, 4]] : [[14, 22], [18, 22], [6, 4], [2, 4]];
  P.poly(pts, (x, y) => (x + y) % 5 === 0 ? '#ffffff' : '#a8e0f0'); P.line(pts[0][0], pts[0][1], pts[3][0], pts[3][1], Lt[3]); P.line(pts[1][0], pts[1][1], pts[2][0], pts[2][1], Lt[2]);
  return OBJ5[key] = P.outline().canvas();
}
function escadinhaArt() { if (OBJ5.esc) return OBJ5.esc; const P = new Pix(18, 28), M = ramp('#8a5a30'); P.line(3, 27, 7, 1, M[2], 2); P.line(15, 27, 11, 1, M[1], 2); for (let i = 0; i < 5; i++) P.rect(5 + i * 0.4, 5 + i * 5, 8 - i * 0.8, 2, M[3]); return OBJ5.esc = P.outline().canvas(); }
function tabuaArt() { if (OBJ5.tab) return OBJ5.tab; const P = new Pix(18, 14), M = ramp('#9a6a3a'); P.rect(1, 3, 16, 9, M[2]); P.rect(1, 3, 16, 2, M[3]); P.rect(1, 10, 16, 2, M[0]); P.p(4, 6, M[0]); P.p(13, 7, M[0]); return OBJ5.tab = P.outline().canvas(); }
function placaPressaoArt(on) { const key = 'pp' + (on ? 1 : 0); if (OBJ5[key]) return OBJ5[key]; const P = new Pix(16, 16); P.rect(1, 1, 14, 14, '#5a5462'); P.rect(2, 2, 12, 12, on ? '#ffd060' : '#8a8494'); P.rect(3, 3, 10, 10, on ? '#fff0a0' : '#a8a2b4'); P.rect(5, 5, 6, 6, on ? '#ffd060' : '#7a7484'); return OBJ5[key] = P.canvas(); }
function alcapaoArt(aberto) { const key = 'alc' + (aberto ? 1 : 0); if (OBJ5[key]) return OBJ5[key]; const P = new Pix(32, 18), M = ramp('#6a4a2a'); if (aberto) { P.rect(2, 4, 28, 12, '#0a0810'); for (let i = 0; i < 4; i++) P.rect(8, 6 + i * 3, 16, 1, '#3a2a20'); P.rect(2, 0, 28, 4, M[3]); } else { P.rect(2, 2, 28, 14, M[2]); for (let x = 2; x < 30; x += 7) P.rect(x, 2, 1, 14, M[0]); P.rect(13, 7, 6, 4, '#c8a040'); P.rect(15, 8, 2, 2, '#3a2a10'); } return OBJ5[key] = P.outline().canvas(); }
function portaVidroArt(aberta) { const key = 'pv' + (aberta ? 1 : 0); if (OBJ5[key]) return OBJ5[key]; const P = new Pix(32, 44), Lt = ramp('#c89a30'); P.rect(0, 0, 32, 3, Lt[3]); P.rect(0, 0, 2, 44, Lt[2]); P.rect(30, 0, 2, 44, Lt[2]); if (!aberta) { for (let y = 3; y < 44; y++) for (let x = 2; x < 30; x++) P.p(x, y, (x + y) % 9 === 0 ? '#e8fbff' : '#6ab8d8'); P.rect(15, 3, 2, 41, Lt[2]); P.ball(16, 22, 4, 4, ['#8a6a20', '#c89a30', '#f0c850', '#ffe8a0', '#ffffff']); } else { P.rect(2, 3, 5, 41, '#6ab8d8'); P.rect(25, 3, 5, 41, '#6ab8d8'); } return OBJ5[key] = P.outline().canvas(); }
function cristalArt(cor, aceso) { const key = 'cr' + cor + (aceso ? 1 : 0); if (OBJ5[key]) return OBJ5[key]; const P = new Pix(18, 30), C = cor === 'r' ? ['#5a1a2a', '#a82a3a', '#e85a6a', '#ffa8b0', '#ffffff'] : ['#1a3a5a', '#2a6a9a', '#5ab0e0', '#b8f0ff', '#ffffff'];
  P.rect(4, 24, 10, 5, '#4a4458'); P.rect(3, 23, 12, 2, '#6a6478'); P.poly([[9, 0], [15, 10], [12, 23], [6, 23], [3, 10]], (x, y) => C[Math.max(0, Math.min(4, (aceso ? 2 : 1) + (x < 9 ? 1 : 0) - (y > 16 ? 1 : 0)))]); if (aceso) { P.p(8, 6, '#ffffff'); P.p(9, 7, '#ffffff'); }
  return OBJ5[key] = P.outline().canvas(); }
function emissorArt() { if (OBJ5.emi) return OBJ5.emi; const P = new Pix(18, 30), Lt = ramp('#c89a30'); P.rect(7, 12, 4, 16, Lt[1]); P.rect(3, 27, 12, 3, Lt[0]); P.ball(9, 8, 7, 7, Lt, { amb: 0.4 }); P.ball(11, 8, 4, 4, ['#c8a040', '#ffe08a', '#fff8d8', '#ffffff', '#ffffff']); return OBJ5.emi = P.outline().canvas(); }
// estante do arquivo: prateleiras com velas (w tiles)
const EST5 = {};
function estanteVelasArt(w) {
  if (EST5[w]) return EST5[w];
  const P = new Pix(w * 16, 44), M = ramp('#4a3020');
  P.rect(0, 4, w * 16, 40, M[1]); for (let s = 0; s < 3; s++) { P.rect(0, 14 + s * 12, w * 16, 2, M[3]); }
  P.rect(0, 2, w * 16, 3, M[2]); P.rect(0, 0, w * 16, 2, M[3]);
  for (let s = 0; s < 3; s++) for (let x = 3; x < w * 16 - 3; x += 5) { const hh = 4 + hash(x, s, 3) % 4, y = 14 + s * 12; P.rect(x, y - hh, 3, hh, '#e8e0cc'); if (hash(x, s, 9) % 3) { P.p(x + 1, y - hh - 1, '#ffd060'); P.p(x + 1, y - hh - 2, '#fff0a0'); } }
  return EST5[w] = P.outline().canvas();
}
function velaNomeArt(acesa) { const key = 'vn' + (acesa ? 1 : 0); if (OBJ5[key]) return OBJ5[key]; const P = new Pix(10, 22); P.rect(3, 8, 4, 12, '#f0e8d8'); P.rect(3, 8, 1, 12, '#ffffff'); P.rect(1, 19, 8, 3, '#c8a040'); P.p(5, 7, '#3a2a20'); if (acesa) { P.ball(5, 4, 2, 3, ['#c86a20', '#ffb040', '#ffe08a', '#fff8d8', '#ffffff'], { amb: 0.8 }); } return OBJ5[key] = P.outline().canvas(); }
// escritório: mesa grande com o caderno preto e uma lâmpada verde; janela com a cidade acesa
let MESA5_C = null;
function mesaEscritorioArt() {
  if (MESA5_C) return MESA5_C;
  const P = new Pix(66, 40), M = ramp('#5a3020');
  P.rect(0, 12, 66, 6, M[3]); P.rect(0, 18, 66, 18, M[1]); P.rect(4, 22, 26, 12, M[2]); P.rect(36, 22, 26, 12, M[2]); P.rect(15, 27, 4, 2, '#c8a040'); P.rect(47, 27, 4, 2, '#c8a040');
  P.rect(30, 6, 16, 7, '#1a1418'); P.rect(31, 7, 14, 5, '#2a2228'); P.rect(38, 6, 1, 7, '#8a1a2a');   // o caderno preto, com fita vermelha
  P.rect(8, 0, 3, 13, '#c89a30'); P.ball(10, 2, 6, 4, ['#1a4a2a', '#2a7a3a', '#4ab060', '#a8f0b8', '#ffffff']);                  // lâmpada verde
  P.rect(52, 8, 8, 5, '#e8e0d0'); P.rect(53, 6, 6, 3, '#f0e8d8'); P.p(56, 3, '#d8d0c8'); P.p(55, 1, '#d8d0c8');                 // xícara de chá fumegando
  return MESA5_C = P.outline().canvas();
}
let JAN5_C = null;
function janelaCidadeArt() {
  if (JAN5_C) return JAN5_C;
  const P = new Pix(48, 40), Lt = ramp('#c89a30');
  P.rect(0, 0, 48, 40, Lt[1]); P.rect(3, 3, 42, 34, '#0e1430');
  for (let i = 0; i < 40; i++) { const x = 4 + (i * 17) % 40, y = 18 + (i * 7) % 18; P.p(x, y, i % 3 ? '#ffd060' : '#ffe8a0'); }
  P.poly([[30, 37], [36, 12], [40, 37]], '#1a1a2a'); P.rect(35, 9, 3, 4, '#2a2a3a');            // o morro do Farol, apagado
  P.rect(23, 3, 2, 34, Lt[2]); P.rect(3, 19, 42, 2, Lt[2]);
  return JAN5_C = P.outline().canvas();
}
function guaritaArt() { if (OBJ5.gua) return OBJ5.gua; const P = new Pix(34, 70), Pd = ramp('#6a6274'); P.rect(6, 20, 22, 48, Pd[2]); for (let y = 24; y < 68; y += 6) P.rect(6, y, 22, 1, Pd[0]); P.rect(2, 14, 30, 8, Pd[3]); P.poly([[0, 14], [17, 0], [34, 14]], '#4a3a5a'); P.rect(13, 30, 8, 10, '#ffe08a'); return OBJ5.gua = P.outline().canvas(); }
// ---------- fundos de batalha ----------
let BG5 = {};
function bgCidadeAlta() { if (BG5.ca) return BG5.ca; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 70 ? (y < 30 ? '#0e1430' : '#18204a') : y < 96 ? '#2a5a3a' : ((x >> 4) + (y >> 4)) % 2 ? '#d6d0de' : '#c8c2d2');
  for (let i = 0; i < 50; i++) P.p((i * 53) % 240, (i * 17) % 30, '#e8e8ff');
  for (let x = 80; x < 160; x++) for (let y = 4; y < 70; y++) if (Math.abs(x - 120) < 40 - y * 0.15) P.p(x, y, (x - 80) % 12 === 0 ? '#c89a30' : (x + y) % 13 === 0 ? '#ffe08a' : '#1e3a54');
  for (const x of [20, 60, 180, 220]) { P.ball(x, 78, 18, 12, ['#1e3a22', '#2a5a30', '#3a7a3e', '#4e9a4e', '#6ab868']); }
  for (const x of [40, 200]) { P.rect(x, 50, 3, 46, '#4a4468'); P.rect(x - 3, 44, 9, 7, '#ffe08a'); }
  return BG5.ca = P.canvas(); }
function bgTorre() { if (BG5.to) return BG5.to; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 100 ? ((x % 30 === 0 || y % 34 === 0) ? '#8a6a30' : (x + y) % 23 === 0 ? '#6ab8d8' : y < 50 ? '#1e3a54' : '#2a5070') : ((x >> 4) + (y >> 4)) % 2 ? '#e4e0ea' : '#d6d0de');
  for (let x = 15; x < 240; x += 30) { P.rect(x + 8, 20, 12, 16, '#ffe08a'); P.rect(x + 10, 22, 4, 5, '#fff8d8'); }
  for (let i = 0; i < 6; i++) for (let k = 0; k < 100; k += 3) P.p(i * 48 + k * 0.6, k, '#3a6a8a');
  return BG5.to = P.canvas(); }
function bgTelhado() { if (BG5.te) return BG5.te; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 60 ? (y < 20 ? '#080c20' : '#101838') : y < 96 ? '#1a1830' : (((x >> 3) + (y >> 2)) % 2 ? '#7a3a2a' : '#8a4632'));
  for (let i = 0; i < 70; i++) P.p((i * 71) % 240, (i * 13) % 50, i % 5 ? '#c8c8f0' : '#ffffff');
  for (let x = 0; x < 240; x += 26) { const h = 20 + hash(x, 1, 3) % 30; P.rect(x, 96 - h, 22, h, '#14122a'); if (hash(x, 2, 3) % 2) P.rect(x + 8, 96 - h + 6, 5, 6, '#ffd060'); }
  for (let y = 0; y < 96; y++) for (let x = 0; x < 240; x++) { const a = 150 - y * 0.57, b2 = 175 - y * 0.57; if (x > a && x < b2 && (x + y) % 3 === 0) P.p(x, y, '#3a3a5a'); }
  return BG5.te = P.canvas(); }

// ---------- inimigos ----------
const INI5 = {};
function vigiaArt(f, espelho) {
  const key = 'vig' + f + (espelho ? 1 : 0); if (INI5[key]) return INI5[key];
  const P = new Pix(40, 60), Vd = ['#1a3a5a', '#2a6a9a', '#5ab0e0', '#b8f0ff', '#ffffff'], Lt = ramp('#c89a30'), b = f % 2;
  for (const s of [-1, 1]) P.poly([[20 + s * 4, 58], [20 + s * 9, 58], [20 + s * 8, 38], [20 + s * 4, 38]], (x, y) => P.tone(Vd, 0.4 + (s < 0 ? 0.2 : 0), x, y));
  P.poly([[8, 38 + b], [32, 38 + b], [28, 16 + b], [12, 16 + b]], (x, y) => P.tone(Vd, 0.3 + (x < 20 ? 0.35 : 0) + ((x + y) % 7 === 0 ? 0.3 : 0), x, y));
  P.rect(10, 24 + b, 20, 2, Lt[3]); P.rect(10, 32 + b, 20, 2, Lt[2]);
  // cabeça-lanterna
  P.rect(14, 4 + b, 12, 12, Lt[1]); P.rect(15, 5 + b, 10, 10, espelho ? '#ffffff' : '#ffe08a'); P.rect(17, 7 + b, 4, 4, '#fff8d8'); P.rect(12, 2 + b, 16, 3, Lt[3]);
  // escudo-espelho no braço
  P.poly([[2, 22 + b], [10, 20 + b], [10, 40 + b], [2, 36 + b]], (x, y) => espelho ? ((x + y) % 3 ? '#e8fbff' : '#ffffff') : '#6ab8d8'); P.line(2, 22 + b, 10, 20 + b, Lt[3]);
  P.line(32, 22 + b, 38, 10 + b, Lt[2], 2);
  return INI5[key] = P.outline().canvas();
}
function mariposaVidroArt(f) {
  const key = 'mv' + f; if (INI5[key]) return INI5[key];
  const P = new Pix(36, 30), a = f % 2 ? 4 : 0;
  for (const s of [-1, 1]) { P.poly([[18, 15], [18 + s * 17, 3 + a], [18 + s * 14, 18], [18 + s * 6, 24 - a]], (x, y) => (x + y) % 4 === 0 ? '#ffffff' : (Math.abs(x - 18) + y) % 9 < 3 ? '#a8e0f0' : '#5ab0d8'); }
  P.rect(16, 9, 4, 16, '#c8a040'); P.rect(17, 7, 2, 3, '#ffe08a'); P.p(15, 5, '#c8a040'); P.p(21, 5, '#c8a040');
  return INI5[key] = P.outline().canvas();
}
function guardaRealArt(f) {
  const key = 'gr' + f; if (INI5[key]) return INI5[key];
  const P = new Pix(34, 56), b = f % 2, Az = ramp('#2a3a7a'), Lt = ramp('#c89a30');
  P.rect(11, 40, 5, 16, '#1a1a2a'); P.rect(18, 40, 5, 16, '#1a1a2a');
  P.cyl(9, 20 + b, 16, 22, Az); P.rect(9, 30 + b, 16, 2, Lt[3]); for (let i = 0; i < 3; i++) P.p(17, 23 + i * 5 + b, Lt[4]);
  P.ball(17, 13 + b, 6, 6, ramp('#d8a070')); P.rect(10, 2 + b, 14, 9, Az[1]); P.rect(9, 9 + b, 16, 2, Lt[2]); P.rect(16, 0 + b, 2, 3, '#c83a3a');
  P.rect(14, 13 + b, 2, 2, '#1a1418'); P.rect(19, 13 + b, 2, 2, '#1a1418');
  P.rect(28, 2 + b, 2, 52, '#6a4a2a'); P.poly([[24, 6 + b], [29, -1], [34, 6 + b], [29, 10 + b]], '#c8c8d8');     // alabarda
  P.rect(2, 26 + b, 6, 8, Lt[1]); P.rect(3, 27 + b, 4, 6, '#ffe08a');                                                   // lanterna na mão
  return INI5[key] = P.outline().canvas();
}
// o VITRAL VIVO: um guardião de vitral; a cor do vitral muda (vermelho / azul / verde) e muda o que o machuca
const VIT_COR = { r: ['#4a0a1a', '#8a1a2a', '#d83a4a', '#ff8a8a', '#ffe0e0'], b: ['#0a1a4a', '#1a3a8a', '#3a7ad8', '#8ab8ff', '#e0f0ff'], g: ['#0a3a1a', '#1a6a2a', '#3ab04a', '#8ae88a', '#e0ffe0'] };
function vitralArt(f, cor, ataque) {
  const key = 'vit' + f + cor + (ataque ? 1 : 0); if (INI5[key]) return INI5[key];
  const W_ = 96, H_ = 116, P = new Pix(W_, H_), cx = 48, C = VIT_COR[cor] || VIT_COR.r, Pb = ['#1a1418', '#2a2228', '#3a3238', '#5a5258', '#8a8288'], b = f % 2;
  // corpo em arco gótico, recortado em vitrais com chumbo
  const dentro = (x, y) => y > 30 && Math.abs(x - cx) < 30 || (y <= 30 && Math.hypot(x - cx, y - 30) < 30);
  for (let y = 4; y < 100; y++) for (let x = 14; x < 82; x++) {
    if (!dentro(x, y - b)) continue;
    const chumbo = ((x - cx) % 12 === 0) || ((y + x * 0.5) % 16 < 1.2) || ((y - x * 0.5 + 200) % 16 < 1.2);
    const cel = Math.floor((x + 200) / 12) * 7 + Math.floor((y + x * 0.5) / 16) * 3, sh = [C[1], C[2], C[3], '#ffd870', C[2], '#ffffff'][cel % 6];
    P.p(x, y, chumbo ? Pb[1] : (x + y) % 13 === 0 ? C[4] : sh);
  }
  // rosácea no peito com um olho de luz
  P.ball(cx, 52 + b, 14, 14, Pb); P.ball(cx, 52 + b, 11, 11, ['#ffd870', C[3], C[2], '#ffffff', '#ffffff'], { amb: 0.6 });
  for (let a = 0; a < 8; a++) { const an = a / 8 * Math.PI * 2; P.line(cx, 52 + b, cx + Math.cos(an) * 11, 52 + b + Math.sin(an) * 11, Pb[2]); }
  P.ball(cx, 52 + b, 4, 4, ataque ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] : [C[0], C[1], '#ffffff', '#ffffff', '#ffffff']);
  // moldura de pedra e pés de pedestal
  P.rect(14, 98, 68, 8, Pb[3]); P.rect(10, 104, 76, 8, Pb[2]); P.rect(10, 104, 76, 2, Pb[4]);
  // braços de chumbo com lâminas de vidro
  const ar = ataque ? -10 : b * 2;
  for (const s of [-1, 1]) { P.line(cx + s * 28, 44 + b, cx + s * 40, 62 + ar, Pb[2], 3); P.poly([[cx + s * 38, 60 + ar], [cx + s * 46, 56 + ar], [cx + s * 44, 80 + ar], [cx + s * 40, 82 + ar]], (x, y) => (x + y) % 4 ? C[3] : '#ffffff'); }
  return INI5[key] = P.outline().canvas();
}
// o GRANDE HOLOFOTE: a máquina da Guarda na torre do sino; lente enorme, engrenagens, operador
function holofoteBossArt(f, fase, carga) {
  const key = 'hol' + f + fase + (carga ? 1 : 0); if (INI5[key]) return INI5[key];
  const W_ = 104, H_ = 112, P = new Pix(W_, H_), cx = 52, Fe = ramp('#4a4a5a'), Lt = ramp('#c89a30'), b = f % 2;
  // base de três pés e engrenagens
  for (const s of [-1, 0, 1]) P.line(cx, 70, cx + s * 30, 108, Fe[2], 4);
  P.rect(cx - 34, 104, 68, 6, Fe[1]);
  for (const [gx, gy, r] of [[cx - 22, 76, 10], [cx + 22, 80, 8]]) { P.ball(gx, gy, r, r, Fe); for (let a = 0; a < 8; a++) { const an = a / 8 * Math.PI * 2 + f * 0.4; P.rect(Math.round(gx + Math.cos(an) * (r + 1)) - 1, Math.round(gy + Math.sin(an) * (r + 1)) - 1, 3, 3, Fe[3]); } }
  // corpo-tambor inclinado
  P.ball(cx, 44 + b, 32, 30, Fe, { amb: 0.3 });
  for (let a = 0; a < 16; a++) { const an = a / 16 * Math.PI * 2; P.p(Math.round(cx + Math.cos(an) * 29), Math.round(44 + b + Math.sin(an) * 27), Lt[3]); }
  // a lente: rachada na fase 2; brancona quando carrega o Facho
  const L = carga ? ['#fff0a0', '#ffffff', '#ffffff', '#ffffff', '#ffffff'] : ['#8a6a20', '#f0c850', '#ffe8a0', '#fff8d8', '#ffffff'];
  P.ball(cx + 4, 42 + b, 22, 21, L, { amb: 0.6 });
  for (let a = 0; a < 6; a++) { const an = a / 6 * Math.PI * 2; P.line(cx + 4, 42 + b, cx + 4 + Math.cos(an) * 20, 42 + b + Math.sin(an) * 19, carga ? '#fff8d8' : '#e8c860'); }
  if (fase >= 2) { P.line(cx - 8, 28 + b, cx + 10, 46 + b, '#3a2a20'); P.line(cx + 10, 46 + b, cx + 4, 60 + b, '#3a2a20'); P.line(cx + 10, 46 + b, cx + 22, 50 + b, '#3a2a20'); }
  P.rect(cx - 30, 20 + b, 6, 50, Lt[2]); P.rect(cx + 26, 20 + b, 6, 50, Lt[2]);
  // o operador da Guarda, de quepe, agarrado às alavancas
  P.rect(cx + 34, 58, 10, 18, '#2a3a7a'); P.ball(cx + 39, 52, 5, 5, ramp('#d8a070')); P.rect(cx + 33, 45, 12, 4, '#2a3a7a'); P.rect(cx + 33, 48, 12, 1, '#c89a30');
  P.line(cx + 34, 62, cx + 26, 54 + b * 2, '#c89a30', 2);
  return INI5[key] = P.outline().canvas();
}
// v113: as velas COM NOME se confundiam com as mil velas pintadas nas estantes (o jogador não achava as do enigma).
// Agora cada uma tem uma ETIQUETA de papel pendurada e, apagada, um brilhinho âmbar que pisca devagar.
{ const _vnA = velaNomeArt; velaNomeArt = function (acesa) {
  const f = acesa ? 0 : Math.floor((typeof W2 === 'object' ? W2.t : 0) / 18) % 3, key = 'vnE' + (acesa ? 1 : 0) + f; if (OBJ5[key]) return OBJ5[key];
  const base = _vnA(acesa);
  const out = mk(18, 30), x = out.getContext('2d');
  x.drawImage(base, 4, 0);
  // etiqueta: barbante + papel com rabisco de nome
  x.fillStyle = '#c8b890'; x.fillRect(12, 12, 1, 5);
  x.fillStyle = '#2a2020'; x.fillRect(10, 16, 8, 7);
  x.fillStyle = '#f4ecd8'; x.fillRect(11, 17, 6, 5);
  x.fillStyle = '#5a4a3a'; x.fillRect(12, 18, 4, 1); x.fillRect(12, 20, 3, 1);
  if (!acesa) { x.fillStyle = f === 0 ? '#ffe066' : f === 1 ? '#ffb040' : '#fff6c8'; x.fillRect(8, 3 - f, 1, 1); x.fillRect(2, 6 + f, 1, 1); if (f === 2) { x.fillRect(7, 2, 3, 1); x.fillRect(8, 1, 1, 3); } }
  return OBJ5[key] = out;
}; }
