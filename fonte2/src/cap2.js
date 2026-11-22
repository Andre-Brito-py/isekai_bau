// ================= CAPÍTULO 2: VELHÁGUA, A CIDADE QUE AFUNDA =================
// Mapas em mapas2.js (validados em maps/cap2maps.py). Aqui: moradores (com ROTINAS: cada um faz alguma coisa),
// cenários, missões, a Guilda (disfarce de bagagem), o Bairro Afogado (boiar e correntezas) e o final.

// ---------- moradores ----------
const HUMS = {
  graca: { h: 44, skin: '#d8a078', hair: '#b8b0a8', hairStyle: 'coque', top: '#7a4a6a', bottom: '#4a3a4a', apron: '#e8dcc0' },
  neusa: { h: 47, skin: '#c88a5a', hair: '#5a2a1a', hairStyle: 'longo', top: '#a8503a', bottom: '#3a3040', apron: '#e8dcc0' },
  tobias: { h: 44, skin: '#c8906a', hair: '#e8e8e0', hairStyle: 'careca', beard: true, top: '#4a6a8a', bottom: '#3a3a4a', hat: '#3a4a6a' },
  marina: { h: 47, skin: '#c8906a', hair: '#3a2014', hairStyle: 'longo', top: '#5a9a7a', bottom: '#4a4a6a' },
  pedrinho: { h: 34, skin: '#d8a078', hair: '#2a1a10', top: '#e8a030', bottom: '#3a5a8a' },
  celeste: { h: 46, skin: '#e0b090', hair: '#2a2a3a', hairStyle: 'longo', top: '#2a2a3a', bottom: '#2a2a3a', extra: (P, o) => { if (o.view !== 'b') P.rect(o.cx - 6, o.hcY - 6, 12, 2, '#f2ecdc'); P.rect(o.cx - 1, o.tT + 3, 2, 5, '#c8a040'); P.rect(o.cx - 2, o.tT + 4, 4, 1, '#c8a040'); } },
  bras: { h: 52, skin: '#c08060', hair: '#3a2a1a', beard: true, top: '#5a4a3a', coat: '#4a3a2a', bottom: '#2a2a30', hat: '#3a3a4a', extra: (P, o) => { if (o.view === 'f') P.rect(o.cx - 4, o.tT + 4, 3, 3, '#e8c040'); if (o.view === 's') { P.line(o.cx - 9, o.tT + 10, o.cx + 2, o.tT + 10, '#6a4a2a'); } } },
  pavio: { h: 50, skin: '#c8b0a0', hair: '#5a5a60', top: '#6a6a7a', coat: '#5a5a6a', bottom: '#3a3a44', hat: '#2a2a30', extra: (P, o) => { P.rect(o.cx - 1, o.hcY - 12, 2, 5, '#f2ecdc'); P.p(o.cx, o.hcY - 13, o.fr ? '#ffd060' : '#ff9a30'); P.p(o.cx - 1, o.hcY - 14, '#fff0c0'); } },
  ze: { h: 46, skin: '#a87050', hair: '#2a1a10', top: '#5a7a4a', bottom: '#4a4a3a', hat: '#c8a060' },
  dita: { h: 45, skin: '#8a5a3a', hair: '#1a1010', hairStyle: 'coque', top: '#c86a8a', bottom: '#5a3a5a', apron: '#f0e8d0' },
  joao: { h: 50, skin: '#b87850', hair: '#1a1010', top: '#d8c8a0', bottom: '#4a4a5a' },
  zefa: { h: 44, skin: '#d8a078', hair: '#8a8a90', hairStyle: 'coque', top: '#5a8ac8', bottom: '#3a3a5a' },
  lurdes: { h: 46, skin: '#a86a4a', hair: '#2a1a1a', hairStyle: 'longo', top: '#e8c040', bottom: '#6a3a3a' },
  nico: { h: 49, skin: '#e0b090', hair: '#7a4a2a', top: '#8a3a3a', bottom: '#3a3a4a', beard: true },
  bebum: { h: 47, skin: '#d89078', hair: '#4a3a2a', hairStyle: 'careca', top: '#6a7a5a', bottom: '#3a3a3a' },
  lia: { h: 46, skin: '#c08060', hair: '#5a3a2a', hairStyle: 'coque', top: '#3a6a8a', bottom: '#3a3a4a', hat: '#c8a060' },
  // o Acendedor-Mor: casaca preta, cabelo prateado, cartola, corrente dourada e as mãos sempre sujas de fuligem
  vesper: { h: 53, skin: '#d8b090', hair: '#9a9aaa', top: '#e8dcc0', coat: '#1a1a2a', bottom: '#1a1a24', extra: (P, o) => {
    P.rect(o.cx - 5, o.hcY - 17, 10, 11, '#1a1a24'); P.rect(o.cx - 5, o.hcY - 9, 10, 2, '#8a2a3a'); P.rect(o.cx - 8, o.hcY - 7, 16, 2, '#1a1a24'); P.rect(o.cx - 4, o.hcY - 17, 2, 8, '#3a3a4a');
    if (o.view === 'f') { for (let i = 0; i < 5; i++) P.p(o.cx - 4 + i * 2, o.tT + 9 + (i % 2), '#e8c040'); P.p(o.cx - 7, o.tT + Math.round(13 * o.s), '#3a3434'); P.p(o.cx + 6, o.tT + Math.round(13 * o.s), '#3a3434'); }
    if (o.view === 's') { P.p(o.cx + (o.fr ? 1 : 0), o.tT + Math.round(13 * o.s), '#3a3434'); P.line(o.cx - 3, o.tT + 14, o.cx - 3, o.H - 2, '#5a4a3a'); P.rect(o.cx - 5, o.tT + 10, 4, 5, '#e8a030'); }
  } },
  cacador: CAC_HUM
};
function humSpr(k) { return (t, dir) => humanoSprite(humano(k, HUMS[k]), dir, t); }
const PORT_H = {};
function portHum(k) { if (PORT_H[k]) return PORT_H[k]; const f = humano(k, HUMS[k]).f[0], c = mk(32, 32), x = c.getContext('2d'); x.fillStyle = '#1a1424'; x.fillRect(0, 0, 32, 32); x.drawImage(f, 0, 0, 24, 30, 4, 4 + (HUMS[k].h < 40 ? 4 : 0), 24, 30); return PORT_H[k] = c; }
const voz = (f, w) => () => sfx(w || 'blip', f);
Object.assign(WHO, {
  graca: { name: () => 'Dona Graça', portrait: () => portHum('graca'), voice: voz(470), col: '#ffe8d0' },
  neusa: { name: () => 'Dona Neusa', portrait: () => portHum('neusa'), voice: voz(520), col: '#ffd8c0' },
  tobias: { name: () => 'Seu Tobias', portrait: () => portHum('tobias'), voice: voz(200, 'blipLow') },
  marina: { name: () => 'Marina', portrait: () => portHum('marina'), voice: voz(640), col: '#d8ffe8' },
  pedrinho: { name: () => 'Pedrinho', portrait: () => portHum('pedrinho'), voice: voz(900, 'blipTri') },
  celeste: { name: () => 'Irmã Celeste', portrait: () => portHum('celeste'), voice: voz(760, 'blipTri'), col: '#f0f0ff' },
  bras: { name: () => 'Sargento Brás', portrait: () => portHum('bras'), voice: voz(150, 'blipLow'), col: '#ffd8a0', edge: '#c88040' },
  pavio: { name: () => G.flags.pavio >= 3 ? 'Osvaldo' : 'Pavio', portrait: () => portHum('pavio'), voice: voz(380), col: '#e8e0d8' },
  ze: { name: () => 'Zé do Píer', portrait: () => portHum('ze'), voice: voz(250, 'blipLow') },
  dita: { name: () => 'Dona Dita', portrait: () => portHum('dita'), voice: voz(560) },
  joao: { name: () => 'João Estiva', portrait: () => portHum('joao'), voice: voz(220, 'blipLow') },
  zefa: { name: () => 'Dona Zefa', portrait: () => portHum('zefa'), voice: voz(600) },
  lurdes: { name: () => 'Dona Lurdes', portrait: () => portHum('lurdes'), voice: voz(660) },
  nico: { name: () => 'Seu Nico', portrait: () => portHum('nico'), voice: voz(260, 'blipLow') },
  bebum: { name: () => 'Freguês', portrait: () => portHum('bebum'), voice: voz(300) },
  lia: { name: () => 'Lia Pescadora', portrait: () => portHum('lia'), voice: voz(580) },
  cacador: { name: () => 'Caçador', portrait: () => portHum('cacador'), voice: voz(190, 'blipLow'), col: '#ffd0c0' },
  vesper: { name: () => 'Acendedor-Mor', portrait: () => portHum('vesper'), voice: voz(240, 'blipTri'), col: '#fff0d8', edge: '#c8a040' },
  ancora: { name: () => G.flags.c2Boss ? 'Dona Badalada' : 'Âncora-Mãe', voice: () => sfx('blipLow', 70), fx: 'shake', col: '#e8d8a0', edge: '#4a8a7a' }
});

// ---------- arte extra: telhado (ilhas da Rua Submersa), baú de tesouro, toldo, tenda, cartaz ----------
{ const _ta2 = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (k !== 'telha') return _ta2(k, v, f);
  const key = k + '_' + v + '_' + f; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16), T = ramp('#a8503a');
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const row = y >> 2, off = (row % 2) * 4, edge = (y % 4 === 3) || ((x + off) % 8 === 0); P.p(x, y, P.tone(T, (edge ? 0.25 : 0.6) - (y % 4) * 0.06 + ((hash(x >> 3, row, v) % 5) - 2) * 0.04, x, y)); }
  if (v === 1) { P.p(5, 6, ramp('#4a7a3a')[3]); P.p(6, 6, ramp('#4a7a3a')[2]); }
  return TILE2[key] = P.canvas();
}; }
const memo = f => { let c = null; return () => c || (c = f()); };
const BAU_C = {};
function chestSpr(aberto) { const k = aberto ? 1 : 0; if (BAU_C[k]) return BAU_C[k]; const P = new Pix(16, 14), Wd = ramp('#8a5a2a'), Au = ramp('#d8a030');
  if (aberto) { P.rect(1, 0, 14, 4, Wd[1]); P.rect(1, 3, 14, 1, Au[2]); }
  for (let y = aberto ? 5 : 2; y < 14; y++) for (let x = 1; x < 15; x++) P.p(x, y, P.tone(Wd, 0.6 - y / 30 - x / 60, x, y));
  if (!aberto) { P.rect(1, 2, 14, 1, Wd[3]); P.rect(1, 6, 14, 1, Au[2]); P.rect(7, 6, 2, 3, Au[3]); } else { P.rect(2, 5, 12, 2, '#1a0e08'); }
  return BAU_C[k] = P.outline().canvas(); }
