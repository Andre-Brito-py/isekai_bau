// ================= MISSÃO OPCIONAL: DOIS PÉS PARA A VALSA (v109) =================
// Pedido do usuário: "pode adicionar uma missão extra de transformar o seu Valdir em uma forma humana? pode ser na
// Dungeon do primeiro jogo, para ter um retorno legal ao primeiro mapa, uma missão opcional".
//  - COMEÇO: no Coreto (depois que ele veio, v108), o Seu Valdir conta que queria dançar com a Marlene "de pé". A Runa do
//    Rosto (a mesma que deu um rosto ao baú) pode dar um corpo, mas precisa do rosto DELE, e ele não lembra: o rosto
//    ficou lá embaixo. Quando o coreto atravessou o Vão, o lugar dele na masmorra ficou vazio, e a masmorra empurrou o
//    buraco para cima, até o ANDAR 1 (o primeiro mapa da T1). Uma RACHADURA nova, na sala do lago do Andar 1.
//  - Só dá para ir depois de chegar ao Andar 1 pela Mina de Origem (Cap. 7); antes disso a missão espera.
//  - A PRAÇA VAZIA (mapa novo): a marca redonda onde o coreto ficava, estantes de partitura caídas, um lago. Três
//    LEMBRANÇAS DO ROSTO:
//      1) A FOTO 3x4 (do documento): um bando da masmorra carrega (luta; quem vence acha a foto).
//      2) O SORRISO: a ESTANTE DA CHAMADA (eco da Profª Neide na T1): três perguntas — banco do Valdir (4), banco da
//         Marlene (5), o ano riscado no banco da praça do Coreto (1972). Errou: os morcegos da praça atacam e a chamada
//         recomeça.
//      3) O OLHAR: com as duas primeiras, o centro da marca acende. Chefe opcional: A BANDA FANTASMA (o eco da banda que
//         tocava no coreto e não sabe parar). FORTÍSSIMO a cada 4 vezes (quebre o escudo); Tuba, Pratos (todos), Marcha
//         Forçada (a vez volta ao zero). Na metade a Lume canta a valsa certa e a banda perde o compasso (fica fraca a
//         luz e mais lenta). Escala com o capítulo em que for feita.
//  - FIM: no Coreto, o baú desenha a Runa do Rosto com as três lembranças. O Seu Valdir vira gente (de noite e de dia);
//    o casco fica, de calço, segurando o coreto. Recompensas: a Lume aprende a VALSA DO CORETO (cantiga, 20 PM: o grupo
//    dança: o próximo golpe em cada um sai 70% mais fraco, e todos adiantam a vez), 2 Frascos Grandes e 150 cobres.
// Flags: vmIni, vmFoto, vmSorriso, vmOlhar, valdirHumano. Mapa: pracaVazia (KEY7, tiles do Andar 1).

// ---------- a rachadura no Andar 1 ----------
if (typeof ROWS7 === 'object' && ROWS7.andar1 && ROWS7.andar1[12][2] === 'R') ROWS7.andar1[12] = ROWS7.andar1[12].slice(0, 2) + 'm' + ROWS7.andar1[12].slice(3);
const vmAtiva = () => !!(G.flags && G.flags.vmIni && !G.flags.valdirHumano);
const ROWS_PV = [
  'RRRRRRRRRRRRRRRRRRRRRRRR',
  'RRRRRRRRRRmmmmRRRRRRRRRR',
  'RRRRRRmmmmmmmmmmmmRRRRRR',
  'RRRRmmmmmmmmmmmmmmmmRRRR',
  'RRRmmmmmmmmmmmmmmmmmmRRR',
  'RRRmmmmmmrrrrrrmmmmmmRRR',
  'RRmmmmmmrrrrrrrrmmmmmmRR',
  'RRmmmmmrrrrrrrrrrmmmmmRR',
  'RRmmmmmrrrrrrrrrrmmmmmRR',
  'RRmmmmmrrrrrrrrrrmmmmmRR',
  'RRmmmmmmrrrrrrrrmmmmmmRR',
  'RRRmmmmmmrrrrrrmmmmmmRRR',
  'RRRmmmmmmmmmmmmmmmmmmRRR',
  'RRRR~~~mmmmmmmmmmmmmRRRR',
  'RRRRR~~~mmmmmmmmmmmRRRRR',
  'RRRRRRRmmmmmmmmmmRRRRRRR',
  'RRRRRRRRRRRmmRRRRRRRRRRR',
  'RRRRRRRRRRRmmRRRRRRRRRRR'];

