// ===== A Arca da Origem no estilo do sprite pequeno de andar (v2.21, pedido do usuário) =====
// "Eu gostava mais dos sprites antigos do baú pequeno; reaproveite para ele no mapa e nos sprites maiores."
// O mapa volta ao desenho original (creme, bordas douradas, faixa marrom, coroa dourada, olhos e pedras azuis).
// Aqui a mesma Arca é redesenhada grande (batalha, retrato, título), pixel a pixel, com sombreamento e contorno.
function arcaRamp(base) {
  const n = parseInt(base.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255], dk = [38, 20, 52], lt = [255, 248, 224];
  const mix = (t, k) => '#' + c.map((v, i) => Math.round(v + (t[i] - v) * k).toString(16).padStart(2, '0')).join('');
  return [mix(dk, 0.6), mix(dk, 0.32), mix(c, 0), mix(lt, 0.3), mix(lt, 0.6)];
}
const ARCA_BY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
function arcaGrande(mode, md) {
  // md = true: versão média (~28 px de altura), a da batalha ao lado de humanos de ~48 px
  // mode: 'front' (boca aberta, língua), 'idle' (boca entreaberta, olhos), 'closed' (piscando), 'three' (3/4 virado à direita)
  const W = md ? 34 : 44, H = md ? 31 : 43, buf = new Array(W * H).fill(null);
  const p = (x, y, c) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H && c) buf[y * W + x] = c; };
  const g = (x, y) => (x >= 0 && y >= 0 && x < W && y < H) ? buf[y * W + x] : null;
  const tone = (R, I, x, y) => { const f = Math.max(0, Math.min(0.999, I)) * (R.length - 1), i = Math.floor(f); return R[Math.min(R.length - 1, (f - i) > (ARCA_BY[y & 3][x & 3] + 0.5) / 16 ? i + 1 : i)]; };
  const SA = arcaRamp('#d8c8a8'), GO = arcaRamp('#f0c040'), BR = arcaRamp('#7a4a2a'), CY = ['#1a4a6a', '#3a8ab0', '#7ad0f0', '#bfeaff', '#ffffff'], WH = arcaRamp('#f2ecdc');
  const three = mode === 'three';
  const x0 = md ? 2 : 3, x1 = md ? (three ? 25 : 30) : (three ? 33 : 40);                         // a face da frente
  const lidT = md ? 8 : 11, lidB = md ? 14 : 20, mT = md ? 15 : 21;
  const mB = md ? (mode === 'front' ? 21 : mode === 'closed' ? 17 : 19) : (mode === 'front' ? 30 : mode === 'closed' ? 24 : 27), bT = mB + 1, bB = md ? 29 : 40;
  const fw = x1 - x0;
  const lx = x => (x - x0) / fw;                                // 0 na esquerda (lado da luz), 1 na direita
  // --- tampa: arredondada em cima, creme com luz de cima à esquerda ---
  for (let y = lidT; y <= lidB; y++) for (let x = x0; x <= x1; x++) {
    const r = y - lidT; if (r < 3 && (x < x0 + 3 - r || x > x1 - 3 + r)) continue;
    p(x, y, tone(SA, 0.9 - r / 26 - lx(x) * 0.22, x, y));
  }
  // friso dourado no alto da tampa e colunas douradas nas bordas (o "o" do sprite pequeno)
  for (let x = x0 + 2; x <= x1 - 2; x++) { p(x, lidT, tone(GO, 0.95 - lx(x) * 0.3, x, lidT)); p(x, lidT + 1, tone(GO, 0.72 - lx(x) * 0.3, x, lidT + 1)); }
  for (let y = lidT + 2; y <= bB; y++) { if (y >= mT && y <= mB) continue; p(x0, y, tone(GO, 0.75, x0, y)); p(x0 + 1, y, tone(GO, 0.62, x0 + 1, y)); p(x1 - 1, y, tone(GO, 0.45, x1 - 1, y)); p(x1, y, tone(GO, 0.32, x1, y)); }
  // faixa marrom embaixo da tampa (o "b")
  for (let x = x0; x <= x1; x++) { p(x, lidB - 1, tone(BR, 0.7 - lx(x) * 0.3, x, lidB - 1)); p(x, lidB, tone(BR, 0.45 - lx(x) * 0.2, x, lidB)); }
  // cantos brancos (o "l")
  p(x0 + 2, lidT + 2, WH[3]); p(x0 + 3, lidT + 2, WH[2]); p(x0 + 2, lidT + 3, WH[2]); p(x1 - 2, lidT + 2, WH[2]);
  // --- boca: escuro, dentes em cima e embaixo, olhos azuis, língua quando aberta ---
  for (let y = mT; y <= mB; y++) for (let x = x0; x <= x1; x++) p(x, y, y === mT || y === mB ? '#1e1424' : '#120e1a');
  const tp = md ? 3 : 4, teeth = Math.floor((fw - 2) / tp);
  for (let i = 0; i < teeth; i++) {
    const tx = x0 + 2 + i * tp, tw_ = md ? 2 : 3, hU = md ? (mode === 'closed' ? 1 : 2) : (mode === 'closed' ? 2 : 3), hD = md ? 1 : (mode === 'closed' ? 1 : 2);
    for (let k = 0; k < hU; k++) for (let j = k; j < tw_ - k; j++) p(tx + j, mT + k, tone(WH, 0.85 - k * 0.2 - lx(tx) * 0.2, tx + j, mT + k));
    for (let k = 0; k < hD; k++) for (let j = k; j < tw_ - k; j++) p(tx + j, mB - k, tone(WH, 0.65 - k * 0.15 - lx(tx) * 0.2, tx + j, mB - k));
  }
  if (mode !== 'closed') {
    const ey = md ? mT + 2 : (mode === 'front' ? mT + 4 : mT + 3), exs = [x0 + Math.round(fw * 0.3), x0 + Math.round(fw * 0.66)];
    for (const ex of exs) {
      if (md) { p(ex, ey, CY[4]); p(ex + 1, ey, CY[2]); p(ex, ey + 1, CY[1]); p(ex + 1, ey + 1, CY[1]); }
      else { for (let j = 0; j < 4; j++) { p(ex - 1 + j, ey, CY[2]); p(ex - 1 + j, ey + 1, CY[1]); }
      p(ex, ey, CY[4]); p(ex + 1, ey, CY[3]);
      p(ex - 2, ey, '#2a3a5a'); p(ex + 3, ey + 1, '#2a3a5a'); }            // brilho em volta
    }
    if (mode === 'front') { const cx = x0 + (fw >> 1), tr = md ? 3.5 : 5.5; for (let y = mB - (md ? 2 : 3); y <= mB - 1; y++) for (let x = cx - 5; x <= cx + 5; x++) { const r = Math.hypot((x - cx) / tr, (y - mB + 1) / (md ? 1.8 : 2.4)); if (r < 1) p(x, y, r < 0.5 ? '#f08aa8' : '#c8486a'); } p(cx, mB - 2, '#8a2a48'); }
  } else {
    const ey = mT + 1, exs = [x0 + Math.round(fw * 0.3), x0 + Math.round(fw * 0.66)];   // olhos fechadinhos
    for (const ex of exs) for (let j = 0; j < (md ? 2 : 4); j++) p(ex - (md ? 0 : 1) + j, ey + (md ? 0 : (j === 0 || j === 3 ? 0 : 1)), CY[1]);
  }
  // --- corpo: faixa marrom, creme, fechadura dourada com buraco azul, pedras azuis ---
  for (let y = bT; y <= bB; y++) for (let x = x0 + 2; x <= x1 - 2; x++) {
    if (y <= bT + 1) p(x, y, tone(BR, (y === bT ? 0.62 : 0.42) - lx(x) * 0.25, x, y));
    else p(x, y, tone(SA, 0.72 - (y - bT) / 34 - lx(x) * 0.24 + (((x * 3 + y * 5) % 13 === 0) ? -0.12 : 0), x, y));
  }
  for (let x = x0; x <= x1; x++) p(x, bB, tone(BR, 0.35, x, bB));                             // base
  const lw = md ? 5 : 7, lh = md ? 4 : 6, lk = x0 + (fw >> 1) - (lw >> 1);
  for (let y = bT; y <= bT + lh; y++) for (let x = lk; x < lk + lw; x++) p(x, y, tone(GO, 0.9 - (y - bT) * 0.07 - (x - lk) * 0.04, x, y));
  const kx = lk + (lw >> 1); if (md) { p(kx, bT + 2, CY[2]); p(kx, bT + 3, CY[1]); } else { p(kx, bT + 2, CY[2]); p(kx, bT + 3, CY[2]); p(kx, bT + 4, CY[1]); p(kx - 1, bT + 3, CY[1]); p(kx + 1, bT + 3, CY[1]); }
  const gem = (gx, gy) => { p(gx, gy - 1, CY[3]); p(gx - 1, gy, CY[2]); p(gx, gy, CY[4]); p(gx + 1, gy, CY[1]); p(gx, gy + 1, CY[1]); };
  if (md) { p(x0 + 4, bB - 4, CY[3]); p(x0 + 4, bB - 3, CY[1]); p(x1 - 4, bB - 4, CY[3]); p(x1 - 4, bB - 3, CY[1]); p(x0 + (fw >> 1), bB - 2, CY[2]); }
  else { gem(x0 + 5, bB - 6); gem(x1 - 5, bB - 6); gem(x0 + (fw >> 1) - 2, bB - 3); gem(x0 + (fw >> 1) + 2, bB - 3); }
  // --- coroa dourada no topo (o enfeite do sprite pequeno) ---
  const cx = x0 + (fw >> 1) + (three ? (md ? 2 : 3) : 0), lidTc = three ? lidT - (md ? 2 : 3) : lidT;
  const cw = md ? 5 : 7;
  for (let x = cx - cw; x <= cx + cw; x++) { p(x, lidTc - 1, tone(GO, 0.85 - (x - cx + cw) * 0.03, x, lidTc - 1)); if (!md) p(x, lidTc - 2, tone(GO, 0.95 - (x - cx + cw) * 0.03, x, lidTc - 2)); }
  for (let y = lidTc - (md ? 4 : 6); y <= lidTc - (md ? 2 : 3); y++) for (let x = cx - (md ? 1 : 2); x <= cx + (md ? 0 : 1); x++) p(x, y, tone(GO, 0.95 - (x - cx + 2) * 0.12 - (y - lidTc + 6) * 0.05, x, y));
  for (const sx of (md ? [cx - 4, cx + 3] : [cx - 6, cx + 5])) { p(sx, lidTc - 2, GO[3]); if (!md) p(sx, lidTc - 4, GO[4]); }
  if (md) p(cx - 1, lidTc - 3, CY[3]); else { p(cx - 1, lidTc - 5, CY[3]); p(cx, lidTc - 5, CY[2]); }
  // --- vista 3/4: a lateral direita aparece, mais escura, subindo em perspectiva ---
  if (three) {
    const SW = md ? 5 : 7;
    for (let x = x1 + 1; x <= x1 + SW; x++) {
      const off = Math.round((x - x1) * 0.6), k = (x - x1) / SW;
      for (let y = lidT + 2 - off; y <= bB - off; y++) {
        let c;
        if (y + off <= lidB - 2) c = tone(SA, 0.42 - k * 0.15, x, y);
        else if (y + off <= lidB) c = tone(BR, 0.3, x, y);
        else if (y + off <= mB) c = '#120e1a';
        else if (y + off <= bT + 1) c = tone(BR, 0.3, x, y);
        else c = tone(SA, 0.34 - k * 0.12, x, y);
        p(x, y, c);
      }
      p(x, lidT + 1 - off, tone(GO, 0.5, x, lidT + 1 - off));                                    // friso da tampa
    }
    for (let y = lidT + 2 - Math.round(SW * 0.6); y <= bB - Math.round(SW * 0.6); y++) p(x1 + SW, y, tone(GO, 0.3, x1 + SW, y));          // quina dourada do fundo
    // tampo: liga a frente à lateral (o baú vira uma caixa de verdade)
    const TR = md ? 3 : 4;
    for (let r = 1; r <= TR; r++) {
      const y = lidT + 1 - r, sh = Math.round(r * 1.75);
      for (let x = x0 + 3 + sh; x <= x1 + sh; x++) p(x, y, tone(r === TR ? GO : SA, r === TR ? 0.7 : 0.95 - r * 0.04 - lx(x) * 0.15, x, y));
    }
    for (let y = mT; y <= mB; y += 3) p(x1 + 2, y - 1, WH[1]);                                     // dentinho de lado
  }
  // contorno seletivo
  const add = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g(x, y)) continue;
    let n = null; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const c = g(x + dx, y + dy); if (c) { n = c; break; } }
    if (n) add.push([x, y]);
  }
  for (const [x, y] of add) p(x, y, '#120e1a');
  const cv = mk(W, H), cx2 = cv.getContext('2d');
  for (let i = 0; i < buf.length; i++) if (buf[i]) { cx2.fillStyle = buf[i]; cx2.fillRect(i % W, (i / W) | 0, 1, 1); }
  return cv;
}
{ const _bs = buildSprites; buildSprites = function () {
  _bs();
  if (!CHEST8.arca) return;
  const t = arcaGrande('three', true);
  // como na arte original: 'three' olha para a direita (a lateral aparece à esquerda); 'three_l' olha para a esquerda
  CHEST8.arca.bat = { front: arcaGrande('front', true), three: flipH(t), three_l: t, closed: arcaGrande('closed', true), idle: arcaGrande('idle', true) };
  CHEST8.arca.closed = CHEST8.arca.bat.closed;
}; }
