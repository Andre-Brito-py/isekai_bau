// ================= O GRIMÓRIO ACORDA (Cap. 3) =================
// Com a TINTA DE SUPERFÍCIE (fuligem de poste + óleo de lamparina + lágrima de quem escreve), o baú reescreve as runas.
// Cada PÁGINA do Grimório é um feitiço montado: ELEMENTO (1 ou 2) + FORMA.
//  - Elementos: Brasa (fogo), Geada (gelo), Seiva (vida), Fuligem (nova: fumaça que deixa TONTO; nasce da própria tinta).
//  - Formas: Dardo (um inimigo), Onda (todos, pesada), Véu (um aliado: proteção/apoio, leve).
//  - Dois elementos = FUSÃO (descoberta ao experimentar; a Ofélia anota na margem). Elemento repetido = DOBRADO (mais forte).
//  - Fusões erradas existem e são engraçadas (Fuligem + Seiva = Mofo: todo mundo espirra).
// O baú usa as páginas na batalha no lugar das runas antigas. Edita no MENU > Grimório ou na estante da base.

const EL3 = {
  brasa: { nm: 'Brasa', el: 'fogo', col: '#f07830', cols: ['#f07830', '#ffd040', '#c83a18'], d: 'fogo; pode queimar' },
  geada: { nm: 'Geada', el: 'gelo', col: '#7ad0f0', cols: ['#bff0ff', '#7ad0f0', '#ffffff'], d: 'gelo; gela (a vez demora)' },
  seiva: { nm: 'Seiva', el: null, col: '#9be58a', cols: ['#9be58a', '#4a9a4a', '#ffffff'], d: 'vida: cura ou drena' },
  fuligem: { nm: 'Fuligem', el: null, col: '#c0b0e0', cols: ['#3a3048', '#6a5a7a', '#a898b8'], d: 'fumaça: deixa TONTO' }
};
const FORMA3 = {
  dardo: { nm: 'Dardo', tgt: 'one', mp: 5, pow: 1.15, w: 'normal', d: 'um inimigo' },
  onda: { nm: 'Onda', tgt: 'all', mp: 9, pow: 0.65, w: 'pesada', d: 'todos os inimigos (ação pesada)' },
  veu: { nm: 'Véu', tgt: 'ally', mp: 6, pow: 0, w: 'leve', d: 'um aliado (ação leve)' }
};
// fusões: chave em ordem alfabética
const FUS3 = {
  'brasa+geada': { nm: 'Vapor', col: '#e8e8f0', cols: ['#ffffff', '#c8d8e8', '#f0a070'], hits: [['fogo', 0.6], ['gelo', 0.6]], d: 'escalda: um golpe de fogo E um de gelo (pega duas fraquezas)', veu: 'vapor', nota: '"Brasa + Geada = Vapor. Escalda. Bate duas vezes. Não tente em casa."' },
  'geada+seiva': { nm: 'Orvalho', col: '#a8f0e0', cols: ['#a8f0e0', '#ffffff', '#9be58a'], hits: [['gelo', 0.7]], st: 'frio', curaGrupo: 0.08, d: 'gelo que gela e cura um pouco o grupo', veu: 'orvalho', nota: '"Geada + Seiva = Orvalho. Fresquinho. Cura e gela ao mesmo tempo. A natureza é estranha."' },
  'brasa+seiva': { nm: 'Brasa Viva', col: '#ffb040', cols: ['#ffb040', '#9be58a', '#ffd040'], hits: [['fogo', 0.95]], dreno: 0.5, d: 'fogo que devolve vida a quem lança', veu: 'brasaviva', nota: '"Brasa + Seiva = Brasa Viva. O fogo que planta. Lembra fogueira de São João."' },
  'brasa+fuligem': { nm: 'Fumaça', col: '#6a5a6a', cols: ['#4a3a4a', '#8a7a8a', '#f07830'], hits: [['fogo', 0.55]], tonto: 0.8, d: 'fogo fraco que deixa quase todo mundo TONTO', veu: 'fumaca', nota: '"Brasa + Fuligem = Fumaça. Tosse garantida. Ótimo para fugir de visita chata."' },
  'fuligem+geada': { nm: 'Geada Negra', col: '#5a6a9a', cols: ['#3a4a7a', '#bff0ff', '#1a1028'], hits: [['gelo', 1.35]], st: 'frio', mpX: 1.5, d: 'gelo pesado e escuro; gela. Caro', veu: 'geadanegra', nota: '"Fuligem + Geada = Geada Negra. Gelo que dói até na alma. Use com cuidado."' },
  'fuligem+seiva': { nm: 'Mofo', col: '#8a9a5a', cols: ['#8a9a5a', '#c8d890', '#5a6a3a'], hits: [['fogo', 0.15]], tonto: 0.6, mofo: true, d: 'deu errado: todo mundo espirra (inimigos ficam TONTOS, o grupo também se machuca um pouco)', veu: 'mofo', nota: '"Fuligem + Seiva = MOFO. Não. Só... não. (Registrado para que ninguém repita.)"' }
};
const VEU3 = {
  brasa: { nm: 'Manto de Brasa', d: 'o aliado bate 30% mais forte por 3 vezes' },
  geada: { nm: 'Couraça de Gelo', d: 'o aliado leva metade do dano até a próxima vez dele' },
  seiva: { nm: 'Cura', d: 'cura 30% da vida do aliado' },
  fuligem: { nm: 'Véu de Fumaça', d: 'o próximo golpe no aliado erra' },
  vapor: { nm: 'Sauna', d: 'cura 15% e tira gelado e tonto' },
  orvalho: { nm: 'Orvalho', d: 'cura 20% e dá Couraça de Gelo' },
  brasaviva: { nm: 'Brasa Viva', d: 'cura 18% e dá Manto de Brasa' },
  fumaca: { nm: 'Cortina', d: 'o próximo golpe no aliado erra e ele fica com a vez adiantada' },
  geadanegra: { nm: 'Armadura Negra', d: 'metade do dano por 2 vezes, mas a vez demora' },
  mofo: { nm: 'Mofo', d: 'o aliado espirra. Cura 5%. Fica TONTO. Por que você faria isso?' },
  dobrado: { nm: 'Dobrado', d: 'o efeito do véu, mais forte' }
};
function chaveFus(a, b) { return [a, b].sort().join('+'); }
function grim() { G.grim = G.grim || { ativo: false, slots: [], fus: {}, elems: ['brasa', 'geada', 'seiva'], forms: ['dardo', 'onda', 'veu'], max: 4 }; return G.grim; }
// descreve uma página (nome, custo, alvo, efeito)
function pagina3(s) {
  const F = FORMA3[s.f], e1 = s.e[0], e2 = s.e[1];
  const fus = e2 && e2 !== e1 ? FUS3[chaveFus(e1, e2)] : null, dob = e2 && e2 === e1;
  const base = fus ? fus : EL3[e1];
  const nmEl = fus ? fus.nm : EL3[e1].nm + (dob ? ' Dobrada' : '');
  let mp = F.mp + (e1 === 'fuligem' || e2 === 'fuligem' ? 1 : 0) + (fus ? 4 : 0); if (dob) mp = Math.round(mp * 1.6); if (fus && fus.mpX) mp = Math.round(mp * fus.mpX);
  const veuK = s.f === 'veu' ? (fus ? fus.veu : e1) : null;
  const d = s.f === 'veu' ? (VEU3[veuK].nm + ': ' + VEU3[veuK].d + (dob ? ' (dobrado: mais forte)' : '')) : (fus ? fus.d : EL3[e1].d) + ' · ' + F.d + (dob ? ' · dobrado: 50% mais forte' : '');
  return { nm: nmEl + ' · ' + (s.f === 'veu' ? VEU3[veuK].nm : F.nm), mp, d, tgt: F.tgt, w: F.w, fus, dob, base, col: (fus || EL3[e1]).col, cols: (fus || EL3[e1]).cols, veuK };
}
// monta o feitiço de batalha de uma página
function feitico3(s) {
  const P = pagina3(s), F = FORMA3[s.f], k = P.dob ? 1.5 : 1;
  return { nm: P.nm, mp: P.mp, w: P.w, tgt: P.tgt, d: P.d, run: async (m, t) => {
    const ehBau = m.id === 'bau';
    if (ehBau) await bauConjura(m, P.col, 14); else sfx('rune');
    if (s.f === 'veu') { await veu3(m, t, P, k); m.pose = null; return; }
    const alvos = s.f === 'onda' ? alive(BT.foes) : [t];
    if (s.f === 'dardo') await projectile(ehBau ? { _pt: [m.x, m.y - m.h + 6] } : m, t, P.col, 16, { r: 4, trail: P.cols });
    else { sfx('geada'); const [x0, y0] = unitCenter(m); await tw(20, p => { for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = p * 150; bx.fillStyle = P.cols[i % P.cols.length]; bx.fillRect(Math.round(x0 + r + Math.cos(a) * 10), Math.round(y0 + Math.sin(a) * 20 * (1 - p * 0.5)), 2, 2); } }); }
    await golpe3(m, alvos, P, F, s, k);
    if (BT.eco) { BT.eco = false; await wait(10); callout('Eco!', '#d0a8ff', 30); await golpe3(m, alvos.filter(a => a.hp > 0), P, F, s, k * 0.5); }
    m.pose = null;
  } };
}
async function golpe3(m, alvos, P, F, s, k) {
  const fus = P.fus, e1 = s.e[0];
  let drenado = 0;
  for (const t of alvos) {
    if (t.hp <= 0) continue;
    const [x, y] = unitCenter(t); burst(x, y, 18, P.cols, { up: 1 }); flashW(1);
    const hits = fus ? fus.hits : e1 === 'seiva' ? [[null, 0.8]] : e1 === 'fuligem' ? [[null, 0.75]] : [[EL3[e1].el, 1]];
    for (const [el, mult] of hits) { if (t.hp <= 0) break; drenado += hitFoe(m, t, F.pow * mult * k, { el: el || undefined, mag: true, ranged: true }) || 0; if (hits.length > 1) await wait(6); }
    if (t.hp <= 0) continue;
    const st = fus ? fus.st : e1 === 'geada' ? 'frio' : e1 === 'brasa' ? (Math.random() < 0.35 ? 'queimado' : null) : null;
    if (st === 'frio') { t.st.frio = 2; popNum(x, y - 22, 'GELADO', '#bff0ff'); }
    if (st === 'queimado') { t.st.queimado = 3; popNum(x, y - 22, 'QUEIMADO', '#ffa94d'); }
    const ton = fus ? fus.tonto : e1 === 'fuligem' ? (s.f === 'onda' ? 0.5 : 1) : 0;
    if (ton && Math.random() < ton) { t.ct = Math.max(0, t.ct - 40); popNum(x, y - 30, 'TONTO', '#d0a8ff'); }
  }
  if ((fus && fus.dreno) || e1 === 'seiva' && !fus) healUnit(m, Math.max(1, Math.round(drenado * ((fus && fus.dreno) || 0.5))));
  if (fus && fus.curaGrupo) for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * fus.curaGrupo));
  if (fus && fus.mofo) { callout('ATCHIM!', '#c8d890', 50); for (const u of alive(BT.party)) hurtMember(u, Math.round(u.mhp * 0.04)); }
}
async function veu3(m, t, P, k) {
  const [x, y] = unitCenter(t), K = P.veuK, cura = f => healUnit(t, Math.round(t.mhp * f * k));
  await tw(22, p => { fxRing(x, y, 6 + p * 16, P.col, 1 - p); for (let i = 0; i < 6; i++) { const a = p * 6 + i; bx.fillStyle = P.cols[i % P.cols.length]; bx.fillRect(Math.round(x + Math.cos(a) * 14), Math.round(y + 10 - p * 26 + Math.sin(a) * 3), 2, 2); } });
  const manto = () => { t.st.manto = Math.round(3 * k); popNum(x, y - 26, 'MANTO DE BRASA', '#ffa94d'); };
  const coura = () => { t.def0 = true; t.st.couraca = 1; popNum(x, y - 26, 'COURAÇA', '#bff0ff'); };
  const some = () => { t.st.sumido = 1; popNum(x, y - 26, 'NA FUMAÇA', '#a898b8'); };
  if (K === 'brasa') manto();
  else if (K === 'geada') coura();
  else if (K === 'seiva') cura(0.3);
  else if (K === 'fuligem') some();
  else if (K === 'vapor') { cura(0.15); t.st.frio = 0; t.st.tonto = 0; }
  else if (K === 'orvalho') { cura(0.2); coura(); }
  else if (K === 'brasaviva') { cura(0.18); manto(); }
  else if (K === 'fumaca') { some(); t.ct = Math.min(99, t.ct + 30); }
  else if (K === 'geadanegra') { coura(); t.st.couraca = 2; t.ct = Math.max(0, t.ct - 25); }
  else if (K === 'mofo') { cura(0.05); callout('ATCHIM!', '#c8d890', 50); t.ct = Math.max(0, t.ct - 30); popNum(x, y - 26, 'TONTO', '#d0a8ff'); }
}
// efeitos dos véus no combate: Manto (+30% de dano), Fumaça (o próximo golpe erra), Couraça de 2 vezes
{ const _cd3 = calcDmg; calcDmg = function (a, t, pow, o = {}) { let d = _cd3(a, t, pow, o); if (a && a.side === 'p' && a.st && a.st.manto > 0 && !o._semManto) { d *= 1.3; } return d; }; }
{ const _hf4 = hitFoe; hitFoe = function (a, t, pow, o = {}) { const r = _hf4(a, t, pow, o); if (a && a.st && a.st.manto > 0 && r > 0) { a.st.manto--; } return r; }; }
{ const _fs3 = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  if (t && t.st && t.st.sumido > 0 && t.hp > 0) { t.st.sumido = 0; const [x, y] = unitCenter(t); popNum(x, y - 24, 'ERROU!', '#a898b8', true); sfx('guard'); burst(x, y, 10, ['#6a5a7a', '#a898b8']); return 'perfeito'; }
  const r = await _fs3(e, t, pow, o);
  if (t && t.st && t.st.couraca > 1) { t.st.couraca--; t.def0 = true; } else if (t && t.st) t.st.couraca = 0;
  return r;
}; }
Object.assign(ST_NAME, { manto: 'MANTO', sumido: 'FUMAÇA' });

