// ================= ARTE DO CAP. 2: interiores, igreja afundada, cenários de batalha e a ÂNCORA-MÃE =================
// tiles extras: parede de madeira (interior) e tapete
{ const _ta = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'parm' && k !== 'tapete' && k !== 'piso') return _ta(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  if (k === 'parm') { const Wd = ramp('#5a3a2a'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(Wd, (x % 4 === 0 ? 0.25 : 0.5) - y / 60 + ((hash(x >> 2, v, 4) % 5) - 2) * 0.04, x, y)); P.rect(0, 13, 16, 3, Wd[0]); }
  if (k === 'tapete') { const R = ramp('#8a3a4a'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(R, 0.5 + (((x + y) % 4 === 0) ? 0.15 : 0) - (((x - y + 16) % 8 === 0) ? 0.15 : 0), x, y)); }
  if (k === 'piso') { const Wd = ramp('#9a6a42'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const b = y >> 2; P.p(x, y, P.tone(Wd, 0.5 + (y % 4 === 0 ? 0.12 : 0) + ((hash(b, (x + b * 5) >> 3, v) % 5) - 2) * 0.05 - ((x + b * 5) % 8 === 0 ? 0.2 : 0), x, y)); } }
  return TILE2[key] = P.canvas();
}; }
Object.assign(KEY2, { 'w': { t: 'parm', solid: true }, 'r': { t: 'tapete' }, 'o': { t: 'piso' } });

