// ================= CAP. 7 NO MAPA, NO DIÁRIO, NA VIDA, E AS VOLTAS (opcionais que pedem viagem) =================
// Pedido do usuário: "temos fast travel, voltar a lugares antigos para resolver coisas novas". Os opcionais do Cap. 7
// cruzam o mapa: a lanterna do Zé (acampamento -> Dona Ilda, CANDEIA), o Sabugo (acampamento -> pão do Afonso, VILA
// DOS PAVIOS -> acampamento), a semente do Guarda-Musgo (Andar 1 -> Seu Benedito, CIDADE ALTA, DE DIA; brota no dia
// seguinte), a página da Ofélia (Andar 1 -> Dona Iolanda, AUREN: +1 página no Grimório).
REGIOES.push({ id: 'origem', nm: 'Mina de Origem', x: 226, y: 60, ic: 'serra', vis: f => f.c7Chegou, al: 'right', lx: 200, ly: 12 });
ESTRADAS.push(['serra', 'origem']);
Object.assign(REGIAO_DE, { acampamento: 'origem', bombas: 'origem', coracao: 'origem', andar1: 'origem', fundo7: 'origem' });
Object.assign(VIDA_CFG, {
  acampamento: { corvos: 2, vagalumes: 9, passaros: true, gatos: 1 },
  bombas: { vagalumes: 3 }, coracao: { vagalumes: 10 }, andar1: { vagalumes: 6, borboletas: 2 }
});
ROTULOS_EXTRA.acampamento = () => [[...AC7.boca[0], 'Boca da Mina'], [AC7.jorge[0], AC7.jorge[1] - 1, 'O 31'], [AC7.placa[0], AC7.placa[1], 'Turnos']];
ROTULOS_EXTRA.bombas = () => [[...BO7.saida[0], 'O Coração'], [...BO7.entrada[0], 'Acampamento']];
ROTULOS_EXTRA.coracao = () => [[...CO7.elevador[0], 'Elevador: Nível 1']];
ROTULOS_EXTRA.andar1 = () => [[AN7.pedestal[0], AN7.pedestal[1] + 1, 'Câmara do Despertar'], [AN7.ofelia[0], AN7.ofelia[1], 'Sala de Leitura Afogada'], [...AN7.descida[0], 'O Fundo']];
Object.assign(LIGA_EXTRA_FIXA, { acampamento: [[...AC7.boca[0], 'bombas']], bombas: [[...BO7.entrada[0], 'acampamento'], [...BO7.saida[0], 'coracao']], coracao: [[...CO7.volta[0], 'bombas'], [...CO7.elevador[0], 'andar1']], andar1: [[...AN7.volta[0], 'coracao'], [...AN7.descida[0], 'fundo7']] });
// o Seu Jorge some de todos os lugares depois do Cap. 7
{ const _mmJ = montarMapas2; montarMapas2 = function () {
  _mmJ.apply(this, arguments);
  for (const m of Object.values(MAPS2)) for (const e of m.ents || []) if (e.id === 'jorge' && !e._j7) { e._j7 = true; const g0 = e.gone; Object.defineProperty(e, 'gone', { value: () => !!G.flags.c7Jorge || (typeof g0 === 'function' ? g0() : !!g0), writable: true, configurable: true }); }
}; }
// ---------- as voltas ----------
{ const _fI = falaIlda; falaIlda = async function () {
  if (G.flags.c7Carta && !G.flags.c7CartaFeita) {
    G.flags.c7CartaFeita = true; playMusic('cha');
    await say('* Você tira do Vão a lanterna amassada. "ZÉ CANDEEIRO", riscado a canivete. A Dona Ilda para de remendar.');
    await say('O Zé. O Zé da casa da esquina, de janela verde. A mulher dele põe uma vela na janela toda noite faz dois anos. Pra ele achar o caminho.', 'ilda');
    await say('Ele não volta, Dona Ilda. Ele entrou no Coração e não subiu.', 'rita');
    await say('Eu sei. A gente sempre sabe. Mas uma lanterna é melhor que uma vela. Uma lanterna é DELE.', 'ilda');
    await say('* Ela some pela rua. Volta depois de um tempo, de olho vermelho, com uma coisa embrulhada num pano.');
    await say('A família mandou. Era do Zé, de reserva. Disseram que quem trouxe a lanterna de volta merece a de reserva.', 'ilda');
    ganharEquip('lanternaZe'); sfx('equip'); await say(`* Você recebeu a {y}${EQ2.lanternaZe.nm}{/}. ${EQ2.lanternaZe.d}`);
    playMusic('candeia'); save2(); return;
  }
  return _fI();
}; }
{ const _fB = falaBenedito; falaBenedito = async function () {
  if (G.flags.c7Semente && !G.flags.c7Plantou) {
    if (ehNoite()) { await say('* O Seu Benedito não está. De noite ele dorme. Jardineiro dorme cedo.'); return; }
    G.flags.c7Plantou = G.dia || 1; sfx('item');
    await say('* Você mostra a semente verde, do tamanho de um punho, que ainda tem cheiro de pedra molhada.');
    await say('Que semente é essa? Nunca vi. Tem cara de coisa velha. Velha MESMO. Me dá aqui, que terra boa eu tenho.', 'benedito');
    await say('* Ele enterra a semente no canteiro do meio da estufa, com cuidado de quem enterra um passarinho.');
    await say('Volta amanhã. Ou depois. Semente velha tem pressa nenhuma.', 'benedito');
    return;
  }
  if (G.flags.c7Plantou && !G.flags.c7Flor) {
    if ((G.dia || 1) <= G.flags.c7Plantou) { await say('Ainda não. Amanhã. Paciência é a ferramenta mais cara do jardineiro.', 'benedito'); return; }
    G.flags.c7Flor = true; sfx('rune');
    await say('Vem ver. VEM VER! Eu nunca vi uma coisa dessas!', 'benedito');
    await say('* No canteiro do meio, durante a noite, cresceu um tufo de musgo verde-escuro em forma de gente sentada. E no colo dele, uma flor branca.');
    await say('Ele finalmente descansou. E sentou num lugar bonito.', 'lume');
    ganharEquip('florMusgo'); sfx('equip'); await say(`* O Seu Benedito corta a flor e te dá. {y}${EQ2.florMusgo.nm}{/}. ${EQ2.florMusgo.d}`);
    save2(); return;
  }
  return _fB();
}; }
{ const _fA = falaAfonso; falaAfonso = async function () {
  if (devolvida('afonso') && G.flags.c7SabugoPista && !G.flags.c7Pao) {
    G.flags.c7Pao = true; sfx('item');
    await say('Pão de milho pra CACHORRO? ...O Sabugo? Lá da serra? Esse cachorro tem gosto! Toma, o do forno das quatro.', 'afonso');
    await say('* {y}Pão de milho do Seu Afonso{/}, embrulhado num pano. (O Sabugo está no acampamento da Mina de Origem.)');
    return;
  }
  return _fA();
}; }
{ const _fIo = falaIolanda; falaIolanda = async function () {
  if (G.flags.c7Pagina && !G.flags.c7PaginaFeita) {
    G.flags.c7PaginaFeita = true; playMusic('cha');
    await say('* Você tira do Vão a página seca da Sala de Leitura Afogada. A Dona Iolanda põe os óculos. Tira. Põe de novo.');
    await say('Papel-lírio de antes da Coroa. Antes do Inverno. Antes de tudo. Onde vocês acharam isso?', 'iolanda');
    await say('Debaixo da terra. Numa biblioteca que afogou.', 'lume');
    await say('Me dá o seu Grimório, menino. Isso aqui se costura com linha de seda e paciência.', 'iolanda');
    await fadeOut(16); sfx('rune'); await wait(30); await fadeIn(16);
    const Gm = grim(); Gm.max = (Gm.max || 4) + 1;
    await say('* {y}O Grimório ganhou uma página!{/} (Agora cabe mais um feitiço preparado.)');
    await say('A letra dessa moça... eu queria ter conhecido.', 'iolanda');
    playMusic('auren'); save2(); return;
  }
  return _fIo();
}; }
// ---------- missões ----------
{ const _ms7 = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c7Init) return _ms7();
  const L = _ms7().filter(m => m.tipo !== 'main');
  let M;
  if (f.c7Fim) M = { tit: 'Um bairro apagado', desc: 'Auren começou a apagar. O Capítulo 8 está a caminho. Enquanto isso, os Marcos levam aonde vocês já foram.', map: 'interior', at: [13, 6] };
  else if (f.c7Musgo) M = { tit: 'O Fundo', desc: 'Desça pelo buraco da broca, no fim da Antessala do Musgo.', map: 'andar1', at: AN7.descida[0] };
  else if (f.c7Andar1) M = { tit: 'A Antessala do Musgo', desc: 'Atravesse o Andar 1 até a Antessala do Musgo, embaixo.', map: 'andar1', at: AN7.musgo };
  else if (f.c7Coracao) M = { tit: 'O Coração', desc: 'Desça o poço. Nas PEDRAS DE ECO a Lume canta e as pontes de cristal acendem por alguns segundos. O elevador fica no fundo.', map: 'coracao', at: CO7.elevador[0] };
  else if (f.c7Broca) M = { tit: 'A porta de cima', desc: 'A porta no alto das Galerias leva ao Coração.', map: 'bombas', at: BO7.saida[0] };
  else if (f.c7Bombas) M = { tit: 'Válvulas e vapor', desc: 'Cada válvula liga e desliga DOIS respiros. Suba as cinco galerias até o alto.', map: 'bombas', at: BO7.broca };
  else if (f.c7Chegou) M = { tit: 'A boca da mina', desc: 'DE NOITE, de PAVIO, passe a cancela da boca da mina. A PLACA DOS TURNOS diz a galeria.', map: 'acampamento', at: AC7.boca[0], quando: 'noite' };
  else M = { tit: 'A estrada velha', desc: 'O 31 está na garagem da base. De dia a estrada tem cancelas; de noite, só o farol.', map: 'interior', at: [13, 6] };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (f.c7Carta && !f.c7CartaFeita) op({ tit: 'A lanterna do Zé', desc: 'Leve a lanterna do Zé Candeeiro à Dona Ilda, em Candeia.', map: 'candeia', at: POS4B.candeia.ildaDoor[0] });
  if (f.c7SabugoPista && !f.c7Sabugo) op({ tit: 'O Sabugo', desc: !devolvida('afonso') ? 'O cão só come pão de milho do padeiro do Cais... que virou Pavio na Vila dos Pavios. (Devolva a lembrança dele.)' : f.c7Pao ? 'Leve o pão de milho ao Sabugo, no acampamento.' : 'Peça pão de milho ao Seu Afonso, na Vila dos Pavios.', map: f.c7Pao ? 'acampamento' : 'ruaPavios', at: f.c7Pao ? AC7.cao : VP.afonso });
  if (f.c7Semente && !f.c7Flor) op({ tit: 'A semente do Musgo', desc: f.c7Plantou ? 'Volte à estufa no dia seguinte: o Seu Benedito plantou a semente.' : 'Leve a semente ao Seu Benedito, na Cidade Alta (DE DIA). Terra boa.', map: 'cidadeAlta', at: CA5.jardineiro, quando: 'dia' });
  if (f.c7Pagina && !f.c7PaginaFeita) op({ tit: 'A página da Ofélia', desc: 'A Dona Iolanda, na papelaria de Auren, costura papel antigo.', map: 'papelaria', at: POS3.papelaria.iolanda });
  return L;
}; }
// ---------- diário ----------
DIARIO.splice(5, 0, { tipo: 'main', cap: 'Capítulo 7 · Serra', tit: 'A Mina de Origem', vis: () => fl('c7Init'), feita: () => fl('c7Fim'),
  desc: 'A etiqueta do barril: "Mina de Origem, pelo cano do Coração". O Seu Jorge conhece a estrada. Ele lembra pouco do caminho.',
  passos: [['Subir a estrada velha no 31', () => fl('c7Chegou')], ['Entrar na mina (de noite, de Pavio)', () => fl('c7Bombas')], ['Vencer a Broca', () => fl('c7Broca')],
    ['Descer o Coração', () => fl('c7Andar1')], ['O Guarda-Musgo', () => fl('c7Musgo')], ['O Extrator', () => fl('c7Extrator')], ['Voltar para casa', () => fl('c7Fim')]] });