// ---------- arte ----------
const VM_C = {};
function fendaArt() { const k = 'fenda' + (Math.floor(W2.t / 12) % 3); if (VM_C[k]) return VM_C[k]; const P = new Pix(16, 30); for (let y = 0; y < 30; y++) { const w = Math.max(1, Math.round(4 * Math.sin(Math.PI * (y + 1) / 31))); for (let x = 8 - w; x < 8 + w; x++) P.p(x + Math.round(Math.sin(y / 4) * 2), y, Math.abs(x - 7.5) < w - 1 ? '#0a0408' : '#c8902a'); } const f = Math.floor(W2.t / 12) % 3; P.p(7, 8 + f * 6, '#ffe066'); P.p(8, 20 - f * 4, '#fff6c8'); return VM_C[k] = P.canvas(); }
const marcaCoretoArt = () => VM_C.marca || (VM_C.marca = (() => {
  const P = new Pix(128, 84);
  for (let a = 0; a < 8; a++) { const an = a / 8 * Math.PI * 2, x = 64 + Math.cos(an) * 52, y = 46 + Math.sin(an) * 30; P.cyl(Math.round(x) - 3, Math.round(y) - 8 - (a % 3) * 3, 6, 10 + (a % 3) * 3, ramp('#c8c0b0')); P.rect(Math.round(x) - 4, Math.round(y) + 2, 8, 3, '#6a5a52'); }
  for (let i = 0; i < 60; i++) { const an = i / 60 * Math.PI * 2; P.p(64 + Math.cos(an) * 56, 48 + Math.sin(an) * 33, i % 3 ? '#8a7a6a' : '#a89a88'); }
  P.rect(60, 44, 3, 3, '#ffd070'); P.p(61, 45, '#ffffff');
  return P.outline().canvas();
})());
function centroMarcaArt() { if (!(G.flags.vmFoto && G.flags.vmSorriso) || G.flags.vmOlhar) return EMPTY_C; const f = Math.floor(W2.t / 6) % 4, k = 'cm' + f; if (VM_C[k]) return VM_C[k]; const P = new Pix(40, 24); for (let r = 6; r < 18; r += 4) for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2 + f * 0.2; P.p(20 + Math.cos(an) * r, 12 + Math.sin(an) * r * 0.55, (i + f) % 3 ? '#8fe3ff' : '#ffffff'); } return VM_C[k] = P.canvas(); }
const estantePartArt = (caida) => VM_C['ep' + caida] || (VM_C['ep' + caida] = (() => {
  const P = new Pix(22, 34);
  if (caida) { P.line(2, 30, 18, 24, '#3a3440', 2); P.rect(12, 20, 9, 6, '#e8e0c8'); for (let i = 0; i < 3; i++) P.rect(13, 21 + i * 2, 7, 1, '#5a5048'); }
  else { P.rect(10, 12, 2, 20, '#3a3440'); P.line(5, 32, 10, 28, '#3a3440'); P.line(16, 32, 11, 28, '#3a3440'); P.rect(3, 2, 16, 11, '#e8e0c8'); P.rect(3, 12, 16, 1, '#3a3440'); for (let i = 0; i < 4; i++) P.rect(5, 4 + i * 2, 12, 1, '#5a5048'); P.p(8, 5, '#2a2018'); P.p(13, 7, '#2a2018'); }
  return P.outline().canvas();
})());
const bumboArt = () => VM_C.bumbo || (VM_C.bumbo = (() => { const P = new Pix(26, 26); P.ball(13, 13, 11, 11, ramp('#e8e0d0')); P.ball(13, 13, 7, 7, ramp('#b84a3a')); P.rect(2, 12, 22, 2, '#d8b050'); P.line(4, 4, 22, 22, '#5a4a3a'); return P.outline().canvas(); })());
// A BANDA FANTASMA: um eco translúcido de músico de banda, de quepe, com a tuba enrolada no corpo e o bumbo na frente
function bandaFArt(f, est, ph) {
  const k = 'bf' + (f % 4) + est + ph; if (VM_C[k]) return VM_C[k];
  const P = new Pix(110, 120), G1 = ph >= 2 ? ramp('#8a9ac8') : ramp('#7ad0e0'), Ou = ramp('#d8b050'), Q = ramp('#2a3a6a');
  const by = Math.round(Math.sin(f / 4 * Math.PI * 2) * 2), carga = est === 'carga';
  // rabo de fantasma
  for (let y = 70; y < 116; y++) { const w = 26 - (y - 70) * 0.4 + Math.sin(y / 5 + f) * 3; for (let x = Math.round(55 - w); x < 55 + w; x++) if ((x + y + f) % 7 || y < 96) P.p(x, y + by, P.tone(G1, 0.55 - (y - 70) / 90, x, y)); }
  // corpo e farda
  P.ball(55, 58 + by, 26, 22, G1, { amb: 0.35 });
  for (let y = 44; y < 76; y++) for (let x = 38; x < 72; x++) if (Math.hypot((x - 55) / 17, (y - 60) / 16) < 1) P.p(x, y + by, P.tone(Q, 0.55 - (y - 44) / 60, x, y));
  for (let i = 0; i < 4; i++) P.rect(54, 48 + i * 6 + by, 3, 2, Ou[3]);
  // cabeça e quepe
  P.ball(55, 30 + by, 13, 13, G1, { amb: 0.4 });
  P.rect(41, 16 + by, 28, 7, Q[2]); P.rect(41, 16 + by, 28, 2, Q[3]); P.rect(38, 23 + by, 34, 3, Q[0]); P.rect(53, 17 + by, 4, 4, Ou[3]);
  const olho = carga ? '#ffffff' : '#1a2a3a';
  P.rect(48, 30 + by, 4, 3, olho); P.rect(59, 30 + by, 4, 3, olho);
  P.rect(51, 38 + by, 9, 2, '#1a2a3a');
  // tuba
  for (let a = 0; a < 40; a++) { const an = a / 40 * Math.PI * 1.6 - 0.6, r = 22; P.rect(Math.round(30 + Math.cos(an) * r), Math.round(56 + Math.sin(an) * r * 0.9) + by, 4, 4, P.tone(Ou, 0.7 - a / 80, a, 0)); }
  P.ball(20, 36 + by, 11, 9, Ou, { amb: 0.4 }); P.ball(20, 36 + by, 7, 5, ramp('#3a2a10'));
  // bumbo
  P.ball(82, 84 + by, 16, 16, ramp('#e8e0d0'), { amb: 0.5 }); P.ball(82, 84 + by, 11, 11, ramp(carga ? '#ff6a4a' : '#b84a3a')); P.rect(66, 83 + by, 32, 2, Ou[3]);
  // notas soltas
  for (let i = 0; i < 4; i++) { const x = 10 + ((i * 29 + f * 7) % 90), y = 10 + ((i * 17 + f * 5) % 40); P.rect(x, y, 2, 2, ph >= 2 ? '#c8a0ff' : '#ffffff'); P.rect(x + 1, y - 5, 1, 5, ph >= 2 ? '#c8a0ff' : '#ffffff'); }
  return VM_C[k] = P.outline().canvas();
}
function bgPracaVazia() {
  if (VM_C.bg) return VM_C.bg;
  const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 84 ? (((x >> 3) + (y >> 3)) % 5 === 0 ? '#2a2228' : '#1e1820') : P.tone(ramp('#5a4c46'), 0.5 - (y - 84) / 200 + ((hash(x >> 2, y >> 2, 3) % 5) - 2) * 0.04, x, y));
  for (let a = 0; a < 7; a++) { const x = 30 + a * 30, h = 20 + (a % 3) * 8; P.cyl(x, 84 - h, 6, h, ramp('#c8c0b0')); }
  for (let i = 0; i < 30; i++) P.p(hash(i, 2, 9) % 240, hash(i, 5, 9) % 80, '#c8902a');
  return VM_C.bg = P.canvas();
}

