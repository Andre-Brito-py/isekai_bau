// ================= CAPÍTULO 3 — PARTE 2: AS GALERIAS DE FULIGEM =================
// Do festival, o grupo desce pela grade do bueiro do Bairro Baixo (o Tico mostra o caminho e fica de guarda lá em cima).
// GALERIAS 1 (túneis escuros: a luz da Lume é o que deixa ver; brasas nas grades; Cinzinhas e Ratos-Pavio; a BIGORNA da
// forja velha; um Pavio que carrega lanternas cheias para cima sem saber o que leva) -> GALERIAS 2 (o Salão das
// Lanternas: prateleiras de vidros com fumaça dentro, etiquetados com NOMES; o VEIO DE ÂMBAR: a EVOLUÇÃO) -> O CORAÇÃO
// DA FULIGEM (chefe: MÃE-FULIGEM) -> a lanterna do DITO -> o Tico e o irmão (um segundo de lembrança) -> FIM DO CAP. 3.
// Pistas só no jogo (nunca dizer no chat quem está por trás): os canos sobem "para os postes" e "para o morro do Farol".
const GA1 = POS3.galerias1, GA2 = POS3.galerias2, FU = POS3.fundo;
Object.assign(HUMS, { pavioG: Object.assign({}, HUMS.pavio || {}, { coat: '#4a4a5a' }) });
const NOMES_LANT = ['DITO', 'MARTA DA PONTE', 'SEU LINO', 'IRMÃ CÉLIA', 'JOCA', 'DONA ZILÁ', 'O MOÇO DO SINO', 'BENTINHA'];
const LUZ_GAL = { galerias1: GA1.brasas, galerias2: [[6, 8], [21, 8], [14, 9]], fundo: [[3, 3], [15, 8]] };
{ const _mm4 = montarMapas2; montarMapas2 = function () {
  _mm4.apply(this, arguments);
  const key = Object.assign({}, KEY_GAL, { '~': KEY2['~'], '_': KEY2['_'] });
  MAPS2.galerias1 = { rows: ROWS3.galerias1, name: 'Galerias de Fuligem', music: 'afogado', batBg: bgGalerias, bg: '#0c0810', key, escuro: true,
    props: [
      ...GA1.brasas.map(([x, y]) => ({ img: () => gradeBrasa(Math.floor(FRAME / 10) % 3), x, y: y + 0.6 })),
      { img: () => G.flags.bigorna ? EMPTY_C : bigornaArt(), x: GA1.bigorna[0] - 0.4, y: GA1.bigorna[1] + 1, solid: [[GA1.bigorna[0], GA1.bigorna[1], 1, 1]] },
      { img: () => canoArt(80), x: 24, y: 5, by: 80 }, { img: () => canoArt(80), x: 31, y: 9, by: 80 }
    ],
    ents: [
      ...GA1.subida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: subirBueiro })),
      marcoEnt(...GA1.marco),
      inimigo('g1', 'cinza', ...GA1.cinza1, ['cinza'], { spr: t => cinzaArt(Math.floor(t / 12) % 3), h: 24, bg: bgGalerias }),
      inimigo('g2', 'rato', ...GA1.rato1, ['rato', 'rato'], { spr: t => ratoArt(Math.floor(t / 8) % 2), h: 22, bg: bgGalerias, vision: 5 }),
      inimigo('g3', 'cinza', ...GA1.cinza2, ['cinza', 'cinza'], { spr: t => cinzaArt(Math.floor(t / 12) % 3), h: 24, bg: bgGalerias }),
      inimigo('g4', 'rato', ...GA1.rato2, ['rato', 'cinza'], { spr: t => ratoArt(Math.floor(t / 8) % 2), h: 22, bg: bgGalerias, vision: 5 }),
      inimigo('g5', 'cinza', ...GA1.misto, ['cinza', 'rato', 'cinza'], { spr: t => cinzaArt(Math.floor(t / 12) % 3), h: 24, bg: bgGalerias }),
      { t: 'sign', x: GA1.bigorna[0], y: GA1.bigorna[1], h: 22, talk: pegarBigorna },
      morador('pavioG', ...GA1.pavioT, { rotina: rot([25, 16, 'carregar', 400, 'right'], [29, 16, 'carregar', 400, 'left']), talk: falaPavioGal }),
      bauEnt('galerias1', 'a', ...GA1.bau, () => dar('pluma', 1)),
      ...GA1.saida.map(([x, y]) => ({ t: 'door', x, y, to: 'galerias2', tx: GA2.entra[0], ty: GA2.entra[1], dir: 'down' }))
    ],
    onEnter: async () => { if (!G.flags.c3Gal) { G.flags.c3Gal = true; await cenaDescida(); } }
  };
  MAPS2.galerias2 = { rows: ROWS3.galerias2, name: 'Salão das Lanternas', music: 'afogado', batBg: bgGalerias, bg: '#0c0810', key, escuro: true,
    props: [
      ...GA2.prat.map(([x, y], i) => ({ img: () => prateleiraArt(i), x: x - 1, y, by: 58 })),
      { img: () => veioArt(Math.floor(FRAME / 8) % 7, !!G.evo3), x: GA2.veio[0] - 0.25, y: GA2.veio[1] + 1, solid: [[14, 9, 2, 1]] },
      { img: () => canoArt(110), x: 13, y: 4, by: 110 }, { img: () => canoArt(110), x: 16.5, y: 4, by: 110 }
    ],
    ents: [
      ...GA2.volta.map(([x, y]) => ({ t: 'door', x, y, to: 'galerias1', tx: GA1.saida[0][0], ty: GA1.saida[0][1] - 1, dir: 'up' })),
      marcoEnt(...GA2.marco),
      ...GA2.prat.map(([x, y], i) => ({ t: 'sign', x, y, h: 50, talk: () => lerLanterna(i) })),
      { t: 'sign', x: GA2.veio[0], y: GA2.veio[1], h: 56, talk: falaVeio }, { t: 'sign', x: GA2.veio[0] + 1, y: GA2.veio[1], h: 56, talk: falaVeio },
      morador('pavioG', ...GA2.pav1, { rotina: rot([5, 16, 'carregar', 300, 'right'], [11, 16, 'carregar', 300, 'left']), talk: falaPavioGal }),
      morador('pavioG', ...GA2.pav2, { rotina: rot([22, 16, 'carregar', 340, 'left'], [17, 16, 'carregar', 340, 'right']), talk: falaPavioGal }),
      inimigo('h1', 'cinza', ...GA2.cinza, ['cinza', 'cinza'], { spr: t => cinzaArt(Math.floor(t / 12) % 3), h: 24, bg: bgGalerias }),
      inimigo('h2', 'rato', ...GA2.rato, ['rato', 'rato', 'cinza'], { spr: t => ratoArt(Math.floor(t / 8) % 2), h: 22, bg: bgGalerias, vision: 5 }),
      inimigo('h3', 'cinza', ...GA2.misto, ['cinza', 'rato', 'rato'], { spr: t => cinzaArt(Math.floor(t / 12) % 3), h: 24, bg: bgGalerias }),
      bauEnt('galerias2', 'a', ...GA2.bau, async () => { G.items.tinta = (G.items.tinta || 0) + 2; await say('* Duas {y}Tintas Azuis{/}, esquecidas por algum escriba que desceu e não subiu.'); }),
      ...GA2.descida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: descerFundo }))
    ],
    onEnter: async () => { if (!G.flags.c3Salao) { G.flags.c3Salao = true; await say('* Um salão enorme, de teto alto. Prateleiras do chão ao teto, cheias de lanternas de vidro. Dentro de cada uma, uma fumaça morna que se mexe devagar. No meio, um veio de âmbar bruto, pulsando.'); await say('Tem nome escrito nas lanternas. Nome de gente.', 'rita'); } }
  };
  MAPS2.fundo = { rows: ROWS3.fundo, name: 'O Coração da Fuligem', music: 'afogado', batBg: bgGalerias, bg: '#0c0810', key, escuro: true,
    props: [{ img: () => G.flags.c3Mae ? EMPTY_C : maeFuligemArt(Math.floor(FRAME / 18) % 2, 1), x: 7.9, y: 7, by: 120 }, { img: () => G.flags.c3Mae && !G.flags.c3Dito ? prateleiraArt(0) : EMPTY_C, x: 9, y: 10, by: 58 }],
    ents: [
      ...FU.volta.map(([x, y]) => ({ t: 'door', x, y, to: 'galerias2', tx: GA2.descida[0][0], ty: GA2.descida[0][1] - 1, dir: 'up' })),
      ...FU.gatilho.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: lutaMae })),
      { t: 'sign', x: FU.lanterna[0], y: FU.lanterna[1], h: 40, talk: pegarLanternaDito }
    ]
  };
  for (const id of ['galerias1', 'galerias2', 'fundo']) { const m = MAPS2[id]; m.baked = null; for (const p of m.props || []) { const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } }
  // a grade do bueiro no Bairro Baixo
  const au = MAPS2.auren; if (au && !au._bueiro) { au._bueiro = true; au.ents.push({ t: 'sign', x: AUR.bueiro[0], y: AUR.bueiro[1], h: 10, talk: gradeBueiro }); au.ents.push(morador('tico', ...AUR.bueiroTico, { rotina: rot([AUR.bueiroTico[0], AUR.bueiroTico[1], 'olhar', 9000, 'left']), talk: falaTicoGrade, gone: () => !G.flags.c3P1Fim || !!G.flags.c3Fim })); au.props.push({ img: () => gradeBrasa(0), x: AUR.bueiro[0], y: AUR.bueiro[1] + 0.9 }); }
}; }

