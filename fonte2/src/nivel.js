// ================= NÍVEL E EXPERIÊNCIA =================
// (pedido do usuário: "adicione um sistema de lvl e xp, é algo muito importante em um rpg".)
// - Cada membro tem NÍVEL e XP (G.nv[id] = { lv, xp }). Toda luta vencida dá XP para o grupo inteiro (quem caiu
//   ganha metade). XP de cada inimigo: ENEMY2[id].xp, ou pela vida e ataque dele; chefes valem o dobro.
// - O nível substitui o antigo "poder" por capítulo: cada 3,3 níveis valem 1 de poder (mesma conta de antes), então
//   o balanceamento feito pelo robô continua valendo. Saves antigos começam no nível equivalente ao poder que tinham.
// - Freio de subida: quem está ACIMA do nível esperado para o capítulo ganha menos XP; quem está abaixo ganha mais.
//   Dá para treinar e ficar mais forte, mas o jogo não quebra.
// - Subir de nível cura 25% da vida e dos PM (regra da T1), toca uma fanfarra e mostra o que cresceu.
const XP_PODER = 3.3;
function xpProx(lv) { return 30 + 20 * lv; }
function nivelEsperado() { return Math.round(1 + ((G.poder || 0) + 0.8) * XP_PODER); }
function nvDe(id) {
  G.nv = G.nv || {};
  const piso = Math.max(1, Math.round(1 + (G.poder || 0) * XP_PODER) - 1);
  if (!G.nv[id]) G.nv[id] = { lv: piso, xp: 0 };
  if (G.nv[id].lv < piso) G.nv[id] = { lv: piso, xp: 0 };   // capítulo novo com o grupo muito para trás: alcança
  return G.nv[id];
}
function poderNivel(id) { return (nvDe(id).lv - 1) / XP_PODER; }
function xpInimigo(id) { const d = ENEMY2[id] || {}; if (d.xp) return d.xp; const b = Math.round((d.mhp || 100) / 18 + (d.atk || 10) * 0.6); return d.boss ? b * 2 : b; }
// o que cresce por nível (para mostrar na tela; a conta real é a do poder, em grupoAtual)
const NV_GANHO = { bau: 'PV +4  ATQ/MAG +0,6  DEF +0,3', lume: 'PV +3  ATQ/MAG +0,6  DEF +0,3', rita: 'PV +3  ATQ/MAG +0,6  DEF +0,3' };

