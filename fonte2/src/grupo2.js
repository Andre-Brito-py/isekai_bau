// ================= GRUPO DA T2: vida que continua, equipamentos, itens, loja, Marcos, menu =================
// ---------- equipamentos (só formas humanas: Lume e Rita por enquanto) ----------
// mod: atributos; fx: efeitos especiais que as técnicas conferem. Todo item tem vantagem e desvantagem.
const EQ2 = {
  lancaPedagio: { nm: 'Lança do Pedágio', slot: 'arma', who: ['rita'], mod: { atk: 4 }, fx: ['estocada3'], preco: 0, d: 'Troféu do Espantalho. +4 ATQ; a Estocada quebra 3 de escudo. Pesada: -1 VEL.', mod2: { spd: -1 } },
  escudoTampa: { nm: 'Escudo de Tampa', slot: 'roupa', who: ['rita'], mod: { def: 4, spd: -1 }, fx: ['provoca3'], preco: 120, d: 'Uma tampa de bueiro com alça. +4 DEF; Provocar dura 3 vezes. -1 VEL.' },
  sapatilha: { nm: 'Sapatilha de Palco', slot: 'amuleto', who: ['lume'], mod: { spd: 2, def: -2 }, fx: ['esquiva'], preco: 90, d: 'Às vezes desvia sozinha de golpes rápidos. +2 VEL, -2 DEF.' },
  microfone: { nm: 'Microfone de Lata', slot: 'arma', who: ['lume'], mod: { mag: 2 }, fx: ['microfone'], preco: 150, d: 'O Acalanto vira Acalanto em Coro: cura o grupo todo, mas custa o dobro de PM.' },
  xaleVelas: { nm: 'Xale de Velas', slot: 'roupa', who: ['lume'], mod: { mdef: 3, spd: -1 }, fx: ['vela5'], preco: 0, d: 'Bordado com velinhas. A Vela Protetora dura 5 vezes. +3 DEF mágica, -1 VEL.' },
  foneRemendado: { nm: 'Fone Remendado', slot: 'amuleto', who: ['lume'], mod: {}, fx: ['fone'], preco: 0, d: 'Com fita isolante. A Lume canta uma música que só os dois conhecem: curas +15%.' },
  anelPedagio: { nm: 'Anel do Pedágio', slot: 'amuleto', who: ['lume', 'rita'], mod: {}, fx: ['anel'], preco: 0, maldito: true, d: 'AMALDIÇOADO. +30% de dano. Cada ação cobra 5 de Tensão do grupo.' },
  luvaPescador: { nm: 'Luva de Pescador', slot: 'roupa', who: ['rita'], mod: { atk: 2, def: 2 }, fx: ['agua'], preco: 0, d: 'Do Seu Tobias. +2 ATQ e DEF; leva metade do dano de golpes de água.' }
};
const SLOTS2 = { arma: 'Arma', roupa: 'Roupa', amuleto: 'Amuleto' };
function eqOf(id) { return (G.eq && G.eq[id]) || {}; }
function eqFx(id) { const s = new Set(); for (const k of Object.values(eqOf(id))) if (k && EQ2[k]) for (const f of EQ2[k].fx || []) s.add(f); return s; }
function eqMods(id) { const m = {}; for (const k of Object.values(eqOf(id))) if (k && EQ2[k]) for (const o of [EQ2[k].mod, EQ2[k].mod2]) for (const [a, v] of Object.entries(o || {})) m[a] = (m[a] || 0) + v; return m; }
// o grupo de agora: base + poder que voltou + equipamento + vida e PM guardados
function grupoAtual() {
  const g = grupoCap1();
  for (const m of g) {
    const b = typeof poderNivel === 'function' ? poderNivel(m.id) : (G.poder || 0);   // nível (nivel.js) ou o poder antigo
    // crescimento por nível conforme o PAPEL (pedido do usuário: caminho mágico bate mais forte e aguenta menos)
    const CR = typeof crescimento === 'function' ? crescimento(m) : { hp: m.id === 'bau' ? 14 : 10, atk: 2, mag: 2, def: 1 };
    m.mhp += Math.round(b * CR.hp); m.atk += Math.round(b * CR.atk); m.mag += Math.round(b * CR.mag); m.def += Math.round(b * CR.def); if (CR.mdef) m.mdef = (m.mdef || m.def) + Math.round(b * CR.mdef);
    const md = eqMods(m.id); for (const [a, v] of Object.entries(md)) m[a] = Math.max(1, (m[a] || 0) + v);
    m.eqFx = eqFx(m.id);
    if (m.eqFx.has('microfone') && m.runas) m.runas = m.runas.map(r => r === 'acalanto' ? 'acalantoCoro' : r);
    const s = G.pt && G.pt[m.id];
    m.hp = s ? Math.min(m.mhp, Math.max(s.hp > 0 ? 1 : 0, s.hp)) : m.mhp; m.mp = s ? Math.min(m.mmp, s.mp) : m.mmp;
    if (m.hp <= 0) m.hp = 1;
  }
  return g.filter(m => partyKeys().includes(m.id));
}
function guardarGrupo(party) { G.pt = G.pt || {}; for (const m of party) G.pt[m.id] = { hp: Math.max(1, m.hp), mp: m.mp }; }
function curarTudo() { G.pt = {}; }
// cantiga extra para o Microfone de Lata
RUNA2.acalantoCoro = { nm: 'Acalanto em Coro', mp: 16, w: 'normal', tgt: 'all', d: 'Cura 25% da vida do grupo todo e tira queimadura e frio.', run: async (m) => {
  sfx('heal'); jingle('G5:2 E5:2 C6:2 G5:2 E6:4', 220);
  await tw(30, (p, k) => { for (const u of alive(BT.party)) { const [x, y] = unitCenter(u); txt('♪', x + Math.sin(k / 5) * 3, y - 10 - p * 22, { col: '#ffd060', alpha: 1 - p }); } });
  for (const u of alive(BT.party)) { healUnit(u, Math.round(u.mhp * 0.25 * (m.eqFx && m.eqFx.has('fone') ? 1.15 : 1))); u.st.queimado = 0; u.st.frio = 0; }
} };

