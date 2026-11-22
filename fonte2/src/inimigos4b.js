// ================= INIMIGOS DO CAP. 4 (Parte 2): A SERRA E A MINA DE CANDEIA =================
// NÉVOA (voa; golpes FÍSICOS a atravessam 35% das vezes; come Tensão; pode fazer um aliado ESQUECER a próxima vez;
// fraca a fogo e luz: magia acerta sempre), MINEIRO OCO (casco de âmbar vazio; pesado; Desabamento em todos; fraco a
// fogo e corte) e o chefe CAPATAZ DE CANDEIA (Apito do Turno preparado: bate em todos e um aliado ESQUECE a vez;
// cancela pela quebra; a RUNA DE GATILHO dispara antes dele agir; fase 2 a 50%: fornalha aberta, fraco a gelo/corte).
Object.assign(ENEMY2, {
  nevoa: { name: 'Névoa', kind: 'nevoa', fly: true, mhp: 300, atk: 28, def: 8, mdef: 12, spd: 13, shield: 3, maxShield: 3, weak: ['fogo', 'luz'], ai: 'nevoa', h: 34, cobres: 14,
    frame: u => nevoaArt(Math.floor(BT.t / 10 + u.x) % 6), dieCols: ['#c8ccdc', '#8a90a8', '#ffffff'] },
  mineiro: { name: 'Mineiro Oco', kind: 'mineiro', mhp: 390, atk: 31, def: 15, mdef: 9, spd: 9, shield: 4, maxShield: 4, weak: ['fogo', 'corte'], ai: 'mineiro', h: 52, cobres: 18,
    frame: u => mineiroOcoArt(Math.floor(BT.t / 14 + u.x) % 2), dieCols: ['#c88a30', '#f0b850', '#5a3a18'] },
  capataz: { name: 'Capataz de Candeia', kind: 'capataz', boss: true, mhp: 5600, atk: 36, def: 15, mdef: 12, spd: 10, shield: 6, maxShield: 6, weak: ['luz', 'mordida'], ai: 'capataz', h: 112, cobres: 180, ph: 1,
    frame: u => capatazArt(Math.floor(BT.t / (u.armando ? 5 : 16)) % 2, u.ph || 1, !!u.armando), dieCols: ['#5a5a6a', '#c88a30', '#ffd060', '#ffffff'], cancelTxt: 'O apito engasgou! Turno cancelado!' }
});
FICHA.nevoa = 'Névoa: o que a serra esqueceu. Golpes físicos atravessam às vezes; magia acerta sempre. Come Tensão. Fogo e luz.';
FICHA.mineiro = 'Mineiro Oco: um casco de âmbar com a forma de quem trabalhava aqui. Bate pesado. Fogo e corte.';
FICHA.capataz = 'Capataz de Candeia: marca o ponto de quem esquece. Apito do Turno (quebre o escudo!). Luz e mordida; depois de abrir a fornalha, gelo e corte.';
Object.assign(ST_NAME || {}, { esquecido: 'ESQUECEU' });

// a névoa: golpe físico atravessa às vezes
{ const _hfN = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (t && t.kind === 'nevoa' && t.hp > 0 && !o.mag && Math.random() < 0.35) { const [x, y] = unitCenter(t); popNum(x, y - 20, 'ATRAVESSOU', '#c8ccdc'); burst(x, y, 8, ['#e0e4ee', '#aab0c4']); return 0; }
  return _hfN(a, t, pow, o);
}; }
// ESQUECER: na vez seguinte, o aliado fica parado ("...o que eu ia fazer?") e a vez passa
{ const _ocE = openCommand; openCommand = function (m) {
  if (m && m.st && m.st.esquecido > 0) {
    m.st.esquecido = 0; const [x, y] = unitCenter(m);
    popNum(x, y - 30, '...o que eu ia fazer?', '#c8ccdc'); callout(m.name + ' esqueceu a vez', '#c8ccdc', 50);
    endTurn(m, 'leve'); return;
  }
  return _ocE(m);
}; }

