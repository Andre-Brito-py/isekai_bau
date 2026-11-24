// ================= EQUIPAMENTO MAIS FUNDO (pedido do usuário: "melhorar a complexidade, só dá pra equipar três") =================
// - Lume e Rita: ARMA, ROUPA, CABEÇA e DOIS AMULETOS (5 espaços).
// - O BAÚ agora equipa: TRANCA (a "arma" dele: fechadura/mandíbula), CAPA (roupa) e DOIS PENDURICALHOS (amuletos).
// - EFEITOS de equipamento (fx) novos: critico (crítico 1,8x), vampiro (12% do dano físico vira vida), regenPM (+4 PM
//   por vez), tensao (+3 de Tensão por ação), primeiro (começa a luta quase na vez), espinhos (devolve 20% do dano
//   recebido), ultimaChance (aguenta um golpe mortal com 1 de vida, uma vez por luta), resQueima e resFrio (o estado some
//   no fim da vez).
// - CONJUNTOS: peças da mesma família dão bônus com 2 e com 3 peças (aparece no menu).
// - O menu mostra a COMPARAÇÃO (o que sobe e o que desce) antes de equipar.
// - Dificuldade subiu de novo (ESC3 em economia3.js) para o equipamento ser necessário de verdade.

Object.assign(SLOTS2, { cabeca: 'Cabeça', amuleto2: 'Amuleto 2' });
const SLOTS_DE = { lume: ['arma', 'roupa', 'cabeca', 'amuleto', 'amuleto2'], rita: ['arma', 'roupa', 'cabeca', 'amuleto', 'amuleto2'], bau: ['arma', 'roupa', 'amuleto', 'amuleto2'] };
const NOME_SLOT = (id, s) => id === 'bau' ? ({ arma: 'Tranca', roupa: 'Capa', amuleto: 'Penduricalho', amuleto2: 'Penduricalho 2' })[s] : SLOTS2[s];
const cabeNoSlot = (k, s) => EQ2[k] && (EQ2[k].slot === s || (s === 'amuleto2' && EQ2[k].slot === 'amuleto'));

