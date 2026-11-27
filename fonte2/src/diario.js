// ================= DIÁRIO DE MISSÕES (menu > Missões) =================
// Pedido do usuário: "uma lista de missões, dando detalhes sobre a missão e o andamento dela".
// Abas EM ANDAMENTO / CONCLUÍDAS. Cada missão: capítulo ou quem pediu, descrição, onde, horário, recompensa, etapas
// (as feitas com visto, a atual com seta; as futuras ficam escondidas, "+N etapas", para não estragar a história)
// e barra de andamento. Ao criar um capítulo novo: acrescentar a missão principal e as paralelas em DIARIO.
const fl = (k) => !!(G.flags || {})[k], fn = (k) => (G.flags || {})[k] || 0;
const DIARIO = [
  // ---------- principais ----------
  { tipo: 'main', cap: 'Capítulo 2 · Velhágua', tit: 'O sino que puxa a cidade', vis: () => fl('c2Init') || fl('c2Chegada'), feita: () => fl('c2Fim'),
    desc: 'Velhágua afunda um pouco a cada noite, e um sino velho chama lá do fundo do rio.',
    passos: [['Chegar a Velhágua', () => fl('c2Chegada')], ['Falar com a Irmã Celeste, na Praça do Sino', () => fl('celeste')], ['Passar pela escadaria da igreja', () => fl('brasLuta')],
      ['Descobrir como atravessar a água', () => fl('boiar')], ['Enfrentar o que puxa a cidade, no fundo do poço', () => fl('c2Boss')], ['Voltar à praça', () => fl('c2Fim')]] },
  { tipo: 'main', cap: 'Capítulo 3 · Auren', tit: 'A capital acesa', vis: () => fl('c3Init'), feita: () => fl('c3Fim'),
    desc: 'O convite para o Festival da Luz leva o grupo pela Estrada dos Lampiões até Auren, a cidade que nunca apaga.',
    passos: [['Passar pela Mariposa-Rainha na estrada', () => fl('c3Rainha')], ['Chegar a Auren', () => fl('c3Chegou')], ['Visitar a papelaria do Bairro Baixo', () => fl('c3Iolanda')],
      ['Conseguir fuligem de poste com o Tico', () => fl('c3Fuligem')], ['Conseguir óleo de lamparina com um Pavio', () => fl('c3Oleo')], ['Escrever na mesa da papelaria', () => fl('c3Grim')],
      ['Ir à noite do Festival', () => fl('c3Discurso')], ['Falar com o Tico na grade do bueiro', () => fl('c3TicoGrade')], ['Descer às galerias e enfrentar o que respira lá embaixo', () => fl('c3Mae')],
      ['Achar a lanterna do Dito', () => fl('c3Dito')], ['Voltar à superfície', () => fl('c3Fim')]] },
  { tipo: 'main', cap: 'Capítulo 4 · Auren e a serra', tit: 'A Casa dos Que Esquecem', vis: () => fl('c4Init'), feita: () => fl('c4Fim'),
    desc: 'Na Casa de Saúde do Largo, os pacientes voltam "descansados" e sem lembranças. O Dito, irmão do Tico, sumiu lá dentro.',
    passos: [['Ir ao Largo do Hospital', () => fl('c4Largo')], ['Falar com a Irmã Dalva (de dia, com o rosto humano)', () => fl('c4Hosp')], ['Entrar pela lavanderia, à noite', () => fl('c4Noite')],
      ['Passar pelo Relógio de Plantão', () => fl('c4Relogio')], ['Ler a ficha do Dito no arquivo', () => fl('c4Ficha')], ['Ler a lista na mesa do diretor', () => fl('c4Lista')],
      ['Subir a serra com o Seu Jorge', () => fl('c4Serra')], ['Chegar a Candeia', () => fl('c4Candeia')], ['Encontrar a Dona Ilda (ela só recebe de dia)', () => fl('c4Gatilho')],
      ['Entrar na capela da mina (só no turno da noite)', () => fl('c4Capataz')], ['Voltar para casa', () => fl('c4Fim')]] },
  // ---------- paralelas: Velhágua ----------
  { tipo: 'side', cap: 'Velhágua', quem: 'Seu Tobias', tit: 'Carta para o andar de cima', vis: () => fn('tob') >= 1, feita: () => fn('tob') >= 3, recompensa: 'Xale de Velas e Luva de Pescador',
    desc: 'O Seu Tobias escreve toda semana para a filha, a Marina, que mora nos telhados do bairro afogado. Nunca manda.',
    passos: [['Pegar a carta com o Seu Tobias', () => fn('tob') >= 1], ['Entregar a carta à Marina, nos telhados da Rua Submersa', () => fn('tob') >= 2], ['Contar ao Seu Tobias como ela reagiu', () => fn('tob') >= 3]] },
  { tipo: 'side', cap: 'Velhágua', quem: 'Pedrinho', tit: 'O barquinho do Pedrinho', vis: () => fn('ped') >= 1, feita: () => fn('ped') >= 3, recompensa: '40 cobres e uma pena dourada',
    desc: 'A correnteza levou o barquinho que o pai do Pedrinho fez, escadaria abaixo, até o Mercado Afundado.',
    passos: [['Ouvir o Pedrinho, na praça', () => fn('ped') >= 1], ['Achar o barquinho no Mercado Afundado', () => fn('ped') >= 2], ['Devolver o barquinho', () => fn('ped') >= 3]] },
  { tipo: 'side', cap: 'Velhágua', quem: 'Um Pavio da praça', tit: 'O nome do Pavio', vis: () => fn('pavio') >= 1, feita: () => fn('pavio') >= 3, recompensa: '50 cobres e tinta azul',
    desc: 'O acendedor da praça não lembra o próprio nome. Estava numa plaquinha, na banca dele, antes de o Mercado afundar.',
    passos: [['Ouvir o Pavio', () => fn('pavio') >= 1], ['Achar a plaquinha numa banca do Mercado Afundado', () => fn('pavio') >= 2], ['Devolver o nome a ele', () => fn('pavio') >= 3]] },
  { tipo: 'side', cap: 'Velhágua', quem: 'Irmã Celeste', tit: 'A canção do sino', vis: () => fl('c2Boss'), feita: () => fl('cantouSino') || fl('cantoTardio'), quando: 'noite', recompensa: 'frasco, pluma e 60 cobres',
    desc: 'Mesmo depois de tudo, a Dona Badalada ainda zumbe lá do rio, de noite, sozinha. Como quem espera resposta.',
    passos: [['Ir à Praça do Sino À NOITE e falar com a Irmã Celeste', () => fl('cantouSino') || fl('cantoTardio')]] },
  { tipo: 'side', cap: 'Velhágua', quem: 'a Lume', tit: 'A Lume canta na fonte', vis: () => fl('c2Chegada'), feita: () => false, repete: true, quando: 'noite', recompensa: 'cobres no chapéu (às vezes, um presente)',
    desc: 'De noite, quando o povo sai da taverna, a Lume canta na fonte da Praça do Sino. Uma vez por noite.',
    passos: [['Cantar na fonte hoje à noite', () => typeof noiteId === 'function' && (G.flags || {}).cantouNa === noiteId()], ['Cantar tão bem que alguém deixe um presente', () => fl('fonteFa')]] },
  // ---------- paralelas: Candeia ----------
  { tipo: 'side', cap: 'Estrada da Serra', quem: 'um recado na pedra', tit: 'Riscado na pedra', vis: () => fl('c4Serra'), feita: () => fl('b_serra_m'), quando: 'amanhecer', recompensa: '?',
    desc: '"Ao nascer do sol, olhe pra baixo", diz o mirante. A névoa da serra só abre ao amanhecer.',
    passos: [['Olhar do mirante ao amanhecer (5h às 8h30)', () => fl('b_serra_m')]] },
  { tipo: 'side', cap: 'Candeia', quem: 'os sonâmbulos', tit: 'O poço que desceu', vis: () => fl('c4Candeia'), feita: () => fl('c4Poco'), quando: 'noite', recompensa: '?',
    desc: 'Os moradores que andam dormindo cochicham que o poço da praça brilha lá no fundo... de noite.',
    passos: [['Olhar o poço da praça à noite', () => fl('c4Poco')]] }
];
// os pedidos aceitos no quadro da Guilda entram como missões
function diarioPedidos() {
  if (typeof PEDIDOS === 'undefined') return [];
  return PEDIDOS.filter(p => (G.ped || {})[p.id]).map(p => ({ tipo: 'side', cap: 'Quadro da Guilda', quem: p.quem, tit: p.nm, desc: p.d, recompensa: p.paga + ' cobres', vis: () => true,
    feita: () => pedEstado(p) === 'feito', prog: () => [pedProgresso(p), p.n],
    passos: [[`${p.mat ? 'Juntar' : 'Derrotar'} ${p.n} (${pedProgresso(p)}/${p.n})`, () => pedProgresso(p) >= p.n], ['Receber o pagamento no quadro da taverna', () => pedEstado(p) === 'feito']] }));
}
function diarioTodas() { return [...DIARIO, ...diarioPedidos()].filter(m => m.vis()); }
function andamento(m) { const ps = m.passos || [['Concluir', () => m.feita()]], f = ps.filter(p => p[1]()).length; return { f, n: ps.length, atual: ps.find(p => !p[1]()) }; }
// onde fica a etapa atual (a principal usa o alvo do mapa)
function ondeMissao(m) {
  if (m.feita()) return null;
  const L = missoes();
  if (m.tipo === 'main') { const M = L.find(x => x.tipo === 'main'); return M || null; }
  return L.find(x => x.tit === m.tit) || null;
}

