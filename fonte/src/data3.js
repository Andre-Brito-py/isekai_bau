// ================= CAPÍTULO 3: QUEM ESCREVE O CATÁLOGO =================
// ---------- runas ----------
Object.assign(RUNES, {
  sombra: { name: 'Sombra', type: 'el', col: '#b48cf0', pow: 10, desc: 'Escuridão. Pode enfraquecer o próximo golpe do alvo.' },
  vento: { name: 'Vento', type: 'el', col: '#c8f0e0', pow: 9, desc: 'Vento. Remove carapaças, sumiços e fúrias do alvo.' },
  dreno: { name: 'Dreno', type: 'mod', col: '#60d0a0', cost: 2, desc: 'O feitiço devolve 20% do dano como PM.' }
});

// ---------- sprites ----------
const GARG = ["................", "..k..........k..", ".kmk........kmk.", "kmlmk.kkkk.kmlmk", "kmmmkkmmmmkkmmmk", ".kmmkmlmmlmkmmk.", "..kkmkrmmrkmkk..", "....kmmmmmmk....", "....kmkmmkmk....", "...kmmmmmmmmk...", "..kmmkmmmmkmmk..", "..kmk.kmmk.kmk..", "..kk..kmmk..kk..", "......kkkk......", "................", "................"];
const ESCR = ["................", "......kkkk......", ".....kBBBBk.....", "....kBBBBBBk....", "....kBwBBwBk...y", "....kBBBBBBk..yk", "....kBBkkBBk.yk.", "...kBBBBBBBBkk..", "..kBBBBBBBBBBk..", "..kBkBBBBBBkBk..", "..kBBBBBBBBBBk..", "...kBBkBBkBBk...", "....kk.kk.kk....", "................", "................", "................"];
const MAREN = [".......kk.......", "......kqqk......", ".....kqyyqk.....", "....kqqqqqqk....", "...kkkkkkkkkk...", "....kskssksk....", "....kssssssk....", ".....kssssk.....", "...kkqqyyqqkk...", "..kqqqqyyqqqqk..", "..ksqqqyyqqqsk..", "..kqqqqyyqqqqk..", "...kqqqyyqqqk...", "...kqqqqqqqqk...", "...kkkkkkkkkk...", "................"];
const CIDA = ["................", "...k........k...", "..kLk......kLk..", "..kLLkkkkkkLLk..", "..kLLLLLLLLLLk..", "..kLkkLLLLkkLk..", "..kLLLLppLLLLk..", "...kLLLLLLLLk...", "....kLLLLLLk....", "...kLLLLLLLLk...", "..kLLLLLLLLLLk..", "..kLkLLkkLLkLk..", "...k.kk..kk.k...", "................", "................", "................"];
function makeJailer(f) {
  const c = mk(32, 32), x = c.getContext('2d'), r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  r(3, 5 + f, 26, 25, PAL.k); r(4, 6 + f, 24, 23, '#3a3440');
  for (let i = 5; i < 28; i += 3) r(i, 6 + f, 1, 23, i % 2 ? '#8a8099' : '#5d566e');
  r(4, 9 + f, 24, 2, '#6a6078'); r(4, 24 + f, 24, 2, '#6a6078');
  r(11, 13 + f, 10, 9, PAL.k); r(12, 14 + f, 8, 7, '#c8962a'); r(13, 15 + f, 6, 2, '#f0c040'); r(15, 17 + f, 2, 3, PAL.k);
  r(8, 10 + f, 3, 2, '#ff5050'); r(21, 10 + f, 3, 2, '#ff5050');
  r(0, 14 + f, 4, 10, PAL.k); r(1, 15 + f, 2, 8, '#6a6078'); r(28, 14 + f, 4, 10, PAL.k); r(29, 15 + f, 2, 8, '#6a6078');
  r(6, 2 + f, 20, 4, PAL.k); r(7, 3 + f, 18, 2, '#8a8099'); r(14, 0 + f, 4, 3, '#c8962a');
  return c;
}
function buildSprites3() {
  SP.garg = [spr(GARG, { m: 'l', l: 'w' }), spr(GARG.map((r, i) => i === 2 ? "kmk..........kmk" : i === 3 ? "kmlmk.kkkk.kmlmk" : r), { m: 'l', l: 'w' })];
  SP.escr = [spr(ESCR), spr(ESCR.map((r, i) => i === 12 ? "...kk.kk.kk....." : r))];
  const armed = (map, tool) => { const c = spr(HUMAN, map); const x = c.getContext('2d'); tool(x); return c; };
  const spear = x => { x.fillStyle = PAL.n; x.fillRect(14, 1, 1, 13); x.fillStyle = PAL.l; x.fillRect(13, 0, 3, 2); };
  const staff = x => { x.fillStyle = PAL.y; x.fillRect(14, 2, 1, 12); x.fillStyle = PAL.w; x.fillRect(13, 0, 3, 3); };
  const lantern = x => { x.fillStyle = PAL.k; x.fillRect(12, 8, 4, 5); x.fillStyle = '#ffe9a0'; x.fillRect(13, 9, 2, 3); };
  SP.soldier = [armed({ G: 'w', m: 'l', l: 'w' }, spear), armed({ G: 'w', m: 'l', l: 'w' }, spear)];
  SP.cleric = [armed({ G: 'w', m: 'y', l: 'w', b: 'n' }, staff), armed({ G: 'w', m: 'y', l: 'w', b: 'n' }, staff)];
  SP.farol = [armed({ G: 'n', m: 'd', l: 'm' }, lantern), armed({ G: 'n', m: 'd', l: 'm' }, lantern)];
  SP.pip = [spr(HUMAN, { G: 'g', m: 'n', l: 'o' })];
  SP.knight = [armed({ m: 'd', l: 'm', s: 'k', G: 'd', y: 'r', b: 'k', n: 'd' }, spear), armed({ m: 'd', l: 'm', s: 'k', G: 'd', y: 'r', b: 'k', n: 'd' }, spear)];
  for (const c of SP.knight) { const x = c.getContext('2d'); x.fillStyle = '#ff5050'; x.fillRect(6, 4, 1, 1); x.fillRect(9, 4, 1, 1); }
  SP.maren = [spr(MAREN), spr(MAREN.map((r, i) => i === 0 ? "......kk........" : i === 1 ? ".....kqqk......." : r))];
  SP.escriba = [spr(ESCR, { B: 'L', w: 'k' }), spr(ESCR, { B: 'L', w: 'k' })];
  for (const c of SP.escriba) { const x = c.getContext('2d'); x.fillStyle = '#8a8099'; for (let i = 0; i < 16; i += 2) { x.fillRect(i, 13, 1, 1); x.fillRect(1, i, 1, 1); } }
  SP.cida = [spr(CIDA), spr(CIDA.map((r, i) => i === 5 ? "..kLwkLLLLwkLk.." : r))];
  SP.jailer = [makeJailer(0), makeJailer(1)];
  SP.cage = [spr(RAT), spr(MUSH)];
  const T4 = { bastiao: ['mimicBast', { o: 'y', n: 'm', b: 'd', l: 'w' }], abismo: ['mimicAbys', { o: 'd', n: 'k', b: 'P', l: 'q', y: 'r' }], ferrao: ['mimicSting', { o: 'g', n: 'G', b: 'k', l: 'v' }], carniceiro: ['mimicGore', { o: 'r', n: 'b', b: 'k', l: 'w' }], biblioteca: ['mimicLib', { o: 's', n: 'n', b: 'b', l: 'y', y: 'c' }], proibido: ['mimicForb', { o: 'P', n: 'k', b: 'r', l: 'r', y: 'r' }], eclipse: ['mimicEcl', { o: 'k', n: 'P', b: 'k', l: 'L', y: 'w' }], constelacao: ['mimicConst', { o: 'B', n: 'u', b: 'k', l: 'w' }] };
  for (const [, [key, map]] of Object.entries(T4)) makeMimicSet(key, map);
  const deco = (key, fn) => { const all = new Set([...SP[key], ...Object.values(SPD[key]).flat()]); for (const c of all) fn(c.getContext('2d')); };
  deco('mimicBast', x => { x.fillStyle = PAL.y; x.fillRect(1, 0, 14, 1); x.fillRect(7, 0, 2, 2); x.fillStyle = PAL.w; x.fillRect(3, 12, 2, 1); x.fillRect(11, 12, 2, 1); });
  deco('mimicAbys', x => { x.fillStyle = '#ff5050'; x.fillRect(5, 11, 1, 1); x.fillRect(10, 11, 1, 1); x.fillStyle = PAL.q; x.fillRect(0, 13, 2, 2); x.fillRect(14, 13, 2, 2); });
  deco('mimicSting', x => { x.fillStyle = PAL.v; for (const i of [2, 6, 9, 13]) x.fillRect(i, 0, 1, 2); x.fillStyle = PAL.y; x.fillRect(15, 7, 1, 3); });
  deco('mimicGore', x => { x.fillStyle = PAL.w; for (const i of [3, 7, 11]) x.fillRect(i, 9, 2, 2); x.fillStyle = PAL.r; x.fillRect(4, 14, 8, 1); });
  deco('mimicLib', x => { x.fillStyle = '#e8dcc0'; x.fillRect(2, 0, 3, 2); x.fillRect(11, 0, 3, 2); x.fillStyle = PAL.r; x.fillRect(7, 1, 2, 1); });
  deco('mimicForb', x => { x.fillStyle = PAL.k; x.fillRect(3, 11, 10, 1); x.fillStyle = '#ff5050'; x.fillRect(7, 11, 2, 2); x.fillRect(2, 2, 1, 1); x.fillRect(13, 2, 1, 1); });
  deco('mimicEcl', x => { x.fillStyle = PAL.L; x.fillRect(6, 1, 4, 1); x.fillStyle = PAL.k; x.fillRect(7, 1, 2, 1); x.fillStyle = PAL.L; x.fillRect(5, 12, 6, 1); });
  deco('mimicConst', x => { x.fillStyle = PAL.y; for (const [i, j] of [[3, 2], [8, 3], [12, 2], [4, 11], [9, 12], [12, 11], [6, 13]]) x.fillRect(i, j, 1, 1); });
}
function buildTiles3(T) {
  const base = T.floor || '#2b2535', speck = T.speck || '#342c41', dark = T.dark || '#211b2b';
  TILE['J'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = '#1a1620'; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; for (let i = 1; i < 16; i += 3) x.fillRect(i, 0, 2, 16); x.fillStyle = '#7a7088'; for (let i = 1; i < 16; i += 3) x.fillRect(i, 0, 1, 16); x.fillStyle = '#5d566e'; x.fillRect(0, 2, 16, 2); x.fillRect(0, 12, 16, 2); }, 140);
  TILE['Y'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(0, 4, 16, 10); x.fillStyle = '#5a3a24'; x.fillRect(1, 5, 14, 5); x.fillStyle = '#e8dcc0'; x.fillRect(3, 5, 6, 3); x.fillStyle = '#3a2a5a'; x.fillRect(4, 6, 4, 1); x.fillStyle = '#2a1a10'; x.fillRect(1, 10, 2, 4); x.fillRect(13, 10, 2, 4); x.fillStyle = PAL.w; x.fillRect(11, 2, 1, 4); }, 141);
}
function drawSeal(e, sx, sy, lights) {
  const done = G.flags[e.flag], col = RUNES[e.need.el].col;
  if (e.look === 'water') {
    if (done) { bx.fillStyle = '#a8e0f0'; bx.fillRect(sx, sy, 16, 16); bx.fillStyle = '#e8fbff'; bx.fillRect(sx + 2, sy + 3, 5, 1); bx.fillRect(sx + 8, sy + 10, 6, 1); bx.fillStyle = '#7ab8d0'; bx.fillRect(sx, sy + 15, 16, 1); }
    else { bx.fillStyle = col; const p = FRAME % 60 < 30 ? 1 : 0; bx.fillRect(sx + 6, sy + 6 + p, 4, 4); }
    return;
  }
  if (done) return;
  if (e.look === 'vines') { bx.fillStyle = '#3a2a14'; bx.fillRect(sx, sy, 16, 16); for (let i = 0; i < 16; i += 3) { bx.fillStyle = i % 2 ? '#6a4a24' : '#4a6a2a'; bx.fillRect(sx + i, sy, 2, 16); } bx.fillStyle = '#8ac85a'; bx.fillRect(sx + 3, sy + 5, 2, 1); bx.fillRect(sx + 10, sy + 11, 2, 1); }
  else if (e.look === 'machine') { bx.fillStyle = PAL.k; bx.fillRect(sx, sy, 16, 16); for (let i = 1; i < 16; i += 4) { bx.fillStyle = '#6a6078'; bx.fillRect(sx + i, sy, 2, 16); } bx.fillStyle = '#5d566e'; bx.fillRect(sx, sy + 7, 16, 2); bx.fillStyle = '#c8962a'; bx.fillRect(sx + 6, sy + 6, 4, 4); }
  else if (e.look === 'light') { const a = 0.6 + Math.sin(FRAME * 0.1) * 0.2; bx.fillStyle = `rgba(255,250,220,${a})`; bx.fillRect(sx, sy, 16, 16); lights.push([sx + 8, sy + 8, 40, 'rgba(255,250,220,0.25)']); }
  else if (e.look === 'wind') { for (let i = 0; i < 24; i++) { const xx = (hash(i, e.x) + FRAME * (i % 3 + 1)) % 16, yy = (hash(i, 7) + Math.floor(FRAME / 3)) % 16; bx.fillStyle = i % 2 ? '#1a1030' : '#3a2a5a'; bx.fillRect(sx + xx, sy + yy, 3, 2); } }
  const fy = Math.round(Math.sin(FRAME * 0.08) * 1.5); bx.fillStyle = PAL.k; bx.fillRect(sx + 5, sy + 4 + fy, 6, 6); bx.fillStyle = col; bx.fillRect(sx + 6, sy + 5 + fy, 4, 4);
  lights.push([sx + 8, sy + 8, 26, hexA(col, 0.2)]);
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites3(); }; }
{ const _bt = buildTiles; buildTiles = function (theme) { _bt(theme); buildTiles3(theme || {}); }; }

