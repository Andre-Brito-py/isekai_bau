// ================= MUNDO DA T2: andar, seguidores, pessoas, baús, portas, inimigos no mapa =================
const MAPS2 = {};
const KEY2 = {           // legenda padrão dos tiles
  '.': { t: 'tab' }, 'p': { t: 'tabV' }, ',': { t: 'pedra' }, ';': { t: 'grama' }, '_': { t: 'lodo' }, '=': { t: 'escada' },
  '~': { t: 'agua', water: true }, '>': { t: 'corr', v: 0, water: true, push: 'right' }, 'v': { t: 'corr', v: 1, water: true, push: 'down' },
  '<': { t: 'corr', v: 2, water: true, push: 'left' }, '^': { t: 'corr', v: 3, water: true, push: 'up' },
  '#': { t: 'muro', solid: true }, ' ': { t: 'escuro', solid: true }, 'x': { t: 'tab', solid: true }, 'X': { t: 'pedra', solid: true }
};
const W2 = { map: null, id: null, x: 0, y: 0, px: 0, py: 0, dir: 'down', mv: null, t: 0, fol: [], float: false, idle: 0, ents: [], toast: null, sus: 0, cam: [0, 0] };
const DIR2 = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// ---------- carregar mapa ----------
function tileOf(m, x, y) { if (x < 0 || y < 0 || x >= m.w || y >= m.h) return KEY2[' ']; const ch = m.rows[y][x]; return (m.key && m.key[ch]) || KEY2[ch] || KEY2['.']; }
function bakeMap(m) {
  if (m.baked) return;
  m.h = m.rows.length; m.w = m.rows[0].length;
  const c = mk(m.w * TS, m.h * TS), x = c.getContext('2d');
  for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
    const T = tileOf(m, tx, ty);
    if (T.water) continue;   // água é desenhada a cada quadro (anima)
    x.drawImage(tileArt(T.t, T.v ?? (hash(tx, ty, 3) % 3), 0), tx * TS, ty * TS);
  }
  m.baked = c;
  // água: lista de tiles + sombra das tábuas por cima e as estacas do cais
  m.water = []; for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) { const T = tileOf(m, tx, ty); if (T.water) m.water.push([tx, ty, T, !tileOf(m, tx, ty - 1).water && ty > 0]); }
}
function loadMap2(id, x, y, dir) {
  const m = MAPS2[id]; bakeMap(m);
  Object.assign(W2, { map: m, id, x, y, px: x * TS, py: y * TS, dir: dir || W2.dir, mv: null, float: !!tileOf(m, x, y).water });
  W2.ents = (m.ents || []).filter(e => !(e.gone && e.gone()) && !(e.t === 'foe' && G.gone2[id + ':' + e.id])).map(e => Object.assign({ px: e.x * TS, py: e.y * TS, dir: e.dir || 'down', mv: null, t0: Math.random() * 100, wait: 60 + Math.random() * 120, home: [e.x, e.y] }, e));
  W2.fol = [];
  if (!W2.float) for (const k of partyKeys().slice(1)) W2.fol.push({ k, x, y, px: x * TS, py: y * TS, dir: W2.dir, mv: null });
  G.pos = { map: id, x, y, dir: W2.dir };
  W2.toast = { s: m.name, t: 0 };
  if (m.music) playMusic(m.music);
}
function partyKeys() { return ['bau', 'lume', 'rita'].filter(k => k === 'bau' || G.flags['tem_' + k] !== false); }

// ---------- colisão ----------
function propSolid(m, x, y) { for (const pr of m.props || []) for (const [sx, sy, w, h] of pr.solid || []) if (x >= sx && x < sx + w && y >= sy && y < sy + h) return true; return false; }
function entAt2(x, y) { return W2.ents.find(e => !e.passa && ((e.mv ? e.mv.tx : e.x) === x && (e.mv ? e.mv.ty : e.y) === y || (e.x === x && e.y === y))); }
function canStand(x, y, who) {
  const m = W2.map, T = tileOf(m, x, y);
  if (T.solid || propSolid(m, x, y)) return false;
  if (T.water && !(who === 'player' && G.flags.boiar)) return false;
  if (who === 'player') { const e = entAt2(x, y); if (e && e.t !== 'foe' && e.t !== 'door' && e.t !== 'trig') return false; }
  else { if (W2.x === x && W2.y === y) return false; const e = entAt2(x, y); if (e && e !== who) return false; }
  return true;
}

