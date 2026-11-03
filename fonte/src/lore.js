// ================= POR QUE A GUILDA E A COROA DESCERAM: A GRANDE DESCIDA =================
// O motivo da guerra aparece aos poucos, em três lugares:
//   Cap. 2  Acampamento: Edital da Coroa (a cidade está afundando; paga-se por monstro e por frasco de ÂMBAR)
//   Cap. 3  Pátio: Quadro de Ordens (cotas de âmbar; o Catálogo revela o que o âmbar é)
//   Cap. 5  Terminal: Mesa da Grande Descida (o que cada lado quer: Coroa, Guilda e Jorge)
// E os caixotes de cada região mostram equipamento contra TODO tipo de monstro, não só mímicos.

// ---- caixotes por região (substituem os textos genéricos de 'K') ----
const LOOK_K = {
  guilda: [
    '* Caixote da Guilda: "REDES DE MALHA FINA — para Morcegos de Papel. NÃO usar perto de fogo." Alguém usou perto de fogo.',
    '* Sal grosso, um caixote inteiro. Etiqueta: "LODO DE TINTA: jogar, esperar, varrer."',
    '* Abafadores de vela, dezenas. "RATO-DE-VELA: apagar a vela ANTES de pegar o rato." Do lado, uma lista de dedos queimados.',
    '* Máscaras de pano recheadas de carvão. "COGUMELO TOSSIDOR: não respirar. Sério."',
    '* Luvas de couro grosso e um aviso: "CARANGUEJO-BALANÇA: virar de costas. Ele detesta."',
    '* Pavios de cera doce para isca. "LAMPARINAS ERRANTES seguem cheiro de festa."',
    '* Pés de cabra nos tamanhos P, M e G. O G tem uma etiqueta: "para mímico de luxo". Você prefere não saber.',
    '* Frascos vazios, centenas, cada um com a etiqueta "ÂMBAR — 1 DOSE". Embaixo: "PAGO A PESO NA SUPERFÍCIE".'
  ],
  acampamento: [
    '* Um caixote com o carimbo azul da Coroa: "PARA A GRANDE DESCIDA". Arpões, redes, sal, querosene. Material de guerra, não de caça.',
    '* Inventário pregado na tampa: 40 redes, 12 barris de sal, 200 pés de cabra, 6 jaulas e 300 frascos para âmbar. Os frascos são a maior encomenda.',
    '* Lanças com ponta de prata. "GÁRGULAS: ferro só arranha."',
    '* Sinos de alarme, um para cada barraca. "Se a mobília se mexer, TOQUE."',
    '* Caixote de "isca de polvo": chapéus velhos e binóculos de teatro quebrados. Alguém conhece bem o Polvo do Camarote.',
    '* Um caixote vazio com a etiqueta "MÍMICOS — esgotado". É estranhamente lisonjeiro.'
  ],
  fortaleza: [
    '* Caixote do Exército de Auren: "PRATA PARA GÁRGULAS — 2 por soldado".',
    '* Mordaças de couro. "ESCRIBAS SOMBRIOS: amordaçar ANTES que terminem a frase."',
    '* Correntes com cadeado e uma plaquinha: "JAULA 4 — monstro vivo rende mais âmbar".',
    '* Frascos de âmbar cheios, lacrados com o selo azul da Coroa. Eles brilham devagar, como quem respira.',
    '* "COTA DA SEMANA: 60 FRASCOS". Embaixo, a giz: "faltam 41".',
    '* Algemas pequenas. Pequenas demais para monstro. Você não gosta de pensar nisso.',
    '* Óleo para lanternas de guerra. "FAROL DE PRATA: cega tudo que tem olho. Inclusive o soldado ao lado."'
  ],
  arquivo: [
    '* Caixotes de mudança, lacrados há trezentos anos. Um deles diz: "FRÁGIL — LOUÇA DA TIA INÊS".',
    '* Um caixote de cartas sem endereço. Todas começam com "Caso alguém encontre isto".',
    '* Caixote com o aviso: "DEVOLVER À SUPERFÍCIE". Ninguém nunca devolveu.',
    '* Ferraduras, uma roda de carruagem e um chapéu de cocheiro, tudo bem arrumado. Alguém cuida disso aqui embaixo.'
  ],
  frente: [
    '* Equipamento para cada tipo de monstro, separado em pilhas: sal para lodos, prata para gárgulas, abafadores para ratos, redes para morcegos, ganchos para enguias, pólvora para portas.',
    '* "LOTE 31 — ÂMBAR BRUTO, NÃO REFINADO". O lote tem o número do seu ônibus. Coincidência, você diz para si mesmo.',
    '* Barris de pólvora com rótulo: "PARA PORTAS SELADAS. NÃO ABRIR A QUE CANTA."',
    '* Cobertores dobrados: "INVOCADOS — 1 POR PESSOA". Tem menos cobertores do que gente.',
    '* Uma ordem colada na tampa: "A Coroa paga a viagem de volta de quem entregar 10 frascos." Embaixo, à caneta: "volta pra ONDE?"',
    '* Ganchos de carga, cordas e uma caixa de giz. "Marcar com X os monstros já contados." Tem muito X.',
    '* Iscas de enguia, armadilhas para traça e um saco de sal escrito "CARANGUEJO-FERRUGEM: corrói. Use luva."'
  ]
};
const K_REGION = {
  patamar: 'guilda', mercado: 'guilda', teatro: 'guilda', acampamento: 'acampamento',
  escadaria3: 'fortaleza', muralhas: 'fortaleza', patio: 'fortaleza', jaula: 'fortaleza',
  devolucao: 'arquivo', correio: 'arquivo',
  terminal: 'frente', trincheira: 'frente', manobras: 'frente', oficina: 'frente', garagem: 'frente'
};
function lookLines(c) { if (c === 'K' && K_REGION[WD.id]) return LOOK_K[K_REGION[WD.id]]; return LOOK[c]; }