// ---------- música ----------
Object.assign(TRACKS, {
  fortaleza: { bpm: 116, bars: 8, chords: 'Cm Cm Ab Bb Cm Fm G G', bass: 'walk', bassVol: 0.14,
    lead: 'C5:3 C5:1 Eb5:2 G5:2 C6:4 G5:4 | Ab5:2 G5:2 F5:2 Eb5:2 D5:4 Eb5:4 | C5:3 C5:1 Eb5:2 Ab5:2 C6:4 Ab5:4 | Bb5:2 Ab5:2 G5:2 F5:2 D5:8 | G5:3 G5:1 C6:2 Bb5:2 G5:4 Eb5:4 | F5:2 Ab5:2 C6:4 Bb5:2 Ab5:2 F5:4 | G5:2 B5:2 D6:4 C6:2 B5:2 G5:4 | D5:4 F5:4 B4:8',
    leadVol: 0.06, arp: { rate: 2, vol: 0.016, pat: [0, 1, 2, 1] }, drums: 'k...s...k.k.s...', hatVol: 0.03 },
  jaula: { bpm: 72, bars: 4, chords: 'Am Em F E', bass: 'whole', bassVol: 0.11,
    lead: 'A4:8 C5:4 B4:4 | G4:8 E4:8 | F4:4 A4:4 C5:4 B4:4 | G#4:12 .:4', leadWave: 'triangle', leadVol: 0.09, arp: { rate: 2, vol: 0.02, wave: 'triangle', pat: [0, 2, 1, 3] }, pad: true, padVol: 0.025 },
  scriptorium: { bpm: 88, bars: 4, chords: 'Dm Bb Gm A', bass: 'root5', bassVol: 0.11,
    lead: 'D5:2 .:2 F5:2 .:2 A5:4 G#5:4 | F5:8 D5:8 | G5:2 .:2 Bb5:2 .:2 D6:4 C#6:4 | A5:16', leadWave: 0.125, leadVol: 0.05, arp: { rate: 1, vol: 0.016, pat: [0, 2, 1, 3, 2, 1] }, pad: true, padVol: 0.02 },
  boss3: { bpm: 170, bars: 8, chords: 'Bbm Gb Db Ab Bbm Gb Eb F', bass: 'oct8', bassVol: 0.18,
    lead: 'Bb4:2 Db5:2 F5:2 Bb5:2 Ab5:4 F5:4 | Gb5:2 F5:2 Db5:2 Bb4:2 Db5:4 Gb5:4 | F5:2 Ab5:2 Db6:4 C6:2 Ab5:2 F5:4 | Eb5:4 Ab5:4 C6:8 | Bb5:2 Ab5:2 F5:2 Db5:2 F5:4 Bb5:4 | Db6:4 Bb5:2 Gb5:2 Db5:8 | Eb5:2 G5:2 Bb5:4 Eb6:4 Db6:4 | C6:4 A5:4 F5:8',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 },
  perda: { bpm: 56, bars: 4, chords: 'F Dm Bb C', bass: 'whole', bassVol: 0.09,
    lead: 'C5:8 A4:8 | D5:8 F5:8 | Bb4:12 A4:4 | G4:16', leadWave: 'triangle', leadVol: 0.1, pad: true, padVol: 0.03 }
});

// ---------- espécies de 4º grau ----------
Object.assign(SPECIES.fortaleza, { evoLv: 12, evos: ['bastiao', 'abismo'] });
Object.assign(SPECIES.espinho, { evoLv: 12, evos: ['ferrao', 'carniceiro'] });
Object.assign(SPECIES.grimorio, { evoLv: 12, evos: ['biblioteca', 'proibido'] });
Object.assign(SPECIES.estelar, { evoLv: 12, evos: ['eclipse', 'constelacao'] });
const GROW4F = { mhp: 10, mmp: 2, atk: 3, def: 3, mag: 1 }, GROW4A = { mhp: 7, mmp: 5, atk: 1, def: 2, mag: 3 };
Object.assign(SPECIES, {
  bastiao: { tier: 4, name: 'Arca Bastião', sp: 'mimicBast', grow: GROW4F, bonus: { mhp: 40, mmp: 4, atk: 4, def: 3, mag: 2 }, bite: 1.35, guard: 0.6, passive: 'counter', passive2: 'guardian', tag: 'Bastião', desc: ['Sofre 15% menos dano', 'Técnica: Muralha', 'Contra-ataque'] },
  abismo: { tier: 4, name: 'Cofre-Abismo', sp: 'mimicAbys', grow: GROW4F, bonus: { mhp: 30, mmp: 4, atk: 7, def: 4, mag: 2 }, bite: 1.4, guard: 0.65, passive: 'counter', tag: 'Abismo', desc: ['Técnica: Engolir Inteiro', 'Executa inimigos fracos', 'Contra-ataque'] },
  ferrao: { tier: 4, name: 'Ferrão-Relicário', sp: 'mimicSting', grow: GROW4F, bonus: { mhp: 28, mmp: 4, atk: 7, def: 3, mag: 2 }, bite: 1.5, guard: 0.75, passive: 'thorns', passive2: 'poisonBite', tag: 'Veneno', desc: ['Mordidas envenenam', 'Técnica: Veneno Concentrado', 'Espinhos'] },
  carniceiro: { tier: 4, name: 'Baú Carniceiro', sp: 'mimicGore', grow: GROW4F, bonus: { mhp: 34, mmp: 3, atk: 8, def: 2, mag: 1 }, bite: 1.55, guard: 0.75, passive: 'thorns', passive2: 'lifesteal', tag: 'Fome', desc: ['Mordidas roubam vida', 'Técnica: Devorar', 'Espinhos'] },
  biblioteca: { tier: 4, name: 'Biblioteca Ambulante', sp: 'mimicLib', grow: GROW4A, bonus: { mhp: 24, mmp: 20, atk: 2, def: 3, mag: 8 }, discount: 1, passive: 'echo', tag: 'Cópia', desc: ['Técnica: Copiar feitiços', 'Eco mágico grátis', 'Muito PM'] },
  proibido: { tier: 4, name: 'Grimório Proibido', sp: 'mimicForb', grow: GROW4A, bonus: { mhp: 18, mmp: 24, atk: 1, def: 2, mag: 10 }, discount: 1, passive: 'echo', passive2: 'forbidden', tag: 'Proibido', desc: ['Feitiços +25% de poder', 'Técnica: Pacto (PV vira PM)', 'Eco mágico grátis'] },
  eclipse: { tier: 4, name: 'Relicário Eclipse', sp: 'mimicEcl', grow: GROW4A, bonus: { mhp: 26, mmp: 14, atk: 2, def: 4, mag: 9 }, discount: 1, passive: 'regen', passive2: 'shadow', tag: 'Eclipse', desc: ['Sombra +30% de poder', 'Técnica: Escuridão', 'Recupera PM'] },
  constelacao: { tier: 4, name: 'Constelação Viva', sp: 'mimicConst', grow: GROW4A, bonus: { mhp: 26, mmp: 16, atk: 2, def: 4, mag: 8 }, discount: 1, passive: 'regen', tag: 'Estrelas', desc: ['Técnica: Invocar Estrela', 'Recupera PM', 'Magia alta'] }
});