// ---------- o chefe ----------
Object.assign(ENEMY2, {
  bandaF: { name: 'A Banda Fantasma', kind: 'bandaF', boss: true, mhp: 5600, atk: 46, def: 16, mdef: 16, spd: 11, shield: 8, maxShield: 8, weak: ['mordida', 'luz'], ai: 'bandaF', h: 116, cobres: 160, ph: 1,
    frame: u => bandaFArt(Math.floor(BT.t / 8), u.armando ? 'carga' : '', u.ph || 1), dieCols: ['#7ad0e0', '#d8b050', '#ffffff'], cancelTxt: 'A banda perdeu a entrada! O fortíssimo não veio!' }
});
if (typeof FICHA === 'object') FICHA.bandaF = 'A Banda Fantasma: o eco da banda do coreto, que não sabe parar. FORTÍSSIMO a cada 4 vezes (quebre o escudo!). Pratos pegam todos; Marcha Forçada zera a vez. Mordida e luz.';
Object.assign(AI2, {
  async bandaF(e) {
    if (e.charge) {
      e.charge = null; e.armando = false; callout('FORTÍSSIMO!', '#ffffff', 70); sfx('crit'); bshake(24, 4); flashW(3);
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.2 : 1.35, { n: 28, noCounter: true, longe: true });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A banda inteira respira fundo... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); return; }
    const t = foeTarget(); if (!t) return;
    const r0 = Math.random();
    if (r0 < 0.3) { callout('Pratos', '#ffe066', 40); for (const m of alive(BT.party)) await foeStrike(e, m, 0.7, { n: 22, noCounter: true, longe: true }); return; }
    if (r0 < 0.55) { callout('Marcha Forçada', '#8fe3ff', 40); const r = await foeStrike(e, t, 0.8, { n: 24, longe: true }); if (r !== 'perfeito' && t.hp > 0) { t.ct = 0; const [x, y] = unitCenter(t); popNum(x, y - 26, 'FORA DO PASSO', '#8fe3ff'); } return; }
    callout('Tuba', '#d8b050', 30); await foeLunge(e, t, 14, 16); await foeStrike(e, t, 1.25, { n: 26 }); await foeBack(e);
  }
});
function fasesBanda() { return [{ at: 0.5, run: async (e) => {
  await say('* A banda erra uma entrada. Depois outra. Ela está tocando a valsa, mas a valsa errada: rápida demais, alta demais, como quem tem medo de parar.');
  await say('Não é assim. É devagar. Um, dois, três. Eles dançavam devagar.', 'lume');
  await say('* A Lume canta a Valsa do Coreto do jeito certo. Os músicos fantasmas param, um por um, para escutar. O bumbo perde o compasso.');
  e.ph = 2; e.weak = ['mordida', 'luz', 'gelo']; e.spd = 9; e.known = {};
} }]; }

