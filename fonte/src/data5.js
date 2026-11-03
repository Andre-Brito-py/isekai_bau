// ================= CAPÍTULO 5: O MOTORISTA =================
// Também traz a 2ª e a 3ª técnica de cada forma de 4º grau (nível 3 e nível 6 do grau).

// ---------- técnicas do 4º grau ----------
Object.assign(TECH, {
  baluarte: { name: 'Baluarte', cd: 4, desc: 'Por 2 rodadas: dano recebido -40% e toda defesa perfeita contra-ataca com 80% do ATQ.', async use() { BT.bulwark = 2; sfx('guard'); await bSay('* Você finca a base no chão. Nada passa sem pagar pedágio.', { auto: 40 }); } },
  pisao: { name: 'Pisão de Bastião', cd: 4, desc: 'Atinge todos os inimigos e pode atordoar (35%; chefes 10%).',
    async use() { sfx('rumble'); shake(16); const log = []; for (const e of BT.en.filter(e => e.alive)) { const d = Math.max(1, Math.round((ATKB() * 0.9 - e.def) * rand(0.9, 1.1))); hitEnemy(e, d, 'hit', '#f0c040'); let s = ''; if (e.hp > 0 && Math.random() < (e.d.boss ? 0.1 : 0.35)) { e.stunned = 1; s = ' Atordoado!'; } log.push(`* ${e.name}: ${d}.${s}`); } await bSay(log.join('\n'), { auto: 55 }); } },
  fome: { name: 'Fome do Abismo', cd: 3, target: true, desc: 'Mordida 20% mais forte; contra quem tem menos da metade da vida, 80% mais forte.', async use(t) { await doBite(t, { m: t.hp < t.mhp * 0.5 ? 1.8 : 1.2 }); } },
  vazio: { name: 'Boca do Vazio', cd: 5, desc: 'Suga 15% da vida atual de cada inimigo (chefes 6%) e cura metade do total.',
    async use() { let tot = 0; const log = []; for (const e of BT.en.filter(e => e.alive)) { const d = Math.max(1, Math.round(e.hp * (e.d.boss ? 0.06 : 0.15))); hitEnemy(e, d, 'hit', '#7a48b0'); tot += d; log.push(`* ${e.name}: ${d}.`); } const h = Math.round(tot * 0.5); G.hp = Math.min(G.st.mhp, G.hp + h); sfx('bite'); log.push(`* Você engoliu ${h} PV.`); await bSay(log.join('\n'), { auto: 55 }); } },
  enxame: { name: 'Enxame de Ferrões', cd: 3, desc: 'Três ferroadas em inimigos aleatórios. Cada uma renova o veneno do alvo.',
    async use() { const log = {}; for (let i = 0; i < 3; i++) { const al = BT.en.filter(e => e.alive && e.hp > 0); if (!al.length) break; const t = pickOne(al); const d = Math.max(1, Math.round((ATKB() * 0.6 - t.def * 0.5) * rand(0.9, 1.1))); hitEnemy(t, d, 'hit', '#9be58a'); if (t.hp > 0) t.dot = { d: Math.max(1, Math.round(G.st.atk * 0.35)), t: 3 }; log[t.name] = (log[t.name] || 0) + d; await wait(8); } await bSay(Object.entries(log).map(([n, d]) => `* ${n}: ${d} e envenenado.`).join('\n'), { auto: 55 }); } },
  necrose: { name: 'Necrose', cd: 4, target: true, desc: 'Todo o veneno ou sangramento do alvo age de uma vez, com 50% a mais. Sem veneno, vira uma mordida.',
    async use(t) { if (!t.dot || t.dot.t <= 0) { await doBite(t, { m: 1.1 }); return; } const d = Math.round(t.dot.d * t.dot.t * 1.5); t.dot = null; hitEnemy(t, d, 'crit', '#9be58a'); sfx('crit'); await bSay(`* O veneno estoura por dentro do ${t.name}: ${d} de dano!`, { auto: 50 }); } },
  frenesi: { name: 'Frenesi', cd: 4, desc: 'Ataque ×1.6 por 3 turnos, mas você sofre 20% a mais de dano.', async use() { BT.buff.atkM = Math.max(BT.buff.atkM, 1.6); BT.buff.atkT = Math.max(BT.buff.atkT, 4); BT.frenzy = 3; sfx('buff'); await bSay('* Você para de pensar. Só sobra a fome.', { auto: 40 }); } },
  banquete: { name: 'Banquete', cd: 5, target: true, desc: 'Três mordidas seguidas no mesmo alvo (70% cada). Cada uma rouba 30% do dano como vida.',
    async use(t) { for (let i = 0; i < 3 && t.alive && t.hp > 0; i++) await doBite(t, { m: 0.7, onHit: (e, d) => { const h = Math.round(d * 0.3); G.hp = Math.min(G.st.mhp, G.hp + h); return `\n* +${h} PV.`; } }); } },
  indice: { name: 'Índice Remissivo', pm: 4, desc: 'Os próximos 2 feitiços não gastam PM.', async use() { BT.freeSpell = 2; sfx('rune'); await bSay('* Você abre no índice. Tudo fica mais fácil de achar.', { auto: 40 }); } },
  enciclopedia: { name: 'Enciclopédia', pm: 14, desc: 'Lança, um atrás do outro e de graça, até 4 dos seus feitiços de ataque com 45% do poder.',
    async use() { const sps = G.spells.filter(s => s.form !== 'veu').slice(0, 4); if (!sps.length) { await bSay('* Você não tem feitiços de ataque para folhear.', { auto: 40 }); return; } for (const sp of sps) { if (!BT.en.some(e => e.alive && e.hp > 0)) break; BT.nextSpellM = 0.45; await castSpell(sp, null); await killDead(); } } },
  sangue: { name: 'Runa de Sangue', cd: 3, desc: 'O próximo feitiço sai com o dobro do poder, mas custa 12% dos seus PV.',
    async use() { const c = Math.max(1, Math.round(G.st.mhp * 0.12)); if (G.hp <= c) { await bSay('* Você não tem vida suficiente para isso.', { auto: 40 }); return; } G.hp -= c; BT.bloodM = 2; sfx('hurt'); await bSay(`* Você escreve a próxima runa com a própria tinta. -${c} PV.`, { auto: 45 }); } },
  tomo: { name: 'Tomo Selado', pm: 16, desc: 'Dano mágico enorme em todos os inimigos. Custa 10% dos PV e silencia você por 1 turno.',
    async use() { const c = Math.max(1, Math.round(G.st.mhp * 0.1)); G.hp = Math.max(1, G.hp - c); const log = []; for (const e of BT.en.filter(e => e.alive)) { const d = Math.round((20 + G.st.mag * 2.4) * rand(0.9, 1.1)); hitEnemy(e, d, 'crit', '#c83838'); log.push(`* ${e.name}: ${d}.`); } BT.ps = BT.ps || {}; BT.ps.silence = 1; sfx('crit'); shake(16); log.push(`* O tomo se fecha sozinho. -${c} PV, e você ficou sem voz por 1 turno.`); await bSay(log.join('\n'), { auto: 60 }); } },
  umbra: { name: 'Umbra', pm: 8, desc: 'Todos os inimigos ficam envoltos em sombra: o próximo golpe de cada um sai pela metade.', async use() { for (const e of BT.en) if (e.alive) e.blinded = 1; sfx('buff'); await bSay('* As sombras se esticam e seguram o braço de cada inimigo.', { auto: 45 }); } },
  eclipseTotal: { name: 'Eclipse Total', pm: 14, desc: 'Dano de sombra em todos os inimigos. Os comuns perdem o próximo turno.',
    async use() { const log = []; for (const e of BT.en.filter(e => e.alive)) { const d = Math.round((12 + G.st.mag * 1.6) * (e.weak.sombra ?? 1) * rand(0.9, 1.1)); hitEnemy(e, d, 'hit', '#b48cf0'); if (!e.d.boss && e.hp > 0) e.confused = 1; log.push(`* ${e.name}: ${d}.`); } BT.dark = Math.max(BT.dark, 2); sfx('crit'); await bSay(log.join('\n'), { auto: 55 }); } },
  cometa: { name: 'Cometa', pm: 9, target: true, desc: 'Um cometa num alvo só: muito dano e 30% de chance de atordoar (chefes 10%).',
    async use(t) { const d = Math.round((15 + G.st.mag * 2.2) * rand(0.9, 1.1)); burst(t.x, t.y - 20, '#ffe066', 24); hitEnemy(t, d, 'crit', '#ffe066'); let s = ''; if (t.hp > 0 && Math.random() < (t.d.boss ? 0.1 : 0.3)) { t.stunned = 1; s = ` O ${t.name} ficou atordoado!`; } await bSay(`* O cometa acerta o ${t.name}: ${d} de dano.${s}`, { auto: 50 }); } },
  mapa: { name: 'Mapa Celeste', pm: 12, desc: 'Uma estrela aliada luta por 4 rodadas, e a cada rodada você recupera 6% dos PV.', async use() { BT.star = Math.max(BT.star, 4); BT.starHeal = 4; sfx('rune'); await bSay('* Você desenha as constelações no teto. Elas resolvem ficar.', { auto: 40 }); } }
});
Object.assign(LINE_TECH, {
  bastiao: ['muralha', 'baluarte', 'pisao'], abismo: ['engolir', 'fome', 'vazio'], ferrao: ['veneno', 'enxame', 'necrose'], carniceiro: ['devorar', 'frenesi', 'banquete'],
  biblioteca: ['copiar', 'indice', 'enciclopedia'], proibido: ['pacto', 'sangue', 'tomo'], eclipse: ['escuridao', 'umbra', 'eclipseTotal'], constelacao: ['estrela', 'cometa', 'mapa']
});
// técnicas da linha: a 1ª ao chegar na forma, a 2ª no nível 3 e a 3ª no nível 6 do grau
grantTechs = async function (inBattle) {
  if (!G.flags.ch3open) return;
  G.tech = G.tech || [];
  const want = ['mobilia'], L = LINE_TECH[G.species] || [];
  if (L[0]) want.push(L[0]);
  if (L[1] && G.lv >= 3) want.push(L[1]);
  if (L[2] && G.lv >= 6) want.push(L[2]);
  const fresh = want.filter(k => !G.tech.includes(k));
  for (const k of fresh) {
    G.tech.push(k); sfx('rune');
    const t = `[Técnica aprendida: {y}${TECH[k].name}{/}. ${TECH[k].desc}]`;
    if (inBattle) await bSay(t, { cat: true }); else await say(t, 'cat');
  }
};
// saves antigos: confere as técnicas da linha na próxima vitória
{ const _as = applySave; applySave = function (d) { _as(d); G.flags._pendingTech = true; }; }