// ---------- o baú usa as páginas do Grimório na luta ----------
{ const _ga3 = grupoAtual; grupoAtual = function () {
  const g = _ga3(), Gm = grim();
  if (Gm.ativo && Gm.slots.length) {
    const b = g.find(m => m.id === 'bau');
    if (b) { b.runas = Gm.slots.map((s, i) => { RUNA2['grim' + i] = feitico3(s); return 'grim' + i; }); b.magNm = 'Grimório'; b.magDesc = 'As páginas do Grimório: feitiços que você montou. Gastam PM.'; }
  }
  return g;
}; }

// ---------- a tela do Grimório ----------
const ORD_EL = ['brasa', 'geada', 'seiva', 'fuligem'];
async function abrirGrimorio(guiado) {
  const Gm = grim(); sfx('rune');
  while (true) {
    const its = [];
    for (let i = 0; i < Gm.max; i++) { const s = Gm.slots[i]; if (s) { const P = pagina3(s); its.push({ label: `${i + 1}. ${P.nm}`, right: P.mp + 'PM', d: P.d }); } else its.push({ label: `${i + 1}. (página em branco)`, col: '#8a8099', d: 'Escreva um feitiço nesta página.' }); }
    const nf = Object.keys(Gm.fus).length, tot = Object.keys(FUS3).length;
    its.push({ label: `Fusões anotadas (${nf}/${tot})`, d: 'As anotações da Ofélia nas margens: cada fusão que você já descobriu.' });
    if (!guiado) its.push({ label: 'Fechar' });
    const i = await list({ x: 30, y: 24, w: 190, title: 'Grimório', items: its, desc: j => its[j] && its[j].d, descY: 168, cancel: !guiado });
    if (i < 0 || (!guiado && i === its.length - 1)) return;
    if (i === Gm.max) { await verFusoes(); continue; }
    const ok = await escreverPagina(i);
    if (guiado && ok) return;
  }
}
async function escreverPagina(i) {
  const Gm = grim();
  const els = Gm.elems.slice().sort((a, b) => ORD_EL.indexOf(a) - ORD_EL.indexOf(b));
  const a = await list({ x: 40, y: 30, w: 170, title: `Página ${i + 1}: 1º elemento`, items: els.map(k => ({ label: EL3[k].nm, col: EL3[k].col })), desc: j => EL3[els[j]] && (EL3[els[j]].nm + ': ' + EL3[els[j]].d), descY: 150 });
  if (a < 0) return false;
  const op2 = [{ label: '(só um elemento)', k: null }, ...els.map(k => ({ label: EL3[k].nm + (k === els[a] ? ' (dobrar)' : Gm.fus[chaveFus(els[a], k)] ? ' = ' + FUS3[chaveFus(els[a], k)].nm : ' = ???'), col: EL3[k].col, k }))];
  const b = await list({ x: 40, y: 30, w: 170, title: '2º elemento (fusão)', items: op2, desc: j => { const k = op2[j].k; if (!k) return 'Feitiço puro, mais barato.'; if (k === els[a]) return 'Elemento DOBRADO: 50% mais forte, custa mais PM.'; const f = FUS3[chaveFus(els[a], k)]; return Gm.fus[chaveFus(els[a], k)] ? f.nm + ': ' + f.d : 'Fusão desconhecida. Só tem um jeito de descobrir.'; }, descY: 150 });
  if (b < 0) return false;
  const fs = Gm.forms;
  const c = await list({ x: 40, y: 30, w: 170, title: 'Forma', items: fs.map(k => ({ label: FORMA3[k].nm })), desc: j => FORMA3[fs[j]].nm + ': ' + FORMA3[fs[j]].d + '.', descY: 150 });
  if (c < 0) return false;
  const s = { e: op2[b].k ? [els[a], op2[b].k] : [els[a]], f: fs[c] }, P = pagina3(s);
  Gm.slots[i] = s; sfx('rune');
  await say(`* Você escreve na página ${i + 1}: {y}${P.nm}{/} (${P.mp} PM). ${P.d[0].toUpperCase() + P.d.slice(1)}.`);
  if (P.fus) { const kf = chaveFus(s.e[0], s.e[1]); if (!Gm.fus[kf]) { Gm.fus[kf] = true; sfx('item'); await say('* Na margem, a tinta se mexe sozinha e vira letra. Uma letra redonda, apertada, de quem escrevia rápido.'); await say(`[Anotação da Ofélia: ${P.fus.nota}]`, 'cat'); if (kf === 'fuligem+seiva') await say('Isso tá cheirando a pão velho. @, apaga isso.', 'rita'); } }
  save2(); return true;
}
async function verFusoes() {
  const Gm = grim(), ks = Object.keys(FUS3);
  await panel(ks.map(k => Gm.fus[k] ? `{y}${k.split('+').map(e => EL3[e].nm).join(' + ')}{/} = ${FUS3[k].nm}` : '{d}??? + ??? = ???{/}'), { title: 'Fusões anotadas (letra da Ofélia)', w: 200, x: 20 });
}
