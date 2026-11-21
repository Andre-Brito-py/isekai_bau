// ================= BATALHA DA TEMPORADA 2: TEMPO ATIVO =================
// A linha do tempo anda sozinha. Cada lutador enche a barra de vez (ct) pela velocidade. Quando um aliado
// fica pronto, abre a roda de comandos e o tempo quase para (modo Ativo: os inimigos seguem a 25%; modo Espera:
// tudo para). Golpes do grupo têm acerto no tempo (A quando o anel fecha). Golpes dos inimigos se defendem com
// o anel: perfeito = quase nada de dano + contra-ataque + Tensão. Fraquezas tiram ESCUDO; escudo zerado = QUEBRA
// (o inimigo perde a vez e leva dano dobrado). Tensão paga técnicas, duplas e o Super de cada um.

const BT = { on: false };
const TIME_K = 0.055;                       // quanto a barra de vez enche por quadro, por ponto de velocidade
const ATIVO_SLOW = 0.25;

// ---------- utilidades de animação ----------
// tw(n, fn): roda fn(p, k) por n quadros (p de 0 a 1) e resolve no fim. As funções desenham durante o render.
function tw(n, fn) { return new Promise(r => BT.anims.push({ n, k: 0, fn, r })); }
const ease = { out: p => 1 - Math.pow(1 - p, 3), in: p => p * p * p, io: p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, back: p => 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2) };
function hitstop(n) { BT.stop = Math.max(BT.stop, n); }
function bshake(n, a = 2) { BT.shake = Math.max(BT.shake, n); BT.shakeA = a; }
function flashW(n) { BT.flash = Math.max(BT.flash, n); }
// partículas
function part(o) { BT.parts.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, life: 30, t: 0, col: '#fff', sz: 1, fr: 0.98 }, o)); }
function burst(x, y, n, cols, o = {}) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = rand(o.min || 0.6, o.max || 2.6); part({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0), g: o.g ?? 0.08, life: rand(14, o.life || 30) | 0, col: pickOne(cols), sz: o.sz || (Math.random() < 0.3 ? 2 : 1) }); } }
function popNum(x, y, s, col, big) { BT.nums.push({ x, y, s: String(s), col, t: 0, big }); }
function callout(s, col = '#ffe066', n = 70) { BT.call = { s, col, t: 0, n }; }
function hint(s, n = 300) { BT.hint = { s, t: 0, n }; }

// ---------- lutadores ----------
function unitCenter(u) { return [u.x + (u.ox || 0), u.y + (u.oy || 0) - u.h * 0.5]; }
function alive(list) { return list.filter(u => u.hp > 0 && !u.gone); }
const party = () => BT.party, foes = () => BT.foes;
function mkMember(d) {
  return Object.assign({ side: 'p', ct: rand(20, 60), ox: 0, oy: 0, sx: 1, sy: 1, flash: 0, st: {}, guardBy: null, def0: false, trail: d.mhp, anim: 'idle', af: 0 }, d, { hp: d.hp ?? d.mhp, mp: d.mp ?? d.mmp });
}
function mkFoe(d, x, y) {
  return Object.assign({ side: 'e', ct: rand(0, 40), ox: 0, oy: 0, sx: 1, sy: 1, flash: 0, st: {}, x, y, trail: d.mhp, shield: d.shield, known: {}, broken: 0, turns: 0, charge: null, alpha: 1 }, d, { hp: d.mhp });
}

// ---------- início ----------
async function battle2(cfg) {
  Object.assign(BT, {
    on: true, cfg, party: cfg.party.map(mkMember), foes: cfg.foes.map(f => mkFoe(ENEMY2[f.id], f.x, f.y)),
    anims: [], parts: [], nums: [], call: null, hint: null, stop: 0, shake: 0, flash: 0, t: 0,
    tension: cfg.tension || 0, tensionShow: 0, menu: null, busy: false, queue: [], over: null, mode: G.flags.modoEspera ? 'espera' : 'ativo',
    stats: { perf: 0, crit: 0, quebra: 0, t0: G.time }, dim: 0, cut: null, bgfn: cfg.bg || ponteBG, ring: null, prompt: null, cursor: null,
    // restos da luta anterior (sem isso o VITÓRIA! da luta dos corvos ficava por cima da luta do chefe)
    win: null, lose: null, waitA: null, phaseQ: [], phaseBusy: false, taunt: null, eco: false, lastTarget: null, lastCmd: {}, call: null, hint: null
  });
  layoutParty();
  V.scene = 'battle2';
  playMusic(cfg.music || 'battle');
  await fadeIn(16);
  if (cfg.intro) await cfg.intro();
  const res = await new Promise(r => { BT.done = r; });
  return res;
}
function layoutParty() {
  // fileira da frente mais perto dos inimigos; três "trilhas" em profundidade
  // trilhas: 0 = mais ao fundo, 2 = mais perto da tela. Frente fica mais à direita (perto dos inimigos)
  const ys = [126, 140, 156];
  BT.party.forEach((m, i) => { const l = m.lane ?? i; m.y = ys[l]; m.x = (m.row === 'back' ? 40 : 90) - (l === 2 ? 14 : 0); });
}