// ---------- runas ----------
Object.assign(RUNES, {
  polvora: { name: 'Pólvora', type: 'el', col: '#e0a060', pow: 10, desc: 'Explosivo. Acerta, e no fim da rodada explode de novo em todos os inimigos.' },
  mina: { name: 'Mina', type: 'form', col: '#f2ecdc', mult: 0.6, cost: 5, desc: 'Um alvo, golpe leve. Planta uma mina que explode quando ele agir.' },
  bandeira: { name: 'Bandeira', type: 'mod', col: '#ff6b6b', cost: 3, desc: 'Depois do feitiço, seu ataque e sua magia sobem 20% por 2 turnos.' }
});
Object.assign(RUNE_RAR, { polvora: 'incomum', mina: 'rara', bandeira: 'rara' });
Object.assign(MAP_D, { terminal: 13, trincheira: 13, manobras: 14, oficina: 14, garagem: 15 });
EL_COL.polvora = '#e0a060';

// ---------- itens ----------
Object.assign(ITEMS, {
  quentinha: { name: 'Quentinha', hp: 120, desc: 'Cura 120 PV. Arroz, feijão, ovo e saudade. Ainda está morna.' },
  cafe: { name: 'Café de Garrafa Térmica', mp: 40, desc: 'Recupera 40 PM. Doce demais, do jeito que motorista gosta.' },
  vale: { name: 'Vale-Transporte', desc: 'Fora de batalha: leva você de volta à última Lanterna em que salvou.',
    async world() {
      const sv = readSave(); if (!sv || !MAPS[sv.map]) { await say('* Você ainda não salvou em nenhuma Lanterna.'); return false; }
      const c = await choose(`* Usar o vale e voltar para a Lanterna? (${MAPS[sv.map].name})`, ['Usar', 'Guardar'], 'n', 1); if (c !== 0) return false;
      G.items.vale--; sfx('flee'); await fadeOut(12); loadMap(sv.map, sv.x, sv.y, 'down'); await fadeIn(12); await say('* Catraca girada. Você está de volta.'); return true;
    } }
});

// ---------- sprites ----------
const S5 = {
  cao: f => cv4(16, 16, r => { r(2, 6, 11, 6, 'k'); r(3, 7, 9, 4, 'n'); r(11, 3, 5, 6, 'k'); r(12, 4, 3, 4, 'n'); r(14, 5, 1, 1, 'y'); r(15, 7, 1, 1, 'k'); r(12, 3, 1, 1, 'b'); r(0, 5 - f, 3, 2, 'k'); for (const i of [3, 5, 9, 11]) r(i, 12, 1, 3 - ((i + f) % 2), 'k'); r(5, 7, 4, 1, 'r'); }),
  fiscal: f => cv4(32, 32, r => {
    r(6, 10, 20, 20, 'k'); r(7, 11, 18, 18, '#5a6070'); r(7, 11, 18, 2, '#7a8090');
    for (let i = 0; i < 4; i++) { r(12 + i * 2, 17 - f, 1, 8, '#c0c8d0'); }
    r(4, 4, 24, 6, 'k'); r(5, 5, 22, 4, 'B'); r(3, 9, 26, 2, 'k'); r(13, 5, 6, 3, 'y');
    r(10, 13, 3, 2, '#ff5050'); r(19, 13, 3, 2, '#ff5050');
    r(26, 14 - f, 5, 3, 'k'); r(27, 15 - f, 3, 1, '#e8dcc0'); r(1, 18, 5, 2, 'k'); r(2, 18, 3, 1, 'y');
  }),
  musgo: f => cv4(16, 16, r => { r(2, 3, 12, 12, 'k'); r(3, 4, 10, 10, 'm'); r(3, 4, 10, 3, 'g'); r(5, 7, 2, 2, f ? 'v' : 'y'); r(9, 7, 2, 2, f ? 'v' : 'y'); r(4, 11, 8, 1, 'k'); r(1, 6, 2, 5, 'k'); r(13, 6, 2, 5, 'k'); r(6, 2, 4, 2, 'G'); }),
  tubo: f => cv4(16, 16, r => { r(4, 0, 8, 16, 'k'); r(5, 0, 6, 16, '#c8962a'); r(6, 0, 2, 16, '#f0c040'); r(5, 6, 6, 4, 'k'); r(6, 7, 4, 2, f ? '#bfe8f0' : '#7ad0f0'); }),
  diario: f => cv4(16, 16, r => { r(3, 3 + f, 10, 11, 'k'); r(4, 4 + f, 8, 9, '#3a70c0'); r(4, 4 + f, 1, 9, 'B'); r(6, 6 + f, 5, 1, '#e8dcc0'); r(6, 8 + f, 4, 1, '#e8dcc0'); r(8, 12 + f, 2, 3, 'y'); })
};
function buildSprites5() {
  const armed = (map, tool) => { const c = spr(HUMAN, map); const x = c.getContext('2d'); tool(x); return c; };
  const spear = x => { x.fillStyle = PAL.n; x.fillRect(14, 1, 1, 13); x.fillStyle = PAL.l; x.fillRect(13, 0, 3, 2); };
  const shield = x => { x.fillStyle = PAL.k; x.fillRect(9, 6, 7, 9); x.fillStyle = '#6a7084'; x.fillRect(10, 7, 5, 7); x.fillStyle = PAL.y; x.fillRect(12, 8, 1, 5); x.fillRect(10, 10, 5, 1); };
  const gun = x => { x.fillStyle = PAL.k; x.fillRect(9, 8, 7, 2); x.fillStyle = PAL.n; x.fillRect(9, 9, 3, 2); x.fillStyle = '#e0a060'; x.fillRect(15, 7, 1, 1); };
  const flask = x => { x.fillStyle = PAL.k; x.fillRect(11, 7, 4, 5); x.fillStyle = PAL.v; x.fillRect(12, 8, 2, 3); x.fillStyle = PAL.w; x.fillRect(12, 6, 2, 1); };
  const lamp = x => { x.fillStyle = PAL.k; x.fillRect(12, 8, 4, 5); x.fillStyle = '#ffe9a0'; x.fillRect(13, 9, 2, 3); x.fillStyle = PAL.k; x.fillRect(4, 0, 8, 2); x.fillStyle = PAL.u; x.fillRect(5, 0, 6, 1); };
  SP.recruta = [armed({ G: 'u', m: 'l', l: 'w' }, spear), armed({ G: 'u', m: 'l', l: 'w' }, spear)];
  SP.escudeiro = [armed({ G: 'u', m: 'm', l: 'l' }, shield), armed({ G: 'u', m: 'm', l: 'l' }, shield)];
  SP.arcabuz = [armed({ G: 'n', m: 'd', l: 'm' }, gun), armed({ G: 'n', m: 'd', l: 'm' }, gun)];
  SP.alquimista = [armed({ G: 'G', m: 'g', l: 'v' }, flask), armed({ G: 'G', m: 'g', l: 'v' }, flask)];
  SP.veterano = [armed({ G: 'r', m: 'd', l: 'm', y: 'w' }, spear), armed({ G: 'r', m: 'd', l: 'm', y: 'w' }, spear)];
  SP.fiscalP = [armed({ G: 'B', m: 'k', l: 'm' }, lamp), armed({ G: 'B', m: 'k', l: 'm' }, lamp)];
  SP.jorge = [0, 1].map(f => { const c = spr(HUMAN, { G: 'u', m: 'B', l: 'u', y: 'w', s: 's' }); const x = c.getContext('2d'); x.fillStyle = PAL.k; x.fillRect(3, 0, 10, 3); x.fillStyle = '#3a70c0'; x.fillRect(4, 0, 8, 2); x.fillStyle = PAL.k; x.fillRect(3, 2, 11, 1); x.fillStyle = '#5a4a3a'; x.fillRect(6, 6, 4, 1); x.fillStyle = PAL.y; x.fillRect(12, 11 + f, 2, 2); x.fillRect(11, 12 + f, 1, 1); return c; });
  SP.maren5 = [spr(MAREN.map((r, i) => i < 4 ? '................' : r)), spr(MAREN.map((r, i) => i < 4 ? '................' : i === 4 ? '...kkkk.kkkkk...' : r))];
  SP.cao = [S5.cao(0), S5.cao(1)];
  SP.fiscal = [S5.fiscal(0), S5.fiscal(1)];
  SP.musgo = [S5.musgo(0), S5.musgo(1)];
  SP.tubo = [S5.tubo(0), S5.tubo(1)];
  SP.diario = [S5.diario(0), S5.diario(1)];
}
function buildTiles5(T) {
  const base = T.floor || '#3a3632', speck = T.speck || '#44403a', dark = T.dark || '#2e2a26';
  TILE.Q = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(0, 5, 16, 7); x.fillStyle = '#8a5a34'; x.fillRect(0, 6, 16, 2); x.fillRect(0, 9, 16, 2); x.fillStyle = '#5a3a24'; x.fillRect(2, 12, 2, 3); x.fillRect(12, 12, 2, 3); }, 501);
  TILE.X = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); for (const [a, b] of [[0, 8], [8, 8], [4, 2]]) { x.fillStyle = PAL.k; x.fillRect(a, b, 9, 7); x.fillStyle = '#a89068'; x.fillRect(a + 1, b + 1, 7, 5); x.fillStyle = '#887050'; x.fillRect(a + 1, b + 4, 7, 1); } }, 502);
  TILE.V = tileCanvas((x, R) => { x.fillStyle = PAL.k; x.fillRect(0, 0, 16, 16); x.fillStyle = '#e8d8a0'; x.fillRect(0, 1, 16, 14); x.fillStyle = '#3a70c0'; x.fillRect(0, 10, 16, 3); x.fillStyle = '#1c3058'; x.fillRect(1, 3, 6, 5); x.fillRect(9, 3, 6, 5); x.fillStyle = '#7ad0f0'; x.fillRect(2, 4, 2, 1); x.fillRect(10, 4, 2, 1); }, 503);
  TILE.W = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(0, 4, 16, 9); x.fillStyle = '#5a5a66'; x.fillRect(1, 5, 14, 3); x.fillStyle = '#7a4a2a'; x.fillRect(1, 8, 14, 4); x.fillStyle = '#c0c8d0'; x.fillRect(3, 3, 5, 2); x.fillStyle = '#e0a060'; x.fillRect(11, 6, 2, 1); }, 504);
  TILE['='] = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = '#4a3a2a'; for (let i = 1; i < 16; i += 4) x.fillRect(i, 2, 2, 12); x.fillStyle = '#9aa0aa'; x.fillRect(0, 4, 16, 1); x.fillRect(0, 11, 16, 1); x.fillStyle = '#5a6070'; x.fillRect(0, 5, 16, 1); x.fillRect(0, 12, 16, 1); }, 505);
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites5(); }; }
{ const _bt = buildTiles; buildTiles = function (theme) { _bt(theme); buildTiles5(theme || {}); }; }
{ const _st = solidTile; solidTile = function (c) { if ('QXVW'.includes(c)) return true; return _st(c); }; }
Object.assign(LOOK, {
  Q: ['* Um banco de rodoviária. Alguém riscou "Saudades, Mãe" na madeira.', '* Um banco de madeira, gasto de tanto esperar.'],
  X: ['* Sacos de areia empilhados. Um deles tem um desenho de criança: um baú sorrindo.', '* Sacos de areia. Cheiram a pólvora e a chuva.'],
  V: ['* A lataria de um ônibus. Amarelo e azul, igual aos da cidade de onde vocês vieram.', '* Um ônibus vazio. O letreiro diz: "RECOLHIDO".'],
  W: ['* Uma bancada de ferreiro. Tem escamas, chifres e cascos espalhados. Você prefere não olhar de perto.', '* Moldes de espadas. Alguns têm a forma de uma tampa de baú.']
});
Object.assign(SEAL_TXT, { rubble: '* Um monte de entulho e ferro retorcido bloqueia a passagem. Precisa de algo que EXPLODA.' });
Object.assign(SEAL_OK, { rubble: '* BUM! A pólvora espalha o entulho para todo lado. Tem uma sala escondida atrás.' });
{ const _ds = drawSeal; drawSeal = function (e, sx, sy, lights) {
  if (e.look === 'rubble' && !G.flags[e.flag]) { bx.fillStyle = '#3a3632'; bx.fillRect(sx, sy, 16, 16); for (const [a, b, w, h, c] of [[1, 8, 7, 7, '#6a6058'], [7, 5, 8, 10, '#5a5048'], [3, 2, 6, 6, '#7a7068'], [10, 1, 4, 4, '#8a5a34']]) { bx.fillStyle = PAL.k; bx.fillRect(sx + a - 1, sy + b - 1, w + 2, h + 2); bx.fillStyle = c; bx.fillRect(sx + a, sy + b, w, h); } }
  return _ds(e, sx, sy, lights); }; }

