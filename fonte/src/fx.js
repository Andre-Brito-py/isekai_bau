// ================= ANIMAÇÕES DE FEITIÇOS E TÉCNICAS =================
// Cada feitiço combina ELEMENTO (como parece) + FORMA (como viaja) + MODIFICADOR (um detalhe extra).
// Cada técnica tem a sua animação em TECH_FX. As animações são promessas: o dano aparece no momento do impacto.
const FXL = [];
function fxRun(T, draw) { return new Promise(res => FXL.push({ t: 0, T, draw, res })); }
function fxSpawn(T, draw) { FXL.push({ t: 0, T, draw, res: null }); }
function fxWaitF(n) { return fxRun(n, () => {}); }
function drawFx() {
  for (const f of FXL.slice()) {
    f.draw(f.t, f.t / f.T); f.t++;
    if (f.t >= f.T) { FXL.splice(FXL.indexOf(f), 1); if (f.res) f.res(); }
  }
  if (BT.flashT > 0) { bx.globalAlpha = Math.min(0.6, BT.flashT / 12); bx.fillStyle = BT.flashC || '#ffffff'; bx.fillRect(0, 0, 240, 132); bx.globalAlpha = 1; BT.flashT--; }
  if (BT.dimT > 0) { bx.globalAlpha = Math.min(0.55, BT.dimT / 20); bx.fillStyle = '#05030a'; bx.fillRect(0, 0, 240, 132); bx.globalAlpha = 1; BT.dimT--; }
}
function fxFlash(col, n = 8) { BT.flashC = col; BT.flashT = n; }
// ---- primitivas de desenho ----
const fxP = (x, y, c) => { bx.fillStyle = c; bx.fillRect(Math.round(x), Math.round(y), 1, 1); };
const fxR = (x, y, w, h, c) => { bx.fillStyle = c; bx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
function fxDisc(cx, cy, r, c) { r = Math.max(0, r); for (let yy = -Math.floor(r); yy <= r; yy++) { const hw = Math.floor(Math.sqrt(Math.max(0, r * r - yy * yy))); fxR(cx - hw, cy + yy, hw * 2 + 1, 1, c); } }
function fxRing(cx, cy, r, c, ry) { ry = ry ?? r; const n = Math.max(12, Math.round(r * 5)); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; fxP(cx + Math.cos(a) * r, cy + Math.sin(a) * ry, c); } }
function fxLine(x0, y0, x1, y1, c, th = 1) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) fxR(x0 + (x1 - x0) * i / n - (th - 1) / 2, y0 + (y1 - y0) * i / n - (th - 1) / 2, th, th, c); }
function fxSpark(x, y, c, big) { fxP(x, y, '#ffffff'); fxR(x - 1, y, 3, 1, c); fxR(x, y - 1, 1, 3, c); if (big) { fxR(x - 3, y, 2, 1, c); fxR(x + 2, y, 2, 1, c); fxR(x, y - 3, 1, 2, c); fxR(x, y + 2, 1, 2, c); } }
function fxGlow(cx, cy, r, c, a = 0.25) { bx.globalAlpha = a; fxDisc(cx, cy, r, c); bx.globalAlpha = a * 0.6; fxDisc(cx, cy, r * 1.5, c); bx.globalAlpha = 1; }
function fxNote(x, y, c, big) { x = Math.round(x); y = Math.round(y); fxR(x - 2, y + 1, 3, 2, c); fxR(x, y - (big ? 6 : 4), 1, big ? 7 : 5, c); fxR(x + 1, y - (big ? 6 : 4), 2, 1, c); fxP(x + 2, y - (big ? 5 : 3), c); fxP(x - 2, y + 1, '#ffffff'); }
function fxPart(x, y, vx, vy, life, col, sz = 1, grav = 0) { BT.parts.push({ x, y, vx, vy, life, col, sz, then: !grav }); }
function fxBolt(x0, y0, x1, y1, seed) {
  const R = bgRand(seed), n = 7, pts = [[x0, y0]]; const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  for (let i = 1; i < n; i++) { const o = (R() - 0.5) * 12; pts.push([x0 + dx * i / n + nx * o, y0 + dy * i / n + ny * o]); } pts.push([x1, y1]);
  for (let i = 0; i < pts.length - 1; i++) fxLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#ffe066', 3);
  for (let i = 0; i < pts.length - 1; i++) fxLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#ffffff', 1);
  return pts;
}
const EP = {
  brasa: ['#7a1a08', '#f07830', '#ffb040', '#fff4c0'], geada: ['#1c4a7a', '#7ad0f0', '#c8f4ff', '#ffffff'],
  seiva: ['#1a4a1a', '#4a9a4a', '#8ac85a', '#d8ffb0'], faisca: ['#7a5a10', '#ffe066', '#fff4a0', '#ffffff'],
  tinta: ['#101a4a', '#3a4ab0', '#5a6ad0', '#b0b8ff'], sombra: ['#1a0a2a', '#3a2050', '#b48cf0', '#e8d8ff'],
  vento: ['#2a5a4a', '#7ac8b0', '#c8f0e0', '#ffffff'], sal: ['#5a6070', '#b8b4ac', '#e8e4dc', '#ffffff'],
  polvora: ['#3a2010', '#a05a20', '#e0a060', '#fff0c0']
};
const epal = el => EP[el] || ['#3a3448', RUNES[el] ? RUNES[el].col : '#ffffff', '#ffffff', '#ffffff'];
const MOUTH = () => [BPX + 12, BPY - 16];
const feet = t => t.y + (t.h || 32) / 2;
// ---- projétil de cada elemento (desenhado no ponto x,y; dir = ângulo do voo; s = tamanho) ----
function drawProj(el, x, y, t, dir, s) {
  const [d, m, b, w] = epal(el), c = Math.cos(dir), sn = Math.sin(dir);
  switch (el) {
    case 'brasa': fxGlow(x, y, 6 * s, b, 0.25); fxDisc(x, y, 3.5 * s, d); fxDisc(x, y, 3 * s, m); fxDisc(x + c, y + sn, 2 * s, b); fxDisc(x + c * 1.5, y + sn * 1.5, 1 * s, w); if (t % 2 === 0) fxPart(x - c * 3, y - sn * 3, -c * 0.4 + rand(-0.3, 0.3), -0.5 - Math.random() * 0.5, rand(10, 18), pickOne([m, b, '#5a5050']), 1); break;
    case 'geada': { const L = 7 * s; for (let i = -L; i <= L; i++) { const wdt = Math.max(0, (L - Math.abs(i)) / L * 2.6 * s); fxLine(x + c * i - sn * wdt, y + sn * i + c * wdt, x + c * i + sn * wdt, y + sn * i - c * wdt, i > L * 0.4 ? w : i > -L * 0.3 ? b : m); } fxP(x + c * L, y + sn * L, '#ffffff'); if (t % 3 === 0) fxPart(x, y, rand(-0.3, 0.3), rand(-0.3, 0.3), 16, pickOne([b, w]), 1); break; }
    case 'seiva': fxGlow(x, y, 5 * s, b, 0.2); fxDisc(x, y, 2.5 * s, m); fxDisc(x - 1, y - 1, 1, b); for (const k of [0, Math.PI]) { const a = t * 0.3 + k; fxR(x + Math.cos(a) * 4 * s, y + Math.sin(a) * 4 * s, 2, 1, b); fxP(x + Math.cos(a) * 5 * s, y + Math.sin(a) * 5 * s, w); } break;
    case 'sombra': fxGlow(x, y, 7 * s, b, 0.18); fxDisc(x, y, 4 * s, d); fxDisc(x, y, 3 * s, m); fxP(x - 1, y - 1, b); fxP(x + 1, y - 1, b); for (let i = 0; i < 3; i++) { const a = -dir + Math.PI + Math.sin(t * 0.3 + i) * 0.6; fxLine(x, y, x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s + i - 1, i === 1 ? b : m); } break;
    case 'vento': for (let k = 0; k < 3; k++) { const ox = -c * k * 5, oy = -sn * k * 5; for (let i = -4; i <= 4; i++) { const a = dir + Math.PI / 2 + i * 0.22 + t * 0.4; fxP(x + ox + Math.cos(a) * 5 * s - c * Math.abs(i) * 0.6, y + oy + Math.sin(a) * 5 * s, k === 0 ? w : k === 1 ? b : m); } } break;
    case 'sal': for (let i = 0; i < 5; i++) { const ox = Math.cos(t * 0.2 + i * 1.3) * 3 * s - c * i * 2, oy = Math.sin(t * 0.25 + i * 1.7) * 3 * s - sn * i * 2; fxR(x + ox - 1, y + oy - 1, 3, 3, d); fxR(x + ox - 1, y + oy - 1, 2, 2, i % 2 ? b : w); } break;
    case 'tinta': fxDisc(x, y, 3.5 * s, d); fxDisc(x - 1, y - 1, 2.5 * s, m); fxP(x - 1, y - 2, w); if (t % 3 === 0) fxPart(x, y + 2, rand(-0.2, 0.2), 0.6, 14, m, 2, 1); break;
    case 'polvora': fxDisc(x, y, 3.5 * s, '#120e1a'); fxDisc(x - 1, y - 1, 1, '#5a5070'); fxLine(x + 2, y - 3, x + 4, y - 6, '#a89068'); fxSpark(x + 4, y - 7, t % 4 < 2 ? '#ffb040' : '#ffe066'); break;
    case 'ambar': { fxGlow(x, y, 6 * s, b, 0.25); const L = 5 * s; for (let i = -L; i <= L; i++) { const wdt = Math.max(0, (L - Math.abs(i)) / L * 3 * s); fxLine(x + c * i - sn * wdt, y + sn * i + c * wdt, x + c * i + sn * wdt, y + sn * i - c * wdt, i > 0 ? b : m); } fxP(x + c * L, y + sn * L, w); fxP(x - sn * 2, y + c * 2, w); if (t % 3 === 0) fxPart(x, y, rand(-0.3, 0.3), rand(-0.3, 0.3), 16, pickOne([b, w]), 1); break; }
    case 'canto': fxGlow(x, y, 6 * s, b, 0.22); for (let i = 0; i < 3; i++) { const ox = -c * i * 6 + Math.sin(t * 0.4 + i) * 2, oy = -sn * i * 6 + Math.cos(t * 0.4 + i * 2) * 3; fxNote(x + ox, y + oy, i === 0 ? w : i === 1 ? b : m, i === 0 && s > 1.2); } if (t % 3 === 0) fxPart(x, y, rand(-0.3, 0.3), -0.4, 18, b, 1); break;
    default: fxGlow(x, y, 5, m); fxDisc(x, y, 3 * s, m); fxP(x, y, '#ffffff');
  }
}
// ---- impacto de cada elemento (p: 0..1) ----
function drawImpact(el, x, y, p, s, fy) {
  const [d, m, b, w] = epal(el), q = 1 - p;
  switch (el) {
    case 'brasa': { if (p < 0.15) fxDisc(x, y, 10 * s, w); fxRing(x, y, (4 + p * 16) * s, b); fxRing(x, y, (3 + p * 13) * s, m); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3, r = (5 + p * 10) * s, h = (1 - p) * 7 * s; const fx0 = x + Math.cos(a) * r, fy0 = y + Math.sin(a) * r * 0.6; fxLine(fx0, fy0, fx0, fy0 - h, i % 2 ? m : b, 2); fxP(fx0, fy0 - h, w); } bx.globalAlpha = q * 0.6; fxDisc(x + 6, y - p * 14, 3 + p * 4, '#4a4450'); fxDisc(x - 5, y - p * 18, 2 + p * 4, '#3a3440'); bx.globalAlpha = 1; break; }
    case 'geada': { const r = (3 + p * 12) * s; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; fxLine(x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, i % 2 ? b : w); fxP(x + Math.cos(a) * (r + 1), y + Math.sin(a) * (r + 1), '#ffffff'); } if (p > 0.3) { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6, a2 = (i + 1) / 6 * Math.PI * 2 + Math.PI / 6; fxLine(x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, x + Math.cos(a2) * 8 * s, y + Math.sin(a2) * 8 * s, b); } } if (fy && p > 0.2) for (let i = -2; i <= 2; i++) { const hh = (q * 8 + 2) * (1 - Math.abs(i) * 0.25); fxLine(x + i * 5, fy, x + i * 5, fy - hh, i % 2 ? b : m, 2); fxP(x + i * 5, fy - hh, w); } break; }
    case 'seiva': { for (let k = 0; k < 3; k++) { for (let i = 0; i < 14; i++) { const a = i * 0.5 + k * 2.1 + p * 3, r = 10 * s - i * 0.4; fxP(x + Math.cos(a) * r, y + 4 - i * 1.1 + Math.sin(a) * 2, i % 3 ? m : b); } } if (p > 0.4) for (let i = 0; i < 4; i++) { const pp = (p - 0.4) / 0.6, [mx, my] = MOUTH(), ax = x + (mx - x) * ((pp + i * 0.15) % 1), ay = y + (my - y) * ((pp + i * 0.15) % 1) - Math.sin(((pp + i * 0.15) % 1) * Math.PI) * 14; fxSpark(ax, ay, b); } break; }
    case 'faisca': { if (p < 0.5) fxBolt(x + rand(-2, 2), 0, x, y, (FRAME * 7) | 0); if (p < 0.2) fxDisc(x, y, 9 * s, '#ffffff'); fxRing(x, y, (6 + p * 12) * s, b); for (let i = 0; i < 4; i++) { const a = i * 1.7 + p * 9; fxLine(x, y, x + Math.cos(a) * 9 * s * q, y + Math.sin(a) * 9 * s * q, '#ffe066'); } break; }
    case 'sombra': { fxRing(x, y + 4, (6 + p * 12) * s, m, (2 + p * 4) * s); for (let i = 0; i < 5; i++) { const bx0 = x - 12 * s + i * 6 * s, hh = Math.sin(p * Math.PI) * (10 + (i % 2) * 6) * s; for (let j = 0; j < hh; j++) fxP(bx0 + Math.sin(j * 0.5 + i + p * 6) * 2, (fy || y + 8) - j, j > hh - 2 ? b : m); fxP(bx0 + Math.sin(hh * 0.5 + i + p * 6) * 2, (fy || y + 8) - hh, w); } break; }
    case 'vento': { for (let k = 0; k < 3; k++) for (let i = 0; i < 20; i++) { const a = i * 0.32 + p * 12 + k * 2.1, r = (2 + i * 0.6) * s * (0.6 + p * 0.6); fxP(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.5 - i * 0.3, k === 0 ? w : b); } break; }
    case 'sal': { for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + 0.4, r = (4 + p * 8) * s, cx = x + Math.cos(a) * r, cy = y + Math.sin(a) * r * 0.8, hh = Math.min(1, p * 3) * 5 * s; fxR(cx - 1, cy - hh, 3, hh, d); fxR(cx - 1, cy - hh, 2, hh - 1, i % 2 ? b : w); } break; }
    case 'tinta': { for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = (3 + p * 12) * s; fxDisc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.7 + p * 6, 2 * q + 1, i % 2 ? m : d); } fxDisc(x, y, 4 * q * s, m); break; }
    case 'polvora': { if (p < 0.2) fxDisc(x, y, 14 * s, '#ffffff'); fxDisc(x, y, q * 10 * s, b); fxRing(x, y, (5 + p * 20) * s, m); fxRing(x, y, (4 + p * 16) * s, '#ffe066'); bx.globalAlpha = q; for (let i = 0; i < 4; i++) fxDisc(x + (i - 1.5) * 8 * p, y - p * 16 - i * 2, 3 + p * 5, '#4a4450'); bx.globalAlpha = 1; break; }
    case 'ambar': { const r = Math.min(1, p * 2.5); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + 0.2, cx = x + Math.cos(a) * 9 * s * r, cy = y + Math.sin(a) * 7 * s * r, hh = (4 + (i % 3) * 2) * s * r; fxR(cx - 1, cy - hh, 3, hh, d); fxR(cx - 1, cy - hh, 2, hh - 1, i % 2 ? b : m); fxP(cx, cy - hh, w); } if (p < 0.3) fxDisc(x, y, 8 * s, w); if (p > 0.5) { bx.globalAlpha = (1 - p) * 0.6; fxDisc(x, y, 10 * s, b); bx.globalAlpha = 1; } break; }
    case 'canto': { for (let k = 0; k < 3; k++) { const r = (4 + p * 16 - k * 4) * s; if (r > 0) fxRing(x, y, r, k === 0 ? b : m, r * 0.7); } for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + p * 2, r = (5 + p * 12) * s; fxNote(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.7 - p * 8, i % 2 ? w : b); } break; }
    case 'estrela': { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + p, r = (3 + p * 14) * s; fxSpark(x + Math.cos(a) * r, y + Math.sin(a) * r, '#ffe066', i % 2 === 0 && p < 0.5); } if (p < 0.25) fxDisc(x, y, 6 * s, '#fff4a0'); break; }
    default: fxRing(x, y, 3 + p * 12, m); fxRing(x, y, 2 + p * 9, '#ffffff');
  }
}
function impactAt(el, t, s) { const x = t.x, y = t.y, fy = feet(t); fxSpawn(22, (k, p) => drawImpact(el, x, y, p, s, fy)); if (el === 'brasa' || el === 'polvora') shake(4); }
// ---- formas ----
async function fxCharge(el) { const [mx, my] = MOUTH(), [, m, b] = epal(el); await fxRun(16, (t, p) => { fxGlow(mx, my, 2 + p * 6, b, 0.3); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + t * 0.2, r = 18 * (1 - p); fxSpark(mx + Math.cos(a) * r, my + Math.sin(a) * r, i % 2 ? m : b); } }); }
async function fxShot(el, t, s, from) {
  const [x0, y0] = from || MOUTH(), x1 = t.x, y1 = t.y, T = el === 'tinta' || el === 'polvora' ? 22 : 16, arc = el === 'tinta' || el === 'polvora' ? 22 : el === 'sombra' ? 6 : 3;
  await fxRun(T, (k, p) => { const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * arc; const dir = Math.atan2(y1 - y0 - Math.cos(p * Math.PI) * arc * 2, x1 - x0); drawProj(el, x, y, k, dir, s); });
  impactAt(el, t, s);
}
async function fxLightning(t, s, from) {
  const x = t.x, y = t.y; fxFlash('#fff4a0', 6);
  await fxRun(8, (k) => { const [x0, y0] = from || [x + rand(-6, 6), 0]; fxBolt(x0, y0, x, y, FRAME * 13 + k); fxGlow(x, y, 8 * s, '#ffe066', 0.4); });
  impactAt('faisca', t, s);
}
async function fxChain(el, ts, s) {
  let from = MOUTH();
  for (const t of ts) {
    if (el === 'faisca') await fxLightning(t, s, from);
    else { const f0 = from; await fxShot(el, t, s, f0); fxSpawn(16, (k, p) => { bx.globalAlpha = 1 - p; for (let i = 0; i < 6; i++) { const q = i / 6; fxRing(f0[0] + (t.x - f0[0]) * q, f0[1] + (t.y - f0[1]) * q, 1.5, epal(el)[2]); } bx.globalAlpha = 1; }); }
    from = [t.x, t.y];
  }
}
async function fxWave(el, ts, s) {
  const [d, m, b, w] = epal(el), x0 = BPX + 18, T = 30, gy = 118, hit = new Set();
  await fxRun(T, (k, p) => {
    const fx0 = x0 + (244 - x0) * p;
    for (const t of ts) if (!hit.has(t) && fx0 >= t.x) { hit.add(t); impactAt(el, t, s * 0.8); }
    for (let i = 0; i < 9; i++) {
      const xx = fx0 - i * 5, a = 1 - i / 9; if (xx < x0) continue; bx.globalAlpha = a;
      switch (el) {
        case 'brasa': { const hh = (10 + Math.sin(k * 0.8 + i) * 4) * a * s; for (let j = 0; j < hh; j++) fxR(xx + Math.sin(j * 0.6 + k) * 1, gy - j, 3, 1, j > hh * 0.7 ? w : j > hh * 0.4 ? b : m); break; }
        case 'geada': { const hh = (i < 3 ? (i + 1) * 4 : 12) * s; fxLine(xx, gy, xx + 2, gy - hh, b, 2); fxP(xx + 2, gy - hh, w); break; }
        case 'faisca': if (i === 0 && k % 2 === 0) fxBolt(xx, gy - 30, xx + rand(-4, 4), gy, k * 31); fxR(xx, gy - 1, 4, 1, b); break;
        case 'sombra': { const hh = (8 + Math.sin(i + k * 0.4) * 3) * s; fxR(xx, gy - hh, 5, hh, i % 2 ? d : m); fxR(xx, gy - hh, 5, 1, b); break; }
        case 'vento': for (let j = 0; j < 18; j++) { const a2 = j * 0.5 + k * 0.6; fxP(fx0 + Math.cos(a2) * (2 + j * 0.5), gy - j * 1.5, j % 3 ? b : w); } i = 9; break;
        case 'sal': fxR(xx, gy - 4 - Math.abs(Math.sin(i + k * 0.5)) * 6, 4, 3, i % 2 ? w : b); fxR(xx, gy - 2, 5, 2, m); break;
        case 'seiva': { const hh = (4 + (i % 3) * 3) * s; fxLine(xx, gy, xx + Math.sin(i) * 2, gy - hh, m); fxR(xx + Math.sin(i) * 2 - 1, gy - hh, 3, 2, b); break; }
        case 'tinta': { const hh = (6 + Math.sin(i * 0.8 + k * 0.3) * 4) * s; fxR(xx, gy - hh, 5, hh, m); fxR(xx, gy - hh, 5, 1, w); break; }
        case 'polvora': if (i % 3 === 0) { fxDisc(xx, gy - 4, 4 * a, b); fxDisc(xx, gy - 4, 2 * a, w); } break;
        case 'ambar': { const hh = (i < 3 ? (i + 1) * 4 : 12) * s; fxR(xx, gy - hh, 3, hh, d); fxR(xx, gy - hh, 2, hh - 1, b); fxP(xx, gy - hh, w); break; }
        case 'canto': if (i % 2 === 0) fxNote(xx, gy - 6 - Math.abs(Math.sin(i + k * 0.3)) * 14, i % 4 ? b : w, i === 0); fxR(xx, gy - 1, 4, 1, m); break;
        default: fxR(xx, gy - 6, 4, 6, m);
      }
      bx.globalAlpha = 1;
    }
  });
  for (const t of ts) if (!hit.has(t)) impactAt(el, t, s * 0.8);
}
async function fxAnchor(el, t, s) {
  const x = t.x, y1 = t.y, [, m, b] = epal(el);
  await fxRun(18, (k, p) => { const y = -20 + (y1 + 20) * p * p; fxLine(x, 0, x, y - 8, '#8a8099'); for (let j = 0; j < y - 8; j += 4) fxRing(x, j, 1.5, '#5a5070'); fxR(x - 1, y - 10, 3, 12, '#5a5070'); fxR(x - 6, y, 13, 2, '#5a5070'); fxR(x - 7, y - 3, 2, 4, '#5a5070'); fxR(x + 6, y - 3, 2, 4, '#5a5070'); fxRing(x, y - 11, 2, '#8a8099'); fxGlow(x, y, 6, b, 0.25); });
  shake(10); sfx('crit'); impactAt(el, t, s * 1.2);
  const fy = feet(t); fxSpawn(26, (k, p) => { fxRing(x, fy, 4 + p * 30, m, 1 + p * 4); for (let i = -3; i <= 3; i++) fxLine(x + i * 6, fy, x + i * 9, fy + 2, '#120e1a'); });
}
async function fxMine(el, t, s) {
  const [x0, y0] = MOUTH(), x1 = t.x, y1 = t.y + 4, [, m, b] = epal(el);
  await fxRun(20, (k, p) => { const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * 26; fxDisc(x, y, 3, '#3a3632'); fxRing(x, y, 3.5, b); fxP(x, y, k % 6 < 3 ? '#ff3030' : '#601010'); });
  impactAt(el, t, s * 0.7);
}
// chave: voa até o alvo, entra e gira (CLIC)
async function fxKey(el, t, s) {
  const [x0, y0] = MOUTH(), [, m, b, w] = epal(el);
  const drawKey = (x, y, a) => { const c = Math.cos(a), sn = Math.sin(a); fxRing(x, y, 3, '#f0c040'); fxRing(x, y, 2, '#c8962a'); for (let i = 3; i < 10; i++) fxP(x + c * i, y + sn * i, '#f0c040'); for (const k of [7, 9]) fxP(x + c * k - sn * 2, y + sn * k + c * 2, '#f0c040'); };
  await fxRun(16, (k, p) => { const x = x0 + (t.x - x0) * p, y = y0 + (t.y - y0) * p - Math.sin(p * Math.PI) * 6; fxGlow(x, y, 5, b, 0.2); drawKey(x, y, Math.atan2(t.y - y0, t.x - x0) + Math.PI); });
  sfx('select');
  await fxRun(10, (k, p) => { drawKey(t.x, t.y, Math.PI + p * Math.PI / 2); fxRing(t.x, t.y, 4 + p * 10, w); });
  impactAt(el, t, s);
}
// aura do Véu ao redor do baú, uma para cada elemento
async function fxAura(el) {
  const cx = BPX, cy = BPY - 12, [d, m, b, w] = epal(el);
  await fxRun(34, (k, p) => {
    const q = Math.sin(p * Math.PI);
    switch (el) {
      case 'brasa': for (let i = 0; i < 9; i++) { const xx = cx - 16 + i * 4, hh = (8 + Math.sin(k * 0.6 + i * 1.3) * 5) * q; fxLine(xx, cy + 12, xx, cy + 12 - hh, i % 2 ? m : b, 2); fxP(xx, cy + 11 - hh, w); } break;
      case 'geada': for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6, a2 = (i + 1) / 6 * Math.PI * 2 + Math.PI / 6, r = 20 * Math.min(1, p * 2); fxLine(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r * 0.8, b); fxSpark(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8, w); } break;
      case 'faisca': for (let i = 0; i < 5; i++) { const a = k * 0.25 + i * 1.26; fxSpark(cx + Math.cos(a) * 18, cy + Math.sin(a) * 9, b, i === 0); } if (k % 6 < 2) fxBolt(cx - 14, cy - 14, cx + 14, cy + 8, k); break;
      case 'sombra': bx.globalAlpha = 0.5 * q; fxDisc(cx, cy, 20 * q, d); bx.globalAlpha = 1; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4, r = 14 + Math.sin(k * 0.3 + i) * 4; fxLine(cx + Math.cos(a) * 8, cy + Math.sin(a) * 6, cx + Math.cos(a) * r, cy + Math.sin(a) * r, m); fxP(cx + Math.cos(a) * r, cy + Math.sin(a) * r, b); } break;
      case 'vento': for (let j = 0; j < 30; j++) { const a = j * 0.45 + k * 0.4, r = 6 + j * 0.5; fxP(cx + Math.cos(a) * r, cy + 10 - j * 0.9, j % 3 ? b : w); } break;
      case 'sal': for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = 18 - 8 * p, hh = 3 + (i % 3); fxR(cx + Math.cos(a) * r - 1, cy + Math.sin(a) * r * 0.7 - hh, 3, hh, i % 2 ? w : b); } break;
      case 'ambar': for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = 20 - 6 * Math.min(1, p * 2), hh = 6 + (i % 3) * 2; fxR(cx + Math.cos(a) * r - 1, cy + Math.sin(a) * r * 0.7 - hh, 3, hh, i % 2 ? b : m); fxP(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7 - hh, w); } fxGlow(cx, cy, 14 * q, b, 0.2); break;
      case 'canto': for (let i = 0; i < 7; i++) { const a = k * 0.12 + i * 0.9, r = 16 + Math.sin(k * 0.2 + i) * 3; fxNote(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6 - p * 6, i % 2 ? b : w, i === 0); } fxGlow(cx, cy, 14 * q, m, 0.2); break;
      default: for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + k * 0.1, yy = cy + 10 - p * 26 + i * 2; fxR(cx + Math.cos(a) * 14 - 1, yy, 3, 1, b); fxR(cx + Math.cos(a) * 14, yy - 1, 1, 3, b); } fxGlow(cx, cy, 16 * q, m, 0.25);
    }
  });
}
// ---- feitiço completo ----
async function spellAnim(sp, targets, pm = 1) {
  const el = sp.el, s = 1.2 * (sp.mod === 'foco' ? 1.45 : 1) * (pm < 1 ? 0.8 : 1);
  if (sp.mod === 'foco' && pm >= 1) await fxCharge(el);
  if (sp.form === 'onda') await fxWave(el, targets, s);
  else if (sp.form === 'coro') { const n = Math.min(6, soulsCount()); fxSpawn(36, (k, p) => { for (let i = 0; i < n; i++) { const x = 6 + (i % 3) * 16, y = BPY - 30 - Math.floor(i / 3) * 16 - Math.sin(k * 0.3 + i) * 2; fxNote(x, y, ['#ffe066', '#ffb0d8', '#7ad0f0'][i % 3], true); } }); await fxWave(el, targets, s * 1.1); }
  else if (sp.form === 'corrente') await fxChain(el, targets, s);
  else if (sp.form === 'ancora') await fxAnchor(el, targets[0], s);
  else if (sp.form === 'mina') await fxMine(el, targets[0], s);
  else if (sp.form === 'chave') await fxKey(el, targets[0], s);
  else if (el === 'faisca') await fxLightning(targets[0], s);
  else await fxShot(el, targets[0], s);
  if (sp.mod === 'selo') for (const t of targets) { const x = t.x, fy = feet(t), c = RUNES[el].col; fxSpawn(36, (k, p) => { const r = 6 + Math.min(1, p * 3) * 8; fxRing(x, fy, r, c, r * 0.35); fxRing(x, fy, r - 3, c, (r - 3) * 0.35); for (let i = 0; i < 4; i++) { const a = k * 0.1 + i * Math.PI / 2; fxP(x + Math.cos(a) * (r - 1.5), fy + Math.sin(a) * (r - 1.5) * 0.35, '#ffffff'); } }); }
  if (sp.mod === 'dreno') for (const t of targets) { const [mx, my] = MOUTH(), x0 = t.x, y0 = t.y; fxSpawn(26, (k, p) => { for (let i = 0; i < 4; i++) { const q = Math.min(1, Math.max(0, p * 1.4 - i * 0.12)); fxSpark(x0 + (mx - x0) * q, y0 + (my - y0) * q - Math.sin(q * Math.PI) * 10, '#60d0a0'); } }); }
  if (sp.mod === 'mare') { fxSpawn(28, (k, p) => { for (let x = 0; x < 240; x += 3) { const y = 122 - Math.max(0, Math.sin((x / 240 - p * 1.6 + 0.4) * Math.PI)) * 10; fxR(x, y, 3, 122 - y + 2, '#2a6a8a'); fxR(x, y, 3, 1, '#c8f4ff'); } }); }
  if (sp.mod === 'bilhete') { fxSpawn(40, (k, p) => { const a = k * 0.2, x = BPX + Math.cos(a) * 18, y = BPY - 16 + Math.sin(a) * 7; fxR(x - 4, y - 2, 9, 5, '#120e1a'); fxR(x - 3, y - 1, 7, 3, '#e8dcc0'); fxR(x - 1, y - 1, 1, 3, '#c83838'); }); }
  if (sp.mod === 'bandeira') { fxSpawn(40, (k, p) => { const h = Math.min(1, p * 2.5) * 22, x = BPX - 18; fxR(x, BPY - h, 1, h, '#a89068'); fxR(x + 1, BPY - h, 9, 6, '#ff6b6b'); fxR(x + 1, BPY - h, 9, 1, '#ffb0b0'); fxR(x + 4, BPY - h + 2, 3, 2, '#f0c040'); }); }
}