// ---------- XP na vitória ----------
function darXP(party, foes) {
  const total = foes.reduce((a, f) => a + xpInimigo(f.id || f.kind), 0), out = [];
  for (const m of party) {
    const nv = nvDe(m.id), dif = nv.lv - nivelEsperado();
    const mult = Math.max(0.25, Math.min(1.5, 1 - dif * 0.2)) * (m.hp > 0 ? 1 : 0.5);
    const ganho = Math.max(1, Math.round(total * mult));
    const antes = { lv: nv.lv, xp: nv.xp }; let subiu = 0;
    nv.xp += ganho;
    while (nv.xp >= xpProx(nv.lv)) { nv.xp -= xpProx(nv.lv); nv.lv++; subiu++; }
    if (subiu) { m.hp = Math.min(m.mhp, Math.max(m.hp, 0) + Math.round(m.mhp * 0.25 * subiu)); m.mp = Math.min(m.mmp, m.mp + Math.round(m.mmp * 0.25 * subiu)); if (m.hp <= 0) m.hp = 1; }
    out.push({ m, antes, depois: { lv: nv.lv, xp: nv.xp }, ganho, subiu });
  }
  return { total, out };
}
{ const _vic = victory; victory = async function () {
  try { const foes = BT.foes.map(f => ({ id: Object.keys(ENEMY2).find(k => ENEMY2[k].name === f.name && ENEMY2[k].kind === f.kind) || f.kind })); BT.xpRes = darXP(BT.party, foes); }
  catch (e) { BT.xpRes = null; }
  BT.xpSom = false; BT.hint = null;
  return _vic();
}; }
// ---------- TELA DE VITÓRIA (refeita: pedido do usuário, "está bem fraquinha") ----------
// Raios girando atrás de um VITÓRIA! que cai letra por letra com quique; faixa dourada; confete; um cartão que sobe
// com as recompensas (cobres e XP contando), as estatísticas com ícones, cada membro com moldura, selo de nível e
// barra de XP com brilho correndo; "SUBIU!" com estrelas; e por fim a NOTA da luta (S, A, B, C) carimbada.
function notaLuta() {
  const s = BT.stats, nf = Math.max(1, BT.foes.length), tt = G.time - s.t0;
  const pts = (s.perf * 3 + s.crit * 2 + s.quebra * 2) / nf - tt / 90;
  return pts >= 7 ? 'S' : pts >= 4 ? 'A' : pts >= 2 ? 'B' : 'C';
}
const NOTA_COR = { S: ['#ffe066', '#c88a20'], A: ['#9be58a', '#3a9a4a'], B: ['#8fe3ff', '#3a6ab8'], C: ['#d0b8e8', '#6a5a80'] };
function iconeWin(k, x, y) {
  const P = (dx, dy, c) => { bx.fillStyle = c; bx.fillRect(x + dx, y + dy, 1, 1); };
  if (k === 'perf') { for (const [dx, dy] of [[2, 0], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [3, 3], [0, 4], [4, 4]]) P(dx, dy, '#ffe066'); }
  else if (k === 'crit') { for (let i = 0; i < 5; i++) P(i, 4 - i, '#ff9a6a'); P(0, 3, '#ff9a6a'); P(1, 4, '#ff9a6a'); }
  else if (k === 'quebra') { for (let i = 0; i < 5; i++) { P(0, i, '#8fe3ff'); P(4, i, '#8fe3ff'); } P(1, 0, '#8fe3ff'); P(3, 0, '#8fe3ff'); P(2, 1, '#ff6b6b'); P(2, 2, '#ff6b6b'); P(1, 3, '#ff6b6b'); }
  else if (k === 'tempo') { for (const [dx, dy] of [[1, 0], [2, 0], [3, 0], [0, 1], [4, 1], [0, 2], [2, 2], [4, 2], [0, 3], [4, 3], [1, 4], [2, 4], [3, 4]]) P(dx, dy, '#e8e0f0'); P(2, 1, '#e8e0f0'); P(3, 2, '#e8e0f0'); }
  else if (k === 'cobre') { bx.fillStyle = '#c87838'; bx.fillRect(x, y + 1, 6, 4); bx.fillRect(x + 1, y, 4, 6); bx.fillStyle = '#f0b060'; bx.fillRect(x + 1, y + 1, 3, 3); bx.fillStyle = '#ffe0a0'; bx.fillRect(x + 1, y + 1, 1, 1); }
  else if (k === 'xp') { bx.fillStyle = '#8fe3ff'; bx.fillRect(x + 2, y, 2, 6); bx.fillRect(x, y + 2, 6, 2); bx.fillStyle = '#ffffff'; bx.fillRect(x + 2, y + 2, 2, 2); }
}
drawWin = function () {
  const w = BT.win; w.t++;
  const R = BT.xpRes, t = w.t, L0 = -(BTV.ox || 0), RW = BTV.w || 240;
  if (!w.nota) { w.nota = notaLuta(); w.cobres = BT.foes.reduce((a, f) => { const k = Object.keys(ENEMY2).find(q => ENEMY2[q].name === f.name && ENEMY2[q].kind === f.kind); return a + ((k && ENEMY2[k].cobres) || 8); }, 0); w.conf = []; }
  // fundo escurecido + raios girando
  const a = Math.min(1, t / 18);
  bx.globalAlpha = 0.72 * a; bx.fillStyle = '#05030a'; bx.fillRect(L0, -40, RW, 340); bx.globalAlpha = 1;
  bx.save(); bx.translate(120, 40); bx.rotate(t * 0.006);
  for (let i = 0; i < 14; i++) { bx.rotate(Math.PI * 2 / 14); bx.globalAlpha = 0.10 * a; bx.fillStyle = i % 2 ? '#ffe066' : '#ff9a30'; bx.beginPath(); bx.moveTo(0, 0); bx.lineTo(-14, -190); bx.lineTo(14, -190); bx.fill(); }
  bx.restore(); bx.globalAlpha = 1;
  // confete
  if (t < 160 && t % 2 === 0) for (let i = 0; i < 2; i++) w.conf.push({ x: L0 + Math.random() * RW, y: -6, vy: 0.6 + Math.random() * 0.9, vx: (Math.random() - 0.5) * 0.6, c: pickOne(['#ffe066', '#ff6b9a', '#8fe3ff', '#9be58a', '#ffffff']), f: Math.random() * 6 });
  for (const c of w.conf) { c.y += c.vy; c.x += c.vx + Math.sin((t + c.f * 10) * 0.08) * 0.3; bx.fillStyle = c.c; const flip = Math.floor((t + c.f * 7) / 5) % 2; bx.fillRect(Math.round(c.x), Math.round(c.y), flip ? 2 : 1, flip ? 1 : 2); }
  w.conf = w.conf.filter(c => c.y < 250);
  // faixa dourada atrás do título
  const fa = ease.out(Math.min(1, Math.max(0, (t - 6) / 16)));
  if (fa > 0) { const fw = 170 * fa; bx.fillStyle = '#5a3a10'; bx.fillRect(120 - fw / 2 - 2, 28, fw + 4, 26); bx.fillStyle = '#c88a20'; bx.fillRect(120 - fw / 2, 30, fw, 22); bx.fillStyle = '#f0c050'; bx.fillRect(120 - fw / 2, 30, fw, 3); bx.fillStyle = '#8a5a18'; bx.fillRect(120 - fw / 2, 49, fw, 3);
    for (const sx of [-1, 1]) { const ex = 120 + sx * (fw / 2 + 2); bx.fillStyle = '#8a5a18'; bx.beginPath(); bx.moveTo(ex, 32); bx.lineTo(ex + sx * 12, 32); bx.lineTo(ex + sx * 6, 41); bx.lineTo(ex + sx * 12, 50); bx.lineTo(ex, 50); bx.fill(); } }
  // VITÓRIA! letra por letra, com quique
  const L = 'VITÓRIA!'.split(''), lw = 17, x0 = 120 - (L.length * lw) / 2 + lw / 2;
  L.forEach((ch, i) => { const tt = t - 4 - i * 3; if (tt < 0) return; const q = Math.min(1, tt / 12), bounce = q < 1 ? (1 - q) * -26 + Math.sin(q * Math.PI) * -6 : Math.sin((t + i * 6) * 0.08) * 1.2; txt(ch, x0 + i * lw, 30 + bounce, { align: 'center', sz: 2, col: '#fff4c0', shadow: true }); });
  if (t < 18) return;
  // cartão de recompensas sobe
  const ca = ease.out(Math.min(1, (t - 18) / 18)), CX = 22, CW = 196, CY = 58 + (1 - ca) * 140, CH = 132;
  bx.globalAlpha = ca; box(CX, CY, CW, CH); bx.globalAlpha = 1;
  if (ca < 1) return;
  // linha 1: recompensas contando
  const cnt = Math.min(1, (t - 36) / 30);
  iconeWin('cobre', CX + 12, CY + 9); txt('+' + Math.round(w.cobres * Math.max(0, cnt)) + ' cobres', CX + 22, CY + 8, { col: '#f0b060' });
  if (R) { iconeWin('xp', CX + 104, CY + 9); txt('+' + Math.round(R.total * Math.max(0, cnt)) + ' XP', CX + 114, CY + 8, { col: '#8fe3ff' }); }
  // linha 2: estatísticas com ícones
  const s = BT.stats, tt = Math.round(G.time - s.t0);
  [['perf', s.perf], ['crit', s.crit], ['quebra', s.quebra], ['tempo', `${Math.floor(tt / 60)}:${String(tt % 60).padStart(2, '0')}`]].forEach(([k, v], i) => { const x = CX + 12 + i * 40; iconeWin(k, x, CY + 25); txt(String(v), x + 8, CY + 23, { col: '#d8d0e8' }); });
  bx.fillStyle = 'rgba(143,227,216,0.25)'; bx.fillRect(CX + 8, CY + 37, CW - 16, 1);
  // membros
  if (R) {
    const p = Math.min(1, Math.max(0, (t - 44) / 60));
    R.out.forEach((o, i) => {
      const y = CY + 42 + i * 27, x = CX + 10;
      // moldura do retrato
      bx.fillStyle = o.m.col || '#8fe3ff'; bx.fillRect(x - 1, y - 1, 26, 26); bx.fillStyle = '#0a0612'; bx.fillRect(x, y, 24, 24);
      const P = typeof retratoCut === 'function' ? retratoCut(o.m) : PT(o.m.port); if (P) { bx.imageSmoothingEnabled = false; bx.drawImage(P, 0, 0, P.width, P.height, x, y, 24, 24); }
      const passos = o.subiu + (o.depois.xp / xpProx(o.depois.lv)) - (o.antes.xp / xpProx(o.antes.lv));
      const prog = (o.antes.xp / xpProx(o.antes.lv)) + passos * ease.out(p);
      const lvNow = o.antes.lv + Math.floor(prog + 1e-6), frac = prog - Math.floor(prog + 1e-6), subiuAgora = lvNow > o.antes.lv;
      txt(o.m.short || o.m.name, x + 30, y + 1, { col: '#ffffff' });
      // selo de nível
      const bxX = x + 128, gl = subiuAgora ? 0.5 + 0.5 * Math.sin(t * 0.25) : 0;
      bx.fillStyle = subiuAgora ? '#c88a20' : '#2a2440'; bx.fillRect(bxX, y, 44, 12); bx.fillStyle = subiuAgora ? `rgba(255,240,160,${gl})` : '#3a3458'; bx.fillRect(bxX, y, 44, 2);
      txt('Nv ' + lvNow, bxX + 22, y + 1, { align: 'center', col: subiuAgora ? '#fff4c0' : '#e8e0f0' });
      // barra de XP com brilho
      const bw = 112, by = y + 15;
      bx.fillStyle = '#0a0612'; bx.fillRect(x + 30, by, bw, 6);
      const fw = Math.round(bw * frac);
      bx.fillStyle = '#2a5a8a'; bx.fillRect(x + 30, by, fw, 6); bx.fillStyle = '#5aa8e0'; bx.fillRect(x + 30, by, fw, 3); bx.fillStyle = '#c8f0ff'; bx.fillRect(x + 30, by, fw, 1);
      const sh = (t * 3 + i * 40) % (bw + 30) - 15; if (sh > 0 && sh < fw) { bx.globalAlpha = 0.6; bx.fillStyle = '#ffffff'; bx.fillRect(x + 30 + sh, by, 3, 6); bx.globalAlpha = 1; }
      txt('+' + Math.round(o.ganho * ease.out(p)), x + 174, y + 12, { align: 'right', col: '#8fe3ff' });
      if (subiuAgora) {
        txt('SUBIU!', x + 90, y + 1, { col: '#ffe066', shadow: true });
        if (!o.tocou) { o.tocou = true; for (let j = 0; j < 10; j++) w.conf.push({ x: x + 12, y: y + 12, vy: -1 - Math.random() * 1.5, vx: (Math.random() - 0.5) * 2.5, c: j % 2 ? '#ffe066' : '#ffffff', f: j }); if (!BT.xpSom) { BT.xpSom = true; jingle && jingle('G5:2 C6:2 E6:2 G6:6', 220); } }
        for (let j = 0; j < 4; j++) { const ang = t * 0.1 + j * Math.PI / 2; bx.fillStyle = '#ffe066'; bx.fillRect(Math.round(x + 12 + Math.cos(ang) * 16), Math.round(y + 12 + Math.sin(ang) * 16), 1, 1); }
      }
    });
  }
  // NOTA da luta, carimbada no canto do cartão
  if (t > 112) {
    const q = Math.min(1, (t - 112) / 10), sc = 1 + (1 - ease.out(q)) * 2, nx = CX + CW - 16, ny = CY + 15, [c1, c2] = NOTA_COR[w.nota];
    if (!w.carimbo) { w.carimbo = true; sfx('crit'); }
    bx.save(); bx.translate(nx, ny); bx.rotate(-0.25 * q); bx.scale(sc, sc); bx.globalAlpha = q;
    bx.fillStyle = c2; bx.beginPath(); bx.arc(0, 0, 13, 0, Math.PI * 2); bx.fill(); bx.fillStyle = c1; bx.beginPath(); bx.arc(0, 0, 11, 0, Math.PI * 2); bx.fill(); bx.fillStyle = '#1a1028'; bx.beginPath(); bx.arc(0, 0, 9, 0, Math.PI * 2); bx.fill();
    bx.restore(); txt(w.nota, nx + 1, ny - 7, { align: 'center', sz: 1.5, col: c1, shadow: true, alpha: q });
  }
  if (t > 100 && t % 50 < 34) txt('A  continuar', 120, CY + CH - 13, { align: 'center', col: '#ffffff' });
};

// ---------- tela de status: nível e barra de XP (status3.js chama nvDe/xpProx) ----------
