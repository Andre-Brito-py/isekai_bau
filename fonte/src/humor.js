// ================= HUMANIDADE E HUMOR =================
// Momentos que lembram que o baú já foi uma pessoa comum: ele cora, pensa besteira, tem vergonha do passado.

// ---------- corar: a tampa fica rosada e solta vapor ----------
function blush(t = 420) { WD.blush = t; sfx('blipTri', 1700); }
{ const _uw = updateWorld; updateWorld = function () { _uw(); if (WD.blush > 0) WD.blush--; }; }
{ const _dw = drawWorld; drawWorld = function () {
  _dw();
  if (!(WD.blush > 0) || V.scene !== 'world') return;
  const ox = Math.floor(WD.cx), oy = Math.floor(WD.cy), sx = WD.fx - ox, sy = WD.fy - oy, f = FRAME % 24;
  bx.globalAlpha = 0.6; bx.fillStyle = '#ff6b9a'; bx.fillRect(sx + 2, sy + 7, 4, 2); bx.fillRect(sx + 10, sy + 7, 4, 2); bx.globalAlpha = 1;
  bx.fillStyle = '#ffffff'; bx.fillRect(sx + 3, sy - 1 - Math.floor(f / 4), 2, 2); bx.fillRect(sx + 11, sy - 3 - Math.floor(((f + 12) % 24) / 4), 2, 2);
  txt('♥', sx + 13, sy - 12, { col: '#ff6b9a', shadow: true });
}; }

// ---------- pensamentos de gente, nas Lanternas ----------
const THOUGHTS = [
  [['Eu tenho saudade de coçar o nariz.| Eu não tenho nariz. Mas a saudade continua.', 'me']],
  [['Às vezes eu ainda tento pegar o celular no bolso.| Eu SOU o bolso.', 'me']],
  [['Será que alguém regou a minha planta? Era uma suculenta. O nome dela era Gerson.', 'me'], ['Você deu nome pra uma suculenta?', 'lume'], ['O Gerson merecia um nome.', 'me']],
  [['Lume, você acha que eu engordo se comer muita runa?', 'me'], ['Você é um baú. Você não engorda. Você fica... espaçoso.', 'lume']],
  [['Eu morri devendo trinta reais pro meu primo.| Espero que ele tenha esquecido.', 'me'], ['Ele não esqueceu.', 'lume'], ['Você nem conhece ele!', 'me'], ['Ninguém esquece trinta reais.', 'lume']],
  [['Eu nunca terminei aquele mangá. Agora eu vivo dentro de um. A ironia é enorme.', 'me']],
  [['Eu dobrava a roupa de qualquer jeito. Agora eu sou o lugar onde a roupa fica.| Me sinto julgado.', 'me']],
  [['Às vezes eu sonho que tenho mãos. Eu acordo e abro e fecho a tampa só pra conferir.', 'me'], ['...Isso foi triste, baú.', 'lume'], ['Eu sei. Desculpa. Pensa numa coisa engraçada.', 'me'], ['Você tem medo de cupim.', 'lume'], ['TODO MUNDO TEM MEDO DE CUPIM.', 'me']],
  [['Lume. Se eu fosse gente de novo, por um dia só, sabe o que eu ia fazer?', 'me'], ['Comer?', 'lume'], ['...Comer. É. Era isso mesmo.', 'me']],
  [['Eu fazia uma careta pra foto da carteirinha. Agora eu queria ter uma cara pra fazer careta.', 'me']]
];
{ const _l = lantern; lantern = async function () {
  await _l();
  if (!G.flags.introDone || Math.random() > 0.35) return;
  const seen = G.flags.thoughts || []; const left = THOUGHTS.map((t, i) => i).filter(i => !seen.includes(i) && (G.flags.lumeJoined || !THOUGHTS[i].some(([, w]) => w === 'lume')));
  if (!left.length) return;
  const i = pickOne(left); G.flags.thoughts = [...seen, i];
  for (const [t, w] of THOUGHTS[i]) await say(t, w);
}; }

