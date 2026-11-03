// ================= PIXEL ART =================
const PAL = {
  k:'#120e1a', d:'#2a2638', m:'#4f4a66', l:'#9a93b0', w:'#f2ecdc',
  b:'#4a2a1c', n:'#7a4a2a', o:'#b87838', y:'#f0c040', r:'#c83838', p:'#e86890', f:'#f07830',
  G:'#2a5a3a', g:'#4a9a4a', v:'#8ac85a', B:'#1c3058', u:'#3a70c0', c:'#7ad0f0',
  P:'#3a2050', q:'#7a48b0', L:'#c0a0f0', s:'#d8c8a8'
};
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function spr(rows, map) {
  const h = rows.length, w = rows[0].length, c = mk(w, h), x = c.getContext('2d');
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    let ch = rows[j][i]; if (map && map[ch]) ch = map[ch];
    if (ch === '.' || ch === ' ') continue;
    x.fillStyle = PAL[ch] || ch; x.fillRect(i, j, 1, 1);
  }
  return c;
}
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0; h = (h ^ (h >> 13)) * 1274126177 >>> 0; return (h ^ (h >> 16)) >>> 0; }

const MIMIC = [
  "................",
  "..kkkkkkkkkkkk..",
  ".kloooooooooolk.",
  ".klnnnnnnnnnnlk.",
  ".konnnnnnnnnnok.",
  ".kbbbbbbbbbbbbk.",
  ".kwkwkwkwkwkwkk.",
  ".kkkyykkkkyykkk.",
  ".kkwkwkwkwkwkwk.",
  ".kbbbbbyybbbbbk.",
  ".klnnnnyynnnnlk.",
  ".konnnnnnnnnnok.",
  ".konnnnnnnnnnok.",
  ".klnnnnnnnnnnlk.",
  "..kkkkkkkkkkkk..",
  "................"];
const MIMIC_BLINK = MIMIC.map((r, i) => i === 7 ? ".kkkkkkkkkkkkkk." : r);
const MIMIC_OPEN = [
  "..kkkkkkkkkkkk..",
  ".kloooooooooolk.",
  ".klnnnnnnnnnnlk.",
  ".kbbbbbbbbbbbbk.",
  ".kwkwkwkwkwkwkk.",
  ".kkkyykkkkyykkk.",
  ".kkkkkkkkkkkkkk.",
  ".kkkkpppppkkkkk.",
  ".kkwkwkwkwkwkwk.",
  ".kbbbbbyybbbbbk.",
  ".klnnnnyynnnnlk.",
  ".konnnnnnnnnnok.",
  ".konnnnnnnnnnok.",
  ".klnnnnnnnnnnlk.",
  "..kkkkkkkkkkkk..",
  "................"];
const RECOLOR = {
  base: null,
  ferro: { o: 'l', n: 'm', b: 'd', l: 'y' },
  arcano: { o: 'L', n: 'q', b: 'P', l: 'c', y: 'c' },
  fortaleza: { o: 'm', n: 'd', b: 'k', l: 'y' },
  espinho: { o: 'l', n: 'm', b: 'd', l: 'r', y: 'f' },
  grimorio: { o: 'w', n: 's', b: 'q', l: 'P', y: 'p' },
  estelar: { o: 'u', n: 'B', b: 'k', l: 'c', y: 'w' }
};
const SIDE = [
  "................",
  "...kkkkkkkkkk...",
  "..kmoooooooooook",
  "..kmnnnnnnnnnnk.",
  "..kmnnnnnnnnnnk.",
  "..kbbbbbbbbbbbk.",
  "..kkkkkkkkwkwkw.",
  "..kkkkkkkkkyykk.",
  "..kkkkkkkkkwkwk.",
  "..kbbbbbbbbbbbk.",
  "..kmnnnnnnnnnnk.",
  "..konnnnnnnnnnk.",
  "..konnnnnnnnnnk.",
  "..kmnnnnnnnnnnk.",
  "...kkkkkkkkkkk..",
  "................"];
const SIDE_OPEN = [
  "...kkkkkkkkkk...", "..kmoooooooooook", "..kmnnnnnnnnnnk.", "..kmnnnnnnnnnnk.", "..kbbbbbbbbbbbk.",
  "..kkkkkkkkwkwkw.", "..kkkkkkkkkyykk.", "..kkkkkkkkkpppp.", "..kkkkkkkkkwkwk.",
  "..kbbbbbbbbbbbk.", "..kmnnnnnnnnnnk.", "..konnnnnnnnnnk.", "..konnnnnnnnnnk.", "..kmnnnnnnnnnnk.", "...kkkkkkkkkkk..", "....kk......kk.."];