// ---------- escuro das galerias: só se vê onde tem luz (a Lume, as brasas) ----------
let ESCURO_C = null;
{ const _ar = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  if (m && m.escuro) {
    if (!ESCURO_C || ESCURO_C.width !== W || ESCURO_C.height !== H) ESCURO_C = mk(W, H);
    const x = ESCURO_C.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(6,3,12,0.92)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'destination-out';
    const furo = (cx, cy, r) => { const g = x.createRadialGradient(cx, cy, r * 0.25, cx, cy, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.7, 'rgba(0,0,0,0.75)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); };
    const rL = (LUSTRE_ON() ? 96 : 70) + Math.sin(W2.t * 0.1) * 2 + (evo3() === 'farol' ? 26 : 0);
    furo(W2.px + 8 - ox, W2.py - 8 - oy, rL);
    for (const [bx0, by0] of LUZ_GAL[W2.id] || []) furo(bx0 * TS + 8 - ox, by0 * TS + 4 - oy, 34 + Math.sin(W2.t * 0.13 + bx0) * 3);
    for (const e of W2.ents) if (e.id === 'pavioG') furo(e.px + 8 - ox, e.py - 30 - oy, 22);
    x.globalCompositeOperation = 'source-over';
    bx.drawImage(ESCURO_C, 0, 0);
    // a luz quente por cima
    bx.globalCompositeOperation = 'lighter'; luzMundo(W2.px + 8 - ox, W2.py - 8 - oy, rL * 0.7, LUSTRE_ON() ? 'rgba(255,220,140,0.14)' : 'rgba(255,200,120,0.10)'); bx.globalCompositeOperation = 'source-over';
  }
  return _ar ? _ar(m, ox, oy) : undefined;
}; }
function luzMundo(x, y, r, col) { const g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(x - r, y - r, r * 2, r * 2); }

// ---------- falas e eventos ----------
async function gradeBueiro() {
  if (!G.flags.c3P1Fim) { await say('* Uma grade de bueiro. Lá embaixo, alguma coisa respira devagar, morna, com cheiro de fuligem.'); return; }
  if (G.flags.c3Fim) { await say('* A grade do bueiro. Lá embaixo, agora, está quieto.'); return; }
  const c = await choose('* Descer pela grade do bueiro até as Galerias de Fuligem?', ['Descer', 'Ainda não']); if (c !== 0) return;
  sfx('door'); await fadeOut(16); loadMap2('galerias1', ...GA1.entra, 'down'); await fadeIn(16);
}
async function falaTicoGrade() {
  if (!G.flags.c3TicoGrade) {
    G.flags.c3TicoGrade = true;
    await say('Eu vou junto! Eu conheço as Galerias! Mais ou menos! O Dito me levou uma vez!', 'tico');
    await say('Não. Lá embaixo tem coisa que come luz e coisa que come gente. Você fica aqui e guarda a grade.', 'rita');
    await say('...Guardar a grade é importante?', 'tico');
    await say('Importantíssimo. Se alguém fechar, a gente fica preso lá embaixo. Você é a nossa saída.', 'rita');
    await say('Ela tá falando sério, Tico. Ninguém guarda uma grade melhor que você.', 'me');
    await say('* O Tico estufa o peito e senta em cima da grade com a vassoura no colo, como um soldado.');
    await say('Desce pela grade. Lá embaixo é escuro de verdade. Fica perto da moça que brilha.', 'tico');
    return;
  }
  await say(G.flags.c3Mae ? 'Vocês voltaram! E o Dito? Acharam alguma coisa do Dito?' : pickOne(['Eu tô guardando! Ninguém fecha essa grade enquanto eu tiver aqui.', 'Lá embaixo dá pra ouvir a cidade respirando. O Dito dizia isso.']), 'tico');
}
async function subirBueiro() { sfx('door'); await fadeOut(14); loadMap2('auren', ...AUR.bueiroOut, 'up'); await fadeIn(14); }
async function cenaDescida() {
  await say('* Escuro. Escuro de verdade, do tipo que a superfície esqueceu. Só a luz da Lume abre um círculo em volta de vocês.');
  await say('Ninguém sai do meu círculo. Sério. Aqui eu sou importante.', 'lume');
  await say('Você é importante lá em cima também. Lá só tem mais concorrência.', 'me');
  await say('[As Galerias de Fuligem: túneis antigos de chaminé e esgoto, debaixo da capital. Aviso: aqui, FOGO ALIMENTA FULIGEM. Brasa cura os bichos daqui.]', 'cat');
  await say('* (Nas Galerias só se enxerga perto de alguma luz: a Lume e as grades de brasa. De noite, a Lume vira lustre e ilumina muito mais.)');
}
async function falaPavioGal() {
  await say(pickOne(['Boa noite. Eu desço vazio e subo cheio. Toda noite. Eu não sei o que tem dentro. É quentinho.', 'Os canos levam a luz para os postes. E para o morro do Farol. Tudo sobe. Nada desce, só a gente.', 'Eu tinha um irmão? Acho que eu tinha um irmão. Ou um cachorro. Alguém que me esperava.', 'Não pode abrir as lanternas. Ordem é ordem. Eu não lembro quem deu a ordem.']), 'pavio');
}
async function pegarBigorna() {
  if (G.flags.bigorna) return;
  await say('* Uma bigorna velha, meio enterrada na fuligem. Deve ser da forja que existia aqui quando isso ainda era uma oficina.');
  await say('UMA BIGORNA. @, guarda. Guarda AGORA. Isso vai pra minha forja.', 'rita');
  await say('Eu não sou um depósito, Rita.| ...Tá. Eu sou um depósito.', 'me');
  sfx('item'); G.flags.bigorna = true;
  await say('* Você abre a tampa e a bigorna cai lá dentro, no Interior do Baú, bem no canto da forja. Clang.');
  await say('* (A forja da Rita, na base, agora funciona.)'); save2();
}
async function lerLanterna(i) {
  const nm = NOMES_LANT[i % NOMES_LANT.length];
  const txts = ['um menino rindo em cima de um telhado, segurando a mão de alguém menor', 'uma ponte de pedra e uma mulher cantando para o rio', 'o cheiro de um armazém de feijão e um velho contando moedas', 'um sino tocando numa tarde de domingo', 'um pião rodando num chão de terra', 'um bolo de fubá esfriando na janela', 'uma corda de sino gasta de tanta mão', 'um laço de fita vermelha'];
  await say(`* Uma lanterna de vidro. A etiqueta diz: ${nm}. Dentro, a fumaça se mexe e, por um segundo, parece ${txts[i % txts.length]}.`);
  if (i === 0 && !G.flags.c3LeuDito) { G.flags.c3LeuDito = true; await say('Dito. O irmão do Tico. ...Mas essa tá vazia. Só tem a etiqueta. Cadê o resto?', 'rita'); await say('[Leitura: a lembrança correspondente foi levada mais para baixo. Para onde a fuligem é mais funda.]', 'cat'); }
  else if (i === 3) { await say('Não abre. Eu não sei o que acontece se abrir. E eu não quero que aconteça na minha frente.', 'lume'); await say('A gente não abre. A gente leva pro dono.', 'me'); }
}
async function falaVeio() {
  if (G.evo3) { await say('* O veio de âmbar está apagado, cinza, como carvão frio. Tudo o que ele tinha está em você agora.'); return; }
  await cenaEvolucao();
}
async function descerFundo() {
  if (!G.evo3) { await say('* A escada desce para onde a fuligem é mais funda. A sua tampa range: o veio de âmbar está puxando você de volta. Primeiro, o veio.'); W2.mv = null; loadMap2('galerias2', 14, 17, 'up'); return; }
  sfx('door'); await fadeOut(14); loadMap2('fundo', ...FU.entra, 'down'); await fadeIn(14);
}
async function lutaMae() {
  if (G.flags.c3Mae) return;
  W2.mv = null;
  await say('* O fundo. Uma caverna redonda, quente como um forno. No meio, uma montanha de fumaça e tijolo de chaminé respira. Cada vez que ela respira, as luzes da cidade, lá em cima, piscam.');
  await say('* Ela abre os olhos. Dois carvões acesos. E dentro do peito, presas na fuligem, centenas de luzinhas.');
  await say('Isso é... tudo o que queimou lá em cima vem parar aqui?', 'lume');
  await say('É a lixeira da cidade. Só que de lembrança.', 'me');
  await say('[Mãe-Fuligem. Fogo a alimenta. Gelo e mordida a desmancham. Ela engole luz, então: cuidado com as velas.]', 'cat');
  await say('Então nada de fogo, todo mundo mordendo e congelando. Plano simples. Eu gosto de plano simples.', 'rita');
  await say('Morder eu sei. É o meu currículo inteiro.', 'me');
  const r = await lutaMapa(['mae'], { bg: bgGalerias, music: 'boss', pos: [[186, 168]], intro: async () => { const e = BT.foes[0]; e.phases = fasesMae(); e.ct = 15; callout('MÃE-FULIGEM', '#ffd8a0', 100); } });
  if (r !== 'win') return;
  G.flags.c3Mae = true; save2();
  await say('* A Mãe-Fuligem desmorona como uma chaminé velha. E as luzinhas, soltas, sobem. Centenas. Atravessam o teto da caverna, entram nos canos, sobem para a cidade.');
  await say('* Lá em cima, por um segundo, cada poste de Auren brilha um pouco diferente. Mais quente. Como se alguém tivesse lembrado de alguma coisa boa.');
  await say('* Sobra uma única lanterna de vidro no chão, inteira, com uma fumaça teimosa dentro. A etiqueta diz: DITO.');
}
async function pegarLanternaDito() {
  if (!G.flags.c3Mae || G.flags.c3Dito) return;
  G.flags.c3Dito = true; sfx('item');
  await say('* Você guarda a lanterna do Dito dentro da tampa, com todo o cuidado que um baú consegue ter.');
  await cenaFinalCap3();
}
async function cenaFinalCap3() {
  await fadeOut(24);
  G.hora = 5 * 60 + 30; G.flags.c3Fim = true;
  CENA.bg = bgAuren; CENA.extra = null;
  const tico = { x: 150, y: 168, fr: humF('tico', 'f') }, dito = { x: 176, y: 160, fr: humF('dito', 's') };
  CENA.actors = [{ x: 60, y: 160, fr: standF('lumeh') }, { x: 76, y: 168, fr: chestF() }, { x: 96, y: 162, fr: standF('rita') }, tico, dito];
  V.scene = 'cena'; playMusic('auren'); await fadeIn(30);
  await say('* Amanhecendo. Na beira do canal, o Dito acende o último poste da noite. O Tico está do lado dele, segurando a vassoura com as duas mãos.');
  await say('* Você abre a tampa. A Lume tira a lanterna de dentro e entrega ao Tico. O Tico olha para vocês. Vocês fazem que sim.');
  await say('* Ele abre a lanterna. A fumaça morna sai, faz uma volta no ar e entra no peito do Dito, como quem volta para casa.');
  await say('...', 'dito');
  await say('...Tico?', 'dito');
  await say('* O Tico larga a vassoura.');
  await say('Tico. Você cresceu. Por que você cresceu sem me avisar?', 'dito');
  await say('DITO!', 'tico');
  await say('* Eles se abraçam. É um abraço curto, porque o Dito, no meio, para. Olha em volta como quem perdeu o fio.');
  await say('...Bom dia, rapazinho. Eu tenho que acender os postes. Ordem é ordem.', 'dito');
  await say('* E vai embora. Mas, na esquina, ele olha para trás. Só uma vez. E acena.');
  await say('Ele lembrou. Um pouquinho. Ele lembrou de mim.', 'tico');
  await say('Um pouquinho já é começo, Tico. Eu comecei com menos.', 'me');
  await say('* O Tico pega a vassoura e vai atrás do irmão, de longe, como quem vai buscar o resto.');
  await say('Alguém está colhendo lembrança de gente. Guardando em pote. E mandando pelo cano para cima.', 'rita');
  await say('Para os postes. E para o morro do Farol, o Pavio disse.', 'lume');
  await say('Alguém tá acendendo uma cidade inteira com o que as pessoas esquecem.', 'me');
  await say('* A Lume olha para o morro, onde o Farol de Cem Invernos espera a última noite do festival. Ela não termina o pensamento. Ninguém termina.');
  await say('[Hipótese não registrada. Registro... adiado.]', 'cat');
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 3', 'O Festival da Luz', '', 'Próximo: Capítulo 4']);
  save2();
  V.scene = 'world'; loadMap2('auren', ...AUR.bueiroOut, 'down'); await fadeIn(20);
  await capitulo4();
}
