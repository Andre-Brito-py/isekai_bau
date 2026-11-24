// ================= AS FORMAS DO BAÚ (pedido do usuário: "ao evoluir, mudava de forma, e você via as formas") =================
// Cada evolução agora TROCA O CORPO INTEIRO do baú (como na T1), em vez de só pôr um enfeite em cima:
//   Cap. 3: ARCA-FAROL (madeira azul-noite, latão, lanterna de farol na tampa), ARCA DO VÃO (roxo, rachaduras com
//   estrelas dentro, um pedaço da tampa flutuando), ARCA-ESCRIBA (madeira clara cheia de runas a tinta, pena na
//   tampa, folhas saindo pela fresta).
//   Cap. 7: FAROL-GUARDIÃO (ouro, ameias de castelo, escudo com farol), FAROL-TEMPESTADE (ardósia, para-raios e luz
//   de raio), VÃO-LABIRINTO (labirinto gravado, porta pequena), VÃO-BOCA (carmim, dentes para fora, língua),
//   ESCRIBA-BIBLIOTECÁRIO (o corpo é uma estante de lombadas, livro aberto na tampa, fitas), ESCRIBA-PALIMPSESTO
//   (pergaminho raspado e reescrito em vermelho, duas penas cruzadas).
// Arte gerada em pixel (44x46 na luta, 16x16 no mapa, retrato a partir da frente). G.species (a linha da T1) não
// muda: só a ARTE passa a vir da forma (IMG.chest / IMG.chestMap respondem pela forma quando há evolução).
// A escolha virou uma TELA com as formas lado a lado, e a evolução tem animação de transformação.
// Saves que já tinham evoluído no Cap. 3 (e ainda não fecharam o capítulo) podem voltar para antes do veio.

const ARCA = {
  farol: { madeira: '#2e3c78', metal: '#d0a040', olho: '#ffe080', luz: '#ffe080', nm: 'Arca-Farol' },
  vao: { madeira: '#3a2458', metal: '#a8b0c8', olho: '#d0a8ff', dentro: 'estrelas', nm: 'Arca do Vão' },
  escriba: { madeira: '#cbb88e', metal: '#4a7a76', olho: '#8fe3d8', nm: 'Arca-Escriba' },
  guardiao: { madeira: '#24306a', metal: '#f0c040', olho: '#ffe080', luz: '#fff0a0', nm: 'Farol-Guardião' },
  tempestade: { madeira: '#2c3648', metal: '#5aa8c0', olho: '#bff0ff', luz: '#bff0ff', nm: 'Farol-Tempestade' },
  labirinto: { madeira: '#2a1a48', metal: '#b890f0', olho: '#e0c8ff', dentro: 'estrelas', nm: 'Vão-Labirinto' },
  boca: { madeira: '#7a1e30', metal: '#4a4048', olho: '#ffcc40', dentro: 'boca', nm: 'Vão-Boca' },
  bibliotecario: { madeira: '#6a4428', metal: '#c8a040', olho: '#8fe3d8', nm: 'Escriba-Bibliotecário' },
  palimpsesto: { madeira: '#ddd0b2', metal: '#6a3030', olho: '#ff7a6a', nm: 'Escriba-Palimpsesto' }
};
function formaArca() { const e7 = typeof evo7 === 'function' ? evo7() : G.evo7, e3 = typeof evo3 === 'function' ? evo3() : G.evo3; return e7 && ARCA[e7] ? e7 : e3 && ARCA[e3] ? e3 : null; }
const hshA = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

