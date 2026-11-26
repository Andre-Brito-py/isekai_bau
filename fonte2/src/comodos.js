// ================= OS CÔMODOS DA BASE + O 31 COMO CASA (v107) =================
// Pedidos do usuário: "gostaria que os novos cômodos dentro do baú fossem realmente cenários que desse pra andar por
// eles... não somente esses dois espaços, mas todos, como a forja, a sala de treinamento, etc, inclusive, adicionar mais
// de uma cama". E: "o ônibus levar você pros lugares e o teletransporte da magia espacial entre marcos acabou ficando
// redundante, o ônibus pode servir para entrar e falar com os outros personagens que saíram da masmorra no T1, como o
// musgo, Ofélia, a dona Vela, a gata fantasma, etc, e cada um ter uma função".
//  - SALA (o quartinho de sempre): estante/Grimório, vela, meia, quadro. Dois RASGOS do Vão nas paredes laterais:
//    à esquerda o DORMITÓRIO, à direita a ALA NOVA (corredor).
//  - DORMITÓRIO: cama do baú (uma tampa forrada), da Lume (colcha de estrelas), da Rita (catre de quartel), beliche de
//    hóspedes, guarda-roupa e uma janela que dá para o Vão. Qualquer cama = descansar.
//  - ALA NOVA: corredor com portas para a FORJA, a SALA DE TREINO e a ENFERMARIA (lacrada até o Cap. 4) e, no fundo, o
//    portão da GARAGEM (lacrado até o Cap. 4).
//  - FORJA (da Rita): fornalha acesa, bigorna, fole, armas. A bigorna abre a forja de sempre.
//  - SALA DE TREINO: tatame, bonecos, alvo. Os bonecos abrem o TREINO: lutas contra bichos já enfrentados, sem gastar
//    nada e sem perder (perdeu, levanta; itens e vida voltam como estavam), metade da XP, nenhum cobre ou material.
//    Com a Dona Marlene em casa (herança da T1), ela é a instrutora.
//  - ENFERMARIA: macas, armário, pia, biombo; a Irmã Dalva anda por lá (o tratamento de sempre).
//  - GARAGEM: o 31 estacionado. O 31 NÃO VIAJA MAIS para destinos comuns (os Marcos já fazem isso); só as viagens de
//    história (a estrada velha do Cap. 7). Pela porta dele se entra no ÔNIBUS.
//  - DENTRO DO 31: as almas da T1 que subiram da masmorra moram ali, cada uma no seu banco, cada uma com uma função:
//      Seu Ozório (nº 9) — COZINHA: refeição que vale para as próximas 3 lutas (pastel = mais ataque e magia; caldo =
//        mais vida; café com rapadura = começa com Tensão).
//      Musgo — HORTA nas janelas: uma colheita por dia (maçã do amor ou material para a forja).
//      Ofélia — BIBLIOTECA: uma vez por dia escreve o SELO de uma fusão que o Grimório ainda não tem (2 Tintas de
//        Superfície + 30 cobres), só de elementos que vocês já conhecem.
//      Madame Pavio — VELAS E TINTAS: loja (tinta azul, tinta forte, café coado, sal grosso).
//      Dona Cida (nº 7, a gata) — FOFOCA: quantos baús escondidos ainda faltam na região de onde vocês vieram, e em
//        que mapa; e uma missão paralela aberta.
//      Profª Neide (nº 15) — AULA: perguntas sobre a viagem; cada acerto vale XP para o grupo (uma vez por pergunta).
//    O banco do motorista: o Seu Jorge (enquanto ele estiver) fica na GARAGEM, de macacão; depois, só o boné no painel.
//  OBS.: a "Dona Cida" da T1 (nº 7 do 31, a gata) não é a Dona Cida do Largo (a viúva do Inverno). Nome comum; cada
//  uma tem o seu id de fala (cidaGata x cida).
const CMD_BASES = ['interior', 'dormitorio', 'alaNova', 'forja', 'treino', 'enfermaria', 'garagem', 'onibus31'];
const ehBase = (id) => CMD_BASES.includes(id || W2.id);

// ---------- falas novas ----------
Object.assign(WHO, {
  ofelia1: { name: () => 'Ofélia', portrait: () => PT('ofelia') || PT('of'), voice: () => sfx('blipTri', 760), col: '#d8e4ff' },
  musgo1: { name: () => 'Musgo', portrait: () => PT('musgo'), voice: () => sfx('blipLow', 80), col: '#b8e0a0' },
  madame: { name: () => 'Madame Pavio', portrait: () => PT('pavio'), voice: () => sfx('blip', 880), col: '#ffe0b0' },
  cidaGata: { name: () => 'Dona Cida', portrait: () => PT('cida'), voice: () => sfx('blipTri', 980), col: '#e8d8f8' },
  ozorio: { name: () => 'Seu Ozório', portrait: () => PT('ozorio'), voice: () => sfx('blipLow', 210), col: '#ffe0c0' },
  neide: { name: () => 'Profª Neide', portrait: () => PT('neide'), voice: () => sfx('blip', 520), col: '#e0f0e0' },
  marlene: { name: () => 'Dona Marlene', portrait: () => PT('marlene'), voice: () => sfx('blip', 640), col: '#f8d8e8' }
});
const herEsc = () => ((G.her || {}).esc || {});
const coretoVeio = () => !!(G.flags && G.flags.coretoVeio);
const marleneEmCasa = () => herEsc().marlene === 'conosco' || (herEsc().marlene === 'junto' && coretoVeio());
const cmdDia = () => G.dia || 0;

// sprite de personagem da T1 (frente com 4 quadros; de lado com 2)
function spT1(k, alt) {
  return (t, dir) => {
    const S = (IMG.spf || {})[k], F = IMG.sp[k] || IMG.sp[alt];
    if (!F) return null;
    if ((dir === 'left' || dir === 'right') && S && S.s) { const fr = S.s[Math.floor(t / 30) % S.s.length]; return dir === 'right' ? flipC(fr) : fr; }
    if (dir === 'up' && S && S.b) return S.b[Math.floor(t / 30) % S.b.length];
    return F[Math.floor(t / 26) % F.length];
  };
}
const npcT1 = (id, k, x, y, o = {}) => Object.assign({ t: 'npc', id, x, y, h: (IMG.sp[k] && IMG.sp[k][0] ? IMG.sp[k][0].height : 46), spr: spT1(k, o.alt), dir: o.dir || 'down' }, o);

// ---------- portas ----------
async function irCmd(map, x, y, dir) {
  W2.mv = null; sfx('door'); await fadeOut(10);
  loadMap2(map, x, y, dir); await fadeIn(10);
  if (MAPS2[map].onEnter) await MAPS2[map].onEnter();
}
const portaCmd = (x, y, map, tx, ty, dir, gone) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone, run: () => irCmd(map, tx, ty, dir) });
const lacreCmd = (x, y, gone, txt) => ({ t: 'sign', x, y, h: 30, gone, talk: async () => { await say(txt); } });
const pr = (img, x, y, solid, o = {}) => Object.assign({ img, x, y, solid: solid ? [solid] : [] }, o);

