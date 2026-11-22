// ================= INIMIGOS DO CAP. 2: Bairro Afogado, Guilda dos Caçadores e a ÂNCORA-MÃE =================
// Lambe-Lodo (rouba PM), Caranguejo-Telha (casco: escudo alto), Sapo-Sino (deixa TONTO, coaxo preparado),
// Caçador da Guilda (rede no baú), Sargento Brás (mini-chefe) e a Âncora-Mãe (maré, correntes, lembrança).

// ---------- ícones novos: fileira (trocar de linha), molhado e preso ----------
Object.assign(ICON_G, {
  fileira: ["............", "...k........", "..kyk.......", ".kyyyyyyyk..", "..kyk...k...", "...k........", "........k...", "...k...kyk..", "..kyyyyyyyk.", ".......kyk..", "........k...", "............"],
  molhado: [".....k......", "....kck.....", "...kccck....", "..kccwcck...", "..kcwccck...", "..kccccck...", "...kccck....", "....kkk.....", "............", "............", "............", "............"],
  preso: [".kkk........", "kwwwk.......", "kw.kkkk.....", "kwwkwwwk....", ".kkkw.kw....", "...kwwwk....", "....kkk.....", "............", "............", "............", "............", "............"]
});

// ---------- humanos em batalha (gerador de moradores, vista de lado olhando para a esquerda) ----------
function humBat(k) { return u => { const h = humano(k, HUMS[k]); return u.pose === 'atk' ? h.s[1] : h.s[Math.floor(BT.t / 24 + u.x) % 2]; }; }
const fr2u = k => u => fr2(k, u.pose ?? (Math.floor(BT.t / 16 + u.x) % 2));

Object.assign(ENEMY2, {
  lambe: { name: 'Lambe-Lodo', kind: 'lambe', mhp: 160, atk: 15, def: 7, mdef: 6, spd: 11, shield: 2, maxShield: 2, weak: ['fogo', 'luz'], ai: 'lambe', h: 22, cobres: 9,
    frame: fr2u('lambe'), dieCols: ['#4a5a3a', '#8a7a4a', '#5fa0d0'] },
  caranguejo: { name: 'Caranguejo-Telha', kind: 'caranguejo', mhp: 200, atk: 16, def: 18, mdef: 8, spd: 8, shield: 4, maxShield: 4, weak: ['mordida', 'gelo'], ai: 'caranguejo', h: 30, cobres: 12,
    frame: fr2u('caranguejo'), dieCols: ['#c85a3a', '#a8503a', '#4a7a3a'] },
  sapo: { name: 'Sapo-Sino', kind: 'sapo', mhp: 180, atk: 15, def: 9, mdef: 9, spd: 9, shield: 3, maxShield: 3, weak: ['corte', 'fogo'], ai: 'sapo', h: 28, cobres: 11,
    frame: fr2u('sapo'), dieCols: ['#4a8a5a', '#e8d8a0', '#c89a40'], cancelTxt: 'A papada murchou! Coaxo cancelado!' },
  cacador: { name: 'Caçador da Guilda', kind: 'cacador', mhp: 170, atk: 16, def: 10, mdef: 7, spd: 11, shield: 3, maxShield: 3, weak: ['luz', 'mordida'], ai: 'cacador', h: 50, cobres: 10,
    frame: humBat('cacador'), dieCols: ['#3a3a4a', '#5a4a3a', '#d8a070'] },
  bras: { name: 'Sargento Brás', kind: 'bras', boss: true, mhp: 1400, atk: 22, def: 12, mdef: 9, spd: 10, shield: 4, maxShield: 4, weak: ['luz', 'mordida'], ai: 'bras', h: 54, cobres: 60, ph: 1,
    frame: humBat('bras'), dieCols: ['#4a3a2a', '#c8a040', '#d8a070'], cancelTxt: 'O carimbo caiu da mão dele! Golpe cancelado!' },
  ancora: { name: 'Âncora-Mãe', kind: 'ancora', boss: true, leva: true, mhp: 3900, atk: 27, def: 13, mdef: 11, spd: 10, shield: 6, maxShield: 6, weak: ['gelo', 'mordida'], ai: 'ancora', h: 110, ph: 1, cobres: 150,
    frame: u => ancoraFrame(u.ph || 1, u.pose ?? (Math.floor(BT.t / 30) % 2), u.flash > 0), dieCols: ['#a87a3a', '#4a8a7a', '#ffd870', '#ffffff'],
    cancelTxt: 'A âncora escorregou da corrente! Golpe cancelado!' },
  corrente: { name: 'Corrente', kind: 'corrente', mhp: 170, atk: 10, def: 9, mdef: 12, spd: 7, shield: 2, maxShield: 2, weak: ['corte', 'fogo'], ai: 'corrente', h: 60, cobres: 0,
    frame: () => correnteArt(), dieCols: ['#6a6a7a', '#9a4a2a', '#ffffff'] }
});

