// ================= EFEITOS v2: animações de golpe mais caprichadas =================
// Tudo aqui melhora as peças que TODOS os golpes usam (impacto, corte, projétil, investida, cura, morte),
// então cada ataque, técnica, runa, dupla e super ganha o visual novo sem precisar ser reescrito.
// - impacto com quadro branco, linhas de velocidade, onda de choque e lascas por elemento
// - "soco" de câmera (zoom curto) nos golpes fortes
// - rastro de imagens na investida, poeira na partida e na freada
// - corte em meia-lua com três camadas e brilho na ponta
// - projétil com núcleo brilhante (luz somada), cauda de cometa e faíscas girando
// - cura com colunas de luz e cruzinhas; inimigo derrotado se desfaz em pixels do próprio desenho

const ELC = {
  fogo: ['#ffe066', '#ffa94d', '#f07830', '#c83a18'],
  gelo: ['#ffffff', '#bff0ff', '#7ad0f0', '#3a8ac0'],
  luz: ['#ffffff', '#fff0a0', '#ffd060', '#ffb030'],
  corte: ['#ffffff', '#ffd8d0', '#e86050', '#a83030'],
  mordida: ['#ffffff', '#fff0c0', '#f0c040', '#a87a20'],
  agua: ['#ffffff', '#bfe8ff', '#5fb0e0', '#2a6090'],
  nada: ['#ffffff', '#e8e0f0', '#b8a8d0', '#6a5a80']
};
function luzSoma(fn) { const g = bx.globalCompositeOperation; bx.globalCompositeOperation = 'lighter'; try { fn(); } finally { bx.globalCompositeOperation = g; } }
function brilho(x, y, r, col, a = 1) { luzSoma(() => { const g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.globalAlpha = a; bx.fillStyle = g; bx.fillRect(x - r, y - r, r * 2, r * 2); bx.globalAlpha = 1; }); }
function camSoco(x, y, k = 0.05) { BT.zoom = { x, y, k: Math.max(k, (BT.zoom && BT.zoom.k) || 0) }; }
// lasca alongada que voa (desenhada como risco na direção do movimento)
function lasca(x, y, a, v, col, life = 16, len = 3) { part({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.05, life, col, sz: 1, fr: 0.9, risco: len }); }