// ---------- técnicas ----------
const ATKB = () => G.st.atk * (spec().bite || 1) * BT.buff.atkM;
const TECH = {
  mobilia: { name: 'Imitar Mobília', cd: 4, desc: 'Vira um baú comum: inimigos comuns perdem o próximo turno. Chefes não caem nessa.', async use() { let n = 0; for (const e of BT.en) if (e.alive && !e.d.boss) { e.confused = 1; n++; } sfx('guard'); await bSay(n ? '* Você vira um baú comum, imóvel e inocente.' : '* Você vira um baú comum... mas o chefe já sabe o que você é.', { auto: 50 }); } },
  escudo: { name: 'Escudo da Guilda', cd: 4, desc: 'Postura da Brida: dano recebido pela metade e imune a agarrões nesta rodada e na próxima.', async use() { BT.guildShield = 2; sfx('guard'); await bSay('* Você abaixa a tampa como a Brida ensinou. Escudo da Guilda!', { auto: 45 }); } },
  tampa: { name: 'Fechar Tampa', cd: 3, desc: 'Postura: nesta rodada você sofre só 40% do dano e o contra-ataque da defesa perfeita sai em dobro.', async use() { BT.stance = 1; sfx('guard'); await bSay('* Você se fecha inteiro. Nada entra.', { auto: 40 }); } },
  investida: { name: 'Investida de Cofre', cd: 3, target: true, desc: 'Mordida 20% mais forte que pode atordoar (40%; chefes 15%).', async use(t) { await doBite(t, { m: 1.2, onHit: e => { if (e.hp > 0 && Math.random() < (e.d.boss ? 0.15 : 0.4)) { e.stunned = 1; return `\n* O ${e.name} ficou atordoado!`; } } }); } },
  rajada: { name: 'Rajada de Espinhos', cd: 3, desc: 'Atinge todos os inimigos e causa sangramento por 3 turnos.', async use() { sfx('bite'); const log = []; for (const e of BT.en.filter(e => e.alive)) { const d = Math.max(1, Math.round((ATKB() * 0.8 - e.def) * rand(0.9, 1.1))); hitEnemy(e, d, 'hit', '#ffa94d'); if (e.hp > 0) e.dot = { d: Math.max(1, Math.round(d * 0.25)), t: 3 }; log.push(`* ${e.name}: ${d} e sangrando.`); burst(e.x, e.y, '#ffa94d', 14); } await bSay(log.join('\n'), { auto: 55 }); } },
  dilacera: { name: 'Mordida Dilacerante', cd: 2, target: true, desc: 'Mordida 30% mais forte que causa sangramento por 3 turnos.', async use(t) { await doBite(t, { m: 1.3, onHit: (e, d) => { if (e.hp > 0) { e.dot = { d: Math.max(1, Math.round(d * 0.3)), t: 3 }; return `\n* O ${e.name} está sangrando.`; } } }); } },
  releitura: { name: 'Releitura', pmFn: () => BT.lastSpell ? Math.max(1, Math.ceil(spellCost(BT.lastSpell) / 2)) : 99, pm: 1, need: () => !!BT.lastSpell, desc: 'Repete o último feitiço pela metade do custo.', async use() { const sp = BT.lastSpell; let tgt = null; if (sp.form === 'dardo' || sp.form === 'corrente') { tgt = BT.en.find(e => e.alive); } await castSpell(sp, tgt); } },
  marcador: { name: 'Marcador de Página', pm: 4, desc: 'O próximo feitiço sai com 80% a mais de poder.', async use() { BT.nextSpellM = 1.8; sfx('buff'); await bSay('* Você dobra a ponta da página. O próximo feitiço vai sair forte.', { auto: 40 }); } },
  chuva: { name: 'Chuva de Estrelas', pm: 8, desc: 'Cinco estrelas caem em inimigos aleatórios.', async use() { const log = {}; for (let i = 0; i < 5; i++) { const al = BT.en.filter(e => e.alive && e.hp > 0); if (!al.length) break; const t = pickOne(al); const d = Math.round((6 + G.st.mag * 0.7) * rand(0.85, 1.15)); burst(t.x, t.y - 10, '#ffe066', 10); hitEnemy(t, d, 'hit', '#ffe066'); log[t.name] = (log[t.name] || 0) + d; await wait(8); } await bSay(Object.entries(log).map(([n, d]) => `* ${n}: ${d} de dano.`).join('\n'), { auto: 50 }); } },
  orbita: { name: 'Órbita', pm: 6, desc: 'Uma estrela gira em volta de você e anula o próximo golpe recebido.', async use() { BT.orbit = 1; sfx('buff'); await bSay('* Uma pequena estrela começa a girar em volta da sua tampa.', { auto: 40 }); } },
  muralha: { name: 'Muralha', cd: 4, desc: 'Dano recebido -40% por 3 turnos.', async use() { BT.buff.defM = Math.min(BT.buff.defM, 0.6); BT.buff.defT = Math.max(BT.buff.defT, 4); sfx('guard'); await bSay('* Você vira uma muralha de ferro e ouro.', { auto: 40 }); } },
  engolir: { name: 'Engolir Inteiro', cd: 3, target: true, desc: 'Engole um inimigo comum com 25% de PV ou menos e se cura. Se não der, morde forte.', async use(t) { if (!t.d.boss && t.hp <= t.mhp * 0.25) { const h = Math.round(G.st.mhp * 0.2); t.hp = 0; G.hp = Math.min(G.st.mhp, G.hp + h); sfx('bite'); await bSay(`* NHAC. O ${t.name} sumiu dentro de você. +${h} PV.`, { auto: 50 }); } else await doBite(t, { m: 1.1 }); } },
  veneno: { name: 'Veneno Concentrado', cd: 3, target: true, desc: 'Ferroada que deixa um veneno forte por 4 turnos.', async use(t) { const d = Math.max(1, Math.round((ATKB() * 0.6 - t.def) * rand(0.9, 1.1))); hitEnemy(t, d, 'hit', '#9be58a'); t.dot = { d: Math.max(1, Math.round(G.st.atk * 0.45)), t: 4 }; await bSay(`* ${t.name}: ${d} de dano. Veneno forte por 4 turnos.`, { auto: 50 }); } },
  devorar: { name: 'Devorar', cd: 3, target: true, desc: 'Mordida 50% mais forte (100% com pouca vida) que cura metade do dano.', async use(t) { const m = G.hp < G.st.mhp * 0.5 ? 2 : 1.5; await doBite(t, { m, onHit: (e, d) => { const h = Math.round(d * 0.5); G.hp = Math.min(G.st.mhp, G.hp + h); return `\n* Você devorou ${h} PV.`; } }); } },
  copiar: { name: 'Copiar', pm: 5, desc: 'Se engolir o próximo feitiço inimigo com perfeição, ele vira um feitiço seu.', async use() { BT.copy = true; sfx('rune'); await bSay('* Suas páginas se abrem em branco, esperando.', { auto: 40 }); } },
  pacto: { name: 'Pacto', cd: 2, desc: 'Troca 20% dos PV por 40% dos PM.', async use() { const c = Math.max(1, Math.round(G.st.mhp * 0.2)); if (G.hp <= c) { await bSay('* Você não tem vida suficiente para o pacto.', { auto: 40 }); return; } G.hp -= c; const g = Math.round(G.st.mmp * 0.4); G.mp = Math.min(G.st.mmp, G.mp + g); sfx('rune'); await bSay(`* Sangue vira tinta. -${c} PV, +${g} PM.`, { auto: 45 }); } },
  escuridao: { name: 'Escuridão', pm: 8, desc: 'Por 3 turnos, os inimigos erram mais: dano recebido -25%.', async use() { BT.dark = 3; sfx('buff'); await bSay('* A sala escurece. Só os seus olhos brilham.', { auto: 40 }); } },
  estrela: { name: 'Invocar Estrela', pm: 10, desc: 'Uma estrela aliada ataca sozinha no fim de cada rodada, por 3 rodadas.', async use() { BT.star = 3; sfx('rune'); await bSay('* Uma estrela desce do teto e decide ficar do seu lado.', { auto: 40 }); } }
};
const LINE_TECH = { fortaleza: ['tampa', 'investida'], espinho: ['rajada', 'dilacera'], grimorio: ['releitura', 'marcador'], estelar: ['chuva', 'orbita'], bastiao: ['muralha'], abismo: ['engolir'], ferrao: ['veneno'], carniceiro: ['devorar'], biblioteca: ['copiar'], proibido: ['pacto'], eclipse: ['escuridao'], constelacao: ['estrela'] };
async function grantTechs(inBattle) {
  if (!G.flags.ch3open) return;
  G.tech = G.tech || [];
  const want = ['mobilia'], L = LINE_TECH[G.species] || [];
  if (L[0]) want.push(L[0]);
  if (L[1] && (G.lv >= 3 || spec().tier >= 4)) want.push(L[1]);
  const fresh = want.filter(k => !G.tech.includes(k));
  for (const k of fresh) {
    G.tech.push(k); sfx('rune');
    const t = `[Técnica aprendida: {y}${TECH[k].name}{/}. ${TECH[k].desc}]`;
    if (inBattle) await bSay(t, { cat: true }); else await say(t, 'cat');
  }
}