// ---------- as salas ----------
const ROWS_CMD = {
  dormitorio: [
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'woooooooooooow',
    'woooooooooooow',
    'woooorrrrooooo',
    'woooorrrrooooo',
    'woooooooooooow',
    'wwwwwwwwwwwwww'],
  alaNova: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwowwwwwowwwwwowwwwoww',
    'woooooooooooooooooooooooo'.slice(0, 24),
    'orrrrrrrrrrrrrrrrrrrrrro',
    'wooooooooooooooooooooooo',
    'wwwwwwwwwwwwwwwwwwwwwwww'],
  forja: [
    'wwwwwwwwwwww',
    'wwwwwwwwwwww',
    'wwwwwwwwwwww',
    'wFFFFFFFFFFw',
    'wFFFFFFFFFFw',
    'wFFFFFFFFFFw',
    'wFFFFFFFFFFw',
    'wFFFFFFFFFFw',
    'wwwwwFFwwwww'],
  treino: [
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'wTTTTTTTTTTTTw',
    'wTTTTTTTTTTTTw',
    'wTTTTTTTTTTTTw',
    'wTTTTTTTTTTTTw',
    'wTTTTTTTTTTTTw',
    'wTTTTTTTTTTTTw',
    'wwwwwwTTwwwwww'],
  enfermaria: [
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
    'BZZZZZZZZZZB',
    'BZZZZZZZZZZB',
    'BZZZZZZZZZZB',
    'BZZZZZZZZZZB',
    'BZZZZZZZZZZB',
    'BBBBBZZBBBBB'],
  garagem: [
    'wwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwww',
    'wCCCCCCCCCCCCCCCCCCw',
    'wCCCCCCCCCCCCCCCCCCw',
    'CCCCCCCCCCCCCCCCCCCw',
    'CCCCCCCOCCCCCCCCCCCw',
    'CCCCCCCCCCCCCCCCCCCw',
    'wCCCLLLLLLLLLLLLCCCw',
    'wCCCCCCCCCCCCCCOCCCw',
    'wCCCCCCCCCCCCCCCCCCw',
    'wwwwwwwwwwwwwwwwwwww'],
  onibus31: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WPPPPPPPPPPPPPPPPPPPPPPPPW',
    'WPPPPPPPPPPPPPPPPPPPPPPPPW',
    'WPAAAAAAAAAAAAAAAAAAAAPPPW',
    'WPPPPPPPPPPPPPPPPPPPPPPPPW',
    'WWWWWWWWWWWWWWWWWWWWWWPWWW']
};
ROWS_CMD.alaNova[3] = 'w' + 'o'.repeat(22) + 'o';
const KEY_CMD = {
  dormitorio: { o: { t: 'piso' }, w: { t: 'parm', solid: true }, r: { t: 'tapete' } },
  alaNova: { o: { t: 'piso' }, w: { t: 'parm', solid: true }, r: { t: 'tapete' } },
  forja: { F: { t: 'pedraF' }, w: { t: 'tijolo', solid: true } },
  treino: { T: { t: 'tatame' }, w: { t: 'parm', solid: true } },
  enfermaria: { Z: { t: 'azulejo' }, B: { t: 'parB', solid: true } },
  garagem: { C: { t: 'cimento', v: 0 }, O: { t: 'cimento', v: 1 }, L: { t: 'cimento', v: 2 }, w: { t: 'tijolo', solid: true } },
  onibus31: { P: { t: 'oniP', v: 0 }, A: { t: 'oniP', v: 1 }, W: { t: 'oniW', solid: true } }
};
const NOME_CMD = { dormitorio: 'Dormitório', alaNova: 'Ala Nova', forja: 'Forja da Rita', treino: 'Sala de Treino', enfermaria: 'Enfermaria', garagem: 'Garagem', onibus31: 'Dentro do 31' };
const BG_CMD = { forja: '#1a0e10', treino: '#140c1c', enfermaria: '#101418', garagem: '#0e0e14', onibus31: '#0a0818', dormitorio: '#140c1c', alaNova: '#140c1c' };

