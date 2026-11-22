// ================= ECONOMIA: cobres, materiais, pedidos da Guilda, a Lume cantando e a carta do Tiago =================
// O grupo sai da masmorra sem um vintém. Os jeitos de ganhar dinheiro são os que a Rita e a Lume explicam na chegada:
//  1. MATERIAIS: todo bicho derrotado pode deixar um material; a Dona Graça compra no Bazar (Vender).
//  2. PEDIDOS DA GUILDA: quadro na Taverna do Remo Torto; a Rita aceita com a licença de escudeira.
//  3. A LUME CANTA: de noite, na fonte da praça, uma vez por noite (minijogo de ritmo).
//  4. O TIAGO (o ex-cobrador, Herói nº 30): deixou uma carta e uns cobres com a Dona Graça.
// Lutas também pagam cobres, como antes.

const MAT2 = {
  lodo: { nm: 'Lodo de Rua', preco: 6, d: 'Lodo grosso de Lambe-Lodo. O Bazar usa para vedar barco.' },
  telha: { nm: 'Telha Encantada', preco: 9, d: 'Telha de Caranguejo-Telha. Não quebra, só reclama.' },
  sininho: { nm: 'Sininho Engolido', preco: 12, d: 'O sininho que o Sapo-Sino tinha na papada. Ainda toca.' },
  apito: { nm: 'Apito da Guilda', preco: 10, d: 'Apito de Caçador. Alguém deve estar procurando.' },
  pena: { nm: 'Pena de Cartaz', preco: 5, d: 'Papel de cartaz de procurado, dobrado em pena.' },
  bronze: { nm: 'Lasca de Bronze Antigo', preco: 45, d: 'Um pedaço da Dona Badalada. Vale muito. Dá um pouco de dó.' },
  carimbo: { nm: 'Tinta de Carimbo', preco: 20, d: 'Do Sargento Brás. Mancha tudo de "PROCURADO".' }
};
const DROP2 = { lambe: ['lodo', 0.65], caranguejo: ['telha', 0.6], sapo: ['sininho', 0.55], cacador: ['apito', 0.5], corvo: ['pena', 0.6], ancora: ['bronze', 1], bras: ['carimbo', 1] };

// ---------- pedidos da Guilda ----------
const PEDIDOS = [
  { id: 'lodo', nm: 'Lodo no porão', quem: 'Dona Neusa', d: 'O porão da taverna inundou e tem Lambe-Lodo bebendo o vinho. Derrotar 4 Lambe-Lodo.', kind: 'lambe', n: 4, paga: 40 },
  { id: 'telha', nm: 'Telhas fujonas', quem: 'Seu Nico', d: 'Os telhados do bairro velho criaram pernas. Derrotar 3 Caranguejo-Telha.', kind: 'caranguejo', n: 3, paga: 50 },
  { id: 'sino', nm: 'Silêncio, por favor', quem: 'Irmã Celeste', d: 'Sapos-Sino desafinando a missa. Derrotar 2 Sapo-Sino.', kind: 'sapo', n: 2, paga: 45 },
  { id: 'apito', nm: 'Apitos perdidos (?)', quem: 'Sargento Brás', d: 'Recompensa por apitos da Guilda perdidos em serviço. Entregar 2 Apitos da Guilda. Sem perguntas.', mat: 'apito', n: 2, paga: 35 }
];
function pedEstado(p) { const s = (G.ped = G.ped || {})[p.id]; if (!s) return 'novo'; if (s.pago) return 'feito'; const k = p.mat ? ((G.mat || {})[p.mat] || 0) : s.k; return k >= p.n ? 'pronto' : 'ativo'; }
function pedProgresso(p) { const s = (G.ped || {})[p.id] || {}; return p.mat ? Math.min(p.n, (G.mat || {})[p.mat] || 0) : Math.min(p.n, s.k || 0); }

