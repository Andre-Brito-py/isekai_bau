// ================= CAPÍTULO 1: A PONTE DO PEDÁGIO =================

// ---------- herança da Temporada 1 ----------
const LINHA_FERRO = ['ferro', 'fortaleza', 'espinho', 'bastiao', 'abismo', 'ferrao', 'carniceiro', 'arca'];
function lerHeranca() {
  try { const s = localStorage.getItem('renasci_heranca'); if (s) return JSON.parse(s); } catch (e) { }
  return null;
}
function formaFinal(H) { if (!H) return null; if (H.grau5) return H.grau5; const L = H.line || []; return L[L.length - 1] || null; }
const linhaDe = sp => LINHA_FERRO.includes(sp) ? 'ferro' : 'arcano';

// ---------- o grupo ----------
function bauFrame(u) {
  const C = IMG.chest[G.species] || IMG.chest.caixote; if (!C) return null;
  if (u.hp <= 0) return C.closed;
  if (u.pose) return C[u.pose] || C.three;
  if (u.flash > 0) return C.closed;
  if (u.anim === 'run') return BT.t % 10 < 5 ? C.three : C.closed;
  return (BT.t + 37) % 150 < 6 ? C.closed : C.three;
}
// os sprites de lado da T1 olham para a esquerda: na batalha o grupo olha para a direita (para os inimigos)
function sideFrame(k) { return u => { const S = IMG.spf[k] && IMG.spf[k].s; if (!S) return null; const f = S[Math.floor(BT.t / 26) % S.length]; return u.face === -1 ? f : flipC(f); }; }
const FLIPS = new Map(); function flipC(c) { if (!FLIPS.has(c)) FLIPS.set(c, flipH(c)); return FLIPS.get(c); }
function grupoCap1() {
  const H = G.her, sp = G.species, ln = linhaDe(sp), cor = (H && H.lume && H.lume.coracao) || 0;
  const bau = {
    id: 'bau', name: G.name, short: G.name.slice(0, 8), port: 'me', col: '#f0c040', el: 'mordida', lane: 1, row: 'front', h: 34,
    mhp: ln === 'ferro' ? 150 : 128, mmp: ln === 'ferro' ? 26 : 40, atk: ln === 'ferro' ? 16 : 13, def: ln === 'ferro' ? 13 : 9, mag: ln === 'ferro' ? 10 : 15, spd: 9,
    atkNm: 'Morder', atkIcon: 'mordida', atkDesc: 'Morde um inimigo. A quando o anel fechar = mordida certeira.',
    runas: ['brasa', 'geada', 'seiva'], techs: ['guardar', ln === 'ferro' ? 'baluarte' : 'eco'],
    superNm: 'Engolir o Mundo', superDesc: 'Engole um inimigo e cospe longe. Quebra 3 de escudo.', superTgt: 'one',
    frame: bauFrame, attack: bauAtk, super: superBau
  };
  const lume = {
    id: 'lume', name: 'Lume', port: 'lumeh', col: '#ffd060', el: 'luz', ranged: true, lane: 0, row: 'back', h: 46,
    mhp: 100, mmp: 50, atk: 8, def: 9, mag: 17, mdef: 14, spd: 12, coracao: cor,
    atkNm: 'Faísca', atkIcon: 'luz', atkDesc: 'Uma faísca de luz, de longe. A no tempo certo = faísca dupla.',
    techs: ['cancao', 'velaguia'], superNm: 'Lustre de Mil Velas', superDesc: 'Luz em todos os inimigos e cura o grupo.', superTgt: 'all',
    frame: sideFrame('lumeh'), attack: lumeAtk, super: superLume
  };
  const rita = {
    id: 'rita', name: 'Rita', port: 'rita', col: '#e86050', el: 'corte', lane: 2, row: 'front', h: 50,
    mhp: 132, mmp: 0, atk: 17, def: 12, mag: 6, spd: 10,
    atkNm: 'Lança', atkIcon: 'corte', atkDesc: 'Dois golpes de lança. Um anel para cada golpe.',
    techs: ['estocada', 'provocar'], superNm: 'Carga da Escudeira', superDesc: 'Atravessa todos os inimigos, quatro vezes.', superTgt: 'all',
    frame: sideFrame('rita'), attack: ritaAtk, super: superRita
  };
  return [lume, bau, rita];
}

