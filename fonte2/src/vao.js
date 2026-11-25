// ================= O SIGILO DO VÃO (pedido do usuário: elemento LENDÁRIO, visual caprichado) =================
// 14º elemento, só do baú (o Grimório é dele). Aprendido no Cap. 8, depois do fio de âmbar: ao abrir a mesa/Grimório, a
// tinta cai PARA DENTRO da página e a voz (ainda sem nome) ensina a traçar "a fechadura do lado de dentro".
// MECÂNICA: todo golpe de Vão IGNORA 60% da defesa (o golpe atravessa o espaço). Por forma:
//  Dardo/Corrente/Lança-base: tira 1 de escudo mesmo sem fraqueza · Onda/Coro: PUXA todos (a vez atrasa 30) ·
//  Âncora: PRENDE no espaço (cancela o golpe preparado e atrasa 40) · Mina: abre uma FENDA que engole o próximo golpe do
//  alvo · Chave: -2 de escudo a mais · Véu: GUARDA o aliado no Vão (o próximo golpe erra e a vez adianta 35).
// Custa caro: +6 PM e +2 de tinta. Fusões: Vão+Âmbar = BOLSO DO TEMPO (atrasa 60), Vão+Sombra = PORTA ESCURA (ignora
// toda a defesa, enfraquece). VISUAL: fendas de espaço com céu estrelado dentro, anel de runas girando, arcos de lente,
// a mordida saindo da fenda, rachaduras de vidro no ar e estilhaços.
Object.assign(EL3, { vao: { nm: 'Vão', el: null, col: '#b890ff', cols: ['#b890ff', '#ffffff', '#2a1050'], d: 'espaço dobrado (lendário, só o baú): ignora 60% da defesa; o efeito muda com a forma' } });
ORD_EL.push('vao');
Object.assign(SIG3, { vao: ['...###...', '..#...#..', '..#.#.#..', '..#...#..', '...#.#...', '...#.#...', '..##.##..', '..#...#..', '..#####..'] });
Object.assign(FUS3, {
  'ambar+vao': { nm: 'Bolso do Tempo', col: '#e0b0ff', cols: ['#ffd890', '#b890ff', '#ffffff'], hits: [[null, 0.6]], tempo: 60, d: 'o alvo cai num bolso onde o tempo anda devagar: a vez dele atrasa MUITO', veu: 'bolso', nota: '"Vão + Âmbar = Bolso do Tempo. Eu não sei explicar isso. Eu só sei que é lindo." (O Catálogo)' },
  'sombra+vao': { nm: 'Porta Escura', col: '#7a5ab8', cols: ['#1a0a30', '#b890ff', '#5a3a8a'], hits: [[null, 1.1]], fraco: true, pierceTotal: true, d: 'uma porta que abre DENTRO do inimigo: ignora toda a defesa e enfraquece o próximo golpe', veu: 'porta', nota: '"Vão + Sombra = Porta Escura. Nunca abra isso dentro de casa." (O Catálogo)' }
});
Object.assign(VEU3, { vao: { nm: 'Guardado no Vão', d: 'o aliado some dentro do baú: o próximo golpe erra e a vez dele adianta' }, bolso: { nm: 'Bolso do Tempo', d: 'a vez do aliado chega quase na hora' }, porta: { nm: 'Porta Escura', d: 'some na porta: o próximo golpe erra, e ele volta com Manto (+30% por 3)' } });
const temVao = s => !!(s && s.e && s.e.includes('vao'));
{ const _pgV = pagina3; pagina3 = function (s) { const P = _pgV(s); if (temVao(s)) { P.mp += 6; } return P; }; }
{ const _ctV = custoTinta; custoTinta = function (s) { return _ctV(s) + (temVao(s) ? 2 : 0); }; }

