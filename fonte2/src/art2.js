// ================= ARTE DA TEMPORADA 2 =================
// Tudo em pixel art. Os personagens da T1 vêm da arte herdada (heranca_arte.json, convertida no boot).
// Inimigos e chefes novos são pintados aqui, pixel a pixel, com um "pintor" que sombreia por volume
// (luz vinda de cima à esquerda), pontilhado ordenado entre os tons e contorno seletivo (cor escura do vizinho).

// ---------- arte herdada ----------
const IMG = { sp: {}, spf: {}, port: {}, chest: {}, chestMap: {}, ready: false };
function loadHeranca() {
  const jobs = [];
  const load = u => new Promise(r => { const im = new Image(); im.onload = () => { const c = mk(im.width, im.height); c.getContext('2d').drawImage(im, 0, 0); r(c); }; im.onerror = () => r(null); im.src = u; });
  const arr = (a, set) => jobs.push(Promise.all(a.map(load)).then(set));
  for (const [k, a] of Object.entries(HARTE.sp)) arr(a, v => IMG.sp[k] = v);
  for (const [k, a] of Object.entries(HARTE.port)) arr(a, v => IMG.port[k] = v);
  for (const [k, o] of Object.entries(HARTE.spf)) { IMG.spf[k] = {}; for (const [d, a] of Object.entries(o)) arr(a, v => IMG.spf[k][d] = v); }
  for (const [k, o] of Object.entries(HARTE.chest)) { IMG.chest[k] = {}; for (const [d, u] of Object.entries(o)) jobs.push(load(u).then(v => IMG.chest[k][d] = v)); }
  return Promise.all(jobs).then(() => { IMG.ready = true; });
}
function flipH(c) { const o = mk(c.width, c.height), x = o.getContext('2d'); x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(c, 0, 0); return o; }
// retrato 32x32 para as caixas de diálogo
const PTC = {};
function PT(k) {
  if (PTC[k]) return PTC[k];
  let src = null;
  if (k === 'me') src = IMG.chest[G.species] ? IMG.chest[G.species].front : null;
  else src = IMG.port[k] ? IMG.port[k][0] : null;
  const c = mk(32, 32), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  if (src) { const s = Math.min(32 / src.width, 32 / src.height), w = Math.round(src.width * s), h = Math.round(src.height * s); x.drawImage(src, (32 - w) >> 1, (32 - h) >> 1, w, h); }
  return PTC[k] = c;
}

