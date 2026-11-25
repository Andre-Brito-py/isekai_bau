// ================= A APARÊNCIA DA MOÇA DA BARCA (arte do usuário: build/arteia_moca/gerar_moca.py -> arte_moca.js) =================
// Retrato grande (44x62) nas falas dela, com 5 expressões escolhidas pelo texto (ou opt.exp): 0 sorriso de canto,
// 1 rindo (manga na boca), 2 lendo (anéis dos olhos acesos), 3 triste, 4 bico de ciúme. Antes de ganhar nome (Cap. 10)
// ela aparece só como SILHUETA de âmbar (o rosto não se vê): o rosto é a revelação do nome. Depois do nome, quando ela
// fala no mapa, espia pela fresta da tampa do baú. Na cena do nome, ela sai do baú em corpo inteiro.
const MOCA = { exp: 0, c: {} };
function mocaImg(e) { return typeof iaRosto === 'function' ? iaRosto(e) : null; }
function mocaPort(i) { const k = 'p' + i; if (!MOCA.c[k]) MOCA.c[k] = mocaImg(ARTE_MOCA.port[i]); return MOCA.c[k]; }
function mocaSp(k) { if (!MOCA.c[k]) MOCA.c[k] = mocaImg(ARTE_MOCA.sp[k]); return MOCA.c[k]; }
// silhueta: o retrato sério vira âmbar chapado em 4 tons; os olhos ficam como dois pontos acesos
function mocaSilhueta() {
  if (MOCA.c.sil) return MOCA.c.sil;
  const src = mocaPort(2), c = mk(src.width, src.height), x = c.getContext('2d'); x.drawImage(src, 0, 0);
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data, R = [[58, 26, 10], [122, 62, 18], [200, 120, 40], [255, 214, 130]];
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255; const t = R[Math.min(3, Math.floor(l * 3.2))]; d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2]; d[i + 3] = 200; }
  x.putImageData(id, 0, 0);
  x.fillStyle = '#fff4c0'; for (const [ex, ey] of [[17, 27], [27, 27]]) x.fillRect(ex, ey, 2, 1);
  return (MOCA.c.sil = c);
}
function expMoca(t) {
  t = String(t).toLowerCase();
  if (/ciúme|hmpf|leia você|fui eu|eu faço melhor|de 10|rangeu|não é que eu goste/.test(t)) return 4;
  if (/haha|hehe|de nada|é bonito|é meu|ria|riu|rindo|quentinho/.test(t)) return 1;
  if (/desculpa|frio|sozinh|esperando|não lembro|medo|de novo não|cansad|metade|irmã|escuro/.test(t)) return 3;
  if (/\bli\b|leio|lendo|\bler\b|lido|leitura|cuidado|onde bate|conheço|sei ler|vento|vai chamar|não vai parar/.test(t)) return 2;
  return 0;
}
{ const _sayM = say; say = function (text, who = 'n', opt = {}) { if (who === 'eco8') MOCA.exp = opt && opt.exp != null ? opt.exp : expMoca(text); return _sayM(text, who, opt); }; }
if (WHO.eco8) Object.assign(WHO.eco8, {
  bigP: true,
  portrait: () => (G.flags && G.flags.c10Nome) ? mocaPort(MOCA.exp) : mocaSilhueta(),
  bob: (fala) => fala ? (Math.floor(FRAME / 8) % 2) : 0
});
// no mapa: depois do nome, quando ela fala, a cabeça dela espia pela fresta da tampa
{ const _dpM = drawPlayer; drawPlayer = function (ox, oy) {
  _dpM(ox, oy);
  const w = UI.stack[UI.stack.length - 1];
  if (!w || w.type !== 'dialog' || w.who !== 'eco8' || !(G.flags && G.flags.c10Nome) || W2.float) return;
  if (typeof rostoSt === 'function' && rostoSt().on) return;
  const im = mocaSp('espia'), x = Math.round(W2.px - ox + 8 - im.width / 2), y = Math.round(W2.py - oy - im.height + 6 + Math.sin(FRAME / 14));
  bx.drawImage(im, x, y);
  if (FRAME % 20 < 2) { bx.fillStyle = '#ffd890'; bx.fillRect(x + (FRAME % 7) * 3, y - 2, 1, 1); }
}; }
// a cena do nome: ela sai do baú em corpo inteiro, flutua, e volta para dentro
async function mocaAparece(nome) {
  const big = mocaSp('grande'), bau = BT && BT.party ? BT.party.find(u => u.id === 'bau') : null;
  const [cx, cy] = bau ? unitCenter(bau) : [70, 150];
  const gotas = [];
  const desenha = (alpha, sobe) => {
    const x = Math.round(cx - big.width / 2 + 10), y = Math.round(cy - big.height + 18 - sobe + Math.sin(FRAME / 16) * 2);
    bx.globalAlpha = alpha * 0.35; bx.fillStyle = '#ffd070'; bx.beginPath(); bx.arc(x + big.width / 2, y + big.height * 0.45, 34, 0, 6.29); bx.fill();
    bx.globalAlpha = alpha; bx.drawImage(big, x, y);
    if (FRAME % 3 === 0) gotas.push({ x: x + 14 + Math.random() * (big.width - 28), y: y + big.height - 18, v: 0.3 + Math.random() * 0.6, a: 1 });
    for (const g of gotas) { g.y += g.v; g.a -= 0.02; if (g.a > 0) { bx.globalAlpha = alpha * g.a; bx.fillStyle = '#ffc860'; bx.fillRect(Math.round(g.x), Math.round(g.y), 1, 2); } }
    bx.globalAlpha = 1;
  };
  sfx('rune');
  await tw(50, p => desenha(ease.out(p), p * 30));
  callout((nome || 'Ela').toUpperCase(), '#ffd890', 90);
  await tw(110, () => desenha(1, 30));
  await tw(30, p => desenha(1 - p, 30 - p * 20));
}
