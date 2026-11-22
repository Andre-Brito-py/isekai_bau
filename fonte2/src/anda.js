// ================= CICLO DE CAMINHADA NO MAPA (Lume, Rita e o baú de rosto) =================
// (pedido do usuário: "rita e lume não têm animação de caminhada, estão sendo arrastadas".) A arte herdada da T1 só
// tem quadros parados. Aqui cada quadro parado vira um ciclo de 4 passos gerado por pixel, sem redesenhar ninguém:
// DE LADO as pernas abrem em tesoura (a de trás vai para trás, a da frente para a frente, mais no pé que no quadril);
// DE FRENTE/COSTAS um pé levanta de cada vez. Nos quadros de "passagem" o corpo sobe 1 px (o balanço do passo).
const ANDA_C = new WeakMap();
function andaFrames(src, lado) {
  let cache = ANDA_C.get(src); if (!cache) { cache = {}; ANDA_C.set(src, cache); }
  const key = lado ? 's' : 'f'; if (cache[key]) return cache[key];
  const w = src.width, h = src.height, sx = src.getContext ? src.getContext('2d') : null;
  let D;
  if (sx) D = sx.getImageData(0, 0, w, h).data; else { const c = mk(w, h); c.getContext('2d').drawImage(src, 0, 0); D = c.getContext('2d').getImageData(0, 0, w, h).data; }
  const pernaY = h - Math.round(h * 0.27);
  // colunas das pernas: o que tem pixel nas últimas linhas
  let x0 = w, x1 = -1;
  for (let y = h - 4; y < h; y++) for (let x = 0; x < w; x++) if (D[(y * w + x) * 4 + 3] > 0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  if (x1 < 0) { x0 = 0; x1 = w - 1; }
  const meio = (x0 + x1) / 2;
  const out = [];
  for (let k = 0; k < 4; k++) {
    const c = mk(w, h), cx = c.getContext('2d'), img = cx.createImageData(w, h), O = img.data;
    const sobe = k % 2 === 1 ? 1 : 0, lance = k === 0 ? 1 : k === 2 ? -1 : 0;
    const put = (x, y, i) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const j = (y * w + x) * 4; O[j] = D[i]; O[j + 1] = D[i + 1]; O[j + 2] = D[i + 2]; O[j + 3] = D[i + 3]; };
    // corpo primeiro, pernas por cima
    for (let pass = 0; pass < 2; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; if (!D[i + 3]) continue;
      const perna = y >= pernaY; if ((pass === 0) === perna) continue;
      let nx = x, ny = y - sobe;
      if (perna && lance) {
        const q = (y - pernaY) / Math.max(1, h - 1 - pernaY), esq = x < meio;
        if (lado) nx = x + Math.round(q * 3) * (esq ? -lance : lance);
        else if ((lance > 0) === esq) ny = y - sobe - Math.round(q * 3);
      }
      put(nx, ny, i);
    }
    cx.putImageData(img, 0, 0); out.push(c);
  }
  return cache[key] = out;
}
function andaQuadro(src, lado, t) { if (!src) return src; return andaFrames(src, lado)[Math.floor(t / 4) % 4]; }
// seguidores (Lume humana e Rita): andando, usa o ciclo; parados, o quadro de sempre
{ const _fsA = folSprite; folSprite = function (f) {
  const fr = _fsA(f);
  if (!fr || !f.mv || (f.k === 'lume' && LUSTRE_ON())) return fr;
  return andaQuadro(fr, f.dir === 'left' || f.dir === 'right', W2.t + (f.k === 'rita' ? 10 : 0));
}; }
// o baú de rosto (arte da T1 de frente): mesmo ciclo, visto de frente
{ const _rfA = rostoFrame; rostoFrame = function (moving) {
  const fr = _rfA(moving);
  return moving && fr ? andaQuadro(fr, false, W2.t) : fr;
}; }
