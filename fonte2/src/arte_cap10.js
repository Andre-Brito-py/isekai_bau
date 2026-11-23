// ================= ARTE DO CAP. 10 — O FAROL DE CEM INVERNOS =================
// Tiles (vidro com prateleiras de potes), potes (móvel pesado e os quatro com nome), balanças, engrenagens, a LÂMPADA do
// Farol, fundos (a torre por dentro; a sala da lanterna com o céu). Inimigo: ECO DE LEMBRANÇA. Chefes (arte caprichada):
// O CONTRAPESO (mini), O ACENDEDOR-MOR (Vesper) e O CORAÇÃO DO FAROL (a lâmpada viva, com a marca da lanterna de um olho
// gravada no latão: SEGREDO da trilogia, só pista).
const KEY10 = Object.assign({}, KEY9, { 'g': { t: 'vidro10', solid: true } });
{ const _ta10 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'vidro10') return _ta10(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, (x + y) % 7 === 0 ? '#3a4a6a' : y < 8 ? '#1a2238' : '#202a44');
  P.rect(0, 7, 16, 2, '#6a5a40'); P.rect(0, 15, 16, 1, '#6a5a40');
  for (let i = 0; i < 2; i++) { const x = 2 + i * 7 + (v % 2), c = (v + i) % 3 === 0 ? '#ffd070' : (v + i) % 3 === 1 ? '#ffb040' : '#fff0b0'; P.rect(x, 3, 4, 4, '#c8d0e0'); P.rect(x + 1, 4, 2, 3, c); P.rect(x, 2, 4, 1, '#8a6a40'); P.rect(x + 1, 11, 3, 4, '#c8d0e0'); P.p(x + 2, 12, c); P.p(x + 2, 13, c); }
  P.p(1, 1, '#8aa8d8'); P.p(2, 0, '#8aa8d8');
  return TILE2[key] = P.canvas();
}; }
const OBJ10 = {};
const o10 = (k, f) => OBJ10[k] || (OBJ10[k] = f());
// o pote de Pavio (móvel pesado: vai no Vão e afunda as balanças)
function poteArt(v = 0, f = 0) { return o10('po' + (v % 3) + (f % 3), () => { const P = new Pix(16, 20), Gl = ['#5a6a8a', '#8aa0c8', '#b8c8e0', '#e0e8f4', '#ffffff'];
  P.ball(8, 12, 7, 7, Gl, { amb: 0.4 }); P.ball(8, 12, 5, 5, ['#7a4a10', '#c87a20', ['#ffb040', '#ffd070', '#ffe8a0'][v % 3], '#fff0c0', '#ffffff'], { amb: 0.3 + (f % 3) * 0.08 });
  P.rect(4, 3, 8, 3, '#8a6a40'); P.rect(4, 3, 8, 1, '#c8a060'); P.rect(6, 6, 4, 1, '#5a6a8a'); P.rect(5, 14, 6, 3, '#e8dcc0'); P.rect(6, 15, 4, 1, '#5a4a3a');
  P.p(4, 9, '#ffffff'); return P.outline().canvas(); }); }
// os potes com nome: brilham mais e têm etiqueta dourada
function poteNomeArt(f) { return o10('pn' + (f % 4), () => { const P = new Pix(18, 22);
  P.ball(9, 13, 7, 8, ['#a87a20', '#e8b040', '#ffe090', '#fff0c0', '#ffffff'], { amb: 0.45 + (f % 4) * 0.05 }); P.rect(5, 3, 8, 3, '#c89a30'); P.rect(5, 3, 8, 1, '#fff0b0');
  P.rect(5, 15, 8, 3, '#fff0b0'); P.rect(6, 16, 6, 1, '#8a5a1a'); for (let a = 0; a < 6; a++) { const an = a / 6 * Math.PI * 2 + f * 0.3; P.p(Math.round(9 + Math.cos(an) * 9), Math.round(12 + Math.sin(an) * 9), '#fff0b0'); }
  return P.outline().canvas(); }); }
