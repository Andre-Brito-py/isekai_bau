// ================= ARTE DO CAP. 9 — A SUBIDA DO MORRO =================
// Tiles de neve (neve, trilha batida, laje do Farol, degraus), o Sopé (barracas dos aliados, cancela da Guarda, a chaminé
// velha, pinheiros com neve), a Encosta (muretas, pedras-abrigo, holofotes, a cidade lá embaixo no abismo, o vento), a
// Crista (a Lente do Luar, a Porta das Lentes, o atril), a base da torre do Farol. Inimigos: Sentinela de Latão, Gralha
// do Morro, Mariposa de Âmbar. Chefes (arte caprichada, pedido do usuário): O ESPANTALHO DO CERCO (o do Cap. 1, refeito
// com os cartazes novos), A RAINHA DO FAROL (a Mariposa-Rainha, de asas de âmbar) e O FAROLEIRO (o guardião de latão
// com a lente que LÊ).
const KEY9 = Object.assign({}, KEY8, { 'n': { t: 'neve9' }, 'c': { t: 'trilha9' }, 'l': { t: 'laje9' }, 'e': { t: 'degrau9' }, 'N': { t: 'neve9', solid: true } });
{ const _ta9 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (!['neve9', 'trilha9', 'laje9', 'degrau9'].includes(k)) return _ta9(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y, s = 5) => hash(x + v * 17, y + v * 31, s) % 100;
  if (k === 'neve9') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x >> 1, y >> 1, 7); P.p(x, y, r < 18 ? '#c8d4e2' : r < 70 ? '#dbe4ee' : r < 92 ? '#e6edf4' : '#f2f6fa'); }
    if (v % 5 === 1) { P.rect(4, 5, 2, 3, '#b0bccc'); P.rect(9, 9, 2, 3, '#b0bccc'); }              // pegadas
    if (v % 7 === 3) { P.rect(10, 4, 3, 2, '#5a5464'); P.rect(10, 3, 3, 1, '#f2f6fa'); }             // pedrinha
    if (v % 3 === 0) P.p(h(1, 1) % 14 + 1, h(2, 2) % 14 + 1, '#ffffff');                              // brilho
  } else if (k === 'trilha9') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x, y, 3); P.p(x, y, r < 14 ? '#9aa4b2' : r < 60 ? '#b4bcc8' : r < 90 ? '#c2cad4' : '#8a7e74'); }
    P.rect(3, 0, 1, 16, '#a0a8b4'); P.rect(12, 0, 1, 16, '#a0a8b4');
  } else if (k === 'laje9') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x >> 2, y >> 2, 9); P.p(x, y, r < 30 ? '#5e5c6a' : r < 70 ? '#686674' : '#72707e'); }
    for (let i = 0; i < 16; i++) { P.p(i, 7, '#d8e0ea'); P.p(i, 15, '#d8e0ea'); } for (let y = 0; y < 8; y++) { P.p((v % 2 ? 4 : 10), y, '#d8e0ea'); P.p((v % 2 ? 12 : 6), y + 8, '#d8e0ea'); }
  } else {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, (y % 4) < 1 ? '#4a4652' : (y % 4) < 2 ? '#8a8494' : '#76707e');
    for (let y = 0; y < 16; y += 4) for (let x = 0; x < 16; x++) if (h(x, y) < 40) P.p(x, y + 1, '#e6edf4');
  }
  return TILE2[key] = P.canvas();
}; }
const OBJ9 = {};
const o9 = (k, f) => OBJ9[k] || (OBJ9[k] = f());
// ---------- o Sopé ----------
function pinheiroNeveArt(v) { return o9('pn' + v, () => { const P = new Pix(36, 66), Vd = ramp(v % 2 ? '#24503a' : '#2e5e44');
  P.rect(16, 52, 4, 14, '#4a3020'); P.rect(16, 52, 1, 14, '#6a4a30');
  for (let k = 0; k < 4; k++) { const y0 = 6 + k * 12, w = 6 + k * 5; P.poly([[18 - w, y0 + 14], [18, y0], [18 + w, y0 + 14]], (x, y) => P.tone(Vd, 0.75 - (x - 18 + w) / (w * 3) - (y - y0) / 40, x, y));
    for (let x = 18 - w + 1; x < 18 + w; x++) { const yy = y0 + 13 - Math.round(Math.abs(x - 18) * 0.9); if ((x + k) % 3) P.p(x, Math.max(y0 + 3, yy - 1), '#eef3f8'); P.p(x, y0 + 13, x % 2 ? '#dbe4ee' : '#f2f6fa'); } }
  P.rect(16, 3, 4, 3, '#f2f6fa'); return P.outline().canvas(); }); }
function tendaAliadaArt(cor, emb) { return o9('te' + cor + emb, () => { const P = new Pix(56, 44), L = ramp(cor), Wd = ramp('#6a4a2a');
  P.poly([[2, 42], [28, 4], [54, 42]], (x, y) => P.tone(L, 0.8 - (x - 2) / 70 + ((x + y) % 9 === 0 ? 0.1 : 0), x, y));
  P.poly([[20, 42], [28, 18], [36, 42]], '#1a1418'); P.poly([[22, 42], [28, 22], [28, 42]], L[1]);
  P.line(28, 4, 28, 0, Wd[1], 2); P.rect(28, 0, 8, 5, emb === 'cruz' ? '#f2ecdc' : emb === 'guilda' ? '#2a3a6a' : '#c8902a');
  if (emb === 'cruz') { P.rect(31, 1, 2, 3, '#c83a3a'); P.rect(30, 2, 4, 1, '#c83a3a'); }
  if (emb === 'guilda') { P.p(31, 2, '#ffd070'); P.p(33, 2, '#ffd070'); P.p(32, 1, '#ffd070'); }
  for (let x = 4; x < 52; x++) { const y = 42 - Math.round(Math.abs(x - 28) * 1.45); if (x % 3) P.p(x, Math.max(5, y), '#f2f6fa'); }
  P.line(0, 43, 6, 36, Wd[1]); P.line(55, 43, 49, 36, Wd[1]);
  return P.outline().canvas(); }); }
