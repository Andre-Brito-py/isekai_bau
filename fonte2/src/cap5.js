// ================= CAPÍTULO 5 — O CADERNO PRETO (Parte 1: A Cidade Alta e a Acendedoria) =================
// A página arrancada (Candeia) -> a letra é a mesma da LISTA DO DESCANSO -> a Dona Iolanda reconhece o PAPEL-LÍRIO: só a
// ACENDEDORIA compra (e ensina a RESSONÂNCIA) -> o BONDINHO (só de dia) sobe para a CIDADE ALTA -> o jardineiro perdeu
// a tesoura no LABIRINTO de sebes (só fala de dia) e dá a chave da ESTUFA -> na estufa: a AREIA dos vidreiros e as
// PLACAS DE PRESSÃO (vasos guardados no Vão) abrem o ALÇAPÃO -> de NOITE (de dia é expediente lá embaixo; e no jardim,
// os HOLOFOTES varrem) desce-se à ACENDEDORIA: Sala das Lentes (FEIXE e espelhos) -> Arquivo das Velas (acender, na
// ordem certa, as velas com nomes que o grupo conhece; uma está alta: a ESCADINHA) -> o VITRAL VIVO -> o ESCRITÓRIO:
// o caderno preto e o chá com o Acendedor-Mor (a cena mais difícil: a oferta à Lume) -> a fuga pelos TELHADOS (cap5b).
// SEGREDO: a conversa do chá só acontece dentro do jogo; fora dele, não explicar nada.
const CA5 = POS5.cidadeAlta, ES5 = POS5.estufa, LE5 = POS5.lentes, AR5 = POS5.arquivo, EC5 = POS5.escritorio, TE5 = POS5.telhados;
Object.assign(TRACKS, {
  cidadealta: { bpm: 84, bars: 8, chords: 'F Dm Bb C F Am Bb C', bass: 'root5', bassVol: 0.07,
    lead: 'A5:4 C6:2 A5:2 F5:8 | D6:4 C6:4 A5:8 | Bb5:4 A5:2 G5:2 F5:4 D5:4 | E5:8 G5:8 | A5:4 C6:2 A5:2 F6:8 | E6:4 C6:4 A5:8 | D6:4 C6:2 Bb5:2 A5:4 G5:4 | F5:16',
    leadWave: 'triangle', leadVol: 0.055, arp: { rate: 4, vol: 0.014, oct: 1 }, drums: 'k.......s.......', hatVol: 0.012 },
  acendedoria: { bpm: 72, bars: 4, chords: 'Am F E E', bass: 'oct8', bassVol: 0.09,
    lead: 'E5:2 .:2 A5:2 .:2 B5:4 C6:4 | A5:4 .:4 F5:4 .:4 | G#5:2 .:2 B5:2 .:2 E6:4 D6:4 | B5:8 G#5:8',
    leadWave: 'sine', leadVol: 0.06, arp: { rate: 2, vol: 0.012, oct: 1 }, drums: 'k...............', hatVol: 0.01 },
  cha: { bpm: 60, bars: 4, chords: 'C Em Am F', bass: 'root5', bassVol: 0.06,
    lead: 'G5:4 E5:4 C5:8 | B4:4 E5:4 G5:8 | A5:4 G5:4 E5:4 C5:4 | F5:8 E5:4 D5:4',
    leadWave: 'sine', leadVol: 0.05, arp: { rate: 4, vol: 0.01, oct: 1 }, drums: '', hatVol: 0 },
  telhados: { bpm: 132, bars: 4, chords: 'Em C D B', bass: 'oct8', bassVol: 0.1,
    lead: 'E5:2 G5:2 B5:2 E6:2 D6:2 B5:2 G5:4 | E5:2 G5:2 C6:2 E6:2 D6:4 C6:4 | D5:2 F#5:2 A5:2 D6:2 C6:2 A5:2 F#5:4 | B4:2 D#5:2 F#5:2 B5:2 A5:4 F#5:4',
    leadWave: 'square', leadVol: 0.045, arp: { rate: 2, vol: 0.012, oct: 0 }, drums: 'k...h.s.k.k.h.s.', hatVol: 0.025 }
});
Object.assign(HUMS, {
  benedito: { h: 46, skin: '#a8704a', hair: '#e8e4e0', top: '#4a6a3a', bottom: '#4a3a2a', hat: '#c8a060', apron: '#8a7a5a', beard: true },
  dama: { h: 48, skin: '#e8c8b0', hair: '#c8c0d0', hairStyle: 'coque', top: '#5a2a4a', coat: '#3a1a2a', bottom: '#5a2a4a', acc: '#e8e0f0' },
  quinzinho: { h: 34, skin: '#d8a078', hair: '#4a2a1a', top: '#e8c050', bottom: '#3a4a7a' },
  sorveteiro: { h: 47, skin: '#c8906a', hair: '#2a1a1a', top: '#f0f0f8', bottom: '#4a6aa8', hat: '#f0f0f8' },
  guardaRH: { h: 52, skin: '#d8a070', hair: '#2a1a1a', top: '#2a3a7a', coat: '#2a3a7a', bottom: '#1a1a2a', hat: '#2a3a7a', acc: '#c89a30' }
});
Object.assign(WHO, {
  benedito: { name: () => 'Seu Benedito', portrait: () => portHum('benedito'), voice: voz(260, 'blipLow'), col: '#d8f0c8' },
  dama: { name: () => 'Dona Hortênsia', portrait: () => portHum('dama'), voice: voz(560, 'blipTri'), col: '#f0d8f0' },
  quinzinho: { name: () => 'Quinzinho', portrait: () => portHum('quinzinho'), voice: voz(820), col: '#fff0c0' },
  sorveteiro: { name: () => 'Sorveteiro', portrait: () => portHum('sorveteiro'), voice: voz(480), col: '#e8f8ff' },
  guardaRH: { name: () => 'Guarda Real', portrait: () => portHum('guardaRH'), voice: voz(220, 'blipLow'), col: '#c8d0f0' }
});
Object.assign(EQ2, {
  monoculo: { nm: 'Monóculo do Conde', slot: 'amuleto', who: ['bau', 'lume', 'rita'], mod: { mag: 2, spd: 1 }, fx: [], preco: 0, d: 'Do falecido marido da Dona Hortênsia. +2 MAG, +1 VEL. Tudo fica com cara de documento importante.' }
});
const diaBondinho = () => { const h = hora(); return h >= 7 * 60 && h < 19 * 60; };
const vigiaSpr = (t, d) => { const f = vigiaArt(Math.floor(t / 14) % 2, false); return d === 'left' ? flipC(f) : f; };
const guardaSpr = (t, d) => { const f = guardaRealArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(f) : f; };

