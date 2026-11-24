// ================= A EVOLUÇÃO DA LUME (Cap. 8) e o VERSO NOVO =================
// Pedido do usuário: "planeje uma evolução para a Lume também, ela já é só um candelabro há muito tempo".
// A única evolução do grupo que NÃO cobra preço: foi DADA (o povo de Auren acende velas em volta dela quando a chama
// quase apaga). Duas formas:
//  LAREIRA (apoio): +24 PV, +4 RES, +2 MAG. Técnica LAREIRA VIVA (40 PM): cura 25% de todos, tira os males e deixa
//    "aquecido" por 3 vezes (cura 6% no começo da vez). Passivo: na vez dela, o grupo cura 3%.
//  ALVORADA (ofensiva): +6 MAG, +8 PV. Técnica RAIO DA ALVORADA (36 PM): luz em todos os inimigos, x1,5 nas criaturas do
//    escuro e do frio. Passivo: a luz dela bate 20% mais.
// Visual: de noite um lustre novo (lustreEvoArt) no lugar do do jogo 1; de dia um adereço (aderecoLumeArt).
// VERSO NOVO (ganho no show do Cap. 8, antes da evolução): técnica da Lume (30 PM): o grupo bate 25% mais por 3 vezes
// e ganha 20 de Tensão. A música da Lume ganhou mais um verso.
const EVOL = {
  lareira: { nm: 'Lume-Lareira', cor: '#ffb040', d: 'O lustre vira lareira: aquece, cura, segura o grupo de pé.', mods: { mhp: 44, mdef: 8, mag: 4, def: 3 }, tec: 'lareiraViva' },
  alvorada: { nm: 'Lume-Alvorada', cor: '#bff0ff', d: 'O lustre vira estrela da manhã: a luz que machuca o escuro.', mods: { mag: 12, mhp: 16, mmp: 10 }, tec: 'raioAurora' }
};
const ESCURO_K = ['friagem', 'friagemB', 'loboFuligem', 'apagador', 'capitao', 'geadaViva', 'sombra', 'fuligem'];
{ const _gcL = grupoCap1; grupoCap1 = function () {
  const g = _gcL(), ev = G.evoLume;
  for (const m of g) if (m.id === 'lume') {
    if (G.flags.c8Verso && !(m.techs || []).includes('versoNovo')) m.techs = [...(m.techs || []), 'versoNovo'];
    if (ev && EVOL[ev]) { for (const [a, v] of Object.entries(EVOL[ev].mods)) m[a] = (m[a] || 0) + v; m.techs = [...(m.techs || []), EVOL[ev].tec]; m.evoLume = ev; }
  }
  return g;
}; }
{ const _cdL = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cdL(a, t, pow, o);
  if (a && a.st && a.st.verso > 0 && a.side === 'p') d *= 1.25;
  if (a && a.id === 'lume' && a.evoLume === 'alvorada' && o.el === 'luz') d *= 1.2;
  return d;
}; }
{ const _ocL = openCommand; openCommand = function (m) {
  if (m && m.side === 'p' && m.st && !m._ocL8) {
    m._ocL8 = BT.t;
    if (m.st.aquecido > 0) { m.st.aquecido--; healUnit(m, Math.round(m.mhp * 0.06)); }
    if (m.st.verso > 0) m.st.verso--;
    if (m.id === 'lume' && m.evoLume === 'lareira') for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.03));
  }
  return _ocL(m);
}; }
{ const _etL = endTurn; endTurn = function (u) { if (u) u._ocL8 = 0; return _etL.apply(this, arguments); }; }
Object.assign(ST_NAME, { verso: 'VERSO', aquecido: 'AQUECIDO' });
Object.assign(TECH2, {
  versoNovo: { nm: 'Verso Novo', cost: 30, tgt: 'all_p', d: 'O verso que Auren cantou junto: o grupo bate 25% mais por 3 vezes e ganha 20 de Tensão.', run: async (m) => {
    sfx('rune'); jingle('C5:2 E5:2 G5:2 C6:4 B5:2 G5:2 E5:4', 200); const [x, y] = unitCenter(m);
    await tw(36, p => { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + p * 3; bx.fillStyle = i % 2 ? '#ffd070' : '#fff0c0'; bx.fillRect(Math.round(x + Math.cos(a) * (14 + p * 40)), Math.round(y - 30 + Math.sin(a) * (8 + p * 20) - p * 20), 2, 3); } });
    for (const u of alive(BT.party)) { u.st.verso = 3; const [ux, uy] = unitCenter(u); popNum(ux, uy - 30, 'VERSO', '#ffd070'); }
    BT.tension = Math.min(100, BT.tension + 20); callout('Auren canta junto.', '#ffd070', 60);
  } },
  lareiraViva: { nm: 'Lareira Viva', cost: 40, tgt: 'all_p', d: 'Cura 25% de todos, tira queimadura, frio, tontura e esquecimento, e deixa AQUECIDO por 3 vezes (6% no começo da vez).', run: async (m) => {
    sfx('heal'); const [x, y] = unitCenter(m);
    await tw(30, p => { brilho(x, y - 20, 30 + p * 80, 'rgba(255,170,80,0.35)', 1 - p * 0.5); });
    for (const u of alive(BT.party)) { healUnit(u, Math.round(u.mhp * 0.25)); for (const s of ['queimado', 'frio', 'tonto', 'esquecido', 'preso', 'molhado', 'selado', 'bilhete']) if (u.st[s]) u.st[s] = 0; u.st.aquecido = 3; }
    callout('Ninguém passa frio perto de uma lareira.', '#ffb040', 60);
  } },
  raioAurora: { nm: 'Raio da Alvorada', cost: 36, tgt: 'all', d: 'Luz de amanhecer em todos os inimigos. Nas criaturas do escuro e do frio, uma vez e meia.', run: async (m) => {
    sfx('crit'); flashW(3); const [x, y] = unitCenter(m);
    await tw(26, p => { bx.fillStyle = `rgba(255,240,200,${0.5 * (1 - p)})`; bx.fillRect(0, 0, W, H); luzMagia(x, y - 30, 20 + p * 100, '#fff0b0', 1 - p); });
    for (const t of alive(BT.foes)) { const [tx, ty] = unitCenter(t); burst(tx, ty, 12, ['#fff0b0', '#bff0ff', '#ffffff']); hitFoe(m, t, ESCURO_K.includes(t.kind) ? 1.35 : 0.9, { el: 'luz', mag: true }); }
  } }
});
// ---------- visual ----------
{ const _lfL = lustreFrame; lustreFrame = function (u) { if (G.evoLume && u && u.hp > 0) { const c = lustreEvoArt(G.evoLume, Math.floor(BT.t / 8)); return c; } return _lfL(u); }; }
{ const _fsL = folSprite; folSprite = function (f) {
  const fr = _fsL(f);
  if (f.k !== 'lume' || !G.evoLume || !fr) return fr;
  if (typeof LUSTRE_ON === 'function' && LUSTRE_ON() && !G.flags.lumeCoberta) return lustreEvoArt(G.evoLume, Math.floor(W2.t / 8));
  const key = '_ad' + G.evoLume; if (fr[key]) return fr[key];
  const c = mk(fr.width, fr.height + 3), x = c.getContext('2d'); x.drawImage(fr, 0, 3); x.drawImage(aderecoLumeArt(G.evoLume), Math.round(fr.width / 2 - 11), 0); return (fr[key] = c);
}; }
{ const _duL = drawUnit; drawUnit = function (u) {
  const r = _duL(u);
  if (u && u.id === 'lume' && u.evoLume && !u.lustre && u.hp > 0 && u._X != null) { const w = (u._fw || 24) * (u._sx || 1); bx.drawImage(aderecoLumeArt(u.evoLume), Math.round(u._X + w / 2 - 11), Math.round(u._Y - 1)); }
  return r;
}; }
async function cenaEvolucaoLume() {
  if (G.evoLume) return;
  await say('[A Lume... a chama dela está mudando de cor. Ela está escolhendo. Eu não posso escolher por ela. Ninguém pode.]', 'cat');
  let ev = null;
  while (!ev) {
    const ks = ['lareira', 'alvorada'];
    const i = await list({ x: 20, y: 30, w: 200, title: 'O que a Lume vai ser?', items: ks.map(k => ({ label: EVOL[k].nm, col: EVOL[k].cor })), desc: j => EVOL[ks[j]] && (EVOL[ks[j]].d + ' Técnica: ' + TECH2[EVOL[ks[j]].tec].nm + '. ' + TECH2[EVOL[ks[j]].tec].d), descY: 112 });
    if (i < 0) continue;
    const c = await choose('* ' + EVOL[ks[i]].nm + '?', ['É ela.', 'Pensar de novo']); if (c === 0) ev = ks[i];
  }
  G.evoLume = ev; sfx('rune'); V.shake = 14; curarTudo();
  await say(ev === 'lareira' ? '* As velas em volta da Lume se inclinam todas para ela, como gente se inclinando para um fogão. A chama dela desce do alto da cabeça e se acomoda no peito, larga, baixa, quente. Uma lareira.' : '* As velas em volta da Lume apagam ao mesmo tempo. Por um segundo, escuro. E então ela acende de uma vez, branca, azul nas bordas, como o céu cinco minutos antes do sol. Uma alvorada.');
  await say('* {y}A Lume evoluiu para ' + EVOL[ev].nm + '!{/} (Nenhum preço foi cobrado. Isso foi dado.)');
  { const N = { mhp: 'PV', mmp: 'PM', atk: 'ATQ', mag: 'MAG', def: 'DEF', mdef: 'RESIST', spd: 'VEL' }; await say('* {g}Lume: ' + Object.entries(EVOL[ev].mods).map(([k, v]) => N[k] + ' +' + v).join(' · ') + '{/}'); }
  await say('[TÉCNICA NOVA: ' + TECH2[EVOL[ev].tec].nm + '. ' + TECH2[EVOL[ev].tec].d + ']', 'cat');
  save2();
}
// o retrato do cartão de batalha (de noite) também mostra o lustre novo: recorte do rosto
const PT_LUME = {};
{ const _ptL = PT; PT = function (k) {
  if (k === 'lume' && G.evoLume && typeof LUSTRE_ON === 'function' && LUSTRE_ON()) { const ev = G.evoLume; if (PT_LUME[ev]) return PT_LUME[ev];
    const c = mk(32, 32), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(lustreEvoArt(ev, 0), 0, -1, 32, 32, 0, 0, 32, 32); return (PT_LUME[ev] = c); }
  return _ptL(k);
}; }
