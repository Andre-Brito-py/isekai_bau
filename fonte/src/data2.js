// ================= CAPÍTULO 2: HERÓI NÚMERO 30 =================
Object.assign(RUNES, {
  faisca: { name: 'Faísca', type: 'el', col: '#ffe066', pow: 9, desc: 'Raio. Ótimo contra metal e carapaças. Pode atordoar.' },
  corrente: { name: 'Corrente', type: 'form', col: '#f2ecdc', mult: 0.85, cost: 5, desc: 'Acerta um alvo e salta para os outros, perdendo força.' },
  selo: { name: 'Selo', type: 'mod', col: '#ff8fa8', cost: 3, desc: 'Marca o alvo: ele sofre dano extra por 3 turnos.' }
});
ITEMS.pastel = { name: 'Pastel Fantasma', hp: 80, desc: 'Cura 80 PV. Tem gosto de segunda-feira chuvosa. Saudade.' };
ITEMS.eter = { name: 'Éter de Lustre', mp: 25, desc: 'Recupera 25 PM. A Lume jura que não é cera derretida.' };
SPECIES.caixote.tier = 1;
Object.assign(SPECIES.ferro, { tier: 2, evoLv: 8, evos: ['fortaleza', 'espinho'] });
Object.assign(SPECIES.arcano, { tier: 2, evoLv: 8, evos: ['grimorio', 'estelar'] });
Object.assign(SPECIES, {
  fortaleza: { tier: 3, name: 'Cofre-Fortaleza', sp: 'mimicFort', grow: { mhp: 9, mmp: 2, atk: 2, def: 2, mag: 1 }, bonus: { mhp: 30, mmp: 2, atk: 3, def: 4, mag: 1 }, bite: 1.3, guard: 0.65, passive: 'counter', tag: 'Muralha', desc: ['Contra-ataca na defesa perfeita', 'Defesa enorme', 'Mordida +30%'] },
  espinho: { tier: 3, name: 'Baú Espinhoso', sp: 'mimicSpike', grow: { mhp: 7, mmp: 2, atk: 3, def: 2, mag: 1 }, bonus: { mhp: 20, mmp: 3, atk: 6, def: 3, mag: 2 }, bite: 1.45, guard: 0.75, passive: 'thorns', tag: 'Espinhos', desc: ['Devolve 30% do dano que sofre', 'Mordida +45%', 'Muito ataque'] },
  grimorio: { tier: 3, name: 'Grimório Vivo', sp: 'mimicBook', grow: { mhp: 5, mmp: 5, atk: 1, def: 1, mag: 3 }, bonus: { mhp: 26, mmp: 16, atk: 1, def: 4, mag: 5 }, discount: 1, passive: 'echo', tag: 'Eco Mágico', desc: ['30%: o feitiço repete de graça', 'Feitiços -1 PM', 'Muito PM e magia'] },
  estelar: { tier: 3, name: 'Relicário Estelar', sp: 'mimicStar', grow: { mhp: 6, mmp: 4, atk: 1, def: 2, mag: 3 }, bonus: { mhp: 30, mmp: 10, atk: 1, def: 5, mag: 7 }, discount: 1, passive: 'regen', tag: 'Estrelas', desc: ['Recupera 4 PM por turno', 'Feitiços -1 PM', 'Magia altíssima'] }
});
ENEMIES.boss.ai = 'golem';
Object.assign(ENEMIES, {
  crab: {
    name: 'Caranguejo-Balança', sp: 'crab', hp: 52, atk: 16, def: 10, xp: 20, weak: { faisca: 2, geada: 1.3, bite: 0.6, brasa: 0.8 }, drops: [['pao', .3]],
    flavor: ['* O Caranguejo-Balança equilibra dois pratinhos de bronze nas costas.', '* Ele está pesando você com os olhos.', '* Clac. Clac. Clac.'],
    moves: [{ t: '* O Caranguejo-Balança belisca com a pinça grande!', p: 1 }, { t: '* O Caranguejo te pesa na balança e não gosta do resultado. Pinçada dupla!', p: 0.6, hits: 2 }],
    check: 'Casca dura: mordidas rendem pouco. FAÍSCA atravessa a carapaça.'
  },
  lamp: {
    name: 'Lamparina Errante', sp: 'lamp', hp: 36, atk: 17, def: 3, xp: 20, evade: 0.2, weak: { geada: 2, brasa: 0.3, seiva: 1.2 }, drops: [['tinta', .3]],
    flavor: ['* A Lamparina Errante dança no ar como se ninguém estivesse olhando.', '* Ela cheira a pavio queimado e saudade.', '* A chama dela muda de cor quando você se aproxima.'],
    moves: [{ t: '* A Lamparina Errante cospe uma labareda!', p: 1 }, { t: '* A Lamparina gira e solta faíscas em espiral!', p: 1.2 }],
    check: 'Feita de fogo: BRASA quase não faz efeito. GEADA apaga.'
  },
  hunter: {
    name: 'Caçador Aprendiz', sp: 'hunter', hp: 64, atk: 22, def: 8, xp: 32, weak: { faisca: 1.4, seiva: 1.2 }, drops: [['pao', .35], ['vela', .15]],
    flavor: ['* O Caçador Aprendiz segura o pé de cabra como quem segura um diploma.', '* "Mímico vale cinquenta moedas", ele murmura.', '* A armadura dele ainda tem a etiqueta da loja.'],
    moves: [{ t: '* O Caçador golpeia com a espada!', p: 1 }, { t: '* O Caçador enfia o PÉ DE CABRA na sua tampa!', p: 1.3 }],
    check: 'Humano de armadura. FAÍSCA conduz bem pelo metal.'
  },
  archer: {
    name: 'Arqueira da Guilda', sp: 'archer', hp: 55, atk: 25, def: 5, xp: 32, evade: 0.15, weak: { brasa: 1.3, seiva: 1.2 }, drops: [['tinta', .3]],
    flavor: ['* A Arqueira da Guilda conta as flechas. Faltam três. Ela olha feio para você.', '* "Fica parado que dói menos", ela diz.', '* Tem uma pena de corvo presa no capuz dela.'],
    moves: [{ t: '* A Arqueira dispara duas flechas de uma vez!', p: 0.6, hits: 2 }, { t: '* A Arqueira mira com calma... e acerta.', p: 1.15 }],
    check: 'Ataca em dupla. Prepare-se para defender duas vezes.'
  },
  polvo: {
    name: 'Polvo de Toldo', sp: 'polvo', hp: 70, atk: 25, def: 7, xp: 38, weak: { brasa: 1.6, faisca: 1.6, geada: 0.8 }, drops: [['tinta', .3], ['pao', .2]],
    flavor: ['* O Polvo de Toldo usa um pedaço de barraca como chapéu. Ele se acha elegante.', '* Pinga água de todos os tentáculos ao mesmo tempo.', '* Ele está assobiando. Polvos não deveriam assobiar.'],
    moves: [{ t: '* O Polvo de Toldo dá dois tapas de tentáculo!', p: 0.6, hits: 2 }, { t: '* O Polvo espirra tinta na sua cara!', p: 0.9, ink: true }],
    check: 'Encharcado: BRASA e FAÍSCA funcionam muito bem. A tinta dele acelera sua mordida.'
  },
  lampBig: {
    name: 'Lamparina Grande', sp: 'lampBig', hp: 52, atk: 25, def: 4, xp: 36, evade: 0.2, weak: { geada: 2, brasa: 0.3, seiva: 1.2 }, drops: [['eter', .15], ['tinta', .3]],
    flavor: ['* A Lamparina Grande ilumina a plateia vazia. Alguém precisava fazer isso.', '* Ela crepita como aplauso.'],
    moves: [{ t: '* A Lamparina Grande solta uma onda de calor!', p: 1 }, { t: '* Chuva de brasas da Lamparina Grande!', p: 0.55, hits: 2 }],
    check: 'Feita de fogo. GEADA apaga. BRASA não faz nem cócegas.'
  },
  vet: {
    name: 'Caçador Veterano', sp: 'vet', hp: 100, atk: 40, def: 12, xp: 50, weak: { faisca: 1.5 }, drops: [['vela', .3], ['pastel', .08]],
    flavor: ['* O Caçador Veterano já abriu mais baús do que você já viu.', '* Ele tem uma cicatriz em forma de dente na mão. Mordida de mímico.', '* "Você não é o primeiro", ele diz. "Mas pode ser o último."'],
    moves: [{ t: '* O Veterano desce a espada com as duas mãos!', p: 1.15 }, { t: '* Chute de bota e golpe de escudo!', p: 0.6, hits: 2 }],
    check: 'Armadura pesada. FAÍSCA é o melhor caminho.'
  },
  archerVet: {
    name: 'Arqueira Veterana', sp: 'archerVet', hp: 80, atk: 40, def: 8, xp: 50, evade: 0.2, weak: { brasa: 1.4, seiva: 1.2 }, drops: [['eter', .2]],
    flavor: ['* A Arqueira Veterana nem pisca. Literalmente. Você contou.', '* O vento da ponte não mexe nenhum fio do cabelo dela.'],
    moves: [{ t: '* Três flechas, quase ao mesmo tempo!', p: 0.45, hits: 3 }, { t: '* A Arqueira Veterana acerta um tiro certeiro.', p: 1.1 }],
    check: 'Três ataques seguidos. Defender bem faz toda a diferença.'
  },
  octo: {
    name: 'Polvo do Camarote', sp: 'octo', hp: 380, atk: 32, def: 8, xp: 140, boss: true, ai: 'octo', sc: 6, weak: { brasa: 1.5, faisca: 1.5, geada: 0.7 },
    flavor: ['* O Polvo do Camarote se agarra ao lustre lá em cima.', '* Oito tentáculos. Dois seguram binóculos de teatro.', '* Ele aplaude a si mesmo. Com seis mãos.'],
    flavor2: ['* O Polvo do Camarote está vermelho de raiva. Mais vermelho.', '* Tinta escorre pelo palco inteiro.'],
    check: 'Vários tentáculos por turno. A tinta acelera sua mordida. BRASA e FAÍSCA ajudam.'
  },
  brida: {
    name: 'Capitã Brida', sp: 'brida', hp: 430, atk: 42, def: 14, xp: 260, boss: true, ai: 'brida', sc: 5, weak: { faisca: 1.3, seiva: 1.2 },
    flavor: ['* A Capitã Brida ajusta o escudo sem tirar os olhos de você.', '* "Cinquenta moedas por tampa", ela repete, como uma oração.', '* O penacho vermelho dela não balança. Nem com o vento.'],
    flavor2: ['* A armadura da Brida está amassada. O orgulho dela também.', '* Ela respira fundo. Está cansada, mas não vai admitir.'],
    check: 'Comandante experiente. Derrube o FAREJADOR primeiro: ele marca você para ela.'
  },
  hound: {
    name: 'Farejador', sp: 'hound', hp: 110, atk: 33, def: 8, xp: 90, ai: 'hound', weak: { brasa: 1.4, geada: 1.2 },
    flavor: ['* O Farejador fareja sua tampa e espirra.'],
    check: 'Ele MARCA você, e o próximo golpe da Brida fica muito mais forte.'
  }
});
MAPS.antessala.exits.push({ x: 7, y: 1, to: 'patamar', tx: 6, ty: 6, cond: 'ch1done' }, { x: 8, y: 1, to: 'patamar', tx: 7, ty: 6, cond: 'ch1done' });
const THEME_MERCADO = { floor: '#2a2f38', speck: '#323845', dark: '#20242c', wall: '#34404e', mortar: '#1c232e', wallHi: '#4a5a6e' };
Object.assign(MAPS, {
  patamar: {
    name: 'Patamar do Andar 2', music: 'despertar', dark: 0.35, theme: THEME_MERCADO, battleBg: '#1a2a33',
    rows: [
      "##############", "####NN########", "##..........##", "#..K.....c...#", "#............#", "#.....^^.....#", "#............#", "#..c......K..#", "##..........##", "######..######", "######..######"],
    exits: [{ x: 6, y: 5, to: 'antessala', tx: 7, ty: 2 }, { x: 7, y: 5, to: 'antessala', tx: 8, ty: 2 }, { x: 6, y: 10, to: 'mercado', tx: 12, ty: 1 }, { x: 7, y: 10, to: 'mercado', tx: 13, ty: 1 }],
    ents: [{ id: 'save_pt', kind: 'save', x: 11, y: 4 }]
  },
  mercado: {
    name: 'Mercado Afundado', music: 'mercado', dark: 0.35, theme: THEME_MERCADO, battleBg: '#1a2a33',
    rows: [
      "############..##############", "#TTT.TTT###....###TTT.TTT###", "#.......K..........K.......#", "#..c....................c..#", "#....K......,.......K......#", "#...........................", "#....,.......K..............", "#.........c..........c.....#", "#~~~~~ww~~~~~~~~~~~~~ww~~~~#", "#~~~~~ww~~~~~~~~~~~~~ww~~~~#", "#..........K...............#", "#..TTT.........,....TTT....#", "#..........................#", "#.....c.........K.....c....#", "#..........,...............#", "...........................#", "......K....................#", "#..........~~~~~~..........#", "#..TTT.....~~~~~~.....TTT..#", "#..........................#", "#############..#############", "#############..#############"],
    exits: [{ x: 12, y: 0, to: 'patamar', tx: 6, ty: 9 }, { x: 13, y: 0, to: 'patamar', tx: 7, ty: 9 },
      { x: 0, y: 15, to: 'acampamento', tx: 28, ty: 8 }, { x: 0, y: 16, to: 'acampamento', tx: 28, ty: 9 },
      { x: 27, y: 5, to: 'teatro', tx: 1, ty: 9 }, { x: 27, y: 6, to: 'teatro', tx: 1, ty: 10 },
      { x: 13, y: 21, to: 'ponte', tx: 7, ty: 1 }, { x: 14, y: 21, to: 'ponte', tx: 8, ty: 1 }],
    ents: [
      { id: 'save_m', kind: 'save', x: 14, y: 12 },
      { id: 'r_faisca', kind: 'rune', x: 13, y: 3, rune: 'faisca' },
      { id: 'c_m1', kind: 'chest', x: 1, y: 2, item: 'pao', n: 2 }, { id: 'c_m2', kind: 'chest', x: 26, y: 19, item: 'vela', n: 1 }, { id: 'c_m3', kind: 'chest', x: 2, y: 19, item: 'tinta', n: 2 },
      { id: 'd_teatro1', kind: 'door', x: 27, y: 5, cond: 'teatroKey', msg: 'teatro' }, { id: 'd_teatro2', kind: 'door', x: 27, y: 6, cond: 'teatroKey', msg: 'teatro' },
      { id: 'd_ponte1', kind: 'door', x: 13, y: 20, cond: 'lumeJoined', msg: 'ponte', dark: true }, { id: 'd_ponte2', kind: 'door', x: 14, y: 20, cond: 'lumeJoined', msg: 'ponte', dark: true },
      { id: 'e_m1', kind: 'enemy', x: 6, y: 5, group: ['crab'] }, { id: 'e_m2', kind: 'enemy', x: 21, y: 3, group: ['lamp'] },
      { id: 'e_m3', kind: 'enemy', x: 8, y: 13, group: ['crab'] }, { id: 'e_m4', kind: 'enemy', x: 18, y: 14, group: ['lamp'] },
      { id: 'e_m5', kind: 'enemy', x: 13, y: 5, group: ['crab', 'lamp'] }, { id: 'e_m6', kind: 'enemy', x: 24, y: 16, group: ['crab'] }]
  },
  acampamento: {
    name: 'Acampamento da Guilda', music: 'acampamento', dark: 0.3, battleBg: '#2a2216',
    theme: { floor: '#3a3024', speck: '#463a2c', dark: '#2c241a', wall: '#4a3c2a', mortar: '#2a2116', wallHi: '#64523a' },
    rows: [
      "##############################", "#KK.....TTT.....#####TTT....##", "#..........................K.#", "#..T......K.......c.........##", "#..T.........................#", "#..............K.............#", "#....TT.....................K#", "#....TT..c.......TT..........#", "#................TT...........", "#.............................", "#..K.........K...............#", "#.......TTT..........c.......#", "#.......TTT..................#", "#..c.........................#", "#........K..........TTT....K.#", "#....................TTT.....#", "#KK.......................KK.#", "##############################"],
    exits: [{ x: 29, y: 8, to: 'mercado', tx: 1, ty: 15 }, { x: 29, y: 9, to: 'mercado', tx: 1, ty: 16 }],
    ents: [
      { id: 'save_a', kind: 'save', x: 27, y: 11 },
      { id: 'r_corrente', kind: 'rune', x: 2, y: 2, rune: 'corrente' },
      { id: 'kc', kind: 'keychest', x: 1, y: 12 },
      { id: 'c_a1', kind: 'chest', x: 26, y: 2, item: 'frag', n: 1 },
      { id: 'p_a1', kind: 'patrol', x: 23, y: 2, path: [[23, 2], [23, 14]], delay: 26, range: 3, group: ['hunter'], sp: 'hunter' },
      { id: 'p_a2', kind: 'patrol', x: 14, y: 4, path: [[14, 4], [14, 13]], delay: 18, range: 4, group: ['archer'], sp: 'archer' },
      { id: 'p_a3', kind: 'patrol', x: 6, y: 9, turn: ['left', 'down', 'right', 'up'], delay: 70, range: 4, group: ['hunter'], sp: 'hunter' },
      { id: 'p_a4', kind: 'patrol', x: 5, y: 2, path: [[5, 2], [20, 2]], delay: 14, range: 4, group: ['hunter', 'archer'], sp: 'archer' }]
  },
  teatro: {
    name: 'Teatro Submerso', music: 'teatro', dark: 0.45, battleBg: '#2a1420',
    theme: { floor: '#2c1c22', speck: '#36222a', dark: '#22151a', wall: '#3e2430', mortar: '#22121a', wallHi: '#5a3444' },
    rows: [
      "########################", "#DDDDDDDDDDDDDDDDDDDDDD#", "#DDwwwwwwwwwwwwwwwwwwDD#", "#DDwwwwwwwwwwwwwwwwwwDD#", "#..wwwwwwwwwwwwwwwwww..#", "#......................#", "#.PPPPPPPP....PPPPPPPP.#", "#......................#", "#.PPPPPPPP....PPPPPPPP.#", ".......................#", ".......................#", "#.PPPPPPPP....PPPPPPPP.#", "#......................#", "#.PPPPPPPP....PPPPPPPP.#", "#..c..................c#", "#######....######....###", "#######....######....###", "#######.K..######.~~.###", "#######....######....###", "########################"],
    exits: [{ x: 0, y: 9, to: 'mercado', tx: 26, ty: 5 }, { x: 0, y: 10, to: 'mercado', tx: 26, ty: 6 }],
    ents: [
      { id: 'save_t', kind: 'save', x: 2, y: 10 },
      { id: 'r_selo', kind: 'rune', x: 9, y: 17, rune: 'selo' },
      { id: 'c_t1', kind: 'chest', x: 20, y: 18, item: 'vela', n: 2 }, { id: 'c_t2', kind: 'chest', x: 19, y: 16, item: 'frag', n: 1 },
      { id: 'lume', kind: 'lume', x: 11, y: 2 },
      { id: 'e_t1', kind: 'enemy', x: 5, y: 7, group: ['polvo'] }, { id: 'e_t2', kind: 'enemy', x: 17, y: 7, group: ['lampBig'] },
      { id: 'e_t3', kind: 'enemy', x: 16, y: 12, group: ['polvo'] }, { id: 'e_t4', kind: 'enemy', x: 6, y: 12, group: ['polvo', 'lampBig'] },
      { id: 'e_t5', kind: 'enemy', x: 11, y: 14, group: ['lampBig'] }]
  },
  ponte: {
    name: 'Ponte do Sino', music: 'ponte', dark: 0.88, battleBg: '#141a2a',
    theme: { floor: '#2a2630', speck: '#322d3a', dark: '#201c26', wall: '#2e2a38', mortar: '#1a1622', wallHi: '#44405a' },
    rows: [
      "#######..#######", "#######ww#######", "      wwww      ", "      wwww      ", "    wwwwwwww    ", "    ww    ww    ", "    ww    ww    ", "    ww    ww    ", "    wwwwwwww    ", "      wwww      ", "      wwww      ", "  wwwwwwwwwwww  ", "  ww        ww  ", "  ww        ww  ", "  wwwwwwwwwwww  ", "      wwww      ", "      wwww      ", "  #####..#####  ", "  #..........#  ", "  #..c....c..#  ", "  #..........#  ", "  #....HH....#  ", "  #..........#  ", "  ############  "],
    exits: [{ x: 7, y: 0, to: 'mercado', tx: 13, ty: 19 }, { x: 8, y: 0, to: 'mercado', tx: 14, ty: 19 }],
    ents: [
      { id: 'save_p2', kind: 'save', x: 9, y: 15 },
      { id: 'e_n1', kind: 'enemy', x: 4, y: 6, group: ['archerVet'] }, { id: 'e_n2', kind: 'enemy', x: 11, y: 6, group: ['vet'] },
      { id: 'e_n3', kind: 'enemy', x: 7, y: 11, group: ['vet', 'archerVet'] }, { id: 'e_n4', kind: 'enemy', x: 3, y: 13, group: ['archerVet', 'archerVet'] },
      { id: 'brida', kind: 'brida', x: 7, y: 20 }]
  }
});
Object.assign(LOOK, {
  T: ['* Uma barraca do mercado antigo. Ainda tem frutas de cera expostas.', '* Uma barraca de lona listrada. Alguém escreveu "FIADO SÓ AMANHÃ" na madeira.', '* Uma tenda da Guilda. Dá pra ouvir alguém roncando lá dentro.'],
  K: ['* Um caixote de madeira. Primo distante. Vocês não se falam.', '* Caixotes empilhados. "MANUSEAR COM CUIDADO: ARMADILHAS PARA MÍMICO."', '* Um caixote cheio de pés de cabra. Que medo.'],
  N: ['* PROCURA-SE: MÍMICOS. Recompensa: 50 moedas por tampa. — Capitã Brida, Guilda de Auren.\n* Embaixo, com outra letra: "e se a gente conversasse com eles antes?" Alguém riscou.'],
  P: ['* Cadeiras de veludo, molhadas há uns cem anos.', '* Fileira C, poltrona 12. Alguém deixou um ingresso: "Ópera das Profundezas — ESTREIA".'],
  D: ['* Uma cortina pesada de veludo vermelho. Cheira a mofo e a aplausos antigos.'],
  H: ['* O Sino do Andar 2. Dizem que ele toca sozinho quando alguém sobe para o Andar 3.']
});
WHO.lume = { name: () => 'Lume', portrait: () => (PORT.lume ? PORT.lume[0] : SP.lume[0]), voice: () => sfx('blipTri', 1250) };
WHO.brida = { name: () => 'Capitã Brida', portrait: () => SP.brida[0], voice: () => sfx('blip', 300) };
WHO.tiago = { name: () => G.flags.knowTiago ? 'Tiago' : 'Herói', portrait: () => SP.hunter[0], voice: () => sfx('blip', 720) };
WHO.octo = { name: () => 'Polvo do Camarote', portrait: () => SP.octo[0], voice: () => sfx('blipLow', 140), col: '#ffb0b0' };
WHO.guard = { name: () => 'Caçador', portrait: () => SP.hunter[0], voice: () => sfx('blip', 380) };