Object.assign(AI2, {
  async nevoa(e) {
    const t = foeTarget(); if (!t) return;
    const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
    if (Math.random() < 0.4) {
      callout('Sopro do Esquecimento', '#c8ccdc', 40); sfx('rumble');
      await tw(22, p => { for (let i = 0; i < 5; i++) { const q = (p + i / 5) % 1; bx.globalAlpha = 0.6 * (1 - q); bx.fillStyle = '#e0e4ee'; bx.fillRect(Math.round(ex + (tx - ex) * q), Math.round(ey + (ty - ey) * q + Math.sin(q * 9 + i) * 5), 4, 3); bx.globalAlpha = 1; } });
      const r = await foeStrike(e, t, 0.7, { n: 22, longe: true });
      if (r !== 'perfeito') { const n = Math.min(BT.tension, 10); BT.tension -= n; if (n) popNum(tx, ty - 34, '-' + n + ' Tensão', '#ffa94d'); if (Math.random() < 0.35) { t.st.esquecido = 1; popNum(tx, ty - 26, 'ESQUECEU', '#c8ccdc'); } }
      return;
    }
    callout('Abraço Úmido', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.0, { n: 24 }); await foeBack(e);
  },
  async mineiro(e) {
    const t = foeTarget(); if (!t) return;
    if (e.turns % 3 === 2) {
      callout('Desabamento!', '#ff6b6b', 50); sfx('rumble'); bshake(14, 3);
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); await tw(8, p => { for (let i = 0; i < 3; i++) { bx.fillStyle = '#6a5a50'; bx.fillRect(Math.round(x - 10 + i * 8), Math.round(y - 60 + p * 50), 4, 4); } }); await foeStrike(e, m, 0.6, { n: 20, noCounter: true, longe: true }); }
      return;
    }
    callout('Picareta', '#d0a8ff', 30); await foeLunge(e, t, 14, 16); await foeStrike(e, t, 1.2, { n: 26 }); await foeBack(e);
  },
  async capataz(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('APITO DO TURNO!', '#ffd8a0', 70); sfx('crit'); flashW(4); bshake(18, 4);
      await tw(24, p => { for (let i = 0; i < 3; i++) fxRing(ex + 16, ey - 30, 6 + ((p * 60 + i * 20) % 60), '#ffe8a0', 1 - p); });
      const alvos = alive(BT.party);
      for (const m of alvos) await foeStrike(e, m, e.ph >= 2 ? 1.3 : 1.2, { n: 30, noCounter: true, longe: true });
      const v = pickOne(alive(BT.party)); if (v) { v.st.esquecido = 1; const [x, y] = unitCenter(v); popNum(x, y - 30, 'ESQUECEU O TURNO', '#c8ccdc'); }
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('Ele leva o apito à boca... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(22, p => luzMagia(ex, ey - 40, 16 + p * 20, '#ffb040', p)); return; }
    const filhos = alive(BT.foes).filter(f => f.kind === 'mineiro').length;
    const ops = ['picareta', 'picareta', 'lanterna'];
    if (filhos < 1 && e.turns % 3 === 1) ops.push('chamar');
    const k = pickOne(ops), t = foeTarget(); if (!t) return;
    if (k === 'chamar') {
      callout('"Turno da noite! Todo mundo pro serviço!"', '#ffd8a0', 60); sfx('encounter');
      const c = mkFoe(ENEMY2.mineiro, 150, 164); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; c.oy = (1 - p) * -30; }); c.oy = 0;
    } else if (k === 'lanterna') {
      callout('Lanterna Morta', '#ff6b6b', 50); sfx('rumble');
      await tw(24, p => { luzMagia(ex, ey - 40, 30 - p * 20, '#ffd060', 1 - p); });
      const n = Math.min(BT.tension, 15); BT.tension -= n; callout('Apagou ' + n + ' de Tensão', '#ffa94d', 50);
      await foeStrike(e, t, 0.8, { n: 22, longe: true });
    } else {
      callout('Picareta-Mestra', '#d0a8ff', 40); await foeLunge(e, t, 18, 16); await foeStrike(e, t, e.ph >= 2 ? 1.4 : 1.3, { n: 28 }); await foeBack(e);
    }
  }
});
function fasesCapataz() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(26, 3); flashW(4);
    await say('* O Capataz abre a portinhola do peito. Lá dentro, âmbar quente, pulsando: o ponto batido de cada morador de Candeia.');
    await say('TURNO... EXTRA...', 'capataz');
    await say('[A fornalha aberta: o âmbar lá dentro racha com frio e com corte.]', 'cat');
    e.ph = 2; e.weak = ['gelo', 'corte', 'luz']; e.known = {}; e.maxShield = 7; e.shield = 7; e.spd = 11;
    callout('Fornalha aberta: gelo, corte e luz!', '#bff0ff', 100);
  } }];
}