function montarComodos() {
  const mapa = (id, props, ents, extra = {}) => { MAPS2[id] = Object.assign({ rows: ROWS_CMD[id], name: NOME_CMD[id], music: 'base', bg: BG_CMD[id], key: KEY_CMD[id], props, ents }, extra); };
  const aberto4 = () => !!G.flags.c4Fim;
  // ===== DORMITÓRIO =====
  mapa('dormitorio', [
    pr(camaBauArt, 0.9, 5, [1, 3, 2, 2]),
    pr(criadoArt, 3.05, 4.1, [3, 3, 1, 1]),
    pr(janelaVaoArt, 4.6, 2.75, null, { by: 1 }),
    pr(camaLumeArt, 6.95, 5, [7, 3, 2, 2]),
    pr(criadoArt, 9.05, 4.1, [9, 3, 1, 1]),
    pr(camaRitaArt, 9.95, 5, [10, 3, 2, 2]),
    pr(belicheArt, 0.95, 8, [1, 6, 2, 2]),
    pr(guardaRoupaArt, 10.05, 8, [10, 7, 2, 1])
  ], [
    { t: 'sign', x: 1, y: 4, h: 30, talk: () => camaDorm('bau') }, { t: 'sign', x: 2, y: 4, h: 30, talk: () => camaDorm('bau') },
    { t: 'sign', x: 7, y: 4, h: 30, talk: () => camaDorm('lume') }, { t: 'sign', x: 8, y: 4, h: 30, talk: () => camaDorm('lume') },
    { t: 'sign', x: 10, y: 4, h: 30, talk: () => camaDorm('rita') }, { t: 'sign', x: 11, y: 4, h: 30, talk: () => camaDorm('rita') },
    { t: 'sign', x: 1, y: 7, h: 50, talk: () => camaDorm('hosp') }, { t: 'sign', x: 2, y: 7, h: 50, talk: () => camaDorm('hosp') },
    { t: 'sign', x: 3, y: 3, h: 22, talk: () => say('* Um criado-mudo com uma vela que a Lume acendeu "por educação". Na gaveta: um botão, um pião, um bilhete de passagem do 31, picotado.') },
    { t: 'sign', x: 5, y: 3, h: 30, passa: true, talk: falaJanelaVao },
    { t: 'sign', x: 10, y: 7, h: 50, talk: falaGuardaRoupa }, { t: 'sign', x: 11, y: 7, h: 50, talk: falaGuardaRoupa },
    portaCmd(13, 5, 'interior', 1, 5, 'right'), portaCmd(13, 6, 'interior', 1, 6, 'right')
  ], { onEnter: async () => { if (!G.flags.cmdDorm) { G.flags.cmdDorm = true; await say('* Um quarto que não existia ontem. Três camas, cada uma com a cara de quem vai dormir nela, e um beliche de sobra.'); await say('Ele fez uma cama de TAMPA pra você. Eu não sei se isso é fofo ou se é um insulto.', 'rita'); await say('É fofo. É muito fofo. A minha tem estrelas!', 'lume'); await say('[Registro: o Vão abriu um cômodo com mobília. Mobília. O espaço dobrado não deveria saber o que é um travesseiro.]', 'cat'); } } });
  MAPS2.dormitorio.props.splice(2, 0, pr(() => portaVaoLado(), 13, 7, null, { by: 2, dx: 1 }));

  // ===== ALA NOVA (corredor) =====
  mapa('alaNova', [
    pr(() => rasgoVaoArt(), -0.05, 5, null, { by: 2 }),
    pr(() => portaCmdArt('#e85a28'), 3.6, 3, null, { by: 1 }),
    pr(() => portaCmdArt('#9aa264'), 9.6, 3, null, { by: 1 }),
    pr(() => portaCmdArt('#f2f2f2', !aberto4()), 15.6, 3, null, { by: 1 }),
    pr(() => quadroRetratoArt('#5a7aa8'), 6.4, 2.4, null, { by: 0 }),
    pr(() => quadroRetratoArt('#a85a6a'), 12.4, 2.4, null, { by: 0 }),
    pr(() => quadroRetratoArt('#6aa87a'), 18.6, 2.4, null, { by: 0 }),
    pr(vasoArtCmd, 1.05, 4, [1, 3, 1, 1]), pr(vasoArtCmd, 22.05, 4, [22, 3, 1, 1]),
    pr(() => portaCmdArt('#c8a0ff', !coretoVeio()), 20.6, 3, null, { by: 1 }),
    pr(() => aberto4() ? portaoGaragemArt() : portaCmdArt('#8a8a9a', true), 22.9, 6, null, { by: 3 })
  ], [
    portaCmd(0, 4, 'interior', 12, 5, 'left'),
    portaCmd(4, 2, 'forja', 5, 7, 'up'), portaCmd(10, 2, 'treino', 6, 8, 'up'),
    portaCmd(16, 2, 'enfermaria', 5, 7, 'up', () => !aberto4()), lacreCmd(16, 2, aberto4, '* Uma porta pregada com tábuas. Atrás dela, cheiro de sabão e de nada. [O Vão ainda não abriu este cômodo.]'),
    portaCmd(21, 2, 'coreto', 7, 10, 'up', () => !coretoVeio()), lacreCmd(21, 2, coretoVeio, '* Uma porta que não estava aqui. Sem placa, sem maçaneta. Encostando a tampa, dá para ouvir, bem baixinho, uma valsa.'),
    ...[3, 4, 5].map(y => portaCmd(23, y, 'garagem', 1, 6, 'right', () => !aberto4())),
    ...[3, 4, 5].map(y => lacreCmd(23, y, aberto4, '* Um portão de enrolar, fechado. Do outro lado, um silêncio grande, do tamanho de um ônibus.')),
    { t: 'sign', x: 6, y: 2, h: 20, passa: true, talk: () => say('* Um retrato pintado à mão: um ônibus de lado, com gente acenando de todas as janelas. Alguém escreveu embaixo: "linha 31, a última viagem".') },
    { t: 'sign', x: 12, y: 2, h: 20, passa: true, talk: () => say('* Um retrato de uma cidade que afunda e de um sino que voltou para a torre. A tinta ainda cheira.') },
    { t: 'sign', x: 18, y: 2, h: 20, passa: true, talk: () => falaRetratoBranco() }
  ], { onEnter: async () => { if (!G.flags.cmdAla) { G.flags.cmdAla = true; await say('* Do outro lado do rasgo, um corredor. Um CORREDOR. Dentro de um baú. Com tapete.'); await say('Forja, treino... e essas aí pregadas. Ele vai abrindo conforme a gente precisa.', 'rita'); await say('[Registro: o interior passou de "quartinho" a "casa". Recomendo não contar isso para ninguém que estude magia espacial.]', 'cat'); } } });

  // ===== FORJA =====
  mapa('forja', [
    pr(() => fornalhaArt(), 4.6, 4, [5, 3, 2, 1]),
    pr(rackLancasArt, 0.95, 4, [1, 3, 2, 1]),
    pr(escudoParedeArt, 8.9, 2.6, null, { by: 0 }), pr(escudoParedeArt, 2.9, 2.6, null, { by: 0 }),
    pr(foleArt, 7.6, 4.1, [8, 3, 1, 1]),
    pr(bigornaArtCmd, 4.55, 6.05, [5, 5, 2, 1]),
    pr(baldeArt, 2.6, 6.05, [3, 5, 1, 1]),
    pr(bancadaArt, 8.6, 8, [9, 7, 2, 1]),
    pr(carvaoArt, 1, 8, [1, 7, 2, 1])
  ], [
    { t: 'sign', x: 5, y: 5, h: 24, talk: () => falaForja() }, { t: 'sign', x: 6, y: 5, h: 24, talk: () => falaForja() },
    { t: 'sign', x: 5, y: 3, h: 50, talk: falaFornalha }, { t: 'sign', x: 6, y: 3, h: 50, talk: falaFornalha },
    { t: 'sign', x: 1, y: 3, h: 40, talk: () => say(pickOne(['Lança de aço, lança de bronze, lança cega pra treino. Uma lança pra cada humor.', 'Não encosta nessa aí. Essa eu ainda tô decidindo se gosto.']), 'rita') },
    { t: 'sign', x: 9, y: 7, h: 24, talk: () => say('* Uma bancada com martelinhos, uma lima, um pedaço de tampa de baú que a Rita usa para testar fio. Tem uma marca de mordida nele.') },
    portaCmd(5, 8, 'alaNova', 4, 3, 'down'), portaCmd(6, 8, 'alaNova', 4, 3, 'down')
  ], { onEnter: async () => { if (!G.flags.cmdForja) { G.flags.cmdForja = true; await say('* A forja ganhou parede de tijolo, chaminé e uma fornalha que acende sozinha quando a Rita entra.'); await say('Isso. ISSO. Agora sim. Sai da frente, que eu vou fazer barulho.', 'rita'); } } });

  // ===== SALA DE TREINO =====
  mapa('treino', [
    pr(rackArmasArt, 0.95, 4, [1, 3, 2, 1]),
    pr(lousaTaticaArt, 5.9, 2.7, null, { by: 0 }),
    pr(alvoArt, 11.75, 4.1, [12, 3, 1, 1]),
    pr(() => bonecoArt(treinoGolpe(3)), 2.7, 6, [3, 5, 1, 1]),
    pr(() => bonecoArt(treinoGolpe(6)), 5.7, 6, [6, 5, 1, 1]),
    pr(() => bonecoArt(treinoGolpe(9)), 8.7, 6, [9, 5, 1, 1]),
    pr(sacoArt, 11.0, 8, [11, 7, 1, 1]),
    pr(bancoArt, 0.95, 9, [1, 8, 2, 1])
  ], [
    ...[3, 6, 9].map(x => ({ t: 'sign', x, y: 5, h: 44, talk: () => menuTreino() })),
    { t: 'sign', x: 12, y: 3, h: 30, talk: () => say('* Um alvo de palha. Tem flecha nele, mas ninguém aqui usa arco. A Rita diz que "veio assim".') },
    { t: 'sign', x: 6, y: 2, h: 20, passa: true, talk: () => say('* Uma lousa de tática: três bolinhas (vocês), dois X (eles) e uma seta escrita "QUEBRA O ESCUDO PRIMEIRO" sublinhada três vezes.') },
    { t: 'sign', x: 11, y: 7, h: 40, talk: () => say('* Um saco de pancada. Você dá uma mordidinha de teste. Areia. Muita areia.') },
    npcT1('marlene', 'marlene', 8, 7, { alt: 'neide', dir: 'left', gone: () => !marleneEmCasa() || (coretoVeio() && ehNoite()), talk: () => falaMarleneTreino(), spr: marleneSpr }),
    portaCmd(6, 9, 'alaNova', 10, 3, 'down'), portaCmd(7, 9, 'alaNova', 10, 3, 'down')
  ], { batBg: bgTreino, onEnter: async () => { if (!G.flags.cmdTreino) { G.flags.cmdTreino = true; await say('* Tatame, bonecos de palha, um alvo e uma lousa de tática. A sala tem cheiro de suor velho, que não é de ninguém daqui.'); await say('Aqui a gente treina contra o que já enfrentou. Perdeu, levanta. Não custa nada além de orgulho.', 'rita'); if (marleneEmCasa()) await say('E eu dou aula! Setenta e oito anos, bobes no cabelo e espada na mão. Ninguém sai daqui sem saber guardar.', 'marlene'); } } });

  // ===== ENFERMARIA =====
  mapa('enfermaria', [
    pr(macaArt, 0.9, 5, [1, 3, 2, 2]), pr(macaArt, 3.9, 5, [4, 3, 2, 2]),
    pr(piaArt, 6.85, 4.1, [7, 3, 1, 1]),
    pr(armarioRemArt, 8.95, 4.1, [9, 3, 2, 1]),
    pr(biomboArtCmd, 0.95, 8, [1, 6, 2, 2]),
    pr(plantaArtCmd, 10.05, 8, [10, 7, 1, 1])
  ], [
    { t: 'sign', x: 1, y: 4, h: 30, talk: () => macaDalva() }, { t: 'sign', x: 2, y: 4, h: 30, talk: () => macaDalva() },
    { t: 'sign', x: 4, y: 4, h: 30, talk: () => macaDalva() }, { t: 'sign', x: 5, y: 4, h: 30, talk: () => macaDalva() },
    { t: 'sign', x: 9, y: 3, h: 46, talk: () => say('* Um armário de remédios com etiquetas na letra miúda da Dalva: "Febre", "Tosse", "Tristeza (chá)", "Lume (NÃO DEIXAR ELA PEGAR)".') },
    { t: 'sign', x: 7, y: 3, h: 28, talk: () => say('* Uma pia de louça. A água sai morna e com cheiro de sabão de coco. Não tem cano nenhum por trás.') },
    morador('dalva', 7, 5, { rotina: rot([7, 5, 'limpar', 500, 'up'], [4, 6, 'olhar', 400, 'up'], [9, 5, 'olhar', 400, 'up']), talk: enfermaria }),
    portaCmd(5, 8, 'alaNova', 16, 3, 'down'), portaCmd(6, 8, 'alaNova', 16, 3, 'down')
  ]);

  // ===== GARAGEM =====
  mapa('garagem', [
    pr(busArt, 3.4, 9.1, [4, 6, 12, 3]),
    pr(bancadaGarArt, 16.9, 5.1, [17, 3, 2, 2]),
    pr(pneusArt, 1.05, 5, [1, 4, 1, 1]),
    pr(galaoArt, 2.2, 4.2, [2, 3, 1, 1]),
    pr(conesArt, 16.9, 11, [17, 10, 1, 1]),
    pr(lampadaC, 9.3, 3.2, null, { by: 0 })
  ], [
    { t: 'sign', x: 13, y: 8, h: 50, talk: entrarOnibus }, { t: 'sign', x: 14, y: 8, h: 50, talk: entrarOnibus },
    { t: 'sign', x: 17, y: 4, h: 36, talk: () => say('* Uma bancada de mecânico: chave de boca, chave de roda, um rádio de pilha sem pilha e uma foto colada com fita: o 31 novinho, com um motorista de bigode preto na porta.') },
    { t: 'sign', x: 1, y: 4, h: 24, talk: () => say('* Pneus empilhados. Um deles é de outro mundo: o desenho da borracha é de folhas.') },
    npcT1('jorge', 'jorge', 16, 9, { dir: 'left', gone: () => !aberto4() || !!G.flags.c7Jorge, talk: () => garagem() }),
    ...[5, 6, 7].map(y => portaCmd(0, y, 'alaNova', 22, 4, 'left'))
  ], { onEnter: async () => { if (!G.flags.cmdGaragem) { G.flags.cmdGaragem = true; await say('* A garagem. Chão de cimento, mancha de óleo, cheiro de borracha quente. E o 31, inteiro, parado no meio, como se estivesse esperando no ponto.'); if (!G.flags.c7Jorge) await say('Bem-vindos à garagem! Ele não precisa mais rodar à toa: a tampa de vocês leva a gente mais rápido. Mas entra lá dentro. Tem gente querendo ver vocês.', 'jorge'); } } });

  // ===== DENTRO DO 31 =====
  const props31 = [];
  for (let x = 2; x <= 23; x += 3) props31.push(pr(() => janela31Art(), x - 0.1, 1.9, null, { by: 0 }));
  for (const x of [3, 6, 9, 12, 15, 18]) { props31.push(pr(() => bancoOnibusArt(false), x, 3.1, [x, 2, 2, 1])); props31.push(pr(() => bancoOnibusArt(true), x, 6.05, [x, 5, 2, 1])); }
  props31.push(pr(() => bancoOnibusArt(false), 1, 3.1, [1, 2, 1, 1]));
  props31.push(pr(() => fogareiroArt(Math.floor(W2.t / 9) % 6), 3.25, 2.9, null, { by: 50 }));
  props31.push(pr(hortaArt, 6.05, 2.95, null, { by: 50 }));
  props31.push(pr(livrosArt, 9.05, 2.95, null, { by: 50 }));
  props31.push(pr(() => velasPavioArt(), 12.05, 2.95, null, { by: 50 }));
  props31.push(pr(lousaNeideArt, 15.1, 2.95, null, { by: 50 }));
  props31.push(pr(almofadaArt, 18.3, 2.75, null, { by: 49 }));
  props31.push(pr(catracaArt, 20.2, 6, [20, 5, 1, 1]));
  for (const x of [8.4, 14.4]) props31.push(pr(barraArt, x, 6, null));
  props31.push(pr(volanteArt, 21.9, 4.2, [22, 2, 3, 1]));
  props31.push(pr(() => G.flags.c7Jorge ? bonetArt() : EMPTY_C, 23.3, 2.6, null, { by: 60 }));
  mapa('onibus31', props31, [
    npcT1('ozorio', 'ozorio', 4, 3, { dir: 'down', talk: falaOzorio }),
    npcT1('musgo1', 'musgo', 7, 3, { dir: 'down', talk: falaMusgo }),
    npcT1('ofelia1', 'ofelia', 10, 3, { dir: 'down', alt: 'clara', talk: falaOfelia }),
    npcT1('madame', 'pavio', 13, 3, { dir: 'down', talk: falaMadame }),
    npcT1('neide', 'neide', 16, 3, { dir: 'down', talk: falaNeide }),
    npcT1('cidaGata', 'cida', 18, 2, { dir: 'down', talk: falaCidaGata }),
    { t: 'sign', x: 22, y: 2, h: 30, talk: falaBancoMotorista }, { t: 'sign', x: 23, y: 2, h: 30, talk: falaBancoMotorista },
    { t: 'sign', x: 20, y: 5, h: 30, talk: () => say('* A catraca. Trava no 31, como sempre travou. Tem um adesivo: "PASSE LIVRE PARA ALMAS". Letra do Tiago, o cobrador.') },
    { t: 'sign', x: 1, y: 2, h: 30, talk: () => say(G.flags.c7Jorge ? '* O banco do fundo. Era onde a Lume cantava, na outra vida. Alguém deixou ali um caderninho de música, aberto na página do 31.' : '* O banco do fundo. Era onde a Lume cantava, na outra vida. A Lume senta um segundo, fecha os olhos e levanta rápido, como quem encostou numa lembrança quente.') },
    portaCmd(22, 6, 'garagem', 14, 9, 'down')
  ], { onEnter: chegaOnibus31 });

  // ===== O CORETO (v108): o coreto de Velhágua, nas costas do Seu Valdir, atravessou o Vão atrás da valsa =====
  mapa('coreto', [
    pr(() => jabutiCoretoArt(), 4.25, 7.1, [5, 5, 6, 2]),
    pr(() => lampiaoPracaArt(), 2.55, 5, [3, 4, 1, 1]), pr(() => lampiaoPracaArt(), 11.55, 5, [12, 4, 1, 1]),
    pr(bancoArt, 1.9, 10, [2, 9, 2, 1]), pr(bancoArt, 10.9, 10, [11, 9, 2, 1]),
    pr(canteiroCmd, 3.4, 8.1, null), pr(canteiroCmd, 10.2, 8.1, null)
  ], [
    ...[5, 6, 7, 8, 9, 10].map(x => ({ t: 'sign', x, y: 6, h: 60, talk: falaValdir })),
    npcT1('marleneC', 'marlene', 3, 7, { dir: 'right', gone: () => !(herEsc().marlene === 'junto' || ehNoite()), talk: () => falaMarleneCoreto(), spr: marleneSpr }),
    { t: 'sign', x: 2, y: 9, h: 20, talk: () => say('* Um banco de praça de Velhágua, com uma plaquinha: "Doação da Banda Municipal". Ainda tem o risco de canivete: V + M, 1972.') },
    { t: 'sign', x: 3, y: 4, h: 44, talk: () => say('* Um lampião de praça. Ele acende sozinho quando alguém começa a valsa.') },
    portaCmd(7, 11, 'alaNova', 21, 3, 'down')
  ], { music: 'valsa', key: { ' ': { t: 'escuro', solid: true }, ';': { t: 'grama' }, ',': { t: 'pedra' } }, rows: [
    '               ',
    ' ;;;;;;;;;;;;; ',
    ' ;;;;;;;;;;;;; ',
    ' ;;;,,,,,,,;;; ',
    ' ;;,,,,,,,,,;; ',
    ' ;;,,,,,,,,,;; ',
    ' ;;,,,,,,,,,;; ',
    ' ;;;,,,,,,,;;; ',
    ' ;;;;;,,,;;;;; ',
    ' ;;;;;,,,;;;;; ',
    ' ;;;;;;,;;;;;; ',
    '       ,       '], name: 'O Coreto', bg: '#1a0c30' });
  if (!CMD_BASES.includes('coreto')) CMD_BASES.push('coreto');

  for (const id of CMD_BASES.slice(1)) { const m = MAPS2[id]; m.baked = null; for (const p of m.props) { if (p._hld) continue; const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } }

  // ===== a SALA (interior) ganha as passagens; cama, forja, Dalva e o sinal da garagem saem daqui =====
  const IB = MAPS2.interior;
  if (IB && !IB._cmd) {
    IB._cmd = true;
    IB.rows = IB.rows.map((r, y) => (y === 5 || y === 6) ? 'o' + r.slice(1, 13) + 'o' : r); IB.baked = null;
    IB.props = IB.props.filter(p => !((p.x === 1 && p.y === 8) || (p.x === 11 && p.y === 8)));
    IB.ents = IB.ents.filter(e => !(e.t === 'sign' && ((e.x <= 2 && e.y === 6) || (e.x >= 11 && e.y === 7) || (e.x === 13 && e.y === 6))) && e.id !== 'dalva');
    IB.props.push(pr(() => rasgoVaoArt(), -0.05, 7, null, { by: 2 }), pr(() => rasgoVaoArt(), 13.1, 7, null, { by: 2 }));
    IB.props.push(pr(() => gradeHLD(vasoArtCmd()), 11.05, 8, [11, 7, 1, 1]), pr(() => gradeHLD(vasoArtCmd()), 2.05, 8, [2, 7, 1, 1]));
    IB.ents.push(portaCmd(0, 5, 'dormitorio', 12, 5, 'left'), portaCmd(0, 6, 'dormitorio', 12, 6, 'left'));
    IB.ents.push(portaCmd(13, 5, 'alaNova', 1, 4, 'right'), portaCmd(13, 6, 'alaNova', 1, 4, 'right'));
  }
}
function portaVaoLado() { return rasgoVaoArt(); }
{ const _mm = montarMapas2; montarMapas2 = function () { const r = _mm.apply(this, arguments); try { montarComodos(); } catch (e) { console.error('comodos', e); } return r; }; }

