// ================= CAPÍTULO 8 — O INVERNO ESCURO (Parte 1: Auren acesa à mão) =================
// O Acendedor-Mor corta o âmbar de Auren "por sete noites, para lembrarem". O grupo acende a cidade À MÃO, bairro por
// bairro, EM QUALQUER ORDEM: Bairro Baixo (braseiros + duas famílias levadas para dentro do baú), Largo (braseiros +
// três pacientes levados ao hospital, que vira abrigo), Vila dos Pavios (os Pavios proibidos de acender; os que tiveram a
// lembrança devolvida acendem por conta própria; o Jorge está lá, de casaco cinza) e o Festival (braseiros + os três
// MÚSICOS trazidos de cada bairro). Com tudo aceso: A NOITE DA MÚSICA, a Lume ganha o VERSO NOVO, e o CAPITÃO APAGADOR
// (mini-chefe) vem apagar o show. Parte 2 (cap8b): o frio sobe das Cisternas.
// Voltas com viagem rápida: velas da Igreja do Sino (Velhágua), lampiões de Candeia (Dona Ilda), velas de âmbar da
// Cidade Alta (Dona Hortênsia), e o Jorge na Vila.
Object.assign(TRACKS, {
  inverno: { bpm: 66, bars: 4, chords: 'Dm Bb Gm A', bass: 'root5', bassVol: 0.05,
    lead: 'D5:4 F5:4 A5:8 | D6:4 C6:4 Bb5:8 | G5:4 Bb5:4 D6:8 | C#6:4 E6:4 A5:8', leadWave: 'sine', leadVol: 0.045, arp: { rate: 4, vol: 0.01, oct: 1 }, drums: '', hatVol: 0 },
  concerto: { bpm: 126, bars: 4, chords: 'D Bm G A', bass: 'root5', bassVol: 0.09,
    lead: 'F#5:2 A5:2 D6:4 C#6:2 B5:2 A5:4 | B5:2 D6:2 F#6:4 E6:2 D6:2 B5:4 | G5:2 B5:2 D6:4 B5:2 G5:2 B5:4 | A5:2 C#6:2 E6:4 D6:2 C#6:2 A5:4',
    leadWave: 'square', leadVol: 0.05, arp: { rate: 4, vol: 0.015, oct: 1 }, drums: 'k.h.s.h.k.k.s.h.', hatVol: 0.025 }
});
Object.assign(HUMS, {
  nair: { h: 44, skin: '#8a5a3a', hair: '#d8d8d8', hairStyle: 'coque', top: '#6a4a7a', bottom: '#3a2a4a' },
  bento: { h: 50, skin: '#c8a088', hair: '#e8e4e0', top: '#5a5a4a', bottom: '#2a2a2a', acc: '#1a1a1a' },
  nonato: { h: 48, skin: '#a8704a', hair: '#c8c8c8', top: '#4a6a8a', bottom: '#3a3a44' },
  cida: { h: 44, skin: '#d8a078', hair: '#6a4a3a', hairStyle: 'longo', top: '#8a6a4a', bottom: '#4a3a2a', apron: '#e8e0d0' },
  pipo: { h: 34, skin: '#c8906a', hair: '#3a2a1a', top: '#c84a3a', bottom: '#3a3a5a' },
  zefa: { h: 46, skin: '#6a4a2a', hair: '#1a1a1a', hairStyle: 'coque', top: '#d8a030', bottom: '#5a3a2a', acc: '#c83a3a' },
  lino: { h: 52, skin: '#c8a088', hair: '#8a8a8a', top: '#3a5a3a', bottom: '#2a2a3a' },
  jorgeP: { h: 52, skin: '#c8906a', hair: '#9a9aa0', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra },
  capitaoH: { h: 56, skin: '#b8805a', hair: '#1a1418', top: '#2a3a6a', coat: '#2a2430', bottom: '#1a1a24', hat: '#1a1418', acc: '#c89a30' },
  arauto: { h: 50, skin: '#c8a088', hair: '#3a2a1a', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra }
});
Object.assign(WHO, {
  nair: { name: () => 'Dona Nair', portrait: () => portHum('nair'), voice: voz(480), col: '#f0d8f0' },
  bento: { name: () => 'Seu Bento', portrait: () => portHum('bento'), voice: voz(260, 'blipLow'), col: '#e8e0d0' },
  nonato: { name: () => 'Seu Nonato', portrait: () => portHum('nonato'), voice: voz(280, 'blipLow'), col: '#d8e8f0' },
  cida: { name: () => 'Dona Cida', portrait: () => portHum('cida'), voice: voz(500), col: '#f0e0d0' },
  pipo: { name: () => 'Pipo', portrait: () => portHum('pipo'), voice: voz(700), col: '#ffd8c8' },
  zefa: { name: () => 'Dona Zefa', portrait: () => portHum('zefa'), voice: voz(420), col: '#ffe8a0' },
  lino: { name: () => 'Seu Lino', portrait: () => portHum('lino'), voice: voz(320), col: '#d8f0d8' },
  capitao: { name: () => 'Capitão Apagador', portrait: () => portHum('capitaoH'), voice: voz(180, 'blipLow'), col: '#c8c8d8' },
  arauto: { name: () => 'Pavio arauto', portrait: () => portHum('arauto'), voice: voz(380), col: '#e8e0d8' }
});
// ---------- começo ----------
function iniciarCap8() {
  if (G.flags.c8Init) return false;
  G.flags.c8Init = true; G.poder = Math.max(G.poder || 1, 7); curarTudo(); G.hora = 18 * 60 + 40; G.dia = (G.dia || 0) + 1; G.chama = 100;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) }); G.velas = (G.velas || 0) + 3;
  return true;
}
async function capitulo8() {
  if (!MAPS2.cisternas) montarMapas2();
  const novo = iniciarCap8();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'interior', x: POS3.interior.entra[0], y: POS3.interior.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 8', 'O Inverno Escuro']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('inverno'); await fadeIn(30);
  await say('* Três noites depois do Coração. A primeira neve do ano. E, pela janela alta da base, o Bairro Baixo inteiro no escuro, como uma boca fechada.');
  await say('* Na rua, um Pavio de casaco cinza lê um papel em voz alta, sem emoção nenhuma, em cada esquina.');
  await say('"Por ordem do Acendedor-Mor: a cidade de Auren ficará sem âmbar por sete noites. Para que lembre. Para que nunca mais esqueça por que precisa do Farol."', 'arauto');
  await say('Sete noites. No inverno. Os velhos não aguentam sete noites de frio no escuro, ele SABE disso.', 'dalva');
  await say('Ele quer que a cidade implore.', 'rita');
  await say('* A Lume está na janela. A chama dela está baixa, menor do que vocês já viram, e ela não percebe.');
  await say('Então a gente acende. Com a mão. Uma rua de cada vez.', 'lume');
  await say('Com o quê? Não tem âmbar.', 'rita');
  await say('Comigo. Eu sou uma vela, Rita. Eu sempre fui uma vela. Vela não precisa de âmbar.', 'lume');
  await say('[CHAMA DA LUME: a barra de fogo no canto. Acender um braseiro gasta 25. Volta perto de braseiro aceso, nas lareiras e quando alguém chega a salvo. VELAS acendem sem gastar.]', 'cat');
  await say('* A Irmã Dalva põe três velas grossas na mão da Lume e fecha os dedos dela em volta.');
  await say('A lareira do hospital ainda tem lenha. Os velhos do Largo ficaram em casa, com medo de andar no escuro. Tragam eles. E aqui dentro do baú cabe muita gente, @. Você sabe disso.', 'dalva');
  await say('E música. O Seu Lúcio sempre diz: gente que canta junto não tem medo do escuro. Se cada bairro mandar um músico pro palco do Festival...', 'lume');
  await say('[QUATRO BAIRROS, em qualquer ordem: BAIRRO BAIXO, LARGO, VILA DOS PAVIOS e FESTIVAL. De NOITE: acender braseiros e levar gente. De DIA: comprar velas (Dona Iolanda), achar os músicos, e as voltas pelos Marcos.]', 'cat');
  save2();
}
{ const _c7 = capitulo7; capitulo7 = async function () { if (!MAPS2.cisternas) montarMapas2(); if (G.flags.c7Fim) return capitulo8(); return _c7(); }; }
{ const _uw8c = updateWorld2; updateWorld2 = function () { _uw8c(); if (V.scene === 'world' && G.flags.c7Fim && !G.flags.c8Init && !worldBusy2() && !W2.mv) run2(capitulo8); }; }
// ---------- quem precisa ser levado ----------
{ const _mmE8 = montarMapas2; montarMapas2 = function () {
  _mmE8.apply(this, arguments);
  const AU = POS3.auren, LG = POS4.largo, FE = POS3.festival;
  const bueiro = { map: 'auren', at: AU.bueiro, r: 2 }, hosp = { map: 'largo', at: LG.hospOut, r: 2 }, palco = { map: 'festival', at: FE.frente[1], r: 3 };
  montaEscolta('nair', { nm: 'Dona Nair e os netos', hum: 'nair', who: 'nair', map: 'auren', at: [26, 17], dest: bueiro, destNm: 'o baú (o bueiro)', fala: 'Os meninos não dormem, com o frio. Vocês têm um baú quente? Leva a gente. Mas pela rua acesa, que os meninos têm medo.', chegou: async () => { await say('* A Dona Nair olha o bueiro, olha o baú aberto lá embaixo, e entra com os dois netos pela tampa, sem perguntar nada. Lá dentro, a Irmã Dalva já tem sopa.'); } });
  montaEscolta('bento', { nm: 'Seu Bento', hum: 'bento', who: 'bento', map: 'auren', at: [36, 18], dest: bueiro, destNm: 'o baú (o bueiro)', fala: 'Eu sou cego, moça. Escuro pra mim é sempre. Mas o frio não. E o medo dos outros eu escuto. Me leva? Me avisa quando tiver luz, que eu sinto o calor na cara.', chegou: async () => { await say('Tá quente aqui. Quente de gente. Obrigado, mala.', 'bento'); } });
  montaEscolta('nonato', { nm: 'Seu Nonato', hum: 'nonato', who: 'nonato', map: 'largo', at: [40, 10], dest: hosp, destNm: 'o hospital', fala: 'O hospital? Tem fogo lá? Então eu vou. Devagar, que o joelho não ajuda. E pela luz.', chegou: async () => { await say('* O Seu Nonato entra no hospital esfregando as mãos. A porta, que vivia trancada de noite, hoje está escancarada.'); } });
  montaEscolta('cida', { nm: 'Dona Cida', hum: 'cida', who: 'cida', map: 'largo', at: [8, 22], dest: hosp, destNm: 'o hospital', fala: 'Meu marido morreu no Inverno de doze anos atrás, no escuro. Eu não fico mais uma noite no escuro. Leva eu.' });
  montaEscolta('pipo', { nm: 'Pipo', hum: 'pipo', who: 'pipo', map: 'largo', at: [33, 24], dest: hosp, destNm: 'o hospital', fala: 'A minha avó tá no hospital e eu fiquei sozinho. Vocês são do cartaz! O baú com dente! Me leva? Eu não tenho medo. Muito.' });
  montaEscolta('zefa', { nm: 'Dona Zefa (tambor)', hum: 'zefa', who: 'zefa', map: 'auren', at: [14, 18], dest: palco, destNm: 'o palco do Festival', dia: 'O tambor? De dia eu batuco pra ninguém. Vem de noite, quando a rua tiver luz, que eu vou pro palco com vocês.', fala: 'Música no Festival? No escuro? ...Tá. Eu levo o tambor. Mas eu só ando onde eu vejo o chão.', chegou: async () => { await say('* A Dona Zefa sobe no palco e bate três vezes no tambor, só para ver se o tambor ainda é dela. É.'); } });
  montaEscolta('lino', { nm: 'Seu Lino (rabeca)', hum: 'lino', who: 'lino', map: 'largo', at: [24, 13], dest: palco, destNm: 'o palco do Festival', dia: 'A rabeca tá aqui no colo. De noite, se tiver luz, eu toco no palco. De dia, ninguém escuta.', fala: 'Eu toquei no Festival antes do Farol existir. Vou tocar de novo, então. Pela luz, por favor, que rabequeiro velho tropeça.', chegou: async () => { await say('* O Seu Lino afina a rabeca no palco. Um "lá" comprido, tremido, que atravessa a praça escura.'); } });
  montaEscolta('osvaldoM', { nm: 'Osvaldo (assobio)', hum: 'osvaldoV', who: 'osvaldo', map: 'ruaPavios', at: [27, 17], dest: palco, destNm: 'o palco do Festival', dia: 'De noite, quando a vila tiver luz, eu vou com vocês. O meu assobio é o tique-taque do relógio. É o único instrumento que eu tenho.', fala: 'Um relojoeiro no palco? A Candinha ia rir até chorar. Vamos. Pela rua acesa.' });
  // o Jorge, de casaco cinza, na Vila (de noite)
  const V_ = MAPS2.ruaPavios; if (V_ && !V_._jorge8) { V_._jorge8 = true; V_.ents.push(morador('jorgeP', 34, 9, { id: 'jorgeVila', dir: 'down', gone: () => !c8Ativo() || !ehNoite(), rotina: rot([34, 9, 'acender', 300, 'down'], [38, 9, 'acender', 300, 'down']), talk: falaJorgePavio })); }
  // o abrigo: o hospital aberto de noite, com lareira
  const H = MAPS2.hosp1; if (H && !H._c8) { H._c8 = true; H.ents.push({ t: 'sign', x: 15, y: 4, h: 30, spr: () => braseiroArt(true, Math.floor(W2.t / 6)), get luz() { return c8Ativo() ? 90 : 0; }, gone: () => !c8Ativo(), talk: lareiraAbrigo }); }
}; }
{ const _eh = entrarHospital; entrarHospital = async function () { if (c8Ativo()) { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('hosp1', ...POS4.hosp1.entra, 'up'); await fadeIn(10); if (!G.flags.c8Abrigo) { G.flags.c8Abrigo = true; await say('* O hospital dos pobres, de portas abertas pela primeira vez de noite. A Irmã Dalva acendeu a lareira do salão e empurrou as camas para perto dela.'); await say('Hoje entra tudo. Gente, mala, cachorro. Quem tiver frio entra.', 'dalva'); } return; } return _eh(); }; }
async function lareiraAbrigo() { setChama(chamaMax()); sfx('heal'); await say('* A lareira do hospital. A Lume senta na frente dela e a chama dela cresce, devagar, até o tamanho de sempre.'); W2.toast = { s: 'Chama cheia (' + Math.round(chama()) + ')', t: 0 }; }
// a lareira da base também enche a chama
{ const _eB = falaDalva; if (typeof falaDalva === 'function') falaDalva = async function () { if (c8Ativo()) { setChama(chamaMax()); await say(pickOne(['Senta perto do fogão, Lume. Isso. Pega calor. Quem dá luz precisa receber de volta.', 'Já tem onze pessoas aqui dentro do baú. Onze! O Seu Bento contou piada pra todo mundo.']), 'dalva'); W2.toast = { s: 'Chama cheia', t: 0 }; return; } return _eB(); }; }
// ---------- os bairros ----------
const BAIRRO_NM = { auren: 'Bairro Baixo', largo: 'Largo do Hospital', festival: 'Festival', ruaPavios: 'Vila dos Pavios' };
const BAIRRO_ESC = { auren: ['nair', 'bento'], largo: ['nonato', 'cida', 'pipo'], festival: ['zefa', 'lino', 'osvaldoM'], ruaPavios: [] };
function bairroPronto(id) { return bairroAceso(id) && BAIRRO_ESC[id].every(escEntregue); }
async function bairroCompleto8(id) {
  if (G.flags['c8B_' + id] || !bairroPronto(id)) return;
  G.flags['c8B_' + id] = true; sfx('rune');
  const n = BAIRROS8.filter(b => G.flags['c8B_' + b]).length;
  W2.toast = { s: BAIRRO_NM[id] + ' aceso! (' + n + '/4)', t: 0 };
  const falas = {
    auren: ['* No Bairro Baixo, uma janela acende com uma vela. Depois outra. Ninguém mandou. As pessoas viram o braseiro da esquina e foram buscar as velas da gaveta.', 'Ninguém precisa de ordem pra acender uma vela. Só de ver alguém acendendo primeiro.'],
    largo: ['* O Largo do Hospital, aceso por braseiros e por uma fila de lamparinas de lata que os vizinhos foram pondo no peitoril. O hospital brilha como um navio.', 'O hospital dos pobres aceso no meio do apagão. Ele vai ver isso lá da torre.'],
    festival: ['* O Festival aceso. A praça onde o Acendedor-Mor anunciou o Farol, acesa sem um grama de âmbar.', 'Falta só a música.'],
    ruaPavios: ['* A Vila dos Pavios acesa. Por Pavios. Os que lembram acenderam primeiro; os outros olharam, olharam, e alguns foram atrás, devagar, com a lanterna da Coroa.', 'Pavio acendendo poste por vontade própria. Isso nunca aconteceu.']
  }[id];
  await say(falas[0]); await say(falas[1], id === 'auren' || id === 'festival' ? 'lume' : 'rita');
  if (n >= 4) await say('[Os quatro bairros acesos. Os músicos no palco. O Festival espera a NOITE DA MÚSICA.]', 'cat');
  save2();
}
// a checagem roda também quando alguém chega (escolta)
{ const _uwB = updateWorld2; updateWorld2 = function () { _uwB(); if (V.scene === 'world' && c8Ativo() && !worldBusy2() && W2.t % 45 === 0) for (const b of BAIRROS8) if (!G.flags['c8B_' + b] && bairroPronto(b)) { run2(() => bairroCompleto8(b)); break; } }; }
// ---------- a Vila dos Pavios: quem lembra, acende ----------
{ const _ab = acenderBraseiro; acenderBraseiro = async function (id, i) {
  if (id === 'ruaPavios' && c8Ativo() && ehNoite() && !brasAceso(id, i) && !G.flags.c8VilaAjuda) {
    G.flags.c8VilaAjuda = true;
    const quem = Object.keys(LEMB6).filter(devolvida);
    await say('* Antes da Lume encostar no braseiro, uma mão de casaco cinza segura a dela. O Osvaldo.');
    await say('Deixa com a gente. Ordem do Acendedor: Pavio não acende essa semana. Mas a ordem não falou nada sobre quem LEMBRA que é gente.', 'osvaldo');
    const B = brasDe('ruaPavios'); let k = 0;
    for (const nome of quem) { const j = B.findIndex((_, x) => !brasAceso('ruaPavios', x)); if (j < 0) break; (luz8().ruaPavios = luz8().ruaPavios || []).push(j); k++; }
    if (k) await say(`* ${quem.map(q => LEMB6[q].dono).join(', ')}: cada um pega uma brasa e acende um braseiro da vila. ${k} de ${B.length}.`);
    else await say('Eu sozinho não dou conta. Ninguém aqui lembra o bastante pra desobedecer. Ainda.', 'osvaldo');
    if (k < Object.keys(LEMB6).length) await say('[Pavios com a lembrança devolvida (Cap. 6) acendem sozinhos. Os outros braseiros, a Lume acende.]', 'cat');
    if (bairroAceso('ruaPavios')) await bairroCompleto8('ruaPavios');
    return;
  }
  return _ab(id, i);
}; }
async function falaJorgePavio() {
  if (!G.flags.c8Jorge) {
    G.flags.c8Jorge = true; playMusic('perda');
    await say('* Um Pavio parado na frente da casa 9, de casaco cinza, com a lanterna da Coroa apagada na mão. O bigode. As mãos de mecânico.');
    await say('Boa noite. Hoje eu não acendo. Ordem.', 'pavioG');
    await say('Seu Jorge. Sou eu. A Lume.', 'lume');
    await say('* Ele olha para ela com educação. Com gentileza, até. Com a gentileza que se tem com estranhos.');
    await say('Prazer, moça. Que nome bonito. Combina com vela.', 'pavioG');
    await say('* A Lume não chora. Ela canta, baixinho, a música da estrada, aquela que ele pediu lá no fundo do Coração.');
    await say('* O Pavio escuta. No meio do segundo verso, os dedos dele batem duas vezes na lanterna. Pom, pom. Como quem dá duas bombadas num pedal.');
    await say('...Que música é essa? Eu conheço. Não, não conheço. Desculpa. Boa noite.', 'pavioG');
    await say('Ele bateu duas vezes. Ele bateu DUAS vezes, Rita.', 'lume');
    await say('Eu vi.', 'rita');
    playMusic('vila'); save2(); return;
  }
  await say(pickOne(['Boa noite. Hoje eu não acendo. Ordem.', 'Boa noite, moça da vela.', '(ele bate duas vezes na lanterna, sem perceber)']), 'pavioG');
}
// ---------- velas: a Dona Iolanda vende ----------
{ const _fIo8 = falaIolanda; falaIolanda = async function () {
  if (c8Ativo() && !ehNoite()) {
    if (!G.flags.c8Iolanda) { G.flags.c8Iolanda = true; await say('Velas? Eu faço vela com a sobra da cera de selar carta. Cera boa, de papelaria. Quatro cobres cada, e eu tô no prejuízo.', 'iolanda'); }
    const c = await choose('Velas da Dona Iolanda (4 cobres cada). Você tem ' + (G.cobres || 0) + '.', ['Comprar 1', 'Comprar 5', 'Nada'], 'iolanda', 2);
    const n = c === 0 ? 1 : c === 1 ? 5 : 0;
    if (n) { if ((G.cobres || 0) < n * 4) { await say('Fiado não. Nem pra mala do cartaz.', 'iolanda'); } else { G.cobres -= n * 4; G.velas = (G.velas || 0) + n; sfx('item'); W2.toast = { s: '+' + n + ' vela(s) (' + G.velas + ')', t: 0 }; } }
    return;
  }
  return _fIo8();
}; }
// ---------- a Noite da Música ----------
function musicosProntos() { return ['zefa', 'lino', 'osvaldoM'].every(escEntregue); }
{ const _pt8 = palcoTiago; palcoTiago = async function () {
  if (!c8Ativo()) return _pt8();
  if (G.flags.c8P1) { await say('* O palco do Festival. As cadeiras viradas, os braseiros ainda acesos. Alguém esqueceu um tambor.'); return; }
  const n = BAIRROS8.filter(b => G.flags['c8B_' + b]).length;
  if (n < 4 || !musicosProntos()) { await say('* O palco do Festival, vazio e escuro. O Seu Lúcio está sentado na beira, de sanfona fechada no colo.'); await say(`Música sozinha não esquenta ninguém, mala. Preciso de gente: um músico de cada bairro (${['zefa', 'lino', 'osvaldoM'].filter(escEntregue).length}/3), e a cidade acesa pra vir escutar (${n}/4 bairros).`, 'lucio'); return; }
  if (!ehNoite()) { await say('O show é de noite. É de noite que precisa.', 'lucio'); return; }
  await noiteDaMusica();
}; }
async function noiteDaMusica() {
  W2.mv = null; playMusic('concerto');
  await say('* A Noite da Música. O Festival cheio: o Bairro Baixo, o Largo, os Pavios que lembram e alguns que não lembram, os velhos do hospital enrolados em cobertor. Cada um com uma vela.');
  await say('* No palco: a Dona Zefa no tambor, o Seu Lino na rabeca, o Osvaldo assobiando o tique-taque, o Seu Lúcio na sanfona. E a Lume no meio, com a chama quase apagada de tanto acender.');
  await say('Eu não tenho mais chama pra cantar alto.', 'lume');
  await say('Então canta baixo. A gente canta alto por você.', 'rita');
  const r = await ritmoLume();
  await say(r.perf + r.bom >= 4 ? '* A Lume começa baixinho. O tambor entra. A rabeca entra. E então a praça inteira entra, mil vozes desafinadas cantando uma música que ninguém sabia que sabia.' : '* A Lume erra a entrada, ri, começa de novo. A praça ri junto e entra cantando, mil vozes desafinadas, e ninguém mais lembra do erro.');
  await say('* E no meio da música, a Lume canta uma coisa que nunca cantou. Um verso novo. Ninguém ensinou. Saiu.');
  await say('"E se a luz da casa apagar, / acende a do vizinho; / que vela só fica sozinha / quando esquece o caminho."', 'lume');
  G.flags.c8Verso = true; sfx('rune');
  await say('* {y}A música da Lume ganhou um verso! Técnica nova: VERSO NOVO{/} (o grupo bate 25% mais por 3 vezes e ganha 20 de Tensão).');
  await wait(20); playMusic(null);
  await say('* Um apito. Dois. Dez. Da rua do Largo, em fila, homens de sobretudo preto com varas compridas e cones de latão na ponta. Os APAGADORES.');
  await say('* Na frente deles, um homem enorme de capacete-gaiola, com um cone do tamanho de um sino na ponta da lança. O povo abre espaço sem querer, como quem abre espaço para o frio.');
  await say('Reunião sem licença. Fogo sem âmbar. Música sem horário. Três infrações. Apagadores, APAGUEM.', 'capitao');
  await say('Ninguém apaga nada aqui hoje.', 'me');
  const rr = await lutaMapa(['capitao', 'apagador'], { bg: bgAurenEscura, music: 'boss', pos: [[190, 158], [130, 150]], intro: async () => { const e = BT.foes[0]; e.phases = fasesCapitao(); e.ct = 12; callout('CAPITÃO APAGADOR', '#c8c8d8', 90); } });
  if (rr !== 'win') return;
  G.flags.c8P1 = true; playMusic('concerto');
  await say('* O Capitão Apagador cai sentado no meio da praça, de sobretudo chamuscado, com a gaiola do capacete ainda acesa. Ele tenta apagar com a luva. Não apaga.');
  await say('* A Dona Cida, a viúva do Inverno, chega perto dele com a vela dela. E acende a dele, de propósito, olhando nos olhos.');
  await say('Pronto. Agora você também.', 'cida');
  await say('* Os Apagadores vão embora sem o capitão. O Festival canta até a madrugada.');
  await wait(20);
  await say('* E de madrugada, quando o último braseiro já é só brasa, o frio muda. Não é mais frio de inverno. É frio de dentro. Das pedras. Dos bueiros.');
  await say('* No Largo, a fonte do hospital estala. Racha. Por baixo dela, uma escada de pedra que ninguém sabia que existia, coberta de gelo, descendo.');
  await say('[O frio está vindo de baixo. Das Cisternas de Auren.]', 'cat');
  G.hora = 5 * 60; save2();
}
