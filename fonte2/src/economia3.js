// ================= ECONOMIA DE VERDADE (pedido do usuário: o cobre tem que ser essencial) =================
// Antes dava para zerar sem gastar nada. Agora:
//  - INIMIGOS MAIS FORTES a partir do Cap. 3 (vida e ataque sobem por capítulo: ESC3). Sem equipamento e sem item, aperta.
//  - EQUIPAMENTO POR FAIXA: T1 no Bazar (Velhágua), T2 com o Mascate (Cap. 4+), T3 com o Mascate (Cap. 7+), T4 só na FORJA.
//  - O BAÚ não veste nada: fica mais forte na FORJA da Rita (Tampa, Dentes e Forro, três graus cada), com MATERIAIS.
//  - MATERIAIS: todo bicho comum deixa algo; todo chefe deixa um material RARO (a forja usa; não entra no "vender tudo").
//  - ITENS DE LUTA novos: Frasco Grande, Tinta Forte, Pastel de Feira, Café Coado, Bomba de Fuligem, Sal Grosso.
//  - LOJAS: Bazar (Dona Graça), balcão da Papelaria (tinta e SELOS de fusão), SEU QUIRINO, O MASCATE (no Largo do Hospital
//    a partir do Cap. 4, e seguindo o grupo: Candeia, Acampamento da Mina, Vila dos Pavios, Sopé do Morro, Torre do Farol).
//  - TINTA DE SUPERFÍCIE também cai dos bichos de fuligem e se MISTURA na forja (2 Fuligem Grossa + 1 Pavio Queimado = 3).
//  - SELOS e tinta extras escondidos nos baús opcionais de todos os capítulos.
function capAtual() { let n = 2; for (let i = 3; i <= 10; i++) if (G.flags && G.flags['c' + i + 'Init']) n = i; return n; }

// ---------- dificuldade por capítulo ----------
const CAP_INIMIGO = {
  3: ['mariposa', 'bandido', 'rainha', 'cinza', 'rato', 'mae'], 4: ['pesadelo', 'lencol', 'relogio', 'nevoa', 'mineiro', 'capataz'],
  5: ['vigia', 'mvidro', 'guardaR', 'vitral', 'holofote'], 6: ['seloVivo', 'frascoR', 'cacaRec', 'tiago', 'seladora'],
  7: ['caoLanterna', 'valvulaViva', 'ratoVelaA', 'cogumeloA', 'morcegoSelo', 'broca', 'musgoA', 'extrator'],
  8: ['friagem', 'apagador', 'loboFuligem', 'geadaViva', 'capitao', 'friagemB'], 9: ['sentinela', 'gralha', 'mariposaA', 'espantalhoC', 'rainhaF', 'faroleiro'],
  10: ['ecoL', 'contrapeso', 'vesperB', 'coracaoF']
};
const ESC3 = { 3: 0.14, 4: 0.34, 5: 0.37, 6: 0.39, 7: 0.43, 8: 0.48, 9: 0.58, 10: 0.62 };
for (const [c, ids] of Object.entries(CAP_INIMIGO)) for (const id of ids) { const E = ENEMY2[id]; if (!E || E._esc3) continue; E._esc3 = true; const x = ESC3[c]; E.mhp = Math.round(E.mhp * (1 + 0.7 * x)); E.atk = Math.round(E.atk * (1 + x)); if (E.cobres) E.cobres = Math.round(E.cobres * (1 + x)); }

