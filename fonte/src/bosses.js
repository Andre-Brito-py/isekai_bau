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
  // ---- Guarda-Musgo: golem de pedra coberto de musgo, cogumelinhos, runa no peito ----
  golem: burned => big(48, 48, g => {
    const { r, E, f, s } = g, st = burned ? '#5a5050' : '#6e6680', hi = burned ? '#7a7070' : '#9a93b0', sd = burned ? '#3a3434' : '#4a4460', moss = burned ? '#3a3020' : '#4a9a4a', moss2 = burned ? '#2a2018' : '#2a6a3a', mossH = burned ? '#4a3a24' : '#8ac85a';
    const SH = (cx, cy, rx, ry) => { E(cx, cy, rx + 1, ry + 1, 'k'); E(cx, cy, rx, ry, sd); E(cx - 1, cy - 1, rx - 1, ry - 1, st); E(cx - Math.round(rx * 0.35), cy - Math.round(ry * 0.45), Math.max(1, Math.round(rx * 0.35)), Math.max(1, Math.round(ry * 0.22)), hi); };
    const up = Math.round(s * 2), pulse = [0, 1, 2, 1][f];
    SH(7, 25 - up, 6, 11); SH(41, 25 + up, 6, 11);
    for (const [x, y] of [[3, 34 - up], [36, 34 + up]]) { r(x, y, 9, 6, 'k'); r(x + 1, y + 1, 7, 4, sd); for (let i = 0; i < 3; i++) r(x + 1 + i * 3, y + 1, 2, 3, st); }
    SH(24, 30, 15, 15);
    r(12, 42, 9, 6, 'k'); r(13, 43, 7, 4, sd); r(13, 43, 7, 1, st); r(27, 42, 9, 6, 'k'); r(28, 43, 7, 4, sd); r(28, 43, 7, 1, st);
    // runa no peito, pulsando
    const rc = burned ? '#ff8040' : ['#4ad0a0', '#6af0c0', '#a0ffe0', '#6af0c0'][f];
    E(24, 30, 5 + (pulse > 1 ? 1 : 0), 5 + (pulse > 1 ? 1 : 0), burned ? 'rgba(255,128,64,0.35)' : 'rgba(80,220,160,0.3)'); r(22, 26, 5, 1, rc); r(24, 26, 1, 8, rc); r(21, 30, 7, 1, rc); r(22, 33, 1, 2, rc); r(26, 33, 1, 2, rc);
    // rachaduras
    for (const [a, b, c, d] of [[14, 24, 17, 28], [17, 28, 16, 33], [33, 22, 31, 27], [31, 27, 34, 31], [20, 38, 23, 41]]) g.L(a, b, c, d, '#2a2638');
    // cabeça
    SH(24, 13, 11, 9);
    r(16, 12, 7, 5, 'k'); r(25, 12, 7, 5, 'k');
    const glow = burned ? '#ff8040' : f % 2 ? '#fff4c0' : '#f0c040';
    E(19, 14, 4, 3, burned ? 'rgba(255,128,64,0.25)' : 'rgba(255,224,102,0.25)'); E(28, 14, 4, 3, burned ? 'rgba(255,128,64,0.25)' : 'rgba(255,224,102,0.25)');
    r(17, 13, 5, 3, glow); r(26, 13, 5, 3, glow); r(18, 13, 2, 1, '#ffffff'); r(27, 13, 2, 1, '#ffffff');
    r(15, 10, 8, 2, 'k'); r(25, 10, 8, 2, 'k');
    r(18, 19, 12, 3, 'k'); for (let i = 19; i < 30; i += 2) r(i, 19, 1, 2, hi);
    // musgo com cogumelinhos e flores
    E(24, 5, 12, 4, moss); E(23, 4, 9, 2, mossH); E(14, 8, 4, 3, moss); E(34, 8, 4, 3, moss2); E(8, 15 - up, 3, 2, moss); E(40, 15 + up, 3, 2, moss2); E(15, 36, 4, 2, moss); E(33, 40, 3, 2, moss2); E(30, 21, 3, 1, moss);
    for (const [x, y] of [[12, 9], [35, 10], [21, 3], [9, 18 - up]]) { r(x, y, 1, 4, moss2); }
    if (!burned) { r(30, 0, 4, 2, '#c83838'); r(30, 0, 1, 1, '#ffffff'); r(32, 1, 1, 1, '#ffffff'); r(31, 2, 2, 2, '#e8dcc0'); r(16, 2, 1, 1, '#ffe066'); r(27, 1, 1, 1, '#e86890'); r(11, 7, 1, 1, '#ffe066'); }
    else for (const [x, y] of [[20, 4], [29, 3], [14, 26], [35, 29], [9, 22]]) { r(x, y - (f % 2), 1, 2, '#ffb040'); r(x, y - 2 - (f % 2), 1, 1, '#ff6030'); }
  }),
  // ---- Capitã Brida: armadura com brasão, capa com barra dourada, espada que brilha ----
  brida: () => big(40, 48, g => {
    const { r, E, EO, L, f, s } = g, arm = '#a8a2c0', armH = '#d0cce0', armD = '#6a6080', cape = '#a02828', capeD = '#6a1818', gold = '#f0c040', skin = '#d8a070', skinD = '#b07848';
    const fl = Math.round(s * 1.5), fl2 = Math.round(Math.cos(f * Math.PI / 2) * 1.5);
    // capa
    r(6, 15, 28, 30 + fl, 'k'); r(7, 16, 26, 28 + fl, cape); r(7, 16, 3, 28 + fl, capeD); r(30, 16, 3, 28 + fl, capeD); r(7, 42 + fl, 26, 2, gold);
    for (let i = 0; i < 4; i++) r(8 + i * 7, 44 + fl + (i % 2 ? fl2 : 0), 4, 2, capeD);
    // pernas e botas
    r(13, 35, 6, 11, 'k'); r(21, 35, 6, 11, 'k'); r(14, 36, 4, 8, armD); r(22, 36, 4, 8, armD); r(14, 36, 1, 8, arm); r(22, 36, 1, 8, arm);
    r(12, 43, 8, 5, 'k'); r(20, 43, 8, 5, 'k'); r(13, 44, 6, 3, '#5a3420'); r(21, 44, 6, 3, '#5a3420'); r(13, 44, 6, 1, '#7a4a2a'); r(21, 44, 6, 1, '#7a4a2a');
    // peitoral com brasão de Auren
    EO(20, 27, 9, 10, arm); E(18, 23, 5, 4, armH); r(12, 30, 16, 1, armD); r(20, 18, 1, 16, armD);
    E(20, 25, 3, 3, 'k'); E(20, 25, 2, 2, '#3a70c0'); r(20, 23, 1, 4, gold); r(19, 24, 3, 1, gold);
    // cinto com bolsinhas
    r(12, 33, 16, 3, 'k'); r(13, 34, 14, 1, '#7a4a2a'); r(19, 33, 3, 3, gold); r(14, 34, 3, 3, '#5a3420'); r(24, 34, 3, 3, '#5a3420');
    // ombreiras
    for (const x of [9, 31]) { EO(x, 21, 5, 4, arm); E(x - 1, 20, 3, 2, armH); r(x - 4, 23, 9, 1, armD); r(x - 2, 19, 1, 1, gold); r(x + 2, 19, 1, 1, gold); }
    // braço da espada
    r(31, 24, 5, 10, 'k'); r(32, 25, 3, 8, arm); r(32, 25, 1, 8, armH); r(31, 33, 5, 3, 'k'); r(32, 33, 3, 2, skin);
    r(32, 3, 3, 31, 'k'); r(33, 4, 1, 28, '#f2ecdc'); r(34, 5, 1, 26, '#a8a0b8'); r(29, 31, 9, 3, 'k'); r(30, 32, 7, 1, gold); r(33, 34, 1, 3, '#7a4a2a'); r(32, 37, 3, 2, gold);
    const gl = 4 + f * 7; r(33, gl, 1, 3, '#ffffff'); r(32, gl + 1, 3, 1, '#ffffff');
    // braço da rede, com pesinhos
    r(4, 24, 5, 10, 'k'); r(5, 25, 3, 8, arm); r(5, 33, 3, 2, skin);
    for (let i = 0; i < 4; i++) { L(0, 32 + i * 3 + fl, 9, 32 + i * 3, '#8a7a5a'); L(1 + i * 3, 31, 0 + i * 3 + fl, 43, '#8a7a5a'); }
    for (const x of [1, 5, 9]) { r(x, 43 + fl, 2, 2, 'k'); r(x, 43 + fl, 1, 1, '#9a93b0'); }
    // rosto
    EO(20, 11, 6, 7, skin); r(15, 14, 10, 3, skin); E(20, 15, 4, 2, skinD); r(15, 14, 10, 1, skin);
    r(16, 10, 3, 2, '#ffffff'); r(21, 10, 3, 2, '#ffffff'); r(17, 10, 2, 2, '#2a5a2a'); r(22, 10, 2, 2, '#2a5a2a'); r(17, 10, 1, 1, '#ffffff'); r(22, 10, 1, 1, '#ffffff');
    r(15, 8, 4, 1, '#5a1a10'); r(21, 7, 4, 1, '#5a1a10'); r(24, 8, 1, 1, '#5a1a10');
    r(18, 15, 4, 1, '#8a3a3a'); r(21, 14, 1, 1, '#8a3a3a'); r(23, 7, 1, 5, '#c87070'); r(19, 13, 1, 1, skinD);
    // elmo e penacho
    r(12, 2, 16, 7, 'k'); r(13, 3, 14, 5, armD); r(13, 3, 14, 2, arm); r(14, 3, 4, 1, armH); r(12, 8, 3, 7, 'k'); r(25, 8, 3, 7, 'k'); r(13, 8, 1, 6, armD); r(26, 8, 1, 6, armD);
    r(25, 13, 6, 11, '#7a2418'); r(26, 14, 4, 9, '#a83a2a'); r(26, 14, 1, 9, '#c85a3a');
    const pl = Math.round(s * 1.5); r(20, 0, 3, 4, 'k'); r(21, 0, 1, 3, gold); r(22 + pl, 0, 7, 3, 'k'); r(23 + pl, 0, 6, 2, '#c83838'); r(27 + pl, 1, 5, 2, '#ff6b6b'); r(31 + pl, 2, 3, 2, '#c83838'); r(24 + pl, 0, 4, 1, '#ff9a9a');
  }),
  // ---- Carcereiro de Ferro-Velho: celas em perspectiva, um prisioneiro, cadeado-rosto e chaves ----
  jailer: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, ir = '#5d566e', ir2 = '#8a8099', ir3 = '#b8b0c8', dk = '#1a1620', rust = '#8a4a2a';
    const sw = Math.round(s * 2);
    for (let i = 0; i < 6; i++) { L(5 + i * 7, 47, 7 + i * 7 + sw, 41, 'k', 2); L(5 + i * 7, 46, 7 + i * 7 + sw, 41, '#6a6078'); }
    r(6, 6, 36, 38, 'k'); r(7, 7, 34, 36, dk);
    // prisioneiro lá dentro (só os olhos e a mão)
    E(15, 26, 4, 6, '#2a2232'); r(13, 24, 1, 1, '#c0c0e0'); r(16, 24, 1, 1, '#c0c0e0'); r(18 + (f % 2), 30, 2, 3, '#8a7a9a');
    r(29, 30, 7, 1, '#5a4a5a'); for (let i = 0; i < 4; i++) r(30 + i, 31 + (i % 2), 1, 1, '#5a4a5a');
    for (let i = 9; i < 41; i += 4) { r(i, 7, 2, 36, ir); r(i, 7, 1, 36, ir2); if ((i * 7) % 3 === 0) r(i, 28 + (i % 5), 2, 4, rust); }
    r(7, 12, 34, 3, ir2); r(7, 12, 34, 1, ir3); r(7, 35, 34, 3, ir2); r(7, 35, 34, 1, ir3); r(7, 41, 34, 2, ir);
    for (const x of [8, 20, 32, 40]) { r(x, 13, 1, 1, '#2a2638'); r(x, 36, 1, 1, '#2a2638'); }
    // topo com placa de número
    r(4, 1, 40, 7, 'k'); r(5, 2, 38, 5, ir); r(5, 2, 38, 1, ir3); r(17, 0, 14, 6, 'k'); r(18, 1, 12, 4, '#c8962a'); r(20, 2, 1, 2, 'k'); r(22, 2, 2, 2, 'k'); r(25, 2, 1, 2, 'k'); r(27, 2, 2, 2, 'k');
    // sobrancelhas de ferro e olhos
    r(9, 14, 9, 2, 'k'); r(30, 14, 9, 2, 'k'); g.L(9, 13, 17, 16, 'k', 2); g.L(31, 16, 39, 13, 'k', 2);
    const eye = f % 2 ? '#ff7070' : '#ff3030'; E(13, 19, 3, 2, 'rgba(255,48,48,0.35)'); E(35, 19, 3, 2, 'rgba(255,48,48,0.35)'); r(11, 18, 5, 3, eye); r(33, 18, 5, 3, eye); r(12, 18, 2, 1, '#ffffff'); r(34, 18, 2, 1, '#ffffff');
    // cadeado-rosto com buraco de fechadura que brilha
    E(24, 21, 6, 6, 'k'); E(24, 21, 4, 4, ir2); E(24, 21, 3, 3, dk); r(16, 23, 16, 15, 'k'); r(17, 24, 14, 13, '#c8962a'); r(17, 24, 14, 2, '#f0c040'); r(17, 24, 2, 13, '#e0b040'); r(29, 26, 2, 11, '#a07818');
    E(24, 29, 2, 2, 'k'); r(23, 30, 3, 4, 'k'); r(24, 30, 1, 3, f % 2 ? '#ff7070' : '#ff3030');
    r(18, 35, 12, 1, '#a07818'); r(20, 26, 1, 1, '#ffffff');
    // "SOCORRO" riscado
    for (let i = 0; i < 7; i++) r(9 + i * 2, 40, 1, 1, '#c8c0d8');
    // correntes balançando
    for (let i = 0; i < 7; i++) { const ox = Math.round(Math.sin(f * 1.5 + i * 0.6) * 1.5); r(0 + ox, 12 + i * 4, 4, 3, 'k'); r(1 + ox, 13 + i * 4, 2, 1, i % 2 ? ir3 : ir2); }
    for (let i = 0; i < 7; i++) { const ox = Math.round(Math.sin(f * 1.5 + i * 0.6 + 2) * 1.5); r(44 + ox, 12 + i * 4, 4, 3, 'k'); r(45 + ox, 13 + i * 4, 2, 1, i % 2 ? ir3 : ir2); }
    // molho de chaves
    E(41 + sw, 42, 4, 4, 'k'); E(41 + sw, 42, 3, 3, '#c8962a'); E(41 + sw, 42, 1, 1, 'k');
    for (let i = 0; i < 4; i++) { r(36 + sw + i * 3, 44, 1, 4, '#f0c040'); r(36 + sw + i * 3, 47, 2, 1, '#f0c040'); }
  }),
  // ---- Cavaleiro Sem Nome: armadura antiga vazia, malha de ferro, flâmula rasgada e a fita lilás ----
  knight: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, ar = '#4f4a66', ar2 = '#6e6884', ar3 = '#9a93b0', rust = '#8a4a2a', dk = '#2a2638';
    const fl = Math.round(s * 2);
    // névoa e capa rasgada
    for (let i = 0; i < 6; i++) E(8 + i * 7 + ((f + i) % 3), 46, 3, 1, 'rgba(180,160,220,0.25)');
    r(10, 14, 26, 32, 'k'); r(11, 15, 24, 30, '#3a1820'); r(11, 15, 3, 30, '#2a1018'); r(32, 15, 3, 30, '#2a1018');
    for (let i = 0; i < 5; i++) r(11 + i * 5, 41 + ((i + f) % 3), 3, 6, '#07050c');
    // pernas
    r(16, 37, 7, 11, 'k'); r(25, 37, 7, 11, 'k'); r(17, 38, 5, 9, ar); r(26, 38, 5, 9, ar); r(17, 38, 1, 9, ar3); r(26, 38, 1, 9, ar3); r(16, 41, 7, 2, ar2); r(25, 41, 7, 2, ar2);
    // peitoral com malha e ferrugem
    EO(24, 28, 10, 11, ar2); for (let y = 30; y < 38; y += 2) for (let x = 16 + (y % 4 ? 1 : 0); x < 33; x += 2) r(x, y, 1, 1, ar);
    E(21, 23, 5, 3, ar3); r(15, 22, 18, 2, ar3); r(23, 18, 2, 12, ar); E(19, 33, 2, 1, rust); E(30, 26, 2, 2, rust); r(29, 28, 1, 2, rust);
    // a fita da bibliotecária, amarrada no peito
    r(28, 24, 4, 3, '#c0a0f0'); r(29, 27, 1, 4, '#c0a0f0'); r(31, 27, 1, 3 + (f % 2), '#a080d0');
    // ombreiras com rebites
    for (const x of [12, 36]) { EO(x, 21, 6, 4, ar2); E(x - 1, 20, 4, 2, ar3); for (const dx of [-3, 0, 3]) r(x + dx, 23, 1, 1, dk); }
    r(8, 23, 5, 13, 'k'); r(9, 24, 3, 11, ar2); r(9, 24, 1, 11, ar3); r(35, 23, 5, 13, 'k'); r(36, 24, 3, 11, ar2); r(36, 24, 1, 11, ar3);
    // lança com flâmula
    L(40, 47, 46, 2, 'k', 3); L(41, 47, 46, 3, '#7a4a2a', 1); r(43, 0, 5, 6, 'k'); r(44, 1, 3, 4, '#d0cce0'); r(45, 1, 1, 3, '#ffffff');
    r(36, 6, 9, 2, 'k'); for (let i = 0; i < 4; i++) r(32 - i * 2, 7 + i + Math.round(Math.sin(f * 1.6 + i) * 1.5), 4, 3, i % 2 ? '#8a2a2a' : '#a83a3a');
    r(38, 32, 8, 3, 'k'); r(39, 33, 6, 1, '#8a2a2a');
    // elmo com fenda que brilha e penacho rasgado
    EO(24, 11, 7, 8, ar2); E(22, 7, 4, 3, ar3); r(17, 10, 14, 3, 'k'); r(23, 12, 2, 6, 'k');
    const glow = ['#ff3030', '#ff5050', '#ff8080', '#ff5050'][f]; r(18, 11, 4, 1, glow); r(26, 11, 4, 1, glow); E(20, 11, 3, 2, 'rgba(255,48,48,0.25)'); E(28, 11, 3, 2, 'rgba(255,48,48,0.25)');
    for (let i = 19; i < 30; i += 2) r(i, 15, 1, 2, 'k');
    r(23, 0, 2, 4, 'k'); for (let i = 0; i < 4; i++) r(19 - i + fl, 0 + i, 5, 1, '#6a1a1a');
  }),
  // ---- Inquisidora Maren: chapéu com pena, livro que solta letras, casaco com bordado dourado ----
  maren: hat => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, coat = hat ? '#7a48b0' : '#5a3a7a', coatH = hat ? '#9a68d0' : '#7a5a9a', coatD = hat ? '#4a2878' : '#3a2050', gold = '#f0c040', skin = '#e8c0a0', skinD = '#c89878', hair = '#2a1a30', hairH = '#4a3060';
    const fl = Math.round(s * 1.5);
    // casaco
    r(12, 18, 24, 30, 'k'); r(13, 19, 22, 29, coat); r(13, 19, 3, 29, coatD); r(32, 19, 3, 29, coatD); r(16, 19, 2, 29, coatH);
    r(23, 19, 2, 29, gold); for (let y = 22; y < 46; y += 4) { r(21, y, 2, 1, gold); r(25, y, 2, 1, gold); }
    r(13, 44, 22, 2, gold); r(13, 18, 22, 3, coatD); r(19, 18, 10, 2, '#e8e4dc');
    if (!hat) { r(15, 40, 3, 6, '#07050c'); r(30, 36, 3, 8, '#07050c'); for (let i = 0; i < 4; i++) r(14 + i, 28 + i * 2, 1, 1, '#2a1a4a'); }
    // cabelo comprido
    r(9, 14 + fl, 6, 22, hair); r(33, 14 - fl, 6, 22, hair); r(10, 15 + fl, 1, 20, hairH); r(37, 15 - fl, 1, 20, hairH);
    // livro com letras saindo
    r(1, 26 - fl, 16, 13, 'k'); r(2, 27 - fl, 7, 11, '#f2e8d0'); r(9, 27 - fl, 7, 11, '#e0d4b8'); r(8, 27 - fl, 2, 11, '#5a3a2a');
    for (let i = 0; i < 4; i++) { r(3, 29 + i * 2 - fl, 5, 1, '#5a6ad0'); r(10, 29 + i * 2 - fl, 5, 1, '#5a6ad0'); }
    E(9, 24 - fl, 7, 3, hat ? 'rgba(160,140,255,0.45)' : 'rgba(255,120,150,0.45)');
    for (let i = 0; i < 4; i++) { const ly = 22 - ((f * 3 + i * 5) % 18) - fl, lx = 4 + i * 3 + ((f + i) % 2); r(lx, ly, 2, 2, hat ? '#c0a0f0' : '#ff8fa8'); }
    for (let i = 0; i < 3; i++) r(5 + i * 4, 39 - fl + ((f + i) % 3) * 2, 1, 2 + (i % 2), '#3a2a6a');
    // mão com a pena
    r(33, 27, 6, 5, 'k'); r(34, 28, 4, 3, skin); L(38, 28, 45, 16, 'k', 2); L(39, 27, 46, 15, '#f2ecdc'); r(44, 14, 3, 3, '#f2ecdc'); r(38, 28, 1, 2, '#2a1a4a');
    // rosto
    EO(24, 12, 6, 7, skin); r(18, 15, 12, 2, skin); E(24, 16, 4, 2, skinD);
    r(19, 11, 4, 2, '#ffffff'); r(25, 11, 4, 2, '#ffffff'); r(20, 11, 2, 2, '#6a2a9a'); r(26, 11, 2, 2, '#6a2a9a'); r(20, 11, 1, 1, '#ffffff'); r(26, 11, 1, 1, '#ffffff');
    if (!hat) { r(19, 13, 3, 1, '#a07090'); r(25, 13, 3, 1, '#a07090'); }
    g.L(18, 9, 22, 10, hair); g.L(26, 10, 30, 9, hair); r(22, 16, 4, 1, '#7a2a5a'); r(21, 15, 1, 1, '#7a2a5a');
    r(17, 5, 14, 4, hair); r(16, 7, 3, 12, hair); r(29, 7, 3, 12, hair); r(19, 5, 6, 1, hairH);
    if (hat) { r(16, 0, 16, 7, 'k'); r(17, 0, 14, 6, '#3a2050'); r(17, 0, 3, 6, '#4a3060'); r(17, 4, 14, 2, gold); r(23, 4, 2, 2, '#c83838'); r(10, 6, 28, 3, 'k'); r(11, 7, 26, 1, '#3a2050');
      L(30, 4, 36, 0, '#e8e4dc', 1); r(33 + (f % 2), 1, 2, 1, '#c0a0f0'); }
    else { r(17, 3, 14, 3, hair); r(15, 2, 4, 3, hair); r(28, 1, 4, 4, hair); r(22, 1, 3, 3, hair); r(19, 2, 2, 2, hairH); r(19, 12, 1, 1, '#7a2a5a'); }
  }),
  // ---- Carruagem Afogada: cavalo de ferrugem com crina de sal, rodas girando, passageiro fantasma ----
  carro: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, bob = f % 2, gold = '#c8962a', pur = '#3a2050', purH = '#5a3090';
    // névoa
    for (let i = 0; i < 6; i++) E(4 + i * 8 + ((f * 2 + i * 3) % 6), 46, 4, 1, 'rgba(95,176,208,0.35)');
    // caixa da carruagem com moldura dourada
    r(17, 5 + bob, 31, 4, 'k'); r(18, 6 + bob, 29, 2, '#4f4a66'); r(18, 6 + bob, 29, 1, '#8a8099'); for (const x of [19, 46]) r(x, 3 + bob, 2, 3, gold);
    r(17, 8 + bob, 31, 23, 'k'); r(18, 9 + bob, 29, 21, pur); r(18, 9 + bob, 29, 1, purH); r(18, 29 + bob, 29, 1, gold); r(18, 9 + bob, 1, 21, gold); r(46, 9 + bob, 1, 21, gold);
    // janela com cortina e um passageiro
    r(21, 12 + bob, 11, 9, 'k'); r(22, 13 + bob, 9, 7, f % 2 ? '#9fd8e8' : '#7ac0d8'); r(22, 13 + bob, 2, 7, '#a02828'); r(29, 13 + bob, 2, 7, '#a02828');
    E(26, 17 + bob, 2, 3, '#4a5a6a'); r(25, 16 + bob, 1, 1, '#e8e4dc'); r(27, 16 + bob, 1, 1, '#e8e4dc');
    // porta
    r(34, 11 + bob, 10, 16, 'k'); r(35, 12 + bob, 8, 14, purH); r(35, 12 + bob, 8, 1, '#7a48b0'); r(36, 14 + bob, 6, 4, pur); r(36, 20 + bob, 6, 4, pur); r(41, 19 + bob, 1, 2, '#f0c040');
    // lampião
    r(44, 9 + bob, 4, 7, 'k'); r(45, 10 + bob, 2, 4, f % 2 ? '#fff4c0' : '#f0c040'); E(46, 12 + bob, 3, 3, 'rgba(255,224,102,0.25)');
    // rodas com raios que giram
    for (const wx of [24, 41]) { EO(wx, 37, 7, 7, '#7a4a2a'); E(wx, 37, 5, 5, '#4a2a1c'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4 + f * Math.PI / 8; L(wx - Math.round(Math.cos(a) * 5), 37 - Math.round(Math.sin(a) * 5), wx + Math.round(Math.cos(a) * 5), 37 + Math.round(Math.sin(a) * 5), '#8a5a34'); } E(wx, 37, 1, 1, gold); }
    r(21, 30, 2, 5, '#4a9a4a'); r(38, 29, 1, 6, '#4a9a4a'); r(45, 27, 1, 5, '#2a6a3a'); r(23, 34, 1, 1, '#8ac85a');
    // cavalo de ferrugem e sal
    const lg = [0, 2, 0, -2][f];
    for (const [x, d] of [[4, lg], [9, -lg], [12, lg], [15, -lg]]) { r(x, 31, 3, 12 + d, 'k'); r(x + 1, 32, 1, 10 + d, '#7a4a2a'); r(x, 42 + d, 3, 2, '#2a2638'); }
    EO(10, 27, 8, 6, '#8a5a34'); E(9, 25, 6, 2, '#a8704a'); for (const [x, y] of [[6, 28], [13, 26], [10, 30]]) r(x, y, 2, 1, '#5a3420');
    r(14, 26, 6, 2, '#5a3a2a'); L(16, 24, 20, 18, gold); r(1, 13, 8, 15, 'k'); r(2, 14, 6, 13, '#8a5a34'); r(2, 14, 2, 13, '#a8704a');
    r(0, 10, 8, 7, 'k'); r(1, 11, 6, 5, '#a8704a'); r(0, 15, 3, 2, '#5a3420'); r(5, 8, 2, 3, 'k');
    E(3, 13, 1, 1, f % 2 ? '#fff4c0' : '#ffb040'); E(3, 13, 2, 2, 'rgba(255,176,64,0.3)');
    for (let i = 0; i < 6; i++) r(7 + (i % 2), 10 + i * 2 + Math.round(Math.sin(f + i) * 0.8), 3, 2, '#e8e4dc');
    for (const [x, y] of [[9, 29], [12, 24], [3, 21], [6, 18]]) r(x, y, 1, 1, '#e8e4dc');
    // chapéu sem cabeça no banco do cocheiro
    r(14, 1 + bob, 8, 4, 'k'); r(15, 2 + bob, 6, 2, '#2a2638'); r(13, 5 + bob, 10, 1, 'k');
  }),
  // ---- Clara, de Sal: rosto da Ofélia, cabelo subindo em fios, lágrimas de sal, vestido virando água ----
  clara: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, salt = '#eef4f6', salt2 = '#c8dce6', salt3 = '#9ab8c8', water = '#3a7090', hair = '#8ac0d8', hairH = '#bfe0f0';
    for (let i = 0; i < 8; i++) { const x = 9 + i * 4 + Math.round(Math.sin(f * 1.2 + i) * 2); L(x, 12, x + Math.round(Math.sin(f * 1.4 + i * 2) * 3), 0 + (i % 3), i % 2 ? hair : hairH); }
    // poça e ondas
    E(24, 44, 23, 4, '#1c3a50'); E(24, 43, 21, 3, water); E(24, 43, 18, 1, '#5fb0d0');
    for (let i = 0; i < 3; i++) { const rr = 6 + ((f * 3 + i * 6) % 16); r(24 - rr, 44, 2, 1, '#bfe8f0'); r(24 + rr, 44, 2, 1, '#bfe8f0'); }
    // vestido de sal que vira água
    r(13, 22, 22, 22, 'k'); r(14, 23, 20, 21, salt2); r(14, 23, 20, 3, salt); r(14, 23, 3, 21, salt3); r(31, 23, 3, 21, salt3); r(23, 26, 2, 14, salt3);
    for (let i = 0; i < 5; i++) r(14 + i * 4, 37 + ((f + i) % 2), 3, 7, water);
    for (const [x, y] of [[18, 28], [28, 31], [21, 34], [30, 25]]) { r(x, y, 1, 1, '#ffffff'); r(x + 1, y + 1, 1, 1, salt3); }
    // gola alta da bibliotecária
    r(18, 20, 12, 3, 'k'); r(19, 21, 10, 1, salt);
    // rosto
    EO(24, 12, 8, 9, '#dceef6'); E(24, 16, 6, 3, salt2);
    E(24, 4, 8, 3, hair); E(24, 1, 4, 2, hair); r(23, 0, 3, 1, hairH); r(16, 6, 3, 12, hair); r(29, 6, 3, 12, hair); r(17, 7, 1, 10, hairH);
    const eye = ['#7ad0f0', '#a8e8ff', '#7ad0f0', '#bfe8f0'][f]; r(18, 10, 5, 4, '#1c3058'); r(25, 10, 5, 4, '#1c3058'); r(19, 11, 3, 2, eye); r(26, 11, 3, 2, eye); r(19, 11, 1, 1, '#ffffff'); r(26, 11, 1, 1, '#ffffff');
    r(18, 8, 4, 1, hair); r(26, 8, 4, 1, hair);
    r(22, 17, 4, 1, '#5a7a90');
    // lágrimas de sal
    r(19, 14, 1, 2 + (f % 2), salt); r(19, 17 + (f % 2), 1, 1, '#ffffff'); r(28, 14, 1, 3 - (f % 2), salt);
    // braços estendidos
    L(14, 25, 4, 17 - Math.round(s * 2), 'k', 3); L(14, 25, 4, 17 - Math.round(s * 2), salt2, 2); E(3, 16 - Math.round(s * 2), 2, 2, salt);
    L(34, 25, 44, 17 + Math.round(s * 2), 'k', 3); L(34, 25, 44, 17 + Math.round(s * 2), salt2, 2); E(45, 16 + Math.round(s * 2), 2, 2, salt);
    for (const [x, y] of [[2, 10], [45, 9], [8, 30], [40, 33], [6, 22]]) { r(x, y - f % 2, 2, 2, '#ffffff'); r(x - 1, y + 1 - f % 2, 1, 1, salt3); }
  }),
  // ---- Fiscal da Linha: catraca gigante de quepe, bigode de escova, crachá e picotador ----
  fiscal: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, met = '#5a6070', met2 = '#7a8090', met3 = '#b0b8c0', dk = '#2a2e38';
    // corpo com rebites e faixa amarela
    r(7, 14, 34, 32, 'k'); r(8, 15, 32, 30, met); r(8, 15, 32, 3, met2); r(8, 15, 2, 30, met2); r(38, 15, 2, 30, dk); r(8, 42, 32, 3, dk);
    for (let i = 0; i < 8; i++) r(8 + i * 4, 38, 2, 3, i % 2 ? '#f0c040' : 'k');
    for (const [x, y] of [[10, 17], [37, 17], [10, 36], [37, 36]]) { r(x, y, 2, 2, met3); r(x + 1, y + 1, 1, 1, dk); }
    // roleta girando
    E(24, 29, 9, 8, 'k'); E(24, 29, 8, 7, dk); for (let a = 0; a < 3; a++) { const an = a * 2.09 + f * 0.52; L(24, 29, 24 + Math.round(Math.cos(an) * 8), 29 + Math.round(Math.sin(an) * 7), met3, 2); } E(24, 29, 2, 2, '#f0c040');
    // crachá
    r(29, 20, 8, 6, 'k'); r(30, 21, 6, 4, '#e8e4dc'); r(31, 22, 4, 1, '#3a70c0'); r(31, 24, 3, 1, '#8a8099');
    // quepe com aba brilhante
    r(5, 3, 38, 10, 'k'); r(6, 4, 36, 8, '#1c3058'); r(6, 4, 36, 2, '#2a4a8a'); r(18, 5, 12, 5, 'k'); r(19, 6, 10, 3, '#f0c040'); r(21, 7, 6, 1, '#c8962a');
    r(2, 12, 44, 3, 'k'); r(3, 13, 42, 1, '#2a4a8a'); r(6, 13, 6, 1, '#7ab0e0');
    // olhos e bigode de escova
    const eye = f % 2 ? '#ff7070' : '#ff3030'; r(12, 17, 7, 4, 'k'); r(29, 17, 7, 4, 'k'); r(13, 18, 5, 2, eye); r(30, 18, 5, 2, eye); r(13, 18, 2, 1, '#ffffff'); r(30, 18, 2, 1, '#ffffff');
    r(11, 16, 9, 1, 'k'); r(28, 16, 9, 1, 'k');
    r(14, 22, 20, 3, 'k'); for (let i = 15; i < 33; i += 2) r(i, 22 + (i % 4 ? 0 : 1), 1, 3, '#5a4a3a');
    // braço do picotador
    const pp = Math.round(s * 2); L(40, 24, 45, 17 - pp, 'k', 3); L(40, 24, 45, 17 - pp, met2, 1); r(41, 10 - pp, 7, 8, 'k'); r(42, 11 - pp, 5, 2, met3); r(42, 15 - pp, 5, 2, met3); r(43, 13 - pp, 3, 2, dk);
    // braço com bilhete
    L(8, 24, 3, 30, 'k', 3); r(0, 27, 7, 9, 'k'); r(1, 28, 5, 7, '#f2e8d0'); r(2, 29, 3, 1, '#c83838'); r(2, 31, 3, 1, '#8a8099'); r(2, 33, 2, 1, '#8a8099'); r(4, 32, 1, 1, 'k');
    // bilhetes picotados voando
    for (let i = 0; i < 4; i++) { const x = 3 + i * 11 + ((f + i) % 3), y = 45 - ((f * 2 + i * 3) % 6); r(x, y, 3, 2, '#e8dcc0'); r(x + 1, y, 1, 1, '#c83838'); }
  }),
  // ---- Seu Jorge: na frente do 31, com o letreiro, os faróis, o retrovisor e o volante ----
  jorge: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, uni = '#3a70c0', uniH = '#5a90e0', uniD = '#2a4a8a', skin = '#d8a070', skinD = '#b07848', gray = '#9a9aa0';
    // frente do ônibus
    r(0, 2, 48, 32, 'k'); r(1, 3, 46, 30, '#e8d8a0'); r(1, 3, 46, 2, '#f8ecc0'); r(1, 22, 46, 5, '#3a70c0'); r(1, 22, 46, 1, '#5a90e0');
    r(3, 7, 42, 13, 'k'); r(4, 8, 40, 11, '#1c3058'); r(5, 9, 10, 2, '#3a5a8a'); r(31, 9, 6, 1, '#3a5a8a'); r(23, 8, 2, 11, 'k');
    // letreiro "31"
    r(13, 0, 22, 6, 'k'); r(14, 1, 20, 4, '#2a1a10'); const lc = f % 2 ? '#ffb040' : '#ff9a30';
    r(16, 2, 3, 1, lc); r(18, 2, 1, 3, lc); r(16, 3, 2, 1, lc); r(16, 4, 3, 1, lc); r(21, 2, 1, 3, lc); r(24, 3, 8, 1, lc);
    // retrovisor com terço
    r(30, 7, 1, 4, 'k'); r(28, 10, 5, 3, 'k'); r(29, 11, 3, 1, '#7ad0f0'); r(30, 13, 1, 3 + (f % 2), '#c0a0f0'); r(29, 16 + (f % 2), 3, 1, '#c0a0f0');
    // faróis e grade
    const hl = f % 2 ? '#fff4c0' : '#f0c040'; for (const x of [6, 41]) { E(x, 29, 4, 3, 'k'); E(x, 29, 3, 2, hl); E(x, 29, 6, 4, 'rgba(255,224,102,0.18)'); }
    for (let i = 13; i < 35; i += 3) r(i, 29, 2, 3, '#8a8099');
    // uniforme
    r(14, 26, 20, 22, 'k'); r(15, 27, 18, 21, uni); r(15, 27, 3, 21, uniH); r(30, 27, 3, 21, uniD); r(21, 27, 6, 7, '#e8e4dc'); r(23, 28, 2, 6, uniD); r(23, 28, 2, 1, '#c83838');
    r(28, 31, 4, 3, 'k'); r(29, 32, 2, 1, '#f0c040'); r(16, 31, 4, 1, uniD);
    // rosto cansado
    EO(24, 18, 6, 7, skin); E(24, 22, 5, 2, skinD); r(18, 18, 1, 4, gray); r(30, 18, 1, 4, gray);
    r(20, 17, 3, 2, '#ffffff'); r(26, 17, 3, 2, '#ffffff'); r(21, 17, 2, 2, '#3a2418'); r(26, 17, 2, 2, '#3a2418'); r(21, 17, 1, 1, '#ffffff'); r(26, 17, 1, 1, '#ffffff');
    r(20, 19, 3, 1, skinD); r(26, 19, 3, 1, skinD); g.L(19, 15, 22, 16, '#6a6a70'); g.L(26, 16, 29, 15, '#6a6a70');
    r(19, 21, 10, 2, gray); r(18, 22, 2, 1, gray); r(28, 22, 2, 1, gray); r(22, 23, 4, 1, '#8a4a3a');
    if (f === 2) r(30, 14, 1, 2, '#a8e8ff');
    // quepe
    r(16, 9, 16, 6, 'k'); r(17, 10, 14, 4, uniD); r(17, 10, 14, 1, uni); r(21, 10, 6, 3, '#f0c040'); r(22, 11, 4, 1, '#c8962a'); r(14, 14, 20, 2, 'k'); r(15, 14, 7, 1, '#3a5a8a');
    // volante girando
    const tw = [0, 1, 0, -1][f]; EO(24, 40, 12, 6, '#2a2638'); E(24, 40, 10, 4, '#4f4a66'); E(24, 40, 8, 3, '#2a2638'); L(24 - 9 + tw, 40 + tw, 24 + 9 - tw, 40 - tw, '#1c1824', 2); r(23, 37, 2, 7, '#1c1824'); E(24, 40, 2, 1, '#8a8099');
    r(10, 37 + tw, 6, 5, 'k'); r(11, 38 + tw, 4, 3, skin); r(32, 37 - tw, 6, 5, 'k'); r(33, 38 - tw, 4, 3, skin);
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
