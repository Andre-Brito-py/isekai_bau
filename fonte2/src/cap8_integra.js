// ================= CAP. 8 NO MAPA, NO DIÁRIO E NA VIDA =================
Object.assign(REGIAO_DE, { cisternas: 'auren', friagem8: 'auren' });
Object.assign(VIDA_CFG, { cisternas: { vagalumes: 6 }, friagem8: { vagalumes: 4 } });
ROTULOS_EXTRA.cisternas = () => [[...CI8.saida[0], 'Largo do Hospital'], [...CI8.comporta[0], 'Comporta'], [...CI8.descida[0], 'O Coração Frio'], [CI8.nina[0], CI8.nina[1], 'A câmara da Nina']];
Object.assign(LIGA_EXTRA_FIXA, { cisternas: [[...CI8.saida[0], 'largo'], [...CI8.descida[0], 'friagem8']], friagem8: [[...FR8.volta[0], 'cisternas']] });
{ const _ms8 = missoes; missoes = function () {
  const f = G.flags || {};
  if (!f.c8Init) return _ms8();
  const L = _ms8().filter(m => m.tipo !== 'main');
  let M;
  const nb = BAIRROS8.filter(b => f['c8B_' + b]).length;
  if (f.c8Fim) M = { tit: 'O Morro do Farol', desc: '"Está na hora de acendê-lo." O Capítulo 9 está a caminho.', map: 'interior', at: [13, 6] };
  else if (f.c8Friagem) M = { tit: 'Amanhecer', desc: 'Suba com a Lume.', map: 'friagem8', at: FR8.volta[0] };
  else if (f.c8Nina) M = { tit: 'O Coração Frio', desc: 'A comporta está aberta. Atravesse o segundo salão de gelo e desça.', map: 'cisternas', at: CI8.descida[0] };
  else if (f.c8Tome) M = { tit: 'A Nina', desc: 'A menina entrou no gelo pela passagem da esquerda. Braseiros derretem o gelo. A volta é pelo corredor escuro (alavanca da grade).', map: 'cisternas', at: CI8.nina };
  else if (f.c8P1) M = { tit: 'As Cisternas', desc: 'A fonte do Largo rachou: uma escada desce para as Cisternas. O frio vem de lá.', map: 'largo', at: escadaLargo() };
  else if (nb >= 4 && musicosProntos()) M = { tit: 'A Noite da Música', desc: 'DE NOITE, no palco do Festival.', map: 'festival', at: POS3.festival.frente[1], quando: 'noite' };
  else M = { tit: 'Acender Auren (' + nb + '/4)', desc: 'DE NOITE: acenda os braseiros e leve as pessoas pelas ruas acesas. Bairro Baixo (para dentro do baú), Largo (para o hospital), Vila dos Pavios (quem lembra ajuda), Festival (os músicos de cada bairro para o palco). Velas: Dona Iolanda, de dia.', map: BAIRROS8.find(b => !f['c8B_' + b]) || 'festival', at: [10, 10], quando: 'noite' };
  M.tipo = 'main'; L.unshift(M);
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (!f.c8Fim) {
    if (!f.c8VelasVelhagua) op({ tit: 'Velas de procissão', desc: 'Dizem que a Igreja do Sino, em Velhágua, guardava velas para o dia em que a luz faltasse.', map: 'igreja', at: [6, 6] });
    if (!f.c8Lampiao) op({ tit: 'Os lampiões de Candeia', desc: 'Candeia apagou três anos atrás e aprendeu a viver assim. A Dona Ilda sabe como.', map: 'candeia', at: POS4B.candeia.ildaDoor[0] });
    if (!f.c8Hortensia) op({ tit: 'A Cidade Alta acesa', desc: 'Lá em cima ninguém apagou nada. A Dona Hortênsia está na janela.', map: 'cidadeAlta', at: CA5.dama });
    if (f.c8Init && !f.c8Jorge) op({ tit: 'O Pavio da casa 9', desc: 'Na Vila dos Pavios, de noite, um Pavio de bigode e mãos de mecânico.', map: 'ruaPavios', at: [34, 9], quando: 'noite' });
  }
  return L;
}; }
DIARIO.splice(6, 0, { tipo: 'main', cap: 'Capítulo 8 · Auren', tit: 'O Inverno Escuro', vis: () => fl('c8Init'), feita: () => fl('c8Fim'),
  desc: 'Sete noites sem âmbar, "para lembrarem". A Lume diz que vela não precisa de âmbar.',
  passos: [['Acender o Bairro Baixo', () => fl('c8B_auren')], ['Acender o Largo', () => fl('c8B_largo')], ['Acender a Vila dos Pavios', () => fl('c8B_ruaPavios')], ['Acender o Festival', () => fl('c8B_festival')],
    ['A Noite da Música', () => fl('c8P1')], ['Achar a Nina', () => fl('c8Nina')], ['A Friagem', () => fl('c8Friagem')], ['Amanhecer', () => fl('c8Fim')]] });
DIARIO.push(
  { tipo: 'side', cap: 'Inverno Escuro', quem: 'o sacristão', tit: 'Velas de procissão', vis: () => fl('c8Init'), feita: () => fl('c8VelasVelhagua'), recompensa: '10 velas e +20 de chama máxima', desc: 'Velhágua guardou velas para o dia em que a luz faltasse.', passos: [['Igreja do Sino, Velhágua', () => fl('c8VelasVelhagua')]] },
  { tipo: 'side', cap: 'Inverno Escuro', quem: 'Dona Ilda', tit: 'Os lampiões de Candeia', vis: () => fl('c8Init'), feita: () => fl('c8Lampiao'), recompensa: 'braseiro custa 15', desc: 'A vila que apagou primeiro sabe acender melhor.', passos: [['Falar com a Dona Ilda, em Candeia', () => fl('c8Lampiao')]] },
  { tipo: 'side', cap: 'Inverno Escuro', quem: 'Dona Hortênsia', tit: 'A Cidade Alta acesa', vis: () => fl('c8Init'), feita: () => fl('c8Hortensia'), recompensa: '6 velas', desc: 'Lá em cima ninguém apagou nada.', passos: [['Falar com a Dona Hortênsia', () => fl('c8Hortensia')]] },
  { tipo: 'side', cap: 'Inverno Escuro', quem: 'o Pavio da casa 9', tit: 'Duas bombadas', vis: () => fl('c8Init'), feita: () => fl('c8Jorge'), quando: 'noite', recompensa: '—', desc: 'Um Pavio de bigode, na Vila, de noite.', passos: [['Cantar para ele', () => fl('c8Jorge')]] }
);
