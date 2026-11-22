// ================= DIA E NOITE =================
// O relógio corre enquanto o grupo anda pelo mapa (1 minuto do jogo por segundo: um dia inteiro em 24 minutos).
// A NOITE muda o jogo:
//  - a Lume volta a ser LUSTRE (mais magia, luz e fogo; menos vida; não usa equipamento; ilumina em volta);
//  - o céu escurece, os postes da Coroa acendem (os Pavios acendem ao entardecer), as janelas brilham;
//  - crianças, fofoqueiras e trabalhadores vão dormir; outros só aparecem de noite;
//  - os Caçadores enxergam menos (cone menor), mas carregam lanterna;
//  - os bichos ficam mais bravos (ATQ +10%);
//  - no Marco dá para descansar até a manhã ou até a noite.
// A primeira noite tem cena própria: é quando o jogador descobre a forma noturna da Lume.

const MIN_POR_QUADRO = 1 / 60;
function hora() { return G.hora ?? 9 * 60; }
function ehNoite(h = hora()) { return h >= 19 * 60 || h < 5 * 60; }
function fase(h = hora()) { return h < 5 * 60 ? 'madrugada' : h < 7 * 60 ? 'amanhecer' : h < 12 * 60 ? 'manha' : h < 17.5 * 60 ? 'tarde' : h < 19 * 60 ? 'entardecer' : 'noite'; }
function relogio() { const h = Math.floor(hora() / 60), m = Math.floor(hora() % 60); return `${h}:${String(m).padStart(2, '0')}`; }
const LUSTRE_ON = () => ehNoite() && G.flags && G.flags.lumeNoite;

function passaTempo() {
  if (!G.flags || !G.flags.c2Init || V.scene !== 'world' || worldBusy2()) return;
  const antes = ehNoite(), fAntes = fase();
  G.hora = (hora() + MIN_POR_QUADRO) % 1440;
  // caçadores: menos visão no escuro
  if (W2.t % 30 === 0) for (const e of W2.ents) if (e.t === 'hunter') { e.vis0 = e.vis0 ?? e.vis; e.vis = e.vis0 - (ehNoite() ? 2 : 0); e.luz = ehNoite() ? 34 : 0; }
  if (fAntes !== fase() && fase() === 'entardecer') W2.toast = { s: 'Entardece em Velhágua', t: 0 };
  if (antes !== ehNoite()) run2(virouPeriodo);
}
async function virouPeriodo() {
  const noite = ehNoite();
  if (noite && !G.flags.lumeNoite) { await primeiraNoite(); }
  else { sfx(noite ? 'rune' : 'select'); W2.toast = { s: noite ? 'Anoiteceu · ' + relogio() : 'Amanheceu · ' + relogio(), t: 0 }; }
  // os moradores trocam de turno
  await fadeOut(10); loadMap2(W2.id, W2.x, W2.y, W2.dir); await fadeIn(10);
}
async function primeiraNoite() {
  await say('* O sol escorrega para trás da serra. A Lume para no meio do passo.');
  await say('Ah, não. Não, não, não. Eu esqueci. Eu ESQUECI completamente.', 'lume');
  sfx('catalog'); V.shake = 6;
  G.flags.lumeNoite = true;
  for (const f of W2.fol) if (f.k === 'lume') { f.virou = 40; }
  await say('* A Lume treme e encolhe. As velas do cabelo dela crescem até virarem um lustre inteiro, de velas tortas acesas, flutuando do seu lado.');
  await say('...De noite eu volto a ser isso. Lá embaixo eu era lustre o tempo todo. Aqui em cima, só quando o sol vai embora.', 'lume');
  await say('Bom. Pelo menos agora ninguém precisa de lanterna.', 'rita');
  await say('De lustre eu brilho mais e as runas saem quentes. Mas não seguro nada: nem equipamento, nem a sua mão, @.', 'lume');
  await say('* (NOITE: a Lume vira LUSTRE: mais magia, golpes de luz e fogo, menos vida e sem equipamentos. Lojas fecham, alguns moradores dormem e os Caçadores enxergam menos. Num Marco dá para descansar até o dia.)');
  save2();
}

