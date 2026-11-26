// ================= MAIS CANTIGAS DA LUME (pedido do usuário: "classe mágica... cantigas com foco em PM") =================
// Além de Acalanto, Vela Protetora e Ofuscar, a Lume aprende 7 cantigas (todas gastam PM e escalam com MAG), uma ou
// duas por capítulo. Ela anuncia a nova no Marco (ou ela aparece sozinha no capítulo seguinte).
// AFINAÇÃO: toda cantiga nova começa com uma nota no tempo (aperte A quando o anel fechar): afinada = +25% de efeito.
//  Desafino (Cap. 4, 10 PM): desafina de propósito: dano leve e TONTO (a vez volta muito; chefe resiste metade).
//  Marcha (Cap. 4, 14 PM): o grupo todo adianta a vez e bate 20% mais forte nos 2 próximos golpes.
//  Lamento (Cap. 5, 16 PM): luz leve em TODOS os inimigos e FRACO (o próximo golpe deles sai 40% mais fraco).
//  Cantiga do Sino (Cap. 6, 18 PM): o grupo cura 7% cada vez que um inimigo agir, por 3 vezes.
//  Canção da Fonte (Cap. 6, 6 PM): devolve 22 PM a um aliado (o Grimório do baú agradece).
//  Serenata de Luz (Cap. 7, 22 PM): a magia mais forte de um alvo só: luz 1.8 (afinada = crítico).
//  Réquiem de Âmbar (Cap. 9, 30 PM): luz forte em todos; cada inimigo atingido devolve 6 PM ao grupo.
const CANT_CAP = { desafino: 4, marcha: 4, lamento: 5, sino: 6, fonte: 6, serenata: 7, requiem: 9 };
const CANT_NOTA = {
  desafino: ['Eu aprendi uma cantiga nova! Quer dizer... DESaprendi. É o Desafino: eu canto errado de propósito e o inimigo fica tonto.', 'Isso não é uma arma. É um crime.', 'rita'],
  marcha: ['Cantiga nova: a Marcha! Todo mundo anda mais rápido e bate mais forte. É o que tocava na banda do coreto.', 'Eu marcho no ritmo. Eu tenho ritmo. Eu sou um baú com ritmo.', 'me'],
  lamento: ['O Lamento. É triste demais para alguém ter vontade de bater forte depois de ouvir.', 'Funciona comigo também. Não canta perto de mim.', 'rita'],
  sino: ['A Cantiga do Sino. Aprendi com o sino de Candeia. Cada vez que o inimigo se mexe, ela cura a gente um pouquinho.', '...Ainda ouço aquele sino de noite.', 'me'],
  fonte: ['A Canção da Fonte! Eu canto e o PM de alguém volta. @, o seu Grimório vai me amar.', '[O Grimório não ama. O Grimório registra. Registrado: gratidão.]', 'cat'],
  serenata: ['A Serenata de Luz. É a mais bonita que eu sei. E a mais perigosa.', 'Bonita E perigosa. Combina.', 'me'],
  requiem: ['O Réquiem de Âmbar. Eu não queria saber essa. Ela pega a luz que as coisas guardam e devolve pra gente.', '...Canta baixo, Lume.', 'rita']
};
function cantSt() { G.flags.cant = G.flags.cant || {}; return G.flags.cant; }
function cantLiberadas() { const c = capAtual(), st = cantSt(); return Object.keys(CANT_CAP).filter(k => st[k] || c > CANT_CAP[k]); }
async function afinar(m) {
  const ok = await timedPrompt(m, 18);
  const [x, y] = unitCenter(m);
  if (ok) { popNum(x, y - 30, 'AFINADA!', '#ffd060'); sfx('select'); } else popNum(x, y - 30, 'meio desafinada', '#a898b8');
  return ok ? 1.25 : 1;
}
function notas(x, y, p, cols, n = 4) { for (let i = 0; i < n; i++) txt('♪', x - n * 4 + i * 8 + Math.sin(FRAME / 5 + i) * 2, y - 6 - p * 26 - (i % 2) * 5, { col: cols[i % cols.length], alpha: 1 - p }); }
async function cantar(m, cols, n = 24) { const [x, y] = unitCenter(m); sfx('heal'); await tw(n, p => { luzMagia(x, y - 8, 20, cols[0], 0.35 * (1 - p)); notas(x, y, p, cols); }); }
Object.assign(RUNA2, {
  desafino: { nm: 'Desafino', mp: 10, tgt: 'enemy', d: 'Cantiga: canta ERRADO de propósito. Dano leve de luz e o inimigo fica TONTO (a vez volta muito; chefe resiste metade).', run: async (m, t) => {
    const k = await afinar(m); jingle('C5:1 C#5:1 B4:2 F5:3', 260); await cantar(m, ['#c8a0ff', '#ff9ad0', '#a0e0ff']);
    const [x, y] = unitCenter(t); await tw(14, p => { for (let i = 0; i < 4; i++) txt('♪', x - 10 + i * 6 + Math.sin(FRAME / 2 + i) * 4, y - 10 + Math.cos(FRAME / 3 + i) * 6, { col: '#c8a0ff', alpha: 1 - p }); });
    hitFoe(m, t, 0.5 * k, { el: 'luz', mag: true, ranged: true });
    if (t.hp > 0) { const n = t.boss ? 22 : 45; t.ct = Math.max(0, (t.ct || 0) - n * k); popNum(x, y - 34, 'TONTO', '#d0a8ff'); }
    if (!G.flags.desafinoRita) { G.flags.desafinoRita = true; callout('A Rita tapou os ouvidos.', '#e86050', 60); }
  } },
  marcha: { nm: 'Marcha', mp: 14, tgt: 'self', d: 'Cantiga: o grupo todo ADIANTA a vez e bate 20% mais forte nos 2 próximos golpes.', run: async (m) => {
    const k = await afinar(m); jingle('C5:2 C5:1 G5:2 C5:1 E5:2 G5:4', 240); await cantar(m, ['#ffd060', '#ff8a4a', '#ffffff']);
    for (const u of alive(BT.party)) { const [x, y] = unitCenter(u); u.ct = Math.min(99, (u.ct || 0) + 30 * k); u.st.bandeira = Math.max(u.st.bandeira || 0, 2); popNum(x, y - 30, 'MARCHA', '#ffd060'); }
  } },
  lamento: { nm: 'Lamento', mp: 16, tgt: 'all', d: 'Cantiga: luz leve em TODOS os inimigos e eles ficam FRACOS (o próximo golpe deles sai 40% mais fraco).', run: async (m) => {
    const k = await afinar(m); jingle('A4:3 G4:2 E4:3 D4:5', 160); await cantar(m, ['#a0c0ff', '#ffffff', '#8090c0'], 30);
    for (const e of alive(BT.foes)) { const [x, y] = unitCenter(e); burst(x, y, 8, ['#a0c0ff', '#ffffff'], { up: 0.5 }); hitFoe(m, e, 0.45 * k, { el: 'luz', mag: true, ranged: true }); if (e.hp > 0) { e.st.fraco = 1; popNum(x, y - 34, 'FRACO', '#a0c0ff'); } }
  } },
  sino: { nm: 'Cantiga do Sino', mp: 18, tgt: 'self', d: 'Cantiga: o grupo cura 7% da vida cada vez que um inimigo agir, por 3 vezes.', run: async (m) => {
    const k = await afinar(m); jingle('E5:4 E5:4 B4:8', 180); await cantar(m, ['#ffe8a0', '#c8b080', '#ffffff'], 30);
    for (const u of alive(BT.party)) { const [x, y] = unitCenter(u); u.st.sino = 3; u._sinoK = k; popNum(x, y - 30, 'SINO', '#ffe8a0'); }
  } },
  fonte: { nm: 'Canção da Fonte', mp: 6, w: 'leve', tgt: 'ally', d: 'Cantiga: devolve 22 PM a um aliado (não a ela mesma). Leve.', run: async (m, t) => {
    if (t === m || !t.mmp) { callout('Cante para outra pessoa', '#ff6b6b', 40); m.mp = Math.min(m.mmp, m.mp + 6); return; }
    const k = await afinar(m); jingle('G5:1 B5:1 D6:2 G6:3', 260); const [x, y] = unitCenter(t);
    await tw(22, p => { fxRing(x, y, 4 + p * 14, '#8fe3ff', 1 - p); notas(x, y, p, ['#8fe3ff', '#ffffff'], 3); });
    const g = Math.round(22 * k); t.mp = Math.min(t.mmp, t.mp + g); popNum(x, y - 20, '+' + g + ' PM', '#8fe3ff');
  } },
  serenata: { nm: 'Serenata de Luz', mp: 22, tgt: 'enemy', d: 'Cantiga: a magia mais forte de um alvo só. Luz forte (afinada = crítico).', run: async (m, t) => {
    const k = await afinar(m); jingle('C5:2 E5:2 G5:2 C6:2 E6:2 G6:6', 200); await cantar(m, ['#ffffff', '#ffe066', '#ffd0f0'], 30);
    const [x, y] = unitCenter(t);
    await tw(24, p => { for (let i = 0; i < 5; i++) { const a = p * 5 + i * 1.26; luzMagia(x + Math.cos(a) * 20 * (1 - p), y + Math.sin(a) * 14 * (1 - p), 10, '#ffe066', 0.6); } });
    flashW(3); bshake(6, 2); hitstop(5); burst(x, y, 24, ['#ffffff', '#ffe066', '#ffd0f0']);
    hitFoe(m, t, 1.8 * k, { el: 'luz', mag: true, ranged: true, crit: k > 1 });
  } },
  requiem: { nm: 'Réquiem de Âmbar', mp: 30, tgt: 'all', d: 'Cantiga: luz forte em TODOS; cada inimigo atingido devolve 6 PM a todo o grupo.', run: async (m) => {
    const k = await afinar(m); jingle('D5:3 F5:3 A5:3 D6:6 C6:3 A5:6', 150); await cantar(m, ['#ffd890', '#c8902a', '#ffffff'], 34);
    let n = 0; for (const e of alive(BT.foes)) { const [x, y] = unitCenter(e); luzMagia(x, y, 26, '#ffd890', 0.7); burst(x, y, 12, ['#ffd890', '#c8902a', '#ffffff'], { up: 1 }); hitFoe(m, e, 1.1 * k, { el: 'luz', mag: true, ranged: true }); n++; await wait(4); }
    for (const u of alive(BT.party)) if (u.mmp) { const g = 6 * n; u.mp = Math.min(u.mmp, u.mp + g); const [x, y] = unitCenter(u); popNum(x, y - 20, '+' + g + ' PM', '#8fe3ff'); }
  } }
});
Object.assign(ST_NAME, { sino: 'SINO' });
// a Cantiga do Sino cura quando um inimigo age
{ const _ftC = foeTurn; foeTurn = async function (e) {
  for (const u of alive(BT.party)) if (u.st && u.st.sino > 0) { u.st.sino--; const g = Math.round(u.mhp * 0.07 * (u._sinoK || 1)); healUnit(u, g); }
  return _ftC(e);
}; }
// a Lume carrega as cantigas que já aprendeu
{ const _gaC = grupoAtual; grupoAtual = function () {
  const g = _gaC(), l = g.find(m => m.id === 'lume');
  if (l && l.runas) for (const k of cantLiberadas()) if (!l.runas.includes(k)) l.runas.push(k);
  if (l) l.magDesc = 'Cantigas: curam, protegem, atrasam e batem. Gastam PM. Afinada (A no tempo) = +25%.';
  return g;
}; }
// no Marco, ela conta a cantiga nova
{ const _umC = usarMarco; usarMarco = async function (e) {
  const r = await _umC(e);
  try {
    const c = capAtual(), st = cantSt();
    for (const [k, n] of Object.entries(CANT_CAP)) if (c >= n && !st[k]) {
      st[k] = true; const [l1, l2, w2] = CANT_NOTA[k]; sfx('rune');
      await say(l1, 'lume'); await say(l2, w2);
      await say('[Cantiga nova da Lume: ' + RUNA2[k].nm.toUpperCase() + ' (' + RUNA2[k].mp + ' PM). ' + RUNA2[k].d.replace('Cantiga: ', '') + ']', 'cat');
    }
  } catch (err) { console.error(err); }
  return r;
}; }
