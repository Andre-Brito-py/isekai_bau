// ================= DISFARCE EM GRUPO (mecânica nova do Cap. 6) =================
// Depois dos cartazes de PROCURADOS, a Guarda Real ronda Auren (Bairro Baixo, Largo, Festival) e a Vila dos Pavios.
// Sem disfarce, QUALQUER guarda que veja o grupo dá o alarme (o baú parado não salva: a Rita e a Lume estão no cartaz).
// Três figurinos, cada um com sua HORA e seu LUGAR:
//  - LAVADEIRAS DO HOSPITAL (de DIA): lençóis, lenço na cabeça, o baú vira cesto de roupa. "Roupa pra lavar."
//  - PAVIOS DO TURNO (de NOITE): casaco cinza, vela no chapéu, o baú vira caixa de lanternas. Pavio não fala.
//  - TRUPE DO SEU LÚCIO (a qualquer hora, mas só onde há palco e plateia: Festival e Largo).
// Figurino fora da hora ou do lugar é PIOR que nenhum ("Lavadeira às onze da noite?"). Barreiras (cancelas com guarda)
// perguntam coisas que só quem é daquele ofício sabe: as respostas se aprendem ouvindo (balões, conversas, placas).
// Lutar disfarçado dá SURPRESA: o grupo começa com +20 de Tensão.
// Os Marcos de Auren estão VIGIADOS por um Pavio: só se usa um Marco vestido de Pavio (é o turno deles).
const c6Ativo = () => !!(G.flags && G.flags.c6Init && !G.flags.c6Fim);
const disf = () => G.disfarce && (G.disfarces || {})[G.disfarce] ? G.disfarce : null;
const DISF_REGRA = {
  lavadeira: { hora: () => !ehNoite(), lugar: ['auren', 'largo', 'ruaPavios', 'festival'], foraHora: 'Lavadeira às ' + '{h}? Lavanderia fecha às sete.', foraLugar: 'Roupa pra lavar AQUI?' },
  pavio: { hora: () => ehNoite() || ['selo1', 'selo2'].includes(W2.id), lugar: ['auren', 'largo', 'festival', 'ruaPavios', 'selo1', 'selo2'], foraHora: 'Pavio de dia? O turno de vocês é de noite.', foraLugar: 'Pavio aqui? Ronda é na rua, colega.' },
  trupe: { hora: () => true, lugar: ['festival', 'largo'], foraHora: '', foraLugar: 'Artista fora do palco? Circulando, circulando.' }
};
function disfarceServe(id) {
  const d = disf(); if (!d) return { ok: false, porque: 'nenhum' };
  const R = DISF_REGRA[d]; if (!R.lugar.includes(id || W2.id)) return { ok: false, porque: 'lugar', fala: R.foraLugar };
  if (!R.hora()) return { ok: false, porque: 'hora', fala: R.foraHora.replace('{h}', fmtHora ? fmtHora() : 'essa hora') };
  return { ok: true };
}
const fmtHora = () => { const h = Math.floor(hora() / 60) % 24; return h + 'h'; };
// o gancho do passo dos holofotes/rondas (puzzle5): no Cap. 6, quem decide é o disfarce
function pegaHook6(m, padrao) {
  if (!m.procurado || !c6Ativo()) return padrao;
  const s = disfarceServe(W2.id);
  if (!s.ok) return true;
  if (m.faixa) { const T = tileOf(m, W2.mv ? W2.mv.tx : W2.x, W2.mv ? W2.mv.ty : W2.y); if (T.t !== 'faixa' && T.t !== 'esteira') return true; }
  return false;
}
// o que o guarda diz quando OLHA e o disfarce segura
function falaOlhou6(e) {
  const d = disf();
  if (W2.map && W2.map.faixa) return pickOne(['Na faixa, Pavio. Na faixa.', 'Turno da noite... tudo certo.', 'Lote 47 pra prensa, anda.']);
  return d === 'lavadeira' ? pickOne(['Roupa pra lavar? Passa.', 'Que cheiro de sabão...', 'Bom dia, moças. E... cesto.']) : d === 'pavio' ? pickOne(['Boa noite, Pavio.', 'Mais uma ronda de lanterna...', '(o guarda nem olha direito)']) : d === 'trupe' ? pickOne(['Ô, a trupe! Hoje tem show?', 'Bonito o chapéu.', 'O baú também faz número?']) : '...';
}
function pegoTxt6(como, e) {
  const s = disfarceServe(W2.id);
  if (s.porque === 'nenhum') return pickOne(['* "EI! Vocês dois... três... do CARTAZ!" Um apito corta a rua.', '* O guarda olha o cartaz. Olha vocês. Olha o cartaz de novo. Apito.', '* "A moça das velas! A escudeira! E a MALA!"']);
  if (W2.map && W2.map.faixa && s.ok) return pickOne(['* "PAVIO FORA DA FAIXA!" Um carimbo de latão vira a cabeça na sua direção.', '* Pavio não sai da faixa. Pavio nem pensa em sair da faixa. Você saiu.']);
  return '* "' + (s.fala || 'Ei! Vocês aí!') + '" O guarda chega mais perto. Perto demais. Apito.';
}
async function tutPego6() { if (!G.flags.tut6pego) { G.flags.tut6pego = true; await say('[Procurados: SEM disfarce, todo guarda que vê o grupo dá o alarme, parado ou não. Com o figurino CERTO para a hora e o lugar, ninguém olha duas vezes. MENU > Disfarce.]', 'cat'); } }