// ---------- ataques básicos ----------
async function bauAtk(m, t) {
  const [tx] = unitCenter(t);
  await dash(m, tx - (unitFrame(t).width / 2) - 14 - m.x, t.y - m.y, 12);
  await tw(6, p => { m.sx = 1 + p * 0.2; m.sy = 1 - p * 0.2; });
  const ok = await timedPrompt(t, 20);
  m.sx = 0.9; m.sy = 1.2; m.pose = 'front';
  const [x, y] = unitCenter(t);
  await tw(6, p => { // dentes fechando
    const g = (1 - p) * 10; bx.fillStyle = '#ffffff'; for (let i = -2; i <= 2; i++) { bx.fillRect(x + i * 5 - 1, y - 10 + p * 6, 2, 4); bx.fillRect(x + i * 5 - 1, y + 6 - p * 6, 2, 4); } fxRing(x, y, g + 4, '#f0c040', 1 - p);
  });
  if (ok) { BT.stats.crit++; flashW(2); }
  sfx('bite'); hitstop(ok ? 7 : 4); bshake(ok ? 8 : 4, ok ? 3 : 2);
  burst(x, y, ok ? 18 : 10, ['#ffffff', '#f0c040', '#c8a048']);
  hitFoe(m, t, 1.0, { el: 'mordida', crit: ok });
  m.sx = 1; m.sy = 1; m.pose = null;
  await dashBack(m, 12);
}
async function ritaAtk(m, t) {
  const [tx] = unitCenter(t);
  await dash(m, tx - (unitFrame(t).width / 2) - 12 - m.x, (t.fly ? 0 : t.y - m.y), 12);
  for (let i = 0; i < 2; i++) {
    const ok = await timedPrompt(t, i ? 14 : 20);
    const [x, y] = unitCenter(t);
    await tw(5, p => { m.ox += 3; bx.strokeStyle = '#ffffff'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x - 24 + p * 10, y + (i ? 6 : -6)); bx.lineTo(x + 6 + p * 14, y + (i ? -4 : 4)); bx.stroke(); });
    if (ok) BT.stats.crit++;
    sfx('hit'); hitstop(ok ? 6 : 3); bshake(ok ? 6 : 3);
    slashFx(x, y, ok ? '#ffe066' : '#ffffff', i ? -1 : 1, ok);
    burst(x, y, 8, ['#ffffff', '#e86050']);
    hitFoe(m, t, 0.62, { el: 'corte', crit: ok });
    m.ox -= 15; if (t.hp <= 0) break;
  }
  await dashBack(m, 12);
}
async function lumeAtk(m, t) {
  await tw(10, p => { m.oy = -p * 6; const [x, y] = unitCenter(m); fxRing(x + 4, y - 10, 2 + p * 4, '#ffd060', 1); });
  const ok = await timedPrompt(t, 22);
  sfx('rune');
  await projectile(m, t, '#ffe080', 14, { r: 3, trail: ['#ffd060', '#ffffff', '#fff0a0'] });
  const [x, y] = unitCenter(t); burst(x, y, 14, ['#ffe080', '#ffffff']); fxRing(x, y, 10, '#ffffff', 1);
  hitFoe(m, t, 0.9, { el: 'luz', mag: true, crit: ok });
  if (ok && t.hp > 0) { BT.stats.crit++; await projectile(m, t, '#ffffff', 10, { r: 2 }); hitFoe(m, t, 0.45, { el: 'luz', mag: true }); }
  await tw(8, p => { m.oy = -6 * (1 - p); });
}

// ---------- runas ----------
const RUNA2 = {
  brasa: { nm: 'Brasa · Dardo', mp: 5, d: 'Fogo num inimigo. Pode queimar.', run: async (m, t) => {
    sfx('brasa'); await projectile(m, t, '#f07830', 16, { r: 4, trail: ['#f07830', '#ffd040', '#c83a18'] });
    const [x, y] = unitCenter(t); burst(x, y, 22, ['#f07830', '#ffd040', '#c83a18'], { up: 1 }); flashW(1);
    hitFoe(m, t, 1.15, { el: 'fogo', mag: true, ranged: true }); if (Math.random() < 0.35) { t.st.queimado = 3; popNum(x, y - 22, 'QUEIMADO', '#ffa94d'); }
    if (BT.eco) { BT.eco = false; await wait(8); callout('Eco!', '#d0a8ff', 30); await projectile(m, t, '#f07830', 12, { r: 3 }); hitFoe(m, t, 0.7, { el: 'fogo', mag: true, ranged: true }); }
  } },
  geada: { nm: 'Geada · Onda', mp: 9, w: 'pesada', d: 'Gelo em todos. Gela: a barra de vez enche na metade da velocidade.', tgt: 'all', run: async (m) => {
    sfx('geada');
    await tw(22, p => { const r = p * 200; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const [x, y] = unitCenter(m); bx.fillStyle = i % 2 ? '#bff0ff' : '#7ad0f0'; bx.fillRect(Math.round(x + Math.cos(a) * r * 0.2 + r * 0.7), Math.round(y + Math.sin(a) * 18), 2, 2); } });
    for (const t of alive(BT.foes)) { const [x, y] = unitCenter(t); burst(x, y, 14, ['#bff0ff', '#7ad0f0', '#ffffff'], { g: 0.02 }); hitFoe(m, t, 0.7, { el: 'gelo', mag: true, ranged: true }); t.st.frio = 2; }
    if (BT.eco) { BT.eco = false; await wait(10); callout('Eco!', '#d0a8ff', 30); for (const t of alive(BT.foes)) hitFoe(m, t, 0.4, { el: 'gelo', mag: true, ranged: true }); }
  } },
  seiva: { nm: 'Seiva · Véu', mp: 6, w: 'leve', tgt: 'ally', d: 'Cura 30% da vida de um aliado. Ação leve.', run: async (m, t) => {
    sfx('seiva'); const [x, y] = unitCenter(t);
    await tw(24, p => { for (let i = 0; i < 6; i++) { const a = p * 6 + i; bx.fillStyle = i % 2 ? '#9be58a' : '#4a9a4a'; bx.fillRect(Math.round(x + Math.cos(a) * 14), Math.round(y + 10 - p * 26 + Math.sin(a) * 3), 2, 2); } });
    healUnit(t, Math.round(t.mhp * 0.3)); if (BT.eco) { BT.eco = false; healUnit(t, Math.round(t.mhp * 0.15)); }
  } }
};

