// ================= INIMIGOS DO CAP. 3 (Parte 1): Estrada dos Lampiões =================
// Mariposa-de-Lampião (COME LUZ: golpe de luz cura em vez de ferir; pó de asa deixa TONTO; Apaga-Vela tira a Vela
// Protetora), Bandoleiro do Pavio Curto (humano; AFANA cobres, que voltam se ele cair) e a MARIPOSA-RAINHA
// (mini-chefe: chama filhotes; ao comer a luz do poste ela ACENDE e as fraquezas mudam; Sopro de Luz preparado).

HUMS.bandido = { h: 48, skin: '#c8906a', hair: '#2a1a1a', top: '#6a4a3a', bottom: '#2a2a34', hat: '#3a2a2a', acc: '#a83a3a',
  extra: (P, o) => { if (o.view !== 'b') { P.rect(o.cx - 5, o.hcY + 2, 10, 3, '#a83a3a'); P.p(o.cx + 4, o.hcY + 5, '#a83a3a'); } } };
WHO.bandido = { name: () => 'Bandoleiro', portrait: () => portHum('bandido'), voice: () => sfx('blipLow', 200), col: '#ffd0c0' };

const marU = (rainha) => u => mariposaArt(Math.floor(BT.t / (rainha ? 10 : 7) + u.x) % 2, rainha, !!u.acesa);
Object.assign(ENEMY2, {
  mariposa: { name: 'Mariposa-de-Lampião', kind: 'mariposa', fly: true, mhp: 150, atk: 16, def: 7, mdef: 10, spd: 13, shield: 2, maxShield: 2, weak: ['fogo', 'mordida'], ai: 'mariposa', h: 28, cobres: 10,
    comeLuz: true, frame: marU(false), dieCols: ['#9a7a7a', '#c8a890', '#ffffff'] },
  bandido: { name: 'Bandoleiro', kind: 'bandido', mhp: 185, atk: 18, def: 10, mdef: 7, spd: 11, shield: 3, maxShield: 3, weak: ['luz', 'corte'], ai: 'bandido', h: 48, cobres: 14,
    frame: humBat('bandido'), dieCols: ['#6a4a3a', '#a83a3a', '#d8a070'] },
  rainha: { name: 'Mariposa-Rainha', kind: 'rainha', boss: true, fly: true, mhp: 1750, atk: 23, def: 11, mdef: 12, spd: 11, shield: 5, maxShield: 5, weak: ['fogo', 'mordida'], ai: 'rainha', h: 84, cobres: 70, ph: 1,
    comeLuz: true, frame: marU(true), dieCols: ['#c8a890', '#ffd060', '#ffffff', '#6a4a5a'], cancelTxt: 'As asas apagaram! Sopro de Luz cancelado!' }
});
FICHA.mariposa = 'Mariposa de estrada. COME LUZ: Faísca e luz CURAM ela. Fogo queima as asas; mordida pega de jeito. O pó das asas deixa tonto.';
FICHA.bandido = 'Bandoleiro do Pavio Curto. Afana cobres da sua bolsa (devolve se cair). Luz no olho e corte no colete.';
FICHA.rainha = 'Mariposa-Rainha do poste quebrado. Come luz (nada de Faísca!). Quando acender, as fraquezas mudam para gelo e corte. Chama filhotes.';

// golpe de luz numa mariposa: ela come e se cura
{ const _hf3 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (t && t.comeLuz && o.el === 'luz' && t.hp > 0) {
    const n = Math.round(calcDmg(a, t, pow, o) * 0.6); t.hp = Math.min(t.mhp, t.hp + n); t.known.luz = 'cura';
    const [x, y] = unitCenter(t); popNum(x, y - 6, '+' + n, '#9be58a'); burst(x, y, 12, ['#ffe080', '#ffffff']);
    callout('A mariposa COMEU a luz!', '#ffe080', 60);
    if (!G.flags.tutComeLuz) { G.flags.tutComeLuz = true; hint('Mariposas comem luz: Faísca e golpes de luz curam elas. Use fogo, mordida ou a lança.', 300); }
    return 0;
  }
  return _hf3(a, t, pow, o);
}; }

