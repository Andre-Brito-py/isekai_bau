// ================= ARTE DO CAP. 4 (Parte 2): A SERRA, CANDEIA E A MINA =================
// Névoa que se arrasta em faixas; casas de pedra de vila mineira; postes de Candeia apagados; o poço seco da praça;
// trilhos, vagonetas e lampiões na mina; os bichos novos: NÉVOA e MINEIRO OCO; e o chefe, o CAPATAZ DE CANDEIA.

// ---------- névoa por cima do mapa (maps com m.nevoa) ----------
{ const _arN = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arN ? _arN(m, ox, oy) : undefined;
  if (m && m.nevoa) {
    const forte = typeof m.nevoa === 'function' ? m.nevoa() : m.nevoa;
    for (let i = 0; i < 7; i++) {
      const y = ((i * 47 + W2.t * 0.05 * (i % 2 ? 1 : -0.6)) % (H + 60)) - 30, x = ((i * 113 - W2.t * (0.25 + i * 0.04)) % (W + 300)) - 150;
      const g = bx.createRadialGradient(x + 120, y, 10, x + 120, y, 120);
      g.addColorStop(0, `rgba(200,206,220,${0.22 * forte})`); g.addColorStop(1, 'rgba(200,206,220,0)');
      bx.fillStyle = g; bx.fillRect(x, y - 60, 240, 120);
    }
    bx.fillStyle = `rgba(170,178,196,${0.12 * forte})`; bx.fillRect(0, 0, W, H);
  }
  return r;
}; }