// ---------- técnicas (gastam Tensão) ----------
const TECH2 = {
  guardar: { nm: 'Guardar', cost: 15, tgt: 'ally', w: 'leve', d: 'O baú entra na frente do próximo golpe num aliado (toma 40% menos). Leve.', run: async (m, t) => {
    if (t === m) { callout('Escolha outro aliado', '#ff6b6b', 40); BT.tension += 15; return; }
    if (m.guarding) m.guarding.st.guardado = 0;
    t.st.guardado = 9; t.guardBy = m; m.guarding = t; sfx('guard');
    const [x, y] = unitCenter(t); await tw(16, p => fxRing(x, y, 8 + p * 10, '#ffa94d', 1 - p)); callout(m.name + ' guarda ' + t.name, '#ffa94d', 50);
  } },
  baluarte: { nm: 'Baluarte', cost: 35, tgt: 'self', d: 'Assinatura da linha de Ferro: a tampa vira muralha. Todo o grupo leva metade do dano até a próxima vez de cada um.', run: async (m) => {
    sfx('gate'); bshake(10, 2);
    await tw(24, p => { const [x, y] = unitCenter(m); bx.globalAlpha = 0.5 * (1 - p); bx.fillStyle = '#c8c8d8'; bx.fillRect(x + 14, y - 30 + (1 - ease.out(p)) * 40, 8, 54); bx.globalAlpha = 1; });
    for (const u of alive(BT.party)) u.def0 = true; callout('Baluarte!', '#c8c8d8', 50);
  } },
  eco: { nm: 'Eco de Runa', cost: 20, tgt: 'self', w: 'leve', d: 'Assinatura da linha Arcana: a próxima runa se repete com mais força. Leve.', run: async (m) => {
    sfx('buff'); BT.eco = true; const [x, y] = unitCenter(m); await tw(20, p => { fxRing(x, y, p * 20, '#d0a8ff', 1 - p); fxRing(x, y, p * 12, '#ffffff', 1 - p); }); callout('A próxima runa vai ecoar', '#d0a8ff', 50);
  } },
  cancao: { nm: 'Canção', cost: 30, tgt: 'self', w: 'normal', d: 'A Lume canta: cura 25% do grupo e tira queimadura e frio.', run: async (m) => {
    sfx('heal'); jingle('E5:2 G5:2 B5:2 E6:4', 220);
    await tw(36, (p, k) => { const [x, y] = unitCenter(m); for (let i = 0; i < 3; i++) txt('♪', x + 6 + i * 8 + Math.sin(k / 6 + i) * 3, y - 16 - p * 30 - i * 5, { col: i % 2 ? '#ffd060' : '#fff0a0', alpha: 1 - p }); });
    for (const u of alive(BT.party)) { healUnit(u, Math.round(u.mhp * 0.25)); u.st.queimado = 0; u.st.frio = 0; }
  } },
  velaguia: { nm: 'Vela-guia', cost: 15, tgt: 'enemy', w: 'leve', d: 'Ilumina um inimigo: mostra todas as fraquezas. Leve.', run: async (m, t) => {
    sfx('rune'); await projectile(m, t, '#ffd060', 14, { r: 2 });
    const [x, y] = unitCenter(t); await tw(20, p => { fxRing(x, y, 30 * (1 - p) + 4, '#ffd060', p); });
    for (const k of ['fogo', 'gelo', 'luz', 'corte', 'mordida']) t.known[k] = t.weak.includes(k) ? 'weak' : 'ok';
    callout('Fraquezas à mostra!', '#ffd060', 50);
  } },
  estocada: { nm: 'Estocada', cost: 20, tgt: 'enemy', d: 'Um golpe de lança que quebra 2 de escudo se acertar a fraqueza.', run: async (m, t) => {
    const [tx] = unitCenter(t); await dash(m, tx - unitFrame(t).width / 2 - 14 - m.x, t.fly ? 0 : t.y - m.y, 10);
    const ok = await timedPrompt(t, 18); const [x, y] = unitCenter(t);
    await tw(6, p => { m.ox += 4; bx.fillStyle = '#ffffff'; bx.fillRect(x - 30 + p * 20, y - 1, 30, 2); });
    sfx('crit'); hitstop(8); bshake(8, 3); burst(x, y, 16, ['#ffffff', '#e86050', '#ffe066']);
    hitFoe(m, t, 1.4, { el: 'corte', crit: ok, brk: 2 }); if (ok) BT.stats.crit++;
    await dashBack(m, 12);
  } },
  provocar: { nm: 'Provocar', cost: 10, tgt: 'self', w: 'leve', d: 'Os inimigos miram a Rita nas próximas duas vezes, e ela se defende. Leve.', run: async (m) => {
    sfx('select'); BT.taunt = { m, n: 2 }; m.def0 = true;
    const [x, y] = unitCenter(m); await tw(24, p => txt('Vem!', x, y - 34 - p * 6, { align: 'center', col: '#ff8a70', alpha: 1 - p * 0.5, shadow: true })); callout('Rita chama a atenção', '#ff8a70', 40);
  } }
};

// ---------- duplas ----------
const DUPLA2 = {
  canescudo: { nm: 'Canção-Escudo', who: ['bau', 'lume'], tgt: 'party', col: '#c89a30', d: 'A Lume canta dentro da tampa: o grupo leva metade do dano e se cura.', run: async (a, b) => {
    sfx('heal'); jingle('C5:2 E5:2 G5:2 C6:2 G5:2 C6:6', 240);
    await tw(40, p => { for (const u of alive(BT.party)) { const [x, y] = unitCenter(u); fxRing(x, y, 14 + Math.sin(p * 12) * 2, '#ffd060', 0.8 * (1 - p * 0.5)); } });
    const extra = b.coracao >= 8 ? 0.1 : 0;
    for (const u of alive(BT.party)) { u.def0 = true; healUnit(u, Math.round(u.mhp * (0.2 + extra))); }
    if (extra) callout('A canção sai mais quente (♥)', '#ffb0c0', 50);
  } },
  lancatampa: { nm: 'Lança de Tampa', who: ['bau', 'rita'], tgt: 'one', col: '#b84040', d: 'A Rita mergulha dentro do baú e a lança sai pela tampa. Quebra 3 de escudo.', run: async (a, b, t) => {
    const [tx] = unitCenter(t);
    await tw(14, p => { b.ox = (a.x - b.x) * ease.io(p); b.oy = (a.y - b.y) * ease.io(p) - Math.sin(p * Math.PI) * 20; b.sy = 1 - p; });
    b.alpha = 0; sfx('bite');
    await dash(a, tx - unitFrame(t).width / 2 - 14 - a.x, t.fly ? 0 : t.y - a.y, 12);
    const ok = await timedPrompt(t, 18);
    a.pose = 'front'; const [x, y] = unitCenter(t);
    await tw(10, p => { bx.fillStyle = '#ffffff'; bx.fillRect(x - 40 + p * 30, y - 2, 46, 3); bx.fillStyle = '#e86050'; bx.fillRect(x + 4 + p * 30, y - 3, 6, 5); });
    sfx('crit'); hitstop(10); bshake(14, 4); flashW(3); burst(x, y, 30, ['#ffffff', '#e86050', '#f0c040'], { max: 4 });
    hitFoe(a, t, 2.6, { el: 'corte', crit: ok, brk: 3 }); if (t.hp > 0) hitFoe(a, t, 0.01, { el: 'mordida' });
    a.pose = null; b.alpha = 1; b.sy = 1; b.ox = 0; b.oy = 0;
    await dashBack(a, 12);
  } },
  lancaacesa: { nm: 'Lança Acesa', who: ['lume', 'rita'], tgt: 'all', col: '#d07a30', d: 'A Lume acende a lança da Rita: luz e corte em todos os inimigos.', run: async (a, b) => {
    sfx('rune'); await tw(16, p => { const [x, y] = unitCenter(b); fxRing(x + 10, y - 12, p * 10, '#ffd060', 1); });
    for (const t of alive(BT.foes)) {
      const [x, y] = unitCenter(t); sfx('hit');
      await tw(8, p => { bx.fillStyle = '#ffe080'; bx.fillRect(x - 30 + p * 30, y - 1, 30, 2); });
      burst(x, y, 16, ['#ffe080', '#ffffff', '#e86050']); hitstop(4);
      hitFoe(b, t, 0.9, { el: 'corte' }); if (t.hp > 0) hitFoe(a, t, 0.7, { el: 'luz', mag: true });
    }
  } }
};

