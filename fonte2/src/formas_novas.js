// ================= A MAGIA RICA DO JOGO 1 VOLTA (pedido do usuário) =================
// No jogo 1 havia 11 elementos, 8 formas e 8 modificadores. A T2 herda essa riqueza, reaprendida AOS POUCOS pela história:
//  FORMAS (sinais do círculo): Dardo, Onda, Véu (Cap. 3) · CORRENTE (Cap. 4: salta para os outros, perdendo força) ·
//    ÂNCORA (Cap. 5: golpe pesado, quebra +2, 50% de afundar o golpe preparado) · MINA (Cap. 6: golpe leve, planta uma
//    mina que explode quando o alvo agir) · CORO (Cap. 8: todos os inimigos, mais forte para cada aliado de pé) ·
//    CHAVE (Cap. 9: abre o alvo: tira 2 de escudo mesmo sem fraqueza e desfaz reforços).
//  MARCAS (o 3º elemento do círculo, como os modificadores do jogo 1; desenhadas nas diagonais; +1 tinta):
//    Foco (Cap. 3) · Eco e Selo (Cap. 4) · Dreno (Cap. 5) · Maré (Cap. 6) · Bandeira (Cap. 7) · Bilhete (Cap. 8) · Nome (Cap. 10).
//  ELEMENTOS que voltam ao fim de cada capítulo: Faísca (fim do 3), Sombra (fim do 4), Vento (fim do 5), Pólvora (fim do 6),
//    Canto (fim do 7), Céu (fim do 9). Fusões novas: Estouro, Tempestade, Breu, Aurora, Cantiga (selos na Papelaria).
// Cada forma nova tem forma-base (fb: dardo/onda/véu) e o resto do código (gatilho, fx, véus) a trata como a base.

// ---------- formas ----------
Object.assign(FORMA3, {
  corrente: { nm: 'Corrente', base: 'dardo', tgt: 'one', mp: 8, pow: 1.0, w: 'normal', d: 'um inimigo, depois salta para os outros (65%, 40%)' },
  ancora: { nm: 'Âncora', base: 'dardo', tgt: 'one', mp: 11, pow: 2.1, w: 'pesada', d: 'um inimigo, golpe pesado: quebra +2 e 50% de afundar o golpe preparado (ação pesada)' },
  mina: { nm: 'Mina', base: 'dardo', tgt: 'one', mp: 7, pow: 0.5, w: 'leve', d: 'golpe leve que planta uma MINA: ela explode (130%) quando o alvo for agir (ação leve)' },
  coro: { nm: 'Coro', base: 'onda', tgt: 'all', mp: 10, pow: 0.5, w: 'normal', d: 'todos os inimigos; mais forte para cada aliado de pé (não é pesada)' },
  chave: { nm: 'Chave', base: 'dardo', tgt: 'one', mp: 9, pow: 0.9, w: 'normal', d: 'abre o alvo: tira 2 de escudo mesmo sem fraqueza e desfaz os reforços dele' }
});
Object.assign(SINAL3, {
  corrente: ['#.#..', '.#.#.', '..#.#', '.#.#.', '#.#..'],
  ancora: ['..#..', '.###.', '..#..', '#.#.#', '.###.'],
  mina: ['.#.#.', '#####', '.###.', '#####', '.#.#.'],
  coro: ['#.#.#', '#.#.#', '.#.#.', '.....', '.....'],
  chave: ['.##..', '#..#.', '.##..', '..###', '..#.#']
});
const FORMA_CAP = { corrente: 4, ancora: 5, mina: 6, coro: 8, chave: 9 };
const FORMA_NOTA = {
  corrente: '[Sinal novo aceito pelo círculo: CORRENTE. O feitiço pula de um alvo para o outro, cansando no caminho. No primeiro grimório você já sabia esse. A mão lembrou antes da cabeça.]',
  ancora: '[Sinal novo: ÂNCORA. Pesado, desce e fica. Quebra escudo e às vezes afunda o golpe que o inimigo estava preparando.]',
  mina: '[Sinal novo: MINA. Um toque leve agora, e uma surpresa embaixo do pé dele quando ele for agir. Ação leve.]',
  coro: '[Sinal novo: CORO. Pega todo mundo, e fica mais forte com cada aliado de pé. Feitiço de gente que luta junto.]',
  chave: '[Sinal novo: CHAVE. Não bate forte. ABRE. O escudo dele perde dois pontos sem precisar de fraqueza, e os reforços dele caem.]'
};