function mesaMapasArt(f) { return o9('mm' + (f % 3), () => { const P = new Pix(34, 26), Wd = ramp('#7a4a2a');
  P.rect(2, 10, 30, 4, Wd[3]); P.rect(2, 14, 30, 2, Wd[1]); P.rect(4, 16, 2, 10, Wd[1]); P.rect(28, 16, 2, 10, Wd[1]);
  P.rect(6, 6, 16, 5, '#e8dcc0'); for (let i = 0; i < 6; i++) P.p(8 + i * 2, 8 + (i % 2), '#8a5a3a'); P.line(10, 7, 18, 9, '#c83a3a');
  P.rect(25, 4, 3, 7, '#f2ecdc'); P.poly([[25, 4], [26, [1, 0, 2][f % 3]], [28, 4]], '#ffb040'); P.p(26, 2, '#fff0a0');
  return P.outline().canvas(); }); }
function cancelaMorroArt(aberta) { return o9('ca' + (aberta ? 1 : 0), () => { const P = new Pix(70, 52), Wd = ramp('#5a4a3a'), Az = ramp('#2a3a6a');
  P.rect(0, 14, 18, 36, Az[1]); P.rect(0, 14, 18, 3, Az[3]); P.poly([[-2, 14], [9, 4], [20, 14]], '#2a2430'); P.rect(4, 22, 10, 8, '#ffd070'); P.rect(4, 22, 10, 1, '#fff0c0'); P.rect(6, 34, 6, 16, '#1a1418');
  for (let x = 0; x < 19; x++) P.p(x, 4 + Math.round(Math.abs(x - 9) * 1.1) - 1, '#f2f6fa');
  P.rect(19, 30, 4, 20, Wd[1]);
  if (aberta) { for (let i = 0; i < 40; i++) P.rect(20 + Math.round(i * 0.15), 30 - i, 3, 1, (i >> 2) % 2 ? '#c83a3a' : '#f2ecdc'); }
  else { for (let x = 22; x < 70; x++) P.rect(x, 31, 1, 3, ((x - 22) >> 2) % 2 ? '#c83a3a' : '#f2ecdc'); P.rect(66, 34, 2, 16, Wd[1]); }
  return P.outline().canvas(); }); }
function chamineVelhaArt(aberta) { return o9('ch' + (aberta ? 1 : 0), () => { const P = new Pix(30, 76), Tj = ramp('#8a4a3a');
  for (let y = 4; y < 76; y++) for (let x = 3; x < 27; x++) { const row = y >> 2, off = row % 2 ? 3 : 0; P.p(x, y, ((x + off) % 6 === 0 || y % 4 === 0) ? Tj[0] : P.tone(Tj, 0.7 - (x - 3) / 40, x, y)); }
  P.rect(1, 0, 28, 6, Tj[1]); P.rect(1, 0, 28, 2, '#f2f6fa'); P.rect(6, 1, 18, 3, '#1a1014');
  P.rect(8, 52, 14, 24, '#120c10'); P.rect(8, 52, 14, 2, Tj[0]);
  if (!aberta) for (const y of [54, 60, 66, 72]) P.rect(7, y, 16, 3, '#6a4a2a');
  for (let i = 0; i < 5; i++) P.p(4 + i * 5, 6, '#2a2a2a');
  return P.outline().canvas(); }); }
// ---------- a Encosta ----------
function muretaArt(v) { return o9('mu' + (v % 3), () => { const P = new Pix(16, 16), Pd = ramp('#6a6474');
  for (let y = 4; y < 16; y++) for (let x = 0; x < 16; x++) { const r = ((x >> 2) + (y >> 2) + v) % 3; P.p(x, y, (y % 4 === 0 || (x + (y >> 2) * 2) % 8 === 0) ? Pd[0] : P.tone(Pd, 0.55 + r * 0.08, x, y)); }
  for (let x = 0; x < 16; x++) { P.p(x, 3, '#f2f6fa'); P.p(x, 4, x % 3 ? '#dbe4ee' : '#f2f6fa'); if ((x + v) % 5 === 0) P.p(x, 2, '#f2f6fa'); }
  return P.canvas(); }); }
function pedraAbrigoArt(v) { return o9('pa' + (v % 3), () => { const P = new Pix(22, 24), Pd = ['#2a2632', '#3e3846', '#544c5c', '#6a6274', '#847c8e'];
  P.ball(11, 15, 10, 9, Pd, { amb: 0.25 }); P.ball(8 + v % 3, 9, 6, 5, Pd);
  for (let x = 3; x < 19; x++) { const y = 7 + Math.round(Math.abs(x - 10) * 0.5); P.p(x, y, '#f2f6fa'); if (x % 2) P.p(x, y + 1, '#dbe4ee'); }
  P.p(13, 15, '#2a2632'); P.p(14, 16, '#2a2632'); return P.outline().canvas(); }); }
function holofoteMuroArt(f) { return o9('ho' + (f % 2), () => { const P = new Pix(22, 22), Fe = ramp('#5a5a6e');
  P.rect(8, 12, 6, 10, Fe[1]); P.ball(11, 9, 8, 7, Fe); P.ball(11, 11, 5, 4, ['#a87a20', '#e8a030', '#ffd070', '#fff0b0', '#ffffff']);
  if (f % 2) P.p(9, 9, '#ffffff'); return P.outline().canvas(); }); }
