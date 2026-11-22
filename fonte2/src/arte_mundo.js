// ================= ARTE DO MUNDO DA T2 (mapas) =================
// Tiles de 16 px. Escala (regra fixa): adulto ~48 px (3 tiles), baú 16 px no mapa, porta ~2 tiles de altura e pouco
// mais de 1 de largura, casa térrea ~90 px de parede. Tudo pintado pixel a pixel com o pintor Pix (art2.js).
// TS = 16 (definido em core.js)
const TILE2 = {};          // cache: chave -> canvas
function tileArt(k, v = 0, f = 0) {
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), h = (x, y) => hash(x + v * 17, y + v * 31, 7) % 100;
  if (k === 'tab' || k === 'tabV') {                 // tábuas do cais (horizontais) ou do píer (verticais)
    const W = ramp('#8a5a34'), vert = k === 'tabV';
    for (let b = 0; b < 4; b++) {
      const tone0 = 0.42 + ((hash(b, v, 3) % 5) - 2) * 0.05;
      for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) {
        const x = vert ? b * 4 + j : i, y = vert ? i : b * 4 + j;
        let I = tone0 + (j === 0 ? 0.18 : j === 3 ? -0.2 : 0) + (((i * 7 + b * 13 + v) % 11) === 0 ? -0.12 : 0);
        P.p(x, y, P.tone(W, I, x, y));
      }
      // pregos nas pontas e um nó na madeira de vez em quando
      const nx = (b * 5 + v * 3) % 12 + 2;
      if (vert) { P.p(b * 4 + 1, 1, '#5a5a6a'); P.p(b * 4 + 1, 14, '#5a5a6a'); if (h(b, 1) < 30) P.p(b * 4 + 2, nx, W[0]); }
      else { P.p(1, b * 4 + 1, '#5a5a6a'); P.p(14, b * 4 + 1, '#5a5a6a'); if (h(b, 2) < 30) { P.p(nx, b * 4 + 1, W[0]); P.p(nx + 1, b * 4 + 2, W[1]); } }
    }
  } else if (k === 'agua' || k === 'corr') {         // água funda (4 quadros de onda) e correnteza (riscos que andam)
    const deep = ['#1c3a54', '#244a66', '#2e5a78', '#3a6e8e', '#5a90a8'];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const w = Math.sin((x + f * 2 + v * 5) * 0.55 + y * 0.9) + Math.sin((y - f) * 0.7 + x * 0.3);
      P.p(x, y, P.tone(deep, 0.42 + w * 0.08, x, y));
    }
    for (let i = 0; i < 3; i++) { const x = (h(i, 0) % 12) + 1, y = (h(i, 1) % 14) + 1; if ((f + i) % 4 < 2) { P.p(x, y, deep[4]); P.p(x + 1, y, deep[3]); } }
    if (k === 'corr') {                              // v = direção: 0 direita, 1 baixo, 2 esquerda, 3 cima
      for (let i = 0; i < 4; i++) {
        const t = (f * 4 + i * 4) % 16, o = (i * 5 + 3) % 14 + 1;
        const pts = [[t, o], [(t + 1) % 16, o], [(t + 2) % 16, o], [(t + 3) % 16, o]];
        for (const [a, b] of pts) { const [x, y] = v === 0 ? [a, b] : v === 2 ? [15 - a, b] : v === 1 ? [b, a] : [b, 15 - a]; P.p(x, y, '#b8e0f0'); }
      }
    }
  } else if (k === 'pedra') {                         // calçamento de pedra
    const S = ramp('#7a7480');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, '#3a3440');
    const stones = [[1, 1, 6, 5], [8, 1, 7, 4], [1, 7, 4, 4], [6, 6, 5, 5], [12, 6, 3, 5], [1, 12, 7, 3], [9, 12, 6, 3]];
    for (const [sx, sy, w, hh] of stones) for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) {
      const I = 0.55 - j / hh * 0.25 - i / w * 0.1 + ((h(sx + i, sy + j) % 9) === 0 ? -0.1 : 0) + (j === 0 ? 0.15 : 0);
      P.p(sx + i, sy + j, P.tone(S, I, sx + i, sy + j));
    }
    if (v % 3 === 1) { P.p(4, 10, '#4a7a3a'); P.p(11, 11, '#4a7a3a'); }   // mato entre as pedras
  } else if (k === 'lodo') {
    const M = ramp('#5a4a38');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(M, 0.45 + ((h(x, y) % 7) - 3) * 0.03, x, y));
    for (let i = 0; i < 2; i++) { const cx = h(i, 5) % 10 + 3, cy = h(i, 6) % 10 + 3; P.ball(cx, cy, 2.5, 1.6, ['#2a3a48', '#3a4a58', '#4a6070', '#6a8090', '#8aa0b0']); }
  } else if (k === 'grama') {
    const Gr = ramp('#4a6a34');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(Gr, 0.45 + ((h(x, y) % 9) - 4) * 0.025, x, y));
    for (let i = 0; i < 6; i++) { const x = h(i, 7) % 15, y = h(i, 8) % 13 + 2; P.p(x, y, Gr[3]); P.p(x, y - 1, Gr[4]); }
  } else if (k === 'muro') {                          // muro de pedra (sólido): face com tijolos
    const S = ramp('#6a5e6a');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const row = y >> 2, off = (row % 2) * 4, edge = (y % 4 === 3) || ((x + off) % 8 === 7);
      P.p(x, y, edge ? '#2e2834' : P.tone(S, 0.5 - (y % 4) * 0.06 + ((h(x >> 3, row) % 5) - 2) * 0.04, x, y));
    }
  } else if (k === 'escada') {                        // degraus de pedra descendo para a água
    const S = ramp('#7a7480');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const st = y >> 2; P.p(x, y, P.tone(S, 0.7 - st * 0.12 - (y % 4 === 3 ? 0.2 : 0), x, y)); }
  } else if (k === 'escuro') { P.rect(0, 0, 16, 16, '#0a0812'); }
  return TILE2[key] = P.canvas();
}