Object.assign(EQ2, {
  // ---- T1 (Bazar) ----
  chapeuPalha: { nm: 'Chapéu de Palha', slot: 'cabeca', who: ['lume', 'rita'], mod: { def: 2, mdef: 1 }, fx: [], preco: 70, tier: 1, d: '+2 DEF, +1 RESIST. Da feira de Velhágua.' },
  faixa: { nm: 'Faixa de Cabeça', slot: 'cabeca', who: ['lume', 'rita'], mod: { atk: 1, mag: 1, spd: 1 }, fx: [], preco: 80, tier: 1, d: '+1 ATQ, +1 MAG, +1 VEL. Segura o suor e a coragem.' },
  dente: { nm: 'Dente de Lobo', slot: 'amuleto', who: ['rita', 'bau'], mod: {}, fx: ['critico'], preco: 120, tier: 1, d: 'Crítico (anel certeiro) bate 1,8x em vez de 1,5x.' },
  brasaFria: { nm: 'Pedra de Brasa Fria', slot: 'amuleto', who: ['lume', 'rita', 'bau'], mod: { mdef: 2 }, fx: ['resQueima'], preco: 120, tier: 1, d: '+2 RESIST. QUEIMADO some no fim da vez.' },
  trancaFerro: { nm: 'Fechadura de Ferro', slot: 'arma', who: ['bau'], mod: { atk: 3 }, fx: [], preco: 110, tier: 1, d: 'Tranca do baú. +3 ATQ. Faz "clac" quando morde.' },
  lonaBau: { nm: 'Capa de Lona Encerada', slot: 'roupa', who: ['bau'], mod: { def: 3, mdef: 2 }, fx: [], preco: 100, tier: 1, d: 'Capa do baú. +3 DEF, +2 RESIST. Não molha.' },
  // ---- T2 (Mascate, Cap. 4+) ----
  elmoSerra: { nm: 'Elmo de Ferro da Serra', slot: 'cabeca', who: ['rita'], mod: { def: 4, mhp: 15, spd: -1 }, fx: [], preco: 200, tier: 2, set: 'serra', d: '+4 DEF, +15 PV, -1 VEL. Conjunto da Serra.' },
  arcoPrata: { nm: 'Tiara de Prata', slot: 'cabeca', who: ['lume'], mod: { mag: 3, mdef: 3 }, fx: [], preco: 210, tier: 2, set: 'palco', d: '+3 MAG, +3 RESIST. Conjunto do Palco.' },
  trancaRunas: { nm: 'Fechadura Rúnica', slot: 'arma', who: ['bau'], mod: { mag: 4, mmp: 6 }, fx: [], preco: 260, tier: 2, d: 'Tranca com runas gravadas. +4 MAG, +6 PM.' },
  trancaDentada: { nm: 'Tranca Dentada', slot: 'arma', who: ['bau'], mod: { atk: 5 }, fx: ['critico'], preco: 280, tier: 2, d: '+5 ATQ; crítico 1,8x.' },
  couroBau: { nm: 'Capa de Couro Rebitado', slot: 'roupa', who: ['bau'], mod: { def: 5, mdef: 3, mhp: 15 }, fx: [], preco: 230, tier: 2, d: '+5 DEF, +3 RESIST, +15 PV.' },
  sanguessuga: { nm: 'Broche de Sanguessuga', slot: 'amuleto', who: ['rita', 'bau'], mod: {}, fx: ['vampiro'], preco: 170, tier: 2, d: '12% do dano físico que causa vira vida.' },
  pedraLua: { nm: 'Pedra-da-Lua', slot: 'amuleto', who: ['lume', 'bau'], mod: { mmp: 4 }, fx: ['regenPM'], preco: 180, tier: 2, d: '+4 PM máximos e +4 PM a cada vez.' },
  sinoRapido: { nm: 'Sininho de Pressa', slot: 'amuleto', who: ['lume', 'rita', 'bau'], mod: { spd: 1 }, fx: ['primeiro'], preco: 150, tier: 2, d: '+1 VEL; começa a luta quase na vez.' },
  cardo: { nm: 'Cardo Seco', slot: 'amuleto', who: ['rita', 'bau'], mod: { def: 1 }, fx: ['espinhos'], preco: 170, tier: 2, d: '+1 DEF; devolve 20% do dano recebido a quem bateu.' },
  cachecol: { nm: 'Cachecol de Lã', slot: 'amuleto', who: ['lume', 'rita', 'bau'], mod: { def: 1 }, fx: ['resFrio'], preco: 140, tier: 2, d: '+1 DEF. FRIO some no fim da vez.' },
  // ---- T3 (Mascate, Cap. 7+) ----
  elmoBronze: { nm: 'Elmo de Bronze', slot: 'cabeca', who: ['rita'], mod: { def: 6, mdef: 4, mhp: 25 }, fx: [], preco: 380, tier: 3, set: 'bronze', d: '+6 DEF, +4 RESIST, +25 PV. Conjunto de Bronze.' },
  grinalda: { nm: 'Grinalda de Âmbar', slot: 'cabeca', who: ['lume'], mod: { mag: 5, mdef: 5 }, fx: [], preco: 400, tier: 3, set: 'ambar', d: '+5 MAG, +5 RESIST. Conjunto de Âmbar.' },
  trancaAmbar: { nm: 'Fechadura de Âmbar', slot: 'arma', who: ['bau'], mod: { mag: 7, mmp: 10 }, fx: [], preco: 480, tier: 3, set: 'cofre', d: '+7 MAG, +10 PM. Conjunto do Cofre.' },
  mandibula: { nm: 'Mandíbula de Bronze', slot: 'arma', who: ['bau'], mod: { atk: 8 }, fx: [], preco: 480, tier: 3, set: 'cofre', d: '+8 ATQ. Conjunto do Cofre.' },
  mantaBau: { nm: 'Manta Bordada de Fuligem', slot: 'roupa', who: ['bau'], mod: { def: 7, mdef: 7, mhp: 25 }, fx: [], preco: 430, tier: 3, set: 'cofre', d: '+7 DEF, +7 RESIST, +25 PV. Conjunto do Cofre.' },
  medalha: { nm: 'Medalhinha de Promessa', slot: 'amuleto', who: ['lume', 'rita', 'bau'], mod: {}, fx: ['ultimaChance'], preco: 260, tier: 3, d: 'Uma vez por luta, aguenta um golpe mortal com 1 de vida.' },
  apito: { nm: 'Apito de Briga', slot: 'amuleto', who: ['lume', 'rita', 'bau'], mod: {}, fx: ['tensao'], preco: 220, tier: 3, d: '+3 de Tensão a cada ação.' },
  // ---- T4 (forja) ----
  elmoFarol: { nm: 'Elmo do Farol', slot: 'cabeca', who: ['rita'], mod: { def: 9, mdef: 6, mhp: 40 }, fx: [], preco: 0, tier: 4, set: 'farol', d: '+9 DEF, +6 RESIST, +40 PV. Conjunto do Farol.' },
  veuEstrelas: { nm: 'Véu de Estrelas', slot: 'cabeca', who: ['lume'], mod: { mag: 8, mdef: 8 }, fx: [], preco: 0, tier: 4, set: 'luz', d: '+8 MAG, +8 RESIST. Conjunto da Luz.' },
  trancaFarol: { nm: 'Tranca do Farol', slot: 'arma', who: ['bau'], mod: { atk: 8, mag: 8, mmp: 8 }, fx: [], preco: 0, tier: 4, d: '+8 ATQ, +8 MAG, +8 PM. A tampa acende quando fecha.' }
});
// conjuntos nas peças que já existiam
for (const [k, s] of [['lancaSerra', 'serra'], ['gibao', 'serra'], ['diapasao', 'palco'], ['capaFeltro', 'palco'], ['lancaBronze', 'bronze'], ['brigantina', 'bronze'], ['liraVidro', 'ambar'], ['mantoFuligem', 'ambar'], ['lancaFarol', 'farol'], ['couracaCerco', 'farol'], ['batutaLuz', 'luz'], ['xaleMorro', 'luz']]) if (EQ2[k]) { EQ2[k].set = s; EQ2[k].d += ' (Conjunto ' + ({ serra: 'da Serra', palco: 'do Palco', bronze: 'de Bronze', ambar: 'de Âmbar', farol: 'do Farol', luz: 'da Luz' })[s] + '.)'; }
const SETS3 = {
  serra: { nm: 'Conjunto da Serra', 2: { mod: { def: 2 } }, 3: { fx: ['tensao'] }, d: '2: +2 DEF · 3: +3 Tensão por ação' },
  palco: { nm: 'Conjunto do Palco', 2: { mod: { mdef: 3 } }, 3: { fx: ['regenPM'] }, d: '2: +3 RESIST · 3: +4 PM por vez' },
  bronze: { nm: 'Conjunto de Bronze', 2: { mod: { atk: 3 } }, 3: { fx: ['espinhos'] }, d: '2: +3 ATQ · 3: devolve 20% do dano' },
  ambar: { nm: 'Conjunto de Âmbar', 2: { mod: { mag: 3 } }, 3: { fx: ['ultimaChance'] }, d: '2: +3 MAG · 3: aguenta um golpe mortal' },
  cofre: { nm: 'Conjunto do Cofre', 2: { mod: { def: 4, atk: 2, mag: 2 } }, d: '2: +4 DEF, +2 ATQ, +2 MAG' },
  farol: { nm: 'Conjunto do Farol', 2: { mod: { atk: 3, def: 3 } }, 3: { fx: ['primeiro', 'tensao'] }, d: '2: +3 ATQ e DEF · 3: começa na vez e +3 Tensão' },
  luz: { nm: 'Conjunto da Luz', 2: { mod: { mag: 4 } }, 3: { fx: ['regenPM', 'ultimaChance'] }, d: '2: +4 MAG · 3: +4 PM por vez e aguenta um golpe mortal' }
};
function setsDe(id) { const c = {}; for (const k of Object.values(eqOf(id))) if (k && EQ2[k] && EQ2[k].set) c[EQ2[k].set] = (c[EQ2[k].set] || 0) + 1; return c; }
{ const _eM = eqMods; eqMods = function (id) { const m = _eM(id); for (const [s, n] of Object.entries(setsDe(id))) for (const lv of [2, 3]) if (n >= lv && SETS3[s][lv] && SETS3[s][lv].mod) for (const [a, v] of Object.entries(SETS3[s][lv].mod)) m[a] = (m[a] || 0) + v; return m; }; }
{ const _eF = eqFx; eqFx = function (id) { const f = _eF(id); for (const [s, n] of Object.entries(setsDe(id))) for (const lv of [2, 3]) if (n >= lv && SETS3[s][lv] && SETS3[s][lv].fx) for (const x of SETS3[s][lv].fx) f.add(x); return f; }; }

