// ================= O CÍRCULO MÁGICO (pedido do usuário: magia com custo, visual, inspirada no jeito de "desenhar" feitiço) =================
// Cada página do Grimório agora é um CÍRCULO desenhado com TINTA DE SUPERFÍCIE:
//  - SIGILO no centro = o elemento (dois sigilos entrelaçados = FUSÃO; o mesmo sigilo com anel de repetição = DOBRADO).
//  - SINAIS em volta = a forma (Dardo: uma seta, para onde vai; Onda: ondas para os quatro lados; Véu: escudos em cruz).
//  - TAMANHO do círculo: pequeno (fraco, barato, leve), médio, grande (forte, caro, pesado).
//  - ANEL: o feitiço só funciona com o anel FECHADO. Deixar uma BRECHA no anel é a Runa de Gatilho (fica armado e espera).
//  - O jogador TRAÇA o anel girando o direcional. Traço firme (de uma vez só) = feitiço 8% mais forte.
//  - Escrever custa TINTA (1, +1 fusão/dobro, +1 círculo grande). Tinta: Papelaria, Bazar, Mascate, baús, bichos de fuligem.
//  - FUSÃO só se escreve conhecendo o SELO dela (baús escondidos, a Papelaria, a história). Não dá mais para "chutar".
//  - Saves antigos: fusões já anotadas viram selos conhecidos, e o Catálogo dá um punhado de tinta para recomeçar.
// Elemento opcional novo: SAL (o Zé do cais de Velhágua troca a pedra da salina velha por 3 Lodos de Rua, depois do Cap. 5).

// ---------- o SAL ----------
Object.assign(EL3, { sal: { nm: 'Sal', el: null, col: '#f0f0f8', cols: ['#ffffff', '#d8dce8', '#a8b0c8'], d: 'sal grosso: quebra +2 de escudo; barato', brk: 2 } });
ORD_EL.push('sal');
Object.assign(FUS3, {
  'brasa+sal': { nm: 'Salitre', col: '#ffd8a8', cols: ['#ffffff', '#ffb060', '#f07830'], hits: [['fogo', 0.8]], brk: 2, st: 'queimado', d: 'pólvora de sal: fogo que estoura escudo (+2) e queima', veu: 'vidro', nota: '"Brasa + Sal = Salitre. Estala, pula, queima. Longe do bolo."' },
  'geada+sal': { nm: 'Salmoura', col: '#c8e8f8', cols: ['#ffffff', '#bff0ff', '#a8b0c8'], hits: [['gelo', 0.85]], brk: 2, st: 'frio', d: 'água do mar gelada: gela e racha escudo (+2)', veu: 'granizo', nota: '"Geada + Sal = Salmoura. O mar não congela. Quem leva, congela."' },
  'sal+seiva': { nm: 'Lágrima', col: '#e0f8f0', cols: ['#ffffff', '#9be58a', '#bff0ff'], hits: [[null, 0.6]], dreno: 0.4, curaGrupo: 0.1, limpa: true, d: 'sal de choro: drena, cura o grupo e lava os maus estados', veu: 'orvalho', nota: '"Seiva + Sal = Lágrima. Ardeu. Depois passou. É assim mesmo."' }
});
const SAL_NAO = ['ambar+sal', 'areia+sal', 'fuligem+sal'];   // sinais que não fecham: o sal "seca" a tinta
Object.assign(VEU3, { sal: { nm: 'Sal na Porta', d: 'lava os maus estados do aliado e o próximo golpe nele perde metade' } });
{ const _vS = veu3; veu3 = async function (m, t, P, k) {
  if (P.veuK !== 'sal') return _vS(m, t, P, k);
  const [x, y] = unitCenter(t);
  await tw(22, p => { fxRing(x, y, 6 + p * 16, '#ffffff', 1 - p); for (let i = 0; i < 8; i++) { const a = p * 7 + i; bx.fillStyle = i % 2 ? '#ffffff' : '#a8b0c8'; bx.fillRect(Math.round(x + Math.cos(a) * 14), Math.round(y + 8 - p * 24), 1, 1); } });
  for (const s of ['queimado', 'frio', 'tonto', 'esquecido', 'preso', 'molhado']) if (t.st[s]) t.st[s] = 0;
  t.def0 = true; popNum(x, y - 26, 'SAL NA PORTA', '#ffffff');
}; }
// Lágrima lava o grupo
{ const _gL = golpe3; golpe3 = async function (m, alvos, P, F, s, k) {
  const r = await _gL(m, alvos, P, F, s, k);
  if (P.fus && P.fus.limpa) for (const u of alive(BT.party)) for (const q of ['queimado', 'frio', 'tonto', 'esquecido', 'molhado']) if (u.st[q]) u.st[q] = 0;
  return r;
}; }