// ---------- gerador de moradores (front/back/side, 2 quadros cada) ----------
// o: { skin, hair, hairStyle: 'curto'|'longo'|'coque'|'careca'|'chapeu', top, bottom, apron, hat, h (altura 40..50), extra: fn }
const HUM_CACHE = {};
function humano(key, o) {
  if (HUM_CACHE[key]) return HUM_CACHE[key];
  const out = { f: [], b: [], s: [] };
  for (const view of ['f', 'b', 's']) for (let fr = 0; fr < 2; fr++) out[view].push(humanoFrame(o, view, fr));
  return HUM_CACHE[key] = out;
}
function humanoFrame(o, view, fr) {
  const H = o.h || 48, W = 24, P = new Pix(W, H + 2);
  const skin = ramp(o.skin || '#e0a878'), hair = ramp(o.hair || '#4a2a1a'), top = ramp(o.top || '#5a7a9a'), bot = ramp(o.bottom || '#3a3a4a');
  const cx = 12, s = H / 48, side = view === 's', back = view === 'b';
  const Y = v => Math.round(v * s);
  const bob = fr ? 1 : 0;
  // pernas e sapatos
  const legT = Y(33), legB = H - 1;
  const lx = side ? [cx - 1, cx + 1] : [cx - 3, cx + 1];
  for (const [i, x0] of lx.entries()) for (let y = legT; y <= legB - 2; y++) for (let x = x0; x < x0 + 3; x++) P.p(x + (side && fr && i ? 1 : 0), y, P.tone(bot, 0.5 - (x - x0) * 0.1, x, y));
  for (const x0 of lx) P.rect(x0 - (side ? 0 : 0), legB - 1, side ? 4 : 3, 2, '#2a1e1a');
  // tronco
  const tT = Y(17) + bob, tB = Y(34);
  for (let y = tT; y <= tB; y++) { const half = side ? 3 : 5 + (y > tT + 3 ? 1 : 0) - (y > tB - 2 ? 1 : 0); for (let x = cx - half; x <= cx + half - (side ? 0 : 1); x++) P.p(x, y, P.tone(top, 0.62 - (x - cx + half) / (half * 2) * 0.35 - (y - tT) / 60, x, y)); }
  if (o.apron && !back) for (let y = tT + 6; y <= tB + 2; y++) for (let x = cx - 3; x <= cx + 2 - (side ? 2 : 0); x++) P.p(x, y, P.tone(ramp(o.apron), 0.7 - (y - tT) / 40, x, y));
  if (o.coat) for (let y = tT; y <= tB + Y(8); y++) { const half = side ? 4 : 6; for (let x = cx - half; x <= cx + half - (side ? 0 : 1); x++) if (!(view === 'f' && Math.abs(x - cx + 0.5) < 1.5 && y > tT + 4)) P.p(x, y, P.tone(ramp(o.coat), 0.55 - (x - cx + half) / (half * 2) * 0.35, x, y)); }
  // braços
  const armC = o.coat ? ramp(o.coat) : top;
  if (side) { for (let y = tT + 1; y <= tT + Y(12); y++) P.p(cx + (fr ? 1 : 0), y, P.tone(armC, 0.4, cx, y)); P.p(cx + (fr ? 1 : 0), tT + Y(13), skin[2]); }
  else for (const ax of [cx - 7, cx + 6]) { for (let y = tT + 1; y <= tT + Y(12); y++) { P.p(ax, y, P.tone(armC, 0.5, ax, y)); P.p(ax + (ax < cx ? 1 : -1), y, P.tone(armC, 0.35, ax, y)); } P.p(ax, tT + Y(13), skin[2]); P.p(ax + (ax < cx ? 1 : -1), tT + Y(13), skin[1]); }
  // cabeça
  const hcY = Y(10) + bob, hr = Math.max(5, Math.round(6 * s));
  P.ball(cx + (side ? -1 : 0), hcY, hr, hr + 1, skin);
  P.rect(cx - 1, hcY + hr, 3, 2, skin[1]);                                                   // pescoço
  // cabelo
  const hs = o.hairStyle || 'curto';
  if (hs !== 'careca') {
    P.ball(cx + (side ? 0 : 0), hcY - 2, hr + 1, hr, hair, { clip: (x, y) => back || y < hcY - 1 || (side ? x > cx + 1 : Math.abs(x - cx + 0.5) > hr - 1) });
    if (hs === 'longo') for (let y = hcY; y < hcY + Y(12); y++) for (let x = cx - hr - 1; x <= cx + hr; x++) if (back || (side ? x > cx + 1 : Math.abs(x - cx + 0.5) > hr - 2)) P.p(x, y, P.tone(hair, 0.4 - (y - hcY) / 40, x, y));
    if (hs === 'coque') P.ball(cx + (side ? 3 : 0), hcY - hr - 1, 3, 3, hair);
  }
  if (o.hat) { const hc = ramp(o.hat); P.poly([[cx - hr - 3, hcY - 3], [cx + hr + 3, hcY - 3], [cx + hr + 1, hcY - 1], [cx - hr - 1, hcY - 1]], (x, y) => P.tone(hc, 0.55, x, y)); P.ball(cx, hcY - 5, hr - 1, 3, hc, { clip: (x, y) => y < hcY - 3 }); }
  // rosto
  if (view === 'f') { P.p(cx - 3, hcY + 1, '#2a1a1a'); P.p(cx + 2, hcY + 1, '#2a1a1a'); P.p(cx - 3, hcY, '#ffffff'); P.p(cx - 1, hcY + 4, skin[0]); P.p(cx, hcY + 4, skin[0]); if (o.beard) for (let x = cx - 3; x <= cx + 2; x++) { P.p(x, hcY + 4, hair[2]); P.p(x, hcY + 5, hair[1]); } }
  if (side) { P.p(cx - 4, hcY, '#2a1a1a'); P.p(cx - 4, hcY + 1, '#2a1a1a'); P.p(cx - 5, hcY - 2, hair[1]); P.p(cx - 4, hcY - 2, hair[1]); P.p(cx - 7, hcY + 1, skin[2]); P.p(cx - 7, hcY + 2, skin[1]); P.p(cx - 5, hcY + 4, skin[0]); P.p(cx, hcY + 1, skin[1]); if (o.beard) for (let y = hcY + 3; y <= hcY + 5; y++) for (let x = cx - 6; x <= cx - 1; x++) P.p(x, y, hair[1]); }
  if (o.extra) o.extra(P, { view, fr, cx, hcY, tT, tB, s, H });
  return P.outline().canvas();
}
function humanoSprite(h, dir, t) {
  // direção do mapa -> vista; os sprites de lado olham para a ESQUERDA
  const v = dir === 'up' ? h.b : dir === 'down' ? h.f : h.s, fr = v[Math.floor(t / 24) % v.length];
  return dir === 'right' ? flipC(fr) : fr;
}

