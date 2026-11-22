// ================= MONSTRO NA CIDADE CHAMA ATENÇÃO =================
// O baú andando e a Lume de lustre não passam despercebidos em Velhágua.
//  - MORADORES curiosos que estão de frente e perto veem a "mala" andar: levam susto ("!") e, se houver Caçador no
//    mapa, apontam: a SUSPEITA sobe (com uma pausa entre um dedo-duro e outro).
//  - DE NOITE, a Lume de lustre BRILHA: Caçadores enxergam o brilho de mais longe e, olhando, notam o lustre mesmo
//    com o grupo parado. Solução da Rita: um PANO DE MESA da taverna por cima (vira "abajur"). Coberta, a Lume não
//    chama atenção, mas também não ilumina quase nada. Dá para cobrir/descobrir pelo MENU.

const CURIOSOS = { dita: ['A MALA ANDOU!', 'Credo, a mala!'], joao: ['Ô! Essa caixa tem pé?!', 'Vi nada. Vi nada.'], zefa: ['Lurdes! A MALA!', 'Jesus, Maria e José!'], lurdes: ['Zefa, olha a mala!', 'Pois é... a mala andou.'], nico: ['Essa mudança anda sozinha?!'], pedrinho: ['MÃE! A MALA TEM DENTE!', 'Que maneiro!'], quincas: ['Bandeja!! ...ah, é a mala.'], bia: ['A mala de vocês tá com fome?'], cleide: ['Credo!'], toninho: ['Isso é efeito do vinho, né?'], marujo: ['Baú de navio não faz isso!'], bebum: ['Parei de beber. Parei.'], lia: ['Hm. Mala nervosa.'] };
const FALA_LUSTRE = ['Um lustre... VOANDO?!', 'Assombração!', 'Que lustre bonito... voando?!'];
function lustreNaRua() { return LUSTRE_ON() && !G.flags.lumeCoberta && !W2.float; }
function moradoresVeem() {
  if (!G.flags || !G.flags.c2Init) return;
  const m = W2.map, temCacador = W2.ents.some(e => e.t === 'hunter');
  for (const e of W2.ents) {
    const ls = CURIOSOS[e.id]; if (!ls || e.t !== 'npc') continue;
    if ((e.sustoAte || 0) > W2.t) continue;
    const d = Math.abs(e.x - W2.x) + Math.abs(e.y - W2.y);
    const vis0 = e.vis; e.vis = 3; const viu = d <= 4 && inCone(e, W2.x, W2.y); e.vis = vis0;
    if (!viu) continue;
    e.sustoAte = W2.t + 600; e.emote = { s: pickOne(ls), t: 90 }; sfx('cancel');
    if (temCacador && !['bebum', 'quincas', 'bia'].includes(e.id)) {
      W2.sus = Math.min(3, W2.sus + 1);
      W2.toast = { s: 'Um morador apontou para você!', t: 0 };
      if (!G.flags.tutMoradores) { G.flags.tutMoradores = true; run2(async () => { await say('* Os moradores também olham. Se um deles vir a mala andando, aponta, e os Caçadores ficam mais desconfiados.'); await say('Anda quando ninguém estiver de frente pra você, @. Gente de cidade olha pra frente. Pra cima, nunca.', 'rita'); }); }
      if (W2.sus >= 3) { W2.sus = 0; const h = W2.ents.find(q => q.t === 'hunter'); if (h) run2(() => cacadoresAtacam(h)); }
    }
  }
}
{ const _oms = onMoveStart; onMoveStart = function () { _oms(); if (W2.map && !W2.float) moradoresVeem(); }; }