// ---------- menu: Disfarce ----------
const MENU_EXTRA = [];
MENU_EXTRA.push({ k: 'disfarce', nm: () => 'Disfarce', col: '#ffd060', vis: () => Object.keys(G.disfarces || {}).length > 0,
  right: () => disf() ? ({ pavio: 'Pavio', lavadeira: 'Lavad.', trupe: 'Trupe' })[disf()] : '—',
  desc: () => 'Vestir o grupo todo com um figurino. Cada um serve numa HORA e num LUGAR.',
  run: async () => {
    const ks = ['lavadeira', 'pavio', 'trupe'].filter(k => (G.disfarces || {})[k]);
    const dica = { lavadeira: 'DE DIA. Bairro Baixo, Largo, Festival, Vila. O baú vira cesto.', pavio: 'DE NOITE. Toda Auren, a Vila e a Casa do Selo. Pavio não fala.', trupe: 'A QUALQUER HORA, só Festival e Largo (onde tem plateia).' };
    const items = [...ks.map(k => ({ label: FIG6[k].nm, right: disf() === k ? 'vestido' : '' })), { label: 'Tirar o disfarce', right: disf() ? '' : '—' }];
    const j = await list({ x: 30, y: 40, w: 180, title: 'Disfarce do grupo', items, desc: i => i < ks.length ? dica[ks[i]] : 'Roupa de sempre. Com cartaz na rua, é pedir para ser visto.' });
    if (j < 0) return;
    await fadeOut(8); G.disfarce = j < ks.length ? ks[j] : null; sfx('equip'); await fadeIn(8);
    if (G.disfarce) { const s = disfarceServe(W2.id); W2.toast = { s: FIG6[G.disfarce].nm + (s.ok ? ': serve aqui, agora.' : s.porque === 'hora' ? ': NÃO serve nesta hora!' : ': NÃO serve neste lugar!'), t: 0 }; }
    if (!G.flags.c6DisfFala && G.disfarce) { G.flags.c6DisfFala = true; await say(pickOne(['Eu tô ridícula.', 'Ninguém olha duas vezes pra quem trabalha. É a coisa mais triste e mais útil que eu sei.']), 'rita'); await say('E eu? Eu sou o quê?', 'me'); await say(G.disfarce === 'lavadeira' ? 'Cesto. Você é um cesto. Fica quietinho e cheira a sabão.' : G.disfarce === 'pavio' ? 'Caixa de lanternas. Brilha um pouquinho. Pouquinho!' : 'Baú de figurino. Isso você já era.', 'lume'); }
    return 'sair';
  } });

// ---------- figurino no desenho (seguidores e o baú) ----------
{ const _fs6 = folSprite; folSprite = function (f) { const fr = _fs6(f); const d = disf(); return d ? figurino(fr, d, f.k) : fr; }; }
{ const _dp6 = drawPlayer; drawPlayer = function (ox, oy) { _dp6(ox, oy); const d = disf(); if (d && !W2.float && !(typeof rostoSt === 'function' && rostoSt().on)) { const hop = W2.mv ? -Math.abs(Math.sin(W2.mv.k / 8 * Math.PI)) * 3 : 0; enfeiteBau(d, W2.px - ox, W2.py - oy + hop + 4, W2.t); } }; }

