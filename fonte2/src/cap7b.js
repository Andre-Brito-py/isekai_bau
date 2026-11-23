// ================= CAPÍTULO 7 — Parte 2: O CORAÇÃO =================
// O CORAÇÃO: um poço no escuro, patamares e PONTES DE CRISTAL que só existem enquanto o ECO do canto da Lume acende.
// Lá embaixo, pelo elevador de caçamba, o ANDAR 1 DA MASMORRA do jogo 1, visto de cima e drenado: a Câmara do
// Despertar (o pedestal onde o baú acordou), o gancho onde a Lume ficou pendurada, a Sala de Leitura Afogada (a
// página da Ofélia), a Antessala do Musgo (o GUARDA-MUSGO AMBARINO, mini-chefe, preso num cano). O buraco da broca desce
// ao FUNDO: O EXTRATOR (chefe). Depois: o que o capítulo cobra (está no jogo e na bíblia), a 2ª EVOLUÇÃO, a subida, a
// garagem. (Detalhes da história: só no jogo e na bíblia.)
{ const _mm7b = montarMapas2; montarMapas2 = function () {
  _mm7b.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== O CORAÇÃO =====
  MAPS2.coracao = { rows: ROWS7.coracao, key: KEY7, name: 'Mina de Origem · O Coração', music: 'coracao7', batBg: bgCoracao, bg: '#04020a', semCeu: true, dark: 'rgba(4,2,10,0.80)', get lights() { return luzesVeio(this, 34); },
    props: [],
    ents: [
      ...CO7.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('bombas', BO7.saida[0][0], BO7.saida[0][1] + 1, 'down'); await fadeIn(10); } })),
      ...CO7.elevador.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: descerElevador })),
      ...Object.entries(CO7.eco).map(([k, [x, y]]) => ({ t: 'sign', id: 'eco' + k, x, y, h: 20, spr: () => pedraEcoArt(ecoT(k) > 0), get luz() { return ecoT(k) > 0 ? 90 : 18; }, talk: () => pedraEco(k) })),
      marcoEnt(...CO7.marco),
      ...CO7.bau.map(([x, y], i) => bauEnt('coracao', 'b' + i, x, y, async () => { if (i) { await dar('frasco', 1); await dar('pluma', 1); } else { await dar('tinta', 3); await dar('cobres', 80); } })),
      inimigo('ms1', 'morcegoSelo', ...CO7.foes[0], ['morcegoSelo', 'morcegoSelo'], { spr: (t) => morcegoSeloArt(Math.floor(t / 6) % 2), h: 22, bg: bgCoracao }),
      inimigo('rv1', 'ratoVelaA', ...CO7.foes[1], ['ratoVelaA', 'morcegoSelo', 'ratoVelaA'], { spr: (t, d) => { const c = ratoVelaAArt(Math.floor(t / 8) % 2); return d === 'left' ? flipC(c) : c; }, h: 22, bg: bgCoracao, get luz() { return 30; } }),
      { t: 'sign', x: CO7.marca[0], y: CO7.marca[1], h: 20, talk: async () => { await say('* Riscado na pedra, com canivete: "Z.C. desceu aqui. Turno do dia." E embaixo, mais fundo, outra mão: "Ele não subiu."'); } }
    ],
    onEnter: async () => { if (!G.flags.c7Coracao) { G.flags.c7Coracao = true; await say('* O Coração. Um poço redondo, tão largo que a luz da Lume não acha a outra parede. Lá embaixo, muito embaixo, uma batida: TUM. TUM. Como um peito.'); await say('* Os canos de âmbar descem pela parede em espiral. Entre os patamares, nada. Só escuro e o cheiro de vela apagada.'); await say('[Profundidade... conhecida. Eu conheço este escuro. Eu NASCI neste escuro.]', 'cat'); await say('Aqui não tem ponte nenhuma.', 'rita'); await say('Tem pedra com buraco. Pedra que canta. Eu ouvi uma dessas antes de vocês me acharem, lá embaixo.', 'lume'); save2(); } }
  };
  // ===== ANDAR 1 DA MASMORRA =====
  MAPS2.andar1 = { rows: ROWS7.andar1, key: KEY7, name: 'A Masmorra · Andar 1 (visto de cima)', music: 'despertar', batBg: bgAndar1, bg: '#0a120c', semCeu: true, dark: 'rgba(6,12,8,0.34)', get lights() { return [...luzesVeio(this, 40), [20, 4, 80], [9, 12, 70], [17, 13, 60], [30, 12, 70], [34, 15, 60], [16, 23, 70], [24, 25, 70], [20, 18, 50]]; },
    props: [
      { img: pedestalArt, x: AN7.pedestal[0] - 1.2, y: AN7.pedestal[1] + 1, solid: [[AN7.pedestal[0] - 1, AN7.pedestal[1], 3, 1]] },
      { img: ganchoLustreArt, x: AN7.gancho[0] - 0.1, y: AN7.gancho[1] + 0.2, by: (AN7.gancho[1] - 1) * TS },
      ...AN7.estantes.map(([x, y]) => ({ img: estanteAfogadaArt, x: x - 1.5, y: y + 1, solid: [[x - 1, y, 3, 1]] })),
      { img: () => canoAmbarArt(19, true), x: 33.2, y: 20, by: 1 * TS },
      { img: () => canoAmbarArt(8, false), x: 12, y: 21.2, by: 19 * TS }
    ],
    ents: [
      ...AN7.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('coracao', CO7.elevador[0][0], CO7.elevador[0][1] - 1, 'up'); await fadeIn(12); } })),
      ...AN7.descida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: descerFundo7 })),
      { t: 'sign', x: AN7.pedestal[0], y: AN7.pedestal[1] + 1, h: 20, talk: falaPedestal },
      { t: 'sign', x: AN7.gancho[0], y: AN7.gancho[1] + 1, h: 20, talk: falaGancho },
      { t: 'sign', x: AN7.ofelia[0], y: AN7.ofelia[1], h: 20, talk: falaPaginaOfelia },
      marcoEnt(...AN7.marco),
      ...AN7.bau.map(([x, y], i) => bauEnt('andar1', 'b' + i, x, y, async () => { if (i) { await dar('frasco', 1); await dar('tinta', 2); } else { await dar('pluma', 2); } })),
      inimigo('co1', 'cogumeloA', ...AN7.foes[0], ['cogumeloA', 'ratoVelaA'], { spr: (t) => cogumeloAArt(Math.floor(t / 14) % 2), h: 26, bg: bgAndar1 }),
      inimigo('co2', 'cogumeloA', ...AN7.foes[1], ['cogumeloA', 'cogumeloA', 'morcegoSelo'], { spr: (t) => cogumeloAArt(Math.floor(t / 14) % 2), h: 26, bg: bgAndar1 }),
      inimigo('rv2', 'ratoVelaA', ...AN7.foes[2], ['ratoVelaA', 'ratoVelaA'], { spr: (t, d) => { const c = ratoVelaAArt(Math.floor(t / 8) % 2); return d === 'left' ? flipC(c) : c; }, h: 22, bg: bgAndar1 }),
      ...AN7.musgoTrig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c7Musgo, run: lutaMusgo }))
    ],
    onEnter: async () => { if (!G.flags.c7Andar1) await chegaAndar1(); }
  };
  // ===== O FUNDO =====
  MAPS2.fundo7 = { rows: ROWS7.fundo7, key: KEY7, name: 'O Coração · O Fundo', music: 'coracao7', batBg: bgFundo7, bg: '#0a0608', semCeu: true, tint: 'rgba(255,170,90,0.08)',
    props: [{ img: () => extratorMapaArt(!G.flags.c7Extrator), x: FU7.extrator[0] - 0.5, y: FU7.extrator[1] + 1 }],
    ents: [ ...FU7.frente.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c7Extrator, run: lutaExtrator })) ],
    onEnter: async () => { if (!G.flags.c7Fundo) { G.flags.c7Fundo = true; await say('* O fundo. Uma câmara redonda, quente, com as paredes cheias de veio dourado. No meio, cravada no chão como uma estaca, uma máquina do tamanho de uma igreja: o EXTRATOR.'); await say('* As mangueiras dele descem pelo chão. Para baixo. Para onde ficam os outros andares da masmorra. TUM. TUM. Cada batida, o veio das paredes apaga um pouquinho.'); await say('Ela tá bebendo a masmorra. A sua casa, @.', 'lume'); await say('[E, com a masmorra, tudo que estava guardado nela.]', 'cat'); } }
  };
  grade(MAPS2.andar1); grade(MAPS2.fundo7);
}; }
async function descerElevador() {
  W2.mv = null;
  await say('* Uma caçamba de ferro presa num cabo, no fim do último patamar. Uma alavanca. Uma placa: "NÍVEL DE EXTRAÇÃO 1".');
  sfx('door'); await fadeOut(16); sfx('rumble'); await wait(30);
  loadMap2('andar1', ...AN7.entra, 'down'); await fadeIn(16);
  if (MAPS2.andar1.onEnter) await MAPS2.andar1.onEnter();
}
async function chegaAndar1() {
  G.flags.c7Andar1 = true;
  await say('* A caçamba para. O cabo estala. Vocês descem num chão de musgo, úmido, e o cheiro chega antes de tudo: livro molhado, vela, pedra.');
  await say('[...Coordenadas confirmadas. Andar 1. CÂMARA DO DESPERTAR.]', 'cat');
  await say('* Você conhece este lugar. Você conhece cada pedra deste lugar. Foi aqui. Foi exatamente aqui que você abriu a tampa pela primeira vez, sem saber que tinha tampa.');
  await say('Esse é o lugar? O SEU lugar?', 'rita');
  await say('* Mas está diferente. Canos de âmbar entram pelas paredes como raízes. O musgo está seco perto deles. As velas do corredor estão apagadas, e ninguém vem acender.');
  await say('Eles... tão drenando. A masmorra inteira. Lá de cima.', 'lume');
  save2();
}
async function falaPedestal() {
  if (G.flags.c7Pedestal) { await say('* O pedestal. A marca do seu fundo ainda está na pedra.'); return; }
  G.flags.c7Pedestal = true; playMusic('cha');
  await say('* Um pedestal de pedra, baixinho. Em cima, a marca retangular de um baú que ficou ali tempo demais. A poeira desenha a sua forma.');
  await say('* Você chega perto. Encaixa o fundo na marca. Serve. Ainda serve.');
  await say('Eu acordei aqui. Eu não sabia o que eu era. Eu pensei que era um sonho ruim de quem dormiu no ônibus.', 'me');
  await say('E aí?', 'lume');
  await say('E aí eu comi um rato. Foi a primeira coisa que eu fiz na vida nova. Comi um rato.', 'me');
  await say('* A Rita ri. Não queria rir, e ri, e a risada ecoa pela Câmara do Despertar inteira.');
  playMusic('despertar');
}
async function falaGancho() {
  if (G.flags.c7Gancho) { await say('* O gancho do lustre, no teto. Vazio.'); return; }
  G.flags.c7Gancho = true; playMusic('cha');
  await say('* No teto do corredor, um gancho de ferro. Enferrujado. Vazio.');
  await say('* A Lume para embaixo dele e não fala nada por um tempo.');
  await say('Eu ficava aqui. Pendurada. Um lustre que ninguém acendia. Vinte anos, trinta, eu não sei. Ninguém passava. Ninguém olhava pra cima.', 'lume');
  await say('Aí passou um baú. Um baú que olhou pra cima.', 'lume');
  await say('Eu olho pra cima. É mania. Na Terra eu andava olhando o céu e tropeçava.', 'me');
  await say('* A Lume encosta a mão no gancho. Depois tira, devagar, como quem fecha uma porta sem fazer barulho.');
  await say('Não precisa voltar. Já tá aceso.', 'lume');
  playMusic('despertar');
}
async function falaPaginaOfelia() {
  if (G.flags.c7Pagina) { await say(G.flags.c7PaginaFeita ? '* A estante afogada. A página agora está no seu Grimório.' : '* A estante afogada. A página da Ofélia está no Vão: a Dona Iolanda, em Auren, sabe costurar papel antigo.'); return; }
  G.flags.c7Pagina = true; sfx('item');
  const her = (typeof lerHeranca === 'function' && lerHeranca()) || {}, lembra = her.esc && her.esc.ofelia;
  await say('* Na Sala de Leitura Afogada, uma estante caída na água rasa. Presa entre dois livros inchados, uma página seca. Seca, num lugar onde tudo está molhado.');
  await say('* A letra é inclinada, elegante, de bibliotecária. Uma letra que você conhece.');
  await say(lembra ? '* "Meu baú. Se você voltar aqui, é porque lá em cima não está bom. Eu deixei esta página seca de propósito. Escreve nela o que você precisar. — Ofélia, que lembra de você."' : '* "Para quem voltar: esta página aceita qualquer feitiço. Não deixe molhar. — O."');
  await say('[Uma página de grimório ANTIGO. Não cabe no Grimório assim, solta. Precisa ser costurada. Quem costura papel antigo...]', 'cat');
  await say('A Dona Iolanda! Na papelaria. Ela costura qualquer papel.', 'lume');
}
async function lutaMusgo() {
  if (G.flags.c7Musgo) return; W2.mv = null;
  await say('* A Antessala do Musgo. No meio, de joelhos, um gigante de pedra coberto de musgo seco. Um cano de âmbar entra nas costas dele. A cada batida lá de baixo, ele estremece.');
  await say('[O GUARDA-MUSGO. O primeiro chefe. O primeiro que você venceu, quando era só um caixote com dente.]', 'cat');
  await say('* Os olhos dele acendem. Verdes. Depois dourados. Ele levanta, porque um guarda levanta quando alguém entra na antessala. É a única coisa que sobrou nele.');
  const r = await lutaMapa(['musgoA'], { bg: bgAndar1, music: 'boss', pos: [[184, 156]], intro: async () => { const e = BT.foes[0]; e.phases = fasesMusgo(); e.ct = 12; callout('GUARDA-MUSGO AMBARINO', '#8ac860', 90); } });
  if (r !== 'win') return;
  G.flags.c7Musgo = true; playMusic('despertar');
  await say('* O gigante cai de joelhos de novo. A Rita puxa o cano das costas dele com as duas mãos. O âmbar espirra, dourado, e para.');
  await say('* O Guarda-Musgo olha para você. Um olhar muito velho. Depois se desfaz em musgo, devagar, como quem deita para dormir. No meio do musgo, uma semente verde do tamanho de um punho.');
  G.flags.c7Semente = true; sfx('item');
  await say('* {y}Semente do Musgo{/} no Vão. (Ela quer terra boa. A estufa da Cidade Alta tem a melhor terra que vocês já viram.)');
  await say('Ele guardava a porta. Agora não precisa mais.', 'lume');
  save2();
}
async function descerFundo7() {
  W2.mv = null;
  if (!G.flags.c7Musgo) { await say('* O buraco da broca, que desce ainda mais. O Guarda-Musgo está na frente, de joelhos.'); return; }
  await say('* O buraco que a broca abriu desce reto, liso, quente. Vocês descem segurando nos canos.');
  await fadeOut(16); loadMap2('fundo7', ...FU7.entra, 'up'); await fadeIn(16);
  if (MAPS2.fundo7.onEnter) await MAPS2.fundo7.onEnter();
}
async function lutaExtrator() {
  if (G.flags.c7Extrator) return; W2.mv = null;
  await say('* O Extrator percebe vocês. Não tem olho: tem uma câmara de vidro cheia de âmbar no peito, que vira para vocês como um girassol.');
  await say('Desliga isso, @. Desliga ISSO!', 'rita');
  const r = await lutaMapa(['extrator'], { bg: bgFundo7, music: 'boss', pos: [[186, 150]], intro: async () => { const e = BT.foes[0]; e.phases = fasesExtrator(); e.ct = 15; callout('O EXTRATOR', '#ffd070', 90); } });
  if (r !== 'win') return;
  G.flags.c7Extrator = true;
  await cenaFundo7();
}
// o que o Cap. 7 cobra (segredo da história: só aqui no jogo e na bíblia)
async function cenaFundo7() {
  playMusic(null);
  await say('* O Extrator para. A batida, TUM, TUM, falha uma vez. Duas. E silencia.');
  await say('* Lá em cima, muito em cima, em Auren, alguma coisa pisca. Vocês não veem. Mas sentem: o veio das paredes inteiro, de uma vez, apaga e acende.');
  await wait(40);
  await say('* Passos. Na escada de ferro que desce pela parede do fundo, uma lanterna. Depois outra. Depois dez. A Guarda Real. E, na frente deles, sem lanterna nenhuma, de casaco escuro e luvas, um homem que desce como quem desce para o próprio porão.');
  playMusic('perda');
  await say('Senhor baú. Senhoras.', 'vesper');
  await say('* O Conde Vesper. O Acendedor-Mor. Ele olha o Extrator parado, as mangueiras caídas, o vidro rachado. Não está zangado. Está fazendo conta.');
  await say('Doze anos sem uma noite apagada, e em três minutos o hospital dos pobres ficou no escuro. Três minutos. Eu anotei.', 'vesper');
  await say('Ele tá bebendo a MASMORRA. O lugar de onde ele veio! E o senhor sabe!', 'rita');
  await say('Sei. Sei de onde o senhor baú veio, sei o que tem lá embaixo, sei quantas noites cada andar rende. A masmorra é uma mina, senhora Rita. A mais funda que existe. A Coroa só tirou a placa.', 'vesper');
  await say('* Ele tira o caderno preto do bolso do casaco. Abre numa página em branco.');
  await say('A máquina precisa religar. E para religar, precisa de uma carga. Grande. O senhor quebrou. É justo que o senhor pague.', 'vesper');
  await say('* Os guardas seguram a Rita. Seguram a Lume. Duas mangueiras do Extrator levantam do chão, devagar, sem ninguém tocar nelas, e viram para a Lume.');
  await say('Não. NÃO. Leva as minhas! Eu tenho mais! Eu tenho uma masmorra inteira dentro da tampa!', 'me');
  await say('As do senhor eu não sei ler. Ninguém sabe ler um baú. É o senhor, aliás, que lê os outros.', 'vesper');
  await say('* A ponta da mangueira chega a um palmo do rosto da Lume. A chama dela treme e encolhe.');
  await wait(20);
  await say('* E então, um barulho que não pertence a uma mina. Uma buzina. Velha, rouca, de ônibus. Ecoando pelo buraco da broca, lá de cima.');
  await say('* Um cabo de aço desce pelo buraco. Pendurado nele, de macacão de mecânico e com a chave do 31 no bolso, o Seu Jorge.');
  await say('Eu disse que tinha guincho. Cento e vinte metros. Sobrou cabo.', 'jorge');
  await say('Senhor Jorge. O motorista.', 'vesper');
  await say('O motorista. É isso. A vida inteira, é isso que eu sou.', 'jorge');
  await say('* O Seu Jorge olha as mangueiras. Olha a Lume. Olha você. E entende mais rápido do que vocês, como quem já viu muito acidente na estrada.');
  await say('Essa coisa come lembrança? Então leva as minhas. Eu tenho cinquenta anos de estrada aqui dentro. Dois mundos. Um ônibus que atravessou o chão. Isso deve render um bocado de noite.', 'jorge');
  await say('Seu Jorge, não! NÃO!', 'lume');
  await say('* O Vesper abre o caderno numa página nova. Escreve. Faz uma conta. Olha o Jorge por cima dos óculos como um avaliador de penhor olha um relógio de ouro.');
  await say('...Cinquenta anos de estrada. Uma travessia entre mundos. Ninguém nunca me ofereceu algo assim. É generoso, senhor Jorge. É muito mais do que a máquina precisa.', 'vesper');
  await say('Mais? Então solta as meninas e deixa eles irem embora. O troco é deles.', 'jorge');
  await say('* O Vesper pensa. Um segundo, só. E faz um gesto com a luva. Os guardas soltam a Rita e a Lume.', 'n');
  await say('Combinado. Eu cumpro o que eu anoto, senhor Jorge. Sempre.', 'vesper');
  await say('* O Seu Jorge vem até você. Agacha. Bate duas vezes na sua tampa, como batia no painel do 31 quando ele pegava no tranco.');
  await say('Cuida do 31. Ele é chato de pegar no frio. Tem que dar duas bombadas no pedal antes.', 'jorge');
  await say('Seu Jorge. Por favor. A gente acha outro jeito. A gente SEMPRE acha outro jeito!', 'me');
  await say('Acha sim. Vocês acham. É por isso que eu tô fazendo isso. Alguém tem que ficar pra achar.', 'jorge');
  await say('* Ele se levanta, vai até a cadeira de ferro na frente do Extrator e senta. Ajeita o boné. As mangueiras descem até ele com uma delicadeza horrível.');
  await say('Lume. Canta aquela. A da estrada. Pra eu ir ouvindo.', 'jorge');
  sfx('rune'); playMusic('ending');
  await say('* A Lume canta. A voz falha no segundo verso e ela continua assim mesmo, falhada, cada vez mais alto, enquanto a luz dourada sai do Seu Jorge e sobe pelas mangueiras.');
  await say('* O Extrator dá uma batida. TUM. O veio das paredes acende inteiro, mais forte do que nunca.');
  await wait(40); playMusic(null);
  await say('* O Seu Jorge pisca. Olha as próprias mãos de mecânico como quem olha luvas emprestadas. Olha a Rita. Olha a Lume, que parou de cantar. Olha você.');
  await say('* E diz, com a voz educada e vazia que vocês conhecem de tantas ruas:');
  await say('Boa noite. Eu acendo os postes da Coroa.', 'pavioG');
  G.flags.c7Jorge = true;
  await wait(30);
  await say('* O Vesper fecha o caderno. Um guarda tira o macacão do Jorge e põe um casaco cinza nos ombros dele. O Jorge agradece. Não sabe pelo quê.');
  await say('Ele vai ter pensão. Casa na Vila. Sopa às sete. Eu cuido dos meus Pavios, senhor baú. Melhor do que o mundo cuidou deles antes.', 'vesper');
  await say('* Ele sobe a escada de ferro. Os guardas sobem atrás. O Seu Jorge sobe no meio deles, de casaco cinza, devagar, segurando o corrimão como quem tem medo de altura. Ele nunca teve medo de altura.');
  await say('* Ninguém prende vocês. Ninguém precisa.');
  await wait(50);
  await say('* A Rita está sentada no chão, com a lança atravessada no colo. A Lume está de pé, olhando a escada vazia. Você está no meio da câmara, perto do veio, e não consegue fechar a tampa.');
  await say('* O veio debaixo de você pulsa. O âmbar bruto da masmorra, o mesmo que fez o seu corpo. Ele está quente. Ele está CHAMANDO.');
  await cenaEvolucao7();
  playMusic('perda');
  await say('* O baú novo se levanta. Pesa diferente. Olha diferente. A Rita olha para você e não diz nada. A Lume encosta a mão na sua tampa nova.');
  await say('Ele disse "alguém tem que ficar pra achar". A gente ficou. Então a gente acha.', 'lume');
  await say('A gente devolve, Lume. Um por um. O Jorge por último, porque ele vai fazer questão de ser o último da fila.', 'rita');
  await fimCap7();
}
async function fimCap7() {
  await fadeOut(30);
  G.flags.c7Fim = true; G.hora = 23 * 60; G.dia = (G.dia || 0) + 1; G.disfarce = null;
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('perda'); await fadeIn(30);
  await say('* A subida durou a noite toda. A forma nova aguentou o peso das duas pelo poço inteiro. O 31 estava onde o Jorge deixou, de motor ainda morno.');
  await say('* Ninguém sabia dirigir. A Lume sentou no banco do motorista e chorou. A Rita deu duas bombadas no pedal, porque ele disse que tinha que dar duas, e o 31 pegou.');
  await say('* Eles voltaram devagar. Em primeira. A serra inteira em primeira.');
  await say('* Agora, a garagem da base. O 31 estala, esfriando. A chave no contato. O boné do Jorge no painel.');
  await say('[Registro: Seu Jorge. Motorista. Alma número zero do ônibus 31. ...Registro em aberto.]', 'cat');
  await say('Em aberto. Não apaga. Não ousa apagar.', 'me');
  await say('Não apago. Eu também tenho uma tampa, sabia? Eu também guardo coisa.', 'cat');
  await wait(30);
  await say('* Naquela noite, da janela alta da base, a Irmã Dalva viu uma coisa que não via fazia doze anos.');
  await say('* Um bairro inteiro de Auren apagou. De propósito. Uma rua, depois a outra, como quem apaga as velas de um bolo.');
  await say('Ele tá cobrando.', 'dalva');
  save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 7', 'A Mina de Origem', '', 'Alguém tem que ficar pra achar.']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(20);
  await say('* (O Capítulo 8 está a caminho. Os Marcos levam aonde vocês já foram: ainda há o que devolver pelo caminho.)');
}

// o veio de âmbar ilumina o escuro (cada tile 'a' é uma luz pequena)
function luzesVeio(m, r) { if (m._luzV) return m._luzV; const L = []; m.rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === 'a') L.push([x, y, r]); }); return (m._luzV = L); }