// ---------- cores ----------
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgbHex(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function shadeHex(h, k) { const [r, g, b] = hexRGB(h); return k <= 1 ? rgbHex(r * k, g * k, b * k) : rgbHex(r + (255 - r) * (k - 1), g + (255 - g) * (k - 1), b + (255 - b) * (k - 1)); }
// rampa de 5 tons a partir de uma cor base: sombra profunda puxada para o roxo, luz puxada para o amarelo (estilo pixel art)
function ramp(base) {
  const [r, g, b] = hexRGB(base);
  const mix = (c, t, k) => c.map((v, i) => v + (t[i] - v) * k);
  const dk = [38, 20, 52], lt = [255, 244, 214];
  return [mix([r, g, b], dk, 0.62), mix([r, g, b], dk, 0.34), [r, g, b], mix([r, g, b], lt, 0.28), mix([r, g, b], lt, 0.55)].map(c => rgbHex(...c));
}
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

// ---------- o pintor ----------
class Pix {
  constructor(w, h) { this.w = w; this.h = h; this.c = new Array(w * h).fill(null); this.L = [-0.55, -0.7, 0.45]; const n = Math.hypot(...this.L); this.L = this.L.map(v => v / n); }
  in(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  p(x, y, col) { x |= 0; y |= 0; if (this.in(x, y) && col) this.c[y * this.w + x] = col; }
  get(x, y) { return this.in(x, y) ? this.c[(y | 0) * this.w + (x | 0)] : null; }
  rect(x, y, w, h, col) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.p(x + i, y + j, col); }
  // escolhe um tom da rampa pela intensidade de luz (0..1), com pontilhado entre tons vizinhos
  tone(R, I, x, y) { const n = R.length - 1, f = Math.max(0, Math.min(0.999, I)) * n, i = Math.floor(f), fr = f - i; return R[Math.min(n, fr > (BAYER4[y & 3][x & 3] + 0.5) / 16 ? i + 1 : i)]; }
  // elipse sombreada como uma esfera achatada
  ball(cx, cy, rx, ry, R, o = {}) {
    const amb = o.amb ?? 0.22, k = o.k ?? 0.85;
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, d = nx * nx + ny * ny; if (d > 1) continue;
      if (o.clip && !o.clip(x, y)) continue;
      const nz = Math.sqrt(1 - d), I = amb + k * Math.max(0, nx * this.L[0] + ny * this.L[1] + nz * this.L[2]);
      this.p(x, y, this.tone(R, I, x, y));
    }
  }
  // cilindro vertical (postes, braços de pé) ou horizontal
  cyl(x, y, w, h, R, horiz = false, o = {}) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const t = horiz ? (j + 0.5) / h * 2 - 1 : (i + 0.5) / w * 2 - 1, nz = Math.sqrt(Math.max(0, 1 - t * t));
      const I = (o.amb ?? 0.2) + 0.85 * Math.max(0, (horiz ? t * this.L[1] : t * this.L[0]) + nz * this.L[2]);
      let col = this.tone(R, I, x + i, y + j);
      if (o.grain && ((x + i) * 7 + (y + j) * 13) % o.grain === 0) col = R[Math.max(0, R.indexOf(col) - 1)];
      this.p(x + i, y + j, col);
    }
  }
  // polígono preenchido (cor fixa ou função de cor por pixel)
  poly(pts, col) {
    let y0 = Infinity, y1 = -Infinity; for (const [, y] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let y = Math.floor(y0); y <= y1; y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx_, by] = pts[(i + 1) % pts.length]; if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + (y + 0.5 - ay) / (by - ay) * (bx_ - ax)); }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.p(x, y, typeof col === 'function' ? col(x, y) : col);
    }
  }
  line(x0, y0, x1, y1, col, w = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0 || 1;
    for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); if (w === 1) this.p(x, y, col); else this.rect(x - (w >> 1), y - (w >> 1), w, w, col); }
  }
  // contorno seletivo: todo pixel vazio encostado num pintado vira uma versão bem escura daquela cor
  outline(dark = 0.32, dflt = '#140c18') {
    const add = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.get(x, y)) continue;
      let n = null; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const c = this.get(x + dx, y + dy); if (c) { n = c; break; } }
      if (n) add.push([x, y, n === dflt ? dflt : shadeHex(n, dark)]);
    }
    for (const [x, y, c] of add) this.p(x, y, c === '#000000' ? dflt : c);
    return this;
  }
  canvas() {
    const c = mk(this.w, this.h), x = c.getContext('2d'), id = x.createImageData(this.w, this.h);
    for (let i = 0; i < this.c.length; i++) { const col = this.c[i]; if (!col) continue; const [r, g, b] = hexRGB(col); id.data[i * 4] = r; id.data[i * 4 + 1] = g; id.data[i * 4 + 2] = b; id.data[i * 4 + 3] = 255; }
    x.putImageData(id, 0, 0); return c;
  }
}

// ---------- paletas ----------
const RP = {
  palha: ramp('#c8a048'), madeira: ramp('#7a4a2a'), madeiraV: ramp('#5a3a2a'), papel: ramp('#d8c8a0'), papelV: ramp('#b8a070'),
  ferro: ramp('#5a5a6e'), ferrugem: ramp('#9a4a2a'), vermelho: ramp('#b83030'), ambar: ramp('#e8a030'), chapeu: ramp('#a8803a'),
  corvo: ramp('#2a2a44'), bico: ramp('#e0a030'), lanterna: ramp('#3a3a48'), fogo: ['#7a1a10', '#c83a18', '#f07a20', '#ffc040', '#fff0a0'],
  gelo: ramp('#6ab0e0'), pano: ramp('#5a3a6a'), moeda: ramp('#d0a030')
};

// ---------- cartaz de PROCURADO (textura do casaco do Espantalho e das asas dos corvos) ----------
function cartaz(P, x, y, w, h, seed, rasgado) {
  const R = (seed * 7) % 2 ? RP.papel : RP.papelV;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (rasgado && j > h - 3 && ((i * 5 + seed) % 4 === 0)) continue;
    const I = 0.55 + 0.25 * Math.sin((i + seed) * 0.9) * 0.3 - j / h * 0.25 + (i === 0 ? 0.2 : 0);
    P.p(x + i, y + j, P.tone(R, I, x + i, y + j));
  }
  if (w >= 6 && h >= 7) {
    P.rect(x + 1, y + 1, w - 2, 1, RP.vermelho[2]);                                 // faixa "PROCURADO"
    const cx = x + (w >> 1), cy = y + 3 + ((h - 4) >> 1);                             // desenhinho de um baú
    P.rect(cx - 2, cy - 1, 4, 3, RP.madeira[1]); P.rect(cx - 2, cy - 1, 4, 1, RP.madeira[3]); P.p(cx - 1, cy, RP.moeda[3]);
    if (h >= 9) P.rect(x + 1, y + h - 2, w - 2, 1, RP.papelV[0]);                     // a recompensa, em letrinha
  }
}

