// ================= O BAÚ EM CENA NA BATALHA =================
// Batalha lateral: o baú (e a Lume) à esquerda, de perfil, com a boca virada para os inimigos à direita.
// Cada uma das 16 formas tem sprite de batalha próprio (32x28, desenhado em escala 2) com poses:
// idle (4 quadros: respira, pisca), open (ataque/feitiço), shut (defesa), hurt (golpe), win (vitória).
const BPX = 46, BPY = 116;            // centro dos pés do baú na arena
const BOXDY = 34;                     // a caixa de texto da batalha desceu 34px (arena maior)
const PB_W = 32, PB_H = 34, PB_SC = 1;
const PB_MAP = {
  caixote: {}, ferro: { o: 'l', n: 'm', b: 'd', l: 'y' }, arcano: { o: 'L', n: 'q', b: 'P', l: 'c', y: 'c' },
  fortaleza: { o: 'm', n: 'd', b: 'k', l: 'y' }, espinho: { o: 'l', n: 'm', b: 'd', l: 'r', y: 'f' },
  grimorio: { o: 'w', n: 's', b: 'q', l: 'P', y: 'p' }, estelar: { o: 'u', n: 'B', b: 'k', l: 'c', y: 'w' },
  bastiao: { o: 'y', n: 'm', b: 'd', l: 'w' }, abismo: { o: 'd', n: 'k', b: 'P', l: 'q', y: 'r' },
  ferrao: { o: 'g', n: 'G', b: 'k', l: 'v' }, carniceiro: { o: 'r', n: 'b', b: 'k', l: 'w' },
  biblioteca: { o: 's', n: 'n', b: 'b', l: 'y', y: 'c' }, proibido: { o: 'P', n: 'k', b: 'r', l: 'r', y: 'r' },
  eclipse: { o: 'k', n: 'P', b: 'k', l: 'L', y: 'w' }, constelacao: { o: 'B', n: 'u', b: 'k', l: 'w' },
  arca: { o: 'y', n: '#e8dcc0', b: '#c8962a', l: 'w', y: 'c' }, vazio: { o: '#c0c8d8', n: '#8a90a0', b: '#5a6070', l: 'w', y: 'w' }
};
function pbShade(hex, f) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
// desenha um quadro. pose: idle|open|shut|hurt|win ; f: 0..3
function pbFrame(form, pose, f) {
  const M = PB_MAP[form] || {}, C = k => PAL[M[k] || k] || M[k];
  const O = C('o'), N = C('n'), B = C('b'), Lm = C('l'), Y = C('y');
  const No = pbShade(N, 1.25), Nd = pbShade(N, 0.72), Oh = pbShade(O, 1.3), Od = pbShade(O, 0.75);
  const darkBody = ['abismo', 'eclipse', 'proibido'].includes(form);
  const MOUTH = form === 'abismo' ? '#140820' : form === 'eclipse' ? '#0a0612' : '#3a0a18', TONG = form === 'abismo' ? '#7a48b0' : form === 'carniceiro' ? '#c83838' : '#e86890';
  const TEETH = form === 'carniceiro' ? '#f6eccc' : '#f2ecdc';
  const c = mk(PB_W, PB_H), x = c.getContext('2d');
  const P = (px, py, col) => { if (px < 0 || py < 0 || px >= PB_W || py >= PB_H) return; x.fillStyle = col; x.fillRect(px, py, 1, 1); };
  const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px, py, w, h); };
  // pose -> ângulo da tampa, deslocamento e achatamento
  const s = Math.sin(f * Math.PI / 2);
  const A = pose === 'open' ? 0.6 + 0.03 * s : pose === 'shut' ? 0 : pose === 'hurt' ? 0.36 : pose === 'win' ? 0.48 + 0.1 * s : 0.27 + 0.04 * s;
  const lift = pose === 'win' ? Math.round(Math.abs(s) * 2) : pose === 'idle' ? (f % 2) : 0;
  const squash = pose === 'shut' ? 1 : 0;
  const L = 26, T = 6;                              // tampa: comprimento e espessura
  const by1 = PB_H - 1 - lift, by0 = 20 + squash - lift; // corpo: topo e base
  const bx0 = 2, bx1 = bx0 + L;                      // corpo: esquerda e direita
  const H = [bx0, by0];                              // dobradiça (atrás, em cima)
  const ca = Math.cos(A), sa = Math.sin(A);
  const toW = (u, v) => [H[0] + u * ca - v * sa, H[1] - (u * sa + v * ca)];
  const toL = (px, py) => { const dx = px + 0.5 - H[0], dy = H[1] - (py + 0.5); return [dx * ca + dy * sa, -dx * sa + dy * ca]; };
  const arch = u => { const e = Math.min(u, L - u); return e < 1.5 ? 2 : e < 3.5 ? 1 : 0; };
  // ---- sombra no chão
  for (let i = 0; i < L + 2; i++) P(bx0 - 1 + i, PB_H - 1, 'rgba(0,0,0,0.35)');
  // ---- boca (só quando aberta): cunha entre a borda do corpo e a tampa
  if (A > 0.05) {
    for (let py = 0; py < by0 + 1; py++) for (let px = bx0; px <= bx1; px++) {
      const dx = px + 0.5 - H[0], dy = H[1] - (py + 0.5); if (dy < 0) continue;
      const ang = Math.atan2(dy, dx), d = Math.hypot(dx, dy);
      if (ang <= A && d <= L - 0.5) P(px, py, d < 9 ? pbShade(MOUTH, 0.55) : MOUTH);
    }
  }
  // ---- corpo: contorno, tábuas, faixas de metal, rebites
  R(bx0 - 1, by0 - 1, L + 3, by1 - by0 + 2, '#120e1a');
  for (let py = by0; py < by1; py++) for (let px = bx0; px <= bx1; px++) {
    const yy = py - by0, xx = px - bx0;
    let col = (yy % 4 === 3) ? Nd : N;
    if (yy === 0) col = O; if (py === by1 - 1) col = Od;
    if (xx === 0 || xx === L) col = O;
    if (xx >= 5 && xx <= 6 || xx >= L - 6 && xx <= L - 5) col = (yy === 0 || py === by1 - 1) ? Lm : B;
    if (xx === 1 && yy > 0) col = Oh;
    P(px, py, col);
  }
  for (const rx of [5, L - 5]) for (const ry of [2, by1 - by0 - 3]) P(bx0 + rx, by0 + ry, Lm);
  // dentes da borda do corpo (pra cima)
  if (A > 0.05) for (let tx = bx0 + 3; tx < bx1 - 1; tx += 3) { P(tx, by0 - 1, TEETH); P(tx + 1, by0 - 1, TEETH); P(tx, by0 - 2, TEETH); }
  // fechadura na frente do corpo
  R(bx1 - 2, by0 + 1, 3, 4, '#120e1a'); R(bx1 - 1, by0 + 1, 2, 3, Y); P(bx1 - 1, by0 + 3, '#120e1a');
  if (A > 0.05) {
    // olhos brilhando no fundo da boca
    const ea = A * 0.5, blink = pose === 'idle' && f === 3;
    for (const dd of [12, 18]) {
      const ex = Math.round(H[0] + Math.cos(ea) * dd), ey = Math.round(H[1] - Math.sin(ea) * dd);
      const eyeC = form === 'abismo' || form === 'proibido' ? '#ff5050' : form === 'eclipse' ? '#c0a0f0' : form === 'estelar' || form === 'constelacao' ? '#ffffff' : '#ffe066';
      if (pose === 'hurt') { P(ex - 1, ey - 1, '#ff6b6b'); P(ex + 1, ey + 1, '#ff6b6b'); P(ex + 1, ey - 1, '#ff6b6b'); P(ex - 1, ey + 1, '#ff6b6b'); P(ex, ey, '#ff6b6b'); }
      else if (blink) R(ex - 1, ey, 3, 1, eyeC);
      else { R(ex - 1, ey - 1, 2, 2, eyeC); P(ex - 1, ey - 1, '#ffffff'); }
    }
    // língua
    if (pose === 'open' || pose === 'win') { const ty = by0 - 1; R(bx1 - 5, ty, 7, 2, TONG); R(bx1 + 1, ty + 1, 2, 4 + (f % 2), TONG); P(bx1 + 1, ty + 4 + (f % 2), pbShade(TONG, 0.7)); P(bx1 - 3, ty, pbShade(TONG, 1.3)); }
  }
  // ---- tampa (rasterização inversa: sem buracos em qualquer ângulo)
  const inLid = (u, v, m) => u >= -m && u <= L + m && v >= -m && v <= T - arch(Math.max(0, Math.min(L, u))) + m;
  const lidCol = (u, v) => {
    const vt = T - arch(u);
    if (v > vt - 1.1) return Oh;
    if (v < 1) return O;
    if (u < 1 || u > L - 1) return O;
    if (u >= 5 && u < 7 || u >= L - 7 && u < L - 5) return v > vt - 2 ? Lm : B;
    return (Math.floor(v) % 3 === 2) ? No : N;
  };
  const pts = [];
  for (let py = 0; py < PB_H; py++) for (let px = 0; px < PB_W; px++) { const [u, v] = toL(px, py); if (inLid(u, v, 1)) pts.push([px, py, u, v]); }
  for (const [px, py] of pts) P(px, py, '#120e1a');
  for (const [px, py, u, v] of pts) if (inLid(u, v, 0)) P(px, py, lidCol(u, v));
  // dentes da tampa (pra baixo, dentro da boca)
  if (A > 0.05) for (let u = 3; u < L - 1; u += 3) for (const [du, dv] of [[0, -0.6], [1, -0.6], [0.5, -1.6]]) { const [wx, wy] = toW(u + du, dv); P(Math.floor(wx), Math.floor(wy), TEETH); }
  // fecho dourado na ponta da tampa
  { const [wx, wy] = toW(L - 1.2, 1.2); R(Math.floor(wx) - 1, Math.floor(wy) - 1, 3, 3, '#120e1a'); P(Math.floor(wx), Math.floor(wy), Y); }
  // brilho do metal ao respirar
  if (pose === 'idle' && f === 1) { const [wx, wy] = toW(6, T - 1); P(Math.floor(wx), Math.floor(wy), '#ffffff'); }
  // ---- detalhes de cada forma
  const lidPt = (u, v) => toW(u, v).map(Math.floor);
  const tw = (i) => (f + i) % 4 === 0;
  switch (form) {
    case 'ferro': for (const u of [1, L - 1]) { const [wx, wy] = lidPt(u, T - 2); R(wx - 1, wy, 2, 2, Lm); } R(bx0, by1 - 2, L + 1, 1, Lm); break;
    case 'arcano': for (const [px, py] of [[9, 3], [13, 5], [17, 3], [21, 6]]) P(bx0 + px, by0 + py, tw(px) ? '#ffffff' : '#7ad0f0'); { const [wx, wy] = lidPt(13, 3); P(wx, wy, '#7ad0f0'); P(wx + 1, wy, '#7ad0f0'); } break;
    case 'fortaleza': for (const u of [2, 9, 16, 23]) { const [wx, wy] = lidPt(u, T - 1); P(wx, wy, Y); } R(bx0 + 9, by0 + 3, 9, 6, '#120e1a'); R(bx0 + 10, by0 + 4, 7, 4, Lm); P(bx0 + 13, by0 + 5, Y); P(bx0 + 13, by0 + 6, Y); break;
    case 'espinho': case 'ferrao': {
      const sc = form === 'ferrao' ? PAL.v : PAL.w;
      for (let u = 2; u < L; u += 4) { const [ax, ay] = lidPt(u, T - arch(u) + 0.5), [tx, ty] = lidPt(u + 0.5, T - arch(u) + 3); P(ax, ay, '#120e1a'); P(tx, ty, sc); const [mx, my] = lidPt(u + 0.25, T - arch(u) + 1.8); P(mx, my, sc); }
      for (const py of [by0 + 3, by0 + 8]) { P(bx0 - 2, py, sc); P(bx0 - 3, py, sc); }
      if (form === 'ferrao') { R(bx0 - 6, by0 - 2, 2, 7, PAL.G); R(bx0 - 7, by0 - 4, 2, 3, PAL.v); P(bx0 - 7, by0 - 5, '#ffffff'); for (const py of [by0 + 4, by0 + 9]) P(bx0 + 10, py, PAL.v); }
      break;
    }
    case 'carniceiro': for (const px of [8, 14, 20]) { R(bx0 + px, by0 + 4, 2, 3, '#e8dcc0'); P(bx0 + px, by0 + 7, '#c83838'); } if (A > 0.3) { P(bx1 - 3, by0 + 1, '#9be0ff'); P(bx1 - 3, by0 + 2 + (f % 2), '#9be0ff'); } break;
    case 'bastiao': R(bx0 + 9, by0 + 2, 10, 9, '#120e1a'); R(bx0 + 10, by0 + 3, 8, 6, Y); R(bx0 + 11, by0 + 9, 6, 1, Y); R(bx0 + 13, by0 + 4, 2, 4, '#ffffff'); { const [wx, wy] = lidPt(13, T + 0.5); R(wx - 1, wy - 1, 3, 2, Y); } break;
    case 'abismo': for (let i = 0; i < 3; i++) { const a = f * 0.8 + i * 2.1; P(bx0 + 13 + Math.round(Math.cos(a) * 4), by0 + 6 + Math.round(Math.sin(a) * 3), PAL.q); } P(bx0 + 13, by0 + 6, '#ff5050'); break;
    case 'grimorio': case 'biblioteca': {
      for (let u = 4; u < L - 3; u += 6) { const [wx, wy] = lidPt(u, T + 0.5); R(wx, wy - 1, 4, 2, '#e8dcc0'); P(wx + 1, wy - 1, '#c8b890'); }
      const [rx, ry] = lidPt(L - 3, 0); R(rx, ry, 1, 4 + (f % 2), form === 'grimorio' ? PAL.p : PAL.r);
      if (form === 'biblioteca') { const [hx, hy] = lidPt(9, T + 1); R(hx - 3, hy - 4, 6, 4, '#120e1a'); R(hx - 2, hy - 3, 4, 2, PAL.u); R(hx + 1, hy - 7, 5, 4, '#120e1a'); R(hx + 2, hy - 6, 3, 2, PAL.r); }
      for (const py of [by0 + 3, by0 + 6, by0 + 9]) R(bx0 + 9, py, 10, 1, form === 'grimorio' ? '#e8dcc0' : pbShade(N, 1.5));
      break;
    }
    case 'proibido': { R(bx0 + 2, by0 + 5, L - 3, 1, '#5a5070'); for (let px = bx0 + 2; px < bx1; px += 2) P(px, by0 + 6, '#8a8099'); R(bx0 + 11, by0 + 2, 6, 6, '#120e1a'); R(bx0 + 12, by0 + 3, 4, 4, '#e8dcc0'); R(bx0 + 13, by0 + 4, 2, 2, f === 3 ? '#e8dcc0' : '#c83838'); break; }
    case 'estelar': case 'constelacao': {
      const st = [[7, 3], [12, 8], [17, 4], [22, 9], [10, 10]];
      if (form === 'constelacao') for (let i = 0; i < st.length - 1; i++) { const [a1, b1] = st[i], [a2, b2] = st[i + 1]; for (let k = 1; k < 4; k++) P(bx0 + Math.round(a1 + (a2 - a1) * k / 4), by0 + Math.round(b1 + (b2 - b1) * k / 4), pbShade(N, 1.6)); }
      st.forEach(([px, py], i) => { P(bx0 + px, by0 + py, tw(i) ? '#ffffff' : PAL.y); if (tw(i)) { P(bx0 + px + 1, by0 + py, PAL.y); P(bx0 + px - 1, by0 + py, PAL.y); P(bx0 + px, by0 + py - 1, PAL.y); } });
      for (const u of [6, 15, 21]) { const [wx, wy] = lidPt(u, 3); P(wx, wy, tw(u) ? '#ffffff' : PAL.y); }
      break;
    }
    case 'arca': {
      const [rx, ry] = lidPt(L / 2, T + 0.5); R(rx - 6, ry - 2, 13, 2, '#120e1a'); R(rx - 5, ry - 2, 11, 1, '#f0c040'); R(rx - 1, ry - 4, 3, 2, '#f0c040');
      for (const [px, py] of [[8, 4], [12, 7], [16, 4], [20, 7]]) P(bx0 + px, by0 + py, tw(px) ? '#ffffff' : '#7ad0f0');
      R(bx0 + 10, by0 + 2, 8, 1, '#c8962a'); R(bx0 + 10, by0 + 9, 8, 1, '#c8962a');
      break;
    }
    case 'vazio': {
      x.clearRect(bx0 + 7, by0 + 3, L - 13, by1 - by0 - 6);
      R(bx0 + 7, by0 + 3, L - 13, 1, '#5a6070'); R(bx0 + 7, by1 - 4, L - 13, 1, '#5a6070');
      if (f === 2) { P(bx0 + 12, by0 + 6, '#ffffff'); }
      break;
    }
    case 'eclipse': { const cx = bx0 + 13, cy = by0 + 6; for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; P(cx + Math.round(Math.cos(t) * 4), cy + Math.round(Math.sin(t) * 4), PAL.L); } R(cx - 2, cy - 3, 5, 7, darkBody ? '#120e1a' : N); R(cx - 3, cy - 2, 2, 5, '#120e1a'); P(cx + 3, cy, '#ffffff'); break; }
  }
  return c;
}
const PBS = {};
function pbSprites(form) {
  if (!PB_MAP[form]) form = 'caixote';
  if (PBS[form]) return PBS[form];
  const S = {}; for (const p of ['idle', 'open', 'shut', 'hurt', 'win']) S[p] = [0, 1, 2, 3].map(f => pbFrame(form, p, f));
  return (PBS[form] = S);
}
function pbPose(p, t, extra) { BT.pp = Object.assign({ p, t }, extra || {}); }
// desenha o baú (e a Lume) na arena
function drawParty() {
  const S = pbSprites(G.species), pp = BT.pp || {};
  if (pp.t > 0) pp.t--;
  const m = BT.mode, won = BT.en.length && BT.en.every(e => !e.alive && !(e.dying > 0));
  let pose = 'idle', ox = 0, oy = 0, fr = Math.floor(FRAME / 14) % 4;
  if (BT.biteFx) { pose = 'open'; ox = Math.round(Math.sin(Math.min(1, BT.biteFx.t / 10) * Math.PI) * 18); }
  else if (pp.t > 0) { pose = pp.p; if (pose === 'hurt') ox = -Math.round(pp.t / 4) + (pp.t % 4 < 2 ? 1 : -1); if (pose === 'open') oy = -Math.round(Math.sin((1 - pp.t / 24) * Math.PI) * 3); }
  else if (G.hp <= 0) pose = 'shut';
  else if (won) { pose = 'win'; oy = -Math.round(Math.abs(Math.sin(FRAME * 0.15)) * 6); fr = Math.floor(FRAME / 8) % 4; }
  else if (m === 'mash') { pose = 'hurt'; ox = FRAME % 6 < 3 ? -1 : 1; }
  else if (m === 'guard' || m === 'dodge' || m === 'seq' || BT.stance > 0) pose = 'shut';
  const img = S[pose][fr], w = PB_W * PB_SC, h = PB_H * PB_SC;
  let dx = BPX - w / 2 + ox, dy = BPY - h + oy;
  if (G.hp > 0 && G.hp < G.st.mhp * 0.3 && pose === 'idle') { dy += FRAME % 40 < 20 ? 1 : 0; }
  // aura de feitiço
  if (pp.t > 0 && pp.glow) { bx.globalAlpha = 0.35 + 0.25 * Math.sin(FRAME * 0.5); bx.drawImage(silhouette(img, pp.glow), dx - 2, dy - 2, w + 4, h + 4); bx.globalAlpha = 1; }
  bx.globalAlpha = BT.dark > 0 ? 0.55 : 1;
  bx.drawImage(pose === 'hurt' && pp.t > 0 && pp.t % 4 < 2 ? silhouette(img, '#ffffff') : G.hp <= 0 ? silhouette(img, '#3a3448') : img, Math.round(dx), Math.round(dy), w, h);
  bx.globalAlpha = 1;
  if (BT.dark > 0) for (let i = 0; i < 3; i++) { bx.fillStyle = '#3a2a5a'; bx.fillRect(Math.round(dx + 6 + ((FRAME / 3 + i * 19) % (w - 12))), Math.round(dy + h - 4 - ((FRAME / 2 + i * 9) % 14)), 2, 2); }
  if (G.hp > 0 && G.hp < G.st.mhp * 0.3 && pose === 'idle' && FRAME % 50 < 30) { bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(dx + w - 10), Math.round(dy + 18 + (FRAME % 50) / 6), 2, 3); }
  // Lume: flutua atrás e acima do baú
  if (G.flags.lumeJoined) {
    const lx = BPX - 30, ly = BPY - 58 + Math.round(Math.sin(FRAME * 0.07) * 3);
    bx.globalAlpha = 0.18; bx.fillStyle = '#ffe066'; bx.beginPath(); bx.arc(lx + 8, ly + 8, 11 + Math.sin(FRAME * 0.1) * 1.5, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
    { const L = SP.lume, f = L[Math.floor(FRAME / 14) % L.length]; bx.drawImage(f, Math.round(lx + 8 - f.width / 2), Math.round(ly + 16 - f.height)); }
    if (BT.lumeT > 0) { BT.lumeT--; txt('♪', lx + 2 - (60 - BT.lumeT) / 8, ly - 6 - (60 - BT.lumeT) / 6, { col: '#ffe066', alpha: BT.lumeT / 60 }); }
  }
}

