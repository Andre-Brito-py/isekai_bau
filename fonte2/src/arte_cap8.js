// ================= ARTE DO CAP. 8 — O INVERNO ESCURO =================
// Gelo, braseiros (apagado/aceso, chama animada), velas, neve caindo, as Cisternas e o Coração Frio; inimigos (Friagem,
// Apagador, Lobo de Fuligem, Geada Viva); o mini-chefe CAPITÃO APAGADOR e a chefe A FRIAGEM (artes grandes, com pose de
// fase, de golpe e de golpe preparado), e as formas evoluídas da LUME (Lareira e Alvorada: lustre de noite e adereço
// de dia). Pedido do usuário: "caprichar na arte dos boss, todos merecem atenção especial".
const KEY8 = Object.assign({}, KEY7, { 'i': { t: 'gelo8' } });
{ const _ta9 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'gelo8' && k !== 'molhado8') return _ta9(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y, s = 5) => hash(x + v * 13, y + v * 29, s) % 100;
  if (k === 'gelo8') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x >> 1, y >> 1, 7); P.p(x, y, r < 12 ? '#9ad0e8' : r < 60 ? '#b8e4f4' : '#c8ecf8'); } P.line(2 + v % 5, 3, 9 + v % 4, 11, '#e8fbff'); P.p(12, 4, '#ffffff'); if (v % 3 === 0) P.line(10, 12, 14, 9, '#8ac0d8'); }
  else { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = h(x, y, 3); P.p(x, y, r < 20 ? '#3a4a58' : r < 70 ? '#4a5866' : '#566470'); } P.rect(3 + v % 6, 6, 5, 3, '#6a8aa0'); P.p(4 + v % 6, 6, '#a8d0e8'); }
  return TILE2[key] = P.canvas();
}; }
const OBJ8 = {};
const o8 = (k, f) => OBJ8[k] || (OBJ8[k] = f());
// braseiro: tripé de ferro com cuba; aceso, a chama em 4 quadros
function braseiroArt(aceso, f = 0) { return o8('br' + (aceso ? 1 : 0) + (aceso ? f % 4 : 0), () => {
  const P = new Pix(22, 34), Fe = ramp('#4a4450');
  P.line(4, 33, 9, 18, Fe[1], 2); P.line(18, 33, 13, 18, Fe[1], 2); P.line(11, 33, 11, 20, Fe[2], 1);
  P.ball(11, 17, 9, 4, Fe); P.rect(2, 15, 19, 2, Fe[3]);
  if (aceso) {
    const fh = [10, 12, 9, 11][f % 4], sw = [0, 1, -1, 0][f % 4];
    P.rect(4, 13, 14, 3, '#c83a1a');
    P.poly([[4, 15], [11 + sw, 15 - fh - 4], [18, 15]], '#e86a20'); P.poly([[7, 15], [11 + sw, 15 - fh], [15, 15]], '#ffb040'); P.poly([[9, 15], [11 + sw, 15 - fh + 4], [13, 15]], '#fff0a0');
    for (let i = 0; i < 3; i++) P.p(6 + i * 5 + (f + i) % 2, 15 - fh - 6 - (f + i) % 3, '#ffd070');
  } else { P.rect(5, 13, 12, 3, '#2a2228'); P.p(8, 13, '#5a5060'); P.p(13, 14, '#5a5060'); for (let i = 0; i < 3; i++) P.p(7 + i * 4, 10 - i, '#8a8a96'); }
  return P.outline().canvas(); }); }