// ---------- o mapa da Praça Vazia ----------
{ const _mmV = montarMapas2; montarMapas2 = function () {
  const r = _mmV.apply(this, arguments);
  try {
    const A = MAPS2.andar1;
    if (A && !A._vm) {
      A._vm = true;
      A.props.push({ img: () => vmAtiva() || G.flags.valdirHumano ? gradeHLD(fendaArt()) : EMPTY_C, x: 1.55, y: 13, by: 12 * TS });
      A.ents.push({ t: 'trig', x: 2, y: 12, w: 1, h: 1, passa: true, gone: () => !(vmAtiva() || G.flags.valdirHumano), run: async () => { W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('pracaVazia', 11, 16, 'up'); await fadeIn(12); if (MAPS2.pracaVazia.onEnter) await MAPS2.pracaVazia.onEnter(); } });
      A.ents.push({ t: 'sign', x: 2, y: 12, h: 20, gone: () => vmAtiva() || !!G.flags.valdirHumano, talk: () => say('* Um vão na parede de pedra. Úmido, raso. Não leva a lugar nenhum. Ainda.') });
    }
    MAPS2.pracaVazia = { rows: ROWS_PV, key: KEY7, name: 'A Masmorra · A Praça Vazia', music: 'andar1', batBg: bgPracaVazia, bg: '#0a120c', semCeu: true, dark: 'rgba(6,12,8,0.30)', lights: [[12, 8, 90], [4, 12, 50], [19, 6, 60], [11, 15, 50]],
      props: [
        { img: marcaCoretoArt, x: 8, y: 11.3, by: 2 * TS },
        { img: centroMarcaArt, x: 10.75, y: 9.2, by: 3 * TS },
        { img: () => estantePartArt(false), x: 18.65, y: 6.05, solid: [[19, 5, 1, 1]] },
        { img: () => estantePartArt(true), x: 4.6, y: 6, by: 5 * TS },
        { img: () => estantePartArt(true), x: 15.4, y: 13, by: 12 * TS },
        { img: bumboArt, x: 6.2, y: 4.1, solid: [[6, 3, 2, 1]] }
      ],
      ents: [
        { t: 'trig', x: 11, y: 17, w: 1, h: 1, passa: true, run: voltaAndar1 }, { t: 'trig', x: 12, y: 17, w: 1, h: 1, passa: true, run: voltaAndar1 },
        inimigo('pvFoto', 'ratoVelaA', 5, 11, ['ratoVelaA', 'cogumeloA', 'ratoVelaA'], { spr: (t, d) => { const c = ratoVelaAArt(Math.floor(t / 8) % 2); return d === 'left' ? flipC(c) : c; }, h: 22, bg: bgPracaVazia, after: achouFoto, gone: () => !vmAtiva() }),
        inimigo('pvM', 'morcegoSelo', 17, 3, ['morcegoSelo', 'morcegoSelo', 'cogumeloA'], { spr: (t) => morcegoSeloArt(Math.floor(t / 6) % 2), h: 22, bg: bgPracaVazia }),
        { t: 'sign', x: 19, y: 5, h: 34, talk: chamadaBanda },
        { t: 'sign', x: 6, y: 3, h: 26, talk: () => say('* Um bumbo de banda, rasgado. Na pele, escrito a caneta: "BANDA MUNICIPAL DE VELHÁGUA". E menor, outra letra: "tocamos até o fim".') },
        { t: 'sign', x: 4, y: 13, h: 16, talk: () => say('* O lago raso da praça. Na água, de relance, o reflexo de um coreto que não está mais aqui.') },
        ...[[11, 8], [12, 8]].map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, gone: () => !vmAtiva() || !!G.flags.vmOlhar, run: lutaBanda }))
      ],
      onEnter: async () => {
        if (G.flags.vmPraca) return; G.flags.vmPraca = true;
        await say('* Do outro lado da rachadura, uma praça. Uma praça DENTRO da masmorra: lampiões apagados, estantes de partitura caídas, um bumbo rasgado. E no meio, uma marca redonda no chão, com oito tocos de coluna.');
        await say('O lugar do coreto. Ele ficou vazio quando o coreto foi morar com a gente.', 'lume');
        await say('[Leitura: três lembranças do rosto do Seu Valdir estão espalhadas por aqui. A masmorra guarda o que as pessoas esquecem. A FOTO, o SORRISO e o OLHAR.]', 'cat');
        await say('Então a gente pega de volta. Uma por uma.', 'rita');
      }
    };
    for (const p of MAPS2.pracaVazia.props) { const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; }
    if (typeof REGIAO_DE === 'object') REGIAO_DE.pracaVazia = 'origem';
  } catch (e) { console.error('valdir', e); }
  return r;
}; }
async function voltaAndar1() { W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('andar1', 3, 12, 'right'); await fadeIn(12); }

