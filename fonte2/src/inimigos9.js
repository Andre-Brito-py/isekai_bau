// ================= INIMIGOS DO CAP. 9: A SUBIDA DO MORRO =================
// SENTINELA DE LATÃO (autômato do Farol: Gancho, Lanterna nos Olhos deixa TONTO; gelo e mordida), GRALHA DO MORRO
// (rápida; Bicada Dupla, Rajada de Asa em todos, rouba Tensão; fogo e corte), MARIPOSA DE ÂMBAR (filha da Rainha:
// COME LUZ e se cura com ela; fogo e mordida). A Guarda Real e o Cão-Lanterna voltam no cerco.
// Mini-chefes antigos com cara nova: O ESPANTALHO DO CERCO (o do Cap. 1, refeito com os cartazes do Farol: PEDÁGIO DO
// MORRO preparado; Rajada atrasa a vez de todos; fase 2 o vento arranca os cartazes, a lanterna velha acende: fraquezas
// mudam para gelo e mordida, Bafo de Lanterna queima, Cobrança rouba Tensão e cura) e A RAINHA DO FAROL (a Mariposa-
// Rainha: na fase 1 a LUZ a CURA; chama filhas; SOPRO DO FAROL preparado; fase 2 ela bebe o feixe e fica incandescente:
// gelo e corte, Come a Luz apaga os bônus). Chefe: O FAROLEIRO (Varredura faz esquecer a vez; Manivela; Gancho de
// Lanterna queima; LEITURA TOTAL preparada tira Tensão; fase 2 a lente gira: Raios e Sentinelas; fase 3 a lente racha,
// a moça de âmbar "lê de volta": o escudo quebra e a luz e o corte também pegam). O Tiago joga o TROCO.
Object.assign(ENEMY2, {
  sentinela: { name: 'Sentinela de Latão', kind: 'sentinela', mhp: 700, atk: 45, def: 19, mdef: 10, spd: 11, shield: 5, maxShield: 5, weak: ['gelo', 'mordida'], ai: 'sentinela', h: 62, cobres: 30,
    frame: u => sentinelaArt(Math.floor(BT.t / 14 + u.x) % 2, !!u.armando || u._atk > 0), dieCols: ['#a8803a', '#5a5a6e', '#ffd070'] },
  gralha: { name: 'Gralha do Morro', kind: 'gralha', fly: true, mhp: 560, atk: 44, def: 11, mdef: 12, spd: 18, shield: 3, maxShield: 3, weak: ['fogo', 'corte'], ai: 'gralha', h: 34, cobres: 22,
    frame: u => gralhaArt(Math.floor(BT.t / 5 + u.x)), dieCols: ['#2a2638', '#e87a20', '#f2f6fa'] },
  mariposaA: { name: 'Mariposa de Âmbar', kind: 'mariposaA', fly: true, mhp: 430, atk: 42, def: 9, mdef: 14, spd: 15, shield: 2, maxShield: 2, weak: ['fogo', 'mordida'], ai: 'mariposaA', h: 30, cobres: 14,
    frame: u => mariposaAArt(Math.floor(BT.t / 5 + u.x)), dieCols: ['#ffb040', '#ffe090', '#fff8e0'] },
  espantalhoC: { name: 'Espantalho do Cerco', kind: 'espantalhoC', boss: true, mhp: 5800, atk: 46, def: 18, mdef: 14, spd: 11, shield: 8, maxShield: 8, weak: ['fogo', 'corte'], ai: 'espantalhoC', h: 150, cobres: 260, ph: 1,
    frame: u => espantalhoCercoArt(Math.floor(BT.t / 10), u.armando ? 'carga' : u._atk > 0 ? 'atk' : '', u.ph || 1), dieCols: ['#d8c8a0', '#2a3a6a', '#c83a3a', '#ffb040'], cancelTxt: 'A cancela travou! Pedágio cancelado!' },
  rainhaF: { name: 'A Rainha do Farol', kind: 'rainhaF', boss: true, fly: true, mhp: 4500, atk: 46, def: 15, mdef: 17, spd: 12, shield: 8, maxShield: 8, weak: ['fogo', 'mordida'], ai: 'rainhaF', h: 120, cobres: 280, ph: 1,
    frame: u => rainhaFarolArt(Math.floor(BT.t / 5), u.ph || 1, u.armando ? 'carga' : ''), dieCols: ['#ffb040', '#ffe090', '#ffffff', '#c8e8ff'], cancelTxt: 'O sopro engasgou! Ela tosse pó de âmbar.' },
  faroleiro: { name: 'O Faroleiro', kind: 'faroleiro', boss: true, mhp: 8600, atk: 48, def: 20, mdef: 18, spd: 10, shield: 10, maxShield: 10, weak: ['gelo', 'mordida'], ai: 'faroleiro', h: 156, cobres: 450, ph: 1,
    frame: u => faroleiroArt(Math.floor(BT.t / 8), u.armando ? 'carga' : u._atk > 0 ? 'atk' : '', u.ph || 1), dieCols: ['#a8803a', '#ffd070', '#3a3a50', '#ffffff'], cancelTxt: 'A lente desfocou! A leitura falhou!' }
});
Object.assign(FICHA, {
  sentinela: 'Sentinela de Latão: autômato do Farol. Gancho que estica; a LANTERNA NOS OLHOS deixa tonto. Gelo e mordida.',
  gralha: 'Gralha do Morro: rápida. Bicada dupla, rajada de asa em todos, e rouba Tensão. Fogo e corte.',
  mariposaA: 'Mariposa de Âmbar: filha da Rainha. COME LUZ: golpes de luz a curam. Fogo e mordida.',
  espantalhoC: 'Espantalho do Cerco: o do pedágio, refeito pela Guarda. PEDÁGIO DO MORRO (quebre o escudo!). A Rajada atrasa a vez de todos. Na metade, a lanterna velha acende e as fraquezas mudam. Fogo e corte.',
  rainhaF: 'A Rainha do Farol: a Mariposa-Rainha voltou. Na fase 1 a LUZ A CURA! Chama filhas. SOPRO DO FAROL (quebre o escudo!). Depois ela bebe o feixe e fica incandescente: aí gelo e corte. Fogo e mordida.',
  faroleiro: 'O Faroleiro: a lente LÊ quem ela varre (perde a vez). LEITURA TOTAL (quebre o escudo!) tira Tensão. Na fase 2 chama Sentinelas e solta raios. Gelo e mordida.'
});
function atrasarVez9(t, n) { if (!t || t.hp <= 0) return; t.ct = Math.max(0, (t.ct || 0) - n); const [x, y] = unitCenter(t); popNum(x, y - 30, 'ATRASOU', '#c8d8e8'); }
Object.assign(AI2, {
  async sentinela(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.4) { callout('Lanterna nos Olhos', '#ffd070', 36); const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t); await tw(14, p => { bx.globalAlpha = 0.35 * (1 - p * 0.5); bx.fillStyle = '#fff0b0'; bx.beginPath(); bx.moveTo(ex, ey - 22); bx.lineTo(tx - 10, ty - 14 + p * 4); bx.lineTo(tx + 10, ty + 10); bx.fill(); bx.globalAlpha = 1; }); const r = await foeStrike(e, t, 0.7, { n: 22, longe: true }); if (r === 'falhou') { t.st.tonto = 1; } return; }
    callout('Gancho', '#d0a8ff', 30); golpeAtk(e, 24); await foeLunge(e, t, 18, 14); await foeStrike(e, t, 1.1, { n: 24 }); await foeBack(e);
  },
  async gralha(e) {
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Rajada de Asa', '#c8d8e8', 36); await tw(16, p => ventoLuta9(p)); for (const m of alive(BT.party)) await foeStrike(e, m, 0.5, { n: 20, fast: true, noCounter: true, longe: true }); return; }
    const t = foeTarget(); if (!t) return;
    if (r0 < 0.5) { callout('Rouba Brilho', '#ffd070', 30); await foeLunge(e, t, 12, 12); const r = await foeStrike(e, t, 0.75, { n: 20, fast: true }); await foeBack(e); if (r !== 'perfeito') { const k = Math.min(BT.tension, 12); BT.tension -= k; popNum(120, 60, '-' + k + ' TENSÃO', '#ffd070'); } return; }
    callout('Bicada Dupla', '#d0a8ff', 30); await foeLunge(e, t, 10, 14); await foeStrike(e, t, 0.55, { n: 18, fast: true }); if (t.hp > 0) await foeStrike(e, t, 0.55, { n: 18, fast: true }); await foeBack(e);
  },
  async mariposaA(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.4) { callout('Pó de Âmbar', '#ffd070', 30); const [tx, ty] = unitCenter(t); await tw(16, p => { for (let i = 0; i < 8; i++) { bx.fillStyle = i % 2 ? '#ffd070' : '#fff0b0'; bx.fillRect(Math.round(tx - 12 + (i * 7) % 24), Math.round(ty - 30 + p * 26 + (i * 5) % 8), 2, 2); } }); const r = await foeStrike(e, t, 0.65, { n: 22, longe: true }); if (r === 'falhou' && Math.random() < 0.5) t.st.tonto = 1; return; }
    callout('Asa de Vidro', '#d0a8ff', 30); await foeLunge(e, t, 12, 12); await foeStrike(e, t, 1.0, { n: 22, fast: true }); await foeBack(e);
  },
  async espantalhoC(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('PEDÁGIO DO MORRO!', '#ffffff', 70); sfx('crit'); bshake(20, 3); golpeAtk(e, 30);
      await tw(22, p => { for (let i = 0; i < 2; i++) { bx.fillStyle = i ? '#c83a3a' : '#f2ecdc'; bx.fillRect(0, Math.round(40 + p * 80 + i * 6), W, 4); } });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.45 : 1.35, { n: 30, noCounter: true, longe: true });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('As duas cancelas sobem... ele vai cobrar de todo mundo (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(20, p => luzMagia(ex, ey - 60, 20 + p * 20, 'rgba(200,58,58,0.5)', 1 - p)); return; }
    const r0 = Math.random();
    if (r0 < 0.25) { callout('Rajada', '#c8d8e8', 40); sfx('rumble'); await tw(22, p => ventoLuta9(p)); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.5, { n: 22, noCounter: true, longe: true }); if (r !== 'perfeito') atrasarVez9(m, 25); } return; }
    const t = foeTarget(); if (!t) return;
    if (e.ph >= 2 && r0 < 0.45) { callout('Bafo de Lanterna', '#ffb040', 40); golpeAtk(e, 24); const [tx, ty] = unitCenter(t); await tw(18, p => { for (let i = 0; i < 10; i++) { bx.fillStyle = i % 2 ? '#ffb040' : '#ff6a2a'; bx.fillRect(Math.round(ex + (tx - ex) * p + Math.sin(i + p * 9) * 5), Math.round(ey - 60 + (ty - ey + 60) * p + (i - 5) * 2), 3, 3); } }); const r = await foeStrike(e, t, 0.85, { n: 24, longe: true }); if (r === 'falhou') t.st.queimado = 2; return; }
    if (e.ph >= 2 && r0 < 0.6) { callout('Cobrança', '#ffd070', 40); golpeAtk(e, 24); await foeLunge(e, t, 16, 14); const r = await foeStrike(e, t, 0.8, { n: 24 }); await foeBack(e); if (r !== 'perfeito') { const k = Math.min(BT.tension, 15); BT.tension -= k; e.hp = Math.min(e.mhp, e.hp + Math.round(e.mhp * 0.03)); popNum(ex, ey - 40, '+TAXA', '#ffd070'); } return; }
    if (r0 < 0.6) { callout('Chuva de Cartazes', '#e8dcc0', 36); golpeAtk(e, 24); for (let i = 0; i < 3; i++) { const m = pickOne(alive(BT.party)); if (!m) break; const [mx, my] = unitCenter(m); await tw(8, p => { bx.fillStyle = '#e8dcc0'; bx.fillRect(Math.round(mx - 4 + Math.sin(p * 9) * 6), Math.round(my - 70 + p * 54), 8, 6); bx.fillStyle = '#2a2228'; bx.fillRect(Math.round(mx - 2 + Math.sin(p * 9) * 6), Math.round(my - 68 + p * 54), 4, 1); }); await foeStrike(e, m, 0.6, { n: 18, fast: true, noCounter: true, longe: true }); } return; }
    callout('Golpe de Cancela', '#d0a8ff', 30); golpeAtk(e, 30); await foeLunge(e, t, 20, 16); await foeStrike(e, t, 1.3, { n: 26 }); await foeBack(e);
  },
  async rainhaF(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('SOPRO DO FAROL!', '#ffffff', 70); sfx('crit'); flashW(3); bshake(18, 3);
      await tw(26, p => { bx.globalAlpha = 0.5 * (1 - p * 0.4); bx.fillStyle = '#fff0c0'; bx.beginPath(); bx.moveTo(ex, ey - 10); bx.lineTo(0, 40 + p * 30); bx.lineTo(0, 200 - p * 20); bx.fill(); bx.globalAlpha = 1; });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.25 : 1.15, { n: 30, noCounter: true, longe: true, el: 'luz' });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('As quatro asas se abrem e puxam toda a luz da crista... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(24, p => luzMagia(ex, ey, 40 - p * 30, 'rgba(255,240,180,0.6)', 1 - p)); return; }
    const filhas = alive(BT.foes).filter(f => f.kind === 'mariposaA').length;
    if (filhas < (e.ph >= 2 ? 1 : 2) && e.turns % 4 === 1) { callout('Ela chama as filhas', '#ffd070', 50); sfx('encounter'); const c = mkFoe(ENEMY2.mariposaA, 150 - BT.foes.length * 12, 100 + (BT.foes.length % 2) * 40); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (e.ph >= 2 && r0 < 0.3) { callout('Come a Luz', '#ffffff', 40); const [tx, ty] = unitCenter(t); await tw(18, p => fxRing(tx, ty - 16, 26 * (1 - p) + 4, '#fff0c0', p)); const r = await foeStrike(e, t, 0.8, { n: 22, longe: true }); if (r !== 'perfeito') { apagarBuffs(t); const k = Math.min(BT.tension, 12); BT.tension -= k; } return; }
    if (r0 < 0.5) { callout('Pó de Âmbar', '#ffd070', 36); await tw(18, p => { for (let i = 0; i < 24; i++) { bx.fillStyle = i % 2 ? '#ffd070' : '#fff0b0'; bx.fillRect(Math.round(ex - p * 160 + (i * 13) % 50), Math.round(ey - 30 + (i * 7) % 70), 2, 2); } }); for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.5, { n: 22, noCounter: true, longe: true }); if (r === 'falhou' && Math.random() < 0.35) m.st.tonto = 1; } return; }
    callout('Asa de Vidro', '#d0a8ff', 30); await foeLunge(e, t, 18, 16); await foeStrike(e, t, 1.05, { n: 26 }); await foeBack(e);
  },
  async faroleiro(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('LEITURA TOTAL!', '#ffffff', 80); sfx('crit'); flashW(4); bshake(24, 4);
      await tw(30, p => { const r = 20 + p * 160; bx.globalAlpha = 0.35 * (1 - p); bx.fillStyle = '#fff0c0'; bx.beginPath(); bx.arc(ex, ey - 10, r, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2 + p * 2; bx.fillStyle = '#ffe090'; bx.fillRect(Math.round(ex + Math.cos(an) * r), Math.round(ey - 10 + Math.sin(an) * r * 0.7), 3, 3); } });
      BT.tension = Math.max(0, BT.tension - 30); popNum(120, 60, '-30 TENSÃO', '#ffe090');
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.4 : 1.3, { n: 30, noCounter: true, longe: true, el: 'luz' });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A lente gira e foca... ele vai LER todo mundo (quebre o escudo!)', '#ff6b6b', 100); sfx('rumble'); await tw(26, p => luzMagia(ex, ey - 12, 50 - p * 40, 'rgba(255,224,144,0.6)', 1 - p)); return; }
    const sen = alive(BT.foes).filter(f => f.kind === 'sentinela').length;
    if (e.ph >= 2 && sen < 2 && e.turns % 4 === 1) { callout('"Sentinelas. Aos postos."', '#e8dcc0', 60); sfx('encounter'); const c = mkFoe(ENEMY2.sentinela, 140 - BT.foes.length * 12, 150); c.ct = 0; c.alpha = 0; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Varredura', '#ffe090', 40); golpeAtk(e, 26);
      await tw(24, p => { const x = 240 - p * 260; bx.globalAlpha = 0.3; bx.fillStyle = '#fff0c0'; bx.beginPath(); bx.moveTo(ex, ey - 12); bx.lineTo(x - 18, 200); bx.lineTo(x + 18, 200); bx.fill(); bx.globalAlpha = 1; });
      for (const m of alive(BT.party)) { const r = await foeStrike(e, m, 0.7, { n: 22, noCounter: true, longe: true, el: 'luz' }); if (r === 'falhou' && m.hp > 0 && Math.random() < 0.4) { m.st.esquecido = 1; const [x, y] = unitCenter(m); popNum(x, y - 34, 'LIDO: ESQUECEU', '#ffe090'); } }
      return; }
    if (e.ph >= 2 && r0 < 0.5) { callout('Raios da Lente', '#ffe090', 40); golpeAtk(e, 26); for (let i = 0; i < 4; i++) { const m = pickOne(alive(BT.party)); if (!m) break; const [mx, my] = unitCenter(m); await tw(8, p => { bx.strokeStyle = '#fff0c0'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(ex, ey - 12); bx.lineTo(ex + (mx - ex) * p, ey - 12 + (my - ey + 12) * p); bx.stroke(); }); await foeStrike(e, m, 0.5, { n: 16, fast: true, noCounter: true, longe: true, el: 'luz' }); } return; }
    const t = foeTarget(); if (!t) return;
    if (r0 < 0.65) { callout('Gancho de Lanterna', '#ffb040', 34); golpeAtk(e, 30); await foeLunge(e, t, 20, 16); const r = await foeStrike(e, t, 0.95, { n: 24 }); await foeBack(e); if (r === 'falhou') t.st.queimado = 2; return; }
    callout('Manivela', '#d0a8ff', 30); golpeAtk(e, 30); await foeLunge(e, t, 22, 18); await foeStrike(e, t, e.ph >= 3 ? 1.1 : 1.25, { n: 26 }); await foeBack(e);
  }
});
// vento na luta: traços de neve atravessando a tela
function ventoLuta9(p) { for (let i = 0; i < 30; i++) { const x = (i * 41 + p * 300) % W, y = (i * 23) % H; bx.fillStyle = i % 3 ? 'rgba(240,246,250,0.8)' : 'rgba(200,220,240,0.6)'; bx.fillRect(Math.round(240 - x), y, 6 + (i % 4) * 2, 1); } }
// luz na Rainha (fase 1) e nas filhas: elas COMEM a luz (curam em vez de levar dano)
{ const _hfR9 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (t && o.el === 'luz' && t.hp > 0 && (t.kind === 'mariposaA' || (t.kind === 'rainhaF' && (t.ph || 1) < 2))) {
    const v = Math.round(calcDmg(a, t, pow, o) * 0.3); t.hp = Math.min(t.mhp, t.hp + v); const [x, y] = unitCenter(t); popNum(x, y - 10, '+' + v, '#ffe090'); popNum(x, y - 26, 'COMEU A LUZ', '#ffe090'); t.known.luz = 'ok';
    if (!BT._comeuLuz9) { BT._comeuLuz9 = true; callout('Ela come a luz! Luz cura as mariposas!', '#ff6b6b', 80); }
    return 0;
  }
  return _hfR9(a, t, pow, o);
}; }
function fasesEspantalho9() { return [{ at: 0.5, run: async (e) => {
  sfx('rumble'); bshake(20, 3); flashW(3);
  await say('* Uma rajada mais forte que todas arranca os cartazes novos do casaco do Espantalho. Eles voam morro abaixo, um por um, como corvos de papel.');
  await say('* Por baixo, um casaco velho, remendado, de palha. E dentro do pote de vidro, onde havia uma chama azul e fria, uma lanterna velha de pedágio ACENDE, amarela.');
  await say('...Esse é o MESMO. O da ponte. Do pedágio. A Guarda remendou ele.', 'rita');
  await say('"PEDÁGIO." "PEDÁGIO." Ele não lembra de outra palavra.', 'lume');
  await say('[Fase 2: a lanterna acendeu. Fraco a GELO e MORDIDA. Bafo de Lanterna queima; Cobrança rouba Tensão e cura.]', 'cat');
  e.ph = 2; e.weak = ['gelo', 'mordida']; e.known = {}; e.maxShield = 8; e.shield = 8; e.spd = 12;
} }]; }
function fasesRainha9() { return [{ at: 0.5, run: async (e) => {
  sfx('rumble'); flashW(5); bshake(22, 3);
  await say('* A Rainha voa para dentro do feixe da Lente do Luar. Abre as quatro asas. E BEBE a luz, como quem bebe água depois de um deserto.');
  await say('* Ela fica branca. Depois dourada. Depois uma cor que não tem nome, de tão clara. As asas viram vitral.');
  await say('Ela tá cheia. Agora ela não come mais luz: ela É luz.', 'lume');
  await say('[Fase 2: incandescente. Luz não cura mais (nem machuca muito). Fraca a GELO e CORTE. Come a Luz apaga os bônus.]', 'cat');
  e.ph = 2; e.weak = ['gelo', 'corte']; e.known = {}; e.maxShield = 9; e.shield = 9; e.spd = 13;
} }]; }
function fasesFaroleiro9() { return [{ at: 0.66, run: async (e) => {
  sfx('rumble'); bshake(22, 3); flashW(3);
  await say('* A lente no peito do Faroleiro começa a GIRAR. Anéis de luz dentro de anéis de luz. O pátio inteiro fica claro como meio-dia.');
  await say('NINGUÉM. SOBE. SEM. SER. LIDO.', 'faroleiro');
  await say('[Fase 2: chama Sentinelas e solta Raios da Lente.]', 'cat');
  e.ph = 2; e.maxShield = 11; e.shield = 11; e.spd = 11;
} }, { at: 0.33, run: async (e) => {
  sfx('crit'); bshake(26, 4); flashW(5);
  await say('* A lente foca em você. Em VOCÊ, o baú. E começa a ler. Você sente as páginas virando por dentro: o ônibus, a curva, o pedestal, a Lume, a Rita...');
  await say('{o}Não. Esse não.{/}', 'eco8');
  await say('* Uma luz âmbar sai de dentro da sua tampa. Não é a do Farol: é morna, como uma janela de casa vista de longe. Ela bate na lente do Faroleiro e a lente RACHA.');
  await say('{o}Eu também sei ler. E eu li você, Faroleiro. Você está cansado. Faz cem anos que você está cansado.{/}', 'eco8');
  await say('* Por trás do vidro rachado, uma silhueta: um velho sentado, de cachimbo apagado. Esperando alguém dizer que ele pode parar.');
  await say('[A lente rachou: o ESCUDO quebrou, e agora LUZ e CORTE também pegam. O Tiago está jogando o troco mais rápido.]', 'cat');
  e.ph = 3; e.weak = ['gelo', 'mordida', 'luz', 'corte']; e.known = {}; e.shield = 0; breakFoe(e); e.spd = 12;
  if (BT.tiago9) BT.tiago9.forte = true;
} }]; }
