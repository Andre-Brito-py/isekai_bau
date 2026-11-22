// ================= CAP. 5 NO MAPA, NO DIÁRIO, NAS PLACAS E NA VIDA =================
Object.assign(REGIAO_DE, { cidadeAlta: 'auren', estufa: 'auren', lentes: 'auren', arquivo: 'auren', escritorio: 'auren', telhados: 'auren' });
Object.assign(VIDA_CFG, {
  cidadeAlta: { pombos: 3, gatos: 2, borboletas: 5, vagalumes: 8, cartas: true },
  telhados: { gatosEm: TE5.gatos, vagalumes: 4, passaros: true }
});
ROTULOS_EXTRA.cidadeAlta = () => [[...CA5.portao[0], 'Acendedoria Real'], [...CA5.estufaDoor[0], 'Estufa'], [...CA5.bondinho[1], 'Bondinho (desce)']];
ROTULOS_EXTRA.largo = () => [[...POS4.largo.lavDoor, 'Lavanderia'], [45, 15, 'Bondinho da Cidade Alta']];
{ const _mmI = montarMapas2; montarMapas2 = function () {
  _mmI.apply(this, arguments);
  const m = MAPS2.cidadeAlta; if (m && !m._tab5) { m._tab5 = true; m.props.push({ img: () => placaArt('casa'), x: 45.2, y: 23, by: 23 * TS + 1 }); }
  const s = MAPS2.estufa; if (s && !s._lig) { s._lig = true; }
  // lutas fixas: o vigia com a mariposa no arquivo (dupla nova) e o guarda com mariposa no meio dos telhados
  const ar = MAPS2.arquivo; if (ar && !ar._foe5) { ar._foe5 = true; ar.ents.push(inimigo('vgA', 'vigia', 20, 12, ['vigia', 'mvidro'], { spr: vigiaSpr, h: 60, bg: bgTorre })); }
  const th = MAPS2.telhados; if (th && !th._foe5) { th._foe5 = true; th.ents.push(inimigo('grT', 'guardaR', 37, 23, ['guardaR', 'mvidro'], { spr: guardaSpr, h: 56, bg: bgTelhado })); }
  // a pipa do Quinzinho, num canto sem saída do labirinto
  const c = MAPS2.cidadeAlta; if (c && !c._pipa) { c._pipa = true; c.ents.push({ t: 'sign', x: 19, y: 16, h: 14, gone: () => !!G.flags.c5PipaAchada, spr: () => pipaSpr(), talk: async () => { G.flags.c5PipaAchada = true; sfx('item'); await say('* Presa na sebe, num canto sem saída, uma pipa vermelha e amarela com rabiola de jornal. Escrito na vareta, torto: QUINZINHO.'); } }); }
  // o Quinzinho agradece a pipa
  const q = c && c.ents.find(e => e.id === 'quinzinho'); if (q && !q._pipa) { q._pipa = true; const t0 = q.talk; q.talk = async () => { if (G.flags.c5PipaAchada && !G.flags.c5Pipa) { G.flags.c5Pipa = true; await say('MINHA PIPA! Baú, você é o melhor baú do mundo! Toma, eu achei isso no chão da torre, brilha que nem você.', 'quinzinho'); await dar('tinta', 2); await dar('pluma', 1); save2(); return; } return t0(q); }; }
}; }
let PIPA_C = null; const pipaSpr = () => PIPA_C || (PIPA_C = (() => { const P = new Pix(16, 22); P.poly([[8, 0], [15, 7], [8, 14], [1, 7]], (x, y) => x < 8 ? '#e83a3a' : '#f0c040'); P.line(8, 0, 8, 14, '#5a3a20'); P.line(1, 7, 15, 7, '#5a3a20'); for (let i = 0; i < 4; i++) P.rect(7 + (i % 2) * 2, 15 + i * 2, 2, 1, '#e8e0d0'); return P.outline().canvas(); })());
// ---------- missões no mapa ----------
{ const _ms = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c5Init || f.c5Fim) {
    const L = _ms();
    if (f.c5Fim && L[0] && L[0].tipo === 'main') { L[0] = { tit: 'Procurados', desc: 'A Guarda Real procura o grupo em Auren. Descanse na base; o Capítulo 6 está a caminho.', map: 'interior', at: [13, 6], tipo: 'main' }; }
    return L;
  }
  const L = _ms().filter(m => m.tipo !== 'main'), pos = (fn) => { try { return fn(); } catch (e) { return null; } };
  let M;
  if (f.c5Holofote) M = { tit: 'A descida', desc: 'Desça pela escada da torre do sino até o Bairro Baixo.', map: 'telhados', at: TE5.descida[0] };
  else if (f.c5Telhados) M = { tit: 'Os telhados', desc: 'Fuja pelos telhados até a torre do sino. Nos vãos, ponha uma TÁBUA do Vão; depois guarde de novo.', map: 'telhados', at: TE5.fim, quando: null };
  else if (f.c5Cha) M = { tit: 'Fugir', desc: 'Saia do escritório. A Guarda Real está subindo.', map: 'escritorio', at: EC5.saida[0] };
  else if (f.c5Vitral) M = { tit: 'O caderno preto', desc: 'Suba ao escritório e abra o caderno de capa preta.', map: 'escritorio', at: EC5.caderno };
  else if (f.c5Velas) M = { tit: 'O vitral', desc: 'Suba a escada do arquivo. Algo guarda o patamar.', map: 'arquivo', at: AR5.vitralPos };
  else if (f.c5Porta1) M = { tit: 'As velas com nome', desc: 'No Arquivo das Velas, acenda na ordem: quem consertava as horas, quem as tocava, quem limpava a fumaça delas.', map: 'arquivo', at: AR5.nota };
  else if (f.c5Lentes) M = { tit: 'A luz no cristal', desc: 'Leve o feixe de luz até o cristal AZUL, sem passar pelo vermelho. Gire e mude espelhos de lugar; o caixote bloqueia.', map: 'lentes', at: LE5.alvo };
  else if (f.c5Alcapao) M = { tit: 'Descer à Acendedoria', desc: 'O alçapão da estufa está aberto. Desça DE NOITE (de dia é expediente).', map: 'estufa', at: ES5.alcapao, quando: 'noite' };
  else if (f.c5Chave) M = { tit: 'O alçapão', desc: 'Na estufa, ponha peso nas três placas (os vasos, guardados no Vão) para destravar o alçapão.', map: 'estufa', at: ES5.placas[1] };
  else if (f.c5Tesoura) M = { tit: 'A tesoura de prata', desc: 'Leve a tesoura ao Seu Benedito, o jardineiro (só de dia).', map: 'cidadeAlta', at: CA5.jardineiro, quando: 'dia' };
  else if (f.c5Alta) M = { tit: 'Outra entrada', desc: 'O jardineiro tem a chave da estufa; ele perdeu a tesoura no LABIRINTO de sebes.', map: 'cidadeAlta', at: CA5.tesoura };
  else if (f.c5Iolanda) M = { tit: 'O bondinho', desc: 'Suba à Cidade Alta pelo bondinho, no lado leste do Largo do Hospital. Só DE DIA.', map: 'largo', at: [45, 15], quando: 'dia' };
  else M = { tit: 'O papel-lírio', desc: 'Mostre a página arrancada à Dona Iolanda, na papelaria do Bairro Baixo.', map: 'papelaria', at: POS3.papelaria.iolanda };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (f.c5DamaPediu && !f.c5Dama) op({ tit: 'Sorvete de lavanda', desc: 'Compre do sorveteiro (de dia) perto das 19h e entregue à Dona Hortênsia logo que escurecer. Derrete em cerca de uma hora.', map: 'cidadeAlta', at: f.c5Sorvete ? CA5.dama : CA5.sorveteiro, quando: f.c5Sorvete ? 'noite' : 'dia' });
  if (f.c5PipaVista && !f.c5Pipa) op({ tit: 'A pipa do Quinzinho', desc: f.c5PipaAchada ? 'Devolva a pipa ao Quinzinho (de dia).' : 'A pipa caiu num canto sem saída do labirinto.', map: 'cidadeAlta', at: f.c5PipaAchada ? CA5.crianca : [19, 16], quando: f.c5PipaAchada ? 'dia' : null });
  if (f.c5Alta && !f.c5Mirante) op({ tit: 'O mirante', desc: 'Do mirante da Cidade Alta, de NOITE, dá para ver o morro do Farol.', map: 'cidadeAlta', at: CA5.mirante, quando: 'noite' });
  return L;
}; }
// ---------- diário ----------
DIARIO.splice(3, 0, { tipo: 'main', cap: 'Capítulo 5 · Cidade Alta', tit: 'O Caderno Preto', vis: () => fl('c5Init'), feita: () => fl('c5Fim'),
  desc: 'A página arrancada em Candeia tem a mesma letra da lista do hospital. Quem anota assim tem um caderno. E não larga ele nunca.',
  passos: [['Mostrar a página à Dona Iolanda', () => fl('c5Iolanda')], ['Subir à Cidade Alta de bondinho (de dia)', () => fl('c5Alta')], ['Achar a tesoura do jardineiro no labirinto', () => fl('c5Tesoura')],
    ['Conseguir a chave da estufa', () => fl('c5Chave')], ['Destravar o alçapão da estufa', () => fl('c5Alcapao')], ['Descer à Acendedoria (de noite)', () => fl('c5Lentes')],
    ['Levar a luz ao cristal azul', () => fl('c5Porta1')], ['Acender as velas na ordem certa', () => fl('c5Velas')], ['Passar pelo Vitral Vivo', () => fl('c5Vitral')],
    ['Abrir o caderno preto', () => fl('c5Caderno')], ['Fugir pelos telhados', () => fl('c5Holofote')], ['Voltar para a base', () => fl('c5Fim')]] });