// ---------- os efeitos na luta ----------
const temFx = (u, f) => !!(u && u.eqFx && u.eqFx.has(f));
{ const _cD = calcDmg; calcDmg = function (a, t, pow, o = {}) { let d = _cD(a, t, pow, o); if (o.crit && temFx(a, 'critico')) d *= 1.2; return d; }; }
{ const _hF = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  const d = _hF(a, t, pow, o);
  if (d > 0 && a && a.side === 'p' && !o.mag && temFx(a, 'vampiro') && a.hp > 0) { const h = Math.max(1, Math.round(d * 0.12)); a.hp = Math.min(a.mhp, a.hp + h); const [x, y] = unitCenter(a); popNum(x + 8, y - 16, '+' + h, '#9be58a'); }
  return d;
}; }
{ const _fT = foeTurn; foeTurn = async function (e) { BT._foe = e; try { return await _fT(e); } finally { BT._foe = null; } }; }
{ const _hM = hurtMember; hurtMember = function (m, d0, o = {}) {
  if (m.hp > 0 && temFx(m, 'ultimaChance') && !m._ult) { const dEst = Math.round(d0 * (m.def0 ? 0.5 : 1)); if (dEst >= m.hp) { m._ult = true; d0 = (m.hp - 1) / (m.def0 ? 0.5 : 1); const [x, y] = unitCenter(m); callout(m.name + ' aguentou!', '#ffd060', 50); popNum(x, y - 30, 'PROMESSA', '#ffd060'); } }
  const d = _hM(m, d0, o);
  const e = BT._foe;
  if (d > 0 && e && e.hp > 0 && temFx(m, 'espinhos')) { const r = Math.max(1, Math.round(d * 0.2)); e.hp = Math.max(1, e.hp - r); e.flash = 6; const [x, y] = unitCenter(e); popNum(x, y - 10, r, '#c8ff8a'); }
  return d;
}; }
{ const _eT = endTurn; endTurn = function (u, weight) {
  _eT(u, weight);
  if (u.side !== 'p' || u.hp <= 0) return;
  if (temFx(u, 'regenPM') && u.mmp) { u.mp = Math.min(u.mmp, u.mp + 4); }
  if (temFx(u, 'tensao')) BT.tension = Math.min(100, BT.tension + 3);
  if (temFx(u, 'resQueima') && u.st.queimado) u.st.queimado = 0;
  if (temFx(u, 'resFrio') && u.st.frio) u.st.frio = 0;
}; }
{ const _mM = mkMember; mkMember = function (d) { const m = _mM(d); m._ult = false; if (temFx(m, 'primeiro')) m.ct = Math.max(m.ct, 80); return m; }; }

