// ================= PASSE VISUAL "HLD" NO MAPA (referência de estilo: vídeo de Hyper Light Drifter enviado pelo usuário) =================
// Só o ESTILO, nada copiado. O que veio da análise quadro a quadro:
//  - chão em áreas grandes e chapadas (pouco ruído), bordas orgânicas em degraus entre grama e caminho, tufos de grama
//    claros e pontinhos quadrados espalhados; sombras chapadas e translúcidas, deslocadas para baixo/direita.
//  - ar vivo: partículas quadradas boiando devagar (de noite, vaga-lumes), vinheta suave nas bordas; salas pequenas
//    flutuam num vazio escuro com um brilho de cor por baixo.
//  - movimento: câmera com folga que olha para onde se anda, poeira ao arrancar/virar, baú que estica e achata no pulo,
//    sombra oval que encolhe no ar, e a CAPA/cachecol da forma humana esvoaçando atrás com atraso (física de corrente).

// ---------- chão: achatar o ruído, bordas orgânicas, tufos, pontinhos, sombra de muro ----------
const CHAO_PISO = new Set(['tab', 'tabV', 'pedra', 'grama', 'lodo']);
function rgbMedio(d, x0, y0, W_) { let r = 0, g = 0, b = 0, n = 0; for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const i = ((y0 + y) * W_ + x0 + x) * 4; if (d[i + 3]) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; } } return n ? [r / n, g / n, b / n] : null; }
const hex3 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const RAMPA_CHAO = {
  pedra: ['#2c2846', '#4a4870', '#6e6c94', '#9a96b8', '#c8c2da'].map(hex3),     // calçamento: lavanda e ardósia
  lodo: ['#1e3238', '#2e5450', '#4a7a6c', '#78a08a', '#a8c8b0'].map(hex3),      // lodo: verde-água apagado
  tab: ['#3a2234', '#6a3a48', '#9a5e5e', '#c8887a', '#ecc0a2'].map(hex3),       // tábuas: salmão e rosa queimado
  tabV: ['#3a2234', '#6a3a48', '#9a5e5e', '#c8887a', '#ecc0a2'].map(hex3),
  grama: ['#0c3038', '#145a5a', '#22887a', '#4ab894', '#96e4bc'].map(hex3)      // grama: verde-azulado
};
function rampa(R, L) { const f = L * (R.length - 1), i = Math.floor(f), k = f - i, a = R[i], b = R[Math.min(R.length - 1, i + 1)]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
function passeChao(m) {
  const c = m.baked, x = c.getContext('2d'), W_ = c.width, img = x.getImageData(0, 0, W_, c.height), d = img.data;
  const T = (tx, ty) => tileOf(m, tx, ty), med = {};
  // 1) paleta HLD: cada tipo de piso vira uma rampa de 5 tons pastéis (mapa de gradiente pela luminância) e o ruído
  //    é achatado puxando a luz de cada pixel para a média do tile. Resultado: áreas grandes e chapadas, cor de "pintura".
  for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
    const t = T(tx, ty); if (t.water || t.solid || !CHAO_PISO.has(t.t)) continue;
    const a = rgbMedio(d, tx * 16, ty * 16, W_); if (!a) continue;
    const ramp = RAMPA_CHAO[t.t] || RAMPA_CHAO.pedra, La = (a[0] * 0.3 + a[1] * 0.59 + a[2] * 0.11) / 255;
    let r = 0, g = 0, b = 0;
    for (let y = 0; y < 16; y++) for (let xx = 0; xx < 16; xx++) {
      const i = ((ty * 16 + y) * W_ + tx * 16 + xx) * 4, L = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255;
      const Lf = Math.max(0, Math.min(0.999, 0.5 + (L - La) * (t.t === 'pedra' ? 0.42 : t.t === 'grama' ? 0.7 : 0.55) + (La - 0.35) * 0.5)), q = rampa(ramp, Lf);
      d[i] = q[0] * 0.82 + d[i] * 0.18; d[i + 1] = q[1] * 0.82 + d[i + 1] * 0.18; d[i + 2] = q[2] * 0.82 + d[i + 2] * 0.18;
      r += d[i]; g += d[i + 1]; b += d[i + 2];
    }
    med[tx + ',' + ty] = [r / 256, g / 256, b / 256];
  }
  x.putImageData(img, 0, 0);
  const R = (a, b, s) => hash(a, b, s) % 1000 / 1000, cor = a => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`, tom = (a, k) => `rgb(${Math.min(255, a[0] * k) | 0},${Math.min(255, a[1] * k) | 0},${Math.min(255, a[2] * k) | 0})`;
  for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
    const t = T(tx, ty), a = med[tx + ',' + ty]; if (!a) continue;
    const X = tx * 16, Y = ty * 16;
    // 2) grama derrama sobre o caminho vizinho em degraus de 2 px (borda orgânica, sem contorno)
    if (t.t === 'grama') {
      x.fillStyle = cor(a);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = T(tx + dx, ty + dy); if (n.water || n.solid || n.t === 'grama' || !CHAO_PISO.has(n.t)) continue;
        for (let k = 0; k < 16; k += 2) {
          const prof = [0, 2, 2, 4, 2, 6, 4, 2][Math.floor(R(tx * 7 + k, ty * 5 + dx * 3 + dy, 41) * 8)];
          if (!prof) continue;
          if (dx) x.fillRect(dx > 0 ? X + 16 : X - prof, Y + k, prof, 2); else x.fillRect(X + k, dy > 0 ? Y + 16 : Y - prof, 2, prof);
        }
      }
      // pontinhos quadrados e tufos claros
      for (let k = 0; k < 2; k++) if (R(tx, ty, 50 + k) < 0.5) { x.fillStyle = tom(a, 1.22); x.fillRect(X + 2 + Math.floor(R(tx, ty, 60 + k) * 12), Y + 2 + Math.floor(R(tx, ty, 70 + k) * 12), 1, 1); }
      if (R(tx, ty, 80) < 0.34) tufo(x, X + 3 + Math.floor(R(tx, ty, 81) * 9), Y + 8 + Math.floor(R(tx, ty, 82) * 6), '#8af0c0', '#2a9a80');
    }
    // 3) mato teimoso entre as pedras e as tábuas (cidade velha)
    else if ((t.t === 'pedra' || t.t === 'lodo') && R(tx, ty, 90) < 0.07) tufo(x, X + 4 + Math.floor(R(tx, ty, 91) * 8), Y + 9 + Math.floor(R(tx, ty, 92) * 5), '#7ad8a0', '#2a7a60');
    // 4) sombra chapada ao pé do muro (encosto)
    const cima = T(tx, ty - 1); if (cima.solid && cima.t === 'muro') { x.fillStyle = 'rgba(20,10,40,0.26)'; x.fillRect(X, Y, 16, 4); x.fillStyle = 'rgba(20,10,40,0.12)'; x.fillRect(X, Y + 4, 16, 2); }
    const esq = T(tx - 1, ty); if (esq.solid && esq.t === 'muro') { x.fillStyle = 'rgba(20,10,40,0.12)'; x.fillRect(X, Y, 3, 16); }
  }
}
function tufo(x, px, py, claro, escuro) {
  x.fillStyle = escuro; x.fillRect(px, py + 2, 5, 1);
  x.fillStyle = claro; x.fillRect(px, py - 1, 1, 3); x.fillRect(px + 2, py - 3, 1, 5); x.fillRect(px + 4, py - 1, 1, 3); x.fillRect(px + 1, py - 2, 1, 1); x.fillRect(px + 3, py - 4, 1, 1);
}
{ const _bm = bakeMap; bakeMap = function (m) { const novo = !m.baked; _bm(m); if (novo && m.baked) try { passeChao(m); } catch (e) { console.error(e); } }; }

// ---------- sombras dos objetos grandes (silhueta chapada para baixo/direita) e poeira ----------
const SILH = new WeakMap();
function silhueta(img) {
  if (SILH.has(img)) return SILH.get(img);
  const c = mk(img.width, img.height), x = c.getContext('2d'); x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#140a28'; x.fillRect(0, 0, c.width, c.height);
  SILH.set(img, c); return c;
}
const POE = [];
function poeiraMapa(px, py, n, dir) {
  const [dx, dy] = DIR2[dir] || [0, 0];
  for (let i = 0; i < n; i++) POE.push({ x: px + rand(-3, 3), y: py + rand(-1, 1), vx: -dx * rand(0.2, 0.7) + rand(-0.3, 0.3), vy: -dy * rand(0.1, 0.4) - rand(0.05, 0.25), t: 0, life: 18 + Math.floor(rand(0, 10)), s: Math.random() < 0.4 ? 2 : 1 });
}
HOOK_CHAO = function (m, ox, oy) {
  // sombra dos objetos: só os que têm "corpo" (altos), para não sujar cartaz de parede
  bx.globalAlpha = 0.16;
  for (const pr of m.props || []) { const im = pr.img(); if (!im || im.height < 14 || pr.semSombra) continue; const X = Math.round(pr.x * TS - ox + (pr.dx || 0)), Y = Math.round(pr.y * TS - oy - im.height + (pr.dy || 0)); if (X > W || Y > H || X + im.width < -8 || Y + im.height < -8) continue; bx.drawImage(silhueta(im), X + 5, Y + 3); }
  bx.globalAlpha = 1;
  // poeira: quadradinhos que sobem e somem
  for (let i = POE.length - 1; i >= 0; i--) {
    const p = POE[i]; p.t++; p.x += p.vx; p.y += p.vy; p.vx *= 0.92;
    if (p.t > p.life) { POE.splice(i, 1); continue; }
    bx.globalAlpha = 0.55 * (1 - p.t / p.life); bx.fillStyle = ehNoite() ? '#b8b0d0' : '#f4ead8'; bx.fillRect(Math.round(p.x - ox), Math.round(p.y - oy), p.s, p.s);
  }
  bx.globalAlpha = 1;
};
// arrancar, virar e pousar levantam poeira
{ const _ts = tryStep; tryStep = function (nx, ny) {
  const parado = !W2._andou || W2.t - W2._andou > 3, virou = W2._dir0 && W2._dir0 !== W2.dir;
  const r = _ts(nx, ny);
  if (!W2.float && (parado || virou)) poeiraMapa(W2.x * TS + 8 - (nx - W2.x) * 8, W2.y * TS + 15, parado ? 5 : 3, W2.dir);
  W2._dir0 = W2.dir; return r;
}; }
{ const _ar = arrived; arrived = function () { W2._andou = W2.t; W2._passo = (W2._passo || 0) + 1; if (!W2.float && (!deRosto() || W2._passo % 2 === 0)) poeiraMapa(W2.px + 8, W2.py + 15, deRosto() ? 1 : 2, W2.dir); return _ar(); }; }

// ---------- ar: partículas boiando, vinheta, vazio das salas pequenas ----------
const MOTES = [];
let VINH = null, VINH_W = 0;
HOOK_AR = function (m, ox, oy) {
  const noite = ehNoite(), dentro = m.w * TS < W || m.h * TS < H, alvo = dentro ? 14 : 34;
  while (MOTES.length < alvo) MOTES.push({ x: ox + rand(-20, W + 20), y: oy + rand(-20, H + 20), f: rand(0, 6.28), v: rand(0.08, 0.25), s: Math.random() < 0.4 ? 2 : 1 });
  if (MOTES.length > alvo) MOTES.length = alvo;
  for (const p of MOTES) {
    p.f += 0.02; p.x += Math.sin(p.f) * 0.15 + p.v * 0.4; p.y -= p.v * (noite ? 0.3 : 0.6);
    let sx = p.x - ox, sy = p.y - oy;
    if (sx < -24) p.x += W + 40; else if (sx > W + 24) p.x -= W + 40;
    if (sy < -24) p.y += H + 40; else if (sy > H + 24) p.y -= H + 40;
    sx = p.x - ox; sy = p.y - oy;
    const brilho = 0.35 + 0.35 * Math.sin(p.f * 3);
    bx.globalAlpha = noite ? 0.5 + brilho * 0.6 : (dentro ? 0.25 : 0.4) + brilho * 0.3;
    bx.fillStyle = noite ? (p.s > 1 ? '#ffe08a' : '#fff4c0') : dentro ? '#ffe8c8' : (p.s > 1 ? '#bff8e8' : '#ffffff');
    bx.fillRect(Math.round(sx), Math.round(sy), p.s, p.s);
    if (noite && p.s > 1) { bx.globalAlpha *= 0.3; bx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 4, 4); }
  }
  bx.globalAlpha = 1;
  // vinheta suave
  if (!VINH || VINH_W !== W) { VINH_W = W; VINH = mk(W, H); const x = VINH.getContext('2d'), g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.72); g.addColorStop(0, 'rgba(12,6,28,0)'); g.addColorStop(1, 'rgba(12,6,28,0.55)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  bx.drawImage(VINH, 0, 0);
};
// sala pequena: vazio escuro com um brilho de cor por baixo (no lugar da estampa de runas)
const VAZIO_COR = { taverna: '#6a2a2a', bazar: '#4a2a5a', casaGraca: '#2a3a5a', igreja: '#3a2a5a' };
function vazioHLD(m, cx, cy) {
  bx.fillStyle = '#0a0612'; bx.fillRect(0, 0, W, H);
  const mx = -cx + m.w * TS / 2, my = -cy + m.h * TS / 2, r = Math.max(m.w, m.h) * TS * 0.75, g = bx.createRadialGradient(mx, my, r * 0.2, mx, my, r);
  g.addColorStop(0, VAZIO_COR[W2.id] || '#3a2448'); g.addColorStop(1, 'rgba(10,6,18,0)'); bx.fillStyle = g; bx.fillRect(0, 0, W, H);
  // pontinhos de "estrela" no vazio
  for (let i = 0; i < 18; i++) { const sx = hash(i, 3, 5) % W, sy = hash(i, 7, 5) % H; bx.fillStyle = (W2.t / 20 + i) % 7 < 1 ? '#ffffff' : 'rgba(255,255,255,0.25)'; bx.fillRect(sx, sy, 1, 1); }
}

// ---------- capa / cachecol da forma humana: corrente com atraso que esvoaça atrás ----------
const CAPA = { p: null };
function corCapa() { const k = rostoKey(), F = FIG_ROSTO[k.body] || FIG_ROSTO.bastiao; return F.look === 'scarf' ? ['#e04848', '#9a2028'] : F.look === 'armor' ? ['#8a90a8', '#4a5068'] : [F.top, '#0a0612']; }
function capaHLD(x, y, fr, frente) {
  // ponto de amarração: o pescoço (≈ 19 px abaixo do topo da arte)
  const ax = x + 8, ay = y + 16 - fr.height + 20, N = 10;
  if (!CAPA.p || Math.abs(CAPA.p[0].x - ax) > 30 || Math.abs(CAPA.p[0].y - ay) > 30) CAPA.p = Array.from({ length: N }, (_, i) => ({ x: ax, y: ay + i * 2 }));
  const mv = W2.mv, vx = mv ? Math.sign(mv.tx - mv.fx) : 0, vy = mv ? Math.sign(mv.ty - mv.fy) : 0;
  CAPA.p[0].x = ax; CAPA.p[0].y = ay;
  if (!frente) for (let i = 1; i < N; i++) {
    const a = CAPA.p[i - 1], p = CAPA.p[i], sway = Math.sin(W2.t / (mv ? 4 : 14) + i * 0.9) * (mv ? 1.2 : 0.5) * i / N;
    // alvo: atrás do movimento (vento), caindo um pouco quando parado
    const tx = a.x - vx * 3.4 + sway, ty = a.y + (mv ? 1.1 - vy * 2.6 : 2.6);
    const k = 0.55 - i * 0.05; p.x += (tx - p.x) * k; p.y += (ty - p.y) * k;
  }
  if (frente !== (vy < 0)) return;                            // de costas (subindo) a capa fica na frente
  const [c1, c2] = corCapa();
  for (let i = N - 1; i >= 1; i--) {
    const a = CAPA.p[i - 1], p = CAPA.p[i], w = Math.max(2, Math.round(6 - i * 0.45));
    bx.fillStyle = c2; bx.fillRect(Math.round(p.x - w / 2), Math.round(p.y) + 1, w, 2);
    bx.fillStyle = c1; bx.fillRect(Math.round((a.x + p.x) / 2 - w / 2), Math.round((a.y + p.y) / 2), w, 2); bx.fillRect(Math.round(p.x - w / 2), Math.round(p.y), w, 1);
  }
}

// ================= PERSONAGENS E OBJETOS NO ESTILO HLD =================
// 1) PINTURA CHAPADA: enquanto a arte do MAPA é gerada (tiles, moradores, construções), o pintor troca o pontilhado
//    por faixas chapadas de cor (como no HLD).
//    A arte de batalha (chefes com mais detalhe) continua com o pontilhado de antes.
let PINTA_CHAPADO = 0;
{ const _tone = Pix.prototype.tone; Pix.prototype.tone = function (R, I, x, y) {
  if (!PINTA_CHAPADO) return _tone.call(this, R, I, x, y);
  const n = R.length - 1, f = Math.max(0, Math.min(0.999, I)) * n, i = Math.floor(f), fr = f - i;
  return R[Math.min(n, fr > 0.55 ? i + 1 : i)];                                  // faixas chapadas, sem pontilhado
}; }
function chapado(fn) { return function () { PINTA_CHAPADO++; try { return fn.apply(this, arguments); } finally { PINTA_CHAPADO--; } }; }
tileArt = chapado(tileArt);
humano = chapado(humano);
// 2) GRADE DE COR HLD para sprites que vêm de imagem (grupo, baú, forma humana) e para tudo que é desenhado no mapa:
//    luz em poucos degraus (tira o ruído), sombras puxadas para o violeta, luzes para o quente, um pouco mais de cor,
//    contorno quase preto vira violeta-escuro.
function hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
function rgbDe(h, s, l) { if (!s) return [l * 255, l * 255, l * 255]; const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }; return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255]; }
const NIVEIS_L = [0.1, 0.2, 0.32, 0.45, 0.58, 0.7, 0.82, 0.93];
const MISTURA_H = (h, alvo, k) => { let d = alvo - h; if (d > 0.5) d -= 1; if (d < -0.5) d += 1; return (h + d * k + 1) % 1; };
const GRADE = new WeakMap();
function gradeHLD(c) {
  if (!c || !c.width) return c;
  if (GRADE.has(c)) return GRADE.get(c);
  const o = mk(c.width, c.height), x = o.getContext('2d'); x.drawImage(c, 0, 0);
  const im = x.getImageData(0, 0, o.width, o.height), d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    let [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    if (l < 0.13) { d[i] = 26; d[i + 1] = 16; d[i + 2] = 40; continue; }               // contorno
    let best = NIVEIS_L[0]; for (const v of NIVEIS_L) if (Math.abs(v - l) < Math.abs(best - l)) best = v; l = l * 0.35 + best * 0.65;
    if (l < 0.45) { h = MISTURA_H(h, 0.72, (0.45 - l) * (s < 0.15 ? 1.1 : 0.55)); s = Math.min(1, s + 0.12); }
    else if (l > 0.72) h = MISTURA_H(h, 0.1, (l - 0.72) * 0.35);
    s = Math.min(1, s * 1.12);
    const q = rgbDe(h, s, l); d[i] = q[0]; d[i + 1] = q[1]; d[i + 2] = q[2];
  }
  // luz de um lado só: borda esquerda/de cima clareia, borda direita escurece para o violeta (recorte nítido do HLD)
  let furo = false; for (let i = 3; i < d.length; i += 4) if (!d[i]) { furo = true; break; }
  if (furo && o.width >= 10 && o.height >= 14) {
    const A = (xx, yy) => xx < 0 || yy < 0 || xx >= o.width || yy >= o.height ? 0 : d[(yy * o.width + xx) * 4 + 3], src = new Uint8ClampedArray(d);
    for (let yy = 0; yy < o.height; yy++) for (let xx = 0; xx < o.width; xx++) {
      const i = (yy * o.width + xx) * 4; if (!src[i + 3] || (src[i] === 26 && src[i + 1] === 16 && src[i + 2] === 40)) continue;
      const l1 = !A(xx - 1, yy) || (src[i - 4] === 26 && src[i - 3] === 16 && src[i - 2] === 40), r1 = !A(xx + 1, yy) || (src[i + 4] === 26 && src[i + 5] === 16 && src[i + 6] === 40);
      if (l1 && !r1) { d[i] = Math.min(255, src[i] * 1.18 + 14); d[i + 1] = Math.min(255, src[i + 1] * 1.14 + 12); d[i + 2] = Math.min(255, src[i + 2] * 1.1 + 10); }
      else if (r1 && !l1) { d[i] = src[i] * 0.72 + 10; d[i + 1] = src[i + 1] * 0.66 + 4; d[i + 2] = src[i + 2] * 0.8 + 22; }
    }
  }
  x.putImageData(im, 0, 0); GRADE.set(c, o); GRADE.set(o, o); return o;
}
// tiles que não são piso (muro, água, correnteza, escada) também passam pela grade
{ const _ta = tileArt; tileArt = function (k, v, f) { return gradeHLD(_ta(k, v, f)); }; }
// moradores: cada quadro já sai graduado
{ const _hu = humano; humano = function (key, o) { const out = _hu(key, o); if (!out._hld) { for (const vw of ['f', 'b', 's']) out[vw] = out[vw].map(gradeHLD); out._hld = true; } return out; }; }
// construções e objetos do mapa: gerados chapados e graduados (com cache)
{ const _mm = montarMapas2; montarMapas2 = function () {
  const r = _mm.apply(this, arguments);
  for (const m of Object.values(MAPS2)) for (const p of m.props || []) if (!p._hld) { const f = p.img, cache = new Map(); p.img = () => { let c; PINTA_CHAPADO++; try { c = f(); } finally { PINTA_CHAPADO--; } return c ? gradeHLD(c) : c; }; p._hld = true; }
  return r;
}; }
// grupo e baú no mapa
{ const _fs = folSprite; folSprite = function (f) { const fr = _fs(f); return fr ? gradeHLD(fr) : fr; }; }
{ const _ra = rostoArte; rostoArte = function () { const A = _ra(); if (A && !A._hld) { A.body = A.body.map(gradeHLD); A._hld = true; } return A; }; }
function gradeBauMapa() { if (IMG._bauHLD || !IMG.chestMap) return; for (const D of Object.values(IMG.chestMap)) for (const dir of Object.keys(D)) D[dir] = D[dir].map(gradeHLD); IMG._bauHLD = true; }
{ const _dp = drawPlayer; drawPlayer = function (ox, oy) { gradeBauMapa(); return _dp(ox, oy); }; }