function toldoArt(col) { const P = new Pix(34, 44), A = ramp(col), Cr = ramp('#e8dcc0'), Wd = ramp('#6a4a2a');
  P.cyl(2, 10, 3, 34, Wd); P.cyl(29, 10, 3, 34, Wd);
  for (let y = 4; y < 14; y++) for (let x = 0; x < 34; x++) P.p(x, y, P.tone((x >> 2) % 2 ? A : Cr, 0.7 - (y - 4) * 0.04, x, y));
  for (let x = 0; x < 34; x += 4) P.ball(x + 2, 14, 2, 2, (x >> 2) % 2 ? A : Cr);
  P.rect(5, 30, 24, 4, Wd[2]); for (let i = 0; i < 5; i++) P.ball(8 + i * 4, 28, 2, 2, ramp(['#e8a030', '#5a9a4a', '#c83a3a', '#7ad0f0', '#f0d070'][i]));
  return P.outline().canvas(); }
function tendaArt() { const P = new Pix(36, 36), L = ramp('#c8b890'), Wd = ramp('#6a4a2a');
  P.poly([[2, 34], [34, 34], [18, 4]], (x, y) => P.tone(L, 0.75 - (y - 4) / 50 + (x < 18 ? 0.1 : -0.1), x, y)); P.poly([[14, 34], [22, 34], [18, 18]], '#3a2a20');
  P.cyl(17, 0, 2, 6, Wd);
  for (const [x, c] of [[0, '#5a9a4a'], [30, '#4a8a3a']]) { P.rect(x, 28, 6, 6, ramp('#a8503a')[2]); P.ball(x + 3, 25, 4, 4, ramp(c)); P.p(x + 2, 23, '#e86890'); }
  return P.outline().canvas(); }
function cartazArt() { const P = new Pix(12, 15), Pp = ramp('#e8dcc0'); for (let y = 0; y < 15; y++) for (let x = 0; x < 12; x++) P.p(x, y, P.tone(Pp, 0.7 - y / 40, x, y)); P.rect(1, 1, 10, 2, '#c83a3a'); P.rect(3, 6, 6, 4, '#8a5a2a'); P.rect(3, 6, 6, 1, '#3a2a1a'); for (let i = 0; i < 3; i++) P.p(4 + i * 2, 8, '#ffffff'); P.rect(2, 12, 8, 1, '#5a4a3a'); return P.outline().canvas(); }
function plantaArt() { const P = new Pix(14, 18); P.rect(2, 10, 10, 8, ramp('#a8503a')[2]); P.rect(2, 10, 10, 1, ramp('#a8503a')[3]); P.ball(7, 7, 6, 6, ramp('#4a8a3a')); P.p(5, 4, '#f0c040'); P.p(9, 6, '#e86890'); return P.outline().canvas(); }
// o sino no fundo do poço (só a cúpula aparece acima da água)
function sinoPocoArt() { const src = ancoraFrame(1, 0, false), c = mk(112, 74); c.getContext('2d').drawImage(src, 0, 0, 112, 74, 0, 0, 112, 74); return c; }

// ---------- montagem dos mapas ----------
const casa = o => { const f = memo(() => casaArt(o).img); f.casaO = o; return f; };
const cartazC = memo(cartazArt), toldoV = memo(() => toldoArt('#c83a3a')), toldoA = memo(() => toldoArt('#3a6ab8')), tendaC = memo(tendaArt), plantaC = memo(plantaArt);
const postes = { on: memo(() => posteArt(true)), off: memo(() => posteArt(false)) };
const porta = (x, y, to, tx, ty, tdir) => ({ t: 'door', x, y, to, tx, ty, tdir, passa: true });
const portas = (list, to, tx, ty, tdir) => list.map(([x, y]) => porta(x, y, to, tx, ty, tdir));
function morador(k, x, y, o = {}) { return Object.defineProperties({ t: 'npc', id: k, x, y, h: (HUMS[k] && HUMS[k].h) || 48, spr: HUMS[k] ? humSpr(k) : null }, Object.getOwnPropertyDescriptors(o)); }
function marcoEnt(x, y) { return { t: 'marco', id: 'marco', x, y, h: 40, spr: () => marcoSpr(), talk: async (e) => { await primeiroMarco(); await usarMarco(e); } }; }
function bauEnt(map, id, x, y, give) { const k = 'b_' + map + '_' + id; return { t: 'chest', id, x, y, h: 16, spr: () => chestSpr(G.flags[k]), talk: async () => { if (G.flags[k]) { await say('* Vazio. Você sente uma pontinha de empatia por ele.'); return; } G.flags[k] = true; sfx('item'); await give(); save2(); } }; }
function inimigo(id, kind, x, y, group, o = {}) { return Object.assign({ t: 'foe', id, x, y, group, h: kind === 'caranguejo' ? 30 : 24, swim: kind === 'lambe', vision: 4, range: 4,
  spr: (t, dir) => { const f = fr2(kind, Math.floor(t / 18) % 2); return dir === 'right' ? flipC(f) : f; } }, o); }
function cacadorEnt(map, id, x, y, path, o = {}) { return Object.assign({ t: 'hunter', id, x, y, path, h: 48, per: 300, vis: 5, spr: humSpr('cacador'), gone: () => G.gone2 && G.gone2[map + ':' + id],
  talk: async () => { await say(pickOne(['Circulando. A Guilda está de olho em monstros. Já viram um baú com dentes por aí?', 'Trezentos frascos de recompensa. Com isso eu compro um barco. Ou um andar a mais pra casa.', 'Bela mala. Pesada? Parece pesada.']), 'cacador'); await say(pickOne(['É bagagem.', 'Herança de família.', 'Ele é... decorativo.']), pickOne(['lume', 'rita'])); } }, o); }
async function dar(k, n = 1, nm) { if (k === 'cobres') { G.cobres = (G.cobres || 0) + n; await say(`* Dentro, ${n} cobres.`); return; }
  if (EQ2[k]) { ganharEquip(k); sfx('equip'); await say(`* Dentro: {y}${EQ2[k].nm}{/}! ${EQ2[k].d} (Equipe pelo MENU.)`); return; }
  G.items[k] = (G.items[k] || 0) + n; await say(`* Dentro: {y}${ITEM2[k].nm}${n > 1 ? ' x' + n : ''}{/}.`); }
const PC = POS2.cais, PP = POS2.praca, R1 = POS2.rua1, R2 = POS2.rua2, PZ = POS2.poco;
const rot = (...a) => a.map(([x, y, act, t, dir, leva]) => ({ at: [x, y], act, t, dir, leva }));

