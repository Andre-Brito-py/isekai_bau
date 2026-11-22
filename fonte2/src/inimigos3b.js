// ================= INIMIGOS DO CAP. 3 (Parte 2): GALERIAS DE FULIGEM =================
// Regra das Galerias: FOGO ALIMENTA FULIGEM (Brasa cura Cinzinhas e a Mãe-Fuligem). Gelo e mordida funcionam; a luz da
// Lume dói na fuligem (fase 2 do chefe). Isso dá vez para os três caminhos: gelo/Grimório, mordida/ferro, luz/Lume.
Object.assign(ENEMY2, {
  cinza: { name: 'Cinzinha', kind: 'cinza', mhp: 200, atk: 18, def: 9, mdef: 8, spd: 11, shield: 3, maxShield: 3, weak: ['gelo', 'mordida'], ai: 'cinza', h: 24, cobres: 12,
    comeFogo: true, frame: u => cinzaArt(Math.floor(BT.t / 12 + u.x) % 3), dieCols: ['#3e3248', '#6a5a70', '#ffb040'] },
  rato: { name: 'Rato-Pavio', kind: 'rato', mhp: 170, atk: 19, def: 8, mdef: 9, spd: 15, shield: 2, maxShield: 2, weak: ['corte', 'mordida'], ai: 'rato', h: 22, cobres: 10,
    frame: u => ratoArt(Math.floor(BT.t / 8 + u.x) % 2), dieCols: ['#8a7a80', '#f2ecdc', '#ffd060'] },
  mae: { name: 'Mãe-Fuligem', kind: 'mae', boss: true, mhp: 4300, atk: 29, def: 13, mdef: 12, spd: 10, shield: 6, maxShield: 6, weak: ['gelo', 'mordida'], ai: 'mae', h: 120, cobres: 150, ph: 1,
    comeFogo: true, frame: u => maeFuligemArt(Math.floor(BT.t / (u.armando ? 4 : 14)) % 2, u.ph || 1), dieCols: ['#382a3e', '#6e5c74', '#ffb040', '#fff0a0'], cancelTxt: 'A fornalha engasgou! Golpe cancelado!' }
});
FICHA.cinza = 'Cinzinha: fuligem que andou. FOGO A ALIMENTA (Brasa cura!). Gelo e mordida desmancham. Quando está quase sumindo, estoura.';
FICHA.rato = 'Rato-Pavio: rato com vela nas costas, rápido. Morde duas vezes. Corte e mordida.';
FICHA.mae = 'Mãe-Fuligem: tudo que queimou lá em cima desce para cá. Fogo a alimenta. Gelo e mordida. Quando a fornalha abrir, a luz dói nela.';
// fogo cura quem come fogo
{ const _hf5 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (t && t.comeFogo && o.el === 'fogo' && t.hp > 0) {
    const n = Math.round(calcDmg(a, t, pow, o) * 0.5); t.hp = Math.min(t.mhp, t.hp + n); t.known.fogo = 'cura';
    const [x, y] = unitCenter(t); popNum(x, y - 6, '+' + n, '#9be58a'); burst(x, y, 12, ['#ffb040', '#3e3248']);
    callout('O fogo ALIMENTA a fuligem!', '#ffb040', 60);
    if (!G.flags.tutComeFogo) { G.flags.tutComeFogo = true; hint('Nas Galerias, fogo alimenta a fuligem: Brasa CURA esses bichos. Use gelo, mordida, a lança ou a luz da Lume.', 320); }
    return 0;
  }
  const r = _hf5(a, t, pow, o);
  // na fase 2, a luz arranca lembranças da Mãe-Fuligem
  if (t && t.kind === 'mae' && t.ph >= 2 && o.el === 'luz' && r > 0) { const L = LEMBR3[(BT.t + t.hp) % LEMBR3.length]; const [x, y] = unitCenter(t); popNum(x, y - 50, L, '#fff0a0'); }
  return r;
}; }
const LEMBR3 = ['"...o cheiro do pão da minha mãe..."', '"...o nome do meu cachorro..."', '"...a música da festa de São João..."', '"...meu irmão rindo no telhado..."', '"...a cor da casa onde eu nasci..."', '"...como se fala obrigado na minha vila..."'];

