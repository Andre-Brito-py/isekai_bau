// ================= CAPÍTULO 4 — PARTE 2: CANDEIA, A VILA QUE APAGOU =================
// Largo (o Jorge) -> ESTRADA DA SERRA (névoa; Névoas e Mineiros Ocos; um baú no mirante que só aparece AO AMANHECER)
// -> CANDEIA (moradores parados nas portas; de NOITE eles andam dormindo e cochicham pistas; o poço só mostra o que
// guarda de noite) -> a DONA ILDA (professora de runas: só recebe DE DIA; ensina a RUNA DE GATILHO e dá a chave da
// porteira) -> a MINA (escura, lampiões) -> a CAPELA, onde os transferidos dormem: só abre no TURNO DA NOITE ->
// o CAPATAZ DE CANDEIA -> o Dito, os transferidos acordando, uma página arrancada no bolso do Capataz -> volta à
// capital: a Irmã Dalva abre a ENFERMARIA na base e o Seu Jorge a GARAGEM (viagem rápida) -> FIM DO CAPÍTULO 4.
// DIA E NOITE (pedido do usuário: "coisas que só podem ser feitas em determinado horário"): Dona Ilda só de dia; capela
// só à noite; sonâmbulos e o poço só à noite; o baú do mirante só ao amanhecer (5h às 8h30); a Pensão muda de dia/noite.
const SE = POS4B.serra, CA = POS4B.candeia, IL = POS4B.ilda, MI = POS4B.mina;
const amanhecer = () => { const h = hora(); return h >= 5 * 60 && h <= 8 * 60 + 30; };
const diaUtil = () => { const h = hora(); return h >= 7 * 60 && h < 18 * 60; };
Object.assign(TRACKS, {
  candeia: { bpm: 70, bars: 8, chords: 'Em C G D Em C B B', bass: 'root5', bassVol: 0.08,
    lead: 'B4:4 E5:4 G5:4 F#5:4 | E5:8 B4:8 | C5:4 E5:4 G5:4 B5:4 | A5:8 G5:8 | B4:4 E5:4 G5:4 B5:4 | C6:4 B5:4 G5:8 | F#5:4 D#5:4 B4:4 F#5:4 | E5:16',
    leadWave: 'triangle', leadVol: 0.06, arp: { rate: 4, vol: 0.014, oct: 1 }, drums: '', hatVol: 0 }
});
LUZ_GAL.mina = MI.lampioes;
{ const _mm4b = montarMapas2; montarMapas2 = function () {
  _mm4b.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== ESTRADA DA SERRA =====
  MAPS2.serra = { rows: ROWS4B.serra, name: 'Estrada da Serra', music: 'candeia', batBg: bgSerra, bg: '#2a3242', nevoa: () => ehNoite() ? 1 : amanhecer() ? 0.35 : 0.75,
    props: [
      { img: busArt, x: -9.2, y: 15.2 },
      { img: memo(placaVilaArt), x: SE.placa[0] - 0.7, y: SE.placa[1] + 1 },
      ...[[2, 9], [8, 6], [17, 9], [27, 11], [31, 6], [12, 2]].map(([x, y], i) => ({ img: arvC(i + 2), x: x - 1.25, y: y + 1 }))
    ],
    ents: [
      marcoEnt(...SE.marco),
      ...SE.cand.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('candeia', ...CA.entra, 'right'); await fadeIn(12); if (MAPS2.candeia.onEnter) await MAPS2.candeia.onEnter(); } })),
      morador('jorge', 2, 13, { rotina: rot([2, 13, 'olhar', 9000, 'right']), talk: falaJorgeSerra }),
      morador('velha2', ...SE.velha, { rotina: rot([25, 8, 'olhar', 500, 'left'], [27, 9, 'olhar', 400, 'down']), talk: falaVelhaSerra }),
      { t: 'sign', x: SE.placa[0], y: SE.placa[1], h: 30, talk: async () => { await say('* Uma placa de madeira: "CANDEIA — A VILA MAIS ACESA DA SERRA". Alguém riscou a palavra ACESA com carvão. Recentemente.'); } },
      { t: 'sign', x: SE.mirante[0], y: SE.mirante[1] - 1, h: 20, talk: mirante },
      inimigo('n1', 'nevoa', ...SE.n1, ['nevoa'], { spr: (t) => nevoaArt(Math.floor(t / 10) % 6), h: 34, bg: bgSerra }),
      inimigo('n2', 'nevoa', ...SE.n2, ['nevoa', 'nevoa'], { spr: (t) => nevoaArt(Math.floor(t / 10) % 6), h: 34, bg: bgSerra }),
      inimigo('m1', 'mineiro', ...SE.m1, ['mineiro'], { spr: (t, d) => { const f = mineiroOcoArt(Math.floor(t / 14) % 2); return d === 'right' ? flipC(f) : f; }, h: 52, bg: bgSerra }),
      inimigo('m2', 'mineiro', ...SE.m2, ['mineiro', 'nevoa'], { spr: (t, d) => { const f = mineiroOcoArt(Math.floor(t / 14) % 2); return d === 'right' ? flipC(f) : f; }, h: 52, bg: bgSerra })
    ],
    onEnter: async () => { if (!G.flags.c4Serra) await chegaSerra(); }
  };
  // ===== CANDEIA =====
  const sonambulo = (x, y, i) => ({ get rotina() { return ehNoite() ? rot([x, y, 'olhar', 300, 'down'], [CA.poco[0] - 2 + (i % 5), CA.poco[1] + 2, 'olhar', 400, 'up'], [x, y + 1, 'olhar', 200, 'down']) : rot([x, y, 'olhar', 9000, 'down']); } });
  MAPS2.candeia = { rows: ROWS4B.candeia, name: 'Candeia', music: 'candeia', batBg: bgSerra, bg: '#262c3a', nevoa: () => ehNoite() ? 0.6 : 0.9, tint: 'rgba(120,130,160,0.10)',
    props: [
      { img: casa({ w: 5, stone: true, wall: '#8a8290', roof: '#4a5a6a', door: 2, win: [0.4, 3.4], signC: '#6a5a8a' }), x: 3, y: 8 },
      { img: casa({ w: 6, stone: true, wall: '#9a8a80', roof: '#5a4a4a', door: 3, win: [0.4, 4.4] }), x: 8, y: 8 },
      { img: mineArt, x: 14, y: 8 },
      { img: casa({ w: 5, stone: true, wall: '#8a8a90', roof: '#3a4a5a', win: [0.4, 3.4], door: 2.5 }), x: 20, y: 8 },
      { img: casa({ w: 7, stone: true, wall: '#a8987a', roof: '#6a3a3a', door: 2.6, win: [0.5, 5.4], signC: '#8a6a3a' }), x: 24, y: 8 },
      { img: casa({ w: 3, stone: true, wall: '#8a8290', roof: '#4a4a5a', win: [0.5] }), x: 31, y: 8 },
      { img: memo(pocoArt), x: CA.poco[0] - 1, y: CA.poco[1] + 1.2, solid: [[15, 13, 4, 2]] },
      ...CA.postes.map(([x, y]) => ({ img: () => poste3Art(!!G.flags.c4Fim, false), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: memo(placaVilaArt), x: CA.placa[0] - 0.7, y: CA.placa[1] + 1 }
    ],
    ents: [
      ...CA.serraDoor.map(([x, y]) => porta(x, y, 'serra', 32, 3, 'left')),
      ...CA.ildaDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: entrarIlda })),
      ...CA.minaDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: entrarMina })),
      ...CA.pensaoDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: pensao })),
      marcoEnt(...CA.marco),
      ...CA.parados.map(([x, y], i) => morador(i % 2 ? 'mineira' : 'mineiro', x, y, Object.assign(sonambulo(x, y, i), { talk: () => falaParado(i) }))),
      morador('menina', ...CA.crianca, { rotina: rot([28, 13, 'brincar', 400, 'down'], [26, 14, 'olhar', 300, 'left']), talk: falaZezinha }),
      { t: 'sign', x: CA.placa[0], y: CA.placa[1], h: 30, talk: async () => { await say('* "MINA DE CANDEIA — FECHADA POR ORDEM DA COROA. TRANSFERIDOS: ENTRADA PELA CAPELA. TURNO DA NOITE: o Capataz responde."'); } },
      { t: 'sign', x: CA.poco[0], y: CA.poco[1] - 1, h: 30, talk: pocoSeco }, { t: 'sign', x: CA.poco[0] + 1, y: CA.poco[1] - 1, h: 30, talk: pocoSeco },
      bauEnt('candeia', 'a', ...CA.bau, async () => { await dar('tinta', 2); await dar('cobres', 50); })
    ],
    onEnter: async () => { if (!G.flags.c4Candeia) await chegaCandeia(); }
  };
  // ===== CASA DA DONA ILDA =====
  MAPS2.ilda = { rows: ROWS4B.ilda, name: 'Casa da Dona Ilda', music: 'candeia', bg: '#1a1424',
    props: [{ img: memo(mesaArt), x: 7.6, y: 4, solid: [[8, 3, 2, 1]] }, { img: memo(() => estanteArt(2)), x: 1.8, y: 4, solid: [[2, 3, 2, 1]] }, { img: memo(cartazHArt), x: 9.6, y: 3.6 }],
    ents: [...IL.door.map(([x, y]) => porta(x, y, 'candeia', ...CA.ildaOut, 'down')),
      morador('ilda', ...IL.ilda, { rotina: rot([6, 4, 'olhar', 600, 'down'], [8, 4, 'remendar', 500, 'up']), talk: falaIlda }),
      { t: 'sign', x: IL.cadernos[0], y: IL.cadernos[1] - 1, h: 30, talk: cadernosIlda }, { t: 'sign', x: IL.estante[0], y: IL.estante[1], h: 40, talk: cadernosIlda }]
  };
  // ===== MINA DE CANDEIA =====
  MAPS2.mina = { rows: ROWS4B.mina, name: 'Mina de Candeia', music: 'afogado', batBg: bgMina, bg: '#0c0810', key: KEY_GAL, escuro: true,
    props: [
      { img: memo(trilhoArt), x: 1, y: 17.4, by: 4 }, { img: memo(vagonetaArt), x: 10, y: 17, solid: [[10, 16, 2, 1]] },
      ...MI.veios.map(([x, y], i) => ({ img: memo(() => veioArt(i % 2, true)), x: x - 0.8, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...MI.lampioes.map(([x, y]) => ({ img: memo(() => lampiaoMinaArt(true)), x: x - 0.3, y: y + 1 })),
      { img: () => G.flags.c4Capataz ? EMPTY_C : capatazArt(Math.floor(FRAME / 30) % 2, 1, false), x: MI.chefe[0] - 2.4, y: MI.chefe[1] + 1, by: 30 }
    ],
    ents: [
      { t: 'trig', x: MI.saida[0][0], y: MI.saida[0][1], w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('candeia', ...CA.minaOut, 'down'); await fadeIn(10); } },
      marcoEnt(...MI.marco),
      inimigo('m1', 'mineiro', ...MI.m1, ['mineiro', 'mineiro'], { spr: (t, d) => { const f = mineiroOcoArt(Math.floor(t / 14) % 2); return d === 'right' ? flipC(f) : f; }, h: 52, bg: bgMina }),
      inimigo('n1', 'nevoa', ...MI.n1, ['nevoa', 'mineiro'], { spr: (t) => nevoaArt(Math.floor(t / 10) % 6), h: 34, bg: bgMina }),
      inimigo('m2', 'mineiro', ...MI.m2, ['mineiro', 'nevoa', 'nevoa'], { spr: (t, d) => { const f = mineiroOcoArt(Math.floor(t / 14) % 2); return d === 'right' ? flipC(f) : f; }, h: 52, bg: bgMina }),
      inimigo('n2', 'nevoa', ...MI.n2, ['nevoa', 'nevoa', 'nevoa'], { spr: (t) => nevoaArt(Math.floor(t / 10) % 6), h: 34, bg: bgMina }),
      inimigo('x1', 'mineiro', ...MI.mix, ['mineiro', 'mineiro', 'nevoa'], { spr: (t, d) => { const f = mineiroOcoArt(Math.floor(t / 14) % 2); return d === 'right' ? flipC(f) : f; }, h: 52, bg: bgMina }),
      ...MI.veios.map(([x, y]) => ({ t: 'sign', x, y, h: 30, talk: veioMina })),
      bauEnt('mina', 'a', ...MI.bau1, () => dar('frasco', 2)), bauEnt('mina', 'b', ...MI.bau2, async () => { await dar('pluma', 1); await dar('cobres', 60); }),
      ...MI.gatilhoChefe.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: capela }))
    ],
    onEnter: async () => { if (!G.flags.c4Mina) { G.flags.c4Mina = true; await say('* A mina. Trilhos, vagonetas paradas, lampiões que alguém ainda acende. Nas paredes, os veios de âmbar estão cinzentos, ocos, como dentes sem raiz.'); await say('Isso aqui não secou. Isso foi CHUPADO.', 'rita'); await say('[Leitura: os veios foram esvaziados de dentro para fora. Há canos de cobre novos atravessando a rocha, subindo.]', 'cat'); await say('Os canos de novo. Tudo sobe para o mesmo lugar.', 'me'); } }
  };
  for (const id of ['serra', 'candeia', 'ilda', 'mina']) grade(MAPS2[id]);
  // o Jorge no Largo, pronto para subir a serra (depois da Parte 1)
  const lg = MAPS2.largo; if (lg && !lg._jorge) { lg._jorge = true; lg.ents.push(morador('jorge', 12, 13, { rotina: rot([12, 13, 'olhar', 9000, 'right']), gone: () => !G.flags.c4P1Fim || !!G.flags.c4Fim, talk: falaJorgeLargo })); }
  // a base ganha a ENFERMARIA da Dalva e a porta da GARAGEM do Jorge (depois do Cap. 4)
  const ib = MAPS2.interior; if (ib && !ib._c4) { ib._c4 = true;
    ib.ents.push(morador('dalva', 12, 4, { rotina: rot([12, 4, 'limpar', 600, 'down'], [12, 5, 'olhar', 400, 'left']), gone: () => !G.flags.c4Fim, talk: enfermaria }));
    ib.ents.push({ t: 'sign', x: 13, y: 6, h: 40, gone: () => !G.flags.c4Fim, talk: garagem });
  }
}; }
function mineArt() { return casa({ w: 5, stone: true, wall: '#5a5060', roof: '#3a3040', door: 2, doorC: '#1a1218', win: [] })(); }

