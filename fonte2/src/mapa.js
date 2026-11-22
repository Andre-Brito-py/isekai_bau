// ================= MAPA E MISSÕES (menu > Mapa) =================
// Duas abas: AQUI (o mapa do lugar atual, desenhado tile a tile, com saídas, Marcos, baús fechados, você e as
// missões) e MUNDO (as regiões ligadas por estradas). A missão principal é um "!" dourado; as opcionais, um "?" azul.
// Se a missão é em outro mapa, o marcador vai na SAÍDA que leva até lá (busca pelas portas e ligações).
// Missões com horário mostram o selo (só de dia / só à noite / ao amanhecer): o relógio também é parte do mapa.
const LIGA_EXTRA = {
  estrada: [[39, 11, 'auren']], auren: [[35, 12, 'festival'], [8, 19, 'galerias1'], [0, 15, 'estrada']],
  festival: [[39, 10, 'largo'], [0, 10, 'auren']], largo: [[16, 8, 'hosp1'], [31, 8, 'hosp2'], [0, 12, 'festival']],
  hosp2: [[2, 18, 'largo'], [26, 2, 'sala']], galerias1: [[1, 1, 'auren']], galerias2: [[14, 19, 'fundo']],
  serra: [[33, 3, 'candeia']], candeia: [[0, 19, 'serra'], [5, 8, 'ilda'], [16, 8, 'mina'], [26, 8, 'pensao']], mina: [[1, 17, 'candeia']]
};
const REGIAO_DE = { cais: 'velhagua', bazar: 'velhagua', praca: 'velhagua', taverna: 'velhagua', tobias: 'velhagua', rua1: 'velhagua', rua2: 'velhagua', poco: 'velhagua', igreja: 'velhagua',
  estrada: 'estrada', auren: 'auren', papelaria: 'auren', festival: 'auren', largo: 'auren', hosp1: 'auren', hosp2: 'auren', sala: 'auren', galerias1: 'auren', galerias2: 'auren', fundo: 'auren',
  serra: 'serra', candeia: 'candeia', ilda: 'candeia', mina: 'candeia' };
const REGIOES = [
  { id: 'velhagua', nm: 'Velhágua', x: 30, y: 80, ic: 'rio', vis: f => f.c2Chegada },
  { id: 'estrada', nm: 'Estrada dos Lampiões', x: 80, y: 48, ic: 'poste', vis: f => f.c3Init },
  { id: 'auren', nm: 'Auren, a capital', x: 134, y: 76, ic: 'cidade', vis: f => f.c3Chegou },
  { id: 'farol', nm: 'Farol', x: 114, y: 18, ic: 'farol', vis: f => f.c3Chegou, longe: true },
  { id: 'serra', nm: 'Serra', x: 180, y: 46, ic: 'serra', vis: f => f.c4P1Fim },
  { id: 'candeia', nm: 'Candeia', x: 204, y: 18, ic: 'vila', vis: f => f.c4Serra, al: 'right', lx: 191, ly: -6 }
];
const ESTRADAS = [['velhagua', 'estrada'], ['estrada', 'auren'], ['auren', 'serra'], ['serra', 'candeia'], ['auren', 'farol']];
{ const _lm = loadMap2; loadMap2 = function (id) { G.visto = G.visto || {}; G.visto[id] = 1; return _lm.apply(this, arguments); }; }

