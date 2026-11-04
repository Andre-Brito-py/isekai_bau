// ================= CENÁRIOS DE BATALHA =================
// Estilo: fundo quase preto, cenário em 2-3 tons saturados de uma cor só, bordas com brilho, brilhos de 4 pontas,
// e um chão iluminado onde o baú e os inimigos ficam. Uma camada fixa (desenhada uma vez) + uma camada animada.
const BG_OF = {
  despertar: 'catacumba', galeria: 'catacumba', patamar: 'catacumba', biblioteca: 'biblioteca', poco: 'poco',
  mercado: 'mercado', acampamento: 'acampamento', teatro: 'teatro', ponte: 'ponte',
  escadaria3: 'fortaleza', muralhas: 'fortaleza', patio: 'acampamento', jaula: 'jaula', scriptorium: 'scriptorium',
  devolucao: 'arquivo', achados: 'arquivo', fundo: 'arquivo', estrada: 'estrada', correio: 'correio',
  terminal: 'terminal', manobras: 'terminal', garagem: 'garagem', trincheira: 'trincheira', oficina: 'trincheira',
  padaria: 'padaria', feira: 'feira', escola: 'escola', coreto: 'coreto', pontofinal: 'pontofinal',
  antessala: 'antessala', cais: 'cais', conves: 'conves', porao: 'porao', cela: 'cela',
  garganta: 'garganta', terminal8: 'ruinas', scriptorium8: 'scriptorium', biblioteca8: 'biblioteca', indice: 'indice', tampa: 'catacumba'
};
// d = sombra, m = meio, b = brilho, a = acento, f = chão
const BG_PAL = {
  catacumba: { d: '#120a24', m: '#2a1a52', b: '#6a5ad8', a: '#7ad0f0', f: '#1c1438' },
  biblioteca: { d: '#0a1626', m: '#163a5a', b: '#3a8ac8', a: '#f0c040', f: '#102438' },
  poco: { d: '#081a24', m: '#0e3a4a', b: '#2ab8c8', a: '#9ff0ff', f: '#0c2a36' },
  mercado: { d: '#0a1a1e', m: '#174a4a', b: '#3ac0a0', a: '#ffb040', f: '#0e2a2c' },
  acampamento: { d: '#1a0e08', m: '#4a2a14', b: '#c87838', a: '#ffe066', f: '#2a1a0e' },
  teatro: { d: '#1a0610', m: '#5a1028', b: '#e0406a', a: '#ffe066', f: '#2a0a18' },
  ponte: { d: '#060a1a', m: '#141e48', b: '#4a6ae0', a: '#c0d0ff', f: '#0e1430' },
  fortaleza: { d: '#0e1018', m: '#2a3048', b: '#8a9ac8', a: '#f0c040', f: '#181c2c' },
  jaula: { d: '#140c10', m: '#3a2a30', b: '#a87a68', a: '#ff6b4a', f: '#22161a' },
  scriptorium: { d: '#10081e', m: '#2a1a4a', b: '#9a6ae0', a: '#5a8af0', f: '#1a1030' },
  arquivo: { d: '#06141a', m: '#123a44', b: '#4ac0c8', a: '#e8e4dc', f: '#0c2228' },
  estrada: { d: '#080e16', m: '#1a2a3a', b: '#5a8ab0', a: '#ffd070', f: '#101a24' },
  correio: { d: '#0e0a1a', m: '#2a1e48', b: '#6a8ae0', a: '#ff6b6b', f: '#18122c' },
  terminal: { d: '#0e0c08', m: '#3a3018', b: '#d0a030', a: '#ff8030', f: '#1c1810' },
  garagem: { d: '#0c0a0e', m: '#2e2632', b: '#a088b0', a: '#ffd040', f: '#1a161c' },
  trincheira: { d: '#100c06', m: '#3a2a12', b: '#a88040', a: '#ff6030', f: '#1c160c' },
  padaria: { d: '#140c1a', m: '#3a2448', b: '#e08a5a', a: '#ffd090', f: '#1e1426' },
  feira: { d: '#0c1408', m: '#2a4418', b: '#e0a030', a: '#ff6a4a', f: '#16200e' },
  escola: { d: '#08140e', m: '#1a3a2a', b: '#6ac89a', a: '#e8e4dc', f: '#0e1e16' },
  coreto: { d: '#0a0e1e', m: '#1e2a4e', b: '#8aa0e0', a: '#ffb0d8', f: '#121830' },
  pontofinal: { d: '#08080c', m: '#1e2230', b: '#8a9ab8', a: '#ffe066', f: '#0e1018' },
  antessala: { d: '#0e0c0a', m: '#2e2820', b: '#a89068', a: '#f0c040', f: '#18140e' },
  cais: { d: '#140c02', m: '#4a2e08', b: '#e0a030', a: '#fff4c0', f: '#20160a' },
  conves: { d: '#100a06', m: '#3a2414', b: '#a87850', a: '#f0c040', f: '#1c120a' },
  porao: { d: '#0a0806', m: '#2a2016', b: '#8a7050', a: '#e0a030', f: '#14100a' },
  cela: { d: '#140406', m: '#4a1014', b: '#c84848', a: '#f0c040', f: '#1e080a' },
  garganta: { d: '#0c0806', m: '#3a2414', b: '#e0a030', a: '#ff6030', f: '#180e08' },
  ruinas: { d: '#0c0a08', m: '#2e2618', b: '#b08a40', a: '#ff8030', f: '#18140c' },
  indice: { d: '#06060e', m: '#1a1a3a', b: '#5a6ad0', a: '#a8ecff', f: '#0c0c1c' }
};
const BGC = {};
function bgRand(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function bgSpark(x, px, py, col, big) { x.fillStyle = col; x.fillRect(px, py, 1, 1); x.fillRect(px - 1, py, 3, 1); x.fillRect(px, py - 1, 1, 3); if (big) { x.fillRect(px - 2, py, 5, 1); x.fillRect(px, py - 2, 1, 5); } }
function bgPaint(k) {
  if (BGC[k]) return BGC[k];
  const P = BG_PAL[k], c = mk(240, 136), x = c.getContext('2d'), R = bgRand(k.length * 977 + k.charCodeAt(0) * 31);
  const r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
  const ell = (cx, cy, rx, ry, col) => { for (let yy = -ry; yy <= ry; yy++) { const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - yy * yy / (ry * ry)))); r(cx - hw, cy + yy, hw * 2 + 1, 1, col); } };
  const line = (x0, y0, x1, y1, col) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) r(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1, 1, col); };
  // silhueta com borda brilhante no topo
  const block = (a, b, w, h, fill, rim) => { r(a, b, w, h, fill); r(a, b, w, 1, rim); r(a, b, 1, h, rim); };
  r(0, 0, 240, 136, '#07050c');
  // brilho de fundo (gradiente em faixas)
  for (let i = 0; i < 6; i++) { x.globalAlpha = 0.07 + i * 0.02; ell(120, 74, 150 - i * 20, 46 - i * 6, P.m); } x.globalAlpha = 1;
  const SKY = 64; // linha do horizonte (o chão começa aqui)
  switch (k) {
    case 'catacumba': {
      for (let i = 0; i < 5; i++) { const ax = i * 54 - 10, w = 40; r(ax, 6, w, SKY - 6, P.d); ell(ax + w / 2, 18, w / 2 - 6, 12, '#07050c'); r(ax + 6, 18, w - 12, SKY - 18, '#07050c'); for (let y = 8; y < SKY; y += 6) { r(ax, y, 6, 1, P.m); r(ax + w - 6, y + 3, 6, 1, P.m); } r(ax, 6, w, 1, P.b); r(ax + 5, 18, 1, SKY - 18, P.b); }
      for (let i = 0; i < 9; i++) { const vx = 8 + R() * 224, vl = 6 + R() * 18; line(vx, 0, vx + (R() - 0.5) * 4, vl, '#2a6a4a'); r(vx, vl, 2, 2, '#4a9a4a'); }
      for (let i = 0; i < 3; i++) { const cx = 34 + i * 86; r(cx, SKY - 14, 3, 8, '#e8dcc0'); r(cx + 1, SKY - 17, 1, 3, P.a); }
      // cristais de runa crescendo nas paredes
      for (const [cx, cy, h] of [[16, 40, 10], [70, 52, 7], [128, 46, 9], [176, 54, 6], [222, 42, 11]]) { for (let j = 0; j < h; j++) { const w = Math.max(1, Math.round((h - j) / 3)); r(cx - w, cy - j, w * 2 + 1, 1, j > h - 3 ? '#ffffff' : P.a); } r(cx - 1, cy - h + 2, 1, h - 3, '#ffffff'); x.globalAlpha = 0.15; ell(cx, cy - h / 2, 8, h, P.a); x.globalAlpha = 1; }
      for (let i = 0; i < 240; i += 4) r(i, SKY - 3 - (i % 8 ? 0 : 1), 3, 1, P.m);
      break;
    }
    case 'biblioteca': case 'scriptorium': {
      const cols = [P.a, P.b, '#c83838', '#4a9a4a', '#e8dcc0', P.m];
      for (let s = 0; s < 4; s++) { const sx = s * 62 - 4; block(sx, 4, 52, SKY - 4, P.d, P.b); for (let row = 0; row < 4; row++) { const sy = 10 + row * 15; r(sx + 3, sy + 11, 46, 2, P.m); let bxp = sx + 4; while (bxp < sx + 46) { const bw = 2 + Math.floor(R() * 3), bh = 7 + Math.floor(R() * 4); r(bxp, sy + 11 - bh, bw, bh, cols[Math.floor(R() * cols.length)]); r(bxp, sy + 11 - bh, bw, 1, '#07050c'); bxp += bw + (R() < 0.15 ? 3 : 0); } } }
      if (k === 'scriptorium') { for (let i = 0; i < 4; i++) { const dx = 20 + i * 60, dy = 14 + (i % 2) * 14; r(dx, dy, 26, 3, P.b); r(dx + 2, dy + 3, 2, 8, P.m); r(dx + 22, dy + 3, 2, 8, P.m); line(dx + 13, 0, dx + 13, dy, P.m); } }
      break;
    }
    case 'poco': {
      ell(120, 30, 70, 26, P.d); ell(120, 30, 62, 21, '#07050c');
      for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; r(120 + Math.cos(a) * 66, 30 + Math.sin(a) * 23, 2, 1, i % 3 ? P.m : P.a); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; bgSpark(x, Math.round(120 + Math.cos(a) * 44), Math.round(30 + Math.sin(a) * 14), P.b); }
      for (let i = 0; i < 4; i++) { block(i < 2 ? i * 22 : 196 + (i - 2) * 22, 10, 18, SKY - 10, P.d, P.b); }
      break;
    }
    case 'mercado': {
      for (let i = 0; i < 4; i++) { const sx = 6 + i * 60; r(sx + 4, 24, 3, SKY - 24, P.d); r(sx + 41, 24, 3, SKY - 24, P.d); for (let j = 0; j < 6; j++) { r(sx + j * 8, 16, 8, 8, j % 2 ? P.m : P.b); r(sx + j * 8, 24, 8, 2, '#07050c'); } r(sx, 15, 48, 1, P.a); r(sx + 6, SKY - 22, 36, 12, P.d); r(sx + 6, SKY - 22, 36, 1, P.b); for (let j = 0; j < 4; j++) r(sx + 10 + j * 8, SKY - 26, 5, 4, [P.a, '#c83838', '#9be58a', '#e8dcc0'][j]); }
      for (let i = 0; i < 5; i++) { const lx = 30 + i * 46; line(lx, 0, lx, 6, P.m); r(lx - 2, 6, 5, 6, P.a); r(lx - 1, 7, 3, 4, '#fff4c0'); }
      break;
    }
    case 'acampamento': {
      for (let i = 0; i < 9; i++) { const sx = R() * 240, sy = 2 + R() * 30; bgSpark(x, Math.round(sx), Math.round(sy), '#5a4a30'); }
      for (const [tx, tw] of [[4, 64], [168, 68]]) { for (let y = 0; y < 44; y++) { const hw = Math.round(tw / 2 * y / 44); r(tx + tw / 2 - hw, SKY - 44 + y, hw * 2, 1, y % 8 === 0 ? P.b : P.m); } line(tx + tw / 2, SKY - 44, tx, SKY, P.b); r(tx + tw / 2 - 4, SKY - 18, 8, 18, '#07050c'); line(tx + tw / 2, SKY - 52, tx + tw / 2, SKY - 44, P.d); r(tx + tw / 2, SKY - 52, 10, 5, '#c83838'); }
      ell(120, SKY - 2, 10, 3, P.d); for (let i = 0; i < 5; i++) r(112 + i * 4, SKY - 6, 3, 4, '#5a3420');
      break;
    }
    case 'teatro': {
      for (let i = 0; i < 26; i++) { const cx = i * 10; r(cx, 0, 10, 18, i % 2 ? P.m : P.b); r(cx + 4, 0, 2, 18, P.d); } for (let i = 0; i < 26; i++) ell(i * 10 + 5, 18, 5, 2, i % 2 ? P.m : P.b);
      for (const side of [0, 1]) for (let i = 0; i < 6; i++) { const cx = side ? 240 - 8 - i * 6 : i * 6; r(cx, 0, 6, SKY + 4, i % 2 ? P.m : P.d); r(cx + 2, 0, 1, SKY + 4, P.b); }
      r(100, 0, 1, 8, P.a); r(140, 0, 1, 8, P.a); ell(120, 10, 22, 4, P.d); for (let i = 0; i < 7; i++) { r(102 + i * 6, 12, 2, 3, '#fff4c0'); r(102 + i * 6, 11, 2, 1, P.a); }
      x.globalAlpha = 0.06; for (let y = 16; y < SKY + 30; y++) { const hw = (y - 16) * 0.9; r(60 - hw / 2, y, hw, 1, '#fff4c0'); r(180 - hw / 2, y, hw, 1, '#fff4c0'); } x.globalAlpha = 1;
      break;
    }
    case 'ponte': {
      for (let i = 0; i < 40; i++) bgSpark(x, Math.round(R() * 240), Math.round(R() * 50), R() < 0.3 ? P.a : P.m, R() < 0.1);
      r(0, 38, 240, 4, P.m); r(0, 38, 240, 1, P.b); for (let i = 0; i < 240; i += 12) { r(i, 28, 2, 10, P.m); r(i, 28, 2, 1, P.b); } r(0, 28, 240, 1, P.b);
      line(120, 0, 120, 10, P.m); ell(120, 16, 9, 7, P.d); r(111, 16, 19, 7, P.d); r(111, 22, 19, 2, P.b); ell(120, 14, 7, 5, P.m); r(119, 23, 2, 3, P.a);
      for (let y = 44; y < SKY; y += 3) { x.globalAlpha = 0.25; r(0, y, 240, 1, P.m); } x.globalAlpha = 1;
      break;
    }
    case 'fortaleza': {
      for (let i = 0; i < 240; i += 14) { block(i, 10, 10, 8, P.m, P.b); } block(0, 18, 240, SKY - 18, P.d, P.b);
      for (let y = 22; y < SKY; y += 7) for (let i = (y / 7 % 2) * 8; i < 240; i += 16) r(i, y, 14, 1, P.m);
      for (const bx0 of [40, 190]) { r(bx0, 20, 14, 30, '#2a3a8a'); r(bx0, 20, 14, 1, P.a); r(bx0 + 5, 30, 4, 4, P.a); for (let i = 0; i < 7; i++) r(bx0 + i * 2, 50, 1, 1 + (i % 2) * 2, '#2a3a8a'); }
      for (const tx of [100, 140]) { r(tx, 34, 2, 10, P.m); r(tx - 1, 30, 4, 4, '#ff8030'); r(tx, 29, 2, 2, P.a); }
      break;
    }
    case 'jaula': {
      for (let i = 0; i < 4; i++) { const cx = 8 + i * 60; r(cx, 8, 46, 4, P.m); r(cx, 8, 46, 1, P.b); for (let j = 0; j < 7; j++) { r(cx + 2 + j * 7, 12, 2, SKY - 18, P.m); r(cx + 2 + j * 7, 12, 1, SKY - 18, P.b); } r(cx, SKY - 6, 46, 3, P.m); bgSpark(x, cx + 14 + (i % 2) * 18, 32, P.a); bgSpark(x, cx + 19 + (i % 2) * 18, 32, P.a); }
      for (let i = 0; i < 3; i++) { const cx = 30 + i * 90; for (let j = 0; j < 7; j++) r(cx + (j % 2), j * 3, 2, 2, P.b); }
      break;
    }
    case 'arquivo': {
      for (let s = 0; s < 5; s++) { const sx = s * 50 - 4, sh = 40 + (s % 2) * 18; block(sx, SKY - sh, 42, sh, P.d, P.b); for (let row = 0; row * 10 < sh - 4; row++) for (let col = 0; col < 3; col++) { const gx = sx + 3 + col * 13, gy = SKY - sh + 3 + row * 10; r(gx, gy, 11, 8, P.m); r(gx + 4, gy + 3, 3, 1, P.a); } }
      for (let i = 0; i < 10; i++) { const sx = R() * 240, sy = R() * 30; r(sx, sy, 2, 2, P.a); r(sx + 1, sy - 1, 1, 1, '#ffffff'); }
      x.globalAlpha = 0.35; r(0, SKY - 10, 240, 10, P.b); x.globalAlpha = 1; for (let i = 0; i < 240; i += 6) r(i, SKY - 10 + (i % 12 ? 0 : 1), 4, 1, P.a);
      break;
    }
    case 'estrada': {
      for (let i = 0; i < 30; i++) bgSpark(x, Math.round(R() * 240), Math.round(R() * 30), P.m);
      for (let i = 0; i < 4; i++) { const lx = 20 + i * 66; r(lx, 12, 3, SKY - 12, P.m); r(lx, 12, 1, SKY - 12, P.b); r(lx - 4, 8, 11, 5, P.d); r(lx - 3, 9, 9, 3, P.a); x.globalAlpha = 0.15; ell(lx + 1, SKY + 2, 16, 4, P.a); x.globalAlpha = 1; }
      block(150, 22, 30, 14, '#1a4a2a', '#4a9a4a'); r(164, 36, 2, SKY - 36, P.m); r(155, 27, 20, 1, '#e8dcc0'); r(155, 30, 14, 1, '#e8dcc0');
      x.globalAlpha = 0.3; r(0, SKY - 14, 240, 14, P.b); x.globalAlpha = 1; for (let i = 0; i < 240; i += 9) r(i, SKY - 14, 6, 1, P.b);
      break;
    }
    case 'correio': {
      for (let i = 0; i < 6; i++) { const mx = 8 + i * 40; block(mx, SKY - 30, 22, 30, '#7a1a1a', '#e05050'); ell(mx + 11, SKY - 30, 11, 5, '#7a1a1a'); ell(mx + 11, SKY - 30, 10, 4, '#a82828'); r(mx + 5, SKY - 22, 12, 2, '#07050c'); }
      for (let i = 0; i < 9; i++) { const lx = R() * 230, ly = 4 + R() * 30; r(lx, ly, 8, 5, '#e8dcc0'); line(lx, ly, lx + 4, ly + 3, '#8a8099'); line(lx + 4, ly + 3, lx + 7, ly, '#8a8099'); }
      x.globalAlpha = 0.3; r(0, SKY - 6, 240, 6, P.b); x.globalAlpha = 1;
      break;
    }
    case 'terminal': case 'garagem': {
      block(0, 4, 240, 6, P.m, P.b); for (let i = 0; i < 240; i += 30) r(i, 10, 3, SKY - 10, P.m);
      for (let i = 0; i < 4; i++) { const lx = 14 + i * 60; r(lx, 10, 1, 4, P.m); r(lx - 6, 14, 14, 3, P.a); x.globalAlpha = 0.06; for (let y = 17; y < SKY; y++) r(lx + 1 - (y - 17) * 0.6, y, (y - 17) * 1.2, 1, '#fff4c0'); x.globalAlpha = 1; }
      if (k === 'terminal') { block(70, 18, 100, 16, '#101010', P.b); for (let i = 0; i < 4; i++) { r(74, 21 + i * 3, 30, 1, P.a); r(110, 21 + i * 3, 50, 1, i % 2 ? P.a : '#8a8099'); } }
      else { block(26, SKY - 34, 120, 30, '#2a3a5a', '#7a9ac8'); for (let i = 0; i < 6; i++) r(32 + i * 18, SKY - 30, 14, 10, '#0a1020'); r(26, SKY - 14, 120, 3, P.a); ell(50, SKY - 4, 7, 6, '#07050c'); ell(122, SKY - 4, 7, 6, '#07050c'); r(30, SKY - 34, 18, 5, '#ffd040'); }
      break;
    }
    case 'trincheira': {
      for (let i = 0; i < 6; i++) { x.globalAlpha = 0.2; ell(30 + i * 44, 14 + (i % 2) * 8, 26, 10, P.m); } x.globalAlpha = 1;
      for (let i = 0; i < 240; i += 3) { r(i, 34 + Math.round(Math.sin(i * 0.4) * 2), 1, 1, P.b); if (i % 18 === 0) { line(i, 31, i + 3, 37, P.b); line(i + 3, 31, i, 37, P.b); } }
      for (let row = 0; row < 3; row++) for (let i = -(row % 2) * 9; i < 240; i += 18) { const sy = SKY - 8 - row * 7; ell(i + 8, sy, 9, 4, P.m); r(i + 1, sy - 4, 15, 1, P.b); r(i + 7, sy - 1, 2, 1, P.d); }
      for (const gx of [60, 180]) { for (let a = 0; a < 8; a++) { const t = a / 8 * Math.PI * 2; r(gx + Math.cos(t) * 8, 20 + Math.sin(t) * 8, 3, 3, P.d); } ell(gx, 20, 6, 6, P.d); ell(gx, 20, 2, 2, P.a); }
      break;
    }
  }
  switch (k) {
    case 'padaria': {
      for (let i = 0; i < 14; i++) { x.globalAlpha = 0.5 - i * 0.03; r(0, i * 3, 240, 3, i < 6 ? '#2a1a3a' : '#5a2a4a'); } x.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const bxp = i * 42 - 6, bh = 30 + (i % 3) * 10; block(bxp, SKY - bh, 38, bh, P.d, P.m); for (let wy = SKY - bh + 5; wy < SKY - 8; wy += 9) for (let wx = bxp + 4; wx < bxp + 34; wx += 9) r(wx, wy, 5, 5, R() < 0.4 ? P.a : '#1a1020'); }
      block(84, SKY - 34, 72, 34, '#3a2030', P.b); r(90, SKY - 30, 60, 8, '#1a1020'); r(94, SKY - 28, 52, 4, P.a); r(92, SKY - 18, 26, 18, '#ffd090'); r(126, SKY - 18, 22, 12, '#1a1020'); for (let i = 0; i < 4; i++) r(130 + i * 4, SKY - 14, 2, 2, '#e8b860');
      r(30, SKY - 22, 30, 3, '#3a70c0'); r(32, SKY - 19, 1, 19, '#9aa0aa'); r(57, SKY - 19, 1, 19, '#9aa0aa'); x.globalAlpha = 0.3; r(33, SKY - 19, 24, 12, '#bfe8f0'); x.globalAlpha = 1;
      break;
    }
    case 'feira': {
      for (let i = 0; i < 6; i++) { const sx = i * 42 - 8; const cols = [['#c83838', '#f2ecdc'], ['#3a70c0', '#f2ecdc'], ['#4a9a4a', '#f0c040'], ['#f07830', '#fff4c0']][i % 4]; r(sx, 20, 40, 14, '#07050c'); for (let j = 0; j < 40; j += 5) r(sx + j, 21, 5, 10, (j / 5) % 2 ? cols[1] : cols[0]); r(sx + 2, 34, 2, SKY - 34, P.m); r(sx + 36, 34, 2, SKY - 34, P.m); r(sx + 4, SKY - 14, 32, 10, '#5a3420'); for (let j = 0; j < 7; j++) r(sx + 6 + j * 4, SKY - 17, 3, 3, ['#f07830', '#4a9a4a', '#c83838', '#f0c040', '#e86890'][j % 5]); }
      for (let i = 0; i < 12; i++) { const fx0 = R() * 240; line(fx0, 0, fx0 + 10, 18, '#3a3448'); r(fx0 + 10, 18, 2, 2, ['#f0c040', '#e86890', '#7ad0f0'][i % 3]); }
      break;
    }
    case 'escola': {
      block(0, 4, 240, SKY - 4, P.d, P.b); for (let i = 0; i < 4; i++) { const lx = 16 + i * 58; r(lx, 12, 44, 26, '#120e14'); r(lx + 1, 13, 42, 24, '#1f3a2a'); r(lx + 4, 17, 20, 1, '#9ab8a8'); r(lx + 4, 22, 30, 1, '#9ab8a8'); r(lx + 4, 27, 14, 1, '#9ab8a8'); r(lx, 38, 44, 2, '#7a4a2a'); }
      for (let i = 0; i < 20; i++) r(i * 12 + 2, SKY - 16, 10, 16, ['#3a70c0', '#4a9a4a', '#c8962a', '#c83838'][i % 4]); for (let i = 0; i < 20; i++) { r(i * 12 + 4, SKY - 12, 6, 1, '#120e14'); r(i * 12 + 8, SKY - 8, 1, 2, '#e8e4dc'); }
      r(108, 2, 24, 8, '#e8e4dc'); r(119, 3, 1, 4, '#120e14'); r(119, 6, 4, 1, '#120e14');
      break;
    }
    case 'coreto': {
      for (let i = 0; i < 40; i++) bgSpark(x, Math.round(R() * 240), Math.round(R() * 40), P.m);
      for (const tx of [14, 52, 188, 226]) { ell(tx, 30, 16, 12, '#14301e'); ell(tx - 3, 27, 9, 6, '#24482e'); r(tx - 2, 40, 4, SKY - 40, '#2a1a10'); }
      ell(120, SKY - 2, 52, 6, '#3a4a2a'); ell(120, SKY - 4, 46, 5, '#5a7a3a');
      r(80, SKY - 30, 80, 24, '#07050c'); for (let i = 0; i < 9; i++) r(82 + i * 9, SKY - 28, 2, 22, '#e8e4dc'); r(78, SKY - 8, 84, 3, '#c8962a'); r(78, SKY - 30, 84, 3, '#c8962a');
      for (let i = 0; i < 26; i++) { const hw = Math.round(i * 1.8); r(120 - hw, SKY - 56 + i, hw * 2, 1, i % 6 === 0 ? P.b : P.m); } r(118, SKY - 62, 4, 6, '#c8962a');
      for (const lx of [62, 178]) { r(lx, 20, 2, SKY - 20, '#3a3448'); ell(lx + 1, 18, 4, 4, '#3a3448'); ell(lx + 1, 18, 2, 2, '#ffe9a0'); x.globalAlpha = 0.12; ell(lx + 1, 18, 12, 12, '#ffe9a0'); x.globalAlpha = 1; }
      break;
    }
    case 'antessala': {
      ell(120, 30, 46, 30, '#2a241e'); ell(120, 30, 42, 27, '#3a342e'); for (let i = 0; i < 31; i++) { const a = -Math.PI / 2 + (i / 31) * Math.PI * 2, rx = 120 + Math.cos(a) * 36, ry = 30 + Math.sin(a) * 23; r(rx - 1, ry - 1, 3, 3, '#07050c'); if (i % 3 === 0) r(rx, ry, 1, 1, P.a); }
      r(116, 22, 8, 12, '#07050c'); r(118, 18, 4, 4, P.a); r(119, 26, 2, 2, '#07050c'); r(118, 54, 4, 5, '#07050c');
      block(4, SKY - 26, 60, 22, '#e8d8a0', '#ffffff'); r(4, SKY - 12, 60, 3, '#3a70c0'); for (let i = 0; i < 4; i++) r(8 + i * 14, SKY - 23, 10, 8, '#1c3058'); r(30, SKY - 30, 18, 5, '#2a1a10'); r(34, SKY - 29, 10, 3, '#ffb040');
      for (const tx of [176, 206]) { for (let y = 0; y < 24; y++) { const hw = Math.round(14 * y / 24); r(tx - hw, SKY - 24 + y, hw * 2, 1, y % 6 ? '#4a3a2a' : '#6a5a3a'); } }
      break;
    }
    case 'cais': case 'conves': {
      for (let y = 0; y < SKY; y++) { x.globalAlpha = 0.25 + y / SKY * 0.4; r(0, y, 240, 1, y % 5 ? P.m : P.b); } x.globalAlpha = 1;
      for (let i = 0; i < 14; i++) { const fx0 = R() * 240, fy = 10 + R() * (SKY - 20); ell(fx0, fy, 3, 2, P.d); r(fx0 - 1, fy - 1, 2, 1, P.a); }
      if (k === 'cais') { for (const px of [30, 90, 150, 210]) { r(px, SKY - 30, 4, 30, '#3a2414'); r(px - 2, SKY - 32, 8, 3, '#5a3a24'); } r(0, SKY - 18, 240, 3, '#5a3a24'); }
      else { r(20, 0, 5, SKY, '#3a2414'); r(22, 0, 1, SKY, '#5a3a24'); for (let i = 0; i < 5; i++) line(25, 4 + i * 8, 110 - i * 12, SKY - 4, '#5a4a3a'); r(170, 4, 50, 26, '#d8c8a0'); r(170, 4, 50, 2, '#ffffff'); line(170, 30, 195, 50, '#5a4a3a'); line(220, 30, 195, 50, '#5a4a3a'); ell(194, 34, 22, 22, '#5a3420'); ell(194, 34, 19, 19, '#07050c'); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; line(194, 34, 194 + Math.cos(a) * 19, 34 + Math.sin(a) * 19, '#7a4a2a'); } }
      break;
    }
    case 'porao': {
      for (let i = 0; i < 6; i++) { block(i * 42 - 4, 10, 36, SKY - 10, P.d, P.m); for (let y = 16; y < SKY - 4; y += 10) r(i * 42, y, 28, 2, P.m); }
      for (let i = 0; i < 8; i++) { const cx = 10 + i * 30; for (let j = 0; j < 9; j++) r(cx + (j % 2), j * 3, 2, 2, '#6a6078'); if (i % 2) { r(cx - 2, 27, 6, 6, '#07050c'); r(cx, 29, 2, 2, P.a); } }
      for (let i = 0; i < 4; i++) { const cx = 28 + i * 60; r(cx, SKY - 30, 6, 30, '#c8962a'); r(cx + 1, SKY - 30, 2, 30, '#f0c040'); r(cx + 1, SKY - 22, 3, 6, '#7a4a08'); }
      break;
    }
    case 'cela': {
      ell(120, 32, 54, 34, '#2a0a0c'); ell(120, 32, 48, 30, '#4a1014'); r(102, 12, 36, 42, '#07050c'); ell(120, 32, 14, 16, '#c84848'); r(114, 22, 12, 20, '#07050c'); r(116, 24, 8, 16, '#fff4c0'); ell(120, 32, 3, 3, '#07050c'); r(114, 20, 12, 2, P.a);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(120 + Math.cos(a) * 50, 32 + Math.sin(a) * 30, 120 + Math.cos(a) * 64, 32 + Math.sin(a) * 40, '#5a1418'); }
      for (let i = 0; i < 20; i++) r(R() * 240, SKY - 4 - R() * 6, 3, 2, '#e8dcc0');
      break;
    }
    case 'garganta': {
      for (let i = 0; i < 7; i++) { const ax = i * 38 - 6; ell(ax + 16, SKY - 4, 22, SKY - 8, P.d); ell(ax + 16, SKY - 2, 18, SKY - 14, '#07050c'); }
      for (let i = 0; i < 26; i++) { const sx = R() * 240, sy = R() * (SKY - 10); r(sx, sy, 2 + R() * 4, 2, P.m); }
      r(0, SKY - 6, 240, 2, '#5a4a3a'); for (let i = 0; i < 240; i += 10) r(i, SKY - 5, 6, 4, '#3a2a1a');
      for (let i = 0; i < 240; i += 3) r(i, SKY - 8, 3, 1, i % 6 ? P.a : '#ffe066');
      for (const [cx, w] of [[30, 26], [130, 40], [200, 22]]) { for (let j = 0; j < 8; j++) r(cx - w / 2 + j * w / 8, 2 + (j % 3) * 4, w / 8 - 1, 10 - (j % 3) * 4, P.d); }
      break;
    }
    case 'ruinas': {
      for (let i = 0; i < 5; i++) { block(i * 50 + 4, 12, 30, SKY - 12, P.d, P.b); r(i * 50 + 8, 18, 22, 10, '#07050c'); x.globalAlpha = 0.4; r(i * 50 + 9, 19, 20, 8, '#3a4a6a'); x.globalAlpha = 1; }
      r(0, 8, 240, 4, P.m); r(0, 8, 240, 1, P.b); line(40, 8, 90, SKY - 6, '#5a4a3a'); line(41, 8, 91, SKY - 6, '#3a2a1a'); line(170, 8, 140, SKY - 2, '#5a4a3a');
      r(96, 2, 48, 9, '#07050c'); r(97, 3, 46, 7, '#1c1810'); for (let i = 0; i < 6; i++) r(100 + i * 7, 5, 5, 3, i % 2 ? '#ff8030' : '#3a2a10');
      for (let i = 0; i < 12; i++) r(R() * 240, SKY - 4 - R() * 6, 4, 3, '#4a3a2a');
      break;
    }
    case 'indice': {
      for (const s of [0, 1]) { const x0 = s ? 124 : 4; r(x0, 4, 112, SKY - 8, '#12122a'); r(x0, 4, 112, 1, P.b); for (let l = 0; l < 9; l++) r(x0 + 6, 10 + l * 6, 30 + ((l * 37 + s * 11) % 70), 1, P.m); }
      r(118, 2, 4, SKY - 4, '#2a2448');
      break;
    }
    case 'pontofinal': {
      for (let i = 0; i < 8; i++) { x.globalAlpha = 0.18; ell(30 + i * 30, 26 + (i % 3) * 8, 28, 10, P.m); } x.globalAlpha = 1;
      r(150, SKY - 30, 80, 26, '#07050c'); x.globalAlpha = 0.5; r(151, SKY - 29, 78, 24, '#3a4a5a'); x.globalAlpha = 1; for (let i = 0; i < 6; i++) r(156 + i * 12, SKY - 26, 8, 8, '#1a2030'); r(150, SKY - 12, 80, 3, '#3a70c0'); r(208, SKY - 36, 22, 6, '#2a1a10'); r(212, SKY - 35, 14, 4, P.a);
      for (let i = 0; i < 8; i++) { const fx0 = 140 - i * 16, fh = 14 + (i % 3) * 2; x.globalAlpha = 0.85 - i * 0.08; r(fx0, SKY - fh, 8, fh, '#2a3240'); ell(fx0 + 4, SKY - fh - 3, 3, 3, '#2a3240'); x.globalAlpha = 1; }
      r(20, SKY - 30, 2, 30, '#5a6070'); r(14, SKY - 34, 14, 6, '#e8e4dc'); r(16, SKY - 32, 10, 1, '#3a3448'); r(16, SKY - 30, 6, 1, '#c83838');
      break;
    }
  }
  // chão: faixa escura com linhas em perspectiva e um disco iluminado onde as lutas acontecem
  r(0, SKY, 240, 136 - SKY, P.f);
  for (let i = -8; i <= 8; i++) line(120 + i * 6, SKY, 120 + i * 40, 136, P.d);
  for (let y = SKY + 4, s = 3; y < 136; y += s, s += 2) r(0, y, 240, 1, P.d);
  x.globalAlpha = 0.45; ell(120, 104, 118, 26, P.m); x.globalAlpha = 0.35; ell(120, 104, 100, 18, P.m); x.globalAlpha = 1;
  r(0, SKY, 240, 1, P.b);
  return (BGC[k] = c);
}
function bgAnim(k) {
  const P = BG_PAL[k], t = FRAME;
  // brilhos de 4 pontas que piscam devagar
  for (let i = 0; i < 6; i++) { const ph = (t / 70 + i * 0.37) % 1; if (ph < 0.5) { const px = (i * 53 + 17) % 230 + 5, py = (i * 29 + 7) % 60 + 4; bx.globalAlpha = Math.sin(ph * 2 * Math.PI); bgSpark(bx, px, py, P.a, ph > 0.2 && ph < 0.3); bx.globalAlpha = 1; } }
  if (k === 'poco' || k === 'arquivo' || k === 'estrada' || k === 'correio' || k === 'mercado') { bx.globalAlpha = 0.35; bx.fillStyle = P.b; for (let i = 0; i < 240; i += 10) bx.fillRect((i + t / 3) % 250 - 5, 66 + (i % 20 ? 3 : 5), 5, 1); bx.globalAlpha = 1; }
  if (k === 'acampamento' || k === 'fortaleza' || k === 'trincheira') { for (let i = 0; i < 4; i++) { const ex = ((i * 61 + t * 0.4) % 240), ey = 66 - ((t * 0.6 + i * 23) % 60); bx.fillStyle = i % 2 ? P.a : '#ff8030'; bx.fillRect(Math.round(ex), Math.round(ey), 1, 1); } }
  if (k === 'teatro' && t % 120 < 60) { bx.globalAlpha = 0.08; bx.fillStyle = '#fff4c0'; bx.fillRect(0, 0, 240, 104); bx.globalAlpha = 1; }
  if (k === 'catacumba' && t % 90 < 30) { bx.fillStyle = P.a; bx.fillRect(40 + (t % 180 < 90 ? 0 : 120), 8 + (t % 90) / 2, 1, 2); }
  if (k === 'biblioteca' || k === 'scriptorium') { const px = (t * 0.5) % 260 - 10, py = 30 + Math.sin(t * 0.05) * 10; bx.fillStyle = '#e8dcc0'; bx.fillRect(Math.round(px), Math.round(py), 5, 4); bx.fillStyle = '#8a8099'; bx.fillRect(Math.round(px) + 1, Math.round(py) + 1, 3, 1); }
}
// fundo da arena: usado pela batalha no lugar da grade antiga
function drawBattleBg() {
  const k = (WD.map && WD.map.battleScene) || BG_OF[WD.id] || 'catacumba';
  bx.drawImage(bgPaint(k), 0, 0);
  bgAnim(k);
  if (BT.opts && BT.opts.boss) { bx.globalAlpha = 0.18 + 0.06 * Math.sin(FRAME * 0.05); bx.fillStyle = BG_PAL[k].a; bx.fillRect(0, 0, 240, 2); bx.fillRect(0, 130, 240, 2); bx.globalAlpha = 1; }
}
