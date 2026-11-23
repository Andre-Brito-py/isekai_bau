// ================= CAPÍTULO 9 — A SUBIDA DO MORRO (Parte 1: os aliados) =================
// O Acendedor-Mor fechou o Morro: o Farol de Cem Invernos vai acender. Toda noite uma fila de Pavios sobe com potes. O
// grupo monta o QUADRO DO CERCO na base e vai buscar ALIADOS pelos Marcos, cada um com um trunfo para a subida:
// a Irmã Dalva (base), a Dona Iolanda (Papelaria, de dia; a página da Ofélia escreve sozinha no Grimório), Tico e Dito
// (Bairro Baixo, de dia; a chaminé velha), o Sargento Brás (Vila dos Pavios, de noite, com a mãe) e a Dona Badalada
// (Velhágua: a Lume canta para o sino). A Iolanda e mais dois bastam; os cinco deixam a subida bem mais fácil.
// A MOÇA DE ÂMBAR começa a falar pelo Catálogo (em âmbar, sem colchetes). Opcionais com viagem: os RASTROS DE ÂMBAR
// (Poço do Sino, Câmara do Despertar) e A PENSÃO SEM REMETENTE (Largo -> Candeia -> Cidade Alta).
Object.assign(TRACKS, {
  subida: { bpm: 92, bars: 4, chords: 'Am F C G', bass: 'root5', bassVol: 0.08,
    lead: 'A4:2 C5:2 E5:4 D5:2 C5:2 | F5:4 E5:2 D5:2 C5:4 | E5:2 G5:2 C6:4 B5:2 G5:2 | D5:4 B4:2 G5:2 E5:4', leadWave: 'triangle', leadVol: 0.05, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: 'k...s...k.k.s...', hatVol: 0.015 },
  farol9: { bpm: 60, bars: 4, chords: 'Em C G D', bass: 'root5', bassVol: 0.06,
    lead: 'E5:8 G5:4 B5:4 | C6:8 B5:4 G5:4 | B5:8 D6:4 B5:4 | A5:8 F#5:8', leadWave: 'sine', leadVol: 0.045, arp: { rate: 2, vol: 0.012, oct: 1 }, drums: '', hatVol: 0 }
});
Object.assign(HUMS, {
  faroleiroH: { h: 50, skin: '#c8a088', hair: '#e8e4e0', top: '#22223a', coat: '#3a3a50', bottom: '#1a1a2a', hat: '#1a1a2a', acc: '#a8803a' }
});
Object.assign(WHO, {
  faroleiro: { name: () => 'O Faroleiro', portrait: () => portHum('faroleiroH'), voice: voz(160, 'blipLow'), col: '#ffe090' }
});
// ---------- começo ----------
function iniciarCap9() {
  if (G.flags.c9Init) return false;
  G.flags.c9Init = true; G.poder = Math.max(G.poder || 1, 8); curarTudo(); G.hora = 9 * 60 + 30; G.dia = (G.dia || 0) + 1;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  return true;
}
async function capitulo9() {
  if (!MAPS2.encosta9) montarMapas2();
  const novo = iniciarCap9();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'interior', x: POS3.interior.entra[0], y: POS3.interior.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 9', 'A Subida do Morro']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Dois dias depois do Inverno Escuro. Auren acesa de novo, com âmbar. E com velas na janela, que ninguém tirou.');
  await say('* Pela janela alta da base, o morro. E subindo por ele, devagar, como formigas carregando migalha, uma fila de Pavios. Cada um com um pote nas costas.');
  await say('"Por ordem do Acendedor-Mor: o Morro do Farol está fechado. O Farol de Cem Invernos acenderá quando estiver cheio. Para que nunca mais ninguém morra no escuro."', 'arauto');
  await say('Quando estiver cheio. De quê? Daqueles potes.', 'rita');
  await say('De gente. Os potes são de gente, Rita. Eu vi na Mina.', 'lume');
  await say('* A Rita pega um carvão do fogão e desenha o morro na parede, do lado da fita, do bilhete e da página riscada. Um zigue-zague. Uma cancela. Um X no Farol.');
  await say('A Guarda cercou o pé do morro. Tem cancela, cachorro, holofote, e lá em cima o vento derruba gente. Três pessoas e uma mala não furam um cerco.', 'rita');
  await say('Então a gente chama mais gente. Todo mundo que a gente ajudou até aqui.', 'me');
  sfx('catalog');
  await say('[Registro: aliados possíveis... ]', 'cat');
  await say('{o}a irmã do hospital. a moça da papelaria. os meninos da chaminé. o sargento que chorou na vila. o sino.{/}', 'eco8');
  await say('* A letra no ar é redonda. Âmbar. Sem colchetes.');
  await say('Catálogo... quem é ela?', 'me');
  await say('[Não sei. Ela mora entre as minhas linhas. Ela corrige a minha ortografia. Ela é... educada. Bate antes de entrar.]', 'cat');
  await say('{o}desculpa. eu não queria assustar. eu só sei a lista porque eu li você. todo dia. faz tempo.{/}', 'eco8');
  await say('Isso devia me assustar mais do que assusta.', 'me');
  await say('[O QUADRO DO CERCO, na parede da base: cinco aliados, pelos Marcos. Dona Iolanda é indispensável (ela tem o mapa); com ela e mais dois, dá para subir. Cada aliado a mais facilita a subida.]', 'cat');
  save2();
}
{ const _c8 = capitulo8; capitulo8 = async function () { if (!MAPS2.encosta9) montarMapas2(); if (G.flags.c8Fim) return capitulo9(); return _c8(); }; }
{ const _uw9c = updateWorld2; updateWorld2 = function () { _uw9c(); if (V.scene === 'world' && G.flags.c8Fim && !G.flags.c9Init && !worldBusy2() && !W2.mv) run2(capitulo9); }; }
// ---------- os aliados: onde estão ----------
{ const _mmA9 = montarMapas2; montarMapas2 = function () {
  _mmA9.apply(this, arguments);
  // o quadro do cerco, na base
  const B = MAPS2.interior; if (B && !B._q9) { B._q9 = true; const p = chaoLivre8(B, 9, 4) || [9, 4]; B.ents.push({ t: 'sign', id: 'quadro9', x: p[0], y: p[1], h: 26, spr: () => quadroCercoArt(), gone: () => !c9Ativo(), talk: quadroCerco }); }
  // Tico e Dito, no Bairro Baixo (de dia), varrendo chaminé
  const A = MAPS2.auren; if (A && !A._td9) { A._td9 = true; const us = new Set(); const p = chaoLivre8(A, 30, 10, us) || [30, 10], q = chaoLivre8(A, 33, 10, us) || [33, 10];
    A.ents.push(morador('tico', p[0], p[1], { id: 'tico9', dir: 'right', gone: () => !c9Ativo() || ehNoite(), rotina: rot([p[0], p[1], 'limpar', 400, 'up'], [p[0], p[1], 'olhar', 200, 'right']), talk: falaTicoDito9 }));
    A.ents.push(morador('dito', q[0], q[1], { id: 'dito9', dir: 'left', gone: () => !c9Ativo() || ehNoite(), rotina: rot([q[0], q[1], 'olhar', 300, 'left'], [q[0], q[1], 'varrer', 300, 'down']), talk: falaTicoDito9 })); }
  // o Brás e a mãe, na Vila (de noite)
  const Vv = MAPS2.ruaPavios; if (Vv && !Vv._b9) { Vv._b9 = true; const us = new Set(); const p = chaoLivre8(Vv, 26, 15, us) || [26, 15], q = chaoLivre8(Vv, 28, 15, us) || [28, 15];
    Vv.ents.push(morador('bras', p[0], p[1], { id: 'bras9', dir: 'right', gone: () => !c9Ativo() || !ehNoite(), talk: falaBras9 }));
    Vv.ents.push(morador('cotinha', q[0], q[1], { id: 'cotinha9', dir: 'left', gone: () => !c9Ativo() || !ehNoite(), talk: async () => { await say(pickOne(['Ele vem toda noite. Traz pão. Diz que é da Guilda. É dele, eu sei.', 'O meu Brasinho. Sargento. Eu disse que ele ia ser.']), 'cotinha'); } })); }
}; }
function quadroCercoArt() { return o9('qc' + nAliados9(), () => { const P = new Pix(30, 26);
  P.rect(0, 0, 30, 22, '#6a4a2a'); P.rect(1, 1, 28, 20, '#e8dcc0'); P.line(4, 18, 9, 10, '#2a2228'); P.line(9, 10, 14, 15, '#2a2228'); P.line(14, 15, 20, 6, '#2a2228'); P.line(20, 6, 25, 4, '#2a2228');
  P.rect(24, 2, 3, 4, '#ffd070'); for (let i = 0; i < 5; i++) { const on = i < nAliados9(); P.p(4 + i * 5, 20, on ? '#c83a3a' : '#8a8a8a'); P.line(4 + i * 5, 20, 25, 4, on ? '#c86a6a' : '#c8c0b0'); }
  P.rect(13, 22, 4, 4, '#6a4a2a'); return P.outline().canvas(); }); }
