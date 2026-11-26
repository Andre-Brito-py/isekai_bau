// ================= ARTE DOS CÔMODOS DA BASE (v107) =================
// Pedido do usuário: "os novos cômodos dentro do baú fossem realmente cenários que desse pra andar por eles... todos,
// como a forja, a sala de treinamento... e mais de uma cama". Tiles próprios de cada cômodo + móveis em pixel art.
// Escala: personagem ~46 px, cama ~32 px, porta ~34 px (mesma régua do resto do jogo).
const CMD_C = {};
const cmdMemo = (k, f) => () => CMD_C[k] || (CMD_C[k] = f());

// ---------- tiles ----------
{ const _taC = tileArt; tileArt = function (k, v = 0, f = 0) {
  if (!['tijolo', 'pedraF', 'tatame', 'azulejo', 'parB', 'cimento', 'oniP', 'oniW'].includes(k)) return _taC(k, v, f);
  const key = 'cmd_' + k + '_' + v; if (TILE2[key]) return TILE2[key];
  const P = new Pix(16, 16);
  if (k === 'tijolo') {
    const R = ramp('#7a4636'), A = '#2e1a20';
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const fila = y >> 2, xx = (x + (fila % 2) * 4) % 8, junta = y % 4 === 3 || xx === 7;
      P.p(x, y, junta ? A : P.tone(R, 0.42 + ((hash(fila, (x + (fila % 2) * 4) >> 3, v + 3) % 5) - 2) * 0.07 + (y % 4 === 0 ? 0.12 : 0), x, y));
    }
    P.rect(0, 13, 16, 3, '#24141a');
  } else if (k === 'pedraF') {
    const R = ramp('#5c5258');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const bx2 = (x + (y >= 8 ? 5 : 0) + v * 3) % 16, junta = y === 7 || y === 15 || bx2 === 0 || bx2 === 9;
      P.p(x, y, junta ? '#2a2228' : P.tone(R, 0.45 + ((hash(x >> 2, y >> 2, v) % 5) - 2) * 0.05 + (y % 8 === 0 ? 0.1 : 0), x, y));
    }
  } else if (k === 'tatame') {
    const R = ramp(v % 2 ? '#8a9656' : '#9aa264');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(R, 0.5 + (x % 2 === 0 ? 0.06 : -0.04) + ((hash(x, y, v) % 7) === 0 ? -0.12 : 0), x, y));
    P.rect(0, 0, 16, 1, '#5a6036'); P.rect(0, 0, 1, 16, '#5a6036'); P.rect(1, 1, 14, 1, '#c8cc94');
  } else if (k === 'azulejo') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const q = ((x >> 3) + (y >> 3)) % 2, g = x % 8 === 7 || y % 8 === 7;
      P.p(x, y, g ? '#9aa8a8' : q ? '#d4e6e2' : '#eef0ec');
    }
    P.p(2, 2, '#ffffff'); P.p(10, 10, '#ffffff');
  } else if (k === 'parB') {
    const R = ramp('#d8d0c0');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(R, 0.55 - y / 70 + ((hash(x, y, v + 9) % 9) === 0 ? -0.08 : 0), x, y));
    P.rect(0, 10, 16, 3, '#5a9a94'); P.rect(0, 10, 16, 1, '#8ac8c0'); P.rect(0, 13, 16, 3, '#3a6a68');
  } else if (k === 'cimento') {
    const R = ramp('#7c7c84');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(R, 0.48 + ((hash(x, y, v + 5) % 11) - 5) * 0.025, x, y));
    if (v === 1) { for (let y = 4; y < 12; y++) for (let x = 3; x < 13; x++) if (Math.hypot((x - 8) / 5, (y - 8) / 3.4) < 1) P.p(x, y, (x + y) % 5 ? '#3a3a46' : '#4e4a6a'); }
    if (v === 2) { P.rect(0, 15, 16, 1, '#5a5a62'); P.rect(15, 0, 1, 16, '#5a5a62'); }
  } else if (k === 'oniP') {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, y % 3 === 0 ? '#2a2a34' : y % 3 === 1 ? '#44444e' : '#3a3a44');
    if (v === 1) P.rect(0, 7, 16, 2, '#b89a3a');
  } else if (k === 'oniW') {
    const R = ramp('#d8cc98');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) P.p(x, y, P.tone(R, 0.55 - y / 60, x, y));
    P.rect(0, 9, 16, 3, '#3a6ab8'); P.rect(0, 9, 16, 1, '#6a9ae0'); P.rect(0, 13, 16, 3, '#6a5a44');
  }
  return TILE2[key] = P.canvas();
}; }

// ---------- utilidades de desenho ----------
function cmdCaixa(P, x, y, w, h, base, o = {}) {   // caixa de madeira/metal com tampo claro e frente sombreada
  const R = ramp(base);
  P.rect(x, y, w, h, R[2]); P.rect(x, y, w, o.topo ?? 3, R[3]); P.rect(x, y, w, 1, R[4]);
  P.rect(x, y + h - 2, w, 2, R[0]); P.rect(x, y, 1, h, R[3]); P.rect(x + w - 1, y, 1, h, R[1]);
}
function cmdVela(P, x, y, h, t) {
  P.rect(x, y, 3, h, '#f2ecdc'); P.p(x, y, '#ffffff'); P.p(x + 2, y + h - 1, '#c8bca0');
  const f = (t || 0) % 3; P.p(x + 1, y - 1, '#3a2430'); P.p(x + 1, y - 2, '#ffd060'); P.p(x + 1, y - 3, f ? '#fff0a0' : '#ffd060'); if (f === 2) P.p(x + 1, y - 4, '#fff6c8');
}
function cmdPronto(P) { return P.outline().canvas(); }