// a cidade lá embaixo, vista pelas frestas da beira (abismo da encosta): pontinhos de âmbar e névoa
function cidadeAbismo9(ox, oy, t) {
  const m = W2.map; if (!m || W2.id !== 'encosta9') return;
  const x0 = Math.max(0, Math.floor(ox / TS)), y0 = Math.max(0, Math.floor(oy / TS)), x1 = Math.min(m.w - 1, x0 + Math.ceil(W / TS) + 2), y1 = Math.min(m.h - 1, y0 + Math.ceil(H / TS) + 2);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m.rows[y][x] === ' ') {
    const sx = x * TS - ox, sy = y * TS - oy;
    bx.fillStyle = 'rgba(30,40,64,0.55)'; bx.fillRect(sx, sy, TS, TS);
    for (let k = 0; k < 3; k++) { const hh = hash(x * 3 + k, y * 7, 9) % 100; if (hh < 40) { bx.fillStyle = (hh + Math.floor(t / 30)) % 9 === 0 ? '#fff0b0' : hh % 3 ? '#e8a030' : '#ffd070'; bx.fillRect(sx + (hh * 7) % 15, sy + (hh * 3) % 15, 1, 1); } }
    if (m.rows[y - 1] && m.rows[y - 1][x] !== ' ') { bx.fillStyle = '#2a2632'; bx.fillRect(sx, sy, TS, 2); bx.fillStyle = 'rgba(220,230,240,0.5)'; bx.fillRect(sx, sy + 2, TS, 1); }
  }
}
// rajada: traços de neve correndo para baixo (o vento do morro empurra para a beira)
function ventoFx(int, t) {
  if (int <= 0) return;
  for (let i = 0; i < 40 * int; i++) { const x = (i * 37 + t * 3) % W, y = (i * 53 + t * (9 + i % 5)) % H; bx.fillStyle = i % 3 ? 'rgba(240,246,250,0.75)' : 'rgba(200,220,240,0.6)'; bx.fillRect(x, y, 1, 4 + (i % 4) * 2); }
}
// ---------- a Crista ----------
function lenteLuarArt(f) { return o9('ll' + (f % 4), () => { const P = new Pix(28, 46), Lt = ramp('#a8803a');
  P.rect(12, 26, 4, 18, Lt[1]); P.rect(6, 42, 16, 4, Lt[0]); P.rect(6, 42, 16, 1, Lt[3]);
  P.ball(14, 15, 12, 13, Lt, { amb: 0.3 });
  const gl = ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#ffffff'];
  P.ball(14, 15, 9, 10, gl, { amb: 0.4 + (f % 4) * 0.05 });
  for (let r = 3; r < 10; r += 3) for (let a = 0; a < 24; a++) { const an = a / 24 * Math.PI * 2; if (a % 2) P.p(Math.round(14 + Math.cos(an) * r), Math.round(15 + Math.sin(an) * r * 1.1), '#fff0c0'); }
  return P.outline().canvas(); }); }
function portaLentesArt(aberta, f) { return o9('pl' + (aberta ? 1 : 0) + (f % 3), () => { const P = new Pix(40, 66), Pd = ramp('#5e5a68'), Lt = ramp('#a8803a');
  P.rect(0, 0, 6, 66, Pd[1]); P.rect(34, 0, 6, 66, Pd[1]); P.rect(0, 0, 40, 8, Pd[2]); P.rect(0, 0, 40, 2, '#f2f6fa');
  if (!aberta) { for (let y = 8; y < 66; y++) for (let x = 6; x < 34; x++) P.p(x, y, (x - 6) % 7 === 0 ? Lt[0] : P.tone(Lt, 0.5 - (x - 6) / 60 + (y % 11 === 0 ? 0.2 : 0), x, y)); P.rect(19, 8, 2, 58, Lt[0]); }
  else for (let y = 8; y < 66; y++) for (let x = 6; x < 34; x++) P.p(x, y, '#0e0c14');
  const lit = aberta, c = lit ? ['#a87a20', '#e8a030', '#ffd070', '#fff0b0', '#ffffff'] : ['#1a3a5a', '#2a5a8a', '#4a8ac8', '#8ac8f0', '#d8f0ff'];
  P.ball(20, 18, 7, 7, c, { amb: 0.35 + (f % 3) * 0.05 });
  return P.outline().canvas(); }); }
function atrilArt() { return o9('at', () => { const P = new Pix(18, 28), Wd = ramp('#6a4a2a');
  P.rect(7, 12, 4, 14, Wd[1]); P.rect(3, 25, 12, 3, Wd[0]); P.poly([[1, 12], [17, 8], [17, 12], [1, 16]], Wd[2]);
  P.poly([[3, 11], [9, 9], [9, 12], [3, 14]], '#e8dcc0'); P.poly([[9, 9], [15, 8], [15, 11], [9, 12]], '#f2ecdc'); P.p(5, 12, '#2a2a5a'); P.p(12, 10, '#2a2a5a');
  return P.outline().canvas(); }); }
