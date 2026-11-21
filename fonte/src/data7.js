// ================= CAPÍTULO 7: O SELADO =================
// Atrás da Porta Redonda: o Mar de Âmbar, a Barca da Viagem Zero e o Lacre que prende o Selado.
// Mecânicas: CRISTAIS DE ALMA + ESPAÇO NA TAMPA (você não consegue levar todo mundo), LADRÕES DE ÂMBAR,
// CARIMBOS do Lacre Real, e o 5º grau (Arca da Origem ou Mímico Vazio), escolhido pela história.

// ---------- 5º grau ----------
const GROW5F = { mhp: 12, mmp: 2, atk: 4, def: 3, mag: 1 }, GROW5A = { mhp: 8, mmp: 6, atk: 1, def: 2, mag: 4 };
const line5 = () => G.flags.line5 || (SPECIES[G.flags.prev4] && SPECIES[G.flags.prev4].grow === GROW4A ? 'a' : 'f');
const prev4 = () => SPECIES[G.flags.prev4] || {};
Object.assign(SPECIES, {
  arca: { tier: 5, name: 'Arca da Origem', sp: 'mimicArca', bonus: { mhp: 60, mmp: 12, atk: 10, def: 8, mag: 10 }, tag: 'Origem',
    get grow() { return line5() === 'a' ? GROW5A : GROW5F; }, get bite() { return line5() === 'a' ? 1 : 1.5; }, get guard() { return line5() === 'a' ? 0.85 : 0.6; },
    get discount() { return line5() === 'a' ? 1 : 0; }, get passive() { return prev4().passive; }, get passive2() { return prev4().passive2; },
    desc: ['Aceita ser o novo Catálogo', 'Muito mais forte', 'Carrega 6 almas', 'Técnica: Dilúvio'] },
  vazio: { tier: 5, name: 'Mímico Vazio', sp: 'mimicVazio', bonus: { mhp: 30, mmp: 10, atk: 5, def: 4, mag: 5 }, tag: 'Vazio',
    get grow() { return line5() === 'a' ? GROW5A : GROW5F; }, get bite() { return line5() === 'a' ? 1 : 1.4; }, get guard() { return line5() === 'a' ? 0.85 : 0.65; },
    get discount() { return line5() === 'a' ? 1 : 0; }, get passive() { return prev4().passive; }, get passive2() { return prev4().passive2; },
    desc: ['Abre mão das memórias', 'Imune a esquecer e silêncio', 'Carrega 10 almas', 'Técnica: Nada'] }
});
for (const k of ['bastiao', 'abismo', 'ferrao', 'carniceiro', 'biblioteca', 'proibido', 'eclipse', 'constelacao']) Object.assign(SPECIES[k], { evoLv: 999, evos: ['arca', 'vazio'] });
Object.assign(LINE_TECH, { arca: ['diluvio'], vazio: ['nada'] });
Object.assign(TECH, {
  diluvio: { name: 'Dilúvio', cd: 4, desc: 'As almas que você carrega saem da tampa como uma onda dourada: todos os inimigos, mais forte para cada alma carregada.',
    async use() { const n = Math.max(1, carry().length), log = []; for (const e of BT.en.filter(e => e.alive && e.hp > 0)) { const d = Math.max(1, Math.round((G.st.atk * 0.55 + G.st.mag * 0.55) * (0.8 + n * 0.15) * rand(0.9, 1.1) - e.def * 0.5)); hitEnemy(e, d, 'hit', '#f0c040'); log.push(`* ${e.name}: ${d}.`); } await bSay(`* ${n > 1 ? `${n} almas` : 'Uma alma'} saem da sua tampa como uma onda de âmbar.\n` + log.slice(0, 4).join('\n'), { auto: 60 }); } },
  nada: { name: 'Nada', cd: 3, desc: 'Você fica tão vazio que o próximo golpe atravessa você e volta inteiro para quem bateu.',
    async use() { BT.nothing = 1; sfx('rune'); await bSay('* Você abre a tampa. Lá dentro não tem nada. Nem você.', { auto: 45 }); } }
});
// o Nada anula o próximo golpe e devolve o dano
{ const _h = hurt; hurt = function (e, pow, mult, res, o) {
  if (BT.nothing > 0 && mult > 0 && e && e.alive) {
    BT.nothing = 0; const am = e.atkBuff && e.atkBuff.t > 0 ? e.atkBuff.m : 1; const d = Math.max(1, Math.round(e.atk * am * pow * 60 / (60 + e.def)));
    hitEnemy(e, d, 'crit', '#c0c8d8'); BT.nums.push({ x: BPX, y: BPY - 52, s: 'NADA', col: '#c0c8d8', t: 50 }); sfx('guard'); return 0;
  }
  if (BT.amberShell > 0 && mult > 0) { BT.amberShell--; mult *= 0.5; BT.nums.push({ x: BPX, y: BPY - 52, s: 'ÂMBAR', col: '#f0c040', t: 40 }); }
  return _h(e, pow, mult, res, o);
}; }
// o Vazio não guarda nada: nem esquecimento, nem silêncio
{ const _gs = giveStatus; giveStatus = function (st, turns, mv) { if (G.species === 'vazio' && (st === 'forget' || st === 'silence')) return 'Não tem nada aí dentro para esquecer ou calar.'; return _gs(st, turns, mv); }; }
// ---------- espaço na tampa ----------
function carry() { if (!G.flags.carry) G.flags.carry = []; return G.flags.carry; }
function carryCap() { return G.species === 'arca' ? 6 : G.species === 'vazio' ? 10 : 3; }
const CRYSTALS = {
  kaua: { n: 'Kauã', seat: 26, t: 'Dezenove anos. Trabalhava de madrugada numa padaria e dormia no fundo do ônibus. No bolso, um bilhete da Profª Neide: "Não acordar. Ele trabalha."' },
  zelia: { n: 'Dona Zélia', seat: 3, t: 'Costureira. No colo, uma caixa com um vestido de noiva que ela ia entregar no sábado. A noiva nunca soube por que o vestido não chegou.' },
  benedito: { n: 'Seu Benedito', seat: 8, t: 'Porteiro de prédio. Um rádio de pilha que só pega jogo. Ele ainda está ouvindo o segundo tempo.' },
  priscila: { n: 'Priscila', seat: 18, t: 'Enfermeira, saindo de um plantão de trinta e seis horas. Ainda de crachá. Dormiu sentada e acordou aqui.' },
  teo: { n: 'Téo', seat: 24, t: 'Entregador de aplicativo. Na mochila térmica, uma pizza que ainda está quente, novecentos metros de âmbar depois.' },
  luzia: { n: 'Irmã Luzia', seat: 11, t: 'Freira que contava piada ruim para quem estivesse triste no ponto. "Sabe por que o ônibus não tem medo? Porque ele tem passe livre."' },
  rafael: { n: 'Rafael', seat: 27, t: 'Ia pedir a namorada em casamento naquela noite. O anel está na mão dele, fechada com força.' },
  nilo: { n: 'Velho Nilo', seat: null, t: 'Não é do 31. É o cozinheiro da barca da Viagem Zero, novecentos anos atrás. Ele ainda segura uma concha de sopa. Ninguém veio buscar a viagem dele.' },
  ozorio: { n: 'Seu Ozório', seat: 9, cond: () => G.flags.soul_ozorio === 'perdido', t: 'O pasteleiro. O caderno de fiado está aberto no colo dele, na página da Bia.' },
  neide: { n: 'Profª Neide', seat: 15, cond: () => G.flags.soul_neide === 'perdido', t: 'A professora. Ela segura trinta e duas redações sem nota.' },
  cida: { n: 'Dona Cida', seat: 7, cond: () => G.flags.soul_cida === 'perdida', t: 'A gata de óculos dourados. Os óculos estão no chão do cristal, fora do alcance da pata.' }
};
STORY.cristal7 = async function (e) {
  const c = CRYSTALS[e.who], C = carry(), cap = carryCap();
  if (G.flags.crossBack) { await say('* O cristal ficou para trás. Você não volta mais aqui.'); return; }
  await say(`* Um pilar de âmbar. Dentro dele, alguém de olhos fechados.\n* {y}${c.n}{/}${c.seat != null ? `, banco ${c.seat}` : ''}.`);
  await say('* ' + c.t);
  const opts = C.length < cap ? ['Levar na tampa', 'Deixar'] : ['Trocar por alguém que você carrega', 'Deixar'];
  const i = await choose(`* Espaço na tampa: ${C.length}/${cap}.`, opts, 'n', 1);
  if (i !== 0) return;
  if (C.length >= cap) {
    const names = C.map(k => CRYSTALS[k].n);
    const j = await choose('* Quem você deixa no lugar?', [...names, 'Ninguém'], 'n', names.length);
    if (j < 0 || j >= names.length) return;
    const out = C.splice(j, 1)[0]; delete G.flags['carry_' + out];
    await say(`* Você devolve ${CRYSTALS[out].n} ao âmbar, com cuidado. O cristal volta a ficar inteiro, no mesmo lugar.`);
  }
  C.push(e.who); G.flags['carry_' + e.who] = true; refreshEnts(); sfx('item');
  await say(`* Você abre a tampa e o cristal entra, devagar. Pesa como uma mala de viagem. (${C.length}/${cap})`);
  if (C.length === 1 && !G.flags.tut_carry) { G.flags.tut_carry = true; sfx('catalog'); await say('[ESPAÇO NA TAMPA: você só consegue levar algumas almas. Quem você levar acorda do outro lado da porta. Quem ficar, fica. Dá para trocar enquanto você não voltar pela fechadura.]', 'cat'); await say('[Cuidado com os LADRÕES DE ÂMBAR: eles roubam o que você carrega.]', 'cat'); }
};