// ---------- sprites ----------
function buildSpritesHumor() {
  SP.pavio = [0, 1].map(f => cv4(16, 16, r => {
    r(4, 5, 8, 11, 'k'); r(5, 6, 6, 9, '#f2e2c0'); r(5, 6, 6, 1, '#fff4dc'); r(4, 14, 8, 2, '#c8962a');
    r(6, 0 + f, 4, 6, 'k'); r(7, 1 + f, 2, 4, '#ffb040'); r(7, 2 + f, 2, 2, '#fff4c0'); r(5, 3, 1, 3, '#ffb040'); r(10, 3, 1, 3, '#ffb040');
    r(6, 8, 1, 1, 'k'); r(9, 8, 1, 1, 'k'); r(5, 7, 2, 1, 'k'); r(9, 7, 2, 1, 'k'); r(7, 11, 2, 1, '#c83838'); r(5, 10, 1, 1, '#ff9aaa'); r(10, 10, 1, 1, '#ff9aaa');
  }));
  SP.rita = [hum({ fem: true, S: '#c8905a', h: '#5a2a1a', m: '#5a2a1a', l: '#7a3a20', G: 'u' }), hum({ fem: true, S: '#c8905a', h: '#5a2a1a', m: '#5a2a1a', l: '#7a3a20', G: 'u' })];
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSpritesHumor(); }; }
WHO.pavio = { name: () => 'Madame Pavio', portrait: () => SP.pavio[0], voice: () => sfx('blipTri', 1100), col: '#fff0d0' };
WHO.rita = { name: () => 'Rita', portrait: () => SP.rita[0], voice: () => sfx('blip', 600) };
ITEMS.sache = { name: 'Sachê de Lavanda', hp: 40, cure: true, desc: 'Cura 40 PV e tira efeitos ruins. Deixa a tampa cheirando a gaveta de avó.' };

