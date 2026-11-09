// ================= A LUME: o romance que cresce devagar (v2.8) =================
// A Lume é o interesse romântico principal; a Rita é a outra ponta do triângulo (o encontro continua, agora com ciúme).
// Medidor escondido: G.flags.lumeHeart (sobe com escolhas nas conversas). Nada é declarado na Temporada 1:
// tudo fica em olhares, frases pela metade e uma promessa de café na superfície.
// A Lume é ADULTA: tinha 24 anos, tocava violão na rua e trabalhava numa lanchonete (dito na 1ª conversa).

const heart = n => { G.flags.lumeHeart = (G.flags.lumeHeart || 0) + n; };

// ---------- conversas na Lanterna: uma por vez, na ordem, quando a história libera ----------
const LUME_TALKS = [
  { id: 'lt_quem', when: f => f.lumeJoined, run: async () => {
    await say('* A Lume pousa em cima da Lanterna, de pernas pro ar. Bom, de velas pro ar.');
    await say('Baú. Você nunca me perguntou quem eu era.', 'lume');
    await say('Você nunca me perguntou também.', 'me');
    await say('Eu perguntei. Você respondeu "um cara normal que pagava boleto". Isso não é uma pessoa, é um extrato.', 'lume');
    await say('Vinte e quatro anos. Lanchonete de dia, violão na praça de noite. Morava num quarto com uma janela que não fechava.', 'lume');
    await say('Eu pegava o 31 toda noite, sentava no fundo e cantava baixinho até o ponto final. Ninguém reclamava. Acho que ninguém ouvia.', 'lume');
    const c = await choose('* O que você diz?', ['"Eu ouvia."', '"Canta alguma coisa agora?"', '"Por isso você é tão dramática."']);
    if (c === 0) {
      heart(2);
      await say('Eu ouvia. Eu acho. Tinha uma música que eu não sabia o nome. Ficava na cabeça o dia inteiro.', 'me');
      await say('* As velas da Lume ficam mais altas por um segundo. Depois ela disfarça.');
      await say('...Você tá inventando isso pra me agradar.', 'lume');
      await say('Talvez. Funcionou?', 'me');
      await say('Cala a boca, baú.', 'lume');
    } else if (c === 1) {
      heart(1);
      await say('* Ela cantarola um pedaço de alguma coisa. Para no meio, sempre no mesmo lugar.');
      await say('Eu nunca lembro o final. Morri com ela pela metade.', 'lume');
    } else {
      await say('Eu sou um LUSTRE, baú. O drama faz parte da decoração.', 'lume');
    }
  } },
  { id: 'lt_escuro', when: f => f.ch2done, run: async () => {
    await say('* A Lanterna está fraca hoje. A Lume chega mais perto de você, devagar, como quem não quer que você perceba.');
    await say('Eu odeio o escuro. Você sabe disso.', 'lume');
    await say('Eu sei. Você é um lustre com medo de escuro. É meio que a sua personalidade toda.', 'me');
    await say('No ônibus, quando a luz apagou... eu lembro da mão de alguém segurando a minha. Não sei de quem era.', 'lume');
    const c = await choose('* A Lume ficou quieta.', ['"Eu fico aqui até você dormir."', '"Eu não tenho mão. Mas tenho alça."', '"Deve ter sido o cobrador."']);
    if (c === 0) { heart(2); await say('* Ela não responde. Mas também não sai de perto. Você passa a noite inteira com a tampa meio aberta, de vigia.'); await say('* De manhã, ela está dormindo encostada na sua dobradiça.'); }
    else if (c === 1) { heart(1); await say('...Isso foi a coisa mais idiota e mais fofa que alguém já me disse.', 'lume'); await say('* Ela encosta uma das velas na sua alça. Fica morno.'); }
    else await say('O Tiago? Ele segurava a mão de todo mundo. Era o trabalho dele.| ...Esquece.', 'lume');
  } },
  { id: 'lt_quase', when: f => f.ch3done && !f.lumeFading, run: async () => {
    await say('* Desde o Scriptorium, a Lume confere a própria luz toda hora. Como quem apalpa o bolso atrás da carteira.');
    await say('Quando a Maren estava me apagando, sabe do que eu tive mais medo?', 'lume');
    await say('De sumir?', 'me');
    await say('De você esquecer como era a minha voz.| Gente esquece voz primeiro. Depois o resto.', 'lume');
    const c = await choose('* O que você diz?', ['"Eu não ia deixar."', '"Eu ia anotar você em todo lugar. Que nem a Ofélia."', '"Sua voz é meio impossível de esquecer. É alta."']);
    if (c === 0) { heart(2); await say('Você nem sabia o que fazer.', 'lume'); await say('Não. Mas eu ia fazer mesmo assim.', 'me'); await say('* A Lume vira de costas rápido. As velas dela estalam.'); }
    else if (c === 1) { heart(1); await say('"Lume: lustre, dramática, canta mal de manhã." Ia ficar lindo no Catálogo.', 'lume'); await say('Você não canta mal.| De manhã canta.', 'me'); }
    else { heart(1); await say('ALTA?| ...Tá. É alta. Mas você ia lembrar.', 'lume'); }
  } },
  { id: 'lt_bilhete', when: f => f.bilhete8, run: async () => {
    await say('* A Lume ainda guarda o bilhete da oitava série. Ela desdobra e dobra de novo, sem motivo.');
    await say('Pergunta séria. Se alguém te mandasse um desses hoje. Você marcava o quê?', 'lume');
    const c = await choose('* "( ) sim ( ) não ( ) talvez"', ['"( ) sim"', '"( ) talvez"', '"Depende de quem mandou."']);
    if (c === 0) { heart(2); await say('Sem nem saber quem mandou?', 'lume'); await say('Eu demorei vinte anos pra aprender. Agora eu marco sim.', 'me'); await say('* A Lume enfia o bilhete dentro da sua tampa, rápido, e sai voando pro outro lado da sala.'); await say('Guarda isso. É seu. Não é meu. Tchau.', 'lume'); }
    else if (c === 1) { heart(1); await say('Talvez. O "talvez" é o "sim" dos covardes.', 'lume'); await say('E o seu, qual seria?', 'me'); await say('...O meu seria talvez também.', 'lume'); }
    else {
      heart(2);
      await say('Depende? De quem, por exemplo?', 'lume');
      await say('Sei lá. De uma pessoa que canta mal de manhã.', 'me');
      await say('* Silêncio. A Lume fica parada no ar, sem piscar nenhuma vela.');
      await say('...Isso foi uma piada, né?', 'lume');
      await say('Foi.', 'me');
      await say('Ótimo. Porque foi uma piada péssima.', 'lume');
      await say('* Ela demora um tempão pra parar de brilhar mais forte.');
    }
  } },
  { id: 'lt_cafe', when: f => f.dateDone, run: async () => {
    await say('* A Lume está quieta desde o Terminal. Quieta demais para uma Lume.');
    await say('E aí. Como foi o café?', 'lume');
    const c = await choose('* Ela pergunta sem olhar pra você.', ['"Foi bom. Mas eu fiquei pensando em outra coisa."', '"Foi ótimo! A Rita é incrível."', '"Por que você marcou, se ficou assim?"']);
    if (c === 0) {
      heart(3);
      await say('Em que coisa?', 'lume');
      await say('Numa pessoa que ficou o encontro inteiro do outro lado da plataforma, fingindo que lia um cartaz de horário.', 'me');
      await say('* As três velas da Lume se acendem de uma vez, tão forte que a sombra de vocês dois vai parar no teto.');
      await say('Eu estava LENDO. Os horários são muito interessantes. Tem um ônibus pras 19h40.', 'lume');
      await say('Lume.', 'me');
      await say('...Eu sei. Desculpa. Eu marquei porque achei que era o certo. Aí doeu e eu não sabia por quê.', 'lume');
      await say('Agora sei. E não vou falar.| Ainda não.', 'lume');
    } else if (c === 1) {
      await say('Que bom. Que ótimo. Ótimo mesmo.', 'lume');
      await say('* Uma das velas dela apaga sozinha. Ela acende de novo, rápido, como se nada tivesse acontecido.');
      await say('Ela é bonita, tem emprego e tem rosto. Eu sou um lustre. Faz sentido.', 'lume');
      await say('O quê?', 'me');
      await say('Nada. Vai dormir, baú.', 'lume');
    } else {
      heart(2);
      await say('Porque eu sou burra, baú.', 'lume');
      await say('Porque você merecia alguém que pudesse segurar o seu café. Eu nem consigo segurar o meu.', 'lume');
      await say('Eu também não. Eu não tenho mão.', 'me');
      await say('* Ela ri. Um riso pequeno, molhado.');
      await say('Dois inúteis.', 'lume');
    }
  } },
  { id: 'lt_cancao', when: f => f.ch5done, run: async () => {
    await say('* A Lume ensaia baixinho a música de sempre. Para no mesmo verso de sempre.');
    await say('Sabe por que eu acho que nunca lembro o final?', 'lume');
    await say('Porque a masmorra comeu?', 'me');
    await say('Porque eu nunca soube pra quem era. Música sem destinatário não termina. Fica rodando.', 'lume');
    const c = await choose('* O que você diz?', ['"Termina pra mim, então."', '"Eu ajudo a lembrar. Canta de novo."', '(Ficar ouvindo, em silêncio)']);
    if (c === 0) { heart(2); await say('* Ela olha pra você por muito tempo.'); await say('Pede de novo quando a gente sair daqui. Aí eu vejo.', 'lume'); }
    else if (c === 1) { heart(1); await say('* Ela canta de novo. Desta vez você cantarola junto o que lembra. Erra a letra toda. Ela ri no meio e não consegue continuar.'); }
    else { heart(2); await say('* Você não diz nada. Ela canta até o verso de sempre e para. Depois, pela primeira vez, canta uma palavra a mais.'); await say('...Uma palavra. Eu lembrei uma palavra.', 'lume'); }
  } },
  { id: 'lt_rua', when: f => f.ch7done, run: async () => {
    await say('* Falta pouco para a superfície. A Lume está inquieta, voando em círculos em volta da Lanterna.');
    await say('Se a gente voltar pra Terra. Você gente, eu gente. Você ia me reconhecer na rua?', 'lume');
    const c = await choose('* O que você diz?', ['"Pela voz. Ia ser a primeira coisa."', '"Eu ia procurar a moça do violão em todas as praças."', '"Você ia me reconhecer?"']);
    if (c === 0) { heart(2); await say('Voz é a primeira coisa que a gente esquece, eu te disse.', 'lume'); await say('Eu sei. Por isso eu treino toda noite.', 'me'); await say('* Ela para de voar em círculos.'); }
    else if (c === 1) { heart(2); await say('Tem muita praça, baú.', 'lume'); await say('Eu tenho tempo. Eu sou um móvel. A gente dura.', 'me'); }
    else { heart(1); await say('Fácil. Você ia ser a única pessoa da cidade corando pra uma vela.', 'lume'); await say('A Madame Pavio é uma vela muito bem acabada.', 'me'); await say('Retira o que disse.', 'lume'); }
  } }
];
{ const _l = lantern; lantern = async function () {
  const f = G.flags;
  const next = f.lumeJoined && !f.lumeFading && LUME_TALKS.find(t => !f[t.id] && t.when(f));
  if (!next) return _l();
  // a conversa com a Lume ocupa o lugar do pensamento aleatório desta vez
  WD.skipThought = true;
  try { await _l(); } finally { WD.skipThought = false; }
  f[next.id] = true;
  await next.run();
}; }