// ---------- o relógio ----------
function readyUnit() {
  for (const u of [...alive(BT.party), ...alive(BT.foes)]) if (u.ct >= 100) return u;
  return null;
}
function updateBattle2() {
  if (!BT.on) return;
  BT.t++;
  if (BT.stop > 0) { BT.stop--; return; }
  // animações e partículas
  for (let i = BT.parts.length - 1; i >= 0; i--) { const p = BT.parts[i]; p.t++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= p.fr; if (p.t >= p.life) BT.parts.splice(i, 1); }
  for (let i = BT.nums.length - 1; i >= 0; i--) { if (++BT.nums[i].t > 60) BT.nums.splice(i, 1); }
  for (const u of [...BT.party, ...BT.foes]) { if (u.flash > 0) u.flash--; u.trail += (u.hp - u.trail) * (u.trail > u.hp ? 0.06 : 1); if (u.broken > 0 && !BT.busy) { u.broken--; } }
  BT.tensionShow += (BT.tension - BT.tensionShow) * 0.15;
  if (BT.call && ++BT.call.t > BT.call.n) BT.call = null;
  if (BT.hint && ++BT.hint.t > BT.hint.n) BT.hint = null;
  if (BT.ring) updateRing();
  if (BT.prompt) updatePrompt();
  if (BT.over) return;
  // trocar o modo de tempo (botão MENU)
  if (btnp('menu') && !BT.ring && !BT.prompt) { BT.mode = BT.mode === 'ativo' ? 'espera' : 'ativo'; G.flags.modoEspera = BT.mode === 'espera'; callout('Tempo: ' + (BT.mode === 'ativo' ? 'ATIVO' : 'ESPERA'), '#8fe3ff', 60); sfx('select'); }
  if (BT.busy) return;
  // menu aberto: o tempo quase para (ou para, no modo Espera); um inimigo pronto interrompe
  const slow = BT.menu ? (BT.mode === 'ativo' && !UI.top() && !BT.cursor ? ATIVO_SLOW : 0) : 1;
  if (slow > 0) {
    for (const u of alive(BT.foes)) if (!u.broken && !(u.st.frio > 0 && BT.t % 2)) u.ct += u.spd * TIME_K * slow;
    if (!BT.menu) for (const u of alive(BT.party)) if (!(u.st.frio > 0 && BT.t % 2)) u.ct += u.spd * TIME_K;
  }
  const r = readyUnit();
  if (!r) return;
  if (r.side === 'e') { BT.busy = true; const m = BT.menu; if (m) m.hidden = true; foeTurn(r).then(async () => { await runPhases(); BT.busy = false; if (m) { m.hidden = false; if (m.m.hp <= 0 && m.pick) { const p = m.pick; m.pick = null; p('morto'); } } checkEnd(); }); }
  else if (!BT.menu) { openCommand(r); }
}
function checkEnd() {
  if (BT.over) return;
  if (!alive(BT.foes).length) { BT.over = 'win'; victory(); }
  else if (!alive(BT.party).length) { BT.over = 'lose'; defeat(); }
}
function endTurn(u, weight) {
  // peso da ação: leve devolve a vez cedo, pesada atrasa
  u.ct = weight === 'leve' ? 38 : weight === 'pesada' ? -30 : 0;
  for (const k of Object.keys(u.st)) if (u.st[k] > 0 && k !== 'guarda') u.st[k]--;
  if (u.st.vela > 0 && u.hp > 0) { const h = Math.round(u.mhp * 0.07); u.hp = Math.min(u.mhp, u.hp + h); popNum(...unitCenter(u), '+' + h, '#9be58a'); }
  if (u.st.queimado > 0) { const d = Math.max(1, Math.round(u.mhp * 0.05)); u.hp = Math.max(1, u.hp - d); popNum(...unitCenter(u), d, '#ffa94d'); }
}

// ---------- dano ----------
function calcDmg(a, t, pow, o = {}) {
  const stat = o.mag ? a.mag : a.atk, def = o.mag ? (t.mdef ?? t.def) : t.def;
  let d = stat * pow * 2 * (1 - def / (def + 40)) * rand(0.92, 1.08);
  if (t.side === 'p' && t.row === 'back' && !o.mag) d *= 0.7;
  if (a.side === 'p' && a.row === 'back' && !o.mag && !o.ranged) d *= 0.7;
  return d;
}
// aplica dano num inimigo; trata fraqueza, escudo e quebra
function hitFoe(a, t, pow, o = {}) {
  if (t.hp <= 0) return 0;
  let d = calcDmg(a, t, pow, o);
  const el = o.el, weak = el && t.weak.includes(el);
  if (el) { if (!t.known[el]) { t.known[el] = weak ? 'weak' : 'ok'; } }
  if (o.crit) d *= 1.5;
  if (t.broken > 0) d *= 2;
  if (weak) d *= 1.3;
  d = Math.max(1, Math.round(d));
  t.hp = Math.max(0, t.hp - d); t.flash = 8;
  // o chefe não pula fase: cada fase aparece pelo menos um pouco
  if (t.phases) { const nx = t.phases.find(p => !p.done); if (nx && t.hp < t.mhp * (nx.at - 0.04)) t.hp = Math.round(t.mhp * (nx.at - 0.04)); }
  const [x, y] = unitCenter(t);
  popNum(x + rand(-6, 6), y - 6, d, o.crit ? '#ffe066' : weak ? '#8fe3ff' : '#ffffff', o.crit || t.broken > 0);
  if (weak && !t.broken && t.shield > 0) {
    t.shield = Math.max(0, t.shield - (o.brk || 1));
    popNum(x + 14, y - 22, 'FRAQUEZA', '#8fe3ff');
    if (t.shield === 0) breakFoe(t);
  }
  BT.tension = Math.min(100, BT.tension + (o.crit ? 4 : 2) + (weak ? 2 : 0));
  t.ox = 4; setTimeout(() => { t.ox = 0; }, 90);
  if (t.hp <= 0) killFoe(t);
  else if (t.phases) checkPhase(t);
  return d;
}
function breakFoe(t) {
  t.broken = 200; t.ct = 0; BT.stats.quebra++;
  if (t.charge) { t.charge = null; callout(t.cancelTxt || 'O golpe preparado foi cancelado!', '#9be58a', 80); }
  else callout('QUEBRA!', '#8fe3ff', 60);
  const [x, y] = unitCenter(t); burst(x, y, 30, ['#8fe3ff', '#ffffff', '#5fd0ff'], { max: 3.6 }); flashW(3); bshake(10, 3); hitstop(8); sfx('crit');
  BT.tension = Math.min(100, BT.tension + 12);
}
function killFoe(t) {
  const [x, y] = unitCenter(t);
  sfx('die'); burst(x, y, 40, t.dieCols || ['#d8c8a0', '#b8a070', '#ffffff'], { max: 3, life: 40 });
  tw(30, p => { t.alpha = 1 - p; t.sy = 1 - p * 0.3; }).then(() => { t.gone = true; });
}
function hurtMember(m, d0, o = {}) {
  if (m.hp <= 0) return 0;
  let d = d0;
  if (m.def0) d *= 0.5;
  d = Math.max(1, Math.round(d));
  m.hp = Math.max(0, m.hp - d); m.flash = 10;
  const [x, y] = unitCenter(m);
  popNum(x, y - 8, d, o.res === 'perfeito' ? '#9be58a' : '#ff6b6b', d > m.mhp * 0.25);
  if (o.st && o.res !== 'perfeito') { m.st[o.st] = o.stT || 3; popNum(x, y - 20, ST_NAME[o.st], '#ffa94d'); }
  if (m.hp <= 0) { m.ct = 0; sfx('die'); burst(x, y, 16, ['#ff6b6b', '#ffffff']); callout(m.name + ' caiu!', '#ff6b6b', 70); }
  else sfx('hurt');
  return d;
}
const ST_NAME = { queimado: 'QUEIMADO', frio: 'GELADO', tonto: 'TONTO', vela: 'VELA' };