// ---------- impacto: chamado em todo acerto num inimigo ----------
function impacto(x, y, o = {}) {
  const cs = ELC[o.el] || ELC.nada, forte = o.crit || o.broken || o.big, k = forte ? 1.4 : 1;
  // quadro de impacto: um disco branco que some em 3 quadros
  tw(forte ? 5 : 3, p => { brilho(x, y, (forte ? 26 : 16) * (1 - p * 0.3), 'rgba(255,255,255,0.95)', 1 - p); });
  // linhas de velocidade saindo do ponto
  const n = forte ? 12 : 7, ang0 = Math.random() * 6;
  tw(forte ? 12 : 9, p => {
    bx.globalAlpha = 1 - p; bx.strokeStyle = cs[0]; bx.lineWidth = 1;
    for (let i = 0; i < n; i++) { const a = ang0 + i / n * Math.PI * 2, r0 = 6 + p * 22 * k, r1 = r0 + (1 - p) * 10 * k; bx.beginPath(); bx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0 * 0.75); bx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1 * 0.75); bx.stroke(); }
    bx.globalAlpha = 1;
  });
  // onda de choque (elipse, como se fosse no chão do golpe)
  tw(forte ? 16 : 12, p => { const r = 4 + ease.out(p) * 26 * k; bx.globalAlpha = (1 - p) * 0.9; bx.strokeStyle = cs[1]; bx.lineWidth = forte ? 2 : 1; bx.beginPath(); bx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; });
  // lascas do elemento
  for (let i = 0; i < (forte ? 16 : 9); i++) lasca(x, y, Math.random() * Math.PI * 2, rand(1.2, 3.4) * k, pickOne(cs), rand(10, 20) | 0, forte ? 4 : 3);
  efeitoElemento(x, y, o.el, forte);
  if (forte) camSoco(x, y, o.broken ? 0.08 : 0.05);
}
// assinatura de cada elemento por cima do impacto
function efeitoElemento(x, y, el, forte) {
  if (el === 'fogo') { for (let i = 0; i < (forte ? 14 : 8); i++) part({ x: x + rand(-8, 8), y: y + rand(-4, 6), vx: rand(-0.3, 0.3), vy: rand(-1.4, -0.5), g: -0.01, life: rand(18, 34) | 0, col: pickOne(ELC.fogo), sz: Math.random() < 0.3 ? 2 : 1, brasa: true }); tw(14, p => brilho(x, y, 22, 'rgba(255,140,40,0.7)', 1 - p)); }
  else if (el === 'gelo') { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; tw(16, p => { const r = 4 + ease.out(p) * 12, xx = x + Math.cos(a) * r, yy = y + Math.sin(a) * r * 0.8; bx.globalAlpha = 1 - p; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(xx), Math.round(yy) - 2, 1, 5); bx.fillRect(Math.round(xx) - 2, Math.round(yy), 5, 1); bx.fillStyle = '#7ad0f0'; bx.fillRect(Math.round(xx) - 1, Math.round(yy) - 1, 3, 3); bx.globalAlpha = 1; }); } tw(20, p => brilho(x, y, 20, 'rgba(150,220,255,0.6)', 1 - p)); }
  else if (el === 'luz') { tw(16, p => luzSoma(() => { bx.globalAlpha = (1 - p) * 0.8; bx.fillStyle = '#fff0a0'; const w = 8 * (1 - p) + 2; bx.fillRect(Math.round(x - w / 2), -40, Math.round(w), y + 50); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x - 1), -40, 2, y + 50); bx.globalAlpha = 1; })); for (let i = 0; i < 4; i++) { const dx = rand(-14, 14), dy = rand(-14, 10); tw(18, p => { const s = Math.sin(p * Math.PI) * 3; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x + dx), Math.round(y + dy - s), 1, Math.round(s * 2 + 1)); bx.fillRect(Math.round(x + dx - s), Math.round(y + dy), Math.round(s * 2 + 1), 1); }); } }
  else if (el === 'mordida') { tw(10, p => { const g = 12 * (1 - ease.in(p)) + 1; bx.fillStyle = '#ffffff'; for (let i = -3; i <= 3; i++) { const tx = x + i * 5; bx.beginPath(); bx.moveTo(tx - 2, y - g - 6); bx.lineTo(tx + 2, y - g - 6); bx.lineTo(tx, y - g); bx.fill(); bx.beginPath(); bx.moveTo(tx - 2, y + g + 6); bx.lineTo(tx + 2, y + g + 6); bx.lineTo(tx, y + g); bx.fill(); } }); }
  else if (el === 'corte') { const a = rand(-0.5, 0.5); tw(8, p => { bx.globalAlpha = 1 - p; bx.strokeStyle = '#ffffff'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(x - Math.cos(a) * 28, y - Math.sin(a) * 28); bx.lineTo(x + Math.cos(a) * 28, y + Math.sin(a) * 28); bx.stroke(); bx.globalAlpha = 1; }); }
}

// ---------- corte em meia-lua (três camadas + brilho na ponta) ----------
slashFx = function (x, y, col, dir = 1, big) {
  const R = big ? 24 : 16, a0 = -1.25 * dir - 0.5, a1 = -1.25 * dir + 1.7;
  tw(big ? 14 : 11, p => {
    const q = ease.out(p), sweep = a0 + (a1 - a0) * Math.min(1, q * 1.4), fade = 1 - p;
    for (const [rr, w, c, al] of [[R + 3, big ? 4 : 3, col, 0.35], [R, big ? 3 : 2, col, 0.85], [R - 1, 1, '#ffffff', 1]]) {
      bx.globalAlpha = fade * al; bx.strokeStyle = c; bx.lineWidth = w; bx.beginPath(); bx.arc(x, y, rr * (0.85 + q * 0.15), Math.min(a0, sweep), Math.max(a0, sweep)); bx.stroke();
    }
    bx.globalAlpha = 1;
    const tx = x + Math.cos(sweep) * R, ty = y + Math.sin(sweep) * R;
    brilho(tx, ty, big ? 10 : 7, 'rgba(255,255,255,0.9)', fade);
  });
};