// ---------- ladrões de âmbar ----------
AI.ladrao = async function (e) {
  const C = carry();
  if (!e.stolen && C.length && Math.random() < 0.55) {
    await bSay('* O Ladrão de Âmbar enfia a mão na sua tampa!', { auto: 30 });
    const f = await mash(16, 110);
    hurt(e, 0.8, f >= 1 ? 0.25 : 1 - 0.6 * f, f >= 1 ? 'good' : 'fail');
    if (f >= 1) { await bSay('* Você fecha a tampa na mão dele. Ele recua, sacudindo os dedos.', { auto: 45 }); return; }
    const k = pickOne(C); C.splice(C.indexOf(k), 1); e.stolen = k;
    await bSay(`* O Ladrão arrancou o cristal de {y}${CRYSTALS[k].n}{/} da sua tampa! Derrote ele para pegar de volta.`, { auto: 55 });
    return;
  }
  if (e.stolen && Math.random() < 0.35 && e.turns > 2) { e.fleeing = true; e.alive = false; e.dying = 20; sfx('flee'); delete G.flags['carry_' + e.stolen]; refreshEnts(); await bSay(`* O Ladrão mergulha no âmbar com o cristal. Ele vai largar o ${CRYSTALS[e.stolen].n} no mesmo pilar de onde tirou. Dá para buscar de novo.`, { auto: 60 }); e.stolen = null; return; }
  return runMove(e, pickMove(e, e.d.moves));
};
{ const _kd = killDead; killDead = async function () {
  for (const e of BT.en) if (e.stolen && e.hp <= 0 && e.alive) { carry().push(e.stolen); await bSay(`* O cristal de {y}${CRYSTALS[e.stolen].n}{/} rola de volta para a sua tampa.`, { auto: 40 }); e.stolen = null; }
  return _kd();
}; }
{ const _b = battle; battle = async function (group, opts) {
  const r = await _b(group, opts);
  for (const e of BT.en || []) if (e.stolen) { delete G.flags['carry_' + e.stolen]; e.stolen = null; refreshEnts(); }
  return r;
}; }

// ---------- runas ----------
Object.assign(RUNES, {
  ambar: { name: 'Âmbar', type: 'el', col: '#f0c040', pow: 11, desc: 'Lembrança cristalizada. 25% de prender inimigos comuns por 1 turno. Véu: casca que divide os próximos 2 golpes.' },
  chave: { name: 'Chave', type: 'form', col: '#f2ecdc', mult: 1, cost: 4, desc: 'Um alvo. Arranca casca, sumiço e força do inimigo, e abre fechaduras no mapa.' }
});
Object.assign(RUNE_RAR, { ambar: 'rara', chave: 'rara' });
Object.assign(MAP_D, { antessala7: 18, cais: 18, conves: 19, porao: 19, cela: 20 });
EL_COL.ambar = '#f0c040';
EP.ambar = ['#7a4a08', '#c8962a', '#f0c040', '#fff4c0'];
{ const _cs = castSpell; castSpell = async function (sp, target) {
  await _cs(sp, target);
  if (!BT.on) return;
  if (sp.el === 'ambar' && sp.form !== 'veu') { const al = BT.en.filter(e => e.alive && e.hp > 0 && !e.d.boss && !e.skip); if (al.length && Math.random() < 0.25) { const t = pickOne(al); t.skip = '* O % está preso numa casca de âmbar. Perdeu o turno.'; await bSay(`* O ${t.name} fica preso no âmbar!`, { auto: 40 }); } }
  if (sp.form === 'chave' && target && target.alive) {
    const had = target.shell > 0 || target.hide > 0 || (target.atkBuff && target.atkBuff.t > 0);
    target.shell = 0; target.hide = 0; target.atkBuff = null;
    if (target.stamp) { target.stamp = null; await bSay('* A chave gira dentro do carimbo. CLIC. Carimbo anulado.', { auto: 45 }); }
    else if (had) await bSay(`* CLIC. A chave abre as proteções do ${target.name}.`, { auto: 40 });
  }
}; }
{ const _cs = castSpell; castSpell = async function (sp, target) {
  if (sp.form === 'veu' && sp.el === 'ambar') { BT.lastSpell = sp; pbPose('open', 26, { glow: RUNES.ambar.col }); await bSay(`* Você conjura {y}${sp.name}{/}!`, { auto: 22 }); sfx('buff'); await fxAura('ambar'); BT.amberShell = sp.mod === 'eco' ? 4 : 2; await bSay(`* Uma casca de âmbar cobre a sua tampa. Os próximos ${BT.amberShell} golpes saem pela metade.`, { auto: 50 }); return; }
  return _cs(sp, target);
}; }

// ---------- itens ----------
Object.assign(ITEMS, {
  bala: { name: 'Bala de Âmbar', hp: 220, cure: true, desc: 'Cura 220 PV e os efeitos ruins. Doce, com gosto de lembrança de outra pessoa.' },
  agua: { name: 'Água do Cais', mp: 60, desc: 'Recupera 60 PM. Fria, de um poço que ninguém lembra de ter cavado.' }
});