function montarMapas2() {
  // ===== CAIS DA PONTE =====
  MAPS2.cais = { rows: ROWS2.cais, name: 'Velhágua · Cais da Ponte', music: 'velhagua', batBg: bgCidade, showMoney: true, bg: '#1c3a54',
    props: [
      { img: casa({ w: 3, wall: '#8a6a4a', roof: '#6a3a2a', win: [0.2], door: 1.3 }), x: 0, y: 8 },
      { img: casa({ w: 7, wall: '#a8704a', roof: '#8a3a2a', door: 5 - 3 - 0.125, win: [0.5, 5], awning: '#c83a3a', signC: '#e8c040', doorWin: true }), x: 3, y: 8 },
      { img: casa({ w: 6, wall: '#9a7a5a', roof: '#4a4a6a', win: [0.5, 4.2], chimney: true, door: 2.2 }), x: 10.5, y: 8 },
      { img: casa({ w: 11, stone: true, wall: '#7a7480', roof: '#5a3a2a', win: [1, 3.6, 8.2], signC: '#c8a048', door: 5.6, doorC: '#4a3a3a' }), x: 17, y: 8 },
      { img: casa({ w: 4, wall: '#a88060', roof: '#3a5a4a', win: [0.4], door: 2.1 }), x: 32, y: 8 },
      ...[[19, 3], [21.5, 2], [24, 4], [26.5, 2]].map(([x, dy]) => ({ img: cartazC, x, y: 5.6, dy, by: 129 })),
      { img: busArt, x: 8, y: 15, solid: [[8, 13, 12, 2]] },
      { img: memo(() => caixoteArt(0)), x: 2, y: 14, solid: [[2, 13, 1, 1]] }, { img: memo(() => caixoteArt(1)), x: 3, y: 14, solid: [[3, 13, 1, 1]] }, { img: memo(() => caixoteArt(1)), x: 2.5, y: 13.1, by: 225 },
      { img: memo(barrilArt), x: 33, y: 10, solid: [[33, 9, 1, 1]] },
      { img: memo(barcoArt), x: 20.3, y: 20.4, by: 300 }
    ],
    ents: [
      ...portas(PC.bazarDoor, 'bazar', ...POS2.bazar.entra, 'up'), ...portas(PC.ruaPraca, 'praca', ...PP.caisIn, 'up'),
      marcoEnt(...PC.marco),
      morador('jorge0', ...PC.jorge, { h: 48, spr: (t, dir) => { const S = IMG.spf.jorge, F = IMG.sp.jorge; const v = dir === 'up' ? S.b : dir === 'down' ? F : S.s, fr = v[Math.floor(t / 26) % v.length]; return dir === 'right' ? flipC(fr) : fr; },
        rotina: rot([21, 14, 'limpar', 520, 'left'], [22, 15, 'olhar', 300, 'down']), talk: falaJorge }),
      morador('ze', ...PC.ze, { rotina: rot([19, 21, 'pescar', 900, 'down'], [17, 15, 'remendar', 420, 'down']), talk: falaZe }),
      morador('joao', 32, 10, { rotina: rot([32, 10, 'empilhar', 110, 'right'], [4, 12, 'empilhar', 110, 'down', true]), passo: 18, talk: falaJoao }),
      morador('dita', 14, 9, { rotina: rot([14, 9, 'varrer', 320, 'down'], [24, 11, 'varrer', 320, 'right'], [26, 13, 'olhar', 200, 'down']), talk: falaDita }),
      { t: 'sign', x: PC.placa[0], y: PC.placa[1], h: 20, talk: async () => { await say('* PROCURADO: BAÚ COM DENTES. Responde pelo nome de "@". Recompensa: 300 frascos de âmbar. Entregar no Posto da Guilda, Praça do Sino.'); await say('Eles escreveram o seu nome certo. Isso é quase carinhoso.', 'lume'); } },
      cacadorEnt('cais', 'c0', ...PC.cacador, PC.cacPath, { per: 280 }),
      bauEnt('cais', 'a', 34, 14, () => dar('cobres', 30))
    ],
    hunters: true
  };
  // ===== BAZAR DA DONA GRAÇA =====
  MAPS2.bazar = { rows: ROWS2.bazar, name: 'Bazar da Dona Graça', music: 'velhagua', showMoney: true,
    props: [{ img: memo(() => estanteArt(2)), x: 1, y: 4, solid: [[1, 3, 2, 1]] }, { img: memo(() => estanteArt(2)), x: 9, y: 4, solid: [[9, 3, 2, 1]] }, { img: memo(() => balcaoArt(6)), x: 3, y: 5, solid: [[3, 4, 6, 1]] }, { img: plantaC, x: 10, y: 8 }],
    ents: [...portas(POS2.bazar.door, 'cais', ...PC.bazarOut, 'down'),
      morador('graca', ...POS2.bazar.graca, { rotina: rot([6, 3, 'limpar', 400, 'down'], [3, 3, 'limpar', 300, 'up'], [8, 3, 'olhar', 200, 'down']), talk: falaGraca }),
      { t: 'sign', x: POS2.bazar.balcao[0], y: POS2.bazar.balcao[1], h: 30, talk: falaGraca }]
  };
  // ===== PRAÇA DO SINO =====
  MAPS2.praca = { rows: ROWS2.praca, name: 'Velhágua · Praça do Sino', music: 'velhagua', batBg: bgCidade, showMoney: true, bg: '#1c3a54',
    props: [
      { img: casa({ w: 7, wall: '#7a4a2a', roof: '#5a2a2a', door: 4 - 1 - 0.125, win: [0.5, 5], signC: '#c89a40', chimney: true, doorWin: true }), x: 1, y: 8 },
      { img: casa({ w: 7, stone: true, wall: '#8a8290', roof: '#2a3a5a', door: 13 - 9 - 0.125, doorC: '#3a3a4a', win: [0.5, 5.4], signC: '#8a2a2a' }), x: 9, y: 8 },
      { img: casa({ w: 6, wall: '#a8805a', roof: '#3a5a7a', door: 21 - 18.5 - 0.125, win: [0.4, 4.3] }), x: 18.5, y: 8 },
      { img: casa({ w: 7, wall: '#9a6a4a', roof: '#6a3a3a', win: [0.5, 4.6], door: 2.6 }), x: 25, y: 8 },
      { img: () => (G.flags.c2Boss ? torreSim : torreNao)(), x: 14, y: 14, solid: [[14, 12, 4, 2]] },
      { img: memo(fonteArt), x: 5, y: 17, solid: [[5, 15, 4, 2]] },
      { img: memo(igrejaArt), x: 24.5, y: 20, by: 300 },
      ...PP.postes.map(([x, y]) => ({ img: () => (G.flags.c2Fim ? postes.on : postes.off)(), x: x - 0.06, y: y + 1, solid: [[x, y, 1, 1]] })),
      { img: cartazC, x: 9.6, y: 5.8, by: 129 }, { img: cartazC, x: 15.2, y: 5.6, by: 129 }
    ],
    ents: [
      ...portas(PP.caisDoor, 'cais', ...PC.pracaIn, 'down'), ...portas(PP.tavDoor, 'taverna', ...POS2.taverna.entra, 'up'), ...portas(PP.tobDoor, 'tobias', ...POS2.tobias.entra, 'up'),
      porta(...PP.ruaDoor, 'rua1', ...R1.chegada, 'down'),
      { t: 'sign', x: PP.guildaDoor[0], y: PP.guildaDoor[1], h: 58, talk: async () => { await say('* POSTO DA GUILDA DOS CAÇADORES. Um bilhete na porta: "Fechado para almoço." A data do bilhete é de ontem.'); } },
      marcoEnt(...PP.marco),
      morador('celeste', ...PP.celeste, { rotina: rot([15, 14, 'sino', 500, 'up'], [13, 15, 'rezar', 300, 'up'], [16, 15, 'olhar', 200, 'down']), talk: falaCeleste }),
      morador('bras', ...PP.bras, { rotina: rot([12, 9, 'olhar', 420, 'down'], [17, 10, 'conversar', 300, 'left']), gone: () => !!G.flags.brasSumiu, talk: falaBras }),
      morador('pavio', 11, 9, { rotina: rot([11, 9, 'acender', 260, 'left'], [20, 9, 'acender', 260, 'left'], [10, 20, 'acender', 260, 'left'], [21, 20, 'acender', 260, 'left']), passo: 20, talk: falaPavio }),
      morador('pedrinho', ...PP.pedrinho, { get rotina() { return G.flags.ped >= 3 ? rot([8, 18, 'brincar', 400, 'down'], [3, 19, 'brincar', 300, 'down'], [9, 21, 'olhar', 200, 'down']) : rot([8, 18, 'olhar', 500, 'down'], [10, 21, 'olhar', 400, 'down']); }, talk: falaPedrinho }),
      morador('zefa', 19, 15, { rotina: rot([19, 15, 'conversar', 9000, 'right']), talk: falaFofoca }),
      morador('lurdes', 20, 15, { rotina: rot([20, 15, 'conversar', 600, 'left'], [22, 10, 'varal', 500, 'up']), talk: falaFofoca }),
      morador('nico', 3, 25, { rotina: rot([3, 25, 'empilhar', 100, 'down'], [7, 10, 'empilhar', 100, 'up', true]), passo: 20, talk: falaNico }),
      cacadorEnt('praca', 'c1', ...PP.cac1, PP.cac1Path, { per: 300 }), cacadorEnt('praca', 'c2', ...PP.cac2, PP.cac2Path, { per: 250, vis: 6 }),
      { t: 'trig', x: PP.escada[0][0], y: PP.escada[0][1], w: 2, h: 1, passa: true, run: escadaIgreja },
      bauEnt('praca', 'a', 30, 9, () => dar('frasco', 1))
    ],
    hunters: true
  };
  // ===== TAVERNA DO REMO TORTO =====
  MAPS2.taverna = { rows: ROWS2.taverna, name: 'Taverna do Remo Torto', music: 'velhagua', showMoney: true,
    props: [{ img: memo(() => balcaoArt(5)), x: 1, y: 5, solid: [[1, 4, 5, 1]] }, { img: memo(mesaArt), x: 9, y: 7, solid: [[9, 6, 3, 1]] }, { img: memo(barrilArt), x: 12, y: 4 }, { img: memo(barrilArt), x: 12, y: 5 }, { img: memo(() => estanteArt(3)), x: 7, y: 3 }],
    ents: [...portas(POS2.taverna.door, 'praca', ...PP.tavOut, 'down'),
      morador('neusa', ...POS2.taverna.neusa, { rotina: rot([3, 3, 'limpar', 400, 'down'], [1, 3, 'olhar', 200, 'up'], [5, 3, 'limpar', 300, 'down']), talk: falaNeusa }),
      { t: 'sign', x: POS2.taverna.balcao[0], y: POS2.taverna.balcao[1], h: 30, talk: falaNeusa },
      morador('bebum', ...POS2.taverna.bebum, { rotina: rot([2, 7, 'beber', 500, 'right'], [2, 7, 'cochilar', 600, 'down']), talk: falaBebum }),
      morador('lia', ...POS2.taverna.lia, { rotina: rot([10, 5, 'remendar', 600, 'down'], [11, 5, 'beber', 300, 'down']), talk: falaLia })]
  };
  // ===== CASA DO SEU TOBIAS (o térreo já está debaixo d'água) =====
  MAPS2.tobias = { rows: ROWS2.tobias, name: 'Casa do Seu Tobias', music: 'velhagua',
    props: [{ img: memo(camaArt), x: 1, y: 5, solid: [[1, 3, 2, 2]] }, { img: memo(mesaArt), x: 8, y: 3.4, by: 20 }, { img: plantaC, x: 10, y: 4 }],
    ents: [...portas(POS2.tobias.door, 'praca', ...PP.tobOut, 'down'),
      morador('tobias', ...POS2.tobias.tobias, { rotina: rot([8, 4, 'remendar', 500, 'down'], [9, 3, 'olhar', 300, 'up']), talk: falaTobias })]
  };
  // ===== RUA SUBMERSA (telhados) =====
  const afog = { music: 'afogado', batBg: bgAfogado, bg: '#0c1e2c', tint: 'rgba(30,50,110,0.12)', key: { '.': { t: 'telha' } },
    overlay: (ox, oy) => { if (W2.t % 900 === 450) sfx('sino', 98); for (let i = 0; i < 6; i++) { const x = (i * 97 + (W2.t >> 2)) % 260 - 10, y = 240 - ((W2.t * 0.4 + i * 53) % 260); bx.globalAlpha = 0.35; bx.fillStyle = '#bfe8ff'; bx.fillRect(Math.round(x), Math.round(y), 1, 1); bx.globalAlpha = 1; } } };
  MAPS2.rua1 = Object.assign({ rows: ROWS2.rua1, name: 'Bairro Afogado · Rua Submersa', onEnter: async () => { if (!G.flags.c2Rua) { G.flags.c2Rua = true; await say('* Debaixo de você, a rua inteira: postes, uma bicicleta, janelas com cortina. Tudo olhando para cima.'); await say('* Os telhados que ainda aparecem viraram ilhas. Riscos brancos na água: CORRENTEZAS. Elas empurram o baú.'); } },
    props: [{ img: tendaC, x: 13, y: 11, solid: [[13, 10, 2, 1]] }, { img: plantaC, x: 16, y: 12.2, by: 190 }],
    ents: [
      porta(...R1.pracaDoor, 'praca', ...PP.ruaOut, 'up'), porta(...R1.merDoor, 'rua2', ...R2.chegada, 'right'),
      marcoEnt(...R1.marco),
      morador('marina', ...R1.marina, { rotina: rot([15, 10, 'regar', 400, 'left'], [16, 11, 'varal', 400, 'down'], [15, 12, 'olhar', 200, 'down']), talk: falaMarina }),
      bauEnt('rua1', 'a', ...R1.bau1, () => dar('frasco', 2)), bauEnt('rua1', 'b', ...R1.bau2, async () => { await dar('escudoTampa'); await dar('cobres', 40); }), bauEnt('rua1', 'c', ...R1.bau3, () => dar('sapatilha')),
      inimigo('l1', 'lambe', ...R1.lambe1, ['lambe', 'lambe']), inimigo('l2', 'lambe', ...R1.lambe2, ['lambe']),
      inimigo('k1', 'caranguejo', ...R1.cara1, ['caranguejo']), inimigo('s1', 'sapo', ...R1.sapo1, ['sapo', 'lambe']),
      inimigo('g1', 'caranguejo', ...R1.guarda, ['caranguejo', 'sapo', 'caranguejo'], { vision: 2, range: 0, after: async () => { await say('* O telhado fica quieto. No canto, um baú de verdade. Um baú de baú. Você não sabe bem como se sentir.'); } })
    ] }, afog);
  // ===== MERCADO AFUNDADO =====
  MAPS2.rua2 = Object.assign({ rows: ROWS2.rua2, name: 'Bairro Afogado · Mercado Afundado', key: {},
    props: [{ img: toldoV, x: 9, y: 3, solid: [[9, 2, 2, 1]] }, { img: toldoA, x: 12, y: 13, solid: [[12, 12, 2, 1]] }, { img: memo(() => caixoteArt(1)), x: 19.5, y: 13.2, by: 212 }],
    ents: [
      porta(...R2.ruaDoor, 'rua1', ...R1.merOut, 'left'), porta(...R2.pocoDoor, 'poco', ...PZ.chegada, 'up'),
      marcoEnt(...R2.marco),
      { t: 'chest', id: 'barco', x: R2.barco[0], y: R2.barco[1], h: 16, spr: () => G.flags.ped >= 2 ? null : barquinhoSpr(), talk: async () => { if (G.flags.ped >= 2) return; G.flags.ped = 2; sfx('item'); await say('* Um barquinho de madeira, encalhado num toldo. Do lado, escrito torto: PEDRINHO.'); await say('Pronto. Agora a gente é oficialmente um serviço de achados e perdidos.', 'rita'); save2(); } },
      { t: 'chest', id: 'placa', x: R2.placa[0], y: R2.placa[1], h: 16, spr: () => G.flags.pavio >= 2 ? null : placaSpr(), talk: async () => { if (G.flags.pavio >= 2) return; G.flags.pavio = Math.max(2, G.flags.pavio || 0); sfx('item'); await say('* Uma plaquinha de latão, verde de limo, pregada numa banca afundada: "CONSERTO DE RELÓGIOS · OSVALDO CANDEIA".'); if ((G.flags.pavio || 0) >= 2) await say('Osvaldo. Um nome inteiro, jogado no fundo do rio. Quem é que joga um nome fora?', 'lume'); save2(); } },
      bauEnt('rua2', 'a', ...R2.anel, async () => { await dar('anelPedagio'); await say('Esse anel tá... cobrando alguma coisa. Dá pra sentir. Igual o Espantalho.', 'lume'); }),
      bauEnt('rua2', 'b', ...R2.bau, async () => { await dar('cobres', 60); await dar('pluma', 1); }),
      inimigo('k1', 'caranguejo', ...R2.cara, ['caranguejo', 'caranguejo']), inimigo('l1', 'lambe', ...R2.lambe1, ['lambe', 'lambe']),
      inimigo('l2', 'lambe', ...R2.lambe2, ['lambe', 'sapo']), inimigo('s1', 'sapo', ...R2.sapo, ['sapo', 'caranguejo'])
    ] }, afog);
  // ===== POÇO DO SINO =====
  MAPS2.poco = { rows: ROWS2.poco, key: { '~': { t: 'agua', water: true, solid: true } }, name: 'Poço do Sino', music: 'afogado', batBg: bgPoco, bg: '#06100a', dark: 'rgba(4,10,8,0.78)', lights: [[7.5, 3, 70]],
    props: [{ img: () => G.flags.c2Boss ? null : sinoPocoC(), x: 4.5, y: 4.6, by: 60 }],
    ents: [...portas(PZ.door, 'rua2', 20, 11, 'up'), { t: 'trig', x: PZ.gatilho[0][0], y: PZ.gatilho[0][1], w: 6, h: 1, passa: true, run: pocoChefe }]
  };
  for (const m of Object.values(MAPS2)) { m.baked = null; for (const p of m.props || []) { const f = p.img; p.casaO = f.casaO; p.img = () => f() || EMPTY_C; } }
}
const SINO_MINI = memo(() => { const P = new Pix(14, 14), B = ramp('#a87a3a'); P.ball(7, 9, 6.5, 5, B); P.ball(7, 5, 4, 4, B); P.rect(1, 12, 13, 1, B[1]); P.p(5, 8, '#4a8a7a'); P.p(9, 6, '#4a8a7a'); return P.outline().canvas(); });
const EMPTY_C = mk(1, 1), torreSim = memo(() => torreArt(true).img), torreNao = memo(() => torreArt(false).img), sinoPocoC = memo(sinoPocoArt);
const barquinhoSpr = memo(() => { const P = new Pix(16, 12), B = ramp('#c8703a'); P.poly([[0, 6], [16, 6], [13, 11], [3, 11]], (x, y) => P.tone(B, 0.7 - (y - 6) * 0.08, x, y)); P.rect(7, 0, 1, 6, '#5a3a24'); P.poly([[8, 0], [13, 5], [8, 5]], '#f2ecdc'); return P.outline().canvas(); });
const placaSpr = memo(() => { const P = new Pix(14, 10), B = ramp('#c8a040'); for (let y = 0; y < 8; y++) for (let x = 0; x < 13; x++) P.p(x, y + 1, P.tone(B, 0.6 - y / 20, x, y)); P.p(3, 4, '#4a8a5a'); P.p(9, 6, '#4a8a5a'); P.rect(2, 3, 9, 1, '#5a4a2a'); P.rect(2, 6, 6, 1, '#5a4a2a'); return P.outline().canvas(); });

