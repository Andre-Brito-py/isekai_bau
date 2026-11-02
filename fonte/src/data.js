// ================= DADOS DO JOGO =================
const RUNES = {
  brasa: { name: 'Brasa', type: 'el', col: '#f07830', pow: 10, desc: 'Fogo. Queima papel e musgo.' },
  geada: { name: 'Geada', type: 'el', col: '#7ad0f0', pow: 8, desc: 'Gelo. Pode congelar o alvo.' },
  seiva: { name: 'Seiva', type: 'el', col: '#8ac85a', pow: 7, desc: 'Vida. Rouba vida do alvo ou cura você.' },
  dardo: { name: 'Dardo', type: 'form', col: '#f2ecdc', mult: 1, cost: 3, desc: 'Atinge um inimigo. Barato.' },
  onda: { name: 'Onda', type: 'form', col: '#f2ecdc', mult: 0.6, cost: 5, desc: 'Atinge todos os inimigos, mais fraco.' },
  veu: { name: 'Véu', type: 'form', col: '#f2ecdc', cost: 4, desc: 'Envolve você. Fortalece, protege ou cura.' },
  eco: { name: 'Eco', type: 'mod', col: '#c0a0f0', cost: 3, desc: 'O feitiço se repete com 60% da força.' },
  foco: { name: 'Foco', type: 'mod', col: '#f0c040', cost: 3, desc: '+60% de poder. Mais caro.' }
};
const TYPE_LABEL = { el: 'Elemento', form: 'Forma', mod: 'Modificador' };

const ITEMS = {
  pao: { name: 'Pão Mofado', hp: 20, desc: 'Cura 20 PV. Tem cheiro de terça-feira passada.' },
  vela: { name: 'Vela Doce', hp: 45, desc: 'Cura 45 PV. Mímicos acham cera deliciosa.' },
  tinta: { name: 'Tinta Azul', mp: 10, desc: 'Recupera 10 PM. Não pergunte como você digere isso.' }
};

const SPECIES = {
  caixote: { name: 'Mímico-Caixote', sp: 'mimic', grow: { mhp: 5, mmp: 2, atk: 1, def: 1, mag: 1 }, evoLv: 5, evos: ['ferro', 'arcano'] },
  ferro: {
    name: 'Baú de Ferro', sp: 'mimicIron', grow: { mhp: 7, mmp: 2, atk: 2, def: 2, mag: 1 }, bonus: { mhp: 20, mmp: 2, atk: 4, def: 4, mag: 1 },
    bite: 1.25, guard: 0.75, tag: 'Tanque', desc: ['Mordida Férrea: +25% dano', 'Defesa muito melhor', 'Muito PV e ataque']
  },
  arcano: {
    name: 'Relicário Arcano', sp: 'mimicArc', grow: { mhp: 5, mmp: 4, atk: 1, def: 1, mag: 2 }, bonus: { mhp: 8, mmp: 12, atk: 1, def: 1, mag: 5 },
    discount: 1, tag: 'Magia', desc: ['Feitiços custam -1 PM', 'Ganha a runa FOCO', 'Muito PM e magia']
  }
};
const XP_NEED = [0, 10, 18, 28, 40, 55, 72, 90, 110, 132, 156, 182, 210];
function xpNeed(lv) { const base = XP_NEED[lv] || (210 + (lv - 12) * 30); const tier = (typeof spec === 'function' && spec().tier) || 1; return Math.round(base * [1, 1, 1.6, 2.5][tier]); }