// ---------- o corpo grande (luta) ----------
function arcaCorpo(k, gap) {
  const F = ARCA[k], P = new Pix(44, 46), R = ramp(F.madeira), M = ramp(F.metal);
  const bx0 = 6, bx1 = 37, by0 = 29, by1 = 45, lt = 17 - gap, lb = 28 - gap;
  // ---- corpo ----
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
    let c = R[2];
    if ((y - by0) % 4 === 3) c = R[1];
    if (x <= bx0 + 2) c = (y - by0) % 4 === 3 ? R[2] : R[3];
    if (x >= bx1 - 3) c = (y - by0) % 4 === 3 ? R[0] : R[1];
    if (y === by0) c = R[3];
    if (y >= by1 - 1) c = R[1];
    if (hshA(x, y) % 23 === 0 && c === R[2]) c = R[1];
    P.p(x, y, c);
  }
  // ---- tampa abaulada, com tábuas verticais e brilho no alto ----
  const DOMO = [6, 4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  for (let y = lt; y <= lb; y++) {
    const ins = DOMO[y - lt] || 0, fy = (y - lt) / (lb - lt);
    for (let x = bx0 + ins; x <= bx1 - ins; x++) {
      const fx = (x - bx0) / (bx1 - bx0);
      let c = fy < 0.35 ? R[3] : R[2];
      if (fy < 0.2 && fx > 0.15 && fx < 0.55) c = R[4];
      if (fx < 0.1) c = R[3];
      if (fx > 0.86) c = R[1];
      if ((x - bx0) % 7 === 3 && fy > 0.15) c = fx > 0.86 ? R[0] : R[1];
      if (y === lb) c = R[1];
      if (hshA(x, y) % 29 === 0 && c === R[2]) c = R[1];
      P.p(x, y, c);
    }
    // brilho em faixa
    if (fy > 0.08 && fy < 0.3) P.p(bx0 + 8 + Math.round(fy * 6), y, R[4]);
  }
  // sombra da tampa sobre o corpo
  if (gap === 0) for (let x = bx0 + 1; x <= bx1 - 1; x++) P.p(x, by0 + 1, R[0]);
  // lateral direita em profundidade (3/4)
  for (let y = by0 + 1; y <= by1; y++) { P.p(bx1, y, R[0]); P.p(bx1 - 1, y, (y - by0) % 4 === 3 ? R[0] : R[1]); }
  // ---- boca (fresta) ----
  if (gap > 0) {
    for (let y = lb + 1; y < by0; y++) for (let x = bx0 + 1; x <= bx1 - 1; x++) {
      let c = F.dentro === 'boca' ? '#3a0a14' : '#140a1c';
      if (F.dentro === 'estrelas' && hshA(x, y) % 9 === 0) c = hshA(x, y) % 2 ? '#ffffff' : '#c8a0ff';
      P.p(x, y, c);
    }
    const tl = gap > 5 ? 3 : 2;
    for (let x = bx0 + 3; x <= bx1 - 4; x += 4) { for (let j = 0; j < tl; j++) P.rect(x + (j > 0 ? 0 : 0), lb + 1 + j, 2 - (j === tl - 1 ? 1 : 0), 1, j === 0 ? '#f2ecdc' : '#d8d0c0'); }
    for (let x = bx0 + 5; x <= bx1 - 4; x += 4) { for (let j = 0; j < tl; j++) P.rect(x, by0 - 1 - j, 2 - (j === tl - 1 ? 1 : 0), 1, j === 0 ? '#f2ecdc' : '#d8d0c0'); }
    if (gap >= 4) { const ey = lb + 1 + Math.floor((gap - 2) / 2); for (const ex of [14, 27]) { P.rect(ex, ey, 3, gap >= 7 ? 3 : 2, F.olho); P.p(ex, ey, '#ffffff'); } }
    if (gap >= 7) { P.rect(18, by0 - 3, 8, 2, '#e8607a'); P.rect(19, by0 - 2, 6, 1, '#c84060'); }
  }
  // ---- ferragens ----
  const banda = (x0, y0, y1) => { for (let y = y0; y <= y1; y++) { P.p(x0, y, M[3]); P.p(x0 + 1, y, M[2]); P.p(x0 + 2, y, M[1]); if ((y - y0) % 4 === 1) P.p(x0 + 1, y, M[4]); } };
  for (const bxb of [10, 31]) { banda(bxb, by0, by1); banda(bxb, lt + 1, lb); }
  for (let x = bx0; x <= bx1; x++) { P.p(x, by0, M[x < 12 ? 3 : x > 31 ? 1 : 2]); P.p(x, lb, M[1]); }
  P.rect(bx0, by1 - 2, 3, 3, M[2]); P.rect(bx1 - 2, by1 - 2, 3, 3, M[1]); P.p(bx0, by1 - 2, M[4]);
  // fechadura
  if (gap === 0) { P.rect(19, by0 - 1, 6, 6, M[2]); P.rect(19, by0 - 1, 6, 1, M[3]); P.rect(21, by0 + 1, 2, 2, '#1a1020'); P.p(21, by0 + 3, '#1a1020'); }
  else { P.rect(19, lb - 3, 6, 4, M[2]); P.rect(21, lb - 2, 2, 2, '#1a1020'); }
  ARCA_DECO[k] && ARCA_DECO[k](P, F, gap, { lt, lb, by0, by1, bx0, bx1, R, M });
  P.outline();
  const c = P.canvas();
  if (ARCA_BRILHO[k]) ARCA_BRILHO[k](c.getContext('2d'), gap, lt);
  return c;
}
// ---------- enfeites de cada forma (antes do contorno) ----------
function lanterna(P, cx, base, M, luz, grande) {
  const w = grande ? 10 : 8, h = grande ? 11 : 9, x0 = cx - w / 2;
  P.rect(x0 - 1, base - 2, w + 2, 2, M[2]); P.rect(x0 - 1, base - 2, w + 2, 1, M[3]);
  for (let y = base - 2 - h; y < base - 2; y++) for (let x = x0; x < x0 + w; x++) P.p(x, y, luz);
  for (let y = base - 2 - h; y < base - 2; y++) { P.p(x0, y, M[1]); P.p(x0 + w - 1, y, M[1]); P.p(cx, y, M[2]); }
  P.rect(cx - 1, base - 2 - h + 3, 2, h - 5, '#ffffff');
  for (let j = 0; j < 4; j++) P.rect(x0 - 1 + j, base - 3 - h - j, w + 2 - j * 2, 1, M[j < 2 ? 2 : 3]);
  P.p(cx, base - 8 - h, M[3]); P.p(cx, base - 9 - h, M[4]);
}
const ARCA_DECO = {
  farol(P, F, gap, g) { lanterna(P, 22, g.lt, g.M, F.luz); for (let x = 20; x <= 23; x++) P.p(x, g.by0 + 9, g.M[3]); P.rect(21, g.by0 + 7, 2, 2, '#ffe080'); },
  vao(P, F, gap, g) {
    // rachaduras abertas para o Vão: estrelas e uma fenda que brilha
    const fenda = (pts) => { for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1], n = Math.max(Math.abs(c - a), Math.abs(d - b)); for (let t = 0; t <= n; t++) { const x = Math.round(a + (c - a) * t / n), y = Math.round(b + (d - b) * t / n); P.p(x, y, '#0a0614'); P.p(x + 1, y, '#0a0614'); if (hshA(x, y) % 3 === 0) P.p(x, y, '#c8a0ff'); if (hshA(x, y) % 7 === 0) P.p(x + 1, y, '#ffffff'); } } };
    fenda([[8, 31], [10, 34], [8, 37], [11, 41]]); fenda([[28, 33], [26, 36], [29, 39]]); fenda([[16, g.lt + 4], [18, g.lt + 6], [17, g.lt + 9]]);
    // redemoinho no meio da tampa
    for (let i = 0; i < 14; i++) { const a = i * 0.6, r = i * 0.32; P.p(26 + Math.round(Math.cos(a) * r), g.lt + 6 + Math.round(Math.sin(a) * r * 0.7), i % 3 ? '#8a60c8' : '#e0c8ff'); }
    // pedaços da tampa flutuando
    const fy = g.lt - 9; P.rect(31, fy, 7, 3, g.R[3]); P.rect(31, fy + 2, 7, 1, g.R[1]); P.p(33, fy + 1, g.M[3]); P.rect(5, fy + 4, 4, 2, g.R[2]); P.p(5, fy + 4, g.R[4]);
    P.p(29, fy + 5, '#c8a0ff'); P.p(39, fy - 2, '#ffffff'); P.p(10, fy + 1, '#c8a0ff');
    if (gap === 0) { P.rect(19, g.by0 - 1, 6, 6, g.M[2]); P.p(21, g.by0 + 1, '#2a1040'); P.p(22, g.by0 + 1, '#2a1040'); P.p(22, g.by0 + 2, '#2a1040'); P.p(21, g.by0 + 3, '#2a1040'); P.p(20, g.by0 + 2, '#2a1040'); }
  },
  escriba(P, F, gap, g) {
    const tinta = '#1a3a4a';
    for (const [x, y] of [[8, 33], [24, 38], [14, 40], [26, 31]]) { P.p(x, y, tinta); P.p(x + 1, y, tinta); P.p(x + 1, y + 1, tinta); P.p(x, y + 2, tinta); P.p(x + 2, y + 2, tinta); }
    for (let i = 0; i < 4; i++) P.p(36, 32 + i, tinta); P.p(36, 37, tinta); P.p(35, 37, tinta);
    // pena na tampa
    for (let i = 0; i < 14; i++) { const x = 28 + Math.round(i * 0.7), y = g.lt + 1 - i; P.p(x, y, '#5a5a6a'); if (i > 4) { P.p(x - 1, y, '#f8f8f8'); P.p(x + 1, y + 1, '#d8d8e0'); if (i > 7) P.p(x - 2, y + 1, '#f0f0f4'); } }
    P.p(28, g.lt + 2, '#1a1020');
    // folhas saindo pela fresta
    if (gap === 0) { P.rect(7, g.lb, 5, 2, '#f8f4e8'); P.p(8, g.lb + 1, '#c8c0b0'); P.rect(33, g.lb - 1, 3, 2, '#f8f4e8'); }
  },
  guardiao(P, F, gap, g) {
    for (let x = g.bx0 + 1; x <= g.bx1 - 3; x += 6) { P.rect(x, g.lt - 3, 3, 3, '#9a9ab0'); P.p(x, g.lt - 3, '#c8c8d8'); }
    lanterna(P, 22, g.lt - 1, g.M, F.luz, true);
    // escudo
    const sx = 18, sy = g.by0 + 3; P.rect(sx, sy, 8, 7, '#3a6ab8'); P.rect(sx + 1, sy + 7, 6, 1, '#3a6ab8'); P.rect(sx + 2, sy + 8, 4, 1, '#3a6ab8');
    for (let y = sy; y < sy + 7; y++) { P.p(sx, y, g.M[3]); P.p(sx + 7, y, g.M[1]); } P.rect(sx, sy, 8, 1, g.M[3]);
    P.rect(sx + 3, sy + 2, 2, 5, '#f2ecdc'); P.p(sx + 3, sy + 1, '#ffe080'); P.p(sx + 4, sy + 1, '#ffe080');
    P.rect(g.bx0, g.by0, 4, 4, g.M[2]); P.rect(g.bx1 - 3, g.by0, 4, 4, g.M[1]);
  },
  tempestade(P, F, gap, g) {
    lanterna(P, 22, g.lt, g.M, F.luz);
    for (let i = 0; i < 5; i++) P.p(21 + (i % 2), g.lt - 9 + i, '#ffffff');
    for (const rx of [9, 34]) { for (let y = g.lt - 10; y < g.lt + 1; y++) P.p(rx, y, g.M[2]); P.rect(rx - 1, g.lt - 12, 3, 2, g.M[3]); }
    const z = [[13, 32], [15, 34], [13, 36], [16, 39], [14, 41]]; for (let i = 0; i < z.length - 1; i++) { const [a, b] = z[i], [c, d] = z[i + 1]; for (let t = 0; t <= 4; t++) P.p(Math.round(a + (c - a) * t / 4), Math.round(b + (d - b) * t / 4), '#ffe066'); }
  },
  labirinto(P, F, gap, g) {
    const L = ['1111111111111111111111', '1000001000000010000001', '1011101011111010111101', '1010001010001010100001', '1010111010101110101111', '1000100000100000100001', '1111111111111111111111'];
    L.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '1' && (i + 11) % 21 !== 0) P.p(11 + i, g.by0 + 4 + j * 2, g.M[3]); }));
    P.rect(19, g.lt + 3, 5, 7, g.R[1]); P.rect(20, g.lt + 4, 3, 6, '#0a0614'); P.p(22, g.lt + 7, g.M[4]);
    for (const [x, y] of [[4, g.lt - 6], [38, g.lt - 3]]) { P.rect(x, y, 3, 3, g.M[2]); P.p(x, y, g.M[4]); }
  },
  boca(P, F, gap, g) {
    for (let x = g.bx0 + 2; x <= g.bx1 - 2; x += 3) { P.p(x, g.lb + 1, '#f2ecdc'); P.p(x + 1, g.lb + 1, '#f2ecdc'); P.p(x, g.lb + 2, '#d8d0c0'); }
    for (let x = g.bx0 + 1; x <= g.bx1 - 1; x += 2) P.p(x, g.lb, '#3a0a14');
    for (const [x, y] of [[9, 35], [28, 33], [30, 34], [14, 40], [24, 38]]) { P.p(x, y, g.R[0]); P.p(x + 1, y + 1, g.R[0]); P.p(x + 2, y + 2, g.R[0]); P.p(x + 1, y, g.R[3]); }
    for (let x = g.bx0 + 2; x <= g.bx1 - 3; x += 5) { P.p(x, g.lt + 1, '#e8e0d0'); P.p(x + 1, g.lt, '#e8e0d0'); }
    if (gap === 0) { P.p(24, g.lb + 3, '#bff0ff'); P.p(24, g.lb + 4, '#bff0ff'); }
    if (gap >= 4) { P.rect(18, g.by0 - 2, 8, 3, '#e8607a'); P.rect(20, g.by0 + 1, 4, 4, '#e8607a'); P.p(21, g.by0 + 5, '#bff0ff'); P.p(21, g.by0 + 6, '#bff0ff'); }
  },
  bibliotecario(P, F, gap, g) {
    const C = ['#8a3a3a', '#3a5a8a', '#3a7a4a', '#8a6a2a', '#5a3a7a', '#2a6a6a', '#9a4a2a', '#3a4a7a'];
    for (let i = 0; i < 8; i++) { const x0 = g.bx0 + 1 + i * 4, c = C[i]; const R2 = ramp(c); for (let y = g.by0 + 2; y <= g.by1 - 2; y++) for (let x = x0; x < x0 + 4; x++) P.p(x, y, x === x0 ? R2[3] : x === x0 + 3 ? R2[1] : R2[2]); P.rect(x0, g.by0 + 4, 4, 1, '#e8c060'); P.rect(x0, g.by1 - 4, 4, 1, '#e8c060'); P.p(x0 + 1, g.by0 + 8, '#f2ecdc'); P.p(x0 + 2, g.by0 + 9, '#f2ecdc'); }
    P.rect(13, g.lt - 4, 8, 4, '#f8f4e8'); P.rect(22, g.lt - 4, 8, 4, '#f0ead8'); P.rect(21, g.lt - 4, 1, 5, '#8a6a4a');
    for (let r = 0; r < 3; r++) { P.rect(14, g.lt - 3 + r, 6, 1, r % 2 ? '#c8c0b0' : '#9a9080'); P.rect(23, g.lt - 3 + r, 6, 1, r % 2 ? '#c8c0b0' : '#9a9080'); }
    if (gap === 0) { for (let y = 0; y < 6; y++) { P.p(15, g.lb + 1 + y, '#c83a3a'); P.p(30, g.lb + 1 + y, '#3a9a8a'); } }
  },
  palimpsesto(P, F, gap, g) {
    for (let r = 0; r < 4; r++) { P.rect(9, g.by0 + 3 + r * 3, 26, 1, '#ece4d0'); for (let x = 10; x < 34; x += 3) if (hshA(x, r) % 3) P.p(x, g.by0 + 3 + r * 3, '#b8ac90'); }
    for (const [x, y] of [[12, 34], [20, 37], [28, 33], [16, 40]]) { P.p(x, y, '#c83a3a'); P.p(x + 1, y - 1, '#c83a3a'); P.p(x + 2, y, '#c83a3a'); P.p(x + 1, y + 1, '#c83a3a'); }
    for (let i = 0; i < 13; i++) { P.p(14 + i, g.lt - 12 + i, '#2a2030'); P.p(30 - i, g.lt - 12 + i, '#a82a3a'); if (i < 6) { P.p(13 + i, g.lt - 12 + i, '#f8f8f8'); P.p(31 - i, g.lt - 12 + i, '#ffd0d0'); } }
    P.rect(33, 40, 3, 2, '#c83a3a'); P.p(35, 42, '#c83a3a');
  }
};
// luz que não leva contorno (depois do outline)
const ARCA_BRILHO = {
  farol(x, gap, lt) { x.globalAlpha = 0.35; x.fillStyle = '#fff0b0'; for (const [a, b] of [[12, lt - 8], [31, lt - 8], [9, lt - 12], [34, lt - 12]]) x.fillRect(a, b, 2, 1); if (gap) { x.fillStyle = '#ffb040'; x.fillRect(8, 28 - gap + 1, 28, 1); } x.globalAlpha = 1; },
  guardiao(x, gap, lt) { x.globalAlpha = 0.35; x.fillStyle = '#fff0b0'; for (const [a, b] of [[10, lt - 10], [33, lt - 10], [7, lt - 14], [36, lt - 14]]) x.fillRect(a, b, 2, 1); x.globalAlpha = 1; },
  tempestade(x, gap, lt) { x.fillStyle = '#ffffff'; for (const [a, b] of [[7, lt - 14], [11, lt - 13], [33, lt - 13], [37, lt - 14]]) x.fillRect(a, b, 1, 1); x.fillStyle = '#bff0ff'; x.fillRect(8, lt - 15, 1, 1); x.fillRect(36, lt - 15, 1, 1); },
  vao(x, gap, lt) { x.fillStyle = '#ffffff'; x.fillRect(4, lt - 2, 1, 1); x.fillStyle = '#c8a0ff'; x.fillRect(41, lt + 3, 1, 1); },
  labirinto(x, gap, lt) { x.fillStyle = '#e0c8ff'; x.fillRect(2, lt - 8, 1, 1); x.fillRect(42, lt - 6, 1, 1); }
};

