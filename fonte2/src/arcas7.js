// ================= AS FORMAS FINAIS (Cap. 7), CAPRICHADAS (pedido do usuário: "quase a final, bem bonitas e trabalhadas") =================
// As seis formas do Cap. 7 ganham um acabamento acima das do Cap. 3: ferragens gravadas (filigrana, rebites, cantoneiras
// de ouro), silhueta própria e ornamentos grandes, e uma ANIMAÇÃO VIVA em batalha (arcaFx7) que as do Cap. 3 não têm:
//  FAROL-GUARDIÃO: fortaleza-farol: parapeito de pedra, duas torres com telhado de ouro e flâmulas, lanterna coroada,
//    brasão esmaltado; em batalha o facho do farol varre o ar.
//  FAROL-TEMPESTADE: nuvem de tempestade presa sobre a tampa, para-raios de cobre com bobinas, veias de raio no corpo;
//    em batalha cai chuva da nuvem e raios estalam entre os para-raios.
//  VÃO-LABIRINTO: a tampa é um labirinto visto de cima com o centro aceso, o corpo tem o labirinto gravado em luz;
//    em batalha três cubos de pedra orbitam e uma luz percorre o caminho do labirinto.
//  VÃO-BOCA: presas para fora mesmo fechado, três olhos na tampa, chifres de dente, veias, língua de lado; em batalha
//    os olhos piscam, ele baba e solta bafo.
//  ESCRIBA-BIBLIOTECÁRIO: duas prateleiras de lombadas, escadinha, óculos redondos na fechadura, um grande livro aberto
//    na tampa com fitas; em batalha livros voam em volta como pássaros e a página vira.
//  ESCRIBA-PALIMPSESTO: pergaminho em camadas (texto velho apagado e texto novo vermelho), lacre de cera com fita,
//    pergaminhos enrolados nas laterais, penas cruzadas; em batalha letras vermelhas sobem e giram em volta.
const ARCA7 = ['guardiao', 'tempestade', 'labirinto', 'boca', 'bibliotecario', 'palimpsesto'];
function ferragem7(P, g, ouro) {
  const O = ramp(ouro || '#e0b040');
  // filigrana nas bandas e friso dourado na borda da tampa e na base
  for (const bxb of [10, 31]) for (let y = g.by0 + 1; y <= g.by1 - 1; y += 3) P.p(bxb + 1, y, O[4]);
  for (let x = g.bx0 + 1; x <= g.bx1 - 1; x++) { if (x % 3 === 0) P.p(x, g.lb - 1, O[3]); if (x % 4 === 1) P.p(x, g.by1 - 3, O[3]); }
  // cantoneiras de ouro com rebite
  for (const [x, y, f] of [[g.bx0, g.by0, 1], [g.bx1 - 3, g.by0, -1], [g.bx0, g.by1 - 3, 1], [g.bx1 - 3, g.by1 - 3, -1]]) { P.rect(x, y, 4, 4, O[2]); P.rect(x, y, 4, 1, O[3]); P.p(x + 1, y + 1, O[4]); P.p(x + 2, y + 2, O[1]); }
}
const DECO7 = {
  guardiao(P, F, gap, g) {
    const pedra = ['#5a5a70', '#7a7a90', '#a0a0b4', '#c8c8d8'];
    // parapeito de pedra com ameias sobre a tampa
    for (let x = g.bx0 + 1; x <= g.bx1 - 1; x++) for (let y = g.lt - 3; y <= g.lt; y++) P.p(x, y, (x + y * 3) % 7 === 0 ? pedra[0] : y === g.lt - 3 ? pedra[3] : pedra[1 + ((x >> 2) + y) % 2]);
    for (let x = g.bx0 + 1; x <= g.bx1 - 2; x += 5) { P.rect(x, g.lt - 6, 3, 3, pedra[2]); P.rect(x, g.lt - 6, 3, 1, pedra[3]); P.p(x + 2, g.lt - 4, pedra[0]); }
    // duas torres nos cantos, telhado de ouro e flâmula
    for (const tx of [2, 38]) {
      for (let y = g.lt - 10; y <= g.by1 - 2; y++) for (let x = tx; x < tx + 5; x++) P.p(x, y, x === tx ? pedra[3] : x === tx + 4 ? pedra[0] : (y % 4 === 0 ? pedra[0] : pedra[2]));
      P.p(tx + 2, g.lt - 6, '#ffe080'); P.p(tx + 2, g.lt - 5, '#ffe080'); P.p(tx + 2, g.by0 + 4, '#1a1020'); P.p(tx + 2, g.by0 + 5, '#1a1020');
      for (let j = 0; j < 5; j++) P.rect(tx + j / 2 | 0, g.lt - 11 - j, 5 - (j / 2 | 0) * 2, 1, ramp('#f0c040')[j < 2 ? 2 : 3]);
      P.p(tx + 2, g.lt - 16, '#c8c8d8'); P.p(tx + 2, g.lt - 17, '#c8c8d8'); P.rect(tx + 3, g.lt - 17, 3, 1, '#d83a3a'); P.p(tx + 3, g.lt - 16, '#a82a2a');
    }
    // lanterna coroada
    lanterna(P, 22, g.lt - 3, g.M, F.luz, false);
    { const cy = Math.max(0, g.lt - 17); P.rect(19, cy + 1, 7, 1, '#f0c040'); P.p(19, cy, '#f0c040'); P.p(22, cy, '#fff0a0'); P.p(25, cy, '#f0c040'); }
    // brasão esmaltado
    const sx = 17, sy = g.by0 + 2; P.rect(sx, sy, 10, 8, '#2a5ab8'); P.rect(sx + 1, sy + 8, 8, 1, '#2a5ab8'); P.rect(sx + 2, sy + 9, 6, 1, '#2a5ab8'); P.rect(sx + 3, sy + 10, 4, 1, '#2a5ab8');
    for (let y = sy; y < sy + 9; y++) { P.p(sx, y, '#f0c040'); P.p(sx + 9, y, '#a07020'); } P.rect(sx, sy, 10, 1, '#fff0a0');
    P.rect(sx + 4, sy + 3, 2, 5, '#f2ecdc'); P.rect(sx + 3, sy + 2, 4, 1, '#f0c040'); P.p(sx + 4, sy + 1, '#fff0a0'); P.p(sx + 5, sy + 1, '#fff0a0'); P.p(sx + 2, sy + 2, '#bfe0ff'); P.p(sx + 7, sy + 2, '#bfe0ff');
    ferragem7(P, g, '#f0c040');
  },
  tempestade(P, F, gap, g) {
    // nuvem presa sobre a tampa
    const nuv = ['#3a4050', '#5a6478', '#7a8498', '#a0aabb'];
    for (const [cx, cy, r] of [[13, 6, 3], [22, 5, 4], [31, 6, 3], [17, 8, 3], [27, 8, 3]]) for (let y = -r; y <= r; y++) for (let x = -r - 2; x <= r + 2; x++) if (x * x / ((r + 2) * (r + 2)) + y * y / (r * r) <= 1) P.p(cx + x, cy + y, y < -r / 2 ? nuv[3] : y < 0 ? nuv[2] : y < r / 2 ? nuv[1] : nuv[0]);
    // lanterna elétrica pendurada na nuvem e para-raios de cobre com bobinas
    lanterna(P, 22, g.lt, g.M, F.luz);
    for (const x of [12, 16, 28, 32]) { P.p(x, 13, '#8fd0ff'); P.p(x - 1, 15, '#6aa0d0'); }
    for (const rx of [6, 37]) { for (let y = g.lt - 7; y < g.by0 + 2; y++) P.p(rx, y, (y % 2) ? '#c87a3a' : '#e8a060'); P.rect(rx - 1, g.lt - 9, 3, 2, '#e8a060'); P.p(rx, g.lt - 10, '#ffffff'); for (let y = g.lt - 4; y < g.lt + 4; y += 2) { P.p(rx - 1, y, '#a05a2a'); P.p(rx + 1, y, '#a05a2a'); } }
    // veias de raio no corpo
    const z = (pts) => { for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1], n = Math.max(Math.abs(c - a), Math.abs(d - b)); for (let t = 0; t <= n; t++) { const x = Math.round(a + (c - a) * t / n), y = Math.round(b + (d - b) * t / n); P.p(x, y, '#bff0ff'); if (t % 2) P.p(x + 1, y, '#5aa8c0'); } } };
    z([[13, 31], [15, 34], [13, 36], [16, 39], [14, 42]]); z([[29, 32], [27, 35], [30, 38], [28, 41]]);
    for (const bxb of [10, 31]) for (let y = g.by0 + 2; y <= g.by1 - 2; y += 4) P.p(bxb + 1, y, '#bff0ff');
    ferragem7(P, g, '#a0b8c8');
  },
  labirinto(P, F, gap, g) {
    // o corpo com o labirinto gravado em luz
    const L = ['1111111111111111111111', '1000001000000010000001', '1011101011111010111101', '1010001010001010100001', '1010111010101110101111', '1000100000100000100001', '1111111111111111111111'];
    L.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '1' && (i + 11) % 21 !== 0) { P.p(11 + i, g.by0 + 3 + j * 2, '#e0c8ff'); P.p(11 + i, g.by0 + 4 + j * 2, '#6a4a98'); } }));
    // a tampa: labirinto visto de cima, com o centro aceso
    for (let y = g.lt + 2; y <= g.lb - 2; y++) for (let x = 12; x <= 31; x++) { const dx = Math.abs(x - 21.5), dy = Math.abs(y - (g.lt + g.lb) / 2); const ring = Math.max(Math.round(dx), Math.round(dy * 2)); if (ring % 3 === 0 && !(ring === 3 && x === 21) && !(ring === 6 && y === g.lt + 2) && !(ring === 9 && x === 31)) P.p(x, y, '#b890f0'); }
    P.rect(21, ((g.lt + g.lb) / 2 | 0) - 1, 2, 2, '#ffffff');
    // portinha com estrelas atrás
    P.rect(4, g.by0 + 2, 4, 7, g.R[1]); P.rect(5, g.by0 + 3, 2, 6, '#0a0614'); P.p(5, g.by0 + 4, '#ffffff'); P.p(6, g.by0 + 7, '#c8a0ff');
    // blocos do labirinto soltos, flutuando sobre a tampa, com uma fresta estrelada
    for (const [x, y, w] of [[8, g.lt - 8, 6], [24, g.lt - 11, 7], [33, g.lt - 6, 5]]) { P.rect(x, y, w, 4, g.R[2]); P.rect(x, y, w, 1, g.R[4]); P.rect(x, y + 3, w, 1, g.R[0]); P.p(x + 1, y + 1, '#e0c8ff'); P.p(x + w - 2, y + 2, '#b890f0'); }
    for (let i = 0; i < 4; i++) { P.p(17 + i, g.lt - 4 + (i % 2), '#0a0614'); if (i % 2) P.p(17 + i, g.lt - 4, '#ffffff'); }
    // chão de pedra flutuante embaixo
    for (let x = g.bx0 + 2; x <= g.bx1 - 2; x += 4) P.rect(x, g.by1 + 0, 3, 1, '#5a4a78');
    ferragem7(P, g, '#c8a8f0');
  },
  boca(P, F, gap, g) {
    const V = '#4a0a18';
    // veias no corpo
    for (const pts of [[[8, 31], [10, 35], [9, 39], [11, 43]], [[34, 32], [32, 36], [34, 41]], [[20, 40], [23, 42], [26, 41]]]) for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1], n = Math.max(Math.abs(c - a), Math.abs(d - b)); for (let t = 0; t <= n; t++) P.p(Math.round(a + (c - a) * t / n), Math.round(b + (d - b) * t / n), V); }
    // presas para fora mesmo fechado (de cima e de baixo)
    for (let x = g.bx0 + 2; x <= g.bx1 - 3; x += 4) { const big = (x / 4 | 0) % 2 === 0; for (let j = 0; j < (big ? 5 : 3); j++) { P.p(x, g.lb + 1 + j, j === 0 ? '#ffffff' : '#f2ecdc'); if (j < (big ? 3 : 2)) P.p(x + 1, g.lb + 1 + j, '#d8d0c0'); } }
    for (let x = g.bx0 + 4; x <= g.bx1 - 4; x += 5) for (let j = 0; j < 3; j++) { P.p(x, g.by0 - 1 - j + (gap ? 0 : 3), '#f2ecdc'); }
    // três olhos na tampa
    for (const [ex, ey, w] of [[13, g.lt + 4, 3], [21, g.lt + 2, 4], [30, g.lt + 4, 3]]) { P.rect(ex, ey, w, 2, '#1a0408'); P.rect(ex, ey, w, 1, '#ffcc40'); P.p(ex + (w >> 1), ey, '#1a0408'); P.p(ex + (w >> 1), ey + 1, '#ff6a20'); }
    // chifres de dente nos cantos da tampa
    for (const [x, d] of [[g.bx0 + 1, -1], [g.bx1 - 1, 1]]) for (let j = 0; j < 6; j++) P.p(x + d * (j >> 1), g.lt - j, j > 3 ? '#ffffff' : '#e8e0d0');
    // língua de lado e baba
    if (gap === 0) { P.rect(30, g.by0 + 1, 3, 6, '#e8607a'); P.p(31, g.by0 + 7, '#c84060'); P.p(30, g.by0 + 3, '#ff90a0'); P.p(14, g.by0 + 2, '#bff0ff'); P.p(14, g.by0 + 3, '#bff0ff'); P.p(14, g.by0 + 5, '#bff0ff'); }
    if (gap >= 4) { P.rect(18, g.by0 - 2, 8, 3, '#e8607a'); P.rect(20, g.by0 + 1, 5, 6, '#e8607a'); P.p(22, g.by0 + 3, '#ff90a0'); P.p(21, g.by0 + 7, '#bff0ff'); }
    ferragem7(P, g, '#6a5a60');
  },
  bibliotecario(P, F, gap, g) {
    const C = ['#8a3a3a', '#3a5a8a', '#3a7a4a', '#8a6a2a', '#5a3a7a', '#2a6a6a', '#9a4a2a', '#3a4a7a', '#7a2a5a'];
    // duas prateleiras de lombadas, tábuas douradas
    for (const [y0, y1, off] of [[g.by0 + 2, g.by0 + 7, 0], [g.by0 + 9, g.by1 - 2, 3]]) for (let i = 0; i < 10; i++) {
      const x0 = g.bx0 + 1 + i * 3, c = C[(i + off) % C.length], R2 = ramp(c), alto = (i * 7 + off) % 3;
      for (let y = y0 + alto; y <= y1; y++) for (let x = x0; x < x0 + 3 && x <= g.bx1 - 1; x++) P.p(x, y, x === x0 ? R2[3] : x === x0 + 2 ? R2[1] : R2[2]);
      P.p(x0 + 1, y0 + alto + 1, '#e8c060'); P.p(x0 + 1, y1 - 1, '#e8c060');
    }
    P.rect(g.bx0, g.by0 + 8, g.bx1 - g.bx0 + 1, 1, '#c8a040'); P.rect(g.bx0, g.by1 - 1, g.bx1 - g.bx0 + 1, 1, '#c8a040');
    // escadinha encostada
    for (let y = g.by0 - 2; y <= g.by1; y++) { P.p(39, y, '#8a5a30'); P.p(42, y, '#6a4428'); if (y % 3 === 0) P.rect(39, y, 4, 1, '#a07040'); }
    // grande livro aberto na tampa, com fitas
    P.rect(10, g.lt - 6, 11, 6, '#f8f4e8'); P.rect(22, g.lt - 6, 11, 6, '#f0ead8'); P.rect(21, g.lt - 7, 1, 8, '#8a6a4a');
    P.rect(9, g.lt - 1, 25, 1, '#6a4428'); for (let r = 0; r < 4; r++) { P.rect(12, g.lt - 5 + r, 7 - (r % 2), 1, r % 2 ? '#c8c0b0' : '#8a8070'); P.rect(24, g.lt - 5 + r, 7 - ((r + 1) % 2), 1, r % 2 ? '#c8c0b0' : '#8a8070'); }
    for (const [x, c] of [[16, '#c83a3a'], [27, '#3a9a8a']]) for (let y = 0; y < 6; y++) P.p(x, g.lt + y, c);
    // óculos redondos na fechadura
    if (gap === 0) { for (const ox of [16, 24]) { P.rect(ox, g.by0 - 2, 4, 1, '#c8a040'); P.rect(ox, g.by0 + 1, 4, 1, '#c8a040'); P.p(ox - 1, g.by0 - 1, '#c8a040'); P.p(ox - 1, g.by0, '#c8a040'); P.p(ox + 4, g.by0 - 1, '#c8a040'); P.p(ox + 4, g.by0, '#c8a040'); P.rect(ox, g.by0 - 1, 4, 2, '#bfe8ff'); P.p(ox + 1, g.by0 - 1, '#ffffff'); } P.rect(20, g.by0 - 1, 4, 1, '#c8a040'); }
    ferragem7(P, g, '#e0b040');
  },
  palimpsesto(P, F, gap, g) {
    // pergaminho em camadas: texto velho raspado (cinza) e texto novo (vermelho)
    for (let r = 0; r < 5; r++) { const y = g.by0 + 3 + r * 3; for (let x = 9; x < 35; x++) { if (hshA(x, r * 5) % 4 === 0) P.p(x, y, '#c8bca0'); if (hshA(x + 9, r) % 3 === 0 && x % 2) P.p(x, y + 1, r % 2 ? '#a82a3a' : '#c83a3a'); } }
    // pergaminhos enrolados nas laterais
    for (const sx of [2, 38]) { for (let y = g.lt + 2; y <= g.by1 - 1; y++) { P.p(sx, y, '#b8a888'); P.p(sx + 1, y, '#ece4d0'); P.p(sx + 2, y, '#ddd0b2'); P.p(sx + 3, y, '#b8a888'); } P.rect(sx, g.lt + 1, 4, 1, '#8a6a4a'); P.rect(sx, g.by1, 4, 1, '#8a6a4a'); P.p(sx + 1, g.lt + 6, '#a82a3a'); }
    // lacre de cera com fita
    if (gap === 0) { P.rect(19, g.by0 + 6, 6, 6, '#a82a2a'); P.rect(20, g.by0 + 5, 4, 8, '#a82a2a'); P.p(20, g.by0 + 6, '#e85a5a'); P.p(21, g.by0 + 7, '#ffb0a0'); P.rect(21, g.by0 + 8, 2, 2, '#6a1010'); for (let y = 0; y < 4; y++) { P.p(19 - (y >> 1), g.by0 + 12 + y, '#c83a3a'); P.p(24 + (y >> 1), g.by0 + 12 + y, '#c83a3a'); } }
    // penas cruzadas, maiores
    for (let i = 0; i < 16; i++) { P.p(13 + i, g.lt - 14 + i, '#2a2030'); P.p(31 - i, g.lt - 14 + i, '#a82a3a'); if (i < 8) { P.p(12 + i, g.lt - 14 + i, '#f8f8f8'); P.p(11 + i, g.lt - 13 + i, '#e0e0e8'); P.p(32 - i, g.lt - 14 + i, '#ffd0d0'); P.p(33 - i, g.lt - 13 + i, '#f0b0b0'); } }
    // gotas de tinta vermelha escorrendo
    for (const [x, n] of [[12, 4], [27, 3], [33, 5]]) for (let j = 0; j < n; j++) P.p(x, g.by1 - 6 + j, '#c83a3a');
    ferragem7(P, g, '#8a3a3a');
  }
};
for (const k of ARCA7) ARCA_DECO[k] = DECO7[k];
// ---------- a vida das formas finais em batalha ----------
const FX7 = { gotas: [] };
function arcaFx7(k, x, y, top) {
  const T = FRAME;
  if (k === 'guardiao') {
    const ang = Math.sin(T * 0.03) * 0.9, lx = x, ly = top - 6;
    bx.globalAlpha = 0.18; bx.fillStyle = '#fff0a0';
    for (const s of [-1, 1]) { bx.beginPath(); bx.moveTo(lx, ly); bx.lineTo(lx + s * Math.cos(ang) * 70, ly - 10 + Math.sin(ang) * 20); bx.lineTo(lx + s * Math.cos(ang) * 70, ly + 6 + Math.sin(ang) * 20); bx.closePath(); bx.fill(); }
    bx.globalAlpha = 1; luzMagia(lx, ly, 14, '#fff0a0', 0.35 + Math.sin(T * 0.1) * 0.1);
    if (T % 20 === 0) part({ x: x + rand(-18, 18), y: top + rand(0, 10), vy: -0.3, life: 30, col: '#fff0a0' });
  } else if (k === 'tempestade') {
    if (T % 2 === 0) part({ x: x + rand(-14, 14), y: top - 10, vy: 1.6, vx: -0.3, life: 14, col: '#8fd0ff' });
    if (T % 47 < 6) { const y0 = top + 2; bx.strokeStyle = T % 2 ? '#ffffff' : '#bff0ff'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(x - 16, y0); for (let i = 1; i <= 8; i++) bx.lineTo(x - 16 + i * 4, y0 + (i % 2 ? -3 : 3) + rand(-2, 2)); bx.stroke(); if (T % 47 === 0) sfx && 0; luzMagia(x, y0, 22, '#bff0ff', 0.4); }
    luzMagia(x, top - 14, 18, '#5a6478', 0.25);
  } else if (k === 'labirinto') {
    for (let i = 0; i < 3; i++) { const a = T * 0.025 + i * 2.09, cx = x + Math.cos(a) * 26, cy = y - 6 + Math.sin(a) * 8, frente = Math.sin(a) > 0; bx.globalAlpha = frente ? 1 : 0.55; bx.fillStyle = '#3a2a58'; bx.fillRect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5); bx.fillStyle = '#7a5ab8'; bx.fillRect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 1); bx.fillStyle = '#e0c8ff'; bx.fillRect(Math.round(cx), Math.round(cy), 1, 1); }
    bx.globalAlpha = 1;
    const p = (T % 120) / 120, px = x - 10 + p * 20, py = y + 4 + Math.sin(p * 12) * 3; luzMagia(px, py, 6, '#e0c8ff', 0.7);
  } else if (k === 'boca') {
    if (T % 40 === 0) FX7.gotas.push({ x: x + rand(-12, 12), y: y + 2, v: 0 });
    for (const d of FX7.gotas) { d.v += 0.08; d.y += d.v; bx.fillStyle = '#bff0ff'; bx.fillRect(Math.round(d.x), Math.round(d.y), 1, 2); }
    FX7.gotas = FX7.gotas.filter(d => d.y < y + 30);
    if (T % 90 < 20) { bx.globalAlpha = 0.25 * (1 - (T % 90) / 20); bx.fillStyle = '#e8d0d0'; bx.beginPath(); bx.arc(x + 4 + (T % 90) * 0.6, y - 4 - (T % 90) * 0.3, 3 + (T % 90) * 0.3, 0, 6.29); bx.fill(); bx.globalAlpha = 1; }
    if (T % 150 < 5) { bx.fillStyle = '#7a1e30'; for (const ex of [-9, -1, 8]) bx.fillRect(x + ex, top + 6, 4, 2); }
  } else if (k === 'bibliotecario') {
    for (let i = 0; i < 3; i++) { const a = T * 0.03 + i * 2.1, cx = x + Math.cos(a) * 28, cy = y - 14 + Math.sin(a * 1.3) * 10, ab = Math.abs(Math.sin(T * 0.25 + i)) * 3; const C2 = ['#8a3a3a', '#3a5a8a', '#3a7a4a'][i]; bx.fillStyle = C2; bx.fillRect(Math.round(cx) - 1, Math.round(cy), 2, 4); bx.fillStyle = '#f8f4e8'; bx.fillRect(Math.round(cx) - 1 - Math.round(ab), Math.round(cy), Math.round(ab), 3); bx.fillRect(Math.round(cx) + 1, Math.round(cy), Math.round(ab), 3); }
    if (T % 70 < 10) { const p = (T % 70) / 10; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x + 2 - p * 8), top - 4 - Math.round(Math.sin(p * 3.14) * 4), 4, 3); }
  } else if (k === 'palimpsesto') {
    const L = 'ABCDEFGHIJLMNOPQRSTUVXZ';
    for (let i = 0; i < 5; i++) { const ph = ((T * 0.6 + i * 40) % 200) / 200, a = ph * 6.28 + i, cx = x + Math.cos(a) * (14 + ph * 10), cy = y + 6 - ph * 44; txt(L[(i * 7 + (T / 60 | 0)) % L.length], cx, cy, { col: i % 2 ? '#c83a3a' : '#ff7a6a', alpha: Math.sin(ph * 3.14) }); }
  }
}
{ const _du7 = drawUnit; drawUnit = function (u) {
  _du7(u);
  try {
    if (u && u.id === 'bau' && !u.humano && u.hp > 0 && u.alpha !== 0 && typeof formaArca === 'function') {
      const k = formaArca(); if (k && ARCA7.includes(k)) { const [x, y] = unitCenter(u); arcaFx7(k, x, y, y - (u.h || 40) / 2); }
    }
  } catch (e) { }
}; }
