// ================= SAVE AUTOMÁTICO (e o ícone discreto) =================
// (pedido do usuário: save automático com um ícone discreto no canto inferior esquerdo; "o salvamento não deve
// acontecer o tempo todo, para que haja alguma punição quando o jogador der game over".)
// QUANDO SALVA: nos Marcos (como antes), nos marcos da história (fim de cena, chefe vencido, capítulo novo) e,
// automaticamente, ao ENTRAR NUM MAPA se já se passaram 4 minutos de jogo desde o último save. Nunca no meio da luta.
// GAME OVER: volta ao último save (grupo2.js voltarMarco). Contra chefe dá para tentar de novo pagando 20% dos cobres.
const SALVO = { t: 0 };
const AUTOSAVE_SEG = 240;
{ const _sv = save2; save2 = function () { G.ultSave = G.time || 0; _sv(); SALVO.t = 150; }; }
{ const _lmA = loadMap2; loadMap2 = function (id) {
  const r = _lmA.apply(this, arguments);
  if (!(BT && BT.on) && (G.time || 0) - (G.ultSave || 0) >= AUTOSAVE_SEG) setTimeout(() => { if (V.scene === 'world' && !(BT && BT.on)) save2(); }, 600);
  return r;
}; }
// ícone: um baú pequenininho com a tampa abrindo e fechando e três pontinhos, no canto de baixo à esquerda
function desenhaSalvando() {
  if (SALVO.t <= 0) return; SALVO.t--;
  const a = Math.min(1, SALVO.t / 25, (150 - SALVO.t) / 10) * 0.8, x = 6, y = H - 15, k = Math.floor((150 - SALVO.t) / 8);
  bx.save(); bx.globalAlpha = a;
  bx.fillStyle = 'rgba(5,3,10,0.55)'; bx.fillRect(x - 3, y - 4, 30, 14);
  const ab = k % 4 === 1 || k % 4 === 2 ? 2 : 0;
  bx.fillStyle = '#8a5a2a'; bx.fillRect(x, y + 2, 10, 6); bx.fillStyle = '#c88a3a'; bx.fillRect(x, y + 2, 10, 1);
  bx.fillStyle = '#a86a32'; bx.fillRect(x - 1, y - ab, 12, 3); bx.fillStyle = '#f0c040'; bx.fillRect(x + 4, y + 2, 2, 2);
  for (let i = 0; i < 3; i++) { bx.fillStyle = i === k % 3 ? '#ffe066' : '#6a6080'; bx.fillRect(x + 14 + i * 4, y + 5, 2, 2); }
  bx.restore();
}