// ---------- o corpo pequeno (mapa, 16x16) ----------
function arcaMini(k, dir, gap) {
  const F = ARCA[k], P = new Pix(16, 16), R = ramp(F.madeira), M = ramp(F.metal), lado = dir === 'left';
  const x0 = lado ? 3 : 1, x1 = lado ? 12 : 14, lt = 5 - gap, lb = 8 - gap;
  for (let y = 9; y <= 15; y++) for (let x = x0; x <= x1; x++) P.p(x, y, x <= x0 + 1 ? R[3] : x >= x1 - 1 ? R[1] : (y - 9) % 3 === 2 ? R[1] : R[2]);
  for (let y = lt; y <= lb; y++) { const ins = y === lt ? 1 : 0; for (let x = x0 + ins; x <= x1 - ins; x++) P.p(x, y, y === lt ? R[4] : x >= x1 - 1 ? R[1] : R[3]); }
  if (gap > 0) for (let y = lb + 1; y < 9; y++) for (let x = x0 + 1; x <= x1 - 1; x++) P.p(x, y, '#140a1c');
  if (!lado) { for (const bb of [4, 11]) for (let y = lt + 1; y <= 15; y++) if (y !== lb + 1 || gap === 0) P.p(bb, y, M[2]); if (dir === 'down') { if (gap > 0) { P.p(5, lb + 1, F.olho); P.p(10, lb + 1, F.olho); if (gap > 1) { P.p(6, 8, '#f2ecdc'); P.p(9, 8, '#f2ecdc'); } } else { P.p(7, 9, M[3]); P.p(8, 9, M[3]); P.p(7, 10, '#1a1020'); } } }
  else { for (let y = lt + 1; y <= 15; y++) if (y !== lb + 1 || gap === 0) P.p(x0 + 3, y, M[2]); P.p(x1, lt + 1, M[3]); if (gap > 0) P.p(x0 + 1, lb + 1, F.olho); }
  for (let x = x0; x <= x1; x++) P.p(x, 9, M[1]);
  // enfeite mínimo
  const cx = Math.round((x0 + x1) / 2);
  const mini = {
    farol: () => { P.rect(cx - 1, lt - 4, 3, 3, F.luz); P.rect(cx - 1, lt - 1, 3, 1, M[2]); P.p(cx, lt - 5, M[3]); },
    guardiao: () => { P.rect(cx - 1, lt - 4, 3, 3, F.luz); P.rect(cx - 2, lt - 1, 5, 1, M[2]); P.p(cx, lt - 5, M[3]); P.p(x0, lt - 1, '#9a9ab0'); P.p(x1, lt - 1, '#9a9ab0'); },
    tempestade: () => { P.rect(cx - 1, lt - 4, 3, 3, F.luz); P.p(cx, lt - 3, '#ffffff'); P.rect(cx - 1, lt - 1, 3, 1, M[2]); P.p(x0 + 1, lt - 2, M[3]); P.p(x0 + 1, lt - 3, M[3]); P.p(x1 - 1, lt - 2, M[3]); P.p(x1 - 1, lt - 3, M[3]); },
    vao: () => { P.rect(x1 - 2, lt - 4, 3, 1, R[3]); P.p(x0 + 1, lt - 2, '#c8a0ff'); P.p(9, 12, '#0a0614'); P.p(10, 13, '#ffffff'); },
    labirinto: () => { P.p(x0 + 2, 11, M[3]); P.p(x0 + 3, 11, M[3]); P.p(x0 + 3, 12, M[3]); P.p(x1 - 3, 13, M[3]); P.p(x1 - 2, 13, M[3]); P.rect(x1 - 1, lt - 4, 2, 2, M[2]); },
    boca: () => { for (let x = x0 + 1; x <= x1 - 1; x += 2) P.p(x, lb + 1, '#f2ecdc'); },
    escriba: () => { for (let i = 0; i < 5; i++) P.p(cx + 2 + Math.round(i * 0.6), lt - i, i < 2 ? '#5a5a6a' : '#f8f8f8'); P.p(x0 + 2, 12, '#1a3a4a'); },
    bibliotecario: () => { const C = ['#8a3a3a', '#3a5a8a', '#3a7a4a', '#8a6a2a', '#5a3a7a']; for (let x = x0 + 1; x <= x1 - 1; x++) for (let y = 10; y <= 14; y++) P.p(x, y, C[(x >> 1) % C.length]); P.rect(cx - 2, lt - 2, 5, 2, '#f8f4e8'); },
    palimpsesto: () => { P.p(x0 + 2, 11, '#c83a3a'); P.p(x0 + 3, 12, '#c83a3a'); P.p(x1 - 3, 13, '#c83a3a'); for (let i = 0; i < 4; i++) { P.p(cx - 2 + i, lt - 4 + i, '#2a2030'); P.p(cx + 2 - i, lt - 4 + i, '#a82a3a'); } }
  };
  mini[k] && mini[k]();
  P.outline();
  const c = P.canvas();
  return c;
}

