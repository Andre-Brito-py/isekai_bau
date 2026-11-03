// ================= CAPÍTULO 4: A PRIMEIRA VIAGEM =================
// Arquivo Profundo, abaixo do Andar 1. Mecânica nova: MARÉ (sinos mudam o nível da água de todo o Arquivo).
// Combate novo: ESQUECIMENTO (status), sequência de MEMÓRIA (setas somem), chefe que LÊ o seu padrão de ações.

// ---------- runas ----------
Object.assign(RUNES, {
  sal: { name: 'Sal', type: 'el', col: '#e8e4dc', pow: 10, desc: 'Sal do Arquivo. Corrói a defesa do alvo por 3 turnos.' },
  ancora: { name: 'Âncora', type: 'form', col: '#f2ecdc', mult: 1.3, cost: 6, desc: 'Um alvo, golpe pesado. Fura proteções e afunda golpes preparados.' },
  mare: { name: 'Maré', type: 'mod', col: '#5fb0d0', cost: 3, desc: 'O feitiço volta sozinho no fim da rodada, com 60% da força.' }
});
Object.assign(RUNE_RAR, { sal: 'incomum', ancora: 'rara', mare: 'rara' });
Object.assign(MAP_D, { devolucao: 10, achados: 10, estrada: 11, correio: 11, fundo: 12 });

// ---------- itens ----------
Object.assign(ITEMS, {
  biscoito: { name: 'Biscoito de Água e Sal', hp: 70, cure: true, desc: 'Cura 70 PV e tira efeitos ruins. Crocante como areia de praia.' },
  cidreira: { name: 'Chá de Cidreira', mp: 30, desc: 'Recupera 30 PM. A Ofélia faz igualzinho ao de uma avó que ela não lembra.' },
  sino: { name: 'Sino de Bolso', desc: 'Só em batalha: desfaz os golpes preparados e as previsões de todos os inimigos.',
    async fx() {
      let n = 0; for (const e of BT.en) if (e.alive && (e.charge || e.proph)) { e.charge = false; e.proph = null; n++; }
      sfx('catalog'); shake(6);
      await bSay(n ? '* DLIM! O som do sino espalha a concentração dos inimigos. O que eles preparavam se desfez.' : '* DLIM! Ninguém estava preparando nada. Pelo menos o som é bonito.', { auto: 50 });
    } }
});

// ---------- sprites (desenhados em código) ----------
const cv4 = (w, h, fn) => { const c = mk(w, h), x = c.getContext('2d'); const r = (a, b, ww, hh, col) => { x.fillStyle = PAL[col] || col; x.fillRect(a, b, ww, hh); }; fn(r, x); return c; };
const S4 = {
  traca: (f, wing = 's', crown) => cv4(16, 16, r => {
    r(5, 1, 1, 3, 'k'); r(10, 1, 1, 3, 'k'); r(4, 0, 1, 1, 'k'); r(11, 0, 1, 1, 'k');
    r(1, 3 - f, 6, 8, 'k'); r(2, 4 - f, 4, 6, wing); r(9, 3 - f, 6, 8, 'k'); r(10, 4 - f, 4, 6, wing);
    r(3, 6 - f, 2, 2, 'n'); r(11, 6 - f, 2, 2, 'n');
    r(2, 10, 5, 4, 'k'); r(3, 11, 3, 2, 'l'); r(9, 10, 5, 4, 'k'); r(10, 11, 3, 2, 'l');
    r(6, 4, 4, 10, 'k'); r(7, 5, 2, 8, 'w'); r(6, 5, 1, 1, 'r'); r(9, 5, 1, 1, 'r');
    if (crown) { r(5, 0, 6, 2, 'k'); r(6, 0, 1, 1, 'y'); r(8, 0, 1, 1, 'y'); r(10, 0, 1, 1, 'y'); r(6, 1, 4, 1, 'y'); }
  }),
  ferrugem: f => cv4(16, 16, r => {
    r(2, 7, 12, 6, 'k'); r(3, 8, 10, 4, 'n'); r(4, 8, 8, 1, 'o'); r(5, 10, 1, 1, 'b'); r(9, 9, 2, 1, 'b'); r(11, 11, 1, 1, '#d8d0c0');
    r(5, 4, 1, 3, 'k'); r(10, 4, 1, 3, 'k'); r(4, 3, 3, 2, 'k'); r(9, 3, 3, 2, 'k'); r(5, 3, 1, 1, 'w'); r(10, 3, 1, 1, 'w');
    r(0, 4 - f, 4, 4, 'k'); r(1, 5 - f, 2, 2, 'o'); r(12, 4 - f, 4, 4, 'k'); r(13, 5 - f, 2, 2, 'o');
    for (const i of [3, 6, 9, 12]) r(i, 13, 1, 2 + (f && i % 2 ? 0 : 0), 'k');
  }),
  amontoado: f => cv4(16, 16, r => {
    r(1, 8, 14, 7, 'k'); r(2, 9, 12, 5, 'd');
    r(3, 2 + f, 8, 1, 'k'); r(2, 3 + f, 10, 3, 'k'); r(3, 3 + f, 8, 2, 'y'); r(7, 6 + f, 1, 3, 'k');
    r(10, 6, 4, 4, 'k'); r(11, 7, 2, 2, 'u'); r(11, 7, 1, 1, 'c');
    r(2, 10, 4, 1, 'y'); r(2, 9, 2, 3, 'y');
    r(8, 10, 5, 3, 'q'); r(8, 10, 5, 1, 'L');
    r(5, 11, 1, 1, f ? 'k' : 'w'); r(10, 13, 1, 1, f ? 'k' : 'w');
  }),
  enguia: f => cv4(16, 16, r => {
    for (let i = 0; i < 6; i++) { const y = 8 + Math.round(Math.sin(i * 1.1 + f * 1.6) * 3); r(1 + i * 2, y - 1, 4, 4, 'k'); }
    for (let i = 0; i < 6; i++) { const y = 8 + Math.round(Math.sin(i * 1.1 + f * 1.6) * 3); r(2 + i * 2, y, 2, 2, i % 2 ? 'c' : 'u'); }
    const hy = 8 + Math.round(Math.sin(5 * 1.1 + f * 1.6) * 3); r(12, hy - 1, 1, 1, 'y');
  }),
  gaveta: f => cv4(16, 16, r => {
    r(2, 1, 12, 14, 'k'); r(3, 2, 10, 12, 'n'); r(3, 2, 10, 1, 'o');
    r(4, 4, 8, 2, 'b'); r(7, 4, 2, 1, 'y'); r(5, 5, 1, 1, 'r'); r(10, 5, 1, 1, 'r');
    r(4, 8 - f, 8, 4 + f, 'k'); for (const i of [5, 7, 9]) r(i, 8 - f, 1, 1, 'w'); r(5, 11, 6, 1, '#e8e4dc');
    r(3, 14, 2, 2, 'k'); r(11, 14, 2, 2, 'k');
  }),
  carro: f => cv4(32, 32, r => {
    r(3, 4 + f, 26, 3, 'k'); r(4, 5 + f, 24, 1, 'm');
    r(4, 6 + f, 24, 16, 'k'); r(5, 7 + f, 22, 14, 'P'); r(5, 7 + f, 22, 1, 'q');
    r(7, 9 + f, 8, 7, 'k'); r(8, 10 + f, 6, 5, f ? '#bfe8f0' : 'c'); r(10, 11 + f, 1, 2, '#ffffff');
    r(17, 9 + f, 8, 11, 'k'); r(18, 10 + f, 6, 9, 'q'); r(22, 14 + f, 1, 2, 'y');
    r(27, 8 + f, 3, 5, 'k'); r(28, 9 + f, 1, 3, 'y');
    for (const wx of [4, 19]) { r(wx, 20, 9, 9, 'k'); r(wx + 1, 21, 7, 7, 'n'); r(wx + 3, 23, 3, 3, 'k'); r(wx + 1, 24, 7, 1, 'b'); r(wx + 4, 21, 1, 7, 'b'); }
    r(6, 20, 1, 3, 'g'); r(24, 19, 1, 4, 'g'); r(13, 21, 1, 2, 'g');
    for (const sx of [9, 15, 21]) r(sx, 7 + f, 1, 1, '#e8e4dc');
  }),
  bento: f => cv4(16, 16, r => {
    r(3, 7, 10, 8, 'k'); r(4, 8, 8, 6, 'w'); r(4, 13, 8, 1, 'l'); r(6, 10, 2, 2, 'p'); r(9, 11, 1, 1, 'u');
    r(12, 9, 3, 2, 'k'); r(14, 8, 2, 1, 'k'); r(1, 9, 2, 4, 'k'); r(2, 10, 1, 2, 'w');
    r(5, 5, 6, 2, 'k'); r(6, 6, 4, 1, 'l');
    r(6, 2 + f, 1, 3, 'k'); r(9, 2 + f, 1, 3, 'k'); r(6, 1 + f, 1, 1, 'w'); r(9, 1 + f, 1, 1, 'w');
    r(10, 3, 3, 2, 'k'); r(11, 3, 2, 1, 'o'); r(5, 4, 6, 1, 'y');
  }),
  bell: f => cv4(16, 16, r => {
    r(7, 10, 2, 6, 'k'); r(5, 15, 6, 1, 'k');
    r(4 + f, 2, 8, 8, 'k'); r(5 + f, 3, 6, 6, '#6aa088'); r(6 + f, 3, 2, 4, '#9ad0b0'); r(4 + f, 9, 8, 1, '#4a8068');
    r(7 + f, 9, 2, 2, 'k'); r(5 + f, 4, 1, 1, '#e8e4dc'); r(10 + f, 7, 1, 1, '#e8e4dc'); r(7, 1, 2, 1, 'k');
  }),
  memo: f => cv4(16, 16, r => {
    r(4, 4, 8, 8, 'k'); r(5, 5, 6, 6, f ? '#a8ecff' : 'c'); r(6, 6, 2, 2, '#ffffff');
    r(2, 3, 1, 1, 'c'); r(13, 11, 1, 1, 'c'); if (f) { r(12, 2, 1, 1, '#ffffff'); r(3, 12, 1, 1, '#ffffff'); }
  }),
  letter: f => cv4(16, 16, r => {
    r(2, 4 + f, 12, 8, 'k'); r(3, 5 + f, 10, 6, 'w'); r(3, 5 + f, 10, 1, 's');
    for (let i = 0; i < 5; i++) { r(3 + i, 5 + i + f, 1, 1, 'l'); r(12 - i, 5 + i + f, 1, 1, 'l'); }
    r(7, 8 + f, 2, 2, 'r'); r(4, 10 + f, 1, 1, '#ffffff'); r(11, 6 + f, 1, 1, '#ffffff');
  }),
  drawer: f => cv4(16, 16, r => {
    r(1, 5, 14, 8, 'k'); r(2, 6, 12, 6, '#a07850'); r(2, 6, 12, 1, '#c09868'); r(6, 8, 4, 2, 'k'); r(7, 8, 2, 1, 'y');
    r(4, 3 + f, 2, 3, 'r'); r(5, 2 + f, 1, 1, 'r');
  }),
  claraW: f => cv4(16, 16, r => {
    r(2, 11, 12, 4, '#1c3040'); r(3, 12, 10, 2, f ? '#5fb0d0' : '#3a7090'); r(5, 12, 2, 1, '#e8e4dc'); r(10, 13, 2, 1, '#e8e4dc');
    if (f) { r(6, 4, 4, 7, '#e8e4dc'); r(7, 3, 2, 1, '#e8e4dc'); r(7, 5, 1, 1, 'k'); r(8, 5, 1, 1, 'k'); }
  })
};
function buildSprites4() {
  SP.traca = [S4.traca(0), S4.traca(1)];
  SP.arquivista = [S4.traca(0, 'L', true), S4.traca(1, 'L', true)];
  SP.ferrugem = [S4.ferrugem(0), S4.ferrugem(1)];
  SP.amontoado = [S4.amontoado(0), S4.amontoado(1)];
  SP.enguia = [S4.enguia(0), S4.enguia(1)];
  SP.gaveta = [S4.gaveta(0), S4.gaveta(1)];
  SP.carro = [S4.carro(0), S4.carro(1)];
  SP.bento = [S4.bento(0), S4.bento(1)];
  SP.bell = [S4.bell(0), S4.bell(1)];
  SP.memo = [S4.memo(0), S4.memo(1)];
  SP.letter = [S4.letter(0), S4.letter(1)];
  SP.drawer = [S4.drawer(0), S4.drawer(1)];
  SP.claraW = [S4.claraW(0), S4.claraW(1)];
  SP.calha = [0, 1].map(f => cv4(16, 16, r => { r(2, 2, 12, 12, 'k'); r(3, 3, 10, 10, '#c8962a'); r(5, 5, 6, 6, 'k'); r(6, 6, 4, 4, f ? '#2a1a10' : '#120a08'); r(3, 3, 10, 1, '#f0c040'); r(4, 13, 8, 2, 'k'); }));
  SP.carteiro = [0, 1].map(f => { const c = hum({ G: 'B', m: 'u', l: 'c', S: 'c', h: 'u', y: 'y', b: 'B' }); const x = c.getContext('2d'); x.fillStyle = PAL.k; x.fillRect(4, 0, 8, 2); x.fillStyle = PAL.u; x.fillRect(5, 0, 6, 1); x.fillStyle = PAL.k; x.fillRect(10, 8 + f, 5, 5); x.fillStyle = PAL.n; x.fillRect(11, 9 + f, 3, 3); x.fillStyle = PAL.w; x.fillRect(11, 8 + f, 2, 1); return c; });
  SP.clara = [spr(OFELIA, { w: '#e8e4dc', L: 'c', y: 'u', k: 'B' }), spr(OFELIA.map((r, i) => i === 6 ? "..kwykywwykywk.." : r), { w: '#d0e8f0', L: 'c', y: 'c', k: 'B' })];
  SP.anselmo = [hum({ G: 'd', m: 'k', l: 'm', S: '#e8e4dc', h: '#c0c0c8', y: 'n' })];
}