// ---------- inimigos ----------
Object.assign(ENEMIES, {
  garg: { name: 'Gárgula de Giz', sp: 'garg', hp: 165, atk: 50, def: 20, xp: 65, weak: { faisca: 1.5, vento: 1.6, bite: 0.75, brasa: 0.8 }, drops: [['pao', .25]],
    flavor: ['* A Gárgula de Giz range como lousa arranhada.', '* Ela tem desenhos de criança riscados nas asas.', '* Um pedaço da asa cai. Ela finge que não viu.'], check: 'Pedra: mordidas rendem pouco. VENTO e FAÍSCA quebram a casca.',
    big: { k: 'dodge', p: 1.9, spd: 1.1 }, moves: [
      { k: 'ring', p: 1, w: 2, t: '* A Gárgula golpeia com a asa de pedra!' },
      { k: 'seq', n: 3, p: 0.5, w: 2, t: '* Garras de giz! Três riscos rápidos!' },
      { k: 'buff', stat: 'shell', turns: 2, w: 1, t: '* A Gárgula congela numa pose de estátua.' }] },
  escr: { name: 'Escriba Sombrio', sp: 'escr', hp: 125, atk: 48, def: 8, xp: 65, evade: 0.2, weak: { brasa: 1.5, faisca: 1.3, sombra: 0.4, vento: 1.2 }, drops: [['tinta', .35], ['eter', .1]],
    flavor: ['* O Escriba Sombrio escreve no ar sem parar. Seu nome aparece e some.', '* Pinga tinta do capuz dele.', '* Ele risca alguma coisa. Você se sente um pouco mais leve.'], check: 'Fantasma de tinta. BRASA queima, SOMBRA quase não afeta.',
    moves: [
      { k: 'spell', p: 1, el: 'sombra', name: 'Dardo de Sombra', st: 'blind', w: 2, t: '* O Escriba escreve {p}Dardo de Sombra{/} e sopra a palavra em você!' },
      { k: 'spell', p: 0.75, el: 'tinta', name: 'Selo de Tinta', st: 'silence', w: 1, t: '* O Escriba desenha um {p}Selo de Tinta{/} na sua tampa!' },
      { k: 'heal', frac: 0.25, name: 'Reescrever', w: 1, t: '* O Escriba reescreve as feridas do aliado.' },
      { k: 'buff', stat: 'hide', turns: 2, w: 1, t: '* O Escriba se apaga como uma palavra mal escrita.' }] },
  soldier: { name: 'Soldado de Auren', sp: 'soldier', hp: 155, atk: 52, def: 15, xp: 70, elite: true, weak: { faisca: 1.4, sombra: 1.3 }, drops: [['vela', .3]],
    flavor: ['* O Soldado de Auren segura a lança como se tivesse medo dela.', '* "Tudo pela coroa", ele murmura, sem convicção.', '* O escudo dele tem um mímico pintado, com um X em cima.'], check: 'Armadura de metal. FAÍSCA conduz, SOMBRA assusta.',
    big: { k: 'seq', n: 6, p: 0.45, spd: 1.15 }, moves: [
      { k: 'ring', p: 1.05, w: 2, t: '* O Soldado estoca com a lança!' },
      { k: 'seq', n: 4, p: 0.45, pierce: true, w: 2, t: '* Golpes de lança em sequência!' },
      { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* "Formação!" O Soldado cobre o parceiro.' },
      { k: 'ring', p: 1.35, fast: true, pierce: true, w: 1, t: '* Investida de lança!' }] },
  cleric: { name: 'Clériga de Auren', sp: 'cleric', hp: 140, atk: 46, def: 12, xp: 70, elite: true, weak: { sombra: 1.6, brasa: 1.2 }, drops: [['eter', .2]],
    flavor: ['* A Clériga reza baixinho. Não parece rezar para você.', '* O cajado dela brilha quando você se mexe.', '* Ela tem olheiras de quem cura gente demais.'], check: 'Cura e protege aliados. Derrube primeiro. SOMBRA é a fraqueza.',
    moves: [
      { k: 'heal', frac: 0.3, name: 'Prece', w: 2, t: '* A Clériga ergue o cajado e reza.' },
      { k: 'spell', p: 1.05, el: 'brasa', name: 'Luz Punitiva', st: 'burn', w: 2, t: '* A Clériga conjura {o}Luz Punitiva{/}!' },
      { k: 'dodge', p: 0.7, st: 'silence', w: 1, t: '* A Clériga atira um {p}Selo de Silêncio{/}!' },
      { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* A Clériga abençoa o aliado com uma barreira.' }] },
  farol: { name: 'Portador de Farol', sp: 'farol', hp: 140, atk: 50, def: 14, xp: 70, elite: true, weak: { sombra: 1.5, vento: 1.3 }, drops: [['pao', .3]],
    flavor: ['* O Portador de Farol balança a lanterna. Não dá pra se esconder dessa luz.'], check: 'A luz dele revela disfarces. SOMBRA apaga.',
    moves: [
      { k: 'ring', p: 0.85, st: 'blind', w: 2, t: '* CLARÃO! A lanterna explode em luz!' },
      { k: 'dodge', p: 1, hits: 2, w: 2, t: '* O Portador gira a lanterna como um mangual!' },
      { k: 'ring', p: 1.2, w: 1, t: '* O Portador dá com a lanterna na sua tampa!' }] },
  jailer: { name: 'Carcereiro de Ferro-Velho', sp: 'jailer', hp: 1300, atk: 66, def: 22, xp: 420, boss: true, ai: 'jailer', sc: 3, weak: { faisca: 1.6, geada: 1.2, bite: 0.8 },
    flavor: ['* O Carcereiro tilinta como mil chaves.', '* Dentro dele, alguém escreveu "SOCORRO" com unha.'], flavor2: ['* As grades do Carcereiro se fecham em volta dele.'], check: 'Feito de grades. FAÍSCA passa pelo ferro. Fuja dos agarrões.' },
  knight: { name: 'Cavaleiro Sem Nome', sp: 'knight', hp: 2000, atk: 74, def: 26, xp: 700, boss: true, ai: 'knight', sc: 5, weak: { sombra: 1.3, vento: 1.3 },
    flavor: ['* A armadura é de outro século. Dentro dela não tem ninguém.', '* Ele luta como quem protege alguém que não está mais aqui.'], check: 'Repete o seu último feitiço contra você. Varie as magias.' },
  maren: { name: 'Inquisidora Maren', sp: 'maren', hp: 1800, atk: 64, def: 18, xp: 500, boss: true, ai: 'maren', sc: 5, weak: { sombra: 1.3, bite: 1.1 },
    flavor: ['* A Inquisidora Maren lê em voz alta. As palavras doem.', '* "Nada pessoal, alma trinta e um."'], flavor2: ['* As páginas do Catálogo giram em volta da Maren.', '* A tinta escorre pelas mãos dela. Ela não liga.'], check: 'Usa as SUAS runas contra você. Engolir os feitiços dela devolve PM.' }
});
Object.assign(ENEMIES, {
  escrM: { ...ENEMIES.escr, name: 'Escriba Mestre', hp: 210, atk: 62, def: 10, xp: 80, drops: [['eter', .25]], check: 'Escriba veterano. BRASA queima, SOMBRA quase não afeta. Ele cura os aliados.' },
  guarda: { ...ENEMIES.soldier, name: 'Guarda Inquisidor', hp: 240, atk: 66, def: 20, xp: 85, drops: [['vela', .35]], check: 'Guarda de elite da Maren. Lança perfurante. FAÍSCA e SOMBRA.',
    moves: [{ k: 'seq', n: 5, p: 0.45, pierce: true, spd: 1.15, w: 2, t: '* O Guarda Inquisidor encadeia golpes de lança!' }, { k: 'ring', p: 1.3, fast: true, pierce: true, w: 2, t: '* Estocada inquisitorial!' }, { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* O Guarda ergue o escudo na frente do aliado.' }] },
  clericM: { ...ENEMIES.cleric, name: 'Alta Clériga', hp: 210, atk: 58, def: 14, xp: 85, drops: [['eter', .3]] }
});
const AI3 = {
  async jailer(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; e.atk += 4; e.shell = 2; shake(30); sfx('rumble'); await bSay('CELA... REFORÇADA.', { fx: 'shake', col: '#d0d0e0' }); await bSay('* As grades se fecham em volta do Carcereiro. Ele ganhou uma carapaça. (FAÍSCA quebra.)', { auto: 60 }); return; }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'dodge', p: 2.0, spd: 1.2, t: '* PORTÃO DESPENCANDO! Uma grade inteira cai em cima de você!', fx: 'shake' }); }
    if (e.turns % 4 === 0) { e.charge = true; await bSay('* O Carcereiro arranca um portão da parede e o ergue. (Prepare-se para desviar.)', { auto: 65 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'mash', p: 0.8, need: 14, bind: true, w: 2, t: '* JAULA VIVA! As grades se fecham em volta de você!' },
      { k: 'seq', n: e.p2 ? 6 : 5, p: 0.5, w: 2, t: '* Correntes! Elas chicoteiam de todos os lados!' },
      { k: 'ring', p: 1.25, pierce: true, w: 2, t: '* O Carcereiro gira o molho de chaves gigante!' },
      { k: 'ring', p: 0.8, st: 'silence', w: 1, t: '* {p}Cadeado Rúnico{/}! Ele tenta trancar sua boca.' }]));
  },
  async knight(e) {
    if (e.charge) { e.charge = false; return runMove(e, { k: 'dodge', p: 0.8, hits: 3, spd: 1.35, pierce: true, t: '* CORTE DO FIM! Três cortes que atravessam o tempo!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* O Cavaleiro ergue a lança com as duas mãos. O ar treme. (Prepare-se.)', { auto: 60 }); return; }
    const last = BT.lastSpell;
    return runMove(e, pickMove(e, [
      { k: 'seq', n: 6, p: 0.45, spd: 1.25, pierce: true, w: 2, t: '* Lâmina Antiga! Uma sequência de outro século!' },
      { k: 'spell', p: 1.2, el: last ? last.el : 'sombra', name: last ? `Eco: ${last.name}` : 'Eco Vazio', hits: last && last.form === 'corrente' ? 2 : 1, w: last ? 3 : 1, t: last ? `* O Cavaleiro repete o SEU feitiço: {p}${last.name}{/}!` : '* O Cavaleiro ecoa um feitiço que ninguém lançou.' },
      { k: 'buff', stat: 'shell', turns: 2, w: 1, once: 'jur', t: '* "Eu juro... proteger..." O Cavaleiro se fecha numa guarda antiga.' }]));
  },
  async maren(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; e.atk += 4; shake(30); sfx('rumble'); await bSay('Você acha que é especial? Você é uma LINHA num livro.', { col: '#e0c0ff' }); await bSay('* Maren abre o livro do Escriba. As páginas giram em volta dela.', { auto: 55 }); return; }
    if (!e.p3 && e.hp <= e.mhp * 0.2) { e.p3 = true; return runMove(e, { k: 'spell', p: 2.0, el: 'sombra', name: 'Página Final', st: 'silence', spd: 1.1, t: '* Maren arranca uma página do Catálogo e a lança: {p}PÁGINA FINAL{/}!', fx: 'shake' }); }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'seq', n: e.p2 ? 7 : 6, p: 0.5, spd: 1.2, pierce: true, t: '* SELO DO ARQUIVO! Ela escreve seu nome letra por letra! Interrompa cada traço!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* Maren começa a escrever o seu nome no ar, devagar. (Prepare-se.)', { auto: 60 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'spell', p: 0.85, el: 'sombra', name: 'Onda de Sombra', st: 'blind', w: 2, t: '* Maren lança {p}Onda de Sombra{/}. É uma das SUAS runas.' },
      { k: 'spell', p: 0.6, hits: 2, el: 'faisca', name: 'Corrente de Faísca', w: 2, t: '* {y}Corrente de Faísca{/}! O raio pula duas vezes!' },
      { k: 'spell', p: 1, el: 'vento', name: 'Dardo de Vento Selado', st: 'silence', w: 1, t: '* {w}Dardo de Vento Selado{/}!' },
      { k: 'heal', frac: 0.1, name: 'Véu de Seiva', w: 1, once: 'veu', t: '* Maren conjura {g}Véu de Seiva{/} em si mesma.' },
      { k: 'ring', p: 1.15, pierce: true, w: 1, t: '* Maren bate com o livro. Literatura dói.' }]));
  }
};
Object.assign(AI, AI3);

