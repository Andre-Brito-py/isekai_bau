// ================= BATALHA: ANEL DE AÇÃO LEGÍVEL, GOLPES DE CHEFE ANIMADOS E MAGIAS CAPRICHADAS =================
// Pedidos do usuário: (1) o anel de ataque/defesa estava difícil de enxergar; (2) chefes precisam de ANIMAÇÃO DE
// ATAQUE que também sirva de TEMPO para a defesa (o golpe acerta exatamente quando o anel fecha); (3) as runas/magias
// devem aparecer de verdade na tela, com detalhe (projéteis por elemento, impactos, ondas, véus).

// ---------- partículas com forma própria (chama, cristal, folha, fumaça) ----------
function partD(o) { part(Object.assign({ sz: 1 }, o)); }
function desenhaParticula(p) {
  const a = Math.min(1, (p.life - p.t) / 10), k = p.t / p.life, x = Math.round(p.x), y = Math.round(p.y);
  bx.globalAlpha = a * (p.alpha ?? 1);
  if (p.forma === 'chama') { const s = Math.max(1, Math.round((p.s || 3) * (1 - k * 0.7))); bx.fillStyle = k < 0.3 ? '#fff4c0' : k < 0.6 ? '#ffb040' : '#e04818'; bx.fillRect(x - (s >> 1), y - s, s, s + 1); if (s > 2) { bx.fillStyle = '#fff8e0'; bx.fillRect(x, y - s + 1, 1, 1); } }
  else if (p.forma === 'cristal') { const L = Math.round((p.s || 4) * (1 - k * 0.3)), ang = p.ang ?? (p.t * 0.2); bx.fillStyle = '#e8f8ff'; for (let i = -L; i <= L; i++) bx.fillRect(Math.round(x + Math.cos(ang) * i), Math.round(y + Math.sin(ang) * i), 1, 1); bx.fillStyle = '#7ad0f0'; bx.fillRect(Math.round(x + Math.cos(ang) * L), Math.round(y + Math.sin(ang) * L), 1, 1); }
  else if (p.forma === 'folha') { const r = p.t * 0.25 + (p.ang || 0), c = p.col || '#7ad060'; bx.fillStyle = c; bx.fillRect(x, y, 2, 1); bx.fillRect(x + Math.round(Math.cos(r)), y + 1, 2, 1); bx.fillStyle = '#c8f0a0'; bx.fillRect(x, y, 1, 1); }
  else if (p.forma === 'fumaca') { const r = Math.round((p.s || 4) * (0.6 + k * 0.9)); bx.fillStyle = p.col || '#4a3a50'; bx.globalAlpha = a * 0.55 * (p.alpha ?? 1); bx.beginPath(); bx.arc(x, y, r, 0, Math.PI * 2); bx.fill(); bx.fillStyle = p.col2 || '#6a5a70'; bx.beginPath(); bx.arc(x - r / 3, y - r / 3, r * 0.55, 0, Math.PI * 2); bx.fill(); }
  else if (p.forma === 'gota') { bx.fillStyle = p.col || '#bff0ff'; bx.fillRect(x, y, 1, 2); bx.fillStyle = '#ffffff'; bx.fillRect(x, y, 1, 1); }
  else if (p.forma === 'estrela') { const c = p.col || '#fff0a0'; bx.fillStyle = c; bx.fillRect(x - 1, y, 3, 1); bx.fillRect(x, y - 1, 1, 3); if (p.t % 6 < 3) { bx.fillStyle = '#ffffff'; bx.fillRect(x, y, 1, 1); } }
  else if (p.forma === 'floco') { bx.fillStyle = '#ffffff'; bx.fillRect(x - 1, y, 3, 1); bx.fillRect(x, y - 1, 1, 3); bx.fillRect(x - 1, y - 1, 1, 1); bx.fillRect(x + 1, y + 1, 1, 1); }
  bx.globalAlpha = 1;
}
// liga o desenho por forma no laço de partículas do campo (partículas comuns seguem iguais)
const _partOrig = part;
part = function (o) { if (o && o.forma) { BT.parts.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, life: 30, t: 0, col: '#fff', sz: 0, fr: 0.98 }, o)); return; } return _partOrig(o); };
// o laço original desenha fillRect(sz); partículas com forma têm sz 0 (nada) e são desenhadas aqui, dentro do campo
let FX3_HOOK = true;

