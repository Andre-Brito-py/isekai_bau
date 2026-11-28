// ================= O ROMANCE DA TEMPORADA 2: CONVERSAS COM A LUME =================
// Pedido do usuário (Cap. 10): "deixar a Lume como interesse principal" e "criar mais momentos ao longo do jogo, para
// tornar o romance um elemento mais forte nessa temporada". Oito conversas ao pé da VELA DA BASE, cada uma liberada por um
// marco da história (quem já passou do capítulo encontra a conversa esperando). As escolhas somam G.flags.lumeHeart2,
// que se soma ao coração herdado do jogo 1 (lume.coracao) e decide o tom do CAFÉ no fim do Cap. 10. Algumas só de noite
// (ela de lustre) e uma no Sopé do Morro, na fogueira da noite do cerco.
const CONVERSAS2 = [
  { id: 'lustre', nm: 'De noite eu sou isto', req: f => f.c2Fim, noite: true },
  { id: 'lagrima', nm: 'A lágrima no tinteiro', req: f => f.c3Fim },
  { id: 'lembrar', nm: 'Me lembra de mim', req: f => f.c4Fim, noite: true },
  { id: 'quase', nm: 'O quase-sim', req: f => f.c5Fim },
  { id: 'danca', nm: 'Aula de dança', req: f => f.c6Fim },
  { id: 'luto', nm: 'Duas bombadas', req: f => f.c7Fim, noite: true },
  { id: 'acende', nm: 'Quem acende você', req: f => f.c8Fim },
  { id: 'fogueira', nm: 'A fogueira do cerco', req: f => f.c9P2 && !f.c9Fim, lugar: 'sope9' }
];
const conversaFeita2 = (id) => !!(G.flags.conv2 || {})[id];
const nConversas2 = () => CONVERSAS2.filter(c => conversaFeita2(c.id)).length;
function conversaDisponivel2(lugar) { const f = G.flags || {}; return CONVERSAS2.find(c => !conversaFeita2(c.id) && c.req(f) && (c.lugar || 'interior') === (lugar || 'interior')); }
function coracaoTotal2() { const H = G.her || (typeof lerHeranca === 'function' && lerHeranca()) || {}; return ((H.lume && H.lume.coracao) || 0) + (G.flags.lumeHeart2 || 0); }
function maisCoracao2(n) { G.flags.lumeHeart2 = (G.flags.lumeHeart2 || 0) + n; if (n > 0) { sfx('heal'); W2.toast = { s: '♥', t: 0 }; } }
function coracaoArt2(f) { return o10('cor2' + (f % 2), () => { const P = new Pix(12, 12), c = f % 2 ? '#ff8aa8' : '#ff6a8a'; P.ball(4, 4, 3, 3, ['#a8304a', '#e8506a', c, '#ffb8c8', '#fff']); P.ball(8, 4, 3, 3, ['#a8304a', '#e8506a', c, '#ffb8c8', '#fff']); P.poly([[1, 5], [11, 5], [6, 11]], c); P.p(3, 3, '#ffffff'); return P.outline().canvas(); }); }
{ const _mmR2 = montarMapas2; montarMapas2 = function () {
  _mmR2.apply(this, arguments);
  const B = MAPS2.interior; if (B && !B._conv2) { B._conv2 = true; const p = chaoLivre8(B, POS3.interior.vela[0], POS3.interior.vela[1] + 1) || [POS3.interior.vela[0], POS3.interior.vela[1] + 1];
    B.ents.push({ t: 'sign', id: 'conversa2', x: p[0], y: p[1], h: 30, passa: true, spr: () => coracaoArt2(Math.floor(W2.t / 20)), gone: () => !conversaDisponivel2('interior'), talk: () => conversa2('interior') }); }
  const S = MAPS2.sope9; if (S && !S._conv2) { S._conv2 = true; const [fx, fy] = SO9.fogueira; S.ents.push({ t: 'sign', id: 'conversa2s', x: fx + 1, y: fy, h: 20, passa: true, spr: () => coracaoArt2(Math.floor(W2.t / 20)), gone: () => !conversaDisponivel2('sope9'), talk: () => conversa2('sope9') }); }
}; }
async function conversa2(lugar) {
  const c = conversaDisponivel2(lugar); if (!c) return;
  if (c.noite && !ehNoite()) { await say('* A vela da base, acesa. A Lume está lá fora, varrendo a garagem do Seu Jorge. (Essa conversa é de NOITE, quando ela é lustre.)'); return; }
  W2.mv = null; playMusic('cha');
  await say('* {p}Conversa com a Lume: ' + c.nm + '{/}');
  await CONV2[c.id]();
  G.flags.conv2 = G.flags.conv2 || {}; G.flags.conv2[c.id] = true; save2();
  playMusic(W2.map.music);
}
const CONV2 = {
  async lustre() {
    await say('* A Lume pendurada no gancho do teto da base, de lustre. As três velas baixas. Ela finge que está dormindo. Não está.');
    await say('Para de olhar. Eu sei que é estranho. De dia eu sou gente, de noite eu sou... isto. Uma luminária com opinião.', 'lume');
    await say('Você ainda olha pra mim do mesmo jeito? Quando eu sou isto?', 'lume');
    const c = await choose('* O que responder?', ['Eu sou um baú. Quem sou eu pra falar.', 'Do mesmo jeito. Talvez melhor: agora dá pra ler à noite.', 'Você brilha. Literalmente. É injusto com o resto de nós.'], 'me', 0);
    if (c === 0) { await say('* As velas dela tremem. É uma risada.'); await say('Um baú e um lustre. A gente é um anúncio de loja de móveis.', 'lume'); maisCoracao2(1); }
    else if (c === 1) { await say('Você é ridículo. ...Fica mais um pouco. Lê alguma coisa. Eu ilumino.', 'lume'); maisCoracao2(2); }
    else { await say('* As três velas acendem de uma vez, altas. Ela vira de costas, rápido demais para um lustre.'); await say('Não fala essas coisas de noite. De noite eu não consigo esconder a cara.', 'lume'); maisCoracao2(2); }
  },
  async lagrima() {
    await say('* A Lume sentada na beira da cama da base, olhando o Grimório na estante. A página que acordou com a lágrima dela.');
    await say('Foi a minha lágrima que acordou ele. A Dona Iolanda disse "lágrima de quem escreve". Eu nunca escrevi nada. Só aquela música, pela metade.', 'lume');
    await say('Por que eu nunca termino? Eu chego no "e aí teve a curva" e a garganta fecha.', 'lume');
    const c = await choose('* O que dizer?', ['Talvez a música esteja esperando o resto da história.', 'Eu também não terminei. Eu era um passageiro dormindo. Agora sou um baú acordado.', 'Canta até a curva. Eu canto o resto, desafinado.'], 'me', 0);
    if (c === 0) { await say('O resto da história... Então ela termina quando a gente terminar. Tá. Eu espero. Mas não demora.', 'lume'); maisCoracao2(2); }
    else if (c === 1) { await say('Um baú acordado. Isso dava um verso. Não, espera, não rima com nada.', 'lume'); maisCoracao2(1); }
    else { await say('* Ela canta até a curva. Você canta o resto. É horrível. Ela ri tanto que chora, e a lágrima cai na tampa.'); await say('Pronto. Agora você também tem uma lágrima minha. Não perde.', 'lume'); maisCoracao2(2); }
  },
  async lembrar() {
    await say('* Noite depois de Candeia. A vila que esqueceu. A Lume de lustre, com as velas tão baixas que quase apagam.');
    await say('Eu vi aquela gente parada nas portas. Esquecendo quem esperava. E se acontecer comigo? Eu sou feita de chama de lembrança, @. Se eu esquecer, eu apago.', 'lume');
    await say('Me promete uma coisa. Toda noite, me lembra de uma coisa minha. Qualquer uma. Pra eu não esquecer de mim.', 'lume');
    const c = await choose('* Uma coisa dela, para começar:', ['Você queima o pão de queijo sempre no mesmo lado.', 'Você canta baixinho quando acha que ninguém escuta.', 'Você foi a primeira que me chamou pelo nome, lá embaixo.'], 'me', 2);
    if (c === 0) { await say('Isso é uma calúnia. ...É o lado esquerdo. Sempre o esquerdo. Como você sabe?', 'lume'); maisCoracao2(1); }
    else if (c === 1) { await say('* As velas dela acendem um pouco.'); await say('Você escuta? Esse tempo todo? ...Continua escutando.', 'lume'); maisCoracao2(2); }
    else { await say('* As três velas acendem altas, firmes.'); await say('Fui. Eu fui a primeira. Isso eu não esqueço nem se o Farol me ler inteira.', 'lume'); maisCoracao2(3); }
  },
  async quase() {
    await say('* Dias depois do chá na Acendedoria. A Lume chega na base com dois pastéis e não come nenhum.');
    await say('Eu quase disse sim pra ele. "Nunca mais escuro." Eu QUASE disse. Você viu.', 'lume');
    await say('Se eu tivesse dito... você ia me buscar? Mesmo eu indo por vontade própria?', 'lume');
    const c = await choose('* A verdade:', ['Ia. Eu sou um baú. Eu carrego o que é importante.', 'Ia. E ia reclamar o caminho inteiro.', 'Você não disse. É isso que importa.'], 'me', 0);
    if (c === 0) { await say('* Ela empurra um pastel para você. Depois o outro.'); await say('Os dois. Pastel é como eu digo obrigada. Não comenta.', 'lume'); maisCoracao2(3); }
    else if (c === 1) { await say('Claro que ia reclamar. É o seu jeito de dizer que se importa. Eu aprendi a traduzir.', 'lume'); maisCoracao2(2); }
    else { await say('Não disse. Mas eu queria saber que alguém vinha. ...Tá bom. Eu sei.', 'lume'); maisCoracao2(1); }
  },
  async danca() {
    await say('* Depois do palco do Festival. A Lume entra na base ainda de figurino da trupe, girando.');
    await say('Você tropeçou no ritmo TRÊS vezes na frente de Auren inteira. Isso tem que acabar. Vira gente. Aula de dança.', 'lume');
    await say('* Você veste o rosto. Ela pega as suas mãos. Um, dois, três. Você pisa no pé dela. Ela não reclama.');
    const c = await choose('* Na terceira volta:', ['Puxar ela um pouco mais perto', 'Pisar no pé dela de novo, de propósito', 'Parar e só olhar'], 'me', 0);
    if (c === 0) { await say('* Ela não erra o passo. Você erra. Ela segura.'); await say('Viu? Você só precisava de alguém conduzindo. Eu conduzo. Por enquanto.', 'lume'); maisCoracao2(3); }
    else if (c === 1) { await say('Isso foi de propósito! ...Faz de novo que eu piso de volta.', 'lume'); maisCoracao2(2); }
    else { await say('* A música da base (o Seu Lúcio deixou uma caixinha) continua tocando. Ninguém se mexe.'); await say('Tá olhando o quê? ...Não responde. Dança.', 'lume'); maisCoracao2(2); }
  },
  async luto() {
    await say('* A noite em que o Seu Jorge não voltou. A Lume de lustre, no gancho da garagem vazia, olhando o lugar onde o 31 ficava.');
    await say('Ele trocou tudo. Tudo que ele lembrava. Pela gente. Pela MINHA vida também.', 'lume');
    await say('Me promete que você nunca vai fazer isso. Trocar as suas lembranças por mim. Promete.', 'lume');
    const c = await choose('* O que prometer?', ['Prometo.', 'Não posso prometer isso.', 'Eu já troquei muita coisa. Mas você eu não troco.'], 'me', 2);
    if (c === 0) { await say('* Ela desce do gancho e encosta a chama na sua tampa. Morna.'); await say('Obrigada. Agora deixa eu chorar um pouco. Não olha.', 'lume'); maisCoracao2(2); }
    else if (c === 1) { await say('* Ela fica quieta muito tempo.'); await say('Eu sei. Era por isso que eu tinha medo de perguntar. Você é igual a ele. Por isso eu...', 'lume'); await say('* Ela não termina a frase.'); maisCoracao2(2); }
    else { await say('* A chama dela fica pequena, quieta, e depois cresce devagar, do tamanho de uma mão aberta.'); await say('Então guarda. Me guarda. Você é bom nisso.', 'lume'); maisCoracao2(3); }
  },
  async acende() {
    await say('* Depois do Inverno Escuro. A Lume evoluída, rodando pela base para mostrar a forma nova. Ela para na sua frente.');
    await say('Aquela noite, no Largo, todo mundo me acendeu. Mas não foi a primeira vez que alguém me acendeu.', 'lume');
    await say('Lá embaixo, no primeiro andar, eu era um lustre apagado no teto. Um caixote com dente olhou pra cima e disse "ei, você tá viva?". Foi a primeira vez em anos.', 'lume');
    await say('* Ela tira uma vela pequena do adereço e põe dentro da sua tampa.');
    await say('Essa é sua. Pra quando você precisar de luz e eu não estiver perto.', 'lume');
    const c = await choose('* O que dizer?', ['Você sempre vai estar perto.', 'Eu não sei o que dizer.', 'Eu guardo. Junto com a lágrima.'], 'me', 2);
    if (c === 0) { await say('Promessa grande pra um baú pequeno. ...Eu aceito.', 'lume'); maisCoracao2(2); }
    else if (c === 1) { await say('Não precisa dizer. Eu leio a sua tampa. Ela fica vermelha nas dobradiças.', 'lume'); maisCoracao2(2); }
    else { await say('* Ela fica muito vermelha para alguém feito de chama.'); await say('Você lembrou da lágrima. Você é impossível.', 'lume'); maisCoracao2(3); }
  },
  async fogueira() {
    await say('* A noite do cerco. Todo mundo dormindo ou fingindo, no pé do morro. A Lume sentada na fogueira, embrulhada no xale, olhando o Farol lá em cima.');
    await say('Se a gente não descer amanhã... não, deixa eu falar. Se a gente não descer, eu queria ter dito umas coisas.', 'lume');
    await say('Mas eu não vou dizer agora. Porque se eu disser agora, parece despedida. E não é.', 'lume');
    await say('Quando isso acabar, a gente toma aquele café. Na superfície. Numa mesa de calçada, igual gente. E aí eu digo.', 'lume');
    const c = await choose('* Responder:', ['Combinado. Café.', 'Eu também tenho coisas pra dizer.', 'Encostar a tampa no ombro dela, sem falar nada'], 'me', 2);
    if (c === 0) { await say('Café. Com pão de queijo queimado do lado esquerdo.', 'lume'); maisCoracao2(2); }
    else if (c === 1) { await say('Então guarda. A gente troca. Uma coisa minha, uma sua. No café.', 'lume'); maisCoracao2(2); }
    else { await say('* Ela encosta a cabeça na sua tampa. A fogueira estala. Lá em cima, o Farol, apagado ainda.'); await say('Assim também serve.', 'lume'); maisCoracao2(3); }
  }
};
// no Diário e nas missões
DIARIO.push({ tipo: 'side', cap: 'Temporada 2', quem: 'a Lume', tit: 'Conversas com a Lume', vis: () => fl('c2Fim'), feita: () => nConversas2() >= CONVERSAS2.length, recompensa: 'o coração dela (muda o final)', desc: 'Ao pé da vela da base, depois de cada capítulo. Algumas só de noite.', passos: CONVERSAS2.map(c => [c.nm + (c.noite ? ' (de noite)' : '') + (c.lugar === 'sope9' ? ' (a fogueira do Sopé)' : ''), () => conversaFeita2(c.id)]) });
{ const _msR2 = missoes; missoes = function () { const L = _msR2(); const c = conversaDisponivel2('interior') || conversaDisponivel2('sope9'); if (c && !(G.flags || {}).c10Fim) L.push({ tipo: 'side', tit: 'Conversa com a Lume', desc: '"' + c.nm + '"' + (c.noite ? ', de noite' : '') + (c.lugar === 'sope9' ? ', na fogueira do Sopé.' : ', ao pé da vela da base.'), map: c.lugar || 'interior', at: c.lugar === 'sope9' ? SO9.fogueira : POS3.interior.vela, quando: c.noite ? 'noite' : undefined }); return L; }; }
// v122: o coração da conversa fica no chão logo abaixo da vela (dá para pisar nele) e quem falava com a VELA só ouvia
// "a chama não mexe...". Agora falar com a vela também começa a conversa com a Lume, se houver uma esperando.
{ const _fvR = falaVela; falaVela = async function () { if (G.flags.c3Vela && conversaDisponivel2('interior')) return conversa2('interior'); return _fvR.apply(this, arguments); }; }
