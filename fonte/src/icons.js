// ================= ÍCONES DE EFEITO NA BATALHA =================
// Em vez de palavras soltas, cada efeito vira um ícone de pixel (10x10) animado.
// Os seus ficam numa faixa logo acima da caixa de texto; os dos inimigos, numa coluna ao lado do sprite.
const ICON = {
  // círculo mágico com runas girando, na cor do elemento
  selo(x, y, c) { const t = FRAME / 10; icRing(x + 5, y + 5, 5, c); icRing(x + 5, y + 5, 3, c); for (let i = 0; i < 4; i++) { const a = t + i * Math.PI / 2; icPx(x + 5 + Math.round(Math.cos(a) * 4), y + 5 + Math.round(Math.sin(a) * 4), '#ffffff'); } icPx(x + 5, y + 5, c); },
  poison(x, y) { icDrop(x, y, '#4a9a4a', '#9be58a'); },
  bleed(x, y) { icDrop(x, y, '#8a1a1a', '#ff6b6b'); },
  burn(x, y) { icFlame(x, y, '#c83838', '#ffb040'); },
  fury(x, y) { icFlame(x, y, '#c83838', '#ffb040'); icR(x + 8, y, 2, 2, '#ffe066'); },
  ice(x, y) { const c = '#8fe3ff'; icR(x + 4, y, 2, 10, c); icR(x, y + 4, 10, 2, c); for (let i = 1; i < 4; i++) { icPx(x + 4 - i, y + 4 - i, c); icPx(x + 5 + i, y + 4 - i, c); icPx(x + 4 - i, y + 5 + i, c); icPx(x + 5 + i, y + 5 + i, c); } icPx(x + 4, y + 4, '#ffffff'); },
  shield(x, y, c = '#9a93b0') { icR(x + 1, y, 8, 6, '#120e1a'); icR(x + 2, y + 1, 6, 5, c); icR(x + 2, y + 6, 6, 2, '#120e1a'); icR(x + 3, y + 6, 4, 1, c); icR(x + 4, y + 8, 2, 2, '#120e1a'); icR(x + 3, y + 1, 1, 4, '#ffffff'); },
  ghost(x, y) { icR(x + 2, y, 6, 9, '#c0b8d8'); icR(x + 1, y + 2, 8, 6, '#c0b8d8'); icPx(x + 3, y + 3, '#120e1a'); icPx(x + 6, y + 3, '#120e1a'); for (let i = 0; i < 3; i++) icPx(x + 2 + i * 3, y + 9, '#c0b8d8'); },
  atkUp(x, y) { const c = '#ff6b6b'; icR(x + 4, y + 2, 2, 8, c); for (let i = 0; i < 4; i++) icR(x + 4 - i, y + 1 + i, 2 + i * 2, 1, c); },
  stun(x, y) { const t = FRAME / 8; for (let i = 0; i < 3; i++) { const a = t + i * 2.1; icStar(x + 5 + Math.round(Math.cos(a) * 4), y + 5 + Math.round(Math.sin(a) * 2), '#ffe066'); } },
  frozen(x, y) { ICON.ice(x, y); },
  salt(x, y) { icR(x + 3, y, 4, 10, '#e8e4dc'); icR(x + 1, y + 3, 8, 4, '#e8e4dc'); icPx(x + 4, y + 2, '#ffffff'); icPx(x + 3, y + 7, '#9ab8c8'); icPx(x + 6, y + 5, '#9ab8c8'); },
  mine(x, y) { icR(x + 2, y + 3, 6, 6, '#3a3632'); icR(x + 3, y + 2, 4, 8, '#3a3632'); icR(x + 4, y, 2, 3, '#7a7068'); icPx(x + 4, y + 5, FRAME % 30 < 15 ? '#ff3030' : '#601010'); icPx(x + 5, y + 5, FRAME % 30 < 15 ? '#ff3030' : '#601010'); },
  blind(x, y) { icR(x, y + 3, 10, 4, '#3a2a5a'); icR(x + 2, y + 1, 6, 8, '#3a2a5a'); icPx(x + 3, y + 4, '#b48cf0'); icPx(x + 6, y + 5, '#b48cf0'); },
  confused(x, y) { icR(x + 1, y, 8, 7, '#ffffff'); icR(x + 2, y + 7, 2, 2, '#ffffff'); icR(x + 4, y + 1, 2, 1, '#120e1a'); icPx(x + 6, y + 2, '#120e1a'); icPx(x + 5, y + 3, '#120e1a'); icPx(x + 5, y + 5, '#120e1a'); },
  charge(x, y) { const c = FRAME % 20 < 12 ? '#ff6b6b' : '#ffe066'; icR(x + 2, y, 2, 7, c); icR(x + 6, y, 2, 7, c); icR(x + 2, y + 8, 2, 2, c); icR(x + 6, y + 8, 2, 2, c); },
  prophecy(x, y) { icR(x, y + 3, 10, 4, '#d0e8f0'); icR(x + 2, y + 2, 6, 6, '#d0e8f0'); icR(x + 3, y + 3, 4, 4, '#1c3058'); icR(x + 4, y + 4, 2, 2, '#7ad0f0'); },
  ticket(x, y) { icR(x, y + 2, 10, 6, '#e8dcc0'); icR(x + 3, y + 2, 1, 6, '#c83838'); icR(x + 5, y + 4, 4, 1, '#8a8099'); },
  guarded(x, y) { ICON.shield(x, y, '#6a7084'); },
  // jogador
  cloak(x, y) { icR(x + 2, y, 6, 10, '#3a2a5a'); icR(x + 1, y + 3, 8, 7, '#3a2a5a'); icR(x + 4, y + 2, 3, 3, '#b48cf0'); icPx(x + 5, y + 3, '#3a2a5a'); },
  silence(x, y) { icR(x + 1, y + 3, 8, 4, '#d0a8ff'); icR(x + 2, y + 4, 6, 2, '#3a2a5a'); for (let i = 0; i < 10; i++) icPx(x + i, y + i, '#ff6b6b'); },
  forget(x, y) { icR(x + 1, y + 1, 8, 6, '#8fe3ff'); icR(x + 2, y + 2, 6, 4, '#1c3058'); icPx(x + 4, y + 3, '#8fe3ff'); icPx(x + 5, y + 4, '#8fe3ff'); icR(x + 2, y + 8, 2, 2, '#8fe3ff'); icPx(x + 0, y + 9, '#8fe3ff'); },
  ink(x, y) { icR(x + 2, y + 2, 6, 6, '#5a6ad0'); icPx(x + 1, y + 4, '#5a6ad0'); icPx(x + 8, y + 5, '#5a6ad0'); icR(x + 4, y + 8, 1, 2, '#5a6ad0'); },
  net(x, y) { for (let i = 0; i < 10; i += 3) { icR(x + i, y, 1, 10, '#a89068'); icR(x, y + i, 10, 1, '#a89068'); } },
  orbit(x, y) { const a = FRAME / 8; icRing(x + 5, y + 5, 4, '#5a5070'); icStar(x + 5 + Math.round(Math.cos(a) * 4), y + 5 + Math.round(Math.sin(a) * 4), '#ffe066'); },
  starAlly(x, y) { icStar(x + 5, y + 5, '#ffe066'); icPx(x + 5, y + 1, '#ffe066'); icPx(x + 5, y + 9, '#ffe066'); icPx(x + 1, y + 5, '#ffe066'); icPx(x + 9, y + 5, '#ffe066'); },
  lid(x, y) { icR(x, y + 1, 10, 4, '#7a4a2a'); icR(x, y + 5, 10, 4, '#5a3420'); icR(x + 4, y + 4, 2, 2, '#f0c040'); icR(x, y + 4, 10, 1, '#120e1a'); },
  guild(x, y) { ICON.shield(x, y, '#c83838'); icPx(x + 5, y + 3, '#f0c040'); },
  bulwark(x, y) { ICON.shield(x, y, '#f0c040'); },
  frenzy(x, y) { icR(x + 1, y + 3, 8, 4, '#ffffff'); icR(x + 3, y + 3, 4, 4, '#c83838'); icR(x + 4, y + 4, 2, 2, '#120e1a'); for (const i of [1, 4, 7]) icPx(x + i, y + 1, '#c83838'); },
  reflect(x, y) { icR(x, y + 2, 10, 7, '#e8e4dc'); for (let i = 0; i < 5; i++) { icPx(x + i, y + 2 + i, '#8a8099'); icPx(x + 9 - i, y + 2 + i, '#8a8099'); } icPx(x + 5, y, '#ffe066'); },
  free(x, y) { icR(x + 1, y + 1, 8, 8, '#3a70c0'); icR(x + 1, y + 1, 1, 8, '#1c3058'); icR(x + 3, y + 3, 5, 1, '#e8dcc0'); icR(x + 3, y + 5, 4, 1, '#e8dcc0'); },
  flag(x, y) { icR(x + 1, y, 1, 10, '#a89068'); icR(x + 2, y, 7, 5, '#ff6b6b'); icR(x + 2, y + 1, 7, 1, '#ffb0b0'); },
  blood(x, y) { icDrop(x, y, '#5a0a0a', '#c83838'); icPx(x + 7, y + 1, '#c0a0f0'); },
  heal(x, y) { icR(x + 4, y + 1, 2, 8, '#9be58a'); icR(x + 1, y + 4, 8, 2, '#9be58a'); },
  crust(x, y) { ICON.salt(x, y); icR(x, y + 9, 10, 1, '#9ab8c8'); }
};
function icPx(x, y, c) { bx.fillStyle = c; bx.fillRect(x, y, 1, 1); }
function icR(x, y, w, h, c) { bx.fillStyle = c; bx.fillRect(x, y, w, h); }
function icRing(cx, cy, rr, c) { for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; icPx(cx + Math.round(Math.cos(a) * rr), cy + Math.round(Math.sin(a) * rr), c); } }
function icStar(x, y, c) { icPx(x, y, c); icPx(x - 1, y, c); icPx(x + 1, y, c); icPx(x, y - 1, c); icPx(x, y + 1, c); }
function icDrop(x, y, d, c) { icR(x + 4, y, 2, 2, c); icR(x + 3, y + 2, 4, 2, c); icR(x + 2, y + 4, 6, 4, c); icR(x + 3, y + 8, 4, 2, d); icPx(x + 3, y + 4, '#ffffff'); }
function icFlame(x, y, d, c) { icR(x + 2, y + 4, 6, 6, d); icR(x + 3, y + 2, 4, 6, c); icR(x + 4, y + (FRAME % 16 < 8 ? 0 : 1), 2, 3, c); icR(x + 4, y + 6, 2, 3, '#fff4c0'); }
// fundo escuro atrás de cada ícone, para ler bem em qualquer cenário
function iconAt(k, x, y, c) { icR(x - 1, y - 1, 12, 12, 'rgba(7,5,12,0.75)'); ICON[k](x, y, c); }
function enemyIcons(e, dx, dy, w, h) {
  const list = [];
  if (e.charge) list.push(['charge']);
  if (e.proph) list.push(['prophecy']);
  if (e.ticket) list.push(['ticket']);
  if (e.dot && e.dot.t > 0) list.push([e.dot.icon || 'bleed', e.dot.col || '#ff8fa8']);
  if (e.shell > 0) list.push(['shield']);
  if (e.hide > 0) list.push(['ghost']);
  if (e.atkBuff && e.atkBuff.t > 0) list.push(['atkUp']);
  if (e.stunned) list.push(['stun']);
  if (e.frozen > 0) list.push(['frozen']);
  if (e.corrode > 0) list.push(['salt']);
  if (e.mine > 0) list.push(['mine']);
  if (e.blinded) list.push(['blind']);
  if (e.confused > 0) list.push(['confused']);
  if (!e.d.guardian && BT.en.some(g => g !== e && g.alive && g.hp > 0 && g.d.guardian)) list.push(['guarded']);
  // colunas de até 3 ícones à direita do sprite
  list.slice(0, 6).forEach(([k, c], i) => iconAt(k, Math.min(228, Math.round(dx + w + 2) + Math.floor(i / 3) * 12), Math.max(2, dy) + (i % 3) * 12, c));
}
function playerIcons() {
  const L = [];
  if (BT.buff.atkT > 0) L.push('fury');
  if (BT.buff.defT > 0 && BT.buff.defM < 1) L.push('ice');
  if (BT.dark > 0) L.push('cloak');
  if (BT.saltCrust > 0) L.push('crust');
  if (BT.stance > 0) L.push('lid');
  if (BT.guildShield > 0) L.push('guild');
  if (BT.bulwark > 0) L.push('bulwark');
  if (BT.frenzy > 0) L.push('frenzy');
  if (BT.orbit > 0) L.push('orbit');
  if (BT.star > 0) L.push('starAlly');
  if (BT.starHeal > 0) L.push('heal');
  if (BT.reflect > 0) L.push('reflect');
  if (BT.freeSpell > 0) L.push('free');
  if (BT.magT > 0) L.push('flag');
  if (BT.bloodM > 1) L.push('blood');
  const ps = BT.ps || {};
  if (ps.poison > 0) L.push('poison'); if (ps.burn > 0) L.push('burn'); if (ps.silence > 0) L.push('silence'); if (ps.forget > 0) L.push('forget');
  if (BT.inked) L.push('ink'); if (BT.netted) L.push('net');
    // em cima do baú, em fileiras de 7 (de baixo para cima)
  L.slice(0, 14).forEach((k, i) => iconAt(k, 4 + (i % 7) * 12, BPY - 48 - Math.floor(i / 7) * 12, null));
}
