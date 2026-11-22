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
  BT.xpSom = false;
  return _vic();
}; }
// tela de vitória com as barras de XP enchendo
drawWin = function () {
  const w = BT.win; w.t++;
  const a = Math.min(1, w.t / 20), R = BT.xpRes;
  bx.globalAlpha = 0.6 * a; bx.fillStyle = '#05030a'; bx.fillRect(-400, 30, 1200, 170); bx.globalAlpha = 1;
  txt('VITÓRIA!', 120, 38 - (1 - a) * 20, { align: 'center', sz: 2, col: '#ffe066', shadow: true, alpha: a });
  const s = BT.stats, tt = Math.round(G.time - s.t0);
  if (w.t > 20) txt(`Perfeitos ${s.perf}  ·  Certeiros ${s.crit}  ·  Quebras ${s.quebra}  ·  ${Math.floor(tt / 60)}:${String(tt % 60).padStart(2, '0')}`, 120, 64, { align: 'center', col: '#b8aecb' });
  if (R && w.t > 26) {
    txt(`+${R.total} XP`, 120, 78, { align: 'center', col: '#8fe3ff', shadow: true });
    const p = Math.min(1, Math.max(0, (w.t - 36) / 60));            // animação das barras
    R.out.forEach((o, i) => {
      const y = 96 + i * 30, x = 30;
      const P = PT(o.m.port); if (P) { bx.imageSmoothingEnabled = false; bx.drawImage(P, 0, 0, 32, 32, x, y - 2, 22, 22); }
      // nível mostrado: sobe no meio da animação se teve subida
      const passos = o.subiu + (o.depois.xp / xpProx(o.depois.lv)) - (o.antes.xp / xpProx(o.antes.lv));
      const prog = (o.antes.xp / xpProx(o.antes.lv)) + passos * ease.out(p);
      const lvNow = o.antes.lv + Math.floor(prog + 1e-6), frac = prog - Math.floor(prog + 1e-6);
      txt(o.m.short || o.m.name, x + 28, y, { col: '#ffffff' });
      txt('Nv ' + lvNow, x + 150, y, { align: 'right', col: lvNow > o.antes.lv ? '#ffe066' : '#e8e0f0', sz: lvNow > o.antes.lv ? 1.25 : 1 });
      const bw = 150, by = y + 13;
      bx.fillStyle = '#0a0612'; bx.fillRect(x + 28, by, bw, 5);
      bx.fillStyle = '#3a6a9a'; bx.fillRect(x + 28, by, Math.round(bw * frac), 5);
      bx.fillStyle = '#8fe3ff'; bx.fillRect(x + 28, by, Math.round(bw * frac), 2);
      txt('+' + o.ganho, x + 186, y + 9, { col: '#8fe3ff' });
      if (lvNow > o.antes.lv) {
        const k = (w.t % 40) / 40;
        txt('SUBIU!', x + 74, y, { col: '#ffe066', shadow: true, alpha: 0.7 + 0.3 * Math.sin(w.t * 0.3) });
        for (let j = 0; j < 3; j++) { const ang = (w.t * 0.08 + j * 2.1 + i); bx.fillStyle = j % 2 ? '#ffe066' : '#ffffff'; bx.fillRect(Math.round(x + 11 + Math.cos(ang) * 14), Math.round(y + 9 + Math.sin(ang) * 12 - k * 4), 1, 1); }
        if (!o.tocou) { o.tocou = true; if (!BT.xpSom) { BT.xpSom = true; jingle && jingle('G5:2 C6:2 E6:2 G6:6', 220); } }
      }
    });
    if (p >= 1 && R.out.some(o => o.subiu)) txt('Vida e PM: +25% por nível subido', 120, 96 + R.out.length * 30, { align: 'center', col: '#9be58a' });
  }
  if (w.t > 100 && w.t % 50 < 34) txt('A', 120, 210, { align: 'center', col: '#ffffff' });
};

// ---------- tela de status: nível e barra de XP (status3.js chama nvDe/xpProx) ----------
