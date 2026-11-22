// ================= A EVOLUÇÃO DA SUPERFÍCIE (Cap. 3, Parte 2) =================
// No veio de âmbar das Galerias, o baú evolui. TRÊS caminhos, cada um com uma LEMBRANÇA DA TERRA como preço (mostrada
// antes de escolher). A evolução soma ao que veio do jogo 1 (linha de Ferro ou Arcana) e muda: atributos, uma técnica
// nova, um traço passivo e a aparência (baú no mapa e na luta, e a forma humana).
// CALIBRAGEM (pedido do usuário: no jogo 1 o caminho mágico ficou mais fraco que o de ferro): cada caminho foi testado
// com o bot nas mesmas lutas e no mesmo chefe, nas duas linhas do jogo 1; os números abaixo vêm desses testes.
//   ARCA-FAROL  : protetor. +34 PV, +4 DEF, +4 RES, +2 MAG. Técnica FAROL (35T): por 3 vezes de cada um, o grupo leva
//                 metade do dano e cada golpe recebido devolve um raio de luz em quem bateu. Passivo: começa a luta
//                 com +15 de Tensão.
//   ARCA DO VÃO : ágil. +4 ATQ, +3 VEL, +14 PV. Técnica GUARDAR DENTRO (25T, leve): guarda um aliado dentro do baú; o
//                 próximo golpe nele erra e a vez dele adianta. Passivo: a mordida "atravessa" (+20% de dano físico).
//   ARCA-ESCRIBA: mágico. +7 MAG, +18 PM, +10 PV. Técnica MARCA DE RUNA (25T, leve): marca um inimigo por 3 vezes;
//                 magia nele bate +30% e quebra 1 escudo a mais. Passivo: Grimório com 6 páginas, feitiços -1 PM e
//                 +15% de dano mágico.
const EVO3 = {
  farol: { nm: 'Arca-Farol', cor: '#ffd060', papel: 'Protetor: aguenta e devolve em luz',
    d: 'O âmbar vira luz dentro da tampa. Vira um farol que protege o grupo e devolve cada golpe em raio de luz.',
    preco: 'O ROSTO DA SUA MÃE. A voz fica. O rosto vai.',
    mods: { mhp: 34, def: 4, mdef: 4, mag: 2, atk: 2 }, tec: 'farol' },
  vao: { nm: 'Arca do Vão', cor: '#c8a0ff', papel: 'Ágil: guarda aliados dentro, morde atravessando',
    d: 'O espaço dobrado da tampa fica maior. Dá para guardar alguém dentro no meio da luta, e a mordida atravessa.',
    preco: 'O CAMINHO DE CASA. O endereço, o nome da rua, o ponto onde você descia do 31.',
    mods: { atk: 4, spd: 3, mhp: 14 }, tec: 'guardarDentro' },
  escriba: { nm: 'Arca-Escriba', cor: '#8fe3d8', papel: 'Mágico: marca inimigos e escreve feitiços mais fortes',
    d: 'A tinta de superfície entra na madeira. O Grimório cresce, os feitiços ficam mais baratos e mais fortes, e dá para escrever runas NOS inimigos.',
    preco: 'A SUA LETRA. Como você escrevia o próprio nome à mão. A assinatura.',
    mods: { mag: 7, mmp: 18, mhp: 10 }, tec: 'marcaRuna' }
};
function evo3() { return G.evo3 && EVO3[G.evo3] ? G.evo3 : null; }