// ---------- desenho: a fenda ----------
const VAO_ESTRELAS = Array.from({ length: 46 }, (_, i) => [((i * 137.5) % 360) * Math.PI / 180, Math.sqrt(((i * 73) % 97) / 97), (i * 31) % 60]);
function fendaVao(x, y, rx, ry, p, o = {}) {
  if (p <= 0.01) return;
  const RX = Math.max(1, rx * p), RY = Math.max(1, ry * p), T = FRAME;
  // halo e arcos de lente (o espaço em volta entorta)
  bx.globalAlpha = 0.18 * p; bx.fillStyle = '#b890ff'; bx.beginPath(); bx.ellipse(x, y, RX + 10, RY + 8, 0, 0, Math.PI * 2); bx.fill();
  bx.globalAlpha = 0.5 * p; bx.strokeStyle = '#d8c0ff'; bx.lineWidth = 1;
  for (let i = 0; i < 3; i++) { const a0 = T * 0.02 * (i % 2 ? -1 : 1) + i * 2.1; bx.beginPath(); bx.ellipse(x, y, RX + 5 + i * 4, RY + 3 + i * 3, 0, a0, a0 + 1.1); bx.stroke(); }
  // o vazio, com céu dentro
  bx.globalAlpha = Math.min(1, p * 1.3); bx.fillStyle = '#05020c'; bx.beginPath(); bx.ellipse(x, y, RX, RY, 0, 0, Math.PI * 2); bx.fill();
  bx.save(); bx.beginPath(); bx.ellipse(x, y, RX, RY, 0, 0, Math.PI * 2); bx.clip();
  bx.globalAlpha = 0.35 * p; bx.fillStyle = '#2a1050'; bx.beginPath(); bx.ellipse(x - RX * 0.3, y + RY * 0.2, RX * 0.7, RY * 0.5, 0.4, 0, Math.PI * 2); bx.fill();
  bx.fillStyle = '#1a3a6a'; bx.beginPath(); bx.ellipse(x + RX * 0.35, y - RY * 0.25, RX * 0.5, RY * 0.35, -0.5, 0, Math.PI * 2); bx.fill();
  for (const [a, r, f] of VAO_ESTRELAS) {
    const sw = o.puxa ? (T * 0.04 + r * 3) : T * 0.004, rr = o.puxa ? r * (1 - ((T * 0.01 + f) % 1) * 0.6) : r;
    const sx = x + Math.cos(a + sw) * RX * rr, sy = y + Math.sin(a + sw) * RY * rr, tw = (Math.sin(T * 0.15 + f) + 1) / 2;
    bx.globalAlpha = p * (0.4 + tw * 0.6); bx.fillStyle = f % 7 === 0 ? '#ffd890' : f % 5 === 0 ? '#8fe3ff' : '#ffffff';
    bx.fillRect(Math.round(sx), Math.round(sy), 1, 1); if (f % 11 === 0 && tw > 0.7) { bx.fillRect(Math.round(sx) - 1, Math.round(sy), 3, 1); bx.fillRect(Math.round(sx), Math.round(sy) - 1, 1, 3); }
  }
  bx.restore();
  // a borda: violeta, branca por dentro, com marcas de runa girando
  bx.globalAlpha = p; bx.strokeStyle = '#8a5ad8'; bx.lineWidth = 2; bx.beginPath(); bx.ellipse(x, y, RX + 1, RY + 1, 0, 0, Math.PI * 2); bx.stroke();
  bx.strokeStyle = '#ffffff'; bx.lineWidth = 1; bx.beginPath(); bx.ellipse(x, y, RX, RY, 0, 0, Math.PI * 2); bx.stroke();
  for (let i = 0; i < 8; i++) { const a = T * 0.03 + i * Math.PI / 4, tx = x + Math.cos(a) * (RX + 4), ty = y + Math.sin(a) * (RY + 3); bx.fillStyle = i % 2 ? '#d8c0ff' : '#ffd890'; bx.fillRect(Math.round(tx), Math.round(ty), i % 2 ? 1 : 2, i % 2 ? 2 : 1); }
  bx.globalAlpha = 1;
}
function rachaduras(x, y, r, p, seed = 1) {
  bx.globalAlpha = Math.max(0, 1 - p) ; bx.strokeStyle = '#ffffff'; bx.lineWidth = 1;
  for (let i = 0; i < 9; i++) { let a = i * 0.7 + seed, px = x, py = y; bx.beginPath(); bx.moveTo(px, py); for (let j = 1; j <= 4; j++) { a += ((i * 7 + j * 3) % 5 - 2) * 0.25; const d = r * (0.3 + p * 0.7) * j / 4; px = x + Math.cos(a) * d; py = y + Math.sin(a) * d; bx.lineTo(px, py); } bx.strokeStyle = i % 3 ? '#ffffff' : '#c8a0ff'; bx.stroke(); }
  bx.globalAlpha = 1;
}
function estilhacos(x, y, n = 14) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = rand(0.8, 2.8); part({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, g: 0.12, life: rand(18, 34) | 0, col: pickOne(['#ffffff', '#d8c0ff', '#8a5ad8', '#ffd890']), sz: pickOne([1, 1, 2]) }); } }
function escurecerVao(a) { bx.globalAlpha = a; bx.fillStyle = '#0a0418'; bx.fillRect(0, 0, 240, 240); bx.globalAlpha = 1; }
function dentesNaFenda(x, y, rx, ry, fecha) {   // a mordida do baú saindo do vazio
  const g = Math.round(ry * (1 - fecha) * 0.9);
  for (const lado of [-1, 1]) for (let i = -3; i <= 3; i++) { const tx = x + i * rx * 0.28, ty = y + lado * g; bx.fillStyle = '#f2ecdc'; bx.beginPath(); bx.moveTo(tx - 3, ty); bx.lineTo(tx + 3, ty); bx.lineTo(tx, ty - lado * 5); bx.closePath(); bx.fill(); bx.fillStyle = '#b8a888'; bx.fillRect(Math.round(tx), Math.round(ty - lado * 1), 1, 1); }
}
// ---------- as animações do Vão (as normais continuam para os outros elementos) ----------
{ const _tdV = tipoDe; tipoDe = function (s) { return temVao(s) ? 'vao' : _tdV(s); }; }
{ const _bcV = bauConjura; bauConjura = async function (m, col, n) {
  if (col !== EL3.vao.col && !(BT._vaoCast)) return _bcV(m, col, n);
  const [x, y] = unitCenter(m); sfx('rune');
  await tw(22, p => { escurecerVao(0.45 * p); fendaVao(x, y - 20, 8, 10, ease.out(p)); luzMagia(x, y - 20, 18, '#b890ff', 0.4 * p); for (let i = 0; i < 2; i++) part({ x: x + rand(-14, 14), y: y + rand(-6, 10), vy: -rand(0.4, 1), life: 18, col: pickOne(['#b890ff', '#ffffff']) }); });
  return _bcV(m, col, Math.max(4, (n || 14) - 10));
}; }
{ const _pmV = projetilMagia; projetilMagia = async function (de, alvo, tipo, n) {
  if (tipo !== 'vao') return _pmV(de, alvo, tipo, n);
  const [x0, y0] = de._pt || unitCenter(de), [x1, y1] = unitCenter(alvo);
  sfx('geada');
  await tw(18, p => { escurecerVao(0.5); fendaVao(x0 + 6, y0, 9, 12, ease.out(p)); fendaVao(x1, y1, 14, 18, ease.out(Math.max(0, p - 0.3) / 0.7)); });
  await tw(10, p => { escurecerVao(0.5); fendaVao(x0 + 6, y0, 9, 12, 1 - p); fendaVao(x1, y1, 14, 18, 1, { puxa: true }); dentesNaFenda(x1, y1, 14, 18, 0); });
}; }
{ const _imV = impactoMagia; impactoMagia = async function (alvo, tipo, forte) {
  if (tipo !== 'vao') return _imV(alvo, tipo, forte);
  const [x, y] = unitCenter(alvo);
  await tw(8, p => { escurecerVao(0.5 * (1 - p * 0.3)); fendaVao(x, y, 14, 18, 1, { puxa: true }); dentesNaFenda(x, y, 14, 18, ease.in(p)); });
  sfx('crit'); hitstop(6); bshake(forte ? 10 : 7, 2); flashW(2); estilhacos(x, y, forte ? 22 : 14);
  popNum(x, y - 40, 'NHAC', '#d8c0ff');
  tw(16, p => { fendaVao(x, y, 14, 18, 1 - p); rachaduras(x, y, 26, p, x * 0.1); });
}; }
{ const _omV = ondaMagia; ondaMagia = async function (de, tipo) {
  if (tipo !== 'vao') return _omV(de, tipo);
  const vs = alive(BT.foes); if (!vs.length) return;
  const cx = vs.reduce((a, e) => a + unitCenter(e)[0], 0) / vs.length, cy = vs.reduce((a, e) => a + unitCenter(e)[1], 0) / vs.length;
  sfx('geada'); callout('O Vão se abre', '#d8c0ff', 40);
  await tw(36, p => {
    escurecerVao(0.55 * Math.min(1, p * 2)); fendaVao(cx, cy, 26, 22, ease.out(Math.min(1, p * 1.6)), { puxa: true });
    for (const e of vs) { const [ex] = unitCenter(e); e.ox = (cx - ex) * 0.25 * ease.in(p); }
    if (FRAME % 2 === 0) for (let i = 0; i < 3; i++) { const a = Math.random() * 6.28, d = rand(40, 70); part({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.7, vx: -Math.cos(a) * 2.2, vy: -Math.sin(a) * 1.6, life: 18, col: pickOne(['#d8c0ff', '#ffffff', '#8fe3ff']) }); }
  });
  sfx('crit'); flashW(3); bshake(10, 2); hitstop(6);
  for (const e of vs) { const [ex, ey] = unitCenter(e); estilhacos(ex, ey, 10); }
  tw(20, p => { fendaVao(cx, cy, 26, 22, 1 - p); rachaduras(cx, cy, 50, p, 2); for (const e of vs) e.ox = e.ox * (1 - p); }).then(() => { for (const e of vs) e.ox = 0; });
}; }
{ const _vmV = veuMagia; veuMagia = async function (alvo, K, cols) {
  if (!['vao', 'bolso', 'porta'].includes(K)) return _vmV(alvo, K, cols);
  const [x, y] = unitCenter(alvo); sfx('geada');
  await tw(18, p => { escurecerVao(0.35); fendaVao(x, y + 6, 12, 16, ease.out(p)); alvo.alpha = 1 - p; });
  await tw(14, p => { escurecerVao(0.35 * (1 - p)); fendaVao(x, y + 6, 12, 16, 1 - p); alvo.alpha = p; for (let i = 0; i < 2; i++) part({ x: x + rand(-8, 8), y: y + rand(-14, 8), vy: -0.6, life: 16, col: pickOne(['#ffd890', '#d8c0ff']) }); });
  alvo.alpha = 1;
}; }
// ---------- os efeitos ----------
{ const _cdV = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  if (!BT || !BT._vaoPierce || !t || t.side !== 'e') return _cdV(a, t, pow, o);
  const d0 = t.def, m0 = t.mdef, f = BT._vaoPierce === 'total' ? 0 : 0.4;
  t.def = Math.round((t.def || 0) * f); t.mdef = Math.round((t.mdef || 0) * f);
  try { return _cdV(a, t, pow, o); } finally { t.def = d0; t.mdef = m0; }
}; }
{ const _g3V = golpe3; golpe3 = async function (m, alvos, P, F, s, k) {
  if (!temVao(s) || BT._vaoDentro) return _g3V(m, alvos, P, F, s, k);
  const fus = P.fus, base = fb(s);
  BT._vaoPierce = fus && fus.pierceTotal ? 'total' : true; BT._vaoDentro = true;
  if (!fus) k *= 1.3;   // lendário: bate mais forte que um sigilo comum
  try { await _g3V(m, alvos, P, F, s, k); } finally { BT._vaoPierce = false; BT._vaoDentro = false; }
  for (const t of alvos) {
    if (t.hp <= 0) continue; const [x, y] = unitCenter(t);
    const tiraEsc = n => { const tinha = t.shield > 0 && !t.broken; t.shield = Math.max(0, (t.shield || 0) - n); if (tinha && t.shield === 0) breakFoe(t); };
    if (fus && fus.tempo) { t.ct = Math.max(0, (t.ct || 0) - fus.tempo); popNum(x, y - 34, 'TEMPO DOBRADO', '#ffd890'); continue; }
    if (s.f === 'ancora') { if (t.charge) { t.charge = null; callout('Preso no espaço: o golpe preparado se desfez!', '#d8c0ff', 60); } t.ct = Math.max(0, (t.ct || 0) - 40); popNum(x, y - 34, 'PRESO NO ESPAÇO', '#d8c0ff'); }
    else if (s.f === 'mina') { t.st.fenda = 1; popNum(x, y - 34, 'FENDA', '#d8c0ff'); }
    else if (s.f === 'chave') { tiraEsc(2); }
    else if (base === 'onda') { t.ct = Math.max(0, (t.ct || 0) - 30); popNum(x, y - 34, 'PUXADO', '#d8c0ff'); }
    else { tiraEsc(1); }
  }
}; }
{ const _v3V = veu3; veu3 = async function (m, t, P, k) {
  const K = P.veuK; if (!['vao', 'bolso', 'porta'].includes(K)) return _v3V(m, t, P, k);
  const [x, y] = unitCenter(t);
  if (K === 'vao') { t.st.sumido = 1; t.ct = Math.min(99, (t.ct || 0) + 35); popNum(x, y - 26, 'GUARDADO NO VÃO', '#d8c0ff'); }
  else if (K === 'bolso') { t.ct = Math.min(99, (t.ct || 0) + 70); popNum(x, y - 26, 'BOLSO DO TEMPO', '#ffd890'); }
  else { t.st.sumido = 1; t.st.manto = 3; popNum(x, y - 26, 'PORTA ESCURA', '#b890ff'); }
}; }
// a fenda da Mina engole o próximo golpe do alvo
{ const _fsV = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  if (e && e.st && e.st.fenda > 0 && t && t.hp > 0) {
    e.st.fenda = 0; const [x, y] = unitCenter(t);
    await tw(20, p => { fendaVao(x + 10, y, 12, 16, p < 0.5 ? ease.out(p * 2) : 1 - (p - 0.5) * 2, { puxa: true }); });
    callout('A fenda engoliu o golpe!', '#d8c0ff', 60); sfx('guard'); popNum(x, y - 24, 'ENGOLIDO', '#d8c0ff', true);
    return 'perfeito';
  }
  return _fsV(e, t, pow, o);
}; }
Object.assign(ST_NAME, { fenda: 'FENDA' });

