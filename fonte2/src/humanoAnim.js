// ================= ANIMAÇÕES DA FORMA HUMANA (pedido do usuário: "caprichar o máximo possível, com muitos detalhes") =================
// TRANSFORMAÇÃO: o círculo da Runa do Rosto acende embaixo, uma coluna de luz âmbar sobe, o baú se dissolve em
//   faíscas e a pessoa aparece de baixo para cima dentro da luz (gotas de "memória quente" subindo ao contrário).
//   Na volta, a pessoa DERRETE: escorre em gotas douradas e o baú cai no lugar com um quique.
// ARO DE DENTES: os dentes se juntam um a um na mão formando o aro; um brilho corre pelo fio; arrancada com
//   imagens-fantasma e poeira; corte em crescente de três camadas; marca de MORDIDA no inimigo (duas fileiras de
//   dentes que se fecham); no acerto certeiro, um segundo corte em X e o "fechar da boca"; volta com mortal para trás
//   e o aro se desfaz em poeira dourada.
// GOLPE A DOIS: faixa de cena (cut-in) com os dois retratos entrando de lados opostos e linhas de velocidade;
//   corrida lado a lado com fantasmas; X de dois golpes cruzados, onda de choque, cacos de escudo; volta com um
//   "toque de mãos" que solta estrelinhas. Com a Lume: coluna de luz no lugar da lança.
// PASSO LIGEIRO: três passos-fantasma, linhas de vento, folhas; enquanto dura, um contorno tremulando e redemoinho
//   no pé. Quando esquiva: o golpe atravessa um fantasma e ele aparece de lado.
// MÃO FIRME: ele vai até o aliado, as mãos se encontram num brilho quente, fios de luz ondulam entre os dois e
//   pétalas sobem; com a Lume sobem coraçõezinhos; com a Rita, ela aperta forte e sai uma gotinha de suor do baú.

