// ================= CAPÍTULO 7 — A MINA DE ORIGEM (Parte 1: a estrada, o acampamento e as bombas) =================
// A etiqueta do barril leva à MINA DE ORIGEM, na serra de trás. O Seu Jorge leva o grupo no 31 pela ESTRADA VELHA
// (minijogo; de dia tem cancela, de noite só o farol). No ACAMPAMENTO da mina: a Guarda que saiu de Auren, os Pavios
// mineiros, a cozinheira, o cão. Só se entra na mina DE NOITE e de PAVIO (turno das bombas; a placa diz a resposta).
// GALERIAS DE BOMBEAMENTO: VÁLVULAS e vapor; no alto, A BROCA (mini-chefe) e o elemento ÂMBAR. Depois, o Coração (cap7b).
// Opcionais que pedem VIAGEM (o Marco e o 31 levam de volta): a lanterna do Zé para Candeia (Dona Ilda), o cão Sabugo
// e o pão do Afonso (Vila dos Pavios), a semente do Guarda-Musgo (Seu Benedito, Cidade Alta), a página da Ofélia
// (Dona Iolanda, Auren).
Object.assign(TRACKS, {
  serra7: { bpm: 96, bars: 4, chords: 'Am F C G', bass: 'root5', bassVol: 0.08,
    lead: 'A4:2 C5:2 E5:4 D5:2 C5:2 A4:4 | F4:2 A4:2 C5:4 E5:4 D5:4 | C5:2 E5:2 G5:4 E5:2 D5:2 C5:4 | B4:2 D5:2 G5:4 F5:4 E5:4',
    leadWave: 'triangle', leadVol: 0.05, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: 'k.......s.......', hatVol: 0.015 },
  bombas7: { bpm: 104, bars: 4, chords: 'Dm Dm Bb C', bass: 'oct8', bassVol: 0.1,
    lead: 'D5:2 .:2 F5:2 .:2 A5:4 G5:4 | F5:2 .:2 E5:2 .:2 D5:8 | Bb4:2 D5:2 F5:4 E5:2 D5:2 C5:4 | C5:2 E5:2 G5:4 A5:8',
    leadWave: 'square', leadVol: 0.04, arp: { rate: 2, vol: 0.012, oct: 0 }, drums: 'k...h.k.s...h...', hatVol: 0.03 },
  coracao7: { bpm: 60, bars: 4, chords: 'Em C Am B', bass: 'root5', bassVol: 0.06,
    lead: 'B4:8 E5:8 | C5:8 G5:8 | A4:8 E5:8 | F#5:8 D#5:8', leadWave: 'sine', leadVol: 0.05, arp: { rate: 4, vol: 0.01, oct: 1 }, drums: '', hatVol: 0 },
  andar1: { bpm: 84, bars: 4, chords: 'C Am F G', bass: 'root5', bassVol: 0.06,
    lead: 'E5:4 G5:4 C6:8 | A5:4 E5:4 C5:8 | F5:4 A5:4 C6:4 A5:4 | G5:8 .:8', leadWave: 'triangle', leadVol: 0.045, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: '', hatVol: 0 },
  perda: { bpm: 56, bars: 4, chords: 'Am F C E', bass: 'root5', bassVol: 0.05,
    lead: 'E5:8 C5:8 | A4:8 C5:4 D5:4 | E5:8 G5:8 | G#5:16', leadWave: 'sine', leadVol: 0.05, arp: { rate: 4, vol: 0.008, oct: 1 }, drums: '', hatVol: 0 }
});
Object.assign(HUMS, {
  bina: { h: 46, skin: '#8a5a3a', hair: '#2a1a1a', hairStyle: 'coque', top: '#a8503a', bottom: '#4a3a2a', apron: '#f2ecdc' },
  tonho: { h: 50, skin: '#c8a088', hair: '#3a2a1a', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra }
});
Object.assign(WHO, {
  bina: { name: () => 'Dona Bina', portrait: () => portHum('bina'), voice: voz(460), col: '#ffe0d0' },
  tonho: { name: () => 'Tonho', portrait: () => portHum('tonho'), voice: voz(300, 'blipLow'), col: '#e8e0d8' }
});
Object.assign(EQ2, {
  lanternaZe: { nm: 'Lanterna do Zé', slot: 'amuleto', who: ['lume', 'bau', 'rita'], mod: { mag: 3, mdef: 2 }, fx: [], preco: 0, d: 'A lanterna de mina do Zé Candeeiro, devolvida pela família. +3 MAG, +2 RESIST.' },
  florMusgo: { nm: 'Flor do Musgo', slot: 'amuleto', who: ['bau', 'lume', 'rita'], mod: { def: 3, mdef: 3, mhp: 12 }, fx: [], preco: 0, d: 'Nasceu da semente do Guarda-Musgo, na estufa da Cidade Alta. +3 DEF, +3 RESIST, +12 PV.' },
  coleiraSabugo: { nm: 'Coleira do Sabugo', slot: 'amuleto', who: ['rita', 'bau'], mod: { atk: 3, spd: 2 }, fx: [], preco: 0, d: 'O Sabugo deu de presente (mordendo). +3 ATQ, +2 VEL.' }
});
const c7Ativo = () => !!(G.flags && G.flags.c7Init && !G.flags.c7Fim);
const caoSpr = (t, d) => { const c = caoMapaArt(Math.floor(t / 10) % 2, !!G.flags.c7Sabugo); return d === 'left' ? flipC(c) : c; };
{ const _mm7 = montarMapas2; montarMapas2 = function () {
  _mm7.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== ACAMPAMENTO DA MINA DE ORIGEM =====
  MAPS2.acampamento = { rows: ROWS7.acampamento, key: KEY7, name: 'Serra · Acampamento da Mina de Origem', music: 'serra7', batBg: bgMinaOrigem, bg: '#141828', showMoney: true,
    procurado: true, get stealth() { return c7Ativo() && !G.flags.c7Coracao; }, grupoLuz: ['guardaR', 'caoLanterna'], reinicio: () => AC7.chegada,
    falaOlhou: falaOlhou6, pegoTxt: pegoTxt6, tutPego: async () => { if (!G.flags.tutAcamp7) { G.flags.tutAcamp7 = true; await say('[A Guarda que saiu de Auren está aqui. Mesmas regras: de PAVIO e DE NOITE, ninguém olha. De dia, longe dos cones.]', 'cat'); } },
    props: [
      { img: busArt, x: AC7.onibus[0] - 1, y: AC7.onibus[1] + 2, solid: [[AC7.onibus[0] - 1, AC7.onibus[1], 6, 2]] },
      { img: bocaMinaArt, x: 25, y: 10 },
      { img: () => canoAmbarArt(12, false), x: 29, y: 9.6, by: 9 * TS },
      { img: () => canoAmbarArt(10, true), x: 52.2, y: 19, by: 9 * TS },
      ...AC7.barracas.map(([x, y, w]) => ({ img: () => barracaGuardaArt(w), x, y })),
      { img: galpaoBombasArt, x: AC7.galpao[0], y: AC7.galpao[1] },
      { img: () => barracaGuardaArt(8), x: AC7.refeit[0], y: AC7.refeit[1] },
      ...AC7.vagonetes.map(([x, y]) => ({ img: memo(vagonetaArt), x: x - 0.4, y: y + 1 })),
      { img: () => fogueiraArt(Math.floor(W2.t / 8)), x: AC7.fogueira[0] - 0.2, y: AC7.fogueira[1] + 1, solid: [[...AC7.fogueira, 1, 1]] },
      ...AC7.arvores.map(([x, y], i) => ({ img: () => pinheiroArt(i), x: x - 0.6, y: y + 1, solid: [[x, y, 1, 1]], arvore: true })),
      ...AC7.postes.map(([x, y]) => ({ img: () => o7('lampM' + ehNoite(), () => lampiaoMinaArt(ehNoite())), x: x + 0.05, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    ents: [
      { t: 'trig', x: AC7.boca[0][0], y: AC7.boca[0][1], w: 2, h: 1, passa: true, run: entrarBombas },
      marcoEnt(...AC7.marco),
      morador('jorge', ...AC7.jorge, { dir: 'right', gone: () => !!G.flags.c7Jorge, rotina: rot([6, 28, 'limpar', 400, 'right'], [8, 29, 'olhar', 300, 'up']), talk: falaJorge7 }),
      morador('bina', ...AC7.cozinheiro, { dir: 'up', gone: () => ehNoite(), rotina: rot([44, 31, 'limpar', 300, 'up'], [47, 31, 'carregar', 200, 'right']), talk: falaBina }),
      { t: 'sign', id: 'sabugo', x: AC7.cao[0], y: AC7.cao[1], h: 20, spr: caoSpr, talk: falaSabugo },
      morador('tonho', ...AC7.pavios[0], { dir: 'down', rotina: rot([30, 18, 'carregar', 260, 'down'], [30, 21, 'empilhar', 260, 'down']), talk: falaTonho }),
      morador('pavio', ...AC7.pavios[1], { id: 'pavioMin', dir: 'left', gone: () => !ehNoite(), rotina: rot([35, 23, 'acender', 200, 'left'], [40, 23, 'acender', 200, 'right']), talk: async () => { await say(pickOne(['Boa noite. Eu bombeio o âmbar da Coroa.', 'Boa noite. Eu bombeio. Eu... de onde eu era?']), 'pavioG'); } }),
      { t: 'sign', x: AC7.placa[0], y: AC7.placa[1], h: 30, talk: async () => { await say('* PLACA DOS TURNOS. "DIA: PERFURAÇÃO (equipe de fora). NOITE: GALERIA DAS BOMBAS (Pavios). CORAÇÃO: só com ordem do Acendedor-Mor."'); G.flags.c7Placa = true; } },
      bauEnt('acampamento', 'b1', ...AC7.bau, async () => { await dar('frasco', 2); await dar('cobres', 60); }),
      ...AC7.rondas.map((p, i) => ({ t: 'ronda', id: 'guardaA' + i, x: p[0][0], y: p[0][1], path: p, h: 56, passo: 24, spr: guardaSpr6, dir: 'right', gone: () => !c7Ativo() || !!G.flags.c7Coracao, talk: async () => { await say(pickOne(['Serra fria. Turno longo.', 'Mandaram a gente da capital pra cá. Diz que tem baú com dente rondando.']), 'guardaRH'); } }))
    ],
    onEnter: async () => { if (c7Ativo() && !G.flags.c7Chegou) await chegaAcampamento(); }
  };
  montaBarreira({ id: 'boca7', ativo: () => c7Ativo() && !G.flags.c7Coracao, map: 'acampamento', cancela: AC7.barreira, guarda: AC7.guarda, lado: 'baixo', volta: AC7.bocaOut, bg: bgMinaOrigem, grupo: ['guardaR', 'caoLanterna'], so: ['pavio'], foraSo: 'Boca da mina. Só Pavio de turno. O resto, pra trás da linha amarela.',
    perg: { pavio: { q: 'Turno da noite? Galeria de quê, Pavio?', ops: ['Perfuração.', 'Das bombas.', 'Do Coração.'], certa: 1, ok: 'Bombas. Desce. E não encosta no vapor.', dica: 'A PLACA DOS TURNOS, perto dos trilhos. Eu passei do lado dela.' } } });
  // ===== GALERIAS DE BOMBEAMENTO =====
  MAPS2.bombas = { rows: ROWS7.bombas, key: KEY7, name: 'Mina de Origem · Galerias de Bombeamento', music: 'bombas7', batBg: bgBombas, bg: '#120e12', semCeu: true, tint: 'rgba(255,170,80,0.06)',
    props: [
      ...[[10, 26], [18, 26], [26, 27], [14, 20], [22, 21], [30, 20], [12, 14], [20, 15], [28, 14], [16, 8], [24, 9], [32, 8]].map(([x, y]) => ({ img: bombaArt, x, y: y + 2 })),
      ...[1, 7, 13, 19, 25].map(y => ({ img: () => canoAmbarArt(20, false), x: 2.5, y: y + 0.3, by: (y - 1) * TS }))
    ],
    ents: [
      ...BO7.entrada.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('acampamento', AC7.boca[0][0], AC7.boca[0][1] + 1, 'down'); W2.barOpen.boca7 = true; await fadeIn(10); } })),
      ...BO7.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; if (!G.flags.c7Broca) { await say('* Uma porta de ferro, trancada por dentro da cabine da broca.'); return; } sfx('door'); await fadeOut(10); loadMap2('coracao', ...CO7.entra, 'down'); await fadeIn(10); if (MAPS2.coracao.onEnter) await MAPS2.coracao.onEnter(); } })),
      ...Object.entries(BO7.valvulas).map(([id, V_]) => ({ t: 'sign', id: 'val' + id, x: V_.at[0], y: V_.at[1], h: 28, spr: () => valvulaArt(V_.tog.some(t => !ventSt()[t])), talk: () => puxaValvula(id) })),
      marcoEnt(...BO7.marco),
      morador('pavio', ...BO7.mineiro, { id: 'pavioBomba', dir: 'left', talk: async () => { await say(pickOne(['Boa noite. Válvula A com B. Válvula B com C. Eu repito pra não esquecer. O resto eu esqueci.', 'Vapor ligado é parede. Vapor desligado é caminho. É tudo que eu sei.']), 'pavioG'); } }),
      ...BO7.bau.map(([x, y], i) => bauEnt('bombas', 'b' + i, x, y, async () => { if (i) { await dar('pluma', 1); await dar('tinta', 2); } else { await dar('frasco', 1); await dar('cobres', 50); } })),
      inimigo('cl1', 'caoLanterna', ...BO7.foes[0], ['caoLanterna'], { spr: (t, d) => { const c = caoMapaArt(Math.floor(t / 8) % 2, false); return d === 'left' ? flipC(c) : c; }, h: 20, bg: bgBombas }),
      inimigo('vv1', 'valvulaViva', ...BO7.foes[1], ['valvulaViva', 'caoLanterna'], { spr: () => valvulaArt(false), h: 30, bg: bgBombas }),
      inimigo('vv2', 'valvulaViva', ...BO7.foes[2], ['valvulaViva', 'guardaR'], { spr: () => valvulaArt(false), h: 30, bg: bgBombas }),
      inimigo('cl2', 'caoLanterna', ...BO7.foes[3], ['caoLanterna', 'caoLanterna', 'guardaR'], { spr: (t, d) => { const c = caoMapaArt(Math.floor(t / 8) % 2, false); return d === 'left' ? flipC(c) : c; }, h: 20, bg: bgBombas }),
      ...BO7.brocaTrig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c7Broca, run: lutaBroca }))
    ],
    onEnter: async () => { if (!G.flags.c7Bombas) { G.flags.c7Bombas = true; await say('* As Galerias de Bombeamento. Cinco túneis, um em cima do outro, ligados por respiros de vapor que assobiam. Canos de âmbar correm pelas paredes, quentes, dourados, cheios.'); await say('Isso não é mina. Mina tira pedra. Isso aqui... bebe.', 'rita'); await say('[Os canos sobem. Vêm de baixo. De BEM embaixo.]', 'cat'); } }
  };
  grade(MAPS2.acampamento); grade(MAPS2.bombas);
}; }
// ---------- começo ----------
function iniciarCap7() {
  if (G.flags.c7Init) return false;
  G.flags.c7Init = true; G.poder = Math.max(G.poder || 1, 6); curarTudo(); G.hora = 9 * 60; G.dia = (G.dia || 0) + 1; G.disfarce = null;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  return true;
}
async function capitulo7() {
  if (!MAPS2.acampamento) montarMapas2();
  const novo = iniciarCap7();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'interior', x: POS3.interior.entra[0], y: POS3.interior.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 7', 'A Mina de Origem']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Dois dias depois do Selo. A base cheira a graxa: o Seu Jorge passou a noite na garagem, de baixo do 31, trocando uma correia que não precisava trocar.');
  await say('Ele tá nervoso. Ele só conserta o que não quebrou quando tá nervoso.', 'lume');
  await say('* Na mesa, a etiqueta de lona: "ÂMBAR BRUTO · MINA DE ORIGEM · pelo cano do CORAÇÃO". Do lado, o bilhete com a letra pequena. A Rita não deixa ninguém jogar fora nenhum dos dois.');
  await say('A Guarda saiu do Bairro Baixo "para as minas". Os barris do Selo vêm de uma mina. O cano chama "Coração". Tudo aponta pro mesmo morro.', 'rita');
  await say('A Mina de Origem fica na serra de trás, depois de Candeia. Estrada velha, de cascalho, que ninguém usa desde que abriram a nova. O 31 sobe. Eu levo.', 'jorge');
  await say('O senhor tem certeza? Pode ser perigoso.', 'lume');
  await say('Menina, eu atravessei dois mundos com esse ônibus. Uma serrinha não me assusta. ...O que me assusta é ficar aqui sentado.', 'jorge');
  await say('* A Irmã Dalva aparece na porta da garagem com uma marmita para cada um e uma cara de quem não aprova.');
  await say('Sopa. Pra estrada. E juízo, que eu não mando pra serra.', 'dalva');
  await say('[O 31 está na GARAGEM. Saindo de DIA, a estrada tem cancelas da Guarda. De NOITE, só o farol enxerga as pedras. E a mina só abre para Pavio no turno da noite.]', 'cat');
  save2();
}
{ const _c6 = capitulo6; capitulo6 = async function () { if (!MAPS2.acampamento) montarMapas2(); if (G.flags.c6Fim) return capitulo7(); return _c6(); }; }
{ const _uw7c = updateWorld2; updateWorld2 = function () { _uw7c(); if (V.scene === 'world' && G.flags.c6Fim && !G.flags.c7Init && !worldBusy2() && !W2.mv) run2(capitulo7); }; }
// ---------- a garagem: a estrada velha ----------
{ const _gar = garagem; garagem = async function () {
  if (G.flags.c7Jorge) { await say('* O 31 na garagem. A chave no contato. O banco do motorista, vazio, com a marca de quem sentou ali cinquenta anos.'); if (!G.flags.c7GaragemVazia) { G.flags.c7GaragemVazia = true; await say('...Ninguém mais sabe dirigir ele.', 'rita'); await say('Eu sei. Eu sei o caminho de cor. Eu só não sei dirigir.', 'lume'); } await say('[Sem motorista, o 31 não anda. Os Marcos continuam levando vocês aonde já foram.]', 'cat'); return; }
  if (c7Ativo() && !G.flags.c7Chegou) {
    const c = await choose('O 31 está de tanque cheio. Pra estrada velha das minas?', ['Partir agora', 'Esperar a noite e partir', 'Outro destino', 'Ficar na base'], 'jorge');
    if (c === 3 || c < 0) return;
    if (c === 2) return _gar();
    if (c === 1) { G.hora = 20 * 60; await say('* Vocês esperam a noite na garagem, ouvindo o Seu Jorge contar como era a estrada de terra da cidade dele. Ele erra o nome da cidade duas vezes.'); }
    await viagemEstrada();
    return;
  }
  if (c7Ativo() && G.flags.c7Chegou) { const c = await choose('O 31 sobe a serra de novo. Pra onde?', ['Acampamento da Mina de Origem', 'Outro destino', 'Ficar na base'], 'jorge'); if (c === 0) { await say('Segura a tampa!', 'jorge'); sfx('door'); await fadeOut(20); loadMap2('acampamento', AC7.chegada[0] + 1, AC7.chegada[1], 'right'); await fadeIn(20); return; } if (c === 1) return _gar(); return; }
  return _gar();
}; }
async function viagemEstrada() {
  const noite = ehNoite();
  await say(noite ? 'De noite a serra é escura. Eu enxergo pouco, então quem enxerga é o farol. Avisa se vir pedra, Lume!' : 'De dia tem Guarda na estrada. Cancela, apito, papelada. Desvia de tudo que for vermelho e branco!', 'jorge');
  await fadeOut(20); playMusic('serra7');
  const r = await estradaMinas(noite);
  V.scene = 'world';
  if (r.frascos) { G.items.frasco = (G.items.frasco || 0) + r.frascos; }
  await fadeIn(10);
  await say(`* Fim da estrada velha. ${r.frascos ? r.frascos + ' frasco(s) de âmbar que caíram de algum caminhão da Coroa rolam no chão do 31. ' : ''}${r.hits ? 'O 31 tem ' + r.hits + ' amassado(s) novo(s).' : 'O 31 chega sem um arranhão.'}`);
  if (r.hits === 0) await say('Nenhum! Nem um arranhão! Eu sou bom. Eu SEMPRE fui bom. Eu só não lembro desde quando.', 'jorge');
  if (r.cancela) { await say('* No pé do morro, um guarda da cancela que vocês derrubaram vem correndo, de lanterna e apito.'); await lutaMapa(['guardaR', 'caoLanterna'], { bg: bgMinaOrigem, semSurpresa: true }); }
  G.hora = Math.max(G.hora, (noite ? 22 : 15) * 60);
  loadMap2('acampamento', ...AC7.chegada, 'right'); playMusic('serra7');
  if (MAPS2.acampamento.onEnter) await MAPS2.acampamento.onEnter();
}
async function chegaAcampamento() {
  G.flags.c7Chegou = true;
  await say('* O 31 para atrás de uma fileira de pinheiros, faróis apagados. Lá embaixo, no vale: o acampamento da Mina de Origem.');
  await say('* Barracas da Guarda Real. Trilhos. Vagonetes de âmbar bruto. Canos dourados saindo da boca da mina e descendo a serra, na direção da capital, brilhando como veia.');
  await say('Os guardas de Auren. Todos aqui.', 'rita');
  await say('Eu fico com o 31. Se precisarem correr, corram pra cá: eu deixo o motor quente. E se a Guarda perguntar, eu sou um motorista perdido. Isso eu sou mesmo.', 'jorge');
  await say('[A boca da mina, lá em cima. O turno da noite é de Pavio. Os casacos cinza ainda estão no Vão.]', 'cat');
  save2();
}
async function entrarBombas() {
  W2.mv = null;
  if (!(W2.barOpen && W2.barOpen.boca7) && c7Ativo() && !G.flags.c7Coracao) return;
  sfx('door'); await fadeOut(10); loadMap2('bombas', ...BO7.entra, 'up'); await fadeIn(10); if (MAPS2.bombas.onEnter) await MAPS2.bombas.onEnter();
}
async function falaJorge7() {
  if (G.flags.c7Broca) { await say(pickOne(['Vocês vão descer mais? Eu tenho um guincho no 31. Cento e vinte metros de cabo. Se precisar, eu desço atrás.', 'Eu sonhei com uma garagem cheia de ônibus parados. Todos eram o 31. Acordei com saudade de uma coisa que eu não sei o que é.']), 'jorge'); }
  else await say(pickOne(['Motor quente. Pode ir sossegado.', 'Os pinheiros daqui cheiram igual os da estrada da minha cidade. Qual era mesmo...?', 'Se a Guarda vier, eu digo que tô perdido. É verdade há uns quarenta anos.']), 'jorge');
  const c = await choose('* Voltar com o 31?', ['Voltar para a base', 'Ficar'], 'jorge', 1);
  if (c === 0) { await say('Segura a tampa!', 'jorge'); sfx('door'); await fadeOut(20); loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(20); await say('* A garagem da base. O 31 estala, esfriando. (Para voltar à serra: a garagem.)'); }
}
async function falaBina() {
  await say(pickOne(['Sopa de mandioca, seis da tarde, todo dia. Os Pavios comem, os guardas reclamam. É a única diferença entre eles.', 'Ninguém aqui sabe de onde vem o âmbar. Diz que é "do fundo". Fundo de quê, eu pergunto. Ninguém responde.']), 'bina');
  if (!G.flags.c7SabugoPista) { G.flags.c7SabugoPista = true; await say('O cachorro? É o Sabugo. Ninguém dá comida pra ele porque ele late pra Guarda. Ele só come pão de milho. Pão de MILHO. Cachorro com gosto refinado.', 'bina'); await say('O único pão de milho que presta nesse mundo era de um padeiro do Cais de Auren. Sumiu faz anos. Dizem que virou Pavio.', 'bina'); }
}
async function falaSabugo() {
  if (G.flags.c7Sabugo) { await say(pickOne(['* O Sabugo abana o rabo inteiro. Às vezes o corpo vai junto.', '* O Sabugo deita do lado do baú e suspira. Dois que ninguém leva para passear.'])); return; }
  if (G.flags.c7Pao) {
    G.flags.c7Sabugo = true; sfx('item');
    await say('* Você oferece o pão de milho do Seu Afonso. O Sabugo cheira, olha para você desconfiado, cheira de novo. E come como quem reconhece um gosto de infância.');
    await say('* Depois ele sai cavando atrás da barraca da Guarda, volta com uma coleira velha na boca e larga no seu pé.');
    ganharEquip('coleiraSabugo'); sfx('equip'); await say(`* Você recebeu a {y}${EQ2.coleiraSabugo.nm}{/}. ${EQ2.coleiraSabugo.d}`);
    await dar('frasco', 2);
    await say('Ele adotou a gente. Ou a gente adotou ele. Não sei quem adotou quem.', 'lume');
    save2(); return;
  }
  await say(ehNoite() ? '* Um cachorro magro, preso numa corrente, late para um guarda que passa. Para você, não late: só olha, com fome.' : '* Um cachorro magro dorme debaixo de um vagonete. Abre um olho. Fecha.');
  if (G.flags.c7SabugoPista && !devolvida('afonso')) await say('Pão de milho... o Pavio cozinheiro da Vila! Se ele lembrasse quem é...', 'rita');
  else if (G.flags.c7SabugoPista) await say('O Seu Afonso! O pão de milho do Afonso! A gente pega na Vila dos Pavios.', 'lume');
}
async function falaTonho() {
  if (G.flags.c7CartaFeita) { await say('A Dona Ilda mandou dizer que a família recebeu. Que o Zé... que a lanterna dele tá na janela. Acesa. Obrigado. Eu não sei por que eu tô chorando.', 'tonho'); return; }
  if (G.flags.c7Carta) { await say('Candeia. Pra Dona Ilda, a professora. Ela sabe de quem é cada casa.', 'tonho'); return; }
  await say('Boa noite. Eu bombeio o âmbar. Eu sou de Candeia. Eu acho. Eu lembro da serra.', 'tonho');
  await say('* Ele tira do casaco uma lanterna de mina pequena, amassada, com um nome riscado a canivete: "ZÉ CANDEEIRO".');
  await say('O Zé trabalhava do meu lado. Ele... um dia ele entrou no Coração com a equipe do dia e não voltou. Me deram a lanterna dele. Eu não sei pra quem devolver. Eu não lembro onde era a casa dele.', 'tonho');
  await say('Candeia. A Dona Ilda sabe de quem é cada casa de Candeia. A gente leva.', 'rita');
  G.flags.c7Carta = true; sfx('item'); await say('* {y}A lanterna do Zé{/} vai para o Vão. (Leve até a Dona Ilda, em Candeia. Pelo Marco.)');
}
async function lutaBroca() {
  if (G.flags.c7Broca) return;
  W2.mv = null;
  await say('* No alto da última galeria, uma máquina enorme de lagarta e espiral está parada de frente para a parede, como quem pensa. A cabine acende. Ninguém está dentro.');
  await say('Ela tá sozinha. Ninguém dirige.', 'lume');
  await say('* A broca vira. Devagar. Para vocês.');
  const r = await lutaMapa(['broca'], { bg: bgBombas, music: 'boss', pos: [[180, 160]], intro: async () => { const e = BT.foes[0]; e.phases = fasesBroca(); e.ct = 12; callout('A BROCA', '#ffd070', 90); } });
  if (r !== 'win') return;
  G.flags.c7Broca = true; playMusic('bombas7');
  await say('* A broca para, fumegando. Na ponta da espiral, presa nos dentes, uma pedra de âmbar bruto do tamanho de um punho. Ela PULSA, como as do veio das Galerias, há tanto tempo.');
  await say('[Âmbar bruto VIVO. Da masmorra. Não é tinta de superfície: é o mesmo âmbar das runas antigas. Dá para escrever com ele.]', 'cat');
  const Gm = grim(); if (!Gm.elems.includes('ambar')) Gm.elems.push('ambar');
  sfx('rune'); await say('* {y}Elemento novo no Grimório: ÂMBAR!{/} (luz-pedra: quebra +1 de escudo e deixa RESINA, o alvo fica lento. Fusões com Brasa, Geada, Seiva, Fuligem e Areia.)');
  ganharSelo('ambar+brasa'); await mostrarSelo('ambar+brasa');
  await say('A porta. A broca tinha a chave da porta de cima. E a porta de cima vai pro... Coração.', 'rita');
  save2();
}