// ---------- tamanho, traço firme e custo ----------
const TAM3 = { p: { nm: 'Pequeno', R: 15, k: 0.8, mp: 0.7, d: 'fraco (-20%), barato e LEVE' }, m: { nm: 'Médio', R: 19, k: 1, mp: 1, d: 'o normal' }, g: { nm: 'Grande', R: 23, k: 1.25, mp: 1.4, d: 'forte (+25%), caro e PESADO' } };
const PESO_UP = { leve: 'normal', normal: 'pesada', pesada: 'pesada' }, PESO_DN = { leve: 'leve', normal: 'leve', pesada: 'normal' };
function circK(s) { return (TAM3[s.tam || 'm'] || TAM3.m).k * (s.q ? 1.08 : 1); }
function custoTinta(s) { return 1 + (s.e[1] ? 1 : 0) + (s.tam === 'g' ? 1 : 0); }
function tintaS() { return (G.items && G.items.tintaS) || 0; }
{ const _pgC = pagina3; pagina3 = function (s) {
  const P = _pgC(s), T = TAM3[s.tam || 'm'] || TAM3.m;
  P.s = s;
  if (s.tam && s.tam !== 'm') {
    P.mp = Math.max(2, Math.round(P.mp * T.mp)); P.w = s.tam === 'g' ? PESO_UP[P.w] || P.w : PESO_DN[P.w] || P.w;
    P.nm += s.tam === 'g' ? ' (G)' : ' (P)'; P.d += ' · círculo ' + T.nm.toLowerCase() + ': ' + T.d;
  }
  if (s.q) P.d += ' · traço firme: +8%';
  if (s.e[0] === 'sal' && !s.e[1]) P.mp = Math.max(2, P.mp - 1);
  return P;
}; }
{ const _gC = golpe3; golpe3 = function (m, alvos, P, F, s, k) { return _gC(m, alvos, P, F, s, k * circK(s)); }; }
{ const _vC = veu3; veu3 = function (m, t, P, k) { return _vC(m, t, P, k * (P.s ? circK(P.s) : 1)); }; }