// ---------- o menu novo, com comparação ----------
function nomeQuem(id) { return id === 'bau' ? G.name : id === 'lume' ? 'Lume' : 'Rita'; }
function statsCom(id, slot, k) {   // stats do membro se trocasse o espaço "slot" por "k"
  G.eq = G.eq || {}; const antes = { ...(G.eq[id] || {}) };
  G.eq[id] = { ...antes, [slot]: k };
  const m = grupoAtual().find(q => q.id === id);
  G.eq[id] = antes;
  return m;
}
function comparar(id, slot, k) {
  const a = grupoAtual().find(q => q.id === id), b = statsCom(id, slot, k); if (!a || !b) return '';
  const L = [];
  for (const [s, nm] of [['mhp', 'PV'], ['atk', 'ATQ'], ['mag', 'MAG'], ['def', 'DEF'], ['mdef', 'RESIST'], ['spd', 'VEL'], ['mmp', 'PM']]) { const d = (b[s] || 0) - (a[s] || 0); if (d) L.push(`${d > 0 ? '{g}' : '{r}'}${nm} ${d > 0 ? '+' : ''}${d}{/}`); }
  return L.length ? L.join('  ') : 'Sem mudança nos números.';
}
menuEquipar = async function () {
  const quem = ['bau', 'lume', 'rita'].filter(k => partyKeys().includes(k));
  while (true) {
    const i = await list({ x: 34, y: 30, w: 172, title: 'Equipar', items: quem.map(k => ({ label: nomeQuem(k), right: Object.values(eqOf(k)).filter(Boolean).length + '/' + SLOTS_DE[k].length })),
      desc: q => { const id = quem[q]; const ss = Object.entries(setsDe(id)).filter(([, n]) => n >= 2).map(([s, n]) => `${SETS3[s].nm} (${n})`); return (id === 'bau' ? 'O baú usa TRANCA, CAPA e dois PENDURICALHOS.' : 'Arma, roupa, cabeça e dois amuletos.') + (ss.length ? ' Ativo: ' + ss.join(', ') + '.' : ''); }, descY: 140 });
    if (i < 0) return;
    const id = quem[i];
    while (true) {
      const sl = SLOTS_DE[id], cur = eqOf(id), m = grupoAtual().find(q => q.id === id);
      const j = await list({ x: 24, y: 24, w: 192, title: `${nomeQuem(id)}   ATQ ${m.atk} MAG ${m.mag} DEF ${m.def}`, items: sl.map(s => ({ label: NOME_SLOT(id, s), right: cur[s] ? EQ2[cur[s]].nm : '-' })),
        desc: q => { const k = cur[sl[q]]; if (!k) return 'Vazio.'; const st = EQ2[k].set; return EQ2[k].d + (st ? `  ${SETS3[st].nm}: ${SETS3[st].d}. Você tem ${setsDe(id)[st] || 0}.` : ''); }, descY: 134 });
      if (j < 0) break;
      const slot = sl[j];
      const opts = Object.keys(G.equipInv || {}).filter(k => G.equipInv[k] > 0 && cabeNoSlot(k, slot) && EQ2[k].who.includes(id) && !emUsoPorOutro2(k, id, slot));
      const items = [{ label: '(tirar)', k: null }, ...opts.map(k => ({ label: EQ2[k].nm + (EQ2[k].maldito ? ' (maldito)' : ''), k, col: EQ2[k].set ? '#ffd060' : undefined }))];
      const q = await list({ x: 18, y: 24, w: 204, maxVis: 8, title: NOME_SLOT(id, slot), items,
        desc: n => { const k = items[n] && items[n].k; const cmp = comparar(id, slot, k); if (!k) return 'Deixar o espaço vazio. ' + cmp; const st = EQ2[k].set; return EQ2[k].d + '  ' + cmp + (st ? `  [${SETS3[st].nm}: ${SETS3[st].d}]` : ''); }, descY: 140 });
      if (q < 0) continue;
      G.eq = G.eq || {}; G.eq[id] = G.eq[id] || {}; G.eq[id][slot] = items[q].k; sfx('equip');
      if (items[q].k && EQ2[items[q].k].maldito) await say('* O anel aperta o dedo. Não sai. Quer dizer, sai, mas reclama.');
    }
  }
};
// a mesma peça pode estar no amuleto 1 ou 2 de um mesmo membro só se tiver duas
function emUsoPorOutro2(k, id, slot) { const tot = (G.equipInv || {})[k] || 0; let usado = 0; for (const [w, e] of Object.entries(G.eq || {})) for (const [s, v] of Object.entries(e)) if (v === k && !(w === id && s === slot)) usado++; return usado >= tot; }

// ---------- onde comprar / forjar ----------
{ const _e3q = estoque3; estoque3 = function (id) {
  const L = _e3q(id), c = capAtual(), add = k => L.push({ k, preco: EQ2[k].preco });
  if (id === 'bazar') for (const k of ['chapeuPalha', 'faixa', 'dente', 'brasaFria', 'trancaFerro', 'lonaBau']) add(k);
  if (id === 'mascate') {
    if (c >= 4) for (const k of ['elmoSerra', 'arcoPrata', 'trancaRunas', 'trancaDentada', 'couroBau', 'sanguessuga', 'pedraLua', 'sinoRapido', 'cardo', 'cachecol']) add(k);
    if (c >= 7) for (const k of ['elmoBronze', 'grinalda', 'trancaAmbar', 'mandibula', 'mantaBau', 'medalha', 'apito']) add(k);
  }
  return L;
}; }
FORJA3.push(
  { k: 'eq:elmoFarol', nm: 'Forjar: Elmo do Farol', cap: 9, mats: { lenteG: 1, latao: 3 }, c: 280, d: 'Rita: +9 DEF, +6 RESIST, +40 PV. (Conjunto do Farol.)' },
  { k: 'eq:veuEstrelas', nm: 'Forjar: Véu de Estrelas', cap: 9, mats: { vitralM: 1, penaGralha: 2 }, c: 280, d: 'Lume: +8 MAG, +8 RESIST. (Conjunto da Luz.)' },
  { k: 'eq:trancaFarol', nm: 'Forjar: Tranca do Farol', cap: 9, mats: { coracaoGelo: 1, ambarLasca: 3 }, c: 320, d: 'Baú: +8 ATQ, +8 MAG, +8 PM.' }
);