// ---------- props ----------
let POCO_C = null;
function pocoArt() {
  if (POCO_C) return POCO_C; const P = new Pix(64, 52), Pd = ramp('#8a8290');
  P.cyl(4, 22, 56, 22, Pd, true, { grain: 3 }); P.rect(4, 20, 56, 4, Pd[3]); P.rect(10, 24, 44, 10, '#1a1420');
  for (let x = 6; x < 58; x += 8) P.rect(x, 26, 1, 16, Pd[1]);
  P.rect(8, 0, 4, 22, '#5a3a24'); P.rect(52, 0, 4, 22, '#5a3a24'); P.rect(6, 0, 52, 4, '#6a4430'); P.rect(30, 4, 2, 14, '#8a7a6a');
  P.rect(26, 16, 10, 6, '#6a4a30'); P.rect(27, 17, 8, 1, '#3a2a1a');                   // balde vazio
  P.p(31, 30, '#5a4a40'); P.p(33, 31, '#5a4a40');
  return POCO_C = P.outline().canvas();
}
const PARADO_C = {};
// morador parado na porta: a arte do morador, desbotada e com um "..." flutuando
function paradoArt(k, t) {
  const base = humSpr(k)(0, 'down'); if (!base) return null;
  const key = k; if (!PARADO_C[key]) { const c = mk(base.width, base.height), x = c.getContext('2d'); x.drawImage(base, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(180,188,208,0.45)'; x.fillRect(0, 0, c.width, c.height); PARADO_C[key] = c; }
  return PARADO_C[key];
}
let TRILHO_C = null;
function trilhoArt() { if (TRILHO_C) return TRILHO_C; const P = new Pix(160, 10); for (let x = 0; x < 160; x += 8) P.rect(x, 2, 5, 7, '#5a3a24'); P.rect(0, 2, 160, 1, '#9a9aaa'); P.rect(0, 7, 160, 1, '#9a9aaa'); return TRILHO_C = P.canvas(); }
let VAG_C = null;
function vagonetaArt() { if (VAG_C) return VAG_C; const P = new Pix(30, 24), M = ramp('#6a6a7a'); P.cyl(2, 4, 26, 14, M, true); P.rect(1, 3, 28, 3, M[3]); for (const x of [6, 22]) P.ball(x, 20, 3.5, 3.5, ['#1a1a20', '#2a2a30', '#4a4a5a', '#6a6a7a', '#8a8a9a']); P.rect(6, 6, 18, 3, '#3a2a30'); return VAG_C = P.outline().canvas(); }
function lampiaoMinaArt(aceso) { const P = new Pix(14, 40); P.rect(6, 10, 2, 30, '#5a3a24'); P.rect(3, 2, 8, 10, '#3a3a48'); P.rect(4, 3, 6, 8, aceso ? '#ffd060' : '#2a2430'); if (aceso) P.rect(5, 4, 2, 3, '#fff0c0'); P.rect(2, 1, 10, 2, '#2a2a34'); return P.outline().canvas(); }
function placaVilaArt() { const P = new Pix(40, 34); P.rect(4, 12, 2, 22, '#5a3a24'); P.rect(34, 12, 2, 22, '#5a3a24'); P.rect(0, 2, 40, 14, '#6a4430'); P.rect(1, 3, 38, 12, '#8a6040'); for (let i = 0; i < 6; i++) P.rect(4 + i * 5, 6, 3, 2, '#f2e0c0'); P.rect(6, 10, 26, 1, '#2a1a10'); P.line(20, 9, 34, 12, '#c84a4a'); return P.outline().canvas(); }

// ---------- gente de Candeia ----------
Object.assign(HUMS, {
  ilda: { h: 43, skin: '#d8a888', hair: '#e8e4f0', hairStyle: 'coque', top: '#5a4a7a', bottom: '#3a3048', apron: '#c8b890', acc: '#c8a040',
    extra: (P, o) => { if (o.view !== 'b') { P.rect(o.cx - 4, o.hcY - 1, 3, 2, '#c8d8f0'); P.rect(o.cx + 1, o.hcY - 1, 3, 2, '#c8d8f0'); P.rect(o.cx - 1, o.hcY - 1, 2, 1, '#3a3a48'); } } },
  mineiro: { h: 50, skin: '#a8704a', hair: '#2a2420', top: '#6a5a40', bottom: '#3a3428', hat: '#c8a040', beard: true },
  mineira: { h: 46, skin: '#c8906a', hair: '#4a2a1a', hairStyle: 'longo', top: '#5a6a5a', bottom: '#3a3428', apron: '#8a7a60' },
  menina: { h: 33, skin: '#d8a078', hair: '#2a1a10', hairStyle: 'rabo', top: '#c84a6a', bottom: '#3a3048' }
});
Object.assign(WHO, {
  ilda: { name: () => 'Dona Ilda', portrait: () => portHum('ilda'), voice: voz(330, 'blipTri'), col: '#e8e0ff' },
  menina: { name: () => 'Zezinha', portrait: () => portHum('menina'), voice: voz(620) },
  parado: { name: () => 'Morador', portrait: () => portHum('mineiro'), voice: voz(220, 'blipLow'), col: '#c8c8d8' },
  capataz: { name: () => 'Capataz', voice: voz(110, 'blipLow'), fx: 'shake', col: '#ffd8a0', edge: '#c88040' }
});

// ---------- fundos de batalha ----------
let BG_SERRA = null;
function bgSerra() {
  if (BG_SERRA) return BG_SERRA; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 60 ? P.tone(['#4a5a7a', '#5a6a8a', '#6a7a9a', '#8a96b0', '#a8b4c8'], 0.2 + y / 80, x, y) : y < 96 ? '#4a5a4a' : ((x + y) % 14 < 7 ? '#5a4a3a' : '#4e4032'));
  for (const [x0, h0, c] of [[0, 40, '#3a4a5a'], [60, 52, '#2e3e50'], [140, 46, '#344458'], [200, 58, '#2a3a4a']]) for (let x = 0; x < 90; x++) { const hh = Math.round(h0 - Math.abs(x - 45) * 0.9); for (let y = 96 - hh; y < 96; y++) P.p(x0 + x, y, c); }
  for (let i = 0; i < 30; i++) { const x = hash(i, 3, 1) % 240, y = 70 + hash(i, 5, 2) % 26; P.rect(x, y - 10, 3, 10, '#2a3a2a'); P.p(x + 1, y - 12, '#3a5a3a'); }
  for (let y = 40; y < 110; y++) for (let x = 0; x < 240; x++) if ((x * 7 + y * 13) % 11 === 0 && (Math.sin(x / 30 + y / 9) > 0.2)) P.p(x, y, '#c8d0dc');
  return BG_SERRA = P.canvas();
}
let BG_MINA = null;
function bgMina() {
  if (BG_MINA) return BG_MINA; const P = new Pix(240, 150);
  for (let y = 0; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, y < 96 ? ((hash(x >> 3, y >> 3, 7) % 5 === 0) ? '#2e2630' : '#262028') : ((x + y) % 16 < 8 ? '#3a3038' : '#342a32'));
  for (const x of [20, 120, 220]) { P.rect(x - 4, 10, 8, 86, '#5a3a24'); P.rect(x - 40, 8, 80, 8, '#6a4430'); P.rect(x - 40, 8, 80, 2, '#8a6040'); }
  for (const [x, y] of [[60, 50], [170, 40], [95, 70]]) { P.rect(x, y, 6, 10, '#5a4448'); P.p(x + 2, y + 3, '#7a6060'); }   // veios apagados
  P.rect(0, 112, 240, 2, '#9a9aaa'); P.rect(0, 122, 240, 2, '#9a9aaa'); for (let x = 0; x < 240; x += 10) P.rect(x, 110, 6, 16, '#4a3020');
  for (const x of [70, 190]) { P.rect(x, 30, 2, 30, '#5a3a24'); P.rect(x - 3, 26, 8, 8, '#3a3a48'); P.rect(x - 2, 27, 6, 6, '#ffd060'); }
  return BG_MINA = P.canvas();
}

// ---------- inimigos ----------
const NEV_C = {};
function nevoaArt(f) {
  if (NEV_C[f]) return NEV_C[f]; const P = new Pix(38, 34), cx = 19;
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + f * 0.4, r = 9 + (i % 3) * 2; P.ball(cx + Math.cos(a) * r * 0.7, 16 + Math.sin(a) * r * 0.5, 7, 6, ['#6a7088', '#8a90a8', '#aab0c4', '#c8ccdc', '#e0e4ee'], { amb: 0.4 }); }
  P.ball(cx, 15, 9, 8, ['#8a90a8', '#aab0c4', '#c8ccdc', '#e0e4ee', '#f4f6fa'], { amb: 0.5 });
  // um rosto que não termina de se formar
  P.rect(cx - 5, 13, 3, 2, '#3a3a50'); P.rect(cx + 2, 13, 3, 2, '#3a3a50'); P.rect(cx - 2, 19, 4 + (f % 2), 1, '#5a5a70');
  for (let i = 0; i < 6; i++) P.p(cx - 12 + i * 5, 28 + (i + f) % 3, '#c8ccdc');
  return NEV_C[f] = P.outline(0.25, '#4a4e60').canvas();
}
const MIN_C = {};
function mineiroOcoArt(f) {
  if (MIN_C[f]) return MIN_C[f]; const P = new Pix(36, 52), cx = 18, A = ['#5a3a18', '#8a5a20', '#c88a30', '#f0b850', '#fff0b0'];
  // casco de âmbar oco em forma de mineiro (rachado, vazio por dentro)
  P.cyl(cx - 9, 18, 18, 22, A, false); P.rect(cx - 5, 22, 10, 12, '#1a1218');
  for (const [x, y] of [[cx - 7, 24], [cx + 5, 28], [cx - 3, 36]]) P.line(x, y, x + 3, y + 4, '#2a1a10');
  P.ball(cx, 12, 7, 7, A, { amb: 0.3 }); P.rect(cx - 3, 11, 6, 3, '#1a1218');
  P.rect(cx - 9, 4, 18, 4, '#c8a040'); P.rect(cx - 7, 2, 14, 3, '#d8b050'); P.rect(cx - 2, 3, 4, 3, f % 2 ? '#3a3a48' : '#5a5a68');   // capacete, lanterna morta
  // braços e picareta
  P.rect(cx - 13, 20, 4, 14, A[1]); P.rect(cx + 9, 20, 4, 14, A[1]);
  const py = f % 2 ? 0 : 3; P.rect(cx + 11, 6 + py, 2, 30, '#5a3a24'); P.poly([[cx + 4, 6 + py], [cx + 20, 6 + py], [cx + 22, 9 + py], [cx + 12, 8 + py]], '#9a9aaa');
  P.rect(cx - 7, 40, 5, 10, A[0]); P.rect(cx + 2, 40, 5, 10, A[0]); P.rect(cx - 8, 49, 7, 3, '#2a2018'); P.rect(cx + 1, 49, 7, 3, '#2a2018');
  return MIN_C[f] = P.outline().canvas();
}
// CAPATAZ DE CANDEIA (chefe): um homem-máquina feito de lampiões de mina apagados, com um apito de turno no peito,
// uma picareta-mestra de dois gumes e um livro de ponto preso à cintura. Bem detalhado (chefe).
const CAP_C = {};
function capatazArt(f, fase, armando) {
  const key = f + '_' + fase + '_' + (armando ? 1 : 0); if (CAP_C[key]) return CAP_C[key];
  const W_ = 92, H_ = 112, P = new Pix(W_, H_), cx = 46, Fe = ramp('#5a5a6a'), Br = ramp('#8a5a30'), Am = ['#5a3a18', '#8a5a20', '#c88a30', '#f0b850', '#fff0b0'];
  const resp = f % 2;
  // pernas de vigas de mina
  for (const s of [-1, 1]) { P.cyl(cx + s * 12 - 5, 74, 10, 30, Br, false, { grain: 4 }); P.rect(cx + s * 12 - 7, 102, 14, 8, Fe[1]); P.rect(cx + s * 12 - 7, 102, 14, 2, Fe[3]); }
  // tronco: caldeira de ferro rebitada
  P.ball(cx, 56 + resp, 26, 24, Fe, { amb: 0.25 });
  for (let a = 0; a < 14; a++) { const ang = a / 14 * Math.PI * 2; P.p(Math.round(cx + Math.cos(ang) * 22), Math.round(56 + resp + Math.sin(ang) * 20), Fe[4]); }
  // portinhola da fornalha no peito: apagada (fase 1) ou aberta com âmbar (fase 2)
  P.rect(cx - 9, 52 + resp, 18, 14, '#1a1418'); P.rect(cx - 10, 51 + resp, 20, 2, Fe[3]);
  if (fase >= 2) { for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) P.p(cx - 8 + x, 53 + resp + y, Am[(x + y + f) % 5]); }
  else for (let i = 0; i < 4; i++) P.rect(cx - 7 + i * 4, 54 + resp, 2, 10, '#2a2228');
  // apito de turno
  P.rect(cx + 14, 40 + resp, 4, 8, '#c8a040'); P.rect(cx + 13, 38 + resp, 6, 3, '#e8c860'); if (armando) { P.p(cx + 16, 34, '#ffffff'); P.p(cx + 18, 32, '#ffffff'); P.p(cx + 20, 34, '#ffffff'); }
  // livro de ponto na cintura
  P.rect(cx - 24, 66 + resp, 10, 12, '#3a2a40'); P.rect(cx - 23, 67 + resp, 8, 10, '#e8dcc0'); for (let i = 0; i < 4; i++) P.rect(cx - 22, 69 + resp + i * 2, 6, 1, '#5a5048');
  // cabeça: um lampião de mina grande, vidro rachado, chama que só acende quando ele grita
  P.rect(cx - 10, 10 + resp, 20, 24, Fe[1]); P.rect(cx - 8, 13 + resp, 16, 18, armando ? '#ffb040' : fase >= 2 ? '#c88a30' : '#2a2430');
  if (armando || fase >= 2) { P.rect(cx - 3, 18 + resp, 6, 8, '#fff0b0'); }
  P.line(cx - 6, 14 + resp, cx + 2, 28 + resp, '#8a8a9a'); P.rect(cx - 12, 8 + resp, 24, 3, Fe[3]); P.rect(cx - 4, 4 + resp, 8, 5, Fe[2]); P.rect(cx - 1, 0 + resp, 2, 5, Fe[3]);
  for (const s of [-1, 1]) { P.rect(cx + s * 5 - 1, 20 + resp, 3, 3, armando ? '#ff3a3a' : '#ffd060'); }
  // ombros de lampiões pendurados
  for (const s of [-1, 1]) { for (let i = 0; i < 3; i++) { const lx = cx + s * (24 + i * 4), ly = 38 + i * 6 + resp; P.rect(lx - 2, ly, 5, 7, Fe[2]); P.rect(lx - 1, ly + 1, 3, 5, (i + f) % 3 === 0 && fase >= 2 ? '#ffd060' : '#2a2430'); } }
  // braço com a picareta-mestra
  const pa = armando ? -12 : resp * 2;
  P.line(cx + 22, 46 + resp, cx + 34, 30 + pa, Fe[2], 4); P.rect(cx + 32, 4 + pa, 4, 34, Br[2]);
  P.poly([[cx + 18, 4 + pa], [cx + 48, 2 + pa], [cx + 52, 8 + pa], [cx + 34, 8 + pa]], '#b8b8c8'); P.poly([[cx + 18, 4 + pa], [cx + 34, 8 + pa], [cx + 16, 10 + pa]], '#8a8a9a');
  // braço esquerdo segurando uma corrente de crachás de Pavio
  P.line(cx - 22, 46 + resp, cx - 34, 66 + resp, Fe[2], 4); for (let i = 0; i < 5; i++) { P.rect(cx - 36 + (i % 2), 68 + i * 5 + resp, 3, 3, Fe[3]); if (i % 2) P.rect(cx - 40, 69 + i * 5 + resp, 4, 3, '#e8dcc0'); }
  return CAP_C[key] = P.outline().canvas();
}