// ---------- DORMITÓRIO ----------
const camaBauArt = cmdMemo('camaBau', () => {   // a cama do baú: uma tampa de baú virada, forrada de cobertor
  const P = new Pix(36, 30), M = ramp('#6a4430'), F = ramp('#a05a3a');
  cmdCaixa(P, 1, 12, 34, 16, '#6a4430');
  for (let x = 3; x < 33; x++) for (let y = 8; y < 22; y++) P.p(x, y, P.tone(F, 0.55 - (y - 8) / 40 + ((x + y) % 6 === 0 ? 0.12 : 0), x, y));
  P.rect(3, 8, 30, 1, F[4]); P.rect(4, 9, 9, 6, '#ece2cc'); P.rect(4, 9, 9, 1, '#ffffff');
  for (const x of [8, 18, 28]) P.rect(x, 22, 2, 5, '#c8a040');    // rebites dourados
  P.rect(1, 26, 34, 2, M[0]);
  return cmdPronto(P);
});
const camaLumeArt = cmdMemo('camaLume', () => {   // a da Lume: colcha de estrelas, travesseiro de nota musical
  const P = new Pix(34, 34), C = ramp('#3a4a8a');
  cmdCaixa(P, 1, 14, 32, 16, '#8a6a4a');
  P.rect(1, 2, 4, 28, '#7a5a3a'); P.rect(1, 2, 4, 1, '#a88a60');
  for (let x = 5; x < 33; x++) for (let y = 10; y < 26; y++) P.p(x, y, P.tone(C, 0.5 - (y - 10) / 50, x, y));
  for (let i = 0; i < 9; i++) { const sx = 8 + (i * 7) % 24, sy = 13 + (i * 5) % 11; P.p(sx, sy, '#ffe680'); if (i % 3 === 0) { P.p(sx + 1, sy, '#fff6c8'); P.p(sx, sy + 1, '#fff6c8'); } }
  P.rect(6, 7, 10, 6, '#f4ecdc'); P.rect(6, 7, 10, 1, '#ffffff'); P.p(10, 9, '#3a3050'); P.p(10, 10, '#3a3050'); P.p(11, 8, '#3a3050');
  return cmdPronto(P);
});
const camaRitaArt = cmdMemo('camaRita', () => {   // a da Rita: catre de quartel, lençol esticado, botas no pé da cama
  const P = new Pix(34, 32), L = ramp('#8a3a3a');
  P.rect(2, 26, 2, 4, '#3a3440'); P.rect(30, 26, 2, 4, '#3a3440');
  cmdCaixa(P, 1, 14, 32, 13, '#5a5a6a');
  for (let x = 3; x < 31; x++) for (let y = 9; y < 22; y++) P.p(x, y, P.tone(L, 0.5 - (y - 9) / 40 + (x % 8 === 0 ? -0.1 : 0), x, y));
  P.rect(3, 9, 28, 1, L[4]); P.rect(4, 6, 9, 6, '#e0d8c8'); P.rect(4, 6, 9, 1, '#ffffff');
  P.rect(24, 23, 4, 6, '#3a2a24'); P.rect(28, 24, 4, 5, '#2e2020'); P.p(24, 23, '#5a4034');
  return cmdPronto(P);
});
const belicheArt = cmdMemo('beliche', () => {     // beliche para hóspedes
  const P = new Pix(34, 56), M = ramp('#6a4a34'), C1 = ramp('#4a7a5a'), C2 = ramp('#7a5a8a');
  for (const x of [1, 31]) { P.rect(x, 2, 2, 52, M[2]); P.rect(x, 2, 1, 52, M[3]); }
  for (const [y, R] of [[10, C2], [36, C1]]) {
    cmdCaixa(P, 3, y + 6, 28, 6, '#6a4a34');
    for (let x = 4; x < 30; x++) for (let j = 0; j < 7; j++) P.p(x, y + j, P.tone(R, 0.55 - j / 16, x, y + j));
    P.rect(4, y - 2, 8, 4, '#ece2cc');
  }
  for (let y = 18; y < 36; y += 4) P.rect(29, y, 4, 1, M[3]);       // escadinha
  return cmdPronto(P);
});
const criadoArt = cmdMemo('criado', () => { const P = new Pix(16, 22); cmdCaixa(P, 1, 8, 14, 13, '#6a4a34'); P.rect(6, 13, 4, 1, '#c8a040'); cmdVela(P, 6, 3, 5, 0); return cmdPronto(P); });
const guardaRoupaArt = cmdMemo('guardaRoupa', () => {
  const P = new Pix(32, 50), R = ramp('#5a3a2e');
  cmdCaixa(P, 1, 2, 30, 46, '#5a3a2e', { topo: 4 });
  P.rect(15, 7, 1, 38, R[0]); P.rect(5, 9, 8, 32, R[1]); P.rect(18, 9, 9, 32, R[1]);
  P.p(13, 26, '#d8b050'); P.p(18, 26, '#d8b050');
  P.rect(20, 0, 8, 3, '#c84a5a'); P.rect(21, 0, 2, 1, '#f2ecdc');   // a meia do par? uma caixa vermelha em cima
  return cmdPronto(P);
});
// janela para o Vão: o "lado de fora" de dentro do baú. Estrelas violetas que piscam.
function janelaVaoArt() {
  const f = Math.floor(W2.t / 24) % 3, k = 'janelaVao' + f; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(30, 26);
  P.rect(0, 0, 30, 26, '#6a4a34'); P.rect(2, 2, 26, 22, '#1a0c30');
  for (let y = 2; y < 24; y++) for (let x = 2; x < 28; x++) { const d = Math.hypot(x - 15, y - 13); if (d < 9) P.p(x, y, d < 5 ? '#3a1a6a' : '#2a1250'); }
  for (let i = 0; i < 14; i++) { const x = 3 + (i * 11) % 24, y = 3 + (i * 7) % 20; if ((i + f) % 3) P.p(x, y, i % 4 ? '#c8a0ff' : '#ffffff'); }
  P.rect(14, 2, 2, 22, '#6a4a34'); P.rect(2, 12, 26, 2, '#6a4a34'); P.rect(0, 24, 30, 2, '#8a6a4a');
  return CMD_C[k] = cmdPronto(P);
}