function velaChaoArt(f) { return o8('vc' + (f % 3), () => { const P = new Pix(8, 14); P.rect(2, 6, 4, 8, '#f2ecdc'); P.rect(2, 6, 1, 8, '#d8d0c0'); P.p(4, 5, '#2a2228'); P.poly([[2, 5], [4, [0, 1, 2][f % 3]], [6, 5]], '#ffb040'); P.p(4, 3, '#fff0a0'); return P.outline().canvas(); }); }
function gradeArt(aberta) { return o8('gr' + (aberta ? 1 : 0), () => { const P = new Pix(32, 40); if (aberta) { for (let x = 1; x < 32; x += 5) P.rect(x, 0, 2, 6, '#4a4450'); P.rect(0, 0, 32, 2, '#6a6470'); } else { for (let x = 1; x < 32; x += 5) P.rect(x, 0, 2, 40, '#4a4450'); P.rect(0, 0, 32, 3, '#6a6470'); P.rect(0, 18, 32, 2, '#6a6470'); P.rect(14, 22, 4, 6, '#c89a30'); } return P.outline().canvas(); }); }
function comportaArt(aberta) { return o8('cp' + (aberta ? 1 : 0), () => { const P = new Pix(20, 40), Fe = ramp('#5a6a7a'); if (aberta) { P.rect(0, 0, 20, 6, Fe[1]); } else { P.rect(0, 0, 20, 40, Fe[1]); for (let y = 2; y < 40; y += 6) P.rect(0, y, 20, 1, Fe[0]); P.ball(10, 20, 5, 5, ramp('#8a6a30')); for (let x = 2; x < 20; x += 4) P.p(x, 36, '#e8fbff'); } return P.outline().canvas(); }); }
function caroçoGeloArt() { return o8('cg', () => { const P = new Pix(18, 22); P.poly([[2, 21], [5, 4], [9, 0], [13, 6], [16, 21]], (x, y) => (x + y) % 5 === 0 ? '#e8fbff' : y < 10 ? '#b8e4f4' : '#8ac0d8'); return P.outline().canvas(); }); }
// neve caindo sobre o mundo (Cap. 8)
function neveFx(ox, oy, t, forte) {
  bx.fillStyle = '#ffffff';
  for (let i = 0; i < (forte ? 90 : 45); i++) { const sx = ((i * 97 + t * (0.3 + (i % 3) * 0.15) + Math.sin(t / 40 + i) * 12) % (W + 20)) - 10, sy = ((i * 61 + t * (0.6 + (i % 4) * 0.2)) % (H + 20)) - 10; bx.globalAlpha = 0.45 + (i % 3) * 0.15; bx.fillRect(Math.round(sx), Math.round(sy), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1); }
  bx.globalAlpha = 1;
}
// ---------- fundos ----------
const BG8 = {};
function bgAurenEscura() { if (BG8.a) return BG8.a; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? (y < 30 ? '#06080e' : '#0c1018') : ((x >> 3) + (y >> 3)) % 2 ? '#2a2e38' : '#262a34');
  for (let k = 0; k < 7; k++) { const x0 = k * 36 - 6, hh = 40 + (k * 13) % 22; P.rect(x0, 96 - hh, 32, hh, '#141820'); P.poly([[x0 - 2, 96 - hh], [x0 + 16, 96 - hh - 12], [x0 + 34, 96 - hh]], '#10141c'); for (let j = 0; j < 3; j++) P.rect(x0 + 5 + j * 9, 96 - hh + 10, 5, 6, (k + j) % 4 === 0 ? '#ffb040' : '#1a1e28'); }
  for (let i = 0; i < 80; i++) P.p((i * 53) % 240, (i * 29) % 140, '#e8f0ff');
  return BG8.a = P.canvas(); }
function bgCisternas() { if (BG8.c) return BG8.c; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((hash(x >> 3, y >> 3, 4) % 5 === 0) ? '#1a2430' : '#141c26') : y < 110 ? '#2a4a5a' : ((x + y) % 9 < 4 ? '#8ac0d8' : '#b8e4f4'));
  for (const x of [20, 80, 140, 200]) { P.rect(x - 8, 0, 16, 96, '#1e2a36'); for (let y = 0; y < 96; y += 12) P.rect(x - 8, y, 16, 1, '#141c26'); P.poly([[x - 8, 70], [x - 4, 96], [x, 78], [x + 4, 96], [x + 8, 70]], '#b8e4f4'); }
  return BG8.c = P.canvas(); }
function bgCoracaoFrio() { if (BG8.f) return BG8.f; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) { const d = Math.hypot(x - 120, (y - 50) * 1.4); P.p(x, y, y >= 96 ? ((x + y) % 7 < 3 ? '#c8ecf8' : '#a8d8ec') : d < 50 ? '#0a1420' : d < 90 ? '#101c2a' : '#18283a'); }
  for (let i = 0; i < 18; i++) { const x = i * 14 + 4, h = 18 + (i * 7) % 26; P.poly([[x, 0], [x + 6, 0], [x + 3, h]], i % 2 ? '#b8e4f4' : '#8ac0d8'); }
  for (let i = 0; i < 40; i++) P.p((i * 71) % 240, 20 + (i * 23) % 70, '#e8fbff');
  return BG8.f = P.canvas(); }
// ---------- inimigos ----------
const INI8 = {};
function friagemArt(f) { const k = 'fg' + f; if (INI8[k]) return INI8[k]; const P = new Pix(34, 44), b = f % 2;
  P.poly([[17, 2 + b], [30, 20], [28, 42], [22, 36], [17, 43], [12, 36], [6, 42], [4, 20]], (x, y) => (x + y * 2) % 7 === 0 ? '#3a4a6a' : y < 14 ? '#2a3450' : '#1e2640');
  P.rect(11, 13 + b, 4, 3, '#bff0ff'); P.rect(19, 13 + b, 4, 3, '#bff0ff'); P.p(12, 14 + b, '#ffffff'); P.p(20, 14 + b, '#ffffff');
  for (let i = 0; i < 5; i++) P.p(8 + i * 4, 24 + (i + f) % 3, '#e8fbff');
  return INI8[k] = P.outline().canvas(); }