// ---------- falas dos moradores (mudam conforme a história) ----------
async function falaJorge() {
  const f = G.flags;
  if (!f.celeste) await say('Dizem que a freira da torre sabe por que a cidade afunda. Vai na Praça do Sino, subindo a rua. E anda parado. Quer dizer... para quando olharem.', 'jorge');
  else if (!f.boiar) await say('A escadaria da igreja desce pro bairro velho. O sargento da Guilda vive rondando ali. Grandão, de bigode, cara de quem nunca perdeu uma discussão.', 'jorge');
  else if (!f.c2Boss) await say('Lá embaixo, segue a água. Se a correnteza te levar pro lugar errado, é porque o lugar certo é do outro lado. Isso vale pra estrada também.', 'jorge');
  else await say('Que barulho bonito esse sino fez voltando. Parecia o 31 subindo a serra: reclamando, mas subindo.', 'jorge');
  if (!f.jorgeCafe) { f.jorgeCafe = true; await say('Ah, e se precisar descansar: as pedras com a runa do baú, os Marcos. Elas fazem o mesmo que aquelas lanternas lá de baixo. Achei uma ali do lado do 31.', 'jorge'); }
}
async function falaZe() {
  if (G.flags.c2Boss) { await say('A água baixou um palmo. Um palmo! Achei minha bota de 1990 no píer.', 'ze'); return; }
  await say('Velhágua desce um degrau por ano. A gente se acostuma: sobe a cama, sobe o fogão, sobe a avó.', 'ze');
  await say('Só que essa semana desceu TRÊS degraus. E de noite tem um sino tocando. Lá embaixo. Debaixo d\'água.', 'ze');
  await say('O sino da torre é de lata, moço. Tem cem anos que é de lata. O que toca lá embaixo é outro.', 'ze');
}
async function falaJoao() { await say(pickOne(['Caixa pra cima, caixa pra cima. Desde que abriram a mina da Coroa debaixo do bairro velho, eu só carrego caixa pra cima.', 'Ô, licença! Essa é a geladeira da Dona Zefa. Não, a geladeira tá dentro da caixa. Não pergunta.', 'Tem três dias que a água sobe mais rápido. A mina bebe, dizem. Bebe o quê, eu não sei.']), 'joao'); }
async function falaDita() { await say(pickOne(['Varrer o cais todo dia é teimosia, eu sei. Mas se eu parar de varrer, aí é que afunda de vez.', 'Moço, essa mala de vocês tá me olhando.', 'Os postes novos da Coroa chegaram semana passada. Dizem que o Acendedor-Mor vem acender pessoalmente. Um conde! Aqui! Vou varrer duas vezes.']), 'dita'); }
async function falaGraca() {
  if (!G.flags.graca) { G.flags.graca = true;
    await say('Bem-vindos ao Bazar! Tem frasco, tem tinta, tem pena de galinha dourada que levanta defunto. Funciona. Não pergunte como.', 'graca');
    await say('E eu vendo pra qualquer um que paga em cobre. Até pra mala. Principalmente pra mala com dente, que mala com dente paga adiantado.', 'graca');
    await say('Ela sabe.', 'rita'); await say('Todo mundo sabe, filha. A Guilda é que finge que não. Ou finge que sabe. Depende do dia.', 'graca');
    await say('E os frascos são com SELO, viu? Âmbar de farmácia, diluído, autorizado pela Coroa. A Coroa proíbe o âmbar e depois vende de volta, um gole por vez, com imposto.', 'graca');
    await say('Proíbe e vende de volta. Que coisa.', 'rita');
    await say('...Os meus não têm selo.', 'me');
    await say('Então não mostra pra ninguém, mala. Nem pra mim. Principalmente pra mim.', 'graca');
  }
  await loja(['frasco', 'tinta', 'pluma', 'escudoTampa', 'sapatilha', 'microfone']);
  if (!G.flags.gracaMina) { G.flags.gracaMina = true; await say('Ah: desde que a Coroa abriu a mina de âmbar debaixo do bairro velho, a gente afunda mais rápido. Mas isso eu não falei, tá?', 'graca'); }
}
async function falaNeusa() {
  const c = await choose('Remo Torto, o pior caldo de peixe da cidade e o melhor de Velhágua. Vai querer?', ['Caldo para o grupo (15 cobres)', 'Notícias', 'Nada'], 'neusa', 2);
  if (c === 0) { if ((G.cobres || 0) < 15) { await say('Fiado, só pra quem tem endereço. E mala não tem CEP.', 'neusa'); return; } G.cobres -= 15; curarTudo(); sfx('heal'); await say('* O caldo é salgado, quente e tem um olho de peixe olhando para você. A vida e os PM do grupo voltam ao máximo.'); return; }
  if (c === 1) {
    if (!G.flags.celeste) await say('A Irmã Celeste toca o sininho de lata da torre, toda hora certa. Ela diz que é pra cidade não esquecer que tem sino. Se alguém sabe do sino de baixo, é ela.', 'neusa');
    else if (!G.flags.c2Boss) await say('O Seu Tobias, aqui do lado, não sai mais de casa. A filha dele mora "no andar de cima", nos telhados do bairro afogado. Teimosa igual o pai.', 'neusa');
    else await say('A cidade parou de afundar e o povo resolveu comemorar comendo o meu caldo. Eu devia ter afundado antes.', 'neusa');
  }
}
async function falaBebum() { await say(pickOne(['Eu vi um baú andando. Parei de beber. Vi de novo. Voltei a beber.', 'Psiu. Sabe por que o sino toca lá embaixo? Porque ninguém mais toca ele aqui em cima. Ninguém visita velho, meu filho.', 'Zzz... três degraus... zzz... e o conde de cartola... zzz.']), 'bebum'); }
async function falaLia() { await say(pickOne(['Os postes novos da Coroa? Bonitos. O Acendedor-Mor paga bem os acendedores dele, os Pavios. Paga até pensão pra família. Gente fina.', 'Os Pavios? Educados, quietinhos, trabalham até de madrugada. Só são meio... esquecidos. Perguntei o nome de um, ele ficou olhando pro poste.', 'Remendar rede é igual remendar cidade: você puxa um fio aqui e o buraco aparece ali.']), 'lia'); }
async function falaFofoca() {
  const f = G.flags;
  await say(f.c2Boss ? 'Você viu? O sino voltou! Sozinho, não. Puxado pelo ônibus! Que época.' : pickOne(['...e aí a filha do Tobias disse que não desce do telhado nem amarrada. Pois é.', '...e o sargento Brás jura que viu uma mala piscar pra ele. Pois é.', '...e o menino do Pedrinho perdeu o barquinho na correnteza. Chorou a tarde inteira. Pois é.']), pickOne(['zefa', 'lurdes']));
  await say('Pois é.', pickOne(['zefa', 'lurdes']));
}
async function falaNico() { await say(pickOne(['Mudança. Toda semana é mudança. Eu já subi essa cômoda pro segundo andar, pro sótão e agora pro telhado do vizinho.', 'Se a cidade parar de afundar eu desço tudo de novo. Ou não. Acostumei com a vista.']), 'nico'); }
async function falaCeleste() {
  const f = G.flags;
  if (f.c2Boss) { await say('Ela voltou. A Dona Badalada voltou. Tocou o meu batizado, sabia? E hoje tocou de novo, só pra mim. Obrigada.', 'celeste'); return; }
  if (f.celeste) { await say('A escadaria da igreja desce para o bairro velho. Vá com Deus. E com cuidado. Deus anda meio ocupado com a enchente.', 'celeste'); return; }
  await say('Ah! Visitas. Desculpem, eu estava tocando o sininho. Tem que tocar na hora certa, senão a cidade esquece que tem sino.', 'celeste');
  await say('Esse aqui é de lata. O de verdade, a Dona Badalada, caiu no rio numa cheia, há cem anos. Ela tocou todos os casamentos, batizados e enterros de Velhágua.', 'celeste');
  await say('E esta semana... ela voltou a tocar. Lá embaixo. Toda noite. E a cidade desceu três degraus. Eu acho que ela está chamando. Ou puxando.', 'celeste');
  await say('A Guilda fechou a escadaria da igreja. O Sargento Brás diz que é perigoso. A Coroa diz que é a mina. Ninguém diz nada para o sino.', 'celeste');
  const c = await choose('Vocês... vão descer, não vão? Eu vejo pela mala. Ela tem cara de quem vai descer.', ['A gente desce.', 'Que mala?'], 'celeste');
  if (c === 1) await say('Essa que está piscando para mim. Tudo bem. Eu também finjo muita coisa.', 'celeste');
  await say('Tome. A chave do cadeado da escadaria. Eu não vi nada. Eu rezo de olhos fechados, sabe.', 'celeste');
  await say('Só peço uma coisa: se encontrarem a Dona Badalada, não machuquem ela mais que o necessário. Ela só está com medo de ser esquecida. Como todo mundo.', 'celeste');
  sfx('item'); await say('* Você recebeu a {y}Chave da Escadaria{/}. A escadaria fica do lado da igreja, descendo para o rio.');
  f.celeste = true; save2();
}
async function falaBras() {
  const f = G.flags;
  if (f.brasLuta) { await say(f.c2Boss ? 'Uma mala derrubou o sino que derrubava a cidade. Eu vou escrever isso no relatório e vão me internar.' : 'Eu não vi baú nenhum. Eu vi uma mala muito determinada. Circulando.', 'bras'); return; }
  await say('Bela mala. É de quem?', 'bras');
  await say('Minha. É... herança.', 'lume');
  await say('Herança com dente.', 'bras');
  await say('Herança antiga. Os dentes vieram junto. Coisa de família.', 'rita');
  await say('Hm. Sargento Brás, da Guilda dos Caçadores. Se essa herança piscar, eu levo pra perícia. Tenham um bom dia.', 'bras');
}
async function falaPavio() {
  const f = G.flags, p = f.pavio || 0;
  if (p >= 3) { await say('Osvaldo Candeia, consertador de relógios. Eu repito toda hora, pra não perder de novo. Osvaldo. Candeia.', 'pavio'); return; }
  if (p === 2) {
    await say('* Você mostra a plaquinha de latão. O Pavio lê devagar, como quem lê uma palavra de outra língua.');
    await say('O... Osvaldo. Osvaldo Candeia. Conserto de relógios. Eu... eu consertava relógios. A banca era no Mercado. O relógio da torre parou e eu nunca consegui consertar. Eu lembro disso!', 'pavio');
    await say('Eu lembro de tudo! Quer dizer, de quase tudo. Eu entrei pros Pavios por um salário. Pra ser Pavio a gente entrega uma coisinha pequena. Um nome, ele disse. "Ninguém sente falta de um nome."', 'pavio');
    await say('Quem disse?', 'rita');
    await say('...Não lembro do rosto. Lembro da luz. Era uma luz muito bonita.', 'pavio');
    await say('Luz bonita demais é a que mais cega.', 'me');
    await say('Obrigado. De verdade. Tomem, é o que eu tenho: o salário da semana. Pavio não gasta com nada mesmo.', 'pavio');
    f.pavio = 3; G.cobres = (G.cobres || 0) + 50; G.items.tinta = (G.items.tinta || 0) + 2; sfx('item');
    await say('* +50 cobres e {y}Tinta Azul x2{/}.'); save2(); return;
  }
  await say('Boa tarde. Eu acendo os postes novos da Coroa. Os Pavios do Acendedor-Mor acendem. Eu sou Pavio. É assim que me chamam.', 'pavio');
  await say('Parente da Madame Pavio, lá de baixo? Ela também era meio vela.', 'lume');
  await say('Não sei. Eu não lembro de parentes. Eu não lembro... do meu nome, na verdade. Tinha numa plaquinha. Na minha banca, no Mercado. Antes de afundar.', 'pavio');
  await say('Se vocês descerem lá... e se acharem... não, que bobagem. Ninguém sente falta de um nome.', 'pavio');
  await say('Eu sinto falta do meu bairro e nem lembro o nome dele. Sentir falta não é bobagem. A gente procura.', 'me');
  if (!p) { f.pavio = 1; await say('* Nova missão: {y}O nome do Pavio{/}. A plaquinha dele está em alguma banca do Mercado Afundado.'); }
}
async function falaPedrinho() {
  const f = G.flags, p = f.ped || 0;
  if (p >= 3) { await say('Olha, ele boia! Igual o seu baú! ...O seu baú boia, né? Eu vi ele boiando. Eu não conto pra ninguém. Só pra minha mãe. E pra minha vó.', 'pedrinho'); return; }
  if (p === 2) {
    await say('MEU BARQUINHO! Vocês acharam! Lá embaixo? Com a correnteza e tudo?', 'pedrinho');
    await say('Toma, é do meu cofrinho. E essa pena dourada, minha vó disse que levanta até defunto. Eu nunca testei.', 'pedrinho');
    f.ped = 3; G.cobres = (G.cobres || 0) + 40; G.items.pluma = (G.items.pluma || 0) + 1; sfx('item');
    await say('* +40 cobres e {y}Pena de Fênix?{/}.'); save2(); return;
  }
  await say('Meu barquinho fugiu. Eu soltei ele na escadaria da igreja e a correnteza levou. Foi pro Mercado Afundado, eu vi ele ir.', 'pedrinho');
  await say('O meu pai fez ele. Antes de ir trabalhar na mina.', 'pedrinho');
  if (!p) { f.ped = 1; await say('* Nova missão: {y}O barquinho do Pedrinho{/}.'); }
}
async function falaTobias() {
  const f = G.flags, c = f.tob || 0;
  if (c >= 3) { await say('A luva era pra pescar. Agora é pra vocês. A Marina mandou um bilhete de volta, sabia? Diz que vai descer do telhado. Num domingo. De um ano qualquer.', 'tobias'); return; }
  if (c === 2) {
    await say('Ela leu? Ela... riu? Quando ela era pequena, ela ria igual a mãe. De nariz.', 'tobias');
    await say('* Você conta que ela riu de nariz. O Seu Tobias tira a luva grossa de pescador e põe no balcão, devagar.', 'n');
    await say('Toma. Pra moça da lança. Eu não pesco mais. A água veio até mim, não preciso ir até ela.', 'tobias');
    f.tob = 3; ganharEquip('luvaPescador'); sfx('equip'); await say(`* Você recebeu a {y}${EQ2.luvaPescador.nm}{/}. ${EQ2.luvaPescador.d}`); save2(); return;
  }
  if (c === 1) { await say('A carta é pra Marina, minha filha. Ela mora no andar de cima. Nos telhados do bairro afogado. Tem uma tenda e uma horta de vaso.', 'tobias'); return; }
  await say('Desculpem a bagunça. O térreo virou aquário. Eu moro no que sobrou: a cama, a mesa e a teimosia.', 'tobias');
  await say('Minha filha, a Marina, mudou pros telhados do bairro velho quando a água subiu. Diz que de lá a vista é melhor. A gente brigou. Faz dois anos que a gente não se fala.', 'tobias');
  await say('Eu escrevi uma carta. Escrevo toda semana, na verdade. Nunca mando. Eu não nado, e o orgulho afunda mais rápido que a cidade.', 'tobias');
  const r = await choose('Vocês... levariam?', ['Levamos.', 'Por que não fala com ela?'], 'tobias');
  if (r === 1) await say('Porque falar é difícil e carta a gente pode reescrever até ficar menos burra.', 'tobias');
  f.tob = 1; sfx('item'); await say('* Você recebeu a {y}Carta do Seu Tobias{/}. Nova missão: {y}Carta para o andar de cima{/}.'); save2();
}
async function falaMarina() {
  const f = G.flags, c = f.tob || 0;
  if (c === 1) {
    await say('Visita no telhado? Ninguém sobe aqui. Quer dizer, ninguém desce aqui. É complicado.', 'marina');
    await say('* Você entrega a carta. A Marina reconhece a letra antes de abrir. Fica um tempo parada, com o regador pingando no pé.', 'n');
    await say('"Marina. A água chegou na cozinha. Eu fritei um peixe dentro da cozinha e o peixe ainda estava vivo. Era uma piada. Volta. Ou não volta. Mas responde. Teu pai, Tobias." ...Ele é ridículo.', 'marina');
    await say('* Ela ri. De nariz.', 'n');
    await say('Leva isso pra moça de luz. Eu bordei pras velas do meu pai, mas ele não acende vela desde que a mãe se foi. Ela precisa mais.', 'marina');
    ganharEquip('xaleVelas'); sfx('equip'); f.tob = 2;
    await say(`* Você recebeu o {y}${EQ2.xaleVelas.nm}{/}. ${EQ2.xaleVelas.d}`);
    await say('E fala pra ele que... não. Fala que eu ri. Só isso.', 'marina'); save2(); return;
  }
  if (c >= 2) { await say('Eu tô regando a horta. Se a cidade parar de afundar, eu levo um vaso pra ele. Um vaso por semana. Feito carta.', 'marina'); return; }
  await say('Ninguém desce aqui. O meu pai ia dizer que é perigoso. O meu pai diz que tudo é perigoso, menos ficar sozinho.', 'marina');
}