// ---------- utilidades ----------
function fantasma(u, a = 0.55) { const fr = unitFrame(u); if (!fr) return; u.ghosts = u.ghosts || []; u.ghosts.push({ fr, x: u.x + u.ox, y: u.y + u.oy, a }); }
function maoHum(u) { const [x, y] = unitCenter(u); return [x + (u.side === 'p' ? 9 : -9), y + 3]; }
function poeiraHum(x, y, n = 5, dir = -1) { for (let i = 0; i < n; i++) part({ forma: 'fumaca', x: x + rand(-3, 3), y: y + rand(-1, 1), vx: dir * rand(0.3, 1.2), vy: -rand(0.1, 0.5), life: 22, col: 'rgba(200,180,150,0.6)', s: 2 }); }
// o aro: lâmina curva com a fileira de dentes. ang = rotação; k = 0..1 quantos dentes já se formaram; brilho = posição do reflexo (0..1) ou null
function desenhaAro(gx, gy, ang = 0, k = 1, brilho = null, a = 1, esc = 1) {
  const R = 9 * esc, n = 14, ab = -Math.PI * 0.85 + ang, ae = -Math.PI * 0.05 + ang;
  bx.globalAlpha = a;
  for (let i = 0; i <= n; i++) {
    const f = i / n, t = ab + (ae - ab) * f, X = gx + Math.cos(t) * R, Y = gy + Math.sin(t) * R;
    if (f > k) break;
    bx.fillStyle = '#3a2410'; bx.fillRect(Math.round(X) - 1, Math.round(Y) - 1, 3, 3);
    bx.fillStyle = '#c8a040'; bx.fillRect(Math.round(X), Math.round(Y), 2, 2);
    bx.fillStyle = '#fff0b0'; bx.fillRect(Math.round(X), Math.round(Y), 1, 1);
    if (i % 2 === 0 && i > 0 && i < n) { const tx = gx + Math.cos(t) * (R + 2.5), ty = gy + Math.sin(t) * (R + 2.5); bx.fillStyle = '#f2ecdc'; bx.fillRect(Math.round(tx), Math.round(ty), 1, 2); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(tx), Math.round(ty), 1, 1); }
  }
  // cabo (onde a mão segura)
  bx.fillStyle = '#5a3a24'; bx.fillRect(Math.round(gx) - 1, Math.round(gy) - 1, 3, 3); bx.fillStyle = '#8a5a34'; bx.fillRect(Math.round(gx), Math.round(gy) - 1, 1, 1);
  if (brilho != null && brilho >= 0 && brilho <= 1) { const t = ab + (ae - ab) * brilho, X = gx + Math.cos(t) * R, Y = gy + Math.sin(t) * R; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(X) - 1, Math.round(Y), 3, 1); bx.fillRect(Math.round(X), Math.round(Y) - 1, 1, 3); bx.globalAlpha = a * 0.5; bx.fillRect(Math.round(X) - 3, Math.round(Y), 7, 1); bx.fillRect(Math.round(X), Math.round(Y) - 3, 1, 7); }
  bx.globalAlpha = 1;
}
// corte em crescente com três camadas
function crescente(x, y, r, a0, a1, p, larg = 3) {
  const fim = a0 + (a1 - a0) * Math.min(1, p * 1.4), ini = a0 + (a1 - a0) * Math.max(0, p * 1.4 - 0.5);
  const camada = (rr, w, col, al) => { bx.globalAlpha = al * (1 - Math.max(0, p - 0.6) / 0.4); bx.strokeStyle = col; bx.lineWidth = w; bx.beginPath(); bx.arc(x, y, rr, Math.min(ini, fim), Math.max(ini, fim)); bx.stroke(); };
  camada(r + 1, larg + 2, '#7a4a18', 0.6); camada(r, larg, '#ffd060', 0.95); camada(r - 0.5, 1, '#ffffff', 1);
  bx.globalAlpha = 1;
}
// a marca de mordida: duas fileiras de dentes que se fecham no alvo
function mordidaMarca(x, y, p, big) {
  const abre = (1 - ease.out(Math.min(1, p * 2))) * (big ? 10 : 7), a = p < 0.7 ? 1 : (1 - p) / 0.3, n = big ? 6 : 4, L = big ? 18 : 12;
  bx.globalAlpha = Math.max(0, a);
  for (let i = 0; i < n; i++) { const X = Math.round(x - L / 2 + i * (L / (n - 1))); bx.fillStyle = '#ffffff'; bx.fillRect(X, Math.round(y - 3 - abre), 2, 3); bx.fillRect(X + 1, Math.round(y + 1 + abre), 2, 3); bx.fillStyle = '#c8c0d8'; bx.fillRect(X, Math.round(y - 1 - abre), 2, 1); bx.fillRect(X + 1, Math.round(y + 1 + abre), 2, 1); }
  bx.globalAlpha = 1;
}
function dentinhos(x, y, n) { for (let i = 0; i < n; i++) { const ang = Math.random() * Math.PI * 2, s = rand(1, 2.6); part({ x, y, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s - 1, g: 0.12, life: 26, col: i % 3 ? '#f2ecdc' : '#ffd060', sz: 2 }); } }