function apagadorArt(f, armando) { const k = 'ap' + f + (armando ? 1 : 0); if (INI8[k]) return INI8[k]; const P = new Pix(40, 58), b = f % 2, Az = ramp('#2a3a6a');
  P.rect(13, 42, 5, 16, '#1a1a2a'); P.rect(21, 42, 5, 16, '#1a1a2a');
  P.cyl(11, 20 + b, 18, 24, Az); P.rect(11, 32 + b, 18, 2, '#c89a30');
  P.ball(20, 12 + b, 6, 6, ramp('#c8906a')); P.rect(13, 3 + b, 14, 6, '#1a1a2a'); P.rect(12, 8 + b, 16, 2, '#2a2a3a');
  P.rect(16, 12 + b, 2, 2, '#1a1418'); P.rect(22, 12 + b, 2, 2, '#1a1418');
  // o apagador de velas numa vara comprida
  const ty = armando ? 0 : 8; P.line(30, 50, 34, ty + 6, '#5a3a20', 2); P.poly([[29, ty + 6], [39, ty + 6], [34, ty - 2]], '#6a6a7a'); P.rect(29, ty + 6, 11, 2, '#8a8a96');
  return INI8[k] = P.outline().canvas(); }
function loboFuligemArt(f) { const k = 'lf' + f; if (INI8[k]) return INI8[k]; const P = new Pix(50, 36), b = f % 2;
  P.cyl(8, 12 + b, 30, 14, ['#0a0a10', '#1a1a24', '#2a2a36', '#3a3a48', '#4a4a5a'], true);
  P.ball(41, 12 + b, 8, 7, ['#0a0a10', '#1a1a24', '#2a2a36', '#3a3a48', '#4a4a5a']); P.poly([[44, 14 + b], [50, 17 + b], [44, 19 + b]], '#1a1a24');
  P.poly([[37, 6 + b], [39, 0 + b], [41, 6 + b]], '#2a2a36'); P.poly([[42, 6 + b], [45, 0 + b], [46, 7 + b]], '#2a2a36');
  P.rect(43, 10 + b, 2, 2, '#ff6a3a'); P.p(44, 10 + b, '#ffd070');
  for (const x of [11, 18, 30, 36]) P.rect(x, 24, 3, 11 - ((x / 3 + f) % 2), '#1a1a24');
  for (let i = 0; i < 6; i++) P.p(4 - (i % 3) * 2 + b, 10 + i * 2, i % 2 ? '#3a3a48' : '#5a5a6a');                 // a fumaça do rabo
  return INI8[k] = P.outline().canvas(); }
function geadaVivaArt(f) { const k = 'gv' + f; if (INI8[k]) return INI8[k]; const P = new Pix(36, 46), b = f % 2;
  for (let a = 0; a < 6; a++) { const an = a / 6 * Math.PI * 2 + f * 0.15, x1 = 18 + Math.cos(an) * 15, y1 = 22 + Math.sin(an) * 15; P.line(18, 22 + b, x1, y1 + b, '#b8e4f4', 2); P.line(x1, y1 + b, x1 + Math.cos(an + 0.8) * 4, y1 + b + Math.sin(an + 0.8) * 4, '#e8fbff'); P.line(x1, y1 + b, x1 + Math.cos(an - 0.8) * 4, y1 + b + Math.sin(an - 0.8) * 4, '#e8fbff'); }
  P.ball(18, 22 + b, 7, 7, ['#4a7a9a', '#8ac0d8', '#b8e4f4', '#e8fbff', '#ffffff']); P.rect(15, 20 + b, 2, 2, '#1a2a3a'); P.rect(20, 20 + b, 2, 2, '#1a2a3a');
  return INI8[k] = P.outline().canvas(); }