// ---------- sprites ----------
const S7 = {
  peixe: f => cv4(16, 16, r => { r(2, 5, 12, 7, 'k'); r(3, 6, 10, 5, '#e0a030'); r(3, 6, 10, 2, '#f0c040'); r(0, 4 + f, 3, 3, 'k'); r(0, 9 - f, 3, 3, 'k'); r(1, 5 + f, 2, 1, '#c8962a'); r(1, 10 - f, 2, 1, '#c8962a'); r(10, 7, 2, 2, '#ffffff'); r(11, 7, 1, 1, 'k'); r(13, 9, 2, 1, 'k'); for (const x of [5, 7, 9]) r(x, 8, 1, 2, '#c8962a'); r(6, 3, 4, 2, 'k'); r(7, 3, 2, 1, '#fff4c0'); }),
  gaivota: f => cv4(16, 16, r => { r(5, 6, 7, 5, 'k'); r(6, 7, 5, 3, '#e8dcc0'); r(11, 5, 4, 4, 'k'); r(12, 6, 2, 2, '#f2ecdc'); r(13, 6, 1, 1, 'k'); r(15, 7, 1, 1, '#f07830'); r(0, 4 - f * 2, 6, 3, 'k'); r(1, 5 - f * 2, 5, 1, '#c8c0a8'); r(10, 2 + f * 2, 4, 3, 'k'); r(11, 3 + f * 2, 3, 1, '#c8c0a8'); r(7, 11, 1, 2, '#f07830'); r(9, 11, 1, 2, '#f07830'); r(3, 8, 3, 2, '#f0c040'); }),
  ancoraviva: f => cv4(16, 16, r => { r(6, 0, 4, 4, 'k'); r(7, 1, 2, 2, '#07050c'); r(7, 3, 2, 10, 'k'); r(3, 4, 10, 2, 'k'); r(4, 4, 8, 1, '#8a8099'); r(7, 4, 2, 9, '#6a6078'); r(1, 10, 3, 3, 'k'); r(12, 10, 3, 3, 'k'); r(2, 12, 12, 3, 'k'); r(3, 12, 10, 2, '#6a6078'); r(1, 10, 2, 2, '#8a8099'); r(13, 10, 2, 2, '#8a8099'); r(5, 7, 1, 1, '#f0c040'); r(10, 7, 1, 1, '#f0c040'); r(6, 9 + f, 4, 1, '#120e1a'); r(4, 13, 2, 1, '#e0a030'); }),
  cristal: f => cv4(16, 16, r => { r(3, 0, 10, 16, 'k'); r(4, 1, 8, 15, '#c8962a'); r(5, 1, 3, 15, '#f0c040'); r(5, 1, 1, 15, '#fff4c0'); r(6, 4, 4, 4, '#7a4a08'); r(7, 5, 2, 2, '#e8b890'); r(6, 8, 4, 6, '#7a4a08'); r(11, 2 + f * 6, 1, 3, '#ffffff'); }),
  fechadura: f => cv4(16, 16, r => { r(3, 0, 10, 16, 'k'); r(4, 1, 8, 14, '#5a5048'); r(4, 1, 8, 1, '#8a7a68'); r(6, 4, 4, 4, '#07050c'); r(7, 7, 2, 5, '#07050c'); r(7 + f, 5, 1, 1, '#f0c040'); r(5, 13, 6, 1, '#f0c040'); }),
  manifesto: f => cv4(16, 16, r => { r(2, 2, 12, 13, 'k'); r(3, 3, 10, 11, '#d8c8a0'); for (let y = 5; y < 13; y += 2) r(4, y, 6 + (y % 3), 1, '#7a6a50'); r(10, 10 + f, 3, 3, '#c8962a'); r(11, 11 + f, 1, 1, '#07050c'); }),
  timoneiroW: f => cv4(16, 16, r => { r(3, 1, 10, 3, 'k'); r(4, 1, 8, 2, '#1c3058'); r(4, 4, 8, 6, 'k'); r(5, 5, 6, 4, '#a8c0c8'); r(6, 6, 1, 1, '#f0c040'); r(9, 6, 1, 1, '#f0c040'); r(4, 10, 8, 6, 'k'); r(5, 11, 6, 5, '#3a4a5a'); r(1, 8 + f, 4, 4, 'k'); r(2, 9 + f, 2, 2, '#7a4a2a'); }),
  capitaoW: f => cv4(16, 16, r => { r(2, 0, 12, 4, 'k'); r(3, 1, 10, 2, '#2a1a10'); r(6, 0, 4, 1, '#f0c040'); r(4, 4, 8, 6, 'k'); r(5, 5, 6, 4, '#e8e4dc'); r(6, 6, 1, 1, '#07050c'); r(9, 6, 1, 1, '#07050c'); r(6, 8, 4, 1, '#07050c'); r(3, 10, 10, 6, 'k'); r(4, 11, 8, 5, '#5a1a1a'); r(7, 11, 2, 4, '#f0c040'); r(13, 8 - f, 2, 6, '#c0c8d0'); }),
  lacreW: f => cv4(16, 16, r => { r(1, 2, 14, 13, 'k'); r(2, 3, 12, 11, '#a82828'); r(2, 3, 12, 2, '#c84040'); r(5, 6, 6, 5, '#7a1a1a'); r(7, 7, 2, 3, '#f0c040'); r(6 + f, 8, 1, 1, '#ffffff'); r(0, 6, 2, 3, '#a82828'); r(14, 9, 2, 3, '#a82828'); }),
  moca: f => cv4(16, 16, r => { r(4, 1, 8, 15, 'k'); r(5, 2, 6, 14, '#c8962a'); r(5, 2, 6, 4, '#f0c040'); r(6, 4, 1, 1, '#ffffff'); r(9, 4, 1, 1, '#ffffff'); r(5, 8, 6, 8, '#e0a030'); r(3 + f, 10, 2, 5, '#c8962a'); })
};
function buildSprites7() {
  for (const k of ['peixe', 'gaivota', 'ancoraviva', 'cristal', 'fechadura', 'manifesto', 'timoneiroW', 'capitaoW', 'lacreW', 'moca']) SP[k] = [S7[k](0), S7[k](1)];
  const add = (c, fn) => { fn(c.getContext('2d')); return c; };
  const R = (x, a, b, w, h, col) => { x.fillStyle = PAL[col] || col; x.fillRect(a, b, w, h); };
  const two = (map, fn) => [0, 1].map(f => add(hum(map), x => fn && fn(x, f)));
  SP.ladrao = two({ G: '#3a3448', m: '#2a2438', l: '#3a3448', S: '#c8a070', h: '#2a1a10', y: '#f0c040' }, (x, f) => { R(x, 5, 4, 6, 2, '#07050c'); R(x, 12, 9 + f, 4, 5, '#5a4a3a'); R(x, 13, 10 + f, 2, 2, '#f0c040'); });
  SP.marujo = two({ G: '#3a5a7a', m: '#e8e4dc', l: '#ffffff', S: '#a8c0c8', h: '#3a4a5a', y: '#c8c0a8' }, (x, f) => { for (let i = 0; i < 4; i++) R(x, 5, 8 + i * 2, 6, 1, '#e8e4dc'); R(x, 13, 5 - f, 2, 8, '#a89068'); });
  SP.lacaio = two({ G: '#a82828', m: '#7a1a1a', l: '#c84040', S: '#e0b8a0', h: '#7a1a1a', y: '#f0c040' }, (x, f) => { R(x, 12, 6 + f * 2, 4, 3, '#5a3420'); R(x, 12, 9 + f * 2, 4, 2, '#c83838'); });
  SP.afogado = two({ G: '#c8962a', m: '#7a4a08', l: '#e0a030', S: '#f0c040', h: '#7a4a08', y: '#fff4c0' }, (x, f) => { R(x, 5, 5, 2, 1, '#7a4a08'); R(x, 9, 5, 2, 1, '#7a4a08'); R(x, 3 + f, 12, 10, 1, '#f0c040'); });
  // as formas de 5º grau no mapa
  makeMimicSet('mimicArca', { o: 'y', n: 's', b: 'n', l: 'w', y: 'c' });
  makeMimicSet('mimicVazio', { o: 'l', n: 'm', b: 'd', l: 'w', y: 'w' });
  const deco = (key, fn) => { const all = new Set([...SP[key], ...Object.values(SPD[key]).flat()]); for (const c of all) fn(c.getContext('2d')); };
  deco('mimicArca', x => { x.fillStyle = PAL.y; x.fillRect(5, 0, 6, 1); x.fillRect(7, 0, 2, 2); x.fillStyle = PAL.c; x.fillRect(4, 12, 1, 1); x.fillRect(11, 12, 1, 1); x.fillRect(7, 13, 2, 1); });
  deco('mimicVazio', x => { x.clearRect(5, 11, 6, 2); x.fillStyle = PAL.d; x.fillRect(4, 11, 1, 2); x.fillRect(11, 11, 1, 2); });
}
// tiles: u = âmbar líquido (mar), Z = pedra da Porta Redonda (antes era 'G', que colidia com o Portão de Musgo do Cap. 1)
function buildTiles7(T) {
  TILE.u = tileCanvas((x, R) => { x.fillStyle = '#7a4a08'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#a86a10'; for (let i = 0; i < 5; i++) x.fillRect(Math.floor(R() * 14), Math.floor(R() * 15), 3, 1); x.fillStyle = '#f0c040'; x.fillRect(Math.floor(R() * 14), Math.floor(R() * 15), 2, 1); }, 701);
  TILE.u2 = tileCanvas((x, R) => { x.fillStyle = '#7a4a08'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#a86a10'; for (let i = 0; i < 5; i++) x.fillRect(Math.floor(R() * 14), Math.floor(R() * 15), 3, 1); x.fillStyle = '#f0c040'; x.fillRect(Math.floor(R() * 14), Math.floor(R() * 15), 2, 1); }, 701);
  TILE.Z = tileCanvas((x, R) => { x.fillStyle = '#3a342e'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#4e4640'; x.fillRect(1, 1, 14, 14); x.fillStyle = '#2a2420'; x.fillRect(0, 7, 16, 1); x.fillRect(7, 0, 1, 16); if (R() < 0.5) { x.fillStyle = '#c8962a'; x.fillRect(3 + Math.floor(R() * 8), 3 + Math.floor(R() * 8), 2, 2); } }, 702);
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites7(); buildBoss7(); buildPorts7(); }; }
{ const _bt = buildTiles; buildTiles = function (theme) { _bt(theme); buildTiles7(theme || {}); }; }
{ const _st = solidTile; solidTile = function (c) { if ('uZ'.includes(c)) return true; return _st(c); }; }
{ const _tc = tileCanvasFor; tileCanvasFor = function (c, x, y) { if (c === 'u') return Math.floor(FRAME / 40 + (x * 3 + y) * 0.3) % 3 === 0 ? TILE.u2 : TILE.u; return _tc(c, x, y); }; }
Object.assign(LOOK, {
  u: ['* Âmbar líquido, morno, até onde a vista alcança. De perto, dá para ver rostos lá dentro, bem fundo, devagar.', '* O âmbar se mexe como mel. Ele cheira a fim de tarde.', '* Você vê um guarda-chuva boiando no âmbar. Depois, um sapato. Depois, nada.'],
  Z: ['* A pedra da Porta Redonda. Fria. Tem trinta e uma fechaduras entalhadas, cada uma com um número.', '* No centro da porta, um entalhe gasto: uma lanterna com um olho dentro.']
});
Object.assign(LOOK_K, { antessala: ['* Caixotes da resistência: velas de rato, cogumelos secos, potes de tinta. Tudo etiquetado pelo Musgo: "NOSSO".', '* Mantimentos que a Rita "achou". Ninguém pergunta onde.'], cais: ['* Caixotes de carga da barca, inchados de âmbar. A etiqueta é numa língua que você não conhece, mas o desenho é claro: frágil.'], conves: ['* Barris de água doce de novecentos anos. Vazios.', '* Cordas enroladas, duras como pedra.'], porao: ['* Caixotes empilhados até o teto. Um deles tem o mesmo desenho do brasão de Auren.', '* Correntes, muitas. Para quem?'] });
Object.assign(K_REGION, { antessala7: 'antessala', cais: 'cais', conves: 'conves', porao: 'porao', cela: 'porao' });

// ---------- chefes grandes ----------
const BIGSP7 = {
  // O Timoneiro: marinheiro de âmbar, preso ao próprio leme
  timoneiro: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, coat = '#1c3058', coatH = '#3a5a8a', skin = '#a8c0c8', amb = '#f0c040', ambD = '#c8962a';
    // leme gigante atrás (gira)
    EO(24, 30, 18, 18, '#5a3420'); E(24, 30, 15, 15, '#07050c'); E(24, 30, 4, 4, '#7a4a2a'); E(24, 30, 2, 2, amb);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + f * Math.PI / 16; L(24 + Math.cos(a) * 4, 30 + Math.sin(a) * 4, 24 + Math.cos(a) * 21, 30 + Math.sin(a) * 21, '#7a4a2a', 2); E(24 + Math.cos(a) * 21, 30 + Math.sin(a) * 21, 2, 2, '#5a3420'); }
    // corpo de casaco de marinheiro
    r(15, 18, 18, 26, 'k'); r(16, 19, 16, 25, coat); r(16, 19, 3, 25, coatH); for (const y of [24, 30, 36]) { r(20, y, 2, 2, amb); r(26, y, 2, 2, amb); }
    // cristais de âmbar crescendo no ombro e no braço
    for (const [x, y, h] of [[14, 18, 6], [12, 22, 4], [33, 20, 5]]) { r(x, y - h, 3, h, 'k'); r(x + 1, y - h + 1, 1, h - 1, amb); }
    // cabeça e chapéu
    EO(24, 13, 6, 7, skin); r(20, 11, 3, 2, '#1c3058'); r(26, 11, 3, 2, '#1c3058'); r(21, 11, 1, 1, '#ffffff'); r(27, 11, 1, 1, '#ffffff');
    r(19, 16, 10, 2, '#e8e4dc'); r(18, 15, 2, 2, '#e8e4dc'); r(28, 15, 2, 2, '#e8e4dc'); r(23, 18 + (f % 2), 2, 1, '#5a7a8a');
    r(15, 2, 18, 6, 'k'); r(16, 3, 16, 4, '#1c3058'); r(13, 7, 22, 2, 'k'); r(22, 3, 4, 3, amb);
    // mãos no leme
    r(10, 26 + (f % 2), 5, 4, 'k'); r(11, 27 + (f % 2), 3, 2, skin); r(33, 26 - (f % 2), 5, 4, 'k'); r(34, 27 - (f % 2), 3, 2, skin);
    // âmbar escorrendo
    r(18, 44, 2, 3 + f, ambD); r(28, 44, 2, 2 + (3 - f), ambD);
  }),
  // O Capitão: esqueleto de casaca vermelha, chapéu de três pontas, luneta e uma corrente com cadeados
  capitao: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, red = '#8a1a1a', redH = '#c83838', bone = '#e8e4dc', boneD = '#b8b4ac', gold = '#f0c040';
    r(14, 20, 20, 26, 'k'); r(15, 21, 18, 25, red); r(15, 21, 3, 25, redH); r(22, 21, 4, 25, '#3a1010'); for (const y of [24, 29, 34, 39]) { r(20, y, 2, 2, gold); r(26, y, 2, 2, gold); }
    r(14, 20, 6, 3, gold); r(28, 20, 6, 3, gold); for (let i = 0; i < 6; i++) r(14 + i, 23, 1, 2 + (i % 2), gold);
    // corrente de cadeados em diagonal
    for (let i = 0; i < 6; i++) { const x = 15 + i * 3, y = 22 + i * 4; E(x, y, 2, 1, '#8a8099'); if (i % 2) { r(x - 1, y + 1, 3, 3, 'k'); r(x, y + 2, 1, 1, gold); } }
    // caveira
    EO(24, 12, 7, 8, bone); E(24, 15, 6, 4, boneD); r(19, 9, 4, 4, '#07050c'); r(26, 9, 4, 4, '#07050c'); r(20, 10, 1, 1, f % 2 ? '#ff5050' : '#a82828'); r(27, 10, 1, 1, f % 2 ? '#ff5050' : '#a82828');
    r(23, 14, 2, 2, '#07050c'); for (let i = 0; i < 5; i++) r(20 + i * 2, 17, 1, 2, '#07050c');
    // chapéu de três pontas
    r(12, 0, 24, 7, 'k'); r(13, 1, 22, 5, '#2a1a10'); r(13, 5, 22, 1, gold); r(21, 1, 6, 4, gold); r(23, 2, 2, 2, '#07050c'); r(9, 4, 4, 3, 'k'); r(35, 4, 4, 3, 'k');
    // braço com a luneta
    L(33, 24, 42, 16 - f, 'k', 4); L(33, 24, 42, 16 - f, red, 2); r(40, 10 - f, 7, 4, 'k'); r(41, 11 - f, 5, 2, '#c8962a'); r(46, 11 - f, 1, 2, '#bfe8f0');
    // braço com o sabre
    L(15, 24, 6, 32 + (f % 2), 'k', 4); L(15, 24, 6, 32 + (f % 2), red, 2); L(6, 32 + (f % 2), 2, 44, '#c0c8d0', 2); r(5, 31 + (f % 2), 4, 2, gold);
  }),
  // O Lacre Real: um selo de cera vivo, com o brasão da lanterna com um olho, carimbos nas mãos e uma fita de papel
  lacre: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, wax = '#a82828', waxH = '#d04848', waxD = '#6a1414', gold = '#f0c040';
    // fita de papel atrás
    for (let i = 0; i < 10; i++) r(2 + i * 4, 38 + Math.round(Math.sin(i + f) * 2), 4, 6, i % 2 ? '#e8dcc0' : '#d8c8a0');
    // corpo de cera, com bordas escorridas
    EO(24, 24, 18, 17, wax); E(24, 28, 16, 12, waxD); E(24, 22, 16, 14, wax); E(19, 15, 6, 3, waxH);
    for (const [x, h] of [[9, 6], [15, 9], [33, 7], [39, 5]]) { r(x, 36, 4, h + (f % 2), 'k'); r(x + 1, 36, 2, h + (f % 2), wax); }
    // brasão: lanterna com um olho (o carimbo da Coroa)
    EO(24, 24, 9, 9, waxD); r(20, 18, 8, 2, gold); r(21, 20, 6, 9, 'k'); r(22, 21, 4, 7, '#fff4c0'); E(24, 24, 2, 2, '#07050c'); r(24, 23, 1, 1, f === 3 ? '#07050c' : '#ffffff'); r(21, 29, 6, 2, gold); r(23, 16, 2, 2, gold);
    // olhos de burocrata
    r(14, 14, 4, 3, '#ffffff'); r(30, 14, 4, 3, '#ffffff'); r(15, 15, 2, 2, '#07050c'); r(31, 15, 2, 2, '#07050c'); r(13, 12, 6, 1, waxD); r(29, 12, 6, 1, waxD);
    // mãos com carimbos (um sobe, o outro desce)
    const up = [0, 3, 6, 3][f];
    r(0, 12 + up, 9, 7, 'k'); r(1, 13 + up, 7, 3, '#5a3420'); r(1, 16 + up, 7, 2, '#c83838'); L(8, 18 + up, 10, 24, waxD, 3);
    r(39, 18 - up, 9, 7, 'k'); r(40, 19 - up, 7, 3, '#5a3420'); r(40, 22 - up, 7, 2, '#3a70c0'); L(39, 24 - up, 38, 26, waxD, 3);
    // "INDEFERIDO" na fita
    r(18, 40, 12, 1, '#c83838');
  })
};
function buildBoss7() { SP.timoneiroB = BIGSP7.timoneiro(); SP.capitaoB = BIGSP7.capitao(); SP.lacreB = BIGSP7.lacre(); }
function buildPorts7() {
  PORT.moca = pcv((r, fr) => { r(6, 4, 20, 28, 'k'); r(7, 5, 18, 27, '#c8962a'); r(7, 5, 18, 6, '#f0c040'); r(9, 12, 14, 12, '#e0a030'); if (fr === 2) { r(11, 16, 4, 1, '#7a4a08'); r(17, 16, 4, 1, '#7a4a08'); } else { r(11, 15, 4, 3, '#fff4c0'); r(17, 15, 4, 3, '#fff4c0'); r(12, 16, 2, 2, '#7a4a08'); r(18, 16, 2, 2, '#7a4a08'); } r(14, 20, 4, fr === 1 ? 2 : 1, '#7a4a08'); r(4, 26, 24, 6, '#c8962a'); for (const y of [8, 22, 28]) r(25, y, 2, 2, '#fff4c0'); });
  PORT.timoneiro = bust({ skin: '#a8c0c8', hair: '#1c3058', style: 'short', cloth: '#1c3058', collar: '#f0c040', eyes: '#1c3058', stache: '#e8e4dc' });
  PORT.capitao = pcv((r, fr) => { r(8, 6, 16, 18, 'k'); r(9, 7, 14, 16, '#e8e4dc'); r(11, 11, 4, 4, '#07050c'); r(17, 11, 4, 4, '#07050c'); r(12, 12, 1, 1, '#ff5050'); r(18, 12, 1, 1, '#ff5050'); r(15, 16, 2, 2, '#07050c'); for (let i = 0; i < 5; i++) r(11 + i * 2, 19, 1, fr === 1 ? 3 : 2, '#07050c'); r(4, 0, 24, 7, 'k'); r(5, 1, 22, 5, '#2a1a10'); r(13, 1, 6, 4, '#f0c040'); r(4, 25, 24, 7, 'k'); r(5, 26, 22, 6, '#8a1a1a'); r(14, 26, 4, 6, '#f0c040'); });
  PORT.lacre = pcv((r, fr) => { r(3, 3, 26, 26, 'k'); r(4, 4, 24, 24, '#a82828'); r(4, 4, 24, 4, '#d04848'); r(11, 9, 10, 14, '#6a1414'); r(13, 11, 6, 9, '#fff4c0'); r(15, 14, 2, 2, '#07050c'); r(12, 9, 8, 2, '#f0c040'); r(7, 7, 4, 2, fr === 2 ? '#a82828' : '#ffffff'); r(21, 7, 4, 2, fr === 2 ? '#a82828' : '#ffffff'); r(12, 24, 8, fr === 1 ? 3 : 1, '#3a0a0a'); });
}
for (const k of ['moca', 'timoneiro', 'capitao', 'lacre']) WHO[k] = { name: () => ({ moca: 'Moça da Barca', timoneiro: 'Timoneiro', capitao: 'Capitão', lacre: 'Lacre Real' })[k], portrait: t => portFrame(k, t), voice: ({ moca: () => sfx('blipTri', 700), timoneiro: () => sfx('blipLow', 110), capitao: () => sfx('blipLow', 80), lacre: () => sfx('blip', 300) })[k], col: ({ moca: '#ffe9a0', lacre: '#ffb0b0' })[k] };
WHO.lacre.fx = 'shake';