const ENEMIES = {
  rat: {
    name: 'Rato-de-Vela', sp: 'rat', hp: 16, atk: 5, def: 1, xp: 8, weak: { geada: 2, brasa: 0.5 }, drops: [['vela', .15], ['pao', .2]],
    flavor: ['* O Rato-de-Vela protege a chama nas costas como se fosse um filho.', '* Cheira a cera e a queijo velho.', '* A chama dele treme quando você abre a tampa.'],
    moves: [{ t: '* O Rato-de-Vela avança com a vela acesa!', p: 1 }, { t: '* O Rato-de-Vela sacode o corpo. Respingos de cera quente!', p: 1.25 }],
    check: 'Fraco contra GEADA. A chama resiste a fogo.'
  },
  mush: {
    name: 'Cogumelo Tossidor', sp: 'mush', hp: 20, atk: 4, def: 1, xp: 9, weak: { brasa: 2, seiva: 0.5 }, drops: [['pao', .3]],
    flavor: ['* O Cogumelo Tossidor tosse. Uma nuvem de esporos dança no ar.', '* Ele parece resfriado há uns cem anos.', '* Cof. Cof. Cof.'],
    moves: [{ t: '* O Cogumelo tosse esporos na sua cara!', p: 1, mp: 1 }, { t: '* O Cogumelo cabeceia você com o chapéu!', p: 1.2 }],
    check: 'Fraco contra BRASA. Tosse esporos que roubam PM.'
  },
  bat: {
    name: 'Morcego de Papel', sp: 'bat', hp: 14, atk: 6, def: 0, xp: 13, evade: 0.25, weak: { brasa: 2, geada: 0.75 }, drops: [['tinta', .25]],
    flavor: ['* O Morcego de Papel farfalha como um livro aberto ao vento.', '* Tem uma frase escrita na asa: "capítulo três".', '* Ele dobra e desdobra as asas sem parar.'],
    moves: [{ t: '* O Morcego de Papel dá um corte de papel. Dói mais do que devia!', p: 1 }, { t: '* O Morcego mergulha em espiral!', p: 1.3 }],
    check: 'Muito fraco contra BRASA. Desvia de mordidas.'
  },
  slime: {
    name: 'Lodo de Tinta', sp: 'slime', hp: 30, atk: 6, def: 2, xp: 16, weak: { bite: 0.5, geada: 1.6, seiva: 1.3 }, drops: [['tinta', .4]],
    flavor: ['* O Lodo de Tinta borbulha. Dá pra ler umas palavras na superfície.', '* Ele engole tudo. Inclusive mordidas.', '* Plop.'],
    moves: [{ t: '* O Lodo de Tinta te cobre de tinta!', p: 1 }, { t: '* O Lodo se estica e te esmaga!', p: 1.35 }],
    check: 'Mordidas quase não funcionam. Use magia, de preferência GEADA.'
  },
  boss: {
    name: 'Guarda-Musgo', sp: 'boss', hp: 190, atk: 13, def: 3, xp: 80, boss: true, weak: { brasa: 2, geada: 0.6 },
    flavor: ['* O Guarda-Musgo observa você. O musgo nas costas respira.', '* Raízes estalam a cada movimento dele.', '* Os olhos dele brilham como lanternas antigas.'],
    flavor2: ['* A pedra nua do Guarda-Musgo está cheia de rachaduras.', '* A runa no peito dele pulsa, irritada.', '* Pedrinhas caem a cada passo.'],
    check: 'Musgo pega fogo. Mas o que tem por baixo do musgo?'
  }
};

