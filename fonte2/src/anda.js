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
  if (!f.mv) return paradoQuadro(fr, f.dir === 'left' || f.dir === 'right', W2.t + (f.k === 'rita' ? 30 : 0));
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
  const paleta = (ya, yb) => { const n = new Map(); for (let y = ya; y < yb; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (D[i + 3] < 128 || pele(i) || lum(i) < 0.1) continue; const k = D[i] + ',' + D[i + 1] + ',' + D[i + 2]; n.set(k, (n.get(k) || 0) + 1); } return [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k.split(',').map(Number)).sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2])); };
  const cabY = Math.round(h * 0.36), corpoY = Math.round(h * 0.74);
  const CAB = paleta(0, Math.round(h * 0.2)), CAPA = paleta(cabY, corpoY);
  const c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h), O = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; if (!D[i + 3]) continue;
    let col = [D[i], D[i + 1], D[i + 2]];
    const borda = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= w || Y >= h || !D[(Y * w + X) * 4 + 3]; });
    const L = lum(i), contorno = L < 0.1 && (borda || y >= corpoY);
    // contorno fica; o resto: cabeça vira cabelo; peito vira capa (vista de trás); pernas ficam
    if (!contorno && y < cabY && CAB.length) col = CAB[Math.min(CAB.length - 1, Math.floor(L * 1.6 * CAB.length))];
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