// ---------- CORREDOR (Ala do Vão) ----------
// porta de madeira com plaqueta; trancada = tábuas e um lacre de runa
function portaCmdArt(cor, fechada) {
  const k = 'porta_' + cor + '_' + !!fechada; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(26, 38), R = ramp('#6a4430');
  P.rect(0, 2, 26, 36, '#3a2420'); P.rect(2, 4, 22, 34, R[1]);
  for (let x = 3; x < 23; x++) for (let y = 5; y < 38; y++) P.p(x, y, P.tone(R, 0.5 + (x % 5 === 0 ? -0.15 : 0) - y / 120, x, y));
  P.rect(5, 8, 16, 7, '#2a1a1a'); P.rect(6, 9, 14, 5, cor); P.rect(6, 9, 14, 1, '#ffffff');
  P.p(19, 24, '#d8b050'); P.p(19, 25, '#a88030');
  if (fechada) { for (const y of [18, 28]) { P.rect(1, y, 24, 3, '#8a6a44'); P.rect(1, y, 24, 1, '#b8946a'); } P.rect(11, 21, 4, 4, '#8a5ae8'); P.p(12, 22, '#f4ecff'); }
  return CMD_C[k] = cmdPronto(P);
}
// rasgo do Vão: a passagem entre cômodos (o baú dobrou o espaço sozinho)
function rasgoVaoArt() {
  const f = Math.floor(W2.t / 10) % 4, k = 'rasgo' + f; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(14, 36);
  for (let y = 0; y < 36; y++) { const larg = Math.round(5 * Math.sin(Math.PI * (y + 1) / 37)) + 1; for (let x = 7 - larg; x < 7 + larg; x++) P.p(x, y, Math.abs(x - 6.5) < larg - 2 ? '#160c2a' : '#8a5ae8'); }
  for (let i = 0; i < 6; i++) { const y = (i * 6 + f * 3) % 34 + 1; P.p(6 + ((i + f) % 3) - 1, y, i % 2 ? '#c8a0ff' : '#f4ecff'); }
  return CMD_C[k] = P.canvas();
}
const portaoGaragemArt = cmdMemo('portaoGar', () => {   // portão de enrolar, aberto pela metade
  const P = new Pix(18, 46), R = ramp('#8a8a9a');
  P.rect(0, 0, 18, 46, '#2a2a34');
  for (let y = 2; y < 22; y++) for (let x = 1; x < 17; x++) P.p(x, y, P.tone(R, 0.55 - (y % 3 === 0 ? 0.3 : 0), x, y));
  P.rect(1, 22, 16, 2, '#4a4a58'); P.rect(1, 24, 16, 22, '#141018');
  P.rect(3, 34, 3, 2, '#ffd060'); P.rect(12, 34, 3, 2, '#ffd060');   // olhos? não: os faróis do 31 no escuro
  return cmdPronto(P);
});
const quadroRetratoArt = (cor) => cmdMemo('retr' + cor, () => { const P = new Pix(18, 16); P.rect(0, 0, 18, 16, '#8a6a3a'); P.rect(2, 2, 14, 12, cor); P.rect(6, 5, 6, 6, shadeHex(cor, 0.5)); P.rect(5, 11, 8, 3, shadeHex(cor, 0.6)); return cmdPronto(P); })();
const vasoArtCmd = cmdMemo('vaso', () => { const P = new Pix(14, 22), V = ramp('#4a9a5a'); P.rect(3, 14, 8, 7, '#a0583a'); P.rect(3, 14, 8, 1, '#c87850'); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI, r = 4 + (i % 3) * 2; P.p(7 + Math.cos(a + Math.PI) * r * 0.9, 13 - Math.sin(a) * r * 1.4, V[1 + (i % 4)]); } P.ball(7, 9, 4, 4, V); return cmdPronto(P); });