// ---------- CORVO-CARTAZ: corvo de papel que sobe dos cartazes ----------
function corvoArt(f) {
  // f: 0 asas em cima, 1 asas embaixo, 2 mergulho (ataque), 3 ferido
  const P = new Pix(34, 28);
  const by = f === 2 ? 14 : 15, bx0 = f === 2 ? 16 : 17;
  // cauda de tiras de papel
  for (let i = 0; i < 4; i++) P.line(bx0 + 6, by + 2, bx0 + 13 + i, by + 5 + i * 2, i % 2 ? RP.papelV[2] : RP.papel[2]);
  P.ball(bx0, by, 8, 6, RP.corvo);                                    // corpo
  P.ball(bx0 - 6, by - 4, 5, 5, RP.corvo);                            // cabeça
  P.poly([[bx0 - 10, by - 5], [bx0 - 16, by - 3], [bx0 - 10, by - 2]], (x, y) => P.tone(RP.bico, 0.75 - (y - by + 5) * 0.12, x, y));   // bico
  P.p(bx0 - 8, by - 6, '#ff5040'); P.p(bx0 - 7, by - 6, '#ffd0a0');   // olho em brasa
  // asas: cartazes dobrados
  const wy = f === 0 ? by - 12 : f === 1 ? by + 1 : f === 2 ? by - 6 : by - 9;
  const wx = bx0 - 2;
  if (f === 1) { cartaz(P, wx - 2, wy, 9, 8, 3, true); cartaz(P, wx + 5, wy + 1, 8, 7, 4, true); }
  else { cartaz(P, wx - 3, wy, 8, 10, 1, true); cartaz(P, wx + 4, wy + 2, 7, 9, 2, true); }
  // pés
  if (f !== 2) { P.line(bx0 - 1, by + 6, bx0 - 2, by + 9, RP.bico[1]); P.line(bx0 + 2, by + 6, bx0 + 3, by + 9, RP.bico[1]); }
  else { P.line(bx0 - 4, by + 5, bx0 - 8, by + 8, RP.bico[1]); P.line(bx0 - 1, by + 6, bx0 - 5, by + 9, RP.bico[1]); }
  if (f === 3) for (let i = 0; i < 6; i++) P.p(4 + i * 4, 4 + (i * 7) % 9, RP.papel[3]);  // papel voando
  return P.outline().canvas();
}

