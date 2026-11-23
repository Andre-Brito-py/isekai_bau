// ================= CAP. 9 — OPCIONAIS COM VIAGEM RÁPIDA =================
// RASTROS DE ÂMBAR (a moça de âmbar): três fios de âmbar morno em lugares por onde ela passou: as Cisternas (Cap. 8), o
// Poço do Sino (VELHÁGUA) e a Câmara do Despertar (ANDAR 1 da masmorra, pela Mina de Origem). Cada fio, uma lembrança
// dela. Com os três: a LEITURA (o Avaliar deixa o inimigo LIDO; ela avisa a hora certa da defesa).
// A PENSÃO SEM REMETENTE: a Dona Cida (Largo, de dia) recebe um envelope todo mês desde o Inverno, sem remetente; a
// Dona Ilda (CANDEIA) também, desde que o Zé sumiu; a Dona Hortênsia (CIDADE ALTA) reconhece o lacre. Recompensa:
// o Lacre Partido.
// SEGREDO (só bíblia): a moça é a metade de Ada que sente culpa; ela nunca diz esse nome.
const fiosMoca9 = () => [G.flags.c8Fio, G.flags.c9FioPoco, G.flags.c9FioAndar].filter(Boolean).length;
Object.assign(EQ2, { lacre9: { nm: 'Lacre Partido', slot: 'amuleto', who: ['lume', 'rita'], mod: { mhp: 12, mdef: 3 }, fx: [], preco: 0, d: 'O lacre de cera preta das cartas sem remetente, partido ao meio. +12 PV, +3 RES. Pesa mais do que devia.' } });
{ const _mmM9 = montarMapas2; montarMapas2 = function () {
  _mmM9.apply(this, arguments);
  const fio = (mapId, x0, y0, id, flag, talk) => { const m = MAPS2[mapId]; if (!m || m['_' + id]) return; m['_' + id] = true; const p = chaoLivre8(m, x0, y0) || [x0, y0];
    m.ents.push({ t: 'sign', id, x: p[0], y: p[1], h: 30, spr: () => fioAmbarArt(Math.floor(W2.t / 4)), gone: () => !G.flags.c9Init, get luz() { return G.flags[flag] ? 20 : 46; }, talk }); };
  fio('poco', 12, 8, 'fio9p', 'c9FioPoco', fioPoco9);
  fio('andar1', AN7.pedestal[0] + 2, AN7.pedestal[1] + 1, 'fio9a', 'c9FioAndar', fioAndar9);
  // a Dona Cida no Largo (de dia), com o envelope
  const L = MAPS2.largo; if (L && !L._cida9) { L._cida9 = true; const p = chaoLivre8(L, 31, 16) || [31, 16]; L.ents.push(morador('cida', p[0], p[1], { id: 'cida9', dir: 'down', gone: () => !G.flags.c9Init || ehNoite(), talk: falaCida9 })); }
}; }
async function fioDepois9() {
  const n = fiosMoca9();
  if (n < 3) { await say('[Fios de âmbar encontrados: ' + n + '/3. ' + (G.flags.c8Fio ? '' : 'Um ainda nas Cisternas de Auren. ') + (G.flags.c9FioPoco ? '' : 'Um em Velhágua, onde a água é funda. ') + (G.flags.c9FioAndar ? '' : 'Um onde você acordou. ') + ']', 'cat'); return; }
  if (G.flags.c9Leitura) return;
  G.flags.c9Leitura = true; sfx('rune');
  await say('{o}três. você achou os três. são os lugares onde eu parei pra respirar, subindo. o âmbar fica morno onde eu paro.{/}', 'eco8');
  await say('{o}eu li o seu Catálogo inteiro enquanto estava presa. todas as fichas. todos os golpes. eu sei ler as coisas um pouquinho antes delas acontecerem. deixa eu ajudar. na luta. eu aviso.{/}', 'eco8');
  await say('[Isso é... irregular. Mas eficiente. Eu autorizo. (Eu não sei se eu preciso autorizar.)]', 'cat');
  await say('* {y}LEITURA!{/} Quando o baú AVALIA um inimigo, ele fica LIDO por 3 golpes: a moça avisa a hora certa e o anel de defesa fica mais largo.');
  save2();
}
async function fioPoco9() {
  if (G.flags.c9FioPoco) { await say('* O fio de âmbar na pedra do poço, morno. A água escura em volta não congela.'); return; }
  G.flags.c9FioPoco = true; playMusic(null);
  await say('* No fundo do Poço do Sino, onde a Dona Badalada ficou cem anos, um fio de âmbar escorre pela pedra. Morno. A água em volta dele não tem lodo.');
  await say('{o}eu desci este rio. antes de ter cidade. antes de ter sino.{/}', 'eco8');
  await say('{o}tinha uma barca. sem remo. a água levava. eu deitei no fundo da barca e fiquei olhando as estrelas passarem pelo buraco da tampa da noite.{/}', 'eco8');
  await say('Tampa da noite?', 'lume');
  await say('{o}é como eu chamava o céu, quando era pequena. uma tampa. com furinhos.{/}', 'eco8');
  await say('Ela fala do céu como você fala da sua tampa. Que fofo. Que estranho.', 'rita');
  await say('{o}o sino... ela tocava pra mim também. depois. lá embaixo eu ouvia. era o único jeito de eu saber que tinha gente em cima.{/}', 'eco8');
  await fioDepois9(); playMusic(W2.map.music);
}
async function fioAndar9() {
  if (G.flags.c9FioAndar) { await say('* O fio de âmbar ao lado do pedestal. Morno. O pedestal onde você acordou continua vazio.'); return; }
  G.flags.c9FioAndar = true; playMusic('despertar');
  await say('* A Câmara do Despertar. O pedestal onde um caixote acordou com fome, muito tempo atrás. Do lado dele, no chão, um fio de âmbar novo. Morno.');
  await say('{o}foi aqui. eu vi. eu estava lá em cima, no teto, presa no âmbar das paredes. eu via tudo daqui.{/}', 'eco8');
  await say('{o}chegou mais um. eu pensei: mais um. trinta e um. a voz lá de baixo vai comer esse também.{/}', 'eco8');
  await say('{o}aí você mordeu o Musgo. um caixote. mordeu um golem de pedra. e eu ri. eu não ria fazia trezentos anos.{/}', 'eco8');
  await say('Trezentos...', 'lume');
  await say('Qual é o seu nome?', 'me');
  await say('{o}começa com... não. não vem. está do outro lado de uma porta. lá em cima eu abro.{/}', 'eco8');
  await fioDepois9(); playMusic(W2.map.music);
}
// ---------- A PENSÃO SEM REMETENTE ----------
async function falaCida9() {
  if (G.flags.c9PensaoFim) { await say('Eu continuo recebendo. Eu continuo guardando. Agora eu sei de quem é. Não sei se é melhor.', 'cida'); return; }
  if (G.flags.c9Pensao) { await say('A Dona Ilda, de Candeia? Ela perdeu o marido pros Pavios também. Pergunta pra ela.', 'cida'); return; }
  G.flags.c9Pensao = 1; playMusic('cha');
  await say('Vocês! Da noite da música! Senta. Olha isso.', 'cida');
  await say('* A Dona Cida tira do avental um envelope pardo. Sem remetente. Lacre de cera preta, com uma chama pequena estampada.');
  await say('Todo mês. Desde o Inverno, doze anos atrás, desde que o meu marido morreu no escuro. Sempre a mesma quantia. Sempre um raminho de alecrim seco dentro.', 'cida');
  await say('Eu nunca soube de quem é. Eu nunca gastei. Tá tudo numa lata, debaixo da cama. Doze anos de lata.', 'cida');
  await say('Quem manda dinheiro pra viúva do Inverno sem dizer o nome?', 'rita');
  await say('* A Lume olha o lacre muito tempo. A chama pequena. Ela não diz nada.');
  await say('[Alguém que perdeu gente no Inverno também, talvez. Em CANDEIA, a Dona Ilda perdeu o marido para os Pavios.]', 'cat');
  playMusic(W2.map.music);
}
{ const _fI9p = falaIlda; falaIlda = async function () {
  if (G.flags.c9Pensao === 1) {
    G.flags.c9Pensao = 2; playMusic('cha');
    await say('Envelope sem remetente? Com alecrim?', 'ilda');
    await say('* A Dona Ilda levanta, abre uma gaveta, e tira uma pilha amarrada com barbante. Trinta envelopes pardos. Lacre de cera preta, chama pequena.');
    await say('Desde que o Zé entrou pros Pavios. Todo mês. Eu achei que era a pensão da Coroa. Mas a pensão da Coroa vem com carimbo e atrasa. Essa nunca atrasou.', 'ilda');
    await say('* No verso do último envelope, a lápis, uma letra pequena e apertada: "Lamento."');
    await say('Essa letra.', 'rita');
    await say('A letra do bilhete. Da parede da base.', 'me');
    await say('[Um lacre assim só sairia da Cidade Alta. A Dona Hortênsia conhece todo lacre de família de lá.]', 'cat');
    playMusic(W2.map.music); return;
  }
  return _fI9p();
}; }
{ const _fDa9 = falaDama; falaDama = async function () {
  if (G.flags.c9Pensao === 2 && !G.flags.c9PensaoFim) {
    G.flags.c9PensaoFim = true; playMusic('cha');
    await say('* A Dona Hortênsia pega o envelope com a ponta dos dedos, como quem pega uma coisa quente. Olha o lacre contra a luz.');
    await say('A chama pequena. É o lacre particular do Conde Ulrico. O Acendedor-Mor. Eu jantei com ele no aniversário da Coroa. Ele usou esse lacre no cartão do lugar à mesa.', 'dama');
    await say('Ele paga pensão às famílias dos Pavios. Às viúvas do Inverno. Em segredo. Todo mês. Do bolso dele.', 'dama');
    await say('...Por quê?', 'lume');
    await say('Uma vez eu perguntei por que ele nunca sorria. Ele disse: "Contabilidade, senhora. Eu sei exatamente quanto cada luz custou."', 'dama');
    await say('* Silêncio. Lá fora, no alto do morro, o Farol apagado.');
    await say('Ele não é um monstro. Isso é pior. Monstro a gente sabe o que fazer.', 'rita');
    await say('Ele anota o nome. E paga. E continua.', 'me');
    await say('Leva isso. Eu não quero esse lacre na minha casa.', 'dama');
    await say('* A Dona Hortênsia parte o lacre ao meio e te dá uma metade.');
    ganharEquip('lacre9'); sfx('equip'); await say(`* {y}${EQ2.lacre9.nm}{/}. ${EQ2.lacre9.d}`);
    save2(); playMusic(W2.map.music); return;
  }
  return _fDa9();
}; }