// ---------- ARO DE DENTES ----------
golpeHumano = async function (m, t) {
  const [tx, ty] = unitCenter(t), dx = tx - 24 - m.x, [hx, hy] = maoHum(m), dyT = Math.min(0, ty - unitCenter(m)[1] + 4);
  // 1) o aro se forma: faíscas convergem e os dentes aparecem um a um
  sfx('rune');
  await tw(16, p => {
    m.sy = 1 - Math.sin(p * Math.PI) * 0.08; m.sx = 1 + Math.sin(p * Math.PI) * 0.05;
    for (let i = 0; i < 8; i++) { const ang = i / 8 * Math.PI * 2 + p * 2, r = 20 * (1 - ease.out(p)); bx.fillStyle = i % 2 ? '#ffd060' : '#fff0b0'; bx.fillRect(Math.round(hx + Math.cos(ang) * r), Math.round(hy + Math.sin(ang) * r), 1, 1); }
    luzMagia(hx, hy - 2, 12, '#ffe8c0', 0.4 * p);
    desenhaAro(hx, hy, 0, p, null, 1);
  });
  // 2) um brilho corre pelo fio
  sfx('select');
  await tw(8, p => desenhaAro(hx, hy, 0, 1, p, 1));
  m.sx = m.sy = 1;
  // 3) arrancada: poeira, fantasmas, aro inclinado para trás
  poeiraHum(m.x + m.ox, m.y, 6, -1);
  await tw(10, p => {
    m.ox = dx * ease.io(p); m.oy = dyT * ease.io(p) - Math.sin(p * Math.PI) * 7;
    if (Math.round(p * 10) % 2 === 0) fantasma(m, 0.45);
    const [ax, ay] = maoHum(m); desenhaAro(ax - 2, ay + 1, -0.9 * p, 1, null, 1);
    for (let i = 0; i < 3; i++) { bx.globalAlpha = 0.35; bx.fillStyle = '#ffe8c0'; bx.fillRect(Math.round(m.x + m.ox - 16 - i * 7), Math.round(m.y - 14 + i * 6), 8 + i * 2, 1); } bx.globalAlpha = 1;
  });
  const ok = await timedPrompt(t, 18);
  // 4) o corte
  sfx('hit'); hitstop(ok ? 9 : 5); bshake(ok ? 10 : 6, ok ? 3 : 2); flashW(ok ? 2 : 1);
  const d = hitFoe(m, t, ok ? 1.25 : 0.95, { el: 'corte', crit: ok });
  dentinhos(tx, ty, ok ? 14 : 8); burst(tx, ty, ok ? 16 : 10, ['#ffffff', '#ffd060', '#c8a040']);
  await tw(14, p => {
    crescente(tx - 6, ty - 2, 15, -2.4, 0.9, p, ok ? 4 : 3);
    mordidaMarca(tx, ty, p, ok);
    const [ax, ay] = maoHum(m); desenhaAro(ax, ay, -0.9 + 2.2 * ease.out(p), 1, null, 1);
  });
  if (ok && t.hp > 0) {
    // 5) certeiro: o segundo corte em X e a "boca" que fecha
    sfx('hit'); hitstop(5); bshake(6, 2);
    await tw(14, p => {
      crescente(tx + 6, ty - 2, 15, -0.7, 2.6, p, 3);
      const fecha = ease.in(Math.min(1, p * 1.6)), al = p < 0.7 ? 1 : (1 - p) / 0.3;
      bx.globalAlpha = Math.max(0, al); bx.strokeStyle = '#ffffff'; bx.lineWidth = 2;
      bx.beginPath(); bx.arc(tx, ty - 22 + fecha * 14, 16, 0.25 * Math.PI, 0.75 * Math.PI); bx.stroke();
      bx.beginPath(); bx.arc(tx, ty + 22 - fecha * 14, 16, 1.25 * Math.PI, 1.75 * Math.PI); bx.stroke(); bx.globalAlpha = 1;
    });
    if (G.flags) G.flags.aroCerto = true;
  }
  if (!G.flags.aroDentes) { G.flags.aroDentes = true; callout('Aro de Dentes: a borda da tampa, com os dentes no fio', '#ffe8c0', 110); }
  // 6) volta com mortal para trás; o aro se desfaz em poeira dourada
  await tw(16, p => {
    m.ox = dx * (1 - ease.out(p)); m.oy = dyT * (1 - ease.in(p)) - Math.sin(p * Math.PI) * 16; m.rot = -p * Math.PI * 2;
    if (p > 0.6) { const [ax, ay] = maoHum(m); desenhaAro(ax, ay, p * 6, 1, null, (1 - p) / 0.4); }
  });
  m.ox = 0; m.oy = 0; m.rot = 0;
  const [ax, ay] = maoHum(m); for (let i = 0; i < 10; i++) part({ forma: 'estrela', x: ax + rand(-8, 8), y: ay + rand(-6, 6), vy: -rand(0.3, 0.9), life: 24, col: '#ffd060' });
  poeiraHum(m.x, m.y, 4, 1);
  return d;
};