// ---------- luta no mapa ----------
const FOE_POS = [[176, 132], [208, 150], [196, 108]];
async function lutaMapa(group, o = {}) {
  const itens0 = { ...G.items }, pt0 = JSON.parse(JSON.stringify(G.pt || {}));
  while (true) {
    G.items = { ...itens0 }; G.pt = JSON.parse(JSON.stringify(pt0));
    const foes = group.map((id, i) => { const [x, y] = o.pos ? o.pos[i] : FOE_POS[i]; const d = ENEMY2[id]; return { id, x, y: d.fly ? y - 46 : y }; });
    const res = await battle2({ party: grupoAtual(), foes, music: o.music || 'luta2', bg: o.bg || (W2.map && W2.map.batBg), tension: o.tension || 0, quitLabel: 'Voltar ao último save', intro: o.intro, ...(o.extra || {}) });
    if (res === 'win') {
      guardarGrupo(BT.party);
      const c = group.reduce((a, id) => a + (ENEMY2[id].cobres || 8), 0); G.cobres = (G.cobres || 0) + c;
      V.scene = 'world'; await fadeIn(12);
      await say(`* +${c} cobres.`);
      return 'win';
    }
    if (res === 'quit') { await voltarMarco(); return 'lose'; }
    await fadeOut(10);
  }
}
async function voltarMarco() {
  // GAME OVER: carrega o último save (o que aconteceu depois dele se perde: XP, cobres, itens, baús, conversas)
  const salvo = load2();
  if (salvo) { for (const k of Object.keys(G)) delete G[k]; Object.assign(G, salvo); montarMapas2(); }
  const P = G.pos && MAPS2[G.pos.map] ? G.pos : (G.marco ? { ...G.marco, dir: 'down' } : null);
  curarTudo(); V.scene = 'world'; if (P) loadMap2(P.map, P.x, P.y, P.dir || 'down'); await fadeIn(20);
  await say('* Tudo escurece... e você acorda no último lugar onde o jogo foi salvo, com a Lume abanando a sua tampa com um chapéu.');
}