// ---------- defesa em anel ----------
// o anel fecha sobre o alvo; A no instante certo. Devolve 'perfeito' | 'bom' | 'falhou'
function defenseRing(m, n = 34, o = {}) {
  return new Promise(r => { BT.ring = { m, n, t: 0, r, res: null, fast: o.fast, label: o.label }; });
}
function updateRing() {
  const R = BT.ring; R.t++;
  const dt = R.t - R.n;                  // 0 = o anel encosta no alvo
  if (!R.res && btnp('a')) {
    const a = Math.abs(dt);
    R.res = a <= 3 ? 'perfeito' : a <= 8 ? 'bom' : 'falhou'; R.at = R.t;
  }
  if ((R.res && R.t - R.at > 6) || dt > 10) { const res = R.res || 'falhou'; BT.ring = null; R.r(res); }
}
// ---------- acerto no tempo nos ataques do grupo ----------
function timedPrompt(t, n = 26) { return new Promise(r => { BT.prompt = { t, n, k: 0, r, res: null }; }); }
function updatePrompt() {
  const P = BT.prompt; P.k++;
  const dt = P.k - P.n;
  if (!P.res && btnp('a')) { P.res = Math.abs(dt) <= 4 ? 'certo' : 'cedo'; P.at = P.k; }
  if ((P.res && P.k - P.at > 4) || dt > 8) { BT.prompt = null; P.r(P.res === 'certo'); }
}

// ---------- turno do grupo: a roda de comandos ----------
const CMD = [
  { k: 'atacar', nm: 'Atacar', ic: m => m.atkIcon || 'atacar', desc: m => m.atkDesc },
  { k: 'tecnica', nm: 'Técnicas', ic: () => 'tecnica', desc: () => 'Golpes que gastam Tensão.' },
  { k: 'runas', nm: 'Runas', nmF: m => m.magNm || 'Runas', ic: m => m.magIcon || 'runas', desc: m => m.magDesc || 'Feitiços de runa. Gastam PM.', only: m => m.runas },
  { k: 'dupla', nm: 'Dupla', ic: () => 'dupla', desc: () => 'Golpe com um aliado que está quase na vez. 50 de Tensão.' },
  { k: 'item', nm: 'Itens', ic: () => 'item', desc: () => 'Frasco de Âmbar e Tinta Azul.' },
  { k: 'defender', nm: 'Defender', ic: () => 'defender', desc: () => 'Metade do dano até a próxima vez. Ação leve.' },
  { k: 'super', nm: 'SUPER', ic: () => 'super', desc: m => m.superNm + ': ' + m.superDesc, need: () => BT.tension >= 100 }
];
function cmdsFor(m) { return CMD.filter(c => !c.only || c.only(m)); }
function openCommand(m) {
  BT.menu = { m, idx: BT.lastCmd?.[m.id] || 0, hidden: false };
  sfx('select'); m.sy = 1.12; setTimeout(() => { m.sy = 1; }, 120);
  runCommand(m);
}
async function runCommand(m) {
  while (true) {
    const c = await wheelPick(m);
    if (c === null) continue;
    BT.lastCmd = BT.lastCmd || {}; BT.lastCmd[m.id] = BT.menu.idx;
    const done = await doCommand(m, c);
    if (done) break;
  }
  BT.menu = null;
}
function wheelPick(m) {
  return new Promise(r => { BT.menu.pick = r; });
}
function menuInput() {
  const M = BT.menu; if (!M || M.hidden || BT.busy || UI.top() || BT.cursor) return;
  const cs = cmdsFor(M.m);
  if (navp('right') || navp('down')) { M.idx = (M.idx + 1) % cs.length; sfx('move'); }
  if (navp('left') || navp('up')) { M.idx = (M.idx + cs.length - 1) % cs.length; sfx('move'); }
  if (btnp('a')) { const c = cs[M.idx]; if (c.need && !c.need()) { sfx('cancel'); callout('Precisa de 100 de Tensão', '#ff6b6b', 40); return; } sfx('select'); const p = M.pick; M.pick = null; p && p(c.k); }
}
// escolher alvo: cursor sobre inimigos (ou aliados)
function pickTarget(side, o = {}) {
  const list = side === 'e' ? alive(BT.foes) : (o.dead ? BT.party : alive(BT.party));
  if (!list.length) return Promise.resolve(null);
  if (o.all) return Promise.resolve('all');
  return new Promise(r => { BT.cursor = { list, idx: Math.max(0, list.indexOf(o.pref)), r, side, all: o.all }; });
}
function cursorInput() {
  const C = BT.cursor; if (!C || UI.top()) return;
  if (navp('right') || navp('down')) { C.idx = (C.idx + 1) % C.list.length; sfx('move'); }
  if (navp('left') || navp('up')) { C.idx = (C.idx + C.list.length - 1) % C.list.length; sfx('move'); }
  if (btnp('a')) { sfx('select'); BT.cursor = null; C.r(C.list[C.idx]); }
  else if (btnp('b')) { sfx('cancel'); BT.cursor = null; C.r(null); }
}
// listinha de opções (técnicas, runas, itens, duplas)
function subList(title, items, desc) {
  return list({ x: 112, y: 22, w: 126, title, items, desc: i => items[i] && items[i].d, descY: 122, edge: '#8fe3ff', maxVis: 5 });
}
async function doCommand(m, k) {
  if (k === 'morto') return true;
  if (k === 'atacar') { const t = await pickTarget('e', { pref: BT.lastTarget }); if (!t) return false; BT.lastTarget = t; await act(m, () => m.attack(m, t)); endTurn(m, 'normal'); return true; }
  if (k === 'defender') { m.def0 = true; BT.tension = Math.min(100, BT.tension + 5); callout(m.name + ' se defende', '#8fe3ff', 40); sfx('guard'); endTurn(m, 'leve'); return true; }
  if (k === 'item') {
    const its = [{ k: 'frasco', label: 'Frasco de Âmbar', right: 'x' + (G.items.frasco || 0), disabled: !G.items.frasco, d: 'Cura 45% da vida de um aliado e tira queimadura e frio.' },
                 { k: 'tinta', label: 'Tinta Azul', right: 'x' + (G.items.tinta || 0), disabled: !G.items.tinta, d: 'Devolve 15 PM.' },
                 { k: 'pluma', label: 'Pena de Fênix?', right: 'x' + (G.items.pluma || 0), disabled: !G.items.pluma, d: 'Levanta um aliado caído com 30% da vida. (É só uma pena de galinha dourada. Funciona mesmo assim.)' }];
    const i = await subList('Itens', its); if (i < 0) return false;
    const it = its[i], t = await pickTarget('p', { dead: it.k === 'pluma', pref: m }); if (!t) return false;
    if (it.k === 'pluma' && t.hp > 0) { sfx('cancel'); return false; }
    if (it.k !== 'pluma' && t.hp <= 0) { sfx('cancel'); return false; }
    G.items[it.k]--;
    await act(m, async () => {
      sfx('item'); const [x, y] = unitCenter(t);
      await tw(20, p => { fxRing(x, y, 4 + p * 18, '#ffd060', 1 - p); });
      if (it.k === 'frasco') { healUnit(t, Math.round(t.mhp * 0.45)); t.st.queimado = 0; t.st.frio = 0; }
      if (it.k === 'tinta') { t.mp = Math.min(t.mmp, t.mp + 15); popNum(x, y - 10, '+15 PM', '#8fe3ff'); }
      if (it.k === 'pluma') { t.hp = Math.round(t.mhp * 0.3); t.ct = 50; popNum(x, y - 10, 'DE PÉ!', '#9be58a'); burst(x, y, 24, ['#ffd060', '#ffffff']); }
    });
    endTurn(m, 'leve'); return true;
  }
  if (k === 'tecnica') {
    const ts = m.techs.map(tk => { const T = TECH2[tk]; return { k: tk, label: T.nm, right: T.cost + 'T', disabled: BT.tension < T.cost, d: T.d }; });
    const i = await subList('Técnicas', ts); if (i < 0) return false;
    const T = TECH2[ts[i].k];
    const t = T.tgt === 'self' ? m : T.tgt === 'all' ? 'all' : T.tgt === 'ally' ? await pickTarget('p', { pref: m }) : await pickTarget('e', { pref: BT.lastTarget });
    if (!t) return false;
    BT.tension -= T.cost; await act(m, () => T.run(m, t)); endTurn(m, T.w || 'normal'); return true;
  }
  if (k === 'runas') {
    const rs = m.runas.map(rk => { const S = RUNA2[rk]; return { k: rk, label: S.nm, right: S.mp + 'PM', disabled: m.mp < S.mp, d: S.d }; });
    const i = await subList(m.magNm || 'Runas', rs); if (i < 0) return false;
    const S = RUNA2[rs[i].k];
    const t = S.tgt === 'all' ? 'all' : S.tgt === 'ally' ? await pickTarget('p', { pref: m }) : await pickTarget('e', { pref: BT.lastTarget });
    if (!t) return false;
    m.mp -= S.mp; await act(m, () => S.run(m, t)); endTurn(m, S.w || 'normal'); return true;
  }
  if (k === 'dupla') {
    const ds = Object.entries(DUPLA2).filter(([, D]) => D.who.includes(m.id)).map(([dk, D]) => {
      const p = BT.party.find(u => u.id === D.who.find(w => w !== m.id));
      const ok = p && p.hp > 0 && p.ct >= 50 && BT.tension >= 50;
      return { k: dk, label: D.nm, right: '50T', disabled: !ok, d: D.d + (p && p.hp > 0 && p.ct < 50 ? ' (' + p.name + ' ainda não está quase na vez.)' : '') };
    });
    const i = await subList('Duplas', ds); if (i < 0) return false;
    const D = DUPLA2[ds[i].k], p = BT.party.find(u => u.id === D.who.find(w => w !== m.id));
    const t = D.tgt === 'all' || D.tgt === 'party' ? 'all' : await pickTarget('e', { pref: BT.lastTarget }); if (!t) return false;
    BT.tension -= 50; await act(m, () => cutIn([m, p], D.nm, D.col).then(() => D.run(m, p, t)));
    endTurn(m, 'normal'); endTurn(p, 'normal'); return true;
  }
  if (k === 'super') {
    const t = m.superTgt === 'one' ? await pickTarget('e', { pref: BT.lastTarget }) : 'all'; if (!t) return false;
    BT.tension = 0; await act(m, () => cutIn([m], m.superNm, m.col).then(() => m.super(m, t)));
    endTurn(m, 'pesada'); return true;
  }
  return false;
}
// envolve a ação: o menu some e o relógio para enquanto o golpe acontece
async function act(m, fn) { BT.busy = true; BT.menu.hidden = true; m.def0 = false; try { await fn(); } finally { await runPhases(); BT.busy = false; checkEnd(); } }
function healUnit(t, n) { const v = Math.min(t.mhp - t.hp, n); t.hp += v; const [x, y] = unitCenter(t); popNum(x, y - 8, '+' + v, '#9be58a'); sfx('heal'); burst(x, y, 12, ['#9be58a', '#ffffff'], { up: 1, g: -0.02 }); }