// ---------- SUPERS ----------
async function superBau(m, t) {
  const boss = !!t.boss;
  const [tx] = unitCenter(t);
  await tw(16, p => { m.sx = 1 + p * 1.2; m.sy = 1 + p * 1.2; });
  await dash(m, tx - unitFrame(t).width / 2 - 24 - m.x, t.fly ? 0 : t.y - m.y, 10);
  m.pose = 'front'; sfx('bite'); bshake(6);
  if (!boss) { await tw(16, p => { t.sx = 1 - p * 0.85; t.sy = 1 - p * 0.85; t.ox = -(p * 26); }); t.alpha = 0; }
  else await tw(12, p => { t.sx = 1 - p * 0.15; });
  m.pose = 'closed';
  for (let i = 0; i < 3; i++) { sfx('bite'); bshake(8, 3); hitstop(4); await tw(10, p => { m.sy = 2.2 - Math.sin(p * Math.PI) * 0.3; m.sx = 2.2 + Math.sin(p * Math.PI) * 0.3; }); }
  if (boss) callout('Não cabe! Mas dói.', '#f0c040', 50);
  m.pose = 'front'; t.alpha = 1; sfx('crit'); flashW(4); hitstop(12); bshake(16, 4);
  await tw(14, p => { t.sx = 0.15 + p * 0.85; t.sy = 0.15 + p * 0.85; t.ox = -26 + p * 40; });
  const [x, y] = unitCenter(t); burst(x, y, 40, ['#f0c040', '#ffffff', '#c8a048'], { max: 4.5 });
  hitFoe(m, t, 4.2, { el: 'mordida', brk: 3, crit: true });
  t.ox = 0; t.sx = 1; t.sy = 1; m.pose = null;
  await tw(12, p => { m.sx = 2.2 - p * 1.2; m.sy = 2.2 - p * 1.2; });
  await dashBack(m, 12);
}
async function superLume(m) {
  sfx('catalog');
  // mil velinhas acendem no céu e caem como luz
  const velas = Array.from({ length: 28 }, (_, i) => ({ x: 100 + (i * 37) % 140, y: 30 + (i * 13) % 50, d: i * 2 }));
  await tw(50, (p, k) => { for (const v of velas) { if (k < v.d) continue; const f = (k + v.d) % 8 < 4; bx.fillStyle = '#f2ecdc'; bx.fillRect(v.x, v.y + 4, 2, 5); bx.fillStyle = f ? '#ffd060' : '#ff9a30'; bx.fillRect(v.x, v.y + 1, 2, 3); bx.fillStyle = '#ffffff'; bx.fillRect(v.x, v.y + 2, 1, 1); } });
  for (const t of alive(BT.foes)) {
    const [x, y] = unitCenter(t);
    await tw(10, p => { bx.globalAlpha = 0.7 * (1 - p); bx.fillStyle = '#fff0a0'; bx.fillRect(x - 8, 20, 16, y - 20); bx.globalAlpha = 1; });
    flashW(2); sfx('crit'); burst(x, y, 24, ['#ffe080', '#ffffff']); hitFoe(m, t, 2.3, { el: 'luz', mag: true, brk: 2 });
  }
  for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.2));
}
async function superRita(m) {
  sfx('crit');
  for (let r = 0; r < 4; r++) {
    for (const t of alive(BT.foes)) {
      const [x, y] = unitCenter(t);
      await tw(5, p => { m.ox = (x - m.x) * p; m.oy = (y - m.y + 20) * p; bx.fillStyle = '#ffffff'; bx.fillRect(x - 20, y - 1 + r * 2 - 3, 40 * p, 2); });
      sfx('hit'); hitstop(3); bshake(4); burst(x, y, 8, ['#ffffff', '#e86050']); hitFoe(m, t, 0.75, { el: 'corte', brk: r === 0 ? 1 : 0 });
    }
  }
  await dashBack(m, 14);
}

