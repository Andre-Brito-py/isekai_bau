// ================= MECÂNICAS DO CAP. 8 — O INVERNO ESCURO =================
// ESCURIDÃO POR BAIRRO: no Cap. 8, de NOITE, Bairro Baixo, Largo, Festival e Vila dos Pavios ficam no escuro (a
// Acendedoria cortou o âmbar). BRASEIROS espalhados pelas ruas: a Lume acende (gasta CHAMA, ou uma VELA). Braseiro
// aceso é luz que fica, e espanta a FRIAGEM (sombras de frio que só andam no escuro). A CHAMA DA LUME (0-100) volta
// perto de braseiro aceso, de lareira (base, hospital) e cada vez que alguém chega são e salvo.
// ESCOLTA: gente presa em casa no escuro segue o grupo (de noite) até o abrigo; no escuro elas ficam com MEDO; medo
// cheio e elas fogem de volta para casa. ROTAS DE LUZ: acenda o caminho antes de levar alguém.
// GELO (Cisternas): quem pisa escorrega até bater; braseiro aceso derrete o gelo em volta.
// De DIA: sem sombras, braseiro não pega no vento; é hora de comprar velas, achar músicos e fazer as voltas.
const c8Ativo = () => !!(G.flags && G.flags.c8Init && !G.flags.c8Fim);
const BAIRROS8 = ['auren', 'largo', 'festival', 'ruaPavios'];
const luz8 = () => (G.flags.c8luz = G.flags.c8luz || {});
const chama = () => (G.chama ?? (G.chama = 100));
function setChama(v) { G.chama = Math.max(0, Math.min(chamaMax(), v)); }
const chamaMax = () => 100 + (G.flags.c8VelasVelhagua ? 20 : 0);
const escuro8 = () => c8Ativo() && ehNoite();
// acha um chão livre perto de (x,y): sem parede, sem objeto, com espaço em volta (para não fechar rua)
function chaoLivre8(m, x0, y0, usados = new Set()) {
  for (let r = 0; r < 7; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
    const x = x0 + dx, y = y0 + dy; if (x < 1 || y < 1 || y >= m.rows.length - 1 || x >= m.rows[0].length - 1) continue;
    const k = x + ',' + y; if (usados.has(k)) continue;
    const ok = (a, b) => { const T = (m.key && m.key[m.rows[b][a]]) || KEY2[m.rows[b][a]] || KEY2['.']; return !T.solid && !T.water && !propSolidM(m, a, b) && !(m.ents || []).some(e => e.x === a && e.y === b && !e.passa); };
    if (!ok(x, y)) continue;
    let viz = 0; for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (ok(x + ax, y + ay)) viz++;
    if (viz >= 3) { usados.add(k); return [x, y]; }
  }
  return null;
}
function propSolidM(m, x, y) { for (const p of m.props || []) { const s = typeof p.solid === 'function' ? p.solid() : p.solid; if (s) for (const [a, b, w, h] of s) if (x >= a && x < a + w && y >= b && y < b + h) return true; } return false; }
// ---------- braseiros nos bairros ----------
const PERTO8 = { auren: () => [...POS3.auren.postes, [24, 22], [9, 20]], largo: () => [...POS4.largo.postes.slice(0, 5)], festival: () => [...POS3.festival.postes || [], [10, 18], [36, 18], [26, 12]].slice(0, 5), ruaPavios: () => VP.postes.slice(0, 5) };
function brasDe(id) { const m = MAPS2[id]; return (m && m._bras8) || []; }
function brasAceso(id, i) { return (luz8()[id] || []).includes(i); }
function bairroAceso(id) { const B = brasDe(id); return B.length > 0 && B.every((_, i) => brasAceso(id, i)); }
async function acenderBraseiro(id, i) {
  if (brasAceso(id, i)) { if (escuro8()) { setChama(chama() + 20); W2.toast = { s: 'A Lume se aquece no braseiro. Chama ' + Math.round(chama()), t: 0 }; } else await say('* O braseiro aceso, estalando. Em volta dele, a neve derrete num círculo perfeito.'); return; }
  if (!c8Ativo()) { await say('* Um braseiro de ferro, apagado, com neve dentro.'); return; }
  if (!ehNoite() && W2.id !== 'cisternas') { await say('* De dia o vento do Inverno apaga qualquer fogo de rua antes de pegar. Braseiro é coisa de noite.'); return; }
  const vela = (G.velas || 0) > 0;
  const custo = G.flags.c8Lampiao ? 15 : 25;
  if (!vela && chama() < custo) { await say('* A Lume encosta a mão no braseiro. A chama dela treme e não pega.'); await say('Eu... tô fraca. Preciso de uma vela, ou de esquentar perto de um fogo.', 'lume'); if (!G.flags.tutChama8) { G.flags.tutChama8 = true; await say('[CHAMA DA LUME: acender gasta 25. Volta perto de braseiro aceso, nas lareiras (base, hospital) e quando alguém chega são e salvo. VELAS acendem sem gastar chama: a Dona Iolanda vende.]', 'cat'); } return; }
  if (vela) G.velas--; else setChama(chama() - custo);
  sfx('rune'); (luz8()[id] = luz8()[id] || []).push(i);
  W2.toast = { s: (vela ? 'Uma vela acende o braseiro.' : 'A Lume acende o braseiro. Chama ' + Math.round(chama())) + ' (' + (luz8()[id].length) + '/' + brasDe(id).length + ')', t: 0 };
  if (!G.flags.tutBras8) { G.flags.tutBras8 = true; await say('Pegou! Olha, a neve derreteu em volta!', 'lume'); await say('[Braseiro aceso fica aceso. A Friagem não entra na luz. Acenda o caminho antes de levar gente.]', 'cat'); }
  if (bairroAceso(id) && typeof bairroCompleto8 === 'function') await bairroCompleto8(id);
}
{ const _mmB8 = montarMapas2; montarMapas2 = function () {
  _mmB8.apply(this, arguments);
  for (const id of BAIRROS8) {
    const m = MAPS2[id]; if (!m || m._b8) continue; m._b8 = true;
    const us = new Set(); m._bras8 = PERTO8[id]().map(([x, y]) => chaoLivre8(m, x + 1, y, us)).filter(Boolean);
    m._bras8.forEach(([x, y], i) => m.ents.push({ t: 'sign', id: 'bras8_' + i, x, y, h: 30, gone: () => !c8Ativo() && !brasAceso(id, i), spr: () => braseiroArt(brasAceso(id, i), Math.floor(W2.t / 6)), get luz() { return brasAceso(id, i) ? 80 : 0; }, talk: () => acenderBraseiro(id, i) }));
    const d0 = Object.getOwnPropertyDescriptor(m, 'dark');
    const l0 = Object.getOwnPropertyDescriptor(m, 'lights');
    Object.defineProperty(m, 'lights', { get: () => [...((l0 && (l0.get ? l0.get.call(m) : l0.value)) || []), ...(escuro8() ? luzLume8() : [])], configurable: true });
    Object.defineProperty(m, 'dark', { get: () => escuro8() ? (bairroAceso(id) ? 'rgba(6,8,16,0.5)' : 'rgba(4,6,14,0.8)') : (d0 ? (d0.get ? d0.get.call(m) : d0.value) : undefined), configurable: true });
    // a Friagem anda pelo escuro (some quando o bairro acende, e de dia)
    const sp = [...(m._bras8 || [])].slice(0, 3).map(([x, y]) => chaoLivre8(m, x + 4, y + 2, us)).filter(Boolean);
    sp.forEach(([x, y], i) => m.ents.push(inimigo('fr8' + id + i, 'friagem', x, y, i % 2 ? ['friagem', 'friagem'] : ['friagem', 'loboFuligem'], { spr: (t) => friagemArt(Math.floor(t / 10) % 2), h: 30, bg: bgAurenEscura, gone: () => !escuro8() || bairroAceso(id) })));
  }
}; }
// ---------- a chama na tela ----------
{ const _hm8 = hudMundo; hudMundo = function (m) {
  _hm8(m);
  if (!c8Ativo() || V.scene !== 'world') return;
  const x = 4, y = H - 22, w = 70; box(x, y, w + 26, 18, { edge: '#ffb040' });
  const p = chama() / chamaMax(); bx.fillStyle = '#2a1a10'; bx.fillRect(x + 20, y + 7, w, 5); bx.fillStyle = p > 0.5 ? '#ffb040' : p > 0.25 ? '#e86a20' : '#c83a1a'; bx.fillRect(x + 20, y + 7, Math.round(w * p), 5);
  const fl = Math.floor(W2.t / 6) % 3; bx.fillStyle = '#e86a20'; bx.fillRect(x + 8, y + 5 + fl % 2, 6, 8); bx.fillStyle = '#ffd070'; bx.fillRect(x + 9, y + 8, 4, 5);
  if ((G.velas || 0) > 0) txt('v' + G.velas, x + w + 6, y + 4, { col: '#f2ecdc' });
}; }
// ---------- escolta ----------
// ESC8[id] = { nm, hum, map, at:[x,y] (casa), dest:{map, at, r}, fala }
const ESC8 = {};
const escSt = () => (G.escolta = G.escolta || []);
const escMedo = {};
function escAtivo(id) { return escSt().includes(id); }
function escEntregue(id) { return !!G.flags['c8E_' + id]; }
function montaEscolta(id, o) {
  ESC8[id] = o;
  const m = MAPS2[o.map]; if (!m || m['_esc_' + id]) return; m['_esc_' + id] = true;
  const pos = chaoLivre8(m, o.at[0], o.at[1]) || o.at; o.casa = pos;
  m.ents.push(morador(o.hum, pos[0], pos[1], { id: 'esc_' + id, dir: 'down', gone: () => escAtivo(id) || escEntregue(id) || !c8Ativo(), talk: () => pedirEscolta(id) }));
}
async function pedirEscolta(id) {
  const o = ESC8[id];
  if (!ehNoite()) { await say(o.dia || 'De dia dá pra ver a rua, mas tá todo mundo trancado. De noite a gente tem medo. Volta quando escurecer e a rua tiver luz?', o.who || 'n'); return; }
  if (escSt().length >= 3) { await say('Vocês já tão levando gente demais. Leva esses primeiro.', o.who || 'n'); return; }
  await say(o.fala || 'Vocês levam a gente? Mas tem que ter luz no caminho. Eu não ando no escuro.', o.who || 'n');
  const c = await choose('* Levar até ' + o.destNm + '?', ['Vamos juntos', 'Ainda não'], 'me', 1); if (c !== 0) return;
  escSt().push(id); escMedo[id] = 0; sfx('item'); criaEscoltaEnts();
  if (!G.flags.tutEsc8) { G.flags.tutEsc8 = true; await say('[ESCOLTA: eles seguem atrás. No ESCURO o medo sobe (o balão fica vermelho); com medo cheio, voltam correndo para casa. Ande pelas ruas com braseiro aceso. Chegando em ' + o.destNm + ', estão salvos.]', 'cat'); }
}
function criaEscoltaEnts() {
  W2.ents = W2.ents.filter(e => e.t !== 'escolta');
  escSt().forEach((id, i) => { const o = ESC8[id]; W2.ents.push({ t: 'escolta', id: 'segue_' + id, k: id, passa: true, x: W2.x, y: W2.y, px: W2.px, py: W2.py, dir: W2.dir, h: 44, spr: humSpr(o.hum), t0: 0 }); });
}
{ const _lmE = loadMap2; loadMap2 = function () { const r = _lmE.apply(this, arguments); W2.hist8 = []; if (escSt().length) criaEscoltaEnts(); return r; }; }
function iluminado8(x, y) {
  if (!escuro8()) return true;
  if (Math.abs(x - W2.x) + Math.abs(y - W2.y) <= 2) return true;
  for (const e of W2.ents) if (e.luz && Math.hypot(e.x - x, e.y - y) <= e.luz / 16) return true;
  for (const L of (W2.map && W2.map.lights) || []) if (Math.hypot(L[0] - x, L[1] - y) <= L[2] / 16) return true;
  return false;
}
{ const _uwE8 = updateWorld2; updateWorld2 = function () {
  const ax = W2.x, ay = W2.y;
  _uwE8();
  if (V.scene !== 'world') return;
  const h = (W2.hist8 = W2.hist8 || []); if (!h.length || h[h.length - 1][0] !== W2.x || h[h.length - 1][1] !== W2.y) { h.push([W2.x, W2.y]); if (h.length > 40) h.shift(); }
  const es = W2.ents.filter(e => e.t === 'escolta');
  es.forEach((e, i) => {
    const alvo = h[Math.max(0, h.length - 1 - (3 + i * 2))] || [W2.x, W2.y];
    const tx = alvo[0] * TS, ty = alvo[1] * TS, dx = tx - e.px, dy = ty - e.py, d = Math.hypot(dx, dy);
    if (d > 0.5) { const sp = Math.min(d, 1.7); e.px += dx / d * sp; e.py += dy / d * sp; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); e.t0 = (e.t0 || 0) + 1; }
    e.x = Math.round(e.px / TS); e.y = Math.round(e.py / TS);
    if (worldBusy2()) return;
    const id = e.k, o = ESC8[id];
    const md = (escMedo[id] = (escMedo[id] || 0) + (iluminado8(e.x, e.y) ? -0.6 : 0.24));
    escMedo[id] = Math.max(0, Math.min(100, md));
    if (escMedo[id] > 60 && W2.t % 40 === 0) e.emote = { s: escMedo[id] > 85 ? 'NÃO! Tá escuro!' : 'Tá escuro...', t: 40 };
    if (escMedo[id] >= 100) { G.escolta = escSt().filter(k => k !== id); W2.ents = W2.ents.filter(x => x !== e); sfx('cancel'); W2.toast = { s: o.nm + ' teve medo do escuro e voltou correndo para casa.', t: 0 }; return; }
    if (o.dest.map === W2.id && Math.abs(e.x - o.dest.at[0]) + Math.abs(e.y - o.dest.at[1]) <= (o.dest.r || 2)) {
      G.escolta = escSt().filter(k => k !== id); W2.ents = W2.ents.filter(x => x !== e); G.flags['c8E_' + id] = true; setChama(chama() + 15); sfx('item');
      W2.toast = { s: o.nm + ' chegou em ' + o.destNm + '! (chama +15)', t: 0 };
      if (o.chegou) run2(o.chegou);
    }
  });
  // a chama volta devagar perto de braseiro aceso
  if (c8Ativo() && W2.t % 30 === 0) for (const e of W2.ents) if (e.luz && e.id && String(e.id).startsWith('bras8_') && Math.abs(e.x - W2.x) + Math.abs(e.y - W2.y) <= 2) { setChama(chama() + 2); break; }
}; }
// desenho da escolta: medo como um aro em cima da cabeça
{ const _arE8 = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arE8 ? _arE8(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world') return r;
  for (const e of W2.ents) if (e.t === 'escolta') { const md = escMedo[e.k] || 0; if (md > 5) { const x = Math.round(e.px - ox + 2), y = Math.round(e.py - oy - 42); bx.fillStyle = '#1a1418'; bx.fillRect(x, y, 12, 3); bx.fillStyle = md > 70 ? '#e83a3a' : md > 40 ? '#e8a030' : '#8fe3d8'; bx.fillRect(x, y, Math.round(12 * md / 100), 3); } }
  if (c8Ativo() && (BAIRROS8.includes(W2.id) || W2.id === 'cidadeAlta')) neveFx(ox, oy, W2.t, ehNoite());
  return r;
}; }
// ---------- gelo (Cisternas) ----------
const gelo8 = () => (G.flags.c8gelo = G.flags.c8gelo || {});
function derretido(x, y) { for (const [k, [bx_, by_]] of Object.entries(BRAZ8 || {})) if (gelo8()[k] && Math.abs(bx_ - x) <= 1 && Math.abs(by_ - y) <= 1) return true; return false; }
let BRAZ8 = null;
{ const _toG = tileOf; tileOf = function (m, x, y) { const T = _toG(m, x, y); if (T && T.t === 'gelo8' && m === MAPS2.cisternas && derretido(x, y)) return KEY8._molhado || (KEY8._molhado = { t: 'molhado8' }); return T; }; }
{ const _uwG = updateWorld2; updateWorld2 = function () {
  if (V.scene === 'world' && W2.id === 'cisternas' && !W2.mv && !worldBusy2() && !W2.pego && W2.deslize) {
    const T = tileOf(W2.map, W2.x, W2.y);
    if (T.t === 'gelo8') { const [dx, dy] = DIR2[W2.deslize]; if (canStand(W2.x + dx, W2.y + dy, 'player')) { W2.dir = W2.deslize; tryStep(W2.x + dx, W2.y + dy); if (W2.t % 5 === 0) sfx('step'); } else W2.deslize = null; }
    else W2.deslize = null;
  }
  const antes = W2.mv; _uwG();
  if (W2.id === 'cisternas' && W2.mv && W2.mv !== antes) { const T = tileOf(W2.map, W2.mv.tx, W2.mv.ty); if (T.t === 'gelo8') W2.deslize = W2.dir; }
}; }
{ const _chG = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _chG ? _chG(m, ox, oy) : undefined;
  if (m && m === MAPS2.cisternas && BRAZ8) for (const [k, [bx_, by_]] of Object.entries(BRAZ8)) if (gelo8()[k]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const x = bx_ + dx, y = by_ + dy; if (m.rows[y] && m.rows[y][x] === 'i') bx.drawImage(tileArt('molhado8', (x + y) % 4), x * TS - ox, y * TS - oy); }
  return r;
}; }

// a luz da própria Lume (maior que a lanterna comum): no Inverno Escuro, ela é a vela do grupo
function luzLume8() { const r = 60 + Math.round(chama() * 0.5); return [[W2.px / TS, W2.py / TS - 0.3, r]]; }