// ---------- bombardeio e bondes (perigos no mapa, no ritmo) ----------
function worldHurt(type) {
  const d = Math.max(1, Math.round(G.st.mhp * (type === 'tram' ? 0.15 : 0.12)));
  G.hp = Math.max(1, G.hp - d); shake(12); sfx('hurt'); WD.hurtFx = 16; WD.hurtNum = { s: '-' + d, t: 40 };
  if (!G.flags['tut_' + type]) { G.flags['tut_' + type] = true; runScript(async () => { sfx('catalog'); await say(type === 'tram' ? '[BONDES: os trilhos tocam o sino e piscam antes de o bonde passar. Espere do lado de fora e atravesse logo depois.]' : '[BOMBARDEIO: um alvo vermelho marca onde a próxima bomba cai. Saia de cima antes que ele feche.]', 'cat'); await say('[Esses golpes não matam, mas a vida perdida não volta sozinha.]', 'cat'); }); }
}
{ const _uw = updateWorld; updateWorld = function () {
  _uw();
  if (V.scene !== 'world' || !WD.map || !WD.map.booms || worldBlocked()) return;
  WD.bt = (WD.bt || 0) + 1;
  for (const b of WD.map.booms) {
    const ph = (WD.bt + b.off) % b.T;
    if (ph === b.T - 1) { b.fx = 16; sfx(b.type === 'tram' ? 'rumble' : 'crit'); if (b.type !== 'tram') shake(3); if (b.tiles.some(([x, y]) => x === WD.x && y === WD.y)) worldHurt(b.type); }
    if (b.fx > 0) b.fx--;
  }
  if (WD.hurtFx > 0) WD.hurtFx--;
  if (WD.hurtNum && WD.hurtNum.t > 0) WD.hurtNum.t--;
}; }
{ const _dw = drawWorld; drawWorld = function () {
  _dw();
  if (!WD.map || !WD.map.booms) return;
  const ox = Math.floor(WD.cx), oy = Math.floor(WD.cy), bt = WD.bt || 0;
  for (const b of WD.map.booms) {
    const ph = (bt + b.off) % b.T, warn = b.type === 'tram' ? 70 : 60, left = b.T - 1 - ph;
    if (left < warn && !(b.fx > 0)) {
      if (b.type === 'tram') {
        if (Math.floor(left / 6) % 2 === 0) for (const [x, y] of b.tiles) { const sx = x * TS - ox, sy = y * TS - oy; if (sx < -16 || sx > W) continue; bx.fillStyle = 'rgba(255,224,102,0.5)'; bx.fillRect(sx, sy + 4, 16, 1); bx.fillRect(sx, sy + 11, 16, 1); }
        const [x0, y0] = b.tiles[0]; if (left % 30 < 15) txt('DING', 4, y0 * TS - oy + 2, { col: '#ffe066', shadow: true });
      } else for (const [x, y] of b.tiles) {
        const sx = x * TS - ox + 8, sy = y * TS - oy + 8, r = 2 + Math.round(9 * left / warn), col = left < 15 ? '#ff3030' : '#ff6b6b';
        bx.fillStyle = col; bx.fillRect(sx - r, sy - r, r * 2, 1); bx.fillRect(sx - r, sy + r, r * 2 + 1, 1); bx.fillRect(sx - r, sy - r, 1, r * 2); bx.fillRect(sx + r, sy - r, 1, r * 2);
        bx.fillRect(sx - 1, sy, 3, 1); bx.fillRect(sx, sy - 1, 1, 3);
      }
    }
    if (b.fx > 0) {
      if (b.type === 'tram') { const [, y0] = b.tiles[0], sy = y0 * TS - oy, p = (16 - b.fx) / 16, tx = Math.round(-60 + p * (W + 120)); bx.fillStyle = PAL.k; bx.fillRect(tx - 1, sy - 3, 58, 20); bx.fillStyle = '#c83838'; bx.fillRect(tx, sy - 2, 56, 18); bx.fillStyle = '#e8d8a0'; bx.fillRect(tx, sy + 10, 56, 2); bx.fillStyle = '#bfe8f0'; for (let i = 4; i < 52; i += 12) bx.fillRect(tx + i, sy + 1, 8, 6); }
      else for (const [x, y] of b.tiles) { const sx = x * TS - ox, sy = y * TS - oy, k = b.fx; bx.fillStyle = k > 10 ? '#fff4c0' : k > 5 ? '#ffb040' : '#8a5a34'; bx.fillRect(sx - (k > 8 ? 3 : 0), sy - (k > 8 ? 3 : 0), 16 + (k > 8 ? 6 : 0), 16 + (k > 8 ? 6 : 0)); }
    }
  }
  if (WD.hurtFx > 0) { bx.fillStyle = `rgba(255,40,40,${WD.hurtFx / 40})`; bx.fillRect(0, 0, W, H); }
  if (WD.hurtNum && WD.hurtNum.t > 0) txt(WD.hurtNum.s, WD.fx - ox + 8, WD.fy - oy - 10 - (40 - WD.hurtNum.t) / 4, { align: 'center', col: '#ff6b6b', shadow: true });
}; }