// 1) a foto
async function achouFoto() {
  if (G.flags.vmFoto) return;
  G.flags.vmFoto = true; sfx('item');
  await say('* No meio do que sobrou dos bichos, uma fotinha 3x4, amarelada, de documento. Um homem de bigode fino, cabelo penteado com água, sorrindo de canto.');
  await say('* Atrás, a caneta: "Valdir Souza. Para a Marlene não esquecer a minha cara quando eu for pro quartel. 1969."');
  await say('{y}Lembrança do rosto: A FOTO{/} (1 de 3).', 'n');
  vmAviso();
}
// 2) o sorriso: a chamada
async function chamadaBanda() {
  if (G.flags.vmSorriso || !vmAtiva()) { await say('* Uma estante de partitura em pé. A folha tem uma lista de nomes, como uma chamada de escola. Todos riscados com carinho.'); return; }
  await say('* Uma estante de partitura em pé. Na folha, em vez de música, uma lista. Uma CHAMADA. A letra é de professora.');
  await say('[É um eco. A masmorra copiou a Chamada da Profª Neide, do jogo de vocês lá embaixo. Errar chama alguém.]', 'cat');
  const P = [['Chamada! Banco do Seu Valdir Souza, no 31?', ['3', '4', '9'], 1], ['Banco da Dona Marlene, ao lado dele?', ['5', '7', '15'], 0], ['E o ano riscado no banco da praça, ao lado do "V + M"?', ['1969', '1972', '1980'], 1]];
  for (const [p, ops, ok] of P) {
    const r = await choose(p, ops, 'neide');
    if (r !== ok) {
      await say('* A folha rasga sozinha. De cima das colunas quebradas, morcegos com selo descem gritando.');
      const res = await lutaMapa(['morcegoSelo', 'morcegoSelo'], { bg: bgPracaVazia, semSurpresa: true });
      if (res === 'win') await say('* A folha da chamada se refaz em silêncio, igual antes. Dá para tentar de novo.');
      return;
    }
  }
  G.flags.vmSorriso = true; sfx('item');
  await say('* Presente. Presente. Presente. A folha dobra sozinha e, de dentro, cai uma coisa leve: o desenho de um sorriso, feito a lápis, de canto, igual ao da foto.');
  await say('* Embaixo do desenho: "a cara que ele fazia quando eu errava o passo". Letra da Marlene.');
  await say('{y}Lembrança do rosto: O SORRISO{/} (2 de 3).', 'n');
  vmAviso();
}
function vmAviso() { if (G.flags.vmFoto && G.flags.vmSorriso && !G.flags.vmOlhar) run2(async () => { await say('* No meio da marca do coreto, o chão acende em anéis, azul-claro. Ao longe, alguém afina uma tuba.'); }); save2(); }
// 3) o olhar: a Banda Fantasma
async function lutaBanda() {
  if (!(G.flags.vmFoto && G.flags.vmSorriso)) { await say('* O centro da marca do coreto. Frio. Falta alguma coisa aqui. (Ache a FOTO e o SORRISO antes.)'); W2.mv = null; return; }
  W2.mv = null;
  await say('* Você pisa no meio da marca. Os oito tocos de coluna acendem. E, de lugar nenhum, uma banda inteira começa a tocar: tuba, bumbo, pratos. Músicos de névoa, de quepe, sem rosto.');
  await say('* Eles tocam a valsa do coreto. Rápido demais. Alto demais. Eles não sabem parar. Ninguém nunca disse que podiam.');
  const c = capAtual(), esc = 1 + Math.max(0, c - 7) * 0.12;
  const r = await lutaMapa(['bandaF'], { bg: bgPracaVazia, music: 'boss', pos: [[184, 152]], intro: async () => { const e = BT.foes[0]; e.mhp = e.hp = Math.round(e.mhp * esc); e.atk = Math.round(e.atk * (1 + (esc - 1) * 0.8)); e.phases = fasesBanda(); e.ct = 14; callout('A BANDA FANTASMA', '#7ad0e0', 90); } });
  if (r !== 'win') return;
  G.flags.vmOlhar = true; playMusic('valsa');
  await say('* A banda para. Pela primeira vez em muito tempo, para. Os músicos de névoa abaixam os instrumentos e olham uns para os outros, aliviados.');
  await say('* O da tuba tira o quepe. Dentro, guardado, um brilho azul-claro: o jeito como um homem de bigode fino olhava para a mulher dele enquanto ela dançava. A banda viu esse olhar todo sábado, por cinquenta anos.');
  await say('{y}Lembrança do rosto: O OLHAR{/} (3 de 3). Voltem ao Coreto.', 'n');
  await say('Diz pra ele que a banda tocou até o fim.', 'lume');
  save2();
}

