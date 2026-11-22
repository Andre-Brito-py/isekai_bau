// ================= TELA DE STATUS DO GRUPO =================
// MENU > Grupo abre uma ficha bonita por personagem: retrato grande num pedestal de runas, função, vida e PM, os
// atributos com barrinhas, o equipamento de cada encaixe (com o efeito) e as habilidades. < > troca de personagem.
const ST3_NOMES = { atk: 'ATAQUE', def: 'DEFESA', mag: 'MAGIA', mdef: 'RESIST.', spd: 'VELOC.' };
const ST3_SLOT = { arma: 'Arma', roupa: 'Roupa', amuleto: 'Amuleto' };
function funcaoDe(m) {
  if (m.id === 'rita') return 'Escudeira de lança';
  if (m.id === 'lume') return LUSTRE_ON() ? 'Lustre: magia forte' : 'Cantora: cura e luz';
  const nm = (HARTE.species && HARTE.species[G.species] && HARTE.species[G.species].name) || 'Baú';
  return nm + (deRosto() ? ' · de rosto' : '');
}
function imagemDe(m) {
  try {
    if (m.id === 'bau') { const C = IMG.chest[G.species] || IMG.chest.caixote; return C && (C.three || C.closed); }
    if (m.id === 'lume' && LUSTRE_ON() && typeof lustreFrame === 'function') return lustreFrame(FRAME);
    const k = m.id === 'lume' ? 'lumeh' : m.id, F = IMG.sp[k];
    if (F && F.length) return F[Math.floor(FRAME / 26) % F.length];
    const S = IMG.spf[k]; return S && S.s ? S.s[0] : PT(m.port);
  } catch (e) { return PT(m.port); }
}
function habilidadesDe(m) {
  const L = [];
  if (m.atkNm) L.push(m.atkNm);
  for (const k of m.runas || []) if (RUNA2[k]) L.push(RUNA2[k].nm);
  for (const k of m.techs || []) if (TECH2[k]) L.push(TECH2[k].nm);
  if (m.superNm) L.push('SUPER: ' + m.superNm);
  return L;
}
function telaStatus() {
  const g = grupoAtual(); let i = 0, t = 0, mudou = 0;
  const w = {
    type: 'status',
    update() {
      t++;
      if (btnp('left')) { i = (i + g.length - 1) % g.length; mudou = t; sfx('select'); }
      if (btnp('right')) { i = (i + 1) % g.length; mudou = t; sfx('select'); }
      if (btnp('b') || btnp('a')) { sfx('cancel'); closeWin(this); }
    },
    draw() {
      const m = g[i], X = 4, Y = 4, Wd = 232, Hd = 232, k = Math.min(1, (t - mudou) / 10);
      bx.globalAlpha = 0.7; bx.fillStyle = '#05030a'; bx.fillRect(-400, -10, 1200, 300); bx.globalAlpha = 1;
      bx.fillStyle = '#0e0a1a'; bx.fillRect(X + 2, Y + 2, Wd - 4, Hd - 4); box(X, Y, Wd, Hd);
      // abas com os retratos
      g.forEach((u, j) => { const x = X + 8 + j * 30, y = Y + 7, sel = j === i; bx.fillStyle = sel ? UIC.accent : 'rgba(143,227,216,0.25)'; bx.fillRect(x - 1, y - 1, 26, 26); bx.fillStyle = '#0a0612'; bx.fillRect(x, y, 24, 24); const P = PT(u.port); if (P) bx.drawImage(P, 0, 0, P.width, P.height, x, y, 24, 24); if (!sel) { bx.globalAlpha = 0.45; bx.fillStyle = '#0a0612'; bx.fillRect(x, y, 24, 24); bx.globalAlpha = 1; } });
      txt(m.name, X + 104, Y + 8, { col: '#ffffff', sz: 1.5 });
      txt(funcaoDe(m), X + 104, Y + 26, { col: UIC.line });
      // pedestal com círculo de runas e o personagem grande
      const cx = X + 46, cy = Y + 150;
      bx.globalAlpha = 0.35; bx.fillStyle = m.col || UIC.line; bx.beginPath(); bx.ellipse(cx, cy, 34, 9, 0, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
      for (let a = 0; a < 12; a++) { const ang = a / 12 * Math.PI * 2 + t * 0.01; bx.fillStyle = a % 3 ? 'rgba(143,227,216,0.6)' : m.col || '#ffe066'; bx.fillRect(Math.round(cx + Math.cos(ang) * 30), Math.round(cy + Math.sin(ang) * 7), 2, 1); }
      for (let n = 0; n < 6; n++) { const yy = cy - ((t * 0.6 + n * 22) % 110); bx.globalAlpha = 0.5 * (1 - (cy - yy) / 110); bx.fillStyle = m.col || '#ffe066'; bx.fillRect(Math.round(cx - 26 + n * 10), Math.round(yy), 1, 2); } bx.globalAlpha = 1;
      const img = imagemDe(m);
      if (img) { const esc = Math.min(2, 96 / img.height, 76 / img.width) * (0.92 + 0.08 * k), w2 = Math.round(img.width * esc), h2 = Math.round(img.height * esc), bob = Math.round(Math.sin(t * 0.06) * 1.5); bx.globalAlpha = k; bx.drawImage(img, Math.round(cx - w2 / 2), Math.round(cy - h2 + 2 + bob), w2, h2); bx.globalAlpha = 1; }
      // vida e PM
      const rx = X + 100, bw = 120;
      const barra = (y, nm, v, mx, c1, c2) => { txt(nm, rx, y, { col: '#b8aecb' }); txt(`${v}/${mx}`, rx + bw, y, { align: 'right', col: '#ffffff' }); bx.fillStyle = '#0a0612'; bx.fillRect(rx, y + 12, bw, 5); bx.fillStyle = c2; bx.fillRect(rx, y + 12, Math.round(bw * Math.max(0, v) / Math.max(1, mx)), 5); bx.fillStyle = c1; bx.fillRect(rx, y + 12, Math.round(bw * Math.max(0, v) / Math.max(1, mx)), 2); };
      const pt = (G.pt && G.pt[m.id]) || {}, hp = pt.hp ?? m.mhp, mp = pt.mp ?? m.mmp;
      barra(Y + 44, 'VIDA', Math.round(hp), m.mhp, '#9be58a', '#3a9a4a');
      if (m.mmp) barra(Y + 66, 'PM', Math.round(mp), m.mmp, '#8fe3ff', '#3a6ab8');
      // atributos
      let y = Y + 90;
      for (const s of ['atk', 'def', 'mag', 'mdef', 'spd']) { const v = m[s] ?? 0; txt(ST3_NOMES[s], rx, y, { col: '#b8aecb' }); txt(String(v), rx + 66, y, { align: 'right', col: '#ffffff' }); bx.fillStyle = 'rgba(143,227,216,0.15)'; bx.fillRect(rx + 72, y + 4, 48, 4); bx.fillStyle = s === 'atk' ? '#ff9a50' : s === 'def' ? '#8fb0ff' : s === 'mag' ? '#d0a8ff' : s === 'mdef' ? '#8fe3d8' : '#ffe066'; bx.fillRect(rx + 72, y + 4, Math.min(48, Math.round(v / 36 * 48)), 4); y += 12; }
      // embaixo: equipamento (esquerda) e habilidades (direita)
      const corta = (str, n) => str.length > n ? str.slice(0, n - 1) + '.' : str;
      bx.fillStyle = 'rgba(143,227,216,0.25)'; bx.fillRect(X + 8, Y + 162, Wd - 16, 1);
      let ey = Y + 168; txt('EQUIPAMENTO', X + 10, ey, { col: UIC.accent }); ey += 12;
      const eq = eqOf(m.id);
      for (const sl of ['arma', 'roupa', 'amuleto']) { const it = eq[sl] && EQ2[eq[sl]]; txt(ST3_SLOT[sl].slice(0, 4), X + 10, ey, { col: '#8a8099' }); txt(it ? corta(it.nm, 13) : '—', X + 38, ey, { col: it ? '#ffe8b0' : '#5a5068' }); ey += 11; }
      const hab = habilidadesDe(m); let hy = Y + 168; txt('HABILIDADES', X + 120, hy, { col: UIC.accent }); hy += 12;
      for (const h of hab.slice(0, 4)) { txt(corta(h, 17), X + 120, hy, { col: '#e8e0f0' }); hy += 11; }
      // rodapé

    }
  };
  return openWin(w);
}
