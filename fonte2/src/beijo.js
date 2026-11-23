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
  const FUNDO = P; const P2 = new Pix(W_, H_);
  // ---- a mesinha NA FRENTE deles: xícaras, vapor em coração, pão de queijo queimado do lado esquerdo ----
  P2.ball(mx, 108, 38, 7, ['#6a4a2a', '#8a5a32', '#a87040', '#c89058', '#e8b880']); P2.rect(mx - 38, 108, 77, 2, '#5a3a22'); P2.rect(mx - 2, 112, 4, 24, '#4a3020');
  for (const [x, s2] of [[mx - 24, -1], [mx + 24, 1]]) { P2.rect(x - 5, 99, 10, 7, '#f4ecdc'); P2.rect(x - 5, 99, 10, 1, '#5a3a2a'); P2.rect(x - 4, 100, 8, 1, '#3a2018'); P2.rect(x + (s2 > 0 ? 5 : -7), 100, 2, 4, '#f4ecdc'); P2.rect(x - 7, 106, 14, 1, '#d8ccb8'); }
  const vp = f % 8; for (let i = 0; i < 7; i++) { const y = 96 - i * 3 - (vp % 2), q = i / 6; P2.p(mx - 24 + Math.round(Math.sin(i + vp) * 1.5 + q * 14), y, '#f4ecff'); P2.p(mx + 24 - Math.round(Math.sin(i + vp) * 1.5 + q * 14), y, '#f4ecff'); }
  { const hx = mx, hy = 82 - (vp % 4); for (const [dx, dy] of [[-3, 0], [-2, -1], [-1, -1], [1, -1], [2, -1], [3, 0], [-3, 1], [3, 1], [-2, 2], [2, 2], [-1, 3], [1, 3], [0, 4], [0, 0]]) P2.p(hx + dx, hy + dy, '#ffc8dc'); }
  P2.rect(mx - 9, 101, 18, 3, '#e8e0d0'); P2.ball(mx - 4, 101, 3, 2, ['#8a5a1a', '#c8882a', '#e8b040', '#f8d070', '#fff0b0']); P2.ball(mx + 4, 101, 3, 2, ['#8a5a1a', '#c8882a', '#e8b040', '#f8d070', '#fff0b0']); P2.p(mx - 7, 101, '#3a2010'); P2.p(mx - 6, 102, '#3a2010');
  // ---- a luz do momento: a chama das pontas sobe, faíscas e um halo morno entre os rostos ----
  for (let i = 0; i < 12; i++) { const x = 92 + ((i * 17 + f * 5) % 40), y = 70 - ((i * 11 + f * 6) % 60); if (y < 4) continue; P2.p(x, y, i % 3 ? '#ffd070' : '#fff0c0'); }
  for (let r = 0; r < 3; r++) for (let a2 = 0; a2 < 20; a2++) { const an = a2 / 20 * Math.PI * 2 + f * 0.1; if ((a2 + r) % 3) continue; P2.p(Math.round(99 + Math.cos(an) * (10 + r * 6)), Math.round(66 + Math.sin(an) * (8 + r * 5)), r === 2 ? '#ffe0a0' : '#fff4d8'); }
  // ---- os dois, com a ARTE ORIGINAL (o rosto herdado, de frente; a Lume humana de lado, na ponta do pé) ----
  const c = mk(W_, H_), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.drawImage(FUNDO.canvas(), 0, 0);
  const A = typeof rostoArte === 'function' ? rostoArte() : null, ele = A && A.body ? A.body[0] : null, ela = IMG.spf && IMG.spf.lumeh ? IMG.spf.lumeh.s[0] : null, s2 = 2;
  // brilho morno atrás dos dois
  x.globalCompositeOperation = 'lighter'; const gr = x.createRadialGradient(101, 52, 2, 101, 52, 46); gr.addColorStop(0, 'rgba(255,220,150,0.45)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); x.fillStyle = gr; x.fillRect(40, 0, 130, 120); x.globalCompositeOperation = 'source-over';
  if (ele) { const w = ele.width * s2, h = ele.height * s2; x.drawImage(ele, 98 - w + 8, 124 - h, w, h); }
  if (ela) { const w = ela.width * s2, h = ela.height * s2, bob = [0, 1, 1, 0][f % 4]; x.drawImage(ela, 86, 120 - bob - h, w, h); }
  x.drawImage(P2.canvas(), 0, 0);
  // um coraçãozinho de luz e faíscas subindo, no ponto onde os rostos se encontram
  const hx = 88, hy = 30 - (f % 8);
  x.fillStyle = '#ffd8e8'; for (const [dx, dy] of [[-2, 0], [-1, -1], [1, -1], [2, 0], [-2, 1], [2, 1], [-1, 2], [1, 2], [0, 3], [0, 0], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) x.fillRect(hx + dx, hy + dy, 1, 1);
  for (let i = 0; i < 10; i++) { const px = 84 + ((i * 17 + f * 5) % 36), py = 60 - ((i * 11 + f * 6) % 56); if (py < 4) continue; x.fillStyle = i % 3 ? '#ffd070' : '#fff0c0'; x.fillRect(px, py, 1, 1); }
  return BEIJO_C[k] = c;
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