// ---------- o encontro com a Rita, agora com ciúme ----------
{ const _r = STORY.rita; STORY.rita = async function () {
  const f = G.flags;
  if (f.ritaMet && !f.dateDone && !f.dateAsk) {
    f.dateAsk = true;
    await say('Psiu. Baú. Vem cá.', 'lume');
    await say('Eu... falei com a Rita. Ela topou tomar um café com você. Nos bancos da plataforma 4.', 'lume');
    await say('VOCÊ O QUÊ?', 'me');
    await say('Um encontro, baú. A gente tá no meio de uma guerra, todo mundo vai morrer de novo, você merece UM café.', 'lume');
    await say('* Ela diz isso rápido demais. Como quem decorou.');
    await say('E você? Vai fazer o quê enquanto isso?', 'me');
    await say('Eu? Nada. Vou ler os horários dos ônibus. Adoro horário de ônibus.', 'lume');
  }
  return _r();
}; }
STORY.encontro = async function () {
  playMusic('terminal');
  await say('* Plataforma 4. Dois copinhos de café de máquina. Você não tem como segurar o seu. A Rita segura os dois.');
  await say('* Do outro lado da plataforma, um lustre finge ler o quadro de horários com MUITA atenção.');
  let clima = 0;
  const meter = () => `[Clima do encontro: ${'♥'.repeat(Math.max(0, clima))}${clima <= 0 ? '...' : ''}]`;
  await say('E aí. O que um baú faz pra se divertir?', 'rita');
  let c = await choose('* O que você responde?', ['"Eu guardo coisas. Sou ótimo nisso."', '"Eu como runas. É tipo sushi."', '(Ficar em silêncio)']);
  if (c === 0) { clima += 1; await say('Ótimo currículo. Eu guardo malas. A gente tem muito em comum.', 'rita'); }
  else if (c === 1) { clima += 2; await say('* Rita ri tanto que o café sai pelo nariz.'); await say('Sushi! Que nojo. Me conta mais.', 'rita'); await say('* Lá do quadro de horários, uma vela estala. Alto.'); }
  else { await say('Fala ALGUMA coisa!', 'lume'); await say('* A Rita olha para trás. A Lume volta a ler o quadro de horários.'); await say('* Você abre a tampa e fecha de novo. Com som.'); await say('...Isso foi um sim?', 'rita'); }
  sfx('catalog'); await say(meter(), 'cat');
  await say('Você era gente antes, né? Do que você gostava?', 'rita');
  c = await choose('* O que você responde?', ['"Mangá. E pastel de feira."', '"Dormir. Eu era excelente em dormir."', '"Eu fazia academia." (mentira)']);
  if (c === 0) {
    clima += 2;
    if (G.flags.mem_pastel) { await say('Pastel. Eu... não lembro o gosto. Eu sei que gostava. Me disseram.', 'me'); await say('* A Rita para de sorrir por um segundo.'); await say('Então um dia eu te pago um. E você me conta se lembrou.', 'rita'); clima += 1; }
    else await say('Pastel de queijo ou de carne?', 'rita');
  } else if (c === 1) { clima += 1; await say('Respeito. Eu não durmo desde que larguei a lança.', 'rita'); }
  else { clima -= 1; await say('MENTIRA.', 'lume'); await say('Você não tem braço.', 'rita'); await say('...Eu fazia academia de dedo. No celular.', 'me'); await say('A sua amiga lustre está prestando muita atenção pra quem tá lendo horário.', 'rita'); }
  sfx('catalog'); await say(meter(), 'cat');
  await say('Posso fazer uma pergunta estranha? Como é aí dentro?', 'rita');
  c = await choose('* Ela quer olhar dentro da sua tampa.', ['"Fica à vontade!"', '"É um pouco cedo pra isso."', '(Morder de leve, por reflexo)']);
  if (c === 0) {
    clima += 1; await say('* Ela abre a sua tampa com cuidado. Lá dentro: três runas, uma pena do Escriba e uma meia.');
    if (G.flags.lt_bilhete) await say('* E, bem no fundo, um bilhete dobrado em forma de coração. A Rita não pergunta. Você agradece a todas as divindades da masmorra.');
    await say('Por que tem uma meia aqui?', 'rita'); await say('Eu não sei. Ela aparece. Toda manhã. Eu não tenho pé.', 'me');
  }
  else if (c === 1) { clima += 2; await say('* A Rita gargalha.'); await say('Um baú de respeito. Gostei.', 'rita'); }
  else { clima -= 2; await say('* NHAC. Bem de leve. No dedão.'); await say('AI!', 'rita'); await say('DESCULPA! É reflexo! Eu juro que é reflexo!', 'me'); await say('* Do quadro de horários, uma risadinha que vira tosse.'); await say('...Tá. Foi meio engraçado.', 'rita'); }
  sfx('catalog'); await say(meter(), 'cat');
  await say('Esse foi o encontro mais esquisito da minha vida.| E eu já saí com um bardo.', 'rita');
  G.flags.dateDone = true; G.flags.dateScore = clima;
  if (clima >= 5) {
    G.flags.ritaPromise = true; blush(600);
    await say('* Ela se abaixa e dá um beijinho rápido na sua tampa. Bem na fechadura.');
    await say('Quando você arranjar um rosto, me procura. O pastel é por minha conta.', 'rita');
    await say('* Você não consegue falar nada. Você só solta vapor.');
    await say('* Do outro lado da plataforma, as três velas da Lume se apagam ao mesmo tempo. Ela acende de novo, uma por uma, devagar.');
    await say('Ele travou. Acho que você quebrou ele.', 'lume');
    await say('* A voz dela sai alegre. Alegre demais.');
  } else if (clima >= 2) {
    blush(300);
    await say('Foi bom, mala falante. Sério. Fazia tempo que eu não ria.', 'rita');
    await say('* A Rita olha para o quadro de horários e depois para você, com um meio sorriso de quem entendeu alguma coisa.');
    await say('E vai falar com ela, hein. Antes que ela decore os horários de todos os ônibus da masmorra.', 'rita');
  } else {
    await say('Vamos ser amigos. Amigos de bagagem. Combinado?', 'rita');
    await say('* A Lume volta flutuando do quadro de horários. Ela parece mais leve. Bem mais leve.');
  }
  giveItem('sache', 2); sfx('item');
  await say('* A Rita enfia dois sachês de lavanda na sua tampa. "Pra tirar o cheiro de pólvora." Você recebeu {y}Sachê de Lavanda{/} ×2.');
  await say('Eu tô corado? Baú cora?', 'me');
  await say('Cora. Você tá cor de goiaba de novo.| Combina com você.', 'lume');
  await say('* Ela diz a última parte tão baixinho que você não tem certeza se ouviu.');
};