// O CAPITÃO APAGADOR: capitão da Guarda dos Apagões. Capacete-gaiola de lanterna (vazia), sobretudo de fuligem com
// galões, o GRANDE APAGADOR (um cone de latão do tamanho de um sino numa haste de lança), um cinto de pavios
// arrancados como troféus. Poses: idle (2), 'atk' (a haste baixa), 'carga' (o cone erguido sobre a cabeça, sugando a
// luz), fase 2 (o sobretudo pegou fogo nas pontas; a gaiola do capacete acende sozinha: ele odeia isso).
function capitaoArt(f, pose, fase) { const k = 'cap' + f + pose + fase; if (INI8[k]) return INI8[k];
  const W_ = 84, H_ = 112, P = new Pix(W_, H_), b = f % 2, cx = 38, Sb = ramp('#2a2430'), Az = ramp('#2a3a6a'), Lt = ramp('#c89a30'), Pl = ramp('#b8805a');
  const atk = pose === 'atk', carga = pose === 'carga';
  // pernas e botas
  for (const [x0, dx] of [[cx - 12, 0], [cx + 3, 0]]) { P.cyl(x0, 70, 10, 30, ['#0a0a12', '#1a1a24', '#24242e', '#30303c', '#3a3a48']); P.rect(x0 - 2, 98, 14, 10, '#1a1210'); P.rect(x0 - 2, 98, 14, 2, '#3a2a20'); P.rect(x0 + 2, 104, 2, 4, Lt[2]); }
  // sobretudo de fuligem, comprido, aberto em baixo
  P.poly([[cx - 18, 34 + b], [cx + 18, 34 + b], [cx + 26, 96], [cx + 8, 90], [cx, 98], [cx - 8, 90], [cx - 26, 96]], (x, y) => P.tone(Sb, 0.6 - (x - cx + 26) / 90 + ((x * 3 + y) % 11 === 0 ? 0.25 : 0) - (y > 88 ? 0.2 : 0), x, y));
  if (fase >= 2) for (let i = 0; i < 9; i++) { const x = cx - 24 + i * 6, y = 92 + (i % 2) * 3; P.poly([[x - 2, y], [x + 1, y - 6 - (f + i) % 3], [x + 3, y]], (i % 2) ? '#ff8a30' : '#ffd070'); }
  // casaca azul por dentro, galões e botões
  P.poly([[cx - 8, 36 + b], [cx + 8, 36 + b], [cx + 6, 70 + b], [cx - 6, 70 + b]], (x, y) => P.tone(Az, 0.7 - (x - cx + 8) / 30, x, y));
  for (let i = 0; i < 5; i++) { P.p(cx - 3, 40 + i * 6 + b, Lt[4]); P.p(cx + 3, 40 + i * 6 + b, Lt[4]); }
  for (const s of [-1, 1]) { P.rect(cx + s * 17 - 6, 33 + b, 12, 4, Lt[3]); for (let i = 0; i < 5; i++) P.p(cx + s * 17 - 5 + i * 2, 37 + b, Lt[2]); }
  // cinto de pavios arrancados (troféus)
  P.rect(cx - 16, 62 + b, 32, 4, '#3a2418'); P.rect(cx - 2, 62 + b, 4, 4, Lt[3]);
  for (let i = 0; i < 7; i++) { const x = cx - 14 + i * 4; P.rect(x, 66 + b, 2, 8 + (i % 3) * 2, '#f2ecdc'); P.p(x, 66 + b, '#2a2228'); }
  // braço esquerdo com a lanterna-gaiola presa ao punho (vazia)
  P.line(cx - 17, 38 + b, cx - 24, 58 + b, Sb[2], 6); P.ball(cx - 25, 60 + b, 4, 4, Pl);
  P.rect(cx - 30, 62 + b, 10, 12, '#1a1418'); for (let x = cx - 30; x < cx - 20; x += 3) P.rect(x, 62 + b, 1, 12, '#6a6470'); P.rect(cx - 31, 61 + b, 12, 2, Lt[2]);
  // cabeça: rosto duro, bigode, cicatriz; capacete-gaiola
  P.ball(cx, 22 + b, 9, 10, Pl); P.rect(cx - 6, 26 + b, 12, 2, '#3a2a20'); P.rect(cx - 5, 20 + b, 3, 2, '#1a1418'); P.rect(cx + 3, 20 + b, 3, 2, '#1a1418'); P.line(cx + 4, 16 + b, cx + 7, 25 + b, '#8a5a40');
  P.rect(cx - 10, 6 + b, 20, 12, '#1a1418');
  for (let x = cx - 9; x < cx + 10; x += 3) P.rect(x, 6 + b, 1, 12, '#6a6470');
  P.rect(cx - 11, 5 + b, 22, 2, Lt[3]); P.rect(cx - 11, 16 + b, 22, 2, Lt[2]); P.rect(cx - 2, 0 + b, 4, 5, Lt[3]);
  if (fase >= 2) P.ball(cx, 11 + b, 4, 4, ['#a83a1a', '#ff8a30', '#ffd070', '#fff0a0', '#ffffff']);                   // a gaiola acende sozinha
  // braço direito e o GRANDE APAGADOR
  let hx, hy, tx, ty;
  if (carga) { hx = cx + 14; hy = 18 + b; tx = cx + 6; ty = -2; } else if (atk) { hx = cx + 26; hy = 50 + b; tx = cx + 44; ty = 66; } else { hx = cx + 22; hy = 46 + b; tx = cx + 34; ty = 12; }
  P.line(cx + 17, 38 + b, hx, hy, Sb[2], 6); P.ball(hx, hy, 4, 4, Pl);
  const bx0 = hx + (tx - hx) * 1.0, by0 = hy + (ty - hy) * 1.0;
  P.line(hx - (tx - hx) * 0.4, hy - (ty - hy) * 0.4, bx0, by0, '#5a3a20', 3);
  // o cone (sino) na ponta
  const ang = Math.atan2(ty - hy, tx - hx), ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca;
  const tip = [bx0, by0], base0 = [bx0 + ca * 20 + nx * 12, by0 + sa * 20 + ny * 12], base1 = [bx0 + ca * 20 - nx * 12, by0 + sa * 20 - ny * 12];
  P.poly([tip, base0, base1], (x, y) => P.tone(Lt, 0.5 + ((x - bx0) * ca + (y - by0) * sa) / 50 + ((x + y) % 5 === 0 ? 0.15 : 0), x, y));
  P.line(base0[0], base0[1], base1[0], base1[1], Lt[4], 2);
  if (carga) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; P.p(Math.round(bx0 + ca * 20 + Math.cos(a) * 16), Math.round(by0 + sa * 20 + Math.sin(a) * 9), i % 2 ? '#ffd070' : '#ff8a30'); }
  return INI8[k] = P.outline().canvas(); }