// ---------- a arte do círculo ----------
const SIG3 = {
  brasa: ['....#....', '...##....', '...#.#...', '..#..#.#.', '.#..#..#.', '.#.#.#.#.', '.#..#..#.', '..#...#..', '...###...'],
  geada: ['....#....', '.#..#..#.', '..#.#.#..', '...###...', '####.####', '...###...', '..#.#.#..', '.#..#..#.', '....#....'],
  seiva: ['....#....', '...#.#...', '..#.#.#..', '..#.#.#..', '...###...', '....#....', '.##.#.##.', '...###...', '....#....'],
  fuligem: ['..#####..', '.#.....#.', '#..###..#', '#.#...#.#', '#.#.#.#.#', '#.#..#..#', '#..#....#', '.#..####.', '..#......'],
  areia: ['#########', '.#.....#.', '..#...#..', '...#.#...', '....#....', '...#.#...', '..#.#.#..', '.#.###.#.', '#########'],
  ambar: ['...###...', '..#...#..', '.#.#.#.#.', '#...#...#', '#..###..#', '.#..#..#.', '..#...#..', '...#.#...', '....#....'],
  sal: ['....#....', '..##.##..', '##.....##', '#.##.##.#', '#...#...#', '#...#...#', '#...#...#', '.##.#.##.', '...###...']
};
const SINAL3 = {
  dardo: ['..#..', '.###.', '#.#.#', '..#..', '..#..'],
  onda: ['.....', '.#...', '#.#.#', '...#.', '.....'],
  veu: ['#...#', '#...#', '.#.#.', '..#..', '.....']
};
function rotPat(p, k) { let r = p; for (let i = 0; i < k; i++) { const n = r.length; r = r[0].split('').map((_, x) => r.map((row, y) => r[n - 1 - y][x]).join('')); } return r; }
function patAt(c, pat, cx, cy, col) { const h = pat.length, w = pat[0].length, x0 = Math.round(cx - (w - 1) / 2), y0 = Math.round(cy - (h - 1) / 2); c.fillStyle = col; pat.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') c.fillRect(x0 + x, y0 + y, 1, 1); })); }
// pontos do círculo (midpoint), com o ângulo de cada um (0 = em cima, sentido horário)
const CIRC_PTS = {};
function circPts(r) {
  if (CIRC_PTS[r]) return CIRC_PTS[r];
  const s = new Map(); let x = r, y = 0, e = 1 - r;
  while (x >= y) { for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) s.set(a + ',' + b, [a, b]); y++; if (e < 0) e += 2 * y + 1; else { x--; e += 2 * (y - x) + 1; } }
  const L = [...s.values()].map(([a, b]) => [a, b, (Math.atan2(a, -b) * 180 / Math.PI + 360) % 360]).sort((p, q) => p[2] - q[2]);
  return CIRC_PTS[r] = L;
}
const GAP3 = [328, 358];   // a brecha do gatilho (em graus, a partir do topo)
// o desenho de uma página. o: { ink, cor (sigilos coloridos), prog (0..1 do anel), guia (anel pontilhado por baixo), brilho }
const GLIFO_C = {};
function glifo(s, o = {}) {
  const prog = o.prog == null ? 1 : o.prog, key = JSON.stringify([s.e, s.f, s.tam || 'm', !!s.g, s.m || '', o.ink, !!o.cor, Math.round(prog * 60), !!o.guia]);
  if (GLIFO_C[key]) return GLIFO_C[key];
  const T = TAM3[s.tam || 'm'] || TAM3.m, R = T.R, N = 2 * R + 7, cc = mk(N, N), c = cc.getContext('2d'), C = R + 3, ink = o.ink || '#1a1430';
  const e1 = s.e[0], e2 = s.e[1], fus = e2 && e2 !== e1, dob = e2 && e2 === e1;
  const corDe = e => o.cor ? (EL3[e] ? EL3[e].col : ink) : ink;
  // anel externo (o que o jogador traça) e a guia pontilhada
  const pts = circPts(R), lim = prog * 360 * (s.g ? GAP3[0] / 360 : 1);
  for (const [a, b, ang] of pts) {
    const naBrecha = s.g && ang >= GAP3[0] && ang <= GAP3[1];
    if (!naBrecha && ang <= lim + 0.01) { c.fillStyle = ink; c.fillRect(C + a, C + b, 1, 1); }
    else if (o.guia && !naBrecha && Math.round(ang / 6) % 2 === 0) { c.fillStyle = 'rgba(120,100,140,0.45)'; c.fillRect(C + a, C + b, 1, 1); }
  }
  // anel interno pontilhado
  for (const [a, b] of circPts(R - 3).filter((_, i) => i % 2 === 0)) { c.fillStyle = ink; c.fillRect(C + a, C + b, 1, 1); }
  // marquinha da chave da brecha
  if (s.g) { c.fillStyle = ink; const ang = (GAP3[1] + 4) * Math.PI / 180; for (let d = 1; d <= 3; d++) c.fillRect(Math.round(C + Math.sin(ang) * (R + d)), Math.round(C - Math.cos(ang) * (R + d)), 1, 1); }
  // sinais da forma
  const rs = R - 8, S = SINAL3[s.f] || SINAL3.dardo;
  if (s.f === 'dardo') { patAt(c, S, C, C - rs, ink); for (const sx of [-1, 1]) { c.fillStyle = ink; c.fillRect(Math.round(C + sx * rs * 0.7), Math.round(C - rs * 0.7), 1, 1); c.fillRect(Math.round(C + sx * rs * 0.75), Math.round(C + rs * 0.6), 1, 1); } }
  else { [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], k) => patAt(c, rotPat(S, k), C + dx * rs, C + dy * rs, ink)); for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { c.fillStyle = ink; c.fillRect(Math.round(C + dx * rs * 0.72), Math.round(C + dy * rs * 0.72), 1, 1); } }
  // marca (modificador) nas quatro diagonais
  if (s.m && typeof MODSIG !== 'undefined' && MODSIG[s.m]) for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { c.fillStyle = o.cor ? '#c8902a' : ink; patAt(c, MODSIG[s.m], C + dx * rs * 0.72, C + dy * rs * 0.72, o.cor ? '#b07818' : ink); }
  // sigilos
  if (fus) { patAt(c, SIG3[e1] || SIG3.brasa, C - 2, C - 1, corDe(e1)); patAt(c, SIG3[e2] || SIG3.brasa, C + 2, C + 1, corDe(e2)); }
  else { patAt(c, SIG3[e1] || SIG3.brasa, C, C, corDe(e1)); if (dob) for (const [a, b] of circPts(6)) { c.fillStyle = corDe(e1); c.fillRect(C + a, C + b, 1, 1); } }
  return GLIFO_C[key] = cc;
}

