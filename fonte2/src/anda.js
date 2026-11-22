// ================= CAMINHAR E CORRER NO MAPA (Lume, Rita e o baú de rosto) =================
// (pedidos do usuário: Lume e Rita "arrastadas"; a animação "muito acelerada"; joystick todo empurrado = CORRER, só um
// pouco = ANDAR, mais devagar; a forma humana do baú não tinha COSTAS e andava de costas.)
// - A arte herdada da T1 só tem quadros parados. Cada quadro vira um ciclo de 4 quadros gerado por pixel: de lado as
//   pernas abrem em tesoura; de frente/costas um pé levanta de cada vez; nos quadros de passagem o corpo sobe.
//   ANDAR: passada curta, balanço de 1 px. CORRER: passada longa, balanço de 2 px e o tronco inclinado para a frente.
// - O quadro do ciclo segue a DISTÂNCIA percorrida (uma passada por tile), não o relógio: andar devagar = pernas devagar.
// - Velocidade: joystick >= 80% (ou teclado) corre (7 quadros por tile); menos que isso anda (13 por tile). Os seguidores
//   acompanham o mesmo ritmo do jogador.
// - COSTAS da forma humana: geradas da arte de frente (o rosto e o peito viram cabelo e capa, pela paleta da própria
//   arte); de lado ela continua a arte de frente espelhada.
const ANDA_C = new WeakMap();
function lerPixels(src) {
  const w = src.width, h = src.height, c = mk(w, h), x = c.getContext('2d'); x.drawImage(src, 0, 0);
  return { w, h, D: x.getImageData(0, 0, w, h).data };
}
// um quadro gerado: pernas (leg -1..1), corpo subindo, tronco inclinado e as partes SOLTAS (cabelo, capa, barra da
// roupa: tudo que fica longe do eixo do corpo) balançando numa onda que desce pelo corpo com atraso
function geraQuadro(P, o) {
  const { w, h, D, pernaY, meio, eixo } = P, c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h), O = img.data;
  const put = (x, y, i) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const j = (y * w + x) * 4; O[j] = D[i]; O[j + 1] = D[i + 1]; O[j + 2] = D[i + 2]; O[j + 3] = D[i + 3]; };
  for (let pass = 0; pass < 2; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; if (!D[i + 3]) continue;
    const perna = y >= pernaY; if ((pass === 0) === perna) continue;
    let nx = x, ny = y - o.sobe;
    if (!perna) {
      if (o.inclina) nx += Math.round((1 - y / pernaY) * o.inclina);
      const solto = Math.max(0, Math.min(1, (Math.abs(x - eixo[y]) - w * 0.16) / (w * 0.22)));
      if (solto > 0 && o.onda) { const peso = solto * (0.35 + 0.65 * y / pernaY); nx += Math.round(peso * o.onda * Math.sin(o.fase - y * 0.22)); ny += Math.round(peso * o.onda * 0.5 * Math.max(0, Math.sin(o.fase * 2 - y * 0.2))); }
    } else if (o.leg) {
      const q = (y - pernaY) / Math.max(1, h - 1 - pernaY), esq = x < meio;
      if (o.lado) nx = x + Math.round(q * o.amp * o.leg) * (esq ? -1 : 1);
      else if ((o.leg > 0) === esq) ny = y - o.sobe - Math.round(q * (o.amp + 1) * Math.abs(o.leg));
    }
    put(nx, ny, i);
  }
  cx.putImageData(img, 0, 0); return c;
}
function prepAnda(src) {
  const { w, h, D } = lerPixels(src), pernaY = h - Math.round(h * 0.27);
  let x0 = w, x1 = -1;
  for (let y = h - 4; y < h; y++) for (let x = 0; x < w; x++) if (D[(y * w + x) * 4 + 3] > 0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  if (x1 < 0) { x0 = 0; x1 = w - 1; }
  // eixo do corpo em cada linha: o meio da silhueta (suavizado), para saber o que é "solto"
  const eixo = []; for (let y = 0; y < h; y++) { let a = w, b = -1; for (let x = 0; x < w; x++) if (D[(y * w + x) * 4 + 3]) { a = Math.min(a, x); b = x; } eixo.push(b < 0 ? w / 2 : (a + b) / 2); }
  for (let y = 1; y < h; y++) eixo[y] = eixo[y] * 0.5 + eixo[y - 1] * 0.5;
  return { w, h, D, pernaY, meio: (x0 + x1) / 2, eixo };
}
function andaFrames(src, lado, modo) {
  let cache = ANDA_C.get(src); if (!cache) { cache = {}; ANDA_C.set(src, cache); }
  const key = (lado ? 's' : 'f') + modo; if (cache[key]) return cache[key];
  const P = cache.P || (cache.P = prepAnda(src)), out = [];
  for (let k = 0; k < 8; k++) {
    const f = k / 8 * Math.PI * 2, s = Math.sin(f);
    if (modo === 'p') out.push(geraQuadro(P, { lado, leg: 0, sobe: 0, onda: 1, fase: f, amp: 0 }));
    else { const corre = modo === 'c'; out.push(geraQuadro(P, { lado, leg: s, amp: corre ? 4 : 2, sobe: Math.round((corre ? 2 : 1) * (1 - Math.abs(s))), inclina: corre && lado ? 2 : 0, onda: corre ? 2.4 : 1.6, fase: f * 2 })); }
  }
  return cache[key] = out;
}
// 8 quadros a cada 2 tiles andados (uma passada por tile); parado, o cabelo e a roupa balançam devagar
function andaQuadro(src, lado, dist, corre) { if (!src) return src; return andaFrames(src, lado, corre ? 'c' : 'a')[Math.floor(dist / 4) % 8]; }
function paradoQuadro(src, lado, t) { if (!src) return src; return andaFrames(src, lado, 'p')[Math.floor(t / 11) % 8]; }
const correndo = () => !!W2.corre;

// ---------- ritmo do jogador e dos seguidores ----------
function passoJogador() {
  W2.corre = JOYMAG >= 0.8;
  const n = W2.float ? (W2.corre ? 10 : 16) : (W2.corre ? 7 : 13);
  W2.passoN = n; return n;
}

// ---------- seguidores ----------
{ const _fsA = folSprite; folSprite = function (f) {
  const fr = _fsA(f);
  if (!fr || (f.k === 'lume' && LUSTRE_ON())) return fr;
  if (!f.mv && !W2.mv) return paradoQuadro(fr, f.dir === 'left' || f.dir === 'right', W2.t + (f.k === 'rita' ? 30 : 0));
  return andaQuadro(fr, f.dir === 'left' || f.dir === 'right', f.px + f.py + (f.k === 'rita' ? 8 : 0), correndo());
}; }

// ---------- forma humana do baú: costas geradas + caminhada ----------
const COSTAS_C = new WeakMap();
function costasDe(src) {
  if (COSTAS_C.has(src)) return COSTAS_C.get(src);
  const { w, h, D } = lerPixels(src);
  const lum = i => (D[i] * 0.3 + D[i + 1] * 0.59 + D[i + 2] * 0.11) / 255;
  const pele = i => { const r = D[i], g = D[i + 1], b = D[i + 2]; return r > g && g > b && r - b > 40 && r > 120; };
  // paleta do cabelo (topo) e da capa/roupa (meio), sem pele e sem contorno
  const paleta = (ya, yb) => { const n = new Map(); for (let y = ya; y < yb; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (D[i + 3] < 128 || pele(i) || lum(i) < 0.1 || (ya > 0 && typeof CACHECOL_COR !== 'undefined' && CACHECOL_COR && D[i] > 2 * D[i + 1] && D[i] > 1.3 * D[i + 2])) continue; const k = D[i] + ',' + D[i + 1] + ',' + D[i + 2]; n.set(k, (n.get(k) || 0) + 1); } return [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k.split(',').map(Number)).sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2])); };
  const cabY = Math.round(h * 0.36), corpoY = Math.round(h * 0.74);
  const CAB = paleta(0, Math.round(h * 0.2)), CAPA = paleta(cabY + 5, corpoY);
  const c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h), O = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; if (!D[i + 3]) continue;
    let col = [D[i], D[i + 1], D[i + 2]];
    const borda = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= w || Y >= h || !D[(Y * w + X) * 4 + 3]; });
    const L = lum(i), contorno = L < 0.1 && (borda || y >= corpoY);
    // contorno fica; o resto: cabeça vira cabelo; peito vira capa (vista de trás); pernas ficam
    if (!contorno && y < cabY && CAB.length) col = CAB[Math.min(CAB.length - 1, Math.floor(L * 1.6 * CAB.length))];
    else if (y >= cabY && y < cabY + 5) { /* a volta do cachecol aparece igual por trás */ }
    else if (!contorno && y < corpoY && CAPA.length) {
      // capa vista de trás: tecido liso com sombreado de cilindro e dobras verticais (nada do desenho do peito)
      let a = w, b = -1; for (let xx = 0; xx < w; xx++) if (D[(y * w + xx) * 4 + 3]) { a = Math.min(a, xx); b = xx; }
      const rel = (x - a) / Math.max(1, b - a), luz = 0.85 - rel * 0.6 - (((x - a) % 5 === 4) ? 0.25 : 0) + (y < cabY + 3 ? 0.15 : 0);
      col = CAPA[Math.max(0, Math.min(CAPA.length - 1, Math.round(luz * (CAPA.length - 1))))];
    }
    O[i] = col[0]; O[i + 1] = col[1]; O[i + 2] = col[2]; O[i + 3] = D[i + 3];
  }
  // costura do meio da capa e uma mecha de cabelo caindo na nuca, para ler como "de costas"
  const mx = Math.round(w / 2);
  for (let y = cabY + 2; y < corpoY - 2; y += 1) { const i = (y * w + mx) * 4; if (O[i + 3] && CAPA.length) { const d = CAPA[0]; O[i] = d[0]; O[i + 1] = d[1]; O[i + 2] = d[2]; } }
  cx.putImageData(img, 0, 0);
  COSTAS_C.set(src, c); return c;
}
{ const _rfA = rostoFrame; rostoFrame = function (moving) {
  let fr = _rfA(moving);
  if (!fr) return fr;
  if (W2.dir === 'up' && rostoArte()) fr = costasDe(fr);
  return moving ? andaQuadro(fr, false, W2.px + W2.py, correndo()) : paradoQuadro(fr, false, W2.t);
}; }

