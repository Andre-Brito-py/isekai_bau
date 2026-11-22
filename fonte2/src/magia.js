// ================= MAGIA QUE VALE A PENA =================
// (pedido do usuário: "faça com que as magias futuramente valham a pena, não somente os ataques físicos, até porque
// teoricamente caminhos mágicos têm que dar mais dano e ser menos tanque".)
// 1) CRESCIMENTO POR PAPEL (por "poder" = 3,3 níveis): o baú ARCANO (ou Escriba) cresce em MAG e pouco em vida e
//    defesa; o baú de FERRO (ou Farol) cresce em vida, defesa e ataque. Lume = maga de apoio; Rita = tanque/física.
// 2) FEITIÇOS ESCALAM COM O NÍVEL: todo dano mágico do grupo ganha +1,5% por nível, e o caminho mágico do baú
//    (linha arcana ou Escriba) ganha mais +20%. Assim, no fim da temporada, um feitiço certo na fraqueza bate mais
//    que um golpe físico; o físico continua mais seguro (não gasta PM, o tanque aguenta).
function caminhoMagico(m) { return m.id === 'bau' && (G.evo3 === 'escriba' || (G.evo3 !== 'farol' && linhaDe(G.species) !== 'ferro')); }
function crescimento(m) {
  if (m.id === 'bau') return caminhoMagico(m) ? { hp: 9, atk: 1.2, mag: 3.2, def: 0.6, mdef: 1.2 } : { hp: 17, atk: 2.6, mag: 1.2, def: 1.4, mdef: 0.8 };
  if (m.id === 'lume') return { hp: 9, atk: 1, mag: 2.8, def: 0.8, mdef: 1.2 };
  if (m.id === 'rita') return { hp: 12, atk: 2.6, mag: 0.4, def: 1.3, mdef: 0.8 };
  return { hp: 10, atk: 2, mag: 2, def: 1 };
}
{ const _cdM = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cdM(a, t, pow, o);
  if (o.mag && a && a.side === 'p' && typeof nvDe === 'function') {
    const lv = nvDe(a.id).lv;
    d *= 1 + 0.015 * (lv - 1);
    if (caminhoMagico(a)) d *= 1.2;
  }
  return d;
}; }