// ---------- materiais ----------
Object.assign(MAT2, {
  poLampiao: { nm: 'Pó de Lampião', preco: 8, d: 'Pó dourado de asa de mariposa. Brilha no escuro do bolso.' },
  lenco: { nm: 'Lenço de Bandoleiro', preco: 10, d: 'Vermelho, com nó. Cheira a estrada.' },
  fuligemM: { nm: 'Fuligem Grossa', preco: 9, d: 'Fuligem de chaminé, pesada. Base da tinta de superfície.' },
  pavioM: { nm: 'Pavio Queimado', preco: 8, d: 'Pavio de rato de vela. Ainda morno. Entra na tinta.' },
  linho: { nm: 'Fiapo de Pesadelo', preco: 12, d: 'Linho de lençol mal dormido. Forte como sono ruim.' },
  orvalhoN: { nm: 'Orvalho de Névoa', preco: 12, d: 'Névoa engarrafada. Esfria a forja.' },
  minerio: { nm: 'Minério Oco', preco: 16, d: 'Pedra de mina sem âmbar. Leve e dura.' },
  cacoVidro: { nm: 'Caco de Vidro Real', preco: 14, d: 'Vidro da Coroa, grosso, com a marca do lírio.' },
  botaoReal: { nm: 'Botão de Farda', preco: 18, d: 'Botão de latão da Guarda Real. Mais latão que botão.' },
  cera: { nm: 'Cera de Selo', preco: 18, d: 'Cera preta de lacre. Gruda e protege.' },
  cacoFrasco: { nm: 'Caco de Frasco', preco: 14, d: 'Vidro de frasco de âmbar rachado. Ainda doce.' },
  pavioVivo: { nm: 'Pavio Vivo', preco: 20, d: 'Pavio de cão-lanterna. Acende sozinho se você conversa com ele.' },
  latao: { nm: 'Placa de Latão', preco: 20, d: 'Chapa de máquina, rebitada. Ótima para tampa.' },
  ambarLasca: { nm: 'Lasca de Âmbar', preco: 24, d: 'Âmbar de verdade, bruto e pequeno. Ilegal aqui em cima.' },
  geloEterno: { nm: 'Gelo que Não Derrete', preco: 22, d: 'Um caco de Friagem. Fica frio no fogo.' },
  abafador: { nm: 'Abafador de Pavio', preco: 24, d: 'O sino de apagar vela dos Apagadores. Pesado.' },
  penaGralha: { nm: 'Pena de Gralha', preco: 22, d: 'Preta e azul. Corta o vento do Morro.' },
  ecoCristal: { nm: 'Cristal de Eco', preco: 30, d: 'Uma lembrança que virou pedra. Faz barulho de conversa.' },
  // raros (chefes): a forja usa
  asaRainha: { nm: 'Pó de Asa-Rainha', preco: 40, raro: true, d: 'RARO. Da Mariposa-Rainha.' },
  coracaoFuligem: { nm: 'Coração de Fuligem', preco: 60, raro: true, d: 'RARO. Da Mãe-Fuligem. Ainda pulsa preto.' },
  engrenagemV: { nm: 'Engrenagem de Plantão', preco: 50, raro: true, d: 'RARO. Do Relógio de Plantão. Nunca dorme.' },
  picareta: { nm: 'Cabo de Picareta', preco: 70, raro: true, d: 'RARO. Do Capataz de Candeia.' },
  vitralM: { nm: 'Caco de Vitral Vivo', preco: 60, raro: true, d: 'RARO. Muda de cor quando você mente.' },
  lenteG: { nm: 'Lente do Holofote', preco: 90, raro: true, d: 'RARO. Concentra qualquer luz.' },
  sinete: { nm: 'Sinete Real', preco: 90, raro: true, d: 'RARO. Da Seladora Real.' },
  ambarBruto: { nm: 'Âmbar Bruto Vivo', preco: 80, raro: true, d: 'RARO. Da Broca. Pulsa.' },
  sementeMusgo: { nm: 'Semente de Musgo-Âmbar', preco: 80, raro: true, d: 'RARO. Do Guarda-Musgo.' },
  nucleoExtrator: { nm: 'Núcleo do Extrator', preco: 120, raro: true, d: 'RARO. O coração da máquina.' },
  insignia: { nm: 'Insígnia de Capitão', preco: 90, raro: true, d: 'RARO. Do Capitão Apagador.' },
  coracaoGelo: { nm: 'Coração da Friagem', preco: 140, raro: true, d: 'RARO. Inverno inteiro num punho.' },
  palhaEnc: { nm: 'Palha Encantada', preco: 100, raro: true, d: 'RARO. Do Espantalho do Cerco. Não pega fogo.' },
  escamaFarol: { nm: 'Escama da Rainha', preco: 110, raro: true, d: 'RARO. Da Rainha do Farol.' },
  lenteFarol: { nm: 'Lente do Faroleiro', preco: 150, raro: true, d: 'RARO. Do Faroleiro. Enxerga longe demais.' },
  pesoBronze: { nm: 'Peso de Bronze', preco: 120, raro: true, d: 'RARO. Do Contrapeso. Tem o seu nome gravado. Não pergunte.' }
});
Object.assign(DROP2, {
  mariposa: ['poLampiao', 0.6], bandido: ['lenco', 0.6], cinza: ['fuligemM', 0.65], rato: ['pavioM', 0.65], rainha: ['asaRainha', 1], mae: ['coracaoFuligem', 1],
  pesadelo: ['linho', 0.6], lencol: ['linho', 0.6], relogio: ['engrenagemV', 1], nevoa: ['orvalhoN', 0.6], mineiro: ['minerio', 0.65], capataz: ['picareta', 1],
  vigia: ['cacoVidro', 0.6], mvidro: ['cacoVidro', 0.55], guardaR: ['botaoReal', 0.6], vitral: ['vitralM', 1], holofote: ['lenteG', 1],
  seloVivo: ['cera', 0.6], frascoR: ['cacoFrasco', 0.6], cacaRec: ['apito', 0.6], seladora: ['sinete', 1],
  caoLanterna: ['pavioVivo', 0.6], valvulaViva: ['latao', 0.6], ratoVelaA: ['ambarLasca', 0.5], cogumeloA: ['ambarLasca', 0.5], morcegoSelo: ['cera', 0.6],
  broca: ['ambarBruto', 1], musgoA: ['sementeMusgo', 1], extrator: ['nucleoExtrator', 1],
  friagem: ['geloEterno', 0.6], geadaViva: ['geloEterno', 0.6], apagador: ['abafador', 0.6], loboFuligem: ['fuligemM', 0.7], capitao: ['insignia', 1], friagemB: ['coracaoGelo', 1],
  sentinela: ['latao', 0.6], gralha: ['penaGralha', 0.6], mariposaA: ['ambarLasca', 0.55], espantalhoC: ['palhaEnc', 1], rainhaF: ['escamaFarol', 1], faroleiro: ['lenteFarol', 1],
  ecoL: ['ecoCristal', 0.6], contrapeso: ['pesoBronze', 1]
});
const TINTA_DROP = { cinza: 0.3, rato: 0.3, loboFuligem: 0.35, mae: 1, mariposa: 0.12 };
{ const _lmT = lutaMapa; lutaMapa = async function (g, o) {
  const r = await _lmT(g, o);
  if (r === 'win') { let n = 0; for (const id of g) if (TINTA_DROP[id] && Math.random() < TINTA_DROP[id]) n++; if (n) { G.items.tintaS = (G.items.tintaS || 0) + n; await say(`* E um pouco de fuligem boa: +${n} Tinta de Superfície.`); } }
  return r;
}; }
// vender: os raros não entram no "vender tudo"
vender = async function () {
  while (true) {
    const ks = Object.keys(MAT2).filter(k => (G.mat || {})[k] > 0);
    if (!ks.length) { await say('* Nada para vender. Bicho derrotado às vezes deixa material.'); return; }
    const comuns = ks.filter(k => !MAT2[k].raro), tot = comuns.reduce((a, k) => a + MAT2[k].preco * G.mat[k], 0);
    const items = [...ks.map(k => ({ label: MAT2[k].nm + ' x' + G.mat[k], right: MAT2[k].preco + 'c', col: MAT2[k].raro ? '#ffd060' : undefined, d: MAT2[k].d + (usadoNaForja(k) ? ' (A FORJA usa isso.)' : '') })), { label: 'Vender os comuns', right: tot + 'c', d: 'Tudo de uma vez, menos os RAROS. Cuidado: a forja da Rita usa vários desses.' }];
    const i = await list({ x: 20, y: 24, w: 200, title: `Vender   ${G.cobres || 0} cobres`, items, desc: n => items[n] && items[n].d, descY: 150 });
    if (i < 0) return;
    if (i === ks.length) { G.cobres += tot; for (const k of comuns) G.mat[k] = 0; sfx('item'); await say(`* +${tot} cobres.`); save2(); return; }
    const k = ks[i]; G.mat[k]--; G.cobres += MAT2[k].preco; sfx('item');
  }
};