function balancaArt(desce) { return o10('ba' + (desce ? 1 : 0), () => { const P = new Pix(16, 16), Lt = ramp('#a8803a');
  P.rect(1, desce ? 9 : 6, 14, 3, Lt[2]); P.rect(1, desce ? 9 : 6, 14, 1, Lt[4]); P.rect(6, desce ? 12 : 9, 4, desce ? 3 : 6, Lt[1]); P.rect(3, 14, 10, 2, Lt[0]);
  if (!desce) { P.p(3, 4, '#ffd070'); P.p(12, 4, '#ffd070'); } return P.outline().canvas(); }); }
function engrenagemArt(f) { return o10('en' + (f % 4), () => { const P = new Pix(34, 34), Lt = ramp('#8a6a30');
  P.ball(17, 17, 12, 12, Lt); for (let a = 0; a < 10; a++) { const an = a / 10 * Math.PI * 2 + f * 0.15; P.rect(Math.round(17 + Math.cos(an) * 14) - 2, Math.round(17 + Math.sin(an) * 14) - 2, 4, 4, Lt[1]); }
  P.ball(17, 17, 4, 4, ['#2a1a10', '#3a2a1a', '#5a4a3a', '#7a6a5a', '#9a8a7a']); for (let a = 0; a < 4; a++) { const an = a / 4 * Math.PI * 2 + f * 0.15; P.line(17, 17, 17 + Math.cos(an) * 10, 17 + Math.sin(an) * 10, Lt[0], 2); }
  return P.outline().canvas(); }); }
function correnteTorreArt(f) { return o10('co' + (f % 4), () => { const P = new Pix(64, 52), Fe = ramp('#5a5a6e');
  P.rect(0, 0, 64, 52, '#0a0810'); for (let y = 0; y < 52; y += 6) { const o = (y / 6 + f) % 2 ? 2 : 0; P.rect(26 + o, y, 12, 4, Fe[2]); P.rect(28 + o, y + 1, 8, 2, '#0a0810'); }
  for (let i = 0; i < 6; i++) P.p(6 + i * 10, (f * 7 + i * 11) % 52, '#ffd070'); return P.canvas(); }); }
// a lâmpada do Farol: colmeia de vidro lapidado (Fresnel), chama de âmbar no meio, armação de latão
function lampadaArt(f, apagada) { return o10('la' + (f % 4) + (apagada ? 1 : 0), () => { const P = new Pix(100, 92), Lt = ramp('#a8803a'), cx = 50;
  P.rect(14, 80, 72, 12, Lt[1]); P.rect(14, 80, 72, 2, Lt[3]); for (let x = 18; x < 84; x += 8) P.rect(x, 84, 4, 6, Lt[0]);
  for (let y = 6; y < 80; y++) { const w = 34 - Math.abs(y - 44) * 0.35; for (let x = Math.round(cx - w); x < cx + w; x++) { const band = Math.floor((y - 6) / 7), lit = !apagada; const k = ((x - cx + 40) % 9 < 1 || (y - 6) % 7 === 0); P.p(x, y, k ? Lt[2] : lit ? ((band + f) % 3 === 0 ? '#fff8d8' : band % 2 ? '#ffe8a0' : '#ffd878') : ((band) % 2 ? '#3a4058' : '#2a3048')); } }
  if (!apagada) { P.ball(cx, 44, 12, 16, ['#c87a20', '#ffb040', '#ffe090', '#fff8d0', '#ffffff'], { amb: 0.6 }); for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + f * 0.2; P.p(Math.round(cx + Math.cos(an) * 18), Math.round(44 + Math.sin(an) * 22), '#ffffff'); } }
  P.rect(cx - 16, 0, 32, 7, Lt[2]); P.rect(cx - 16, 0, 32, 2, Lt[4]); P.rect(cx - 3, 0, 6, 4, Lt[0]);
  return P.outline().canvas(); }); }
// ---------- fundos ----------
const BG10 = {};
function bgTorre10() { if (BG10.t) return BG10.t; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y >= 100 ? (((x >> 4) + (y >> 3)) % 2 ? '#4e4c5a' : '#56545e') : '#141a2c');
  for (let r = 0; r < 6; r++) { const y0 = 6 + r * 16; P.rect(0, y0 + 12, 240, 2, '#6a5a40'); for (let i = 0; i < 26; i++) { const x = 4 + i * 9 + (r % 2) * 4, c = (i + r) % 3 === 0 ? '#ffd070' : (i * r) % 4 === 1 ? '#ffb040' : '#fff0b0'; P.rect(x, y0 + 4, 6, 8, '#a8b8d0'); P.rect(x + 1, y0 + 6, 4, 5, c); P.rect(x, y0 + 3, 6, 1, '#8a6a40'); } }
  for (const x of [60, 180]) { P.rect(x - 6, 0, 12, 100, '#3a3a4e'); P.rect(x - 7, 0, 2, 100, '#5a5a6e'); }
  return BG10.t = P.canvas(); }