// ---------- O ESPANTALHO DO PEDÁGIO (chefe do Cap. 1) ----------
// Um espantalho de estrada, pregado num poste do pedágio da ponte de Velhágua. Casaco feito de cartazes de PROCURADO
// (muitos com um baú desenhado), cabeça de lanterna de ferro com um rosto recortado, chapéu de palha largo com a fita
// do pedágio. Braço direito: a CANCELA do pedágio. Braço esquerdo: um saco de moedas. Fase 2: a lanterna acende.
// Fase 3: os cartazes queimam e aparece o miolo de palha com um coração de âmbar.
// st: { ph: 1|2|3, f: 0..3 (0/1 balanço, 2 levantando a cancela, 3 batendo), hurt }
function espArt(st) {
  const W_ = 96, H_ = 112, P = new Pix(W_, H_);
  const cx = 48, sway = st.f === 1 ? 1 : 0, ph = st.ph;
  // --- poste e travessa ---
  P.cyl(cx - 3, 40, 7, 72, RP.madeira, false, { grain: 5 });
  for (let j = 44; j < 112; j += 9) P.rect(cx - 3, j, 7, 1, RP.madeira[0]);                      // veios
  P.rect(cx - 5, 104, 11, 8, RP.madeiraV[1]); P.rect(cx - 6, 108, 13, 4, RP.madeiraV[0]);          // base enterrada
  // palha escapando da base
  for (let i = 0; i < 14; i++) { const a = -1.4 + i * 0.2; P.line(cx, 103, cx + Math.cos(a) * (6 + (i % 3) * 3), 103 + Math.sin(a) * 4 + 6, RP.palha[1 + (i % 3)]); }
  // --- braço da cancela (direito do espantalho = esquerda da tela, aponta pro grupo) ---
  const up = st.f === 2 ? -18 : st.f === 3 ? 10 : 0;
  const ax0 = cx - 8, ay0 = 50, ax1 = 4, ay1 = 50 + up + (st.f < 2 ? sway : 0);
  for (let t = 0; t <= 1; t += 1 / 46) {
    const x = Math.round(ax0 + (ax1 - ax0) * t), y = Math.round(ay0 + (ay1 - ay0) * t);
    const stripe = Math.floor(t * 7) % 2;
    const R = stripe ? RP.vermelho : RP.papel;
    P.p(x, y - 2, R[3]); P.p(x, y - 1, R[2]); P.p(x, y, R[2]); P.p(x, y + 1, R[1]); P.p(x, y + 2, R[0]);
  }
  P.ball(ax1 + 1, ay1, 3, 3, RP.ferro);                                                              // ponteira de ferro
  P.ball(ax0, ay0, 4, 4, RP.ferrugem);                                                                // dobradiça enferrujada
  // --- braço do saco de moedas (direita da tela) ---
  P.cyl(cx + 6, 48, 20, 5, RP.madeira, true, { grain: 4 });
  for (let j = 0; j < 9; j++) P.line(cx + 24, 52, cx + 23 + (j % 3), 58 + j, RP.palha[2 + (j % 2)]);   // palha saindo da manga
  P.line(cx + 25, 52, cx + 25, 60 - sway, RP.madeira[1]);                                              // cordinha
  P.ball(cx + 26, 70 - sway, 9, 9, RP.pano);                                                         // o saco
  P.rect(cx + 22, 61 - sway, 8, 2, RP.pano[0]);
  P.ball(cx + 22, 67 - sway, 2, 2, RP.moeda); P.p(cx + 30, 73 - sway, RP.moeda[4]); P.p(cx + 29, 74 - sway, RP.moeda[3]);
  // moedas caindo do furo do saco
  if (st.f === 3) for (let i = 0; i < 4; i++) P.ball(cx + 22 + i * 3, 84 + i * 5, 1.6, 1.6, RP.moeda);
  // --- casaco comprido de pano, com dobras, mangas e cartazes pregados ---
  const coatTop = 42, coatBot = 98, CL = ramp('#4e4434'), CLd = ramp('#3e3628');
  const half = y => 15 + (y - coatTop) * 0.2;
  if (ph < 3) {
    // mangas sobre os braços (a da cancela e a do saco)
    for (let t = 0; t < 1; t += 1 / 18) { const x = Math.round(cx - 12 - t * 14), y = Math.round(ay0 + (ay1 - ay0) * t * 0.3); P.ball(x, y + 1, 4, 5, CL, { amb: 0.3 }); }
    P.cyl(cx + 6, 46, 14, 8, CL, true);
    for (let j = 0; j < 4; j++) P.line(cx + 19, 47 + j * 2, cx + 21, 49 + j * 2, CLd[1]);                 // punho esfiapado
    // corpo do casaco: dobras verticais + luz da esquerda
    P.poly([[cx - 15, coatTop], [cx + 15, coatTop], [cx + 24, coatBot], [cx - 24, coatBot]], (x, y) => {
      const u = (x - cx) / half(y), fold = Math.sin(x * 0.55 + (y - coatTop) * 0.05) * 0.18, I = 0.62 - u * 0.32 + fold - (y - coatTop) / 160;
      return P.tone(CL, I, x, y);
    });
    // barra rasgada em tiras
    for (let x = cx - 24; x <= cx + 24; x += 3) { const L = 3 + ((x * 7) % 5); P.rect(x, coatBot, 2, L, CL[(x % 2) + 1]); P.p(x, coatBot + L, CL[0]); }
    // abertura do casaco mostrando a palha por dentro
    P.poly([[cx - 2, 72], [cx + 2, 72], [cx + 5, coatBot], [cx - 5, coatBot]], (x, y) => P.tone(RP.palha, 0.35 + ((x + y) % 4 === 0 ? 0.25 : 0), x, y));
    // gola alta e remendo costurado
    P.poly([[cx - 15, coatTop + 1], [cx - 6, coatTop - 4], [cx - 4, coatTop + 6]], (x, y) => P.tone(CL, 0.8, x, y));
    P.poly([[cx + 15, coatTop + 1], [cx + 6, coatTop - 4], [cx + 4, coatTop + 6]], (x, y) => P.tone(CL, 0.45, x, y));
    P.rect(cx + 9, 80, 7, 6, ramp('#6a3a4a')[2]); for (let i = 0; i < 7; i += 2) { P.p(cx + 9 + i, 79, '#d8c8a0'); P.p(cx + 9 + i, 86, '#d8c8a0'); }
    // cinto de corda com nó
    for (let x = cx - 19; x <= cx + 19; x++) { P.p(x, 71 + (x % 3 === 0 ? 1 : 0), RP.palha[1]); P.p(x, 72, RP.palha[(x % 2) + 2]); }
    P.ball(cx - 7, 73, 2, 2, RP.palha); P.line(cx - 7, 74, cx - 9, 81, RP.palha[2]); P.line(cx - 6, 74, cx - 5, 80, RP.palha[1]);
    // cartazes de PROCURADO pregados, cada um torto de um jeito
    const posters = [[cx - 21, 50, 11, 14, -1], [cx + 6, 52, 11, 14, 1], [cx - 13, 78, 10, 13, 1], [cx + 10, 84, 10, 12, -1], [cx - 6, 44, 9, 11, 0]];
    posters.forEach(([x, y, w, h, sk], k) => {
      if (ph === 2 && k === 3) return;   // na fase 2 um cartaz já queimou
      const Q = new Pix(w, h); cartaz(Q, 0, 0, w, h, k * 3 + 1, k % 2 === 0);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const c = Q.get(i, j); if (c) P.p(x + i + Math.round(sk * j / 6), y + j, c); }
      P.p(x + (w >> 1), y, RP.ferro[3]); P.p(x + (w >> 1), y + 1, RP.ferro[1]);                    // prego
      const ex = x + w - 1 + Math.round(sk * (h - 1) / 6); P.p(ex, y + h - 1, RP.papel[4]); P.p(ex - 1, y + h - 1, RP.papel[4]); P.p(ex, y + h - 2, RP.papel[4]);   // ponta enrolada
    });
    if (ph === 2) for (let i = 0; i < 16; i++) { const x = cx - 22 + i * 3, y = coatBot + 2 - (i * 5) % 7; P.p(x, y, RP.fogo[2]); P.p(x, y - 1, RP.fogo[3]); P.p(x + 1, y - 2, RP.fogo[4]); }
  } else {
    // fase 3: os cartazes queimaram; sobra o miolo de palha, as ripas e o coração de âmbar
    P.ball(cx, 68, 17, 26, RP.palha);
    for (let i = 0; i < 50; i++) { const a = i * 0.7, r = 6 + (i % 9) * 1.7; P.line(cx + Math.cos(a) * r * 0.5, 68 + Math.sin(a) * r, cx + Math.cos(a) * r, 68 + Math.sin(a) * r * 1.4, RP.palha[(i % 4) + 1]); }
    for (let i = -3; i <= 3; i++) { P.line(cx - 13, 57 + i * 5, cx + 13, 57 + i * 5 + (i % 2), RP.madeiraV[1]); P.line(cx - 13, 56 + i * 5, cx + 13, 56 + i * 5 + (i % 2), RP.madeiraV[3]); }
    P.ball(cx, 66, 8, 9, RP.ambar, { amb: 0.45 }); P.ball(cx - 2, 62, 2, 2, ['#fff8d0', '#fff8d0', '#ffffff', '#ffffff', '#ffffff']);
    for (let i = 0; i < 9; i++) { const x = cx - 20 + i * 5, y = 94 - (i * 3) % 5; P.p(x, y, RP.fogo[1]); P.p(x + 1, y - 1, RP.fogo[2]); P.p(x + 1, y - 2, RP.fogo[3]); }
    for (let i = 0; i < 5; i++) { const x = cx - 18 + i * 9; P.rect(x, 44 + (i * 7) % 12, 3, 2, '#2a1e1a'); }   // farrapos carbonizados
  }
  // --- cabeça: lanterna de ferro com rosto recortado ---
  const hx = cx, hy = 30 + (st.f === 3 ? 2 : 0), lit = ph >= 2;
  const glass = lit ? RP.fogo : ['#2a1a20', '#4a2a24', '#7a4a2a', '#a8703a', '#c8984a'];
  P.rect(hx - 3, hy + 10, 7, 4, RP.ferro[1]);                                                               // pescoço
  P.ball(hx, hy, 11, 11, glass, { amb: lit ? 0.55 : 0.25, k: 0.5 });                                          // vidro
  P.poly([[hx - 9, hy - 10], [hx + 9, hy - 10], [hx + 6, hy - 14], [hx - 6, hy - 14]], (x, y) => P.tone(RP.ferro, 0.7 - (y - hy + 14) * 0.1, x, y));
  P.cyl(hx - 12, hy - 11, 25, 3, RP.ferro, true); P.cyl(hx - 12, hy + 9, 25, 3, RP.ferro, true);
  for (const bxx of [-11, 10]) P.cyl(hx + bxx, hy - 9, 2, 19, RP.ferro);
  P.ball(hx, hy - 17, 3, 3, RP.ferro, { clip: (x, y) => Math.hypot(x + 0.5 - hx, y + 0.5 - hy + 17) > 1.6 });   // argola
  // rosto: chapa de ferro recortada (olhos e sorriso de dentes de cancela) por cima do vidro
  P.ball(hx, hy + 1, 8, 8, RP.lanterna, { clip: (x, y) => {
    const ex = Math.abs(x + 0.5 - hx), ey = y + 0.5 - hy;
    const eye = ex > 2 && ex < 7 && ey > -4 && ey < 1 && (ey + 4) > (ex - 2) * 0.6;
    const mouth = ey > 3 && ey < 6 && ex < 6 && !((((x - hx + 6) | 0) % 3 === 0) && ey < 4.5);
    return !eye && !mouth; } });
  if (st.hurt) { P.rect(hx - 7, hy - 2, 4, 1, '#ffffff'); P.rect(hx + 3, hy - 2, 4, 1, '#ffffff'); }
  // --- chapéu de palha com a fita do pedágio ---
  P.poly([[hx - 24, hy - 9], [hx + 24, hy - 11], [hx + 20, hy - 6], [hx - 20, hy - 5]], (x, y) => P.tone(RP.chapeu, 0.85 - (y - hy + 11) * 0.12 + ((x + y) % 5 === 0 ? -0.15 : 0), x, y));
  P.ball(hx, hy - 15, 11, 7, RP.chapeu, { clip: (x, y) => y < hy - 8 });
  P.rect(hx - 11, hy - 11, 22, 2, RP.vermelho[2]); P.rect(hx - 11, hy - 11, 22, 1, RP.vermelho[3]);
  for (let i = 0; i < 5; i++) P.line(hx - 22 + i * 10, hy - 6, hx - 23 + i * 10 + (i % 2), hy - 1, RP.palha[2]);   // palhas soltas da aba
  // --- corvo pousado no chapéu (some na fase 3) ---
  if (ph < 3) { P.ball(hx + 14, hy - 16, 4, 3, RP.corvo); P.ball(hx + 11, hy - 19, 3, 3, RP.corvo); P.p(hx + 8, hy - 19, RP.bico[3]); P.p(hx + 10, hy - 20, '#ff5040'); }
  P.outline();
  return P.canvas();
}
// brilho da lanterna (desenhado por cima, com transparência) para a fase 2 e 3
const ESP_CACHE = {};
function espFrame(ph, f, hurt) { const k = ph + '_' + f + '_' + (hurt ? 1 : 0); return ESP_CACHE[k] || (ESP_CACHE[k] = espArt({ ph, f, hurt })); }
const CORVO_FR = [];
function corvoFrame(f) { return CORVO_FR[f] || (CORVO_FR[f] = corvoArt(f)); }