async function quadroPedidos() {
  if (!G.flags.quadroTut) {
    G.flags.quadroTut = true;
    await say('* Um quadro de cortiça com o brasão da Guilda dos Caçadores: dois machados cruzados sobre um baú. Você finge não ver o baú.');
    await say('Eu assino, eles pagam. Escudeira com licença não precisa explicar a bagagem.', 'rita');
  }
  while (true) {
    const items = PEDIDOS.map(p => { const e = pedEstado(p); return { label: p.nm, right: e === 'novo' ? p.paga + 'c' : e === 'feito' ? 'feito' : e === 'pronto' ? 'PRONTO' : pedProgresso(p) + '/' + p.n, col: e === 'pronto' ? '#9be58a' : e === 'feito' ? '#6a7078' : undefined, d: `${p.d} Quem pede: ${p.quem}. Paga ${p.paga} cobres.` }; });
    const i = await list({ x: 20, y: 24, w: 200, title: 'Quadro de Pedidos da Guilda', items, desc: n => items[n] && items[n].d, descY: 150 });
    if (i < 0) return;
    const p = PEDIDOS[i], e = pedEstado(p);
    if (e === 'novo') { G.ped[p.id] = { k: 0 }; sfx('select'); await say(`* A Rita arranca o papel do quadro e assina: "Rita, escudeira". Pedido aceito: ${p.nm}.`); }
    else if (e === 'ativo') await say(`* Ainda falta: ${pedProgresso(p)}/${p.n}.`);
    else if (e === 'pronto') {
      if (p.mat) G.mat[p.mat] -= p.n;
      G.ped[p.id].pago = true; G.cobres = (G.cobres || 0) + p.paga; sfx('item');
      await say(`* A Rita mostra o papel ao balcão. Dona Neusa paga em nome da Guilda: +${p.paga} cobres.`);
      if (p.id === 'apito') await say('Apitos da Guilda... Engraçado, o Sargento Brás perdeu dois essa semana. Tropeçou neles, eu acho.', 'neusa');
      save2();
    } else await say('* Esse já foi.');
  }
}
const quadroC = memo(() => { const P = new Pix(26, 22), C = ramp('#a87a4a'), Wd = ramp('#5a3a24');
  for (let y = 0; y < 22; y++) for (let x = 0; x < 26; x++) P.p(x, y, (x < 2 || x > 23 || y < 2 || y > 19) ? P.tone(Wd, 0.5 - y / 60, x, y) : P.tone(C, 0.55 + ((hash(x, y, 4) % 5) - 2) * 0.04, x, y));
  for (const [x, y, w, h, c] of [[4, 4, 7, 8, '#f2ecdc'], [13, 3, 8, 6, '#e8dcc0'], [14, 11, 8, 7, '#f2ecdc'], [4, 13, 7, 5, '#e8c8a0']]) { P.rect(x, y, w, h, c); P.rect(x + 1, y + 2, w - 2, 1, '#8a7a6a'); P.rect(x + 1, y + 4, w - 3, 1, '#8a7a6a'); P.p(x + Math.floor(w / 2), y, '#c83a3a'); }
  return P.outline().canvas(); });