// ---------- brilho radial suave (luz da magia) ----------
function luzMagia(x, y, r, col, a) { const g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.globalAlpha = Math.max(0, Math.min(1, a)); bx.globalCompositeOperation = 'lighter'; bx.fillStyle = g; bx.fillRect(x - r, y - r, r * 2, r * 2); bx.globalCompositeOperation = 'source-over'; bx.globalAlpha = 1; }
function anelGrosso(x, y, r, w, col, a = 1) { if (r <= 0) return; bx.globalAlpha = Math.max(0, a); bx.strokeStyle = col; bx.lineWidth = w; bx.beginPath(); bx.arc(x, y, r, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; bx.lineWidth = 1; }

// ---------- projéteis por elemento ----------
const PROJ_COR = { fogo: ['#fff4c0', '#ffb040', '#e04818'], gelo: ['#ffffff', '#bff0ff', '#7ad0f0'], seiva: ['#e8ffd0', '#9be58a', '#3a9a4a'], fuligem: ['#a898b8', '#5a4a6a', '#2a1a30'], vapor: ['#ffffff', '#e0e8f0', '#f0a070'], luz: ['#ffffff', '#fff0a0', '#ffd060'], mofo: ['#e8f0b0', '#a8b860', '#5a6a3a'], geadanegra: ['#bff0ff', '#3a4a7a', '#1a1028'] };
async function projetilMagia(de, alvo, tipo, n = 20) {
  const [x0, y0] = de._pt || unitCenter(de), [x1, y1] = unitCenter(alvo), C = PROJ_COR[tipo] || PROJ_COR.luz;
  sfx(tipo === 'fogo' ? 'brasa' : tipo === 'gelo' || tipo === 'geadanegra' ? 'geada' : 'rune');
  await tw(n, (p, k) => {
    const e = ease.in(p), x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(p * Math.PI) * 14;
    luzMagia(x, y, 14, C[1], 0.5);
    if (tipo === 'fogo') { for (let i = 0; i < 3; i++) part({ forma: 'chama', x: x + rand(-2, 2), y: y + rand(-2, 2), vx: -(x1 - x0) / n * 0.3 + rand(-0.3, 0.3), vy: -rand(0.2, 0.8), life: 14 + (Math.random() * 6 | 0), s: 3 }); bx.fillStyle = C[2]; bx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7); bx.fillStyle = C[1]; bx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5); bx.fillStyle = C[0]; bx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3); }
    else if (tipo === 'gelo' || tipo === 'geadanegra') { const ang = Math.atan2(y1 - y0, x1 - x0); for (let i = -6; i <= 6; i++) { const w = 3 - Math.abs(i) / 2.5; for (let j = -w; j <= w; j++) { bx.fillStyle = Math.abs(j) < 1 ? C[0] : C[2]; bx.fillRect(Math.round(x + Math.cos(ang) * i - Math.sin(ang) * j), Math.round(y + Math.sin(ang) * i + Math.cos(ang) * j), 1, 1); } } if (k % 2 === 0) part({ forma: 'floco', x: x + rand(-3, 3), y: y + rand(-3, 3), vy: 0.3, life: 18 }); }
    else if (tipo === 'fuligem' || tipo === 'mofo') { part({ forma: 'fumaca', x: x + rand(-2, 2), y: y + rand(-2, 2), vy: -0.2, life: 22, s: 4, col: C[2], col2: C[1] }); bx.fillStyle = C[2]; bx.beginPath(); bx.arc(x, y, 5, 0, Math.PI * 2); bx.fill(); bx.fillStyle = C[0]; bx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 2, 2); }
    else if (tipo === 'seiva') { bx.fillStyle = C[2]; bx.beginPath(); bx.arc(x, y, 4, 0, Math.PI * 2); bx.fill(); bx.fillStyle = C[1]; bx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 3, 3); if (k % 2 === 0) part({ forma: 'folha', x, y, vx: rand(-0.5, 0.5), vy: rand(-0.4, 0.4), life: 22, ang: Math.random() * 6 }); }
    else { bx.fillStyle = C[1]; bx.beginPath(); bx.arc(x, y, 5, 0, Math.PI * 2); bx.fill(); bx.fillStyle = C[0]; bx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4); if (tipo === 'vapor' && k % 2 === 0) part({ forma: 'fumaca', x, y, vy: -0.3, life: 20, s: 3, col: '#f0f4f8', col2: '#ffffff', alpha: 0.8 }); }
  });
}
// ---------- impactos ----------
async function impactoMagia(alvo, tipo, forte) {
  const [x, y] = unitCenter(alvo), C = PROJ_COR[tipo] || PROJ_COR.luz, K = forte ? 1.4 : 1;
  flashW(1); if (forte) bshake(8, 2);
  if (tipo === 'fogo') {
    sfx('brasa'); for (let i = 0; i < 14 * K; i++) { const a = i / (14 * K) * Math.PI * 2; part({ forma: 'chama', x: x + Math.cos(a) * 4, y: y + Math.sin(a) * 3, vx: Math.cos(a) * rand(0.8, 2), vy: Math.sin(a) * rand(0.5, 1.4) - 0.8, g: -0.02, life: 22, s: 4 }); }
    for (let i = 0; i < 18; i++) part({ x: x + rand(-8, 8), y: y + rand(-4, 6), vy: -rand(0.6, 1.8), vx: rand(-0.4, 0.4), life: 40, col: pickOne(['#ffd060', '#ff9a30']), brasa: true, g: -0.01 });
    for (let i = 0; i < 5; i++) part({ forma: 'fumaca', x: x + rand(-6, 6), y: y - 6, vy: -0.4, life: 40, s: 5, col: '#3a2a30', col2: '#5a4a4a' });
    await tw(16, p => { luzMagia(x, y, 30 * K, '#ffb040', 1 - p); anelGrosso(x, y + 6, 6 + p * 26 * K, 3 * (1 - p) + 1, '#ff9a30', 1 - p); });
  } else if (tipo === 'gelo' || tipo === 'geadanegra') {
    sfx('geada'); const esp = []; for (let i = 0; i < 9; i++) esp.push({ a: -Math.PI / 2 + (i - 4) * 0.36 + rand(-0.1, 0.1), L: rand(10, 18) * K });
    await tw(12, p => { luzMagia(x, y, 22, '#bff0ff', 0.6); for (const s of esp) { const L = s.L * ease.out(p); for (let i = 0; i < L; i++) { const w = Math.max(0, 2 - i / L * 2); for (let j = -w; j <= w; j++) { bx.fillStyle = Math.abs(j) < 0.6 ? '#ffffff' : (tipo === 'geadanegra' ? '#3a4a7a' : '#7ad0f0'); bx.fillRect(Math.round(x + Math.cos(s.a) * i - Math.sin(s.a) * j), Math.round(y + 8 + Math.sin(s.a) * i + Math.cos(s.a) * j), 1, 1); } } } });
    await wait(4); sfx('hit');
    for (const s of esp) for (let i = 0; i < 3; i++) part({ forma: 'cristal', x: x + Math.cos(s.a) * s.L * 0.6, y: y + 8 + Math.sin(s.a) * s.L * 0.6, vx: Math.cos(s.a) * rand(0.5, 1.6), vy: Math.sin(s.a) * rand(0.5, 1.6), g: 0.06, life: 26, s: 3, ang: Math.random() * 6 });
    for (let i = 0; i < 14; i++) part({ forma: 'floco', x: x + rand(-18, 18), y: y - rand(10, 30), vy: rand(0.2, 0.5), vx: rand(-0.2, 0.2), life: 50 });
    anelGrosso(x, y + 8, 8, 2, '#ffffff', 0.8);
  } else if (tipo === 'seiva') {
    for (let v = 0; v < 4; v++) { const a0 = v / 4 * Math.PI * 2; tw(18, p => { for (let i = 0; i < 14 * p; i++) { const r = i * 1.4, a = a0 + i * 0.35; bx.fillStyle = i % 3 ? '#3a9a4a' : '#9be58a'; bx.fillRect(Math.round(x + Math.cos(a) * r * 0.8), Math.round(y + 10 - i * 1.6), 2, 1); if (i % 5 === 4) { bx.fillStyle = '#c84a4a'; bx.fillRect(Math.round(x + Math.cos(a) * r * 0.8) + 1, Math.round(y + 9 - i * 1.6), 1, 1); } } }); }
    await wait(10); for (let i = 0; i < 16; i++) part({ forma: 'folha', x: x + rand(-8, 8), y: y + rand(-6, 6), vx: rand(-1.4, 1.4), vy: rand(-1.6, -0.2), g: 0.04, life: 36, ang: Math.random() * 6 });
    await tw(10, p => luzMagia(x, y, 22, '#9be58a', 1 - p));
  } else if (tipo === 'fuligem' || tipo === 'mofo') {
    sfx('rumble'); for (let i = 0; i < 12 * K; i++) { const a = i / 12 * Math.PI * 2; part({ forma: 'fumaca', x: x + Math.cos(a) * 4, y: y + Math.sin(a) * 3, vx: Math.cos(a) * rand(0.4, 1.0), vy: Math.sin(a) * 0.5 - 0.2, life: 44, s: 5, col: C[2], col2: C[1], fr: 0.94 }); }
    await tw(22, p => { for (let i = 0; i < 3; i++) { const a = p * 8 + i * 2.1; bx.fillStyle = tipo === 'mofo' ? '#c8d890' : '#ffe066'; bx.fillRect(Math.round(x + Math.cos(a) * 10), Math.round(y - 22 + Math.sin(a) * 3), 2, 2); } });
  } else if (tipo === 'vapor') {
    sfx('geada'); for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2; part({ forma: 'fumaca', x: x + Math.cos(a) * 3, y: y + Math.sin(a) * 3, vx: Math.cos(a) * rand(0.6, 1.6), vy: Math.sin(a) * 0.6 - 0.6, life: 36, s: 4, col: '#e8eef4', col2: '#ffffff', alpha: 0.9, fr: 0.93 }); }
    for (let i = 0; i < 10; i++) part({ forma: 'gota', x: x + rand(-10, 10), y: y - rand(4, 16), vy: rand(-0.5, 0.3), g: 0.08, life: 30 });
    await tw(14, p => luzMagia(x, y, 26, '#f0a070', 0.8 * (1 - p)));
  } else {
    sfx('hit'); for (let i = 0; i < 12; i++) part({ forma: 'estrela', x: x + rand(-10, 10), y: y + rand(-12, 8), vy: -rand(0.2, 0.8), life: 30, col: C[1] });
    await tw(12, p => luzMagia(x, y, 22, C[1], 1 - p));
  }
}
// ---------- onda: uma parede do elemento atravessa o campo inimigo ----------
async function ondaMagia(de, tipo) {
  const [x0, y0] = unitCenter(de), C = PROJ_COR[tipo] || PROJ_COR.luz;
  sfx(tipo === 'fogo' ? 'brasa' : 'geada');
  await tw(26, (p, k) => {
    const fx = x0 + 10 + p * 200;
    luzMagia(fx, 120, 40, C[1], 0.45);
    for (let y = 70; y < 170; y += 6) {
      const off = Math.sin(y * 0.2 + p * 10) * 4;
      if (tipo === 'fogo') { if (k % 2 === 0) part({ forma: 'chama', x: fx + off, y: y + rand(-2, 2), vy: -rand(0.3, 1), life: 16, s: 4 }); }
      else if (tipo === 'gelo' || tipo === 'geadanegra') { bx.fillStyle = (y / 6) % 2 ? '#ffffff' : (tipo === 'geadanegra' ? '#3a4a7a' : '#7ad0f0'); bx.fillRect(Math.round(fx + off), y, 3, 4); if (k % 3 === 0) part({ forma: 'cristal', x: fx + off, y, vx: -0.5, vy: rand(-0.3, 0.3), life: 18, s: 2 }); }
      else if (k % 2 === 0) part({ forma: tipo === 'seiva' ? 'folha' : tipo === 'luz' ? 'estrela' : 'fumaca', x: fx + off, y, vx: 0.4, vy: -0.2, life: 22, s: 4, col: C[2], col2: C[1], ang: Math.random() * 6 });
    }
  });
}
// ---------- véus (apoio) ----------
async function veuMagia(alvo, K, cols) {
  const [x, y] = unitCenter(alvo), base = alvo.y;
  sfx('rune');
  if (K === 'brasa' || K === 'brasaviva') { await tw(26, (p, k) => { for (let i = 0; i < 3; i++) { const a = p * 14 + i * 2.1, r = 12 - p * 4; part({ forma: 'chama', x: x + Math.cos(a) * r, y: base - p * (alvo.h || 30) + Math.sin(a) * 3, vy: -0.4, life: 14, s: 3 }); } luzMagia(x, y, 22, '#ffb040', Math.sin(p * Math.PI)); }); }
  else if (K === 'geada' || K === 'orvalho' || K === 'geadanegra') { await tw(24, p => { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + p, r = 16 - ease.out(p) * 4, hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r * 1.1; bx.globalAlpha = 0.6; bx.fillStyle = K === 'geadanegra' ? '#3a4a7a' : '#bff0ff'; bx.fillRect(Math.round(hx) - 3, Math.round(hy) - 4, 6, 8); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(hx) - 2, Math.round(hy) - 3, 1, 6); bx.globalAlpha = 1; } luzMagia(x, y, 24, '#bff0ff', 0.6 * p); }); for (let i = 0; i < 8; i++) part({ forma: 'floco', x: x + rand(-14, 14), y: y - rand(0, 20), vy: 0.3, life: 30 }); }
  else if (K === 'seiva' || K === 'vapor') { await tw(28, (p, k) => { bx.globalAlpha = 0.35 * Math.sin(p * Math.PI); bx.fillStyle = '#9be58a'; bx.fillRect(Math.round(x) - 8, Math.round(base - 60), 16, 60); bx.globalAlpha = 1; luzMagia(x, base - 10, 26, '#9be58a', Math.sin(p * Math.PI)); if (k % 2 === 0) { part({ forma: 'folha', x: x + rand(-10, 10), y: base, vy: -rand(0.8, 1.6), vx: rand(-0.3, 0.3), life: 30, ang: Math.random() * 6 }); part({ forma: 'estrela', x: x + rand(-8, 8), y: base - rand(0, 30), vy: -0.5, life: 20, col: '#e8ffd0' }); } }); }
  else { await tw(26, (p, k) => { if (k % 2 === 0) part({ forma: 'fumaca', x: x + rand(-10, 10), y: y + rand(-10, 10), vy: -0.2, life: 30, s: 5, col: K === 'mofo' ? '#8a9a5a' : '#3a3048', col2: K === 'mofo' ? '#c8d890' : '#6a5a7a' }); }); }
}