// ---------- Marco: salva, cura, e os bichos voltam ----------
function marcoSpr() { return MARCO_C || (MARCO_C = marcoArt()); }
let MARCO_C = null;
function marcoArt() {
  const P = new Pix(20, 40), S = ramp('#7a7480');
  P.cyl(4, 8, 12, 30, S); P.rect(2, 36, 16, 4, S[1]);
  P.poly([[4, 8], [16, 8], [10, 0]], (x, y) => P.tone(S, 0.8 - y * 0.04, x, y));
  // runa do baú brilhando
  for (const [x, y] of [[8, 16], [9, 16], [10, 16], [11, 16], [8, 17], [11, 17], [8, 18], [9, 18], [10, 18], [11, 18], [9, 20], [10, 20], [9, 21], [10, 22]]) P.p(x, y, '#ffd060');
  return P.outline().canvas();
}
async function usarMarco(e) {
  sfx('save'); curarTudo(); G.gone2 = {}; G.marco = { map: W2.id, x: W2.x, y: W2.y }; G.marcos = G.marcos || {}; G.marcos[W2.id] = { x: W2.x, y: W2.y, nm: W2.map.name };
  save2();
  await tw2glow();
  await say('* A runa do Marco brilha. O grupo descansa, a vida e os PM voltam, e o jogo foi salvo. (Os bichos da região também descansaram.)');
  loadMap2(W2.id, W2.x, W2.y, W2.dir);
}
function tw2glow() { return new Promise(r => { let k = 0; const f = () => { k++; V.fade = -0; if (k < 20) requestAnimationFrame(f); else r(); }; f(); }); }

// ---------- itens ----------
const ITEM2 = {
  frasco: { nm: 'Frasco de Âmbar', preco: 25, d: 'Âmbar de farmácia, diluído, com selo da Coroa (o único permitido aqui em cima). Cura 45% da vida de um aliado.' },
  tinta: { nm: 'Tinta Azul', preco: 20, d: 'Devolve 15 PM.' },
  pluma: { nm: 'Pena de Fênix?', preco: 60, d: 'Levanta um aliado caído. É uma pena de galinha dourada.' }
};
async function usarItemFora() {
  const ks = Object.keys(ITEM2).filter(k => (G.items[k] || 0) > 0);
  if (!ks.length) { await say('* A mochila só tem migalha de pastel.'); return; }
  const i = await list({ x: 60, y: 40, w: 150, title: 'Itens', items: ks.map(k => ({ label: ITEM2[k].nm, right: 'x' + G.items[k] })), desc: j => ITEM2[ks[j]] && ITEM2[ks[j]].d, descY: 150 });
  if (i < 0) return;
  const k = ks[i], g = grupoAtual();
  const j = await list({ x: 60, y: 60, w: 150, title: 'Em quem?', items: g.map(m => ({ label: m.name, right: m.hp + '/' + m.mhp })) });
  if (j < 0) return;
  const m = g[j]; G.pt = G.pt || {}; const s = G.pt[m.id] || { hp: m.hp, mp: m.mp };
  if (k === 'frasco') s.hp = Math.min(m.mhp, s.hp + Math.round(m.mhp * 0.45));
  if (k === 'tinta') s.mp = Math.min(m.mmp, s.mp + 15);
  if (k === 'pluma') s.hp = Math.max(s.hp, Math.round(m.mhp * 0.3));
  G.pt[m.id] = s; G.items[k]--; sfx('heal');
  await say(`* ${m.name}: ${s.hp}/${m.mhp} de vida, ${s.mp} PM.`);
}