function bgLanterna10() { if (BG10.l) return BG10.l; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y >= 104 ? (((x >> 4) + (y >> 3)) % 2 ? '#4a4856' : '#52505e') : y < 50 ? '#060814' : '#0a0e20');
  for (let i = 0; i < 90; i++) P.p((i * 61) % 240, (i * 17) % 100, i % 5 ? '#c8d8f0' : '#ffffff');
  for (let x = 0; x < 240; x += 30) { P.rect(x, 0, 3, 104, '#3a3446'); }
  P.rect(0, 100, 240, 4, '#6a5a40');
  for (let i = 0; i < 40; i++) { const x = 20 + (i * 47) % 200, y = 96 + (i % 3); P.p(x, y, '#ffd070'); }   // Auren lá embaixo
  return BG10.l = P.canvas(); }
// ---------- inimigos ----------
const INI10 = {};
// ECO DE LEMBRANÇA: uma lembrança solta, com medo, em forma de gente feita de luz e de cacos
function ecoLArt(f) { const k = 'ec' + (f % 4); if (INI10[k]) return INI10[k];
  const P = new Pix(34, 50), b = [0, 1, 2, 1][f % 4], L = ['#a87a30', '#e8b050', '#ffe090', '#fff4d0', '#ffffff'];
  P.poly([[9, 48 - b], [17, 14 - b], [25, 48 - b]], (x, y) => (x + y + f) % 4 === 0 ? null : P.tone(L, 0.6 - (y - 14) / 70 - Math.abs(x - 17) / 40, x, y));
  P.ball(17, 10 - b, 6, 6, L, { amb: 0.5 }); P.rect(14, 9 - b, 2, 2, '#5a3a1a'); P.rect(19, 9 - b, 2, 2, '#5a3a1a');
  for (let i = 0; i < 5; i++) { const x = 4 + (i * 7 + f * 3) % 26, y = 20 + (i * 9 + f * 5) % 26; P.rect(x, y, 2, 3, i % 2 ? '#fff0c0' : '#ffd070'); }
  P.line(11, 22 - b, 4, 30 - b, L[2], 2); P.line(23, 22 - b, 30, 28 - b, L[2], 2);
  return INI10[k] = P.outline().canvas(); }
