// ================= INIMIGOS DO CAP. 4 (Parte 1): A ALA DO DESCANSO =================
// PESADELO (o que sobra quando tiram a lembrança: dá MEDO = vez atrasada e come Tensão; fraco a luz e fogo),
// LENÇOL (ENROLA um aliado: ele fica PRESO até alguém rasgar o lençol; fraco a fogo e corte) e o mini-chefe
// RELÓGIO DE PLANTÃO (a cada 3 vezes o ponteiro gira e muda a HORA, e as fraquezas mudam junto; golpe preparado
// HORA DO DESCANSO adormece um aliado, cancelável pela quebra).
const HORA_FRACO = { manha: 'gelo', tarde: 'fogo', noite: 'luz' }, HORA_NM = { manha: 'MANHÃ', tarde: 'TARDE', noite: 'NOITE' };
Object.assign(ENEMY2, {
  pesadelo: { name: 'Pesadelo', kind: 'pesadelo', fly: true, mhp: 280, atk: 28, def: 9, mdef: 8, spd: 14, shield: 3, maxShield: 3, weak: ['luz', 'fogo'], ai: 'pesadelo', h: 34, cobres: 14,
    frame: u => pesadeloArt(Math.floor(BT.t / 9 + u.x) % 4), dieCols: ['#1a1028', '#5a4278', '#e8e0f8'] },
  lencol: { name: 'Lençol', kind: 'lencol', fly: true, mhp: 300, atk: 26, def: 10, mdef: 10, spd: 10, shield: 3, maxShield: 3, weak: ['fogo', 'corte'], ai: 'lencol', h: 40, cobres: 12,
    frame: u => lencolArt(Math.floor(BT.t / 10 + u.x) % 4), dieCols: ['#d8e4e8', '#8a9aa8', '#3a7a7a'] },
  relogio: { name: 'Relógio de Plantão', kind: 'relogio', boss: true, mhp: 3800, atk: 32, def: 13, mdef: 12, spd: 10, shield: 5, maxShield: 5, weak: ['gelo', 'mordida'], ai: 'relogio', h: 104, cobres: 90,
    frame: u => relogioArt(Math.floor(BT.t / (u.armando ? 5 : 15)) % 4, u.hora || 'manha', !!u.armando), dieCols: ['#6a3a24', '#f0c050', '#8ab8e8', '#ffffff'], cancelTxt: 'O pêndulo travou! Hora do Descanso cancelada!' }
});
FICHA.pesadelo = 'Pesadelo: o que sobra quando tiram uma lembrança de alguém. Dá MEDO (atrasa a vez) e come Tensão. Luz e fogo espantam.';
FICHA.lencol = 'Lençol da Ala do Descanso que levantou sozinho. ENROLA um aliado (PRESO até alguém rasgar o lençol). Fogo e corte.';
FICHA.relogio = 'Relógio de Plantão: marca a hora do descanso. A cada 3 vezes muda a HORA e a fraqueza muda junto: manhã = gelo, tarde = fogo, noite = luz. Mordida sempre.';

// o lençol rasgado solta quem ele enrolava
{ const _kf4 = killFoe; killFoe = function (t) {
  _kf4(t);
  if (t && t.kind === 'lencol' && t.held) { const h = t.held; h.preso = null; h.ct = Math.max(h.ct, 40); callout(h.name + ' se soltou do lençol!', '#9be58a', 60); t.held = null; }
}; }