// ---------- FORJA ----------
function fornalhaArt() {
  const f = Math.floor(W2.t / 6) % 3, k = 'fornalha' + f; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(44, 54), Pd = ramp('#6a5a5a');
  for (let y = 0; y < 54; y++) for (let x = 6; x < 38; x++) { const ch = y < 24 && (x < 14 || x > 29); if (ch) continue; P.p(x, y, P.tone(Pd, 0.5 + (((x >> 2) + (y >> 2)) % 2 ? 0.08 : -0.06) - y / 200, x, y)); }
  P.rect(14, 0, 16, 24, Pd[1]); for (let y = 0; y < 24; y += 4) P.rect(14, y, 16, 1, Pd[0]);     // chaminé
  P.rect(11, 28, 22, 18, '#1a0a0a'); P.rect(11, 28, 22, 2, '#3a2020');
  for (let y = 30; y < 46; y++) for (let x = 12; x < 32; x++) {
    const h = 46 - y, ond = Math.sin(x * 0.9 + f * 2) * 2 + Math.sin(x * 0.37 - f) * 2, chama = h < 9 + ond;
    if (chama) P.p(x, y, h < 3 ? '#fff0a0' : h < 6 + ond * 0.5 ? '#ffb040' : (x + y + f) % 3 ? '#e85a28' : '#a02818');
  }
  P.rect(8, 46, 28, 6, Pd[2]); P.rect(8, 46, 28, 1, Pd[4]);
  return CMD_C[k] = cmdPronto(P);
}
const bigornaArtCmd = cmdMemo('bigorna', () => {
  const P = new Pix(30, 24), Fe = ramp('#5a5a6a');
  P.rect(9, 16, 12, 7, '#4a3428'); P.rect(9, 16, 12, 1, '#6a4a34');           // toco
  P.poly([[2, 6], [24, 6], [28, 9], [24, 12], [20, 12], [18, 16], [12, 16], [10, 12], [6, 12], [2, 9]], (x, y) => P.tone(Fe, 0.75 - (y - 6) / 12, x, y));
  P.rect(4, 6, 20, 1, '#c8c8d8'); P.rect(22, 2, 6, 2, '#7a5a3a'); P.rect(26, 0, 3, 5, '#9a9aaa');   // martelo em cima
  return cmdPronto(P);
});
const foleArt = cmdMemo('fole', () => { const P = new Pix(22, 16), C = ramp('#8a5a3a'); P.poly([[1, 8], [16, 2], [16, 14]], (x, y) => P.tone(C, 0.6 - Math.abs(y - 8) / 14, x, y)); P.rect(16, 6, 5, 4, '#6a6a7a'); P.rect(0, 7, 3, 2, '#5a3a2a'); for (let x = 5; x < 15; x += 3) P.rect(x, 4 + (15 - x) / 4, 1, 9 - (15 - x) / 2, C[0]); return cmdPronto(P); });
const baldeArt = cmdMemo('balde', () => { const P = new Pix(14, 14), F = ramp('#7a7a8a'); P.cyl(2, 4, 10, 9, F); P.rect(3, 4, 8, 2, '#3a6a9a'); P.p(4, 4, '#8ac0f0'); P.line(2, 4, 7, 0, '#5a5a6a'); P.line(7, 0, 12, 4, '#5a5a6a'); return cmdPronto(P); });
const rackLancasArt = cmdMemo('rackLancas', () => {
  const P = new Pix(34, 44), M = ramp('#6a4a34');
  P.rect(1, 38, 32, 4, M[2]); P.rect(1, 38, 32, 1, M[4]); P.rect(1, 6, 32, 3, M[2]);
  for (const [x, c] of [[5, '#c8c8d8'], [12, '#d8b050'], [19, '#c8c8d8'], [26, '#b87a5a']]) { P.rect(x, 4, 2, 36, '#7a5a3a'); P.poly([[x - 1, 4], [x + 1, -2], [x + 3, 4]], c); }
  return cmdPronto(P);
});
const escudoParedeArt = cmdMemo('escudoP', () => { const P = new Pix(18, 22), R = ramp('#8a3a3a'); P.poly([[1, 1], [17, 1], [17, 10], [9, 21], [1, 10]], (x, y) => P.tone(R, 0.65 - y / 30, x, y)); P.rect(8, 2, 2, 16, '#d8b050'); P.rect(2, 7, 14, 2, '#d8b050'); return cmdPronto(P); });
const bancadaArt = cmdMemo('bancada', () => {
  const P = new Pix(38, 28); cmdCaixa(P, 1, 10, 36, 6, '#7a5a3a'); P.rect(3, 16, 3, 11, '#5a3a2a'); P.rect(32, 16, 3, 11, '#5a3a2a'); P.rect(3, 22, 32, 2, '#5a3a2a');
  P.rect(6, 6, 8, 4, '#8a8a9a'); P.rect(18, 7, 2, 3, '#c8c8d8'); P.rect(18, 4, 10, 2, '#7a5a3a'); P.rect(30, 5, 5, 5, '#3a3a48'); P.p(31, 6, '#ff8a40');
  return cmdPronto(P);
});
const carvaoArt = cmdMemo('carvao', () => { const P = new Pix(24, 12); for (let i = 0; i < 26; i++) { const x = 3 + (i * 7) % 18, y = 4 + (i * 3) % 7 - (Math.abs(x - 12) < 6 ? 2 : 0); P.rect(x, y, 3, 2, i % 3 ? '#2a2428' : '#4a4048'); } return cmdPronto(P); });

