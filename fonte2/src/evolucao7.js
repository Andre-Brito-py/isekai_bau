// ================= A 2ª EVOLUÇÃO DA SUPERFÍCIE (Cap. 7, no fundo do Coração) =================
// Cada caminho do Cap. 3 se abre em DOIS. A escolha é dita como uma decisão do baú depois da perda do capítulo (o que
// ele vai fazer com a dor), e cobra outra lembrança da Terra. Cada forma: atributos, técnica nova, passivo, adereço
// novo (por cima do da 1ª) no mapa e na luta. Regra da T2: o caminho mágico bate mais e aguenta menos.
//  FAROL  -> GUARDIÃO (ninguém mais paga por mim): +30 PV, +4 DEF, +4 RES. MURALHA DE LUZ (45T): os inimigos miram o
//            baú por 2 vezes e o grupo ganha Farol por 2. Passivo: o grupo leva 10% menos enquanto o baú está de pé.
//         -> TEMPESTADE (fazer a conta voltar): +5 MAG, +12 PM, +10 PV. RAIO EM CADEIA (35T): luz em todos os inimigos,
//            +40% em quem tem fraqueza a luz. Passivo: os raios do Farol batem em dobro.
//  VÃO    -> LABIRINTO (esconder quem eu amo): +3 VEL, +14 PV, +2 DEF. LABIRINTO (35T): todos os inimigos perdem a vez
//            (atraso grande) e ficam TONTOS. Passivo: Guardar Dentro custa 15.
//         -> BOCA (engolir o que machuca): +5 ATQ, +16 PV. ENGOLIR (30T): inimigo comum com menos de 25% é engolido
//            inteiro (o baú cura 25%); em chefe/forte, mordida 1,5 que quebra 2. Passivo: físico x1,35 (era x1,2).
//  ESCRIBA-> BIBLIOTECÁRIO (guardar tudo, anotar tudo): +4 MAG, +20 PM, +12 PV. BIBLIOTECA VIVA (30T, leve): os
//            próximos 2 feitiços do baú não gastam PM e batem +25%. Passivo: +1 página no Grimório.
//         -> PALIMPSESTO (reescrever a conta): +6 MAG, +10 PM, +8 PV. REESCREVER (30T, leve): o alvo fica fraco a TODOS
//            os elementos do Grimório por 3 vezes e ganha Marca. Passivo: magia x1,25 (era x1,15).
const EVO7 = {
  guardiao: { base: 'farol', nm: 'Farol-Guardião', cor: '#ffe080', escolha: '"Ninguém mais paga por mim."', papel: 'Escudo do grupo: puxa os golpes e protege',
    d: 'A luz do farol vira muralha. Os golpes vêm em você, e a sua luz cobre os outros.', preco: 'A VOZ DA SUA MÃE. O rosto já tinha ido. Agora o "leva casaco, menino" também.',
    mods: { mhp: 30, def: 4, mdef: 4 }, tec: 'muralhaLuz' },
  tempestade: { base: 'farol', nm: 'Farol-Tempestade', cor: '#bff0ff', escolha: '"A conta vai voltar para quem fez."', papel: 'Luz que fere: raios em todos os inimigos',
    d: 'O farol não ilumina mais o caminho. Ilumina o alvo.', preco: 'O BARULHO DA CHUVA NO TELHADO DO SEU QUARTO, nas noites em que você não dormia.',
    mods: { mag: 5, mmp: 12, mhp: 10 }, tec: 'raioCadeia' },
  labirinto: { base: 'vao', nm: 'Vão-Labirinto', cor: '#c8a0ff', escolha: '"Eu escondo quem eu amo. Ninguém acha."', papel: 'O espaço vira armadilha: os inimigos se perdem',
    d: 'O Vão dobra tantas vezes que vira labirinto. Quem entra sem convite não acha a saída nem a vez.', preco: 'O SEU QUARTO. A porta, a cama, a janela, o cheiro. O lugar inteiro.',
    mods: { spd: 3, mhp: 14, def: 2 }, tec: 'labirinto' },
  boca: { base: 'vao', nm: 'Vão-Boca', cor: '#ff8aa8', escolha: '"Eu engulo o que machuca. Inteiro."', papel: 'Fome: engole inimigos fracos inteiros',
    d: 'O Vão desce até o fundo da tampa. A mordida fica sem fim.', preco: 'O GOSTO DE TUDO QUE VOCÊ COMEU NA TERRA. De uma vez.',
    mods: { atk: 5, mhp: 16 }, tec: 'engolir' },
  bibliotecario: { base: 'escriba', nm: 'Escriba-Bibliotecário', cor: '#8fe3d8', escolha: '"Eu guardo tudo. Anoto tudo. Nada mais se perde."', papel: 'Memória: feitiços de graça e mais páginas',
    d: 'A tampa vira estante. Cada feitiço lançado fica anotado e volta mais barato.', preco: 'O PRIMEIRO LIVRO QUE VOCÊ LEU. E quem leu ele pra você, antes de você saber ler.',
    mods: { mag: 4, mmp: 20, mhp: 12 }, tec: 'bibliotecaViva' },
  palimpsesto: { base: 'escriba', nm: 'Escriba-Palimpsesto', cor: '#f2ecdc', escolha: '"Se a conta está errada, eu reescrevo a conta."', papel: 'Reescreve a ficha do inimigo: fraqueza a tudo',
    d: 'A tinta raspa o que estava escrito e escreve por cima. Inclusive nos inimigos.', preco: 'O SEU NOME DA TERRA. Você continua sendo @. Só @.',
    mods: { mag: 6, mmp: 10, mhp: 8 }, tec: 'reescrever' }
};
function evo7() { return G.evo7 && EVO7[G.evo7] ? G.evo7 : null; }
{ const _gc7 = grupoCap1; grupoCap1 = function () {
  const g = _gc7(), ev = evo7();
  if (ev) for (const m of g) if (m.id === 'bau') { for (const [a, v] of Object.entries(EVO7[ev].mods)) m[a] = (m[a] || 0) + v; m.techs = [...(m.techs || []), EVO7[ev].tec]; m.evo7 = ev; if (ev === 'boca') { m.atkNm = 'Mordida Sem Fim'; } }
  return g;
}; }
{ const _cd7 = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cd7(a, t, pow, o);
  if (a && a.id === 'bau' && a.evo7 === 'boca' && !o.mag) d *= 1.35 / 1.2;
  if (a && a.id === 'bau' && a.evo7 === 'palimpsesto' && o.mag) d *= 1.25 / 1.15;
  if (a && a.id === 'bau' && a.st && a.st.biblio > 0 && o.mag) d *= 1.25;
  if (t && t.side === 'p' && BT.party && BT.party.some(u => u.id === 'bau' && u.evo7 === 'guardiao' && u.hp > 0)) d *= 0.9;
  if (t && t.st && t.st.reescrito > 0 && o.el && a && a.side === 'p' && !t.weak.includes(o.el)) d *= 1.3;
  return d;
}; }
// Biblioteca Viva: o feitiço não gasta PM
{ const _dc7 = doCommand; doCommand = async function (m, k) {
  if (m && m.id === 'bau' && k === 'runas' && m.st && m.st.biblio > 0) { const mp0 = m.mp; const r = await _dc7(m, k); if (r && m.mp < mp0) { m.mp = mp0; m.st.biblio--; const [x, y] = unitCenter(m); popNum(x, y - 34, 'ANOTADO: 0 PM', '#8fe3d8'); } return r; }
  return _dc7(m, k);
}; }
{ const _gm7 = grim; grim = function () { const G_ = _gm7(); if (evo7() === 'bibliotecario' && !G_._bib7) { G_._bib7 = true; G_.max = (G_.max || 4) + 1; } return G_; }; }
// os raios do Farol em dobro na Tempestade: o Farol já devolve raio; aqui dobramos o dano do raio
{ const _hfR = hitFoe; hitFoe = function (a, t, pow, o = {}) { if (a && a.id === 'bau' && a.evo7 === 'tempestade' && o.raioFarol) pow *= 2; return _hfR(a, t, pow, o); }; }
Object.assign(ST_NAME, { biblio: 'ANOTANDO', reescrito: 'REESCRITO' });
Object.assign(TECH2, {
  muralhaLuz: { nm: 'Muralha de Luz', cost: 45, tgt: 'self', d: 'Os inimigos miram o baú nas próximas 2 vezes, e o grupo inteiro ganha Farol (metade do dano, raio de volta) por 2.', run: async (m) => {
    sfx('rune'); flashW(2); const [x, y] = unitCenter(m);
    await tw(30, p => { bx.globalAlpha = 0.5 * (1 - p); bx.fillStyle = '#fff0a0'; bx.fillRect(Math.round(x + 14), Math.round(y - 70), Math.round(6 + p * 10), 90); bx.globalAlpha = 1; luzMagia(x, y - 20, 20 + p * 60, '#ffe080', 0.7 - p * 0.4); });
    BT.taunt = { m, n: 2 }; m.def0 = true;
    for (const u of alive(BT.party)) { u.st.farol = Math.max(u.st.farol || 0, 2); const [ux, uy] = unitCenter(u); burst(ux, uy, 8, ['#fff0a0', '#ffffff']); }
    callout('Muralha de Luz: venham em mim!', '#ffe080', 60);
  } },
  raioCadeia: { nm: 'Raio em Cadeia', cost: 35, tgt: 'all', d: 'Um raio de luz pula de inimigo em inimigo. Bate em todos; +40% em quem é fraco a luz.', run: async (m) => {
    sfx('crit'); const [x0, y0] = unitCenter(m); const L = alive(BT.foes); let px = x0, py = y0 - 20;
    for (const t of L) { const [tx, ty] = unitCenter(t); await tw(8, p => { bx.strokeStyle = '#bff0ff'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(px, py); for (let i = 1; i <= 4; i++) bx.lineTo(px + (tx - px) * i / 4 + (i < 4 ? (Math.random() - 0.5) * 10 : 0), py + (ty - py) * i / 4 + (i < 4 ? (Math.random() - 0.5) * 10 : 0)); bx.stroke(); }); burst(tx, ty, 10, ['#bff0ff', '#ffffff', '#fff0a0']); hitFoe(m, t, t.weak.includes('luz') ? 1.19 : 0.85, { el: 'luz', mag: true }); px = tx; py = ty; }
  } },
  labirinto: { nm: 'Labirinto', cost: 35, tgt: 'all', d: 'O Vão engole o campo de batalha e devolve torto: todos os inimigos perdem muito da vez e ficam TONTOS.', run: async (m) => {
    sfx('rune'); const [x0, y0] = unitCenter(m);
    await tw(30, p => { for (let i = 0; i < 5; i++) { const r = (p * 120 + i * 24) % 120; bx.strokeStyle = i % 2 ? '#c8a0ff' : '#8a60d0'; bx.lineWidth = 1; bx.strokeRect(Math.round(x0 + 60 - r), Math.round(y0 - 20 - r / 2), Math.round(r * 2), Math.round(r)); } });
    for (const t of alive(BT.foes)) { t.ct = Math.max(0, t.ct - 55); t.st.tonto = 1; const [tx, ty] = unitCenter(t); popNum(tx, ty - 30, 'PERDIDO', '#c8a0ff'); }
    callout('Ninguém acha a saída.', '#c8a0ff', 60);
  } },
  engolir: { nm: 'Engolir', cost: 30, tgt: 'enemy', d: 'Inimigo comum com menos de 25% de vida é engolido INTEIRO (o baú cura 25%). Nos fortes, uma mordida 1,5 que quebra 2.', run: async (m, t) => {
    if (!t) return; const [tx, ty] = unitCenter(t), [x0, y0] = unitCenter(m);
    await tw(12, p => { m.ox = (tx - x0 - 20) * ease.io(p); m.oy = -Math.sin(p * Math.PI) * 10; });
    if (!t.boss && t.hp < t.mhp * 0.25) {
      sfx('crit'); await tw(18, p => { t.sx = 1 - p; t.sy = 1 - p; t.alpha = 1 - p; t.ox = (x0 + (tx - x0) * 0.3 - tx) * p; });
      t.hp = 0; t.alpha = 0; healUnit(m, Math.round(m.mhp * 0.25)); popNum(tx, ty - 20, 'NHAC!', '#ff8aa8', true); callout('Engolido inteiro.', '#ff8aa8', 50);
    } else { sfx('hit'); burst(tx, ty, 14, ['#ff8aa8', '#ffffff']); hitFoe(m, t, 1.5, { el: 'mordida', brk: 2 }); }
    await tw(10, p => { m.ox = (tx - x0 - 20) * (1 - p); m.oy = 0; }); m.ox = 0;
  } },
  bibliotecaViva: { nm: 'Biblioteca Viva', cost: 30, tgt: 'self', w: 'leve', d: 'Os próximos 2 feitiços do baú não gastam PM e batem 25% mais. Leve.', run: async (m) => {
    sfx('rune'); const [x, y] = unitCenter(m);
    await tw(24, p => { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + p * 4; bx.fillStyle = i % 2 ? '#f2ecdc' : '#8fe3d8'; bx.fillRect(Math.round(x + Math.cos(a) * 24), Math.round(y - 20 + Math.sin(a) * 12), 4, 3); } });
    m.st.biblio = 2; callout('Tudo anotado.', '#8fe3d8', 50);
  } },
  reescrever: { nm: 'Reescrever', cost: 30, tgt: 'enemy', w: 'leve', d: 'Raspa a ficha do inimigo e escreve por cima: por 3 vezes ele fica fraco a TODOS os elementos do Grimório, e marcado. Leve.', run: async (m, t) => {
    if (!t) return; sfx('rune'); const [tx, ty] = unitCenter(t);
    await tw(26, p => { for (let i = 0; i < 6; i++) { bx.fillStyle = '#f2ecdc'; bx.fillRect(Math.round(tx - 20 + p * 40), Math.round(ty - 40 + i * 6), 3, 2); bx.fillStyle = '#c83a3a'; bx.fillRect(Math.round(tx - 20 + p * 38), Math.round(ty - 39 + i * 6), 2, 1); } });
    t.st.reescrito = 3; t.st.marca = Math.max(t.st.marca || 0, 3); popNum(tx, ty - 34, 'REESCRITO', '#f2ecdc'); callout('A ficha agora diz: fraco a tudo.', '#f2ecdc', 60);
  } }
});
// reescrito e biblio vencem com as vezes
{ const _etR = endTurn; endTurn = function (u, w) { const r = _etR.apply(this, arguments); if (u && u.side === 'e' && u.st && u.st.reescrito > 0) u.st.reescrito--; return r; }; }
// Guardar Dentro mais barato no Labirinto
{ const T0 = TECH2.guardarDentro; if (T0) Object.defineProperty(T0, 'cost', { get: () => evo7() === 'labirinto' ? 15 : 25, configurable: true }); }
// desenho: o adereço da 2ª forma por cima
{ const _du7 = drawUnit; drawUnit = function (u) {
  const r = _du7(u);
  if (u && u.id === 'bau' && u.evo7 && !u.humano && u.hp > 0 && u._X != null) { const A = aderecoEvo7(u.evo7), w = u._fw * u._sx; bx.drawImage(A, Math.round(u._X + w / 2 - 12), Math.round(u._Y - 22 + Math.sin(BT.t * 0.07 + 1) * 1.5)); }
  return r;
}; }
{ const _dp7 = drawPlayer; drawPlayer = function (ox, oy) {
  const r = _dp7(ox, oy), ev = evo7();
  if (ev && !W2.float && !deRosto()) { const A = aderecoEvo7(ev); bx.drawImage(A, Math.round(W2.px - ox - 2), Math.round(W2.py - oy - 24 + Math.sin(W2.t * 0.07) * 1.5), 20, 15); }
  return r;
}; }
// a cena da escolha (chamada no fim do Cap. 7)
async function cenaEvolucao7() {
  if (G.evo7) return;
  const base = evo3() || 'farol', ks = Object.keys(EVO7).filter(k => EVO7[k].base === base);
  await say('[O veio. O âmbar bruto da masmorra, o mesmo que fez o seu corpo lá embaixo, está pulsando de novo. Debaixo de você.]', 'cat');
  await say('[O corpo pede forma nova. Duas respondem. Cada uma é uma resposta para a mesma pergunta: o que você vai FAZER com isso que aconteceu?]', 'cat');
  let ev = null;
  while (!ev) {
    const k = await escolhaArca(ks, 'O que você vai fazer com isso?', q => ({ papel: EVO7[q].escolha + ' ' + EVO7[q].papel, d: EVO7[q].d, preco: EVO7[q].preco }));
    const E = EVO7[k];
    await say(`[${E.nm}. Preço: ${E.preco}]`, 'cat');
    const c = await choose(`* ${E.escolha}`, ['É isso.', 'Pensar de novo']);
    if (c === 0) ev = k;
  }
  const E = EVO7[ev];
  const preco = {
    guardiao: ['* "Leva casaco, menino." Você escuta a frase de novo, como sempre escutou quando fazia frio.', '* E então a frase fica sem voz. As palavras continuam lá. Ninguém mais fala elas.'],
    tempestade: ['* Chuva no telhado de zinco. Você deitado, sem sono, contando os pingos.', '* O som vai baixando, baixando, e a chuva continua caindo, muda.'],
    labirinto: ['* Um quarto. Uma cama encostada na parede, uma janela que não fechava direito.', '* As paredes se dobram para dentro do Vão e não voltam. Você teve um quarto. Não sabe mais qual.'],
    boca: ['* Café com leite. Pão na chapa. O arroz da sua avó. O pastel, que já tinha ido.', '* Um por um, os gostos entram na boca do Vão e descem. Você ainda sabe os nomes. Só os nomes.'],
    bibliotecario: ['* Um livro de capa mole, com um bicho na capa. Uma voz lendo devagar, apontando com o dedo.', '* A estante nova da sua tampa guarda tudo. Menos isso. Isso foi o preço da estante.'],
    palimpsesto: ['* O seu nome. O de antes. O que a sua mãe gritava da janela.', '* A tinta raspa devagar, como borracha em papel velho. Por cima, alguém escreve: @.']
  }[ev];
  for (const l of preco) await say(l);
  await say('Eu guardo. Eu prometi. Eu guardo numa música.', 'lume');
  { const antes = arcaAtualImg(); garantirArca(ev); await transformaArca(antes, IMG_CHEST_T['evo_' + ev].three, E.cor, E.nm); }
  sfx('rune'); V.shake = 18;
  G.evo7 = ev; delete PTC.me; curarTudo();
  await say(`* {y}${G.name} evoluiu para ${E.nm}!{/}`);
  await say(`[TÉCNICA NOVA: ${TECH2[E.tec].nm}. ${TECH2[E.tec].d}]`, 'cat');
  save2();
}