// ---------- DALVA ----------
{ const _fD9 = falaDalva; falaDalva = async function () {
  if (c9Ativo() && !aliado9('dalva')) {
    await say('Um cerco? No morro? Com o vento que faz lá em cima?', 'dalva');
    await say('* A Irmã Dalva já está enrolando gaze antes de terminar a pergunta.');
    await say('Eu fiz parto em carroça, menino. Costurei cabeça em barraca de feira. Eu monto uma tenda no pé do morro. Quem descer machucado, volta inteiro.', 'dalva');
    await say('E se a Guarda vier?', 'lume');
    await say('Guarda também quebra osso. Eu atendo todo mundo. É por isso que ninguém mexe com a minha tenda.', 'dalva');
    ganharAliado9('dalva'); save2(); return;
  }
  return _fD9();
}; }
// ---------- IOLANDA (de dia) e a página da Ofélia ----------
{ const _fI9 = falaIolanda; falaIolanda = async function () {
  if (c9Ativo() && !aliado9('iolanda')) {
    if (ehNoite()) { await say('* A Papelaria Pena & Fuligem, fechada. Um bilhete na porta: "De dia. Papel dorme de noite. Eu também."'); return; }
    playMusic('cha');
    await say('O Farol? Vocês vão subir no Farol?', 'iolanda');
    await say('* A Dona Iolanda some atrás do balcão. Volta com um canudo de papel amarelado, amarrado com barbante vermelho.');
    await say('O meu avô polia as lentes do Farol. Antes de ter Acendedor-Mor, quando o Farol era só um farol. Ele fez a fechadura da Porta das Lentes, lá na crista.', 'iolanda');
    await say('Ela não tem chave. Ela abre com LUZ. Luar batendo numa lente, desviado por espelho até o cristal da porta. Ele achava isso poético. Eu acho isso um inferno.', 'iolanda');
    await say('Quantos espelhos?', 'rita');
    await say('Aí é que tá. O desenho dele parou no meio. Ele morreu antes de terminar o caderno.', 'iolanda');
    await say('* Em cima do balcão, o Grimório se abre sozinho. As páginas viram como se alguém soprasse. Param na página seca, a que veio da Sala de Leitura Afogada.');
    sfx('rune'); V.shake = 2;
    await say('* E a página começa a se escrever. Letra inclinada, elegante, de bibliotecária. Tinta que vem de lugar nenhum.');
    const her = (typeof lerHeranca === 'function' && lerHeranca()) || {}, lembra = her.esc && her.esc.ofelia;
    await say(lembra ? '* "Meu baú. Você está subindo. Eu sinto pelo papel. Eu sempre senti quando alguém subia: era o único jeito de eu saber que o mundo lá em cima existia."' : '* "Para quem sobe: eu sinto pelo papel quando alguém sobe. Era o único jeito de eu saber que o mundo lá em cima existia."');
    await say('* "Três espelhos. O primeiro antes da coluna, onde a luz nasce. O segundo no alto, na beira norte. O terceiro embaixo da porta, olhando para cima. Barra para a direita: /. Sempre /."');
    await say('* "E outra coisa. Tem alguém morando no seu Catálogo. Ela é educada, bate antes de entrar. Seja gentil com ela. Ela já foi muito sozinha. Eu sei reconhecer. — ' + (lembra ? 'Ofélia, que lembra de você.' : 'O.') + '"');
    await say('{o}...obrigada, bibliotecária.{/}', 'eco8');
    await say('* A Dona Iolanda olha para o Grimório. Olha para você. Tira os óculos. Põe de novo.', 'iolanda');
    await say('Eu vou fingir que eu não vi um livro se escrever sozinho no meu balcão. Eu vou com vocês. Alguém tem que ler esse mapa, e não vai ser a mala.', 'iolanda');
    G.flags.c9Pagina = true; ganharAliado9('iolanda');
    await say('[A página da Ofélia ficou no Grimório. Na Crista, o ATRIL mostra o desenho.]', 'cat');
    save2(); playMusic('auren'); return;
  }
  return _fI9();
}; }
// ---------- TICO E DITO (de dia): a chaminé velha ----------
async function falaTicoDito9() {
  if (aliado9('tico')) { await say(pickOne(['A gente sobe pela chaminé quando vocês mandarem. Eu e o Dito. Igual antigamente.', 'O Dito lembra da chaminé melhor que de mim. Tudo bem. Eu lembro de mim por ele.']), 'tico'); return; }
  if (!G.flags.c9Tico1) {
    G.flags.c9Tico1 = true;
    await say('* O Tico, de cartola torta, varrendo a chaminé de uma padaria. Do lado, o Dito, de casaco cinza ainda, segurando a escada. Ele olha as nuvens como quem tenta ler.');
    await say('O Morro? Tem a CHAMINÉ VELHA. Da fundição antiga, de antes do Farol. Ela passa por DENTRO do morro e sai no meio da subida.', 'tico');
    await say('Eu e o Dito limpava ela quando era pequeno. Era o nosso esconderijo. A gente se chamava batendo na calha: TRÊS batidas. Se batesse duas, era a mãe chamando pro almoço.', 'tico');
    await say('Mas o caminho lá dentro é um labirinto de tijolo. Só o Dito sabia. E o Dito...', 'tico');
    await say('* O Dito olha para vocês com educação. Ele lembra do Tico agora, um pouco. Da chaminé, não.', 'n');
  }
  await say('Dito. Lembra da chaminé velha? Do nosso sinal?', 'tico');
  const c = await choose('* O Dito olha para o baú, esperando. Qual era o sinal dos meninos?', ['Duas batidas na calha', 'Três batidas na calha', 'Um assobio longo'], 'me', 0);
  if (c !== 1) { sfx('cancel'); await say('* Você bate com a tampa na calha. O Dito sorri, educado, e não reconhece.'); await say('Não... não era assim. Era... era quase isso.', 'dito'); return; }
  sfx('item'); await say('* Pom. Pom. Pom. Três batidas na calha de lata, com a tampa.');
  await say('* O Dito pisca. Uma vez. Duas. E bate de volta. Pom, pom, pom. Do outro lado da calha. Com a mão.');
  await say('...Esquerda, esquerda, sobe, direita onde tem o tijolo torto. Tico. TICO. A gente escondia o pão no tijolo torto!', 'dito');
  await say('* O Tico larga a vassoura. Não fala nada. Abraça o irmão com a cartola caindo, e o Dito deixa.', 'n');
  await say('A gente vai na frente, pela chaminé. Abre ela por dentro. Quando vocês chegarem no primeiro patamar da Encosta, a porta de ferro vai estar aberta.', 'tico');
  ganharAliado9('tico'); save2();
}
// ---------- BRÁS (de noite, na Vila) ----------
async function falaBras9() {
  if (aliado9('bras')) { await say(pickOne(['Na noite da subida, a Guilda inteira vai estar "bêbada" na cancela. Ninguém atua melhor que Caçador sem salário.', 'Cuida da minha mãe. Não. Cuida de vocês. Eu cuido dela.']), 'bras'); return; }
  playMusic('cha');
  await say('* O Sargento Brás, de folga, sem farda, sentado no banco da Vila com a mãe. Ela descasca uma laranja para ele, como se ele tivesse seis anos.');
  await say('Furar o cerco do Morro? Com a Guarda Real? Vocês sabem o que acontece com quem...', 'bras');
  await say('* A Dona Cotinha estende um gomo de laranja para ele. Ele pega. Come.');
  await say('...Tá. A Guilda tem vinte Caçadores sem salário desde que eu rasguei o cartaz de vocês. Vinte homens com raiva e tempo livre.', 'bras');
  await say('Na noite da subida, a gente arma uma BRIGA na cancela. Briga feia, de taverna. A Guarda vai ter que separar. A cancela fica sozinha.', 'bras');
  await say('Uma coisa. Os Pavios que sobem com os potes... a minha mãe subia. Antes de vocês. Se tiver alguém lá em cima que ainda é gente... trás de volta.', 'bras');
  const c = await choose('* O que dizer ao Brás?', ['A gente traz.', 'A gente tenta.'], 'me', 1);
  G.flags.c9PromessaBras = c === 0;
  await say(c === 0 ? 'Eu sei que traz. Vocês trouxeram ela.' : 'Tentar é mais do que a Coroa fez.', 'bras');
  ganharAliado9('bras'); save2(); playMusic('vila');
}
// ---------- DONA BADALADA (Velhágua): a Lume canta para o sino ----------
{ const _fC9 = falaCeleste; falaCeleste = async function () {
  if (c9Ativo() && !aliado9('badalada')) {
    await say('* O sacristão Celeste, varrendo o pé da torre. Lá em cima, a Dona Badalada, de bronze velho e verde, olha a cidade que parou de afundar.');
    await say('Vocês querem que ela toque? À meia-noite, na noite do morro? Pra fazer a Guarda olhar pra cá?', 'celeste');
    await say('Ela é o sino mais alto do vale. Quando ela toca, ouve até Auren. A Guarda vai achar que é alarme e mandar metade da gente do morro descer pra ver.', 'celeste');
    await say('Mas ela não toca por ordem. Nem por pedido. Ela toca por lembrança. Sempre foi assim. Ela precisa LEMBRAR de vocês.', 'celeste');
    await say('Ela lembra de mim. Eu cantei pra ela no fundo do rio.', 'lume');
    await say('Então canta de novo. Aqui em cima. Ela gosta de ouvir de perto.', 'celeste');
    const r = await ritmoLume();
    if (r.perf + r.bom < 3) { await say('* A Lume canta, desafina, ri. O sino escuta, quieto. Nada.'); await say('Ela ouviu. Mas ela é velha, ouve devagar. Tenta de novo, com calma.', 'celeste'); return; }
    sfx('crit'); V.shake = 10;
    await say('* DOOOONG.');
    await say('* O sino toca sozinho. Uma vez só, comprida, que atravessa a praça, o rio e a serra. Os pombos sobem todos ao mesmo tempo.');
    await say('DOOONG. (Lembro. A menina que cantou no fundo. A mala que me tirou do rio. Lembro.)', 'ancora');
    await say('Ela vai. À meia-noite. Ela nunca tocou meia-noite. Vai ser a primeira vez em cem anos.', 'celeste');
    ganharAliado9('badalada'); save2(); return;
  }
  return _fC9();
}; }
// ---------- a noite do cerco ----------
async function noiteDoCerco() {
  W2.mv = null; G.flags.c9P2 = true; G.hora = 21 * 60 + 30;
  await fadeOut(24); playMusic('subida');
  V.scene = 'world'; loadMap2('sope9', ...SO9.entra, 'right'); await fadeIn(24);
  await say('* A noite do cerco. Uma noite sem lua, de vento cortante. O pé do morro, com a neve batida de bota.');
  if (aliado9('dalva')) await say('* A tenda da Irmã Dalva, com uma cruz vermelha de pano costurada na lona. Já tem um guarda da Guarda Real lá dentro, com o tornozelo enfaixado, tomando sopa.');
  if (aliado9('iolanda')) await say('* A Dona Iolanda, numa mesinha dobrável, com o mapa do avô aberto e preso com quatro pedras. Óculos na ponta do nariz. Xale. Vela.');
  if (aliado9('tico')) await say('* Tico e Dito, encostados na boca da Chaminé Velha, de cara preta de fuligem e sorriso branco. Já entraram e voltaram duas vezes.');
  if (aliado9('bras')) await say('* E ao lado das barracas da Guilda, vinte Caçadores de casaco velho, fingindo que estão bêbados. Alguns não estão fingindo.');
  await say('[O SOPÉ: suba pela cancela. ' + (aliado9('bras') ? 'O Brás vai cuidar da Guarda.' : 'A Guarda está de olho: vai ter luta na cancela.') + (aliado9('dalva') ? ' A tenda da Dalva cura e enche os frascos.' : '') + ']', 'cat');
  save2();
}
