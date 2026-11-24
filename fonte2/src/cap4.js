// ================= CAPÍTULO 4 — A CASA DOS QUE ESQUECEM (Parte 1) =================
// Manhã na base -> o Acendedor-Mor compra a CASA DE SAÚDE DO LARGO -> o Dito "esqueceu de novo" e foi levado para a
// ALA DO DESCANSO -> de dia, só de ROSTO (forma humana) se entra no hospital; a Irmã Dalva -> de noite, pela
// lavanderia: a RONDA DAS LANTERNAS (cones de luz; baú parado passa, gente na luz é pega) -> Relógio de Plantão ->
// Sala do Diretor: a ficha do Dito (TRANSFERIDO: CANDEIA) e a LISTA DO DESCANSO com a letra pequena e cuidadosa.

// ---------- gente nova ----------
Object.assign(HUMS, {
  dalva: { h: 46, skin: '#a8704a', hair: '#d8d4d0', hairStyle: 'coque', top: '#e8f0ee', bottom: '#5a7a8a', apron: '#ffffff', acc: '#3a7a7a',
    extra: (P, o) => { if (o.view !== 'b') { P.rect(o.cx - 5, o.hcY - 9, 10, 3, '#ffffff'); P.rect(o.cx - 1, o.hcY - 9, 2, 3, '#3a7a7a'); } else P.rect(o.cx - 5, o.hcY - 9, 10, 3, '#ffffff'); } },
  enfermeiro: { h: 50, skin: '#c8b0a0', hair: '#2a2a30', top: '#e8f0ee', coat: '#d8e4e0', bottom: '#3a4a58', hat: '#2a2a30',
    extra: (P, o) => { P.rect(o.cx - 1, o.hcY - 12, 2, 5, '#f2ecdc'); P.p(o.cx, o.hcY - 13, o.fr ? '#ffd060' : '#ff9a30'); const lx = o.cx + (o.view === 's' ? 6 : 7); P.rect(lx, o.tT + 8, 4, 6, '#3a3a48'); P.rect(lx + 1, o.tT + 9, 2, 4, '#ffe080'); } },
  porteiro: { h: 51, skin: '#c8b0a0', hair: '#3a2a1a', top: '#5a5a6a', coat: '#4a4a5a', bottom: '#2a2a34', hat: '#2a2a30',
    extra: (P, o) => { P.rect(o.cx - 1, o.hcY - 12, 2, 5, '#f2ecdc'); P.p(o.cx, o.hcY - 13, '#ffb040'); } },
  pregoeiro: { h: 50, skin: '#e0b090', hair: '#8a4a2a', top: '#c84a4a', bottom: '#3a3048', hat: '#2a2a3a', collar: '#e8dcc0' },
  velhoL: { h: 44, skin: '#c89070', hair: '#e8e4e0', top: '#6a5a4a', bottom: '#3a3a44', beard: true },
  pac1: { h: 47, skin: '#d8a078', hair: '#5a3a1a', top: '#c8dce0', bottom: '#c8dce0' },
  pac2: { h: 44, skin: '#8a5a3a', hair: '#1a1a1a', hairStyle: 'longo', top: '#c8dce0', bottom: '#c8dce0' }
});
Object.assign(WHO, {
  dalva: { name: () => 'Irmã Dalva', portrait: () => portHum('dalva'), voice: voz(360, 'blipTri'), col: '#e8f8f0' },
  enfermeiro: { name: () => 'Enfermeiro', portrait: () => portHum('enfermeiro'), voice: voz(380), col: '#e8e0d8' },
  porteiro: { name: () => 'Porteiro', portrait: () => portHum('porteiro'), voice: voz(300, 'blipLow'), col: '#e8e0d8' },
  pregoeiro: { name: () => 'Pregoeiro', portrait: () => portHum('pregoeiro'), voice: voz(460) },
  velhoL: { name: () => 'Seu Antero', portrait: () => portHum('velhoL'), voice: voz(260, 'blipLow') },
  paciente: { name: () => 'Paciente', portrait: () => portHum('pac1'), voice: voz(420) }
});

// ---------- trilhas ----------
Object.assign(TRACKS, {
  hospital: { bpm: 76, bars: 8, chords: 'Am F C G Am F E E', bass: 'root5', bassVol: 0.09,
    lead: 'E5:4 A5:4 C6:4 B5:4 | A5:4 F5:4 A5:8 | G5:4 C6:4 E6:4 D6:4 | B5:4 G5:4 D5:8 | E5:4 A5:4 C6:4 E6:4 | F6:4 E6:4 C6:8 | B5:4 G#5:4 E5:4 B5:4 | G#5:16',
    leadWave: 'triangle', leadVol: 0.08, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: '', hatVol: 0 },
  ronda: { bpm: 96, bars: 4, chords: 'Dm Dm Bb A', bass: 'oct8', bassVol: 0.1,
    lead: 'D5:2 .:6 F5:2 .:6 | E5:2 .:6 D5:2 .:6 | F5:2 .:2 G5:2 .:2 A5:4 .:4 | C#5:4 .:4 E5:4 .:4',
    leadWave: 'triangle', leadVol: 0.06, arp: { rate: 2, vol: 0.01, oct: 0 }, drums: 'k.......h.......', hatVol: 0.02 }
});

