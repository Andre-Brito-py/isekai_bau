// ================= ANIMAÇÃO DOS PERSONAGENS EM BATALHA (v2) =================
// Os sprites de lado da Rita e da Lume viram "bonecos articulados": o corpo inclina, agacha e dá passada
// (deformando as linhas do próprio pixel art), e por cima vão a LANÇA da Rita e o BRAÇO da Lume, que giram.
// Cada golpe tem coreografia própria: preparo, investida, golpe, acompanhamento e volta.
// O baú anda aos pulinhos, abre a tampa no ar e fecha com tudo.

// ---------- o boneco ----------
// pontos em coordenadas do sprite JÁ virado para a direita (para os inimigos)
const RIG = {
  rita: { w: 17, h: 53, hip: 32, hand: [10, 28], shoulder: [9, 21], head: [9, 9], jaOlhaDireita: true },
  lume: { w: 17, h: 48, hip: 36, hand: [13, 25], shoulder: [11, 18], head: [10, 12], vela: [9, 4] }
};
const RPX = 12, RPY = 12;
const RIG_C = new Map();
function rigCanvas(base, P, R, key) {
  const k = key + '|' + [P.lean, P.crouch, P.stride, P.head].map(v => Math.round((v || 0) * 4)).join(',');
  if (RIG_C.has(k)) return RIG_C.get(k);
  const w = base.width, h = base.height, out = mk(w + RPX * 2, h + RPY), x = out.getContext('2d');
  const hip = R.hip, legH = h - hip, legH2 = Math.max(4, Math.round(legH * (1 - (P.crouch || 0)))), down = legH - legH2;
  for (let y = 0; y < hip; y++) { const dx = Math.round((P.lean || 0) * (hip - y) / hip + (y < R.head[1] + 7 ? (P.head || 0) : 0)); x.drawImage(base, 0, y, w, 1, RPX + dx, RPY + y + down, w, 1); }
  for (let j = 0; j < legH2; j++) { const sy = hip + Math.floor(j / legH2 * legH), t = j / legH2; x.drawImage(base, 0, sy, w, 1, RPX + Math.round((P.stride || 0) * t), RPY + hip + down + j, w, 1); }
  if (RIG_C.size > 600) RIG_C.clear();
  RIG_C.set(k, out); return out;
}
// ponto do sprite -> ponto na tela (seguindo inclinação, agachamento e escala do desenho)
function rigPt(u, px, py) {
  const R = u.R, P = u.P, hip = R.hip, legH = R.h - hip, c = P.crouch || 0, legH2 = Math.max(4, Math.round(legH * (1 - c))), down = legH - legH2;
  const lx = RPX + px + (py < hip ? (P.lean || 0) * (hip - py) / hip : (P.stride || 0) * (py - hip) / legH);
  const ly = RPY + (py < hip ? py + down : hip + down + (py - hip) * legH2 / legH);
  return [u._X + lx * u._sx, u._Y + ly * u._sy];
}
function poseBase(u) { return { lean: 0, crouch: 0, stride: 0, head: 0, wAng: u.id === 'rita' ? -1.35 : 0, wPull: 0, arm: null, glow: 0 }; }
// quadro do boneco: parado respira; correndo dá passada; o resto vem da pose atual (u.P)
function rigFrame(k) {
  return u => {
    const R = RIG[k], src = k === 'rita' ? IMG.spf.rita : IMG.spf.lumeh; if (!src || !src.s) return null;
    u.R = R; if (!u.P) u.P = poseBase(u);
    const P = Object.assign({}, u.P);
    if (u.anim === 'run') { const ph = Math.sin(BT.t * 0.55); P.stride += ph * 3; P.lean += 2; if (!u.P.semBob) u.oyRun = -Math.abs(ph) * 2; }
    else if (!u.P.parado && u.hp > 0) P.crouch += (Math.sin(BT.t / 22 + R.h) > 0.55 ? 0.03 : 0);
    if (u.hp <= 0) { P.crouch = 0.35; P.lean = -3; }
    let base = src.s[Math.floor(BT.t / 26) % src.s.length], key = k + 's' + (Math.floor(BT.t / 26) % src.s.length);
    if (k === 'lume' && u.anim === 'run' && src.walk) { const i = Math.floor(BT.t / 6) % src.walk.length; base = src.walk[i]; key = 'lw' + i; P.stride = 0; }
    return rigCanvas(R.jaOlhaDireita ? base : flipC(base), P, R, key);
  };
}
// tween de pose: muda os números de u.P até o alvo
function pose(u, alvo, n, ez = ease.io) {
  if (!u.P) u.P = poseBase(u);
  const de = {}; for (const k in alvo) de[k] = u.P[k] ?? (k === 'arm' ? 1.3 : 0);
  return tw(n, p => { const q = ez(p); for (const k in alvo) { const a = alvo[k]; u.P[k] = (a === null || typeof a !== 'number') ? a : de[k] + (a - de[k]) * q; } });
}
function resetPose(u, n = 8) { if (!u.P) u.P = poseBase(u); const b = poseBase(u); delete b.arm; if (u.P.arm != null) b.arm = 1.3; return pose(u, b, n).then(() => { u.P.arm = null; }); }

// ---------- arma e braço (desenhados por cima do corpo) ----------
const LANCA = (() => { const c = mk(36, 5), x = c.getContext('2d');
  x.fillStyle = '#2a1a10'; x.fillRect(0, 1, 28, 3); x.fillStyle = '#8a5a2a'; x.fillRect(0, 2, 28, 1); x.fillStyle = '#b07a3a'; x.fillRect(2, 2, 10, 1);
  x.fillStyle = '#c83a3a'; x.fillRect(26, 0, 2, 5); x.fillStyle = '#6a6a7a'; x.fillRect(28, 1, 2, 3);
  x.fillStyle = '#2a2a34'; x.fillRect(30, 0, 1, 5); x.fillRect(31, 1, 3, 3); x.fillRect(34, 2, 2, 1);
  x.fillStyle = '#e8e8f0'; x.fillRect(30, 1, 1, 3); x.fillRect(31, 2, 4, 1); x.fillStyle = '#a8a8c0'; x.fillRect(31, 3, 3, 1);
  return c; })();
