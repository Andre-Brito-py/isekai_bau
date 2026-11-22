// ================= MENU CIRCULAR DE BATALHA =================
// (pedido do usuário: "sinto falta daquele menu circular... refazer de forma profissional, o mais bonito possível".)
// Os comandos viram MEDALHÕES num anel em volta de quem está na vez. O anel GIRA para trazer o escolhido para a
// frente (o lado dos inimigos), com mola suave. Atrás: um halo escuro com furo no meio (o personagem continua à
// vista), dois aros finos com marcas de runa girando devagar em sentidos opostos, e um ponteiro de luz do centro até
// o medalhão escolhido. O escolhido cresce, ganha um aro na cor do personagem e um brilho que respira; o SUPER
// cintila em dourado quando está cheio; o que não dá para usar fica apagado. Abaixo do anel, uma fita com o nome do
// comando e setinhas. Ao abrir, os medalhões saem do centro um por um.
// Controles: cima/esquerda = anterior, baixo/direita = próximo (o anel gira), A escolhe, B nada (como antes).
// As listas de Técnicas, Runas e Itens continuam no painel da direita (é onde ler texto comprido é confortável).
const RAD = { R: 32 };
function radialCentro(m, OX) {
  const x = OX + m.x + (m.ox || 0), y = (BTV.dy || 24) + m.y - (m.h || 40) * 0.55;
  const L = OX + RAD.R + 16, Rt = OX + 240 - RAD.R - 16;
  return [Math.max(L, Math.min(Rt, x)), Math.max(40 + RAD.R, y), x, y];
}
function medalhao(x, y, r, o) {
  // corpo
  bx.globalAlpha = o.a;
  bx.fillStyle = '#05030a'; bx.beginPath(); bx.arc(x, y + 1, r + 1, 0, Math.PI * 2); bx.fill();                  // sombra
  const g = bx.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r);
  g.addColorStop(0, o.dis ? '#2a2636' : '#2e2448'); g.addColorStop(1, o.dis ? '#0e0c14' : '#120c1e');
  bx.fillStyle = g; bx.beginPath(); bx.arc(x, y, r, 0, Math.PI * 2); bx.fill();
  // aro
  bx.lineWidth = o.sel ? 2 : 1; bx.strokeStyle = o.dis ? '#4a4658' : o.sel ? o.col : 'rgba(143,227,216,0.75)';
  bx.beginPath(); bx.arc(x, y, r - (o.sel ? 1 : 0.5), 0, Math.PI * 2); bx.stroke();
  // brilho de vidro no alto
  bx.strokeStyle = 'rgba(255,255,255,0.22)'; bx.lineWidth = 1; bx.beginPath(); bx.arc(x, y, r - 3, Math.PI * 1.1, Math.PI * 1.55); bx.stroke();
  // ícone
  const ic = o.ic && ICON[o.ic];
  if (ic) { bx.globalAlpha = o.a * (o.dis ? 0.35 : 1); const s = o.sel ? 1 : 1; bx.drawImage(ic, Math.round(x - ic.width * s / 2), Math.round(y - ic.height * s / 2), Math.round(ic.width * s), Math.round(ic.height * s)); }
  bx.globalAlpha = 1;
}
drawComandos = (function (_lista) {
  return function (M, OX, lados) {
    if (BT.sub) return _lista(M, OX, lados);
    const m = M.m, cs = cmdsFor(m), n = cs.length, step = Math.PI * 2 / n, col = m.col || UIC.accent;
    // abertura e giro com mola
    if (M._rm !== m) { M._rm = m; M.open = 0; M.ang = -M.idx * step - 0.9; M.av = 0; }
    M.open = Math.min(1, (M.open || 0) + 0.085);
    let alvo = -M.idx * step; while (alvo - M.ang > Math.PI) alvo -= Math.PI * 2; while (alvo - M.ang < -Math.PI) alvo += Math.PI * 2;
    M.av = (M.av || 0) * 0.62 + (alvo - M.ang) * 0.16; M.ang += M.av;
    const [cx, cy, ux, uy] = radialCentro(m, OX), op = ease.out(M.open), R = RAD.R * (0.35 + 0.65 * ease.back(Math.min(1, M.open)));
    const t = BT.t;
    // halo escuro com furo no meio
    const hg = bx.createRadialGradient(cx, cy, R * 0.45, cx, cy, R + 22);
    hg.addColorStop(0, 'rgba(5,3,10,0)'); hg.addColorStop(0.45, `rgba(5,3,10,${0.5 * op})`); hg.addColorStop(1, 'rgba(5,3,10,0)');
    bx.fillStyle = hg; bx.beginPath(); bx.arc(cx, cy, R + 22, 0, Math.PI * 2); bx.fill();
    // amarra até o personagem quando o anel foi empurrado para dentro da tela
    if (Math.hypot(ux - cx, uy - cy) > 4) { bx.globalAlpha = 0.5 * op; bx.strokeStyle = col; bx.setLineDash([2, 2]); bx.beginPath(); bx.moveTo(ux, uy); bx.lineTo(cx, cy); bx.stroke(); bx.setLineDash([]); bx.globalAlpha = 1; }
    // aros com marcas de runa girando em sentidos opostos
    bx.globalAlpha = 0.55 * op; bx.strokeStyle = UIC.line; bx.lineWidth = 1;
    bx.beginPath(); bx.arc(cx, cy, R + 13, 0, Math.PI * 2); bx.stroke();
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + t * 0.004; const l = i % 6 === 0 ? 4 : 2; bx.beginPath(); bx.moveTo(cx + Math.cos(a) * (R + 13), cy + Math.sin(a) * (R + 13)); bx.lineTo(cx + Math.cos(a) * (R + 13 + l), cy + Math.sin(a) * (R + 13 + l)); bx.stroke(); }
    // arco de TENSÃO no aro de fora (cheio = SUPER pronto)
    const tf = Math.min(1, BT.tension / 100);
    if (tf > 0) { bx.globalAlpha = 0.9 * op; bx.strokeStyle = tf >= 1 ? (t % 20 < 10 ? '#ffe066' : '#fff4c0') : '#ffa94d'; bx.lineWidth = 2; bx.beginPath(); bx.arc(cx, cy, R + 16, -Math.PI / 2, -Math.PI / 2 + tf * Math.PI * 2); bx.stroke(); bx.lineWidth = 1; }
    bx.strokeStyle = '#c8a04a'; bx.globalAlpha = 0.45 * op; bx.setLineDash([3, 4]); bx.lineDashOffset = -t * 0.3;
    bx.beginPath(); bx.arc(cx, cy, R - 12, 0, Math.PI * 2); bx.stroke(); bx.setLineDash([]); bx.lineDashOffset = 0;
    for (let i = 0; i < 6; i++) { const a = -i / 6 * Math.PI * 2 - t * 0.006; bx.fillStyle = '#c8a04a'; bx.fillRect(Math.round(cx + Math.cos(a) * (R - 12)) - 1, Math.round(cy + Math.sin(a) * (R - 12)) - 1, 2, 2); }
    bx.globalAlpha = 1;
    // ponteiro de luz até o escolhido
    const aSel = M.ang + M.idx * step, sx0 = cx + Math.cos(aSel) * R, sy0 = cy + Math.sin(aSel) * R;
    const pg = bx.createLinearGradient(cx, cy, sx0, sy0); pg.addColorStop(0, 'rgba(255,255,255,0)'); pg.addColorStop(1, col);
    bx.globalAlpha = 0.55 * op; bx.strokeStyle = pg; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(cx + Math.cos(aSel) * 6, cy + Math.sin(aSel) * 6); bx.lineTo(sx0, sy0); bx.stroke(); bx.globalAlpha = 1; bx.lineWidth = 1;
    // medalhões (o escolhido por último, por cima)
    const ord = cs.map((c, i) => i).sort((a, b) => (a === M.idx) - (b === M.idx));
    for (const i of ord) {
      const c = cs[i], abre = Math.max(0, Math.min(1, M.open * 1.6 - i * 0.08)), a = M.ang + i * step;
      const rr = R * ease.out(abre), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      const sel = i === M.idx, dis = !!(c.need && !c.need()), sup = c.k === 'super';
      const r = sel ? 11 + Math.sin(t * 0.12) * 0.6 : 8;
      if (sel) { const gg = bx.createRadialGradient(x, y, r * 0.6, x, y, r + 9); gg.addColorStop(0, col + '88'); gg.addColorStop(1, col + '00'); bx.fillStyle = gg; bx.beginPath(); bx.arc(x, y, r + 9, 0, Math.PI * 2); bx.fill(); }
      if (sup && !dis) { for (let k = 0; k < 4; k++) { const sa = t * 0.08 + k * Math.PI / 2; bx.fillStyle = k % 2 ? '#ffffff' : '#ffe066'; bx.fillRect(Math.round(x + Math.cos(sa) * (r + 4)), Math.round(y + Math.sin(sa) * (r + 4)), 1, 1); } }
      medalhao(x, y, r, { a: abre, sel, dis, ic: c.ic(m), col: sup && !dis ? '#ffe066' : col });
    }
    // fita com o nome do escolhido
    const c = cs[M.idx], nm = c.k === 'atacar' ? (m.atkNm || 'Atacar') : c.nmF ? c.nmF(m) : c.nm, dis = !!(c.need && !c.need());
    const lw = lineW(rich(nm)) + 26, ly = cy + R + 20 > (BTV.lados ? 196 : 160) ? cy - R - 30 : cy + R + 17, lx = cx - lw / 2;
    bx.globalAlpha = op;
    bx.fillStyle = '#05030a'; bx.fillRect(Math.round(lx) - 1, Math.round(ly) - 1, Math.round(lw) + 2, 14);
    bx.fillStyle = dis ? '#2a2636' : '#1a1230'; bx.fillRect(Math.round(lx), Math.round(ly), Math.round(lw), 12);
    bx.fillStyle = dis ? '#4a4658' : col; bx.fillRect(Math.round(lx), Math.round(ly), Math.round(lw), 1); bx.fillRect(Math.round(lx), Math.round(ly) + 11, Math.round(lw), 1);
    for (const s of [-1, 1]) { const ax = s < 0 ? lx + 5 : lx + lw - 6, ay = ly + 6, o = Math.round(Math.sin(t * 0.15) * (s * 0.8)); bx.fillStyle = UIC.line; for (let k = 0; k < 3; k++) bx.fillRect(Math.round(ax + o - s * k), Math.round(ay - k), 1, k * 2 + 1); }
    bx.globalAlpha = 1;
    txt(nm, cx, ly + 1, { align: 'center', col: dis ? '#6a6680' : '#ffffff', alpha: op });
    // de quem é a vez, discreto, do outro lado do anel
    const vy = ly > cy ? cy - R - 24 : Math.max(2, ly - 12);   // nunca embaixo do anel (lá fica a caixa de descrição)
    txt('Vez de ' + (m.short || m.name), cx, vy, { align: 'center', col: col, alpha: 0.85 * op, shadow: true });
  };
})(drawComandos);
// esquerda/direita também giram o anel
{ const _mi = menuInput; menuInput = function () {
  const M = BT.menu;
  if (M && !M.hidden && !BT.busy && !UI.top() && !BT.cursor && !BT.sub) {
    const cs = cmdsFor(M.m);
    if (navp('right')) { M.idx = (M.idx + 1) % cs.length; sfx('move'); return; }
    if (navp('left')) { M.idx = (M.idx + cs.length - 1) % cs.length; sfx('move'); return; }
  }
  return _mi();
}; }