// ---------- construções (props grandes) ----------
// casa de madeira sobre palafitas. o: { w (tiles), wallH (px), wall, roof, trim, door: dx (tile), win: [dx..], sign, awning, stone }
function casaArt(o) {
  const W = o.w * TS, roofH = o.roofH || 34, wallH = o.wallH || 88, stH = o.stilts ? 12 : 0, H = roofH + wallH + stH + 4;
  const P = new Pix(W, H), WL = ramp(o.wall || '#a8704a'), RF = ramp(o.roof || '#8a3a2a'), TR = ramp(o.trim || '#5a3a24');
  const wy0 = roofH, wy1 = roofH + wallH;
  // parede: tábuas horizontais (ou pedra)
  for (let y = wy0; y < wy1; y++) for (let x = 2; x < W - 2; x++) {
    if (o.stone) { const row = (y - wy0) >> 3, off = (row % 2) * 6, edge = ((y - wy0) % 8 === 7) || ((x + off) % 12 === 11); P.p(x, y, edge ? WL[0] : P.tone(WL, 0.55 - ((x + off) % 12) / 40 + ((hash(x >> 3, row, 9) % 5) - 2) * 0.04, x, y)); }
    else { const b = (y - wy0) % 6; P.p(x, y, P.tone(WL, (b === 0 ? 0.7 : b === 5 ? 0.25 : 0.5) - x / W * 0.15 + (((x * 13 + (y - wy0 >> 3) * 7) % 23) === 0 ? -0.1 : 0), x, y)); }
  }
  // marca d'água e limo na base (a cidade afunda)
  for (let y = wy1 - 14; y < wy1; y++) for (let x = 2; x < W - 2; x++) if ((y - (wy1 - 14)) > 4 + Math.sin(x * 0.3) * 2) P.p(x, y, P.tone(ramp('#4a6a4a'), 0.35 + (y - wy1) / 40, x, y));
  // colunas de canto
  P.cyl(0, wy0 - 2, 4, wallH + 2, TR); P.cyl(W - 4, wy0 - 2, 4, wallH + 2, TR);
  // telhado visto de cima, estilo HLD: laje chapada com borda grossa colorida, sombra interna e respiro de metal
  for (let y = 0; y < roofH; y++) for (let x = -1; x < W + 1; x++) {
    const rim = y < 3 || y >= roofH - 5 || x < 3 || x >= W - 3;
    let c = rim ? (y < 1 ? RF[4] : y < 3 ? RF[3] : y >= roofH - 2 ? RF[0] : y >= roofH - 5 ? RF[1] : x < 3 ? RF[3] : RF[1]) : ((y < 6 || x < 6) ? RF[2] : RF[3]);
    if (!rim && (hash(x >> 2, y >> 2, 77) % 23 === 0)) c = RF[2];
    P.p(x, y, c);
  }
  { const vx = W - 22, vy = 6; P.rect(vx, vy, 13, 9, '#5a5a66'); P.rect(vx + 1, vy, 11, 7, '#a8a8b4'); for (let i = 0; i < 4; i++) P.rect(vx + 2 + i * 3, vy + 2, 1, 4, '#4a4a56'); }
  if (o.chimney) { P.cyl(W - 22, -2, 8, 16, ramp('#7a6a6a')); P.rect(W - 23, -3, 10, 2, '#4a3a3a'); }
  // janelas com luz quente e floreira
  for (const dx of (o.win || [])) {
    const x = dx * TS + 2, y = wy0 + 18;
    P.rect(x - 1, y - 1, 16, 20, TR[0]); P.rect(x, y, 14, 18, TR[2]);
    for (let j = 0; j < 16; j++) for (let i = 0; i < 12; i++) P.p(x + 1 + i, y + 1 + j, P.tone(['#5a3a2a', '#c87a3a', '#f0b050', '#ffd880', '#fff0c0'], 0.85 - j / 26 - (i === 5 || i === 6 ? 0.25 : 0), x + 1 + i, y + 1 + j));
    P.rect(x + 1, y + 8, 12, 1, TR[1]); P.rect(x + 6, y + 1, 1, 16, TR[1]);
    P.rect(x - 2, y + 19, 18, 3, TR[1]); for (let i = 0; i < 5; i++) P.p(x + 1 + i * 3, y + 18, ['#e86890', '#f0c040', '#ffffff'][i % 3]);
  }
  // porta (2,1 m = ~60 px; aqui 2 tiles de largura útil e 3,5 de altura)
  if (o.door != null) {
    const dx = o.door * TS + 2, dw = 24, dh = 58, dy = wy1 - dh;
    P.rect(dx - 2, dy - 3, dw + 4, dh + 3, TR[0]);
    for (let j = 0; j < dh; j++) for (let i = 0; i < dw; i++) P.p(dx + i, dy + j, P.tone(ramp(o.doorC || '#6a4028'), 0.55 - i / dw * 0.25 + (i % 8 === 0 ? -0.15 : 0), dx + i, dy + j));
    P.ball(dx + dw - 5, dy + 30, 1.6, 1.6, ramp('#d0a030'));
    if (o.doorWin) { P.rect(dx + 6, dy + 6, 12, 10, '#f0b050'); P.rect(dx + 11, dy + 6, 1, 10, TR[0]); }
  }
  // toldo listrado
  if (o.awning) {
    const ay = wy0 + 6, AW = ramp(o.awning);
    for (let y = 0; y < 12; y++) for (let x = 4; x < W - 4; x++) P.p(x, ay + y, ((x >> 3) % 2) ? P.tone(AW, 0.6 - y * 0.03, x, ay + y) : P.tone(ramp('#e8dcc0'), 0.7 - y * 0.03, x, ay + y));
    for (let x = 4; x < W - 4; x += 4) P.ball(x + 2, ay + 12, 2, 2, (x >> 3) % 2 ? AW : ramp('#e8dcc0'));
  }
  // placa
  if (o.signC) { const sx = (W >> 1) - 24, sy = wy0 - 2; P.rect(sx, sy, 48, 14, TR[0]); P.rect(sx + 1, sy + 1, 46, 12, ramp(o.signC)[2]); P.rect(sx + 1, sy + 1, 46, 2, ramp(o.signC)[3]); }
  // palafitas
  if (o.stilts) for (let x = 6; x < W - 6; x += 22) { P.cyl(x, wy1, 5, stH + 4, ramp('#5a3a24')); P.rect(x, wy1 + stH, 5, 4, ramp('#3a5a4a')[1]); }
  P.outline();
  return { img: P.canvas(), w: W, h: H, foot: stH + 4 };
}
// a torre do sino, torta e sem sino (o sino caiu há cem anos; agora tem um de lata)
function torreArt(comSino) {
  const W = 64, H = 200, P = new Pix(W, H), S = ramp('#8a7a7a'), RF = ramp('#4a5a7a');
  for (let y = 40; y < H - 4; y++) {
    const lean = Math.round((H - y) * 0.05);
    for (let x = 10; x < 54; x++) { const row = (y >> 3), off = (row % 2) * 5, edge = (y % 8 === 7) || ((x + off) % 10 === 9); P.p(x + lean, y, edge ? S[0] : P.tone(S, 0.6 - (x - 10) / 60 + ((hash(x >> 3, row, 5) % 5) - 2) * 0.04, x, y)); }
  }
  // arco do campanário
  for (let y = 52; y < 92; y++) for (let x = 20; x < 44; x++) { const r = Math.hypot(x - 32 + 0.5, Math.max(0, 64 - y)); if (r < 12 || y > 64) P.p(x + Math.round((H - y) * 0.05), y, '#1a1424'); }
  if (comSino) P.ball(32 + 7, 74, 9, 10, ramp('#c89a40'));
  else { P.rect(36, 66, 1, 10, '#5a5a6a'); P.ball(37, 80, 4, 4, ramp('#8a8a9a')); }                 // o sininho de lata provisório
  // telhado pontudo
  P.poly([[6 + 8, 42], [58 + 8, 42], [32 + 10, 4]], (x, y) => P.tone(RF, 0.7 - (y - 4) / 50 + (x < 40 ? 0.1 : -0.1), x, y));
  P.rect(40, 0, 2, 6, '#c89a40');
  // relógio parado
  P.ball(32 + 5, 120, 8, 8, ramp('#e8dcc0')); P.line(37, 120, 37, 114, '#2a1e1a'); P.line(37, 120, 41, 122, '#2a1e1a');
  // limo e marca d'água
  for (let y = H - 30; y < H - 4; y++) for (let x = 10; x < 54; x++) if (hash(x, y, 2) % 3 === 0) P.p(x, y, P.tone(ramp('#4a6a4a'), 0.4, x, y));
  P.outline();
  return { img: P.canvas(), w: W, h: H };
}
// poste de luz (~120 px; 4 m), apagado ou aceso
function posteArt(aceso) {
  const P = new Pix(18, 124), F = ramp('#3a3a4a');
  P.cyl(7, 20, 4, 102, F); P.rect(5, 118, 8, 6, F[1]);
  P.poly([[3, 6], [15, 6], [13, 20], [5, 20]], (x, y) => aceso ? P.tone(RP.fogo, 0.85 - (y - 6) * 0.02, x, y) : P.tone(['#2a2430', '#3a3440', '#4a4450', '#6a6070', '#8a8090'], 0.5, x, y));
  P.rect(2, 4, 14, 3, F[2]); P.rect(6, 0, 6, 4, F[1]); P.rect(4, 20, 10, 2, F[2]);
  P.outline(); return P.canvas();
}
// barquinho a remo, caixotes, barril, varal
function barcoArt() { const P = new Pix(52, 20), B = ramp('#7a5a3a'); P.poly([[0, 6], [52, 6], [44, 18], [8, 18]], (x, y) => P.tone(B, 0.65 - (y - 6) / 18 - x / 120, x, y)); P.rect(2, 6, 48, 2, B[3]); P.rect(16, 6, 3, 10, B[1]); P.rect(32, 6, 3, 10, B[1]); P.line(20, 4, 46, 0, ramp('#8a6a4a')[2], 2); P.outline(); return P.canvas(); }
function caixoteArt(v = 0) { const P = new Pix(18, 18), B = ramp(v ? '#9a7a4a' : '#8a6a3a'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x + 1, y + 2, P.tone(B, 0.6 - y / 30 - x / 50 + ((x === 0 || x === 15 || y === 0 || y === 15) ? 0.15 : 0), x, y)); P.line(2, 3, 15, 16, B[1]); P.line(15, 3, 2, 16, B[1]); P.outline(); return P.canvas(); }
function barrilArt() { const P = new Pix(16, 20), B = ramp('#7a4a2a'); P.cyl(1, 1, 14, 18, B); for (const y of [3, 9, 15]) P.rect(1, y, 14, 1, '#4a4a5a'); P.outline(); return P.canvas(); }