// ---------- atributos e técnica ----------
{ const _gc3 = grupoCap1; grupoCap1 = function () {
  const g = _gc3(), ev = evo3();
  for (const m of g) {
    if (m.id === 'bau' && ev) { for (const [a, v] of Object.entries(EVO3[ev].mods)) m[a] = (m[a] || 0) + v; m.techs = [...(m.techs || []), EVO3[ev].tec]; m.evo = ev; if (ev === 'vao') { m.atkNm = 'Mordida do Vão'; m.atkDesc = 'A mordida atravessa o espaço: +20% de dano. A quando o anel fechar = mordida certeira.'; } }
    if (m.id === 'bau' && G.flags.c3Forma) m.techs = [...(m.techs || []), 'trocaForma'];
    if (m.id === 'rita' && G.forja && G.forja.lanca) m.atk += 3;
    if (m.id === 'rita' && G.forja && G.forja.escudo) { m.def += 2; m.mhp += 10; }
  }
  return g;
}; }
// passivos
{ const _cd4 = calcDmg; calcDmg = function (a, t, pow, o = {}) {
  let d = _cd4(a, t, pow, o);
  if (a && a.id === 'bau' && a.evo === 'vao' && !o.mag) d *= 1.2;
  if (a && a.id === 'bau' && a.evo === 'escriba' && o.mag) d *= 1.15;
  if (t && t.st && t.st.marca > 0 && o.mag && a && a.side === 'p') d *= 1.3;
  return d;
}; }
{ const _hf6 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  const tinha = t && t.st && t.st.marca > 0 && o.mag && t.shield > 0;
  const r = _hf6(a, t, pow, o);
  if (tinha && t.hp > 0 && t.shield > 0 && r > 0) { t.shield = Math.max(0, t.shield - 1); const [x, y] = unitCenter(t); popNum(x + 10, y - 14, 'MARCA', '#8fe3d8'); }
  return r;
}; }
{ const _pg3 = pagina3; pagina3 = function (s) { const P = _pg3(s); if (evo3() === 'escriba') P.mp = Math.max(2, P.mp - 1); return P; }; }
{ const _ba3 = battle2; battle2 = function (o) { if (evo3() === 'farol' && o) o.tension = Math.min(100, (o.tension || 0) + 15); return _ba3(o); }; }
// o Farol: metade do dano e raio de luz de volta
{ const _fs4 = foeStrike; foeStrike = async function (e, t, pow, o = {}) {
  const prot = t && t.st && t.st.farol > 0 && t.hp > 0;
  if (prot) t.def0 = true;
  const r = await _fs4(e, t, pow, o);
  if (prot && e && e.hp > 0) { const b = BT.party.find(m => m.id === 'bau' && m.hp > 0); if (b) { const [x0, y0] = unitCenter(b), [x1, y1] = unitCenter(e); await tw(8, p => { bx.strokeStyle = '#fff0a0'; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(x0, y0 - 10); bx.lineTo(x0 + (x1 - x0) * p, y0 - 10 + (y1 - y0 + 10) * p); bx.stroke(); bx.lineWidth = 1; luzMagia(x0, y0 - 10, 12, '#fff0a0', 0.6); }); hitFoe(b, e, 0.6, { el: 'luz', mag: true, ranged: true }); } }
  return r;
}; }
Object.assign(ST_NAME, { farol: 'FAROL', marca: 'MARCA' });
Object.assign(TECH2, {
  farol: { nm: 'Farol', cost: 35, tgt: 'self', d: 'A tampa vira farol: por 3 vezes de cada um, o grupo leva metade do dano e cada golpe recebido devolve um raio de luz.', run: async (m) => {
    sfx('rune'); flashW(2); const [x, y] = unitCenter(m);
    await tw(30, p => { luzMagia(x, y - 30, 30 + p * 50, '#fff0a0', 0.9 - p * 0.4); for (let i = 0; i < 8; i++) { const a = p * 2 + i / 8 * Math.PI * 2; bx.globalAlpha = 0.35 * (1 - p); bx.strokeStyle = '#fff0a0'; bx.beginPath(); bx.moveTo(x, y - 30); bx.lineTo(x + Math.cos(a) * 140, y - 30 + Math.sin(a) * 60); bx.stroke(); bx.globalAlpha = 1; } });
    for (const u of alive(BT.party)) { u.st.farol = 3; const [ux, uy] = unitCenter(u); burst(ux, uy, 10, ['#fff0a0', '#ffffff']); }
    callout('Farol aceso!', '#fff0a0', 60);
  } },
  guardarDentro: { nm: 'Guardar Dentro', cost: 25, tgt: 'ally', w: 'leve', d: 'Guarda um aliado DENTRO do baú: o próximo golpe nele erra e a vez dele adianta. Leve.', run: async (m, t) => {
    if (t === m) { callout('Escolha outro aliado', '#ff6b6b', 40); BT.tension += 25; return; }
    sfx('rune'); const [x, y] = unitCenter(t), [bx0, by0] = unitCenter(m);
    await tw(16, p => { t.sx = 1 - p * 0.7; t.sy = 1 - p * 0.7; t.alpha = 1 - p * 0.6; for (let i = 0; i < 6; i++) { const a = p * 8 + i; bx.fillStyle = '#c8a0ff'; bx.fillRect(Math.round(x + (bx0 - x) * p + Math.cos(a) * 8 * (1 - p)), Math.round(y + (by0 - y) * p + Math.sin(a) * 8 * (1 - p)), 2, 2); } });
    await tw(12, p => { t.sx = 0.3 + p * 0.7; t.sy = 0.3 + p * 0.7; t.alpha = 0.4 + p * 0.6; fxRing(x, y, 14 * (1 - p), '#c8a0ff', 1 - p); });
    t.sx = 1; t.sy = 1; t.alpha = 1; t.st.sumido = 2; t.ct = Math.min(99, t.ct + 30);
    popNum(x, y - 26, 'GUARDADO', '#c8a0ff'); callout(t.name + ' está no Vão', '#c8a0ff', 50);
  } },
  marcaRuna: { nm: 'Marca de Runa', cost: 25, tgt: 'enemy', w: 'leve', d: 'Escreve uma runa NO inimigo por 3 vezes: magia nele bate +30% e quebra 1 escudo a mais. Leve.', run: async (m, t) => {
    sfx('rune'); const [x, y] = unitCenter(t);
    await projetilMagia({ _pt: [m.x, m.y - m.h + 6] }, t, 'luz', 14);
    await tw(22, p => { const r = 12; bx.globalAlpha = Math.min(1, p * 2); bx.strokeStyle = '#8fe3d8'; bx.lineWidth = 2; bx.beginPath(); for (let i = 0; i <= 5 * p; i++) { const a = -Math.PI / 2 + i * Math.PI * 4 / 5; const X = x + Math.cos(a) * r, Y = y + Math.sin(a) * r; if (i === 0) bx.moveTo(X, Y); else bx.lineTo(X, Y); } bx.stroke(); bx.lineWidth = 1; bx.globalAlpha = 1; });
    t.st.marca = 3; popNum(x, y - 26, 'MARCADO', '#8fe3d8'); callout('Runa escrita em ' + t.name, '#8fe3d8', 50);
  } },
  // ---------- TROCA DE FORMA EM BATALHA ----------
  trocaForma: { nm: 'Trocar de Forma', cost: 0, tgt: 'self', w: 'leve', d: 'Baú <-> humano (ação leve). Humano: +4 VEL, +3 MAG, -4 DEF, golpe de corte, feitiços -2 PM. Dura 3 vezes (fôlego).', run: async (m) => { await trocarForma(m); } }
});
// ---------- troca de forma ----------
async function trocarForma(m, volta) {
  const [x, y] = unitCenter(m); sfx('rune');
  await tw(14, p => { m.sx = 1 + Math.sin(p * Math.PI) * 0.3; m.sy = 1 - Math.sin(p * Math.PI) * 0.3; luzMagia(x, y, 20, '#ffe8c0', Math.sin(p * Math.PI)); });
  m.humano = !m.humano && !volta;
  if (m.humano) { m.spd += 4; m.mag += 3; m.def -= 4; m.humTurnos = 3; m.h = 48; m.atkNm0 = m.atkNm; m.atkNm = 'Golpe de Mão'; m.attack0 = m.attack; m.attack = golpeHumano; }
  else { m.spd -= 4; m.mag -= 3; m.def += 4; m.h = 26; if (m.atkNm0) m.atkNm = m.atkNm0; if (m.attack0) m.attack = m.attack0; }
  m.sx = 1; m.sy = 1; for (let i = 0; i < 14; i++) part({ forma: 'estrela', x: x + rand(-10, 10), y: y + rand(-20, 10), vy: -0.5, life: 24, col: '#ffe8c0' });
  callout(m.humano ? m.name + ' toma forma humana' : m.name + ' volta a ser baú', '#ffe8c0', 50);
}
async function golpeHumano(m, t) {
  const [tx, ty] = unitCenter(t), x0 = m.x, dx = tx - 22 - m.x;
  await tw(10, p => { m.ox = dx * ease.io(p); m.oy = -Math.sin(p * Math.PI) * 6; });
  const ok = await timedPrompt(t, 18); slashFx(tx, ty, '#ffe8c0', ok ? 1.4 : 1); sfx('hit');
  hitFoe(m, t, ok ? 1.25 : 0.95, { el: 'corte', crit: ok });
  await tw(10, p => { m.ox = dx * (1 - p); m.oy = 0; }); m.ox = 0;
}
// fôlego da forma humana: 3 vezes, depois volta sozinho; feitiços mais baratos enquanto humano
{ const _et3 = endTurn; endTurn = function (u, w) { const r = _et3.apply(this, arguments); if (u && u.humano) { u.humTurnos--; if (u.humTurnos <= 0) { callout('O rosto derrete: volta a ser baú', '#ffe8c0', 50); trocarForma(u, true); } } return r; }; }
{ const _dc4 = doCommand; doCommand = async function (m, k) { if (m && m.humano && k === 'runas') { const salvo = {}; for (const rk of m.runas || []) { const S = RUNA2[rk]; if (S) { salvo[rk] = S.mp; S.mp = Math.max(2, S.mp - 2); } } try { return await _dc4(m, k); } finally { for (const rk in salvo) RUNA2[rk].mp = salvo[rk]; } } return _dc4(m, k); }; }
// desenho: baú evoluído (adereço por cima) e forma humana na luta
const ADERECO = {};
function aderecoEvo(ev) {
  if (ADERECO[ev]) return ADERECO[ev]; const P = new Pix(20, 16);
  if (ev === 'farol') { P.rect(7, 4, 6, 8, '#3a3048'); P.rect(8, 5, 4, 6, '#ffe080'); P.rect(9, 6, 2, 3, '#ffffff'); P.rect(6, 2, 8, 2, '#c8a040'); P.p(10, 0, '#c8a040'); P.p(10, 1, '#c8a040'); P.rect(6, 12, 8, 2, '#c8a040'); }
  else if (ev === 'vao') { for (let i = 0; i < 22; i++) { const a = i * 0.55, r = i * 0.32; P.p(10 + Math.round(Math.cos(a) * r), 8 + Math.round(Math.sin(a) * r), i % 3 ? '#c8a0ff' : '#ffffff'); } }
  else { for (let i = 0; i < 12; i++) P.p(4 + i, 12 - i, i < 3 ? '#2a2038' : '#f2ecdc'); for (let i = 3; i < 12; i++) P.p(5 + i, 12 - i, '#c8c0d8'); P.rect(2, 13, 3, 2, '#2a2038'); P.p(14, 14, '#2a2038'); }
  return ADERECO[ev] = P.outline().canvas();
}
{ const _bf = bauFrame; bauFrame = function (u) {
  if (u && u.humano) { const A = rostoArte(); return A ? A.body[Math.floor(BT.t / 20) % A.body.length] : _bf(u); }
  return _bf(u);
}; }
{ const _du3 = drawUnit; drawUnit = function (u) {
  const r = _du3(u);
  if (u && u.id === 'bau' && u.evo && !u.humano && u.hp > 0 && u._X != null) { const A = aderecoEvo(u.evo), w = u._fw * u._sx; bx.drawImage(A, Math.round(u._X + w / 2 - 10), Math.round(u._Y - 10 + Math.sin(BT.t * 0.08))); if (u.evo === 'farol') luzMagia(u._X + w / 2, u._Y - 2, 16, '#ffe080', 0.35); }
  return r;
}; }
// no mapa: o adereço em cima do baú
{ const _dpE = drawPlayer; drawPlayer = function (ox, oy) {
  const r = _dpE(ox, oy), ev = evo3();
  if (ev && !W2.float) { const A = aderecoEvo(ev), x = W2.px - ox, y = W2.py - oy; if (deRosto()) bx.drawImage(A, Math.round(x + 6), Math.round(y - 10), 10, 8); else bx.drawImage(A, Math.round(x - 2), Math.round(y - 14 + Math.sin(W2.t * 0.08))); }
  return r;
}; }