// ---------- itens ----------
Object.assign(ITEM2, {
  maca: { nm: 'Maçã do Amor', preco: 15, luta: true, d: 'Do festival. Cura 35% da vida de um aliado e tira os maus estados. Gruda nos dentes.' },
  frascoG: { nm: 'Frasco Grande', preco: 70, luta: true, d: 'Âmbar de farmácia, dose dupla. Cura 80% da vida de um aliado e tira queimadura e frio.' },
  tintaF: { nm: 'Tinta Azul Forte', preco: 55, luta: true, d: 'Devolve 40 PM.' },
  pastel: { nm: 'Pastel de Feira', preco: 35, luta: true, d: 'Pastel de queijo dividido em três. Cura 20% da vida do grupo todo.' },
  cafe: { nm: 'Café Coado Forte', preco: 30, luta: true, d: 'Na luta: +25 de Tensão. Ninguém dorme no ponto.' },
  bomba: { nm: 'Bomba de Fuligem', preco: 40, luta: true, d: 'Na luta: fumaça em todos os inimigos (dano mágico pequeno) e quase todos ficam TONTOS.' },
  salG: { nm: 'Sal Grosso', preco: 35, luta: true, d: 'Na luta: jogado num inimigo, quebra 3 de escudo.' }
});
const BITEM = {
  frasco: { alvo: 'vivo', run: t => { healUnit(t, Math.round(t.mhp * 0.45)); t.st.queimado = 0; t.st.frio = 0; } },
  maca: { alvo: 'vivo', run: t => { healUnit(t, Math.round(t.mhp * 0.35)); for (const q of ['queimado', 'frio', 'tonto', 'esquecido', 'molhado']) t.st[q] = 0; } },
  frascoG: { alvo: 'vivo', run: t => { healUnit(t, Math.round(t.mhp * 0.8)); t.st.queimado = 0; t.st.frio = 0; } },
  tinta: { alvo: 'vivo', run: t => { t.mp = Math.min(t.mmp, t.mp + 15); const [x, y] = unitCenter(t); popNum(x, y - 10, '+15 PM', '#8fe3ff'); } },
  tintaF: { alvo: 'vivo', run: t => { t.mp = Math.min(t.mmp, t.mp + 40); const [x, y] = unitCenter(t); popNum(x, y - 10, '+40 PM', '#8fe3ff'); } },
  pluma: { alvo: 'morto', run: t => { t.hp = Math.round(t.mhp * 0.3); t.ct = 50; const [x, y] = unitCenter(t); popNum(x, y - 10, 'DE PÉ!', '#9be58a'); burst(x, y, 24, ['#ffd060', '#ffffff']); } },
  pastel: { alvo: 'grupo', run: () => { for (const u of alive(BT.party)) healUnit(u, Math.round(u.mhp * 0.2)); } },
  cafe: { alvo: 'nada', run: () => { BT.tension = Math.min(100, BT.tension + 25); callout('+25 TENSÃO', '#ffd060', 40); } },
  bomba: { alvo: 'inimigos', run: (t, m) => { for (const f of alive(BT.foes)) { const [x, y] = unitCenter(f); burst(x, y, 14, ['#3a3048', '#6a5a7a', '#a898b8']); hitFoe(m, f, 0.55, { mag: true, ranged: true }); if (f.hp > 0 && Math.random() < 0.75) { f.ct = Math.max(0, f.ct - 40); popNum(x, y - 30, 'TONTO', '#d0a8ff'); } } } },
  salG: { alvo: 'inimigo', run: (t, m) => { const [x, y] = unitCenter(t); burst(x, y, 16, ['#ffffff', '#d8dce8']); hitFoe(m, t, 0.2, { brk: 3, ranged: true }); } }
};
const ORD_ITEM = ['frasco', 'frascoG', 'maca', 'tinta', 'tintaF', 'pluma', 'pastel', 'cafe', 'bomba', 'salG'];
{ const _dcI = doCommand; doCommand = async function (m, k) {
  if (k !== 'item') return _dcI(m, k);
  const its = ORD_ITEM.filter(q => ['frasco', 'tinta', 'pluma'].includes(q) || (G.items[q] || 0) > 0).map(q => ({ k: q, label: ITEM2[q].nm, right: 'x' + (G.items[q] || 0), disabled: !G.items[q], d: ITEM2[q].d }));
  const i = await subList('Itens', its); if (i < 0) return false;
  const it = its[i], B_ = BITEM[it.k]; if (!B_ || !(G.items[it.k] > 0)) { sfx('cancel'); return false; }
  let t = null;
  if (B_.alvo === 'vivo' || B_.alvo === 'morto') { t = await pickTarget('p', { dead: B_.alvo === 'morto', pref: m }); if (!t) return false; if (B_.alvo === 'morto' ? t.hp > 0 : t.hp <= 0) { sfx('cancel'); return false; } }
  if (B_.alvo === 'inimigo') { t = await pickTarget('e', { pref: BT.lastTarget }); if (!t) return false; }
  G.items[it.k]--;
  await act(m, async () => {
    sfx('item'); const [x, y] = t && t !== 'all' ? unitCenter(t) : unitCenter(m);
    await tw(18, p => { fxRing(x, y, 4 + p * 18, '#ffd060', 1 - p); });
    B_.run(t, m);
  });
  endTurn(m, 'leve'); return true;
}; }
// usar fora da luta
usarItemFora = async function () {
  const mats = Object.keys(MAT2).filter(k => (G.mat || {})[k] > 0);
  const c = await choose('* Mochila', ['Itens', 'Materiais', 'Voltar'], 'n', 2);
  if (c === 2 || c < 0) return;
  if (c === 1) { if (!mats.length) { await say('* Nenhum material. Bicho derrotado às vezes deixa.'); return; } await list({ x: 20, y: 20, w: 200, maxVis: 12, title: 'Materiais', items: mats.map(k => ({ label: MAT2[k].nm, right: 'x' + G.mat[k], col: MAT2[k].raro ? '#ffd060' : undefined })), desc: j => MAT2[mats[j]].d + (usadoNaForja(mats[j]) ? ' (A forja usa.)' : ''), descY: 184 }); return; }
  const ks = Object.keys(ITEM2).filter(k => (G.items[k] || 0) > 0);
  if (!ks.length) { await say('* A mochila só tem migalha de pastel.'); return; }
  const i = await list({ x: 50, y: 30, w: 160, title: 'Itens', items: ks.map(k => ({ label: ITEM2[k].nm, right: 'x' + G.items[k], col: ['cafe', 'bomba', 'salG', 'tintaS'].includes(k) ? '#8a8099' : undefined })), desc: j => ITEM2[ks[j]] && ITEM2[ks[j]].d, descY: 150 });
  if (i < 0) return;
  const k = ks[i];
  if (['cafe', 'bomba', 'salG'].includes(k)) { await say('* Isso é para a hora da luta.'); return; }
  if (k === 'tintaS') { await say('* Tinta de escrever. Serve no Grimório (MENU > Grimório): cada círculo traçado gasta um pouco.'); return; }
  const g = grupoAtual();
  if (k === 'pastel') { G.pt = G.pt || {}; for (const m of g) { const s = G.pt[m.id] || { hp: m.hp, mp: m.mp }; s.hp = Math.min(m.mhp, s.hp + Math.round(m.mhp * 0.2)); G.pt[m.id] = s; } G.items.pastel--; sfx('heal'); await say('* Pastel dividido em três. Todo mundo recupera um pouco.'); return; }
  const j = await list({ x: 60, y: 60, w: 150, title: 'Em quem?', items: g.map(m => ({ label: m.name, right: m.hp + '/' + m.mhp })) });
  if (j < 0) return;
  const m = g[j]; G.pt = G.pt || {}; const s = G.pt[m.id] || { hp: m.hp, mp: m.mp };
  if (k === 'frasco') s.hp = Math.min(m.mhp, s.hp + Math.round(m.mhp * 0.45));
  if (k === 'maca') s.hp = Math.min(m.mhp, s.hp + Math.round(m.mhp * 0.35));
  if (k === 'frascoG') s.hp = Math.min(m.mhp, s.hp + Math.round(m.mhp * 0.8));
  if (k === 'tinta') s.mp = Math.min(m.mmp, s.mp + 15);
  if (k === 'tintaF') s.mp = Math.min(m.mmp, s.mp + 40);
  if (k === 'pluma') s.hp = Math.max(s.hp, Math.round(m.mhp * 0.3));
  G.pt[m.id] = s; G.items[k]--; sfx('heal');
  await say(`* ${m.name}: ${s.hp}/${m.mhp} de vida, ${s.mp} PM.`);
};

