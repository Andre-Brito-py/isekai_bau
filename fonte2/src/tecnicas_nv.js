// ================= O QUE SE APRENDE SUBINDO DE NÍVEL =================
// (pedido do usuário: "subir de nível deve ser bem importante, como qualquer bom RPG".)
// Cada membro aprende uma TÉCNICA nova nos níveis 5, 9, 13, 17, 22 e 27, e ganha PASSIVAS nos níveis 10, 20 e 30.
// Cada técnica tem a sua animação (regra da bíblia). Aprendeu = aparece na tela de vitória e numa fala depois da luta.
const TEC_NV = {
  bau: [[5, 'mordidaGulosa'], [9, 'cuspeTralha'], [13, 'tampaRefletora'], [17, 'mastigar'], [22, 'inventario'], [27, 'bocaVao']],
  lume: [[5, 'acordar'], [9, 'lanternaAmpla'], [13, 'faiscaTripla'], [17, 'ninar'], [22, 'coroVelas'], [27, 'aurora']],
  rita: [[5, 'investida'], [9, 'escudoErguido'], [13, 'lancaDupla'], [17, 'contraGolpe'], [22, 'grito'], [27, 'golpePedagio']]
};
const PASS_NV = {
  10: { bau: { nm: 'Tampa Grossa', mod: { def: 3, mdef: 2 }, d: '+3 DEF e +2 DEF mágica.' }, lume: { nm: 'Luz Própria', mod: { mag: 3, mmp: 8 }, d: '+3 MAG e +8 PM.' }, rita: { nm: 'Braço de Escudeira', mod: { atk: 3, def: 1 }, d: '+3 ATQ e +1 DEF.' } },
  20: { bau: { nm: 'Fôlego de Batalha', tens: 5, d: 'O grupo começa as lutas com +5 de Tensão.' }, lume: { nm: 'Fôlego de Batalha', tens: 5, d: 'O grupo começa as lutas com +5 de Tensão.' }, rita: { nm: 'Fôlego de Batalha', tens: 5, d: 'O grupo começa as lutas com +5 de Tensão.' } },
  30: { bau: { nm: 'Veterano', pct: 0.1, d: '+10% de vida máxima.' }, lume: { nm: 'Veterana', pct: 0.1, d: '+10% de vida máxima.' }, rita: { nm: 'Veterana', pct: 0.1, d: '+10% de vida máxima.' } }
};
function tecsDoNivel(id, lv) { return (TEC_NV[id] || []).filter(([n]) => lv >= n).map(([, k]) => k); }
function passDoNivel(id, lv) { return Object.entries(PASS_NV).filter(([n]) => lv >= +n).map(([n, P]) => ({ n: +n, ...P[id] })).filter(p => p.nm); }

// ---------- aplica no grupo ----------
{ const _gaT = grupoAtual; grupoAtual = function () {
  const g = _gaT();
  for (const m of g) {
    const lv = nvDe(m.id).lv;
    for (const k of tecsDoNivel(m.id, lv)) if (TECH2[k] && !(m.techs || []).includes(k)) m.techs = [...(m.techs || []), k];
    for (const p of passDoNivel(m.id, lv)) {
      if (p.mod) for (const [a, v] of Object.entries(p.mod)) m[a] = (m[a] || 0) + v;
      if (p.pct) { const add = Math.round(m.mhp * p.pct); m.mhp += add; }
    }
    if (m.hp > m.mhp) m.hp = m.mhp;
  }
  return g;
}; }
// Fôlego de Batalha: Tensão inicial
{ const _lmT = lutaMapa; lutaMapa = async function (group, o = {}) {
  const bonus = partyKeys().reduce((a, id) => a + (nvDe(id).lv >= 20 ? 5 : 0), 0);
  const r = await _lmT(group, bonus ? { ...o, tension: (o.tension || 0) + bonus } : o);
  if (r === 'win') await anunciarAprendidos();
  return r;
}; }
// anúncio do que foi aprendido (uma vez por coisa; saves antigos recebem tudo do nível que já têm)
async function anunciarAprendidos() {
  G.aprendeu = G.aprendeu || {};
  for (const id of partyKeys()) {
    const lv = nvDe(id).lv, nome = id === 'bau' ? G.name : id === 'lume' ? 'Lume' : 'Rita';
    for (const k of tecsDoNivel(id, lv)) {
      const key = id + ':' + k; if (G.aprendeu[key] || !TECH2[k]) continue; G.aprendeu[key] = true;
      jingle && jingle('C6:2 E6:2 G6:2 C7:6', 230);
      await say(`* {y}${nome} aprendeu ${TECH2[k].nm}!{/} (Técnica, ${TECH2[k].cost} de Tensão)`);
      await say('* ' + TECH2[k].d);
    }
    for (const p of passDoNivel(id, lv)) {
      const key = id + ':p' + p.n; if (G.aprendeu[key]) continue; G.aprendeu[key] = true;
      if (p.tens && partyKeys().some(o => o !== id && G.aprendeu[o + ':p' + p.n])) continue;   // a mesma passiva de grupo, uma vez só
      await say(`* {c}${nome}: ${p.nm}{/} — ${p.d}`);
    }
  }
}
// marca na tela de vitória quem aprendeu algo
{ const _dx = darXP; darXP = function (party, foes) {
  const R = _dx(party, foes);
  for (const o of R.out) { const a = tecsDoNivel(o.m.id, o.antes.lv), b = tecsDoNivel(o.m.id, o.depois.lv); o.novas = b.filter(k => !a.includes(k)).map(k => TECH2[k] && TECH2[k].nm).filter(Boolean); }
  return R;
}; }