// ---------- mapas ----------
const LG = POS4.largo, H1 = POS4.hosp1, H2 = POS4.hosp2, SA = POS4.sala;
const gradeProps = (m) => { for (const p of m.props || []) { if (p._hld) continue; const f = p.img; p._hld = true; p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : EMPTY_C; }; } };
{ const _mm4 = montarMapas2; montarMapas2 = function () {
  _mm4.apply(this, arguments);
  // ===== LARGO DO HOSPITAL =====
  MAPS2.largo = { rows: ROWS4.largo, name: 'Auren · Largo do Hospital', music: 'auren', batBg: bgAuren, showMoney: true, bg: '#1c2a4a',
    props: [
      { img: hospitalArt, x: 14, y: 10 },
      { img: casa({ w: 5, wall: '#c8c0b0', roof: '#5a6a8a', door: 2, win: [0.4, 3.4] }), x: 38, y: 8 },
      { img: casa({ w: 6, wall: '#9a8ab8', roof: '#c84a7a', door: 2.5, win: [0.5, 4.2], wallH: 106 }), x: 2, y: 9 },
      { img: casa({ w: 5, wall: '#b8a8c8', roof: '#4a5a7a', door: 1.8, win: [0.4, 3.4], chimney: true }), x: 8, y: 8 },
      ...[[0.2, 7], [13.0, 7], [32.4, 7], [35.0, 7], [43.6, 7]].map(([x, y], i) => ({ img: arvC(i + 1), x: x - 0.2, y })),
      { img: memo(fonteArt), x: LG.fonte[0], y: LG.fonte[1], solid: [[LG.fonteSol[0][0], LG.fonteSol[0][1], 4, 2]] },
      ...LG.postes.map(([x, y]) => ({ img: () => poste3Art(true, true), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...LG.arvores.map(([x, y], i) => ({ img: arvC(i + 5), x: x - 1.25, y: y + 1, solid: [[x, y, 1, 1]], arvore: true })),
      ...LG.canteiros.map(([x, y], i) => ({ img: () => canteiroArt(i), x: x - 0.5, y: y + 1, solid: [[x, y, 1, 1]] })),
      ...LG.varal.map(([x, y]) => ({ img: () => varalArt(), x, y: y + 1, by: (y + 1) * TS + 2 })),
      ...LG.banco.map(([x, y]) => ({ img: memo(bancoHArt), x: x - 0.5, y: y + 1 }))
    ],
    ents: [
      ...LG.festDoor.map(([x, y]) => porta(x, y, 'festival', ...POS3.festival.largoOut, 'left')),
      ...LG.hospDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: entrarHospital })),
      { t: 'trig', x: LG.lavDoor[0], y: LG.lavDoor[1], w: 1, h: 1, passa: true, run: entrarLavanderia },
      marcoEnt(...LG.marco),
      morador('tico', ...LG.tico, { rotina: rot([LG.tico[0], LG.tico[1], 'olhar', 9000, 'up']), talk: falaTico4, gone: () => !!G.flags.c4P1Fim }),
      morador('pregoeiro', ...LG.pregoeiro, { rotina: rot([30, 12, 'olhar', 500, 'down'], [32, 13, 'olhar', 400, 'left']), talk: falaPregoeiro }),
      morador('porteiro', ...LG.porteiro, { rotina: rot([LG.porteiro[0], LG.porteiro[1], 'olhar', 9000, 'down']), talk: falaPorteiro }),
      morador('guardaA', ...LG.guarda, { rotina: rot([LG.guarda[0], LG.guarda[1], 'olhar', 9000, 'down']), talk: async () => { await say(pickOne(['Fila andando, fila andando. Quem tem ficha entra, quem não tem espera.', 'O Acendedor-Mor comprou a casa. Agora tem lanterna em todo corredor. Coisa fina.']), 'guardaA'); } }),
      ...LG.fila.map(([x, y], i) => morador(['povo1', 'povo2', 'velha2'][i], x, y, { rotina: rot([x, y, 'olhar', 9000, 'up']), talk: falaFila(i) })),
      morador('velhoL', ...LG.velho, { rotina: rot([18, 24, 'olhar', 600, 'up'], [20, 24, 'olhar', 400, 'right']), talk: falaAntero }),
      bauEnt('largo', 'a', ...LG.bau, () => dar('frasco', 1))
    ],
    onEnter: async () => { if (!G.flags.c4Largo) await chegaLargo(); }
  };
  // ===== CASA DE SAÚDE, TÉRREO =====
  MAPS2.hosp1 = { rows: ROWS4.hosp1, name: 'Casa de Saúde do Largo', music: 'hospital', batBg: bgHospital, bg: '#0e1a1c', key: KEY_HOSP,
    props: [
      { img: memo(() => balcaoArt(6)), x: 3, y: 6, solid: [[3, 5, 6, 1]] },
      ...H1.camas.map(([x, y], i) => ({ img: memo(() => camaHArt(i, i !== 2, i % 3 === 0)), x: x - 0.12, y: y + 2, solid: [[x, y, 1, 2]] })),
      ...H1.bancos.map(([x, y]) => ({ img: memo(bancoHArt), x: x - 0.5, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: memo(cartazHArt), x: H1.cartaz[0] - 0.2, y: H1.cartaz[1] + 0.2 },
      { img: memo(vasoArt), x: H1.vaso[0], y: H1.vaso[1] + 1 },
      { img: memo(biomboArt), x: 24.5, y: 6.4 }
    ],
    ents: [
      ...H1.door.map(([x, y]) => porta(x, y, 'largo', ...LG.hospOut, 'down')),
      morador('dalva', ...H1.dalva, { rotina: rot([5, 4, 'limpar', 500, 'down'], [8, 4, 'olhar', 300, 'down']), talk: falaDalva }),
      { t: 'sign', x: H1.balcao[0], y: H1.balcao[1], h: 30, talk: falaDalva },
      ...H1.camas.map(([x, y], i) => ({ t: 'sign', x, y: y + 1, h: 30, talk: () => falaCama(i) })),
      ...H1.escada.map(([x, y]) => ({ t: 'sign', x, y, h: 20, talk: escadaFechada })),
      { t: 'sign', x: H1.cartaz[0], y: H1.cartaz[1], h: 20, talk: async () => { await say('* Cartaz novo, papel bom: "CASA DE SAÚDE DO LARGO — sob os cuidados do Acendedor-Mor. Luz em todos os leitos. Descanso para quem sofre."'); await say('* Embaixo, num canto, um papel velho que ninguém arrancou: "Doações de velas para o inverno: falar com a Irmã Dalva."'); } },
      morador('pac1', ...H1.visita, { rotina: rot([4, 10, 'olhar', 9000, 'right']), talk: falaVisita })
    ],
    onEnter: async () => { if (!G.flags.c4Hosp1) { G.flags.c4Hosp1 = true; await say('* Cheiro de sabão e de vela. Corredor limpo, camas de ferro, gente deitada. E, em cima de algumas camas, um fio de cobre novo que sobe até o teto, com um pote pendurado.'); await say('[O baú usa o rosto. O fôlego corre. Se o rosto derreter aqui dentro, alguém vai notar uma mala muito estranha no meio da enfermaria.]', 'cat'); } }
  };
  // ===== ALA DO DESCANSO (noite) =====
  MAPS2.hosp2 = { rows: ROWS4.hosp2, name: 'Ala do Descanso', music: 'ronda', batBg: bgHospital, bg: '#0a1012', key: KEY_HOSP, noiteHosp: true, soBau: true,
    props: [
      { img: memo(() => camaHArt(1, false, true)), x: H2.camaDito[0] - 0.12, y: H2.camaDito[1] + 2, solid: [[H2.camaDito[0], H2.camaDito[1], 1, 2]] },
      ...H2.potes.map(([x, y], i) => ({ img: () => potesArt(Math.floor(FRAME / 30 + i) % 3), x: x - 0.2, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: memo(() => estanteArt(2)), x: H2.rouparia[0], y: H2.rouparia[1] + 1, solid: [[11, 5, 2, 1]] },
      { img: memo(() => camaHArt(2, true, true)), x: 8.9, y: 14 }, { img: memo(() => camaHArt(3, true, true)), x: 11.9, y: 14 },
      { img: memo(() => camaHArt(0, true, true)), x: 17.9, y: 7 }, { img: () => G.flags.c4Relogio ? EMPTY_C : relogioArt(Math.floor(FRAME / 15) % 4, 'noite', false), x: 24.6, y: 5.2, solid: [[26, 4, 2, 1]] }
    ],
    ents: [
      { t: 'trig', x: H2.descida[0][0], y: H2.descida[0][1], w: 1, h: 1, passa: true, run: sairLavanderia },
      marcoEnt(...H2.marco),
      ...H2.rondas.map((r, i) => ({ t: 'ronda', id: 'ronda' + i, x: r.at[0], y: r.at[1], path: r.path, h: 50, passo: 22, spr: humSpr('enfermeiro'), dir: 'down', talk: async () => { await say('...', 'enfermeiro'); } })),
      inimigo('p1', 'pesadelo', ...H2.pes1, ['pesadelo'], { spr: (t) => pesadeloArt(Math.floor(t / 9) % 4), h: 34, bg: bgHospital, vision: 3 }),
      inimigo('l1', 'lencol', ...H2.len1, ['lencol'], { spr: (t) => lencolArt(Math.floor(t / 10) % 4), h: 40, bg: bgHospital, vision: 3 }),
      inimigo('p2', 'pesadelo', ...H2.pes2, ['pesadelo', 'pesadelo'], { spr: (t) => pesadeloArt(Math.floor(t / 9) % 4), h: 34, bg: bgHospital, vision: 3 }),
      inimigo('l2', 'lencol', ...H2.len2, ['lencol', 'pesadelo'], { spr: (t) => lencolArt(Math.floor(t / 10) % 4), h: 40, bg: bgHospital, vision: 3 }),
      inimigo('m1', 'lencol', ...H2.misto, ['lencol', 'pesadelo', 'pesadelo'], { spr: (t) => lencolArt(Math.floor(t / 10) % 4), h: 40, bg: bgHospital, vision: 3 }),
      { t: 'sign', x: H2.camaDito[0], y: H2.camaDito[1] + 1, h: 30, talk: camaDito },
      ...H2.potes.map(([x, y]) => ({ t: 'sign', x, y, h: 30, talk: lerPotes })),
      bauEnt('hosp2', 'a', ...H2.bau, () => dar('pluma', 1)),
      { t: 'sign', x: H2.rouparia[0], y: H2.rouparia[1], h: 30, talk: async () => { await say('* A rouparia: lençóis dobrados, travesseiros, jalecos. Num canto, uma pilha de lençóis que respira. Melhor não mexer.'); } },
      { t: 'sign', x: H2.nota[0], y: H2.nota[1] - 1, h: 20, talk: notaEnfermeira },
      { t: 'trig', x: 25, y: 3, w: 1, h: 3, passa: true, run: lutaRelogio }, { t: 'trig', x: 26, y: 5, w: 2, h: 1, passa: true, run: lutaRelogio },
      ...H2.salaDoor.map(([x, y]) => ({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: entrarSala }))
    ],
    onEnter: async () => { if (!G.flags.c4Ronda) await tutRonda(); }
  };
  // ===== SALA DO DIRETOR =====
  MAPS2.sala = { rows: ROWS4.sala, name: 'Sala do Diretor', music: 'ronda', bg: '#0a1012', key: KEY_HOSP, soBau: true,
    props: [{ img: memo(mesaArt), x: 4.8, y: 5, solid: [[5, 4, 3, 1]] }, { img: memo(arquivoArt), x: 1.9, y: 4, solid: [[2, 3, 1, 1]] }, { img: memo(vasoArt), x: 10, y: 8, solid: [[10, 7, 1, 1]] }],
    ents: [...SA.door.map(([x, y]) => porta(x, y, 'hosp2', ...H2.salaOut, 'down')),
      { t: 'sign', x: SA.mesa[0], y: SA.mesa[1], h: 26, talk: mesaDiretor }, { t: 'sign', x: SA.arquivo[0], y: SA.arquivo[1], h: 30, talk: arquivoDito },
      { t: 'sign', x: SA.quadro[0], y: SA.quadro[1] - 1, h: 20, talk: async () => { await say('* Um quadro: a fachada da Casa de Saúde, pintada há muitos anos, com neve no telhado e TODAS as janelas apagadas. Embaixo: "Inverno Escuro. Nunca mais."'); } }]
  };
  for (const id of ['largo', 'hosp1', 'hosp2', 'sala']) gradeProps(MAPS2[id]);
  // a Avenida do Festival ganha a saída leste para o Largo (só depois do Cap. 3)
  const fe = MAPS2.festival; if (fe && !fe._largo) { fe._largo = true; for (const [x, y] of POS3.festival.largoDoor) fe.ents.push({ t: 'trig', x, y, w: 1, h: 1, passa: true, run: async () => { if (!G.flags.c3Fim) { await say(G.flags.c3P1Fim ? '* O Largo do Hospital fica para lá, mas ainda não é hora. Antes: o Tico espera vocês na grade do bueiro, no Bairro Baixo de Auren. Tem alguma coisa respirando lá embaixo.' : '* O Largo do Hospital fica para lá. Hoje não é dia.'); W2.mv = null; return; } sfx('door'); await fadeOut(10); loadMap2('largo', ...LG.chegada, 'right'); await fadeIn(10); if (MAPS2.largo.onEnter) await MAPS2.largo.onEnter(); } }); }
}; }
// nos mapas "só baú" a Lume e a Rita vão DENTRO do baú (ninguém segue a pé)
{ const _lm4 = loadMap2; loadMap2 = function (id) { const r = _lm4.apply(this, arguments); if (MAPS2[id] && MAPS2[id].soBau) W2.fol = []; return r; }; }

// ---------- RONDA DAS LANTERNAS ----------
// O enfermeiro anda de ponta a ponta do corredor e para um pouco em cada ponta. A lanterna faz um CONE de luz fixo à
// frente dele (4 tiles; paredes cortam a luz). Gente na luz = pego. Baú na luz só passa se estiver PARADO.
function coneRonda(e) {
  const [dx, dy] = DIR2[e.dir], out = [];
  for (let f = 1; f <= 4; f++) for (let s = -Math.ceil(f / 2); s <= Math.ceil(f / 2); s++) {
    const tx = e.x + dx * f + dy * s, ty = e.y + dy * f + dx * s;
    // linha de visão: cada tile entre a lanterna e este precisa ser chão
    let ok = !tileOf(W2.map, tx, ty).solid;
    for (let k = 1; ok && k <= f; k++) { const q = k / f, ix = Math.round(e.x + (tx - e.x) * q), iy = Math.round(e.y + (ty - e.y) * q); if (tileOf(W2.map, ix, iy).solid || propSolid(W2.map, ix, iy)) ok = false; }
    if (ok) out.push([tx, ty]);
  }
  return out;
}
{ const _ue4 = updateEnt; updateEnt = function (e) {
  if (e.t !== 'ronda') return _ue4(e);
  if (e.mv) { stepTween(e, e.passo || 22); return; }
  if (worldBusy2()) return;
  const [a, b] = e.path, alvo = e.ida ? b : a;
  if (e.x === alvo[0] && e.y === alvo[1]) { if ((e.pausa = (e.pausa || 0) + 1) < 70) return; e.pausa = 0; e.ida = !e.ida; return; }
  const dx = Math.sign(alvo[0] - e.x), dy = dx ? 0 : Math.sign(alvo[1] - e.y); e.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
  if (W2.x === e.x + dx && W2.y === e.y + dy) { if ((e.trava = (e.trava || 0) + 1) > 50) { e.trava = 0; e.ida = !e.ida; e.emote = { s: pickOne(['Baú no meio do caminho...', 'Hmpf. Dou a volta.']), t: 70 }; } return; }
  e.trava = 0;
  startMove(e, e.x + dx, e.y + dy);
}; }
{ const _uw4 = updateWorld2; updateWorld2 = function () {
  _uw4();
  if (V.scene !== 'world' || !W2.map || !W2.map.noiteHosp || worldBusy2() || W2.pego) return;
  for (const e of W2.ents) if (e.t === 'ronda') {
    const cone = coneRonda(e), dentro = cone.some(([x, y]) => (x === W2.x && y === W2.y) || (W2.mv && x === W2.mv.tx && y === W2.mv.ty));
    if (!dentro) { e.olhou = 0; continue; }
    if (rostoSt().on || W2.mv) { W2.pego = true; run2(() => pegoNaRonda(e)); return; }
    if (!e.olhou) { e.olhou = 1; e.emote = { s: pickOne(['Hm. Roupa suja.', 'Quem largou esse baú aqui?', '...Lavanderia amanhã.']), t: 80 }; }
  }
}; }
async function pegoNaRonda(e) {
  sfx('cancel'); V.shake = 6; e.emote = { s: '!', t: 40 };
  await say(rostoSt().on ? pickOne(['Visita fora de hora! Para fora, para fora.', 'Ei! A Ala do Descanso está fechada. Como o senhor entrou aqui?']) : pickOne(['...Esse baú ANDOU?', 'Baú de roupa suja não anda. Isso eu tenho certeza.']), 'enfermeiro');
  if (!G.flags.tutPego) { G.flags.tutPego = true; await say('[Na luz da lanterna: GENTE é pega sempre; BAÚ só passa se estiver parado. Espere o cone passar, ou fique quieto dentro dele.]', 'cat'); }
  await fadeOut(14);
  if (rostoSt().on) desfazRosto();
  loadMap2('hosp2', ...H2.entra, 'up'); W2.pego = false;
  await fadeIn(14);
}
// luz da noite no hospital: escuro, luar nas janelas e os cones das lanternas
let ESC4_C = null;
{ const _ar4 = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  if (_ar4) _ar4(m, ox, oy);
  if (!m || !m.noiteHosp) return;
  if (!ESC4_C || ESC4_C.width !== W || ESC4_C.height !== H) ESC4_C = mk(W, H);
  const x = ESC4_C.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(4,8,16,0.84)'; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'destination-out';
  const furo = (cx, cy, r, a = 1) => { const g = x.createRadialGradient(cx, cy, r * 0.2, cx, cy, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); };
  furo(W2.px + 8 - ox, W2.py + 4 - oy, 44, 0.85);
  const cones = [];
  for (const e of W2.ents) if (e.t === 'ronda') { const c = coneRonda(e); cones.push([e, c]); furo(e.px + 8 - ox, e.py - 20 - oy, 22); for (const [tx, ty] of c) { x.fillStyle = 'rgba(0,0,0,0.78)'; x.fillRect(tx * TS - ox, ty * TS - oy, TS, TS); } }
  for (let tx = 2; tx < m.w; tx += 6) furo(tx * TS - ox, 3 * TS - oy, 26, 0.45);   // luar das janelas do corredor de cima
  x.globalCompositeOperation = 'source-over';
  bx.drawImage(ESC4_C, 0, 0);
  // a luz quente das lanternas por cima, tremendo um pouco
  bx.globalCompositeOperation = 'lighter';
  for (const [e, c] of cones) { const fl = 0.11 + Math.sin(W2.t * 0.3 + e.x) * 0.02; bx.fillStyle = `rgba(255,214,120,${fl})`; for (const [tx, ty] of c) bx.fillRect(tx * TS - ox, ty * TS - oy, TS, TS); luzMundo(e.px + 8 - ox, e.py - 20 - oy, 14, 'rgba(255,220,140,0.25)'); }
  bx.globalCompositeOperation = 'source-over';
}; }

// ---------- falas: o Largo ----------
async function chegaLargo() {
  G.flags.c4Largo = true;
  await say('* O Largo do Hospital: uma praça de pedra clara, uma fonte sem água e, ocupando um lado inteiro, a CASA DE SAÚDE DO LARGO. Três andares, janelas acesas em pleno dia.');
  await say('Ouçam, ouçam! O Acendedor-Mor COMPROU a Casa de Saúde! Lanterna em todo leito, enfermeiro a noite inteira! "Nunca mais um hospital no escuro"! Ouçam!', 'pregoeiro');
  await say('O hospital do discurso. O das velas que acabaram na terceira noite.', 'rita');
  await say('Ele está cumprindo a promessa. Isso é... bom. Não é?', 'lume');
  await say('Promessa boa não costuma precisar de pregoeiro.', 'me');
  await say('* Ninguém responde. Perto da fonte, um menino com uma vassoura maior que ele acena para vocês.');
}
async function falaTico4() {
  if (!G.flags.c4Tico) {
    G.flags.c4Tico = true;
    await say('Vocês vieram. O Dito... ele esqueceu de novo. Ontem ele me chamou de Tico, hoje de manhã me chamou de "rapazinho". Aí uns enfermeiros de jaleco vieram e levaram ele pra cá.', 'tico');
    await say('Pra ALA DO DESCANSO. Disseram que lá ele descansa e "melhora". Eu perguntei melhora do quê. Eles sorriram.', 'tico');
    await say('E não deixam entrar. Na porta tem um Pavio que diz: "só gente, nada de bicho, nada de mala".', 'tico');
    await say('...Nada de mala.', 'rita');
    await say('Eu sou um baú. Tecnicamente não é mala.', 'me');
    await say('* As duas olham para você ao mesmo tempo.');
    await say('[Sugestão: o rosto (botão B). Gente entra. Mala não.]', 'cat');
    return;
  }
  if (G.flags.c4P1Fim) return;
  await say(G.flags.c4Hosp ? 'A Irmã Dalva é boa. Ela me dava pão quando o Dito ia trabalhar. Se ela disse que dá pra entrar de noite, dá.' : 'Entra de rosto. Fala com a Irmã Dalva, ela cuida da recepção. Ela ainda lembra das coisas.', 'tico');
}
async function falaPregoeiro() {
  await say(pickOne(['Casa de Saúde do Largo, agora da Coroa e do Acendedor-Mor! Leito com luz, descanso garantido!', 'O Farol de Cem Invernos acende na última noite do festival! Faltam poucos dias!', 'Pavio novo contratado toda semana! Salário bom, serviço leve! Procurar o escritório do Acendedor!']), 'pregoeiro');
}
async function falaPorteiro() {
  if (ehNoite()) { await say('Fechado. Visitas das oito às seis. Volte de dia.', 'porteiro'); return; }
  await say(rostoSt().on ? 'Visita? Pode entrar. Sem barulho. Os doentes descansam.' : 'Mala não entra. Bicho não entra. Bagagem fica com o dono do lado de fora.', 'porteiro');
}
const falaFila = i => async () => { await say(['Vim tirar a dor do joelho. Dizem que lá no Descanso a dor some. Some tudo, diz a minha vizinha. Ela ficou tão leve...', 'Minha mãe entrou semana passada. Saiu sorrindo. Não lembra o meu nome, mas sorri.', 'Eu trabalhei aqui no Inverno Escuro, sabia? Quarenta noites. Eu lembro de tudo. Tomara que eles não me "curem" disso.'][i], 'povo'); };
async function falaAntero() {
  await say('Sessenta anos que eu passo por esse largo. Antes a casa era das irmãs: pobre, fria, cheia de vela. Agora é bonita.', 'velhoL');
  await say('Mas sabe o que é engraçado? Antes, quem saía de lá saía chorando ou rindo. Agora todo mundo sai igual.', 'velhoL');
}
async function entrarHospital() {
  W2.mv = null;
  if (ehNoite()) { await say('* A porta grande está trancada. Lá dentro, uma lanterna passa devagar pelo corredor, de janela em janela.'); return; }
  if (!rostoSt().on) { sfx('bump'); await say('Ei, ei. Mala não entra. Bagagem fica aqui fora.', 'porteiro'); if (!G.flags.tutRostoH) { G.flags.tutRostoH = true; await say('[Aperte B para usar o rosto. O fôlego corre enquanto você é gente: não demore lá dentro.]', 'cat'); } return; }
  sfx('door'); await fadeOut(10); loadMap2('hosp1', ...H1.entra, 'up'); await fadeIn(10); if (MAPS2.hosp1.onEnter) await MAPS2.hosp1.onEnter();
}
// rosto derreteu dentro do hospital (de dia): põem para fora
{ const _uw5 = updateWorld2; updateWorld2 = function () {
  _uw5();
  if (V.scene === 'world' && W2.id === 'hosp1' && !rostoSt().on && !worldBusy2() && !W2.mv && !W2.expulso) { W2.expulso = true; run2(async () => {
    await say('* Uma enfermeira olha para baixo e encontra, no lugar da visita, um baú com dentes.');
    await say('Uma... uma MALA? Quem deixou essa mala na enfermaria? Leva pra fora, leva pra fora!', 'enfermeiro');
    await fadeOut(12); loadMap2('largo', ...LG.hospOut, 'down'); W2.expulso = false; await fadeIn(12);
    if (!G.flags.tutExpulso) { G.flags.tutExpulso = true; await say('[O fôlego acabou. Descanse como baú lá fora e tente de novo. Dica: o fôlego enche mais rápido parado.]', 'cat'); }
  }); }
}; }

// ---------- falas: o térreo ----------
async function falaDalva() {
  if (G.flags.c4P1Fim) { await say('Vão com cuidado na serra. E me tragam o Dito. E os outros também, se puderem.', 'dalva'); return; }
  if (!G.flags.c4Hosp) {
    G.flags.c4Hosp = true; save2();
    await say('Bom dia, meu filho. Visita? Nome do paciente?', 'dalva');
    await say('Dito. Pavio. O irmão dele, o Tico, está lá fora.', 'rita');
    await say('* A enfermeira para de escrever. É uma senhora de touca branca, mãos grossas, olhos muito cansados. Ela olha para a porta, para os lados, e baixa a voz.', 'n');
    await say('O Dito está na Ala do Descanso. Lá em cima. Visita não pode. Ordem nova, dos donos novos.', 'dalva');
    await say('Eu trabalho nesta casa há trinta anos. Trabalhei no Inverno Escuro. Segurei a mão de muita gente no escuro, filho. Eu sei o que é um hospital sem luz.', 'dalva');
    await say('Agora tem luz em todo leito. E os doentes não sentem mais dor. Nem saudade. Nem medo. Eles DESCANSAM.', 'dalva');
    await say('Descansar não é isso. Descansar é acordar depois.', 'me');
    await say('* Ela fecha o livro de registro com um pouco de força demais.');
    await say('Eu não posso deixar vocês subirem. Mas a lavanderia, do lado de fora, fica aberta de noite. Para os lençóis.', 'dalva');
    await say('...Eu não disse isso. Vocês não ouviram isso. Bom dia.', 'dalva');
    await say('[Objetivo: voltar À NOITE e entrar pela LAVANDERIA (a casinha do lado direito do hospital). Para esperar a noite, descanse num Marco.]', 'cat');
    return;
  }
  await say(pickOne(['A lavanderia. De noite. Eu não disse nada.', 'Os enfermeiros novos andam com lanterna a noite inteira. Eles enxergam o que a luz pega. Só o que a luz pega.', 'Cuidado lá em cima. Os lençóis andam sozinhos desde que puseram os potes.']), 'dalva');
}
async function falaCama(i) {
  const F = [
    ['* Um senhor de bigode, sorrindo para o teto.', 'Reumatismo? Não, não tenho. Nunca tive. Esposa? Também não. Acho. Que bom, não é? Que leve.'],
    ['* Uma moça abraçando o travesseiro.', 'Eu tinha medo de altura. Agora não tenho mais. Também não lembro... como é mesmo o meu nome? Tem na ficha. A ficha sabe.'],
    ['* Uma cama vazia, lençol esticado, um pote de vidro VAZIO pendurado no fio.', null],
    ['* Um menino com a perna enfaixada, acordado, com medo.', 'Moço... eles vão me levar pro andar de cima? Eu não quero esquecer a minha mãe. Ela vem amanhã. Ela vem, né?'],
    ['* Uma senhora dormindo de boca aberta. Ronca. Pelo menos isso continua igual.', null],
    ['* Um homem forte, de olhos parados, abrindo e fechando a mão.', 'Eu era ferreiro. Acho. Minha mão lembra. Eu não.'],
    ['* Uma velha tricotando uma coisa sem fim.', 'É um cachecol. Pra quem? Não sei. Mas eu sei tricotar. Isso eles não levam.']
  ][i] || ['* Alguém dormindo.', null];
  await say(F[0]); if (F[1]) await say(F[1], 'paciente');
  if (i === 3 && !G.flags.c4Menino) { G.flags.c4Menino = true; await say('Ninguém vai te levar a lugar nenhum. A gente promete.', 'lume'); await say('* A Lume não sabe se pode prometer isso. Promete mesmo assim.'); }
}
async function falaVisita() { await say('Vim ver meu pai. Ele está ótimo, disseram. Não sente nada. Eu também não sinto nada quando olho pra ele. Ele me olha como se olha um móvel.', 'paciente'); }
async function escadaFechada() { await say('* A escada para o segundo andar. Uma corrente atravessada, com uma placa: "ALA DO DESCANSO — SÓ FUNCIONÁRIOS". Um cadeado novo, brilhando.'); }

// ---------- a noite: lavanderia e Ala do Descanso ----------
async function entrarLavanderia() {
  W2.mv = null;
  if (G.flags.c4P1Fim) { await say('* A lavanderia. Cheiro de sabão. Lá em cima, a Ala do Descanso está quieta.'); }
  if (!G.flags.c4Hosp) { await say('* Uma casinha com varal no fundo: a lavanderia do hospital. Trancada. "Só funcionários."'); return; }
  if (!ehNoite()) { await say('* De dia a lavanderia está cheia de gente batendo lençol. Ninguém vai deixar um baú passear por aqui. Volte À NOITE (descanse num Marco).'); return; }
  if (!G.flags.c4Noite) {
    G.flags.c4Noite = true;
    await say('* A porta da lavanderia está só encostada. Lá dentro: tanques, sabão, cestos de lençol e, no fundo, uma escadinha de serviço que sobe para o segundo andar.');
    await say('Plano: eu e a Rita entramos no baú. Lá em cima, você é só mais um baú de roupa suja.', 'lume');
    await say('E se alguém abrir a tampa?', 'rita');
    await say('Aí você sai e bate. Com carinho.', 'lume');
    await say('Ninguém pergunta se o baú quer gente dentro dele. Só pra constar.', 'me');
    await say('* As duas entram na tampa. Lá dentro é maior do que parece. Ninguém comenta. Ninguém nunca comenta.');
  }
  sfx('door'); await fadeOut(12); loadMap2('hosp2', ...H2.entra, 'up'); await fadeIn(12); if (MAPS2.hosp2.onEnter) await MAPS2.hosp2.onEnter();
}
async function sairLavanderia() { W2.mv = null; sfx('door'); await fadeOut(12); loadMap2('largo', ...LG.lavOut, 'down'); await fadeIn(12); }
async function tutRonda() {
  G.flags.c4Ronda = true;
  await say('* O segundo andar. Escuro. Corredores de ladrilho, portas fechadas, fios de cobre no teto zumbindo baixinho. E, lá na frente, uma lanterna andando.');
  await say('[A RONDA DAS LANTERNAS. Cada enfermeiro faz um cone de luz à frente. GENTE na luz: pega na hora. BAÚ na luz: só se estiver PARADO ("roupa suja"). Espere o cone passar.]', 'cat');
  await say('[As portas daqui têm maçaneta. Baú não tem mão. Para abrir, use o rosto (B), mas fora da luz.]', 'cat');
}
async function camaDito() {
  if (G.flags.c4CamaDito) { await say('* A cama do Dito. Vazia. O pote, vazio também.'); return; }
  G.flags.c4CamaDito = true;
  await say('* Uma cama com plaquinha: "DITO — PAVIO Nº 212". Lençol esticado. Ninguém. No pote pendurado sobre a cama, só um fio de fumaça morna no fundo.');
  await say('Ele estava aqui. Ontem, talvez hoje.', 'rita');
  await say('A gente chegou tarde. De novo.', 'me');
  await say('[O pote tem resto de lembrança. Pouco. A maior parte já subiu pelo fio.]', 'cat');
  await say('Subiu pra onde?', 'lume');
  await say('* O fio sobe pelo teto, entra num cano maior e segue, junto com dezenas de outros, para o lado do morro. Para o lado do Farol.');
}
async function lerPotes() {
  await say('* Potes de vidro em fila, cada um preso a um fio, cada um com uma luzinha dentro. Etiquetas com letra pequena e cuidadosa: "dor no joelho". "medo de altura". "saudade (esposa)". "o nome".');
  await say('[Âmbar novo. Lembrança lida de gente VIVA. Não estava no meu registro que isso era possível.]', 'cat');
  await say('...Estava no seu registro que gente boa faria isso?', 'rita');
  await say('[Não.]', 'cat');
  await say('...Nem no meu.', 'me');
}
async function notaEnfermeira() { await say('* Um bilhete preso no quadro de avisos: "Ronda das 22h às 5h. Lanterna sempre acesa. Os pacientes NÃO podem acordar no escuro. Ordem do Diretor." Embaixo, à mão, outra letra: "e se eles quiserem?"'); }
async function lutaRelogio() {
  if (G.flags.c4Relogio) return; W2.mv = null;
  await say('* No fim do corredor, na frente da Sala do Diretor, um relógio de pêndulo mais alto que a porta. Os ponteiros param. E se viram para você.');
  await say('Tic. Tac. Fora. De. Hora.', 'n');
  await say('Um relógio falante. Claro. Por que não.', 'me');
  await say('[Relógio de Plantão. Ele muda a HORA a cada três vezes, e a fraqueza muda junto: manhã gelo, tarde fogo, noite luz. Mordida sempre funciona.]', 'cat');
  const r = await lutaMapa(['relogio'], { bg: bgHospital, music: 'boss', pos: [[186, 160]], intro: async () => { const e = BT.foes[0]; e.hora = 'manha'; e.weak = ['gelo', 'mordida']; e.ct = 10; callout('RELÓGIO DE PLANTÃO', '#f0c050', 100); } });
  if (r !== 'win') return;
  G.flags.c4Relogio = true; save2();
  await say('* O relógio cai de costas no ladrilho. O pêndulo para. E, pela primeira vez em muito tempo, a Ala do Descanso fica sem tique-taque.');
  await say('* Atrás dele, a porta da Sala do Diretor.');
}
async function entrarSala() {
  W2.mv = null;
  if (!G.flags.c4Relogio) { await say('* O relógio está na frente da porta.'); return; }
  if (!rostoSt().on) { sfx('bump'); await say('* Uma maçaneta redonda, de latão. Você encosta a tampa nela. A maçaneta não se impressiona.'); await say('[Baú não tem mão. Use o rosto (B) aqui fora, longe da luz.]', 'cat'); return; }
  sfx('door'); await fadeOut(10); loadMap2('sala', ...SA.entra, 'up'); await fadeIn(10);
  if (!G.flags.c4Sala) { G.flags.c4Sala = true; await say('* A Sala do Diretor. Tapete bom, mesa boa, cheiro de tinta fresca. Ninguém. Uma luminária acesa, como se o dono tivesse saído há um minuto.'); }
}
async function arquivoDito() {
  if (G.flags.c4Ficha) { await say('* "TRANSFERIDO: CANDEIA (ar de serra)."'); return; }
  G.flags.c4Ficha = true;
  await say('* No arquivo, uma pasta para cada leito. Você acha a do Dito.');
  await say('* "DITO, PAVIO Nº 212. Esquecimento recorrente. Resíduo alto. Tratamento: DESCANSO (3 sessões)." E, embaixo, carimbado ontem à noite: "TRANSFERIDO: CANDEIA (ar de serra)."');
  await say('Candeia? A vila da mina, lá na serra?', 'rita');
  await say('O Seu Jorge passou por lá uma vez. Disse que era a vila mais acesa do mundo. Tinha âmbar até nas pedras da rua.', 'lume');
  await checaFimP1();
}
async function mesaDiretor() {
  if (G.flags.c4Lista) { await say('* A LISTA DO DESCANSO. A letra pequena e cuidadosa. O rodapé: "pensão paga".'); return; }
  G.flags.c4Lista = true;
  await say('* Sobre a mesa, um livro-caixa aberto: a LISTA DO DESCANSO. Nomes, um por linha. Ao lado de cada nome, uma lembrança, e uma quantia.');
  await say('* "Marta Lins: medo de altura. Pensão paga." "Joaquim Sá: a esposa. Pensão paga." "Dito, Pavio 212: o irmão. Pensão paga."');
  await say('* A letra é pequena, cuidadosa, sem nenhum borrão. Uma letra de quem anota tudo e não erra nada.');
  await say('...Eu já vi essa letra.', 'rita');
  await say('Eu também.', 'me');
  await say('* Ela não diz onde. Não precisa.');
  await say('[Registro: a letra confere com a anotação vista no Festival. Grau de certeza: alto. Grau de vontade de registrar: baixo.]', 'cat');
  await say('Pode ser outra pessoa. Um secretário. Alguém que... ele é BOM. Ele chorou no discurso, vocês viram.', 'lume');
  await say('Gente boa também chora, Lume. E gente boa também anota coisa errada.', 'me');
  await say('* A Lume pega a lista. As mãos dela tremem um pouco. As velas no cabelo, também.');
  await checaFimP1();
}
async function checaFimP1() {
  if (!G.flags.c4Lista || !G.flags.c4Ficha || G.flags.c4P1Fim) return;
  await fimParte1Cap4();
}
async function fimParte1Cap4() {
  sfx('door');
  await say('* A porta se abre. Vocês congelam. Uma touca branca, uma lamparina de vela comum na mão.');
  await say('Calma. Sou eu.', 'dalva');
  await say('Eu sabia que vocês vinham. Eu deixei a porta encostada. E torci pra vocês passarem pelo relógio, porque eu nunca consegui.', 'dalva');
  await say('* Ela vê a lista na mão da Lume. Não pergunta. Senta na cadeira do diretor, devagar, como quem senta pela primeira vez em trinta anos.');
  await say('Candeia. É pra lá que mandam os que esquecem demais. Os que já não têm muito o que tirar.', 'dalva');
  await say('Candeia era a vila da mina. Todo o âmbar que acendeu esta cidade nos últimos doze anos saiu de lá. Aí, há dois dias, ela APAGOU.', 'dalva');
  await say('Apagou como?', 'rita');
  await say('Apagou. Os postes, as casas, as pessoas. Um carroceiro desceu a serra ontem e disse que o povo de lá fica parado na porta de casa, sem lembrar o que ia fazer.', 'dalva');
  await say('E o Dito foi mandado pra lá. Pra "respirar ar de serra".', 'lume');
  await say('* Silêncio. Lá fora, na janela, a cidade inteira acesa, e no alto do morro, apagado ainda, o contorno do Farol de Cem Invernos.');
  await say('O 31 sobe a serra. O Seu Jorge vai reclamar, mas sobe.', 'rita');
  await say('Eu vou com vocês até o portão da cidade. Depois eu volto. Alguém tem que ficar com o menino da perna enfaixada.', 'dalva');
  await say('Irmã Dalva... por que você tá ajudando a gente?', 'lume');
  await say('Porque eu lembro, minha filha. E alguém tem que lembrar.', 'dalva');
  await say('Eu esqueço um pouco cada vez que eu mudo. Então eu lembro do que dá. Disso aqui eu vou lembrar.', 'me');
  G.flags.c4P1Fim = true; G.hora = 6 * 60; save2();
  await fadeOut(40);
  await cartao(['FIM DA PARTE 1', 'A Casa dos Que Esquecem', '', 'Continua na Parte 2:', 'Candeia, a vila que apagou']);
  V.scene = 'world'; loadMap2('largo', ...LG.marco, 'down'); await fadeIn(20);
  await say('* (A Parte 2 do capítulo está a caminho. A capital, o hospital e a base continuam abertos.)');
}

// ---------- entrada no capítulo 4 ----------
function iniciarCap4() {
  if (G.flags.c4Init) return false;
  G.flags.c4Init = true; G.poder = Math.max(G.poder || 1, 3); curarTudo(); G.hora = 8 * 60; G.dia = (G.dia || 0) + 1;
  G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0) });
  return true;
}
async function capitulo4() {
  if (!MAPS2.largo) montarMapas2();
  const novo = iniciarCap4();
  if (novo) {
    await cartao(['CAPÍTULO 4', 'A Casa dos Que Esquecem']);
    V.scene = 'world'; loadMap2('interior', ...POS3.interior.entra, 'up'); playMusic('base'); await fadeIn(30);
    await say('* Manhã, dentro do baú. A vela da base queima baixinho. A Lume está sentada na cama, abraçando os joelhos.');
    await say('Eu sonhei com as luzinhas. As da Mãe-Fuligem. Elas tinham nome. Cada uma falava o próprio nome, baixinho, sem parar, pra não esquecer.', 'lume');
    await say('Igual a gente faz com número de telefone.', 'rita');
    await say('O que é telefone?', 'lume');
    await say('Era... uma coisa que tocava. E a gente quase nunca atendia.', 'me');
    await say('* A Rita abre a boca. Fecha. Olha para você. Você também não sabe mais direito. Era uma coisa da Terra. Era importante.');
    await say('Tanto faz. Vamos ver o Tico. Ele disse que o Dito não estava bem de novo.', 'rita');
    await say('[Objetivo: o Tico está no LARGO DO HOSPITAL, na saída leste da Avenida do Festival.]', 'cat');
    save2(); return;
  }
  const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'largo', x: LG.chegada[0], y: LG.chegada[1], dir: 'right' };
  loadMap2(p.map, p.x, p.y, p.dir); V.scene = 'world'; await fadeIn(20);
}
// o fim do Cap. 3 leva ao Cap. 4 (também para quem já tinha terminado e salvou)
{ const _c3 = capitulo3; capitulo3 = async function () {
  if (!MAPS2.estrada) montarMapas2();
  if (G.flags.c3Fim) return capitulo4();
  return _c3();
}; }