// ---------- equipamento por faixa ----------
Object.assign(EQ2, {
  coleteLona: { nm: 'Colete de Lona', slot: 'roupa', who: ['lume'], mod: { def: 3, mdef: 2, mhp: 10 }, fx: [], preco: 100, tier: 1, d: 'Lona de vela de barco, costurada pela Dona Graça. +3 DEF, +2 RESIST, +10 PV.' },
  lancaSerra: { nm: 'Lança de Aço da Serra', slot: 'arma', who: ['rita'], mod: { atk: 8 }, fx: [], preco: 260, tier: 2, d: 'Aço de Candeia, ponta longa. +8 ATQ. (Perde a Estocada que quebra 3 da Lança do Pedágio.)' },
  gibao: { nm: 'Gibão de Couro Curtido', slot: 'roupa', who: ['rita'], mod: { def: 5, mdef: 3, mhp: 20 }, fx: [], preco: 230, tier: 2, d: '+5 DEF, +3 RESIST, +20 PV. Cheira a cavalo, mas protege.' },
  diapasao: { nm: 'Diapasão de Prata', slot: 'arma', who: ['lume'], mod: { mag: 5 }, fx: [], preco: 250, tier: 2, d: 'Afina a luz. +5 MAG. (No lugar do Microfone: perde o Acalanto em Coro.)' },
  capaFeltro: { nm: 'Capa de Feltro', slot: 'roupa', who: ['lume'], mod: { def: 4, mdef: 4, mhp: 15 }, fx: [], preco: 220, tier: 2, d: '+4 DEF, +4 RESIST, +15 PV. Feltro de chapéu de serra.' },
  lancaBronze: { nm: 'Lança de Bronze Antigo', slot: 'arma', who: ['rita'], mod: { atk: 12 }, fx: [], preco: 480, tier: 3, d: 'Bronze de sino velho, reforjado. +12 ATQ.' },
  brigantina: { nm: 'Brigantina de Placas', slot: 'roupa', who: ['rita'], mod: { def: 8, mdef: 5, mhp: 35, spd: -1 }, fx: [], preco: 440, tier: 3, d: '+8 DEF, +5 RESIST, +35 PV. Pesada: -1 VEL.' },
  liraVidro: { nm: 'Lira de Vidro', slot: 'arma', who: ['lume'], mod: { mag: 9 }, fx: [], preco: 480, tier: 3, d: 'Vidro soprado da Cidade Alta. A luz dela canta. +9 MAG.' },
  mantoFuligem: { nm: 'Manto de Fuligem Bordado', slot: 'roupa', who: ['lume'], mod: { def: 6, mdef: 7, mhp: 25 }, fx: [], preco: 420, tier: 3, d: 'Preto por fora, dourado por dentro. +6 DEF, +7 RESIST, +25 PV.' },
  lancaFarol: { nm: 'Lança do Farol', slot: 'arma', who: ['rita'], mod: { atk: 17, spd: 1 }, fx: [], preco: 0, tier: 4, d: 'Forjada com a escama da Rainha. +17 ATQ, +1 VEL.' },
  couracaCerco: { nm: 'Couraça do Cerco', slot: 'roupa', who: ['rita'], mod: { def: 11, mdef: 8, mhp: 50 }, fx: [], preco: 0, tier: 4, d: 'Palha encantada entre placas de latão. +11 DEF, +8 RESIST, +50 PV.' },
  batutaLuz: { nm: 'Batuta de Luz', slot: 'arma', who: ['lume'], mod: { mag: 13 }, fx: [], preco: 0, tier: 4, d: 'Com a lente do Faroleiro na ponta. +13 MAG.' },
  xaleMorro: { nm: 'Xale de Lã do Morro', slot: 'roupa', who: ['lume'], mod: { def: 9, mdef: 10, mhp: 35 }, fx: [], preco: 0, tier: 4, d: 'Lã do Morro e fios da insígnia. +9 DEF, +10 RESIST, +35 PV.' }
});

