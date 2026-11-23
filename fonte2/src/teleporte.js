// ================= TELETRANSPORTE DA MAGIA ESPACIAL (pedido do usuário: "caprichar nas artes de teletransporte") =================
// A viagem pelos Marcos, entrar e sair da base: o baú DOBRA o espaço. Três tempos:
//  SAÍDA: um círculo de runas abre no chão; um RASGO violeta (o Vão) se abre em cima da tampa; partículas e flocos do mapa
//  espiralam para dentro; a Lume e a Rita são puxadas (esticam, encolhem, giram) para dentro do baú; o baú dobra num
//  ponto de luz; a tela DOBRA como página de livro, com vinco brilhante e runas no vinco.
//  O VÃO: um instante dentro do espaço dobrado: fundo violeta com vincos de papel, runas boiando, estrelas, e o nome do
//  destino escrito no meio, como numa etiqueta.
//  CHEGADA: a página desdobra; o círculo de runas abre no chão; um ponto de luz vira rasgo; o baú salta para fora (poeira,
//  anel); a Lume e a Rita saem esticando de dentro da tampa. O mesmo vocabulário vale para o Vão de bolso (objetos).
const TP = { on: false, fase: null, t: 0, n: 0, fim: null, sx: 0, sy: 0, fols: [], dest: '', semBau: false, semFol: false };
const TPC = { v: '#c8a0ff', v2: '#8a5ae8', v3: '#4a2a8a', fundo: '#160c2a', luz: '#f4ecff', ciano: '#8fe3ff', ouro: '#ffd070' };
{ const _wb = worldBusy2; worldBusy2 = function () { return TP.on || _wb(); }; }
{ const _dp = drawPlayer; drawPlayer = function (ox, oy) { if (TP.on && TP.semBau) return; return _dp(ox, oy); }; }
function tpQuadros(fase, n) { return new Promise(r => { Object.assign(TP, { fase, t: 0, n, fim: r }); }); }
async function teleporte(map, x, y, dir) {
  if (TP.on) { loadMap2(map, x, y, dir); return; }
  W2.mv = null; TP.on = true; TP.semBau = false; TP.semFol = false; TP.fols = W2.fol.map(f => ({ k: f.k, px: f.px, py: f.py, dir: f.dir, fr: folSprite(f) }));
  TP.dest = (MAPS2[map] && MAPS2[map].name) || '';
  try {
    sfx('rune'); await tpQuadros('saida', 56);
    sfx('door'); await tpQuadros('meio', 30);
    loadMap2(map, x, y, dir); TP.semBau = true; TP.semFol = true;
    TP.fols = W2.fol.map((f, i) => ({ k: f.k, fr: folSprite(f), dx: (i ? 14 : -14), dy: 6 }));
    sfx('rune'); await tpQuadros('chegada', 50);
  } finally { TP.on = false; TP.semBau = false; TP.semFol = false; V.fade = 0; }
}
// os seguidores somem enquanto estão "dentro" (o desenho do efeito cuida deles)
{ const _fsT = folSprite; folSprite = function (f) { if (TP.on && TP.semFol) return null; return _fsT(f); }; }
// ---------- desenho ----------
function tpCirculo(cx, cy, r, rot, a) {
  if (r <= 0.5) return; bx.globalAlpha = a;
  for (let i = 0; i < 48; i++) { const an = i / 48 * Math.PI * 2; bx.fillStyle = i % 2 ? TPC.v : TPC.v2; bx.fillRect(Math.round(cx + Math.cos(an) * r), Math.round(cy + Math.sin(an) * r * 0.42), 1, 1); }
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2 + rot; const x = cx + Math.cos(an) * (r - 3), y = cy + Math.sin(an) * (r - 3) * 0.42; bx.fillStyle = i % 3 === 0 ? TPC.ouro : TPC.luz; bx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); if (i % 3 === 0) bx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3); }
  const r2 = r * 0.62; for (let i = 0; i < 32; i++) { const an = i / 32 * Math.PI * 2 - rot * 1.5; if (i % 4 === 3) continue; bx.fillStyle = TPC.ciano; bx.fillRect(Math.round(cx + Math.cos(an) * r2), Math.round(cy + Math.sin(an) * r2 * 0.42), 1, 1); }
  for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2 + rot * 0.7; bx.fillStyle = TPC.v; bx.fillRect(Math.round(cx + Math.cos(an) * r2 * 0.5) - 1, Math.round(cy + Math.sin(an) * r2 * 0.21), 2, 1); }
  bx.globalAlpha = 1;
}
function tpRasgo(cx, cy, w, h, t, a) {
  if (w <= 0.5 || h <= 0.5) return; bx.globalAlpha = a;
  // halo
  bx.globalCompositeOperation = 'lighter'; bx.fillStyle = 'rgba(160,110,255,0.18)'; bx.beginPath(); bx.ellipse(cx, cy, w * 1.9, h * 1.15, 0, 0, Math.PI * 2); bx.fill(); bx.globalCompositeOperation = 'source-over';
  // o rasgo: um losango com bordas irregulares (o espaço rasgado)
  bx.fillStyle = TPC.fundo; bx.beginPath();
  for (let i = 0; i <= 16; i++) { const k = i / 16, yy = cy - h + k * 2 * h, ww = w * Math.sin(k * Math.PI) * (1 + (i % 2 ? 0.12 : -0.08) * Math.sin(t * 0.3 + i)); bx.lineTo(cx + ww, yy); }
  for (let i = 16; i >= 0; i--) { const k = i / 16, yy = cy - h + k * 2 * h, ww = w * Math.sin(k * Math.PI) * (1 + (i % 2 ? -0.08 : 0.12) * Math.sin(t * 0.3 + i)); bx.lineTo(cx - ww, yy); }
  bx.closePath(); bx.fill();
  // dentro: estrelas e um vinco
  for (let i = 0; i < 10; i++) { const k = ((i * 37 + t * 2) % 100) / 100, yy = cy - h + k * 2 * h, ww = w * Math.sin(k * Math.PI) * 0.7, xx = cx + ((i * 53) % 21 - 10) / 10 * ww; bx.fillStyle = i % 3 ? TPC.luz : TPC.ciano; bx.fillRect(Math.round(xx), Math.round(yy), 1, 1); }
  bx.fillStyle = 'rgba(200,160,255,0.5)'; bx.fillRect(Math.round(cx), Math.round(cy - h * 0.8), 1, Math.round(h * 1.6));
  // borda brilhante
  bx.strokeStyle = TPC.v; bx.lineWidth = 1; bx.beginPath();
  for (let i = 0; i <= 16; i++) { const k = i / 16; bx.lineTo(cx + w * Math.sin(k * Math.PI), cy - h + k * 2 * h); }
  for (let i = 16; i >= 0; i--) { const k = i / 16; bx.lineTo(cx - w * Math.sin(k * Math.PI), cy - h + k * 2 * h); }
  bx.closePath(); bx.stroke();
  bx.fillStyle = TPC.luz; bx.fillRect(Math.round(cx) - 1, Math.round(cy - h) - 1, 3, 3); bx.fillRect(Math.round(cx) - 1, Math.round(cy + h) - 1, 3, 3);
  bx.globalAlpha = 1;
}
// as DOBRAS do espaço: losangos de vinco que saem (ou entram) do baú, como papel sendo dobrado
function tpDobras(cx, cy, t, a, sentido) {
  if (a <= 0) return;
  for (let k = 0; k < 4; k++) { const ph = ((t * 0.9 * sentido + k * 14) % 56 + 56) % 56, r = 8 + ph * 1.6, al = a * Math.max(0, 1 - ph / 56) * 0.8; if (al <= 0.02) continue;
    bx.globalAlpha = al; bx.strokeStyle = k % 2 ? TPC.v : TPC.ciano; bx.lineWidth = 1; bx.beginPath(); const rot = t * 0.02 * sentido + k;
    for (let i = 0; i <= 4; i++) { const an = rot + i / 4 * Math.PI * 2; const x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r * 0.55; i ? bx.lineTo(x, y) : bx.moveTo(x, y); } bx.stroke();
    bx.fillStyle = TPC.luz; for (let i = 0; i < 4; i++) { const an = rot + i / 4 * Math.PI * 2; bx.fillRect(Math.round(cx + Math.cos(an) * r) - 1, Math.round(cy + Math.sin(an) * r * 0.55) - 1, 2, 2); } }
  bx.globalAlpha = 1;
}
function tpEspiral(cx, cy, p, n, R, sentido) { for (let i = 0; i < n; i++) { const q = (p + i / n) % 1, rr = R * (sentido > 0 ? 1 - q : q), an = i * 2.4 + q * 6 * sentido; bx.globalAlpha = Math.min(1, (sentido > 0 ? q : 1 - q) * 1.5); bx.fillStyle = i % 4 === 0 ? TPC.ouro : i % 2 ? TPC.v : TPC.luz; bx.fillRect(Math.round(cx + Math.cos(an) * rr), Math.round(cy + Math.sin(an) * rr * 0.6), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1); } bx.globalAlpha = 1; }
function tpSprite(fr, x, y, sx, sy, rot, a) { if (!fr || sx <= 0.02 || sy <= 0.02 || a <= 0) return; bx.save(); bx.globalAlpha = a; bx.translate(Math.round(x), Math.round(y)); bx.rotate(rot); bx.scale(sx, sy); bx.drawImage(fr, -fr.width / 2, -fr.height); bx.restore(); }
// a página que dobra: duas metades escuras fechando do lado, com vinco de luz e runas
function tpPagina(p, abre) {
  const meia = W / 2, d = Math.round(meia * p);
  bx.fillStyle = TPC.fundo; bx.fillRect(0, 0, d, H); bx.fillRect(W - d, 0, d, H);
  for (let y = 0; y < H; y += 6) { bx.fillStyle = 'rgba(40,20,80,0.6)'; bx.fillRect(0, y, d, 1); bx.fillRect(W - d, y, d, 1); }
  bx.fillStyle = TPC.v; bx.fillRect(d - 1, 0, 1, H); bx.fillRect(W - d, 0, 1, H);
  bx.fillStyle = TPC.luz; for (let y = (W2.t * 3) % 24; y < H; y += 24) { bx.fillRect(d - 2, y, 3, 2); bx.fillRect(W - d - 1, y + 12, 3, 2); }
  if (p > 0.85) { bx.fillStyle = `rgba(244,236,255,${(p - 0.85) / 0.15 * 0.9})`; bx.fillRect(Math.round(meia) - 1, 0, 2, H); }
}
function tpVao(t, n) {
  bx.fillStyle = TPC.fundo; bx.fillRect(0, 0, W, H);
  for (let i = 0; i < 8; i++) { const x = ((i * 67 + t * 1.5) % (W + 60)) - 30; bx.fillStyle = 'rgba(120,80,200,0.25)'; bx.beginPath(); bx.moveTo(x, 0); bx.lineTo(x + 40, H); bx.lineTo(x + 41, H); bx.lineTo(x + 1, 0); bx.fill(); }
  for (let i = 0; i < 60; i++) { const x = (i * 97 + t * (1 + i % 3)) % W, y = (i * 53 + Math.sin(t * 0.05 + i) * 6) % H; bx.fillStyle = i % 5 ? 'rgba(244,236,255,0.7)' : TPC.ciano; bx.fillRect(Math.round(x), Math.round(y), 1, 1); }
  for (let i = 0; i < 7; i++) { const x = W / 2 + Math.cos(t * 0.04 + i) * (60 + i * 10), y = H / 2 + Math.sin(t * 0.05 + i * 1.7) * (30 + i * 6); bx.fillStyle = i % 2 ? TPC.ouro : TPC.v; bx.fillRect(Math.round(x) - 2, Math.round(y), 5, 1); bx.fillRect(Math.round(x), Math.round(y) - 2, 1, 5); }
  // no meio, um baú de luz atravessa o vão, de tampa aberta
  const q = t / n, x = W * (0.2 + q * 0.6), y = H / 2 + Math.sin(q * Math.PI * 2) * 10;
  bx.globalCompositeOperation = 'lighter'; bx.fillStyle = 'rgba(200,160,255,0.25)'; bx.beginPath(); bx.arc(x, y, 18, 0, Math.PI * 2); bx.fill(); bx.globalCompositeOperation = 'source-over';
  bx.fillStyle = TPC.luz; bx.fillRect(Math.round(x - 7), Math.round(y - 3), 14, 8); bx.fillStyle = TPC.v; bx.fillRect(Math.round(x - 7), Math.round(y - 8), 14, 4); bx.fillStyle = TPC.ouro; bx.fillRect(Math.round(x - 1), Math.round(y - 1), 2, 2);
  for (let i = 1; i < 12; i++) { bx.fillStyle = i % 2 ? 'rgba(244,236,255,0.6)' : 'rgba(200,160,255,0.5)'; bx.fillRect(Math.round(x - i * 5), Math.round(y + Math.sin((q - i * 0.02) * Math.PI * 2) * 10 - 1 + (i % 3)), 2, 1); }
}
{ const _arTP = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arTP ? _arTP(m, ox, oy) : undefined;
  if (!TP.on || !TP.fase) return r;
  const t = TP.t, n = TP.n, cx = W2.px - ox + 8, cy = W2.py - oy + 14;
  if (TP.fase === 'saida') {
    tpDobras(cx, cy - 14, t, Math.min(1, t / 20), 1); tpCirculo(cx, cy, Math.min(1, t / 14) * 34, t * 0.08, Math.min(1, t / 8) * (t > 46 ? Math.max(0, (52 - t) / 6) : 1));
    if (t > 6) { const q = Math.min(1, (t - 6) / 16); tpRasgo(cx, cy - 20, 3 + q * 13, 4 + q * 26, t, t > 44 ? Math.max(0, (50 - t) / 6) : 1); }
    if (t > 4 && t < 46) tpEspiral(cx, cy - 20, ((t - 4) / 40) % 1, 44, 72, 1);
    // os seguidores sendo puxados
    if (t >= 10) { TP.semFol = true; for (const [i, f] of TP.fols.entries()) { const q = Math.min(1, Math.max(0, (t - 10 - i * 4) / 18)), e = q * q; const x = (f.px - ox + 8) + (cx - (f.px - ox + 8)) * e, y = (f.py - oy + 15) + (cy - 14 - (f.py - oy + 15)) * e;
      tpSprite(f.fr, x, y, Math.max(0, 1 - e * 1.1), 1 + e * 0.8 - e * e * 1.4, (i ? 1 : -1) * e * 1.2, 1 - Math.max(0, (q - 0.85) / 0.15)); if (q > 0.1 && q < 1) for (let k = 0; k < 3; k++) { bx.fillStyle = TPC.v; bx.fillRect(Math.round(x + (k - 1) * 4), Math.round(y - 10 + k * 3), 1, 2); } } }
    // o baú dobra
    if (t === 34) { TP.semBau = true; sfx('item'); }
    if (t >= 30 && t < 42) { const q = (t - 30) / 12; bx.fillStyle = TPC.luz; const hh = Math.round(22 * (1 - q) + 2), ww = Math.max(1, Math.round(10 * (1 - q * q))); bx.fillRect(Math.round(cx - ww / 2), Math.round(cy - hh), ww, hh); bx.globalCompositeOperation = 'lighter'; bx.fillStyle = `rgba(200,160,255,${0.5 * (1 - q)})`; bx.beginPath(); bx.arc(cx, cy - 10, 16 * (1 - q) + 4, 0, Math.PI * 2); bx.fill(); bx.globalCompositeOperation = 'source-over'; }
    if (t >= 40 && t < 46) { const q = (t - 40) / 6; for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2; bx.fillStyle = i % 2 ? TPC.luz : TPC.ciano; bx.fillRect(Math.round(cx + Math.cos(an) * q * 30), Math.round(cy - 14 + Math.sin(an) * q * 18), 2, 2); } }
    if (t > 38) tpPagina(Math.min(1, (t - 38) / 18), false);
  } else if (TP.fase === 'meio') {
    tpVao(t, n);
  } else if (TP.fase === 'chegada') {
    if (t < 18) tpPagina(1 - t / 18, true);
    tpDobras(cx, cy - 14, t, Math.min(1, t / 12), -1); tpCirculo(cx, cy, Math.min(1, Math.max(0, t - 4) / 12) * 34, -t * 0.08, t > 40 ? Math.max(0, (50 - t) / 10) : 1);
    if (t > 8 && t < 40) { const q = t < 16 ? (t - 8) / 8 : t > 32 ? (40 - t) / 8 : 1; tpRasgo(cx, cy - 20, 1 + q * 14, 2 + q * 26, t, 1); }
    if (t > 8 && t < 30) tpEspiral(cx, cy - 20, ((t - 8) / 22) % 1, 40, 66, -1);
    if (t === 18) { TP.semBau = false; sfx('item'); V.shake = 2; }
    if (t >= 18 && t < 30) { const q = (t - 18) / 12; for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; bx.fillStyle = i % 2 ? '#d8d0c8' : '#a8a098'; bx.fillRect(Math.round(cx + Math.cos(an) * (6 + q * 18)), Math.round(cy + 1 + Math.sin(an) * (2 + q * 5)), 2, 1); } bx.strokeStyle = `rgba(200,160,255,${1 - q})`; bx.beginPath(); bx.ellipse(cx, cy + 1, 6 + q * 22, 2 + q * 8, 0, 0, Math.PI * 2); bx.stroke(); }
    // a Lume e a Rita saem esticando da tampa
    if (t >= 22) { for (const [i, f] of TP.fols.entries()) { const q = Math.min(1, Math.max(0, (t - 22 - i * 5) / 14)), e = 1 - (1 - q) * (1 - q); const x = cx + f.dx * e, y = cy - 12 + (12 + f.dy) * e; tpSprite(f.fr, x, y + 1, 0.2 + e * 0.8, 1.6 - e * 0.6, (i ? -1 : 1) * (1 - e) * 0.8, Math.min(1, q * 3)); } if (t >= 46) TP.semFol = false; }
  }
  TP.t++; if (TP.t >= TP.n && TP.fim) { const f = TP.fim; TP.fim = null; f(); }
  return r;
}; }
// ---------- o Vão de bolso (objetos): o mesmo rasgo, pequeno, e o objeto encolhendo para dentro ----------
{ const _gVT = guardarNoVao; guardarNoVao = function (e) { const img = e && e.spr ? e.spr.call(e) : null; const ok = _gVT(e); if (ok && VAO_FX.length) VAO_FX[VAO_FX.length - 1].img = img; return ok; }; }
{ const _pVT = porDoVao; porDoVao = function (x, y) { const ok = _pVT(x, y); if (ok && VAO_FX.length) { const en = W2.ents[W2.ents.length - 1]; VAO_FX[VAO_FX.length - 1].img = en && en.spr ? en.spr.call(en) : null; } return ok; }; }
{ const _arV = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arV ? _arV(m, ox, oy) : undefined;
  for (const f of VAO_FX) { const p = Math.min(1, f.t / 24), x = f.x - ox, y = f.y - oy, q = f.k === 'entra' ? p : 1 - p;
    tpRasgo(x, y - 4, 2 + 6 * Math.sin(p * Math.PI), 3 + 9 * Math.sin(p * Math.PI), W2.t, 1);
    tpEspiral(x, y - 4, p, 12, 18, f.k === 'entra' ? 1 : -1);
    if (f.img && f.k === 'entra') tpSprite(f.img, x, y + 10 - q * 12, Math.max(0, 1 - q), 1 + q * 0.6 - q * q, q * (f.k === 'entra' ? 2 : -2), 1 - q * 0.8);
  }
  return r;
}; }