// ---------- cenas ----------
MAPS.mercado.ents.push({ id: 'pavio', kind: 'npc2', x: 25, y: 12, sp: 'pavio', talk: 'pavio', glow: 'rgba(255,200,120,0.2)' });
MAPS.achados.ents.push({ id: 'bilhete8', kind: 'npc2', x: 26, y: 1, sp: 'letter', talk: 'bilhete8', hide: 'bilhete8', float: true, glow: 'rgba(255,150,190,0.2)' });
MAPS.terminal.ents.push({ id: 'rita', kind: 'npc2', x: 24, y: 4, sp: 'rita', talk: 'rita' });
Object.assign(STORY, {
  async pavio() {
    const f = G.flags;
    if (f.pavioMet) { blush(200); await say(pickOne(['Voltou, docinho? Cuidado pra não derreter perto de mim.', 'Essa dobradiça brilhando... você passou óleo, foi?', 'Se precisar de luz, é só chamar. Eu ilumino qualquer ambiente.']), 'pavio'); return; }
    f.pavioMet = true;
    await say('* Atrás de uma banca de velas, uma vela alta e elegante, de cera cor de mel. A chama dela parece um penteado.');
    await say('Ora, ora. Um baú de madeira de lei. Faz tempo que não aparece um móvel tão bem acabado no meu mercado.', 'pavio');
    blush();
    await say('* A sua tampa esquenta. Muito. Sai um vapor fininho das dobradiças.');
    await say('Eu... é... obrigado? Eu sou... de madeira. É. Isso aí. Madeira.', 'me');
    await say('Você tá CORANDO?', 'lume');
    await say('Baú não cora!', 'me');
    await say('Você tá da cor de goiaba.', 'lume');
    await say('Madame Pavio, encantada. Vendo velas, luz e conselhos amorosos. O último é de graça.', 'pavio');
    await say('Conselho: quando gostar de alguém, fala. A vida é curta. A cera, mais ainda.', 'pavio');
    await say('Eu morri antes de aprender a falar com mulher.| Agora eu sou um baú. Não melhorou.', 'me');
    await say('Ah, docinho. Ninguém aprende. A gente só vai ficando corajoso.', 'pavio');
    giveItem('vela', 2); sfx('item');
    await say('* Madame Pavio te dá {y}Vela Doce{/} ×2. "Por conta da casa. Pela cor de goiaba."');
  },
  async bilhete8(e) {
    if (G.flags.bilhete8) return;
    G.flags.bilhete8 = true; sfx('item');
    await say('* Um bilhete dobrado em forma de coração, com a etiqueta "ÔNIBUS 31 — Nº 31".');
    await say('* Lá dentro, com letra de oitava série: "Quer sair comigo? ( ) sim ( ) não ( ) talvez".');
    blush();
    await say('Não.| Não, não, não. Isso NÃO é meu.', 'me');
    await say('Tem o seu número na etiqueta.', 'lume');
    await say('É de OUTRO número trinta e um.', 'me');
    await say('Tem um nome riscado aqui embaixo. Começa com J...', 'lume');
    await say('LUME.', 'me');
    await say('Eu vou anotar isso.', 'of');
    await say('NINGUÉM VAI ANOTAR NADA.', 'me');
    await say('* Silêncio. A Lume dobra o bilhete com cuidado.');
    await say('...Você nunca entregou?', 'lume');
    await say('Eu tinha treze anos e muito medo de "não".', 'me');
    await say('E se fosse "sim"?', 'lume');
    await say('Aí eu ia ter que falar com ela.| Pior ainda.', 'me');
  },
  async rita() {
    const f = G.flags;
    if (!f.ritaMet) {
      f.ritaMet = true;
      await say('* No guarda-volumes da rodoviária, uma mulher de cabelo preso e armadura sem brasão organiza malas perdidas.');
      await say('* Ela tira a mochila de um herói de cima de você e te olha de cima a baixo.');
      await say('Que mala bonita. Madeira boa. Ferragem caprichada.| Quem foi o idiota que esqueceu você aqui?', 'rita');
      blush();
      await say('* A sua tampa faz um barulhinho involuntário. Tipo uma chaleira.');
      await say('...Oi.', 'me');
      await say('* Ela dá um pulo para trás e quase derruba uma pilha de malas.');
      await say('Você FALA?', 'rita');
      await say('Ele fala, ele morde e ele cora. É um pacote completo.', 'lume');
      await say('Rita. Ex-escudeira de Auren. Larguei a lança quando mandaram queimar um ninho de cogumelos com os filhotes dentro.', 'rita');
      await say('Agora eu cuido das malas e escondo quem precisa fugir. Inclusive bagagem falante, pelo jeito.', 'rita');
      return;
    }
    if (!f.dateDone) {
      if (!f.dateAsk) {
        f.dateAsk = true;
        await say('Psiu. Baú. Vem cá.', 'lume');
        await say('Eu falei com a Rita. Ela topou tomar um café com você. Nos bancos da plataforma 4.', 'lume');
        await say('VOCÊ O QUÊ?', 'me');
        await say('Um encontro, baú. A gente tá no meio de uma guerra, todo mundo vai morrer de novo, você merece UM café.', 'lume');
      }
      const c = await choose('* Ir ao encontro com a Rita?', ['Ir (com o coração na tampa)', 'Ainda não estou pronto'], 'n', 1);
      if (c !== 0) { await say('Covarde. Mas um covarde fofo.', 'lume'); return; }
      await STORY.encontro();
      return;
    }
    await say(f.ritaPromise ? pickOne(['Ainda tá de pé o pastel, hein. Quando você tiver um rosto.', 'Se cuida lá embaixo, mala falante.']) : pickOne(['Amigos de bagagem, né? Combinado.', 'Precisa guardar alguma coisa? Eu guardo. Inclusive segredo.']), 'rita');
  },
  async encontro() {
    playMusic('terminal');
    await say('* Plataforma 4. Dois copinhos de café de máquina. Você não tem como segurar o seu. A Rita segura os dois.');
    let clima = 0;
    const meter = () => `[Clima do encontro: ${'♥'.repeat(Math.max(0, clima))}${clima <= 0 ? '...' : ''}]`;
    await say('E aí. O que um baú faz pra se divertir?', 'rita');
    let c = await choose('* O que você responde?', ['"Eu guardo coisas. Sou ótimo nisso."', '"Eu como runas. É tipo sushi."', '(Ficar em silêncio)']);
    if (c === 0) { clima += 1; await say('Ótimo currículo. Eu guardo malas. A gente tem muito em comum.', 'rita'); }
    else if (c === 1) { clima += 2; await say('* Rita ri tanto que o café sai pelo nariz.'); await say('Sushi! Que nojo. Me conta mais.', 'rita'); }
    else { await say('Fala ALGUMA coisa!', 'lume'); await say('* Você abre a tampa e fecha de novo. Com som.'); await say('...Isso foi um sim?', 'rita'); }
    sfx('catalog'); await say(meter(), 'cat');
    await say('Você era gente antes, né? Do que você gostava?', 'rita');
    c = await choose('* O que você responde?', ['"Mangá. E pastel de feira."', '"Dormir. Eu era excelente em dormir."', '"Eu fazia academia." (mentira)']);
    if (c === 0) {
      clima += 2;
      if (G.flags.mem_pastel) { await say('Pastel. Eu... não lembro o gosto. Eu sei que gostava. Me disseram.', 'me'); await say('* A Rita para de sorrir por um segundo.'); await say('Então um dia eu te pago um. E você me conta se lembrou.', 'rita'); clima += 1; }
      else await say('Pastel de queijo ou de carne?', 'rita');
    } else if (c === 1) { clima += 1; await say('Respeito. Eu não durmo desde que larguei a lança.', 'rita'); }
    else { clima -= 1; await say('MENTIRA.', 'lume'); await say('Você não tem braço.', 'rita'); await say('...Eu fazia academia de dedo. No celular.', 'me'); }
    sfx('catalog'); await say(meter(), 'cat');
    await say('Posso fazer uma pergunta estranha? Como é aí dentro?', 'rita');
    c = await choose('* Ela quer olhar dentro da sua tampa.', ['"Fica à vontade!"', '"É um pouco cedo pra isso."', '(Morder de leve, por reflexo)']);
    if (c === 0) { clima += 1; await say('* Ela abre a sua tampa com cuidado. Lá dentro: três runas, uma pena do Escriba e uma meia.'); await say('Por que tem uma meia aqui?', 'rita'); await say('Eu não sei. Ela aparece. Toda manhã. Eu não tenho pé.', 'me'); }
    else if (c === 1) { clima += 2; await say('* A Rita gargalha.'); await say('Um baú de respeito. Gostei.', 'rita'); }
    else { clima -= 2; await say('* NHAC. Bem de leve. No dedão.'); await say('AI!', 'rita'); await say('DESCULPA! É reflexo! Eu juro que é reflexo!', 'me'); await say('...Tá. Foi meio engraçado.', 'rita'); }
    sfx('catalog'); await say(meter(), 'cat');
    await say('Esse foi o encontro mais esquisito da minha vida.| E eu já saí com um bardo.', 'rita');
    G.flags.dateDone = true; G.flags.dateScore = clima;
    if (clima >= 5) {
      G.flags.ritaPromise = true; blush(600);
      await say('* Ela se abaixa e dá um beijinho rápido na sua tampa. Bem na fechadura.');
      await say('Quando você arranjar um rosto, me procura. O pastel é por minha conta.', 'rita');
      await say('* Você não consegue falar nada. Você só solta vapor.');
      await say('Ele travou. Acho que você quebrou ele.', 'lume');
    } else if (clima >= 2) {
      blush(300);
      await say('Foi bom, mala falante. Sério. Fazia tempo que eu não ria.', 'rita');
    } else await say('Vamos ser amigos. Amigos de bagagem. Combinado?', 'rita');
    giveItem('sache', 2); sfx('item');
    await say('* A Rita enfia dois sachês de lavanda na sua tampa. "Pra tirar o cheiro de pólvora." Você recebeu {y}Sachê de Lavanda{/} ×2.');
    await say('Eu tô corado? Baú cora?', 'me');
    await say('Cora. Você tá cor de goiaba de novo.', 'lume');
  }
});

// ---------- na batalha: a primeira Clériga ----------
{ const _pt = playerTurn; playerTurn = async function () {
  if (!G.flags.blushCleric && BT.en.some(e => e.alive && (e.id === 'cleric' || e.id === 'clericM'))) {
    G.flags.blushCleric = true;
    await bSay('* A Clériga ajeita o cabelo antes de rezar. A sua tampa esquenta. Muito.');
    await bSay('Baú. BAÚ. Ela tá rezando pra você MORRER.', { col: '#ffe066' });
    await bSay('Eu sei. Ela reza bonito.', { col: '#ffffff' });
  }
  return _pt();
}; }