// ---------- dormitório ----------
async function camaDorm(k) {
  const fala = { bau: '* A sua cama: uma tampa de baú virada, forrada com um cobertor de lã. Encaixa direitinho. Descansar?', lume: '* A cama da Lume, de colcha de estrelas. Ela diz que você pode deitar "só se for pra conversar". Descansar?', rita: '* O catre da Rita: lençol esticado de quartel, botas alinhadas. Ninguém deita aqui sem pedir. Você pede. Descansar?', hosp: '* O beliche de hóspedes. Lençol limpo, travesseiro fofo. Ainda ninguém usou. Descansar?' }[k];
  const c = await choose(fala, ['Até a manhã', 'Até a noite', 'Agora não'], 'n', 2);
  if (c === 2 || c < 0) return;
  await fadeOut(20); curarTudo(); if (c === 0 || hora() > 19 * 60 + 30) G.dia = (G.dia || 0) + 1; G.hora = c === 0 ? 7 * 60 : 19 * 60 + 30;
  save2(); loadMap2(W2.id, W2.x, W2.y, W2.dir); await fadeIn(20);
  await say(c === 0 ? pickOne(['* Cada um na sua cama, pela primeira vez. A Rita ronca baixinho. A Lume fala dormindo uma nota só. Você dorme de tampa fechada. É a melhor noite desde a masmorra.', '* A janela do Vão pisca a noite inteira, devagar. De manhã, a Lume diz que sonhou que o baú era uma casa. "Ele é", responde a Rita, ainda de olho fechado.']) : '* Um cochilo comprido. Quando vocês acordam, lá fora já é noite. Aqui dentro, a vela continua igual.');
}
async function falaJanelaVao() { await say(pickOne(['* Uma janela. Do lado de fora, o Vão: violeta, fundo, cheio de pontinhos que não são estrelas. Um deles pisca de volta.', '* A Lume encosta a testa no vidro. "Se a gente abrir, cai onde?" Ninguém responde. Ninguém abre.'])); }
async function falaGuardaRoupa() { await say(pickOne(['* O guarda-roupa: o casaco da Rita, o xale da Lume, e uma prateleira vazia com uma plaquinha: "roupas do baú (?)".', '* Em cima do guarda-roupa, uma caixinha vermelha. Dentro, nada. Você tem a impressão de que ela está esperando uma meia.'])); }