// A FRIAGEM: o frio que voltou do Inverno Escuro. Um manto de neve do tamanho de uma casa, com o capuz cheio de
// pingentes, mãos compridas de gelo (6 dedos), rostos congelados na barra do manto (os que o Inverno levou), e no
// peito uma GAIOLA DE LANTERNA vazia, com uma fita de cabelo presa na grade. Fase 1: manto inteiro. Fase 2: o manto
// racha e mostra a gaiola. Fase 3: a gaiola abre e dentro há só escuro (fogo e luz pegam em cheio).
function friagemBossArt(f, fase, pose) { const k = 'fb' + f + fase + pose; if (INI8[k]) return INI8[k];
  const W_ = 150, H_ = 148, P = new Pix(W_, H_), cx = 75, b = Math.round(Math.sin(f * 0.7) * 2);
  const Mn = ['#2a3a50', '#5a7a9a', '#8ab0c8', '#c8e4f0', '#f4fcff'], Gl = ['#3a6a8a', '#6aa8c8', '#9ad0e8', '#c8ecf8', '#ffffff'];
  const carga = pose === 'carga', atk = pose === 'atk';
  // o manto (um sino de neve com a barra rasgada)
  P.poly([[cx - 22, 30 + b], [cx + 22, 30 + b], [cx + 62, 140], [cx + 44, 132], [cx + 34, 144], [cx + 18, 134], [cx, 146], [cx - 18, 134], [cx - 34, 144], [cx - 44, 132], [cx - 62, 140]],
    (x, y) => P.tone(Mn, 0.78 - Math.abs(x - cx) / 110 - (y - 30) / 360 + ((x * 7 + y * 3) % 23 === 0 ? 0.18 : 0) + (((x - cx) % 14 === 0) && y > 60 ? -0.25 : 0), x, y));
  // rostos congelados na barra do manto
  for (let i = 0; i < 5; i++) { const fx = cx - 40 + i * 20, fy = 116 + (i % 2) * 6; P.ball(fx, fy, 5, 6, ['#4a6a8a', '#7a9ab8', '#9ab8d0', '#b8d0e4', '#d8e8f4']); P.p(fx - 2, fy - 1, '#2a3a50'); P.p(fx + 2, fy - 1, '#2a3a50'); P.rect(fx - 1, fy + 2, 3, 1, '#2a3a50'); }
  // o capuz com pingentes
  P.ball(cx, 26 + b, 24, 22, Mn, { amb: 0.35 });
  P.ball(cx, 30 + b, 15, 14, ['#02040a', '#06101a', '#0a1824', '#0e1e2c', '#122434']);
  for (let i = 0; i < 9; i++) { const x = cx - 22 + i * 5.5, hh = 6 + (i * 5) % 9; P.poly([[x - 2, 44 + b], [x + 2, 44 + b], [x, 44 + b + hh]], i % 2 ? Gl[2] : Gl[3]); }
  // os olhos: dois pontos de geada no escuro do capuz
  const oc = carga ? '#ffffff' : '#bff0ff';
  P.rect(cx - 8, 28 + b, 4, 3, oc); P.rect(cx + 4, 28 + b, 4, 3, oc); if (carga) { P.rect(cx - 9, 27 + b, 6, 1, '#e8fbff'); P.rect(cx + 3, 27 + b, 6, 1, '#e8fbff'); }
  // a gaiola no peito (aparece a partir da fase 2)
  if (fase >= 2) {
    P.poly([[cx - 16, 58 + b], [cx + 16, 58 + b], [cx + 20, 100 + b], [cx - 20, 100 + b]], '#0a1018');
    P.rect(cx - 12, 62 + b, 24, 32, '#1a1418'); for (let x = cx - 11; x < cx + 12; x += 4) P.rect(x, 62 + b, 1, fase >= 3 ? 6 : 32, '#8a8a96');
    P.rect(cx - 13, 61 + b, 26, 2, '#c89a30'); P.rect(cx - 13, 93 + b, 26, 2, '#c89a30'); P.rect(cx - 2, 56 + b, 4, 6, '#c89a30');
    P.rect(cx + 5, 70 + b, 4, 2, '#e86a8a'); P.p(cx + 6, 72 + b, '#e86a8a'); P.p(cx + 8, 73 + b, '#c84a6a');                     // a fita de cabelo presa na grade
    if (fase >= 3) for (let i = 0; i < 10; i++) P.p(cx - 9 + (i * 7) % 18, 66 + b + (i * 5) % 24, '#04060a');
    P.line(cx - 24, 52 + b, cx - 10, 70 + b, Gl[0]); P.line(cx + 26, 56 + b, cx + 14, 74 + b, Gl[0]);
  }
  // braços compridos de gelo, mãos de seis dedos
  for (const s of [-1, 1]) {
    const up = carga ? -36 : atk && s > 0 ? 18 : 0, ex = cx + s * 50, ey = 62 + b + up * (s > 0 || carga ? 1 : 0);
    P.line(cx + s * 18, 44 + b, cx + s * 34, 56 + b + up / 2, Mn[2], 7); P.line(cx + s * 34, 56 + b + up / 2, ex, ey, Gl[2], 5);
    for (let d = 0; d < 6; d++) { const a = (s > 0 ? -0.9 : Math.PI + 0.9) + (d - 2.5) * 0.28 * s + (carga ? -s * 0.8 : 0); P.line(ex, ey, ex + Math.cos(a) * 12, ey + Math.sin(a) * 12, Gl[3]); P.p(Math.round(ex + Math.cos(a) * 13), Math.round(ey + Math.sin(a) * 13), '#ffffff'); }
  }
  if (carga) for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; P.p(Math.round(cx + Math.cos(a) * 58), Math.round(30 + Math.sin(a) * 22), '#e8fbff'); }
  // pingentes caindo do manto
  for (let i = 0; i < 6; i++) P.p(cx - 50 + i * 20, 80 + ((f * 3 + i * 7) % 40), '#e8fbff');
  return INI8[k] = P.outline().canvas(); }
