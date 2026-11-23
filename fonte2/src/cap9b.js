// ================= CAPÍTULO 9 — Parte 2: O MORRO =================
// O SOPÉ (o acampamento dos aliados; a cancela: a briga da Guilda ou luta) -> A ENCOSTA (seis patamares: VENTANIA,
// rondas da Guarda (metade some com o sino da Badalada), holofotes de noite, a CHAMINÉ VELHA do Tico e do Dito como
// atalho; no meio, O ESPANTALHO DO CERCO) -> A CRISTA (o Jardim das Lentes: o feixe de luar e três espelhos abrem a
// PORTA DAS LENTES; a luz atrai A RAINHA DO FAROL) -> O PÁTIO DO FAROL (o Tiago na porta, de herói da Coroa; O FAROLEIRO,
// com o Tiago jogando o troco; na fase 3 a moça de âmbar racha a lente). Final: o velho faroleiro pode parar; a porta
// abre; lá de cima, o Farol ACENDE.
const SO9 = POS9.sope9, EN9 = POS9.encosta9, CR9 = POS9.crista9, FA9 = POS9.farol9;
{ const _b2T9 = battle2; battle2 = function () { BT.tiago9 = null; return _b2T9.apply(this, arguments); }; }
{ const _mm9b = montarMapas2; montarMapas2 = function () {
  _mm9b.apply(this, arguments);
  if (MAPS2.sope9) return;
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  const vai = (map, xy, dir, onEnter) => async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2(map, ...xy, dir); await fadeIn(10); if (onEnter && MAPS2[map].onEnter) await MAPS2[map].onEnter(); };
  // ---------- O SOPÉ ----------
  MAPS2.sope9 = { rows: ROWS9.sope9, key: KEY9, name: 'O Morro · O Sopé', music: 'subida', batBg: bgEncosta9, bg: '#0a0e1c',
    lights: [[SO9.fogueira[0] + 0.5, SO9.fogueira[1], 90], [SO9.tenda[0] + 1.5, SO9.tenda[1], 60], [SO9.mesa[0] + 1, SO9.mesa[1], 50], [23.5, 9, 70]],
    props: [
      ...SO9.pinheiros.map(([x, y], i) => ({ img: () => pinheiroNeveArt(i), x: x - 0.6, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: () => tendaAliadaArt('#e8e0d0', 'cruz'), x: SO9.tenda[0] - 0.7, y: SO9.tenda[1] + 1, solid: [[SO9.tenda[0], SO9.tenda[1], 3, 1]], get by() { return aliado9('dalva') ? (SO9.tenda[1] + 1) * TS : -9999; } },
      ...SO9.guilda.map(([x, y]) => ({ img: () => tendaAliadaArt('#5a5a6e', 'guilda'), x: x - 0.7, y: y + 1, solid: [[x, y, 3, 1]] })),
      { img: () => mesaMapasArt(Math.floor(W2.t / 8)), x: SO9.mesa[0] - 0.3, y: SO9.mesa[1] + 1, solid: [[SO9.mesa[0], SO9.mesa[1], 2, 1]] },
      { img: () => chamineVelhaArt(aliado9('tico')), x: SO9.chamine[0] - 0.4, y: SO9.chamine[1] + 1, solid: [[SO9.chamine[0], SO9.chamine[1], 2, 1]] },
      { img: () => cancelaMorroArt(!!G.flags.c9Cancela), x: 21, y: 9.2, get solid() { return G.flags.c9Cancela ? [[21, 8, 1, 1]] : [[21, 8, 1, 1], [23, 8, 2, 1]]; } },
      { img: () => fogueiraArt(Math.floor(W2.t / 6)), x: SO9.fogueira[0] - 0.2, y: SO9.fogueira[1] + 1, solid: [SO9.fogueira.concat([1, 1])] }
    ],
    ents: [
      ...SO9.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('cidadeAlta', mirante9(), 'left') })),
      ...SO9.acima.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('encosta9', EN9.entra, 'up', true) })),
      ...SO9.cancela.map(([x, y]) => ({ t: 'trig', x, y: y + 1, w: 1, h: 1, passa: true, gone: () => !!G.flags.c9Cancela, run: cancela9 })),
      morador('dalva', ...SO9.dalva, { id: 'dalva9', dir: 'down', gone: () => !aliado9('dalva'), talk: tendaDalva9 }),
      morador('iolanda', ...SO9.iolanda, { id: 'iolanda9', dir: 'down', gone: () => !aliado9('iolanda'), talk: async () => { await say(pickOne(['A Porta das Lentes fica na crista, no fim da Encosta. Três espelhos. A página da sua amiga morta foi bem clara. Eu odeio que ela foi bem clara.', 'Eu fico aqui com o mapa. Se o vento levar vocês, eu vejo daqui e desenho onde caíram.', 'O meu avô subia essa trilha toda semana. De bengala. Vocês têm dente e lança. Sem desculpa.']), 'iolanda'); } }),
      morador('tico', SO9.tico[0], SO9.tico[1], { id: 'tico9s', dir: 'down', gone: () => !aliado9('tico'), talk: async () => { await say('A porta de ferro da chaminé, no primeiro patamar da Encosta, tá aberta. Por dentro ela sai no meio do morro, depois dos dois patamares de vento mais feio.', 'tico'); } }),
      morador('dito', SO9.dito[0], SO9.dito[1], { id: 'dito9s', dir: 'down', gone: () => !aliado9('tico'), talk: async () => { await say('Esquerda, esquerda, sobe. Eu lembro. Eu LEMBRO.', 'dito'); } }),
      morador('bras', ...SO9.bras, { id: 'bras9s', dir: 'down', gone: () => !aliado9('bras'), talk: async () => { await say(G.flags.c9Cancela ? 'Vai, vai! A briga não dura pra sempre! O Juca já tá chorando de verdade!' : 'Quando vocês chegarem perto da cancela, a gente começa. Sobe sem olhar pra trás.', 'bras'); } }),
      ...SO9.fila.map(([x, y], i) => morador('pavio', x, y, { id: 'fila9' + i, dir: 'up', talk: async () => { await say(pickOne(['Boa noite. Eu levo o pote lá pra cima. É quentinho. Eu não sei o que tem dentro.', 'Esperando a vez. A Guarda manda subir um por um.', 'Pesado? Não. É leve. Leve como... como uma coisa que eu esqueci.']), 'pavio'); } })),
      marcoEnt(...SO9.marco),
      bauEnt('sope9', 'b0', ...SO9.bau, async () => { await dar('frasco', 2); await dar('cobres', 80); })
    ],
    onEnter: async () => {}
  };
  // ---------- A ENCOSTA ----------
  const PEDRAS = EN9.pedras, MUR = EN9.mureta;
  MAPS2.encosta9 = { rows: ROWS9.encosta9, key: KEY9, name: 'O Morro · A Encosta', music: 'subida', batBg: bgEncosta9, bg: '#0a0e1c', stealth: true,
    get holofotes() { return EN9.holofotes; }, grupoLuz: ['guardaR', 'caoLanterna'],
    reinicio: () => patamarDe9(W2.y).ent, falaOlhou: () => pickOne(['Hm? Neve se mexendo?', 'Um baú. No morro. De noite. ...Não é da minha conta.', 'Quem deixou bagagem na trilha?']),
    pegoTxt: (como) => como === 'holofote' ? '* O facho do holofote para em você. Um apito lá em cima. Botas descendo a trilha.' : '* "PARADO! Ninguém sobe!" Um guarda com cão-lanterna corta o caminho.',
    lights: [...EN9.holofotes.map(([x, y]) => [x + 0.5, y + 0.5, 40])],
    props: [
      ...MUR.map(([x, y], i) => ({ img: () => muretaArt(x + y), x, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...PEDRAS.map(([x, y], i) => ({ img: () => pedraAbrigoArt(i), x: x - 0.2, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...EN9.holofotes.map(([x, y]) => ({ img: () => holofoteMuroArt(Math.floor(W2.t / 20)), x: x - 0.2, y: y + 1 })),
      { img: () => chamineVelhaArt(aliado9('tico')), x: EN9.chamineA[0] - 0.4, y: EN9.chamineA[1] + 0.2 },
      { img: () => chamineVelhaArt(true), x: EN9.chamineB[0] - 0.4, y: EN9.chamineB[1] + 0.2 }
    ],
    ents: [
      ...EN9.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('sope9', [SO9.cancela[0][0], SO9.cancela[0][1] - 1], 'down') })),
      ...EN9.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('crista9', CR9.entra, 'up', true) })),
      { t: 'sign', x: EN9.chamineA[0], y: EN9.chamineA[1], h: 30, talk: chamine9 },
      ...EN9.rondas.map((p, i) => ({ t: 'ronda', id: 'guardaE' + i, x: p[0][0], y: p[0][1], path: p, h: 56, passo: 24, spr: guardaSpr6, dir: 'right', gone: () => aliado9('badalada') && i !== 1, talk: async () => { await say('* O guarda está de costas, batendo os pés para esquentar.'); } })),
      ...EN9.fila.map(([x, y], i) => morador('pavio', x, y, { id: 'filaE' + i, dir: 'up', passa: true, talk: async () => { await say(pickOne(['O vento não derruba a gente. A gente é leve.', 'Lá em cima é quente. Dizem.']), 'pavio'); } })),
      inimigo('e9a', 'gralha', ...EN9.foes[0], ['gralha', 'gralha'], { spr: (t) => gralhaArt(Math.floor(t / 6)), h: 26, bg: bgEncosta9, fly: true }),
      inimigo('e9b', 'sentinela', ...EN9.foes[1], ['sentinela', 'gralha'], { spr: (t, d) => { const c = sentinelaArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(c) : c; }, h: 40, bg: bgEncosta9 }),
      inimigo('e9c', 'sentinela', ...EN9.foes[2], ['sentinela', 'sentinela', 'gralha'], { spr: (t, d) => { const c = sentinelaArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(c) : c; }, h: 40, bg: bgEncosta9 }),
      { t: 'sign', id: 'espantalho9', x: EN9.espantalho[0], y: EN9.espantalho[1], h: 60, gone: () => !!G.flags.c9Espantalho, spr: () => espantalhoMapaArt(Math.floor(W2.t / 20)), talk: lutaEspantalho9 },
      ...EN9.espTrig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c9Espantalho, run: lutaEspantalho9 })),
      marcoEnt(...EN9.marco),
      bauEnt('encosta9', 'b0', ...EN9.bau[0], async () => { await dar('pluma', 1); await dar('cobres', 90); }),
      bauEnt('encosta9', 'b1', ...EN9.bau[1], async () => { await dar('frasco', 1); await dar('tinta', 2); })
    ],
    onEnter: async () => {
      if (!G.flags.c9Encosta) { G.flags.c9Encosta = true; await say('* A Encosta. Seis patamares cortados na rocha, em zigue-zague, com uma mureta baixa na beira e, lá embaixo, Auren inteira acesa, pequena, como um formigueiro de vaga-lume.');
        if (aliado9('badalada')) { await wait(20); sfx('crit'); V.shake = 6; await say('* E então, lá de longe, do outro lado do vale: DOOOONG. DOOOONG. Doze vezes. A Dona Badalada, tocando meia-noite pela primeira vez em cem anos.'); await say('* Nos patamares, apitos. Lanternas descendo a trilha às pressas. Metade das rondas da Guarda vai ver o que é.'); await say('Obrigada, Dona Badalada.', 'lume'); }
        await say('[Rondas da Guarda: fique fora do cone de visão. Holofotes varrem os patamares de cima DE NOITE (de dia eles dormem, se quiser esperar num Marco). E o vento...]', 'cat'); }
    }
  };
  // ---------- A CRISTA ----------
  MAPS2.crista9 = { rows: ROWS9.crista9, key: KEY9, name: 'O Morro · O Jardim das Lentes', music: 'subida', batBg: bgCrista9, bg: '#0a0e1c',
    feixe: { emissor: CR9.emissor, alvo: CR9.alvo, alarme: CR9.alarme, flag: 'c9Porta' }, grupoLuz: ['sentinela', 'sentinela'], reinicio: CR9.entra,
    moveis: CR9.espelhos.map(([x, y], i) => ({ id: 'esp9' + i, k: 'espelho', o: '\\', x, y })),
    lights: [[CR9.emissor[0] + 0.5, CR9.emissor[1], 80], [CR9.alvo[0], CR9.alvo[1], 50]],
    props: [
      { img: () => lenteLuarArt(Math.floor(W2.t / 10)), x: CR9.emissor[0] - 0.4, y: CR9.emissor[1] + 1, solid: [[CR9.emissor[0], CR9.emissor[1], 1, 1]] },
      { img: () => portaLentesArt(!!G.flags.c9Porta, Math.floor(W2.t / 10)), x: 22.75, y: 4.1, get solid() { return G.flags.c9Porta ? [] : [[23, 3, 2, 1]]; } },
      { img: atrilArt, x: CR9.atril[0] - 0.05, y: CR9.atril[1] + 1, solid: [[CR9.atril[0], CR9.atril[1], 1, 1]] }
    ],
    ents: [
      ...CR9.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('encosta9', [EN9.saida[0][0], EN9.saida[0][1] + 2], 'down') })),
      ...CR9.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !G.flags.c9Rainha, run: vai('farol9', FA9.entra, 'up', true) })),
      { t: 'sign', x: CR9.atril[0], y: CR9.atril[1], h: 20, talk: atril9 },
      ...CR9.rainhaTrig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !G.flags.c9Porta || !!G.flags.c9Rainha, run: lutaRainha9 })),
      inimigo('c9a', 'gralha', ...CR9.foes[0], ['gralha', 'mariposaA'], { spr: (t) => gralhaArt(Math.floor(t / 6)), h: 26, bg: bgCrista9, fly: true }),
      inimigo('c9b', 'mariposaA', ...CR9.foes[1], ['mariposaA', 'mariposaA', 'sentinela'], { spr: (t) => mariposaAArt(Math.floor(t / 5)), h: 24, bg: bgCrista9, fly: true }),
      marcoEnt(...CR9.marco),
      bauEnt('crista9', 'b0', ...CR9.bau[0], async () => { await dar('frasco', 1); await dar('cobres', 120); }),
      bauEnt('crista9', 'b1', ...CR9.bau[1], async () => { await dar('pluma', 1); await dar('tinta', 2); })
    ],
    onEnter: async () => { if (!G.flags.c9Crista) { G.flags.c9Crista = true; await say('* A Crista. O vento para de repente, como uma porta que fecha. Ruínas de uma oficina de lentes, colunas quebradas, e no alto do paredão uma porta de latão com um cristal azul no meio.'); await say('* Na beira oeste, uma lente enorme num pé de latão pega o pouco de luz do céu e devolve um feixe reto, fininho, que corre pelo chão.'); await say('A Porta das Lentes. O avô da Dona Iolanda era um homem muito chato.', 'rita'); await say('[O FEIXE: espelhos desviam (/ ou \\). De frente para um espelho: girar, ou GUARDAR NO VÃO e pôr em outro lugar. O cristal VERMELHO na beira leste dá alarme. O ATRIL tem a página da Ofélia.]', 'cat'); } }
  };
  // ---------- O PÁTIO DO FAROL ----------
  MAPS2.farol9 = { rows: ROWS9.farol9, key: KEY9, name: 'O Farol de Cem Invernos · O Pátio', music: 'farol9', batBg: bgFarol9, bg: '#0a0c18',
    lights: [...FA9.postes.map(([x, y]) => [x + 0.5, y - 2, 70]), [15.5, 5, 80]],
    props: [
      { img: () => torreFarolBaseArt(Math.floor(W2.t / 12), !!G.flags.c9Faroleiro), x: 16 - 6.25, y: 7.05, by: 6 * TS },
      ...FA9.postes.map(([x, y]) => ({ img: () => posteArt(true), x: x - 0.1, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    ents: [
      ...FA9.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('crista9', [CR9.saida[0][0], CR9.saida[0][1] + 1], 'down') })),
      morador('tiago', ...FA9.tiago, { id: 'tiago9', dir: 'down', gone: () => !!G.flags.c9Fim, talk: falaTiago9 }),
      ...FA9.trig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c9Faroleiro, run: lutaFaroleiro9 })),
      ...FA9.porta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !G.flags.c9Faroleiro, run: cenaFim9 }))
    ],
    onEnter: async () => { if (!G.flags.c9Patio) { G.flags.c9Patio = true; playMusic('farol9'); await say('* O pátio do Farol de Cem Invernos. A torre sobe até sumir no escuro. Lá em cima, apagada ainda, a lanterna do tamanho de uma casa.'); await say('* Na porta de latão, um homem de casaco azul e dourado, com uma pluma torta no quepe de cobrador. De costas. Contando moedas.'); } }
  };
  grade(MAPS2.sope9); grade(MAPS2.encosta9); grade(MAPS2.crista9);
  // a trilha do mirante, na Cidade Alta (depois que a subida começa)
  const CA = MAPS2.cidadeAlta; if (CA && !CA._m9) { CA._m9 = true; const p = mirante9(); CA.ents.push({ t: 'trig', x: p[0] + 1, y: p[1], w: 1, h: 1, passa: true, gone: () => !G.flags.c9P2, run: vai('sope9', SO9.entra, 'right') }); }
}; }
function mirante9() { const C = MAPS2.cidadeAlta; if (C && C._mir9) return C._mir9; const p = (C && chaoLivre8(C, 52, 36)) || [52, 36]; if (C) C._mir9 = p; return p; }
function patamarDe9(y) { let best = EN9.patamares[0]; for (const pt of EN9.patamares) if (y <= pt.y0 + pt.h + 1) best = pt; return best; }
// ---------- o Sopé ----------
async function tendaDalva9() {
  await say(pickOne(['Senta. Mostra. Isso não é nada. Isso é um arranhão de mala.', 'Toma sopa. Sopa cura metade das coisas. A outra metade é sono.', 'O guarda do tornozelo disse que não viu vocês. Eu disse que ele não viu nada.']), 'dalva');
  curarTudo(); G.items.frasco = Math.max(G.items.frasco || 0, 4); sfx('heal'); W2.toast = { s: 'Todos curados. Frascos: ' + G.items.frasco, t: 0 };
}
async function cancela9() {
  if (G.flags.c9Cancela) return; W2.mv = null;
  if (aliado9('bras')) {
    await say('* Vocês se aproximam da cancela. Atrás, nas barracas da Guilda, alguém derruba uma mesa. Alguém grita "ESSE PASTEL ERA MEU". Uma garrafa voa.');
    await say('BRIGA! BRIGA NO ACAMPAMENTO! Os Caçadores estão se matando!', 'guardaRH');
    await say('* Os três guardas da cancela correm para separar. O cão-lanterna corre atrás, latindo de alegria.');
    await say('* O Brás, no meio da confusão, levanta o polegar para vocês e leva um murro de mentira (ou não) do Juca.');
    G.flags.c9Cancela = true; sfx('door'); save2(); return;
  }
  await say('* Três guardas da Guarda Real, de capa de neve, e um cão-lanterna. A cancela listrada fechada.');
  await say('Morro fechado. Ordem do Acendedor-Mor. Ninguém sobe, nem baú, nem... por que esse baú tem dente?', 'guardaRH');
  const r = await lutaMapa(['guardaR', 'guardaR', 'caoLanterna'], { bg: bgEncosta9 });
  if (r !== 'win') return;
  G.flags.c9Cancela = true; sfx('door'); await say('* A cancela sobe, rangendo. A trilha da Encosta, branca, sobe no escuro.'); save2();
}
// ---------- a Encosta ----------
async function chamine9() {
  if (!aliado9('tico')) { await say('* Uma porta de ferro enferrujada na rocha, com uma chaminé de tijolo saindo por cima. Trancada por dentro.'); await say('[Alguém que conhecesse a Chaminé Velha podia abrir por dentro...]', 'cat'); return; }
  await say('* A porta de ferro, aberta por dentro. Lá dentro, tijolo, fuligem e o eco de duas vozes de menino que já não são de menino.');
  const c = await choose('* Entrar na Chaminé Velha? (sai no meio do morro)', ['Entrar', 'Agora não'], 'me', 1); if (c !== 0) return;
  W2.mv = null; await fadeOut(12);
  if (!G.flags.c9Chamine) { G.flags.c9Chamine = true; await say('* Esquerda, esquerda, sobe, direita onde tem o tijolo torto. No tijolo torto, um pão de milho de vinte anos, duro como pedra. A Rita guarda de lembrança.'); }
  loadMap2('encosta9', EN9.chamineB[0] + 1, EN9.chamineB[1] + 1, 'right'); await fadeIn(12);
}
async function lutaEspantalho9() {
  if (G.flags.c9Espantalho) return; W2.mv = null;
  await say('* No meio do patamar, um poste. No poste, um espantalho enorme, de casaco feito de cartazes novos: O FAROL ACENDE · NINGUÉM MORRE NO ESCURO. No lugar da cabeça, um pote de Pavio. Dentro do pote, uma chama azul.');
  await say('* Os braços são duas cancelas listradas. Elas descem. Devagar. Na sua frente.');
  await say('Eu conheço esse jeito de ficar parado.', 'rita');
  await say('PE... DÁ... GIO.', 'n');
  await say('[O ESPANTALHO DO CERCO. Peças de um espantalho velho, remendadas pela Guarda.]', 'cat');
  const r = await lutaMapa(['espantalhoC'], { bg: bgEncosta9, music: 'boss', pos: [[184, 168]], intro: async () => { const e = BT.foes[0]; e.phases = fasesEspantalho9(); e.ct = 12; callout('ESPANTALHO DO CERCO', '#e8dcc0', 90); } });
  if (r !== 'win') return;
  G.flags.c9Espantalho = true; playMusic('subida');
  await say('* O Espantalho cai do poste. Na neve, o pote racha, e a lanterna velha do pedágio rola para fora, ainda acesa.');
  await say('* Ela se apaga sozinha. Devagar. Como quem finalmente pode ir embora do trabalho.');
  await say('Na ponte ele cobrava pedágio de quem passava. Aqui cobravam pedágio dele.', 'lume');
  await say('Ninguém devia trabalhar depois de morto. Nem espantalho.', 'me');
  save2();
}
// ---------- a Crista ----------
async function atril9() {
  if (!G.flags.c9Pagina) { await say('* Um atril de madeira, vazio, virado para a porta. Como se esperasse um livro.'); return; }
  await say('* Você abre o Grimório no atril. A página da Ofélia, com a letra inclinada:');
  await say('* "Três espelhos. O primeiro antes da coluna, onde a luz nasce. O segundo no alto, na beira norte. O terceiro embaixo da porta, olhando para cima. Barra para a direita: /. Sempre /."');
  if (!G.flags.c9Porta) await say('[Os espelhos começam todos virados para o outro lado ( \\ ). Gire e mude de lugar pelo Vão.]', 'cat');
}
{ const _pp9 = passoPuzzle; passoPuzzle = function () { const antes = G.flags.c9Porta; _pp9(); if (!antes && G.flags.c9Porta && W2.id === 'crista9') run2(portaAbriu9); }; }
async function portaAbriu9() {
  sfx('crit'); V.shake = 8;
  await say('* O feixe bate no cristal azul da porta. O cristal acende, e acende, e acende, até ficar dourado. A porta de latão se abre em duas, devagar, com um suspiro de cem anos.');
  await say('Barra para a direita. Sempre barra para a direita. Obrigada, Ofélia.', 'lume');
  await say('* Mas a luz não para na porta. Ela sobe. Faz um risco no céu. E lá do alto do morro, alguma coisa VÊ o risco.');
  save2();
}
async function lutaRainha9() {
  if (G.flags.c9Rainha) return; W2.mv = null;
  await say('* Um barulho de mil papéis. Do alto da torre, descendo em espiral pelo feixe, uma mariposa do tamanho de uma carroça. Asas de âmbar. Coroa de vidro.');
  await say('A RAINHA. A da Estrada dos Lampiões. Ela voltou.', 'rita');
  await say('Ela vive em volta do Farol agora. Comendo a luz que vaza. Ela engordou.', 'lume');
  await say('[A RAINHA DO FAROL. Cuidado: na primeira fase, LUZ cura ela.]', 'cat');
  const r = await lutaMapa(['rainhaF'], { bg: bgCrista9, music: 'boss', pos: [[184, 172]], intro: async () => { const e = BT.foes[0]; e.phases = fasesRainha9(); e.ct = 12; callout('A RAINHA DO FAROL', '#ffe090', 90); } });
  if (r !== 'win') return;
  G.flags.c9Rainha = true; playMusic('subida');
  await say('* A Rainha cai na neve, as asas apagando uma por uma. Ela olha para a Lume. Para a chama da Lume. E, por um momento, não come: só olha.');
  await say('* Depois voa. Para longe do Farol. Para o vale, onde as janelas de Auren têm velas acesas.');
  await say('Ela foi atrás das velas da cidade. Das velas de verdade.', 'lume');
  save2();
}
// ---------- o Pátio do Farol ----------
async function falaTiago9() {
  if (G.flags.c9Faroleiro) { await say('Sobe. Eu fico aqui e seguro quem vier de baixo. Eu sou herói, lembra? Herói segura porta.', 'tiago'); return; }
  await say('Não. Daqui não passa. Ordem da Coroa.', 'tiago');
}
async function lutaFaroleiro9() {
  if (G.flags.c9Faroleiro) return; W2.mv = null; playMusic(null);
  await say('* O homem da porta se vira. Quepe de cobrador, pluma torta, um sorriso cansado.');
  await say('Eu disse que guardava o troco.', 'tiago');
  await say('Tiago!', 'lume');
  await say('A Coroa me pôs de guarda no Farol. O herói nº 30, na porta mais importante do reino. Eu ia abrir pra vocês e dizer que dormi.', 'tiago');
  await say('Ia?', 'rita');
  await say('* O chão do pátio treme. As lajes se levantam em volta da porta, e de baixo delas sobe uma coisa de latão do tamanho de uma casa, rangendo como um navio.');
  await say('* No peito, uma LENTE. Anéis de luz dentro de anéis de luz. Ela gira e para em você.');
  await say('O FAROLEIRO. Ele acorda quando alguém chega perto da porta. Eu achei que era lenda.', 'tiago');
  await say('QUEM. SOBE. TEM. QUE. SER. LIDO.', 'faroleiro');
  await say('Então lê isso aqui.', 'tiago');
  await say('* O Tiago enche a mão de moedas de cobre. As de cobrador. Ele sempre teve troco no bolso.');
  await say('[O Tiago luta junto: a cada três ações do grupo ele joga o TROCO (corte, quebra escudo).]', 'cat');
  const r = await lutaMapa(['faroleiro'], { bg: bgFarol9, music: 'boss', pos: [[196, 178]], intro: async () => { const e = BT.foes[0]; e.phases = fasesFaroleiro9(); e.ct = 14; BT.tiago9 = { n: 0 }; callout('O FAROLEIRO', '#ffe090', 100); } });
  if (r !== 'win') return;
  G.flags.c9Faroleiro = true;
  await faroleiroDescansa9();
}
async function faroleiroDescansa9() {
  playMusic('perda');
  await say('* O Faroleiro ajoelha. A lente rachada para de girar. Por trás do vidro, o velho de cachimbo apagado levanta a cabeça.');
  await say('...Chegou o substituto? Faz cem anos que eu espero o substituto. Ninguém veio. Eu não podia largar a luz sozinha.', 'faroleiro');
  await say('{o}Pode parar. Ninguém vai ficar no escuro. Tem gente lá embaixo com vela na janela.{/}', 'eco8');
  await say('* O velho olha para baixo, para Auren. As velas nas janelas. Os braseiros que ninguém apagou.');
  await say('Vela na janela. Igual no meu tempo. Então tá bom. Então eu posso.', 'faroleiro');
  await say('* O latão se desmancha em ferrugem, a ferrugem em neve, a neve em nada. Sobra o cachimbo, no chão do pátio. A Lume guarda.');
  await say('Ela falou de novo. A moça. Em voz alta, pra todo mundo ouvir.', 'rita');
  await say('{o}...desculpa. ele estava muito cansado. eu sei como é ficar esperando alguém.{/}', 'eco8');
  await say('* A porta de latão do Farol abre sozinha. Lá dentro, uma escada em caracol que sobe até sumir.');
  save2();
}
async function cenaFim9() {
  W2.mv = null; playMusic(null);
  await say('* Vocês entram. A escada em caracol sobe e sobe. As paredes são de vidro grosso, e atrás do vidro, potes. Milhares de potes. Cada um com uma luzinha morna dentro.');
  await say('São eles. Os Pavios. As lembranças.', 'lume');
  await say('{o}...eu conheço essa escada.{/}', 'eco8');
  await say('* Você para. Todos param.');
  await say('{o}não essa. uma igual. eu subi uma escada assim uma vez. pra fugir de uma voz. no fim da escada tinha uma barca. eu era... eu tinha um nome. eu tinha uma irmã? não. eu tinha uma metade.{/}', 'eco8');
  await say('[...Registro sem origem. Eu não consigo arquivar isso. Não tem gaveta para isso.]', 'cat');
  await say('Lá em cima a gente descobre o seu nome. Prometo.', 'me');
  await say('{o}lá em cima. tá bom. eu vou lembrar até lá em cima.{/}', 'eco8');
  await wait(30);
  sfx('crit'); V.shake = 16; flashW(6);
  await say('* E então, de cima, um barulho de engrenagem do tamanho do mundo.');
  await say('* A escada inteira acende. Os potes acendem. A luz sobe pelo vidro, de pote em pote, como fogo subindo um pavio.');
  await fadeOut(30); G.hora = 23 * 60 + 50;
  V.scene = 'world'; loadMap2('sope9', ...SO9.entra, 'right'); await fadeIn(30);
  await say('* Lá embaixo, no sopé, a Irmã Dalva levanta da tenda. A Dona Iolanda deixa cair os óculos. O Brás para a briga de mentira no meio de um murro.');
  await say('* No alto do morro, o Farol de Cem Invernos ACENDE.');
  await say('* Um facho branco-dourado varre o vale. Passa por Auren, por Velhágua, por Candeia, pela serra. Onde ele passa, as velas nas janelas tremem.');
  await say('* E no alto da torre, na sala da lanterna, um homem de luvas pretas olha a luz que fez. Fecha o caderno. Abre os braços.');
  await say('Ninguém mais vai morrer no escuro.', 'vesper');
  G.flags.c9Fim = true; G.dia = (G.dia || 0) + 1; save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 9', 'A Subida do Morro', '', 'eu vou lembrar', 'até lá em cima.']);
  V.scene = 'world'; loadMap2('sope9', ...SO9.entra, 'right'); await fadeIn(20);
  await say('* (O Capítulo 10 está a caminho: O Farol de Cem Invernos. Os Marcos levam aonde vocês já foram.)');
}