// ---------- música ----------
Object.assign(TRACKS, {
  terminal: { bpm: 104, bars: 4, chords: 'Dmaj7 Bm7 Em7 A7', bass: 'walk', bassVol: 0.11,
    lead: 'F#5:3 A5:1 .:2 F#5:2 E5:4 D5:4 | B4:2 D5:2 F#5:4 E5:2 D5:2 B4:4 | G5:3 F#5:1 E5:2 D5:2 B4:4 E5:4 | C#5:4 E5:4 A5:6 .:2', leadWave: 'triangle', leadVol: 0.07, arp: { rate: 2, vol: 0.016, pat: [0, 2, 1, 3] }, drums: 'k..hk.h.k..hk.hh', hatVol: 0.02 },
  trincheira: { bpm: 112, bars: 4, chords: 'Em Em C B', bass: 'oct8', bassVol: 0.13,
    lead: 'E5:2 .:2 E5:2 G5:2 B5:4 A5:4 | G5:2 F#5:2 E5:4 B4:8 | C5:2 E5:2 G5:4 C6:4 B5:4 | B5:2 A5:2 F#5:4 D#5:8', leadWave: 0.25, leadVol: 0.06, arp: { rate: 1, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k.s.k.s.kks.k.ss', hatVol: 0.03 },
  manobras: { bpm: 140, bars: 4, chords: 'Am F C G', bass: 'oct8', bassVol: 0.14,
    lead: 'A5:2 C6:2 E6:2 C6:2 A5:4 E5:4 | F5:2 A5:2 C6:2 A5:2 F5:8 | E5:2 G5:2 C6:2 G5:2 E5:4 C5:4 | D5:2 G5:2 B5:2 D6:2 B5:8', leadWave: 0.125, leadVol: 0.05, arp: { rate: 1, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.hs', hatVol: 0.035 },
  boss5: { bpm: 158, bars: 8, chords: 'Gm Eb F D Gm Eb Cm D', bass: 'oct8', bassVol: 0.17,
    lead: 'G5:2 Bb5:2 D6:2 G6:2 F6:4 D6:4 | Eb6:2 D6:2 Bb5:2 G5:2 Bb5:4 Eb6:4 | F6:4 C6:2 A5:2 F5:4 A5:4 | F#5:2 A5:2 D6:4 C6:2 A5:2 F#5:4 | G5:2 D6:2 G5:2 D6:2 Bb5:4 G5:4 | Eb6:4 Bb5:4 G5:4 Eb5:4 | C5:2 Eb5:2 G5:2 C6:2 Eb6:4 D6:4 | D6:4 C6:4 A5:4 F#5:4',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 },
  jorge: { bpm: 66, bars: 4, chords: 'C Am F G', bass: 'whole', bassVol: 0.08,
    lead: 'E5:4 G5:4 C6:6 B5:2 | A5:8 E5:8 | F5:4 A5:4 C6:4 A5:4 | G5:12 .:4', leadWave: 'triangle', leadVol: 0.09, pad: true, padVol: 0.025 }
});

// ---------- inimigos ----------
Object.assign(ENEMIES, {
  recruta: { name: 'Recruta de Auren', sp: 'recruta', hp: 300, atk: 74, def: 22, xp: 140, weak: { faisca: 1.3, sombra: 1.3 }, drops: [['quentinha', .15]],
    flavor: ['* O Recruta segura a lança como quem segura um guarda-chuva num vendaval.', '* Ele tem um bilhete de ônibus preso no capacete. Linha 31.', '* "Eu só quero voltar pra casa", ele diz para ninguém.'],
    check: 'Soldado novo. FAÍSCA e SOMBRA. Junto com um Escudeiro, fica protegido.',
    moves: [
      { k: 'ring', p: 1, w: 2, t: '* O Recruta estoca com a lança!' },
      { k: 'seq', n: 4, p: 0.5, w: 2, t: '* Quatro golpes, do jeito que ensinaram no treino!' },
      { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* "FORMAÇÃO!" O Recruta grita para o grupo.' }] },
  escudeiro: { name: 'Escudeiro', sp: 'escudeiro', hp: 420, atk: 66, def: 40, xp: 160, guardian: true, weak: { polvora: 1.6, faisca: 1.3, bite: 0.7 }, drops: [['vela', .25]],
    flavor: ['* O Escudeiro planta o escudo na frente dos outros. É o trabalho dele.', '* O escudo tem marcas de mordida antigas. Não são suas.'],
    check: 'FORMAÇÃO: enquanto ele estiver de pé, os aliados dele sofrem metade do dano. Derrube primeiro. PÓLVORA abre o escudo.',
    moves: [
      { k: 'ring', p: 1.1, w: 2, t: '* O Escudeiro avança com o escudo na frente!' },
      { k: 'mash', p: 0.9, need: 14, bind: true, w: 1, t: '* O Escudeiro te prensa contra a parede!' },
      { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 2, t: '* O Escudeiro cobre o aliado com o escudo.' }] },
  arcabuz: { name: 'Arcabuzeiro', sp: 'arcabuz', hp: 270, atk: 82, def: 16, xp: 150, weak: { vento: 1.4, geada: 1.3 }, drops: [['cafe', .15]],
    flavor: ['* O Arcabuzeiro limpa o cano da arma. O cheiro de pólvora sobe.', '* Ele mira devagar. Muito devagar.'],
    check: 'Atira de longe e PREPARA tiros fortes: desvie na hora certa. VENTO desvia as balas, GEADA trava o gatilho.',
    big: { k: 'dodge', p: 2.2, spd: 1.4 },
    moves: [
      { k: 'dodge', p: 1.2, spd: 1.35, w: 2, t: '* O Arcabuzeiro atira!' },
      { k: 'dodge', p: 0.5, hits: 3, spd: 1.2, w: 2, t: '* Rajada de chumbo! Três tiros!' },
      { k: 'buff', stat: 'atk', v: 1.3, turns: 3, w: 1, once: 'polv', t: '* O Arcabuzeiro carrega a arma com pólvora dobrada.' }] },
  alquimista: { name: 'Alquimista de Guerra', sp: 'alquimista', hp: 260, atk: 72, def: 14, xp: 150, weak: { brasa: 1.4, vento: 1.3 }, drops: [['biscoito', .2]],
    flavor: ['* A Alquimista de Guerra mistura dois frascos. O resultado borbulha de um jeito ofendido.', '* Ela usa óculos de proteção rachados.'],
    check: 'Bombas, gás e remédio para os aliados. BRASA estoura os frascos dela.',
    moves: [
      { k: 'dodge', p: 0.55, hits: 2, st: 'burn', w: 2, t: '* Frascos incendiários voando!' },
      { k: 'ring', p: 0.8, st: 'poison', w: 1, t: '* Uma nuvem de gás verde!' },
      { k: 'heal', frac: 0.25, name: 'Tônico de Campanha', w: 1, t: '* A Alquimista joga um tônico no aliado.' },
      { k: 'spell', p: 1.05, el: 'polvora', name: 'Granada Rúnica', w: 2, t: '* A Alquimista lança uma {o}Granada Rúnica{/}!' }] },
  cao: { name: 'Cão de Guerra', sp: 'cao', hp: 230, atk: 76, def: 18, evade: 0.2, xp: 130, weak: { brasa: 1.4, geada: 1.2 }, drops: [['pao', .25]],
    flavor: ['* O Cão de Guerra rosna. Ele usa uma coleira com o nome "Bolinha".', '* Ele cheira a sua tampa. Por um segundo, abana o rabo. Depois lembra que está trabalhando.'],
    check: 'Rápido e teimoso. Morde e não larga. BRASA espanta.',
    moves: [
      { k: 'mash', p: 0.95, need: 13, bind: true, w: 2, t: '* O Cão morde e não larga!' },
      { k: 'dodge', p: 1, spd: 1.35, w: 2, t: '* O Cão dá um bote!' },
      { k: 'seq', n: 3, p: 0.55, spd: 1.3, w: 1, t: '* Três mordidas rápidas!' }] },
  veterano: { name: 'Invocado Veterano', sp: 'veterano', hp: 480, atk: 86, def: 30, xp: 220, elite: true, weak: { sombra: 1.4, polvora: 1.3 }, drops: [['quentinha', .3]],
    flavor: ['* O Invocado Veterano tem uma cicatriz em forma de dente. Talvez de mímico.', '* Ele já fez isso muitas vezes. Dá para ver no jeito de segurar a lança.'],
    check: 'Herói invocado há anos. Golpes que atravessam a defesa. SOMBRA e PÓLVORA.',
    big: { k: 'seq', n: 7, p: 0.45, pierce: true, spd: 1.2 },
    moves: [
      { k: 'seq', n: 6, p: 0.45, pierce: true, spd: 1.2, w: 2, t: '* Combo de veterano! Seis golpes que ele já repetiu mil vezes!' },
      { k: 'ring', p: 1.4, pierce: true, fast: true, w: 2, t: '* Estocada de quem não erra!' },
      { k: 'spell', p: 1, el: 'vento', name: 'Ordem de Avanço', st: 'forget', w: 1, t: '* O Veterano grita uma {w}Ordem de Avanço{/}. Sua cabeça esvazia.' }] },
  fiscalP: { name: 'Fiscal de Plataforma', sp: 'fiscalP', hp: 280, atk: 74, def: 18, xp: 140, weak: { sombra: 1.4, vento: 1.2 }, drops: [['vale', .3]],
    flavor: ['* O Fiscal de Plataforma ergue o lampião. "Bilhete, por favor."'],
    check: 'A luz dele enxerga através do disfarce. SOMBRA apaga.',
    moves: [
      { k: 'seq', n: 5, p: 0.45, hide: true, w: 2, t: '* "Confere o número!" Ele mostra os bilhetes e esconde. Decore!' },
      { k: 'ring', p: 0.8, st: 'silence', w: 1, t: '* PRIIII! O apito dele te deixa sem voz.' },
      { k: 'ring', p: 1.15, w: 2, t: '* O Fiscal bate com o lampião!' }] },
  maren5: { name: 'Maren, Sem Chapéu', sp: 'maren5', hp: 2700, atk: 82, def: 22, xp: 1200, boss: true, ai: 'maren5', sc: 5, weak: { sombra: 1.2, bite: 1.2 },
    flavor: ['* Maren está sem o chapéu. O cabelo dela tem tinta seca.', '* "Você me tirou tudo, alma trinta e um. Só sobrou o trabalho."'], flavor2: ['* Maren escreve no próprio braço. As letras sangram.', '* Ela ri. Não parece engraçado para ela.'],
    check: 'Ela voltou mais desesperada. Mistura sequências de memória, esquecimento e pólvora. Engolir os feitiços dela devolve PM.' },
  fiscal: { name: 'O Fiscal da Linha', sp: 'fiscal', hp: 3400, atk: 88, def: 26, xp: 1500, boss: true, ai: 'fiscal', sc: 3, weak: {},
    flavor: ['* O Fiscal da Linha é uma catraca gigante com quepe. Ele range a cada volta.', '* "PASSAGEM. AGORA."'],
    check: 'A cada turno ele pede uma PASSAGEM (um elemento ou a mordida). Pague no seu turno e ele perde a vez. Não pague e leve MULTA.' },
  jorge: { name: 'Seu Jorge, o Motorista', sp: 'jorge', hp: 3600, atk: 86, def: 26, xp: 2000, boss: true, ai: 'jorge', sc: 5, weak: { sombra: 1.2, vento: 1.2 },
    flavor: ['* Seu Jorge segura o volante de um ônibus que não está ali.', '* "Segura firme, que a próxima é longa."', '* Ele tem as mãos de quem dirigiu a vida inteira.'], flavor2: ['* O quepe dele caiu. Ele nem percebeu.', '* "Eu só quero devolver vocês. Só isso."'],
    check: 'Anuncia a PRÓXIMA PARADA antes de cada golpe grande. No PONTO FINAL, use ÂNCORA ou o SINO DE BOLSO, ou defenda bem.' }
});
const STOPS = {
  feira: { t: '* "PRÓXIMA PARADA: FEIRA!" Ele respira fundo, como quem sente cheiro de pastel.' },
  escola: { t: '* "PRÓXIMA PARADA: ESCOLA!" Uma lista de chamada ecoa pela garagem.' },
  final: { t: '* "PRÓXIMA PARADA: PONTO FINAL." O motor ruge. Ele vai jogar o ônibus inteiro em você. (Âncora ou Sino de Bolso cancelam!)' }
};
const AI5 = {
  async maren5(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; e.atk += 5; shake(30); sfx('rumble'); await bSay('Eu perdi o chapéu, o livro, o cargo. Sabe o que eu ainda tenho? A sua ficha.', { col: '#e8d8ff' }); await bSay('* Maren abre uma ficha com o número 31 e começa a ler em voz alta.', { auto: 55 }); return; }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'seq', n: e.p2 ? 7 : 6, p: 0.5, hide: true, pierce: true, spd: 1.1, t: '* SELO DO ARQUIVO, VERSÃO FINAL! As letras do seu nome aparecem e somem!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* Maren molha a pena na própria tinta e começa a escrever o seu nome no ar. (Prepare-se. Âncora cancela.)', { auto: 60 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'spell', p: 1, el: 'polvora', name: 'Dardo de Pólvora Selado', st: 'silence', w: 2, t: '* Maren lança {o}Dardo de Pólvora Selado{/}. Ela aprendeu rápido.' },
      { k: 'spell', p: 0.85, el: 'sal', name: 'Onda de Sal', st: 'forget', w: 2, t: '* {w}Onda de Sal{/}! Ela leu sobre o Arquivo.' },
      { k: 'mash', p: 1.1, need: 16, bind: true, w: 1, t: '* Maren tenta te enfiar numa gaveta de fichário!' },
      { k: 'ring', p: 1.2, pierce: true, w: 1, t: '* Maren bate com a capa do livro. Ainda dói.' }]));
  },
  async fiscal(e) {
    const ELS = [...new Set(G.spells.filter(s => s.form !== 'veu').map(s => s.el))];
    if (e.ticket) {
      const k = e.ticket; e.ticket = null;
      const paid = (k === 'bite' && (BT.lastAct === 'bite' || BT.lastAct === 'tech')) || (BT.lastAct === 'spell' && BT.lastSpell && BT.lastSpell.el === k);
      if (paid) { sfx('catalog'); await bSay('* "...Passagem conferida." O Fiscal gira para o lado e deixa você passar. Ele perde a vez.', { auto: 55 }); e.shell = 0; return; }
      return runMove(e, { k: 'ring', p: 2.0, pierce: true, fast: true, t: '* "SEM PASSAGEM. MULTA!" A catraca gira e te acerta com tudo!', fx: 'shake' });
    }
    const opts = ['bite', ...ELS]; e.ticket = pickOne(opts);
    const nm = e.ticket === 'bite' ? 'MORDIDA (ou técnica)' : RUNES[e.ticket].name.toUpperCase();
    await bSay(`* "PASSAGEM: ${nm}." O Fiscal estende a mão de ferro. (Use isso no seu turno.)`, { auto: 70 });
    if (Math.random() < 0.5) return runMove(e, pickMove(e, [
      { k: 'seq', n: 5, p: 0.45, hide: true, w: 2, t: '* O Fiscal mostra cinco bilhetes e esconde. Decore!' },
      { k: 'dodge', p: 0.6, hits: 3, spd: 1.3, w: 2, t: '* Bilhetes picotados voam como navalhas!' },
      { k: 'mash', p: 1, need: 16, bind: true, w: 1, t: '* A catraca te prende pela cintura!' }]));
  },
  async jorge(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) {
      e.p2 = true; e.phase = 2; shake(20); sfx('rumble');
      await bSay('Seu Jorge, para! É o 31! É o menino do último banco!', { col: '#d8f0ff' });
      await bSay('* Tiago entra correndo na garagem, sem armadura, e para entre vocês dois.', { auto: 55 });
      const h = Math.round(G.st.mhp * 0.3); G.hp = Math.min(G.st.mhp, G.hp + h); sfx('heal');
      await bSay(`* Tiago joga um frasco de âmbar para você. +${h} PV.`, { auto: 50 });
      await bSay('Sai da frente, Tiago. Eu prometi levar todo mundo. TODO MUNDO.', { col: '#ffe9c0' });
      e.def = Math.round(e.def * 0.8); e.atk += 6;
      await bSay('[Tiago gritou o ponto fraco: o Seu Jorge não protege o lado esquerdo. A defesa dele caiu. O ataque subiu.]', { cat: true }); return;
    }
    if (e.stop) {
      const s = e.stop; e.stop = null;
      if (s === 'feira') { const h = Math.round(e.mhp * 0.06); e.hp = Math.min(e.mhp, e.hp + h); e.atkBuff = { m: 1.25, t: 3 }; sfx('heal'); await bSay(`* Seu Jorge desce na feira imaginária e volta com força. +${h} PV, ataque maior.`, { auto: 55 }); return; }
      if (s === 'escola') return runMove(e, { k: 'seq', n: 7, p: 0.5, hide: true, t: '* "CHAMADA!" Sete nomes de crianças que pegavam o ônibus. Ele lembra de todos. Você precisa lembrar das setas.' });
      return runMove(e, { k: 'ring', p: 2.4, pierce: true, fast: true, t: '* PONTO FINAL! O ônibus inteiro atravessa a garagem na sua direção!', fx: 'shake' });
    }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'ring', p: 2.4, pierce: true, fast: true, t: '* PONTO FINAL! O ônibus inteiro atravessa a garagem na sua direção!', fx: 'shake' }); }
    if (e.turns % 3 === 0) {
      const s = e.p2 && Math.random() < 0.5 ? 'final' : pickOne(['feira', 'escola', 'final']);
      if (s === 'final') e.charge = true; else e.stop = s;
      await bSay(STOPS[s].t, { auto: 65 }); return;
    }
    return runMove(e, pickMove(e, [
      { k: 'mash', p: 1, need: 15, bind: true, w: 2, t: '* FREADA BRUSCA! Você é jogado para a frente e preso no corrimão!' },
      { k: 'seq', n: e.p2 ? 7 : 6, p: 0.45, spd: 1.1, w: 2, t: '* CATRACA! Ela gira, gira e gira!' },
      { k: 'dodge', p: 0.45, hits: 4, spd: 1.25, w: 2, t: '* LOTAÇÃO! Uma multidão de passageiros fantasmas passa por você!' },
      { k: 'ring', p: 0.9, st: 'silence', w: 1, t: '* BIIIII! A buzina te deixa surdo e mudo.' },
      { k: 'spell', p: 1.05, el: 'vento', name: 'Corrente de Ar da Janela', w: 1, t: '* Ele abre todas as janelas: {w}Corrente de Ar{/}!' }]));
  }
};
Object.assign(AI, AI5);
WHO.jorge = { name: () => 'Seu Jorge', portrait: () => SP.jorge[0], voice: () => sfx('blipLow', 170), col: '#ffe9c0' };
WHO.musgo = { name: () => 'Musgo', portrait: () => SP.musgo[0], voice: () => sfx('blipLow', 100), col: '#d8f0b8' };
WHO.maren5 = { name: () => 'Maren', portrait: () => SP.maren5[0], voice: () => sfx('blip', 420), col: '#e8d8ff' };
WHO.fiscal = { name: () => 'Fiscal da Linha', portrait: () => SP.fiscalP[0], voice: () => sfx('blipLow', 220), fx: 'shake', col: '#d0d8e0' };