Object.assign(AI2, {
  async cinza(e) {
    const t = foeTarget(); if (!t) return;
    if (e.hp < e.mhp * 0.28 && !e.estourou) {
      e.estourou = true; callout('A Cinzinha vai ESTOURAR!', '#ff6b6b', 50); await tw(24, p => { const [x, y] = unitCenter(e); fxRing(x, y, 6 + p * 14, '#ffb040', p); e.ox = (BT.t % 2 ? 1 : -1) * p * 2; });
      for (const m of alive(BT.party)) await foeStrike(e, m, 0.8, { n: 22, noCounter: true, st: 'tonto', stT: 1 });
      e.hp = 0; killFoe(e); return;
    }
    callout('Abraço de Cinza', '#a898b8', 30); await foeLunge(e, t, 12, 12);
    await foeStrike(e, t, 1.0, { n: 24, st: Math.random() < 0.4 ? 'tonto' : null, stT: 1 }); await foeBack(e);
  },
  async rato(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.3 && BT.party.some(m => m.hp > 0 && (m.st.vela > 0 || m.st.manto > 0))) {
      const v = BT.party.find(m => m.hp > 0 && (m.st.vela > 0 || m.st.manto > 0)); callout('O rato apaga a vela!', '#ff6b6b', 40); await foeLunge(e, v, 10, 10); v.st.vela = 0; v.st.manto = 0; await foeStrike(e, v, 0.6, { n: 20, fast: true }); await foeBack(e); return;
    }
    callout('Mordida Dupla', '#d0a8ff', 30); await foeLunge(e, t, 10, 10);
    await foeStrike(e, t, 0.6, { n: 20, fast: true }); if (t.hp > 0) await foeStrike(e, t, 0.6, { n: 16, fast: true }); await foeBack(e);
  },
  async mae(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; callout('FORNALHA!', '#ff6b6b', 60); sfx('crit'); flashW(4); bshake(16, 4);
      await tw(18, p => { luzMagia(ex, ey + 20, 40 + p * 60, '#ff9a30', 1 - p * 0.5); });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.35 : 1.2, { n: 30, el: 'fogo', noCounter: true, st: 'queimado', stT: 2, longe: true });
      e.pose = null; return;
    }
    if (e.turns % 4 === 3) {
      e.charge = { t: null }; callout('A fornalha ruge... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble');
      await tw(24, p => { luzMagia(ex, ey + 20, 20 + p * 30, '#ff9a30', p); for (let i = 0; i < 3; i++) part({ forma: 'chama', x: ex + rand(-12, 12), y: ey + 20, vy: -rand(0.4, 1), life: 18, s: 4 }); }); return;
    }
    const filhos = alive(BT.foes).filter(f => f.kind === 'cinza').length, opts = ['abraco', 'cinzas', 'abraco'];
    if (filhos < (e.ph >= 2 ? 2 : 1) && e.turns % 3 === 1) opts.push('filha');
    if (BT.tension >= 30 || BT.party.some(m => m.st.vela > 0 || m.st.manto > 0)) opts.push('engole');
    const k = pickOne(opts), t = foeTarget(); if (!t) return;
    if (k === 'filha') {
      callout('Ela cospe uma Cinzinha!', '#a898b8', 50); sfx('encounter');
      const pos = [[140, 150], [212, 168]].find(([x]) => !alive(BT.foes).some(f => Math.abs(f.x - x) < 12)) || [150, 160];
      const c = mkFoe(ENEMY2.cinza, pos[0], pos[1]); c.ct = 0; c.alpha = 0; BT.foes.push(c);
      await tw(20, p => { c.alpha = p; const q = p; bx.fillStyle = '#3e3248'; bx.fillRect(Math.round(ex + (pos[0] - ex) * q), Math.round(ey + (pos[1] - 20 - ey) * q - Math.sin(q * Math.PI) * 30), 5, 5); });
    } else if (k === 'cinzas') {
      callout('Chuva de Cinzas', '#a898b8', 50);
      for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); for (let i = 0; i < 10; i++) part({ forma: 'fumaca', x: x + rand(-14, 14), y: y - 50, vy: 1.2, life: 30, s: 3, col: '#2a2030', col2: '#5a4a60' }); await foeStrike(e, m, 0.65, { n: 22, noCounter: true, longe: true, st: Math.random() < 0.3 ? 'tonto' : null, stT: 1 }); }
    } else if (k === 'engole') {
      callout('Engole a Luz!', '#ff6b6b', 50); sfx('rumble');
      await tw(26, p => { for (const m of alive(BT.party)) { const [x, y] = unitCenter(m); const q = p; bx.fillStyle = '#ffe080'; bx.globalAlpha = 1 - q; bx.fillRect(Math.round(x + (ex - x) * q), Math.round(y + (ey + 20 - y) * q), 2, 2); bx.globalAlpha = 1; } luzMagia(ex, ey + 20, 30, '#ffb040', p); });
      const tir = Math.min(BT.tension, 20); BT.tension -= tir; for (const m of BT.party) { m.st.vela = 0; m.st.manto = 0; }
      const h = Math.round(e.mhp * 0.025); e.hp = Math.min(e.mhp, e.hp + h); popNum(ex, ey - 40, '+' + h, '#9be58a'); callout('Apagou as velas e comeu ' + tir + ' de Tensão', '#ffa94d', 60);
    } else {
      callout('Abraço de Fumaça', '#d0a8ff', 40);
      await foeStrike(e, t, e.ph >= 2 ? 1.35 : 1.2, { n: 30, st: 'tonto', stT: 1 });
    }
  }
});
function fasesMae() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(30, 3); flashW(4);
    await say('* A Mãe-Fuligem abre a fornalha do peito. Lá dentro, centenas de luzinhas giram, presas, como vaga-lumes num pote.');
    await say('[Leitura: cada luz é uma lembrança. De gente. Muita gente. Elas não queimaram: ficaram presas na fuligem.]', 'cat');
    await say('Se a luz dela tá presa lá dentro... a minha luz consegue chegar. Deixa comigo!', 'lume');
    e.ph = 2; e.weak = ['luz', 'gelo', 'corte']; e.known = {}; e.maxShield = 7; e.shield = 7; e.spd = 11;
    callout('Fornalha aberta: LUZ, gelo e corte!', '#fff0a0', 100);
  } }];
}