// ---- sprites: quadro de avisos e mesa de comando ----
const _bsLore = buildSprites;
buildSprites = function () {
  _bsLore();
  const board = (paper) => cv4(16, 16, r => {
    r(2, 3, 2, 13, 'k'); r(12, 3, 2, 13, 'k'); r(3, 4, 1, 12, '#5a3420'); r(12, 4, 1, 12, '#5a3420');
    r(0, 1, 16, 11, 'k'); r(1, 2, 14, 9, '#a87850'); r(1, 2, 14, 1, '#c89868');
    r(2, 3, 5, 4, '#e8e4dc'); r(8, 3, 5, 3, paper); r(3, 7, 4, 3, '#e8dcc0'); r(9, 7, 4, 3, '#e8e4dc');
    r(3, 4, 3, 1, '#8a8099'); r(3, 5, 2, 1, '#8a8099'); r(9, 4, 3, 1, '#ffffff'); r(4, 8, 2, 1, '#c83838'); r(10, 8, 2, 1, '#8a8099');
    r(4, 3, 1, 1, '#c83838'); r(10, 3, 1, 1, '#f0c040'); r(5, 7, 1, 1, '#3a70c0'); r(11, 7, 1, 1, '#c83838');
  });
  SP.board = [board('#3a70c0'), board('#3a70c0')];   // edital (selo azul da Coroa)
  SP.board3 = [board('#c83838'), board('#c83838')];  // quadro de ordens do exército
  const table = f => cv4(16, 16, r => {
    r(0, 6, 16, 6, 'k'); r(1, 7, 14, 4, '#e8dcc0'); r(1, 7, 14, 1, '#ffffff');
    r(2, 8, 4, 2, '#9ab8c8'); r(7, 9, 3, 1, '#8a8099'); r(11, 8, 3, 2, '#c8b890'); r(5, 10, 6, 1, '#b8a888');
    r(4, 8, 1, 1, '#3a70c0'); r(8, 8, 1, 1, '#c83838'); r(12, 9, 1, 1, f ? '#ffe066' : '#f0c040'); r(12, 8, 1, 1, '#ffffff');
    r(1, 11, 14, 1, '#5a3420'); r(2, 12, 2, 4, 'k'); r(12, 12, 2, 4, 'k'); r(2, 12, 1, 4, '#7a4a2a'); r(12, 12, 1, 4, '#7a4a2a');
  });
  SP.warmap = [table(0), table(1)];
};
MAPS.acampamento.ents.push({ id: 'lore_edital', kind: 'npc2', x: 13, y: 1, sp: 'board', talk: 'loreEdital' });
MAPS.patio.ents.push({ id: 'lore_ordens', kind: 'npc2', x: 7, y: 1, sp: 'board3', talk: 'loreOrdens' });
MAPS.terminal.ents.push({ id: 'lore_mesa', kind: 'npc2', x: 5, y: 1, sp: 'warmap', talk: 'loreMesa' });

