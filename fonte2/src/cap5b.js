// ================= CAPÍTULO 5 — Parte 2: OS TELHADOS DE AUREN =================
// Do terraço da Acendedoria, à noite, a fuga por cima da cidade: telhados ligados por cumeeiras; cinco VÃOS onde a
// cumeeira caiu e só se passa com uma TÁBUA guardada no Vão (são duas: atravessou, vira, guarda de novo, leva adiante);
// GUARITAS com holofotes e RONDAS da Guarda Real (pego = luta e volta ao último telhado alcançado); gatos e chaminés.
// No fim, a torre do sino com o GRANDE HOLOFOTE. Depois: a descida pelo Bairro Baixo, os cartazes de PROCURADOS e a
// base. FIM DO CAPÍTULO 5.
const CP_TELHADO = [[3, 23], [14, 21], [25, 19], [35, 20], [45, 15], [55, 17]];
{ const _mm5b = montarMapas2; montarMapas2 = function () {
  _mm5b.apply(this, arguments);
  MAPS2.telhados = { rows: ROWS5.telhados, key: KEY5, name: 'Os Telhados de Auren', music: 'telhados', batBg: bgTelhado, bg: '#080c20', tint: 'rgba(30,40,110,0.18)',
    holofotes: TE5.holofotes, holofotesSempre: true, stealth: true, grupoLuz: ['guardaR', 'guardaR'],
    reinicio: () => { const i = Math.max(0, Math.min(CP_TELHADO.length - 1, G.flags.c5cp || 0)); trazerTabuas(i); return CP_TELHADO[i]; },
    moveis: TE5.tabuas.map(([x, y], i) => ({ id: 'tabua' + i, k: 'tabua', x, y })),
    props: [
      ...TE5.chamines.map(([x, y]) => ({ img: chamineArt, x: x + 0.05, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...TE5.holofotes.map(([x, y]) => ({ img: guaritaArt, x: x - 0.5, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: () => G.flags.c5Holofote ? EMPTY_C : holofoteBossArt(Math.floor(W2.t / 20) % 2, 1, false), x: TE5.chefe[0] - 3, y: TE5.chefe[1] + 0.5, by: TE5.chefe[1] * TS }
    ],
    ents: [
      marcoEnt(...TE5.marco),
      ...TE5.guardas.map(([x, y], i) => ({ t: 'ronda', id: 'guardaT' + i, x, y, path: i === 0 ? [[23, 21], [29, 21]] : [[43, 18], [48, 18]], h: 56, passo: 24, spr: guardaSpr, dir: 'right', talk: async () => { await say('* O guarda está de costas, resmungando sobre o frio.'); } })),
      ...TE5.bau.map(([x, y], i) => bauEnt('telhados', 'b' + i, x, y, async () => { await dar(i ? 'pluma' : 'frasco', 1); await dar('cobres', 50); })),
      { t: 'trig', x: TE5.fim[0], y: TE5.fim[1], w: 3, h: 1, passa: true, run: lutaHolofote },
      ...TE5.descida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: descerTelhados }))
    ]
  };
  { const m = MAPS2.telhados, grade = p => { if (p._hld) return; const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; }; m.props.forEach(grade); }
  // depois do capítulo: cartazes de PROCURADOS pela cidade
  for (const [id, pos] of [['auren', [[16, 9.6], [33, 10.6]]], ['largo', [[12, 9.4], [34, 9.4]]], ['festival', [[17.6, 7.6], [41.2, 7.6]]], ['praca', [[19.6, 8.6]]], ['cais', [[31, 8.6]]]]) {
    const m = MAPS2[id]; if (!m || m._procurado) continue; m._procurado = true;
    for (const [x, y] of pos) m.props.push({ img: () => G.flags.c5Fim ? procuradoArt() : EMPTY_C, x, y, by: (y - 0.2) * TS });
  }
}; }
let PROC_C = null;
function procuradoArt() {
  if (PROC_C) return PROC_C;
  const P = new Pix(22, 28); P.rect(0, 0, 22, 28, '#e8dcc0'); P.rect(1, 1, 20, 26, '#f4ead0'); P.rect(3, 3, 16, 3, '#8a1a2a');
  P.rect(4, 9, 6, 7, '#8a5a30'); P.rect(4, 9, 6, 2, '#c89a30'); P.rect(12, 9, 6, 8, '#e8c050'); P.rect(13, 10, 4, 4, '#ff7aa8'); P.rect(6, 18, 10, 6, '#c83a3a');
  for (let i = 0; i < 3; i++) P.rect(4, 19 + i * 2, 14, 1, '#5a4a40'); P.p(2, 2, '#8a8a8a'); P.p(19, 2, '#8a8a8a');
  return PROC_C = P.outline().canvas();
}
// checkpoints: o telhado mais longe alcançado
{ const _uwT = updateWorld2; updateWorld2 = function () { _uwT(); if (W2.id === 'telhados' && !W2.mv) { for (let i = CP_TELHADO.length - 1; i > 0; i--) if (W2.x >= CP_TELHADO[i][0] - 1) { if ((G.flags.c5cp || 0) < i) { G.flags.c5cp = i; W2.toast = { s: 'Telhado alcançado', t: 0 }; } break; } } }; }
// se as tábuas ficaram para trás, a Rita as traz (nunca prende o jogador)
function trazerTabuas(i) {
  const est = movEstado('telhados'), [cx, cy] = CP_TELHADO[i];
  TE5.tabuas.forEach(([dx, dy], idx) => {
    const k = 'tabua' + idx, s = est[k]; if (s === null) return;            // está no Vão: vai junto
    const x = s ? s.x : dx;
    if (x < cx - 1) est[k] = { k: 'tabua', x: cx + 1 + idx, y: cy, ponte: false };
  });
}
async function irParaTelhados() {
  W2.mv = null; await fadeOut(16);
  await say('* O terraço da Acendedoria. Lá embaixo, a cidade inteira acesa. E, subindo pela escadaria do jardim, botas. Muitas botas. Lanternas azuis da Guarda Real.');
  playMusic('telhados');
  V.scene = 'world'; loadMap2('telhados', ...TE5.entra, 'right'); await fadeIn(16);
  await say('Os telhados! Do terraço dá pra pular pro primeiro!', 'rita');
  await say('* E dá. Vocês pulam. As telhas estalam. Atrás, alguém grita "NO TELHADO!".');
  await say('[Os telhados são ligados por cumeeiras. Onde a cumeeira caiu, o VÃO só se atravessa com uma TÁBUA guardada no Vão. Depois de passar, vire e guarde a tábua de novo: você vai precisar dela adiante.]', 'cat');
  await say('[Holofotes das guaritas e Guardas de ronda: GENTE é pega sempre; o BAÚ só se estiver ANDANDO.]', 'cat');
  await say('Eu fujo pelos telhados com duas mulheres e duas tábuas dentro de mim. Que vida.', 'me');
  G.flags.c5Telhados = true; G.flags.c5cp = 0; save2();
}
async function lutaHolofote() {
  if (G.flags.c5Holofote) return; W2.mv = null;
  await say('* No fim dos telhados, a torre do sino do Bairro Baixo. E, em cima dela, uma máquina enorme: um holofote de bronze com uma lente do tamanho de uma carroça, um operador da Guarda agarrado às alavancas.');
  await say('"ACHEI! ACHEI OS FUGITIVOS! TODO MUNDO OLHANDO PRA LUZ!"', 'guardaRH');
  await say('* O facho vira para vocês. É como olhar para o meio-dia.');
  await say('A descida é atrás dele. Escada da torre. É passar por ele ou passar a noite aqui.', 'rita');
  await say('[GRANDE HOLOFOTE. Varredura em todos, CEGAR atrasa a vez, FACHO TOTAL preparado: quebre o escudo! A lente racha com corte e mordida. Areia e Vidro vêm a calhar.]', 'cat');
  await say('Eu sempre quis morder um sol. Hoje é o dia.', 'me');
  const r = await lutaMapa(['holofote'], { bg: bgTelhado, music: 'boss', pos: [[184, 160]], intro: async () => { const e = BT.foes[0]; e.phases = fasesHolofote(); e.ct = 15; callout('GRANDE HOLOFOTE', '#ffe8a0', 90); } });
  if (r !== 'win') return;
  G.flags.c5Holofote = true; save2();
  await say('* A lente estoura num estalo de vidro e a luz vira só uma lâmpada cansada. O operador sai correndo pela escada, gritando por reforço que não vem.');
  await say('Pela escada, rápido! Antes de ele lembrar que tem apito!', 'rita');
}
async function descerTelhados() {
  if (!G.flags.c5Holofote) { await say('* A escada da torre do sino. Bloqueada pelo holofote e pelo operador.'); W2.mv = null; return; }
  if (G.flags.c5Fim) return;
  W2.mv = null; await fadeOut(24);
  await say('* A escada da torre desce em caracol até o Bairro Baixo. Vocês saem numa viela escura, atrás da feira, sem fôlego, sujos de fuligem até a tampa.');
  V.scene = 'world'; loadMap2('auren', ...POS3.auren.bueiroOut, 'down'); playMusic('auren'); await fadeIn(24);
  await say('* E, no muro da viela, colado agora, ainda com a cola molhada: um cartaz.');
  await say('* "PROCURADOS PELA COROA: um BAÚ COM DENTES, uma MOÇA DE VELAS, uma ESCUDEIRA. Invasão da Acendedoria Real. Recompensa: 1.000 frascos de âmbar." Embaixo, um desenho de vocês três. O seu ficou até bonito.');
  await say('Mil frascos. Nós valemos mil frascos.', 'rita');
  await say('Eu valia trezentos em Velhágua. Eu fui promovido.', 'me');
  await say('Ele não precisou prender a gente. Só precisou tocar um sininho.', 'lume');
  await say('* A Lume tira do bolso a página com o nome riscado. Olha muito tempo. Depois guarda de novo, perto do peito.');
  await say('Quarenta e sete invernos, ele disse. Quantas pessoas são quarenta e sete invernos?', 'lume');
  await say('Muitas. Mas a gente sabe onde estão os nomes. Todos anotados. Com data.', 'me');
  await say('Então a gente devolve. Um por um. Igual ele tirou.', 'rita');
  await fadeOut(30);
  G.flags.c5Fim = true; G.hora = 23 * 60;
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Na base, a Irmã Dalva espera com chá. Não é de erva-cidreira. É de hortelã, forte, de hospital.');
  await say('Eu vi os cartazes. Vocês viraram celebridade. Sentem, que eu cuido dos arranhões. E depois me contem tudo, devagar, desde o começo.', 'dalva');
  await say('E o 31? Ele tá nos cartazes? Eu também quero estar nos cartazes.', 'jorge');
  await say('[Registro: a partir de agora, a Guarda Real procura o grupo em Auren. Os Marcos continuam funcionando. Por enquanto.]', 'cat');
  save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 5', 'O Caderno Preto', '', 'A Lume tem uma luz só dela.', 'E o grupo, um preço na cabeça.']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); await fadeIn(20);
  await say('* (O Capítulo 6 está a caminho. A cidade, os telhados e a Cidade Alta continuam abertos.)');
}
// ---------- telhados com corpo: fachadas descendo para o escuro, beirais, cumeeiras e a cidade lá embaixo ----------
let TELH_OV = null;
function telhadoOverlay(m) {
  if (TELH_OV && TELH_OV.m === m) return TELH_OV.c;
  const R = m.rows, H = R.length, Wd = R[0].length, c = mk(Wd * 16, H * 16), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  const roof = (i, j) => j >= 0 && j < H && i >= 0 && i < Wd && R[j][i] === '.', vazio = (i, j) => j < 0 || j >= H || i < 0 || i >= Wd || R[j][i] === ' ';
  // a cidade lá embaixo: ruas com janelinhas e lampiões, bem longe
  for (let j = 0; j < H; j++) for (let i = 0; i < Wd; i++) if (vazio(i, j)) {
    const r = hash(i, j, 41) % 100;
    if (r < 10) { P('rgba(255,190,90,0.16)', i * 16 + 2, j * 16 + 6, 12, 5); P('#ffcf70', i * 16 + 7, j * 16 + 8, 1, 1); }
    else if (r < 15) { const X = i * 16 + 3, Y = j * 16 + 5; P('#1c2240', X, Y + 3, 10, 6); P('#1c2240', X + 1, Y + 2, 8, 1); P('#1c2240', X + 3, Y + 1, 4, 1); P('#ffd880', X + 4 + (r % 3), Y + 5, 1, 2); }
  }
  // fachadas: debaixo de cada beiral, a parede cai 2 tiles e some no escuro, com janelas acesas
  for (let j = 0; j < H; j++) for (let i = 0; i < Wd; i++) if (roof(i, j) && vazio(i, j + 1)) {
    const X = i * 16, Y = (j + 1) * 16, cor = ['#6a4a3a', '#5a4a5a', '#7a5a40'][hash(Math.floor(i / 9), j, 7) % 3];
    for (let k = 0; k < 30; k++) { if (!vazio(i, j + 1 + Math.floor(k / 16))) break; x.globalAlpha = Math.max(0, 1 - k / 30); P(cor, X, Y + k, 16, 1); if (k % 6 === 5) P('rgba(0,0,0,0.25)', X, Y + k, 16, 1); }
    x.globalAlpha = 1; P('#2a1a18', X, Y, 16, 2); P('#a86048', X, Y - 1, 16, 1);
    if (hash(i, j, 3) % 3 === 0) { P('#1a1420', X + 4, Y + 6, 7, 9); P(hash(i, j, 5) % 2 ? '#ffd070' : '#ffb050', X + 5, Y + 7, 5, 7); P('#5a3a20', X + 7, Y + 7, 1, 7); P('#5a3a20', X + 5, Y + 10, 5, 1); P('rgba(255,200,100,0.12)', X + 1, Y + 16, 13, 6); }
  }
  // bordas: cumeeira no topo, sombra nas laterais
  for (let j = 0; j < H; j++) for (let i = 0; i < Wd; i++) if (roof(i, j)) {
    const X = i * 16, Y = j * 16;
    if (vazio(i, j - 1)) { P('#d88a68', X, Y, 16, 2); P('#4a2a22', X, Y + 2, 16, 1); }
    if (vazio(i - 1, j)) { P('#3a2020', X, Y, 2, 16); }
    if (vazio(i + 1, j)) { P('#3a2020', X + 14, Y, 2, 16); P('rgba(0,0,0,0.25)', X + 12, Y, 2, 16); }
  }
  // cumeeira no meio de cada telhado (uma linha clara a cada 4 fileiras)
  for (let j = 0; j < H; j++) for (let i = 0; i < Wd; i++) if (roof(i, j) && roof(i, j - 1) && roof(i, j + 1) && j % 4 === 1) { P('#b86a50', i * 16, j * 16 + 7, 16, 2); P('#5a3028', i * 16, j * 16 + 9, 16, 1); }
  TELH_OV = { m, c }; return c;
}
{ const _chT = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _chT ? _chT(m, ox, oy) : undefined;
  if (m && m === MAPS2.telhados) bx.drawImage(telhadoOverlay(m), -ox, -oy);
  return r;
}; }
