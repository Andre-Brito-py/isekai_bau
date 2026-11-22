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
// vitória-régia (enfeite na água, sem colisão)
const LIRIO_C = {};
function lirioArt(i) {
  const k = i % 3; if (LIRIO_C[k]) return LIRIO_C[k];
  const c = mk(20, 10), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  P('rgba(0,20,30,0.35)', 2, 6, 15, 3);
  P('#2f6a3a', 2, 3, 14, 5); P('#3e8a48', 3, 3, 12, 3); P('#1f4a2a', 9, 3, 1, 3);
  if (k !== 1) { P('#2f6a3a', 12, 6, 7, 3); P('#3e8a48', 13, 6, 5, 1); }
  if (k === 0) { P('#f0a8c8', 6, 1, 3, 3); P('#ffffff', 7, 1, 1, 1); P('#e8c040', 7, 2, 1, 1); }
  if (k === 2) { P('#ffffff', 5, 1, 3, 3); P('#e8c040', 6, 2, 1, 1); }
  return (LIRIO_C[k] = c);
}
// chaminé de tijolo saindo do telhado
let CHAM_C = null;
function chamineArt() {
  if (CHAM_C) return CHAM_C;
  const c = mk(14, 26), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  P('rgba(0,0,0,0.3)', 3, 23, 11, 3);
  P('#6a3a2a', 2, 4, 10, 20); P('#8a4a34', 2, 4, 3, 20);
  for (let y = 6; y < 24; y += 4) { P('#4a2a1e', 2, y, 10, 1); P('#4a2a1e', 6 + ((y / 4) % 2) * 3, y - 3, 1, 3); }
  P('#3a3a44', 1, 1, 12, 4); P('#5a5a66', 1, 1, 12, 1); P('#1a1418', 4, 2, 6, 2);
  return (CHAM_C = c);
}
// o relógio da feira, afundado até o mostrador
let RELA_C = null;
function relogioAfundadoArt() {
  if (RELA_C) return RELA_C;
  const c = mk(36, 44), x = c.getContext('2d'), P = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  P('#4a4058', 6, 10, 24, 30); P('#5e5470', 6, 10, 4, 30); P('#2e2838', 26, 10, 4, 30);
  P('#3a3448', 4, 6, 28, 5); P('#6a6080', 4, 6, 28, 1); P('#c8a040', 16, 0, 4, 6); P('#e8c860', 17, 0, 2, 2);
  x.fillStyle = '#e8e0d0'; x.beginPath(); x.arc(18, 22, 8, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#3a3040'; x.lineWidth = 1; x.beginPath(); x.arc(18, 22, 8, 0, Math.PI * 2); x.stroke();
  P('#2a2030', 18, 16, 1, 7); P('#2a2030', 18, 22, 5, 1); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P('#5a5060', Math.round(18 + Math.cos(a) * 6.5), Math.round(22 + Math.sin(a) * 6.5), 1, 1); }
  P('rgba(40,90,150,0.85)', 0, 34, 36, 10); P('rgba(140,190,240,0.8)', 2, 34, 10, 1); P('rgba(140,190,240,0.8)', 20, 35, 12, 1);
  P('#3e8a48', 6, 32, 3, 3); P('#2f6a3a', 27, 30, 2, 5);
  return (RELA_C = c);
}