// ---------- CENÁRIO: a ponte do pedágio de Velhágua ao entardecer ----------
let PONTE_BG = null;
function ponteBG() {
  if (PONTE_BG) return PONTE_BG;
  const P = new Pix(240, 150);
  // céu em faixas com pontilhado
  const sky = ['#2a1e48', '#3e2656', '#5c3062', '#82406a', '#a8526a', '#c86a62', '#e08a5a', '#f0aa60', '#f8c878'];
  for (let y = 0; y < 80; y++) for (let x = 0; x < 240; x++) { const f = Math.min(1, y / 76) * (sky.length - 1), i = Math.floor(f); P.p(x, y, sky[Math.min(sky.length - 1, (f - i) > (BAYER4[y & 3][x & 3] + 0.5) / 16 ? i + 1 : i)]); }
  // sol baixo atrás da cidade
  P.ball(188, 70, 13, 13, ['#f8d080', '#fce0a0', '#fff0c0', '#fff8e0', '#ffffff'], { amb: 0.7, k: 0.3 });
  // nuvens longas iluminadas por baixo
  for (const [x, y, w] of [[10, 18, 60], [96, 30, 80], [170, 14, 54], [40, 46, 40], [150, 50, 70]]) {
    P.rect(x + 4, y - 2, w - 10, 2, '#6a3a6a'); P.rect(x, y, w, 3, '#9a4a6a'); P.rect(x + 3, y + 3, w - 6, 1, '#e88a6a'); P.rect(x + 8, y + 4, w - 18, 1, '#f8c08a');
  }
  // a margem de lá: morrinhos baixos ao longe (antes havia um buraco transparente aqui)
  for (let x = 0; x < 120; x++) { const h = 2 + Math.round(2 * Math.sin(x * 0.06) + Math.sin(x * 0.17)); P.rect(x, 80 - h, 1, h, '#4a2e50'); P.p(x, 80 - h, '#6a3e5e'); }
  // Velhágua ao longe: casas tortas afundando, torres e o sino
  const hz = 78;
  for (let x = 120; x < 240; x++) { const h = 6 + Math.round(4 * Math.sin(x * 0.07)); P.rect(x, hz - h, 1, h + 2, '#3a2a4a'); }
  const casas = [[128, 12, 10, 0.1], [140, 16, 8, -0.15], [150, 22, 12, 0.05], [165, 14, 9, 0.2], [176, 28, 6, 0], [184, 18, 12, -0.1], [198, 12, 10, 0.12], [210, 20, 9, -0.08], [222, 14, 12, 0.15]];
  for (const [x, h, w, tilt] of casas) {
    for (let j = 0; j < h; j++) { const off = Math.round((h - j) * tilt); P.rect(x + off, hz - j, w, 1, j % 9 === 0 ? '#2a1e38' : '#2e2240'); }
    P.poly([[x + Math.round(h * tilt) - 2, hz - h], [x + Math.round(h * tilt) + w + 2, hz - h], [x + Math.round(h * tilt) + w / 2, hz - h - 6]], '#2a1e38');
    if ((x * 7) % 3) P.p(x + Math.round(h * tilt * 0.5) + 2, hz - (h >> 1), '#ffcf6a');
  }
  P.rect(178, hz - 36, 2, 8, '#2a1e38'); P.ball(179, hz - 38, 2, 2, ['#5a4030', '#7a5a30', '#a87a30', '#c89a40', '#e0b060']);   // o sino
  // rio largo, refletindo o céu
  for (let y = 80; y < 112; y++) for (let x = 0; x < 240; x++) {
    const k = (y - 80) / 32, base = k < 0.3 ? '#a85a6a' : k < 0.6 ? '#6a3a5e' : '#3a2a4e';
    P.p(x, y, base);
    if ((x * 13 + y * 7) % 23 === 0) P.p(x, y, '#f0aa70');
  }
  for (let y = 82; y < 110; y += 2) { const w = 30 - (y - 82); if (w > 0) P.rect(188 - (w >> 1), y, w, 1, '#f8c878'); }   // reflexo do sol
  // margem de cá: barranco de terra e capim
  P.poly([[0, 108], [240, 112], [240, 150], [0, 150]], (x, y) => P.tone(ramp('#5a4a3a'), 0.75 - (y - 108) / 60 + ((x * 3 + y * 5) % 11 === 0 ? 0.15 : 0), x, y));
  // estrada de terra com sulcos de carroça
  for (let y = 118; y < 150; y++) for (let x = 0; x < 240; x++) { if ((y === 126 || y === 127 || y === 140 || y === 141) && (x * 3 + y) % 7 !== 0) P.p(x, y, '#3e3226'); }
  for (let i = 0; i < 70; i++) { const x = (i * 53) % 240, y = 112 + (i * 31) % 36; P.p(x, y, '#7a6a4a'); P.p(x + 1, y, '#6a5a3e'); }
  // a ponte de madeira do pedágio (lado direito) com a guarita
  for (let x = 150; x < 240; x++) { P.rect(x, 96, 1, 3, x % 6 === 0 ? '#3a2416' : '#6a4a2a'); P.p(x, 95, '#8a6a3a'); }
  for (let x = 152; x < 240; x += 12) P.cyl(x, 90, 3, 22, RP.madeiraV);
  P.rect(150, 92, 90, 1, '#5a3a24');
  // guarita
  P.cyl(212, 70, 24, 26, RP.madeira, true, { grain: 3 }); P.poly([[208, 70], [240, 70], [236, 62], [212, 62]], (x, y) => P.tone(RP.vermelho, 0.7 - (y - 62) * 0.06, x, y));
  P.rect(218, 76, 8, 8, '#1a1420'); P.rect(219, 77, 6, 6, '#ffcf6a'); P.rect(222, 77, 1, 6, '#c88a3a');
  // placa do pedágio
  P.cyl(118, 96, 3, 22, RP.madeiraV); P.rect(106, 88, 28, 10, RP.madeira[1]); P.rect(107, 89, 26, 8, RP.papel[2]); P.rect(108, 90, 24, 2, RP.vermelho[2]);
  P.rect(110, 93, 20, 1, RP.papelV[0]); P.rect(112, 95, 16, 1, RP.papelV[0]);
  // capim
  for (let i = 0; i < 90; i++) { const x = (i * 37) % 240, y = 108 + (i * 17) % 40, h = 2 + i % 4; P.line(x, y, x + (i % 3) - 1, y - h, i % 2 ? '#4a6a3a' : '#3a5a2e'); }
  return PONTE_BG = P.canvas();
}