// ---------- forma humana: CACHECOL em vez de capa ----------
// (pedido do usuário: "parece que ele está com uma capa, e não com um cachecol".) A arte da T1 veste uma capa da cor
// da linha evolutiva. No mapa e na luta a capa vira ROUPA (mesma silhueta, recolorida com os tons escuros da própria
// roupa) e a cor dela fica só no CACHECOL: a volta no pescoço e uma ponta caindo na frente. A ponta solta que voa ao
// vento é a do capaHLD (física de corda), agora lida como a outra ponta do cachecol.
function hsl3(r, g, b) { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2; let h = 0, s = 0; if (M !== m) { const d = M - m; s = l > 0.5 ? d / (2 - M - m) : d / (M + m); h = M === r ? (g - b) / d + (g < b ? 6 : 0) : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
const CACHECOL_C = new WeakMap(); let CACHECOL_COR = null;
function cachecolDe(src) {
  if (CACHECOL_C.has(src)) return CACHECOL_C.get(src);
  const { w, h, D } = lerPixels(src), idx = (x, y) => (y * w + x) * 4;
  const pele = i => { const r = D[i], g = D[i + 1], b = D[i + 2]; return r > g && g > b && r - b > 40 && r > 120; };
  // 1) o queixo: última linha com pele na parte de cima; o cachecol começa logo abaixo
  let pesc = Math.round(h * 0.34);
  for (let y = Math.round(h * 0.15); y < Math.round(h * 0.45); y++) for (let x = 0; x < w; x++) if (D[idx(x, y) + 3] && pele(idx(x, y))) pesc = y + 1;
  let a0 = w, b0 = -1; for (let x = 0; x < w; x++) if (D[idx(x, pesc + 2) + 3]) { a0 = Math.min(a0, x); b0 = x; }
  const eixo0 = b0 < 0 ? w / 2 : (a0 + b0) / 2;
  // 2) a cor da capa: o tom saturado mais comum nas BORDAS do corpo (a capa cai pelos lados), sem pele
  const conta = new Map();
  for (let y = pesc + 2; y < Math.round(h * 0.78); y++) for (let x = 0; x < w; x++) { const i = idx(x, y); if (!D[i + 3] || pele(i) || Math.abs(x - eixo0) < 6) continue; const [hh, s, l] = hsl3(D[i], D[i + 1], D[i + 2]); if (s < 0.28 || l < 0.14) continue; const k = Math.round(hh / 20) % 18; conta.set(k, (conta.get(k) || 0) + 1); }
  const top = [...conta.entries()].sort((p1, p2) => p2[1] - p1[1])[0];
  if (!top) { CACHECOL_C.set(src, src); return src; }
  const hue = top[0] * 20, daCapa = i => { if (pele(i)) return false; const [hh, s, l] = hsl3(D[i], D[i + 1], D[i + 2]); const dh = Math.min(Math.abs(hh - hue), 360 - Math.abs(hh - hue)); return s >= 0.22 && l >= 0.1 && dh <= 30; };
  // 3) tons da roupa (o que não é capa nem pele no tronco) e tons da capa (para o cachecol)
  const tons = (filtro) => { const n = new Map(); for (let y = pesc; y < Math.round(h * 0.8); y++) for (let x = 0; x < w; x++) { const i = idx(x, y); if (!D[i + 3] || pele(i) || !filtro(i)) continue; const k = D[i] + ',' + D[i + 1] + ',' + D[i + 2]; n.set(k, (n.get(k) || 0) + 1); } return [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k.split(',').map(Number)).sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2])); };
  let ROUPA = tons(i => !daCapa(i) && hsl3(D[i], D[i + 1], D[i + 2])[2] > 0.08);
  const CAPA = tons(i => daCapa(i));
  if (ROUPA.length < 2) ROUPA = [[26, 20, 34], [44, 34, 56], [64, 50, 80]];
  const lum = i => (D[i] * 0.3 + D[i + 1] * 0.59 + D[i + 2] * 0.11) / 255;
  const c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h), O = img.data;
  for (let i = 0; i < D.length; i++) O[i] = D[i];
  // eixo do corpo na altura do pescoço
  let a = w, b = -1; for (let x = 0; x < w; x++) if (D[idx(x, pesc + 1) + 3]) { a = Math.min(a, x); b = x; }
  const eixo = b < 0 ? w / 2 : (a + b) / 2;
  for (let y = pesc; y < h; y++) for (let x = 0; x < w; x++) {
    const i = idx(x, y); if (!D[i + 3] || !daCapa(i)) continue;
    // asas da capa (longe do tronco, abaixo dos ombros) saem; o resto vira roupa
    if (Math.abs(x - eixo) > 11 && y > pesc + 5) { O[i + 3] = 0; continue; }
    const L = lum(i), q = Math.max(0, Math.min(ROUPA.length - 1, Math.round(L * 2.2 * (ROUPA.length - 1))));
    O[i] = ROUPA[q][0]; O[i + 1] = ROUPA[q][1]; O[i + 2] = ROUPA[q][2];
  }
  // 3b) silhueta de casaco: tudo que sobrou longe do tronco (pontas e contorno da capa) sai, e o recorte ganha contorno
  for (let y = pesc + 5; y < h - 2; y++) for (let x = 0; x < w; x++) if (Math.abs(x - eixo) > 11.5) O[idx(x, y) + 3] = 0;
  const contorno = [];
  for (let y = pesc + 5; y < h - 2; y++) for (let x = 0; x < w; x++) { const i = idx(x, y); if (O[i + 3]) continue; const viz = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < w && Y < h && O[idx(X, Y) + 3] && Math.abs(X - eixo) <= 11.5; }); if (viz && Math.abs(x - eixo) <= 12.5) contorno.push(i); }
  for (const i of contorno) { O[i] = 20; O[i + 1] = 12; O[i + 2] = 24; O[i + 3] = 255; }
  // 4) a volta do cachecol reforçada (2 linhas de dobra) e a ponta caindo na frente
  const C = CAPA.length ? CAPA : [[120, 20, 40], [180, 40, 60], [230, 80, 90]], cc = k => C[Math.max(0, Math.min(C.length - 1, k))];
  const set = (x, y, col) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const i = idx(x, y); O[i] = col[0]; O[i + 1] = col[1]; O[i + 2] = col[2]; O[i + 3] = 255; };
  for (let x = Math.round(eixo - 5); x <= Math.round(eixo + 5); x++) { set(x, pesc, cc(C.length - 1)); set(x, pesc + 1, cc(C.length - 2)); set(x, pesc + 2, cc(1)); set(x, pesc + 3, cc(0)); }
  set(Math.round(eixo - 6), pesc + 1, [20, 12, 24]); set(Math.round(eixo + 6), pesc + 1, [20, 12, 24]);
  const px = Math.round(eixo + 2);
  for (let y = pesc + 3; y < pesc + 14; y++) { const sw = Math.round(Math.sin((y - pesc) * 0.5) * 0.6); set(px - 1 + sw, y, [20, 12, 24]); set(px + sw, y, cc(C.length - 1)); set(px + 1 + sw, y, cc(C.length - 2)); set(px + 2 + sw, y, cc(0)); set(px + 3 + sw, y, [20, 12, 24]); }
  for (let x = px - 1; x <= px + 3; x++) set(x, pesc + 14, x % 2 ? cc(1) : [20, 12, 24]);   // franja
  cx.putImageData(img, 0, 0);
  const hx = v => '#' + v.map(n => n.toString(16).padStart(2, '0')).join(''); CACHECOL_COR = [hx(cc(C.length - 1)), hx(cc(0))];
  CACHECOL_C.set(src, c); return c;
}
// Linha do CARNICEIRO (a única cujo visual é "cachecol" na bíblia da T1, look 'scarf'): a arte tem uma capa vermelha
// por cima de um casaco roxo. Aqui a capa sai: o vermelho fica só no CACHECOL (volta no pescoço + ponta na frente),
// o corpo vira casaco roxo com mangas e mãos, a barra do casaco para nas pernas. Mesmas cores da arte original.
function cachecolCarniceiro(src) {
  if (CACHECOL_C.has(src)) return CACHECOL_C.get(src);
  const { w, h, D } = lerPixels(src), idx = (x, y) => (y * w + x) * 4;
  const O = new Uint8ClampedArray(D);
  const verm = i => { const r = D[i], g = D[i + 1], b = D[i + 2]; return D[i + 3] && r >= 0x2b && r > 2 * g && r > 1.3 * b; };
  const hexA = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const ROXO = ['#19091d', '#280d2c', '#37153a', '#421c49', '#542259', '#6a2e70'].map(hexA), VERM = ['#2b0416', '#5c0e2e', '#90123a', '#c62f53', '#e46a6d'].map(hexA), CONT = hexA('#100211');
  const PELE = ['#a76477', '#da8d9b', '#f4bbc3'].map(hexA);
  const set = (x, y, c) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const j = idx(x, y); O[j] = c[0]; O[j + 1] = c[1]; O[j + 2] = c[2]; O[j + 3] = 255; };
  const del = (x, y) => { O[idx(x, y) + 3] = 0; };
  const lum = i => (D[i] * 0.3 + D[i + 1] * 0.59 + D[i + 2] * 0.11) / 255;
  const ESQ = 12, DIR = 24;                         // o tronco
  for (let y = 19; y < h; y++) for (let x = 0; x < w; x++) {
    const i = idx(x, y); if (!D[i + 3]) continue;
    if (y <= 22) { if (x < 11 || x > 25) del(x, y); continue; }                       // volta do cachecol
    if (y >= 43) { if (verm(i) || x < 11 || x > 25) del(x, y); continue; }            // pernas e botas ficam
    if (x < ESQ || x > DIR) { del(x, y); continue; }                                   // asas da capa saem
    if (verm(i)) { const q = Math.max(0, Math.min(ROXO.length - 1, Math.round(lum(i) * 3.2 * (ROXO.length - 1)) + (x < 18 ? 1 : 0))); set(x, y, ROXO[q]); }
  }
  // barra do casaco: abre um pouco embaixo (rows 39-42)
  for (let y = 39; y <= 42; y++) { const ab = y - 38; for (const x of [ESQ - ab + 1, DIR + ab - 1]) if (x >= 0 && x < w) set(x, y, ROXO[x < 18 ? 2 : 1]); }
  // mangas e mãos
  for (let y = 23; y <= 37; y++) { const sw = y > 30 ? 1 : 0;
    set(ESQ - 2 - sw, y, ROXO[4]); set(ESQ - 1 - sw, y, ROXO[3]); set(DIR + 1 + sw, y, ROXO[2]); set(DIR + 2 + sw, y, ROXO[1]);
    if (y % 4 === 0) { set(ESQ - 1 - sw, y, ROXO[2]); set(DIR + 1 + sw, y, ROXO[1]); } }
  set(ESQ - 3, 37, ROXO[1]); set(DIR + 4, 37, ROXO[0]);
  for (const [hx, l] of [[ESQ - 3, 0], [DIR + 3, 1]]) { set(hx, 38, PELE[2 - l]); set(hx + 1, 38, PELE[1]); set(hx, 39, PELE[1]); set(hx + 1, 39, PELE[0]); }
  // cinto
  for (let x = ESQ; x <= DIR; x++) set(x, 33, x === 18 ? hexA('#c8a040') : ROXO[0]);
  // a ponta do cachecol caindo na frente, ondulando, com franja
  for (let y = 22; y <= 33; y++) { const o = Math.round(Math.sin((y - 22) * 0.45) * 0.7), x0 = 19 + o;
    set(x0 - 1, y, CONT); set(x0, y, VERM[4]); set(x0 + 1, y, VERM[3]); set(x0 + 2, y, VERM[2]); set(x0 + 3, y, CONT); if (y % 3 === 0) set(x0 + 1, y, VERM[2]); }
  for (let x = 18; x <= 22; x++) set(x, 34, x % 2 ? VERM[1] : CONT);
  // a volta: duas dobras bem marcadas
  for (let x = 12; x <= 24; x++) { set(x, 19, VERM[4 - (x > 20 ? 1 : 0)]); set(x, 20, VERM[3]); set(x, 21, VERM[2]); set(x, 22, VERM[1]); }
  set(11, 20, CONT); set(11, 21, CONT); set(25, 20, CONT); set(25, 21, CONT);
  // contorno novo em volta de tudo que mudou
  const ok = (x, y) => x >= 0 && y >= 0 && x < w && y < h && O[idx(x, y) + 3];
  const add = [];
  for (let y = 19; y < h; y++) for (let x = 0; x < w; x++) if (!ok(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => ok(x + dx, y + dy))) add.push([x, y]);
  for (const [x, y] of add) set(x, y, CONT);
  const c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h); img.data.set(O); cx.putImageData(img, 0, 0);
  CACHECOL_COR = ['#c62f53', '#5c0e2e'];
  CACHECOL_C.set(src, c); return c;
}
{ const _raC = rostoArte; rostoArte = function () {
  const A = _raC(); if (!A) return A;
  if (!A._cachecol) { A._cachecol = true; if (rostoKey().body === 'carniceiro') A.body = A.body.map(cachecolCarniceiro); }
  return A;
}; }
// a ponta que voa ao vento usa a cor do cachecol
{ const _cc = corCapa; corCapa = function () { if (rostoArte() && CACHECOL_COR) return CACHECOL_COR; return _cc(); }; }

// ---------- o baú fala ----------
// (pedido do usuário: "o baú não está tendo linhas de fala".) Falas com 'me' foram espalhadas pelas cenas dos Caps.
// 1-4. Aqui: escolha de diálogo entre aspas vira fala dita pelo baú (com retrato); e, de rosto, o retrato do diálogo
// é o rosto, não a tampa.
{ const _ch = choose; choose = async function (text, options, who, cancel) {
  const r = await _ch(text, options, who, cancel);
  const o = Array.isArray(options) && typeof options[r] === 'string' ? options[r].trim() : '';
  if (/^".+"$/.test(o)) await say(o.slice(1, -1), 'me');
  return r;
}; }
{ const _pm = WHO.me.portrait; WHO.me.portrait = () => { try { if (rostoSt().on && rostoArte() && rostoArte().port) return rostoArte().port[0]; } catch (e) { } return _pm(); }; }