// ---------- coreografia de golpes ----------
// corre até o alvo, golpeia (com acerto no tempo) e volta
async function dash(u, tx, ty, n = 14) {
  const x0 = u.x + u.ox, y0 = u.y + u.oy, dx = tx - u.x, dy = ty - u.y;
  u.anim = 'run';
  await tw(n, p => { const q = ease.io(p); u.ox = dx * q; u.oy = dy * q - Math.sin(q * Math.PI) * 6; if (BT.t % 3 === 0) part({ x: u.x + u.ox, y: u.y + u.oy, vy: -0.3, life: 14, col: '#8a7a6a' }); });
}
async function dashBack(u, n = 12) {
  const ox = u.ox, oy = u.oy; u.anim = 'run'; u.face = -1;
  await tw(n, p => { const q = ease.out(p); u.ox = ox * (1 - q); u.oy = oy * (1 - q) - Math.sin(q * Math.PI) * 4; });
  u.ox = 0; u.oy = 0; u.anim = 'idle'; u.face = 1;
}
function slashFx(x, y, col, dir = 1, big) {
  tw(12, p => { const r = (big ? 22 : 14) * ease.out(p); bx.globalAlpha = 1 - p; bx.strokeStyle = col; bx.lineWidth = big ? 3 : 2; bx.beginPath(); bx.arc(x, y, r, -1.2 * dir - 0.4, -1.2 * dir + 1.6); bx.stroke(); bx.globalAlpha = 1; });
}
function fxRing(x, y, r, col, a = 1) { bx.globalAlpha = Math.max(0, a); bx.strokeStyle = col; bx.lineWidth = 1; bx.beginPath(); bx.arc(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.max(0.5, r), 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; }
function fxDisc(x, y, r, col) { bx.fillStyle = col; bx.beginPath(); bx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); bx.fill(); }
// projétil de runa
async function projectile(from, to, col, n = 18, o = {}) {
  const [x0, y0] = unitCenter(from), [x1, y1] = unitCenter(to);
  await tw(n, p => {
    const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * (o.arc || 10);
    fxDisc(x, y, o.r || 3, col); fxDisc(x, y, (o.r || 3) * 0.5, '#ffffff');
    if (BT.t % 2 === 0) part({ x, y, vx: rand(-0.4, 0.4), vy: rand(-0.6, 0.2), life: 14, col: pickOne(o.trail || [col, '#ffffff']) });
  });
}
// cena do SUPER e das duplas: faixa diagonal, retratos grandes e o nome do golpe
function cutIn(us, nm, col) {
  sfx('catalog'); BT.dim = 1;
  return tw(70, (p, k) => {
    const a = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
    bx.globalAlpha = 0.65 * a; bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1;
    const sl = ease.out(Math.min(1, p / 0.25)) * (p > 0.85 ? 1 - (p - 0.85) / 0.15 * 1.5 : 1);
    bx.save(); bx.globalAlpha = a; bx.fillStyle = col; bx.beginPath(); bx.moveTo(-20, 70); bx.lineTo(260, 50); bx.lineTo(260, 112); bx.lineTo(-20, 132); bx.fill();
    bx.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const x = ((k * 9 + i * 41) % 300) - 30; bx.fillRect(x, 60 + (i * 13) % 60, 22, 1); }
    us.forEach((u, i) => { const P = IMG.port[u.port] ? IMG.port[u.port][0] : null; if (P) { bx.imageSmoothingEnabled = false; bx.drawImage(P, Math.round(-70 + sl * (90 + i * 74)), 60 + i * 4, 64, 64); } });
    bx.restore();
    const big = lineW(rich(nm), 2) <= 220 ? 2 : 1.5; txt(nm, 234 + (1 - Math.min(1, sl)) * 240, 112, { align: 'right', sz: big, col: '#ffffff', shadow: true, alpha: a });
  }).then(() => { BT.dim = 0; });
}