// ================= A TELA DE EQUIPAMENTO (pedido do usuário: "bem bonita, não só texto") =================
// Abas com retrato; o personagem grande no pedestal; os encaixes com ÍCONE de pixel de cada peça; atributos em
// barras com a PRÉVIA (verde sobe, vermelho desce) enquanto você passeia pela lista; conjuntos com bolinhas.
// < > troca de personagem · cima/baixo escolhe o encaixe · A abre a lista · B volta.
const ICO_C = {};
const COR_TIER = { 0: ['#8a6a4a', '#b8946a', '#5a4030'], 1: ['#8a7a6a', '#b8a890', '#5a4a3a'], 2: ['#a8b0c0', '#e0e8f0', '#6a7080'], 3: ['#c88a40', '#f0c070', '#7a5020'], 4: ['#e8b830', '#fff0a0', '#8a6010'] };
const COR_FX = { critico: '#ff5a5a', vampiro: '#a01830', regenPM: '#5aa8ff', primeiro: '#ffe060', espinhos: '#6ad060', ultimaChance: '#ffd060', tensao: '#ff9a40', resQueima: '#ff8a50', resFrio: '#8fe3ff', anel: '#c040c0', fone: '#8fe3d8' };
function tipoIcone(k) {
  const E = EQ2[k], n = E.nm;
  if (E.slot === 'arma') return E.who.length === 1 && E.who[0] === 'bau' ? (/Mand/.test(n) ? 'mandibula' : 'tranca') : /Lança/.test(n) ? 'lanca' : /Microfone/.test(n) ? 'microfone' : /Lira/.test(n) ? 'lira' : 'varinha';
  if (E.slot === 'roupa') return E.who.length === 1 && E.who[0] === 'bau' ? 'capa' : /Escudo/.test(n) ? 'escudo' : /Luva/.test(n) ? 'luva' : /Avental/.test(n) ? 'avental' : 'roupa';
  if (E.slot === 'cabeca') return /Elmo/.test(n) ? 'elmo' : /Chapéu/.test(n) ? 'chapeu' : /Véu/.test(n) ? 'veu' : 'tiara';
  return /Anel/.test(n) ? 'anel' : /Fone/.test(n) ? 'fone' : /Rel[óo]gio/.test(n) ? 'relogio' : /Sapatilha/.test(n) ? 'sapato' : /Lanterna/.test(n) ? 'lanterna' : /Sin/.test(n) ? 'sino' : 'pingente';
}
function iconeEq(k) {
  if (!k || !EQ2[k]) return null; if (ICO_C[k]) return ICO_C[k];
  const E = EQ2[k], [M, L, D] = COR_TIER[E.tier || 0], P = new Pix(16, 16), t = tipoIcone(k), gem = COR_FX[(E.fx || [])[0]] || '#b080ff';
  const R = (x, y, w, h, c) => P.rect(x, y, w, h, c);
  switch (t) {
    case 'lanca': for (let i = 0; i < 12; i++) P.p(2 + i, 13 - i, i % 2 ? '#7a5030' : '#9a6a40'); R(12, 1, 3, 3, L); P.p(14, 0, L); P.p(15, 1, M); R(11, 3, 2, 2, M); break;
    case 'varinha': for (let i = 0; i < 10; i++) P.p(3 + i, 13 - i, '#6a4a30'); R(11, 1, 4, 4, L); P.p(13, 3, '#ffffff'); P.p(12, 0, gem); P.p(15, 3, gem); break;
    case 'lira': R(4, 3, 2, 10, M); R(10, 3, 2, 10, M); R(4, 12, 8, 2, L); R(5, 2, 6, 1, L); for (let x = 6; x < 10; x++) R(x, 4, 1, 8, '#e8e8f0'); break;
    case 'microfone': R(6, 1, 5, 6, '#9a9aaa'); R(7, 2, 3, 4, '#c8c8d8'); R(8, 7, 1, 7, '#5a5a6a'); R(6, 14, 5, 1, '#5a5a6a'); break;
    case 'tranca': R(4, 7, 9, 8, M); R(5, 8, 7, 6, L); R(5, 3, 2, 5, D); R(10, 3, 2, 5, D); R(6, 2, 5, 2, D); R(8, 10, 1, 3, '#1a1020'); P.p(8, 9, '#1a1020'); break;
    case 'mandibula': for (let x = 2; x < 14; x++) { R(x, 9, 1, 4, M); if (x % 2) P.p(x, 8, '#f0f0e0'); } R(2, 12, 12, 2, D); for (let x = 3; x < 13; x += 2) P.p(x, 7, '#f0f0e0'); break;
    case 'capa': R(4, 2, 8, 2, D); for (let y = 4; y < 15; y++) R(7 - Math.floor(y / 3), y, 2 + Math.floor(y / 3) * 2, 1, y % 4 ? M : L); break;
    case 'escudo': R(3, 2, 10, 8, M); R(4, 3, 8, 6, L); for (let y = 10; y < 14; y++) R(3 + (y - 9), y, 10 - (y - 9) * 2, 1, M); R(7, 4, 2, 7, D); break;
    case 'luva': R(4, 6, 8, 8, '#8a6a4a'); for (let x = 4; x < 12; x += 2) R(x, 3, 2, 4, '#9a7a5a'); R(3, 12, 10, 2, D); break;
    case 'avental': R(5, 2, 6, 3, '#f2ecdc'); R(3, 5, 10, 10, '#f2ecdc'); R(6, 8, 4, 3, '#d8d0c0'); break;
    case 'roupa': R(3, 3, 10, 3, M); R(1, 4, 3, 6, M); R(12, 4, 3, 6, M); R(4, 6, 8, 9, M); R(5, 6, 6, 9, L); R(7, 3, 2, 3, D); P.p(8, 9, gem); break;
    case 'elmo': R(3, 4, 10, 8, M); R(4, 3, 8, 2, L); R(4, 5, 3, 6, L); R(5, 8, 6, 2, '#1a1020'); R(7, 1, 2, 3, D); break;
    case 'chapeu': R(1, 10, 14, 2, '#c8a050'); R(4, 4, 8, 7, '#d8b060'); R(4, 8, 8, 1, '#8a3a2a'); break;
    case 'tiara': for (let x = 2; x < 14; x++) P.p(x, 10 - Math.round(Math.sin((x - 2) / 11 * Math.PI) * 3), L); R(7, 3, 2, 3, gem); P.p(4, 7, gem); P.p(11, 7, gem); break;
    case 'veu': for (let y = 3; y < 14; y++) R(8 - Math.floor(y / 2), y, Math.floor(y / 2) * 2, 1, y % 3 ? '#6a6ab8' : '#8a8ad8'); P.p(6, 6, '#ffffff'); P.p(10, 9, '#ffffff'); P.p(7, 12, '#ffffff'); break;
    case 'anel': for (let a = 0; a < 16; a++) P.p(Math.round(8 + Math.cos(a / 16 * Math.PI * 2) * 4), Math.round(10 + Math.sin(a / 16 * Math.PI * 2) * 4), M); R(6, 3, 4, 4, gem); break;
    case 'fone': for (let a = 0; a < 12; a++) P.p(Math.round(8 + Math.cos(Math.PI + a / 11 * Math.PI) * 6), Math.round(9 + Math.sin(Math.PI + a / 11 * Math.PI) * 6), '#5a5a6a'); R(1, 8, 3, 5, '#e84a7a'); R(12, 8, 3, 5, '#e84a7a'); P.p(8, 3, '#d8d8d8'); break;
    case 'relogio': for (let a = 0; a < 16; a++) P.p(Math.round(8 + Math.cos(a / 16 * Math.PI * 2) * 5), Math.round(9 + Math.sin(a / 16 * Math.PI * 2) * 5), M); R(5, 6, 7, 7, '#f2ecdc'); R(8, 7, 1, 3, '#1a1020'); R(8, 9, 3, 1, '#1a1020'); R(7, 2, 3, 2, D); break;
    case 'sapato': R(2, 9, 10, 4, '#c84a7a'); R(9, 6, 4, 5, '#c84a7a'); R(2, 12, 12, 2, '#5a2a3a'); break;
    case 'lanterna': R(5, 4, 6, 9, '#3a3a4a'); R(6, 5, 4, 7, '#ffd060'); R(7, 2, 2, 2, '#5a5a6a'); break;
    case 'sino': R(5, 4, 6, 7, L); R(4, 10, 8, 2, M); P.p(8, 12, D); P.p(8, 13, D); R(7, 2, 2, 2, M); break;
    default: for (let x = 3; x < 13; x++) P.p(x, Math.round(2 + Math.abs(x - 7.5) * 0.4), D); R(5, 6, 6, 7, M); R(6, 7, 4, 5, gem); P.p(7, 8, '#ffffff');
  }
  P.outline(); return ICO_C[k] = P.canvas();
}
const ICOV_C = {};
function iconeSlotVazio(s) { if (ICOV_C[s]) return ICOV_C[s]; const P = new Pix(16, 16), c = '#3a3450'; const pt = (x, y) => { if ((x + y) % 2 === 0) P.p(x, y, c); };
  if (s === 'arma') for (let i = 0; i < 11; i++) pt(3 + i, 13 - i); else if (s === 'roupa') { for (let x = 4; x < 12; x++) { pt(x, 4); pt(x, 14); } for (let y = 4; y < 15; y++) { pt(4, y); pt(11, y); } } else if (s === 'cabeca') { for (let x = 3; x < 13; x++) pt(x, 11); for (let a = 0; a < 14; a++) pt(Math.round(8 + Math.cos(Math.PI + a / 13 * Math.PI) * 5), Math.round(11 + Math.sin(Math.PI + a / 13 * Math.PI) * 6)); } else { for (let a = 0; a < 16; a++) pt(Math.round(8 + Math.cos(a / 16 * Math.PI * 2) * 3), Math.round(10 + Math.sin(a / 16 * Math.PI * 2) * 3)); pt(8, 4); pt(8, 6); }
  return ICOV_C[s] = P.canvas(); }