// ---------- equipar ----------
async function menuEquipar() {
  const quem = ['lume', 'rita'].filter(k => partyKeys().includes(k));
  while (true) {
    const i = await list({ x: 40, y: 30, w: 170, title: 'Equipar (só formas humanas)', items: quem.map(k => ({ label: k === 'lume' ? 'Lume' : 'Rita', right: Object.values(eqOf(k)).filter(Boolean).length + '/3' })), desc: () => 'O baú (forma de baú) não usa equipamento: na forma de monstro, a força dele é outra.', descY: 150 });
    if (i < 0) return;
    const id = quem[i];
    while (true) {
      const sl = Object.keys(SLOTS2), cur = eqOf(id);
      const j = await list({ x: 40, y: 30, w: 170, title: (id === 'lume' ? 'Lume' : 'Rita') + ': equipamento', items: sl.map(s => ({ label: SLOTS2[s], right: cur[s] ? EQ2[cur[s]].nm : '-' })), desc: q => cur[sl[q]] ? EQ2[cur[sl[q]]].d : 'Vazio.', descY: 150 });
      if (j < 0) break;
      const slot = sl[j];
      const opts = Object.keys(G.equipInv || {}).filter(k => G.equipInv[k] > 0 && EQ2[k].slot === slot && EQ2[k].who.includes(id) && !emUsoPorOutro(k, id));
      const items = [{ label: '(tirar)', k: null }, ...opts.map(k => ({ label: EQ2[k].nm + (EQ2[k].maldito ? ' ☠' : ''), k }))];
      const q = await list({ x: 30, y: 30, w: 190, title: SLOTS2[slot], items, desc: n => items[n] && items[n].k ? EQ2[items[n].k].d : 'Deixar o espaço vazio.', descY: 140 });
      if (q < 0) continue;
      G.eq = G.eq || {}; G.eq[id] = G.eq[id] || {}; G.eq[id][slot] = items[q].k; sfx('equip');
      if (items[q].k && EQ2[items[q].k].maldito) await say('* O anel aperta o dedo. Não sai. Quer dizer, sai, mas reclama.');
    }
  }
}
function emUsoPorOutro(k, id) { const tot = (G.equipInv || {})[k] || 0; let usado = 0; for (const [w, e] of Object.entries(G.eq || {})) if (w !== id) for (const v of Object.values(e)) if (v === k) usado++; return usado >= tot; }
function ganharEquip(k) { G.equipInv = G.equipInv || {}; G.equipInv[k] = (G.equipInv[k] || 0) + 1; }

// ---------- loja ----------
async function loja(estoque, dono = 'n') {
  while (true) {
    const items = estoque.map(k => { const isEq = !!EQ2[k], d = isEq ? EQ2[k] : ITEM2[k], tem = isEq ? (G.equipInv || {})[k] || 0 : G.items[k] || 0; return { k, label: d.nm, right: d.preco + 'c', disabled: (G.cobres || 0) < d.preco, d: d.d + (isEq ? ` (${EQ2[k].who.map(w => w === 'lume' ? 'Lume' : 'Rita').join('/')}; você tem ${tem})` : ` (você tem ${tem})`) }; });
    const i = await list({ x: 20, y: 24, w: 200, title: `Comprar   ${G.cobres || 0} cobres`, items, desc: n => items[n] && items[n].d, descY: 150 });
    if (i < 0) return;
    const it = items[i], d = EQ2[it.k] || ITEM2[it.k];
    if ((G.cobres || 0) < d.preco) { sfx('cancel'); continue; }
    G.cobres -= d.preco; sfx('item');
    if (EQ2[it.k]) ganharEquip(it.k); else G.items[it.k] = (G.items[it.k] || 0) + 1;
    await say(`* Comprou ${d.nm}.${EQ2[it.k] ? ' (Equipe pelo MENU.)' : ''}`);
  }
}

