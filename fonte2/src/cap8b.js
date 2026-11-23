// ================= CAPÍTULO 8 — Parte 2: AS CISTERNAS e A FRIAGEM =================
// A fonte do Largo racha: uma escada desce para as CISTERNAS de Auren. Salão dos canais (braseiros, sombras), o Seu Tomé
// (o cisterneiro) procura a filha NINA, que foi atrás de um gato. SALÃO DE GELO 1 (escorrega; braseiros derretem) ->
// a câmara da Nina -> ESCOLTA de volta pelo corredor escuro (a grade só abre por dentro) -> o pai abre a COMPORTA ->
// SALÃO DE GELO 2 -> a descida -> O CORAÇÃO FRIO: A FRIAGEM (chefe). Depois: a fita na gaiola (segredo do jogo), a Lume
// sem chama, o povo de Auren com as velas, a EVOLUÇÃO DA LUME, o amanhecer; na torre, o Acendedor-Mor fecha o caderno.
// Voltas: velas da Igreja do Sino (Velhágua), lampiões de Candeia, velas de âmbar da Cidade Alta.
const CI8 = POS8.cisternas, FR8 = POS8.friagem8;
Object.assign(HUMS, {
  tome: { h: 52, skin: '#8a5a3a', hair: '#2a1a1a', top: '#3a5a6a', bottom: '#2a2a2a', hat: '#5a4a3a' },
  nina: { h: 32, skin: '#c8906a', hair: '#3a2a1a', hairStyle: 'longo', top: '#e86a8a', bottom: '#5a3a5a' }
});
Object.assign(WHO, {
  tome: { name: () => 'Seu Tomé', portrait: () => portHum('tome'), voice: voz(260, 'blipLow'), col: '#d8e8f0' },
  nina: { name: () => 'Nina', portrait: () => portHum('nina'), voice: voz(760), col: '#ffd8e8' }
});
BRAZ8 = Object.assign({}, ...Object.entries(CI8.gelo1.braz).map(([k, v]) => ({ ['g1' + k]: v })), ...Object.entries(CI8.gelo2.braz).map(([k, v]) => ({ ['g2' + k]: v })));
{ const _mm8b = montarMapas2; montarMapas2 = function () {
  _mm8b.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  const brasC = (id, [x, y], derrete) => ({ t: 'sign', id: 'bras8_' + id, x, y, h: 30, spr: () => braseiroArt(!!(derrete ? gelo8()[id] : (luz8().cisternas || []).includes(id)), Math.floor(W2.t / 6)), get luz() { return (derrete ? gelo8()[id] : (luz8().cisternas || []).includes(id)) ? 76 : 0; }, talk: () => acenderCisterna(id, derrete) });
  MAPS2.cisternas = { rows: ROWS8.cisternas, key: KEY8, name: 'Auren · As Cisternas', music: 'inverno', batBg: bgCisternas, bg: '#060a10', semCeu: true, dark: 'rgba(4,8,14,0.72)', get lights() { return luzLume8(); },
    props: [
      { img: () => gradeArt(!!G.flags.c8Grade), x: CI8.grade[0][0], y: CI8.grade[0][1] + 1.5, by: (CI8.grade[0][1] - 1) * TS, get solid() { return G.flags.c8Grade ? [] : [[CI8.grade[0][0], CI8.grade[0][1], 2, 1]]; } },
      { img: () => comportaArt(!!G.flags.c8Comporta), x: CI8.comporta[0][0] - 0.1, y: CI8.comporta[0][1] + 1.5, by: (CI8.comporta[0][1] - 1) * TS, get solid() { return G.flags.c8Comporta ? [] : [[CI8.comporta[0][0], CI8.comporta[0][1], 1, 1]]; } },
      ...[[14, 2], [24, 9], [37, 2], [50, 9], [30, 28], [46, 31]].map(([x, y]) => ({ img: caroçoGeloArt, x: x - 0.1, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    ents: [
      ...CI8.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('largo', ...escadaLargo(), 'down'); await fadeIn(10); } })),
      ...CI8.canalBraz.map((p, i) => brasC('c' + i, p, false)),
      ...CI8.escuroBraz.map((p, i) => brasC('e' + i, p, false)),
      ...Object.entries(BRAZ8).map(([k, p]) => brasC(k, p, true)),
      morador('tome', ...CI8.pai, { dir: 'down', gone: () => !!G.flags.c8Fim, talk: falaTome }),
      morador('nina', ...CI8.nina, { dir: 'down', gone: () => !!G.flags.c8Nina || escAtivo('nina'), talk: falaNina }),
      { t: 'sign', x: CI8.alavancaGrade[0], y: CI8.alavancaGrade[1], h: 26, spr: () => alavancaArt(G.flags.c8Grade ? 1 : 0), talk: async () => { if (G.flags.c8Grade) return; G.flags.c8Grade = true; sfx('door'); V.shake = 4; await say('* A alavanca range. Lá no fim do corredor escuro, uma grade de ferro sobe. O caminho de volta, sem gelo.'); } },
      marcoEnt(...CI8.marco),
      ...CI8.bau.map(([x, y], i) => bauEnt('cisternas', 'b' + i, x, y, async () => { if (i) { G.velas = (G.velas || 0) + 3; await say('* Dentro: {y}3 velas{/}.'); await dar('frasco', 1); } else { await dar('pluma', 1); await dar('cobres', 90); } })),
      inimigo('cf1', 'friagem', ...CI8.foes[0], ['friagem', 'geadaViva'], { spr: (t) => friagemArt(Math.floor(t / 10) % 2), h: 30, bg: bgCisternas }),
      inimigo('cf2', 'loboFuligem', ...CI8.foes[1], ['loboFuligem', 'loboFuligem'], { spr: (t, d) => { const c = loboFuligemArt(Math.floor(t / 7) % 2); return d === 'left' ? flipC(c) : c; }, h: 24, bg: bgCisternas }),
      inimigo('cf3', 'geadaViva', ...CI8.foes[2], ['geadaViva', 'geadaViva', 'friagem'], { spr: (t) => geadaVivaArt(Math.floor(t / 6) % 8), h: 30, bg: bgCisternas }),
      inimigo('cf4', 'friagem', ...CI8.foes[3], ['friagem', 'loboFuligem', 'geadaViva'], { spr: (t) => friagemArt(Math.floor(t / 10) % 2), h: 30, bg: bgCisternas }),
      ...CI8.descida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; await fadeOut(14); loadMap2('friagem8', ...FR8.entra, 'up'); await fadeIn(14); if (MAPS2.friagem8.onEnter) await MAPS2.friagem8.onEnter(); } }))
    ],
    onEnter: async () => { if (!G.flags.c8Cist) { G.flags.c8Cist = true; await say('* As Cisternas de Auren. Arcos de pedra, canais de água preta e, por cima de tudo, uma crosta de gelo que estala como osso.'); await say('* O frio aqui embaixo não é de inverno. É mais velho. Tem cheiro de casa fechada há muito tempo.'); await say('[Braseiros: aqui embaixo pegam a qualquer hora (não tem vento). No GELO se escorrega até bater; braseiro aceso derrete o gelo em volta.]', 'cat'); } }
  };
  MAPS2.friagem8 = { rows: ROWS8.friagem8, key: KEY8, name: 'As Cisternas · O Coração Frio', music: 'inverno', batBg: bgCoracaoFrio, bg: '#04080e', semCeu: true, dark: 'rgba(6,10,18,0.45)', get lights() { return luzLume8(); },
    props: [],
    ents: [
      ...FR8.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; await fadeOut(10); loadMap2('cisternas', CI8.descida[0][0], CI8.descida[0][1] - 1, 'up'); await fadeIn(10); } })),
      ...FR8.frente.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c8Friagem, run: lutaFriagem }))
    ],
    onEnter: async () => { if (!G.flags.c8Coracao) { G.flags.c8Coracao = true; await say('* O Coração Frio. Uma câmara redonda, de gelo do chão ao teto. No meio, uma coisa sentada. Um manto de neve do tamanho de uma casa, de costas.'); await say('* Ela respira. Cada vez que ela solta o ar, lá em cima, em Auren, mais uma janela congela.'); } }
  };
  grade(MAPS2.cisternas);
  // a escada no Largo (aparece na Parte 2)
  const L = MAPS2.largo; if (L && !L._cist8) { L._cist8 = true; const [x, y] = escadaLargo(); L.ents.push({ t: 'trig', x, y: y + 1, w: 1, h: 1, passa: true, gone: () => !G.flags.c8P1, run: async () => { W2.mv = null; if (!ehNoite() && !G.flags.c8Cist) await say('* A escada de gelo debaixo da fonte rachada.'); sfx('door'); await fadeOut(12); loadMap2('cisternas', ...CI8.entra, 'down'); await fadeIn(12); if (MAPS2.cisternas.onEnter) await MAPS2.cisternas.onEnter(); } }); L.props.push({ img: caroçoGeloArt, x: x - 0.1, y: y + 1, get by() { return G.flags.c8P1 ? (y + 1) * TS : -9999; } }); }
  // a escolta da Nina (dentro das Cisternas): a volta pelo corredor escuro
  montaEscolta('nina', { nm: 'Nina', hum: 'nina', who: 'nina', map: 'cisternas', at: CI8.nina, dest: { map: 'cisternas', at: CI8.pai, r: 2 }, destNm: 'o pai dela', fala: 'Vocês vieram me buscar? O gato fugiu pro gelo e eu fui atrás. Agora eu não acho a volta. Tá muito escuro lá.', chegou: chegouNina });
  // voltas: Igreja do Sino (Velhágua)
  const Ig = MAPS2.igreja; if (Ig && !Ig._c8) { Ig._c8 = true; const p = chaoLivre8(Ig, 6, 6) || [6, 6]; Ig.ents.push({ t: 'sign', x: p[0], y: p[1], h: 20, spr: () => velaChaoArt(Math.floor(W2.t / 8)), gone: () => !c8Ativo() || !!G.flags.c8VelasVelhagua, talk: velasIgreja }); }
}; }
function escadaLargo() { const L = MAPS2.largo; if (L && L._esc8) return L._esc8; const p = (L && chaoLivre8(L, 20, 21)) || [20, 21]; if (L) L._esc8 = p; return p; }
async function acenderCisterna(id, derrete) {
  const aceso = derrete ? gelo8()[id] : (luz8().cisternas || []).includes(id);
  if (aceso) { setChama(chama() + 20); W2.toast = { s: 'A Lume se aquece. Chama ' + Math.round(chama()), t: 0 }; return; }
  const custo = G.flags.c8Lampiao ? 15 : 25, vela = (G.velas || 0) > 0;
  if (!vela && chama() < custo) { await say('Tô sem chama. Uma vela, ou um fogo pra esquentar...', 'lume'); return; }
  if (vela) G.velas--; else setChama(chama() - custo);
  sfx('rune');
  if (derrete) { gelo8()[id] = true; W2.toast = { s: 'Fsssss... o gelo em volta derrete.', t: 0 }; if (!G.flags.tutDerrete8) { G.flags.tutDerrete8 = true; await say('O gelo derreteu em volta do fogo! Ali dá pra parar sem escorregar.', 'rita'); } }
  else { (luz8().cisternas = luz8().cisternas || []).push(id); W2.toast = { s: 'O braseiro acende.', t: 0 }; }
}
async function falaTome() {
  if (G.flags.c8Nina) { await say(G.flags.c8Friagem ? 'A Nina não larga o gato. Nem eu largo a Nina. Obrigado, mala. Obrigado, moças.' : pickOne(['A comporta tá aberta. O frio vem lá de baixo, do Coração Frio, onde a água para de andar. Cuidado.', 'Eu trabalho aqui faz vinte anos. Nunca vi esse gelo. Nunca.']), 'tome'); return; }
  if (!G.flags.c8Tome) {
    G.flags.c8Tome = true;
    await say('* Um homem de capa de oleado, com uma lanterna de cisterneiro apagada, andando de um lado para o outro na frente de uma comporta de ferro.');
    await say('A Nina! A minha filha! Ela foi atrás do gato e entrou no gelo, pelo lado de lá, pela passagem da esquerda! Eu tentei ir e escorreguei até o fim da sala e voltei batendo a cabeça.', 'tome');
    await say('O gelo escorrega até bater. Tem braseiro velho lá dentro, do tempo que as cisternas tinham vigia. Se acender, o gelo derrete em volta.', 'tome');
    await say('E essa comporta?', 'rita');
    await say('Dá pro Coração Frio. De onde o frio vem. Eu tenho a chave. Mas sem a Nina eu não abro nada.', 'tome');
    return;
  }
  await say('Pela passagem da esquerda. Pelo gelo. A Nina, por favor.', 'tome');
}
async function falaNina() {
  if (!G.flags.c8NinaAchou) { G.flags.c8NinaAchou = true; await say('* Uma menina de casaco cor-de-rosa, sentada no chão abraçada num gato cinza e magro, no fim de uma câmara escura.'); await say('O Fumaça! Eu achei o Fumaça! Mas agora eu não acho o caminho. E tem coisa andando no escuro.', 'nina'); await say('[A volta sem gelo é pelo CORREDOR ESCURO da esquerda: puxe a alavanca da grade. Acenda os braseiros do caminho antes, ou ela vai ter medo.]', 'cat'); }
  return pedirEscolta('nina');
}
async function chegouNina() {
  G.flags.c8Nina = true; G.flags.c8Comporta = true; sfx('door');
  await say('* A Nina larga o gato e se joga no pai. O gato, ofendido, sobe nos ombros da Rita.');
  await say('Vocês trouxeram ela. No escuro. Pela luz. Tomem.', 'tome');
  await say('* O Seu Tomé gira a chave grande na comporta. A comporta range e sobe. Do outro lado, mais gelo, e o vento frio vindo de baixo.');
  await say('Quando eu era menina, no Inverno, eu tinha uma lanterna de procissão. Rosa. Eu levei ela pra cá, uma vez, e perdi. O pai disse que o frio comeu.', 'nina');
  save2();
}
async function lutaFriagem() {
  if (G.flags.c8Friagem) return; W2.mv = null;
  await say('* A Friagem se vira. O capuz é um buraco. Dois pontos de geada lá dentro olham para a Lume, e só para ela.');
  await say('Ela tá olhando pra mim.', 'lume');
  await say('Ela tá olhando pra luz. É o que ela não tem.', 'me');
  const r = await lutaMapa(['friagemB'], { bg: bgCoracaoFrio, music: 'boss', pos: [[180, 184]], intro: async () => { const e = BT.foes[0]; e.phases = fasesFriagem(); e.ct = 14; callout('A FRIAGEM', '#bff0ff', 100); } });
  if (r !== 'win') return;
  G.flags.c8Friagem = true;
  await cenaFim8();
}
async function cenaFim8() {
  playMusic(null);
  await say('* A Friagem desmancha. Não morre: desmancha, como neve no sol, devagar, sem barulho. O manto vira água. O capuz vira vapor.');
  await say('* No chão, sobra a gaiola de lanterna, aberta. E presa na grade, a fita de cabelo cor-de-rosa, dura de gelo.');
  await say('* A Lume se abaixa para pegar a fita. E cai.');
  playMusic('perda');
  await say('Lume? LUME!', 'rita');
  await say('* A chama dela está do tamanho de uma unha. Azul. Tremendo. Ela gastou tudo: cada braseiro, cada rua, cada nota da música.');
  await say('Eu tô bem. Eu só... eu só tô com sono. Vela também dorme, né, @?', 'lume');
  await say('Não dorme. Não agora. NÃO AGORA.', 'me');
  await fadeOut(20); G.hora = 5 * 60 + 30;
  V.scene = 'world'; loadMap2('largo', ...escadaLargo(), 'up'); await fadeIn(20);
  await say('* Vocês sobem as escadas de gelo carregando a Lume. A Rita na frente, o baú embaixo, segurando o peso. Saem no Largo do Hospital, de madrugada.');
  await say('* E o Largo está cheio.');
  await say('* A Dona Nair com os netos. O Seu Bento, que não vê, de mão dada com a Dona Cida. O Pipo. O Seu Nonato. A Dona Zefa sem o tambor. O Seu Lino. O Osvaldo e os Pavios que lembram, e alguns que não lembram. O Brás e a mãe dele. O Seu Tomé com a Nina no colo e o gato na cabeça.');
  await say('* Cada um com uma vela. Ninguém combinou. Eles viram a fonte rachar e vieram.');
  await say('Ela acendeu a nossa rua. A gente acende ela.', 'nair');
  await say('* Eles fecham um círculo em volta da Lume. E chegam as velas perto dela, todas ao mesmo tempo, como quem esquenta as mãos num fogo que está apagando.');
  await cenaEvolucaoLume();
  playMusic('concerto');
  await say('* A Lume abre os olhos. Olha o círculo de velas. Olha você.');
  await say('Ninguém nunca me acendeu. Eu sempre acendi os outros. É... é assim que é? É quente assim?', 'lume');
  await say('É. É exatamente quente assim.', 'me');
  await say('* O sol nasce atrás da serra. Pela primeira vez em sete noites, ninguém em Auren precisa dele.');
  await wait(30);
  playMusic(null);
  await say('* Lá no alto, na torre de vidro da Acendedoria, uma janela iluminada. Um homem de luvas olha a cidade acesa à mão. Fica muito tempo olhando.');
  await say('* Ele abre o caderno preto. Escreve uma linha. Fecha.');
  await say('"Eles não precisam do Farol." ...Então está na hora de acendê-lo.', 'vesper');
  save2();
  await fadeOut(40);
  G.flags.c8Fim = true; G.hora = 10 * 60; G.dia = (G.dia || 0) + 1;
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Na base. A fita cor-de-rosa secou em cima do fogão. A Rita pendurou ela no gancho da porta, ao lado da página do nome riscado e do bilhete com a letra pequena.');
  await say('Três coisas dele na parede. A gente tá fazendo uma coleção.', 'rita');
  await say('[Registro: âmbar de Auren restabelecido às nove da manhã. Por ordem do Acendedor-Mor. "Para comemorar."]', 'cat');
  await say('Comemorar o quê?', 'lume');
  await say('A gente vai descobrir. No morro.', 'me');
  save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 8', 'O Inverno Escuro', '', 'que vela só fica sozinha', 'quando esquece o caminho.']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); await fadeIn(20);
  await say('* (O Capítulo 9 está a caminho: a Subida do Morro. Os Marcos levam aonde vocês já foram.)');
}
// ---------- voltas ----------
async function velasIgreja() {
  G.flags.c8VelasVelhagua = true; sfx('item');
  await say('* No canto da Igreja do Sino, um caixote de madeira com "VELAS DE PROCISSÃO" escrito a carvão. Dentro, dezenas de velas grossas, de cera velha.');
  await say('* Num papel pregado na tampa: "Para quando a luz faltar. Que vai faltar. — o sacristão, no ano do Inverno."');
  G.velas = (G.velas || 0) + 10;
  await say('* {y}+10 velas.{/} E a Lume, segurando a caixa, sente a chama crescer: ela aguenta mais. ({y}Chama máxima +20{/})');
  setChama(chamaMax());
}
{ const _fI8 = falaIlda; falaIlda = async function () {
  if (c8Ativo() && !G.flags.c8Lampiao) {
    G.flags.c8Lampiao = true; sfx('item');
    await say('Auren apagou? Hm. Candeia apagou faz três anos, e a gente aprendeu uma coisa: fogo de rua se acende com lampião de mina, não com vela. Gasta menos. Dura mais.', 'ilda');
    await say('* Ela dá à Lume um lampião de mina pequeno, de vidro grosso, e ensina a acender braseiro pela boca do lampião, sem gastar a chama inteira.');
    await say('* {y}Lampiões de Candeia:{/} acender braseiro gasta só 15 de chama (era 25).');
    return;
  }
  return _fI8();
}; }
{ const _fD8 = falaDama; falaDama = async function () {
  if (c8Ativo() && !G.flags.c8Hortensia) {
    G.flags.c8Hortensia = true;
    await say('* A Cidade Alta, acesa. Toda. Os jardins com lanternas de âmbar, as estufas brilhando. Lá embaixo, Auren no escuro.');
    await say('Eles não apagaram aqui em cima. Claro que não. Aqui mora quem paga.', 'dama');
    await say('Eu fiquei a noite toda olhando lá pra baixo. O meu marido nasceu no Bairro Baixo. Tomem. Velas de âmbar, dessas de jantar de rico. Não servem pra nada aqui em cima, que aqui nunca falta.', 'dama');
    G.velas = (G.velas || 0) + 6; sfx('item'); await say('* {y}+6 velas de âmbar.{/}');
    return;
  }
  return _fD8();
}; }
// ---------- semente (Cap. 8): O FIO DE ÂMBAR nas Cisternas ----------
// Primeira aparição na T2 da MOÇA DA BARCA (a moça de âmbar que fugiu no fim da T1). Ideia do usuário: ela vira, aos
// poucos, a voz-companheira do baú, morando dentro do Catálogo (arco planejado na bíblia, Caps. 8-10 e T3).
Object.assign(WHO, { eco8: { name: () => '???', voice: voz(640), col: '#ffd890', edge: '#c8902a' } });
function fioAmbarArt(f) {
  const c = mk(14, 30), x = c.getContext('2d'), p = (Math.sin(f * 0.25) + 1) / 2;
  x.fillStyle = '#3a2a1a'; x.fillRect(5, 0, 4, 4); x.fillStyle = '#1a1208'; x.fillRect(6, 1, 2, 3);
  x.fillStyle = '#c8802a'; x.fillRect(6, 3, 2, 20); x.fillStyle = '#ffc860'; x.fillRect(6, 3 + (f % 20), 2, 3);
  x.fillStyle = `rgba(255,216,120,${0.5 + p * 0.5})`; x.fillRect(7, 4, 1, 18);
  x.fillStyle = '#a8681c'; x.fillRect(3, 24, 8, 3); x.fillStyle = '#ffb848'; x.fillRect(4, 24, 6, 2); x.fillStyle = '#fff0b0'; x.fillRect(5, 24, 2, 1);
  x.fillStyle = `rgba(255,200,100,${0.15 + p * 0.2})`; x.fillRect(1, 22, 12, 7);
  return c;
}
{ const _mmF8 = montarMapas2; montarMapas2 = function () {
  _mmF8.apply(this, arguments);
  const m = MAPS2.cisternas; if (!m || m._fio8) return; m._fio8 = true;
  const p = chaoLivre8(m, 36, 26) || [36, 26];
  m.ents.push({ t: 'sign', id: 'fio8', x: p[0], y: p[1], h: 30, spr: () => fioAmbarArt(Math.floor(W2.t / 4)), get luz() { return G.flags.c8Fio ? 20 : 46; }, talk: fioAmbar8 });
}; }
async function fioAmbar8() {
  if (G.flags.c8Fio) { await say('* O fio de âmbar continua ali, morno no meio do gelo. Ele não fala mais. Mas parece que ele espera.'); return; }
  G.flags.c8Fio = true; playMusic(null);
  await say('* Um fio de âmbar escorre de uma rachadura na parede. No meio de todo esse gelo, ele está morno. E pulsa, devagar, como quem respira.');
  await say('Âmbar? Aqui embaixo? Isso não devia estar nas lanternas lá de cima?', 'lume');
  sfx('catalog'); await say('[Registro: âmbar bruto. Origem: ...]', 'cat');
  await say('[Origem: ...]', 'cat');
  await say('[Erro de leitura.]', 'cat');
  await wait(20);
  await say('...trinta e um?', 'eco8');
  await say('* A voz não veio do fio. Veio de dentro. De dentro do baú, do lugar onde o Catálogo fala.');
  await say('Quem falou?', 'me');
  await say('Você subiu. Que bom. Eu também subi.| Está frio aqui. Eu fiquei tanto tempo no frio.', 'eco8');
  await say('Rita. Você ouviu isso?', 'lume');
  await say('Ouvi o fio estalar. Por quê?', 'rita');
  sfx('catalog'); await say('[Correção: ninguém falou. Não há ninguém no registro além de mim.]', 'cat');
  await say('[O Catálogo nunca precisou corrigir uma coisa que não aconteceu.]', 'me');
  await say('* O fio de âmbar esfria um pouco. Mas não apaga.');
  playMusic('inverno');
}
{ const _cf8 = cenaFim8; cenaFim8 = async function () {
  const _say = say; let feito = false;
  say = async function (t, w) {
    const r = await _say.apply(this, arguments);
    if (!feito && w === 'cat' && typeof t === 'string' && t.startsWith('[Registro: âmbar de Auren')) {
      feito = true; say = _say;
      await _say('[Nota interna: há uma linha no meu registro que eu não escrevi. Letra redonda, sem assinatura.]', 'cat');
      await _say(G.flags.c8Fio ? '[Ela diz: "obrigada por não deixar a vela apagar. eu sei como é o frio."]' : '[Ela diz só: "achei você."]', 'cat');
      await _say('Catálogo. Quem escreveu isso?', 'me');
      await _say('[...Verificando.]| [Não sei.]| [É a primeira vez que eu digo isso.]', 'cat');
    }
    return r;
  };
  try { return await _cf8.apply(this, arguments); } finally { say = _say; }
}; }
