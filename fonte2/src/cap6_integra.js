// ================= CAP. 6 NO MAPA, NO DIÁRIO, NAS PLACAS E NA VIDA =================
Object.assign(REGIAO_DE, { ruaPavios: 'auren', selo1: 'auren', selo2: 'auren' });
Object.assign(VIDA_CFG, {
  ruaPavios: { pombos: 2, gatos: 3, vagalumes: 7, corvos: 1 },
  selo1: { vagalumes: 5 },
  selo2: { vagalumes: 8 }
});
ROTULOS_EXTRA.ruaPavios = () => [[...VP.largoDoor[0], 'Largo do Hospital'], [...VP.seloDoor[0], 'Casa do Selo'], [VP.lavDoor[0], VP.lavDoor[1], 'Lavanderia'], [VP.refDoor[0], VP.refDoor[1], 'Refeitório'], [VP.relogioPe[0], VP.relogioPe[1], 'Relógio da Vila']];
{ const r0 = ROTULOS_EXTRA.largo; ROTULOS_EXTRA.largo = () => [...(r0 ? r0() : []), [38, 29, 'Vila dos Pavios']]; }
ROTULOS_EXTRA.selo1 = () => [[...S16.cofreDoor[0], 'Cofre'], [...S16.saida[0], 'Vila dos Pavios']];
ROTULOS_EXTRA.selo2 = () => [[...S26.calha[0], 'Calha de descarte']];
// ligações por gatilho (a porta do Selo, a porta do Cofre, a calha)
Object.assign(LIGA_EXTRA_FIXA, { ruaPavios: [[...VP.seloDoor[0], 'selo1']], selo1: [[...S16.cofreDoor[0], 'selo2'], [...S16.saida[0], 'ruaPavios']], selo2: [[...S26.saida[0], 'selo1'], [...S26.calha[0], 'ruaPavios']] });
// ---------- missões no mapa ----------
{ const _ms6 = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c6Init) return _ms6();
  const pos = (fn) => { try { return fn(); } catch (e) { return null; } };
  const L = _ms6().filter(m => m.tipo !== 'main' && m.tit !== 'Procurados');
  let M;
  if (f.c6Fim) M = { tit: 'A Mina de Origem', desc: 'A etiqueta do barril aponta para a Mina de Origem, pelo cano do Coração. O Seu Jorge conhece a estrada. (O Capítulo 7 está a caminho.)', map: 'interior', at: [13, 6] };
  else if (f.c6Seladora) M = { tit: 'A calha', desc: 'Saia pela calha de descarte, no canto de cima à direita do Cofre.', map: 'selo2', at: S26.calha[0] };
  else if (f.c6Selo2) M = { tit: 'O Cofre das Lembranças', desc: 'Ache nas estantes os frascos do Osvaldo (o relojoeiro), do cozinheiro que assobia e da lavadeira que procura um dedal.', map: 'selo2', at: S26.estantes[0] };
  else if (f.c6Tiago) M = { tit: 'A Casa do Selo', desc: 'DE NOITE, vestido de PAVIO, passe a cancela do Selo (crachá 47), atravesse o galpão NA FAIXA, as esteiras e as prensas, e abra o Cofre com a chave.', map: 'ruaPavios', at: VP.seloDoor[0], quando: 'noite' };
  else if (f.c6Trupe) M = { tit: 'O show do Herói', desc: 'À NOITE, vestido de TRUPE, suba no palco do Festival na abertura do show do Herói nº 30.', map: 'festival', at: POS3.festival.frente[1], quando: 'noite' };
  else if (f.c6Bras) M = { tit: 'Uma trupe', desc: 'O Seu Lúcio, o bardo, monta uma trupe no Festival. Ele precisa de quem cante e bata o ritmo.', map: 'festival', at: [46, 21] };
  else if (f.c6Casaco) M = { tit: 'O menino de farda', desc: 'A Dona Cotinha sai DE NOITE para acender os postes da vila. Vá vestido de PAVIO e devolva a lembrança.', map: 'ruaPavios', at: VP.cotinha, quando: 'noite' };
  else if (f.c6Osvaldo) M = { tit: 'Casacos cinza', desc: 'Os casacos de Pavio secam no varal da lavanderia, DE DIA. Lavadeira pode tirar roupa do varal.', map: 'ruaPavios', at: VP.varalPega, quando: 'dia' };
  else if (f.c6Vila) M = { tit: 'O relojoeiro', desc: 'O Osvaldo Candeia mora na Vila dos Pavios. Procure perto do relógio parado.', map: 'ruaPavios', at: VP.osvaldo };
  else M = { tit: 'A Vila dos Pavios', desc: 'Vestido de LAVADEIRA (de dia), entre pelo portão de baixo do Largo do Hospital. Se perguntarem: roupa da ALA SETE.', map: 'largo', at: [38, 28], quando: 'dia' };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (temLemb('afonso')) op({ tit: 'O cozinheiro que assobia', desc: 'Devolva a lembrança ao Pavio cozinheiro, no refeitório da vila.', map: 'ruaPavios', at: VP.afonso });
  if (temLemb('zelia')) op({ tit: 'A lavadeira do dedal', desc: 'Devolva a lembrança à Pavia lavadeira, na frente da lavanderia (DE DIA).', map: 'ruaPavios', at: VP.zelia, quando: 'dia' });
  if (temLemb('juvenal')) op({ tit: 'A casa sem número', desc: 'Devolva a lembrança ao Pavio parado na frente da única casa sem número.', map: 'ruaPavios', at: VP.semNumero });
  if (temLemb('osvaldo') && f.c6Fim) op({ tit: 'Meu relojoeiro', desc: 'Devolva ao Osvaldo o rosto da Candinha.', map: 'ruaPavios', at: VP.osvaldo });
  return L;
}; }
// ---------- diário ----------
DIARIO.splice(4, 0, { tipo: 'main', cap: 'Capítulo 6 · Auren', tit: 'A Cidade dos Pavios', vis: () => fl('c6Init'), feita: () => fl('c6Fim'),
  desc: 'Procurados pela Coroa. A Guarda em cada esquina, um Pavio em cada Marco. E um remédio que tem gosto de saudade.',
  passos: [['Entrar na Vila dos Pavios (de lavadeira)', () => fl('c6Vila')], ['Falar com o Osvaldo Candeia', () => fl('c6Osvaldo')], ['Pegar casacos de Pavio no varal', () => fl('c6Casaco')],
    ['Devolver a lembrança da Dona Cotinha', () => fl('c6Bras')], ['Entrar na trupe do Seu Lúcio', () => fl('c6Trupe')], ['O show do Herói nº 30', () => fl('c6Tiago')],
    ['Entrar no Cofre da Casa do Selo', () => fl('c6Selo2')], ['Vencer a Seladora Real', () => fl('c6Seladora')], ['Sair pela calha', () => fl('c6Fim')]] });
