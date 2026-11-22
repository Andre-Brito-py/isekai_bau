// ================= SUPER DO BAÚ, REFEITO: "ENGOLIR O MUNDO" =================
// (pedido do usuário: a animação antiga era fraca: o baú sumia da tela e o inimigo só encolhia.)
// Coreografia: 1) CARGA: a tampa treme, o ar em volta é puxado para dentro (o Vão acordando); 2) SALTO em arco,
// girando e crescendo, com rastro; 3) POUSO com onda de choque; 4) a boca abre num REDEMOINHO escuro cheio de
// estrelas que SUGA o alvo (ele estica, gira e entra); chefe grande não cabe: é puxado e resiste; 5) a tampa BATE:
// quadro de impacto, três mastigadas com "CRUNCH"; 6) CUSPE: o alvo sai como bala de canhão com rastro e bate longe;
// 7) o baú desincha e volta pulando.
function vortexBau(x, y, r, a, giro) {
  bx.save(); bx.globalAlpha = a;
  // disco escuro com borda roxa
  const g = bx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, '#000000'); g.addColorStop(0.55, '#140820'); g.addColorStop(0.85, '#4a2a7a'); g.addColorStop(1, 'rgba(200,160,255,0)');
  bx.fillStyle = g; bx.beginPath(); bx.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2); bx.fill();
  // braços da espiral
  for (let k = 0; k < 4; k++) { bx.strokeStyle = k % 2 ? 'rgba(200,160,255,0.8)' : 'rgba(143,227,255,0.6)'; bx.lineWidth = 1; bx.beginPath(); for (let i = 0; i <= 24; i++) { const q = i / 24, ang = giro + k * Math.PI / 2 + q * 4.2, rr = r * (1 - q) * 0.95; const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr * 0.8; if (i) bx.lineTo(px, py); else bx.moveTo(px, py); } bx.stroke(); }
  // estrelinhas lá dentro (é maior por dentro)
  for (let i = 0; i < 10; i++) { const ang = giro * 1.6 + i * 2.4, rr = (r * 0.7) * ((i * 37 % 10) / 10); bx.fillStyle = i % 3 ? '#ffffff' : '#ffe080'; bx.fillRect(Math.round(x + Math.cos(ang) * rr), Math.round(y + Math.sin(ang) * rr * 0.8), 1, 1); }
  bx.restore();
}
superBau = async function (m, t) {
  const boss = !!t.boss, fr = unitFrame(t), tW = fr ? fr.width : 30;
  const [tx0, ty0] = unitCenter(t);
  const destOx = (tx0 - tW / 2 - 30) - m.x, destOy = t.fly ? 0 : Math.max(-30, Math.min(30, t.y - m.y));
  m.ghosts = [];
  // 1) CARGA
  m.pose = 'closed'; sfx('rune'); callout('ENGOLIR O MUNDO', '#c8a0ff', 70);
  await tw(28, p => {
    const [x, y] = unitCenter(m);
    m.ox = (Math.random() - 0.5) * 3 * p; m.sx = 1 + 0.18 * p; m.sy = 1 - 0.12 * p;
    luzMagia(x, y, 10 + p * 18, '#c8a0ff', 0.3 + p * 0.5);
    for (let i = 0; i < 2; i++) { const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 30; part({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * d / 14, vy: -Math.sin(a) * d / 14, life: 14, col: i ? '#c8a0ff' : '#8fe3ff' }); }
    if (BT.t % 6 === 0) fxRing(x, y, 26 * (1 - p) + 6, '#c8a0ff', p);
  });
  camSoco(m.x, m.y - 20, 0.06);
  // 2) SALTO em arco, girando e crescendo
  sfx('step'); poeira(m.x + m.ox, m.y + m.oy, 1, 8);
  const ox0 = m.ox, oy0 = m.oy;
  await tw(20, p => {
    const q = ease.io(p); m.ox = ox0 + (destOx - ox0) * q; m.oy = oy0 + (destOy - oy0) * q - Math.sin(p * Math.PI) * 54;
    const s = 1.18 + q * 0.9; m.sx = s; m.sy = s; m.rot = q * Math.PI * 2;
    if (BT.t % 2 === 0) { const f2 = unitFrame(m); if (f2) m.ghosts.push({ x: m.x + m.ox, y: m.y + m.oy, fr: f2, a: 0.4 }); }
  });
  m.rot = 0; m.sx = 2.08; m.sy = 2.08;
  // 3) POUSO
  sfx('crit'); bshake(14, 4); hitstop(5); flashW(2);
  const fx = m.x + m.ox, fy = m.y + m.oy;
  poeira(fx, fy, -1, 10); poeira(fx, fy, 1, 10);
  await tw(12, p => { fxRing(fx, fy - 2, 8 + p * 40, '#ffe8c0', 1 - p); m.sy = 2.08 - Math.sin(p * Math.PI) * 0.35; m.sx = 2.08 + Math.sin(p * Math.PI) * 0.3; });
  // 4) A BOCA ABRE: REDEMOINHO que suga
  m.pose = 'front'; sfx('rumble');
  const boca = () => [m.x + m.ox + 4, m.y + m.oy - m.h * m.sy * 0.55];
  const t0 = { ox: t.ox || 0, oy: t.oy || 0 };
  await tw(46, (p, k) => {
    const [bxx, byy] = boca(), r = 8 + ease.out(Math.min(1, p * 2)) * 18;
    vortexBau(bxx, byy, r, Math.min(1, p * 3), k * 0.25);
    const [tx, ty] = unitCenter(t);
    // partículas arrancadas do alvo indo para a boca
    if (k % 2 === 0) part({ x: tx + rand(-10, 10), y: ty + rand(-14, 14), vx: (bxx - tx) / 16, vy: (byy - ty) / 16, life: 16, col: pickOne(['#ffffff', '#c8a0ff', '#ffe080']) });
    if (!boss) {
      const q = ease.in(Math.min(1, p * 1.15));
      t.ox = t0.ox + (bxx - tx0) * q; t.oy = t0.oy + (byy - ty0) * q;
      t.sx = Math.max(0.05, 1 - q * 0.95) * (1 + Math.sin(k * 0.6) * 0.15 * (1 - q)); t.sy = Math.max(0.05, 1 - q * 0.9);
      t.rot = q * 6;
    } else {
      // não cabe: é puxado um pouco, estica e resiste
      const q = Math.sin(Math.min(1, p * 1.3) * Math.PI / 2);
      t.ox = t0.ox - 18 * q + Math.sin(k * 0.9) * 2; t.sx = 1 + q * 0.12; t.sy = 1 - q * 0.08;
    }
    if (k % 10 === 0) sfx('move');
  });
  if (!boss) t.alpha = 0;
  // 5) A TAMPA BATE + mastigadas
  m.pose = 'closed'; sfx('bite'); flashW(6); hitstop(10); bshake(22, 5); camSoco(m.x + m.ox, m.y + m.oy - 30, 0.1);
  { const [bxx, byy] = boca(); burst(bxx, byy, 26, ['#ffffff', '#c8a0ff', '#ffe080'], { max: 3.5 }); }
  if (boss) callout('Não cabe! Mas dói.', '#f0c040', 60);
  for (let i = 0; i < 3; i++) {
    sfx('bite'); bshake(8, 3); hitstop(3);
    const [bxx, byy] = boca(); popNum(bxx + rand(-14, 14), byy - 28 - i * 6, ['CRUNCH', 'CROC', 'NHAC'][i], '#ffe080');
    await tw(11, p => { const s = Math.sin(p * Math.PI); m.sy = 2.08 - s * 0.3; m.sx = 2.08 + s * 0.26; m.rot = (i % 2 ? 1 : -1) * s * 0.12; for (let j = 0; j < 2; j++) if (BT.t % 3 === 0) part({ forma: 'estrela', x: bxx + rand(-16, 16), y: byy - rand(8, 22), vy: -0.6, life: 16, col: '#ffe080' }); });
  }
  m.rot = 0;
  // 6) CUSPE
  sfx('crit'); m.pose = 'front';
  await tw(8, p => { m.rot = -0.25 * p; m.sx = 2.08 - p * 0.15; m.sy = 2.08 + p * 0.15; });
  const [bx0, by0] = boca();
  t.alpha = 1; t.rot = 0;
  const longe = 46;
  await tw(10, p => {
    const q = ease.out(p);
    t.ox = t0.ox + (bx0 - tx0) * (1 - q) + longe * q; t.oy = t0.oy + (by0 - ty0) * (1 - q);
    t.sx = 0.3 + q * 0.7; t.sy = 0.3 + q * 0.7; m.rot = -0.25 + p * 0.25;
    const [tx, ty] = unitCenter(t);
    bx.fillStyle = '#ffffff'; bx.globalAlpha = 0.7 * (1 - p); bx.fillRect(Math.round(bx0), Math.round(ty - 2), Math.round(tx - bx0), 4); bx.globalAlpha = 1;
    if (BT.t % 2 === 0) part({ x: tx - 6, y: ty + rand(-6, 6), vx: -1.5, life: 12, col: '#c8a0ff' });
  });
  m.rot = 0;
  // impacto no fundo
  sfx('crit'); flashW(5); hitstop(12); bshake(18, 4);
  const [ix, iy] = unitCenter(t);
  burst(ix, iy, 44, ['#f0c040', '#ffffff', '#c8a0ff'], { max: 4.5 });
  for (let i = 0; i < 10; i++) part({ forma: 'estrela', x: ix, y: iy, vx: Math.cos(i * 0.63) * 2.4, vy: Math.sin(i * 0.63) * 2.4, life: 22, col: i % 2 ? '#ffe080' : '#ffffff' });
  tw(16, p => { fxRing(ix, iy, 6 + p * 46, '#ffe080', 1 - p); fxRing(ix, iy, 4 + p * 30, '#c8a0ff', 1 - p); });
  hitFoe(m, t, 4.2, { el: 'mordida', brk: 3, crit: true });
  await tw(12, p => { t.ox = t0.ox + longe * (1 - ease.out(p)); t.oy = t0.oy; });
  t.ox = t0.ox; t.oy = t0.oy; t.sx = 1; t.sy = 1; t.rot = 0; t.alpha = 1;
  // 7) desincha e volta
  m.pose = null;
  await tw(12, p => { const s = 2.08 - p * 1.08; m.sx = s; m.sy = s; });
  m.sx = 1; m.sy = 1; m.ghosts = [];
  await dashBack(m, 14);
};