{ const _mm5 = montarMapas2; montarMapas2 = function () {
  _mm5.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== CIDADE ALTA =====
  MAPS2.cidadeAlta = { rows: ROWS5.cidadeAlta, key: KEY5, name: 'Auren · Cidade Alta', music: 'cidadealta', batBg: bgCidadeAlta, bg: '#1c2a4a', showMoney: true,
    stealth: true, holofotes: CA5.holofotes, grupoLuz: ['vigia', 'vigia'], reinicio: [CA5.marco[0], CA5.marco[1] + 1],
    props: [
      { img: acendedoriaArt, x: 18, y: 12 },
      { img: casa({ w: 8, stone: true, wall: '#d8d0e0', roof: '#4a4a7a', door: 3, doorC: '#3a2a3a', win: [0.5, 2.8, 5.8], signC: '#c89a30', wallH: 106 }), x: 2, y: 10 },
      { img: casa({ w: 6, stone: true, wall: '#e0c8c8', roof: '#7a3a4a', door: 2.2, win: [0.4, 4.2], chimney: true }), x: 10, y: 9 },
      { img: casa({ w: 8, stone: true, wall: '#d8d0e0', roof: '#3a5a6a', door: 3, doorC: '#3a2a3a', win: [0.5, 2.8, 5.8], awning: '#5a8ab8', wallH: 106 }), x: 40, y: 10 },
      { img: casa({ w: 7, stone: true, wall: '#e8dcc8', roof: '#5a3a6a', door: 2.6, win: [0.4, 5.2], chimney: true }), x: 48, y: 9 },
      ...[[0.4, 8], [16.4, 8], [38.4, 8], [54.6, 8]].map(([x, y], i) => ({ img: arvC(i + 1), x: x - 0.2, y })),
      { img: estufaArt, x: 36, y: 23 },
      { img: fonteEstatuaArt, x: 25, y: 22.2 },
      { img: bondinhoArt, x: 24.8, y: 41.6, by: 39 * TS },
      { img: () => diaBondinho() ? sorveteArt() : EMPTY_C, x: CA5.sorveteiro[0] - 1.6, y: CA5.sorveteiro[1] + 0.8 },
      ...CA5.postes.map(([x, y]) => ({ img: () => poste3Art(true, true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...CA5.arvores.map(([x, y], i) => ({ img: arvC(i + 2), x: x - 1.25, y: y + 1, solid: [[x, y, 1, 1]], arvore: true })),
      ...CA5.bancos.map(([x, y]) => ({ img: memo(bancoHArt), x: x - 0.5, y: y + 1 })),
      ...CA5.holofotes.map(([x, y]) => ({ img: () => poste3Art(ehNoite(), true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    ents: [
      ...CA5.bondinho.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: descerBondinho })),
      ...CA5.portao.map(([x, y]) => ({ t: 'sign', x, y: y - 1, h: 40, talk: portaoTorre })),
      ...CA5.guardas.map(([x, y], i) => morador('guardaRH', x, y, { rotina: rot([x, y, 'olhar', 9000, 'down']), talk: falaGuardaPortao })),
      marcoEnt(...CA5.marco),
      morador('benedito', ...CA5.jardineiro, { rotina: rot([21, 24, 'regar', 500, 'left'], [23, 26, 'limpar', 400, 'down'], [21, 23, 'olhar', 300, 'left']), gone: () => !diaBondinho(), talk: falaBenedito }),
      morador('dama', ...CA5.dama, { rotina: rot([12, 32, 'olhar', 600, 'down'], [14, 34, 'olhar', 400, 'right']), talk: falaDama }),
      morador('quinzinho', ...CA5.crianca, { rotina: rot([34, 33, 'brincar', 400, 'down'], [36, 34, 'brincar', 300, 'left']), gone: () => !diaBondinho(), talk: falaQuinzinho }),
      morador('sorveteiro', ...CA5.sorveteiro, { rotina: rot([20, 33, 'olhar', 9000, 'down']), gone: () => !diaBondinho(), talk: falaSorveteiro }),
      morador('pavio', ...CA5.pavio, { rotina: rot([30, 31, 'acender', 260, 'left'], [20, 31, 'acender', 260, 'up'], [37, 31, 'acender', 260, 'up']), passo: 20, gone: () => diaBondinho(), talk: async () => { await say(pickOne(['Boa noite. Eu acendo. É o que eu faço. Não me lembro de fazer outra coisa.', 'A Cidade Alta é a primeira a acender e a última a apagar. Ordem do Acendedor-Mor.']), 'pavio'); } }),
      ...CA5.vigias.map((v, i) => ({ t: 'ronda', id: 'vigiaCA' + i, x: v.at[0], y: v.at[1], path: v.path, h: 60, passo: 24, spr: vigiaSpr, dir: 'right', gone: () => !ehNoite(), talk: async () => { await say('* O Vigia de Vidro olha através de você. Literalmente: dá para ver o jardim pela barriga dele.'); } })),
      { t: 'sign', x: CA5.tesoura[0], y: CA5.tesoura[1], h: 12, gone: () => !!G.flags.c5Tesoura, spr: () => G.flags.c5Tesoura ? null : tesouraSpr(), talk: pegarTesoura },
      ...CA5.estufaDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: entrarEstufa })),
      { t: 'sign', x: CA5.estatua[0], y: CA5.estatua[1], h: 60, talk: async () => { await say('* Na base da estátua, letras de bronze: "AO ACENDEDOR-MOR, QUE DEVOLVEU A LUZ À CIDADE. DEPOIS DO INVERNO ESCURO, NUNCA MAIS."'); await say('"Nunca mais." Ele gosta dessa frase.', 'rita'); } },
      { t: 'sign', x: CA5.mirante[0], y: CA5.mirante[1], h: 30, talk: mirante5 },
      { t: 'sign', x: CA5.placaTorre[0], y: CA5.placaTorre[1], h: 40, talk: async () => { await say('* "ACENDEDORIA REAL. Expediente: 7h às 19h. Fora do expediente, a casa é guardada pela luz."'); } },
      bauEnt('cidadeAlta', 'lab', ...CA5.bauLab, async () => { await dar('tinta', 2); await dar('cobres', 60); }),
      bauEnt('cidadeAlta', 'a', ...CA5.bau, () => dar('frasco', 1))
    ],
    onEnter: async () => { if (!G.flags.c5Alta) await chegaCidadeAlta(); }
  };
  // ===== ESTUFA DOS VIDREIROS =====
  MAPS2.estufa = { rows: ROWS5.estufa, key: KEY5, name: 'Estufa dos Vidreiros', music: 'cidadealta', batBg: bgCidadeAlta, bg: '#0e1a14', tint: 'rgba(90,180,140,0.06)',
    moveis: ES5.vasos.map(([x, y], i) => ({ id: 'vaso' + i, k: 'vaso', x, y, var: i })), placas: ES5.placas, placasFlag: 'c5Alcapao', onPlacas: placasEstufa,
    props: [
      { img: () => alcapaoArt(!!G.flags.c5Alcapao), x: ES5.alcapao[0] - 0.5, y: ES5.alcapao[1] + 1 },
      { img: memo(mesaAreiaArt), x: ES5.areia[0] - 1, y: ES5.areia[1] + 1, solid: [[ES5.areia[0] - 1, ES5.areia[1], 3, 1]] },
      ...ES5.plantas.map(([x, y], i) => ({ img: () => vasoMovelArt(i), x, y: y + 1 }))
    ],
    ents: [
      ...ES5.door.map(([x, y]) => porta(x, y, 'cidadeAlta', ...CA5.estufaOut, 'down')),
      { t: 'sign', x: ES5.alcapao[0], y: ES5.alcapao[1], h: 10, talk: alcapao },
      { t: 'sign', x: ES5.areia[0], y: ES5.areia[1] + 1, h: 20, talk: mesaAreia },
      inimigo('mv1', 'mvidro', ...ES5.mariposas, ['mvidro', 'mvidro'], { spr: (t) => mariposaVidroArt(Math.floor(t / 6) % 2), h: 30, bg: bgCidadeAlta })
    ],
    onEnter: async () => { if (!G.flags.c5Estufa) { G.flags.c5Estufa = true; await say('* Lá dentro, o ar é quente e molhado. Plantas de folha enorme, vidro por todo lado, e um cheiro de terra que a Cidade Alta não tem em nenhum outro canto.'); await say('No chão, três placas de bronze. E um alçapão trancado no meio, com uma fechadura que não tem buraco de chave.', 'rita'); await say('[As placas afundam com peso. O alçapão parece ligado a elas.]', 'cat'); await say('Peso eu tenho. Por dentro. Por fora eu sou leve que nem uma promessa.', 'me'); } }
  };
  // ===== ACENDEDORIA 1: SALA DAS LENTES =====
  const portaVidro = (pos, flag) => pos.map(([x, y], i) => i === 0 ? { img: () => portaVidroArt(!!G.flags[flag]), x, y: y + 1, get solid() { return G.flags[flag] ? [] : [[pos[0][0], pos[0][1], pos.length, 1]]; } } : null).filter(Boolean);
  MAPS2.lentes = { rows: ROWS5.lentes, key: KEY5, name: 'Acendedoria · Sala das Lentes', music: 'acendedoria', batBg: bgTorre, bg: '#0a1420',
    feixe: { emissor: LE5.emissor, alvo: LE5.alvo, alarme: LE5.alarme, flag: 'c5Porta1' }, grupoLuz: ['vigia', 'vigia'], reinicio: LE5.entra,
    moveis: [...LE5.espelhos.map(([x, y, o], i) => ({ id: 'esp' + i, k: 'espelho', x, y, o })), { id: 'espM', k: 'espelho', x: LE5.movel.espelho[0], y: LE5.movel.espelho[1], o: '/' }, { id: 'cx', k: 'caixa', x: LE5.movel.caixa[0], y: LE5.movel.caixa[1] }],
    props: [
      { img: emissorArt, x: LE5.emissor[0] - 0.05, y: LE5.emissor[1] + 1, solid: [[LE5.emissor[0], LE5.emissor[1], 1, 1]] },
      { img: () => cristalArt('b', !!G.flags.c5Porta1 || (W2.feixe && W2.feixe.fim === 'alvo')), x: LE5.alvo[0] - 0.05, y: LE5.alvo[1] + 1, solid: [[LE5.alvo[0], LE5.alvo[1], 1, 1]] },
      { img: () => cristalArt('r', W2.feixe && W2.feixe.fim === 'alarme'), x: LE5.alarme[0] - 0.05, y: LE5.alarme[1] + 1, solid: [[LE5.alarme[0], LE5.alarme[1], 1, 1]] },
      ...portaVidro(LE5.porta, 'c5Porta1')
    ],
    ents: [
      { t: 'trig', x: LE5.entra[0], y: LE5.entra[1] + 1, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('estufa', ES5.alcapao[0], ES5.alcapao[1] + 1, 'down'); await fadeIn(10); } },
      ...LE5.subida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('arquivo', ...AR5.entra, 'up'); await fadeIn(10); if (MAPS2.arquivo.onEnter) await MAPS2.arquivo.onEnter(); } })),
      { t: 'sign', x: LE5.emissor[0] + 1, y: LE5.emissor[1] - 1, h: 30, talk: async () => { await say('* Uma lente de farol, pequena, presa no chão. Lança um fio de luz que não esfria nunca.'); await say('[O feixe segue reto. Espelhos desviam. Caixote, vaso e você BLOQUEIAM. Azul abre. Vermelho chama os Vigias.]', 'cat'); } }
    ],
    onEnter: async () => { if (!G.flags.c5Lentes) await chegaLentes(); }
  };
  // ===== ACENDEDORIA 2: ARQUIVO DAS VELAS =====
  const est = []; for (let y = 0; y < ROWS5.arquivo.length; y++) { let x0 = -1; const r = ROWS5.arquivo[y]; for (let x = 0; x <= r.length; x++) { const ehX = x < r.length && r[x] === 'X'; if (ehX && x0 < 0) x0 = x; if (!ehX && x0 >= 0) { est.push([x0, y, x - x0]); x0 = -1; } } }
  MAPS2.arquivo = { rows: ROWS5.arquivo, key: KEY5, name: 'Acendedoria · Arquivo das Velas', music: 'acendedoria', batBg: bgTorre, bg: '#0a0c14', tint: 'rgba(255,200,120,0.05)',
    moveis: [{ id: 'escadinha', k: 'escadinha', x: AR5.escadinha[0], y: AR5.escadinha[1] }],
    props: [
      ...est.map(([x, y, w]) => ({ img: () => estanteVelasArt(w), x, y: y + 1 })),
      ...AR5.velas.map(([x, y, nm]) => ({ img: () => velaNomeArt(velaAcesa(nm)), x: x + 0.2, y: y + 0.3, by: (y + 1) * TS + 1 })),
      ...portaVidro(AR5.porta, 'c5Velas'),
      { img: memo(mesaArt), x: AR5.nota[0] - 1, y: AR5.nota[1] + 0.2, by: (AR5.nota[1] - 0.5) * TS }
    ],
    ents: [
      ...AR5.descida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { W2.mv = null; sfx('door'); await fadeOut(10); loadMap2('lentes', LE5.subida[0][0], LE5.subida[0][1] + 2, 'down'); await fadeIn(10); } })),
      ...AR5.velas.map(([x, y, nm]) => ({ t: 'sign', x, y, h: 10, talk: () => falaVelaNome(nm, x, y) })),
      { t: 'sign', x: AR5.nota[0], y: AR5.nota[1] - 1, h: 20, talk: notaArquivo },
      ...AR5.vitral.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: lutaVitral })),
      ...AR5.subida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { if (!G.flags.c5Vitral) return; W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('escritorio', ...EC5.entra, 'up'); await fadeIn(12); if (MAPS2.escritorio.onEnter) await MAPS2.escritorio.onEnter(); } }))
    ],
    onEnter: async () => { if (!G.flags.c5Arquivo) await chegaArquivo(); }
  };
  // ===== ACENDEDORIA 3: O ESCRITÓRIO =====
  MAPS2.escritorio = { rows: ROWS5.escritorio, key: KEY5, name: 'Acendedoria · O Escritório', music: 'cha', bg: '#0a0810', tint: 'rgba(255,200,140,0.05)',
    props: [
      { img: mesaEscritorioArt, x: 6.9, y: 5.4, solid: [[7, 4, 4, 1]] },
      ...EC5.janela.map(([x, y]) => ({ img: janelaCidadeArt, x: x - 1, y: y + 1, by: 2 * TS })),
      { img: memo(() => estanteArt(2)), x: EC5.estante[0], y: EC5.estante[1] + 1, solid: [[EC5.estante[0], EC5.estante[1], 2, 1]] },
      { img: memo(() => estanteArt(2)), x: 14, y: 4, solid: [[14, 3, 2, 1]] },
      { img: () => G.flags.c5Cha ? EMPTY_C : null, x: 0, y: 0 }
    ],
    ents: [
      { t: 'sign', x: EC5.caderno[0], y: EC5.caderno[1], h: 20, talk: lerCaderno },
      ...EC5.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { if (!G.flags.c5Cha) { await say('Não. A gente veio pelo caderno. Eu não saio sem ver.', 'lume'); W2.mv = null; return; } await irParaTelhados(); } }))
    ],
    onEnter: async () => { if (!G.flags.c5Escritorio) { G.flags.c5Escritorio = true; await say('* O escritório é pequeno. Tapete gasto, duas estantes, uma janela enorme com a cidade inteira acesa lá embaixo. Cheiro de chá e de fuligem.'); await say('* Na mesa, debaixo de uma lâmpada verde, um caderno de capa preta, com uma fita vermelha marcando a página.'); await say('É ele. É ele mesmo.', 'lume'); } }
  };
  for (const id of ['cidadeAlta', 'estufa', 'lentes', 'arquivo', 'escritorio']) grade(MAPS2[id]);
  // o bondinho no Largo do Hospital (lado leste)
  const lg = MAPS2.largo; if (lg && !lg._bond) { lg._bond = true;
    for (const y of [15, 16]) lg.ents.push({ t: 'trig', x: 45, y, w: 1, h: 1, passa: true, run: subirBondinho });
    lg.ents.push({ t: 'sign', x: 44, y: 13, h: 40, talk: async () => { await say('* "BONDINHO DA CIDADE ALTA. Partidas das 7h às 19h. Proibido baús desacompanhados." Alguém riscou "desacompanhados" e escreveu "com dentes".'); } });
  }
}; }
const mesaAreiaArt = () => { const P = new Pix(50, 30), M = ramp('#6a4a2a'); P.rect(0, 10, 50, 6, M[3]); P.rect(2, 16, 4, 14, M[1]); P.rect(44, 16, 4, 14, M[1]); for (let x = 2; x < 48; x++) for (let y = 4; y < 11; y++) P.p(x, y, (x * 7 + y * 3) % 5 ? '#e0c078' : '#f8e8b0'); P.ball(18, 5, 6, 4, ['#a88848', '#e0c078', '#f8e8b0', '#ffffff', '#ffffff']); P.rect(30, 2, 6, 8, '#bff0ff'); P.rect(31, 3, 2, 3, '#ffffff'); return P.outline().canvas(); };
let TESOURA_C = null; const tesouraSpr = () => TESOURA_C || (TESOURA_C = (() => { const P = new Pix(14, 12); P.line(2, 10, 11, 2, '#e8e8f0', 2); P.line(2, 2, 11, 10, '#c8c8d8', 2); P.ball(3, 10, 2, 2, ['#8a6a20', '#c89a30', '#f0c850', '#fff', '#fff']); return P.outline().canvas(); })());