// ---------- música ----------
Object.assign(TRACKS, {
  antessala: { bpm: 92, bars: 4, chords: 'Em C G D', bass: 'root5', bassVol: 0.1, lead: 'B4:4 E5:4 G5:6 F#5:2 | E5:4 C5:4 E5:8 | D5:4 G5:4 B5:6 A5:2 | F#5:8 D5:8', leadWave: 'triangle', leadVol: 0.07, arp: { rate: 2, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.......k...h...', hatVol: 0.015 },
  ambar: { bpm: 72, bars: 4, chords: 'Dm7 Bbmaj7 Gm7 A7', bass: 'whole', bassVol: 0.08, lead: 'A5:6 F5:2 D5:8 | D6:6 Bb5:2 F5:8 | G5:4 Bb5:4 D6:6 C6:2 | C#6:8 E5:8', leadWave: 'triangle', leadVol: 0.06, pad: true, padVol: 0.03, arp: { rate: 2, vol: 0.012, pat: [0, 2, 1, 3] } },
  barca: { bpm: 108, bars: 4, chords: 'Am Am Dm E', bass: 'root5', bassVol: 0.12, lead: 'E5:2 A5:2 A5:2 B5:2 C6:4 B5:4 | A5:2 E5:2 E5:2 C5:2 A4:8 | D5:2 F5:2 A5:2 F5:2 D5:4 F5:4 | E5:4 G#5:4 B5:8', leadWave: 0.25, leadVol: 0.06, drums: 'k..hk.h.k..hk.hh', hatVol: 0.02 },
  cela: { bpm: 56, bars: 4, chords: 'Cm Ab Fm G', bass: 'whole', bassVol: 0.07, lead: 'G5:8 Eb5:8 | C5:8 Eb5:4 D5:4 | F5:8 Ab5:4 G5:4 | G5:12 .:4', leadWave: 'triangle', leadVol: 0.05, pad: true, padVol: 0.03 },
  boss7: { bpm: 164, bars: 8, chords: 'Em C D B Em C Am B', bass: 'oct8', bassVol: 0.17,
    lead: 'E5:2 G5:2 B5:2 E6:2 D6:4 B5:4 | C6:2 B5:2 G5:2 E5:2 G5:4 C6:4 | D6:4 A5:2 F#5:2 D5:4 F#5:4 | D#5:2 F#5:2 B5:4 A5:2 F#5:2 D#5:4 | E5:2 B5:2 E5:2 B5:2 G5:4 E5:4 | C6:4 G5:4 E5:4 C5:4 | A5:2 C6:2 E6:2 A6:2 G6:4 F#6:4 | F#6:4 D#6:4 B5:4 F#5:4',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 }
});

// ---------- inimigos ----------
Object.assign(ENEMIES, {
  peixe: { name: 'Peixe-Âmbar', sp: 'peixe', hp: 380, atk: 94, def: 20, evade: 0.2, xp: 200, weak: { brasa: 1.3, faisca: 1.3 }, drops: [['agua', .2]],
    flavor: ['* O Peixe-Âmbar pula do mar e cai de novo, devagar, como mel.', '* Ele tem um anel preso na barbatana.'],
    check: 'Pula e cai em cima. BRASA derrete, FAÍSCA atravessa o âmbar.',
    moves: [{ k: 'dodge', p: 0.5, hits: 3, spd: 1.35, w: 3, t: '* Ele salta três vezes do âmbar!' }, { k: 'ring', p: 1.1, w: 2, t: '* O Peixe-Âmbar te acerta com a cauda!' }] },
  gaivota: { name: 'Gaivota de Cera', sp: 'gaivota', hp: 340, atk: 96, def: 16, evade: 0.15, xp: 190, weak: { brasa: 1.6 }, drops: [['bala', .15]],
    flavor: ['* A Gaivota de Cera grita igual a gaivota de verdade. Pior.', '* Uma pena de cera cai e derrete no chão.'],
    check: 'Mergulhos rápidos. Feita de cera: BRASA derrete MUITO.',
    moves: [{ k: 'dodge', p: 0.6, hits: 2, spd: 1.45, w: 3, t: '* Mergulho! Ela vem de cima!' }, { k: 'ring', p: 0.9, st: 'blind', blindBy: 'tinta', w: 1, t: '* Ela joga cera quente nos seus olhos!' }] },
  ladrao: { name: 'Ladrão de Âmbar', sp: 'ladrao', hp: 440, atk: 92, def: 22, xp: 220, ai: 'ladrao', weak: { faisca: 1.3, sombra: 1.2 }, drops: [['bala', .3]],
    flavor: ['* O Ladrão de Âmbar tem um saco cheio de coisas brilhantes. Algumas piscam.', '* Ele olha direto para a sua tampa. Ele sabe o que tem aí dentro.'],
    check: 'ROUBA cristais que você carrega (agarrão). Derrote ele para recuperar. Se ele fugir, o cristal volta ao pilar.',
    moves: [{ k: 'ring', p: 1, w: 2, t: '* O Ladrão te acerta com o saco cheio!' }, { k: 'dodge', p: 0.5, hits: 3, spd: 1.3, w: 2, t: '* Pedrinhas de âmbar voando!' }] },
  marujo: { name: 'Marujo da Barca', sp: 'marujo', hp: 500, atk: 96, def: 24, xp: 230, weak: { faisca: 1.3, vento: 1.2 }, drops: [['agua', .25]],
    calm: { els: ['canto', 'ambar'], need: 3, msg: 'lembrou do porto de onde a barca saiu', bye: 'tirou o chapéu e foi dormir no porão' },
    flavor: ['* O Marujo da Barca fala uma língua antiga. Você entende assim mesmo: "Terra à vista?"', '* Ele está esperando terra à vista há novecentos anos.'],
    check: 'Marinheiro da Viagem Zero. Nós de corda e golpes de remo. ACALMAR: CANTO ou ÂMBAR (3).',
    moves: [{ k: 'seq', n: 5, p: 0.5, spd: 1.15, w: 2, t: '* Nós de marinheiro! Repita o nó!' }, { k: 'ring', p: 1.2, w: 2, t: '* Uma remada nas costas da sua tampa!' }, { k: 'mash', p: 1, need: 15, bind: true, w: 1, t: '* Ele te amarra com uma corda grossa!' }] },
  ancoraviva: { name: 'Âncora-Viva', sp: 'ancoraviva', hp: 600, atk: 100, def: 40, xp: 240, weak: { faisca: 1.5, polvora: 1.3, bite: 0.7 }, drops: [['bala', .2]],
    biteMsg: 'Você mordeu ferro de navio. Pouco efeito.',
    flavor: ['* A Âncora-Viva arrasta a corrente pelo chão. O barulho é de fim de viagem.'],
    check: 'Pesada e lenta. Prende e afunda. FAÍSCA no ferro, PÓLVORA quebra.',
    moves: [{ k: 'mash', p: 1.1, need: 16, bind: true, w: 2, t: '* A corrente te enrola e puxa para o fundo!' }, { k: 'ring', p: 1.45, fast: false, w: 2, t: '* A âncora cai em cima de você!' }, { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* A âncora se finca na frente do aliado.' }] },
  lacaio: { name: 'Lacaio do Lacre', sp: 'lacaio', hp: 460, atk: 96, def: 22, xp: 230, weak: { brasa: 1.4, vento: 1.2 }, drops: [['agua', .25]],
    flavor: ['* O Lacaio do Lacre carimba o ar. "INDEFERIDO."', '* Ele é feito de cera vermelha. E de pressa.'],
    check: 'Carimba você: esquecimento e silêncio. BRASA derrete a cera.',
    moves: [{ k: 'spell', p: 0.9, el: 'ambar', name: 'Carimbo: ARQUIVADO', st: 'forget', w: 2, t: '* {y}Carimbo: ARQUIVADO{/}! Uma lembrança sua vai para a gaveta.' }, { k: 'ring', p: 0.85, st: 'silence', w: 1, t: '* "SILÊNCIO, POR GENTILEZA."' }, { k: 'seq', n: 5, p: 0.5, hide: true, w: 2, t: '* Ele carimba cinco vezes e esconde os papéis. Lembre a ordem!' }] },
  afogado: { name: 'Afogado de Âmbar', sp: 'afogado', hp: 700, atk: 104, def: 32, xp: 320, elite: true, weak: { canto: 1.3, brasa: 1.2 }, drops: [['bala', .35]],
    calm: { els: ['canto'], need: 4, msg: 'sentiu o âmbar soltar o peito dele', bye: 'afundou devagar, em paz, sorrindo' },
    flavor: ['* O Afogado de Âmbar já foi passageiro de alguma viagem. Agora é quase só âmbar.', '* Ele respira devagar. Cada respiração brilha.'],
    check: 'Passageiro quase todo virado âmbar. Golpes que atravessam a defesa. ACALMAR: só CANTO (4).',
    big: { k: 'seq', n: 7, p: 0.45, pierce: true, hide: true, spd: 1.1 },
    moves: [{ k: 'seq', n: 6, p: 0.45, pierce: true, spd: 1.15, w: 2, t: '* Ele se debate como quem ainda está afundando!' }, { k: 'ring', p: 1.4, pierce: true, fast: true, w: 2, t: '* Um abraço de âmbar que aperta tudo!' }, { k: 'spell', p: 1, el: 'ambar', name: 'Maré Dourada', st: 'forget', w: 1, t: '* {y}Maré Dourada{/}! O âmbar sobe até a sua tampa.' }] },
  timoneiro: { name: 'O Timoneiro', sp: 'timoneiroB', hp: 3700, atk: 97, def: 28, xp: 1900, boss: true, ai: 'timoneiro', weak: { faisca: 1.35, canto: 1.25 },
    flavor: ['* O Timoneiro vira o leme para um porto que não existe.', '* "Mantenham o rumo! Terra à vista em três dias!"'], flavor2: ['* O âmbar já subiu até o peito dele.', '* Ele não solta o leme nem para lutar.'],
    check: 'Ele ANUNCIA o lado: BOMBORDO = desvie para a ESQUERDA, ESTIBORDO = para a DIREITA. ÂNCORA AO MAR é golpe preparado: Âncora ou Sino cancelam.' },
  capitao: { name: 'O Capitão', sp: 'capitaoB', hp: 4400, atk: 106, def: 30, xp: 2400, boss: true, ai: 'capitao', weak: { canto: 1.2, ambar: 1.2 },
    flavor: ['* O Capitão bate o sabre no chão do camarote. "Quem autorizou o embarque?"', '* Ele fecha a luneta. "Ninguém sai da minha barca sem ordem."'], flavor2: ['* A casaca dele tem cadeados costurados por dentro.', '* "Eu só obedeci. Eu só obedeci."'],
    check: 'Chefe secreto. Chama a tripulação, atira com o canhão, manda andar na prancha. CANTO e ÂMBAR.' },
  lacre: { name: 'O Lacre Real', sp: 'lacreB', hp: 5300, atk: 104, def: 30, xp: 3200, boss: true, ai: 'lacre', weak: { brasa: 1.25 },
    flavor: ['* O Lacre Real alisa a própria fita. "Senha, número de protocolo e motivo da visita."', '* Ele cheira a cera quente e a papel velho.'], flavor2: ['* A cera dele está rachando nas bordas.', '* "Isso é IRREGULAR. Totalmente IRREGULAR."'],
    check: 'Anuncia um CARIMBO antes de usar: INDEFERIDO (não repita a mesma ação), ARQUIVADO (esquecimento forte), DEVOLVIDO (não use feitiço, ele volta). CHAVE ou ÂMBAR quebram o carimbo. BRASA derrete.' }
});
EN_TINY.add('peixe'); EN_TINY.add('gaivota');
const STAMPS = {
  indeferido: '* O Lacre ergue o carimbo vermelho: "INDEFERIDO." (Se você repetir a mesma ação da rodada passada, ela falha.)',
  arquivado: '* O Lacre ergue o carimbo azul: "ARQUIVADO." (No próximo turno dele, você esquece um feitiço ou técnica por mais tempo. CHAVE ou ÂMBAR quebram.)',
  devolvido: '* O Lacre ergue um carimbo dourado: "DEVOLVIDO." (O próximo feitiço que você lançar volta contra você.)'
};
Object.assign(AI, {
  async timoneiro(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; shake(20); sfx('rumble'); await bSay('Novecentos anos! Novecentos anos virando para o lado errado!', { col: '#bfe8f0' }); await bSay('* O Timoneiro gira o leme com toda a força. O convés inteiro inclina.', { auto: 50 }); e.atk += 6; return; }
    if (e.side) { const side = e.side; e.side = null; return runMove(e, { k: 'dodge', p: 0.55, hits: e.p2 ? 4 : 3, spd: 1.35, dir: side, t: `* O convés tomba para ${side === 'left' ? 'BOMBORDO' : 'ESTIBORDO'}! Tudo desliza!` }); }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'ring', p: 2.2, pierce: true, fast: true, t: '* ÂNCORA AO MAR! A âncora inteira despenca na sua tampa!', fx: 'shake' }); }
    if (e.turns % 4 === 0) { e.charge = true; await bSay('* O Timoneiro solta a trava da âncora. (Prepare-se. Âncora ou Sino de Bolso cancelam.)', { auto: 55 }); return; }
    if (e.turns % 2 === 1) { e.side = Math.random() < 0.5 ? 'left' : 'right'; await bSay(`* "${e.side === 'left' ? 'BOMBORDO' : 'ESTIBORDO'}!" O Timoneiro avisa para onde vai virar. (Desvie para a ${e.side === 'left' ? 'ESQUERDA' : 'DIREITA'}.)`, { auto: 55 }); return; }
    return runMove(e, pickMove(e, [{ k: 'seq', n: e.p2 ? 7 : 6, p: 0.45, spd: 1.15, w: 2, t: '* Ele bate as ordens no casco: seis toques!' }, { k: 'mash', p: 1.05, need: 16, bind: true, w: 1, t: '* Uma corda de âmbar te prende no mastro!' }, { k: 'spell', p: 1.05, el: 'ambar', name: 'Onda de Proa', w: 2, t: '* {y}Onda de Proa{/}! O mar de âmbar sobe pelo convés!' }]));
  },
  async capitao(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; shake(20); sfx('rumble'); await bSay('A ordem veio de cima. Com o selo da lanterna. Eu SÓ OBEDECI.', { col: '#ffe0e0' }); e.atk += 8; return; }
    const crew = BT.en.filter(x => x !== e && x.alive && x.hp > 0);
    if (!crew.length && e.turns % 4 === 1) { BT.en.push(Object.assign(mkEnemy('marujo', 1, 3), { x: 206, y: 110 })); await bSay('* "TRIPULAÇÃO!" Um Marujo da Barca sobe pela escotilha.', { auto: 50 }); return; }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'mash', p: 1.6, need: 20, bind: true, t: '* PRANCHA! Ele te empurra para a beira do mar de âmbar!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* "Ande na prancha." O Capitão aponta o sabre para a beira. (Prepare-se para se soltar!)', { auto: 55 }); return; }
    return runMove(e, pickMove(e, [{ k: 'dodge', p: 0.55, hits: 4, spd: 1.4, w: 2, t: '* CANHÃO! Quatro balas de âmbar!' }, { k: 'ring', p: 1.35, pierce: true, w: 2, t: '* Um golpe de sabre que corta o ar!' }, { k: 'seq', n: 7, p: 0.45, hide: true, w: 1, t: '* Ele lê o diário de bordo em voz alta e fecha. Decore as datas!' }]));
  },
  async lacre(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; shake(24); sfx('rumble'); await bSay('Este selo foi aplicado por ordem SUPERIOR. Você não tem AUTORIZAÇÃO.', { col: '#ffb0b0' }); await bSay('* A cera do Lacre ferve. Ele passa a carimbar duas vezes por turno.', { auto: 50 }); e.atk += 6; return; }
    // aplica o carimbo anunciado
    if (e.stamp) {
      const st = e.stamp; e.stamp = null;
      if (st === 'indeferido') { const same = BT.lastAct && BT.lastAct === BT.prevAct; if (same) { await bSay('* INDEFERIDO! Você repetiu a ação. O carimbo bate em cheio.', { auto: 45 }); return runMove(e, { k: 'ring', p: 1.9, pierce: true, fast: true, t: '* O carimbo vermelho desce com tudo!' }); } await bSay('* "...Deferido." Você mudou de ação. O carimbo bate na mesa vazia.', { auto: 45 }); return; }
      if (st === 'arquivado') return runMove(e, { k: 'spell', p: 1.1, el: 'ambar', name: 'ARQUIVADO', st: 'forget', t: '* ARQUIVADO! O carimbo azul tenta guardar uma lembrança sua numa gaveta.' });
      if (st === 'devolvido') { BT.devolvido = 0; await bSay('* O carimbo dourado volta para a gaveta.', { auto: 35 }); }
    }
    const pick = pickOne(e.p2 ? ['indeferido', 'arquivado', 'devolvido', 'indeferido'] : ['indeferido', 'arquivado', 'devolvido']);
    e.stamp = pick; if (pick === 'devolvido') BT.devolvido = 1; await bSay(STAMPS[pick], { auto: 65 });
    if (e.p2 || e.turns % 2 === 0) return runMove(e, pickMove(e, [{ k: 'dodge', p: 0.5, hits: 4, spd: 1.35, w: 2, t: '* Fitas de papel cortam o ar!' }, { k: 'mash', p: 1.05, need: 16, bind: true, w: 1, t: '* A fita te embrulha como uma encomenda!' }, { k: 'ring', p: 1.25, w: 2, t: '* Um golpe de carimbo! TUM!' }]));
  }
});
// INDEFERIDO precisa saber a ação anterior; DEVOLVIDO volta o feitiço; CHAVE/ÂMBAR quebram o carimbo
{ const _ma = markAct; markAct = function (a) { BT.prevAct = BT.lastAct; return _ma(a); }; }
{ const _cs = castSpell; castSpell = async function (sp, target) {
  if (BT.devolvido > 0 && sp.el !== 'ambar' && sp.form !== 'chave') { BT.devolvido = 0; const lac = BT.en.find(e => e.alive && e.id === 'lacre'); if (lac) { await bSay(`* DEVOLVIDO! O {y}${sp.name}{/} bate no carimbo dourado e volta para você!`, { auto: 50 }); const d = Math.max(1, Math.round(spellPower(sp) * 0.6 * 60 / (60 + G.st.mag * 1.1))); G.hp = Math.max(1, G.hp - d); BT.nums.push({ x: BPX, y: BPY - 42, s: '-' + d, col: '#ff6b6b', t: 50 }); pbPose('hurt', 14); sfx('hurt'); return; } }
  await _cs(sp, target);
  if (BT.on && (sp.el === 'ambar' || sp.form === 'chave')) for (const e of BT.en) if (e.alive && e.stamp) { e.stamp = null; BT.devolvido = 0; await bSay('* O carimbo trinca e cai no chão. Anulado.', { auto: 40 }); }
}; }