// ---------- a cena: o Sigilo do Vão (Cap. 8) ----------
function cenaPaginaFunda() {
  return new Promise(res => {
    const w = { type: 'vaoCena', t: 0,
      update() { this.t++; if (this.t > 260 || (this.t > 60 && btnp('a'))) { closeWin(this); res(); } },
      draw() {
        const t = this.t, p = Math.min(1, t / 160);
        TQ.length = 0;   // a cena cobre a tela toda: nada de relógio ou cobres por cima
        bx.fillStyle = '#05020c'; bx.fillRect(0, 0, 240, 240);
        // a página
        bx.fillStyle = '#e8dcc0'; bx.fillRect(50, 40, 140, 150); bx.fillStyle = '#d8c8a4'; for (let i = 0; i < 150; i += 7) bx.fillRect(50, 40 + i, 140, 1);
        const g = glifo({ e: ['vao'], f: 'dardo', tam: 'g' }, { ink: '#2a1f48', cor: true, prog: Math.min(1, t / 90) });
        bx.drawImage(g, Math.round(120 - g.width), Math.round(115 - g.height), g.width * 2, g.height * 2);
        // a tinta cai para dentro: a página ganha fundo
        if (t > 90) { const q = Math.min(1, (t - 90) / 110); fendaVao(120, 115, 50, 56, ease.out(q), { puxa: true }); }
        if (t > 196) {   // a fechadura do lado de dentro acende sobre o céu
          const q = Math.min(1, (t - 196) / 30), pul = 0.75 + Math.sin(t * 0.2) * 0.25;
          if (t < 204) { bx.globalAlpha = (204 - t) / 8; bx.fillStyle = '#ffffff'; bx.fillRect(0, 0, 240, 240); bx.globalAlpha = 1; }
          luzMagia(120, 115, 44, '#ffd890', 0.35 * q * pul);
          const S = SIG3.vao, sz = 6, ox = 120 - S[0].length * sz / 2, oy = 115 - S.length * sz / 2;
          S.forEach((ln, yy) => [...ln].forEach((ch, xx) => { if (ch !== '#') return; bx.globalAlpha = q; bx.fillStyle = '#5a3a10'; bx.fillRect(ox + xx * sz + 1, oy + yy * sz + 1, sz, sz); bx.fillStyle = (xx + yy + Math.floor(t / 6)) % 5 === 0 ? '#ffffff' : '#ffd890'; bx.fillRect(ox + xx * sz, oy + yy * sz, sz - 1, sz - 1); }));
          bx.globalAlpha = 1;
        }
        txt(t < 90 ? 'a fechadura, do lado de dentro' : t < 200 ? 'a página tem fundo' : 'VÃO', 120, 206, { align: 'center', col: t < 200 ? '#d8c0ff' : '#ffd890' });
      } };
    openWin(w);
  });
}
async function cenaSigiloVao() {
  const Gm = grim(); G.flags.c8Vao = true;
  await say('* Você abre o Grimório. Um pingo de tinta escorre sozinho até o meio da página... e não para. Ele CAI. Para dentro. A página tem fundo.');
  sfx('catalog'); await say('[Erro: a página tem profundidade. Páginas não têm profundidade.]', 'cat');
  await say('não é a página. é você.| você sempre foi um lugar onde as coisas cabem.', 'eco8');
  await say('...É você de novo. A voz do fio.', 'me');
  await say('traça comigo. a fechadura. do lado de dentro. eu faço a conta, você faz a mão.', 'eco8');
  await say('Com quem você está falando? @? ...@?', 'lume');
  const r = await tracarAnel({ e: ['vao'], f: 'dardo', tam: 'g' });
  await cenaPaginaFunda();
  flashW(4); sfx('rune');
  Gm.elems = Gm.elems || []; if (!Gm.elems.includes('vao')) Gm.elems.push('vao');
  for (const k of ['ambar+vao', 'sombra+vao']) Gm.fus[k] = true;
  await say('* Na página, no meio do círculo, uma fechadura vista do lado de dentro. Dentro dela, um céu que não é o daqui.');
  sfx('catalog'); await say('[Sigilo novo: VÃO. Classificação: LENDÁRIO. Registro de pessoas que já traçaram isso: menos de dez. Registro de baús: um.]', 'cat');
  await say('[O golpe de Vão atravessa o espaço: a defesa do alvo quase não conta. A forma decide o resto: o Dardo tira escudo, a Onda puxa todos, a Âncora prende, a Mina engole o próximo golpe, o Véu guarda um aliado dentro de você.]', 'cat');
  await say('[Caro: mais PM e mais tinta. Selos anotados de graça, porque ninguém vende isso: Vão + Âmbar = Bolso do Tempo. Vão + Sombra = Porta Escura.]', 'cat');
  await say('Você acabou de... dobrar uma página? O Catálogo disse "menos de dez". Na HISTÓRIA.', 'lume');
  await say('Ninguém conta isso pra ninguém. Ninguém. Nem pro Jorge. Principalmente pro Jorge.', 'rita');
  await say(r && r.firme ? 'a mão não tremeu. eu sabia.' : 'tremeu um pouco. eu segurei o resto.', 'eco8');
}
{ const _nfV = novasFormas; novasFormas = async function () { await _nfV(); if (G.flags && G.flags.c8Fio && !G.flags.c8Vao && capAtual() >= 8) await cenaSigiloVao(); }; }