// ---------- forja ----------
async function falaFornalha() { await say(G.flags.bigorna ? pickOne(['* A fornalha ronca. O calor tem cheiro de ferro e de pão.', 'Não põe a mão. Não põe a TAMPA. Eu tô vendo você.']) : '* A fornalha está fria. Sem bigorna, a Rita nem acende.', G.flags.bigorna && Math.random() < 0.5 ? 'rita' : 'n'); }

// ---------- treino ----------
const TREINO_CAP = { 2: ['corvo', 'lambe', 'caranguejo', 'sapo', 'cacador', 'mariposa', 'bandido'], 3: ['cinza', 'rato'], 4: ['pesadelo', 'lencol', 'nevoa', 'mineiro'], 5: ['vigia', 'mvidro', 'guardaR'], 6: ['caoLanterna'], 7: ['ratoVelaA', 'cogumeloA', 'morcegoSelo'], 8: ['friagem', 'apagador', 'loboFuligem', 'geadaViva'], 9: ['sentinela', 'gralha', 'mariposaA'] };
let TREINO_T = 0;
function treinoGolpe(x) { return W2.id === 'treino' && TREINO_T > W2.t && Math.abs(W2.x - x) <= 1; }
function treinoLista() {
  const c = capAtual(), L = [];
  for (let k = 2; k <= Math.min(c, 9); k++) for (const id of TREINO_CAP[k] || []) if (ENEMY2[id] && !ENEMY2[id].boss) L.push(id);
  return L;
}
async function menuTreino(marlene) {
  const quem = marlene ? 'marlene' : 'rita';
  const c = await choose(marlene ? 'Aula de hoje: escolhe com quem vocês vão apanhar. Ninguém se machuca de verdade aqui, só o orgulho.' : 'Treino. Contra o que a gente já enfrentou. Perdeu, levanta; não gasta nada. Vale metade da experiência.', ['Montar uma luta', 'Como funciona?', 'Agora não'], quem, 2);
  if (c === 1) { await say('[TREINO: lutas contra bichos que vocês já enfrentaram, no tatame. Itens usados voltam, a vida volta, ninguém perde nada. Ganha metade da XP e nenhum cobre ou material. Até 3 inimigos.]', 'cat'); return; }
  if (c !== 0) return;
  const L = treinoLista(), grupo = [];
  while (grupo.length < 3) {
    const its = L.map(id => ({ label: ENEMY2[id].name, right: 'PV ' + ENEMY2[id].mhp, d: 'Força ' + ENEMY2[id].atk + ' · Defesa ' + ENEMY2[id].def + (ENEMY2[id].weak && ENEMY2[id].weak.length ? ' · fraco a ' + ENEMY2[id].weak.join(', ') : '') }));
    if (grupo.length) its.unshift({ label: '>> LUTAR (' + grupo.map(id => ENEMY2[id].name).join(', ') + ')', col: '#ffd060', d: 'Começa a luta com quem já está na fila.' });
    const i = await list({ x: 20, y: 20, w: 200, maxVis: 9, title: 'Treino: inimigo ' + (grupo.length + 1) + ' de até 3', items: its, desc: n => its[n] && its[n].d, descY: 170 });
    if (i < 0) { if (!grupo.length) return; break; }
    if (grupo.length && i === 0) break;
    grupo.push(L[i - (grupo.length ? 1 : 0)]);
  }
  await lutaTreino(grupo, quem);
}
async function lutaTreino(grupo, quem) {
  const itens0 = { ...G.items }, pt0 = JSON.parse(JSON.stringify(G.pt || {})), volta = [W2.x, W2.y, W2.dir];
  TREINO_T = W2.t + 40; sfx('hit');
  await fadeOut(12);
  const foes = grupo.map((id, i) => { const [x, y] = FOE_POS[i]; const d = ENEMY2[id]; return { id, x, y: d.fly ? y - 46 : y }; });
  const res = await battle2({ party: grupoAtual(), foes, music: 'luta2', bg: bgTreino, tension: 0, treino: true, quitLabel: 'Levantar e voltar ao tatame', loseTxt: '* Todo mundo no chão do tatame. Só o orgulho saiu ferido.' });
  G.items = itens0; G.pt = pt0;
  V.scene = 'world'; loadMap2('treino', volta[0], volta[1], volta[2]); await fadeIn(12);
  if (res === 'win') await say(pickOne(['Isso! Assim! Mais uma e eu deixo vocês jantarem.', 'Bom. Agora de novo, sem a parte em que alguém quase caiu.', 'Viu? Quem treina apanha menos lá fora.']), quem);
  else await say(pickOne(['Levanta. Água. De novo.', 'Perder aqui é de graça. Lá fora custa caro. Por isso a gente perde aqui.']), quem);
}
// metade da XP no treino; nada de cobre/material (a luta não passa pelo lutaMapa)
{ const _xpI = xpInimigo; xpInimigo = function (id) { const v = _xpI(id); return BT.cfg && BT.cfg.treino ? Math.max(1, Math.round(v / 2)) : v; }; }
// a Dona Marlene não tem quadro de frente na herança: usa o boneco humano
function marleneSpr(t, dir) { if (!HUMS.marlene) HUMS.marlene = { h: 44, skin: '#e0b8a0', hair: '#e8e4f0', top: '#c86a8a', bottom: '#5a3a5a', acc: '#c8c8d8' }; return humSpr('marlene')(t, dir); }

// ---------- enfermaria ----------
async function macaDalva() {
  if (!G.flags.c4Fim) return;
  await say(pickOne(['* Uma maca com lençol esticado e uma dobra no canto, do jeito que a Dalva gosta. Deitar sem ela mandar é pedir bronca.', '* Na maca, um travesseiro com o bordado "DESCANSA". É uma ordem.']));
}

// ---------- garagem ----------
// (o 31 não leva mais a lugares comuns: os Marcos já levam. Só as viagens da história ficam.)
garagem = async function () {
  if (G.flags.c7Jorge) { await say('* O 31 na garagem. A chave no contato. O banco do motorista, vazio, com a marca de quem sentou ali cinquenta anos.'); if (!G.flags.c7GaragemVazia) { G.flags.c7GaragemVazia = true; await say('...Ninguém mais sabe dirigir ele.', 'rita'); await say('Eu sei. Eu sei o caminho de cor. Eu só não sei dirigir.', 'lume'); } return; }
  if (typeof c7Ativo === 'function' && c7Ativo() && !G.flags.c7Chegou) {
    const c = await choose('O 31 está de tanque cheio. Pra estrada velha das minas?', ['Partir agora', 'Esperar a noite e partir', 'Ainda não'], 'jorge', 2);
    if (c === 2 || c < 0) return;
    if (c === 1) { G.hora = 20 * 60; await say('* Vocês esperam a noite na garagem, ouvindo o Seu Jorge contar como era a estrada de terra da cidade dele. Ele erra o nome da cidade duas vezes.'); }
    await viagemEstrada(); return;
  }
  if (typeof c7Ativo === 'function' && c7Ativo() && G.flags.c7Chegou) {
    const c = await choose('O 31 sobe a serra de novo. Pro acampamento da mina?', ['Subir a serra', 'Ainda não'], 'jorge', 1);
    if (c === 0) { await say('Segura a tampa!', 'jorge'); sfx('door'); await fadeOut(20); loadMap2('acampamento', AC7.chegada[0] + 1, AC7.chegada[1], 'right'); await fadeIn(20); }
    return;
  }
  await say(pickOne(['O 31 descansa. Quem viaja agora é a tampa de vocês, mais rápido que qualquer motor. Mas a casa de muita gente é ele. Entra lá, dá boa noite.', 'Troquei a correia. Não precisava. Precisava era mexer em alguma coisa.', 'Se um dia a estrada pedir, ele liga de primeira. Ele sempre liga de primeira pra quem precisa.']), 'jorge');
};
async function entrarOnibus() {
  if (!G.flags.c4Fim) return;
  await irCmd('onibus31', 22, 5, 'left');
}
// volta da serra (Cap. 7): cai na garagem, não mais no quartinho
falaJorge7 = async function () {
  if (G.flags.c7Broca) { await say(pickOne(['Vocês vão descer mais? Eu tenho um guincho no 31. Cento e vinte metros de cabo. Se precisar, eu desço atrás.', 'Eu sonhei com uma garagem cheia de ônibus parados. Todos eram o 31. Acordei com saudade de uma coisa que eu não sei o que é.']), 'jorge'); }
  else await say(pickOne(['Motor quente. Pode ir sossegado.', 'Os pinheiros daqui cheiram igual os da estrada da minha cidade. Qual era mesmo...?', 'Se a Guarda vier, eu digo que tô perdido. É verdade há uns quarenta anos.']), 'jorge');
  const c = await choose('* Voltar com o 31?', ['Voltar para a base', 'Ficar'], 'jorge', 1);
  if (c === 0) { await say('Segura a tampa!', 'jorge'); sfx('door'); await fadeOut(20); loadMap2('garagem', 15, 9, 'left'); playMusic('base'); await fadeIn(20); await say('* A garagem da base. O 31 estala, esfriando. (Para voltar à serra: fale com o Seu Jorge.)'); }
};