// ---- tamanhos reais: bichinhos pequenos, gente do tamanho de gente, chefes grandes ----
const EN_TINY = new Set(['rat', 'mush', 'bat', 'slime', 'lamp', 'crab', 'polvo', 'traca', 'ferrugem']);
function enemyScale(id, d) { if (d.bsc) return d.bsc; if (d.boss) return 1; return EN_TINY.has(id) ? 1 : 2; }
// formação em diagonal à direita (pés de cada inimigo)
function enemySlot(i, n) { return (n === 1 ? [[178, 116]] : n === 2 ? [[162, 90], [206, 122]] : [[196, 70], [150, 98], [206, 126]])[i]; }
// barra neon: fundo escuro da mesma cor, preenchimento vivo, brilho em cima e um leve halo
function neonBar(x, y, w, h, f, c) {
  f = Math.max(0, Math.min(1, f)); const fw = Math.round(w * f);
  bx.globalAlpha = 0.25; bx.fillStyle = c.fill; bx.fillRect(x - 1, y - 1, w + 2, h + 2); bx.globalAlpha = 1;
  bx.fillStyle = '#07050c'; bx.fillRect(x, y, w, h);
  bx.fillStyle = c.bg; bx.fillRect(x + 1, y + 1, w - 2, h - 2);
  if (fw > 0) { bx.fillStyle = c.fill; bx.fillRect(x + 1, y + 1, Math.max(0, fw - 2), h - 2); bx.fillStyle = c.hi; bx.fillRect(x + 1, y + 1, Math.max(0, fw - 2), 1); }
}
const NEON_PV = { bg: '#0c2e1a', fill: '#39ff7a', hi: '#c8ffd8' }, NEON_PM = { bg: '#0a1e3a', fill: '#2ad4ff', hi: '#c8f4ff' };
// faixa do grupo entre a arena e a caixa: retrato, nome, PV (verde neon) e PM (azul neon)
function drawPartyStrip() {
  const y = 134;
  bx.fillStyle = '#07050c'; bx.fillRect(0, y - 1, 240, 16); bx.fillStyle = '#3a3448'; bx.fillRect(0, y - 1, 240, 1); bx.fillRect(0, y + 14, 240, 1);
  const icon = pbSprites(G.species).idle[0];
  bx.drawImage(icon, 2, 6, 28, 22, 4, y + 1, 14, 11);
  let nm = G.name; while (nm.length > 1 && lineW(rich(nm), 1) > 48) nm = nm.slice(0, -1);
  txt(nm, 21, y + 1, { col: '#ffffff' });
  const low = G.hp / G.st.mhp < 0.3, blink = low && FRAME % 40 < 20;
  neonBar(72, y + 4, 34, 6, G.hp / G.st.mhp, blink ? { bg: '#3a0c18', fill: '#ff3a6a', hi: '#ffc8d8' } : NEON_PV);
  txt(`${G.hp}/${G.st.mhp}`, 109, y + 1, { col: blink ? '#ff6b8a' : '#7affa8' });
  neonBar(158, y + 4, 28, 6, G.mp / G.st.mmp, NEON_PM);
  txt(`${G.mp}/${G.st.mmp}`, 236, y + 1, { align: 'right', col: '#7ae4ff' });
}
