// ================= CAPÍTULO 3 — O FESTIVAL DA LUZ (Parte 1) =================
// Estrada dos Lampiões (o 31 quebra; mariposas comem a luz dos postes; Mariposa-Rainha) -> Auren, a capital que não
// apaga (Bairro Baixo) -> a TINTA DE SUPERFÍCIE (fuligem do Tico, óleo de um Pavio, lágrima da Lume) -> o GRIMÓRIO
// acorda -> a RUNA DO VÃO abre o INTERIOR DO BAÚ (a base) -> a noite de abertura do Festival (pastel da Rita, discurso
// do Acendedor-Mor). A Parte 2 (Galerias de Fuligem, troca de forma, evolução, chefe) continua daqui.

// ---------- gente nova ----------
Object.assign(HUMS, {
  iolanda: { h: 44, skin: '#e0b090', hair: '#e8e4e0', hairStyle: 'coque', top: '#5a4a7a', bottom: '#3a3048', acc: '#c8a040',
    extra: (P, o) => { if (o.view === 'f') { P.rect(o.cx - 5, o.hcY, 4, 3, '#2a2038'); P.rect(o.cx + 1, o.hcY, 4, 3, '#2a2038'); P.rect(o.cx - 4, o.hcY + 1, 2, 1, '#d8e8f0'); P.rect(o.cx + 2, o.hcY + 1, 2, 1, '#d8e8f0'); } } },
  tico: { h: 34, skin: '#c8906a', hair: '#2a1a1a', top: '#4a4a5a', bottom: '#2a2a34', hat: '#2a2a30',
    extra: (P, o) => { if (o.view === 'f') { P.p(o.cx - 4, o.hcY + 3, '#3a3040'); P.p(o.cx + 3, o.hcY + 2, '#3a3040'); } P.rect(o.cx + (o.view === 's' ? -4 : 5), o.tT - 6, 1, 18, '#6a4a2a'); P.rect(o.cx + (o.view === 's' ? -6 : 3), o.tT - 9, 5, 3, '#2a2030'); } },
  poeta: { h: 50, skin: '#d8a888', hair: '#6a3a2a', hairStyle: 'longo', top: '#3a5a6a', bottom: '#2a2a3a', coat: '#4a3a5a', acc: '#c8c0e0' },
  guardaA: { h: 50, skin: '#c8906a', hair: '#3a2a1a', top: '#8a90b8', bottom: '#3a3a52', hat: '#c84a7a', collar: '#f0c040' },
  fatima: { h: 46, skin: '#a8704a', hair: '#2a1a1a', hairStyle: 'coque', top: '#e8a040', bottom: '#5a3a3a', apron: '#f2ecdc' },
  feiraA: { h: 47, skin: '#d8a078', hair: '#8a4a2a', top: '#4a8a6a', bottom: '#3a3040', apron: '#e8dcc0' },
  feiraB: { h: 49, skin: '#8a5a3a', hair: '#1a1a1a', top: '#c84a4a', bottom: '#2a2a3a', hat: '#e8c070' },
  feiraC: { h: 45, skin: '#e0b090', hair: '#c8a040', hairStyle: 'longo', top: '#8a6ab8', bottom: '#3a3048' },
  crianca2: { h: 33, skin: '#d8a078', hair: '#5a3a1a', top: '#e8c040', bottom: '#3a4a8a' },
  velha2: { h: 43, skin: '#c89070', hair: '#d8d4d0', hairStyle: 'coque', top: '#6a3a4a', bottom: '#3a2a3a' },
  lavadeira: { h: 46, skin: '#8a5a3a', hair: '#1a1a1a', hairStyle: 'rabo', top: '#5a9ab8', bottom: '#e8dcc0' },
  povo1: { h: 48, skin: '#d8a078', hair: '#4a2a1a', top: '#c86a8a', bottom: '#3a3048' },
  povo2: { h: 50, skin: '#8a5a3a', hair: '#1a1a1a', top: '#4a7aa8', bottom: '#2a2a3a', hat: '#3a3a4a' },
  povo3: { h: 46, skin: '#e0b090', hair: '#e8c070', hairStyle: 'longo', top: '#6ab88a', bottom: '#4a3a5a' },
  povo4: { h: 49, skin: '#c8906a', hair: '#9a9a9a', top: '#a8803a', bottom: '#3a3048', beard: true },
  povo5: { h: 35, skin: '#a8704a', hair: '#2a1a1a', top: '#ff7aa8', bottom: '#3a4a8a' },
  dito: { h: 49, skin: '#c8b0a0', hair: '#2a1a1a', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30',
    extra: (P, o) => { P.rect(o.cx - 1, o.hcY - 12, 2, 5, '#f2ecdc'); P.p(o.cx, o.hcY - 13, o.fr ? '#ffd060' : '#ff9a30'); } }
});
Object.assign(WHO, {
  iolanda: { name: () => 'Dona Iolanda', portrait: () => portHum('iolanda'), voice: voz(300, 'blipTri'), col: '#e8e0f8' },
  tico: { name: () => 'Tico', portrait: () => portHum('tico'), voice: voz(760), col: '#e8e8f0' },
  poeta: { name: () => 'Poeta da Ponte', portrait: () => portHum('poeta'), voice: voz(420, 'blipTri') },
  guardaA: { name: () => 'Guarda de Auren', portrait: () => portHum('guardaA'), voice: voz(220, 'blipLow') },
  fatima: { name: () => 'Dona Fátima', portrait: () => portHum('fatima'), voice: voz(520) },
  feira: { name: () => 'Feirante', portrait: () => portHum('feiraA'), voice: voz(480) },
  povo: { name: () => 'Gente da festa', portrait: () => portHum('povo1'), voice: voz(500) },
  dito: { name: () => 'Pavio', portrait: () => portHum('dito'), voice: voz(380), col: '#e8e0d8' }
});

// ---------- trilhas ----------
Object.assign(TRACKS, {
  estrada3: { bpm: 104, bars: 8, chords: 'D A Bm G D A G A', bass: 'root5', bassVol: 0.12,
    lead: 'F#5:2 A5:2 D6:4 C#6:2 B5:2 A5:4 | E5:2 A5:2 C#6:4 B5:2 A5:2 E5:4 | F#5:2 B5:2 D6:4 E6:2 D6:2 B5:4 | G5:4 B5:2 D6:2 B5:8 | A5:2 D6:2 F#6:4 E6:2 D6:2 A5:4 | C#6:2 E6:2 A6:4 G6:2 E6:2 C#6:4 | B5:4 D6:2 G6:2 F#6:4 E6:4 | E6:8 C#6:4 A5:4',
    leadWave: 'triangle', leadVol: 0.09, arp: { rate: 2, vol: 0.016, oct: 0 }, drums: 'k..hk.s.k.khk.s.', hatVol: 0.03 },
  auren: { bpm: 92, bars: 8, chords: 'C Am F G C Em F G', bass: 'root5', bassVol: 0.11,
    lead: 'E5:2 G5:2 C6:4 B5:2 G5:2 E5:4 | A5:2 C6:2 E6:4 D6:2 C6:2 A5:4 | F5:2 A5:2 C6:4 D6:2 C6:2 A5:4 | B5:4 D6:2 G6:2 F6:4 D6:4 | E6:2 D6:2 C6:2 G5:2 E5:4 G5:4 | B5:2 G5:2 E5:2 G5:2 B5:4 E6:4 | A5:2 C6:2 F6:4 E6:2 C6:2 A5:4 | G5:8 B5:4 D6:4',
    leadWave: 'square', leadVol: 0.06, arp: { rate: 2, vol: 0.014, oct: 1 }, drums: 'k...s.h.k.h.s...', hatVol: 0.025 },
  festival: { bpm: 132, bars: 8, chords: 'G C D G Em C D D', bass: 'oct8', bassVol: 0.13,
    lead: 'D6:2 B5:2 G5:2 B5:2 D6:4 G6:4 | E6:2 C6:2 G5:2 C6:2 E6:4 G6:4 | F#6:2 D6:2 A5:2 D6:2 F#6:4 A6:4 | G6:4 D6:4 B5:8 | E6:2 G6:2 B6:4 A6:2 G6:2 E6:4 | C6:2 E6:2 G6:4 F#6:2 E6:2 C6:4 | D6:2 F#6:2 A6:4 G6:2 F#6:2 D6:4 | A6:8 F#6:4 D6:4',
    leadWave: 'square', leadVol: 0.065, arp: { rate: 1, vol: 0.018, pat: [0, 1, 2, 1] }, drums: 'k.h.s.hkk.h.s.hs', hatVol: 0.035 },
  base: { bpm: 72, bars: 8, chords: 'F C Dm Bb F C Bb C', bass: 'root5', bassVol: 0.09,
    lead: 'A5:4 C6:4 F6:8 | G5:4 C6:4 E6:8 | F5:4 A5:4 D6:8 | D6:4 C6:4 Bb5:8 | A5:4 C6:4 F6:4 A6:4 | G6:4 E6:4 C6:8 | D6:4 F6:4 Bb6:4 A6:4 | G6:16',
    leadWave: 'triangle', leadVol: 0.08, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: '', hatVol: 0 }
});