// ---------- abertura do capítulo ----------
function iniciarCap5() {
  if (G.flags.c5Init) return false;
  G.flags.c5Init = true; G.poder = Math.max(G.poder || 1, 4); curarTudo(); G.hora = 8 * 60; G.dia = (G.dia || 0) + 1;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  return true;
}
async function capitulo5() {
  if (!MAPS2.cidadeAlta) montarMapas2();
  const novo = iniciarCap5();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'interior', x: POS3.interior.entra[0], y: POS3.interior.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 5', 'O Caderno Preto']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Madrugada, dentro do baú. A vela da base está quase no fim. A Lume está acordada, sentada no chão, com a página arrancada aberta no colo.');
  await say('Eu fiquei olhando a letra. Pequena. Cuidadosa. Cada "a" fechadinho, como quem tranca a porta antes de sair.', 'lume');
  await say('* A Rita acende outra vela, senta do lado e tira do bolso o papel que vocês trouxeram do hospital: a LISTA DO DESCANSO. Põe uma folha do lado da outra.');
  await say('...É a mesma mão.', 'rita');
  await say('A mesma letra que escreveu "pensão paga" no hospital escreveu "312 almas" em Candeia. E escreveu um nome mil vezes. E riscou mil vezes.', 'lume');
  await say('Quem anota tudo assim não anota em papel solto. Anota num caderno. E quem tem um caderno desses não larga ele nunca.', 'me');
  await say('[Registro: o papel da página é fino, liso, com marca d\'água de lírio. Papel caro. Não é de bazar.]', 'cat');
  await say('A Dona Iolanda conhece papel como a Dalva conhece febre. Se alguém sabe de onde veio isso, é ela.', 'rita');
  await say('* A Lume dobra a página com cuidado e guarda no bolso de dentro, perto do peito. Ela não fala mais nada. Mas também não volta a deitar.');
  await say('[Objetivo: a PAPELARIA PENA & FULIGEM, no Bairro Baixo. Viagem rápida: a GARAGEM do Seu Jorge, aqui na base.]', 'cat');
  save2();
}
// quem já tinha terminado o Cap. 4 entra no Cap. 5 (ao carregar, ou ainda no mapa)
{ const _c4 = capitulo4; capitulo4 = async function () { if (!MAPS2.largo) montarMapas2(); if (G.flags.c4Fim) return capitulo5(); return _c4(); }; }
{ const _uw5c = updateWorld2; updateWorld2 = function () { _uw5c(); if (V.scene === 'world' && G.flags.c4Fim && !G.flags.c5Init && !worldBusy2() && !W2.mv) run2(capitulo5); }; }

