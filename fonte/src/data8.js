// ================= CAPÍTULO 8: A TAMPA SE FECHA (final da Temporada 1) =================
// A masmorra desaba. O 31 sobe a Linha ao contrário, com todo mundo dentro.
// Mecânicas: PASSAGEIROS DO 31 (obstáculos resolvidos por quem você trouxe), RISCO do Escriba,
// e a FICHA do Catálogo (correções que mudam a sua interface; RESPONDER com a sua própria história).

// ---------- runas: CÉU (elemento) e NOME (modificador) ----------
Object.assign(RUNES, {
  ceu: { name: 'Céu', type: 'el', col: '#8fd8ff', pow: 12, desc: 'A palavra que ninguém aqui embaixo conhecia. Limpa os seus estados ruins ao conjurar. Véu: Céu Aberto, imune a cegueira e esquecimento por 3 turnos.' },
  nome: { name: 'Nome', type: 'mod', col: '#ffe066', cost: 3, desc: 'O feitiço vai assinado com o seu nome: não pode ser copiado, devolvido nem catalogado. +30% contra quem lê (Escriba, Leitor, Catálogo).' }
});
Object.assign(RUNE_RAR, { ceu: 'rara', nome: 'rara' });
EL_COL.ceu = '#8fd8ff';
EP.ceu = ['#2a4a8a', '#5a9ae0', '#8fd8ff', '#fff4e0'];
const READERS8 = new Set(['escriba8', 'leitor', 'catalogo']);
// o projétil do Céu: um pedacinho de amanhecer com nuvens; o impacto: um raio de sol que desce
{ const _dp = drawProj; drawProj = function (el, x, y, t, dir, s) {
  if (el !== 'ceu') return _dp(el, x, y, t, dir, s);
  const [d, m, b, w] = EP.ceu, c = Math.cos(dir), sn = Math.sin(dir);
  fxGlow(x, y, 8 * s, '#ffd890', 0.2); fxDisc(x, y, 4 * s, d); fxDisc(x, y - 1, 3.4 * s, m); fxDisc(x, y - 2, 2.4 * s, b); fxR(x - 3 * s, y + 1, 6 * s, 1, '#ffb070');
  for (const k of [-1, 1]) { const cx = x - c * 4 + k * 3, cy = y - sn * 4 + 3; fxR(cx - 2, cy, 5, 2, '#ffffff'); fxR(cx - 1, cy - 1, 3, 1, '#ffffff'); }
  if (t % 3 === 0) fxPart(x - c * 4, y - sn * 4, -c * 0.3, -sn * 0.3, 14, pickOne(['#8fd8ff', '#ffffff', '#ffd890']), 1);
}; }
{ const _di = drawImpact; drawImpact = function (el, x, y, p, s, fy) {
  if (el !== 'ceu') return _di(el, x, y, p, s, fy);
  const q = 1 - p, hw = Math.round((3 + q * 7) * s);
  bx.globalAlpha = 0.55 * q; fxR(x - hw, 0, hw * 2, (fy || y + 16), '#fff4e0'); bx.globalAlpha = 0.35 * q; fxR(x - hw * 2, 0, hw * 4, (fy || y + 16), '#8fd8ff'); bx.globalAlpha = 1;
  fxRing(x, fy || y + 14, (4 + p * 18) * s, '#ffffff', (2 + p * 6) * s);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + p * 2; fxSpark(x + Math.cos(a) * 12 * p * s, y + Math.sin(a) * 9 * p * s, i % 2 ? '#8fd8ff' : '#ffd890', i === 0); }
}; }
{ const _wv = fxWave; fxWave = async function (el, ts, s) {
  if (el !== 'ceu') return _wv(el, ts, s);
  await fxRun(34, (k, p) => {
    for (let i = 0; i < 240; i += 2) { const h = 60 - Math.abs(Math.sin(i * 0.02 + k * 0.08)) * 10, a = Math.max(0, Math.min(1, p * 2.4 - i / 240)); if (!a) continue; bx.globalAlpha = 0.3 * a * (1 - p * 0.6); fxR(i, 0, 2, h, i % 6 ? '#8fd8ff' : '#fff4e0'); }
    bx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) { const cx = ((i * 47 + k * 2) % 260) - 10, cy = 10 + (i % 3) * 9; fxR(cx, cy, 10, 3, '#ffffff'); fxR(cx + 2, cy - 2, 6, 2, '#ffffff'); }
  });
  for (const t of ts) impactAt('ceu', t, s);
}; }
{ const _au = fxAura; fxAura = async function (el) {
  if (el !== 'ceu') return _au(el);
  const cx = BPX, cy = BPY - 12;
  await fxRun(40, (k, p) => {
    const q = Math.sin(p * Math.PI);
    bx.globalAlpha = 0.25 * q; fxDisc(cx, cy - 4, 26, '#8fd8ff'); bx.globalAlpha = 0.18 * q; fxDisc(cx, cy - 10, 18, '#ffd890'); bx.globalAlpha = 1;
    for (let i = 0; i < 4; i++) { const a = k * 0.06 + i * Math.PI / 2, rx = cx + Math.cos(a) * 22, ry = cy - 6 + Math.sin(a) * 9; fxR(rx - 4, ry, 9, 3, '#ffffff'); fxR(rx - 2, ry - 2, 5, 2, '#ffffff'); }
    for (let i = 0; i < 3; i++) fxSpark(cx - 16 + i * 16, cy - 26 + Math.sin(k * 0.2 + i) * 3, '#ffd890', i === 1);
  });
}; }
// assinatura do NOME: as letras do seu nome giram ao redor do baú e seguem o feitiço
{ const _sa = spellAnim; spellAnim = async function (sp, targets, pm = 1) {
  if (sp.mod === 'nome') {
    const nm = (G.name || '?').toUpperCase().slice(0, 8);
    await fxRun(22, (k, p) => { for (let i = 0; i < nm.length; i++) { const a = -Math.PI / 2 + (i / nm.length) * Math.PI * 2 + k * 0.12, r = 20 - p * 8; txt(nm[i], BPX + Math.cos(a) * r - 2, BPY - 22 + Math.sin(a) * r * 0.55, { col: i % 2 ? '#ffe066' : '#ffffff' }); } });
  }
  await _sa(sp, targets, pm);
  if (sp.mod === 'nome') for (const t of targets) { const x = t.x, y = t.y; fxSpawn(30, (k, p) => { txt(G.name.slice(0, 10), x, y - 22 - p * 8, { align: 'center', col: '#ffe066', alpha: 1 - p, shadow: true }); fxR(x - 14, y - 10 - p * 8, 28 * Math.min(1, p * 3), 1, '#ffe066'); }); }
}; }
// efeito do Céu: limpa os seus estados ao conjurar; o Véu do Céu abre o céu (imune a cegueira e esquecimento)
{ const _cs = castSpell; castSpell = async function (sp, target) {
  if (sp.el === 'ceu' && sp.form === 'veu') {
    BT.lastSpell = sp; pbPose('open', 26, { glow: RUNES.ceu.col }); await bSay(`* Você conjura {c}${sp.name}{/}!`, { auto: 22 }); sfx('buff'); await fxAura('ceu');
    cureStatus(); BT.openSky = sp.mod === 'eco' ? 5 : 3;
    if (sp.mod === 'foco') { BT.buff.defM = Math.min(BT.buff.defM, 0.8); BT.buff.defT = Math.max(BT.buff.defT, 4); }
    await bSay(`* Um pedaço de céu se abre em cima da sua tampa. Cegueira e esquecimento não te alcançam por ${BT.openSky} turnos.${sp.mod === 'foco' ? ' Dano recebido -20%.' : ''}`, { auto: 55 });
    return;
  }
  BT.curSpell = sp; BT.curCat = 'sp:' + sp.el + (sp.mod === 'nome' ? ':nome' : '');
  const had = sp.el === 'ceu' && BT.ps && Object.values(BT.ps).some(v => v > 0);
  await _cs(sp, target);
  BT.curSpell = null;
  if (sp.el === 'ceu' && BT.on) { cureStatus(); if (had) await bSay('* A luz do céu tira de você o que estava pesando.', { auto: 35 }); }
}; }
{ const _gs = giveStatus; giveStatus = function (st, turns, mv) { if (BT.openSky > 0 && (st === 'blind' || st === 'forget')) return 'O céu aberto em cima de você não deixa.'; return _gs(st, turns, mv); }; }
{ const _ma = markAct; markAct = function (k) { BT.curCat = k; return _ma(k); }; }
// NOME: +30% contra quem lê
{ const _he = hitEnemy; hitEnemy = function (e, dmg, kind, col) {
  if (BT.curSpell && BT.curSpell.mod === 'nome' && READERS8.has(e.id)) dmg = Math.round(dmg * 1.3);
  if (typeof fichaDmg === 'function') dmg = fichaDmg(e, dmg);
  return _he(e, dmg, kind, col);
}; }

// ---------- animações que faltavam (Dilúvio e Nada, do Cap. 7) ----------
TECH_FX.diluvio = async () => {
  const n = Math.max(1, Math.min(8, carry().length)), ts = fxAlive();
  await fxRun(16, (k, p) => { fxGlow(BPX, BPY - 14, 6 + p * 14, '#f0c040', 0.35); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + k * 0.2; fxR(BPX + Math.cos(a) * 14 * p - 2, BPY - 20 + Math.sin(a) * 6 * p, 4, 6, '#f0c040'); fxP(BPX + Math.cos(a) * 14 * p - 1, BPY - 20 + Math.sin(a) * 6 * p, '#fff4c0'); } });
  await fxRun(30, (k, p) => {
    const fx0 = BPX + 10 + p * 220;
    for (let x = BPX + 6; x < Math.min(240, fx0); x += 3) { const hh = 6 + Math.max(0, Math.sin((x - fx0) * 0.08)) * 18 * (1 - (fx0 - x) / 260); fxR(x, BPY + 2 - hh, 3, hh, '#c8962a'); fxR(x, BPY + 2 - hh, 3, 1, '#fff4c0'); }
    for (let i = 0; i < n; i++) { const x = Math.min(236, fx0 - i * 12), y = BPY - 18 - Math.sin(k * 0.3 + i) * 4; fxDisc(x, y, 3, '#f0c040'); fxR(x - 1, y - 1, 1, 1, '#07050c'); fxR(x + 1, y - 1, 1, 1, '#07050c'); }
  });
  for (const t of ts) impactAt('ambar', t, 1.2);
};
TECH_FX.nada = async () => {
  await fxRun(36, (k, p) => {
    const q = Math.sin(p * Math.PI);
    bx.globalAlpha = 0.55 * q; fxR(0, 0, 240, 132, '#07050c'); bx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { const r = 6 + ((k * 0.8 + i * 9) % 26); fxRing(BPX, BPY - 14, r, i === 0 ? '#c0c8d8' : '#5a6070', r * 0.7); }
    fxDisc(BPX, BPY - 14, 5 * q, '#07050c');
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 - k * 0.05, r = 30 - p * 24; fxP(BPX + Math.cos(a) * r, BPY - 14 + Math.sin(a) * r * 0.7, '#c0c8d8'); }
  });
};

// ---------- itens ----------
Object.assign(ITEMS, {
  pagina: { name: 'Página em Branco', mp: 90, cure: true, desc: 'Recupera 90 PM e apaga o esquecimento. Ninguém escreveu nada nela ainda. É isso que ela tem de bom.' }
});
Object.assign(MAP_D, { garganta: 21, terminal8: 21, scriptorium8: 22, biblioteca8: 23, indice: 24, tampa: 24 });

// ---------- PASSAGEIROS DO 31 (ajuda nos obstáculos) ----------
// cada ajudante: quem é, quando está no ônibus, quais obstáculos resolve e a cena curta
const HELPERS8 = {
  musgo: { n: 'Musgo', sp: 'musgo', ok: () => true, kinds: ['entulho', 'porta'], who: 'musgo',
    say: { entulho: 'COM LICENÇA, PEDRA.', porta: 'PORTA. NÃO.' }, act: { entulho: '* O Musgo encosta o ombro de pedra no entulho e empurra. Tudo rola para o lado com um barulho de mudança.', porta: '* O Musgo arranca a porta das dobradiças e encosta ela na parede, com cuidado, como quem guarda um guarda-chuva.' } },
  lume: { n: 'Lume', sp: 'lume', ok: () => true, kinds: ['escuro', 'fila'], who: 'lume',
    say: { escuro: 'Deixa comigo. Eu odeio escuro, lembra?', fila: 'Eles não têm rosto, mas têm ouvido.' }, act: { escuro: '* A Lume acende todas as velas de uma vez. O escuro recua como gato molhado.', fila: '* A Lume canta a música do ônibus. A fila de desbotados para, escuta, e abre caminho em silêncio.' } },
  jorge: { n: 'Seu Jorge', sp: 'jorge', ok: () => true, kinds: ['vao'], who: 'jorge',
    say: { vao: 'Segura aí. Já fiz baliza em ladeira de paralelepípedo com chuva.' }, act: { vao: '* O Seu Jorge encosta o 31 de ré na beira do buraco e abre as duas portas. O ônibus vira ponte. Todo mundo passa por dentro.' } },
  tiago: { n: 'Tiago', sp: 'hunter', ok: () => G.flags.tiagoTaken, kinds: ['fila', 'porta'], who: 'tiago',
    say: { fila: 'Avaliação: são passageiros. Só isso. Passageiros cansados.', porta: 'Fechadura da Guilda. Eu tenho a chave mestra. Eu era cobrador, lembra?' }, act: { fila: '* O Tiago passa a catraca imaginária e cobra a passagem de cada um, com gentileza. Eles pagam com nada e saem da fila.', porta: '* CLIC. O Tiago abre a porta com um molho de chaves que ele jura que não roubou.' } },
  marlene: { n: 'Dona Marlene', sp: 'marlene', ok: () => G.flags.marleneFate === 'conosco', kinds: ['entulho', 'fila'], who: 'marlene',
    say: { entulho: 'Setenta e oito anos e ainda tenho que fazer tudo sozinha.', fila: 'Fila? Eu tenho prioridade. Licença!' }, act: { entulho: '* A Dona Marlene corta o entulho em quatro com a espada e varre os pedaços com o pé.', fila: '* A Dona Marlene levanta a espada e a carteirinha de idosa ao mesmo tempo. A fila se abre com respeito.' } },
  rita: { n: 'Rita', sp: 'rita', ok: () => G.flags.dateDone, kinds: ['porta', 'entulho'], who: 'rita',
    say: { porta: 'Porta trancada? Fofa.', entulho: 'Sai da frente, mala. Isso aí é trabalho de escudeira.' }, act: { porta: '* A Rita dá um chute na porta. Ela não abre. A Rita dá outro. Ela abre, e a Rita finge que foi no primeiro.', entulho: '* A Rita enfia o escudo embaixo da pedra maior e faz alavanca. O entulho desmonta.' } },
  neide: { n: 'Profª Neide', sp: 'neide', ok: () => ['lembrou', 'resgatado'].includes(G.flags.soul_neide), kinds: ['fila'], who: 'neide',
    say: { fila: 'Silêncio! Vou fazer a chamada.' }, act: { fila: '* A Profª Neide abre o diário de classe e chama nome por nome. Cada desbotado que ouve o próprio nome sai da fila, devagar, e vai sentar no fundo do 31.' } },
  ozorio: { n: 'Seu Ozório', sp: 'ozorio', ok: () => ['lembrou', 'resgatado'].includes(G.flags.soul_ozorio), kinds: ['escuro'], who: 'ozorio',
    say: { escuro: 'Olha o pastel! Três e cinquenta! ...Desculpa, força do hábito.' }, act: { escuro: '* O Seu Ozório acende o fogareiro do tacho. O escuro cheira a feira de segunda e recua.' } },
  cida: { n: 'Dona Cida', sp: 'cida', ok: () => soulOk('cida'), kinds: ['escuro', 'vao'], who: 'cida',
    say: { escuro: 'Gato enxerga no escuro, meu bem. Mesmo gato de óculos.', vao: 'Eu pulo e amarro a corda do outro lado. Não olha.' }, act: { escuro: '* A Dona Cida vai na frente, de olhos acesos, dizendo "pedra, pedra, buraco, pedra". Todo mundo passa.', vao: '* A Dona Cida pula o vão com a corda na boca e amarra do outro lado, com um nó que ela aprendeu em 1974.' } },
  aprendizes: { n: 'Pip, Nina e Tolo', sp: 'pip', ok: () => G.flags.aprendizesDone, kinds: ['vao', 'porta'], who: 'pip',
    say: { vao: 'Formação de ponte! A capitã ensinou!', porta: 'O Tolo sabe abrir isso. Ele não sabe COMO sabe.' }, act: { vao: '* Os três aprendizes jogam ganchos, esticam cordas e fazem uma ponte da Guilda em dez segundos. A Brida teria aprovado.', porta: '* O Tolo encosta o ouvido na fechadura, mexe num grampo e a porta abre. Ninguém pergunta onde ele aprendeu.' } },
  duda: { n: 'Duda', sp: 'duda', ok: () => G.flags.dudaMet, kinds: ['fila', 'entulho'], who: 'duda',
    say: { fila: 'Eu fiquei nessa fila uma vez. Deixa que eu falo com eles.', entulho: 'Heroína desertora, mas ainda heroína.' }, act: { fila: '* A Duda fala com a fila como quem fala com amigos de escola. Eles lembram de alguma coisa e vão embora.', entulho: '* A Duda conjura uma bola de luz de herói e explode o entulho. "Nossa. Nunca tinha feito isso dar certo."' } }
};
// almas trazidas do âmbar também ajudam: cada uma tem o seu jeito
const RESC8 = {
  priscila: ['* A Priscila, a enfermeira, aproveita a parada para olhar as suas rachaduras. "Fica parado. Isso vai arder."', 'heal'],
  teo: ['* O Téo divide a pizza que ainda está quente. Ninguém entende como. Todo mundo come.', 'heal'],
  rafael: ['* O Rafael segura a lanterna com a mão que não está fechada no anel.', null],
  luzia: ['* A Irmã Luzia conta uma piada tão ruim que o obstáculo parece ficar com vergonha.', null],
  kaua: ['* O Kauã, que trabalhava de madrugada, carrega pedra sem reclamar. "Isso aqui é mais leve que saco de farinha."', null],
  zelia: ['* A Dona Zélia costura um remendo na sua dobradiça com linha dourada. "Pronto. Fica de pé até o fim."', 'heal'],
  benedito: ['* O Seu Benedito narra tudo no rádio de pilha como se fosse final de campeonato.', null],
  nilo: ['* O Velho Nilo serve sopa numa concha de novecentos anos. Está boa.', 'heal']
};
const OBST8 = {
  entulho: ['* Um desabamento fecha o caminho. Pedra, trilho torto e pedaços de teto.', 'r'],
  escuro: ['* Escuro total. Não é falta de luz: é escuro de masmorra, do tipo que morde.', 'k'],
  vao: ['* O chão caiu. Um vão fundo, com o mar de âmbar lá embaixo, subindo devagar.', 'v'],
  porta: ['* Uma porta de ferro da Guilda, trancada por fora. Atrás dela, o caminho.', 'p'],
  fila: ['* Uma fila de passageiros desbotados, parada no meio do caminho, esperando um ônibus que não vem.', 'f']
};
function helpers8(kind) { return Object.entries(HELPERS8).filter(([k, h]) => h.ok() && h.kinds.includes(kind)); }
STORY.obst8 = async function (e) {
  const f = G.flags, kind = e.obst, [desc] = OBST8[kind];
  await say(desc);
  if (!f.tut_obst8) { f.tut_obst8 = true; sfx('catalog'); await say('[PASSAGEIROS DO 31: obstáculos se resolvem chamando quem está no ônibus. Quem pode ajudar depende de quem você trouxe até aqui.]', 'cat'); }
  const hs = helpers8(kind), saved = (f.saved7 || []).filter(k => RESC8[k]);
  const opts = hs.map(([, h]) => h.n);
  const i = await choose('* Quem você chama?', [...opts, 'Ninguém agora'], 'n', opts.length);
  if (i < 0 || i >= opts.length) return;
  const [hk, h] = hs[i];
  await say(h.say[kind], h.who);
  await say(h.act[kind]);
  f.helped8 = f.helped8 || []; if (!f.helped8.includes(hk)) f.helped8.push(hk);
  f[e.hide] = true; refreshEnts(); sfx('rumble');
  if (saved.length) {
    const s = saved[(f.helped8.length + e.x) % saved.length], [line, eff] = RESC8[s];
    await say(line);
    if (eff === 'heal') { const v = Math.round(G.st.mhp * 0.2); G.hp = Math.min(G.st.mhp, G.hp + v); sfx('heal'); await say(`* (+${v} PV.)`); }
  }
  saveGame();
};