// ---------- móveis e objetos (escala: balcão ~1 m = 30 px, prateleira ~2 m) ----------
function balcaoArt(w) { const P = new Pix(w * TS, 34), Wd = ramp('#7a4a2a'); P.cyl(0, 4, w * TS, 6, Wd, true); for (let y = 10; y < 34; y++) for (let x = 2; x < w * TS - 2; x++) P.p(x, y, P.tone(Wd, 0.45 - (x % 12 === 0 ? 0.2 : 0) - y / 90, x, y)); for (let i = 0; i < w * 2; i++) { const x = 4 + i * 7; P.ball(x + 2, 2, 2.5, 2.5, ramp(['#e8a030', '#5a9a4a', '#c83a3a', '#7ad0f0'][i % 4])); } return P.outline().canvas(); }
function estanteArt(w) { const P = new Pix(w * TS, 60), Wd = ramp('#5a3a24'); for (let y = 0; y < 60; y++) for (let x = 0; x < w * TS; x++) P.p(x, y, P.tone(Wd, 0.3 + (x < 3 || x > w * TS - 4 ? 0.2 : 0), x, y)); for (const sy of [14, 30, 46]) { P.rect(2, sy, w * TS - 4, 3, Wd[3]); for (let x = 4; x < w * TS - 6; x += 5) { const h = 6 + (hash(x, sy, 1) % 6); P.rect(x, sy - h, 4, h, ramp(['#c83a3a', '#3a6ab8', '#e8a030', '#5a9a4a', '#d8c8a0'][hash(x, sy, 2) % 5])[2]); } } return P.outline().canvas(); }
function mesaArt() { const P = new Pix(40, 26), Wd = ramp('#8a5a34'); P.cyl(0, 4, 40, 6, Wd, true); P.rect(3, 10, 4, 16, Wd[1]); P.rect(33, 10, 4, 16, Wd[1]); P.ball(12, 2, 3, 3, ramp('#e8dcc0')); P.rect(24, 0, 5, 5, ramp('#c8a060')[2]); return P.outline().canvas(); }
function camaArt() { const P = new Pix(36, 30), Wd = ramp('#6a4028'); P.rect(0, 4, 36, 26, Wd[1]); P.rect(2, 8, 32, 18, ramp('#d8c8e8')[2]); P.rect(2, 8, 10, 8, ramp('#f2ecdc')[3]); P.rect(14, 12, 20, 14, ramp('#5a7aa8')[2]); P.rect(0, 0, 36, 6, Wd[2]); return P.outline().canvas(); }
function fonteArt() {
  const P = new Pix(56, 40), S = ramp('#8a8290');
  P.ball(28, 26, 27, 12, S); P.ball(28, 25, 22, 9, ['#1c3a54', '#244a66', '#2e5a78', '#3a6e8e', '#5a90a8']);
  P.cyl(24, 4, 8, 22, S); P.ball(28, 4, 6, 3, S);
  P.ball(28, 0, 3, 3, ramp('#c89a40'));                                                         // um peixinho de bronze, com limo
  for (let i = 0; i < 8; i++) P.p(8 + i * 5, 31 + (i % 2), ramp('#4a7a4a')[3]);
  return P.outline().canvas();
}
// a igreja afundada: só o frontão e a escadaria que desce para dentro d'água
function igrejaArt() {
  const W = 112, H = 150, P = new Pix(W, H), S = ramp('#9a8a8a'), RF = ramp('#5a4a5a');
  for (let y = 46; y < H - 6; y++) for (let x = 6; x < W - 6; x++) { const row = y >> 3, off = (row % 2) * 6, edge = (y % 8 === 7) || ((x + off) % 12 === 11); P.p(x, y, edge ? S[0] : P.tone(S, 0.62 - x / W * 0.25 + ((hash(x >> 3, row, 3) % 5) - 2) * 0.04 - (y > H - 46 ? 0.15 : 0), x, y)); }
  P.poly([[0, 48], [W, 48], [W / 2, 4]], (x, y) => P.tone(RF, 0.7 - (y - 4) / 60 + (x < W / 2 ? 0.08 : -0.08), x, y));
  P.ball(W / 2, 30, 8, 8, ['#2a3a5a', '#3a5a8a', '#7ab0e0', '#c8e8ff', '#ffffff'], { amb: 0.4 });  // rosácea
  for (let i = 0; i < 6; i++) P.line(W / 2, 30, W / 2 + Math.cos(i) * 8, 30 + Math.sin(i) * 8, '#2a2030');
  // portal em arco, metade debaixo d'água
  for (let y = 70; y < H - 4; y++) for (let x = 36; x < 76; x++) { const r = Math.hypot(x - 56 + 0.5, Math.max(0, 90 - y)); if (r < 20) P.p(x, y, y > H - 40 ? P.tone(['#0a1a2a', '#14304a', '#1c3a54', '#2e5a78', '#3a6e8e'], 0.4 + Math.sin(x * 0.5) * 0.05, x, y) : '#140e1a'); }
  for (let y = H - 40; y < H - 4; y++) for (let x = 6; x < W - 6; x++) if ((y - (H - 40)) % 5 === 0 && hash(x, y, 9) % 4 === 0) P.p(x, y, ramp('#4a6a4a')[2]);    // marca d'água
  P.rect(52, 50, 8, 3, ramp('#c89a40')[2]); P.rect(55, 46, 2, 10, ramp('#c89a40')[2]);
  P.outline(); return P.canvas();
}

