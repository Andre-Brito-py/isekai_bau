// ===== O Cavaleiro Sem Nome: o que ele guardava e por que a luz o prendia (v2.6) =====
// Ele era um Farol da Coroa. Há trezentos anos desceu para levar as doze lanternas da Viagem nº 2 (a carruagem da
// Ofélia) escada acima, até Auren. No meio da escada parou, ouviu o que havia dentro delas e voltou. A Ofélia afogou
// a sala; ele trancou a porta da escada com o próprio nome. Os Faróis não o tiraram de lá e o muraram em luz.
// Pistas (sem nome): o recibo "Viagem nº 2" assinado com a lanterna com um olho; as lanternas presas no âmbar.

function knightDoorSp() {
  const fr = [];
  for (let f = 0; f < 2; f++) {
    const c = mk(16, 16), x = c.getContext('2d');
    x.fillStyle = '#120e1a'; x.fillRect(3, 0, 10, 16);
    x.fillStyle = '#3a3448'; x.fillRect(4, 1, 8, 15);
    x.fillStyle = '#5a5070'; x.fillRect(4, 1, 8, 1); x.fillRect(4, 1, 1, 15); x.fillRect(11, 1, 1, 15);
    x.fillStyle = '#2a2436'; for (let y = 4; y < 16; y += 4) x.fillRect(5, y, 6, 1);
    x.fillStyle = f ? '#ffd070' : '#f0a030'; x.fillRect(7, 3, 2, 12);            // fresta de âmbar
    x.fillStyle = f ? '#fff0b0' : '#ffd070'; x.fillRect(7, 6 + f * 3, 2, 2);
    x.fillStyle = '#8a8099'; x.fillRect(10, 8, 1, 2);                              // tranca
    fr.push(c);
  }
  return fr;
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); SP.knightDoor = knightDoorSp(); }; }

MAPS.muralhas.ents.push({ id: 'knightDoor', kind: 'npc2', x: 25, y: 2, sp: 'knightDoor', cond: 'knightDone', talk: 'knightDoor', glow: 'rgba(255,190,80,0.2)' });
ENEMIES.knight.flavor = ['* A armadura é de outro século. Dentro dela não tem ninguém.', '* Ele luta de costas para a parede. Nunca dá um passo para longe dela.', '* No peito dele, um brasão raspado a faca.'];