// ---------- o primeiro Marco ----------
async function primeiroMarco() {
  if (G.flags.tutMarco) return; G.flags.tutMarco = true;
  await say('Essa runa... @, é igual à da sua tampa. Igualzinha. Quem é que espalhou pedra com o seu desenho pela superfície?', 'lume');
  await say('Os antigos chamavam de Marcos. Meu avô dizia que eram de "quando os baús andavam". Eu achava que era jeito de falar.', 'rita');
  await say('Os baús andavam. Então eu não sou o primeiro. Isso é... reconfortante?', 'me');
  await say('* (MARCO: salva o jogo, cura o grupo e os bichos da região voltam. Se o grupo cair, ele acorda no último Marco.)');
}

// ---------- disfarce de bagagem: os Caçadores pegaram o baú andando ----------
async function cacadoresAtacam(e) {
  await say(pickOne(['EI! Essa mala... ANDOU!', 'Bagagem não pisca! Bagagem não ANDA!', 'Mala de rodinha eu conheço. Mala de PERNA, não!']), 'cacador');
  await say(pickOne(['Ele é tímido!', 'É o vento!', 'Bagagem moderna. Vem com perna.']), pickOne(['lume', 'rita']));
  const r = await lutaMapa(['cacador', 'cacador'], { bg: bgCidade, music: 'luta2' });
  if (r === 'win') { G.gone2[W2.id + ':' + e.id] = true; W2.ents = W2.ents.filter(q => q !== e); W2.sus = 0; await say('* O Caçador sai mancando para chamar reforço. Vai demorar: ele tropeçou no próprio apito.'); }
  else W2.sus = 0;
}