// ---------- registra as artes quando a forma for usada ----------
const ARCA_OK = {};
function garantirArca(k) {
  if (ARCA_OK[k] || !ARCA[k]) return; ARCA_OK[k] = true;
  const T = IMG_CHEST_T, D = IMG_MAP_T;
  const closed = arcaCorpo(k, 0), three = arcaCorpo(k, 4), front = arcaCorpo(k, 7);
  T['evo_' + k] = { closed, three, front, three_l: flipH(three), idle: three, closedSmall: closed };
  const L = [0, 1, 2, 1, 0, 1].map(g => arcaMini(k, 'left', g));
  D['evo_' + k] = { down: [arcaMini(k, 'down', 1), arcaMini(k, 'down', 0), arcaMini(k, 'down', 2)], up: [0, 0, 1].map(g => arcaMini(k, 'up', g)), left: L, right: L.map(flipH) };
}
const IMG_CHEST_T = IMG.chest, IMG_MAP_T = IMG.chestMap;
let ARCA_ULT = null;
function arcaRedirect(T) {
  return new Proxy(T, { get(t, key) {
    if (IMG.ready && typeof G !== 'undefined' && key === G.species) {
      const f = formaArca();
      if (f !== ARCA_ULT) { ARCA_ULT = f; delete PTC.me; }
      if (f) { garantirArca(f); return t['evo_' + f]; }
    }
    return t[key];
  } });
}
IMG.chest = arcaRedirect(IMG_CHEST_T); IMG.chestMap = arcaRedirect(IMG_MAP_T);
// o enfeite flutuante antigo não é mais preciso: a forma inteira mudou
{ const VAZIO = mk(1, 1); aderecoEvo = () => VAZIO; if (typeof aderecoEvo7 === 'function') aderecoEvo7 = () => VAZIO; }

