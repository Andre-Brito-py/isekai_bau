// ================= CAP. 9 NO MAPA, NO DIÁRIO E NA VIDA =================
Object.assign(REGIAO_DE, { sope9: 'farol', encosta9: 'farol', crista9: 'farol', farol9: 'farol' });
{ const RF = REGIOES.find(r => r.id === 'farol'); if (RF) Object.defineProperty(RF, 'longe', { get: () => !(G.flags && G.flags.c9P2), configurable: true }); }
Object.assign(VIDA_CFG, {
  sope9: { corvos: 3, vagalumes: 6, passaros: true },
  encosta9: { corvos: 2, vagalumes: 3 },
  crista9: { vagalumes: 8, borboletas: 1 },
  farol9: { vagalumes: 6 }
});
ROTULOS_EXTRA.sope9 = () => [[...SO9.saida[0], 'Cidade Alta'], [SO9.cancela[0][0], SO9.cancela[0][1] + 2, 'Cancela'], [SO9.tenda[0] + 1, SO9.tenda[1] + 2, 'Tenda da Dalva'], [SO9.chamine[0], SO9.chamine[1] + 2, 'Chaminé Velha']];
ROTULOS_EXTRA.encosta9 = () => [[EN9.saida[0][0], EN9.saida[0][1] + 2, 'A Crista'], [EN9.chamineA[0] + 1, EN9.chamineA[1] + 1, 'Chaminé']];
ROTULOS_EXTRA.crista9 = () => [[CR9.atril[0], CR9.atril[1] + 1, 'Atril'], [23, 5, 'Porta das Lentes']];
ROTULOS_EXTRA.farol9 = () => [[15, 8, 'O Farol']];
Object.assign(LIGA_EXTRA_FIXA, { sope9: [[...SO9.saida[0], 'cidadeAlta'], [...SO9.acima[0], 'encosta9']], encosta9: [[...EN9.volta[0], 'sope9'], [...EN9.saida[0], 'crista9']], crista9: [[...CR9.volta[0], 'encosta9'], [...CR9.saida[0], 'farol9']], farol9: [[...FA9.volta[0], 'crista9']] });
{ const _ms9 = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c9Init) return _ms9();
  const L = _ms9().filter(m => m.tipo !== 'main');
  let M;
  const n = nAliados9();
  if (f.c9Fim) M = { tit: 'O Farol de Cem Invernos', desc: 'O Farol acendeu. O Capítulo 10 está a caminho.', map: 'sope9', at: SO9.entra };
  else if (f.c9Faroleiro) M = { tit: 'A escada', desc: 'A porta do Farol está aberta.', map: 'farol9', at: FA9.porta[0] };
  else if (f.c9Rainha) M = { tit: 'O Pátio do Farol', desc: 'Pela Porta das Lentes, até o pé da torre.', map: 'crista9', at: CR9.saida[0] };
  else if (f.c9Porta) M = { tit: 'A Porta das Lentes', desc: 'A porta abriu. Alguma coisa viu a luz.', map: 'crista9', at: CR9.rainhaTrig[3] };
  else if (f.c9Crista) M = { tit: 'O Jardim das Lentes', desc: 'Leve o feixe da Lente do Luar até o cristal da porta com três espelhos (o atril tem a página da Ofélia).', map: 'crista9', at: CR9.alvo };
  else if (f.c9Cancela) M = { tit: 'A Encosta', desc: 'Suba os seis patamares. Fique abrigado quando o vento assobiar.' + (aliado9('tico') ? ' A Chaminé Velha (1º patamar) corta caminho.' : ''), map: 'encosta9', at: EN9.saida[0] };
  else if (f.c9P2) M = { tit: 'A cancela', desc: 'O pé do Morro: passe pela cancela da Guarda.', map: 'sope9', at: SO9.cancela[0] };
  else if (prontoSubir9()) M = { tit: 'Subir o Morro', desc: n + ' aliados. No quadro do cerco, na base: "Hoje à noite".' + (n < 5 ? ' (Mais aliados deixam a subida mais fácil.)' : ''), map: 'interior', at: [9, 4] };
  else M = { tit: 'O Quadro do Cerco (' + n + '/5)', desc: 'Chame aliados pelos Marcos: a Dona Iolanda (Papelaria, de dia) e mais dois: a Irmã Dalva (base), Tico e Dito (Bairro Baixo, de dia), o Brás (Vila dos Pavios, de noite), a Dona Badalada (Velhágua).', map: !aliado9('iolanda') ? 'papelaria' : 'interior', at: [6, 4] };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (!f.c9Leitura) op({ tit: 'Rastros de âmbar (' + fiosMoca9() + '/3)', desc: 'Fios de âmbar morno onde a moça parou para respirar: nas Cisternas de Auren, no Poço do Sino de Velhágua e onde você acordou (Andar 1, pela Mina de Origem).', map: !f.c9FioPoco ? 'poco' : !f.c9FioAndar ? 'andar1' : 'cisternas', at: [8, 8] });
  if (!f.c9PensaoFim) op({ tit: 'A pensão sem remetente', desc: f.c9Pensao === 2 ? 'Na Cidade Alta, a Dona Hortênsia conhece todo lacre de família.' : f.c9Pensao === 1 ? 'Em Candeia, a Dona Ilda perdeu o marido para os Pavios.' : 'No Largo, de dia, a Dona Cida (a da noite da música) tem um envelope.', map: f.c9Pensao === 2 ? 'cidadeAlta' : f.c9Pensao === 1 ? 'candeia' : 'largo', at: [10, 10], quando: !f.c9Pensao ? 'dia' : undefined });
  return L;
}; }
DIARIO.splice(7, 0, { tipo: 'main', cap: 'Capítulo 9 · O Morro', tit: 'A Subida do Morro', vis: () => fl('c9Init'), feita: () => fl('c9Fim'),
  desc: 'O Farol acende quando estiver cheio. Os Pavios sobem com potes toda noite. Três pessoas e uma mala não furam um cerco.',
  passos: [['Dona Iolanda e mais dois aliados', () => prontoSubir9() || fl('c9P2')], ['A cancela', () => fl('c9Cancela')], ['O Espantalho do Cerco', () => fl('c9Espantalho')], ['A Porta das Lentes', () => fl('c9Porta')], ['A Rainha do Farol', () => fl('c9Rainha')], ['O Faroleiro', () => fl('c9Faroleiro')], ['O Farol', () => fl('c9Fim')]] });