// ---------- a Dona Iolanda: o papel-lírio e a RESSONÂNCIA ----------
{ const _fi = falaIolanda; falaIolanda = async function () {
  if (!G.flags.c5Init || G.flags.c5Iolanda) { if (G.flags.c5Iolanda && !G.flags.c5Fim) { await say(pickOne(['Papel-lírio, Acendedoria, Cidade Alta. E cuidado com a moça: ela anda segurando aquela página como quem segura uma vela no vento.', 'Ressonância é conversa, não grito. Escreva o véu NELA, e deixe o golpe dela cantar.']), 'iolanda'); return; } return _fi(); }
  G.flags.c5Iolanda = true;
  await say('Bom dia, bom dia. Vocês têm cara de quem não dormiu e de quem trouxe um papel. Me dá.', 'iolanda');
  await say('* A Dona Iolanda pega a página pela pontinha, levanta contra a luz da janela, cheira, passa o polegar na borda.');
  await say('Papel-lírio. Marca d\'água de lírio, tinta de fuligem com goma. Isso aqui sai da Casa Real de Papel, e a Casa Real só vende esse papel para UM cliente na cidade inteira.', 'iolanda');
  await say('A ACENDEDORIA. Na Cidade Alta. É o papel dos livros de ponto dos Pavios e dos cadernos do próprio Acendedor-Mor.', 'iolanda');
  await say('* Silêncio na papelaria. Até o gato que não é dela para de lamber a pata.');
  await say('...Do Acendedor-Mor. O que me deu a pedra do Marco. O que elogiou a minha música.', 'lume');
  await say('Pode ser de qualquer um lá dentro. Um secretário. Um contador.', 'rita');
  await say('Pode. E pode não ser. A gente só sabe vendo o caderno.', 'me');
  await say('Vocês vão entrar na Acendedoria. Eu vejo pela mala. Ela tem cara de quem vai entrar.', 'iolanda');
  await say('Então levem uma coisa de mim. Tinta de superfície não pega só em papel. Pega em GENTE.', 'iolanda');
  await say('Quando o baú escrever um VÉU em cima da moça da lança ou da moça de luz, a tinta fica nelas um pouco. E o próximo golpe delas canta a mesma nota da tinta. Fogo na lança. Gelo na luz. Chama-se RESSONÂNCIA.', 'iolanda');
  G.flags.resson = true; sfx('rune');
  await say('* {y}RESSONÂNCIA aprendida!{/} Um VÉU do Grimório na Rita ou na Lume faz o PRÓXIMO golpe dela ganhar o elemento do véu e bater 30% mais forte.');
  await say('Eu vou ter uma lança em brasa? Eu sempre quis uma lança em brasa.', 'rita');
  await say('E eu vou brilhar de outra cor? ...Eu posso escolher a cor?', 'lume');
  await say('A cor é a do baú. Reclamem com ele.', 'iolanda');
  await say('Eu tenho cor? Eu sou marrom. Marrom-baú. Isso é uma cor?', 'me');
  await say('A Cidade Alta fica no morro, atrás do Largo do Hospital. Sobe de BONDINHO, que só corre de DIA. E de noite... de noite lá em cima tem luz demais. Até para mim.', 'iolanda');
  await say('[Objetivo: o BONDINHO, no lado leste do Largo do Hospital (só de dia, das 7h às 19h).]', 'cat');
  save2();
}; }