DIARIO.push(
  { tipo: 'side', cap: 'Vila dos Pavios', quem: 'o cozinheiro', tit: 'O pão sem assobio', vis: () => !!lembSt().afonso, feita: () => devolvida('afonso'), recompensa: 'Avental de Padeiro',
    desc: 'O Pavio do refeitório assobia sempre a mesma música, desafinada no mesmo lugar. O pão dele é triste.', passos: [['Achar a lembrança dele no Cofre', () => !!lembSt().afonso], ['Devolver', () => devolvida('afonso')]] },
  { tipo: 'side', cap: 'Vila dos Pavios', quem: 'a lavadeira', tit: 'O dedal', vis: () => !!lembSt().zelia, feita: () => devolvida('zelia'), quando: 'dia', recompensa: 'Dedal de Prata',
    desc: 'A Pavia da lavanderia pergunta para que serve um dedal.', passos: [['Achar a lembrança dela no Cofre', () => !!lembSt().zelia], ['Devolver (de dia)', () => devolvida('zelia')]] },
  { tipo: 'side', cap: 'Vila dos Pavios', quem: 'o Pavio sem número', tit: 'A casa sem número', vis: () => !!lembSt().juvenal, feita: () => devolvida('juvenal'), recompensa: 'frascos e uma pena',
    desc: 'Um frasco sem lote, achado numa ilha das esteiras: uma porta azul e um 7 torto.', passos: [['Devolver ao Pavio da casa sem número', () => devolvida('juvenal')]] },
  { tipo: 'side', cap: 'Vila dos Pavios', quem: 'o baú', tit: 'Cinco lembranças', vis: () => nDevolvidas() > 0, feita: () => fl('c6Devolucao'), recompensa: 'técnica DEVOLUÇÃO',
    desc: 'Devolver as cinco lembranças: Cotinha, Osvaldo, o cozinheiro, a lavadeira e o Pavio sem número.', passos: Object.keys(LEMB6).map(k => [LEMB6[k].dono, () => devolvida(k)]) }
);