// ----- as missões, a partir das flags -----
function missoes() {
  const f = G.flags || {}, L = [];
  const P = (o) => L.push(o);
  const pos = (fn) => { try { return fn(); } catch (e) { return null; } };
  // PRINCIPAL (só a atual)
  if (f.c4Fim) P({ tit: 'O que vem depois', desc: 'Os canos sobem para o morro. Treine, cuide do grupo na enfermaria da Dalva e viaje pela garagem do Seu Jorge. (O Capítulo 5 está a caminho.)', map: 'interior', at: pos(() => [13, 6]) });
  else if (f.c4Chave) P({ tit: 'O turno da noite', desc: 'Entre na Mina de Candeia e chegue à capela, no alto da galeria. A grade só abre no TURNO DA NOITE.', map: 'mina', at: pos(() => POS4B.mina.chefe), quando: 'noite' });
  else if (f.c4Candeia) P({ tit: 'A professora que escreve', desc: 'Procure a Dona Ilda, na casa da janela roxa. Ela só recebe visita DE DIA e dorme cedo.', map: 'candeia', at: pos(() => POS4B.candeia.ildaDoor[0]), quando: 'dia' });
  else if (f.c4Serra) P({ tit: 'Atravessar a névoa', desc: 'Suba a Estrada da Serra até a entrada de Candeia, lá no alto, a leste.', map: 'serra', at: pos(() => POS4B.serra.cand[1]) });
  else if (f.c4P1Fim) P({ tit: 'Subir a serra', desc: 'O Dito foi "transferido" para Candeia. O Seu Jorge espera no Largo do Hospital com o 31.', map: 'largo', at: [12, 13] });
  else if (f.c4Relogio) P({ tit: 'Os papéis do diretor', desc: 'Vasculhe o arquivo e a mesa da Sala do Diretor.', map: 'sala', at: pos(() => POS4.sala.mesa) });
  else if (f.c4Noite) P({ tit: 'A Ala do Descanso', desc: 'Passe pela ronda sem ser visto e chegue à Sala do Diretor, no fundo da ala.', map: 'hosp2', at: pos(() => POS4.hosp2.salaDoor[0]), quando: 'noite' });
  else if (f.c4Hosp) P({ tit: 'Pela lavanderia', desc: 'A lavanderia nos fundos do hospital sobe para a Ala do Descanso. Vá À NOITE, quando só a ronda está acordada.', map: 'largo', at: pos(() => POS4.largo.lavDoor), quando: 'noite' });
  else if (f.c4Init) P({ tit: 'A Casa de Saúde', desc: 'Entre no hospital do Largo com o rosto humano, DE DIA, horário de visita, e fale com a Irmã Dalva.', map: 'hosp1', at: pos(() => POS4.hosp1.dalva), quando: 'dia' });
  else if (f.c3Mae && !f.c3Fim) P({ tit: 'A lanterna do Dito', desc: 'Pegue a lanterna que sobrou no fundo do Coração da Fuligem.', map: 'fundo', at: pos(() => POS3.fundo.lanterna) });
  else if (f.c3P1Fim) P(f.c3TicoGrade ? { tit: 'Descer às galerias', desc: 'Desça pelas Galerias de Fuligem até o fundo, onde a coisa morna respira.', map: 'fundo', at: pos(() => POS3.fundo.chefe) }
    : { tit: 'O bueiro', desc: 'O Tico está na grade do bueiro, no Bairro Baixo. Algo respira lá embaixo.', map: 'auren', at: [9, 19] });
  else if (f.c3Noite1) P({ tit: 'O discurso', desc: 'Chegue à frente do palco na Avenida do Festival.', map: 'festival', at: pos(() => POS3.festival.frente[1]), quando: 'noite' });
  else if (f.c3Grim) P({ tit: 'A noite do Festival', desc: 'Siga para a Avenida do Festival, no leste do Bairro Baixo.', map: 'auren', at: pos(() => POS3.auren.festDoor[0]) });
  else if (f.c3Iolanda) {
    if (!f.c3Fuligem) P({ tit: 'Fuligem de poste', desc: 'O Tico, o limpa-chaminé, tem fuligem. Ele quer ajuda com o telhado.', map: 'auren', at: pos(() => POS3.auren.tico) });
    else if (!f.c3Oleo) P({ tit: 'Óleo de lamparina', desc: 'Um Pavio que acende os postes do bairro tem óleo de sobra.', map: 'auren', at: pos(() => POS3.auren.pavio) });
    else P({ tit: 'Escrever', desc: 'Volte à papelaria e use a mesa de escrever.', map: 'papelaria', at: pos(() => POS3.papelaria.mesa) });
  }
  else if (f.c3Chegou) P({ tit: 'A papelaria', desc: 'Procure a papelaria do Bairro Baixo. Dizem que a dona entende de tinta que escreve sozinha.', map: 'papelaria', at: pos(() => POS3.papelaria.iolanda) });
  else if (f.c3Rainha) P({ tit: 'A capital', desc: 'Siga até o fim da Estrada dos Lampiões. Auren está logo depois.', map: 'estrada', at: pos(() => POS3.estrada.saida[0]) });
  else if (f.c3Init) P({ tit: 'A Mariposa-Rainha', desc: 'Algo enorme pousou no último poste da estrada. Acenda os postes pelo caminho.', map: 'estrada', at: pos(() => POS3.estrada.rainha) });
  else if (f.c2Boss) P({ tit: 'O sino', desc: 'Volte para a praça. O sino tem algo a dizer.', map: 'praca', at: pos(() => POS2.praca.celeste) });
  else if (f.boiar) P({ tit: 'O fundo do poço', desc: 'Atravesse o Bairro Afogado (Rua Submersa, depois o Mercado) até o poço.', map: 'poco', at: pos(() => POS2.poco.gatilho[2]) });
  else if (f.celeste) P({ tit: 'A escadaria', desc: 'Abra o cadeado da escadaria da igreja, na praça.', map: 'praca', at: pos(() => POS2.praca.escada[0]) });
  else if (f.c2Chegada) P({ tit: 'A Irmã Celeste', desc: 'Fale com a moça que toca o sininho na Praça do Sino.', map: 'praca', at: pos(() => POS2.praca.celeste) });
  if (L.length) L[0].tipo = 'main';
  // OPCIONAIS
  const op = (o) => L.push(Object.assign({ tipo: 'side' }, o));
  if (f.c4Serra && !f.b_serra_m) op({ tit: 'Riscado na pedra', desc: '"Ao nascer do sol, olhe pra baixo." O mirante da serra só mostra o que guarda AO AMANHECER (5h às 8h30).', map: 'serra', at: pos(() => POS4B.serra.mirante), quando: 'amanhecer' });
  if (f.c4Candeia && !f.c4Poco) op({ tit: 'O poço que desceu', desc: 'Os sonâmbulos cochicham que o poço da praça brilha lá no fundo... DE NOITE.', map: 'candeia', at: pos(() => POS4B.candeia.poco), quando: 'noite' });
  if (f.c4Candeia && !f.c4Fim) op({ tit: 'Os que andam dormindo', desc: 'De noite os moradores de Candeia andam até o poço e cochicham pistas. De dia, só ficam parados.', map: 'candeia', at: pos(() => POS4B.candeia.parados[2]), quando: 'noite' });
  if (f.c4Fim) op({ tit: 'Enfermaria', desc: 'A Irmã Dalva trata o grupo de graça e vende frascos com selo mais baratos.', map: 'interior', at: [12, 4] });
  if (f.c2Chegada && f.quadroTut) op({ tit: 'Quadro de pedidos', desc: 'O quadro da Taverna do Remo Torto sempre tem trabalho que paga em cobres.', map: 'taverna', at: pos(() => POS2.taverna.quadro) });
  return L.filter(m => m.at);
}

// ----- caminho: qual saída deste mapa leva até o mapa da missão -----
function saidasDe(id) {
  const m = MAPS2[id], S = [];
  if (!m) return S;
  for (const e of m.ents || []) if (e.t === 'door' && e.to) S.push([e.x, e.y, e.to]);
  for (const s of LIGA_EXTRA[id] || []) if (MAPS2[s[2]]) S.push(s);
  return S;
}
function rotaPara(de, para) {
  if (de === para) return null;
  if (de === 'interior') return { saida: (POS3.interior.saida || [[6, 9]])[0], prox: (G.baseVolta || {}).map || 'auren' };
  const prev = { [de]: null }, q = [de];
  while (q.length) {
    const a = q.shift(); if (a === para) break;
    for (const [x, y, to] of saidasDe(a)) if (!(to in prev)) { prev[to] = [a, x, y]; q.push(to); }
  }
  if (!(para in prev)) return null;
  let n = para, hop = null;
  while (prev[n] && prev[n][0] !== de) n = prev[n][0];
  hop = prev[n]; return hop ? { saida: [hop[1], hop[2]], prox: n } : null;
}
const nomeMapa = (id) => (MAPS2[id] && MAPS2[id].name) || '???';
const SELO = { dia: ['DE DIA', '#ffd060'], noite: ['À NOITE', '#9ab0ff'], amanhecer: ['AO AMANHECER', '#ffb0a0'] };
function seloOk(q) { const h = hora(); return q === 'dia' ? h >= 7 * 60 && h < 18 * 60 : q === 'noite' ? ehNoite() : q === 'amanhecer' ? h >= 5 * 60 && h <= 8 * 60 + 30 : true; }