// ---------- no Coreto: começo e fim ----------
{ const _fvV = falaValdir; falaValdir = async function () {
  if (G.flags.valdirHumano) return falaValdirHumano();
  if (!G.flags.vmIni && coretoVeio()) {
    const c = await choose('...Moço... baú... posso pedir... uma coisa...?', ['Pode pedir', 'Depois, Seu Valdir'], 'valdir', 1);
    if (c === 0) return comecaMissaoValdir();
  }
  if (G.flags.vmFoto && G.flags.vmSorriso && G.flags.vmOlhar) return ritualValdir();
  return _fvV.apply(this, arguments);
}; }
async function comecaMissaoValdir() {
  await say('...Eu queria... dançar com ela... de pé... Com dois pés... Jabuti não dança... jabuti... balança...', 'valdir');
  await say('Ah, Valdir. Eu danço com você de qualquer jeito. Mas... eu sinto falta da sua mão nas minhas costas.', 'marlene');
  await say('[A Runa do Rosto. A mesma que deu um rosto a você. Ela pode dar um corpo ao Seu Valdir. Mas precisa do rosto DELE, lembrado por ele, não pelos outros.]', 'cat');
  await say('...Eu não lembro... da minha cara... Eu virei praça... Praça não tem cara...', 'valdir');
  await say('[Leitura: quando o coreto atravessou o Vão, o lugar dele na masmorra ficou vazio. A masmorra empurrou o buraco para cima, até o ANDAR 1. Lá, onde você acordou, abriu uma rachadura. O rosto dele ficou lá embaixo.]', 'cat');
  await say('O Andar 1. O primeiro lugar. ...Eu sei o caminho de cor.', 'me');
  G.flags.vmIni = true; save2();
  await say(G.flags.c7Andar1 ? '[MISSÃO: Dois Pés para a Valsa. Desçam ao Andar 1 da masmorra (Marco do Andar 1, ou pelo Coração) e procurem a rachadura na sala do lago.]' : '[MISSÃO: Dois Pés para a Valsa. O caminho até o Andar 1 da masmorra passa pela Mina de Origem. Quando chegarem lá, procurem a rachadura na sala do lago.]', 'cat');
}
async function ritualValdir() {
  await say('* Vocês colocam as três lembranças no chão do coreto: a foto, o desenho do sorriso e o brilho azul do olhar. A Dona Marlene segura a foto com as duas mãos e não diz nada.');
  await say('Isso é... a minha cara... Eu era... bonito... A Marlene sempre disse... Eu achava que era... mentira dela...', 'valdir');
  await say('Era mentira. Você era bonito o bastante. Anda, mala. Faz a sua mágica.', 'marlene');
  playMusic('valsa'); await fadeOut(24);
  await cartao(['A Runa do Rosto', 'uma foto, um sorriso, um olhar']);
  await say('* Você abre a tampa. A tinta escorre da pena e desenha no ar a mesma runa que, um dia, desenhou o seu rosto. A foto, o sorriso e o olhar entram nela, um por um.');
  await say('* O jabuti suspira. O casco estala. De dentro dele, devagar, sai um homem: magro, de bigode fino ficando branco, cabelo penteado com água, um sorriso de canto. Descalço. Ele olha para os próprios pés por muito tempo.');
  G.flags.valdirHumano = true; G.flags.cant = G.flags.cant || {}; G.flags.cant.valsaC = true;
  G.items.frascoG = (G.items.frascoG || 0) + 2; G.cobres = (G.cobres || 0) + 150;
  V.scene = 'world'; loadMap2('coreto', 7, 9, 'up'); await fadeIn(24);
  await say('Marlene. ...Dois pés. Eu tenho dois pés.', 'valdir');
  await say('E dois pés esquerdos, como sempre. Vem cá, seu velho.', 'marlene');
  await say('* Eles dançam no coreto, em cima do casco que ficou de calço, segurando tudo. Devagar. Um, dois, três. A banda não está lá, mas dá para ouvir a valsa mesmo assim.');
  await say('Lume... a banda... tocou até o fim? Você disse... que ela tocou...', 'valdir');
  await say('Tocou. E parou quando podia parar. Igual vocês.', 'lume');
  sfx('rune');
  await say('[A Lume aprendeu a VALSA DO CORETO (cantiga, 20 PM): o grupo dança; o próximo golpe em cada um sai 70% mais fraco, e todos adiantam a vez.] [+2 Frascos Grandes, +150 cobres.]', 'cat');
  save2();
}
async function falaValdirHumano() {
  if ((G.flags.valsaDia ?? -1) !== cmdDia()) {
    const c = await choose('Baile? Agora eu tenho pé pra pisar no pé de todo mundo.', ['Dançar a valsa', 'Conversar', 'Nada'], 'valdir', 2);
    if (c === 0) { G.flags.valsaDia = cmdDia(); G.valsa = { n: 3 }; playMusic('valsa'); await fadeOut(16); await say('* O Seu Valdir conduz a Lume. A Dona Marlene conduz a Rita, que reclama e não erra um passo. Você gira sozinho, de tampa aberta, e ninguém acha estranho.'); await fadeIn(16); sfx('heal'); await say('[Valsa do Coreto: nas próximas 3 lutas, o grupo começa adiantado na vez.]', 'cat'); return; }
    if (c !== 1) return;
  }
  await say(pickOne(['Eu fui cabo do exército, sabia? Dois anos. Ela me mandava carta toda semana com um passo de dança desenhado.', 'O casco ficou ali, segurando o coreto. Eu durmo nele às vezes. Hábito de jabuti.', 'Obrigado, moço baú. Agora eu sei a minha cara. É a cara de quem foi muito feliz.', 'A Marlene pisa no meu pé desde 1972. Eu deixo. É o jeito dela de dizer que tá ali.']), 'valdir');
}