// ---------- turno do inimigo ----------
async function foeTurn(e) {
  e.turns++;
  if (e.broken > 0) { e.broken = 0; }                         // quebrado: perde a vez e o escudo volta
  else if (e.wasBroken) { }
  if (e.shield === 0) { e.shield = e.maxShield; callout(e.name + ' se recompõe', '#d0a8ff', 50); }
  e.flash = 0;
  await AI2[e.ai](e);
  e.ct = e.charge ? 40 : 0;
  for (const k of Object.keys(e.st)) if (e.st[k] > 0) e.st[k]--;
}
// golpe padrão de inimigo num alvo, com anel de defesa
async function foeStrike(e, t, pow, o = {}) {
  if (!t || t.hp <= 0) return;
  // Guardar: o baú entra na frente
  const g = t.st.guardado > 0 && t.guardBy && t.guardBy.hp > 0 ? t.guardBy : null;
  if (g) { callout(g.name + ' entra na frente!', '#ffa94d', 50); t = g; }
  const res = await defenseRing(t, o.n || 34, o);
  let mult = res === 'perfeito' ? 0.12 : res === 'bom' ? 0.5 : 1;
  if (g) mult *= 0.6;
  const d = calcDmg(e, t, pow) * mult;
  if (o.fx) o.fx(t, res);
  const [x, y] = unitCenter(t);
  if (res === 'perfeito') { BT.stats.perf++; BT.tension = Math.min(100, BT.tension + 9); popNum(x, y - 24, 'PERFEITO!', '#9be58a', true); sfx('guard'); burst(x, y, 14, ['#9be58a', '#ffffff']); }
  else if (res === 'bom') { BT.tension = Math.min(100, BT.tension + 3); popNum(x, y - 24, 'BOM', '#8fe3ff'); sfx('guard'); }
  else { bshake(8, 2); hitstop(4); }
  hurtMember(t, d, { res, st: o.st, stT: o.stT });
  t.ox = res === 'falhou' ? -6 : -2; setTimeout(() => { t.ox = 0; }, 120);
  if (res === 'perfeito' && t.hp > 0 && e.hp > 0 && !o.noCounter) await counter(t, e);
  return res;
}
// contra-ataque do perfeito: golpe rápido do tipo de quem defendeu
async function counter(m, e) {
  const [ex, ey] = unitCenter(e);
  callout('Contra-ataque!', '#9be58a', 40);
  if (m.ranged) await projectile(m, e, m.col, 10, { r: 2 });
  else { await tw(6, p => { m.ox = 10 * p; }); }
  slashFx(ex, ey, m.col, 1); sfx('hit'); hitstop(3);
  hitFoe(m, e, 0.5, { el: m.el, mag: m.ranged });
  e.ct = Math.max(0, e.ct - 15);
  if (!m.ranged) await tw(6, p => { m.ox = 10 * (1 - p); });
}

// ---------- fases do chefe ----------
// a troca de fase fica pendente e roda no fim da ação (nunca no meio de um golpe)
function checkPhase(t) { const ph = t.phases.find(p => !p.done && t.hp <= t.mhp * p.at); if (ph) { ph.done = true; (BT.phaseQ = BT.phaseQ || []).push([t, ph]); } }
async function runPhases() {
  while (BT.phaseQ && BT.phaseQ.length) {
    const [t, ph] = BT.phaseQ.shift(); if (t.hp <= 0) continue;
    await wait(10); await ph.run(t); t.known = {}; t.charge = null; t.ct = Math.max(t.ct, 30);
  }
}

// ---------- vitória e derrota ----------
async function victory() {
  BT.menu = null; BT.cursor = null;
  playMusic(null); jingle && jingle('C5:2 E5:2 G5:2 C6:6', 200);
  for (const m of alive(BT.party)) { m.def0 = false; }
  BT.win = { t: 0 };
  await tw(40, p => { for (const m of alive(BT.party)) m.oy = -Math.abs(Math.sin(p * Math.PI * 3)) * 8; });
  await wait(30);
  await new Promise(r => { BT.waitA = r; });
  BT.on = false; BT.done('win');
}
async function defeat() {
  BT.menu = null; BT.cursor = null; playMusic(null); sfx('die');
  BT.lose = { t: 0 };
  await wait(80);
  const c = await choose('* O grupo caiu na beira da estrada. Tentar de novo?', ['Tentar de novo', 'Desistir (volta ao título)']);
  BT.on = false; BT.done(c === 0 ? 'retry' : 'quit');
}