// ---------- MAPAS ----------
const MAPS = {
  despertar: {
    name: 'Câmara do Despertar', music: 'despertar', dark: 0.4,
    rows: [
      "#######..#######",
      "#######..#######",
      "##x..,.....x.###",
      "#x.........r..##",
      "#..,...c.......#",
      "#.....,.....,..#",
      "#..x.......x...#",
      "#.....,........#",
      "##.r.....,..x.##",
      "###...x.......##",
      "######....######",
      "################"],
    exits: [{ x: 7, y: 0, to: 'galeria', tx: 11, ty: 18 }, { x: 8, y: 0, to: 'galeria', tx: 12, ty: 18 }],
    ents: [{ id: 'c_d1', kind: 'chest', x: 2, y: 7, item: 'pao', n: 2 }]
  },
  galeria: {
    name: 'Galeria Úmida', music: 'galeria', dark: 0.42,
    rows: [
      "###########..###########",
      "#########rrGGrr#########",
      "#####......,.......#####",
      "####..g.......~~~...####",
      "###.....,....~~~~~...###",
      "##..c........~~~~~....##",
      "##......r.....~~~..,..##",
      "#.....,...........g....#",
      "#..~~~.................#",
      "....~~~....,........c...",
      "....~~.......r..........",
      "#.......,..........,...#",
      "##..g.........~~.....###",
      "###.......r..~~~~....###",
      "####....,.....~~...,####",
      "#####...............####",
      "######..,...c.....######",
      "########..........######",
      "##########....##########",
      "###########..###########"],
    exits: [
      { x: 11, y: 19, to: 'despertar', tx: 7, ty: 1 }, { x: 12, y: 19, to: 'despertar', tx: 8, ty: 1 },
      { x: 0, y: 9, to: 'biblioteca', tx: 16, ty: 6 }, { x: 0, y: 10, to: 'biblioteca', tx: 16, ty: 7 },
      { x: 23, y: 9, to: 'poco', tx: 1, ty: 7 }, { x: 23, y: 10, to: 'poco', tx: 1, ty: 8 },
      { x: 11, y: 0, to: 'antessala', tx: 7, ty: 12 }, { x: 12, y: 0, to: 'antessala', tx: 8, ty: 12 }],
    ents: [
      { id: 'save_g', kind: 'save', x: 15, y: 16 },
      { id: 'c_g1', kind: 'chest', x: 21, y: 5, item: 'tinta', n: 1 },
      { id: 'e_g1', kind: 'enemy', x: 6, y: 4, group: ['rat'] },
      { id: 'e_g2', kind: 'enemy', x: 17, y: 7, group: ['mush'] },
      { id: 'e_g3', kind: 'enemy', x: 8, y: 12, group: ['rat'] },
      { id: 'e_g4', kind: 'enemy', x: 19, y: 12, group: ['mush'] },
      { id: 'e_g5', kind: 'enemy', x: 10, y: 7, group: ['rat', 'mush'] }]
  },
  biblioteca: {
    name: 'Sala de Leitura Afogada', music: 'biblioteca', dark: 0.35,
    theme: { floor: '#2e2630', speck: '#382e38', dark: '#231c25', wall: '#43303a', mortar: '#26191f', wallHi: '#5e4450' },
    rows: [
      "##################",
      "#BBBBBBB##BBBBBBB#",
      "#.........,......#",
      "#..c..........c..#",
      "#~~..BB....BB..,.#",
      "#~~~.BB....BB....#",
      "#~~..........,....",
      "#~...,............",
      "#~~..BB....BB....#",
      "#~~~.BB....BB.c..#",
      "#~~~~...........,#",
      "#~~~~~....c.....##",
      "##~~~~~~##########",
      "##################"],
    exits: [{ x: 17, y: 6, to: 'galeria', tx: 1, ty: 9 }, { x: 17, y: 7, to: 'galeria', tx: 1, ty: 10 }],
    ents: [
      { id: 'ofelia', kind: 'npc', sp: 'ofelia', x: 8, y: 2 },
      { id: 'r_seiva', kind: 'rune', x: 15, y: 10, rune: 'seiva' },
      { id: 'r_veu', kind: 'rune', x: 2, y: 7, rune: 'veu' }]
  },
  poco: {
    name: 'Poço das Runas', music: 'poco', dark: 0.46,
    theme: { floor: '#232a36', speck: '#2b3442', dark: '#1a2029', wall: '#2f3a4e', mortar: '#1a2130', wallHi: '#46546c' },
    rows: [
      "######################",
      "###.....###......#####",
      "##..g.......r.......##",
      "#.....,...~~~~...g...#",
      "#..r.....~~~~~~......#",
      "#.......~~~~~~~~..,..#",
      "#..,....~~~~~~~~.....#",
      "........~~~~~~~~.....#",
      ".....,...~~~~~~...c..#",
      "#.........~~~~.......#",
      "#..g..r..........,...#",
      "#......,.....r.......#",
      "##.....c.......g....##",
      "###..........,....####",
      "#####.............####",
      "######################"],
    exits: [{ x: 0, y: 7, to: 'galeria', tx: 22, ty: 9 }, { x: 0, y: 8, to: 'galeria', tx: 22, ty: 10 }],
    ents: [
      { id: 'r_geada', kind: 'rune', x: 5, y: 1, rune: 'geada' },
      { id: 'r_onda', kind: 'rune', x: 14, y: 1, rune: 'onda' },
      { id: 'r_eco', kind: 'rune', x: 18, y: 12, rune: 'eco' },
      { id: 'c_p1', kind: 'chest', x: 19, y: 2, item: 'pao', n: 2 },
      { id: 'c_p2', kind: 'chest', x: 2, y: 4, item: 'frag', n: 1 },
      { id: 'save_p', kind: 'save', x: 2, y: 6 },
      { id: 'e_p1', kind: 'enemy', x: 10, y: 2, group: ['bat'] },
      { id: 'e_p2', kind: 'enemy', x: 4, y: 10, group: ['slime'] },
      { id: 'e_p3', kind: 'enemy', x: 17, y: 4, group: ['bat'] },
      { id: 'e_p4', kind: 'enemy', x: 9, y: 12, group: ['bat', 'bat'] },
      { id: 'e_p5', kind: 'enemy', x: 17, y: 10, group: ['slime', 'bat'] }]
  },
  antessala: {
    name: 'Antessala do Musgo', music: null, dark: 0.45,
    theme: { floor: '#24302a', speck: '#2c3a32', dark: '#1b241f', wall: '#2e3d33', mortar: '#18211b', wallHi: '#43584a' },
    rows: [
      "################",
      "#######^^#######",
      "####,,....,,####",
      "###..g......g.##",
      "##.....,.......#",
      "#..c.........c.#",
      "#......,.......#",
      "#..............#",
      "#.r.....,....r.#",
      "##............##",
      "###....,.....###",
      "#####......#####",
      "######....######",
      "#######..#######"],
    exits: [{ x: 7, y: 13, to: 'galeria', tx: 11, ty: 2 }, { x: 8, y: 13, to: 'galeria', tx: 12, ty: 2 }],
    ents: [{ id: 'boss', kind: 'boss', x: 7, y: 3 }, { id: 'save_as', kind: 'save', x: 4, y: 10 }]
  }
};