// ---------- a LUME evoluída ----------
// de noite, o lustre novo (no lugar do lustre do jogo 1); de dia, um adereço sobre a moça
function rostoLume(P, cx, cy, f) {      // o rostinho do lustre do jogo 1: olhos grandes com brilho, pálpebra, bochecha rosada
  const pisca = f % 16 === 15;
  for (const s of [-1, 1]) { const ex = cx + s * 3 + (s > 0 ? 0 : -1);
    if (pisca) { P.rect(ex - 1, cy + 1, 3, 1, '#2a1418'); continue; }
    P.rect(ex - 1, cy - 1, 3, 1, '#2a1418'); P.rect(ex - 1, cy, 3, 2, '#3a1a26'); P.p(ex, cy, '#ffffff'); }
  P.rect(cx - 7, cy + 2, 2, 1, '#ff8a9a'); P.rect(cx + 5, cy + 2, 2, 1, '#ff8a9a');
  P.p(cx - 1, cy + 3, '#7a2a2a'); P.p(cx, cy + 3, '#7a2a2a');
}
function chamaVela(P, x, y, f, cores) { const h = [4, 6, 4, 5][f % 4], sw = [0, 1, 0, -1][f % 4]; P.poly([[x - 1, y], [x + sw, y - h], [x + 2, y]], cores[0]); P.rect(x, y - 2, 1, 2, cores[1]); P.p(x, y - 1, cores[2]); }
// tamanho do lustre do jogo 1 (24x48): as formas novas ficam em 32x48, quase o mesmo porte
function lustreEvoArt(ev, f) { const k = 'le' + ev + (f % 4); return o8(k, () => {
  const P = new Pix(32, 48), b = [0, 1, 1, 0][f % 4], cx = 16;
  if (ev === 'lareira') {
    // LAREIRA: um lustre-fogão de ferro e latão, gordinho e quente: o rosto no globo de cobre, um fogo de verdade na
    // barriga, velas grossas, um cachecol tricotado e berloques de brasa.
    const Cu = ['#8a3a14', '#c8641e', '#f09a30', '#ffc860', '#fff0b8'], Fe = ['#1e1418', '#2e2228', '#40323a', '#56464e', '#6e5c64'], Lt = ramp('#c89a30');
    P.line(cx, 0, cx, 3, '#4a4450');
    P.rect(cx - 2, 4 + b, 5, 3, Fe[2]); P.rect(cx - 3, 6 + b, 7, 1, Lt[3]); P.p(cx + (f % 2), 2 + b, '#b8b0c0');
    for (const s of [-1, 1]) {
      for (let t = 0; t <= 9; t++) { const x = cx + s * (6 + t), y = 16 + b - Math.round(Math.sin(t / 9 * Math.PI) * 3) - (t > 7 ? (t - 7) * 2 : 0); P.p(x, y, Lt[t % 3 + 1]); P.p(x, y + 1, Lt[1]); }
      const vx = cx + s * 14, vy = 7 + b; P.rect(vx - 2, vy + 5, 5, 1, Lt[2]); P.rect(vx - 1, vy, 3, 5, '#f4ecdc'); P.p(vx + 1, vy + 1, '#d8ccb8'); P.p(vx - 1, vy + 2, '#fffaf0');
      chamaVela(P, vx, vy, f + vx, ['#ff8a30', '#ffd070', '#fff8c0']);
    }
    P.ball(cx, 13 + b, 8, 7, Cu, { amb: 0.35 }); P.rect(cx - 7, 7 + b, 15, 1, Lt[3]);
    rostoLume(P, cx, 13 + b, f);
    for (let x = cx - 7; x <= cx + 7; x++) { const y = 20 + b; P.rect(x, y, 1, 2, (x >> 1) % 2 ? '#d84a2a' : '#f08a3a'); }
    const pt = [0, 1, 1, 0][f % 4]; P.poly([[cx + 4, 21 + b], [cx + 9 + pt, 26 + b], [cx + 7, 27 + b], [cx + 2, 22 + b]], (x, y) => (x + y) % 3 ? '#d84a2a' : '#f08a3a');
    P.poly([[cx - 7, 22 + b], [cx + 7, 22 + b], [cx + 6, 33 + b], [cx - 6, 33 + b]], (x, y) => P.tone(Fe, 0.75 - (x - cx + 7) / 22, x, y));
    P.rect(cx - 4, 26 + b, 8, 5, '#3a0e08'); P.rect(cx - 4, 25 + b, 8, 1, Fe[4]);
    for (let i = 0; i < 3; i++) { const hh = [3, 4, 2, 4][(f + i) % 4]; P.poly([[cx - 4 + i * 3, 30 + b], [cx - 3 + i * 3, 30 + b - hh], [cx - 1 + i * 3, 30 + b]], i === 1 ? '#ffd070' : '#ff8a30'); }
    P.rect(cx - 3, 30 + b, 6, 1, '#6a3a1a'); P.p(cx - 2, 29 + b, '#ffd070');
    P.rect(cx - 7, 33 + b, 15, 2, Lt[2]); P.rect(cx - 7, 33 + b, 15, 1, Lt[4]);
    for (const [dx, L] of [[-5, 2], [0, 5], [5, 2]]) { P.line(cx + dx, 35 + b, cx + dx, 35 + b + L, Lt[1]); P.ball(cx + dx, 37 + b + L, 1.6, 2, ['#7a2a0a', '#c8501a', '#ff8a30', '#ffc870', '#fff0c0']); }
  } else {
    // ALVORADA: um lustre de cristal ao amanhecer: um aro de sol nascendo atrás, o globo de pérola rosada com o rosto,
    // a lua crescente de ouro no alto, velas finas de chama clara, fios de contas de vidro com gotas de todas as cores.
    const Ag = ramp('#a8b0c8');
    P.line(cx, 0, cx, 2, '#9aa0b8');
    for (let y = -15; y <= 15; y++) for (let x = -15; x <= 15; x++) { const d = Math.hypot(x, y * 1.1); if (d > 11.5 && d < 12.8) P.p(cx + x, 14 + b + y, (x + y + f) % 4 ? '#ffe8b0' : '#ffffff'); }
    for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2 + f * 0.13, r1 = a % 2 ? 16 : 14.5; for (let t = 13.5; t <= r1; t++) P.p(Math.round(cx + Math.cos(an) * t), Math.round(14 + b + Math.sin(an) * t * 0.92), a % 3 === 0 ? '#ffffff' : a % 2 ? '#ffd8a8' : '#c8ecff'); }
    for (const s of [-1, 1]) {
      for (let t = 0; t <= 10; t++) { const x = cx + s * (5 + t), y = 18 + b - Math.round(Math.sin(t / 10 * Math.PI) * 5); P.p(x, y, Ag[3]); }
      const vx = cx + s * 15, vy = 9 + b; P.rect(vx - 1, vy + 5, 3, 1, Ag[3]); P.rect(vx, vy, 1, 5, '#f4f6ff'); chamaVela(P, vx, vy, f + vx, ['#ffc060', '#fff4c8', '#ffffff']);
    }
    for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 9 && (x - 2) * (x - 2) + (y + 1) * (y + 1) > 5) P.p(cx - 1 + x, 4 + b + y, x < -1 ? '#ffe090' : '#e8b040');
    P.p(cx + 3, 2 + b, '#ffffff');
    P.ball(cx, 14 + b, 8, 7, ['#c87a6a', '#f0a890', '#ffd8b8', '#fff2e0', '#ffffff'], { amb: 0.42 });
    P.p(cx - 5, 9 + b, '#ffffff'); P.p(cx - 4, 9 + b, '#ffffff');
    rostoLume(P, cx, 14 + b, f);
    P.rect(cx - 7, 21 + b, 15, 1, Ag[3]); P.rect(cx - 7, 22 + b, 15, 1, Ag[1]);
    const cores = [['#c8e0ff', '#8ab8e8'], ['#ffd0e0', '#e898b8'], ['#fff0b0', '#e8c060'], ['#bff0ff', '#6ac0e0']];
    [[-6, 3], [-2, 7], [2, 7], [6, 3]].forEach(([dx, L], i) => { const x = cx + dx; for (let y = 0; y < L; y += 2) P.p(x, 23 + b + y, '#f4f8ff'); const c = cores[(i + f) % 4]; P.ball(x, 24 + b + L, 1.5, 2, [c[1], c[1], c[0], '#ffffff', '#ffffff']); P.p(x, 26 + b + L, c[1]); });
    P.ball(cx, 37 + b, 1.6, 3, ['#a8b0c8', '#c8d0e8', '#e8f0ff', '#ffffff', '#ffffff']); P.line(cx, 23 + b, cx, 34 + b, '#e8eef8');
    for (let i = 0; i < 2; i++) { const an = (f * 0.7 + i * 3.1), x = Math.round(cx + Math.cos(an) * 14), y = Math.round(20 + b + Math.sin(an) * 10); P.p(x, y, '#ffffff'); P.p(x - 1, y, '#bff0ff'); P.p(x + 1, y, '#bff0ff'); P.p(x, y - 1, '#bff0ff'); P.p(x, y + 1, '#bff0ff'); }
  }
  return P.outline().canvas(); }); }