// ================= TÉCNICAS =================
const fxAlive = () => BT.en.filter(e => e.alive && e.hp > 0);
async function fxDash(t) { const [mx, my] = MOUTH(); await fxRun(10, (k, p) => { for (let i = 0; i < 5; i++) fxLine(mx - 20 + p * 40, my - 8 + i * 4, mx - 34 + p * 40, my - 8 + i * 4, i % 2 ? '#ffffff' : '#ffe066'); }); }
function fxSlashes(t, col = '#ff6b6b', n = 3) { const x = t.x, y = t.y; fxSpawn(18, (k, p) => { for (let i = 0; i < n; i++) { const q = Math.min(1, p * 3 - i * 0.3); if (q <= 0) continue; const ox = (i - (n - 1) / 2) * 6; fxLine(x - 10 + ox, y - 12, x - 10 + ox + 20 * q, y - 12 + 24 * q, i % 2 ? '#ffffff' : col, 2); } }); }
const TECH_FX = {
  mobilia: async () => { await fxRun(26, (k, p) => { fxSpark(BPX + 18, BPY - 34 - p * 8, '#ffe066'); if (p > 0.4) { txt('?', BPX + 22, BPY - 50 - p * 6, { col: '#ffffff' }); } }); },
  escudo: async () => { await fxRun(26, (k, p) => { const r = 6 + Math.min(1, p * 2) * 12; fxRing(BPX + 4, BPY - 14, r, '#c83838', r * 1.1); fxRing(BPX + 4, BPY - 14, r - 2, '#f0c040', (r - 2) * 1.1); fxSpark(BPX + 4, BPY - 14, '#f0c040', p > 0.5); }); },
  tampa: async () => { await fxRun(24, (k, p) => { const x = BPX - 14 + p * 30; for (let i = 0; i < 12; i++) fxP(x - i * 0.5, BPY - 26 + i * 2, '#ffffff'); fxRing(BPX, BPY - 12, 18, '#9a93b0', 12); }); },
  investida: async (t) => { await fxRun(14, (k, p) => { fxGlow(BPX, BPY - 12, 10 * p, '#ffa94d', 0.4); for (let i = 0; i < 4; i++) fxLine(BPX - 22, BPY - 18 + i * 5, BPX - 22 - p * 12, BPY - 18 + i * 5, '#ffa94d'); }); await fxDash(t); },
  rajada: async () => { const ts = fxAlive(), [mx, my] = MOUTH(); await fxRun(18, (k, p) => { for (const t of ts) for (let i = 0; i < 4; i++) { const q = Math.min(1, p * 1.2 + i * 0.05), x = mx + (t.x - mx) * q + (i - 1.5) * 3, y = my + (t.y - my) * q + (i - 1.5) * 4; fxLine(x, y, x - 4, y, '#f2ecdc'); fxP(x + 1, y, '#ffffff'); } }); for (const t of ts) fxSlashes(t, '#ffa94d', 2); },
  dilacera: async (t) => { await fxRun(10, (k, p) => fxGlow(BPX, BPY - 12, 8 + p * 6, '#c83838', 0.35)); fxSlashes(t, '#ff6b6b', 3); },
  releitura: async () => { await fxRun(20, (k, p) => { for (let i = 0; i < 6; i++) { const a = k * 0.3 + i * 1.05, r = 10 + p * 8; fxR(BPX + Math.cos(a) * r - 2, BPY - 20 + Math.sin(a) * r * 0.5, 4, 3, '#e8dcc0'); } }); },
  marcador: async () => { await fxRun(24, (k, p) => { const h = Math.min(1, p * 2) * 18; fxR(BPX + 6, BPY - 30, 4, h, '#ff6b6b'); fxR(BPX + 6, BPY - 30 + h, 2, 2, '#ff6b6b'); fxR(BPX + 8, BPY - 30 + h, 2, 1, '#ff6b6b'); fxSpark(BPX + 8, BPY - 32, '#f0c040', true); }); },
  chuva: async () => { const ts = fxAlive(); await fxRun(30, (k, p) => { for (let i = 0; i < 10; i++) { const tt = ts[i % ts.length]; if (!tt) continue; const q = Math.min(1, Math.max(0, p * 1.6 - i * 0.06)); const x = tt.x + (i - 5) * 4 + 30 * (1 - q), y = -10 + (tt.y + 10) * q; if (q < 1) { fxSpark(x, y, '#ffe066', i % 3 === 0); fxLine(x + 1, y - 1, x + 6, y - 6, '#fff4a0'); } } }); for (const t of ts) impactAt('estrela', t, 1); },
  orbita: async () => { await fxRun(30, (k, p) => { fxRing(BPX, BPY - 14, 20, '#3a3448', 8); const a = k * 0.25; fxSpark(BPX + Math.cos(a) * 20, BPY - 14 + Math.sin(a) * 8, '#ffe066', true); }); },
  muralha: async () => { await fxRun(26, (k, p) => { const h = Math.min(1, p * 1.8) * 30; for (let i = 0; i < 4; i++) { fxR(BPX + 22, BPY - h + i * 8, 10, 7, i % 2 ? '#c8962a' : '#f0c040'); fxR(BPX + 22, BPY - h + i * 8, 10, 1, '#ffe8a0'); } fxR(BPX + 21, BPY - h, 1, h, '#120e1a'); }); shake(4); },
  baluarte: async () => { await fxRun(28, (k, p) => { for (let i = -4; i <= 4; i++) fxLine(BPX + i * 3, BPY, BPX + i * 8 * p, BPY + 2, '#120e1a'); const r = 10 + p * 10; fxRing(BPX, BPY - 14, r, '#f0c040', r * 0.9); fxRing(BPX, BPY - 14, r + 1, '#ffe8a0', r * 0.9 + 1); }); shake(5); },
  pisao: async () => { pbPose('win', 16); await fxWaitF(16); shake(12); sfx('crit'); await fxRun(24, (k, p) => { for (const r of [p * 120, p * 90]) fxRing(BPX, BPY, r, '#f0c040', r * 0.12); for (let i = 0; i < 8; i++) fxR(BPX + p * 140 * (i / 8) + 10, BPY - Math.abs(Math.sin(i + k)) * 5, 2, 2, '#a89068'); }); },
  engolir: async (t) => { await fxRun(18, (k, p) => { fxGlow(t.x, t.y, 14 * (1 - p), '#7a48b0', 0.3); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + k * 0.3, r = 16 * (1 - p); fxSpark(t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, '#b48cf0'); } }); },
  veneno: async (t) => { await fxShot('seiva', t, 1); fxSpawn(30, (k, p) => { for (let i = 0; i < 5; i++) { const q = (p * 2 + i * 0.2) % 1; fxDisc(t.x + (i - 2) * 4, t.y + 6 - q * 16, 1.5, q < 0.8 ? '#9be58a' : '#d8ffb0'); } }); },
  devorar: async (t) => { await fxRun(12, (k, p) => fxGlow(BPX, BPY - 12, 6 + p * 10, '#c83838', 0.4)); },
  fome: async (t) => { await fxRun(16, (k, p) => { bx.globalAlpha = 0.5; fxDisc(BPX + 10, BPY - 16, 6 + p * 10, '#140820'); bx.globalAlpha = 1; fxP(BPX + 8, BPY - 20, '#ff5050'); fxP(BPX + 14, BPY - 20, '#ff5050'); }); },
  vazio: async () => { const cx = 150, cy = 70; BT.dimT = 30; await fxRun(36, (k, p) => { fxDisc(cx, cy, 4 + Math.sin(p * Math.PI) * 10, '#05030a'); fxRing(cx, cy, 6 + Math.sin(p * Math.PI) * 12, '#7a48b0'); for (let i = 0; i < 14; i++) { const a = i * 0.9 + k * 0.15, r = 50 * (1 - ((p * 2 + i * 0.07) % 1)); fxP(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6, i % 2 ? '#b48cf0' : '#ffffff'); } }); shake(8); },
  enxame: async () => { const ts = fxAlive(), [mx, my] = MOUTH(); await fxRun(26, (k, p) => { for (let i = 0; i < 18; i++) { const t = ts[i % ts.length]; if (!t) continue; const q = Math.min(1, Math.max(0, p * 1.4 - i * 0.02)), x = mx + (t.x - mx) * q + Math.sin(k * 0.6 + i) * 6 * (1 - q), y = my + (t.y - my) * q + Math.cos(k * 0.5 + i * 2) * 6 * (1 - q) - Math.sin(q * Math.PI) * 10; fxR(x, y, 2, 1, '#8ac85a'); fxP(x + 2, y, '#f0c040'); } }); for (const t of ts) impactAt('seiva', t, 0.6); },
  necrose: async (t) => { await fxRun(26, (k, p) => { for (let i = 0; i < 7; i++) { const a = i * 0.9, r = 4 + p * 10, x = t.x + Math.cos(a) * r, y = t.y + Math.sin(a) * r * 0.7; fxRing(x, y, 1 + (1 - p) * 2, '#4a9a4a'); if (p > 0.6) fxSpark(x, y, '#9be58a'); } if (p > 0.8) fxDisc(t.x, t.y, 8, '#9be58a'); }); shake(5); },
  frenesi: async () => { await fxRun(28, (k, p) => { fxGlow(BPX, BPY - 12, 14 + Math.sin(k * 0.6) * 3, '#c83838', 0.35); fxR(BPX + 6, BPY - 22, 3, 2, '#ff3030'); fxR(BPX + 12, BPY - 22, 3, 2, '#ff3030'); for (let i = 0; i < 4; i++) fxLine(BPX - 16 + i * 10, BPY - 30 - p * 6, BPX - 14 + i * 10, BPY - 36 - p * 6, '#ff6b6b'); }); },
  banquete: async (t) => { await fxRun(14, (k, p) => { fxGlow(BPX, BPY - 12, 8 + p * 8, '#c83838', 0.4); txt('♪', BPX + 10, BPY - 40 - p * 6, { col: '#ff8fa8' }); }); },
  copiar: async () => { await fxRun(26, (k, p) => { const y = BPY - 30 - p * 10; fxR(BPX - 6, y, 12, 14, '#e8e4dc'); fxR(BPX - 6, y, 12, 1, '#ffffff'); fxR(BPX - 4, y + 3, 8 * Math.min(1, p * 2), 1, '#b0b8ff'); fxSpark(BPX + 7, y, '#7ad0f0'); }); },
  pacto: async () => { await fxRun(30, (k, p) => { for (let i = 0; i < 6; i++) { const a = k * 0.12 + i * 1.05; fxR(BPX + Math.cos(a) * 18 - 1, BPY - 14 + Math.sin(a) * 8 - 2, 3, 4, '#c83838'); fxP(BPX + Math.cos(a) * 18, BPY - 15 + Math.sin(a) * 8, '#ff8fa8'); } for (let i = 0; i < 3; i++) fxDisc(BPX - 4 + i * 4, BPY - 26 + ((k * 0.6 + i * 6) % 18), 1, '#c83838'); }); },
  sangue: async () => { await fxRun(26, (k, p) => { const r = 16; fxRing(BPX, BPY - 2, r * Math.min(1, p * 2), '#c83838', r * 0.35 * Math.min(1, p * 2)); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2, a2 = (i + 2) / 5 * Math.PI * 2 - Math.PI / 2; if (p > 0.4) fxLine(BPX + Math.cos(a) * r, BPY - 2 + Math.sin(a) * r * 0.35, BPX + Math.cos(a2) * r, BPY - 2 + Math.sin(a2) * r * 0.35, '#ff5050'); } }); },
  tomo: async () => { const ts = fxAlive(); await fxRun(22, (k, p) => { const w = Math.min(1, p * 2) * 26, x = 150, y = 18; fxR(x - w, y, w, 16, '#3a2050'); fxR(x, y, w, 16, '#3a2050'); fxR(x - w + 1, y + 1, w - 2, 14, '#e8dcc0'); fxR(x + 1, y + 1, w - 2, 14, '#e8dcc0'); fxR(x - 1, y, 2, 16, '#c83838'); if (p > 0.5) for (let i = 0; i < 4; i++) fxR(x - w + 4, y + 4 + i * 3, w - 8, 1, '#7a48b0'); }); fxFlash('#e8d8ff', 8); await fxRun(14, (k, p) => { for (const t of ts) { fxLine(150, 34, t.x, t.y, '#c0a0f0', 3); fxLine(150, 34, t.x, t.y, '#ffffff'); } }); for (const t of ts) impactAt('sombra', t, 1); },
  indice: async () => { await fxRun(22, (k, p) => { for (let i = 0; i < 5; i++) { const y = BPY - 40 + i * 6; fxR(BPX + 14, y, 18 * Math.min(1, p * 2 - i * 0.15), 1, i % 2 ? '#e8dcc0' : '#f0c040'); } }); },
  enciclopedia: async () => { const ts = fxAlive(), [mx, my] = MOUTH(); await fxRun(30, (k, p) => { for (let i = 0; i < 12; i++) { const t = ts[i % ts.length]; if (!t) continue; const q = Math.min(1, Math.max(0, p * 1.5 - i * 0.04)), x = mx + (t.x - mx) * q, y = my + (t.y - my) * q - Math.sin(q * Math.PI) * (12 + i % 4 * 5); if (q < 1) { fxR(x - 2, y - 1, 5, 4, '#e8dcc0'); fxR(x - 1, y, 3, 1, '#8a8099'); } } }); for (const t of ts) impactAt('tinta', t, 0.8); },
  escuridao: async () => { BT.dimT = 40; await fxRun(28, (k, p) => { for (const e of fxAlive()) { fxP(e.x - 3, e.y - 2, '#ff5050'); fxP(e.x + 3, e.y - 2, '#ff5050'); } fxR(BPX + 6, BPY - 20, 2, 1, '#c0a0f0'); fxR(BPX + 12, BPY - 20, 2, 1, '#c0a0f0'); }); },
  umbra: async () => { const ts = fxAlive(); await fxRun(28, (k, p) => { for (const t of ts) { const fy = feet(t); for (let i = 0; i < 3; i++) { const x = t.x - 8 + i * 8, hh = Math.sin(Math.min(1, p * 1.5) * Math.PI / 2) * 18; for (let j = 0; j < hh; j++) fxP(x + Math.sin(j * 0.4 + i) * 2, fy - j, j > hh - 3 ? '#e8d8ff' : '#7a48b0'); fxR(x - 2, fy - hh - 1, 5, 2, '#b48cf0'); } } }); },
  eclipseTotal: async () => { const ts = fxAlive(); BT.dimT = 40; await fxRun(34, (k, p) => { const cx = 120, cy = 24; fxDisc(cx, cy, 12, '#ffe066'); fxDisc(cx - 24 + p * 24, cy, 12, '#07050c'); fxRing(cx, cy, 13 + Math.sin(k * 0.3), '#e8d8ff'); }); fxFlash('#b48cf0', 10); for (const t of ts) impactAt('sombra', t, 1.2); shake(8); },
  estrela: async () => { await fxRun(30, (k, p) => { const x = BPX + 26, y = -10 + (BPY - 40) * Math.min(1, p * 1.4); fxGlow(x, y, 6, '#ffe066', 0.3); fxSpark(x, y, '#ffe066', true); fxLine(x - 1, y - 2, x - 8, y - 14, '#fff4a0'); }); },
  cometa: async (t) => { await fxRun(22, (k, p) => { const x = 250 - (250 - t.x) * p, y = -20 + (t.y + 20) * p; fxGlow(x, y, 8, '#ffb040', 0.3); fxDisc(x, y, 4, '#ffb040'); fxDisc(x - 1, y - 1, 2, '#ffffff'); for (let i = 1; i < 10; i++) fxDisc(x + i * 2.5, y - i * 2.5, Math.max(0, 3 - i * 0.3), i % 2 ? '#f07830' : '#ffe066'); }); fxFlash('#ffe8a0', 6); shake(10); impactAt('brasa', t, 1.3); },
  remetente: async () => { await fxRun(28, (k, p) => { const y = BPY - 30 - Math.sin(p * Math.PI) * 6, x = BPX + 2; fxR(x - 7, y - 4, 14, 9, '#e8e4dc'); for (let i = 0; i < 7; i++) { fxP(x - 7 + i, y - 4 + i * 0.6, '#8a8099'); fxP(x + 6 - i, y - 4 + i * 0.6, '#8a8099'); } fxDisc(x, y + 1, 2, '#c83838'); fxRing(x, y, 10 + p * 6, '#ffe066', 6 + p * 3); }); },
  aprendizes: async () => { const ts = fxAlive(); await fxRun(16, (k, p) => { txt('♪', BPX + 6 + p * 6, BPY - 44 - p * 10, { col: '#ffe066' }); txt('♪', BPX + 16, BPY - 38 - p * 14, { col: '#ffb040', alpha: p }); }); const cols = ['#f0c040', '#e86890', '#7ad0f0']; await fxRun(22, (k, p) => { cols.forEach((c, i) => { const t = ts[i % ts.length]; if (!t) return; const q = Math.min(1, Math.max(0, p * 1.5 - i * 0.2)), x = -10 + (t.x + 10) * q, y = feet(t) - 8 - Math.abs(Math.sin(q * 12)) * 3; fxR(x - 2, y - 6, 5, 8, '#120e1a'); fxR(x - 1, y - 5, 3, 3, '#e8c8a0'); fxR(x - 1, y - 2, 3, 3, c); for (let j = 1; j < 4; j++) fxR(x - 3 - j * 4, y - 3 + j % 2, 3, 1, c); }); }); for (const t of ts.slice(0, 3)) impactAt('estrela', t, 0.8); },
  mapa: async () => { await fxRun(34, (k, p) => { const st = [[30, 14], [70, 8], [110, 20], [150, 10], [190, 18], [220, 8]]; st.forEach(([x, y], i) => { if (p * 7 > i) fxSpark(x, y, '#ffe066', true); if (p * 7 > i + 1 && st[i + 1]) fxLine(x, y, st[i + 1][0], st[i + 1][1], '#5a6ad0'); }); }); }
};