// ---------- inimigos ----------
const ENEMY2 = {
  corvo: { name: 'Corvo-Cartaz', mhp: 100, atk: 11, def: 5, spd: 12, shield: 2, maxShield: 2, weak: ['fogo', 'luz', 'corte'], ai: 'corvo', fly: 56, h: 26,
    frame: u => corvoFrame(u.pose ?? (u.flash > 0 ? 3 : Math.floor(BT.t / 7 + u.x) % 2)), dieCols: ['#d8c8a0', '#b8a070', '#2a2a44'] },
  espantalho: { name: 'Espantalho do Pedágio', boss: true, mhp: 2300, atk: 22, def: 11, mdef: 9, spd: 11, shield: 5, maxShield: 5, weak: ['fogo', 'corte'], ai: 'espantalho', h: 100, ph: 1,
    frame: u => espFrame(u.ph, u.pose ?? (Math.floor(BT.t / 30) % 2), u.flash > 0), dieCols: ['#c8a048', '#e8a030', '#f2ecdc', '#ffffff'],
    cancelTxt: 'A cancela despencou! Golpe cancelado!' }
};
// alvo: respeita o Provocar da Rita
function foeTarget() {
  if (BT.taunt && BT.taunt.m.hp > 0 && BT.taunt.n > 0) { BT.taunt.n--; return BT.taunt.m; }
  const l = alive(BT.party); return l.length ? pickOne(l) : null;
}
const AI2 = {
  async corvo(e) {
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.7 || alive(BT.party).length < 2) {
      callout('Bicada!', '#d0a8ff', 30);
      const [tx, ty] = unitCenter(t), [ex, ey] = unitCenter(e);
      e.pose = 2;
      await tw(14, p => { e.ox = (tx + 18 - ex) * ease.in(p); e.oy = (ty - ey) * ease.in(p); });
      await foeStrike(e, t, 1.0, { n: 22, fast: true });
      e.pose = null; await tw(12, p => { e.ox *= (1 - p); e.oy *= (1 - p); }); e.ox = 0; e.oy = 0;
    } else {
      callout('Chuva de Papel!', '#d0a8ff', 40);
      for (const m of alive(BT.party)) { await tw(8, p => { const [x, y] = unitCenter(m); for (let i = 0; i < 4; i++) { bx.fillStyle = '#d8c8a0'; bx.fillRect(x - 10 + i * 6, y - 30 + p * 26 + i * 2, 3, 2); } }); await foeStrike(e, m, 0.5, { n: 20, fast: true, noCounter: true }); }
    }
  },
  async espantalho(e) {
    // golpe preparado: a cancela desce
    if (e.charge) {
      const t = e.charge.t.hp > 0 ? e.charge.t : foeTarget(); e.charge = null; if (!t) return;
      callout('CANCELADA!', '#ff6b6b', 50);
      e.pose = 2; await wait(12); e.pose = 3; sfx('rumble'); bshake(16, 4);
      const [x, y] = unitCenter(t); burst(x, y + 10, 26, ['#c8a048', '#8a6a3a', '#ffffff'], { up: 2 });
      await foeStrike(e, t, e.ph >= 3 ? 2.9 : 2.5, { n: 30, label: 'GOLPE FORTE' });
      e.pose = null; return;
    }
    const n = e.turns, ph = e.ph;
    if (n % 4 === 2) {
      const t = foeTarget(); if (!t) return;
      e.charge = { t }; e.pose = 2;
      callout('Levanta a cancela!', '#ff6b6b', 90);
      if (!G.flags.tutCharge) { G.flags.tutCharge = true; hint('O "!" vermelho na linha do tempo é um golpe preparado. Zere o escudo dele antes disso (fraquezas!) e a cancela cai.', 420); }
      sfx('gate'); await tw(20, p => { const [x, y] = unitCenter(t); fxRing(x, y, 20 - p * 10, '#ff6b6b', p); });
      return;
    }
    const opts = ['moedas', 'golpe'];
    if (ph === 1 && alive(BT.foes).length < 2) opts.push('corvos', 'corvos');
    if (ph >= 2) opts.push('bafo', 'bafo');
    if (ph >= 3) opts.push('taxa');
    const k = pickOne(opts);
    if (k === 'golpe') {
      const t = foeTarget(); if (!t) return; callout('Golpe de Cancela', '#d0a8ff', 40);
      e.pose = 2; await wait(8); e.pose = 3; sfx('hit'); await foeStrike(e, t, 1.25, { n: 28 }); e.pose = null;
    } else if (k === 'moedas') {
      callout('Chuva de Moedas!', '#d0a8ff', 50); e.pose = 3; sfx('item');
      for (const m of alive(BT.party)) {
        const [x, y] = unitCenter(m);
        await tw(10, p => { for (let i = 0; i < 5; i++) { const cx = x - 12 + i * 6, cy = y - 50 + p * 46 + (i % 2) * 4; bx.fillStyle = '#d0a030'; bx.fillRect(cx, cy, 3, 3); bx.fillStyle = '#fff0a0'; bx.fillRect(cx, cy, 1, 1); } });
        await foeStrike(e, m, 0.6, { n: 20, fast: true, noCounter: true });
      }
      e.pose = null;
    } else if (k === 'corvos') {
      callout('Os cartazes viram corvos!', '#d0a8ff', 50); sfx('encounter');
      const c = mkFoe(ENEMY2.corvo, 142, 84); c.ct = 0; c.alpha = 0; BT.foes.push(c);
      await tw(20, p => { c.alpha = p; c.oy = -20 * (1 - p); }); c.oy = 0;
    } else if (k === 'bafo') {
      callout('Bafo de Lanterna!', '#ffa94d', 50); sfx('brasa'); e.pose = 2;
      for (const m of alive(BT.party)) {
        const [x, y] = unitCenter(m), [ex, ey] = [e.x - 2, e.y - 82];
        await tw(10, p => { for (let i = 0; i < 6; i++) { const q = Math.min(1, p + i * 0.05); bx.fillStyle = pickOne(RP.fogo.slice(1)); bx.fillRect(Math.round(ex + (x - ex) * q + rand(-3, 3)), Math.round(ey + (y - ey) * q + rand(-3, 3)), 3, 3); } });
        await foeStrike(e, m, 0.8, { n: 22, st: 'queimado', stT: 3, noCounter: true });
      }
      e.pose = null;
    } else if (k === 'taxa') {
      const t = foeTarget(); if (!t) return;
      const tax = Math.min(BT.tension, 25); BT.tension -= tax;
      callout('Taxa do Pedágio! (-' + tax + ' de Tensão)', '#ffa94d', 60); sfx('item');
      await foeStrike(e, t, 1.1, { n: 24 });
      if (tax > 0) { const h = Math.round(e.mhp * 0.03); e.hp = Math.min(e.mhp, e.hp + h); popNum(e.x, e.y - 60, '+' + h, '#9be58a'); }
    }
  }
};