// ---------- selos à venda (Papelaria) ----------
const SELO_LOJA = { 'brasa+seiva': [3, 120], 'brasa+fuligem': [3, 120], 'fuligem+seiva': [3, 30], 'fuligem+geada': [4, 150], 'geada+seiva': [4, 150],
  'areia+geada': [5, 180], 'areia+seiva': [5, 180], 'areia+fuligem': [5, 180], 'ambar+geada': [7, 220], 'ambar+seiva': [7, 220], 'ambar+fuligem': [7, 220], 'ambar+areia': [8, 260] };
function temElem(e) { return grim().elems.includes(e); }

// ---------- estoque das lojas ----------
function estoque3(id) {
  const c = capAtual(), L = [];
  const add = (k, preco) => L.push({ k, preco: preco || (EQ2[k] || ITEM2[k]).preco });
  if (id === 'bazar') {
    add('frasco'); add('tinta'); add('pluma'); add('cafe');
    if (c >= 3) { add('pastel'); add('tintaS', 36); }
    if (c >= 5) { add('frascoG'); add('tintaF'); }
    add('escudoTampa'); add('sapatilha'); add('microfone'); add('coleteLona');
  }
  if (id === 'papelaria') {
    add('tintaS', 25); add('tinta'); if (c >= 5) add('tintaF'); add('bomba');
    for (const [k, [cap, p]] of Object.entries(SELO_LOJA)) { const [a, b] = k.split('+'); if (c >= cap && temElem(a) && temElem(b)) L.push({ k: 'selo:' + k, preco: p }); }
  }
  if (id === 'mascate') {
    add('frasco'); if (c >= 5) add('frascoG'); add('tinta'); if (c >= 5) add('tintaF'); add('pluma'); add('pastel'); add('cafe'); add('bomba'); if (c >= 4) add('salG'); add('tintaS', 35);
    if (c >= 4) for (const k of ['lancaSerra', 'gibao', 'diapasao', 'capaFeltro']) add(k);
    if (c >= 7) for (const k of ['lancaBronze', 'brigantina', 'liraVidro', 'mantoFuligem']) add(k);
  }
  return L;
}
function nomeDe(k) { if (k.startsWith('selo:')) { const f = k.slice(5), [a, b] = f.split('+'); return 'Selo: ' + EL3[a].nm + '+' + EL3[b].nm; } return (EQ2[k] || ITEM2[k]).nm; }
async function comprar3(id, dono) {
  while (true) {
    const L = estoque3(id).filter(e => !(e.k.startsWith('selo:') && grim().fus[e.k.slice(5)]));
    const items = L.map(e => {
      const isEq = !!EQ2[e.k], isSelo = e.k.startsWith('selo:');
      const tem = isSelo ? 0 : isEq ? (G.equipInv || {})[e.k] || 0 : G.items[e.k] || 0;
      const d = isSelo ? (() => { const f = FUS3[e.k.slice(5)]; return `Folha com o selo de ${f.nm}: ${f.d}. Depois de comprado, dá para traçar no Grimório.`; })() : (EQ2[e.k] || ITEM2[e.k]).d + (isEq ? ` (${EQ2[e.k].who.map(w => w === 'lume' ? 'Lume' : 'Rita').join('/')}; você tem ${tem})` : ` (você tem ${tem})`);
      return { k: e.k, preco: e.preco, label: nomeDe(e.k), right: e.preco + 'c', disabled: (G.cobres || 0) < e.preco, col: isSelo ? '#ffd060' : isEq ? '#8fe3d8' : undefined, d };
    });
    const i = await list({ x: 14, y: 20, w: 212, maxVis: 10, title: `Comprar   ${G.cobres || 0} cobres`, items, desc: n => items[n] && items[n].d, descY: 174 });
    if (i < 0) return;
    const it = items[i];
    if ((G.cobres || 0) < it.preco) { sfx('cancel'); continue; }
    G.cobres -= it.preco; sfx('item');
    if (it.k.startsWith('selo:')) { ganharSelo(it.k.slice(5)); await mostrarSelo(it.k.slice(5)); }
    else if (EQ2[it.k]) { ganharEquip(it.k); await say(`* Comprou ${EQ2[it.k].nm}. (Equipe pelo MENU > Equipar.)`); }
    else { G.items[it.k] = (G.items[it.k] || 0) + 1; W2.toast = { s: ITEM2[it.k].nm + ' (' + G.items[it.k] + ')', t: 0 }; }
    save2();
  }
}
// loja(): aceita o nome da loja (as listas antigas viram o Bazar)
loja = async function (estoque, dono) {
  const id = typeof estoque === 'string' ? estoque : 'bazar';
  if (W2.id === 'bazar') await cartaTiago();
  while (true) {
    const ops = id === 'papelaria' ? ['Comprar', 'Sair'] : ['Comprar', 'Vender materiais', 'Sair'];
    const c = await choose('* O que vai ser?', ops, 'n', ops.length - 1);
    if (c < 0 || ops[c] === 'Sair') return;
    if (ops[c] === 'Comprar') await comprar3(id, dono);
    else await vender();
  }
};