// ---------- a TELA DE ESCOLHA ----------
function escolhaArca(ks, titulo, info) {
  return new Promise(res => {
    ks.forEach(garantirArca);
    let i = 0, t = 0, mud = 0; const parts = [];
    const w = { type: 'arcaEscolha',
      update() {
        t++;
        if (btnp('left')) { i = (i + ks.length - 1) % ks.length; mud = t; sfx('move'); }
        if (btnp('right')) { i = (i + 1) % ks.length; mud = t; sfx('move'); }
        if (btnp('a')) { sfx('select'); closeWin(this); res(ks[i]); }
        if (t % 3 === 0) { const n = ks.length, cx = n === 3 ? [44, 120, 196][i] : [72, 168][i]; parts.push({ x: cx + rand(-18, 18), y: 84, vy: -rand(0.3, 0.9), l: 50, c: ARCA_COR(ks[i]) }); }
        for (const p of parts) { p.y += p.vy; p.l--; } while (parts.length && parts[0].l <= 0) parts.shift();
      },
      draw() {
        bx.fillStyle = '#06040c'; bx.fillRect(-400, -10, 1200, 300);
        for (let s = 0; s < 60; s++) { bx.fillStyle = s % 7 ? '#2a2440' : '#6a5a8a'; bx.fillRect((s * 53) % 240, (s * 37 + Math.floor(t / 8)) % 130, 1, 1); }
        txt(titulo, 120, 4, { align: 'center', col: '#ffe8c0', sz: 1.5 });
        const n = ks.length, xs = n === 3 ? [44, 120, 196] : [72, 168];
        ks.forEach((k, j) => {
          const sel = j === i, cx = xs[j], cy = 84, C = IMG_CHEST_T['evo_' + k];
          // pedestal
          bx.globalAlpha = sel ? 0.55 : 0.2; bx.fillStyle = ARCA_COR(k); bx.beginPath(); bx.ellipse(cx, cy + 2, 30, 7, 0, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
          bx.fillStyle = sel ? '#3a3050' : '#1e1a2c'; bx.fillRect(cx - 24, cy + 2, 48, 6); bx.fillStyle = sel ? '#5a4a78' : '#2a2438'; bx.fillRect(cx - 24, cy + 2, 48, 1);
          if (sel) { luzMagia(cx, cy - 24, 40, ARCA_COR(k), 0.25 + 0.08 * Math.sin(t * 0.08)); for (let a = 0; a < 10; a++) { const an = a / 10 * Math.PI * 2 + t * 0.02; bx.fillStyle = ARCA_COR(k); bx.fillRect(Math.round(cx + Math.cos(an) * 30), Math.round(cy + 2 + Math.sin(an) * 7), 1, 1); } }
          const fr = sel ? ((t - mud) % 120 < 50 ? C.front : (t % 90 < 6 ? C.closed : C.three)) : C.closed;
          const bob = sel ? Math.round(Math.sin(t * 0.07) * 2) : 0;
          bx.globalAlpha = sel ? 1 : 0.45; bx.drawImage(fr, Math.round(cx - fr.width / 2), cy - fr.height + 2 + bob); bx.globalAlpha = 1;
          if (!sel) { bx.globalAlpha = 0.35; bx.fillStyle = '#06040c'; bx.fillRect(cx - 24, cy - 48, 48, 50); bx.globalAlpha = 1; }
          txt(ARCA[k].nm, cx, cy + 12, { align: 'center', col: sel ? ARCA_COR(k) : '#6a6078' });
        });
        for (const p of parts) { bx.globalAlpha = Math.min(1, p.l / 30); bx.fillStyle = p.c; bx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); } bx.globalAlpha = 1;
        const I = info(ks[i]);
        box(4, 112, 232, 116, { edge: ARCA_COR(ks[i]) });
        const n1 = txt(`{y}${I.papel}{/}`, 10, 116, { w: 37 });
        const n2 = txt(I.d, 10, 116 + n1 * 12 + 2, { w: 37, col: '#c8d4dc' });
        txt('Preço: ' + I.preco, 10, 116 + (n1 + n2) * 12 + 6, { w: 37, col: '#ff9a9a' });
        txt('< >  escolher     A  esta', 120, 230, { align: 'center', col: '#6a6078' });
      } };
    openWin(w);
  });
}
function ARCA_COR(k) { return (typeof EVO7 !== 'undefined' && EVO7[k] ? EVO7[k].cor : EVO3[k] ? EVO3[k].cor : '#ffe8c0'); }