// ---------- GOLPE A DOIS ----------
function retratoHumano() { try { const A = rostoArte(); if (A && A.port) return Array.isArray(A.port) ? A.port[0] : A.port; } catch (e) { } return PT('me'); }
TECH2.golpeADois.run = async function (m, t) {
  const par = alive(BT.party).find(u => u.id === 'rita') || alive(BT.party).find(u => u.id === 'lume');
  if (!par) { await golpeHumano(m, t); return; }
  const [tx, ty] = unitCenter(t), dx = tx - 26 - m.x, dp = tx - 36 - par.x, comRita = par.id === 'rita', dyM = Math.min(0, ty - unitCenter(m)[1] + 4), dyP = Math.min(0, ty - unitCenter(par)[1] + 4);
  const pA = retratoHumano(), pB = PT(comRita ? 'rita' : 'lumeh');
  // 1) cut-in: faixa com os dois retratos
  sfx('rune');
  await tw(30, p => {
    const ent = ease.out(Math.min(1, p * 2.2)), sai = p > 0.8 ? ease.in((p - 0.8) / 0.2) : 0, H = 46, Y = 52;
    bx.globalAlpha = 0.55 * (1 - sai); bx.fillStyle = '#000'; bx.fillRect(-300, 0, 900, 240); bx.globalAlpha = 1 - sai;
    bx.fillStyle = '#120a1e'; bx.fillRect(-300, Y, 900, H); bx.fillStyle = '#ffd060'; bx.fillRect(-300, Y, 900, 1); bx.fillRect(-300, Y + H - 1, 900, 1);
    for (let i = 0; i < 26; i++) { const yy = Y + 3 + (i * 7) % (H - 6), xx = ((i * 53 + p * 900) % 700) - 250; bx.fillStyle = i % 3 ? 'rgba(255,232,192,0.25)' : 'rgba(255,208,96,0.5)'; bx.fillRect(Math.round(xx), yy, 20 + (i % 4) * 8, 1); }
    const sz = 40, xa = -60 + ent * 104, xb = 300 - ent * 104 - sz;
    if (pA) { bx.fillStyle = '#ffd060'; bx.fillRect(Math.round(xa) - 1, Y + 2, sz + 2, sz + 2); bx.drawImage(pA, Math.round(xa), Y + 3, sz, sz); }
    if (pB) { bx.fillStyle = comRita ? '#ff9a50' : '#ffe066'; bx.fillRect(Math.round(xb) - 1, Y + 2, sz + 2, sz + 2); bx.drawImage(pB, Math.round(xb), Y + 3, sz, sz); }
    bx.globalAlpha = 1;
    if (p > 0.25 && p < 0.85) { const tr = Math.sin(p * 60) * (p < 0.35 ? 2 : 0); txt('GOLPE A DOIS!', 120 + tr, Y + H + 4, { align: 'center', col: '#ffd060', sz: 1.5 }); }
  });
  // 2) corrida lado a lado
  poeiraHum(m.x, m.y, 5, -1); poeiraHum(par.x, par.y, 5, -1);
  await tw(12, p => {
    m.ox = dx * ease.io(p); par.ox = dp * ease.io(p); m.oy = dyM * ease.io(p) - Math.sin(p * Math.PI) * 8; par.oy = dyP * ease.io(p) - Math.sin(p * Math.PI) * 5;
    if (Math.round(p * 12) % 2 === 0) { fantasma(m, 0.4); fantasma(par, 0.4); }
    const [ax, ay] = maoHum(m); desenhaAro(ax - 2, ay, -0.9, 1, null, 1);
  });
  const ok = await timedPrompt(t, 18);
  // 3) o X: corte dele de cima para baixo, golpe do par de baixo para cima
  sfx('hit'); hitstop(10); bshake(12, 3); flashW(2);
  hitFoe(m, t, ok ? 1.1 : 0.85, { el: 'corte', crit: ok, brk: 1 });
  const X1 = p => { const L = 22 * ease.out(Math.min(1, p * 2)), al = p < 0.6 ? 1 : (1 - p) / 0.4; bx.globalAlpha = Math.max(0, al); for (const [w, c] of [[5, '#7a4a18'], [3, '#ffd060'], [1, '#ffffff']]) { bx.strokeStyle = c; bx.lineWidth = w; bx.beginPath(); bx.moveTo(tx - L, ty - L); bx.lineTo(tx + L, ty + L); bx.stroke(); } bx.globalAlpha = 1; };
  const X2 = (p, col) => { const L = 22 * ease.out(Math.min(1, p * 2)), al = p < 0.6 ? 1 : (1 - p) / 0.4; bx.globalAlpha = Math.max(0, al); for (const [w, c] of [[5, '#5a2a18'], [3, col], [1, '#ffffff']]) { bx.strokeStyle = c; bx.lineWidth = w; bx.beginPath(); bx.moveTo(tx - L, ty + L); bx.lineTo(tx + L, ty - L); bx.stroke(); } bx.globalAlpha = 1; };
  dentinhos(tx, ty, 10);
  await tw(10, p => { X1(p); mordidaMarca(tx, ty, p, true); });
  if (t.hp > 0) {
    sfx('hit');
    if (comRita) hitFoe(par, t, ok ? 1.15 : 0.9, { el: 'corte', crit: ok, brk: 1 });
    else hitFoe(par, t, ok ? 1.2 : 0.95, { el: 'luz', mag: true, brk: 1 });
  }
  // cacos do escudo, onda de choque
  for (let i = 0; i < 12; i++) part({ forma: 'cristal', x: tx + rand(-6, 6), y: ty + rand(-6, 6), vx: rand(-2.4, 2.4), vy: rand(-2.8, 0.5), g: 0.14, life: 30, col: i % 2 ? '#bff0ff' : '#ffffff', s: 3 });
  burst(tx, ty, 22, ['#ffffff', '#ffe8c0', comRita ? '#ff9a50' : '#ffe066']);
  await tw(16, p => {
    X1(0.3 + p * 0.7); X2(p, comRita ? '#ff9a50' : '#ffe066');
    fxRing(tx, ty, 6 + p * 34, '#ffffff', 1 - p); fxRing(tx, ty, 4 + p * 24, comRita ? '#ff9a50' : '#ffe066', 1 - p);
    if (!comRita) { const g = bx.createLinearGradient(tx, ty - 90, tx, ty); g.addColorStop(0, 'rgba(255,240,170,0)'); g.addColorStop(1, 'rgba(255,240,170,0.7)'); bx.globalAlpha = 1 - p; bx.fillStyle = g; bx.fillRect(tx - 7 + p * 3, ty - 90, 14 - p * 6, 90); bx.globalAlpha = 1; }
  });
  // 4) volta e toque de mãos no meio do caminho
  await tw(14, p => { m.ox = dx * (1 - ease.out(p)); par.ox = dp * (1 - ease.out(p)); m.oy = dyM * (1 - ease.in(p)) - Math.sin(p * Math.PI) * 10; par.oy = dyP * (1 - ease.in(p)) - Math.sin(p * Math.PI) * 10; });
  m.ox = par.ox = m.oy = par.oy = 0;
  const [ma] = unitCenter(m), [pa, pb] = unitCenter(par), mx = (ma + pa) / 2, my = pb - 6;
  sfx('select'); for (let i = 0; i < 12; i++) part({ forma: 'estrela', x: mx, y: my, vx: rand(-1.4, 1.4), vy: rand(-1.6, -0.3), g: 0.04, life: 26, col: i % 2 ? '#ffd060' : '#ffffff' });
  callout(comRita ? 'Toca aqui! (A Rita bate forte demais)' : 'A Lume bate na mão dele e ri', '#ffe8c0', 50);
};