// ---------- reação: Tampa Refletora e Contragolpe; Grito de Guerra ----------
{ const _cdT = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  if (t && t.side === 'p' && t.st && t.st.reflete > 0) pow *= 0.5;
  if (a && a.side === 'p' && a.st && a.st.grito > 0) pow *= 1.2;
  return _cdT(a, t, pow, o);
}; }
{ const _fsT = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  const r = await _fsT(e, t, pow, o);
  if (!t || t.hp <= 0 || !e || e.hp <= 0) return r;
  if (t.st.reflete > 0) {
    t.st.reflete = 0; const [x, y] = unitCenter(t), [ex, ey] = unitCenter(e);
    callout('Tampa Refletora!', '#ffe8a0', 40); sfx('guard');
    await tw(12, p => { bx.globalAlpha = 1 - p; bx.strokeStyle = '#fff0c0'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x, y); bx.lineTo(x + (ex - x) * ease.out(p), y + (ey - y) * ease.out(p)); bx.stroke(); bx.globalAlpha = 1; fxRing(x, y, 6 + p * 12, '#ffe8a0', 1 - p); });
    hitFoe(t, e, 0.9, { el: 'mordida' });
  } else if (t.st.contra > 0 && !o.noCounter) {
    t.st.contra--; const [ex, ey] = unitCenter(e);
    callout('Contragolpe!', '#ff8a70', 40);
    await tw(8, p => { t.ox = Math.sin(p * Math.PI) * 18; }); slashFx(ex, ey, '#ffffff', 1, true); sfx('hit');
    hitFoe(t, e, 0.7, { el: 'corte' }); t.ox = 0;
  }
  return r;
}; }