Object.assign(STORY, {
  async knight() {
    if (G.flags.knightDone) return;
    if (!G.flags.knightSeen) {
      G.flags.knightSeen = true;
      await say('* Uma armadura antiga, de outro século, ajoelhada no chão da sala. A lança está fincada na pedra, como uma tranca.');
      await say('* Quando a luz da Lume chega perto, o elmo se ergue de uma vez.');
      await say('LUZ. Então voltaram.| Podem dizer à Coroa que a resposta continua sendo não.', 'knight');
      await say('Eu sou um LUSTRE. Ninguém me manda a lugar nenhum.', 'lume');
      await say('* O Cavaleiro se inclina e examina a Lume bem de perto. Depois examina você.');
      await say('...Um lustre e um baú. Perdão. Faz tempo que não recebo visita que não queira me queimar.', 'knight');
      await say('O que você tá fazendo aqui?', 'me');
      await say('Guardando uma porta.', 'knight');
      await say('Que porta? Atrás de você só tem parede.', 'me');
      await say('É uma porta. Ela só não lembra disso. Eu tranquei com o meu nome, e o meu nome foi junto.', 'knight');
      await say('Por isso ninguém sabe como eu me chamo. Nem eu.| Preço justo. Era um nome feio, se não me engano.', 'knight');
      await say('Uma bibliotecária me pediu. Tinta nos dedos, voz de quem manda sem pedir.| "Só esta noite", ela disse.', 'knight');
      await say('Diga, baú. A noite já passou?', 'knight');
      await say('...Acho que passou, sim.', 'me');
      await say('* O Cavaleiro olha para a parede de luz por onde vocês entraram.');
      await say('Os homens do farol vieram buscar o que está atrás desta porta. Não conseguiram me tirar daqui.', 'knight');
      await say('Então ergueram a luz em volta de mim. Se eles não podiam passar, ninguém mais passaria.| Luz prendendo um guarda. Tem sua graça.', 'knight');
      await say('E o que tem atrás da porta?', 'lume');
      await say('Uma escada. E, na escada, uma conta que alguém ainda acha que vai receber.', 'knight');
      await say('Se quiserem ver, vão ter que me tirar daqui. Eu jurei.| Juramento é a única coisa que enferruja devagar.', 'knight');
    } else await say(pickOne(['Ainda de pé, baú? Eu também. É o que eu faço de melhor.', 'A porta continua fechada. Eu continuo aqui. Nada mudou em trezentos anos, não vai mudar hoje.', 'Volte quando estiver pronto. Eu tenho tempo. Muito tempo.']), 'knight');
    const c = await choose('* O Cavaleiro arranca a lança da pedra. Lutar? (Chefe opcional muito forte.)', ['Lutar', 'Voltar depois'], 'n', 1);
    if (c !== 0) return;
    const r = await battle(['knight'], { boss: true, music: 'boss3', noFlee: false, intro: '* O Cavaleiro Sem Nome se levanta!' });
    if (r !== 'win') return;
    G.flags.knightDone = true; refreshEnts();
    await say('* A armadura cai de joelhos. A lança racha ao meio, e a parede atrás dele solta um estalo, como uma tranca girando.');
    await say('...Ofélia...| me desculpa... eu dormi...', 'knight');
    await say('...Não. Eu não dormi.| Eu fiquei. Diga a ela que eu fiquei.', 'knight');
    await say('* Ele bate duas vezes no peito, onde ficaria um brasão. Depois se desfaz em ferrugem.');
    await say('* No lugar dele, ficam um tinteiro de âmbar e uma fita de biblioteca, desbotada.');
    giveItem('eter', 2); giveItem('pastel', 1); G.flags.knightRibbon = true; sfx('item');
    await say('* Você recebeu {y}Éter de Lustre{/} ×2, {y}Pastel Fantasma{/} e a {y}Fita da Bibliotecária{/}.');
    shake(10); sfx('gate');
    await say('* Na parede, onde antes não havia nada, agora existe uma porta estreita de ferro. Pela fresta escapa uma luz cor de âmbar.');
    await say('Ofélia... tinha um cavaleiro?', 'me');
    await say('Acho que a gente não conhece a Ofélia tão bem quanto pensa.', 'lume');
    if (G.flags.ofeliaAway && !G.flags.ribbonTold) { await say('* Dentro da sua tampa, de repente, faz muito frio.'); await STORY.knightOfelia(); }
    await checkEvo();
  },
  async knightDoor() {
    if (G.flags.knightStair) { await say(pickOne(['* A escada sobe até a parede de âmbar. As doze lanternas continuam lá dentro, em fila, esperando.', '* O recibo continua pregado no primeiro degrau. Ninguém veio buscar a entrega.']));
      if (G.flags.knightRibbon && !G.flags.ribbonTold) await say('Talvez a Ofélia devesse ver a fita.', 'lume');
      return; }
    G.flags.knightStair = true; G.flags.lore_recibo = true; sfx('gate');
    await say('* A porta abre sem chave. Do outro lado, uma escada estreita sobe. E sobe. E sobe.');
    await say('* Lá no alto, onde deveria haver céu, a escada termina numa parede de âmbar maciço, morna como pão.');
    await say('* Dentro do âmbar, presas como insetos, há lanternas apagadas. Dá para contar: doze. Em fila, como uma procissão que parou no meio do caminho.');
    await say('Uma escada pra cima... Pra superfície?', 'me');
    await say('Pra Auren.| E esse âmbar... tem a mesma cor das Lanternas onde a gente descansa.', 'lume');
    await say('* No primeiro degrau, um papel amarelado, pregado com um cravo de ferradura. A tinta quase sumiu.');
    await say('* "RECIBO DE ENTREGA. Viagem nº 2. Doze lanternas, cheias. Recebidas pela Coroa, com gratidão."');
    await say('* Não há assinatura. Só o desenho de uma lanterna com um olho no meio.');
    await say('Diz "recebidas". Mas elas estão todas aqui.', 'me');
    await say('Alguém escreveu o recibo antes da entrega.| E a entrega nunca chegou.', 'lume');
    await say('Viagem número DOIS. Então teve uma número um.', 'me');
    await say('E doze lanternas cheias.| Cheias de quê?', 'lume');
    await say('* Ninguém responde. Ao lado do recibo, o elmo do Cavaleiro. Por dentro, riscado à ponta de faca, o mesmo desenho: a lanterna com o olho.');
    await say('* Riscado tantas vezes que quase atravessou o metal.');
    await say('O mesmo brasão dos Portadores de Farol. Ele era um deles.', 'me');
    await say('Era. Até descobrir o que estava carregando.', 'lume');
    await say('...Ele não guardava a porta pra ninguém descer.| Guardava pra nada SUBIR.', 'lume');
    await say('* A parede de âmbar estala baixinho, como gelo num copo. Lá em cima, alguma coisa parece prestar atenção.');
    await say('Vamos embora. Agora.', 'lume');
    if (G.flags.ofeliaAway) await say('Fecha essa porta, @.| Por favor.', 'of');
  },
  async knightOfelia() {
    G.flags.ribbonTold = true;
    await say('* Você mostra a {y}Fita da Bibliotecária{/}. Ofélia olha para ela como quem olha uma foto antiga.');
    await say('A gente achou isso com um cavaleiro. Ele chamava o seu nome.', 'me');
    await say('Ele ainda estava lá. Na porta.|.|.| Eu mandei ele esperar, e ele esperou.', 'of');
    await say('Fiel até a ferrugem. Era o jeito dele.', 'of');
    await say('Quem era ele, Ofélia?', 'lume');
    await say('Um Farol. Desceu com a Coroa, há trezentos anos, para levar as lanternas da minha viagem lá pra cima.', 'of');
    await say('Ele subiu a escada com a primeira no colo. No meio do caminho, parou. Ficou um tempão ouvindo a lanterna.', 'of');
    await say('Ouvindo o quê?', 'me');
    await say('Ele nunca me contou. Desceu de volta, bem devagar, e me perguntou qual era a porta mais difícil de abrir aqui embaixo.', 'of');
    await say('Eu afoguei a sala. Ele segurou a escada. Era pra ser uma noite, até eu pensar em coisa melhor.', 'of');
    await say('Eu não pensei em coisa melhor.', 'of');
    if (G.flags.knightStair) {
      await say('Vocês subiram, não foi? Viram o recibo.', 'of');
      await say('Não me perguntem de quem é a lanterna desenhada nele. Eu passei trezentos anos sem querer saber.', 'of');
      await say('Só sei que a mão que assinou aquilo não tremia.| Nem naquela época, nem agora.', 'of');
    }
    await say('...Teodoro. O nome dele era Teodoro. Ele odiava. Dizia que era nome de cavalo de carroça.', 'of');
    await say('Ele esqueceu o próprio nome para trancar aquela porta.| Eu não esqueci.', 'of');
    await say('* Ofélia amarra a fita no pulso, com cuidado. Depois volta a ser sarcástica, como se nada tivesse acontecido.');
  }
});
// se a fita ficou para depois, a Ofélia ouve a história na biblioteca
{ const _ol = STORY.ofeliaLib; STORY.ofeliaLib = async function (e) { if (G.flags.ch4done && G.flags.knightRibbon && !G.flags.ribbonTold) return STORY.knightOfelia(); return _ol.call(this, e); }; }

// na luta, as lembranças voltam aos pedaços
{ const _ak = AI.knight; AI.knight = async function (e) {
  if (!e.k50 && e.hp <= e.mhp * 0.5) {
    e.k50 = true; e.phase = 2; shake(24); sfx('rumble');
    await bSay('...Ela ria das minhas rimas. Todas ruins.', { col: '#e0c0c0' });
    await bSay('* A ferrugem cai do elmo. Por um instante, dá para ver um brasão raspado no peito dele.', { auto: 60 });
    return;
  }
  if (!e.k20 && e.hp <= e.mhp * 0.2) {
    e.k20 = true;
    await bSay('A ESCADA NÃO SOBE. Não enquanto eu estiver de pé!', { col: '#ffb0b0', fx: 'shake' });
    return runMove(e, { k: 'seq', n: 7, p: 0.5, spd: 1.3, pierce: true, t: '* JURAMENTO DE FERRUGEM! A lança gira como uma tranca!', fx: 'shake' });
  }
  return _ak(e);
}; }