Object.assign(AI2, {
  async pesadelo(e) {
    const t = foeTarget(); if (!t) return;
    const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
    if (Math.random() < 0.4) {
      callout('Sussurro do Medo', '#a898d8', 40); sfx('rumble');
      await tw(22, p => { for (let i = 0; i < 6; i++) { const q = (p + i / 6) % 1; bx.globalAlpha = 1 - q; bx.fillStyle = '#5a4278'; bx.fillRect(Math.round(ex + (tx - ex) * q + Math.sin(q * 12 + i) * 6), Math.round(ey + (ty - ey) * q), 3, 2); bx.globalAlpha = 1; } });
      const r = await foeStrike(e, t, 0.7, { n: 22, st: 'tonto', stT: 2, longe: true });
      if (r !== 'perfeito') { const n = Math.min(BT.tension, 8); BT.tension -= n; if (n) popNum(tx, ty - 34, '-' + n + ' Tensão', '#ffa94d'); t.ct = Math.max(0, t.ct - 25); popNum(tx, ty - 26, 'MEDO', '#a898d8'); }
      return;
    }
    callout('Abraço Frio', '#d0a8ff', 30); await foeLunge(e, t, 12, 12);
    await foeStrike(e, t, 1.05, { n: 24 }); await foeBack(e);
  },
  async lencol(e) {
    if (e.held) {
      const h = e.held; if (h.hp <= 0) { h.preso = null; e.held = null; }
      else { callout('O lençol aperta', '#d8e4e8', 30); const [x, y] = unitCenter(h); await tw(12, p => { fxRing(x, y, 10 - p * 6, '#d8e4e8', 1 - p); }); hurtMember(h, Math.round(e.atk * 0.45 * 60 / (60 + h.def))); return; }
    }
    const ops = alive(BT.party).filter(m => !m.preso);
    if (ops.length >= 2 && Math.random() < 0.45 && !alive(BT.foes).some(f => f.held)) {
      const t = BT.taunt && BT.taunt.n > 0 && BT.taunt.m.hp > 0 && !BT.taunt.m.preso ? BT.taunt.m : pickOne(ops);
      callout('Enrolar!', '#ff6b6b', 40); await foeLunge(e, t, 14, 4);
      const r = await foeStrike(e, t, 0.5, { n: 26, noCounter: true });
      if (r === 'perfeito') { callout(t.name + ' escapou do lençol!', '#9be58a', 50); await foeBack(e); return; }
      t.preso = e; e.held = t; t.ct = 0; e.ox = 0; e.oy = 0;
      callout(t.name + ' está ENROLADO!', '#ff6b6b', 60);
      if (!G.flags.tutLencol) { G.flags.tutLencol = true; hint('ENROLADO: o aliado não age até alguém rasgar o LENÇOL que o prende (fraco a fogo e corte).', 400); }
      return;
    }
    const t = foeTarget(); if (!t) return;
    callout('Chicote de Pano', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.0, { n: 22, fast: true }); await foeBack(e);
  },
  async relogio(e) {
    const [ex, ey] = unitCenter(e);
    e.hora = e.hora || 'manha';
    // golpe preparado: HORA DO DESCANSO
    if (e.charge) {
      e.charge = null; e.armando = false; callout('HORA DO DESCANSO', '#c8a0ff', 70); sfx('crit'); flashW(3); bshake(12, 3);
      const t = foeTarget(); if (!t) return;
      await tw(24, p => { for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + p * 4; fxDisc(ex + Math.cos(a) * (40 - p * 30), ey - 20 + Math.sin(a) * (30 - p * 20), 1.6, '#c8a0ff'); } });
      const r = await foeStrike(e, t, 1.3, { n: 30, noCounter: true, longe: true });
      if (r !== 'perfeito' && t.hp > 0) { t.ct = -70; t.st.tonto = 2; const [x, y] = unitCenter(t); popNum(x, y - 30, 'ADORMECEU', '#c8a0ff'); }
      return;
    }
    // a cada 3 vezes o ponteiro gira e a hora muda
    if (e.turns > 0 && e.turns % 3 === 0) {
      const ord = ['manha', 'tarde', 'noite'], nova = ord[(ord.indexOf(e.hora) + 1) % 3];
      callout('O ponteiro gira...', '#f0c050', 50); sfx('rune');
      await tw(24, p => { luzMagia(ex, ey - 40, 30 + p * 20, nova === 'noite' ? '#8a6ac8' : nova === 'tarde' ? '#f09040' : '#8ab8e8', Math.sin(p * Math.PI)); });
      e.hora = nova; e.weak = [HORA_FRACO[nova], 'mordida']; e.known = {}; e.shield = e.maxShield;
      callout('Agora é ' + HORA_NM[nova] + ': fraco a ' + HORA_FRACO[nova] + '!', '#f0c050', 90);
      if (!G.flags.tutHora) { G.flags.tutHora = true; hint('O Relógio muda a HORA a cada 3 vezes: manhã = gelo, tarde = fogo, noite = luz. O escudo volta cheio a cada troca.', 420); }
      return;
    }
    if (e.turns % 4 === 2) { e.charge = { t: null }; e.armando = true; callout('Tic... tac... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(20, p => { luzMagia(ex, ey - 40, 20 + p * 20, '#c8a0ff', p); }); return; }
    const k = pickOne(['ponteiro', 'pendulo', 'badalada', 'ponteiro']), t = foeTarget(); if (!t) return;
    if (k === 'badalada') {
      callout('Badalada das Horas', '#f0c050', 50); sfx('gate'); bshake(10, 2);
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(6, p => fxRing(x, y, 6 + p * 16, '#f0c050', 1 - p)); await foeStrike(e, m, 0.62, { n: 20, noCounter: true, longe: true, st: Math.random() < 0.35 ? 'tonto' : null, stT: 1 }); }
    } else if (k === 'pendulo') {
      callout('Pêndulo', '#d0a8ff', 40); await foeLunge(e, t, 14, 18);
      await foeStrike(e, t, 0.7, { n: 22, fast: true }); if (t.hp > 0) await foeStrike(e, t, 0.7, { n: 18, fast: true }); await foeBack(e);
    } else {
      callout('Ponteiro', '#d0a8ff', 40); await foeLunge(e, t, 14, 16); await foeStrike(e, t, 1.15, { n: 26 }); await foeBack(e);
    }
  }
});