// ---------- FALAS SOLTAS ----------
const LOOK = {
  x: ['* Um baú arrebentado. Marcas de machado e uma pegada de bota.', '* Outro baú quebrado. Vazio. Você sente um arrepio na tampa.', '* Um baú comum, desses que não falam. Bate uma solidão estranha.', '* Restos de um baú. Alguém levou até as dobradiças.'],
  c: ['* Uma vela que nunca termina de queimar. A masmorra gosta de luz ambiente.', '* A chama inclina na sua direção, curiosa.'],
  r: ['* Pedras soltas. Nada útil. Nem pra morder.', '* Um monte de cascalho. Tem gosto de terça-feira.'],
  '~': ['* Água escura e parada. Seu reflexo tem dentes demais.', '* A água está fria. Algo lá embaixo pisca de volta.'],
  B: ['* Uma estante cheia de livros inchados de umidade.', '* "Manual do Aventureiro, vol. 2: Como Identificar Mímicos." Você empurra o livro mais pro fundo.', '* "Taxonomia das Almas Caídas." As páginas estão coladas.', '* "Receitas com Cogumelo Tossidor." A página 4 tem uma mancha suspeita.', '* Um livro escrito numa língua que parece... português? Não. Quase.'],
  '^': ['* Uma escada que sobe para o Andar 2.']
};