// ---------- mapas ----------
const TH_FORT = { floor: '#33363f', speck: '#3b3f4a', dark: '#2a2c34', wall: '#4a4e5c', mortar: '#2a2c36', wallHi: '#6a7084' };
MAPS.ponte.rows[23] = "  #####..#####  ";
MAPS.ponte.exits.push({ x: 7, y: 23, to: 'escadaria3', tx: 6, ty: 14, cond: 'ch3open' }, { x: 8, y: 23, to: 'escadaria3', tx: 7, ty: 14, cond: 'ch3open' });
MAPS.ponte.ents.push({ id: 'd_ch3a', kind: 'door', x: 7, y: 23, cond: 'ch3open', dark: true, msg: 'ch3' }, { id: 'd_ch3b', kind: 'door', x: 8, y: 23, cond: 'ch3open', dark: true, msg: 'ch3' });
Object.assign(MAPS, {
  escadaria3: { name: 'Escadaria do Sino', music: 'scriptorium', dark: 0.5, theme: TH_FORT, battleBg: '#1c2030', rows: [
      "######..######", "######..######", "####......####", "###........###", "###.c....c.###", "####......####", "######..######", "####......####", "###........###", "###.K....K.###", "###........###", "####......####", "#####....#####", "######..######", "######..######", "######..######"],
    exits: [{ x: 6, y: 15, to: 'ponte', tx: 7, ty: 22 }, { x: 7, y: 15, to: 'ponte', tx: 8, ty: 22 }, { x: 6, y: 0, to: 'muralhas', tx: 13, ty: 20 }, { x: 7, y: 0, to: 'muralhas', tx: 14, ty: 20 }],
    ents: [{ id: 'save_e3', kind: 'save', x: 4, y: 10 }, { id: 'pg1', kind: 'page', x: 10, y: 3 },
      { id: 's_raiz1', kind: 'seal', x: 6, y: 6, flag: 's_raizes', need: { el: 'brasa' }, look: 'vines' }, { id: 's_raiz2', kind: 'seal', x: 7, y: 6, flag: 's_raizes', need: { el: 'brasa' }, look: 'vines' },
      { id: 'e_e1', kind: 'enemy', x: 6, y: 9, group: ['garg'] }] },
  muralhas: { name: 'Muralhas de Auren', music: 'fortaleza', dark: 0.3, theme: TH_FORT, battleBg: '#1c2030', rows: [
      "#############..#############", "#############..#############", "##...................#....##", "##..c.....KK......c..#....##", "##......................K.##", "##...................#....##", "##.........c....c....#....##", "##r.................r#######", "#~~~~~~~~~~~~~~~~~~~~~~~~~~#", "#~~~~~~~~~~~~~~~~~~~~~~~~~~#", "#~~~~~~~~~~~~~~~~~~~~~~~~~~#", "##r.....#................r##", "##......#.................##", "##...K..#.......K.........##", "##......#.................##", "##........................##", "##......#...........K.....##", "##..c...#..............c..##", "##......#.................##", "#############..#############", "#############..#############", "#############..#############"],
    exits: [{ x: 13, y: 21, to: 'escadaria3', tx: 6, ty: 1 }, { x: 14, y: 21, to: 'escadaria3', tx: 7, ty: 1 }, { x: 13, y: 0, to: 'patio', tx: 14, ty: 17 }, { x: 14, y: 0, to: 'patio', tx: 15, ty: 17 }],
    ents: [{ id: 'save_w', kind: 'save', x: 12, y: 16 }, { id: 'pg2', kind: 'page', x: 3, y: 16 }, { id: 'oculos', kind: 'pickup', x: 6, y: 17, script: 'oculos' },
      { id: 'c_w1', kind: 'chest', x: 24, y: 13, item: 'pao', n: 2 },
      { id: 's_ponte1', kind: 'seal', x: 13, y: 8, flag: 's_ponte', need: { el: 'geada' }, look: 'water', bridge: true }, { id: 's_ponte2', kind: 'seal', x: 13, y: 9, flag: 's_ponte', need: { el: 'geada' }, look: 'water', bridge: true }, { id: 's_ponte3', kind: 'seal', x: 13, y: 10, flag: 's_ponte', need: { el: 'geada' }, look: 'water', bridge: true },
      { id: 's_portao1', kind: 'seal', x: 13, y: 1, flag: 's_portao', need: { el: 'faisca' }, look: 'machine' }, { id: 's_portao2', kind: 'seal', x: 14, y: 1, flag: 's_portao', need: { el: 'faisca' }, look: 'machine' },
      { id: 's_secreta', kind: 'seal', x: 21, y: 4, flag: 's_secreta', need: { el: 'sombra' }, look: 'light' },
      { id: 'knight', kind: 'boss3', x: 23, y: 3, sp: 'knight', done: 'knightDone', script: 'knight', glow: 'rgba(255,80,80,0.12)' },
      { id: 'e_w1', kind: 'enemy', x: 18, y: 13, group: ['garg'] }, { id: 'e_w2', kind: 'enemy', x: 11, y: 17, group: ['soldier'] }, { id: 'e_w3', kind: 'enemy', x: 4, y: 12, group: ['escr'] },
      { id: 'e_w4', kind: 'enemy', x: 6, y: 4, group: ['soldier', 'garg'] }, { id: 'e_w5', kind: 'enemy', x: 17, y: 5, group: ['escr', 'soldier'] }, { id: 'e_w6', kind: 'enemy', x: 9, y: 2, group: ['cleric', 'garg'] }] },
  patio: { name: 'Pátio da Guarnição', music: 'acampamento', dark: 0.35, theme: TH_FORT, battleBg: '#1c2030', rows: [
      "##############..##############", "#............................#", "#..K......................K..#", "#............................#", "#....TT................TT....#", "#....TT................TT....#", "#............................#", "#............................#", "#.......c.....KK.....c.......#", ".............................#", ".............................#", "#............................#", "#.........TT.......TT........#", "#.........TT.......TT........#", "#.............c..............#", "#..K......................K..#", "#............................#", "#............................#", "##############..##############", "##############..##############"],
    exits: [{ x: 14, y: 19, to: 'muralhas', tx: 13, ty: 1 }, { x: 15, y: 19, to: 'muralhas', tx: 14, ty: 1 }, { x: 0, y: 9, to: 'jaula', tx: 22, ty: 9 }, { x: 0, y: 10, to: 'jaula', tx: 22, ty: 10 }, { x: 14, y: 0, to: 'scriptorium', tx: 9, ty: 17 }, { x: 15, y: 0, to: 'scriptorium', tx: 10, ty: 17 }],
    ents: [{ id: 'save_c', kind: 'save', x: 13, y: 16 }, { id: 'pg3', kind: 'page', x: 27, y: 16 },
      { id: 's_nevoa1', kind: 'seal', x: 14, y: 1, flag: 's_nevoa', need: { el: 'vento', form: 'onda' }, look: 'wind' }, { id: 's_nevoa2', kind: 'seal', x: 15, y: 1, flag: 's_nevoa', need: { el: 'vento', form: 'onda' }, look: 'wind' },
      { id: 'p_c1', kind: 'patrol', x: 2, y: 6, path: [[2, 6], [27, 6]], delay: 16, range: 4, group: ['soldier'], sp: 'soldier' },
      { id: 'p_c2', kind: 'patrol', x: 17, y: 2, path: [[17, 2], [17, 16]], delay: 22, range: 3, group: ['farol'], sp: 'farol', light: true },
      { id: 'p_c3', kind: 'patrol', x: 4, y: 11, path: [[4, 11], [25, 11]], delay: 14, range: 4, group: ['cleric', 'soldier'], sp: 'cleric' },
      { id: 'p_c4', kind: 'patrol', x: 14, y: 4, turn: ['down', 'left', 'up', 'right'], delay: 60, range: 3, group: ['farol'], sp: 'farol', light: true },
      { id: 'e_c1', kind: 'enemy', x: 8, y: 15, group: ['garg', 'escr'] }, { id: 'e_c2', kind: 'enemy', x: 22, y: 15, group: ['escr'] }] },
  jaula: { name: 'Jaula dos Monstros', music: 'jaula', dark: 0.5, battleBg: '#241c24', theme: { floor: '#2c2830', speck: '#35303a', dark: '#221e26', wall: '#3e3644', mortar: '#241e28', wallHi: '#5a5064' }, rows: [
      "########################", "#......................#", "#.J..J..J..J..J..J..J..#", "#.J..J..J..J..J..J..J..#", "#......................#", "#......................#", "#######..........#######", "#......................#", "#.K..................K.#", "#........c....c.........", "#.K......c....c......K..", "#......................#", "#######..........#######", "#......................#", "#......................#", "#......................#", "#.J..J..J..J..J..J..J..#", "#.J..J..J..J..J..J..J..#", "#......................#", "########################"],
    exits: [{ x: 23, y: 9, to: 'patio', tx: 1, ty: 9 }, { x: 23, y: 10, to: 'patio', tx: 1, ty: 10 }],
    ents: [{ id: 'save_j', kind: 'save', x: 19, y: 9 }, { id: 'pg4', kind: 'page', x: 12, y: 1 },
      { id: 'cida', kind: 'npc2', x: 8, y: 3, sp: 'cida', talk: 'cida', float: true, glow: 'rgba(200,180,255,0.15)' },
      { id: 'cage1', kind: 'npc2', x: 2, y: 3, sp: 'cage', talk: 'caged' }, { id: 'cage2', kind: 'npc2', x: 17, y: 3, sp: 'cage', talk: 'caged' },
      { id: 'pip', kind: 'npc2', x: 5, y: 16, sp: 'pip', talk: 'apprentice', hide: 'free_pip', name: 'Pip' },
      { id: 'nina', kind: 'npc2', x: 11, y: 16, sp: 'pip', talk: 'apprentice', hide: 'free_nina', name: 'Nina' },
      { id: 'tolo', kind: 'npc2', x: 17, y: 16, sp: 'pip', talk: 'apprentice', hide: 'free_tolo', name: 'Tolo' },
      { id: 'bridaJ', kind: 'npc2', x: 11, y: 8, sp: 'brida', talk: 'bridaJ', hide: 'bridaGone' },
      { id: 'r_vento', kind: 'rune', x: 21, y: 14, rune: 'vento' }, { id: 'r_sombra', kind: 'rune', x: 2, y: 14, rune: 'sombra' },
      { id: 'c_j1', kind: 'chest', x: 20, y: 14, item: 'eter', n: 2 },
      { id: 'jailerE', kind: 'boss3', x: 11, y: 13, sp: 'jailer', done: 'jailerDone', script: 'jailer', glow: 'rgba(255,80,80,0.12)' },
      { id: 'e_j1', kind: 'enemy', x: 5, y: 9, group: ['escr'] }, { id: 'e_j2', kind: 'enemy', x: 16, y: 9, group: ['soldier', 'cleric'] },
      { id: 'e_j3', kind: 'enemy', x: 4, y: 4, group: ['garg'] }, { id: 'e_j4', kind: 'enemy', x: 18, y: 4, group: ['escr', 'garg'] }] },
  scriptorium: { name: 'Scriptorium Suspenso', music: 'scriptorium', dark: 0.45, battleBg: '#20182a', theme: { floor: '#2a2430', speck: '#332b3a', dark: '#201b26', wall: '#3a3046', mortar: '#201a28', wallHi: '#54486a' }, rows: [
      "####################", "#BBBBBBBB..BBBBBBBB#", "#..................#", "#.c..............c.#", "#..................#", "#..YY.YY....YY.YY..#", "#..................#", "#..................#", "#..YY.YY....YY.YY..#", "#..................#", "#..................#", "#..YY.YY....YY.YY..#", "#..................#", "#..................#", "#.c..............c.#", "#..................#", "#..................#", "#..................#", "#########..#########", "#########..#########"],
    exits: [{ x: 9, y: 19, to: 'patio', tx: 14, ty: 1 }, { x: 10, y: 19, to: 'patio', tx: 15, ty: 1 }],
    ents: [{ id: 'save_s', kind: 'save', x: 2, y: 16 }, { id: 'pg5', kind: 'page', x: 17, y: 16 },
      { id: 'marenE', kind: 'boss3', x: 9, y: 3, sp: 'maren', done: 'marenDone', script: 'maren', glow: 'rgba(200,160,255,0.15)' },
      { id: 'escribaN', kind: 'npc2', x: 10, y: 2, sp: 'escriba', talk: 'escriba', float: true, glow: 'rgba(220,200,255,0.18)' },
      { id: 'e_s1', kind: 'enemy', x: 4, y: 7, group: ['escrM'] }, { id: 'e_s2', kind: 'enemy', x: 14, y: 10, group: ['clericM', 'guarda'] },
      { id: 'e_s3', kind: 'enemy', x: 10, y: 13, group: ['guarda', 'escrM'] }, { id: 'e_s4', kind: 'enemy', x: 5, y: 12, group: ['escrM', 'escrM'] }] }
});
Object.assign(LOOK, {
  J: ['* Grades enferrujadas. Lá dentro, só palha e arranhões na parede.', '* Uma cela vazia. Alguém contou os dias riscando a pedra: muitos.'],
  Y: ['* Uma escrivaninha coberta de páginas. Todas têm nomes. Nenhum que você reconheça.', '* Uma pena escreve sozinha, devagar: "...e o baú subiu a escada..."', '* Tinteiros cheios de algo que não é tinta.']
});
WHO.cida = { name: () => 'Dona Cida', portrait: () => SP.cida[0], voice: () => sfx('blipTri', 900) };
WHO.maren = { name: () => 'Inquisidora Maren', portrait: () => SP.maren[0], voice: () => sfx('blip', 420), col: '#e8d8ff' };
WHO.escriba = { name: () => 'O Escriba', portrait: () => SP.escriba[0], voice: () => sfx('blipTri', 640), col: '#d8d0f0' };
WHO.jailer = { name: () => 'Carcereiro', portrait: () => SP.garg[0], voice: () => sfx('blipLow', 120), fx: 'shake', col: '#d0d0e0' };
WHO.knight = { name: () => 'Cavaleiro', portrait: () => SP.knight[0], voice: () => sfx('blipLow', 160), col: '#e0c0c0' };
WHO.pip = { name: () => 'Aprendiz', portrait: () => SP.pip[0], voice: () => sfx('blip', 820) };