// ---------- falas: subir a serra ----------
async function falaJorgeLargo() {
  await say('O 31 tá no pátio, com tanque cheio e correia nova. Candeia fica a meio dia de serra. Bora?', 'jorge');
  const c = await choose('* Subir para Candeia agora?', ['Subir a serra', 'Ainda não']);
  if (c !== 0) { await say('Quando quiserem. O 31 espera. O 31 é paciente. O motorista nem tanto.', 'jorge'); return; }
  await fadeOut(20);
  await cartao(['A serra', 'meio dia de estrada, subindo']);
  G.hora = 15 * 60; V.scene = 'world'; loadMap2('serra', ...SE.chegada, 'right'); await fadeIn(20);
  if (MAPS2.serra.onEnter) await MAPS2.serra.onEnter();
}
async function chegaSerra() {
  G.flags.c4Serra = true; save2();
  await say('* O 31 para no meio da subida, tossindo. Na frente, a estrada some numa parede de névoa branca, grossa, que não se mexe com o vento.');
  await say('Daqui o 31 não passa. Não por medo, é que eu não enxergo o capô. Eu espero aqui, motor ligado.', 'jorge');
  await say('Essa névoa... ela tá olhando pra gente.', 'lume');
  await say('Névoa não olha.', 'rita');
  await say('* A névoa olha.');
  await say('Se ela olha, ela apanha. É uma regra minha. Acabei de inventar.', 'me');
  await say('[Dica: a névoa é mais rala ao AMANHECER. Algumas coisas só aparecem quando ela abre.]', 'cat');
}
async function falaJorgeSerra() { await say(pickOne(['Vão, vão. Eu fico de olho no motor. E na névoa. Mais no motor.', 'Se precisarem voltar pra capital, é só falar comigo. O 31 desce mais rápido do que sobe.']), 'jorge'); }
async function falaVelhaSerra() {
  await say('* Uma senhora desce a serra devagar, com um lampião apagado na mão e um cesto vazio no braço.');
  await say('Eu ia buscar... alguma coisa. Lá embaixo. Pro jantar. Ou pro meu neto. Eu tinha um neto?', 'velha2');
  await say('A senhora é de Candeia?', 'lume');
  await say('De onde? ...Que nome bonito. Parece nome de vela.', 'velha2');
}
async function mirante() {
  if (G.flags.b_serra_m) { await say('* O mirante. Lá embaixo, a capital brilha, pequena. Do lado, um morro com uma torre apagada.'); return; }
  if (!amanhecer()) { await say('* Um mirante de pedra. A névoa cobre tudo; dá para ver só o próprio pé. Alguém deixou riscado na pedra: "ao nascer do sol, olhe pra baixo".'); return; }
  G.flags.b_serra_m = true; sfx('item');
  await say('* O sol nasce e a névoa abre, só por um momento. Na pedra do mirante, presa numa fenda, uma caixinha de lata que alguém escondeu pra achar depois.');
  await dar('frasco', 1); await dar('cobres', 80);
  await say('* Lá embaixo, a capital inteira acesa. E, no alto do morro, apagado ainda, o Farol de Cem Invernos.');
  await say('Que vista. Até dá pra esquecer o resto. ...Melhor não usar essa palavra aqui.', 'me');
}