// ---------- a Madame Pavio: um ciúme pequeno ----------
{ const _p = STORY.pavio; STORY.pavio = async function (e) {
  const first = !G.flags.pavioMet;
  await _p(e);
  if (first && G.flags.lumeJoined) {
    await say('* A chama da Lume fica um pouquinho menor.');
    await say('Ela é de cera, baú. Derrete na primeira dificuldade.', 'lume');
    await say('Você tá com ciúme de uma vela?', 'me');
    await say('Eu sou um LUSTRE. Eu tenho TRÊS velas. Eu não tenho ciúme de UMA.', 'lume');
  }
}; }

// ---------- a Lume humana (arte_lumeh.js): sprite de mapa e retrato ----------
{ const _bs = buildSprites; buildSprites = function () {
  _bs();
  if (typeof ARTE_LUMEH === 'undefined') return;
  const B = ARTE_LUMEH.body.map(iaCanvas); SP.lumeHuman = [B[0], B[0], B[1], B[1]];
  SPF.lumeh = { s: ARTE_LUMEH.side.map(iaCanvas), b: ARTE_LUMEH.back.map(iaCanvas), walk: ARTE_LUMEH.walk.map(iaCanvas) };
  PORT.lumeh = ARTE_LUMEH.port.map(iaCanvas);
  wrapLumeH8();
}; }
WHO.lumeh = { name: () => 'Lume', portrait: t => portFrame('lumeh', t), voice: () => sfx('blipTri', 1150), col: '#fff0c0' };
// (o arte.js redefine drawLume8 no fim do script, então o embrulho entra só no boot)
let LUMEH_WRAPPED = false;
function wrapLumeH8() {
  if (LUMEH_WRAPPED) return; LUMEH_WRAPPED = true;
  const _dl = drawLume8; drawLume8 = function (x, y, alpha) {
    if (!V.lumeH8 || !SP.lumeHuman) return _dl(x, y, alpha);
    const f = SP.lumeHuman[Math.floor(FRAME / 24) % SP.lumeHuman.length];
    if (alpha != null) bx.globalAlpha = alpha;
    bx.drawImage(f, Math.round(x - 12 - f.width / 2), Math.round(y + 31 - f.height));
    bx.globalAlpha = 1;
  };
}