// ---------- tinta: item, migração dos saves antigos ----------
ITEM2.tintaS = { nm: 'Tinta de Superfície', preco: 30, d: 'Fuligem, óleo e um pouco de lágrima. Serve para TRAÇAR páginas no Grimório (1 a 3 por círculo). Não é de beber.' };
{ const _gr = grim; grim = function () {
  const Gm = _gr();
  if (Gm.ativo && !Gm.v2) { Gm.v2 = true; Gm.fus = Gm.fus || {}; G.items = G.items || {}; if (!G.flags.c3GrimNovo) G.items.tintaS = (G.items.tintaS || 0) + 8; G.flags.circMigra = !G.flags.c3GrimNovo; }
  return Gm;
}; }
function ganharSelo(k) { const Gm = grim(); Gm.fus = Gm.fus || {}; const novo = !Gm.fus[k]; Gm.fus[k] = true; return novo; }
async function mostrarSelo(k) {
  const F = FUS3[k], [a, b] = k.split('+');
  sfx('rune'); await say(`* {y}Selo de fusão: ${EL3[a].nm} + ${EL3[b].nm} = ${F.nm}!{/} Agora dá para traçar esse sigilo duplo no Grimório.`);
  await say(`[Anotação da Ofélia: ${F.nota}]`, 'cat');
}

// ---------- traçar o anel (minijogo): gire o direcional em volta do círculo ----------
function angInput() {
  if (JOYANG != null) return JOYANG;
  const u = KEYS.up, d = KEYS.down, l = KEYS.left, r = KEYS.right;
  const dx = (r ? 1 : 0) - (l ? 1 : 0), dy = (d ? 1 : 0) - (u ? 1 : 0);
  return dx || dy ? Math.atan2(dy, dx) * 180 / Math.PI : null;
}
function tracarAnel(s) {
  return new Promise(res => {
    const alvo = s.g ? GAP3[0] : 360, P = pagina3(s), col = P.col;
    const w = { type: 'tracar', t: 0, prog: 0, ultimo: null, parado: 0, tremido: false, borrao: 0, auto: false, fim: 0,
      update() {
        this.t++;
        if (this.fim) { if (++this.fim > 46) { closeWin(this); res({ firme: !this.tremido && !this.auto }); } return; }
        if (btnp('a')) { this.auto = true; sfx('select'); }
        if (btnp('b')) { sfx('cancel'); closeWin(this); res(null); return; }
        if (this.auto) { this.prog = Math.min(alvo, this.prog + 9); }
        else {
          const a = angInput();
          if (a == null) { if (this.prog > 0) this.parado++; this.ultimo = null; }
          else {
            const angTopo = (a + 90 + 360) % 360;   // 0 = em cima, horário
            if (this.ultimo == null) { if (this.prog === 0 && Math.min(angTopo, 360 - angTopo) > 50) { this.ultimo = null; } else this.ultimo = angTopo; }
            else {
              let d = angTopo - this.ultimo; if (d > 180) d -= 360; if (d < -180) d += 360;
              if (d > 0.5) { this.prog = Math.min(alvo, this.prog + Math.min(d, 60)); this.parado = 0; if (this.t % 4 === 0) sfx('move'); }
              else if (d < -25) { this.prog = 0; this.tremido = true; this.borrao = 30; sfx('cancel'); }
              else this.parado++;
              this.ultimo = angTopo;
            }
          }
          if (this.parado > 40 && this.prog > 0) this.tremido = true;
        }
        if (this.borrao > 0) this.borrao--;
        if (this.prog >= alvo) { this.fim = 1; sfx('rune'); }
      },
      draw() {
        box(10, 20, 220, 216, { edge: col });
        txt(this.fim ? (this.auto ? 'Anel fechado.' : this.tremido ? 'Anel fechado (traço tremido).' : 'TRAÇO FIRME! +8%') : 'Feche o anel', 120, 24, { align: 'center', col: this.fim && !this.tremido && !this.auto ? '#ffd060' : UIC.line });
        // a página de papel
        bx.fillStyle = '#e8dcc0'; bx.fillRect(40, 38, 160, 142); bx.fillStyle = '#d8c8a4'; for (let i = 0; i < 142; i += 7) bx.fillRect(40, 38 + i, 160, 1);
        bx.fillStyle = '#b8a07a'; bx.fillRect(40, 38, 160, 1); bx.fillRect(40, 179, 160, 1); bx.fillRect(40, 38, 1, 142); bx.fillRect(199, 38, 1, 142);
        const sc = (TAM3[s.tam || 'm'] || TAM3.m).R > 19 ? 2 : 3, g = glifo(s, { ink: '#2a1f48', cor: true, prog: this.prog / alvo, guia: true }), cx = 120, cy = 109;
        bx.drawImage(g, Math.round(cx - g.width * sc / 2), Math.round(cy - g.height * sc / 2), g.width * sc, g.height * sc);
        // a pena na ponta do traço
        const R = (TAM3[s.tam || 'm'] || TAM3.m).R, ang = this.prog * Math.PI / 180;
        const px = cx + Math.sin(ang) * R * sc, py = cy - Math.cos(ang) * R * sc;
        if (!this.fim) { const X = Math.round(px), Y = Math.round(py); bx.fillStyle = '#ffffff'; bx.fillRect(X - 2, Y - 2, 5, 5); bx.fillStyle = '#2a1f48'; bx.fillRect(X - 1, Y - 1, 3, 3); for (let d = 2; d < 12; d++) { bx.fillStyle = d < 4 ? '#c8a040' : d % 3 ? '#f2ecdc' : '#8fe3d8'; bx.fillRect(X + d, Y - d, 2, 2); } }
        if (this.borrao > 0) { bx.globalAlpha = this.borrao / 30; bx.fillStyle = '#2a1f48'; for (let i = 0; i < 9; i++) bx.fillRect(Math.round(px + Math.sin(i * 2.3) * 6), Math.round(py + Math.cos(i * 1.7) * 6), 3, 2); bx.globalAlpha = 1; txt('Borrou! Recomece.', 120, 166, { align: 'center', col: '#ff6b6b' }); }
        if (this.fim) { bx.globalAlpha = Math.max(0, 1 - this.fim / 46) * 0.6; for (let i = 0; i < 3; i++) fxRing(cx, cy, R * sc + this.fim * 0.8 + i * 4, col, 1); bx.globalAlpha = 1; }
        if (!this.fim) {
          txt('Gire o direcional em volta,', 120, 184, { align: 'center' });
          txt('sem voltar e sem parar.', 120, 196, { align: 'center' });
          txt('{c}A{/}: traçar devagar   {c}B{/}: desistir', 120, 214, { align: 'center', col: '#9aa8b4' });
        }
      } };
    openWin(w);
  });
}

