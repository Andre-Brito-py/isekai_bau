// ================= QUEBRA-CABEÇAS DO CAP. 5 =================
// 1) O VÃO DE BOLSO (magia espacial do baú): de frente para um objeto solto (vaso, espelho, caixote, escadinha, tábua),
//    A = "Guardar no Vão" (some para dentro da tampa). Com algo guardado, A de frente para um chão livre = "Pôr aqui".
//    Só cabe UM objeto por vez (o Vão é grande, a concentração é pequena). O objeto viaja junto entre mapas.
//    Tábua posta num VÃO dos telhados vira PONTE (dá para passar e, do outro lado, guardar de novo).
// 2) PLACAS DE PRESSÃO: só afundam com peso de verdade (vaso com terra, caixote, escadinha). O baú é leve por fora.
// 3) FEIXE DE LUZ: um emissor lança luz em linha reta; ESPELHOS (/ e \) desviam; caixote, vaso e o próprio baú
//    BLOQUEIAM; o CRISTAL AZUL abre a porta de vidro; o CRISTAL VERMELHO dispara o alarme (luta com os Vigias).
//    De frente para um espelho: "Girar" (/ <-> \) ou guardar no Vão.
// 4) HOLOFOTES (à noite na Cidade Alta; sempre nos telhados): cones que varrem; RONDAS de Vigias (cone de 4).
//    Na luz: GENTE é pega sempre; o BAÚ só se estiver ANDANDO. Pego = luta e volta ao começo do trecho.
const NOME_MOV = { vaso: 'o vaso', espelho: 'o espelho', caixa: 'o caixote', escadinha: 'a escadinha', tabua: 'a tábua' };
const ARTE_MOV = (k, o, i) => k === 'vaso' ? vasoMovelArt(i || 0) : k === 'espelho' ? espelhoArt(o || '/') : k === 'caixa' ? caixoteArt(1) : k === 'escadinha' ? escadinhaArt() : tabuaArt();
const PESADO = new Set(['vaso', 'caixa', 'escadinha']);
function movEstado(id) { G.mov = G.mov || {}; return (G.mov[id] = G.mov[id] || {}); }
function movEnt(mapId, id, d) {
  return { t: 'movel', id: 'mov_' + id, mid: id, k: d.k, o: d.o, var: d.var || 0, x: d.x, y: d.y, h: 26, ponte: !!d.ponte, passa: !!d.ponte,
    spr: function () { return this.ponte ? null : ARTE_MOV(this.k, this.o, this.var); }, talk: (e) => falaMovel(e) };
}
// monta os objetos do mapa (definições + o que o jogador trouxe/deixou aqui)
function montaMoveis() {
  const m = W2.map, id = W2.id, est = movEstado(id), defs = m.moveis || [];
  W2.ents = W2.ents.filter(e => e.t !== 'movel');
  for (const d of defs) { if (est[d.id] === null) continue; const s = est[d.id] || d; if (G.carrega && G.carrega.id === d.id) continue; W2.ents.push(Object.assign(movEnt(id, d.id, Object.assign({}, d, s)), { px: (s.x) * TS, py: (s.y) * TS, dir: 'down', mv: null, t0: 0 })); }
  for (const [k, s] of Object.entries(est)) if (s && !defs.some(d => d.id === k)) W2.ents.push(Object.assign(movEnt(id, k, s), { px: s.x * TS, py: s.y * TS, dir: 'down', mv: null, t0: 0 }));
}
{ const _lm5 = loadMap2; loadMap2 = function () { W2.cones5 = null; W2.feixe = null; const r = _lm5.apply(this, arguments); try { montaMoveis(); } catch (e) { console.error(e); } return r; }; }
async function falaMovel(e) {
  if (!G.flags.tutVao) {
    G.flags.tutVao = true;
    await say('* Você encosta a tampa no ' + (e.k === 'tabua' ? 'pedaço de madeira' : 'objeto') + '. E sente o Vão lá dentro, o quarto dobrado da base, ABRIR um pouquinho. Como uma boca que lembra que já foi boca.');
    await say('[Magia espacial: o baú pode GUARDAR um objeto solto no Vão e POR em outro lugar. Um por vez. A = guardar; com algo guardado, A de frente para o chão livre = pôr.]', 'cat');
    await say('Eu sou uma mochila. Uma mochila mágica. A Coroa pagaria uma fortuna por mim. Ainda bem que eu não estou à venda.', 'me');
  }
  const ops = e.k === 'espelho' ? ['Girar o espelho', 'Guardar no Vão', 'Deixar'] : ['Guardar no Vão', 'Deixar'];
  const c = await choose('* ' + NOME_MOV[e.k][0].toUpperCase() + NOME_MOV[e.k].slice(1) + '.', ops, 'n', ops.length - 1);
  if (e.k === 'espelho' && c === 0) { e.o = e.o === '/' ? '\\' : '/'; movEstado(W2.id)[e.mid] = { k: e.k, o: e.o, x: e.x, y: e.y, var: e.var }; sfx('equip'); return; }
  if (ops[c] !== 'Guardar no Vão') return;
  guardarNoVao(e);
}
function guardarNoVao(e) {
  if (G.carrega) { W2.toast = { s: 'O Vão já tem ' + NOME_MOV[G.carrega.k] + '. Ponha em algum lugar antes.', t: 0 }; sfx('bump'); return false; }
  G.carrega = { id: e.mid, k: e.k, o: e.o, var: e.var, de: W2.id };
  movEstado(W2.id)[e.mid] = null;
  W2.ents = W2.ents.filter(q => q !== e);
  VAO_FX.push({ x: e.x * TS + 8, y: e.y * TS + 6, t: 0, k: 'entra' }); sfx('rune');
  W2.toast = { s: 'Guardou ' + NOME_MOV[e.k] + ' no Vão', t: 0 };
  return true;
}
function porDoVao(x, y) {
  const c = G.carrega; if (!c) return false;
  const T = tileOf(W2.map, x, y), ponte = c.k === 'tabua' && T.t === 'abismo';
  if (!ponte && (T.solid || T.water || propSolid(W2.map, x, y))) { sfx('bump'); return false; }
  if (W2.ents.some(e => !e.passa && e.x === x && e.y === y) || W2.fol.some(f => f.x === x && f.y === y)) { sfx('bump'); return false; }
  const s = { k: c.k, o: c.o, var: c.var, x, y, ponte };
  movEstado(W2.id)[c.id] = s; G.carrega = null;
  W2.ents.push(Object.assign(movEnt(W2.id, c.id, s), { px: x * TS, py: y * TS, dir: 'down', mv: null, t0: 0 }));
  VAO_FX.push({ x: x * TS + 8, y: y * TS + 6, t: 0, k: 'sai' }); sfx('rune');
  if (ponte) W2.toast = { s: 'A tábua virou ponte', t: 0 };
  return true;
}
const ponteEm = (x, y) => W2.ents.some(e => e.ponte && e.x === x && e.y === y);
{ const _cs5 = canStand; canStand = function (x, y, who) {
  if (ponteEm(x, y)) { if (who === 'player') return !W2.ents.some(e => !e.passa && e.x === x && e.y === y); return W2.x !== x || W2.y !== y; }
  return _cs5(x, y, who);
}; }
// A: pôr o que está no Vão, ou guardar uma ponte (que não "fala", porque é chão)
{ const _uw5 = updateWorld2; updateWorld2 = function () {
  if (V.scene === 'world' && W2.map && !W2.mv && !worldBusy2() && JP.a) {
    const [dx, dy] = DIR2[W2.dir], tx = W2.x + dx, ty = W2.y + dy, alvo = W2.ents.find(e => !e.passa && e.x === tx && e.y === ty);
    const ponte = W2.ents.find(e => e.ponte && e.x === tx && e.y === ty);
    if (G.carrega && !alvo) { JP.a = false; porDoVao(tx, ty); }
    else if (!G.carrega && ponte && !alvo) { JP.a = false; guardarNoVao(ponte); }
  }
  _uw5();
  passoPuzzle();
}; }
// efeito: o objeto entra/sai girando num redemoinho
const VAO_FX = [];
// ---------- placas de pressão ----------
const placaApertada = (x, y) => W2.ents.some(e => e.t === 'movel' && PESADO.has(e.k) && e.x === x && e.y === y);
// ---------- feixe de luz ----------
const REFL5 = { '/': { '1,0': [0, -1], '0,-1': [1, 0], '-1,0': [0, 1], '0,1': [-1, 0] }, '\\': { '1,0': [0, 1], '0,1': [1, 0], '-1,0': [0, -1], '0,-1': [-1, 0] } };
function tracaFeixe(F) {
  const D = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
  let [x, y] = F.emissor, d = D[F.emissor[2]]; const pts = [[x, y]], vis = new Set();
  for (let n = 0; n < 300; n++) {
    x += d[0]; y += d[1]; const k = x + ',' + y + ',' + d;
    if (vis.has(k)) return { pts, fim: 'loop' }; vis.add(k);
    if (F.alvo && x === F.alvo[0] && y === F.alvo[1]) { pts.push([x, y]); return { pts, fim: 'alvo' }; }
    if (F.alarme && x === F.alarme[0] && y === F.alarme[1]) { pts.push([x, y]); return { pts, fim: 'alarme' }; }
    const T = tileOf(W2.map, x, y);
    if (T.solid || propSolid(W2.map, x, y)) { pts.push([x - d[0] * 0.5, y - d[1] * 0.5]); return { pts, fim: 'parede' }; }
    const e = W2.ents.find(q => q.x === x && q.y === y && !q.ponte && q.t !== 'trig' && q.t !== 'door');
    if (e && e.t === 'movel' && e.k === 'espelho') { pts.push([x, y]); d = REFL5[e.o][d.join(',')]; continue; }
    if (e || (W2.x === x && W2.y === y)) { pts.push([x - d[0] * 0.4, y - d[1] * 0.4]); return { pts, fim: 'bloqueio' }; }
  }
  return { pts, fim: 'longe' };
}
// ---------- holofotes ----------
function coneHolofote(h, t) {
  const [hx, hy, base] = h, B = { down: Math.PI / 2, up: -Math.PI / 2, left: Math.PI, right: 0 }[base] ?? Math.PI / 2;
  const ang = B + Math.sin(t * 0.012 + hx * 0.7) * 0.95, out = [];
  for (let y = hy - 8; y <= hy + 8; y++) for (let x = hx - 8; x <= hx + 8; x++) {
    const dx = x - hx, dy = y - hy, dist = Math.hypot(dx, dy); if (dist < 1 || dist > 7.5) continue;
    let da = Math.atan2(dy, dx) - ang; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    if (Math.abs(da) > 0.26 + 0.6 / dist) continue;
    let ok = true; for (let k = 1; ok && k < dist; k++) { const ix = Math.round(hx + dx * k / dist), iy = Math.round(hy + dy * k / dist); const T = tileOf(W2.map, ix, iy); if ((T.solid && T.t !== 'abismo' && T.t !== 'sebe') || propSolid(W2.map, ix, iy)) ok = false; if (T.t === 'sebe' && k < dist - 0.5) ok = false; }
    if (ok && x >= 0 && y >= 0 && x < W2.map.w && y < W2.map.h) out.push([x, y]);
  }
  return { ang, tiles: out };
}
const holofotesAtivos = (m) => (m.holofotes || []).length && (m.holofotesSempre || ehNoite());
// ---------- o passo de cada quadro: feixe, placas, holofotes, rondas ----------
function passoPuzzle() {
  const m = W2.map; if (!m || V.scene !== 'world') return;
  for (const f of VAO_FX) f.t++; while (VAO_FX.length && VAO_FX[0].t > 24) VAO_FX.shift();
  if (m.feixe) {
    const r = tracaFeixe(m.feixe); W2.feixe = r;
    if (r.fim === 'alvo' && !G.flags[m.feixe.flag]) { G.flags[m.feixe.flag] = true; sfx('rune'); W2.toast = { s: 'A luz acende o cristal: a porta de vidro abre!', t: 0 }; }
    if (r.fim === 'alarme' && !worldBusy2() && !W2.pego) { W2.alarmeT = (W2.alarmeT || 0) + 1; if (W2.alarmeT === 1) W2.toast = { s: 'O cristal VERMELHO está esquentando!', t: 0 }; if (W2.alarmeT > 70) { W2.alarmeT = 0; W2.pego = true; run2(() => pegoNaLuz(m, 'alarme')); } }
    else W2.alarmeT = 0;
  }
  if (m.placas && m.onPlacas && !G.flags[m.placasFlag]) { if (m.placas.every(([x, y]) => placaApertada(x, y))) { G.flags[m.placasFlag] = true; run2(m.onPlacas); } }
  if (worldBusy2() || W2.pego) return;
  // holofotes e rondas
  const visto = (tiles) => tiles.some(([x, y]) => (x === W2.x && y === W2.y) || (W2.mv && x === W2.mv.tx && y === W2.mv.ty));
  const pegaria = () => (typeof rostoSt === 'function' && rostoSt().on) || !!W2.mv;
  if (holofotesAtivos(m)) {
    W2.cones5 = m.holofotes.map(h => coneHolofote(h, W2.t));
    for (const c of W2.cones5) if (visto(c.tiles)) { if (pegaria()) { W2.pego = true; run2(() => pegoNaLuz(m, 'holofote')); return; } }
  } else W2.cones5 = null;
  if (m.stealth) for (const e of W2.ents) if (e.t === 'ronda' && !(e.gone && e.gone())) {
    const c = coneRonda(e); if (visto(c)) { if (pegaria()) { W2.pego = true; run2(() => pegoNaLuz(m, 'ronda', e)); return; } if (!e.olhou) { e.olhou = 1; e.emote = { s: pickOne(['Hm. Um baú no jardim?', 'Entrega atrasada...', 'Coisa de rico. Deixa.']), t: 80 }; } }
    else e.olhou = 0;
  }
}
async function pegoNaLuz(m, como, e) {
  sfx('cancel'); V.shake = 6; if (e) e.emote = { s: '!', t: 40 };
  await say(como === 'alarme' ? '* O cristal vermelho apita como uma chaleira. De trás das colunas de vidro, saem os Vigias.' : rostoSt().on ? pickOne(['* "PARADO! Quem anda pelo jardim a essa hora?"', '* A luz para em você. Um apito. Passos de vidro.']) : '* A luz para em você no meio do passo. Baú não anda. Este anda.');
  if (!G.flags.tutLuz5) { G.flags.tutLuz5 = true; await say('[Na luz: GENTE é pega sempre; o BAÚ só se estiver ANDANDO. Espere o facho passar, ou pare dentro dele.]', 'cat'); }
  const r = await lutaMapa(m.grupoLuz || ['vigia', 'vigia'], { bg: m.batBg });
  if (r !== 'win') { W2.pego = false; return; }
  await fadeOut(12); if (rostoSt().on && typeof desfazRosto === 'function') desfazRosto();
  const [x, y] = typeof m.reinicio === 'function' ? m.reinicio() : m.reinicio || [W2.x, W2.y];
  loadMap2(W2.id, x, y, 'up'); W2.pego = false; await fadeIn(12);
  await say(pickOne(['De volta ao começo. A luz não esquece rápido.', 'Tá. Agora com calma. Eu sou um baú. Baú tem calma.', 'Respira. Espera o facho passar.']), 'me');
}
// ---------- desenho: placas (no chão), feixe, holofotes, cones das rondas, o que está no Vão ----------
{ const _ch5 = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _ch5 ? _ch5(m, ox, oy) : undefined;
  if (m && m.placas) for (const [x, y] of m.placas) bx.drawImage(placaPressaoArt(placaApertada(x, y)), x * TS - ox, y * TS - oy);
  for (const e of W2.ents) if (e.ponte) { const im = tabuaArt(); bx.drawImage(im, e.x * TS - ox - 1, e.y * TS - oy + 1); bx.drawImage(im, e.x * TS - ox - 1, e.y * TS - oy + 7); }
  return r;
}; }
{ const _ar5 = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _ar5 ? _ar5(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world') return r;
  // holofotes: cones de luz quente
  if (W2.cones5 && m.holofotes && W2.cones5.length === m.holofotes.length) {
    bx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < W2.cones5.length; i++) { const [hx, hy] = m.holofotes[i], c = W2.cones5[i];
      for (const [x, y] of c.tiles) { const d = Math.hypot(x - hx, y - hy); bx.fillStyle = `rgba(255,236,170,${0.22 - d * 0.018})`; bx.fillRect(x * TS - ox, y * TS - oy, TS, TS); }
      bx.fillStyle = 'rgba(255,240,190,0.5)'; bx.beginPath(); bx.arc(hx * TS + 8 - ox, hy * TS + 4 - oy, 5, 0, Math.PI * 2); bx.fill(); }
    bx.globalCompositeOperation = 'source-over';
  }
  if (m.stealth) { bx.globalCompositeOperation = 'lighter'; for (const e of W2.ents) if (e.t === 'ronda' && !(e.gone && e.gone())) for (const [x, y] of coneRonda(e)) { bx.fillStyle = 'rgba(160,220,255,0.12)'; bx.fillRect(x * TS - ox, y * TS - oy, TS, TS); } bx.globalCompositeOperation = 'source-over'; }
  // o feixe: linha de luz com brilho e faíscas nas pontas
  if (m.feixe && W2.feixe) {
    const P = W2.feixe.pts.map(([x, y]) => [x * TS + 8 - ox, y * TS + 6 - oy]), cor = W2.feixe.fim === 'alarme' ? [255, 90, 90] : [255, 232, 150];
    bx.globalCompositeOperation = 'lighter';
    for (const [w, a] of [[7, 0.12], [3, 0.35], [1, 0.95]]) { bx.strokeStyle = `rgba(${cor[0]},${cor[1]},${cor[2]},${a})`; bx.lineWidth = w; bx.beginPath(); P.forEach(([x, y], i) => i ? bx.lineTo(x, y) : bx.moveTo(x, y)); bx.stroke(); }
    const [ex, ey] = P[P.length - 1]; const g = bx.createRadialGradient(ex, ey, 0, ex, ey, 12); g.addColorStop(0, `rgba(${cor[0]},${cor[1]},${cor[2]},0.7)`); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(ex - 12, ey - 12, 24, 24);
    for (let i = 0; i < 3; i++) { bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(ex + Math.sin(W2.t * 0.3 + i * 2) * 5), Math.round(ey + Math.cos(W2.t * 0.27 + i) * 4), 1, 1); }
    bx.globalCompositeOperation = 'source-over';
  }
  // redemoinho do Vão
  for (const f of VAO_FX) { const p = f.t / 24, rr = (f.k === 'entra' ? 1 - p : p) * 14 + 2; bx.strokeStyle = `rgba(190,140,255,${0.8 * (1 - p)})`; bx.lineWidth = 1; for (let i = 0; i < 3; i++) { bx.beginPath(); bx.arc(f.x - ox, f.y - oy, rr * (1 - i * 0.25), f.t * 0.4 + i * 2, f.t * 0.4 + i * 2 + 3.5); bx.stroke(); } }
  // o que está no Vão: um ícone pequeno girando em cima do baú
  if (G.carrega && !UI.stack.length) { const im = ARTE_MOV(G.carrega.k, G.carrega.o, G.carrega.var), s = 0.55, bob = Math.sin(W2.t * 0.1) * 1.5, x = W2.px + 8 - ox, y = W2.py - 22 - oy + bob;
    bx.fillStyle = 'rgba(90,60,140,0.5)'; bx.beginPath(); bx.ellipse(x, y + 4, 9, 6, 0, 0, Math.PI * 2); bx.fill();
    bx.drawImage(im, Math.round(x - im.width * s / 2), Math.round(y - im.height * s / 2), Math.round(im.width * s), Math.round(im.height * s)); }
  return r;
}; }