// ---------- marcas (modificadores) ----------
const MOD3 = {
  foco: { nm: 'Foco', cap: 3, so: null, mpX: 1.6, d: '+60% de força, mas 60% mais caro' },
  eco: { nm: 'Eco', cap: 4, so: null, mp: 4, d: 'o feitiço se repete com 60% da força' },
  selo: { nm: 'Selo', cap: 4, so: 'ataque', mp: 3, d: 'marca o alvo: ele leva 25% a mais de dano por 3 vezes dele' },
  dreno: { nm: 'Dreno', cap: 5, so: 'ataque', mp: 2, d: 'devolve 20% do dano como PM' },
  mare: { nm: 'Maré', cap: 6, so: 'ataque', mp: 5, d: 'o feitiço VOLTA sozinho (60%) quando o próximo inimigo for agir' },
  bandeira: { nm: 'Bandeira', cap: 7, so: null, mp: 3, d: 'depois do feitiço, os próximos 3 golpes de quem lançou saem 20% mais fortes' },
  bilhete: { nm: 'Bilhete', cap: 8, so: null, mp: 2, d: 'o próximo golpe inimigo contra quem lançou (no Véu: contra o aliado) sai pela metade' },
  nome: { nm: 'Nome', cap: 10, so: 'ataque', mp: 3, d: 'assinado com o seu nome: +30% contra chefes; não pode ser copiado nem devolvido' }
};
const MODSIG = { foco: ['.#.', '###', '.#.'], eco: ['#.#', '...', '#.#'], selo: ['###', '#.#', '###'], dreno: ['#.#', '.#.', '.#.'], mare: ['...', '#.#', '.#.'], bandeira: ['##.', '##.', '#..'], bilhete: ['###', '#.#', '##.'], nome: ['#..', '##.', '#.#'] };
function modsOk(f) { const Gm = grim(); return (Gm.mods || []).filter(k => !(MOD3[k].so === 'ataque' && fb({ f }) === 'veu')); }
function modNotaCap(k) { return `[Marca nova para o círculo: ${MOD3[k].nm.toUpperCase()}. ${MOD3[k].d[0].toUpperCase() + MOD3[k].d.slice(1)}. Vai nas diagonais, fora dos sinais. +1 tinta.]`; }