// ---------- cenários de batalha ----------
let BG_CIDADE = null, BG_AFOGADO = null, BG_POCO = null;
function bgCidade() {
  if (BG_CIDADE) return BG_CIDADE;
  const P = new Pix(240, 150), sky = ['#3e2656', '#5c3062', '#82406a', '#a8526a', '#c86a62', '#e08a5a', '#f0aa60'];
  for (let y = 0; y < 70; y++) for (let x = 0; x < 240; x++) { const f = y / 70 * (sky.length - 1), i = Math.floor(f); P.p(x, y, sky[Math.min(sky.length - 1, (f - i) > (BAYER4[y & 3][x & 3] + 0.5) / 16 ? i + 1 : i)]); }
  // casas da praça, com janelas acesas
  const cs = [[0, 40, '#8a5a3a', '#7a2a2a'], [44, 30, '#9a7a5a', '#4a4a6a'], [150, 36, '#7a5a4a', '#6a3a2a'], [196, 44, '#a8704a', '#8a3a2a']];
  for (const [x, w, wc, rc] of cs) { for (let y = 38; y < 112; y++) for (let i = 0; i < w; i++) P.p(x + i, y, P.tone(ramp(wc), 0.4 - i / w * 0.15 - ((y - 38) % 6 === 0 ? 0.1 : 0), x + i, y)); P.poly([[x - 2, 40], [x + w + 2, 40], [x + w / 2, 22]], (xx, yy) => P.tone(ramp(rc), 0.45, xx, yy)); for (let k = 0; k < 2; k++) P.rect(x + 6 + k * 14, 56, 8, 10, '#f0b050'); }
  // a torre torta no meio
  for (let y = 4; y < 112; y++) { const lean = Math.round((112 - y) * 0.06); for (let x = 102; x < 134; x++) P.p(x + lean, y, P.tone(ramp('#8a7a7a'), 0.5 - (x - 102) / 50, x, y)); }
  P.poly([[98 + 6, 6], [138 + 6, 6], [120 + 7, -20]], ramp('#4a5a7a')[1]);
  for (let y = 16; y < 40; y++) for (let x = 112; x < 126; x++) if (Math.hypot(x - 119, Math.max(0, 24 - y)) < 7 || y > 24) P.p(x + 6, y, '#1a1424');
  // calçamento e poças refletindo o céu
  for (let y = 112; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(ramp('#6a6470'), 0.5 - (y - 112) / 80 + (((x >> 3) + (y >> 2)) % 2 ? 0.06 : 0), x, y));
  for (const [x, y, w] of [[30, 128, 40], [150, 138, 50], [96, 122, 22]]) for (let i = 0; i < w; i++) for (let j = 0; j < 7; j++) if (Math.hypot((i - w / 2) / (w / 2), (j - 3) / 3.2) < 1) P.p(x + i, y + j, P.tone(['#5c3062', '#82406a', '#c86a62', '#e08a5a', '#f0aa60'], 0.75 - j * 0.08, x + i, y + j));
  return BG_CIDADE = P.canvas();
}
function bgAfogado() {
  if (BG_AFOGADO) return BG_AFOGADO;
  const P = new Pix(240, 150), deep = ['#08141e', '#0c1e2c', '#12293a', '#1a3a4e', '#24506a'];
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(deep, 0.85 - y / 160 + Math.sin(x * 0.04 + y * 0.02) * 0.04, x, y));
  // raios de luz entrando pela água
  for (const [x0, w] of [[30, 18], [110, 26], [190, 14]]) for (let y = 0; y < 120; y++) for (let i = 0; i < w; i++) if ((x0 + i + y * 0.3) % 1 < 1 && hash(i, y, x0) % 3) P.p(Math.round(x0 + i + y * 0.3), y, P.tone(deep, 0.95 + (1 - y / 120) * 0.1, x0 + i, y));
  // casas afogadas (silhuetas com janelas escuras)
  for (const [x, w, h] of [[0, 46, 70], [60, 36, 54], [150, 40, 64], [200, 40, 80]]) { for (let y = 112 - h; y < 112; y++) for (let i = 0; i < w; i++) P.p(x + i, y, P.tone(['#0a1a24', '#10242e', '#163040', '#1e3c4e', '#28506a'], 0.45 - i / w * 0.15, x + i, y)); P.poly([[x - 2, 112 - h], [x + w + 2, 112 - h], [x + w / 2, 112 - h - 14]], '#0e2230'); for (let k = 0; k < 2; k++) P.rect(x + 6 + k * 16, 112 - h + 14, 8, 10, '#06101a'); }
  // algas balançando (desenhadas fixas) e chão de lodo com tralha
  for (let i = 0; i < 18; i++) { const x = (i * 53) % 240, h = 12 + (i * 7) % 20; for (let j = 0; j < h; j++) P.p(x + Math.round(Math.sin(j * 0.4 + i) * 2), 150 - 40 - j + 30, ramp('#2a5a3a')[1 + (j % 3)]); }
  for (let y = 112; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(ramp('#3a3a2e'), 0.45 - (y - 112) / 90 + ((hash(x, y, 4) % 7) - 3) * 0.02, x, y));
  for (const [x, y] of [[40, 118], [130, 122], [200, 116]]) { P.ball(x, y, 6, 3, ramp('#5a4a3a')); }
  P.rect(170, 114, 22, 3, ramp('#6a4a2a')[1]); P.rect(176, 111, 3, 6, ramp('#6a4a2a')[1]);   // um remo
  return BG_AFOGADO = P.canvas();
}
function bgPoco() {
  if (BG_POCO) return BG_POCO;
  const P = new Pix(240, 150), deep = ['#06100a', '#0a1a14', '#10261e', '#183428', '#224838'];
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(deep, 0.6 - Math.hypot(x - 120, y - 40) / 300, x, y));
  // paredes do poço, curvas, em pedra
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) { const d = Math.abs(x - 120) / 120; if (d > 0.78 - y / 900) { const row = y >> 3, edge = (y % 8 === 7) || (((x + row * 5) % 14) === 0); P.p(x, y, edge ? '#0a1210' : P.tone(ramp('#4a5a52'), 0.4 - (d - 0.7) + ((hash(x >> 3, row, 6) % 5) - 2) * 0.04, x, y)); } }
  // correntes descendo do alto
  for (const cx of [60, 96, 150, 184]) for (let y = 0; y < 100 + (cx % 3) * 10; y += 5) { P.ball(cx + Math.round(Math.sin(y * 0.05) * 2), y, 2, 3, ramp('#5a5a6a')); }
  // água parada no fundo, com o reflexo das lembranças (pontinhos âmbar)
  for (let y = 112; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(['#0a1a24', '#10283a', '#163a50', '#1e4a64', '#2a6080'], 0.4 + Math.sin(x * 0.2 + y) * 0.05, x, y));
  for (let i = 0; i < 30; i++) P.p((i * 71) % 240, 114 + (i * 13) % 34, i % 3 ? '#e8a030' : '#fff0a0');
  return BG_POCO = P.canvas();
}