// O CONTRAPESO: o peso de ferro que puxa a lanterna do Farol para cima: um bloco do tamanho de uma carroça, feito de
// centenas de potes fundidos no ferro, pendurado numa corrente; dois braços de guindaste; um olho de vigia de vapor.
function contrapesoArt(f, pose, fase) { const k = 'cp' + (f % 4) + pose + fase; if (INI10[k]) return INI10[k];
  const W_ = 130, H_ = 140, P = new Pix(W_, H_), cx = 64, sw = Math.round(Math.sin(f * 0.6) * 3), Fe = ramp('#4a4a5e'), Lt = ramp('#8a6a30');
  // corrente
  for (let y = 0; y < 38; y += 6) { const o = ((y / 6) | 0) % 2 ? 1 : -1; P.rect(cx - 5 + o + sw / 2, y, 10, 4, Fe[3]); P.rect(cx - 3 + o + sw / 2, y + 1, 6, 2, null); }
  P.rect(cx - 10 + sw, 36, 20, 6, Lt[2]);
  // o bloco: trapézio de ferro com potes encravados
  P.poly([[cx - 40 + sw, 42], [cx + 40 + sw, 42], [cx + 48 + sw, 120], [cx - 48 + sw, 120]], (x, y) => { const r = ((x >> 3) + (y >> 3)) % 5; return (x + y * 3) % 17 === 0 ? Fe[0] : P.tone(Fe, 0.7 - (x - cx + 48) / 130 + (r === 0 ? 0.1 : 0), x, y); });
  for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { const x = cx - 34 + i * 13 + (j % 2) * 6 + sw, y = 52 + j * 17; if (x > cx + 38 + sw) continue; const acesa = fase >= 2 ? (i + j + f) % 2 === 0 : (i * j) % 3 === 0;
    P.ball(x, y, 4, 5, ['#5a6a8a', '#8aa0c8', '#b8c8e0', '#e0e8f4', '#ffffff']); P.ball(x, y + 1, 2.5, 3, acesa ? ['#c87a20', '#ffb040', '#ffe090', '#fff8d0', '#fff'] : ['#3a3048', '#4a4058', '#5a5068', '#6a6078', '#7a7088']); }
  // rebites e cinta de latão
  for (let x = cx - 44 + sw; x < cx + 44 + sw; x += 6) { P.p(x, 46, Lt[3]); P.p(x, 116, Lt[3]); } P.rect(cx - 46 + sw, 84, 92, 4, Lt[2]);
  // o olho de vigia (válvula de vapor) no meio
  P.ball(cx + sw, 70, 9, 9, Lt); P.ball(cx + sw, 70, 5, 5, pose === 'carga' ? ['#7a1a10', '#c83a18', '#f07a20', '#ffc040', '#fff0a0'] : ['#1a1014', '#5a2a1a', '#c86a2a', '#ffb060', '#fff']);
  // braços de guindaste com ganchos
  for (const s of [-1, 1]) { const ax = cx + s * 44 + sw, ay = 60, ex = ax + s * (pose === 'atk' && s > 0 ? 6 : 16), ey = pose === 'atk' && s > 0 ? 126 : 100 + sw;
    P.line(ax, ay, ex, ey, Fe[2], 5); P.line(ex, ey, ex - s * 4, ey + 8, Fe[3], 3); P.line(ex - s * 4, ey + 8, ex + s * 2, ey + 12, Fe[3], 3); }
  // vapor
  if (fase >= 2) for (let i = 0; i < 6; i++) { const x = cx - 40 + ((f * 5 + i * 17) % 80) + sw, y = 38 - (i * 7 + f * 3) % 30; P.ball(x, y, 3, 2, ['#8a8a9a', '#a8a8b8', '#c8c8d8', '#e0e0e8', '#ffffff']); }
  return INI10[k] = P.outline().canvas(); }
