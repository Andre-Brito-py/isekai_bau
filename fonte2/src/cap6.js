// ================= CAPÍTULO 6 — A CIDADE DOS PAVIOS (Parte 1: fugitivos em Auren) =================
// Procurados. A Guarda Real ronda Auren; os Marcos têm um Pavio de vigia. Mecânica nova: DISFARCE EM GRUPO
// (lavadeiras de dia, pavios de noite, trupe no palco). Fluxo:
// base (a Irmã Dalva traz os cartazes e os lençóis do hospital: LAVADEIRAS) -> Largo: o portão novo da VILA DOS PAVIOS
// (cancela: "roupa de onde?") -> o OSVALDO CANDEIA (de Velhágua) mora lá; ele conta da CASA DO SELO; o baú PROVA o
// frasco de farmácia do grupo e vê uma lembrança: o âmbar da Coroa é feito das lembranças dos Pavios ->
// casacos de Pavio no VARAL da lavanderia (de dia) -> de NOITE, a Dona Cotinha recebe a lembrança do filho... que é o
// SARGENTO BRÁS (ele muda de lado) -> o Brás conta que a chave do Cofre do Selo está com o HERÓI Nº 30 (Tiago), que
// faz show no palco do Festival -> o Seu Lúcio precisa de uma TRUPE (teste de ritmo) -> o show de NOITE: o Tiago
// reconhece o baú: mini-chefe TIAGO, que escolhe -> a chave. (Parte 2, cap6b: a Casa do Selo.)
const VP = POS6.ruaPavios;
Object.assign(TRACKS, {
  vila: { bpm: 76, bars: 4, chords: 'Dm Dm Bb A', bass: 'root5', bassVol: 0.06,
    lead: 'D5:2 F5:2 A5:2 F5:2 D5:2 F5:2 A5:4 | D5:2 F5:2 A5:2 F5:2 D5:2 F5:2 A5:4 | D5:2 F5:2 Bb5:2 F5:2 D5:2 F5:2 Bb5:4 | C#5:2 E5:2 A5:2 E5:2 C#5:4 A4:4',
    leadWave: 'triangle', leadVol: 0.045, arp: { rate: 4, vol: 0.01, oct: 1 }, drums: '', hatVol: 0 },
  selo: { bpm: 112, bars: 4, chords: 'Em Em C B', bass: 'oct8', bassVol: 0.1,
    lead: 'E5:2 .:2 E5:2 G5:2 .:2 E5:2 B4:4 | E5:2 .:2 E5:2 A5:2 .:2 G5:2 E5:4 | C5:2 .:2 C5:2 E5:2 .:2 G5:2 C6:4 | B4:2 .:2 D#5:2 F#5:2 .:2 B5:2 A5:4',
    leadWave: 'square', leadVol: 0.04, arp: { rate: 2, vol: 0.012, oct: 0 }, drums: 'k.h.s.h.k.k.s.h.', hatVol: 0.03 },
  palco: { bpm: 120, bars: 4, chords: 'C Am F G', bass: 'root5', bassVol: 0.08,
    lead: 'E5:2 G5:2 C6:4 G5:2 E5:2 G5:4 | A5:2 C6:2 E6:4 C6:2 A5:2 C6:4 | F5:2 A5:2 C6:4 A5:2 F5:2 A5:4 | G5:2 B5:2 D6:4 B5:2 G5:2 D6:4',
    leadWave: 'square', leadVol: 0.05, arp: { rate: 4, vol: 0.014, oct: 1 }, drums: 'k...s...k.k.s...', hatVol: 0.02 }
});
Object.assign(HUMS, {
  tiago: { h: 50, skin: '#c8906a', hair: '#3a2a1a', top: '#2a4aa0', coat: '#2a4aa0', bottom: '#1a1a2a', hat: '#2a4aa0', acc: '#d8aa40' },
  cotinha: { h: 44, skin: '#c8a088', hair: '#e8e4e0', hairStyle: 'coque', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra },
  cotinhaV: { h: 44, skin: '#c8a088', hair: '#e8e4e0', hairStyle: 'coque', top: '#c86a8a', bottom: '#5a3a4a', apron: '#f2ecdc' },
  afonso: { h: 50, skin: '#a8704a', hair: '#2a1a1a', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra },
  afonsoV: { h: 50, skin: '#a8704a', hair: '#2a1a1a', top: '#f2ecdc', bottom: '#5a4a3a', apron: '#ffffff', hat: '#ffffff' },
  zelia: { h: 46, skin: '#d8a078', hair: '#5a3a2a', hairStyle: 'longo', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra },
  zeliaV: { h: 46, skin: '#d8a078', hair: '#5a3a2a', hairStyle: 'longo', top: '#7a3a8a', bottom: '#3a2a4a', acc: '#e8e0f0' },
  juvenal: { h: 52, skin: '#8a5a3a', hair: '#1a1a1a', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: HUMS.pavio.extra },
  juvenalV: { h: 52, skin: '#8a5a3a', hair: '#1a1a1a', top: '#3a6aa8', bottom: '#3a3a44' },
  osvaldoV: { h: 50, skin: '#c8b0a0', hair: '#8a8a90', top: '#8a6a4a', coat: '#6a4a2a', bottom: '#3a3a44', acc: '#c89a30' },
  cacadora: { h: 50, skin: '#c8906a', hair: '#4a2a1a', hairStyle: 'longo', top: '#3a4a3a', coat: '#5a3a2a', bottom: '#2a2420' }
});
Object.assign(WHO, {
  tiago: { name: () => 'Tiago', portrait: () => portHum('tiago'), voice: voz(300), col: '#c8d8ff' },
  pavioG: { name: () => 'Pavio', portrait: () => portHum('pavio'), voice: voz(380), col: '#e8e0d8' },
  osvaldo: { name: () => 'Osvaldo', portrait: () => portHum(devolvida('osvaldo') ? 'osvaldoV' : 'pavio'), voice: voz(380), col: '#e8e0d8' },
  cotinha: { name: () => 'Dona Cotinha', portrait: () => portHum(devolvida('cotinha') ? 'cotinhaV' : 'cotinha'), voice: voz(520), col: '#f0d8e8' },
  afonso: { name: () => devolvida('afonso') ? 'Seu Afonso' : 'Pavio cozinheiro', portrait: () => portHum(devolvida('afonso') ? 'afonsoV' : 'afonso'), voice: voz(240, 'blipLow'), col: '#ffe8c8' },
  zelia: { name: () => devolvida('zelia') ? 'Dona Zélia' : 'Pavia lavadeira', portrait: () => portHum(devolvida('zelia') ? 'zeliaV' : 'zelia'), voice: voz(560), col: '#ecd8ff' },
  juvenal: { name: () => devolvida('juvenal') ? 'Juvenal' : 'Pavio sem número', portrait: () => portHum(devolvida('juvenal') ? 'juvenalV' : 'juvenal'), voice: voz(300), col: '#d8ffe0' },
  cacadora: { name: () => 'Caçadora', portrait: () => portHum('cacadora'), voice: voz(420), col: '#e8d8c8' }
});
Object.assign(EQ2, {
  passeGuilda: { nm: 'Passe da Guilda', slot: 'amuleto', who: ['rita'], mod: { atk: 3, spd: 1 }, fx: [], preco: 0, d: 'O passe do Sargento Brás. +3 ATQ, +1 VEL. Nenhum Caçador da Guilda encosta em quem tem um.' },
  avental: { nm: 'Avental de Padeiro', slot: 'roupa', who: ['bau', 'lume', 'rita'], mod: { def: 3, mdef: 2 }, fx: [], preco: 0, d: 'Do Seu Afonso. +3 DEF, +2 RESIST. Cheira a pão de milho às quatro da manhã.' },
  dedal: { nm: 'Dedal de Prata', slot: 'amuleto', who: ['bau', 'lume', 'rita'], mod: { def: 2, mdef: 3, mag: 1 }, fx: [], preco: 0, d: 'Da Dona Zélia. +2 DEF, +3 RESIST, +1 MAG. Protege o dedo e, dizem, o coração.' },
  relogioOsv: { nm: 'Relógio do Osvaldo', slot: 'amuleto', who: ['bau', 'lume', 'rita'], mod: { spd: 3, atk: 1 }, fx: [], preco: 0, d: 'Consertado à mão, nas 3h17 de uma vila parada. +3 VEL, +1 ATQ.' }
});
const pavioSprG = humSpr('pavio');
const qual = (k, kv) => (t, dir) => humanoSprite(humano(devolvida(k) ? kv : k, HUMS[devolvida(k) ? kv : k]), dir, t);
const seloVivoMapa = (t, d) => { const k = 'svm' + (Math.floor(t / 14) % 2) + d; if (OBJ6[k]) return OBJ6[k]; const f = seloVivoArt(Math.floor(t / 14) % 2, false), c = mk(24, 31); c.getContext('2d').drawImage(f, 0, 0, 24, 31); return OBJ6[k] = d === 'left' ? flipC(c) : c; };
const guardaSpr6 = (t, d) => { const f = guardaRealArt(Math.floor(t / 14) % 2); return d === 'left' ? flipC(f) : f; };