// ---------- projétil: núcleo somado, cauda de cometa e faíscas ----------
projectile = async function (from, to, col, n = 18, o = {}) {
  const [x0, y0] = unitCenter(from), [x1, y1] = unitCenter(to), r = o.r || 3, cauda = [];
  // carga na mão de quem lança
  await tw(6, p => { brilho(x0, y0 - 4, 4 + p * 8, col, p); fxRing(x0, y0 - 4, 10 - p * 8, '#ffffff', p); });
  await tw(n, (p, k) => {
    const q = ease.in(p) * 0.4 + p * 0.6, x = x0 + (x1 - x0) * q, y = y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * (o.arc || 10);
    cauda.push([x, y]); if (cauda.length > 7) cauda.shift();
    cauda.forEach(([cx, cy], i) => { const a = (i + 1) / cauda.length; bx.globalAlpha = a * 0.6; fxDisc(cx, cy, r * a, col); });
    bx.globalAlpha = 1;
    brilho(x, y, r * 4, col, 0.9); fxDisc(x, y, r, col); fxDisc(x, y, r * 0.55, '#ffffff');
    for (let i = 0; i < 2; i++) { const a = k * 0.5 + i * Math.PI; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x + Math.cos(a) * (r + 3)), Math.round(y + Math.sin(a) * (r + 3)), 1, 1); }
    if (BT.t % 2 === 0) part({ x, y, vx: rand(-0.4, 0.4), vy: rand(-0.6, 0.2), life: 14, col: pickOne(o.trail || [col, '#ffffff']) });
  });
};

// ---------- investida com rastro e poeira ----------
function poeira(x, y, dir = 1, n = 6) { for (let i = 0; i < n; i++) part({ x: x + rand(-4, 4), y: y - 1, vx: -dir * rand(0.3, 1.4), vy: rand(-0.8, -0.2), g: 0.03, life: rand(14, 24) | 0, col: pickOne(['#a89a88', '#8a7a6a', '#c8bca8']), sz: Math.random() < 0.4 ? 2 : 1 }); }
dash = async function (u, tx, ty, n = 14) {
  const dx = tx - u.x, dy = ty - u.y, dir = Math.sign(dx) || 1;
  u.anim = 'run';
  // antecipação: agacha um pouquinho antes de sair
  await tw(5, p => { u.sx = 1 + p * 0.12; u.sy = 1 - p * 0.12; });
  poeira(u.x + u.ox, u.y + u.oy, dir, 8); sfx('step');
  u.ghosts = [];
  await tw(n, p => {
    const q = ease.io(p); u.ox = dx * q; u.oy = dy * q - Math.sin(q * Math.PI) * 6; u.sx = 1 - Math.sin(p * Math.PI) * 0.05; u.sy = 1 + Math.sin(p * Math.PI) * 0.05;
    if (BT.t % 2 === 0) { const fr = unitFrame(u); if (fr) u.ghosts.push({ x: u.x + u.ox, y: u.y + u.oy, fr, a: 0.5 }); }
  });
  u.sx = 1; u.sy = 1; poeira(u.x + u.ox, u.y + u.oy, -dir, 5);
};
dashBack = async function (u, n = 12) {
  const ox = u.ox, oy = u.oy; u.anim = 'run'; u.face = -1; u.ghosts = u.ghosts || [];
  await tw(n, p => { const q = ease.out(p); u.ox = ox * (1 - q); u.oy = oy * (1 - q) - Math.sin(q * Math.PI) * 4; if (BT.t % 3 === 0) { const fr = unitFrame(u); if (fr) u.ghosts.push({ x: u.x + u.ox, y: u.y + u.oy, fr, a: 0.3 }); } });
  u.ox = 0; u.oy = 0; u.anim = 'idle'; u.face = 1; poeira(u.x, u.y, 1, 4);
};
// rastro: desenhado atrás do lutador (chamado pelo drawUnit)
function desenhaRastro(u) {
  if (!u.ghosts || !u.ghosts.length) return;
  for (const g of u.ghosts) {
    g.a -= 0.05; if (g.a <= 0) continue;
    const w = g.fr.width, h = g.fr.height, c = tingeRastro(g.fr, u.col || '#8fe3ff');
    bx.globalAlpha = g.a; bx.drawImage(c, Math.round(g.x - w / 2), Math.round(g.y - h)); bx.globalAlpha = 1;
  }
  u.ghosts = u.ghosts.filter(g => g.a > 0);
}
const RASTRO_C = new Map();
function tingeRastro(fr, col) { const k = fr; let m = RASTRO_C.get(k); if (m && m.col === col) return m.c; const c = mk(fr.width, fr.height), x = c.getContext('2d'); x.drawImage(fr, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); RASTRO_C.set(k, { c, col }); if (RASTRO_C.size > 300) RASTRO_C.clear(); return c; }