// ---------- o bondinho ----------
async function subirBondinho() {
  W2.mv = null;
  if (!G.flags.c5Iolanda) { await say('* O bondinho da Cidade Alta. Vocês não têm o que fazer lá em cima. Ainda.'); return; }
  if (!diaBondinho()) { await say('* O bondinho está parado no alto, com as luzes apagadas. Uma plaquinha: "Último horário: 19h. Primeiro: 7h."'); await say('[O bondinho só sobe DE DIA. Descanse num Marco até de manhã.]', 'cat'); return; }
  sfx('door'); await fadeOut(16);
  await cartao(['O bondinho sobe', 'a cidade inteira encolhe lá embaixo']);
  V.scene = 'world'; loadMap2('cidadeAlta', ...CA5.chegada, 'up'); await fadeIn(16);
  if (MAPS2.cidadeAlta.onEnter) await MAPS2.cidadeAlta.onEnter();
}
async function descerBondinho() {
  W2.mv = null;
  if (!diaBondinho()) { await say('* O bondinho dorme na plataforma. Até amanhã, 7h.'); if (!G.flags.c5Alcapao) await say('[De noite não dá para descer. Mas talvez seja de noite que a Acendedoria fique sem ninguém...]', 'cat'); return; }
  const c = await choose('* Descer de bondinho para o Largo do Hospital?', ['Descer', 'Ficar'], 'n', 1); if (c !== 0) return;
  sfx('door'); await fadeOut(14); loadMap2('largo', 44, 15, 'left'); await fadeIn(14);
}
async function chegaCidadeAlta() {
  G.flags.c5Alta = true;
  await say('* A Cidade Alta. Mármore no chão, sebes cortadas em forma de lustre, uma fonte com estátua. Ninguém corre aqui em cima.');
  await say('* E, no alto, a ACENDEDORIA: uma torre de vidro e latão, acesa por dentro mesmo de dia, como um coração que não descansa.');
  await say('É tão bonita que dá raiva.', 'rita');
  await say('Eu me sinto mal vestido. E eu estou sem roupa. Eu sou um baú.', 'me');
  await say('Olha os guardas no portão. Da Guarda Real, não Pavios. A gente não entra pela frente.', 'rita');
  await say('[Objetivo: achar outra entrada para a torre. Gente daqui de cima sempre sabe por onde os empregados entram.]', 'cat');
  save2();
}
async function portaoTorre() { await say(ehNoite() ? '* O portão está fechado e selado com luz: uma película dourada entre as grades. Encostar dói só de olhar.' : '* O portão está aberto, mas dois Guardas Reais e uma fila de gente de cartola decidem quem passa. Um baú com dentes não passa.'); }
async function falaGuardaPortao() { await say(pickOne(['Acendedoria Real. Só com hora marcada.', 'Circulando. Isso aqui não é lugar de mala.', 'De noite? De noite nem a gente entra. É a luz que toma conta.']), 'guardaRH'); }

// ---------- o jardineiro e o labirinto ----------
async function falaBenedito() {
  if (G.flags.c5Chave) { await say(pickOne(['A estufa é toda de vocês. Só não pisem nas begônias. Elas guardam rancor.', 'De noite os holofotes da torre varrem o jardim. Eu vou embora às sete. Velho tem medo de luz.']), 'benedito'); return; }
  if (G.flags.c5Tesoura) {
    await say('MINHA TESOURA! De prata, presente da minha falecida. Onde estava? No miolo do labirinto? Eu plantei aquele labirinto e me perdi nele. Duas vezes.', 'benedito');
    await say('Toma. A chave da estufa. Lá dentro tem um alçapão que desce pros porões da torre, por onde a gente leva a terra dos vasos. Eu nunca abri. Precisa de peso nas placas, e eu tenho é dor nas costas.', 'benedito');
    await say('E não desçam de dia: é expediente, os escriturários ficam lá embaixo contando vela. De noite não tem ninguém. Só a luz.', 'benedito');
    G.flags.c5Chave = true; sfx('item'); await say('* Você recebeu a {y}Chave da Estufa{/}.'); save2(); return;
  }
  await say('Bom dia. Cuidado com a grama: ela é mais velha que vocês e mais bem tratada também.', 'benedito');
  await say('Estufa? É minha, quer dizer, é da Coroa, mas quem rega sou eu. Fechada. A chave fica comigo.', 'benedito');
  await say('Eu emprestava, viu? Se eu estivesse de bom humor. Mas perdi a minha tesoura de prata no LABIRINTO de sebes e estou de péssimo humor.', 'benedito');
  await say('[Objetivo: achar a tesoura no meio do LABIRINTO de sebes (a entrada fica no lado direito, perto do caminho de cascalho).]', 'cat');
}
async function pegarTesoura() { if (G.flags.c5Tesoura) return; G.flags.c5Tesoura = true; sfx('item'); await say('* No miolo do labirinto, presa num galho, uma tesoura de prata com o cabo gasto de tanto uso. Alguém gostava muito dela.'); await say('Eu me sinto um herói. Um herói de jardinagem. Existe isso?', 'me'); await say(diaBondinho() ? '[Leve ao Seu Benedito, perto da entrada do labirinto (ele trabalha de dia).]' : '[O Seu Benedito vai embora à noite. Volte DE DIA.]', 'cat'); }