// ---------- história ----------
MAPS.pontofinal.ents.push({ id: 'escada7', kind: 'npc2', x: 11, y: 13, sp: 'fechadura', talk: 'escada7', cond: 'ch6done', glow: 'rgba(255,224,102,0.22)' });
Object.assign(SEAL_TXT, { cabin: '* Uma porta de camarote com uma fechadura enorme, de ferro. Nenhuma chave comum entra. Talvez uma chave feita de feitiço.' });
Object.assign(SEAL_OK, { cabin: '* A chave mágica gira sozinha. CLIC, CLIC, CLIC. A porta do camarote do capitão se abre.' });
STORY.doorMsg = (d => async e => e.msg === 'escotilha7' ? say('* Uma escotilha trancada por dentro, com o leme. Enquanto o Timoneiro estiver no leme, ela não abre.') : d(e))(STORY.doorMsg);
const crystalNames = ids => ids.map(k => CRYSTALS[k].n);
Object.assign(STORY, {
  async escada7() {
    if (G.flags.ch7open) { await say('* A escada desce até a Porta Redonda. A resistência está lá embaixo.'); return; }
    await say('* A escada desce até a Porta Redonda. Lá embaixo, luzes de vela e vozes conhecidas.');
    const c = await choose('* Descer até a porta? (Começa o Capítulo 7.)', ['Descer', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.ch7start();
  },
  async ch7start() {
    const f = G.flags;
    f.ch7open = true;
    if (f.soul_neide === 'lembrou') f.c7_neide = true; else f.c7_neideLost = true;
    if (soulOk('cida')) f.c7_cida = true; else f.c7_cidaLost = true;
    if (f.soul_ozorio !== 'lembrou') f.c7_ozorioLost = true;
    playMusic(null); await fadeOut(12); loadMap('antessala7', 12, 13, 'up'); V.scene = 'world'; await fadeIn(16);
    playMusic('antessala');
    await say('* Uma caverna redonda, do tamanho de uma praça. No fundo, uma porta de pedra também redonda, alta como três andares.');
    await say('* Trinta e uma fechaduras desenhadas na pedra, em espiral. Cada uma com um número.');
    const n = soulsCount();
    await say(`* ${n} das fechaduras brilham, devagar, como brasa de vela. As outras estão escuras.`);
    await say('Cada uma que brilha é alguém que lembrou o próprio nome. As escuras...', 'lume');
    await say('...são as que a gente perdeu no caminho.', 'me');
    await say('* Do lado da porta, estacionado, o 31. Motor ligado. Faróis acesos. O Seu Jorge no volante, de olhos abertos, sem piscar.');
    await say('* Ao redor, uma barricada de caixotes, velas de rato e barracas remendadas. A resistência do Musgo acampou aqui.');
    await say('* Um Morcego de Papel pousa na sua tampa. A letra é inclinada.');
    await say(f.ofeliaRemembers ? '* "O Anselmo, o cocheiro, contava uma história para passar o tempo na estrada. Uma moça numa barca, muito antes de nós, que acendia uma lanterna no meio do mar. Eu achava que era só história. Tome cuidado. — Clara"' : '* "O cocheiro da minha viagem contava uma história de uma moça numa barca, muito antes de nós. Eu achava que era só história. Tome cuidado. — O."');
    sfx('catalog'); await say('[Capítulo 7: {y}O Selado{/}.]', 'cat');
    await grantTechs(false); saveGame();
  },
  async onibus7() {
    const f = G.flags;
    if (f.ch7done) { await say('Todo mundo sentado? Segura firme. A próxima é longa.', 'jorge'); return; }
    await say('* O 31, parado. Pelo vidro, o Seu Jorge, com as duas mãos no volante e o olhar fixo na porta de pedra.' + (f.tiagoTaken ? ' No primeiro banco, o Tiago, do mesmo jeito.' : ''));
    await say('* Você bate na porta do ônibus com a tampa. Nada. Nem um piscar.');
    await say('Ela congelou eles aqui. Como um enfeite na frente da porta. Para a gente ver.', 'lume');
  },
  async musgo7() {
    if (G.flags.ch7done) { await say('O ÔNIBUS VAI SUBIR. A GENTE SOBE JUNTO. EU NUNCA ANDEI DE ÔNIBUS.', 'musgo'); return; }
    await say(pickOne(['A FILA VEM EM ONDAS. PASSAGEIROS SEM ROSTO. A GENTE SEGURA. VOCÊ ENTRA.', 'EU NÃO CABO NA FECHADURA. EU TENTEI. FICOU FEIO.', 'O QUE ESTÁ DO OUTRO LADO BATE TRÊS VEZES TODA HORA. COMO QUEM PEDE LICENÇA.']), 'musgo');
  },
  async ozorio7() {
    const f = G.flags;
    if (f.fiadoPago) { await say(pickOne(['Página rasgada, freguês. Você tá limpo comigo.', 'Quando tiver rosto, vem comer um de queijo. Esse é por conta da casa.']), 'ozorio'); return; }
    f.fiadoPago = true;
    await say('Ô, menino do fone. Já que a gente tá aqui, no fim do mundo...', 'ozorio');
    await say('* Ele tira o caderno de fiado do avental e abre na página.');
    await say('Dois pastéis de queijo. Três e cinquenta cada. Sete reais.', 'ozorio');
    await say('Seu Ozório, eu sou um baú. O que eu tenho é um frasco e uma Lume.', 'me');
    await say('Ei!', 'lume');
    await say('* Você abre a tampa e oferece um gole do Frasco de Âmbar. É a única coisa de valor que você carrega.');
    await say('* O Seu Ozório cheira o frasco e fica sério.');
    await say('Isso aqui tem cheiro de... de gente. De alguém que eu não conheço.| Guarda isso, rapaz.', 'ozorio');
    await say('* Ele arranca a página do caderno, dobra em quatro e enfia na sua fechadura.');
    await say('Fiado pago. Você me paga quando tiver rosto. Com juros: você me conta como foi lá dentro.', 'ozorio');
  },
  async rita7() {
    const f = G.flags;
    await say(f.ritaPromise ? 'Mala falante. Eu ouvi dizer que você vai entrar numa fechadura. Volta inteiro, tá? O pastel ainda está de pé.' : 'Ei, mala. Eu cuido da barricada. Você cuida de voltar.', 'rita');
    if (!f.rita7) { f.rita7 = true; giveItem('bala', 2); sfx('item'); await say('* A Rita enfia duas balas de âmbar na sua tampa. "Achei por aí. Não pergunta."'); await say('* (Você recebeu {y}Bala de Âmbar{/} ×2.)'); }
  },
  async marlene7() { await say(pickOne(['O Valdir está segurando a praça lá em cima. Eu seguro a porta aqui embaixo. Cada um no seu posto.', 'Setenta e oito anos, mocinho. Fila de banco é pior que isso aí.', 'Se o que bate do outro lado tiver educação, eu abro. Se não tiver, eu também abro, mas com a espada.']), 'marlene'); },
  async duda7() { await say(pickOne(['Maria Eduarda. Rua das Acácias, 40. Portão verde. Vai, eu seguro.', 'Os heróis que viram passar pela faixa... estavam aqui na fila. Alguns pararam quando a gente gritou o nome deles.', 'Se você sumir aí dentro, eu entro atrás. Eu já desobedeci a Coroa, desobedeço uma porta.']), 'duda'); },
  async neide7() { await say(pickOne(['Chamada antes de entrar: nome completo, por favor. ...Ótimo. Pode ir.', 'Quem você trouxer de volta, eu ensino de novo. Tudo de novo, se precisar.', 'Leve um caderno. Não, você é um baú. Você É o caderno.']), 'neide'); },
  async cida7() { await say(pickOne(['Ai, meu bem, que porta mais feia. Parece fechadura de cofre de banco.', 'Leva um guarda-chuva. Lá dentro deve chover âmbar.', 'Quem você não conseguir trazer... não carrega isso sozinho, tá? Ninguém carrega.']), 'cida'); },
  async pip7() { await say(pickOne(['A gente ficou com a barricada leste. A capitã ia gostar da formação.', 'O Tolo quer saber se dentro da fechadura tem banheiro.', 'Volta logo. A gente ainda não abriu nenhum baú. Por respeito.']), 'pip'); },
  async fechadura7() {
    const f = G.flags;
    if (f.ch7done) { await say('* A 32ª fechadura. Agora ela está fechada. Por dentro.'); return; }
    if (!f.fech7) {
      f.fech7 = true;
      await say('* Bem embaixo da porta, quase no chão, uma fechadura pequena. Não tem número.');
      await say('* Ela é a única que já está aberta.| E as marcas de arranhão estão do lado de cá.| Ela foi aberta por dentro.');
      await say('Alguém saiu por aqui. Ou alguém deixou aberta pra entrar depois.', 'lume');
      await say('A gente não tem as chaves dos perdidos. Não dá pra abrir a porta grande.', 'me');
      await say('Baú.| Você é um baú.| Baús têm fechadura.', 'lume');
      await say('...Isso é a coisa mais estranha que você já me disse.', 'me');
      await say('Encosta a sua fechadura na dela. Mímico sabe virar o que precisa. Vira passagem.', 'lume');
      await say('E os outros?', 'me');
      await say('NÃO CABEM. A GENTE SEGURA A FILA. VAI.', 'musgo');
    }
    const c = await choose('* Encostar a sua fechadura na 32ª e passar?', ['Passar', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    sfx('flee'); await fadeOut(14); V.scene = 'black'; await fadeIn(1);
    if (!f.seen_cais) await say('* Você encosta a fechadura. CLIC. Por um segundo, você é uma porta. Depois, é só um baú caindo num lugar muito quente e muito dourado.', 'void');
    await fadeOut(8); loadMap('cais', 13, 14, 'up'); V.scene = 'world'; await fadeIn(16);
    if (!f.seen_cais) { f.seen_cais = true; await STORY.caisFirst(); }
  },
  async caisFirst() {
    await say('* Um mar de âmbar líquido, morno, debaixo de um céu de pedra. Pontes de tábua velha saem para todos os lados.');
    await say('* De perto, dá para ver: o âmbar não está vazio. Lá no fundo, bem devagar, passam rostos.');
    await say('Baú. Isso tudo é... gente. Tudo o que a masmorra já leu. Um mar inteiro.', 'lume');
    await say('* Ao longe, encalhada no âmbar, uma barca antiga, de proa alta e vela rasgada.');
    await say('* Pelas pontes, pilares de âmbar. Dentro de cada um, alguém de olhos fechados.');
  },
  async volta7() {
    const f = G.flags;
    if (!f.lacreDone) {
      const c = await choose('* A fechadura do lado de dentro. Voltar para a antessala? (Os cristais que você carrega continuam na tampa.)', ['Voltar', 'Ficar'], 'n', 1);
      if (c !== 0) return;
      await fadeOut(12); loadMap('antessala7', 11, 6, 'down'); await fadeIn(12); return;
    }
    const C = carry();
    await say(`* Você carrega ${C.length} alma${C.length === 1 ? '' : 's'}: ${crystalNames(C).join(', ') || 'ninguém'}.`);
    const c = await choose('* Voltar pela fechadura para sempre? (Quem ficou no âmbar, fica. Não dá para voltar aqui.)', ['Voltar', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.end7();
  },
  async subir7() { await fadeOut(10); loadMap('conves', 19, 12, 'up'); await fadeIn(10); },
  async convesFirst() {
    await wait(20);
    await say('* O convés da barca. Tábuas cobertas de âmbar seco, cordas duras como pedra, uma vela rasgada que ainda tenta pegar vento.');
    sfx('catalog'); await say('[Registro: Viagem 3. Embarcação: barca. Almas: 40.]', 'cat');
    await say('[Correção: Viagem 0.]', 'cat');
    await say('Três? A gente só conhece duas viagens. A carruagem da Ofélia e o 31.', 'lume');
    await say('[Erro de contagem. Desconsiderar.]', 'cat');
    await say('* Lá em cima, no leme, um marinheiro de âmbar vira a roda sem parar.');
  },
  async poraoFirst() {
    await wait(20);
    await say('* O porão da barca. Correntes, caixotes e pilares de âmbar até o teto. Cheira a madeira molhada e a promessa quebrada.');
  },
  async manifesto7() {
    await say('* Um livro de bordo aberto num atril, coberto de âmbar seco. A primeira página:');
    await say('* "VIAGEM ZERO. Barca de passageiros. Quarenta almas. Destino: a outra margem."');
    await say('* "Embarque autorizado por:" e, em vez de uma assinatura, um desenho pequeno, cuidadoso: uma lanterna com um olho dentro.');
    await say('...É o mesmo desenho da porta.', 'me');
    await say('E das bandeiras dos soldados lá do Andar 3. Aqueles do farol.', 'lume');
    G.flags.clueLantern = true;
  },
  async timoneiro7() {
    const f = G.flags;
    if (f.timoneiroDone) return;
    if (!f.timoneiroSeen) {
      f.timoneiroSeen = true; playMusic(null);
      await say('* O Timoneiro não tira as mãos do leme. O âmbar já subiu até o peito dele.');
      await say('Mantenham o rumo! Terra à vista em três dias!', 'timoneiro');
      await say('Faz novecentos anos, senhor.', 'me');
      await say('...Então faltam três dias há novecentos anos. MANTENHAM O RUMO!', 'timoneiro');
    } else await say('BOMBORDO! ESTIBORDO! NINGUÉM SAI DO RUMO!', 'timoneiro');
    const r = await battle(['timoneiro'], { boss: true, music: 'boss7', noFlee: true, intro: '* O Timoneiro gira o leme e o convés inteiro inclina!' });
    if (r !== 'win') return;
    f.timoneiroDone = true; refreshEnts(); playMusic(null);
    await say('* O Timoneiro solta o leme. É a primeira vez em novecentos anos. As mãos dele ficaram com o formato da roda.');
    await say('A gente nunca devia ter saído do porto. Era noite, o mar estava bravo.| Mas alguém acendeu uma lanterna lá longe, no meio da água. E a gente seguiu.', 'timoneiro');
    await say('Quem acendeu?', 'lume');
    await say('Não sei, moça. Uma luz. A gente achou que era a outra margem.', 'timoneiro');
    await say('* Ele se senta no convés e fecha os olhos. A escotilha do porão, destravada, range.');
    await STORY.evolve5();
    playMusic(WD.map.music); saveGame();
  },
  async evolve5() {
    const f = G.flags;
    if (f.grau5) return;
    sfx('catalog');
    await say('[Condições de evolução atingidas: 5º grau.]', 'cat');
    await say('[O 5º grau não é escolhido pela força. É escolhido pela resposta.]', 'cat');
    await say(`[Pergunta: você tem espaço para ${carryCap()}. Lá embaixo tem mais gente do que isso. O que você faz com quem não cabe?]`, 'cat');
    await say('* A Lume fica muito quieta, perto da sua tampa.');
    await say('[Resposta um: ARCA DA ORIGEM. Você fica maior. Você guarda as almas, como nós guardamos. Você passa a ser um arquivo.]', 'cat');
    await say('[Resposta dois: MÍMICO VAZIO. Você tira tudo o que é seu de dentro para caber mais gente. Tudo. Inclusive o que você lembra da Terra.]', 'cat');
    await say('Baú... qualquer uma das duas muda você para sempre.', 'lume');
    f.prev4 = G.species; f.line5 = SPECIES[G.species].grow === GROW4A ? 'a' : 'f';
    const pick = await evolveScreen();
    f.grau5 = pick;
    await say(`[Evolução concluída: {y}${SPECIES[pick].name.toUpperCase()}{/}.]`, 'cat');
    if (pick === 'arca') {
      await say('[Nós damos as boas-vindas.]', 'cat');
      await say('...Nós?', 'me');
      await say('[Desculpe. Força do hábito. Você vai se acostumar. Nós nos acostumamos.]', 'cat');
      await say(`* Sua tampa ficou dourada e pesada, como uma arca de igreja. Agora cabem ${carryCap()} almas.`);
    } else {
      f.mem_pastel = true; delete f.pastelBack; f.memVazio = true;
      await say('[Memórias da Terra: arquivadas. Todas.]', 'cat');
      await say('* Você tenta lembrar do ônibus.| Da padaria.| Do seu quarto.| Tem um espaço branco onde essas coisas estavam. Limpo, como uma sala depois da mudança.');
      await say('Baú? ...Você lembra de mim?', 'lume');
      await say('Lembro. Você é a Lume. Você canta. Você é minha amiga.| Isso eu aprendi aqui. Isso não era da Terra.', 'me');
      await say('* A Lume ri e chora ao mesmo tempo, o que num lustre parece um curto-circuito.');
      await say(`* Agora cabem ${carryCap()} almas dentro de você.`);
    }
    await grantTechs(false);
  },
  async capitao7() {
    const f = G.flags;
    if (f.capitaoDone) return;
    await say('* No camarote, um esqueleto de casaca vermelha e chapéu de três pontas, sentado atrás de uma mesa com um mapa sem terra nenhuma.');
    await say('Quem autorizou o embarque?', 'capitao');
    await say('Ninguém. A gente entrou pela fechadura.', 'me');
    await say('IRREGULAR. Ninguém sai da minha barca sem ordem. E a ordem nunca veio.', 'capitao');
    const c = await choose('* O Capitão levanta o sabre. (Chefe secreto muito forte.)', ['Lutar', 'Voltar depois'], 'n', 1);
    if (c !== 0) return;
    const r = await battle(['capitao'], { boss: true, music: 'boss7', noFlee: false, intro: '* O Capitão bate o sabre na mesa: "TODOS AOS SEUS POSTOS!"' });
    if (r !== 'win') return;
    f.capitaoDone = true; refreshEnts();
    await say('* O Capitão cai sentado na cadeira. O chapéu escorrega.');
    await say('Ela disse que era só uma viagem. Que do outro lado tinha uma cidade nova esperando a gente.', 'capitao');
    await say('Que ninguém ia sentir falta de quarenta pessoas.', 'capitao');
    await say('* Ele não diz mais nada. A luneta rola da mão dele até os seus pés.');
    G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
    await giveRune('bilhete', false, 1);
    giveItem('bala', 3); await say('* Você recebeu {y}Bala de Âmbar{/} ×3.');
    f.capitaoLuneta = true;
  },
  async lacre7() {
    const f = G.flags;
    if (f.lacreDone) return;
    if (!f.lacreSeen) {
      f.lacreSeen = true; playMusic(null);
      await say('* Uma sala redonda e vermelha. Na parede do fundo, um selo de cera do tamanho de uma porta, com fitas de papel penduradas.');
      await say('* No meio da cera, o brasão: uma lanterna com um olho.');
      await say('* O selo abre os olhos.');
      await say('Senha, número de protocolo e motivo da visita.', 'lacre');
      await say('A gente veio buscar as pessoas que vocês prenderam.', 'me');
      await say('Pedido INDEFERIDO. Este selo foi aplicado por ordem superior e é IRREVOGÁVEL.', 'lacre');
      await say('Ordem de quem?', 'lume');
      await say('Informação SIGILOSA.| Próximo da fila.', 'lacre');
    } else await say('Próximo da fila. Senha, protocolo e motivo.', 'lacre');
    const r = await battle(['lacre'], { boss: true, music: 'boss7', noFlee: true, intro: '* O Lacre Real ergue dois carimbos!' });
    if (r !== 'win') return;
    f.lacreDone = true; refreshEnts(); playMusic('cela');
    await say('* A cera racha de cima a baixo, com um barulho de gelo em copo. O brasão se parte bem no meio do olho.');
    await say('...Isso vai constar na sua ficha.', 'lacre');
    await say('* Pela rachadura sai uma luz quente. E uma voz de moça, baixinha, como quem acorda.');
    await STORY.moca7();
  },
  async moca7() {
    const f = G.flags;
    if (f.moca7) { await say(pickOne(['Leva quem você conseguir. E não deixa ela chamar de novo.', 'Eu fico. A rachadura é pequena. Por enquanto é melhor assim.', 'Volta pela fechadura antes que o âmbar suba.']), 'moca'); return; }
    f.moca7 = true;
    await say('...Faz tanto tempo que ninguém fala comigo de perto.', 'moca');
    await say('* Pela rachadura, dá para ver alguém feito de âmbar, sentada, abraçando os joelhos. Uma moça. Ela sorri sem saber se pode.');
    await say('Quem é você?', 'lume');
    await say('Eu não sei o meu nome. Levaram junto com a outra metade de mim.', 'moca');
    await say('A outra metade?', 'me');
    await say('A que não sente nada. Ela ainda está lá em cima, acendendo lanternas.| Eu fiquei com o resto. Com a culpa, principalmente.', 'moca');
    await say('* O chão treme. Lá longe, uma voz enorme pergunta alguma coisa que você não entende.');
    await say('Ela já percebeu que vocês entraram. Leva as pessoas que você conseguir carregar. E sai.', 'moca');
    await say('E você?', 'me');
    await say('Eu fico. A rachadura é pequena. Quando ela ficar grande, eu saio. E aí vai ser um problema para todo mundo.', 'moca');
    await say('Só me promete uma coisa.| Não deixa ela chamar de novo.', 'moca');
    await say('Ela quem?', 'lume');
    await say('* A moça abre a boca para responder. Nenhum som sai. Como se o nome tivesse sido arrancado da garganta dela também.');
    sfx('catalog'); await say('[Aviso: o Selado está acordado.]', 'cat');
    await say('[Recomendação: voltar pela fechadura. Agora.]', 'cat');
    saveGame();
  },
  async end7() {
    const f = G.flags, C = carry().slice();
    f.crossBack = true; f.saved7 = C;
    for (const k of C) { if (k === 'ozorio' || k === 'neide') f['soul_' + k] = 'resgatado'; if (k === 'cida') f.soul_cida = 'resgatado'; }
    playMusic(null); sfx('flee'); await fadeOut(14); loadMap('antessala7', 11, 7, 'down'); V.scene = 'world'; await fadeIn(16);
    playMusic('padaria');
    await say('* CLIC. Você cai na antessala de tampa para cima, quente como um forno.');
    if (C.length) {
      await say('* Você abre a tampa. Os cristais saem um por um e derretem no chão como mel ao sol.');
      for (const k of C) await say(`* {y}${CRYSTALS[k].n}{/} abre os olhos.` + (k === 'teo' ? ' "A pizza... ainda tá quente?"' : k === 'rafael' ? ' Ele abre a mão: o anel continua lá.' : k === 'luzia' ? ' "Sabe por que o baú não tem medo? ...Esqueci o resto. Que alívio, esquecer só uma piada."' : k === 'nilo' ? ' Ele olha em volta. "Que porto é este?" Ninguém sabe responder. Ele sorri assim mesmo.' : k === 'ozorio' ? ' "...Bia." E depois: "Menino do fone! Cadê meus sete reais?"' : k === 'neide' ? ' "Chamada. Quem está presente?" Todo mundo levanta a mão.' : k === 'cida' ? ' "Meus óculos. Alguém viu meus óculos?" Você viu. Estão na sua tampa.' : ''));
    } else await say('* Você não trouxe ninguém. A sua tampa está vazia e leve demais.');
    const left = Object.keys(CRYSTALS).filter(k => !C.includes(k) && (!CRYSTALS[k].cond || CRYSTALS[k].cond())).length;
    if (left) await say(`* ${left} ficaram no âmbar. Você sabe exatamente quantos. Você vai saber para sempre.`);
    await wait(30); shake(20); sfx('rumble');
    await say('* O 31 engasga. O motor tosse. Os faróis piscam.');
    await say('* Pelo vidro, o Seu Jorge pisca uma vez. Duas. E solta o volante para coçar os olhos.');
    await say('...Que ponto é esse?', 'jorge');
    if (f.tiagoTaken) await say('Seu Jorge! Acordou! A gente... a gente perdeu alguma coisa?', 'tiago');
    await say(f.jorgeDiary ? 'Menino do último banco. Você voltou pra buscar o ônibus. Ninguém nunca voltou pra buscar o ônibus.' : 'Você voltou pra buscar o ônibus. Logo você, que sempre perdia ele.', 'jorge');
    await wait(20); shake(50); sfx('rumble');
    await say('* A caverna inteira treme. Pedras caem do teto. A Porta Redonda bate por dentro, três vezes, forte.');
    await say('VOCÊS ROUBARAM A MINHA COLEÇÃO.', 'fundo');
    sfx('catalog'); await say('[Contagem impossível. Contagem impossível. Contag—]', 'cat');
    await say('ELA VAI DERRUBAR TUDO! O TETO, A TRINCHEIRA, OS ANDARES!', 'musgo');
    await say('* O Seu Jorge abre a porta do ônibus com um chiado e aperta a buzina até todo mundo olhar.');
    await say('Todo mundo pro ônibus! Monstro, gente, lustre, baú, quem for! Eu sei sair de qualquer lugar!', 'jorge');
    await say('Até de dentro de uma masmorra desabando?', 'lume');
    await say('Principalmente. Já viu o trânsito da Avenida às seis da tarde?', 'jorge');
    await endScreen(7);
    f.ch7done = true; saveGame();
  }
});
{ const _f = { conves: 'convesFirst', porao: 'poraoFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _os = STORY.onStep3; STORY.onStep3 = function () {
  if (_os && _os()) return true;
  if (WD.id === 'conves' && !G.flags.timoneiroDone && WD.y <= 4 && WD.x >= 9 && WD.x <= 16) { runScript(STORY.timoneiro7); return true; }
  if (WD.id === 'cela' && !G.flags.lacreDone && WD.y <= 6) { runScript(STORY.lacre7); return true; }
  return false; }; }
{ const _es = endScreen; endScreen = function (ch) { if (ch !== 7) return _es(ch); playMusic('ending');
    const w = { type: 'end', t: 0, update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
      draw() { bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); const a = Math.min(1, this.t / 60);
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 96, 22, 48, 48); bx.globalAlpha = 1;
        txt('FIM DO CAPÍTULO 7', 120, 80, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
        txt('O Selado', 120, 100, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Almas trazidas do âmbar: ${(G.flags.saved7 || []).length}`, `Tempo: ${fmtTime(G.time)}`, G.flags.grau5 === 'vazio' ? 'Você esvaziou tudo o que era seu' : 'Você virou uma arca', G.flags.capitaoDone ? 'O Capitão largou a luneta' : ''];
        L.forEach((l, i) => txt(l, 120, 120 + i * 12, { align: 'center', col: i >= 3 ? '#8fe3ff' : '#ffffff', alpha: clamp((this.t - 40) / 40, 0, 1) }));
        txt('Próximo: Capítulo 8 — A Tampa se Fecha', 120, 190, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
        if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' }); } };
    return openWin(w); }; }
{ const _co = chapterOf; chapterOf = function (d) { const f = (d && d.flags) || {}; return f.ch7open ? 7 : _co(d); }; }
{ const _ds = drawSeal; drawSeal = function (e, sx, sy, lights) {
  if (e.look !== 'cabin') return _ds(e, sx, sy, lights);
  if (G.flags[e.flag]) { bx.fillStyle = '#1a120a'; bx.fillRect(sx + 2, sy, 12, 16); bx.fillStyle = '#5a3a24'; bx.fillRect(sx, sy, 2, 16); bx.fillRect(sx + 14, sy, 2, 16); return; }
  bx.fillStyle = PAL.k; bx.fillRect(sx, sy, 16, 16);
  bx.fillStyle = '#6a4228'; bx.fillRect(sx + 1, sy + 1, 14, 15);
  bx.fillStyle = '#4a2c18'; for (let i = 4; i < 15; i += 4) bx.fillRect(sx + i, sy + 1, 1, 15);
  bx.fillStyle = '#8a8a96'; bx.fillRect(sx + 1, sy + 3, 14, 2); bx.fillRect(sx + 1, sy + 11, 14, 2);
  bx.fillStyle = '#c8962a'; bx.fillRect(sx + 5, sy + 6, 6, 5);
  bx.fillStyle = PAL.k; bx.fillRect(sx + 7, sy + 7, 2, 2); bx.fillRect(sx + 7.5 | 0, sy + 9, 1, 2);
  if (FRAME % 60 < 30) { bx.fillStyle = '#ffe066'; bx.fillRect(sx + 6, sy + 6, 1, 1); }
}; }