const SIDE_STEP_A = SIDE.map((r, i) => i === 15 ? "....kk.....kk..." : r);
const SIDE_STEP_B = SIDE.map((r, i) => i === 15 ? "......kk.kk....." : r);
const SIDE_BLINK = SIDE.map((r, i) => i === 7 ? "..kkkkkkkkkkkkk." : r);
// [parado, piscando, boca aberta, passo A, passo B, pulo com boca aberta]
const SIDE_FRAMES = [SIDE, SIDE_BLINK, SIDE_OPEN, SIDE_STEP_A, SIDE_STEP_B, SIDE_OPEN];
function flipH(c) { const o = mk(c.width, c.height), x = o.getContext('2d'); x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(c, 0, 0); return o; }
function makeMimicSet(key, map) {
  SP[key] = [spr(MIMIC, map), spr(MIMIC_BLINK, map), spr(MIMIC_OPEN, map)];
  const eyes = (rows, r, row) => rows.map((x, i) => i === r ? row : x);
  const L = '.kkyykkkkyykkkk.', R = '.kkkkyykkkkyykk.';
  SPD[key] = {
    down: SP[key],
    right: SIDE_FRAMES.map(f => spr(f, map)),
    left: SIDE_FRAMES.map(f => flipH(spr(f, map))),
    up: [spr(MIMIC_BACK, map), spr(MIMIC_BACK, map), spr(MIMIC_BACK_OPEN, map)]
  };
}
const OFELIA = [
  "......kkkk......",
  ".....kLLLLk.....",
  "....kkkkkkkk....",
  "...kwwwwwwwwk...",
  "..kwwwwwwwwwwk..",
  "..kwyyywwyyywk..",
  "..kwykywwykywk..",
  "..kwyyywwyyywk..",
  "..kwwwwwwwwwwk..",
  "..kwwwwkkwwwwk..",
  "..kLwwwwwwwwLk..",
  "..kLLwwwwwwLLk..",
  "..kLLLLLLLLLLk..",
  "..kLkLLkLLkLLk..",
  "...k.kk.kk.kk...",
  "................"];
const RAT = [
  "...........y....",
  "..........yfy...",
  "..........kyk...",
  "..........kwk...",
  "...kk.....kwk...",
  "..kpmk..kkkwkk..",
  "..kmmmkkmmmmmmk.",
  ".kmmkmmmmmmmmmmk",
  "kpmmmmmmmmmmmmmk",
  ".kkmmmmmmmmmmmkk",
  "..kmmmmmmmmmmk.k",
  "...kkmkkkkmkk.k.",
  "....k.......kk..",
  "................",
  "................",
  "................"];
const MUSH = [
  "................",
  ".....kkkkkk.....",
  "...kkrrrrrrkk...",
  "..krrwwrrrrwrk..",
  ".krrwwrrrrrrrrk.",
  ".krrrrrrwwrrrrk.",
  "krrwrrrrwwrrrwrk",
  "kkkkkkkkkkkkkkkk",
  "....kssssssk....",
  "....kskssksk....",
  "....kssssssk....",
  "....ksskksskk...",
  "....kssssssk....",
  "...kssssssssk...",
  "...kkkkkkkkkk...",
  "................"].map(r => r.slice(0, 16));
const BAT = [
  "................",
  "................",
  "kk............kk",
  "klk..........klk",
  "kwlk...kk...klwk",
  "kwwlk.kwwk.klwwk",
  "kwwwlkwwwwklwwwk",
  "kwwwwkwrwrkwwwwk",
  ".kwwwkwwwwkwwwk.",
  "..kwwkwwwwkwwk..",
  "...kwwkwwkwwk...",
  "....kwkkkkwk....",
  ".....k....k.....",
  "................",
  "................",
  "................"];
const BAT2 = [
  "................",
  "................",
  "................",
  "................",
  "......kkkk......",
  ".kkkkkwwwwkkkkk.",
  "kwwwwkwrwrkwwwwk",
  "klwwwkwwwwkwwwlk",
  ".kllwkwwwwkwllk.",
  "..kkkwkwwkwkkk..",
  ".....kwkkwk.....",
  "......k..k......",
  "................",
  "................",
  "................",
  "................"];
const SLIME = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "......kkkk......",
  "....kkBBBBkk....",
  "...kBBuuBBBBk...",
  "..kBBucBBBBBBk..",
  "..kBBBBBBBBBBk..",
  ".kBBwkBBBBwkBBk.",
  ".kBBkkBBBBkkBBk.",
  "kBBBBBBkkBBBBBBk",
  "kBBBBBBBBBBBBBBk",
  ".kkkkkkkkkkkkkk."];
const SLIME2 = ["................", "................", "................", "................", "................", "................", "................",
  "......kkkk......", "...kkkBBBBkkk...", "..kBBuuBBBBBBk..", ".kBBucBBBBBBBBk.", ".kBBwkBBBBwkBBk.", ".kBBkkBBBBkkBBk.", "kBBBBBBkkBBBBBBk", "kBBBBBBBBBBBBBBk", ".kkkkkkkkkkkkkk."];

const SP = {}, SPD = {};
const MIMIC_BACK = [MIMIC[0], MIMIC[1], MIMIC[2], MIMIC[3], MIMIC[4], '.kbbmbbbbbbmbbk.', '.kkkkkkkkkkkkkk.', '.kbbbbbbbbbbbbk.',
  '.klnnnnnnnnnnlk.', '.konnnnnnnnnnok.', '.konnnnnnnnnnok.', '.konnnnnnnnnnok.', '.konnnnnnnnnnok.', '.klnnnnnnnnnnlk.', MIMIC[14], MIMIC[15]];
