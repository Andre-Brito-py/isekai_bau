// ================= INIMIGOS DO CAP. 10: O FAROL DE CEM INVERNOS =================
// ECO DE LEMBRANÇA (uma lembrança solta, com medo: Grito em todos; Lembrança Solta faz esquecer a vez; gelo e mordida).
// Mini-chefe: O CONTRAPESO (PESO MORTO preparado; Gancho atrasa a vez; Vapor queima; fase 2 os potes do bloco acendem:
// ele se cura um pouco por vez e fica mais rápido). Chefes: O ACENDEDOR-MOR (Anotação marca o alvo para levar mais;
// Contabilidade rouba Tensão e cura; chama ecos; LUZ DE CEM INVERNOS preparada; a 40% a luz do Farol mostra a ironia e a
// luta PARA) e O CORAÇÃO DO FAROL (CEM INVERNOS preparado; fase 2 braços de luz e Abraço; a 40% a moça de âmbar ganha
// NOME e lê o Coração: escudo quebra, o grupo cura, todo golpe dele fica LIDO; fase 3 a chama fica branca: duas ações).
Object.assign(ST_NAME, { anotado: 'ANOTADO' });
Object.assign(ENEMY2, {
  ecoL: { name: 'Eco de Lembrança', kind: 'ecoL', fly: true, mhp: 640, atk: 46, def: 12, mdef: 16, spd: 14, shield: 3, maxShield: 3, weak: ['gelo', 'mordida'], ai: 'ecoL', h: 50, cobres: 24,
    frame: u => ecoLArt(Math.floor(BT.t / 8 + u.x)), dieCols: ['#ffe090', '#fff4d0', '#ffffff'] },
  contrapeso: { name: 'O Contrapeso', kind: 'contrapeso', boss: true, mhp: 6800, atk: 48, def: 22, mdef: 12, spd: 10, shield: 9, maxShield: 9, weak: ['corte', 'gelo'], ai: 'contrapeso', h: 140, cobres: 300, ph: 1,
    frame: u => contrapesoArt(Math.floor(BT.t / 10), u.armando ? 'carga' : u._atk > 0 ? 'atk' : '', u.ph || 1), dieCols: ['#4a4a5e', '#8a6a30', '#ffd070', '#ffffff'], cancelTxt: 'A corrente escorregou! O peso não caiu!' },
  vesperB: { name: 'O Acendedor-Mor', kind: 'vesperB', boss: true, mhp: 7200, atk: 49, def: 17, mdef: 20, spd: 13, shield: 9, maxShield: 9, weak: ['mordida', 'corte'], ai: 'vesperB', h: 124, cobres: 0, ph: 1,
    frame: u => vesperBossArt(Math.floor(BT.t / 12), u.armando ? 'carga' : u._atk > 0 ? 'atk' : '', u.ph || 1), dieCols: ['#1a1a24', '#e8dcc0', '#c8a040'], cancelTxt: 'A vara apagou na mão dele! A luz não veio.' },
  coracaoF: { name: 'O Coração do Farol', kind: 'coracaoF', boss: true, mhp: 10500, atk: 50, def: 20, mdef: 20, spd: 11, shield: 10, maxShield: 10, weak: ['gelo', 'mordida'], ai: 'coracaoF', h: 150, cobres: 600, ph: 1,
    frame: u => coracaoFarolArt(Math.floor(BT.t / 7), u.armando ? 'carga' : '', u.ph || 1), dieCols: ['#ffe090', '#ffffff', '#a8803a', '#c8e8ff'], cancelTxt: 'O vidro rachou por dentro! Os cem invernos esfriaram!' }
});
Object.assign(FICHA, {
  ecoL: 'Eco de Lembrança: uma lembrança solta, com medo. O GRITO pega todos; LEMBRANÇA SOLTA faz esquecer a vez. Gelo e mordida.',
  contrapeso: 'O Contrapeso: o peso que puxa a lanterna. PESO MORTO (quebre o escudo!). Gancho atrasa a vez, Vapor queima. Na metade os potes acendem e ele se cura. Corte e gelo.',
  vesperB: 'O Acendedor-Mor: ANOTAÇÃO marca um alvo (leva mais no próximo golpe). Contabilidade rouba Tensão. LUZ DE CEM INVERNOS (quebre o escudo!). Mordida e corte.',
  coracaoF: 'O Coração do Farol: CEM INVERNOS (quebre o escudo!) tira Tensão. Braços de luz agarram e fazem esquecer. Gelo e mordida.'
});
// marcado pelo caderno: o próximo golpe do Acendedor nesse alvo bate 40% mais
{ const _fsA10 = foeStrike; foeStrike = async function (e, t, pow, o = {}) { if (e && e.kind === 'vesperB' && t && t.st && t.st.anotado > 0) { t.st.anotado = 0; pow *= 1.4; callout('"Anotado."', '#e8dcc0', 30); } return _fsA10(e, t, pow, o); }; }
Object.assign(AI2, {
  async ecoL(e) {
    if (Math.random() < 0.3) { callout('Grito', '#fff0c0', 34); await tw(16, p => { const [ex, ey] = unitCenter(e); fxRing(ex, ey - 10, 10 + p * 80, '#fff0c0', 1 - p); }); for (const m of alive(BT.party)) await foeStrike(e, m, 0.55, { n: 22, noCounter: true, longe: true }); return; }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.4) { callout('Lembrança Solta', '#ffe090', 34); const r = await foeStrike(e, t, 0.7, { n: 22, longe: true }); if (r === 'falhou' && Math.random() < 0.5) { t.st.esquecido = 1; const [x, y] = unitCenter(t); popNum(x, y - 34, 'ESQUECEU', '#ffe090'); } return; }
    callout('Mão de Luz', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.05, { n: 22 }); await foeBack(e);
  },
  async contrapeso(e) {
    const [ex, ey] = unitCenter(e);
    if (e.ph >= 2 && e.hp > 0) { e.hp = Math.min(e.mhp, e.hp + Math.round(e.mhp * 0.015)); }
    if (e.charge) {
      e.charge = null; e.armando = false; callout('PESO MORTO!', '#ffffff', 70); sfx('crit'); bshake(26, 4); golpeAtk(e, 30);
      await tw(18, p => { e.oy = -40 * (1 - p) + 10 * p; }); e.oy = 0; flashW(3);
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.4 : 1.3, { n: 28, noCounter: true, longe: true });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A corrente sobe... o bloco inteiro vai cair (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(22, p => { e.oy = -30 * p; }); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Vapor', '#c8c8d8', 36); await tw(18, p => { for (let i = 0; i < 16; i++) { bx.fillStyle = `rgba(220,220,232,${0.6 * (1 - p)})`; bx.fillRect(Math.round(ex - p * 170 + (i * 13) % 40), Math.round(ey - 20 + (i * 7) % 50), 5, 4); } }); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.55, { n: 22, noCounter: true, longe: true }); if (r === 'falhou') m.st.queimado = 2; } return; }
    if (r0 < 0.6) { callout('Gancho', '#d0a8ff', 30); golpeAtk(e, 26); await foeLunge(e, t, 20, 16); const r = await foeStrike(e, t, 1.1, { n: 24 }); await foeBack(e); if (r !== 'perfeito') atrasarVez9(t, 25); return; }
    callout('Pancada de Ferro', '#d0a8ff', 30); golpeAtk(e, 30); await foeLunge(e, t, 18, 18); await foeStrike(e, t, 1.3, { n: 26 }); await foeBack(e);
  },
  async vesperB(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('LUZ DE CEM INVERNOS!', '#ffffff', 80); sfx('crit'); flashW(5); bshake(22, 3);
      await tw(28, p => { bx.globalAlpha = 0.5 * (1 - p); bx.fillStyle = '#fff8e0'; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1; for (let i = 0; i < 12; i++) { bx.fillStyle = '#ffe090'; bx.fillRect(Math.round(ex - p * 200 + i * 6), Math.round(ey - 40 + Math.sin(i + p * 6) * 30), 3, 3); } });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.4 : 1.3, { n: 30, noCounter: true, longe: true, el: 'luz' });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('Ele ergue a vara. O Farol inteiro se inclina para ela... (quebre o escudo!)', '#ff6b6b', 100); sfx('rumble'); await tw(24, p => luzMagia(ex + 20, ey - 50, 40 - p * 30, 'rgba(255,240,200,0.6)', 1 - p)); return; }
    const ecos = alive(BT.foes).filter(f => f.kind === 'ecoL').length;
    if (ecos < 1 && e.turns % 5 === 1) { callout('"Por favor. Ajudem."', '#e8dcc0', 50); sfx('encounter'); const c = mkFoe(ENEMY2.ecoL, 140, 120); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.25 && !(t.st.anotado > 0)) { callout('Anotação', '#e8dcc0', 40); golpeAtk(e, 20); const [tx, ty] = unitCenter(t); await tw(16, p => { txt(t.name, tx, ty - 40 - p * 6, { align: 'center', col: '#e8dcc0', alpha: 1 - p }); }); t.st.anotado = 2; popNum(tx, ty - 30, 'ANOTADO', '#e8dcc0'); return; }
    if (r0 < 0.45) { callout('Contabilidade', '#c8a040', 40); const r = await foeStrike(e, t, 0.8, { n: 22, longe: true }); if (r !== 'perfeito') { const k = Math.min(BT.tension, 15); BT.tension -= k; e.hp = Math.min(e.mhp, e.hp + Math.round(e.mhp * 0.025)); popNum(ex, ey - 40, '+', '#c8a040'); } return; }
    callout('Vara Acesa', '#d0a8ff', 30); golpeAtk(e, 26); await foeLunge(e, t, 20, 16); await foeStrike(e, t, 1.2, { n: 26, el: 'luz' }); await foeBack(e);
  },
  async coracaoF(e) {
    const [ex, ey] = unitCenter(e);
    const vezes = e.ph >= 3 ? 2 : 1;
    for (let v = 0; v < vezes; v++) {
      if (!alive(BT.party).length) return;
      if (e.charge) {
        e.charge = null; e.armando = false; callout('CEM INVERNOS!', '#ffffff', 80); sfx('crit'); flashW(5); bshake(26, 4);
        await tw(32, p => { bx.globalAlpha = 0.45 * (1 - p); bx.fillStyle = '#fff4d0'; bx.beginPath(); bx.arc(ex, ey, 30 + p * 200, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1; });
        BT.tension = Math.max(0, BT.tension - 25);
        for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 3 ? 1.4 : 1.35, { n: 30, noCounter: true, longe: true, el: 'luz' });
        continue;
      }
      if (e.turns % 4 === 3 && v === 0) { e.charge = { t: null }; e.armando = true; callout('A chama incha. O vidro inteiro canta... (quebre o escudo!)', '#ff6b6b', 100); sfx('rumble'); await tw(26, p => luzMagia(ex, ey, 60 - p * 40, 'rgba(255,240,200,0.6)', 1 - p)); continue; }
      const ecos = alive(BT.foes).filter(f => f.kind === 'ecoL').length;
      if (e.ph >= 2 && ecos < 2 && e.turns % 3 === 1 && v === 0) { callout('Lembranças escapam do vidro', '#ffe090', 50); sfx('encounter'); const c = mkFoe(ENEMY2.ecoL, 130 - BT.foes.length * 12, 110 + (BT.foes.length % 2) * 40); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); continue; }
      const t = foeTarget(); if (!t) return;
      const r0 = Math.random();
      if (e.ph >= 2 && r0 < 0.3) { callout('Abraço de Luz', '#ffe090', 40); const [tx, ty] = unitCenter(t); await tw(20, p => { bx.strokeStyle = '#ffe8a0'; bx.lineWidth = 3; bx.beginPath(); bx.moveTo(ex, ey); bx.quadraticCurveTo((ex + tx) / 2, ey - 60, ex + (tx - ex) * p, ey + (ty - ey) * p); bx.stroke(); }); const r = await foeStrike(e, t, 0.9, { n: 24, longe: true, el: 'luz' }); if (r === 'falhou' && t.hp > 0) { t.st.esquecido = 1; const [x, y] = unitCenter(t); popNum(x, y - 34, 'ESQUECEU', '#ffe090'); } continue; }
      if (r0 < 0.55) { callout('Facho', '#fff0c0', 36); await tw(14, p => { bx.globalAlpha = 0.4; bx.fillStyle = '#fff8d8'; bx.fillRect(0, Math.round(80 + Math.sin(p * 6) * 40), W, 14); bx.globalAlpha = 1; }); for (const m of alive(BT.party)) await foeStrike(e, m, 0.6, { n: 20, fast: true, noCounter: true, longe: true, el: 'luz' }); continue; }
      callout('Mão de Vidro', '#d0a8ff', 30); const [tx, ty] = unitCenter(t); await tw(12, p => { bx.fillStyle = '#e8f0ff'; bx.fillRect(Math.round(ex + (tx - ex) * p) - 3, Math.round(ey + (ty - ey) * p) - 3, 7, 7); }); await foeStrike(e, t, e.ph >= 3 ? 1.0 : 1.2, { n: 24, longe: true });
    }
  }
});
function fasesContrapeso10() { return [{ at: 0.5, run: async (e) => {
  sfx('rumble'); bshake(20, 3); flashW(3);
  await say('* Os potes encravados no ferro do Contrapeso acendem, um por um. Cada um é uma pessoa. O peso de cem pessoas puxando a lanterna para cima.');
  await say('Ele tá se alimentando deles. Para de bater nos potes! Bate no ferro!', 'rita');
  await say('[Fase 2: os potes acesos curam o Contrapeso um pouco a cada vez. Corte e gelo.]', 'cat');
  e.ph = 2; e.spd = 12; e.maxShield = 10; e.shield = 10;
} }]; }
function fasesVesper10() { return [{ at: 0.5, run: async (e) => {
  sfx('crit'); flashW(4); bshake(16, 3);
  await say('* A luz do Farol desce pela vara do Acendedor-Mor e se espalha nas costas dele, como asas. Ele não sorri. Ele nunca sorri.');
  await say('Vocês acham que eu gosto disso? Eu odeio. Eu odeio cada pote. Eu sei o nome de cada um. Eu PAGO cada um.', 'vesper');
  e.ph = 2; e.spd = 14; e.maxShield = 10; e.shield = 10;
} }, { at: 0.4, run: async (e) => {
  // a luta para: o Farol, cheio, começa a mostrar o que guarda
  BT._fimVesper10 = true; sfx('rumble'); flashW(6);
  await say('* E então o Farol, cheio demais, começa a MOSTRAR. A luz da lanterna para de ser luz e vira imagem. Lembranças, projetadas no vidro da sala, girando.');
  for (const f of alive(BT.foes)) { f.hp = 0; killFoe(f); }
} }]; }
function fasesCoracao10() { return [{ at: 0.66, run: async (e) => {
  sfx('rumble'); bshake(22, 3); flashW(4);
  await say('* Da armação de latão saem braços de luz. Eles agarram lembranças soltas no ar e puxam de volta para dentro do vidro.');
  await say('* No meio da chama, por um segundo, o rosto de uma menina de fita no cabelo. Depois, só chama.');
  await say('[Fase 2: braços de luz (Abraço: esquecer a vez) e Ecos de Lembrança.]', 'cat');
  e.ph = 2; e.maxShield = 11; e.shield = 11;
} }, { at: 0.4, run: async (e) => { await nomeDaMoca10(e); } }, { at: 0.15, run: async (e) => {
  sfx('crit'); bshake(28, 4); flashW(6);
  await say('* O vidro racha de cima a baixo. A chama de cem invernos fica branca, depois azul. O Coração bate rápido, desesperado, como quem sabe.');
  e.ph = 3; e.spd = 13;
  callout('Ele age DUAS vezes! Acabem com isso!', '#8fe3ff', 100);
} }]; }