// ---------- dentro do 31 ----------
async function chegaOnibus31() {
  if (G.flags.cmd31) return;
  G.flags.cmd31 = true;
  await say('* Lá dentro, o 31 é o 31: banco azul, barra cromada, catraca. Mas tem fogareiro no fundo, horta nas janelas, livro em cima dos bancos e vela acesa em todo canto.');
  await say('* E gente. Gente que você conhece de outra vida, de outra masmorra. As almas do 31 que subiram com vocês.');
  await say('Olha quem chegou! Senta, senta. Aqui ninguém paga passagem.', 'ozorio');
  await say('...Casa.', 'musgo1');
  await say('Não fiquem parados na porta, isso aqui não é ponto de ônibus. Quer dizer. É. Mas não fiquem.', 'ofelia1');
  await say('Seu Ozório! Profª Neide! Dona Cida! ...Vocês estão TODOS aqui?', 'lume');
  await say('Onde mais a gente ia morar, menina? O 31 é a única casa que todo mundo aqui tem em comum.', 'cidaGata');
  await say('[Registro: as almas do 31 vivem dentro do ônibus, que vive dentro do baú. Cada uma oferece uma coisa. Falem com todo mundo.]', 'cat');
  save2();
}
async function falaBancoMotorista() {
  if (G.flags.c7Jorge) { await say('* O banco do motorista. O boné do Seu Jorge está no painel. Ninguém tirou. Ninguém vai tirar.'); return; }
  await say('* O banco do motorista, gasto no formato de uma pessoa. O Seu Jorge está lá fora, na garagem, mexendo no motor que não precisa de conserto.');
}

// Seu Ozório — COZINHA
const REFEICOES = {
  pastel: { nm: 'Pastel de Queijo, três e cinquenta', preco: 30, d: 'Ataque e magia do grupo +12% nas próximas 3 lutas.' },
  caldo: { nm: 'Caldo de Feira', preco: 30, d: 'Vida máxima do grupo +15% nas próximas 3 lutas.' },
  rapadura: { nm: 'Café com Rapadura', preco: 25, d: 'O grupo começa as próximas 3 lutas com +25 de Tensão.' }
};
async function falaOzorio() {
  const R = G.refeicao;
  const c = await choose(R && R.n > 0 ? `Ainda tá no bucho o ${REFEICOES[R.k].nm} (mais ${R.n} luta${R.n > 1 ? 's' : ''}). Quer trocar?` : 'Olha o pastel! Três e cinquenta! ...Brincadeira, aqui é cobre. Vai comer o quê?', ['Comer alguma coisa', 'Conversar', 'Nada'], 'ozorio', 2);
  if (c === 1) { await say(pickOne(['Eu esqueci quase tudo lá embaixo, sabe. Mas a massa eu lembro. A mão lembra.', 'O fiado? Que fiado? ...Tá anotado. Num caderno. Que eu perdi. Tá perdoado, então.', 'A Profª Neide corrige até o cardápio. "Pastel" não leva acento, ela disse. Eu sei, Neide. Eu sei.']), 'ozorio'); return; }
  if (c !== 0) return;
  const ks = Object.keys(REFEICOES);
  const its = ks.map(k => ({ label: REFEICOES[k].nm, right: REFEICOES[k].preco + 'c', disabled: (G.cobres || 0) < REFEICOES[k].preco, d: REFEICOES[k].d }));
  const i = await list({ x: 20, y: 30, w: 200, title: `Cozinha do 31   ${G.cobres || 0} cobres`, items: its, desc: n => its[n] && its[n].d, descY: 150 });
  if (i < 0) return;
  const k = ks[i], R2 = REFEICOES[k];
  if ((G.cobres || 0) < R2.preco) { await say('Sem cobre, sem pastel. É a lei da feira.', 'ozorio'); return; }
  G.cobres -= R2.preco; G.refeicao = { k, n: 3 }; sfx('heal');
  await say(`* O Seu Ozório serve ${R2.nm}. ${R2.d}`);
  await say(pickOne(['Come devagar. Ninguém vai roubar. ...A Rita vai. Come rápido.', 'Isso aqui segura qualquer monstro. Pergunta pro Musgo.']), 'ozorio');
}
{ const _b2R = battle2; battle2 = function (cfg) {
  const p = _b2R.apply(this, arguments);
  try {
    const R = G.refeicao;
    if (R && R.n > 0 && cfg && !cfg.treino) {
      for (const m of BT.party) {
        if (R.k === 'pastel') { m.atk = Math.round(m.atk * 1.12); m.mag = Math.round(m.mag * 1.12); }
        if (R.k === 'caldo') { const a = Math.round(m.mhp * 0.15); m.mhp += a; if (m.hp > 0) m.hp += a; }
      }
      if (R.k === 'rapadura') BT.tension = Math.min(100, (BT.tension || 0) + 25);
      R.n--; if (R.n <= 0) G.refeicao = null;
    }
  } catch (e) { console.error(e); }
  return p;
}; }

// Musgo — HORTA
async function falaMusgo() {
  if ((G.flags.cmdHorta ?? -1) === cmdDia()) { await say(pickOne(['...Amanhã. Cresce.', '...Planta não tem pressa. Musgo também não.', '...Rega. Espera. Pronto.']), 'musgo1'); return; }
  G.flags.cmdHorta = cmdDia();
  const r = Math.random();
  await say(pickOne(['...Colhe.', '...Nasceu. Leva.', '...Pra vocês.']), 'musgo1');
  if (r < 0.55) { G.items.maca = (G.items.maca || 0) + 1; sfx('item'); await say('* O Musgo arranca uma maçã vermelha e brilhante da horta da janela. +1 Maçã do Amor. (Não é do festival. É melhor.)'); }
  else { const m = r < 0.8 ? 'orvalhoN' : 'palhaEnc'; G.mat = G.mat || {}; G.mat[m] = (G.mat[m] || 0) + 1; sfx('item'); await say(`* O Musgo entrega, com todo o cuidado do mundo, ${MAT2[m].nm}. (Material: a forja usa.)`); }
  if (!G.flags.cmdHortaDica) { G.flags.cmdHortaDica = true; await say('[A horta do Musgo dá uma colheita por dia. Durmam numa cama para o dia virar.]', 'cat'); }
}

// Ofélia — BIBLIOTECA (selos de fusão)
async function falaOfelia() {
  const Gm = typeof grim === 'function' ? grim() : null;
  const c = await choose('Biblioteca do fundo do ônibus. Silêncio. O que é?', ['Pesquisar um selo de fusão', 'Conversar', 'Nada'], 'ofelia1', 2);
  if (c === 1) { await say(pickOne(['Trezentos anos numa sala afogada e eu vim morar num ônibus. Com um pasteleiro. A vida depois da morte é cheia de rebaixamentos.', 'O Grimório de vocês tem a minha letra nas margens. De nada. Não precisam agradecer. Agradeçam.', 'O Musgo lê por cima do meu ombro. Ele não sabe ler. Ele gosta das figuras. Eu deixo.', herEsc().ofelia ? 'Às vezes eu respondo quando alguém me chama de Clara. Às vezes não. As duas são verdade.' : 'Tem um nome que eu não lembro. Fica na ponta da língua. Se vocês acharem, me avisem. Ou não. Tanto faz. Me avisem.']), 'ofelia1'); return; }
  if (c !== 0) return;
  if (!Gm || !Gm.ativo) { await say('Sem Grimório, sem selo. Tragam o livro primeiro. Eu não escrevo em parede.', 'ofelia1'); return; }
  if ((G.flags.cmdSelo ?? -1) === cmdDia()) { await say('Um selo por dia. Selo é coisa séria. Durmam. Voltem amanhã.', 'ofelia1'); return; }
  const els = Gm.elems || [], faltam = Object.keys(FUS3).filter(k => { const [a, b] = k.split('+'); return els.includes(a) && els.includes(b) && !Gm.fus[k]; });
  if (!faltam.length) { await say('Vocês já têm todos os selos dos elementos que conhecem. Aprendam um elemento novo e me procurem. Eu espero. Eu sou boa nisso.', 'ofelia1'); return; }
  const ts = G.items.tintaS || 0;
  const its = faltam.map(k => { const [a, b] = k.split('+'); return { label: EL3[a].nm + ' + ' + EL3[b].nm, right: '2 tintas · 30c', disabled: ts < 2 || (G.cobres || 0) < 30, d: '??? — a Ofélia escreve o selo; o nome e o efeito aparecem quando ficar pronto.' }; });
  const i = await list({ x: 14, y: 24, w: 212, maxVis: 9, title: `Selos   tinta ${ts} · ${G.cobres || 0}c`, items: its, desc: n => its[n] && its[n].d, descY: 170 });
  if (i < 0) return;
  if (ts < 2 || (G.cobres || 0) < 30) { await say('Duas Tintas de Superfície e trinta cobres. Tinta pra escrever, cobre pro chá. Não negocio o chá.', 'ofelia1'); return; }
  const k = faltam[i]; G.items.tintaS -= 2; G.cobres -= 30; G.flags.cmdSelo = cmdDia();
  ganharSelo(k); sfx('rune');
  await say(`* A Ofélia escreve devagar, com a pena molhada na tinta de fuligem. O selo acende no papel: {y}${FUS3[k].nm}{/}. ${FUS3[k].d}.`);
  await say(FUS3[k].nota || 'Pronto. Tracem no Grimório. E não manchem.', 'ofelia1');
}