// ---------- A ÂNCORA-MÃE (chefe do Cap. 2) ----------
// O primeiro sino de Velhágua, a Dona Badalada, que caiu no rio numa cheia há cem anos. Virou um bicho-ermitão:
// o SINO é o casco (bronze com azinhavre, cracas, rachado), as PERNAS são correntes de navio, uma delas termina numa
// ÂNCORA de verdade. Lá dentro, dois olhos de âmbar escuro. Fase 2: o sino sobe e mostra o corpo de correntes.
// Fase 3: o sino racha, e pela rachadura vaza luz âmbar com silhuetas de gente (as lembranças que ela guardou).
const ANC_CACHE = {};
function ancoraFrame(ph, f, hurt) { const k = ph + '_' + f + '_' + (hurt ? 1 : 0); return ANC_CACHE[k] || (ANC_CACHE[k] = ancoraArt(ph, f, hurt)); }
function ancoraArt(ph, f, hurt) {
  const W = 112, H = 116, P = new Pix(W, H), BZ = ramp('#a87a3a'), AZ = ramp('#4a8a7a'), CH = ramp('#5a5a6a');
  const cx = 58, lift = ph >= 2 ? 14 : 0, sw = f === 1 ? 1 : 0, atk = f >= 2;
  // --- pernas de corrente (atrás do sino) ---
  const legs = [[-34, 1], [-20, 0], [20, 0], [34, 1]];
  for (const [dx, k] of legs) {
    const x0 = cx + dx * 0.5, y0 = 70 - lift, x1 = cx + dx + (k ? sw : -sw) * 2, y1 = 112;
    const mx = (x0 + x1) / 2 + (dx < 0 ? -10 : 10), my = (y0 + y1) / 2 - 10;
    for (let t = 0; t <= 1; t += 1 / 12) { const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1; P.ball(x, y, 2.6, 3.2, CH, { clip: (a, b) => Math.hypot(a + 0.5 - x, b + 0.5 - y) > 1.1 }); }
  }
  // a ÂNCORA: o braço direito (da tela, esquerda do bicho) termina numa âncora de navio
  const ax = atk ? 6 : 14, ay = atk ? (f === 3 ? 98 : 40) : 62 - lift;
  for (let t = 0; t <= 1; t += 1 / 10) { const x = cx - 18 + (ax - cx + 18) * t, y = 62 - lift + (ay - 62 + lift) * t - Math.sin(t * Math.PI) * 14; P.ball(x, y, 2.4, 3, CH, { clip: (a, b) => Math.hypot(a + 0.5 - x, b + 0.5 - y) > 1 }); }
  P.cyl(ax - 2, ay, 5, 18, ramp('#4a4a58'));
  P.poly([[ax - 12, ay + 12], [ax + 13, ay + 12], [ax + 9, ay + 22], [ax + 1, ay + 16], [ax - 8, ay + 22]], (x, y) => P.tone(ramp('#4a4a58'), 0.7 - (y - ay - 12) * 0.05, x, y));
  P.cyl(ax - 7, ay + 2, 15, 3, ramp('#4a4a58'), true); P.ball(ax, ay - 2, 3, 3, ramp('#4a4a58'), { clip: (a, b) => Math.hypot(a + 0.5 - ax, b + 0.5 - ay + 2) > 1.4 });
  // fase 2+: corpo de correntes enroladas aparece debaixo do sino
  if (ph >= 2) { for (let i = 0; i < 18; i++) { const a = i * 0.7, r = 6 + (i % 6) * 2; P.ball(cx + Math.cos(a) * r, 80 + Math.sin(a) * r * 0.5, 2.5, 3, CH); } P.ball(cx, 82, 7, 6, ramp('#5a2a14'), { amb: 0.5 }); P.ball(cx, 82, 3, 3, ramp('#e8a030'), { amb: 0.6 }); }
  // --- o SINO (casco) ---
  const by = 18 - lift + (sw ? 1 : 0), bh = 58, top = by, bot = by + bh;
  const half = y => { const k = (y - top) / bh; return 12 + k * 24 + (k > 0.85 ? (k - 0.85) * 40 : 0); };
  for (let y = top; y <= bot; y++) { const hw = half(y); for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) {
    const u = (x - cx) / hw, nz = Math.sqrt(Math.max(0, 1 - u * u)), I = 0.2 + 0.8 * Math.max(0, -u * 0.55 + nz * 0.65 - (y - top) / bh * 0.15);
    // azinhavre (verde) escorrendo de cima, em manchas
    const pat = hash(x >> 2, (y + (x >> 3)) >> 2, 11) % 10 < (y < top + 16 ? 6 : 3);
    P.p(x, y, P.tone(pat ? AZ : BZ, I, x, y));
  } }
  P.ball(cx, top + 1, 12, 5, BZ, { clip: (x, y) => y < top + 2 }); P.cyl(cx - 4, top - 8, 8, 9, BZ);   // cabeça e asa do sino
  P.ball(cx, top - 9, 5, 4, BZ, { clip: (x, y) => Math.hypot(x + 0.5 - cx, y + 0.5 - top + 9) > 2.4 });
  // frisos e a inscrição meio apagada
  for (const yy of [top + 14, top + 40, bot - 3]) { const hw = half(yy); for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) { P.p(x, yy, BZ[4 - (x > cx ? 2 : 0)]); P.p(x, yy + 1, BZ[1]); } }
  for (let i = 0; i < 9; i++) if (i !== 4) { const x = cx - 18 + i * 4; P.rect(x, top + 27, 2, 4, BZ[1]); }
  // cracas e algas penduradas
  for (const [x, y] of [[cx - 20, top + 46], [cx + 16, top + 50], [cx - 6, top + 52], [cx + 24, top + 34], [cx - 26, top + 36]]) { P.ball(x, y, 2.2, 2, ramp('#d8d0c0')); P.p(x, y, '#5a5040'); }
  for (let i = 0; i < 7; i++) { const x = Math.round(cx - 30 + i * 10), L = 6 + (i * 5) % 10; for (let j = 0; j < L; j++) P.p(x + Math.round(Math.sin(j * 0.6 + i + sw) * 1.5), bot + j - 2, ramp('#2a5a3a')[1 + (j % 3)]); }
  // boca do sino: escuro e os dois olhos de âmbar
  const my = bot - 2;
  for (let x = Math.round(cx - half(bot)) + 2; x <= Math.round(cx + half(bot)) - 2; x++) P.p(x, my, '#0a0608');
  const eyeY = my - (ph >= 2 ? 0 : 5), eh = hurt ? 0 : atk ? 2 : 1;
  for (const ex of [cx - 9, cx + 9]) { P.ball(ex, eyeY, 3.2, 1.5 + eh * 0.4, ['#5a2a08', '#a85a10', '#f0a030', '#ffd870', '#fff8d0'], { amb: 0.5 }); P.p(ex, eyeY, '#fff8d0'); }
  // fase 3: rachadura vazando luz e silhuetas (lembranças da cidade)
  if (ph >= 3) {
    let x = cx + 6, y = top + 4; const glow = ['#7a3a08', '#c87a1a', '#f0b040', '#ffe08a', '#fff8e0'];
    for (let i = 0; i < 26; i++) { P.p(x, y, glow[3]); P.p(x + 1, y, glow[2]); x += (i % 3) - 1; y += 2; }
    for (const [sx, sy] of [[cx - 14, top + 22], [cx + 2, top + 30], [cx + 16, top + 20]]) { P.ball(sx, sy, 2.2, 2.2, glow, { amb: 0.6 }); P.rect(sx - 2, sy + 2, 5, 6, glow[2]); }
  }
  if (hurt) for (let i = 0; i < 6; i++) P.p(cx - 20 + i * 8, top + 10 + (i % 2) * 6, '#ffffff');
  P.outline();
  return P.canvas();
}
// a corrente que prende um aliado (alvo separado na fase 2)
let CORR_C = null;
function correnteArt() {
  if (CORR_C) return CORR_C;
  const P = new Pix(22, 60), CH = ramp('#6a6a7a');
  for (let y = 0; y < 60; y += 5) P.ball(11 + Math.round(Math.sin(y * 0.15) * 3), y + 2, 3, 3.5, CH, { clip: (a, b) => Math.hypot(a + 0.5 - 11 - Math.sin(y * 0.15) * 3, b + 0.5 - y - 2) > 1.3 });
  for (let i = 0; i < 5; i++) P.p(8 + i, 20 + i * 8, ramp('#9a4a2a')[2]);                          // ferrugem
  return CORR_C = P.outline().canvas();
}
// o Caçador da Guilda e o Pavio, para batalha (humanos do gerador, olhando para a esquerda)
const CAC_HUM = { hat: '#2a2a3a', coat: '#3a3a4a', hair: '#2a1a1a', top: '#5a4a3a', bottom: '#2a2a30', skin: '#d8a070', extra: (P, o) => { if (o.view === 's') { P.line(o.cx - 8, o.tT + 8, o.cx + 4, o.tT + 8, '#6a4a2a'); P.rect(o.cx - 9, o.tT + 6, 2, 5, '#8a8a9a'); } } };