// ---------- menu do grupo (botão MENU no mapa) ----------
async function menuGrupo() {
  sfx('select');
  while (true) {
    const g = grupoAtual();
    const viaja = G.flags.marcoViagem && Object.keys(G.marcos || {}).length > 1;
    const temGrim = typeof grim === 'function' && grim().ativo;
    const ops = [['grupo', 'Grupo', 'Vida, nível, técnicas e atributos de cada um.'], ['equip', 'Equipar', 'Troque o que cada um leva.'], ['itens', 'Itens', 'Use frascos e outras coisas fora da luta.'],
      ...(typeof telaDiario === 'function' ? [['diario', 'Missões', 'Diário de missões: detalhes e andamento de cada uma.', '#ffd060']] : []),
      ...(typeof telaMapa === 'function' ? [['mapa', 'Mapa', 'Onde você está, para onde ir e o que só dá para fazer em certa hora.', '#ffd060']] : []),
      ...(typeof MENU_EXTRA !== 'undefined' ? MENU_EXTRA.filter(o => o.vis()).map(o => [o.k, o.nm(), o.desc(), o.col, o.right ? o.right() : undefined]) : []), ...(temGrim ? [['grim', 'Grimório', 'Escreva e reescreva as páginas de feitiço.']] : []), ...(viaja ? [['viajar', 'Viajar (Marco)', 'Vá até um Marco que você já tocou.']] : []),
      ['tempo', 'Tempo na luta', G.flags.tempoAtivo ? 'ATIVO: os inimigos não esperam você escolher. Mais tenso.' : 'PAUSA: o tempo para enquanto você escolhe. Mais calmo.', null, G.flags.tempoAtivo ? 'Ativo' : 'Pausa'], ['fechar', 'Fechar', 'Voltar ao jogo.']];
    const ix = await list({ x: 48, y: 22, w: 144, maxVis: 10, title: `${G.cobres || 0} cobres`, idx: menuGrupo._idx || 0, items: ops.map(o => ({ label: o[1], col: o[3] || undefined, right: o[4] })), desc: j => ops[j][2], descY: 22 + 16 + ops.length * 12 + 10 });
    if (ix < 0) return;
    menuGrupo._idx = ix; const k = ops[ix][0];
    if (k === 'fechar') { menuGrupo._idx = 0; return; }
    if (k === 'grim') { await abrirGrimorio(); continue; }
    { const X = typeof MENU_EXTRA !== 'undefined' && MENU_EXTRA.find(o => o.k === k); if (X) { if ((await X.run()) === 'sair') return; continue; } }
    if (k === 'diario') { await telaDiario(); continue; }
    if (k === 'mapa') { if (!G.flags.mapaVisto && typeof primeiroMapa === 'function') await primeiroMapa(); await telaMapa(); continue; }
    if (k === 'viajar') { const ks = Object.keys(G.marcos), j = await list({ x: 30, y: 40, w: 180, title: 'Marco de Viagem', items: ks.map(k => ({ label: G.marcos[k].nm })) }); if (j >= 0) { const M = G.marcos[ks[j]]; sfx('rune'); await fadeOut(12); loadMap2(ks[j], M.x, M.y, 'down'); await fadeIn(12); return; } continue; }
    if (k === 'grupo' && typeof telaStatus === 'function') { await telaStatus(); continue; }
    if (k === 'grupo') await panel(g.flatMap(m => [`{y}${m.name}{/}  ${m.hp}/${m.mhp} PV  ${m.mmp ? m.mp + '/' + m.mmp + ' PM' : ''}`, `  ATQ ${m.atk} DEF ${m.def} MAG ${m.mag} VEL ${m.spd}`, ...(Object.values(eqOf(m.id)).filter(Boolean).length ? ['  ' + Object.values(eqOf(m.id)).filter(Boolean).map(k => EQ2[k].nm).join(', ')] : []), '']), { title: 'Grupo' });
    if (k === 'equip') await menuEquipar();
    if (k === 'itens') await usarItemFora();
    if (k === 'tempo') { G.flags.tempoAtivo = !G.flags.tempoAtivo; sfx('equip'); }
  }
}