const MIMIC_BACK_OPEN = [MIMIC[1], MIMIC[2], MIMIC[3], MIMIC[4], '.kbbmbbbbbbmbbk.', '.kkkkkkkkkkkkkk.', '.kkkkkkkkkkkkkk.', ...MIMIC_BACK.slice(7)];
function buildSprites() {
  for (const [k, map] of Object.entries(RECOLOR)) {
    const key = { base: 'mimic', ferro: 'mimicIron', arcano: 'mimicArc', fortaleza: 'mimicFort', espinho: 'mimicSpike', grimorio: 'mimicBook', estelar: 'mimicStar' }[k];
    makeMimicSet(key, map);
  }
  // detalhes extras das evoluções
  const deco = (key, fn) => { const all = new Set([...SP[key], ...Object.values(SPD[key]).flat()]); for (const c of all) fn(c.getContext('2d')); };
  deco('mimicFort', x => { x.fillStyle = PAL.y; for (const [i, j] of [[3, 3], [12, 3], [3, 12], [12, 12]]) x.fillRect(i, j, 1, 1); x.fillStyle = PAL.l; x.fillRect(1, 0, 14, 1); x.fillStyle = PAL.k; x.fillRect(0, 0, 1, 2); x.fillRect(15, 0, 1, 2); });
  deco('mimicSpike', x => { x.fillStyle = PAL.k; for (const i of [3, 6, 9, 12]) { x.fillRect(i, 0, 1, 1); } x.fillStyle = PAL.w; for (const i of [3, 6, 9, 12]) x.fillRect(i, 1, 1, 1); x.fillStyle = PAL.l; x.fillRect(0, 9, 1, 1); x.fillRect(15, 9, 1, 1); x.fillRect(0, 12, 1, 1); x.fillRect(15, 12, 1, 1); });
  deco('mimicBook', x => { x.fillStyle = PAL.k; for (let j = 2; j < 5; j++) x.fillRect(4 + j, j, 5, 1); x.fillStyle = '#d0c0a0'; x.fillRect(3, 11, 10, 1); x.fillRect(3, 13, 10, 1); x.fillStyle = PAL.q; x.fillRect(7, 1, 2, 1); });
  deco('mimicStar', x => { x.fillStyle = PAL.y; for (const [i, j] of [[4, 3], [10, 2], [12, 4], [5, 11], [10, 12], [7, 3]]) x.fillRect(i, j, 1, 1); x.fillStyle = PAL.w; x.fillRect(8, 11, 1, 1); });
  { const c = SP.mimicIron; for (const s of c) { const x = s.getContext('2d'); x.fillStyle = PAL.l; x.fillRect(2, 1, 1, 1); x.fillRect(13, 1, 1, 1); x.fillStyle = PAL.k; x.fillRect(2, 0, 1, 1); x.fillRect(13, 0, 1, 1); x.fillStyle = PAL.y; x.fillRect(7, 12, 2, 1); } }
  { const c = SP.mimicArc; for (const s of c) { const x = s.getContext('2d'); x.fillStyle = PAL.c; x.fillRect(4, 3, 1, 1); x.fillRect(7, 2, 2, 1); x.fillRect(11, 3, 1, 1); x.fillRect(4, 11, 1, 2); x.fillRect(11, 11, 1, 2); } }
  SP.ofelia = [spr(OFELIA)];
  SP.rat = [spr(RAT), spr(RAT.map((r, i) => i === 0 ? "..........y....." : i === 1 ? ".........yfy...." : r))];
  SP.mush = [spr(MUSH), spr(MUSH.map((r, i) => i === 9 ? "....kkkkkkkk...." : r))];
  SP.bat = [spr(BAT), spr(BAT2)];
  SP.slime = [spr(SLIME), spr(SLIME2)];
  SP.boss = [makeGolem(false, 0), makeGolem(false, 1)];
  SP.bossStone = [makeGolem(true, 0), makeGolem(true, 1)];
  SP.lantern = [makeLantern(0), makeLantern(1)];
  SP.chest = [makeChest(false), makeChest(true)];
  SP.pedestal = [makePedestal()];
  buildSprites2();
}