// a base da torre do Farol (vista de baixo, no pátio): pedra, portão de latão, janelas de âmbar, neve
function torreFarolBaseArt(f, aberta) { return o9('tf' + (f % 3) + (aberta ? 1 : 0), () => { const W_ = 200, H_ = 124, P = new Pix(W_, H_), Pd = ramp('#5e5a68'), Lt = ramp('#a8803a');
  for (let y = 0; y < H_; y++) { const w = 70 + Math.round(y * 0.22); for (let x = 100 - w; x < 100 + w; x++) { const row = y >> 3, off = row % 2 ? 6 : 0; P.p(x, y, ((x + off) % 12 === 0 || y % 8 === 0) ? Pd[0] : P.tone(Pd, 0.75 - (x - 100 + w) / (w * 2.4) + (hash(x >> 2, y >> 2, 3) % 7 === 0 ? 0.1 : 0), x, y)); } }
  // contrafortes
  for (const s of [-1, 1]) for (let y = 30; y < H_; y++) { const x0 = 100 + s * (58 + Math.round((y - 30) * 0.25)); for (let i = 0; i < 10; i++) P.p(x0 + s * i, y, P.tone(Pd, s < 0 ? 0.7 : 0.35, x0 + i, y)); }
  // janelas de âmbar
  for (const [x, y] of [[70, 22], [130, 22], [100, 8]]) { P.rect(x - 5, y, 10, 16, '#1a1014'); P.rect(x - 4, y + 1, 8, 14, (f % 3) ? '#e8a030' : '#ffd070'); P.rect(x - 4, y + 7, 8, 1, '#7a4a10'); P.rect(x, y + 1, 1, 14, '#7a4a10'); }
  // portão de latão (2 tiles = 32 px) com arco
  P.ball(100, 74, 22, 14, Pd); P.rect(78, 74, 44, 50, Pd[1]);
  if (!aberta) { for (let y = 74; y < H_; y++) for (let x = 82; x < 118; x++) P.p(x, y, (x - 82) % 9 === 0 ? Lt[0] : P.tone(Lt, 0.55 - (x - 82) / 70 + (y % 13 === 0 ? 0.25 : 0), x, y)); P.rect(99, 74, 2, 50, Lt[0]); P.ball(100, 98, 4, 4, ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#fff']); }
  else { P.rect(82, 74, 36, 50, '#0a0810'); for (let i = 0; i < 6; i++) P.rect(84 + i * 6, 118 - i * 7, 30 - i * 6, 2, '#ffd070'); }
  P.ball(100, 74, 18, 10, Lt, { clip: (x, y) => y < 74 });
  // neve nos beirais
  for (let x = 30; x < 170; x++) { if (x % 4) P.p(x, H_ - 1 - (x % 3), '#f2f6fa'); }
  for (let x = 78; x < 122; x++) P.p(x, 60 + Math.round(Math.abs(x - 100) * 0.35), '#f2f6fa');
  return P.outline().canvas(); }); }
// ---------- fundos de batalha ----------
const BG9 = {};
function bgEncosta9() { if (BG9.e) return BG9.e; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 40 ? '#0a0e1c' : y < 80 ? '#101628' : '#16203a');
  for (let i = 0; i < 70; i++) P.p((i * 53) % 240, (i * 17) % 70, i % 7 ? '#c8d8f0' : '#ffffff');
  P.poly([[150, 96], [196, 6], [204, 6], [240, 96]], '#1e2236'); P.rect(197, 0, 6, 8, '#2a2838'); P.rect(198, 1, 4, 4, '#3a3448');   // o morro e o Farol apagado
  for (let i = 0; i < 90; i++) { const x = (i * 29) % 140, y = 84 + (i * 7) % 12; P.p(x, y, i % 4 ? '#e8a030' : '#ffd070'); }      // a cidade lá embaixo
  for (let y = 96; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, ((x * 3 + y * 5) % 17) < 2 ? '#c8d4e2' : (y - 96) % 18 < 2 ? '#b8c4d4' : '#dbe4ee');
  for (let k = 0; k < 6; k++) { const x = 20 + k * 40; P.ball(x, 104, 10, 6, ['#2a2632', '#3e3846', '#544c5c', '#6a6274', '#847c8e']); for (let i = -8; i < 8; i++) P.p(x + i, 99 + Math.abs(i) / 3, '#f2f6fa'); }
  return BG9.e = P.canvas(); }
function bgCrista9() { if (BG9.c) return BG9.c; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) { const d = Math.hypot(x - 60, y - 30); P.p(x, y, y >= 96 ? (((x >> 3) + (y >> 3)) % 2 ? '#5a5664' : '#625e6c') : d < 14 ? '#f2f6fa' : d < 18 ? '#c8d8f0' : d < 60 ? '#141a2e' : '#0c1020'); }
  for (let i = 0; i < 60; i++) P.p((i * 71) % 240, (i * 13) % 90, '#c8d8f0');
  for (const [x, h] of [[30, 50], [100, 70], [170, 44], [214, 60]]) { P.rect(x - 7, 96 - h, 14, h, '#3a3646'); P.rect(x - 9, 96 - h, 18, 4, '#4a4656'); P.rect(x - 9, 96 - h - 1, 18, 1, '#f2f6fa'); }
  for (const x of [64, 138]) { P.rect(x - 2, 70, 4, 26, '#7a5a2a'); P.ball(x, 64, 10, 10, ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#ffffff']); }
  for (let x = 0; x < 240; x++) if (x % 3) P.p(x, 96, '#f2f6fa');
  return BG9.c = P.canvas(); }
function bgFarol9() { if (BG9.f) return BG9.f; const P = new Pix(240, 150), Pd = ramp('#2e2c3a');
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y >= 100 ? ((x >> 4) + (y >> 3)) % 2 ? '#5e5c6a' : '#686674' : '#0a0c18');
  for (let i = 0; i < 50; i++) P.p((i * 61) % 240, (i * 19) % 40, '#c8d8f0');
  for (let y = 0; y < 100; y++) { const w = 40 + Math.round(y * 0.25); for (let x = 70 - w; x < 70 + w; x++) P.p(x, y, ((x + (y >> 3) % 2 * 6) % 12 === 0 || y % 8 === 0) ? Pd[0] : P.tone(Pd, 0.7 - (x - 70 + w) / (w * 2.4), x, y)); }
  for (const [x, y] of [[52, 20], [88, 20], [70, 46]]) { P.rect(x - 6, y, 12, 18, '#1a1014'); P.rect(x - 5, y + 1, 10, 16, '#e8a030'); P.rect(x, y + 1, 1, 16, '#7a4a10'); }
  for (let x = 0; x < 240; x++) if (x % 4) P.p(x, 100, '#f2f6fa');
  return BG9.f = P.canvas(); }
// ---------- inimigos ----------
const INI9 = {};
// SENTINELA DE LATÃO: autômato do Farol, cabeça de lanterna, braço de gancho que estica
function sentinelaArt(f, armando) { const k = 'se' + f + (armando ? 1 : 0); if (INI9[k]) return INI9[k];
  const P = new Pix(44, 62), b = f % 2, Lt = ramp('#a8803a'), Fe = ramp('#5a5a6e'), cx = 20;
  for (const x0 of [cx - 8, cx + 3]) { P.cyl(x0, 42, 6, 16, Fe); P.rect(x0 - 2, 57, 10, 5, Fe[0]); P.ball(x0 + 3, 44, 4, 3, Lt); }
  P.ball(cx, 32 + b, 12, 13, Lt, { amb: 0.25 }); for (let i = 0; i < 6; i++) P.p(cx - 8 + i * 3, 26 + b, Lt[0]); P.rect(cx - 3, 30 + b, 6, 8, '#1a1014'); P.rect(cx - 2, 31 + b, 4, 6, '#ffd070');
  P.cyl(cx - 3, 14 + b, 6, 6, Fe); P.rect(cx - 7, 4 + b, 14, 12, '#1a1418'); for (let x = cx - 6; x < cx + 7; x += 3) P.rect(x, 4 + b, 1, 12, Lt[2]);
  P.ball(cx, 10 + b, 4, 4, armando ? ['#7a1a10', '#c83a18', '#f07a20', '#ffc040', '#fff0a0'] : ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#ffffff']); P.rect(cx - 8, 3 + b, 16, 2, Lt[3]); P.rect(cx - 1, 0 + b, 2, 3, Lt[3]);
  P.line(cx - 11, 26 + b, cx - 16, 44 + b, Fe[2], 3);
  const ax = armando ? cx + 38 : cx + 22, ay = armando ? 30 : 38 + b; P.line(cx + 11, 26 + b, ax - 4, ay, Fe[2], 3); for (let i = 0; i < 3; i++) P.p(cx + 14 + i * ((ax - cx - 14) / 3), 27 + b + i * ((ay - 27) / 3), Lt[3]);
  P.line(ax - 4, ay, ax, ay + 4, Fe[3], 2); P.line(ax, ay + 4, ax - 3, ay + 7, Fe[3], 2);
  return INI9[k] = P.outline().canvas(); }
// GRALHA DO MORRO: pássaro preto de bico laranja; bate as asas carregando neve
function gralhaArt(f) { const k = 'gr' + (f % 4); if (INI9[k]) return INI9[k];
  const P = new Pix(46, 34), Pr = ramp('#2a2638'), a = [0, -6, -10, -4][f % 4];
  P.ball(22, 20, 10, 7, Pr); P.ball(32, 15, 6, 6, Pr); P.poly([[37, 14], [45, 16], [37, 18]], '#e87a20'); P.p(34, 13, '#ffffff'); P.p(34, 14, '#1a1014');
  P.poly([[12, 20], [2, 24], [12, 24]], Pr[1]);
  P.poly([[16, 17], [8 + a / 2, 4 + a], [28, 14]], (x, y) => P.tone(Pr, 0.5 + (y - a) / 40, x, y)); for (let i = 0; i < 4; i++) P.p(12 + i * 3 + a / 3, 9 + a + i * 2, '#f2f6fa');
  P.rect(20, 26, 1, 4, '#e87a20'); P.rect(25, 26, 1, 4, '#e87a20');
  return INI9[k] = P.outline().canvas(); }
// MARIPOSA DE ÂMBAR: filha da Rainha; asas de vidro dourado
function mariposaAArt(f) { const k = 'ma' + (f % 4); if (INI9[k]) return INI9[k];
  const P = new Pix(34, 30), bt = [0, 3, 6, 3][f % 4], Am = ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#fff8e0'];
  for (const s of [-1, 1]) { P.poly([[17, 14], [17 + s * 16, 4 + bt], [17 + s * 14, 18 + bt / 2]], (x, y) => P.tone(Am, 0.55 + ((x * s) % 5 === 0 ? 0.2 : 0) - (y - 4) / 50, x, y)); P.ball(17 + s * 10, 10 + bt / 2, 2, 2, ['#2a1a0a', '#5a3a1a', '#8a5a2a', '#c8a060', '#fff']); }
  P.ball(17, 16, 3, 8, ramp('#6a4a3a')); P.line(16, 8, 13, 3, '#6a4a3a'); P.line(18, 8, 21, 3, '#6a4a3a');
  return INI9[k] = P.outline().canvas(); }
// ---------- chefes ----------
// O ESPANTALHO DO CERCO: o Espantalho do Pedágio (Cap. 1), refeito pela Guarda com os cartazes NOVOS do Acendedor
// ("O FAROL ACENDE · NINGUÉM MORRE NO ESCURO"), quepe da Guarda, um POTE de Pavio no lugar da cabeça (dentro, uma
// chama azul que não esquenta), os braços são duas CANCELAS listradas. Fase 2: o vento arranca os cartazes novos e
// aparece o casaco velho remendado do Cap. 1 e a lanterna do pedágio acesa dentro do pote: ele lembra quem era.
function espantalhoCercoArt(f, pose, fase) { const k = 'ec' + (f % 4) + pose + fase; if (INI9[k]) return INI9[k];
  const W_ = 124, H_ = 150, P = new Pix(W_, H_), cx = 60, sw = Math.round(Math.sin(f * 0.8) * 2), Wd = ramp('#6a4a2a'), Pp = ramp('#d8c8a0'), Az = ramp('#2a3a6a'), Gl = ramp('#b8c8d8');
  const atk = pose === 'atk', carga = pose === 'carga';
  // o poste e a base de pedras com neve
  P.cyl(cx - 3, 30, 7, 116, Wd, false, { grain: 7 }); P.ball(cx, 146, 20, 5, ['#2a2632', '#3e3846', '#544c5c', '#6a6274', '#847c8e']); for (let i = -18; i < 18; i++) P.p(cx + i, 141 + Math.abs(i) / 5, '#f2f6fa');
  // o casaco
  const coat = (x, y) => {
    if (fase >= 2) { const r = hash(x >> 2, y >> 2, 5) % 9; return r < 2 ? '#5a3a2a' : r < 4 ? P.tone(ramp('#7a6a4a'), 0.5, x, y) : P.tone(ramp('#6a5a3a'), 0.65 - (x - cx + 30) / 90, x, y); }
    const cell = ((x >> 3) + (y >> 3) * 3) % 4; return cell === 0 ? P.tone(Az, 0.6 - (x - cx) / 80, x, y) : P.tone(Pp, 0.7 - (x - cx + 30) / 100 + ((x + y) % 7 === 0 ? -0.2 : 0), x, y);
  };
  P.poly([[cx - 22, 40 + sw], [cx + 22, 40 + sw], [cx + 30, 104], [cx + 16, 98], [cx + 8, 108], [cx, 100], [cx - 8, 108], [cx - 18, 98], [cx - 30, 104]], coat);
  if (fase < 2) { // letreiros dos cartazes novos
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) P.p(cx - 16 + i * 3 + (j % 2), 54 + j * 10 + sw, '#2a2228');
    P.rect(cx - 9, 60 + sw, 18, 9, '#f2ecdc'); P.ball(cx, 64 + sw, 3, 3, ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#fff']); // o desenho do Farol no cartaz
    for (let i = 0; i < 5; i++) { const x = cx - 26 + i * 12, y = 100 + (i % 2) * 4; P.poly([[x, y], [x + 4, y + 10 + ((f + i) % 3)], [x + 8, y]], i % 2 ? Pp[2] : Az[2]); }
  } else { // remendos e o laço de palha do Cap. 1
    for (const [x, y] of [[cx - 14, 60], [cx + 8, 74], [cx - 4, 88]]) { P.rect(x, y + sw, 8, 7, '#8a2a2a'); for (let i = 0; i < 8; i += 2) P.p(x + i, y + sw - 1, '#f2ecdc'); }
    for (let i = 0; i < 9; i++) { const x = cx - 28 + i * 7; P.line(x, 102, x + (i % 2 ? 2 : -2), 112 + (i % 3) * 2, RP.palha[(i % 3) + 1]); }
  }
  // os braços: duas cancelas listradas (na carga, ambas erguidas; no golpe, uma desce)
  const braco = (s, ang) => { const x0 = cx + s * 20, y0 = 46 + sw; const L = 52; const x1 = x0 + Math.cos(ang) * L * s, y1 = y0 + Math.sin(ang) * L;
    const n = Math.round(L); for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); P.rect(x - 1, y - 2, 3, 5, ((i >> 3) % 2) ? '#c83a3a' : '#f2ecdc'); }
    P.ball(x1, y1, 3, 3, ramp('#5a5a6e')); P.ball(x0, y0, 4, 4, ramp('#5a5a6e')); };
  braco(-1, carga ? -1.1 : -0.15 + sw * 0.02); braco(1, carga ? -1.2 : atk ? 0.9 : -0.1 - sw * 0.02);
  // a cabeça: um POTE de Pavio, de vidro grosso, com tampa; dentro uma chama (azul fria na fase 1; a lanterna do pedágio, quente, na 2)
  const hy = 22 + sw;
  P.ball(cx, hy, 15, 16, Gl, { amb: 0.35 }); P.ball(cx, hy + 2, 11, 12, fase >= 2 ? ['#5a2a10', '#a8501a', '#e8902a', '#ffd070', '#fff0b0'] : ['#0e1a2a', '#1a3050', '#2a5080', '#6aa0d0', '#c8e8ff'], { amb: 0.2 });
  const fl = [0, 2, 1, 3][f % 4]; P.poly([[cx - 4, hy + 8], [cx, hy - 6 - fl], [cx + 4, hy + 8]], fase >= 2 ? '#ffb040' : '#8ac8f0'); P.p(cx, hy - 2 - fl, fase >= 2 ? '#fff0b0' : '#e8fbff');
  // o rosto riscado no vidro
  P.rect(cx - 8, hy - 3, 4, 2, '#1a1014'); P.rect(cx + 4, hy - 3, 4, 2, '#1a1014'); for (let i = -6; i < 7; i++) P.p(cx + i, hy + 9 + (i % 2), '#1a1014');
  for (let i = 0; i < 4; i++) P.p(cx - 10 + i * 2, hy - 10 + i, '#ffffff');
  // tampa e o quepe da Guarda por cima
  P.rect(cx - 13, hy - 17, 26, 4, '#5a5a6e'); P.rect(cx - 11, hy - 25, 22, 8, Az[2]); P.rect(cx - 14, hy - 18, 28, 2, Az[0]); P.rect(cx - 2, hy - 24, 4, 4, '#c89a30');
  // vento: tiras de cartaz voando (fase 2)
  if (fase >= 2) for (let i = 0; i < 4; i++) { const x = 6 + ((f * 9 + i * 29) % 110), y = 20 + ((i * 41 + f * 5) % 90); P.rect(x, y, 6, 4, i % 2 ? Pp[3] : Az[3]); P.p(x + 1, y + 1, '#2a2228'); }
  if (carga) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; P.p(Math.round(cx + Math.cos(a) * 46), Math.round(30 + Math.sin(a) * 16), i % 2 ? '#c83a3a' : '#f2ecdc'); }
  return INI9[k] = P.outline().canvas(); }
