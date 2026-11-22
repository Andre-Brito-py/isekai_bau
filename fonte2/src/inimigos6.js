// ================= INIMIGOS DO CAP. 6: A CIDADE DOS PAVIOS =================
// SELO VIVO (carimbo de latão: CARIMBAR deixa SELADO = sem técnicas, runas, dupla e super por uma vez; gelo e mordida),
// FRASCO RACHADO (lembrança fugida da prateleira: SAUDADE faz esquecer a vez; ao quebrar, a lembrança vai embora e
// cura um pouco o grupo; fogo e corte), CAÇADORA DE RECOMPENSA (rede que atrasa a vez, virote, e lê o cartaz: fica
// mais forte; gelo e fogo), o mini-chefe TIAGO, HERÓI Nº 30 (Avaliação do Cobrador dá BILHETE: o próximo golpe naquele
// aliado dói mais; TROCO: posição de contra-golpe, devolve golpe FÍSICO; Passagem Só de Ida preparada) e o chefe
// SELADORA REAL (Carimbo selador, Esteira que empurra a vez, PRENSA REAL preparada; fase 2: o tanque racha e solta
// Frascos Rachados; fase 3: SELO REAL em todos).
Object.assign(ST_NAME || {}, { selado: 'SELADO', bilhete: 'BILHETE' });
Object.assign(ENEMY2, {
  seloVivo: { name: 'Selo Vivo', kind: 'seloVivo', mhp: 520, atk: 36, def: 18, mdef: 12, spd: 10, shield: 4, maxShield: 4, weak: ['gelo', 'mordida'], ai: 'seloVivo', h: 52, cobres: 24,
    frame: u => seloVivoArt(Math.floor(BT.t / 14 + u.x) % 2, !!u.armando), dieCols: ['#c89a30', '#8a2a2a', '#e83a3a', '#ffffff'] },
  frascoR: { name: 'Frasco Rachado', kind: 'frascoR', fly: true, mhp: 360, atk: 34, def: 10, mdef: 14, spd: 14, shield: 3, maxShield: 3, weak: ['fogo', 'corte'], ai: 'frascoR', h: 40, cobres: 16,
    frame: u => frascoRArt(Math.floor(BT.t / 8 + u.x) % 2), dieCols: ['#ffd070', '#fff0b0', '#e8e8f8', '#ffffff'] },
  cacaRec: { name: 'Caçadora de Recompensa', kind: 'cacaRec', mhp: 560, atk: 37, def: 14, mdef: 12, spd: 13, shield: 4, maxShield: 4, weak: ['gelo', 'fogo'], ai: 'cacaRec', h: 56, cobres: 34,
    frame: u => cacaRecArt(Math.floor(BT.t / 16 + u.x) % 2), dieCols: ['#5a3a2a', '#3a4a3a', '#e8e0d0'] },
  tiago: { name: 'Tiago, Herói nº 30', kind: 'tiago', boss: true, mhp: 4900, atk: 38, def: 15, mdef: 15, spd: 13, shield: 6, maxShield: 6, weak: ['gelo', 'corte'], ai: 'tiago', h: 68, cobres: 0,
    frame: u => tiagoArt(Math.floor(BT.t / 14) % 2, u.armando ? 'atk' : u.troco ? 'troco' : u.ph >= 2 ? 'hes' : ''), dieCols: ['#2a4aa0', '#d8aa40', '#ffffff'], cancelTxt: 'O picotador travou! Passagem cancelada!' },
  seladora: { name: 'Seladora Real', kind: 'seladora', boss: true, mhp: 7200, atk: 41, def: 17, mdef: 13, spd: 10, shield: 7, maxShield: 7, weak: ['gelo', 'mordida'], ai: 'seladora', h: 118, cobres: 260, ph: 1,
    frame: u => seladoraBossArt(Math.floor(BT.t / 12) % 2, u.ph || 1, !!u.armando), dieCols: ['#c89a30', '#5a5060', '#ffd070', '#ff5a4a', '#ffffff'], cancelTxt: 'A prensa engasgou! Nada de carimbo!' }
});
Object.assign(FICHA, {
  seloVivo: 'Selo Vivo: carimbo de latão da Casa do Selo. CARIMBAR deixa SELADO (sem técnicas, runas, dupla e super na próxima vez). Gelo e mordida.',
  frascoR: 'Frasco Rachado: uma lembrança que fugiu da prateleira. SAUDADE faz esquecer a vez. Quebrado, a lembrança vai para casa (cura o grupo). Fogo e corte.',
  cacaRec: 'Caçadora de Recompensa: rede que atrasa, virote de longe, e quando lê o cartaz de vocês fica com MAIS vontade. Gelo e fogo.',
  tiago: 'Tiago, Herói nº 30: o ex-cobrador do 31. BILHETE (quem ele avalia leva mais dano), TROCO (não bata com o corpo: ele devolve!), Passagem Só de Ida (quebre o escudo!). Gelo e corte.',
  seladora: 'Seladora Real: tampa e carimba lembranças. CARIMBO sela, ESTEIRA atrasa a vez, PRENSA REAL (quebre o escudo!). O tanque guarda lembranças: quebre os frascos que fugirem. Gelo e mordida.'
});
// ---------- SELADO: sem técnicas, runas, dupla e super ----------
{ const _ocS = openCommand; openCommand = function (m) {
  BT.seladoAgora = false;
  if (m && m.st && m.st.selado > 0) { m.st.selado--; BT.seladoAgora = true; const [x, y] = unitCenter(m); popNum(x, y - 30, 'SELADO', '#e83a3a'); }
  return _ocS(m);
}; }
for (const c of CMD) if (['tecnica', 'runas', 'dupla', 'super'].includes(c.k)) { const n0 = c.need, w0 = c.why; c.need = () => !BT.seladoAgora && (!n0 || n0()); Object.defineProperty(c, 'why', { get: () => BT.seladoAgora ? 'SELADO: só ataque, item, defender' : w0, configurable: true }); }
{ const _dcS = doCommand; doCommand = function (m, k) { if (BT.seladoAgora && ['tecnica', 'runas', 'dupla', 'super'].includes(k)) { if (window.BOT) k = 'atacar'; else { callout('SELADO: só ataque, item ou defender', '#e83a3a', 50); sfx('cancel'); return Promise.resolve(false); } } return _dcS.call(this, m, k); }; }
function selar(t, n = 1) { if (!t || t.hp <= 0) return; t.st.selado = Math.max(t.st.selado || 0, n); const [x, y] = unitCenter(t); popNum(x, y - 34, 'SELADO!', '#e83a3a'); burst(x, y - 10, 10, ['#c83a3a', '#ffe0a0']); }
// ---------- BILHETE: o próximo golpe dói mais ----------
{ const _hmB = hurtMember; hurtMember = function (m, d0, o = {}) { if (m && m.st && m.st.bilhete > 0 && d0 > 0) { m.st.bilhete = 0; d0 = Math.round(d0 * 1.4); const [x, y] = unitCenter(m); popNum(x, y - 40, 'BILHETE PICOTADO!', '#ffd060'); } return _hmB.call(this, m, d0, o); }; }
// ---------- TROCO: golpe com o corpo no Tiago em posição de troco volta para quem bateu ----------
{ const _hfT = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  const r = _hfT.call(this, a, t, pow, o);
  if (t && t.kind === 'tiago' && t.troco && a && a.side === 'p' && !o.mag && a.hp > 0 && (r || 0) > 0) {
    const d = Math.max(1, Math.round(r * 0.55)); const [x, y] = unitCenter(t); popNum(x, y - 44, 'TROCO!', '#ffd060'); sfx('guard');
    hurtMember(a, d); const [ax, ay] = unitCenter(a); burst(ax, ay, 8, ['#d8aa40', '#ffe08a']);
  }
  // Frasco Rachado quebrado: a lembrança vai para casa
  if (t && t.kind === 'frascoR' && t.hp <= 0 && !t._foi) { t._foi = true; const [x, y] = unitCenter(t); popNum(x, y - 20, 'A lembrança foi para casa', '#ffd070'); for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.06)); }
  return r;
}; }
const soma = (e, s) => { e.turns = (e.turns || 0); return e.turns % s; };
Object.assign(AI2, {
  async seloVivo(e) {
    const t = foeTarget(); if (!t) return;
    const [tx, ty] = unitCenter(t);
    if (Math.random() < 0.4 && !(t.st.selado > 0)) {
      e.armando = true; callout('Carimbar', '#e83a3a', 40); await foeLunge(e, t, 14, 12);
      await tw(10, p => { bx.fillStyle = '#c83a3a'; bx.globalAlpha = 1 - p; bx.fillRect(Math.round(tx - 10), Math.round(ty - 8), 20, 6); bx.globalAlpha = 1; });
      const r = await foeStrike(e, t, 0.85, { n: 22 }); e.armando = false; await foeBack(e);
      if (r !== 'perfeito') selar(t, 1);
      return;
    }
    callout('Pisão de Latão', '#d0a8ff', 30); await foeLunge(e, t, 12, 14); await foeStrike(e, t, 1.1, { n: 24 }); await foeBack(e);
  },
  async frascoR(e) {
    const t = foeTarget(); if (!t) return;
    const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
    if (Math.random() < 0.4) {
      callout('Saudade', '#ffd070', 40); sfx('rune');
      await tw(22, p => { for (let i = 0; i < 6; i++) { const q = (p + i / 6) % 1; bx.globalAlpha = 0.7 * (1 - q); bx.fillStyle = i % 2 ? '#ffd070' : '#fff0b0'; bx.fillRect(Math.round(ex + (tx - ex) * q + Math.sin(q * 8 + i) * 6), Math.round(ey + (ty - ey) * q - 10), 2, 2); bx.globalAlpha = 1; } });
      const r = await foeStrike(e, t, 0.6, { n: 22, longe: true });
      if (r !== 'perfeito' && Math.random() < 0.45 && t.hp > 0) { t.st.esquecido = 1; popNum(tx, ty - 26, 'LEMBROU DE OUTRA PESSOA', '#ffd070'); }
      return;
    }
    callout('Estilhaço', '#e8e8f8', 30); await foeLunge(e, t, 14, 10); await foeStrike(e, t, 1.0, { n: 22 }); await foeBack(e);
  },
  async cacaRec(e) {
    const t = foeTarget(); if (!t) return;
    const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
    if (!e.leu && Math.random() < 0.35) { e.leu = true; e.atk = Math.round(e.atk * 1.18); callout('Ela lê o cartaz de vocês: "MIL FRASCOS"', '#ffd060', 60); popNum(ex, ey - 40, 'ATQ +', '#ff8a6a'); await wait(20); return; }
    if (Math.random() < 0.35) {
      callout('Rede', '#a89870', 40); sfx('rumble');
      await tw(18, p => { bx.strokeStyle = '#c8b890'; bx.lineWidth = 1; const r = 6 + p * 14; for (let i = -2; i <= 2; i++) { bx.beginPath(); bx.moveTo(ex + (tx - ex) * p + i * 4, ey + (ty - ey) * p - r); bx.lineTo(ex + (tx - ex) * p + i * 4, ey + (ty - ey) * p + r); bx.stroke(); } });
      const r = await foeStrike(e, t, 0.55, { n: 22, longe: true });
      if (r !== 'perfeito' && t.hp > 0) { t.ct = Math.max(0, t.ct - 45); t.st.tonto = 1; popNum(tx, ty - 30, 'ENREDADO', '#c8b890'); }
      return;
    }
    callout('Virote', '#ffe08a', 30);
    await tw(12, p => { bx.fillStyle = '#e8e0d0'; bx.fillRect(Math.round(ex + (tx - ex) * p) - 4, Math.round(ey - 10 + (ty - ey) * p), 8, 1); });
    await foeStrike(e, t, 1.2, { n: 24, longe: true });
  },
  async tiago(e) {
    const [ex, ey] = unitCenter(e);
    e.troco = false;
    if (e.charge) {
      e.charge = null; e.armando = false; callout('PASSAGEM SÓ DE IDA!', '#ffffff', 70); sfx('crit'); flashW(4); bshake(16, 3);
      for (const m of alive(BT.party)) { const [mx, my] = unitCenter(m); await tw(9, p => { bx.fillStyle = '#d8aa40'; bx.fillRect(Math.round(ex + (mx - ex) * p) - 3, Math.round(ey + (my - ey) * p) - 2, 6, 4); bx.fillStyle = '#f2ecdc'; bx.fillRect(Math.round(ex + (mx - ex) * p) - 2, Math.round(ey + (my - ey) * p) - 1, 4, 2); }); await foeStrike(e, m, e.ph >= 2 ? 1.2 : 1.35, { n: 28, noCounter: true }); }
      return;
    }
    if ((e.turns || 0) === 0 || (e.turns % 5 === 0)) {
      const t = alive(BT.party).sort((a, b) => (a.def + a.mhp / 40) - (b.def + b.mhp / 40))[0]; if (!t) return;
      callout('Avaliação do Cobrador', '#8fe3ff', 50); sfx('rune');
      const [tx, ty] = unitCenter(t); await tw(20, p => { bx.strokeStyle = '#8fe3ff'; bx.lineWidth = 1; bx.strokeRect(Math.round(tx - 14 - (1 - p) * 10), Math.round(ty - 30 - (1 - p) * 10), Math.round(28 + (1 - p) * 20), Math.round(40 + (1 - p) * 20)); });
      t.st.bilhete = 1; popNum(tx, ty - 34, 'BILHETE', '#ffd060');
      if (!G.flags.tutBilhete) { G.flags.tutBilhete = true; await say('[BILHETE: o próximo golpe nesse aliado dói 40% mais. Defender ajuda.]', 'cat'); }
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('Ele gira o picotador... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(22, p => luzMagia(ex + 10, ey - 6, 10 + p * 20, 'rgba(216,170,64,0.6)', p)); return; }
    const t = foeTarget(); if (!t) return;
    if (e.ph < 2 && Math.random() < 0.35) { e.troco = true; callout('TROCO: não bata com o corpo!', '#ffd060', 70); sfx('guard'); await tw(16, p => { for (let i = 0; i < 4; i++) { bx.fillStyle = '#d8aa40'; bx.fillRect(Math.round(ex - 16 + i * 8), Math.round(ey - 30 - Math.sin(p * Math.PI) * 14 - i * 2), 3, 3); } }); if (!G.flags.tutTroco) { G.flags.tutTroco = true; await say('[TROCO: até a próxima vez dele, golpe COM O CORPO volta pela metade. Feitiço, item e defender passam.]', 'cat'); } return; }
    if (Math.random() < 0.4) { callout('Catraca', '#d0a8ff', 40); sfx('rumble'); for (const m of alive(BT.party)) await foeStrike(e, m, 0.7, { n: 22, noCounter: true }); return; }
    callout('Picote', '#d0a8ff', 30); await foeLunge(e, t, 16, 14); await foeStrike(e, t, 1.15, { n: 24 }); await foeBack(e);
  },
  async seladora(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('PRENSA REAL!', '#ffffff', 70); sfx('crit'); flashW(6); bshake(22, 4);
      await tw(24, p => { bx.fillStyle = '#5a5060'; const h = Math.round(Math.min(1, p * 2) * 90); bx.fillRect(0, 0, W, h); bx.fillStyle = '#c83a3a'; bx.fillRect(0, h - 6, W, 6); });
      for (const m of alive(BT.party)) { const r = await foeStrike(e, m, e.ph >= 2 ? 1.5 : 1.4, { n: 30, noCounter: true, longe: true }); if (e.ph >= 3 && r !== 'perfeito') selar(m, 1); }
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A prensa sobe, sobe... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(24, p => luzMagia(ex, ey - 30, 14 + p * 22, 'rgba(255,90,74,0.6)', p)); return; }
    const frascos = alive(BT.foes).filter(f => f.kind === 'frascoR').length;
    if (e.ph >= 2 && frascos < 2 && e.turns % 3 === 1) {
      callout('O tanque racha: lembranças fogem!', '#ffd070', 60); sfx('encounter');
      const c = mkFoe(ENEMY2.frascoR, 150 - BT.foes.length * 8, 120 + (BT.foes.length % 2) * 30); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; });
      if (!G.flags.tutFrascoR) { G.flags.tutFrascoR = true; await say('[Frasco Rachado: quebre e a lembrança vai para casa: o grupo se cura um pouco.]', 'cat'); }
      return;
    }
    if (e.ph >= 3 && !e.seloReal) { e.seloReal = true; callout('SELO REAL', '#e83a3a', 70); sfx('crit'); flashW(3); for (const m of alive(BT.party)) { await foeStrike(e, m, 0.7, { n: 22, noCounter: true, longe: true }); selar(m, 1); } return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.35) {
      callout('Carimbo', '#e83a3a', 40); e.armando = false;
      const [tx, ty] = unitCenter(t); await tw(14, p => { bx.fillStyle = '#c89a30'; bx.fillRect(Math.round(tx - 12), Math.round(ty - 60 + p * 40), 24, 14); bx.fillStyle = '#c83a3a'; bx.fillRect(Math.round(tx - 13), Math.round(ty - 46 + p * 40), 26, 4); });
      const r = await foeStrike(e, t, 1.0, { n: 24, longe: true }); if (r !== 'perfeito') selar(t, 1); return;
    }
    if (r0 < 0.6) {
      callout('Esteira', '#d0a8ff', 40); sfx('rumble');
      await tw(20, p => { for (let x = 0; x < W; x += 8) { bx.fillStyle = (Math.floor(x / 8 + p * 8) % 2) ? '#2a2830' : '#4a4850'; bx.fillRect(x, 186, 8, 6); } });
      for (const m of alive(BT.party)) { await foeStrike(e, m, 0.6, { n: 20, noCounter: true, longe: true }); m.ct = Math.max(0, m.ct - 25); }
      return;
    }
    callout('Braço de Latão', '#d0a8ff', 30); await foeLunge(e, t, 14, 16); await foeStrike(e, t, 1.25, { n: 26 }); await foeBack(e);
  }
});
function fasesSeladora() {
  return [{ at: 0.55, run: async (e) => {
    sfx('rumble'); bshake(24, 3); flashW(4);
    await say('* O tanque de vidro da Seladora racha. Um fio de luz dourada escapa, e mais um, e mais um. Cada um tem um cheiro diferente: pão, sabão, chuva, cabelo de criança.');
    await say('São lembranças! Quebra os frascos que fugirem, @: elas vão pra casa!', 'lume');
    e.ph = 2; e.maxShield = 8; e.shield = 8; e.spd = 11;
  } }, { at: 0.25, run: async (e) => {
    sfx('crit'); bshake(26, 4); flashW(5);
    await say('* A caldeira ruge. Todos os carimbos da sala se levantam ao mesmo tempo, apontados para vocês.');
    e.ph = 3; e.weak = ['gelo', 'mordida', 'fogo']; e.known = {}; e.spd = 12;
    callout('O tanque aberto: o FOGO também machuca!', '#8fe3ff', 90);
  } }];
}
function fasesTiago() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(14, 2);
    await say('* O Tiago para. Respira. O picotador treme na mão dele.');
    await say('Eu conferia passagem, sabia? No 31. Cada uma. Eu nunca deixei ninguém andar sem pagar. E nunca deixei ninguém ficar pra trás por falta de troco.', 'tiago');
    const her = (typeof lerHeranca === 'function' && lerHeranca()) || {}, foi = her.esc && her.esc.tiago;
    const c = await choose('* O que dizer ao Tiago?', ['"Confere a conta, Tiago. Ela não fecha."', '"Você me avaliou uma vez. Lembra o que viu?"', '(abrir a tampa e mostrar o caderno de nomes)'], 'me');
    if (c === 0) await say('...A conta. Mil frascos por um baú. Trezentos e doze nomes em Candeia. Não, não fecha. Mas eu prometi.', 'tiago');
    else if (c === 1) await say(foi ? 'Lembro. Eu fui junto com vocês, no fim. Dentro do 31, com o Seu Jorge. Eu vi um baú que guardava os outros. Eu vi.' : 'Lembro. "Baú. Nível baixo. Perigoso por motivos que não sei explicar." Eu escrevi isso. Eu tinha razão.', 'tiago');
    else await say('* Você abre a tampa. Lá dentro, a cópia que a Rita fez à mão: a lista de nomes com data. O Tiago lê três linhas e fecha os olhos.');
    await say('Eu vou lutar até o fim da linha. Porque eu prometi. Mas não vou mais fazer TROCO. Troco é pra quem quer ganhar.', 'tiago');
    e.ph = 2; e.troco = false; e.spd = 12; e.weak = ['gelo', 'corte', 'mordida']; e.known = {};
    callout('O Tiago parou de guardar troco: a mordida também pega!', '#8fe3ff', 90);
  } }];
}