// de noite: o brilho do lustre entrega o grupo
function brilhoEntrega() {
  if (!lustreNaRua() || !W2.map || !W2.map.hunters || worldBusy2()) return;
  const lu = W2.fol.find(f => f.k === 'lume'); if (!lu) return;
  for (const e of W2.ents) {
    if (e.t !== 'hunter' || !e.olhando) continue;
    const v0 = e.vis; e.vis = (e.vis0 ?? v0) + 2; const viu = inCone(e, lu.x, lu.y) || inCone(e, W2.x, W2.y); e.vis = v0;
    if (viu && (e.brilhoAte || 0) < W2.t) {
      e.brilhoAte = W2.t + 70; e.viu = 40; W2.sus = Math.min(3, W2.sus + 1); sfx('cancel'); e.emote = { s: 'Que luz é essa?', t: 70 };
      if (W2.sus >= 3) { W2.sus = 0; run2(() => cacadoresAtacam(e)); }
      return;
    }
  }
  for (const e of W2.ents) { const ls = CURIOSOS[e.id]; if (!ls || (e.sustoAte || 0) > W2.t) continue; if (Math.abs(e.x - lu.x) + Math.abs(e.y - lu.y) <= 4) { e.sustoAte = W2.t + 700; e.emote = { s: pickOne(FALA_LUSTRE), t: 90 }; } }
}
// primeira noite numa rua com Caçadores: a Rita cobre a Lume com um pano de mesa
async function panoNaLume() {
  G.flags.panoCena = true;
  await say('Um lustre aceso flutuando no meio da rua. Discreto como um incêndio.', 'rita');
  await say('Eu não consigo apagar! Eu tentei! Fica pior quando eu fico nervosa!', 'lume');
  await say('* A Rita tira da mochila um pano de mesa xadrez (com uma mancha de caldo da taverna) e joga por cima da Lume.');
  await say('Pronto. Agora você é um abajur. Um abajur que anda atrás da gente. Ninguém olha duas vezes pra abajur.', 'rita');
  await say('...Tá escuro aqui dentro. E tem cheiro de peixe.', 'lume');
  G.flags.lumeCoberta = true;
  await say('* (De noite, com o pano, a Lume não chama atenção, mas ilumina pouco. Sem o pano, ilumina tudo e os Caçadores veem o brilho de longe. Troque pelo MENU.)');
  save2();
}
{ const _pt = passaTempo; passaTempo = function () {
  _pt();
  if (V.scene !== 'world' || !G.flags || !G.flags.c2Init) return;
  if (LUSTRE_ON() && W2.map && W2.map.hunters && !G.flags.panoCena && !worldBusy2()) { run2(panoNaLume); return; }
  if (W2.t % 15 === 0) brilhoEntrega();
}; }
// o pano: sprite coberto e luz fraca
const PANO_C = new Map();
function lustreCoberto(fr) {
  if (PANO_C.has(fr)) return PANO_C.get(fr);
  const c = mk(26, 34), x = c.getContext('2d'); x.drawImage(fr, 1, 0);
  const P = new Pix(26, 30);
  P.poly([[13, 1], [24, 22], [25, 27], [1, 27], [2, 22]], (px, py) => (((px >> 2) + (py >> 2)) % 2 ? '#c83a3a' : '#f2ecdc'));
  for (let i = 1; i < 25; i += 3) P.rect(i, 27, 1, 2, '#c83a3a');
  P.p(15, 14, '#a8803a'); P.p(16, 15, '#a8803a');
  x.drawImage(P.outline().canvas(), 0, 0);
  x.fillStyle = 'rgba(255,200,100,0.5)'; x.fillRect(10, 29, 6, 2);
  PANO_C.set(fr, c); return c;
}
{ const _fs2 = folSprite; folSprite = function (f) { const fr = _fs2(f); if (f.k === 'lume' && LUSTRE_ON() && G.flags.lumeCoberta && fr) return lustreCoberto(fr); return fr; }; }
{ const _lz = luzesDoMapa; luzesDoMapa = function (m, ox, oy, a) { const L = _lz(m, ox, oy, a); if (LUSTRE_ON() && G.flags.lumeCoberta && L[0] && L[0][2] > 60) { L[0][2] = 26; L[0][3] = false; } return L; }; }
// MENU: cobrir ou descobrir a Lume (só de noite, depois da cena do pano)
{ const _mg = menuGrupo; menuGrupo = async function () {
  if (LUSTRE_ON() && G.flags.panoCena) {
    const c = await choose('* Menu', ['Abrir o menu', G.flags.lumeCoberta ? 'Tirar o pano da Lume (ilumina, chama atenção)' : 'Cobrir a Lume com o pano (discreto, escuro)'], 'n', 0);
    if (c === 1) { G.flags.lumeCoberta = !G.flags.lumeCoberta; sfx('equip'); await say(G.flags.lumeCoberta ? 'De volta pro abajur. Tá bom. Cheiro de peixe.' : 'Ahhh, ar! E luz! ...E todo mundo olhando. Tá bom, eu aguento.', 'lume'); return; }
  }
  return _mg();
}; }
