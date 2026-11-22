// ================= CAPÍTULO 1: A PONTE DO PEDÁGIO =================

// ---------- herança da Temporada 1 ----------
const LINHA_FERRO = ['ferro', 'fortaleza', 'espinho', 'bastiao', 'abismo', 'ferrao', 'carniceiro', 'arca'];
function lerHeranca() {
  try { const s = localStorage.getItem('renasci_heranca'); if (s) return JSON.parse(s); } catch (e) { }
  return null;
}
function formaFinal(H) { if (!H) return null; if (H.grau5) return H.grau5; const L = H.line || []; return L[L.length - 1] || null; }
// a linha vem do caminho inteiro herdado (a Arca e o Vazio podem vir de qualquer uma das duas)
const linhaDe = sp => { const L = G.her && G.her.line; if (L && L.length) return L.includes('ferro') ? 'ferro' : 'arcano'; return LINHA_FERRO.includes(sp) ? 'ferro' : 'arcano'; };
// herança do André (convertida do backup do save da T1 que ele enviou): vale quando o aparelho não tem herança gravada
const HER_ANDRE = {"v": 1, "name": "André", "line": ["caixote", "ferro", "espinho", "carniceiro", "arca"], "grau5": "arca", "face": {"body": "carniceiro", "aura": "arca", "blur": 2}, "mem": {"pastel": false, "vazio": false}, "lume": {"cancao": true, "fone": true, "coracao": 14}, "esc": {"ofelia": true, "maren": false, "jorge": "livre", "tiago": true, "rita": true, "ritaNota": 5, "marlene": "conosco", "ch6": "cancao", "coracao": "guardar", "almas": ["zelia", "priscila", "teo", "rafael", "luzia", "benedito"]}, "feats": ["musgo", "polvo", "brida", "jaulas", "cavaleiro", "maren3", "carruagem", "clara", "cartas", "fiscal", "jorge", "diario", "ambar", "caderno", "maestro", "p32", "rita", "cancao", "timoneiro", "capitao", "lacre", "almas", "fiado", "escriba", "catalogo", "diario8", "fita", "passageiros", "coracao", "desafio"], "renome": "Coisa que não devia existir", "tempo": 31403.7833329605, "dif": "desafio"};
// ---------- colar um código: herança (RCB-H1.) ou backup de save da T1 (RCB1.) ----------
const T1_PAI = { ferro: 'caixote', arcano: 'caixote', fortaleza: 'ferro', espinho: 'ferro', grimorio: 'arcano', estelar: 'arcano', bastiao: 'fortaleza', abismo: 'fortaleza', ferrao: 'espinho', carniceiro: 'espinho', biblioteca: 'grimorio', proibido: 'grimorio', eclipse: 'estelar', constelacao: 'estelar' };
function b64json(b) { return JSON.parse(decodeURIComponent(escape(atob(b)))); }
function herancaDeCodigo(code) {
  code = (code || '').trim().replace(/\s+/g, '');
  try {
    if (code.startsWith('RCB-H1.')) { const [, body] = code.split('.'); const H = b64json(body); return H && H.name ? H : null; }
    if (code.startsWith('RCB1.')) {
      const d = b64json(code.slice(5)), f = d.flags || {};
      // a linha: do 4º grau (ou da forma atual) para trás, e o 5º grau no fim
      const tip = f.prev4 || d.species, line = [tip]; while (T1_PAI[line[0]]) line.unshift(T1_PAI[line[0]]);
      if (f.grau5 && !line.includes(f.grau5)) line.push(f.grau5);
      const feitos = Object.keys(f).filter(k => /Done$/.test(k) && f[k] === true);
      const sc = feitos.length + ['knightDone', 'fiscalDone', 'capitaoDone'].filter(k => f[k]).length * 3 + Math.floor((d.lv || 1) / 4) + (d.diff !== 'historia' ? 4 : 0);
      return { v: 1, name: d.name, line, grau5: f.grau5 || null, face: { body: f.prev4 || null, aura: f.grau5 || null },
        lume: { cancao: f.ch6Gift === 'cancao', fone: !!f.lumeFone, coracao: f.lumeHeart || 0 },
        esc: { ofelia: !!f.ofeliaRemembers, maren: !!f.marenSpared, jorge: f.jorgeFate || null, tiago: !!f.tiagoTaken, rita: !!f.ritaPromise, ritaNota: f.dateScore || 0, marlene: f.marleneFate || null, ch6: f.ch6Gift || null, coracao: f.finalChoice || null, almas: f.saved7 || [] },
        feats: feitos, renome: sc >= 38 ? 'Coisa que não devia existir' : sc >= 28 ? 'Lenda de Velhágua' : sc >= 18 ? 'Ameaça local' : 'Curiosidade da masmorra',
        tempo: d.time || 0, dif: d.diff || 'desafio', deSave: true };
    }
  } catch (e) { }
  return null;
}
function aplicarHeranca(H) {
  G.her = H; G.name = H.name || G.name;
  const f = formaFinal(H); G.species = f && IMG.chest[f] ? f : 'arca';
  PTC.me = null;
  try { localStorage.setItem('renasci_heranca', JSON.stringify(H)); } catch (e) { }
}
// caixa de texto grande para colar o código (sem filtrar letras, ao contrário do campo de nome)
function codeInput() {
  return new Promise(res => {
    OVB.innerHTML = `<h2>Código da Temporada 1</h2><p>Serve o código de herança da tela final (RCB-H1...) ou o código de backup do save (RCB1...).</p><textarea id="ci" placeholder="Cole o código aqui"></textarea><div class="row"><button class="ob" id="cx">Cancelar</button><button class="ob pri" id="cok">Carregar</button></div>`;
    OV.hidden = false; const ta = OVB.querySelector('#ci'); setTimeout(() => ta.focus(), 50);
    const done = v => { OV.hidden = true; for (const k in KEYS) KEYS[k] = false; res(v); };
    OVB.querySelector('#cok').onclick = () => done(ta.value); OVB.querySelector('#cx').onclick = () => done('');
  });
}
async function colarHeranca() {
  const c = await codeInput();
  const H = herancaDeCodigo(c);
  if (!H) { await say('* Esse código não parece ser da Temporada 1. Confira se copiou tudo, do começo ao fim.'); return false; }
  aplicarHeranca(H);
  await say(`* Herança carregada: ${H.name}, ${HARTE.species[G.species] ? HARTE.species[G.species].name : G.species}. Renome: ${H.renome}.`);
  return true;
}

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
    id: 'bau', name: G.name, short: G.name.slice(0, 8), port: 'me', col: '#f0c040', el: 'mordida', lane: 2, row: 'front', h: 26,
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
    runas: ['acalanto', 'velaprot', 'ofuscar'], magNm: 'Cantigas', magIcon: 'luz', magDesc: 'Canções de apoio: curam e protegem um aliado. PM.',
    techs: ['cancao', 'velaguia'], superNm: 'Lustre de Mil Velas', superDesc: 'Luz em todos os inimigos e cura o grupo.', superTgt: 'all',
    frame: sideFrame('lumeh'), attack: lumeAtk, super: superLume
  };
  const rita = {
    id: 'rita', name: 'Rita', port: 'rita', col: '#e86050', el: 'corte', lane: 1, row: 'front', h: 50,
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
  // cantigas da Lume (apoio de um aliado só, com PM)
  acalanto: { nm: 'Acalanto', mp: 8, w: 'leve', tgt: 'ally', d: 'Cura 35% da vida de um aliado e tira queimadura e frio. Leve.', run: async (m, t) => {
    sfx('heal'); jingle('G5:2 E5:2 C6:4', 200); const [x, y] = unitCenter(t);
    await tw(26, (p, k) => { for (let i = 0; i < 3; i++) txt('♪', x - 8 + i * 8 + Math.sin(k / 5 + i) * 2, y - 6 - p * 24 - i * 4, { col: i % 2 ? '#ffd060' : '#fff0a0', alpha: 1 - p }); fxRing(x, y, 6 + p * 10, '#ffd060', 1 - p); });
    healUnit(t, Math.round(t.mhp * 0.35 * (m.eqFx && m.eqFx.has('fone') ? 1.15 : 1))); t.st.queimado = 0; t.st.frio = 0;
  } },
  velaprot: { nm: 'Vela Protetora', mp: 6, w: 'leve', tgt: 'ally', d: 'Uma velinha acesa ao lado do aliado: metade do dano até a vez dele e cura um pouco por 3 vezes. Leve.', run: async (m, t) => {
    sfx('buff'); const [x, y] = unitCenter(t);
    await tw(22, p => { bx.fillStyle = '#f2ecdc'; bx.fillRect(Math.round(x + 14), Math.round(y + 4 - p * 4), 2, 6); bx.fillStyle = p > 0.5 ? '#ffd060' : '#ff9a30'; bx.fillRect(Math.round(x + 14), Math.round(y + 1 - p * 4), 2, 3); fxRing(x, y, 18 - p * 6, '#ffd060', p); });
    t.def0 = true; t.st.vela = m.eqFx && m.eqFx.has('vela5') ? 5 : 3; callout('Vela acesa para ' + t.name, '#ffd060', 50);
  } },
  ofuscar: { nm: 'Ofuscar', mp: 10, tgt: 'enemy', d: 'Um clarão nos olhos de um inimigo: luz e ele perde parte da vez (empurrado na linha do tempo).', run: async (m, t) => {
    sfx('rune'); await projectile(m, t, '#ffffff', 12, { r: 3 }); flashW(3);
    const [x, y] = unitCenter(t); burst(x, y, 18, ['#ffffff', '#fff0a0']);
    hitFoe(m, t, 0.6, { el: 'luz', mag: true }); t.ct = Math.max(0, t.ct - 35); popNum(x, y - 22, 'OFUSCADO', '#fff0a0');
  } },
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
    hitFoe(m, t, 1.4, { el: 'corte', crit: ok, brk: m.eqFx && m.eqFx.has('estocada3') ? 3 : 2 }); if (ok) BT.stats.crit++;
    await dashBack(m, 12);
  } },
  provocar: { nm: 'Provocar', cost: 10, tgt: 'self', w: 'leve', d: 'Os inimigos miram a Rita nas próximas duas vezes, e ela se defende. Leve.', run: async (m) => {
    sfx('select'); BT.taunt = { m, n: m.eqFx && m.eqFx.has('provoca3') ? 3 : 2 }; m.def0 = true;
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
      if (!G.flags.tutSuper) { G.flags.tutSuper = true; hint('Tensão cheia? O SUPER aparece na lista de comandos. Duplas: um aliado com a barra de vez pela metade + 50 de Tensão.', 400); }
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
// o 31 em escala real (3,2 m de altura = ~92 px; 12 m de comprimento, aparece só a frente, saindo da borda)
let BUS_C = null;
function busArt() {
  if (BUS_C) return BUS_C;
  const Wd = 200, Hd = 100, P = new Pix(Wd, Hd);
  const cream = ramp('#d8cc98'), blue = ramp('#3a6ab8'), glass = ['#101c34', '#1c3058', '#2a4a7a', '#4a70a0', '#8ab0d0'], rub = ramp('#2a2a34'), steel = ramp('#8a8a9a');
  const top = 8, bot = 86, front = Wd - 6;
  // carroceria: frente arredondada à direita, luz vindo de cima
  P.poly([[0, top + 4], [front - 10, top], [front - 2, top + 6], [front, top + 18], [front, bot], [0, bot]], (x, y) => P.tone(cream, 0.78 - (y - top) / 160 + (x > front - 12 ? -0.12 : 0), x, y));
  // teto com respiros e uma camada de musgo da masmorra
  P.rect(0, top, front - 10, 3, cream[3]);
  for (const vx of [24, 70, 116]) { P.rect(vx, top - 4, 18, 4, cream[1]); P.rect(vx + 1, top - 4, 16, 1, cream[3]); }
  for (let i = 0; i < 40; i++) { const x = (i * 37) % (front - 20), w = 2 + (i % 4); P.rect(x, top - 1 + (i % 2), w, 2, i % 3 ? '#4a7a3a' : '#2e5a2a'); }
  // faixa azul da empresa
  P.rect(0, 58, front, 6, blue[2]); P.rect(0, 58, front, 1, blue[3]); P.rect(0, 63, front, 1, blue[0]);
  // janelas laterais com reflexo em diagonal
  for (let i = 0; i < 6; i++) {
    const wx = 4 + i * 24, wy = 20;
    P.rect(wx - 1, wy - 1, 21, 26, cream[0]);
    P.poly([[wx, wy], [wx + 19, wy], [wx + 19, wy + 24], [wx, wy + 24]], (x, y) => P.tone(glass, 0.3 + (y - wy) / 60, x, y));
    for (let d = 0; d < 4; d++) P.line(wx + 4 + d + i * 2, wy + 23, wx + 14 + d + i * 2, wy + 1, glass[4 - (d > 1 ? 1 : 0)]);
    P.rect(wx + 9, wy, 1, 24, cream[1]);
  }
  // porta dianteira dobrável
  const dx = 152; P.rect(dx - 1, 16, 22, 70, cream[0]);
  for (const k of [0, 10]) { P.poly([[dx + k, 17], [dx + k + 9, 17], [dx + k + 9, 84], [dx + k, 84]], (x, y) => P.tone(glass, 0.35 + (y - 17) / 140, x, y)); P.rect(dx + k + 1, 50, 7, 1, cream[2]); }
  P.rect(dx, 84, 20, 2, rub[1]);                                                                                     // degrau
  // para-brisa (frente) e letreiro aceso
  P.poly([[front - 13, 18], [front - 1, 22], [front - 1, 54], [front - 13, 54]], (x, y) => P.tone(glass, 0.5 + (x - front + 13) / 30, x, y));
  P.rect(front - 14, 9, 14, 8, '#1a1008'); P.rect(front - 13, 10, 12, 6, '#ffb040'); P.rect(front - 12, 11, 4, 4, '#ffe0a0'); P.rect(front - 6, 11, 4, 4, '#ffe0a0');
  P.rect(130, 9, 20, 8, '#1a1008'); P.rect(131, 10, 18, 6, '#ff9a30');                                              // letreiro lateral
  // farol, pisca e para-choque
  P.ball(front - 4, 70, 3, 3, ['#c8a040', '#f0d070', '#fff0c0', '#ffffff', '#ffffff']); P.rect(front - 3, 76, 3, 2, '#ff9a30');
  P.rect(0, 86, front, 3, rub[1]); P.rect(front - 18, 84, 18, 5, rub[2]); P.rect(front - 18, 84, 18, 1, rub[3]);
  // retrovisor
  P.line(front, 22, front + 4, 18, rub[1]); P.rect(front + 3, 18, 3, 8, rub[2]);
  // ferrugem e um amassado (lembrança da curva)
  for (const [x, y] of [[40, 80], [44, 82], [96, 77], [100, 79], [128, 84]]) P.rect(x, y, 3, 2, '#9a4a2a');
  P.line(60, 66, 74, 72, cream[0]); P.line(60, 67, 74, 73, cream[3]);
  // rodas (~0,9 m = 26 px), escondidas pela metade na caixa de roda
  for (const wx of [34, 166]) { P.ball(wx, 87, 13, 13, rub, { clip: (x, y) => y < 99 }); P.ball(wx, 87, 6, 6, steel); P.ball(wx, 87, 2, 2, rub); P.rect(wx - 15, 72, 30, 2, cream[0]); }
  P.outline();
  return BUS_C = P.canvas();
}
// o sprite de lado da Rita já olha para a direita; os outros olham para a esquerda
function standF(k) { return t => { const S = IMG.spf[k] && IMG.spf[k].s; if (!S) return null; const f = S[Math.floor(t / 30) % S.length]; return k === 'rita' ? f : flipC(f); }; }
function chestF() { return t => { const C = IMG.chest[G.species]; return C ? ((t % 160) < 6 ? C.closed : C.three) : null; }; }

// ---------- a história do capítulo ----------
async function abertura() {
  CENA.bg = ponteBG; CENA.actors = [];
  // o ônibus tem 200 px de largura: a traseira fica fora da tela
  const bus = { x: 30, y: 152, fr: () => busArt() }; CENA.actors.push(bus);
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
  CENA.actors.push({ x: 196, y: 156, fr: standF('rita') }, { x: 168, y: 150, fr: chestF() }, { x: 150, y: 146, fr: standF('lumeh') });
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
}

// ---------- fluxo ----------
async function lutaCorvos() {
  const itens0 = { ...G.items };
  while (true) {
    G.items = { ...itens0 };
    const res = await battle2({
      party: grupoCap1(), foes: [{ id: 'corvo', x: 158, y: 92 }, { id: 'corvo', x: 206, y: 110 }], music: 'luta2', tension: 0,
      intro: async () => {
        if (!G.flags.tut1) { G.flags.tut1 = true; hint('No topo: quem age AGORA e os próximos. Quando a barrinha de um cartão enche, a vez é dele: o tempo para e os comandos abrem à direita.', 360); }
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
  capitulo2();
}
// dicas que aparecem uma vez, na primeira vez que a situação acontece
function hintOnce() { }
{ const _oc = openCommand; openCommand = function (m) {
  if (m.guarding) { m.guarding.st.guardado = 0; m.guarding = null; }
  if (!G.flags.tutMenu) { G.flags.tutMenu = true; hint('Para cima e para baixo escolhe, A confirma, B volta. No ataque, aperte A quando o anel amarelo fechar no alvo.', 360); }
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

// ---------- instalar como app (atalho na tela do celular) ----------
let INSTALL_EV = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); INSTALL_EV = e; });
const ehApp = () => matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const ehIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
// a opção aparece sempre no site (fora do app instalado); se o Chrome não oferecer a instalação direta, explica o caminho pelo menu
const SITE_T2 = 'andre-brito-py.github.io/isekai_bau/t2/';
const noSite = () => location.hostname === 'andre-brito-py.github.io' || location.hostname === 'localhost';
function podeInstalar() { return !ehApp(); }
// janela com um botão que abre o jogo no site de verdade (onde dá para instalar)
function linkSite() {
  return new Promise(res => {
    OVB.innerHTML = `<h2>Instalar o Baú 2</h2><p>O jogo instalável fica no site. Toque no botão: ele abre no navegador. Lá, aperte A no título e escolha "Instalar no celular".</p><div class="row"><a class="ob pri" id="lk" href="https://${SITE_T2}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Abrir o jogo no site</a></div><p>Endereço: ${SITE_T2}</p><div class="row"><button class="ob" id="lx">Fechar</button></div>`;
    OV.hidden = false;
    const done = () => { OV.hidden = true; for (const k in KEYS) KEYS[k] = false; res(); };
    OVB.querySelector('#lx').onclick = done; OVB.querySelector('#lk').addEventListener('click', () => setTimeout(done, 300));
  });
}
async function instalarApp() {
  // dentro do Claude (artifact) não dá para instalar: o atalho apontaria para a página do Claude, não para o jogo
  if (!noSite()) { await say('* Aqui o jogo está aberto dentro do Claude, e daqui não dá para instalar: o atalho abriria a página do Claude, não o jogo.'); await linkSite(); return; }
  if (INSTALL_EV) { const ev = INSTALL_EV; INSTALL_EV = null; ev.prompt(); try { const r = await ev.userChoice; if (r.outcome === 'accepted') await say('* Pronto! O Baú 2 vai aparecer na tela do celular, ao lado do primeiro.'); } catch (e) { } return; }
  if (ehIOS()) { await say('* No iPhone: abra pelo Safari, toque no botão Compartilhar (o quadrado com a seta) e depois em "Adicionar à Tela de Início".'); return; }
  await say('* No Chrome: toque nos três pontinhos no canto de cima e escolha "Instalar app" ou "Adicionar à tela inicial". Se não aparecer, recarregue a página uma vez e tente de novo.');
}

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
  if (UI.top()) return;
  if (H) txt(`Herança: ${H.name} · ${HARTE.species[G.species] ? HARTE.species[G.species].name : ''}`, 120, 200, { align: 'center', col: '#9be58a' });
  else txt('Nenhuma herança da Temporada 1 neste aparelho', 120, 200, { align: 'center', col: '#8a8099' });
  if (t % 60 < 40) txt('Aperte A', 120, 216, { align: 'center', col: '#ffffff' });
  txt(G.flags && G.flags.cap2Fim ? 'Cap. 2 completo' : 'Cap. 1 e 2', 4, 228, { col: '#5a5070' }); txt('t2-0.20', 236, 228, { align: 'right', col: '#5a5070' });
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
  while (true) {
    // no site (e no app da T1 instalado) dá para voltar à Temporada 1; a T2 abre pelo menu da T1, sem app separado
    const ops = ['Jogar', 'Colar código da Temporada 1'], inst = noSite();
    if (inst) ops.push('Voltar à Temporada 1');
    const c = await choose(`* Herança: ${G.her ? G.her.name + ', ' + (HARTE.species[G.species] ? HARTE.species[G.species].name : '') : 'nenhuma'}.`, ops);
    if (c === 0) break;
    if (c === 1) await colarHeranca();
    if (c === 2) { await fadeOut(24); playMusic(null); location.href = '../'; return; }
  }
  const sv = load2();
  let novo = true;
  if (sv && sv.flags && (sv.flags.cap1Corvos || sv.flags.cap1Boss)) {
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
  if (G.flags.cap1Boss) capitulo2(); else capitulo1();
}

// ---------- laço principal ----------
const WBIG = mk(360, 360), WBX = WBIG.getContext('2d');
const INNER = mk(240, 240), INNER_X = INNER.getContext('2d'), MAIN_BX = bx, FILTRO = typeof MAIN_BX.filter === 'string';
INNER_X.imageSmoothingEnabled = false;
function tick() {
  FRAME++;
  JP = { ...JPQ }; for (const k in JPQ) delete JPQ[k];
  for (let i = WAITS.length - 1; i >= 0; i--) if (--WAITS[i].n <= 0) { const w = WAITS.splice(i, 1)[0]; w.r(); }
  if (V.tw) { const t = V.tw; t.t++; V.fade = t.from + (t.to - t.from) * Math.min(1, t.t / t.n); if (t.t >= t.n) { V.tw = null; t.r(); } }
  if (V.scene === 'battle2' || V.scene === 'cena' || V.scene === 'world') G.time += 1 / 60;
  const top = UI.top();
  if (top) top.update();
  const WF = W, OX = Math.floor((WF - 240) / 2);
  if (V.scene === 'world' || V.scene === 'battle2') {
    // mapa e batalha usam a tela larga inteira; janelas e diálogos ficam no meio
    MUNDO_BIG = false;
    if (V.scene === 'world' && ZOOM_MUNDO > 1) {
      // câmera de longe: o mapa vai para um quadro maior; o painel (HUD) e as janelas ficam no quadro normal, por cima
      const Wb = W, Hb = H; W = Math.round(Wb * ZOOM_MUNDO); H = Math.round(Hb * ZOOM_MUNDO);
      if (WBIG.width !== W || WBIG.height !== H) { WBIG.width = W; WBIG.height = H; }
      WBX.imageSmoothingEnabled = false; bx = WBX; TXZ = ZOOM_MUNDO; HUD_ADIA = true;
      try { updateWorld2(); drawWorld2(); } finally { HUD_ADIA = false; bx = MAIN_BX; W = Wb; H = Hb; TXZ = 1; }
      bx.clearRect(0, 0, W, H); MUNDO_BIG = true;
      if (HUD_PEND) { const m = HUD_PEND; HUD_PEND = null; hudMundo(m); }
    }
    else if (V.scene === 'world') { updateWorld2(); drawWorld2(); } else { updateBattle2(); drawBattle2(); }
    bx.save(); bx.translate(OX, 0); TXO.x = OX; for (const w of UI.stack) w.draw(); bx.restore(); TXO.x = 0;
  } else {
    // batalha, cenas e título são quadros de 240x240: desenhados no centro; nas laterais, o próprio quadro desfocado
    if (OX > 0) { bx = INNER_X; W = 240; TXO.x = OX; }
    if (V.scene === 'battle2') { updateBattle2(); drawBattle2(); }
    else if (V.scene === 'cena') drawCena();
    else if (V.scene === 'title') drawTitle2();
    else if (V.scene === 'fim1') drawFim1();
    else if (V.scene === 'card') drawCard();
    else { bx.fillStyle = '#000'; bx.fillRect(0, 0, W, H); }
    for (const w of UI.stack) w.draw();
    if (OX > 0) {
      bx = MAIN_BX; W = WF; TXO.x = 0;
      fundoRunas(0, W);
      bx.fillStyle = 'rgba(0,0,0,0.45)'; bx.fillRect(OX - 4, 0, 4, H); bx.fillRect(OX + 240, 0, 4, H);
      bx.drawImage(INNER, OX, 0);
      bx.fillStyle = UIC.line; bx.globalAlpha = 0.3; bx.fillRect(OX - 1, 0, 1, H); bx.fillRect(OX + 240, 0, 1, H); bx.globalAlpha = 1;
    }
  }
  if (V.fade > 0) { bx.fillStyle = `rgba(0,0,0,${V.fade})`; bx.fillRect(0, 0, W, H); }
  let sx = 0, sy = 0; if (V.shake > 0) { V.shake--; sx = Math.round(rand(-2, 2)); sy = Math.round(rand(-2, 2)); }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cvs.width, cvs.height);
  if (MUNDO_BIG && V.scene === 'world') ctx.drawImage(WBIG, 0, 0, WBIG.width, WBIG.height, Math.round(sx * S), Math.round(sy * S), cvs.width, cvs.height);
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
  const H = lerHeranca() || HER_ANDRE;
  aplicarHeranca(H);
  requestAnimationFrame(frame);
  titleFlow2();
}