// ---------- o céu do mapa ----------
let CEU_C = null;
function desenhaCeu(m, ox, oy) {
  if (!G.flags || !G.flags.c2Init) return;
  const h = hora(), f = fase(h);
  const interior = !m.hunters && !m.batBg && !m.music2 && (m.name || '').match(/Bazar|Taverna|Casa/);
  // quanto escurece e de que cor
  let a = 0, cor = '10,14,48';
  if (f === 'noite' || f === 'madrugada') a = 0.62;
  else if (f === 'entardecer') { const p = (h - 17.5 * 60) / 90; a = 0.12 + p * 0.45; cor = p < 0.5 ? '120,50,30' : '40,24,70'; }
  else if (f === 'amanhecer') { const p = (h - 5 * 60) / 120; a = 0.45 * (1 - p); cor = '60,40,80'; }
  if (interior) a *= 0.35;
  if (m.dark) a *= 0.4;
  if (a <= 0.01) return;
  if (!CEU_C || CEU_C.width !== W) CEU_C = mk(W, H);
  const x = CEU_C.getContext('2d');
  x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); x.fillStyle = `rgba(${cor},${a})`; x.fillRect(0, 0, W, H);
  const luzes = luzesDoMapa(m, ox, oy, a);
  x.globalCompositeOperation = 'destination-out';
  for (const [lx, ly, r] of luzes) { const g = x.createRadialGradient(lx, ly, r * 0.15, lx, ly, r); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(lx - r, ly - r, r * 2, r * 2); }
  bx.drawImage(CEU_C, 0, 0);
  // brilho quente por cima das luzes (só quando está escuro de verdade)
  if (a > 0.3) luzSoma(() => { for (const [lx, ly, r, quente] of luzes) if (quente) { const g = bx.createRadialGradient(lx, ly, 0, lx, ly, r * 0.6); g.addColorStop(0, 'rgba(255,190,100,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(lx - r, ly - r, r * 2, r * 2); } });
  // estrelas no alto do mapa à noite
  if (a > 0.5 && !interior) for (let i = 0; i < 18; i++) { const sx = (i * 73 + 11) % W, sy = (i * 37) % 40; if (oy > 40) break; if ((W2.t + i * 13) % 90 < 70) { bx.fillStyle = i % 3 ? '#c8d8ff' : '#ffffff'; bx.fillRect(sx, sy - oy * 0.3, 1, 1); } }
}
function luzesDoMapa(m, ox, oy, a) {
  const L = [];
  // o grupo: um brilho pequeno; com a Lume de lustre, um brilho grande e quente
  const lume = W2.fol.find(f => f.k === 'lume');
  if (LUSTRE_ON() && lume && !W2.float) L.push([lume.px - ox + 8, lume.py - oy - 10, 70 + Math.sin(W2.t / 7) * 3, true]);
  else L.push([W2.px - ox + 8, W2.py - oy + 4, 34, false]);
  if (LUSTRE_ON() && W2.float) L.push([W2.px - ox + 8, W2.py - oy, 60, true]);
  // postes (acesos do entardecer em diante) e Marcos
  for (const pr of m.props || []) if (pr.poste) L.push([pr.x * TS - ox + 8, pr.y * TS - oy - 116, 46, true]);
  for (const e of W2.ents) {
    if (e.t === 'door' && !m.name.match(/Bazar|Taverna|Casa/)) L.push([e.px - ox + 8, e.py - oy - 18, 26, true]);
    if (e.t === 'marco') L.push([e.px - ox + 8, e.py - oy - 10, 30, false]);
    if (e.luz) L.push([e.px - ox + 8, e.py - oy - 18, e.luz, true]);
  }
  for (const l of m.lights || []) L.push([l[0] * TS - ox + 8, l[1] * TS - oy + 8, l[2], true]);
  return L;
}

// ---------- a Lume de lustre no mapa (segue flutuando) ----------
{ const _fs = folSprite; folSprite = function (f) {
  if (f.k === 'lume' && LUSTRE_ON() && IMG.sp.lume) {
    const S = IMG.sp.lume, fr = S[Math.floor((W2.t + 7) / 10) % S.length];
    f.bob = -10 + Math.round(Math.sin(W2.t / 14) * 2);
    if (f.virou > 0) { f.virou--; for (let i = 0; i < 2; i++) part2mundo(f); }
    return fr;
  }
  if (f.k === 'lume') f.bob = 0;
  return _fs(f);
}; }
function part2mundo(f) { /* faíscas da transformação: desenhadas direto, sem sistema de partículas no mapa */ const [ox, oy] = W2.cam || [0, 0]; bx.fillStyle = pickOne(['#ffe066', '#ffffff', '#ffb030']); bx.fillRect(Math.round(f.px - ox + 8 + rand(-12, 12)), Math.round(f.py - oy - rand(0, 34)), 1, 2); }

// ---------- HUD: relógio com sol ou lua ----------
{ const _hud = hudMundo; hudMundo = function (m) {
  _hud(m);
  if (!G.flags || !G.flags.c2Init) return;
  const x = 100, y = 4, n = ehNoite();
  box(x, y, 56, 15, { bw: 1 });
  if (n) { fxDisc(x + 9, y + 7.5, 4, '#e8e8ff'); fxDisc(x + 11, y + 6, 3.4, '#0e1220'); }
  else { bx.fillStyle = fase() === 'entardecer' ? '#ff9a50' : '#ffd060'; bx.fillRect(x + 5, y + 5, 6, 5); bx.fillRect(x + 6, y + 4, 4, 7); for (const [dx, dy] of [[-2, 0], [8, 0], [3, -3], [3, 8]]) bx.fillRect(x + 5 + dx, y + 7 + dy, 1, 1); }
  txt(relogio(), x + 51, y + 2, { align: 'right', col: n ? '#c8d8ff' : '#ffe8b0' });
}; }

// ---------- moradores por turno ----------
const DORME = ['pedrinho', 'zefa', 'lurdes', 'dita', 'joao', 'nico'];
{ const _mm = montarMapas2; montarMapas2 = function () {
  _mm();
  for (const m of Object.values(MAPS2)) for (const e of m.ents || []) if (DORME.includes(e.id)) { const g0 = e.gone; e.gone = () => (g0 && g0()) || ehNoite(); }
  // postes acendem no entardecer (os Pavios passam acendendo)
  for (const m of Object.values(MAPS2)) for (const pr of m.props || []) if (pr.solid && pr.solid.length === 1 && pr.solid[0][2] === 1 && pr.solid[0][3] === 1 && pr.x % 1 !== 0 && m === MAPS2.praca) { pr.poste = true; pr.img = () => (h => (h >= 18 * 60 || h < 5.5 * 60 || G.flags.c2Fim) ? postes.on() : postes.off())(hora()); }
  // o Zé pesca de noite com lampião
  const ze = MAPS2.cais.ents.find(e => e.id === 'ze'); if (ze) Object.defineProperty(ze, 'luz', { get: () => ehNoite() ? 30 : 0, enumerable: true, configurable: true });
}; }
// a Dona Graça atende de pijama
{ const _fg = falaGraca; falaGraca = async function () { if (ehNoite() && !G.flags.gracaNoite) { G.flags.gracaNoite = true; await say('* A Dona Graça abre a portinhola de touca e pijama.'); await say('Isso é hora? ...Tá bom. Pra mala com dente eu abro. Mas é rapidinho.', 'graca'); } return _fg(); }; }
// o retrato da Lume acompanha a forma
{ const w = WHO.lume; const p0 = w.portrait; w.portrait = (...a) => (LUSTRE_ON() && V.scene !== 'title' && PTC !== undefined ? PT('lume') : p0(...a)); }

// ---------- Marco: descansar até a manhã ou até a noite ----------
{ const _um = usarMarco; usarMarco = async function (e) {
  await _um(e);
  const c = await choose('Descansar até quando?', ['Só um pouco (seguir agora)', 'Até a manhã', 'Até a noite'], 'n', 0);
  if (c === 0) return;
  await fadeOut(20);
  G.hora = c === 1 ? 7 * 60 : 19 * 60 + 30;
  if (c === 2 && !G.flags.lumeNoite) { loadMap2(W2.id, W2.x, W2.y, W2.dir); await fadeIn(16); await primeiraNoite(); save2(); return; }
  save2(); loadMap2(W2.id, W2.x, W2.y, W2.dir); await fadeIn(20);
  W2.toast = { s: (c === 1 ? 'Manhã · ' : 'Noite · ') + relogio(), t: 0 };
}; }

// ---------- a Lume de lustre em batalha ----------
const LUSTRE_FR = new Map();
function lustreFrame(u) {
  const S = IMG.sp.lume; if (!S) return null;
  const i = Math.floor(BT.t / 10) % S.length, bob = Math.round(Math.sin(BT.t / 14) * 2), k = i + '|' + bob + '|' + (u.hp <= 0 ? 1 : 0);
  if (LUSTRE_FR.has(k)) return LUSTRE_FR.get(k);
  const c = mk(24, 48), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  if (u.hp <= 0) x.drawImage(S[0], 0, 16); else x.drawImage(S[i], 0, 4 + bob);
  LUSTRE_FR.set(k, c); return c;
}
function velasLustre(u) { const X = u._X ?? (u.x - 12), Y = u._Y ?? (u.y - 48), b = Math.round(Math.sin(BT.t / 14) * 2); return [[X + 3, Y + 10 + b], [X + 12, Y + 4 + b], [X + 21, Y + 10 + b]]; }
function brilhoLustre(u) { if (u.hp <= 0) return; const [, [x, y]] = velasLustre(u); brilho(x, y + 10, 26 + Math.sin(BT.t / 6) * 2, 'rgba(255,200,110,0.35)', 1); }
async function lustreAtk(m, t) {
  // as três velas disparam chamas em sequência (luz)
  const ok = await (async () => { await tw(8, p => { m.oy = -p * 4; m.rot = Math.sin(p * Math.PI) * 0.15; }); return timedPrompt(t, 20); })();
  const vs = velasLustre(m), n = ok ? 4 : 3;
  for (let i = 0; i < n; i++) {
    const [vx, vy] = vs[i % 3]; sfx('brasa');
    await projectile({ _pt: [vx, vy] }, t, '#ffd060', 9, { r: 2, arc: 14 - i * 4, trail: ['#ffd060', '#ff9a30', '#ffffff'] });
    hitFoe(m, t, 0.38, { el: 'luz', mag: true, crit: ok && i === 3 });
    if (t.hp <= 0) break;
  }
  if (ok) BT.stats.crit++;
  await tw(8, p => { m.oy = -4 * (1 - p); m.rot = 0; });
}
RUNA2.chuvaCera = { nm: 'Chuva de Cera', mp: 10, tgt: 'all', d: 'Só de lustre: o lustre balança e pinga cera em chamas em todos os inimigos (fogo).', run: async (m) => {
  sfx('brasa');
  await tw(14, p => { m.rot = Math.sin(p * Math.PI * 3) * 0.3; });
  m.rot = 0;
  const gotas = []; for (const t of alive(BT.foes)) for (let i = 0; i < 4; i++) gotas.push({ t, d: i * 4 + Math.random() * 3, dx: rand(-10, 10) });
  await tw(30, (p, k) => { for (const g of gotas) { const q = (k - g.d) / 12; if (q < 0 || q > 1) continue; const [x, y] = unitCenter(g.t), yy = -10 + (y - 4) * ease.in(q); bx.fillStyle = '#ffe066'; bx.fillRect(Math.round(x + g.dx), Math.round(yy), 2, 4); bx.fillStyle = '#ff9a30'; bx.fillRect(Math.round(x + g.dx), Math.round(yy) - 3, 2, 3); } });
  for (const t of alive(BT.foes)) { hitFoe(m, t, 0.75, { el: 'fogo', mag: true, ranged: true }); if (Math.random() < 0.3) t.st.queimado = 2; }
} };
{ const _ga = grupoAtual; grupoAtual = function () {
  const g = _ga();
  const lu = g.find(m => m.id === 'lume');
  if (lu && LUSTRE_ON()) {
    const md = eqMods('lume'); for (const [a, v] of Object.entries(md)) lu[a] = Math.max(1, (lu[a] || 0) - v);
    lu.eqFx = new Set(); lu.runas = (lu.runas || []).map(r => r === 'acalantoCoro' ? 'acalanto' : r);
    lu.mhp = Math.round(lu.mhp * 0.82); lu.hp = Math.min(lu.hp, lu.mhp); lu.mag = Math.round(lu.mag * 1.3) + 2; lu.spd += 2; lu.mmp += 10;
    Object.assign(lu, { P: { lean: 0, crouch: 0, stride: 0, head: 0, arm: null, glow: 0 }, lustre: true, port: 'lume', h: 40, frame: lustreFrame, over: null, under: brilhoLustre, attack: lustreAtk, atkNm: 'Chama-Vela', atkIcon: 'luz',
      atkDesc: 'As três velas do lustre disparam chamas num inimigo (luz). A no tempo certo = quatro chamas.', magNm: 'Cantigas', runas: [...new Set([...(lu.runas || []), 'chuvaCera'])] });
  }
  return g;
}; }
// a pose do boneco não se aplica ao lustre
{ const _ps = pose; pose = function (u, alvo, n, ez) { if (u.lustre) return tw(Math.max(1, n | 0), () => { }); return _ps(u, alvo, n, ez); }; }
{ const _rp = resetPose; resetPose = function (u, n) { if (u.lustre) return tw(Math.max(1, n | 0), () => { }); return _rp(u, n); }; }
{ const _lf = lumeFlutua; lumeFlutua = function (m, alt, n) { if (m.lustre) return tw(n || 8, () => { }); return _lf(m, alt, n); }; }
{ const _ml = maoLume; maoLume = function (u) { if (u.lustre) return velasLustre(u)[1]; return _ml(u); }; }
{ const _vl = velaLume; velaLume = function (u) { if (u.lustre) return velasLustre(u)[1]; return _vl(u); }; }

// ---------- lutas de noite: céu escuro e bichos mais bravos ----------
{ const _lm = lutaMapa; lutaMapa = function (g, o = {}) { if (G.flags && G.flags.c2Init && ehNoite() && W2.map && !(W2.map.name || '').match(/Bazar|Taverna|Casa|Poço/)) o = Object.assign({}, o, { extra: Object.assign({}, o.extra || {}, { noite: true }) }); return _lm(g, o); }; }
{ const _b2 = battle2; battle2 = function (cfg) { const p = _b2(cfg); if (cfg.noite) for (const f of BT.foes) f.atk = Math.round(f.atk * 1.1); return p; }; }