// ---------- sprites ----------
const S8 = {
  // obstáculos no mapa
  ob_entulho: f => cv4(16, 16, r => { r(0, 6, 16, 10, 'k'); r(1, 8, 6, 7, '#6a6058'); r(6, 6, 7, 9, '#5a5048'); r(11, 9, 4, 6, '#7a7068'); r(2, 8, 4, 1, '#8a8078'); r(7, 6, 5, 1, '#8a8078'); r(3, 12, 10, 1, '#3a3632'); r(12, 3 + f, 1, 6, '#5a6070'); r(4, 2 - f, 2, 2, '#6a6058'); }),
  ob_escuro: f => cv4(16, 16, r => { r(0, 0, 16, 16, '#07050c'); r(1, 1, 14, 14, '#0c0a14'); r(4, 6 + f, 2, 1, '#ff5050'); r(10, 6 + f, 2, 1, '#ff5050'); r(6, 11, 4, 1, '#2a2438'); }),
  ob_vao: f => cv4(16, 16, r => { r(0, 0, 16, 16, 'k'); r(1, 1, 14, 14, '#120a04'); r(3, 8, 10, 6, '#7a4a08'); r(4, 9 + f, 8, 2, '#c8962a'); r(5, 9 + f, 2, 1, '#fff4c0'); r(0, 0, 16, 2, '#3a3632'); }),
  ob_porta: f => cv4(16, 16, r => { r(1, 0, 14, 16, 'k'); r(2, 1, 12, 15, '#5a5a6a'); r(2, 1, 12, 1, '#8a8a9a'); for (const y of [4, 10]) r(2, y, 12, 2, '#3a3a48'); r(10, 7, 3, 3, '#c83838'); r(11, 8, 1, 1, '#f0c040'); r(5, 7, 2, 2, f ? '#8a8a9a' : '#3a3a48'); }),
  ob_fila: f => cv4(16, 16, r => { for (let i = 0; i < 3; i++) { const x = 1 + i * 5, y = 2 + (i + f) % 2; r(x, y, 4, 4, 'k'); r(x + 1, y + 1, 2, 2, '#b8b4c8'); r(x, y + 4, 4, 9, 'k'); r(x + 1, y + 5, 2, 7, '#8a8698'); } }),
  pagina8: f => cv4(16, 16, r => { r(3, 2 + f, 10, 12, 'k'); r(4, 3 + f, 8, 10, '#f2ecdc'); for (let y = 5; y < 12; y += 2) r(5, y + f, 6 - (y % 4), 1, '#5a6ad0'); r(9, 10 + f, 2, 2, '#f0c040'); }),
  catalogoW: f => cv4(16, 16, r => { r(0, 3 + f, 16, 10, 'k'); r(1, 4 + f, 6, 8, '#f2ecdc'); r(9, 4 + f, 6, 8, '#f2ecdc'); r(7, 4 + f, 2, 9, '#3a2a5a'); for (let y = 6; y < 11; y += 2) { r(2, y + f, 4, 1, '#5a6ad0'); r(10, y + f, 4, 1, '#5a6ad0'); } r(3, 7 + f, 1, 1, '#a8ecff'); r(12, 7 + f, 1, 1, '#a8ecff'); r(7, 13 + f, 1, 3, '#c83838'); }),
  // inimigos pequenos (1x)
  tinteiro: f => cv4(16, 16, r => { r(3, 5, 10, 10, 'k'); r(4, 6, 8, 8, '#1c2a6a'); r(4, 6, 8, 2, '#3a4ab0'); r(6, 2, 4, 4, 'k'); r(7, 3, 2, 2, '#2a2a3a'); r(6, 9, 1, 2, '#ffffff'); r(9, 9, 1, 2, '#ffffff'); r(6, 10, 1, 1, 'k'); r(9, 10, 1, 1, 'k'); r(5 + f * 5, 0, 2, 3 - f, '#5a6ad0'); r(2, 14, 12, 1, '#101a4a'); }),
  marcador: f => cv4(16, 16, r => { for (let i = 0; i < 6; i++) { const x = 2 + i * 2, y = 8 + Math.round(Math.sin(i + f * 2) * 3); r(x - 1, y - 1, 3, 4, 'k'); r(x, y, 2, 2, i % 2 ? '#c83838' : '#e84848'); } r(12, 3 + f, 4, 5, 'k'); r(13, 4 + f, 2, 3, '#e84848'); r(13, 5 + f, 1, 1, '#ffe066'); r(14, 8 + f, 1, 2, '#f0c040'); })
};
function buildSprites8() {
  for (const k of Object.keys(S8)) SP[k] = [S8[k](0), S8[k](1)];
  const add = (c, fn) => { fn(c.getContext('2d')); return c; };
  const R = (x, a, b, w, h, col) => { x.fillStyle = PAL[col] || col; x.fillRect(a, b, w, h); };
  const two = (map, fn) => [0, 1].map(f => add(hum(map), x => fn && fn(x, f)));
  // Passageiro sem Rosto: um passageiro desbotado, rosto liso, bilhete na mão
  SP.passageiro = two({ G: '#6a6880', m: '#4a4860', l: '#7a7890', S: '#b8b4c8', h: '#8a8698', y: '#d8d4e0', n: '#b8b4c8' }, (x, f) => { R(x, 5, 4, 6, 3, '#b8b4c8'); R(x, 12, 9 + f, 3, 2, '#e8dcc0'); R(x, 13, 9 + f, 1, 1, '#c83838'); });
  // Leitor de Cinzas: capuz, livro aberto que solta brasa
  SP.leitor = two({ G: '#3a3448', m: '#2a2438', l: '#4a4458', S: '#2a2438', h: '#3a3448', y: '#ff8030', n: '#2a2438' }, (x, f) => { R(x, 5, 5, 2, 1, '#ff8030'); R(x, 9, 5, 2, 1, '#ff8030'); R(x, 4, 9, 8, 3, '#07050c'); R(x, 5, 9, 3, 2, '#e8dcc0'); R(x, 9, 9, 3, 2, '#e8dcc0'); R(x, 7 + f, 7 - f, 1, 2, '#ffb040'); });
  SP.fichario = [0, 1].map(f => cv4(16, 16, r => { r(2, 1, 12, 15, 'k'); r(3, 2, 10, 13, '#5a4a3a'); for (let i = 0; i < 3; i++) { const y = 3 + i * 4, o = i === 1 ? f * 2 : 0; r(3 + o, y, 10, 3, 'k'); r(4 + o, y, 8, 2, '#8a6a4a'); r(7 + o, y + 1, 2, 1, '#f0c040'); if (i === 1 && f) { r(4 + o, y + 2, 8, 1, '#f2ecdc'); for (let t = 5; t < 12; t += 2) r(t + o, y + 2, 1, 1, 'k'); } } r(5, 6, 1, 1, '#ff5050'); r(10, 6, 1, 1, '#ff5050'); }));
  SP.boca = [0, 1].map(f => cv4(16, 16, r => { r(0, 2, 16, 12, 'k'); r(1, 3, 14, 10, '#4a1014'); r(2, 5 - f, 12, 6 + f * 2, '#120408'); for (let i = 3; i < 14; i += 2) { r(i, 5 - f, 1, 2, '#e8e4dc'); r(i, 9 + f, 1, 2, '#e8e4dc'); } r(5, 7, 6, 2, '#a82838'); r(1, 3, 14, 1, '#7a2028'); r(7, 0, 2, 3, '#f0c040'); }));
}
// tile 'O' novo neste capítulo? não: usamos os tiles que já existem (B estante, r entulho, K caixote, V ônibus)