DIARIO.push(
  { tipo: 'side', cap: 'A Subida do Morro', quem: 'a moça de âmbar', tit: 'Rastros de âmbar', vis: () => fl('c9Init'), feita: () => fl('c9Leitura'), recompensa: 'LEITURA (o Avaliar ajuda na defesa)', desc: 'Fios de âmbar morno onde ela parou para respirar.', passos: [['As Cisternas', () => fl('c8Fio')], ['O Poço do Sino, Velhágua', () => fl('c9FioPoco')], ['A Câmara do Despertar', () => fl('c9FioAndar')]] },
  { tipo: 'side', cap: 'A Subida do Morro', quem: 'Dona Cida', tit: 'A pensão sem remetente', vis: () => fl('c9Init'), feita: () => fl('c9PensaoFim'), recompensa: 'Lacre Partido', desc: 'Um envelope todo mês, sem nome, com alecrim seco.', passos: [['A Dona Cida, no Largo', () => !!G.flags.c9Pensao], ['A Dona Ilda, em Candeia', () => G.flags.c9Pensao === 2 || fl('c9PensaoFim')], ['A Dona Hortênsia, na Cidade Alta', () => fl('c9PensaoFim')]] },
  { tipo: 'side', cap: 'A Subida do Morro', quem: 'os aliados', tit: 'Os cinco do cerco', vis: () => fl('c9Init'), feita: () => nAliados9() >= 5, recompensa: 'a subida mais fácil', desc: 'Todo mundo que vocês ajudaram até aqui.', passos: Object.entries(ALIADOS9).map(([k, a]) => [a.nm, () => aliado9(k)]) }
);