// A RAINHA DO FAROL: a Mariposa-Rainha (Cap. 3) voltou, maior, atraída pela luz do Farol: quatro asas de âmbar com
// "lentes" no lugar dos olhos das asas, coroa de vidro lapidado, gola de pelo branco de geada, antenas plumosas.
// Fase 2: ela BEBE o feixe e fica incandescente (branca e dourada).
function rainhaFarolArt(f, fase, pose) { const k = 'rf' + (f % 6) + fase + pose; if (INI9[k]) return INI9[k];
  const W_ = 140, H_ = 120, P = new Pix(W_, H_), cx = 70, cy = 60, ph = [0, 4, 8, 10, 7, 3][f % 6], inc = fase >= 2;
  const Am = inc ? ['#c88a30', '#f0c060', '#ffe8a0', '#fff6d8', '#ffffff'] : ['#5a3410', '#a8641c', '#e8a030', '#ffd070', '#fff0b8'];
  const Am2 = inc ? ['#a87a40', '#e0b070', '#f8e0a8', '#fff4dc', '#ffffff'] : ['#4a2a10', '#8a5420', '#c8842a', '#f0b850', '#ffe0a0'];
  // asas de baixo e de cima, dos dois lados (batem: ph)
  for (const s of [-1, 1]) {
    P.poly([[cx + s * 6, cy + 4], [cx + s * 54, cy + 30 + ph / 2], [cx + s * 40, cy + 48 + ph / 3], [cx + s * 10, cy + 20]], (x, y) => P.tone(Am2, 0.6 - (y - cy) / 90 + (((x * s) + y) % 9 === 0 ? 0.18 : 0), x, y));
    P.poly([[cx + s * 6, cy - 6], [cx + s * 66, cy - 46 + ph], [cx + s * 62, cy - 6 + ph / 2], [cx + s * 34, cy + 14], [cx + s * 8, cy + 6]], (x, y) => P.tone(Am, 0.75 - Math.abs(x - cx) / 120 + (((x * s) * 3 + y) % 11 === 0 ? 0.15 : 0), x, y));
    // nervuras
    for (let t = 0; t < 4; t++) P.line(cx + s * 8, cy, cx + s * (30 + t * 10), cy - 36 + t * 12 + ph * (1 - t / 4), Am[0]);
    // a "lente" de cada asa: olho de três anéis, lapidado
    const ex = cx + s * 44, ey = cy - 22 + ph * 0.7; P.ball(ex, ey, 9, 8, ['#1a1014', '#3a2a5a', '#5a8ac8', '#a8e0ff', '#ffffff']); P.ball(ex, ey, 5, 5, inc ? ['#c87a20', '#ffd070', '#fff0b0', '#fff', '#fff'] : ['#1a1014', '#6a3a1a', '#e8a030', '#ffd070', '#fff']);
    for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; P.p(Math.round(ex + Math.cos(an) * 10), Math.round(ey + Math.sin(an) * 9), a % 2 ? '#fff0c0' : Am[1]); }
    // franja das asas
    for (let i = 0; i < 9; i++) { const x = cx + s * (20 + i * 5), y = cy - 4 + ph / 2 + i * 0.5 - (i > 6 ? (i - 6) * 3 : 0); P.p(x, y + 2, '#f2f6fa'); }
  }
  // corpo: tórax peludo com gola de geada, abdômen listrado
  P.ball(cx, cy + 18, 9, 20, ramp('#6a4a3a')); for (let i = 0; i < 5; i++) P.rect(cx - 7 + Math.abs(i - 2), cy + 8 + i * 6, 14 - Math.abs(i - 2) * 2, 2, '#3a2418');
  P.ball(cx, cy - 2, 12, 10, ['#8a8a9a', '#b8c0d0', '#dbe4ee', '#f2f6fa', '#ffffff']);
  for (let i = -11; i < 12; i += 2) P.line(cx + i, cy + 4, cx + i * 1.1, cy + 9 + (i % 3), '#f2f6fa');
  // cabeça, olhos compostos e a coroa de vidro
  P.ball(cx, cy - 14, 7, 6, ramp('#5a3a2a')); P.ball(cx - 4, cy - 15, 3, 3, ['#1a1014', '#5a1a1a', '#c83a3a', '#ff8a6a', '#fff']); P.ball(cx + 4, cy - 15, 3, 3, ['#1a1014', '#5a1a1a', '#c83a3a', '#ff8a6a', '#fff']);
  for (let i = 0; i < 5; i++) { const x = cx - 8 + i * 4, hh = i === 2 ? 12 : 7 + (i % 2) * 2; P.poly([[x - 2, cy - 19], [x, cy - 19 - hh], [x + 2, cy - 19]], i % 2 ? '#c8e8ff' : '#f2f6fa'); P.p(x, cy - 17 - hh, '#ffffff'); }
  // antenas plumosas
  for (const s of [-1, 1]) { P.line(cx + s * 3, cy - 20, cx + s * 18, cy - 40, '#6a4a3a'); for (let i = 0; i < 7; i++) { const x = cx + s * (5 + i * 2), y = cy - 22 - i * 3; P.p(x - s, y - 1, '#c8a080'); P.p(x + s, y + 1, '#c8a080'); } }
  if (inc) for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + f * 0.2; P.p(Math.round(cx + Math.cos(a) * (64 + (i % 3) * 3)), Math.round(cy + Math.sin(a) * (50 + (i % 2) * 4)), '#fff0c0'); }
  if (pose === 'carga') for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.p(Math.round(cx + Math.cos(a) * 20), Math.round(cy - 2 + Math.sin(a) * 14), '#ffffff'); }
  return INI9[k] = P.outline().canvas(); }