// O ACENDEDOR-MOR: Conde Ulrico Vesper. Casaca preta comprida, luvas pretas sujas de fuligem, gola alta branca, cabelo
// grisalho penteado, o CADERNO PRETO numa mão e na outra a vara de acendedor com a lanterna de âmbar. Fase 2: a luz do
// Farol desce por ele (um halo frio nas costas, a vara acesa como estrela).
function vesperBossArt(f, pose, fase) { const k = 'vb' + (f % 4) + pose + fase; if (INI10[k]) return INI10[k];
  const W_ = 96, H_ = 124, P = new Pix(W_, H_), cx = 44, b = [0, 1, 1, 0][f % 4], Co = ['#0a0a14', '#14141e', '#1e1e2a', '#2a2a38', '#3a3a4a'], Pl = ramp('#d8b090'), Lt = ramp('#c8a040');
  const atk = pose === 'atk', carga = pose === 'carga';
  if (fase >= 2) for (let a = 0; a < 18; a++) { const an = a / 18 * Math.PI * 2 + f * 0.08; for (let t = 30; t < 30 + (a % 2 ? 14 : 8); t++) P.p(Math.round(cx + Math.cos(an) * t), Math.round(40 + Math.sin(an) * t), a % 3 ? '#e8f0ff' : '#fff0c0'); }
  // pernas e botas
  for (const x0 of [cx - 9, cx + 2]) { P.rect(x0, 82, 7, 32, Co[1]); P.rect(x0 - 1, 112, 10, 6, '#0a0608'); P.p(x0 + 6, 113, '#5a5a6a'); }
  // casaca comprida, aberta
  P.poly([[cx - 14, 30 + b], [cx + 14, 30 + b], [cx + 22, 104], [cx + 8, 100], [cx + 2, 106], [cx - 4, 100], [cx - 20, 104]], (x, y) => P.tone(Co, 0.75 - (x - cx + 20) / 50 + ((x * 3 + y) % 13 === 0 ? 0.12 : 0), x, y));
  P.poly([[cx - 4, 32 + b], [cx + 4, 32 + b], [cx + 3, 80], [cx - 3, 80]], '#e8dcc0'); for (let y = 40; y < 78; y += 7) P.p(cx, y + b, '#1a1a24');
  for (let y = 30; y < 100; y++) { P.p(cx - 14 - Math.round((y - 30) * 0.08), y, Lt[1]); }   // debrum dourado
  // cabeça: rosto magro, olheiras, cabelo grisalho penteado para trás, gola alta
  P.rect(cx - 7, 24 + b, 14, 7, '#f2ecdc'); P.ball(cx, 16 + b, 8, 9, Pl); P.rect(cx - 8, 6 + b, 16, 6, '#9a9aaa'); P.rect(cx - 8, 6 + b, 16, 2, '#c8c8d4'); P.p(cx - 8, 12 + b, '#9a9aaa');
  P.rect(cx - 5, 15 + b, 3, 1, '#2a1a20'); P.rect(cx + 2, 15 + b, 3, 1, '#2a1a20'); P.rect(cx - 5, 17 + b, 3, 1, '#a87a6a'); P.rect(cx + 2, 17 + b, 3, 1, '#a87a6a'); P.rect(cx - 2, 21 + b, 4, 1, '#8a5a4a');
  // mão esquerda: o caderno preto
  const nx = atk ? cx - 26 : cx - 20, ny = atk ? 40 : 52 + b; P.line(cx - 13, 34 + b, nx + 4, ny, Co[3], 5); P.rect(nx - 6, ny - 2, 12, 15, '#141014'); P.rect(nx - 6, ny - 2, 12, 1, '#3a3040'); P.rect(nx - 6, ny + 3, 1, 8, '#c8a040'); P.ball(nx + 4, ny + 2, 3, 3, ['#0a0a14', '#14141e', '#1e1e2a', '#2a2a3a', '#3a3a4a']);
  // mão direita: a vara de acendedor com a lanterna
  const vx = carga ? cx + 18 : atk ? cx + 34 : cx + 24, vy = carga ? 6 : atk ? 50 : 30 + b, hx = cx + 16, hy = carga ? 36 : 50 + b;
  P.line(cx + 13, 34 + b, hx, hy, Co[3], 5); P.ball(hx, hy, 3, 3, ['#0a0a14', '#14141e', '#1e1e2a', '#2a2a3a', '#3a3a4a']);
  P.line(hx - (vx - hx) * 0.6, hy - (vy - hy) * 0.6 + 20, vx, vy, '#3a2a1a', 2);
  P.rect(vx - 4, vy - 8, 8, 9, '#1a1418'); P.ball(vx, vy - 4, 3, 4, fase >= 2 ? ['#a8c8e8', '#d8e8ff', '#ffffff', '#ffffff', '#ffffff'] : ['#7a4a10', '#c87a20', '#ffb040', '#ffe090', '#fff']); P.rect(vx - 5, vy - 9, 10, 1, Lt[3]);
  if (carga) for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; P.p(Math.round(vx + Math.cos(an) * 10), Math.round(vy - 4 + Math.sin(an) * 10), '#fff0c0'); }
  return INI10[k] = P.outline().canvas(); }