Object.assign(STORY, {
  // Cap. 2: a versão oficial (e o primeiro cheiro de âmbar)
  async loreEdital() {
    const seen = G.flags.lore_edital; G.flags.lore_edital = true;
    if (seen) { await say('* "EDITAL DA COROA — A GRANDE DESCIDA. Paga-se por monstro e por frasco de âmbar." O bilhete do Biscoito continua lá.'); return; }
    await say('* Um quadro de avisos da Guilda, com papéis pregados uns por cima dos outros.');
    await say('* O maior tem o selo azul da Coroa:\n* "EDITAL DE AUREN — A GRANDE DESCIDA. Velhágua está afundando."');
    await say('* "Neste ano a masmorra engoliu a Rua dos Tanoeiros, o poço da praça e o coreto. Com a banda dentro."');
    await say('* "A Coroa convoca caçadores para limpar os andares, um por um, e trazer ÂMBAR das profundezas. Paga-se por monstro e por frasco."');
    await say('* TABELA: Rato-de-Vela, 5 moedas. Cogumelo, 6 (com máscara). Lodo de Tinta, 8. Morcego de Papel, 4 (amassado não vale). Polvo, 120.\n* Mímico: 50 por tampa.\n* ÂMBAR: {y}200 moedas o frasco{/}.');
    await say('Duzentas por um frasco de âmbar. Cinquenta pela minha tampa.', 'me');
    await say('Ou seja, eu valho um quarto de frasco. Ótimo pra autoestima.', 'me');
    await say('* Num canto, um papel menor, escrito com capricho: "PROCURA-SE: meu cachorro, Biscoito. Sumiu no buraco do coreto." Tem um desenho de cachorro sorrindo.');
    await say('A cidade lá de cima está caindo aqui dentro. Pedaço por pedaço.', 'me');
    await say('E todo mundo veio buscar âmbar. Por que âmbar vale tanto?', 'me');
  },
  // Cap. 3: o que o âmbar é
  async loreOrdens() {
    const seen = G.flags.lore_ambar; G.flags.lore_ambar = true;
    if (seen) { await say('* "COTA DA SEMANA: 60 FRASCOS." Embaixo, riscado a faca: "a gente também vira âmbar se morrer aqui?"'); return; }
    await say('* Um quadro de ordens do exército. Papel oficial, carimbo vermelho, letra de quem tem pressa.');
    await say('* "ORDEM DO DIA — Guarnição de Auren, Andar 3.\n* A cota desta semana é de 60 frascos de âmbar. Entregar no elevador do Patamar. Atrasos serão descontados do soldo."');
    await say('* "LEMBRETE: o âmbar NÃO é para beber. Soldado pego bebendo âmbar será rebaixado a carregador de jaula."');
    await say('* "Monstro vivo rende mais âmbar do que monstro abatido. Capturar sempre que possível."');
    await say('Rende mais... âmbar?', 'me');
    await say('[Nota do Catálogo: quando a masmorra termina de ler uma alma, sobra um resto doce e dourado.]', 'cat');
    await say('[Lá em cima chamam isso de âmbar. Acendem cidades inteiras com ele.]', 'cat');
    await say('...|', 'me');
    await say('As lanternas. O frasco que eu carrego pra cima e pra baixo. Tudo isso é...|', 'me');
    await say('[Lembrança de outra pessoa. Tem gosto de alguma coisa, não tem? Ninguém nunca sabe dizer do quê.]', 'cat');
    await say('Então essa guerra não é pra salvar a cidade.|| É mineração.', 'me');
    await say('* Embaixo do quadro, alguém riscou com a ponta de uma faca: "a gente também vira âmbar se morrer aqui?"');
  },
  // Cap. 5: o que cada lado quer
  async loreMesa() {
    const seen = G.flags.lore_descida; G.flags.lore_descida = true;
    if (seen) { await say('* O mapa da Grande Descida. O alfinete dourado continua espetado no fundo, num lugar sem nome: "CORAÇÃO".'); return; }
    await say('* Uma mesa de comando coberta por um mapa enorme da masmorra. Alfinetes azuis, vermelhos e um dourado.');
    await say('* No topo: "A GRANDE DESCIDA — ANO 2". Embaixo, um acordo com três assinaturas.');
    await say('* A primeira, com selo real:\n* "A Coroa de Auren financia a descida. Todo âmbar recolhido pertence ao Tesouro. O inverno está chegando, e os faróis da capital estão apagando um por um."');
    await say('* A segunda, com um carimbo de martelo:\n* "A Guilda fornece caçadores, redes, sal, prata e jaulas para cada tipo de monstro. Recebe por cabeça e fica com um décimo do âmbar."');
    await say('* A terceira é um rabisco de caneta azul, de quem nunca precisou assinar bonito:\n* "Jorge, motorista. Eu levo os invocados até o fundo. Em troca, quando a masmorra acabar, todo mundo do 31 volta pra casa."');
    await say('A Coroa quer luz. A Guilda quer dinheiro. O Seu Jorge quer levar a gente pra casa.', 'me');
    await say('* Um alfinete dourado está espetado bem no fundo do mapa, num lugar sem nome. Do lado, a lápis, outra letra:\n* "CORAÇÃO — âmbar suficiente para cem invernos."');
    await say('Cem invernos. Pra acender isso tudo, a masmorra precisa acabar. E tudo que tem dentro dela vira âmbar.', 'me');
    await say('O Seu Jorge leu essa parte?', 'me');
    await say('[O Catálogo não tem registro de que alguém tenha mostrado essa parte a ele.]', 'cat');
  }
});