function telaEquip() {
  return new Promise(res => {
    const quem = ['bau', 'lume', 'rita'].filter(k => partyKeys().includes(k));
    let ci = 0, si = 0, modo = 'slot', li = 0, top = 0, t = 0, mudou = 0, opts = [];
    const sl = () => SLOTS_DE[quem[ci]];
    const abreLista = () => { const id = quem[ci], s = sl()[si]; opts = [null, ...Object.keys(G.equipInv || {}).filter(k => G.equipInv[k] > 0 && cabeNoSlot(k, s) && EQ2[k].who.includes(id) && !emUsoPorOutro2(k, id, s))]; li = Math.max(0, opts.indexOf(eqOf(id)[s] || null)); top = 0; modo = 'item'; };
    const w = { type: 'equip',
      update() {
        t++;
        if (modo === 'slot') {
          if (btnp('left')) { ci = (ci + quem.length - 1) % quem.length; si = 0; mudou = t; sfx('select'); }
          if (btnp('right')) { ci = (ci + 1) % quem.length; si = 0; mudou = t; sfx('select'); }
          if (navp('up')) { si = (si + sl().length - 1) % sl().length; sfx('move'); }
          if (navp('down')) { si = (si + 1) % sl().length; sfx('move'); }
          if (btnp('a')) { abreLista(); sfx('select'); }
          if (btnp('b')) { sfx('cancel'); closeWin(this); res(); }
        } else {
          if (navp('up')) { li = (li + opts.length - 1) % opts.length; sfx('move'); }
          if (navp('down')) { li = (li + 1) % opts.length; sfx('move'); }
          if (btnp('b')) { modo = 'slot'; sfx('cancel'); }
          if (btnp('a')) {
            const id = quem[ci], s = sl()[si], k = opts[li]; G.eq = G.eq || {}; G.eq[id] = G.eq[id] || {}; G.eq[id][s] = k; sfx('equip'); modo = 'slot'; this.brilho = { si, t };
            if (k && EQ2[k].maldito) say('* O anel aperta o dedo. Não sai. Quer dizer, sai, mas reclama.');
          }
          if (li < top) top = li; if (li > top + 5) top = li - 5;
        }
      },
      draw() {
        const id = quem[ci], X = 4, Y = 4, Wd = 232, Hd = 232, k = Math.min(1, (t - mudou) / 10);
        const m = grupoAtual().find(q => q.id === id), prev = modo === 'item' ? statsCom(id, sl()[si], opts[li]) : null;
        bx.globalAlpha = 0.7; bx.fillStyle = '#05030a'; bx.fillRect(-400, -10, 1200, 300); bx.globalAlpha = 1;
        bx.fillStyle = '#0e0a1a'; bx.fillRect(X + 2, Y + 2, Wd - 4, Hd - 4); box(X, Y, Wd, Hd);
        // abas
        quem.forEach((u, j) => { const x = X + 8 + j * 30, y = Y + 7, sel = j === ci; bx.fillStyle = sel ? UIC.accent : 'rgba(143,227,216,0.25)'; bx.fillRect(x - 1, y - 1, 26, 26); bx.fillStyle = '#0a0612'; bx.fillRect(x, y, 24, 24); const mm = grupoAtual().find(q => q.id === u); const p = mm && PT(mm.port); if (p) { bx.globalAlpha = sel ? 1 : 0.5; bx.drawImage(p, x, y, 24, 24); bx.globalAlpha = 1; } });
        txt(nomeQuem(id), X + 104, Y + 8, { col: '#ffffff', sz: 1.5 }); txt('EQUIPAMENTO', X + 104, Y + 26, { col: UIC.line });
        txt('< >', X + Wd - 10, Y + 10, { align: 'right', col: '#8a8099' });
        // pedestal
        const cx = X + 46, cy = Y + 124;
        bx.globalAlpha = 0.35; bx.fillStyle = m.col || UIC.line; bx.beginPath(); bx.ellipse(cx, cy, 34, 9, 0, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
        for (let a = 0; a < 12; a++) { const ang = a / 12 * Math.PI * 2 + t * 0.01; bx.fillStyle = a % 3 ? 'rgba(143,227,216,0.6)' : m.col || '#ffe066'; bx.fillRect(Math.round(cx + Math.cos(ang) * 30), Math.round(cy + Math.sin(ang) * 8), 2, 1); }
        const img = imagemDe(m);
        if (img) { const esc = Math.min(2, 80 / img.height, 70 / img.width) * (0.92 + 0.08 * k), w2 = Math.round(img.width * esc), h2 = Math.round(img.height * esc), bob = Math.round(Math.sin(t * 0.06) * 1.5); bx.drawImage(img, Math.round(cx - w2 / 2), cy - h2 + 2 + bob, w2, h2); }
        // encaixes (com ícone)
        const ex = X + 96, ey0 = Y + 40, eq = eqOf(id);
        sl().forEach((s, j) => {
          const y = ey0 + j * 21, sel = j === si, kk = eq[s], E = kk && EQ2[kk];
          if (sel && modo === 'slot') { bx.fillStyle = UIC.sel; bx.fillRect(ex - 2, y - 1, 136, 20); }
          bx.fillStyle = E && E.set ? '#ffd060' : sel ? UIC.accent : 'rgba(143,227,216,0.35)'; bx.fillRect(ex, y, 18, 18); bx.fillStyle = '#0a0612'; bx.fillRect(ex + 1, y + 1, 16, 16);
          const ic = E ? iconeEq(kk) : iconeSlotVazio(s); bx.drawImage(ic, ex + 1, y + 1);
          if (this.brilho && this.brilho.si === j && t - this.brilho.t < 20) { bx.globalAlpha = 1 - (t - this.brilho.t) / 20; bx.fillStyle = '#ffffff'; bx.fillRect(ex, y, 18, 18); bx.globalAlpha = 1; }
          if (modo === 'slot') { txt(NOME_SLOT(id, s), ex + 22, y - 1, { col: '#8a8099' }); txt(E ? (E.nm.length > 18 ? E.nm.slice(0, 17) + '.' : E.nm) : '—', ex + 22, y + 8, { col: E ? (E.set ? '#ffd060' : '#ffe8b0') : '#5a5068' }); }
        });
        // atributos com prévia
        const sx = X + 8, sy = Y + 150, ST = [['atk', 'ATQ', '#ff9a50'], ['mag', 'MAG', '#d0a8ff'], ['def', 'DEF', '#8fb0ff'], ['mdef', 'RES', '#8fe3d8'], ['spd', 'VEL', '#ffe066'], ['mhp', 'PV', '#9be58a']];
        bx.fillStyle = 'rgba(143,227,216,0.25)'; bx.fillRect(X + 8, sy - 6, Wd - 16, 1);
        ST.forEach(([s, nm, c], j) => {
          const col = j % 2, row = Math.floor(j / 2), x = sx + col * 112, y = sy + row * 13, v = m[s] || 0, pv = prev ? prev[s] || 0 : v, mx = s === 'mhp' ? 400 : s === 'spd' ? 25 : 80;
          txt(nm, x, y, { col: '#b8aecb' }); txt(String(v), x + 46, y, { align: 'right', col: '#ffffff' });
          bx.fillStyle = 'rgba(143,227,216,0.15)'; bx.fillRect(x + 50, y + 4, 40, 4);
          bx.fillStyle = c; bx.fillRect(x + 50, y + 4, Math.round(40 * Math.min(1, Math.min(v, pv) / mx)), 4);
          if (pv !== v) { const a = Math.round(40 * Math.min(1, v / mx)), b = Math.round(40 * Math.min(1, pv / mx)); bx.fillStyle = pv > v ? '#9be58a' : '#ff6b6b'; bx.fillRect(x + 50 + Math.min(a, b), y + 4, Math.max(1, Math.abs(b - a)), 4); txt((pv > v ? '+' : '') + (pv - v), x + 94, y, { col: pv > v ? '#9be58a' : '#ff6b6b' }); }
        });
        // conjuntos
        const ss = Object.entries(setsDe(id)); let qy = sy + 42;
        if (modo === 'item') { } else if (ss.length) for (const [s, n] of ss.slice(0, 2)) { txt(SETS3[s].nm, sx, qy, { col: '#ffd060' }); for (let p = 0; p < 3; p++) { bx.fillStyle = p < n ? '#ffd060' : 'rgba(255,208,96,0.25)'; bx.fillRect(sx + 132 + p * 8, qy + 3, 5, 5); } qy += 12; }
        if (modo === 'slot') txt('A: trocar  ·  < >: outro personagem', X + Wd / 2, Y + Hd - 14, { align: 'center', col: '#6a6078' });
        // lista de peças (por cima dos encaixes)
        if (modo === 'item') {
          const lx = X + 92, ly = Y + 34, lw = 140;
          bx.fillStyle = '#120c22'; bx.fillRect(lx, ly, lw, 112); box(lx, ly, lw, 112, { bw: 1 });
          txt(NOME_SLOT(id, sl()[si]), lx + 6, ly + 3, { col: UIC.accent });
          opts.slice(top, top + 6).forEach((kk, n) => {
            const j = top + n, y = ly + 16 + n * 15, sel = j === li, E = kk && EQ2[kk];
            if (sel) { bx.fillStyle = UIC.sel; bx.fillRect(lx + 3, y - 1, lw - 6, 15); }
            if (E) bx.drawImage(iconeEq(kk), lx + 5, y - 1, 13, 13);
            txt(E ? (E.nm.length > 17 ? E.nm.slice(0, 16) + '.' : E.nm) : '(tirar)', lx + 21, y + 1, { col: E ? (E.set ? '#ffd060' : '#ffffff') : '#9aa8b4' });
          });
          if (opts.length > 6) txt(`${li + 1}/${opts.length}`, lx + lw - 6, ly + 3, { align: 'right', col: '#6a6078' });
          const kk = opts[li], E = kk && EQ2[kk];
          box(X + 4, Y + Hd - 40, Wd - 8, 36, { bw: 1 });
          txt(E ? E.d : 'Deixar o espaço vazio.', X + 10, Y + Hd - 36, { w: 36, col: '#c8d4dc' });
        }
      } };
    openWin(w);
  });
}
menuEquipar = telaEquip;