// ---------- a TRANSFORMAÇÃO ----------
function transformaArca(antes, depois, cor, nome) {
  return new Promise(res => {
    let t = 0; const parts = [], N = 190;
    const w = { type: 'arcaMuda',
      update() {
        t++;
        if (t < 90 && t % 2 === 0) { const a = Math.random() * Math.PI * 2, r = 70; parts.push({ x: 120 + Math.cos(a) * r, y: 110 + Math.sin(a) * r * 0.6, tx: 120, ty: 100, l: 40, c: Math.random() < 0.5 ? cor : '#ffffff', ent: true }); }
        if (t === 120) { sfx('rune'); for (let q = 0; q < 50; q++) { const a = Math.random() * Math.PI * 2, s = rand(0.8, 3.2); parts.push({ x: 120, y: 100, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 50, c: q % 3 ? cor : '#ffffff' }); } }
        if (t === 60 || t === 85 || t === 100) sfx('select');
        for (const p of parts) { if (p.ent) { p.x += (p.tx - p.x) * 0.08; p.y += (p.ty - p.y) * 0.08; } else { p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; } p.l--; }
        for (let q = parts.length - 1; q >= 0; q--) if (parts[q].l <= 0) parts.splice(q, 1);
        if (t >= N || (t > 140 && btnp('a'))) { closeWin(this); res(); }
      },
      draw() {
        bx.fillStyle = '#06040c'; bx.fillRect(-400, -10, 1200, 300);
        const cx = 120, base = 132;
        const k = Math.min(1, t / 110);
        luzMagia(cx, 100, 30 + k * 60, cor, 0.15 + k * 0.45);
        // anéis de runa
        for (let r = 0; r < 3; r++) { bx.globalAlpha = 0.25 + k * 0.4; bx.strokeStyle = r === 1 ? '#ffffff' : cor; bx.lineWidth = 1; bx.beginPath(); bx.ellipse(cx, base + 2, 30 + r * 10 + Math.sin(t * 0.05 + r) * 2, 7 + r * 2, 0, 0, Math.PI * 2); bx.stroke(); } bx.globalAlpha = 1;
        // pisca entre a forma velha e a nova, cada vez mais rápido
        let img = antes;
        if (t > 40 && t < 120) { const per = Math.max(2, Math.round(20 - (t - 40) / 4.5)); img = Math.floor(t / per) % 2 ? depois : antes; }
        if (t >= 120) img = depois;
        if (img) {
          const sc = 2, w2 = img.width * sc, h2 = img.height * sc, bob = t >= 120 ? Math.round(Math.sin(t * 0.08) * 2) : 0;
          bx.drawImage(img, Math.round(cx - w2 / 2), base - h2 + bob, w2, h2);
          if (t > 40 && t < 125) { bx.globalAlpha = Math.min(1, (t - 40) / 80); bx.drawImage(whiteOf(img), Math.round(cx - w2 / 2), base - h2, w2, h2); bx.globalAlpha = 1; }
        }
        if (t >= 118 && t < 132) { bx.globalAlpha = 1 - (t - 118) / 14; bx.fillStyle = '#ffffff'; bx.fillRect(-400, -10, 1200, 300); bx.globalAlpha = 1; }
        if (t >= 120) { for (let r = 0; r < 12; r++) { const an = r / 12 * Math.PI * 2 + t * 0.01, L = 40 + (t - 120); bx.globalAlpha = Math.max(0, 0.35 - (t - 120) / 200); bx.strokeStyle = cor; bx.beginPath(); bx.moveTo(cx, 100); bx.lineTo(cx + Math.cos(an) * L, 100 + Math.sin(an) * L); bx.stroke(); } bx.globalAlpha = 1; }
        for (const p of parts) { bx.globalAlpha = Math.min(1, p.l / 20); bx.fillStyle = p.c; bx.fillRect(Math.round(p.x), Math.round(p.y), p.ent ? 1 : 2, p.ent ? 1 : 2); } bx.globalAlpha = 1;
        if (t >= 135) { const a = Math.min(1, (t - 135) / 20); bx.globalAlpha = a; txt(nome, cx, 152, { align: 'center', col: cor, sz: 2 }); bx.globalAlpha = 1; }
      } };
    openWin(w);
  });
}
function arcaAtualImg() { const f = formaArca(); if (f) { garantirArca(f); return IMG_CHEST_T['evo_' + f].three; } const C = IMG_CHEST_T[G.species] || IMG_CHEST_T.caixote; return C && C.three; }