// ---------- a FORJA da Rita: receitas ----------
const FORJA3 = [
  { k: 'lanca', nm: 'Afiar a lança da Rita', cap: 3, mats: {}, c: 0, d: '+3 ATQ da Rita (de graça: é a primeira).' },
  { k: 'escudo', nm: 'Reforçar o escudo da Rita', cap: 3, mats: { telha: 2 }, c: 30, d: '+2 DEF e +10 PV da Rita.' },
  { k: 'tinta3', nm: 'Misturar tinta (x3)', cap: 3, mats: { fuligemM: 2, pavioM: 1 }, c: 0, rep: true, d: 'Fuligem, pavio, óleo da lamparina. Três vidrinhos de Tinta de Superfície.' },
  { k: 'tampa1', nm: 'Baú: Tampa Reforçada I', cap: 3, mats: { telha: 2, fuligemM: 2 }, c: 60, d: 'O baú: +3 DEF, +15 PV.' },
  { k: 'dentes1', nm: 'Baú: Dentes de Ferro I', cap: 4, mats: { pavioM: 2, minerio: 2 }, c: 70, d: 'O baú: +3 ATQ.' },
  { k: 'forro1', nm: 'Baú: Forro de Tinta I', cap: 4, mats: { poLampiao: 2, linho: 2 }, c: 70, d: 'O baú: +3 MAG, +6 PM.' },
  { k: 'dentes2', nm: 'Baú: Dentes de Ferro II', cap: 5, req: 'dentes1', mats: { botaoReal: 2, minerio: 2 }, c: 160, d: 'O baú: mais +4 ATQ.' },
  { k: 'tampa2', nm: 'Baú: Tampa Reforçada II', cap: 6, req: 'tampa1', mats: { cacoVidro: 3, cera: 2 }, c: 160, d: 'O baú: mais +4 DEF, +25 PV.' },
  { k: 'forro2', nm: 'Baú: Forro de Tinta II', cap: 6, req: 'forro1', mats: { cacoVidro: 2, cera: 2, orvalhoN: 1 }, c: 160, d: 'O baú: mais +4 MAG, +8 PM.' },
  { k: 'tampa3', nm: 'Baú: Tampa Reforçada III', cap: 8, req: 'tampa2', mats: { latao: 3, geloEterno: 2 }, c: 320, d: 'O baú: mais +5 DEF, +35 PV.' },
  { k: 'dentes3', nm: 'Baú: Dentes de Ferro III', cap: 8, req: 'dentes2', mats: { abafador: 2, latao: 2 }, c: 320, d: 'O baú: mais +5 ATQ.' },
  { k: 'forro3', nm: 'Baú: Forro de Tinta III', cap: 9, req: 'forro2', mats: { ambarLasca: 3, penaGralha: 2 }, c: 320, d: 'O baú: mais +5 MAG, +10 PM.' },
  { k: 'eq:lancaFarol', nm: 'Forjar: Lança do Farol', cap: 9, mats: { escamaFarol: 1, latao: 3 }, c: 300, d: 'Rita: +17 ATQ, +1 VEL.' },
  { k: 'eq:couracaCerco', nm: 'Forjar: Couraça do Cerco', cap: 9, mats: { palhaEnc: 1, penaGralha: 3 }, c: 300, d: 'Rita: +11 DEF, +8 RESIST, +50 PV.' },
  { k: 'eq:batutaLuz', nm: 'Forjar: Batuta de Luz', cap: 9, mats: { lenteFarol: 1, ambarLasca: 3 }, c: 300, d: 'Lume: +13 MAG.' },
  { k: 'eq:xaleMorro', nm: 'Forjar: Xale de Lã do Morro', cap: 9, mats: { insignia: 1, geloEterno: 3 }, c: 300, d: 'Lume: +9 DEF, +10 RESIST, +35 PV.' }
];
const BAU_FORJA = { tampa1: { def: 3, mhp: 15 }, tampa2: { def: 4, mhp: 25 }, tampa3: { def: 5, mhp: 35 }, dentes1: { atk: 3 }, dentes2: { atk: 4 }, dentes3: { atk: 5 }, forro1: { mag: 3, mmp: 6 }, forro2: { mag: 4, mmp: 8 }, forro3: { mag: 5, mmp: 10 } };
function usadoNaForja(m) { return FORJA3.some(r => r.mats[m]); }
function forjaFeita(r) { return r.k.startsWith('eq:') ? !!((G.equipInv || {})[r.k.slice(3)]) : !r.rep && !!(G.forja && G.forja[r.k]); }
async function menuForja() {
  G.forja = G.forja || {};
  while (true) {
    const c = capAtual();
    const rs = FORJA3.filter(r => r.cap <= c && !forjaFeita(r) && (!r.req || G.forja[r.req]));
    const pode = r => (G.cobres || 0) >= r.c && Object.entries(r.mats).every(([m, n]) => ((G.mat || {})[m] || 0) >= n);
    const items = rs.map(r => ({ label: r.nm, right: r.c ? r.c + 'c' : '', disabled: !pode(r), d: r.d + ' Precisa: ' + ([...Object.entries(r.mats).map(([m, n]) => `${MAT2[m].nm} ${((G.mat || {})[m] || 0)}/${n}`), r.c ? r.c + ' cobres' : null].filter(Boolean).join(', ') || 'nada') }));
    if (!items.length) { await say('A forja tá quente, mas eu tô sem ideia. Quando aparecer material bom, eu faço mais.', 'rita'); return; }
    const i = await list({ x: 14, y: 20, w: 212, maxVis: 9, title: `Forja da Rita   ${G.cobres || 0} cobres`, items, desc: n => items[n] && items[n].d, descY: 162, allowDisabled: true });
    if (i < 0) return;
    const r = rs[i];
    if (!pode(r)) { sfx('cancel'); await say(pickOne(['Falta coisa. Material não brota, @. Quer dizer, brota: de bicho.', 'Sem material eu só bato martelo no ar. É bonito, mas não protege ninguém.']), 'rita'); continue; }
    G.cobres -= r.c; for (const [m, n] of Object.entries(r.mats)) G.mat[m] -= n;
    sfx('hit'); V.shake = 6; await say('* Tum. Tum. Tum. A Rita bate o ferro com uma alegria que dá medo.');
    if (r.k === 'tinta3') { G.items.tintaS = (G.items.tintaS || 0) + 3; await say('* Três vidrinhos de Tinta de Superfície. A lágrima, a Lume jura que foi do fole.'); }
    else if (r.k.startsWith('eq:')) { ganharEquip(r.k.slice(3)); await say(`* ${EQ2[r.k.slice(3)].nm}! (Equipe pelo MENU > Equipar.)`); }
    else { G.forja[r.k] = true; await say(r.k.startsWith('tampa') ? 'Tampa nova. Quer dizer, a mesma tampa, com mais tampa. Não reclama que dói menos.' : r.k.startsWith('dentes') ? 'Dentes de ferro. Morde com vontade. Mas não a minha mão.' : r.k.startsWith('forro') ? 'Forrei por dentro com papel de tinta. Agora as runas escorregam melhor.' : 'Pronto.', 'rita'); }
    save2();
  }
}
{ const _ffo = falaForja; falaForja = async function () { if (!G.flags.bigorna) return _ffo(); return menuForja(); }; }
// o baú fica mais forte com a forja
{ const _gaF = grupoAtual; grupoAtual = function () {
  const g = _gaF(), b = g.find(m => m.id === 'bau');
  if (b && G.forja) { const cheio = b.hp >= b.mhp, mpCheio = b.mp >= b.mmp; for (const [k, mods] of Object.entries(BAU_FORJA)) if (G.forja[k]) for (const [a, v] of Object.entries(mods)) b[a] = (b[a] || 0) + v; if (cheio) b.hp = b.mhp; if (mpCheio) b.mp = b.mmp; }
  return g;
}; }