// ---------- PASSO LIGEIRO ----------
TECH2.passoLigeiro.run = async function (m) {
  sfx('select'); m.st.esquiva = 2;
  const x0 = m.x;
  await tw(18, p => {
    const k = Math.sin(p * Math.PI * 3); m.ox = k * 10; m.oy = -Math.abs(k) * 4;
    if (Math.round(p * 18) % 3 === 0) fantasma(m, 0.5);
    const [x, y] = unitCenter(m); for (let i = 0; i < 4; i++) { bx.globalAlpha = (1 - p) * 0.5; bx.fillStyle = '#e8f4ff'; bx.fillRect(Math.round(x - 26 - i * 5 + p * 30), Math.round(y - 16 + i * 9), 10 + i * 3, 1); } bx.globalAlpha = 1;
  });
  m.ox = m.oy = 0;
  for (let i = 0; i < 6; i++) part({ forma: 'folha', x: m.x + rand(-8, 8), y: m.y - 2, vx: rand(-1, 1), vy: -rand(0.5, 1.3), g: 0.03, life: 34, col: i % 2 ? '#9be58a' : '#ffe8c0' });
  callout('Passo ligeiro: o próximo golpe erra', '#ffe8c0', 50);
  void x0;
};
// enquanto a esquiva dura: contorno tremulando e redemoinho no pé
{ const _du5 = drawUnit; drawUnit = function (u) {
  const r = _du5(u);
  if (u && u.side === 'p' && u.st && u.st.esquiva > 0 && u.hp > 0 && u._X != null) {
    const fr = unitFrame(u); if (fr) { const c = tingeRastro(fr, '#e8f4ff'), off = Math.round(Math.sin(BT.t * 0.4) * 2); bx.globalAlpha = 0.1 + 0.08 * Math.abs(Math.sin(BT.t * 0.15)); bx.drawImage(c, u._X + off - 4, u._Y, Math.round(u._fw * u._sx), Math.round(u._fh * u._sy)); bx.globalAlpha = 1; }
    for (let i = 0; i < 6; i++) { const ang = BT.t * 0.2 + i; bx.fillStyle = i % 2 ? 'rgba(232,244,255,0.7)' : 'rgba(155,229,138,0.6)'; bx.fillRect(Math.round(u.x + Math.cos(ang) * 9), Math.round(u.y - 2 + Math.sin(ang) * 2), 1, 1); }
  }
  return r;
}; }
// a esquiva: o golpe atravessa um fantasma e ele reaparece ao lado
{ const _hM5 = hurtMember; hurtMember = function (m, d0, o = {}) {
  if (m.hp > 0 && m.st && m.st.esquiva > 0 && BT._foe) {
    m.st.esquiva = 0; fantasma(m, 0.9); const [x, y] = unitCenter(m); popNum(x, y - 12, 'ESQUIVOU', '#e8f4ff'); sfx('select');
    for (let i = 0; i < 8; i++) part({ forma: 'estrela', x: x + rand(-6, 6), y: y + rand(-10, 6), vx: -rand(0.4, 1.2), life: 18, col: '#e8f4ff' });
    tw(14, p => { m.ox = -14 * Math.sin(p * Math.PI); m.oy = -Math.sin(p * Math.PI) * 4; }).then(() => { m.ox = 0; m.oy = 0; });
    return 0;
  }
  return _hM5(m, d0, o);
}; }