Object.assign(AI2, {
  async mariposa(e) {
    const t = foeTarget(); if (!t) return;
    const k = Math.random();
    if (k < 0.3) {
      callout('Pó de Asa!', '#c8a890', 40); e.pose = 1; const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
      await tw(18, p => { for (let i = 0; i < 10; i++) { const q = (p + i * 0.09) % 1; bx.fillStyle = i % 2 ? '#c8a890' : '#e8d8c0'; bx.fillRect(Math.round(ex + (tx - ex) * q + Math.sin(i * 3 + p * 9) * 6), Math.round(ey + (ty - ey) * q + Math.cos(i * 2) * 5), 1, 1); } });
      await foeStrike(e, t, 0.7, { n: 24, st: 'tonto', stT: 2 });
    } else if (k < 0.5 && BT.party.some(m => m.hp > 0 && m.st.vela > 0)) {
      const v = BT.party.find(m => m.hp > 0 && m.st.vela > 0); callout('Apaga-Vela!', '#ff6b6b', 40);
      await foeLunge(e, v, 12); v.st.vela = 0; const [x, y] = unitCenter(v); popNum(x, y - 24, 'VELA APAGADA', '#ff6b6b');
      await foeStrike(e, v, 0.6, { n: 22, fast: true }); await foeBack(e);
    } else {
      callout('Rasante!', '#d0a8ff', 30); await foeLunge(e, t, 12, 10); await foeStrike(e, t, 1.0, { n: 22, fast: true }); await foeBack(e);
    }
    e.pose = null;
  },
  async bandido(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.35 && (G.cobres || 0) > 0) {
      callout('Afanar!', '#ffd060', 40); e.pose = 'atk'; await foeLunge(e, t, 12, 12);
      const r = await foeStrike(e, t, 0.6, { n: 20, fast: true });
      if (r !== 'perfeito') { const n = Math.min(G.cobres, 6 + Math.floor(Math.random() * 6)); G.cobres -= n; e.afanou = (e.afanou || 0) + n; const [x, y] = unitCenter(e); popNum(x, y - 30, '-' + n + ' cobres', '#ffd060'); }
      e.pose = null; await foeBack(e); return;
    }
    callout('Bote de Faca!', '#d0a8ff', 36); e.pose = 'atk'; await foeLunge(e, t, 14, 14);
    await foeStrike(e, t, 1.05, { n: 24 }); e.pose = null; await foeBack(e);
  },
  async rainha(e) {
    if (e.charge) {
      e.charge = null; callout('SOPRO DE LUZ!', '#ff6b6b', 60); sfx('crit'); flashW(4); bshake(14, 3);
      const [ex, ey] = unitCenter(e);
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(10, p => { bx.globalAlpha = 0.6 * (1 - p); bx.fillStyle = '#fff0a0'; bx.fillRect(Math.round(ex + (x - ex) * p) - 4, Math.round(ey + (y - ey) * p) - 4, 8, 8); bx.globalAlpha = 1; }); await foeStrike(e, m, 1.25, { n: 26, el: 'luz', noCounter: true, st: 'queimado', stT: 2 }); }
      e.pose = null; return;
    }
    if (e.ph >= 2 && e.turns % 3 === 2) {
      e.charge = { t: null }; e.pose = 1; sfx('select'); callout('A Rainha junta luz nas asas...', '#ff6b6b', 80);
      const [x, y] = unitCenter(e); await tw(24, p => fxRing(x, y, 30 - p * 20, '#fff0a0', p)); return;
    }
    const filhos = alive(BT.foes).filter(f => f.kind === 'mariposa').length;
    const opts = ['rasante', 'po', 'rasante'];
    if (filhos < 2 && e.turns % 4 === 1) opts.push('filhote', 'filhote');
    const k = pickOne(opts), t = foeTarget(); if (!t) return;
    if (k === 'filhote') {
      callout('A Rainha chama as filhas!', '#d0a8ff', 50); sfx('encounter');
      const pos = [[196, 70], [150, 60]].find(([x]) => !alive(BT.foes).some(f => Math.abs(f.x - x) < 10)) || [150, 60];
      const c = mkFoe(ENEMY2.mariposa, pos[0], pos[1]); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(20, p => { c.alpha = p; c.oy = -20 * (1 - p); }); c.oy = 0;
    } else if (k === 'po') {
      callout('Nuvem de Pó de Asa!', '#c8a890', 50); e.pose = 1;
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(8, p => { for (let i = 0; i < 6; i++) { bx.fillStyle = '#e8d8c0'; bx.fillRect(Math.round(x - 10 + i * 4), Math.round(y - 20 + p * 16 + (i % 2) * 3), 1, 1); } }); await foeStrike(e, m, 0.55, { n: 22, st: 'tonto', stT: 2, noCounter: true }); }
    } else {
      callout(e.ph >= 2 ? 'Rasante Aceso!' : 'Rasante da Rainha!', '#d0a8ff', 40); e.pose = 1; await foeLunge(e, t, 14, 18);
      await foeStrike(e, t, e.ph >= 2 ? 1.5 : 1.3, { n: 26, el: e.ph >= 2 ? 'luz' : undefined }); await foeBack(e);
    }
    e.pose = null;
  }
});
function fasesRainha() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rune'); flashW(4); bshake(14, 3);
    await say('* A Rainha voa até o poste quebrado e enfia a cabeça na lanterna. Come a última luz que sobrou. As asas ACENDEM.');
    await say('Ela tá brilhando mais do que EU! Isso é muito ofensivo!', 'lume');
    e.ph = 2; e.acesa = true; e.weak = ['gelo', 'corte']; e.known = {}; e.maxShield = 6; e.shield = 6; e.spd = 13;
    callout('Acesa: as fraquezas mudaram!', '#8fe3ff', 90);
  } }];
}
// o bandoleiro devolve o que afanou quando cai
{ const _kf3 = killFoe; killFoe = function (t) { _kf3(t); if (t.afanou) { G.cobres = (G.cobres || 0) + t.afanou; const [x, y] = unitCenter(t); popNum(x, y - 30, '+' + t.afanou + ' cobres de volta', '#ffd060'); t.afanou = 0; } }; }
