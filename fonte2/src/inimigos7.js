// ================= INIMIGOS DO CAP. 7: A MINA DE ORIGEM =================
// Acampamento/Bombas: CÃO-LANTERNA (rápido; uiva e chama outro), VÁLVULA VIVA (jato de vapor em todos; enche e ESTOURA,
// preparado). Andar 1 do jogo 1, "pela lógica de quem extrai": RATO-DE-VELA AMBARINO (coleira de âmbar; mordida dupla;
// vela que queima), COGUMELO DE ÂMBAR (esporos dourados: TONTO), MORCEGO CARIMBADO (asas de papel com o selo da Coroa:
// SELADO). Mini-chefes: A BROCA (perfura; superaquece) e o GUARDA-MUSGO AMBARINO (o primeiro chefe do jogo 1, sendo
// drenado por um cano). Chefe: O EXTRATOR (bomba-coração: suga PM e Tensão, Bombeamento preparado; fase 2 lê o grupo e
// faz esquecer; fase 3 o núcleo aberto).
Object.assign(ENEMY2, {
  caoLanterna: { name: 'Cão-Lanterna', kind: 'caoLanterna', mhp: 560, atk: 40, def: 13, mdef: 10, spd: 16, shield: 3, maxShield: 3, weak: ['gelo', 'luz'], ai: 'caoLanterna', h: 34, cobres: 22,
    frame: u => caoLanternaArt(Math.floor(BT.t / 8 + u.x) % 2), dieCols: ['#6a5040', '#ffd070', '#2a3a7a'] },
  valvulaViva: { name: 'Válvula Viva', kind: 'valvulaViva', mhp: 620, atk: 38, def: 19, mdef: 12, spd: 9, shield: 5, maxShield: 5, weak: ['gelo', 'mordida'], ai: 'valvulaViva', h: 50, cobres: 26,
    frame: u => valvulaVivaArt(Math.floor(BT.t / 10 + u.x) % 4, !!u.armando), dieCols: ['#c83a2a', '#e8e8f0', '#c89a30'], cancelTxt: 'A válvula desafogou! Nada de estouro!' },
  ratoVelaA: { name: 'Rato-de-Vela Ambarino', kind: 'ratoVelaA', mhp: 480, atk: 38, def: 11, mdef: 11, spd: 15, shield: 3, maxShield: 3, weak: ['gelo', 'corte'], ai: 'ratoVelaA', h: 30, cobres: 18,
    frame: u => ratoVelaAArt(Math.floor(BT.t / 8 + u.x) % 2), dieCols: ['#8a7a6a', '#ffd070', '#f2ecdc'] },
  cogumeloA: { name: 'Cogumelo de Âmbar', kind: 'cogumeloA', mhp: 600, atk: 37, def: 14, mdef: 16, spd: 9, shield: 4, maxShield: 4, weak: ['fogo', 'corte'], ai: 'cogumeloA', h: 40, cobres: 20,
    frame: u => cogumeloAArt(Math.floor(BT.t / 14 + u.x) % 2), dieCols: ['#c87a2a', '#ffd070', '#d8c8a8'] },
  morcegoSelo: { name: 'Morcego Carimbado', kind: 'morcegoSelo', fly: true, mhp: 420, atk: 39, def: 9, mdef: 12, spd: 17, shield: 2, maxShield: 2, weak: ['fogo', 'luz'], ai: 'morcegoSelo', h: 26, cobres: 18,
    frame: u => morcegoSeloArt(Math.floor(BT.t / 5 + u.x) % 2), dieCols: ['#f2ecdc', '#c83a3a', '#ffe0a0'] },
  broca: { name: 'A Broca', kind: 'broca', boss: true, mhp: 5200, atk: 41, def: 18, mdef: 12, spd: 10, shield: 7, maxShield: 7, weak: ['gelo', 'mordida'], ai: 'broca', h: 96, cobres: 160, ph: 1,
    frame: u => brocaArt(Math.floor(BT.t / 4) % 4, !!u.armando, u.ph || 1), dieCols: ['#6a5a4a', '#c8c8d8', '#ffd070', '#ffffff'], cancelTxt: 'A broca travou! Nada de broca total!' },
  musgoA: { name: 'Guarda-Musgo Ambarino', kind: 'musgoA', boss: true, mhp: 6000, atk: 42, def: 16, mdef: 14, spd: 10, shield: 7, maxShield: 7, weak: ['fogo', 'corte'], ai: 'musgoA', h: 104, cobres: 180, ph: 1,
    frame: u => musgoAArt(Math.floor(BT.t / 16) % 2, u.ph || 1), dieCols: ['#3a6a36', '#8ac860', '#ffd070', '#8a8090'], cancelTxt: 'O musgo se soltou! Nada de terremoto!' },
  extrator: { name: 'O Extrator', kind: 'extrator', boss: true, mhp: 8400, atk: 44, def: 18, mdef: 15, spd: 10, shield: 8, maxShield: 8, weak: ['gelo', 'mordida'], ai: 'extrator', h: 120, cobres: 300, ph: 1,
    frame: u => extratorArt(Math.floor(BT.t / 10) % 2, u.ph || 1, !!u.armando), dieCols: ['#4a4450', '#c89a30', '#ffd070', '#ffffff'], cancelTxt: 'O pistão engasgou! Bombeamento cancelado!' }
});
Object.assign(FICHA, {
  caoLanterna: 'Cão-Lanterna: o cão da Guarda nas minas. Rápido; UIVA e chama outro. Gelo e luz.',
  valvulaViva: 'Válvula Viva: jato de vapor em todos; quando enche, ESTOURA (quebre o escudo!). Gelo e mordida.',
  ratoVelaA: 'Rato-de-Vela Ambarino: um velho conhecido do Andar 1, agora com coleira de âmbar. Mordida dupla; a vela queima. Gelo e corte.',
  cogumeloA: 'Cogumelo de Âmbar: o Cogumelo Tossidor do Andar 1, cheio de âmbar. Esporos dourados deixam TONTO. Fogo e corte.',
  morcegoSelo: 'Morcego Carimbado: o Morcego de Papel do Andar 1, agora com o selo da Coroa nas asas. Carimbo deixa SELADO. Fogo e luz.',
  broca: 'A Broca: perfura até o Coração. Cascalho em todos, Broca Total (quebre o escudo!). A 50% superaquece: o gelo racha mais.',
  musgoA: 'Guarda-Musgo Ambarino: o primeiro chefe que você venceu, lá no começo. Um cano de âmbar nas costas está drenando ele. Fogo e corte.',
  extrator: 'O Extrator: a bomba-coração. Suga PM e Tensão, Bombeamento (quebre o escudo!). Depois LÊ vocês: faz esquecer. No fim, o núcleo aberto.'
});
function chamaFoe(k, txt_) { const c = mkFoe(ENEMY2[k], 150 - BT.foes.length * 8, 150 + (BT.foes.length % 2) * 14); c.ct = 0; c.alpha = 0; BT.foes.push(c); callout(txt_, '#ffd8a0', 60); sfx('encounter'); return tw(18, p => { c.alpha = p; }); }
Object.assign(AI2, {
  async caoLanterna(e) {
    const t = foeTarget(); if (!t) return;
    if (!e.uivou && alive(BT.foes).length < 3 && Math.random() < 0.3) { e.uivou = true; await tw(20, p => { const [x, y] = unitCenter(e); fxRing(x, y - 20, 6 + p * 30, '#ffd070', 1 - p); }); await chamaFoe('caoLanterna', '"AUUUUU!" Outro cão responde.'); return; }
    callout(Math.random() < 0.5 ? 'Mordida' : 'Bote', '#d0a8ff', 30); await foeLunge(e, t, 10, 16); await foeStrike(e, t, 1.1, { n: 20, fast: true }); await foeBack(e);
  },
  async valvulaViva(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) { e.charge = null; e.armando = false; callout('ESTOURO!', '#ffffff', 60); sfx('crit'); flashW(3); bshake(14, 3); await tw(20, p => { bx.globalAlpha = 0.6 * (1 - p); bx.fillStyle = '#e8e8f0'; bx.beginPath(); bx.arc(ex, ey, 20 + p * 140, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1; }); for (const m of alive(BT.party)) await foeStrike(e, m, 1.25, { n: 26, noCounter: true, longe: true }); return; }
    if ((e.turns || 0) % 3 === 2) { e.charge = { t: null }; e.armando = true; callout('A pressão sobe... (quebre o escudo!)', '#ff6b6b', 80); sfx('rumble'); return; }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.5) { callout('Jato de Vapor', '#e8e8f0', 40); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.65, { n: 20, noCounter: true, longe: true }); if (r === 'falhou' && Math.random() < 0.4) m.st.queimado = 2; } return; }
    callout('Golpe de Roda', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.1, { n: 24 }); await foeBack(e);
  },
  async ratoVelaA(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.5) { callout('Mordida Dupla', '#d0a8ff', 30); await foeLunge(e, t, 10, 14); await foeStrike(e, t, 0.6, { n: 18, fast: true }); await foeStrike(e, t, 0.6, { n: 18, fast: true }); await foeBack(e); return; }
    callout('Vela Acesa', '#ffa94d', 30); const r = await foeStrike(e, t, 0.9, { n: 22, longe: true }); if (r !== 'perfeito' && t.hp > 0) { t.st.queimado = 2; const [x, y] = unitCenter(t); popNum(x, y - 26, 'QUEIMADO', '#ffa94d'); }
  },
  async cogumeloA(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.45) { callout('Esporos de Âmbar', '#ffd070', 40); const [ex, ey] = unitCenter(e); await tw(24, p => { for (let i = 0; i < 14; i++) { bx.fillStyle = i % 2 ? '#ffd070' : '#fff0b0'; bx.fillRect(Math.round(ex - p * 120 + Math.sin(i * 3 + p * 6) * 30), Math.round(ey - 20 + Math.cos(i * 2) * 20), 2, 2); } }); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.5, { n: 20, noCounter: true, longe: true }); if (r !== 'perfeito' && Math.random() < 0.35 && m.hp > 0) { m.st.tonto = 1; m.ct = Math.max(0, m.ct - 20); } } return; }
    callout('Cabeçada', '#d0a8ff', 30); await foeLunge(e, t, 12, 14); await foeStrike(e, t, 1.05, { n: 24 }); await foeBack(e);
  },
  async morcegoSelo(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.4 && !(t.st.selado > 0)) { callout('Carimbo Voador', '#c83a3a', 40); await foeLunge(e, t, 14, 12); const r = await foeStrike(e, t, 0.8, { n: 20, fast: true }); await foeBack(e); if (r !== 'perfeito' && typeof selar === 'function') selar(t, 1); return; }
    callout('Rasante de Papel', '#d0a8ff', 30); await foeLunge(e, t, 14, 12); await foeStrike(e, t, 1.0, { n: 20, fast: true }); await foeBack(e);
  },
  async broca(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) { e.charge = null; e.armando = false; callout('BROCA TOTAL!', '#ffffff', 70); sfx('crit'); flashW(4); bshake(22, 4); await tw(26, p => { for (let i = 0; i < 20; i++) { bx.fillStyle = i % 3 ? '#8a7a6a' : '#ffd070'; bx.fillRect(Math.round(ex - p * 200 + Math.sin(i * 7) * 20), Math.round(ey - 30 + (i % 8) * 8), 4, 3); } }); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, e.ph >= 2 ? 1.5 : 1.4, { n: 30, noCounter: true, longe: true }); if (e.ph >= 2 && r === 'falhou') m.st.queimado = 2; } return; }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A broca gira cada vez mais rápido... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); return; }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.45) { callout('Cascalho', '#8a7a6a', 40); sfx('rumble'); for (const m of alive(BT.party)) await foeStrike(e, m, 0.72, { n: 22, noCounter: true, longe: true }); return; }
    callout('Perfurar', '#d0a8ff', 30); await foeLunge(e, t, 18, 16); const r = await foeStrike(e, t, 1.3, { n: 26 }); await foeBack(e); if (e.ph >= 2 && r !== 'perfeito') t.st.queimado = 2;
  },
  async musgoA(e) {
    const [ex, ey] = unitCenter(e);
    if (e.ph >= 2 && e.hp > e.mhp * 0.06) { const d = Math.round(e.mhp * 0.025); e.hp -= d; popNum(ex + 30, ey - 60, '-' + d + ' (o cano suga)', '#ffd070'); }
    if (e.charge) { e.charge = null; e.armando = false; callout('TERREMOTO VERDE!', '#8ac860', 70); sfx('crit'); bshake(24, 4); flashW(3); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 1.4, { n: 30, noCounter: true }); if (r === 'falhou' && m.hp > 0) { m.st.tonto = 1; m.ct = Math.max(0, m.ct - 25); } } return; }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('O chão inteiro range... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Abraço de Musgo', '#8ac860', 40); await foeLunge(e, t, 14, 16); const r = await foeStrike(e, t, 0.9, { n: 24 }); await foeBack(e); if (r !== 'perfeito' && t.hp > 0) { t.ct = 0; t.st.tonto = 1; const [x, y] = unitCenter(t); popNum(x, y - 26, 'PRESO NO MUSGO', '#8ac860'); } return; }
    if (r0 < 0.6) { callout('Esporos Velhos', '#a8c870', 40); for (const m of alive(BT.party)) await foeStrike(e, m, 0.7, { n: 22, noCounter: true, longe: true }); return; }
    callout('Raiz', '#d0a8ff', 30); await foeLunge(e, t, 16, 16); await foeStrike(e, t, 1.25, { n: 26 }); await foeBack(e);
  },
  async extrator(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) { e.charge = null; e.armando = false; callout('BOMBEAMENTO!', '#ffffff', 70); sfx('crit'); flashW(6); bshake(26, 4); await tw(28, p => { bx.fillStyle = `rgba(255,208,112,${0.6 * (1 - p)})`; bx.fillRect(0, 0, W, H); for (let i = 0; i < 8; i++) { bx.fillStyle = '#ffd070'; bx.fillRect(Math.round(ex - p * 160 - i * 10), Math.round(ey - 10 + Math.sin(p * 10 + i) * 30), 6, 6); } }); for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 3 ? 1.6 : 1.5, { n: 30, noCounter: true, longe: true }); return; }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('O pistão desce até o fundo... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(22, p => luzMagia(ex, ey, 14 + p * 30, 'rgba(255,208,112,0.6)', p)); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.3) {
      callout(e.ph >= 2 ? 'Leitura' : 'Sucção', '#ffd070', 40); const [tx, ty] = unitCenter(t);
      await tw(22, p => { for (let i = 0; i < 6; i++) { const q = (p + i / 6) % 1; bx.fillStyle = '#ffd070'; bx.fillRect(Math.round(tx + (ex - tx) * q), Math.round(ty - 10 + (ey - ty) * q + Math.sin(q * 9 + i) * 6), 2, 2); } });
      const r = await foeStrike(e, t, 0.75, { n: 22, longe: true });
      if (r !== 'perfeito') { const n = Math.min(t.mp || 0, 10); if (n) { t.mp -= n; popNum(tx, ty - 30, '-' + n + ' PM', '#8ab8ff'); } const k = Math.min(BT.tension, 12); BT.tension -= k; if (e.ph >= 2 && Math.random() < 0.45 && t.hp > 0) { t.st.esquecido = 1; popNum(tx, ty - 20, 'LIDO', '#ffd070'); } }
      return;
    }
    if (r0 < 0.6) { callout('Jato de Âmbar', '#ffd070', 40); for (const m of alive(BT.party)) await foeStrike(e, m, 0.75, { n: 22, noCounter: true, longe: true }); return; }
    callout('Pistão', '#d0a8ff', 30); await foeLunge(e, t, 14, 18); await foeStrike(e, t, 1.3, { n: 26 }); await foeBack(e);
  }
});
function fasesBroca() { return [{ at: 0.5, run: async (e) => { sfx('rumble'); bshake(20, 3); await say('* A broca range, vermelha de quente. O metal brilha. O cheiro é de ferro queimado e âmbar fervendo.'); await say('[Superaquecida: o GELO racha o metal. Os golpes dela agora queimam.]', 'cat'); e.ph = 2; e.weak = ['gelo', 'mordida', 'corte']; e.known = {}; e.maxShield = 8; e.shield = 8; } }]; }
function fasesMusgo() { return [{ at: 0.5, run: async (e) => {
  sfx('rumble'); bshake(16, 2);
  await say('* O cano nas costas do Guarda-Musgo dá um tranco. O âmbar sobe mais rápido. O gigante de pedra e musgo geme. Um som velho. Conhecido.');
  await say('[Registro: Guarda-Musgo. Andar 1. O primeiro chefe que você venceu, quando ainda era um caixote. Ele está sendo drenado. Cada vez dele custa vida a ele mesmo.]', 'cat');
  await say('Ele não quer lutar. Ele quer que tirem o cano.', 'lume');
  e.ph = 2; e.weak = ['fogo', 'corte', 'luz']; e.known = {}; e.spd = 11;
} }]; }
function fasesExtrator() { return [{ at: 0.6, run: async (e) => {
  sfx('rumble'); bshake(22, 3); flashW(3);
  await say('* As mangueiras do Extrator se viram. Para vocês. A máquina para de sugar a masmorra e começa a LER o grupo.');
  await say('Ela... ela tá puxando! Eu sinto puxando! A minha mãe, o mercado, a...', 'rita');
  await say('[Fase de leitura: os golpes dela fazem esquecer a vez. A Lume não esquece.]', 'cat');
  e.ph = 2; e.maxShield = 9; e.shield = 9; e.spd = 11;
} }, { at: 0.3, run: async (e) => {
  sfx('crit'); bshake(24, 4); flashW(4);
  await say('* A câmara de vidro do Extrator racha. O núcleo fica à mostra, vermelho, batendo como um coração com pressa.');
  e.ph = 3; e.weak = ['gelo', 'mordida', 'fogo', 'luz']; e.known = {}; e.spd = 12;
  callout('O núcleo aberto: fogo e luz também!', '#8fe3ff', 90);
} }]; }