// O FAROLEIRO: o guardião do Farol de Cem Invernos. Um autômato de latão do tamanho de uma casa, construído em volta
// do último faroleiro de verdade (há cem anos). No peito, a LENTE de Fresnel (anéis), que LÊ quem olha. Quepe velho de
// faroleiro, sobretudo de placas rebitadas, um braço é uma MANIVELA gigante, o outro um GANCHO de lanterna. Pés em
// engrenagens. Fase 2: a lente gira e solta raios. Fase 3: a lente racha: por trás dela, a silhueta de um velho
// sentado, de cachimbo, esperando alguém dizer que ele pode parar.
function faroleiroArt(f, pose, fase) { const k = 'fa' + (f % 8) + pose + fase; if (INI9[k]) return INI9[k];
  const W_ = 156, H_ = 156, P = new Pix(W_, H_), cx = 74, b = Math.round(Math.sin(f * 0.5) * 1.5), Lt = ramp('#a8803a'), Lt2 = ramp('#8a6a30'), Fe = ramp('#6a6a80'), Co = ramp('#4a5a7a');
  const atk = pose === 'atk', carga = pose === 'carga';
  // pés de engrenagem
  for (const x0 of [cx - 30, cx + 18]) { P.ball(x0 + 6, 146, 14, 9, Fe); for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2 + f * 0.1; P.rect(Math.round(x0 + 6 + Math.cos(an) * 15) - 1, Math.round(146 + Math.sin(an) * 9) - 1, 3, 3, Fe[1]); } P.ball(x0 + 6, 146, 4, 3, Lt); }
  // pernas (pistões)
  for (const x0 of [cx - 28, cx + 20]) { P.cyl(x0, 106, 10, 34, Fe); P.cyl(x0 + 2, 112, 6, 24, Lt2); }
  // sobretudo de placas rebitadas, em sino
  P.poly([[cx - 36, 40 + b], [cx + 36, 40 + b], [cx + 46, 116], [cx - 46, 116]], (x, y) => { const pl = ((x >> 3) + ((y >> 4) % 2) * 4) % 8; return (pl === 0 || (y - 40) % 16 === 0) ? Co[0] : P.tone(Co, 0.75 - (x - cx + 46) / 120 + ((x * 7 + y * 3) % 23 === 0 ? 0.2 : 0), x, y); });
  for (let y = 48; y < 116; y += 16) for (let x = cx - 40; x < cx + 42; x += 8) if (x > cx - 36 - (y - 40) * 0.13 && x < cx + 36 + (y - 40) * 0.13) P.p(x, y + 1 + b, Lt[3]);
  P.rect(cx - 46, 112, 92, 4, Lt[1]);
  // a LENTE no peito (anéis de Fresnel)
  const ly = 70 + b, lr = 22, lc = fase >= 3 ? ['#2a1a10', '#5a3a1a', '#8a6030', '#c89850', '#f0d090'] : ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#ffffff'];
  P.ball(cx, ly, lr + 4, lr + 4, Lt, { amb: 0.3 }); P.ball(cx, ly, lr, lr, lc, { amb: 0.35 + (carga ? 0.25 : 0) });
  for (let r = 5; r < lr; r += 4) for (let a = 0; a < 48; a++) { const an = a / 48 * Math.PI * 2 + (fase >= 2 ? f * 0.15 : 0); if (a % 3) P.p(Math.round(cx + Math.cos(an) * r), Math.round(ly + Math.sin(an) * r), fase >= 3 ? '#3a2a1a' : '#fff0c0'); }
  if (fase >= 2 && fase < 3) for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + f * 0.15; P.line(cx + Math.cos(an) * (lr + 6), ly + Math.sin(an) * (lr + 6), cx + Math.cos(an) * (lr + 16), ly + Math.sin(an) * (lr + 16), '#ffe090'); }
  if (fase >= 3) { // rachada: por trás, o velho sentado, de cachimbo
    P.line(cx - 18, ly - 10, cx + 4, ly + 2, '#1a1014'); P.line(cx + 4, ly + 2, cx + 16, ly - 14, '#1a1014'); P.line(cx + 4, ly + 2, cx + 2, ly + 20, '#1a1014');
    P.ball(cx - 2, ly - 4, 4, 4, ['#1a1014', '#2a1a14', '#3a2a1a', '#4a3a2a', '#5a4a3a']); P.rect(cx - 6, ly, 9, 10, '#2a1a14'); P.line(cx + 2, ly - 3, cx + 7, ly - 1, '#2a1a14'); P.p(cx + 8, ly - 3, '#ffb040'); P.p(cx + 8, ly - 5, '#c8c8c8');
  }
  // ombreiras e braços
  for (const s of [-1, 1]) P.ball(cx + s * 34, 44 + b, 11, 9, Lt);
  // braço esquerdo: o GANCHO de lanterna (com uma lanterninha pendurada)
  const gx = atk ? cx - 66 : cx - 52, gy = atk ? 96 : 84 + b;
  P.line(cx - 36, 48 + b, gx, gy - 14, Fe[2], 7); P.line(gx, gy - 14, gx - 4, gy, Fe[3], 3); P.line(gx - 4, gy, gx + 2, gy + 6, Fe[3], 3);
  P.rect(gx - 6, gy + 6, 10, 12, '#1a1418'); P.rect(gx - 5, gy + 7, 8, 10, (f % 2) ? '#ffd070' : '#ffb040'); P.rect(gx - 7, gy + 5, 12, 2, Lt[2]);
  // braço direito: a MANIVELA gigante (na carga, girando para trás)
  const ang = carga ? -1.9 + (f % 4) * 0.25 : atk ? 0.7 : -0.4 + Math.sin(f * 0.4) * 0.15, mx = cx + 40 + Math.cos(ang) * 26, my = 48 + b + Math.sin(ang) * 26;
  P.line(cx + 36, 48 + b, mx, my, Fe[2], 7); P.line(mx, my, mx + Math.cos(ang + 1.57) * 22, my + Math.sin(ang + 1.57) * 22, Lt[2], 5);
  P.ball(mx + Math.cos(ang + 1.57) * 24, my + Math.sin(ang + 1.57) * 24, 5, 5, Lt);
  // cabeça: elmo-farolete com o quepe do faroleiro
  P.ball(cx, 26 + b, 15, 14, Fe, { amb: 0.25 }); P.rect(cx - 10, 22 + b, 20, 6, '#1a1014'); P.rect(cx - 8, 23 + b, 6, 4, carga ? '#ff6a3a' : '#ffd070'); P.rect(cx + 2, 23 + b, 6, 4, carga ? '#ff6a3a' : '#ffd070');
  P.rect(cx - 16, 10 + b, 32, 4, '#1a1a2a'); P.rect(cx - 12, 2 + b, 24, 9, '#22223a'); P.rect(cx - 12, 2 + b, 24, 2, '#3a3a5a'); P.rect(cx - 3, 4 + b, 6, 5, Lt[3]); P.p(cx, 6 + b, '#2a2a4a');
  // barba de geada (era a barba do faroleiro)
  for (let i = -10; i < 11; i += 2) P.line(cx + i, 32 + b, cx + i * 0.8, 38 + b + (i % 4 === 0 ? 3 : 0), '#e6edf4');
  if (carga) for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2; P.p(Math.round(cx + Math.cos(an) * (lr + 10)), Math.round(ly + Math.sin(an) * (lr + 10)), '#fff0c0'); }
  return INI9[k] = P.outline().canvas(); }
