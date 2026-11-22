// ================= CAPÍTULO 6 — Parte 2: A CASA DO SELO =================
// De NOITE, de PAVIO (cancela: "crachá?" -> 47) entra-se no GALPÃO DAS ESTEIRAS: chão de fábrica com a FAIXA amarela
// (Selos Vivos de ronda: Pavio fora da faixa = alarme), o PISO DAS ESTEIRAS (ilhas e alavancas) e o corredor das
// PRENSAS. A porta do COFRE abre com a chave do Tiago. No Cofre: estantes de frascos (lote, data, e um pedaço de cada
// lembrança): achar as do Osvaldo, do Afonso e da Zélia pelo que se sabe deles. Pegar a terceira acorda a SELADORA
// REAL (chefe). Quebrada a Seladora, o tanque abre e as lembranças voam pelas chaminés de volta para a vila. A calha
// de descarte cospe o grupo no canal da vila: o relógio anda, as janelas acendem, e um Pavio traz um bilhete.
// Gancho: a etiqueta dos barris de âmbar bruto: "MINA DE ORIGEM · pelo cano do CORAÇÃO". (O Jorge conhece a estrada.)
const EST6 = [
  { nm: 'Lotes de Velhágua', fr: [
    { l: 'Lote 3', t: 'Uma rede de pesca remendada com linha vermelha, e o cheiro do cais às cinco da manhã.' },
    { l: 'Lote 7', t: 'O tique-taque de um relógio de parede numa sala vazia. Ninguém para dar corda.' },
    { k: 'osvaldo', l: 'Lote 47', t: LEMB6.osvaldo.trecho },
    { l: 'Lote 8', t: 'Uma moeda de cobre achada no limo da fonte, e a vontade de não gastar nunca.' } ] },
  { nm: 'Lotes do Largo', fr: [
    { l: 'Lote 112', t: 'Uma enfermeira de touca contando histórias para um corredor inteiro dormir.' },
    { l: 'Lote 115', t: 'Uma fila na porta do hospital, e alguém guardando lugar para um desconhecido.' },
    { l: 'Lote 118', t: 'Um irmão mais velho ensinando o caçula a assobiar com dois dedos.' } ] },
  { nm: 'Lotes do Cais e da Feira', fr: [
    { l: 'Lote 29', t: 'Pão dormido molhado no café com leite, e a avó dizendo que pão não se joga fora.' },
    { k: 'afonso', l: 'Lote 31', t: LEMB6.afonso.trecho },
    { l: 'Lote 33', t: 'Um fogão de lenha que não acendia, e um pai assoprando até ficar vermelho.' },
    { l: 'Lote 34', t: 'Uma cantiga de feira, aos gritos: "olha o pastel, olha o pastel!"' } ] },
  { nm: 'Lotes de Candeia', fr: [
    { l: 'Lote 201', t: 'Uma vela acesa na janela da mina, para quem ainda não voltou.' },
    { l: 'Lote 240', t: 'Duas mãos sujas de carvão segurando um bolo de aniversário.' },
    { l: 'Lote 312', t: 'Uma serra inteira de casinhas acendendo ao mesmo tempo, vista de cima.' } ] },
  { nm: 'Lotes do Bairro Baixo', fr: [
    { l: 'Lote 6', t: 'Um botão de madrepérola perdido no assoalho, e a pressa de achar antes da missa.' },
    { k: 'zelia', l: 'Lote 9', t: LEMB6.zelia.trecho },
    { l: 'Lote 11', t: 'Uma tesoura enferrujada cortando o cabelo de um menino que não para quieto.' },
    { l: 'Lote 12', t: 'Uma lavadeira cantando no tanque, e a espuma subindo até o cotovelo.' } ] },
  { nm: 'Sem lote (descarte)', fr: [
    { l: '—', t: 'Um frasco vazio. Alguém deu tão pouco que não encheu nem o fundo.' },
    { l: '—', t: 'Um frasco com uma gota só, que cheira a chuva em telhado de zinco.' } ] }
];
{ const _mm6b = montarMapas2; montarMapas2 = function () {
  _mm6b.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== GALPÃO DAS ESTEIRAS =====
  MAPS2.selo1 = { rows: ROWS6.selo1, key: KEY6, name: 'Casa do Selo · Galpão das Esteiras', music: 'selo', batBg: bgFabrica, bg: '#141018', tint: 'rgba(255,190,90,0.06)', semCeu: true,
    procurado: true, stealth: true, faixa: true, grupoLuz: ['seloVivo', 'seloVivo'], reinicio: S16.entra,
    falaOlhou: falaOlhou6, pegoTxt: pegoTxt6, tutPego: async () => { if (!G.flags.tutFaixa6) { G.flags.tutFaixa6 = true; await say('[Dentro do Selo: de PAVIO e NA FAIXA amarela, os Selos Vivos não ligam. Fora da faixa, alarme. Nas esteiras ninguém olha.]', 'cat'); } },
    props: [
      ...S16.maquinas.map(([x, y, w]) => ({ img: () => maquinaArt(w), x, y: y + 1 })),
      { img: quadroTurnoArt, x: S16.quadro[0] - 0.4, y: S16.quadro[1] + 0.2, by: (S16.quadro[1] - 0.5) * TS }
    ],
    ents: [
      ...S16.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('ruaPavios', VP.seloDoor[0][0], VP.seloDoor[0][1] - 1, 'up'); W2.barOpen.selo = true; await fadeIn(10); } })),
      ...S16.cofreDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: portaCofre })),
      ...Object.entries(S16.alavancas).map(([L, [x, y]]) => ({ t: 'sign', id: 'alav' + L, x, y, h: 26, spr: () => { const k = Object.entries(S16.belts).find(([, b]) => b.lev === L)[0]; return alavancaArt((beltSt()[k] ?? S16.belts[k].ini) ? 1 : 0); }, talk: () => puxaAlavanca(L) })),
      { t: 'sign', x: S16.quadro[0], y: S16.quadro[1], h: 30, talk: async () => { await say('* QUADRO DO TURNO DA NOITE. "Crachás 40 a 52. Lote 47: prensa três. ATENÇÃO: Pavio anda na FAIXA. Selo Vivo não distingue Pavio de ladrão: distingue faixa de chão."'); } },
      marcoEnt(...S16.marco),
      bauEnt('selo1', 'b1', ...S16.bau, async () => { await dar('frasco', 1); await dar('tinta', 2); }),
      bauEnt('selo1', 'b2', 33, 19, async () => { await ganhaLemb('juvenal'); }),
      inimigo('sv1', 'seloVivo', ...S16.foe1, ['seloVivo', 'frascoR'], { spr: seloVivoMapa, h: 31, bg: bgFabrica }),
      ...S16.rondas.map((p, i) => ({ t: 'ronda', id: 'selo' + i, x: p[0][0], y: p[0][1], path: p, h: 31, passo: 22, spr: seloVivoMapa, dir: 'right', talk: async () => { await say('* Um Selo Vivo. O cabo de madeira gira e te olha. "TUNC", ele diz, que é a única palavra que ele sabe.'); } }))
    ],
    onEnter: async () => { if (!G.flags.c6Selo1) { G.flags.c6Selo1 = true; await say('* O Galpão das Esteiras. Barulho de máquina, cheiro de cera quente e lá no meio, esteiras correndo em todas as direções, carregando frasquinhos de âmbar que tilintam.'); await say('* Pavios de casaco cinza andam nas faixas amarelas, em fila, sem olhar para os lados. Carimbos de latão do tamanho de cachorros vigiam, batendo o pé: TUNC. TUNC.'); await say('Na faixa. Igual eles. Sem olhar pros lados.', 'rita'); await say('Eu nunca olho pros lados. Eu sou um baú. Eu olho pra frente e pra dentro.', 'me'); } }
  };
  // ===== COFRE DAS LEMBRANÇAS =====
  MAPS2.selo2 = { rows: ROWS6.selo2, key: KEY6, name: 'Casa do Selo · Cofre das Lembranças', music: 'selo', batBg: bgCofre, bg: '#120a10', tint: 'rgba(40,10,30,0.18)', semCeu: true,
    props: [
      ...[[3, 6], [17, 6], [3, 10], [17, 10], [3, 14], [17, 14]].map(([x, y], i) => ({ img: () => estanteFrascosArt(10, (G.flags.c6Pegou || []).length > i % 3 ? 1 : 0), x, y: y + 2 })),
      { img: () => seladoraMapaArt(!!G.flags.c6SeladoraAcordou && !G.flags.c6Seladora), x: S26.seladora[0], y: S26.seladora[1] + 1 },
      { img: livroLotesArt, x: S26.livro[0] - 0.2, y: S26.livro[1] + 1 }
    ],
    ents: [
      ...S26.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('selo1', S16.cofreDoor[0][0], S16.cofreDoor[0][1] + 1, 'down'); await fadeIn(10); } })),
      ...S26.estantes.map(([x, y], i) => ({ t: 'sign', x, y, h: 20, talk: () => estanteCofre(i) })),
      { t: 'sign', x: S26.livro[0], y: S26.livro[1], h: 26, talk: livroLotes },
      bauEnt('selo2', 'b1', ...S26.bau, async () => { await dar('pluma', 1); await dar('cobres', 80); }),
      ...S26.calha.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: calhaDescarte }))
    ],
    onEnter: async () => { if (!G.flags.c6Selo2) { G.flags.c6Selo2 = true; await cofreChega(); } }
  };
  grade(MAPS2.selo1); grade(MAPS2.selo2);
}; }
async function entrarSelo() {
  W2.mv = null;
  if (!G.flags.c6Chave && !G.flags.c6Bras) { await say('* O portão do turno da noite. Trancado por dentro. Só abre quando a cancela deixa.'); return; }
  sfx('door'); await fadeOut(10); loadMap2('selo1', ...S16.entra, 'up'); await fadeIn(10); if (MAPS2.selo1.onEnter) await MAPS2.selo1.onEnter();
}
async function portaCofre() {
  W2.mv = null;
  if (!G.flags.c6Chave) { await say('* Uma porta redonda de ferro, de banco, com o selo da Coroa no meio. A fechadura é do tamanho de uma mão.'); await say('A chave tá com o Herói nº 30. No palco do Festival.', 'rita'); return; }
  sfx('door'); await say(G.flags.c6Selo2 ? '* A chave do Tiago gira de novo.' : '* A chave do Tiago entra inteira. Gira duas vezes. Clanc. Clanc. A porta redonda abre como quem suspira.');
  await fadeOut(10); loadMap2('selo2', ...S26.entra, 'up'); await fadeIn(10); if (MAPS2.selo2.onEnter) await MAPS2.selo2.onEnter();
}
async function cofreChega() {
  await say('* O Cofre das Lembranças. Prateleiras do chão ao teto, e em cada prateleira, centenas de frasquinhos de âmbar com o selo da Coroa. Cada um brilha numa cor.');
  await say('* Em cada etiqueta, um lote, uma data e, escrito à mão, com uma letra pequena e cuidadosa, o começo do que tem dentro.');
  await say('A mesma letra.', 'lume');
  await say('* No fundo da sala, uma máquina enorme dorme: a SELADORA. Um olho de caldeira apagado, dois braços de carimbo dobrados, uma esteira na barriga.');
  await say('A gente procura três. O rosto da mulher do Osvaldo. O que for do cozinheiro que assobia. O que for da lavadeira que procura um dedal.', 'rita');
  await say('[Estantes: cada frasco tem um pedaço da lembrança. Escolha pelo que você sabe de cada Pavio. Frasco errado... foge.]', 'cat');
}
async function livroLotes() {
  await say('* O LIVRO DOS LOTES, aberto num atril. Colunas e colunas: lote, data, origem, rendimento em noites de luz.');
  await say('* "Lote 47 · Velhágua · rendimento: 11 noites." "Lote 31 · Cais · 6 noites." "Lote 9 · Bairro Baixo · 4 noites."');
  await say('Rendimento. Ele mede saudade em noites de luz.', 'rita');
  if (!G.flags.c6Livro) { G.flags.c6Livro = true; await say('* Na última página, uma anotação, a mesma letra pequena: "Hospital dos pobres: prioridade. Nenhuma noite no escuro."'); await say('...', 'lume'); }
}
async function estanteCofre(i) {
  if (G.flags.c6Seladora) { await say('* A estante. Metade dos frascos rachou quando a Seladora caiu. O cheiro de mil lembranças misturadas: pão, chuva, sabão, cabelo de criança.'); return; }
  const E = EST6[i], pegou = G.flags.c6Pegou || [];
  const L = E.fr.filter(f => !f.k || !pegou.includes(f.k));
  const j = await list({ x: 8, y: 26, w: 224, title: E.nm, items: [...L.map(f => ({ label: f.l + (f.k && lembSt()[f.k] ? ' (já tem)' : ''), right: '' })), { label: 'Deixar', right: '' }], desc: k => k < L.length ? '"' + L[k].t + '"' : 'Não mexer em nada.' });
  if (j < 0 || j >= L.length) return;
  const F = L[j];
  if (!F.k) {
    await say('* Você pega o frasco. Ele treme na tampa. A lembrança de dentro não é de ninguém que vocês conhecem e não quer ir com estranhos.');
    sfx('cancel'); V.shake = 4;
    await say('* CRAC. O vidro racha e o frasco pula da sua tampa, flutuando, furioso.');
    const r = await lutaMapa(['frascoR'], { bg: bgCofre }); if (r !== 'win') return;
    await say(pickOne(['Essa não era. Essa era de alguém que a gente nem sabe o nome.', 'Ela foi pra casa sozinha. Pelo menos isso.']), pickOne(['lume', 'rita']));
    return;
  }
  G.flags.c6Pegou = [...pegou, F.k];
  await ganhaLemb(F.k, false);
  await say(pickOne(['Essa é. Tenho certeza.', 'Essa tem a cara dele.', 'Achei.']), pickOne(['rita', 'lume']));
  if (G.flags.c6Pegou.length >= 3) await acordaSeladora();
}
async function acordaSeladora() {
  G.flags.c6SeladoraAcordou = true; W2.mv = null;
  sfx('rumble'); V.shake = 10;
  await say('* No fundo da sala, um estalo de caldeira. O olho da Seladora acende, vermelho. Os dois braços de carimbo desdobram, devagar, como quem acorda de um turno muito longo.');
  await say('[ALERTA: retirada de lote sem registro. Retirada de lote sem registro. Retirada de lote sem...]', 'n');
  await say('Ela quer os frascos de volta.', 'rita');
  await say('Ela não vai ter.', 'me');
  const r = await lutaMapa(['seladora'], { bg: bgCofre, music: 'boss', pos: [[186, 152]], intro: async () => { const e = BT.foes[0]; e.phases = fasesSeladora(); e.ct = 15; callout('SELADORA REAL', '#ff8a6a', 90); } });
  if (r !== 'win') { G.flags.c6SeladoraAcordou = true; return; }
  G.flags.c6Seladora = true; playMusic(null);
  await say('* A Seladora estala, range e senta no chão como um elefante cansado. O tanque de vidro da barriga dela abre de uma vez.');
  sfx('rune'); flashW && flashW(4);
  await say('* E as lembranças saem. Não uma. Não dez. CENTENAS de fios dourados, saindo do tanque, das estantes rachadas, de cada frasco que trincou na luta, subindo pelas chaminés do Selo como fumaça ao contrário.');
  await say('Elas tão indo pra casa.', 'lume');
  await say('* Num canto, presa num barril de âmbar bruto que alimentava a máquina, uma etiqueta de lona: "ÂMBAR BRUTO · MINA DE ORIGEM · pelo cano do CORAÇÃO". A Rita arranca e guarda.');
  G.flags.c6Etiqueta = true;
  await say('[A calha de descarte, no canto de cima à direita, dá para fora. A Guarda vai chegar pela porta da frente.]', 'cat');
  save2();
}
async function calhaDescarte() {
  W2.mv = null;
  if (!G.flags.c6Seladora) { await say('* Uma calha de descarte, larga, de lata, que desce para o escuro. Para frascos vazios. E, talvez, para um baú com pressa.'); if (!G.flags.c6SeladoraAcordou) await say('Primeiro os frascos. A gente veio pelos frascos.', 'rita'); return; }
  await fimCap6();
}
async function fimCap6() {
  await say('* Vocês pulam na calha. Escorregam por um túnel de lata, de cabeça, de tampa, aos gritos, e saem voando para dentro do canal da Vila dos Pavios. SPLASH.');
  await fadeOut(20); G.hora = 2 * 60 + 40;
  V.scene = 'world'; loadMap2('ruaPavios', 26, 27, 'up'); playMusic('vila'); await fadeIn(20);
  await say('* A Lume e a Rita saem de dentro do baú, que boiou, porque baú boia. Encharcadas. Rindo. E param de rir ao mesmo tempo.');
  await say('* As lembranças estão descendo sobre a vila. Fios dourados entrando pelas janelas, pelas portas, pelas chaminés das doze casinhas iguais.');
  await say('* Uma porta abre. Uma Pavia sai de camisola, olha para as próprias mãos e diz um nome. Outra porta. Um homem chora encostado no batente. Alguém, lá no fim da rua, começa a cantar uma cantiga de feira.');
  if (temLemb('osvaldo')) { await say('* O Osvaldo vem correndo da praça, de casaco cinza meio vestido, olhando para cima, para os fios dourados, procurando um. Não acha. Ele olha para vocês.'); await devolverLemb('osvaldo', cenaOsvaldo); }
  await say('* Um Pavio de casaco cinza, dos que ainda não lembram, atravessa a rua com uma bandeja. Em cima, um envelope fechado com lacre de cera. Ele entrega à Lume e vai embora sem dizer nada.');
  await say('* Dentro, a letra pequena e cuidadosa.');
  await say('* "Senhor baú. As lembranças que o senhor soltou esta noite manteriam o hospital dos pobres aceso por onze noites. Eu anotei. Com data. Elas vão fazer falta em agosto. Eu não estou zangado. Eu só faço a conta. — U.V."');
  await say('* A Lume dobra o bilhete muito pequeno e põe no bolso, junto com a página do nome riscado.');
  await say('Ele vai cobrar isso de alguém.', 'rita');
  await say('Então a gente chega antes da cobrança.', 'me');
  await fadeOut(30);
  G.flags.c6Fim = true; G.hora = 9 * 60; G.dia = (G.dia || 0) + 1; G.disfarce = null;
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Na base, de manhã. A Irmã Dalva estende a roupa molhada de vocês no varal do Vão (sim, agora tem um varal). O Seu Jorge examina a etiqueta de lona que a Rita trouxe.');
  await say('"Mina de Origem. Pelo cano do Coração." Hm.', 'jorge');
  await say('O senhor conhece?', 'rita');
  await say('Conheço a ESTRADA. A estrada velha das minas, que sai pelos fundos da serra. Ônibus não passa mais lá faz anos. Eu dirigia numa estrada assim. Em algum lugar. Antes.', 'jorge');
  await say('* Ele fica olhando a etiqueta mais tempo do que precisava. Depois dobra e devolve.');
  await say('Se for pra ir, eu levo. O 31 sobe qualquer serra. É só não perguntarem o que eu lembro do caminho, que eu lembro pouco.', 'jorge');
  await say('[Registro: a Guarda Real saiu do Bairro Baixo esta manhã. Foi chamada "para as minas". Os Marcos estão livres de novo.]', 'cat');
  save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 6', 'A Cidade dos Pavios', '', 'Cinco lembranças voltaram para casa.', 'E muitas outras, sozinhas.']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); await fadeIn(20);
  await say('* (O Capítulo 7 está a caminho. Auren, a Vila dos Pavios e a Casa do Selo continuam abertas: ainda dá para devolver as lembranças que faltam.)');
}