// ---------- SALA DE TREINO ----------
function bonecoArt(golpe) {
  const k = 'boneco' + (golpe ? 1 : 0); if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(26, 46), Pa = ramp('#c8a050'), S = ramp('#a07a4a');
  P.rect(12, 26, 2, 18, '#5a3a2a'); P.rect(8, 42, 10, 3, '#4a3020');
  const dx = golpe ? 2 : 0;
  for (let y = 14; y < 32; y++) for (let x = 6 + dx; x < 20 + dx; x++) if (Math.abs(x - 13 - dx) < 7 - Math.max(0, y - 28)) P.p(x, y, P.tone(S, 0.6 - (x - 6 - dx) / 30 + ((x + y) % 4 === 0 ? -0.1 : 0), x, y));
  P.rect(2 + dx, 17, 22, 3, Pa[2]); for (let x = 2 + dx; x < 24 + dx; x += 3) P.p(x, 20, Pa[1]);
  P.ball(13 + dx, 8, 6, 6, Pa); P.p(11 + dx, 7, '#3a2420'); P.p(15 + dx, 7, '#3a2420'); P.rect(11 + dx, 10, 5, 1, '#8a4a3a');
  P.rect(10 + dx, 22, 6, 6, '#c84a4a'); P.rect(12 + dx, 24, 2, 2, '#f2ecdc');     // alvo no peito
  return CMD_C[k] = cmdPronto(P);
}
const alvoArt = cmdMemo('alvo', () => { const P = new Pix(24, 34); P.rect(4, 22, 2, 11, '#5a3a2a'); P.rect(18, 22, 2, 11, '#5a3a2a'); for (let r = 10; r > 0; r -= 2) P.ball(12, 12, r, r, ramp(r % 4 === 2 ? '#c84a4a' : '#f2ecdc'), { amb: 0.6, k: 0.3 }); P.rect(11, 11, 3, 3, '#ffd060'); P.line(16, 6, 21, 2, '#7a5a3a'); return cmdPronto(P); });
const rackArmasArt = cmdMemo('rackArmas', () => {
  const P = new Pix(34, 40), M = ramp('#6a4a34'); P.rect(1, 34, 32, 4, M[2]); P.rect(1, 4, 32, 3, M[2]);
  P.rect(5, 2, 2, 34, '#c8c8d8'); P.rect(3, 26, 6, 2, '#5a3a2a');     // espada de treino
  P.rect(13, 0, 3, 36, '#8a6a44');                                     // bastão
  P.rect(21, 6, 2, 30, '#7a5a3a'); P.poly([[20, 6], [22, 0], [24, 6]], '#a8a8b8');   // lança cega
  P.rect(27, 10, 5, 20, '#8a6a3a'); P.rect(27, 10, 5, 2, '#a88a5a');  // escudo de madeira
  return cmdPronto(P);
});
const bancoArt = cmdMemo('banco', () => { const P = new Pix(34, 16); cmdCaixa(P, 1, 4, 32, 5, '#7a5a3a'); P.rect(3, 9, 3, 6, '#5a3a2a'); P.rect(28, 9, 3, 6, '#5a3a2a'); P.rect(20, 1, 6, 3, '#5a6aa8'); return cmdPronto(P); });
const sacoArt = cmdMemo('saco', () => { const P = new Pix(16, 40), C = ramp('#8a6a4a'); P.rect(7, 0, 2, 8, '#3a3440'); P.cyl(2, 8, 12, 28, C); P.rect(2, 12, 12, 1, C[0]); P.rect(2, 30, 12, 1, C[0]); return cmdPronto(P); });
const lousaTaticaArt = cmdMemo('lousaT', () => { const P = new Pix(34, 24); P.rect(0, 0, 34, 24, '#7a5a3a'); P.rect(2, 2, 30, 20, '#2a3a34'); for (const [x, y] of [[7, 6], [7, 12], [7, 18]]) P.rect(x, y, 2, 2, '#f2ecdc'); for (const [x, y] of [[25, 8], [25, 15]]) { P.p(x, y, '#ff8a8a'); P.p(x + 1, y + 1, '#ff8a8a'); P.p(x + 1, y, '#ff8a8a'); P.p(x, y + 1, '#ff8a8a'); } P.line(10, 7, 23, 9, '#e8e0a0'); P.line(10, 13, 23, 15, '#e8e0a0'); P.line(10, 19, 22, 16, '#c8c0f0'); return cmdPronto(P); });

// ---------- ENFERMARIA ----------
const macaArt = cmdMemo('maca', () => {
  const P = new Pix(36, 28), F = ramp('#c8ccd8');
  for (const x of [3, 31]) P.rect(x, 18, 2, 9, '#7a7a8a');
  P.rect(1, 14, 34, 5, '#9a9aaa'); P.rect(1, 14, 34, 1, '#d8d8e8');
  for (let x = 2; x < 34; x++) for (let y = 6; y < 15; y++) P.p(x, y, P.tone(F, 0.75 - (y - 6) / 30, x, y));
  P.rect(3, 4, 10, 6, '#ffffff'); P.rect(3, 9, 10, 1, '#d8dce8'); P.rect(20, 7, 12, 7, '#a8c8e0'); P.rect(20, 7, 12, 1, '#c8e0f0');
  return cmdPronto(P);
});
const armarioRemArt = cmdMemo('armarioRem', () => {
  const P = new Pix(30, 46); cmdCaixa(P, 1, 1, 28, 44, '#e8e4dc', { topo: 3 });
  P.rect(4, 6, 22, 16, '#b8d8e0'); P.rect(4, 6, 22, 1, '#e8f6fa'); P.rect(14, 6, 1, 16, '#8aa8b0');
  const cs = ['#c84a4a', '#ffd060', '#4a9a5a', '#7a5ae8', '#e88a3a'];
  for (let i = 0; i < 8; i++) { const x = 6 + (i % 4) * 5, y = i < 4 ? 9 : 16; P.rect(x, y, 3, 5, cs[i % 5]); P.p(x, y, '#ffffff'); }
  P.rect(4, 25, 22, 17, '#d8d4cc'); P.rect(14, 25, 1, 17, '#b8b4ac'); P.p(12, 33, '#8a8a9a'); P.p(16, 33, '#8a8a9a');
  P.rect(11, 0, 8, 2, '#c84a4a'); P.rect(14, -1, 2, 4, '#c84a4a');   // cruz vermelha
  return cmdPronto(P);
});
const piaArt = cmdMemo('pia', () => { const P = new Pix(22, 28); P.rect(9, 14, 4, 13, '#c8ccd8'); P.ball(11, 12, 10, 4, ramp('#e8ecf0')); P.rect(4, 10, 14, 3, '#8ab0c8'); P.rect(10, 2, 2, 8, '#9a9aaa'); P.rect(10, 2, 5, 2, '#9a9aaa'); P.rect(6, 0, 10, 2, '#c8c8d8'); return cmdPronto(P); });
const biomboArtCmd = cmdMemo('biombo', () => { const P = new Pix(30, 40); for (let i = 0; i < 3; i++) { const x = 1 + i * 10; P.rect(x, 2, 9, 34, '#7a7a8a'); P.rect(x + 1, 4, 7, 30, i % 2 ? '#e8e0d0' : '#f4ecdc'); P.rect(x + 1, 4, 7, 1, '#ffffff'); P.rect(x + 1, 36, 1, 3, '#5a5a6a'); P.rect(x + 7, 36, 1, 3, '#5a5a6a'); } return cmdPronto(P); });
const plantaArtCmd = vasoArtCmd;