// ---------- elementos que voltam ----------
Object.assign(EL3, {
  faisca: { nm: 'Faísca', el: null, col: '#fff070', cols: ['#fff070', '#ffffff', '#8fd0ff'], d: 'raio; 35% de ATORDOAR (a vez do alvo volta)' },
  sombra: { nm: 'Sombra', el: null, col: '#9a7ad0', cols: ['#3a2a5a', '#9a7ad0', '#1a1028'], d: 'escuridão: o próximo golpe do alvo sai 40% mais fraco' },
  vento: { nm: 'Vento', el: 'corte', col: '#c8f0e0', cols: ['#e8fff8', '#c8f0e0', '#8ac8b0'], d: 'corte de vento; 40% de DISPERSAR o golpe preparado do alvo' },
  polvora: { nm: 'Pólvora', el: 'fogo', col: '#ff8a4a', cols: ['#ff8a4a', '#ffd040', '#5a4038'], d: 'explosivo: depois, explode de novo em TODOS os inimigos (30%)' },
  canto: { nm: 'Canto', el: null, col: '#ffb0d8', cols: ['#ffb0d8', '#ffffff', '#ffd0e8'], d: 'som: deixa o alvo DISTRAÍDO (a vez atrasa) e cura o grupo um pouco' },
  ceu: { nm: 'Céu', el: 'luz', col: '#a8e0ff', cols: ['#a8e0ff', '#ffffff', '#ffe8a0'], d: 'luz do céu; limpa os maus estados de quem lança' }
});
ORD_EL.push('faisca', 'sombra', 'vento', 'polvora', 'canto', 'ceu');
Object.assign(SIG3, {
  faisca: ['.....#...', '....#....', '...#.....', '..####...', '....#....', '...#.....', '..#......', '.#.......', '.........'],
  sombra: ['...###...', '.##...#..', '.#.....#.', '#.......#', '#.......#', '.#.#.#.#.', '..#.#.#..', '.........', '.........'],
  vento: ['.........', '.######..', '.......#.', '..####.#.', '......#..', '.#####...', '.....#...', '..###....', '.........'],
  polvora: ['......#..', '.....#...', '...###...', '..#####..', '.#######.', '.#######.', '.#######.', '..#####..', '...###...'],
  canto: ['....###..', '....#.#..', '....#.#..', '....#.#..', '....#....', '..###....', '.####....', '..##.....', '.........'],
  ceu: ['....#....', '.#..#..#.', '..#...#..', '....#....', '##.###.##', '....#....', '..#...#..', '.#..#..#.', '....#....']
});
const ELEM_VOLTA = [['faisca', 'c3Fim', 'A Faísca voltou: a mesma do primeiro grimório. A tinta de superfície finalmente aguenta raio.'],
  ['sombra', 'c4Fim', 'A Sombra voltou. O escuro daqui de cima é diferente do de baixo, mas o sigilo é o mesmo.'],
  ['vento', 'c5Fim', 'O Vento voltou, junto com o pó das areias. Corta e dispersa.'],
  ['polvora', 'c6Fim', 'A Pólvora voltou. Por favor, não trace isso perto da Lume.'],
  ['canto', 'c7Fim', 'O Canto voltou. A Lume disse que já sabia. A Lume sempre sabe.'],
  ['ceu', 'c9Fim', 'O Céu voltou. A palavra que ninguém lá embaixo conhecia. Aqui em cima, ela é só... o céu.']];