// ---- monstros adestrados: quando lutam ao lado de humanos, eles obedecem a alguém ----
const HUMANS = new Set(['hunter', 'archer', 'vet', 'archerVet', 'soldier', 'cleric', 'farol', 'guarda', 'clericM', 'recruta', 'escudeiro', 'arcabuz', 'alquimista', 'veterano', 'fiscalP', 'brida', 'maren', 'maren5', 'jorge', 'knight']);
const TAME = {
  garg: ['Gárgula Adestrada', '* A Gárgula de Giz tem uma corrente no pescoço com o brasão azul de Auren. É um monstro adestrado pela guarnição. Ela olha para o soldado antes de cada passo.'],
  escr: ['Escriba Adestrado', '* O Escriba Sombrio tem uma argola de ferro no tornozelo, presa ao cinto do soldado. A Inquisição adestra escribas para copiar ordens.'],
  escrM: ['Escriba Adestrado', '* O Escriba Mestre usa uma coleira com um selo da Inquisição. Ele escreve só o que mandam.'],
  cao: ['Cão Adestrado', '* O Cão de Guerra obedece ao assobio do soldado. Foi treinado no canil de Auren, igual ao Farejador da Brida.'],
  hound: ['Farejador', '* O Farejador é da Brida. Treinado desde filhote. Ele só ataca quando ela manda.']
};
function tameGroup(en) {
  if (!en.some(e => HUMANS.has(e.id)) || !en.some(e => !HUMANS.has(e.id))) return '';
  const lines = [];
  for (const e of en) { const t = TAME[e.id]; if (!t || e.d.boss) continue; e.tame = true; if (e.id !== 'hound') e.name = t[0]; if (!lines.includes(t[1])) lines.push(t[1]); }
  return lines.join('\n');
}
// sem quem dá as ordens, o adestrado fica perdido por um turno
{ const _kd = killDead; killDead = async function () {
  const before = BT.en.some(e => e.alive && HUMANS.has(e.id));
  await _kd();
  if (!before || !BT.on) return;
  if (!BT.en.some(e => e.alive && e.hp > 0 && HUMANS.has(e.id))) for (const e of BT.en) if (e.alive && e.hp > 0 && e.tame) { const fem = e.id === 'garg'; e.skip = fem ? '* A % espera uma ordem que não vem. Ela perdeu o turno.' : '* O % espera uma ordem que não vem. Ele perdeu o turno.'; await bSay(`* Sem ninguém dando ordens, ${fem ? 'a' : 'o'} ${e.name} olha em volta, ${fem ? 'perdida' : 'perdido'}.`, { auto: 50 }); }
}; }