// ---------- A CENA DA EVOLUÇÃO ----------
async function cenaEvolucao() {
  if (G.evo3) return;
  await say('* O veio de âmbar pulsa. Não brilha: pulsa, como um coração. E a cada batida, a sua tampa range e puxa na direção dele.');
  await say('Ei. EI. Você tá sendo puxado. Por que você tá sendo puxado?', 'rita');
  await say('[Âmbar bruto, tinta de superfície no Grimório e fuligem de lembranças, juntos. São as condições de uma EVOLUÇÃO. O corpo do baú está pedindo forma nova.]', 'cat');
  await say('Evolução? Que nem lá embaixo? Quando você mudou e...', 'lume');
  await say('* A Lume para. Ela lembra do que aconteceu da última vez. Você também.');
  await say('[Toda evolução tem preço. Aqui em cima, o preço é uma lembrança da Terra. Cada caminho cobra uma diferente. Você vai saber qual antes de escolher.]', 'cat');
  await say('[Três formas respondem ao veio. Escolha com calma. Não dá para desfazer.]', 'cat');
  let ev = null;
  while (!ev) {
    const ks = Object.keys(EVO3);
    const i = await list({ x: 24, y: 20, w: 192, title: 'Três caminhos', items: ks.map(k => ({ label: EVO3[k].nm, col: EVO3[k].cor, right: '' })), desc: j => EVO3[ks[j]] && (EVO3[ks[j]].papel + '. ' + EVO3[ks[j]].d), descY: 118 });
    if (i < 0) continue;
    const E = EVO3[ks[i]];
    await say(`[${E.nm}. Preço: ${E.preco}]`, 'cat');
    const c = await choose(`* Evoluir para ${E.nm}?`, ['Evoluir', 'Ver os outros caminhos']);
    if (c === 0) ev = ks[i];
  }
  const E = EVO3[ev];
  // a lembrança indo embora
  if (ev === 'farol') {
    await say('* Você tenta lembrar do rosto da sua mãe. Está lá: o sorriso de canto, a ruga entre as sobrancelhas quando ela fazia conta.');
    await say('* E então o âmbar entra na madeira, e o rosto fica claro demais, como foto contra o sol. Branco. Some.');
    await say('* A voz fica. "Leva casaco, menino." A voz fica.');
  } else if (ev === 'vao') {
    await say('* Você tenta lembrar do caminho de casa. O ponto do 31. A padaria da esquina. O número no portão, pintado à mão.');
    await say('* O espaço dentro da tampa se dobra mais uma vez, e o caminho dobra junto. A rua fica sem nome. O ponto fica sem placa. O número no portão escorre.');
    await say('* Você sabe que tinha uma casa. Você só não sabe mais chegar nela.');
  } else {
    await say('* Você tenta lembrar da sua letra. Do jeito que você assinava. O primeiro traço do nome, sempre torto, sempre igual.');
    await say('* A tinta entra na madeira, e o traço torto se desfaz como risco de giz na chuva.');
    await say('* Você ainda sabe o seu nome. Só não sabe mais como a sua mão o escrevia.');
  }
  await say('...Eu guardo.', 'lume');
  await say('Eu guardo pra você. Numa música. Toda vez que você esquecer alguma coisa, eu ponho numa música. Aí ela fica em algum lugar.', 'lume');
  await say('* Ela canta baixinho. Uma frase só. E por um segundo, você quase lembra.');
  // a transformação
  sfx('rune'); V.shake = 18; flashW && 0;
  await say('* O veio apaga. A luz toda entra em você de uma vez.');
  G.evo3 = ev; G.flags.c3Forma = true; curarTudo();
  await say(`* {y}${G.name} evoluiu para ${E.nm}!{/}`);
  if (ev === 'farol') await say('Você virou um FAROL. Com lanterna e tudo. Agora sou eu que vou ficar com ciúme de quem brilha mais.', 'lume');
  if (ev === 'vao') await say('Tem mais espaço aí dentro? Mais do que antes? Daqui a pouco você guarda a capital inteira.', 'rita');
  if (ev === 'escriba') await say('[Registro: o Grimório agora tem seis páginas. E uma pena. Você tem uma pena na tampa. Isso não estava previsto.]', 'cat');
  if (ev === 'escriba') grim().max = 6;
  await say('E o rosto? Ele ficou... mais firme. Dá pra ver daqui. Menos borrado.', 'rita');
  await say(`[TÉCNICA NOVA: ${TECH2[E.tec].nm}. E com o corpo novo, a Runa do Rosto aguenta a luta: TROCAR DE FORMA virou técnica (ação leve, sem custo). Humano é rápido e conjura mais barato; baú aguenta mais. Dura 3 vezes.]`, 'cat');
  save2();
}

// ---------- a forja da Rita (bigorna das Galerias) ----------
{ const _ff = falaForja; falaForja = async function () {
  if (!G.flags.bigorna) return _ff();
  G.forja = G.forja || {};
  const op = [!G.forja.lanca ? 'Afiar a lança (+3 ATQ da Rita)' : null, !G.forja.escudo ? 'Reforçar o escudo (+2 DEF, +10 PV da Rita)' : null, 'Agora não'].filter(Boolean);
  if (op.length === 1) { await say('Lança afiada, escudo reforçado. A forja tá quente, mas eu tô sem ideia. Quando aparecer metal bom, eu faço mais.', 'rita'); return; }
  const c = await choose('A bigorna chegou! O que eu forjo?', op, 'rita');
  if (op[c] === 'Agora não' || c < 0) return;
  sfx('hit'); V.shake = 6; await say('* Tum. Tum. Tum. A Rita bate o ferro com uma alegria que dá medo.');
  if (op[c].startsWith('Afiar')) { G.forja.lanca = true; await say('Pronto. Agora ela corta até a conta de luz.', 'rita'); } else { G.forja.escudo = true; await say('Escudo novo. Quer dizer, o mesmo escudo, com mais escudo.', 'rita'); }
  save2();
}; }