// ---------- falas: Candeia ----------
async function chegaCandeia() {
  G.flags.c4Candeia = true; save2();
  await say('* Candeia. Casas de pedra subindo o morro, telhado de ardósia, chaminés frias. Nenhuma luz acesa. Nenhuma.');
  await say('* E, na frente de cada porta, alguém parado. Um mineiro com a chave na mão. Uma mulher com um balde. Um velho com o chapéu a meio caminho da cabeça. Parados. Respirando. Esperando lembrar.');
  await say('...Eles estão vivos?', 'lume');
  await say('Vivos. Só que sem o "por quê". Igual os do hospital, só que a vila inteira.', 'rita');
  await say('[Leitura: lembranças recentes ausentes em todos os moradores. Âmbar retirado das pedras E das pessoas. Ao mesmo tempo.]', 'cat');
  await say('Alguém deve ter sobrado. Sempre sobra alguém.', 'me');
}
const PARADO_FALA = [
  ['Eu ia... abrir a porta. Pra quê mesmo? A chave tá na minha mão. A porta tá na minha frente.', '(sonâmbulo) ...a chave da porteira... a velha da janela roxa tem... a velha que escreve...'],
  ['O balde. Eu ia buscar água. No poço. O poço... secou? Ou fui eu que sequei?', '(sonâmbula) ...o poço não secou... o poço DESCEU... de noite dá pra ver o fundo...'],
  ['Bom dia. Ou boa tarde. A gente aqui sabia a hora pelo sino da mina. O sino parou.', '(sonâmbulo) ...turno da noite... o Capataz conta a gente... um, dois, três... trezentos e doze...'],
  ['Eu era alguém importante. Tenho certeza. Eu tinha uma chave grande.', '(sonâmbula) ...os meninos foram pra capela... os transferidos... o Capataz canta pra eles dormirem...'],
  ['Meu chapéu. Eu ia pôr. Ou tirar. Você sabe?', '(sonâmbulo) ...de dia a capela é de pedra... de noite ela é de vidro...'],
  ['Que dia é hoje? Não precisa responder. Eu esqueço de novo.', '(sonâmbula) ...a professora escreveu tudo... ela não esquece porque escreve...'],
  ['Moço, o senhor viu meu marido? Ele tá do meu lado? Ah. Tá. Obrigada.', '(sonâmbulo) ...o vidro do poço... tem coisa brilhando lá no fundo... de noite...']
];
async function falaParado(i) {
  const F = PARADO_FALA[i % PARADO_FALA.length];
  if (ehNoite()) { await say('* De noite, os moradores andam devagar, de olhos meio abertos, e cochicham.'); await say(F[1], 'parado'); }
  else await say(F[0], 'parado');
}
async function falaZezinha() {
  if (!G.flags.c4Zezinha) { G.flags.c4Zezinha = true;
    await say('Vocês são de fora! Vocês LEMBRAM das coisas?', 'menina');
    await say('Meu avô parou na porta ontem. Ele ia me buscar na escola. Agora ele fica lá, segurando o meu casaco.', 'menina');
    await say('Eu não esqueci porque eu tava no rio, longe dos canos. A Dona Ilda também não, porque ela escreve tudo. TUDO. Até o que comeu.', 'menina');
    await say('Ela mora na casa da janela roxa. Mas só abre de DIA. De noite ela dorme cedo e não acorda nem com trovão.', 'menina');
    return;
  }
  await say(ehNoite() ? 'De noite eles andam. Dá medo. Mas eles não machucam. Só cochicham.' : 'Vocês vão trazer meu avô de volta? O de dentro dele, eu digo.', 'menina');
}
async function pocoSeco() {
  if (!ehNoite()) { await say('* O poço da praça. Seco. Um balde vazio pendurado. Lá no fundo, só escuro.'); return; }
  if (G.flags.c4Poco) { await say('* De noite, o fundo do poço brilha um pouquinho. Mais nada lá embaixo.'); return; }
  G.flags.c4Poco = true; sfx('item');
  await say('* De noite, no fundo do poço, alguma coisa brilha. Você baixa o balde... e ele volta pesado: uma lanterna de vidro com um resto de luz dentro, e um saquinho de cobres de alguém que guardava as economias no poço.');
  await dar('pluma', 1); await dar('cobres', 70);
  await say('Guardar dinheiro no poço. Gente de serra é desconfiada.', 'rita');
  await say('Eu guardo uma vila inteira dentro de mim. Quem sou eu pra falar.', 'me');
}
async function pensao() {
  W2.mv = null;
  if (ehNoite()) await say('* A porta da PENSÃO DOS TRANSFERIDOS está trancada. De dentro vem uma voz baixa, contando: "...trezentos e dez, trezentos e onze, trezentos e doze..."');
  else await say('* "PENSÃO DOS TRANSFERIDOS". Pela janela: camas desfeitas, malas sem dono, uma xícara ainda morna. Ninguém. Durante o dia, eles ficam lá embaixo.');
}
async function entrarIlda() {
  W2.mv = null;
  if (!diaUtil()) { await say('* A casa da janela roxa. Um bilhete na porta, letra firme: "Dona Ilda dorme às 18h e acorda às 7h. Volte de dia. Não bata. Eu escrevi que não era pra bater."'); return; }
  sfx('door'); await fadeOut(10); loadMap2('ilda', ...IL.entra, 'up'); await fadeIn(10);
  if (!G.flags.c4IldaVista) { G.flags.c4IldaVista = true; await say('* Por dentro, a casa é de papel. Papel nas paredes, nos móveis, no teto. Bilhetes, listas, mapas, receitas, nomes. Tudo com a mesma letra firme.'); }
}
async function falaIlda() {
  if (G.flags.c4Gatilho) { await say(pickOne(['A runa que espera é a mais difícil de todas: exige paciência. Por isso quase ninguém aprende.', 'Escreva tudo. Tudo. Quem escreve não perde.', 'O Capataz só abre a capela no turno da noite. De dia, nem vela entra lá.']), 'ilda'); return; }
  await say('Visita. Hum. Deixa eu escrever: "visita, três pessoas, uma delas é um baú". Pronto. Agora eu não esqueço.', 'ilda');
  await say('Eu sou Ilda. Fui professora de runas da escola da mina por quarenta anos. Ensinei menino a acender lampião com uma palavra.', 'ilda');
  await say('Há dois dias, os canos novos da Coroa começaram a puxar. Puxaram o âmbar das pedras... e depois o das pessoas. Eu senti puxar aqui dentro. Mas tudo o que eles puxavam eu já tinha ESCRITO. Então eu lia de novo.', 'ilda');
  await say('Os de fora, os "transferidos" da capital, chegam de carroça. O Capataz leva pra capela da mina no turno da noite. De dia a capela fica selada.', 'ilda');
  await say('Precisamos entrar. Tem um amigo nosso lá. O Dito.', 'lume');
  await say('* A Dona Ilda olha para você. Demora. Depois olha para o Grimório que aparece pela fresta da sua tampa.', 'n');
  await say('...Um Grimório com tinta de superfície. Num baú. Que DOBROU o espaço. Eu passei quarenta anos ensinando runa e nunca vi ninguém dobrar uma caixa de sapato.', 'ilda');
  await say('Eu sou só um baú. Um baú normal. Com um quarto dentro.', 'me');
  await say('Hum. Então você aprende isto aqui rapidinho. A RUNA DE GATILHO: a runa que espera.', 'ilda');
  await say('Você escreve o feitiço e não solta. Ele fica armado no ar, na frente do inimigo, e dispara sozinho quando ele se mexer. Antes do golpe dele. Mais forte. E se ele estiver se preparando pra um golpe grande, a runa quebra a guarda dele.', 'ilda');
  await say('Ou no véu: ele espera o seu amigo precisar e cuida dele na hora certa.', 'ilda');
  G.flags.c4Gatilho = true; grim().gatilho = true; sfx('rune');
  await say('* {y}RUNA DE GATILHO aprendida!{/} Agora, ao escrever uma página no Grimório (estante da base), dá para escolher "Com GATILHO": o feitiço fica armado e dispara sozinho.');
  await say('[O Capataz prepara um golpe grande, o Apito do Turno. Uma runa armada nele dispara ANTES do apito e quebra mais escudo. Recomendação: usar.]', 'cat');
  await say('E isto. A chave da porteira da mina. Era do meu marido. Ele era o sineiro do turno. Ele... está na porta lá de casa agora, segurando um chapéu.', 'ilda');
  G.flags.c4Chave = true; sfx('item');
  await say('* Você recebeu a {y}Chave da Porteira{/}. A capela só abre no TURNO DA NOITE.');
  save2();
}
async function cadernosIlda() {
  await say('* Cadernos e cadernos. "Segunda: pão, café, aula. Terça: o sino atrasou. Quarta: os canos chegaram. Quinta: o Joaquim parou na porta. Eu segurei a mão dele e li para ele o nosso casamento inteiro, do começo ao fim. Ele sorriu na parte do bolo."');
  await say('Ela leu o casamento inteiro pra ele.', 'lume');
  await say('* A Lume fica quieta um tempo. Depois cantarola baixinho, como quem anota.');
}
async function entrarMina() {
  W2.mv = null;
  if (!G.flags.c4Chave) { await say('* A porteira da mina está fechada com corrente e cadeado. Na corrente, uma plaquinha: "SINEIRO". Quem tem a chave deve ser a família do sineiro.'); return; }
  sfx('door'); await fadeOut(10); loadMap2('mina', ...MI.entra, 'up'); await fadeIn(10);
  if (MAPS2.mina.onEnter) await MAPS2.mina.onEnter();
}
async function veioMina() { await say('* Um veio de âmbar oco. Por dentro, onde devia ter luz, só a marca de um cano de cobre, como uma agulha que bebeu tudo.'); }