Object.assign(STORY, {
  async patamarFirst() {
    await wait(20);
    sfx('catalog');
    await say('[Novo andar registrado: {y}ANDAR 2 — MERCADO AFUNDADO{/}.]', 'cat');
    await say('[Presença humana: ALTA. Recomendação do Catálogo: pareça uma mobília.]', 'cat');
    await say('* Um Morcego de Papel desce pela escada e pousa na sua tampa. Outro bilhete.');
    await say('* "Humanos abrem baús. Você é um baú. Faça as contas. — O."');
    await say('Valeu, Ofélia. Muito reconfortante, como sempre.', 'me');
    await say('Tem um quadro de avisos ali na parede. Deve ter alguma coisa útil.', 'me');
  },
  async mercadoFirst() {
    await wait(20);
    await say('Um mercado inteiro afundado... com barracas, pontes e tudo.', 'me');
    await say('E monstros novos. Melhor {y}AVALIAR{/} antes de sair mordendo. Essas carapaças parecem duras.', 'me');
  },
  async acampFirst() {
    await wait(20);
    await say('* Tendas, fogueiras e caixotes de pés de cabra. É o acampamento dos caçadores de baú.');
    await say('Patrulhas pra todo lado. Se me virem, viro moeda.', 'me');
    sfx('catalog');
    await say('[Habilidade lembrada: {y}IMITAR MOBÍLIA{/}.]', 'cat');
    await say('[Aperte {y}B{/} para virar um baú comum. Parado, nenhum humano desconfia. Andar desfaz o disfarce.]', 'cat');
    await say('[A área clara na frente de cada caçador é o que ele enxerga.]', 'cat');
    await say('Eu literalmente nasci pra isso.', 'me');
    G.flags.canDisguise = true;
  },
  async keyChest(e) {
    if (G.flags.teatroKey) { await say('* O baú da Guilda está vazio. Você já pegou a chave.'); return; }
    await say('* Um baú da Guilda, com cadeado. O cadeado é de mentira.');
    G.flags.teatroKey = true; sfx('item');
    await say('* Dentro tinha: {y}Chave do Teatro{/}. E um caderno.');
    await say('* "Diário da Capitã Brida. O Herói insiste em AVALIAR cada monstro antes de atacar. Diz que no mundo dele todo mundo merece uma chance. Tolice."');
    await say('* "Ontem ele parou de lutar só porque um mímico assobiou uma música. Disse que conhecia a música."');
    await say('Herói esquisito. Talvez esquisito do jeito bom.', 'me');
    await say('O Teatro fica a leste do Mercado. Agora a porta abre.', 'me');
  },
  async teatroFirst() {
    await wait(30);
    await say('* Uma voz ecoa pelo teatro vazio, cantarolando.');
    await say('...Essa música.', 'me');
    await say('Alguém cantarolava exatamente isso no fundo do ônibus 31.', 'me');
  },
  async octo() {
    if (G.flags.octoDone) return;
    if (!G.flags.octoSeen) {
      G.flags.octoSeen = true;
      await say('Socorro! Alguém?! Tem alguém aí embaixo?!', 'lume');
      await say('* Lá no alto, presa por tentáculos, balança uma luminária com rosto.');
      await say('Ah. Um baú. Ótimo. Exatamente o resgate que eu pedi.', 'lume');
      await say('Ei! Eu posso morder coisas!', 'me');
      await say('...O baú respondeu. Tá, retiro o que eu disse. MORDE ESSE POLVO!', 'lume');
      shake(30); sfx('rumble');
      await say('SILÊNCIO NA PLATEIA! O ESPETÁCULO... VAI... COMEÇAR!', 'octo');
    } else await say('O ESPETÁCULO CONTINUA!', 'octo');
    const r = await battle(['octo'], { boss: true, music: 'boss', noFlee: true, intro: '* O Polvo do Camarote desce do teto!' });
    if (r !== 'win') return;
    G.flags.octoDone = true; refreshEnts();
    await say('* O Polvo do Camarote foge pela fossa da orquestra, ofendido.');
    await say('* A luminária cai no palco, rola duas vezes e se levanta. Ela flutua.');
    await say('Ufa. Obrigada, baú falante. Eu sou a {y}Lume{/}. Alma número doze.', 'lume');
    await say('Doze?! Você também estava no ônibus?', 'me');
    await say('Lá no fundo, com o violão. Eu cantarolava pra não dormir. Aí veio aquele clarão e eu acordei... pendurada no teto. Como um LUSTRE.', 'lume');
    await say('Eu era quem pegava o 31 todo dia com um pastel na mão.', 'me');
    await say('O do pastel! Você sempre deixava cair farelo no corredor.', 'lume');
    await say('...Isso é tudo que as pessoas lembram de mim?', 'me');
    await say('Olha, eu odeio escuro. E você parece saber pra onde vai. Posso ir junto?', 'lume');
    await say('Eu faço luz, eu canto e eu sou ótima companhia. Duas dessas coisas são verdade.', 'lume');
    G.flags.lumeJoined = true; sfx('save'); J.level();
    sfx('catalog');
    await say('[{y}Lume{/} entrou para o grupo.]', 'cat');
    await say('[Na batalha, Lume canta a cada 3 turnos: cura, fortalece ou atordoa.]', 'cat');
    await say('[A escadaria escura ao sul do Mercado agora pode ser atravessada.]', 'cat');
  },
  async ponteFirst() {
    await wait(20);
    await say('Nossa. Uma ponte em cima do NADA. Ainda bem que eu brilho.', 'lume');
    await say('Lá no fundo tem um sino. E alguém parado do lado dele.', 'me');
  },
  async doorMsg(e) {
    if (e.msg === 'teatro') { await say('* A porta do Teatro Submerso. Trancada.\n* Um cartaz: "Fechado por ordem da Guilda. Chave no acampamento."'); }
    else { await say('* Uma escadaria desce para a escuridão total. Você não enxerga nem a própria tampa.'); await say('Sem luz não dá. Eu ia acabar caindo de tampa no abismo.', 'me'); }
  },
  async spotted(e) {
    const lines = ['Ei! Esse baú tem DENTES!', 'Mímico! Cinquenta moedas!', 'Eu SABIA que esse baú tinha olhado pra mim!'];
    await say(pickOne(lines), 'guard');
  },
  async brida() {
    if (G.flags.bridaDone) return;
    if (!G.flags.bridaSeen) {
      G.flags.bridaSeen = true;
      await say('Então você é o mímico que está zombando da minha Guilda.', 'brida');
      await say('Derrubou meus aprendizes. Roubou minha chave. Soltou a luminária do teatro.', 'brida');
      await say('Eu não sou luminária. Sou um LUSTRE.', 'lume');
      await say('Capitã Brida, da Guilda de Auren. Cinquenta moedas por tampa. Hoje eu levo a sua.', 'brida');
      await say('* O Farejador rosna e fareja o ar na sua direção.');
    } else await say('De novo? Teimoso. Gosto de presa teimosa.', 'brida');
    const r = await battle(['hound', 'brida'], { boss: true, music: 'boss2', noFlee: true, intro: '* A Capitã Brida e o Farejador bloqueiam a ponte!' });
    if (r !== 'win') return;
    G.flags.bridaDone = true; refreshEnts();
    await STORY.heroScene();
  },
  async heroScene() {
    await say('* Brida cai de joelhos, apoiada no escudo.');
    await say('...Impossível. Um baú. Derrotada por um BAÚ.', 'brida');
    await say('* Passos rápidos na ponte.');
    await say('Brida, para! PARA!', 'tiago');
    await say('Herói? Esse mímico derrubou meu Farejador!', 'brida');
    await say('Eu sei. Eu vi. E eu {y}avaliei{/} ele.', 'tiago');
    sfx('catalog');
    await say(`[AVALIAÇÃO DO HERÓI: ${spec().name}. Nome: {y}${G.name}{/}. Alma nº 31.]`, 'cat');
    await say(`...${G.name}? ${G.name} do pastel?`, 'tiago');
    await say('Você pegava o 31 todo dia. Sempre atrasado. Sempre com um pastel na mão.', 'tiago');
    G.flags.knowTiago = true;
    await say('Eu era o cobrador. O Tiago. Lembra?', 'tiago');
    await say('O COBRADOR?! Ele virou o HERÓI e eu virei um BAÚ? Isso é uma injustiça cósmica.', 'me');
    await say('* O Tiago dá um pulo para trás.');
    await say('Ele... FALOU. O baú falou. Com a voz de gente.', 'tiago');
    await say('Mímicos imitam vozes, Herói. É assim que atraem os caçadores. Não caia nessa.', 'brida');
    await say('Mímico nenhum imita o jeito de quem reclama de injustiça cósmica às sete da manhã, Brida. É ele.', 'tiago');
    await say('Herói, o senhor enlouqueceu.', 'brida');
    await say('Brida, recolhe o pessoal. Ninguém abre esse baú. Ordem do Herói.', 'tiago');
    await say('Escuta. Tem mais gente do ônibus por aí. Uns viraram monstro. Outros viraram herói.', 'tiago');
    await say('E tem alguém lá em cima, no Andar 3, juntando os heróis pra uma guerra contra a masmorra inteira.', 'tiago');
    await say('Fica longe do Andar 3. Lá em cima ninguém pergunta o nome antes de atacar.', 'tiago');
    await say('Que bonito. Ninguém perguntou o MEU nome, né.', 'lume');
    await say('...Desculpa. Como você se chama?', 'tiago');
    await say('Lume! Alma doze! Eu cantava no fundo do ônibus!', 'lume');
    await say('A moça do violão... Então foi você que eu ouvi cantando no teatro.', 'tiago');
    await say('* Tiago ajuda Brida a se levantar. Os dois somem pela escada do sino.');
    await wait(30);
    sfx('catalog');
    await say('[Alerta: o Catálogo foi lido por um ser humano.]', 'cat');
    await say('[Isso não deveria ser possível.]', 'cat');
    await say('...Espera. O Catálogo ficou NERVOSO?', 'me');
    await say('Baú, eu acho que a voz da masmorra acabou de suar frio.', 'lume');
    await endScreen(2);
    G.flags.ch2done = true;
    saveGame(true);
  },
  async evolve2() {
    sfx('catalog');
    await say('[Condições de evolução atingidas.]', 'cat');
    await say(`[Espécie atual: {y}${spec().name.toUpperCase()}{/}, nível ${G.lv}. Formas de 3º grau disponíveis: 2.]`, 'cat');
    if (G.flags.lumeJoined) await say('Ooooh, vai trocar de forma? Posso assistir? Vou fazer uma luz dramática.', 'lume');
    const pick = await evolveScreen();
    await say(`[Evolução concluída: {y}${SPECIES[pick].name.toUpperCase()}{/}.]`, 'cat');
    await say('[Nível de espécie reiniciado: 1. Atributos preservados.]', 'cat');
    const L = { fortaleza: 'Eu sou praticamente um cofre de banco agora. Que venham os pés de cabra.', espinho: 'Espinhos! Quem me abrir vai se arrepender. Literalmente.', grimorio: 'Tem páginas saindo da minha tampa. Eu virei um LIVRO. A Ofélia vai pirar.', estelar: 'Tem estrelas dentro de mim. Tipo, de verdade. Eu tô brilhando mais que a Lume.' };
    await say(L[pick], 'me');
    if (G.flags.lumeJoined && pick === 'estelar') await say('Ninguém brilha mais que a Lume.', 'lume');
  }
});