Object.assign(FUS3, {
  'brasa+polvora': { nm: 'Estouro', col: '#ff6a2a', cols: ['#ff6a2a', '#ffd040', '#ffffff'], hits: [['fogo', 1.25]], st: 'queimado', explode: 0.35, d: 'fogo que estoura: queima e explode de novo em todos', veu: 'estouro', nota: '"Brasa + Pólvora = Estouro. Eu avisei para não traçar perto da Lume."' },
  'faisca+geada': { nm: 'Tempestade', col: '#9ad8ff', cols: ['#9ad8ff', '#fff070', '#ffffff'], hits: [['gelo', 0.7]], st: 'frio', atordoa: 0.5, d: 'granizo com raio: gela e tem 50% de atordoar', veu: 'tempestade', nota: '"Faísca + Geada = Tempestade. O céu inteiro numa página."' },
  'sombra+vento': { nm: 'Breu', col: '#5a4a8a', cols: ['#2a1a4a', '#c8f0e0', '#9a7ad0'], hits: [['corte', 0.8]], fraco: true, dispersa: 0.6, d: 'vento escuro: enfraquece o próximo golpe e 60% de dispersar o preparado', veu: 'breu', nota: '"Sombra + Vento = Breu. Some a luz, some o golpe."' },
  'canto+ceu': { nm: 'Aurora', col: '#ffd0f0', cols: ['#ffd0f0', '#a8e0ff', '#ffe8a0'], hits: [['luz', 0.75]], curaGrupo: 0.12, limpaGrupo: true, d: 'luz cantada: cura o grupo e limpa os maus estados de todos', veu: 'aurora', nota: '"Céu + Canto = Aurora. A Lume chorou. Disse que foi a fumaça."' },
  'canto+seiva': { nm: 'Cantiga', col: '#c8f0a8', cols: ['#c8f0a8', '#ffb0d8', '#ffffff'], hits: [[null, 0.5]], curaGrupo: 0.15, d: 'canção de ninar: bate pouco e cura bem o grupo', veu: 'cantiga', nota: '"Seiva + Canto = Cantiga. Até o Catálogo cochilou."' }
});
Object.assign(SELO_LOJA, { 'faisca+geada': [4, 160], 'sombra+vento': [6, 180], 'brasa+polvora': [7, 200], 'canto+seiva': [8, 170], 'canto+ceu': [10, 220] });
Object.assign(VEU3, {
  faisca: { nm: 'Pressa', d: 'a vez do aliado chega bem mais cedo' },
  sombra: { nm: 'Manto de Sombra', d: 'o próximo golpe no aliado erra' },
  vento: { nm: 'Vento nas Costas', d: 'a vez chega mais cedo e tira gelado e tonto' },
  polvora: { nm: 'Pavio', d: 'o aliado bate 30% mais forte por 3 vezes' },
  canto: { nm: 'Canção', d: 'cura 20% e tira os maus estados' },
  ceu: { nm: 'Céu Aberto', d: 'cura 10%, limpa os maus estados e dá Couraça' },
  estouro: { nm: 'Pavio Curto', d: 'Manto de Brasa forte (4 vezes)' },
  tempestade: { nm: 'Relâmpago', d: 'a vez chega MUITO mais cedo' },
  breu: { nm: 'Breu', d: 'o próximo golpe no aliado erra e a vez chega mais cedo' },
  aurora: { nm: 'Aurora', d: 'cura 30% e limpa tudo' },
  cantiga: { nm: 'Cantiga', d: 'cura 35%' }
});
Object.assign(ST_NAME, { fraco: 'FRACO', selo: 'SELO', mina: 'MINA' });
const MAUS3 = ['queimado', 'frio', 'tonto', 'esquecido', 'preso', 'molhado'];
function limpaMaus(u) { if (u && u.st) for (const s of MAUS3) if (u.st[s]) u.st[s] = 0; if (u) u.preso = 0; }

// ---------- liberar com a história ----------
async function novasFormas() {
  const Gm = grim(), c = capAtual(), fl = G.flags || {};
  Gm.mods = Gm.mods || [];
  // migração da v91 (eco/maré/lança/coro como formas)
  if (!Gm.v92) { Gm.v92 = true; Gm.forms = Gm.forms.filter(k => !['eco', 'mare', 'lanca', 'coro'].includes(k)); for (const s of Gm.slots) if (s) { if (s.f === 'eco') { s.f = 'dardo'; s.m = 'eco'; } else if (s.f === 'mare') { s.f = 'onda'; s.m = 'mare'; } else if (s.f === 'lanca') s.f = 'dardo'; else if (s.f === 'coro') s.f = 'veu'; } }
  const msgs = [];
  for (const [k, n] of Object.entries(FORMA_CAP)) if (c >= n && !Gm.forms.includes(k)) { Gm.forms.push(k); msgs.push(FORMA_NOTA[k]); }
  for (const [k, M] of Object.entries(MOD3)) if (c >= M.cap && !Gm.mods.includes(k)) { Gm.mods.push(k); msgs.push(modNotaCap(k)); }
  for (const [k, f, nota] of ELEM_VOLTA) if (fl[f] && !Gm.elems.includes(k)) { Gm.elems.push(k); msgs.push(`[Sigilo de volta ao Grimório: ${EL3[k].nm.toUpperCase()} (${EL3[k].d}). ${nota}]`); }
  if (msgs.length && !fl.magiaT1Aviso) { fl.magiaT1Aviso = true; msgs.unshift('[O Grimório está lembrando do primeiro. Formas, marcas e sigilos voltam aos poucos, conforme você anda. A marca é o terceiro traço do círculo, nas diagonais.]'); }
  for (const m of msgs) { sfx('rune'); await say(m, 'cat'); }
}
{ const _mdF = mesaDeEscrever; mesaDeEscrever = async function () { try { await novasFormas(); } catch (e) { console.error(e); } return _mdF.apply(this, arguments); }; }
{ const _agF = abrirGrimorio; abrirGrimorio = async function () { try { await novasFormas(); } catch (e) { console.error(e); } return _agF.apply(this, arguments); }; }