function makeGolem(burned, frame) {
  const c = mk(32, 32), x = c.getContext('2d'), R = rng(77);
  const px = (i, j, col) => { x.fillStyle = col; x.fillRect(i, j, 1, 1); };
  const inBody = (i, j) => ((i - 16) / 12) ** 2 + ((j - 18) / 11.5) ** 2 <= 1;
  const armL = (i, j) => i >= 1 && i <= 6 && j >= 15 + frame && j <= 27 + frame && !(i === 1 && (j === 15 + frame || j === 27 + frame));
  const armR = (i, j) => i >= 25 && i <= 30 && j >= 15 + frame && j <= 27 + frame && !(i === 30 && (j === 15 + frame || j === 27 + frame));
  const solid = (i, j) => inBody(i, j) || armL(i, j) || armR(i, j);
  for (let j = 0; j < 32; j++) for (let i = 0; i < 32; i++) {
    if (!solid(i, j)) { if (solid(i + 1, j) || solid(i - 1, j) || solid(i, j + 1) || solid(i, j - 1)) px(i, j, PAL.k); continue; }
    const n = hash(i, j, 3) % 100;
    let col = '#5d566e';
    if (i + j < 26) col = '#78708c';
    if (i - j > 6 || j > 24) col = '#433d52';
    if (n < 8) col = '#352f42';
    if (armL(i, j) || armR(i, j)) col = j > 23 + frame ? '#433d52' : '#5d566e';
    px(i, j, col);
  }
  // olhos
  for (const ex of [10, 19]) { px(ex, 15, '#f0c040'); px(ex + 1, 15, '#fff6c0'); px(ex + 2, 15, '#f0c040'); px(ex, 16, '#a07020'); px(ex + 1, 16, '#f0c040'); px(ex + 2, 16, '#a07020'); }
  // runa rachada no peito
  const crack = [[16, 20], [15, 21], [16, 22], [17, 23], [16, 24], [15, 25]];
  for (const [i, j] of crack) px(i, j, burned ? '#ff9a50' : '#9cf07a');
  if (!burned) {
    for (let j = 4; j < 22; j++) for (let i = 2; i < 30; i++) {
      if (!solid(i, j)) continue;
      const lim = 13 + Math.sin(i * 0.9) * 2 + (hash(i, 0, 9) % 3);
      if (j < lim) { const n = hash(i, j, 5) % 10; px(i, j, n < 3 ? PAL.v : n < 7 ? PAL.g : PAL.G); }
    }
    for (const sx of [5, 9, 22, 26]) { const len = 3 + hash(sx, 1) % 5; for (let j = 0; j < len; j++) px(sx, 12 + j + frame, j === len - 1 ? PAL.v : PAL.g); }
    px(14, 6, '#e86890'); px(20, 8, '#f0c040'); px(8, 10, '#e86890');
  } else {
    for (let n = 0; n < 14; n++) { const i = 6 + Math.floor(R() * 20), j = 8 + Math.floor(R() * 8); if (solid(i, j)) px(i, j, R() < .5 ? '#2a2430' : '#6a3a2a'); }
  }
  return c;
}
function makeLantern(f) {
  const c = mk(16, 16), x = c.getContext('2d');
  const r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  r(7, 8, 2, 8, PAL.k); r(5, 14, 6, 2, PAL.k); r(6, 14, 4, 1, PAL.m);
  r(4, 1, 8, 9, PAL.k); r(5, 0, 6, 1, PAL.k); r(5, 2, 6, 7, f ? '#ffd27a' : '#f2b544'); r(6, 3, 4, 5, f ? '#fff2c0' : '#ffd27a');
  r(4, 5, 8, 1, PAL.k); r(7, 2, 2, 7, PAL.k);
  r(7, 4, 2, 2, f ? '#ffffff' : '#fff2c0');
  return c;
}
function makeChest(open) {
  const c = mk(16, 16), x = c.getContext('2d');
  const r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  if (!open) {
    r(2, 5, 12, 10, PAL.k); r(3, 6, 10, 3, PAL.o); r(3, 9, 10, 1, PAL.b); r(3, 10, 10, 4, PAL.n); r(7, 8, 2, 3, PAL.y); r(3, 6, 1, 8, PAL.l); r(12, 6, 1, 8, PAL.l);
  } else {
    r(2, 3, 12, 4, PAL.k); r(3, 4, 10, 2, PAL.n); r(2, 8, 12, 7, PAL.k); r(3, 9, 10, 1, '#1a1020'); r(3, 10, 10, 4, PAL.n); r(3, 9, 1, 5, PAL.l); r(12, 9, 1, 5, PAL.l);
  }
  return c;
}
function makePedestal() {
  const c = mk(16, 16), x = c.getContext('2d');
  const r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  r(3, 9, 10, 7, PAL.k); r(4, 10, 8, 5, '#5d566e'); r(4, 10, 8, 1, '#78708c'); r(2, 14, 12, 2, PAL.k); r(3, 14, 10, 1, '#433d52');
  r(6, 11, 4, 3, '#433d52');
  return c;
}