// ---------- a escadaria da igreja: chave, o Sargento Brás e o baú que boia ----------
function recua() { if (canStand(W2.x, W2.y - 1, 'player')) { W2.dir = 'up'; startMove(W2, W2.x, W2.y - 1); } }
async function escadaIgreja() {
  const f = G.flags;
  if (f.boiar) return;
  if (!f.celeste) {
    await say('* Uma corrente com cadeado atravessa a escadaria. Uma placa: INTERDITADO PELA GUILDA. PERIGO: SINO.');
    await say('Perigo: sino. Que tipo de perigo um sino oferece?', 'rita'); await say('Barulho?', 'lume');
    await say('A gente devia falar com alguém da igreja. Aquela moça tocando o sininho, ali na torre.', 'rita'); recua(); return;
  }
  if (!f.brasLuta) { await emboscadaBras(); if (!f.brasLuta) return; }
  await descobreBoiar();
}
async function emboscadaBras() {
  await say('* Você destranca o cadeado. A corrente cai na escada com um barulho enorme. Barulho de sino, quase.');
  await say('Ah. A irmã abriu o cadeado pra vocês? A Irmã Celeste abre cadeado até pra gato.', 'bras');
  await say('* O Sargento Brás está atrás de vocês, com dois Caçadores e um carimbo enorme na mão.');
  await say('Eu fiz uma perícia. A herança de vocês pisca. Respira. E ontem, na frente do bazar, ela BOCEJOU.', 'bras');
  await say('Trezentos frascos. Sabe o que é isso? É o telhado de todo mundo da praça. ...Nada pessoal, mala.', 'bras');
  await say('Ele vai cobrar. Igual o espantalho.', 'lume');
  await say('Ninguém mais vai cobrar ninguém nessa viagem. Escudeira Rita, em guarda!', 'rita');
  const r = await lutaMapa(['bras', 'cacador'], { bg: bgCidade, music: 'boss', intro: async () => { const e = BT.foes[0]; e.phases = fasesBras(); e.ct = 20; callout('SARGENTO BRÁS', '#ffd8a0', 100); } });
  if (r !== 'win') return;
  G.flags.brasLuta = true;
  await say('Tá. Tá bom. Ninguém derruba o Brás duas vezes na mesma semana. Uma já tá bom.', 'bras');
  await say('Olha: lá embaixo tem coisa pior que mala. Tem três dias que o sino toca e a água sobe. A Guilda não desce porque a Coroa não paga hora extra pra morrer afogado.', 'bras');
  await say('Se essa mala fizer o sino parar... a Guilda nunca viu baú nenhum. Combinado?', 'bras');
  await say('Combinado.', 'rita');
  await say('* O sargento vai embora massageando o orgulho. Os Caçadores dele continuam de ronda: ordem é ordem.');
  save2();
}
function fasesBras() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(20, 3);
    await say('Tá bom. Agora é pessoal. ...É sempre pessoal, na verdade. Eu só falo que não é.', 'bras');
    e.ph = 2; e.weak = ['corte', 'fogo']; e.maxShield = 5; e.shield = 5; e.spd = 12;
    callout('Ele tirou o casaco: as fraquezas mudaram!', '#8fe3ff', 90);
  } }];
}
async function descobreBoiar() {
  await say('A escada termina na água. O bairro velho tá lá embaixo, e o caminho... é por cima dele.', 'rita');
  await say('Eu nado. A Lume...', 'rita');
  await say('Lustre afunda, Rita. Lustre é feito de ferro e de vergonha.', 'lume');
  await say('Eu nunca testei se eu boio. Na Terra eu nadava igual pedra.', 'me');
  await say('* Você olha para a água. A água olha para você. Você é um baú. Baú é madeira. Madeira...');
  sfx('splash'); V.shake = 8;
  await say('* Você pula. E BOIA.');
  await say('ELE BOIA! @, você é um BARCO!', 'lume');
  await say('Um barco com dentes. Abre a tampa aí, a gente entra.', 'rita');
  await say('Eu era um baú. Agora eu sou um barco. Amanhã eu vou ser o quê, um ônibus?', 'me');
  G.flags.boiar = true; save2();
  await say('* (Agora o baú anda na água. Entre na água pela escadaria. As CORRENTEZAS, os riscos brancos, empurram o baú: elas são o caminho.)');
}