// ---------- tiles do Arquivo ----------
function buildTiles4(T) {
  const base = T.floor || '#24303a', speck = T.speck || '#2c3a46', dark = T.dark || '#1c262e';
  TILE.aLow = tileCanvas((x, R) => { floorPaint(x, R, '#1e2a32', '#26343e', '#18222a'); x.fillStyle = '#2e4a58'; for (let i = 0; i < 5; i++) x.fillRect(Math.floor(R() * 13), Math.floor(R() * 14), 3, 1); x.fillStyle = '#e8e4dc'; x.fillRect(Math.floor(R() * 14), Math.floor(R() * 14), 1, 1); }, 401);
  TILE.bHigh = tileCanvas((x, R) => { x.fillStyle = '#1a4058'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#245470'; x.fillRect(0, 2, 16, 1); x.fillRect(0, 13, 16, 1); x.fillStyle = PAL.k; x.fillRect(0, 4, 16, 9); x.fillStyle = '#7a5a3a'; x.fillRect(0, 5, 16, 7); x.fillStyle = '#5a3a24'; x.fillRect(0, 8, 16, 1); for (const i of [2, 6, 11]) { x.fillStyle = ['#c83838', '#3a70c0', '#f0c040'][i % 3]; x.fillRect(i, 6, 2, 2); } }, 402);
  TILE.bLow = tileCanvas((x, R) => { x.fillStyle = '#07060c'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#141220'; x.fillRect(0, 0, 16, 2); x.fillStyle = '#1e1a2a'; x.fillRect(2, 11, 12, 3); x.fillStyle = '#2a2236'; x.fillRect(3, 12, 10, 1); }, 403);
  TILE.O = tileCanvas((x, R) => { x.fillStyle = T.wall || '#33424e'; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; x.fillRect(0, 1, 16, 14); x.fillStyle = '#5a3a24'; x.fillRect(1, 2, 14, 12); x.fillStyle = '#3e2618'; x.fillRect(1, 7, 14, 1); const cols = ['#c83838', '#f0c040', '#3a70c0', '#8ac85a', '#e86890', '#e8e4dc', '#7ad0f0']; for (let k = 0; k < 2; k++) for (let i = 2; i < 14; i += 3) { x.fillStyle = cols[Math.floor(R() * cols.length)]; x.fillRect(i, 3 + k * 6, 2, 2 + Math.floor(R() * 2)); } }, 404);
  TILE.M = tileCanvas((x, R) => { x.fillStyle = '#2a3440'; x.fillRect(0, 0, 16, 16); for (let j = 0; j < 16; j += 4) for (let i = 0; i < 16; i += 4) { x.fillStyle = PAL.k; x.fillRect(i, j, 4, 4); x.fillStyle = '#5a4430'; x.fillRect(i + 1, j + 1, 3, 3); if (R() < 0.4) { x.fillStyle = '#e8dcc0'; x.fillRect(i + 1, j + 1, 3, 1); } } }, 405);
  TILE.F = tileCanvas((x, R) => { x.fillStyle = PAL.k; x.fillRect(0, 0, 16, 16); x.fillStyle = '#4a3020'; x.fillRect(1, 0, 14, 16); for (let j = 1; j < 16; j += 5) { x.fillStyle = '#6a4630'; x.fillRect(2, j, 12, 4); x.fillStyle = '#c8962a'; x.fillRect(7, j + 1, 2, 1); x.fillStyle = '#e8dcc0'; x.fillRect(4, j + 2, 3, 1); } }, 406);
  TILE.L = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(7, 3, 2, 13); x.fillRect(5, 0, 6, 5); x.fillStyle = '#f0c040'; x.fillRect(6, 1, 4, 3); x.fillStyle = '#fff4c0'; x.fillRect(7, 2, 2, 1); x.fillStyle = '#3a3a48'; x.fillRect(5, 14, 6, 2); }, 407);
  TILE.R = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = '#1a242c'; for (let j = 0; j < 16; j += 4) for (let i = (j / 4) % 2 * 2; i < 16; i += 4) x.fillRect(i, j, 1, 3), x.fillRect(i, j + 3, 4, 1); x.fillStyle = '#e8e4dc'; x.fillRect(Math.floor(R() * 14), Math.floor(R() * 14), 1, 1); }, 408);
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites4(); }; }
{ const _bt = buildTiles; buildTiles = function (theme) { _bt(theme); buildTiles4(theme || {}); }; }

// ---------- maré ----------
const tideHigh = () => G.flags.tide !== 'low';
{ const _st = solidTile; solidTile = function (c) { if (c === 'a') return tideHigh(); if (c === 'b') return !tideHigh(); if ('OMFL'.includes(c)) return true; return _st(c); }; }
{ const _tc = tileCanvasFor; tileCanvasFor = function (c, x, y) {
  if (c === 'a') return tideHigh() ? TILE['~' + (Math.floor(FRAME / 30 + (x + y) * 0.5) % 2)] : TILE.aLow;
  if (c === 'b') return tideHigh() ? TILE.bHigh : TILE.bLow;
  return _tc(c, x, y); }; }

