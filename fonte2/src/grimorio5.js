// ================= O GRIMÓRIO NO CAP. 5: AREIA, FUSÕES NOVAS, RESSONÂNCIA E A VELA INTERIOR =================
// AREIA (achada na mesa dos vidreiros da Estufa): elemento de CORTE que quebra +1 de escudo. Fusões:
//   Brasa + Areia = VIDRO (corta e quebra +2 de escudo), Areia + Geada = GRANIZO (três pedradas de gelo e corte),
//   Areia + Seiva = ESPINHEIRO (corte que drena; véu de espinhos devolve dano), Areia + Fuligem = TEMPESTADE DE AREIA
//   (todos tontos). Cada uma tem o seu VÉU.
// RESSONÂNCIA (a Dona Iolanda ensina no começo do capítulo): um VÉU do baú em cima da Rita ou da Lume muda o PRÓXIMO
//   golpe dela: ganha o elemento do véu e bate 30% mais forte (a lança pega fogo, a luz vira cacos de vidro...).
// A VELA INTERIOR (a Lume, depois da cena mais difícil do capítulo): técnica nova e a teimosia de não esquecer.
Object.assign(EL3, { areia: { nm: 'Areia', el: 'corte', col: '#e0c078', cols: ['#e0c078', '#f8e8b0', '#a88848'], d: 'corte; quebra +1 de escudo', brk: 1 } });
ORD_EL.push('areia');
Object.assign(FUS3, {
  'areia+brasa': { nm: 'Vidro', col: '#bff0ff', cols: ['#e8fbff', '#8ad8f0', '#ffffff'], hits: [['corte', 1.1]], brk: 2, d: 'vidro afiado: corta e quebra +2 de escudo', veu: 'vidro', nota: '"Brasa + Areia = Vidro. Corta escudo como faca quente na manteiga. Não lamber."' },
  'areia+geada': { nm: 'Granizo', col: '#d8f0ff', cols: ['#ffffff', '#bff0ff', '#e0c078'], hits: [['gelo', 0.42], ['corte', 0.42], ['gelo', 0.42]], st: 'frio', brk: 1, d: 'três pedradas de gelo e corte; gela', veu: 'granizo', nota: '"Areia + Geada = Granizo. Chove pedra. Bom para quem tem escudo de vidro, ruim para telhado."' },
  'areia+seiva': { nm: 'Espinheiro', col: '#a8c870', cols: ['#a8c870', '#e0c078', '#4a7a3a'], hits: [['corte', 0.85]], dreno: 0.35, d: 'espinhos que cortam e devolvem vida', veu: 'espinhos', nota: '"Areia + Seiva = Espinheiro. A planta aprendeu a se defender. Igual eu."' },
  'areia+fuligem': { nm: 'Tempestade de Areia', col: '#c8a878', cols: ['#c8a878', '#8a7a6a', '#e0c078'], hits: [['corte', 0.6]], tonto: 0.75, d: 'areia nos olhos de todo mundo: quase todos ficam TONTOS', veu: 'redemoinho', nota: '"Areia + Fuligem = Tempestade. Ninguém enxerga nada. Nem eu. Recomendo óculos."' }
});
Object.assign(VEU3, {
  areia: { nm: 'Duna', d: 'o aliado leva metade do próximo golpe e quem bateu fica TONTO' },
  vidro: { nm: 'Cacos', d: 'o próximo golpe do aliado quebra +2 de escudo' },
  granizo: { nm: 'Granizo', d: 'couraça (metade do dano) e quem bater nele fica GELADO' },
  espinhos: { nm: 'Espinhos', d: 'por 2 golpes, devolve 40% do dano a quem bater no aliado' },
  redemoinho: { nm: 'Redemoinho', d: 'o próximo golpe no aliado erra e a vez dele adianta' }
});
Object.assign(ST_NAME, { duna: 'DUNA', cacos: 'CACOS', espinhos: 'ESPINHOS', granizo: 'GRANIZO', resson: 'RESSONÂNCIA', teimosa: 'TEIMOSA' });
// quebra extra da areia e das fusões com quebra
{ const _g5 = golpe3; golpe3 = async function (m, alvos, P, F, s, k) {
  const extra = (P.fus && P.fus.brk) || (!P.fus && EL3[s.e[0]] && EL3[s.e[0]].brk) || 0;
  BT._brk5 = extra; try { return await _g5(m, alvos, P, F, s, k); } finally { BT._brk5 = 0; }
}; }
{ const _hf5 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (BT._brk5) o = { ...o, brk: (o.brk || 1) + BT._brk5 };
  // cacos (véu de vidro) e ressonância: o próximo golpe do aliado
  if (a && a.side === 'p' && a.st) {
    if (a.st.cacos > 0 && !o.mag) { o = { ...o, brk: (o.brk || 1) + 2 }; a.st.cacos = 0; const [x, y] = unitCenter(t); popNum(x, y - 30, 'CACOS!', '#bff0ff'); }
    if (a.st.resson && a.id !== 'bau' && !o._resson) {
      const R = RESSON[a.st.resson]; a.st.resson = 0;
      if (R) { o = { ...o, el: R.el || o.el, _resson: true }; pow *= 1.3; const [x, y] = unitCenter(t); callout('RESSONÂNCIA: ' + R.nm(a), R.col, 60); burst(x, y, 16, R.cols, { up: 1 }); if (R.st === 'frio') { t.st.frio = 2; } if (R.brk) o.brk = (o.brk || 1) + R.brk; }
    }
  }
  return _hf5(a, t, pow, o);
}; }
// véus novos
{ const _v5 = veu3; veu3 = async function (m, t, P, k) {
  const K = P.veuK, [x, y] = unitCenter(t);
  if (['areia', 'vidro', 'granizo', 'espinhos', 'redemoinho'].includes(K)) {
    await tw(22, p => { fxRing(x, y, 6 + p * 16, P.col, 1 - p); for (let i = 0; i < 8; i++) { const a = p * 7 + i; bx.fillStyle = P.cols[i % P.cols.length]; bx.fillRect(Math.round(x + Math.cos(a) * 15), Math.round(y + 10 - p * 26 + Math.sin(a) * 3), 2, 2); } });
    if (K === 'areia') { t.st.duna = 1; t.def0 = true; popNum(x, y - 26, 'DUNA', '#e0c078'); }
    if (K === 'vidro') { t.st.cacos = 1; popNum(x, y - 26, 'CACOS', '#bff0ff'); }
    if (K === 'granizo') { t.def0 = true; t.st.couraca = 1; t.st.granizo = 1; popNum(x, y - 26, 'GRANIZO', '#d8f0ff'); }
    if (K === 'espinhos') { t.st.espinhos = Math.round(2 * k); popNum(x, y - 26, 'ESPINHOS', '#a8c870'); }
    if (K === 'redemoinho') { t.st.sumido = 1; t.ct = Math.min(99, t.ct + 30); popNum(x, y - 26, 'REDEMOINHO', '#c8a878'); }
  } else await _v5(m, t, P, k);
  // RESSONÂNCIA: véu do baú numa aliada muda o próximo golpe dela
  if (G.flags.resson && m.id === 'bau' && t.id !== 'bau' && t.hp > 0) {
    const el = (P.fus ? Object.keys(FUS3).find(kk => FUS3[kk] === P.fus) : null) || P.veuK;
    const chave = RESSON[el] ? el : RESSON[P.veuK] ? P.veuK : null;
    if (chave) { t.st.resson = chave; await wait(6); popNum(x, y - 40, 'RESSONÂNCIA', RESSON[chave].col); sfx('rune'); }
  }
}; }
const RESSON = {
  brasa: { el: 'fogo', col: '#ffa94d', cols: ['#f07830', '#ffd040'], nm: a => a.id === 'rita' ? 'Lança em Brasa' : 'Faísca de Fogo' },
  geada: { el: 'gelo', col: '#bff0ff', cols: ['#bff0ff', '#7ad0f0'], st: 'frio', nm: a => a.id === 'rita' ? 'Lança de Gelo' : 'Luz Gelada' },
  seiva: { el: null, col: '#9be58a', cols: ['#9be58a', '#ffffff'], nm: a => a.id === 'rita' ? 'Lança Viva' : 'Luz Verde' },
  fuligem: { el: null, col: '#c0b0e0', cols: ['#6a5a7a', '#a898b8'], nm: a => 'Golpe na Fumaça' },
  areia: { el: 'corte', col: '#e0c078', cols: ['#e0c078', '#f8e8b0'], brk: 1, nm: a => a.id === 'rita' ? 'Lança de Areia' : 'Luz Cortante' },
  vidro: { el: 'corte', col: '#bff0ff', cols: ['#ffffff', '#8ad8f0'], brk: 2, nm: a => a.id === 'rita' ? 'Lança de Vidro' : 'Luz em Cacos' },
  vapor: { el: 'fogo', col: '#e8e8f0', cols: ['#ffffff', '#c8d8e8'], nm: a => 'Golpe Escaldante' },
  orvalho: { el: 'gelo', col: '#a8f0e0', cols: ['#a8f0e0', '#ffffff'], nm: a => 'Golpe de Orvalho' },
  brasaviva: { el: 'fogo', col: '#ffb040', cols: ['#ffb040', '#9be58a'], nm: a => 'Brasa Viva' },
  granizo: { el: 'gelo', col: '#d8f0ff', cols: ['#ffffff', '#bff0ff'], st: 'frio', brk: 1, nm: a => 'Golpe de Granizo' },
  espinhos: { el: 'corte', col: '#a8c870', cols: ['#a8c870', '#4a7a3a'], nm: a => 'Golpe de Espinho' }
};
// efeitos defensivos novos (Duna, Granizo, Espinhos) quando o inimigo bate
{ const _fs5 = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  const hp0 = t ? t.hp : 0;
  const r = await _fs5(e, t, pow, o);
  if (!t || !t.st || !e || e.hp <= 0) return r;
  const dano = Math.max(0, hp0 - t.hp), [x, y] = unitCenter(e);
  if (t.st.duna > 0) { t.st.duna = 0; e.ct = Math.max(0, e.ct - 40); popNum(x, y - 30, 'TONTO', '#d0a8ff'); }
  if (t.st.granizo > 0) { t.st.granizo = 0; e.st.frio = 2; popNum(x, y - 30, 'GELADO', '#bff0ff'); }
  if (t.st.espinhos > 0 && dano > 0) { t.st.espinhos--; const d = Math.max(1, Math.round(dano * 0.4)); e.hp = Math.max(1, e.hp - d); popNum(x, y - 20, '-' + d, '#a8c870'); burst(x, y, 8, ['#a8c870', '#4a7a3a']); }
  return r;
}; }
// a descrição do véu avisa da ressonância
{ const _pg5 = pagina3; pagina3 = function (s) { const P = _pg5(s); if (G.flags && G.flags.resson && s.f === 'veu' && !s.g) P.d += ' · na Rita ou na Lume: RESSONÂNCIA (o próximo golpe dela ganha o elemento, +30%)'; return P; }; }

