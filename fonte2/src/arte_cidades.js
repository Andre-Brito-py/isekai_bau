// ================= ARTE DAS CIDADES REFEITAS (varais, canteiros) =================
// varal: dois postes de madeira e roupa pendurada balançando de leve (3 tiles de largura)
const VARAL_C = [];
function varalArt() {
  const f = Math.floor((typeof W2 !== 'undefined' ? W2.t : 0) / 30) % 2;
  if (VARAL_C[f]) return VARAL_C[f];
  const c = mk(48, 44), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  P('rgba(0,0,0,0.3)', 3, 42, 3, 2); P('rgba(0,0,0,0.3)', 42, 42, 3, 2);
  P('#4a3020', 3, 6, 2, 37); P('#6a4a30', 3, 6, 1, 37); P('#4a3020', 43, 6, 2, 37); P('#6a4a30', 43, 6, 1, 37);
  for (let i = 0; i <= 38; i++) { const y = 8 + Math.round(Math.sin(i / 38 * Math.PI) * 4); P('#d8d0c0', 5 + i, y, 1, 1); }
  const roupas = [[9, '#c84a5a', 8, 10], [19, '#e8e0d0', 7, 12], [28, '#4a7ab8', 9, 9], [38, '#e8c050', 4, 6]];
  for (const [rx, cor, w, h] of roupas) {
    const y = 9 + Math.round(Math.sin((rx - 5) / 38 * Math.PI) * 4), d = f && rx % 2 ? 1 : 0;
    P(cor, rx + d, y, w, h); P('rgba(0,0,0,0.18)', rx + d, y + h - 2, w, 2); P('rgba(255,255,255,0.25)', rx + d, y, w, 1);
    P('#8a8a8a', rx + 1, y - 1, 1, 2); P('#8a8a8a', rx + w - 2, y - 1, 1, 2);
  }
  return (VARAL_C[f] = c);
}
// canteiro: caixote de pedra com flores (variações de cor)
const CANT_C = {};
function canteiroArt(i) {
  const k = i % 4; if (CANT_C[k]) return CANT_C[k];
  const c = mk(24, 22), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  const flor = [['#e86890', '#ffb0c8'], ['#f0c040', '#fff0a0'], ['#a878e8', '#d8c0ff'], ['#e8e0f0', '#ffffff']][k];
  P('rgba(0,0,0,0.3)', 2, 20, 21, 2);
  P('#5a5260', 1, 12, 22, 8); P('#7a7280', 1, 12, 22, 2); P('#4a4250', 1, 18, 22, 2);
  P('#3a2a1a', 3, 11, 18, 2);
  for (let j = 0; j < 7; j++) { const fx = 3 + j * 3 - (j % 2), fy = 4 + ((j * 5) % 4); P('#3a6a3a', fx + 1, fy + 2, 1, 11 - fy); P('#4a8a4a', fx, fy + 4, 1, 1); P(flor[0], fx, fy, 3, 3); P(flor[1], fx + 1, fy, 1, 1); }
  return (CANT_C[k] = c);
}
