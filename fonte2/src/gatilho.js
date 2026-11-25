// ================= RUNA DE GATILHO (Cap. 4, Parte 2: a Dona Ilda ensina em Candeia) =================
// Um espaço novo em cada página do Grimório: o feitiço pode ser escrito com GATILHO. Em vez de sair na hora, ele fica
// ARMADO (ação leve, +2 PM) e dispara sozinho quando acontece a condição:
//  - DARDO / ONDA: "quando o inimigo agir" -> dispara no começo da vez dele (antes do golpe), 30% mais forte e
//    quebrando 1 de escudo a mais (2 se ele estiver preparando um golpe: é o jeito de cancelar golpes preparados).
//  - VÉU: "quando o aliado cair abaixo de 35%" -> o véu sai sozinho nele, 30% mais forte.
// Na luta, a runa armada fica girando em cima do alvo. Uma armadilha por página; acaba no fim da luta.
function gatOk() { return !!(G.grim && G.grim.gatilho); }
// descrição e custo
{ const _pg = pagina3; pagina3 = function (s) {
  const P = _pg(s);
  if (s.g) { P.nm = 'Gatilho: ' + P.nm; P.mp += 2; P.w = 'leve'; P.d += fb(s) === 'veu' ? ' · GATILHO: sai sozinho quando o aliado cair abaixo de 35% (30% mais forte). Armar é leve.' : ' · GATILHO: dispara quando o inimigo agir, antes do golpe dele (30% mais forte, +1 quebra; +2 se ele estiver preparando golpe). Armar é leve.'; }
  return P;
}; }
// armar em vez de lançar
{ const _fe = feitico3; feitico3 = function (s) {
  const F = _fe(s); if (!s.g) return F;
  const P = pagina3(s);
  return { ...F, nm: P.nm, mp: P.mp, w: 'leve', d: P.d, run: async (m, t) => {
    BT.gatilhos = BT.gatilhos || [];
    const alvo = t === 'all' ? 'all' : t;
    const [x, y] = alvo === 'all' ? [190, 120] : unitCenter(alvo);
    if (m.id === 'bau') await bauConjura(m, P.col, 10); else sfx('rune');
    await tw(22, p => { for (let i = 0; i < 3; i++) { const a = p * 6 + i * 2.1; bx.strokeStyle = P.col; bx.globalAlpha = 1 - p * 0.4; bx.beginPath(); bx.moveTo(x + Math.cos(a) * 14, y - 30 + Math.sin(a) * 5); bx.lineTo(x + Math.cos(a + 2.1) * 14, y - 30 + Math.sin(a + 2.1) * 5); bx.stroke(); bx.globalAlpha = 1; } fxRing(x, y - 30, 16 * (1 - p) + 4, P.col, p); });
    BT.gatilhos.push({ m, s, t: alvo, col: P.col, k: P.dob ? 1.5 : 1 }); m.pose = null;
    callout('Runa armada: ' + (fb(s) === 'veu' ? 'espera o aliado precisar' : 'espera o inimigo se mexer'), P.col, 60);
  } };
}; }
// dispara: inimigo vai agir
async function dispararGatilho(G0, alvoAgora) {
  BT.gatilhos = BT.gatilhos.filter(g => g !== G0);
  const P = pagina3(G0.s), F = FORMA3[G0.s.f], m = G0.m;
  if (m.hp <= 0) return;
  const [x, y] = unitCenter(alvoAgora);
  callout('GATILHO!', G0.col, 50); sfx('crit'); flashW(2);
  await tw(10, p => { fxRing(x, y - 30, 4 + p * 26, G0.col, 1 - p); fxRing(x, y, 4 + p * 18, '#ffffff', 1 - p); });
  if (fb(G0.s) === 'veu') { await veu3(m, alvoAgora, P, G0.k * 1.3); return; }
  BT._gatBrk = alvoAgora.charge ? 2 : 1;
  try { await golpe3(m, fb(G0.s) === 'onda' ? alive(BT.foes) : [alvoAgora], P, F, G0.s, G0.k * 1.3); } finally { BT._gatBrk = 0; }
}
{ const _hfG = hitFoe; hitFoe = function (a, t, pow, o = {}) { if (BT._gatBrk) o = { ...o, brk: (o.brk || 1) + BT._gatBrk }; return _hfG(a, t, pow, o); }; }
{ const _ftG = foeTurn; foeTurn = async function (e) {
  const gs = (BT.gatilhos || []).filter(g => fb(g.s) !== 'veu' && (g.t === e || g.t === 'all'));
  for (const g of gs) { if (e.hp <= 0) break; await dispararGatilho(g, e); }
  if (e.hp <= 0) return;
  return _ftG(e);
}; }
{ const _fsG = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  const r = await _fsG(e, t, pow, o);
  if (t && t.hp > 0 && t.hp < t.mhp * 0.35) { const g = (BT.gatilhos || []).find(g => fb(g.s) === 'veu' && g.t === t); if (g) await dispararGatilho(g, t); }
  return r;
}; }
// a runa armada girando em cima do alvo
{ const _duG = drawUnit; drawUnit = function (u) {
  _duG(u);
  for (const g of BT.gatilhos || []) if (g.t === u || (g.t === 'all' && u.side === 'e' && u.hp > 0)) {
    const [x] = unitCenter(u), y = (u._Y || u.y - 40) - 8;
    for (let i = 0; i < 3; i++) { const a = BT.t * 0.08 + i * 2.1, b = a + 2.1; bx.strokeStyle = g.col; bx.globalAlpha = 0.8; bx.beginPath(); bx.moveTo(x + Math.cos(a) * 6, y + Math.sin(a) * 2); bx.lineTo(x + Math.cos(b) * 6, y + Math.sin(b) * 2); bx.stroke(); bx.globalAlpha = 1; }
  }
}; }
// as armadilhas acabam com a luta
{ const _b2 = battle2; battle2 = function (cfg) { BT.gatilhos = []; return _b2(cfg); }; }
// no Grimório: depois da forma, escolher se a página tem gatilho
{ const _ep = escreverPagina; escreverPagina = async function (i) {
  const ok = await _ep(i);
  if (!ok || !gatOk()) return ok;
  const Gm = grim(), s = Gm.slots[i];
  const c = await list({ x: 40, y: 30, w: 170, title: 'Runa de Gatilho', items: [{ label: 'Sem gatilho (lança na hora)' }, { label: 'Com GATILHO (fica armado)', col: '#ffd060' }],
    desc: j => j ? (fb(s) === 'veu' ? 'Sai sozinho quando o aliado cair abaixo de 35%. Armar é leve, +2 PM, 30% mais forte.' : 'Dispara quando o inimigo agir, antes do golpe dele: 30% mais forte, +1 quebra (+2 se ele estiver preparando golpe). Armar é leve, +2 PM.') : 'O feitiço sai na hora, como sempre.', descY: 150 });
  if (c === 1) { s.g = true; sfx('rune'); await say(`* Você desenha a Runa de Gatilho no canto da página: {y}${pagina3(s).nm}{/}. Agora ela espera.`); }
  else delete s.g;
  save2(); return ok;
}; }