// ---------- os mapas do capítulo e os ajustes em Auren ----------
// o portão da Vila dos Pavios no muro de baixo do Largo do Hospital
{ const r = ROWS4.largo; for (const y of [28, 29]) r[y] = r[y].slice(0, 38) + ',,' + r[y].slice(40); }
{ const _mm6 = montarMapas2; montarMapas2 = function () {
  _mm6.apply(this, arguments);
  const grade = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.casaO = p.casaO || f.casaO; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
  // ===== VILA DOS PAVIOS =====
  const casaPv = casa({ w: 5, stone: true, wall: '#8a8494', roof: '#3a3a50', trim: '#4a4a5a', door: 2, doorC: '#2a2a34', win: [0.5, 3.6], wallH: 56 });
  const nums = [3, 5, 7, 9, 11, 13, 4, 6, 8, 10, 12, 14];
  MAPS2.ruaPavios = { rows: ROWS6.ruaPavios, key: KEY6, name: 'Auren · Vila dos Pavios', music: 'vila', batBg: bgVila, bg: '#1a1c28', showMoney: true,
    procurado: true, get stealth() { return c6Ativo(); }, grupoLuz: ['guardaR', 'guardaR'], reinicio: () => [VP.chegada[0], VP.chegada[1]],
    falaOlhou: falaOlhou6, pegoTxt: pegoTxt6, tutPego: tutPego6,
    props: [
      ...VP.casas.map(([x, y], i) => ({ img: casaPv, x, y: y + 1 })),
      ...VP.casas.map(([x, y], i) => ({ img: () => i === 4 && !devolvida('juvenal') ? semNumeroArt() : numeroArt(nums[i]), x: x + 1.6, y: y - 0.4, by: (y + 1) * TS + 2 })),
      { img: relogioVilaArt, x: VP.relogio[0], y: VP.relogio[1] + 4 },
      { img: guaritaArt, x: VP.guarita[0] - 0.05, y: VP.guarita[1] + 2 },
      { img: casa({ w: 9, stone: true, wall: '#a8b0b8', roof: '#4a5a6a', door: 4, doorC: '#3a4a5a', win: [0.6, 2.4, 6.2, 7.6], wallH: 56, awning: '#6a8a9a' }), x: 3, y: 23 },
      { img: casa({ w: 11, stone: true, wall: '#9a8a7a', roof: '#5a3a3a', door: 5, doorC: '#3a2a2a', win: [0.6, 2.6, 7.2, 9.2], wallH: 56, chimney: true }), x: 36, y: 23 },
      ...VP.varais.map(([x, y], i) => ({ img: () => varalCasacosArt(G.flags.c6Casaco ? (i ? 2 : 1) : 4), x: x - 0.5, y: y + 1.2, by: (y + 1) * TS })),
      { img: muroSeloArt, x: 1, y: 36, by: 27 * TS },
      ...VP.postes.map(([x, y]) => ({ img: () => poste3Art(true, true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...VP.arvores.map(([x, y], i) => ({ img: arvC(i % 4 + 1), x: x - 1.25, y: y + 1, solid: [[x, y, 1, 1]], arvore: true })),
      ...VP.bancos.map(([x, y]) => ({ img: memo(bancoHArt), x: x - 0.5, y: y + 1 }))
    ],
    ents: [
      ...portas(VP.largoDoor, 'largo', 38, 27, 'up'),
      { t: 'trig', x: VP.seloDoor[0][0], y: VP.seloDoor[0][1], w: 2, h: 1, passa: true, run: entrarSelo },
      marcoEnt(...VP.marco),
      { t: 'sign', x: VP.lavDoor[0], y: VP.lavDoor[1] - 1, h: 20, talk: async () => { await say(ehNoite() ? '* A lavanderia dos Pavios. Fechada. Lá dentro, no escuro, as bacias de roupa esperam o dia.' : '* A lavanderia dos Pavios. Vapor, sabão e silêncio. Ninguém canta enquanto lava. Ninguém.'); } },
      { t: 'sign', x: VP.refDoor[0], y: VP.refDoor[1] - 1, h: 20, talk: falaRefeitorio },
      { t: 'sign', x: VP.relogioPe[0], y: VP.relogioPe[1], h: 30, talk: falaRelogio },
      { t: 'sign', x: VP.varalPega[0], y: VP.varalPega[1], h: 20, talk: pegarCasacos },
      morador('osvaldo', ...VP.osvaldo, { spr: qual('pavio', 'osvaldoV'), dir: 'up', rotina: null, talk: falaOsvaldo }),
      morador('cotinha', ...VP.cotinha, { spr: qual('cotinha', 'cotinhaV'), gone: () => !ehNoite() && !devolvida('cotinha'), rotina: rot([19, 15, 'acender', 300, 'up'], [16, 16, 'acender', 300, 'down']), talk: falaCotinha }),
      morador('afonso', ...VP.afonso, { spr: qual('afonso', 'afonsoV'), dir: 'down', rotina: rot([44, 23, 'limpar', 360, 'down'], [47, 23, 'carregar', 200, 'right']), talk: falaAfonso }),
      morador('zelia', ...VP.zelia, { spr: qual('zelia', 'zeliaV'), gone: () => ehNoite() && !devolvida('zelia'), rotina: rot([5, 23, 'varal', 320, 'down'], [12, 23, 'varal', 320, 'down']), talk: falaZelia }),
      morador('juvenal', ...VP.semNumero, { spr: qual('juvenal', 'juvenalV'), dir: 'up', talk: falaJuvenal }),
      ...VP.pavioRotas.map((path, i) => morador('pavio', path[0][0], path[0][1], { id: 'pavioV' + i, spr: pavioSprG, gone: () => !ehNoite(), rotina: rot(...path.map(([x, y]) => [x, y, 'acender', 120, 'up'])), talk: async () => { await say(pickOne(['Boa noite. Eu acendo os postes da Coroa.', 'Boa noite. Eu acendo os postes da Coroa.', 'Boa noite. Eu... acendo.']), 'pavioG'); if (!G.flags.c6Igual) { G.flags.c6Igual = true; await say('Todos falam igual. A mesma frase, do mesmo jeito.', 'lume'); await say('Que nem eu, na masmorra. Eu também só tinha uma frase.', 'me'); } } })),
      { t: 'ronda', id: 'guardaVila', x: VP.rondaDia[0][0], y: VP.rondaDia[0][1], path: VP.rondaDia, h: 56, passo: 26, spr: guardaSpr6, dir: 'down', gone: () => !c6Ativo(), talk: async () => { await say('Circulando. Vila de trabalhador. Aqui não tem nada pra ver.', 'guardaRH'); } }
    ],
    onEnter: async () => { if (c6Ativo() && !G.flags.c6Vila) await chegaVila(); }
  };
  montaBarreira({ id: 'vila', ativo: c6Ativo, map: 'ruaPavios', cancela: VP.barreira, guarda: VP.guarda, lado: 'cima', volta: VP.chegada, bg: bgVila,
    perg: { lavadeira: { q: 'Roupa? Roupa de onde?', ops: ['Da Ala Sete do hospital. A ala dos Pavios.', 'Da Cidade Alta, moço.', 'Da minha tia.'], certa: 0, ok: 'Ala Sete. Tá. Põe no varal da lavanderia, a Zélia separa.', dica: 'A Irmã Dalva falou da ALA SETE. A roupa dos Pavios.' },
            pavio: { q: 'Turno? ...Que horas marca o relógio da vila?', ops: ['Meia-noite em ponto.', 'Três e dezessete. Ele está parado.', 'A hora que a Coroa mandar.'], certa: 1, ok: 'Três e dezessete. Desde sempre. Passa, colega.', dica: 'O relógio da vila. Eu devia ter OLHADO pra ele.' } } });
  montaBarreira({ id: 'selo', ativo: c6Ativo, map: 'ruaPavios', cancela: VP.seloBarreira, guarda: VP.seloGuarda, lado: 'cima', volta: [25, 27], bg: bgFabrica, grupo: ['guardaR', 'seloVivo'], so: ['pavio'], foraSo: 'Portão do turno da noite. Só Pavio de crachá. O resto, circulando.',
    perg: { pavio: { q: 'Crachá. Número do crachá, Pavio.', ops: ['Trinta e um.', 'Doze, turno da manhã.', 'Quarenta e sete, turno da noite.'], certa: 2, ok: 'Quarenta e sete. Prensa três. Boa noite.', dica: 'O crachá do Osvaldo. Quarenta e sete. Ele disse.' } } });
  grade(MAPS2.ruaPavios);
  // no Largo: o portão da vila embaixo, à direita
  const L = MAPS2.largo;
  if (L && !L._vila6) { L._vila6 = true; L.ents.push(...portas([[38, 29], [39, 29]], 'ruaPavios', VP.chegada[0], VP.chegada[1], 'down').map(d => Object.assign(d, { get gone() { return false; } })));
    L.props.push({ img: () => placaArt('casa'), x: 40.2, y: 28, by: 28 * TS + 1 }); }
  // Auren, Largo e Festival em tempo de cartaz: guardas de ronda (só no Cap. 6) e os caçadores de antes saem de cena
  const RON = { auren: [[[20, 21], [40, 21]], [[3, 12], [18, 12]]], largo: [[[6, 17], [40, 17]], [[30, 22], [30, 27]]], festival: [[[6, 19], [44, 19]], [[20, 8], [34, 8]]] };
  for (const [id, paths] of Object.entries(RON)) {
    const m = MAPS2[id]; if (!m || m._ron6) continue; m._ron6 = true;
    const st0 = Object.getOwnPropertyDescriptor(m, 'stealth');
    Object.defineProperty(m, 'stealth', { get: () => c6Ativo() || !!(st0 && (st0.get ? st0.get() : st0.value)), configurable: true });
    Object.defineProperty(m, 'procurado', { get: () => c6Ativo(), configurable: true });
    if (!m.grupoLuz) m.grupoLuz = id === 'festival' ? ['guardaR', 'cacaRec'] : ['guardaR', 'guardaR'];
    if (!m.reinicio) m.reinicio = () => id === 'auren' ? POS3.auren.bueiroOut : id === 'largo' ? POS4.largo.chegada : POS3.festival.chegada;
    m.falaOlhou = m.falaOlhou || falaOlhou6; m.pegoTxt = m.pegoTxt || ((c, e) => c6Ativo() ? pegoTxt6(c, e) : null); m.tutPego = m.tutPego || (async () => { if (c6Ativo()) await tutPego6(); });
    paths.forEach((p, i) => m.ents.push({ t: 'ronda', id: 'guarda6' + i, x: p[0][0], y: p[0][1], path: p, h: 56, passo: 24, spr: i % 2 && G.flags.c6Bras === undefined ? guardaSpr6 : guardaSpr6, dir: 'right', gone: () => !c6Ativo(), talk: async () => { await say(pickOne(['Circulando.', 'Viu o cartaz? Uma mala com dente. Mil frascos.', 'Esse povo do Largo...']), 'guardaRH'); } }));
    for (const e of m.ents) if (e.t === 'hunter' && !e._g6) { e._g6 = true; const g0 = e.gone; e.gone = () => c6Ativo() || (g0 ? g0() : false); }
  }
  // a caçadora de recompensa de ronda no Festival (some depois que o Brás muda de lado)
  const F = MAPS2.festival;
  if (F && !F._cac6) { F._cac6 = true; F.ents.push(inimigo('cac6', 'cacaRec', 44, 21, ['cacaRec', 'guardaR'], { spr: humSpr('cacadora'), h: 50, bg: bgPalco, gone: () => !c6Ativo() || !!G.flags.c6Bras }));
    F.ents.push(morador('lucio', 46, 21, { dir: 'left', gone: () => !c6Ativo(), rotina: rot([46, 21, 'conversar', 300, 'left'], [44, 22, 'olhar', 200, 'down']), talk: falaLucio6 }));
    F.ents.push({ t: 'sign', x: POS3.festival.frente[1][0], y: POS3.festival.frente[1][1], h: 30, talk: palcoTiago }); }
}; }
// ---------- começo do capítulo ----------
function iniciarCap6() {
  if (G.flags.c6Init) return false;
  G.flags.c6Init = true; G.poder = Math.max(G.poder || 1, 5); curarTudo(); G.hora = 7 * 60; G.dia = (G.dia || 0) + 1;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  return true;
}
async function capitulo6() {
  if (!MAPS2.ruaPavios) montarMapas2();
  const novo = iniciarCap6();
  if (!novo) { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'interior', x: POS3.interior.entra[0], y: POS3.interior.entra[1], dir: 'up' }; loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20); return; }
  await fadeOut(20);
  await cartao(['CAPÍTULO 6', 'A Cidade dos Pavios']);
  V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
  await say('* Três dias dentro do baú. A base tem chá, cama e a vela da Lume, mas não tem janela. A Irmã Dalva entra com o cabelo cheio de garoa e uma pilha de papel debaixo do braço.');
  await say('Cartazes. Novos. Esses têm cor.', 'dalva');
  await say('* PROCURADOS PELA COROA. O desenho da Rita ficou bravo. O da Lume ficou lindo. O do baú tem uma legenda: "NÃO É BAGAGEM".');
  await say('Eles aprenderam.', 'me');
  await say('Tem guarda real em toda esquina do Bairro Baixo. E um Pavio parado do lado de cada Marco, de lanterna acesa, olhando pra ninguém. Vigiando.', 'dalva');
  await say('[Marcos vigiados. Tocar num Marco com um Pavio olhando dá alarme.]', 'cat');
  await say('A gente não pode ficar trancado aqui. Tem um caderno inteiro de nomes lá fora esperando.', 'rita');
  await say('Ninguém vai ficar trancado. Eu trouxe o que tinha.', 'dalva');
  await say('* A Irmã Dalva despeja a pilha no chão: lençóis do hospital, lenços, aventais, e um cesto de vime grande o bastante para um baú pequeno.');
  await say('Lavadeira do hospital passa em qualquer lugar de DIA. Ninguém olha pra quem leva roupa suja. Ninguém nunca olhou pra mim.', 'dalva');
  G.disfarces = Object.assign({}, G.disfarces, { lavadeira: true });
  await say('* {y}Disfarce novo: LAVADEIRAS DO HOSPITAL.{/} (MENU > Disfarce. Serve DE DIA: Bairro Baixo, Largo, Festival e a Vila dos Pavios. O baú vira cesto.)');
  await say('[Procurados: sem disfarce, qualquer guarda que veja o grupo dá o alarme. Com o figurino certo para a HORA e o LUGAR, passa. Lutar disfarçado dá SURPRESA: +20 de Tensão.]', 'cat');
  await say('E pra onde a gente vai, vestida de lençol?', 'lume');
  await say('Lembra do Pavio de Velhágua? O relojoeiro, que vocês devolveram o nome? Osvaldo Candeia. Ele apareceu na enfermaria semana passada, perguntando de um baú que fala.', 'dalva');
  await say('Ele mora agora na VILA DOS PAVIOS, a vila nova da Coroa, no portão de baixo do LARGO DO HOSPITAL. Tem cancela e guarda. Se perguntarem, a roupa é da ALA SETE. É a ala dos Pavios.', 'dalva');
  await say('Ala Sete. Eu sou um cesto da Ala Sete. Eu consigo.', 'me');
  save2();
}
{ const _c5 = capitulo5; capitulo5 = async function () { if (!MAPS2.ruaPavios) montarMapas2(); if (G.flags.c5Fim) return capitulo6(); return _c5(); }; }
{ const _uw6c = updateWorld2; updateWorld2 = function () { _uw6c(); if (V.scene === 'world' && G.flags.c5Fim && !G.flags.c6Init && !worldBusy2() && !W2.mv) run2(capitulo6); }; }
// ---------- a Vila ----------
async function chegaVila() {
  G.flags.c6Vila = true;
  await say('* A Vila dos Pavios. Doze casinhas iguais, da mesma cor, com o mesmo jardim de um palmo na frente. Numeradas. Uma delas não tem número.');
  await say('* No meio, a torre de um relógio. Parado. Ninguém parece se importar.');
  if (!ehNoite()) await say('* De dia, a vila dorme. As janelas fechadas, as lanternas apagadas penduradas nas portas. Só o relógio parado e um guarda andando.');
  else await say('* De noite, a vila acorda inteira de uma vez: as portas abrem ao mesmo tempo, os Pavios saem ao mesmo tempo, as lanternas acendem ao mesmo tempo.');
  await say('Isso aqui é a coisa mais arrumada que eu já vi. E eu morava numa estante.', 'lume');
}
async function falaRelogio() {
  await say('* A torre do relógio da vila. O mostrador marca 3h17. O ponteiro grande tremeu um dia e desistiu.');
  if (!G.flags.c6Relogio) { G.flags.c6Relogio = true; await say('Três e dezessete. Que hora estranha pra um relógio desistir.', 'rita'); }
  if (devolvida('osvaldo') && !G.flags.c6RelogioVolta) await say('O Osvaldo disse que conserta. Ele tem que estar perto.', 'lume');
}
async function falaRefeitorio() {
  if (!ehNoite()) { await say('* O refeitório dos Pavios. De dia, panelas lavadas e cadeiras viradas em cima das mesas.'); return; }
  await say('* Pela janela: quarenta Pavios jantando. Ninguém conversa. Ninguém pede o sal. Todos acabam a sopa no mesmo gole.');
  if (!G.flags.c6Refeit) { G.flags.c6Refeit = true; await say('Eles comem como quem cumpre um horário. Não como quem tem fome.', 'rita'); await say('Na Terra, a gente chamava isso de segunda-feira.', 'me'); }
}
// o Osvaldo: o coração da parte 1
async function falaOsvaldo() {
  if (devolvida('osvaldo')) { await say(G.flags.c6RelogioVolta ? pickOne(['O relógio anda. A Candinha ia rir de mim: um relojoeiro que levou quatro anos pra consertar o próprio relógio.', 'Meu relojoeiro. Ela me chamava assim. Eu lembro. Eu lembro!']) : 'Me dá um minuto com o relógio. Só um. Eu sei o que ele tem.', 'osvaldo'); return; }
  if (temLemb('osvaldo')) { await devolverLemb('osvaldo', cenaOsvaldo); return; }
  if (G.flags.c6Osvaldo) { await say(pickOne(['O meu crachá é 47. Turno da noite. Prensa três. É tudo que eu sei de cor, além do meu nome.', 'Os Pavios entram no Selo de noite. De casaco cinza. Ninguém olha pra Pavio.', 'O Cofre. Tudo que a gente dá fica no Cofre. Com lote e data.']), 'osvaldo'); if (G.flags.c6Cofre && !G.flags.c6Chave) await say('A chave do Cofre? Deram pra um herói. Um rapaz de quepe que faz show no Festival.', 'osvaldo'); return; }
  G.flags.c6Osvaldo = true; playMusic('cha');
  await say('* Na frente do relógio parado, um Pavio de casaco cinza olha para o mostrador. Ele vira devagar. Reconhece a mala antes das moças.');
  await say('O baú. O baú que fala. Osvaldo. Osvaldo Candeia. Conserto de relógios. Eu repito toda hora.', 'osvaldo');
  await say('O senhor lembra da gente!', 'lume');
  await say('Lembro de vocês. Lembro do meu nome, que vocês devolveram. Lembro da banca no Mercado de Velhágua. Mas tem um buraco.', 'osvaldo');
  await say('Eu sei que tinha alguém. Uma mulher. Ela me chamava de um jeito... eu não lembro o jeito. Eu não lembro o rosto. Eu lembro que ria.', 'osvaldo');
  await say('Quando trouxeram a gente pra cá, a cada semana a gente vai na CASA DO SELO, ali no muro de baixo. Senta numa cadeira. Dá um pouquinho. Recebe o salário. Sai mais leve.', 'osvaldo');
  await say('Dá um pouquinho de QUÊ?', 'rita');
  await say('...Não sei. Do que a gente dá. É o turno. É o trabalho.', 'osvaldo');
  await say('* A Lume tira do Vão o frasco de farmácia que vocês compraram no Bazar. Âmbar diluído, com o selo da Coroa. "Cura 45%". Ela olha pra você.');
  await say('@. Você sente cheiro de coisa. Lembrança. Você sempre sentiu, lá embaixo. Prova.', 'lume');
  await say('Provar o remédio que a gente usa pra não morrer. Normal. Tranquilo. Eu sou um baú, eu como coisa.', 'me');
  G.items.frasco = Math.max(0, (G.items.frasco || 0) - 1);
  await ganhaLemb('cotinha', false);
  await say('* Uma gota. O gosto não é de remédio. É de cozinha às seis da tarde. É de saudade.');
  await say('* ' + LEMB6.cotinha.trecho);
  await say('[...Atualizando. O âmbar "de farmácia" da Coroa não vem só das minas. Este frasco tem uma LEMBRANÇA dentro. Alguém deu isso. Na Casa do Selo.]', 'cat');
  await say('O remédio... é feito de gente.', 'rita');
  await say('Tem gosto de saudade.', 'me');
  await say('* O Osvaldo olha o frasco por muito tempo.');
  await say('Então a minha... o rosto dela... está num vidrinho desses. Numa prateleira. Com lote e data.', 'osvaldo');
  await say('No COFRE. O cofre da Casa do Selo. Tudo que a gente dá fica lá antes de ir pras farmácias. Eu varro o corredor do Cofre às vezes. Quarenta e sete. O meu crachá é 47. Turno da noite.', 'osvaldo');
  await say('Quem entra no Selo de noite é Pavio. De casaco cinza. Os casacos lavados ficam no VARAL da lavanderia, de dia.', 'osvaldo');
  await say('E esse frasco? O menino de farda?', 'lume');
  await say('...A Dona Cotinha. Ela sai de NOITE, acende os postes do lado de cá. Vive dizendo que esqueceu alguma coisa no fogão. Ninguém sabe se ela tinha filho.', 'osvaldo');
  G.flags.c6Cofre = true; playMusic('vila');
  await say('[Lembrança no Vão. MENU > Lembranças. Ache o dono e abra o frasco perto dele.]', 'cat');
  save2();
}
async function cenaOsvaldo() {
  await say('* O Osvaldo fecha os olhos. Abre. Fecha de novo, como quem confere se a imagem fica.');
  await say('Candinha. Ela se chamava Candinha. O cabelo preso com um lápis, porque ela vivia perdendo o grampo e achando lápis.', 'osvaldo');
  await say('"Meu relojoeiro". Ela me chamava assim. Quando eu chegava tarde da banca ela dizia: "chegou o meu relojoeiro, atrasado como sempre".', 'osvaldo');
  await say('* Ele ri. Um riso de quem não ria fazia quatro anos. E chora, ao mesmo tempo, que é como as lembranças voltam.');
  await say('Ela morreu no Inverno Escuro. No hospital dos pobres. Eu dei o rosto dela pros Pavios porque doía. Eu dei porque doía, entendem?', 'osvaldo');
  await say('Entendo. Mas é seu. Doer também é seu.', 'me');
  await say('* O Osvaldo tira o casaco cinza. Embaixo tem um colete marrom, puído, com um bolso de relógio. Ele olha para a torre.');
  await say('Três e dezessete. Me dá um minuto.', 'osvaldo');
  await fadeOut(16); sfx('door'); await wait(20); sfx('rune');
  G.flags.c6RelogioVolta = true;
  await fadeIn(16);
  await say('* TIC. TAC. O relógio da Vila dos Pavios anda. O ponteiro grande sai das 3h17 e vai, devagar, para a hora certa.');
  await say('* Nas casinhas iguais, uma janela acende. Depois outra. Alguém olha pra fora pra ver que barulho é esse.');
  await say('Toma. Era o relógio de bolso da banca. Consertei agora, que agora eu lembro como se conserta qualquer coisa.', 'osvaldo');
  ganharEquip('relogioOsv'); sfx('equip'); await say(`* Você recebeu o {y}${EQ2.relogioOsv.nm}{/}. ${EQ2.relogioOsv.d}`);
}
async function pegarCasacos() {
  if (G.flags.c6Casaco) { await say('* O varal da lavanderia. Faltam três casacos cinza. Ninguém deu falta: Pavio não conta casaco.'); return; }
  if (!G.flags.c6Cofre) { await say('* Casacos cinza de Pavio, lavados, secando no varal. Com uma vela de cera em cada gola.'); return; }
  if (ehNoite()) { await say('* De noite, o varal está vazio: os casacos estão na rua, nas costas dos Pavios.'); await say('Os casacos lavados ficam no varal de DIA.', 'rita'); return; }
  if (disf() !== 'lavadeira') { await say('* Um guarda passa do outro lado da rua. Tirar casaco do varal sem ser da lavanderia... chama atenção.'); await say('Lavadeira tira roupa do varal. Lavadeira pode tudo com roupa.', 'rita'); return; }
  G.flags.c6Casaco = true; sfx('item');
  await say('* Uma lavadeira do hospital tira três casacos cinza do varal, dobra, põe no cesto. O cesto abre a tampa e engole. Ninguém olha.');
  G.disfarces = Object.assign({}, G.disfarces, { pavio: true });
  await say('* {y}Disfarce novo: PAVIOS DO TURNO.{/} (Serve DE NOITE em toda Auren, na Vila e dentro da Casa do Selo. O baú vira caixa de lanternas.)');
  await say('E a vela na cabeça? A minha já vem de fábrica.', 'lume');
  await say('Pavio não fala, Lume.', 'rita');
  await say('...Tá.', 'lume');
}
async function falaCotinha() {
  if (devolvida('cotinha')) { await say(pickOne(['O Brasinho vem jantar domingo. Eu vou fazer o bolo de fubá que ele odeia. Ele vai comer tudo.', 'Ele virou Sargento. Ele DISSE que ia virar Sargento.']), 'cotinha'); return; }
  if (temLemb('cotinha') && G.flags.c6Cofre) {
    if (c6Ativo() && disf() !== 'pavio') { await say('* A senhora de casaco cinza recua um passo, assustada com o lençol, ou com o cesto que tem dentes.'); await say('Eu... eu preciso acender a rua. Com licença.', 'cotinha'); await say('De noite, aqui dentro, quem fala com Pavio é Pavio.', 'rita'); return; }
    await devolverLemb('cotinha', cenaCotinha); return;
  }
  await say(pickOne(['Boa noite. Eu acendo os postes da Coroa. Eu esqueci alguma coisa no fogão?', 'Boa noite. Tem alguma coisa no fogão. Eu sinto o cheiro. Não tem fogão aqui.']), 'cotinha');
}
async function cenaCotinha() {
  await say('* A senhora pisca. A lanterna cai da mão dela e rola no chão, acesa.');
  await say('Brasinho. O meu Brasinho. Tropeçava no cinto da farda do pai. "Mãe, eu vou ser Sargento." Ele tinha seis anos. Ele tinha SEIS anos e já dizia isso.', 'cotinha');
  await say('* Atrás de vocês, um passo pesado. Uma bota de couro de Caçador. Vocês se viram devagar.');
  await say('Ninguém se mexe. Mil frascos, parados na minha frente, vestidos de Pavio. Eu sabia que vocês vinham aqui.', 'bras');
  await say('* O Sargento Brás, da Guilda. Mais magro que em Velhágua, mais cansado, o cartaz de vocês dobrado no bolso. Ele levanta o cassetete. E para.');
  await say('...Brasinho?', 'cotinha');
  await say('* O cassetete abaixa. O Brás olha para a senhora de casaco cinza como quem olha para uma casa onde morou.');
  await say('Mãe? A senhora... a senhora sabe quem eu sou?', 'bras');
  await say('Você virou Sargento. Você DISSE que ia virar Sargento. E você não come direito, olha esse rosto.', 'cotinha');
  await say('* O Sargento Brás, que derrubou o grupo numa escadaria de Velhágua, senta no meio-fio da Vila dos Pavios e chora como um menino de seis anos de farda grande demais.');
  await wait(30);
  await say('Ela entrou pros Pavios faz dois anos. Pela pensão. Pra me ajudar com as dívidas da Guilda. Eu ia visitar e ela me dava boa noite. Igual dava pra qualquer um.', 'bras');
  await say('Eu vim aqui atrás da recompensa. Mil frascos. Pra pagar a pensão dela de volta e tirar ela daqui.', 'bras');
  await say('E aí uma mala com dente devolve a minha mãe com um vidrinho.', 'bras');
  await say('* Ele se levanta. Enxuga o rosto com a manga. Rasga o cartaz de vocês em quatro, com cuidado, como quem dobra uma carta.');
  await say('A Guilda tá fora dessa caçada. Eu cuido disso. Nenhum Caçador meu encosta em vocês. Toma, escudeira.', 'bras');
  ganharEquip('passeGuilda'); sfx('equip'); await say(`* A Rita recebeu o {y}${EQ2.passeGuilda.nm}{/}. ${EQ2.passeGuilda.d}`);
  await say('E escuta. A Coroa não confia em Caçador. Mandou um HERÓI pra pegar vocês. O Herói nº 30. Ele ganhou de honraria a CHAVE DO COFRE da Casa do Selo, de enfeite, numa almofada de veludo.', 'bras');
  await say('Ele faz show no PALCO DO FESTIVAL, toda NOITE, contando como venceu a masmorra. O Seu Lúcio, o bardo, abre o show dele com uma trupe. A trupe dele tá desfalcada.', 'bras');
  await say('O Herói nº 30. O Tiago. O cobrador do 31.', 'lume');
  await say('Ele tem a chave. E a gente vai subir no palco dele.', 'me');
  G.flags.c6Bras = true; save2();
}
async function falaAfonso() {
  if (devolvida('afonso')) { await say(pickOne(['Pão de milho! Quatro da manhã! Quem quiser, entra na fila! ...Ninguém quer? Eu deixo na base de vocês.', '(assobia a mesma música, desafinada no mesmo lugar)']), 'afonso'); return; }
  if (temLemb('afonso')) { await devolverLemb('afonso', async () => {
    await say('* O Pavio cozinheiro para de mexer o caldeirão. Cheira o ar. Começa a assobiar. A mesma música, desafinada no mesmo lugar.');
    await say('Afonso. Padaria do Afonso, na rua do Cais. Quatro da manhã, todo dia, trinta anos. O pão de milho do Afonso!', 'afonso');
    await say('Eu dei a padaria pra Coroa porque achei que padeiro não precisava lembrar de nada pra fazer pão. Errei. O pão daqui é triste. O pão daqui não tem assobio.', 'afonso');
    ganharEquip('avental'); sfx('equip'); await say(`* Você recebeu o {y}${EQ2.avental.nm}{/}. ${EQ2.avental.d}`);
    G.items.frasco = (G.items.frasco || 0) + 1; await say('* E um pão de milho embrulhado num pano. (+1 Frasco de Âmbar: o Afonso diz que pão também cura.)');
  }); return; }
  await say(pickOne(['Sopa. Às sete. Todos os dias às sete. Eu faço a sopa.', 'O pão daqui é triste. Não sei por quê. Eu faço do jeito certo. Eu acho.']), 'afonso');
  if (!G.flags.c6AfonsoDica) { G.flags.c6AfonsoDica = true; await say('* Ele assobia baixinho enquanto mexe a panela. Sempre a mesma música, sempre desafinando no mesmo lugar.'); }
}
async function falaZelia() {
  if (devolvida('zelia')) { await say(pickOne(['Eu costurei o vestido da minha irmã. De madrugada. Chorando. Ela casou linda e eu fiquei com o dedo furado. Valeu cada furo.', 'Se rasgar alguma coisa, traz aqui. De graça. Agora eu lembro como se faz ponto invisível.']), 'zelia'); return; }
  if (temLemb('zelia')) { await devolverLemb('zelia', async () => {
    await say('* A Pavia lavadeira solta a roupa no tanque. Olha as próprias mãos como quem procura um dedal.');
    await say('Zélia. Zélia Costureira, da Rua dos Botões. O vestido da Neide! O vestido de noiva da minha irmã! Eu costurei ele inteiro numa noite!', 'zelia');
    await say('Eu dei isso pra Coroa e virei lavadeira de Pavio. Eu, que fazia ponto invisível. Me devolveram as mãos.', 'zelia');
    ganharEquip('dedal'); sfx('equip'); await say(`* Você recebeu o {y}${EQ2.dedal.nm}{/}. ${EQ2.dedal.d}`);
  }); return; }
  await say(pickOne(['Roupa da Ala Sete? Deixa no tanque.', 'Eu lavo. Eu passo. Eu dobro. Eu tinha um dedal, eu acho. Pra quê serve um dedal?']), 'zelia');
}
async function falaJuvenal() {
  if (devolvida('juvenal')) { await say(pickOne(['Sete. A minha casa é a sete, a da porta azul, lá na Rua das Lavadeiras. A Dita deve estar furiosa. Faz um ano que eu não janto.', 'Juvenal. Juvenal! Eu vou repetir até cansar.']), 'juvenal'); return; }
  if (temLemb('juvenal')) { await devolverLemb('juvenal', async () => {
    await say('* O Pavio sem número, parado na frente da única casa sem número da vila, solta a lanterna.');
    await say('Juvenal. "Juvenal, larga essa lanterna e vem jantar." A Dita! A minha mulher! A porta azul, o sete torto que eu mesmo pintei!', 'juvenal');
    await say('Eu esqueci o meu próprio número. Por isso me deram uma casa sem número. Eu achava que era castigo. Era só lógica.', 'juvenal');
    await say('Tomem. Era pra eu entregar no Selo amanhã. Ninguém vai sentir falta. Eu agora sinto falta de tudo, então sei.', 'juvenal');
    await dar('frasco', 2); await dar('pluma', 1);
  }); return; }
  await say(pickOne(['Boa noite. Eu acendo... qual é o número dessa casa? Ninguém me disse o número.', 'Eu moro aqui. Eu acho que eu moro aqui. É a única que não tem número. Combina comigo.']), 'juvenal');
}
// ---------- a Trupe e o palco do Tiago ----------
async function falaLucio6() {
  if (!G.flags.c6Bras) { await say(pickOne(['Ô, de Velhágua pra capital, e a capital me põe pra abrir show de herói. A vida do bardo é isso.', 'Precisava de gente pra minha trupe. Gente que canta, que dança, que carrega baú.']), 'lucio'); return; }
  if (G.flags.c6Trupe) { await say(pickOne(['O show é de NOITE. A gente abre, o herói entra, o povo aplaude o herói. Eu ganho três cobres. É a arte.', 'De figurino, vocês podem andar pelo Festival e pelo Largo a qualquer hora. Artista é invisível fora do palco.']), 'lucio'); return; }
  if (disf() === 'lavadeira' || disf() === 'pavio') await say('* O Seu Lúcio olha a lavadeira, olha o cesto. Aperta os olhos.');
  await say('...A moça que cantava na fonte da praça. Em Velhágua. E o baú que batia a tampa no ritmo. Eu não esqueço plateia boa.', 'lucio');
  await say('Seu Lúcio. A gente precisa subir no palco do Herói nº 30.', 'rita');
  await say('Precisam? Eu preciso de trupe! O meu acordeonista fugiu com a filha do moço do pastel. Mas palco é palco: tem que passar no teste. Me mostra o ritmo.', 'lucio');
  while (true) {
    const r = await ritmoLume();
    if (r.perf + r.bom >= 4) break;
    await say('Hm. Quase. A tampa atrasou. Mais uma vez, que o povo da capital é exigente.', 'lucio');
    const c = await choose('* Tentar de novo?', ['Mais uma', 'Depois'], 'n', 1); if (c !== 0) return;
  }
  G.flags.c6Trupe = true; sfx('item');
  await say('ISSO! Isso é trupe! Toma, figurino de palco. Chapéu de pena pra moça das velas, capa pra escudeira, e um pano bordado pro baú, que baú de figurino é o que ele já é.', 'lucio');
  G.disfarces = Object.assign({}, G.disfarces, { trupe: true });
  await say('* {y}Disfarce novo: TRUPE DO SEU LÚCIO.{/} (Serve A QUALQUER HORA, mas só no Festival e no Largo: onde tem palco e plateia.)');
  await say('O show é toda NOITE, no palco. A gente abre. Depois o herói entra. Venham de trupe, que de outro jeito a Guarda não deixa nem chegar perto.', 'lucio');
}
async function palcoTiago() {
  if (!c6Ativo()) { await say('* O palco do Festival da Luz. Vazio, com cheiro de serragem.'); return; }
  if (G.flags.c6Tiago) { await say('* O palco vazio. A almofada de veludo da chave ficou para trás, amassada.'); return; }
  if (!G.flags.c6Trupe) { await say('* O palco. Um cartaz: "TODA NOITE: O HERÓI Nº 30 CONTA COMO VENCEU A MASMORRA. Abertura: Trupe do Seu Lúcio."'); return; }
  if (!ehNoite()) { await say('* O palco, de dia: dois carpinteiros martelando, uma almofada de veludo vazia num pedestal. O show é de NOITE.'); return; }
  if (disf() !== 'trupe') { await say('* Um guarda na escada do palco: "Só artista. Cadê o figurino?"'); return; }
  await showTiago();
}
async function showTiago() {
  W2.mv = null; playMusic('palco');
  await say('* Noite de show. O Festival lotado. Lanternas penduradas, criança no ombro do pai, cheiro de pastel. O Seu Lúcio sobe no palco de chapéu.');
  await say('Senhoras e senhores! Antes do herói, a abertura! A TRUPE DO SEU LÚCIO, com a moça das velas e o seu baú cantante!', 'lucio');
  const r = await ritmoLume();
  const bom = r.perf + r.bom >= 4;
  await say(bom ? '* A Lume canta. O baú bate a tampa. A praça inteira bate palma no ritmo, e por um minuto ninguém olha cartaz nenhum.' : '* A Lume canta, o baú tropeça no ritmo, a Rita gira a lança como quem dança. O povo ri e aplaude assim mesmo.');
  if (bom) { G.cobres = (G.cobres || 0) + 30; await say('* No chapéu do Seu Lúcio: 30 cobres. Ele dá tudo pra vocês, com uma piscadela.'); }
  await say('E agora! Direto da masmorra, o cobrador que voltou! O HERÓI Nº 30!', 'lucio');
  await say('* Ele entra de casaco azul e dourado, com uma pluma no quepe de cobrador. No pedestal, numa almofada de veludo, uma chave de latão grossa: a CHAVE DO COFRE.');
  await say('Boa noite, Auren! Eu era cobrador. Do ônibus 31. E um dia o ônibus caiu numa masmorra, e eu...', 'tiago');
  await say('* Ele para. Olha a trupe. Olha o baú de figurino. Os olhos dele fazem aquilo que vocês viram uma vez, há muito tempo, num andar escuro: AVALIAM.');
  await say('[Alerta: o humano está me LENDO de novo.]', 'cat');
  await say('...Baú. Nível baixo. Perigoso por motivos que eu não sei explicar.', 'tiago');
  await say('Oi, Tiago.', 'me');
  await say('* O Festival inteiro prende a respiração. O Tiago fecha a cortina com um puxão, e de repente são só vocês, ele e o pedestal da chave, atrás do pano vermelho.');
  await say('Eu tenho ordens. A Coroa me deu casa, quepe, figurinha. E uma lista: o baú, a moça das velas, a escudeira. Mil frascos.', 'tiago');
  await say('Você sabe o que ele faz com as pessoas, Tiago? Os Pavios? O âmbar?', 'rita');
  await say('Eu sei que ele mantém a cidade acesa. Eu sei que lá embaixo eu passei frio no escuro. Eu prometi pra Coroa. Eu cumpro o que prometo. Sempre.', 'tiago');
  await say('Então confere com a gente. Do jeito que você conferia passagem.', 'me');
  const rr = await lutaMapa(['tiago'], { bg: bgPalco, music: 'boss', pos: [[184, 160]], intro: async () => { const e = BT.foes[0]; e.phases = fasesTiago(); e.ct = 12; callout('TIAGO, HERÓI Nº 30', '#c8d8ff', 90); } });
  if (rr !== 'win') return;
  G.flags.c6Tiago = true; playMusic('cha');
  await say('* O Tiago cai sentado no palco. O quepe rola. A pluma de herói fica torta. Ele ri, sem fôlego.');
  await say('Vocês me deram troco. Ninguém nunca me deu troco.', 'tiago');
  await say('* Ele pega a chave na almofada de veludo. Pesa na mão. Olha a lista da Coroa, a de mil frascos, e olha a cópia do caderno que a Rita deixou cair na luta.');
  await say('A conta não fecha. Eu sempre soube quando a conta não fechava. No 31, quando faltava um passageiro na volta, eu era o primeiro a saber.', 'tiago');
  await say('Toma. A chave do Cofre. Eu vou dizer pra Coroa que vocês me venceram e fugiram. Não é mentira. Só não é a verdade toda.', 'tiago');
  G.flags.c6Chave = true; sfx('item'); await say('* {y}CHAVE DO COFRE{/}, de latão, com o selo da Coroa. Abre a porta do Cofre, no fundo da Casa do Selo.');
  await say('E você, Tiago?', 'lume');
  await say('Eu vou continuar sendo herói. Herói tem acesso a coisa que fugitivo não tem. Quando vocês precisarem de alguém do lado de dentro... eu guardo o troco.', 'tiago');
  await say('* Ele põe o quepe torto de volta, abre a cortina, e sai para o palco sorrindo e mancando, contando ao povo como um baú quase o derrotou. O povo ri. Acha que é piada.');
  playMusic('festival'); save2();
}