// ---------- a mesa de escrever (o novo editor de página) ----------
function opcoesE2(e1) {
  const Gm = grim(), els = Gm.elems.slice().sort((a, b) => ORD_EL.indexOf(a) - ORD_EL.indexOf(b));
  return [null, ...els].map(k => {
    if (!k) return { k: null, nm: '(nenhum)', ok: true, d: 'Um sigilo só: feitiço puro, mais barato.' };
    if (k === e1) return { k, nm: EL3[k].nm + ' (dobrar)', ok: true, d: 'O mesmo sigilo duas vezes, com anel de repetição: 50% mais forte, mais PM e +1 tinta.' };
    const kf = chaveFus(e1, k);
    if (SAL_NAO.includes(kf)) return { k, nm: EL3[k].nm + ' (não fecha)', ok: false, d: 'O sal seca essa tinta: os dois sigilos não se entrelaçam.' };
    if (!FUS3[kf]) return { k, nm: EL3[k].nm + ' (???)', ok: false, d: 'Essa fusão não existe.' };
    if (!Gm.fus[kf]) return { k, nm: EL3[k].nm + ' = ???', ok: false, d: 'Falta o SELO desta fusão. Selos aparecem em baús escondidos ou na Papelaria Pena & Fuligem (Auren).' };
    return { k, nm: EL3[k].nm + ' = ' + FUS3[kf].nm, ok: true, d: FUS3[kf].nm + ': ' + FUS3[kf].d + '. (+1 tinta)' };
  });
}
function mesaDeEscrever(i, guiado) {
  return new Promise(res => {
    const Gm = grim(), atual = Gm.slots[i];
    const els = Gm.elems.slice().sort((a, b) => ORD_EL.indexOf(a) - ORD_EL.indexOf(b));
    const st = { e1: Math.max(0, els.indexOf(atual ? atual.e[0] : els[0])), e2: 0, f: Math.max(0, Gm.forms.indexOf(atual ? atual.f : 'dardo')), tam: ['p', 'm', 'g'].indexOf(atual && atual.tam || 'm'), anel: atual && atual.g ? 1 : 0, row: 0, mod: 0 };
    const modsL = () => [null, ...(typeof modsOk === 'function' ? modsOk(Gm.forms[st.f]) : [])];
    if (atual && atual.m) st.mod = Math.max(0, modsL().indexOf(atual.m));
    if (atual && atual.e[1]) { const o = opcoesE2(els[st.e1]); st.e2 = Math.max(0, o.findIndex(x => x.k === atual.e[1])); }
    const rows = () => ['e1', 'e2', 'f', ...(modsL().length > 1 ? ['mod'] : []), 'tam', ...(gatOk() ? ['anel'] : []), 'tracar'];
    const spec = () => { const e1 = els[st.e1], o2 = opcoesE2(e1)[st.e2] || { k: null }; const s = { e: o2.k ? [e1, o2.k] : [e1], f: Gm.forms[st.f], tam: ['p', 'm', 'g'][st.tam] }; if (gatOk() && st.anel) s.g = true; const mk2 = modsL()[st.mod]; if (mk2) s.m = mk2; return s; };
    const igual = () => { if (!atual) return false; const s = spec(); return JSON.stringify([s.e, s.f, s.tam || 'm', !!s.g, s.m || '']) === JSON.stringify([atual.e, atual.f, atual.tam || 'm', !!atual.g, atual.m || '']); };
    const problema = () => { const o2 = opcoesE2(els[st.e1])[st.e2]; if (o2 && !o2.ok) return o2.d; if (igual()) return null; if (tintaS() < custoTinta(spec())) return `Falta tinta: precisa de ${custoTinta(spec())}, você tem ${tintaS()}. Compre na Papelaria (balcão), no Bazar da Dona Graça ou com o Mascate; também aparece em baús e nos bichos de fuligem.`; return null; };
    const w = { type: 'mesa', t: 0,
      update() {
        this.t++;
        const R = rows(), r = R[st.row];
        if (navp('up')) { st.row = (st.row + R.length - 1) % R.length; sfx('move'); }
        if (navp('down')) { st.row = (st.row + 1) % R.length; sfx('move'); }
        const muda = d => {
          if (r === 'e1') { st.e1 = (st.e1 + els.length + d) % els.length; st.e2 = 0; }
          if (r === 'e2') { const n = opcoesE2(els[st.e1]).length; st.e2 = (st.e2 + n + d) % n; }
          if (r === 'f') { st.f = (st.f + Gm.forms.length + d) % Gm.forms.length; if (st.mod >= modsL().length) st.mod = 0; }
          if (r === 'mod') { const n = modsL().length; st.mod = (st.mod + n + d) % n; }
          if (r === 'tam') st.tam = (st.tam + 3 + d) % 3;
          if (r === 'anel') st.anel = 1 - st.anel;
          sfx('move');
        };
        if (navp('left')) muda(-1); if (navp('right')) muda(1);
        if (btnp('a')) {
          if (r !== 'tracar') { muda(1); return; }
          const pb = problema(); if (pb) { sfx('cancel'); this.aviso = 60; return; }
          if (igual()) { sfx('select'); closeWin(this); res('igual'); return; }
          sfx('select'); closeWin(this); res(spec());
        } else if (btnp('b') && !guiado) { sfx('cancel'); closeWin(this); res(null); }
        if (this.aviso > 0) this.aviso--;
      },
      draw() {
        const s = spec(), P = pagina3(s), R = rows(), pb = problema();
        // página com o círculo ao vivo
        bx.fillStyle = '#e8dcc0'; bx.fillRect(8, 26, 116, 150); bx.fillStyle = '#d8c8a4'; for (let y = 0; y < 150; y += 7) bx.fillRect(8, 26 + y, 116, 1);
        bx.fillStyle = '#b8a07a'; bx.fillRect(8, 26, 116, 1); bx.fillRect(8, 175, 116, 1); bx.fillRect(8, 26, 1, 150); bx.fillRect(123, 26, 1, 150);
        const g = glifo(s, { ink: '#2a1f48', cor: true, prog: 0, guia: true }), sc = 2;
        bx.drawImage(g, Math.round(66 - g.width * sc / 2), Math.round(101 - g.height * sc / 2), g.width * sc, g.height * sc);
        // o anel ainda não traçado pisca de leve: ele é a última coisa
        txt(`Página ${i + 1}`, 66, 30, { align: 'center', col: '#6a5a4a' });
        if (Math.floor(this.t / 30) % 2 === 0) txt('(o anel vem no fim)', 66, 162, { align: 'center', col: '#8a7a6a' });
        // opções
        box(128, 26, 108, 150); txt(`Tinta x${tintaS()}`, 232, 30, { align: 'right', col: '#c8b8e8' });
        const o2 = opcoesE2(els[st.e1])[st.e2];
        const lab = { e1: ['Sigilo', EL3[els[st.e1]].nm, EL3[els[st.e1]].col], e2: ['2º sigilo', o2 ? o2.nm : '-', o2 && !o2.ok ? '#ff8a8a' : o2 && o2.k ? (EL3[o2.k] || {}).col : '#c8d4dc'], f: ['Sinais', FORMA3[Gm.forms[st.f]].nm, '#c8d4dc'], tam: ['Tamanho', TAM3[['p', 'm', 'g'][st.tam]].nm, '#c8d4dc'], mod: ['Marca', modsL()[st.mod] ? MOD3[modsL()[st.mod]].nm : '(nenhuma)', modsL()[st.mod] ? '#ffd060' : '#c8d4dc'], anel: ['Anel', st.anel ? 'Com brecha' : 'Fechado', st.anel ? '#ffd060' : '#c8d4dc'], tracar: [igual() ? 'MANTER' : 'TRAÇAR', igual() ? 'sem gastar' : custoTinta(s) + ' tinta', pb ? '#ff8a8a' : '#ffd060'] };
        R.forEach((k, j) => {
          const dy = R.length > 6 ? 19 : 21, y = 44 + j * dy, sel = j === st.row, [a, b, c] = lab[k];
          if (sel) { bx.fillStyle = UIC.sel; bx.fillRect(131, y - 2, 102, dy); }
          txt(a, 134, y, { col: sel ? '#ffffff' : '#9aa8b4' });
          if (k === 'tracar') txt(b, 232, y, { align: 'right', col: c });
          else { const lw = lineW(rich(String(b))); const bxx = Math.max(140, 230 - lw); txt(b, bxx, y + 9, { col: c }); if (sel) { txt('<', bxx - 8, y + 9, { col: UIC.line }); } }
        });
        // descrição
        const linha = r => ({ e1: EL3[els[st.e1]].nm + ': ' + EL3[els[st.e1]].d + '.', e2: o2 ? o2.d : '', f: 'Sinais de ' + FORMA3[Gm.forms[st.f]].nm + ': ' + FORMA3[Gm.forms[st.f]].d + '.', mod: modsL()[st.mod] ? 'Marca ' + MOD3[modsL()[st.mod]].nm + ': ' + MOD3[modsL()[st.mod]].d + '. (+1 tinta)' : 'Sem marca: o feitiço puro.', tam: 'Círculo ' + TAM3[['p', 'm', 'g'][st.tam]].nm.toLowerCase() + ': ' + TAM3[['p', 'm', 'g'][st.tam]].d + '.' + (st.tam === 2 ? ' (+1 tinta)' : ''), anel: st.anel ? 'BRECHA no anel = Runa de Gatilho: o feitiço fica armado e dispara sozinho.' : 'Anel fechado: o feitiço sai na hora.', tracar: pb || (igual() ? 'A página já é essa. Nada a gastar.' : 'Traçar o anel e gastar a tinta.') })[r];
        const rr = R[st.row];
        box(4, 180, 232, 56, { bw: 1, edge: pb && (rr === 'tracar' || this.aviso > 0) ? '#ff8a8a' : undefined });
        const nomeP = o2 && !o2.ok ? '??? (falta o selo)' : P.nm;
        const nl = txt(`{y}${nomeP}{/}  ${P.mp} PM · ação ${P.w}`, 10, 184, { w: 36 });
        txt(linha(rr), 10, 184 + nl * 12 + 2, { w: 36, col: rr === 'tracar' && pb ? '#ffb0b0' : '#c8d4dc' });
      } };
    openWin(w);
  });
}
async function escreverPagina2(i, guiado) {
  while (true) {
    const s = await mesaDeEscrever(i, guiado);
    if (!s) return false;
    if (s === 'igual') return true;
    const r = await tracarAnel(s);
    if (!r) { if (guiado) continue; return false; }
    const Gm = grim(); G.items.tintaS = tintaS() - custoTinta(s);
    if (r.firme) s.q = true;
    Gm.slots[i] = s; sfx('rune');
    const P = pagina3(s);
    await say(`* A tinta seca em azul e depois some no papel. Página ${i + 1}: {y}${P.nm}{/} (${P.mp} PM). (Tinta: ${tintaS()})`);
    if (s.e[1] && chaveFus(s.e[0], s.e[1]) === 'fuligem+seiva') await say('Isso tá cheirando a pão velho. @, apaga isso.', 'rita');
    save2(); return true;
  }
}
escreverPagina = function (i) { return escreverPagina2(i, false); };
// a tela do Grimório: páginas, selos e o aviso da mudança (save antigo)
abrirGrimorio = async function (guiado) {
  const Gm = grim(); sfx('rune');
  if (G.flags.circMigra && !G.flags.circAviso) {
    G.flags.circAviso = true;
    await say('[Aviso do Catálogo: o Grimório mudou. Agora cada página é um CÍRCULO traçado com TINTA DE SUPERFÍCIE: sigilo no meio, sinais em volta, anel fechado.]', 'cat');
    await say('[Escrever ou reescrever uma página gasta tinta (1 a 3). As páginas que você já tem continuam valendo. Separei 8 tintas da reserva.]', 'cat');
    await say('[E as fusões agora precisam do SELO de cada uma. As que você já descobriu viraram selos. As outras: baús escondidos e a Papelaria.]', 'cat');
  }
  while (true) {
    const its = [];
    for (let i = 0; i < Gm.max; i++) { const s = Gm.slots[i]; if (s) { const P = pagina3(s); its.push({ label: `${i + 1}. ${P.nm}`, right: P.mp + 'PM', d: P.d, s }); } else its.push({ label: `${i + 1}. (página em branco)`, col: '#8a8099', d: 'Trace um círculo nesta página.' }); }
    const ks = Object.keys(FUS3), nf = ks.filter(k => Gm.fus[k]).length;
    its.push({ label: `Selos de fusão (${nf}/${ks.length})`, d: 'Os sigilos duplos que você já sabe traçar. Os que faltam: baús escondidos e a Papelaria.' });
    if (!guiado) its.push({ label: 'Fechar' });
    const i = await list({ x: 26, y: 62, w: 194, title: `Grimório        Tinta x${tintaS()}`, items: its, desc: j => its[j] && its[j].d, descY: 186, cancel: !guiado,
      extra: j => { const s = its[j] && its[j].s; if (!s) return; const g = glifo(s, { ink: '#2a1f48', cor: true }); bx.fillStyle = '#b8a07a'; bx.fillRect(89, 3, 62, 58); bx.fillStyle = '#e8dcc0'; bx.fillRect(90, 4, 60, 56); bx.drawImage(g, Math.round(120 - g.width / 2), Math.round(32 - g.height / 2)); } });
    if (i < 0 || (!guiado && i === its.length - 1)) return;
    if (i === Gm.max) { await verSelos(); continue; }
    const ok = await escreverPagina2(i, guiado);
    if (guiado && ok) return;
  }
};
async function verSelos() {
  const Gm = grim(), ks = Object.keys(FUS3);
  const its = ks.map(k => { const [a, b] = k.split('+'); const sabe = Gm.fus[k]; return { label: sabe ? `${EL3[a].nm} + ${EL3[b].nm}` : '??? + ???', right: sabe ? FUS3[k].nm : '', col: sabe ? '#ffd060' : '#6a6078', d: sabe ? FUS3[k].nm + ': ' + FUS3[k].d + '.' : 'Selo desconhecido.' }; });
  await list({ x: 20, y: 20, w: 200, maxVis: 11, title: 'Selos de fusão', items: its, desc: j => its[j].d, descY: 184 });
}
// verFusoes antigo agora mostra os selos
verFusoes = verSelos;

// ---------- o círculo aparece na batalha quando o baú conjura uma página ----------
{ const _fC = feitico3; feitico3 = function (s) {
  const F = _fC(s);
  return { ...F, run: async (m, t) => {
    const P = pagina3(s), g = glifo(s, { ink: P.col, cor: false });
    const [x0, y0] = unitCenter(m), cx = x0 + (m.side === 'p' ? 22 : -22), cy = y0 - 2;
    await tw(16, p => {
      const sc = 0.5 + p * 0.5; bx.globalAlpha = Math.min(1, p * 2) * (p > 0.85 ? (1 - p) / 0.15 : 1);
      bx.drawImage(g, Math.round(cx - g.width * sc / 2), Math.round(cy - g.height * sc / 2), Math.round(g.width * sc), Math.round(g.height * sc));
      bx.globalAlpha = 1; if (p > 0.7) fxRing(cx, cy, g.width / 2 + (p - 0.7) * 30, P.col, 1 - p);
    });
    return F.run(m, t);
  } };
}; }