// fases do Espantalho
function fasesEspantalho() {
  return [
    { at: 0.66, run: async (e) => {
      sfx('rumble'); bshake(30, 3); flashW(4);
      await say('A LANTERNA... ACENDEU. VOCÊS PAGAM COM LUZ, ENTÃO.', 'esp');
      e.ph = 2; e.weak = ['gelo', 'mordida']; e.maxShield = 6; e.shield = 6; e.mini = null;
      burst(e.x, e.y - 80, 40, RP.fogo, { up: 1.5 });
      callout('As fraquezas mudaram!', '#8fe3ff', 90);
    } },
    { at: 0.33, run: async (e) => {
      sfx('rumble'); bshake(40, 4); flashW(6);
      await say('OS CARTAZES... QUEIMARAM. MAS O CORAÇÃO... AINDA COBRA.', 'esp');
      e.ph = 3; e.weak = ['luz']; e.maxShield = 4; e.shield = 4; e.spd = 13; e.mini = null;
      burst(e.x, e.y - 50, 60, ['#d8c8a0', '#b8a070', '#f07830', '#2a1e1a'], { max: 4, life: 50 });
      callout('O coração de âmbar está exposto!', '#ffd060', 90);
      if (!G.flags.tutSuper) { G.flags.tutSuper = true; hint('Tensão cheia? O SUPER aparece na roda. Duplas: um aliado com a barra de vez pela metade + 50 de Tensão.', 400); }
    } }
  ];
}

// ---------- cena (história fora da batalha) ----------
const CENA = { bg: null, actors: [], t: 0 };
function drawCena() {
  CENA.t++;
  bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
  if (CENA.bg) bx.drawImage(CENA.bg(), 0, 12);
  if (CENA.extra) CENA.extra(CENA.t);
  for (const a of [...CENA.actors].sort((p, q) => p.y - q.y)) {
    const fr = a.fr(CENA.t); if (!fr) continue;
    bx.globalAlpha = 0.35; bx.fillStyle = '#000'; bx.fillRect(Math.round(a.x - fr.width * 0.35), a.y - 1, Math.round(fr.width * 0.7), 3); bx.globalAlpha = a.alpha ?? 1;
    bx.drawImage(fr, Math.round(a.x - fr.width / 2), Math.round(a.y - fr.height + (a.oy || 0)));
    bx.globalAlpha = 1;
  }
}
// o 31 visto de lado, parado na estrada
let BUS_C = null;
function busArt() {
  if (BUS_C) return BUS_C;
  const P = new Pix(96, 46), cream = ramp('#d8c890'), blue = ramp('#3a70c0');
  P.cyl(2, 4, 92, 34, cream, true);
  P.rect(2, 26, 92, 5, blue[2]); P.rect(2, 26, 92, 1, blue[3]);
  for (let i = 0; i < 6; i++) { P.rect(8 + i * 13, 8, 10, 11, '#1c3058'); P.rect(9 + i * 13, 9, 4, 3, '#4a70a0'); }
  P.rect(84, 8, 8, 16, '#1c3058'); P.rect(85, 9, 2, 5, '#5a80b0');                         // para-brisa
  P.rect(70, 14, 12, 18, '#2a2a3a'); P.rect(71, 15, 4, 16, '#3a3a4a');                     // porta
  P.rect(40, 0, 18, 5, '#2a1a10'); P.rect(42, 1, 14, 3, '#ffb040');                        // letreiro
  P.rect(88, 30, 4, 3, '#ffe0a0'); P.rect(2, 30, 3, 3, '#c83030');                         // faróis
  for (const wx of [18, 74]) { P.ball(wx, 39, 6, 6, ramp('#2a2a34')); P.ball(wx, 39, 2, 2, ramp('#8a8a9a')); }
  P.outline(); return BUS_C = P.canvas();
}
function standF(k) { return t => { const S = IMG.spf[k] && IMG.spf[k].s; return S ? flipC(S[Math.floor(t / 30) % S.length]) : null; }; }
function chestF() { return t => { const C = IMG.chest[G.species]; return C ? ((t % 160) < 6 ? C.closed : C.three) : null; }; }

