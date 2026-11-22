// ================= PLACAS (pedido do usuário: "coloque placa nos lugares, principalmente os que dão para entrar") =================
// 1) TABULETAS penduradas, com ícone, nos prédios onde se entra (taverna, guilda, bazar, papelaria, casa da Ilda...).
// 2) NOME DO LUGAR: ao chegar perto (até 3 tiles) de qualquer entrada/saída, aparece uma plaquinha com o nome do destino.
//    Vale para todos os mapas (usa as portas + LIGA_EXTRA do mapa.js); ROTULOS acrescenta/renomeia lugares.
const PLACA_C = {};
function placaArt(ic) {
  if (PLACA_C[ic]) return PLACA_C[ic];
  const c = mk(20, 40), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  // braço de ferro e correntinhas
  P('#1a1418', 0, 1, 16, 2); P('#4a4048', 0, 1, 15, 1); P('#1a1418', 0, 0, 2, 5);
  P('#6a6070', 3, 3, 1, 3); P('#6a6070', 13, 3, 1, 3);
  // tábua com sombra e borda
  P('rgba(0,0,0,0.35)', 2, 7, 15, 12); P('#2a1a10', 1, 6, 15, 12); P('#7a5230', 2, 7, 13, 10); P('#9a6a40', 2, 7, 13, 1); P('#5a3a20', 2, 16, 13, 1);
  // ícone
  const I = (col, a, b, w, h) => P(col, 2 + a, 7 + b, w, h);
  if (ic === 'caneca') { I('#e8e0d0', 4, 2, 5, 6); I('#d8a040', 4, 4, 5, 4); I('#e8e0d0', 9, 3, 2, 1); I('#e8e0d0', 10, 4, 1, 3); I('#e8e0d0', 9, 6, 2, 1); I('#ffffff', 4, 1, 5, 2); }
  else if (ic === 'escudo') { I('#c8c8d8', 3, 1, 7, 5); I('#c8c8d8', 4, 6, 5, 2); I('#c8c8d8', 5, 8, 3, 1); I('#8a2a2a', 6, 2, 1, 6); I('#8a2a2a', 4, 4, 5, 1); }
  else if (ic === 'casa') { I('#c84a3a', 3, 3, 7, 1); I('#c84a3a', 4, 2, 5, 1); I('#c84a3a', 5, 1, 3, 1); I('#e8d8b0', 4, 4, 5, 4); I('#5a3a20', 6, 6, 1, 2); }
  else if (ic === 'balanca') { I('#e8c860', 6, 1, 1, 7); I('#e8c860', 2, 2, 9, 1); I('#e8c860', 2, 3, 1, 2); I('#e8c860', 10, 3, 1, 2); I('#e8c860', 1, 5, 3, 1); I('#e8c860', 9, 5, 3, 1); I('#e8c860', 4, 8, 5, 1); }
  else if (ic === 'livro') { I('#3a5a9a', 2, 2, 4, 6); I('#9a3a3a', 7, 2, 4, 6); I('#f0e8d8', 6, 2, 1, 6); I('#f0e8d8', 3, 3, 2, 1); I('#f0e8d8', 8, 3, 2, 1); }
  else if (ic === 'pena') { I('#f0f0f8', 7, 1, 2, 2); I('#f0f0f8', 6, 2, 2, 2); I('#f0f0f8', 5, 3, 2, 2); I('#c8c8e0', 4, 5, 2, 2); I('#2a2a3a', 3, 7, 1, 2); I('#a868d8', 9, 6, 2, 2); }
  else if (ic === 'picareta') { I('#8a8a9a', 2, 2, 8, 1); I('#8a8a9a', 1, 3, 2, 1); I('#8a8a9a', 9, 3, 2, 1); I('#8a5a30', 5, 3, 1, 6); I('#f0b850', 9, 6, 2, 2); }
  else if (ic === 'cama') { I('#e8e0d0', 2, 4, 9, 2); I('#8a5a3a', 1, 3, 1, 5); I('#8a5a3a', 11, 5, 1, 3); I('#8a3a3a', 3, 3, 3, 1); I('#5a3a20', 1, 6, 11, 1); }
  return (PLACA_C[ic] = c);
}
// tabuletas: [mapa, x, linha da porta, ícone]
const TABULETAS_EXTRA = [];
const TABULETAS = () => [...TABULETAS_EXTRA.map(f => f()),
  ['praca', POS2.praca.tavDoor[1][0] + 1.3, POS2.praca.tavDoor[0][1], 'caneca'], ['praca', POS2.praca.guildaDoor[0] + 1.2, POS2.praca.guildaDoor[1], 'escudo'],
  ['praca', POS2.praca.tobDoor[1][0] + 1.2, POS2.praca.tobDoor[0][1], 'casa'], ['cais', POS2.cais.bazarDoor[1][0] + 1.2, POS2.cais.bazarDoor[0][1], 'balanca'],
  ['auren', POS3.auren.papDoor[1][0] + 1.2, POS3.auren.papDoor[0][1], 'livro'],
  ['candeia', POS4B.candeia.ildaDoor[1][0] + 1.2, POS4B.candeia.ildaDoor[0][1], 'pena'], ['candeia', POS4B.candeia.minaDoor[1][0] + 1.2, POS4B.candeia.minaDoor[0][1], 'picareta'],
  ['candeia', POS4B.candeia.pensaoDoor[1][0] + 1.2, POS4B.candeia.pensaoDoor[0][1], 'cama']
];
// lugares com nome que não são saídas (ou que pedem outro nome): mapa -> [[x, y, nome]]
const ROTULOS_EXTRA = {};
const ROTULOS = () => Object.assign({
  praca: [[...POS2.praca.guildaDoor, 'Posto da Guilda'], [...POS2.praca.igrejaSinais[0], 'Igreja do Sino']],
  largo: [[...POS4.largo.lavDoor, 'Lavanderia']],
  candeia: [[...POS4B.candeia.pensaoDoor[0], 'Pensão dos Transferidos']]
}, Object.fromEntries(Object.entries(ROTULOS_EXTRA).map(([k, f]) => [k, f()])));
{ const _mmP = montarMapas2; montarMapas2 = function () {
  _mmP.apply(this, arguments);
  for (const [id, x, y, ic] of TABULETAS()) { const m = MAPS2[id]; if (!m || (m._tab || (m._tab = {}))[x + ',' + y]) continue; m._tab[x + ',' + y] = 1; m.props.push({ img: () => placaArt(ic), x: x - 0.1, y, by: y * TS + 1 }); }
}; }
// nomes curtos: "Velhágua · Igreja do Sino" -> "Igreja do Sino"
const nomeCurto = (s) => String(s || '').split(' · ').pop();
function lugaresDe(id) {
  const out = new Map(), R = ROTULOS()[id] || [];
  for (const [x, y, to] of (typeof saidasDe === 'function' ? saidasDe(id) : [])) { if (!MAPS2[to]) continue; const k = to; const o = out.get(k) || { xs: [], y, nm: nomeCurto(MAPS2[to].name) }; o.xs.push(x); out.set(k, o); }
  for (const [x, y, nm] of R) { for (const [k, o] of out) if (o.xs.includes(x) && o.y === y) out.delete(k); out.set('r' + x + ',' + y, { xs: [x], y, nm }); }
  return [...out.values()].map(o => ({ x: o.xs.reduce((a, b) => a + b, 0) / o.xs.length, y: o.y, nm: o.nm, xs: o.xs }));
}
{ const _arP = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arP ? _arP(m, ox, oy) : undefined;
  if (!m || UI.stack.length || V.scene !== 'world') return r;
  if (!W2._lug || W2._lug.id !== W2.id) W2._lug = { id: W2.id, L: lugaresDe(W2.id) };
  for (const L of W2._lug.L) {
    const d = Math.min(...L.xs.map(x => Math.max(Math.abs(x - W2.x), Math.abs(L.y - W2.y))));
    if (d > 3) continue;
    const a = d <= 1 ? 1 : d === 2 ? 0.85 : 0.55;
    // o mundo é desenhado num quadro maior (TXZ) e encolhido: a placa usa a escala da tela para o texto ficar nítido
    const z = TXZ, w = Math.round((lineW(rich(L.nm)) + 10) * z), hh = Math.round(14 * z), sx = Math.max(2, Math.min(W - w - 2, Math.round(L.x * TS - ox + 8 - w / 2))), sy = Math.round(L.y * TS - oy - 30 - hh), u = Math.max(1, Math.round(z));
    bx.globalAlpha = a;
    bx.fillStyle = 'rgba(0,0,0,0.45)'; bx.fillRect(sx + u, sy + u, w, hh);
    bx.fillStyle = 'rgba(16,10,6,0.92)'; bx.fillRect(sx, sy, w, hh);
    bx.fillStyle = '#c8a060'; bx.fillRect(sx, sy, w, u); bx.fillRect(sx, sy + hh - u, w, u); bx.fillRect(sx, sy, u, hh); bx.fillRect(sx + w - u, sy, u, hh);
    bx.fillRect(sx + Math.round(w / 2) - u, sy + hh, u * 3, u); bx.fillRect(sx + Math.round(w / 2), sy + hh + u, u, u);
    bx.globalAlpha = 1;
    txt(L.nm, sx + 5 * z, sy + 1 * z, { col: '#f0e0b8', alpha: a, sz: z });
  }
  return r;
}; }