// ---------- o laço do campo passa a desenhar partículas com forma ----------
const LOOP_FX3 = { n: 1e12, k: 0, fn: () => { for (const p of BT.parts) if (p.forma) desenhaParticula(p); }, r: () => {} };
{ const _dbp = drawBattle2; drawBattle2 = function () {
  // as partículas com forma (sz 0) são desenhadas por um "anim" contínuo dentro do campo
  if (BT && BT.anims && !BT.anims.includes(LOOP_FX3)) BT.anims.push(LOOP_FX3);
  return _dbp.apply(this, arguments);
}; }

// ---------- feitiços do Grimório e runas antigas com a animação nova ----------
function tipoDe(s) { const e1 = s.e[0], e2 = s.e[1]; if (e2 && e2 !== e1) { const k = chaveFus(e1, e2); return { 'brasa+geada': 'vapor', 'geada+seiva': 'gelo', 'brasa+seiva': 'fogo', 'brasa+fuligem': 'fuligem', 'fuligem+geada': 'geadanegra', 'fuligem+seiva': 'mofo' }[k]; } return { brasa: 'fogo', geada: 'gelo', seiva: 'seiva', fuligem: 'fuligem' }[e1]; }
feitico3 = (function (_f3) { return function (s) {
  const R = _f3(s), P = pagina3(s), F = FORMA3[s.f], k = P.dob ? 1.5 : 1, tipo = tipoDe(s);
  R.run = async (m, t) => {
    const ehBau = m.id === 'bau';
    if (ehBau) await bauConjura(m, P.col, 14); else sfx('rune');
    if (s.f === 'veu') { await veuMagia(t, P.veuK, P.cols); await veu3(m, t, P, k); m.pose = null; return; }
    const alvos = s.f === 'onda' ? alive(BT.foes) : [t], de = ehBau ? { _pt: [m.x, m.y - m.h + 6] } : m;
    if (s.f === 'dardo') { await projetilMagia(de, t, tipo, 18); await impactoMagia(t, tipo, P.dob || !!P.fus); }
    else { await ondaMagia(m, tipo); for (const a of alvos) impactoMagia(a, tipo, false); await wait(10); }
    await golpe3(m, alvos, P, F, s, k);
    if (BT.eco) { BT.eco = false; await wait(10); callout('Eco!', '#d0a8ff', 30); const vivos = alvos.filter(a => a.hp > 0); if (vivos.length) { if (s.f === 'dardo') await impactoMagia(vivos[0], tipo, false); await golpe3(m, vivos, P, F, s, k * 0.5); } }
    m.pose = null;
  };
  return R;
}; })(feitico3);
// as três runas antigas (antes de o Grimório acordar) ganham a mesma animação
for (const [k, s] of [['brasa', { e: ['brasa'], f: 'dardo' }], ['geada', { e: ['geada'], f: 'onda' }], ['seiva', { e: ['seiva'], f: 'veu' }]]) { const R = RUNA2[k]; if (R) R.run = feitico3(s).run; }