// O CORAÇÃO DO FAROL: a lâmpada viva. Uma colmeia de vidro do tamanho de uma casa, cheia demais: dentro, a chama de
// âmbar de cem invernos; em volta, um anel de potes que gira; da armação de latão saem braços de luz que agarram.
// No meio do latão, gravada, uma LANTERNA COM UM OLHO SÓ (a assinatura da trilogia: só pista). Fase 2: os braços de luz
// e um rosto de criança aparece e some na chama (Lívia). Fase 3: rachaduras, a chama vira branca e azul.
function coracaoFarolArt(f, pose, fase) { const k = 'cf' + (f % 8) + pose + fase; if (INI10[k]) return INI10[k];
  const W_ = 170, H_ = 150, P = new Pix(W_, H_), cx = 85, cy = 72, Lt = ramp('#a8803a');
  // braços de luz (fase 2+)
  if (fase >= 2) for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2 + f * 0.07, L = 62 + (i % 2) * 10; for (let t = 40; t < L; t++) { const w = Math.sin((t - 40) / (L - 40) * Math.PI) * 3; const x = cx + Math.cos(an + Math.sin(t * 0.1 + f * 0.3) * 0.15) * t, y = cy + Math.sin(an) * t * 0.85; P.rect(Math.round(x - w / 2), Math.round(y), Math.max(1, Math.round(w)), 1, t % 4 ? '#ffe8a0' : '#ffffff'); } }
  // base de latão
  P.poly([[cx - 50, 128], [cx + 50, 128], [cx + 60, 148], [cx - 60, 148]], (x, y) => P.tone(Lt, 0.7 - (x - cx + 60) / 140, x, y)); P.rect(cx - 60, 128, 120, 2, Lt[4]);
  // a colmeia (Fresnel)
  for (let y = 16; y < 128; y++) { const w = 46 - Math.abs(y - 72) * 0.42; for (let x = Math.round(cx - w); x < cx + w; x++) { const band = Math.floor((y - 16) / 8), aresta = (x - cx + 60) % 11 < 1 || (y - 16) % 8 === 0;
    const crack = fase >= 3 && (Math.abs((x - cx) * 0.6 - (y - 72)) < 1 || Math.abs((x - cx) * -0.9 - (y - 60)) < 1);
    P.p(x, y, crack ? '#1a1014' : aresta ? Lt[2] : fase >= 3 ? (band % 2 ? '#d8f0ff' : '#ffffff') : ((band + f) % 3 === 0 ? '#fff8d8' : band % 2 ? '#ffe8a0' : '#ffd878')); } }
  // a chama de cem invernos
  const fl = [0, 3, 1, 4, 2, 5, 1, 3][f % 8];
  P.ball(cx, cy + 4, 18, 24 + fl / 2, fase >= 3 ? ['#6ab0f0', '#a8d8ff', '#e0f4ff', '#ffffff', '#ffffff'] : ['#c85a10', '#ff9a30', '#ffd070', '#fff4c0', '#ffffff'], { amb: 0.6 });
  if (fase >= 2 && f % 8 < 4) { P.ball(cx, cy, 6, 7, ['#e8c8a0', '#f0d8b8', '#f8e8d0', '#fff4e8', '#ffffff']); P.rect(cx - 3, cy - 1, 2, 2, '#8a6a5a'); P.rect(cx + 2, cy - 1, 2, 2, '#8a6a5a'); P.rect(cx - 6, cy - 8, 12, 3, '#8a5a3a'); P.p(cx + 5, cy - 6, '#e86a8a'); }   // um rosto de menina, com a fita
  // o anel de potes girando em volta
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2 + f * 0.12, x = cx + Math.cos(an) * 58, y = cy + Math.sin(an) * 18 + 50; if (Math.sin(an) < -0.2) continue; P.ball(x, y, 4, 5, ['#5a6a8a', '#8aa0c8', '#b8c8e0', '#e0e8f4', '#ffffff']); P.ball(x, y + 1, 2.5, 3, ['#c87a20', '#ffb040', '#ffe090', '#fff8d0', '#fff']); }
  // a armação: tampa e a marca gravada (a lanterna de um olho)
  P.poly([[cx - 30, 16], [cx + 30, 16], [cx + 20, 4], [cx - 20, 4]], (x, y) => P.tone(Lt, 0.75 - (x - cx + 30) / 70, x, y)); P.rect(cx - 4, 0, 8, 5, Lt[1]);
  P.rect(cx - 6, 132, 12, 12, Lt[0]); P.rect(cx - 4, 133, 8, 2, Lt[3]); P.rect(cx - 3, 135, 6, 7, '#1a1014'); P.ball(cx, 138, 2, 2, ['#5a1a1a', '#a83a2a', '#e86a3a', '#ffb080', '#fff']);   // a lanterna de um olho
  if (pose === 'carga') for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; P.p(Math.round(cx + Math.cos(an) * 52), Math.round(cy + Math.sin(an) * 60), '#ffffff'); }
  return INI10[k] = P.outline().canvas(); }
