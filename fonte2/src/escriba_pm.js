// ================= BAÚ MÁGICO: PM QUE ACOMPANHA E MORDIDA DE TINTA (v107) =================
// Pedido do usuário: "estou sentindo o baú escriba meio fraquinho demais, ele mal aguenta as magias que usa e já fica
// sem PM, tendo que usar a mordida, que não dá muito dano por ele ser uma classe focada em magia".
// Antes: PM do baú não crescia com o nível (56 PM no nível 18 com Escriba; uma página de fusão custa ~12) e a mordida
// usava o ATQ (22 contra 38 de MAG).
//  1) PM CRESCE COM O NÍVEL no caminho mágico do baú (+5 PM por "poder", ~+1,5 por nível); o Escriba ganha mais +12.
//     Nível 18 Escriba: 56 -> ~94 PM.
//  2) MORDIDA DE TINTA (caminho mágico): a mordida bate com o que for maior entre ATQ e 85% da MAG, e cada mordida que
//     acerta devolve 6 PM ("a pena suga a tinta de volta"). O ritmo vira: feitiço, feitiço, mordida, feitiço.
//     O caminho físico continua igual.
{ const _gcE = grupoCap1; grupoCap1 = function () {
  const g = _gcE();
  for (const m of g) {
    if (m.id !== 'bau' || !caminhoMagico(m)) continue;
    const extra = Math.round(poderNivel('bau') * 5) + (G.evo3 === 'escriba' ? 12 : 0);
    m.mmp = (m.mmp || 0) + extra;
    m.atkNm = 'Mordida de Tinta';
    m.atkDesc = 'A tinta da tampa entra na mordida: bate com a MAG quando ela for maior que o ATQ e devolve 6 PM a cada acerto. A quando o anel fechar = mordida certeira.';
  }
  return g;
}; }
{ const _dcE = doCommand; doCommand = async function (m, k) {
  if (k !== 'atacar' || !m || m.id !== 'bau' || !caminhoMagico(m)) return _dcE.apply(this, arguments);
  BT._tinta = m; const hp0 = alive(BT.foes).reduce((a, f) => a + f.hp, 0);
  try {
    const r = await _dcE.apply(this, arguments);
    if (r && alive(BT.foes).reduce((a, f) => a + f.hp, 0) < hp0) {
      const g = Math.min(6, m.mmp - m.mp);
      if (g > 0) { m.mp += g; const [x, y] = unitCenter(m); popNum(x, y - 18, '+' + g + ' PM', '#8fe3ff'); }
    }
    return r;
  } finally { BT._tinta = null; }
}; }
{ const _cdE = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cdE(a, t, pow, o);
  if (BT._tinta && a === BT._tinta && !o.mag && a.atk > 0) d *= Math.max(1, (a.mag * 0.85) / a.atk);
  return d;
}; }