// ---------- atualizar ----------
function worldBusy2() { return V.busy2 > 0 || UI.stack.length > 0 || V.tw; }
function run2(fn) { V.busy2 = (V.busy2 || 0) + 1; return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => { V.busy2--; }); }
function stepTween(o, n = 8) { const m = o.mv; m.k++; const p = Math.min(1, m.k / (n * (m.fx !== m.tx && m.fy !== m.ty ? 1.41 : 1))); o.px = (m.fx + (m.tx - m.fx) * p) * TS; o.py = (m.fy + (m.ty - m.fy) * p) * TS; if (p >= 1) { o.x = m.tx; o.y = m.ty; o.mv = null; return true; } return false; }
function startMove(o, tx, ty) { o.mv = { fx: o.x, fy: o.y, tx, ty, k: 0 }; }
function updateWorld2() {
  W2.t++;
  if (typeof passaTempo === 'function') passaTempo();
  if (W2.toast && ++W2.toast.t > 150) W2.toast = null;
  // seguidores andam sempre (mesmo com diálogo aberto, terminam o passo)
  for (const f of W2.fol) if (f.mv) stepTween(f);
  for (const e of W2.ents) updateEnt(e);
  if (W2.mv) {
    if (stepTween(W2, (W2.float ? 10 : 8) * (JOYMAG < 0.55 ? 1.6 : 1))) arrived();
    return;
  }
  if (worldBusy2()) { W2.idle = 0; return; }
  if (btnp('menu')) { run2(menuGrupo); return; }
  if (btnp('a')) { const [dx, dy] = DIR2[W2.dir], e = entAt2(W2.x + dx, W2.y + dy) || W2.ents.find(q => q.big && q.x <= W2.x + dx && W2.x + dx < q.x + q.big[0] && q.y - q.big[1] < W2.y + dy && W2.y + dy <= q.y); if (e && e.talk) { if (e.t === 'npc') e.dir = ({ up: 'down', down: 'up', left: 'right', right: 'left' })[W2.dir]; run2(() => e.talk(e)); return; } }
  const d = ['up', 'down', 'left', 'right'].find(k => KEYS[k]);
  if (!d) { W2.idle++; return; }
  W2.idle = 0;
  // diagonais: duas direções ao mesmo tempo. Sem cortar quina de parede; se a diagonal estiver fechada, desliza pelo eixo livre
  const h = KEYS.left && !KEYS.right ? -1 : KEYS.right && !KEYS.left ? 1 : 0, v = KEYS.up && !KEYS.down ? -1 : KEYS.down && !KEYS.up ? 1 : 0;
  if (h && v) {
    const okH = canStand(W2.x + h, W2.y, 'player'), okV = canStand(W2.x, W2.y + v, 'player');
    W2.dir = h > 0 ? 'right' : 'left';
    if (okH && okV && canStand(W2.x + h, W2.y + v, 'player')) { tryStep(W2.x + h, W2.y + v); return; }
    if (okH) { tryStep(W2.x + h, W2.y); return; }
    if (okV) { W2.dir = v > 0 ? 'down' : 'up'; tryStep(W2.x, W2.y + v); return; }
    if (W2.t % 16 === 0) sfx('bump'); return;
  }
  W2.dir = d;
  const [dx, dy] = DIR2[d], nx = W2.x + dx, ny = W2.y + dy;
  if (!canStand(nx, ny, 'player')) { if (W2.t % 16 === 0) sfx('bump'); return; }
  tryStep(nx, ny);
}
function tryStep(nx, ny) {
  const wasFloat = W2.float, toWater = !!tileOf(W2.map, nx, ny).water;
  // seguidores: cada um vai para onde estava o da frente
  if (!wasFloat && !toWater) { let px = W2.x, py = W2.y; for (const f of W2.fol) { const ox = f.x, oy = f.y; if (ox !== px || oy !== py) { f.dir = px > ox ? 'right' : px < ox ? 'left' : py > oy ? 'down' : 'up'; startMove(f, px, py); } px = ox; py = oy; } }
  if (!wasFloat && toWater) { sfx('splash'); for (const f of W2.fol) startMove(f, W2.x, W2.y); W2.entering = 8; }
  startMove(W2, nx, ny);
  onMoveStart();
}
function arrived() {
  const m = W2.map, T = tileOf(m, W2.x, W2.y);
  // entrar / sair da água
  if (T.water && !W2.float) { W2.float = true; W2.fol = []; if (!G.flags.tutBoiar) { G.flags.tutBoiar = true; run2(async () => { await say('* A Lume e a Rita pulam para dentro do baú. Lá dentro é maior do que parece. Ninguém comenta. Por enquanto.'); }); } }
  else if (!T.water && W2.float) { W2.float = false; sfx('step'); W2.fol = partyKeys().slice(1).map(k => ({ k, x: W2.x, y: W2.y, px: W2.px, py: W2.py, dir: W2.dir, mv: null })); }
  G.pos = { map: W2.id, x: W2.x, y: W2.y, dir: W2.dir };
  // entidade no tile: porta, gatilho, inimigo
  for (const e of W2.ents.slice()) {
    if (e.x === W2.x && e.y === W2.y && e.t === 'door') { run2(() => goDoor(e)); return; }
    if (e.t === 'trig' && W2.x >= e.x && W2.x < e.x + (e.w || 1) && W2.y >= e.y && W2.y < e.y + (e.h || 1) && !(e.once && G.flags[e.once])) { if (e.once) G.flags[e.once] = true; run2(() => e.run(e)); return; }
  }
  if (checkFoeTouch()) return;
  // correnteza empurra o baú
  if (T.push && W2.float && !worldBusy2()) {
    const [dx, dy] = DIR2[T.push];
    if (canStand(W2.x + dx, W2.y + dy, 'player')) { W2.dir = T.push; startMove(W2, W2.x + dx, W2.y + dy); return; }
  }
  // segurar a direção: continua andando sem parar
  if (m.onStep) m.onStep(W2.x, W2.y);
}
function onMoveStart() { if (W2.map.hunters) hunterSeesMove(); }
async function goDoor(e) {
  sfx('door'); await fadeOut(10);
  loadMap2(e.to, e.tx, e.ty, e.tdir || W2.dir);
  if (MAPS2[e.to].onEnter) await MAPS2[e.to].onEnter();
  await fadeIn(10);
}