// ---------- as técnicas ----------
const pertoDe = (m, t, gap = 14) => [unitCenter(t)[0] - unitFrame(t).width / 2 - gap - m.x, t.fly ? 0 : t.y - m.y];
Object.assign(TECH2, {
  // ===== BAÚ =====
  mordidaGulosa: { nm: 'Mordida Gulosa', cost: 20, tgt: 'enemy', d: 'Uma mordida que quebra 1 de escudo e devolve ao baú um terço do dano como vida.', run: async (m, t) => {
    await dash(m, ...pertoDe(m, t)); m.pose = 'front'; const ok = await timedPrompt(t, 20); const [x, y] = unitCenter(t);
    m.pose = 'closed'; sfx('bite'); hitstop(6); bshake(6, 2); burst(x, y, 14, ['#ffffff', '#f0c040', '#9be58a']);
    const d = hitFoe(m, t, 1.15, { el: 'mordida', crit: ok, brk: 1 }); if (ok) BT.stats.crit++;
    const [bx0, by0] = unitCenter(m);
    await tw(16, p => { for (let i = 0; i < 2; i++) part({ x: x + (bx0 - x) * p, y: y + (by0 - y) * p - Math.sin(p * Math.PI) * 14, vy: -0.2, life: 10, col: '#9be58a' }); });
    if (d > 0) healUnit(m, Math.round(d / 3)); m.pose = null; await dashBack(m, 12);
  } },
  cuspeTralha: { nm: 'Cuspe de Tralha', cost: 25, tgt: 'all', d: 'Cospe o que tem guardado (botão, meia, colher) em todos os inimigos. Pode deixar tonto.', run: async (m) => {
    m.pose = 'front'; sfx('rune'); const [x0, y0] = unitCenter(m);
    await tw(10, p => { m.sy = 1 - p * 0.15; m.sx = 1 + p * 0.1; });
    const TRALHA = [['#e8e0d0', 3, 3], ['#8a5a3a', 4, 2], ['#c8c8d8', 5, 1], ['#e86050', 3, 2], ['#4a6ab8', 2, 2]];
    for (const t of alive(BT.foes)) {
      const [tx, ty] = unitCenter(t), it = pickOne(TRALHA);
      sfx('move');
      await tw(12, p => { const q = ease.io(p); bx.fillStyle = it[0]; bx.save(); bx.translate(x0 + (tx - x0) * q, y0 - 6 + (ty - y0 + 6) * q - Math.sin(q * Math.PI) * 26); bx.rotate(p * 9); bx.fillRect(-it[1] / 2, -it[2] / 2, it[1], it[2]); bx.restore(); });
      burst(tx, ty, 8, [it[0], '#ffffff']); hitFoe(m, t, 0.55, { el: 'mordida' }); if (Math.random() < 0.35 && t.hp > 0) { t.st.tonto = 1; t.ct = Math.max(0, t.ct - 25); popNum(tx, ty - 20, 'TONTO', '#d0a8ff'); }
    }
    m.sx = 1; m.sy = 1; m.pose = null;
  } },
  tampaRefletora: { nm: 'Tampa Refletora', cost: 25, tgt: 'self', w: 'leve', d: 'A tampa vira espelho: o próximo golpe no baú (até 2 vezes) faz metade do dano e volta como mordida de luz. Leve.', run: async (m) => {
    sfx('buff'); const [x, y] = unitCenter(m);
    await tw(26, (p, k) => { bx.globalAlpha = 0.7 * (1 - p * 0.5); bx.fillStyle = '#fff0c0'; bx.fillRect(Math.round(x - 12 + p * 24), y - 16, 2, 22); bx.globalAlpha = 1; fxRing(x, y, 10 + Math.sin(k * 0.4) * 2, '#ffe8a0', 1 - p * 0.3); });
    m.st.reflete = 2; callout('A tampa brilha como espelho', '#ffe8a0', 50);
  } },
  mastigar: { nm: 'Mastigar Escudo', cost: 35, tgt: 'enemy', d: 'Três mordidas seguidas, cada uma quebra 1 de escudo.', run: async (m, t) => {
    await dash(m, ...pertoDe(m, t, 10)); const [x, y] = unitCenter(t);
    for (let i = 0; i < 3; i++) {
      m.pose = 'front'; await tw(5, p => { m.oy -= 1; }); m.pose = 'closed'; sfx('bite'); hitstop(3); bshake(5, 2);
      popNum(x + (i - 1) * 10, y - 26 - i * 4, ['NHAC', 'CROC', 'NHAC'][i], '#ffe080'); burst(x, y, 8, ['#ffffff', '#8fe3ff']);
      hitFoe(m, t, 0.55, { el: 'mordida', brk: 1 }); await tw(5, p => { m.oy += 1; }); if (t.hp <= 0) break;
    }
    m.pose = null; await dashBack(m, 12);
  } },
  inventario: { nm: 'Inventário', cost: 30, tgt: 'self', w: 'leve', d: 'O baú procura alguma coisa útil lá dentro. Pode sair um frasco, tinta, uma pena... ou um pouco de Tensão. Leve.', run: async (m) => {
    m.pose = 'front'; sfx('item'); const [x, y] = unitCenter(m);
    await tw(28, (p, k) => { if (k % 3 === 0) part({ x: x + rand(-6, 6), y: y - 10, vx: rand(-1.2, 1.2), vy: -rand(1.5, 2.5), g: 0.12, life: 22, col: pickOne(['#e8e0d0', '#8a5a3a', '#4a6ab8', '#ffc040', '#e86050']) }); m.ox = Math.sin(k * 1.3) * 1.5; });
    m.ox = 0; m.pose = null;
    const caido = BT.party.find(u => u.hp <= 0), r = Math.random();
    if (caido && r < 0.35) { caido.hp = Math.round(caido.mhp * 0.25); caido.ct = 30; const [cx, cy] = unitCenter(caido); burst(cx, cy, 16, ['#ffd060', '#ffffff']); callout('Uma pena dourada! ' + caido.name + ' levanta!', '#ffd060', 60); return; }
    if (r < 0.55) { const t = alive(BT.party).sort((a, b) => a.hp / a.mhp - b.hp / b.mhp)[0]; callout('Um frasco esquecido!', '#9be58a', 50); healUnit(t, Math.round(t.mhp * 0.3)); return; }
    if (r < 0.85) { for (const u of alive(BT.party)) if (u.mmp) { u.mp = Math.min(u.mmp, u.mp + 12); popNum(...unitCenter(u), '+12 PM', '#8fe3ff'); } callout('Tinta azul! PM para o grupo', '#8fe3ff', 50); return; }
    BT.tension = Math.min(100, BT.tension + 25); callout('Uma meia. Só uma meia. Mas dá ânimo: +25 Tensão', '#ffa94d', 60);
  } },
  bocaVao: { nm: 'Boca do Vão', cost: 55, tgt: 'all', d: 'Abre o Vão no meio dos inimigos: puxa todos, bate forte e atrasa a vez de cada um.', run: async (m) => {
    const fs = alive(BT.foes), cx = fs.reduce((a, f) => a + unitCenter(f)[0], 0) / fs.length, cy = fs.reduce((a, f) => a + unitCenter(f)[1], 0) / fs.length;
    m.pose = 'front'; sfx('rumble'); bshake(10, 2);
    await tw(40, (p, k) => { vortexBau(cx, cy, 6 + ease.out(Math.min(1, p * 1.5)) * 26, Math.min(1, p * 3), k * 0.3); for (const f of fs) { f.ox = (cx - unitCenter(f)[0]) * 0.15 * Math.sin(p * Math.PI); } if (k % 2 === 0) part({ x: cx + rand(-40, 40), y: cy + rand(-30, 30), vx: 0, vy: 0, life: 10, col: '#c8a0ff' }); });
    sfx('crit'); flashW(4); hitstop(8); bshake(16, 4);
    for (const f of fs) { f.ox = 0; hitFoe(m, f, 1.3, { el: 'mordida', brk: 1, mag: true }); f.ct = Math.max(0, f.ct - 30); }
    m.pose = null;
  } },
  // ===== LUME =====
  acordar: { nm: 'Cantiga de Acordar', cost: 15, tgt: 'ally', w: 'leve', d: 'Acorda um aliado: tira tontura, frio, queimadura e molhado, e a vez dele chega mais rápido. Leve.', run: async (m, t) => {
    sfx('heal'); jingle && jingle('C6:1 E6:1 G6:1 C7:3', 260); const [x, y] = unitCenter(t);
    await tw(26, (p, k) => { for (let i = 0; i < 3; i++) { const a = k * 0.2 + i * 2.1; txt('♪', x + Math.cos(a) * 14, y - 6 + Math.sin(a) * 8 - p * 6, { col: i % 2 ? '#ffd060' : '#fff0a0', alpha: 1 - p * 0.6 }); } });
    for (const s of ['tonto', 'frio', 'queimado', 'molhado']) t.st[s] = 0; t.ct = Math.min(99, t.ct + 40); callout(t.name + ' acordou!', '#fff0a0', 50);
  } },
  lanternaAmpla: { nm: 'Lanterna Ampla', cost: 20, tgt: 'all', d: 'Uma onda de luz em todos os inimigos: dano de luz e mostra as fraquezas de todos.', run: async (m) => {
    sfx('rune'); const [x0, y0] = unitCenter(m);
    await tw(28, p => { const r = 10 + ease.out(p) * 150; bx.globalAlpha = 0.35 * (1 - p); bx.fillStyle = '#ffe080'; bx.beginPath(); bx.arc(x0, y0, r, -0.6, 0.6); bx.lineTo(x0, y0); bx.fill(); bx.globalAlpha = 1; fxRing(x0, y0, r, '#fff0a0', 1 - p); });
    for (const t of alive(BT.foes)) { for (const k of ['fogo', 'gelo', 'luz', 'corte', 'mordida']) t.known[k] = t.weak.includes(k) ? 'weak' : 'ok'; hitFoe(m, t, 0.45, { el: 'luz', mag: true }); }
    callout('Tudo à mostra!', '#ffd060', 50);
  } },
  faiscaTripla: { nm: 'Faísca Tripla', cost: 25, tgt: 'enemy', d: 'Três faíscas de luz seguidas num inimigo.', run: async (m, t) => {
    for (let i = 0; i < 3; i++) { sfx('rune'); await projectile(m, t, i % 2 ? '#fff0a0' : '#ffd060', 10, { r: 2 + i * 0.5 }); const [x, y] = unitCenter(t); burst(x, y, 8, ['#ffd060', '#ffffff']); hitFoe(m, t, 0.62, { el: 'luz', mag: true }); if (t.hp <= 0) break; }
  } },
  ninar: { nm: 'Canção de Ninar', cost: 30, tgt: 'all', d: 'Os inimigos cochilam: a vez de cada um atrasa muito (chefes resistem um pouco).', run: async (m) => {
    sfx('heal'); jingle && jingle('G5:4 E5:4 C5:8', 160);
    await tw(40, (p, k) => { for (const f of alive(BT.foes)) { const [x, y] = unitCenter(f); txt(k % 20 < 10 ? 'z' : 'Z', x + 8 + Math.sin(k * 0.15) * 4, y - 20 - p * 14, { col: '#c8d8ff', alpha: 1 - p * 0.5 }); } });
    for (const f of alive(BT.foes)) { const [x, y] = unitCenter(f); if (f.boss) { f.ct = Math.max(0, f.ct - 20); popNum(x, y - 24, 'bocejo', '#c8d8ff'); } else if (Math.random() < 0.7) { f.ct = Math.max(0, f.ct - 60); popNum(x, y - 24, 'zZz', '#c8d8ff'); } else popNum(x, y - 24, 'resistiu', '#8a8099'); }
  } },
  coroVelas: { nm: 'Coro de Velas', cost: 40, tgt: 'self', d: 'Uma vela protetora para cada aliado: metade do dano e um pouco de cura por 3 vezes.', run: async (m) => {
    sfx('buff'); const al = alive(BT.party);
    await tw(28, p => { for (const t of al) { const [x, y] = unitCenter(t); bx.fillStyle = '#f2ecdc'; bx.fillRect(Math.round(x + 14), Math.round(y + 4 - p * 4), 2, 6); bx.fillStyle = p > 0.5 ? '#ffd060' : '#ff9a30'; bx.fillRect(Math.round(x + 14), Math.round(y + 1 - p * 4), 2, 3); fxRing(x, y, 18 - p * 6, '#ffd060', p); } });
    for (const t of al) { t.def0 = true; t.st.vela = 3; } callout('Uma vela para cada um', '#ffd060', 50);
  } },
  aurora: { nm: 'Aurora', cost: 55, tgt: 'all', d: 'O céu amanhece dentro da luta: luz forte em todos os inimigos e cura 20% do grupo.', run: async (m) => {
    sfx('rune'); const L0 = -(BTV.ox || 0), RW = BTV.w || 240;
    await tw(44, p => { const a = Math.sin(p * Math.PI); const g = bx.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, `rgba(255,154,90,${0.45 * a})`); g.addColorStop(0.5, `rgba(255,224,128,${0.35 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); bx.fillStyle = g; bx.fillRect(L0, 0, RW, 160); for (let i = 0; i < 3; i++) part({ x: L0 + Math.random() * RW, y: 0, vy: 1.4, life: 30, col: '#fff0c0' }); });
    flashW(3); for (const t of alive(BT.foes)) hitFoe(m, t, 1.0, { el: 'luz', mag: true }); for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.2));
  } },
  // ===== RITA =====
  investida: { nm: 'Investida', cost: 20, tgt: 'enemy', d: 'Corre com o escudo na frente: dano de corte e empurra a vez do inimigo para trás.', run: async (m, t) => {
    await dash(m, ...pertoDe(m, t, 8), 9); const [x, y] = unitCenter(t); sfx('hit'); hitstop(6); bshake(8, 3);
    burst(x, y, 14, ['#c8c8d8', '#ffffff']); hitFoe(m, t, 1.2, { el: 'corte' }); t.ct = Math.max(0, t.ct - 30); popNum(x, y - 26, 'EMPURRÃO', '#ffd8a0');
    await tw(8, p => { t.ox = Math.sin(p * Math.PI) * 10; }); t.ox = 0; await dashBack(m, 12);
  } },
  escudoErguido: { nm: 'Escudo Erguido', cost: 15, tgt: 'ally', w: 'leve', d: 'A Rita fica na frente de um aliado: o próximo golpe nele vai no escudo dela (que se defende). Leve.', run: async (m, t) => {
    if (t === m) { callout('Escolha outro aliado', '#ff6b6b', 40); BT.tension += 15; return; }
    sfx('guard'); const [x, y] = unitCenter(t);
    await tw(18, p => { fxRing(x, y, 20 - p * 8, '#c8c8d8', p); bx.fillStyle = '#c8c8d8'; bx.fillRect(Math.round(x + 10), Math.round(y - 12), 3, Math.round(20 * p)); });
    t.st.guardado = 9; t.guardBy = m; m.guarding = t; m.def0 = true; callout('Rita protege ' + t.name, '#c8c8d8', 50);
  } },
  lancaDupla: { nm: 'Lança Atravessada', cost: 30, tgt: 'all', d: 'Uma estocada que atravessa dois inimigos em linha.', run: async (m) => {
    const fs = alive(BT.foes).sort((a, b) => a.x - b.x).slice(0, 2), t = fs[0];
    await dash(m, ...pertoDe(m, t, 18), 10); const [x1, y1] = unitCenter(fs[0]), [x2, y2] = unitCenter(fs[fs.length - 1]);
    sfx('crit'); hitstop(6);
    await tw(10, p => { bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(x1 - 30), Math.round(y1 - 1 + (y2 - y1) * p), Math.round(30 + (x2 - x1 + 20) * ease.out(p)), 2); });
    for (const f of fs) { const [x, y] = unitCenter(f); burst(x, y, 10, ['#ffffff', '#e86050']); hitFoe(m, f, 1.1, { el: 'corte' }); }
    await dashBack(m, 12);
  } },
  contraGolpe: { nm: 'Contragolpe', cost: 25, tgt: 'self', w: 'leve', d: 'Postura de guarda: nas próximas 2 vezes em que a Rita apanhar, ela devolve um golpe de lança. Leve.', run: async (m) => {
    sfx('select'); const [x, y] = unitCenter(m);
    await tw(20, p => { bx.strokeStyle = '#ff8a70'; bx.globalAlpha = 1 - p * 0.5; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x - 10, y + 10 - p * 4); bx.lineTo(x + 14, y - 14 - p * 4); bx.stroke(); bx.globalAlpha = 1; });
    m.st.contra = 2; callout('Rita em guarda', '#ff8a70', 50);
  } },
  grito: { nm: 'Grito de Guerra', cost: 30, tgt: 'self', w: 'leve', d: 'O grupo inteiro bate 20% mais forte por 3 vezes. Leve.', run: async (m) => {
    sfx('crit'); bshake(8, 2); const [x, y] = unitCenter(m);
    await tw(24, p => { fxRing(x, y, 8 + p * 40, '#ff8a70', 1 - p); fxRing(x, y, 4 + p * 28, '#ffd8a0', 1 - p); txt('AVANTE!', x, y - 40 - p * 6, { align: 'center', col: '#ffd8a0', shadow: true, alpha: 1 - p * 0.4 }); });
    for (const u of alive(BT.party)) u.st.grito = 3; callout('O grupo se enche de coragem!', '#ffd8a0', 50);
  } },
  golpePedagio: { nm: 'Golpe do Pedágio', cost: 50, tgt: 'enemy', d: 'Salta alto e desce com a lança do pedágio: dano enorme de corte e quebra 3 de escudo.', run: async (m, t) => {
    const [dx, dy] = pertoDe(m, t, 6);
    await tw(16, p => { m.ox = dx * ease.io(p); m.oy = dy * ease.io(p) - Math.sin(p * Math.PI) * 60 - p * 30; });
    await tw(6, p => { m.oy += 5; });
    const [x, y] = unitCenter(t); sfx('crit'); flashW(4); hitstop(10); bshake(18, 4); burst(x, y, 24, ['#ffffff', '#e86050', '#ffe066'], { max: 4 });
    tw(14, p => fxRing(x, y + 10, 6 + p * 40, '#ffe066', 1 - p)); hitFoe(m, t, 2.6, { el: 'corte', brk: 3, crit: true });
    await dashBack(m, 14);
  } }
});
