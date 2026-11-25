// ================= FORMAS NOVAS DE MAGIA (pedido do usuário: "além de dardo, onda e véu... eco, maré, etc.") =================
// Os SINAIS do círculo ganham quatro formas novas, liberadas com a história (o Catálogo avisa na mesa de escrever):
//  ECO (Cap. 4): um inimigo; o feitiço RESSOA e bate de novo no mesmo alvo com 55% da força.
//  MARÉ (Cap. 5): todos os inimigos, mais fraco que a Onda, mas NÃO é pesada; MOLHA (a vez deles atrasa; com Geada, gela).
//  LANÇA (Cap. 7): um inimigo; perfura: muito forte e quebra +2 de escudo. Ação pesada.
//  CORO (Cap. 8): o véu em TODO o grupo, com 60% da força. Ação pesada.
// Cada forma nova tem uma forma-base (fb): o resto do código (gatilho, fx, véus) trata como Dardo/Onda/Véu.
Object.assign(FORMA3, {
  eco: { nm: 'Eco', base: 'dardo', tgt: 'one', mp: 8, pow: 1.15, w: 'normal', d: 'um inimigo; o feitiço ressoa e bate de novo (55%)' },
  mare: { nm: 'Maré', base: 'onda', tgt: 'all', mp: 8, pow: 0.6, w: 'normal', d: 'todos os inimigos, mais fraco, mas não é pesada; MOLHA (a vez deles atrasa; com Geada, gela)' },
  lanca: { nm: 'Lança', base: 'dardo', tgt: 'one', mp: 11, pow: 2.3, w: 'pesada', d: 'um inimigo; perfura: muito forte e quebra +2 de escudo (ação pesada)' },
  coro: { nm: 'Coro', base: 'veu', tgt: 'self', mp: 13, pow: 0, w: 'pesada', d: 'o véu em TODO o grupo, com 60% da força (ação pesada)' }
});
Object.assign(SINAL3, {
  eco: ['..#..', '.#.#.', '#.#.#', '.#.#.', '..#..'],
  mare: ['.#...', '#.#.#', '...#.', '.#...', '#.#.#'],
  lanca: ['..#..', '.###.', '..#..', '..#..', '.#.#.'],
  coro: ['#.#.#', '#.#.#', '.#.#.', '.....', '.....']
});
const FORMA_CAP = { eco: 4, mare: 5, lanca: 7, coro: 8 };
const FORMA_NOTA = {
  eco: '[Sinal novo aceito pelo círculo: ECO. O feitiço bate e volta, como grito em poço. A Ofélia anotou: "parece a minha biblioteca vazia."]',
  mare: '[Sinal novo: MARÉ. Pega todo mundo, mais fraco que a Onda, mas não cansa. E molha: quem está molhado demora a agir.]',
  lanca: '[Sinal novo: LANÇA. Um só alvo, atravessado. Quebra escudo. A Rita perguntou se pode cobrar direitos autorais.]',
  coro: '[Sinal novo: CORO. O véu cobre o grupo inteiro, um pouco mais fraco em cada um. Feitiço de gente que se cuida.]'
};
async function novasFormas() {
  const Gm = grim(), c = capAtual(), novas = [];
  for (const [k, n] of Object.entries(FORMA_CAP)) if (c >= n && !Gm.forms.includes(k)) { Gm.forms.push(k); novas.push(k); }
  for (const k of novas) { sfx('rune'); await say(FORMA_NOTA[k], 'cat'); }
}
{ const _mdF = mesaDeEscrever; mesaDeEscrever = async function () { try { await novasFormas(); } catch (e) {} return _mdF.apply(this, arguments); }; }
{ const _agF = abrirGrimorio; abrirGrimorio = async function () { try { await novasFormas(); } catch (e) {} return _agF.apply(this, arguments); }; }
// descrição da página
{ const _pgF = pagina3; pagina3 = function (s) { const P = _pgF(s); if (s.f === 'coro') { P.nm = P.nm.replace(/ · /, ' · Coro de '); P.d += ' · em TODO o grupo, 60% da força (ação pesada)'; } return P; }; }
// Lança: +2 de quebra
{ const _hfF = hitFoe; hitFoe = function (a, t, pow, o = {}) { if (BT && BT._lancaBrk) o = { ...o, brk: (o.brk || 1) + BT._lancaBrk }; return _hfF(a, t, pow, o); }; }
// Eco (ressoa), Maré (molha), Lança (quebra)
{ const _g3F = golpe3; golpe3 = async function (m, alvos, P, F, s, k) {
  if (s.f === 'lanca') BT._lancaBrk = 2;
  try { await _g3F(m, alvos, P, F, s, k); } finally { BT._lancaBrk = 0; }
  if (s.f === 'eco' && !BT._ecoForma) {
    const v = alvos.filter(a => a.hp > 0);
    if (v.length) {
      await wait(12); sfx('rune'); callout('...ressoa', '#d0a8ff', 30);
      for (const a of v) { const [x, y] = unitCenter(a); await tw(12, p => { fxRing(x, y, 4 + p * 18, P.col, 1 - p); fxRing(x, y, 2 + p * 10, '#ffffff', 1 - p); }); }
      BT._ecoForma = true; try { await _g3F(m, v, P, F, s, k * 0.55); } finally { BT._ecoForma = false; }
    }
  }
  if (s.f === 'mare') for (const a of alvos) {
    if (a.hp <= 0) continue; const [x, y] = unitCenter(a);
    a.ct = Math.max(0, (a.ct || 0) - 25); popNum(x, y - 34, 'MOLHADO', '#7ab8f0');
    for (let i = 0; i < 6; i++) part({ x: x - 10 + Math.random() * 20, y: y - 6, vy: 0.6 + Math.random() * 0.6, life: 24, col: '#7ab8f0' });
    if (s.e.includes('geada') && a.st) { a.st.frio = 2; popNum(x, y - 42, 'GELADO', '#bff0ff'); }
  }
}; }
// Coro: o véu em todo o grupo (o gatilho continua tratando como véu num aliado)
feitico3 = (function (_f) { return function (s) {
  const R = _f(s); if (s.f !== 'coro' || s.g) return R;
  const P = pagina3(s), k = P.dob ? 1.5 : 1; R.tgt = 'self';
  R.run = async (m) => {
    if (m.id === 'bau') await bauConjura(m, P.col, 14); else sfx('rune');
    callout('Coro!', P.col, 40);
    for (const u of alive(BT.party)) { if (typeof veuMagia === 'function') await veuMagia(u, P.veuK, P.cols); await veu3(m, u, P, k * 0.6); }
    m.pose = null;
  };
  return R;
}; })(feitico3);