// cai a corrente: o aliado fica livre. Cai a Âncora-Mãe: as correntes dela caem junto.
{ const _kf = killFoe; killFoe = function (t) {
  _kf(t);
  const solta = c => { if (c.held) { c.held.preso = null; c.held.ct = Math.max(c.held.ct, 40); callout(c.held.name + ' está livre!', '#9be58a', 60); c.held = null; } };
  if (t.kind === 'corrente') solta(t);
  if (t.leva) for (const o of alive(BT.foes)) if (o !== t) { o.hp = 0; solta(o); _kf(o); }
}; }

// dá uma volta pelo ar e volta (inimigo vai até o alvo)
async function foeLunge(e, t, n = 14, dx = 16) {
  const [tx, ty] = unitCenter(t), [ex, ey] = unitCenter(e);
  await tw(n, p => { e.ox = (tx + dx - ex) * ease.io(p); e.oy = (ty - ey) * ease.io(p) - Math.sin(p * Math.PI) * 8; });
}
async function foeBack(e, n = 12) { const ox = e.ox, oy = e.oy; await tw(n, p => { e.ox = ox * (1 - p); e.oy = oy * (1 - p); }); e.ox = 0; e.oy = 0; }

Object.assign(AI2, {
  // ---- Lambe-Lodo: gruda e chupa PM (e se cura um pouco); ou cospe lodo de longe ----
  async lambe(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.55) {
      callout('Sugada de Lodo!', '#d0a8ff', 40); e.pose = 2;
      await foeLunge(e, t, 16);
      const r = await foeStrike(e, t, 0.8, { n: 26, el: 'agua' });
      if (r !== 'perfeito' && t.hp > 0) {
        const [tx, ty] = unitCenter(t), [ex, ey] = unitCenter(e);
        const mp = Math.min(t.mp || 0, r === 'bom' ? 4 : 8);
        await tw(16, p => { for (let i = 0; i < 4; i++) { const q = (p + i * 0.22) % 1; fxDisc(tx + (ex - tx) * q, ty - 4 + Math.sin(q * 6) * 3, 1.6, mp ? '#8fb8ff' : '#e85a4a'); } });
        if (mp > 0) { t.mp -= mp; popNum(tx, ty - 30, '-' + mp + ' PM', '#8fb8ff'); }
        const h = Math.round(e.mhp * 0.06); e.hp = Math.min(e.mhp, e.hp + h); popNum(ex, ey - 18, '+' + h, '#9be58a');
      }
      e.pose = null; await foeBack(e);
    } else {
      callout('Cuspe de Lodo', '#d0a8ff', 36); e.pose = 2; sfx('splash');
      await projectile(e, t, '#6a5a3a', 14, { r: 3, trail: ['#5a4a38', '#3a3a2e', '#8a7a4a'] });
      const [x, y] = unitCenter(t); burst(x, y, 12, ['#5a4a38', '#8a7a4a', '#3a3a2e']);
      await foeStrike(e, t, 0.9, { n: 22, fast: true, el: 'agua' });
      e.pose = null;
    }
  },
  // ---- Caranguejo-Telha: pinça dupla, telhada na fileira de trás e casco de telha (DEF alta até a próxima vez) ----
  async caranguejo(e) {
    if (e.casco) { e.def -= 10; e.casco = false; }
    if (e.turns % 3 === 0 && e.hp < e.mhp * 0.75) {
      callout('Casco de Telha!', '#d0a8ff', 50); sfx('guard'); e.pose = 2; e.casco = true; e.def += 10; e.shield = e.maxShield;
      const [x, y] = unitCenter(e);
      await tw(22, p => { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + p * 2; bx.fillStyle = i % 2 ? '#c85a3a' : '#a8503a'; bx.fillRect(Math.round(x + Math.cos(a) * (22 - p * 10)), Math.round(y + Math.sin(a) * (14 - p * 6)), 4, 3); } });
      popNum(x, y - 22, 'DEF+', '#8fe3ff'); e.pose = null; return;
    }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.6) {
      callout('Pinça Dupla!', '#d0a8ff', 40); e.pose = 2;
      await foeLunge(e, t, 14, 18);
      for (let i = 0; i < 2 && t.hp > 0; i++) {
        const [x, y] = unitCenter(t);
        tw(8, p => { bx.strokeStyle = '#ffffff'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x + 10, y - 8 + i * 10); bx.lineTo(x + 10 - p * 16, y - 2 + i * 4); bx.stroke(); });
        await foeStrike(e, t, 0.62, { n: i ? 16 : 26, noCounter: i === 0 });
      }
      e.pose = null; await foeBack(e);
    } else {
      const back = alive(BT.party).filter(m => m.row === 'back'), tt = back.length && !(BT.taunt && BT.taunt.n > 0) ? pickOne(back) : t;
      callout('Telhada!', '#d0a8ff', 40); e.pose = 2;
      const [x0, y0] = unitCenter(e), [x1, y1] = unitCenter(tt);
      await tw(18, p => { const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * 30; bx.save(); bx.translate(Math.round(x), Math.round(y)); bx.rotate(p * 9); bx.fillStyle = '#a8503a'; bx.fillRect(-4, -2, 8, 4); bx.fillStyle = '#e8805a'; bx.fillRect(-4, -2, 8, 1); bx.restore(); });
      burst(x1, y1, 10, ['#a8503a', '#e8805a', '#5a2a1a']);
      await foeStrike(e, tt, 1.1, { n: 24 }); e.pose = null;
    }
  },
  // ---- Sapo-Sino: badalada (TONTO), língua rápida e o Coaxo-Sino preparado (todos, TONTO) ----
  async sapo(e) {
    if (e.charge) {
      e.charge = null; callout('COAXO-SINO!', '#ff6b6b', 50); e.pose = 2; sfx('sino', 330); bshake(10, 2); flashW(2);
      for (const m of alive(BT.party)) {
        const [x, y] = unitCenter(m);
        await tw(8, p => { fxRing(x, y, 4 + p * 16, '#ffe066', 1 - p); fxRing(x, y, 2 + p * 10, '#ffffff', 1 - p); });
        await foeStrike(e, m, 0.8, { n: 22, st: 'tonto', stT: 2, noCounter: true });
      }
      e.pose = null; return;
    }
    if (e.turns % 3 === 2) {
      e.charge = { t: null }; e.pose = 2; sfx('select'); callout('O sapo infla a papada...', '#ff6b6b', 70);
      const [x, y] = unitCenter(e); await tw(24, p => fxRing(x, y + 6, 6 + p * 8, '#ffe066', 0.5 + p * 0.5));
      if (!G.flags.tutSapo) { G.flags.tutSapo = true; hint('O "!" vermelho: golpe preparado. Zere o escudo do sapo (corte ou fogo) antes do Coaxo-Sino.', 300); }
      return;
    }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.5) {
      callout('Língua!', '#d0a8ff', 30); e.pose = 2;
      const [x0, y0] = unitCenter(e), [x1, y1] = unitCenter(t);
      await tw(10, p => { const q = p < 0.5 ? p * 2 : 2 - p * 2; bx.strokeStyle = '#e86890'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x0 - 8, y0 + 4); bx.lineTo(x0 - 8 + (x1 - x0 + 8) * q, y0 + 4 + (y1 - y0 - 4) * q); bx.stroke(); });
      await foeStrike(e, t, 0.95, { n: 18, fast: true }); e.pose = null;
    } else {
      callout('Badalada!', '#d0a8ff', 36); e.pose = 2; sfx('sino', 523);
      const [x, y] = unitCenter(t); await tw(12, p => { fxRing(x, y, 20 - p * 14, '#ffe066', p); });
      await foeStrike(e, t, 0.7, { n: 24, st: 'tonto', stT: 2 }); e.pose = null;
    }
  },
  // ---- Caçador da Guilda: cassetete, rede (prefere o baú) e lanterna nos olhos (perde parte da vez) ----
  async cacador(e) {
    const t = foeTarget(); if (!t) return;
    const k = pickOne(['cassetete', 'cassetete', 'rede', 'lanterna']);
    if (k === 'cassetete') {
      callout('Cassetete!', '#d0a8ff', 30); e.pose = 'atk'; await foeLunge(e, t, 14, 14);
      const [x, y] = unitCenter(t); tw(8, p => { bx.strokeStyle = '#6a4a2a'; bx.lineWidth = 3; bx.beginPath(); bx.moveTo(x + 12, y - 16); bx.lineTo(x + 12 - p * 12, y - 16 + p * 16); bx.stroke(); });
      await foeStrike(e, t, 1.05, { n: 26 }); e.pose = null; await foeBack(e);
    } else if (k === 'rede') await foeRede(e, t);
    else {
      callout('Lanterna nos olhos!', '#d0a8ff', 36); e.pose = 'atk';
      const [x, y] = unitCenter(t); await tw(10, p => { bx.globalAlpha = 0.5 * (1 - p); bx.fillStyle = '#fff0a0'; bx.beginPath(); bx.moveTo(e.x - 10, e.y - 36); bx.lineTo(x + 6, y - 14); bx.lineTo(x + 6, y + 14); bx.fill(); bx.globalAlpha = 1; });
      await foeStrike(e, t, 0.5, { n: 18, fast: true, noCounter: true, fx: (u, r) => { if (r !== 'perfeito') { u.ct = Math.max(0, u.ct - 25); popNum(...unitCenter(u), 'OFUSCADO', '#fff0a0'); } } });
      e.pose = null;
    }
  },
  // ---- Sargento Brás (mini-chefe): carimbo preparado, apito (chama um caçador), rede, sermão ----
  async bras(e) {
    if (e.charge) {
      const t = e.charge.t && e.charge.t.hp > 0 ? e.charge.t : foeTarget(); e.charge = null; if (!t) return;
      callout('CARIMBO: PROCURADO!', '#ff6b6b', 60); e.pose = 'atk'; await foeLunge(e, t, 12, 14);
      const [x, y] = unitCenter(t);
      await tw(12, p => { const yy = y - 40 + ease.in(p) * 34; bx.fillStyle = '#5a3a24'; bx.fillRect(x - 3, yy - 14, 6, 12); bx.fillStyle = '#c83a3a'; bx.fillRect(x - 9, yy, 18, 6); });
      sfx('crit'); hitstop(8); bshake(14, 3);
      await foeStrike(e, t, e.ph >= 2 ? 2.4 : 2.1, { n: 30, label: 'GOLPE FORTE' });
      if (t.hp > 0) { const [a, b] = unitCenter(t); popNum(a, b - 30, 'PROCURADO', '#e85a4a'); }
      e.pose = null; await foeBack(e); return;
    }
    if (e.turns % 4 === 3) {
      const t = foeTarget(); if (!t) return; e.charge = { t };
      callout('Brás molha o carimbo na tinta...', '#ff6b6b', 80); sfx('select');
      const [x, y] = unitCenter(t); await tw(20, p => fxRing(x, y, 20 - p * 10, '#ff6b6b', p)); return;
    }
    const opts = ['cassetete', 'cassetete', 'rede'];
    if (alive(BT.foes).length < 2) opts.push('apito', 'apito');
    if (e.ph >= 2) opts.push('sermao');
    const k = pickOne(opts), t = foeTarget(); if (!t) return;
    if (k === 'cassetete') {
      callout('Cassetete de Sargento!', '#d0a8ff', 36); e.pose = 'atk'; await foeLunge(e, t, 14, 14);
      for (let i = 0; i < 2 && t.hp > 0; i++) { const [x, y] = unitCenter(t); tw(8, p => { bx.strokeStyle = '#6a4a2a'; bx.lineWidth = 3; bx.beginPath(); bx.moveTo(x + 12, y - 18 + i * 8); bx.lineTo(x + 12 - p * 14, y - 18 + i * 8 + p * 16); bx.stroke(); }); await foeStrike(e, t, 0.7, { n: i ? 16 : 26, noCounter: i === 0 }); }
      e.pose = null; await foeBack(e);
    } else if (k === 'rede') {
      await foeRede(e, t);
    } else if (k === 'apito') {
      callout('PRIIIIIII! (apito)', '#d0a8ff', 50); sfx('encounter');
      const pos = [[208, 150], [196, 108], [142, 96]].find(([x]) => !alive(BT.foes).some(f => Math.abs(f.x - x) < 8)) || [142, 96];
      const c = mkFoe(ENEMY2.cacador, pos[0], pos[1]); c.ct = 0; c.alpha = 0; BT.foes.push(c);
      await tw(20, p => { c.alpha = p; c.ox = 30 * (1 - p); }); c.ox = 0;
    } else {
      callout('Regulamento da Guilda, artigo 12!', '#d0a8ff', 60); e.pose = 'atk';
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(8, p => { for (let i = 0; i < 3; i++) txt('!', x - 6 + i * 6, y - 20 - p * 10, { col: '#ff8a70', alpha: 1 - p }); }); await foeStrike(e, m, 0.45, { n: 20, fast: true, noCounter: true }); }
      BT.tension = Math.max(0, BT.tension - 10); callout('-10 de Tensão (burocracia)', '#ffa94d', 50); e.pose = null;
    }
  },
  // ---- a Corrente: aperta quem ela segura ----
  async corrente(e) {
    const h = e.held;
    if (!h || h.hp <= 0) { e.hp = 0; killFoe(e); return; }
    if (alive(BT.party).every(m => m.preso)) { callout('A corrente afrouxa...', '#9be58a', 50); e.hp = 0; killFoe(e); return; }
    callout('A corrente aperta!', '#d0a8ff', 36); sfx('hurt'); bshake(4);
    const d = Math.max(1, Math.round(h.mhp * 0.05)); hurtMember(h, d);
  },
  // ---- A ÂNCORA-MÃE ----
  async ancora(e) {
    e.mareN = (e.mareN || 0) + 1;
    if (e.charge) {
      const t = e.charge.t && e.charge.t.hp > 0 ? e.charge.t : foeTarget(); e.charge = null; if (!t) return;
      callout('A ÂNCORA DESCE!', '#ff6b6b', 60); e.pose = 2; await wait(10); e.pose = 3;
      const [x, y] = unitCenter(t);
      await tw(10, p => { const yy = 20 + (y - 20) * ease.in(p); bx.fillStyle = '#4a4a58'; bx.fillRect(x - 2, yy - 20, 4, 20); bx.fillRect(x - 10, yy, 20, 4); bx.fillStyle = '#6a6a7a'; bx.fillRect(x - 10, yy, 20, 1); });
      sfx('rumble'); bshake(18, 4); flashW(2); burst(x, y + 10, 26, ['#5a5a6a', '#1c3a54', '#ffffff'], { up: 2 });
      await foeStrike(e, t, e.ph >= 3 ? 2.5 : 2.3, { n: 30, label: 'GOLPE FORTE' });
      e.pose = null; return;
    }
    // a maré sobe a cada 3 vezes dela (fases 1 e 2): quem está na FRENTE fica molhado (lento)
    if (e.ph <= 2 && e.mareN % 3 === 0) { await mareSobe(e); return; }
    // fase 2: prende um aliado com uma corrente
    if (e.ph === 2 && !alive(BT.foes).some(f => f.kind === 'corrente') && e.turns - (e.lastGrab ?? -9) >= 4) { await agarrar(e); return; }
    if (e.turns % 4 === 1) {
      const t = foeTarget(); if (!t) return; e.charge = { t }; e.pose = 2;
      callout('A âncora sobe...', '#ff6b6b', 80); sfx('gate');
      const [x, y] = unitCenter(t); await tw(20, p => fxRing(x, y, 20 - p * 10, '#ff6b6b', p)); return;
    }
    const opts = e.ph === 1 ? ['badalada', 'puxao', 'puxao'] : e.ph === 2 ? ['badalada', 'puxao', 'chicote'] : ['choro', 'choro', 'badalada', 'puxao'];
    const k = pickOne(opts);
    if (k === 'badalada') {
      callout('BADALADA!', '#d0a8ff', 50); sfx('sino', 147); bshake(12, 2); flashW(2);
      await tw(24, p => { const [x, y] = unitCenter(e); for (let i = 0; i < 3; i++) fxRing(x, y + 20, (p * 140 + i * 30) % 160, '#ffe066', 1 - p); });
      for (const m of alive(BT.party)) await foeStrike(e, m, 0.5, { n: 20, fast: true, st: 'tonto', stT: 2, noCounter: true });
    } else if (k === 'puxao') {
      const t = foeTarget(); if (!t) return;
      callout('Puxão de Corrente', '#d0a8ff', 40); e.pose = 2;
      const [x0, y0] = [e.x - 30, e.y - 50], [x1, y1] = unitCenter(t);
      await tw(12, p => { for (let i = 0; i <= 10; i++) { const q = i / 10 * p; fxDisc(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * 14, 2, i % 2 ? '#5a5a6a' : '#8a8a9a'); } });
      await foeStrike(e, t, 1.2, { n: 26, el: 'agua' }); e.pose = null;
    } else if (k === 'chicote') {
      callout('Chicote de Correntes!', '#d0a8ff', 50); e.pose = 2;
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(8, p => { bx.strokeStyle = '#8a8a9a'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x + 30 - p * 40, y - 20); bx.quadraticCurveTo(x, y + 10, x - 30 + p * 10, y - 4); bx.stroke(); }); await foeStrike(e, m, 0.7, { n: 20, fast: true, noCounter: true }); }
      e.pose = null;
    } else {
      // choro do sino: as lembranças da cidade saem pela rachadura e batem em todos
      callout(e.acalmou ? 'Choro do Sino (mais baixo)' : 'CHORO DO SINO', '#ffd870', 50); sfx('sino', 110);
      const [x, y] = unitCenter(e);
      await tw(30, p => { for (let i = 0; i < 7; i++) { const a = i * 0.9 + p * 2, r = p * 120; bx.globalAlpha = 1 - p; bx.fillStyle = '#ffd870'; bx.fillRect(Math.round(x - r * Math.abs(Math.cos(a))), Math.round(y - 10 + Math.sin(a) * 30), 3, 6); bx.fillRect(Math.round(x - r * Math.abs(Math.cos(a))) - 1, Math.round(y - 13 + Math.sin(a) * 30), 5, 3); bx.globalAlpha = 1; } });
      for (const m of alive(BT.party)) await foeStrike(e, m, 0.85, { n: 22, noCounter: true });
    }
  }
});
// rede do caçador (prefere o baú: "bagagem" se pega com rede)
async function foeRede(e, t) {
  const bau = BT.party.find(m => m.id === 'bau' && m.hp > 0), tt = BT.taunt && BT.taunt.n > 0 ? t : (bau && Math.random() < 0.6 ? bau : t);
  callout(tt.id === 'bau' ? 'Rede de bagagem!' : 'Rede!', '#d0a8ff', 40); e.pose = 'atk';
  const [x0, y0] = unitCenter(e), [x1, y1] = unitCenter(tt);
  await tw(16, p => { const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * 18, r = 4 + p * 10; bx.strokeStyle = '#d8c8a0'; bx.lineWidth = 1; for (let i = -2; i <= 2; i++) { bx.beginPath(); bx.moveTo(x - r, y + i * r / 2.5); bx.lineTo(x + r, y + i * r / 2.5); bx.stroke(); bx.beginPath(); bx.moveTo(x + i * r / 2.5, y - r); bx.lineTo(x + i * r / 2.5, y + r); bx.stroke(); } });
  await foeStrike(e, tt, 0.6, { n: 22, fast: true, st: 'tonto', stT: 2 }); e.pose = null;
}
// a maré: a água do poço sobe e molha quem está na FRENTE (fica lento por 3 vezes)
async function mareSobe(e) {
  callout('A MARÉ SOBE!', '#5fd0ff', 60); sfx('splash'); sfx('rumble');
  BT.mare = BT.mare || { lvl: 0 };
  await tw(30, p => { BT.mare.lvl = Math.sin(p * Math.PI) * 18 + 4; });
  BT.mare.lvl = 4;
  for (const m of alive(BT.party)) {
    if (m.row === 'back') { const [x, y] = unitCenter(m); popNum(x, y - 20, 'SECO', '#9be58a'); continue; }
    const d = calcDmg(e, m, 0.35) * (m.eqFx && m.eqFx.has('agua') ? 0.5 : 1);
    hurtMember(m, d); m.st.molhado = 3; const [x, y] = unitCenter(m); popNum(x, y - 20, 'MOLHADO', '#5fd0ff'); burst(x, y + 10, 10, ['#5fd0ff', '#ffffff']);
  }
  if (!G.flags.tutMare) { G.flags.tutMare = true; hint('MARÉ: quem está na FRENTE fica MOLHADO (lento). FILEIRA (nos comandos) troca de linha. É uma ação leve. Atrás: leva menos dano físico, mas o corpo a corpo enfraquece.', 520); }
}
async function agarrar(e) {
  const ops = alive(BT.party).filter(m => !m.preso); if (ops.length < 2) { e.lastGrab = e.turns; return AI2.ancora(e); }
  const t = BT.taunt && BT.taunt.n > 0 && BT.taunt.m.hp > 0 ? BT.taunt.m : pickOne(ops);
  e.lastGrab = e.turns; callout('Correntes!', '#ff6b6b', 50); e.pose = 2; sfx('gate');
  const [x0, y0] = [e.x - 30, e.y - 40], [x1, y1] = unitCenter(t);
  await tw(18, p => { for (let i = 0; i <= 14; i++) { const q = i / 14 * ease.out(p); fxDisc(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q + Math.sin(q * 9) * 3, 2.2, i % 2 ? '#5a5a6a' : '#9a9aaa'); } });
  const res = await foeStrike(e, t, 0.6, { n: 24, noCounter: true });
  e.pose = null;
  if (res === 'perfeito') { callout(t.name + ' escapou da corrente!', '#9be58a', 60); return; }
  const c = mkFoe(ENEMY2.corrente, 134, 152); c.ct = 0; c.alpha = 0; c.held = t; BT.foes.push(c);
  t.preso = c; t.ct = 0;
  await tw(16, p => { c.alpha = p; });
  callout(t.name + ' está PRESO!', '#ff6b6b', 70);
  if (!G.flags.tutPreso) { G.flags.tutPreso = true; hint('PRESO: o aliado não age até alguém quebrar a CORRENTE (alvo próprio, fraca a corte e fogo).', 400); }
}
// a água subindo e a corrente até quem está preso (desenhado atrás dos lutadores)
function bgAnimPoco() {
  if (BT.mare && BT.mare.lvl > 0) { const y = 158 - BT.mare.lvl; const L0 = -(BTV.ox || 0), RW = BTV.w || W; bx.globalAlpha = 0.45; bx.fillStyle = '#2a6080'; bx.fillRect(L0, y, RW, 162 - y); bx.globalAlpha = 0.8; bx.fillStyle = '#8fd0f0'; for (let x = L0 - L0 % 6; x < L0 + RW; x += 6) bx.fillRect(x + (BT.t >> 2) % 6, y + (x % 12 ? 0 : 1), 3, 1); bx.globalAlpha = 1; }
  for (const c of BT.foes) if (c.kind === 'corrente' && c.held && c.hp > 0 && !c.gone) {
    const [x0, y0] = [c.x, c.y - 40], [x1, y1] = unitCenter(c.held);
    for (let i = 0; i <= 8; i++) { const q = i / 8; fxDisc(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * 6, 1.8, i % 2 ? '#5a5a6a' : '#9a9aaa'); }
  }
}
// fases da Âncora-Mãe
function fasesAncora() {
  return [
    { at: 0.66, run: async (e) => {
      sfx('rumble'); bshake(30, 3); flashW(4);
      await say('EU SEGURO. EU SEGURO TODO MUNDO. NINGUÉM SOBE. NINGUÉM ESQUECE.', 'ancora');
      e.ph = 2; e.weak = ['corte', 'fogo']; e.maxShield = 6; e.shield = 6; e.mini = null;
      callout('O sino sobe: as correntes estão à mostra!', '#8fe3ff', 90);
    } },
    { at: 0.33, run: async (e) => {
      sfx('sino', 98); bshake(40, 4); flashW(6);
      for (const c of alive(BT.foes)) if (c.kind === 'corrente') { c.hp = 0; killFoe(c); }
      await say('* O bronze racha de cima a baixo. Pela rachadura escorre luz âmbar e, dentro da luz, gente: noivas, um menino de batizado, um velho de chapéu. As lembranças que ela guardou.');
      await say('TODO MUNDO QUE EU TOQUEI... ESTÃO SAINDO... NÃO... NÃO VÃO EMBORA...', 'ancora');
      await say('@... ela não quer machucar ninguém. Ela só não quer ficar sozinha no escuro. Acho que alguém precisa cantar pra ela. Não pra dormir. Pra ela lembrar que alguém ainda canta.', 'lume');
      e.ph = 3; e.weak = ['luz']; e.maxShield = 4; e.shield = 4; e.spd = 11; e.mini = null;
      if (BT.mare) BT.mare.lvl = 0;
      callout('Fase da Lembrança: a fraqueza agora é LUZ', '#ffd870', 90);
    } }
  ];
}
// a Lume canta para o sino na fase 3: os golpes dela enfraquecem (e o final muda uma fala)
function cantouSino(m) {
  if (!m || m.id !== 'lume' || !BT.on) return;
  const b = BT.foes.find(f => f.kind === 'ancora' && f.hp > 0 && f.ph === 3);
  if (!b || b.acalmou) return;
  b.acalmou = true; b.atk = Math.round(b.atk * 0.75); G.flags.cantouSino = true;
  callout('A Dona Badalada para para escutar...', '#ffd870', 100);
  hint('A Lume cantou para o sino. Os golpes da Âncora-Mãe ficaram mais fracos.', 300);
}
for (const [o, k] of [[RUNA2, 'acalanto'], [RUNA2, 'acalantoCoro'], [RUNA2, 'velaprot'], [TECH2, 'cancao']]) { const f = o[k].run; o[k].run = async (m, t) => { await f(m, t); cantouSino(m); }; }