// Madame Pavio — VELAS E TINTAS
async function falaMadame() {
  const c = await choose('Madame Pavio, velas e tintas, desde antes de vocês terem tampa. Comprar, meu bem?', ['Comprar', 'Conversar', 'Nada'], 'madame', 2);
  if (c === 0) { await loja('madame', 'madame'); return; }
  if (c === 1) await say(pickOne(['E NÃO, eu não sou desses Pavios de casaco cinza que andam por aí. Eu sou vela. Vela de verdade. De cera de abelha.', 'O seu baú virou gente, é? Hm. Bonito. A Lume que se cuide.', 'Cada vela minha dura exatamente o tempo de uma conversa boa. Já testei com o Seu Ozório. Ele fala MUITO.']), 'madame');
}

{ const _e3M = estoque3; estoque3 = function (id) {
  if (id !== 'madame') return _e3M(id);
  const c = capAtual(), L = [], add = (k, preco) => L.push({ k, preco: preco || ITEM2[k].preco });
  add('tinta', 18); if (c >= 4) add('tintaF', 50); add('cafe', 26); add('salG', 32); add('tintaS', 30);
  return L;
}; }

// Dona Cida (a gata) — FOFOCA
async function falaCidaGata() {
  const reg = REGIAO_DE[(G.baseVolta || {}).map] || REGIAO_DE[(G.pos || {}).map];
  const fal = [];
  if (reg) for (const id of Object.keys(MAPS2)) {
    if (REGIAO_DE[id] !== reg) continue;
    for (const e of MAPS2[id].ents || []) if (e.t === 'chest' && !G.flags['b_' + id + '_' + e.id] && !(e.gone && e.gone())) fal.push(MAPS2[id].name || id);
  }
  await say(pickOne(['Senta aqui, mala. A Dona Cida sabe de tudo. Gato escuta pela parede.', 'Fofoca fresquinha, meu bem. Mas fala baixo, que a Ofélia tá lendo.', 'Rrrr. Eu andei por aí de madrugada. Vi coisa.']), 'cidaGata');
  if (fal.length) { const cont = {}; for (const n of fal) cont[n] = (cont[n] || 0) + 1; const [nm, n] = Object.entries(cont).sort((a, b) => b[1] - a[1])[0]; await say(`Pela região de onde vocês vieram ainda tem ${fal.length} baú${fal.length > 1 ? 's' : ''} escondido${fal.length > 1 ? 's' : ''} que ninguém abriu. ${n > 1 ? 'Uns ' + n : 'Um'} em ${nm}. Eu vi. Eu sentei em cima.`, 'cidaGata'); }
  else await say('Baú escondido por aqui? Nenhum. Vocês limparam tudo. Que gente sem mistério.', 'cidaGata');
  let side = [];
  try { side = (missoes() || []).filter(M => M.tipo === 'side'); } catch (e) { }
  if (side.length) { const M = pickOne(side); await say(`E tem gente precisando de vocês: "${M.tit}". ${M.desc || ''}`, 'cidaGata'); }
}

// Profª Neide — AULA
const AULA_NEIDE = [
  { id: 'q31', req: () => true, p: 'Chamada! Qual era o número do ônibus?', ops: ['31', '32', '13'], ok: 0 },
  { id: 'qbanco', req: () => true, p: 'E o meu banco, qual era? Quem prestou atenção na chamada sabe.', ops: ['7', '15', '22'], ok: 1 },
  { id: 'qpastel', req: () => true, p: 'Quanto custava o pastel do Seu Ozório, na feira de segunda?', ops: ['Dois reais', 'Três e cinquenta', 'Cinco e vinte'], ok: 1 },
  { id: 'qsino', req: f => f.c2Fim, p: 'Velhágua afundava porque o primeiro sino agarrava as estacas da cidade. Como chamavam o sino?', ops: ['Dona Iolanda', 'Dona Badalada', 'Dona Dalva'], ok: 1 },
  { id: 'qpap', req: f => f.c3Init, p: 'Quem é a dona da Papelaria Pena & Fuligem, em Auren?', ops: ['Dona Iolanda', 'Dona Ilda', 'Irmã Dalva'], ok: 0 },
  { id: 'qtico', req: f => f.c3Init, p: 'O Tico, o limpa-chaminé, tinha um irmão que virou Pavio. Qual o nome dele?', ops: ['Dito', 'Lino', 'Tonho'], ok: 0 },
  { id: 'qtinta', req: f => f.c3Init, p: 'A Tinta de Superfície leva fuligem, óleo de lamparina e...?', ops: ['Sal grosso', 'Lágrima de quem escreve', 'Mel'], ok: 1 },
  { id: 'qserra', req: f => f.c4Fim, p: 'Qual cidade da serra fica embaixo de uma névoa que olha?', ops: ['Candeia', 'Velhágua', 'Auren'], ok: 0 },
  { id: 'qcaderno', req: f => f.c5Fim, p: 'O Acendedor-Mor anota nomes num caderno. De que cor?', ops: ['Vermelho', 'Preto', 'Âmbar'], ok: 1 },
  { id: 'qmina', req: f => f.c7Fim, p: 'De onde sobe o âmbar que corre pelos canos até a capital?', ops: ['Da Mina de Origem', 'Do rio de Velhágua', 'Do Farol'], ok: 0 },
  { id: 'qinverno', req: f => f.c8Fim, p: 'No Inverno Escuro, como vocês acenderam Auren?', ops: ['Com um raio', 'À mão, bairro por bairro', 'Com o Farol'], ok: 1 }
];
async function falaNeide() {
  const f = G.flags, feitas = f.cmdAula || {}, Q = AULA_NEIDE.filter(q => q.req(f) && !feitas[q.id]);
  if (!Q.length) { await say(pickOne(['Sem aula hoje. Vocês já sabem tudo o que eu sei. Vão viver um pouco pra eu ter o que perguntar.', 'Trinta e duas redações. Eu ainda corrijo de cabeça, antes de dormir. Hábito.']), 'neide'); return; }
  const c = await choose('Aula! Uma pergunta. Acertou, aprendeu. Errou, aprendeu também, mas dói mais.', ['Pode perguntar', 'Depois, professora'], 'neide', 1);
  if (c !== 0) return;
  const q = Q[0], r = await choose(q.p, q.ops, 'neide');
  if (r === q.ok) {
    (f.cmdAula = feitas)[q.id] = true;
    const xp = 18 + capAtual() * 8; let sub = 0;
    for (const k of partyKeys()) { const nv = nvDe(k); nv.xp += xp; while (nv.xp >= xpProx(nv.lv)) { nv.xp -= xpProx(nv.lv); nv.lv++; sub++; } }
    sfx('item'); await say(`Certo! Dez. +${xp} de experiência para cada um.${sub ? ' (E alguém subiu de nível!)' : ''}`, 'neide');
  } else await say('Errado. Pensa mais um pouco e volta. A pergunta continua aqui, me esperando, igual eu.', 'neide');
}

// ---------- mapa/rotas: toda a base conta como "dentro do baú" ----------
{ const _rp = rotaPara; rotaPara = function (de, para) { return _rp(ehBase(de) && de !== 'interior' ? 'interior' : de, para); }; }
for (const id of CMD_BASES.slice(1)) if (typeof REGIAO_DE === 'object') { /* sem região: o mapa mostra "dentro do baú" */ }
{ const _mz = missoes; missoes = function () { const L = _mz(); for (const M of L) { if (M.map === 'interior' && M.at && M.at[0] === 13 && M.at[1] === 6) { M.map = 'garagem'; M.at = [14, 9]; } if (M.map === 'interior' && M.at && M.at[0] === 12 && M.at[1] === 4) { M.map = 'enfermaria'; M.at = [7, 5]; } } return L; }; }


