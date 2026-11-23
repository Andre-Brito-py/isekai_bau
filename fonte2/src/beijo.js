// ================= O QUADRO DO BEIJO (Cap. 10, o café) =================
// Pedido do usuário: "o beijo tem que ser bem marcante: um quadro deles se beijando numa arte mais caprichada". Uma
// ilustração em pixel art (208x136), animada, mostrada numa moldura por cima do mapa durante a cena: fim de tarde no
// Largo, céu de pôr do sol, telhados de Auren e o Farol APAGADO no morro; a Padaria Flor do Largo com as velas acendendo
// sozinhas; varal de lampiões; a mesinha com dois cafés (o vapor faz um coração) e o pão de queijo queimado do lado
// esquerdo. De perfil, inclinados por cima da mesa: o baú de ROSTO (cores tiradas da arte do rosto herdado) e a Lume
// (cabelo dourado até a cintura com pontas de chama acesas, casaco creme de barra dourada, brinco de cristal lilás e o
// adereço da evolução), olhos fechados, as mãos dadas em cima da mesa, faíscas subindo.
let QUADRO = null;
function coresRosto10() {
  const def = { pele: '#e8b890', cabelo: '#3a2a24', roupa: '#34405a' };
  try {
    const A = rostoArte(); if (!A || !A.big) return def;
    const c = A.big[0], d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, at = (x, y) => { const i = (y * c.width + x) * 4; return d[i + 3] ? '#' + [d[i], d[i + 1], d[i + 2]].map(v => v.toString(16).padStart(2, '0')).join('') : null; };
    const pele = riscosRosto(c).pele; const peleHex = pele.startsWith('rgb') ? '#' + pele.match(/\d+/g).map(v => (+v).toString(16).padStart(2, '0')).join('') : pele;
    let cab = null; for (const [x, y] of [[24, 6], [20, 8], [28, 8], [24, 9], [16, 12], [32, 12]]) { const v = at(x, y); if (v) { cab = v; break; } }
    let roupa = null; for (const [x, y] of [[24, 44], [18, 45], [30, 45], [24, 46]]) { const v = at(x, y); if (v) { roupa = v; break; } }
    return { pele: peleHex || def.pele, cabelo: cab || def.cabelo, roupa: roupa || def.roupa };
  } catch (e) { return def; }
}
const BEIJO_C = {};
function beijoArt(f) {
  const ev = G.evoLume || 'nenhum', k = ev + (f % 8); if (BEIJO_C[k]) return BEIJO_C[k];
  const W_ = 208, H_ = 136, P = new Pix(W_, H_), C = coresRosto10();
  // ---- o céu do fim de tarde ----
  const ceu = ['#2a1e4a', '#4a2a62', '#7a3a72', '#b0507a', '#e0706a', '#f4985a', '#ffc070', '#ffe0a0'];
  for (let y = 0; y < 92; y++) for (let x = 0; x < W_; x++) { const t = y / 92 * (ceu.length - 1), i = Math.floor(t), fr = t - i; P.p(x, y, ceu[Math.min(ceu.length - 1, fr > (BAYER4[y & 3][x & 3] + 0.5) / 16 ? i + 1 : i)]); }
  for (let i = 0; i < 14; i++) { const x = (i * 59 + 7) % W_, y = (i * 13) % 26; P.p(x, y, (i + f) % 5 ? '#e8d8ff' : '#ffffff'); }
  P.ball(156, 70, 16, 14, ['#e8703a', '#f8904a', '#ffb060', '#ffd090', '#ffe8c0'], { amb: 0.7, clip: (x, y) => y < 92 });             // o sol se pondo
  // o morro e o Farol APAGADO, longe
  P.poly([[150, 92], [176, 52], [184, 52], [208, 92]], '#3a2a4a'); P.rect(177, 40, 6, 13, '#4a3a5a'); P.rect(176, 38, 8, 3, '#5a4a6a'); P.rect(178, 42, 4, 4, '#2a1e3a');
  // telhados de Auren
  for (let k2 = 0; k2 < 9; k2++) { const x0 = k2 * 24 - 4, hh = 14 + (k2 * 7) % 12; P.rect(x0, 92 - hh, 22, hh, '#3a2a48'); P.poly([[x0 - 2, 92 - hh], [x0 + 11, 92 - hh - 8], [x0 + 24, 92 - hh]], '#2e2240'); if (k2 % 2) P.rect(x0 + 8, 92 - hh + 5, 4, 4, (k2 + f) % 3 ? '#ffb040' : '#ffd070'); }
  // ---- a padaria (esquerda): fachada, janela acesa, velas acendendo sozinhas ----
  P.rect(0, 30, 46, 100, '#c8a878'); P.rect(0, 30, 46, 3, '#8a6a48'); for (let y = 36; y < 130; y += 8) P.rect(0, y, 46, 1, '#b8986a');
  P.rect(6, 44, 34, 34, '#5a3a2a'); P.rect(8, 46, 30, 30, '#ffd890'); P.rect(22, 46, 2, 30, '#5a3a2a'); P.rect(8, 60, 30, 2, '#5a3a2a');
  for (let i = 0; i < 5; i++) { const x = 11 + i * 6, aceso = i <= (f % 8) / 1.4; P.rect(x, 69, 2, 5, '#f4ecdc'); if (aceso) { P.p(x, 67, '#ffb040'); P.p(x, 66, '#fff0a0'); P.p(x + 1, 68, '#ff8a30'); } }
  P.rect(2, 36, 42, 6, '#e86a6a'); for (let i = 0; i < 7; i++) P.rect(3 + i * 6, 36, 3, 6, '#f4ecdc');                                   // toldo listrado
  // varal de lampiões de papel de um lado ao outro
  for (let x = 40; x < W_; x++) { const y = 18 + Math.round(Math.sin((x - 40) / (W_ - 40) * Math.PI) * 8); P.p(x, y, '#2a1e3a'); if ((x - 40) % 18 === 9) { const c = (x + f * 3) % 3 === 0 ? '#ffe090' : (x % 2 ? '#ff9a6a' : '#ffd070'); P.ball(x, y + 4, 2.5, 3, ['#a8502a', '#e8802a', c, '#fff0c0', '#fff']); } }
  // ---- o chão (calçada) ----
  for (let y = 92; y < H_; y++) for (let x = 46; x < W_; x++) P.p(x, y, ((x >> 3) + (y >> 2)) % 2 ? '#6a5a6a' : '#74647a');
  for (let y = 92; y < H_; y++) for (let x = 0; x < 46; x++) P.p(x, y, '#5a4a5a');
  const mx = 101;
  // ---- ELE (esquerda, olhando para a direita), de rosto ----
  const Pe = ramp(C.pele), Cb = ramp(C.cabelo), Rp = ramp(C.roupa), a1 = 88, b1 = 60;
  P.poly([[a1 - 24, 136], [a1 - 26, b1 + 38], [a1 - 18, b1 + 22], [a1 - 2, b1 + 18], [a1 + 8, b1 + 24], [a1 + 10, b1 + 38], [a1 + 6, 136]], (x, y) => P.tone(Rp, 0.8 - (x - a1 + 26) / 50, x, y));
  P.rect(a1 - 4, b1 + 10, 8, 9, Pe[2]); P.rect(a1 - 4, b1 + 10, 2, 9, Pe[1]); P.line(a1 - 2, b1 + 20, a1 + 2, b1 + 30, Rp[1]);
  P.line(a1 + 6, b1 + 32, mx - 1, b1 + 38, Rp[2], 4); P.ball(mx, b1 + 38, 3, 2, Pe, { amb: 0.6 });
  P.ball(a1, b1, 11, 12, Pe, { amb: 0.55, k: 0.6 });
  P.poly([[a1 + 9, b1 - 3], [a1 + 13, b1 + 3], [a1 + 9, b1 + 4]], Pe[3]); P.p(a1 + 12, b1 + 3, Pe[1]);
  P.poly([[a1 + 5, b1 + 7], [a1 + 11, b1 + 7], [a1 + 10, b1 + 10], [a1 + 3, b1 + 12]], Pe[3]); P.p(a1 + 10, b1 + 7, '#b04a5a'); P.p(a1 + 9, b1 + 7, '#b04a5a');
  P.line(a1 + 3, b1 - 1, a1 + 6, b1 - 1, '#2a1a20'); P.p(a1 + 7, b1, '#2a1a20'); P.p(a1 + 4, b1 - 3, Cb[1]); P.p(a1 + 5, b1 - 3, Cb[1]);
  P.rect(a1 + 4, b1 + 3, 2, 1, '#ff9aa8');
  P.ball(a1 - 5, b1 + 1, 2, 3, Pe, { amb: 0.5 }); P.p(a1 - 5, b1 + 1, Pe[1]);
  P.poly([[a1 - 12, b1 + 4], [a1 - 12, b1 - 8], [a1 - 6, b1 - 13], [a1 + 4, b1 - 13], [a1 + 10, b1 - 8], [a1 + 9, b1 - 4], [a1 + 4, b1 - 6], [a1 - 2, b1 - 5], [a1 - 6, b1 - 1], [a1 - 8, b1 + 6]], (x, y) => P.tone(Cb, 0.85 - (x - a1 + 12) / 40 - (y - b1 + 13) / 60, x, y));
  for (let i = 0; i < 3; i++) P.line(a1 + 4 + i * 2, b1 - 7, a1 + 6 + i * 2, b1 - 3, Cb[1]);
  // ---- A LUME (direita, olhando para a esquerda), na ponta do pé ----
  const Cr = ['#a89878', '#c8b898', '#e8dcc0', '#f8f0dc', '#ffffff'], Ou = ramp('#d8a830'), Ln = ['#a8701a', '#d8a030', '#f0c850', '#ffe080', '#fff4c0'], Pl = ['#c08068', '#e0a088', '#f4c4a4', '#ffe0c8', '#fff4e8'];
  const a2 = 110, b2 = 64;
  P.poly([[a2 - 6, b2 - 10], [a2 + 5, b2 - 14], [a2 + 13, b2 - 8], [a2 + 19, b2 + 6], [a2 + 25, b2 + 30], [a2 + 31, b2 + 54], [a2 + 15, b2 + 56], [a2 + 11, b2 + 30], [a2 + 7, b2 + 10]], (x, y) => P.tone(Ln, 0.9 - (x - a2 + 6) / 60 + (((x * 2 + y) % 11 === 0) ? 0.15 : 0) - (y - b2) / 140, x, y));
  for (let i = 0; i < 6; i++) { const x = a2 + 15 + i * 3, y = b2 + 52 + (i % 2) * 2; P.poly([[x - 1, y], [x + 1, y + 6 + ((f + i) % 3)], [x + 3, y]], i % 2 ? '#ff8a30' : '#ffb040'); P.p(x + 1, y + 3, '#fff0a0'); }
  P.poly([[a2 - 6, b2 + 20], [a2 + 10, b2 + 16], [a2 + 20, b2 + 28], [a2 + 24, 136], [a2 - 8, 136], [a2 - 10, b2 + 36]], (x, y) => P.tone(Cr, 0.75 - (x - a2 + 10) / 60, x, y));
  P.line(a2 - 8, 132, a2 + 24, 132, Ou[3], 2); for (let i = 0; i < 3; i++) P.p(a2 - 2, b2 + 40 + i * 7, '#c8a8f0');
  P.rect(a2 - 3, b2 + 9, 7, 9, Pl[2]);
  P.line(a2 - 4, b2 + 28, mx + 2, b2 + 34, Cr[2], 4); P.ball(mx + 2, b2 + 35, 2.5, 2, Pl, { amb: 0.6 });
  P.ball(a2, b2, 10, 11, Pl, { amb: 0.5, k: 0.65 });
  P.poly([[a2 - 9, b2 - 2], [a2 - 13, b2 + 2], [a2 - 9, b2 + 3]], Pl[3]); P.p(a2 - 12, b2 + 2, Pl[1]);
  P.poly([[a2 - 4, b2 + 6], [a2 - 10, b2 + 6], [a2 - 9, b2 + 9], [a2 - 3, b2 + 11]], Pl[3]); P.p(a2 - 10, b2 + 6, '#d0506a'); P.p(a2 - 9, b2 + 6, '#d0506a');
  P.line(a2 - 6, b2 - 1, a2 - 3, b2 - 1, '#5a2a30'); P.p(a2 - 7, b2 - 2, '#5a2a30'); P.p(a2 - 8, b2 - 2, '#5a2a30');
  P.rect(a2 - 5, b2 + 2, 3, 2, '#ff8aa0');
  P.ball(a2 + 4, b2 + 1, 2, 3, Pl); P.ball(a2 + 4, b2 + 6, 1.5, 2, ['#7a5ab8', '#a888e0', '#c8a8f0', '#e8d8ff', '#ffffff']);
  P.poly([[a2 - 10, b2 - 3], [a2 - 9, b2 - 9], [a2 - 3, b2 - 13], [a2 + 7, b2 - 12], [a2 + 11, b2 - 6], [a2 + 5, b2 - 7], [a2 - 1, b2 - 6], [a2 - 6, b2 - 3]], (x, y) => P.tone(Ln, 0.95 - (x - a2 + 10) / 40, x, y));
  if (ev === 'lareira') { P.rect(a2 + 3, b2 - 14, 8, 2, Ou[3]); P.ball(a2 + 12, b2 - 13, 2, 2, ['#7a2a0a', '#c8501a', '#ff8a30', '#ffc870', '#fff0c0']); P.poly([[a2 - 1, b2 - 16], [a2 + 2, b2 - 13], [a2 - 1, b2 - 11]], '#f08a3a'); P.poly([[a2 + 5, b2 - 16], [a2 + 2, b2 - 13], [a2 + 5, b2 - 11]], '#f08a3a'); }
  else if (ev === 'alvorada') { for (let i = 0; i < 12; i++) P.p(a2 - 5 + i, b2 - 13 - Math.round(Math.sin(i / 11 * Math.PI) * 2), '#e8eef8'); for (let q = 0; q < 5; q++) { const an = Math.PI + q / 4 * Math.PI; P.line(a2 + 1, b2 - 15, a2 + 1 + Math.cos(an) * 4, b2 - 15 + Math.sin(an) * 3, q % 2 ? '#fff0b0' : '#ffd0e0'); } P.p(a2 + 1, b2 - 15, '#ffffff'); }
  else { for (let i = 0; i < 3; i++) { P.rect(a2 - 1 + i * 4, b2 - 16, 1, 3, '#f4ecdc'); P.p(a2 - 1 + i * 4, b2 - 17, '#ffb040'); } P.rect(a2 - 2, b2 - 13, 10, 1, Ou[3]); }
  // ---- a mesinha NA FRENTE deles: xícaras, vapor em coração, pão de queijo queimado do lado esquerdo ----
  P.ball(mx, 108, 38, 7, ['#6a4a2a', '#8a5a32', '#a87040', '#c89058', '#e8b880']); P.rect(mx - 38, 108, 77, 2, '#5a3a22'); P.rect(mx - 2, 112, 4, 24, '#4a3020');
  for (const [x, s2] of [[mx - 24, -1], [mx + 24, 1]]) { P.rect(x - 5, 99, 10, 7, '#f4ecdc'); P.rect(x - 5, 99, 10, 1, '#5a3a2a'); P.rect(x - 4, 100, 8, 1, '#3a2018'); P.rect(x + (s2 > 0 ? 5 : -7), 100, 2, 4, '#f4ecdc'); P.rect(x - 7, 106, 14, 1, '#d8ccb8'); }
  const vp = f % 8; for (let i = 0; i < 7; i++) { const y = 96 - i * 3 - (vp % 2), q = i / 6; P.p(mx - 24 + Math.round(Math.sin(i + vp) * 1.5 + q * 14), y, '#f4ecff'); P.p(mx + 24 - Math.round(Math.sin(i + vp) * 1.5 + q * 14), y, '#f4ecff'); }
  { const hx = mx, hy = 82 - (vp % 4); for (const [dx, dy] of [[-3, 0], [-2, -1], [-1, -1], [1, -1], [2, -1], [3, 0], [-3, 1], [3, 1], [-2, 2], [2, 2], [-1, 3], [1, 3], [0, 4], [0, 0]]) P.p(hx + dx, hy + dy, '#ffc8dc'); }
  P.rect(mx - 9, 101, 18, 3, '#e8e0d0'); P.ball(mx - 4, 101, 3, 2, ['#8a5a1a', '#c8882a', '#e8b040', '#f8d070', '#fff0b0']); P.ball(mx + 4, 101, 3, 2, ['#8a5a1a', '#c8882a', '#e8b040', '#f8d070', '#fff0b0']); P.p(mx - 7, 101, '#3a2010'); P.p(mx - 6, 102, '#3a2010');
  // ---- a luz do momento: a chama das pontas sobe, faíscas e um halo morno entre os rostos ----
  for (let i = 0; i < 12; i++) { const x = 92 + ((i * 17 + f * 5) % 40), y = 70 - ((i * 11 + f * 6) % 60); if (y < 4) continue; P.p(x, y, i % 3 ? '#ffd070' : '#fff0c0'); }
  for (let r = 0; r < 3; r++) for (let a2 = 0; a2 < 20; a2++) { const an = a2 / 20 * Math.PI * 2 + f * 0.1; if ((a2 + r) % 3) continue; P.p(Math.round(99 + Math.cos(an) * (10 + r * 6)), Math.round(66 + Math.sin(an) * (8 + r * 5)), r === 2 ? '#ffe0a0' : '#fff4d8'); }
  return BEIJO_C[k] = P.outline().canvas();
}
// a moldura por cima do mapa (como o close-up da Rita): aparece, fica, some
function desenhaQuadro10() {
  const Q = QUADRO; if (!Q) return;
  Q.t++; const a = Q.sai ? Math.max(0, 1 - Q.sai++ / 24) : Math.min(1, Q.t / 24); if (Q.sai && a <= 0) { QUADRO = null; return; }
  const img = beijoArt(Math.floor(Q.t / 9)), sc = Math.max(1, Math.min(2, (W - 16) / (img.width + 8), (H * 0.64) / (img.height + 8))), iw = Math.round(img.width * sc), ih = Math.round(img.height * sc), w = iw + 8, h = ih + 8, x0 = Math.round(W / 2 - w / 2), y0 = 6;
  bx.globalAlpha = a * 0.7; bx.fillStyle = '#0a0612'; bx.fillRect(0, 0, W, H); bx.globalAlpha = a;
  bx.fillStyle = '#0a0612'; bx.fillRect(x0 - 2, y0 - 2, w + 4, h + 4);
  bx.fillStyle = '#c89a30'; bx.fillRect(x0, y0, w, h); bx.fillStyle = '#ffe090'; bx.fillRect(x0 + 1, y0 + 1, w - 2, 1); bx.fillRect(x0 + 1, y0 + 1, 1, h - 2);
  bx.fillStyle = '#8a6a1a'; bx.fillRect(x0 + 1, y0 + h - 2, w - 2, 1); bx.fillRect(x0 + w - 2, y0 + 1, 1, h - 2);
  for (const [cx, cy] of [[x0 + 2, y0 + 2], [x0 + w - 5, y0 + 2], [x0 + 2, y0 + h - 5], [x0 + w - 5, y0 + h - 5]]) { bx.fillStyle = '#fff0b0'; bx.fillRect(cx, cy, 3, 3); }
  const sm = bx.imageSmoothingEnabled; bx.imageSmoothingEnabled = false; bx.drawImage(img, x0 + 4, y0 + 4, iw, ih); bx.imageSmoothingEnabled = sm; bx.globalAlpha = 1;
}
{ const _dbQ = desenhaBaloes; desenhaBaloes = function () { if (QUADRO && V.scene === 'world') desenhaQuadro10(); return _dbQ(); }; }
{ const _hmQ = hudMundo; hudMundo = function (m) { if (QUADRO) return; return _hmQ(m); }; }