// ---------- TILES (procedurais) ----------
const TILE = {};
function tileCanvas(fn, seed) { const c = mk(16, 16), x = c.getContext('2d'); fn(x, rng(seed)); return c; }
function px(x, i, j, col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); }
function floorPaint(x, R, base = '#2b2535', speck = '#342c41', dark = '#211b2b') {
  x.fillStyle = base; x.fillRect(0, 0, 16, 16);
  for (let n = 0; n < 14; n++) px(x, R() * 16 | 0, R() * 16 | 0, speck);
  for (let n = 0; n < 6; n++) px(x, R() * 16 | 0, R() * 16 | 0, dark);
  if (R() < .35) { let i = R() * 12 | 0, j = R() * 12 | 0; for (let s = 0; s < 5; s++) { px(x, i, j, dark); i += R() < .5 ? 1 : 0; j += 1; } }
}
function buildTiles(theme) {
  const T = theme || {};
  buildTiles2(T);
  const base = T.floor || '#2b2535', speck = T.speck || '#342c41', dark = T.dark || '#211b2b';
  for (let v = 0; v < 4; v++) TILE['.' + v] = tileCanvas((x, R) => floorPaint(x, R, base, speck, dark), 11 + v * 7);
  for (let v = 0; v < 2; v++) TILE[',' + v] = tileCanvas((x, R) => {
    floorPaint(x, R, base, speck, dark);
    for (let n = 0; n < 26; n++) { const i = R() * 16 | 0, j = R() * 16 | 0; px(x, i, j, R() < .5 ? '#2f5a36' : '#3c7240'); }
    for (let n = 0; n < 4; n++) px(x, R() * 16 | 0, R() * 16 | 0, '#6aa84e');
  }, 40 + v);
  TILE['g'] = tileCanvas((x, R) => {
    floorPaint(x, R, base, speck, dark);
    for (const [i, j] of [[3, 9], [9, 5], [12, 11]]) { px(x, i, j + 2, '#a8d8e8'); px(x, i, j + 1, '#a8d8e8'); px(x, i - 1, j, '#7ad0f0'); px(x, i, j, '#bff0ff'); px(x, i + 1, j, '#7ad0f0'); }
  }, 51);
  TILE['face'] = tileCanvas((x, R) => {
    x.fillStyle = T.wall || '#3d3550'; x.fillRect(0, 0, 16, 16);
    x.fillStyle = T.mortar || '#231d30';
    for (let j = 0; j < 16; j += 4) { x.fillRect(0, j + 3, 16, 1); const off = (j / 4) % 2 ? 4 : 0; for (let i = off; i < 16; i += 8) x.fillRect(i, j, 1, 3); }
    x.fillStyle = T.wallHi || '#564b6e'; for (let j = 0; j < 16; j += 4) for (let i = 0; i < 16; i++) if (R() < .3) x.fillRect(i, j, 1, 1);
    x.fillStyle = '#1a1524'; x.fillRect(0, 15, 16, 1);
  }, 61);
  TILE['top'] = tileCanvas((x, R) => { x.fillStyle = '#1a1524'; x.fillRect(0, 0, 16, 16); for (let n = 0; n < 10; n++) px(x, R() * 16 | 0, R() * 16 | 0, '#221b2e'); }, 62);
  TILE['topEdge'] = tileCanvas((x, R) => { x.fillStyle = '#1a1524'; x.fillRect(0, 0, 16, 16); x.fillStyle = T.wallHi || '#564b6e'; x.fillRect(0, 14, 16, 2); x.fillStyle = '#1a1524'; for (let i = 0; i < 16; i++) if (R() < .3) x.fillRect(i, 14, 1, 1); }, 63);
  for (let f = 0; f < 2; f++) TILE['~' + f] = tileCanvas((x, R) => {
    x.fillStyle = '#121f36'; x.fillRect(0, 0, 16, 16);
    x.fillStyle = '#1d3458';
    for (let j = 2; j < 16; j += 5) for (let i = 0; i < 16; i++) { const yy = j + Math.round(Math.sin((i + f * 4 + j) * 0.7)); if ((i + j) % 6 < 3) x.fillRect(i, yy, 1, 1); }
    x.fillStyle = '#3a6a9a'; px(x, (5 + f * 6) % 16, 4 + f * 6, '#3a6a9a'); px(x, (11 + f * 3) % 16, 12 - f * 4, '#3a6a9a');
  }, 70 + f);
  TILE['B'] = tileCanvas((x, R) => {
    x.fillStyle = '#3a2016'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#5a3420'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 7, 16, 1); x.fillRect(0, 15, 16, 1);
    const cols = ['#8a3a3a', '#3a5a8a', '#4a7a4a', '#6a4a8a', '#a88a3a', '#7a6a5a'];
    for (const row of [1, 8]) { let i = 1; while (i < 15) { const w = 1 + (R() * 2 | 0), h = 5 + (R() * 2 | 0) - 1; x.fillStyle = cols[R() * cols.length | 0]; x.fillRect(i, row + (6 - h), w, h); i += w + (R() < .2 ? 1 : 0); } }
    x.fillStyle = '#1a0e0a'; x.fillRect(0, 0, 1, 16); x.fillRect(15, 0, 1, 16);
  }, 80);
  TILE['c'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(6, 6, 4, 9); x.fillStyle = '#e8dcc0'; x.fillRect(7, 7, 2, 7); x.fillStyle = '#c8b898'; x.fillRect(8, 7, 1, 7); x.fillStyle = '#5a4a3a'; x.fillRect(5, 14, 6, 1); }, 90);
  TILE['x'] = tileCanvas((x, R) => {
    floorPaint(x, R, base, speck, dark);
    x.fillStyle = PAL.k; x.fillRect(2, 6, 12, 9); x.fillStyle = '#1a1020'; x.fillRect(3, 7, 10, 3); x.fillStyle = PAL.n; x.fillRect(3, 10, 10, 4); x.fillStyle = PAL.b; x.fillRect(5, 10, 1, 4); x.fillRect(10, 10, 1, 4);
    x.fillStyle = PAL.o; x.fillRect(1, 4, 5, 2); x.fillRect(9, 3, 2, 4); x.fillStyle = PAL.k; x.fillRect(12, 4, 3, 1);
  }, 91);
  TILE['r'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); for (const [i, j, w, h] of [[2, 8, 6, 5], [8, 6, 6, 7], [5, 11, 5, 4]]) { x.fillStyle = PAL.k; x.fillRect(i, j, w, h); x.fillStyle = '#5d566e'; x.fillRect(i + 1, j + 1, w - 2, h - 2); x.fillStyle = '#78708c'; x.fillRect(i + 1, j + 1, w - 2, 1); } }, 92);
  TILE['^'] = tileCanvas((x, R) => { for (let s = 0; s < 4; s++) { x.fillStyle = ['#151020', '#251d32', '#352b46', '#4a3e5e'][s]; x.fillRect(0, s * 4, 16, 4); x.fillStyle = '#100c17'; x.fillRect(0, s * 4 + 3, 16, 1); } }, 93);
  TILE['G'] = tileCanvas((x, R) => {
    x.fillStyle = '#1a2a1a'; x.fillRect(0, 0, 16, 16);
    for (let i = 0; i < 16; i += 3) { x.fillStyle = R() < .5 ? '#4a3a22' : '#5a4428'; x.fillRect(i, 0, 2, 16); x.fillStyle = '#2a1e12'; x.fillRect(i + 2, 0, 1, 16); }
    for (let n = 0; n < 30; n++) px(x, R() * 16 | 0, R() * 16 | 0, R() < .5 ? '#3c7240' : '#6aa84e');
  }, 94);
  TILE['Gopen'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = '#4a3a22'; x.fillRect(0, 12, 3, 4); x.fillRect(13, 12, 3, 4); for (let n = 0; n < 8; n++) px(x, R() * 16 | 0, 12 + (R() * 4 | 0), '#3c7240'); }, 95);
}