// ---------- SEU QUIRINO, O MASCATE ----------
Object.assign(HUMS, { mascate: { h: 46, skin: '#b8805a', hair: '#4a3a2a', beard: true, top: '#8a5a3a', bottom: '#3a3a4a', hat: '#5a3a2a',
  extra: (P, o) => { const C = '#6a4a2a', D = '#4a3020', M = '#a8a8b8';
    if (o.view === 'b') { P.rect(o.cx - 7, o.tT - 4, 14, 16, C); P.rect(o.cx - 7, o.tT + 3, 14, 1, D); P.rect(o.cx - 4, o.tT - 8, 8, 4, M); P.rect(o.cx - 3, o.tT - 9, 6, 1, '#c8c8d8'); }
    else if (o.view === 's') { P.rect(o.cx + 3, o.tT - 3, 7, 14, C); P.rect(o.cx + 4, o.tT - 7, 5, 4, M); }
    else { P.rect(o.cx - 8, o.tT - 6, 3, 10, C); P.rect(o.cx + 5, o.tT - 6, 3, 10, C); P.rect(o.cx - 6, o.tT - 9, 4, 3, M); P.rect(o.cx + 3, o.tT - 10, 3, 4, '#c8a040'); P.rect(o.cx - 4, o.tT, 1, 8, D); P.rect(o.cx + 3, o.tT, 1, 8, D); } } } });
Object.assign(WHO, { quirino: { name: () => 'Seu Quirino', portrait: () => portHum('mascate'), voice: voz(260, 'blipLow'), col: '#f0d8b0' } });
const MASCATE3 = [['largo', 5, 17, () => capAtual() >= 4], ['candeia', 4, 28, () => !!G.flags.c4Init && !G.flags.c4Fim], ['acampamento', 11, 26, () => !!G.flags.c7Init && !G.flags.c7Fim],
  ['ruaPavios', 24, 15, () => !!G.flags.c8Init && !G.flags.c8Fim], ['sope9', 6, 24, () => !!G.flags.c9Init && !G.flags.c9Fim], ['torre10', 7, 54, () => !!G.flags.c10Init && !G.flags.c10Fim]];
