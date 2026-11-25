// ================= OS OITO PILARES (pedido do usuário) =================
// Os oito indivíduos mais poderosos do mundo, cada um uma POTÊNCIA MUNDIAL, de raças diferentes, com títulos. Mesmo entre
// eles há degraus. Na T2 eles só existem em BOATOS: moradores comuns às vezes contam um (35% das conversas de papo), o
// grupo reage, e o menu ganha a página "Os Oito Pilares" (boatos ouvidos; o resto fica ???). Na T3 o baú entra para a
// OITAVA CADEIRA, vaga há trezentos anos. SEGREDOS (bíblia): quem é a Lanterna de verdade; o Acendedor-Mor no nível deles.
const PILARES = [
  { k: 'dobrador', tit: 'O Dobrador', nm: 'nome desconhecido', raca: 'raça desconhecida', deg: 'topo', d: 'Aparece em dois lugares ao mesmo tempo. Magia de espaço. Muitos dizem que é o mais forte dos Oito.' },
  { k: 'lanterna', tit: 'A Lanterna Que Não Se Apaga', nm: 'Sereníssima Aurélia, Rainha de Auren', raca: 'humana (dizem)', deg: 'topo', d: 'A rainha de Auren. O retrato dela não muda há gerações. Ninguém nunca a viu lutar; ninguém precisou.' },
  { k: 'dragao', tit: 'O Guerreiro Dragão Pesado', nm: 'Brann Escama-de-Chumbo', raca: 'draconato', deg: 'topo', d: 'Não voa: "voar é pra quem tem medo do chão". Onde ele anda, a estrada afunda. Já acabou uma guerra dormindo numa ponte.' },
  { k: 'santa', tit: 'A Santa', nm: 'Irmã Celeste de Salgema', raca: 'humana', deg: 'meio', d: 'Anda descalça de cidade em cidade. Por onde passa, a febre vai embora junto com ela.' },
  { k: 'sentinela', tit: 'A Sentinela de Mil Anos', nm: 'Ithrien da Floresta de Vidro', raca: 'elfa', deg: 'meio', d: 'Nunca errou uma flecha. Dizem que já atirou numa segunda e acertou no sábado.' },
  { k: 'martelo', tit: 'O Martelo Que Fez a Coroa', nm: 'Mestre Durgo Fundo-de-Forja', raca: 'anão', deg: 'meio', d: 'Forjou a coroa da Rainha e a espada do Lobo. Cobra caro: em anos, não em cobre.' },
  { k: 'lobo', tit: 'O Lobo do Inverno', nm: 'Kaarvo', raca: 'homem-fera (lobo)', deg: 'base', d: 'O mais novo dos Oito. Ganhou a cadeira na mordida. Literalmente.' },
  { k: 'oitava', tit: 'A Oitava Cadeira', nm: 'vaga', raca: '—', deg: '?', d: 'Vazia há trezentos anos. Chamam de "a cadeira do mar": quem sentava nela sumiu numa viagem.' }
];
const BOATOS = [
  { k: 'geral', s: 'Oito Pilares. Oito pessoas que, sozinhas, valem um exército. Quando dois deles brigam, quem muda é o mapa.', re: [['Potência mundial. Nível "o mapa muda".', 'rita'], ['Eu sou potência de bolso. Nível "o bolso muda".', 'me']] },
  { k: 'degraus', p: 'dobrador', s: 'Mesmo entre os Oito tem degrau. O Dobrador, a Rainha e o Dragão Pesado: esses três, os outros cinco respeitam calados.' },
  { k: 'oitava', p: 'oitava', s: 'A Oitava Cadeira tá vazia faz trezentos anos. A cadeira do mar. Quem sentava nela sumiu numa viagem e nunca voltou.', re: [['Cadeira vazia é cadeira que alguém vai querer.', 'rita'], ['Ou que alguém vai ganhar sem querer.', 'lume'], ['Eu sou um baú. Eu nem sento.', 'me']] },
  { k: 'lanterna1', p: 'lanterna', s: 'A nossa Rainha é um dos Oito, sabia? A Lanterna Que Não Se Apaga. Minha bisavó via o retrato dela. Igualzinho ao de hoje.' },
  { k: 'lanterna2', p: 'lanterna', s: 'Ninguém nunca viu a Rainha lutar. Ninguém precisou. Auren nunca foi invadida. Nem tentaram.' },
  { k: 'dragao1', p: 'dragao', s: 'O Guerreiro Dragão Pesado não voa. Diz que voar é pra quem tem medo do chão. Ele anda. E onde ele pisa, a estrada afunda.' },
  { k: 'dragao2', p: 'dragao', s: 'Teve uma guerra no leste que acabou porque o Dragão Pesado sentou no meio da ponte e dormiu. Ninguém teve coragem de acordar.', re: [['...Eu gostei dele.', 'lume']] },
  { k: 'santa', p: 'santa', s: 'A Santa passou por aqui quando eu era menino. Descalça. A febre da cidade foi embora com ela, no mesmo dia.' },
  { k: 'sentinela', p: 'sentinela', s: 'A Sentinela de Mil Anos nunca errou uma flecha. Dizem que ela atirou numa segunda e acertou no sábado.' },
  { k: 'martelo', p: 'martelo', s: 'Quem fez a coroa da Rainha foi o Martelo, o anão. Ele cobra caro. Não em cobre: em anos da sua vida.', re: [['Isso é um orçamento ou uma maldição?', 'rita']] },
  { k: 'lobo', p: 'lobo', s: 'O Lobo do Inverno é o mais novo dos Oito. Ganhou a cadeira na mordida. Literal. Arrancou a do outro.', re: [['Mordida resolve muita coisa.', 'me'], ['Não incentiva, @.', 'rita']] },
  { k: 'dobrador1', p: 'dobrador', s: 'O Dobrador? Ninguém sabe se é homem, mulher ou porta. Aparece em dois lugares ao mesmo tempo. Dizem que é o mais forte de todos.' },
  { k: 'dobrador2', p: 'dobrador', s: 'Tem gente que caça dobradores de espaço pra levar pra Coroa. O Dobrador eles nunca pegaram. Pegam os pequenos.', re: [['...Dobradores de espaço, @.', 'lume'], ['Eu só dobro o que eu como. Meia dobra. Dobra de bolso.', 'me']] },
  { k: 'vesper1', p: 'oitava', cap: 2, s: 'O Acendedor-Mor? Dizem que, se quisesse, sentava numa cadeira dos Oito. Dizem que ele só espera a cadeira certa vagar.', re: [['Eu não gosto de gente que espera cadeira vagar.', 'rita']] },
  { k: 'vesper2', p: 'oitava', cap: 3, s: 'Meu primo é guarda. Diz que o Acendedor-Mor uma vez apagou uma rua inteira só de olhar. Gente assim não é gente comum. É gente de Pilar.' },
  { k: 'mimico', p: 'oitava', cap: 4, s: 'Já pensou um MÍMICO na Oitava Cadeira? Ha! Os outros sete iam ficar sentados longe dele. Por via das dúvidas.', re: [['[Probabilidade estimada: baixa. Mas o baú já falhou em ser provável antes.]', 'cat']] }
];
function pilSt() { G.flags.pil = G.flags.pil || {}; return G.flags.pil; }
function boatoLivre() {
  const c = typeof capAtual === 'function' ? capAtual() : 3, h = pilSt();
  const ls = BOATOS.filter(b => !h[b.k] && (b.cap || 2) <= c && (b.k === 'geral' || h.geral));
  return ls.length ? (ls.find(b => b.k === 'geral') || pickOne(ls)) : null;
}
async function contarBoato(quem) {
  const b = boatoLivre(); if (!b) return false;
  pilSt()[b.k] = true;
  await say(b.s, quem);
  for (const [l, w] of (b.re || [])) await say(l, w);
  if (!G.flags.pilAviso) { G.flags.pilAviso = true; await say('[Anotado: OS OITO PILARES. Abri uma página para eles no menu. Escala de poder: "potência mundial". Escala do baú: em avaliação.]', 'cat'); }
  else W2.toast = { s: 'Boato anotado: Os Oito Pilares', t: 0 };
  return true;
}
// os papos dos moradores às vezes viram boato
for (const [fn, quem] of [['falaJoao', 'joao'], ['falaDita', 'dita'], ['falaBebum', 'bebum'], ['falaLia', 'lia'], ['falaNico', 'nico'], ['falaPoeta', 'poeta'], ['falaCrianca3', 'povo'], ['falaVelha3', 'povo'], ['falaLavadeira', 'povo']]) {
  try {
    const orig = eval(fn); if (typeof orig !== 'function') continue;
    const novo = async function () { if (Math.random() < 0.35 && boatoLivre() && await contarBoato(quem)) return; return orig.apply(this, arguments); };
    eval(fn + ' = novo');
  } catch (e) { }
}
{ const _ffP = falaFeira; falaFeira = i => { const f = _ffP(i); return async () => { FEIRA_I = i; if (Math.random() < 0.35 && boatoLivre() && await contarBoato('feira')) return; return f(); }; }; }
// a página no menu
MENU_EXTRA.push({ k: 'pilares', nm: () => 'Os Oito Pilares', col: '#ffd890', vis: () => !!(G.flags && G.flags.pilAviso),
  right: () => { const h = pilSt(); return PILARES.filter(P => BOATOS.some(b => b.p === P.k && h[b.k])).length + '/8'; },
  desc: () => 'Os oito mais poderosos do mundo. Potências mundiais. O que você ouviu dizer.',
  run: async () => {
    const h = pilSt(), sabe = P => BOATOS.some(b => b.p === P.k && h[b.k]);
    const DEG = { topo: 'topo', meio: 'meio', base: 'base', '?': '' };
    const its = PILARES.map(P => sabe(P) ? { label: P.tit, right: DEG[P.deg], col: P.k === 'oitava' ? '#c8b8e8' : '#ffd890', d: `${P.nm} · ${P.raca}. ${P.d}` } : { label: '???', col: '#6a6078', d: 'Ainda não ouviu falar. Converse com o povo.' });
    await list({ x: 14, y: 24, w: 212, maxVis: 8, title: 'Os Oito Pilares', items: its, desc: j => its[j] && its[j].d, descY: 140 });
  } });