// ---------- selos e páginas ----------
const SEAL_TXT = {
  vines: '* Raízes secas fecham a passagem. Parecem bem inflamáveis.',
  water: '* O fosso é largo demais para pular. Se a água endurecesse...',
  machine: '* Um portão de ferro com engrenagens paradas. Falta energia para girar.',
  light: '* Uma parede de luz pura, quente demais para atravessar. Só a escuridão apaga isso.',
  wind: '* Uma névoa de tinta preta cobre o portão. Ela se mexe como se estivesse lendo você.\n* (Precisa de uma {y}ONDA{/} de vento para dispersar.)'
};
const SEAL_OK = {
  vines: '* As raízes pegam fogo e viram cinza. Passagem livre.',
  water: '* A água congela numa ponte de gelo grossa. Dá para atravessar.',
  machine: '* A faísca corre pelas engrenagens. O portão sobe, rangendo.',
  light: '* A sombra engole a luz como você engole feitiços. A parede some.',
  wind: '* O redemoinho espalha a névoa em mil letrinhas. O portão está livre.'
};
async function useSeal(e) {
  if (G.flags[e.flag]) return;
  if (!G.flags.tut_seal) { G.flags.tut_seal = true; sfx('catalog'); await say('[SELO RÚNICO: algumas passagens só se abrem com o feitiço certo. Escolha um feitiço do grimório. Gasta PM.]', 'cat'); }
  await say(SEAL_TXT[e.look]);
  if (!G.spells.length) { await say('* Você não tem feitiços para tentar.'); return; }
  const i = await list({ title: 'Usar qual feitiço?', x: 8, y: 8, w: 224, items: G.spells.map(s => ({ label: s.name, right: spellCost(s) + ' PM', disabled: spellCost(s) > G.mp, col: RUNES[s.el].col })), desc: k => spellDesc(G.spells[k]) });
  if (i < 0) return;
  const sp = G.spells[i]; G.mp -= spellCost(sp); sfx(sp.el in { brasa: 1, geada: 1, seiva: 1 } ? sp.el : 'rune');
  const ok = sp.el === e.need.el && (!e.need.form || sp.form === e.need.form);
  if (!ok) { sfx('cancel'); await say(pickOne(['* O selo absorve a magia e... nada. Era outra palavra.', '* A runa brilha, pisca e apaga. Não era esse feitiço.'])); if (e.need.form && sp.el === e.need.el) await say('* Quase! O elemento é esse, mas a forma não.'); return; }
  G.flags[e.flag] = true; sfx('gate'); shake(12);
  await say(SEAL_OK[e.look]);
}
const PAGES = {
  pg1: '"...registro 1: uma carruagem caiu na neblina. Doze almas. A primeira se chamava O—" (o resto foi arrancado)',
  pg2: '"Arquivar: guardar para sempre." Nota do copista, na margem: "Mentira. Ninguém guarda nada para sempre."',
  pg3: '"Ordem da Inquisição: todo invocado que reconhecer um monstro deve informar. Penalidade por omissão: esquecimento."',
  pg4: '"Almas do Ônibus 31: 31 registros. 9 heróis. 14 monstros. 8..." (a tinta escorreu bem em cima do número)',
  pg5: '"Ele dita à noite. A voz vem de baixo do primeiro andar. Tem gosto de sal e ferrugem."'
};
async function readPage(e) {
  if (G.flags[e.id]) return;
  G.flags[e.id] = true; G.flags.pages = (G.flags.pages || 0) + 1; sfx('item');
  await say(`* Uma página solta do Catálogo. (${G.flags.pages}/5)`);
  await say('* ' + PAGES[e.id]);
  if (G.flags.pages >= 5 && !G.flags.pagesDone) {
    G.flags.pagesDone = true;
    await say('* Um Morcego de Papel aparece do nada e pousa na pilha de páginas.');
    await say('* "Vocês andam lendo o que não deviam. Ótimo. Tomem: um caco de âmbar que eu guardava desde... muito tempo. — O."');
    G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
  }
}