// ---------- a forma humana: a primeira vez que ela vê o seu rosto (e mostra o dela) ----------
STORY.lumeHumano8 = async function () {
  const h = G.flags.lumeHeart || 0, of = G.flags.ofeliaRemembers ? 'Clara' : 'Ofélia';
  await say('* A Lume para de rir. Ela chega perto, bem perto, e fica olhando o seu rosto como quem lê uma carta.');
  await say('Então era essa a sua cara.', 'lume');
  await say(`${of}. Essa runa. Ela funciona com qualquer um que lembre do próprio rosto?`, 'lume');
  await say('Com quem lembra direito. A maioria esquece.', 'of');
  await say('Eu lembro. Eu ensaiei a minha cara no espelho do banheiro da lanchonete por seis anos. Eu lembro de TUDO.', 'lume');
  sfx('catalog'); await fadeOut(8);
  V.lumeH8 = true; await fadeIn(10); sfx('rune');
  await say('* As três velas se apagam juntas. No lugar do lustre, uma moça baixinha, de manto branco e vermelho, cabelo dourado até a cintura e um violão nas costas.');
  await say('* Em cima da cabeça, um fio de cabelo rebelde segura uma chaminha acesa, como pavio. No cabelo, uma presilha: um lustre pequenininho, com um cristal lilás.');
  await say('...Oi.', 'lumeh');
  if (h >= 8) {
    await say('* Você esquece como se fala. Faz tempo que você não tem boca, e agora que tem, ela não serve pra nada.');
    await say('Fala alguma coisa, baú. Você tá me deixando nervosa.', 'lumeh');
    await say('Você é... baixinha.', 'humano');
    await say('E VOCÊ ficou dez minutos olhando. Eu contei.', 'lumeh');
    await say('* Ela pega a sua mão. Só um segundo. É a primeira coisa que você segura desde o ônibus. É quente, como vela.');
    await say('Na superfície, me paga um café? Um de verdade. Agora eu consigo segurar.', 'lumeh');
    await say('Não é a Rita que vai tomar o primeiro café com você. Eu marquei antes. Só esqueci de avisar.', 'lumeh');
  } else if (h >= 4) {
    await say('Você é... baixinha.', 'humano');
    await say('E você tem orelha de abano. Estamos quites.', 'lumeh');
    await say('* Ela ri, e o riso é o mesmo de sempre. Só que agora tem um rosto em volta dele. Ela demora um segundo a mais pra desviar o olhar.');
  } else {
    await say('Você é... baixinha.', 'humano');
    await say('Vinte e quatro anos ouvindo isso. Não vai ser um baú que vai me ofender.', 'lumeh');
  }
  await say('* O cabelo dela estala, como vela no fim. Ela olha para as próprias mãos.');
  await say('Ah, não. Já? Eu ia...', 'lumeh');
  sfx('flee'); V.lumeH8 = false;
  await say('* E ela é um lustre de novo, girando no ar, tonta.');
  await say('...Cansa MESMO. A Ofélia não tava brincando.', 'lume');
};