// ================= O SEU VALDIR E O CORETO (v108) =================
// Pedido do usuário: "a Dona Marlene tinha um marido, certo? onde ele está? pode adicionar ele?"
// T1: Seu Valdir Souza (banco 4), casado com a Marlene há 52 anos, virou o JABUTI DO CORETO na masmorra (ele É o lugar
// onde os dois dançaram; não sai dali). marleneFate 'conosco' = ela veio, ele ficou em paz; 'junto' = os dois ficaram.
// Agora: a Lume toca a VALSA DO CORETO (aprendida na T1) dentro do baú; o Vão "escuta" um lugar que responde à mesma
// música, e o coreto inteiro atravessa, com o Seu Valdir dormindo embaixo. Ninguém sabe explicar (proeza do Vão).
//  - 'conosco': a Marlene (Sala de Treino) tem a opção "O Seu Valdir..." -> cena.
//  - 'junto': o retrato em branco da Ala Nova vira o gatilho (a Lume cantarola a valsa); os dois chegam juntos.
//  - Depois: porta lilás na Ala Nova -> O CORETO (praça de bolso no Vão). A Marlene fica no treino de dia e no coreto de
//    noite (se 'junto', sempre no coreto). Função: BAILE NO CORETO, 1x por dia: o grupo começa as 3 próximas lutas
//    adiantado na vez (G.valsa). O Valdir fala devagar, dorme no meio da frase.
Object.assign(WHO, { valdir: { name: () => 'Seu Valdir', portrait: () => PT('valdir'), voice: () => sfx('blipLow', 110), col: '#d8e8c0' } });
Object.assign(TRACKS, { valsa: { bpm: 88, bars: 8, chords: 'C G Am F C Dm G C', bass: 'root5', bassVol: 0.08,
  lead: 'E6:8 G6:4 E6:4 | D6:8 B5:4 D6:4 | C6:8 E6:4 A6:4 | A6:8 G6:4 F6:4 | E6:8 G6:4 C7:4 | B6:6 A6:2 F6:8 | D6:8 G6:4 B6:4 | C7:16',
  leadWave: 'triangle', leadVol: 0.075, arp: { rate: 4, vol: 0.014, pat: [0, 2, 1, 2] }, drums: '', hatVol: 0 } });

async function falaMarleneTreino() {
  if (coretoVeio() || herEsc().marlene !== 'conosco') return menuTreino(true);
  const c = await choose('Aula? Ou veio fofocar com a velha?', ['Treinar', 'Perguntar do Seu Valdir', 'Nada'], 'marlene', 2);
  if (c === 0) return menuTreino(true);
  if (c === 1) return cenaValdir('conosco');
}
async function falaRetratoBranco() {
  if (herEsc().marlene === 'junto' && G.flags.c4Fim && !coretoVeio()) return cenaValdir('junto');
  await say(coretoVeio() ? '* O retrato agora tem pintura: um coreto de noite, com luzinhas, e dois velhinhos dançando. Ninguém pintou.' : '* Um retrato em branco, com a moldura pronta. A Rita diz que é "pra próxima".');
}
async function cenaValdir(modo) {
  if (modo === 'conosco') {
    await say('O Valdir? ...Ficou. Lá embaixo. Ele não podia sair, ele É o coreto, o lugar onde a gente dançou cinquenta e dois anos de sábado.', 'marlene');
    await say('Ele mandou eu ir. "Vai, Marlene, eu fico, eu sou praça agora." Teimoso. Eu fui. Eu sou mais teimosa, mas fui.', 'marlene');
    await say('Eu sei a valsa dele. A Valsa do Coreto. Eu aprendi lá embaixo, lembra? A banda tocou uma última vez.', 'lume');
  } else {
    await say('* O retrato em branco. A Lume para na frente dele e, sem perceber, começa a cantarolar uma valsa. A Valsa do Coreto, que ela aprendeu lá embaixo.');
    await say('...Engraçado. Eu sempre lembro do Seu Valdir e da Dona Marlene quando passo aqui. Eles ficaram juntos, lá no coreto. Eu espero que eles estejam dançando.', 'lume');
  }
  await say('[Leitura: o Vão está... respondendo. Há um lugar, longe, que conhece esta mesma música. Ele está do outro lado da dobra.]', 'cat');
  const c = await choose('* A tampa vibra no ritmo. Deixar a Lume tocar a valsa inteira?', ['Tocar a valsa', 'Agora não'], 'n', 1);
  if (c !== 0) { await say(modo === 'conosco' ? 'Tudo bem, menina. Eu esperei cinquenta e dois anos. Espero mais um pouco.' : '* A Lume para no meio do compasso. O corredor fica quieto de novo.', modo === 'conosco' ? 'marlene' : 'n'); return; }
  playMusic('valsa'); await fadeOut(30);
  await cartao(['A Valsa do Coreto', 'um, dois, três; um, dois, três']);
  await say('* A Lume toca. A valsa enche o corredor, a sala, as camas, o 31 lá na garagem. O Seu Ozório para de mexer a panela. A Ofélia fecha o livro.');
  await say('* No fim do corredor, entre a enfermaria e a garagem, a parede ondula como água. Uma porta aparece. Do outro lado, um lampião de praça acende sozinho.');
  await say('[Registro: um LUGAR inteiro atravessou o Vão atrás de uma música. Um coreto. Com um jabuti embaixo. Anotado. Não entendido. Nunca vou entender.]', 'cat');
  G.flags.coretoVeio = true; save2();
  V.scene = 'world'; loadMap2('coreto', 7, 10, 'up'); await fadeIn(30);
  await say('* Uma praça de bolso, flutuando no violeta. No meio, um jabuti enorme dormindo, com o coreto de Velhágua inteiro nas costas: grade, colunas, telhado vermelho e um varal de luzinhas que pisca no tempo da valsa.');
  if (modo === 'conosco') {
    await say('VALDIR! Seu velho teimoso! Você veio! De casco e tudo!', 'marlene');
    await say('...Marlene... ...você... demorou...', 'valdir');
    await say('EU demorei?! Você virou uma PRAÇA!', 'marlene');
    await say('...Eu ouvi... a nossa música... e vim... atrás... Lugar também... sente saudade...', 'valdir');
    await say('* A Dona Marlene sobe os degraus do coreto, senta na grade, encosta a cabeça no casco dele. Ninguém fala nada por um tempo bom.');
  } else {
    await say('Ora, se não é a mala! A gente ouviu a valsa lá de baixo e o teimoso aqui levantou. Cinquenta e dois anos sem levantar pra nada, e levantou pra isso.', 'marlene');
    await say('...Era... a nossa música... Quem toca a nossa música... é de casa...', 'valdir');
  }
  await say('Ele vai morar aqui? Dentro do baú? Um coreto dentro de um baú?', 'rita');
  await say('...Eu sou... um coreto... dentro de um jabuti... dentro de um baú... Tá tudo... certo...', 'valdir');
  await say('[O CORETO: uma vez por dia, um baile. O grupo dança a valsa e começa as próximas 3 lutas adiantado na vez.]', 'cat');
  save2();
}
async function falaValdir() {
  if ((G.flags.valsaDia ?? -1) === cmdDia()) { await say(pickOne(['...Zzz... ...um, dois, três... ...zzz...', '...Amanhã... tem baile... de novo... Hoje eu... descanso o casco...', '...A Marlene... ainda pisa no meu pé... cinquenta e dois anos... e eu nunca... reclamei...']), 'valdir'); return; }
  const c = await choose('...Baile...? ...Sábado... é todo dia... agora...', ['Dançar a valsa', 'Conversar', 'Deixar ele dormir'], 'valdir', 2);
  if (c === 1) { await say(pickOne(['...Banco quatro... do 31... Eu sentava... do lado da janela... Ela... do corredor... Pra me ver... olhando a rua...', '...A banda... tocou até o fim... O maestro... ia gostar... de saber...', '...Eu não lembro... da minha casa... Mas lembro... de onde ela gostava... de sentar... Isso basta...']), 'valdir'); return; }
  if (c !== 0) return;
  G.flags.valsaDia = cmdDia(); G.valsa = { n: 3 };
  playMusic('valsa'); await fadeOut(16);
  await say('* As luzinhas do coreto acendem no tempo. A Rita dança com a lança encostada, sem graça e sem errar o passo. A Lume dança com a tampa do baú, rindo. ' + (marleneEmCasa() ? 'A Dona Marlene puxa a Rita pela mão: "Assim não, menina. Ombro pra baixo."' : ''));
  await fadeIn(16); sfx('heal');
  await say('[Valsa do Coreto: nas próximas 3 lutas, o grupo começa adiantado na vez.]', 'cat');
}
async function falaMarleneCoreto() {
  await say(pickOne(['Ele dorme mais do que fala. Sempre foi assim. Eu falo pelos dois.', 'Sábado agora é todo dia. Vem dançar, mala. Ninguém aqui repara em quem não tem pé.', 'Cinquenta e dois anos e ele ainda dorme no meio do baile. Tá vendo? Amor é isso.']), 'marlene');
}
{ const _b2V = battle2; battle2 = function (cfg) {
  const p = _b2V.apply(this, arguments);
  try { const V3 = G.valsa; if (V3 && V3.n > 0 && cfg && !cfg.treino) { for (const m of BT.party) m.ct = Math.min(95, (m.ct || 0) + 35); V3.n--; if (V3.n <= 0) G.valsa = null; } } catch (e) { console.error(e); }
  return p;
}; }