// ---------- história ----------
const lostPastel = () => !!G.flags.mem_pastel;
Object.assign(STORY, {
  onStep3() {
    if (WD.id === 'jaula' && !G.flags.jailerDone && WD.y >= 13) { runScript(STORY.jailer); return true; }
    if (WD.id === 'scriptorium' && !G.flags.marenDone && WD.y <= 6) { runScript(STORY.maren); return true; }
    return false;
  },
  async ch3start() {
    if (G.flags.ch3open) return;
    await wait(20);
    shake(20); sfx('rumble');
    await say('* O Sino do Andar 2 toca sozinho.| Uma vez.| Duas.| Três.');
    await say('...Baú? Eu tô estranha.', 'lume');
    G.flags.lumeFading = true;
    await say('* A luz da Lume pisca e some por um instante. Depois volta, mais fraca.');
    sfx('catalog');
    await say('[Registro nº 12: prioridade de arquivamento ALTA.]', 'cat');
    await say('Arquivamento? O que isso quer dizer?', 'me');
    await say('Eu não sei. Mas parece que alguém tá folheando a minha vida de trás pra frente.', 'lume');
    await say('* Um Morcego de Papel chega voando, mais rápido que os outros. A letra está borrada, como se tivesse sido escrita com pressa.');
    await say('* "Leiam sem perguntar. A masmorra está com fome. Quando os heróis atacam lá em cima, ela come mais almas aqui embaixo. A Lume é a próxima da fila."');
    await say('* "O Catálogo não se escreve sozinho. Existe uma pena. Ela fica no Andar 3, na fortaleza dos invocados. Encontrem quem escreve. — O."');
    await say('* "P.S.: eu menti sobre a porta ranger. Desculpem."');
    await say('Andar 3. O Tiago disse pra gente ficar longe.', 'me');
    await say('O Tiago não tá apagando.', 'lume');
    await say('...Vamos.', 'me');
    G.flags.ch3open = true; sfx('gate');
    await say('* Atrás do sino, a pedra se abre numa passagem estreita.');
    sfx('catalog');
    await say('[Lembranças do corpo recuperadas. Sua forma conhece TÉCNICAS próprias.]', 'cat');
    await say('[Na batalha, o botão {y}MORDER{/} agora se chama {y}TÉCNICA{/}. A Mordida comum continua lá, em primeiro na lista.]', 'cat');
    await say('[Algumas técnicas gastam PM. Outras precisam de alguns turnos para recarregar.]', 'cat');
    G.flags.tut_tecnica = true;
    await grantTechs(false);
    saveGame();
  },
  async escadaria3First() {
    await wait(20);
    await say('* A escadaria sobe em espiral. As paredes estão cobertas de símbolos iguais aos da sua tampa.');
    await say('Tá frio aqui. Eu odeio frio quase tanto quanto escuro.', 'lume');
  },
  async muralhasFirst() {
    await wait(20);
    await say('* Muralhas de pedra branca. Bandeiras azuis do Reino de Auren. Uma fortaleza inteira construída DENTRO da masmorra.');
    await say('Eles se mudaram pra cá. Isso não é uma expedição. É uma invasão.', 'lume');
    await say('E a gente vai atravessar ela no meio. Ótimo plano, @.', 'lume');
  },
  async patioFirst() {
    await wait(20);
    sfx('catalog');
    await say('[Cuidado: PORTADORES DE FAROL. Dentro da luz deles, o disfarce não funciona.]', 'cat');
    await say('A porta do norte vai pro lugar onde escrevem. Dá pra sentir daqui. Tem cheiro de tinta velha.', 'lume');
  },
  async jaulaFirst() {
    await wait(30);
    await say('* Celas. Dezenas de celas. A maioria tem monstros dentro.| Alguns olham para você como se te conhecessem.');
    await say('Eles prendem monstros aqui? Pra quê?', 'me');
    await say('Pra estudar. Ou pra alimentar alguma coisa. Nenhuma das duas opções é boa.', 'lume');
  },
  async scriptoriumFirst() {
    await wait(20);
    await say('* Centenas de mesas. Centenas de penas escrevendo sozinhas. O som é de chuva fina.');
    await say('Tá ouvindo? Elas escrevem nomes.| Eu acabei de ouvir o meu.', 'lume');
  },
  async doorCh3() { await say('* Uma fresta atrás do sino. Está escuro, e algo dentro de você diz que ainda não é hora.'); },
  async oculos(e) {
    if (G.flags.oculos) return;
    G.flags.oculos = true; G.flags[e.id] = true; sfx('item');
    await say('* Um baú pisoteado. Dentro dele, um par de {y}óculos de armação dourada{/}, tortos.');
    await say('* Pequenos demais para um humano adulto. Grandes demais para um rato.');
  },
  async cida() {
    const f = G.flags;
    if (!f.metCida) {
      f.metCida = true;
      await say('Ora, ora. Um baú e um lustre. Era só o que faltava para esta velha aqui.', 'cida');
      await say('* Dentro da cela, uma gata fantasma, translúcida, de olhos apertados.');
      await say('Dona Cida, muito prazer. Alma número sete. Eu ia na feira de segunda, sabe? Sentava no banco preferencial.', 'cida');
      await say('Do ônibus 31?!', 'me');
      await say('Do 31. Daí acordei gata. Gata FANTASMA. Na minha idade.', 'cida');
      await say('Me arrastaram pelas muralhas e eu perdi meus óculos. Sem óculos eu não sei nem se vocês são gente boa.', 'cida');
      if (!f.oculos) { await say('Se acharem uns óculos dourados por aí, eu agradeço. Devem estar lá perto da muralha, na ala oeste.', 'cida'); return; }
    }
    if (f.oculos && !f.cidaDone) {
      f.cidaDone = true;
      await say('* Você passa os óculos pelas grades.');
      await say('Agora sim!| ...Ah. Você é a criatura do pastel! Da barraca da feira, toda segunda!', 'cida');
      if (lostPastel()) {
        await say('...Pastel?', 'me');
        await say('...O que é pastel?', 'me');
        await say('* Lume fica em silêncio. A luz dela treme.');
        await say('Era uma comida, baú. Você gostava muito.', 'lume');
        await say('Ah, meu bem. Então já começaram a levar as suas lembranças também.', 'cida');
      } else {
        await say('Era eu! Sempre de pastel. Eu deixava cair farelo no corredor.', 'me');
        await say('Deixava mesmo. Eu reclamava baixinho. Que saudade de reclamar baixinho.', 'cida');
      }
      await say('Tomem. Eu escondi isto embaixo da palha. Comida boa não se desperdiça, mesmo depois de morta.', 'cida');
      giveItem('pastel', 2); sfx('item');
      await say('* Você recebeu {y}Pastel Fantasma{/} ×2.');
      await say('E uma fofoca: atrás da parede de luz, lá nas muralhas, tem um cavaleiro que não é desta época. Ele fica chamando um nome. Parecia "Ofélia".', 'cida');
      await say('Eu fico aqui. Na cela é mais seguro, e a vista é boa. Vão, vão.', 'cida');
      return;
    }
    if (f.cidaDone) { await say(pickOne(['Cuidado com a Inquisidora. Ela tem cara de quem nunca comeu pastel.', 'Se encontrarem mais gente do 31, digam que a Cida mandou um beijo.', 'Brida é durona, mas trouxe palha nova pra minha cela ontem. Não conta pra ela que eu contei.']), 'cida'); return; }
    await say('Sem os óculos eu continuo cega, meu bem. Ala oeste das muralhas, lembra?', 'cida');
  },
  async caged() { await say(pickOne(['* Um monstro magro, enrolado no canto da cela. Ele não se mexe quando você passa.', '* Um cogumelo velho, sem esporos. Ele tosse baixinho e sorri.'])); },
  async bridaJ() {
    const f = G.flags, freed = ['free_pip', 'free_nina', 'free_tolo'].filter(k => f[k]).length;
    if (!f.metBridaJ) {
      f.metBridaJ = true;
      await say('* Capitã Brida, sem o penacho e sem a capa, vigia as celas com uma lança velha.');
      await say('Você de novo.', 'brida');
      await say('Me rebaixaram. Por sua causa. "Capitã que perde pra um baú vira carcereira."', 'brida');
      await say('E a Inquisidora prendeu os MEUS aprendizes por falharem em te capturar. Pip, Nina e Tolo. Eles têm quinze, dezesseis anos.', 'brida');
      await say('Estão nas celas do sul. Atrás do Carcereiro, aquela coisa feita de grades.', 'brida');
      await say('Eu não posso abrir. Os cadeados são rúnicos, só abrem com faísca. E se eu tocar, sou presa também.', 'brida');
      await say('Se você soltar os três... eu te ensino uma coisa. Uma coisa que a Guilda não ensina pra baú.', 'brida');
      return;
    }
    if (freed === 3 && !f.bridaQuest) {
      f.bridaQuest = true;
      await say('Os três estão a salvo. Eu vi eles passando pelo pátio, correndo como ratos assustados.', 'brida');
      await say('...Obrigada, baú. Isso não sai daqui.', 'brida');
      await say('Agora presta atenção. Abaixa a tampa. Mais. Ombro firme. Isso é o Escudo da Guilda.', 'brida');
      G.tech = G.tech || []; if (!G.tech.includes('escudo')) G.tech.push('escudo'); sfx('rune');
      await say(`[Técnica aprendida: {y}Escudo da Guilda{/}. ${TECH.escudo.desc}]`, 'cat');
      await say('E isto aqui. Achei no bolso de um invocado. Não sei o que é, mas brilha como você.', 'brida');
      G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
      await say('Não pense que somos amigos.', 'brida');
      await say('Ela gosta de você.', 'lume');
      await say('Eu ouvi isso, luminária.', 'brida');
      return;
    }
    if (f.bridaQuest) { await say(pickOne(['A Inquisidora fica no Scriptorium, ao norte do pátio. Tem uma névoa na porta. Precisa de vento.', 'Se a Maren te pegar, não grita. Ela gosta quando gritam.', 'Vai logo, baú. Antes que eu mude de ideia.']), 'brida'); return; }
    await say(`Faltam ${3 - freed}. Os cadeados abrem com faísca. Anda.`, 'brida');
  },
  async apprentice(e) {
    const flag = 'free_' + e.id;
    if (G.flags[flag]) return;
    if (!G.flags.jailerDone) { await say('* Um aprendiz assustado, atrás das grades. Ele aponta para o Carcereiro, apavorado.'); return; }
    await say(`* ${e.name}, um aprendiz da Guilda, olha para você através das grades. O cadeado tem uma runa amarela.`);
    const tmp = { flag, need: { el: 'faisca' }, look: 'machine' };
    G.flags.tut_seal = true;
    await useSeal(tmp);
    if (G.flags[flag]) { await say(pickOne(['Um... um baú me salvou? Ninguém vai acreditar nisso.', 'Obrigado! A capitã falou que você viria. Eu não acreditei.', 'Eu juro que nunca mais abro um baú na vida.']), 'pip'); await say(`* ${e.name} corre para fora, em direção ao pátio.`); }
  },
  async jailer() {
    if (G.flags.jailerDone) return;
    if (!G.flags.jailerSeen) {
      G.flags.jailerSeen = true; shake(30); sfx('rumble');
      await say('* Algo enorme se desdobra das grades do corredor. Um guarda feito de celas velhas e cadeados.');
      await say('PRISIONEIRO... FORA... DA CELA.', 'jailer');
      await say('CONTAGEM: UM BAÚ. UM LUSTRE. CELAS DISPONÍVEIS: MUITAS.', 'jailer');
      await say('Eu não caibo numa cela! Eu sou um LUSTRE!', 'lume');
    } else await say('* O Carcereiro tilinta e se levanta de novo.');
    const r = await battle(['jailer'], { boss: true, music: 'boss', noFlee: true, intro: '* O Carcereiro de Ferro-Velho fecha o corredor!' });
    if (r !== 'win') return;
    G.flags.jailerDone = true; refreshEnts();
    await say('* O Carcereiro desmonta em barras, molas e cadeados. Do meio dos destroços, rola um molho de chaves.');
    await say('* As chaves abrem a passagem para o arquivo de runas, no fundo das celas do sul.');
    await checkEvo();
  },
  async knight() {
    if (G.flags.knightDone) return;
    await say('* Uma armadura antiga, de outro século, ajoelhada no chão da sala. Ela levanta a cabeça devagar.');
    await say('...Quem... me chama...? Eu estava... protegendo... alguém.', 'knight');
    await say('Uma... bibliotecária. Ela me pediu para guardar a porta. Faz... quanto tempo?', 'knight');
    const c = await choose('* O Cavaleiro ergue a lança. Lutar? (Chefe opcional muito forte.)', ['Lutar', 'Voltar depois'], 'n', 1);
    if (c !== 0) return;
    const r = await battle(['knight'], { boss: true, music: 'boss3', noFlee: false, intro: '* O Cavaleiro Sem Nome se levanta!' });
    if (r !== 'win') return;
    G.flags.knightDone = true; refreshEnts();
    await say('* A armadura cai de joelhos. Antes de se desfazer em ferrugem, ela sussurra um nome.');
    await say('...Ofélia...| me desculpa... eu dormi...', 'knight');
    await say('* No lugar dela, ficam um tinteiro de âmbar e uma fita de biblioteca, desbotada.');
    giveItem('eter', 2); giveItem('pastel', 1); G.flags.knightRibbon = true; sfx('item');
    await say('* Você recebeu {y}Éter de Lustre{/} ×2, {y}Pastel Fantasma{/} e a {y}Fita da Bibliotecária{/}.');
    await say('Ofélia... tinha um cavaleiro?', 'me');
    await say('Acho que a gente não conhece a Ofélia tão bem quanto pensa.', 'lume');
    await checkEvo();
  },
  async maren() {
    if (G.flags.marenDone) return;
    if (!G.flags.marenSeen) {
      G.flags.marenSeen = true;
      await say('* No topo do Scriptorium, uma figura translúcida escreve sem parar, presa por correntes que atravessam o próprio corpo.');
      await say('* Ao lado dela, uma mulher de chapéu alto lê cada linha em voz alta.');
      await say('Então o famoso baú chegou. A alma trinta e um.', 'maren');
      await say('Inquisidora Maren, de Auren. Sabe o que é isto?', 'maren');
      await say('A criatura que escreve o Catálogo. Eu a acorrentei. Tudo o que a masmorra come, ela anota. Tudo o que ela anota, eu leio.', 'maren');
      await say('Com isso, Auren vai achar o coração da masmorra. E destruí-lo.', 'maren');
      await say('E a Lume? Ela tá sumindo!', 'me');
      await say('Quanto mais eu forço a pena, mais rápido a masmorra come. Efeitos colaterais. Sacrifícios aceitáveis.', 'maren');
      await say('Eu NÃO sou aceitável.', 'lume');
      await say('Você é uma nota de rodapé, querida.', 'maren');
    } else await say('Voltou para mais uma página?', 'maren');
    const r = await battle(['maren'], { boss: true, music: 'boss3', noFlee: true, intro: '* A Inquisidora Maren fecha o livro e abre as mãos!' });
    if (r !== 'win') return;
    G.flags.marenDone = true;
    await STORY.bridaFall();
  },
  async bridaFall() {
    playMusic(null);
    await say('* Maren cai de joelhos. O chapéu rola pelo chão.');
    await say('...Se eu cair... levo o registro doze comigo.', 'maren');
    shake(30); sfx('rumble');
    await say('* Ela ergue a mão. Letras de tinta preta saltam do livro e voam direto para a Lume.');
    await say('Baú—', 'lume');
    await wait(30);
    await say('* Um escudo velho atravessa o caminho.');
    await say('Hoje não.', 'brida');
    playMusic('perda');
    await say('* As letras acertam a Capitã Brida no peito.| Elas não ferem.| Elas LEEM.');
    await say('* A armadura dela começa a se desfazer em palavras, uma por uma, como uma história sendo apagada de trás pra frente.');
    if (G.flags.bridaQuest) await say('Você soltou os meus meninos, baú. Eu fiquei te devendo.| Agora a gente tá quite.', 'brida');
    else await say('Eu ia esperar você soltar os meus meninos pra te dever alguma coisa.| Fica pra próxima, baú.', 'brida');
    await say('Cuida deles. E da luminária.', 'brida');
    await say('...Lustre.', 'lume');
    await say('...Lustre.| Pode me chamar de Brida.', 'brida');
    await wait(40);
    G.flags.bridaGone = true; G.flags.bridaArchived = true;
    sfx('catalog');
    await say('[Registro: Brida de Auren.|.|.| Arquivado.]', 'cat');
    await wait(60);
    await say('* Ninguém fala nada por um tempo.');
    await say('* Maren já não está mais lá. Só ficou o chapéu, e uma trilha de tinta indo para fora da sala.');
    await say('* As correntes do Escriba ainda o prendem. Elas estão rachadas.');
    await say('* (Fale com o Escriba.)');
  },
  async escriba() {
    if (!G.flags.marenDone) { await say('* A criatura escreve sem parar. Ela nem percebe você.'); return; }
    if (G.flags.ch3done) { await say('Desçam, alma trinta e um. A bibliotecária sabe o caminho.', 'escriba'); return; }
    await say('* Você morde as correntes. Elas estalam como gelo fino.');
    sfx('gate'); shake(16);
    await say('...Obrigado...| alma trinta e um.', 'escriba');
    await say('Vocês querem saber quem escreve o Catálogo.| Eu escrevo.| Mas eu não decido.', 'escriba');
    await say('Eu sou só a mão. Há séculos, copio o que me ditam lá de baixo.', 'escriba');
    await say('"Arquivar" é a palavra bonita que inventaram para "digerir".| A masmorra come as almas.| Eu anoto o que sobra.', 'escriba');
    await say('Então a Brida...', 'me');
    await say('Está aqui.| Nas páginas.| Não do jeito que vocês gostariam.', 'escriba');
    await say('E eu? Eu ainda tô sumindo?', 'lume');
    G.flags.lumeFading = false;
    await say('Sem a corrente me forçando, a fome volta ao normal. Você fica, pequena luz.| Por enquanto.', 'escriba');
    await say('Se querem saber quem dita... desçam. Abaixo do primeiro andar existe um Arquivo que ninguém visita.', 'escriba');
    await say('A bibliotecária de vocês sabe o caminho.| Ela sempre soube.', 'escriba');
    await say('...Ofélia.', 'me');
    await wait(20);
    await say('* Lume pousa ao seu lado. A luz dela está firme de novo. Ela não faz nenhuma piada.');
    await say('Baú.| A gente vai descobrir quem fez isso com ela. Com todo mundo.', 'lume');
    await say('Vai.', 'me');
    await endScreen(3);
    G.flags.ch3done = true;
    saveGame();
  },
  async evolve3() {
    sfx('catalog');
    await say('[Condições de evolução atingidas: 4º grau.]', 'cat');
    await say('[Aviso: evoluções de 4º grau exigem PAGAMENTO.]', 'cat');
    await say('Pagamento? Com o quê? Eu sou um baú, eu não tenho bolso.', 'me');
    await say('[O pagamento é feito em memórias.]', 'cat');
    await say('...Baú, não precisa.', 'lume');
    const c = await choose('* Evoluir agora? (Uma lembrança da Terra será arquivada.)', ['Evoluir', 'Ainda não'], 'n', 1);
    if (c !== 0) { G.flags.evo3Wait = (G.flags.evo3Wait || 0) + 1; await say('* Você decide esperar. (Vencer outra batalha pergunta de novo.)'); return; }
    const pick = await evolveScreen();
    await say(`[Evolução concluída: {y}${SPECIES[pick].name.toUpperCase()}{/}.]`, 'cat');
    await say('[Memória arquivada: {y}o sabor do pastel{/}.]', 'cat');
    G.flags.mem_pastel = true;
    await say('...Espera.| Do que você estava falando agora há pouco? Sabor do quê?', 'me');
    await say('...Nada, baú. Deixa pra lá.', 'lume');
    await grantTechs(false);
  }
});
{ const _d = STORY.doorMsg; STORY.doorMsg = async e => e.msg === 'ch3' ? STORY.doorCh3() : _d(e); }
{ const _f = { escadaria3: 'escadaria3First', muralhas: 'muralhasFirst', patio: 'patioFirst', jaula: 'jaulaFirst', scriptorium: 'scriptoriumFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _es = endScreen; endScreen = function (ch) { if (ch !== 3) return _es(ch); playMusic('ending');
    const w = { type: 'end', t: 0, update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
      draw() { bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); const a = Math.min(1, this.t / 60);
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 96, 26, 48, 48); bx.globalAlpha = 1;
        txt('FIM DO CAPÍTULO 3', 120, 84, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
        txt('Quem Escreve o Catálogo', 120, 104, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Técnicas: ${(G.tech || []).length} · Páginas: ${G.flags.pages || 0}/5`, `Tempo: ${fmtTime(G.time)}`, 'Em memória de Brida de Auren'];
        L.forEach((l, i) => txt(l, 120, 128 + i * 12, { align: 'center', col: i === 3 ? '#8a8099' : '#ffffff', alpha: clamp((this.t - 40) / 40, 0, 1) }));
        txt('Próximo: Capítulo 4 — A Primeira Viagem', 120, 186, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
        if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' }); } };
    return openWin(w); }; }

// ---------- v1.6: runas consumíveis espalhadas por raridade e dificuldade da área ----------
// comuns no começo; incomuns a partir do Poço; raras em lugares escondidos ou no fim do Cap. 2 em diante; a épica só no Scriptorium.
[['galeria', 'cr_g1', 19, 3, 'dardo', 1],
 ['biblioteca', 'cr_b1', 16, 2, 'brasa', 1],
 ['poco', 'cr_p1', 20, 5, 'seiva', 1],
 ['antessala', 'cr_a1', 14, 4, 'geada', 1],
 ['patamar', 'cr_pt1', 12, 7, 'dardo', 2],
 ['mercado', 'cr_m1', 26, 2, 'brasa', 1],
 ['mercado', 'cr_m2', 2, 18, 'veu', 1],
 ['acampamento', 'cr_ac1', 1, 14, 'onda', 1],
 ['acampamento', 'cr_ac2', 17, 13, 'geada', 1],
 ['teatro', 'cr_t1', 18, 15, 'eco', 1],
 ['ponte', 'cr_po1', 11, 18, 'faisca', 1],
 ['ponte', 'cr_po2', 3, 22, 'seiva', 1],
 ['escadaria3', 'cr_e1', 10, 8, 'geada', 1],
 ['escadaria3', 'cr_e2', 9, 11, 'brasa', 1],
 ['muralhas', 'cr_w1', 25, 15, 'faisca', 1],
 ['muralhas', 'cr_w2', 2, 14, 'dardo', 2],
 ['muralhas', 'cr_w3', 25, 6, 'selo', 1],
 ['patio', 'cr_c1', 28, 3, 'onda', 1],
 ['patio', 'cr_c2', 1, 17, 'eco', 1],
 ['jaula', 'cr_j1', 16, 14, 'onda', 1],
 ['scriptorium', 'cr_s1', 18, 2, 'foco', 1],
 ['scriptorium', 'cr_s2', 1, 9, 'corrente', 1]].forEach(([m, id, x, y, rune, n]) => MAPS[m].ents.push({ id, kind: 'chest', x, y, rune, n }));
MAPS.jaula.ents.push({ id: 'r_dreno', kind: 'rune', x: 6, y: 14, rune: 'dreno' });