// ----- ruído (para o relevo e as texturas) -----
function hsh(x, y, k) { let h = (x * 374761393 + y * 668265263 + k * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y, sc, k) { const X = Math.floor(x / sc), Y = Math.floor(y / sc), fx = x / sc - X, fy = y / sc - Y, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy); const a = hsh(X, Y, k), b = hsh(X + 1, Y, k), c = hsh(X, Y + 1, k), d = hsh(X + 1, Y + 1, k); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
const fbm = (x, y, k) => 0.5 * vnoise(x, y, 24, k) + 0.3 * vnoise(x, y, 11, k + 1) + 0.2 * vnoise(x, y, 5, k + 2);
const mix = (c1, c2, p) => { const A = parseInt(c1.slice(1), 16), B = parseInt(c2.slice(1), 16); const r = (A >> 16) + ((B >> 16) - (A >> 16)) * p, g = ((A >> 8) & 255) + (((B >> 8) & 255) - ((A >> 8) & 255)) * p, b = (A & 255) + ((B & 255) - (A & 255)) * p; return '#' + ((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).slice(1); };

// ----- mapa local: tiles com textura, paredes com face (vista 3/4) e sombras -----
const PISO = { grama: ['#2f5a32', '#3e6a3c', '#4f7f48'], terra: ['#5e4630', '#7a5e3a', '#8e7048'], pedra: ['#4c4a56', '#6c6a74', '#86848e'], tab: ['#5a3e26', '#7a5634', '#8e6a42'], tabV: ['#4e3622', '#6a4a2c', '#7e5a38'],
  lodo: ['#3a3e2a', '#4a5034', '#5a6040'], escada: ['#6a5a40', '#8a7a5a', '#a08e6a'], chaoF: ['#3a3038', '#4a4048', '#5e5460'], terra2: ['#5e4630', '#7a5e3a', '#8e7048'] };
const MINI_C = new Map();
function miniMapa(id, s) {
  const m = MAPS2[id]; if (!m) return null;
  const key = id + ':' + s; if (MINI_C.has(key)) return MINI_C.get(key);
  const w = m.rows[0].length, h = m.rows.length, c = mk(w * s, h * s), x = c.getContext('2d'), mm = Object.assign({ w, h }, m);
  const TT = (i, j) => tileOf(mm, i, j), sol = (i, j) => { const T = TT(i, j); return !!T.solid || propSolid(m, i, j); }, agua = (i, j) => !!TT(i, j).water;
  const px = (i, j, a, b, cw, ch, col) => { x.fillStyle = col; x.fillRect(i * s + a, j * s + b, cw, ch); };
  const face = Math.max(2, Math.round(s * 0.45));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const T = TT(i, j), r = (k) => hsh(i, j, k);
    if (sol(i, j)) {
      const prop = !T.solid, escuro = T.t === 'escuro';
      const topo = escuro ? ['#08060c', '#0c0a12', '#100e18'] : prop ? ['#4a2e2a', '#5e3a32', '#76503e'] : T.t === 'muro' ? ['#2a2232', '#3a3044', '#4c4058'] : ['#1c161e', '#2a2228', '#3a3036'];
      px(i, j, 0, 0, s, s, topo[1]);
      if (!escuro) { for (let k = 0; k < 2; k++) px(i, j, Math.floor(r(k) * s), Math.floor(r(k + 5) * s), 1, 1, topo[r(k + 9) > 0.5 ? 2 : 0]); if (prop && s >= 5) { for (let y2 = 1; y2 < s; y2 += 2) px(i, j, 0, y2, s, 1, topo[0]); } }
      if (!sol(i, j + 1) && !escuro) { // face da parede virada para o sul
        const fc = prop ? '#3a2420' : T.t === 'muro' ? '#1e1828' : '#140e14';
        px(i, j, 0, s - face, s, face, fc); px(i, j, 0, s - face, s, 1, topo[2]);
        if (prop && hsh(i, j, 3) > 0.6 && s >= 5) px(i, j, (s >> 1) - 1, s - face + 1, 2, Math.max(1, face - 2), ehNoite() ? '#ffd060' : '#2a3a4a');
        else if (T.t === 'muro' && s >= 6) for (let k = 2; k < s; k += 3) px(i, j, k, s - face + 1, 1, face - 1, '#140e1c');
      }
      if (!escuro && !sol(i, j - 1)) px(i, j, 0, 0, s, 1, topo[2]);
      continue;
    }
    if (agua(i, j)) {
      const deep = agua(i - 1, j) && agua(i + 1, j) && agua(i, j - 1) && agua(i, j + 1);
      px(i, j, 0, 0, s, s, deep ? '#234780' : '#2c5a92');
      if (r(1) > 0.5) px(i, j, Math.floor(r(2) * (s - 2)), Math.floor(r(3) * s), 2, 1, '#4a7ab8');
      if (!agua(i, j - 1)) px(i, j, 0, 0, s, 1, '#8ab8e8');
      continue;
    }
    const P = PISO[T.t] || ['#4a4856', '#5a5866', '#6a6876'];
    px(i, j, 0, 0, s, s, P[1]);
    if (T.t === 'pedra' || T.t === 'chaoF') { const o = (j % 2) * (s >> 1); px(i, j, 0, s - 1, s, 1, P[0]); px(i, j, (o + (s >> 1)) % s, 0, 1, s, P[0]); px(i, j, 1, 1, 1, 1, P[2]); }
    else if (T.t === 'tab' || T.t === 'tabV') { for (let y2 = 2; y2 < s; y2 += 3) px(i, j, 0, y2, s, 1, P[0]); px(i, j, Math.floor(r(4) * s), 0, 1, s, P[0]); }
    else if (T.t === 'grama') { for (let k = 0; k < 3; k++) px(i, j, Math.floor(r(k) * s), Math.floor(r(k + 4) * s), 1, 1, P[r(k + 8) > 0.4 ? 2 : 0]); if (r(12) > 0.8 && s >= 5) { px(i, j, 2, s - 3, 1, 2, P[2]); px(i, j, 3, s - 4, 1, 3, P[2]); } }
    else for (let k = 0; k < 3; k++) px(i, j, Math.floor(r(k) * s), Math.floor(r(k + 4) * s), 1, 1, P[r(k + 8) > 0.5 ? 2 : 0]);
    // sombra das paredes ao norte e a oeste
    x.fillStyle = 'rgba(0,0,0,0.32)';
    if (sol(i, j - 1)) x.fillRect(i * s, j * s, s, Math.max(1, s >> 2));
    if (sol(i - 1, j)) x.fillRect(i * s, j * s, Math.max(1, s >> 3) + 1, s);
    if (agua(i, j + 1)) { x.fillStyle = '#1a2230'; x.fillRect(i * s, j * s + s - 1, s, 1); }
  }
  MINI_C.set(key, c); return c;
}

// ----- ícones -----
function marcaMissao(x, y, tipo, t, sel) {
  const bob = Math.round(Math.sin(t * 0.12) * 1.5), cor = tipo === 'main' ? '#ffd060' : '#7ad8ff', esc = tipo === 'main' ? '#5a3a00' : '#0a3a5a';
  if (sel) { const r = 5 + (t * 0.25) % 8; bx.globalAlpha = 1 - ((t * 0.25) % 8) / 8; bx.strokeStyle = cor; bx.lineWidth = 1; bx.beginPath(); bx.arc(x + 0.5, y + 0.5, r, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1; }
  const yy = y - 10 + bob;
  bx.fillStyle = '#000'; bx.fillRect(x - 4, yy - 1, 9, 11); bx.fillRect(x - 5, yy, 11, 9);
  bx.fillStyle = cor; bx.fillRect(x - 3, yy, 7, 9); bx.fillRect(x - 4, yy + 1, 9, 7);
  bx.fillStyle = esc;
  if (tipo === 'main') { bx.fillRect(x, yy + 1, 1, 5); bx.fillRect(x, yy + 7, 1, 1); }
  else { bx.fillRect(x - 1, yy + 1, 3, 1); bx.fillRect(x + 2, yy + 2, 1, 2); bx.fillRect(x, yy + 4, 1, 2); bx.fillRect(x, yy + 7, 1, 1); }
  bx.fillStyle = cor; bx.fillRect(x, yy + 10, 1, 2);
}
function iconeRegiao(ic, x, y, on) {
  const P = (c, a, b, w, h) => { bx.fillStyle = c; bx.fillRect(x + a, y + b, w, h); };
  const d = on ? 1 : 0.45; bx.globalAlpha = d;
  if (ic === 'rio') { P('#3a2a24', -8, -3, 6, 5); P('#5a3a30', -9, -5, 8, 2); P('#3a2a24', 1, -4, 5, 6); P('#6a4a3a', 0, -6, 7, 2); P('#c8a040', -1, -10, 1, 4); P('#2c5f96', -11, 3, 22, 3); P('#5a8fc8', -9, 4, 3, 1); P('#5a8fc8', 2, 4, 4, 1); }
  else if (ic === 'poste') { for (const k of [-7, 0, 7]) { P('#3a3a44', k, -6, 1, 9); P(on ? '#ffd060' : '#6a6a70', k - 1, -8, 3, 2); } P('#7a5e3a', -10, 3, 21, 2); }
  else if (ic === 'cidade') { P('#4a4a5a', -11, -4, 5, 8); P('#5a5a6a', -6, -9, 6, 13); P('#4a4a5a', 0, -6, 5, 10); P('#5a5a6a', 5, -3, 6, 7); P('#ffd060', -4, -7, 1, 1); P('#ffd060', -2, -4, 1, 1); P('#ffd060', 2, -3, 1, 1); P('#ffd060', 7, -1, 1, 1); P('#3a3040', -12, 4, 24, 1); }
  else if (ic === 'farol') { P('#3a3a44', -6, 2, 13, 3); P('#d8d0c0', -2, -9, 5, 11); P('#a82a2a', -2, -6, 5, 2); P('#a82a2a', -2, -1, 5, 2); P('#2a2a34', -3, -12, 7, 3); P('#6a6a70', -1, -11, 3, 1); }
  else if (ic === 'serra') { bx.fillStyle = '#4a5a6a'; bx.beginPath(); bx.moveTo(x - 12, y + 4); bx.lineTo(x - 4, y - 8); bx.lineTo(x + 2, y + 1); bx.lineTo(x + 6, y - 5); bx.lineTo(x + 12, y + 4); bx.fill(); P('#e0e4ee', -5, -8, 2, 2); P('#e0e4ee', 5, -5, 2, 1); P('rgba(220,226,240,0.5)', -12, 0, 24, 2); }
  else if (ic === 'vila') { P('#5a5060', -9, -3, 6, 6); P('#3a4050', -10, -5, 8, 2); P('#6a5a5a', -1, -4, 7, 7); P('#4a3a3a', -2, -6, 9, 2); P('#2a2228', 6, -1, 4, 4); P(on && G.flags.c4Fim ? '#ffd060' : '#2a2a34', 2, -1, 1, 1); }
  bx.globalAlpha = 1;
}

// ----- a tela -----
function telaMapa() {
  let aba = 0, sel = 0, t = 0;
  const L = missoes();
  const w = {
    type: 'mapa',
    update() {
      t++;
      if (btnp('left') || btnp('right')) { aba = 1 - aba; sfx('select'); }
      if (L.length && navp('up')) { sel = (sel + L.length - 1) % L.length; sfx('move'); }
      if (L.length && navp('down')) { sel = (sel + 1) % L.length; sfx('move'); }
      if (btnp('b') || btnp('a') || btnp('menu')) { sfx('cancel'); closeWin(this); }
    },
    draw() {
      const X = 4, Y = 4, Wd = 232, Hd = 232;
      TQ.length = 0; // o texto do HUD por baixo não atravessa a tela do mapa
      bx.globalAlpha = 0.75; bx.fillStyle = '#05030a'; bx.fillRect(-400, -10, 1200, 300); bx.globalAlpha = 1;
      bx.fillStyle = '#0e0a1a'; bx.fillRect(X + 2, Y + 2, Wd - 4, Hd - 4); box(X, Y, Wd, Hd);
      // abas
      ['AQUI', 'MUNDO'].forEach((nm, j) => { const x = X + 8 + j * 52, on = j === aba; bx.fillStyle = on ? UIC.accent : 'rgba(143,227,216,0.18)'; bx.fillRect(x, Y + 6, 48, 14); if (!on) { bx.fillStyle = '#0e0a1a'; bx.fillRect(x + 1, Y + 7, 46, 12); } txt(nm, x + 24, Y + 7, { align: 'center', col: on ? '#ffffff' : '#8fe3d8' }); });
      bx.fillStyle = UIC.line; const o = Math.floor(FRAME / 14) % 2; bx.fillRect(X + 112 + o, Y + 10, 1, 5); bx.fillRect(X + 111 + o, Y + 11, 1, 3); bx.fillRect(X + 110 + o, Y + 12, 1, 1);
      const h = hora(), hh = String(Math.floor(h / 60) % 24).padStart(2, '0'), mm = String(Math.floor(h % 60)).padStart(2, '0');
      txt((ehNoite() ? 'noite ' : 'dia ') + hh + ':' + mm, X + Wd - 8, Y + 7, { align: 'right', col: ehNoite() ? '#9ab0ff' : '#ffd060' });
      // área do mapa
            const AX = X + 6, AY = Y + 24, AW = Wd - 12, AH = 104;
      bx.fillStyle = '#07050c'; bx.fillRect(AX, AY, AW, AH); bx.strokeStyle = 'rgba(143,227,216,0.35)'; bx.lineWidth = 1; bx.strokeRect(AX + 0.5, AY + 0.5, AW - 1, AH - 1);
      const M = L[sel];
      if (aba === 0) desenhaAqui(AX, AY, AW, AH, L, sel, t); else desenhaMundo(AX, AY, AW, AH, L, sel, t);
      // missões
      const LY = AY + AH + 6;
      txt('MISSÕES', X + 8, LY, { col: UIC.line });
      if (!L.length) { txt('Nenhuma missão agora. Explore!', X + 8, LY + 14, { col: '#8a8099' }); return; }
      const vis = 3, sc = Math.max(0, Math.min(sel - 1, L.length - vis));
      for (let i = 0; i < vis && i + sc < L.length; i++) {
        const k = i + sc, m = L[k], yy = LY + 13 + i * 12, on = k === sel;
        if (on) { bx.fillStyle = UIC.sel; bx.fillRect(X + 4, yy - 1, Wd - 8, 12); }
        bx.fillStyle = m.tipo === 'main' ? '#ffd060' : '#7ad8ff'; bx.fillRect(X + 8, yy + 1, 7, 9); bx.fillStyle = '#0e0a1a'; if (m.tipo === 'main') { bx.fillRect(X + 11, yy + 2, 1, 5); bx.fillRect(X + 11, yy + 8, 1, 1); } else { bx.fillRect(X + 10, yy + 2, 3, 1); bx.fillRect(X + 12, yy + 3, 1, 2); bx.fillRect(X + 11, yy + 5, 1, 2); bx.fillRect(X + 11, yy + 8, 1, 1); }
        txt(m.tit, X + 18, yy, { col: on ? '#ffffff' : '#c8d4dc' });
        if (m.quando) { const [s, c] = SELO[m.quando], ok = seloOk(m.quando); txt(s, X + Wd - 8, yy, { align: 'right', col: ok ? c : '#6a6078' }); }
      }
      if (L.length > vis) txt(`${sel + 1}/${L.length}`, X + Wd - 8, LY, { align: 'right', col: '#8a8099' });
      // descrição da selecionada
      const DY = LY + 13 + vis * 12 + 2;
      bx.fillStyle = 'rgba(143,227,216,0.25)'; bx.fillRect(X + 6, DY - 2, Wd - 12, 1);
      let d = M.desc; const onde = M.map === W2.id ? '' : ' (' + nomeMapa(M.map) + ')';
      if (M.quando && !seloOk(M.quando)) d += ' (Agora não é a hora.)';
      txt(d + onde, X + 8, DY + 1, { w: Math.floor((Wd - 16) / 6), col: '#b8aecb', lh: 10 });
    }
  };
  return openWin(w);
}
function sombraChao(x, y, rw, rh, a = 0.45) { bx.globalAlpha = a; bx.fillStyle = '#000'; bx.beginPath(); bx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1; }
function placa(nm, x, y, col, al) {
  const w = [...nm].length * 6 + 6, x0 = Math.round(al === 'right' ? x - w : al === 'left' ? x : x - w / 2);
  bx.fillStyle = 'rgba(0,0,0,0.5)'; bx.fillRect(x0 + 1, y + 1, w, 11);
  bx.fillStyle = 'rgba(14,10,24,0.85)'; bx.fillRect(x0, y, w, 11);
  bx.fillStyle = 'rgba(232,210,160,0.35)'; bx.fillRect(x0, y, w, 1); bx.fillRect(x0, y + 10, w, 1);
  txt(nm, x0 + 3, y - 0.5, { col });
}
function desenhaAqui(AX, AY, AW, AH, L, sel, t) {
  const id = W2.id, m = MAPS2[id]; if (!m) return;
  const VX = AX + 2, VY = AY + 13, VW = AW - 4, VH = AH - 15;
  const tw0 = m.rows[0].length, th0 = m.rows.length;
  const s = Math.max(5, Math.min(9, Math.floor(Math.min(VW / tw0, VH / th0))));
  const img = miniMapa(id, s); if (!img) return;
  const mw = img.width, mh = img.height;
  const ox = Math.round(mw <= VW ? VX + (VW - mw) / 2 : VX - clamp(W2.x * s + s / 2 - VW / 2, 0, mw - VW));
  const oy = Math.round(mh <= VH ? VY + (VH - mh) / 2 : VY - clamp(W2.y * s + s / 2 - VH / 2, 0, mh - VH));
  placa(m.name, AX + 3, AY + 1, '#ffffff', 'left');
  bx.save(); bx.beginPath(); bx.rect(VX, VY - 12, VW, VH + 12); bx.clip();
  // o mapa "flutua" sobre a mesa: sombra projetada e moldura
  bx.fillStyle = 'rgba(0,0,0,0.55)'; bx.fillRect(ox + 3, oy + 4, mw, mh);
  bx.imageSmoothingEnabled = false; bx.drawImage(img, ox, oy);
  bx.strokeStyle = 'rgba(232,210,160,0.4)'; bx.lineWidth = 1; bx.strokeRect(ox - 0.5, oy - 0.5, mw + 1, mh + 1);
  const T = (x, y) => [ox + x * s + (s >> 1), oy + y * s + (s >> 1)];
  // água viva: brilho correndo
  if (m.rows.some(r => /[~<>v^]/.test(r))) for (let j = 0; j < th0; j++) for (let i = 0; i < tw0; i++) if (tileOf(Object.assign({ w: tw0, h: th0 }, m), i, j).water && ((i * 7 + j * 3 + (t >> 3)) % 11) === 0) { bx.fillStyle = 'rgba(200,230,255,0.7)'; bx.fillRect(ox + i * s + 1, oy + j * s + (s >> 1), Math.max(2, s - 3), 1); }
  // escuridão: só as luzes e você enxergam
  if (m.escuro) {
    const C = desenhaAqui._c || (desenhaAqui._c = mk(240, 140)), c = C.getContext('2d');
    c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, 240, 140); c.fillStyle = 'rgba(4,2,8,0.72)'; c.fillRect(0, 0, VW, VH);
    c.globalCompositeOperation = 'destination-out';
    const furo = (x, y, r) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); };
    for (const [lx, ly] of (LUZ_GAL[id] || [])) furo(ox - VX + lx * s + s / 2, oy - VY + ly * s + s / 2, s * 3.2 + Math.sin(t * 0.1 + lx) * 1.5);
    furo(ox - VX + W2.x * s + s / 2, oy - VY + W2.y * s + s / 2, s * 2.6);
    bx.drawImage(C, 0, 0, VW, VH, VX, VY, VW, VH);
    for (const [lx, ly] of (LUZ_GAL[id] || [])) { const [qx, qy] = T(lx, ly); bx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 0.2 + lx); bx.fillStyle = '#ffd060'; bx.fillRect(qx - 1, qy - 1, 2, 2); bx.globalAlpha = 1; }
  }
  // saídas: um portal âmbar pulsando
  for (const [x, y] of saidasDe(id)) { const [px, py] = T(x, y), a = 0.35 + 0.25 * Math.sin(t * 0.15 + x); bx.globalAlpha = a; bx.fillStyle = '#ffd890'; bx.fillRect(px - 3, py - 3, 7, 7); bx.globalAlpha = 1; bx.fillStyle = '#2a1a08'; bx.fillRect(px - 2, py - 2, 5, 5); bx.fillStyle = '#ffe8a0'; bx.fillRect(px - 1, py - 1, 3, 3); }
  // Marcos e baús fechados (com sombra no chão)
  for (const e of m.ents || []) {
    if (e.gone && e.gone()) continue;
    const [px, py] = T(e.x, e.y);
    if (e.t === 'marco') { sombraChao(px + 1, py + 2, 3, 1.2); const g = Math.sin(t * 0.1) * 0.5 + 0.5; bx.globalAlpha = 0.3 + g * 0.3; bx.fillStyle = '#8fe3d8'; bx.fillRect(px - 2, py - 6, 5, 8); bx.globalAlpha = 1; bx.fillStyle = '#3a4a5a'; bx.fillRect(px - 1, py - 5, 3, 7); bx.fillStyle = '#5a6a7a'; bx.fillRect(px - 1, py - 5, 1, 7); bx.fillStyle = '#8fe3d8'; bx.fillRect(px, py - 3, 1, 2); }
    else if (e.t === 'chest' && !G.flags['b_' + id + '_' + e.id]) { sombraChao(px + 1, py + 2, 3, 1.2); bx.fillStyle = '#1a0e06'; bx.fillRect(px - 3, py - 3, 7, 6); bx.fillStyle = '#8a5a24'; bx.fillRect(px - 2, py - 1, 5, 3); bx.fillStyle = '#c88a30'; bx.fillRect(px - 2, py - 2, 5, 1); bx.fillStyle = '#ffd060'; bx.fillRect(px, py - 1, 1, 2); if (((t >> 4) + e.x) % 6 === 0) { bx.fillStyle = '#ffffff'; bx.fillRect(px + 2, py - 3, 1, 1); } }
  }
  // você: um baúzinho
  const [vx, vy] = T(W2.x, W2.y), bob = Math.round(Math.sin(t * 0.2));
  sombraChao(vx + 1, vy + 3, 4, 1.5, 0.55);
  const r1 = 5 + (t * 0.3) % 6; bx.globalAlpha = 1 - ((t * 0.3) % 6) / 6; bx.strokeStyle = '#ff7aa8'; bx.beginPath(); bx.arc(vx + 0.5, vy + 0.5, r1, 0, Math.PI * 2); bx.stroke(); bx.globalAlpha = 1;
  bx.fillStyle = '#000'; bx.fillRect(vx - 4, vy - 4 + bob, 9, 8); bx.fillStyle = '#7a4a22'; bx.fillRect(vx - 3, vy - 1 + bob, 7, 4); bx.fillStyle = '#a8683a'; bx.fillRect(vx - 3, vy - 3 + bob, 7, 2); bx.fillStyle = '#ffd060'; bx.fillRect(vx, vy - 1 + bob, 1, 2); bx.fillStyle = '#ff7aa8'; bx.fillRect(vx - 3, vy - 3 + bob, 7, 1);
  const dd = DIR2[W2.dir] || [0, 1]; bx.fillStyle = '#ffffff'; bx.fillRect(vx + dd[0] * 6, vy + dd[1] * 6 + bob, 1, 1); bx.fillRect(vx + dd[0] * 5 - (dd[1] ? 1 : 0), vy + dd[1] * 5 - (dd[0] ? 1 : 0) + bob, dd[1] ? 3 : 1, dd[0] ? 3 : 1);
  // missões: aqui mesmo, ou na saída que leva até lá
  L.forEach((M, i) => {
    let p = null;
    if (M.map === id) p = M.at;
    else { const r = rotaPara(id, M.map); if (r) p = r.saida; }
    if (!p) return;
    let [px, py] = T(p[0], p[1]);
    px = clamp(px, VX + 6, VX + VW - 7); py = clamp(py, VY + 11, VY + VH - 2); // fora da vista: fica na borda, apontando
    sombraChao(px + 1, py + 1, 3, 1);
    marcaMissao(px, py, M.tipo, t + i * 7, i === sel);
  });
  // vinheta
  for (let k = 0; k < 6; k++) { bx.fillStyle = `rgba(0,0,0,${0.09 * (6 - k) / 6})`; bx.fillRect(VX, VY + k, VW, 1); bx.fillRect(VX, VY + VH - 1 - k, VW, 1); bx.fillRect(VX + k, VY, 1, VH); bx.fillRect(VX + VW - 1 - k, VY, 1, VH); }
  bx.restore();
  const M = L[sel];
  if (M && M.map !== id && rotaPara(id, M.map)) placa('rumo a ' + nomeMapa(M.map), AX + 4, AY + AH - 15, M.tipo === 'main' ? '#ffd060' : '#7ad8ff', 'left');
}