// ---------- os mapas do capítulo (entram no mesmo registro MAPS2) ----------
const ES = POS3.estrada, AUR = POS3.auren, PA = POS3.papelaria, FE = POS3.festival, IN = POS3.interior;
const arvC = v => memo(() => arvoreArt(v));
{ const _mm3 = montarMapas2; montarMapas2 = function () {
  _mm3.apply(this, arguments);
  // ===== ESTRADA DOS LAMPIÕES =====
  MAPS2.estrada = { rows: ROWS3.estrada, name: 'Estrada dos Lampiões', music: 'estrada3', batBg: bgEstrada, bg: '#12404a',
    props: [
      { img: busArt, x: 1, y: 9, solid: [[1, 7, 11, 2]] },
      ...ES.postes.map(([x, y], i) => ({ img: () => poste3Art(!!G.flags['c3poste' + i], false), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...ES.arvores.map(([x, y], i) => ({ img: arvC(i), x: x - 1.25, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: () => G.flags.c3Rainha ? poste3Art(false, false) : rainhaArt(Math.floor(FRAME / 20) % 2, false), x: 34, y: 11.4, by: 176 }
    ],
    ents: [
      morador('jorge0', ...ES.jorge, { h: 48, spr: (t, dir) => { const S = IMG.spf.jorge, F = IMG.sp.jorge; const v = dir === 'up' ? S.b : dir === 'down' ? F : S.s, fr = v[Math.floor(t / 26) % v.length]; return dir === 'right' ? flipC(fr) : fr; },
        rotina: rot([6, 11, 'remendar', 600, 'up'], [12, 11, 'olhar', 300, 'left']), talk: falaJorge3, gone: () => !!G.flags.c3Rainha }),
      marcoEnt(...ES.marco),
      ...ES.postes.map(([x, y], i) => ({ t: 'sign', x, y, h: 96, talk: () => acenderPoste(i) })),
      inimigo('m1', 'mariposa', ...ES.mar1, ['mariposa'], { fly: true, spr: (t, dir) => mariposaArt(Math.floor(t / 8) % 2, false, false), h: 28, bg: bgEstrada }),
      inimigo('m2', 'mariposa', ...ES.mar2, ['mariposa', 'mariposa'], { spr: (t) => mariposaArt(Math.floor(t / 8) % 2, false, false), h: 28, bg: bgEstrada }),
      inimigo('m3', 'mariposa', ...ES.mar3, ['mariposa', 'bandido'], { spr: (t) => mariposaArt(Math.floor(t / 8) % 2, false, false), h: 28, bg: bgEstrada }),
      inimigo('b1', 'bandido', ...ES.band, ['bandido', 'bandido'], { spr: humSpr('bandido'), h: 48, bg: bgEstrada, vision: 5 }),
      bauEnt('estrada', 'a', ...ES.bau1, async () => { G.items.frasco = (G.items.frasco || 0) + 2; await say('* Dentro, dois {y}Frascos de Âmbar{/}. Alguém esqueceu um piquenique muito específico.'); }),
      bauEnt('estrada', 'b', ...ES.bau2, () => dar('cobres', 45)),
      { t: 'trig', x: 32, y: 11, w: 2, h: 2, passa: true, run: rainhaCena },
      ...ES.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: chegaAuren }))
    ],
    onEnter: async () => { if (!G.flags.c3Estrada) { G.flags.c3Estrada = true; await say('* A estrada dos lampiões: postes de ferro a cada cem passos, todos apagados. Em volta de cada um, um redemoinho de asas.'); } }
  };
  // ===== AUREN: BAIRRO BAIXO =====
  const casaA = (x, w, wall, roof, door, extra = {}) => ({ img: casa(Object.assign({ w, wall, roof, door, win: [0.5, w - 1.6] }, extra)), x, y: 8 });
  MAPS2.auren = { rows: ROWS3.auren, name: 'Auren · Bairro Baixo', music: 'auren', batBg: bgAuren, showMoney: true, bg: '#1c2a4a',
    props: [
      casaA(0, 6, '#9a8ab8', '#c84a7a', 1.6),
      casaA(6, 6, '#b88aa8', '#7a3a6a', 2.0, { signC: '#e8c040', doorWin: true, awning: '#5a8ab8' }),
      casaA(12, 7, '#8a90b8', '#a83a6a', 3.0),
      casaA(19, 8, '#a8a0c0', '#4a4a7a', 3.4, { stone: true, signC: '#c84a7a', doorC: '#3a3a5a' }),
      casaA(27, 9, '#9a8ab8', '#c84a7a', 1.0, { chimney: true }),
      ...AUR.feira.map(([x, y], i) => ({ img: memo(() => barracaCom(['#c84a7a', '#5a8ab8', '#e8a040'][i], '#f2ecdc', ['fruta', 'livro', 'lanterna'][i])), x, y: y + 1, solid: [[x, y, 3, 1]] })),
      ...AUR.postes.map(([x, y]) => ({ img: () => poste3Art(true, true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...AUR.arvores.map(([x, y], i) => ({ img: arvC(i + 3), x: x - 1.25, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    ents: [
      ...portas(AUR.estradaDoor, 'estrada', 38, 11, 'left'), ...portas(AUR.papDoor, 'papelaria', ...PA.entra, 'up'),
      ...AUR.festDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: irFestival })),
      marcoEnt(...AUR.marco),
      morador('tico', ...AUR.tico, { rotina: rot([29, 9, 'limpar', 500, 'up'], [31, 9, 'olhar', 300, 'down']), talk: falaTico }),
      morador('pavio', ...AUR.pavio, { rotina: rot([20, 10, 'acender', 260, 'left'], [16, 11, 'acender', 260, 'up'], [26, 11, 'acender', 260, 'up']), passo: 20, talk: falaPavio3 }),
      morador('poeta', ...AUR.poeta, { rotina: rot([14, 15, 'olhar', 600, 'down'], [20, 15, 'olhar', 400, 'right']), talk: falaPoeta }),
      morador('guardaA', ...AUR.guarda, { rotina: rot([33, 11, 'olhar', 9000, 'left']), talk: falaGuarda }),
      morador('feiraA', ...AUR.feirante1, { rotina: rot([12, 17, 'limpar', 400, 'up']), talk: falaFeira(0) }),
      morador('feiraB', ...AUR.feirante2, { rotina: rot([18, 17, 'limpar', 400, 'up']), talk: falaFeira(1) }),
      morador('feiraC', ...AUR.feirante3, { rotina: rot([24, 11, 'limpar', 400, 'up']), talk: falaFeira(2) }),
      morador('crianca2', ...AUR.crianca, { rotina: rot([15, 12, 'brincar', 300, 'down'], [12, 14, 'brincar', 300, 'down']), talk: falaCrianca3 }),
      morador('velha2', ...AUR.velha, { rotina: rot([3, 13, 'rezar', 500, 'up'], [5, 13, 'olhar', 300, 'down']), talk: falaVelha3 }),
      morador('lavadeira', ...AUR.lavadeira, { rotina: rot([30, 19, 'varal', 500, 'up'], [26, 19, 'olhar', 300, 'down']), talk: falaLavadeira }),
      cacadorEnt('auren', 'c0', ...AUR.cacador, AUR.cacPath, { per: 300 }),
      bauEnt('auren', 'a', ...AUR.bau, () => dar('cobres', 35))
    ],
    hunters: true,
    onEnter: async () => { if (G.flags.c3Grim && !G.flags.c3Base) {} }
  };
  // ===== PAPELARIA PENA & FULIGEM =====
  MAPS2.papelaria = { rows: ROWS3.papelaria, name: 'Papelaria Pena & Fuligem', music: 'auren', showMoney: true,
    props: [{ img: memo(() => estanteArt(2)), x: 1, y: 4, solid: [[1, 3, 2, 1]] }, { img: memo(() => estanteArt(2)), x: 9, y: 4, solid: [[9, 3, 2, 1]] }, { img: memo(() => balcaoArt(6)), x: 3, y: 5, solid: [[3, 4, 6, 1]] }, { img: memo(mesaArt), x: 1.8, y: 6, solid: [[2, 5, 2, 1]] }],
    ents: [...portas(PA.door, 'auren', ...AUR.papOut, 'down'),
      morador('iolanda', ...PA.iolanda, { rotina: rot([6, 3, 'limpar', 400, 'down'], [4, 3, 'olhar', 300, 'up']), talk: falaIolanda }),
      { t: 'sign', x: PA.balcao[0], y: PA.balcao[1], h: 30, talk: falaIolanda },
      { t: 'sign', x: PA.mesa[0], y: PA.mesa[1], h: 26, talk: mesaEscrita }]
  };
  // ===== AVENIDA DO FESTIVAL =====
  const tiposB = ['lanterna', 'pastel', 'fruta', 'livro', 'lanterna', 'fruta', 'livro', 'lanterna'], coresB = ['#c84a7a', '#e8a040', '#5a8ab8', '#8a6ab8', '#4a9a7a', '#c84a7a', '#e8a040', '#5a8ab8'];
  MAPS2.festival = { rows: ROWS3.festival, name: 'Auren · Avenida do Festival', music: 'festival', batBg: bgAuren, showMoney: true, bg: '#1c2a4a',
    props: [
      { img: palcoArt, x: 14, y: 6, solid: [[14, 5, 12, 1]] },
      ...FE.barracas.map(([x, y], i) => ({ img: memo(() => barracaCom(coresB[i], '#f2ecdc', tiposB[i])), x, y: y + 1, solid: [[x, y, 3, 1]] })),
      ...[[3, 7], [12, 7], [27, 7], [36, 7], [6, 18], [16, 18], [24, 18], [34, 18]].map(([x, y]) => ({ img: () => poste3Art(true, true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] }))
    ],
    overlay: varalLanternas,
    ents: [
      ...portas(FE.aurenDoor, 'auren', ...AUR.festOut, 'left'),
      marcoEnt(...FE.marco),
      { t: 'sign', x: FE.pastel[0] + 1, y: FE.pastel[1], h: 40, talk: barracaPastel },
      ...FE.povo.map(([x, y], i) => morador('povo' + ((i % 5) + 1), x, y, { rotina: rot([x, y, ['dancar', 'olhar', 'conversar', 'brindar', 'dancar'][i % 5], 400 + i * 40, i % 2 ? 'up' : 'down']), talk: falaPovo(i) })),
      ...FE.frente.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: discursoVesper }))
    ]
  };
  // ===== O INTERIOR DO BAÚ (a base) =====
  MAPS2.interior = { rows: ROWS3.interior, name: 'Interior do Baú', music: 'base', bg: '#140c1c', key: { 'o': { t: 'piso' }, 'w': { t: 'parm', solid: true }, 'r': { t: 'tapete' } },
    props: [
      { img: estanteGrim, x: 6, y: 4, solid: [[6, 3, 2, 1]] },
      { img: () => baseArt('vela'), x: 3.2, y: 4, by: 60 },
      { img: () => baseArt('meia'), x: 10.1, y: 4, by: 60 },
      { img: () => baseArt('cama'), x: 1, y: 8, solid: [[1, 6, 2, 2]] },
      { img: () => baseArt('forja'), x: 11, y: 8, solid: [[11, 7, 2, 1]] },
      { img: () => baseArt('quadro'), x: 8.6, y: 2.6, by: 40 }
    ],
    ents: [
      { t: 'sign', x: IN.estante[0], y: IN.estante[1], h: 54, talk: () => abrirGrimorio() },
      { t: 'sign', x: IN.estante[0] + 1, y: IN.estante[1], h: 54, talk: () => abrirGrimorio() },
      { t: 'sign', x: IN.vela[0], y: IN.vela[1], h: 22, talk: falaVela },
      { t: 'sign', x: IN.meia[0], y: IN.meia[1], h: 16, talk: falaMeia },
      { t: 'sign', x: 2, y: 6, h: 30, talk: camaBase }, { t: 'sign', x: 1, y: 6, h: 30, talk: camaBase },
      { t: 'sign', x: IN.forja[0], y: IN.forja[1], h: 30, talk: falaForja }, { t: 'sign', x: 12, y: 7, h: 30, talk: falaForja },
      { t: 'sign', x: IN.parede[0], y: IN.parede[1], h: 40, talk: falaParede }, { t: 'sign', x: IN.parede[0] + 1, y: IN.parede[1], h: 40, talk: falaParede },
      ...IN.saida.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: sairDaBase }))
    ]
  };
  for (const id of ['estrada', 'auren', 'papelaria', 'festival', 'interior']) { const m = MAPS2[id]; m.baked = null; for (const p of m.props || []) { const f = p.img; p.casaO = f.casaO; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } }
}; }

// ---------- falas ----------
async function falaJorge3() { await say(pickOne(['A correia arrebentou. De novo. O 31 é igual eu: precisa de um tempo antes de cada ladeira.', 'Vão na frente. Eu remendo a correia e alcanço vocês. Se escurecer, acendam um poste. Mariposa gosta de luz, não de gente.', 'Na Terra eu também tinha um ônibus que quebrava. Era esse.']), 'jorge'); }
async function acenderPoste(i) {
  if (G.flags['c3poste' + i]) { await say('* O lampião está aceso. As mariposas fazem roda em volta dele, felizes, e esquecem de vocês.'); return; }
  if (!G.flags.c3PosteTut) { G.flags.c3PosteTut = true; await say('Mariposa vai atrás de luz. Se eu acender o poste, elas largam a gente e vão pra ele.', 'lume'); }
  const c = await choose('* Acender o lampião?', ['Acender (a Lume acende)', 'Deixar']); if (c !== 0) return;
  G.flags['c3poste' + i] = true; sfx('rune');
  const [px, py] = ES.postes[i]; let n = 0;
  for (const e of W2.ents.slice()) if (e.t === 'foe' && e.group.every(g => g === 'mariposa') && Math.abs(e.x - px) + Math.abs(e.y - py) <= 7) { G.gone2[W2.id + ':' + e.id] = true; W2.ents = W2.ents.filter(q => q !== e); n++; }
  await say(n ? '* A lanterna acende. As mariposas da redondeza esquecem completamente de vocês e vão girar em volta da luz. Caminho livre.' : '* A lanterna acende. O pedaço de estrada fica dourado. Não tinha mariposa por perto, mas ficou bonito.');
  save2();
}
async function rainhaCena() {
  if (G.flags.c3Rainha) return;
  W2.mv = null;
  await say('* No fim da estrada, o último poste está torto, com a lanterna arrebentada. Pendurada nele, uma mariposa do tamanho de uma carroça, comendo os restos da luz como quem lambe um prato.');
  await say('Isso aí não é mariposa. Isso é uma mariposa que comeu as outras mariposas.', 'rita');
  await say('Ela tá olhando pra mim. Por que todo bicho de luz olha pra mim?', 'lume');
  await say('[Mariposa-Rainha. Come luz. Faísca e golpes de luz a CURAM. Use fogo, mordida, a lança. E o Grimório, se você tivesse um.]', 'cat');
  const r = await lutaMapa(['rainha'], { bg: bgEstrada, music: 'boss', pos: [[184, 156]], intro: async () => { const e = BT.foes[0]; e.phases = fasesRainha(); e.ct = 20; callout('MARIPOSA-RAINHA', '#ffd8a0', 100); } });
  if (r !== 'win') return;
  G.flags.c3Rainha = true; save2();
  await say('* A Rainha cai em cima do poste torto, que finalmente desiste e deita na grama. Do meio das asas, sai um pó dourado que sobe e vira um monte de mariposinhas comuns, que vão embora assobiando.');
  await say('Lá na frente: a capital. Dá pra ver daqui. ...É meio-dia e ela tá ACESA.', 'rita');
}
async function chegaAuren() {
  if (!G.flags.c3Rainha) { await say('* O caminho segue para a capital. Mas a Mariposa-Rainha está pendurada no último poste, e ninguém passa por baixo dela.'); W2.mv = null; loadMap2('estrada', 33, 11, 'left'); return; }
  if (G.flags.c3Chegou) { await fadeOut(10); loadMap2('auren', ...AUR.chegada, 'right'); await fadeIn(10); return; }
  G.flags.c3Chegou = true;
  await fadeOut(20);
  CENA.bg = bgAuren; CENA.extra = null;
  const bus = { x: -80, y: 156, fr: () => busArt() };
  CENA.actors = [bus, { x: 150, y: 152, fr: standF('lumeh') }, { x: 166, y: 160, fr: chestF() }, { x: 182, y: 156, fr: standF('rita') }, { x: 214, y: 154, fr: humF('guardaA', 's') }];
  V.scene = 'cena'; playMusic('auren'); await fadeIn(30);
  await tw2cena(70, p => { bus.x = -80 + ease.out(p) * 100; });
  await say('Bi-bi! Cheguei. A correia aguentou. Quer dizer: alguém trocou a correia.', 'jorge');
  await say('Uns acendedores de casaco cinza apareceram na estrada. Trocaram a correia em dois minutos, educadíssimos. Não cobraram. Nem disseram o nome.', 'jorge');
  await say('...Nem disseram o nome, ou não tinham nome pra dizer?', 'rita');
  await say('* Auren. A capital. Torres lilases, varandas rosa, pontes sobre canais. E postes. Postes em todo canto, de todo tamanho, todos acesos. Ao meio-dia.');
  await say('Ela é linda. Ela é toda... acesa. Ninguém aqui deve ter medo do escuro.', 'lume');
  await say('Bagagem?', 'guardaA');
  await say('Bagagem.', 'rita');
  await say('* O guarda olha para você. Você é bagagem com muita convicção. Ele carimba um papel e abre o portão.');
  await say('O Festival da Luz começa em três dias, à noite, na Avenida. A cidade inteira fica acordada. Ordem do Acendedor-Mor: ninguém dorme no escuro durante a festa.', 'guardaA');
  await say('E a gente dorme onde? A gente tem zero cobres e um ônibus.', 'lume');
  await say('No ônibus. Eu deixo o 31 no pátio da estação. Tem banco reclinável. Um. Pra quatro.', 'jorge');
  await say('[Lembrete: as anotações da Ofélia citam uma TINTA DE SUPERFÍCIE. Uma capital tem papelaria. Uma papelaria tem quem saiba de tinta.]', 'cat');
  await say('* (Procure uma papelaria no Bairro Baixo. A capital também tem Caçadores: a forma humana ajuda.)');
  await fadeOut(20);
  G.marco = { map: 'auren', x: AUR.marco[0], y: AUR.marco[1] }; save2();
  V.scene = 'world'; loadMap2('auren', ...AUR.chegada, 'right'); await fadeIn(20);
}
// ----- Auren -----
async function falaGuarda() { await say(G.flags.c3Base ? 'Três dias pro Festival. Depois disso, a cidade não apaga mais. Palavra do Acendedor-Mor.' : pickOne(['A Avenida do Festival só abre na noite da festa. Ordem de cima.', 'Bagagem não passa sem dono. Você tem dono, bagagem?', 'Nunca vi a cidade tão acesa. Dá até saudade de estrela.']), 'guardaA'); }
async function falaPoeta() { await say(pickOne(['Escrevi um soneto pro escuro. Ninguém quis ouvir. Disseram que dá azar falar dele em semana de festa.', 'Antes dos postes novos, a gente via a Via Láctea daqui da ponte. Agora a gente vê poste.', 'A tinta da Dona Iolanda é a melhor da capital. Ela diz que tinta boa leva um pouco de quem escreve.']), 'poeta'); }
const falaFeira = i => async () => { await say([pickOne(['Fruta da serra! Fresquinha! ...Bom, fresca. ...Bom, fruta.', 'Na festa eu vendo maçã do amor acesa. Tem uma vela dentro. Não come a vela.']), pickOne(['Livro usado, dois cobres! Esse aqui é de receita de tinta. Ah, a Dona Iolanda tem um igual, na papelaria.', 'Vendo almanaque. O deste ano diz que o inverno vai ser escuro. Mandaram recolher.']), pickOne(['Lanterna de papel, pra festa! Todo mundo tem que andar aceso. É bonito. É obrigatório. Mas é bonito.', 'Cinco lanternas, um cobre cada. Pra moça que brilha, eu faço três.'])][i], 'feira'); };
async function falaCrianca3() { await say(pickOne(['Minha mãe diz que se apagar a luz o Bicho do Escuro pega. Eu acho que o Bicho do Escuro tem medo da festa.', 'Moço baú, você brinca de esconde-esconde? Você é muito bom de esconder. Parece mala.']), 'povo'); }
async function falaVelha3() { await say(pickOne(['Doze anos atrás a cidade ficou quarenta noites no escuro. Quarenta. Eu rezo toda tarde pra não voltar.', 'Morreu gente naquele inverno. No hospital dos pobres. Sem vela, sem âmbar. A filhinha de um homem importante também, dizem.']), 'povo'); }
async function falaLavadeira() { await say(pickOne(['Roupa no varal de noite seca com a luz do poste. Coisa de capital.', 'Os Pavios passam aqui de madrugada. Educados. Só que um deles me chamou de "mãe" ontem. Eu nunca vi aquele rapaz.']), 'povo'); }
async function falaPavio3() {
  if (G.flags.c3Grim) { await say(pickOne(['Boa tarde. Mais óleo? A lamparina de vocês tá cheia, eu vejo daqui.', 'Eu acendo, eu acendo. Quando eu acendo, eu quase lembro de alguma coisa.']), 'pavio'); return; }
  if (!G.flags.c3Iolanda) { await say(pickOne(['Boa tarde. Poste aceso, cidade feliz.', 'Eu acendo os postes ao meio-dia. Ordem é ordem. Eu não lembro quem deu a ordem.']), 'pavio'); return; }
  if (G.flags.c3Oleo) { await say('Cuidado com o óleo. Óleo bom é óleo de lembrança. ...Não sei por que eu disse isso.', 'pavio'); return; }
  await say('Óleo de lamparina? Tenho. Sempre tenho. Leva o vidrinho. Ninguém nunca me pede nada.', 'pavio');
  await say('* Ele enche um vidrinho com cuidado, como quem serve chá para uma pessoa querida. As mãos dele tremem um pouco.');
  await say('Óleo bom é óleo de lembrança. ...Não sei por que eu disse isso. Desculpa. Bom dia. Boa tarde. Que horas são?', 'pavio');
  sfx('item'); G.flags.c3Oleo = true; await say('* Você recebeu o {y}Óleo de Lamparina{/}.'); save2();
}
async function falaTico() {
  if (G.flags.c3Fuligem) { await say(pickOne(['Valeu pelas mariposas! Se precisar de mais fuligem, eu tenho chaminé pra dar e vender. Vender, na verdade.', 'Meu irmão também limpava chaminé. Agora ele acende poste. Virou Pavio. Ele passa por mim e diz "bom dia, rapazinho".']), 'tico'); return; }
  if (!G.flags.c3Iolanda) { await say(pickOne(['Limpa-chaminé, às ordens! ...Não, eu não preciso de ajuda. Preciso de cobre.', 'O telhado tá cheio de mariposa. Elas vêm pela luz e ficam. Ninguém sobe mais lá.']), 'tico'); return; }
  await say('Fuligem de poste? Tenho um saco inteiro! Mas só dou se vocês espantarem as mariposas do meu telhado. Elas comeram a minha lamparina.', 'tico');
  const c = await choose('* Espantar as mariposas do telhado?', ['Vamos lá', 'Agora não']); if (c !== 0) return;
  const r = await lutaMapa(['mariposa', 'mariposa'], { bg: bgAuren, music: 'luta2' }); if (r !== 'win') return;
  await say('Vocês são bons! Toma: fuligem do poste da Rua do Sino. A mais preta da capital.', 'tico');
  sfx('item'); G.flags.c3Fuligem = true; await say('* Você recebeu a {y}Fuligem de Poste{/}.');
  await say('Meu irmão, o Dito, também limpava chaminé. Aí ele assinou com o Acendedor-Mor. Salário bom, pensão pra família, tudo certo.', 'tico');
  await say('Só que agora ele passa por mim na rua e diz "bom dia, rapazinho". Como se eu fosse qualquer um.', 'tico');
  await say('...Ele vai lembrar de mim. Na festa. Todo mundo fica feliz na festa.', 'tico');
  save2();
}
async function falaIolanda() {
  if (!G.flags.c3Iolanda) {
    G.flags.c3Iolanda = true;
    await say('Bem-vindos à Pena & Fuligem! Papel, pena, tinta, cola, e um gato que não é meu. Que lustre... digo, que moça bonita.', 'iolanda');
    await say('* Você abre a tampa só uma fresta e deixa a Rita tirar o Catálogo. Ele abre sozinho numa página com uma letra redonda e apertada.');
    await say('[Anotação da Ofélia, na margem: "Tinta sem âmbar: fuligem de poste, óleo de lamparina e uma lágrima de quem escreve."]', 'cat');
    await say('* A Dona Iolanda ajeita os óculos. Os olhos dela brilham, como quem reconhece uma letra.');
    await say('Receita de escriba das antigas! Fazia anos que eu não via. Tinta que pega até em pedra, em pele, em... baú.', 'iolanda');
    await say('Fuligem de poste: o Tico, o limpa-chaminé, tem de sobra. Óleo de lamparina: qualquer acendedor tem. A lágrima...', 'iolanda');
    await say('A lágrima tem que ser de quem escreve. Escreve de verdade, com o coração. Isso não se compra, meu bem. Isso acontece.', 'iolanda');
    await say('* (Pegue a FULIGEM com o Tico, perto da chaminé do cortiço, e o ÓLEO com um Pavio. Depois volte aqui.)');
    save2(); return;
  }
  if (G.flags.c3Grim) { await say(pickOne(['Eu não vi um baú engolir três pessoas na minha loja. Eu vendo papel. Papel não vê nada.', 'Se faltar tinta, a receita é a mesma. Mas a lágrima... essa eu não vendo.']), 'iolanda'); return; }
  if (!G.flags.c3Fuligem || !G.flags.c3Oleo) { await say(`Falta ${[!G.flags.c3Fuligem && 'a fuligem (o Tico)', !G.flags.c3Oleo && 'o óleo (um Pavio)'].filter(Boolean).join(' e ')}. A lágrima vem por último. Sempre vem.`, 'iolanda'); return; }
  await say('Fuligem e óleo. Agora sente ali na mesa de escrever. Quem escreve aqui?', 'iolanda');
  await say('* (Vá até a mesa de escrever, no canto da loja.)');
}
async function mesaEscrita() {
  if (G.flags.c3Grim) { await say('* A mesa ainda cheira a fuligem e óleo. Tem uma folha esquecida, com uma letra que treme.'); return; }
  if (!G.flags.c3Fuligem || !G.flags.c3Oleo) { await say('* Uma mesa de escrever, com pena, mata-borrão e um tinteiro vazio, esperando.'); return; }
  await cenaLagrima();
}
// ----- a lágrima: a Lume tenta escrever a música do ônibus -----
async function cenaLagrima() {
  await say('Quem escreve aqui? Eu sou baú. A Rita é escudeira. O Catálogo é... o Catálogo.', 'lume');
  await say('Você escreve, Lume.', 'rita');
  await say('Eu?', 'lume');
  await say('A música. A do fundo do 31. Você cantava toda noite. Alguém escreveu aquilo. E eu tenho quase certeza que foi você.', 'rita');
  await say('* A Lume fica quieta um tempo. Depois senta na mesa, pega a pena com as duas mãos, como quem pega um passarinho.');
  await say('Eu escrevi, sim. No caderno da escola, atrás da tabuada. A primeira parte saiu inteira, numa noite. A segunda...', 'lume');
  await say('* Ela escreve. A pena arranha o papel devagar. Você não consegue ler de onde está, mas consegue ver o ritmo: é o ritmo da música.');
  await say('* Ela para. Sempre no mesmo lugar. A pena fica suspensa em cima do papel, tremendo.');
  await say('É aqui. Toda noite eu parava aqui. Eu inventava o resto, cantando, e esquecia antes do ponto seguinte. Toda noite um final diferente. Nenhum servia.', 'lume');
  await say('Eu parava aqui porque... porque o ônibus chegava no meu ponto. E eu descia. E pensava: amanhã eu termino.', 'lume');
  await say('...E aí teve a curva.', 'lume');
  sfx('cancel');
  await say('* Uma lágrima cai da ponta do nariz da Lume, bem dentro do tinteiro. Ploc.');
  await say('* A Dona Iolanda não diz nada. Ela só derrama a fuligem e o óleo no tinteiro, devagar, e mexe com a ponta da pena. A tinta fica preta, depois azul, depois de uma cor que não tem nome.');
  await say('Pronto. Tinta de escriba. Feita com o que se perdeu no caminho. É sempre assim.', 'iolanda');
  await say('Eu não sabia que você lembrava da música, Rita.', 'lume');
  await say('Eu lembro do pedaço que você cantava. Duas fileiras na frente. Eu ODIAVA. ...Eu sabia de cor.', 'rita');
  sfx('item'); await say('* Você recebeu a {y}Tinta de Superfície{/}.');
  await cenaGrimorio();
}
// ----- o Grimório acorda -----
async function cenaGrimorio() {
  await say('* Você abre a tampa. O Grimório está lá dentro, com as páginas em branco. A Lume molha a pena e encosta na primeira página.');
  sfx('rune');
  await say('* A tinta escorre sozinha. Desenha as runas que você conhece, uma de cada vez, como quem lembra uma receita: Brasa. Geada. Seiva.');
  await say('* E uma quarta, que você nunca viu: uma runa feita da própria tinta, preta e macia. FULIGEM.');
  await say('[As runas acordaram. E com a tinta veio a Fuligem: fumaça que deixa os inimigos TONTOS.]', 'cat');
  await say('[O Grimório agora aceita PÁGINAS: cada página é um feitiço que você monta. ELEMENTO + FORMA. Dois elementos = FUSÃO.]', 'cat');
  await say('* Nas margens, a tinta faz mais letras. Redondas, apertadas, rápidas. Não são do Catálogo.');
  await say('[Esta caligrafia não é minha. É da Ofélia. Ela deixou anotações nas margens: a cada fusão que você descobrir, a anotação dela aparece.]', 'cat');
  await say('A Ofélia anotava até receita de bolo. Ela ia AMAR isso.', 'lume');
  const Gm = grim(); Gm.ativo = true; Gm.elems = ['brasa', 'geada', 'seiva', 'fuligem'];
  Gm.slots = [{ e: ['brasa'], f: 'dardo' }, { e: ['geada'], f: 'onda' }, { e: ['seiva'], f: 'veu' }];
  G.flags.c3Grim = true;
  await say('* (GRIMÓRIO: as 3 runas antigas já estão escritas. A 4ª página está em branco: monte um feitiço. Escolha 2 elementos diferentes para tentar uma FUSÃO.)');
  await abrirGrimorio(true);
  await say('* (Dá para reescrever as páginas quando quiser: MENU > Grimório.)');
  save2();
  await cenaVao();
}
// ----- a Runa do Vão: o baú abre por dentro -----
async function cenaVao() {
  await say('* Sobra um pingo de tinta na pena. A Lume vai limpar no pano e, sem querer, o pingo escorre para o fundo da tampa. Onde tem uma runa gasta, quase apagada, que nunca acendeu.');
  sfx('rumble'); V.shake = 16;
  await say('[Alerta. Runa do fundo da tampa reativada: VÃO. Classificação: espaço dobrado. Recomendação: segurem-se.]', 'cat');
  await say('Segurar em QUÊ?', 'rita');
  await fadeOut(24); sfx('rune');
  G.flags.c3Base = true; G.baseVolta = { map: 'papelaria', x: PA.entra[0], y: PA.entra[1] - 1, dir: 'down' };
  loadMap2('interior', ...IN.entra, 'up'); V.scene = 'world'; await fadeIn(30);
  await say('* Vocês caem. Não pra baixo: pra dentro. E aterrissam num quartinho de madeira escura, do tamanho de uma sala, que cheira a baú velho e a vela.');
  await say('...É maior por dentro. Eu FALEI. Lá no rio, eu falei que era maior por dentro e ninguém me levou a sério.', 'lume');
  await say('Isso aqui é... você? A gente tá DENTRO de você?', 'rita');
  await say('[Interior do Baú. Espaço dobrado pela Runa do Vão. Tudo o que você guardou na vida inteira fica do lado de lá dessas paredes. Por enquanto, sobrou isto.]', 'cat');
  await say('* No canto, uma vela apagada. Na parede, um quadro vazio. No chão, perto da estante, uma meia vermelha listrada. Uma só.');
  await say('A meia. A meia misteriosa. Ela existe. Ela tá AQUI.', 'lume');
  await say('Uma estante vazia, um canto que dá uma forja, uma cama... dá pra morar aqui. Sério. Dá pra morar aqui.', 'rita');
  await say('[A Runa do Vão está ligada aos Marcos: em qualquer Marco, dá para ENTRAR NO BAÚ. A estante guarda o Grimório. A cama, descanso. O resto, a gente arruma.]', 'cat');
  await say('A gente tem casa. Zero cobres, mas tem casa.', 'lume');
  await say('* (BASE: num Marco, escolha "Entrar no Baú". Aqui dentro: estante = Grimório, cama = descansar até de manhã ou à noite. Saia pela porta de baixo.)');
  save2();
}
async function sairDaBase() {
  const B = G.baseVolta || { map: 'auren', x: AUR.marco[0], y: AUR.marco[1] + 1, dir: 'down' };
  sfx('rune'); await fadeOut(14); loadMap2(B.map, B.x, B.y, B.dir || 'down'); await fadeIn(14);
  if (B.map === 'papelaria' && !G.flags.c3SaiuPap) { G.flags.c3SaiuPap = true; await say('Eu não vi nada. Eu vendo papel. Papel não vê nada.', 'iolanda'); await say('* (O Festival começa à noite, daqui a três dias, na Avenida, a leste do Bairro Baixo.)'); }
}
// ----- coisas da base -----
async function falaVela() {
  if (!G.flags.c3Vela) { G.flags.c3Vela = true; await say('Deixa comigo.', 'lume'); sfx('rune'); await say('* A Lume encosta o dedo no pavio. A vela acende com uma chama pequena, teimosa, que não dança. O quartinho fica da cor de mel.'); await say('Pronto. Agora é casa.', 'lume'); return; }
  await say(pickOne(['* A vela continua acesa. Ela não gasta. A Lume diz que é porque ela "pediu com jeito".', '* A chama não mexe nem quando vocês passam. Parece que está escutando.']));
}
async function falaMeia() {
  const n = G.flags.c3Meia = (G.flags.c3Meia || 0) + 1;
  const L = ['* Uma meia vermelha listrada. Uma só. Você não lembra de onde ela veio. Mas lembra que ela é sua.', 'Será que o par tá em outro baú? Em outro mundo? Dentro de OUTRA pessoa?', '* Você a deixa dobrada. Ela se desdobra sozinha. Você decide que isso não é problema seu.', 'Eu vou descobrir a história dessa meia nem que seja a última coisa que eu faça.', '* A meia continua ali. Tranquila. Misteriosa. Uma meia que sabe coisas.'];
  await say(L[Math.min(n - 1, L.length - 1)], n === 2 || n === 4 ? 'lume' : 'n');
}
async function camaBase() {
  const c = await choose('* A cama é pequena, de tampa de baú forrada. Descansar?', ['Até a manhã', 'Até a noite', 'Agora não'], 'n', 2);
  if (c === 2 || c < 0) return;
  await fadeOut(20); curarTudo(); if (c === 0 || hora() > 19 * 60 + 30) G.dia = (G.dia || 0) + 1; G.hora = c === 0 ? 7 * 60 : 19 * 60 + 30;
  save2(); loadMap2(W2.id, W2.x, W2.y, W2.dir); await fadeIn(20);
  await say(c === 0 ? '* Vocês dormem amontoados, a Rita de botas, a Lume de cabeça para baixo, você de tampa fechada. É a melhor noite de sono desde a masmorra.' : '* Um cochilo comprido. Quando vocês acordam, lá fora já é noite. Aqui dentro, a vela continua igual.');
}
async function falaForja() { await say(pickOne(['Aqui vai a minha forja. Bigorna, fole, balde. Falta tudo. Menos a vontade.', 'Assim que eu achar uma bigorna, eu conserto a lança, faço escudo, faço até panela.']), 'rita'); }
async function falaParede() { await say(G.flags.c3Discurso ? '* O quadro vazio. A Rita diz que parede vazia é parede esperando história. Você tem a impressão de que logo vai ter coisa demais para pendurar.' : '* Um quadro vazio na parede. Do lado de cá, nada. Do lado de lá, você tem certeza, está tudo o que você guardou na vida.'); }
// Marco: entrar no baú
{ const _um3 = usarMarco; usarMarco = async function (e) {
  if (G.flags.c3Base && W2.id !== 'interior') {
    const c = await choose('* O Marco brilha com a runa da sua tampa.', ['Descansar e salvar', 'Entrar no Baú (a base)', 'Sair'], 'n', 2);
    if (c === 1) { sfx('rune'); save2(); G.baseVolta = { map: W2.id, x: W2.x, y: W2.y + 1, dir: 'down' }; await fadeOut(14); loadMap2('interior', ...IN.entra, 'up'); await fadeIn(14); return; }
    if (c !== 0) return;
  }
  return _um3(e);
}; }
// ----- Festival -----
async function irFestival() {
  if (!G.flags.c3Base) { await say('Avenida do Festival fechada até a noite da festa. Ordem de cima.', 'guardaA'); W2.mv = null; loadMap2('auren', ...AUR.festOut, 'left'); return; }
  if (!G.flags.c3Noite1) {
    const c = await choose('* Esperar até a noite de abertura do Festival da Luz? (Três dias passam.)', ['Esperar', 'Ainda não']);
    if (c !== 0) { W2.mv = null; loadMap2('auren', ...AUR.festOut, 'left'); return; }
    G.flags.c3Noite1 = true; await fadeOut(24); curarTudo(); G.dia = (G.dia || 0) + 3; G.hora = 19 * 60 + 40;
    await cartao(['Três dias depois', 'A noite de abertura']);
    V.scene = 'world'; loadMap2('festival', ...FE.chegada, 'right'); await fadeIn(24);
    await say('* A Avenida do Festival. Lanternas de papel penduradas de poste em poste, barracas de comida, um palco enorme com um sol de lata. A cidade inteira está na rua. E nenhum canto está escuro.');
    await say('* No meio de tanta luz, um lustre flutuando é só mais um enfeite. Pela primeira vez na superfície, ninguém olha duas vezes para a Lume.');
    await say('Ninguém tá olhando pra mim. Ninguém tá olhando pra mim! Isso é o MELHOR dia da minha vida!', 'lume');
    await say('Tem cheiro de pastel.', 'rita');
    await say('* (No festival não há Caçadores. O discurso de abertura é na frente do palco.)');
    save2(); return;
  }
  await fadeOut(10); loadMap2('festival', ...FE.chegada, 'right'); await fadeIn(10);
}
function varalLanternas(ox, oy) {
  const cores = ['#ff7aa8', '#ffd060', '#8fe3d8', '#ff9a50', '#c8a0ff'];
  for (const [y0, x0, x1] of [[7.2, 3, 12], [7.2, 27, 36], [18.2, 6, 16], [18.2, 24, 34], [7.2, 12, 27]]) {
    const ax = x0 * TS + 8 - ox, bx_ = x1 * TS + 8 - ox, ay = y0 * TS - 88 - oy;
    for (let i = 0; i <= 20; i++) { const p = i / 20, x = ax + (bx_ - ax) * p, y = ay + Math.sin(p * Math.PI) * 14; bx.fillStyle = '#3a2430'; bx.fillRect(Math.round(x), Math.round(y), 2, 1); if (i % 3 === 1) { const c = cores[(i + x0) % cores.length]; bx.fillStyle = c; bx.fillRect(Math.round(x) - 1, Math.round(y) + 1, 4, 5); bx.fillStyle = '#ffffff'; bx.globalAlpha = 0.5; bx.fillRect(Math.round(x), Math.round(y) + 2, 1, 2); bx.globalAlpha = 1; } }
  }
}
const falaPovo = i => async () => { await say(['Que festa! Que luz! Eu não vejo a minha sombra faz três dias!', 'Dizem que o conde vai anunciar uma coisa enorme hoje. Um farol!', 'Dança comigo, bagagem! ...Brincadeira. Ou não.', 'Saúde! À luz! Ao Acendedor-Mor! A quem paga a conta da luz! ...Quem paga a conta da luz?', 'Minha avó diz que festa demais esconde alguma coisa. Minha avó não veio.', 'Mamãe, olha o lustre voando! ...Mamãe disse que é enfeite.', 'Os Pavios montaram o palco em uma noite. Sem dormir. Nem conversar.', 'Eu trouxe o meu filho pra ver o farol. Ninguém mais vai morrer no escuro. Ninguém.'][i % 8], 'povo'); };
async function barracaPastel() {
  if (G.flags.c3Pastel) { await say(pickOne(['Mais um? A casa agradece. O pastel não. O pastel quer ser comido.', 'Pastel de queijo, de carne, de vento e de lembrança. O de lembrança acabou.']), 'fatima'); return; }
  await say('Pastel! Pastel de feira da serra, frito na hora! Três cobres!', 'fatima');
  if (!deRosto()) { await say('* A Rita olha para a barraca. Depois para você. Depois para a barraca.'); await say('Pastel se come com boca, @. Arruma um rosto primeiro.', 'rita'); await say('* (Use a forma humana, botão B, e volte aqui.)'); return; }
  await cenaPastel();
}
async function cenaPastel() {
  const H = G.her || {}, prom = !!(H.esc && H.esc.rita), perdeu = !!(H.mem && H.mem.pastel);
  G.flags.c3Pastel = true;
  if (prom || G.flags.pastelRita) {
    await say('* A Rita bate a mão no balcão antes de você abrir a boca.');
    await say('Dois de queijo. Por minha conta. Promessa de escudeira.', 'rita');
    await say('* Ela conta os cobres na palma da mão. Sobram dois. Ela sorri como quem gastou uma fortuna.');
  } else {
    await say('Dois de queijo. Eu pago. Amigos de ônibus dividem pastel. É regra. Acabei de inventar.', 'rita');
  }
  G.cobres = Math.max(0, (G.cobres || 0) - 6);
  await say('* A Dona Fátima entrega dois pastéis num papel pardo, que fica transparente na hora. Estão quentes demais. É o tamanho certo de quente.');
  await say('* Vocês sentam na beira da calçada, longe do palco. Você morde.');
  if (perdeu) {
    await say('* E alguma coisa volta. Você tinha perdido isso na masmorra, junto com outras coisas: o gosto de pastel de feira. Agora ele está aqui de novo, inteiro, com a casquinha estalando.');
    await say('* Volta junto um pedaço de lembrança: uma feira de domingo, uma barraca azul, alguém dizendo "esse é de queijo, cuidado que queima".');
    G.flags.pastelVoltou = true;
  } else await say('* É o melhor pastel que você já comeu. Inclusive na Terra. Talvez porque, na Terra, você nunca comeu pastel com alguém que esperou vinte e três anos por isso.');
  await say('Na Terra, no ponto final do 31, tinha uma barraca de pastel. Eu passava lá toda sexta. Toda sexta eu pensava: um dia eu chamo o moço do fone.', 'rita');
  await say('Eu nunca chamei. Aí eu morri, nasci, cresci, virei escudeira, e o moço do fone virou mala.', 'rita');
  const c = await choose('* Ela ri, mas não olha pra você.', ['"Agora você chamou."', '"Valeu a espera?"', '"Tá queimando a boca."']);
  if (c === 0) { await say('...É. Agora eu chamei.', 'rita'); await say('* Ela fica um tempo olhando para o pastel na mão, como se ele tivesse respondido uma pergunta difícil.'); }
  else if (c === 1) { await say('Pergunta difícil. O pastel valeu. O resto... eu te conto quando você tiver um rosto que não derrete.', 'rita'); }
  else { await say('* A Rita ri tanto que engasga, e você tem que bater nas costas dela, e alguém da barraca do lado aplaude achando que é número de circo.'); await say('Tá. Tá. Momento arruinado. Do jeito que eu gosto.', 'rita'); }
  await say('* Lá no alto, presa num fio de lanternas, a Lume finge que está conversando com uma lanterna de papel. A lanterna não responde. A Lume conversa assim mesmo.');
  save2();
}
// ----- o discurso do Acendedor-Mor (fim da Parte 1) -----
async function discursoVesper() {
  if (G.flags.c3Discurso || !G.flags.c3Noite1) return;
  W2.mv = null; G.flags.c3Discurso = true;
  if (deRosto()) desfazRosto();
  await fadeOut(20);
  CENA.bg = bgAuren; const tint = { a: 0.25 };
  const vesper = { x: 120, y: 112, fr: humF('vesper') }, p1 = { x: 84, y: 114, fr: humF('pavio') }, p2 = { x: 156, y: 114, fr: humF('pavio') }, dito = { x: 184, y: 114, fr: humF('dito') };
  const lume = { x: 70, y: 168, fr: t => IMG.sp.lume ? IMG.sp.lume[Math.floor(t / 20) % IMG.sp.lume.length] : null, oy: -14 }, rita = { x: 96, y: 172, fr: standF('rita') }, bau = { x: 82, y: 176, fr: chestF() };
  const tico = { x: 220, y: 172, fr: humF('tico', 's') };
  CENA.extra = () => { bx.fillStyle = '#5a3044'; bx.fillRect(30, 114, 180, 10); bx.fillStyle = '#7a1a3a'; bx.fillRect(40, 40, 160, 74); bx.fillStyle = '#e8b040'; bx.fillRect(40, 40, 160, 2); for (let i = 0; i < 12; i++) { bx.fillStyle = ['#ff7aa8', '#ffd060', '#8fe3d8'][i % 3]; bx.fillRect(44 + i * 13, 30 + Math.round(Math.sin(i) * 3), 4, 5); } bx.globalAlpha = tint.a; bx.fillStyle = '#100a24'; bx.fillRect(0, 12, W, 200); bx.globalAlpha = 1; };
  CENA.actors = [vesper, p1, p2, dito, lume, rita, bau, tico];
  V.scene = 'cena'; playMusic(null); await fadeIn(30);
  await say('* O palco acende de uma vez. A multidão faz silêncio. Um homem alto, de cartola e cabelo prateado, sobe os degraus devagar, tirando as luvas sujas de fuligem.');
  await say('Boa noite, Auren.', 'vesper');
  await say('Doze invernos atrás, esta cidade ficou quarenta noites no escuro. O âmbar acabou. Os postes morreram um por um. Vocês lembram.', 'vesper');
  await say('* Ninguém responde. Todo mundo lembra.', 'n');
  await say('No hospital dos pobres, as velas acabaram na terceira noite. Gente morreu sem ver o rosto de quem segurava a sua mão.', 'vesper');
  await say('* Ele para. Só um segundo. Ajeita a cartola.');
  await say('Eu prometi a mim mesmo que isso não aconteceria de novo. E hoje eu posso prometer a vocês.', 'vesper');
  await say('Na última noite deste festival, nós vamos acender o FAROL DE CEM INVERNOS. Luz para cem anos. Nenhuma criança desta cidade vai dormir no escuro outra vez.', 'vesper');
  sfx('rune'); V.shake = 8;
  await say('* A Avenida explode em aplauso. Gente chorando, gente abraçada, gente levantando os filhos no ar. As lanternas de papel tremem com o barulho.');
  await say('...Cem anos sem escuro.', 'lume');
  await say('* A Lume não está aplaudindo. Está quieta, as velas tremendo, olhando para o palco como quem olha para uma janela acesa numa noite de chuva.');
  await say('Bonito discurso. Só fico pensando de onde vem tanta luz. Âmbar não cai do céu.', 'rita');
  await say('* No palco, o Acendedor-Mor passa o olho pela multidão. Para em vocês. Para na Lume. E sorri, com uma gentileza enorme.');
  await say('A senhorita veio. E acesa. Que bom.', 'vesper');
  // o Pavio que cai
  await tw2cena(20, p => { dito.oy = p * 6; });
  sfx('cancel');
  await say('* Na fila dos Pavios, um rapaz de casaco cinza cambaleia. A vela no chapéu dele se apaga sozinha. Ele senta no chão do palco, devagar, como quem esqueceu de como se fica em pé.');
  await say('DITO! É o meu irmão! DITO!', 'tico');
  await tw2cena(30, p => { tico.x = 220 - p * 50; });
  await say('...Bom dia, rapazinho.', 'dito');
  await say('* O Tico para no meio do caminho.');
  await say('* O Acendedor-Mor se ajoelha ao lado do Pavio. Tira do bolso um caderno de capa preta. Escreve alguma coisa, com uma letra pequena e cuidadosa. Depois fecha o caderno e põe a mão no ombro do rapaz.');
  await say('Ele está cansado, rapazinho. Trabalhou demais pela festa. Amanhã ele lembra. Eu prometo.', 'vesper');
  await say('* E então, por um segundo, todas as luzes da Avenida piscam. Todas ao mesmo tempo. Como uma respiração.');
  await tw2cena(10, p => { tint.a = 0.25 + p * 0.6; }); await wait(20); await tw2cena(10, p => { tint.a = 0.85 - p * 0.6; });
  await say('* Debaixo dos pés de vocês, pelas grades dos bueiros, sobe um sopro morno, com cheiro de fuligem. E uma voz, muito longe, muito embaixo, que não forma palavras.');
  await say('[Registro. Leitura de lembranças em grande quantidade, abaixo da cidade. Fonte desconhecida. Recomendação: descobrir.]', 'cat');
  await say('Lá embaixo. Tem alguma coisa lá embaixo da cidade.', 'rita');
  await say('O Dito limpava chaminé. Ele conhecia as Galerias de Fuligem. Ele sempre dizia que lá embaixo dava pra ouvir a cidade inteira respirando.', 'tico');
  G.flags.c3P1Fim = true; G.hora = 22 * 60; G.pos = { map: 'festival', x: 20, y: 10, dir: 'down' }; save2();
  await fadeOut(40);
  await cartao(['FIM DA PARTE 1', 'O Festival da Luz', '', 'Continua na Parte 2:', 'As Galerias de Fuligem']);
  V.scene = 'world'; loadMap2('festival', 20, 10, 'down'); playMusic('festival'); await fadeIn(20);
  await say('* (A Parte 2 do capítulo está a caminho. Enquanto isso, a capital, o festival e a base continuam abertos.)');
}

// ---------- entrada no capítulo 3 ----------
function iniciarCap3() {
  if (G.flags.c3Init) return false;
  G.flags.c3Init = true; G.poder = Math.max(G.poder || 1, 2); G.gone2 = {}; curarTudo();
  G.hora = 9 * 60; G.dia = (G.dia || 0) + 1;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  G.marco = { map: 'estrada', x: ES.marco[0], y: ES.marco[1] + 1 };
  return true;
}
async function capitulo3() {
  if (!MAPS2.estrada) montarMapas2();
  const novo = iniciarCap3();
  if (novo) {
    await cartao(['CAPÍTULO 3', 'O Festival da Luz']);
    CENA.bg = bgEstrada; CENA.extra = null;
    const bus = { x: 40, y: 156, fr: () => busArt() };
    CENA.actors = [bus, { x: 150, y: 152, fr: standF('lumeh') }, { x: 166, y: 160, fr: chestF() }, { x: 182, y: 156, fr: standF('rita') }];
    V.scene = 'cena'; playMusic('estrada3'); await fadeIn(30);
    await say('* Velhágua ficou para trás, um degrau mais alta. O 31 sobe a serra com o convite do Acendedor-Mor preso no para-brisa.');
    await say('Sete dias até o festival. A capital fica a quatro de estrada. Sobram três pra gente se perder, o que é o nosso normal.', 'rita');
    await say('O 31 nunca se perde. O 31 às vezes escolhe outro caminho.', 'jorge');
    sfx('bump'); V.shake = 14;
    await say('* O 31 tosse, dá um pulo e para no meio da Estrada dos Lampiões, soltando uma fumaça muito ofendida.');
    await say('...A correia. Vão na frente. Eu conserto e alcanço vocês antes da capital.', 'jorge');
    await say('E se tiver bicho?', 'lume');
    await say('Na estrada dos lampiões só tem mariposa. Mariposa é bicho de luz. Vocês têm uma lâmpada. Vai dar tudo certo.', 'jorge');
    await say('Eu NÃO sou uma lâmpada.', 'lume');
    await fadeOut(20);
    V.scene = 'world'; loadMap2('estrada', ...ES.chegada, 'right'); await fadeIn(20); save2();
    return;
  }
  const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'estrada', x: ES.chegada[0], y: ES.chegada[1], dir: 'right' };
  loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20);
}
// o fim do Cap. 2 agora leva ao Cap. 3
{ const _c2 = capitulo2; capitulo2 = async function () {
  if (!MAPS2.cais) montarMapas2();
  if (G.flags.c2Fim) return capitulo3();
  return _c2();
}; }
