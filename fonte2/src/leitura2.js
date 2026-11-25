// ================= A LEITURA DA MOÇA, MAIS FUNDA (pedido do usuário: "para o baú ter essas vantagens") =================
// Depois da LEITURA (Cap. 9), o inimigo LIDO:
//  1. MOSTRA A MIRA: ela já sabe em quem ele vai bater. Um olho âmbar fica sobre o inimigo e uma setinha âmbar sobre o
//     aliado que ele vai atacar (e ele ataca mesmo esse; a provocação ainda manda mais).
//  2. DEFESA MAIS FÁCIL EM TUDO: além do anel mais largo (mecanicas9), o anel vem MAIS DEVAGAR (+35% de tempo) e os golpes
//     rápidos perdem a pressa. Vale para todos os golpes dele: anéis em sequência, de longe, correntes.
//  3. AVISO DE GOLPE PREPARADO: quando QUALQUER inimigo começa a preparar um golpe, ela avisa na hora e ele fica LIDO
//     sozinho (dá tempo de quebrar o escudo ou armar uma página de gatilho).
function leituraOn() { return !!(G.flags && G.flags.c9Leitura); }
function provocando() { return BT.taunt && BT.taunt.m && BT.taunt.m.hp > 0 && BT.taunt.n > 0; }
function preverMira(e) { const l = alive(BT.party); e._mira = provocando() ? BT.taunt.m : l.length ? pickOne(l) : null; }
{ const _ftgL = foeTarget; foeTarget = function () {
  const e = BT._foeAtual;
  if (e && e._mira && e._mira.hp > 0 && e.st && e.st.lido > 0 && !provocando()) return e._mira;
  return _ftgL();
}; }
{ const _ftL = foeTurn; foeTurn = async function (e) {
  BT._foeAtual = e;
  try { return await _ftL(e); }
  finally {
    BT._foeAtual = null;
    if (e.hp > 0 && leituraOn()) {
      if (e.charge && !e._avisoCarga) {
        e._avisoCarga = true; e.st.lido = Math.max(e.st.lido || 0, 2); preverMira(e);
        const [x, y] = unitCenter(e); popNum(x, y - 40, 'LIDO', '#ffd890');
        if (!G.flags.tutCarga10) { G.flags.tutCarga10 = true; await say('{o}ele está guardando força. vai soltar na próxima vez dele. quebra o escudo dele antes, ou deixa uma página de gatilho armada.{/}', 'eco8'); }
        else callout('"' + e.name + ' vai soltar o golpe preparado!"', '#ffd890', 60);
      } else if (!e.charge) e._avisoCarga = false;
      if (e.st && e.st.lido > 0) preverMira(e); else e._mira = null;
    }
  }
}; }
// ao avaliar: ela já diz a mira
{ const _dcL2 = doCommand; doCommand = async function (m, k) {
  const r = await _dcL2(m, k);
  const t = BT._ultimoAlvo9;
  if (k === 'avaliar' && leituraOn() && t && t.hp > 0 && t.st && t.st.lido > 0) {
    preverMira(t);
    if (t._mira) callout('"' + t.name + ' vai em ' + (t._mira.id === 'bau' ? 'você' : t._mira.name) + '."', '#ffd890', 60);
    if (!G.flags.tutMira10) { G.flags.tutMira10 = true; await say('[LEITURA, mais funda: o inimigo LIDO mostra em quem vai bater (setinha âmbar), e o anel dele vem mais devagar. Golpes preparados: ela avisa sozinha.]', 'cat'); }
  }
  return r;
}; }
// anel mais lento e sem pressa contra quem está lido
{ const _drL = defenseRing; defenseRing = function (m, n = 34, o = {}) {
  if (BT._lido9) { n = Math.round(n * 1.35); o = { ...o, fast: false }; }
  return _drL(m, n, o);
}; }
// desenho: o olho sobre o inimigo lido, a setinha sobre o alvo previsto, o "!" de golpe preparado lido
{ const _duL = drawUnit; drawUnit = function (u) {
  _duL(u);
  if (!BT || !BT.foes || !leituraOn() || u.hp <= 0 || u.alpha === 0) return;
  const [x, y] = unitCenter(u), topo = Math.round(y - (u.h || 40) / 2 - 10), pisca = Math.floor(FRAME / 12) % 2;
  if (u.side === 'e' && u.st && u.st.lido > 0) {
    bx.fillStyle = '#3a2410'; bx.fillRect(x - 5, topo - 1, 11, 6);
    bx.fillStyle = '#ffd890'; bx.fillRect(x - 4, topo, 9, 4); bx.fillStyle = '#3a2410'; bx.fillRect(x - 1, topo + 1, 3, 2); bx.fillStyle = '#ffffff'; bx.fillRect(x, topo + 1, 1, 1);
    if (u.charge) { bx.fillStyle = pisca ? '#ff8a4a' : '#ffd890'; bx.fillRect(x + 8, topo - 2, 2, 5); bx.fillRect(x + 8, topo + 4, 2, 2); }
  }
  if (u.side !== 'e' && BT.foes.some(f => f.hp > 0 && f.st && f.st.lido > 0 && f._mira === u)) {
    const yy = topo - 4 + pisca;
    bx.fillStyle = '#3a2410'; bx.fillRect(x - 4, yy - 1, 9, 6);
    bx.fillStyle = '#ffd890'; bx.fillRect(x - 3, yy, 7, 1); bx.fillRect(x - 2, yy + 1, 5, 1); bx.fillRect(x - 1, yy + 2, 3, 1); bx.fillRect(x, yy + 3, 1, 1);
  }
}; }