// ---------- O Escriba (mini-chefe): a mão do Catálogo, sem corrente ----------
const BIGSP8 = {
  escriba: () => big(48, 48, g => {
    const { r, E, EO, L, f } = g, robe = '#2a2448', robeH = '#4a3a78', robeD = '#18122c', ink = '#3a4ab0', inkD = '#101a4a', paper = '#f2ecdc';
    // pergaminho que desenrola atrás, balançando
    for (let i = 0; i < 9; i++) { const y = 6 + i * 4, x = 36 + Math.round(Math.sin(i * 0.8 + f * 1.4) * 3); r(x, y, 10, 4, 'k'); r(x + 1, y, 8, 4, i % 2 ? paper : '#e0d6c0'); r(x + 2, y + 1, 5 - (i % 3), 1, ink); }
    // corpo: manto longo
    r(10, 18, 26, 28, 'k'); r(11, 19, 24, 27, robe); r(11, 19, 4, 27, robeH); r(30, 19, 5, 27, robeD); for (let y = 24; y < 46; y += 6) r(14, y, 18, 1, robeD);
    // capuz e rosto em sombra, com olhos de tinta acesa
    EO(23, 12, 10, 10, robe); E(23, 14, 7, 7, '#07050c'); r(14, 4, 18, 3, robeH);
    r(19, 13, 3, 2, f % 2 ? '#a8ecff' : '#5a9ae0'); r(25, 13, 3, 2, f % 2 ? '#a8ecff' : '#5a9ae0'); r(20, 13, 1, 1, '#ffffff'); r(26, 13, 1, 1, '#ffffff');
    // algemas quebradas com pedaço de corrente
    for (const [x, y, dir] of [[8, 30, -1], [34, 28, 1]]) { r(x, y, 6, 4, 'k'); r(x + 1, y + 1, 4, 2, '#8a8099'); for (let i = 0; i < 3; i++) { const cx = x + 3 + dir * (4 + i * 3), cy = y + 5 + i * 2 + (f % 2) * (i % 2); E(cx, cy, 1, 1, '#5a5070'); } }
    // braço direito com a pena gigante, escrevendo
    const w = [0, -2, 1, -1][f];
    L(30, 26, 40, 20 + w, 'k', 4); L(30, 26, 40, 20 + w, robe, 2);
    L(40, 22 + w, 47, 2 + w, 'k', 3); L(41, 21 + w, 46, 4 + w, '#e8e4dc', 1); for (let i = 0; i < 5; i++) r(43 + (i % 2), 6 + i * 3 + w, 3, 1, '#d8d0c0'); r(39, 22 + w, 2, 4, inkD); r(39, 26 + w + f, 1, 2, ink);
    // tinteiro flutuando à esquerda
    const iy = 22 + [0, 1, 2, 1][f]; r(1, iy, 8, 9, 'k'); r(2, iy + 1, 6, 7, inkD); r(2, iy + 1, 6, 2, ink); r(3, iy - 2, 4, 3, 'k'); r(4, iy - 1, 2, 1, '#5a5070');
    // livro aberto no colo (o Catálogo que ele copia)
    r(13, 34, 22, 9, 'k'); r(14, 35, 9, 7, paper); r(25, 35, 9, 7, paper); r(23, 35, 2, 8, '#3a2a5a');
    for (let y = 36; y < 41; y += 2) { r(15, y, 7 - (y % 3), 1, ink); r(26, y, 6 - (y % 4), 1, ink); }
    r(25, 40, 3 + f, 1, '#c83838');
  })
};
// ---------- retratos ----------
function buildPorts8() {
  PORT.catalogo = pcv((r, fr) => {
    r(1, 6, 30, 22, 'k'); r(2, 7, 13, 20, '#f2ecdc'); r(17, 7, 13, 20, '#f2ecdc'); r(15, 6, 2, 22, '#3a2a5a');
    for (let y = 10; y < 25; y += 3) { r(4, y, 9 - (y % 4), 1, '#5a6ad0'); r(19, y, 9 - (y % 5), 1, '#5a6ad0'); }
    // rosto de colchetes
    r(6, 12, 1, 7, '#2a2448'); r(6, 12, 3, 1, '#2a2448'); r(6, 18, 3, 1, '#2a2448'); r(25, 12, 1, 7, '#2a2448'); r(23, 12, 3, 1, '#2a2448'); r(23, 18, 3, 1, '#2a2448');
    if (fr !== 2) { r(9, 14, 3, 3, '#a8ecff'); r(20, 14, 3, 3, '#a8ecff'); r(10, 15, 1, 1, '#ffffff'); r(21, 15, 1, 1, '#ffffff'); } else { r(9, 15, 3, 1, '#2a2448'); r(20, 15, 3, 1, '#2a2448'); }
    if (fr === 1) r(12, 21, 8, 2, '#2a2448'); else r(12, 22, 8, 1, '#2a2448');
    r(14, 26, 2, 6, '#c83838'); r(18, 26, 2, 5, '#3a70c0');
  });
}
// ---------- música ----------
Object.assign(TRACKS, {
  garganta8: { bpm: 138, bars: 4, chords: 'Dm Bb C A', bass: 'oct8', bassVol: 0.14, lead: 'D5:2 F5:2 A5:2 D6:2 C6:4 A5:4 | Bb5:2 A5:2 F5:2 D5:2 F5:4 Bb5:4 | C6:2 E6:2 G6:2 E6:2 C6:4 G5:4 | A5:4 C#6:4 E6:8', leadWave: 0.25, leadVol: 0.06, drums: 'k.hsk.hsk.hsk.hs', hatVol: 0.04 },
  ruinas8: { bpm: 96, bars: 4, chords: 'Am F C G', bass: 'root5', bassVol: 0.1, lead: 'E5:4 A5:4 C6:6 B5:2 | A5:4 F5:4 A5:8 | G5:4 C6:4 E6:6 D6:2 | B5:8 G5:8', leadWave: 'triangle', leadVol: 0.06, arp: { rate: 2, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k...h...k.k.h...', hatVol: 0.03 },
  biblio8: { bpm: 70, bars: 4, chords: 'Fmaj7 Em7 Dm7 Cmaj7', bass: 'whole', bassVol: 0.08, lead: 'A5:6 G5:2 E5:8 | G5:6 F5:2 D5:8 | F5:4 E5:4 D5:4 C5:4 | E5:12 .:4', leadWave: 'triangle', leadVol: 0.06, pad: true, padVol: 0.03, arp: { rate: 2, vol: 0.012, pat: [0, 2, 1, 3] } },
  indice8: { bpm: 60, bars: 4, chords: 'Cm Abmaj7 Fm Gsus4', bass: 'whole', bassVol: 0.07, lead: 'G5:4 .:4 Eb6:8 | C6:8 G5:8 | Ab5:4 C6:4 F6:8 | D6:12 .:4', leadWave: 'triangle', leadVol: 0.05, pad: true, padVol: 0.035 },
  boss8a: { bpm: 152, bars: 8, chords: 'Gm Eb F D Gm Eb Cm D', bass: 'oct8', bassVol: 0.16,
    lead: 'G5:2 Bb5:2 D6:2 G6:2 F6:4 D6:4 | Eb6:2 D6:2 Bb5:2 G5:2 Bb5:4 Eb6:4 | F6:4 C6:2 A5:2 F5:4 A5:4 | F#5:2 A5:2 D6:4 C6:2 A5:2 F#5:4 | G5:2 D6:2 G5:2 D6:2 Bb5:4 G5:4 | Eb6:4 Bb5:4 G5:4 Eb5:4 | C6:2 Eb6:2 G6:2 C7:2 Bb6:4 A6:4 | A6:4 F#6:4 D6:4 A5:4',
    leadVol: 0.07, arp: { rate: 1, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 },
  final8: { bpm: 172, bars: 8, chords: 'Em C G D Em C Am B', bass: 'oct8', bassVol: 0.18,
    lead: 'B5:2 E6:2 G6:2 B6:2 A6:4 G6:4 | E6:2 G6:2 C7:2 G6:2 E6:4 C6:4 | D6:2 G6:2 B6:2 D7:2 C7:4 B6:4 | A6:2 F#6:2 D6:2 F#6:2 A6:8 | B6:2 G6:2 E6:2 G6:2 B6:4 E7:4 | C7:4 G6:4 E6:4 C6:4 | A5:2 C6:2 E6:2 A6:2 G6:4 E6:4 | D#6:4 F#6:4 B6:8',
    leadVol: 0.075, arp: { rate: 1, vol: 0.016, pat: [0, 2, 1, 3] }, drums: 'k.hsk.hskkhsk.ss', hatVol: 0.045 },
  final8b: { bpm: 184, bars: 8, chords: 'Em Em C C Am Am B B', bass: 'oct8', bassVol: 0.2,
    lead: 'E6:1 G6:1 B6:2 E7:4 D7:2 B6:2 G6:4 | E6:2 B5:2 E6:2 G6:2 B6:8 | C7:2 G6:2 E6:2 C6:2 E6:4 G6:4 | C7:4 E7:4 C7:8 | A6:2 E6:2 C6:2 E6:2 A6:4 C7:4 | B6:4 A6:4 E6:8 | D#6:2 F#6:2 B6:2 D#7:2 F#7:4 D#7:4 | B6:8 F#6:8',
    leadVol: 0.08, arp: { rate: 1, vol: 0.018, pat: [0, 1, 2, 3] }, drums: 'kkhsk.hskkhskshs', hatVol: 0.05 },
  ceu8: { bpm: 84, bars: 4, chords: 'Cmaj7 G/B Am7 Fmaj7', bass: 'whole', bassVol: 0.08, lead: 'E5:4 G5:4 C6:6 B5:2 | D6:4 B5:4 G5:8 | C6:4 E6:4 A6:6 G6:2 | F6:4 E6:4 C6:8', leadWave: 'triangle', leadVol: 0.07, pad: true, padVol: 0.035, arp: { rate: 2, vol: 0.015, pat: [0, 1, 2, 3] } }
});
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites8(); SP.escriba8B = BIGSP8.escriba(); buildPorts8(); buildCatalogoSp(); }; }
WHO.catalogo = { name: () => 'O Catálogo', portrait: t => portFrame('catalogo', t), voice: () => sfx('blipTri', 1500), col: '#a8ecff' };

// ---------- inimigos ----------
Object.assign(ENEMIES, {
  passageiro: { name: 'Passageiro sem Rosto', sp: 'passageiro', hp: 520, atk: 104, def: 24, xp: 260, weak: { ceu: 1.4, canto: 1.2 }, drops: [['pagina', .15]],
    calm: { els: ['canto', 'ceu'], need: 3, msg: 'lembrou que tinha um rosto', bye: 'guardou o bilhete no bolso e foi esperar o ônibus certo' },
    flavor: ['* O Passageiro sem Rosto segura um bilhete. O número está apagado.', '* Ele pergunta se esse ônibus passa no centro. Não tem boca para perguntar.'],
    check: 'Passageiro que esqueceu de tudo. Golpes de quem empurra na fila. ACALMAR: CANTO ou CÉU (3).',
    moves: [{ k: 'seq', n: 6, p: 0.45, hide: true, spd: 1.2, w: 2, t: '* Ele repete o itinerário e esquece no meio. Lembre por ele!' }, { k: 'ring', p: 1.15, w: 2, t: '* Uma cotovelada de hora do rush!' }, { k: 'mash', p: 1, need: 16, bind: true, w: 1, t: '* Ele te segura pela alça, como quem segura a barra do ônibus!' }] },
  tinteiro: { name: 'Tinteiro Errante', sp: 'tinteiro', hp: 360, atk: 100, def: 18, evade: 0.2, xp: 210, weak: { brasa: 1.3, ceu: 1.3, geada: 1.2 }, drops: [['tinta', .3]],
    flavor: ['* O Tinteiro Errante pinga. Cada pingo vira uma palavrinha que sai correndo.', '* Ele cheira a prova de fim de ano.'],
    check: 'Joga tinta nos olhos (cegueira). Pequeno e escorregadio. CÉU limpa a tinta.',
    moves: [{ k: 'ring', p: 0.95, st: 'blind', blindBy: 'tinta', w: 2, t: '* Um jato de tinta azul bem no seu olho!' }, { k: 'dodge', p: 0.5, hits: 4, spd: 1.45, w: 2, t: '* Respingos de tinta para todo lado!' }, { k: 'spell', p: 1, el: 'sombra', name: 'Borrão', w: 1, t: '* {p}Borrão{/}! Uma mancha de tinta viva voa em você.' }] },
  marcador: { name: 'Marca-Página', sp: 'marcador', hp: 400, atk: 102, def: 20, evade: 0.15, xp: 220, weak: { brasa: 1.5, vento: 1.2 }, drops: [['bala', .2]],
    flavor: ['* O Marca-Página ondula como fita de presente. De presente ele não tem nada.', '* Ele marca a página em que você vai parar.'],
    check: 'Fita viva: enrola e aperta. BRASA queima papel e fita.',
    moves: [{ k: 'mash', p: 1.1, need: 17, bind: true, w: 2, t: '* O Marca-Página te enrola como um livro de presente!' }, { k: 'dodge', p: 0.55, hits: 3, spd: 1.55, w: 2, t: '* Chicotadas de fita, rápidas!' }] },
  fichario: { name: 'Fichário Vivo', sp: 'fichario', hp: 640, atk: 106, def: 38, xp: 260, weak: { brasa: 1.4, polvora: 1.3, bite: 0.8 }, drops: [['pagina', .2]],
    biteMsg: 'Você mordeu uma gaveta de ferro. Ela mordeu de volta.',
    flavor: ['* O Fichário Vivo abre e fecha as gavetas como quem estala os dedos.', '* Uma ficha cai dele. Tem o seu nome, escrito errado.'],
    check: 'Gavetas que mordem e prendem. Arquiva os seus feitiços (esquecimento). BRASA e PÓLVORA.',
    moves: [{ k: 'ring', p: 1.3, w: 2, t: '* A gaveta do meio abre e morde!' }, { k: 'spell', p: 1, el: 'sombra', name: 'Arquivo Morto', st: 'forget', w: 2, t: '* {p}Arquivo Morto{/}! Uma ficha sua some numa gaveta.' }, { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* O Fichário tranca as gavetas de um aliado com chave.' }] },
  leitor: { name: 'Leitor de Cinzas', sp: 'leitor', hp: 560, atk: 108, def: 26, xp: 280, ai: 'leitor', weak: { geada: 1.3, ceu: 1.3 }, drops: [['pagina', .25]],
    flavor: ['* O Leitor de Cinzas lê em voz alta. A página pega fogo no fim de cada frase.', '* Ele está lendo você.'],
    check: 'LÊ o seu último feitiço e lança de volta (se ele não estiver assinado com NOME). GEADA apaga as cinzas.',
    moves: [{ k: 'spell', p: 1.1, el: 'brasa', name: 'Leitura em Voz Alta', st: 'burn', w: 2, t: '* {r}Leitura em Voz Alta{/}! As palavras saem pegando fogo.' }, { k: 'seq', n: 6, p: 0.45, spd: 1.25, w: 2, t: '* Ele lê rápido. Acompanhe a leitura!' }, { k: 'ring', p: 1.15, w: 1, t: '* Um golpe de livro fechado. PAF.' }] },
  boca: { name: 'Boca da Fome', sp: 'boca', hp: 860, atk: 112, def: 30, xp: 380, elite: true, weak: { ceu: 1.4, canto: 1.2, bite: 1.2 }, drops: [['bala', .4]],
    flavor: ['* A Boca da Fome abriu na parede. Ela é da Voz. A Voz está com pressa.', '* Ela mastiga o ar. O ar estava cheio de lembranças.'],
    check: 'Uma boca da Voz. COME os seus reforços e golpeia através da defesa. CÉU a faz fechar.',
    big: { k: 'ring', p: 2, pierce: true, fast: true },
    moves: [{ k: 'ring', p: 1.45, pierce: true, fast: true, w: 2, t: '* A Boca da Fome morde através da sua tampa!' }, { k: 'seq', n: 7, p: 0.45, hide: true, spd: 1.1, w: 2, t: '* Ela mastiga em sete tempos. Lembre a ordem!' }, { k: 'spell', p: 1.1, el: 'sombra', name: 'Fome', w: 1, t: '* {p}Fome{/}! A boca suga o ar e os seus reforços junto.', eat: true }] },
  escriba8: { name: 'O Escriba', sp: 'escriba8B', hp: 4100, atk: 100, def: 30, xp: 3600, boss: true, ai: 'escriba8', weak: { brasa: 1.25, ceu: 1.15 },
    flavor: ['* O Escriba escreve no ar. As letras ficam paradas, esperando.', '* "Eu só copio. Eu sempre só copiei."'], flavor2: ['* O Escriba escreve com as duas mãos. Uma copia, a outra risca.', '* A tinta dele está acabando. Ele usa a própria sombra.'],
    check: 'A mão do Catálogo. RISCA um comando antes de agir (MORDER, MAGIA ou ITEM): não use o comando riscado. COPIA o seu último feitiço (NOME impede). BRASA queima papel.' }
});
EN_TINY.add('tinteiro'); EN_TINY.add('marcador');
// o Leitor lê o seu último feitiço e lança de volta; a Boca come os seus reforços
AI.leitor = async function (e) {
  const sp = BT.lastSpell;
  if (sp && sp.form !== 'veu' && sp.mod !== 'nome' && Math.random() < 0.45) {
    await bSay(`* O Leitor de Cinzas lê o seu {y}${sp.name}{/} em voz alta... e conjura de volta!`, { auto: 45 });
    return runMove(e, { k: 'spell', p: 1.15, el: sp.el, name: sp.name + ' (lido)', t: `* {y}${sp.name}{/} volta queimando nas bordas!` });
  }
  return runMove(e, pickMove(e, e.d.moves));
};
{ const _rm = runMove; runMove = async function (e, mv) {
  if (mv && mv.eat && (BT.buff.atkT > 0 || BT.buff.defT > 0 || BT.choir > 0 || BT.amberShell > 0)) { BT.buff.atkT = 0; BT.buff.defT = 0; BT.buff.atkM = 1; BT.buff.defM = 1; BT.choir = 0; BT.amberShell = 0; await bSay('* A Boca da Fome engoliu os seus reforços!', { auto: 40 }); }
  return _rm(e, mv);
}; }

// ---------- AI do Escriba: RISCAR e COPIAR ----------
const STRIKE8 = { 0: 'MORDER', 1: 'MAGIA', 2: 'ITEM' };
AI.escriba8 = async function (e) {
  if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; shake(20); sfx('rumble'); await bSay('Eu copiei novecentos anos de gente. Nunca ninguém me perguntou se eu QUERIA.', { col: '#a8ecff' }); await bSay('* O Escriba larga a pena e pega outra. Agora ele escreve com as duas mãos.', { auto: 50 }); e.atk += 6; }
  const acts = e.p2 ? 2 : 1;
  for (let a = 0; a < acts && BT.on && G.hp > 0; a++) {
    // risca um comando para o seu próximo turno
    if (a === 0 && (e.turns % 2 === 0 || e.p2)) {
      const opts = [0, 1, 2].filter(i => i !== BT.struck8);
      BT.struck8 = pickOne(opts); BT.strikeFx8 = 50; sfx('catalog');
      await bSay(`* O Escriba risca no ar, em letras enormes: {r}${STRIKE8[BT.struck8]}{/}. (Se você usar esse comando no próximo turno, ele falha e dói.)`, { auto: 60 });
      if (!e.p2) continue;
    }
    // copia o seu último feitiço
    const sp = BT.lastSpell;
    if (sp && sp.form !== 'veu' && sp.mod !== 'nome' && Math.random() < 0.5) { await bSay(`* O Escriba copia o seu {y}${sp.name}{/} letra por letra... e lança de volta!`, { auto: 45 }); await runMove(e, { k: 'spell', p: 1.2, el: sp.el, name: sp.name + ' (cópia)', t: `* {y}${sp.name}{/}, com a letra dele.` }); continue; }
    if (e.turns % 5 === 4 && !e.shell) { e.shell = 2; await bSay('* O Escriba se cobre com mata-borrão. (Dano recebido pela metade por 2 turnos. FAÍSCA, VENTO ou CHAVE tiram.)', { auto: 45 }); continue; }
    await runMove(e, pickMove(e, [
      { k: 'seq', n: e.p2 ? 8 : 7, p: 0.42, hide: true, spd: 1.15, w: 2, t: '* "Ditado." Ele dita as setas e apaga o quadro. Escreva de memória!' },
      { k: 'dodge', p: 0.5, hits: e.p2 ? 5 : 4, spd: 1.45, w: 2, t: '* Letras soltas voam como estilhaços!' },
      { k: 'ring', p: 1.3, st: 'blind', blindBy: 'tinta', w: 1, t: '* Ele sacode a pena. Tinta nos seus olhos!' },
      { k: 'mash', p: 1.05, need: 17, bind: true, w: 1, t: '* O pergaminho te enrola como um rolo de lei!' }]));
  }
};
// o comando riscado falha e dói
function cmdGate(c) {
  if (BT.struck8 != null && BT.en.some(x => x.alive && x.id === 'escriba8')) {
    const s = BT.struck8; if (c > 2) return null; BT.struck8 = null;
    if (c === s) return (async () => { BT.strikeFx8 = 40; sfx('hurt'); const d = Math.round(G.st.mhp * 0.1); G.hp = Math.max(1, G.hp - d); BT.nums.push({ x: BPX, y: BPY - 40, s: '-' + d, col: '#ff6b6b', t: 50 }); pbPose('hurt', 20); markAct(['bite', 'spell', 'item'][s]); await bSay(`* {r}RISCADO!{/} A palavra ${STRIKE8[s]} está riscada. Você hesita e o risco corta a sua tampa. (-${d} PV)`, { auto: 55 }); return 'acted'; })();
  }
  if (typeof fichaGate === 'function') return fichaGate(c);
  return null;
}

// ================= O CATÁLOGO (chefe final) =================
// Não é um sprite fixo: o livro é desenhado ao vivo a cada quadro (páginas que viram, texto se escrevendo,
// fitas de marcador, rosto de colchetes). A arena inteira vira um livro aberto.
function buildCatalogoSp() { SP.catalogoB = [mk(112, 96)]; }
{ const _mk = mkEnemy; mkEnemy = function (id, i, n) { const e = _mk(id, i, n); if (id === 'catalogo') { e.x = 150; e.y = 58; } return e; }; }
const cat8 = () => BT.on && BT.en && BT.en.find(e => e.id === 'catalogo' && (e.alive || e.dying > 0));
const E8 = () => (BT.errata8 = BT.errata8 || {});
function c8R(x, y, w, h, col) { bx.fillStyle = col; bx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
// a arena: duas páginas gigantes no fundo, escrevendo sozinhas
function drawIndiceArena8(e) {
  const ph = e.phase8 || 1, t = FRAME, burn = ph === 3;
  bx.globalAlpha = 0.85; c8R(0, 0, 240, 132, burn ? '#120604' : '#06060e'); bx.globalAlpha = 1;
  for (const side of [0, 1]) {
    const x0 = side ? 122 : 6, w = 112;
    bx.globalAlpha = burn ? 0.22 : 0.16; c8R(x0, 6, w, 60, burn ? '#f0a040' : '#e8e4f0'); bx.globalAlpha = 1;
    c8R(x0, 6, w, 1, burn ? '#ffb040' : '#a8ecff');
    // linhas de texto que se escrevem e se apagam
    for (let l = 0; l < 9; l++) {
      const y = 11 + l * 6, full = 20 + ((l * 37 + side * 13) % 80), wr = Math.min(full, ((t * 0.6 + l * 23 + side * 40) % 160));
      bx.globalAlpha = 0.35; c8R(x0 + 6, y, wr, 1, burn ? '#ff8030' : '#5a6ad0');
      if (ph >= 2 && (l + side) % 3 === 0 && wr > 30) { bx.globalAlpha = 0.6; c8R(x0 + 10, y - 1, Math.min(wr - 10, 40), 1, '#ff3a4a'); c8R(x0 + 6 + wr - 4, y - 3, 4, 1, '#ff3a4a'); }
    }
    bx.globalAlpha = 1;
  }
  c8R(119, 4, 2, 64, burn ? '#7a2a10' : '#2a2448');
  if (burn) for (let i = 0; i < 10; i++) { const x = (i * 29 + t * 0.7) % 240, y = 66 - ((t * 0.9 + i * 17) % 66); c8R(x, y, 1, 2, i % 2 ? '#ffb040' : '#ff6030'); }
}
// o corpo do Catálogo
function drawCatalogo8(e) {
  const ph = e.phase8 || 1, t = FRAME, cx = e.x, cy = e.y + Math.sin(t * 0.05) * 2, burn = ph === 3;
  const fade = e.alive ? 1 : Math.max(0, e.dying / 36), sh = e.shake ? Math.sin(e.shake * 1.7) * 4 : 0;
  bx.save(); bx.globalAlpha = fade; bx.translate(Math.round(sh), 0);
  // halo
  bx.globalAlpha = 0.18 * fade; fxDisc(cx, cy, 52 + Math.sin(t * 0.04) * 3, burn ? '#ff8030' : '#5a9ae0'); bx.globalAlpha = 0.1 * fade; fxDisc(cx, cy, 64, burn ? '#ffd040' : '#a8ecff'); bx.globalAlpha = fade;
  // fitas de marcador (tentáculos) saindo da lombada
  const rib = [['#c83838', -1], ['#3a70c0', 0.2], ['#f0c040', 1], ['#7a4ad0', -0.5]];
  rib.forEach(([col, dir], i) => { let x = cx, y = cy + 29; for (let k = 0; k < 18; k++) { x += dir * 1.2 + Math.sin(t * 0.07 + k * 0.45 + i) * 1.4; y += 1.6; c8R(x - 2, y - 1, 4, 3, '#07050c'); c8R(x - 1, y - 1, 3, 2, col); } c8R(x - 2, y + 1, 5, 3, col); });
  // capa (atrás das páginas)
  c8R(cx - 55, cy - 33, 110, 64, '#07050c'); c8R(cx - 54, cy - 32, 108, 62, burn ? '#5a1a08' : '#2a2448'); c8R(cx - 54, cy - 32, 108, 2, burn ? '#c8501a' : '#4a3a78');
  for (const s of [-1, 1]) { c8R(cx + s * 49 - 2, cy - 29, 4, 4, '#f0c040'); c8R(cx + s * 49 - 2, cy + 23, 4, 4, '#f0c040'); }
  // páginas (as bordas de cima curvam)
  for (const s of [-1, 1]) {
    const px = s < 0 ? cx - 51 : cx + 2, curl = Math.round(Math.sin(t * 0.06 + s) * 2);
    c8R(px, cy - 28 + (s < 0 ? curl : -curl) * 0.5, 49, 56, burn ? '#f0c890' : '#f2ecdc');
    c8R(px, cy - 28, 49, 1, '#ffffff'); c8R(px + (s < 0 ? 0 : 48), cy - 28, 1, 56, burn ? '#c87a3a' : '#c8c0b0');
    // texto
    for (let l = 0; l < 8; l++) { const y = cy - 23 + l * 6, ww = 8 + ((l * 13 + (s + 1) * 7 + Math.floor(t / 30)) % 26); c8R(px + 4, y, ww, 1, burn ? '#a85020' : '#5a6ad0'); if (ph >= 2 && l % 3 === 1) c8R(px + 3, y, ww + 2, 1, '#e83a4a'); }
    // bordas queimando
    if (burn) for (let i = 0; i < 48; i += 3) { const hh = 2 + ((i * 7 + t) % 5); c8R(px + i, cy + 28 - hh, 3, hh, i % 2 ? '#ff6030' : '#ffb040'); c8R(px + i, cy - 28, 3, 1 + ((i + t) % 3), '#7a2a10'); }
  }
  // a página que vira sozinha
  const fl = (t % 140) / 140; if (fl < 0.35) { const a = fl / 0.35, w = Math.round(49 * Math.cos(a * Math.PI)); c8R(cx + Math.min(0, w), cy - 29 - Math.sin(a * Math.PI) * 6, Math.abs(w), 56, burn ? '#ffd8a0' : '#ffffff'); }
  // lombada / boca
  if (burn) { const o = 6 + Math.round(Math.abs(Math.sin(t * 0.08)) * 8); c8R(cx - 4, cy - 27, 8, 56, '#07050c'); c8R(cx - 3, cy - o, 6, o * 2, '#2a0408'); for (let i = -o + 2; i < o - 1; i += 3) { c8R(cx - 3, cy + i, 2, 1, '#f0c040'); c8R(cx + 1, cy + i + 1, 2, 1, '#f0c040'); } }
  else { c8R(cx - 2, cy - 29, 4, 58, '#3a2a5a'); c8R(cx - 1, cy - 29, 1, 58, '#5a4a7a'); }
  // o rosto de colchetes [ • ]
  const ec = burn ? '#ffe066' : ph === 2 ? '#ff6b7a' : '#a8ecff', bl = t % 200 < 6;
  for (const s of [-1, 1]) {
    const bxp = cx + s * 34, by = cy - 10;
    c8R(bxp - (s < 0 ? 0 : 3), by - 8, 3, 18, '#2a2448'); c8R(s < 0 ? bxp : bxp - 8, by - 8, 8, 3, '#2a2448'); c8R(s < 0 ? bxp : bxp - 8, by + 7, 8, 3, '#2a2448');
    const ex = cx + s * 21, ey = by - 1;
    if (bl) c8R(ex - 4, ey + 1, 8, 2, '#2a2448');
    else { bx.globalAlpha = 0.3 * fade; fxDisc(ex, ey + 1, 6, ec); bx.globalAlpha = fade; fxDisc(ex, ey + 1, 3, ec); c8R(ex - 1, ey, 2, 2, '#ffffff'); }
  }
  // letras soltas orbitando
  const L = '[ÍNDICE]';
  for (let i = 0; i < L.length; i++) { const a = t * 0.025 + i / L.length * Math.PI * 2; txt(L[i], cx + Math.cos(a) * 64 - 3, cy + Math.sin(a) * 38 - 6, { col: burn ? '#ffb040' : '#8fe3ff', alpha: 0.75 * fade }); }
  // flash ao levar dano
  if (e.flash > 0 && e.flash % 4 < 2) { bx.globalAlpha = 0.6; c8R(cx - 54, cy - 32, 108, 62, '#ffffff'); }
  bx.restore();
}
{ const _db = drawBattleBg; drawBattleBg = function () { _db(); const e = cat8(); if (e) { drawIndiceArena8(e); drawCatalogo8(e); } }; }
// por cima de tudo: o comando riscado do Escriba, as correções na ficha e o botão riscado
{ const _dbt = drawBattle; drawBattle = function () {
  _dbt();
  if (!BT.on) return;
  if (BT.strikeFx8 > 0 || (BT.struck8 != null && BT.en.some(x => x.alive && x.id === 'escriba8'))) {
    const k = BT.struck8; if (BT.strikeFx8 > 0) BT.strikeFx8--;
    if (k != null) { const x = 4 + k * 47; c8R(x - 1, 230, 46, 2, '#ff3a4a'); c8R(x + 2, 226, 40, 1, '#ff3a4a'); }
  }
  const E = BT.errata8; if (!E) return;
  if (E.registro) { c8R(98, 230, 44, 2, '#ff3a4a'); c8R(100, 227, 40, 1, '#ff3a4a'); }
  if (E.stampT > 0) { E.stampT--; const s = 1 + E.stampT / 20; bx.globalAlpha = Math.min(1, E.stampT / 10); txt(E.stampW || 'CORRIGIDO', 120, 118 - s * 4, { align: 'center', sz: s, col: '#ff3a4a', shadow: true }); bx.globalAlpha = 1; }
}; }
{ const _ps = drawPartyStrip; drawPartyStrip = function () {
  _ps();
  const E = BT.on && BT.errata8; if (!E || !E.nome) return;
  c8R(20, 134, 50, 13, '#07050c'); txt('ALMA 31', 21, 135, { col: '#ff6b7a' }); c8R(20, 140, 48, 1, '#ff3a4a');
}; }
{ const _pb = pbSprites; pbSprites = function (form) { return _pb(BT.on && BT.errata8 && BT.errata8.especie ? 'caixote' : form); }; }
{ const _ls = lumeSing; lumeSing = async function () { if (BT.errata8 && BT.errata8.nome) { await bSay('* A Lume abre a boca para te chamar... e o seu nome não sai. Ela só consegue cantar "Alma trinta e um".', { auto: 50 }); return; } return _ls(); }; }

// ----- A FICHA -----
const ERR8 = {
  nome: ['NOME', '[Correção na ficha: NOME. Onde se lê "@", leia-se "ALMA 31".]', 'Ninguém consegue te chamar. Sem ajudas, e o seu dano cai 20%.'],
  especie: ['ESPÉCIE', '[Correção na ficha: ESPÉCIE. Onde se lê "@", leia-se "MÍMICO-CAIXOTE".]', 'Você volta a ser um caixote. ATQ, DEF e MAG caem para 65%.'],
  registro: ['REGISTRO', '[Correção na ficha: REGISTRO. Itens e um feitiço: sem registro.]', 'O comando ITEM some e um feitiço fica apagado.']
};
async function applyErr8(k) {
  const E = E8(); if (E[k]) return;
  E[k] = true; E.stampT = 40; E.stampW = ERR8[k][0]; sfx('catalog'); shake(6);
  if (k === 'especie') { E.st = { atk: G.st.atk, def: G.st.def, mag: G.st.mag }; for (const s of ['atk', 'def', 'mag']) G.st[s] = Math.round(G.st[s] * 0.65); }
  if (k === 'registro' && G.spells.length && G.species !== 'vazio') { BT.ps = BT.ps || {}; BT.forgot = 'sp:' + Math.floor(Math.random() * G.spells.length); BT.ps.forget = 99; }
  await bSay(ERR8[k][1], { cat: true });
  await bSay(`* ${ERR8[k][2]} (Use {y}FICHA{/} para responder e desfazer.)`, { auto: 55 });
}
function clearErr8(k) {
  const E = BT.errata8; if (!E || !E[k]) return;
  E[k] = false;
  if (k === 'especie' && E.st) { Object.assign(G.st, E.st); E.st = null; }
  if (k === 'registro' && BT.ps) BT.ps.forget = 0;
}
// perguntas montadas a partir do seu save
function fichaQs8() {
  const f = G.flags, vz = G.species === 'vazio' || f.grau5 === 'vazio', Q = [];
  const add = (q, ok, wrong, earth) => { if (earth && vz) return; Q.push({ q, ok, opts: [ok, ...wrong] }); };
  add('[Pergunta: qual é o seu nome?]', G.name, ['Alma 31', 'Mímico-Caixote', 'Ninguém']);
  add('[Pergunta: quem cantava no fundo do ônibus?]', 'Lume', ['Dona Cida', 'Capitã Brida', 'Ofélia']);
  add('[Pergunta: quem dirigia o 31?]', 'Seu Jorge', ['Tiago', 'Anselmo', 'Seu Valdir']);
  add('[Pergunta: quem cobrava a passagem no 31?]', 'Tiago', ['Seu Jorge', 'Bento', 'Kauã']);
  add('[Pergunta: qual era o seu número no ônibus?]', '31', ['30', '12', '7'], true);
  const sp2 = (() => { let s = f.prev4 || G.species; for (let i = 0; i < 4; i++) { const p = Object.keys(SPECIES).find(k => (SPECIES[k].evos || []).includes(s)); if (!p || p === 'caixote') break; s = p; } return s; })();
  if (SPECIES[sp2] && (sp2 === 'ferro' || sp2 === 'arcano')) add('[Pergunta: qual foi a sua primeira evolução?]', SPECIES[sp2].name, [SPECIES[sp2 === 'ferro' ? 'arcano' : 'ferro'].name, 'Cofre-Abismo', 'Baú Encantado']);
  if (f.prev4 && SPECIES[f.prev4]) add('[Pergunta: o que você era antes do 5º grau?]', SPECIES[f.prev4].name, ['Baú de Ferro', 'Mímico-Caixote', 'Relicário Arcano'].filter(n => n !== SPECIES[f.prev4].name).slice(0, 3));
  if (f.grau5) add('[Pergunta: o que você respondeu no 5º grau?]', f.grau5 === 'arca' ? 'Virei uma arca' : 'Esvaziei tudo', [f.grau5 === 'arca' ? 'Esvaziei tudo' : 'Virei uma arca', 'Não respondi', 'Fugi']);
  add('[Pergunta: a quem você devia dois pastéis de queijo?]', 'Seu Ozório', ['Seu Jorge', 'Dona Cida', 'Rita'], true);
  add('[Pergunta: qual é o nome verdadeiro da Ofélia?]', 'Clara', ['Inês', 'Maren', 'Brida']);
  if (f.bridaArchived) add('[Pergunta: quem foi arquivada protegendo a Lume?]', 'Capitã Brida', ['Inquisidora Maren', 'Dona Marlene', 'Rita']);
  if (f.ch6Gift) add('[Pergunta: o que você segurou no Ponto Final?]', f.ch6Gift === 'pastel' ? 'O sabor do pastel' : 'O fim da canção', [f.ch6Gift === 'pastel' ? 'O fim da canção' : 'O sabor do pastel', 'O quepe do Jorge', 'Nada']);
  if (f.dudaMet) add('[Pergunta: Rua das Acácias, 40. O portão da Duda é de que cor?]', 'Verde', ['Azul', 'Amarelo', 'Vermelho'], true);
  if (f.soul_valdir) add('[Pergunta: o Seu Valdir virou o quê?]', 'O coreto (um jabuti)', ['Uma estátua', 'Um sino', 'Um bonde']);
  add('[Pergunta: quem segurou a trincheira dos monstros?]', 'Musgo', ['Tiago', 'Maren', 'O Escriba']);
  if (vz) { add('[Pergunta: quem te ensinou que dá para ser amigo de um lustre?]', 'Lume', ['Ninguém', 'O Catálogo', 'Ofélia']); add('[Pergunta: o que você aprendeu aqui embaixo e não era da Terra?]', 'Que a Lume é minha amiga', ['Nada', 'A tabuada', 'O sabor do pastel']); }
  return Q;
}
function shuffle8(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
async function askFicha8() {
  const E = E8(), act = ['especie', 'nome', 'registro'].filter(k => E[k]);
  if (!act.length) { await bSay('* A sua ficha não tem correções agora. O Catálogo não tem o que perguntar.', { auto: 40 }); return 'block'; }
  const cat = BT.en.find(x => x.alive && x.id === 'catalogo');
  E.used = E.used || [];
  let pool = fichaQs8().filter(q => !E.used.includes(q.q)); if (!pool.length) { E.used = []; pool = fichaQs8(); }
  const q = pickOne(pool); E.used.push(q.q); BT.q8 = q;
  if ((G.species === 'vazio' || G.flags.grau5 === 'vazio') && !E.vzSaid) { E.vzSaid = true; await bSay('[Perguntas sobre a Terra: arquivadas. Você não tem nada lá. Vamos perguntar sobre aqui.]', { cat: true }); }
  await bSay(q.q.replace(/@/g, G.name), { cat: true });
  const opts = shuffle8(q.opts.slice());
  const i = await list({ x: 8, y: 150, w: 224, h: 74, title: 'Ficha · responda', maxVis: 4, items: opts.map(o => ({ label: o })) });
  markAct('ficha'); BT.curCat = 'verdade';
  if (i >= 0 && opts[i] === q.ok) {
    const k = act[0]; clearErr8(k); sfx('select');
    const d = Math.round(cat.mhp * 0.02); BT.trueHit8 = true; hitEnemy(cat, d, 'crit', '#ffe066'); BT.trueHit8 = false;
    pbPose('win', 20); E.right = (E.right || 0) + 1;
    await bSay(`* "${q.ok}." Você diz alto, com a tampa aberta. A correção de ${ERR8[k][0]} rasga no meio. {y}VERDADE: ${d} de dano.{/}`, { auto: 60 });
  } else {
    const d = Math.round(G.st.mhp * 0.12); G.hp = Math.max(1, G.hp - d); sfx('hurt'); pbPose('hurt', 20); BT.nums.push({ x: BPX, y: BPY - 40, s: '-' + d, col: '#ff6b6b', t: 50 });
    await bSay(`* [Resposta incorreta. A correção permanece.] A página corta a sua tampa. (-${d} PV)`, { auto: 55 });
  }
  return 'acted';
}
function fichaGate(c) {
  if (!cat8()) return null; const E = E8();
  if (c === 2 && E.registro) return (async () => { await bSay('* ITEM está riscado da sua ficha. A tampa não abre para isso.', { auto: 40 }); return 'block'; })();
  if (c === 4) return askFicha8();
  return null;
}
function btnOverride(i) { return i === 4 && cat8() ? 'FICHA' : null; }
// o Índice: o que você repete rende menos; NOME e VERDADE não entram no índice
function fichaDmg(e, dmg) {
  if (e.id !== 'catalogo' || BT.trueHit8) return dmg;
  const c = BT.curCat || '';
  if (e.index8 && e.index8.has(c.replace(':nome', '')) && !c.endsWith(':nome')) { dmg = Math.round(dmg * 0.5); BT.nums.push({ x: e.x, y: e.y - 52, s: 'CATALOGADO', col: '#8fe3ff', t: 34 }); }
  if (BT.errata8 && BT.errata8.nome) dmg = Math.round(dmg * 0.8);
  return dmg;
}
const CAT8N = { bite: 'MORDIDA', tech: 'TÉCNICAS', item: 'ITENS' };
const catName8 = c => CAT8N[c] || (c.startsWith('sp:') ? 'FEITIÇOS DE ' + (RUNES[c.split(':')[1]] || { name: '?' }).name.toUpperCase() : c.toUpperCase());
// registra a categoria de cada ação do jogador
{ const _pt = playerTurn; playerTurn = async function () { BT.curCat = null; const r = await _pt(); if (cat8() && BT.curCat) { BT.catLog8 = BT.catLog8 || []; BT.catLog8.push(BT.curCat); } return r; }; }
// "Presente!": na última página, as almas que você salvou respondem e seguram um golpe
{ const _h = hurt; hurt = function (e, pow, mult, res, o) {
  if (BT.presente8 > 0 && e && e.id === 'catalogo' && e.phase8 === 3 && mult > 0 && !(BT.errata8 && BT.errata8.nome) && Math.random() < 0.5) {
    BT.presente8--; const nm = pickOne(BT.presNames8 || ['Lume']); BT.nums.push({ x: BPX, y: BPY - 56, s: nm + ': PRESENTE!', col: '#ffe066', t: 60 }); sfx('guard'); return 0;
  }
  return _h(e, pow, mult, res, o);
}; }
{ const _re = roundEnd; roundEnd = async function () { if (BT.openSky > 0) BT.openSky--; return _re(); }; }
{ const _b = battle; battle = async function (group, opts) {
  BT.errata8 = null; BT.struck8 = null;
  const r = await _b(group, opts);
  if (BT.errata8) { clearErr8('especie'); BT.errata8 = null; }
  BT.struck8 = null; BT.openSky = 0;
  return r;
}; }

const ENC8 = {
  catalogo: { name: 'O Catálogo', sp: 'catalogoB', hp: 8600, atk: 108, def: 36, xp: 4000, boss: true, ai: 'catalogo', weak: { ceu: 1.3, canto: 1.1 },
    flavor: ['* O Catálogo vira uma página. Nela, o seu nome está escrito errado.', '* "[Todo mundo que entra aqui vira um verbete.]"', '* As letras dele orbitam devagar, como poeira numa biblioteca.'],
    flavor2: ['* As páginas do Catálogo estão cheias de correções em vermelho.', '* "[Errata. Errata. Errata.]"', '* Ele está tentando escrever você de novo.'],
    check: 'O livro que lê as almas. ÍNDICE: o que você repete vira verbete e rende metade. Corrige a sua FICHA (NOME, ESPÉCIE, REGISTRO): use FICHA (no lugar de FUGIR) e responda certo para desfazer e causar dano de VERDADE. NOME não pode ser catalogado. CÉU é o ponto fraco.' }
};
Object.assign(ENEMIES, ENC8);
AI.catalogo = async function (e) {
  e.phase8 = e.phase8 || 1; e.index8 = e.index8 || new Set(); e.use8 = e.use8 || {};
  // 1) indexa o que você fez
  const log = BT.catLog8 || []; BT.catLog8 = [];
  for (const c0 of log) { if (!c0 || c0.endsWith(':nome') || c0 === 'verdade' || c0 === 'flee' || c0 === 'ficha') continue; const c = c0; e.use8[c] = (e.use8[c] || 0) + 1; if (e.use8[c] >= (e.phase8 === 1 ? 3 : 2) && !e.index8.has(c)) { e.index8.add(c); sfx('catalog'); await bSay(`[Verbete criado: ${catName8(c)}. Já li isso. Rende menos agora.]`, { cat: true }); } }
  // 2) mudanças de fase
  if (e.phase8 === 1 && e.hp <= e.mhp * 0.66) {
    e.phase8 = 2; e.phase = 2; e.index8.clear(); e.use8 = {}; shake(24); sfx('rumble');
    await bSay('[Revisão geral. Esta ficha tem erros demais. Vou reescrever do começo.]', { cat: true });
    await bSay('* As páginas do Catálogo se enchem de correções em vermelho. O índice zera.', { auto: 45 });
    await applyErr8('nome'); return;
  }
  if (e.phase8 === 2 && e.hp <= e.mhp * 0.33) {
    e.phase8 = 3; e.index8.clear(); e.use8 = {}; shake(50); sfx('rumble'); playMusic('final8b');
    await bSay('[Não. Não. NÃO SOU EU QUE TENHO FOME.]', { cat: true });
    await bSay('* A lombada do Catálogo se abre de cima a baixo como uma boca. Lá dentro, a Voz empurra. As páginas pegam fogo cor de âmbar.', { auto: 60 });
    await bSay('ME DÁ A ÚLTIMA PÁGINA.', { col: '#5fb0d0' });
    BT.presNames8 = [...soulsNames(), ...((G.flags.saved7 || []).map(k => CRYSTALS[k] && CRYSTALS[k].n).filter(Boolean))];
    BT.presente8 = Math.min(3, BT.presNames8.length);
    if (BT.presente8) await bSay(`* Lá do 31, alguém grita o seu nome. Depois outro. ${BT.presente8} ${BT.presente8 === 1 ? 'voz se prepara' : 'vozes se preparam'} para responder "Presente!" por você.`, { auto: 55 });
    if (G.flags.ch6Gift === 'cancao' && !e.song8) {
      e.song8 = true; for (const k of ['nome', 'especie', 'registro']) clearErr8(k); cureStatus(); const h = Math.round(G.st.mhp * 0.3); G.hp = Math.min(G.st.mhp, G.hp + h); sfx('heal');
      await bSay('* E a Lume canta. A música do título, inteira, do começo ao fim, pela primeira vez. Ela lembra como termina.', { auto: 60 });
      await bSay(`* Cada correção na sua ficha se apaga com a última nota. (+${h} PV)`, { auto: 50 });
    }
    return;
  }
  // 3) golpes por fase
  const P = e.phase8;
  if (e.charge) { e.charge = false; return runMove(e, { k: 'ring', p: 2.1, pierce: true, fast: true, t: '* {r}COLEÇÃO COMPLETA.{/} A boca da lombada fecha em cima de você!', fx: 'shake' }); }
  if (P === 3) {
    if (e.turns % 2 === 0) e.atk += 3;
    if (e.turns % 4 === 1) { e.charge = true; await bSay('* A lombada se abre até o fim. Ela vai fechar com tudo no próximo turno. (Âncora ou Sino de Bolso cancelam.)', { auto: 60 }); return; }
    if (e.turns % 3 === 0) { const k = pickOne(['nome', 'especie', 'registro'].filter(x => !E8()[x])); if (k) await applyErr8(k); }
    await runMove(e, pickMove(e, [
      { k: 'seq', n: 9, p: 0.36, hide: true, spd: 1.05, w: 2, t: '* A Voz recita nove almas de cor e apaga. Lembre todas!' },
      { k: 'dodge', p: 0.42, hits: 6, spd: 1.6, w: 2, t: '* Páginas em brasa caem como chuva!' },
      { k: 'ring', p: 1.7, pierce: true, fast: true, w: 2, t: '* A lombada morde através da sua tampa!' },
      { k: 'mash', p: 1.2, need: 22, bind: true, w: 1, t: '* As fitas te puxam para dentro da lombada!' },
      { k: 'spell', p: 1.9, el: 'ambar', name: 'Última Página', w: 3, t: '* {y}Última Página{/}! A Voz lê o seu nome em voz alta, pegando fogo.' }]));
    if (BT.on && G.hp > 0) await runMove(e, { k: 'dodge', p: 0.38, hits: 3, spd: 1.7, t: '* Brasas soltas atrás do golpe!' });
    return;
  }
  if (P === 2) {
    if (e.turns % 3 === 0) { const k = pickOne(['nome', 'especie', 'registro'].filter(x => !E8()[x])); if (k) { await applyErr8(k); return runMove(e, { k: 'dodge', p: 0.4, hits: 3, spd: 1.5, t: '* As letras da correção voam em você!' }); } }
    return runMove(e, pickMove(e, [
      { k: 'seq', n: 8, p: 0.4, hide: true, spd: 1.1, w: 2, t: '* "[Errata.]" Oito correções, ditadas uma vez só. Repita!' },
      { k: 'dodge', p: 0.45, hits: 5, spd: 1.55, w: 2, t: '* Notas de rodapé caem de todos os lados!' },
      { k: 'ring', p: 1.45, pierce: true, w: 2, t: '* "[Revisão.]" A página inteira bate em você como uma porta.' },
      { k: 'spell', p: 1.15, el: 'sombra', name: 'Remissiva', st: 'forget', w: 1, t: '* {p}Remissiva{/}! "[Ver também: esquecer.]"' },
      { k: 'spell', p: 1.7, el: 'sombra', name: 'Errata', w: 3, t: '* {p}Errata{/}! Uma página inteira de correções despenca em você.' }]));
  }
  if (e.turns % 3 === 2) { await applyErr8(E8().nome ? (E8().registro ? 'especie' : 'registro') : 'nome'); return; }
  return runMove(e, pickMove(e, [
    { k: 'dodge', p: 0.48, hits: 4, spd: 1.5, w: 2, t: '* "[Nota de rodapé.]" Quatro notinhas descem afiadas!' },
    { k: 'seq', n: 7, p: 0.42, spd: 1.15, w: 2, t: '* "[Referência cruzada.]" Siga as setas sem errar!' },
    { k: 'mash', p: 1.1, need: 18, bind: true, w: 1, t: '* "[Encadernação.]" As fitas te costuram na página!' },
    { k: 'spell', p: 1.5, el: 'sombra', name: 'Citação', w: 3, t: '* {p}Citação{/}! Uma frase sua volta contra você, entre aspas.' }]));
};

// ================= HISTÓRIA =================
WHO.escriba8 = WHO.escriba;
const PAGES8 = {
  1: ['* Uma página solta, com a letra do Catálogo. Mas não é um verbete. É um diário.', '"Eu fui uma pessoa. Não lembro qual. A masmorra me leu e não quis me engolir inteiro: guardou a parte que sabe ler."', '"Desde então eu leio os outros. Cada um que eu leio vira uma linha. Cada linha fica aqui, entre colchetes, comigo."'],
  2: ['* Outra página do diário do Catálogo. A letra treme.', '"Nós somos muitos. Às vezes eu esqueço de disfarçar e digo nós. Os primeiros vieram de barca. Depois, de carruagem. Depois, de ônibus."', '"Ninguém pergunta quem pediu as viagens. Eu também não perguntava. Eu só contava."'],
  3: ['* A última página do diário. Quase toda queimada.', '"Ela me ensinou a ler. Ela disse que era um trabalho bonito: guardar as pessoas para que ninguém esquecesse."', '"Ela vai chamar de novo. Ela sempre chama."', '* Não tem assinatura. Só um desenho pequeno e cuidadoso, no canto: uma lanterna com um olho dentro.']
};
Object.assign(STORY, {
  async ch8start() {
    const f = G.flags; if (f.ch8open) return;
    f.ch8open = true; f.tut_bomb = true;
    playMusic(null);
    await say('* O Seu Jorge buzina três vezes. Lá de cima cai uma chuva de pedrinhas.');
    await say('Quem vai, entra! Monstro senta atrás, gente senta na frente, lustre fica no corrimão!', 'jorge');
    const who = ['* O Musgo entra de lado, abaixado, e ocupa três bancos.'];
    if (f.tiagoTaken) who.push('* O Tiago senta no banco do cobrador, por costume.');
    if (f.marleneFate === 'conosco') who.push('* A Dona Marlene senta na frente, de espada no colo.');
    if (f.dateDone) who.push('* A Rita sobe por último, chutando um caixote para dentro.');
    if (soulOk('cida')) who.push('* A Dona Cida se enrola no banco 7, o mesmo de sempre.');
    if (['lembrou', 'resgatado'].includes(f.soul_ozorio)) who.push('* O Seu Ozório traz o tacho no colo, ainda morno.');
    if (['lembrou', 'resgatado'].includes(f.soul_neide)) who.push('* A Profª Neide confere a lista de passageiros duas vezes.');
    if (f.aprendizesDone) who.push('* Pip, Nina e Tolo se espremem no último banco, segurando as cordas da Guilda.');
    if ((f.saved7 || []).length) who.push(`* As ${(f.saved7 || []).length} almas que você tirou do âmbar entram em silêncio, olhando tudo como quem acorda numa cidade nova.`);
    for (const w of who) await say(w);
    await say('* Você sobe por último e se encaixa no corredor, entre os bancos. A Lume se pendura no corrimão.');
    await say('Próxima parada: superfície. Segura firme.', 'jorge');
    await fadeOut(14); V.scene = 'black'; sfx('rumble'); shake(30);
    await say('* O 31 arranca. Pela janela, a antessala some atrás de uma cortina de poeira. A Porta Redonda bate por dentro, três vezes, cada vez mais longe.', 'void');
    await say('* O ônibus sobe pela faixa amarela, de ré na própria memória: Ponto Final, Coreto, Escola, Feira, Padaria. Cada parada desaba logo depois que vocês passam.', 'void');
    await say('* Até que a faixa acaba numa garganta de pedra. O motor tosse. O caminho está fechado.', 'void');
    loadMap('garganta', 13, 17, 'up'); V.scene = 'world'; await fadeIn(16); playMusic('garganta8');
    sfx('catalog'); await say('[Capítulo 8: {y}A Tampa se Fecha{/}.]', 'cat');
    await say('Daqui o ônibus não passa sozinho. A gente desce, abre caminho, e eu vou atrás.', 'jorge');
    await say('[PEDRAS: o teto está caindo. Um alvo vermelho marca onde a próxima pedra cai. Saia de cima.]', 'cat');
    await grantTechs(false); saveGame();
  },
  async onibus8() {
    const f = G.flags;
    await say(pickOne(['Eu vou atrás. Vocês abrem caminho, eu sigo. Igual faixa exclusiva.', 'Vinte e três anos de Linha 31. Nunca peguei ela ao contrário.', f.jorgeDiary ? 'Eu li o meu diário de novo. A parte em que eu prometo levar todo mundo pra casa. Tô cumprindo, devagar.' : 'Segura a porta, menino. Já já a gente sai daqui.']), 'jorge');
  },
  async pagina8(e) {
    const f = G.flags, n = e.n;
    for (const l of PAGES8[n]) await say(l, l.startsWith('*') ? undefined : 'cat');
    f[e.hide] = true; refreshEnts(); f.pages8 = (f.pages8 || 0) + 1; sfx('item');
    await say(`* (Páginas do diário do Catálogo: ${f.pages8}/3.)`);
    if (f.pages8 === 3) {
      f.pages8Done = true;
      await say('Baú... o Catálogo também foi alguém.', 'lume');
      await say('* As três páginas se juntam na sua tampa e viram uma lasca de âmbar.');
      G.flask.max++; G.flask.n++; J.level(); await say(`* {y}Fragmento de Âmbar{/}! O frasco agora tem ${G.flask.max} goles.`);
    }
    saveGame();
  },
  async terminalFirst() {
    await say('* O Terminal Rodoviário. O QG dos heróis. Vazio. Mesas viradas, mapas pela metade, café frio nas canecas.');
    await say('* No painel de horários, as letras giram sozinhas e param: LINHA 31 — ÚLTIMA PARTIDA.');
    if (G.flags.tiagoTaken) await say('Eles foram embora correndo. Largaram tudo. Até o crachá.', 'tiago');
  },
  async maren8() {
    const f = G.flags;
    if (f.maren8) { await say(pickOne(['Vá. Antes que eu mude de ideia.', 'Eu não estou aqui. Você não me viu.']), 'maren5'); return; }
    f.maren8 = true;
    await say('* Sentada num banco de espera, sem chapéu, a Inquisidora Maren. Ela não levanta a espada.');
    await say('Você me poupou na garagem. Eu odeio dever coisas a um baú.', 'maren5');
    await say('Então eu pago agora. Escute.', 'maren5');
    await say('A Inquisição não manda em si mesma. Nós respondemos a alguém. Eu vi essa pessoa uma vez, quando era aprendiz, e de novo trinta anos depois.', 'maren5');
    await say('Ela não tinha envelhecido um dia.', 'maren5');
    await say('Quem?', 'me');
    await say('Se eu disser o nome aqui embaixo, eu não chego viva lá em cima. Quando você sair, olhe para as luzes da capital. Depois me diga se elas parecem normais.', 'maren5');
    giveItem('bala', 3); sfx('item'); await say('* A Maren joga três Balas de Âmbar na sua tampa e volta a olhar para o painel de horários.');
  },
  async scriptoriumFirst() {
    await say('* O Scriptorium. As mesas suspensas caíram. Penas, tinteiros e páginas cobrem o chão como neve azul.');
    await say('* Lá no alto, de costas, alguém escreve no ar sem parar. A corrente que prendia ele está partida no chão.');
  },
  async escriba8() {
    const f = G.flags;
    if (f.escribaDone) return;
    if (!f.escriba8Seen) {
      f.escriba8Seen = true; playMusic(null);
      await say('* O Escriba se vira. Debaixo do capuz, dois pontos de tinta acesa.');
      await say('...O trinta e um. Eu copiei você tantas vezes. Mímico. Ferro ou arcano. Memória perdida: o sabor de alguma coisa.', 'escriba');
      await say('Você está solto. Por que não foi embora?', 'lume');
      await say('Ir para onde? Eu sou uma mão. Mão sem livro não sabe o que fazer.', 'escriba');
      await say('O Catálogo mandou um último ditado: "risque o trinta e um". Eu nunca desobedeci um ditado.', 'escriba');
    } else await say('Último ditado. Risque o trinta e um.', 'escriba');
    const r = await battle(['escriba8'], { boss: true, music: 'boss8a', noFlee: true, intro: '* O Escriba molha a pena na própria sombra e escreve o seu nome no ar. Depois risca.' });
    if (r !== 'win') return;
    f.escribaDone = true; refreshEnts(); playMusic(null);
    await say('* A pena cai da mão do Escriba e quebra no chão.');
    await say('Eu copiei novecentos anos de nomes. Nunca escrevi o meu.', 'escriba');
    await say('E qual é?', 'me');
    await say('* Ele pensa muito tempo.');
    await say('Não sei. Mas agora eu tenho tempo para descobrir.', 'escriba');
    await say('Tome. A única coisa que eu nunca copiei de ninguém: um nome assinado à mão.', 'escriba');
    await giveRune('nome', false, 1);
    await say('* O Escriba se senta no chão, pega uma folha em branco e fica olhando para ela, sem escrever nada. Parece feliz.');
    playMusic(WD.map.music); saveGame();
  },
  async bibliotecaFirst() {
    await say('* A Sala de Leitura Afogada. A primeira sala com teto e livros que você viu neste mundo. A água está baixa. As velas, acesas.');
    await say('* Alguém deixou as velas acesas para você.');
  },
  async ofelia8() {
    const f = G.flags, of = f.ofeliaRemembers ? 'Clara' : 'Ofélia';
    if (f.ofelia8) { await say(pickOne(['O alçapão desce para o Índice. Lá é onde ele escreve. Eu nunca tive coragem de descer.', 'Se ele corrigir você, responda. Em voz alta. Com a tampa aberta.', 'Eu vou estar no ônibus. Nunca andei de ônibus. Trezentos anos e nunca andei de ônibus.']), 'of'); return; }
    f.ofelia8 = true;
    await say(`* A ${of} está no meio da sala, flutuando sobre a água, com um livro aberto no colo. Ela levanta os olhos.`);
    await say('Você voltou. Eu sabia. Baús sempre voltam para a sala onde foram esquecidos.', 'of');
    await say('A casa vai cair. Eu voltei para me despedir dela.', 'of');
    if (f.ofeliaRemembers) await say('Trezentos anos aqui. Eu cheguei de carruagem com doze pessoas e uma irmã esperando do outro lado. Ninguém tirou a gente daqui. Você está tirando os seus.', 'of');
    await say('Lá embaixo, no Índice, está o Catálogo. Ele vai tentar fazer com você o que fez comigo: escrever você de novo, do jeito dele.', 'of');
    await say('Ele não pode corrigir quem sabe responder. Quando ele perguntar quem você é, responda com o que você viveu. Não com o que ele leu.', 'of');
    await say('Eu escolhi o nome Ofélia por causa de um livro no colo. Você não precisa de livro. Você tem uma história inteira dentro da tampa.', 'of');
    await say('Depois que acabar... eu vou com vocês. Se tiver lugar.', 'of');
    await say('Tem sempre lugar no fundo do ônibus.', 'lume');
    saveGame();
  },
  async alcapao8() {
    const c = await choose('* Um alçapão no chão da biblioteca. Lá embaixo, o barulho de páginas virando sozinhas. Descer até o Índice? (Chefe final. Prepare-se.)', ['Descer', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    sfx('flee'); await fadeOut(14); loadMap('indice', 9, 12, 'up'); V.scene = 'world'; await fadeIn(16);
  },
  async indiceFirst() {
    await say('* O Índice. Estantes em círculo, até onde a vista alcança, para cima e para baixo. Em cada lombada, um nome.');
    await say('* Você reconhece alguns. Clara Ventura. Anselmo. Estrela, égua. Capitã Brida.');
    await say('* E uma lombada nova, ainda sem título, com o número 31.');
  },
  async brida8() {
    const f = G.flags;
    if (f.brida8) { await say('* A gaveta da Capitã Brida. Agora ela está aberta, e vazia de um jeito bom.'); return; }
    f.brida8 = true;
    await say('* Uma gaveta com etiqueta: BRIDA, CAPITÃ. CAÇADORA DE MÍMICOS.');
    await say('* Dentro, uma ficha. A última anotação, na letra do Catálogo: "Protegeu um lustre. Motivo: não consta."');
    await say('* Embaixo, numa letra diferente, apertada, de quem escreveu com pressa:');
    await say('* "Motivo: porque sim. — B."');
    await say('...Ela escreveu na própria ficha. Dentro do Catálogo.', 'lume');
    if (f.aprendizesDone) await say('* No verso: "Pip, Nina, Tolo: parem de abrir baús. Esse aí especialmente."');
    await say('* Presa na ficha, a fita vermelha do apito da capitã. Você guarda.');
    G.st.def += 4; sfx('item'); await say('* {y}Fita da Capitã{/}: DEF +4. Para sempre.');
    saveGame();
  },
  async catalogo8() {
    const f = G.flags;
    if (f.catalogoDone) return;
    if (!f.catalogoSeen) {
      f.catalogoSeen = true; playMusic(null);
      await say('* No centro do Índice, flutuando, um livro do tamanho de uma casa abre as duas páginas.');
      await say('[Olá, trinta e um.]', 'catalogo');
      await say('* É a mesma voz de colchetes que te acompanhou desde que você acordou como baú. Ela nunca pareceu tão perto.');
      await say('[Fui eu que dei nome às suas espécies. Que contei os seus passos. Que avisei dos perigos. Eu gostava de você.]', 'catalogo');
      await say('[Mas a coleção precisa de você. Ela precisa de todos. Se a coleção ficar completa, a masmorra dorme. Foi o que me prometeram.]', 'catalogo');
      await say('Quem prometeu?', 'lume');
      await say('[...Não consta.]', 'catalogo');
      if (f.grau5 === 'arca') await say('[Você aceitou ser arca. Você já é um pouco de nós. Não vai doer. Você só vai virar uma lombada a mais.]', 'catalogo');
      else await say('[Você se esvaziou para carregar os outros. Que desperdício. Eu teria guardado tudo de você com tanto cuidado.]', 'catalogo');
      if (f.pages8Done) await say('Eu li o seu diário. Você também foi alguém.', 'me');
      if (f.pages8Done) await say('[...Isso é IRRELEVANTE.] * As páginas dele tremem.', 'catalogo');
      await say('[Vamos começar a sua ficha. Nome?]', 'catalogo');
      await say(`${G.name}.`, 'me');
      await say('[Incorreto. Vamos corrigir.]', 'catalogo');
    } else await say('[De novo. Nome?]', 'catalogo');
    const r = await battle(['catalogo'], { boss: true, music: 'final8', noFlee: true, intro: '* O Catálogo abre o índice. A arena inteira vira uma página. (FICHA, no lugar de FUGIR, responde às correções.)' });
    if (r !== 'win') return;
    f.catalogoDone = true; refreshEnts();
    await STORY.catalogoEnd8();
  },
  async catalogoEnd8() {
    const f = G.flags;
    playMusic(null); shake(40); sfx('rumble');
    await say('* O Catálogo cai. As páginas se soltam todas ao mesmo tempo, como pássaros que alguém soltou de uma gaiola.');
    await say('[...Você respondeu tudo. Com a sua letra.]', 'catalogo');
    await say('[Nós... eu... fui alguém, uma vez. Talvez eu lembre, agora que não preciso mais ler ninguém.]', 'catalogo');
    await say('[Escute, trinta e um. Isso não acabou. Ela vai chamar de novo.]', 'catalogo');
    await say('Ela QUEM?', 'me');
    await say('* A última página do Catálogo cai na sua tampa. Não tem texto. Só, no canto, um desenho pequeno: uma lanterna com um olho dentro.');
    await say('* O livro se fecha. Pela primeira vez em novecentos anos, a masmorra fica em silêncio.');
    await wait(30); shake(30); sfx('rumble');
    await say('* No centro do Índice, onde o Catálogo flutuava, o chão se abre. Lá embaixo bate uma coisa enorme, quente e dourada.');
    await say('* O CORAÇÃO. Todo o âmbar de novecentos anos de almas lidas, num bloco só, batendo devagar.');
    await say('Baú, se a gente deixar isso aqui, alguém vem buscar. A Coroa, a Guilda. Ou ela.', 'lume');
    await say('[A decisão é sua. Eu não estou mais aqui para contar.] * É só um eco nas estantes.');
    await say('[DEVOLVER: abrir o Coração. As almas sobem como luz e vão embora. A masmorra para de comer Velhágua. As Lanternas apagam. A capital fica sem âmbar.] * É a letra do Catálogo, numa página solta. A última coisa que ele escreveu.');
    await say('[GUARDAR: fechar o Coração dentro da sua tampa. As almas dormem a salvo e ninguém colhe o âmbar delas. Mas todo mundo lá em cima vai querer você.]');
    const c = await choose('* O que você faz com o Coração?', ['Devolver: abrir o Coração', 'Guardar: fechar na tampa'], 'n', null);
    if (c === 0) {
      f.finalChoice = 'devolver';
      await say('* Você morde o Coração. Ele racha como um vitral. De dentro, milhares de luzinhas sobem pelas estantes, pelos andares, pelas paredes, para cima.');
      await say('* Uma delas para na sua frente por um segundo. Tem o cheiro de alguém que você não conheceu. Depois sobe também.');
      await say('Elas vão para onde?', 'me');
      await say('Para onde iam antes de alguém chamar. Eu acho.', 'lume');
      await say('* Lá em cima, em algum lugar de Velhágua, todas as Lanternas de Âmbar se apagam ao mesmo tempo.');
    } else {
      f.finalChoice = 'guardar';
      await say('* Você abre a tampa o máximo que ela abre. O Coração entra, devagar, quente, pesado como uma cidade.');
      await say('* Você sente cada alma lá dentro. Dormindo. Seguras. Ninguém vai colher âmbar delas enquanto você estiver de tampa fechada.');
      await say('Baú... você vai carregar isso pra sempre?', 'lume');
      await say('Baús servem pra isso. A gente guarda.', 'me');
      await say('* Lá em cima, em algum lugar de Velhágua, todas as Lanternas de Âmbar piscam uma vez, como quem perde o sinal.');
    }
    saveGame();
    await STORY.rosto8();
  },
  async rosto8() {
    const f = G.flags, of = f.ofeliaRemembers ? 'Clara' : 'Ofélia';
    await fadeOut(12); loadMap('tampa', 7, 8, 'up'); V.scene = 'world'; await fadeIn(16); playMusic('ceu8');
    await say('* O 31 sobe o último andar de ré e para numa sala que você conhece. Paredes de pedra roxa. Um caixote quebrado no canto.');
    await say('* É a sala onde você acordou. O Andar 1. A primeira sala.');
    await say(`* A ${of} desce do ônibus flutuando e para na sua frente.`);
    await say('Antes de você sair. Eu prometi a mim mesma que ia te ensinar uma coisa quando você chegasse aqui.', 'of');
    await say('Lá fora, um baú que anda e fala é caçado em um dia. Você precisa de um rosto. Não um disfarce: um rosto seu.', 'of');
    await say('Eu escolhi o meu nome quando cheguei. Agora você escolhe o seu rosto. Feche os olhos. Lembre de você.', 'of');
    sfx('catalog'); await say('* A palavra entra na sua tampa como um gole de água fria: {y}ROSTO{/}.');
    f.runaRosto = true;
    await fadeOut(10); V.scene = 'black';
    const blur = faceBlur8();
    await say(blur >= 3 ? '* Você tenta lembrar do seu rosto. Não tem quase nada lá. Um espaço branco, limpo, com o contorno de um sorriso que você nunca viu.' : blur >= 1 ? '* Você tenta lembrar do seu rosto. Algumas partes vêm fáceis. Outras estão borradas, onde ficavam as memórias que você pagou.' : '* Você lembra do seu rosto. Do jeito que ele ficava na janela do 31, refletido, às sete da manhã.', 'void');
    await humanReveal8();
    V.scene = 'world'; await fadeIn(16);
    V.human8 = true;
    await say('...Isso é um braço. Eu tenho um BRAÇO.', 'humano');
    await say('Você tem DOIS. Para de balançar eles assim.', 'lume');
    await STORY.lumeHumano8();
    if (f.ritaPromise) await say('* Do ônibus, alguém assobia. A Rita. "Ô, mala! Não esquece do pastel."');
    V.human8 = false; sfx('flee');
    await say('* Mas o rosto pisca e some. Você volta a ser um baú, cansado como se tivesse corrido.', 'void');
    await say('Dura pouco. Cansa. Lá fora você aprende. O corpo de verdade continua sendo esse aí.', 'of');
    await say('* Na parede do fundo, uma escada que você nunca tinha visto. No topo, uma luz que não é de vela, nem de âmbar.');
  },
  async saida8() {
    if (!G.flags.runaRosto) return;
    const c = await choose('* Subir? (Esta é a saída da masmorra. É o fim da Temporada 1.)', ['Subir', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.end8();
  },
  async end8() {
    const f = G.flags;
    playMusic(null); await fadeOut(16); V.scene = 'black';
    await say('* O 31 sobe a escada. Não deveria caber. Cabe.', 'void');
    await say('* Pela janela da frente, a luz fica maior, mais branca, mais azul.', 'void');
    await wait(20); playMusic('ceu8');
    await skyScene8();
    await say('* E então você vê.', 'void');
    await say('* O céu.', 'void');
    await say('* Você não vê o céu desde aquela segunda-feira chuvosa. Ele está do mesmo jeito. Ninguém avisou ele que você tinha morrido.', 'void');
    await say('...Bonito, né?', 'lume');
    await say('É. Eu tinha esquecido que ele era desse tamanho.', 'me');
    if (G.species === 'vazio' || f.grau5 === 'vazio') await say('Na verdade eu não lembro de ter visto. Então é a primeira vez. É a primeira vez de novo.', 'me');
    await say('* Atrás do ônibus, a boca da masmorra desaba e se fecha com um barulho de tampa. Como um baú fechando.', 'void');
    await say('* Por um segundo, no meio da poeira, você vê uma moça feita de âmbar subindo a escada atrás de vocês. Ela olha para o céu, sorri, e some no mato.', 'void');
    await say('Baú. Olha a capital.', 'lume');
    await say('* Longe, no alto de um morro, a cidade de Auren. Os faróis da muralha brilham de dia, num tom que você conhece bem: cor de âmbar.', 'void');
    if (f.maren8) await say('* Você lembra da Maren. "Depois me diga se elas parecem normais."', 'void');
    await say('Todo mundo sentado? A próxima parada é longe.', 'jorge');
    await endSeason8();
  }
});
{ const _f = { terminal8: 'terminalFirst', scriptorium8: 'scriptoriumFirst', biblioteca8: 'bibliotecaFirst', indice: 'indiceFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _os = STORY.onStep3; STORY.onStep3 = function () {
  if (_os && _os()) return true;
  if (WD.id === 'scriptorium8' && !G.flags.escribaDone && WD.y <= 4) { runScript(STORY.escriba8); return true; }
  if (WD.id === 'indice' && !G.flags.catalogoDone && WD.y <= 7) { runScript(STORY.catalogo8); return true; }
  return false; }; }
// o ônibus da antessala leva para o Cap. 8
{ const _o7 = STORY.onibus7; STORY.onibus7 = async function () { if (G.flags.ch7done && !G.flags.ch8open) { const c = await choose('* O 31 está de portas abertas e motor ligado. Subir? (Começa o Capítulo 8, o último.)', ['Subir', 'Ainda não'], 'n', 1); if (c === 0) return STORY.ch8start(); return; } return _o7(); }; }
{ const _co = chapterOf; chapterOf = function (d) { const f = (d && d.flags) || {}; return f.ch8open ? 8 : _co(d); }; }

// ================= FORMA HUMANA (Runa do Rosto) =================
// o rosto é o mesmo para todos; o corpo herda a linha de 4º grau; a aura vem do 5º grau; a nitidez, das memórias
function faceBlur8() { const f = G.flags; return (f.mem_pastel && !f.pastelBack ? 1 : 0) + (f.ateMemory ? 1 : 0) + (f.grau5 === 'vazio' || f.memVazio ? 3 : 0); }
const FACE8 = {
  bastiao: { cloth: '#5a5a6a', hair: '#2a2420', style: 'short', trait: 'ombros largos, ombreiras de ferro rebitado, voz grave', fx: r => { r(2, 24, 8, 4, PAL.k); r(3, 25, 6, 2, '#8a8a9a'); r(22, 24, 8, 4, PAL.k); r(23, 25, 6, 2, '#8a8a9a'); r(5, 25, 1, 1, '#f0c040'); r(26, 25, 1, 1, '#f0c040'); } },
  abismo: { cloth: '#2a1a3a', hair: '#1a1020', style: 'messy', trait: 'olhos escuros demais, sorriso largo, sempre com fome', eyes: '#07050c', fx: (r, fr) => { if (fr !== 1) r(13, 20, 6, 1, '#5a1a1a'); r(12, 19, 1, 1, '#5a1a1a'); r(19, 19, 1, 1, '#5a1a1a'); } },
  ferrao: { cloth: '#2a4a2a', hair: '#3a5a2a', style: 'messy', trait: 'cabelo espetado, unhas verdes, um ferrão pendurado no pescoço', fx: r => { for (const x of [9, 13, 17, 21]) r(x, 1, 2, 4, '#3a5a2a'); r(15, 27, 2, 4, '#8ac85a'); r(15, 30, 2, 1, '#d8ffb0'); } },
  carniceiro: { cloth: '#5a1a1a', hair: '#3a1a10', style: 'short', trait: 'cicatrizes de dente, dentes um pouco pontudos, sempre quente', fx: (r, fr) => { r(19, 10, 1, 4, '#c87070'); r(20, 12, 1, 1, '#c87070'); if (fr === 1) { r(14, 20, 1, 1, '#ffffff'); r(17, 20, 1, 1, '#ffffff'); } } },
  biblioteca: { cloth: '#e8dcc0', hair: '#4a3020', style: 'short', trait: 'dedos manchados de tinta, casaco de folhas costuradas, fala citando coisas', glasses: '#3a2a20', fx: r => { for (let y = 27; y < 32; y += 2) r(5, y, 22, 1, '#a89068'); r(10, 21, 2, 1, '#3a4ab0'); } },
  proibido: { cloth: '#2a1a4a', hair: '#1a1030', style: 'long', trait: 'runas tatuadas que brilham com a magia, uma mecha cor de tinta', fx: r => { r(10, 18, 1, 3, '#b48cf0'); r(21, 17, 1, 3, '#b48cf0'); r(20, 5, 2, 8, '#5a6ad0'); } },
  eclipse: { cloth: '#1a1428', hair: '#07050c', style: 'long', trait: 'uma sombra que se mexe sozinha, olhos que brilham no escuro', eyes: '#b48cf0', fx: r => { r(0, 26, 4, 6, '#1a0a2a'); r(28, 24, 4, 8, '#1a0a2a'); } },
  constelacao: { cloth: '#1c2a5a', hair: '#2a3a6a', style: 'messy', trait: 'sardas que são estrelas de verdade, cabelo com pontinhos de luz', fx: (r, fr) => { for (const [x, y] of [[11, 18], [13, 19], [19, 18], [20, 19]]) r(x, y, 1, 1, fr === 2 ? '#ffffff' : '#ffe066'); for (const [x, y] of [[11, 5], [16, 6], [20, 4]]) r(x, y, 1, 1, '#ffe066'); } }
};
function humanPort8() {
  const f = G.flags, L = FACE8[f.prev4] || FACE8.bastiao, aura = f.grau5, blur = faceBlur8();
  const fr = bust({ skin: '#d8a07a', hair: L.hair, style: L.style, cloth: L.cloth, collar: '#f0c040', eyes: aura === 'arca' ? '#f0c040' : (L.eyes || '#3a2418'), glasses: L.glasses,
    extra: (r, k) => { L.fx(r, k); r(14, 28, 4, 3, PAL.k); r(15, 29, 2, 1, '#f0c040');
      if (aura === 'arca') { r(13, 15, 1, 1, '#c8962a'); r(18, 15, 1, 1, '#c8962a'); }
      // memórias perdidas borram o rosto
      const R = bgRand(77 + k); for (let i = 0; i < blur * 26; i++) { const x = 10 + Math.floor(R() * 12), y = 8 + Math.floor(R() * 16); r(x, y, 1 + (R() < 0.3 ? 1 : 0), 1, R() < 0.5 ? '#e8c0a0' : '#c89070'); } } });
  if (aura === 'vazio') for (const c of fr) { const x = c.getContext('2d'), d = x.getImageData(0, 0, 32, 32); for (let i = 3; i < d.data.length; i += 4) if (d.data[i] && ((i >> 2) % 32 + Math.floor((i >> 2) / 32)) % 3 === 0) d.data[i] = 110; x.putImageData(d, 0, 0); }
  return fr;
}
function humanReveal8() {
  const f = G.flags, L = FACE8[f.prev4] || FACE8.bastiao, P = humanPort8(); PORT.humano = P;
  WHO.humano = { name: () => G.name, portrait: t => portFrame('humano', t), voice: () => sfx('blip', 520) };
  const lines = [...L.trait.split(', '), f.grau5 === 'arca' ? 'fechaduras douradas nos olhos' : f.grau5 === 'vazio' ? 'contorno meio transparente' : '', 'um fecho dourado no colarinho', faceBlur8() >= 3 ? 'o rosto quase todo em branco' : faceBlur8() >= 1 ? 'partes do rosto borradas' : 'o rosto inteiro, nítido'].filter(Boolean);
  sfx('evolve');
  return openWin({ type: 'reveal8', t: 0,
    update() { this.t++; if (this.t > 70 && btnp('a')) { sfx('select'); closeWin(this); } },
    draw() {
      bx.globalAlpha = 1; bx.fillStyle = '#07050c'; bx.fillRect(0, 0, W, H);
      const a = Math.min(1, this.t / 50);
      bx.globalAlpha = 0.25 * a; fxDisc(120, 80, 60 + Math.sin(this.t * 0.05) * 4, f.grau5 === 'vazio' ? '#c0c8d8' : '#f0c040'); bx.globalAlpha = a;
      const B = PORT.humano48 || P; bx.drawImage(B[this.t % 160 < 6 ? 2 : (this.t % 40 < 8 && this.t < 70 ? 1 : 0)], 72, 30, 96, 96);
      bx.globalAlpha = 1;
      for (let i = 0; i < 8; i++) { const an = this.t * 0.02 + i * 0.785; fxSpark(120 + Math.cos(an) * 66, 80 + Math.sin(an) * 54, '#ffe066', i % 3 === 0); }
      txt(G.name, 120, 134, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
      lines.slice(0, 6).forEach((l, i) => txt(l, 120, 150 + i * 11, { align: 'center', col: '#b8aecb', alpha: Math.max(0, Math.min(1, (this.t - 40 - i * 12) / 30)) }));
      if (this.t > 70 && FRAME % 50 < 34) txt('A para continuar', 120, 226, { align: 'center', col: '#8a8099' });
    } });
}
// ================= O CÉU =================
function skyScene8() {
  const f = G.flags;
  return openWin({ type: 'sky8', t: 0,
    update() { this.t++; if (this.t > 120 && btnp('a')) { sfx('select'); closeWin(this); } },
    draw() {
      const t = this.t, a = Math.min(1, t / 90);
      for (let y = 0; y < 150; y++) { const k = y / 150; bx.fillStyle = `rgb(${Math.round(40 + 200 * k * a)},${Math.round(70 + 120 * k * a)},${Math.round(140 + 60 * (1 - k) * a)})`; bx.fillRect(0, y, 240, 1); }
      bx.globalAlpha = a; fxDisc(170, 118 - a * 20, 14, '#fff4c0'); bx.globalAlpha = 0.3 * a; fxDisc(170, 118 - a * 20, 26, '#ffd890'); bx.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const cx = ((i * 53 + t * 0.15) % 280) - 30, cy = 20 + (i % 3) * 18; bx.fillStyle = '#ffffff'; bx.globalAlpha = 0.85 * a; bx.fillRect(cx, cy, 26, 5); bx.fillRect(cx + 5, cy - 3, 14, 3); bx.globalAlpha = 1; }
      // morros, a capital ao longe com faróis cor de âmbar
      bx.fillStyle = '#2a4a3a'; for (let x = 0; x < 240; x++) { const h = 150 - 18 - Math.sin(x * 0.03) * 8 - Math.sin(x * 0.011 + 1) * 10; bx.fillRect(x, h, 1, 160 - h); }
      bx.fillStyle = '#3a3a52'; for (const [x, w, h] of [[176, 6, 22], [184, 10, 16], [196, 5, 28], [203, 12, 14], [217, 7, 20]]) bx.fillRect(x, 126 - h, w, h);
      for (const x of [178, 198, 219]) { const on = (t + x) % 40 < 30; bx.fillStyle = on ? '#f0c040' : '#c8962a'; bx.fillRect(x, 126 - (x === 198 ? 28 : 22) - 2, 2, 2); bx.globalAlpha = 0.3; fxDisc(x + 1, 126 - (x === 198 ? 28 : 22) - 1, 5, '#f0c040'); bx.globalAlpha = 1; }
      bx.fillStyle = '#1a2a22'; bx.fillRect(0, 150, 240, 90);
      // o 31 saindo da terra
      const bx0 = 34, by = 168 - Math.min(1, t / 120) * 10;
      bx.fillStyle = PAL.k; bx.fillRect(bx0 - 1, by - 1, 74, 30); bx.fillStyle = '#e8d8a0'; bx.fillRect(bx0, by, 72, 28); bx.fillStyle = '#3a70c0'; bx.fillRect(bx0, by + 18, 72, 4);
      for (let i = 0; i < 5; i++) { bx.fillStyle = '#1c3058'; bx.fillRect(bx0 + 4 + i * 13, by + 4, 10, 9); }
      bx.fillStyle = '#2a1a10'; bx.fillRect(bx0 + 22, by - 6, 26, 6); txt('31', bx0 + 35, by - 6, { align: 'center', col: '#ffb040' });
      bx.fillStyle = '#ffe066'; bx.fillRect(bx0 + 4 + (t >> 3) % 5 * 13 + 3, by + 6, 3, 4);
      if (t > 120 && FRAME % 50 < 34) txt('A', 228, 226, { col: '#ffffff' });
    } });
}
// ================= FEITOS, RENOME E HERANÇA =================
function feats8() {
  const f = G.flags, F = [];
  const add = (id, ch, s, ok) => { if (ok) F.push({ id, ch, s }); };
  add('musgo', 1, 'Venceu o Guarda-Musgo', f.bossDone);
  add('polvo', 2, 'Venceu o Polvo do Camarote', f.octoDone);
  add('brida', 2, 'Derrotou a Capitã Brida', f.bridaDone);
  add('jaulas', 3, 'Libertou os aprendizes da Brida', f.aprendizesDone);
  add('cavaleiro', 3, 'Venceu o Cavaleiro Sem Nome (secreto)', f.knightDone);
  add('maren3', 3, 'Enfrentou a Inquisidora Maren', f.marenDone);
  add('carruagem', 4, 'Venceu a Carruagem Afogada', f.carroDone);
  add('clara', 4, f.ofeliaRemembers ? 'Devolveu a Clara para a Ofélia' : 'Deixou a Clara dormir', f.claraDone);
  add('cartas', 4, 'Entregou as cartas do Bento', f.lettersDone);
  add('poupou', 5, 'Poupou a Maren', f.marenSpared);
  add('fiscal', 5, 'Venceu o Fiscal da Linha (secreto)', f.fiscalDone);
  add('jorge', 5, 'Venceu o Seu Jorge, o motorista', f.jorgeDone);
  add('diario', 5, 'Leu o diário de bordo do Jorge', f.jorgeDiary);
  add('ambar', 5, 'Descobriu o segredo do âmbar', f.lore_ambar && f.lore_descida);
  add('caderno', 6, 'Devolveu o caderno de fiado ao Ozório', f.soul_ozorio === 'lembrou');
  add('maestro', 6, 'A banda tocou até o fim', f.maestroDone);
  add('p32', 6, 'Venceu o Passageiro 32', f.p32Done);
  add('rita', 6, `Saiu num encontro com a Rita${f.ritaPromise ? ' (e ganhou uma promessa)' : ''}`, f.dateDone);
  add('cancao', 6, 'Guardou o fim da canção da Lume', f.ch6Gift === 'cancao');
  add('timoneiro', 7, 'Fez o Timoneiro soltar o leme', f.timoneiroDone);
  add('capitao', 7, 'Venceu o Capitão da Barca (secreto)', f.capitaoDone);
  add('lacre', 7, 'Rachou o Lacre Real', f.lacreDone);
  add('almas', 7, `Tirou ${(f.saved7 || []).length} almas do mar de âmbar`, (f.saved7 || []).length > 0);
  add('fiado', 7, 'Teve o fiado perdoado', f.fiadoPago);
  add('escriba', 8, 'Deu ao Escriba tempo para achar o próprio nome', f.escribaDone);
  add('catalogo', 8, 'Fechou o Catálogo', f.catalogoDone);
  add('diario8', 8, 'Leu o diário do Catálogo', f.pages8Done);
  add('fita', 8, 'Leu a última anotação da Brida', f.brida8);
  add('passageiros', 8, `Contou com ${(f.helped8 || []).length} passageiros do 31`, (f.helped8 || []).length >= 3);
  add('coracao', 8, f.finalChoice === 'devolver' ? 'Devolveu o Coração de Âmbar' : 'Guardou o Coração de Âmbar na tampa', f.finalChoice);
  add('memorias', 8, 'Saiu da masmorra com todas as memórias', faceBlur8() === 0);
  add('desafio', 8, 'Terminou a temporada no Desafio', G.diff !== 'historia');
  return F;
}
function renown8(F) {
  const secrets = ['cavaleiro', 'fiscal', 'capitao'].filter(k => F.some(x => x.id === k)).length;
  const sc = F.length + secrets * 3 + Math.floor(G.lv / 4) + (G.diff !== 'historia' ? 4 : 0);
  return sc >= 38 ? 'Coisa que não devia existir' : sc >= 28 ? 'Lenda de Velhágua' : sc >= 18 ? 'Ameaça local' : 'Curiosidade da masmorra';
}
function evoLine8() {
  const out = [], f = G.flags; let s = f.prev4 || G.species;
  const chain = [s]; for (let i = 0; i < 5; i++) { const p = Object.keys(SPECIES).find(k => (SPECIES[k].evos || []).includes(chain[0]) && k !== chain[0]); if (!p) break; chain.unshift(p); }
  if (f.grau5 && !chain.includes(f.grau5)) chain.push(f.grau5);
  for (const k of chain) out.push(k); return out;
}
function heritage8() {
  const f = G.flags, F = feats8();
  const H = { v: 1, name: G.name, line: evoLine8(), grau5: f.grau5 || null,
    face: { body: f.prev4 || null, aura: f.grau5 || null, blur: faceBlur8() },
    mem: { pastel: !(f.mem_pastel && !f.pastelBack), vazio: !!f.memVazio },
    lume: { cancao: f.ch6Gift === 'cancao', fone: !!f.lumeFone, coracao: f.lumeHeart || 0 },
    esc: { ofelia: !!f.ofeliaRemembers, maren: !!f.marenSpared, jorge: f.jorgeFate || null, tiago: !!f.tiagoTaken, rita: !!f.ritaPromise, ritaNota: f.dateScore || 0, marlene: f.marleneFate || null, ch6: f.ch6Gift || null, coracao: f.finalChoice || null, almas: f.saved7 || [] },
    feats: F.map(x => x.id), renome: renown8(F), tempo: G.time, dif: G.diff || 'desafio' };
  try { localStorage.setItem('renasci_heranca', JSON.stringify(H)); } catch (e) {}
  const body = btoa(unescape(encodeURIComponent(JSON.stringify(H))));
  let ck = 0; for (let i = 0; i < body.length; i++) ck = (ck * 31 + body.charCodeAt(i)) >>> 0;
  return { H, F, code: 'RCB-H1.' + body + '.' + (ck % 65536).toString(16).padStart(4, '0') };
}
function heritageOverlay8(code) {
  return new Promise(res => {
    OVB.innerHTML = `<h2>Herança da Temporada 1</h2><p>Este código leva para a Temporada 2 o seu nome, a sua forma, as suas escolhas e os seus feitos. Ele também já ficou guardado neste aparelho.</p>
      <textarea id="hc" readonly></textarea><p id="hm"></p><input id="ti" style="position:absolute;opacity:0;width:1px;height:1px"><div class="row"><button class="ob" id="hcp">Copiar</button><button class="ob pri" id="hok">Continuar</button></div>`;
    const hc = OVB.querySelector('#hc'), msg = OVB.querySelector('#hm'); hc.value = code; OV.hidden = false;
    OVB.querySelector('#hcp').onclick = () => { const sel = () => { hc.focus(); hc.select(); }; try { navigator.clipboard.writeText(code).then(() => msg.textContent = 'Copiado.', () => { sel(); msg.textContent = 'Texto selecionado. Copie manualmente.'; }); } catch (e) { sel(); msg.textContent = 'Texto selecionado. Copie manualmente.'; } };
    const close = () => { OV.hidden = true; for (const k in KEYS) KEYS[k] = false; res(); };
    OVB.querySelector('#hok').onclick = close; OVB.querySelector('#ti').onkeydown = e => { if (e.key === 'Enter') close(); };
  });
}
async function endSeason8() {
  const f = G.flags, { H, F, code } = heritage8();
  f.ch8done = true; f.seasonDone = true; saveGame();
  playMusic('ceu8'); const sc0 = V.scene; V.scene = 'black';
  await openWin({ type: 'end8', t: 0, page: 0,
    update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); if (this.page === 0) { this.page = 1; this.t = 60; } else closeWin(this); } },
    draw() {
      bx.globalAlpha = 1; bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
      for (let i = 0; i < 30; i++) { const x = (i * 71 + 13) % 240, y = (i * 37 + 5) % 230; if ((FRAME + i * 13) % 90 < 60) { bx.fillStyle = i % 4 ? '#5a5070' : '#ffe066'; bx.fillRect(x, y, 1, 1); } }
      const a = Math.min(1, this.t / 60);
      if (this.page === 0) {
        if (PORT.humano48) { bx.globalAlpha = a; bx.drawImage(PORT.humano48[0], 4, 178, 48, 48); bx.globalAlpha = 1; }
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 192, 186, 36, 36); bx.globalAlpha = 1;
        txt('FIM DA TEMPORADA 1', 120, 20, { align: 'center', sz: 1.25, col: '#ffe066', alpha: a });
        txt('Renasci como Baú', 120, 44, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, H.line.map(k => (SPECIES[k] || { name: k }).name).slice(-2).join(' > '), `Coração: ${f.finalChoice === 'devolver' ? 'devolvido' : 'guardado na tampa'}`, `Almas trazidas: ${(f.saved7 || []).length} · Passageiros: ${(f.helped8 || []).length}`, `Feitos: ${F.length} · Tempo: ${fmtTime(G.time)}`];
        L.forEach((l, i) => txt(l, 120, 74 + i * 13, { align: 'center', col: '#ffffff', alpha: Math.max(0, Math.min(1, (this.t - 30 - i * 8) / 30)) }));
        txt('RENOME', 120, 148, { align: 'center', col: '#8a8099', alpha: Math.max(0, Math.min(1, (this.t - 80) / 30)) });
        txt(H.renome, 120, 160, { align: 'center', sz: 1.25, col: '#ff8fa8', alpha: Math.max(0, Math.min(1, (this.t - 90) / 30)) });
        txt('Próxima temporada: a superfície.', 120, 178, { align: 'center', col: '#8fe3ff', alpha: Math.max(0, Math.min(1, (this.t - 110) / 30)) });
      } else {
        txt('FEITOS', 120, 8, { align: 'center', sz: 1.25, col: '#ffe066' });
        const per = 16, off = Math.max(0, Math.floor((this.t - 60) / 90) % Math.max(1, Math.ceil(F.length / per)));
        F.slice(off * per, off * per + per).forEach((x, i) => txt(`${x.ch}. ${x.s}`, 6, 26 + i * 12, { col: i % 2 ? '#d8d0e8' : '#ffffff' }));
      }
      if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 226, { align: 'center', col: '#8a8099' });
    } });
  await heritageOverlay8(code);
  V.scene = sc0;
  sfx('catalog');
  await say('[Fim da Temporada 1. Obrigado por jogar.]', 'cat');
  await say('[...]', 'cat');
  await say('[Entrada nova no registro: um baú subiu para a superfície. Classificação: indefinida.]', 'cat');
  await say('* Quem escreveu isso, se o Catálogo fechou?', 'void');
}
{ const _s8 = STORY.saida8; STORY.saida8 = async function () { if (G.flags.seasonDone) { await say('* O 31 espera lá em cima, com o motor ligado e o céu em cima. (A Temporada 2 começa daqui.)'); return; } return _s8(); }; }

// ================= FORMA HUMANA: RETRATO EM ESTILO ANIME (pedido do usuário) =================
// 48x48, traço de anime: olhos grandes com dois brilhos, cílio grosso, franja em mechas, "anel de luz" no cabelo,
// mecha rebelde no topo (protagonista de isekai), queixo fino. O rosto é o mesmo para todos; cabelo, olhos e
// roupa vêm da linha de 4º grau; a aura vem do 5º grau; as memórias perdidas apagam partes do rosto.
const ANIME8 = {
  bastiao: { hair: '#3a4258', hairH: '#7a88a8', eye: '#4a6a9a', cloth: '#4a4a5a', look: 'armor' },
  abismo: { hair: '#24182e', hairH: '#5a3a6a', eye: '#8a1a3a', cloth: '#1a1424', look: 'collar' },
  ferrao: { hair: '#3a6a22', hairH: '#8ac85a', eye: '#4a9a2a', cloth: '#2a4a2a', look: 'sting' },
  carniceiro: { hair: '#6a1a1a', hairH: '#c84a3a', eye: '#d06a1a', cloth: '#3a1414', look: 'scarf' },
  biblioteca: { hair: '#5a3a22', hairH: '#a8784a', eye: '#2a7a7a', cloth: '#e8dcc0', look: 'pages' },
  proibido: { hair: '#24245a', hairH: '#5a6ad0', eye: '#8a5ad8', cloth: '#1e1636', look: 'runes' },
  eclipse: { hair: '#14101e', hairH: '#5a4a8a', eye: '#b48cf0', cloth: '#120e1a', look: 'shadow' },
  constelacao: { hair: '#22306a', hairH: '#6a8ae0', eye: '#7ad0f0', cloth: '#18204a', look: 'stars' }
};
function animeBust8(fr) {
  const f = G.flags, A = ANIME8[f.prev4] || ANIME8.bastiao, aura = f.grau5, blur = faceBlur8();
  const SK = '#f4cdb0', SD = '#e0a888', SL = '#ffe4d0', LN = '#4a2420', H = A.hair, HH = A.hairH, HD = shade(A.hair, 0.7);
  const EYE = aura === 'arca' ? '#e0a020' : aura === 'vazio' ? '#a8b0c8' : A.eye, EYD = shade(EYE, 0.55), EYL = shade(EYE, 1.45);
  const c = cv4(48, 48, (r) => {
    // cabelo de trás (mais comprido nas linhas mágicas)
    const long = ['proibido', 'eclipse', 'constelacao'].includes(f.prev4);
    r(10, 8, 28, long ? 34 : 24, LN); r(11, 9, 26, long ? 32 : 22, HD);
    // pescoço e ombros
    r(20, 34, 8, 6, LN); r(21, 34, 6, 6, SD); r(21, 34, 6, 2, '#c88a70');
    r(4, 39, 40, 9, LN); r(5, 40, 38, 8, A.cloth); r(5, 40, 38, 1, shade(A.cloth, 1.4));
    r(17, 38, 14, 4, LN); r(18, 38, 12, 3, shade(A.cloth, 0.8)); r(20, 38, 8, 2, SD);
    // roupa por linha
    if (A.look === 'armor') { for (const x of [4, 32]) { r(x, 38, 12, 6, LN); r(x + 1, 39, 10, 4, '#8a90a8'); r(x + 1, 39, 10, 1, '#c8d0e0'); r(x + 2, 41, 1, 1, '#f0c040'); r(x + 8, 41, 1, 1, '#f0c040'); } }
    if (A.look === 'collar') { r(14, 34, 20, 6, LN); r(15, 35, 18, 5, '#2a1a3a'); r(15, 35, 18, 1, '#5a3a6a'); }
    if (A.look === 'sting') { r(23, 41, 2, 4, LN); r(23, 44, 2, 2, '#8ac85a'); r(23, 46, 1, 1, '#d8ffb0'); r(5, 40, 6, 8, '#3a6a22'); r(37, 40, 6, 8, '#3a6a22'); }
    if (A.look === 'scarf') { r(12, 36, 24, 6, LN); r(13, 37, 22, 4, '#a82828'); r(13, 37, 22, 1, '#e04848'); r(30, 40, 5, 7, '#a82828'); }
    if (A.look === 'pages') { for (let y = 42; y < 48; y += 2) { r(6, y, 10, 1, '#a89068'); r(32, y, 10, 1, '#a89068'); } r(5, 40, 1, 8, '#c8b890'); }
    if (A.look === 'runes') { for (const [x, y] of [[8, 42], [12, 44], [36, 42], [40, 45]]) { r(x, y, 2, 1, '#b48cf0'); r(x + 1, y - 1, 1, 3, '#b48cf0'); } }
    if (A.look === 'shadow') { for (let i = 0; i < 6; i++) r(4 + i * 7, 36 + (i % 2) * 2, 4, 3, '#2a1a3a'); }
    if (A.look === 'stars') { for (const [x, y] of [[8, 43], [14, 45], [34, 42], [40, 46], [27, 46]]) r(x, y, 1, 1, '#ffe066'); }
    // fecho dourado (lembrança do baú)
    r(22, 40, 4, 4, LN); r(23, 41, 2, 2, '#f0c040'); r(23, 41, 1, 1, '#fff4c0');
    // rosto (largo em cima, queixo fino)
    const HW = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 8, 7, 6, 5, 4, 3, 2];
    HW.forEach((hw, i) => { const y = 12 + i; r(24 - hw - 1, y, hw * 2 + 2, 1, LN); });
    HW.forEach((hw, i) => { const y = 12 + i; r(24 - hw, y, hw * 2, 1, SK); });
    r(23, 37, 2, 1, LN);
    for (let y = 30; y < 36; y++) r(24 - HW[y - 12] + 1, y, 2, 1, SD);
    r(14, 22, 2, 2, SL);
    // orelhas
    r(12, 21, 3, 6, LN); r(13, 22, 2, 4, SD); r(33, 21, 3, 6, LN); r(33, 22, 2, 4, SD);
    // olhos grandes
    const ey = 21;
    for (const [x0, flip] of [[15, 0], [26, 1]]) {
      if (fr === 2) { r(x0, ey + 5, 7, 2, LN); r(flip ? x0 + 6 : x0 - 1, ey + 4, 2, 1, LN); continue; }
      r(x0, ey + 1, 7, 8, '#ffffff');
      r(x0 + 1, ey + 1, 5, 8, EYD); r(x0 + 1, ey + 4, 5, 5, EYE); r(x0 + 2, ey + 7, 3, 2, EYL);
      r(x0 + 2, ey + 3, 3, 3, '#1a0e14');
      r(flip ? x0 + 3 : x0 + 2, ey + 2, 2, 2, '#ffffff'); r(flip ? x0 + 2 : x0 + 4, ey + 7, 1, 1, '#ffffff');
      r(x0 - 1, ey, 9, 2, LN); r(flip ? x0 + 7 : x0 - 2, ey + 1, 2, 1, LN); r(flip ? x0 + 8 : x0 - 3, ey + 2, 1, 1, LN);
      r(x0 + 1, ey + 9, 5, 1, '#c88a80');
      if (aura === 'arca') { r(x0 + 3, ey + 5, 1, 2, '#fff4c0'); }
    }
    // sobrancelhas
    r(15, 18, 6, 1, HD); r(14, 19, 2, 1, HD); r(27, 18, 6, 1, HD); r(32, 19, 2, 1, HD);
    // nariz, boca e rubor
    r(24, 31, 1, 1, SD);
    if (fr === 1) { r(22, 33, 4, 2, LN); r(23, 34, 2, 1, '#e07080'); } else { r(22, 34, 4, 1, LN); r(21, 33, 1, 1, LN); }
    for (const x of [15, 29]) { r(x, 30, 1, 1, '#f08a9a'); r(x + 2, 30, 1, 1, '#f08a9a'); r(x + 4, 30, 1, 1, '#f08a9a'); }
    // detalhes do rosto por linha
    if (A.look === 'scarf' && fr === 1) r(25, 34, 1, 1, '#ffffff');
    if (A.look === 'scarf') { r(31, 25, 1, 4, '#c87070'); r(30, 26, 3, 1, '#c87070'); }
    if (A.look === 'runes') { r(16, 31, 1, 3, '#8a5ad8'); r(31, 31, 1, 3, '#8a5ad8'); }
    if (A.look === 'stars') for (const [x, y] of [[17, 31], [19, 32], [29, 31], [31, 32]]) r(x, y, 1, 1, fr === 2 ? '#ffffff' : '#ffe066');
    if (A.look === 'pages') { r(14, 20, 9, 1, '#3a2a20'); r(25, 20, 9, 1, '#3a2a20'); r(14, 20, 1, 10, '#3a2a20'); r(22, 20, 1, 10, '#3a2a20'); r(25, 20, 1, 10, '#3a2a20'); r(33, 20, 1, 10, '#3a2a20'); r(14, 29, 9, 1, '#3a2a20'); r(25, 29, 9, 1, '#3a2a20'); r(22, 22, 3, 1, '#3a2a20'); }
    // cabelo: copa arredondada com volume
    const CR = [5, 8, 10, 12, 13, 14, 14, 15, 15, 15, 15, 15];
    CR.forEach((hw, i) => r(24 - hw - 1, 2 + i, hw * 2 + 2, 1, LN));
    CR.forEach((hw, i) => r(24 - hw, 2 + i, hw * 2, 1, i < 3 ? shade(H, 1.15) : H));
    // mechas (contorno em todas primeiro, depois o preenchimento, para não listrar)
    const locks = [[9, 11, 22, 4, -3], [12, 12, 19, 5, -2], [16, 12, 21, 5, -1], [20, 12, 18, 4, 0], [23, 12, 22, 4, 1], [27, 12, 19, 5, 1], [31, 12, 21, 5, 2], [35, 11, 22, 4, 3],
      [8, 13, long ? 42 : 33, 4, -1], [36, 13, long ? 42 : 33, 4, 1]];
    const lockPass = (ol) => { for (const [x, y0, y1, w, lean] of locks) { const n = y1 - y0; for (let i = 0; i < n; i++) { const t = i / n, ww = Math.max(1, Math.round(w * (1 - t * 0.85))), xx = x + lean * t * t * 2 + (w - ww) / 2; if (ol) r(xx - 1, y0 + i, ww + 2, 1, LN); else r(xx, y0 + i, ww, 1, i < 2 ? H : t > 0.6 ? HD : H); } if (ol) r(x + lean * 2 + w / 2 - 0.5, y1, 1, 1, LN); } };
    lockPass(true); lockPass(false);
    // fios de sombra dentro da copa
    for (const [x, y, h] of [[15, 6, 6], [20, 4, 8], [28, 4, 8], [33, 6, 6]]) r(x, y, 1, h, HD);
    // anel de luz (brilho de anime) em pedaços
    for (const [x, w] of [[13, 4], [18, 5], [24, 3], [28, 5], [34, 3]]) { r(x, 6, w, 1, HH); r(x + 1, 7, Math.max(1, w - 2), 1, shade(HH, 0.85)); }
    // mecha rebelde (ahoge)
    r(24, 0, 2, 3, LN); r(26, 0, 3, 1, LN); r(28, 1, 1, 1, LN); r(25, 1, 1, 2, H); r(26, 1, 2, 1, H);
    if (A.look === 'runes') { r(29, 6, 3, 9, '#5a6ad0'); r(30, 6, 1, 9, '#8a9af0'); }
    if (A.look === 'stars') for (const [x, y] of [[16, 9], [22, 4], [30, 10], [13, 11], [34, 15]]) r(x, y, 1, 1, '#ffe066');
    if (A.look === 'sting') { for (const [x, y] of [[10, 2], [15, 0], [32, 0], [37, 2]]) { r(x, y, 3, 4, LN); r(x + 1, y + 1, 1, 3, H); } }
    // memórias perdidas apagam o rosto (borracha)
    const R = bgRand(311 + fr);
    for (let i = 0; i < blur * 4; i++) { const y = 26 + Math.floor(R() * (blur >= 3 ? 12 : 9)) - (blur >= 3 ? 6 : 0), x = 14 + Math.floor(R() * 14), w = 4 + Math.floor(R() * 8); r(x, y, w, 1, SK); if (R() < 0.5) r(x + 1, y + 1, w - 2, 1, SL); }
  });
  if (aura === 'vazio') { const x = c.getContext('2d'), d = x.getImageData(0, 0, 48, 48); for (let i = 0; i < d.data.length; i += 4) { const p = i >> 2; if (d.data[i + 3] && ((p % 48) + Math.floor(p / 48)) % 3 === 0) d.data[i + 3] = 120; } x.putImageData(d, 0, 0); }
  return c;
}
function crop32(c) { const o = mk(32, 32); o.getContext('2d').drawImage(c, 8, 4, 32, 32, 0, 0, 32, 32); return o; }
humanPort8 = function () { const B = [0, 1, 2].map(animeBust8); PORT.humano48 = B; return B.map(crop32); };