// ---------- ícones 12x12 dos comandos, elementos e status ----------
const ICON_G = {
  atacar: ["....kk......", "...kwwk.....", "...kwwk.....", "...kwwk.....", "...kwwk.....", "...kwwk.....", "...kwwk.....", ".kkyyyykk...", "..kkyykk....", "....kk......", "....yy......", "....kk......"],
  mordida: ["............", ".kkkkkkkkk..", "kwkwkwkwkwk.", "kkkkkkkkkkk.", "kooooooooook", "kooooooooook", "kkkkkkkkkkk.", "kwkwkwkwkwk.", ".kkkkkkkkk..", "............", "............", "............"],
  tecnica: [".....kk.....", ".....yk.....", "....kyyk....", "kkkkyyyykkkk", "kyyyyyyyyyyk", ".kyyyyyyyyk.", "..kyyyyyyk..", "..kyyyyyyk..", ".kyyykkyyyk.", ".kyyk..kyyk.", "kkk......kkk", "............"],
  runas: ["kkkkkkkkkk..", "kppppppppkk.", "kpwwppwwpkpk", "kpwppwppwkpk", "kpwwwwwppkpk", "kppppppppkpk", "kpwwppwwpkpk", "kppwwppwpkpk", "kppppppppkpk", "kkkkkkkkkkpk", ".kpppppppppk", "..kkkkkkkkkk"],
  defender: ["kkkkkkkkkkkk", "kccccwwcccck".slice(0, 12), "kcccwwwwccck", "kcccwwwwccck", "kccccwwcccck".slice(0, 12), "kcccccccccck".slice(0, 12), ".kcccccccck.", ".kcccccccck.", "..kcccccck..", "...kcccck...", "....kcck....", ".....kk....."],
  item: ["....kkkk....", "....kwwk....", "....kkkk....", "...kyyyyk...", "..kyyyyyyk..", ".kyyyyyyyyk.", ".kyowyyyyyk.", ".kyowyyyyyk.", ".kyyyyyyyyk.", ".kyyyyyyyyk.", "..kyyyyyyk..", "...kkkkkk..."],
  super: [".......kkk..", "......kyyk..", ".....kyyk...", "....kyyk....", "...kyyyykk..", "..kyyyyyyk..", "..kkkyyyk...", "....kyyk....", "...kyyk.....", "..kyyk......", "..kyk.......", "..kk........"],
  dupla: ["............", ".kk......kk.", "kyyk....kcck", "kyyyk..kccck", ".kyyykkccck.", "..kyyyyccck.", "..kkyyyccck.", ".kyykyykcck.", "kyyk.kk.kcck", "kkk......kkk", "............", "............"],
  fogo: [".....k......", "....kok.....", "....koko....", "...kooyok...", "..kooyyok...", "..koyyyyok..", ".kooyyyyyok.", ".koyywwyyok.", ".koyywwyyok.", "..koyyyyok..", "...kkkkkk...", "............"],
  gelo: [".....kk.....", "..k..cc..k..", "...kccck....", ".kccwwccck..", "..kcwwwck...", "kkcwwwwwckk.", "..kcwwwck...", ".kccwwccck..", "...kccck....", "..k..cc..k..", ".....kk.....", "............"],
  luz: [".....kk.....", ".k...yy...k.", "..k.kyyk.k..", "...kyyyyk...", ".kkyywwyykk.", "kyyywwwwyyyk", ".kkyywwyykk.", "...kyyyyk...", "..k.kyyk.k..", ".k...yy...k.", ".....kk.....", "............"],
  corte: ["..........kk", ".........kwk", "........kwk.", ".......kwk..", "......kwk...", ".....kwk....", "..k.kwk.....", "...kwk......", "..kykk......", ".kyk.k......", "kkk.........", "............"],
  queimado: ["....k.......", "...kok......", "...kook.....", "..kooyok....", ".kooyyok....", ".koyyyok....", "..kkkkk.....", "............", "............", "............", "............", "............"],
  congelado: ["..k.k.......", "...k........", ".kkwkk......", "...k........", "..k.k.......", "............", "............", "............", "............", "............", "............", "............"],
  tonto: [".kkk..kkk...", "kyyyk..y....", "..kyk.kyk...", ".kyk...k....", "kyyyk.......", ".kkk........", "............", "............", "............", "............", "............", "............"],
  escudo: [".kkkkk......", "kccccck.....", "kcwwcck.....", "kcwccck.....", ".kccck......", "..kck.......", "...k........", "............", "............", "............", "............", "............"],
  guarda: [".kkkkk......", "kooooook....", "kowwooo k...".replace(' ', 'o'), "kowooook....", ".koook......", "..kok.......", "...k........", "............", "............", "............", "............", "............"]
};
const ICPAL = { k: '#120e1a', w: '#ffffff', y: '#ffd040', o: '#f07830', c: '#7ad0f0', p: '#9a6ad0', '.': null };
const ICON = {};
function buildIcons() {
  for (const [k, g] of Object.entries(ICON_G)) {
    const c = mk(12, 12), x = c.getContext('2d');
    g.forEach((row, j) => [...row].forEach((ch, i) => { const col = ICPAL[ch]; if (col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); } }));
    ICON[k] = c;
  }
}