// o Espantalho no mapa (tamanho de mapa: um poste de ~3,5 m)
function espantalhoMapaArt(f) { return o9('em' + (f % 2), () => { const P = new Pix(40, 64), Wd = ramp('#6a4a2a'), Pp = ramp('#d8c8a0'), Az = ramp('#2a3a6a'), sw = f % 2;
  P.cyl(18, 14, 4, 50, Wd); P.ball(20, 62, 8, 2, ['#2a2632', '#3e3846', '#544c5c', '#6a6274', '#847c8e']);
  P.poly([[10, 20 + sw], [30, 20 + sw], [33, 46], [26, 43], [20, 48], [14, 43], [7, 46]], (x, y) => ((x >> 2) + (y >> 2)) % 3 === 0 ? Az[2] : P.tone(Pp, 0.7 - (x - 7) / 40, x, y));
  for (let i = 0; i < 18; i++) { P.rect(1 + i, 22 + sw, 1, 2, (i >> 2) % 2 ? '#c83a3a' : '#f2ecdc'); P.rect(21 + i, 22 + sw, 1, 2, (i >> 2) % 2 ? '#c83a3a' : '#f2ecdc'); }
  P.ball(20, 12 + sw, 7, 8, ramp('#b8c8d8'), { amb: 0.35 }); P.ball(20, 13 + sw, 5, 5, ['#0e1a2a', '#1a3050', '#2a5080', '#6aa0d0', '#c8e8ff']); P.p(20, 11 + sw, '#c8e8ff');
  P.rect(15, 3 + sw, 10, 4, Az[2]); P.rect(13, 6 + sw, 14, 1, Az[0]); P.rect(19, 4 + sw, 2, 2, '#c89a30');
  return P.outline().canvas(); }); }