// ---------- entidades ----------
function updateEnt(e) {
  if (e.mv) { stepTween(e, e.t === 'foe' ? (e.chasing ? 9 : 14) : (e.passo || 16)); return; }
  if (e.rotina) { updateRotina(e); return; }
  if (e.t === 'npc' && e.wander && !worldBusy2()) {
    if (--e.wait > 0) return;
    e.wait = 90 + Math.random() * 160;
    const d = pickOne(['up', 'down', 'left', 'right']), [dx, dy] = DIR2[d], nx = e.x + dx, ny = e.y + dy;
    e.dir = d;
    if (Math.abs(nx - e.home[0]) + Math.abs(ny - e.home[1]) <= e.wander && canStand(nx, ny, e) && !tileOf(W2.map, nx, ny).water) startMove(e, nx, ny);
  }
  if (e.t === 'foe' && !worldBusy2()) {
    const dist = Math.abs(e.x - W2.x) + Math.abs(e.y - W2.y);
    e.chasing = dist <= (e.vision || 4) && !W2.float === !e.swim;
    if (--e.wait > 0) return;
    e.wait = e.chasing ? 2 : 30 + Math.random() * 50;
    let d;
    if (e.chasing) { const dx = W2.x - e.x, dy = W2.y - e.y; d = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
    else d = pickOne(['up', 'down', 'left', 'right']);
    const [dx, dy] = DIR2[d], nx = e.x + dx, ny = e.y + dy; e.dir = d;
    const T = tileOf(W2.map, nx, ny);
    if (nx === W2.x && ny === W2.y) { checkFoeTouch(e); return; }
    if (Math.abs(nx - e.home[0]) + Math.abs(ny - e.home[1]) <= (e.range || 4) + (e.chasing ? 3 : 0) && !T.solid && !propSolid(W2.map, nx, ny) && (!!T.water === !!e.swim) && !entAt2(nx, ny)) startMove(e, nx, ny);
  }
  if (e.t === 'hunter') updateHunter(e);
}
function checkFoeTouch(only) {
  if (worldBusy2()) return false;
  for (const e of W2.ents) {
    if (e.t !== 'foe' || (only && e !== only)) continue;
    const ex = e.mv ? e.mv.tx : e.x, ey = e.mv ? e.mv.ty : e.y;
    if (Math.abs(ex - W2.x) + Math.abs(ey - W2.y) <= (e === only ? 1 : 0) || (ex === W2.x && ey === W2.y)) { run2(() => mapFight(e)); return true; }
  }
  return false;
}
async function mapFight(e) {
  sfx('encounter'); V.shake = 10;
  await tw2flash();
  const res = await lutaMapa(e.group, { music: e.music, bg: e.bg, boss: e.boss });
  if (res === 'win') { G.gone2[W2.id + ':' + e.id] = true; W2.ents = W2.ents.filter(q => q !== e); if (e.after) await e.after(); }
}
function tw2flash() { return new Promise(r => { let k = 0; const f = () => { k++; V.fade = k % 6 < 3 ? 0.6 : 0; if (k < 18) requestAnimationFrame(f); else { V.fade = 0; r(); } }; f(); }); }

// ---------- Caçadores da Guilda (disfarce de bagagem) ----------
// O caçador anda e, de tempos em tempos, PARA E OLHA (aviso "!"). Se o baú se mexer dentro do cone dele, sobe a suspeita.
function updateHunter(e) {
  if (worldBusy2()) return;
  e.cyc = (e.cyc || 0) + 1;
  const per = e.per || 260, ph = e.cyc % per;
  e.alerta = ph > per - 90 && ph < per - 70;                 // aviso: vai olhar
  e.olhando = ph >= per - 70;                                // olhando (ninguém se mexe!)
  if (ph === per - 70) { e.dir = e.lookDir || pickOne(['up', 'down', 'left', 'right']); sfx('select'); }
  if (!e.olhando && !e.mv && ph % 30 === 0 && e.path) { let [tx, ty] = e.path[e.pi || 0]; if (e.x === tx && e.y === ty) { e.pi = ((e.pi || 0) + 1) % e.path.length; [tx, ty] = e.path[e.pi]; } const dx = Math.sign(tx - e.x), dy = dx ? 0 : Math.sign(ty - e.y); if ((dx || dy) && canStand(e.x + dx, e.y + dy, e)) { e.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up'; startMove(e, e.x + dx, e.y + dy); } }
}
function inCone(e, x, y) {
  const [dx, dy] = DIR2[e.dir], rx = x - e.x, ry = y - e.y, fwd = rx * dx + ry * dy, side = Math.abs(rx * dy - ry * dx);
  return fwd > 0 && fwd <= (e.vis || 5) && side <= Math.ceil(fwd / 2);
}
function hunterSeesMove() {
  for (const e of W2.ents) if (e.t === 'hunter' && e.olhando && inCone(e, W2.x, W2.y)) {
    W2.sus = Math.min(3, W2.sus + 1); e.viu = 40; sfx('cancel');
    if (!G.flags.tutBagagem) { G.flags.tutBagagem = true; run2(() => say('* "Hm? Essa mala se mexeu?" Quando um caçador estiver OLHANDO (o "!" em cima dele), fique parado. Você é bagagem. Bagagem não anda.')); }
    if (W2.sus >= 3) { W2.sus = 0; run2(() => cacadoresAtacam(e)); }
    return;
  }
}

// ---------- desenhar ----------
let HOOK_CHAO = null, HOOK_AR = null;          // ganchos do passe visual (hld2.js): chão (sombras, poeira) e ar (partículas, vinheta)
function drawWorld2() {
  const m = W2.map; if (!m) return;
  // câmera com folga: segue o jogador suavemente e olha um pouco para onde ele anda (estilo HLD)
  const dd = W2.mv ? [Math.sign(W2.mv.tx - W2.mv.fx), Math.sign(W2.mv.ty - W2.mv.fy)] : [0, 0];
  W2.look = W2.look || [0, 0]; W2.look[0] += (dd[0] * 22 - W2.look[0]) * 0.04; W2.look[1] += (dd[1] * 14 - W2.look[1]) * 0.04;
  const tx_ = m.w * TS <= W ? (m.w * TS - W) / 2 : Math.max(0, Math.min(m.w * TS - W, W2.px + 8 - W / 2 + W2.look[0])), ty_ = m.h * TS <= H ? (m.h * TS - H) / 2 : Math.max(0, Math.min(m.h * TS - H, W2.py + 8 - H / 2 - 8 + W2.look[1]));
  if (!W2.camF || W2.camF.id !== W2.id || Math.abs(W2.camF.x - tx_) > 120 || Math.abs(W2.camF.y - ty_) > 120) W2.camF = { id: W2.id, x: tx_, y: ty_ };
  W2.camF.x += (tx_ - W2.camF.x) * 0.14; W2.camF.y += (ty_ - W2.camF.y) * 0.14;
  const cx = W2.camF.x, cy = W2.camF.y;
  W2.cam = [Math.round(cx), Math.round(cy)];
  const [ox, oy] = W2.cam;
  if (m.w * TS < W || m.h * TS < H) { if (typeof vazioHLD === 'function') vazioHLD(m, cx, cy); else { fundoRunas(0, W); bx.fillStyle = 'rgba(0,0,0,0.35)'; bx.fillRect(0, 0, W, H); } bx.fillStyle = m.bg || '#0a0812'; bx.fillRect(Math.round(-cx), Math.round(-cy), m.w * TS, m.h * TS); }
  else { bx.fillStyle = m.bg || '#0a0812'; bx.fillRect(0, 0, W, H); }
  // água animada
  const wf = Math.floor(W2.t / 14) % 4;
  for (const [tx, ty, T, shade] of m.water) {
    const sx = tx * TS - ox, sy = ty * TS - oy; if (sx < -16 || sy < -16 || sx > W || sy > H) continue;
    bx.drawImage(tileArt(T.t, T.v ?? (hash(tx, ty, 3) % 3), wf), sx, sy);
    if (shade) { bx.fillStyle = 'rgba(10,20,30,0.45)'; bx.fillRect(sx, sy, 16, 4); bx.fillStyle = '#4a3020'; bx.fillRect(sx + 3, sy, 3, 6); bx.fillRect(sx + 11, sy, 3, 5); }
  }
  bx.drawImage(m.baked, -ox, -oy);
  if (HOOK_CHAO) HOOK_CHAO(m, ox, oy);
  // tudo que tem pé, em ordem de profundidade
  const list = [];
  for (const pr of m.props || []) list.push({ y: pr.by ?? (pr.y * TS), draw: () => bx.drawImage(pr.img(), Math.round(pr.x * TS - ox + (pr.dx || 0)), Math.round(pr.y * TS - oy - pr.img().height + (pr.dy || 0))) });
  for (const e of W2.ents) { const fr = e.spr ? e.spr(W2.t + e.t0, e.dir, e) : null; if (fr) list.push({ y: e.py + 15, draw: () => { drawFeet(fr, e.px - ox, e.py - oy, e); const k = e.acting || (e.mv && e.leva ? (e.leva === true ? 'carregar' : e.leva) : null); if (k && ACT2[k]) ACT2[k](e, Math.round(e.px - ox), Math.round(e.py - oy), Math.floor(W2.t + e.t0), fr); } }); }
  for (const f of W2.fol) { const fr = folSprite(f); if (fr) list.push({ y: f.py + 15, draw: () => drawFeet(fr, f.px - ox, f.py - oy, f) }); }
  list.push({ y: W2.py + 15.5, draw: () => drawPlayer(ox, oy) });
  list.sort((a, b) => a.y - b.y).forEach(d => d.draw());
  // balões de aviso dos caçadores e cone
  for (const e of W2.ents) if (e.t === 'hunter') drawHunterUI(e, ox, oy);
  for (const e of W2.ents) if (e.emote && e.emote.t-- > 0) { const fr = e.spr ? e.spr(W2.t + e.t0, e.dir, e) : null; balao(e.px - ox + 8, e.py - oy + 15 - (fr ? fr.height : (e.h || 48)) - 3 + (e.bob || 0), e.emote.s, { pri: 1, ent: e }); }
  if (m.overlay) m.overlay(ox, oy);
  if (m.dark) drawDark(ox, oy);
  if (typeof desenhaCeu === 'function') desenhaCeu(m, ox, oy);
  if (m.tint) { bx.fillStyle = m.tint; bx.fillRect(0, 0, W, H); }
  if (HOOK_AR) HOOK_AR(m, ox, oy);
  desenhaBaloes();
  // indicador de A sobre quem dá para conversar
  const [dx, dy] = DIR2[W2.dir], near = entAt2(W2.x + dx, W2.y + dy);
  if (near && near.talk && !worldBusy2() && near.t !== 'door') { const yy = near.py - oy - (near.h || 40) - 6 + Math.round(Math.sin(W2.t / 8)); txt('A', near.px - ox + 6, yy, { col: '#ffe066', shadow: true }); }
  // HUD
  if (W2.toast) { const a = Math.min(1, W2.toast.t / 15, (150 - W2.toast.t) / 20), w = lineW(rich(W2.toast.s)) + 20; bx.globalAlpha = 0.8 * a; bx.fillStyle = '#0a0612'; bx.fillRect(W / 2 - w / 2, 26, w, 15); bx.globalAlpha = 1; txt(W2.toast.s, W / 2, 28, { align: 'center', col: '#ffe8b0', alpha: a }); }
  hudMundo(m);
}
function drawFeet(fr, x, y, o) {
  const X = Math.round(x + 8 - fr.width / 2), Y = Math.round(y + 15 - fr.height + (o.bob || 0));
  sombraOval(x + 8, y + 15, Math.max(8, Math.round(fr.width * 0.62)), o.bob ? 0.22 : 0.3); bx.globalAlpha = o.alpha ?? 1;
  bx.drawImage(fr, X, Y); bx.globalAlpha = 1;
}
function drawPlayer(ox, oy) {
  const D = IMG.chestMap[G.species] || IMG.chestMap.caixote; if (!D) return;
  const moving = !!W2.mv, fr = D[W2.dir][moving ? (Math.floor(W2.t / 5) % D[W2.dir].length) : ((W2.t % 140) < 6 ? 1 : 0)];
  let x = W2.px - ox, y = W2.py - oy, hop = moving && !W2.float ? -Math.abs(Math.sin(W2.mv.k / 8 * Math.PI)) * 3 : 0;
  if (W2.float) {
    const b = Math.sin(W2.t / 12) * 1.5;
    bx.drawImage(fr, 0, 0, 16, 11, Math.round(x), Math.round(y + 2 + b), 16, 11);            // só a parte de cima aparece: o resto está na água
    bx.fillStyle = 'rgba(190,230,245,0.7)'; const r = (W2.t / 3) % 10; bx.fillRect(Math.round(x - 1 - r / 3), Math.round(y + 12 + b), Math.round(18 + r / 1.5), 1);
    return;
  }
  // sombra oval que encolhe no pulo; o baú estica no ar, achata ao pousar e inclina para onde vai
  sombraOval(x + 8, y + 15, Math.round(15 + hop * 0.8), 0.32 + hop * 0.03);
  const k = moving ? W2.mv.k / 8 : 1, sq = moving ? (k < 0.15 || k > 0.9 ? 1 : 0) : 0, air = moving ? Math.abs(Math.sin(k * Math.PI)) : 0;
  const sx = 1 + sq * 0.14 - air * 0.06, sy = 1 - sq * 0.12 + air * 0.08, lean = moving ? (W2.dir === 'left' ? -1 : W2.dir === 'right' ? 1 : 0) : 0;
  const w = Math.round(fr.width * sx), h = Math.round(fr.height * sy);
  bx.save(); bx.translate(Math.round(x + 8), Math.round(y + fr.height + hop)); if (lean) bx.transform(1, 0, -lean * 0.12, 1, 0, 0);
  bx.drawImage(fr, -Math.round(w / 2), -h, w, h); bx.restore();
}
// sombra em pixel: elipse chapada (sem degradê), como no HLD
const SOMBRA_C = {};
function sombraOval(cx, cy, w, a = 0.3) {
  w = Math.max(4, Math.round(w)); const key = w;
  if (!SOMBRA_C[key]) { const h = Math.max(3, Math.round(w / 3.2)), c = mk(w, h), x = c.getContext('2d'); x.fillStyle = '#000'; for (let yy = 0; yy < h; yy++) { const t = (yy + 0.5) / h * 2 - 1, half = Math.round(w / 2 * Math.sqrt(1 - t * t)); x.fillRect(Math.round(w / 2) - half, yy, half * 2, 1); } SOMBRA_C[key] = c; }
  const c = SOMBRA_C[key], a0 = bx.globalAlpha; bx.globalAlpha = a; bx.drawImage(c, Math.round(cx - c.width / 2), Math.round(cy - c.height / 2)); bx.globalAlpha = a0;
}
const FOLSPR = {};
function folSprite(f) {
  const t = W2.t + (f.k === 'rita' ? 13 : 0);
  if (f.k === 'lume') { const S = IMG.spf.lumeh, F = IMG.sp.lumeHuman; const v = f.dir === 'up' ? S.b : f.dir === 'down' ? F : S.s; const fr = v[Math.floor(t / (f.mv ? 8 : 26)) % v.length]; return f.dir === 'right' ? flipC(fr) : fr; }
  if (f.k === 'rita') { const S = IMG.spf.rita, F = IMG.sp.rita; const v = f.dir === 'up' ? S.b : f.dir === 'down' ? F : S.s; const fr = v[Math.floor(t / (f.mv ? 8 : 26)) % v.length]; return (f.dir === 'left' && v === S.s) ? flipC(fr) : fr; }
  return null;
}
function drawHunterUI(e, ox, oy) {
  const x = e.px - ox + 8, top = e.py - oy - 44;
  if (e.alerta && W2.t % 10 < 6) txt('!', x, top - 10, { align: 'center', col: '#ffe066', shadow: true });
  if (e.olhando) {
    txt('!', x, top - 10, { align: 'center', col: '#ff6b6b', shadow: true });
    // cone de visão em tiles
    bx.fillStyle = 'rgba(255,90,90,0.16)';
    for (let f = 1; f <= (e.vis || 5); f++) for (let s = -Math.ceil(f / 2); s <= Math.ceil(f / 2); s++) { const [dx, dy] = DIR2[e.dir], tx = e.x + dx * f + (dy ? s : 0), ty = e.y + dy * f + (dx ? s : 0); if (!tileOf(W2.map, tx, ty).solid) bx.fillRect(tx * TS - ox, ty * TS - oy, 16, 16); }
  }
  if (e.viu > 0) { e.viu--; txt('?', x + 8, top - 6, { col: '#ff8a70', shadow: true }); }
}
// escuridão com a luz da Vela da Lume em volta do grupo
let DARKC = null;
function drawDark(ox, oy) {
  if (!DARKC || DARKC.width !== W) DARKC = mk(W, H);
  const x = DARKC.getContext('2d');
  x.globalCompositeOperation = 'source-over'; x.fillStyle = W2.map.dark; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'destination-out';
  const lights = [[W2.px - ox + 8, W2.py - oy + 4, 58 + Math.sin(W2.t / 9) * 2]];
  for (const e of W2.ents) if (e.luz) lights.push([e.px - ox + 8, e.py - oy - 8, e.luz]);
  for (const L of W2.map.lights || []) lights.push([L[0] * TS - ox + 8, L[1] * TS - oy + 8, L[2]]);
  for (const [lx, ly, r] of lights) { const g = x.createRadialGradient(lx, ly, r * 0.2, lx, ly, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.7, 'rgba(0,0,0,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(lx, ly, r, 0, Math.PI * 2); x.fill(); }
  bx.drawImage(DARKC, 0, 0);
}

// ---------- ROTINAS DOS MORADORES: andam até um ponto e FAZEM alguma coisa lá ----------
// e.rotina = [{ at: [x, y], act: 'varrer', t: quadros, dir, leva: true (carrega caixa no caminho até aqui) }, ...]
function updateRotina(e) {
  if (worldBusy2()) return;
  const R = e.rotina, r = R[e.ri || 0];
  if (e.acting) {
    e.bob = ACT_BOB[e.acting] ? ACT_BOB[e.acting](W2.t + e.t0) : 0;
    if (--e.actT <= 0) { e.acting = null; e.bob = 0; e.ri = ((e.ri || 0) + 1) % R.length; e.leva = R[e.ri].leva || false; }
    return;
  }
  const [tx, ty] = r.at;
  if (e.x === tx && e.y === ty) { e.acting = r.act; e.actT = r.t || 240; if (r.dir) e.dir = r.dir; e.leva = false; return; }
  if (--e.wait > 0) return;
  e.wait = 6; e.leva = r.leva || false;
  const dx = Math.sign(tx - e.x), dy = Math.sign(ty - e.y);
  const tries = Math.abs(tx - e.x) >= Math.abs(ty - e.y) ? [[dx, 0], [0, dy], [0, 1], [0, -1]] : [[0, dy], [dx, 0], [1, 0], [-1, 0]];
  if (dx && dy && canStand(e.x + dx, e.y, e) && canStand(e.x, e.y + dy, e)) tries.unshift([dx, dy]);
  for (const [ax, ay] of tries) {
    if (!ax && !ay) continue; const nx = e.x + ax, ny = e.y + ay;
    if (canStand(nx, ny, e) && !tileOf(W2.map, nx, ny).water) { e.dir = ax > 0 ? 'right' : ax < 0 ? 'left' : ay > 0 ? 'down' : 'up'; startMove(e, nx, ny); e.stuck = 0; return; }
  }
  // alguém (o baú!) está no caminho: espera um pouco, olha feio e, se demorar, pula para a próxima tarefa
  e.stuck = (e.stuck || 0) + 1; if (e.stuck === 8) e.emote = { s: '...', t: 60 };
  if (e.stuck > 30) { e.stuck = 0; e.ri = ((e.ri || 0) + 1) % R.length; }
}
const ACT_BOB = {
  brincar: t => -Math.abs(Math.sin(t / 7)) * 4,
  varrer: t => (Math.floor(t / 10) % 2),
  dancar: t => -Math.abs(Math.sin(t / 9)) * 2
};
// pontos do corpo no sprite do morador (~48 px): mão e cabeça
function maoDe(e, x, y, fr) { const top = y + 15 - fr.height; return { mx: x + 8 + (e.dir === 'left' ? -6 : e.dir === 'right' ? 6 : 5), my: top + 30, top, cx: x + 8, f: e.dir === 'left' ? -1 : e.dir === 'right' ? 1 : (e.dir === 'up' ? 0 : 1) }; }
function px2(x, y, c, w = 1, h = 1) { bx.fillStyle = c; bx.fillRect(Math.round(x), Math.round(y), w, h); }
// ---------- balões de fala no mapa ----------
// Os balões NÃO são desenhados na hora: entram numa fila e são desenhados juntos no fim do quadro (depois da noite e
// dos telhados), com altura certa para a fonte, rabinho apontando para quem fala, sem sair da tela, sem ficar em cima
// do painel do grupo e sem um cobrir o outro (o de reação tem prioridade; os de fundo que batem são descartados).
const BAL = [];
function balao(x, y, s, o = {}) { BAL.push({ x: Math.round(x), y: Math.round(y), s: String(s), pri: o.pri || 0, ent: o.ent || null }); }
function desenhaBaloes() {
  const fila = BAL.splice(0);
  if (UI.stack.length || V.scene !== 'world') return;               // com janela aberta, os balões somem (o texto passaria por cima dela)
  const hud = (typeof HUD_G !== 'undefined' && HUD_G) ? 8 + HUD_G.length * 11 + 12 + (W2.map && W2.map.hunters ? 11 : 0) + (G.flags && G.flags.rostoCena ? 18 : 0) : 60;
  const z_ = TXZ, postos = [{ x0: 0, y0: 0, x1: 100 * z_, y1: (hud + 6) * z_, fixo: true }, { x0: 98 * z_, y0: 0, x1: 160 * z_, y1: 22 * z_, fixo: true }, { x0: W - 64 * z_, y0: 0, x1: W, y1: 30 * z_, fixo: true }];
  if (W2.toast) { const tw = lineW(rich(W2.toast.s)) + 20; postos.push({ x0: W / 2 - tw / 2, y0: 24, x1: W / 2 + tw / 2, y1: 43, fixo: true }); }
  // primeiro as reações (pri alto), depois as de fundo; dentro de cada grupo, de cima para baixo
  fila.sort((a, b) => b.pri - a.pri || a.y - b.y);
  // um balão por pessoa
  const vistos = new Set();
  for (const b of fila) {
    if (b.ent) { if (vistos.has(b.ent)) continue; vistos.add(b.ent); }
    const w = Math.max(12, lineW(rich(b.s)) + 8), h = 14;
    let bx0 = Math.max(2, Math.min(W - 2 - w, b.x - Math.round(w / 2))), by0 = Math.max(2, b.y - h);
    const bate = (x0, y0) => postos.find(r => x0 < r.x1 && x0 + w > r.x0 && y0 < r.y1 && y0 + h + 3 > r.y0);
    let r = bate(bx0, by0), tent = 0;
    while (r && tent++ < 3) {
      if (r.fixo) { if (b.pri > 0 && by0 + h + 3 > r.y1 - 2 && r.y1 + 2 + h <= b.y + 6) by0 = r.y1 + 2; else break; }
      else if (b.pri > 0) by0 = r.y0 - h - 4;                       // reação: sobe e empilha
      else break;
      r = bate(bx0, by0);
    }
    if (r || by0 < 2) continue;                                       // não coube sem cobrir outro: este fica para depois
    postos.push({ x0: bx0, y0: by0, x1: bx0 + w, y1: by0 + h + 3 });
    // corpo com cantos cortados, contorno escuro e sombra
    const ink = '#1a1020', papel = b.pri > 0 ? '#fff4dc' : '#ece4d2';
    bx.fillStyle = 'rgba(0,0,0,0.35)'; bx.fillRect(bx0 + 1, by0 + h, w - 2, 1);
    bx.fillStyle = ink; bx.fillRect(bx0 + 1, by0 - 1, w - 2, h + 2); bx.fillRect(bx0 - 1, by0 + 1, w + 2, h - 2); bx.fillRect(bx0, by0, w, h);
    bx.fillStyle = papel; bx.fillRect(bx0 + 1, by0, w - 2, h); bx.fillRect(bx0, by0 + 1, w, h - 2);
    bx.fillStyle = 'rgba(255,255,255,0.6)'; bx.fillRect(bx0 + 2, by0 + 1, w - 4, 1);
    // rabinho: aponta para quem fala (preso dentro do balão)
    const tx = Math.max(bx0 + 3, Math.min(bx0 + w - 5, b.x - 1)), ty = by0 + h;
    if (by0 + h <= b.y + 1) {
      bx.fillStyle = ink; bx.fillRect(tx - 1, ty, 5, 2); bx.fillRect(tx, ty + 2, 3, 1); bx.fillRect(tx + 1, ty + 3, 1, 1);
      bx.fillStyle = papel; bx.fillRect(tx, ty - 1, 3, 2); bx.fillRect(tx + 1, ty + 1, 1, 1);
    }
    txt(b.s, bx0 + w / 2, by0 + 1, { align: 'center', col: b.pri > 0 ? '#8a2030' : '#2a1e1a' });
  }
}
const ACT2 = {
  // varrer o cais: vassoura indo e vindo, poeirinha
  varrer(e, x, y, t, fr) { const { mx, my, f } = maoDe(e, x, y, fr), s = Math.sin(t / 5) * 4; bx.strokeStyle = '#8a6a3a'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(mx + 0.5, my - 6); bx.lineTo(mx + f * 6 + s + 0.5, y + 14); bx.stroke(); px2(mx + f * 6 + s - 3, y + 13, '#c8a050', 7, 2); if (t % 12 < 4) px2(mx + f * 9 + s, y + 12 - (t % 12), '#b8a890'); },
  // pescar: vara, linha até a água e a boia subindo e descendo; às vezes fisga
  pescar(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), dd = DIR2[e.dir], tx = x + 8 + dd[0] * 26, ty = y + 6 + dd[1] * 26, fis = t % 420 > 380; bx.strokeStyle = '#6a4a2a'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(mx, my); bx.lineTo(mx + dd[0] * 16, my - 14 + dd[1] * 8); bx.stroke(); bx.strokeStyle = 'rgba(240,240,240,0.7)'; bx.beginPath(); bx.moveTo(mx + dd[0] * 16, my - 14 + dd[1] * 8); bx.lineTo(tx, ty + (fis ? 3 : 0)); bx.stroke(); px2(tx - 1, ty - 1 + (fis ? 3 : Math.round(Math.sin(t / 15))), '#e85a4a', 3, 2); px2(tx - 1, ty - 2 + (fis ? 3 : Math.round(Math.sin(t / 15))), '#ffffff', 3, 1); if (fis) balao(x + 8, y + 15 - fr.height - 3, '!', { ent: e }); },
  // carregar caixa na cabeça (andando com e.leva) e empilhar no destino
  carregar(e, x, y, t, fr) { const top = y + 15 - fr.height + (e.bob || 0); bx.drawImage(caixaMini(), Math.round(x + 1), Math.round(top - 9)); },
  empilhar(e, x, y, t, fr) { const top = y + 15 - fr.height, p = Math.min(1, (t % 120) / 40); if (p < 1) bx.drawImage(caixaMini(), Math.round(x + 1 + DIR2[e.dir][0] * 10 * p), Math.round(top - 9 + 30 * p)); },
  // acender poste: vara comprida com a chama na ponta, até a lanterna do poste
  acender(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), dd = DIR2[e.dir], ex = x + 8 + dd[0] * 14, ey = y - 92; bx.strokeStyle = '#5a4a3a'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(mx, my); bx.lineTo(ex, ey); bx.stroke(); px2(ex - 1, ey - 3, t % 8 < 4 ? '#ffd060' : '#ff9a30', 3, 3); px2(ex, ey - 4, '#fff0c0'); },
  // tocar o sininho de lata: puxa a corda (e soa baixinho, se o baú estiver perto)
  sino(e, x, y, t, fr) { const { top } = maoDe(e, x, y, fr), pull = (t % 90) < 20 ? 4 : 0; bx.strokeStyle = '#c8b890'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(x + 13, top - 40); bx.lineTo(x + 13, top + 30 + pull); bx.stroke(); if (t % 90 === 0 && Math.abs(e.x - W2.x) + Math.abs(e.y - W2.y) < 9) sfx('sino', 880); if ((t % 90) < 30) txt('♪', x + 18, top - 8 - (t % 90) / 3, { col: '#ffe066' }); },
  // estender roupa no varal
  varal(e, x, y, t, fr) { const { top } = maoDe(e, x, y, fr); bx.strokeStyle = '#d8d0c0'; bx.lineWidth = 1; bx.beginPath(); bx.moveTo(x - 14, top + 6); bx.lineTo(x + 30, top + 6); bx.stroke(); const n = Math.min(4, 1 + Math.floor((t % 600) / 120)); for (let i = 0; i < n; i++) px2(x - 12 + i * 11, top + 7, ['#e86890', '#5a9ad0', '#f0c040', '#ffffff'][i], 8, 9 + (i % 2) * 3); },
  // regar as plantas da horta do telhado
  regar(e, x, y, t, fr) { const { mx, my, f } = maoDe(e, x, y, fr); px2(mx + f * 2 - 3, my - 2, '#7a8a9a', 6, 5); px2(mx + f * 6, my - 1, '#7a8a9a', 3, 1); for (let i = 0; i < 3; i++) if ((t + i * 5) % 15 < 8) px2(mx + f * (8 + i), my + 2 + ((t + i * 5) % 15), '#8fd0f0'); },
  // limpar o balcão com um pano
  limpar(e, x, y, t, fr) { const { my } = maoDe(e, x, y, fr), s = Math.sin(t / 8) * 6; px2(x + 4 + s, my + 2, '#e8dcc0', 7, 3); },
  // remendar rede de pesca no colo
  remendar(e, x, y, t, fr) { const { my } = maoDe(e, x, y, fr); bx.strokeStyle = '#c8b890'; bx.lineWidth = 1; for (let i = 0; i < 4; i++) { bx.beginPath(); bx.moveTo(x - 2 + i * 6, my); bx.lineTo(x + 2 + i * 6, my + 10); bx.stroke(); } bx.beginPath(); bx.moveTo(x - 2, my + 4); bx.lineTo(x + 20, my + 4); bx.stroke(); if (t % 40 < 20) px2(x + 8 + (t % 40) / 4, my + 3, '#c8c8d8'); },
  // beber (caneca sobe e desce) e cochilar (zzz)
  beber(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), up = (t % 160) < 40 ? 10 : 0; px2(mx - 2, my - up - 2, '#c8a060', 5, 6); px2(mx - 2, my - up - 2, '#f2ecdc', 5, 1); },
  cochilar(e, x, y, t, fr) { const { top } = maoDe(e, x, y, fr); const k = t % 120; txt(k < 40 ? 'z' : k < 80 ? 'zZ' : 'zZz', x + 16, top - 4 - (k % 40) / 8, { col: '#b8aecb' }); },
  // conversar: balãozinho de reticências que vai e volta
  conversar(e, x, y, t, fr) { if (t % 200 < 120) balao(x + 8, y + 15 - fr.height - 3, ['...', '!', '?', 'hã!', 'pois é'][Math.floor(t / 200) % 5], { ent: e }); },
  // brincar (pula) e olhar o rio (parado, de vez em quando suspira)
  brincar(e, x, y, t, fr) { if (t % 180 < 40) balao(x + 8, y + 15 - fr.height - 3 + (e.bob || 0), '♪', { ent: e }); },
  olhar(e, x, y, t, fr) { if (t % 300 < 50) balao(x + 8, y + 15 - fr.height - 3, '...', { ent: e }); },
  dancar(e, x, y, t, fr) { if (t % 60 < 30) txt('♪', x + 18, y + 15 - fr.height - 4, { col: '#ffe066' }); },
  rezar(e, x, y, t, fr) { const { top } = maoDe(e, x, y, fr); if (t % 160 < 60) txt('+', x + 18, top - 2 - (t % 160) / 12, { col: '#ffe8b0' }); }
};
let CAIXA_MINI = null;
function caixaMini() { if (CAIXA_MINI) return CAIXA_MINI; const P = new Pix(14, 11), B = ramp('#9a7a4a'); for (let y = 0; y < 10; y++) for (let x = 0; x < 13; x++) P.p(x, y + 1, P.tone(B, 0.62 - y / 22 - x / 40 + (x === 0 || y === 0 ? 0.15 : 0), x, y)); P.line(1, 2, 12, 10, B[1]); return CAIXA_MINI = P.outline().canvas(); }

// ---------- HUD do mapa: painel translúcido no canto (vida do grupo em segmentos, cobres, suspeita) ----------
let HUD_G = null, HUD_T = -99;
const COBRE_IC = (() => { const c = mk(7, 7), x = c.getContext('2d'); x.fillStyle = '#5a3a10'; x.fillRect(1, 0, 5, 7); x.fillRect(0, 1, 7, 5); x.fillStyle = '#e8a030'; x.fillRect(1, 1, 5, 5); x.fillStyle = '#ffd870'; x.fillRect(2, 1, 2, 1); x.fillRect(1, 2, 1, 2); x.fillStyle = '#5a3a10'; x.fillRect(3, 2, 1, 3); return c; })();
function hudMundo(m) {
  if (FRAME - HUD_T > 30 || !HUD_G) { try { HUD_G = grupoAtual(); } catch (_) { HUD_G = null; } HUD_T = FRAME; }
  const gs = HUD_G || [], h = 8 + gs.length * 11 + 12 + (m.hunters ? 11 : 0);
  box(4, 4, 92, h, { bw: 1 });
  gs.forEach((u, i) => {
    const y = 9 + i * 11, p = PT(u.port || u.id);
    if (p) { bx.save(); bx.beginPath(); bx.rect(8, y - 1, 10, 10); bx.clip(); bx.drawImage(p, 8, y - 1, 10, 10); bx.restore(); }
    const pt = (G.pt || {})[u.id], hp = pt ? pt.hp : u.mhp, n = Math.ceil(Math.max(0, hp) / u.mhp * 10), cor = hp / u.mhp > 0.5 ? '#5fffb0' : hp / u.mhp > 0.25 ? '#ffd060' : '#ff6b6b';
    for (let k = 0; k < 10; k++) { bx.fillStyle = k < n ? cor : 'rgba(95,255,176,0.14)'; bx.fillRect(22 + k * 7, y + 1, 6, 6); if (k < n) { bx.fillStyle = 'rgba(255,255,255,0.35)'; bx.fillRect(22 + k * 7, y + 1, 6, 1); } }
  });
  const yc = 9 + gs.length * 11;
  bx.drawImage(COBRE_IC, 9, yc + 2); txt(String(G.cobres || 0), 20, yc, { col: '#ffd870' });
  if (m.hunters) {
    const ys = yc + 11; bx.fillStyle = '#ff8a70'; bx.fillRect(9, ys + 4, 7, 1); bx.fillRect(10, ys + 3, 5, 3); bx.fillStyle = '#120c1c'; bx.fillRect(12, ys + 3, 1, 3);
    for (let i = 0; i < 3; i++) { bx.fillStyle = i < W2.sus ? '#ff6b6b' : 'rgba(255,107,107,0.18)'; bx.fillRect(22 + i * 10, ys + 2, 8, 5); }
  }
}
