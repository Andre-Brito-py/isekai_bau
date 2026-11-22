// ================= DEVOLVER LEMBRANÇAS (Cap. 6) =================
// O âmbar "de farmácia" da Coroa é feito das lembranças que os Pavios entregam na Casa do Selo. O baú PROVA um frasco
// e vê um pedaço da lembrança (o Catálogo anota). Achar o dono (pelas pistas: ofício, manias, o que cada um diz) e
// abrir o frasco perto dele devolve a lembrança: o Pavio volta a ser gente (muda de roupa e de voz) e agradece.
// Devolver as CINCO lembranças ensina ao baú a DEVOLUÇÃO (técnica: devolve ao inimigo o último golpe que o grupo levou).
const LEMB6 = {
  cotinha: { nm: 'Frasco de farmácia (selo 12)', cor: '#ffd070', dono: 'Dona Cotinha', trecho: 'Um menino de farda grande demais tropeça no próprio cinto e ri: "Mãe, eu vou ser Sargento!"' },
  afonso: { nm: 'Frasco do lote 31', cor: '#ff9a6a', dono: 'Seu Afonso', trecho: 'Pão de milho saindo do forno de lenha às quatro da manhã, e um assobio que é sempre a mesma música, desafinada no mesmo lugar.' },
  zelia: { nm: 'Frasco do lote 9', cor: '#c8a0ff', dono: 'Dona Zélia', trecho: 'Uma agulha, um dedal de prata e um vestido de noiva que não era dela, costurado de madrugada, chorando de alegria.' },
  juvenal: { nm: 'Frasco sem lote', cor: '#a0f0b0', dono: 'Juvenal', trecho: 'Uma porta azul, um 7 pintado à mão, torto, e uma voz de mulher: "Juvenal, larga essa lanterna e vem jantar."' },
  osvaldo: { nm: 'Frasco do lote 47', cor: '#9ad0ff', dono: 'Osvaldo Candeia', trecho: 'Uma mulher de cabelo preso com um lápis ri e diz "meu relojoeiro". O rosto dela, inteiro, de frente.' }
};
const lembSt = () => (G.lemb = G.lemb || {});
const temLemb = (k) => lembSt()[k] === 'tem';
const devolvida = (k) => lembSt()[k] === 'dev';
const nDevolvidas = () => Object.keys(LEMB6).filter(devolvida).length;
async function ganhaLemb(k, provar = true) {
  if (lembSt()[k]) return; lembSt()[k] = 'tem'; sfx('item');
  await say(`* Você guarda no Vão: {y}${LEMB6[k].nm}{/}.`);
  if (provar) { await say('* Você prova uma gota. Só uma. E por um segundo não está aqui:'); await say('* ' + LEMB6[k].trecho); await say(`[Lembrança anotada: "${LEMB6[k].trecho.slice(0, 40)}..." Dono: desconhecido. Procure quem combina com ela.]`, 'cat'); }
}
// lista de lembranças (MENU > Lembranças): o que se tem, o trecho, e quem já recebeu
MENU_EXTRA.push({ k: 'lemb', nm: () => 'Lembranças', col: '#ffd070', vis: () => Object.keys(lembSt()).length > 0,
  right: () => nDevolvidas() + '/' + Object.keys(LEMB6).length,
  desc: () => 'Os frascos de lembrança no Vão. Ache o dono e abra o frasco perto dele.',
  run: async () => {
    const ks = Object.keys(LEMB6).filter(k => lembSt()[k]);
    await list({ x: 14, y: 30, w: 212, title: 'Lembranças (' + nDevolvidas() + ' devolvidas)', items: ks.map(k => ({ label: devolvida(k) ? LEMB6[k].dono : LEMB6[k].nm, right: devolvida(k) ? 'devolvida' : 'no Vão', col: devolvida(k) ? '#9be58a' : undefined })), desc: i => '"' + LEMB6[ks[i]].trecho + '"' });
  } });
// devolver: chamado na fala de cada dono
async function devolverLemb(k, cena) {
  if (!temLemb(k)) return false;
  await say('* Você abre a tampa. Tira o frasco do Vão. O selo da Coroa estala.');
  sfx('rune'); if (typeof flashW === 'function') { try { flashW(2); } catch (e) { } }
  await say('* Um fio dourado sobe do frasco, dá uma volta no ar como quem procura a porta de casa... e entra.');
  lembSt()[k] = 'dev';
  if (cena) await cena();
  const n = nDevolvidas();
  W2.toast = { s: 'Lembrança devolvida (' + n + '/' + Object.keys(LEMB6).length + ')', t: 0 };
  if (n >= Object.keys(LEMB6).length && !G.flags.c6Devolucao) {
    G.flags.c6Devolucao = true; sfx('rune');
    await say('* Cinco lembranças voltaram para casa. Você sente o Vão mais leve. E mais fundo, de algum jeito.');
    await say('A gente devolve. Um por um. Igual ele tirou.', 'rita');
    await say('* {y}O baú aprendeu DEVOLUÇÃO!{/} (técnica: devolve ao inimigo, mais forte, o último golpe que o grupo levou).');
  }
  save2();
  return true;
}
// ---------- DEVOLUÇÃO (técnica do baú) ----------
{ const _hmD = hurtMember; hurtMember = function (m, d0, o = {}) { const r = _hmD.call(this, m, d0, o); if (BT && BT.on && d0 > 0) BT.ultDano = d0; return r; }; }
TECH2.devolucao = { nm: 'Devolução', cost: 35, tgt: 'enemy', w: 'normal', d: 'Engole o último golpe que o grupo levou e devolve, mais forte, no inimigo. Quanto mais doeu, mais volta.', run: async (m, t) => {
  if (!t) return;
  const ult = BT.ultDano || 0, pow = 0.6 + Math.min(1.8, ult / 70);
  const [x0, y0] = unitCenter(m), [tx, ty] = unitCenter(t);
  sfx('rune'); callout(ult ? 'Devolução: ' + ult + ' de volta, com juros' : 'Devolução (nada para devolver...)', '#ffd070', 60);
  await tw(18, p => { luzMagia(x0, y0 - 8, 8 + p * 16, 'rgba(255,208,112,0.6)', 1 - p * 0.5); });
  await tw(14, p => { const x = x0 + (tx - x0) * p, y = y0 - 10 + (ty - y0) * p - Math.sin(p * Math.PI) * 20; bx.fillStyle = '#ffd070'; bx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6); bx.fillStyle = '#fff0b0'; bx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2); });
  burst(tx, ty, 16, ['#ffd070', '#fff0b0', '#ffffff']);
  hitFoe(m, t, pow, { el: 'mordida', brk: 2 });
  BT.ultDano = 0;
} };
{ const _gaD = grupoAtual; grupoAtual = function () { const g = _gaD(); if (G.flags && G.flags.c6Devolucao) { const b = g.find(m => m.id === 'bau'); if (b && !(b.techs || []).includes('devolucao')) b.techs = [...(b.techs || []), 'devolucao']; } return g; }; }