// ---------- desenho ----------
function drawBattle2() {
  bx.imageSmoothingEnabled = false;
  let sx = 0, sy = 0; if (BT.shake > 0) { BT.shake--; sx = Math.round(rand(-BT.shakeA, BT.shakeA)); sy = Math.round(rand(-BT.shakeA, BT.shakeA)); }
  bx.save(); bx.translate(sx, sy);
  bx.fillStyle = '#05030a'; bx.fillRect(-4, -4, W + 8, H + 8);
  bx.drawImage(BT.bgfn(), 0, 12);
  if (BT.cfg.bgAnim) BT.cfg.bgAnim();
  // sombras e lutadores, por profundidade
  const all = [...BT.foes.filter(u => !u.gone), ...BT.party].sort((a, b) => a.y - b.y);
  for (const u of all) drawUnit(u);
  // anel de defesa, acerto no tempo
  if (BT.ring) drawRing();
  if (BT.prompt) drawPrompt();
  // animações agendadas (efeitos)
  for (let i = BT.anims.length - 1; i >= 0; i--) {
    const a = BT.anims[i]; const p = Math.min(1, a.k / a.n);
    a.fn(p, a.k);
    if (BT.stop <= 0) a.k++;
    if (a.k > a.n) { BT.anims.splice(i, 1); a.r(); }
  }
  for (const p of BT.parts) { bx.globalAlpha = Math.min(1, (p.life - p.t) / 10); bx.fillStyle = p.col; bx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz); }
  bx.globalAlpha = 1;
  bx.restore();
  if (BT.flash > 0) { bx.fillStyle = '#ffffff'; bx.globalAlpha = BT.flash / 4; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1; BT.flash--; }
  // números de dano
  for (const n of BT.nums) {
    const k = n.t, y = n.y - (k < 10 ? ease.back(k / 10) * 10 : 10 + (k - 10) * 0.15);
    txt(n.s, n.x, Math.round(y), { align: 'center', col: n.col, sz: n.big ? 1.5 : 1, shadow: true, alpha: k > 45 ? (60 - k) / 15 : 1 });
  }
  drawTimeline(); drawTension(); drawHUD();
  if (BT.menu && !BT.menu.hidden && !BT.busy && !BT.cursor && !UI.top()) drawWheel();
  if (BT.cursor) drawCursor();
  if (BT.call) { const c = BT.call, a = Math.min(1, c.t / 6, (c.n - c.t) / 10); const w = lineW(rich(c.s)) + 16; bx.globalAlpha = a * 0.85; bx.fillStyle = '#0a0612'; bx.fillRect(120 - w / 2, 24, w, 13); bx.globalAlpha = 1; txt(c.s, 120, 25, { align: 'center', col: c.col, alpha: a }); }
  if (BT.hint && !BT.call) { const h = BT.hint, a = Math.min(1, h.t / 10, (h.n - h.t) / 10), nl = wrapRich(rich(h.s), 36).length; bx.globalAlpha = 0.88 * a; bx.fillStyle = '#0a0612'; bx.fillRect(12, 23, 226, nl * 11 + 4); bx.fillStyle = '#5fd0ff'; bx.fillRect(12, 23 + nl * 11 + 4, 226, 1); bx.globalAlpha = 1; txt(h.s, 16, 25, { w: 36, col: '#b8f0ff', alpha: a, lh: 11 }); }
  if (BT.win) drawWin();
  if (BT.lose) { BT.lose.t++; bx.globalAlpha = Math.min(0.6, BT.lose.t / 60); bx.fillStyle = '#200008'; bx.fillRect(0, 0, W, H); bx.globalAlpha = 1; }
  menuInput(); cursorInput();
  if (BT.waitA && btnp('a')) { const r = BT.waitA; BT.waitA = null; r(); }
}
function drawUnit(u) {
  const a = u.alpha ?? 1; if (a <= 0) return;
  const fr = unitFrame(u); if (!fr) return;
  const w = fr.width * (u.sx || 1), h = fr.height * (u.sy || 1);
  const X = Math.round(u.x + u.ox - w / 2), Y = Math.round(u.y + u.oy - h);
  // sombra
  bx.globalAlpha = 0.35 * a; bx.fillStyle = '#000'; const sw = u.fly ? fr.width * 0.4 : fr.width * 0.7; bx.fillRect(Math.round(u.x + u.ox - sw / 2), Math.round(u.y + (u.fly ? u.fly : 0)) - 1, Math.round(sw), 3); bx.globalAlpha = a;
  if (u.side === 'p' && u.hp <= 0) bx.globalAlpha = 0.45;
  bx.drawImage(fr, X, Y, Math.round(w), Math.round(h));
  if (u.flash > 0 && u.flash % 4 < 2) { const c = whiteOf(fr); bx.drawImage(c, X, Y, Math.round(w), Math.round(h)); }
  bx.globalAlpha = 1;
  // marcas de estado sobre a cabeça
  if (u.side === 'e' && u.broken > 0) { for (let i = 0; i < 3; i++) { const ang = BT.t / 12 + i * 2.1; txt('*', u.x + Math.cos(ang) * 12, Y - 6 + Math.sin(ang) * 3, { col: '#ffe066', align: 'center' }); } }
  if (u.side === 'e' && u.charge) { const p = (BT.t % 30) / 30; fxRing(u.x, Y + h * 0.4, 18 + p * 10, '#ff6b6b', 1 - p); }
  if (u.def0 && u.hp > 0) { bx.globalAlpha = 0.5; bx.drawImage(ICON.defender, Math.round(u.x + u.ox + 8), Y + 2); bx.globalAlpha = 1; }
  if (u.st.guardado > 0) bx.drawImage(ICON.guarda, Math.round(u.x + u.ox - 14), Y + 2);
}
const WHITE_C = new Map();
function whiteOf(c) { if (WHITE_C.has(c)) return WHITE_C.get(c); const o = mk(c.width, c.height), x = o.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height); WHITE_C.set(c, o); return o; }
function unitFrame(u) { return u.frame ? u.frame(u) : null; }

function drawRing() {
  const R = BT.ring, [x, y] = unitCenter(R.m), dt = R.t - R.n;
  const r = Math.max(6, 6 + (R.n - R.t) * 1.1);
  fxRing(x, y, 6, '#ffffff', 0.9); fxRing(x, y, 7, '#ffe066', 0.5);
  if (!R.res) { fxRing(x, y, r, dt > 3 ? '#ff6b6b' : R.fast ? '#ffa94d' : '#ffffff', 1); fxRing(x, y, r + 1, '#000000', 0.5); }
  else { const c = R.res === 'perfeito' ? '#9be58a' : R.res === 'bom' ? '#8fe3ff' : '#ff6b6b'; fxRing(x, y, 6 + (R.t - R.at) * 2, c, 1 - (R.t - R.at) / 8); }
  if (!R.res && R.t > R.n - 14) txt('A', x + 10, y - 16, { col: '#ffe066', shadow: true });
  if (R.label && R.t < 30) txt(R.label, x, y - 34, { align: 'center', col: '#ffa94d', shadow: true });
}
function drawPrompt() {
  const P = BT.prompt, [x, y] = unitCenter(P.t), dt = P.k - P.n;
  const r = Math.max(5, 5 + (P.n - P.k) * 1.2);
  bx.globalAlpha = 0.9; bx.drawImage(ICON.atacar, Math.round(x - 6), Math.round(y - 6)); bx.globalAlpha = 1;
  if (!P.res) fxRing(x, y, r, dt > 4 ? '#ff6b6b' : '#ffe066', 1);
  else txt(P.res === 'certo' ? 'CERTO!' : '...', x, y - 30, { align: 'center', col: P.res === 'certo' ? '#ffe066' : '#8a8099', shadow: true });
}