// ---------- a história do capítulo ----------
async function abertura() {
  CENA.bg = ponteBG; CENA.actors = [];
  const bus = { x: 60, y: 150, fr: () => busArt() }; CENA.actors.push(bus);
  V.scene = 'cena'; playMusic('estrada2');
  // o ônibus entra devagar
  await fadeIn(30);
  await say('* O 31 desce a serra com o motor tossindo. Lá embaixo, Velhágua afunda devagar, telhado por telhado, num rio cor de pêssego.');
  await say('* Faz três dias que a tampa da masmorra abriu. Três dias de sol. Você ainda não se acostumou com o teto ser tão longe.');
  await say('Mais uma curva e a gente chega. Juro que essa eu faço devagar.', 'jorge');
  await say('* Ninguém ri. Depois todo mundo ri.');
  const H = G.her;
  await say('@, olha. DEDOS. Eu tenho dedos de novo! De dia, pelo menos. Quando o sol bate no âmbar do lustre, ele lembra que eu era gente.', 'lume');
  if (H && H.esc && H.esc.rita) await say('Eu prometi um café pra alguém aqui em cima. Só tô esperando achar um lugar que não tenha afundado.', 'rita');
  else await say('Escudeira Rita, de volta ao serviço. Alguém vai ter que explicar pra Coroa por que tem um baú sentado no banco da frente.', 'rita');
  if (H && H.esc && H.esc.rita) await say('* A Lume olha para a Rita. A Rita olha para a janela. O sol, educado, olha para outro lado.');
  sfx('rumble'); V.shake = 14;
  await say('* O ônibus freia de repente. Na cabeceira da ponte, uma cancela listrada está abaixada no meio da estrada.');
  await say('Pedágio? Isso aqui nunca teve pedágio. Nem ponte tinha, quando eu passei com o 31.', 'jorge');
  // o grupo desce
  CENA.actors.push({ x: 156, y: 148, fr: standF('rita') }, { x: 132, y: 142, fr: chestF() }, { x: 116, y: 136, fr: standF('lumeh') });
  sfx('step');
  await say('* Em cada poste da beira da estrada, dezenas de cartazes. PROCURADO. Um desenho torto de um baú com dentes. Recompensa: 300 frascos de âmbar.');
  const ren = H && H.renome;
  if (ren === 'Coisa que não devia existir' || ren === 'Lenda de Velhágua') await say('Trezentos frascos. Você vale mais que uma casa, sabia? Eu fico até sem graça de andar do seu lado.', 'lume');
  else await say('Ah. Você é famoso. Que desenho feio, coitado. Você é bem mais bonito. Para um baú.', 'lume');
  await say('* Então um cartaz se dobra sozinho. Depois outro. Bicos de papel. Olhos de brasa.');
  await say('Eles estão olhando pro desenho. E depois pra você. E depois pro desenho.', 'rita');
}
async function entreLutas() {
  CENA.bg = ponteBG; V.scene = 'cena';
  await fadeIn(16);
  await say('* O papel picado no chão não fica no chão. Ele sobe pelo poste da cancela, folha por folha, e se veste.');
  sfx('rumble'); V.shake = 20;
  await say('* Um casaco de cartazes. Um chapéu de palha com a fita do pedágio. E, no lugar da cabeça, uma lanterna velha de ferro com um rosto recortado.');
  await say('PEDÁGIO. UM BAÚ PASSA... UM BAÚ FICA.', 'esp');
  await say('Isso é um espantalho de pedágio. Na minha vila tinha um. Ele espantava os corvos, não fazia os corvos.', 'rita');
  await say('@... a lanterna dele tá apagada. Igual eu ficava. Tem alguma coisa lá dentro que ainda não acendeu.', 'lume');
}
async function fimDemo() {
  CENA.actors = CENA.actors.filter(a => a.fr !== CENA.espF);
  V.scene = 'cena'; playMusic('ending'); await fadeIn(20);
  await say('* O Espantalho desaba devagar, como um casaco que alguém tira. A palha se espalha na estrada. Sobra só uma pedrinha quente e dourada.');
  await say('Âmbar. É... uma lembrança. Dá pra sentir na mão. Um homem velho cobrando pedágio nessa ponte. Quarenta anos de "bom dia". Alguém leu ele inteiro e deixou só isso.', 'lume');
  await say('A masmorra não engoliu só gente lá embaixo, então. Ela tá subindo.', 'rita');
  await say('Ou alguém tá trazendo ela pra cima.', 'jorge');
  await say('* A cancela, sem ninguém para segurar, sobe sozinha. Do outro lado da ponte, os sinos de Velhágua tocam meio desafinados, metade deles já embaixo d\'água.');
  await say('* E na guarita do pedágio, num prego, um último cartaz. Não é de PROCURADO. É de BEM-VINDOS. Alguém riscou o "BEM".');
  G.flags.cap1Ponte = true; save2();
  await fadeOut(40);
  V.scene = 'fim1'; await fadeIn(30);
  await new Promise(r => { V.fimR = r; });
}

// ---------- fluxo ----------
async function lutaCorvos() {
  const itens0 = { ...G.items };
  while (true) {
    G.items = { ...itens0 };
    const res = await battle2({
      party: grupoCap1(), foes: [{ id: 'corvo', x: 158, y: 92 }, { id: 'corvo', x: 206, y: 110 }], music: 'luta2', tension: 0,
      intro: async () => {
        if (!G.flags.tut1) { G.flags.tut1 = true; hint('LINHA DO TEMPO no topo: quem age a seguir. As barras embaixo enchem sozinhas. Quando enche, a roda de comandos abre.', 360); }
      }
    });
    if (res === 'win') return true;
    if (res === 'quit') return false;
    await fadeOut(10);
  }
}
async function lutaEspantalho() {
  const itens0 = { ...G.items };
  while (true) {
    G.items = { ...itens0 };   // cada tentativa começa com os itens de antes da luta
    const res = await battle2({
      party: grupoCap1(), music: 'pedagio', tension: 20,
      foes: [{ id: 'espantalho', x: 190, y: 154 }, { id: 'corvo', x: 132, y: 80 }],
      intro: async () => { const e = BT.foes[0]; e.phases = fasesEspantalho(); e.ct = 10; callout('ESPANTALHO DO PEDÁGIO', '#f0d8a0', 100); }
    });
    if (res === 'win') return true;
    if (res === 'quit') return false;
    await fadeOut(10);
  }
}
let HINTED = {};
async function capitulo1() {
  if (!G.flags.cap1Corvos) {
    await abertura();
    await fadeOut(12);
    hintOnce('menu');
    if (!await lutaCorvos()) return titleFlow2();
    G.flags.cap1Corvos = true; save2();
  }
  await fadeOut(12);
  await entreLutas();
  await fadeOut(12);
  if (!await lutaEspantalho()) return titleFlow2();
  G.flags.cap1Boss = true; save2();
  await fadeOut(16);
  await fimDemo();
  titleFlow2();
}
// dicas que aparecem uma vez, na primeira vez que a situação acontece
function hintOnce() { }
{ const _oc = openCommand; openCommand = function (m) {
  if (m.guarding) { m.guarding.st.guardado = 0; m.guarding = null; }
  if (!G.flags.tutMenu) { G.flags.tutMenu = true; hint('Direcional gira a roda, A escolhe, B volta. No ataque, aperte A quando o anel amarelo fechar no alvo.', 360); }
  return _oc(m);
}; }
{ const _dr = defenseRing; defenseRing = function (m, n, o) {
  if (!G.flags.tutDef) { G.flags.tutDef = true; hint('DEFESA: A quando o anel encostar no círculo do seu aliado. PERFEITO = quase nada de dano e contra-ataque!', 300); n = (n || 34) + 18; }
  return _dr(m, n, o);
}; }

// ---------- save da T2 ----------
const SAVE2 = 'renasci_t2_v1';
function save2() { try { localStorage.setItem(SAVE2, JSON.stringify(G)); } catch (e) { } }
function load2() { try { const s = localStorage.getItem(SAVE2); return s ? JSON.parse(s) : null; } catch (e) { return null; } }