// ---------- GARAGEM ----------
const pneusArt = cmdMemo('pneus', () => { const P = new Pix(24, 24), B = ramp('#2a2a34'); for (const y of [18, 12, 6]) { P.ball(12, y, 11, 4, B); P.ball(12, y - 1, 5, 2, ramp('#141018')); } return cmdPronto(P); });
const galaoArt = cmdMemo('galao', () => { const P = new Pix(14, 18); cmdCaixa(P, 1, 3, 12, 14, '#c84a3a'); P.rect(4, 0, 4, 3, '#3a3a48'); P.rect(3, 8, 8, 5, '#f2ecdc'); P.rect(5, 9, 4, 3, '#c84a3a'); return cmdPronto(P); });
const bancadaGarArt = cmdMemo('bancadaGar', () => {
  const P = new Pix(44, 40); P.rect(2, 0, 40, 18, '#4a4a58'); for (let y = 2; y < 18; y += 3) for (let x = 4; x < 40; x += 3) P.p(x, y, '#2a2a34');
  P.rect(6, 3, 2, 9, '#c8c8d8'); P.rect(5, 3, 4, 2, '#c8c8d8'); P.rect(12, 2, 3, 12, '#c84a3a'); P.rect(20, 4, 8, 3, '#d8b050'); P.rect(32, 3, 2, 11, '#8a8a9a'); P.ball(33, 3, 3, 2, ramp('#8a8a9a'));
  cmdCaixa(P, 1, 20, 42, 6, '#6a6a7a'); P.rect(3, 26, 3, 13, '#4a4a58'); P.rect(38, 26, 3, 13, '#4a4a58');
  P.rect(8, 15, 10, 5, '#2a5a8a'); P.rect(26, 16, 6, 4, '#b8b8c8');
  return cmdPronto(P);
});
function lampadaCmdArt() { const P = new Pix(10, 26); P.rect(4, 0, 1, 18, '#2a2a34'); P.rect(2, 18, 6, 3, '#4a4a58'); P.rect(3, 21, 4, 3, '#fff0a0'); P.p(4, 22, '#ffffff'); return cmdPronto(P); }
const lampadaC = cmdMemo('lampada', lampadaCmdArt);
const conesArt = cmdMemo('cones', () => { const P = new Pix(22, 16); for (const x of [5, 15]) { P.poly([[x - 4, 14], [x, 2], [x + 4, 14]], '#e87a2a'); P.rect(x - 3, 8, 6, 2, '#f2ecdc'); P.rect(x - 5, 14, 10, 2, '#3a3a48'); } return cmdPronto(P); });