// ---------- gente da Cidade Alta (e as missões de horário) ----------
async function falaDama() {
  if (G.flags.c5Dama) { await say(pickOne(['O meu marido dizia que a cidade de cima é bonita porque a de baixo trabalha. Ele era insuportável. Eu sinto falta.', 'Boa noite, baú. Ou bom dia. Na minha idade a gente cumprimenta o que vier.']), 'dama'); return; }
  if (G.flags.c5Sorvete && ehNoite()) {
    if (G.flags.c5SorveteDerreteu) { await say('Isso era um sorvete? Virou sopa. Doce, mas sopa. Obrigada pela intenção.', 'dama'); G.flags.c5Sorvete = false; return; }
    G.flags.c5Dama = true; G.flags.c5Sorvete = false;
    await say('* Você tira do Vão um sorvete de lavanda, ainda gelado. A Dona Hortênsia olha para o sorvete, depois para você, depois para o sorvete de novo.');
    await say('De LAVANDA. Era o que ele me trazia toda noite, escondido, porque o médico tinha proibido. A gente comia aqui, no banco, olhando a cidade de baixo acender.', 'dama');
    await say('Toma. O monóculo dele. Ele dizia que com isso tudo virava documento importante. Até eu.', 'dama');
    ganharEquip('monoculo'); sfx('equip'); await say(`* Você recebeu o {y}${EQ2.monoculo.nm}{/}. ${EQ2.monoculo.d}`); save2(); return;
  }
  if (!ehNoite()) { await say('Ah, de dia eu não converso. De dia eu só olho. A Cidade Alta de dia é uma vitrine. De NOITE é que ela vira cidade.', 'dama'); return; }
  await say('Boa noite. Eu venho aqui todo dia depois das sete. O meu marido trazia um sorvete de lavanda, do carrinho, antes do homem ir embora.', 'dama');
  await say('O sorveteiro só fica de DIA. E sorvete não espera a noite. Morre no caminho.', 'dama');
  G.flags.c5DamaPediu = true;
  await say('[Missão: um SORVETE DE LAVANDA para a Dona Hortênsia, à NOITE. Compre do sorveteiro (de dia) bem perto das 19h, guarde no Vão e entregue logo que escurecer.]', 'cat');
}
async function falaSorveteiro() {
  const h = hora();
  await say('Sorvete! De creme, de fruta, de lavanda! O de lavanda é só pra quem tem bom gosto e 10 cobres.', 'sorveteiro');
  if (!G.flags.c5DamaPediu || G.flags.c5Dama) return;
  const c = await choose('* Comprar um sorvete de lavanda (10 cobres)?', ['Comprar', 'Agora não'], 'n', 1); if (c !== 0) return;
  if ((G.cobres || 0) < 10) { await say('Dez cobres, meu senhor. Baú também paga.', 'sorveteiro'); return; }
  G.cobres -= 10; G.flags.c5Sorvete = true; G.flags.c5SorveteDerreteu = false; G.flags.c5SorveteHora = G.hora + (G.dia || 0) * 1440; sfx('item');
  await say('* Você guarda o sorvete no Vão. Lá dentro é fresquinho. Mas não é eterno.');
  if (h < 18 * 60) await say('[Faltam ' + Math.round((19 * 60 - h) / 60) + ' horas para a noite. Sorvete derrete em cerca de UMA hora...]', 'cat');
}
// o sorvete derrete depois de 90 minutos de jogo
{ const _uwS = updateWorld2; updateWorld2 = function () { _uwS(); if (G.flags && G.flags.c5Sorvete && !G.flags.c5SorveteDerreteu && G.hora + (G.dia || 0) * 1440 - (G.flags.c5SorveteHora || 0) > 90) { G.flags.c5SorveteDerreteu = true; W2.toast = { s: 'O sorvete no Vão derreteu...', t: 0 }; } }; }
async function falaQuinzinho() {
  if (G.flags.c5Pipa) { await say(pickOne(['A pipa voa até a torre! Quase encosta no vidro! O guarda grita "DESCE ISSO"!', 'Baú, você voa? Não? Eu achei que voava. Você tem cara de que voa.']), 'quinzinho'); return; }
  await say('Ei, baú! Você sabe entrar na torre? Ninguém sabe. Só o jardineiro. Ele leva terra pelo alçapão da estufa. Eu vi. Eu vejo tudo, eu tenho nove anos.', 'quinzinho');
  await say('Perdi a minha pipa no labirinto. Num canto sem saída. Se achar, me dá?', 'quinzinho');
  if (!G.flags.c5PipaVista) G.flags.c5PipaVista = true;
}
async function mirante5() {
  if (!ehNoite()) { await say('* Do mirante, de dia, a cidade de baixo é um tapete de telhados. Dá para ver o Largo, a Avenida, o canal do Bairro Baixo e, longe, o morro com a torre do Farol.'); return; }
  await say('* De noite, a cidade de baixo é um céu virado ao contrário. Cada janela uma estrela.');
  if (!G.flags.c5Mirante) { G.flags.c5Mirante = true; await say('* E, no alto do morro, no Farol apagado, uma luzinha pequena se mexe de janela em janela. Alguém está lá em cima. De noite. Sozinho.'); await say('Quem sobe num farol apagado de noite?', 'lume'); await say('Alguém que está esperando ele acender.', 'me'); await dar('cobres', 40); }
}