// ---------- surpresa: lutar disfarçado ----------
{ const _lm6 = lutaMapa; lutaMapa = function (g, o = {}) { if (c6Ativo() && disf() && disfarceServe(W2.id).ok && !o.semSurpresa) { o = Object.assign({}, o, { tension: (o.tension || 0) + 20 }); if (!G.flags.tutSurpresa6) { G.flags.tutSurpresa6 = true; W2.toast = { s: 'Ataque disfarçado: +20 de Tensão!', t: 0 }; } } return _lm6.call(this, g, o); }; }

// ---------- barreiras: cancela com guarda e pergunta de ofício ----------
// BARREIRAS[id] = { map, cancela:[[x,y]...], guarda:[x,y], lado:'cima'|'baixo' (de onde se chega), perg: {disfarce: {q, ops, certa, flagPista}} }
const BARREIRAS = {};
function barreiraAberta(b) { return !!(W2.barOpen && W2.barOpen[b.id]); }
function cancelaSolida(b) { // fechada só para quem chega pelo lado de fora
  if (!c6Ativo() || barreiraAberta(b)) return [];
  const [x0, y0] = b.cancela[0];
  const fora = b.lado === 'cima' ? W2.y < y0 : W2.y > y0;
  return fora ? [[x0, y0, b.cancela.length, 1]] : [];
}
async function passarBarreira(b) {
  if (!c6Ativo() || barreiraAberta(b)) return;
  W2.mv = null;
  const d = disf(), g = b.guardaEnt; let s = disfarceServe(b.map);
  if (s.ok && b.so && !b.so.includes(d)) s = { ok: false, porque: 'lugar', fala: b.foraSo || 'Isso aqui é só pro turno. Circulando.' };
  if (g) g.dir = b.lado === 'cima' ? 'up' : 'down';
  if (!s.ok) {
    await say(s.porque === 'nenhum' ? pickOne(['Documento. ...Espera. Eu conheço essa cara. ESSA CARA ESTÁ NO CARTAZ!', 'Alto lá! Mil frascos de recompensa estão olhando pra mim agora!']) : (s.fala || 'Alto lá!'), 'guardaRH');
    await tutPego6();
    const r = await lutaMapa(b.grupo || ['guardaR', 'guardaR'], { bg: b.bg || bgVila, semSurpresa: true });
    if (r === 'win') { await fadeOut(10); loadMap2(W2.id, ...b.volta, b.lado === 'cima' ? 'up' : 'down'); await fadeIn(10); await say(pickOne(['O guarda vai acordar com dor de cabeça e uma história que ninguém vai acreditar.', 'Disfarce. Eu preciso de um disfarce que SIRVA.']), 'me'); }
    return;
  }
  const P = b.perg && b.perg[d];
  const jaPassou = G.flags['bar_' + b.id + '_' + d];
  if (P && !jaPassou) {
    await say(P.q, 'guardaRH');
    const ops = P.ops.slice(), j = await choose('* O que responder?', ops, 'me');
    if (j !== P.certa) {
      await say(pickOne(['...Errado. Errado DEMAIS. Quem é você de verdade?', 'Hm. Não é isso que o pessoal de verdade diz.']), 'guardaRH');
      const r = await lutaMapa(b.grupo || ['guardaR', 'guardaR'], { bg: b.bg || bgVila, semSurpresa: true });
      if (r === 'win') { await fadeOut(10); loadMap2(W2.id, ...b.volta, b.lado === 'cima' ? 'up' : 'down'); await fadeIn(10); await say(P.dica || 'Eu devia ter prestado atenção no que o povo daqui fala.', 'rita'); }
      return;
    }
    G.flags['bar_' + b.id + '_' + d] = true;
    await say(P.ok || 'Tá. Passa.', 'guardaRH');
  } else await say(pickOne(['Passa.', 'Vocês de novo. Passa, passa.', '(o guarda levanta a cancela sem tirar os olhos do jornal)']), 'guardaRH');
  sfx('door'); (W2.barOpen = W2.barOpen || {})[b.id] = true;
}
function montaBarreira(b) {
  BARREIRAS[b.id] = b;
  const m = MAPS2[b.map]; if (!m || m['_bar_' + b.id]) return; m['_bar_' + b.id] = true;
  const [x0, y0] = b.cancela[0];
  m.props.push({ img: () => cancelaArt(!c6Ativo() || barreiraAberta(b)), x: x0 - 0.6, y: y0 + 1, by: (y0 + 0.5) * TS, get solid() { return cancelaSolida(b); } });
  const gd = morador('guardaRH', ...b.guarda, { dir: b.lado === 'cima' ? 'up' : 'down', gone: () => !c6Ativo(), talk: async () => { await say(c6Ativo() ? pickOne(['Cancela da Coroa. Cada um com seu ofício, cada ofício com sua hora.', 'Tem cartaz novo de procurado. Uma mala com dente. Pode isso?']) : 'Bom dia.', 'guardaRH'); } });
  b.guardaEnt = gd; m.ents.push(gd);
  const dy = b.lado === 'cima' ? -1 : 1;
  for (const [x, y] of b.cancela) m.ents.push({ t: 'trig', x, y: y + dy, w: 1, h: 1, passa: true, run: () => passarBarreira(b) });
}
{ const _lmB = loadMap2; loadMap2 = function () { W2.barOpen = {}; const r = _lmB.apply(this, arguments); for (const b of Object.values(BARREIRAS)) if (b.map === W2.id) b.guardaEnt = W2.ents.find(e => e.id === 'guardaRH' && e.x === b.guarda[0] && e.y === b.guarda[1]) || b.guardaEnt; return r; }; }