function telaDiario() {
  let aba = 0, sel = 0, t = 0, mud = 0;
  const lista = () => { const T = diarioTodas(); const A = T.filter(m => aba === 0 ? !m.feita() : m.feita()); return aba === 0 ? A.sort((a, b) => (a.tipo === 'main' ? 0 : 1) - (b.tipo === 'main' ? 0 : 1)) : A.reverse(); };
  let L = lista();
  const w = {
    type: 'diario', _abre: Math.random(),
    update() {
      t++;
      if (btnp('left') || btnp('right')) { aba = 1 - aba; sel = 0; L = lista(); mud = t; sfx('select'); }
      if (L.length && navp('up')) { sel = (sel + L.length - 1) % L.length; mud = t; sfx('move'); }
      if (L.length && navp('down')) { sel = (sel + 1) % L.length; mud = t; sfx('move'); }
      if (btnp('b') || btnp('a') || btnp('menu')) { sfx('cancel'); closeWin(this); }
    },
    draw() { try { this._draw(); } catch (e) { console.error('diario', e); bx.globalAlpha = 1; } },   // v121: um erro aqui não derruba o jogo
    _draw() {
      const X = 4, Y = 4, Wd = 232, Hd = 232;
      TQ.length = 0;
      bx.globalAlpha = 0.75; bx.fillStyle = '#05030a'; bx.fillRect(-400, -10, 1200, 300); bx.globalAlpha = 1;
      bx.fillStyle = '#0e0a1a'; bx.fillRect(X + 2, Y + 2, Wd - 4, Hd - 4); box(X, Y, Wd, Hd);
      // abas
      if (!this._cnt || this._cntT !== mud) { const T0 = diarioTodas(), n0 = T0.filter(m => !m.feita()).length; this._cnt = [n0, T0.length - n0]; this._cntT = mud; }   // v121: contagem só quando muda (antes: a cada quadro)
      const nA = this._cnt[0], nC = this._cnt[1];
      [['EM ANDAMENTO', nA], ['CONCLUÍDAS', nC]].forEach(([nm, n], j) => { const x = X + 8 + j * 104, on = j === aba; bx.fillStyle = on ? UIC.accent : 'rgba(143,227,216,0.18)'; bx.fillRect(x, Y + 6, 100, 14); if (!on) { bx.fillStyle = '#0e0a1a'; bx.fillRect(x + 1, Y + 7, 98, 12); } txt(nm + ' ' + n, x + 50, Y + 7, { align: 'center', col: on ? '#ffffff' : '#8fe3d8' }); });
      // lista
      const LY = Y + 26, VIS = 5;
      if (!L.length) { txt(aba === 0 ? 'Nenhuma missão em andamento.' : 'Nenhuma missão concluída ainda.', X + 10, LY + 4, { col: '#8a8099' }); return; }
      const sc = Math.max(0, Math.min(sel - 2, L.length - VIS));
      for (let i = 0; i < VIS && i + sc < L.length; i++) {
        const k = i + sc, m = L[k], yy = LY + i * 12, on = k === sel; if (!m._cache || m._cacheT !== this._abre) { m._cache = { a: andamento(m), f: m.feita() }; m._cacheT = this._abre; } const a = m._cache.a, feita = m._cache.f;
        if (on) { bx.fillStyle = UIC.sel; bx.fillRect(X + 4, yy - 1, Wd - 8, 12); setaSel(X + 5, yy); }
        // ícone
        bx.fillStyle = feita ? '#5aa870' : m.tipo === 'main' ? '#ffd060' : '#7ad8ff'; bx.fillRect(X + 14, yy + 1, 7, 9); bx.fillStyle = '#0e0a1a';
        if (feita) { bx.fillRect(X + 15, yy + 5, 1, 1); bx.fillRect(X + 16, yy + 6, 1, 1); bx.fillRect(X + 17, yy + 5, 1, 1); bx.fillRect(X + 18, yy + 4, 1, 1); bx.fillRect(X + 19, yy + 3, 1, 1); }
        else if (m.tipo === 'main') { bx.fillRect(X + 17, yy + 2, 1, 5); bx.fillRect(X + 17, yy + 8, 1, 1); }
        else { bx.fillRect(X + 16, yy + 2, 3, 1); bx.fillRect(X + 18, yy + 3, 1, 2); bx.fillRect(X + 17, yy + 5, 1, 2); bx.fillRect(X + 17, yy + 8, 1, 1); }
        const tit = [...m.tit].length > 26 ? [...m.tit].slice(0, 25).join('') + '.' : m.tit;
        txt(tit, X + 25, yy, { col: feita ? '#8aa890' : on ? '#ffffff' : '#c8d4dc' });
        // mini barra de andamento
        const bw = 34, bxx = X + Wd - 10 - bw; bx.fillStyle = '#05030a'; bx.fillRect(bxx, yy + 4, bw, 4); bx.fillStyle = feita ? '#5aa870' : m.tipo === 'main' ? '#ffd060' : '#7ad8ff'; bx.fillRect(bxx, yy + 4, Math.round(bw * (feita ? 1 : a.f / a.n)), 4);
      }
      if (L.length > VIS) { if (sc > 0) { const o = Math.floor(FRAME / 12) % 2, ax = X + Wd / 2 - 3, ay = LY - 2 - o; bx.fillStyle = UIC.line; bx.fillRect(ax + 3, ay - 2, 1, 1); bx.fillRect(ax + 2, ay - 1, 3, 1); bx.fillRect(ax + 1, ay, 5, 1); } if (sc + VIS < L.length) setaMais(X + Wd / 2 - 3, LY + VIS * 12 - 1); }
      // detalhe da selecionada
      const m = L[sel], a = andamento(m), feita = m.feita(), DY = LY + VIS * 12 + 4, k = Math.min(1, (t - mud) / 8);
      bx.fillStyle = 'rgba(143,227,216,0.25)'; bx.fillRect(X + 6, DY, Wd - 12, 1);
      const cor = feita ? '#5aa870' : m.tipo === 'main' ? '#ffd060' : '#7ad8ff';
      bx.globalAlpha = k;
      let y = DY + 4;
      txt((m.tipo === 'main' ? 'PRINCIPAL' : m.repete ? 'REPETÍVEL' : 'OPCIONAL') + ' · ' + (m.tipo === 'main' ? m.cap : 'pedido de ' + m.quem), X + 8, y, { col: cor }); y += 12;
      y += txt(m.desc, X + 8, y, { w: Math.floor((Wd - 16) / 6), col: '#d8d0e0', lh: 10 }) * 10 + 4;
      // etapas: a última feita (com visto) e a atual (com seta); as futuras ficam escondidas
      const feitas = (m.passos || []).filter(p => p[1]());
      const visto = (yy) => { bx.fillStyle = '#5aa870'; bx.fillRect(X + 10, yy + 2, 6, 6); bx.fillStyle = '#0e0a1a'; bx.fillRect(X + 11, yy + 5, 1, 1); bx.fillRect(X + 12, yy + 6, 1, 1); bx.fillRect(X + 13, yy + 5, 1, 1); bx.fillRect(X + 14, yy + 4, 1, 1); };
      if (feitas.length && (!m.repete || feitas.length)) for (const [s2] of (feita && !m.repete ? feitas.slice(-2) : feitas.slice(-1))) { visto(y); y += txt(s2, X + 20, y, { w: Math.floor((Wd - 28) / 6), col: '#7a9a82', lh: 10 }) * 10; }
      if (a.atual && !feita) {
        const o = Math.floor(FRAME / 10) % 2; bx.fillStyle = cor; bx.fillRect(X + 11 + o, y + 2, 1, 7); bx.fillRect(X + 12 + o, y + 3, 1, 5); bx.fillRect(X + 13 + o, y + 4, 1, 3); bx.fillRect(X + 14 + o, y + 5, 1, 1);
        y += txt(a.atual[0], X + 20, y, { w: Math.floor((Wd - 28) / 6), col: '#ffffff', lh: 10 }) * 10;
      }
      // rodapé: onde e quando, recompensa, barra de andamento
      if (this._ondeK !== sel + '/' + aba) { this._ondeK = sel + '/' + aba; try { this._onde = ondeMissao(m); } catch (e) { console.error(e); this._onde = null; } }
      const FY = Y + Hd - 24, onde = this._onde, q = m.quando || (onde && onde.quando);
      if (!feita || m.repete) {
        let sl = '', sc2 = '#6a6078';
        if (q) { const [s2, c] = SELO[q], ok = seloOk(q); sl = s2 + (ok ? ' (agora!)' : ''); if (ok) sc2 = c; }
        const cab = Math.floor((Wd - 16 - (sl ? [...sl].length * 6 + 8 : 0)) / 6);
        let ond = 'Onde: ' + (onde ? nomeMapa(onde.map) : m.cap); if ([...ond].length > cab) ond = [...ond].slice(0, cab - 1).join('') + '.';
        txt(ond, X + 8, FY - 22, { col: '#a8a0b8' });
        if (sl) txt(sl, X + Wd - 8, FY - 22, { align: 'right', col: sc2 });
        if (m.recompensa) txt('Recompensa: ' + m.recompensa, X + 8, FY - 11, { col: '#c8b070' });
      } else txt(m.recompensa && m.recompensa !== '?' ? 'Concluída. Recompensa: ' + m.recompensa : 'Concluída.', X + 8, FY - 11, { col: '#5aa870', w: Math.floor((Wd - 16) / 6) });
      const BW = Wd - 70, pr = feita ? 1 : a.f / a.n;
      bx.fillStyle = '#05030a'; bx.fillRect(X + 8, FY + 4, BW, 6); bx.fillStyle = cor; bx.fillRect(X + 8, FY + 4, Math.round(BW * pr), 6); bx.fillStyle = 'rgba(255,255,255,0.25)'; bx.fillRect(X + 8, FY + 4, Math.round(BW * pr), 1);
      txt(m.repete ? `${a.f}/${a.n}` : feita ? 'completa' : `${a.f}/${a.n} etapas`, X + Wd - 8, FY + 1, { align: 'right', col: '#a8a0b8' });
      bx.globalAlpha = 1;
    }
  };
  return openWin(w);
}