// ---------- a estufa ----------
async function entrarEstufa() {
  W2.mv = null;
  if (!G.flags.c5Chave) { await say('* A porta da estufa está trancada. Pelo vidro embaçado dá para ver plantas enormes e, no chão, um alçapão.'); return; }
  sfx('door'); await fadeOut(10); loadMap2('estufa', ...ES5.entra, 'up'); await fadeIn(10);
  if (MAPS2.estufa.onEnter) await MAPS2.estufa.onEnter();
}
async function mesaAreia() {
  if (G.flags.c5Areia) { await say('* A mesa dos vidreiros. A areia ainda tem a forma da sua tampa.'); return; }
  G.flags.c5Areia = true;
  await say('* Uma mesa comprida coberta de areia fina, branca, e uns cacos de vidro soprado: a areia que os vidreiros da Coroa usam para fazer as lentes da torre.');
  await say('* Você chega perto e a areia se mexe sozinha. Desenha uma runa. A mesma letra que o Grimório tem nas margens.');
  await say('* Antes de você pensar, a tampa abre. E a areia entra. Igual na masmorra: um baú come runa, é o que baús fazem.');
  grim().elems.push('areia'); sfx('rune');
  await say('* {y}Elemento AREIA aprendido!{/} Corte; quebra +1 de escudo. Fusões novas esperando nas margens do Grimório.');
  await say('Você COMEU a mesa?', 'rita');
  await say('Só a runa. A mesa tá aí. ...Mais ou menos aí.', 'me');
  await say('[Registro: a areia deixou um desenho na tampa. Areia + Brasa: o selo do VIDRO. Os Vigias desta torre são de vidro. Recomendação: usar.]', 'cat');
  ganharSelo('areia+brasa'); await mostrarSelo('areia+brasa');
  save2();
}
async function placasEstufa() {
  sfx('rune'); await wait(20);
  await say('* As três placas afundam juntas com um "clonc" de bronze. Debaixo do chão, uma engrenagem gira, preguiçosa. O alçapão destrava.');
  await say('Três vasos e um baú que não pesa nada. A gente formou uma equipe.', 'me');
  save2();
}
async function alcapao() {
  if (!G.flags.c5Alcapao) { await say('* Um alçapão de madeira com uma fechadura sem buraco. Quando você encosta, as placas do chão brilham de leve, uma de cada vez.'); return; }
  if (!ehNoite()) {
    await say('* Pelo alçapão sobe um barulho de gente: carimbos, cadeiras arrastando, alguém contando "...quatrocentos e dez, quatrocentos e onze...".');
    await say('Expediente. O jardineiro avisou: de dia tem escriturário lá embaixo.', 'rita');
    await say('[A Acendedoria trabalha das 7h às 19h. Volte DE NOITE. Cuidado: de noite, os holofotes varrem o jardim.]', 'cat');
    return;
  }
  const c = await choose('* O alçapão está aberto. Lá embaixo, silêncio e uma luz azulada. Descer?', ['Descer', 'Ainda não'], 'n', 1); if (c !== 0) return;
  sfx('door'); await fadeOut(14); loadMap2('lentes', ...LE5.entra, 'up'); await fadeIn(14);
  if (MAPS2.lentes.onEnter) await MAPS2.lentes.onEnter();
}
// ---------- a Sala das Lentes ----------
async function chegaLentes() {
  G.flags.c5Lentes = true;
  await say('* Embaixo da torre, uma sala de vidro e latão. No meio dela, um fio de luz atravessa o ar, reto, quente, e bate numa parede de vidro.');
  await say('* Lá no alto, atrás de uma porta de vidro, a escada. Na frente da porta, um cristal azul apagado. Do outro lado, um cristal vermelho.');
  await say('Espelhos. Ele guarda a escada com espelhos. Que homem organizado.', 'rita');
  await say('A luz tem que chegar no cristal azul. Sem passar no vermelho.', 'lume');
  await say('Espelho eu giro. Caixa eu guardo. Esse quebra-cabeça foi feito pra mim e ele nem sabia.', 'me');
}
// ---------- o Arquivo das Velas ----------
const velaAcesa = (nm) => (G.flags.c5VelasAcesas || []).includes(nm) || (G.flags.c5Velas && AR5.ordem.includes(nm));
async function chegaArquivo() {
  G.flags.c5Arquivo = true;
  await say('* O andar de cima é um arquivo. Estantes e estantes, do chão ao teto. Mas em vez de papel, as prateleiras guardam VELAS. Milhares. Cada uma com um nome escrito em letra pequena e cuidadosa.');
  await say('* Quase todas apagadas. Algumas ainda fumegam, como se alguém tivesse soprado agora.');
  await say('...São pessoas. Cada vela é uma pessoa.', 'lume');
  await say('Ali. "Joaquim, sineiro, Candeia." O marido da Dona Ilda.', 'rita');
  await say('E a porta da escada de cima, de vidro de novo. Com um bilhete na mesa.', 'me');
}
async function notaArquivo() {
  await say('* Um bilhete na mesa do arquivista, letra apressada: "PARA SUBIR: acenda, na ordem do dia, quem consertava as horas, quem as tocava, e quem limpava a fumaça delas. Errar apaga tudo e acorda as mariposas."');
  await say('Quem consertava as horas... O Pavio de Velhágua! Osvaldo Candeia, conserto de relógios!', 'lume');
  await say('Quem as tocava: o sineiro. O Joaquim, de Candeia.', 'rita');
  await say('E quem limpava a fumaça delas... chaminé. O Dito.', 'me');
  await say('[As velas com esses nomes estão nas estantes. A Lume acende. Uma delas está alta demais: talvez com algo para subir...]', 'cat');
}
async function falaVelaNome(nm, x, y) {
  if (G.flags.c5Velas) { await say('* "' + nm + '". A vela queima baixinho, firme.'); return; }
  const lista = G.flags.c5VelasAcesas || [];
  if (lista.includes(nm)) { await say('* A vela de "' + nm + '" está acesa.'); return; }
  const alta = nm === AR5.alta;
  if (alta && !W2.ents.some(e => e.t === 'movel' && e.k === 'escadinha' && Math.abs(e.x - x) + Math.abs(e.y - y) === 1)) {
    await say('* "' + nm + '", lá na prateleira mais alta. A Lume estica o braço. Não alcança. Nem a Rita na ponta do pé.');
    await say('[Uma ESCADINHA encostada do lado da vela resolveria. Tem uma no canto do arquivo.]', 'cat'); return;
  }
  const c = await choose('* "' + nm + '". ' + (alta ? 'A Lume sobe na escadinha.' : '') + ' Acender esta vela?', ['A Lume acende', 'Deixar'], 'n', 1); if (c !== 0) return;
  const certo = AR5.ordem[lista.length] === nm;
  sfx('rune'); lista.push(nm); G.flags.c5VelasAcesas = lista;
  await say('* A Lume encosta o dedo no pavio. A vela acende. O nome escrito nela brilha um segundo, como quem responde "presente".');
  if (!certo) {
    await wait(20); sfx('cancel'); G.flags.c5VelasAcesas = [];
    await say('* Um sopro frio passa pelo arquivo. Todas as velas que vocês acenderam se apagam de uma vez. E, do alto das estantes, desce um farfalhar de asas de vidro.');
    const r = await lutaMapa(['mvidro', 'mvidro', 'mvidro'], { bg: bgTorre });
    if (r === 'win') await say('Ordem do dia. Quem consertava, quem tocava, quem limpava. De novo, com calma.', 'rita');
    return;
  }
  if (lista.length === AR5.ordem.length) {
    G.flags.c5Velas = true; sfx('item');
    await say('* As três velas queimam juntas. Na porta de vidro, um estalo de trinco. E, por um instante, no arquivo inteiro, todas as velas com nome de gente de Candeia tremem, como se alguém tivesse aberto uma janela.');
    await say('Osvaldo. Joaquim. Dito. Eles estão bem agora. Lembram de quem são.', 'lume');
    await say('Mas as velas deles continuam aqui. Numa estante. Com um número.', 'me');
    save2();
  }
}
async function lutaVitral() {
  if (G.flags.c5Vitral || !G.flags.c5Velas) return; W2.mv = null;
  await say('* No patamar da escada, a janela de vitral da torre desce da parede. Pedaço por pedaço, chumbo e vidro colorido, até ficar de pé. No peito, uma rosácea com um olho de luz.');
  await say('* Ele não fala. Só muda de cor. Vermelho. Azul. Verde. Como quem escolhe a roupa para uma visita.');
  await say('Vidro que muda de cor. Que noite.', 'rita');
  await say('[VITRAL VIVO. A COR manda: vermelho racha com GELO e devolve FOGO; azul racha com FOGO e devolve GELO; verde racha com CORTE. Prisma preparado: quebre o escudo.]', 'cat');
  await say('Eu vou morder um vitral. A minha mãe teria tanto orgulho. Ou vergonha. Eu não lembro qual.', 'me');
  const r = await lutaMapa(['vitral'], { bg: bgTorre, music: 'boss', pos: [[184, 162]], intro: async () => { const e = BT.foes[0]; e.phases = fasesVitral(); e.ct = 10; callout('VITRAL VIVO', '#ffd870', 90); } });
  if (r !== 'win') return;
  G.flags.c5Vitral = true; save2();
  await say('* O vitral se desmancha numa chuva de cacos coloridos que não machuca ninguém. Pelo vão da janela, entra o vento da noite. A escada de cima está livre.');
}
// ---------- o escritório: o caderno e o chá (segredo: só dentro do jogo) ----------
async function lerCaderno() {
  if (G.flags.c5Cha) { await say('* A mesa vazia. A lâmpada verde. A xícara fria.'); return; }
  if (G.flags.c5Caderno) return;
  G.flags.c5Caderno = true; playMusic('cha');
  await say('* Você abre o caderno de capa preta. Página por página, a letra pequena e cuidadosa.');
  await say('* "VELHÁGUA: 41. Rendimento: 2 invernos. Pensões pagas." "HOSPITAL DO LARGO: 118. Rendimento: 9 invernos. Pensões pagas." "CANDEIA: 312. Rendimento: 40 invernos. Pensões pagas."');
  await say('* Nome por nome. Cada um com uma data, um valor de pensão, e uma vírgula, como quem não termina a frase.');
  await say('* Na última página escrita, uma conta grande, refeita muitas vezes: "FAROL DE CEM INVERNOS: faltam 47." E, embaixo, sublinhado duas vezes: "Ninguém mais no escuro."');
  await say('...Ele não está roubando lembranças. Ele está CONTANDO. Pagando. Anotando cada uma.', 'rita');
  await say('* A Lume não diz nada. Ela vira a página para trás, procura, procura. A página que falta. Do lado do rasgo, ainda dá para ler o começo de um nome: "L".');
  await say('Isso é pior. É muito pior que roubar.', 'me');
  await wait(30);
  await say('Boa noite.', 'vesper');
  await vesperCha();
}
async function vesperCha() {
  G.flags.c5Cha = true;
  await say('* Na porta, de chinelo e roupão de lã por cima da camisa, com uma bandeja de chá nas mãos sujas de fuligem, o Conde Ulrico Vesper. O Acendedor-Mor.');
  await say('Eu ouvi o vitral cair. E as velas de Candeia tremerem. Imaginei que fossem vocês. Ninguém mais sabe aqueles três nomes de cor.', 'vesper');
  await say('Chá? É de erva-cidreira. Acalma. Eu tomo toda noite, e mesmo assim não durmo.', 'vesper');
  await say('* Ele põe a bandeja na mesa, ao lado do caderno aberto. Não pede o caderno de volta. Senta na cadeira do outro lado, como quem recebe visita.');
  const c1 = await choose('* O que dizer?', ['"O senhor não vai negar?"', '"Trezentas e doze pessoas."', '(ficar quieto e encarar)'], 'me');
  if (c1 === 0) { await say('Negar o quê? Está escrito. Com a minha letra. Eu não escrevo o que não faço.', 'vesper'); }
  else if (c1 === 1) { await say('Trezentas e doze. Todas com nome. Todas com pensão. Nenhuma no escuro. Eu sei a conta de cor, senhor baú. Eu faço a conta toda noite.', 'vesper'); }
  else { await say('* Você encara. Ele encara de volta, com uma paciência que não é de quem tem medo. É de quem está cansado.'); await say('O senhor guarda as coisas. Eu também. Somos colegas de profissão, de certa forma.', 'vesper'); }
  await say('Há doze anos, o âmbar acabou. A capital ficou quarenta noites no escuro. O Inverno Escuro. Vocês já ouviram a velha do Bairro Baixo contar.', 'vesper');
  await say('Ela conta errado. Ela fala do frio. O frio não é o pior. O pior é o hospital dos pobres sem uma vela. É ouvir alguém chamar no escuro e não saber de que lado vem a voz.', 'vesper');
  await say('Eu estava acendendo os bairros ricos. Por ordem da Coroa. Rua por rua. Enquanto alguém... alguém chamava no escuro. E eu não estava lá.', 'vesper');
  await say('* Ele não diz o nome. A Lume aperta a página no bolso.');
  await say('Quem é Lívia?', 'lume');
  await say('* Por um segundo, só um, o Acendedor-Mor para de respirar. Depois sorri, com uma gentileza enorme, e põe açúcar no chá.');
  await say('Alguém que morreu no escuro. Como tanta gente. É por isso que eu faço a conta.', 'vesper');
  await say('Os Pavios dão pouco. Um nome, umas lembranças. Ninguém sente falta de um nome. E em troca: salário, pensão para a família, e uma cidade que nunca mais apaga. Quando o Farol acender, ninguém mais vai precisar dar nada. Faltam quarenta e sete invernos de luz.', 'vesper');
  await say('O senhor tirou o Dito do irmão dele. O Tico de onze anos chorava na porta do hospital.', 'rita');
  await say('E o Tico de onze anos vai crescer numa cidade acesa, escudeira. Eu também choro por eles. Toda noite. Está no caderno. Com data.', 'vesper');
  playMusic(null);
  await say('* Então ele vira para a Lume. E a voz dele fica mais baixa, quase de pai.');
  await say('Senhorita. Eu ouvi a sua música no rio, em Velhágua. Ouvi no festival. A senhorita canta como quem tem medo de parar de cantar e ficar escuro.', 'vesper');
  await say('Eu conheço esse medo. Eu sei o que a senhorita foi, lá embaixo, na masmorra. Um lustre que ninguém acendia. Esperando no escuro.', 'vesper');
  await say('* A Lume não responde. As velas da cabeça dela tremem.');
  await say('Eu posso dar à senhorita uma coisa que ninguém nunca deu. Uma luz que não depende de ninguém. Nunca mais escuro. Nunca mais esperar que alguém volte com o fósforo. É só ficar. Aqui. Com a cidade acesa.', 'vesper');
  await say('* Ele estende a mão suja de fuligem. A Lume se levanta. Dá um passo. Dois. Os olhos dela estão molhados e as velas, por um instante, ficam fortes como nunca ficaram.');
  const c2 = await choose('* A Lume está indo. O que você faz?', ['"Lume..."', '(segurar a mão dela com a tampa)', '(não dizer nada e esperar)'], 'n');
  if (c2 === 0) { await say('Lume...', 'me'); await say('* Só o nome. Nada mais. Ela para no meio do passo, como quem ouve chamarem no escuro e, dessa vez, SABE de que lado vem a voz.'); }
  else if (c2 === 1) { await say('* Você estica a tampa, desajeitado, e prende a pontinha do vestido dela entre os dentes. Devagar. Sem puxar. Só segurando.'); await say('* Ela olha para baixo. Para você. E ri, um riso molhado, ridículo, o mais bonito da noite.'); }
  else { await say('* Você não diz nada. Fica. Do jeito que você ficou, por meses, lá embaixo, do lado de um lustre apagado, sem saber se ele ia acender algum dia.'); await say('* A Lume olha para trás. E vê que você ainda está ali. Que sempre esteve.'); }
  await say('...Não.', 'lume');
  await say('Eu não fui um lustre que ninguém acendia. Eu fui um lustre que um baú vigiou. Toda noite. Sem pedir nada.', 'lume');
  await say('Eu tenho medo do escuro, senhor. Muito. Mas eu prefiro ter medo do lado deles do que ter luz do seu lado.', 'lume');
  sfx('rune'); flashW(3);
  await say('* As velas da Lume não apagam. Ficam menores, mais firmes, de um dourado que não estava lá antes. Uma luz que não pediu licença para ninguém.');
  G.flags.c5Vela = true;
  await say('* {y}A Lume aprendeu VELA INTERIOR!{/} (técnica: cura o grupo, tira os maus estados e deixa todos TEIMOSOS). E agora ela não ESQUECE a vez.');
  await say('* O Acendedor-Mor baixa a mão. Não parece bravo. Parece um homem que perdeu uma aposta que já esperava perder.', 'n');
  await say('Uma pena. Era uma oferta sincera.', 'vesper');
  await say('Podem ir. Levem o que leram. Contem para quem quiserem. Eu não preciso prender ninguém, senhor baú. A cidade gosta de luz. A cidade vai continuar gostando.', 'vesper');
  await say('* Ele toma um gole de chá. Depois tira do roupão um sininho de prata e toca, uma vez, baixinho.');
  await say('Por educação, eu aviso a Guarda Real quando recebo visita fora de hora. Eles demoram uns dez minutos para subir. Sugiro o terraço. Os telhados de Auren são lindos à noite.', 'vesper');
  await say('O senhor está avisando a gente pra fugir?', 'rita');
  await say('Eu estou avisando a Guarda. O que vocês fazem com o meu aviso é com vocês. Boa noite. E... obrigado pelas velas de Candeia. Eu gostava do Joaquim. Ele tocava o sino fora do tempo.', 'vesper');
  save2();
  await say('[Objetivo: sair pela porta e fugir pelos TELHADOS.]', 'cat');
}