// --- linha do tempo (topo) ---
function predictOrder(n = 8) {
  const sim = [...alive(BT.party), ...alive(BT.foes)].map(u => ({ u, ct: u.ct, spd: u.spd * (u.st.frio > 0 ? 0.5 : 1), br: u.broken || 0 }));
  const out = []; let guard = 0;
  while (out.length < n && guard++ < 4000) {
    for (const s of sim) { if (s.br > 0) { s.br--; continue; } s.ct += s.spd * TIME_K; }
    for (const s of sim) if (s.ct >= 100 && out.length < n) { out.push(s.u); s.ct -= 100; }
  }
  return out;
}
function miniIcon(u) {
  if (u.mini) return u.mini;
  const c = mk(14, 14), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  const src = u.side === 'p' ? PT(u.port) : unitFrame(u);
  if (src) { if (u.side === 'p') x.drawImage(src, 0, 0, 32, 32, 0, 0, 14, 14); else { const s = 14 / Math.max(src.width, src.height) * (u.boss ? 2.1 : 1.2); x.drawImage(src, (14 - src.width * s) / 2, u.boss ? -2 : (14 - src.height * s) / 2, src.width * s, src.height * s); } }
  return u.mini = c;
}
function drawTimeline() {
  bx.fillStyle = '#0a0612'; bx.fillRect(0, 0, W, 21); bx.fillStyle = '#2a2236'; bx.fillRect(0, 20, W, 1);
  txt('VEZ', 4, 5, { col: '#8a8099' });
  const order = predictOrder(8);
  let firstCharge = true;
  order.forEach((u, i) => {
    const x = 28 + i * 23, y = 3, cur = i === 0;
    const edge = u.side === 'p' ? (u.col || '#8fe3ff') : (u.charge && firstCharge ? '#ff6b6b' : '#d0a8ff');
    bx.fillStyle = edge; bx.fillRect(x - 1, y - 1, 18, 17); bx.fillStyle = '#140e1e'; bx.fillRect(x, y, 16, 15);
    bx.drawImage(miniIcon(u), x + 1, y + 1);
    if (u.side === 'e' && u.charge && firstCharge) { firstCharge = false; txt('!', x + 13, y - 2, { col: '#ff6b6b', shadow: true }); }
    if (cur) { bx.fillStyle = '#ffe066'; bx.fillRect(x + 6, y + 16, 4, 2); }
  });
  // modo de tempo
  txt(BT.mode === 'ativo' ? 'A' : 'E', 234, 5, { col: BT.mode === 'ativo' ? '#9be58a' : '#ffa94d', align: 'right' });
}
// --- Tensão (barra vertical à esquerda) ---
function drawTension() {
  const x = 2, y = 26, h = 128, v = BT.tensionShow / 100, full = BT.tension >= 100;
  bx.fillStyle = '#0a0612'; bx.fillRect(x, y, 8, h + 2); bx.fillStyle = '#3a2a4a'; bx.fillRect(x + 1, y + 1, 6, h);
  const fh = Math.round(h * v), col = full ? (BT.t % 10 < 5 ? '#ffffff' : '#ffe066') : '#ffa94d';
  bx.fillStyle = col; bx.fillRect(x + 1, y + 1 + h - fh, 6, fh);
  bx.fillStyle = '#ffd8a0'; if (fh > 2) bx.fillRect(x + 1, y + 1 + h - fh, 6, 1);
  for (const m of [0.25, 0.5, 0.75]) { bx.fillStyle = '#0a0612'; bx.fillRect(x + 1, y + 1 + Math.round(h * (1 - m)), 6, 1); }
  txt('T', x + 1, y + h + 3, { col: full ? '#ffe066' : '#ffa94d' });
  if (full) for (let i = 0; i < 2; i++) part({ x: x + 4 + rand(-3, 3), y: y + rand(0, h), vy: -0.5, life: 16, col: '#ffe066' });
}
// --- painéis do grupo (embaixo) ---
function drawHUD() {
  const y0 = 162;
  bx.fillStyle = '#0a0612'; bx.fillRect(0, y0 - 2, W, H - y0 + 2); bx.fillStyle = '#2a2236'; bx.fillRect(0, y0 - 2, W, 1);
  BT.party.forEach((m, i) => {
    const x = 2 + i * 79, y = y0 + 1, wd = 77, hgt = 75;
    const active = BT.menu && BT.menu.m === m && !BT.menu.hidden;
    const mirado = BT.cursor && BT.cursor.list[BT.cursor.idx] === m;
    bx.fillStyle = mirado ? (BT.t % 16 < 8 ? '#9be58a' : '#4a8a4a') : active ? '#ffe066' : m.hp <= 0 ? '#4a2030' : '#3a2e4e'; bx.fillRect(x, y, wd, hgt);
    bx.fillStyle = '#140e1e'; bx.fillRect(x + 1, y + 1, wd - 2, hgt - 2);
    // retrato com expressão: ferido = treme, caído = cinza
    const P = PT(m.port), shake = m.flash > 0 ? Math.round(rand(-1, 1)) : 0;
    bx.globalAlpha = m.hp <= 0 ? 0.35 : 1; bx.drawImage(P, 0, 0, 32, 32, x + 3 + shake, y + 3, 24, 24); bx.globalAlpha = 1;
    if (m.hp > 0 && m.hp < m.mhp * 0.3 && BT.t % 40 < 20) { bx.fillStyle = 'rgba(255,60,60,0.3)'; bx.fillRect(x + 3, y + 3, 24, 24); }
    txt(m.short || m.name, x + 30, y + 3, { col: active ? '#ffe066' : '#ffffff' });
    // PV com rastro vermelho
    const bw = 44, hp = m.hp / m.mhp, tr = m.trail / m.mhp;
    bx.fillStyle = '#2a1a24'; bx.fillRect(x + 30, y + 16, bw, 4);
    bx.fillStyle = '#c83a3a'; bx.fillRect(x + 30, y + 16, Math.round(bw * tr), 4);
    bx.fillStyle = hp > 0.5 ? '#6ad06a' : hp > 0.25 ? '#e8c040' : '#e85a4a'; bx.fillRect(x + 30, y + 16, Math.round(bw * hp), 4);
    bx.fillStyle = 'rgba(255,255,255,0.35)'; bx.fillRect(x + 30, y + 16, Math.round(bw * hp), 1);
    txt(String(m.hp), x + 30, y + 21, { col: '#ffffff' }); txt('/' + m.mhp, x + 30 + lineW(rich(String(m.hp))), y + 21, { col: '#8a8099' });
    // PM
    if (m.mmp) { bx.fillStyle = '#1a1a34'; bx.fillRect(x + 3, y + 33, 71, 3); bx.fillStyle = '#5a8ae8'; bx.fillRect(x + 3, y + 33, Math.round(71 * m.mp / m.mmp), 3); txt('PM ' + m.mp, x + 3, y + 37, { col: '#8fb8ff' }); }
    // barra de vez (enche em tempo real)
    const ct = Math.max(0, Math.min(1, m.ct / 100));
    bx.fillStyle = '#241a30'; bx.fillRect(x + 3, y + 51, 71, 5);
    bx.fillStyle = ct >= 1 ? (BT.t % 8 < 4 ? '#ffffff' : '#ffe066') : m.col; bx.fillRect(x + 3, y + 51, Math.round(71 * ct), 5);
    txt(m.row === 'back' ? 'trás' : 'frente', x + 3, y + 58, { col: '#6a6078' });
    // status
    let sx = x + 74; for (const k of ['queimado', 'frio', 'tonto', 'vela']) if (m.st[k] > 0) { sx -= 13; bx.drawImage(ICON[k === 'frio' ? 'congelado' : k === 'vela' ? 'luz' : k], sx, y + 60); }
    if (m.def0) { sx -= 13; bx.drawImage(ICON.defender, sx, y + 60); }
  });
}
// --- roda de comandos ---
function drawWheel() {
  const M = BT.menu, m = M.m, cs = cmdsFor(m), [cx, cy] = unitCenter(m);
  const R = 26, n = cs.length;
  M.rot = (M.rot ?? M.idx) + ((M.idx - (M.rot ?? M.idx)) * 0.3);
  cs.forEach((c, i) => {
    const ang = -Math.PI / 2 + (i - M.rot) * (Math.PI * 2 / n), x = Math.round(cx + Math.cos(ang) * R), y = Math.round(cy + Math.sin(ang) * R * 0.8);
    const sel = i === M.idx, dis = c.need && !c.need();
    bx.globalAlpha = sel ? 1 : 0.82; bx.fillStyle = sel ? '#ffe066' : '#3a2e4e'; bx.fillRect(x - 9, y - 9, 18, 18); bx.fillStyle = sel ? '#2a1a0a' : '#140e1e'; bx.fillRect(x - 8, y - 8, 16, 16); bx.globalAlpha = 1;
    bx.globalAlpha = dis ? 0.35 : 1; bx.drawImage(ICON[c.ic(m)], x - 6, y - 6); bx.globalAlpha = 1;
    if (c.k === 'super' && !dis && BT.t % 20 < 10) fxRing(x, y, 11, '#ffe066', 0.8);
  });
  const c = cs[M.idx];
  const label = c.k === 'atacar' ? (m.atkNm || 'Atacar') : c.nmF ? c.nmF(m) : c.nm;
  const w = lineW(rich(label)) + 14;
  bx.fillStyle = '#ffe066'; bx.fillRect(cx - w / 2, cy - 52, w, 14); bx.fillStyle = '#140e1e'; bx.fillRect(cx - w / 2 + 1, cy - 51, w - 2, 12);
  txt(label, cx, cy - 51, { align: 'center', col: '#ffe066' });
  const d = typeof c.desc === 'function' ? c.desc(m) : c.desc;
  if (d) { const nl = Math.min(4, wrapRich(rich(d), 21).length); bx.globalAlpha = 0.9; bx.fillStyle = '#0a0612'; bx.fillRect(104, 158 - nl * 11 - 4, 134, nl * 11 + 3); bx.globalAlpha = 1; txt(d, 107, 158 - nl * 11 - 2, { w: 21, col: '#b8aecb', lh: 11 }); }
}
// --- cursor de alvo + ficha do inimigo ---
function drawCursor() {
  const C = BT.cursor, u = C.list[C.idx]; if (!u) return;
  const [x, y] = unitCenter(u), top = u.y + u.oy - (unitFrame(u) || { height: 20 }).height;
  const b = Math.round(Math.sin(BT.t / 5) * 2);
  bx.fillStyle = '#ffe066'; for (let i = 0; i < 5; i++) bx.fillRect(Math.round(x) - i, Math.round(top) - 10 + b - i, i * 2 + 1, 1);
  if (u.side === 'e') {
    const bxw = 150, X = 86, Y = 24;
    bx.globalAlpha = 0.92; bx.fillStyle = '#0a0612'; bx.fillRect(X, Y, bxw, 38); bx.globalAlpha = 1; bx.fillStyle = '#d0a8ff'; bx.fillRect(X, Y + 37, bxw, 1);
    txt(u.name, X + 4, Y + 2, { col: '#ffffff' });
    bx.fillStyle = '#2a1a24'; bx.fillRect(X + 4, Y + 15, 90, 4); bx.fillStyle = '#e85a4a'; bx.fillRect(X + 4, Y + 15, Math.round(90 * u.hp / u.mhp), 4);
    // escudo em losangos
    for (let i = 0; i < u.maxShield; i++) { const sx = X + 100 + i * 7, on = i < u.shield; bx.fillStyle = on ? '#8fe3ff' : '#2a3a4a'; bx.fillRect(sx + 2, Y + 13, 2, 1); bx.fillRect(sx + 1, Y + 14, 4, 1); bx.fillRect(sx, Y + 15, 6, 2); bx.fillRect(sx + 1, Y + 17, 4, 1); bx.fillRect(sx + 2, Y + 18, 2, 1); }
    // fraquezas: ícone se já descoberta, "?" se não
    txt('Fraco:', X + 4, Y + 23, { col: '#8a8099' });
    const kinds = ['fogo', 'gelo', 'luz', 'corte', 'mordida'];
    kinds.forEach((k, i) => { const ix = X + 44 + i * 16; if (u.known[k] === 'weak') bx.drawImage(ICON[k], ix, Y + 23); else if (u.known[k] === 'ok') { bx.globalAlpha = 0.25; bx.drawImage(ICON[k], ix, Y + 23); bx.globalAlpha = 1; } else txt('?', ix + 3, Y + 23, { col: '#5a5068' }); });
    if (u.broken > 0) txt('QUEBRADO', X + bxw - 4, Y + 2, { align: 'right', col: '#8fe3ff' });
  } else txt(u.name, Math.round(x), Math.round(top) - 22, { align: 'center', col: '#ffe066', shadow: true });
}
function drawWin() {
  const w = BT.win; w.t++;
  const a = Math.min(1, w.t / 20);
  bx.globalAlpha = 0.55 * a; bx.fillStyle = '#05030a'; bx.fillRect(0, 40, W, 92); bx.globalAlpha = 1;
  txt('VITÓRIA!', 120, 50 - (1 - a) * 20, { align: 'center', sz: 2, col: '#ffe066', shadow: true, alpha: a });
  const s = BT.stats, tt = Math.round(G.time - s.t0);
  if (w.t > 30) { txt(`Perfeitos: ${s.perf}   Certeiros: ${s.crit}   Quebras: ${s.quebra}`, 120, 84, { align: 'center', col: '#b8aecb' }); txt(`Tempo: ${Math.floor(tt / 60)}:${String(tt % 60).padStart(2, '0')}`, 120, 98, { align: 'center', col: '#8a8099' }); }
  if (w.t > 60 && w.t % 50 < 34) txt('A', 120, 116, { align: 'center', col: '#ffffff' });
}
