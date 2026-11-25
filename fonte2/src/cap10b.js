// ================= CAPÍTULO 10 — Parte 2: A SALA DA LANTERNA =================
// O Acendedor-Mor na sala da lanterna. Ele oferece de novo à Lume "nunca mais escuro"; ela diz não. A luta. A 40%, o
// Farol, cheio demais, começa a MOSTRAR o que guarda: a IRONIA (SEGREDO; só jogo e bíblia): a alma de LÍVIA desceu
// para a masmorra como todas, foi lida, e o âmbar dela é o que acendeu Auren por doze invernos. Ele queimou a filha para
// que ninguém morresse no escuro. No caderno, a carta original do projeto, assinada com uma LANTERNA DE UM OLHO (gancho da
// trilogia). O CORAÇÃO DO FAROL acorda sozinho (não era dele o plano). A 40% da luta, a MOÇA DE ÂMBAR ganha NOME (o
// jogador escolhe) e se funde ao Catálogo. A ESCOLHA: apagar o Farol agora (as lembranças voltam, a de Lívia agradece)
// ou deixar aceso uma noite a mais (para ele se despedir; ao amanhecer ele mesmo apaga). EPÍLOGO: as lembranças voltam
// para os Pavios; o Jorge e o pote "31"; o caderno preto na parede da base; o CAFÉ e a CANÇÃO terminada (romance da
// Lume; a Rita com o próprio momento); quem não tem mais casa chega na porta do baú (semente do VILAREJO da T3).
Object.assign(WHO, { livia: { name: () => 'Lívia', voice: voz(820), col: '#ffd8e8', edge: '#e86a8a' } });
// depois do nome, a moça fala com o nome dela
{ const w = WHO.eco8; if (w) w.name = () => G.nomeMoca || '???'; }
{ const _b2L10 = battle2; battle2 = function () { BT.leituraTotal = false; BT._fimVesper10 = false; return _b2L10.apply(this, arguments); }; }
{ const _fsLT10 = foeStrike; foeStrike = async function (e, t, pow, o = {}) { if ((BT.leituraTotal || (G.nomeMoca && e && e.boss && Math.random() < 0.25)) && e && e.st && !(e.st.lido > 0)) e.st.lido = 1; return _fsLT10(e, t, pow, o); }; }
{ const _mmL10 = montarMapas2; montarMapas2 = function () {
  _mmL10.apply(this, arguments);
  if (MAPS2.lanterna10) return;
  MAPS2.lanterna10 = { rows: ROWS10.lanterna10, key: KEY10, name: 'O Farol · A Sala da Lanterna', music: 'farol9', batBg: bgLanterna10, bg: '#060814', semCeu: true,
    lights: [[13, 7, G && G.flags && G.flags.c10Fim ? 40 : 160]],
    props: [{ img: () => lampadaArt(Math.floor(W2.t / 6), !!G.flags.c10Apagado), x: LA10.lampada[0] - 0.1, y: LA10.lampada[1] + LA10.lampada[3] + 0.4, solid: [[LA10.lampada[0], LA10.lampada[1], LA10.lampada[2], LA10.lampada[3]]] }],
    ents: [
      ...LA10.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('torre10', TO10.saida[0][0], TO10.saida[0][1] + 2, 'down'); await fadeIn(10); } })),
      morador('vesper', ...LA10.vesper, { id: 'vesper10', dir: 'down', gone: () => !!G.flags.c10Vesper, talk: lutaVesper10 }),
      ...LA10.trig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c10Vesper, run: lutaVesper10 })),
      ...LA10.trig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !G.flags.c10Vesper || !!G.flags.c10Fim, run: async () => { W2.mv = null; if (!G.flags.c10Coracao) { await say('* A lâmpada canta de novo. O Coração do Farol ainda bate.'); await lutaCoracao10(); } else await escolhaFinal10(); } }))
    ],
    onEnter: async () => { if (!G.flags.c10Sala) { G.flags.c10Sala = true; playMusic(null); await say('* A sala da lanterna. Redonda, de vidro, no topo do mundo. Lá fora, a noite inteira, e Auren lá embaixo como um punhado de brasas.'); await say('* No meio, a lâmpada do Farol: uma colmeia de vidro do tamanho de uma casa, com uma chama de âmbar dentro. Ela gira. O facho sai e volta.'); await say('* E na frente dela, de costas, de luvas pretas, um homem com um caderno aberto. Escrevendo.'); } }
  };
}; }
// ---------- o Acendedor-Mor ----------
async function lutaVesper10() {
  if (G.flags.c10Vesper) return; W2.mv = null; playMusic(null);
  await say('Boa noite. Eu sabia que vinham. Eu anotei vocês na primeira noite, em Velhágua. A moça que canta. A escudeira. O baú.', 'vesper');
  await say('* Ele fecha o caderno. Não se vira ainda.');
  await say('Doze invernos atrás, o âmbar acabou. Quarenta noites no escuro. O hospital dos pobres sem luz. Eu estava acendendo os bairros ricos, por ordem da Coroa, quando...', 'vesper');
  await say('* Ele para. Respira.');
  await say('Ninguém mais vai morrer no escuro. Essa é a conta. Eu pago cada pote. Eu sei cada nome.', 'vesper');
  await say('* Agora ele se vira. Olha para a Lume. Só para ela.');
  await say('Moça das velas. A senhora odeia o escuro como eu. Eu ofereci uma vez e a senhora quase disse sim. Eu ofereço de novo. Nunca mais escuro. Nunca mais.', 'vesper');
  await say('* A Lume olha para a lâmpada. Para a cidade lá embaixo, esquecendo o nome das ruas. Para você.');
  await say('Na noite do Inverno, eu acendi Auren inteira com a mão. Com gente. Com música. Eu tive medo o tempo todo.', 'lume');
  await say('E foi a noite mais clara da minha vida. Não, senhor. Eu não quero nunca mais escuro. Eu quero escuro com gente dentro.', 'lume');
  await say('* O Acendedor-Mor fecha os olhos. Abre. Pega a vara de acendedor.');
  await say('Então eu sinto muito. De verdade. Eu vou anotar o nome de vocês.', 'vesper');
  const r = await lutaMapa(['vesperB'], { bg: bgLanterna10, music: 'final10', pos: [[186, 150]], intro: async () => { const e = BT.foes[0]; e.phases = fasesVesper10(); e.ct = 13; callout('O ACENDEDOR-MOR', '#fff0d8', 100); } });
  if (r !== 'win') return;
  G.flags.c10Vesper = true;
  await cenaIronia10();
}
async function cenaIronia10() {
  playMusic('perda');
  await say('* A luta para no meio de um golpe. A vara cai da mão do Acendedor-Mor. Ele está olhando para o vidro.');
  await say('* No vidro da sala, girando com o facho, imagens. Lembranças que o âmbar guardava. Uma lavadeira cantando. Um menino com uma pipa. Um velho com um cachimbo.');
  await say('* E uma menina. Nove anos. Fita cor-de-rosa no cabelo. Numa cama de hospital, no escuro, segurando uma lanterna de procissão apagada.');
  await say('...Lívia.', 'vesper');
  await say('* A imagem continua. A menina fecha os olhos. Uma luzinha sai dela e desce. Desce pela terra, pelos canos, até um lugar fundo, onde tudo é lido e vira âmbar.');
  await say('* E o âmbar sobe. Pelos canos. Até as lanternas de Auren. Até as lanternas que ele acendeu, uma por uma, por doze invernos.');
  await say('[Registro... origem do âmbar de Auren, últimos doze anos: lote 1. Uma alma. Nome: Lívia Vesper.]', 'cat');
  await say('* O Acendedor-Mor cai de joelhos.');
  await say('Eu acendi ela. Todas as noites. Doze anos. Eu ACENDI ela. Eu passei doze invernos queimando a minha filha para ninguém morrer no escuro.', 'vesper');
  await say('* A luz que ele queria era ela. Sempre foi.');
  await wait(30);
  await say('* O caderno preto caiu aberto no chão. Entre as páginas, uma carta velha, dobrada em quatro. A Rita pega.');
  await say('"Ao Acendedor: o âmbar pode ser feito. Gente acesa dura mais que gente morta. Segue a fórmula. Não pergunte quem manda." Sem nome.', 'rita');
  await say('* No lugar da assinatura, um desenho pequeno, feito a pena: uma lanterna. Com um olho só.');
  await say('{o}...eu conheço essa marca.{/}', 'eco8');
  await say('* Vocês se viram para o som. Ninguém fala.');
  await say('Chegou embaixo da minha porta. Na primeira noite depois do enterro. Eu achei que era um anjo. Eu nunca perguntei.', 'vesper');
  await wait(20);
  sfx('crit'); V.shake = 18; flashW(6);
  await say('* A lâmpada do Farol range. O vidro canta. A chama de cem invernos incha, sozinha, sem ninguém girar manivela nenhuma.');
  await say('* O facho para de girar. E vira para DENTRO da sala. Para vocês.');
  await say('Não fui eu. Eu não estou fazendo isso. Ele... ele nunca foi meu.', 'vesper');
  await say('[O CORAÇÃO DO FAROL. Ele quer continuar lendo. Ele foi feito para não parar.]', 'cat');
  await lutaCoracao10();
}
async function lutaCoracao10() {
  const r = await lutaMapa(['coracaoF'], { bg: bgLanterna10, music: 'final10', pos: [[198, 176]], intro: async () => { const e = BT.foes[0]; e.phases = fasesCoracao10(); e.ct = 14; callout('O CORAÇÃO DO FAROL', '#ffe090', 110); } });
  if (r !== 'win') { G.flags.c10Vesper = true; return; }
  G.flags.c10Coracao = true;
  await escolhaFinal10();
}
// ---------- o nome dela (dentro da luta, a 40%) ----------
async function nomeDaMoca10(e) {
  sfx('rumble'); flashW(4);
  await say('* O Coração do Farol foca em você. Um facho fino como agulha, entrando pela fresta da tampa. Ele está lendo. Lendo TUDO. O ônibus, a curva, o pedestal...');
  await say('{o}não. de novo não. não esse.{/}', 'eco8');
  await say('{o}eu preciso entrar. de verdade, não pela fresta. mas sem nome eu sou só uma linha solta no seu Catálogo. linha solta não segura nada.{/}', 'eco8');
  await say('[...Eu tenho espaço. Eu sempre tive espaço sobrando. Ninguém nunca me pediu para dividir.]', 'cat');
  await say('[Entra. Mas ele precisa te dar um nome. Nome é porta. Quem me ensinou isso foi uma bibliotecária.]', 'cat');
  await say('{o}eu não lembro o meu nome antigo. e eu não quero o antigo. o antigo era de antes da barca. eu quero um que seja seu.{/}', 'eco8');
  let nome = await textInput('Que nome você dá a ela?', 'Lira', 10, 'Ela não lembra do nome antigo. Ela quer um nome novo, dado por você.');
  nome = (nome || 'Lira').trim() || 'Lira';
  G.nomeMoca = nome; G.flags.c10Nome = true; G.flags.c9Leitura = true; sfx('rune');
  await say('{o}' + nome + '.{/}', 'eco8');
  await say('{o}...' + nome + '. é bonito. é meu.{/}', 'eco8');
  if (typeof mocaAparece === 'function') await mocaAparece(nome);
  flashW(6); bshake(14, 2);
  await say('* Uma luz âmbar sai da sua tampa. Morna, de janela de casa vista de longe. Os colchetes do Catálogo derretem e viram âmbar. As duas vozes viram uma.');
  await say('[' + nome + ' e o Catálogo: fusão completa. Primeira leitura: O Coração do Farol. Ele está com medo. Ele foi feito para ter fome e nunca teve nada que fosse dele.]', 'cat');
  await say('{o}eu li ele, @. agora é a gente que sabe onde bate.{/}', 'eco8');
  await say('[Nota para o registro, depois da luta: uma alma com nome morando DENTRO de uma habilidade, pensando junto. Não existe isso em nenhum livro da Coroa. Só em canção velha de taberna, no mesmo verso de quem dobra o espaço.]', 'cat');
  await say('[Você agora carrega duas lendas, @. Esconda as duas.]', 'cat');
  e.shield = 0; breakFoe(e); e.weak = ['gelo', 'mordida', 'corte']; e.known = {};
  for (const m of alive(BT.party)) healUnit(m, Math.round(m.mhp * 0.3));
  BT.leituraTotal = true;
  callout(nome.toUpperCase() + ' LÊ O CORAÇÃO: todo golpe dele é LIDO!', '#ffd890', 120);
}
// ---------- a escolha ----------
async function escolhaFinal10() {
  playMusic(null);
  await say('* O Coração do Farol para de bater. A chama de cem invernos encolhe, cansada, até o tamanho de uma chama de vela.');
  await say('* Dentro do vidro, as lembranças ainda giram. Milhares. A de Lívia passa devagar, de fita cor-de-rosa, e olha para o pai.');
  await say('O Farol ainda tem luz para uma noite. Se apagar agora, as lembranças voltam agora. Pra todo mundo. A dela também vai embora.', 'rita');
  await say('* O Acendedor-Mor não pede nada. Ele só olha.');
  const c = await choose('* O que fazer com o Farol?', ['Apagar agora', 'Deixar aceso esta noite'], 'me', 0);
  G.flags.c10Escolha = c === 0 ? 'apagar' : 'noite';
  if (c === 0) {
    G.flags.c10Apagado = true; sfx('crit'); flashW(6);
    await say('* Você morde a manivela da lâmpada. A Rita enfia a lança na engrenagem. A Lume põe a mão no vidro e canta, baixinho, a música da estrada.');
    await say('* O Farol de Cem Invernos apaga.');
    await say('* E as lembranças saem. Todas. Pelo vidro quebrado, pela porta, pelo céu, como um bando de vaga-lumes subindo ao contrário: para baixo, para a cidade, cada uma procurando a sua casa.');
    await say('* A de Lívia é a última. Ela para na frente do pai.');
    await say('Pai. Tá escuro. Mas não dá medo. Tem gente.', 'livia');
    await say('* Ela encosta a testa na dele. E vai.');
    await say('* O Acendedor-Mor fica sentado no chão da sala da lanterna apagada. No escuro. Pela primeira vez em doze anos, ele não tem medo dele.');
  } else {
    G.flags.c10Apagado = false;
    await say('* Você fecha a tampa. A Rita encosta a lança na parede. A Lume senta no chão, perto do vidro.');
    await say('Uma noite. Ela merece uma noite com o pai. Ele também.', 'lume');
    await say('* A noite inteira, o Acendedor-Mor conversa com a luz. Vocês não escutam o quê. Às vezes ele ri. Uma vez ele canta, desafinado, uma cantiga de ninar.');
    await say('* Quando o sol aparece atrás da serra, ele mesmo apaga o Farol. Com a mão. Devagar. As lembranças saem todas, para baixo, para a cidade, cada uma procurando a sua casa.');
    await say('* A de Lívia vai por último. Ela acena. Ele acena de volta.');
  }
  save2();
  await epilogo10();
}
// ---------- epílogo ----------
async function epilogo10() {
  await fadeOut(40);
  G.flags.c10Fim = true; G.hora = 7 * 60; G.dia = (G.dia || 0) + 1;
  V.scene = 'world'; loadMap2('sope9', ...SO9.entra, 'right'); playMusic('concerto'); await fadeIn(40);
  await say('* De manhã. Pelo morro, desce uma fila. Não de Pavios: de gente. Cada um olhando as próprias mãos como quem acabou de achar a chave de casa no bolso.');
  await say('* O Osvaldo chama a Candinha pelo nome, gritando, do alto da trilha. A Dona Cotinha, lá embaixo, segura o braço do Brás e não solta mais.');
  if (G.flags.c9PromessaBras) await say('Vocês trouxeram. Todos. Eu disse que trazia, mas eu não acreditava. Obrigado.', 'bras');
  await say('* O Tiago desce por último, mancando, com a pluma do quepe quebrada e um sorriso enorme.');
  await say('A Coroa vai querer saber o que aconteceu. Eu vou contar que um baú quase me venceu. De novo. Ninguém acredita mesmo.', 'tiago');
  await wait(20);
  // o Jorge
  V.scene = 'world'; await fadeOut(20); loadMap2('ruaPavios', 34, 10, 'up'); playMusic('vila'); await fadeIn(20);
  await say('* Na Vila dos Pavios, na frente da casa 9, um homem de bigode e mãos de mecânico, sem o casaco cinza, olhando a rua como se fosse a primeira vez.');
  if (G.flags.c10PoteJorge) {
    await say('* A Rita tira do Vão o pote com a etiqueta "JORGE — 31". Ela põe na mão dele e fecha os dedos dele em volta, como a Dalva fez com as velas da Lume.');
    await say('* O pote está quase vazio. O Farol gastou quase tudo. Sobrou um pouquinho. Uma luzinha do tamanho de uma unha.');
    await say('...Trinta e um. Era um ônibus? Era o meu ônibus. Das dezoito e quarenta. Tinha um pedal duro. Duas bombadas.', 'jorge');
    await say('* Ele olha para você. Não lembra de você. Mas sorri do jeito que sorria pro retrovisor.');
    await say('Você tem cara de passageiro, mala. Passageiro que dorme no ponto final.', 'jorge');
  } else await say('* A lembrança dele voltou, como a de todo mundo. Pouca. Ele lembra do próprio nome, e de um ônibus. Só isso. Ele bate duas vezes na janela, sem perceber. Pom, pom.');
  await say('É pouco.', 'lume');
  await say('É o 31. É o começo.', 'me');
  await wait(20);
  // a base: o caderno, a carta, e quem chega
  await fadeOut(20); loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(20);
  await say('* Na base. O caderno preto do Acendedor-Mor está pregado na parede, do lado da página riscada, do bilhete e da fita. Ele mesmo mandou. Com um bilhete: "Fiquem vocês com a conta. Eu não preciso mais contar."');
  await say('* E a carta da lanterna de um olho, dobrada em quatro, presa com um alfinete no centro de tudo.');
  await say('[' + (G.nomeMoca || 'Ela') + ', quem assina com esse desenho?]', 'cat');
  await say('{o}alguém que já me chamou de metade. ela vai chamar de novo. eu ainda não lembro o resto. mas eu vou lembrar. agora eu tenho onde guardar.{/}', 'eco8');
  await wait(20);
  await cafe10();
  // quem não tem mais casa
  await fadeOut(20); loadMap2('auren', POS3.auren.bueiro[0], POS3.auren.bueiro[1] + 1, 'up'); playMusic('auren'); await fadeIn(20);
  await say('* À tarde, na porta do bueiro, tem gente. Ex-Pavios que lembraram de tudo e descobriram que a casa foi vendida, a família mudou, o nome da rua não existe mais. Com a trouxa nas costas. Sem saber para onde ir.');
  await say('Ouvimos dizer que dentro do baú cabe gente. Que tem sopa.', 'n');
  await say('Tem sopa. Mas não cabe todo mundo. A base é um quarto dobrado, não uma cidade.', 'rita');
  await say('* Você olha para a fila. Para a serra, lá atrás, com espaço de sobra e ninguém morando.');
  await say('Então a gente constrói. Lá fora. Um lugar pra quem não tem lugar.', 'me');
  await say('Um baú com uma vila em volta. Isso é a coisa mais "você" que eu já ouvi.', 'lume');
  G.flags.vilaSemente = true; save2();
  await fadeOut(40);
  await cartao(['FIM DA TEMPORADA 2', 'A Superfície', '', 'quem cai junto não se perde:', 'só aprende a acender.']);
  await cartao(['Renasci como Baú', 'continua na', 'TEMPORADA 3']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(20);
  await say('* (Fim da Temporada 2. O mundo continua aberto: entregue as lembranças que sobraram no Vão, visite quem vocês ajudaram. A Temporada 3 vai herdar as suas escolhas.)');
  save2();
}
// o café na superfície e a canção terminada (romance da Lume; a Rita com o próprio momento)
async function cafe10() {
  const H = G.her || (typeof lerHeranca === 'function' && lerHeranca()) || {}, cor = coracaoTotal2(), ritaP = !!(H.esc && H.esc.rita) || !!G.flags.pastelRita;
  await fadeOut(20); G.hora = 16 * 60 + 30; loadMap2('largo', 22, 14, 'down'); { const r = rostoSt(); r.f = FMAX; r.on = true; } playMusic('cha'); await fadeIn(20);
  await say('* No fim da tarde, a Rita some "para resolver uma coisa da Guilda". Ela pisca para a Lume ao sair. A Lume finge que não viu.');
  await say('* Uma mesinha na calçada do Largo, na frente da padaria que agora tem nome de novo: Padaria Flor do Largo. Dois cafés. Um baú na cadeira, de forma humana, segurando a xícara com as duas mãos.');
  await say('Lá embaixo, eu disse que o primeiro café na superfície não ia ser a Rita que ia tomar.', 'lume');
  await say('Você disse.', 'me');
  await say('Demorou uma temporada inteira.', 'lume');
  await say('* A Lume tira o violão das costas. Afina. Começa a música do 31. A da estrada. E chega no verso de sempre, o que ela nunca conseguiu passar.');
  await say('"...e aí teve a curva."', 'lume');
  await say('* Ela para. Respira. E continua.');
  await say('"E na curva tinha você, / com cara de quem não ia ficar. / Quem cai junto não se perde: / só aprende a acender."', 'lume');
  G.flags.c10Cancao = true; sfx('rune');
  await say('* A música termina. Pela primeira vez. Do começo ao fim.');
  if (cor >= 10) {
    await say('Eu terminei pra alguém. Você sabe pra quem.', 'lume');
    await say('* Ela segura a sua mão por cima da mesa. A sua mão de gente, que dura pouco. Ela segura mesmo assim, como quem segura uma coisa que pode virar baú a qualquer momento e não se importa.');
    await say('Quando você voltar a ser baú, eu seguro a alça. Combinado?', 'lume');
    await say('Combinado.', 'me');
    await say('* Ela não solta a sua mão. Ela se inclina por cima da mesa, devagar, dando tempo de você fugir. Você não foge.');
    playMusic('ending'); QUADRO = { t: 0 }; await wait(30);
    await say('* E a Lume te beija. Ali, na calçada do Largo, entre duas xícaras de café e um pão de queijo queimado do lado esquerdo.');
    await say('* O seu rosto, que sempre derrete quando o fôlego acaba, não derrete. Pela primeira vez, ele fica. Como se tivesse decidido ficar.');
    await say('* Em cima do adereço dela, a chama sobe alta, dourada, e as velas da padaria acendem sozinhas, uma por uma.');
    await say('Eu disse que ia dizer no café. Não falei que ia ser com palavras.', 'lume');
    await say('Eu... eu sou um baú. Eu não tenho preparo emocional pra isso.', 'me');
    await say('Tem sim. Tá tudo guardado aí dentro. Eu vi.', 'lume');
    if (QUADRO) QUADRO.sai = 1; await wait(26);
    G.flags.c10Beijo = true;
  } else {
    await say('Eu terminei. Eu não sei pra quem ainda. ...Mentira. Eu sei. Eu só não sei dizer.', 'lume');
    await say('* Ela empurra o pé dela de leve no seu, por baixo da mesa. E deixa lá.');
    await say('Tem tempo. Agora tem tempo.', 'me');
  }
  G.flags.c10Cafe = true;
  await wait(20);
  await say(G.flags.c10Beijo ? '* Na esquina, encostada num poste, a Rita. Ela viu tudo. Ela fecha os olhos um segundo, respira, e sorri de lado. Um sorriso de verdade.' : '* Na esquina, encostada num poste, a Rita. Ela viu tudo. Ela sorri de lado.');
  await say(ritaP ? 'Eu prometi um café pra alguém aqui em cima. Lá embaixo, no 31, eu ensaiei trezentas vezes um "oi" e você roncou no primeiro. Tudo bem. Eu fui a primeira a ver você. Isso ninguém tira.' : 'Eu sentava duas fileiras na frente, no 31. Dois anos. Você nunca reparou. Tudo bem. Agora você repara em quem precisa reparar.', 'rita');
  await say('* Ela vem até a mesa, rouba um gole do seu café, devolve a xícara.');
  await say('O próximo é meu. Como amiga. Escudeira toma café com quem ela protege. Regra da Guilda.', 'rita');
  await say('Essa regra não existe.', 'lume');
  await say('Agora existe.', 'rita');
  save2();
}