// ---------- todo acerto num inimigo ganha o impacto do elemento ----------
{ const _hf = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  const vivo = t.hp > 0, wk = o.el && t.weak && t.weak.includes(o.el), br = t.broken > 0, sh = t.shield;
  const d = _hf(a, t, pow, o);
  if (vivo && d > 1) { const [x, y] = unitCenter(t); impacto(x, y, { el: o.el, crit: o.crit, broken: br || (sh > 0 && t.broken > 0), big: wk && d > t.mhp * 0.12 }); }
  return d;
}; }
// golpe recebido pelo grupo: impacto menor, vermelho (ou verde no perfeito)
{ const _hm = hurtMember; hurtMember = function (m, d0, o = {}) {
  const vivo = m.hp > 0, d = _hm(m, d0, o);
  if (vivo && d > 0) { const [x, y] = unitCenter(m), perf = o.res === 'perfeito';
    tw(3, p => brilho(x, y, 14, perf ? 'rgba(155,229,138,0.9)' : 'rgba(255,120,120,0.9)', 1 - p));
    for (let i = 0; i < (perf ? 6 : 8); i++) lasca(x, y, Math.PI + rand(-1, 1), rand(1, 2.6), perf ? pickOne(['#9be58a', '#ffffff']) : pickOne(['#ff6b6b', '#ffffff', '#ffb0b0']), 14, 3);
    if (d > m.mhp * 0.2) camSoco(x, y, 0.04);
  }
  return d;
}; }
// cura: colunas de luz subindo, cruzinhas e um anel no chão
{ const _hu = healUnit; healUnit = function (t, n) {
  _hu(t, n);
  const [x, y] = unitCenter(t), fy = t.y;
  tw(28, p => {
    bx.globalAlpha = (1 - p) * 0.8; bx.strokeStyle = '#9be58a'; bx.beginPath(); bx.ellipse(x, fy, 10 + p * 8, 3 + p * 2, 0, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1;
    luzSoma(() => { for (let i = 0; i < 3; i++) { const cx = x - 8 + i * 8, h = 30 * Math.sin(Math.min(1, p * 1.5) * Math.PI); bx.globalAlpha = (1 - p) * 0.35; bx.fillStyle = '#9be58a'; bx.fillRect(Math.round(cx - 1), Math.round(fy - h), 3, Math.round(h)); } bx.globalAlpha = 1; });
  });
  for (let i = 0; i < 5; i++) { const dx = rand(-12, 12), d0 = rand(0, 10); tw(30, p => { const yy = y + 8 - p * 30 - d0; bx.globalAlpha = 1 - p; bx.fillStyle = i % 2 ? '#ffffff' : '#9be58a'; bx.fillRect(Math.round(x + dx), Math.round(yy) - 2, 1, 5); bx.fillRect(Math.round(x + dx) - 2, Math.round(yy), 5, 1); bx.globalAlpha = 1; }); }
}; }
// derrota de inimigo: pisca branco e se desfaz nos pixels do próprio desenho, que sobem
{ const _kf = killFoe; killFoe = function (t) {
  const fr = unitFrame(t);
  if (fr && !t.gone) {
    try {
      const d = fr.getContext('2d').getImageData(0, 0, fr.width, fr.height).data, X0 = t.x + (t.ox || 0) - fr.width / 2, Y0 = t.y + (t.oy || 0) - fr.height;
      const passo = fr.width * fr.height > 4000 ? 3 : 2;
      for (let yy = 0; yy < fr.height; yy += passo) for (let xx = 0; xx < fr.width; xx += passo) {
        const i = (yy * fr.width + xx) * 4; if (d[i + 3] < 128) continue;
        const col = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`;
        part({ x: X0 + xx, y: Y0 + yy, vx: rand(-0.5, 0.5) + (xx - fr.width / 2) * 0.01, vy: rand(-1.2, -0.2) - (fr.height - yy) * 0.004, g: -0.01, life: (rand(22, 46) + (fr.height - yy) * 0.2) | 0, col, sz: passo === 3 ? 2 : 1, fr: 0.97 });
      }
      t.alpha = 0;
    } catch (_) { }
    const [x, y] = unitCenter(t); tw(6, p => brilho(x, y, 40, 'rgba(255,255,255,0.9)', 1 - p)); camSoco(x, y, t.boss ? 0.09 : 0.05);
  }
  _kf(t); t.sumiu = !!fr;
}; }
