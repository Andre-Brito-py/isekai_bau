// ================= ESCONDIDAS NO BAÚ (v116) =================
// Pedido do usuário: "como o texto diz que gente é pega sempre, acho que seria legal se, nessa parte, a Lume e a Rita
// estivessem dentro do baú, para ele esconder as duas, e na hora da batalha, caso houver, elas saem e a luta acontece
// normalmente". Nos trechos de FURTIVIDADE (map.stealth: jardim da Cidade Alta à noite, os Telhados, a Faixa do Cap. 6, a
// Encosta do Cap. 9), com o baú na forma de baú, a Lume e a Rita entram na tampa e somem do mapa; saem quando o trecho
// acaba, quando a luz apaga (dia) ou quando ele vira gente (forma humana: aí ele é "gente" e é pego igual). Na luta, o
// grupo inteiro sai e luta normal (a luta não muda).
function escondidasNoBau() {
  const m = W2.map; if (!m || !m.stealth || V.scene !== 'world') return false;
  if (typeof rostoSt === 'function' && rostoSt().on) return false;
  if (m.holofotes && !m.holofotesSempre && typeof holofotesAtivos === 'function' && !holofotesAtivos(m) && !W2.ents.some(e => e.t === 'ronda' && !(e.gone && e.gone()))) return false;
  return true;
}
{ const _fsE = folSprite; folSprite = function (f) {
  const esc = escondidasNoBau();
  if (esc !== W2._esc) {
    const antes = W2._esc; W2._esc = esc;
    if (antes !== undefined) { sfx(esc ? 'door' : 'item'); W2.toast = { s: esc ? 'A Lume e a Rita entram na tampa.' : 'A Lume e a Rita saem da tampa.', t: 0 }; }
    else if (esc && !G.flags.tutEscondidas) { G.flags.tutEscondidas = true; W2.toast = { s: 'A Lume e a Rita se escondem no baú.', t: 0 }; }
  }
  if (esc) return null;
  return _fsE.apply(this, arguments);
}; }
// ao trocar de mapa, recomeça a contagem (sem som repetido na entrada)
{ const _lmE = loadMap2; loadMap2 = function () { const r = _lmE.apply(this, arguments); W2._esc = undefined; return r; }; }
// na luta vinda da luz, as duas saem da tampa
{ const _pnE = pegoNaLuz; pegoNaLuz = async function (m, como, e) { if (escondidasNoBau() && !G.flags.tutEscondidasLuta) { G.flags.tutEscondidasLuta = true; W2.toast = { s: 'A tampa abre: elas pulam para a luta!', t: 0 }; } return _pnE.apply(this, arguments); }; }

// v117: a Rita nova (rita2.js) desenhava o próprio quadro por fora do disfarce (disfarce6.js aplicava o figurino só no
// quadro antigo). Agora o figurino da Lavadeira/Pavio/Trupe também veste a Rita nova, no mapa.
{ const _fsD = folSprite; folSprite = function (f) {
  const fr = _fsD.apply(this, arguments);
  if (!fr || !f || f.k !== 'rita' || typeof disf !== 'function' || typeof RITA2 !== 'object') return fr;
  const d = disf(); return d ? figurino(fr, d, 'rita2') : fr;
}; }