// ---------- mapas (validados por build/ch5/validate5.py) ----------
const TH_TERM = { floor: '#3a3632', speck: '#44403a', dark: '#2e2a26', wall: '#57504a', mortar: '#2e2a26', wallHi: '#7a7068' };
const TH_TRIN = { floor: '#3a2e24', speck: '#463828', dark: '#2e241c', wall: '#4e3e30', mortar: '#2e241c', wallHi: '#6e5a44' };
const TH_ASF = { floor: '#2c2c32', speck: '#36363c', dark: '#24242a', wall: '#44444e', mortar: '#24242a', wallHi: '#62626e' };
Object.assign(MAPS, {
  terminal: { name: "Terminal Rodoviário", music: 'terminal', dark: 0.25, theme: TH_TERM, battleBg: '#1e1a1a', rows: ["############..############", "#.QQQ.QQQ...........QQQ..#", "#........................#", "#..QQQ.QQQ.......KK......#", "#...........######.......#", "#..QQQ.QQQ..#....#..QQQ..#", "#...........#....#.......#", "#...........##..##.......#", "#.........................", "#.........................", "#..K...............K.....#", "#..QQQ.QQQ......QQQ.QQQ..#", "#........................#", "#..QQQ.QQQ......QQQ.QQQ..#", "#........................#", "#.....,..............,...#", "#........................#", "##########################"],
    exits: [{"x": 25, "y": 8, "to": "trincheira", "tx": 1, "ty": 8}, {"x": 25, "y": 9, "to": "trincheira", "tx": 1, "ty": 9}, {"x": 12, "y": 0, "to": "manobras", "tx": 13, "ty": 18, "cond": "musgoDone"}, {"x": 13, "y": 0, "to": "manobras", "tx": 14, "ty": 18, "cond": "musgoDone"}],
    ents: [{"id": "save_tm", "kind": "save", "x": 3, "y": 15}, {"id": "tubo5", "kind": "npc2", "x": 1, "y": 2, "sp": "tubo", "talk": "tubo5"}, {"id": "tiago5", "kind": "npc2", "x": 14, "y": 5, "sp": "hunter", "talk": "tiago5"}, {"id": "d_man1", "kind": "door", "x": 12, "y": 0, "cond": "musgoDone", "dark": true, "msg": "portao5"}, {"id": "d_man2", "kind": "door", "x": 13, "y": 0, "cond": "musgoDone", "dark": true, "msg": "portao5"}, {"id": "pip5", "kind": "npc2", "x": 22, "y": 15, "sp": "pip", "talk": "aprendiz5", "cond": "free_pip", "name": "Pip"}, {"id": "nina5", "kind": "npc2", "x": 23, "y": 14, "sp": "pip", "talk": "aprendiz5", "cond": "free_nina", "name": "Nina"}, {"id": "tolo5", "kind": "npc2", "x": 24, "y": 15, "sp": "pip", "talk": "aprendiz5", "cond": "free_tolo", "name": "Tolo"}, {"id": "p_t1", "kind": "patrol", "x": 3, "y": 12, "path": [[3, 12], [22, 12]], "delay": 18, "range": 4, "group": ["fiscalP"], "sp": "fiscalP", "light": true}, {"id": "p_t2", "kind": "patrol", "x": 19, "y": 2, "path": [[19, 2], [19, 9]], "delay": 18, "range": 4, "group": ["recruta"], "sp": "recruta"}, {"id": "e_t1", "kind": "enemy", "x": 8, "y": 15, "group": ["recruta", "escudeiro"]}, {"id": "e_t2", "kind": "enemy", "x": 21, "y": 16, "group": ["arcabuz"]}, {"id": "cr_tm1", "kind": "chest", "x": 24, "y": 1, "rune": "polvora", "n": 1}, {"id": "cr_tm2", "kind": "chest", "x": 1, "y": 16, "rune": "dardo", "n": 2}] },
  trincheira: { name: "Trincheira do Mercado", music: 'trincheira', dark: 0.35, theme: TH_TRIN, battleBg: '#1e1a1a', rows: ["##############################", "#..X......X.......X.......K..#", "#..X..,...X...,...X.......K..#", "#..XXXX...XXXXX...XXXX.......#", "#............................#", "#....,.........,.............#", "#..XXXX...XXXXX...XXXX.......#", "#..X..........X......X.......#", "...X..........X......X.......#", "...X...,......X..,...X.......#", "#..XXXX...XXXXX...XXXX.......#", "#............................#", "#....,.........,.............#", "#..XXXX...XXXXX...XXXX..TT...#", "#..X..........X......X..TT...#", "#..X..........X......X.......#", "#..XXXX...XXXXX...XXXX.......#", "#.........,..................#", "#............................#", "##############################"],
    exits: [{"x": 0, "y": 8, "to": "terminal", "tx": 24, "ty": 8}, {"x": 0, "y": 9, "to": "terminal", "tx": 24, "ty": 9}],
    ents: [{"id": "save_tr", "kind": "save", "x": 25, "y": 11}, {"id": "musgo", "kind": "npc2", "x": 26, "y": 8, "sp": "musgo", "talk": "musgo5", "glow": "rgba(150,220,120,0.15)"}, {"id": "refug1", "kind": "npc2", "x": 27, "y": 4, "sp": "rat", "talk": "refugiado"}, {"id": "refug2", "kind": "npc2", "x": 27, "y": 15, "sp": "mush", "talk": "refugiado"}, {"id": "e_tr1", "kind": "enemy", "x": 8, "y": 8, "group": ["recruta", "recruta"]}, {"id": "e_tr2", "kind": "enemy", "x": 18, "y": 8, "group": ["escudeiro", "arcabuz"]}, {"id": "e_tr3", "kind": "enemy", "x": 11, "y": 14, "group": ["alquimista", "recruta"]}, {"id": "e_tr4", "kind": "enemy", "x": 18, "y": 14, "group": ["cao", "cao"]}, {"id": "e_tr5", "kind": "enemy", "x": 5, "y": 1, "group": ["arcabuz"]}, {"id": "cr_tr1", "kind": "chest", "x": 1, "y": 1, "item": "frag", "n": 1}, {"id": "cr_tr2", "kind": "chest", "x": 20, "y": 1, "rune": "bandeira", "n": 1}, {"id": "carta5", "kind": "npc2", "x": 12, "y": 8, "sp": "diario", "talk": "diario5", "hide": "carta5", "float": true, "glow": "rgba(120,170,255,0.18)"}],
    booms: [{"tiles": [[8, 4]], "T": 150, "off": 0, "type": "bomb"}, {"tiles": [[8, 5]], "T": 170, "off": 37, "type": "bomb"}, {"tiles": [[16, 4]], "T": 190, "off": 74, "type": "bomb"}, {"tiles": [[16, 5]], "T": 150, "off": 111, "type": "bomb"}, {"tiles": [[8, 11]], "T": 170, "off": 148, "type": "bomb"}, {"tiles": [[8, 12]], "T": 190, "off": 35, "type": "bomb"}, {"tiles": [[16, 11]], "T": 150, "off": 72, "type": "bomb"}, {"tiles": [[16, 12]], "T": 170, "off": 109, "type": "bomb"}, {"tiles": [[5, 17]], "T": 190, "off": 146, "type": "bomb"}, {"tiles": [[12, 17]], "T": 150, "off": 33, "type": "bomb"}, {"tiles": [[20, 17]], "T": 170, "off": 70, "type": "bomb"}, {"tiles": [[24, 5]], "T": 190, "off": 107, "type": "bomb"}, {"tiles": [[23, 18]], "T": 150, "off": 144, "type": "bomb"}, {"tiles": [[4, 4]], "T": 170, "off": 31, "type": "bomb"}] },
  manobras: { name: "Pátio de Manobras", music: 'manobras', dark: 0.3, theme: TH_ASF, battleBg: '#1e1a1a', rows: ["#############..#############", "#..........................#", "#.VVVV.............VVVV....#", "#..........................#", "#==========================#", "#..........................#", "#.VVVV....K....K....VVVV...#", "#..........................#", "#..........................#", "#==========================#", "#..........................#", "#.VVVV....VVVV.....VVVV....#", "#..........................#", "#..........................#", "#==========================#", "#..........................#", "#.VVVV...........K.....VVVV#", "#..........................#", "#..........................#", "#############..#############"],
    exits: [{"x": 13, "y": 19, "to": "terminal", "tx": 12, "ty": 1}, {"x": 14, "y": 19, "to": "terminal", "tx": 13, "ty": 1}, {"x": 13, "y": 0, "to": "oficina", "tx": 11, "ty": 15, "cond": "marenDone"}, {"x": 14, "y": 0, "to": "oficina", "tx": 12, "ty": 15, "cond": "marenDone"}],
    ents: [{"id": "save_mn", "kind": "save", "x": 2, "y": 17}, {"id": "maren5E", "kind": "boss3", "x": 13, "y": 2, "sp": "maren5", "done": "marenDone", "script": "maren5", "glow": "rgba(200,160,255,0.15)"}, {"id": "d_of1", "kind": "door", "x": 13, "y": 0, "cond": "marenDone", "dark": true, "msg": "portao5"}, {"id": "d_of2", "kind": "door", "x": 14, "y": 0, "cond": "marenDone", "dark": true, "msg": "portao5"}, {"id": "e_mn1", "kind": "enemy", "x": 5, "y": 7, "group": ["escudeiro", "alquimista"]}, {"id": "e_mn2", "kind": "enemy", "x": 20, "y": 12, "group": ["arcabuz", "arcabuz"]}, {"id": "e_mn3", "kind": "enemy", "x": 8, "y": 17, "group": ["cao", "recruta"]}, {"id": "e_mn4", "kind": "enemy", "x": 22, "y": 7, "group": ["veterano"]}, {"id": "cr_mn1", "kind": "chest", "x": 26, "y": 1, "rune": "onda", "n": 1}, {"id": "cr_mn2", "kind": "chest", "x": 1, "y": 8, "rune": "mina", "n": 1}],
    booms: [{"tiles": [[1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4], [14, 4], [15, 4], [16, 4], [17, 4], [18, 4], [19, 4], [20, 4], [21, 4], [22, 4], [23, 4], [24, 4], [25, 4], [26, 4]], "T": 190, "off": 0, "type": "tram"}, {"tiles": [[1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [17, 9], [18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [25, 9], [26, 9]], "T": 160, "off": 60, "type": "tram"}, {"tiles": [[1, 14], [2, 14], [3, 14], [4, 14], [5, 14], [6, 14], [7, 14], [8, 14], [9, 14], [10, 14], [11, 14], [12, 14], [13, 14], [14, 14], [15, 14], [16, 14], [17, 14], [18, 14], [19, 14], [20, 14], [21, 14], [22, 14], [23, 14], [24, 14], [25, 14], [26, 14]], "T": 140, "off": 20, "type": "tram"}] },
  oficina: { name: "Oficina de Guerra", music: 'trincheira', dark: 0.4, theme: TH_ASF, battleBg: '#1e1a1a', rows: ["########################", "#WW..WW..WW....J.J.J...#", "#......................#", "#..K....,......J.J.J...#", "#......................#", "#WW..WW..WW.............", "#.......................", "#..........W..W.......##", "#..........WWWW.......##", "#####.##########..##..##", "#........#..........#..#", "#........#..........#..#", "#........#..........#..#", "#........#..........#..#", "##########..........#..#", "###########..###########"],
    exits: [{"x": 11, "y": 15, "to": "manobras", "tx": 13, "ty": 1}, {"x": 12, "y": 15, "to": "manobras", "tx": 14, "ty": 1}, {"x": 23, "y": 5, "to": "garagem", "tx": 1, "ty": 8}, {"x": 23, "y": 6, "to": "garagem", "tx": 1, "ty": 9}],
    ents: [{"id": "save_of", "kind": "save", "x": 13, "y": 13}, {"id": "r_polvora", "kind": "rune", "x": 12, "y": 7, "rune": "polvora"}, {"id": "jaulas5", "kind": "npc2", "x": 17, "y": 2, "sp": "cage", "talk": "jaulas5"}, {"id": "s_entulho", "kind": "seal", "x": 5, "y": 9, "flag": "s_entulho", "need": {"el": "polvora"}, "look": "rubble"}, {"id": "fiscalE", "kind": "boss3", "x": 4, "y": 11, "sp": "fiscal", "done": "fiscalDone", "script": "fiscal", "glow": "rgba(255,80,80,0.12)"}, {"id": "e_of1", "kind": "enemy", "x": 4, "y": 2, "group": ["veterano", "alquimista"]}, {"id": "e_of2", "kind": "enemy", "x": 18, "y": 4, "group": ["escudeiro", "escudeiro", "arcabuz"]}, {"id": "e_of3", "kind": "enemy", "x": 15, "y": 11, "group": ["cao", "veterano"]}, {"id": "e_of4", "kind": "enemy", "x": 22, "y": 11, "group": ["alquimista", "arcabuz"]}, {"id": "cr_of1", "kind": "chest", "x": 2, "y": 13, "rune": "foco", "n": 1}, {"id": "cr_of2", "kind": "chest", "x": 22, "y": 14, "rune": "sal", "n": 2}, {"id": "carta5b", "kind": "npc2", "x": 8, "y": 12, "sp": "diario", "talk": "diario5", "hide": "carta5b", "float": true, "glow": "rgba(120,170,255,0.18)"}] },
  garagem: { name: "Garagem do 31", music: 'jorge', dark: 0.35, theme: TH_ASF, battleBg: '#1e1a1a', rows: ["######################", "#....................#", "#..VVVVVVVVVVVVVV....#", "#..VVVVVVVVVVVVVV....#", "#..VVVVVVVVVVVVVV....#", "#....................#", "#....................#", "#...K..........K.....#", ".....................#", ".....................#", "#....................#", "#...K..........K.....#", "#....................#", "######################"],
    exits: [{"x": 0, "y": 8, "to": "oficina", "tx": 22, "ty": 5}, {"x": 0, "y": 9, "to": "oficina", "tx": 22, "ty": 6}],
    ents: [{"id": "save_ga", "kind": "save", "x": 2, "y": 11}, {"id": "jorgeE", "kind": "boss3", "x": 10, "y": 6, "sp": "jorge", "done": "jorgeDone", "script": "jorge", "glow": "rgba(255,224,160,0.18)"}] },
});
MAPS.fundo.ents.push({ id: 'tuboArq', kind: 'npc2', x: 17, y: 1, sp: 'tubo', talk: 'tubo5', cond: 'ch4done', glow: 'rgba(255,224,160,0.2)' });

// ---------- história ----------
const DIARIO = {
  carta5: '* Um caderno azul de capa mole, molhado de lama. "Diário de Bordo — Linha 31". A letra é grande e cuidadosa.\n* "Segunda. Dona Cida esqueceu o guarda-chuva de novo. Guardei. O menino do fone dormiu no último banco. Deixei dormir até o terminal."',
  carta5b: '* Mais uma página do diário, arrancada e dobrada em quatro.\n* "Eu não vi a curva. Vi um clarão branco e soltei o volante. Vinte e três anos de linha e eu soltei o volante."\n* "Se Deus existir aqui embaixo, que me deixe pelo menos levar eles de volta."'
};
Object.assign(STORY, {
  async tubo5() {
    if (WD.id !== 'fundo') { await say('* Um tubo pneumático de bronze. Ele sopra um ar quente que cheira a papel e ferrugem.'); return; }
    if (G.flags.ch5open) { await say('* O tubo pneumático. Ele já te levou uma vez. Ele não parece disposto a repetir.'); return; }
    await say('* Um tubo pneumático de bronze, largo o bastante para um baú. Uma etiqueta diz: "EXPRESSO — TODOS OS ANDARES".');
    await say('Baú. A carta do Tiago dizia que a guerra desceu. Se for pelas escadas, a gente chega depois que acabar.', 'lume');
    const c = await choose('* Entrar no tubo? (Começa o Capítulo 5.)', ['Entrar', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.ch5start();
  },
  async ch5start() {
    await say('* Antes de você entrar, um Morcego de Papel pousa na sua tampa. A letra é inclinada e firme.');
    if (G.flags.ofeliaRemembers) await say('* "Eu leio tudo de novo, com outros olhos. Dói, mas é meu. Cuidem um do outro lá em cima. — Clara, que também é Ofélia."');
    else await say('* "A Clara dorme bem. Eu desço para ver ela toda noite. Cuidem um do outro lá em cima. — O."');
    await say('* Embaixo, com letra de criança: "E VOLTEM PRA PEGAR O TROCO! — Bento"');
    playMusic(null); sfx('flee'); await fadeOut(16); V.scene = 'black'; await fadeIn(1);
    await say('* FFFFFUP.', 'void');
    await say('* Você viaja como uma encomenda. Frágil. Este lado para cima.', 'void');
    await say('* Pela fresta da tampa, você vê andares passando: água, tinta, ferro. E fogo.', 'void');
    G.flags.ch5open = true; G.flags.knowTiago = true;
    await fadeOut(10); loadMap('terminal', 2, 2, 'down'); V.scene = 'world'; shake(14); sfx('hurt'); await fadeIn(16);
    await say('* Você cai num guichê de encomendas. Ao redor: bancos de madeira, painéis de horário, plataformas numeradas.');
    await say('* É uma rodoviária. Uma rodoviária inteira, construída dentro da masmorra.');
    await say('...Eu conheço este lugar. É o Terminal Central. De onde o 31 saía.', 'me');
    await say('A masmorra copia as coisas de dentro da cabeça das pessoas. Alguém aqui lembra muito bem desse terminal.', 'lume');
    await say('* Um cartaz na parede: "ALISTE-SE NA LINHA 31. A ÚLTIMA VIAGEM VOLTA PARA CASA."');
    sfx('catalog'); await say('[Capítulo 5: {y}O Motorista{/}.]', 'cat');
    await grantTechs(false); saveGame();
  },
  async terminalFirst() { await wait(10); await say('* Soldados de Auren dormem em bancos de rodoviária. Fiscais com lampião vigiam as plataformas.'); await say('Disfarce, baú. Ninguém olha duas vezes para uma mala.', 'lume'); },
  async trincheiraFirst() {
    await wait(20);
    await say('* O Mercado Afundado virou uma trincheira. Sacos de areia, crateras, barracas queimadas.');
    await say('* Do lado de lá, pequenas luzes: monstros escondidos. Do lado de cá, canhões que não param.');
    await say('Era aqui que eu comprava pão mofado. Agora é uma guerra.', 'me');
  },
  async manobrasFirst() { await wait(20); await say('* Um pátio de manobras enorme, cheio de ônibus parados. Trilhos cortam o chão de lado a lado.'); await say('* De longe, um sino toca. Um bonde vermelho passa sem motorneiro, rápido demais.'); await say('Eu odeio transporte público.', 'lume'); },
  async oficinaFirst() {
    await wait(20);
    await say('* Uma oficina de guerra. Nas bancadas, armas sendo forjadas com escamas, chifres e cascos de monstros.');
    await say('* Num canto, jaulas. Dentro delas, monstros pequenos, muito quietos.');
    await say('...Eles fazem armas com a gente.', 'me');
    await say('* A Lume não faz piada nenhuma.');
  },
  async garagemFirst() { await wait(20); await say('* Uma garagem de ônibus. No meio dela, sob uma única lâmpada, o 31. Amarelo e azul. Com o vidro da frente rachado.'); await say('* Na frente do ônibus, um homem de quepe azul passa um pano na lataria.'); },
  async portao5(e) { await say(WD.id === 'terminal' ? '* Um portão com uma catraca. Placa: "PÁTIO DE MANOBRAS — SÓ CREDENCIADOS".' : '* Uma porta de ferro. Do outro lado, barulho de martelo e de jaulas.'); },
  async tiago5() {
    const f = G.flags;
    if (!f.tiagoMet5) {
      f.tiagoMet5 = true;
      await say('* Atrás do guichê fechado, um homem de colete de cobrador conta moedas que não servem para nada.');
      await say('...Baú? Baú! Você recebeu a carta!', 'tiago');
      await say('Fala baixo. Aqui todo mundo acha que eu tô do lado deles. Eu meio que tô.', 'tiago');
      await say('Tiago, o que tá acontecendo?', 'me');
      await say('O Seu Jorge juntou os heróis do Andar 3. Ele promete que vai levar todo mundo de volta pra casa.', 'tiago');
      await say('E a gente acredita, sabe? Ele dirigiu o 31 por vinte e três anos. Ele sabia o nome de todo mundo. Ele esperava a Dona Cida subir com calma.', 'tiago');
      await say('Mas o plano dele é descer até o fundo da masmorra com o ônibus cheio de pólvora rúnica e explodir o coração dela.', 'tiago');
      await say('E os monstros? A gente também era do ônibus!', 'lume');
      await say('...Eu falei isso pra ele. Ele disse que monstro não volta pra casa. Que vocês "já foram".', 'tiago');
      await say('Ele tá na Garagem, depois do Pátio de Manobras. O portão só abre com crachá de motorista.', 'tiago');
      await say('O único crachá que sumiu foi roubado pela resistência dos monstros. Lá no Mercado. A leste. Debaixo das bombas.', 'tiago');
      await say('Vai. Eu cubro você aqui. Eu sempre fui bom em fingir que não vi ninguém pular a catraca.', 'tiago');
      return;
    }
    if (f.jorgeDone) { await say('...Obrigado, baú. Eu não sabia mais pra que lado ficar.', 'tiago'); return; }
    if (f.marenDone) { await say('A Maren voltou? Sem chapéu? ...Ela sempre me deu medo. Agora me dá pena. Vai, a Garagem é logo depois da Oficina.', 'tiago'); return; }
    if (f.musgoDone) { await say('Conseguiu o crachá? Então vai. O Pátio tem bonde passando sem motorneiro. Espera o sino tocar e atravessa depois.', 'tiago'); return; }
    await say('O Mercado é a leste. Cuidado com as bombas: elas caem onde aparece o alvo vermelho.', 'tiago');
  },
  async musgo5() {
    const f = G.flags;
    if (f.musgoDone) { await say(pickOne(['Vai, pequeno baú. A gente segura a trincheira.', 'COISAS DE BAIXO... AGORA PROTEGEM COISAS DE BAIXO. É BOM.', 'O crachá abre o portão do norte do terminal.']), 'musgo'); return; }
    f.musgoDone = true; playMusic('jorge');
    await say('* Atrás dos sacos de areia, um golem de pedra coberto de musgo, com rachaduras remendadas com cera de vela.');
    await say('COISA... DE BAIXO.', 'musgo');
    await say('...Guarda-Musgo?! Eu te derrotei no primeiro andar!', 'me');
    await say('DERROTOU. EU DORMI. A MASMORRA ME REMENDOU. AGORA ME CHAMAM SÓ DE MUSGO.', 'musgo');
    await say('EU IMPEDIA COISAS DE BAIXO DE SUBIR. AGORA AS COISAS DE CIMA DESCERAM. ENTÃO EU MUDEI DE LADO.', 'musgo');
    await say('* Ao redor dele, ratos-de-vela, cogumelos e lodos de tinta. Todos pequenos. Todos com medo.');
    await say('ELES SÓ QUEREM EXISTIR. ISSO É PEDIR MUITO?', 'musgo');
    await say('Você disse "cuidado com o herói" quando caiu. Você tinha razão.', 'me');
    await say('EU SEMPRE TENHO RAZÃO. EU SÓ DEMORO PARA FALAR.', 'musgo');
    await say('* Musgo tira de dentro da pedra um crachá plastificado: "JORGE A. — MOTORISTA — LINHA 31". A foto mostra um homem sorrindo.');
    sfx('item'); await say('* Você recebeu o {y}Crachá de Motorista{/}. O portão norte do Terminal vai abrir.');
    await say('PEGUE TAMBÉM ISTO. OS RATOS JUNTARAM.', 'musgo');
    giveItem('quentinha', 2); await say('* Você recebeu {y}Quentinha{/} ×2.');
    playMusic(WD.map.music);
  },
  async refugiado() { await say(pickOne(['* Um Rato-de-Vela treme atrás dos sacos. A vela dele está quase apagando.', '* Um Cogumelo velho segura um cogumelinho no colo. Ele faz "shh" quando a bomba cai.', '* Um Lodo de Tinta desenha no chão uma casa com uma janela. Depois apaga.'])); },
  async diario5(e) {
    if (G.flags[e.id]) return;
    G.flags[e.id] = true; sfx('item'); G.flags.jorgePages = (G.flags.jorgePages || 0) + 1;
    await say(DIARIO[e.id]);
    await say(`* (Diário do Motorista: ${G.flags.jorgePages}/2 páginas.)`);
  },
  async aprendiz5(e) {
    const f = G.flags;
    if (f.aprendizesDone) { await say(pickOne(['A gente vai ficar aqui e esconder quem precisar. A capitã ia gostar disso.', 'Se precisar, apita. A gente vem correndo. Bom, andando rápido.', 'Eu ainda não abro baú nenhum. Por via das dúvidas.']), 'pip'); return; }
    if (!f.aprendizesMet) {
      f.aprendizesMet = true;
      await say(`* ${e.name} está escondido atrás de uma pilha de malas, com os outros dois aprendizes da Brida.`);
      await say('O baú! O baú que soltou a gente!', 'pip');
      await say('A gente desertou. Depois do que fizeram com a capitã, ninguém aguentou ficar.', 'pip');
      await say('Agora a gente ajuda os monstros a fugir do Mercado. Escondidos em malas. É ridículo e funciona.', 'pip');
    }
    if (f.bridaWhistle && !f.aprendizesDone) {
      f.aprendizesDone = true;
      await say('* Você mostra o apito de treino da Brida. Os três ficam em silêncio.');
      await say('...É o apito dela. Com a marca de dente. Ela mordia quando ficava nervosa.', 'pip');
      await say('Fica com ele. E quando apitar, a gente aparece. É uma ordem da capitã. Ela daria essa ordem.', 'pip');
      G.tech = G.tech || []; if (!G.tech.includes('aprendizes')) G.tech.push('aprendizes'); sfx('rune');
      await say(`[Técnica aprendida: {y}${TECH.aprendizes.name}{/}. ${TECH.aprendizes.desc}]`, 'cat');
      return;
    }
    if (!f.aprendizesGift) { f.aprendizesGift = true; giveItem('vale', 2); sfx('item'); await say('Toma isso. A gente roubou do Fiscal. Volta pra Lanterna num piscar de olhos.', 'pip'); await say('* Você recebeu {y}Vale-Transporte{/} ×2.'); return; }
    await say('A capitã tinha um apito... A gente nunca achou. Ela sempre dizia que um apito vale mais que uma espada.', 'pip');
  },
  async jaulas5() {
    if (G.flags.jaulasFree) { await say('* As jaulas estão vazias e abertas. Alguém deixou um desenho de baú riscado no chão, com um coração.'); return; }
    await say('* Jaulas cheias de monstros pequenos. Os cadeados têm uma runa amarela. Do mesmo tipo das celas da Jaula, no Andar 3.');
    const tmp = { flag: 'jaulasFree', need: { el: 'faisca' }, look: 'machine' };
    await useSeal(tmp);
    if (G.flags.jaulasFree) { await say('* Os cadeados estalam. Os monstros saem devagar, olham para você e somem pelos dutos da oficina, em fila.'); await say('* Um deles, um Rato-de-Vela com a cauda chamuscada, volta e deixa algo aos seus pés.'); giveItem('cafe', 2); sfx('item'); await say('* Você recebeu {y}Café de Garrafa Térmica{/} ×2.'); }
  },
  async maren5() {
    if (G.flags.marenDone) return;
    if (!G.flags.maren5Seen) {
      G.flags.maren5Seen = true; playMusic(null);
      await say('* No meio dos trilhos, uma mulher sem chapéu, com um casaco de inquisidora rasgado. Ela segura um livro remendado com barbante.');
      await say('Alma trinta e um. Eu sabia que você ia subir. Gente como você sempre sobe.', 'maren5');
      await say('Você matou a Brida.', 'lume');
      await say('Eu ARQUIVEI a Brida. É diferente. Ela continua lá, em uma gaveta. Eu, não.', 'maren5');
      await say('Auren me tirou o cargo por perder o Escriba. O motorista me deu um emprego. Achar você antes que você ache ele.', 'maren5');
      await say('Você não tá cansada?', 'me');
      await say('...Muito.| Por isso mesmo eu quero acabar logo.', 'maren5');
    } else await say('Vamos acabar logo, alma trinta e um.', 'maren5');
    const r = await battle(['maren5'], { boss: true, music: 'boss5', noFlee: true, intro: '* Maren, Sem Chapéu, abre o livro remendado!' });
    if (r !== 'win') return;
    G.flags.marenDone = true; refreshEnts(); playMusic(null);
    await say('* Maren cai sentada nos trilhos. O livro escorrega da mão dela.');
    await say('...Pode arquivar. Eu não ligo mais.', 'maren5');
    await say('A gente não arquiva ninguém. A gente não é a masmorra.', 'me');
    await say('* Ela olha para você por um tempo muito longo.');
    await say('...Então vai. O motorista está na Garagem, depois da Oficina. Ele vai explodir o fundo de tudo. Eu ajudei a fazer a pólvora.', 'maren5');
    await say('Eu só queria que alguém me dissesse que eu tinha feito um bom trabalho.', 'maren5');
    G.flags.marenSpared = true;
    await say('* Um sino toca. Quando o bonde passa, Maren já não está mais nos trilhos.');
    playMusic(WD.map.music);
  },
  async fiscal() {
    if (G.flags.fiscalDone) return;
    await say('* No fundo da sala escondida, uma catraca enorme, de quepe, range sozinha.');
    await say('PASSAGEM.', 'fiscal');
    await say('Eu não tenho dinheiro. Eu sou um baú vazio.', 'me');
    await say('PASSAGEM. OU MULTA.', 'fiscal');
    const c = await choose('* O Fiscal da Linha bloqueia o caminho. (Chefe secreto muito forte.)', ['Pagar com a mordida', 'Voltar depois'], 'n', 1);
    if (c !== 0) return;
    const r = await battle(['fiscal'], { boss: true, music: 'boss5', noFlee: false, intro: '* O Fiscal da Linha gira e trava a passagem!' });
    if (r !== 'win') return;
    G.flags.fiscalDone = true; refreshEnts();
    await say('* A catraca para de girar. Do meio dela, caem moedas antigas, bilhetes amassados e um caco de âmbar.');
    await say('...PASSAGEM. CONFERIDA. BOA... VIAGEM.', 'fiscal');
    G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
    giveItem('vale', 3); await say('* Você recebeu {y}Vale-Transporte{/} ×3.');
    await giveRune('mare', false, 1);
    await checkEvo();
  },
  async jorge() {
    if (G.flags.jorgeDone) return;
    if (!G.flags.jorgeSeen) {
      G.flags.jorgeSeen = true; playMusic('jorge');
      await say('* O homem de quepe para de passar o pano. Ele não se vira.');
      await say('Achei que você ia demorar mais. Você sempre foi o último a descer.', 'jorge');
      await say('Seu Jorge.', 'me');
      await say('Último banco, lado da janela. Fone de ouvido, mangá na mochila. Descia no ponto da padaria.', 'jorge');
      await say('Eu sei o nome de todo mundo do 31. Trinta e uma pessoas. Eu dirigi aquele dia. Eu soltei o volante.', 'jorge');
      await say('Então eu vou levar todo mundo de volta. Do jeito que der.', 'jorge');
      await say('Explodindo a masmorra? Com os monstros dentro? A gente também é do 31!', 'lume');
      await say('...Menina do fone? É você aí dentro desse lustre?', 'jorge');
      await say('* Por um segundo, as mãos dele tremem.');
      await say('Vocês já foram. Eu sinto muito. Eu sinto muito MESMO. Mas os que ainda podem voltar, eu levo.', 'jorge');
      await say('Ou eu não sou motorista de nada.', 'jorge');
    } else await say('Sobe, menino. Ou sai da frente.', 'jorge');
    const r = await battle(['jorge'], { boss: true, music: 'boss5', noFlee: true, intro: '* Seu Jorge, o Motorista, gira um volante invisível!' });
    if (r !== 'win') return;
    G.flags.jorgeDone = true; refreshEnts();
    await STORY.jorgeEnd();
  },
  async jorgeEnd() {
    playMusic('jorge');
    await say('* Seu Jorge cai de joelhos na frente do ônibus. O quepe rola até os seus pés.');
    await say('Vinte e três anos, sabe? Nunca um acidente. Nenhum.', 'jorge');
    await say('Aí um clarão branco.| E eu soltei o volante.', 'jorge');
    await say('* Tiago se ajoelha do lado dele. Ninguém fala por um tempo.');
    if ((G.flags.jorgePages || 0) >= 2) {
      await say('* Você abre a tampa e devolve o Diário de Bordo. Lama seca, páginas tortas.');
      await say('"O menino do fone dormiu no último banco. Deixei dormir até o terminal."', 'me');
      await say('O senhor sempre deixava. Eu nunca agradeci.', 'me');
      await say('* Seu Jorge segura o diário com as duas mãos. Ele chora como quem não chora há muito tempo.');
      G.flags.jorgeDiary = true;
    }
    await say('O que a gente faz com ele, baú?', 'tiago');
    const c = await choose('* O que fazer com o Seu Jorge?', ['Deixar ele ir, sem a pólvora', 'Entregar para a resistência do Musgo'], 'n');
    if (c === 0) {
      G.flags.jorgeFate = 'livre';
      await say('Vai, Seu Jorge. Sem bomba. Sem plano. Só vai.', 'me');
      await say('...E pra onde um motorista vai sem ônibus?', 'jorge');
      await say('Comigo. Alguém precisa cuidar do senhor. E eu sou o cobrador. É o meu trabalho.', 'tiago');
    } else {
      G.flags.jorgeFate = 'preso';
      await say('O Musgo vai cuidar do senhor. Ele também já esteve do lado errado.', 'me');
      await say('...Justo. É justo.', 'jorge');
      await say('Eu vou visitar. Todo dia. Eu juro.', 'tiago');
    }
    playMusic(null); await wait(40);
    shake(50); sfx('rumble');
    await say('* O chão da garagem treme. As luzes do 31 acendem sozinhas. O motor liga.');
    await say('* Ninguém está no volante.');
    await say('TRINTA| E| UM.', 'fundo');
    await say('O ÔNIBUS É MEU. AS ALMAS SÃO MINHAS. A COLEÇÃO ESTÁ QUASE COMPLETA.', 'fundo');
    await say('* As portas do ônibus abrem. Uma força puxa o Seu Jorge pelos pés, devagar, para dentro.');
    await say('NÃO!', 'tiago');
    if (G.flags.jorgeFate === 'livre') {
      await say('* Tiago se joga e segura o braço do motorista. Os dois são puxados juntos.');
      await say('Baú! Junta o pessoal do 31! TODO MUNDO! Ela quer a coleção, então...', 'tiago');
      await say('* As portas fecham. O 31 afunda no chão da garagem como se o concreto fosse água.');
      G.flags.tiagoTaken = true;
    } else {
      await say('* Tiago tenta segurar, mas as portas fecham na frente dele. O 31 afunda no chão da garagem como se o concreto fosse água.');
      await say('...Ela levou ele. Ela levou o ônibus.', 'tiago');
      await say('Então a gente vai buscar. A gente junta todo mundo do 31 e vai buscar.', 'me');
      G.flags.tiagoTaken = false;
    }
    await wait(30);
    await say('* No lugar do ônibus, ficou só uma mancha de óleo e um bilhete de passagem, com um número carimbado: 31.');
    await say('Ela quer as trinta e uma almas juntas.| Então a gente vai juntar.| Do nosso jeito.', 'lume');
    await endScreen(5);
    G.flags.ch5done = true;
    saveGame();
  }
});
TECH.aprendizes = { name: 'Apito da Brida', cd: 5, desc: 'Pip, Nina e Tolo aparecem: três golpes em inimigos aleatórios e um deles pode ficar atordoado.',
  async use() { sfx('catalog'); const log = ['* PRIIIIII! Três aprendizes entram correndo, de escudo erguido!']; for (const nm of ['Pip', 'Nina', 'Tolo']) { const al = BT.en.filter(e => e.alive && e.hp > 0); if (!al.length) break; const t = pickOne(al); const d = Math.max(1, Math.round((G.st.atk * 0.7 + G.st.mag * 0.5) * rand(0.9, 1.1))); hitEnemy(t, d, 'hit', '#ff6b6b'); log.push(`* ${nm} acerta o ${t.name}: ${d}.`); await wait(8); } const s = pickOne(BT.en.filter(e => e.alive && e.hp > 0 && !e.d.boss)); if (s) { s.stunned = 1; log.push(`* O ${s.name} ficou tonto!`); } await bSay(log.slice(0, 5).join('\n'), { auto: 60 }); } };
{ const _f = { terminal: 'terminalFirst', trincheira: 'trincheiraFirst', manobras: 'manobrasFirst', oficina: 'oficinaFirst', garagem: 'garagemFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _d = STORY.doorMsg; STORY.doorMsg = async e => e.msg === 'portao5' ? STORY.portao5(e) : _d(e); }
{ const _os = STORY.onStep3; STORY.onStep3 = function () {
  if (_os && _os()) return true;
  if (WD.id === 'manobras' && !G.flags.marenDone && WD.y <= 3) { runScript(STORY.maren5); return true; }
  if (WD.id === 'garagem' && !G.flags.jorgeDone && WD.x >= 6) { runScript(STORY.jorge); return true; }
  return false; }; }
{ const _es = endScreen; endScreen = function (ch) { if (ch !== 5) return _es(ch); playMusic('ending');
    const w = { type: 'end', t: 0, update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
      draw() { bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); const a = Math.min(1, this.t / 60);
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 96, 26, 48, 48); bx.globalAlpha = 1;
        txt('FIM DO CAPÍTULO 5', 120, 84, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
        txt('O Motorista', 120, 104, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Técnicas: ${(G.tech || []).length} · Diário: ${G.flags.jorgePages || 0}/2`, `Tempo: ${fmtTime(G.time)}`, G.flags.tiagoTaken ? 'Tiago foi junto com o Seu Jorge' : 'Tiago ficou com você'];
        L.forEach((l, i) => txt(l, 120, 128 + i * 12, { align: 'center', col: i === 3 ? '#8fe3ff' : '#ffffff', alpha: clamp((this.t - 40) / 40, 0, 1) }));
        txt('Próximo: Capítulo 6 — Almas do 31', 120, 186, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
        if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' }); } };
    return openWin(w); }; }
// depois do fim do capítulo, o 31 some da garagem
{ const _st = solidTile; solidTile = function (c) { if (c === 'V' && WD.id === 'garagem' && G.flags.jorgeDone) return false; return _st(c); }; }
{ const _tc = tileCanvasFor; tileCanvasFor = function (c, x, y) { if (c === 'V' && WD.id === 'garagem' && G.flags.jorgeDone) return TILE['.' + (hash(x, y) % 4)]; return _tc(c, x, y); }; }
