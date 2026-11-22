// ================= VIDA NA CIDADE (pedido do usuário: "gatos pelos telhados, pássaros que voam quando se passa perto,
// até coisas mágicas... só alguns detalhes, para dar mais vida à cidade") =================
// Tudo é enfeite: não bloqueia ninguém, não salva nada. Por mapa (VIDA_CFG):
//  - POMBOS (ou CORVOS em Candeia) ciscando no chão; quando o grupo chega perto (< 2,5 tiles), voam batendo asa e
//    somem; voltam depois em outro canto.
//  - GATOS andando, sentando e se lambendo nos telhados (de noite os olhos brilham).
//  - BORBOLETAS de dia perto das árvores; VAGA-LUMES DE ÂMBAR (magia) de noite ou em lugar escuro.
//  - CARTAS VOADORAS (magia de correio da cidade): um envelope dobrado em pássaro cruza o céu de vez em quando.
//  - PEIXES pulando na água, com respingo.
const VIDA_CFG = {
  praca: { pombos: 3, gatos: 2, borboletas: 3, vagalumes: 6, cartas: true, peixes: true },
  cais: { pombos: 2, gatos: 1, vagalumes: 4, peixes: true, gaivotas: true },
  rua1: { pombos: 2, borboletas: 2, vagalumes: 6, peixes: true, gaivotas: true },
  rua2: { pombos: 1, vagalumes: 5, peixes: true, passaros: true },
  auren: { pombos: 3, gatos: 2, borboletas: 2, vagalumes: 5, cartas: true },
  festival: { pombos: 2, gatos: 1, vagalumes: 4, cartas: true },
  largo: { pombos: 2, gatos: 1, borboletas: 3, vagalumes: 4, cartas: true },
  estrada: { borboletas: 4, vagalumes: 6, passaros: true },
  serra: { borboletas: 3, vagalumes: 5, passaros: true },
  candeia: { corvos: 2, gatos: 1, vagalumes: 3 }
};
const VIDA = { id: null };
const rnd = (a, b) => a + Math.random() * (b - a);
function chaoLivre(m, x, y) { if (x < 0 || y < 0 || x >= m.w || y >= m.h) return false; const T = tileOf(m, x, y); return !T.solid && !T.water && !propSolid(m, x, y) && !(m.ents || []).some(e => e.x === x && e.y === y && !e.passa); }
function pontoLivre(m, longeDe) {
  for (let k = 0; k < 60; k++) { const x = Math.floor(rnd(1, m.w - 1)), y = Math.floor(rnd(1, m.h - 1)); if (chaoLivre(m, x, y) && (!longeDe || Math.hypot(x - longeDe[0], y - longeDe[1]) > 6)) return [x, y]; }
  return null;
}
function vidaIniciar() {
  const m = W2.map, C = VIDA_CFG[W2.id]; VIDA.id = W2.id; VIDA.L = []; if (!C || !m) return;
  const grupo = (tipo) => { const p = pontoLivre(m, [W2.x, W2.y]); if (!p) return; const n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) VIDA.L.push({ k: 'pombo', tipo, x: p[0] * TS + rnd(-10, 22), y: p[1] * TS + rnd(4, 16), dir: Math.random() < 0.5 ? -1 : 1, st: 'cisca', t: Math.floor(rnd(0, 200)), g: p }); };
  for (let i = 0; i < (C.pombos || 0); i++) grupo('pombo');
  for (let i = 0; i < (C.corvos || 0); i++) grupo('corvo');
  // gatos: em cima das lajes das casas
  const tetos = (m.props || []).filter(pr => pr.img && (pr.casaO || pr.img.casaO)).map(pr => { const im = pr.img(); return { x0: pr.x * TS + 6, x1: pr.x * TS + im.width - 14, y: pr.y * TS - im.height + 14 }; }).filter(t => t.x1 > t.x0 + 10);
  // também em muretas ('#') com pelo menos 4 tiles seguidos: o gato fica onde dá para ver
  for (let y = 0; y < m.h; y++) { let x0 = -1; for (let x = 0; x <= m.w; x++) { const ehM = x < m.w && m.rows[y][x] === '#'; if (ehM && x0 < 0) x0 = x; if (!ehM && x0 >= 0) { if (x - x0 >= 4) tetos.push({ x0: x0 * TS + 4, x1: x * TS - 8, y: y * TS + 6, mureta: true }); x0 = -1; } } }
  for (const [x, y] of (C.gatosEm || [])) tetos.push({ x0: x * TS, x1: x * TS + 28, y: y * TS + 12, mureta: true });
  const ordem = tetos.slice().sort((a, b) => (b.mureta ? 1 : 0) - (a.mureta ? 1 : 0));
  for (let i = 0; i < Math.min(C.gatos || 0, ordem.length); i++) { const t = i === 0 ? ordem[0] : ordem[Math.floor(Math.random() * ordem.length)]; VIDA.L.push({ k: 'gato', teto: t, x: rnd(t.x0, t.x1), y: t.y + (t.mureta ? 0 : rnd(-3, 6)), dir: 1, st: 'anda', t: Math.floor(rnd(0, 300)), cor: Math.floor(Math.random() * 3) }); }
  for (let i = 0; i < (C.borboletas || 0); i++) { const p = pontoLivre(m); if (p) VIDA.L.push({ k: 'borb', x: p[0] * TS, y: p[1] * TS, a: rnd(0, 6), cor: ['#ffd060', '#ff8ab0', '#8ad8ff', '#ffffff'][i % 4] }); }
  for (let i = 0; i < (C.vagalumes || 0); i++) { const p = pontoLivre(m); if (p) VIDA.L.push({ k: 'luz', x: p[0] * TS, y: p[1] * TS, a: rnd(0, 6), r: rnd(0.6, 1.2) }); }
  VIDA.carta = C.cartas ? { prox: Math.floor(rnd(200, 700)) } : null;
  VIDA.peixe = C.peixes ? { prox: Math.floor(rnd(120, 400)), ag: m.water ? m.water.map(w => [w[0], w[1]]) : [] } : null;
  VIDA.passaro = (C.passaros || C.gaivotas) ? { prox: Math.floor(rnd(200, 600)), gaivota: !!C.gaivotas } : null;
}
// ---------- desenho dos bichinhos ----------
function pomboDraw(p, sx, sy) {
  const R = (c, a, b, w, h) => { bx.fillStyle = c; bx.fillRect(Math.round(sx + (p.dir < 0 ? -a - w : a)), Math.round(sy + b), w, h); };
  const corpo = p.tipo === 'corvo' ? ['#1a1a24', '#2a2a38', '#4a4a64'] : ['#6a6a7a', '#8a8a9c', '#b0b0c0'];
  if (p.st === 'voa') {
    const asa = (p.t >> 2) % 2;
    R(corpo[1], -3, -1, 6, 3); R(corpo[0], 2, -2, 2, 2); R('#e8c060', 4, -2, 1, 1);
    if (asa) { R(corpo[2], -2, -5, 2, 4); R(corpo[2], 0, -4, 2, 3); } else { R(corpo[2], -2, 2, 2, 3); R(corpo[2], 0, 2, 2, 2); }
    return;
  }
  bx.globalAlpha = 0.3; bx.fillStyle = '#000'; bx.fillRect(Math.round(sx - 3), Math.round(sy + 3), 7, 1); bx.globalAlpha = 1;
  const pica = p.st === 'cisca' && (p.t % 50) < 12;
  R(corpo[1], -3, -2, 6, 4); R(corpo[0], -4, -2, 2, 2); R(corpo[2], -2, -2, 3, 1);
  if (pica) { R(corpo[0], 2, 0, 2, 2); R('#e8c060', 4, 1, 1, 1); } else { R(corpo[0], 2, -4, 2, 3); R('#e8c060', 4, -3, 1, 1); if (p.tipo !== 'corvo') R('#4a9a7a', 2, -2, 1, 1); R('#000', 3, -4, 1, 1); }
  R('#c86a4a', -1, 2, 1, 1); R('#c86a4a', 1, 2, 1, 1);
}
const GATO_COR = [['#c8702a', '#e8a050', '#7a4018'], ['#2a2630', '#3e3a48', '#16141a'], ['#8a8a92', '#b8b8c0', '#5a5a64']];
function gatoDraw(g, sx, sy, noite) {
  const [m0, m1, m2] = GATO_COR[g.cor], d = g.dir, R = (c, a, b, w, h) => { bx.fillStyle = c; bx.fillRect(Math.round(sx + (d < 0 ? -a - w : a)), Math.round(sy + b), w, h); };
  bx.globalAlpha = 0.3; bx.fillStyle = '#000'; bx.fillRect(Math.round(sx - 6), Math.round(sy + 1), 12, 1); bx.globalAlpha = 1;
  const rabo = Math.sin(g.t * 0.08);
  if (g.st === 'senta' || g.st === 'lambe') {
    R(m0, -3, -7, 6, 7); R(m1, -2, -6, 3, 5); R(m0, -1, -11, 6, 5); R(m0, -1, -12, 1, 1); R(m0, 4, -12, 1, 1);
    R(m2, -5, -1 + Math.round(rabo), 3, 1); R(m2, -6, -2 + Math.round(rabo * 2), 1, 2);
    if (g.st === 'lambe' && (g.t >> 3) % 2) R('#e88a9a', 4, -8, 1, 1);
    R(noite ? '#ffe860' : '#2a3a2a', 1, -10, 1, 1); R(noite ? '#ffe860' : '#2a3a2a', 3, -10, 1, 1);
  } else {
    const p = (g.t >> 3) % 2;
    R(m0, -5, -5, 9, 4); R(m1, -4, -4, 6, 2); R(m0, 3, -8, 5, 5); R(m0, 3, -9, 1, 1); R(m0, 7, -9, 1, 1);
    R(m2, -5, -2, 1, 2 + p); R(m2, -2, -2, 1, 2 + (1 - p)); R(m2, 1, -2, 1, 2 + p); R(m2, 3, -2, 1, 2 + (1 - p));
    R(m2, -7, -7 + Math.round(rabo * 2), 2, 1); R(m2, -6, -6, 1, 2);
    R(noite ? '#ffe860' : '#2a3a2a', 6, -7, 1, 1);
  }
}
// ---------- atualizar e desenhar (no chão: pombos; no ar: o resto) ----------
function vidaPasso() {
  if (VIDA.id !== W2.id) vidaIniciar();
  const m = W2.map, px = W2.px + 8, py = W2.py + 8;
  for (const p of VIDA.L) {
    p.t++;
    if (p.k === 'pombo') {
      if (p.st === 'cisca') {
        if ((p.t % 90) === 0) p.dir = Math.random() < 0.5 ? -1 : 1;
        if ((p.t % 40) < 10) p.x += p.dir * 0.25;
        const perto = Math.hypot(p.x - px, p.y - py) < 40 || W2.fol.some(f => Math.hypot(p.x - f.px - 8, p.y - f.py - 8) < 30);
        if (perto) { p.st = 'voa'; p.vx = (p.x < px ? -1 : 1) * rnd(1.2, 2.2); p.vy = rnd(-2.2, -1.4); p.h = 0; p.t = Math.floor(rnd(0, 4)); if (!VIDA.som || FRAME - VIDA.som > 30) { VIDA.som = FRAME; if (typeof sfx === 'function') sfx('move'); } for (const q of VIDA.L) if (q.k === 'pombo' && q.g === p.g && q.st === 'cisca' && Math.random() < 0.9) { q.st = 'voa'; q.vx = p.vx * rnd(0.8, 1.2); q.vy = p.vy * rnd(0.8, 1.2); q.t = Math.floor(rnd(0, 4)); } }
      } else if (p.st === 'voa') {
        p.x += p.vx; p.y += p.vy; p.vy *= 0.995; p.dir = p.vx < 0 ? -1 : 1;
        if (p.y < W2.cam[1] - 40 || p.x < W2.cam[0] - 60 || p.x > W2.cam[0] + W + 60) { p.st = 'fora'; p.volta = Math.floor(rnd(500, 1100)); }
      } else if (p.st === 'fora' && --p.volta <= 0) { const g = pontoLivre(m, [W2.x, W2.y]); if (g) { p.g = g; p.x = g[0] * TS + rnd(-8, 20); p.y = g[1] * TS + rnd(4, 16); p.st = 'cisca'; } else p.volta = 200; }
    } else if (p.k === 'gato') {
      const T = p.teto;
      if (p.st === 'anda') { p.x += p.dir * 0.3; if (p.x < T.x0) { p.x = T.x0; p.dir = 1; } if (p.x > T.x1) { p.x = T.x1; p.dir = -1; } if (Math.random() < 0.004) { p.st = Math.random() < 0.5 ? 'senta' : 'lambe'; p.fim = p.t + Math.floor(rnd(200, 500)); } }
      else if (p.t > p.fim) { p.st = 'anda'; if (Math.random() < 0.5) p.dir *= -1; }
    } else if (p.k === 'borb') { p.a += 0.03; p.x += Math.cos(p.a * 0.7) * 0.5; p.y += Math.sin(p.a * 1.3) * 0.35; }
    else if (p.k === 'luz') { p.a += 0.02; p.x += Math.cos(p.a) * 0.2; p.y += Math.sin(p.a * 0.8) * 0.15; }
  }
  if (VIDA.carta && --VIDA.carta.prox <= 0 && !VIDA.carta.voo) { const dir = Math.random() < 0.5 ? 1 : -1; VIDA.carta.voo = { x: dir > 0 ? W2.cam[0] - 20 : W2.cam[0] + W + 20, y: W2.cam[1] + rnd(20, H * 0.45), dir, t: 0, rastro: [] }; }
  if (VIDA.carta && VIDA.carta.voo) { const v = VIDA.carta.voo; v.t++; v.x += v.dir * 1.1; v.y += Math.sin(v.t * 0.05) * 0.4; v.rastro.push([v.x, v.y, 30]); v.rastro = v.rastro.filter(r => --r[2] > 0); if (v.x < W2.cam[0] - 40 || v.x > W2.cam[0] + W + 40) { VIDA.carta.voo = null; VIDA.carta.prox = Math.floor(rnd(900, 2000)); } }
  if (VIDA.peixe && VIDA.peixe.ag.length && --VIDA.peixe.prox <= 0) { const vis = VIDA.peixe.ag.filter(([x, y]) => Math.abs(x * TS - W2.cam[0] - W / 2) < W / 2 - 10 && Math.abs(y * TS - W2.cam[1] - H / 2) < H / 2 - 10); const w = vis.length ? vis[Math.floor(Math.random() * vis.length)] : null; VIDA.peixe.pulo = w ? { x: w[0] * TS + 8, y: w[1] * TS + 10, t: 0, dir: Math.random() < 0.5 ? -1 : 1 } : null; VIDA.peixe.prox = Math.floor(rnd(150, 420)); }
  if (VIDA.passaro && --VIDA.passaro.prox <= 0 && !VIDA.passaro.bando) { const dir = Math.random() < 0.5 ? 1 : -1, n = VIDA.passaro.gaivota ? 2 : 3 + Math.floor(Math.random() * 3), y0 = W2.cam[1] + rnd(10, H * 0.35); VIDA.passaro.bando = Array.from({ length: n }, (_, i) => ({ x: (dir > 0 ? W2.cam[0] - 20 : W2.cam[0] + W + 20) - dir * i * 12, y: y0 + i * 5 * (i % 2 ? 1 : -1), dir, t: i * 3 })); }
  if (VIDA.passaro && VIDA.passaro.bando) { for (const b of VIDA.passaro.bando) { b.t++; b.x += b.dir * (VIDA.passaro.gaivota ? 0.9 : 1.4); b.y += Math.sin(b.t * 0.08) * 0.2; } if (VIDA.passaro.bando.every(b => b.x < W2.cam[0] - 60 || b.x > W2.cam[0] + W + 60)) { VIDA.passaro.bando = null; VIDA.passaro.prox = Math.floor(rnd(700, 1600)); } }
}
{ const _chV = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _chV ? _chV(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world') return r;
  if (!UI.stack.length) vidaPasso(); else if (VIDA.id !== W2.id) vidaIniciar();
  for (const p of VIDA.L || []) if (p.k === 'pombo' && p.st === 'cisca') pomboDraw(p, p.x - ox, p.y - oy);
  // peixe pulando
  const P = VIDA.peixe && VIDA.peixe.pulo;
  if (P) { P.t++; const k = P.t / 34, sx = P.x - ox + P.dir * (k * 14 - 7), sy = P.y - oy - Math.sin(k * Math.PI) * 10;
    if (k < 1) { bx.fillStyle = '#8ab0d0'; bx.fillRect(Math.round(sx - 2), Math.round(sy), 5, 2); bx.fillStyle = '#c8e0f0'; bx.fillRect(Math.round(sx - 1), Math.round(sy), 2, 1); bx.fillStyle = '#6a90b0'; bx.fillRect(Math.round(sx + (P.dir > 0 ? -3 : 3)), Math.round(sy - 1), 1, 3); }
    for (const kk of [0.05, 0.95]) if (Math.abs(k - kk) < 0.25) { const a = 1 - Math.abs(k - kk) * 4, cx = P.x - ox + P.dir * (kk * 14 - 7); bx.globalAlpha = a; bx.fillStyle = '#e8f4ff'; bx.fillRect(Math.round(cx - 4), Math.round(P.y - oy + 1), 2, 1); bx.fillRect(Math.round(cx + 3), Math.round(P.y - oy + 1), 2, 1); bx.fillRect(Math.round(cx - 1), Math.round(P.y - oy - 2), 1, 2); bx.globalAlpha = 1; }
    if (k > 1.3) VIDA.peixe.pulo = null; }
  return r;
}; }
{ const _arV = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arV ? _arV(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world' || VIDA.id !== W2.id) return r;
  const noite = ehNoite(), escuro = !!m.escuro;
  for (const p of VIDA.L || []) {
    const sx = p.x - ox, sy = p.y - oy; if (sx < -30 || sy < -30 || sx > W + 30 || sy > H + 30) continue;
    if (p.k === 'pombo' && p.st === 'voa') pomboDraw(p, sx, sy - (p.h || 0));
    else if (p.k === 'gato') gatoDraw(p, sx, sy, noite);
    else if (p.k === 'borb' && !noite) { const f = Math.floor(p.a * 20) % 2; bx.fillStyle = p.cor; bx.fillRect(Math.round(sx - (f ? 2 : 1)), Math.round(sy), f ? 2 : 1, 2); bx.fillRect(Math.round(sx + 1), Math.round(sy), f ? 2 : 1, 2); bx.fillStyle = '#2a2a2a'; bx.fillRect(Math.round(sx), Math.round(sy), 1, 2); }
    else if (p.k === 'luz' && (noite || escuro)) { const a = 0.5 + 0.5 * Math.sin(p.a * 6 + p.r * 10); const g = bx.createRadialGradient(sx, sy, 0, sx, sy, 7); g.addColorStop(0, `rgba(255,200,90,${0.45 * a})`); g.addColorStop(1, 'rgba(255,200,90,0)'); bx.fillStyle = g; bx.fillRect(sx - 7, sy - 7, 14, 14); bx.fillStyle = `rgba(255,236,170,${0.6 + 0.4 * a})`; bx.fillRect(Math.round(sx), Math.round(sy), 1, 1); }
  }
  // carta voadora: um envelope dobrado em passarinho, com rastro de faíscas
  const C = VIDA.carta && VIDA.carta.voo;
  if (C) { for (const [x, y, v] of C.rastro) if (v % 6 === 0) { bx.globalAlpha = v / 30; bx.fillStyle = '#ffe8a0'; bx.fillRect(Math.round(x - ox), Math.round(y - oy + 2), 1, 1); bx.globalAlpha = 1; }
    const sx = Math.round(C.x - ox), sy = Math.round(C.y - oy), asa = (C.t >> 3) % 2;
    bx.fillStyle = 'rgba(0,0,0,0.25)'; bx.fillRect(sx - 3, sy + 18, 7, 1);
    bx.fillStyle = '#f4ecd8'; bx.fillRect(sx - 3, sy, 7, 4); bx.fillStyle = '#d8ccb0'; bx.fillRect(sx - 3, sy + 3, 7, 1); bx.fillStyle = '#b83a3a'; bx.fillRect(sx, sy + 1, 1, 1);
    bx.fillStyle = '#ffffff'; if (asa) { bx.fillRect(sx - 2, sy - 3, 2, 3); bx.fillRect(sx + 1, sy - 3, 2, 3); } else { bx.fillRect(sx - 5, sy + 1, 2, 1); bx.fillRect(sx + 4, sy + 1, 2, 1); } }
  // bando passando no céu
  const B = VIDA.passaro && VIDA.passaro.bando;
  if (B) for (const b of B) { const sx = Math.round(b.x - ox), sy = Math.round(b.y - oy), asa = (b.t >> 3) % 2, c = VIDA.passaro.gaivota ? '#f0f0f4' : (noite ? '#2a2a3a' : '#3a3440');
    bx.fillStyle = c; bx.fillRect(sx, sy, 1, 1); if (asa) { bx.fillRect(sx - 2, sy - 1, 2, 1); bx.fillRect(sx + 1, sy - 1, 2, 1); bx.fillRect(sx - 3, sy - 2, 1, 1); bx.fillRect(sx + 3, sy - 2, 1, 1); } else { bx.fillRect(sx - 3, sy + 1, 3, 1); bx.fillRect(sx + 1, sy + 1, 3, 1); } }
  return r;
}; }