// ---------- voltar para antes da evolução (saves que já evoluíram com a arte antiga) ----------
{ const _uwA = updateWorld2; updateWorld2 = function () {
  _uwA();
  if (V.scene === 'world' && !window._arcaPerg && !worldBusy2() && !W2.mv && G.evo3 && !G.evo7 && !G.flags.c3Fim && !G.flags.arcaPerg) {
    window._arcaPerg = true;
    run2(async () => {
      G.flags.arcaPerg = true;
      await say('[Aviso do Catálogo: as formas do baú foram redesenhadas. Agora a evolução troca o corpo inteiro, e a escolha mostra as formas.]', 'cat');
      const c = await choose('* Voltar para antes da evolução, no veio das Galerias, e escolher de novo?', ['Voltar para o veio', 'Ficar como está'], 'n', 1);
      if (c !== 0) { save2(); return; }
      const ev = G.evo3; G.evo3 = null; G.flags.c3Forma = false; G.flags.aroDentes = false;
      if (ev === 'escriba' && grim().max >= 6) grim().max -= 1;
      delete PTC.me; curarTudo(); save2();
      sfx('door'); await fadeOut(14); loadMap2('galerias2', 14, 17, 'up'); await fadeIn(14);
      await say('* O veio de âmbar pulsa outra vez na sua frente, como se nada tivesse acontecido. A sua tampa range e puxa na direção dele.');
    });
  }
}; }