// ---------- o Valdir de gente no Coreto ----------
{ const _mmV2 = montarMapas2; montarMapas2 = function () {
  const r = _mmV2.apply(this, arguments);
  try {
    const C = MAPS2.coreto; if (C && !C._vh) {
      C._vh = true;
      if (!HUMS.valdirH) HUMS.valdirH = { h: 46, skin: '#d8a882', hair: '#e8e4e0', top: '#5a6a8a', bottom: '#3a3a48', acc: '#d8b050' };
      C.ents.push(Object.defineProperties({ t: 'npc', id: 'valdirH', x: 8, y: 8, h: 46, dir: 'down', spr: humSpr('valdirH'), talk: () => falaValdir() }, { gone: { value: () => !G.flags.valdirHumano } }));
      C.ents = C.ents.map(e => (e.t === 'sign' && e.y === 6 && e.talk === falaValdir) ? Object.assign(e, { talk: () => G.flags.valdirHumano ? say('* O casco do Seu Valdir, de calço, segurando o coreto. Morno. Ainda tem uma luzinha de varal piscando no buraco da cabeça.') : falaValdir() }) : e);
    }
  } catch (e) { console.error('valdirH', e); }
  return r;
}; }

// ---------- a cantiga nova da Lume ----------
Object.assign(RUNA2, {
  valsaC: { nm: 'Valsa do Coreto', mp: 20, tgt: 'self', d: 'Cantiga: o grupo dança. O próximo golpe em cada um sai 70% mais fraco, e todos adiantam a vez.', run: async (m) => {
    const k = await afinar(m); jingle('C6:4 E6:2 G6:2 E6:4 D6:4 B5:2 D6:2 C6:8', 200); await cantar(m, ['#7ad0e0', '#ffe066', '#ffffff'], 30);
    for (const u of alive(BT.party)) { const [x, y] = unitCenter(u); u.st.valsa = 1; u.ct = Math.min(99, (u.ct || 0) + 18 * k); popNum(x, y - 30, 'UM, DOIS, TRÊS', '#7ad0e0'); }
  } }
});
Object.assign(ST_NAME, { valsa: 'VALSA' });
{ const _fsV = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  if (t && t.st && t.st.valsa > 0 && t.side === 'p') { t.st.valsa = 0; pow *= 0.3; const [x, y] = unitCenter(t); popNum(x, y - 36, 'PASSO DE VALSA', '#7ad0e0'); }
  return _fsV(e, t, pow, o);
}; }
{ const _clV = cantLiberadas; cantLiberadas = function () { const L = _clV(); if (G.flags && G.flags.cant && G.flags.cant.valsaC && !L.includes('valsaC')) L.push('valsaC'); return L; }; }