// ---------- trocar de FILEIRA (só onde a luta permite; estreia na Âncora-Mãe) ----------
CMD.splice(CMD.findIndex(c => c.k === 'defender'), 0, { k: 'fileira', nm: 'Fileira', ic: () => 'fileira', desc: m => m.row === 'back' ? 'Ir para a FRENTE: corpo a corpo com força total. Ação leve.' : 'Ir para TRÁS: escapa da maré e leva menos dano físico, mas o corpo a corpo enfraquece. Ação leve.', only: () => !!(BT.cfg && BT.cfg.fileira) });
{ const _dc = doCommand; doCommand = async function (m, k) {
  if (k !== 'fileira') return _dc(m, k);
  await act(m, async () => {
    const x0 = m.x; m.row = m.row === 'back' ? 'front' : 'back';
    const keep = BT.party.map(u => [u, u.x, u.y]); layoutParty(); const x1 = m.x; for (const [u, x, y] of keep) if (u !== m) { u.x = x; u.y = y; }
    m.x = x0; sfx('step'); m.anim = 'run';
    await tw(16, p => { m.x = x0 + (x1 - x0) * ease.io(p); m.oy = -Math.sin(p * Math.PI) * 6; if (BT.t % 3 === 0) part({ x: m.x, y: m.y, vy: -0.3, life: 12, col: '#8a7a6a' }); });
    m.x = x1; m.oy = 0; m.anim = 'idle';
    callout(m.name + (m.row === 'back' ? ' vai para trás' : ' vai para a frente'), '#8fe3ff', 40);
  });
  endTurn(m, 'leve'); return true;
}; }