// ================= CAPÍTULO 2: SPRITES =================
const CRAB = ["................", "................", "..kk........kk..", ".knnk......knnk.", ".knok.k..k.konk.", "..kk..w..w..kk..", "...k.kkkkkk.k...", "...kknnoonnkk...", "..knnnoooonnnk..", "..knonnnnnnonk..", "..knnnnnnnnnnk..", "...kkkkkkkkkk...", "..k.k.k..k.k.k..", ".k..k......k..k.", "................", "................"];
const CRAB2 = CRAB.map((r, i) => i === 3 ? ".knnk......knnk." : i === 4 ? "..kok.k..k.kok.." : i === 12 ? "...k.k.kk.k.k..." : i === 13 ? "..k..k....k..k.." : r);
const LAMP = ["................", ".......y........", "......yy....y...", "......yfy..yy...", ".....yffy.yfy...", ".....yfffyffy...", "....yffffffffy..", "...yffwwfwwffy..", "...yffkwfkwffy..", "...yfffffffffy..", "....yfffkkffy...", ".....yffffy.....", "......yyyy......", ".......yy.......", "................", "................"];
const LAMP2 = LAMP.map((r, i) => i === 1 ? "........y......." : i === 2 ? ".......yy..y...." : i === 3 ? "......yfy.yy...." : r);
const POLVO = ["................", "....kkkkkkkk....", "...krwrwrwrwk...", "..krwrwrwrwrwk..", "..kkkkkkkkkkkk..", "...kqqqqqqqqk...", "..kqqwkqqwkqqk..", "..kqqkkqqkkqqk..", "..kqqqqqqqqqqk..", "...kqqqppqqqk...", "..kqkqkqqkqkqk..", ".kqk.kqkkqk.kqk.", ".kk..kk..kk..kk.", "................", "................", "................"];
const POLVO2 = POLVO.map((r, i) => i === 11 ? "..kqk.kqqk.kqk.." : i === 12 ? "..kk..kk.kk..kk." : r);
const HUMAN = ["......kkkk......", ".....kmmmmk.....", "....kmllllmk....", "....kmmmmmmk....", "....khSSSShk....", "....kSkSSkSk....", ".....kSnnSk.....", "...kkGGGGGGkk...", "..kGGGGyyGGGGk..", "..kSGGGGGGGGSk..", "..kkGGnnnnGGkk..", "...kGGGGGGGGk...", "...kbbk..kbbk...", "...kbbk..kbbk...", "...kkkk..kkkk...", "................"];
// versão feminina: cabelo comprido caindo dos lados do rosto e por cima dos ombros
const HUMAN_F = HUMAN.map((r, i) => i === 4 ? "...khhSSSShhk..." : i === 5 ? "...khSkSSkShk..." : i === 6 ? "...khkSnnSkhk..." : i === 7 ? "..khkGGGGGGkhk.." : r);
PAL.S = '#e0a878'; PAL.h = '#4a2c1c';
// pessoa: pele (S), cabelo (h) e fem: true para usar a versão feminina
function hum(map = {}) { return spr(map.fem ? HUMAN_F : HUMAN, map); }
const HOUND = ["................", "................", "................", "................", "..kk............", ".kmmk...........", "kmmmmkkkkkkkk.k.", "kkmkmmmmmmmmmkk.", "kpmmmmmmmmmmmmk.", ".kkmmmmmmmmmmmk.", "..kmmrmmmmmmmk..", "..kmk...kmk.kmk.", "..kkk...kkk.kkk.", "................", "................", "................"];
const BRIDA = ["........rr......", ".......rr.......", ".....kkkkkk.....", "....kllllllk....", "....kkkkkkkk....", "....kskssksk....", "....kssrrssk....", ".....kssssk.....", "..kkkllllllkkk..", ".kyykllyyllkmmk.", ".kyyklllllllkmk.", ".kyykllllllkssk.", "..kkkbbbbbbkkk..", "....kbbk.kbbk...", "....kkkk.kkkk...", "................"];
const LUME = [".......kk.......", ".......yy.......", "..f....yy....f..", "..w..f.yy.f..w..", "..w..w.yy.w..w..", ".kyyyyyyyyyyyyk.", "..kyyykyykyyyk..", "...kyyyppyyyk...", "....kyyyyyyk....", "...c.kyyyyk.c...", "...c..kyyk..c...", "......c..c......", ".......cc.......", "................", "................", "................"];
const LUME2 = LUME.map((r, i) => i === 2 ? "..y....yy....y.." : i === 9 ? "..c..kyyyyk..c.." : i === 10 ? "..c...kyyk...c.." : r);
function buildSprites2() {
  SP.crab = [spr(CRAB), spr(CRAB2)];
  SP.lamp = [spr(LAMP), spr(LAMP2)];
  SP.lampBig = [spr(LAMP, { f: 'r', y: 'f' }), spr(LAMP2, { f: 'r', y: 'f' })];
  SP.polvo = [spr(POLVO), spr(POLVO2)];
  SP.octo = [spr(POLVO, { q: 'r', r: 'y', w: 'w' }), spr(POLVO2, { q: 'r', r: 'y' })];
  const hunter = hum({ S: '#d8a070', h: '#3a2418' }), hunter2 = hum({ S: '#d8a070', h: '#3a2418' });
  for (const c of [hunter, hunter2]) { const x = c.getContext('2d'); x.fillStyle = PAL.l; x.fillRect(14, 3, 1, 7); x.fillStyle = PAL.y; x.fillRect(13, 9, 3, 1); x.fillStyle = PAL.b; x.fillRect(14, 10, 1, 2); }
  hunter2.getContext('2d').clearRect(3, 12, 10, 3); { const x = hunter2.getContext('2d'); x.fillStyle = PAL.k; x.fillRect(3, 12, 4, 2); x.fillRect(9, 12, 4, 2); x.fillStyle = PAL.b; x.fillRect(4, 12, 2, 1); x.fillRect(10, 12, 2, 1); }
  SP.hunter = [hunter, hunter2];
  SP.vet = [hum({ G: 'u', m: 'd', l: 'm', S: '#a86a40', h: '#1a1410' }), hum({ G: 'u', m: 'd', l: 'm', S: '#a86a40', h: '#1a1410' })];
  for (const c of SP.vet) { const x = c.getContext('2d'); x.fillStyle = PAL.l; x.fillRect(14, 2, 1, 8); x.fillStyle = PAL.y; x.fillRect(13, 9, 3, 1); }
  const archer = (m) => { const c = hum(m); const x = c.getContext('2d'); x.fillStyle = PAL.n; for (let j = 4; j < 13; j++) x.fillRect(j < 6 || j > 10 ? 2 : 1, j, 1, 1); x.fillStyle = PAL.w; x.fillRect(3, 5, 1, 7); return c; };
  SP.archer = [archer({ m: 'G', l: 'g', G: 'n', fem: true, S: '#f0c8a0', h: '#c86a30' }), archer({ m: 'G', l: 'g', G: 'n', fem: true, S: '#f0c8a0', h: '#c86a30' })];
  SP.archerVet = [archer({ m: 'P', l: 'q', G: 'B', fem: true, S: '#8a5a3a', h: '#1a1410' }), archer({ m: 'P', l: 'q', G: 'B', fem: true, S: '#8a5a3a', h: '#1a1410' })];
  SP.hound = [spr(HOUND), spr(HOUND.map((r, i) => i === 11 ? "..kmk..kmk..kmk." : i === 12 ? "..kkk..kkk..kkk." : r))];
  SP.brida = [spr(BRIDA, { s: '#d8a070' }), spr(BRIDA.map((r, i) => i === 0 ? ".........rr....." : i === 1 ? "........rr......" : r), { s: '#d8a070' })];
  SP.lume = [spr(LUME), spr(LUME2)];
  SP.door = [makeDoor(false), makeDoor(true)];
}
function makeDoor(dark) {
  const c = mk(16, 16), x = c.getContext('2d');
  if (dark) { x.fillStyle = '#05030a'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#2a2236'; x.fillRect(0, 0, 16, 2); x.fillRect(0, 0, 2, 16); x.fillRect(14, 0, 2, 16); return c; }
  x.fillStyle = PAL.k; x.fillRect(0, 0, 16, 16); x.fillStyle = '#5a3420'; x.fillRect(1, 1, 14, 15); x.fillStyle = '#4a2a1c'; for (let i = 3; i < 16; i += 4) x.fillRect(i, 1, 1, 15);
  x.fillStyle = PAL.m; x.fillRect(1, 4, 14, 2); x.fillRect(1, 11, 14, 2); x.fillStyle = PAL.y; x.fillRect(11, 7, 2, 3);
  return c;
}
function buildTiles2(T) {
  const base = T.floor || '#2b2535', speck = T.speck || '#342c41', dark = T.dark || '#211b2b';
  TILE['w'] = tileCanvas((x, R) => { x.fillStyle = '#5a3a24'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#3e2618'; for (let j = 3; j < 16; j += 4) x.fillRect(0, j, 16, 1); x.fillStyle = '#6e4a30'; for (let j = 0; j < 16; j += 4) for (let i = 0; i < 16; i++) if (R() < .25) x.fillRect(i, j, 1, 1); x.fillStyle = '#2a1a10'; x.fillRect((R() * 14 | 0) + 1, 1, 1, 1); x.fillRect((R() * 14 | 0) + 1, 9, 1, 1); }, 120);
  TILE['T'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); for (let i = 0; i < 16; i++) { x.fillStyle = (i >> 2) % 2 ? '#e8dcc0' : '#b83a3a'; x.fillRect(i, 0, 1, 7 + (i % 4 === 1 || i % 4 === 2 ? 1 : 0)); } x.fillStyle = PAL.k; x.fillRect(0, 8, 16, 1); x.fillStyle = '#4a2a1c'; x.fillRect(1, 9, 2, 7); x.fillRect(13, 9, 2, 7); x.fillStyle = '#7a4a2a'; x.fillRect(3, 11, 10, 4); x.fillStyle = '#f0c040'; x.fillRect(5, 10, 2, 1); x.fillStyle = '#8ac85a'; x.fillRect(8, 10, 3, 1); }, 121);
  TILE['K'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(1, 2, 14, 13); x.fillStyle = '#9a6a3a'; x.fillRect(2, 3, 12, 11); x.fillStyle = '#6a4424'; x.fillRect(2, 3, 12, 1); x.fillRect(2, 13, 12, 1); x.fillRect(2, 3, 1, 11); x.fillRect(13, 3, 1, 11); for (let k = 0; k < 10; k++) x.fillRect(3 + k, 4 + k, 1, 1); }, 122);
  TILE['N'] = tileCanvas((x, R) => { x.fillStyle = T.wall || '#3d3550'; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; x.fillRect(1, 2, 14, 12); x.fillStyle = '#7a4a2a'; x.fillRect(2, 3, 12, 10); x.fillStyle = '#e8dcc0'; x.fillRect(3, 4, 4, 5); x.fillRect(9, 5, 4, 6); x.fillStyle = '#8a8099'; x.fillRect(4, 5, 2, 1); x.fillRect(4, 7, 2, 1); x.fillRect(10, 6, 2, 1); x.fillRect(10, 8, 2, 1); x.fillStyle = '#c83838'; x.fillRect(5, 4, 1, 1); x.fillRect(11, 5, 1, 1); }, 123);
  TILE['P'] = tileCanvas((x, R) => { x.fillStyle = '#1e1418'; x.fillRect(0, 0, 16, 16); for (const o of [0, 8]) { x.fillStyle = PAL.k; x.fillRect(o, 3, 8, 12); x.fillStyle = '#8a2a3a'; x.fillRect(o + 1, 4, 6, 7); x.fillStyle = '#a83a4a'; x.fillRect(o + 1, 4, 6, 1); x.fillStyle = '#5a1a24'; x.fillRect(o + 1, 11, 6, 3); } }, 124);
  TILE['D'] = tileCanvas((x, R) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 4 === 0 ? '#5a1424' : i % 4 === 2 ? '#a8283c' : '#801c30'; x.fillRect(i, 0, 1, 16); } x.fillStyle = '#f0c040'; x.fillRect(0, 0, 16, 1); }, 125);
  TILE['H'] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(3, 1, 10, 14); x.fillStyle = '#b8862a'; x.fillRect(4, 2, 8, 11); x.fillStyle = '#e0b040'; x.fillRect(5, 3, 2, 8); x.fillStyle = '#7a5418'; x.fillRect(4, 12, 8, 2); x.fillStyle = PAL.k; x.fillRect(7, 14, 2, 1); }, 126);
}
