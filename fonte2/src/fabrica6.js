// ================= A CASA DO SELO: esteiras, alavancas, prensas e a faixa amarela =================
// PISO DAS ESTEIRAS: as ilhas só se ligam por esteiras; pisar numa esteira é ir junto até o fim dela (não dá para
// parar nem voltar). Três ALAVANCAS (cada uma numa ilha) viram o sentido de uma esteira. O mapa garante (simulação em
// maps/cap6maps.py) que nunca se fica preso: de qualquer ilha dá para chegar à saída e voltar à entrada.
// PRENSAS: no corredor de cima, três prensas descem em ritmos diferentes; quem estiver embaixo é jogado de volta.
// FAIXA: no chão de fábrica, Pavio de verdade anda na faixa amarela. Os Selos Vivos olham: fora da faixa = alarme.
const S16 = POS6.selo1, RP6 = POS6.ruaPavios, S26 = POS6.selo2;
const BELT6 = {}; for (const [k, b] of Object.entries(S16.belts)) for (const [x, y] of b.cells) BELT6[x + ',' + y] = k;
function beltSt() { G.flags.c6belts = G.flags.c6belts || {}; return G.flags.c6belts; }
function beltDir(x, y) { const k = BELT6[x + ',' + y]; if (!k) return null; const b = S16.belts[k], i = beltSt()[k] ?? b.ini; return b.dirs[i % b.dirs.length]; }
{ const _uwF = updateWorld2; updateWorld2 = function () {
  if (V.scene === 'world' && W2.id === 'selo1' && !W2.mv && !worldBusy2() && !W2.pego) {
    const d = beltDir(W2.x, W2.y);
    if (d) { const [dx, dy] = DIR2[d], nx = W2.x + dx, ny = W2.y + dy; if (canStand(nx, ny, 'player')) { W2.dir = d; tryStep(nx, ny); if (W2.t % 6 === 0) sfx('step'); } }
  }
  return _uwF();
}; }
async function puxaAlavanca(L) {
  const k = Object.entries(S16.belts).find(([, b]) => b.lev === L)[0], b = S16.belts[k], st = beltSt();
  st[k] = ((st[k] ?? b.ini) + 1) % b.dirs.length; sfx('door'); V.shake = 2;
  const nm = { up: 'para CIMA', down: 'para BAIXO', left: 'para a ESQUERDA', right: 'para a DIREITA' }[b.dirs[st[k]]];
  W2.toast = { s: 'Clanc! A esteira ' + k + ' agora corre ' + nm + '.', t: 0 };
  if (!G.flags.tutAlav6) { G.flags.tutAlav6 = true; await say('[Alavanca: vira o sentido de UMA esteira (a que sai desta ilha). Pisou na esteira, vai até o fim. Olhe as setas antes de pisar.]', 'cat'); }
}
// prensas: período e fase de cada uma
const PRENSA6 = S16.prensas.map(([x, y, w, h], i) => ({ x, y, w, h, per: [96, 74, 120][i], off: [0, 30, 55][i] }));
const prensaFase = (p) => ((W2.t + p.off) % p.per) / p.per;                 // 0..1
const prensaDesce = (p) => { const f = prensaFase(p); return f < 0.12 ? f / 0.12 : f < 0.3 ? 1 : f < 0.42 ? 1 - (f - 0.3) / 0.12 : 0; };
{ const _uwP = updateWorld2; updateWorld2 = function () {
  _uwP();
  if (V.scene !== 'world' || W2.id !== 'selo1' || worldBusy2() || W2.pego) return;
  const px = W2.mv ? W2.mv.tx : W2.x, py = W2.mv ? W2.mv.ty : W2.y;
  for (const p of PRENSA6) {
    if (px >= p.x && px < p.x + p.w && py >= p.y && py < p.y + p.h && prensaDesce(p) > 0.85) {
      W2.pego = true;
      run2(async () => {
        sfx('crit'); V.shake = 8; flashW && flashW(2);
        await say(pickOne(['* PLAFT. A prensa desce. Você sai carimbado de leve, com um selo da Coroa na tampa.', '* A prensa desce em cima de você. Baú é duro. Mas não TÃO duro.']));
        if (!G.flags.tutPrensa6) { G.flags.tutPrensa6 = true; await say('[Prensas: cada uma desce num ritmo. Espere ela subir e passe correndo. As faixas no chão avisam onde ela bate.]', 'cat'); }
        await fadeOut(8); loadMap2('selo1', ...S16.prensaVolta, 'left'); W2.pego = false; await fadeIn(8);
      });
      return;
    }
  }
}; }
// desenho: setas das esteiras (chão) e as prensas (por cima)
{ const _chF = HOOK_CHAO; HOOK_CHAO = function (m, ox, oy) {
  const r = _chF ? _chF(m, ox, oy) : undefined;
  if (!m || m !== MAPS2.selo1) return r;
  const k = Math.floor(W2.t / 3) % 16;
  for (const key in BELT6) {
    const [x, y] = key.split(',').map(Number), d = beltDir(x, y), sx = x * TS - ox, sy = y * TS - oy;
    if (sx < -16 || sy < -16 || sx > W || sy > H) continue;
    const [dx, dy] = DIR2[d];
    for (let i = 0; i < 2; i++) {
      const t = ((k + i * 8) % 16) - 8, cx = sx + 8 + dx * t, cy = sy + 8 + dy * t;
      bx.fillStyle = i ? '#e8c040' : '#a88a30';
      for (let j = -2; j <= 2; j++) { const a = Math.abs(j); bx.fillRect(Math.round(cx - dx * a + (dy ? j : 0)), Math.round(cy - dy * a + (dx ? j : 0)), 1, 1); bx.fillRect(Math.round(cx - dx * (a + 1) + (dy ? j : 0)), Math.round(cy - dy * (a + 1) + (dx ? j : 0)), 1, 1); }
    }
  }
  // sombra de onde a prensa vai bater
  for (const p of PRENSA6) { const d = prensaDesce(p); bx.fillStyle = `rgba(0,0,0,${0.15 + d * 0.35})`; bx.fillRect(p.x * TS - ox, p.y * TS - oy, p.w * TS, p.h * TS); }
  return r;
}; }
{ const _arF = HOOK_AR; HOOK_AR = function (m, ox, oy) {
  const r = _arF ? _arF(m, ox, oy) : undefined;
  if (!m || m !== MAPS2.selo1 || V.scene !== 'world') return r;
  for (const p of PRENSA6) { const d = prensaDesce(p), im = prensaArt(Math.round(d * 6) / 6); bx.drawImage(im, p.x * TS - ox, p.y * TS - oy - 40); }
  return r;
}; }