// ---------- ANEL DE AÇÃO legível (defesa e ataque) ----------
// alvo: disco escuro com borda branca grossa e a faixa verde (perfeito) / azul (bom); o anel que fecha é grosso, com
// contorno escuro, muda de cor dentro da janela e o botão A pulsa na hora certa. O resultado aparece grande.
function anelAcao(x, y, R0, rAtual, dt, janelaP, janelaB, fast, label, res, tRes) {
  // fundo e alvo
  bx.globalAlpha = 0.55; bx.fillStyle = '#0a0612'; bx.beginPath(); bx.arc(x, y, 9, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
  anelGrosso(x, y, 6 + janelaB, 3, 'rgba(143,227,255,0.35)'); anelGrosso(x, y, 6, 4, 'rgba(155,229,138,0.55)');
  anelGrosso(x, y, 6, 1, '#ffffff', 0.9);
  if (!res) {
    const dentroP = Math.abs(dt) <= janelaP, dentroB = Math.abs(dt) <= janelaB, tarde = dt > janelaP;
    const col = dentroP ? '#9be58a' : dentroB ? '#8fe3ff' : tarde ? '#ff6b6b' : fast ? '#ffa94d' : '#ffe066';
    anelGrosso(x, y, rAtual, 5, '#0a0612', 0.8); anelGrosso(x, y, rAtual, 3, col, 1);
    // botão A
    const pul = dentroP ? 1 + Math.sin(BT.t * 0.9) * 0.2 : 1, bxp = x + 15, byp = y - 15;
    bx.fillStyle = '#0a0612'; bx.beginPath(); bx.arc(bxp, byp, 6 * pul, 0, Math.PI * 2); bx.fill();
    bx.fillStyle = dentroP ? '#9be58a' : dentroB ? '#8fe3ff' : '#ffe066'; bx.beginPath(); bx.arc(bxp, byp, 5 * pul, 0, Math.PI * 2); bx.fill();
    txt('A', bxp - 2, byp - 6, { col: '#0a0612' });
    if (dentroP) luzMagia(x, y, 18, '#9be58a', 0.5);
  } else {
    const c = res === 'perfeito' || res === 'certo' ? '#9be58a' : res === 'bom' ? '#8fe3ff' : '#ff6b6b', k = tRes / 8;
    anelGrosso(x, y, 6 + tRes * 3, 3, c, 1 - k);
    txt(res === 'perfeito' ? 'PERFEITO!' : res === 'certo' ? 'CERTO!' : res === 'bom' ? 'BOM' : 'FALHOU', x, y - 34 - tRes, { align: 'center', col: c, shadow: true, sz: res === 'perfeito' || res === 'certo' ? 1.5 : 1 });
  }
  if (label && !res) txt(label, x, y - 40, { align: 'center', col: '#ffa94d', shadow: true });
}
drawRing = function () {
  const R = BT.ring, [x, y] = unitCenter(R.m), dt = R.t - R.n, r = Math.max(6, 6 + (R.n - R.t) * 1.1);
  anelAcao(x, y, 6 + R.n * 1.1, r, dt, 3, 8, R.fast, R.label, R.res, R.res ? R.t - R.at : 0);
};
drawPrompt = function () {
  const P = BT.prompt, [x, y] = unitCenter(P.t), dt = P.k - P.n, r = Math.max(5, 5 + (P.n - P.k) * 1.2);
  bx.globalAlpha = 0.9; bx.drawImage(ICON.atacar, Math.round(x - 6), Math.round(y - 6)); bx.globalAlpha = 1;
  anelAcao(x, y, 0, r + 1, dt, 3, 3, false, null, P.res ? (P.res === 'certo' ? 'certo' : 'falhou') : null, P.res ? P.k - P.at : 0);
};

// ---------- GOLPE DE CHEFE ANIMADO, no tempo do anel ----------
// Enquanto o anel fecha: o chefe ARMA o golpe (recua, treme, brilha, "!" em cima), depois AVANÇA e o golpe chega no
// alvo exatamente quando o anel encosta. Golpes à distância viram um projétil que chega no mesmo instante.
{ const _fsB = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  if (e && e.side === 'e' && e.boss && !o.semGolpe && t && t.hp > 0) BT.golpe = { e, t, n: o.n || 34, el: o.el, longe: !!o.longe || o.el === 'luz', ox0: e.ox || 0, oy0: e.oy || 0, k: 0 };
  try { return await _fsB(e, t, pow, o); } finally { if (BT.golpe && BT.golpe.e === e) { e.ox = BT.golpe.ox0; e.oy = BT.golpe.oy0; e.armando = 0; } BT.golpe = null; }
}; }
{ const _ur = updateRing; updateRing = function () {
  const Gp = BT.golpe, R = BT.ring;
  if (Gp && R && R.m) {
    const e = Gp.e, p = R.t / R.n, [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(R.m), dx = tx - ex, dy = ty - ey, dist = Math.hypot(dx, dy) || 1;
    if (!Gp.longe) {
      if (p < 0.72) { const q = ease.out(p / 0.72); e.ox = Gp.ox0 - dx / dist * 10 * q + (R.t % 4 < 2 ? 1 : -1) * q; e.oy = Gp.oy0 - 6 * q; e.armando = q; }
      else if (p <= 1) { const q = ease.in((p - 0.72) / 0.28); e.ox = Gp.ox0 - dx / dist * 10 * (1 - q) + dx * 0.55 * q; e.oy = Gp.oy0 - 6 * (1 - q) + dy * 0.55 * q; e.armando = 1; if (R.t === R.n) { slashFx(tx, ty, '#ffffff', 1.4); burst(tx, ty, 12, ['#ffffff', '#ffe066']); BT.zoom = { x: tx, y: ty, k: 0.06 }; } }
      else { const q = Math.min(1, (R.t - R.n) / 8); e.ox = Gp.ox0 + dx * 0.55 * (1 - q); e.oy = Gp.oy0 + dy * 0.55 * (1 - q); e.armando = 0; }
    } else { e.armando = p < 1 ? Math.min(1, p * 1.4) : 0; e.oy = Gp.oy0 - Math.sin(Math.min(1, p) * Math.PI) * 4; }
  }
  return _ur.apply(this, arguments);
}; }
// desenho: brilho e "!" no chefe armando; projétil do golpe à distância
{ const _dr = drawRing; drawRing = function () {
  const Gp = BT.golpe, R = BT.ring;
  if (Gp && R) {
    const e = Gp.e, [ex, ey] = unitCenter(e), q = e.armando || 0;
    if (q > 0) { luzMagia(ex, ey, 30 + q * 10, Gp.el === 'luz' ? '#fff0a0' : '#ff6b6b', 0.25 + q * 0.35); if (R.t < R.n - 4) { txt('!', ex, ey - (e.h || 40) / 2 - 22 - (R.t % 10 < 5 ? 1 : 0), { align: 'center', col: '#ff6b6b', shadow: true, sz: 2 }); } }
    if (Gp.longe && R.t > R.n * 0.45 && R.t <= R.n) { const p = (R.t - R.n * 0.45) / (R.n * 0.55), [tx, ty] = unitCenter(R.m), x = ex + (tx - ex) * p, y = ey + (ty - ey) * p - Math.sin(p * Math.PI) * 10; luzMagia(x, y, 16, Gp.el === 'luz' ? '#fff0a0' : '#ff9a50', 0.8); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5); if (R.t % 2 === 0) part({ x, y, vx: rand(-0.5, 0.5), vy: rand(-0.5, 0.5), life: 14, col: Gp.el === 'luz' ? '#ffe080' : '#ffb070' }); }
  }
  return _dr.apply(this, arguments);
}; }
// a Rainha bate as asas mais rápido quando arma o golpe
ENEMY2.rainha.frame = u => mariposaArt(Math.floor(BT.t / (u.armando ? 3 : 10) + u.x) % 2, true, !!u.acesa);

// ---------- Mariposa-Rainha: dificuldade ajustada (o usuário não conseguiu passar) ----------
Object.assign(ENEMY2.rainha, { mhp: 1400, atk: 20, shield: 4, maxShield: 4 });
