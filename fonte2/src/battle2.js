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
    tension: cfg.tension || 0, tensionShow: 0, menu: null, busy: false, queue: [], over: null, mode: G.flags.tempoAtivo ? 'ativo' : 'espera', sub: null,
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
  if (BT.busy) return;
  // menu aberto: o tempo quase para (ou para, no modo Espera); um inimigo pronto interrompe
  const slow = BT.menu ? (BT.mode === 'ativo' && !UI.top() && !BT.cursor && !BT.sub ? ATIVO_SLOW : 0) : 1;
  if (slow > 0) {
    for (const u of alive(BT.foes)) if (!u.broken && !(u.st.frio > 0 && BT.t % 2)) u.ct += u.spd * TIME_K * slow;
    if (!BT.menu) for (const u of alive(BT.party)) if (!u.preso && !((u.st.frio > 0 || u.st.molhado > 0) && BT.t % 2)) u.ct += u.spd * TIME_K;
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
  if (u.eqFx && u.eqFx.has('anel') && u.hp > 0) { BT.tension = Math.max(0, BT.tension - 5); }
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
  if (a.eqFx && a.eqFx.has('anel')) d *= 1.3;
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
  if (o.st && o.res !== 'perfeito') { m.st[o.st] = o.stT || 3; popNum(x, y - 20, ST_NAME[o.st], '#ffa94d'); if (o.st === 'tonto') m.ct = Math.max(0, m.ct - 35); }
  if (m.hp <= 0) { m.ct = 0; sfx('die'); burst(x, y, 16, ['#ff6b6b', '#ffffff']); callout(m.name + ' caiu!', '#ff6b6b', 70); }
  else sfx('hurt');
  return d;
}
const ST_NAME = { queimado: 'QUEIMADO', frio: 'GELADO', tonto: 'TONTO', vela: 'VELA', molhado: 'MOLHADO', preso: 'PRESO' };

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
    if (BT.menu) BT.menu.hidden = false;   // nunca deixar o menu escondido quando é a vez de escolher
    const c = await wheelPick(m);
    if (c === null) continue;
    BT.lastCmd = BT.lastCmd || {}; BT.lastCmd[m.id] = BT.menu.idx;
    // um erro num golpe nunca pode travar a luta: a vez passa e o jogo segue
    let done; try { done = await doCommand(m, c); } catch (e) { console.error(e); BT.busy = false; m.ox = 0; m.oy = 0; m.rot = 0; endTurn(m, 'normal'); done = true; }
    if (done) break;
  }
  BT.menu = null;
}
function wheelPick(m) {
  return new Promise(r => { BT.menu.pick = r; });
}
function menuInput() {
  const M = BT.menu; if (!M || M.hidden || BT.busy || UI.top() || BT.cursor) return;
  if (BT.sub) {
    const S = BT.sub, n = S.items.length;
    if (navp('down')) { S.idx = (S.idx + 1) % n; sfx('move'); }
    if (navp('up')) { S.idx = (S.idx + n - 1) % n; sfx('move'); }
    if (btnp('a')) { if (S.items[S.idx].disabled) { sfx('cancel'); callout(S.items[S.idx].why || 'Ainda não dá', '#ff8a9a', 40); } else { sfx('select'); BT.sub = null; S.r(S.idx); } }
    else if (btnp('b')) { sfx('cancel'); BT.sub = null; S.r(-1); }
    return;
  }
  const cs = cmdsFor(M.m);
  if (navp('down')) { M.idx = (M.idx + 1) % cs.length; sfx('move'); }
  if (navp('up')) { M.idx = (M.idx + cs.length - 1) % cs.length; sfx('move'); }
  if (btnp('a')) { const c = cs[M.idx]; if (c.need && !c.need()) { sfx('cancel'); callout(c.why || 'Precisa de 100 de Tensão', '#ff6b6b', 40); return; } sfx('select'); const p = M.pick; M.pick = null; p && p(c.k); }
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
function subList(title, items) {
  return new Promise(r => { BT.sub = { title, items, idx: Math.max(0, items.findIndex(i => !i.disabled)), scroll: 0, r }; });
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
    const ts = m.techs.map(tk => { const T = TECH2[tk]; return { k: tk, label: T.nm, right: T.cost + 'T', disabled: BT.tension < T.cost, why: 'Precisa de ' + T.cost + ' de Tensão', d: T.d }; });
    const i = await subList('Técnicas', ts); if (i < 0) return false;
    const T = TECH2[ts[i].k];
    const t = T.tgt === 'self' ? m : T.tgt === 'all' ? 'all' : T.tgt === 'ally' ? await pickTarget('p', { pref: m }) : await pickTarget('e', { pref: BT.lastTarget });
    if (!t) return false;
    BT.tension -= T.cost; await act(m, () => T.run(m, t)); endTurn(m, T.w || 'normal'); return true;
  }
  if (k === 'runas') {
    const rs = m.runas.map(rk => { const S = RUNA2[rk]; return { k: rk, label: S.nm, right: S.mp + 'PM', disabled: m.mp < S.mp, why: 'PM insuficiente', d: S.d }; });
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
      return { k: dk, label: D.nm, right: '50T', disabled: !ok, why: BT.tension < 50 ? 'Precisa de 50 de Tensão' : (p && p.hp > 0 ? p.name + ' ainda não está quase na vez' : 'Parceiro caído'), d: D.d + (p && p.hp > 0 && p.ct < 50 ? ' (' + p.name + ' ainda não está quase na vez.)' : '') };
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
    const L0 = -(BTV.ox || 0), RW = BTV.w || 240;
    bx.globalAlpha = 0.65 * a; bx.fillStyle = '#05030a'; bx.fillRect(L0, -40, RW, H + 80); bx.globalAlpha = 1;
    const sl = ease.out(Math.min(1, p / 0.25)) * (p > 0.85 ? 1 - (p - 0.85) / 0.15 * 1.5 : 1);
    bx.save(); bx.globalAlpha = a; bx.fillStyle = col; bx.beginPath(); bx.moveTo(L0 - 20, 72); bx.lineTo(L0 + RW + 20, 48); bx.lineTo(L0 + RW + 20, 110); bx.lineTo(L0 - 20, 134); bx.fill();
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
  // Sapatilha de Palco: às vezes desvia sozinha de golpes rápidos
  const auto = o.fast && t.eqFx && t.eqFx.has('esquiva') && Math.random() < 0.3;
  const res = auto ? 'perfeito' : await defenseRing(t, o.n || 34, o);
  if (auto) callout(t.name + ' desvia!', '#8fe3ff', 40);
  let mult = res === 'perfeito' ? 0.12 : res === 'bom' ? 0.5 : 1;
  if (o.el === 'agua' && t.eqFx && t.eqFx.has('agua')) mult *= 0.5;
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
  const c = await choose(BT.cfg.loseTxt || '* O grupo caiu. Tentar de novo?', ['Tentar de novo', BT.cfg.quitLabel || 'Desistir (volta ao título)']);
  BT.on = false; BT.done(c === 0 ? 'retry' : 'quit');
}

// ---------- desenho (v3: campo limpo no meio; grupo, comandos e informação em painéis fixos) ----------
// Tela larga (celular deitado): cartões do grupo na lateral esquerda, comandos na lateral direita.
// Tela estreita: cartões numa faixa embaixo e comandos no canto direito do campo.
const BTV = { ox: 0, w: 240, dy: 24, lados: false };
function drawBattle2() {
  bx.imageSmoothingEnabled = false;
  const WF = W, OX = Math.floor((WF - 240) / 2), lados = OX >= 110, DY = lados ? 24 : 18;
  Object.assign(BTV, { ox: OX, w: WF, dy: DY, lados });
  let sx = 0, sy = 0; if (BT.shake > 0) { BT.shake--; sx = Math.round(rand(-BT.shakeA, BT.shakeA)); sy = Math.round(rand(-BT.shakeA, BT.shakeA)); }
  // fundo: o cenário no meio, espelhado nas laterais e escurecendo para as bordas; o chão continua para baixo
  const bg = BT.bgfn();
  bx.fillStyle = '#05030a'; bx.fillRect(0, 0, WF, H);
  const by = 12 + DY + sy;
  bx.save(); bx.translate(OX + sx, 0);
  bx.drawImage(bg, 0, by);
  bx.drawImage(bg, 0, bg.height - 2, 240, 2, 0, by + bg.height - 1, 240, H - by - bg.height + 1);
  if (OX > 0) for (const d of [-1, 1]) { bx.save(); bx.translate(d < 0 ? 0 : 480, 0); bx.scale(-1, 1); bx.drawImage(bg, 0, by); bx.drawImage(bg, 0, bg.height - 2, 240, 2, 0, by + bg.height - 1, 240, H - by - bg.height + 1); bx.restore(); }
  bx.restore();
  if (OX > 0) { const g = bx.createLinearGradient(0, 0, OX, 0); g.addColorStop(0, 'rgba(5,3,10,0.82)'); g.addColorStop(1, 'rgba(5,3,10,0)'); bx.fillStyle = g; bx.fillRect(0, 0, OX, H); const g2 = bx.createLinearGradient(OX + 240, 0, WF, 0); g2.addColorStop(0, 'rgba(5,3,10,0)'); g2.addColorStop(1, 'rgba(5,3,10,0.82)'); bx.fillStyle = g2; bx.fillRect(OX + 240, 0, WF - OX - 240, H); }
  bx.fillStyle = 'rgba(5,3,10,0.55)'; bx.fillRect(0, 0, WF, by);
  if (BT.cfg.noite) { bx.fillStyle = 'rgba(10,16,52,0.5)'; bx.fillRect(0, 0, WF, H); }
  // campo de batalha em coordenadas locais (0..240)
  bx.save(); bx.translate(OX + sx, DY + sy); W = 240; TXO.x = OX; TXO.y = DY;
  // soco de câmera: zoom curtinho no ponto do golpe forte
  if (BT.zoom && BT.zoom.k > 0.002) { const z = 1 + BT.zoom.k, Z = BT.zoom; bx.translate(Z.x, Z.y); bx.scale(z, z); bx.translate(-Z.x, -Z.y); if (BT.stop <= 0) Z.k *= 0.82; }
  if (BT.cfg.bgAnim) BT.cfg.bgAnim();
  const all = [...BT.foes.filter(u => !u.gone), ...BT.party].sort((a, b) => a.y - b.y);
  const M = BT.menu, ativo = M && !M.hidden && !BT.busy ? M.m : null;
  if (ativo) { const p = (BT.t % 40) / 40; bx.globalAlpha = 0.8; bx.strokeStyle = UIC.line; bx.beginPath(); bx.ellipse(ativo.x, ativo.y, 12 + p * 4, 3 + p, 0, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; }
  for (const u of all) drawUnit(u);
  if (BT.ring) drawRing();
  if (BT.prompt) drawPrompt();
  for (let i = BT.anims.length - 1; i >= 0; i--) {
    const a = BT.anims[i]; const p = Math.min(1, a.k / a.n);
    a.fn(p, a.k);
    if (BT.stop <= 0) a.k++;
    if (a.k > a.n) { BT.anims.splice(i, 1); a.r(); }
  }
  for (const p of BT.parts) {
    bx.globalAlpha = Math.min(1, (p.life - p.t) / 10) * (p.brasa ? 0.6 + 0.4 * Math.sin(p.t * 0.9) : 1);
    if (p.risco) { bx.strokeStyle = p.col; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(Math.round(p.x) + 0.5, Math.round(p.y) + 0.5); bx.lineTo(Math.round(p.x - p.vx * p.risco) + 0.5, Math.round(p.y - p.vy * p.risco) + 0.5); bx.stroke(); }
    else { bx.fillStyle = p.col; bx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz); }
  }
  bx.globalAlpha = 1;
  for (const n of BT.nums) {
    const k = n.t, y = n.y - (k < 10 ? ease.back(k / 10) * 10 : 10 + (k - 10) * 0.15);
    txt(n.s, n.x, Math.round(y), { align: 'center', col: n.col, sz: n.big ? 1.5 : 1, shadow: true, alpha: k > 45 ? (60 - k) / 15 : 1 });
  }
  if (BT.cursor) seta(BT.cursor);
  if (BT.win) drawWin();
  bx.restore(); W = WF; TXO.x = 0; TXO.y = 0;
  if (BT.flash > 0) { bx.fillStyle = '#ffffff'; bx.globalAlpha = BT.flash / 4; bx.fillRect(0, 0, WF, H); bx.globalAlpha = 1; BT.flash--; }
  // painéis (coordenadas da tela)
  if (!BT.dim) {
    drawTimeline(OX); drawTension(OX, lados); drawHUD(OX, lados);
    if (M && !M.hidden && !BT.busy && !UI.top() && !BT.cursor) drawComandos(M, OX, lados);
    drawInfo(OX, lados);
  }
  if (BT.call) { const c = BT.call, a = Math.min(1, c.t / 6, (c.n - c.t) / 10), w = lineW(rich(c.s)) + 18, y = 25; bx.globalAlpha = a; box(OX + 120 - w / 2, y, w, 15, { bw: 1, edge: c.col }); bx.globalAlpha = 1; txt(c.s, OX + 120, y + 2, { align: 'center', col: c.col, alpha: a }); }
  if (BT.hint && !BT.call) { const h = BT.hint, a = Math.min(1, h.t / 10, (h.n - h.t) / 10), nl = wrapRich(rich(h.s), 36).length; bx.globalAlpha = a; box(OX + 6, 25, 228, nl * 11 + 8, { edge: '#8fe3ff' }); bx.globalAlpha = 1; txt(h.s, OX + 12, 29, { w: 36, col: '#d8f6ff', alpha: a, lh: 11 }); }
  if (BT.lose) { BT.lose.t++; bx.globalAlpha = Math.min(0.6, BT.lose.t / 60); bx.fillStyle = '#200008'; bx.fillRect(0, 0, WF, H); bx.globalAlpha = 1; }
  menuInput(); cursorInput();
  if (BT.waitA && btnp('a')) { const r = BT.waitA; BT.waitA = null; r(); }
}
// seta do alvo, quicando sobre a cabeça (campo local)
function seta(C) {
  const u = C.list[C.idx]; if (!u) return;
  const [x] = unitCenter(u), top = u.y + u.oy - (unitFrame(u) || { height: 20 }).height, b = Math.round(Math.sin(BT.t / 5) * 2);
  const col = u.side === 'e' ? UIC.accent : '#9be58a';
  bx.fillStyle = '#000'; for (let i = 0; i < 6; i++) bx.fillRect(Math.round(x) - i - 1, Math.round(top) - 9 + b - i, i * 2 + 3, 1);
  bx.fillStyle = col; for (let i = 0; i < 5; i++) bx.fillRect(Math.round(x) - i, Math.round(top) - 10 + b - i, i * 2 + 1, 1);
}
// --- ordem de vez (topo, no meio): quem age AGORA bem grande, e os próximos ---
function drawTimeline(OX) {
  const order = predictOrder(6), x0 = OX + 120 - (20 + 5 * 17) / 2;
  bx.fillStyle = 'rgba(5,3,10,0.6)'; bx.fillRect(OX, 0, 240, 22);
  let firstCharge = true;
  order.forEach((u, i) => {
    const cur = i === 0, sz = cur ? 18 : 14, x = cur ? x0 : x0 + 20 + (i - 1) * 17 + 2, y = cur ? 2 : 4;
    const ch = u.side === 'e' && u.charge && firstCharge;
    const edge = ch ? '#ff6b6b' : u.side === 'p' ? (u.col || UIC.line) : '#b89ad8';
    bx.globalAlpha = cur ? 1 : 0.85 - i * 0.08;
    bx.fillStyle = edge; bx.fillRect(x - 1, y - 1, sz + 2, sz + 2); bx.fillStyle = '#140e1e'; bx.fillRect(x, y, sz, sz);
    bx.drawImage(miniIcon(u), 0, 0, 14, 14, x + (cur ? 2 : 0), y + (cur ? 2 : 0), 14, 14);
    bx.globalAlpha = 1;
    if (ch) { firstCharge = false; bx.fillStyle = '#ff6b6b'; bx.fillRect(x + sz - 3, y - 2, 4, 6); bx.fillStyle = '#ffffff'; bx.fillRect(x + sz - 2, y - 1, 2, 3); bx.fillRect(x + sz - 2, y + 3, 2, 1); }
    if (cur) { bx.fillStyle = UIC.accent; bx.fillRect(x + 5, y + sz + 1, 8, 1); }
  });
  txt('AGORA', x0 - 4, 5, { align: 'right', col: '#8a9aa8' });
}
// --- Tensão: barra horizontal em 4 gomos (cada gomo = 25) ---
function drawTension(OX, lados) {
  const v = BT.tensionShow / 100, full = BT.tension >= 100;
  const x = lados ? 6 : OX + 4, y = lados ? 6 : 206, w = lados ? Math.min(124, OX - 12) : 60;
  if (!lados) { bx.fillStyle = 'rgba(5,3,10,0.6)'; bx.fillRect(OX + 4, 24, 48, 9); bx.fillStyle = full ? (BT.t % 10 < 5 ? '#ffffff' : '#ffe066') : '#ffa94d'; bx.fillRect(OX + 5, 25, Math.round(46 * v), 7); txt('T' + Math.floor(BT.tension), OX + 55, 23, { col: '#ffb86a' }); return; }
  txt('TENSÃO', x, y - 1, { col: full ? '#ffe066' : '#ffb86a' });
  txt(String(Math.floor(BT.tension)), x + w, y - 1, { align: 'right', col: full ? '#ffe066' : '#c8b8a0' });
  const bw = (w - 6) / 4;
  for (let i = 0; i < 4; i++) {
    const gx = Math.round(x + i * (bw + 2)), f = Math.max(0, Math.min(1, v * 4 - i));
    bx.fillStyle = 'rgba(255,169,77,0.16)'; bx.fillRect(gx, y + 11, Math.round(bw), 5);
    bx.fillStyle = full ? (BT.t % 10 < 5 ? '#ffffff' : '#ffe066') : '#ffa94d'; bx.fillRect(gx, y + 11, Math.round(bw * f), 5);
    if (f > 0) { bx.fillStyle = 'rgba(255,255,255,0.4)'; bx.fillRect(gx, y + 11, Math.round(bw * f), 1); }
  }
  if (full && BT.t % 30 < 20) txt('SUPER pronto!', x, y + 18, { col: '#ffe066' });
}
// --- cartões do grupo ---
function drawHUD(OX, lados) {
  BT.party.forEach((m, i) => {
    let x, y, w, h;
    if (lados) { w = Math.min(126, OX - 10); x = OX - w - 4 < 6 ? 6 : 6; y = 36 + i * 32; h = 30; }
    else { w = 78; x = OX + 1 + i * 79; y = 204; h = 34; }
    const active = BT.menu && BT.menu.m === m && !BT.menu.hidden && !BT.busy, mirado = BT.cursor && BT.cursor.list[BT.cursor.idx] === m;
    const edge = mirado ? '#9be58a' : active ? UIC.accent : m.hp <= 0 ? '#6a3040' : undefined;
    box(x, y, w, h, { edge, fill: active ? 'rgba(40,20,40,0.88)' : undefined });
    const P = PT(m.port), sh = m.flash > 0 ? Math.round(rand(-1, 1)) : 0;
    bx.globalAlpha = m.hp <= 0 ? 0.35 : 1; bx.drawImage(P, 0, 0, 32, 32, x + 3 + sh, y + 3, 22, 22); bx.globalAlpha = 1;
    if (m.hp > 0 && m.hp < m.mhp * 0.3 && BT.t % 40 < 20) { bx.fillStyle = 'rgba(255,60,60,0.3)'; bx.fillRect(x + 3, y + 3, 22, 22); }
    const tx = x + 28, bw = w - 32;
    txt(m.short || m.name, tx, y + 1, { col: active ? '#ffffff' : '#c8d4dc' });
    if (lados) txt(String(m.hp), x + w - 4, y + 1, { align: 'right', col: m.hp <= 0 ? '#ff6b6b' : m.hp < m.mhp * 0.3 ? '#ffb0b0' : '#ffffff' });
    const hp = m.hp / m.mhp, tr = m.trail / m.mhp;
    bx.fillStyle = 'rgba(95,255,176,0.12)'; bx.fillRect(tx, y + 14, bw, 4);
    bx.fillStyle = '#c83a3a'; bx.fillRect(tx, y + 14, Math.round(bw * tr), 4);
    bx.fillStyle = hp > 0.5 ? '#5fffb0' : hp > 0.25 ? '#ffd060' : '#ff6b6b'; bx.fillRect(tx, y + 14, Math.round(bw * hp), 4);
    bx.fillStyle = 'rgba(255,255,255,0.35)'; bx.fillRect(tx, y + 14, Math.round(bw * hp), 1);
    for (let k = 1; k < 10; k++) { bx.fillStyle = 'rgba(5,3,10,0.6)'; bx.fillRect(tx + Math.round(bw * k / 10), y + 14, 1, 4); }
    if (m.mmp) { bx.fillStyle = 'rgba(90,138,232,0.18)'; bx.fillRect(tx, y + 20, bw, 2); bx.fillStyle = '#7aa8ff'; bx.fillRect(tx, y + 20, Math.round(bw * m.mp / m.mmp), 2); }
    // barra de vez: enche até a vez da pessoa
    const ct = Math.max(0, Math.min(1, m.ct / 100)), ready = ct >= 1 || active;
    bx.fillStyle = 'rgba(255,255,255,0.08)'; bx.fillRect(tx, y + 24, bw, 3);
    bx.fillStyle = ready ? (BT.t % 8 < 4 ? '#ffffff' : '#ffe066') : (m.col || UIC.line); bx.fillRect(tx, y + 24, Math.round(bw * (active ? 1 : ct)), 3);
    // estados por cima do retrato
    let sx = x + 3; for (const k of ['queimado', 'frio', 'tonto', 'vela', 'molhado', 'preso']) if (m.st[k] > 0 || (k === 'preso' && m.preso)) { bx.drawImage(ICON[k === 'frio' ? 'congelado' : k === 'vela' ? 'luz' : k], sx, y + h - 13); sx += 9; }
    if (m.def0) bx.drawImage(ICON.defender, sx, y + h - 13);
    if (m.row === 'back') { bx.fillStyle = 'rgba(143,227,216,0.5)'; bx.fillRect(x + 1, y + 4, 1, h - 8); }
  });
}
// --- comandos: lista vertical com ícone e nome; técnicas/runas/itens abrem no mesmo painel ---
function drawComandos(M, OX, lados) {
  const m = M.m, S = BT.sub;
  const w = lados ? Math.min(126, OX - 10) : 100, x = lados ? W - w - 6 : OX + 240 - w - 2, y = lados ? 32 : 26;
  const items = S ? S.items.map(it => ({ label: it.label, right: it.right, dis: it.disabled, ic: null }))
    : cmdsFor(m).map(c => ({ label: c.k === 'atacar' ? (m.atkNm || 'Atacar') : c.nmF ? c.nmF(m) : c.nm, ic: c.ic(m), dis: c.need && !c.need(), sup: c.k === 'super' }));
  const idx = S ? S.idx : M.idx, maxV = lados ? 9 : 7;
  if (S) { if (idx < S.scroll) S.scroll = idx; if (idx >= S.scroll + maxV) S.scroll = idx - maxV + 1; }
  const off = S ? S.scroll : 0, n = Math.min(maxV, items.length), h = 18 + n * 13 + 3;
  box(x, y, w, h, { edge: UIC.accent });
  tagNome(x + 4, y + 3, S ? S.title : 'Vez de ' + (m.short || m.name), S ? UIC.line : (m.col || UIC.accent));
  if (S) txt('B volta', x + w - 4, y + 4, { align: 'right', col: '#7a8a98' });
  for (let i = 0; i < n; i++) {
    const k = i + off, it = items[k], yy = y + 19 + i * 13, sel = k === idx;
    if (sel) { bx.fillStyle = UIC.sel; bx.fillRect(x + 2, yy - 1, w - 4, 13); setaSel(x + 3, yy); }
    let tx = x + 10;
    if (it.ic && ICON[it.ic]) { bx.globalAlpha = it.dis ? 0.35 : 1; bx.drawImage(ICON[it.ic], tx, yy); bx.globalAlpha = 1; tx += 15; }
    txt(it.label, tx, yy, { col: it.dis ? '#5a6070' : sel ? '#ffffff' : '#b8c8d0' });
    if (it.right) txt(it.right, x + w - 5, yy, { align: 'right', col: it.dis ? '#5a6070' : '#ffb86a' });
    if (it.sup && !it.dis && BT.t % 20 < 10) { bx.fillStyle = '#ffe066'; bx.fillRect(x + w - 8, yy + 4, 3, 3); }
  }
  if (S && items.length > maxV) txt((idx + 1) + '/' + items.length, x + w - 5, y + h - 1, { align: 'right', col: '#7a8a98' });
}
// --- barra de informação (embaixo, no meio): o que o comando faz, ou a ficha do alvo ---
function drawInfo(OX, lados) {
  const x = OX + 8, w = 224, y = lados ? 204 : 168, h = 32;
  const C = BT.cursor, M = BT.menu, S = BT.sub;
  if (C) {
    const u = C.list[C.idx]; if (!u) return;
    box(x, y, w, h, { edge: u.side === 'e' ? UIC.accent : '#9be58a' });
    txt(u.name, x + 6, y + 3, { col: '#ffffff' });
    const hb = 96; bx.fillStyle = 'rgba(255,107,107,0.15)'; bx.fillRect(x + 6, y + 18, hb, 4); bx.fillStyle = u.side === 'e' ? '#ff6b8a' : '#5fffb0'; bx.fillRect(x + 6, y + 18, Math.round(hb * u.hp / u.mhp), 4);
    if (u.side !== 'e') { txt(u.hp + '/' + u.mhp, x + 108, y + 14, { col: '#c8d4dc' }); return; }
    // escudo (losangos): zere com golpes da fraqueza para QUEBRAR
    for (let i = 0; i < u.maxShield; i++) { const sx = x + 108 + i * 7, on = i < u.shield; bx.fillStyle = on ? '#8fe3ff' : 'rgba(143,227,255,0.18)'; bx.fillRect(sx + 2, y + 15, 2, 1); bx.fillRect(sx + 1, y + 16, 4, 1); bx.fillRect(sx, y + 17, 6, 2); bx.fillRect(sx + 1, y + 19, 4, 1); bx.fillRect(sx + 2, y + 20, 2, 1); }
    if (u.broken > 0) txt('QUEBRADO: dano x2', x + w - 6, y + 3, { align: 'right', col: '#8fe3ff' });
    else txt('Fraco a', x + w - 6 - 5 * 13 - 4, y + 3, { align: 'right', col: '#7a8a98' });
    ['fogo', 'gelo', 'luz', 'corte', 'mordida'].forEach((k, i) => { if (u.broken > 0) return; const ix = x + w - 6 - (5 - i) * 13; if (u.known[k] === 'weak') bx.drawImage(ICON[k], ix, y + 3); else if (u.known[k] === 'ok') { bx.globalAlpha = 0.22; bx.drawImage(ICON[k], ix, y + 3); bx.globalAlpha = 1; } else txt('?', ix + 3, y + 3, { col: '#4a5260' }); });
    if (u.charge) txt('! golpe preparado', x + w - 6, y + 17, { align: 'right', col: '#ff6b6b' });
    return;
  }
  if (!M || M.hidden || BT.busy || UI.top()) return;
  let d = '';
  if (S) d = S.items[S.idx] && S.items[S.idx].d;
  else { const c = cmdsFor(M.m)[M.idx]; d = c && (typeof c.desc === 'function' ? c.desc(M.m) : c.desc); }
  if (!d) return;
  const nl = Math.min(3, wrapRich(rich(d), 36).length);
  box(x, y + h - (nl * 10 + 8), w, nl * 10 + 8, { bw: 1 });
  txt(d, x + 6, y + h - (nl * 10 + 8) + 4, { w: 36, col: '#c8d4dc', lh: 10 });
}
function drawUnit(u) {
  if (u.sumiu) return;
  desenhaRastro(u);
  const a = u.alpha ?? 1; if (a <= 0) return;
  const fr = unitFrame(u); if (!fr) return;
  const w = fr.width * (u.sx || 1), h = fr.height * (u.sy || 1);
  const X = Math.round(u.x + u.ox - w / 2), Y = Math.round(u.y + u.oy - h);
  u._X = X; u._Y = Y; u._sx = u.sx || 1; u._sy = u.sy || 1; u._fw = fr.width; u._fh = fr.height;
  // sombra (fica no chão: encolhe quando o lutador pula)
  const alt = Math.max(0, -(u.oy || 0) - (u.baseOy || 0)), sk = Math.max(0.35, 1 - alt / 60);
  bx.globalAlpha = 0.35 * a * sk; bx.fillStyle = '#000'; const sw = (u.fly ? (u.R ? u.R.w : fr.width) * 0.4 : (u.R ? u.R.w : fr.width) * 0.7) * sk; bx.fillRect(Math.round(u.x + u.ox - sw / 2), Math.round(u.y + (u.fly ? u.fly : 0) + Math.min(0, (u.oy || 0) + alt)) - 1, Math.round(sw), 3); bx.globalAlpha = a;
  if (u.side === 'p' && u.hp <= 0) bx.globalAlpha = 0.45;
  const rot = u.rot || 0;
  if (rot) { bx.save(); const cx = X + w / 2, cy = Y + h / 2; bx.translate(cx, cy); bx.rotate(rot); bx.translate(-cx, -cy); }
  if (u.under) u.under(u, X, Y, w, h);
  bx.drawImage(fr, X, Y, Math.round(w), Math.round(h));
  if (u.flash > 0 && u.flash % 4 < 2) { const c = whiteOf(fr); bx.drawImage(c, X, Y, Math.round(w), Math.round(h)); }
  if (u.over) u.over(u, X, Y, w, h);
  if (rot) bx.restore();
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

function predictOrder(n = 8) {
  const sim = [...alive(BT.party), ...alive(BT.foes)].map(u => ({ u, ct: u.ct, spd: u.preso ? 0 : u.spd * (u.st.frio > 0 || u.st.molhado > 0 ? 0.5 : 1), br: u.broken || 0 }));
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
function drawWin() {
  const w = BT.win; w.t++;
  const a = Math.min(1, w.t / 20);
  bx.globalAlpha = 0.55 * a; bx.fillStyle = '#05030a'; bx.fillRect(0, 40, W, 92); bx.globalAlpha = 1;
  txt('VITÓRIA!', 120, 50 - (1 - a) * 20, { align: 'center', sz: 2, col: '#ffe066', shadow: true, alpha: a });
  const s = BT.stats, tt = Math.round(G.time - s.t0);
  if (w.t > 30) { txt(`Perfeitos: ${s.perf}   Certeiros: ${s.crit}   Quebras: ${s.quebra}`, 120, 84, { align: 'center', col: '#b8aecb' }); txt(`Tempo: ${Math.floor(tt / 60)}:${String(tt % 60).padStart(2, '0')}`, 120, 98, { align: 'center', col: '#8a8099' }); }
  if (w.t > 60 && w.t % 50 < 34) txt('A', 120, 116, { align: 'center', col: '#ffffff' });
}