// ---------- DENTRO DO 31 ----------
// banco de ônibus visto de cima/frente: encosto azul, assento, alça cromada
function bancoOnibusArt(costas) {
  const k = 'banco31' + (costas ? 'c' : ''); if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(32, 26), A = ramp('#3a5aa0'), Cr = ramp('#a8a8b8');
  if (!costas) {   // fileira de cima: vê o assento e o encosto de frente
    for (let x = 1; x < 31; x++) for (let y = 2; y < 14; y++) P.p(x, y, P.tone(A, 0.6 - y / 40 + (x === 15 || x === 16 ? -0.3 : 0), x, y));
    for (let x = 1; x < 31; x++) for (let y = 14; y < 20; y++) P.p(x, y, P.tone(A, 0.8 - (y - 14) / 20 + (x === 15 || x === 16 ? -0.3 : 0), x, y));
    for (let x = 3; x < 29; x += 4) P.p(x, 6, A[1]);
    P.rect(1, 20, 30, 3, '#2a2a34'); P.rect(3, 23, 2, 3, '#5a5a6a'); P.rect(27, 23, 2, 3, '#5a5a6a');
  } else {         // fileira de baixo: vê as costas do encosto (com a alça)
    for (let x = 1; x < 31; x++) for (let y = 4; y < 22; y++) P.p(x, y, P.tone(A, 0.45 - y / 60 + (x === 15 || x === 16 ? -0.25 : 0), x, y));
    P.rect(3, 2, 26, 2, Cr[2]); P.rect(3, 2, 26, 1, Cr[4]);
    P.rect(1, 22, 30, 3, '#2a2a34');
  }
  return CMD_C[k] = cmdPronto(P);
}
// janelas do 31: lá fora passa o Vão (o ônibus está estacionado DENTRO do baú)
function janela31Art() {
  const f = Math.floor(W2.t / 16) % 32, k = 'jan31_' + f; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(30, 22);
  P.rect(0, 0, 30, 22, '#a8a8b8'); P.rect(2, 2, 26, 18, '#1a0c30');
  for (let y = 2; y < 20; y++) for (let x = 2; x < 28; x++) if ((x * 3 + y * 5 + f) % 41 === 0) P.p(x, y, '#c8a0ff');
  for (let i = 0; i < 4; i++) { const x = 2 + ((i * 9 + f) % 26); P.p(x, 6 + i * 3, '#f4ecff'); }
  P.line(4, 18, 14, 4, 'rgba(255,255,255,0.0)'); for (let i = 0; i < 8; i++) P.p(20 + i, 4 + i, '#3a2a6a');
  P.rect(14, 2, 2, 18, '#a8a8b8');
  return CMD_C[k] = P.canvas();
}
const volanteArt = cmdMemo('volante', () => {
  const P = new Pix(40, 34), D = ramp('#3a3a48');
  cmdCaixa(P, 1, 2, 38, 12, '#3a3a48'); P.rect(4, 4, 6, 4, '#ffd060'); P.rect(12, 4, 4, 4, '#8fe3ff'); P.rect(30, 4, 6, 3, '#e85a28');
  P.ball(22, 18, 9, 5, ramp('#1a1a22')); P.ball(22, 18, 6, 3, ramp('#3a3a48'));
  P.rect(14, 22, 18, 10, '#7a5a3a'); P.rect(14, 22, 18, 2, '#a07a4a');            // banco do motorista
  return cmdPronto(P);
});
const bonetArt = cmdMemo('bone31', () => { const P = new Pix(12, 6); P.ball(6, 4, 5, 3, ramp('#2a4a8a')); P.rect(6, 4, 6, 2, '#1a2a5a'); P.p(5, 2, '#ffd060'); return cmdPronto(P); });
const catracaArt = cmdMemo('catraca', () => { const P = new Pix(20, 30), Cr = ramp('#a8a8b8'); P.rect(2, 10, 14, 18, '#4a4a58'); P.rect(2, 10, 14, 2, '#6a6a7a'); for (const [a, b] of [[16, 6], [16, 14], [8, 4]]) P.line(9, 12, a, b, Cr[3], 2); P.rect(4, 16, 8, 5, '#2a5a3a'); P.p(5, 17, '#8affaa'); return cmdPronto(P); });
const barraArt = cmdMemo('barra31', () => { const P = new Pix(4, 52); P.cyl(1, 0, 2, 52, ramp('#a8a8b8')); return P.canvas(); });
// cantinhos de cada um dentro do 31
const fogareiroArt = (f) => { const k = 'fog' + f; if (CMD_C[k]) return CMD_C[k]; const P = new Pix(22, 24); cmdCaixa(P, 1, 12, 20, 10, '#5a5a6a'); P.cyl(4, 4, 14, 8, ramp('#8a8a9a')); P.rect(4, 4, 14, 1, '#c8c8d8'); for (let i = 0; i < 3; i++) P.p(7 + i * 4, 1 + ((f + i) % 3), '#e8e8f0'); P.rect(6, 22, 3, 2, '#e85a28'); P.rect(13, 22, 3, 2, f % 2 ? '#ffb040' : '#e85a28'); return CMD_C[k] = cmdPronto(P); };
const hortaArt = cmdMemo('horta', () => { const P = new Pix(34, 22), V = ramp('#4a9a4a'); cmdCaixa(P, 1, 12, 32, 9, '#8a5a3a'); for (let i = 0; i < 10; i++) { const x = 3 + i * 3; P.rect(x, 4 + (i % 3) * 2, 2, 9 - (i % 3) * 2, V[1 + (i % 3)]); P.p(x, 3 + (i % 3) * 2, V[4]); } P.ball(10, 6, 2, 2, ramp('#d84a4a')); P.ball(24, 7, 2, 2, ramp('#ffd060')); P.rect(28, 2, 3, 3, '#c8a0ff'); return cmdPronto(P); });
const livrosArt = cmdMemo('livros31', () => { const P = new Pix(30, 24), cs = ['#5a3a8a', '#8a3a3a', '#3a6a5a', '#8a6a2a', '#3a4a8a', '#6a2a5a']; for (let i = 0; i < 9; i++) { const x = 2 + i * 3, h = 10 + (i * 7) % 8; P.rect(x, 22 - h, 3, h, cs[i % 6]); P.rect(x, 22 - h, 3, 1, '#f2ecdc'); } P.rect(3, 4, 12, 3, '#5a3a8a'); P.rect(4, 2, 10, 2, '#f2ecdc'); return cmdPronto(P); });
function velasPavioArt() { const f = Math.floor(W2.t / 8) % 3, k = 'velasP' + f; if (CMD_C[k]) return CMD_C[k]; const P = new Pix(30, 22); cmdCaixa(P, 1, 14, 28, 7, '#6a4a6a'); for (const [x, h] of [[4, 8], [9, 5], [13, 10], [18, 6], [23, 9]]) cmdVela(P, x, 14 - h, h, f + x); return CMD_C[k] = cmdPronto(P); }
const lousaNeideArt = cmdMemo('lousaN', () => { const P = new Pix(28, 22); P.rect(0, 0, 28, 20, '#8a6a3a'); P.rect(2, 2, 24, 16, '#2a4a3a'); for (let i = 0; i < 4; i++) P.rect(5, 5 + i * 3, 8 + (i * 5) % 10, 1, '#e8e8e0'); P.rect(20, 5, 3, 3, '#ffd060'); P.rect(10, 20, 8, 2, '#f2ecdc'); return cmdPronto(P); });
const almofadaArt = cmdMemo('almofada', () => { const P = new Pix(22, 12); P.ball(11, 7, 10, 4, ramp('#8a5a9a')); P.p(11, 6, '#e8c8f0'); return cmdPronto(P); });