// ---------- a Lume canta na fonte (de noite) ----------
function noiteId() { return hora() >= 19 * 60 ? (G.dia || 0) : (G.dia || 0) - 1; }
async function fonteDaPraca() {
  if (!ehNoite()) { await say('* A fonte da praça. Uma moeda velha brilha no fundo, grudada no limo. De noite, dizem, junta gente aqui para ouvir música.'); return; }
  if (G.flags.cantouNa === noiteId()) { await say('Já cantei hoje. Lustre também fica rouco. ...Amanhã de noite tem mais.', 'lume'); return; }
  const c = await choose('* Tem gente voltando da taverna e um chapéu esquecido no banco. A Lume te olha.', ['Cantar na fonte', 'Agora não'], 'n', 1);
  if (c !== 0) return;
  await say(LUSTRE_ON() ? 'Um lustre que canta. Se isso não der dinheiro, nada dá.' : 'Sem violão... mas tem a sua tampa. Faz o ritmo, @.', 'lume');
  const r = await ritmoLume();
  const ganho = 4 + r.perf * 7 + r.bom * 3;
  G.flags.cantouNa = noiteId(); G.cobres = (G.cobres || 0) + ganho; sfx('item');
  const pub = r.perf >= 4 ? 'A praça inteira aplaude. Até um Caçador bate palma, envergonhado.' : r.perf + r.bom >= 4 ? 'Um casal dança perto da fonte. Um velho chora de leve.' : 'Duas pessoas param. Uma delas é o gato.';
  await say(`* ${pub} No chapéu: ${ganho} cobres.`);
  if (r.perf >= 4 && !G.flags.fonteFa) { G.flags.fonteFa = true; await say('* Alguém deixa no chapéu um Frasco de Âmbar embrulhado num lenço, junto com um bilhete: "Pela canção."'); G.items.frasco = (G.items.frasco || 0) + 1; }
  save2();
}
// minijogo: 6 notas; o anel fecha sobre a nota e o jogador aperta A no tempo (o baú bate o ritmo com a tampa)
function ritmoLume() {
  return new Promise(res => {
    const notas = [0, 34, 60, 94, 120, 150].map((t, i) => ({ t: t + 40, r: null, y: i % 2 }));
    const w = { type: 'ritmo', k: 0,
      update() {
        this.k++;
        const k = this.k, alvo = notas.find(n => !n.r && Math.abs(k - n.t) <= 12);
        if (btnp('a')) { if (alvo) { const d = Math.abs(k - alvo.t); alvo.r = d <= 3 ? 'perf' : d <= 8 ? 'bom' : 'erro'; sfx(alvo.r === 'perf' ? 'blipTri' : 'blip', alvo.r === 'perf' ? 1200 : 700); } else sfx('cancel'); }
        for (const n of notas) if (!n.r && k - n.t > 12) n.r = 'erro';
        if (k > notas[notas.length - 1].t + 40) { closeWin(this); res({ perf: notas.filter(n => n.r === 'perf').length, bom: notas.filter(n => n.r === 'bom').length }); }
      },
      draw() {
        box(20, 50, 200, 110, { edge: '#ffd060' });
        txt('A Lume canta', 120, 56, { align: 'center', col: '#ffd060' });
        txt('A quando o anel fechar', 120, 144, { align: 'center', col: '#9aa8b4' });
        for (const n of notas) {
          const dt = n.t - this.k, x = 120 + (n.y ? 22 : -22), y = 100;
          if (dt > 40 || (n.r && this.k - n.t > 14)) continue;
          if (!n.r) { const r = Math.max(6, 6 + dt * 0.9); fxRing(x, y, r, '#ffd060', Math.min(1, 1 - dt / 40 + 0.2)); fxRing(x, y, 6, '#ffffff', 0.8); txt('♪', x, y - 6, { align: 'center', col: '#fff0c0' }); }
          else { const c = n.r === 'perf' ? '#9be58a' : n.r === 'bom' ? '#8fe3ff' : '#ff6b6b'; txt(n.r === 'perf' ? 'LINDO!' : n.r === 'bom' ? 'bom' : 'ops', x, y - 18 - (this.k - n.t) * 0.5, { align: 'center', col: c }); }
        }
      } };
    openWin(w);
  });
}

// ---------- a carta do Tiago (no Bazar) e as figurinhas do Herói nº 30 ----------
async function cartaTiago() {
  if (G.flags.tiagoCarta) return;
  G.flags.tiagoCarta = true;
  await say('Ah! Vocês são os amigos do Herói nº 30! O baú e a moça que brilha, igualzinho ele descreveu. Chegou carta da capital, com selo da Coroa e tudo.', 'graca');
  await say('* "Pessoal. Me chamaram pra capital junto com os outros heróis que voltaram. Tão me tratando como estátua de praça: me limpam, me penduram medalha e ninguém me deixa sentar."');
  await say('* "Deixei uns cobres com a Dona Graça, a única pessoa honesta do cais. Avaliação: vocês vão gastar tudo em frasco. Façam isso. Frasco salva."');
  await say('* "Cuidado com quem é gentil demais aqui em cima. Lá embaixo, pelo menos, os monstros avisavam. Ass.: Tiago, ex-cobrador. P.S.: guardem o troco. Eu sempre guardo o troco."');
  G.cobres = (G.cobres || 0) + 60; sfx('item');
  await say('* +60 cobres, embrulhados num bilhete de passagem do 31. Carimbado. Pago.');
  await say('Ele guardou o bilhete esse tempo todo.', 'lume');
  save2();
}
async function figurinhaTiago() {
  await say('* Um cartaz colorido, colado por cima de um cartaz de PROCURADO: "HERÓI Nº 30 — O COBRADOR QUE VOLTOU! Colecione a figurinha!" O desenho do Tiago tem o queixo três vezes maior que o de verdade.');
  if (!G.flags.figTiago) { G.flags.figTiago = true; await say('Ficou com cara de herói mesmo. Do tipo que nunca perdeu o troco.', 'rita'); }
}

