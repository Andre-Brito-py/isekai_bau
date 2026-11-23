// ================= MECÂNICAS DO CAP. 7 =================
// 1) A ESTRADA VELHA DAS MINAS (minijogo): o Seu Jorge dirige o 31 serra acima. Três faixas; desviar de pedras,
//    buracos e cabras; pegar os frascos que caíram dos caminhões da Coroa. DE DIA tem cancela da Guarda na estrada (bater
//    é briga); DE NOITE as pedras só aparecem perto, no farol do ônibus (a Lume ajuda: o farol alcança mais longe).
// 2) VÁLVULAS E VAPOR (Galerias de Bombeamento): cada válvula liga/desliga DOIS respiros. Respiro ligado é parede de vapor.
// 3) ECO (o Coração, no escuro): numa PEDRA DE ECO, a Lume canta; o eco acende as PONTES DE CRISTAL por alguns segundos.
//    Ponte que apaga debaixo do pé: você cai de volta na pedra (com susto).
// 4) ÂMBAR (elemento do Grimório, tirado da broca): luz-pedra; quebra 2 de escudo e deixa a "resina" (o alvo fica lento).
const AC7 = POS7.acampamento, BO7 = POS7.bombas, CO7 = POS7.coracao, AN7 = POS7.andar1, FU7 = POS7.fundo7;
// ---------- 1) a estrada ----------
function estradaMinas(noite) {
  return new Promise(res => {
    const S = { k: 0, lane: 1, x: 1, hits: 0, fr: 0, obs: [], fim: 60 * 34, inv: 0, msg: null };
    const tipos = noite ? ['pedra', 'pedra', 'buraco', 'cabra', 'frasco', 'frasco'] : ['pedra', 'buraco', 'cabra', 'cancela', 'frasco', 'frasco'];
    const w = { type: 'estrada', update() {
      S.k++;
      if (navp('left')) S.lane = Math.max(0, S.lane - 1);
      if (navp('right')) S.lane = Math.min(2, S.lane + 1);
      S.x += (S.lane - S.x) * 0.25;
      const vel = 1.6 + Math.min(1.6, S.k / 900);
      if (S.k % Math.max(22, 46 - Math.floor(S.k / 120)) === 0 && S.k < S.fim - 120) { const t = pickOne(tipos); S.obs.push({ t, lane: Math.floor(Math.random() * 3), y: -20 }); if (Math.random() < 0.3 && S.k > 300) S.obs.push({ t: 'pedra', lane: Math.floor(Math.random() * 3), y: -60 }); }
      for (const o of S.obs) { o.y += vel * (o.t === 'cabra' ? 0.8 : 1); if (o.t === 'cabra') o.lane += Math.sin(S.k / 20 + o.y) * 0.01; }
      if (S.inv > 0) S.inv--;
      for (const o of S.obs) if (!o.feito && o.y > 178 && o.y < 206 && Math.abs(Math.round(o.lane) - Math.round(S.x)) === 0) {
        o.feito = true;
        if (o.t === 'frasco') { S.fr++; sfx('item'); S.msg = { s: '+ frasco caído', t: 40, c: '#ffd070' }; }
        else if (S.inv <= 0) { S.hits++; S.inv = 50; sfx('hit'); V.shake = 6; S.msg = { s: o.t === 'cancela' ? 'CANCELA! A Guarda viu!' : o.t === 'cabra' ? 'MÉÉÉ! (a cabra está bem)' : 'TUM! O 31 pula!', t: 50, c: '#ff8a6a' }; if (o.t === 'cancela') S.cancela = (S.cancela || 0) + 1; }
      }
      S.obs = S.obs.filter(o => o.y < 260);
      if (S.msg && --S.msg.t <= 0) S.msg = null;
      if (S.k > S.fim) { closeWin(this); res({ frascos: Math.floor(S.fr / 2), hits: S.hits, cancela: S.cancela || 0 }); }
    }, draw() {
      const X0 = 60, LW = 40;
      bx.fillStyle = noite ? '#0a0c18' : '#3a5a3a'; bx.fillRect(-TXO.x, 0, W, H);
      // serra dos lados (rolando)
      for (let y = -16; y < H + 16; y += 16) { const yy = Math.round(y + (S.k * 1.6) % 16); bx.fillStyle = noite ? '#141a24' : '#4a6a42'; bx.fillRect(-TXO.x, yy, X0 - 4 + TXO.x, 14); bx.fillRect(X0 + LW * 3 + 4, yy, W, 14); if ((Math.floor((y - S.k * 1.6) / 16)) % 5 === 0) { bx.fillStyle = noite ? '#1e2a24' : '#2a5a3e'; bx.fillRect(14, yy, 10, 12); bx.fillRect(210, yy + 4, 10, 12); } }
      bx.fillStyle = noite ? '#22202a' : '#5a5048'; bx.fillRect(X0, 0, LW * 3, H);
      for (let y = -20; y < H; y += 20) { const yy = Math.round(y + (S.k * 1.6) % 20); bx.fillStyle = noite ? '#4a4450' : '#c8b890'; bx.fillRect(X0 + LW - 1, yy, 2, 10); bx.fillRect(X0 + LW * 2 - 1, yy, 2, 10); }
      // obstáculos
      for (const o of S.obs) {
        const x = X0 + o.lane * LW + LW / 2, y = Math.round(o.y);
        if (noite && o.t !== 'frasco' && y < 120) continue;                    // de noite, só aparecem no farol
        if (o.t === 'pedra') { bx.fillStyle = '#6a6070'; bx.fillRect(x - 8, y - 6, 16, 12); bx.fillStyle = '#8a8090'; bx.fillRect(x - 6, y - 6, 8, 4); }
        else if (o.t === 'buraco') { bx.fillStyle = '#1a1418'; bx.fillRect(x - 10, y - 4, 20, 8); }
        else if (o.t === 'cabra') { bx.fillStyle = '#e8e4d8'; bx.fillRect(x - 7, y - 4, 14, 8); bx.fillRect(x + 5, y - 7, 4, 4); bx.fillStyle = '#5a4a3a'; bx.fillRect(x + 6, y - 9, 1, 2); bx.fillRect(x - 6, y + 4, 2, 3); bx.fillRect(x + 3, y + 4, 2, 3); }
        else if (o.t === 'cancela') { for (let i = 0; i < 30; i++) { bx.fillStyle = (i >> 2) % 2 ? '#e83a3a' : '#f0f0f0'; bx.fillRect(x - 15 + i, y - 2, 1, 4); } bx.fillStyle = '#2a3a7a'; bx.fillRect(x + 16, y - 12, 6, 14); }
        else { bx.fillStyle = '#e8e4f0'; bx.fillRect(x - 3, y - 5, 6, 10); bx.fillStyle = '#ffd070'; bx.fillRect(x - 2, y - 2, 4, 6); bx.fillStyle = '#c83a3a'; bx.fillRect(x - 3, y - 6, 6, 1); }
      }
      // o 31 visto de cima
      const bxp = X0 + S.x * LW + LW / 2;
      if (!(S.inv > 0 && S.k % 6 < 3)) { bx.fillStyle = '#e8b030'; bx.fillRect(Math.round(bxp - 9), 176, 18, 34); bx.fillStyle = '#2a3a5a'; for (let i = 0; i < 4; i++) bx.fillRect(Math.round(bxp - 7), 182 + i * 7, 14, 4); bx.fillStyle = '#1a1418'; bx.fillRect(Math.round(bxp - 10), 180, 2, 6); bx.fillRect(Math.round(bxp + 8), 180, 2, 6); bx.fillRect(Math.round(bxp - 10), 200, 2, 6); bx.fillRect(Math.round(bxp + 8), 200, 2, 6); bx.fillStyle = '#fff0a0'; bx.fillRect(Math.round(bxp - 7), 175, 3, 2); bx.fillRect(Math.round(bxp + 4), 175, 3, 2); }
      if (noite) { const g = bx.createRadialGradient(bxp, 150, 10, bxp, 140, 90); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,10,0.75)'); bx.fillStyle = g; bx.fillRect(-TXO.x, 0, W, H); bx.fillStyle = 'rgba(255,240,160,0.10)'; bx.beginPath(); bx.moveTo(bxp - 6, 176); bx.lineTo(bxp - 34, 110); bx.lineTo(bxp + 34, 110); bx.lineTo(bxp + 6, 176); bx.fill(); }
      box(4, 4, 92, 30, { edge: '#ffd060' }); txt('Estrada Velha', 10, 8, { col: '#ffd060' }); txt('frascos ' + Math.floor(S.fr / 2) + '  batidas ' + S.hits, 10, 20, { col: '#e8e4d8' });
      const prog = Math.min(1, S.k / S.fim); bx.fillStyle = '#2a2430'; bx.fillRect(226, 10, 6, 200); bx.fillStyle = '#ffd060'; bx.fillRect(226, 10 + Math.round(200 * (1 - prog)), 6, Math.round(200 * prog));
      if (S.k < 150) txt('< > muda de faixa', 120, 40, { align: 'center', col: '#ffffff' });
      if (S.msg) txt(S.msg.s, 120, 60, { align: 'center', col: S.msg.c });
    } };
    openWin(w);
  });
}
// ---------- 2) válvulas e vapor ----------
function ventSt() { G.flags.c7vent = G.flags.c7vent || Object.assign({}, BO7.ini); return G.flags.c7vent; }
const VENT7 = {}; for (const [k, cs] of Object.entries(BO7.respiros)) for (const [x, y] of cs) VENT7[x + ',' + y] = k;
const ventOn = (x, y) => { const k = VENT7[x + ',' + y]; return k ? !!ventSt()[k] : false; };
// ---------- 3) eco e pontes ----------
const PONTE7 = {}; for (const [k, cs] of Object.entries(CO7.pontes)) for (const [x, y] of cs) PONTE7[x + ',' + y] = k;
const ecoT = (k) => (W2.eco && W2.eco[k]) || 0;
{ const _csV = canStand; canStand = function (x, y, who) {
  if (W2.id === 'bombas' && ventOn(x, y)) return false;
  if (W2.id === 'coracao') { const k = PONTE7[x + ',' + y]; if (k && ecoT(k) <= 0) return false; }
  return _csV(x, y, who);
}; }
async function puxaValvula(id) {
  const V_ = BO7.valvulas[id], st = ventSt();
  for (const t of V_.tog) st[t] = st[t] ? 0 : 1;
  sfx('door'); V.shake = 3;
  const desc = V_.tog.map(t => 'respiro ' + t + (st[t] ? ' LIGADO' : ' desligado')).join(', ');
  W2.toast = { s: 'Fssss... ' + desc + '.', t: 0 };
  if (!G.flags.tutValv7) { G.flags.tutValv7 = true; await say('[Cada válvula liga e desliga DOIS respiros (as letras ficam escritas no cano). Vapor ligado é parede. Se travar, volte e gire outra.]', 'cat'); }
}
async function pedraEco(k) {
  if (ecoT(k) > 60) return;
  W2.mv = null;
  if (!G.flags.tutEco7) { G.flags.tutEco7 = true; await say('A pedra... ela tem um buraco no meio, igual uma concha. Deixa eu tentar uma coisa.', 'lume'); }
  sfx('rune'); jingle('E5:2 G5:2 B5:4 E6:6', 220);
  (W2.eco = W2.eco || {})[k] = 420; W2.ecoPulso = { k, t: 0 };
  W2.toast = { s: 'O eco acende a ponte de cristal! (alguns segundos)', t: 0 };
  if (!G.flags.tutEco7b) { G.flags.tutEco7b = true; await say('[ECO: o canto da Lume acende as PONTES DE CRISTAL por alguns segundos. Corra. Ponte que apaga debaixo do pé... derruba.]', 'cat'); }
}
{ const _uwE = updateWorld2; updateWorld2 = function () {
  _uwE();
  if (V.scene !== 'world' || W2.id !== 'coracao') return;
  if (W2.eco) for (const k in W2.eco) if (W2.eco[k] > 0) W2.eco[k]--;
  if (W2.ecoPulso) W2.ecoPulso.t++;
  // a ponte apagou com você em cima?
  if (!worldBusy2() && !W2.pego) { const px = W2.mv ? W2.mv.tx : W2.x, py = W2.mv ? W2.mv.ty : W2.y, k = PONTE7[px + ',' + py]; if (k && ecoT(k) <= 0) { W2.pego = true; run2(async () => { sfx('cancel'); V.shake = 8; await say('* O cristal apaga debaixo de você. Um segundo de nada. E então o patamar de cima, de costas, com a Lume e a Rita caindo por cima.'); const [ex, ey] = CO7.eco[k]; await fadeOut(8); loadMap2('coracao', ex, ey + 1, 'down'); W2.pego = false; await fadeIn(8); }); } }
}; }
{ const _chE = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _chE ? _chE(m, ox, oy) : undefined;
  if (!m) return r;
  if (m === MAPS2.bombas) for (const key in VENT7) { const [x, y] = key.split(',').map(Number); const on = ventOn(x, y); bx.fillStyle = on ? 'rgba(255,120,80,0.25)' : 'rgba(120,200,255,0.10)'; bx.fillRect(x * TS - ox, y * TS - oy, TS, TS); }
  if (m === MAPS2.coracao) for (const key in PONTE7) {
    const [x, y] = key.split(',').map(Number), k = PONTE7[key], t = ecoT(k), sx = x * TS - ox, sy = y * TS - oy;
    if (t > 0) { const a = t > 90 ? 0.85 : (Math.floor(t / 6) % 2 ? 0.7 : 0.25); bx.globalAlpha = a; bx.drawImage(tileArt('cristal7', (x + y) % 3), sx, sy); bx.globalAlpha = 1; }
    else { bx.fillStyle = 'rgba(138,216,240,0.10)'; if ((x + y + Math.floor(W2.t / 20)) % 4 === 0) bx.fillRect(sx + 7, sy + 7, 2, 2); }
  }
  return r;
}; }
{ const _arE = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arE ? _arE(m, ox, oy) : undefined;
  if (!m || V.scene !== 'world') return r;
  if (m === MAPS2.bombas) { for (const key in VENT7) { const [x, y] = key.split(',').map(Number); vaporFx(x * TS - ox, y * TS - oy, W2.t + x * 7, ventOn(x, y)); } for (const [k, cs] of Object.entries(BO7.respiros)) { const [x, y] = cs[0]; txt(k, x * TS - ox + 13, y * TS - oy - 22, { col: ventSt()[k] ? '#ff8a6a' : '#8fe3ff', shadow: true }); } }
  if (m === MAPS2.coracao && W2.ecoPulso && W2.ecoPulso.t < 50) { const [ex, ey] = CO7.eco[W2.ecoPulso.k], p = W2.ecoPulso.t / 50; bx.strokeStyle = `rgba(255,240,160,${1 - p})`; bx.lineWidth = 2; bx.beginPath(); bx.ellipse(ex * TS - ox + 8, ey * TS - oy + 8, 10 + p * 120, 6 + p * 70, 0, 0, Math.PI * 2); bx.stroke(); }
  return r;
}; }
// ---------- 4) o elemento ÂMBAR ----------
Object.assign(EL3, { ambar: { nm: 'Âmbar', el: 'luz', col: '#ffd070', cols: ['#ffd070', '#fff0b0', '#c8902a'], d: 'luz-pedra; quebra +1 de escudo e deixa RESINA (o alvo fica lento)', brk: 1, resina: true } });
ORD_EL.push('ambar');
Object.assign(FUS3, {
  'ambar+brasa': { nm: 'Lava Dourada', col: '#ff9a30', cols: ['#ff9a30', '#ffd070', '#c83a1a'], hits: [['fogo', 0.7], ['luz', 0.5]], brk: 2, st: 'queimado', d: 'âmbar derretido: fogo e luz, quebra +2, queima', veu: 'brasaviva', nota: '"Âmbar + Brasa = Lava Dourada. Não pise. Não tente pisar. — O."' },
  'ambar+geada': { nm: 'Cristal', col: '#bff0ff', cols: ['#e8fbff', '#ffd070', '#8ad8f0'], hits: [['gelo', 0.6], ['luz', 0.6]], brk: 2, st: 'frio', d: 'cristal de âmbar gelado: gelo e luz, quebra +2', veu: 'granizo', nota: '"Âmbar + Geada = Cristal. Bonito. Frio. Como gente da Cidade Alta. — O."' },
  'ambar+seiva': { nm: 'Resina', col: '#d8a030', cols: ['#d8a030', '#a8c870', '#fff0b0'], hits: [['luz', 0.8]], dreno: 0.3, d: 'resina que prende e devolve vida', veu: 'orvalho', nota: '"Âmbar + Seiva = Resina. A árvore chora e o choro cura. — O."' },
  'ambar+fuligem': { nm: 'Fóssil', col: '#8a7a6a', cols: ['#8a7a6a', '#ffd070', '#4a4050'], hits: [['luz', 0.55]], tonto: 0.6, d: 'pedra de lembrança velha: quase todos ficam TONTOS', veu: 'fumaca', nota: '"Âmbar + Fuligem = Fóssil. Lembrança tão velha que virou pedra. — O."' },
  'ambar+areia': { nm: 'Vitral', col: '#ffe8a0', cols: ['#ffe8a0', '#bff0ff', '#ff8a8a'], hits: [['corte', 0.6], ['luz', 0.6]], brk: 3, d: 'vidro colorido de âmbar: corte e luz, quebra +3', veu: 'vidro', nota: '"Âmbar + Areia = Vitral. Eu vi um desses lutar uma vez. — O."' }
});
Object.assign(VEU3, { ambar: { nm: 'Âmbar', d: 'o aliado fica dentro de uma bolha de âmbar: o próximo golpe nele é ZERO' } });
// resina: o alvo de um feitiço de âmbar puro fica lento
{ const _hfA = hitFoe; hitFoe = function (a, t, pow, o = {}) { const r = _hfA(a, t, pow, o); if (BT && BT._resina && t && t.hp > 0 && t.side === 'e') { t.ct = Math.max(0, t.ct - 20); const [x, y] = unitCenter(t); popNum(x, y - 30, 'RESINA', '#ffd070'); } return r; }; }
{ const _g7 = golpe3; golpe3 = async function (m, alvos, P, F, s, k) { BT._resina = !P.fus && s.e && s.e[0] === 'ambar'; try { return await _g7(m, alvos, P, F, s, k); } finally { BT._resina = false; } }; }
{ const _v7 = veu3; veu3 = async function (m, t, P, k) {
  if (P.veuK !== 'ambar') return _v7(m, t, P, k);
  const [x, y] = unitCenter(t);
  await tw(24, p => { luzMagia(x, y - 10, 8 + p * 18, 'rgba(255,208,112,0.5)', 1 - p * 0.3); fxRing(x, y - 10, 6 + p * 14, '#ffd070', 1 - p); });
  t.st.sumido = 1; t.def0 = true; popNum(x, y - 26, 'BOLHA DE ÂMBAR', '#ffd070');
}; }
