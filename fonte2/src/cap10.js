// ================= CAPÍTULO 10 — O FAROL DE CEM INVERNOS (Parte 1: A TORRE) =================
// O Farol acendeu. Onde o facho passa, a cidade esquece uma coisinha: o nome de uma rua, a música de ninar, o caminho de
// casa. Cada volta do facho, o Farol fica mais cheio. O grupo sobe A TORRE: quatro andares de escada com paredes de vidro
// cheias de potes. BALANÇAS de latão só descem com o peso de um pote (levado pelo Vão); as grades abrem quando todas as
// balanças do andar descem. Cada pote guardado no Vão deixa escapar uma lembrança de alguém. Quatro potes têm NOME
// (o do Jorge, o do Zé Candeeiro, o do Antônio da Dona Cida e o da Dona Rosa do Seu Benedito). Na sala das máquinas, O
// CONTRAPESO. Parte 2 (cap10b): a sala da lanterna.
const TO10 = POS10.torre10, LA10 = POS10.lanterna10;
Object.assign(TRACKS, {
  torre10: { bpm: 72, bars: 4, chords: 'Dm Am Bb F', bass: 'root5', bassVol: 0.07,
    lead: 'D5:4 F5:2 A5:2 G5:4 F5:4 | E5:4 A5:4 C6:8 | D6:4 C6:2 Bb5:2 A5:4 G5:4 | F5:4 E5:4 D5:8', leadWave: 'triangle', leadVol: 0.045, arp: { rate: 4, vol: 0.014, oct: 1 }, drums: 'k.......k.......', hatVol: 0 },
  final10: { bpm: 138, bars: 4, chords: 'Em C D B', bass: 'root5', bassVol: 0.1,
    lead: 'E5:2 G5:2 B5:4 A5:2 G5:2 F#5:4 | E5:2 G5:2 C6:4 B5:2 A5:2 G5:4 | F#5:2 A5:2 D6:4 C6:2 B5:2 A5:4 | B5:2 D#6:2 F#6:4 E6:2 D#6:2 B5:4', leadWave: 'square', leadVol: 0.055, arp: { rate: 4, vol: 0.018, oct: 1 }, drums: 'k.h.s.h.k.khs.h.', hatVol: 0.03 }
});
const POTE_NOMES10 = {
  jorge: { nm: 'JORGE — 31', d: 'Um pote com uma etiqueta à mão: "JORGE". Embaixo, alguém riscou e escreveu de novo, com outra letra: "31".' },
  ze: { nm: 'ZÉ CANDEEIRO', d: 'Etiqueta de lata: "ZÉ CANDEEIRO". Dentro, um cheiro de pavio de lampião e de pão de queijo.' },
  antonio: { nm: 'ANTÔNIO (Inverno)', d: 'Etiqueta velha, de doze anos: "ANTÔNIO — INVERNO ESCURO". Um raminho de alecrim seco amarrado no gargalo.' },
  rosa: { nm: 'DONA ROSA', d: 'Etiqueta com flor desenhada: "ROSA". Dentro, terra de jardim e uma risada.' }
};
const LEMBRANCAS10 = ['"...a mãe chamando pro almoço, da janela..."', '"...o primeiro sapato que eu comprei com o meu dinheiro..."', '"...o cheiro do rio de manhã cedo..."', '"...ela disse sim. Ela disse SIM..."', '"...o meu cachorro, Pipoca, que tinha medo de trovão..."', '"...a música que o pai assobiava consertando a cerca..."', '"...a primeira neve. Eu pus a língua pra fora..."', '"...o nome da minha rua. Era Rua das Flores. Era?"', '"...a vó fazendo bolo de fubá, de avental azul..."', '"...o barulho da chuva no telhado de zinco..."'];
// ---------- começo ----------
function iniciarCap10() {
  if (G.flags.c10Init) return false;
  G.flags.c10Init = true; G.poder = Math.max(G.poder || 1, 9); curarTudo(); G.hora = 23 * 60 + 55;
  G.items = Object.assign({}, G.items, { frasco: Math.max(4, G.items.frasco || 0) });
  return true;
}
async function capitulo10() {
  if (!MAPS2.torre10) montarMapas2();
  const novo = iniciarCap10();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'farol9', x: FA9.entra[0], y: FA9.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 10', 'O Farol de Cem Invernos']);
  V.scene = 'world'; loadMap2('farol9', FA9.porta[0][0], FA9.porta[0][1] + 3, 'up'); playMusic('farol9'); await fadeIn(30);
  await say('* O facho do Farol passa por cima do pátio. Branco, dourado, frio. Passa, e passa de novo, a cada vinte batidas de coração.');
  await say('* E cada vez que ele passa por Auren, lá embaixo, a cidade esquece uma coisinha. O nome de uma rua. A cantiga de ninar. O caminho de casa.');
  await say('Eu... qual era o nome da padaria do Largo? Eu sabia. Eu SABIA agora há pouco.', 'rita');
  await say('[Confirmado. O Farol está LENDO a cidade. Cada volta, ele fica mais cheio. Ao amanhecer ele vai ter lido tudo.]', 'cat');
  await say('{o}ele não vai parar. ele não sabe parar. a coisa que fez ele também não sabia.{/}', 'eco8');
  await say('* O Tiago segura a porta da torre com as costas, de espada de herói desembainhada, olhando para a trilha.');
  await say('Lá em baixo a Guarda já percebeu. Vão subir. Eu seguro a porta. Vocês sobem. Herói segura porta, lembra?', 'tiago');
  await say('Tiago...', 'lume');
  await say('Eu sempre soube quando a conta não fechava. Vai. Fecha a conta.', 'tiago');
  await say('[A TORRE: balanças de latão abrem as grades de cada andar. Só descem com PESO: os potes. Leve os potes pelo Vão (A para guardar, A num chão livre para pôr).]', 'cat');
  save2();
}
{ const _c9 = capitulo9; capitulo9 = async function () { if (!MAPS2.torre10) montarMapas2(); if (G.flags.c9Fim) return capitulo10(); return _c9(); }; }
{ const _uw10c = updateWorld2; updateWorld2 = function () { _uw10c(); if (V.scene === 'world' && G.flags.c9Fim && !G.flags.c10Init && !worldBusy2() && !W2.mv) run2(capitulo10); }; }
// a porta do Farol, depois do Cap. 9, leva para a torre
{ const _cf9 = cenaFim9; cenaFim9 = async function () { if (G.flags.c9Fim) { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('torre10', ...TO10.entra, 'up'); await fadeIn(10); if (MAPS2.torre10.onEnter) await MAPS2.torre10.onEnter(); return; } return _cf9(); }; }
// ---------- potes (móveis: "vaso" com var >= 100) ----------
{ const _vmA = vasoMovelArt; vasoMovelArt = function (k = 0) { if (k >= 100) return poteArt(k - 100, Math.floor((W2.t || 0) / 10)); return _vmA(k); }; }
{ const _fM10 = falaMovel; falaMovel = async function (e) {
  if (e.k === 'vaso' && e.var >= 100) {
    const c = await choose('* Um pote de Pavio. Morno. Pesado de um jeito que não é só peso.', ['Guardar no Vão', 'Deixar'], 'n', 1);
    if (c === 0) guardarNoVao(e); return;
  }
  return _fM10(e);
}; }
{ const _gV10 = guardarNoVao; guardarNoVao = function (e) {
  const ok = _gV10(e);
  if (ok && e.k === 'vaso' && e.var >= 100) { W2.toast = { s: pickOne(LEMBRANCAS10), t: 0 }; G.flags.c10Lembr = (G.flags.c10Lembr || 0) + 1; if (G.flags.c10Lembr === 1) run2(async () => { await say('* Quando o pote entra no Vão, uma voz sai dele. Não é de ninguém que vocês conhecem. É uma lembrança, escapando.'); await say('O baú guarda o que os outros esqueceram. Sempre foi isso, né?', 'lume'); await say('Hoje eu guardo com cuidado.', 'me'); }); }
  return ok;
}; }
// ---------- a torre ----------
function gradeAberta10(k) { return !!G.flags['c10G_' + k]; }
{ const _mm10 = montarMapas2; montarMapas2 = function () {
  _mm10.apply(this, arguments);
  if (MAPS2.torre10) return;
  const vai = (map, xy, dir, onEnter) => async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2(map, ...xy, dir); await fadeIn(10); if (onEnter && MAPS2[map].onEnter) await MAPS2[map].onEnter(); };
  const potes = []; let n = 0; for (const [fl, L] of Object.entries(TO10.potes)) for (const [x, y] of L) potes.push({ id: 'pote10_' + (n++), k: 'vaso', var: 100 + (n % 3), x, y });
  MAPS2.torre10 = { rows: ROWS10.torre10, key: KEY10, name: 'O Farol · A Torre', music: 'torre10', batBg: bgTorre10, bg: '#0a0c18', semCeu: true,
    lights: [...TO10.andares.map(a => [15, a.y0 + 3, 120]), ...Object.values(TO10.grades).flatMap(g => g.placas.map(([x, y]) => [x + 0.5, y + 0.5, 30]))],
    moveis: potes,
    props: [
      ...Object.entries(TO10.grades).map(([k, gd]) => ({ img: () => gradeArt(gradeAberta10(k)), x: gd.at[0][0], y: gd.at[0][1] + 1.5, by: (gd.at[0][1] + 1) * TS, get solid() { return gradeAberta10(k) ? [] : [[gd.at[0][0], gd.at[0][1], 2, 1]]; } })),
      { img: () => correnteTorreArt(Math.floor(W2.t / 8)), x: 13, y: 12, by: 9 * TS },
      ...TO10.maquinas.map(([x, y], i) => ({ img: () => engrenagemArt(Math.floor(W2.t / 6) + i), x: x - 0.6, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: () => G.flags.c10Contrapeso ? EMPTY_C : contrapesoArt(Math.floor(W2.t / 12), '', 1), x: TO10.contrapeso[0] - 3.1, y: TO10.contrapeso[1] + 1, by: (TO10.contrapeso[1] + 1) * TS, get solid() { return G.flags.c10Contrapeso ? [] : [[TO10.contrapeso[0] - 2, TO10.contrapeso[1] - 1, 4, 2]]; } }
    ],
    ents: [
      ...TO10.volta.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: vai('farol9', [FA9.porta[0][0], FA9.porta[0][1] + 2], 'down') })),
      ...TO10.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !G.flags.c10Contrapeso, run: vai('lanterna10', LA10.entra, 'up', true) })),
      ...Object.entries(TO10.especiais).map(([k, [x, y]]) => ({ t: 'sign', id: 'poteN_' + k, x, y, h: 20, spr: () => poteNomeArt(Math.floor(W2.t / 8)), luz: 36, gone: () => !!(G.potes10 || {})[k], talk: () => pegaPoteNome10(k) })),
      ...TO10.cpTrig.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !!G.flags.c10Contrapeso, run: lutaContrapeso10 })),
      inimigo('t10a', 'ecoL', ...TO10.foes[0], ['ecoL', 'ecoL'], { spr: (t) => ecoLArt(Math.floor(t / 8)), h: 34, bg: bgTorre10, fly: true }),
      inimigo('t10b', 'sentinela', ...TO10.foes[1], ['sentinela', 'ecoL'], { spr: (t, d) => { const c = sentinelaArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(c) : c; }, h: 40, bg: bgTorre10 }),
      inimigo('t10c', 'ecoL', ...TO10.foes[2], ['ecoL', 'sentinela', 'ecoL'], { spr: (t) => ecoLArt(Math.floor(t / 8)), h: 34, bg: bgTorre10, fly: true }),
      inimigo('t10d', 'sentinela', ...TO10.foes[3], ['sentinela', 'sentinela', 'ecoL'], { spr: (t, d) => { const c = sentinelaArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(c) : c; }, h: 40, bg: bgTorre10, gone: () => !!G.flags.c10Contrapeso }),
      marcoEnt(...TO10.marco),
      bauEnt('torre10', 'b0', ...TO10.bau[0], async () => { await dar('frasco', 2); await dar('cobres', 120); }),
      bauEnt('torre10', 'b1', ...TO10.bau[1], async () => { await dar('pluma', 1); await dar('tinta', 2); }),
      bauEnt('torre10', 'b2', ...TO10.bau[2], async () => { await dar('frasco', 1); await dar('pluma', 1); })
    ],
    onEnter: async () => { if (!G.flags.c10Torre) { G.flags.c10Torre = true; await say('* A torre por dentro. Uma escada que sobe em andares, e as paredes não são paredes: são prateleiras de vidro, do chão ao teto, cheias de potes. Cada pote com uma luzinha morna.'); await say('* No chão de cada andar, balanças de latão do tamanho de uma tampa de bueiro. E no pé de cada escada, uma grade.'); await say('Balança... peso... Os potes. Ele usa as pessoas de contrapeso até pra abrir porta.', 'rita'); } }
  };
}; }
// as balanças: desenho e a checagem das grades
{ const _chB10 = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) { const r = _chB10 ? _chB10(m, ox, oy) : undefined; if (m && m === MAPS2.torre10) for (const [k, gd] of Object.entries(TO10.grades)) for (const [x, y] of gd.placas) bx.drawImage(balancaArt(gradeAberta10(k) || placaApertada(x, y)), x * TS - ox, y * TS - oy); return r; }; }
{ const _uwB10 = updateWorld2; updateWorld2 = function () {
  _uwB10();
  if (V.scene !== 'world' || W2.id !== 'torre10' || worldBusy2()) return;
  for (const [k, gd] of Object.entries(TO10.grades)) if (!gradeAberta10(k) && gd.placas.every(([x, y]) => placaApertada(x, y))) { G.flags['c10G_' + k] = true; sfx('door'); V.shake = 4; W2.toast = { s: 'As balanças descem. A grade sobe.', t: 0 }; if (k === 'g0') run2(async () => { await say('Funcionou! Um pote numa balança e a grade abriu!', 'lume'); await say('[Os andares de cima pedem mais balanças. Os potes do andar de baixo também servem: o Vão leva.]', 'cat'); }); }
}; }
async function pegaPoteNome10(k) {
  const P = POTE_NOMES10[k]; G.potes10 = G.potes10 || {}; G.potes10[k] = true; sfx('item');
  await say('* ' + P.d);
  if (k === 'jorge') { G.flags.c10PoteJorge = true; await say('O Seu Jorge. É o pote do Seu Jorge.', 'lume'); await say('* A Rita pega o pote com as duas mãos, como quem pega um passarinho. Ela não diz nada. Ela guarda no Vão, embaixo de tudo, no lugar mais protegido.'); await say('Na volta a gente entrega. Na mão dele.', 'me'); }
  else if (k === 'ze') await say('O Zé da Dona Ilda. O da lanterna. Ele não subiu do Coração... mas a lembrança dele subiu até aqui.', 'rita');
  else if (k === 'antonio') await say('Antônio, do Inverno Escuro. O marido da Dona Cida. Doze anos aqui dentro, acendendo a cidade.', 'lume');
  else await say('Dona Rosa... a mulher do Seu Benedito, o jardineiro da Cidade Alta? Ele falou dela. Das rosas.', 'lume');
  await say('* {y}' + P.nm + '{/} no Vão.');
}
async function lutaContrapeso10() {
  if (G.flags.c10Contrapeso) return; W2.mv = null;
  await say('* A sala das máquinas. Engrenagens do tamanho de rodas de carroça girando no escuro. No meio, pendurado numa corrente que some lá em cima, um bloco de ferro do tamanho de uma casa.');
  await say('* O bloco tem potes encravados no ferro. Centenas. E um olho de válvula, vermelho, que se abre quando vocês chegam.');
  await say('[O CONTRAPESO. É ele que puxa a lanterna para cima. Enquanto ele pesar, a luz não desce.]', 'cat');
  const r = await lutaMapa(['contrapeso'], { bg: bgTorre10, music: 'boss', pos: [[186, 170]], intro: async () => { const e = BT.foes[0]; e.phases = fasesContrapeso10(); e.ct = 12; callout('O CONTRAPESO', '#c8c8d8', 90); } });
  if (r !== 'win') return;
  G.flags.c10Contrapeso = true; playMusic('torre10');
  await say('* O Contrapeso cai. A corrente escorrega das engrenagens com um barulho de trovão e some no poço. Os potes encravados no ferro se soltam e rolam pelo chão, inteiros, mornos.');
  await say('* Lá em cima, alguma coisa grande DESCE um pouco. O facho pisca. Uma vez.');
  await say('A lanterna desceu. Ele vai ter que segurar ela na mão agora.', 'me');
  save2();
}