// ---------- o chefe ----------
async function pocoChefe() {
  if (G.flags.c2Boss) return;
  const f = G.flags;
  if (!f.c2BossVisto) {
    f.c2BossVisto = true; playMusic(null); sfx('sino', 98); V.shake = 20;
    await say('* No fundo do poço, um sino do tamanho de uma casa. Verde de azinhavre, coberto de cracas. Dele saem correntes de navio como raízes, e cada corrente sobe até uma estaca de casa lá em cima.');
    await say('* Dentro da boca do sino, dois olhos de âmbar escuro se abrem.');
    await say('DING... QUEM... QUEM VOCÊS SÃO? EU LEMBRO DE TODO MUNDO. TODO MUNDO QUE CASOU. TODO MUNDO QUE NASCEU. TODO MUNDO QUE FOI EMBORA.', 'ancora');
    await say('MAS ELES ESTÃO ESQUECENDO. A MINA BEBE. BEBE AS LEMBRANÇAS DO FUNDO DO RIO. ENTÃO EU PUXO. EU PUXO A CIDADE PARA BAIXO. PARA PERTO. PARA NINGUÉM SE PERDER.', 'ancora');
    await say('Ela não quer afundar ninguém. Ela tá com medo de esquecer. Eu conheço esse medo, @.', 'lume');
    await say('Eu também conheço. Eu já esqueci coisa demais pra achar esse medo bobo.', 'me');
    await say('Medo com correntes de navio. Cuidado com a água: o poço sobe quando ela respira.', 'rita');
  } else await say('VOCÊS VOLTARAM. EU LEMBRO DE VOCÊS. EU NÃO ESQUEÇO NINGUÉM.', 'ancora');
  const r = await lutaMapa(['ancora'], { bg: bgPoco, music: 'ancora', pos: [[182, 150]], tension: 20, extra: { fileira: true, bgAnim: bgAnimPoco },
    intro: async () => { const e = BT.foes[0]; e.phases = fasesAncora(); e.ct = 10; BT.mare = { lvl: 4 }; callout('A ÂNCORA-MÃE', '#e8d8a0', 100); hint('Nesta luta dá para trocar de FILEIRA (na lista de comandos): frente ou trás.', 320); } });
  if (r !== 'win') return;
  G.flags.c2Boss = true; save2();
  await fimCap2();
}

// ---------- o final do capítulo ----------
function humF(k, view = 'f', flip) { return t => { const h = humano(k, HUMS[k]), v = h[view], fr = v[Math.floor(t / 26) % v.length]; return flip ? flipC(fr) : fr; }; }
async function fimCap2() {
  await fadeOut(20);
  // 1) o sino sobe: o 31 puxa a corda
  CENA.bg = bgPoco; CENA.actors = [{ x: 120, y: 150, fr: () => ancoraFrame(3, 0, false) }]; CENA.extra = null; V.scene = 'cena'; playMusic('ending'); await fadeIn(20);
  if (G.flags.cantouSino) {
    await say('* A Âncora-Mãe para. As correntes afrouxam. A Lume ainda está cantando, baixinho, e o sino cantarola junto, um zumbido de bronze.');
    await say('...FAZIA CEM ANOS QUE NINGUÉM CANTAVA PARA MIM. EU SÓ CANTAVA PARA OS OUTROS.', 'ancora');
  } else {
    await say('* A Âncora-Mãe para. As correntes afrouxam, uma por uma, e lá em cima as estacas das casas estalam de alívio.');
    await say('...VOCÊS NÃO ME DEIXARAM PUXAR. MAS TAMBÉM NÃO FORAM EMBORA.', 'ancora');
  }
  await say('Ninguém vai esquecer a senhora. A senhora só precisa voltar pra onde todo mundo te vê. Lá em cima. Na torre.', 'lume');
  await say('A TORRE... EU SOU PESADA, MENINA. SOU PESADA DE TANTA GENTE.', 'ancora');
  await say('Eu conheço alguém que puxa coisa pesada serra acima.', 'rita');
  await fadeOut(20);
  // 2) a praça: o 31 puxando o sino, a cidade inteira na corda
  CENA.bg = bgCidade; CENA.extra = null;
  CENA.actors = [{ x: 40, y: 156, fr: () => busArt() }, { x: 156, y: 150, fr: humF('celeste') }, { x: 176, y: 154, fr: humF('tobias') }, { x: 190, y: 150, fr: humF('marina') }, { x: 208, y: 156, fr: humF('pedrinho') }, { x: 226, y: 150, fr: humF('bras') }];
  if ((G.flags.tob || 0) < 2) CENA.actors.splice(2, 2);
  const sinoT = { y: 160, on: false }; const sinoNaTorre = () => { if (!sinoT.on) return; const P = SINO_MINI(); bx.drawImage(P, 125 - 7, Math.round(sinoT.y)); };
  CENA.extra = sinoNaTorre;
  await fadeIn(20);
  await say('ACELERA, 31!', 'jorge'); sfx('rumble'); V.shake = 20;
  await say('* O 31 tosse, ronca e sobe a ladeira de ré, com uma corda amarrada no para-choque. A cidade inteira segura a corda. Até o Sargento Brás. Principalmente o Sargento Brás.');
  sinoT.on = true; await tw2cena(70, p => { sinoT.y = 160 - ease.out(p) * 124; }); sfx('sino', 196); await wait(40);
  await say('* E a Dona Badalada sobe. Pinga rio, pinga craca, pinga cem anos. Encaixa no campanário com um DONG que faz todo mundo chorar e fingir que é a poeira.');
  await say('* Naquela noite, Velhágua sobe um degrau. O primeiro em cem anos.');
  if ((G.flags.tob || 0) >= 2) await say('* No meio da praça, um velho de luva e uma moça de regador fingem que estão ali por acaso. Ninguém acredita. Os dois riem de nariz.');
  if ((G.flags.ped || 0) >= 3) await say('* O Pedrinho põe o barquinho para boiar na fonte. Ele boia igualzinho a você.');
  await fadeOut(24);
  // 3) entardecer: chega o Acendedor-Mor
  const tint = { a: 0 };
  CENA.extra = () => { sinoNaTorre(); bx.globalAlpha = tint.a; bx.fillStyle = '#100a24'; bx.fillRect(0, 12, W, 150); bx.globalAlpha = 1; if (tint.lit) for (const [x, y] of [[20, 70], [80, 64], [168, 64], [226, 70]]) { const g = bx.createRadialGradient(x, y, 1, x, y, 22); g.addColorStop(0, 'rgba(255,210,120,0.55)'); g.addColorStop(1, 'rgba(255,210,120,0)'); bx.fillStyle = g; bx.fillRect(x - 22, y - 22, 44, 44); bx.fillStyle = '#fff0c0'; bx.fillRect(x - 1, y - 2, 3, 4); } };
  const lume = { x: 70, y: 152, fr: standF('lumeh') }, rita = { x: 98, y: 156, fr: standF('rita') }, bau = { x: 84, y: 160, fr: chestF() };
  const vesper = { x: 260, y: 150, fr: humF('vesper', 's') }, p1 = { x: 290, y: 152, fr: humF('pavio', 's') }, p2 = { x: 310, y: 148, fr: humF('pavio', 's') };
  CENA.actors = [lume, rita, bau, vesper, p1, p2];
  await fadeIn(20); playMusic('velhagua');
  await tw2cena(60, p => { tint.a = p * 0.35; vesper.x = 260 - p * 100; p1.x = 290 - p * 70; p2.x = 310 - p * 60; });
  await say('* Ao entardecer, uma carruagem preta para na praça. Dela desce um homem alto, de cartola e cabelo prateado, seguido por acendedores de casaco cinza. Os Pavios.');
  await say('Boa tarde, Velhágua. Perdoem a demora: a estrada da serra estava cheia de cartazes.', 'vesper');
  await say('Conde Ulrico Vesper, Acendedor-Mor da Coroa. Eu vim acender os postes novos. E vim ver quem fez a cidade parar de afundar.', 'vesper');
  await say('* Ele aperta a mão de todo mundo. As mãos dele são finas, educadas, e sujas de fuligem até os pulsos.');
  await say(G.flags.cantouSino ? 'Que canção bonita eu ouvi subir do rio hoje. Era a senhorita? Fazia tempo que eu não ouvia alguém cantar para uma coisa velha.' : 'Disseram-me que a senhorita canta. Eu adoraria ouvir, algum dia. A gente esquece quanto uma música aquece.', 'vesper');
  await say('...Obrigada. Era só uma música. Pra ela não ficar sozinha.', 'lume');
  await say('Nunca é só uma música.', 'vesper');
  await say('* Ele olha para você. Um olhar longo, calmo, de quem confere uma conta.');
  await say('E o seu baú... Bela peça. Antiga. Não se preocupe, escudeira: eu não trabalho para a Guilda. Eu trabalho para o escuro acabar.', 'vesper');
  await say('Um presente. Os antigos chamavam de Marco de Viagem: uma pedrinha com a runa dos baús. Com ela, vocês voltam a qualquer Marco por onde passaram. Ninguém devia se perder no caminho.', 'vesper');
  sfx('item'); G.flags.marcoViagem = true; await say('* Você recebeu o {y}Marco de Viagem{/}. A runa nele é a da sua tampa.');
  await say('E um convite. Em sete dias começa o Festival da Luz, na capital, Auren. A cidade inteira acesa a noite toda. Eu faço questão da presença de vocês. Da senhorita, principalmente.', 'vesper');
  // a noite cai: os postes acendem, a Lume volta a ser lustre
  await tw2cena(50, p => { tint.a = 0.35 + p * 0.4; });
  tint.lit = true; sfx('rune');
  await say('* Os Pavios erguem as varas. Um por um, os postes novos da Coroa acendem. A praça fica dourada.');
  await tw2cena(30, p => { lume.alpha = 1 - p; });
  lume.fr = t => IMG.sp.lume ? IMG.sp.lume[Math.floor(t / 20) % IMG.sp.lume.length] : null; lume.oy = -14;
  await tw2cena(30, p => { lume.alpha = p; });
  if (!G.flags.lumeNoite) {
    await say('* E quando o último pedaço de sol some atrás da serra, a Lume treme, encolhe e volta a ser o que era lá embaixo: um lustre pequeno, de velas tortas, flutuando do seu lado.');
    await say('...De noite eu volto a ser isso. Esqueci de avisar. Desculpa, @. Eu não queria que você visse.', 'lume');
  } else {
    await say('* E quando o último pedaço de sol some atrás da serra, a Lume vira lustre, como toda noite. Só que hoje ela vira na frente de um conde, de uma cidade inteira e de três Pavios.');
    await say('...Todo mundo tá olhando, né. Tudo bem. Eu já me acostumei. Quase.', 'lume');
  }
  G.flags.lumeNoite = true;
  await say('Ninguém devia ter medo do escuro, moça.', 'vesper');
  await say('* Ele diz isso com uma gentileza enorme. Depois toca a aba da cartola e vai embora com os Pavios.');
  if ((G.flags.pavio || 0) >= 3) {
    await say('* Ao passar pelo Pavio que lembrou o próprio nome, o Acendedor-Mor para. Tira do bolso um caderno de capa preta. Escreve alguma coisa.');
    await say('* Do seu ângulo, de cabeça para baixo, você consegue ler: "Osvaldo Candeia". E depois, com cuidado, ele risca.');
  } else await say('* Ao passar pelos Pavios, ele cumprimenta cada um: "Boa noite, Pavio." Eles sorriem do jeito de quem não tem outro nome para responder.');
  await say('Ele parece gente boa.', 'rita');
  await say('Parece.', 'lume');
  await say('...Parece.', 'me');
  await say('* Lá em cima, na torre, a Dona Badalada toca as nove horas. Certinho. Pela primeira vez em cem anos, ninguém precisa lembrar a cidade de que ela tem um sino.');
  G.flags.c2Fim = true; G.hora = 20 * 60 + 30; G.pos = { map: 'praca', x: 15, y: 16, dir: 'down' }; G.marco = { map: 'praca', x: 2, y: 12 }; save2();
  await fadeOut(40);
  await cartao(['FIM DO CAPÍTULO 2', 'Velhágua, a cidade que afunda', '', 'Próximo: Capítulo 3', 'O Festival da Luz']);
  titleFlow2();
}
function tw2cena(n, fn) { return new Promise(r => { let k = 0; const f = () => { k++; fn(Math.min(1, k / n)); if (k < n) requestAnimationFrame(f); else r(); }; f(); }); }