// ---------- a capela: o Capataz (só no turno da noite) ----------
async function capela() {
  if (G.flags.c4Capataz) return;
  W2.mv = null;
  if (!ehNoite()) {
    await say('* A entrada da capela da mina: uma grade de ferro, selada por dentro. Do outro lado, silêncio. Uma placa: "TURNO DA NOITE".');
    await say('[A capela só abre no turno da noite. Descanse num Marco até escurecer.]', 'cat');
    if (canStand(W2.x, W2.y + 1, 'player')) { W2.dir = 'down'; startMove(W2, W2.x, W2.y + 1); }
    return;
  }
  await say('* De noite, a grade está aberta. A capela da mina é pequena, de pedra, com bancos compridos. Nos bancos, gente dormindo sentada. Dezenas. Com crachá de Pavio no peito.');
  await say('* O Dito está no terceiro banco. Dorme de boca aberta, com a vassoura do Tico no colo. Ele trouxe a vassoura.');
  await say('* E na frente do altar, onde devia ter um santo, uma figura enorme feita de lampiões apagados, com um apito no peito e um livro de ponto na cintura. Ela vira a cabeça de vidro para vocês.');
  await say('PONTO. QUEM. NÃO BATEU. PONTO.', 'capataz');
  await say('A gente veio buscar um amigo.', 'rita');
  await say('TRANSFERIDO. NÃO TEM AMIGO. TEM TURNO.', 'capataz');
  await say('Eu tenho um amigo que é um baú. Eu tenho um amigo que é um lustre. Eu não tenho turno nenhum.', 'me');
  await say('[Capataz de Candeia. Fraco a luz e mordida. O APITO DO TURNO é preparado: quebre o escudo ou deixe uma Runa de Gatilho armada nele.]', 'cat');
  const r = await lutaMapa(['capataz'], { bg: bgMina, music: 'boss', pos: [[184, 162]], intro: async () => { const e = BT.foes[0]; e.phases = fasesCapataz(); e.ct = 15; callout('CAPATAZ DE CANDEIA', '#ffd8a0', 100); } });
  if (r !== 'win') return;
  G.flags.c4Capataz = true; save2();
  await fimCap4();
}
async function fimCap4() {
  await say('* O Capataz desmonta como um armário velho. Os lampiões rolam pelo chão de pedra. E, um por um, eles ACENDEM.');
  await say('* A luz corre pelos canos ao contrário. Desce. Entra pelos pés dos bancos. Os transferidos se mexem, gemem, esfregam os olhos como quem acorda num ônibus no ponto final.');
  await say('...Isso aqui é uma igreja? Por que eu tô numa igreja? Eu nem gosto de missa.', 'dito');
  await say('Dito! O Tico mandou a vassoura. Quer dizer, você trouxe. Ele vai querer de volta.', 'lume');
  await say('* O Dito olha a vassoura. Olha muito tempo. Os olhos enchem.', 'n');
  await say('Tico. ...O Tico é meu irmão. Ele tem onze anos e varre chaminé melhor que eu. Eu esqueci ele DUAS vezes.', 'dito');
  await say('E lembrou duas vezes. Isso é o que conta.', 'me');
  await say('* No chão, entre os lampiões, o livro de ponto do Capataz caiu aberto. Presa na contracapa, uma página arrancada de outro caderno, de capa preta. A letra pequena e cuidadosa.');
  await say('* "CANDEIA — 312 almas. Rendimento estimado: 40 invernos de luz. Pensões pagas." E, num canto, escrito tantas vezes que o papel quase furou, sempre riscado e reescrito, um nome: "LÍVIA".');
  await say('Lívia. Quem é Lívia?', 'lume');
  await say('Não sei. Mas quem escreveu isso escreveu esse nome mil vezes. Isso não é conta. Isso é...', 'rita');
  await say('[Registro: uma coisa que alguém não quer esquecer.]', 'cat');
  await say('* A Lume dobra a página com cuidado e guarda. Ela não fala mais nada até a saída da mina.');
  // volta para Candeia: a vila acende um pouco
  await fadeOut(30);
  G.flags.c4Fim = true; G.hora = 6 * 60;
  V.scene = 'world'; loadMap2('candeia', 17, 12, 'down'); await fadeIn(30);
  await say('* Amanhece em Candeia. Nos postes da praça, uma luz fraca, teimosa. Nas portas, os moradores piscam, olham as próprias mãos, chamam uns pelos nomes. Nem todos lembram de tudo. Mas lembram de alguma coisa.');
  await say('Vovô! VOVÔ! Você tá segurando o meu casaco!', 'menina');
  await say('* A Dona Ilda está na janela roxa, com um caderno aberto, escrevendo depressa. Ela levanta os olhos e acena com a caneta.');
  await say('A gente não salvou tudo. Os canos continuam lá. Continuam subindo.', 'rita');
  await say('Pro morro. Pro Farol.', 'lume');
  await say('Então é pra lá que a gente vai. Mas primeiro, café. E uma cama. E um banho. Eu sou um baú, mas tenho limites.', 'me');
  await fadeOut(30);
  await cartao(['Dias depois, na base', '']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Dentro do baú, um cômodo novo apareceu sozinho, como se a base soubesse. Uma maca, um armário de remédios, um cheiro de sabão.');
  await say('Eu disse que ia até o portão. Aí o portão era tão bonito que eu entrei. Enfermaria nova. Alguém tem que cuidar de vocês, que vocês não se cuidam.', 'dalva');
  await say('E do outro lado tem uma porta que dá numa GARAGEM. Com o 31 dentro. Eu não sei como. Ninguém sabe como. Eu não vou perguntar.', 'jorge');
  await say('[Registro: o Vão abriu dois cômodos novos sozinho. Isso não deveria ser possível nem para quem dobra espaço há anos. Anotado com espanto.]', 'cat');
  await say('Eu tô crescendo por dentro. Isso é bonito ou assustador?', 'me');
  await say('As duas coisas. Igual tudo que presta.', 'rita');
  save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 4', 'A Casa dos Que Esquecem', '', 'Na base: ENFERMARIA (Irmã Dalva)', 'e GARAGEM (Seu Jorge: viagem rápida)']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); await fadeIn(20);
  await say('* (O Capítulo 5 está a caminho. A base, a capital, Velhágua e Candeia continuam abertas.)');
}

// ---------- a base: enfermaria e garagem ----------
async function enfermaria() {
  const c = await choose('Enfermaria da Irmã Dalva. O que vai ser?', ['Tratamento completo (grátis)', 'Comprar frascos com selo (20 cobres)', 'Só conversar']);
  if (c === 0) { curarTudo(); sfx('heal'); await say('* A Irmã Dalva cuida de cada um: curativo, chá, bronca. Todo mundo volta com a vida cheia e sem nenhum mal-estar.'); await say('E durmam. Vocês não dormem. Eu vejo.', 'dalva'); save2(); return; }
  if (c === 1) {
    if ((G.cobres || 0) < 20) { await say('Vinte cobres, meu filho. Nem freira trabalha de graça pra Coroa.', 'dalva'); return; }
    G.cobres -= 20; G.items.frasco = (G.items.frasco || 0) + 1; sfx('item'); await say('* +1 Frasco de Âmbar (com selo). Mais barato que no bazar: a Dalva compra direto da botica das irmãs.'); return;
  }
  await say(pickOne(['O menino da perna enfaixada voltou pra casa. Lembrando da mãe. Eu fiz questão de perguntar.', 'Trinta anos de hospital. Esse é o mais esquisito. E o mais limpo.', 'A Lume guarda uma página dobrada no bolso. Ela pensa que eu não vi. Cuida dela, baú.']), 'dalva');
}
async function garagem() {
  const dest = [['Auren · Bairro Baixo', 'auren', ...POS3.auren.marco], ['Auren · Largo do Hospital', 'largo', ...POS4.largo.marco], ['Candeia', 'candeia', ...CA.marco], ['Estrada da Serra', 'serra', ...SE.marco]];
  if (G.flags.c2Init) dest.unshift(['Velhágua · Praça do Sino', 'praca', ...POS2.praca.marco]);
  const c = await choose('O 31 está na garagem, de motor quente. Pra onde?', [...dest.map(d => d[0]), 'Ficar na base']);
  if (c < 0 || c >= dest.length) { await say('Tá bom. O 31 também gosta de descansar.', 'jorge'); return; }
  const [nm, map, x, y] = dest[c];
  await say(pickOne(['Segura a tampa!', 'Cintos. Quer dizer, tampas.', 'Partiu!']), 'jorge');
  sfx('door'); await fadeOut(20); loadMap2(map, x, y + 1, 'down'); await fadeIn(20);
  await say('* O 31 some na curva, e você fica perto do Marco de ' + nm + '.');
}