// ---------- MÃO FIRME ----------
TECH2.maoFirme.run = async function (m, t) {
  if (t === m) { callout('Segure a mão de outra pessoa', '#ff6b6b', 40); BT.tension += 20; return; }
  const [ax] = unitCenter(m), [bxp, byp] = unitCenter(t), ida = (bxp - ax) * 0.55;
  await tw(12, p => { m.ox = ida * ease.io(p); m.oy = -Math.sin(p * Math.PI) * 3; });
  sfx('heal');
  const [x1, y1] = maoHum(m), mx = (x1 + bxp) / 2, my = (y1 + byp) / 2 + 2;
  await tw(40, p => {
    // as mãos se encontram num brilho quente
    luzMagia(mx, my, 10 + Math.sin(p * Math.PI) * 8, '#ffd0a8', 0.75 * Math.sin(p * Math.PI) + 0.15);
    bx.fillStyle = '#e8b890'; bx.fillRect(Math.round(mx) - 3, Math.round(my) - 1, 3, 3); bx.fillStyle = '#d8a078'; bx.fillRect(Math.round(mx), Math.round(my) - 1, 3, 3);
    // fios de luz ondulando entre os dois
    for (let f = 0; f < 3; f++) for (let i = 0; i <= 12; i++) { const q = i / 12, X = x1 + (bxp - x1) * q, Y = y1 + (byp - y1) * q + Math.sin(q * Math.PI * 2 + p * 9 + f * 2) * (3 + f) * Math.sin(q * Math.PI); bx.globalAlpha = 0.5 * Math.sin(p * Math.PI); bx.fillStyle = f === 0 ? '#ffffff' : '#ffd0a8'; bx.fillRect(Math.round(X), Math.round(Y), 1, 1); }
    bx.globalAlpha = 1;
    if (Math.round(p * 40) % 6 === 0) fxRing(bxp, byp, 6 + p * 14, '#9be58a', 1 - p);
  });
  // pétalas (ou coraçõezinhos com a Lume)
  if (t.id === 'lume') for (let i = 0; i < 7; i++) { const sx = mx + rand(-10, 10); tw(36, p => { const y = my - p * 34 - i * 2, x = sx + Math.sin(p * 6 + i) * 3; bx.globalAlpha = 1 - p; bx.fillStyle = i % 2 ? '#ff7aa8' : '#ffd0e0'; bx.fillRect(Math.round(x) - 1, Math.round(y), 1, 1); bx.fillRect(Math.round(x) + 1, Math.round(y), 1, 1); bx.fillRect(Math.round(x) - 1, Math.round(y) + 1, 3, 1); bx.fillRect(Math.round(x), Math.round(y) + 2, 1, 1); bx.globalAlpha = 1; }); }
  else for (let i = 0; i < 8; i++) part({ forma: 'folha', x: mx + rand(-8, 8), y: my, vx: rand(-0.6, 0.6), vy: -rand(0.6, 1.4), g: 0.02, life: 36, col: i % 2 ? '#ffd0a8' : '#9be58a' });
  healUnit(t, Math.round(t.mhp * 0.15)); for (const q of ['queimado', 'frio', 'tonto', 'esquecido', 'molhado']) t.st[q] = 0; if (t.mmp) t.mp = Math.min(t.mmp, t.mp + 10);
  if (t.id === 'rita') { bshake(4, 1); await tw(14, p => { t.ox = Math.sin(p * 30) * 1.5; const [x, y] = unitCenter(m); bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(x + 8), Math.round(y - 20 + p * 6), 1, 2); bx.fillRect(Math.round(x + 7), Math.round(y - 19 + p * 6), 3, 2); }); t.ox = 0; }
  callout(t.id === 'lume' ? 'A luz dela fica mais quente' : t.id === 'rita' ? 'A Rita aperta de volta. Forte demais.' : 'Mão firme', '#ffd0a8', 60);
  await tw(12, p => { m.ox = ida * (1 - ease.io(p)); m.oy = -Math.sin(p * Math.PI) * 3; });
  m.ox = m.oy = 0;
};