async function falaMascate() {
  if (!G.flags.quirino) {
    G.flags.quirino = true;
    await say('Ô de casa! Quirino, mascate, às ordens. Panela, frasco, lança, xale, café e conselho. O conselho é de graça porque ninguém compra.', 'quirino');
    await say('* Ele olha para a mala. A mala olha para ele. Ele não pisca.', 'n');
    await say('Mala que anda com escudeira e moça que brilha. Já vi coisa pior na estrada. Já vi uma galinha cobrando pedágio.', 'quirino');
    await say('A Coroa cobra pedágio em toda estrada nova. Eu sigo quem abre caminho: onde vocês forem, eu chego um dia depois, com a carroça.', 'quirino');
  } else await say(pickOne(['Preço justo! Justo pra mim, que fique claro.', 'Equipamento novo é como sapato novo: dói no começo e salva no fim.', 'Bicho deixa material. Material a escudeira transforma em coisa. Coisa eu não compro, mas material eu compro.', 'Vi o Farol aceso ontem. Vendi três xales.']), 'quirino');
  await loja('mascate', 'quirino');
}
async function lojaPapelaria() {
  if (!G.flags.papelLoja) { G.flags.papelLoja = true; await say('Tinta de escriba, vidrinho por vidrinho. E as folhas de selo que eu copiei dos cadernos velhos. Copiar dá trabalho, então custa.', 'iolanda'); }
  await loja('papelaria', 'iolanda');
}
{ const _mm3e = montarMapas2; montarMapas2 = function () {
  _mm3e.apply(this, arguments);
  for (const [map, x, y, vis] of MASCATE3) { const M = MAPS2[map]; if (!M || M._quirino) continue; M._quirino = true;
    M.ents.push(morador('mascate', x, y, { id: 'quirino_' + map, dir: 'down', gone: () => !vis(), rotina: rot([x, y, 'olhar', 9000, 'down']), talk: falaMascate })); }
}; }

// ---------- baús: selos e tinta escondidos ----------
const BAU_EXTRA = {
  cais_a: { tinta: 2 }, igreja_a: { tinta: 2 }, estrada_b: { tinta: 2 }, auren_a: { selo: 'brasa+seiva' }, galerias1_a: { tinta: 3 }, galerias2_a: { selo: 'fuligem+geada' },
  largo_a: { selo: 'geada+seiva' }, hosp2_a: { tinta: 2 }, candeia_a: { selo: 'brasa+fuligem' }, mina_b: { tinta: 3 }, cidadeAlta_a: { selo: 'areia+geada' }, telhados_b: { selo: 'areia+seiva' },
  selo1_b2: { tinta: 3 }, selo2_b1: { selo: 'areia+fuligem' }, acampamento_b1: { tinta: 3 }, bombas_b: { selo: 'ambar+geada' }, coracao_b: { selo: 'ambar+areia' }, andar1_b: { tinta: 3 },
  cisternas_b: { selo: 'ambar+seiva' }, sope9_b0: { selo: 'brasa+sal' }, encosta9_b1: { tinta: 4 }, crista9_b1: { selo: 'ambar+fuligem' }, torre10_b1: { tinta: 4 }, torre10_b2: { selo: 'sal+seiva' }
};
{ const _bE = bauEnt; bauEnt = function (map, id, x, y, give) {
  const X = BAU_EXTRA[map + '_' + id];
  if (!X) return _bE(map, id, x, y, give);
  return _bE(map, id, x, y, async () => {
    if (give) await give();
    if (X.tinta) { G.items.tintaS = (G.items.tintaS || 0) + X.tinta; await say(`* No fundo, embrulhados em jornal: ${X.tinta} vidrinhos de {y}Tinta de Superfície{/}.`); }
    if (X.selo) { const novo = ganharSelo(X.selo); await say('* E uma folha dobrada em quatro, com dois sigilos entrelaçados e uma letra redonda na margem.'); if (novo) await mostrarSelo(X.selo); else await say('* (Esse selo você já sabia.)'); }
  });
}; }

// ---------- o SAL: o Zé do cais (Velhágua), depois do Cap. 5 ----------
{ const _fZ = falaZe; falaZe = async function () {
  if (!G.flags.c5Fim || !grim().ativo || temElem('sal')) return _fZ();
  if (!G.flags.zeSal) {
    G.flags.zeSal = true;
    await say('Ô, gente da mala! Lembra da salina velha, que a água comeu? Baixou a maré e eu achei a pedra do meio dela.', 'ze');
    await say('* Ele mostra uma pedra de sal do tamanho de um pão, com um desenho no meio: um quadradinho, uma cruz, uns pontos. O Grimório dá um pulo dentro da tampa.', 'n');
    await say('O desenho tem mais tempo que a cidade. Eu troco. Não por cobre: por LODO. Três Lodos de Rua, daqueles bichos do bairro afogado. Lodo bom veda barco.', 'ze');
  }
  if (((G.mat || {}).lodo || 0) < 3) { await say(`Três lodos de rua. Você tem ${(G.mat || {}).lodo || 0}. Os Lambe-Lodo do Bairro Afogado têm de sobra.`, 'ze'); return; }
  const c = await choose('Troca a pedra de sal por 3 Lodos de Rua?', ['Trocar', 'Agora não'], 'ze', 1);
  if (c !== 0) return;
  G.mat.lodo -= 3; grim().elems.push('sal'); sfx('rune');
  await say('* A tampa abre antes de você pensar. O desenho sai da pedra e entra. Igual na masmorra: baú come runa.', 'n');
  await say('* {y}Elemento SAL aprendido!{/} Quebra +2 de escudo e é barato. Não fecha com Fuligem, Areia nem Âmbar.', 'n');
  ganharSelo('geada+sal'); await mostrarSelo('geada+sal');
  await say('Bom negócio. A pedra eu não ia comer mesmo.', 'ze');
  save2();
}; }
DIARIO.push({ tipo: 'side', cap: 'Velhágua', quem: 'o Zé do cais', tit: 'A pedra da salina', vis: () => !!G.flags.c5Fim && grim().ativo, feita: () => temElem('sal'), recompensa: 'elemento Sal e um selo', desc: 'O Zé troca a pedra do meio da salina velha por 3 Lodos de Rua (Lambe-Lodo, Bairro Afogado).',
  passos: [['Juntar 3 Lodos de Rua (Lambe-Lodo, Bairro Afogado)', () => temElem('sal') || ((G.mat || {}).lodo || 0) >= 3], ['Trocar com o Zé do cais, em Velhágua', () => temElem('sal')]] });   // v121: faltava 'passos' e o diário travava o jogo