// ---------- título ----------
function drawTitle2() {
  const t = FRAME;
  bx.drawImage(ponteBG(), 0, 45);
  bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, 46); bx.fillRect(0, 195, W, 45);
  for (let i = 0; i < 30; i++) { const x = (i * 71 + 13) % 240, y = (i * 37) % 44; if ((t + i * 13) % 90 < 60) { bx.fillStyle = i % 4 ? '#5a5070' : '#ffe066'; bx.fillRect(x, y, 1, 1); } }
  txt('RENASCI COMO BAÚ', 120, 8, { align: 'center', sz: 1.5, col: '#ffe066', shadow: true });
  txt('TEMPORADA 2 · A SUPERFÍCIE', 120, 30, { align: 'center', col: '#ff8fa8' });
  const C = IMG.chest[G.species]; if (C) { const fr = (t % 120) < 6 ? C.closed : C.three, hop = Math.abs(Math.sin(t / 20)) * 3; bx.drawImage(fr, 100, 150 - hop); }
  const H = G.her;
  if (H) txt(`Herança: ${H.name} · ${HARTE.species[G.species] ? HARTE.species[G.species].name : ''}`, 120, 200, { align: 'center', col: '#9be58a' });
  else txt('Nenhuma herança da Temporada 1 neste aparelho', 120, 200, { align: 'center', col: '#8a8099' });
  if (t % 60 < 40) txt('Aperte A', 120, 216, { align: 'center', col: '#ffffff' });
  txt('Cap. 1 (prévia)', 4, 228, { col: '#5a5070' }); txt('t2-0.1', 236, 228, { align: 'right', col: '#5a5070' });
}
function drawFim1() {
  bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
  txt('FIM DA PRÉVIA DO CAPÍTULO 1', 120, 70, { align: 'center', col: '#ffe066' });
  txt('Próximo: Velhágua, a cidade que afunda.', 120, 96, { align: 'center', col: '#b8aecb' });
  txt('Obrigado por testar o combate novo!', 120, 120, { align: 'center', col: '#8fe3ff' });
  if (FRAME % 60 < 40) txt('A', 120, 160, { align: 'center' });
  if (btnp('a') && V.fimR) { const r = V.fimR; V.fimR = null; sfx('select'); r(); }
}
async function titleFlow2() {
  V.scene = 'title'; UI.stack.length = 0; playMusic('title'); await fadeIn(20);
  await new Promise(r => { const f = () => { if (V.scene !== 'title') return; if (btnp('a')) { r(); return; } requestAnimationFrame(f); }; f(); });
  sfx('select');
  const sv = load2();
  let novo = true;
  if (sv && (sv.flags.cap1Corvos || sv.flags.cap1Boss)) {
    const c = await choose('* Há um jogo da Temporada 2 salvo.', ['Continuar', 'Começar de novo']);
    if (c === 0) { Object.assign(G, sv); novo = false; }
  }
  if (novo) {
    const H = G.her;
    G.flags = {};
    if (!H) {
      await say('* Nenhuma herança da Temporada 1 foi encontrada neste aparelho. Tudo bem: vamos lembrar juntos.');
      G.name = await nameInput();
      const c = await choose('* Na masmorra, você virou...', ['Arca da Origem (linha de Ferro)', 'Mímico Vazio (linha Arcana)']);
      G.species = c === 0 ? 'arca' : 'vazio';
    }
  }
  PTC.me = null;
  await fadeOut(20);
  capitulo1();
}

// ---------- laço principal ----------
function tick() {
  FRAME++;
  JP = { ...JPQ }; for (const k in JPQ) delete JPQ[k];
  for (let i = WAITS.length - 1; i >= 0; i--) if (--WAITS[i].n <= 0) { const w = WAITS.splice(i, 1)[0]; w.r(); }
  if (V.tw) { const t = V.tw; t.t++; V.fade = t.from + (t.to - t.from) * Math.min(1, t.t / t.n); if (t.t >= t.n) { V.tw = null; t.r(); } }
  if (V.scene === 'battle2' || V.scene === 'cena') G.time += 1 / 60;
  const top = UI.top();
  if (top) top.update();
  if (V.scene === 'battle2') { updateBattle2(); drawBattle2(); }
  else if (V.scene === 'cena') drawCena();
  else if (V.scene === 'title') drawTitle2();
  else if (V.scene === 'fim1') drawFim1();
  else { bx.fillStyle = '#000'; bx.fillRect(0, 0, W, H); }
  for (const w of UI.stack) w.draw();
  if (V.fade > 0) { bx.fillStyle = `rgba(0,0,0,${V.fade})`; bx.fillRect(0, 0, W, H); }
  let sx = 0, sy = 0; if (V.shake > 0) { V.shake--; sx = Math.round(rand(-2, 2)); sy = Math.round(rand(-2, 2)); }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(buf, 0, 0, W, H, Math.round(sx * S), Math.round(sy * S), cvs.width, cvs.height);
  if (sx || sy) for (const t of TQ) { t.x += sx; t.y += sy; }
  flushText();
}
let FT_LAST = 0, FT_ACC = 0;
function frame(ts) {
  if (!FT_LAST) FT_LAST = ts;
  FT_ACC += Math.min(100, ts - FT_LAST); FT_LAST = ts;
  let n = 0;
  while (FT_ACC >= 1000 / 60 - 1 && n < 4) { FT_ACC -= 1000 / 60; for (let z = 0; z < (window.TURBO || 1); z++) tick(); n++; }
  if (FT_ACC < 0) FT_ACC = 0;
  requestAnimationFrame(frame);
}
async function boot2() {
  buildFont(); buildIcons(); resize(); setupTouch();
  await loadHeranca();
  const H = lerHeranca();
  G.her = H;
  if (H) { G.name = H.name || G.name; const f = formaFinal(H); if (f && IMG.chest[f]) G.species = f; }
  else G.species = 'arca';
  requestAnimationFrame(frame);
  titleFlow2();
}