const LANCA_GRIP = 12;   // a mão segura a 12 px do cabo
function desenhaLanca(u) {
  const P = u.P, [hx, hy] = rigPt(u, ...u.R.hand);
  bx.save(); bx.translate(Math.round(hx), Math.round(hy)); bx.rotate(P.wAng); bx.imageSmoothingEnabled = false;
  bx.drawImage(LANCA, Math.round(-LANCA_GRIP + (P.wPull || 0)), -2);
  if (P.glow > 0) luzSoma(() => { const tx = 34 - LANCA_GRIP + (P.wPull || 0); const g = bx.createRadialGradient(tx, 0, 0, tx, 0, 10 * P.glow); g.addColorStop(0, P.glowCol || 'rgba(255,240,160,0.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(tx - 12, -12, 24, 24); });
  bx.restore();
  // mão por cima do cabo
  bx.fillStyle = '#d8a078'; bx.fillRect(Math.round(hx) - 1, Math.round(hy) - 1, 2, 2);
}
function pontaLanca(u) { const P = u.P, [hx, hy] = rigPt(u, ...u.R.hand), d = 34 - LANCA_GRIP + (P.wPull || 0); return [hx + Math.cos(P.wAng) * d, hy + Math.sin(P.wAng) * d]; }
function desenhaBraco(u) {
  const P = u.P; if (P.arm == null && !(P.glow > 0)) return;
  const [sx, sy] = rigPt(u, ...u.R.shoulder);
  if (P.arm != null) {
    const L = 10, ex = sx + Math.cos(P.arm) * L, ey = sy + Math.sin(P.arm) * L;
    bx.strokeStyle = '#2a1a1a'; bx.lineWidth = 3; bx.beginPath(); bx.moveTo(Math.round(sx), Math.round(sy)); bx.lineTo(Math.round(ex), Math.round(ey)); bx.stroke();
    bx.strokeStyle = '#f2ecdc'; bx.lineWidth = 1.6; bx.beginPath(); bx.moveTo(Math.round(sx), Math.round(sy)); bx.lineTo(Math.round(ex), Math.round(ey)); bx.stroke();
    bx.fillStyle = '#f0c8a0'; bx.fillRect(Math.round(ex) - 1, Math.round(ey) - 1, 3, 3);
    u._mao = [ex, ey];
  } else u._mao = rigPt(u, ...u.R.hand);
  if (P.glow > 0) { const [mx, my] = u._mao; brilho(mx, my, 6 + 8 * P.glow, P.glowCol || 'rgba(255,224,128,0.95)', Math.min(1, P.glow)); bx.fillStyle = '#ffffff'; if (BT.t % 4 < 2) bx.fillRect(Math.round(mx), Math.round(my), 1, 1); }
}
function maoLume(u) { if (u._mao) return u._mao; return u._X != null ? rigPt(u, ...u.R.hand) : unitCenter(u); }
function velaLume(u) { return u._X != null ? rigPt(u, ...u.R.vela) : unitCenter(u); }
// círculo de runa no chão (baú lançando runas; Lume cantando)
function circuloRuna(x, y, r, col, p, a = 1) {
  bx.globalAlpha = a; bx.strokeStyle = col; bx.lineWidth = 1;
  bx.beginPath(); bx.ellipse(x, y, r, r * 0.32, 0, 0, Math.PI * 2); bx.stroke();
  bx.beginPath(); bx.ellipse(x, y, r * 0.7, r * 0.22, 0, 0, Math.PI * 2); bx.stroke();
  for (let i = 0; i < 8; i++) { const ang = i / 8 * Math.PI * 2 + p * 3; bx.fillStyle = col; bx.fillRect(Math.round(x + Math.cos(ang) * r * 0.85), Math.round(y + Math.sin(ang) * r * 0.27), 2, 1); }
  bx.globalAlpha = 1;
}

// ---------- ajudantes de movimento ----------
async function pulo(u, dx, dy, alt, n, o = {}) {
  const x0 = u.ox, y0 = u.oy;
  if (o.antes !== false) { await tw(4, p => { u.sx = 1 + p * 0.18; u.sy = 1 - p * 0.18; }); }
  sfx(o.som || 'step'); if (o.poeira !== false) poeira(u.x + u.ox, u.y + u.oy, Math.sign(dx) || 1, 5);
  await tw(n, p => {
    const q = o.ez ? o.ez(p) : p; u.ox = x0 + dx * q; u.oy = y0 + dy * q - Math.sin(p * Math.PI) * alt;
    u.sx = 1 - Math.sin(p * Math.PI) * 0.12; u.sy = 1 + Math.sin(p * Math.PI) * 0.14;
    if (o.giro) u.rot = o.giro * ease.io(p);
    if (o.rastro && BT.t % 2 === 0) { const fr = unitFrame(u); if (fr) (u.ghosts = u.ghosts || []).push({ x: u.x + u.ox, y: u.y + u.oy, fr, a: 0.45 }); }
    if (o.cada) o.cada(p);
  });
  u.rot = 0;
  if (o.pouso !== false) { poeira(u.x + u.ox, u.y + u.oy, 1, 4); await tw(5, p => { const s = Math.sin(p * Math.PI); u.sx = 1 + s * 0.2; u.sy = 1 - s * 0.2; }); }
  u.sx = 1; u.sy = 1;
}
function linhasVel(y0, y1, dir = 1, n = 10) { for (let i = 0; i < n; i++) { const yy = rand(y0, y1), len = rand(14, 40), x0 = rand(-20, 240); tw(rand(6, 12) | 0, p => { bx.globalAlpha = 0.6 * (1 - p); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x0 + dir * p * 60), Math.round(yy), Math.round(len), 1); bx.globalAlpha = 1; }); } }
function alvoX(t, folga) { const [tx] = unitCenter(t); return tx - (unitFrame(t) ? unitFrame(t).width / 2 : 10) - folga; }

// ================= RITA =================
async function ritaCorre(m, t, folga = 16) {
  await pose(m, { lean: 3, crouch: 0.08, wAng: -0.35 }, 5);
  m.anim = 'run'; m.ghosts = [];
  const dx = alvoX(t, folga) - m.x, dy = (t.fly ? 0 : t.y - m.y);
  sfx('step'); poeira(m.x, m.y, 1, 6);
  await tw(13, p => { const q = ease.io(p); m.ox = dx * q; m.oy = dy * q + (m.oyRun || 0); if (BT.t % 2 === 0) { const fr = unitFrame(m); if (fr) m.ghosts.push({ x: m.x + m.ox, y: m.y + m.oy, fr, a: 0.35 }); } });
  m.anim = 'idle'; m.oy = dy;
  // freada: corpo vai para trás, poeira
  poeira(m.x + m.ox, m.y + m.oy, -1, 7); sfx('step');
  await pose(m, { lean: -2, crouch: 0.14, stride: 3 }, 4, ease.out);
}
async function ritaVolta(m) {
  // salto para trás com giro completo, e pouso de volta no lugar
  await pose(m, { lean: -1, crouch: 0.2, stride: 0, wAng: -1.35, wPull: 0 }, 4);
  await pulo(m, -m.ox, -m.oy, 26, 18, { giro: -Math.PI * 2, rastro: true, ez: ease.io });
  m.ox = 0; m.oy = 0;
  await resetPose(m, 6);
}
ritaAtk = async function (m, t) {
  await ritaCorre(m, t, 16);
  // 1º golpe: puxa a lança para trás e ESTOCA
  await pose(m, { lean: -3, crouch: 0.18, wAng: 0.05, wPull: -10, stride: 2 }, 6);
  for (let i = 0; i < 2; i++) {
    const ok = await timedPrompt(t, i ? 14 : 20);
    if (ok) BT.stats.crit++;
    const [x, y] = unitCenter(t);
    if (i === 0) {
      sfx('hit'); linhasVel(y - 14, y + 6, 1, 6);
      await pose(m, { lean: 6, crouch: 0.04, wPull: 8, stride: 5, wAng: 0 }, 3, ease.out);
      hitstop(ok ? 6 : 3); bshake(ok ? 6 : 3);
      burst(x, y, 8, ['#ffffff', '#e86050']); hitFoe(m, t, 0.62, { el: 'corte', crit: ok });
      await tw(4, () => { });
      // recolhe e prepara o corte de baixo para cima
      await pose(m, { lean: 0, crouch: 0.22, wPull: 0, wAng: 0.9, stride: 2 }, 5);
    } else {
      sfx('hit');
      const a0 = m.P.wAng;
      await tw(6, p => { m.P.wAng = a0 + (-1.9 - a0) * ease.out(p); m.P.lean = 4 * p; m.P.crouch = 0.22 * (1 - p); m.oy = (m.oy || 0); });
      slashFx(x, y, ok ? '#ffe066' : '#ffffff', -1, ok);
      hitstop(ok ? 6 : 3); bshake(ok ? 6 : 3);
      burst(x, y, 8, ['#ffffff', '#e86050']); hitFoe(m, t, 0.62, { el: 'corte', crit: ok });
      await tw(5, () => { });
    }
    if (t.hp <= 0) break;
  }
  await ritaVolta(m);
};
TECH2.estocada.run = async (m, t) => {
  // carrega: agacha, lança para trás, a ponta brilha
  await pose(m, { lean: -4, crouch: 0.3, wAng: 0.02, wPull: -12, glow: 0 }, 8);
  sfx('rune'); await tw(14, (p, k) => { m.P.glow = p; const [px, py] = pontaLanca(m); if (k % 2 === 0) { const a = Math.random() * 6; part({ x: px + Math.cos(a) * 12, y: py + Math.sin(a) * 12, vx: -Math.cos(a) * 0.9, vy: -Math.sin(a) * 0.9, life: 12, col: '#ffe066' }); } });
  const ok = await timedPrompt(t, 18);
  // atravessa o inimigo: passa por ele e freia do outro lado
  const [tx, ty] = unitCenter(t), alvo = tx + 26 - m.x, dy = (t.fly ? 0 : t.y - m.y);
  m.ghosts = []; sfx('crit'); linhasVel(ty - 20, ty + 10, 1, 12);
  await pose(m, { lean: 7, crouch: 0.06, wPull: 6, stride: 6 }, 2, ease.out);
  let bateu = false;
  await tw(10, p => { const q = ease.in(p); m.ox = alvo * q; m.oy = dy * q; const fr = unitFrame(m); if (fr) m.ghosts.push({ x: m.x + m.ox, y: m.y + m.oy, fr, a: 0.55 });
    if (!bateu && m.x + m.ox >= tx - 8) { bateu = true; const [x, y] = unitCenter(t); hitstop(8); bshake(10, 3); flashW(2); burst(x, y, 18, ['#ffffff', '#e86050', '#ffe066']); hitFoe(m, t, 1.4, { el: 'corte', crit: ok, brk: m.eqFx && m.eqFx.has('estocada3') ? 3 : 2 }); if (ok) BT.stats.crit++; } });
  m.P.glow = 0;
  poeira(m.x + m.ox, m.y + m.oy, -1, 10); sfx('step');
  await pose(m, { lean: -3, crouch: 0.2, stride: 4 }, 6, ease.out);
  // pula de volta por cima do inimigo
  await pose(m, { crouch: 0.28, wAng: -1.35, wPull: 0 }, 4);
  await pulo(m, -m.ox, -m.oy, 44, 22, { giro: -Math.PI * 2, rastro: true, ez: ease.io });
  m.ox = 0; m.oy = 0; await resetPose(m, 6);
};
TECH2.provocar.run = async (m) => {
  sfx('select');
  // gira a lança acima da cabeça, finca no chão e chama com o queixo
  await pose(m, { crouch: 0.1, lean: -1 }, 4);
  await tw(22, p => { m.P.wAng = -1.35 + p * Math.PI * 4; m.P.wPull = -4 * Math.sin(p * Math.PI); if (BT.t % 3 === 0) { const [x, y] = pontaLanca(m); part({ x, y, vx: rand(-0.5, 0.5), vy: -0.4, life: 10, col: '#ffffff' }); } });
  sfx('gate'); bshake(4, 1);
  await pose(m, { wAng: -1.57, wPull: 4, lean: -3, head: 1, crouch: 0 }, 6, ease.out);
  BT.taunt = { m, n: m.eqFx && m.eqFx.has('provoca3') ? 3 : 2 }; m.def0 = true;
  const [x, y] = unitCenter(m); await tw(26, p => txt('Vem!', x + 6, y - 38 - p * 6, { align: 'center', col: '#ff8a70', alpha: 1 - p * 0.4, shadow: true }));
  callout('Rita chama a atenção', '#ff8a70', 40);
  await resetPose(m, 8);
};
superRita = async function (m) {
  sfx('crit');
  // salta bem alto girando, e desce em rasantes por todos os inimigos
  await pose(m, { crouch: 0.35, lean: -2, wAng: -1.2 }, 6);
  await pulo(m, 20, -10, 60, 16, { giro: -Math.PI * 2, rastro: true, pouso: false });
  for (let r = 0; r < 3; r++) {
    for (const t of alive(BT.foes)) {
      const [x, y] = unitCenter(t), dx = x - 18 - m.x - m.ox, dy = y + 10 - m.y - m.oy, ox = m.ox, oy = m.oy;
      m.P.wAng = r % 2 ? -0.6 : 0.6; m.P.lean = 6; m.ghosts = m.ghosts || [];
      await tw(5, p => { m.ox = ox + dx * ease.in(p); m.oy = oy + dy * ease.in(p); const fr = unitFrame(m); if (fr) m.ghosts.push({ x: m.x + m.ox, y: m.y + m.oy, fr, a: 0.6 }); });
      sfx('hit'); hitstop(3); bshake(4); slashFx(x, y, '#ffe066', r % 2 ? 1 : -1, true); burst(x, y, 8, ['#ffffff', '#e86050']); hitFoe(m, t, 0.75, { el: 'corte', brk: r === 0 ? 1 : 0 });
    }
  }
  // finaliza: finca a lança no chão com onda de choque
  await pose(m, { wAng: 1.57, wPull: 6, lean: 2, crouch: 0.3 }, 4, ease.out);
  sfx('rumble'); bshake(14, 3); flashW(2);
  const [lx, ly] = [m.x + m.ox, m.y + m.oy]; tw(18, p => { bx.globalAlpha = 1 - p; bx.strokeStyle = '#ffe066'; bx.beginPath(); bx.ellipse(lx, ly, 10 + p * 80, 3 + p * 12, 0, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; });
  await wait(10);
  await ritaVolta(m);
};

// ================= LUME =================
async function lumeFlutua(m, alt, n = 10) { const o0 = m.oy; await tw(n, p => { m.oy = o0 + (-alt - o0) * ease.io(p); }); m.baseOy = -alt; }
lumeAtk = async function (m, t) {
  // sobe um pouco, ergue o braço e junta luz na mão
  await Promise.all([lumeFlutua(m, 6, 10), pose(m, { arm: -0.5, lean: -1 }, 10)]);
  sfx('rune');
  await tw(12, (p, k) => { m.P.glow = p * 0.9; const [hx, hy] = maoLume(m); if (k % 2 === 0) { const a = Math.random() * 6; part({ x: hx + Math.cos(a) * 14, y: hy + Math.sin(a) * 14, vx: -Math.cos(a) * 1.1, vy: -Math.sin(a) * 1.1, life: 12, col: pickOne(['#ffe080', '#ffffff']) }); } });
  const ok = await timedPrompt(t, 22);
  // solta: o braço estica, o corpo recua
  await pose(m, { arm: -0.05, lean: -3 }, 3, ease.out);
  m.P.glow = 0;
  await projectile({ x: 0, y: 0, ox: 0, oy: 0, h: 0, _pt: maoLume(m) }, t, '#ffe080', 14, { r: 3, trail: ['#ffd060', '#ffffff', '#fff0a0'] });
  hitFoe(m, t, 0.9, { el: 'luz', mag: true, crit: ok });
  if (ok && t.hp > 0) { BT.stats.crit++; await pose(m, { arm: -0.3, lean: 0 }, 3); await projectile({ x: 0, y: 0, ox: 0, oy: 0, h: 0, _pt: maoLume(m) }, t, '#ffffff', 10, { r: 2 }); hitFoe(m, t, 0.45, { el: 'luz', mag: true }); }
  await Promise.all([lumeFlutua(m, 0, 10), resetPose(m, 10)]); m.baseOy = 0; m.P.arm = null;
};
// projétil saindo de um ponto qualquer (mão da Lume, boca do baú)
{ const _pr = projectile; projectile = function (from, to, col, n, o) { if (from && from._pt) { const [x, y] = from._pt; from = { x, y: y, ox: 0, oy: 0, h: 0 }; } return _pr(from, to, col, n, o); }; }
// cantar: balança, braço aberto, notas que voam até o alvo
async function lumeCanta(m, alvos, n = 30, col = '#ffd060') {
  await Promise.all([lumeFlutua(m, 4, 8), pose(m, { arm: -1.1, lean: -1, head: 1 }, 8)]);
  const notas = [];
  await tw(n, (p, k) => {
    m.P.lean = Math.sin(k / 6) * 2; m.P.glow = 0.5 + Math.sin(k / 4) * 0.2;
    if (k % 5 === 0) for (const a of alvos) notas.push({ a, k0: k });
    const [hx, hy] = maoLume(m);
    for (const nt of notas) { const q = Math.min(1, (k - nt.k0) / 16); if (q >= 1) continue; const [ax, ay] = unitCenter(nt.a); const x = hx + (ax - hx) * q, y = hy + (ay - 10 - hy) * q - Math.sin(q * Math.PI) * 18; txt('♪', x, y, { col: nt.k0 % 10 ? col : '#ffffff', alpha: 1 - q * 0.3 }); }
  });
  await Promise.all([lumeFlutua(m, 0, 8), resetPose(m, 8)]); m.baseOy = 0; m.P.arm = null; m.P.glow = 0;
}
{ const f = RUNA2.acalanto.run; RUNA2.acalanto.run = async (m, t) => { await lumeCanta(m, [t], 22); await f(m, t); }; }
{ const f = RUNA2.velaprot.run; RUNA2.velaprot.run = async (m, t) => {
  // a velinha do cabelo dela se divide e voa até o aliado
  await Promise.all([lumeFlutua(m, 4, 8), pose(m, { arm: -1.3, head: 1 }, 8)]);
  const [vx, vy] = velaLume(m), [tx, ty] = unitCenter(t);
  sfx('rune'); await tw(18, p => { const x = vx + (tx + 14 - vx) * ease.io(p), y = vy + (ty - vy) * ease.io(p) - Math.sin(p * Math.PI) * 24; brilho(x, y, 8, 'rgba(255,208,96,0.9)', 1); bx.fillStyle = '#fff0c0'; bx.fillRect(Math.round(x), Math.round(y) - 1, 2, 3); });
  await Promise.all([lumeFlutua(m, 0, 8), resetPose(m, 8)]); m.baseOy = 0; m.P.arm = null;
  await f(m, t);
}; }
{ const f = RUNA2.ofuscar.run; RUNA2.ofuscar.run = async (m, t) => {
  // braço para o alto, clarão que explode da mão
  await Promise.all([lumeFlutua(m, 8, 10), pose(m, { arm: -1.45, lean: -2 }, 10)]);
  await tw(10, p => { m.P.glow = p * 1.6; });
  const [hx, hy] = maoLume(m); sfx('crit'); flashW(3);
  tw(14, p => { luzSoma(() => { bx.globalAlpha = 1 - p; bx.fillStyle = '#fff8d0'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + p; bx.beginPath(); bx.moveTo(hx, hy); bx.lineTo(hx + Math.cos(a) * 60 * p, hy + Math.sin(a) * 60 * p); bx.lineTo(hx + Math.cos(a + 0.08) * 60 * p, hy + Math.sin(a + 0.08) * 60 * p); bx.fill(); } bx.globalAlpha = 1; }); });
  m.P.glow = 0; await pose(m, { arm: -0.2 }, 4, ease.out);
  await f(m, t);
  await Promise.all([lumeFlutua(m, 0, 8), resetPose(m, 8)]); m.baseOy = 0; m.P.arm = null;
}; }
{ const f = TECH2.cancao.run; TECH2.cancao.run = async (m) => {
  // canção: sobe mais, ondas de luz saem dela e passam por todo o grupo
  await Promise.all([lumeFlutua(m, 10, 12), pose(m, { arm: -1.2, head: 1 }, 12)]);
  const [cx, cy] = unitCenter(m);
  tw(40, p => { for (let i = 0; i < 3; i++) { const q = (p * 1.5 + i * 0.25) % 1; bx.globalAlpha = (1 - q) * 0.7; bx.strokeStyle = '#ffd060'; bx.beginPath(); bx.ellipse(cx, cy, 10 + q * 90, 6 + q * 40, 0, 0, Math.PI * 2); bx.stroke(); } bx.globalAlpha = 1; m.P.lean = Math.sin(p * 18) * 2; m.P.glow = 0.7; });
  await f(m);
  await Promise.all([lumeFlutua(m, 0, 10), resetPose(m, 10)]); m.baseOy = 0; m.P.arm = null; m.P.glow = 0;
}; }
{ const f = TECH2.velaguia.run; TECH2.velaguia.run = async (m, t) => {
  await pose(m, { arm: -0.25, lean: -1 }, 6); m.P.glow = 0.6;
  await f(m, t); m.P.glow = 0; await resetPose(m, 8); m.P.arm = null;
}; }
{ const f = superLume; superLume = async function (m) {
  await Promise.all([lumeFlutua(m, 16, 16), pose(m, { arm: -1.5, head: 1, lean: -2 }, 16)]);
  await tw(16, p => { m.P.glow = p * 2; });
  const [vx, vy] = velaLume(m); tw(30, p => brilho(vx, vy, 10 + p * 30, 'rgba(255,220,120,0.9)', 1 - p));
  await f(m);
  m.P.glow = 0; await Promise.all([lumeFlutua(m, 0, 12), resetPose(m, 12)]); m.baseOy = 0; m.P.arm = null;
}; }

// ================= O BAÚ =================
// anda aos pulinhos; abre a tampa no ar; fecha com tudo no alvo
async function bauPulinhos(m, dxTot, dyTot, n = 3, alt = 8) {
  const x0 = m.ox, y0 = m.oy;
  for (let i = 0; i < n; i++) {
    const dx = dxTot / n, dy = dyTot / n;
    await pulo(m, dx, dy, alt, 9, { antes: i === 0, cada: p => { m.pose = p > 0.2 && p < 0.8 ? 'three' : 'closed'; } , pouso: i === n - 1 });
  }
  m.pose = null; m.ox = x0 + dxTot; m.oy = y0 + dyTot;
}
bauAtk = async function (m, t) {
  const dx = alvoX(t, 22) - m.x, dy = (t.fly ? 0 : t.y - m.y);
  await bauPulinhos(m, dx, dy, 3, 8);
  // agacha e dá o bote: sobe com a tampa escancarada
  m.pose = 'closed'; await tw(6, p => { m.sx = 1 + p * 0.25; m.sy = 1 - p * 0.25; });
  const ok = await timedPrompt(t, 20);
  const ox = m.ox, oy = m.oy; m.pose = 'front'; sfx('step');
  await tw(8, p => { m.ox = ox + 12 * p; m.oy = oy - Math.sin(p * Math.PI * 0.5) * 18; m.sx = 0.9; m.sy = 1.2; m.rot = -0.25 * p; });
  // CHOMP
  m.pose = 'closed'; m.rot = 0.15;
  await tw(3, p => { m.oy = oy - 18 + 18 * p; });
  const [x, y] = unitCenter(t);
  if (ok) { BT.stats.crit++; flashW(2); }
  sfx('bite'); hitstop(ok ? 8 : 5); bshake(ok ? 9 : 5, ok ? 3 : 2);
  burst(x, y, ok ? 18 : 10, ['#ffffff', '#f0c040', '#c8a048']);
  hitFoe(m, t, 1.0, { el: 'mordida', crit: ok });
  await tw(8, p => { const s = Math.sin(p * Math.PI); m.sx = 1 + s * 0.35; m.sy = 1 - s * 0.3; m.rot = 0.15 * (1 - p); m.ox = ox + 12 + Math.sin(p * 20) * 2 * (1 - p); });
  m.rot = 0; m.sx = 1; m.sy = 1;
  await bauPulinhos(m, -m.ox, -m.oy, 2, 10);
  m.ox = 0; m.oy = 0;
};
// runas do baú: abre a tampa, círculo de runa no chão, a magia sai da boca
async function bauConjura(m, col, n = 16) {
  m.pose = 'front'; sfx('rune');
  const [x] = unitCenter(m), fy = m.y;
  await tw(n, (p, k) => { circuloRuna(x, fy, 12 + p * 6, col, p, Math.min(1, p * 2)); m.oy = -Math.sin(p * Math.PI) * 4; brilho(x, m.y - m.h + 6, 4 + p * 8, col, p); if (k % 3 === 0) part({ x: x + rand(-14, 14), y: fy, vy: -rand(0.5, 1.2), life: 14, col }); });
  m.oy = 0;
  return [x, m.y - m.h + 6];
}
{ const f = RUNA2.brasa.run; RUNA2.brasa.run = async (m, t) => { if (m.id === 'bau') { const [x, y] = await bauConjura(m, '#f07830'); const _p = projectile; projectile = (fr, to, c, n, o) => _p({ _pt: [x, y] }, to, c, n, o); try { await f(m, t); } finally { projectile = _p; } m.pose = null; } else await f(m, t); }; }
{ const f = RUNA2.geada.run; RUNA2.geada.run = async (m) => {
  if (m.id === 'bau') {
    // pula e bate a tampa no chão: a geada corre pelo chão até os inimigos
    await bauConjura(m, '#7ad0f0', 12);
    await pulo(m, 0, 0, 22, 12, { cada: p => { m.pose = p < 0.6 ? 'front' : 'closed'; }, pouso: false });
    m.pose = 'closed'; sfx('rumble'); bshake(8, 2);
    await tw(8, p => { const s = Math.sin(p * Math.PI); m.sx = 1 + s * 0.3; m.sy = 1 - s * 0.3; });
    m.sx = m.sy = 1;
    const [x0] = unitCenter(m), fy = m.y;
    tw(22, p => { for (let i = 0; i < 18; i++) { const xx = x0 + p * 200 - i * 8; if (xx < x0) continue; const h = 3 + ((i * 7) % 6); bx.fillStyle = i % 2 ? '#bff0ff' : '#7ad0f0'; bx.fillRect(Math.round(xx), Math.round(fy - h + rand(-1, 1)), 2, h); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(xx), Math.round(fy - h), 1, 1); } });
  }
  await f(m); m.pose = null;
}; }
{ const f = RUNA2.seiva.run; RUNA2.seiva.run = async (m, t) => { if (m.id === 'bau') { await bauConjura(m, '#9be58a', 14); const [x0, y0] = [m.x, m.y - m.h + 6], [tx, ty] = unitCenter(t); await tw(16, p => { for (let i = 0; i < 6; i++) { const q = Math.max(0, Math.min(1, p * 1.4 - i * 0.07)), a = q * 7 + i; bx.fillStyle = i % 2 ? '#9be58a' : '#4a9a4a'; bx.fillRect(Math.round(x0 + (tx - x0) * q + Math.cos(a) * 6), Math.round(y0 + (ty - y0) * q - Math.sin(q * Math.PI) * 20 + Math.sin(a) * 4), 2, 2); } }); m.pose = null; } await f(m, t); }; }
{ const f = TECH2.guardar.run; TECH2.guardar.run = async (m, t) => {
  if (t === m) return f(m, t);
  // salta até o aliado, abre a tampa como escudo e volta
  const dx = t.x + 18 - m.x, dy = t.y - m.y;
  await pulo(m, dx, dy, 20, 12, { cada: p => { m.pose = 'three'; } });
  m.pose = 'front'; sfx('guard'); const [x, y] = unitCenter(m);
  await tw(14, p => { brilho(x, y, 16, 'rgba(255,169,77,0.8)', 1 - p); fxRing(x, y, 8 + p * 12, '#ffa94d', 1 - p); });
  await f(m, t);
  m.pose = null; await pulo(m, -m.ox, -m.oy, 18, 12); m.ox = 0; m.oy = 0;
}; }
{ const f = TECH2.baluarte.run; TECH2.baluarte.run = async (m) => {
  // pula alto e cai com a tampa: uma muralha de ferro sobe na frente do grupo
  await pulo(m, 0, 0, 36, 16, { cada: p => { m.pose = p < 0.5 ? 'three' : 'closed'; }, pouso: false });
  m.pose = 'closed'; sfx('rumble'); bshake(12, 3); flashW(1);
  await tw(8, p => { const s = Math.sin(p * Math.PI); m.sx = 1 + s * 0.35; m.sy = 1 - s * 0.35; });
  m.sx = m.sy = 1;
  const wx = 112; tw(40, p => { const h = 60 * ease.out(Math.min(1, p * 2)), a = p < 0.7 ? 0.75 : (1 - p) / 0.3 * 0.75; bx.globalAlpha = a; bx.fillStyle = '#6a6a7a'; bx.fillRect(wx, 160 - h, 10, h); bx.fillStyle = '#9a9aaa'; bx.fillRect(wx, 160 - h, 2, h); bx.fillStyle = '#3a3a48'; bx.fillRect(wx + 8, 160 - h, 2, h); for (let y = 0; y < h; y += 10) { bx.fillStyle = '#e8e8f0'; bx.fillRect(wx + 4, Math.round(160 - h + y + 3), 2, 2); } bx.globalAlpha = 1; });
  await f(m);
}; }
{ const f = TECH2.eco.run; TECH2.eco.run = async (m) => { m.pose = 'front'; await tw(18, p => { m.rot = Math.sin(p * Math.PI * 2) * 0.25; m.oy = -Math.sin(p * Math.PI) * 10; }); m.rot = 0; m.oy = 0; await f(m); m.pose = null; }; }
{ const f = superBau; superBau = async function (m, t) {
  // giro no ar antes de crescer
  await pulo(m, 0, 0, 30, 18, { giro: Math.PI * 2, cada: p => { m.pose = 'three'; } });
  m.pose = null; await f(m, t);
}; }