// ---------- inimigos novos do Cap. 2 (pixel art detalhada) ----------
// Lambe-Lodo: sanguessuga gorda de lodo, com boca de ventosa e brilho de âmbar na barriga
function lambeArt(f) {
  const P = new Pix(34, 22), M = ramp('#4a5a3a'), B = ramp('#8a7a4a');
  const ond = f === 1 ? 2 : 0;
  for (let i = 0; i < 5; i++) P.ball(8 + i * 5, 14 - Math.sin(i * 0.9 + ond) * 2, 6 - Math.abs(i - 2) * 0.6, 5, M);
  for (let i = 0; i < 5; i++) P.p(8 + i * 5, 17 - Math.sin(i * 0.9 + ond) * 2, B[3]);                      // barriguinha listrada
  P.ball(5, 12, 5, 5, M); P.ball(3, 12, 3, 3, ramp('#8a3a4a')); P.ball(3, 12, 1.5, 1.5, ['#1a0a10', '#1a0a10', '#3a1020', '#3a1020', '#5a2030']);   // ventosa
  for (const [x, y] of [[2, 9], [5, 8], [2, 15], [5, 16]]) P.p(x, y, '#f2ecdc');                             // dentinhos
  P.p(9, 9, '#ffb040'); P.p(10, 9, '#fff0a0');                                                               // olho
  if (f === 2) for (let i = 0; i < 4; i++) P.p(1 + i * 2, 20, '#5fa0d0');
  return P.outline().canvas();
}
// Caranguejo-Telha: casco feito de telhas de um telhado que afundou
function caranguejoArt(f) {
  const P = new Pix(40, 30), C = ramp('#c85a3a'), T = ramp('#a8503a');
  // pernas
  for (let i = 0; i < 3; i++) { const lx = 10 + i * 5, up = (f + i) % 2; P.line(lx, 20, lx - 6, 27 - up, C[1], 2); P.line(40 - lx, 20, 46 - lx, 27 - up, C[1], 2); }
  P.ball(20, 19, 12, 7, C);
  // casco de telhas sobrepostas
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) { const x = 8 + r * 3 + i * 7, y = 6 + r * 4; for (let j = 0; j < 6; j++) for (let k = 0; k < 8; k++) if (Math.hypot(k - 3.5, j * 1.2) < 5) P.p(x + k, y + j, P.tone(T, 0.75 - j * 0.07 - r * 0.08, x + k, y + j)); }
  P.p(14, 8, ramp('#4a7a3a')[3]); P.p(25, 11, ramp('#4a7a3a')[2]);                                           // limo
  // olhos em hastes e pinças
  for (const ex of [15, 25]) { P.line(ex, 17, ex, 12 + (f === 2 ? -1 : 0), C[1]); P.ball(ex, 11 + (f === 2 ? -1 : 0), 1.6, 1.6, ['#1a1010', '#1a1010', '#2a1a1a', '#ffffff', '#ffffff']); }
  const pz = f === 2 ? -4 : 0;
  P.ball(4, 18 + pz, 5, 4, C); P.poly([[0, 16 + pz], [6, 15 + pz], [2, 20 + pz]], '#1a1010');
  P.ball(36, 18 + pz, 5, 4, C); P.poly([[40, 16 + pz], [34, 15 + pz], [38, 20 + pz]], '#1a1010');
  return P.outline().canvas();
}
// Sapo-Sino: sapo gordo com um sininho de bronze na papada (a badalada deixa tonto)
function sapoArt(f) {
  const P = new Pix(32, 28), S = ramp('#4a8a5a'), B = ramp('#e8d8a0');
  const inf = f === 2 ? 2 : 0;
  P.ball(16, 18, 12 + inf, 9 + inf * 0.5, S); P.ball(16, 22, 8 + inf, 5, B);
  P.ball(9, 9, 4, 4, S); P.ball(23, 9, 4, 4, S);
  for (const ex of [9, 23]) { P.ball(ex, 8, 2.5, 2.5, ['#1a1010', '#2a2010', '#f0c040', '#fff0a0', '#ffffff']); P.p(ex, 8, '#1a1010'); }
  P.line(9, 15, 23, 15, S[0]); P.ball(16, 26, 4, 3.5, ramp('#c89a40')); P.p(16, 29, '#5a4a2a');                // boca e sino
  for (const [x, y] of [[8, 20], [24, 21], [12, 13], [21, 14]]) P.p(x, y, S[0]);
  P.ball(5, 25, 3, 2, S); P.ball(27, 25, 3, 2, S);
  if (f === 2) for (let i = 0; i < 3; i++) P.p(28 + i, 20 - i * 3, '#ffe066');
  return P.outline().canvas();
}
const FR2 = {};
function fr2(k, f) { const key = k + f; if (FR2[key]) return FR2[key]; return FR2[key] = ({ lambe: lambeArt, caranguejo: caranguejoArt, sapo: sapoArt })[k](f); }
