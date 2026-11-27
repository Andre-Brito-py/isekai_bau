// ================= PALAVRAS DE PODER: O NOME DA MAGIA VEM DO CÍRCULO (v119) =================
// Pedido do usuário: "nomear as magias... que o nome da magia viesse com base em como ela foi construída, e não que o
// jogador desse o nome, que cada elemento do círculo fosse um pedaço do nome da magia, para criar nomes bem cara de
// palavras mágicas". Cada peça do círculo é uma sílaba da língua do Grimório:
//   [Ur (círculo grande)] + RAIZ do 1º elemento + [ligação do 2º elemento | raiz repetida (dobrado)] + FIM da forma
//   + [sílaba da marca] + [in (círculo pequeno)]; gatilho põe "Ek'" na frente.
//   Ex.: Brasa+Dardo = VULTRAK. Geada+Onda = HIELVEIS. Brasa+Geada+Dardo = VULDORTRAK. Sombra+Vento+Coro+Eco =
//   NOXAEKANTRETH. Brasa dobrada+Dardo = VUL'VULTRAK. Grande = URVULTRAK. Gatilho = EK'VULTRAK.
// O nome antigo (Brasa · Dardo) vira a "tradução", entre aspas, no começo da descrição, junto da etimologia.
const RAIZ3 = { brasa: 'Vul', geada: 'Hiel', seiva: 'Vire', fuligem: 'Mor', areia: 'Sab', ambar: 'Amb', sal: 'Hal', faisca: 'Zir', sombra: 'Nox', vento: 'Aer', polvora: 'Bra', canto: 'Lir', ceu: 'Cel', vao: 'Vo' };
const LIGA3 = { brasa: 'ra', geada: 'dor', seiva: 'via', fuligem: 'mo', areia: 'sa', ambar: 'bel', sal: 'ha', faisca: 'zi', sombra: 'nu', vento: 'ae', polvora: 'bak', canto: 'li', ceu: 'ce', vao: 'vo' };
const FIM3 = { dardo: 'trak', onda: 'veis', veu: 'lin', corrente: 'kett', ancora: 'gorn', mina: 'tep', coro: 'kant', chave: 'kles' };
const MARCA3 = { foco: 'ix', eco: 'reth', selo: 'um', dreno: 'sug', mare: 'on', bandeira: 'fan', bilhete: 'tik', nome: 'ae' };
function palavraMagica(s) {
  if (!s || !s.e || !s.e[0]) return null;
  const e1 = s.e[0], e2 = s.e[1], f = s.f, pecas = [];
  let w = RAIZ3[e1] || 'Ar'; pecas.push(w + ' (' + (EL3[e1] ? EL3[e1].nm : e1) + ')');
  if (e2 && e2 === e1) { const r = (RAIZ3[e1] || 'ar').toLowerCase(); w += "'" + r; pecas.push("'" + r + ' (dobrado)'); }
  else if (e2) { w += LIGA3[e2] || 'a'; pecas.push((LIGA3[e2] || 'a') + ' (' + (EL3[e2] ? EL3[e2].nm : e2) + ')'); }
  const fim = FIM3[f] || 'is'; w += fim; pecas.push(fim + ' (' + (FORMA3[f] ? FORMA3[f].nm : f) + ')');
  if (s.m && MARCA3[s.m]) { w += MARCA3[s.m]; pecas.push(MARCA3[s.m] + ' (' + (MOD3[s.m] ? MOD3[s.m].nm : s.m) + ')'); }
  if (s.tam === 'p') { w += 'in'; pecas.push('in (pequeno)'); }
  if (s.tam === 'g') { w = 'Ur' + w.toLowerCase(); pecas.unshift('Ur (grande)'); }
  if (s.g) { w = "Ek'" + w.toLowerCase(); pecas.unshift("Ek' (gatilho)"); }
  w = w.charAt(0).toUpperCase() + w.slice(1);
  return { w, pecas };
}
{ const _pgW = pagina3; pagina3 = function (s) {
  const P = _pgW(s);
  try {
    const pm = palavraMagica(s);
    if (pm) { P.trad = P.nm; P.palavra = pm.w; P.d = '"' + P.nm + '" · ' + pm.pecas.join(' + ') + ' · ' + P.d; P.nm = pm.w; }
  } catch (e) { console.error('palavra', e); }
  return P;
}; }
// no primeiro feitiço lançado com nome, o Catálogo explica uma vez
{ const _feW = feitico3; feitico3 = function (s) {
  const F = _feW(s), run0 = F.run;
  F.run = async function (m, t) {
    if (!G.flags.tutPalavra) { G.flags.tutPalavra = true; try { callout(F.nm.toUpperCase() + '!', '#ffe066', 60); } catch (e) { } }
    return run0.apply(this, arguments);
  };
  return F;
}; }