// ---------- CENAS ----------
const STORY = {
  async intro() {
    G.black = 1; playMusic(null);
    await wait(30);
    for (const t of [
      'Minha última lembrança da Terra não tem nada de heroica.',
      'Uma segunda-feira. Chuva. O ônibus 31 parado no ponto, já lotado.',
      'Eu corri atrás dele. Pastel numa mão, guarda-chuva na outra.',
      'Consegui entrar. Lembro do motorista resmungando. Lembro de alguém cantarolando no fundo.',
      'E lembro de um clarão branco engolindo a pista inteira.',
      'Depois disso... silêncio.',
      '...',
      'E então, cheiro de madeira molhada.']) await say(t, 'void');
    sfx('catalog');
    await say('[CATÁLOGO DO ABISMO]', 'cat');
    await say('[Nova alma registrada. Número de registro: {y}31{/}.]', 'cat');
    await say('[Espécie atribuída: {y}MÍMICO-CAIXOTE{/}. Nível 1.]', 'cat');
    await say('[Para fins de arquivo, informe seu nome.]', 'cat');
    G.name = await nameInput();
    await say(`[Registro concluído: {y}${G.name}{/}.]`, 'cat');
    await say('[Boas-vindas à Masmorra de Velhágua.]', 'cat');
    await say('[Dica do Catálogo: tente não ser aberto.]', 'cat');
    V.fade = 1; loadMap('despertar', 7, 6, 'down');
    await fadeIn(60);
    await wait(30);
    await say('...Espera.', 'me');
    await say('Por que eu tô vendo o chão desse ângulo?', 'me');
    await say('* Você tenta olhar para as próprias mãos.|\n* Você não tem mãos.|\n* Você tem uma {y}tampa{/}.');
    await say('Eu sou... um BAÚ?', 'me');
    await say('Eu morri num acidente de ônibus e voltei como MOBÍLIA?', 'me');
    await say('Tá. Calma. Respira. Eu li mangá demais pra entrar em pânico agora.', 'me');
    await say('Isso é um isekai. E em isekai a gente começa fraco e termina absurdamente forte. É regra.', 'me');
    await say('...Eu acho.', 'me');
    await say('* (Use o direcional para andar, {y}A{/} para interagir e {y}MENU{/} para abrir o grimório.)');
    G.flags.introDone = true;
  },
  async galeriaFirst() {
    await wait(20);
    await say('Tem coisas se mexendo lá na frente. Coisas com... velas nas costas?', 'me');
    await say('Se encostar, aposto que vira briga. Clássico.', 'me');
  },
  async poçoFirst() {
    await wait(20);
    await say('O ar aqui tem gosto de... alfabeto?', 'me');
    await say('* Pedras cheias de símbolos flutuam sobre pedestais antigos.');
  },
  async gate() {
    if (G.species === 'caixote') {
      await say('* Um portão de raízes e musgo, grosso como braço de gente.');
      sfx('catalog');
      await say('[Passagem restrita a espécies de {y}2º grau{/}.]', 'cat');
      if (!G.flags.gateSeen) {
        G.flags.gateSeen = true;
        await say('Até a masmorra tem burocracia.', 'me');
        await say('Espécie de 2º grau... Se eu ficar mais forte, será que eu EVOLUO?', 'me');
      }
    }
  },
  async ofelia() {
    const f = G.flags;
    if (!f.metOfelia) {
      f.metOfelia = true;
      await say('Ora, ora. Um Mímico-Caixote. Faz tempo que não aparece um da sua estirpe por aqui.', 'of');
      await say('Um fantasma. De óculos.', 'me');
      await say('Bibliotecária, por favor. Ofélia, guardiã da Sala de Leitura Afogada. Os óculos são de leitura.', 'of');
      await say('E você é... deixa eu adivinhar. Alma estrangeira. Acordou num corpo que não pediu e está tentando não entrar em pânico.', 'of');
      await say('...Tá tão na cara assim?', 'me');
      await say('Você é a alma número {y}trinta e um{/}. Eu anoto todas.', 'of');
      await say('Todas caem nesta masmorra. Todas viram monstros. E quase todas viram... bem. Baús arrombados.', 'of');
      await say('Que reconfortante.', 'me');
      await say('Não sou paga para reconfortar. Não sou paga para nada, aliás. Estou morta.', 'of');
      await say('Mas posso te ensinar a sobreviver. Mímicos têm um talento raro: vocês {y}comem palavras{/}.', 'of');
      await say('Eu... como palavras?', 'me');
      await say('Runas. As palavras que o mundo entende. Humanos levam anos para aprender a lê-las. Um mímico só precisa mastigar.', 'of');
      await say('Tome. Duas runas do meu acervo pessoal. Devolva quando morrer.', 'of');
      await giveRune('brasa'); await giveRune('dardo');
      sfx('catalog');
      await say('[Runas absorvidas. {y}Grimório{/} desbloqueado.]', 'cat');
      await say('Runa de ELEMENTO diz o que o feitiço é. Runa de FORMA diz como ele sai. Junte as duas e dê um nome.', 'of');
      await say('Abra o {y}MENU{/}, entre no {y}Grimório{/} e crie seu primeiro feitiço. O nome importa. Feitiço sem nome é só barulho.', 'of');
      await say('Tem mais runas por aí. Duas nesta sala mesmo, se você tiver olhos. E você tem. Dois. Amarelos.', 'of');
      await say('E se um dia atravessar o Portão de Musgo... volte para me contar como é lá em cima.', 'of');
      await say('Você não pode sair daqui?', 'me');
      await say('Bibliotecárias não abandonam seus livros.| Além disso, a porta range.', 'of');
      return;
    }
    if (!G.spells.length) { await say('Ainda sem feitiços? {y}MENU{/}, depois {y}Grimório{/}. Não me faça repetir. Fantasmas cansam.', 'of'); return; }
    if (f.ch1done && !f.ofEnd) { f.ofEnd = true; await say('Então você venceu o Guarda-Musgo. Eu ouvi tudo daqui. As estantes tremeram.', 'of'); await say('Número trinta lá em cima, número trinta e um aqui embaixo... O ônibus de vocês estava bem cheio, hein.', 'of'); await say('Vá devagar. Heróis costumam abrir baús primeiro e perguntar depois.', 'of'); return; }
    if (G.species !== 'caixote' && !f.ofEvo) {
      f.ofEvo = true;
      if (G.species === 'ferro') { await say('Baú de Ferro. Prático. Robusto. Sem graça nenhuma.', 'of'); await say('Eu aprovo.', 'of'); }
      else { await say('Um Relicário Arcano! Os livros estão sussurrando de inveja.', 'of'); await say('Cuidado com essa tampa brilhante. Atrai ladrão.', 'of'); }
      await say('O Portão de Musgo deve reconhecer você agora. Fica no norte da Galeria.', 'of');
      return;
    }
    const tips = [
      'Rato-de-Vela: a chama nas costas é a alma dele. Fogo não adianta muito. Tente frio.',
      'Morcegos de papel queimam. Óbvio, não? É papel.',
      'O Lodo de Tinta engole mordidas. Use magia. Gelo, de preferência.',
      'As Lanternas de Âmbar guardam sua história e enchem seu frasco. Também acordam os monstros de novo. Tudo tem um preço.',
      'Um feitiço com {y}Eco{/} se repete. Um com {y}Véu{/} vira sobre você. Combine, experimente, erre. Eu anoto.',
      'Sabe o Catálogo? Aquela voz chata? Ninguém sabe quem escreve aquilo. Nem eu. E eu sei de tudo.',
      'O Guarda-Musgo existe para impedir que coisas de baixo subam. Se você é uma coisa de baixo... bem.'];
    f.tip = ((f.tip || 0) + 1) % tips.length;
    await say(tips[f.tip], 'of');
  },
  async evolve() {
    sfx('catalog');
    await say('[Condições de evolução atingidas.]', 'cat');
    await say(`[Espécie atual: {y}MÍMICO-CAIXOTE{/}, nível ${G.lv}. Formas disponíveis: 2.]`, 'cat');
    const pick = await evolveScreen();
    await say(`[Evolução concluída: {y}${SPECIES[pick].name.toUpperCase()}{/}.]`, 'cat');
    await say('[Nível de espécie reiniciado: 1. Atributos preservados.]', 'cat');
    if (pick === 'ferro') {
      await say('Eu sou de ferro agora. Literalmente. Isso é muito mais legal do que parece.', 'me');
    } else {
      await giveRune('foco', true);
      await say('Tem runas brilhando na minha tampa. Eu tô... reluzente. Isso é estranho e eu gostei.', 'me');
    }
    await say('[Aviso: passagem de 2º grau liberada.]', 'cat');
    G.flags.gateOpen = true;
    if (WD.id === 'galeria') { G.flags.gateAnim = true; sfx('gate'); shake(30); await say('* Ao norte, o Portão de Musgo range e se abre.'); }
  },
  async bossIntro() {
    if (G.flags.bossSeen) {
      await say('* O Guarda-Musgo se levanta outra vez, rangendo.');
    } else {
      G.flags.bossSeen = true;
      shake(40); sfx('rumble');
      await say('* O chão treme.');
      await say('* O musgo da parede se descola... e abre dois olhos.');
      await say('...ALMA... NÚMERO... TRINTA E UM.', 'boss');
      await say('O ANDAR DE CIMA... É PROIBIDO... PARA COISAS... DE BAIXO.', 'boss');
      await say('Olha, eu sou um baú com muita teimosia e pouca paciência.', 'me');
      await say('ENTÃO... SEJA... ARQUIVADO.', 'boss');
    }
    const r = await battle(['boss'], { boss: true, music: 'boss', noFlee: true });
    if (r !== 'win') return;
    await say('...ENTÃO... VOCÊ... VAI... SUBIR.', 'boss');
    await say('...CUIDADO... COM... O... HERÓI.', 'boss');
    sfx('rumble'); shake(50);
    await say('* O Guarda-Musgo se desfaz em pedra e terra.');
    G.flags.bossDone = true; refreshEnts();
    await wait(40);
    await say('* Uma escada surge na parede ao fundo.');
    await say('* Algo farfalha no alto. Um Morcego de Papel pousa na sua tampa.|\n* Ele carrega um bilhete.');
    await say('* "Parabéns. Guardei um lugar na estante para o seu diário. — O."');
    await say('Ela disse que não podia sair da biblioteca...', 'me');
    await say('Mas ninguém falou nada sobre o correio.', 'me');
    await wait(30);
    await say('* Vozes descem pela escada.');
    await say('...dizem que o primeiro andar tá cheio de baú. Baú é tesouro, e tesouro é XP, né não?', 'hero');
    await say('Herói, por favor. O senhor fala de um jeito tão estranho...', 'npc');
    await say('Foi mal, foi mal. Força do hábito. Lá no meu mundo todo mundo fala assim.', 'hero');
    sfx('catalog');
    await say('[Alerta: HERÓI INVOCADO detectado no Andar 2.]', 'cat');
    await say('[Registro de origem: alma número {y}30{/}.]', 'cat');
    await say('Número trinta...', 'me');
    await say('Ele também estava no ônibus.', 'me');
    await endScreen();
    G.flags.ch1done = true;
    saveGame(true);
  },
  async stairs() {
    if (!G.flags.bossDone) return;
    await say('* A escada sobe para o Andar 2. Dá pra ouvir passos lá em cima.');
    await say('Ainda não. Primeiro eu preciso entender o que tá acontecendo.', 'me');
    await say('* ({y}Capítulo 2: Herói Número 30{/} chega na próxima atualização.)');
  }
};