// ---------- música ----------
Object.assign(TRACKS, {
  arquivo: { bpm: 70, bars: 4, chords: 'Em C Am B', bass: 'whole', bassVol: 0.1,
    lead: 'E5:6 .:2 G5:4 F#5:4 | E5:8 B4:8 | C5:4 E5:4 A5:6 G5:2 | F#5:12 .:4', leadWave: 'triangle', leadVol: 0.08, arp: { rate: 2, vol: 0.018, wave: 'triangle', pat: [0, 2, 1, 2] }, pad: true, padVol: 0.025 },
  estrada: { bpm: 92, bars: 8, chords: 'Dm Dm A A Gm Dm A Dm', bass: 'root5', bassVol: 0.1,
    lead: 'D5:4 F5:2 E5:2 D5:4 A4:4 | D5:4 F5:2 G5:2 A5:8 | A5:4 G5:2 F5:2 E5:4 C#5:4 | E5:12 .:4 | G5:4 A5:2 Bb5:2 G5:4 D5:4 | F5:4 E5:2 D5:2 A4:8 | C#5:4 E5:4 A5:4 G5:4 | D5:12 .:4',
    leadWave: 0.25, leadVol: 0.06, arp: { rate: 2, vol: 0.016, pat: [0, 1, 2, 1] }, drums: 'k...h.h.k...h.h.', hatVol: 0.02 },
  correio: { bpm: 128, bars: 4, chords: 'F Dm Bb C', bass: 'walk', bassVol: 0.12,
    lead: 'F5:2 A5:2 C6:2 A5:2 F5:4 C5:4 | D5:2 F5:2 A5:2 F5:2 D5:8 | Bb4:2 D5:2 F5:2 Bb5:2 A5:4 G5:4 | C5:2 E5:2 G5:2 C6:2 Bb5:8',
    leadWave: 0.125, leadVol: 0.05, arp: { rate: 1, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k.h.s.h.k.h.s.hh', hatVol: 0.03 },
  boss4: { bpm: 164, bars: 8, chords: 'Fm Db Eb C Fm Db Bbm C', bass: 'oct8', bassVol: 0.17,
    lead: 'F5:2 Ab5:2 C6:2 F6:2 Eb6:4 C6:4 | Db6:2 C6:2 Ab5:2 F5:2 Ab5:4 Db6:4 | Eb6:4 Bb5:2 G5:2 Eb5:4 G5:4 | E5:2 G5:2 C6:4 Bb5:2 G5:2 E5:4 | F5:2 C6:2 F5:2 C6:2 Ab5:4 F5:4 | Db6:4 Ab5:4 F5:4 Db5:4 | Bb4:2 Db5:2 F5:2 Bb5:2 Db6:4 C6:4 | C6:4 Bb5:4 G5:4 E5:4',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 },
  clara: { bpm: 60, bars: 4, chords: 'A F#m D E', bass: 'whole', bassVol: 0.07,
    lead: 'E5:2 C#5:2 A4:2 C#5:2 E5:4 A5:4 | F#5:6 E5:2 C#5:8 | D5:2 F#5:2 A5:2 F#5:2 D5:8 | E5:4 G#5:4 B5:8', leadWave: 'triangle', leadVol: 0.09, arp: { rate: 2, vol: 0.02, wave: 'triangle', pat: [0, 2, 1, 3] }, pad: true, padVol: 0.02 }
});

// ---------- técnica comum (missão das cartas) ----------
TECH.remetente = { name: 'Devolver ao Remetente', cd: 4, desc: 'Nesta rodada, o próximo feitiço inimigo que você defender volta para quem lançou, mais forte.',
  async use() { BT.reflect = 1; sfx('rune'); await bSay('* Você abre a tampa como uma caixa de correio. Pode mandar.', { auto: 40 }); } };

// ---------- inimigos ----------
Object.assign(ENEMIES, {
  traca: { name: 'Traça-Arquivista', sp: 'traca', hp: 190, atk: 58, def: 12, xp: 95, evade: 0.2, weak: { brasa: 1.6, vento: 1.4, sal: 0.6 }, drops: [['biscoito', .15]],
    flavor: ['* A Traça-Arquivista bate as asas. Cai um pó que cheira a álbum de foto velho.', '* Ela tem as asas cheias de pequenas datas escritas.', '* A Traça mastiga alguma coisa. Você tem a impressão de que era seu.'],
    check: 'Come lembranças: pode fazer você ESQUECER um feitiço ou técnica. BRASA e VENTO. Sal não faz efeito.',
    moves: [
      { k: 'dodge', p: 0.55, hits: 3, spd: 1.2, w: 2, t: '* Uma revoada de traças! Três rasantes de pó!' },
      { k: 'ring', p: 0.8, st: 'forget', w: 2, t: '* A Traça morde a borda de uma lembrança sua.' },
      { k: 'seq', n: 4, p: 0.5, hide: true, w: 1, t: '* A Traça sacode pó de lembrança no ar. As setas brilham e somem!' },
      { k: 'buff', stat: 'hide', turns: 2, w: 1, t: '* A Traça pousa numa estante e some entre os objetos.' }] },
  ferrugem: { name: 'Caranguejo-Ferrugem', sp: 'ferrugem', hp: 250, atk: 62, def: 28, xp: 105, weak: { faisca: 1.5, geada: 1.3, sal: 1.3, bite: 0.8 }, drops: [['vela', .25]],
    flavor: ['* O Caranguejo-Ferrugem range a cada passo, como portão de casa de avó.', '* Tem cracas nas costas dele. Elas também parecem bravas.'],
    check: 'Casco de ferro velho: mordida rende pouco. FAÍSCA, GEADA e SAL. Cuidado com o aperto.',
    big: { k: 'mash', p: 1.6, need: 16, bind: true },
    moves: [
      { k: 'mash', p: 1.0, need: 13, bind: true, w: 2, t: '* A pinça enferrujada te prende!' },
      { k: 'ring', p: 1.2, pierce: true, w: 2, t: '* Pinçada que atravessa o ferro!' },
      { k: 'buff', stat: 'shell', turns: 2, w: 1, t: '* O Caranguejo-Ferrugem se fecha numa crosta de ferrugem.' },
      { k: 'seq', n: 4, p: 0.5, w: 1, t: '* Quatro patas, quatro chutes!' }] },
  amontoado: { name: 'Amontoado de Perdidos', sp: 'amontoado', hp: 230, atk: 60, def: 16, xp: 100, weak: { brasa: 1.4, vento: 1.3 }, drops: [['sino', .12], ['pao', .2]],
    flavor: ['* Um monte de coisas perdidas que resolveu andar junto. Guarda-chuvas, chaves, um patinho de borracha.', '* O Amontoado tilinta. Você jura que ouviu um toque de celular lá dentro.', '* Um pé de meia cai dele. Ele nem percebe.'],
    check: 'Joga uma coisa diferente a cada turno. BRASA e VENTO espalham a pilha.',
    moves: [
      { k: 'ring', p: 1.1, w: 2, t: '* Um guarda-chuva amarelo abre bem na sua cara!' },
      { k: 'seq', n: 5, p: 0.45, w: 2, t: '* Um molho de chaves de casas que não existem mais te açoita!' },
      { k: 'dodge', p: 0.6, hits: 3, spd: 1.25, w: 2, t: '* Bolinhas de gude quicam pela sala inteira!' },
      { k: 'spell', p: 1, el: 'sombra', name: 'Lembrança Alheia', st: 'forget', w: 1, t: '* O Amontoado sopra uma {p}Lembrança Alheia{/} em você. Não é sua, mas pesa.' }] },
  carteiro: { name: 'Carteiro Afogado', sp: 'carteiro', hp: 210, atk: 64, def: 14, xp: 105, weak: { vento: 1.5, brasa: 1.3, sombra: 0.6 }, drops: [['cidreira', .2]],
    flavor: ['* O Carteiro Afogado confere o endereço na sua tampa. Não bate com nada.', '* A bolsa dele pinga água salgada. Ainda tem carta lá dentro.', '* "Assina aqui", ele borbulha.'],
    check: 'Entrega rápido e sem endereço: sequências que somem. VENTO espalha as cartas.',
    moves: [
      { k: 'seq', n: 5, p: 0.45, hide: true, w: 2, t: '* "Carta registrada!" Ele mostra o endereço por um segundo. Decore!' },
      { k: 'dodge', p: 0.6, hits: 2, spd: 1.2, w: 2, t: '* Envelopes afiados cortam o ar!' },
      { k: 'spell', p: 1, el: 'sal', name: 'Carimbo de Sal', st: 'silence', w: 1, t: '* O Carteiro estica um {w}Carimbo de Sal{/} na direção da sua tampa!' },
      { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* "URGENTE!" O Carteiro grita para o parceiro.' }] },
  enguia: { name: 'Enguia de Sal', sp: 'enguia', hp: 200, atk: 66, def: 10, xp: 100, evade: 0.15, weak: { faisca: 1.7, geada: 1.3, sal: 0.5 }, drops: [['biscoito', .15]],
    flavor: ['* A Enguia de Sal estala. Os pelos da sua tampa ficam em pé (você não tem pelos).', '* Ela nada no ar como se o ar fosse água.'],
    check: 'Rápida e elétrica. FAÍSCA e GEADA. Sal não faz efeito.',
    big: { k: 'dodge', p: 1.8, spd: 1.3 },
    moves: [
      { k: 'dodge', p: 1, spd: 1.3, w: 2, t: '* A Enguia dá o bote!' },
      { k: 'mash', p: 0.9, need: 12, bind: true, w: 1, t: '* A Enguia se enrola em você!' },
      { k: 'spell', p: 1.05, el: 'faisca', name: 'Choque Salgado', st: 'silence', w: 2, t: '* A Enguia solta um {y}Choque Salgado{/}!' }] },
  arquivista: { name: 'Arquivista-Mor', sp: 'arquivista', hp: 320, atk: 72, def: 16, xp: 140, elite: true, evade: 0.15, weak: { brasa: 1.5, vento: 1.3 }, drops: [['cidreira', .25]],
    flavor: ['* A Arquivista-Mor usa uma coroa de grampos de papel.', '* Ela olha para você como quem procura onde te encaixar no fichário.'],
    check: 'Rainha das traças: cura os aliados e apaga lembranças. Derrube primeiro. BRASA.',
    moves: [
      { k: 'heal', frac: 0.3, name: 'Remendo de Traça', w: 2, t: '* A Arquivista-Mor costura as feridas do aliado com fio de lembrança.' },
      { k: 'ring', p: 0.9, st: 'forget', w: 2, t: '* A Arquivista-Mor arranca um pedaço de você e guarda numa pasta.' },
      { k: 'seq', n: 6, p: 0.45, hide: true, spd: 1.1, w: 2, t: '* Uma nuvem de pó dourado desenha setas no ar. Decore!' },
      { k: 'dodge', p: 0.6, hits: 3, spd: 1.3, w: 1, t: '* Revoada real!' }] },
  gaveta: { name: 'Guardião de Gaveta', sp: 'gaveta', hp: 360, atk: 74, def: 34, xp: 150, elite: true, weak: { faisca: 1.4, sal: 1.5, bite: 0.85 }, drops: [['biscoito', .3]],
    flavor: ['* O Guardião de Gaveta abre e fecha. Lá dentro, fichas com números.', '* Uma ficha cai dele. Está escrito 31. Você finge que não viu.'],
    check: 'Fichário vivo: tenta te ARQUIVAR. Muita defesa. SAL corrói, FAÍSCA abre.',
    big: { k: 'seq', n: 7, p: 0.45, pierce: true, spd: 1.2 },
    moves: [
      { k: 'mash', p: 1.1, need: 15, bind: true, w: 2, t: '* A gaveta abre e tenta te ARQUIVAR!' },
      { k: 'ring', p: 1.3, pierce: true, fast: true, w: 2, t: '* Uma gaveta dispara para fora como um soco!' },
      { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* O Guardião de Gaveta tranca o aliado atrás de uma porta de madeira.' },
      { k: 'spell', p: 1.1, el: 'sal', name: 'Ficha de Sal', st: 'forget', w: 1, t: '* Uma {w}Ficha de Sal{/} voa na sua direção com o seu número escrito!' }] },
  carro: { name: 'Carruagem Afogada', sp: 'carro', hp: 2000, atk: 72, def: 24, xp: 800, boss: true, ai: 'carro', sc: 3, weak: { faisca: 1.4, sal: 1.3, bite: 0.9 },
    flavor: ['* As rodas da Carruagem giram no ar, sem chão.', '* "PASSAGEIROS, PRA DENTRO!", grita um chapéu sem cabeça.'], flavor2: ['* Os cavalos de ferrugem arrebentaram os arreios. Agora eles correm soltos.', '* A porta da carruagem bate sozinha. Abre. Fecha. Abre.'],
    check: 'A cada três turnos ela GALOPA: prepare o desvio. Âncora afunda o galope. FAÍSCA e SAL.' },
  clara: { name: 'Clara, de Sal', sp: 'clara', hp: 2600, atk: 76, def: 20, xp: 1200, boss: true, ai: 'clara', sc: 5, weak: { seiva: 1.3, brasa: 1.15 },
    flavor: ['* Clara olha através de você. Ela parece saber o que você vai fazer.', '* A água sobe até as suas dobradiças.'], flavor2: ['* O sal escorre pelo rosto dela como lágrima.', '* "Você repete as mesmas coisas", ela diz. "Todo mundo repete."'],
    check: 'LÊ o que você mais faz e prevê o próximo turno. Quando ela anunciar, faça OUTRA coisa. SEIVA desfaz o sal.' }
});
const PROPH = { bite: 'Você vai MORDER.', spell: 'Você vai CONJURAR.', tech: 'Você vai usar uma TÉCNICA.', item: 'Você vai usar um ITEM.' };
const AI4 = {
  async carro(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; e.atk += 5; shake(30); sfx('rumble'); await bSay('* Os cavalos de ferrugem arrebentam os arreios e correm em volta de você!', { auto: 60 }); return; }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'dodge', p: 0.75, hits: 3, spd: e.p2 ? 1.4 : 1.25, pierce: true, t: '* GALOPE! As patas de ferrugem passam por cima de você!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* Os cavalos empinam. O cocheiro sem cabeça estala o chicote. (Prepare-se para desviar!)', { auto: 60 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'seq', n: e.p2 ? 6 : 5, p: 0.5, spd: e.p2 ? 1.15 : 1, w: 2, t: '* As rodas giram e espirram água em todas as direções!' },
      { k: 'ring', p: 1.25, pierce: true, w: 2, t: '* Chicote do cocheiro!' },
      { k: 'spell', p: 0.9, el: 'sal', name: 'Neblina de Sal', st: 'blind', w: 1, t: '* A carruagem solta uma {w}Neblina de Sal{/}. Foi assim que começou.' },
      { k: 'mash', p: 0.9, need: 15, bind: true, w: e.p2 ? 2 : 1, t: '* A porta da carruagem abre e te puxa pra dentro!' }]));
  },
  async clara(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) {
      e.p2 = true; e.phase = 2; e.atk += 4; shake(30); sfx('rumble');
      await bSay('Eu lembro de TUDO, sabe? O cheiro da estrada. O grito do Anselmo. O frio da água.', { col: '#d0e8f0' });
      await bSay('* A água da sala sobe mais um palmo. Clara lê mais rápido.', { auto: 55 }); return;
    }
    if (!e.p3 && e.hp <= e.mhp * 0.2) { e.p3 = true; return runMove(e, { k: 'mash', p: 1.6, need: 18, t: '* MARÉ ALTA! A água sobe até a sua tampa e tenta te levar pro fundo!', fx: 'shake' }); }
    if (e.proph) {
      const k = e.proph; e.proph = null;
      if (BT.lastAct === k) return runMove(e, { k: 'seq', n: e.p2 ? 7 : 6, p: 0.55, hide: true, pierce: true, t: '* "Eu disse." Clara lê o seu movimento em voz alta, e ele vira contra você!', fx: 'shake' });
      e.shell = 0;
      sfx('cancel'); await bSay('* "...Não. Não era isso." Clara erra a leitura e perde o fio da meada. Ela não age neste turno.', { auto: 60 }); return;
    }
    if (e.turns % 3 === 0) {
      const acts = BT.acts || {}; let best = 'bite', bn = -1;
      for (const k of ['bite', 'spell', 'tech', 'item']) if ((acts[k] || 0) > bn) { bn = acts[k] || 0; best = k; }
      e.proph = best;
      await bSay(`* Clara fecha os olhos e fala devagar: "${PROPH[best]}"\n* (Ela leu o que você mais faz. Faça outra coisa no próximo turno.)`, { auto: 80 }); return;
    }
    const pastel = !!G.flags.mem_pastel;
    return runMove(e, pickMove(e, [
      { k: 'spell', p: 0.95, el: 'sal', name: 'Dardo de Sal Corrosivo', st: 'forget', w: 2, t: '* Clara lança {w}Dardo de Sal Corrosivo{/}. É uma das runas que você acabou de aprender.' },
      { k: 'spell', p: 0.6, hits: 2, el: 'geada', name: 'Corrente de Geada', w: 2, t: '* {c}Corrente de Geada{/}! O frio pula duas vezes.' },
      { k: 'seq', n: e.p2 ? 6 : 5, p: 0.5, hide: true, w: 2, t: '* Clara recita uma lista de nomes. As setas aparecem e somem como eles.' },
      { k: 'ring', p: 1.2, pierce: true, w: 1, t: '* Uma onda de água parada se levanta e cai em cima de você!' },
      { k: 'heal', frac: 0.08, name: 'Chá de Cidreira', w: 1, once: 'cha', t: '* Clara bebe um chá que não existe. Ela fecha os olhos por um segundo.' },
      ...(e.p2 && pastel ? [{ k: 'spell', p: 1.3, el: 'sal', name: 'O Sabor do Pastel', st: 'forget', w: 1, once: 'pastel', t: '* Clara abre um embrulho de papel. "Lembra disso? Não. Você não lembra."' }] : [])]));
  }
};
Object.assign(AI, AI4);

// ---------- personagens ----------
WHO.bento = { name: () => 'Bento', portrait: () => SP.bento[0], voice: () => sfx('blip', 900) };
WHO.anselmo = { name: () => 'Cocheiro', portrait: () => SP.anselmo[0], voice: () => sfx('blipLow', 140), col: '#d8d0c0' };
WHO.clara = { name: () => 'Clara', portrait: () => SP.clara[0], voice: () => sfx('blipTri', 700), col: '#d0e8f0' };
WHO.fundo = { name: () => '???', voice: () => sfx('blipLow', 60), fx: 'shake', col: '#5fb0d0' };
Object.assign(LOOK, {
  O: ['* Uma estante de coisas perdidas: um chaveiro de time, um guarda-chuva, uma dentadura num copo.', '* Uma prateleira com etiquetas: "ESQUECIDO NO 31". Está quase vazia. Quase.', '* Um ursinho de pelúcia de um olho só. Ele tem cheiro de sabão em pó.'],
  M: ['* Escaninhos cheios de cartas que nunca saíram daqui.', '* Uma carta escrita em letra de criança: "Quando eu voltar, eu arrumo o quarto. Juro."'],
  F: ['* Gavetas com números. Algumas estão quentes.', '* Uma ficha escapa da gaveta: "Nº 214 — ferreiro — gostava de assobiar".'],
  L: ['* Um lampião de rua, aceso há trezentos anos. Ninguém troca o pavio.']
});

// ---------- mapas (gerados e validados por build/ch4/validate4.py: nenhuma combinação de maré prende o jogador) ----------
const TH_ARQ = { floor: '#24303a', speck: '#2c3a46', dark: '#1c262e', wall: '#33424e', mortar: '#1c2630', wallHi: '#4c6070' };
Object.assign(MAPS, {
  devolucao: { name: "Escada da Maré", music: 'arquivo', dark: 0.5, theme: TH_ARQ, battleBg: '#14202a', rows: ["#######..#######", "###...........##", "###...........##", "##.....,.......#", "##aaaaaaaaaaaaa#", "##aaaaaaaaaaaaa#", "##.....~~~.....#", "#.......~......#", "#..K.......K...#", "#~~~~~bbbb~~~~~#", "#~~~~~bbbb~~~~~#", "#.....,........#", "#..............#", "####........####", "######....######", "######....######", "######....######", "######....######"],
    exits: [{"x": 7, "y": 0, "to": "biblioteca", "tx": 9, "ty": 11}, {"x": 8, "y": 0, "to": "biblioteca", "tx": 9, "ty": 11}, {"x": 6, "y": 17, "to": "achados", "tx": 13, "ty": 1}, {"x": 7, "y": 17, "to": "achados", "tx": 13, "ty": 1}, {"x": 8, "y": 17, "to": "achados", "tx": 14, "ty": 1}, {"x": 9, "y": 17, "to": "achados", "tx": 14, "ty": 1}],
    ents: [{"id": "save_dv", "kind": "save", "x": 12, "y": 2}, {"id": "bell_dv1", "kind": "npc2", "x": 3, "y": 2, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_dv2", "kind": "npc2", "x": 12, "y": 7, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_dv3", "kind": "npc2", "x": 3, "y": 12, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "e_dv1", "kind": "enemy", "x": 8, "y": 12, "group": ["traca"]}, {"id": "e_dv2", "kind": "enemy", "x": 5, "y": 7, "group": ["traca"]}, {"id": "cr_dv1", "kind": "chest", "x": 13, "y": 8, "rune": "geada", "n": 1}, {"id": "mem_bilhete", "kind": "npc2", "x": 1, "y": 7, "sp": "memo", "talk": "memo", "hide": "mem_bilhete", "float": true, "glow": "rgba(122,208,240,0.22)"}] },
  achados: { name: "Achados e Perdidos", music: 'arquivo', dark: 0.4, theme: TH_ARQ, battleBg: '#14202a', rows: ["#############..#############", "#..........................#", "#.OOO.OOO..........OOO.OOO.#", "#...........YYYY...........#", "#.OOO.OOO..........OOO.OOO.#", "#..........................#", "#..........................#", "####aaaa####....####bbbb####", "#......#...........#.......#", "#.OOO..#...~~~~~~..#..OOO...", "#......#...~....~..#........", "#.OOO..#...~....~..#..OOO..#", "#......#...~~bb~~..#.......#", "#......#...........#.......#", "####aaaa####....####aaaa####", "#..........................#", "#.OOO.OOO.OOO..OOO.OOO.OOO.#", "#..........................#", "#..........................#", "###########......###########", "###########......###########", "#############..#############"],
    exits: [{"x": 13, "y": 0, "to": "devolucao", "tx": 7, "ty": 16}, {"x": 14, "y": 0, "to": "devolucao", "tx": 8, "ty": 16}, {"x": 27, "y": 9, "to": "estrada", "tx": 1, "ty": 6}, {"x": 27, "y": 10, "to": "estrada", "tx": 1, "ty": 7}, {"x": 13, "y": 21, "to": "correio", "tx": 11, "ty": 1, "cond": "carroDone"}, {"x": 14, "y": 21, "to": "correio", "tx": 12, "ty": 1, "cond": "carroDone"}],
    ents: [{"id": "save_ac", "kind": "save", "x": 15, "y": 5}, {"id": "bell_ac1", "kind": "npc2", "x": 2, "y": 5, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_ac2", "kind": "npc2", "x": 13, "y": 18, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_ac3", "kind": "npc2", "x": 9, "y": 9, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bento", "kind": "npc2", "x": 13, "y": 2, "sp": "bento", "talk": "bento", "glow": "rgba(255,224,160,0.15)"}, {"id": "r_sal", "kind": "rune", "x": 13, "y": 10, "rune": "sal"}, {"id": "d_corA", "kind": "door", "x": 13, "y": 21, "cond": "carroDone", "dark": true, "msg": "correio"}, {"id": "d_corB", "kind": "door", "x": 14, "y": 21, "cond": "carroDone", "dark": true, "msg": "correio"}, {"id": "e_ac1", "kind": "enemy", "x": 3, "y": 10, "group": ["amontoado"]}, {"id": "e_ac2", "kind": "enemy", "x": 23, "y": 12, "group": ["ferrugem", "traca"]}, {"id": "e_ac3", "kind": "enemy", "x": 6, "y": 17, "group": ["traca", "traca"]}, {"id": "e_ac4", "kind": "enemy", "x": 21, "y": 17, "group": ["amontoado"]}, {"id": "e_ac5", "kind": "enemy", "x": 9, "y": 12, "group": ["ferrugem"]}, {"id": "mem_fone", "kind": "npc2", "x": 1, "y": 8, "sp": "memo", "talk": "memo", "hide": "mem_fone", "float": true, "glow": "rgba(122,208,240,0.22)"}, {"id": "mem_ferradura", "kind": "npc2", "x": 26, "y": 13, "sp": "memo", "talk": "memo", "hide": "mem_ferradura", "float": true, "glow": "rgba(122,208,240,0.22)"}, {"id": "cr_ac1", "kind": "chest", "x": 5, "y": 13, "rune": "brasa", "n": 2}, {"id": "cr_ac2", "kind": "chest", "x": 24, "y": 8, "rune": "onda", "n": 1}, {"id": "mem_pastel4", "kind": "npc2", "x": 14, "y": 11, "sp": "memo", "talk": "memo", "hide": "mem_pastel4", "float": true, "glow": "rgba(122,208,240,0.22)"}] },
  estrada: { name: "Estrada Afogada", music: 'estrada', dark: 0.55, theme: TH_ARQ, battleBg: '#14202a', rows: ["##############################", "##L....L#####L....L#####L....#", "#..........#......#..........#", "#..RRRRR..aaaa..RRRRRRR..~~..#", "#..RRRRR..aaaa..RRRRRRR..bb...", "...RRRRR..aaaa..RRRRRRR..bb...", "...RRRRR..aaaa..RRRRRRR..bb...", "#..RRRRR..aaaa..RRRRRRR..bb...", "#..RRRRR..aaaa..RRRRRRR..~~...", "#..........#......#..........#", "##L....L#####L....L#####L....#", "##############################"],
    exits: [{"x": 0, "y": 5, "to": "achados", "tx": 26, "ty": 9}, {"x": 0, "y": 6, "to": "achados", "tx": 26, "ty": 10}],
    ents: [{"id": "save_es", "kind": "save", "x": 4, "y": 2}, {"id": "bell_es1", "kind": "npc2", "x": 8, "y": 2, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_es2", "kind": "npc2", "x": 16, "y": 9, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_es3", "kind": "npc2", "x": 28, "y": 9, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "e_es1", "kind": "enemy", "x": 5, "y": 8, "group": ["ferrugem"]}, {"id": "e_es2", "kind": "enemy", "x": 20, "y": 4, "group": ["enguia", "traca"]}, {"id": "e_es3", "kind": "enemy", "x": 21, "y": 8, "group": ["amontoado", "enguia"]}, {"id": "carroE", "kind": "boss3", "x": 28, "y": 6, "sp": "carro", "done": "carroDone", "script": "carro", "glow": "rgba(120,200,240,0.14)"}, {"id": "cr_es1", "kind": "chest", "x": 28, "y": 2, "rune": "faisca", "n": 1}, {"id": "cr_es2", "kind": "chest", "x": 17, "y": 2, "item": "frag", "n": 1}] },
  correio: { name: "Correio Submerso", music: 'correio', dark: 0.4, theme: TH_ARQ, battleBg: '#14202a', rows: ["###########..###########", "#MMMMM............MMMMM#", "#......................#", "#..MM..MM......MM..MM..#", "#..MM..MM......MM..MM..#", "#......................#", "#aaaaaaaaa....aaaaaaaaa#", "#~~~~~~~~~....~~~~~~~~~#", "#.....M...............M#", "#..K..M..~~bb~~..K....M#", "#.....M..~....~.......M#", "#.....M..~....~..MMMMMM#", "#.....M..~~~~~~.......M#", "#MMMM.M...............M#", "#.....M..MMMMMM.aaaaa.M#", "#.....M.........a...a.M#", "#.....M.........a...a.M#", "#.....MMMMM..MMMaaaaa.M#", "#.......................", "##########....##########"],
    exits: [{"x": 11, "y": 0, "to": "achados", "tx": 13, "ty": 20}, {"x": 12, "y": 0, "to": "achados", "tx": 14, "ty": 20}, {"x": 10, "y": 19, "to": "fundo", "tx": 10, "ty": 1}, {"x": 11, "y": 19, "to": "fundo", "tx": 10, "ty": 1}, {"x": 12, "y": 19, "to": "fundo", "tx": 11, "ty": 1}, {"x": 13, "y": 19, "to": "fundo", "tx": 11, "ty": 1}],
    ents: [{"id": "save_co", "kind": "save", "x": 4, "y": 2}, {"id": "bell_co1", "kind": "npc2", "x": 20, "y": 2, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_co2", "kind": "npc2", "x": 13, "y": 8, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_co3", "kind": "npc2", "x": 21, "y": 18, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "bell_co4", "kind": "npc2", "x": 8, "y": 15, "sp": "bell", "talk": "bell", "glow": "rgba(120,220,180,0.12)"}, {"id": "r_ancora", "kind": "rune", "x": 11, "y": 10, "rune": "ancora"}, {"id": "r_mare", "kind": "rune", "x": 18, "y": 15, "rune": "mare"}, {"id": "carta1", "kind": "npc2", "x": 2, "y": 9, "sp": "letter", "talk": "letter", "hide": "carta1", "float": true, "glow": "rgba(232,228,220,0.15)"}, {"id": "carta2", "kind": "npc2", "x": 21, "y": 13, "sp": "letter", "talk": "letter", "hide": "carta2", "float": true, "glow": "rgba(232,228,220,0.15)"}, {"id": "carta3", "kind": "npc2", "x": 3, "y": 16, "sp": "letter", "talk": "letter", "hide": "carta3", "float": true, "glow": "rgba(232,228,220,0.15)"}, {"id": "e_co1", "kind": "enemy", "x": 9, "y": 2, "group": ["carteiro"]}, {"id": "e_co2", "kind": "enemy", "x": 3, "y": 11, "group": ["carteiro", "traca"]}, {"id": "e_co3", "kind": "enemy", "x": 18, "y": 9, "group": ["enguia", "carteiro"]}, {"id": "e_co4", "kind": "enemy", "x": 11, "y": 15, "group": ["amontoado", "ferrugem"]}, {"id": "mem_dente", "kind": "npc2", "x": 21, "y": 10, "sp": "memo", "talk": "memo", "hide": "mem_dente", "float": true, "glow": "rgba(122,208,240,0.22)"}, {"id": "cr_co1", "kind": "chest", "x": 1, "y": 18, "rune": "veu", "n": 1}, {"id": "cr_co2", "kind": "chest", "x": 22, "y": 2, "rune": "geada", "n": 2}] },
  fundo: { name: "Fundo do Arquivo", music: 'clara', dark: 0.5, theme: TH_ARQ, battleBg: '#14202a', rows: ["##########..##########", "#....................#", "#.F.F.F.F....F.F.F.F.#", "#.F.F.F.F....F.F.F.F.#", "#....................#", "#....................#", "#.FF.FF.FF..FF.FF.FF.#", "#....................#", "#.FF.FF.FF..FF.FF.FF.#", "#....................#", "#.FF.FF.FF..FF.FF.FF.#", "#....................#", "#....................#", "#.FFFFFF......FFFFFF.#", "#....................#", "#....................#", "#.......~~~~~~.......#", "#.......~~~~~~.......#", "#....................#", "######################"],
    exits: [{"x": 10, "y": 0, "to": "correio", "tx": 11, "ty": 18}, {"x": 11, "y": 0, "to": "correio", "tx": 12, "ty": 18}],
    ents: [{"id": "save_fu", "kind": "save", "x": 3, "y": 1}, {"id": "gavetaBrida", "kind": "npc2", "x": 4, "y": 13, "sp": "drawer", "talk": "gavetaBrida", "glow": "rgba(255,120,120,0.14)"}, {"id": "claraE", "kind": "boss3", "x": 10, "y": 16, "sp": "claraW", "done": "claraDone", "script": "clara", "glow": "rgba(160,220,255,0.2)"}, {"id": "mem_carta", "kind": "npc2", "x": 19, "y": 1, "sp": "memo", "talk": "memo", "hide": "mem_carta", "float": true, "glow": "rgba(122,208,240,0.22)"}, {"id": "e_fu1", "kind": "enemy", "x": 5, "y": 5, "group": ["arquivista"]}, {"id": "e_fu2", "kind": "enemy", "x": 16, "y": 7, "group": ["gaveta", "traca"]}, {"id": "e_fu3", "kind": "enemy", "x": 4, "y": 11, "group": ["arquivista", "carteiro"]}, {"id": "e_fu4", "kind": "enemy", "x": 17, "y": 11, "group": ["gaveta"]}, {"id": "cr_fu1", "kind": "chest", "x": 20, "y": 14, "rune": "sal", "n": 1}, {"id": "cr_fu2", "kind": "chest", "x": 1, "y": 14, "rune": "corrente", "n": 1}] },
});
// biblioteca: entrada do Arquivo (abre no Cap. 4); Ofélia sai da cadeira enquanto viaja na sua tampa
MAPS.biblioteca.rows[12] = MAPS.biblioteca.rows[12].slice(0, 9) + '.' + MAPS.biblioteca.rows[12].slice(10);
MAPS.biblioteca.exits.push({ x: 9, y: 12, to: 'devolucao', tx: 7, ty: 1, cond: 'ch4open' });
MAPS.biblioteca.ents.push({ id: 'd_ch4', kind: 'door', x: 9, y: 12, cond: 'ch4open', dark: true, msg: 'ch4' });
{ const of = MAPS.biblioteca.ents.find(e => e.kind === 'npc'); if (of) Object.assign(of, { kind: 'npc2', sp: 'ofelia', talk: 'ofeliaLib', hide: 'ofeliaAway', float: true, glow: 'rgba(190,160,255,0.16)' }); }
MAPS.scriptorium.ents.push({ id: 'calha', kind: 'npc2', x: 13, y: 2, sp: 'calha', talk: 'calha', cond: 'ch3done', glow: 'rgba(255,224,160,0.2)' });

// ---------- objetos perdidos e cartas ----------
const MEMO_IDS = ['mem_bilhete', 'mem_fone', 'mem_ferradura', 'mem_dente', 'mem_carta'];
const memoCount = () => MEMO_IDS.filter(k => G.flags[k]).length;
const LETTER_IDS = ['carta1', 'carta2', 'carta3'];
const letterCount = () => LETTER_IDS.filter(k => G.flags[k]).length;
const MEMOS = {
  async mem_bilhete() {
    await say('* Um bilhete de ônibus dobrado em quatro. LINHA 31 — TERMINAL / CENTRO.');
    await say('* No verso, a lápis: "comprar pilha pro controle". A letra é sua.');
    await say('Eu não lembro de ter escrito isso.| Mas eu lembro da pilha. Era pra assistir o último episódio de um anime.', 'me');
    await say('Você morreu sem ver o último episódio?', 'lume');
    await say('...Agora que você falou, isso dói mais do que devia.', 'me');
  },
  async mem_fone() {
    await say('* Um fone de ouvido com o fio remendado em fita crepe. Três voltas de fita, bem apertadas.');
    await say('...Esse é MEU.', 'lume');
    await say('Eu remendava com fita porque não tinha dinheiro pra outro. Eu tocava na praça e escutava os ensaios de volta no ônibus.', 'lume');
    await say('Eu não tenho mais orelha. Eu sou um lustre.| Vou usar mesmo assim.', 'lume');
    G.flags.lumeFone = true; sfx('item');
    await say('* A Lume pendura o fone num dos braços de vela. Ela brilha um pouco mais forte.');
    await say('[Lume recuperou uma lembrança. As canções dela em batalha ficaram mais fortes.]', 'cat');
  },
  async mem_ferradura() {
    await say('* Uma ferradura pequena, enferrujada. De um cavalo que puxava carruagem.');
    await say('...Era da Estrela. A égua da frente. Ela tinha medo de ponte e parava sempre no meio.', 'of');
    await say('* Silêncio dentro da sua tampa.');
    await say('...Como é que eu sei disso?', 'of');
  },
  async mem_dente() {
    await say('* Uma caixinha de fósforo. Dentro, embrulhado num pedaço de lenço, um dente de leite.');
    await say('Alguém guardou um dente por trezentos anos.', 'lume');
    await say('Alguém PERDEU um dente por trezentos anos. É diferente.', 'of');
  },
  async mem_carta() {
    await say('* Uma folha sem envelope, com a letra inclinada de quem escreve no colo, numa estrada esburacada.');
    await say('* "Querida Inês, a carruagem sai amanhã cedo. Levo o livro que você me deu. Se eu demorar, leia o ato quatro em voz alta por mim. Você sabe qual parte. — C."');
    await say('* Ofélia não fala nada por muito tempo.');
    await say('Guarda essa, @. Por favor. Eu não consigo segurar.', 'of');
  }
};
STORY.memo = async function (e) {
  if (G.flags[e.id]) return;
  if (e.id === 'mem_pastel4') return STORY.pastel4(e);
  sfx('item'); G.flags[e.id] = true;
  await MEMOS[e.id]();
  await say(`* (Lembranças perdidas: ${memoCount()}/5. O Bento, no balcão, cataloga tudo.)`);
};
STORY.pastel4 = async function (e) {
  G.flags[e.id] = true; sfx('item');
  await say('* Um pastel de feira, embrulhado em papel de pão. Ainda está morno. Na etiqueta, escrito a carvão: "Nº 31".');
  if (!G.flags.mem_pastel) {
    await say('* O cheiro te lembra de segunda-feira de manhã. Você ainda lembra do gosto.| Por enquanto.');
    await say('Melhor deixar aqui. Lembrança perdida é do Arquivo. A sua ainda está em você.', 'of');
    return;
  }
  await say('Isso é... meu? Parece comida.', 'me');
  await say('* A Lume fica muito quieta.');
  const c = await choose('* O que você faz com o pastel?', ['Comer', 'Deixar onde está'], 'n', 1);
  if (c === 0) {
    G.flags.ateMemory = true;
    await say('* Você abre a tampa e come.');
    await say('* Não tem gosto de nada.| Tem gosto de papel molhado.');
    await say('Lembrança não volta pela boca, querido. Eu tentei, uma vez. Com um bolo.', 'of');
    await say('...Pelo menos eu sei que eu gostava. Já é alguma coisa.', 'me');
  } else {
    G.flags.leftMemory = true;
    await say('* Você deixa o pastel na prateleira, com a etiqueta virada pra frente, do jeito que estava.');
    await say('Alguém precisa lembrar que você gostava disso. Fica aqui guardado, então.', 'lume');
  }
};
const LETTERS = {
  carta1: '* Para: Rua das Laranjeiras, 12. "Mãe, chego no domingo. Guarda o doce de abóbora. Eu tô levando um presente que eu mesmo achei. — B."',
  carta2: '* Para: Tipografia Moreira. "Senhor Moreira, os tipos novos chegam na sexta. Peço desculpas pelo atraso da estrada." Sem assinatura. O sal comeu o resto.',
  carta3: '* Para: Inês. "...não sei se esta vai chegar. A neblina não acaba. Os outros estão esquecendo os próprios nomes. Eu decidi uma coisa: se eu esquecer o meu, vou escolher outro. Um de livro. — C."'
};
STORY.letter = async function (e) {
  if (G.flags[e.id]) return;
  G.flags[e.id] = true; sfx('item');
  await say('* Uma carta lacrada, endurecida de sal. Nunca foi entregue.');
  await say(LETTERS[e.id]);
  if (e.id === 'carta3') await say('* Dentro da sua tampa, a Ofélia segura a respiração. Fantasmas não respiram. Mesmo assim, ela segura.');
  await say(`* (Cartas não entregues: ${letterCount()}/3. O Bento sabe o que fazer com elas.)`);
};

// ---------- sinos de maré ----------
STORY.bell = async function () {
  if (!G.flags.tut_tide) {
    G.flags.tut_tide = true; sfx('catalog');
    await say('[SINO DE MARÉ: cada toque muda o nível da água de TODO o Arquivo.]', 'cat');
    await say('[Maré BAIXA: o piso alagado aparece. Maré ALTA: as estantes caídas boiam e viram ponte.]', 'cat');
  }
  const high = tideHigh();
  const c = await choose(`* Um sino de bronze, verde de cracas. A maré está ${high ? '{c}ALTA{/}' : '{y}BAIXA{/}'}. Tocar?`, ['Tocar o sino', 'Deixar'], 'n', 1);
  if (c !== 0) return;
  G.flags.tide = high ? 'low' : 'high'; sfx('rumble'); sfx('catalog'); shake(10);
  await say(high ? '* DONNNG.| A água desce, gorgolejando por ralos que você não via. O piso alagado aparece.' : '* DONNNG.| A água sobe de todos os lados. As estantes caídas boiam e se alinham como uma ponte.');
};

// ---------- história ----------
const lostPastel4 = () => !!G.flags.mem_pastel;
{ const _os = STORY.onStep3; STORY.onStep3 = function () {
  if (_os && _os()) return true;
  if (WD.id === 'estrada') {
    const fl = [[6, 'flash1'], [15, 'flash2'], [23, 'flash3']];
    for (const [x, k] of fl) if (WD.x >= x && !G.flags[k]) { G.flags[k] = true; runScript(STORY[k]); return true; }
    if (!G.flags.carroDone && WD.x >= 26) { runScript(STORY.carro); return true; }
  }
  if (WD.id === 'fundo' && !G.flags.claraDone && WD.y >= 12) { runScript(STORY.clara); return true; }
  return false; }; }
Object.assign(STORY, {
  async calha() {
    if (!G.flags.ch3done) return;
    if (G.flags.ch4open) { await say('* A calha de devolução. Lá do fundo sobe um cheiro de papel molhado.'); return; }
    await say('* Uma calha de bronze, larga como um poço, com uma placa gasta: "DEVOLUÇÕES — ANDAR 1".');
    await say('Tudo o que cai aqui volta para a biblioteca de baixo. Livros esquecidos, penas quebradas, páginas soltas.', 'escriba');
    await say('E baús, pelo jeito.', 'me');
    await say('Você quer que a gente pule num cano. Um cano escuro. Comigo dentro de você.', 'lume');
    await say('Lume, eu sou literalmente uma caixa. Eu nasci pra ser carregado.', 'me');
    await say('Essa foi a coisa mais triste e mais corajosa que eu já te ouvi dizer.', 'lume');
    const c = await choose('* Pular na calha? (Começa o Capítulo 4.)', ['Pular', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.ch4start();
  },
  async ch4start() {
    playMusic(null); sfx('flee');
    await fadeOut(20); V.scene = 'black'; await fadeIn(1);
    await say('* Você escorrega por muito tempo.', 'void');
    await say('* Passa por andares que reconhece pelo cheiro: tinta,| pólvora,| cera de vela,| mofo.', 'void');
    await say('* Mofo é o cheiro de casa.', 'void');
    await fadeOut(10); loadMap('biblioteca', 10, 6, 'down'); V.scene = 'world'; shake(14); sfx('hurt');
    await fadeIn(16);
    await say('* Você cai de tampa numa pilha de livros devolvidos. A Sala de Leitura Afogada continua igual: água parada, estantes tortas, papel molhado.');
    await say('* Ofélia está na mesa dela, de costas. A pena parada no ar.');
    await say('Vocês demoraram. Eu tinha apostado comigo mesma que seriam três dias. Foram quatro.', 'of');
    await say('Perdi. Para mim mesma. É a única aposta que eu consigo perder aqui embaixo.', 'of');
    await say('Ofélia. O Escriba disse que você sabe o caminho. Pra baixo.', 'me');
    await say('* A pena cai na mesa.');
    await say('...O Escriba fala demais para quem passou trezentos anos acorrentado.', 'of');
    if (G.flags.bridaArchived) {
      await say('A Brida morreu, Ofélia.', 'lume');
      await say('* Ofélia se vira devagar. Pela primeira vez desde que vocês se conheceram, ela não tem uma resposta pronta.');
      await say('Eu sei. Eu senti quando a ficha dela caiu lá embaixo.| Faz um barulho. Parece uma gaveta fechando.', 'of');
    }
    if (G.flags.knightRibbon) {
      await say('* Você mostra a {y}Fita da Bibliotecária{/}. Ofélia olha para ela como quem olha uma foto antiga.');
      await say('A gente achou isso com um cavaleiro. Ele chamava o seu nome.', 'me');
      await say('Ele ainda estava lá. Na porta.|.|.| Eu mandei ele esperar, e ele esperou.', 'of');
      await say('Fiel até a ferrugem. Era o jeito dele.', 'of');
    }
    await say('Tudo bem. Chega de bibliotecária misteriosa. Isso cansa até fantasma.', 'of');
    await say('Embaixo desta sala existe o Arquivo Profundo. É lá que a masmorra guarda o que sobra das almas que ela come.| As coisas que elas perdem.', 'of');
    await say('Eu tranquei a entrada há muito tempo. Afoguei a sala inteira por cima para ninguém achar.', 'of');
    await say('Você AFOGOU a biblioteca de propósito?', 'me');
    await say('A Sala de Leitura Afogada não se afogou sozinha, querido.', 'of');
    await say('* Ofélia puxa um livro azul da estante: "Marés e Correntes, volume II". Algo range embaixo do piso.');
    shake(20); sfx('gate'); G.flags.ch4open = true;
    await say('* No canto sul da sala, o piso afunda em degraus. A água começa a escorrer por eles, devagar.');
    await say('Eu vou com vocês.', 'of');
    await say('Você disse que não pode sair da biblioteca!', 'lume');
    await say('E não posso. Mas o Arquivo é o porão desta biblioteca. Tecnicamente, eu nunca saio de casa.', 'of');
    await say('Só preciso de transporte. Abre a tampa, @.', 'of');
    await say('Você vai entrar em MIM?', 'me');
    await say('Fantasmas não pesam nada. Eu só vou reclamar do cheiro.', 'of');
    G.flags.ofeliaAway = true; refreshEnts(); sfx('rune');
    await say('* Ofélia some dentro da sua tampa. Fica frio por dentro, como água gelada bebida rápido demais.');
    await say('Agora somos três. Um baú, um lustre e uma bibliotecária dentro do baú.| Isso é um isekai muito específico.', 'lume');
    sfx('catalog');
    await say('[Capítulo 4: {y}A Primeira Viagem{/}.]', 'cat');
    saveGame();
  },
  async ofeliaLib() {
    if (G.flags.ch4done) {
      if (G.flags.ofeliaRemembers) { await say(pickOne(['Clara ou Ofélia, tanto faz. As duas respondem. Uma delas mais rápido.', 'Eu escrevi para a Inês ontem. Não tenho para onde mandar. Escrevi mesmo assim.', 'Dói lembrar. Mas agora a dor tem nome e endereço. Fica mais fácil de carregar.']), 'of'); return; }
      await say(pickOne(['Eu desço para visitar a Clara toda noite. Ela dorme bem. Eu não.', 'Obrigada por ter escolhido por mim. Às vezes a gente precisa de alguém de fora.', 'O Arquivo está quieto. Quieto demais. Eu não gosto.']), 'of'); return;
    }
    return STORY.ofelia();
  },
  async doorCh4() { await say('* O piso aqui tem um desenho de onda entalhado. Por enquanto, é só piso.'); },
  async doorCorreio() { await say('* Uma porta de ferro com uma fenda de correio. A fechadura tem o formato de uma ferradura.'); await say('O cocheiro sempre levava a chave do correio no bolso do colete. Sempre.', 'of'); },
  async devolucaoFirst() {
    await wait(20); playMusic('arquivo');
    await say('* Uma escadaria larga, de pedra clara, coberta de cracas. As paredes têm marcas de água em várias alturas, como uma régua.');
    await say('A maré do Arquivo sobe e desce quando os sinos tocam. Eu instalei os sinos. Achei elegante na época.', 'of');
    await say('Você instalou sinos debaixo d\'água.', 'lume');
    await say('Eu tinha muito tempo livre, Lume. Séculos de tempo livre.', 'of');
  },
  async achadosFirst() {
    await wait(20);
    await say('* Um salão sem fim, cheio de estantes. Guarda-chuvas, chaves, óculos, brinquedos, sapatos sem par. Cada objeto tem uma etiqueta de papel.');
    await say('* Algumas etiquetas dizem "ônibus 31". Outras, letras que você não conhece. Outras, nada.');
    await say('Tudo o que uma alma perde quando a masmorra come ela, vem parar aqui. As coisas que a gente não lembra que tinha.', 'of');
    await say('Tem um balcão ali na frente. E alguém atrás dele.', 'lume');
  },
  async estradaFirst() {
    await wait(20);
    await say('* Uma estrada de terra afundada no escuro. Lampiões de rua, tortos, ainda acesos. Calçamento coberto de sal.');
    await say('* Bem longe, no fim da estrada, uma silhueta: uma carruagem parada, com a porta aberta.');
    await say('...Eu não desço até aqui há muito tempo.', 'of');
    await say('Ofélia? Tá tudo bem?', 'lume');
    await say('Não. Mas vamos andar mesmo assim. É o que se faz.', 'of');
  },
  async correioFirst() {
    await wait(20);
    await say('* Uma agência de correio inteira, submersa até a metade. Escaninhos do chão ao teto. Tubos de bronze soltam bolhas de vez em quando.');
    await say('* Cartas boiam pela sala. Algumas ainda estão lacradas.');
    await say('Toda carta que alguém da masmorra escreve e nunca manda vem parar aqui.| São muitas. Quase ninguém manda.', 'of');
    await say('Eu teria mandado uma pra minha mãe.', 'lume');
    await say('* Ninguém responde. Uma bolha sobe de um tubo e estoura.');
  },
  async fundoFirst() {
    await wait(20);
    await say('* O fundo do Arquivo. Fichários de madeira escura sobem até onde a luz não alcança. Cada gaveta tem um número.');
    await say('* No meio da sala, uma poça de água parada, perfeitamente lisa. Ela não reflete nada.');
    await say('É aqui. Todo mundo que a masmorra arquiva vira uma ficha. Uma gaveta. Um peso no fundo.', 'of');
    if (G.flags.bridaArchived) { await say('A Brida tá aqui?', 'lume'); await say('...Está. Na fileira da esquerda. As gavetas novas ainda cheiram a madeira.', 'of'); }
  },
  async flash1() {
    playMusic('clara');
    await say('* Por um instante, a estrada fica clara. É de dia. Tem cheiro de cavalo e de chuva de verão.');
    await say('* Uma carruagem passa por você, chacoalhando. Lá dentro, uma moça lê um livro de capa azul.');
    await say('* "Dona..." grita o cocheiro, e o nome se desmancha como tinta na água, "...segura o chapéu, que a curva é feia!"');
    await say('* E a estrada escurece de novo.');
    playMusic('estrada');
    await say('Você viu isso?', 'lume');
    await say('Eu não vi.| Eu lembrei. Aqui embaixo, é a mesma coisa.', 'of');
  },
  async flash2() {
    playMusic('clara');
    await say('* A neblina chega pela estrada como uma maré. Os cavalos relincham.');
    await say('* "Volta, Anselmo! Volta!", alguém grita lá dentro.');
    await say('* "Não dá! A estrada... a estrada sumiu!"');
    await say('* A carruagem não cai. Ela é ENGOLIDA. Doze lanternas se apagam, uma de cada vez.');
    playMusic('estrada');
    await say('...Foi assim com o ônibus. O clarão branco.', 'me');
    await say('A masmorra tem fome de tempos em tempos. Ela abre a boca onde tem gente passando.', 'of');
  },
  async flash3() {
    playMusic('clara');
    await say('* Dentro da lembrança, o cocheiro se levanta da estrada molhada. Ele olha em volta. Ninguém responde.');
    await say('* "Foi culpa minha. Eu que peguei a estrada da serra. Era mais curta."');
    await say('* "Eu vou levar todo mundo de volta pra casa. Nem que eu tenha que dirigir pra sempre."');
    playMusic('estrada');
    await say('Isso parece com alguém.', 'lume');
    await say('Com quem?', 'me');
    await say('...Não sei ainda. Mas parece.', 'lume');
  },
  async carro() {
    if (G.flags.carroDone) return;
    if (!G.flags.carroSeen) {
      G.flags.carroSeen = true; shake(30); sfx('rumble'); playMusic(null);
      await say('* A carruagem se mexe. As rodas giram sozinhas. Dois cavalos de ferrugem e sal se levantam da água, com olhos de lampião.');
      await say('* No banco do cocheiro, um chapéu sem ninguém embaixo.');
      await say('PASSAGEIROS... PRA DENTRO. A VIAGEM AINDA NÃO ACABOU.', 'anselmo');
      await say('Anselmo. Sou eu.', 'of');
      await say('DONA... DONA... EU NÃO LEMBRO O NOME. MAS EU PROMETI LEVAR A SENHORA PRA CASA.', 'anselmo');
      await say('Não tem mais casa, Anselmo. Faz trezentos anos.', 'of');
      await say('ENTÃO EU DIRIJO MAIS TREZENTOS.', 'anselmo');
    } else await say('* A carruagem bufa sal pelas janelas. Os cavalos batem as patas.');
    const r = await battle(['carro'], { boss: true, music: 'boss4', noFlee: true, intro: '* A Carruagem Afogada avança pela estrada!' });
    if (r !== 'win') return;
    G.flags.carroDone = true; refreshEnts(); playMusic(null);
    await say('* A carruagem tomba de lado, devagar, como um bicho cansado. Os cavalos viram sal e se desmancham no chão.');
    await say('* O chapéu do cocheiro rola até você.');
    await say('...Chegamos?', 'anselmo');
    await say('...Chegamos, Anselmo. Pode descansar. Eu assumo daqui.', 'of');
    await say('Obrigado...| Dona Clara.', 'anselmo');
    await wait(30);
    await say('* O chapéu se desfaz em areia.');
    await say('* Dentro da sua tampa, a Ofélia fica muito, muito quieta.');
    await say('...Clara?', 'lume');
    await say('Não.| Ofélia. Eu escolhi Ofélia.', 'of');
    sfx('item');
    await say('* No meio da areia, uma chave de ferro com o formato de uma ferradura. A {y}Chave do Correio{/}.');
    await say('O Correio fica no fim dos Achados e Perdidos, na porta do sul. O Bento vai querer saber do Anselmo.', 'of');
    playMusic('estrada');
  },
  async bento() {
    const f = G.flags;
    if (!f.metBento) {
      f.metBento = true;
      await say('* Atrás do balcão, um bule de porcelana rachado. De dentro do bule, dois olhinhos em antenas.');
      await say('FREGUÊS! Faz cento e doze anos que não aparece freguês!', 'bento');
      await say('* Um caranguejo-ermitão sai até a metade do bule. Ele usa um dedal como chapéu.');
      await say('Bento, às suas ordens! Achados e Perdidos do Arquivo Profundo. Se perdeu, tá aqui. Se tá aqui, alguém perdeu.', 'bento');
      await say('Bento.', 'of');
      await say('* O caranguejo congela no meio do aceno.');
      await say('...Dona C—| Dona OFÉLIA. Dona Ofélia! A senhora voltou!', 'bento');
      await say('Eu disse para você nunca me chamar daquele jeito.', 'of');
      await say('E eu nunca chamo! Trezentos anos sem chamar! A senhora pode conferir no meu caderno!', 'bento');
      await say('Vocês se conhecem?', 'me');
      await say('Eu era o menino dos recados da carruagem! Doze anos, cabelo cortado com tigela, o melhor assobio da estrada!', 'bento');
      await say('Aí a carruagem caiu na neblina e eu acordei num bule. A vida é engraçada. A morte, mais ainda.', 'bento');
      await say('Foi a primeira viagem, @. Antes do seu ônibus, antes de todos os outros. Doze pessoas, uma estrada de terra e uma neblina que não devia estar lá.', 'of');
      await say('Eu era uma delas.| É tudo o que eu vou dizer agora.', 'of');
      await say('Vão pra estrada, então! É a porta do leste! Mas cuidado com o Seu Anselmo. Ele ainda dirige.', 'bento');
      await say('Quem é Seu Anselmo?', 'lume');
      await say('O cocheiro. Ou o que sobrou dele. E da carruagem.', 'bento');
      await say('E se acharem coisas perdidas por aí, tragam pra mim! Eu catalogo. É o que eu faço. É o que me faz ser eu.', 'bento');
      await say('* (Missões: encontre as 5 {y}Lembranças Perdidas{/} e as 3 {y}Cartas não entregues{/} do Arquivo.)');
      return;
    }
    if (f.mem_dente && !f.bentoDente) {
      f.bentoDente = true;
      await say('Isso aí na sua tampa... é uma caixinha de fósforo? Com um dente?', 'bento');
      await say('É MEU! Eu perdi na viagem! Caiu quando a carruagem pulou num buraco. Minha mãe ia guardar numa latinha.', 'bento');
      await say('Eu não tenho mais dente. Nem boca, direito. Mas é meu.| Obrigado.', 'bento');
    }
    if (f.carroDone && !f.bentoAnselmo) {
      f.bentoAnselmo = true;
      await say('O Seu Anselmo...| descansou?', 'bento');
      await say('Descansou, Bento.', 'of');
      await say('Que bom. Ele me deixava segurar as rédeas nas retas. Ele assobiava pior que eu.', 'bento');
    }
    const lc = letterCount();
    if (lc > (f.lettersGiven || 0)) {
      f.lettersGiven = lc; sfx('item');
      await say('Cartas! Cartas de trezentos anos!', 'bento');
      if (f.carta1 && !f.bentoMae) { f.bentoMae = true; await say('...Rua das Laranjeiras, 12. Essa é minha. Pra minha mãe.| Eu ia levar um presente que eu mesmo achei. Uma pedra bonita.', 'bento'); await say('Eu vou guardar ela aqui. Do lado do dente.', 'bento'); }
      if (lc < 3) { await say(`Faltam ${3 - lc}. Todo mundo merece receber a própria carta, nem que seja atrasada.`, 'bento'); }
    }
    if (lc >= 3 && !f.lettersDone) {
      f.lettersDone = true;
      await say('Todas as três! Eu vou entregar no fichário, uma em cada gaveta certa. Os mortos também recebem correspondência aqui embaixo.', 'bento');
      await say('Agora presta atenção, baú. Eu fui menino de recado. Sabe qual é o segredo de quem entrega coisa?', 'bento');
      await say('Toda coisa que chega errado volta pra quem mandou. Sempre. É a regra mais antiga do correio.', 'bento');
      G.tech = G.tech || []; if (!G.tech.includes('remetente')) G.tech.push('remetente'); sfx('rune');
      await say(`[Técnica aprendida: {y}Devolver ao Remetente{/}. ${TECH.remetente.desc}]`, 'cat');
      giveItem('cidreira', 2); await say('* Você recebeu {y}Chá de Cidreira{/} ×2. "Pra viagem", diz o Bento.');
    }
    const mc = memoCount();
    if (mc >= 5 && !f.memosDone) {
      f.memosDone = true;
      await say('Cinco lembranças! O meu caderno nunca esteve tão feliz!', 'bento');
      await say('Toma. Isso estava na prateleira de coisas sem dono há duzentos anos. Acho que agora tem.', 'bento');
      G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
      giveItem('sino', 2); await say('* Você recebeu {y}Sino de Bolso{/} ×2.');
      await giveRune('foco', false, 1);
      return;
    }
    if (f.lettersDone && f.memosDone) { await say(pickOne(['Volta sempre! Freguês bom é freguês que volta.', 'Se achar meu assobio por aí, me avisa. Eu perdi ele também.', 'A Dona Ofélia está diferente. Mais pesada. Mas de um jeito bom, eu acho.']), 'bento'); return; }
    await say(`Lembranças: ${mc}/5. Cartas: ${lc}/3. ${pickOne(['Procura nos cantos alagados! Coisa perdida gosta de lugar difícil.', 'O Correio fica ao sul. Lá tem mais carta do que gente pra ler.', 'Toca os sinos! A maré esconde metade do que existe aqui.'])}`, 'bento');
  },
  async gavetaBrida() {
    if (!G.flags.bridaArchived) { await say('* Uma gaveta nova, ainda sem etiqueta. Melhor deixar fechada.'); return; }
    if (G.flags.bridaVisited) { await say('* A gaveta da Brida. A etiqueta continua torta. Ninguém conserta.'); return; }
    G.flags.bridaVisited = true;
    await say('* Uma gaveta nova, a madeira ainda clara. A etiqueta diz: "BRIDA DE AUREN — caçadora — 31 anos".');
    await say('* Lá dentro, um penacho vermelho amassado. E um apito de treino, com marca de dente.');
    await say('Ela sempre usava esse penacho torto. Eu achava ridículo.', 'lume');
    await say('...Eu ainda acho. Mas eu queria ver ela usando.', 'lume');
    const c = await choose('* O que fazer?', ['Deixar tudo como está', 'Levar o apito'], 'n', 0);
    if (c === 1) { G.flags.bridaWhistle = true; sfx('item'); await say('* Você guarda o apito. Talvez os aprendizes queiram de volta, um dia.'); }
    else { G.flags.bridaLight = true; await say('* Você fecha a gaveta com cuidado. A Lume deixa um pouquinho da própria luz lá dentro, pela fresta.'); }
  },
  async clara() {
    if (G.flags.claraDone) return;
    if (!G.flags.claraSeen) {
      G.flags.claraSeen = true; playMusic(null); shake(20); sfx('rumble');
      await say('* A poça no meio da sala se mexe. Sal sobe da água em fios, como cabelo.');
      await say('* Uma mulher se forma, feita de sal e água parada. Ela tem o rosto da Ofélia.| Mas está de olhos abertos.');
      await say('Você demorou, bibliotecária.', 'clara');
      await say('...Olá, Clara.', 'of');
      await say('* Ofélia sai da sua tampa. Pela primeira vez, as duas ficam frente a frente.');
      await say('Você me deixou aqui com tudo. O nome, a estrada, a Inês, o Anselmo gritando. Você ficou com a parte leve.', 'clara');
      await say('Eu fiquei com a parte que conseguia continuar.', 'of');
      await say('E eu fiquei com a parte que lembra. Sabe o que se faz com trezentos anos de lembrança no escuro?', 'clara');
      await say('Se fala. Em voz alta. Toda noite.| E alguém lá em cima anota.', 'clara');
      await say('Era VOCÊ. A voz que dita o Catálogo.', 'me');
      await say('Eu só repito. A voz vem de mais fundo. Eu sou a boca, o Escriba é a mão.', 'clara');
      await say('E agora eu quero a outra metade de volta.', 'clara');
      await say('* Clara estende a mão para Ofélia. A água da sala começa a subir.');
      await say('Não encosta nela!', 'lume');
    } else await say('Voltou para ser lida de novo, alma trinta e um?', 'clara');
    const r = await battle(['clara'], { boss: true, music: 'boss4', noFlee: true, intro: '* Clara, a Bibliotecária de Sal, se ergue da maré!' });
    if (r !== 'win') return;
    G.flags.claraDone = true; refreshEnts();
    await STORY.claraEnd();
  },
  async claraEnd() {
    playMusic('clara');
    await say('* Clara cai de joelhos na água. O sal escorre dela como areia de ampulheta.');
    await say('...Você ainda não entendeu, alma trinta e um. Se eu sumir, ninguém mais lembra da primeira viagem.| Nem ela.', 'clara');
    await say('Ela tem razão.', 'of');
    await say('@. Eu posso receber ela de volta. Tudo: o nome, a estrada, a dor. Ou posso deixar ela dormir aqui embaixo e continuar sendo a Ofélia que vocês conhecem.', 'of');
    await say('Eu não consigo escolher. Faz trezentos anos que eu não consigo.| Escolhe você.', 'of');
    const c = await choose('* O que a Ofélia deve fazer? (Essa escolha não tem volta.)', ['Receber a Clara de volta', 'Deixar a Clara dormir'], 'n');
    if (c === 0) {
      G.flags.ofeliaRemembers = true;
      await say('* Ofélia segura a mão de Clara. O sal sobe pelo braço dela, devagar, como tinta subindo num guardanapo.');
      await say('* Por um instante, as duas falam juntas.');
      await say('Eu me chamo Clara Ventura. Eu tinha vinte e seis anos. Eu ia visitar a minha irmã, a Inês.| Eu me afoguei numa estrada de terra.', 'of');
      await say('...E escolhi me chamar Ofélia, porque era o livro que eu tinha no colo.', 'of');
      await say('* Ela chora. Fantasmas choram sal, pelo jeito.');
      await say('Dói. Dói muito.| Mas é meu.', 'of');
      await say('Bem-vindas de volta. As duas.', 'lume');
    } else {
      G.flags.ofeliaRemembers = false;
      await say('* Ofélia encosta a testa na de Clara. Clara fecha os olhos pela primeira vez em trezentos anos.');
      await say('Dorme. Eu desço para te visitar. Prometo.', 'of');
      await say('...Você sempre promete.', 'clara');
      await say('* Clara se desfaz em água parada. A poça volta a ficar lisa.| Agora, ela reflete.');
      await say('Obrigada por escolher, @. Eu não ia conseguir sozinha.', 'of');
    }
    playMusic(null); await wait(40);
    shake(40); sfx('rumble');
    await say('* A água da poça treme. De muito, muito mais fundo, alguma coisa fala. Não é bem uma voz. É uma pressão nos ouvidos.');
    await say('TRINTA| E| UM.', 'fundo');
    await say('VOCÊ É O ÚLTIMO QUE FALTAVA NA COLEÇÃO.', 'fundo');
    await wait(30);
    await say('* E então, silêncio.');
    await say('...Coleção?', 'lume');
    await say('Eu nunca ouvi essa voz falar. Em trezentos anos, nunca.', 'of');
    await say('* Um Morcego de Papel desce pelo poço do Arquivo, molhado e torto. A letra é apressada, e não é da Ofélia.');
    await say('* "Baú. É o Tiago. Não sei se isso chega. A guerra começou de verdade. O Andar 3 está descendo."');
    await say('* "Eu finalmente vi quem recruta os heróis. Quepe azul, um molho de chaves no cinto, voz de quem pede pra todo mundo ir pro fundo do ônibus."');
    await say('* "Eu conheço ele. Todo mundo do 31 conhece. É o Seu Jorge.| O motorista."');
    await say('...O motorista do ônibus.', 'me');
    await say('Mais um cocheiro que quer levar todo mundo de volta pra casa.', 'of');
    G.flags.ofeliaAway = false;
    await endScreen(4);
    G.flags.ch4done = true;
    saveGame();
  }
});
{ const _d = STORY.doorMsg; STORY.doorMsg = async e => e.msg === 'ch4' ? STORY.doorCh4() : e.msg === 'correio' ? STORY.doorCorreio() : _d(e); }
{ const _f = { devolucao: 'devolucaoFirst', achados: 'achadosFirst', estrada: 'estradaFirst', correio: 'correioFirst', fundo: 'fundoFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _es = endScreen; endScreen = function (ch) { if (ch !== 4) return _es(ch); playMusic('ending');
    const w = { type: 'end', t: 0, update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
      draw() { bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); const a = Math.min(1, this.t / 60);
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 96, 26, 48, 48); bx.globalAlpha = 1;
        txt('FIM DO CAPÍTULO 4', 120, 84, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
        txt('A Primeira Viagem', 120, 104, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Lembranças: ${memoCount()}/5 · Cartas: ${letterCount()}/3`, `Tempo: ${fmtTime(G.time)}`, G.flags.ofeliaRemembers ? 'Para Clara Ventura, que voltou' : 'Para Clara, que dorme no fundo'];
        L.forEach((l, i) => txt(l, 120, 128 + i * 12, { align: 'center', col: i === 3 ? '#8fe3ff' : '#ffffff', alpha: clamp((this.t - 40) / 40, 0, 1) }));
        txt('Próximo: Capítulo 5 — O Motorista', 120, 186, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
        if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' }); } };
    return openWin(w); }; }