// ---------- duplas com o corpo inteiro ----------
{ const f = DUPLA2.lancaacesa.run; DUPLA2.lancaacesa.run = async (a, b) => {
  // a Lume acende a lança da Rita; a Rita salta e varre todos com a lança em chamas
  await Promise.all([lumeFlutua(a, 6, 8), pose(a, { arm: -0.4 }, 8), pose(b, { wAng: -0.9, crouch: 0.2 }, 8)]);
  a.P.glow = 1; const [hx, hy] = maoLume(a);
  await tw(14, p => { const [px, py] = pontaLanca(b), x = hx + (px - hx) * p, y = hy + (py - hy) * p - Math.sin(p * Math.PI) * 14; brilho(x, y, 8, 'rgba(255,170,60,0.9)', 1); });
  a.P.glow = 0; b.P.glow = 1; b.P.glowCol = 'rgba(255,150,40,0.95)'; sfx('brasa');
  await pulo(b, 30, -8, 40, 14, { giro: -Math.PI * 2, rastro: true, pouso: false });
  b.P.wAng = 0.2; b.P.lean = 5;
  await f(a, b);
  b.P.glow = 0; b.P.glowCol = null;
  await Promise.all([ritaVolta(b), lumeFlutua(a, 0, 8).then(() => { a.baseOy = 0; return resetPose(a, 8); })]); a.P.arm = null;
}; }
{ const f = DUPLA2.canescudo.run; DUPLA2.canescudo.run = async (a, b) => { a.pose = 'front'; await Promise.all([lumeFlutua(b, 6, 8), pose(b, { arm: -1.1, head: 1 }, 8)]); b.P.glow = 0.7; await f(a, b); b.P.glow = 0; a.pose = null; await Promise.all([lumeFlutua(b, 0, 8), resetPose(b, 8)]); b.baseOy = 0; b.P.arm = null; }; }