// ---------- Marcos vigiados ----------
const MARCO_VIGIADO = ['auren', 'largo', 'festival', 'ruaPavios'];
{ const _mmV = montarMapas2; montarMapas2 = function () {
  _mmV.apply(this, arguments);
  for (const id of MARCO_VIGIADO) {
    const m = MAPS2[id]; if (!m || m._vig6) continue; m._vig6 = true;
    const mk_ = m.ents.find(e => e.t === 'marco'); if (!mk_) continue;
    const t0 = mk_.talk;
    mk_.talk = async (e) => {
      if (c6Ativo() && disf() !== 'pavio') {
        const pv = W2.ents.find(q => q.id === 'pavioMarco');
        if (pv) pv.emote = { s: '!', t: 50 };
        await say('* O Pavio do lado do Marco levanta a lanterna devagar, sem pressa, sem raiva. E sopra um apito.');
        await say('Marco vigiado. Só pessoal do turno.', 'pavioG');
        if (!G.flags.tutMarco6) { G.flags.tutMarco6 = true; await say('[Marcos vigiados: só dá para tocar num Marco de Auren vestido de PAVIO (é o turno deles). Fora de Auren, os Marcos estão livres.]', 'cat'); }
        await lutaMapa(['guardaR', 'guardaR'], { bg: m.batBg || bgVila, semSurpresa: true });
        return;
      }
      if (c6Ativo() && !G.flags.c6MarcoPavio) { G.flags.c6MarcoPavio = true; await say('Boa noite, colega. Marco tá quente. Pode encostar.', 'pavioG'); }
      return t0(e);
    };
    // o Pavio de guarda ao lado do Marco
    const cand = [[1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]].map(([dx, dy]) => [mk_.x + dx, mk_.y + dy]).find(([x, y]) => x >= 0 && y >= 0 && y < m.rows.length && x < m.rows[0].length && !((m.key && m.key[m.rows[y][x]]) || KEY2[m.rows[y][x]] || {}).solid);
    if (cand) m.ents.push(morador('pavio', cand[0], cand[1], { id: 'pavioMarco', dir: 'down', gone: () => !c6Ativo(), talk: async () => { await say(disf() === 'pavio' ? pickOne(['Boa noite, colega.', 'Turno longo. A gente nem sente.', 'Eu esqueci se já jantei. Deve ter jantado.']) : pickOne(['Marco vigiado. Só pessoal do turno.', 'Desculpa. É o meu trabalho. Eu acho.']), 'pavioG'); } }));
  }
}; }
