// ================= A RITA NOVA (folhas enviadas pelo usuário; build/arteia_rita/gerar_rita.py -> arte_rita2.js) =================
// Mapa: andar nas 4 direções (frente 4 quadros, costas 4, lado 3; parada usa o 1º). Batalha: 21 quadros desenhados
// (parada x4, pronta, recua, estocada, acompanha, guarda, varrida, corrida x2, dor x2, caída x2, vitória x2), escolhidos
// pela pose da coreografia (u.P) e pelo estado (corrida, dano, caída, vitória); a lança já vem desenhada, então a lança
// solta do boneco antigo não é mais desenhada. Retrato: 3 expressões (sorriso de canto; boca aberta quando fala; olhos
// fechados para piscar).
const RITA2 = { ok: false };
function ritaNovaPronta() {
  if (RITA2.ok) return true;
  if (typeof ARTE_RITA2 === 'undefined' || typeof iaRosto !== 'function' || !IMG.ready) return false;
  const dec = a => a.map(iaRosto);
  RITA2.mapa = { down: dec(ARTE_RITA2.mapa.down), up: dec(ARTE_RITA2.mapa.up), right: dec(ARTE_RITA2.mapa.right) };
  RITA2.bat = {}; for (const [k, L] of Object.entries(ARTE_RITA2.bat)) RITA2.bat[k] = L.map(e => { const c = iaRosto(e); c.ax = e.ax; return c; });
  RITA2.port = ARTE_RITA2.port.map(e => { const c = iaRosto(e), o = mk(32, 32), x = o.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(c, 2, 0, 44, 44, 0, 0, 32, 32); return o; });
  RITA2.portG = dec(ARTE_RITA2.port);
  IMG.sp.rita = [RITA2.mapa.down[0]];
  IMG.spf.rita = { s: [RITA2.mapa.right[0]], b: [RITA2.mapa.up[0]] };
  IMG.port.rita = [RITA2.portG[0]];
  if (typeof PTC !== 'undefined') delete PTC.rita;
  RITA2.ok = true; return true;
}
// retrato que fala e pisca
// retrato GRANDE (48 px; 32 perdia detalhe), no mesmo espaço do retrato da moça de âmbar
function ritaGrande(i) { RITA2.g = RITA2.g || []; if (!RITA2.g[i]) { const src = RITA2.portG[i], c = mk(44, 62), x = c.getContext('2d'); x.drawImage(src, 2, 0, 44, 48, 0, 10, 44, 48); RITA2.g[i] = c; } return RITA2.g[i]; }
if (WHO.rita) Object.assign(WHO.rita, {
  get bigP() { return ritaNovaPronta(); },
  portrait: (fala) => {
    if (!ritaNovaPronta()) return PT('rita');
    if (fala && Math.floor(FRAME / 7) % 2) return ritaGrande(1);
    if (FRAME % 200 < 8) return ritaGrande(2);
    return ritaGrande(0);
  }
});
// mapa: anda de verdade (parada = 1º quadro)
{ const _fsR = folSprite; folSprite = function (f) {
  if (f.k !== 'rita' || !ritaNovaPronta()) return _fsR(f);
  const t = W2.t + 13, M = RITA2.mapa;
  const v = f.dir === 'up' ? M.up : f.dir === 'down' ? M.down : M.right;
  if (f.mv || W2.mv) {
    // a folha tem passos quase iguais (parecia deslizar): o passo vem do mesmo gerador da Lume e do baú (anda.js),
    // em cima da pose mais firme da folha, no ritmo da distância andada
    const p0 = v === M.right ? v[1] : v[0], base = f.dir === 'left' ? flipC(p0) : p0;
    return andaQuadro(base, f.dir === 'left' || f.dir === 'right', f.px + f.py + 8, correndo());
  }
  // parada: mesmo balanço de cabelo/roupa da Lume e do protagonista (anda.js), mais respiração
  const p0 = v === M.right ? v[1] : v[0], base = f.dir === 'left' ? flipC(p0) : p0; // de lado: o passo mais fechado da folha
  return ritaParada(base, f.dir === 'left' || f.dir === 'right', W2.t + 30);
}; }
const RITA_PAR = new WeakMap();
function ritaParada(src, lado, t) {
  const fr = paradoQuadro(src, lado, t);
  const resp = Math.floor(t / 22) % 4 === 1; // peito sobe 1 px num compasso lento
  if (!resp) return fr;
  let c = RITA_PAR.get(fr);
  if (!c) { c = mk(fr.width, fr.height); const x = c.getContext('2d'), cut = Math.round(fr.height * 0.62);
    x.drawImage(fr, 0, cut, fr.width, fr.height - cut, 0, cut, fr.width, fr.height - cut);
    x.drawImage(fr, 0, 0, fr.width, cut, 0, -1, fr.width, cut);
    x.drawImage(fr, 0, cut - 1, fr.width, 1, 0, cut - 1, fr.width, 1);
    RITA_PAR.set(fr, c); }
  return c;
}
// batalha: quadro desenhado escolhido pela pose
function ritaQuadro(u) {
  const B = RITA2.bat, P = u.P || {}, T = BT.t || 0, alt = (L, n) => L[Math.floor(T / n) % L.length];
  if (u.hp <= 0) return alt(B.caida, 40);
  if (u.flash > 0) return alt(B.dor, 6);
  if (u.anim === 'run') return alt(B.corre, 6);
  if (BT.foes && BT.foes.length && !BT.foes.some(f => f.hp > 0)) return alt(B.vitoria, 30);
  const wp = P.wPull || 0, wa = P.wAng ?? -1.35, ln = P.lean || 0, cr = P.crouch || 0;
  if (wp <= -6) return B.recua[0];
  if ((wp >= 5 && Math.abs(wa) < 0.7) || ln >= 5) return B.estoca[0];
  if (wa >= 0.6) return B.varre[0];
  if (ln >= 2.5) return B.segue[0];
  if (cr >= 0.25) return B.guarda[0];
  if (cr >= 0.12 || ln <= -2) return B.pronta[0];
  return alt(B.idle, 26);
}
{ const _rfR = rigFrame; rigFrame = function (k) {
  const velho = _rfR(k); if (k !== 'rita') return velho;
  return u => {
    if (!ritaNovaPronta()) { u._ritaDX = 0; return velho(u); }
    u.R = RIG.rita; if (!u.P) u.P = poseBase(u);
    const fr = ritaQuadro(u), ax = fr.ax, Hh = RIG.rita.h + RPY;
    const W = Math.max(RIG.rita.w + RPX * 2, 2 * Math.max(ax, fr.width - ax) + 2);
    const key = 'r2|' + RITA2.bat.idle.indexOf(fr) + '|' + fr.width + '|' + ax + '|' + fr.height;
    let c = RITA2.c && RITA2.c.get(fr);
    if (!c) { c = mk(W, Hh); const x = c.getContext('2d'); x.drawImage(fr, Math.round(W / 2 - ax), Hh - fr.height); (RITA2.c = RITA2.c || new Map()).set(fr, c); }
    u._ritaDX = c.width / 2 - (RPX + RIG.rita.w / 2);
    return c;
  };
}; }
{ const _rpR = rigPt; rigPt = function (u, px, py) { const r = _rpR(u, px, py); if (u && u.id === 'rita' && u._ritaDX) r[0] += u._ritaDX * (u._sx || 1); return r; }; }
{ const _dlR = desenhaLanca; desenhaLanca = function (u) { if (u && u.id === 'rita' && RITA2.ok) return; return _dlR(u); }; }