DIARIO.push(
  { tipo: 'side', cap: 'Cidade Alta', quem: 'Dona Hortênsia', tit: 'Sorvete de lavanda', vis: () => fl('c5DamaPediu'), feita: () => fl('c5Dama'), quando: 'noite', recompensa: 'Monóculo do Conde',
    desc: 'O marido dela trazia, toda noite, um sorvete de lavanda do carrinho. O sorveteiro só fica de dia, e sorvete não espera a noite.',
    passos: [['Comprar o sorvete de lavanda perto das 19h', () => fl('c5Sorvete') || fl('c5Dama')], ['Entregar logo que escurecer, antes de derreter', () => fl('c5Dama')]] },
  { tipo: 'side', cap: 'Cidade Alta', quem: 'Quinzinho', tit: 'A pipa do Quinzinho', vis: () => fl('c5PipaVista'), feita: () => fl('c5Pipa'), recompensa: 'tinta azul e uma pluma',
    desc: 'A pipa vermelha e amarela caiu num canto sem saída do labirinto de sebes.',
    passos: [['Achar a pipa no labirinto', () => fl('c5PipaAchada')], ['Devolver ao Quinzinho (de dia)', () => fl('c5Pipa')]] },
  { tipo: 'side', cap: 'Cidade Alta', quem: 'a curiosidade', tit: 'O mirante', vis: () => fl('c5Alta'), feita: () => fl('c5Mirante'), quando: 'noite', recompensa: '40 cobres e uma visão',
    desc: 'Do mirante, a cidade de baixo vira um céu ao contrário. Dizem que de noite se vê o morro do Farol.',
    passos: [['Olhar do mirante À NOITE', () => fl('c5Mirante')]] }
);