// ---------- ligações ----------
{ const _lj = loja; loja = async function (estoque, dono) {
  if (W2.id === 'bazar') await cartaTiago();
  while (true) {
    const c = await choose('* O que vai ser?', ['Comprar', 'Vender materiais', 'Sair'], 'n', 2);
    if (c === 2) return;
    if (c === 0) await _lj(estoque, dono);
    if (c === 1) await vender();
  }
}; }
async function vender() {
  while (true) {
    const ks = Object.keys(MAT2).filter(k => (G.mat || {})[k] > 0);
    if (!ks.length) { await say('Nada pra vender? Bicho daqui deixa lodo, telha, sininho... Traz que eu compro.', 'graca'); return; }
    const tot = ks.reduce((a, k) => a + MAT2[k].preco * G.mat[k], 0);
    const items = [...ks.map(k => ({ label: MAT2[k].nm + ' x' + G.mat[k], right: MAT2[k].preco + 'c', d: MAT2[k].d })), { label: 'Vender tudo', right: tot + 'c', d: 'Tudo de uma vez. (Os apitos você talvez queira guardar para um pedido da Guilda.)' }];
    const i = await list({ x: 20, y: 24, w: 200, title: `Vender   ${G.cobres || 0} cobres`, items, desc: n => items[n] && items[n].d, descY: 150 });
    if (i < 0) return;
    if (i === ks.length) { G.cobres += tot; for (const k of ks) G.mat[k] = 0; sfx('item'); await say(`* A Dona Graça pesa tudo numa balança torta. +${tot} cobres.`); save2(); return; }
    const k = ks[i]; G.mat[k]--; G.cobres += MAT2[k].preco; sfx('item');
  }
}
// cada vitória: materiais e progresso dos pedidos
{ const _lm2 = lutaMapa; lutaMapa = async function (g, o) {
  const r = await _lm2(g, o);
  if (r === 'win') {
    G.mat = G.mat || {}; const got = {};
    for (const id of g) { const dr = DROP2[id]; if (dr && Math.random() < dr[1]) { G.mat[dr[0]] = (G.mat[dr[0]] || 0) + 1; got[dr[0]] = (got[dr[0]] || 0) + 1; } }
    for (const p of PEDIDOS) { const s = (G.ped || {})[p.id]; if (s && !s.pago && p.kind) s.k = (s.k || 0) + g.filter(id => id === p.kind).length; }
    const ls = Object.entries(got).map(([k, n]) => MAT2[k].nm + (n > 1 ? ' x' + n : ''));
    if (ls.length) await say('* O baú guarda: ' + ls.join(', ') + '.');
    const prontos = PEDIDOS.filter(p => pedEstado(p) === 'pronto' && !((G.flags.avisoPed || {})[p.id]));
    for (const p of prontos) { (G.flags.avisoPed = G.flags.avisoPed || {})[p.id] = true; await say(`* Pedido pronto: ${p.nm}. Volte ao quadro da taverna para receber.`); }
  }
  return r;
}; }
// o quadro na taverna, a fonte e a figurinha na praça
{ const _mm2 = montarMapas2; montarMapas2 = function () {
  _mm2();
  MAPS2.taverna.props.push({ img: quadroC, x: 9.4, y: 3.1, by: 1 });
  MAPS2.taverna.ents.push({ t: 'sign', x: 10, y: 3, h: 30, talk: quadroPedidos });
  MAPS2.praca.ents.push({ t: 'sign', x: 7, y: 16, h: 30, talk: fonteDaPraca }, { t: 'sign', x: 15, y: 8, h: 40, talk: figurinhaTiago });
}; }
// itens: o menu mostra os materiais guardados
{ const _uf = usarItemFora; usarItemFora = async function () {
  const ks = Object.keys(MAT2).filter(k => (G.mat || {})[k] > 0);
  if (ks.length) { const c = await choose('* Mochila', ['Itens de cura', 'Materiais'], 'n', 0); if (c === 1) { await panel(ks.map(k => `${MAT2[k].nm} x${G.mat[k]}   ${MAT2[k].preco}c cada`), { title: 'Materiais (vender no Bazar)' }); return; } }
  return _uf();
}; }
// Jorge também comenta o dinheiro
{ const _fj = falaJorge; falaJorge = async function () {
  if (!G.flags.jorgeGrana && (G.cobres || 0) < 40) { G.flags.jorgeGrana = true; await say('Sem dinheiro? O quadro da taverna, a lojinha da Graça, e a moça cantando na fonte de noite. Foi assim que eu paguei a primeira prestação do 31.', 'jorge'); return; }
  return _fj();
}; }