// ---------- fundo de batalha da sala de treino ----------
let BG_TREINO = null;
function bgTreino() {
  if (BG_TREINO) return BG_TREINO;
  const P = new Pix(240, 150), Wd = ramp('#6a4430'), Tt = ramp('#9aa264');
  for (let y = 0; y < 82; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(Wd, 0.38 + (x % 24 === 0 ? -0.2 : 0) + y / 400, x, y));
  for (let x = 0; x < 240; x += 48) { P.rect(x + 10, 20, 26, 18, '#2a3a34'); P.rect(x + 8, 18, 30, 2, '#8a6a3a'); }
  for (let y = 82; y < 150; y++) for (let x = 0; x < 240; x++) P.p(x, y, P.tone(Tt, 0.62 - (y - 82) / 160 + ((((x / 32) | 0) + (((y - 82) / 16) | 0)) % 2 ? 0.06 : -0.04), x, y));
  for (let x = 0; x < 240; x += 32) P.rect(x, 82, 1, 68, '#5a6036');
  P.rect(0, 80, 240, 2, '#3a2420');
  return BG_TREINO = P.canvas();
}

// ---------- O CORETO DO SEU VALDIR (v108) ----------
// O jabuti dormindo com o coreto da praça de Velhágua nas costas: casco de placas, cabeça para fora que respira,
// e em cima o coreto de oito lados (piso, grade, colunas brancas, telhado vermelho, varal de luzinhas).
function jabutiCoretoArt() {
  const f = Math.floor(W2.t / 40) % 2, luz = Math.floor(W2.t / 12) % 3, k = 'jabuti' + f + luz; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(104, 92), Cs = ramp('#6a7a3a'), Cp = ramp('#8a9a4a'), Pe = ramp('#8a8a5a'), Br = ramp('#e8e0d0'), Tl = ramp('#b84a3a');
  // patas
  for (const [x, y] of [[14, 80], [32, 84], [66, 84], [84, 80]]) { P.ball(x, y, 7, 5, Pe); P.rect(x - 5, y + 2, 10, 3, Pe[1]); }
  // casco (domo largo)
  P.ball(50, 72, 44, 18, Cs, { amb: 0.3 });
  for (let i = 0; i < 7; i++) { const cx = 14 + i * 12, cy = 70 + (i % 2) * 6; for (let a = 0; a < 6; a++) { const an = a / 6 * Math.PI * 2; P.p(cx + Math.cos(an) * 5, cy + Math.sin(an) * 3, Cs[0]); } P.p(cx, cy, Cp[3]); }
  P.rect(8, 86, 84, 2, Cs[0]);
  // cabeça (para fora, à direita), respira e dorme
  const hy = 74 + f;
  P.ball(98, hy, 6, 6, Pe); P.ball(92, hy + 2, 5, 4, Pe);
  P.rect(98, hy - 2, 3, 1, '#2a2418'); P.p(102, hy + 2, '#2a2418');
  if (f) { P.p(103, hy - 6, '#f4ecff'); P.p(101, hy - 9, '#c8c0e8'); }
  // coreto: piso
  P.ball(50, 56, 34, 7, ramp('#c8b898'), { amb: 0.5 });
  P.rect(18, 56, 64, 4, '#8a7a5a');
  // grade
  for (let x = 20; x <= 80; x += 3) P.rect(x, 48, 1, 8, Br[1]);
  P.rect(18, 47, 64, 2, Br[3]);
  // colunas
  for (const x of [20, 36, 50, 64, 80]) { P.cyl(x - 1, 24, 3, 32, Br); }
  // telhado
  P.poly([[14, 26], [50, 2], [86, 26]], (x, y) => P.tone(Tl, 0.75 - (y / 30) + (x < 50 ? 0.1 : -0.1), x, y));
  P.rect(14, 25, 72, 3, Tl[0]); for (let x = 16; x < 86; x += 4) P.p(x, 28, Tl[1]);
  P.rect(49, 0, 2, 4, '#d8b050'); P.p(50, 0, '#ffe680');
  // luzinhas no varal da beirada
  const cs = ['#ffe066', '#ff8aa8', '#8fe3ff'];
  for (let i = 0; i < 12; i++) { const x = 16 + i * 6, y = 30 + Math.round(Math.sin(i / 11 * Math.PI) * 4); P.p(x, y, cs[(i + luz) % 3]); }
  // estante de partitura e uma cadeira de banda, lá em cima
  P.rect(30, 40, 1, 8, '#3a3440'); P.rect(27, 38, 7, 3, '#f2ecdc'); P.rect(60, 42, 6, 2, '#7a5a3a'); P.rect(60, 44, 1, 4, '#5a3a2a'); P.rect(65, 44, 1, 4, '#5a3a2a');
  return CMD_C[k] = cmdPronto(P);
}
function lampiaoPracaArt() {
  const f = Math.floor(W2.t / 14) % 2, k = 'lampP' + f; if (CMD_C[k]) return CMD_C[k];
  const P = new Pix(14, 44); P.cyl(5, 10, 3, 32, ramp('#3a3a48')); P.rect(3, 41, 8, 3, '#2a2a34');
  P.rect(2, 2, 10, 9, '#2a2a34'); P.rect(4, 4, 6, 6, f ? '#fff0a0' : '#ffd060'); P.p(5, 5, '#ffffff'); P.poly([[1, 3], [7, -1], [13, 3]], '#3a3a48');
  return CMD_C[k] = cmdPronto(P);
}
const canteiroCmd = cmdMemo('canteiroC', () => { const P = new Pix(20, 14); for (let i = 0; i < 10; i++) { const x = 2 + i * 2; P.rect(x, 5 + (i % 3), 1, 8 - (i % 3), '#4a8a4a'); P.p(x, 4 + (i % 3), ['#ff8aa8', '#ffe066', '#c8a0ff'][i % 3]); } P.rect(0, 12, 20, 2, '#6a5a44'); return cmdPronto(P); });
