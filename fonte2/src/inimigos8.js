// ================= INIMIGOS DO CAP. 8: O INVERNO ESCURO =================
// FRIAGEM (sombra de frio; Sopro congela a vez; fogo e luz), APAGADOR (guarda dos apagões: APAGA os efeitos bons e
// rouba Tensão; gelo e mordida), LOBO DE FULIGEM (rápido, mordida dupla; fogo e luz), GEADA VIVA (flocos que
// CONGELAM: perde a vez; fogo e mordida). Mini-chefe: CAPITÃO APAGADOR (Grande Apagão preparado zera a Tensão; chama
// apagadores; fase 2 o sobretudo pega fogo e a gaiola do capacete acende: ele fica furioso, golpes dobrados).
// Chefe: A FRIAGEM (Sopro do Inverno, Mão de Gelo, Pingentes; INVERNO ESCURO preparado; fase 2 o manto racha e solta
// Geadas; fase 3 a gaiola abre: fogo e luz em cheio, e ela mira a Lume).
Object.assign(ST_NAME, { congelado: 'CONGELADO' });
Object.assign(ENEMY2, {
  friagem: { name: 'Friagem', kind: 'friagem', fly: true, mhp: 640, atk: 42, def: 12, mdef: 16, spd: 13, shield: 4, maxShield: 4, weak: ['fogo', 'luz'], ai: 'friagem', h: 44, cobres: 24,
    frame: u => friagemArt(Math.floor(BT.t / 10 + u.x) % 2), dieCols: ['#2a3450', '#bff0ff', '#e8fbff'] },
  apagador: { name: 'Apagador', kind: 'apagador', mhp: 660, atk: 42, def: 16, mdef: 12, spd: 12, shield: 5, maxShield: 5, weak: ['gelo', 'mordida'], ai: 'apagador', h: 58, cobres: 30,
    frame: u => apagadorArt(Math.floor(BT.t / 14 + u.x) % 2, !!u.armando), dieCols: ['#2a3a6a', '#c89a30', '#8a8a96'] },
  loboFuligem: { name: 'Lobo de Fuligem', kind: 'loboFuligem', mhp: 600, atk: 44, def: 12, mdef: 10, spd: 17, shield: 3, maxShield: 3, weak: ['fogo', 'luz'], ai: 'loboFuligem', h: 36, cobres: 26,
    frame: u => loboFuligemArt(Math.floor(BT.t / 7 + u.x) % 2), dieCols: ['#1a1a24', '#4a4a5a', '#ff6a3a'] },
  geadaViva: { name: 'Geada Viva', kind: 'geadaViva', fly: true, mhp: 520, atk: 41, def: 10, mdef: 18, spd: 14, shield: 3, maxShield: 3, weak: ['fogo', 'mordida'], ai: 'geadaViva', h: 46, cobres: 20,
    frame: u => geadaVivaArt(Math.floor(BT.t / 6 + u.x) % 8), dieCols: ['#b8e4f4', '#e8fbff', '#ffffff'] },
  capitao: { name: 'Capitão Apagador', kind: 'capitao', boss: true, mhp: 4800, atk: 45, def: 19, mdef: 14, spd: 11, shield: 8, maxShield: 8, weak: ['gelo', 'mordida'], ai: 'capitao', h: 112, cobres: 220, ph: 1,
    frame: u => capitaoArt(Math.floor(BT.t / 16) % 2, u.armando ? 'carga' : u._atk > 0 ? 'atk' : '', u.ph || 1), dieCols: ['#2a2430', '#c89a30', '#ff8a30', '#ffffff'], cancelTxt: 'O cone entortou! Nada de apagão!' },
  friagemB: { name: 'A Friagem', kind: 'friagemB', boss: true, fly: false, mhp: 8000, atk: 47, def: 18, mdef: 18, spd: 11, shield: 9, maxShield: 9, weak: ['fogo'], ai: 'friagemB', h: 148, cobres: 400, ph: 1,
    frame: u => friagemBossArt(Math.floor(BT.t / 9), u.ph || 1, u.armando ? 'carga' : u._atk > 0 ? 'atk' : ''), dieCols: ['#c8e4f0', '#8ab0c8', '#ffffff', '#e86a8a'], cancelTxt: 'O frio rachou por dentro! Inverno cancelado!' }
});
Object.assign(FICHA, {
  friagem: 'Friagem: sombra de frio que só anda no escuro. O Sopro faz perder a vez. Fogo e luz.',
  apagador: 'Apagador: guarda dos apagões. APAGA os efeitos bons do alvo e rouba Tensão. Gelo e mordida.',
  loboFuligem: 'Lobo de Fuligem: rápido, mordida dupla, olhos de brasa. Fogo e luz.',
  geadaViva: 'Geada Viva: floco de gelo do tamanho de um gato. CONGELA: quem leva perde a próxima vez. Fogo e mordida.',
  capitao: 'Capitão Apagador: o Grande Apagão (quebre o escudo!) zera a TENSÃO. Chama apagadores. Na metade, o sobretudo pega fogo e ele fica furioso. Gelo e mordida.',
  friagemB: 'A Friagem: o frio do Inverno Escuro. Inverno Escuro (quebre o escudo!). O manto racha (Geadas); depois a gaiola do peito abre: aí a LUZ também pega, e ela mira a Lume. Fogo.'
});
// CONGELADO: perde a próxima vez (usa o mesmo mecanismo de 'esquecido'; a Lume com Vela Interior não congela)
function congelar(t) { if (!t || t.hp <= 0) return; t.st.esquecido = 1; const [x, y] = unitCenter(t); popNum(x, y - 34, 'CONGELOU', '#bff0ff'); }
function apagarBuffs(t) { if (!t) return; let n = 0; for (const k of ['farol', 'escudo', 'baluarte', 'biblio', 'veu', 'resson', 'regen', 'atkUp', 'magUp']) if (t.st[k]) { t.st[k] = 0; n++; } t.def0 = false; const [x, y] = unitCenter(t); popNum(x, y - 30, n ? 'APAGADO' : 'ABAFADO', '#8a8a96'); }
const golpeAtk = (e, n = 18) => { e._atk = n; };
Object.assign(AI2, {
  async friagem(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.4) { callout('Sopro', '#bff0ff', 30); const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t); await tw(18, p => { for (let i = 0; i < 8; i++) { bx.fillStyle = i % 2 ? '#e8fbff' : '#bff0ff'; bx.fillRect(Math.round(ex + (tx - ex) * p + Math.sin(i + p * 8) * 6), Math.round(ey + (ty - ey) * p + (i - 4) * 2), 2, 2); } }); const r = await foeStrike(e, t, 0.7, { n: 22, longe: true }); if (r === 'falhou' && Math.random() < 0.5) congelar(t); return; }
    callout('Toque Frio', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.05, { n: 22 }); await foeBack(e);
  },
  async apagador(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.45) { e.armando = true; callout('Apagar', '#8a8a96', 40); await foeLunge(e, t, 14, 12); const r = await foeStrike(e, t, 0.8, { n: 22 }); e.armando = false; await foeBack(e); if (r !== 'perfeito') { apagarBuffs(t); const k = Math.min(BT.tension, 15); BT.tension -= k; } return; }
    callout('Haste', '#d0a8ff', 30); await foeLunge(e, t, 14, 14); await foeStrike(e, t, 1.1, { n: 24 }); await foeBack(e);
  },
  async loboFuligem(e) {
    const t = foeTarget(); if (!t) return;
    callout(Math.random() < 0.5 ? 'Mordida Dupla' : 'Bote de Fumaça', '#d0a8ff', 30); await foeLunge(e, t, 10, 16);
    await foeStrike(e, t, 0.55, { n: 18, fast: true }); if (t.hp > 0) await foeStrike(e, t, 0.55, { n: 18, fast: true }); await foeBack(e);
  },
  async geadaViva(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.45 && !(t.st.congelado > 0)) { callout('Congelar', '#bff0ff', 40); const [tx, ty] = unitCenter(t); await tw(18, p => fxRing(tx, ty - 10, 4 + p * 18, '#e8fbff', 1 - p)); const r = await foeStrike(e, t, 0.6, { n: 22, longe: true }); if (r !== 'perfeito') congelar(t); return; }
    callout('Estilhaço de Gelo', '#d0a8ff', 30); await foeLunge(e, t, 12, 10); await foeStrike(e, t, 1.0, { n: 22, fast: true }); await foeBack(e);
  },
  async capitao(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('GRANDE APAGÃO!', '#ffffff', 70); sfx('crit'); bshake(20, 3);
      await tw(30, p => { bx.fillStyle = `rgba(0,0,0,${Math.min(0.85, p * 1.4)})`; bx.fillRect(0, 0, W, H); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; bx.fillStyle = '#ffd070'; bx.fillRect(Math.round(ex + Math.cos(a) * (120 * (1 - p))), Math.round(ey - 60 + Math.sin(a) * (60 * (1 - p))), 3, 3); } });
      BT.tension = 0; popNum(120, 60, 'TENSÃO APAGADA', '#8a8a96');
      for (const m of alive(BT.party)) { const r = await foeStrike(e, m, e.ph >= 2 ? 1.3 : 1.2, { n: 30, noCounter: true, longe: true }); if (r !== 'perfeito') apagarBuffs(m); }
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('Ele ergue o Grande Apagador... a luz da sala é sugada (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(24, p => luzMagia(ex + 8, ey - 70, 30 - p * 20, 'rgba(255,208,112,0.6)', 1 - p)); return; }
    const ap = alive(BT.foes).filter(f => f.kind === 'apagador').length;
    if (ap < 2 && e.turns % 5 === 1) { callout('"APAGADORES! Em forma!"', '#ffd8a0', 60); sfx('encounter'); const c = mkFoe(ENEMY2.apagador, 150 - BT.foes.length * 10, 150); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const vezes = e.ph >= 2 ? 2 : 1;
    for (let v = 0; v < vezes; v++) {
      const t = foeTarget(); if (!t) return;
      if (Math.random() < 0.35) { callout('Abafar', '#8a8a96', 40); golpeAtk(e, 30); await foeLunge(e, t, 16, 16); const r = await foeStrike(e, t, 0.95, { n: 24 }); await foeBack(e); if (r !== 'perfeito') apagarBuffs(t); continue; }
      callout(e.ph >= 2 ? 'Golpe em Brasa' : 'Golpe de Haste', '#d0a8ff', 30); golpeAtk(e, 30); await foeLunge(e, t, 18, 16); const r = await foeStrike(e, t, e.ph >= 2 ? 0.9 : 1.2, { n: 26 }); await foeBack(e); if (e.ph >= 2 && r === 'falhou') t.st.queimado = 2;
    }
  },
  async friagemB(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('INVERNO ESCURO!', '#ffffff', 80); sfx('crit'); flashW(4); bshake(26, 4);
      await tw(36, p => { bx.fillStyle = `rgba(4,8,16,${Math.min(0.9, p * 1.5)})`; bx.fillRect(0, 0, W, H); bx.fillStyle = '#ffffff'; for (let i = 0; i < 60; i++) bx.fillRect(Math.round((i * 53 + p * 300) % W), Math.round((i * 31 + p * 200) % H), 2, 2); });
      BT.tension = Math.max(0, BT.tension - 25);
      for (const m of alive(BT.party)) { const r = await foeStrike(e, m, e.ph >= 3 ? 1.45 : 1.35, { n: 30, noCounter: true, longe: true }); if (r === 'falhou' && Math.random() < 0.4) congelar(m); }
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('Ela abre os braços. A sala inteira escurece... (quebre o escudo!)', '#ff6b6b', 100); sfx('rumble'); await tw(26, p => { bx.fillStyle = `rgba(0,0,10,${p * 0.4})`; bx.fillRect(0, 0, W, H); }); return; }
    const ge = alive(BT.foes).filter(f => f.kind === 'geadaViva').length;
    if (e.ph >= 2 && ge < 2 && e.turns % 3 === 1) { callout('O manto solta flocos vivos', '#bff0ff', 60); sfx('encounter'); const c = mkFoe(ENEMY2.geadaViva, 140 - BT.foes.length * 10, 118 + (BT.foes.length % 2) * 30); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const L = alive(BT.party).find(m => m.id === 'lume');
    const t = e.ph >= 3 && L && Math.random() < 0.4 ? L : foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Sopro do Inverno', '#bff0ff', 40); golpeAtk(e, 34); await tw(26, p => { for (let i = 0; i < 20; i++) { bx.fillStyle = i % 2 ? '#e8fbff' : '#bff0ff'; bx.fillRect(Math.round(ex - p * 200 + Math.sin(i * 3 + p * 9) * 18), Math.round(ey - 40 + (i % 10) * 9), 3, 2); } }); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.7, { n: 24, noCounter: true, longe: true }); if (r === 'falhou' && Math.random() < 0.35) congelar(m); } return; }
    if (r0 < 0.55) { callout('Pingentes', '#e8fbff', 40); golpeAtk(e, 34); for (let i = 0; i < 3; i++) { const m = pickOne(alive(BT.party)); if (!m) break; const [mx, my] = unitCenter(m); await tw(10, p => { bx.fillStyle = '#e8fbff'; bx.fillRect(Math.round(mx - 2), Math.round(my - 90 + p * 70), 4, 12); }); await foeStrike(e, m, 0.6, { n: 18, fast: true, noCounter: true, longe: true }); } return; }
    if (e.ph >= 2 && r0 < 0.7) { callout('Lembrança do Inverno', '#c8d8f0', 50); const [tx, ty] = unitCenter(t); await tw(22, p => fxRing(tx, ty - 20, 30 * (1 - p) + 4, '#c8d8f0', p)); const r = await foeStrike(e, t, 0.8, { n: 22, longe: true }); if (r !== 'perfeito' && t.hp > 0) { t.st.esquecido = 1; popNum(tx, ty - 24, 'LEMBROU DO FRIO', '#c8d8f0'); } return; }
    callout('Mão de Gelo', '#d0a8ff', 30); golpeAtk(e, 34); await foeLunge(e, t, 20, 18); await foeStrike(e, t, 1.15, { n: 26 }); await foeBack(e);
  }
});
// a pose de golpe dura alguns quadros
{ const _du8 = drawUnit; drawUnit = function (u) { if (u && u._atk > 0) u._atk--; return _du8(u); }; }
function fasesCapitao() { return [{ at: 0.5, run: async (e) => {
  sfx('crit'); bshake(18, 3); flashW(3);
  await say('* Uma brasa da Lume pega na barra do sobretudo de fuligem do Capitão. O sobretudo inteiro acende como pavio. E a gaiola vazia do capacete dele, que nunca teve vela, acende SOZINHA.');
  await say('NÃO! Apaga! APAGA ISSO! Eu sou o Capitão dos Apagões, eu NÃO acendo!', 'capitao');
  await say('[Furioso: ele bate DUAS vezes por vez, mais fraco cada uma. Os golpes em brasa queimam.]', 'cat');
  e.ph = 2; e.spd = 13; e.maxShield = 9; e.shield = 9;
} }]; }
function fasesFriagem() { return [{ at: 0.66, run: async (e) => {
  sfx('rumble'); bshake(22, 3); flashW(3);
  await say('* O manto de neve da Friagem racha no peito. Por dentro, uma gaiola de lanterna. Vazia. Uma fita de cabelo cor-de-rosa presa na grade, dura de gelo.');
  await say('Isso... isso é uma lanterna de criança. Daquelas de procissão.', 'rita');
  await say('[Fase 2: o manto solta Geadas Vivas e a Friagem faz LEMBRAR do frio (perde a vez).]', 'cat');
  e.ph = 2; e.maxShield = 10; e.shield = 10; e.spd = 12;
} }, { at: 0.33, run: async (e) => {
  sfx('crit'); bshake(26, 4); flashW(5);
  await say('* A gaiola abre. Dentro dela não tem nada. Só escuro. Um escuro que dá frio de olhar.');
  await say('Ela tá vazia. Ela é um lugar onde tinha uma luz e não tem mais.', 'lume');
  await say('* A Friagem vira o capuz para a Lume. Devagar. Como quem reconhece.');
  e.ph = 3; e.weak = ['fogo', 'luz', 'mordida']; e.known = {}; e.spd = 13;
  callout('A gaiola aberta: LUZ e mordida também! Ela vai atrás da Lume!', '#8fe3ff', 100);
} }]; }