// ---------- A TRANSFORMAÇÃO ----------
trocarForma = async function (m, volta) {
  const vira = !m.humano && !volta, [cx, cy] = unitCenter(m), base = m.y;
  const A = rostoArte(), corpo = A ? A.body[0] : null, bau0 = unitFrame(m);
  sfx('rune');
  if (vira) {
    // 1) o círculo da Runa do Rosto acende embaixo
    await tw(16, p => {
      const r = 6 + ease.out(p) * 16; bx.globalAlpha = p; bx.strokeStyle = '#ffd060'; bx.lineWidth = 1;
      bx.beginPath(); bx.ellipse(m.x, base, r, r * 0.3, 0, 0, Math.PI * 2); bx.stroke();
      for (let i = 0; i < 12; i++) { const ang = i / 12 * Math.PI * 2 + p * 3; bx.fillStyle = i % 3 ? '#ffe8c0' : '#ffffff'; bx.fillRect(Math.round(m.x + Math.cos(ang) * (r + 3)), Math.round(base + Math.sin(ang) * (r + 3) * 0.3), 1, 1); }
      bx.fillStyle = '#ffd060'; bx.fillRect(Math.round(m.x) - 3, Math.round(base) - 1, 1, 1); bx.fillRect(Math.round(m.x) + 3, Math.round(base) - 1, 1, 1); bx.fillRect(Math.round(m.x) - 2, Math.round(base) + 1, 5, 1);
      bx.globalAlpha = 1; m.sy = 1 - Math.sin(p * Math.PI) * 0.12;
    });
    // 2) coluna de luz; o baú se desfaz em faíscas e a pessoa aparece de baixo para cima
    m.alpha = 0; m.sy = 1;
    for (let i = 0; i < 16; i++) part({ forma: 'estrela', x: cx + rand(-10, 10), y: cy + rand(-6, 10), vy: -rand(0.6, 1.8), life: 30, col: i % 2 ? '#ffd060' : '#fff0b0' });
    await tw(26, p => {
      const g = bx.createLinearGradient(0, base - 80, 0, base); g.addColorStop(0, 'rgba(255,232,192,0)'); g.addColorStop(1, 'rgba(255,232,192,0.75)');
      const w = 14 + Math.sin(p * Math.PI) * 10; for (const [ww, al] of [[w + 10, 0.25], [w + 4, 0.5], [w, 0.8], [w * 0.4, 1]]) { bx.globalAlpha = Math.sin(p * Math.PI) * al; bx.fillStyle = g; bx.fillRect(Math.round(m.x - ww / 2), base - 80, Math.round(ww), 80); } bx.globalAlpha = 1;
      if (bau0 && p < 0.5) { const k = 1 - p / 0.5; bx.globalAlpha = k; const w2 = bau0.width * k, h2 = bau0.height * (0.6 + 0.4 * k); bx.drawImage(bau0, Math.round(m.x - w2 / 2), Math.round(base - h2), Math.round(w2), Math.round(h2)); bx.globalAlpha = 1; }
      if (corpo) { const rev = ease.out(Math.max(0, (p - 0.2) / 0.8)), h = corpo.height, w2 = corpo.width, vis = Math.round(h * rev); if (vis > 0) { bx.drawImage(corpo, 0, h - vis, w2, vis, Math.round(m.x - w2 / 2), base - vis, w2, vis); const c = whiteOf(corpo); bx.globalAlpha = 0.8 * (1 - rev); bx.drawImage(c, 0, h - vis, w2, vis, Math.round(m.x - w2 / 2), base - vis, w2, vis); bx.globalAlpha = 1; bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(m.x - w2 / 2), base - vis, w2, 1); } }
      if (Math.round(p * 26) % 3 === 0) part({ forma: 'gota', x: m.x + rand(-8, 8), y: base - rand(0, 10), vy: -rand(0.8, 1.6), life: 26, col: '#ffd060' });
    });
  } else {
    // a volta: a pessoa derrete em gotas e o baú cai no lugar
    const fr = unitFrame(m); m.alpha = 0;
    await tw(24, p => {
      if (fr) { const h = fr.height, w2 = fr.width, k = ease.in(p), hh = Math.max(1, Math.round(h * (1 - k * 0.85))); bx.globalAlpha = 1 - p * 0.6; bx.drawImage(fr, Math.round(m.x - w2 / 2 - k * 3), base - hh, Math.round(w2 + k * 6), hh); bx.globalAlpha = 1; }
      if (Math.round(p * 24) % 2 === 0) part({ forma: 'gota', x: m.x + rand(-9, 9), y: base - rand(10, 40) * (1 - p), vy: rand(0.6, 1.4), g: 0.1, life: 22, col: p < 0.5 ? '#ffe8c0' : '#ffd060' });
    });
  }
  // troca de verdade (números, ataque, técnicas, fôlego)
  m.humano = vira;
  if (m.humano) { m.spd += 4; m.mag += 3; m.def -= 4; m.humTurnos = typeof folegoForma === 'function' ? folegoForma() : 3; m.h = 48; m.atkNm0 = m.atkNm; m.atkNm = 'Aro de Dentes'; m.atkDesc0 = m.atkDesc; m.atkDesc = 'A borda da tampa vira um aro de metal na mão, com os dentes do baú no fio. Corta como quem morde. A quando o anel fechar = corte certeiro.'; m.attack0 = m.attack; m.attack = golpeHumano; m.techs0 = m.techs; m.techs = [...(m.techs || []).filter(k => !SO_BAU.includes(k)), ...SO_GENTE]; }
  else { m.spd -= 4; m.mag -= 3; m.def += 4; m.h = 26; if (m.atkNm0) m.atkNm = m.atkNm0; if (m.atkDesc0) m.atkDesc = m.atkDesc0; if (m.attack0) m.attack = m.attack0; if (m.techs0) { m.techs = m.techs0; m.techs0 = null; } m.st.esquiva = 0; }
  m.alpha = 1;
  if (m.humano) { flashW(1); for (let i = 0; i < 14; i++) part({ forma: 'estrela', x: cx + rand(-10, 10), y: cy + rand(-24, 6), vy: -0.5, life: 24, col: '#ffe8c0' }); }
  else { sfx('bump'); bshake(5, 2); await tw(14, p => { m.sy = 1 - Math.sin(p * Math.PI) * 0.3 * (1 - p); m.sx = 1 + Math.sin(p * Math.PI) * 0.2 * (1 - p); }); m.sx = m.sy = 1; poeiraHum(m.x - 6, m.y, 4, -1); poeiraHum(m.x + 6, m.y, 4, 1); }
  callout(m.humano ? m.name + ' toma forma humana' : m.name + ' volta a ser baú', '#ffe8c0', 50);
};