// ---------- no diário de missões ----------
{ const _msV = missoes; missoes = function () {
  const L = _msV(), f = G.flags || {};
  if (f.vmIni && !f.valdirHumano) {
    let M;
    if (f.vmFoto && f.vmSorriso && f.vmOlhar) M = { tit: 'Dois Pés para a Valsa', desc: 'As três lembranças do rosto estão com vocês. Voltem ao Coreto (Ala Nova, dentro do baú) e falem com o Seu Valdir.', map: 'coreto', at: [7, 7] };
    else if (!f.c7Andar1) M = { tit: 'Dois Pés para a Valsa', desc: 'O rosto do Seu Valdir ficou no Andar 1 da masmorra. O caminho passa pela Mina de Origem (Capítulo 7).', map: 'coreto', at: [7, 7] };
    else M = { tit: 'Dois Pés para a Valsa', desc: 'Andar 1 da masmorra, rachadura na sala do lago: a Praça Vazia. Lembranças: ' + [f.vmFoto ? 'FOTO ok' : 'a FOTO (um bando carrega)', f.vmSorriso ? 'SORRISO ok' : 'o SORRISO (a chamada)', f.vmOlhar ? 'OLHAR ok' : 'o OLHAR (o meio da marca)'].join(', ') + '.', map: (W2.id === 'pracaVazia' ? 'pracaVazia' : 'andar1'), at: W2.id === 'pracaVazia' ? [12, 8] : [2, 12] };
    L.push(Object.assign({ tipo: 'side' }, M));
  }
  return L;
}; }