// ----- MUNDO: relevo pintado (altura, luz do noroeste, curvas de nível, rio, mar, matas, névoa do desconhecido) -----
const RIO = [[178, 38], [158, 52], [126, 62], [98, 70], [66, 80], [36, 87], [10, 94], [-6, 100]];
function distRio(x, y) { let d = 1e9; for (let k = 0; k < RIO.length - 1; k++) { const [ax, ay] = RIO[k], [bx2, by2] = RIO[k + 1], dx = bx2 - ax, dy = by2 - ay, p = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1); d = Math.min(d, Math.hypot(x - ax - dx * p, y - ay - dy * p)); } return d; }
function alturaMundo(x, y) {
  let h = 0.2 + 0.18 * fbm(x, y, 3);
  for (const [cx, cy, r, a] of [[190, 24, 34, 0.5], [214, 6, 22, 0.42], [154, 12, 20, 0.28], [204, 50, 16, 0.2], [114, 20, 12, 0.34]]) h += a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r)) * (0.7 + 0.6 * fbm(x * 1.7, y * 1.7, 9));
  const d = distRio(x, y); h -= 0.14 * Math.exp(-d * d / 90);
  return h;
}
const BANDAS = [[0.30, ['#24402c', '#2e5236', '#3a6442']], [0.42, ['#364a30', '#45593a', '#556c44']], [0.55, ['#463c34', '#5a4e42', '#6e6252']], [0.74, ['#403e4c', '#555464', '#6e6c7e']], [9, ['#8e94a8', '#b8bccc', '#e4e6f0']]];
const MUNDO_C = new Map();
function terrenoMundo(AW, AH, vis, R, noite) {
  const key = AW + 'x' + AH + ':' + REGIOES.map(r => vis(r) ? 1 : 0).join('') + (noite ? 'n' : 'd');
  if (MUNDO_C.has(key)) return MUNDO_C.get(key);
  const c = mk(AW, AH), x = c.getContext('2d'), H = [], BI = [], AG = [];
  for (let j = -1; j <= AH; j++) for (let i = -1; i <= AW; i++) H[(j + 1) * (AW + 2) + i + 1] = alturaMundo(i, j);
  const h = (i, j) => H[(j + 1) * (AW + 2) + i + 1];
  const mar = (i, j) => Math.hypot(i + 8, j - 120) < 34 + 6 * vnoise(i, j, 8, 4);
  for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) { AG[j * AW + i] = mar(i, j) ? 2 : distRio(i, j) < 1.6 + 0.6 * vnoise(i, j, 6, 5) ? 1 : 0; BI[j * AW + i] = BANDAS.findIndex(b => h(i, j) < b[0]); }
  const ag = (i, j) => i < 0 || j < 0 || i >= AW || j >= AH ? 0 : AG[j * AW + i], bi = (i, j) => BI[clamp(j, 0, AH - 1) * AW + clamp(i, 0, AW - 1)];
  // névoa: longe de toda região conhecida
  const visR = REGIOES.filter(vis);
  for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) {
    let col;
    const a = ag(i, j);
    if (a) {
      const borda = !ag(i - 1, j) || !ag(i + 1, j) || !ag(i, j - 1) || !ag(i, j + 1);
      col = a === 2 ? (borda ? '#7aa8d8' : mix('#163058', '#24497c', clamp((40 - Math.hypot(i + 8, j - 120)) / -20 + 1, 0, 1) * 0)) : (borda ? '#3a6aa4' : '#2a5590');
      if (a === 2 && !borda && Math.hypot(i + 8, j - 120) > 26) col = '#20457a';
      if (!borda && hsh(i, j, 21) > 0.93) col = '#5a8ac0';
    } else {
      const lit = (h(i - 1, j - 1) - h(i + 1, j + 1)) * 16, B = BANDAS[bi(i, j)][1];
      let k = lit > 0.28 ? 2 : lit < -0.28 ? 0 : 1;
      if (Math.abs(Math.abs(lit) - 0.28) < 0.12 && (i + j) % 2) k = 1;
      col = B[k];
      if (bi(i, j) !== bi(i + 1, j) || bi(i, j) !== bi(i, j + 1)) col = mix(col, '#000000', 0.35);
      if (ag(i + 1, j) || ag(i, j + 1) || ag(i - 1, j) || ag(i, j - 1)) col = mix(col, '#c8b88a', 0.35); // margem de areia
    }
    let fog = 1e9; for (const r of visR) fog = Math.min(fog, Math.hypot(i - r.x, (j - r.y) * 1.3));
    const fa = clamp((fog - 34) / 36, 0, 0.88) * (0.75 + 0.45 * fbm(i * 1.5, j * 2.2, 13));
    if (fa > 0) col = mix(col, noite ? '#2a2c40' : '#a8acbc', clamp(fa, 0, 0.9));
    if (noite) col = mix(col, '#080c24', 0.38);
    x.fillStyle = col; x.fillRect(i, j, 1, 1);
  }
  // matas: pinheirinhos com sombra, de cima para baixo (profundidade)
  for (let j = 2; j < AH - 2; j += 4) for (let i = 2; i < AW - 2; i += 4) {
    const xx = i + Math.floor(hsh(i, j, 31) * 3), yy = j + Math.floor(hsh(i, j, 32) * 3), hh = h(xx, yy);
    if (hh < 0.22 || hh > 0.5 || vnoise(xx, yy, 16, 7) < 0.6 || ag(xx, yy) || distRio(xx, yy) < 4) continue;
    if (REGIOES.some(r => Math.hypot(xx - r.x, yy - r.y) < 15)) continue;
    let fog = 1e9; for (const r of visR) fog = Math.min(fog, Math.hypot(xx - r.x, (yy - r.y) * 1.3)); if (fog > 60) continue;
    const dk = noite ? 0.4 : 0;
    x.fillStyle = mix('#0e1a10', '#000000', dk); x.fillRect(xx + 1, yy + 2, 3, 1);
    x.fillStyle = mix('#3a2a1a', '#000000', dk); x.fillRect(xx + 1, yy + 1, 1, 1);
    x.fillStyle = mix('#1e3a24', '#000000', dk); x.fillRect(xx, yy - 1, 3, 2);
    x.fillStyle = mix('#2e5634', '#000000', dk); x.fillRect(xx + 1, yy - 3, 1, 2); x.fillRect(xx, yy - 1, 1, 1);
    x.fillStyle = mix('#4e7c4a', '#000000', dk); x.fillRect(xx, yy - 2, 1, 1);
  }
  // estradas curvas, com sombra (as desconhecidas, tracejadas)
  for (const [a, b] of ESTRADAS) {
    const A = R[a], B = R[b]; if (!vis(A) && !vis(B)) continue;
    const on = vis(A) && vis(B), trilha = b === 'farol', mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y, cx = mx - dy * 0.18, cy = my + dx * 0.18, n = Math.ceil(Math.hypot(dx, dy) * 1.4);
    for (let k = 0; k <= n; k++) {
      const p = k / n, q = 1 - p, xx = Math.round(q * q * A.x + 2 * q * p * cx + p * p * B.x), yy = Math.round(q * q * A.y + 2 * q * p * cy + p * p * B.y);
      if (!on && (k >> 2) % 2) continue; if (trilha && k % 3 === 2) continue;
      x.fillStyle = 'rgba(10,6,2,0.55)'; x.fillRect(xx, yy + 1, 2, 1);
      x.fillStyle = trilha ? (noite ? '#3a3640' : '#6a6270') : (noite ? '#5a4a36' : '#9a7c54'); x.fillRect(xx, yy, 2, 1);
      if (!trilha && k % 4 === 0) { x.fillStyle = noite ? '#6a5a44' : '#c4a474'; x.fillRect(xx, yy, 1, 1); }
    }
  }
  MUNDO_C.set(key, c); return c;
}
function desenhaMundo(AX, AY, AW, AH, L, sel, t) {
  const f = G.flags || {}, noite = ehNoite();
  const R = Object.fromEntries(REGIOES.map(r => [r.id, r])), vis = r => !!r.vis(f);
  bx.save(); bx.beginPath(); bx.rect(AX + 1, AY + 1, AW - 2, AH - 2); bx.clip();
  bx.drawImage(terrenoMundo(AW, AH, vis, R, noite), AX, AY);
  // o rio corre: brilhos descendo
  for (let k = 0; k < RIO.length - 1; k++) { const [ax, ay] = RIO[k], [b2x, b2y] = RIO[k + 1], n = Math.ceil(Math.hypot(b2x - ax, b2y - ay) / 2); for (let q = 0; q < n; q++) if (((q + k * 7 - (t >> 2)) % 9 + 9) % 9 === 0) { bx.fillStyle = noite ? 'rgba(160,190,255,0.6)' : 'rgba(220,240,255,0.85)'; bx.fillRect(Math.round(AX + ax + (b2x - ax) * q / n), Math.round(AY + ay + (b2y - ay) * q / n), 1, 1); } }
  // sombras de nuvens passando
  for (let k = 0; k < 3; k++) { const cx = ((t * 0.12 + k * 97) % (AW + 80)) - 40, cy = 18 + k * 33; bx.globalAlpha = noite ? 0.1 : 0.16; bx.fillStyle = '#000'; bx.beginPath(); bx.ellipse(AX + cx, AY + cy, 22, 7, 0, 0, Math.PI * 2); bx.fill(); bx.beginPath(); bx.ellipse(AX + cx + 12, AY + cy - 3, 12, 5, 0, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1; }
  const aqui = W2.id === 'interior' ? REGIAO_DE[(G.baseVolta || {}).map] : REGIAO_DE[W2.id];
  const lista = REGIOES.slice().sort((a, b) => a.y - b.y);
  for (const r of lista) {
    const on = vis(r), conhecida = on || ESTRADAS.some(([a, b]) => (a === r.id && vis(R[b])) || (b === r.id && vis(R[a])));
    if (!conhecida) continue;
    const x = AX + r.x, y = AY + r.y;
    sombraChao(x + 2, y + 5, 12, 3, 0.4);
    iconeRegiao(r.ic, x, y, on && !r.longe);
    // luzes acesas de noite
    if (noite && on) { const L2 = r.id === 'auren' ? [[-4, -7], [-2, -4], [2, -3], [7, -1], [-9, -2]] : r.id === 'velhagua' ? [[-6, -2], [3, -2]] : r.id === 'candeia' && f.c4Fim ? [[2, -1], [-6, 0]] : r.id === 'estrada' ? [[-7, -8], [0, -8], [7, -8]] : []; for (const [lx, ly] of L2) { bx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 0.1 + lx); bx.fillStyle = '#ffd060'; bx.fillRect(x + lx - 2, y + ly - 2, 5, 5); bx.globalAlpha = 1; bx.fillStyle = '#ffe8a0'; bx.fillRect(x + lx, y + ly, 1, 1); } }
    placa(on ? r.nm : '???', r.lx ? AX + r.lx : x, y + (r.ly ?? 6), on ? (r.longe ? '#a8a0b8' : '#f0e8d8') : '#6a6078', r.al);
    if (r.id === aqui) { const b = Math.round(Math.sin(t * 0.15) * 1.5), px = x - 17; sombraChao(px + 1, y + 2, 3, 1); bx.fillStyle = '#000'; bx.fillRect(px - 3, y - 11 + b, 7, 6); bx.fillStyle = '#ff7aa8'; bx.fillRect(px - 2, y - 10 + b, 5, 4); bx.fillRect(px - 1, y - 6 + b, 3, 1); bx.fillRect(px, y - 5 + b, 1, 1); bx.fillStyle = '#ffffff'; bx.fillRect(px - 1, y - 9 + b, 1, 1); }
  }
  // um marcador por região e por tipo (principal à esquerda, opcionais à direita)
  const grupos = {};
  L.forEach((M, i) => { const rid = M.map === 'interior' ? aqui : REGIAO_DE[M.map]; if (!R[rid]) return; const k = rid + ':' + M.tipo; (grupos[k] = grupos[k] || { r: R[rid], tipo: M.tipo, sel: false }).sel ||= i === sel; });
  for (const k in grupos) { const g = grupos[k]; marcaMissao(AX + g.r.x + (g.tipo === 'main' ? -5 : 6), AY + g.r.y - 6, g.tipo, t + (g.tipo === 'main' ? 0 : 9), g.sel); }
  // rosa dos ventos
  const rx = AX + AW - 12, ry = AY + AH - 13;
  bx.fillStyle = 'rgba(0,0,0,0.4)'; bx.beginPath(); bx.arc(rx + 1, ry + 1, 7, 0, Math.PI * 2); bx.fill();
  bx.fillStyle = '#e8d8b0'; bx.fillRect(rx, ry - 6, 1, 13); bx.fillRect(rx - 6, ry, 13, 1); bx.fillRect(rx - 1, ry - 3, 3, 7); bx.fillRect(rx - 3, ry - 1, 7, 3);
  bx.fillStyle = '#ff7aa8'; bx.fillRect(rx, ry - 6, 1, 5); bx.fillStyle = '#8a7a5a'; bx.fillRect(rx, ry, 1, 1);
  txt('N', rx - 2, ry - 18, { col: '#e8d8b0' });
  // vinheta e moldura de pergaminho
  for (let k = 0; k < 8; k++) { bx.fillStyle = `rgba(0,0,0,${0.1 * (8 - k) / 8})`; bx.fillRect(AX, AY + k, AW, 1); bx.fillRect(AX, AY + AH - 1 - k, AW, 1); bx.fillRect(AX + k, AY, 1, AH); bx.fillRect(AX + AW - 1 - k, AY, 1, AH); }
  bx.restore();
  bx.strokeStyle = 'rgba(232,210,160,0.45)'; bx.lineWidth = 1; bx.strokeRect(AX + 2.5, AY + 2.5, AW - 5, AH - 5);
  for (const [cx, cy] of [[AX + 2, AY + 2], [AX + AW - 5, AY + 2], [AX + 2, AY + AH - 5], [AX + AW - 5, AY + AH - 5]]) { bx.fillStyle = '#e8d2a0'; bx.fillRect(cx, cy, 3, 3); bx.fillStyle = '#6a5a3a'; bx.fillRect(cx + 1, cy + 1, 1, 1); }
  if (W2.id === 'interior') placa('Você está dentro do baú', AX + 6, AY + AH - 16, '#c8c0d8', 'left');
}