// ---------- cartão de capítulo ----------
function drawCard() {
  bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
  const C = V.card; if (!C) return; C.t = (C.t || 0) + 1;
  C.l.forEach((s, i) => txt(s, 120, 70 + i * 16, { align: 'center', col: i === 0 ? '#ffe066' : i >= 3 ? '#8fe3ff' : '#b8aecb', sz: i === 0 ? 1.5 : 1, alpha: Math.min(1, (C.t - i * 12) / 20) }));
  if (C.t > 90 && FRAME % 60 < 40) txt('A', 120, 200, { align: 'center' });
  if (C.t > 90 && btnp('a') && C.r) { const r = C.r; C.r = null; sfx('select'); r(); }
}
function cartao(l) { return new Promise(async r => { V.card = { l, r }; V.scene = 'card'; await fadeIn(20); }).then(() => fadeOut(20)); }

// ---------- entrada no capítulo ----------
function iniciarCap2() {
  if (G.flags.c2Init) return false;
  G.flags.c2Init = true; G.cobres = 0; G.gone2 = {}; G.pt = {}; G.poder = 1;
  G.equipInv = {}; G.eq = {};
  if (!G.equipInv.lancaPedagio) ganharEquip('lancaPedagio'); G.eq.rita = Object.assign({ arma: 'lancaPedagio' }, G.eq.rita);
  if (G.her && G.her.lume && G.her.lume.fone && !G.equipInv.foneRemendado) { ganharEquip('foneRemendado'); G.eq.lume = Object.assign({ amuleto: 'foneRemendado' }, G.eq.lume); }
  G.hora = 8 * 60; G.items = Object.assign({}, G.items, { frasco: Math.max(3, G.items.frasco || 0), tinta: Math.max(2, G.items.tinta || 0), pluma: Math.max(1, G.items.pluma || 0) });
  G.marco = { map: 'cais', x: PC.chegada[0], y: PC.chegada[1] };
  return true;
}
async function chegadaVelhagua() {
  await cartao(['CAPÍTULO 2', 'Velhágua, a cidade que afunda']);
  CENA.bg = bgCidade; CENA.extra = null;
  const bus = { x: -80, y: 156, fr: () => busArt() }, mud = { x: 250, y: 150, fr: humF('nico', 's') }, mud2 = { x: 270, y: 152, fr: humF('joao', 's') };
  CENA.actors = [bus, mud, mud2]; V.scene = 'cena'; playMusic('velhagua'); await fadeIn(30);
  await tw2cena(80, p => { bus.x = -80 + ease.out(p) * 110; mud.x = 250 - p * 90; mud2.x = 270 - p * 80; });
  await say('* Velhágua tem cheiro de pão molhado e de rio. As casas ficam em pé sobre estacas, como garças cansadas, e a torre da praça é torta para o lado da água.');
  await say('* Na beira do cais, gente sobe a ladeira carregando cadeiras, gaiolas, uma cômoda, um piano inteiro. Ninguém parece surpreso.');
  await say('Ponto final: Cais da Ponte. Eu fico com o 31. Se a cidade afundar, pelo menos o ônibus boia. ...Eu acho.', 'jorge');
  CENA.actors.push({ x: 150, y: 152, fr: standF('lumeh') }, { x: 166, y: 160, fr: chestF() }, { x: 182, y: 156, fr: standF('rita') });
  // ---- não tem um vintém ----
  await say('Passagem são três cobres por cabeça. Quatro cabeças, contando a tampa.', 'jorge');
  await say('Cobre? A gente... tem cobre?', 'lume');
  await say('Eu tenho três botões e uma meia. Nenhum é cobre.', 'me');
  await say('* A Rita revira os bolsos: um botão, um recibo de pedágio e um grão de areia da masmorra.');
  await say('* Você abre a tampa e procura lá dentro: uma meia, uma pedrinha da masmorra e nenhum vintém.');
  await say('Lá embaixo a gente pagava tudo com âmbar e coragem.', 'lume');
  await say('Aqui em cima âmbar BRUTO é da Coroa. Quem anda com âmbar sem selo é preso por contrabando. O único permitido é o frasco de farmácia, diluído, com o selo da Coroa. A moeda do povo é cobre. E a gente tem zero.', 'rita');
  await say('E os frascos que eu trouxe lá de baixo? Não têm selo nenhum.', 'me');
  await say('Então ninguém abre a sua tampa. Nunca. Pra ninguém.', 'rita');
  await say('Relaxa. A primeira viagem é por conta da casa. A segunda também. A terceira eu anoto num caderninho e esqueço.', 'jorge');
  await say('Tá. Então vamos pensar como gente de fora. Eu sou de fora. Eu penso.', 'rita');
  await say('Um: a Guilda tem um QUADRO DE PEDIDOS na taverna. Serviço miúdo, bicho em porão, coisa perdida. Eu tenho licença de escudeira: eles pagam a mim e não perguntam da bagagem.', 'rita');
  await say('Dois: tudo que a gente derrotar deixa alguma coisa. Lodo, telha, sininho. A dona do bazar compra. Aqui em cima, bicho é matéria-prima.', 'rita');
  await say('Três: eu canto. Na Terra eu tocava violão na praça, de noite. Chapéu no chão, moedinha. Isso funciona em qualquer mundo.', 'lume');
  await say('E quatro: o Tiago.', 'rita');
  await say('O cobrador?', 'lume');
  await say('Aqui fora ele não é cobrador. É o HERÓI Nº 30. Os heróis que voltaram da masmorra foram chamados para a capital. Tem figurinha dele em tudo que é venda.', 'rita');
  await say('O cobrador virou herói e o @ virou baú. Eu nunca vou superar isso.', 'lume');
  await say('Nem eu.', 'me');
  await say('Ele mandou carta pelo correio do cais. Vi o selo da Coroa no bazar. Endereçada a "o baú e a moça que brilha".', 'rita');
  await say('* (Dinheiro: cobres. Ganhe com lutas, vendendo materiais no Bazar, com os pedidos da taverna e, de noite, com a Lume cantando na fonte da praça.)');
  await say('* O âmbar do Espantalho, guardado na sua tampa, ainda está quente. Você sente uma coisa voltando, devagar: força antiga. (+ vida, ataque e magia.)');
  await say('Toma, Rita. A lança do pedágio. O Espantalho não vai precisar.', 'lume');
  await say('* A Rita equipou a {y}Lança do Pedágio{/}. (Equipamentos: MENU > Equipar. Só as formas humanas usam.)');
  await say('@, os cartazes. Tão em todo poste. Você é famoso aqui também.', 'lume');
  await say('A Guilda dos Caçadores. Eles ganham por monstro entregue. Se te virem andando, acabou a viagem.', 'rita');
  await say('Então ele não anda. Ele é bagagem. A gente carrega. Quer dizer... ele vai do lado. Bem paradinho quando olharem.', 'lume');
  await say('Bagagem não pisca.', 'rita');
  await say('...Pisca sim. A minha piscava.', 'lume');
  await say('Eu prometo não piscar. ...Muito.', 'me');
  await say('* (DISFARCE DE BAGAGEM: quando um Caçador parar e OLHAR, com o "!" em cima da cabeça, não se mexa. Pego andando três vezes, eles atacam.)');
  await fadeOut(20);
}
async function capitulo2() {
  if (!MAPS2.cais) montarMapas2();
  if (G.flags.c2Fim) { V.scene = 'card'; await cartao(['CAPÍTULO 2 COMPLETO', 'Velhágua parou de afundar.', '', 'O Capítulo 3, O Festival da Luz,', 'está a caminho.']); return titleFlow2(); }
  const novo = iniciarCap2();
  G.gone2 = G.gone2 || {};
  if (novo || !G.flags.c2Chegada) { await chegadaVelhagua(); G.flags.c2Chegada = true; loadMap2('cais', ...PC.chegada, 'down'); save2(); }
  else { const p = G.pos && MAPS2[G.pos.map] ? G.pos : { map: 'cais', x: PC.chegada[0], y: PC.chegada[1], dir: 'down' }; loadMap2(p.map, p.x, p.y, p.dir); }
  V.scene = 'world'; await fadeIn(20);
}
