// ================= MECÂNICAS DO CAP. 9 — A SUBIDA DO MORRO =================
// 1) O QUADRO DO CERCO (na base): os ALIADOS que cada um foi buscar pelos Marcos, e o trunfo que cada um dá na subida:
//    DALVA (a tenda do sopé: cura e frascos), IOLANDA (o mapa e a página da Ofélia: a Porta das Lentes; obrigatória),
//    TICO E DITO (a chaminé velha: atalho na Encosta), BRÁS (a Guilda distrai a cancela: sem luta na entrada),
//    DONA BADALADA (o sino de Velhágua toca à meia-noite: metade das rondas da Encosta desce para ver o que é).
//    Para subir: a Iolanda e mais DOIS.
// 2) VENTANIA (Encosta): o vento do morro sopra para o SUL, para a beira, em rajadas com aviso. Quem estiver abrigado (pedra
//    ou rocha logo ao NORTE, ou encostado numa mureta), ou na escada, não sai do lugar; o resto escorrega para baixo e, se
//    cair da beira, cai no patamar de baixo. De DIA os holofotes da Guarda dormem; de NOITE varrem os dois patamares de cima.
// 3) LEITURA (a moça de âmbar, depois dos três fios): o AVALIAR deixa o inimigo LIDO por 3 golpes: ela avisa na hora
//    certa e o anel de defesa fica mais largo (perfeito e bom mais fáceis).
const c9Ativo = () => !!(G.flags && G.flags.c9Init && !G.flags.c9Fim);
// ---------- aliados ----------
const ALIADOS9 = {
  dalva: { nm: 'Irmã Dalva', trunfo: 'a tenda do sopé (cura e frascos)', onde: 'na base' },
  iolanda: { nm: 'Dona Iolanda', trunfo: 'o mapa e a página da Ofélia (a Porta das Lentes)', onde: 'na Papelaria, em Auren (de dia)', obrig: true },
  tico: { nm: 'Tico e Dito', trunfo: 'a chaminé velha (atalho na Encosta)', onde: 'no Bairro Baixo, em Auren (de dia)' },
  bras: { nm: 'Sargento Brás', trunfo: 'a Guilda distrai a cancela (sem luta na entrada)', onde: 'na Vila dos Pavios (de noite, com a mãe)' },
  badalada: { nm: 'Dona Badalada', trunfo: 'o sino toca à meia-noite (metade das rondas sai da Encosta)', onde: 'na Praça do Sino, em Velhágua' }
};
const aliado9 = (k) => !!G.flags['c9A_' + k];
const nAliados9 = () => Object.keys(ALIADOS9).filter(aliado9).length;
const prontoSubir9 = () => aliado9('iolanda') && nAliados9() >= 3;
function ganharAliado9(k) { if (aliado9(k)) return; G.flags['c9A_' + k] = true; sfx('rune'); W2.toast = { s: ALIADOS9[k].nm + ' vem com vocês! (' + nAliados9() + '/5)', t: 0 }; }
async function quadroCerco() {
  if (G.flags.c9P2) { await say('* O quadro do cerco, cheio de alfinetes e barbante. Já foi. Agora é subir.'); return; }
  await say('* O quadro do cerco, na parede da base: um mapa do morro desenhado pela Rita a carvão, cinco nomes com alfinete, um barbante até o Farol.');
  const items = Object.entries(ALIADOS9).map(([k, a]) => ({ label: (aliado9(k) ? '[x] ' : '[ ] ') + a.nm + (a.obrig ? ' *' : ''), col: aliado9(k) ? '#9be58a' : '#c8c0d0' }));
  await list({ x: 14, y: 26, w: 212, title: 'Aliados: ' + nAliados9() + '/5 (a Iolanda e mais dois)', items, desc: j => { const a = Object.values(ALIADOS9)[j]; return a ? (aliado9(Object.keys(ALIADOS9)[j]) ? 'Vem! Trunfo: ' + a.trunfo + '.' : 'Onde: ' + a.onde + '. Trunfo: ' + a.trunfo + '.') : ''; }, descY: 150 });
  if (!prontoSubir9()) { await say(aliado9('iolanda') ? 'Mais gente. Um cerco não se fura com três pessoas e uma mala.' : 'Sem a Dona Iolanda a gente não passa da Porta das Lentes. Ela tem o mapa.', 'rita'); return; }
  const c = await choose('* ' + nAliados9() + ' aliados. Subir o morro?', ['Hoje à noite', 'Ainda não'], 'me', 1);
  if (c === 0) await noiteDoCerco();
}
// ---------- VENTANIA ----------
const VENTO9 = { per: 300, aviso: 84, passo: 4 };
function ventoAtivo9() { return W2.id === 'encosta9' && V.scene === 'world'; }
function abrigado9(x, y) {
  const T = tileOf(W2.map, x, y); if (T.t === 'degrau9') return true;
  const N = tileOf(W2.map, x, y - 1); return !!N.solid || propSolid(W2.map, x, y - 1);
}
{ const _lm9 = loadMap2; loadMap2 = function () { const r = _lm9.apply(this, arguments); W2.vento9 = { t: 30, emp: 0 }; return r; }; }
{ const _uwV9 = updateWorld2; updateWorld2 = function () {
  _uwV9();
  if (!ventoAtivo9() || !W2.vento9) return;
  const V9 = W2.vento9;
  if (worldBusy2() || W2.pego) return;
  // empurrão em andamento
  if (V9.emp > 0) {
    if (W2.mv) return;
    if (W2.t % VENTO9.passo) return;
    V9.emp--;
    const T = tileOf(W2.map, W2.x, W2.y + 1);
    if (T.t === 'abismo') { V9.emp = 0; run2(() => caiuDaBeira9()); return; }
    if (T.solid || propSolid(W2.map, W2.x, W2.y + 1) || W2.ents.some(e => !e.passa && e.x === W2.x && e.y === W2.y + 1)) { V9.emp = 0; return; }
    W2.dir = 'down'; tryStep(W2.x, W2.y + 1); return;
  }
  V9.t++;
  if (V9.t === VENTO9.per - VENTO9.aviso) { sfx('rumble'); if (!G.flags.tutVento9) { G.flags.tutVento9 = true; run2(tutVento9); } }
  if (V9.t >= VENTO9.per) {
    V9.t = 0; sfx('encounter'); V.shake = 3;
    if (abrigado9(W2.x, W2.y)) { W2.toast = { s: 'Abrigado: o vento passa por cima.', t: 0 }; return; }
    V9.emp = 8; W2.mv = null;
  }
}; }
async function tutVento9() {
  await say('* Um assobio sobe do vale. A neve do chão levanta, toda de uma vez, e corre para a beira.');
  await say('{o}Segura no chão. Atrás da pedra. O vento daqui empurra para baixo.{/}', 'eco8');
  await say('Quem falou isso?', 'rita');
  await say('[VENTANIA: quando o assobio subir, fique ABRIGADO: com uma pedra ou rocha logo ACIMA de você (ao norte), encostado numa MURETA da beira, ou na escada. Fora disso o vento te leva para a beira, e da beira se cai no patamar de baixo.]', 'cat');
}
async function caiuDaBeira9() {
  W2.mv = null; sfx('fall'); V.shake = 8;
  // cai pela beira e pelo paredão até o chão do patamar de baixo
  let x = W2.x, y = W2.y + 1; const m = W2.map;
  while (y < m.h - 1 && ['abismo', 'rocha'].includes(tileOf(m, x, y).t)) y++;
  const ok = y < m.h && !tileOf(m, x, y).solid && tileOf(m, x, y).t !== 'abismo';
  await fadeOut(10);
  if (ok) loadMap2('encosta9', x, y, 'down'); else loadMap2('encosta9', ...EN9.patamares[0].ent, 'up');
  await fadeIn(10);
  G.flags.c9Quedas = (G.flags.c9Quedas || 0) + 1;
  const n = G.flags.c9Quedas;
  if (n === 1) { await say('* Você escorrega, gira no ar, bate num monte de neve fofa no patamar de baixo. A Rita aterrissa em pé. A Lume aterrissa em cima de você.'); await say('Desculpa! Você é macio.', 'lume'); await say('Eu sou uma mala. Mala é feita pra cair.', 'me'); }
  else if (n % 4 === 0) await say(pickOne(['Patamar de baixo de novo. Esse morro tem senso de humor.', 'A neve aqui já tem o meu formato.', 'Abrigo. Pedra. Norte. Eu sei. EU SEI.']), 'me');
}
// desenho: a cidade no abismo, os traços do vento e o aviso
{ const _arV9 = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arV9 ? _arV9(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world') return r;
  if (m === MAPS2.encosta9) {
    const V9 = W2.vento9 || { t: 0, emp: 0 }, av = V9.t >= VENTO9.per - VENTO9.aviso;
    ventoFx(V9.emp > 0 ? 1 : av ? 0.35 : 0.06, W2.t);
  }
  if (c9Ativo() && ['sope9', 'encosta9', 'crista9', 'farol9'].includes(W2.id)) neveFx(ox, oy, W2.t, ehNoite());
  return r;
}; }
{ const _chV9 = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) { const r = _chV9 ? _chV9(m, ox, oy) : undefined; if (m && m === MAPS2.encosta9) cidadeAbismo9(ox, oy, W2.t); return r; }; }
{ const _hmV9 = hudMundo; hudMundo = function (m) {
  _hmV9(m);
  if (!ventoAtivo9() || !W2.vento9) return;
  const V9 = W2.vento9, falta = VENTO9.per - V9.t, av = falta <= VENTO9.aviso;
  const x = 4, y = H - 22; box(x, y, 96, 18, { edge: av ? '#ff8a8a' : '#8fe3d8' });
  txt(V9.emp > 0 ? 'RAJADA!' : av ? 'VENTO!' : 'vento', x + 6, y + 5, { col: V9.emp > 0 || av ? '#ffb0b0' : '#c8d8e8' });
  const p = Math.min(1, V9.t / (VENTO9.per - VENTO9.aviso)); bx.fillStyle = '#1a1a2a'; bx.fillRect(x + 52, y + 7, 38, 4); bx.fillStyle = av ? '#ff6a6a' : '#8fe3d8'; bx.fillRect(x + 52, y + 7, Math.round(38 * Math.min(1, av ? 1 : p)), 4);
  if (abrigado9(W2.x, W2.y)) { bx.fillStyle = '#9be58a'; bx.fillRect(x + 92, y + 6, 3, 6); }
}; }
// ---------- LEITURA (a moça de âmbar no Avaliar) ----------
Object.assign(ST_NAME, { lido: 'LIDO' });
{ const _pkL = pickTarget; pickTarget = async function () { const t = await _pkL.apply(this, arguments); BT._ultimoAlvo9 = t; return t; }; }
{ const _dcL = doCommand; doCommand = async function (m, k) {
  const r = await _dcL(m, k);
  if (k === 'avaliar' && G.flags.c9Leitura && BT._ultimoAlvo9 && BT._ultimoAlvo9.hp > 0) {
    const t = BT._ultimoAlvo9; t.st.lido = 3; const [x, y] = unitCenter(t); popNum(x, y - 34, 'LIDO', '#ffd890');
    if (!G.flags.tutLido9) { G.flags.tutLido9 = true; await say('{o}Esse eu leio pra você. Quando ele for bater, eu aviso. Escuta a minha voz, não o anel.{/}', 'eco8'); await say('[LEITURA: o inimigo avaliado fica LIDO por 3 golpes: o anel de defesa fica mais largo contra ele.]', 'cat'); }
    else callout('"Deixa comigo."', '#ffd890', 40);
  }
  return r;
}; }
{ const _fsL9 = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  if (e && e.st && e.st.lido > 0 && t && t.hp > 0) { e.st.lido--; BT._lido9 = true; callout('"' + (t.id === 'bau' ? 'Você' : t.name) + '! Agora!"', '#ffd890', 30); try { return await _fsL9(e, t, pow, o); } finally { BT._lido9 = false; } }
  return _fsL9(e, t, pow, o);
}; }
// anel mais largo quando a moça está lendo (perfeito ±5, bom ±12)
{ const _urL9 = updateRing; updateRing = function () {
  if (!BT._lido9 || !BT.ring) return _urL9();
  const R = BT.ring; R.t++;
  const dt = R.t - R.n;
  if (!R.res && btnp('a')) { const a = Math.abs(dt); R.res = a <= 5 ? 'perfeito' : a <= 12 ? 'bom' : 'falhou'; R.at = R.t; }
  if ((R.res && R.t - R.at > 6) || dt > 14) { const res = R.res || 'falhou'; BT.ring = null; R.r(res); }
}; }
// o aro âmbar em volta do anel quando ela está lendo
{ const _dwL9 = drawUnit; drawUnit = function (u) { const r = _dwL9(u); if (BT._lido9 && BT.ring && BT.ring.m === u) { const [x, y] = unitCenter(u); fxRing(x, y, 22 + Math.sin(BT.t * 0.3) * 2, '#ffd890', 0.6); } return r; }; }
// ---------- o Tiago ajuda (luta do Faroleiro): "Troco" a cada 3 vezes do grupo ----------
const TIAGO_ATK = { name: 'Tiago', id: 'tiago', side: 'x', atk: 78, mag: 0, st: {}, row: 'front' };
{ const _actT9 = act; act = async function (m, fn) {
  if (!BT.tiago9 || !m || m.side !== 'p') return _actT9(m, fn);
  return _actT9(m, async () => {
    await fn();
    BT.tiago9.n = (BT.tiago9.n || 0) + 1;
    if (BT.tiago9.n % (BT.tiago9.forte ? 2 : 3) !== 0) return;
    const alvo = alive(BT.foes).find(f => f.boss) || alive(BT.foes)[0]; if (!alvo) return;
    callout('TROCO DO TIAGO!', '#c8d8ff', 50); sfx('item'); const [tx, ty] = unitCenter(alvo);
    await tw(16, p => { for (let i = 0; i < 3; i++) { bx.fillStyle = i % 2 ? '#fff0b0' : '#ffd070'; bx.fillRect(Math.round(16 + (tx - 16) * p + i * 3), Math.round(110 + (ty - 110) * p - Math.sin(p * Math.PI) * (30 + i * 6)), 3, 3); } });
    burst(tx, ty, 10, ['#ffd070', '#fff0b0']); hitFoe(TIAGO_ATK, alvo, 0.9, { el: 'corte', brk: 1 });
  });
}; }
