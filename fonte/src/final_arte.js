// ===== A tela final (v2.17): o amanhecer na superfície, com a turma de costas olhando o vale =====
// Pedido do usuário: "deixar a paisagem mais bonita com os personagens de costas nela, algo digno do final do jogo".
// A paisagem fica no fundo durante todas as falas finais e atrás da tela de FIM.
// Camadas: céu em faixas com pontilhado, estrelas que somem, sol nascendo com raios, nuvens iluminadas por baixo,
// três cadeias de montanhas com névoa, Auren no morro com os faróis de âmbar, o rio refletindo o sol, o morro da frente
// com capim ao vento, uma árvore, o 31 estacionado, e a turma sentada na beira, de costas.
const SKY8 = { layers: null };
function sky8Layers() {
  if (SKY8.layers) return SKY8.layers;
  const L = {};
  // céu: faixas com pontilhado (estilo pixel art)
  const sky = mk(240, 112), s = sky.getContext('2d');
  const bands = ['#141a40', '#1c2350', '#2a2c62', '#3d3672', '#5a3f7c', '#7e4a82', '#a85a86', '#cc6e82', '#e8867a', '#f4a16e', '#fbbf76', '#ffd98e', '#ffe9b0'];
  const bh = 112 / bands.length;
  for (let y = 0; y < 112; y++) {
    const f = y / bh, i = Math.floor(f), fr = f - i;
    for (let x = 0; x < 240; x++) {
      const bay = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]][y % 4][x % 4] / 16;
      s.fillStyle = bands[Math.min(bands.length - 1, fr > bay ? i + 1 : i)]; s.fillRect(x, y, 1, 1);
    }
  }
  L.sky = sky;
  // montanhas: perfil por ruído suave, cor com névoa, borda iluminada do lado do sol
  const ridge = (seed, base, amp, col, rim, sunX) => {
    const c = mk(240, 140), g = c.getContext('2d');
    for (let x = 0; x < 240; x++) {
      const h = base - amp * (0.55 * Math.sin(x * 0.021 + seed) + 0.3 * Math.sin(x * 0.057 + seed * 2.3) + 0.15 * Math.sin(x * 0.13 + seed * 5.1));
      const y0 = Math.round(h);
      g.fillStyle = col; g.fillRect(x, y0, 1, 140 - y0);
      const hn = base - amp * (0.55 * Math.sin((x + 1) * 0.021 + seed) + 0.3 * Math.sin((x + 1) * 0.057 + seed * 2.3) + 0.15 * Math.sin((x + 1) * 0.13 + seed * 5.1));
      const facing = (x < sunX) ? hn < h : hn > h;  // encosta virada para o sol
      g.fillStyle = rim; g.fillRect(x, y0, 1, facing ? 2 : 1);
    }
    return c;
  };
  L.m1 = ridge(1.7, 84, 16, '#7a6aa8', '#e8b0b8', 168);
  L.m2 = ridge(4.2, 96, 12, '#5a4e8a', '#d8908e', 168);
  L.m3 = ridge(2.9, 106, 8, '#3f3a6c', '#c87a6a', 168);
  // vale: campos e bosques
  const v = mk(240, 40), vg = v.getContext('2d');
  for (let y = 0; y < 40; y++) for (let x = 0; x < 240; x++) {
    const n = Math.sin(x * 0.09 + y * 0.31) + Math.sin(x * 0.023 - y * 0.17) * 1.4;
    vg.fillStyle = y < 6 ? '#3a4672' : n > 0.9 ? '#2a3a52' : n > -0.3 ? '#34465e' : '#3c5266';
    vg.fillRect(x, y, 1, 1);
  }
  for (let i = 0; i < 70; i++) { const x = (i * 97) % 240, y = 8 + (i * 53) % 30; vg.fillStyle = '#22304a'; vg.fillRect(x, y, 3, 2); vg.fillRect(x + 1, y - 1, 1, 1); }
  L.vale = v;
  return (SKY8.layers = L);
}
// baú de costas: tampa arredondada, tábuas, duas cintas, borda acesa pelo sol
function chestBack8() {
  const f = G.flags, ln = f.line5 || (spec().tier >= 4 && /bastiao|abismo|ferrao|carniceiro|fortaleza|espinho|ferro|arca/.test(G.species) ? 'f' : 'a');
  const P = ln === 'f' ? { body: '#7a4a2a', dark: '#4a2a18', trim: '#c8c8d8', trimD: '#8a8a9a', lid: '#8a5a32' } : { body: '#4a3a78', dark: '#2a2048', trim: '#f0c040', trimD: '#b08a20', lid: '#5a4a8a' };
  if (G.species === 'vazio') Object.assign(P, { body: '#2a2440', dark: '#16121f', trim: '#c0c8d8', trimD: '#7a8090', lid: '#3a3258' });
  if (G.species === 'arca') Object.assign(P, { trim: '#f0c040', trimD: '#b08a20' });
  const c = mk(20, 18), g = c.getContext('2d'), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R(1, 5, 18, 13, '#0a0710'); R(2, 6, 16, 11, P.body); for (let y = 8; y < 17; y += 3) R(2, y, 16, 1, P.dark);
  R(3, 1, 14, 1, '#0a0710'); R(2, 2, 16, 4, '#0a0710'); R(3, 2, 14, 3, P.lid); R(2, 5, 16, 1, P.dark);
  R(5, 1, 2, 17, P.trimD); R(13, 1, 2, 17, P.trimD); R(5, 1, 1, 17, P.trim); R(13, 1, 1, 17, P.trim);
  R(3, 1, 14, 1, '#ffd08a'); R(2, 2, 1, 3, '#ffb070'); R(17, 2, 1, 3, '#ffb070');   // contraluz
  R(4, 17, 3, 1, '#0a0710'); R(13, 17, 3, 1, '#0a0710');
  R(2, 14, 3, 3, P.trimD); R(15, 14, 3, 3, P.trimD); R(2, 6, 2, 2, P.trim); R(16, 6, 2, 2, P.trim);   // cantoneiras
  R(9, 3, 2, 2, P.trim);   // dobradiça do meio
  return c;
}
function backOf8(k) { const F = SPF[k]; return F && F.b ? F.b : null; }
function drawSky8() {
  const S = V.sky8; S.t++; const t = S.t, L = sky8Layers(), f = G.flags;
  const rise = Math.min(1, t / 360), ease = 1 - Math.pow(1 - rise, 3);
  bx.fillStyle = '#141a40'; bx.fillRect(0, 0, 240, 30);
  for (let i = 0; i < 14; i++) { const x = (i * 61 + 29) % 240, y = (i * 13 + 3) % 28; bx.globalAlpha = (1 - rise * 0.8) * ((FRAME + i * 23) % 90 < 70 ? 1 : 0.4); bx.fillStyle = '#e8ecff'; bx.fillRect(x, y, 1, 1); } bx.globalAlpha = 1;
  bx.save(); bx.translate(0, 28);
  bx.drawImage(L.sky, 0, 0);
  // estrelas somem com o sol
  if (rise < 1) for (let i = 0; i < 40; i++) { const x = (i * 71 + 13) % 240, y = (i * 37 + 5) % 52; const a = (1 - rise) * ((FRAME + i * 17) % 80 < 60 ? 0.9 : 0.4); bx.globalAlpha = a; bx.fillStyle = i % 5 ? '#c8d0ff' : '#ffe8b0'; bx.fillRect(x, y, 1, 1); }
  bx.globalAlpha = 1;
  // sol
  const sx = 168, sy = Math.round(108 - ease * 26);
  for (const [r, a, c] of [[46, 0.08, '#ffd27a'], [32, 0.12, '#ffd27a'], [22, 0.2, '#ffe2a0'], [15, 0.4, '#fff0c0']]) { bx.globalAlpha = a * (0.4 + 0.6 * ease); fxDisc(sx, sy, r, c); }
  bx.globalAlpha = 1; fxDisc(sx, sy, 11, '#fff8dc'); fxDisc(sx, sy, 8, '#ffffff');
  // raios
  bx.save(); bx.globalAlpha = 0.07 * ease; bx.fillStyle = '#fff0c0';
  for (let i = 0; i < 9; i++) { const a = -Math.PI + 0.25 + i * 0.33 + Math.sin(t / 200 + i) * 0.03; bx.beginPath(); bx.moveTo(sx, sy); bx.lineTo(sx + Math.cos(a - 0.05) * 260, sy + Math.sin(a - 0.05) * 260); bx.lineTo(sx + Math.cos(a + 0.05) * 260, sy + Math.sin(a + 0.05) * 260); bx.fill(); }
  bx.restore();
  // nuvens iluminadas por baixo
  const cloud = (cx, cy, w, k) => {
    const x = Math.round(((cx + t * k) % 300) - 40);
    bx.fillStyle = '#7a4a7e'; bx.fillRect(x + 4, cy - 3, w - 10, 3); bx.fillRect(x + 10, cy - 5, w - 24, 2);
    bx.fillStyle = '#c86a82'; bx.fillRect(x, cy, w, 3);
    bx.fillStyle = '#ffb27a'; bx.fillRect(x + 2, cy + 3, w - 4, 1); bx.fillStyle = '#ffe0a8'; bx.fillRect(x + 6, cy + 4, w - 14, 1);
  };
  cloud(10, 22, 54, 0.05); cloud(140, 34, 70, 0.035); cloud(70, 48, 40, 0.06); cloud(220, 58, 46, 0.045); cloud(40, 66, 30, 0.07);
  // pássaros
  for (let i = 0; i < 5; i++) { const x = ((t * 0.35 + i * 22) % 320) - 40, y = 40 + i * 4 + Math.sin(t / 30 + i) * 3, w = (t / 6 + i) % 2 < 1; bx.fillStyle = '#2a1f3c'; bx.fillRect(Math.round(x), Math.round(y), 1, 1); bx.fillRect(Math.round(x) - 2, Math.round(y) - (w ? 1 : 0), 2, 1); bx.fillRect(Math.round(x) + 1, Math.round(y) - (w ? 1 : 0), 2, 1); }
  // montanhas e névoa
  bx.drawImage(L.m1, 0, 0); bx.globalAlpha = 0.25; bx.fillStyle = '#f0a0a0'; bx.fillRect(0, 92, 240, 6); bx.globalAlpha = 1;
  bx.drawImage(L.m2, 0, 0);
  // Auren no morro, à direita, com os faróis cor de âmbar
  bx.fillStyle = '#34305e'; for (let x = 150; x < 240; x++) { const h = 100 - 14 * Math.sin((x - 150) / 90 * Math.PI) ; bx.fillRect(x, Math.round(h), 1, 30); }
  bx.fillStyle = '#26224a';
  for (const [x, w, h] of [[168, 6, 16], [175, 9, 12], [185, 4, 24], [190, 11, 10], [202, 5, 20], [208, 8, 13], [217, 6, 17], [224, 7, 9]]) bx.fillRect(x, 92 - h, w, h);
  bx.fillRect(166, 88, 64, 4); for (let x = 166; x < 230; x += 3) bx.fillRect(x, 86, 2, 2);   // muralha com ameias
  for (let i = 0; i < 16; i++) { const x = 168 + (i * 23) % 58, y = 74 + (i * 7) % 14; if ((FRAME + i * 31) % 120 < 100) { bx.fillStyle = '#ffcf6a'; bx.fillRect(x, y, 1, 1); } }
  for (const [x, y] of [[186, 66], [203, 70], [218, 73]]) {
    const p = 0.6 + 0.4 * Math.sin(t / 25 + x);
    bx.globalAlpha = 0.18 * p; bx.fillStyle = '#f0c040'; bx.beginPath(); const a = Math.sin(t / 90 + x) * 0.6 - 1.6; bx.moveTo(x + 1, y); bx.lineTo(x + 1 + Math.cos(a - 0.08) * 70, y + Math.sin(a - 0.08) * 70); bx.lineTo(x + 1 + Math.cos(a + 0.08) * 70, y + Math.sin(a + 0.08) * 70); bx.fill();
    bx.globalAlpha = 0.35 * p; fxDisc(x + 1, y, 4, '#f0c040'); bx.globalAlpha = 1; bx.fillStyle = '#ffe080'; bx.fillRect(x, y - 1, 2, 2);
  }
  bx.drawImage(L.m3, 0, 0);
  bx.globalAlpha = 0.3; bx.fillStyle = '#e8a0a8'; bx.fillRect(0, 102, 240, 5); bx.globalAlpha = 0.15; bx.fillRect(0, 99, 240, 10); bx.globalAlpha = 1;
  // vale e rio refletindo o sol
  bx.drawImage(L.vale, 0, 106);
  for (let y = 106; y < 146; y++) {
    const k = (y - 106) / 40, cx = 168 - k * 110 + Math.sin(y * 0.22) * 10 * (1 - k), w = 3 + k * 26;
    bx.fillStyle = y < 112 ? '#ffe2a8' : '#e89a7a'; bx.fillRect(Math.round(cx - w / 2), y, Math.round(w), 1);
    bx.fillStyle = '#c86a6a'; bx.fillRect(Math.round(cx - w / 2), y, 1, 1); bx.fillRect(Math.round(cx + w / 2) - 1, y, 1, 1);
    if ((FRAME + y * 7) % 23 < 3) { bx.fillStyle = '#fff8dc'; bx.fillRect(Math.round(cx + Math.sin(y + FRAME / 9) * w * 0.3), y, 2, 1); }
  }
  // morro da frente (contraluz): grama escura com borda dourada
  const ground = x => 138 + Math.round(4 * Math.sin(x * 0.02 + 0.5) + 2 * Math.sin(x * 0.07));
  for (let x = 0; x < 240; x++) { const y = ground(x); bx.fillStyle = '#1e2a2e'; bx.fillRect(x, y, 1, 240 - y); bx.fillStyle = '#d89058'; bx.fillRect(x, y, 1, 1); bx.fillStyle = '#5a4a3e'; bx.fillRect(x, y + 1, 1, 1); }
  for (let y = 150; y < 240; y += 2) { bx.fillStyle = y % 4 ? '#18222a' : '#1a262c'; bx.fillRect(0, y, 240, 1); }
  // flores e pedras com contraluz no morro
  for (let i = 0; i < 9; i++) { const x = (i * 83 + 7) % 236, y = 166 + (i * 31) % 26; bx.fillStyle = '#0e1418'; bx.fillRect(x, y, 1, 3); bx.fillStyle = ['#f0c040', '#e86890', '#f2ecdc'][i % 3]; bx.fillRect(x + (Math.sin(t / 20 + i) > 0.6 ? 1 : 0), y - 1, 1, 1); }
  for (const [x, y, w] of [[222, 178, 12], [6, 184, 16], [52, 190, 10]]) { bx.fillStyle = '#121a1e'; bx.fillRect(x, y, w, 5); bx.fillRect(x + 2, y - 2, w - 4, 2); bx.fillStyle = '#c88050'; bx.fillRect(x + 2, y - 2, w - 4, 1); }
  // a árvore à esquerda
  bx.fillStyle = '#120e14'; bx.fillRect(12, 70, 5, 70); bx.fillRect(16, 96, 10, 3); bx.fillRect(6, 84, 7, 3);
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 8 + (i % 5) * 4, x = 14 + Math.cos(a) * r * 1.3 + Math.sin(t / 50 + i) * 1.2, y = 62 + Math.sin(a) * r * 0.7; bx.fillStyle = '#141018'; bx.fillRect(Math.round(x) - 4, Math.round(y) - 3, 9, 6); if (i % 3 === 0) { bx.fillStyle = '#b8603e'; bx.fillRect(Math.round(x) + 3, Math.round(y) - 3, 2, 1); } }
  // folhas soltas
  for (let i = 0; i < 4; i++) { const p = ((t + i * 90) % 360) / 360, x = 18 + p * 200, y = 60 + p * 50 + Math.sin(p * 12 + i) * 6; bx.fillStyle = '#c8704a'; bx.fillRect(Math.round(x), Math.round(y), 2, 1); }
  // o 31, estacionado de traseira, e o Seu Jorge encostado
  const bxx = 34, by = 108;
  bx.fillStyle = '#0a0710'; bx.fillRect(bxx - 1, by - 1, 42, 34);
  bx.fillStyle = '#d8c890'; bx.fillRect(bxx, by, 40, 32); bx.fillStyle = '#3a70c0'; bx.fillRect(bxx, by + 20, 40, 4);
  bx.fillStyle = '#1c3058'; bx.fillRect(bxx + 4, by + 4, 32, 11); bx.fillStyle = '#ffcf6a'; bx.globalAlpha = 0.5; bx.fillRect(bxx + 6 + (t >> 5) % 4 * 7, by + 6, 5, 7); bx.globalAlpha = 1;
  bx.fillStyle = '#2a1a10'; bx.fillRect(bxx + 12, by - 6, 16, 6); txt('31', bxx + 20, by - 7 + 28, { align: 'center', col: '#ffb040' });
  bx.fillStyle = t % 50 < 25 ? '#ff5050' : '#a02828'; bx.fillRect(bxx + 2, by + 26, 4, 3); bx.fillRect(bxx + 34, by + 26, 4, 3);
  bx.fillStyle = '#ffd08a'; bx.fillRect(bxx + 39, by, 1, 32);   // contraluz na lateral
  bx.fillStyle = '#0a0710'; bx.fillRect(bxx + 4, by + 32, 8, 3); bx.fillRect(bxx + 28, by + 32, 8, 3);
  // fumacinha do escapamento
  for (let i = 0; i < 3; i++) { const p = ((t + i * 40) % 120) / 120; bx.globalAlpha = 0.4 * (1 - p); fxDisc(bxx + 6 - p * 10, by + 30 - p * 16, 2 + p * 4, '#c8b8c8'); } bx.globalAlpha = 1;
  const people = [];
  const J = backOf8('jorge'); if (J) people.push({ img: J[Math.floor(t / 40) % J.length], x: 86, y: 148 });
  if (f.musgoDone) { const M = backOf8('musgo'); if (M) people.push({ img: M[Math.floor(t / 50) % M.length], x: 214, y: 158 }); }
  if (f.dateDone) { const Rt = backOf8('rita'); if (Rt) people.push({ img: Rt[Math.floor(t / 44) % Rt.length], x: 156, y: 156 }); }
  const ofK = f.claraDone ? 'clara' : 'ofelia', O = backOf8(ofK) || backOf8('ofelia');
  if (O && (f.metOfelia || f.claraDone)) people.push({ img: O[Math.floor(t / 48) % O.length], x: 186, y: 146 + Math.sin(t / 40) * 2, ghost: true });
  people.sort((a, b) => a.y - b.y);
  for (const p of people) {
    const w = p.img.width, h = p.img.height, X = Math.round(p.x - w / 2), Y = Math.round(p.y - h);
    bx.globalAlpha = 0.4; bx.fillStyle = '#000'; bx.fillRect(Math.round(p.x - w * 0.35), Math.round(p.y) - 1, Math.round(w * 0.7), 2);
    bx.globalAlpha = p.ghost ? 0.6 + 0.15 * Math.sin(t / 30) : 1; bx.drawImage(p.img, X, Y);
    bx.globalAlpha = 0.5; bx.fillStyle = '#ffc080'; bx.fillRect(X + 2, Y, w - 4, 1); bx.globalAlpha = 1;   // contraluz no topo da cabeça
  }
  // o baú, no meio, sentado na beira, com a Lume flutuando do lado
  const cb = S.chest || (S.chest = chestBack8()), CS = 2, cx = 122, cy = 158 + Math.round(Math.abs(Math.sin(t / 70)) < 0.03 ? -1 : 0);
  bx.globalAlpha = 0.45; bx.fillStyle = '#000'; bx.fillRect(cx - 16, cy - 1, 32, 3); bx.globalAlpha = 1;
  bx.save(); bx.imageSmoothingEnabled = false; bx.drawImage(cb, cx - cb.width * CS / 2, cy - cb.height * CS, cb.width * CS, cb.height * CS); bx.restore();
  if (SP.lume) {
    const lf = SP.lume[Math.floor(t / 10) % SP.lume.length], lx = 100, ly = 124 + Math.sin(t / 36) * 3;
    bx.globalAlpha = 0.25 + 0.08 * Math.sin(t / 9); fxDisc(lx, ly - 6, 16, '#ffd060'); bx.globalAlpha = 1;
    bx.drawImage(lf, Math.round(lx - lf.width / 2), Math.round(ly - lf.height / 2 - 6));
  }
  // vagalumes / pólen dourado
  for (let i = 0; i < 18; i++) { const x = (i * 53 + Math.sin(t / 60 + i) * 12 + t * 0.1) % 240, y = 116 + (i * 29) % 70 + Math.sin(t / 25 + i * 2) * 4; if ((FRAME + i * 11) % 70 < 50) { bx.fillStyle = i % 3 ? '#ffe680' : '#fff8c0'; bx.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  // capim do primeiro plano balançando
  bx.restore();
  for (let x = 0; x < 240; x += 3) { const h = 6 + (x * 7) % 9, sw = Math.round(Math.sin(t / 22 + x * 0.15) * 2); bx.fillStyle = '#0e1418'; bx.fillRect(x, 240 - h, 1, h); bx.fillRect(x + sw, 240 - h - 2, 1, 3); }
}
// liga a paisagem no lugar do mapa
let SKY8_WRAPPED = false;
{ const _bs = buildSprites; buildSprites = function () { _bs(); if (SKY8_WRAPPED) return; SKY8_WRAPPED = true;
  const _dw = drawWorld; drawWorld = function () { if (V.sky8) { drawSky8(); WD.cy = WD.fy - 200; return; } return _dw(); };
  const _uw = updateWorld; updateWorld = function () { if (V.sky8) return; return _uw(); }; }; }
// a cena do céu: escurece, abre a paisagem e espera o sol nascer
skyScene8 = async function () {
  await fadeOut(6); V.sky8 = { t: 0 }; V.scene = 'world'; await fadeIn(60);
  await openWin({ type: 'sky8w', t: 0, update() { this.t++; if (this.t > 200 && btnp('a')) { sfx('select'); closeWin(this); } },
    draw() { if (this.t > 200 && FRAME % 50 < 34) txt('A', 228, 226, { col: '#ffffff' }); } });
};
// sobre a paisagem, a narração ganha caixa (o texto solto ficava ilegível no céu claro)
{ const _say = say; say = function (text, who, opt) { if (V.sky8 && who === 'void') who = 'n'; return _say(text, who, opt); }; }