function aderecoLumeArt(ev) { return o8('al2' + ev, () => {
  const P = new Pix(22, 14);
  if (ev === 'lareira') {
    // um pente de latão no cabelo com uma lanterninha de brasa pendurada e um laço de fita laranja
    const Lt = ramp('#c89a30');
    P.rect(3, 8, 11, 2, Lt[3]); P.rect(3, 9, 11, 1, Lt[1]); for (let x = 4; x < 14; x += 2) P.p(x, 10, Lt[2]);
    P.ball(16, 6, 3, 3, ['#7a2a0a', '#c8501a', '#ff8a30', '#ffc870', '#fff0c0']); P.rect(15, 2, 3, 1, Lt[2]); P.p(16, 1, Lt[3]); P.p(16, 5, '#fff0c0');
    P.poly([[2, 4], [6, 7], [2, 9]], '#f08a3a'); P.poly([[11, 4], [7, 7], [11, 9]], '#f08a3a'); P.rect(6, 6, 2, 2, '#d84a2a'); P.p(3, 5, '#ffc890'); P.p(10, 5, '#ffc890');
    P.line(6, 8, 4, 12, '#d84a2a'); P.line(7, 8, 9, 13, '#d84a2a');
  } else {
    // uma tiara de prata de amanhecer: aro fino, raios, uma pedra de pérola e gotinhas de cristal azul
    const Ag = ramp('#a8b0c8');
    for (let x = 2; x <= 19; x++) { const y = 10 - Math.round(Math.sin((x - 2) / 17 * Math.PI) * 3); P.p(x, y, Ag[3]); P.p(x, y + 1, Ag[1]); }
    for (let a = 0; a < 7; a++) { const an = Math.PI + a / 6 * Math.PI, r = a % 2 ? 7 : 5; P.line(11, 6, Math.round(11 + Math.cos(an) * r), Math.round(6 + Math.sin(an) * r * 0.8), a % 2 ? '#fff0b0' : '#ffd0e0'); }
    P.ball(11, 6, 2, 2, ['#f0b8d0', '#ffd0e0', '#fff0f4', '#ffffff', '#ffffff']); P.p(10, 5, '#ffffff');
    for (const x of [5, 17]) { P.p(x, 9, '#bff0ff'); P.p(x, 10, '#8ac8f0'); P.p(x, 11, '#bff0ff'); }
  }
  return P.outline().canvas(); }); }