// ---------- a VELA INTERIOR (Lume) ----------
TECH2.velaInterior = { nm: 'Vela Interior', cost: 40, tgt: 'self', w: 'normal', d: 'A luz que ninguém acende por ela: cura 20% do grupo, tira os maus estados e deixa o grupo TEIMOSO (não esquece nem treme) por 3 vezes. +10 Tensão.', run: async (m) => {
  sfx('heal'); jingle('C5:2 E5:2 G5:2 C6:4 G5:2 C6:6', 240);
  const [x0, y0] = unitCenter(m);
  await tw(44, (p, k) => { luzMagia(x0, y0 - 10, 20 + p * 70, `rgba(255,220,140,${0.5 * (1 - p)})`, 1); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + k * 0.05; bx.fillStyle = i % 2 ? '#fff0a0' : '#ffd060'; bx.fillRect(Math.round(x0 + Math.cos(a) * (10 + p * 50)), Math.round(y0 - 10 + Math.sin(a) * (6 + p * 30)), 2, 2); } });
  for (const u of alive(BT.party)) { healUnit(u, Math.round(u.mhp * 0.2)); for (const s of ['queimado', 'frio', 'tonto', 'esquecido', 'preso', 'molhado']) if (u.st[s]) u.st[s] = 0; u.st.teimosa = 3; }
  BT.tension = Math.min(100, BT.tension + 10); callout('A Lume brilha por conta própria', '#ffe08a', 70);
} };
// TEIMOSA: não esquece a vez (névoa, apito)
{ const _ocT = openCommand; openCommand = function (m) { if (m && m.st && m.st.esquecido > 0 && (m.st.teimosa > 0 || (m.id === 'lume' && G.flags.c5Vela))) { m.st.esquecido = 0; if (m.st.teimosa > 0) m.st.teimosa--; const [x, y] = unitCenter(m); popNum(x, y - 30, 'NÃO ESQUECI!', '#ffe08a'); } return _ocT(m); }; }
{ const _gaV = grupoAtual; grupoAtual = function () { const g = _gaV(); if (G.flags && G.flags.c5Vela) { const l = g.find(m => m.id === 'lume'); if (l && !(l.techs || []).includes('velaInterior')) l.techs = [...(l.techs || []), 'velaInterior']; if (l) l.mag = Math.round(l.mag * 1.1); } return g; }; }