// ---------- página: custo, nome, descrição ----------
{ const _pgF = pagina3; pagina3 = function (s) {
  const P = _pgF(s), M = s.m && MOD3[s.m];
  if (M) { P.mp = M.mpX ? Math.round(P.mp * M.mpX) : P.mp + (M.mp || 0); P.nm += ' +' + M.nm; P.d += ' · ' + M.nm.toUpperCase() + ': ' + M.d; }
  return P;
}; }
{ const _ctF = custoTinta; custoTinta = function (s) { return _ctF(s) + (s.m ? 1 : 0); }; }

// ---------- combate ----------
function efeitosDe(s) {
  const e1 = s.e[0], e2 = s.e[1], fus = e2 && e2 !== e1 ? FUS3[chaveFus(e1, e2)] : null, base = fus ? [] : [e1];
  const tem = k => base.includes(k);
  return { atordoa: fus ? fus.atordoa || 0 : tem('faisca') ? 0.35 : 0, fraco: fus ? !!fus.fraco : tem('sombra'), dispersa: fus ? fus.dispersa || 0 : tem('vento') ? 0.4 : 0,
    explode: fus ? fus.explode || 0 : tem('polvora') ? 0.3 : 0, distrai: !fus && tem('canto'), curaCanto: !fus && tem('canto'), limpa: !fus && tem('ceu'), limpaGrupo: fus && fus.limpaGrupo };
}
{ const _hfF = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (BT && BT._brkExtra) o = { ...o, brk: (o.brk || 1) + BT._brkExtra };
  if (BT && BT._nomeMod && t && t.boss) pow *= 1.3;
  const r = _hfF(a, t, pow, o);
  if (a && a.st && a.st.bandeira > 0 && r > 0) a.st.bandeira--;
  return r;
}; }
{ const _cdF = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cdF(a, t, pow, o);
  if (a && a.side === 'p' && a.st && a.st.bandeira > 0) d *= 1.2;
  if (t && t.side === 'e' && t.st && t.st.selo > 0) d *= 1.25;
  return d;
}; }
{ const _g3F = golpe3; golpe3 = async function (m, alvos, P, F, s, k) {
  if (BT._golpeInterno) return _g3F(m, alvos, P, F, s, k);
  const M = s.m, E = efeitosDe(s);
  if (M === 'foco') k *= 1.6;
  if (s.f === 'coro') k *= 1 + 0.25 * alive(BT.party).length;
  const hp0 = new Map(BT.foes.map(f => [f, f.hp]));
  const roda = async (al, kk) => { BT._golpeInterno = true; try { await _g3F(m, al, P, F, s, kk); } finally { BT._golpeInterno = false; } };
  BT._brkExtra = s.f === 'ancora' ? 2 : 0; BT._nomeMod = M === 'nome';
  try {
    await roda(alvos, k);
    // Corrente: salta para os outros
    if (s.f === 'corrente') { let kk = k * 0.65; const outros = alive(BT.foes).filter(f => !alvos.includes(f)); for (const o of outros.slice(0, 2)) { const [x0, y0] = unitCenter(alvos[0]), [x1, y1] = unitCenter(o); await tw(8, p => { bx.strokeStyle = P.col; bx.globalAlpha = 1 - p * 0.5; bx.beginPath(); bx.moveTo(x0, y0); bx.lineTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); bx.stroke(); bx.globalAlpha = 1; }); await roda([o], kk); kk *= 0.62; } }
    // Eco: repete
    if (M === 'eco') { const v = alvos.filter(a => a.hp > 0); if (v.length) { await wait(12); sfx('rune'); callout('Eco!', '#d0a8ff', 30); for (const a of v) { const [x, y] = unitCenter(a); await tw(10, p => { fxRing(x, y, 4 + p * 18, P.col, 1 - p); }); } await roda(v, k * 0.6); } }
  } finally { BT._brkExtra = 0; BT._nomeMod = false; }
  // efeitos por alvo
  for (const t of alvos) {
    if (t.hp <= 0) continue; const [x, y] = unitCenter(t);
    if (E.atordoa && Math.random() < E.atordoa) { t.ct = Math.max(0, (t.ct || 0) - 45); popNum(x, y - 34, 'ATORDOADO', '#fff070'); }
    if (E.fraco) { t.st.fraco = 1; popNum(x, y - 42, 'FRACO', '#9a7ad0'); }
    if (E.dispersa && t.charge && Math.random() < E.dispersa) { t.charge = null; popNum(x, y - 42, 'DISPERSOU', '#c8f0e0'); }
    if (E.distrai) { t.ct = Math.max(0, (t.ct || 0) - 20); popNum(x, y - 34, 'DISTRAÍDO', '#ffb0d8'); }
    if (s.f === 'ancora' && t.charge && Math.random() < 0.5) { t.charge = null; callout('A âncora afundou o golpe preparado!', '#9be58a', 60); }
    if (s.f === 'chave') { const tinha = t.shield > 0 && !t.broken; t.shield = Math.max(0, (t.shield || 0) - 2); if (tinha && t.shield === 0) breakFoe(t); for (const b of ['forte', 'casca', 'furia', 'atkUp', 'defUp']) if (t.st[b]) t.st[b] = 0; popNum(x, y - 42, 'ABERTO', '#ffd060'); }
    if (s.f === 'mina') { t.st.mina = 1; t._mina = { m, P, F, s: { ...s, f: 'dardo', m: null }, k: k * 2.6 }; popNum(x, y - 42, 'MINA', '#ff8a4a'); }
    if (M === 'selo') { t.st.selo = 3; popNum(x, y - 50, 'SELO', '#ffd060'); }
  }
  if (E.explode) { const vivos = alive(BT.foes); if (vivos.length) { await wait(10); sfx('crit'); bshake(6, 2); for (const f of vivos) { const [x, y] = unitCenter(f); burst(x, y, 14, ['#ff8a4a', '#ffd040', '#ffffff']); hitFoe(m, f, F.pow * E.explode * k, { el: 'fogo', mag: true, ranged: true }); } } }
  if (E.curaCanto) for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.04));
  if (E.limpa) limpaMaus(m);
  if (E.limpaGrupo) for (const u of alive(BT.party)) limpaMaus(u);
  if (M === 'dreno') { let dano = 0; for (const [f, h] of hp0) dano += Math.max(0, h - Math.max(0, f.hp)); if (m.mmp && dano > 0) { const g = Math.max(1, Math.round(dano * 0.2)); m.mp = Math.min(m.mmp, m.mp + g); const [x, y] = unitCenter(m); popNum(x, y - 20, '+' + g + ' PM', '#8fd0ff'); } }
  if (M === 'mare') { BT.mares = BT.mares || []; BT.mares.push({ m, alvos: alvos.slice(), P, F, s: { ...s, m: null }, k: k * 0.6 }); callout('A maré vai voltar...', '#7ab8f0', 40); }
  if (M === 'bandeira') { m.st.bandeira = 3; const [x, y] = unitCenter(m); popNum(x, y - 26, 'BANDEIRA', '#ffd060'); }
  if (M === 'bilhete') { m.st.bilhete = 1; const [x, y] = unitCenter(m); popNum(x, y - 34, 'BILHETE', '#c8d4dc'); }
}; }
// véu: foco, eco, bandeira, bilhete e os véus dos elementos novos
{ const _v3F = veu3; veu3 = async function (m, t, P, k) {
  const s = P.s || {}, K = P.veuK, M = s.m;
  if (M === 'foco') k *= 1.6;
  const novos = { faisca: 1, sombra: 1, vento: 1, polvora: 1, canto: 1, ceu: 1, estouro: 1, tempestade: 1, breu: 1, aurora: 1, cantiga: 1 };
  const um = async kk => {
    if (!novos[K]) return _v3F(m, t, P, kk);
    const [x, y] = unitCenter(t), cura = f => healUnit(t, Math.round(t.mhp * f * kk));
    await tw(22, p => { fxRing(x, y, 6 + p * 16, P.col, 1 - p); });
    const pressa = n => { t.ct = Math.min(99, (t.ct || 0) + n); popNum(x, y - 26, 'PRESSA', '#fff070'); };
    if (K === 'faisca') pressa(40);
    else if (K === 'sombra' || K === 'breu') { t.st.sumido = 1; popNum(x, y - 34, 'NA SOMBRA', '#9a7ad0'); if (K === 'breu') pressa(20); }
    else if (K === 'vento') { pressa(25); t.st.frio = 0; t.st.tonto = 0; }
    else if (K === 'polvora' || K === 'estouro') { t.st.manto = Math.round((K === 'estouro' ? 4 : 3) * kk); popNum(x, y - 26, 'PAVIO', '#ff8a4a'); }
    else if (K === 'canto') { cura(0.2); limpaMaus(t); }
    else if (K === 'ceu') { cura(0.1); limpaMaus(t); t.def0 = true; t.st.couraca = 1; }
    else if (K === 'tempestade') pressa(70);
    else if (K === 'aurora') { cura(0.3); limpaMaus(t); }
    else if (K === 'cantiga') cura(0.35);
  };
  await um(k);
  if (M === 'eco') { await wait(10); callout('Eco!', '#d0a8ff', 30); await um(k * 0.6); }
  if (M === 'bandeira') { m.st.bandeira = 3; }
  if (M === 'bilhete') { t.st.bilhete = 1; const [x, y] = unitCenter(t); popNum(x, y - 34, 'BILHETE', '#c8d4dc'); }
}; }
// Sombra: o próximo golpe do inimigo sai mais fraco
{ const _fsF = foeStrike; foeStrike = async function (e, t, pow, o = {}) { if (e && e.st && e.st.fraco > 0) { e.st.fraco = 0; pow *= 0.6; } return _fsF(e, t, pow, o); }; }
// Bilhete: o próximo golpe contra quem tem o bilhete sai pela metade
{ const _hmF = hurtMember; hurtMember = function (m, d0, o = {}) { if (m && m.st && m.st.bilhete > 0 && d0 > 0 && BT._foe) { m.st.bilhete = 0; d0 = Math.round(d0 * 0.5); const [x, y] = unitCenter(m); popNum(x, y - 30, 'BILHETE', '#c8d4dc'); } return _hmF(m, d0, o); }; }
// Mina (explode quando o alvo vai agir), Maré (volta quando o próximo inimigo vai agir), Selo (conta as vezes)
{ const _ftF = foeTurn; foeTurn = async function (e) {
  if (BT.mares && BT.mares.length) { const ms = BT.mares; BT.mares = []; for (const w of ms) { if (w.m.hp <= 0) continue; const vivos = w.alvos.filter(a => a.hp > 0); const al = fb(w.s) === 'onda' ? alive(BT.foes) : vivos; if (!al.length) continue; callout('A maré voltou!', '#7ab8f0', 40); sfx('geada'); for (const a of al) { const [x, y] = unitCenter(a); burst(x, y, 10, ['#7ab8f0', '#ffffff']); } await golpe3(w.m, al, w.P, w.F, w.s, w.k); await wait(8); } }
  if (e.hp > 0 && e._mina) { const w = e._mina; e._mina = null; e.st.mina = 0; const [x, y] = unitCenter(e); callout('MINA!', '#ff8a4a', 40); sfx('crit'); bshake(8, 2); burst(x, y, 20, ['#ff8a4a', '#ffd040', '#ffffff']); await golpe3(w.m, [e], w.P, w.F, w.s, w.k); }
  if (e.hp <= 0) return;
  const r = await _ftF(e);
  if (e.st && e.st.selo > 0) e.st.selo--;
  return r;
}; }
// as páginas que saem pelo gatilho continuam iguais; o Coro conta os aliados também no gatilho
