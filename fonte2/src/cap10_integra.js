// ================= CAP. 10 NO MAPA, NO DIÁRIO, E AS LEMBRANÇAS COM NOME (opcionais com viagem) =================
// Os potes com nome achados na Torre vão no Vão até quem espera: o ZÉ CANDEEIRO para a Dona Ilda (CANDEIA), o ANTÔNIO
// para a Dona Cida (LARGO, de dia), a DONA ROSA para o Seu Benedito (CIDADE ALTA, de dia). O do Jorge é do epílogo.
Object.assign(REGIAO_DE, { torre10: 'farol', lanterna10: 'farol' });
Object.assign(VIDA_CFG, { torre10: { vagalumes: 10 }, lanterna10: { vagalumes: 6 } });
ROTULOS_EXTRA.torre10 = () => [[TO10.saida[0][0], TO10.saida[0][1] + 1, 'A Sala da Lanterna'], [TO10.contrapeso[0], TO10.contrapeso[1] + 3, 'Sala das Máquinas']];
Object.assign(LIGA_EXTRA_FIXA, { torre10: [[...TO10.volta[0], 'farol9'], [...TO10.saida[0], 'lanterna10']], lanterna10: [[...LA10.volta[0], 'torre10']] });
const potes10 = () => (G.potes10 = G.potes10 || {});
const entregue10 = (k) => !!G.flags['c10E_' + k];
{ const _mm10i = montarMapas2; montarMapas2 = function () {
  _mm10i.apply(this, arguments);
  const L = MAPS2.largo; if (L && !L._cida10) { L._cida10 = true; const p = chaoLivre8(L, 29, 17) || [29, 17]; L.ents.push(morador('cida', p[0], p[1], { id: 'cida10', dir: 'down', gone: () => !G.flags.c10Init || ehNoite() || !potes10().antonio || entregue10('antonio'), talk: entregaAntonio10 })); }
}; }
async function entregaAntonio10() {
  G.flags.c10E_antonio = true; playMusic('cha');
  await say('* Você tira do Vão o pote "ANTÔNIO — INVERNO ESCURO". O raminho de alecrim ainda amarrado no gargalo. A Dona Cida reconhece antes de ler.');
  await say('O alecrim. Ele punha alecrim em tudo. Até no café. Eu odiava.', 'cida');
  await say('* Ela abre o pote. Uma luzinha sobe, dá uma volta em torno dela, e por um segundo o Largo cheira a alecrim e a café ruim.');
  await say('...Ele riu. Eu ouvi ele rir. Doze anos. Obrigada, mala. Agora pode ir, Antônio. Pode ir.', 'cida');
  await dar('cobres', 150); save2(); playMusic(W2.map.music);
}
{ const _fI10 = falaIlda; falaIlda = async function () {
  if (potes10().ze && !entregue10('ze')) {
    G.flags.c10E_ze = true; playMusic('cha');
    await say('* Você tira do Vão o pote "ZÉ CANDEEIRO". A Dona Ilda larga o remendo.');
    await say('* Ela não abre o pote. Leva até a casa da esquina, de janela verde, onde a vela ainda queima toda noite. Entrega para a viúva do Zé.');
    await say('* A viúva abre. A luzinha sai, passa pela janela, apaga a vela com um sopro. E acende de novo, sozinha, mais alta.');
    await say('Ele achou o caminho. Ela pode parar de deixar a vela agora. Ou não. Eu acho que ela não vai parar.', 'ilda');
    await dar('frasco', 2); save2(); playMusic(W2.map.music); return;
  }
  return _fI10();
}; }
{ const _fB10 = falaBenedito; falaBenedito = async function () {
  if (potes10().rosa && !entregue10('rosa') && !ehNoite()) {
    G.flags.c10E_rosa = true; playMusic('cha');
    await say('* O Seu Benedito, de joelhos no canteiro, com a tesoura de poda. Você põe o pote "DONA ROSA" do lado das mudas.');
    await say('A Rosa. Ela que plantou esse jardim inteiro. Eu só rego. Faz vinte anos que eu só rego.', 'benedito');
    await say('* Ele abre o pote em cima da terra. A luzinha afunda no canteiro. E no canteiro inteiro, as rosas abrem ao mesmo tempo.');
    await say('Ela sempre teve pressa. Até as flores ela apressava.', 'benedito');
    await dar('pluma', 1); save2(); playMusic(W2.map.music); return;
  }
  return _fB10();
}; }
{ const _ms10 = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c10Init) return _ms10();
  const L = _ms10().filter(m => m.tipo !== 'main');
  let M;
  if (f.c10Fim) M = { tit: 'Fim da Temporada 2', desc: 'O Farol apagou. Entregue as lembranças que sobraram e visite quem vocês ajudaram. A Temporada 3 herda as suas escolhas.', map: 'interior', at: [6, 6] };
  else if (f.c10Vesper) M = { tit: 'O Coração do Farol', desc: 'A lâmpada ainda bate. Na sala da lanterna.', map: 'lanterna10', at: LA10.trig[8] };
  else if (f.c10Contrapeso) M = { tit: 'A Sala da Lanterna', desc: 'Suba. O Acendedor-Mor está na sala da lanterna.', map: 'torre10', at: TO10.saida[0] };
  else if (f.c10G_g2) M = { tit: 'A Sala das Máquinas', desc: 'O último andar. O Contrapeso.', map: 'torre10', at: TO10.contrapeso };
  else if (f.c10Torre) M = { tit: 'A Torre', desc: 'Leve os potes pelo Vão até as balanças de latão. Todas as balanças do andar descidas abrem a grade.', map: 'torre10', at: TO10.entra };
  else M = { tit: 'O Farol', desc: 'A porta da torre, no pátio. O Tiago segura a trilha.', map: 'farol9', at: FA9.porta[0] };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  const p = potes10();
  if (p.ze && !entregue10('ze')) op({ tit: 'Zé Candeeiro', desc: 'O pote do Zé, para a Dona Ilda, em Candeia.', map: 'candeia', at: POS4B.candeia.ildaDoor[0] });
  if (p.antonio && !entregue10('antonio')) op({ tit: 'Antônio, do Inverno', desc: 'O pote com alecrim, para a Dona Cida, no Largo (de dia).', map: 'largo', at: [29, 17], quando: 'dia' });
  if (p.rosa && !entregue10('rosa')) op({ tit: 'Dona Rosa', desc: 'O pote com terra de jardim, para o Seu Benedito, na Cidade Alta (de dia).', map: 'cidadeAlta', at: CA5.jardineiro, quando: 'dia' });
  return L;
}; }
DIARIO.splice(8, 0, { tipo: 'main', cap: 'Capítulo 10 · O Farol', tit: 'O Farol de Cem Invernos', vis: () => fl('c10Init'), feita: () => fl('c10Fim'),
  desc: 'Onde o facho passa, a cidade esquece. Ao amanhecer, o Farol terá lido tudo.',
  passos: [['A Torre', () => fl('c10G_g2')], ['O Contrapeso', () => fl('c10Contrapeso')], ['O Acendedor-Mor', () => fl('c10Vesper')], ['O Coração do Farol', () => fl('c10Coracao')], ['A escolha', () => !!G.flags.c10Escolha], ['O café', () => fl('c10Cafe')]] });
DIARIO.push({ tipo: 'side', cap: 'O Farol de Cem Invernos', quem: 'quem esperava', tit: 'Lembranças com nome', vis: () => fl('c10Torre'), feita: () => ['ze', 'antonio', 'rosa'].every(entregue10), recompensa: 'frascos, cobres, pena', desc: 'Potes com nome, achados na Torre do Farol.', passos: [['O Zé, para a Dona Ilda (Candeia)', () => entregue10('ze')], ['O Antônio, para a Dona Cida (Largo)', () => entregue10('antonio')], ['A Dona Rosa, para o Seu Benedito (Cidade Alta)', () => entregue10('rosa')]] });
