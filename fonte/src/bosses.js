// ================= CHEFES: SPRITES DE BATALHA DETALHADOS (48x48, 4 quadros) =================
// Na batalha eles aparecem com escala 2 (96px, o mesmo tamanho de antes), mas com 3x mais detalhe.
// Os sprites do mapa continuam os antigos.
function big(w, h, fn) {
  return [0, 1, 2, 3].map(f => cv4(w, h, (r, x) => {
    const E = (cx, cy, rx, ry, col) => { for (let yy = -ry; yy <= ry; yy++) { const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); r(Math.round(cx - hw), Math.round(cy + yy), hw * 2 + 1, 1, col); } };
    const EO = (cx, cy, rx, ry, col, ol = 'k') => { E(cx, cy, rx + 1, ry + 1, ol); E(cx, cy, rx, ry, col); };
    const L = (x0, y0, x1, y1, col, t = 1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) r(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), t, t, col); };
    fn({ r, E, EO, L, f, s: Math.sin(f * Math.PI / 2), c: Math.cos(f * Math.PI / 2) });
  }));
}
// tentáculo: bolinhas ao longo de uma curva, com ventosas
function tentacle(g, x0, y0, len, dir, ph, col, dark, suck) {
  // duas passadas: primeiro o contorno de todos os pedaços, depois o preenchimento (sem listras)
  const { E, r } = g, pts = []; let x = x0, y = y0;
  for (let i = 0; i < len; i++) { const t = i / len; x += dir * (0.5 + t * 0.6) + Math.sin(ph + i * 0.5) * 0.6; y += 0.95; pts.push([x, y, Math.max(1, Math.round(4.2 * (1 - t * 0.7)))]); }
  const [lx, ly] = pts[pts.length - 1]; const cx = lx + dir * 2, cy = ly - 1;
  for (const [px, py, rad] of pts) E(px, py, rad + 1, rad + 1, 'k');
  E(cx, cy, 2, 2, 'k');
  for (const [px, py, rad] of pts) E(px, py, rad, rad, col);
  E(cx, cy, 1, 1, col);
  pts.forEach(([px, py, rad], i) => { if (rad > 1) r(Math.round(px + dir * (rad - 1)), Math.round(py - 1), 1, 1, dark); if (i % 2 === 0 && rad > 1) r(Math.round(px - dir * (rad - 1)), Math.round(py), 1, 1, suck); });
}
const BIGSP = {
  // ---- Polvo do Camarote: cartola, monóculo, gravata-borboleta e binóculo de teatro ----
  octo: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, red = '#c83838', dk = '#8a2020', lt = '#ee7060', suck = '#f6c0b0';
    const ph = f * Math.PI / 2;
    tentacle(g, 13, 29, 15, -1, ph, red, dk, suck); tentacle(g, 19, 31, 14, -0.45, ph + 1, red, dk, suck);
    tentacle(g, 29, 31, 14, 0.45, ph + 2, red, dk, suck); tentacle(g, 35, 29, 15, 1, ph + 3, red, dk, suck);
    // braço que segura o binóculo de teatro
    L(12, 24, 6, 18 + Math.round(s), 'k', 3); L(12, 24, 6, 18 + Math.round(s), red, 2);
    r(1, 13 + Math.round(s), 10, 5, 'k'); r(2, 14 + Math.round(s), 3, 3, '#f0c040'); r(7, 14 + Math.round(s), 3, 3, '#f0c040'); r(5, 15 + Math.round(s), 2, 1, '#b88a20'); r(3, 15 + Math.round(s), 1, 1, '#bfe8f0'); r(8, 15 + Math.round(s), 1, 1, '#bfe8f0');
    // braço com uma rosa
    L(36, 26, 43, 20 - Math.round(s), 'k', 3); L(36, 26, 43, 20 - Math.round(s), red, 2); r(42, 15 - Math.round(s), 4, 4, 'k'); r(43, 16 - Math.round(s), 2, 2, '#e86890'); r(44, 19 - Math.round(s), 1, 4, '#4a9a4a');
    // manto (cabeça)
    EO(24, 20, 14, 13, red); E(24, 25, 13, 7, dk); E(24, 22, 12, 8, red); E(19, 12, 5, 3, lt); r(17, 11, 3, 1, '#ffffff');
    for (const [x, y] of [[13, 18], [33, 14], [30, 26], [16, 25], [36, 22]]) E(x, y, 1, 1, dk);
    // cartola
    r(15, 0, 18, 10, 'k'); r(16, 1, 16, 8, '#2a2638'); r(16, 1, 16, 1, '#4f4a66'); r(16, 6, 16, 2, '#c8962a'); r(12, 9, 24, 3, 'k'); r(13, 10, 22, 1, '#2a2638');
    // olhos: pálpebras de quem acha tudo isso abaixo do nível dele
    EO(18, 19, 4, 4, '#fff4dc'); E(31, 19, 6, 6, '#f0c040'); EO(31, 19, 4, 4, '#fff4dc');
    const lk = [0, 1, 0, -1][f]; r(17 + lk, 18, 3, 4, 'k'); r(30 + lk, 18, 3, 4, 'k'); r(17 + lk, 18, 1, 1, '#ffffff'); r(30 + lk, 18, 1, 1, '#ffffff');
    r(13, 14, 10, 4, red); r(26, 14, 10, 4, red); r(13, 17, 10, 1, dk); r(26, 17, 10, 1, dk);
    r(37, 21, 1, 9, '#f0c040'); r(38, 29, 1, 2, '#f0c040');
    // bigode enrolado e gravata
    r(18, 25, 12, 2, 'k'); r(16, 23, 3, 2, 'k'); r(29, 23, 3, 2, 'k'); r(15, 22, 2, 1, 'k'); r(31, 22, 2, 1, 'k');
    r(18, 30, 5, 5, 'k'); r(25, 30, 5, 5, 'k'); r(19, 31, 3, 3, '#7a48b0'); r(26, 31, 3, 3, '#7a48b0'); r(22, 31, 4, 3, 'k'); r(23, 32, 2, 1, '#c0a0f0');
  }),
  // ---- Guarda-Musgo: golem de pedra com musgo, olhos de lampião ----
  golem: burned => big(48, 48, g => {
    const { r, E, EO, f, s } = g, st = burned ? '#5a5050' : '#6a6078', sd = burned ? '#3a3434' : '#4f4a66', moss = burned ? '#3a3020' : '#4a9a4a', moss2 = burned ? '#2a2018' : '#2a5a3a';
    const up = Math.round(s * 2);
    EO(7, 26 - up, 6, 11, st); E(7, 32 - up, 5, 4, sd); EO(41, 26 + up, 6, 11, st); E(41, 32 + up, 5, 4, sd);
    r(4, 35 - up, 7, 5, 'k'); r(5, 36 - up, 5, 3, sd); r(37, 35 + up, 7, 5, 'k'); r(38, 36 + up, 5, 3, sd);
    EO(24, 30, 15, 15, st); E(24, 36, 14, 8, sd); E(24, 31, 13, 10, st);
    r(12, 43, 9, 5, 'k'); r(13, 43, 7, 4, sd); r(27, 43, 9, 5, 'k'); r(28, 43, 7, 4, sd);
    EO(24, 13, 11, 9, st); E(24, 17, 10, 4, sd);
    E(24, 6, 11, 4, moss); E(15, 9, 4, 3, moss); E(33, 8, 4, 3, moss2); E(20, 4, 3, 2, moss2); E(30, 20, 3, 2, moss); E(16, 34, 4, 2, moss); E(33, 38, 3, 2, moss2);
    for (const [x, y] of [[13, 7], [34, 10], [22, 2]]) { r(x, y, 1, 3, moss2); r(x - 1, y + 3, 3, 1, moss2); }
    const glow = burned ? '#ff8040' : f % 2 ? '#fff4c0' : '#f0c040';
    r(17, 12, 5, 4, 'k'); r(26, 12, 5, 4, 'k'); r(18, 13, 3, 2, glow); r(27, 13, 3, 2, glow);
    r(19, 19, 10, 2, 'k'); r(20, 19, 8, 1, sd);
    r(22, 26, 1, 6, sd); r(23, 31, 3, 1, sd); r(30, 24, 1, 4, sd); r(16, 28, 3, 1, sd); r(17, 28, 1, 4, sd);
    if (burned) for (const [x, y] of [[20, 6], [29, 5], [14, 28], [35, 30]]) r(x, y - (f % 2), 1, 2, '#ffb040');
  }),
  // ---- Capitã Brida: penacho vermelho, capa, espada e rede de caçadora ----
  brida: () => big(40, 48, g => {
    const { r, E, EO, L, f, s } = g, arm = '#9a93b0', armD = '#6a6078', cape = '#a02828', skin = '#d8a070';
    const fl = Math.round(s * 1.5);
    r(7, 16, 26, 28 + fl, 'k'); r(8, 17, 24, 26 + fl, cape); r(8, 17, 2, 26 + fl, '#7a1818'); r(30, 17, 2, 26 + fl, '#7a1818');
    r(13, 36, 6, 12, 'k'); r(21, 36, 6, 12, 'k'); r(14, 37, 4, 10, armD); r(22, 37, 4, 10, armD); r(13, 45, 6, 3, '#4a2a1c'); r(21, 45, 6, 3, '#4a2a1c');
    EO(20, 27, 9, 10, arm); r(12, 27, 16, 2, armD); r(19, 18, 2, 18, '#c8c0d8'); r(13, 34, 14, 3, 'k'); r(14, 35, 12, 1, '#7a4a2a'); r(19, 34, 2, 3, '#f0c040');
    EO(9, 22, 4, 4, armD); EO(31, 22, 4, 4, armD);
    // braço da espada
    r(31, 24, 4, 10, 'k'); r(32, 25, 2, 8, arm); r(31, 33, 4, 3, skin);
    const sy = f % 2 ? 0 : 1; r(33, 4 + sy, 2, 30, 'k'); r(33, 5 + sy, 1, 27, '#e8e4dc'); r(34, 6 + sy, 1, 24, '#b8b0c8'); r(30, 32 + sy, 8, 2, '#c8962a'); if (f === 1) r(32, 6, 1, 1, '#ffffff');
    // braço da rede
    r(5, 24, 4, 10, 'k'); r(6, 25, 2, 8, arm); for (let i = 0; i < 4; i++) { L(1, 32 + i * 3, 9, 32 + i * 3, '#7a6a4a'); L(1 + i * 3, 31, 1 + i * 3, 42, '#7a6a4a'); }
    // cabeça
    EO(20, 11, 6, 7, skin); r(14, 13, 12, 3, skin); r(17, 11, 2, 2, '#2a4a2a'); r(22, 11, 2, 2, '#2a4a2a'); r(17, 11, 1, 1, '#ffffff'); r(22, 11, 1, 1, '#ffffff');
    r(16, 9, 3, 1, '#5a1a10'); r(22, 9, 3, 1, '#5a1a10'); r(18, 15, 4, 1, '#8a3a3a'); r(23, 8, 1, 4, '#c87070');
    r(12, 3, 16, 7, 'k'); r(13, 4, 14, 5, armD); r(13, 4, 14, 1, arm); r(12, 9, 3, 6, 'k'); r(25, 9, 3, 6, 'k');
    r(24, 14, 6, 10, '#8a2a1a'); r(25, 15, 4, 8, '#a83a2a');
    const pl = Math.round(s); r(21, 0, 3, 5, 'k'); r(22, 0, 1, 4, '#c83838'); r(23 + pl, 0, 6, 3, '#c83838'); r(27 + pl, 1, 4, 2, '#ff6b6b'); r(29 + pl, 2, 3, 2, '#c83838');
  }),
  // ---- Carcereiro de Ferro-Velho: celas, cadeado-rosto, correntes e um molho de chaves ----
  jailer: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, ir = '#5d566e', ir2 = '#8a8099', dk = '#2a2638';
    const sw = Math.round(s * 2);
    for (let i = 0; i < 6; i++) L(4 + i * 7, 46, 6 + i * 7 + sw, 40, '#6a6078');
    r(6, 6, 36, 38, 'k'); r(7, 7, 34, 36, dk); for (let i = 9; i < 41; i += 4) r(i, 7, 2, 36, i % 8 === 1 ? ir2 : ir);
    r(7, 12, 34, 3, ir2); r(7, 34, 34, 3, ir2); r(7, 12, 34, 1, '#b8b0c8');
    r(4, 2, 40, 6, 'k'); r(5, 3, 38, 4, ir); r(5, 3, 38, 1, ir2); r(20, 0, 8, 4, 'k'); r(21, 1, 6, 2, '#c8962a');
    // cadeado-rosto
    E(24, 18, 5, 5, 'k'); E(24, 18, 3, 3, dk); r(17, 20, 14, 14, 'k'); r(18, 21, 12, 12, '#c8962a'); r(18, 21, 12, 2, '#f0c040'); r(23, 25, 2, 4, 'k'); E(24, 25, 1, 1, 'k');
    const eye = f % 2 ? '#ff7070' : '#ff3030'; r(11, 16, 4, 3, eye); r(33, 16, 4, 3, eye); r(11, 16, 4, 1, '#ffffff');
    // correntes e chaves
    for (let i = 0; i < 6; i++) { r(0 + (i % 2), 14 + i * 4, 4, 3, 'k'); r(1 + (i % 2), 15 + i * 4, 2, 1, ir2); }
    for (let i = 0; i < 6; i++) { r(44 - (i % 2), 14 + i * 4, 4, 3, 'k'); r(45 - (i % 2), 15 + i * 4, 2, 1, ir2); }
    E(42 + sw, 41, 4, 4, 'k'); E(42 + sw, 41, 3, 3, '#c8962a'); E(42 + sw, 41, 1, 1, 'k'); for (let i = 0; i < 4; i++) r(37 + sw + i * 3, 44, 1, 4, '#f0c040');
    r(14, 38, 20, 2, '#3a3440'); r(16, 40, 2, 3, '#ff5050');
  }),
  // ---- Cavaleiro Sem Nome: armadura antiga vazia, capa rasgada, lança e brilho vermelho ----
  knight: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, ar = '#4f4a66', ar2 = '#6a6078', ar3 = '#8a8099', rust = '#7a4a2a';
    const fl = Math.round(s * 2);
    r(10, 14, 24, 32, 'k'); r(11, 15, 22, 30, '#3a1820'); for (let i = 0; i < 5; i++) r(11 + i * 5, 40 + ((i + f) % 3), 3, 6, '#07050c');
    r(16, 38, 6, 10, 'k'); r(26, 38, 6, 10, 'k'); r(17, 39, 4, 8, ar); r(27, 39, 4, 8, ar);
    EO(24, 28, 10, 11, ar2); r(15, 23, 18, 2, ar3); r(23, 18, 2, 18, ar); E(19, 33, 2, 1, rust); E(29, 25, 2, 1, rust);
    EO(12, 21, 5, 4, ar2); EO(36, 21, 5, 4, ar2); r(10, 19, 4, 1, ar3); r(34, 19, 4, 1, ar3);
    r(8, 23, 5, 13, 'k'); r(9, 24, 3, 11, ar2); r(35, 23, 5, 13, 'k'); r(36, 24, 3, 11, ar2);
    L(40, 46, 46, 0, 'k', 3); L(41, 46, 46, 1, '#7a4a2a', 1); r(43, 0 + fl, 5, 7, 'k'); r(44, 1 + fl, 3, 5, '#b8b0c8'); r(39, 30, 8, 3, '#8a2a2a');
    EO(24, 11, 7, 8, ar2); r(17, 10, 14, 3, 'k'); r(19, 6, 10, 1, ar3);
    const glow = f % 2 ? '#ff7070' : '#ff3030'; r(19, 11, 3, 1, glow); r(26, 11, 3, 1, glow);
    for (let i = 18; i < 30; i += 2) r(i, 14, 1, 3, 'k');
    r(23, 0, 2, 4, 'k'); r(22, 0, 4, 1, '#8a2a2a'); r(20 + fl, 1, 3, 1, '#8a2a2a');
    r(30, 26, 3, 4, '#c0a0f0'); r(31, 30, 1, 3, '#c0a0f0');
  }),
  // ---- Inquisidora Maren: chapéu alto, livro aceso e tinta escorrendo ----
  maren: hat => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, coat = hat ? '#7a48b0' : '#5a3a7a', coatD = hat ? '#5a3090' : '#3a2050', gold = '#f0c040', skin = '#e8c0a0', hair = '#2a1a30';
    const fl = Math.round(s * 1.5);
    r(12, 18, 24, 30, 'k'); r(13, 19, 22, 29, coat); r(13, 19, 2, 29, coatD); r(33, 19, 2, 29, coatD); r(23, 19, 2, 29, gold); r(13, 44, 22, 1, gold);
    if (!hat) { r(15, 40, 3, 5, '#07050c'); r(30, 37, 3, 7, '#07050c'); r(14, 30, 1, 6, '#7a2a5a'); }
    r(9, 20 + fl, 5, 18, hair); r(34, 20 - fl, 5, 18, hair);
    // livro
    r(2, 26 - fl, 14, 12, 'k'); r(3, 27 - fl, 6, 10, '#e8dcc0'); r(9, 27 - fl, 6, 10, '#d8ccb0'); r(8, 27 - fl, 2, 10, '#5a3a2a');
    for (let i = 0; i < 4; i++) { r(4, 29 + i * 2 - fl, 4, 1, '#5a6ad0'); r(10, 29 + i * 2 - fl, 4, 1, '#5a6ad0'); }
    E(9, 24 - fl, 6, 3, hat ? 'rgba(160,140,255,0.55)' : 'rgba(255,140,160,0.5)');
    for (let i = 0; i < 3; i++) r(5 + i * 4, 38 - fl + ((f + i) % 3) * 2, 1, 2, '#3a2a6a');
    r(34, 28, 6, 4, skin); L(39, 28, 44, 20, 'k', 2); r(44, 18, 2, 3, '#f2ecdc');
    // rosto
    EO(24, 13, 6, 7, skin); r(18, 15, 12, 2, skin); r(20, 12, 3, 2, '#5a2a8a'); r(25, 12, 3, 2, '#5a2a8a'); r(20, 12, 1, 1, '#ffffff'); r(25, 12, 1, 1, '#ffffff');
    r(19, 10, 4, 1, hair); r(25, 10, 4, 1, hair); r(22, 17, 4, 1, '#7a2a5a');
    r(17, 6, 14, 4, hair); r(16, 8, 3, 12, hair); r(29, 8, 3, 12, hair);
    if (hat) { r(16, 0, 16, 7, 'k'); r(17, 0, 14, 6, '#3a2050'); r(17, 4, 14, 2, gold); r(11, 6, 26, 3, 'k'); r(12, 7, 24, 1, '#3a2050'); r(29, 1, 1, 3, '#c0a0f0'); }
    else { r(17, 4, 14, 3, hair); r(16, 3, 3, 2, hair); r(28, 2, 3, 3, hair); r(22, 2, 2, 3, hair); r(19, 13, 1, 1, '#7a2a5a'); }
  }),
  // ---- Carruagem Afogada: carruagem roxa, cavalo de ferrugem e sal, lampiões ----
  carro: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, bob = f % 2;
    r(17, 6 + bob, 30, 3, 'k'); r(18, 7 + bob, 28, 1, '#4f4a66');
    r(18, 8 + bob, 28, 22, 'k'); r(19, 9 + bob, 26, 20, '#3a2050'); r(19, 9 + bob, 26, 1, '#7a48b0');
    r(22, 12 + bob, 9, 8, 'k'); r(23, 13 + bob, 7, 6, f % 2 ? '#bfe8f0' : '#7ad0f0'); r(24, 14 + bob, 1, 2, '#ffffff');
    r(33, 12 + bob, 9, 14, 'k'); r(34, 13 + bob, 7, 12, '#5a3090'); r(39, 19 + bob, 1, 2, '#f0c040');
    r(44, 10 + bob, 4, 6, 'k'); r(45, 11 + bob, 2, 4, '#f0c040');
    for (const wx of [24, 40]) { EO(wx, 36, 6, 6, '#7a4a2a'); E(wx, 36, 4, 4, '#4a2a1c'); r(wx - 6, 36, 13, 1, '#7a4a2a'); r(wx, 30, 1, 13, '#7a4a2a'); E(wx, 36, 1, 1, 'k'); }
    r(22, 30, 2, 4, '#4a9a4a'); r(38, 29, 1, 5, '#4a9a4a'); r(44, 26, 1, 4, '#4a9a4a');
    // cavalo de ferrugem e sal
    const lg = [0, 2, 0, -2][f];
    EO(10, 26, 8, 6, '#8a5a34'); E(10, 24, 7, 2, '#a8704a'); r(5, 31, 3, 12 + lg, 'k'); r(6, 32, 1, 10 + lg, '#7a4a2a'); r(13, 31, 3, 12 - lg, 'k'); r(14, 32, 1, 10 - lg, '#7a4a2a');
    r(2, 14, 7, 12, 'k'); r(3, 15, 5, 10, '#8a5a34'); r(0, 12, 8, 6, 'k'); r(1, 13, 6, 4, '#a8704a'); r(2, 14, 1, 1, '#f0c040'); r(1, 16, 1, 1, '#ffb040');
    for (let i = 0; i < 4; i++) r(7 + i, 13 + i * 2, 2, 2, '#e8e4dc');
    L(15, 22, 19, 18, '#c8962a'); r(8, 22, 9, 1, '#5a3a2a');
    for (const [x, y] of [[9, 28], [12, 25], [4, 20]]) r(x, y, 1, 1, '#e8e4dc');
    E(20 + s * 3, 44, 18, 2, 'rgba(95,176,208,0.35)');
  }),
  // ---- Clara, de Sal: mulher de sal e água parada, cabelo subindo em fios ----
  clara: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, salt = '#e8e4dc', salt2 = '#c8d8e0', water = '#3a7090';
    for (let i = 0; i < 7; i++) { const x = 10 + i * 5 + Math.round(Math.sin(f + i) * 2); L(x, 14, x + Math.round(Math.sin(f * 1.3 + i) * 3), 0 + (i % 3), '#d8eef8'); }
    E(24, 44, 22, 4, water); E(24, 43, 20, 2, '#5fb0d0'); for (let i = 0; i < 5; i++) r(6 + i * 9 + f * 2 % 9, 42 + (i % 2), 3, 1, '#bfe8f0');
    r(13, 22, 22, 22, 'k'); r(14, 23, 20, 21, salt2); r(14, 23, 20, 3, salt); r(23, 26, 2, 18, '#a8c8d8');
    for (let i = 0; i < 4; i++) r(14 + i * 5, 38 + ((f + i) % 2), 2, 6, water);
    EO(24, 13, 9, 10, '#d8eef8'); E(24, 6, 9, 4, '#8ac0d8'); r(15, 8, 3, 12, '#8ac0d8'); r(30, 8, 3, 12, '#8ac0d8'); E(24, 1, 4, 2, '#8ac0d8');
    const eye = f % 2 ? '#7ad0f0' : '#bfe8f0'; r(19, 12, 4, 3, '#1c3058'); r(26, 12, 4, 3, '#1c3058'); r(20, 13, 2, 1, eye); r(27, 13, 2, 1, eye);
    r(22, 18, 4, 1, '#5a7a90'); r(20, 15, 1, 4, salt); r(28, 15, 1, 3, salt);
    L(14, 26, 5, 18 - Math.round(s * 2), 'k', 3); L(14, 26, 5, 18 - Math.round(s * 2), salt2, 2); L(34, 26, 43, 18 + Math.round(s * 2), 'k', 3); L(34, 26, 43, 18 + Math.round(s * 2), salt2, 2);
    for (const [x, y] of [[4, 16], [44, 16], [10, 30], [38, 34]]) { r(x, y - f % 2, 2, 2, '#ffffff'); }
  }),
  // ---- Fiscal da Linha: catraca gigante de quepe, picotador de bilhetes ----
  fiscal: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, met = '#5a6070', met2 = '#7a8090', met3 = '#a8b0b8';
    r(8, 14, 32, 32, 'k'); r(9, 15, 30, 30, met); r(9, 15, 30, 3, met2); r(9, 42, 30, 3, '#3a3e48');
    E(24, 30, 9, 9, 'k'); E(24, 30, 8, 8, '#3a3e48'); for (let a = 0; a < 3; a++) { const an = a * 2.09 + f * 0.52; L(24, 30, 24 + Math.round(Math.cos(an) * 8), 30 + Math.round(Math.sin(an) * 8), met3, 2); } E(24, 30, 2, 2, '#f0c040');
    r(6, 4, 36, 9, 'k'); r(7, 5, 34, 7, '#1c3058'); r(7, 5, 34, 1, '#3a70c0'); r(18, 6, 12, 4, '#f0c040'); r(20, 7, 8, 2, '#c8962a'); r(3, 12, 42, 3, 'k'); r(4, 13, 40, 1, '#1c3058');
    const eye = f % 2 ? '#ff7070' : '#ff3030'; r(13, 18, 6, 3, 'k'); r(29, 18, 6, 3, 'k'); r(14, 19, 4, 1, eye); r(30, 19, 4, 1, eye);
    L(40, 24, 46, 18 - Math.round(s * 2), 'k', 3); L(40, 24, 46, 18 - Math.round(s * 2), met2, 1); r(42, 12 - Math.round(s * 2), 6, 7, 'k'); r(43, 13 - Math.round(s * 2), 4, 2, met3); r(43, 16 - Math.round(s * 2), 4, 2, met3);
    L(8, 24, 2, 30, 'k', 3); r(0, 28, 6, 8, 'k'); r(1, 29, 4, 6, '#e8dcc0'); r(2, 31, 2, 1, '#c83838'); r(2, 33, 2, 1, 'k');
    for (let i = 0; i < 3; i++) r(4 + i * 5 + f, 44 + (i % 2), 3, 2, '#e8dcc0');
  }),
  // ---- Seu Jorge: o motorista na frente do ônibus 31, com o volante ----
  jorge: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, uni = '#3a70c0', uniD = '#2a4a8a', skin = '#d8a070';
    r(0, 2, 48, 30, 'k'); r(1, 3, 46, 28, '#e8d8a0'); r(1, 20, 46, 4, '#3a70c0'); r(4, 5, 40, 12, '#1c3058'); r(5, 6, 38, 1, '#3a5a8a');
    r(16, 2, 16, 4, 'k'); r(17, 3, 14, 2, '#ff9a30'); r(20, 3, 2, 2, 'k'); r(25, 3, 1, 2, 'k'); r(27, 3, 1, 2, 'k');
    const hl = f % 2 ? '#fff4c0' : '#f0c040'; E(5, 26, 3, 3, 'k'); E(5, 26, 2, 2, hl); E(42, 26, 3, 3, 'k'); E(42, 26, 2, 2, hl);
    r(14, 26, 20, 22, 'k'); r(15, 27, 18, 21, uni); r(15, 27, 18, 2, uniD); r(22, 27, 4, 6, '#e8e4dc'); r(23, 28, 2, 4, uniD); r(29, 32, 3, 2, '#f0c040');
    EO(24, 18, 6, 7, skin); r(19, 22, 10, 2, '#a07048'); r(20, 22, 8, 1, '#9a9aa0'); r(19, 21, 3, 1, '#9a9aa0'); r(26, 21, 3, 1, '#9a9aa0');
    r(20, 17, 2, 2, '#3a2418'); r(26, 17, 2, 2, '#3a2418'); r(20, 17, 1, 1, '#ffffff'); r(26, 17, 1, 1, '#ffffff'); r(19, 15, 3, 1, '#7a7a80'); r(26, 15, 3, 1, '#7a7a80');
    r(18, 17, 1, 4, '#9a9aa0'); r(30, 17, 1, 4, '#9a9aa0');
    r(16, 9, 16, 6, 'k'); r(17, 10, 14, 4, '#2a4a8a'); r(21, 10, 6, 2, '#f0c040'); r(14, 14, 20, 2, 'k');
    const tw = [0, 1, 0, -1][f]; EO(24, 40, 11, 6, '#2a2638'); E(24, 40, 9, 4, uni); E(24, 40, 7, 3, '#2a2638'); L(24 - 9 + tw, 40, 24 + 9 - tw, 40, '#1c1824', 2); r(23, 37, 2, 7, '#1c1824');
    r(11, 37 + tw, 5, 4, skin); r(32, 37 - tw, 5, 4, skin);
  })
};
function buildBossSprites() {
  SP.octoB = BIGSP.octo(); SP.bossB = BIGSP.golem(false); SP.bossStone = BIGSP.golem(true);
  SP.bridaB = BIGSP.brida(); SP.jailerB = BIGSP.jailer(); SP.knightB = BIGSP.knight();
  SP.marenB = BIGSP.maren(true); SP.maren5B = BIGSP.maren(false); SP.carroB = BIGSP.carro();
  SP.claraB = BIGSP.clara(); SP.fiscalB = BIGSP.fiscal(); SP.jorgeB = BIGSP.jorge();
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildBossSprites(); }; }
// os inimigos-chefe passam a usar o sprite grande na batalha (escala 2 = 96px)
for (const [k, sp, sc] of [['boss', 'bossB', 2], ['octo', 'octoB', 2], ['brida', 'bridaB', 2], ['jailer', 'jailerB', 2], ['knight', 'knightB', 2], ['maren', 'marenB', 2], ['maren5', 'maren5B', 2], ['carro', 'carroB', 2], ['clara', 'claraB', 2], ['fiscal', 'fiscalB', 2], ['jorge', 'jorgeB', 2]])
  if (ENEMIES[k]) Object.assign(ENEMIES[k], { sp, sc });