DIARIO.push(
  { tipo: 'side', cap: 'Mina de Origem', quem: 'Tonho', tit: 'A lanterna do Zé', vis: () => fl('c7Carta'), feita: () => fl('c7CartaFeita'), recompensa: 'Lanterna do Zé',
    desc: 'O Zé Candeeiro desceu no Coração e não subiu. A lanterna dele precisa voltar para Candeia.', passos: [['Levar à Dona Ilda, em Candeia', () => fl('c7CartaFeita')]] },
  { tipo: 'side', cap: 'Mina de Origem', quem: 'o Sabugo', tit: 'O Sabugo', vis: () => fl('c7SabugoPista'), feita: () => fl('c7Sabugo'), recompensa: 'Coleira do Sabugo',
    desc: 'O cão do acampamento só come pão de milho. O único que presta é de um padeiro que virou Pavio.', passos: [['Devolver a lembrança do Seu Afonso', () => devolvida('afonso')], ['Pegar o pão de milho', () => fl('c7Pao')], ['Dar ao Sabugo', () => fl('c7Sabugo')]] },
  { tipo: 'side', cap: 'Mina de Origem', quem: 'o Guarda-Musgo', tit: 'A semente do Musgo', vis: () => fl('c7Semente'), feita: () => fl('c7Flor'), quando: 'dia', recompensa: 'Flor do Musgo',
    desc: 'O primeiro chefe que você venceu deixou uma semente. Ela quer terra boa.', passos: [['Entregar ao Seu Benedito (Cidade Alta, de dia)', () => !!fl('c7Plantou')], ['Voltar no dia seguinte', () => fl('c7Flor')]] },
  { tipo: 'side', cap: 'Mina de Origem', quem: 'a Ofélia', tit: 'A página seca', vis: () => fl('c7Pagina'), feita: () => fl('c7PaginaFeita'), recompensa: '+1 página no Grimório',
    desc: 'Uma página seca numa biblioteca afogada, na letra de uma bibliotecária conhecida.', passos: [['Levar à Dona Iolanda, em Auren', () => fl('c7PaginaFeita')]] }
);