// ---------- liga o boneco nos membros do grupo ----------
{ const _gc = grupoCap1; grupoCap1 = function () {
  const g = _gc();
  for (const u of g) {
    if (u.id === 'rita') { u.frame = rigFrame('rita'); u.over = desenhaLanca; }
    if (u.id === 'lume') { u.frame = rigFrame('lume'); u.over = desenhaBraco; }
  }
  return g;
}; }
// caído: o boneco desaba e a lança fica no chão
{ const _hm2 = hurtMember; hurtMember = function (m, d0, o) { const vivo = m.hp > 0, d = _hm2(m, d0, o); if (vivo && m.P && m.hp > 0 && d > 0) { const P = m.P, l0 = P.lean; P.lean = (l0 || 0) - 4; setTimeout(() => { if (m.P) m.P.lean = l0 || 0; }, 140); } if (vivo && m.hp <= 0 && m.P && m.id === 'rita') { m.P.wAng = 0.1; m.P.wPull = -6; } return d; }; }

// ================= AVALIAR (a habilidade do Catálogo, de volta) =================
// O baú abre a tampa, a lente do Catálogo varre o inimigo e lê a ficha dele: vida, escudo, todas as fraquezas
// e uma dica de como lutar. Ação leve e sem custo: estudar o inimigo é o que o baú faz de melhor.
Object.assign(ICON_G, { avaliar: ["....kkk.....", "...kcccK....", "..kcwwcck...", "..kcwccck...", "..kccccck...", "...kccck....", "....kkkk....", ".......kk...", "........kk..", ".........kk.", "............", "............"].map(r => r.replace(/K/g, 'k')) });
const FICHA = {
  corvo: 'Feito de cartaz de procurado. Papel queima, papel rasga: fogo, luz e corte. Voa baixo e bica rápido: defesa no anel apertado.',
  espantalho: 'O espantalho do pedágio cobra com juros. Quando a cancela subir, zere o escudo antes que ela desça.',
  lambe: 'Lodo com fome de magia: chupa PM de quem tem. Fogo e luz secam o lodo. Bata nele antes que ele beba a Lume.',
  caranguejo: 'Casco de telha velha. Corte e fogo escorregam; mordida e gelo racham. Quando fechar o casco, espere ou quebre.',
  sapo: 'Engoliu um sininho. Infla a papada antes do Coaxo-Sino (deixa todo mundo tonto): corte ou fogo no escudo dele.',
  cacador: 'Gente da Guilda, com rede de bagagem. Tem medo de dente (mordida) e de luz no olho. Prefere prender o baú.',
  bras: 'Sargento Brás. Molha o carimbo antes do golpe forte: quebre o escudo e o carimbo cai. Sem casaco, muda as fraquezas.',
  ancora: 'A Dona Badalada, com medo de ser esquecida. A maré molha quem está na frente; as correntes prendem; no fim, ela só quer ouvir alguém cantar.',
  corrente: 'Corrente de navio segurando um aliado. Corte e fogo partem os elos.'
};
CMD.splice(1, 0, { k: 'avaliar', nm: 'Avaliar', ic: () => 'avaliar', desc: () => 'O Catálogo escaneia um inimigo: vida, escudo, TODAS as fraquezas e uma dica. NÃO gasta a vez (uma vez por vez).', only: m => m.id === 'bau', need: () => !BT._avalFeito, why: 'Já avaliou nesta vez' });
{ const _dc2 = doCommand; doCommand = async function (m, k) {
  if (k !== 'avaliar') return _dc2(m, k);
  const t = await pickTarget('e', { pref: BT.lastTarget }); if (!t) return false;
  await act(m, async () => {
    // ESCÂNER: a tampa abre, um feixe em leque sai do baú até o alvo, uma linha de varredura desce sobre ele com
    // grade e cantoneiras, números de leitura aparecem em volta e no fim um selo "ANALISADO".
    m.pose = 'front'; sfx('catalog');
    const [ex, ey] = [m.x + m.ox, m.y - m.h + 4], [tx, ty] = unitCenter(t), fr = unitFrame(t), th = fr ? fr.height : 30, tw_ = fr ? fr.width : 30, top = t.y + t.oy - th, L = tx - tw_ / 2 - 6, Rr = tx + tw_ / 2 + 6;
    const feixe = (a) => { bx.globalAlpha = 0.16 * a; bx.fillStyle = '#8fe3ff'; bx.beginPath(); bx.moveTo(ex, ey); bx.lineTo(L, top - 4); bx.lineTo(L, top + th + 4); bx.closePath(); bx.fill(); bx.beginPath(); bx.moveTo(ex, ey); bx.lineTo(Rr, top - 4); bx.lineTo(Rr, top + th + 4); bx.lineTo(L, top + th + 4); bx.closePath(); bx.globalAlpha = 0.07 * a; bx.fill(); bx.globalAlpha = 0.6 * a; bx.strokeStyle = '#8fe3ff'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(ex, ey); bx.lineTo(L, top - 4); bx.moveTo(ex, ey); bx.lineTo(L, top + th + 4); bx.stroke(); bx.globalAlpha = 1; };
    const cantos = (a) => { bx.globalAlpha = a; bx.fillStyle = '#8fe3ff'; for (const [cx, cy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const X = cx < 0 ? L : Rr, Y = cy < 0 ? top - 4 : top + th + 4; bx.fillRect(Math.round(X - (cx > 0 ? 5 : 0)), Math.round(Y), 6, 1); bx.fillRect(Math.round(X), Math.round(Y - (cy > 0 ? 5 : 0)), 1, 6); } bx.globalAlpha = 1; };
    // abre: lente acende na tampa e o feixe se abre
    await tw(12, p => { brilho(ex, ey, 3 + p * 6, '#8fe3ff', p); fxRing(ex, ey, 2 + p * 5, '#ffffff', 1 - p); feixe(p); cantos(p); });
    // varredura com grade
    const leit = [];
    await tw(34, (p, k) => {
      feixe(1); cantos(1);
      const sy = top - 4 + (th + 8) * p;
      bx.globalAlpha = 0.14; bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(L), Math.round(top - 4), Math.round(Rr - L), Math.round(sy - top + 4)); bx.globalAlpha = 1;
      bx.globalAlpha = 0.3; bx.fillStyle = '#8fe3ff'; for (let gx = L; gx < Rr; gx += 4) bx.fillRect(Math.round(gx), Math.round(top - 4), 1, Math.round(sy - top + 4)); for (let gy = top - 4; gy < sy; gy += 4) bx.fillRect(Math.round(L), Math.round(gy), Math.round(Rr - L), 1); bx.globalAlpha = 1;
      bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(L - 3), Math.round(sy), Math.round(Rr - L + 6), 1); bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(L - 3), Math.round(sy) + 1, Math.round(Rr - L + 6), 1);
      bx.globalAlpha = 0.25; bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(L - 3), Math.round(sy) - 3, Math.round(Rr - L + 6), 3); bx.globalAlpha = 1;
      if (k % 5 === 0) { leit.push({ x: (k % 10 ? Rr + 4 : L - 22), y: sy, s: (Math.random() * 0xfff | 0).toString(16).toUpperCase().padStart(3, '0'), t: 0 }); sfx('move'); }
      for (const q of leit) { q.t++; txt(q.s, q.x, q.y - 4, { col: '#8fe3ff', alpha: Math.max(0, 1 - q.t / 30) }); }
    });
    // selo
    sfx('item');
    await tw(18, p => { cantos(1 - p * 0.5); bx.globalAlpha = 1 - p * 0.6; bx.fillStyle = '#0a0612'; bx.fillRect(Math.round(tx - 30), Math.round(top - 18), 60, 11); bx.strokeStyle = '#8fe3ff'; bx.strokeRect(Math.round(tx - 30) + 0.5, Math.round(top - 18) + 0.5, 59, 10); bx.globalAlpha = 1; txt('ANALISADO', tx, top - 19, { align: 'center', col: '#8fe3ff', alpha: 1 - p * 0.4 }); });
    for (const el of ['fogo', 'gelo', 'luz', 'corte', 'mordida']) t.known[el] = t.weak.includes(el) ? 'weak' : 'ok';
    t.avaliado = true; m.pose = null;
    const fraco = t.weak.length ? t.weak.map(e => ({ fogo: 'fogo', gelo: 'gelo', luz: 'luz', corte: 'corte', mordida: 'mordida' }[e] || e)).join(', ') : 'nada';
    await say(`[AVALIAÇÃO: ${t.name}. Vida ${t.hp}/${t.mhp}. Escudo ${t.shield}/${t.maxShield}. Fraco a: ${fraco}.]`, 'cat');
    const f = FICHA[t.kind || (Object.keys(ENEMY2).find(k => ENEMY2[k].name === t.name))];
    if (f) await say('[' + f + ']', 'cat');
  });
  // não gasta a vez: volta ao menu do baú; só uma avaliação por vez
  BT._avalFeito = true; if (BT.menu) BT.menu.hidden = false; return false;
}; }
{ const _etA = endTurn; endTurn = function (u, w) { BT._avalFeito = false; return _etA.apply(this, arguments); }; }
