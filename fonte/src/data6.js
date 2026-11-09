// ================= CAPÍTULO 6: ALMAS DO 31 =================
// A Voz puxa pela Linha 31 as almas do ônibus que esqueceram quem eram. Quem lembra do próprio nome resiste.
// Mecânicas: CANÇÕES (a Lume toca melodias em portas de memória), ACALMAR (Lembranças vão embora em paz com o
// elemento certo), CHAMADA (portas da escola perguntam o banco de cada passageiro).

// ---------- almas do 31 ----------
const SOULS = ['lume', 'cida', 'tiago', 'ozorio', 'neide', 'duda', 'marlene', 'valdir'];
function soulOk(k) {
  const f = G.flags;
  if (k === 'lume') return true;
  if (k === 'tiago') return !!f.ch5done && !f.tiagoTaken;
  if (k === 'cida') return f.soul_cida === 'lembrou' || f.soul_cida === 'resgatado' || (!!f.cidaDone && f.soul_cida !== 'perdida');
  return f['soul_' + k] === 'lembrou' || f['soul_' + k] === 'resgatado';
}
function soulsCount() { return SOULS.filter(soulOk).length; }
function soulsNames() { const N = { lume: 'Lume', cida: 'Dona Cida', tiago: 'Tiago', ozorio: 'Seu Ozório', neide: 'Profª Neide', duda: 'Duda', marlene: 'Dona Marlene', valdir: 'Seu Valdir' }; return SOULS.filter(soulOk).map(k => N[k]); }
function lostSouls() { const f = G.flags; return ['ozorio', 'neide', 'cida'].filter(k => f['soul_' + k] === 'perdido' || f['soul_' + k] === 'perdida').length + (f.tiagoTaken ? 1 : 0); }

// ---------- runas ----------
Object.assign(RUNES, {
  canto: { name: 'Canto', type: 'el', col: '#ffb0d8', pow: 9, desc: 'Som. Acalma Lembranças em dobro e pode encantar. Véu: o Coro cura um pouco por 3 turnos.' },
  coro: { name: 'Coro', type: 'form', col: '#f2ecdc', cost: 6, get mult() { return 0.45 + 0.15 * Math.min(6, soulsCount()); }, desc: 'Atinge todos os inimigos. Mais forte para cada alma do 31 que você reuniu.' },
  bilhete: { name: 'Bilhete', type: 'mod', col: '#e8dcc0', cost: 2, desc: 'Depois do feitiço, o próximo golpe inimigo contra você sai pela metade.' }
});
Object.assign(RUNE_RAR, { canto: 'incomum', coro: 'rara', bilhete: 'rara' });
Object.assign(MAP_D, { padaria: 15, feira: 15, escola: 16, coreto: 16, pontofinal: 17 });
EL_COL.canto = '#ffb0d8';
EP.canto = ['#6a1a4a', '#e05a9a', '#ffb0d8', '#ffffff'];

// ---------- itens ----------
Object.assign(ITEMS, {
  pastel: { name: 'Pastel de Feira', hp: 160, desc: 'Cura 160 PV. Queijo, três e cinquenta. Quente demais na primeira mordida, sempre.' },
  caldo: { name: 'Caldo de Cana', mp: 50, desc: 'Recupera 50 PM. Com limão, do jeito que a Dona Cida pedia.' },
  cordinha: { name: 'Cordinha de Parada', desc: 'Em batalha: PLIM! Todos os inimigos comuns perdem o próximo turno. Chefes não descem do ônibus.',
    async fx() { let n = 0; for (const e of BT.en) if (e.alive && !e.d.boss) { e.skip = '* O % levanta para descer no ponto, percebe que não é o dele e senta de novo. Perdeu o turno.'; n++; } sfx('catalog'); await bSay(n ? '* PLIM! Você puxa a cordinha. Os inimigos olham em volta, achando que é o ponto deles.' : '* PLIM! O chefe nem se mexe. Ele não desce aqui.', { auto: 50 }); } }
});

// ---------- técnica da Profª Neide ----------
TECH.chamada = { name: 'Chamada', cd: 5, desc: 'Cada alma do 31 que você reuniu responde "Presente!": ataque e defesa +10% por alma (até +50%) por 3 turnos.',
  async use() {
    const names = soulsNames(), n = Math.min(5, names.length), m = 1 + n * 0.1;
    BT.buff.atkM = Math.max(BT.buff.atkM, m); BT.buff.atkT = Math.max(BT.buff.atkT, 4);
    BT.buff.defM = Math.min(BT.buff.defM, 2 - m); BT.buff.defT = Math.max(BT.buff.defT, 4);
    sfx('buff'); await bSay(`* "Presente!" ${names.slice(0, 4).join(', ')}${names.length > 4 ? '...' : ''}\n* Ataque ×${m.toFixed(1)} e dano recebido -${Math.round((m - 1) * 100)}% por 3 turnos.`, { auto: 60 });
  } };
TECH_FX.chamada = async () => { const names = soulsNames(); await fxRun(40, (k, p) => { names.slice(0, 6).forEach((nm, i) => { const q = Math.min(1, Math.max(0, p * 2 - i * 0.18)); if (q <= 0) return; const x = 8 + (i % 3) * 30, y = 96 - Math.floor(i / 3) * 22 - q * 6; fxSpark(x + 6, y, '#ffe066', q < 0.4); if (q > 0.3) txt('!', x + 4, y - 14, { col: '#ffe066' }); }); }); };

// ---------- efeitos das runas novas no feitiço ----------
// Canto: 20% de encantar inimigos comuns. Bilhete: escudo para o próximo golpe.
{ const _cs = castSpell; castSpell = async function (sp, target) {
  await _cs(sp, target);
  if (!BT.on) return;
  if (sp.el === 'canto' && sp.form !== 'veu') { const al = BT.en.filter(e => e.alive && e.hp > 0 && !e.d.boss && !e.confused); if (al.length && Math.random() < 0.2) { const t = pickOne(al); t.skip = '* O % ainda está parado, com a música na cabeça. Perdeu o turno.'; await bSay(`* O ${t.name} fica parado, ouvindo. Ele perdeu o turno.`, { auto: 40 }); } }
  if (sp.mod === 'bilhete') { BT.ticketShield = 1; await bSay('* Um bilhete carimbado gira em volta da sua tampa. O próximo golpe vai sair pela metade.', { auto: 45 }); }
}; }
{ const _h = hurt; hurt = function (e, pow, mult, res, o) {
  if (BT.ticketShield > 0 && mult > 0) { BT.ticketShield = 0; mult *= 0.5; BT.nums.push({ x: BPX, y: BPY - 52, s: 'BILHETE', col: '#e8dcc0', t: 50 }); }
  return _h(e, pow, mult, res, o);
}; }
{ const _re = roundEnd; roundEnd = async function () {
  await _re();
  if (BT.on && BT.choir > 0 && G.hp > 0) { BT.choir--; const h = Math.round(G.st.mhp * 0.06); G.hp = Math.min(G.st.mhp, G.hp + h); BT.nums.push({ x: BPX, y: BPY - 42, s: '+' + h, col: '#ffb0d8', t: 40 }); }
}; }

// ---------- ACALMAR: Lembranças que vão embora em paz ----------
// ENEMIES[k].calm = { els: [...], need: n }. O feitiço do elemento certo enche a calma; CANTO enche em dobro.
function calmHit(t, el, log) {
  const c = t.d.calm; if (!c || !t.alive || t.calmed) return;
  if (!c.els.includes(el)) return;
  t.calm = (t.calm || 0) + (el === 'canto' ? 2 : 1);
  if (t.calm >= c.need) { t.calmed = true; log.push(`* O ${t.name} ${c.msg || 'lembrou de alguma coisa boa'}.`); }
  else log.push(`* O ${t.name} hesita, escutando. (Calma ${t.calm}/${c.need})`);
}
{ const _kd = killDead; killDead = async function () {
  for (const e of BT.en) if (e.alive && e.calmed) {
    e.alive = false; e.dying = 48; sfx('heal'); G.flags.calmed = (G.flags.calmed || 0) + 1;
    for (let i = 0; i < 26; i++) BT.parts.push({ x: e.x + rand(-14, 14), y: e.y + rand(-14, 14), vx: rand(-0.3, 0.3), vy: rand(-1, -0.3), life: rand(40, 70), col: pickOne(['#ffb0d8', '#ffffff', '#ffe066']), sz: 1 });
    await wait(16);
    await bSay(`* O ${e.name} ${(e.d.calm && e.d.calm.bye) || 'desembarcou em paz'}.`, { auto: 40 });
  }
  return _kd();
}; }
// a canção da Lume também acalma quem escuta música
{ const _ls = lumeSing; lumeSing = async function () {
  await _ls();
  if (!BT.on) return; const log = [];
  for (const e of BT.en) if (e.alive && e.hp > 0 && e.d.calm && e.d.calm.els.includes('canto')) { e.calm = (e.calm || 0) + 1; if (e.calm >= e.d.calm.need) { e.calmed = true; log.push(`* O ${e.name} cantarola junto com a Lume.`); } }
  if (log.length) { await bSay(log.join('\n'), { auto: 40 }); await killDead(); }
}; }

// ---------- CANÇÕES: portas de memória ----------
// Cada melodia é uma sequência de setas. A Lume toca primeiro; você repete.
const TUNES = {
  onibus: { name: 'Canção do 31', col: '#ffe066', keys: ['up', 'right', 'up', 'left', 'down', 'right'], notes: [72, 76, 79, 77, 74, 72] },
  pregao: { name: 'Pregão da Feira', col: '#f07830', keys: ['left', 'left', 'up', 'right', 'down', 'down', 'up'], notes: [67, 67, 72, 71, 69, 67, 72] },
  recreio: { name: 'Sinal do Recreio', col: '#7ad0f0', keys: ['up', 'down', 'up', 'down', 'right', 'left', 'up'], notes: [79, 74, 79, 74, 76, 72, 79] },
  valsa: { name: 'Valsa do Coreto', col: '#ffb0d8', keys: ['down', 'up', 'up', 'right', 'down', 'up', 'up', 'left'], notes: [65, 69, 72, 74, 67, 71, 74, 72] }
};
const ARR_N = { up: 0, right: 1, down: 2, left: 3 };
function tunes() { if (!G.flags.tunes) G.flags.tunes = ['onibus']; return G.flags.tunes; }
function learnTune(k) { const t = tunes(); if (!t.includes(k)) t.push(k); }
function playNote(m, d = 0.28) { if (!AU.ctx || AU.muted) return; tone(AU.ctx.currentTime + 0.01, hz(m), d, { wave: 'triangle', vol: 0.09, out: AU.sfx, sus: 0.7 }); }
// janela da melodia: a Lume toca, depois você repete. Errar só recomeça.
function playTune(k, opts = {}) {
  const T = TUNES[k], n = T.keys.length;
  const w = { type: 'tune', keys: T.keys, t: 0, phase: 'demo', i: 0, ok: [], miss: 0, flash: 0, done: false,
    update() {
      this.t++;
      if (this.phase === 'demo') { const step = Math.floor(this.t / 18); if (this.t % 18 === 1 && step < n) playNote(T.notes[step]); if (step >= n + 1) { this.phase = 'play'; this.t = 0; } return; }
      if (this.phase === 'end') { if (this.t > 50) closeWin(this, true); return; }
      if (this.phase === 'fail') { if (this.t > 40) { this.phase = 'demo'; this.t = 0; this.i = 0; this.ok = []; } return; }
      if (btnp('b')) { closeWin(this, false); return; }
      for (const d of DIRK) if (btnp(d)) {
        if (d === T.keys[this.i]) { playNote(T.notes[this.i]); this.ok.push(true); this.i++; this.flash = 8; if (this.i >= n) { this.phase = 'end'; this.t = 0; sfx('rune'); } }
        else { sfx('cancel'); this.phase = 'fail'; this.t = 0; this.miss++; }
        return;
      }
    },
    draw() {
      box(16, 60, 208, 104, { edge: T.col });
      txt(T.name, 120, 66, { align: 'center', col: T.col });
      const msg = this.phase === 'demo' ? 'A Lume toca... escute' : this.phase === 'play' ? 'Sua vez! Repita as setas' : this.phase === 'end' ? 'A melodia ecoa!' : 'Desafinou... de novo';
      txt(msg, 120, 140, { align: 'center', col: this.phase === 'fail' ? '#ff6b6b' : '#b8aecb' });
      const bw = Math.min(24, Math.floor(196 / n)), x0 = 120 - n * bw / 2;
      const demoStep = this.phase === 'demo' ? Math.floor(this.t / 18) : -1;
      T.keys.forEach((d, i) => {
        const x = x0 + i * bw, lit = i === demoStep, done = i < this.i, cur = this.phase === 'play' && i === this.i;
        const col = lit ? '#ffffff' : done ? T.col : cur ? '#ffe066' : this.phase === 'play' ? '#3a3448' : '#6a6078';
        box(x + 1, 92, bw - 3, 30, { bw: cur ? 2 : 1, edge: col, fill: lit || done ? '#1a1424' : '#000' });
        if (this.phase !== 'play' || done || cur) drawArrow(d, Math.round(x + (bw - 2) / 2), 107, 6, col);
        else txt('?', Math.round(x + (bw - 2) / 2), 101, { align: 'center', col: '#3a3448' });
        if (lit || (done && this.flash > 0 && i === this.i - 1)) { bx.fillStyle = T.col; bx.fillRect(Math.round(x + (bw - 2) / 2) - 1, 84 - (this.t % 18) / 3, 2, 3); }
      });
      if (this.flash > 0) this.flash--;
      if (this.phase === 'play') txt('B: desistir', 120, 152, { align: 'center', col: '#5a5070' });
    } };
  return openWin(w);
}
// porta de memória: só abre com a melodia certa
STORY.tuneDoor = async function (e) {
  const T = TUNES[e.tune];
  if (G.flags[e.flag]) return;
  await say(e.desc || `* Uma porta feita de luz ${T.col === '#ffe066' ? 'dourada' : T.col === '#f07830' ? 'laranja' : T.col === '#7ad0f0' ? 'azul' : 'rosada'}. Ela vibra, como uma corda esperando a nota certa.`);
  const known = tunes();
  if (!known.includes(e.tune)) { await say('Eu não conheço essa música, baú. Alguém daqui deve conhecer.', 'lume'); return; }
  const names = known.map(k => TUNES[k].name);
  const i = await choose('* Que melodia a Lume toca?', [...names, 'Nenhuma'], 'n', names.length);
  if (i < 0 || i >= names.length) return;
  if (known[i] !== e.tune) { sfx('cancel'); await say('* A porta treme e fica do mesmo jeito. Não era essa música.'); return; }
  const ok = await playTune(e.tune);
  if (!ok) return;
  G.flags[e.flag] = true; refreshEnts(); sfx('rune'); shake(4);
  await say(e.open || '* A porta de luz se desfaz em notas, que somem pelo ar.');
};

// ---------- sprites do mapa (16x16) ----------
const S6 = {
  pombo: f => cv4(16, 16, r => { r(2, 8, 4, 3, 'k'); r(3, 9, 3, 1, '#6a6a7a'); r(4, 6, 10, 8, 'k'); r(5, 7, 8, 6, '#8a8a9a'); r(5, 7 - f, 5, 2, '#6a6a7a'); r(10, 3, 5, 6, 'k'); r(11, 4, 3, 4, '#9a9aaa'); r(10, 8, 3, 2, '#5aa88a'); r(11, 9, 2, 1, '#a05aa8'); r(12, 5, 1, 1, '#ff8030'); r(15, 6, 1, 1, '#e8c890'); r(7, 14, 1, 2, '#e86890'); r(10, 14, 1, 2, '#e86890'); }),
  carrinho: f => cv4(16, 16, r => { r(1, 4, 13, 8, 'k'); r(2, 5, 11, 6, '#7a8090'); for (let i = 3; i < 13; i += 2) r(i, 5, 1, 6, '#5a6070'); r(2, 7, 11, 1, '#5a6070'); r(3, 2, 3, 3, '#f07830'); r(6, 1, 3, 4, '#4a9a4a'); r(9, 2, 3, 3, '#c83838'); r(13, 2, 3, 2, 'k'); r(14, 2, 2, 1, '#9aa0aa'); const w = f ? '#9aa0aa' : '#5a6070'; r(2, 12, 3, 3, 'k'); r(3, 13, 1, 1, w); r(10, 12, 3, 3, 'k'); r(11, 13, 1, 1, w); r(5, 8, 2, 1, '#ffffff'); r(8, 8, 2, 1, '#ffffff'); r(6, 8, 1, 1, 'k'); r(9, 8, 1, 1, 'k'); }),
  lousa: f => cv4(16, 16, r => { r(0, 1, 16, 11, 'k'); r(1, 2, 14, 9, '#7a4a2a'); r(2, 3, 12, 7, '#1f3a2a'); r(4, 5, 2, 2, '#e8e4dc'); r(10, 5, 2, 2, '#e8e4dc'); r(5, 8 + f, 6, 1, '#e8e4dc'); r(3, 3, 3, 1, '#9ab8a8'); r(9, 9, 4, 1, '#9ab8a8'); r(3, 11, 2, 5, 'k'); r(11, 11, 2, 5, 'k'); r(4, 12, 1, 3, '#7a4a2a'); r(12, 12, 1, 3, '#7a4a2a'); r(13, 11, 2, 2, '#e8e4dc'); }),
  saudade: f => cv4(16, 16, r => { r(5, 1, 6, 2, 'k'); r(3, 3, 10, 9, 'k'); r(4, 3, 8, 8, '#8aa0c0'); r(6, 2, 4, 2, '#8aa0c0'); r(5, 4, 3, 2, '#c0d0e8'); r(5, 6, 2, 1, 'k'); r(9, 6, 2, 1, 'k'); r(5, 7, 1, 1, '#c0e8ff'); r(10, 7, 1, 1, '#c0e8ff'); r(7, 9, 2, 1, '#4a5a7a'); r(5 + f, 11, 3, 2, '#8aa0c0'); r(9 - f, 12, 2, 3, '#8aa0c0'); r(7, 13, 1, 2, '#c0d0e8'); }),
  memdoor: (col, f) => cv4(16, 16, r => { r(2, 0, 12, 16, '#07050c'); r(2, 0, 12, 1, col); r(2, 0, 1, 16, col); r(13, 0, 1, 16, col); for (let y = 2; y < 16; y += 3) r(3, y + (f % 2), 10, 1, '#1a1424'); r(6, 5, 3, 3, col); r(8, 1, 1, 6, col); r(9, 1, 2, 1, col); r(4 + f * 4, 10, 1, 1, '#ffffff'); r(11 - f * 3, 13, 1, 1, '#ffffff'); }),
  classdoor: f => cv4(16, 16, r => { r(1, 0, 14, 16, 'k'); r(2, 1, 12, 15, '#8a5a34'); r(2, 1, 12, 1, '#a87850'); r(4, 3, 8, 5, 'k'); r(5, 4, 6, 3, '#9ab8c8'); r(5, 4, 2, 1, '#ffffff'); r(5, 9, 6, 3, '#e8dcc0'); r(6, 10, 4, 1, '#3a3448'); r(11, 11, 2, 2, '#f0c040'); }),
  itin: f => cv4(16, 16, r => { r(7, 8, 2, 8, 'k'); r(0, 0, 16, 9, 'k'); r(1, 1, 14, 7, '#1c3058'); r(1, 1, 14, 1, '#3a70c0'); r(2, 4, 12, 1, '#ffe066'); for (const [x, c] of [[2, '#f07830'], [6, '#7ad0f0'], [10, '#ffb0d8'], [13, '#c83838']]) r(x, 3, 2, 3, c); r(3, 6, 2, 1, '#e8e4dc'); }),
  caderno: f => cv4(16, 16, r => { r(3, 3 + f, 10, 11, 'k'); r(4, 4 + f, 8, 9, '#c8a050'); for (let y = 5; y < 13; y += 2) r(3, y + f, 2, 1, '#9aa0aa'); r(6, 6 + f, 5, 1, '#5a3420'); r(6, 8 + f, 4, 1, '#5a3420'); r(7, 11 + f, 3, 1, '#c83838'); }),
  diarioC: f => cv4(16, 16, r => { r(3, 3 + f, 10, 11, 'k'); r(4, 4 + f, 8, 9, '#2a6a3a'); r(4, 4 + f, 1, 9, '#1a4a2a'); r(6, 6 + f, 5, 3, '#e8dcc0'); r(7, 7 + f, 3, 1, '#3a3448'); r(9, 12 + f, 2, 3, '#c83838'); }),
  papagaio: f => cv4(16, 16, r => { r(5, 2, 7, 11, 'k'); r(6, 3, 5, 9, '#4a9a4a'); r(6, 3, 5, 3, '#8ac85a'); r(9, 4, 1, 1, 'k'); r(10, 5, 3, 2, 'k'); r(11, 5, 2, 1, '#e8dcc0'); r(6, 7 + f, 3, 4, '#2a6a3a'); r(5, 12, 2, 3, '#c83838'); r(8, 12, 2, 4, '#f0c040'); r(3, 13, 10, 1, '#5a3420'); }),
  valdir: f => cv4(16, 16, r => { r(3, 5, 10, 10, 'k'); r(4, 6, 8, 8, '#6a8a4a'); r(4, 6, 8, 2, '#8aaa6a'); r(5, 8, 2, f === 1 ? 1 : 2, f === 1 ? 'k' : '#ffffff'); r(9, 8, 2, f === 1 ? 1 : 2, f === 1 ? 'k' : '#ffffff'); if (f !== 1) { r(6, 9, 1, 1, 'k'); r(10, 9, 1, 1, 'k'); } r(4, 6, 3, 1, '#e8e4dc'); r(9, 6, 3, 1, '#e8e4dc'); r(6, 12, 4, 1, '#3a4a2a'); r(2, 13, 12, 2, '#5a4a3a'); }),
  mancha: f => cv4(16, 16, r => { r(1, 7, 14, 7, '#120e14'); r(3, 6, 10, 9, '#120e14'); r(4, 8, 8, 4, '#1c1824'); r(5 + f, 9, 3, 1, '#3a3448'); r(6, 8, 5, 3, 'k'); r(7, 9, 3, 1, f ? '#ffe066' : '#f0c040'); }),
  tachoW: f => cv4(16, 16, r => { r(1, 5, 14, 10, 'k'); r(2, 6, 12, 8, '#5a5a66'); r(2, 6, 12, 2, '#e0a030'); r(3 + f, 6, 2, 1, '#fff4c0'); r(9 - f, 7, 2, 1, '#fff4c0'); r(4, 9, 2, 2, '#ffffff'); r(10, 9, 2, 2, '#ffffff'); r(5, 10, 1, 1, 'k'); r(10, 10, 1, 1, 'k'); r(6, 12, 4, 1, 'k'); r(0, 8, 2, 2, 'k'); r(14, 8, 2, 2, 'k'); r(5, 2, 6, 3, '#e8dcc0'); r(6, 1, 4, 1, '#e8dcc0'); }),
  p32W: f => cv4(16, 16, r => { r(3, 0, 10, 16, 'k'); r(4, 1, 8, 14, '#3a4a5a'); r(4, 1, 8, 2, '#5a6a7a'); r(5, 3, 6, 5, '#05030a'); r(6, 5, 1, 1, f ? '#ffe066' : '#05030a'); r(9, 5, 1, 1, f ? '#ffe066' : '#05030a'); r(5, 10, 6, 2, '#e8dcc0'); r(6, 10, 1, 2, '#3a3448'); r(8, 10, 2, 1, '#3a3448'); r(3, 2, 2, 2, '#3a70c0'); r(11, 12, 2, 3, '#ffb0d8'); })
};
const MAESTRO_C = { G: '#2a4a6a', m: '#1a2a3a', l: '#c8962a', y: '#f0c040', S: '#a8c0c8', h: '#5a7a7a', b: '#1a2a3a' };
function buildSprites6() {
  const add = (c, fn) => { fn(c.getContext('2d')); return c; };
  const R = (x, a, b, w, h, col) => { x.fillStyle = PAL[col] || col; x.fillRect(a, b, w, h); };
  for (const k of ['pombo', 'carrinho', 'lousa', 'saudade', 'classdoor', 'itin', 'caderno', 'diarioC', 'papagaio', 'valdir', 'mancha', 'tachoW', 'p32W']) SP[k] = [S6[k](0), S6[k](1)];
  for (const [k, t] of Object.entries(TUNES)) SP['door_' + k] = [S6.memdoor(t.col, 0), S6.memdoor(t.col, 1)];
  SP.door_final = [S6.memdoor('#ffffff', 0), S6.memdoor('#ffffff', 1)];
  const two = (map, fn) => [0, 1].map(f => add(hum(map), x => fn && fn(x, f)));
  SP.padeira = two({ fem: true, G: 'w', m: '#c8c0b8', l: '#e8e4dc', S: '#d8b090', h: '#8a7a6a', y: 'w' }, (x, f) => { R(x, 5, 2, 6, 2, 'w'); R(x, 3, 9, 2, 3, '#a87850'); });
  SP.ozorio = two({ G: '#e8e4dc', m: '#d8a070', l: '#e8b890', S: '#d8a070', h: '#8a8a90', y: '#c83838' }, (x, f) => { R(x, 5, 6, 6, 1, '#6a6a70'); R(x, 6, 8, 4, 3, '#c83838'); R(x, 12, 8 + f, 3, 2, '#e8c890'); });
  SP.neide = two({ fem: true, G: '#c0d0e0', m: '#b8b8c8', l: '#e8e8f0', S: '#d8e0e8', h: '#a8a8b8', y: '#e8e4dc' }, (x, f) => { R(x, 5, 5, 2, 1, '#5a6a7a'); R(x, 9, 5, 2, 1, '#5a6a7a'); R(x, 13, 7 - f, 1, 5, '#e8e4dc'); });
  SP.duda = two({ fem: true, G: '#3a70c0', m: '#2a1410', l: '#5a3420', S: '#a86a40', h: '#2a1410', y: '#f0c040' }, (x, f) => { R(x, 1, 10 + f, 3, 3, '#6a7084'); R(x, 2, 11 + f, 1, 1, '#f0c040'); });
  SP.marlene = two({ fem: true, G: '#c06a8a', m: '#e8e8f0', l: '#ffffff', S: '#e0b090', h: '#e8e8f0', y: '#f0c040' }, (x, f) => { for (const [a, b] of [[5, 1], [8, 1], [10, 2]]) R(x, a, b, 2, 2, '#ff9ab8'); R(x, 13, 3 - f, 1, 9, '#c0c8d0'); R(x, 12, 9 - f, 3, 1, '#f0c040'); });
  SP.feirante = two({ G: '#7a8a9a', m: '#5a6a7a', l: '#7a8a9a', S: '#a8b0b8', h: '#6a7a8a', y: '#9aa0aa' }, (x, f) => { R(x, 5, 9, 6, 3, '#c8c8d0'); R(x, 13, 7 + f, 3, 3, '#c89060'); });
  SP.bedel = two({ G: '#e8e4dc', m: '#d0ccc4', l: '#ffffff', S: '#e8e4dc', h: '#c0bcb4', y: '#8a8099' }, (x, f) => { R(x, 13, 5 + f, 1, 6, '#ffffff'); R(x, 5, 5, 6, 1, '#8a8099'); });
  SP.musico = two({ G: '#2a4a6a', m: '#1a2a3a', l: '#3a5a7a', S: '#a8c0c8', h: '#5a7a7a', y: '#c8962a' }, (x, f) => { R(x, 9, 7, 6, 6, 'k'); R(x, 10, 8, 4, 4, '#e0a830'); R(x, 12, 4 - f, 3, 4, '#e0a830'); R(x, 11, 9, 2, 2, '#fff4c0'); R(x, 2, 12, 2, 2, '#4a7a6a'); });
  SP.semrosto = two({ G: '#3a4a5a', m: '#3a4a5a', l: '#5a6a7a', S: '#2a3240', h: '#3a4a5a', y: '#5a6a7a' }, (x, f) => { R(x, 5, 4, 6, 3, '#05030a'); R(x, 6, 5, 1, 1, f ? '#8aa0c0' : '#05030a'); R(x, 9, 5, 1, 1, f ? '#8aa0c0' : '#05030a'); R(x, 4, 12, 8, 1, '#2a3240'); });
  SP.maestroW = two(MAESTRO_C, (x, f) => { R(x, 12, 3 + f * 2, 1, 6, '#e8e4dc'); R(x, 4, 1, 8, 1, '#c8962a'); R(x, 3, 13, 2, 2, '#4a7a6a'); });
}
function buildTiles6(T) {
  const base = T.floor || '#3a3440', speck = T.speck || '#443e4a', dark = T.dark || '#2e2834';
  const AW = [['#c83838', '#f2ecdc'], ['#3a70c0', '#f2ecdc'], ['#4a9a4a', '#f0c040'], ['#f07830', '#fff4c0']];
  TILE.A = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); const [c1, c2] = AW[Math.floor(R() * 4)]; x.fillStyle = PAL.k; x.fillRect(0, 1, 16, 8); for (let i = 0; i < 16; i += 4) { x.fillStyle = i % 8 ? c2 : c1; x.fillRect(i, 2, 4, 5); } x.fillStyle = PAL.k; x.fillRect(0, 7, 16, 2); x.fillStyle = '#7a4a2a'; x.fillRect(1, 9, 14, 4); x.fillStyle = PAL.k; x.fillRect(0, 13, 16, 1); const fr = ['#f07830', '#4a9a4a', '#c83838', '#f0c040', '#e86890']; for (let i = 2; i < 14; i += 3) { x.fillStyle = fr[Math.floor(R() * fr.length)]; x.fillRect(i, 9, 2, 2); } x.fillStyle = '#5a3420'; x.fillRect(1, 14, 1, 2); x.fillRect(14, 14, 1, 2); }, 601);
  TILE.S = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(2, 4, 12, 7); x.fillStyle = '#a87850'; x.fillRect(3, 5, 10, 4); x.fillStyle = '#c89868'; x.fillRect(3, 5, 10, 1); x.fillStyle = '#5a6070'; x.fillRect(3, 11, 1, 4); x.fillRect(12, 11, 1, 4); x.fillStyle = '#e8e4dc'; x.fillRect(5, 6, 4, 2); }, 602);
  TILE.E = tileCanvas((x, R) => { x.fillStyle = T.wall || '#4a4456'; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; x.fillRect(0, 2, 16, 11); x.fillStyle = '#1f3a2a'; x.fillRect(0, 3, 16, 9); x.fillStyle = '#9ab8a8'; x.fillRect(2 + Math.floor(R() * 4), 5, 6, 1); x.fillRect(3, 8, 4 + Math.floor(R() * 6), 1); x.fillStyle = '#7a4a2a'; x.fillRect(0, 12, 16, 2); x.fillStyle = '#e8e4dc'; x.fillRect(11, 12, 3, 1); }, 603);
  TILE.I = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(6, 9, 4, 7); x.fillStyle = '#5a3a24'; x.fillRect(7, 9, 2, 7); x.fillStyle = PAL.k; x.fillRect(1, 0, 14, 11); x.fillStyle = '#2a5a3a'; x.fillRect(2, 1, 12, 9); x.fillStyle = '#4a8a4a'; x.fillRect(3, 2, 7, 4); x.fillStyle = '#6aaa5a'; x.fillRect(4, 2, 3, 2); }, 604);
  TILE.U = tileCanvas((x, R) => { floorPaint(x, R, base, speck, dark); x.fillStyle = PAL.k; x.fillRect(0, 1, 16, 4); x.fillStyle = '#3a70c0'; x.fillRect(0, 2, 16, 2); x.fillStyle = '#5a90e0'; x.fillRect(0, 2, 16, 1); x.fillStyle = '#9aa0aa'; x.fillRect(1, 5, 1, 11); x.fillRect(14, 5, 1, 11); x.fillStyle = 'rgba(191,232,240,0.35)'; x.fillRect(2, 5, 12, 7); x.fillStyle = '#8a5a34'; x.fillRect(2, 11, 12, 2); }, 605);
  TILE.C = tileCanvas((x, R) => { x.fillStyle = base; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; x.fillRect(0, 0, 16, 16); x.fillStyle = '#e8e4dc'; x.fillRect(0, 1, 16, 14); x.fillStyle = '#b8b4ac'; for (let i = 1; i < 16; i += 3) x.fillRect(i, 4, 1, 8); x.fillStyle = '#c8962a'; x.fillRect(0, 1, 16, 2); x.fillRect(0, 12, 16, 2); x.fillStyle = '#6a8a4a'; x.fillRect(0, 14, 16, 1); }, 606);
  TILE.R6 = tileCanvas((x, R) => { x.fillStyle = T.wall || '#4a4456'; x.fillRect(0, 0, 16, 16); x.fillStyle = PAL.k; x.fillRect(0, 1, 16, 15); for (let i = 0; i < 16; i += 5) { x.fillStyle = ['#3a70c0', '#4a9a4a', '#c8962a', '#c83838'][Math.floor(R() * 4)]; x.fillRect(i, 2, 4, 13); x.fillStyle = PAL.k; x.fillRect(i + 1, 4, 2, 1); x.fillRect(i + 1, 6, 2, 1); x.fillStyle = '#e8e4dc'; x.fillRect(i + 2, 9, 1, 2); } }, 607);
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildSprites6(); buildBossSprites6(); buildPorts6(); }; }
{ const _bt = buildTiles; buildTiles = function (theme) { _bt(theme); buildTiles6(theme || {}); }; }
{ const _st = solidTile; solidTile = function (c) { if ('ASEIUC'.includes(c)) return true; /* 'R' saiu: travava a Estrada Afogada do Cap. 4 */ return _st(c); }; }
Object.assign(LOOK, {
  A: ['* Uma barraca de feira. Laranja a três por dois, alface murcha, um rádio de pilha tocando baixinho.', '* Toldo listrado e caixas de tomate. Alguém escreveu no papelão: "HOJE TEM, AMANHÃ NÃO SEI".', '* Uma barraca de temperos. Cheira a segunda-feira de manhã.'],
  S: ['* Uma carteira escolar. Alguém riscou "D + R" com compasso.', '* Uma carteira com chiclete grudado embaixo. Fossilizado.', '* "Não esqueçam: prova na sexta." A data nunca chega.'],
  E: ['* A lousa diz: "CHAMADA — copiar 100 vezes: EU SEI QUEM EU SOU". A letra vai tremendo até o fim.', '* Uma lousa cheia de contas. O resultado de todas é 31.'],
  I: ['* Uma árvore de praça, com um banco de cimento embaixo. Tem um coração entalhado: "V + M".', '* Uma árvore torta. Os pombos têm opinião forte sobre ela.'],
  U: ['* Um abrigo de ônibus. O itinerário está colado no vidro: PADARIA — FEIRA — ESCOLA — CORETO — PONTO FINAL.', '* Um abrigo de ônibus com propaganda de colchão. O modelo do cartaz não tem rosto.'],
  C: ['* O gradil branco do coreto. A tinta está descascando em formato de nota musical.', '* O coreto. Embaixo dele alguma coisa enorme respira, devagar.'],
  R: ['* Armários de metal, cada um com um número de 1 a 31.', '* Um armário trancado. Pelo vão, dá para ver um boné e uma marmita.']
});
Object.assign(LOOK_K, {
  padaria: ['* Caixotes de pão francês. Ainda quentes. Você não lembra quem assava.', '* Engradados de leite em saquinho. Tem uma vaca desenhada que você jurava que sorria.'],
  feira: ['* Caixotes de laranja-lima. "Docinha, freguesa!"', '* Um caixote de bananas que ninguém vai comer. Ficam perfeitas para sempre, como numa foto.', '* Caixas de pastel congelado. A etiqueta diz: "OZÓRIO — FEIRA DE SEGUNDA".'],
  escola: ['* Caixas de giz. Um giz azul quebrado ao meio, como sempre.', '* Livros didáticos empilhados. Todos abertos na mesma página: "UNIDADE 3 — QUEM SOMOS".'],
  coreto: ['* Estojos de instrumento, molhados. Um saxofone tem uma etiqueta: "BANDA MUNICIPAL DE VELHÁGUA".', '* Partituras encharcadas. A de cima se chama "Valsa para quem fica".'],
  pontofinal: ['* Malas sem dono, em fila, como se esperassem a vez.', '* Caixotes com etiquetas de bagagem: 4, 5, 9, 15, 22... Faltam números.']
});
Object.assign(K_REGION, { padaria: 'padaria', feira: 'feira', escola: 'escola', coreto: 'coreto', pontofinal: 'pontofinal' });

// ---------- chefes grandes (48x48, 4 quadros) ----------
const BIGSP6 = {
  // Tacho Fervente: o Seu Ozório virou o próprio tacho de fritura, com chapéu de papel e pastéis voando
  tacho: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, steel = '#6a6a76', stH = '#9a9aa6', stD = '#3a3a44', oil = '#e0a030', oilH = '#ffd060';
    // cabos do tacho
    r(0, 24, 8, 5, 'k'); r(1, 25, 6, 3, stD); r(40, 24, 8, 5, 'k'); r(41, 25, 6, 3, stD);
    // corpo do tacho
    EO(24, 32, 18, 12, steel); E(24, 35, 17, 9, stD); E(24, 30, 16, 8, steel); r(8, 26, 32, 2, stH);
    // óleo fervendo na boca
    EO(24, 22, 16, 5, oil); E(24, 22, 14, 3, oilH); for (let i = 0; i < 5; i++) { const bx0 = 13 + i * 5 + ((f + i) % 2), by = 21 - ((f + i * 2) % 3); E(bx0, by, 1, 1, '#fff4c0'); }
    // rosto no metal
    EO(17, 32, 3, 3, '#ffffff'); EO(31, 32, 3, 3, '#ffffff'); r(17, 32, 2, 2, 'k'); r(30, 32, 2, 2, 'k'); r(16, 31, 1, 1, '#ffffff');
    L(13, 27, 20, 29, 'k', 2); L(35, 27, 28, 29, 'k', 2); EO(24, 38, 5, 2 + (f % 2), '#3a0a10'); r(21, 37, 6, 1, '#f2ecdc');
    // chapéu de papel de pasteleiro
    r(15, 2, 18, 10, 'k'); r(16, 3, 16, 8, '#f2ecdc'); r(16, 9, 16, 2, '#d8d0c0'); r(18, 0, 12, 4, 'k'); r(19, 1, 10, 3, '#f2ecdc'); r(26, 5, 3, 3, '#c83838');
    // pastéis voando em volta
    for (let i = 0; i < 3; i++) { const a = f * 0.9 + i * 2.1, px = 24 + Math.round(Math.cos(a) * 22), py = 12 + Math.round(Math.sin(a) * 6); r(px - 4, py - 2, 8, 5, 'k'); r(px - 3, py - 1, 6, 3, '#e8b860'); r(px - 3, py - 1, 6, 1, '#f8d890'); for (let j = -2; j < 3; j += 2) r(px + j, py + 2, 1, 1, '#c89040'); }
    // respingos de óleo
    if (f % 2) { r(6, 14, 2, 2, oilH); r(40, 12, 2, 2, oilH); } else { r(9, 10, 1, 1, oilH); r(37, 16, 1, 1, oilH); }
    // avental amarrado
    r(4, 30, 4, 2, '#c83838'); r(40, 30, 4, 2, '#c83838');
  }),
  // Maestro Afogado: farda da banda municipal, alga no ombro, batuta de osso e uma tuba que respira
  maestro: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, uni = '#2a4a6a', uniH = '#3a6a8a', uniD = '#1a2a3a', gold = '#c8962a', goldH = '#f0c040', skin = '#a8c0c8', skinD = '#7a9aa8';
    // tuba atrás
    EO(10, 30, 9, 9, '#c89030'); E(10, 30, 7, 7, '#e0a830'); E(10, 30, 4, 4, '#3a2a10'); E(8, 27, 2, 2, '#fff4c0'); L(16, 36, 22, 40, '#c89030', 3);
    for (let i = 0; i < 3; i++) { const q = ((f + i) % 4) / 4; E(10 - q * 8, 22 - q * 14, 1 + i % 2, 1 + i % 2, '#bfe8f0'); }
    // corpo de farda
    r(18, 22, 18, 24, 'k'); r(19, 23, 16, 23, uni); r(19, 23, 3, 23, uniH); r(32, 23, 3, 23, uniD);
    for (const y of [26, 31, 36]) { r(26, y, 2, 2, goldH); r(20, y, 12, 1, gold); }
    r(18, 22, 5, 3, gold); r(31, 22, 5, 3, gold); for (let i = 0; i < 5; i++) r(18 + i, 25, 1, 2 + (i % 2), goldH);
    // alga pendurada
    L(33, 23, 36, 34, '#3a7a5a', 2); L(36, 34, 34, 40, '#3a7a5a', 2); r(34, 28, 2, 2, '#5aaa7a');
    // cabeça afogada
    EO(27, 14, 7, 8, skin); E(27, 18, 6, 3, skinD); r(23, 12, 3, 3, '#ffffff'); r(29, 12, 3, 3, '#ffffff'); r(24, 13, 2, 2, '#1c3058'); r(30, 13, 2, 2, '#1c3058');
    r(23, 17, 9, 2, '#e8e4dc'); r(22, 16, 2, 1, '#e8e4dc'); r(31, 16, 2, 1, '#e8e4dc'); r(25, 20, 5, 1, '#3a5a6a');
    // quepe da banda
    r(19, 2, 16, 8, 'k'); r(20, 3, 14, 6, uni); r(20, 3, 14, 1, uniH); r(24, 4, 6, 4, gold); r(25, 5, 4, 2, goldH); r(18, 8, 18, 2, 'k'); r(19, 8, 8, 1, '#3a5a7a'); r(28, 0, 2, 3, '#e86890');
    // braço com a batuta (marca o compasso)
    const bt = [[44, 6], [46, 14], [44, 20], [40, 12]][f];
    L(34, 26, 40, 20, 'k', 4); L(34, 26, 40, 20, uni, 2); r(39, 18, 4, 4, 'k'); r(40, 19, 2, 2, skin); L(41, 19, bt[0], bt[1], '#f2ecdc', 1); r(bt[0] - 1, bt[1] - 1, 2, 2, '#ffffff');
    // notas que saem da batuta
    for (let i = 0; i < 2; i++) { const nx = 40 + i * 4 - f, ny = 4 + ((f * 3 + i * 5) % 10); r(nx, ny, 2, 2, '#ffb0d8'); r(nx + 1, ny - 4, 1, 4, '#ffb0d8'); }
    // pernas na poça
    r(21, 44, 5, 4, uniD); r(28, 44, 5, 4, uniD); E(27, 47, 14, 2, 'rgba(122,208,240,0.4)');
  }),
  // O Passageiro 32: capa de chuva costurada com tudo o que o 31 esqueceu. Não tem rosto, só um bilhete.
  p32: () => big(48, 48, g => {
    const { r, E, EO, L, f, s } = g, coat = '#3a4a5a', coatH = '#5a6a7a', coatD = '#232c38';
    // névoa embaixo
    for (let i = 0; i < 6; i++) E(8 + i * 7, 45 + (i + f) % 2, 5, 2, 'rgba(192,208,232,0.35)');
    // capa de chuva (corpo comprido)
    r(12, 12, 24, 34, 'k'); r(13, 13, 22, 33, coat); r(13, 13, 4, 33, coatH); r(31, 13, 4, 33, coatD);
    for (let y = 18; y < 44; y += 6) r(23, y, 2, 2, '#9aa0aa');
    // remendos costurados: cada um é uma lembrança roubada
    r(15, 22, 7, 6, 'k'); r(16, 23, 5, 4, '#e8b860'); r(16, 23, 5, 1, '#f8d890'); for (let i = 16; i < 21; i += 2) r(i, 27, 1, 1, '#c89040'); // o pastel
    r(27, 28, 7, 6, 'k'); r(28, 29, 5, 4, '#c06a8a'); r(29, 30, 1, 2, '#ffb0d8'); r(31, 30, 1, 2, '#ffb0d8'); // a valsa (flor do vestido)
    r(15, 34, 6, 5, 'k'); r(16, 35, 4, 3, '#2a6a3a'); r(17, 36, 2, 1, '#e8dcc0'); // o diário
    for (const [a, b, w, h] of [[15, 22, 7, 6], [27, 28, 7, 6], [15, 34, 6, 5]]) for (let i = a; i < a + w; i += 2) r(i, b - 1, 1, 1, '#e8e4dc');
    // braços longos, um segurando uma alça de ônibus
    L(13, 16, 6, 30, 'k', 4); L(13, 16, 6, 30, coat, 2); L(35, 16, 42, 4 + f, 'k', 4); L(35, 16, 42, 4 + f, coat, 2);
    r(39, 0, 8, 3, '#9aa0aa'); E(43, 5 + f, 3, 3, 'k'); E(43, 5 + f, 2, 2, '#e8e4dc');
    // capuz e o vazio onde seria o rosto
    EO(24, 9, 11, 9, coat); E(24, 11, 8, 7, '#05030a'); r(14, 5, 20, 2, coatH);
    // quepe do Jorge por cima do capuz
    r(15, 0, 18, 5, 'k'); r(16, 1, 16, 3, '#2a4a8a'); r(21, 1, 6, 2, '#f0c040'); r(13, 4, 22, 2, 'k');
    // olhos que piscam de outras pessoas
    const eyes = [['#3a2418', '#ffffff'], ['#ffe066', '#05030a'], ['#7ad0f0', '#ffffff'], ['#05030a', '#05030a']][f];
    r(19, 10, 3, 2, eyes[1]); r(26, 10, 3, 2, eyes[1]); r(20, 10, 1, 2, eyes[0]); r(27, 10, 1, 2, eyes[0]);
    // o bilhete "32" pendurado no peito
    r(19, 15, 10, 6, 'k'); r(20, 16, 8, 4, '#e8dcc0'); r(21, 17, 2, 2, '#c83838'); r(24, 17, 3, 1, '#3a3448'); r(24, 19, 3, 1, '#3a3448');
    // fone da Lume pendurado
    L(30, 14, 33, 22, '#3a3448', 1); E(33, 23, 2, 2, '#ffb0d8');
  })
};
function buildBossSprites6() { SP.tachoB = BIGSP6.tacho(); SP.maestroB = BIGSP6.maestro(); SP.p32B = BIGSP6.p32(); }

// ---------- retratos ----------
function buildPorts6() {
  PORT.ozorio = bust({ skin: '#d8a070', hair: '#8a8a90', style: 'bald', cloth: '#e8e4dc', collar: '#c83838', eyes: '#3a2418', stache: '#6a6a70' });
  PORT.neide = bust({ skin: '#e0c0a0', hair: '#a8a8b8', style: 'bun', cloth: '#5a7aa8', collar: '#e8e4dc', eyes: '#3a5a7a', glasses: '#8a6a3a', lips: '#a05050' });
  PORT.duda = bust({ skin: '#a86a40', hair: '#2a1410', style: 'messy', cloth: '#3a70c0', vest: '#6a7084', badge: '#f0c040', eyes: '#3a2418' });
  PORT.marlene = pcv((r, fr, x) => { const b = bust({ skin: '#e0b090', hair: '#e8e8f0', style: 'bun', cloth: '#c06a8a', collar: '#ffffff', eyes: '#5a4a3a', earring: '#f0c040', lips: '#c05070' })[fr]; x.drawImage(b, 0, 0); for (const [a, c] of [[9, 4], [14, 3], [19, 4]]) { r(a, c, 4, 3, 'k'); r(a + 1, c, 2, 2, '#ff9ab8'); } r(23, 18, 2, 1, '#ff9aaa'); r(8, 18, 2, 1, '#ff9aaa'); });
  PORT.maestro = bust({ skin: '#a8c0c8', hair: '#5a7a7a', style: 'short', cloth: '#2a4a6a', collar: '#c8962a', badge: '#f0c040', eyes: '#1c3058', stache: '#e8e4dc' });
  PORT.padeira = bust({ skin: '#d8b090', hair: '#8a7a6a', style: 'bun', cloth: '#f2ecdc', eyes: '#3a2418', blush: true });
  PORT.valdir = pcv((r, fr) => { r(6, 10, 20, 22, 'k'); r(7, 11, 18, 21, '#6a8a4a'); r(7, 11, 18, 4, '#8aaa6a'); r(4, 28, 24, 4, '#5a4a3a'); r(8, 9, 7, 3, '#e8e4dc'); r(17, 9, 7, 3, '#e8e4dc'); if (fr === 2) { r(10, 15, 4, 1, 'k'); r(18, 15, 4, 1, 'k'); } else { r(10, 14, 4, 3, '#ffffff'); r(18, 14, 4, 3, '#ffffff'); r(11, 15, 2, 2, 'k'); r(19, 15, 2, 2, 'k'); } r(12, 23, 8, fr === 1 ? 3 : 1, '#3a4a2a'); r(14, 19, 4, 2, '#5a7a3a'); });
  PORT.p32 = pcv((r, fr) => { r(4, 6, 24, 26, 'k'); r(5, 7, 22, 25, '#3a4a5a'); r(5, 7, 22, 3, '#5a6a7a'); r(8, 10, 16, 14, '#05030a'); const e = [['#3a2418', '#ffffff'], ['#ffe066', '#05030a'], ['#05030a', '#05030a']][fr]; r(11, 15, 3, 2, e[1]); r(18, 15, 3, 2, e[1]); r(12, 15, 1, 2, e[0]); r(19, 15, 1, 2, e[0]); r(6, 2, 20, 6, 'k'); r(7, 3, 18, 4, '#2a4a8a'); r(13, 3, 6, 3, '#f0c040'); r(12, 26, 8, 5, 'k'); r(13, 27, 6, 3, '#e8dcc0'); r(14, 28, 1, 1, '#c83838'); });
}
for (const k of ['ozorio', 'neide', 'duda', 'marlene', 'maestro', 'padeira', 'valdir', 'p32']) WHO[k] = { name: () => ({ ozorio: 'Seu Ozório', neide: 'Profª Neide', duda: 'Duda', marlene: 'Dona Marlene', maestro: 'Maestro', padeira: 'Padeira', valdir: 'Seu Valdir', p32: 'Passageiro 32' })[k], portrait: t => portFrame(k, t), voice: ({ ozorio: () => sfx('blipLow', 150), neide: () => sfx('blip', 560), duda: () => sfx('blip', 700), marlene: () => sfx('blip', 820), maestro: () => sfx('blipLow', 120), padeira: () => sfx('blip', 640), valdir: () => sfx('blipLow', 85), p32: () => sfx('blipTri', 300 + Math.random() * 900) })[k], col: ({ p32: '#c0d0e8', maestro: '#bfe8f0', valdir: '#d8f0b8' })[k] };
WHO.p32.fx = 'shake';
WHO.tacho = { name: () => 'Tacho Fervente', portrait: () => SP.tachoW[0], voice: () => sfx('blipLow', 140), col: '#ffd060' };
WHO.papagaio = { name: () => 'Papagaio', portrait: () => SP.papagaio[0], voice: () => sfx('blipTri', 1400) };

// ---------- música ----------
Object.assign(TRACKS, {
  padaria: { bpm: 84, bars: 4, chords: 'Fmaj7 Em7 Dm7 Cmaj7', bass: 'root5', bassVol: 0.09,
    lead: 'A5:4 C6:2 A5:2 G5:8 | G5:4 B5:2 G5:2 E5:8 | F5:4 A5:2 F5:2 D5:4 F5:4 | E5:12 .:4', leadWave: 'triangle', leadVol: 0.07, arp: { rate: 2, vol: 0.016, pat: [0, 1, 2, 3] }, pad: true, padVol: 0.02 },
  feira: { bpm: 126, bars: 4, chords: 'G C D G', bass: 'root5', bassVol: 0.13,
    lead: 'D5:2 G5:2 B5:2 G5:2 A5:2 B5:2 G5:4 | E5:2 G5:2 C6:2 B5:2 A5:4 G5:4 | F#5:2 A5:2 D6:2 C6:2 B5:2 A5:2 F#5:4 | G5:4 B5:4 G5:8', leadWave: 0.25, leadVol: 0.06, arp: { rate: 1, vol: 0.014, pat: [0, 2, 1, 2] }, drums: 'k.hsk.h.k.hsk.hh', hatVol: 0.025 },
  escola: { bpm: 100, bars: 4, chords: 'C G Am F', bass: 'pulse', bassVol: 0.1,
    lead: 'E5:4 G5:4 C6:4 G5:4 | D5:4 G5:4 B5:8 | C5:4 E5:4 A5:4 E5:4 | F5:4 A5:4 C6:8', leadWave: 0.125, leadVol: 0.06, arp: { rate: 2, vol: 0.014, pat: [0, 1, 2, 1] }, drums: 'k...h...k...h.h.', hatVol: 0.02 },
  coreto: { bpm: 90, bars: 4, chords: 'F C7 C7 F', bass: 'root5', bassVol: 0.1,
    lead: 'A5:6 C6:2 F6:4 E6:4 | D6:6 C6:2 Bb5:4 G5:4 | Bb5:6 A5:2 G5:4 E5:4 | F5:12 .:4', leadWave: 'triangle', leadVol: 0.08, arp: { rate: 2, vol: 0.016, pat: [0, 1, 2, 1] }, pad: true, padVol: 0.02 },
  pontofinal: { bpm: 60, bars: 4, chords: 'Am Fmaj7 Dm E', bass: 'whole', bassVol: 0.07,
    lead: 'E5:8 C5:8 | A4:8 C5:4 B4:4 | D5:8 F5:4 E5:4 | E5:12 .:4', leadWave: 'triangle', leadVol: 0.06, pad: true, padVol: 0.03 },
  boss6: { bpm: 150, bars: 8, chords: 'Dm Bb C A Dm Bb Gm A', bass: 'oct8', bassVol: 0.16,
    lead: 'D5:2 F5:2 A5:2 D6:2 C6:4 A5:4 | Bb5:2 A5:2 F5:2 D5:2 F5:4 Bb5:4 | C6:4 G5:2 E5:2 C5:4 E5:4 | C#5:2 E5:2 A5:4 G5:2 E5:2 C#5:4 | D5:2 A5:2 D5:2 A5:2 F5:4 D5:4 | Bb5:4 F5:4 D5:4 Bb4:4 | G5:2 Bb5:2 D6:2 G6:2 F6:4 E6:4 | E6:4 C#6:4 A5:4 E5:4',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04 },
  valsa: { bpm: 96, bars: 4, chords: 'F C F C', bass: 'whole', bassVol: 0.08,
    lead: 'F5:6 A5:2 C6:4 D6:4 | G5:6 B5:2 D6:4 C6:4 | A5:6 C6:2 F6:4 E6:4 | E6:4 D6:4 C6:8', leadWave: 'triangle', leadVol: 0.09, pad: true, padVol: 0.03 }
});

// ---------- inimigos: as Lembranças ----------
// Todos são feitos de memória. Os com "calm" vão embora em paz com o elemento certo (o Avaliar diz qual).
Object.assign(ENEMIES, {
  pombo: { name: 'Pombo de Praça', sp: 'pombo', hp: 300, atk: 80, def: 16, evade: 0.15, xp: 150, weak: { brasa: 1.3, vento: 1.3 }, drops: [['pao', .25]],
    calm: { els: ['canto', 'seiva'], need: 2, msg: 'ganhou migalhas de lembrança e ficou feliz', bye: 'voou para o telhado do coreto' },
    flavor: ['* O Pombo de Praça estufa o peito. Ele já viu tudo nesta praça.', '* Ele bica o chão onde um dia teve pipoca.'],
    check: 'Bicadas rápidas, em bando. ACALMAR: CANTO ou SEIVA (2). VENTO e BRASA espantam.',
    moves: [
      { k: 'dodge', p: 0.45, hits: 3, spd: 1.3, w: 3, t: '* Bicada, bicada, bicada!' },
      { k: 'ring', p: 1, w: 2, t: '* O Pombo dá um rasante na sua tampa!' },
      { k: 'buff', stat: 'hide', turns: 2, w: 1, t: '* O Pombo se mistura com os outros pombos. Qual era ele mesmo?' }] },
  carrinho: { name: 'Carrinho de Feira', sp: 'carrinho', hp: 400, atk: 84, def: 36, xp: 170, weak: { faisca: 1.5, polvora: 1.3, bite: 0.7 }, drops: [['caldo', .2]],
    flavor: ['* O Carrinho de Feira range. Uma roda gira para o lado errado, sempre.', '* Ele está cheio de compras de alguém que nunca chegou em casa.'],
    check: 'Ferro e teimosia. Atropela e prende. FAÍSCA e PÓLVORA. Não tem lembrança para acalmar: é só um carrinho.',
    moves: [
      { k: 'ring', p: 1.2, w: 2, t: '* O Carrinho desce a ladeira na sua direção!' },
      { k: 'mash', p: 0.9, need: 14, bind: true, w: 2, t: '* Sua tampa fica presa na grade do carrinho!' },
      { k: 'buff', stat: 'shell', ally: true, turns: 2, w: 1, t: '* O Carrinho para na frente do aliado, de escudo.' }] },
  feirante: { name: 'Feirante Desbotado', sp: 'feirante', hp: 420, atk: 86, def: 20, xp: 180, weak: { sombra: 1.3, brasa: 1.2 }, drops: [['pastel', .2]],
    calm: { els: ['canto', 'seiva'], need: 3, msg: 'lembrou do nome da filha, que ajudava na barraca', bye: 'foi para casa com a sacola cheia' },
    flavor: ['* O Feirante Desbotado grita preços que não existem mais.', '* "Olha a laranja!" A voz dele falha no meio.'],
    check: 'Grita (silêncio) e joga fruta. ACALMAR: CANTO ou SEIVA (3). Ele só quer lembrar.',
    moves: [
      { k: 'ring', p: 0.85, st: 'silence', w: 1, t: '* "OLHA A LARANJA!" O pregão te deixa sem voz.' },
      { k: 'dodge', p: 0.5, hits: 3, spd: 1.2, w: 3, t: '* Laranjas voando! Três por dois!' },
      { k: 'heal', frac: 0.2, name: 'Chorinho', w: 1, t: '* O Feirante coloca um chorinho a mais na sacola do aliado.' }] },
  lousa: { name: 'Lousa Viva', sp: 'lousa', hp: 440, atk: 84, def: 24, xp: 180, weak: { sal: 1.5, vento: 1.2 }, drops: [['caldo', .2]],
    calm: { els: ['canto', 'tinta'], need: 2, msg: 'leu a resposta certa escrita nela e sorriu', bye: 'se apagou sozinha, como no fim da aula' },
    flavor: ['* A Lousa Viva escreve uma pergunta que você não consegue ler.', '* Giz range. Todo mundo sente arrepio.'],
    check: 'Mostra a matéria e apaga (memória). Faz esquecer. SAL apaga. ACALMAR: CANTO ou TINTA (2).',
    moves: [
      { k: 'seq', n: 5, p: 0.45, hide: true, w: 3, t: '* "Copiem do quadro!" As setas aparecem e somem. Decore!' },
      { k: 'spell', p: 0.9, el: 'tinta', name: 'Ditado Surpresa', st: 'forget', w: 2, t: '* A Lousa dita um {b}Ditado Surpresa{/}. Sua cabeça esvazia.' },
      { k: 'ring', p: 1.1, w: 1, t: '* O apagador voa na sua direção!' }] },
  bedel: { name: 'Bedel de Giz', sp: 'bedel', hp: 400, atk: 90, def: 22, xp: 180, weak: { vento: 1.4, geada: 1.2 }, drops: [['cordinha', .2]],
    flavor: ['* O Bedel de Giz anda pelo corredor contando passos.', '* "Fora da sala sem autorização?"'],
    check: 'Pega pela orelha e manda calar. VENTO espalha o giz. Não tem calma: ele só cumpre ordens.',
    moves: [
      { k: 'ring', p: 0.9, st: 'silence', w: 1, t: '* "SILÊNCIO NO CORREDOR!"' },
      { k: 'mash', p: 1, need: 15, bind: true, w: 2, t: '* O Bedel te pega pela alça e não solta!' },
      { k: 'seq', n: 4, p: 0.55, spd: 1.2, w: 2, t: '* Ele bate o giz quatro vezes na sua tampa. Bem marcado.' }] },
  musico: { name: 'Músico Afogado', sp: 'musico', hp: 420, atk: 88, def: 20, xp: 190, weak: { faisca: 1.3, sal: 1.2 }, drops: [['caldo', .2]],
    calm: { els: ['canto'], need: 2, msg: 'reconheceu a melodia e baixou o instrumento', bye: 'guardou a tuba e foi descansar' },
    flavor: ['* O Músico Afogado sopra a tuba. Sai água e uma nota triste.', '* Ele usa a farda da Banda Municipal de Velhágua.'],
    check: 'Ondas de som e fanfarra para os aliados. ACALMAR: só CANTO (2). Ele toca há tempo demais.',
    moves: [
      { k: 'dodge', p: 0.55, hits: 3, spd: 1.25, w: 2, t: '* Ondas de som saem da tuba!' },
      { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* FANFARRA! O aliado fica mais forte.' },
      { k: 'spell', p: 1, el: 'canto', name: 'Marcha Fúnebre', w: 2, t: '* O Músico toca uma {p}Marcha Fúnebre{/}.' }] },
  saudade: { name: 'Saudade', sp: 'saudade', hp: 360, atk: 84, def: 18, xp: 170, weak: { brasa: 1.4, bite: 0.5 }, drops: [['caldo', .25]],
    biteMsg: 'Seus dentes passam por ela como por neblina. Pouco efeito.',
    calm: { els: ['canto', 'brasa'], need: 2, msg: 'se aqueceu com uma lembrança boa', bye: 'virou um suspiro e foi embora' },
    flavor: ['* A Saudade flutua devagar. Dá vontade de ligar para alguém.', '* Ela chora gotas que caem para cima.'],
    check: 'Rouba PM e faz esquecer. Mordida quase não pega. ACALMAR: CANTO ou BRASA (2).',
    moves: [
      { k: 'ring', p: 0.8, drain: 10, w: 2, t: '* A Saudade te abraça. Dá um frio por dentro.' },
      { k: 'spell', p: 0.9, el: 'geada', name: 'Lágrima ao Contrário', st: 'forget', w: 2, t: '* {c}Lágrima ao Contrário{/}! Ela cai para cima e leva uma lembrança junto.' },
      { k: 'heal', frac: 0.25, name: 'Consolo', w: 1, t: '* A Saudade consola o aliado.' }] },
  semrosto: { name: 'Passageiro Sem Rosto', sp: 'semrosto', hp: 600, atk: 96, def: 30, xp: 280, elite: true, weak: { canto: 1.3, faisca: 1.2 }, drops: [['pastel', .3]],
    calm: { els: ['canto'], need: 4, msg: 'ouviu o próprio nome em algum lugar da música', bye: 'voltou a ter um rosto por um segundo, e sorriu' },
    flavor: ['* O Passageiro Sem Rosto segura uma alça que não está presa em nada.', '* Ele já foi alguém do 31. Ele não lembra quem.'],
    check: 'Alma do 31 que esqueceu tudo. Forte e preciso. ACALMAR: só CANTO (4). Não desista dele.',
    big: { k: 'seq', n: 7, p: 0.45, hide: true, pierce: true, spd: 1.1 },
    moves: [
      { k: 'seq', n: 6, p: 0.45, hide: true, spd: 1.1, w: 2, t: '* O Passageiro mostra o itinerário e esconde. Ele não lembra; você precisa lembrar.' },
      { k: 'ring', p: 1.35, pierce: true, fast: true, w: 2, t: '* Uma freada que não aconteceu te joga para a frente!' },
      { k: 'mash', p: 1.05, need: 16, bind: true, w: 1, t: '* Ele te puxa pela alça para a fila!' }] },
  tacho: { name: 'Tacho Fervente', sp: 'tachoB', hp: 2500, atk: 88, def: 22, xp: 900, boss: true, ai: 'tacho', weak: { geada: 1.4, sal: 1.2 },
    flavor: ['* O Tacho Fervente borbulha. "Olha o pastel! Três e cinquenta!"', '* O óleo chia como chuva no toldo.'], flavor2: ['* O chapéu de papel dele está queimado na ponta.', '* "...Bia? Bia, cadê o troco?"'],
    check: 'Óleo quente queima. Ele prepara uma FRITURA grande. GEADA esfria o óleo (e cancela a fritura).' },
  maestro: { name: 'Maestro Afogado', sp: 'maestroB', hp: 3100, atk: 90, def: 24, xp: 1500, boss: true, ai: 'maestro', weak: { faisca: 1.2, sal: 1.2 },
    flavor: ['* O Maestro Afogado bate a batuta na estante. A banda obedece.', '* "A praça não pode ficar em silêncio. Nunca."'], flavor2: ['* A farda dele escorre água.', '* Ele marca um compasso que ninguém mais escuta.'],
    check: 'Marca o COMPASSO antes de cada golpe (rápido, pesado ou pausa). Com a banda tocando, bate mais forte: CANTO acalma os músicos. No SOLO, cante (CANTO) para cancelar.' },
  p32: { name: 'O Passageiro 32', sp: 'p32B', hp: 4300, atk: 96, def: 28, xp: 2600, boss: true, ai: 'p32', weak: { canto: 1.25 },
    flavor: ['* O Passageiro 32 fala com a voz do Seu Jorge: "Segura firme."', '* Ele cheira a chuva e a óleo de pastel.'], flavor2: ['* Os remendos do casaco brilham, um de cada vez.', '* "Eu sou tudo que vocês largaram no banco."'],
    check: 'Feito do que o 31 esqueceu. BILHETERIA: devolve o seu último feitiço (engula!). LOTAÇÃO: cada alma que você fez lembrar responde "Presente!" e bloqueia um golpe. CANTO fere mais.' }
});
// tamanhos reais na batalha: pombo, carrinho e saudade são pequenos
EN_TINY.add('pombo'); EN_TINY.add('carrinho');

// ---------- chefes ----------
const AI6 = {
  async tacho(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) { e.p2 = true; e.phase = 2; shake(16); sfx('rumble'); await bSay('* O Tacho para de borbulhar por um segundo. "...Três e cinquenta. Era três e cinquenta, né?"', { auto: 55 }); e.atk += 5; return; }
    if (e.charge) { e.charge = false; if (e.cooled) { e.cooled = false; await bSay('* O óleo esfriou. A fritura gigante sai murcha.', { auto: 45 }); return runMove(e, { k: 'ring', p: 0.9, t: '* Um pastel morno bate na sua tampa. Plof.' }); } return runMove(e, { k: 'dodge', p: 0.6, hits: 5, spd: 1.3, st: 'burn', t: '* FRITURA DE SEGUNDA! Óleo fervendo para todo lado!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* O Tacho esquenta até o óleo ficar branco. (Uma fritura enorme vem aí. GEADA esfria.)', { auto: 55 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'dodge', p: 0.45, hits: 3, spd: 1.25, w: 2, t: '* Pastéis voando! Cuidado que está quente!' },
      { k: 'ring', p: 0.9, st: 'burn', w: 2, t: '* Uma concha de óleo quente!' },
      { k: 'mash', p: 1, need: 15, bind: true, w: 1, t: '* O Tacho te embrulha em papel de pão!' },
      { k: 'heal', frac: 0.08, name: 'Gole de Caldo de Cana', w: 1, t: '* O Tacho toma um gole de caldo de cana. "Esse é por conta da casa."' }]));
  },
  async maestro(e) {
    const band = BT.en.filter(x => x !== e && x.alive && x.hp > 0);
    if (!e.p2 && e.hp <= e.mhp * 0.5) {
      e.p2 = true; e.phase = 2; shake(20); sfx('rumble');
      await bSay('A praça engoliu a gente numa terça. A banda estava no meio da valsa.', { col: '#bfe8f0' });
      await bSay('Se a música parar, a praça acaba. Então ela NÃO PARA.', { col: '#bfe8f0' });
      if (!band.length) { BT.en.push(Object.assign(mkEnemy('musico', 1, 3), { x: 206, y: 126 - 16 })); await bSay('* Um Músico Afogado sobe da poça e pega a tuba de novo.', { auto: 50 }); }
      e.atk += 6; return;
    }
    if (e.solo) {
      e.solo = false;
      if (BT.lastAct === 'spell' && BT.lastSpell && BT.lastSpell.el === 'canto') { sfx('rune'); await bSay('* Você canta por cima do solo! O Maestro perde o compasso e a batuta escorrega.', { auto: 55 }); e.shell = 0; e.def = Math.max(10, e.def - 3); return; }
      return runMove(e, { k: 'seq', n: e.p2 ? 8 : 7, p: 0.5, spd: 1.15, t: '* SOLO DE TUBA! Cada nota é um golpe!', fx: 'shake' });
    }
    const amp = band.length ? 1.25 : 1;
    if (e.turns % 4 === 0) { e.solo = true; await bSay('* O Maestro aponta a batuta para você: "SOLO!" (No seu turno, use CANTO para cantar por cima.)', { auto: 60 }); return; }
    const tempo = e.turns % 4 === 1 ? 'allegro' : e.turns % 4 === 2 ? 'adagio' : 'fermata';
    if (tempo === 'fermata') { await bSay('* FERMATA. O Maestro segura a batuta no ar. Tudo para... e a banda respira.', { auto: 45 }); for (const b of band) b.atkBuff = { m: 1.3, t: 2 }; if (band.length) await bSay('* A banda fica mais forte.', { auto: 30 }); return; }
    if (tempo === 'allegro') return runMove(e, { k: 'dodge', p: 0.42 * amp, hits: band.length ? 5 : 4, spd: 1.35, t: `* ALLEGRO! Golpes rápidos no ritmo da batuta${band.length ? ', com a banda inteira' : ''}!` });
    return runMove(e, { k: 'spell', p: 1.4 * amp, el: 'canto', name: 'Adagio', t: `* ADAGIO. Uma nota lenta e pesada, como um bumbo${band.length ? ', com a banda junto' : ''}. (Engula!)` });
  },
  async p32(e) {
    // fase 2 e 3
    if (!e.p2 && e.hp <= e.mhp * 0.6) {
      e.p2 = true; e.phase = 2; shake(20); sfx('rumble');
      await bSay('Vocês largam tudo no banco. Guarda-chuva, fone, o gosto das coisas, o nome dos filhos.', { col: '#c0d0e8' });
      await bSay('Alguém tinha que guardar. EU GUARDEI. Eu sou o passageiro que faltava.', { col: '#c0d0e8' });
      await bSay('* O 32 abre o casaco. Lá dentro, uma fila inteira de rostos apagados. LOTAÇÃO!', { auto: 60 }); return;
    }
    if (!e.p3 && e.hp <= e.mhp * 0.25) {
      e.p3 = true; e.phase = 3; shake(26); sfx('rumble');
      await bSay('Falta um. Falta você, trinta e um. Me dá o seu nome e a coleção fecha.', { col: '#c0d0e8' });
      e.charge = true; await bSay('* O 32 começa a ler a sua ficha de trás para frente. (Prepare-se. Âncora ou Sino de Bolso cancelam.)', { auto: 60 }); return;
    }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'seq', n: 8, p: 0.5, hide: true, pierce: true, spd: 1.1, t: `* COLEÇÃO! As letras de "${G.name}" aparecem, embaralham e somem. Lembre delas!`, fx: 'shake' }); }
    // Bilheteria: devolve o seu último feitiço
    if (e.turns % 3 === 1 && BT.lastSpell && BT.lastSpell.form !== 'veu') {
      const sp = BT.lastSpell;
      return runMove(e, { k: 'spell', p: 1.35, el: sp.el, name: sp.name, t: `* BILHETERIA! O 32 te devolve o seu próprio {${elTag(sp.el)}}${sp.name}{/}. (Engula!)` });
    }
    // Lotação: os desbotados vêm como golpes; quem lembrou responde "Presente!"
    if (e.p2 && e.turns % 3 === 2) {
      const lost = lostSouls(), ok = soulsNames(), hits = Math.max(1, 3 + lost - Math.min(4, ok.length));
      const blockers = ok.slice(0, Math.min(4, ok.length));
      if (blockers.length) await bSay(`* "PRESENTE!" ${blockers.join(', ')} ${blockers.length > 1 ? 'entram' : 'entra'} na frente da fila.`, { auto: 55 });
      return runMove(e, { k: 'dodge', p: 0.5, hits, spd: 1.3, t: `* LOTAÇÃO! ${hits} passageiro${hits > 1 ? 's' : ''} sem rosto passa${hits > 1 ? 'm' : ''} por você!` });
    }
    if (e.turns % 4 === 3) { e.charge = true; await bSay('* O 32 ergue a alça do ônibus. "Próxima parada: o seu nome." (Prepare-se. Âncora cancela.)', { auto: 55 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'ring', p: 1.2, pierce: true, w: 2, t: '* Ele bate com a alça, com a força do Seu Jorge.' },
      { k: 'seq', n: 6, p: 0.45, spd: 1.15, w: 2, t: '* Ele imita a catraca: gira, gira, gira!' },
      { k: 'spell', p: 1.25, el: 'canto', name: 'Canção Sem Final', st: 'forget', w: 2, t: '* Ele canta a música da Lume, mas para no meio. {p}Canção Sem Final{/}.' },
      { k: 'mash', p: 1.05, need: 16, bind: true, w: 1, t: '* O casaco te engole até a metade!' }]));
  }
};
Object.assign(AI, AI6);
// GEADA esfria o tacho e cancela a fritura
{ const _ch = calmHit; calmHit = function (t, el, log) { _ch(t, el, log); if (t.id === 'tacho' && el === 'geada' && t.charge && !t.cooled) { t.cooled = true; log.push('* O óleo do Tacho esfria com a Geada!'); } }; }

// ---------- história ----------
MAPS.garagem.ents.push({ id: 'mancha6', kind: 'npc2', x: 10, y: 4, sp: 'mancha', talk: 'mancha6', cond: 'ch5done', glow: 'rgba(255,224,102,0.22)' });
Object.assign(STORY, {
  async mancha6() {
    if (G.flags.ch6open) { await say('* A mancha de óleo. A faixa amarela continua descendo pelo concreto, até onde a vista não alcança.'); return; }
    await say('* A mancha de óleo onde o 31 afundou. No meio dela, o bilhete carimbado brilha, como se alguém estivesse soprando uma brasa.');
    await say('Baú. Olha o chão.', 'lume');
    await say('* Uma faixa amarela, igual às de corredor de ônibus, aparece no concreto e desce. Ela atravessa a parede como se a parede não estivesse ali.');
    const c = await choose('* Seguir a faixa amarela? (Começa o Capítulo 6.)', ['Seguir', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    await STORY.ch6start();
  },
  async ch6start() {
    await say('* Antes de você descer, o Musgo aparece na porta da garagem, com uma vela de rato acesa no ombro.');
    await say('A LINHA ESTÁ PUXANDO GENTE, PEQUENO BAÚ. DO NOSSO LADO E DO LADO DE CIMA. QUEM NÃO LEMBRA QUEM É... VAI.', 'musgo');
    await say('EU FICO E SEGURO A TRINCHEIRA. VOCÊ VAI E TRAZ TODO MUNDO DE VOLTA.', 'musgo');
    playMusic(null); sfx('flee'); await fadeOut(16); V.scene = 'black'; await fadeIn(1);
    await say('* Você pisa na faixa amarela. Ela te leva sem pedir licença.', 'void');
    await say('* É como andar de ônibus de olhos fechados: você sente as curvas, as lombadas, as paradas.', 'void');
    await say('* Uma cordinha toca. PLIM.', 'void');
    G.flags.ch6open = true; tunes();
    await fadeOut(10); loadMap('padaria', 11, 10, 'down'); V.scene = 'world'; await fadeIn(24);
    await say('* Uma rua de manhã cedo. O céu tem aquela cor de quem acordou antes do despertador.');
    await say('* Um abrigo de ônibus azul. Uma padaria com a vitrine embaçada. Um poste com um adesivo de "COMPRO OURO".');
    await say('...É o meu ponto. O ponto da padaria. Eu descia aqui todo dia.', 'me');
    await say('* Algumas coisas estão nítidas demais: o rachado no meio-fio, a lixeira laranja, o cheiro de pão.');
    await say('* Outras estão borradas, como uma foto mexida. O letreiro da padaria. O rosto da moça do balcão.');
    await say('A masmorra montou o trajeto do 31 com o que cada passageiro lembrava. Esse pedaço é seu, baú.', 'lume');
    await say('Então por que tá borrado?', 'me');
    await say('...Porque você nunca olhou direito. A gente nunca olha direito pro que vê todo dia.', 'lume');
    sfx('catalog'); await say('[Linha 31 — itinerário restaurado: PADARIA, FEIRA, ESCOLA, CORETO, PONTO FINAL.]', 'cat');
    await say('[Coleção no Ponto Final: 22 de 31 almas. Contagem em andamento.]', 'cat');
    await say('Vinte e duas já estão lá. A gente precisa chegar antes que ela termine de contar.', 'lume');
    await say('* A Lume cantarola baixinho a música dela, a do fundo do ônibus. E para no meio, como sempre.');
    await say('Você nunca canta o final.', 'me');
    await say('Eu nunca lembrei como termina. Faz anos. Desde antes do clarão.', 'lume');
    sfx('catalog'); await say('[Capítulo 6: {y}Almas do 31{/}.]', 'cat');
    await grantTechs(false); saveGame();
  },
  async itin6() {
    const k = tunes(), f = G.flags;
    await say('* O itinerário da Linha 31, colado no vidro do abrigo. Alguém marcou as paradas com caneta de cor.');
    const st = [['FEIRA', 'pregao', 'oeste'], ['ESCOLA', 'recreio', 'norte'], ['CORETO', 'valsa', 'leste']].map(([n, t, d]) => `${k.includes(t) ? '{g}♪{/}' : '·'} ${n} (${d})`).join('  ');
    await say(`* ${st}\n* PONTO FINAL (sul): só com as três canções.`);
    await say(`* Almas do 31 que lembram quem são: {y}${soulsCount()}{/}. (${soulsNames().join(', ')})`);
  },
  async padeira6() {
    const f = G.flags;
    if (!f.padeiraTalk) {
      f.padeiraTalk = true;
      await say('* A moça do balcão está na porta da padaria. O rosto dela é uma mancha clara, como um dedo na lente.');
      await say('Bom dia, menino do fone. O de sempre?', 'padeira');
      await say('O de... sempre.', 'me');
      await say('* Você tenta lembrar o que era "o de sempre". Pão na chapa? Média? Você não sabe.');
      await say('Eu passei aqui todo dia por três anos. E eu nunca soube o nome dela.', 'me');
      await say('Ela sabia que você usava fone. Já é mais do que a maioria das pessoas sabe da gente.', 'lume');
      return;
    }
    if (f.ch6Gift === 'pastel') { await say('Bom dia! Hoje tem pastel de feira, quentinho. Você sempre levava um no caminho, lembra?', 'padeira'); await say('...Lembro. Agora eu lembro.', 'me'); return; }
    await say(pickOne(['Bom dia, menino do fone.', 'Chuva hoje à tarde, viu? Leva guarda-chuva.', 'O ônibus atrasou de novo? Senta aí, toma um café.']), 'padeira');
  },
  // ---------- FEIRA ----------
  async feiraFirst() {
    await wait(20);
    await say('* Uma feira de rua inteira, com toldo listrado, caixote de fruta e rádio de pilha. Tudo um pouco desbotado, como uma foto antiga.');
    await say('* Feirantes gritam preços para ninguém. Um pombo anda de costas.');
    await say('É a feira de segunda. A da rua de baixo do ponto. A Dona Cida descia aqui.', 'me');
  },
  async cida6() {
    const f = G.flags;
    if (!f.cida6Met) {
      f.cida6Met = true;
      await say('* Sentada num caixote, com as patas cruzadas e um guarda-chuva do lado, uma gata fantasma de óculos.');
      if (f.cidaDone) {
        await say('Ora, se não é o baú do pastel! E o lustre!', 'cida');
        await say('Dona Cida! A senhora não ficou na cela?', 'me');
        await say('Fiquei. Aí a cela começou a andar, meu bem. A linha puxa a gente pelo pé, igual ao ônibus quando arranca.', 'cida');
        await say('Mas eu resisti. Sabe por quê? Eu sei quem eu sou. Aparecida dos Santos, alma número sete, banco preferencial, óculos dourados.', 'cida');
        await say('Quem lembra o próprio nome, ela não consegue levar. Só leva quem esqueceu.', 'cida');
      } else {
        await say('...Quem é? Eu não enxergo direito. Perdi os óculos numa muralha, eu acho. Ou foi aqui?', 'cida');
        await say('* Ela pisca devagar. O contorno dela está ficando transparente, como os feirantes.');
        await say('Dona Cida! Sou eu, o baú! A gente se conheceu na Jaula!', 'me');
        await say('Baú...? Eu conhecia um menino que comia pastel aqui. Será que era você? Eu não lembro, meu bem. Tá tudo tão longe.', 'cida');
        await say('Ela está desbotando. Igual aos feirantes. Baú, ela tá sendo puxada.', 'lume');
        await say('Se a gente achar alguma coisa com o nome dela, alguma coisa daqui da feira... talvez ela lembre.', 'lume');
      }
      await say('O Seu Ozório, do pastel, virou um tacho. Fica lá no fundo da feira, gritando preço. Ele não sabe mais quem é.', 'cida');
      await say('Ele anotava tudo num caderninho de fiado. Tudo! Até o meu caldo de cana. Se acharem o caderno, quem sabe ele lembra.', 'cida');
      await say('Achei que vi o caderno voando para aquele quartinho do meio, onde guardam as caixas. Tem uma porta de luz amarela lá.', 'cida');
      await say('Porta de luz amarela... É da cor da minha música. Talvez ela abra com a canção do ônibus.', 'lume');
      sfx('catalog'); await say('[PORTAS DE MEMÓRIA: fale com elas e escolha a melodia certa. A Lume toca, você repete as setas.]', 'cat');
      await say('[LEMBRANÇAS: alguns monstros são feitos de memória. O elemento certo (veja no Avaliar) os ACALMA e eles vão embora em paz.]', 'cat');
      return;
    }
    if (soulOk('cida')) await say(pickOne(['Cuidado com os pombos. Esses daqui têm opinião.', 'O caldo de cana era fiado. Eterno. O Ozório nunca cobrou.', 'Vai, meu bem. Eu vou ficar aqui olhando a feira mais um pouquinho.']), 'cida');
    else await say('...Eu conheço vocês? Desculpa, meu bem. Tá tudo tão longe.', 'cida');
  },
  async caderno6() {
    if (G.flags.cadernoGot) return;
    G.flags.cadernoGot = true; sfx('item'); refreshEnts();
    await say('* Um caderno de capa dura, com espiral torta e manchas de óleo. Na capa, a caneta: "FIADO — OZÓRIO — NÃO EMPRESTA".');
    await say('* Lá dentro, página por página, uma letra redonda e cuidadosa:');
    await say('* "Dona Cida — caldo de cana c/ limão — fiado eterno."\n* "Seu Valdir e Dna. Marlene — 2 pastel de carne — pagaram com um bolo."');
    await say('* "Menino do fone — 2 pastel de queijo — paga segunda."');
    await say('...Eu devo dois pastéis pro homem.', 'me');
    await say('* Na última página, um desenho de giz de cera: um homem de avental, gigante, e uma menina do lado. "PAI, VOLTA CEDO. — BIA".');
    await say('* (Você guardou o {y}Caderno de Fiado{/}.)');
  },
  async ozorio6() {
    const f = G.flags;
    if (f.soul_ozorio === 'lembrou') { await say(pickOne(['Freguês! Olha o pastel! Pra você é fiado, mas eu anoto.', 'A Bia ia gostar de você. Ela gostava de bicho esquisito.', 'Dois pastéis de queijo, menino. Tô anotando.']), 'ozorio'); return; }
    if (f.soul_ozorio === 'perdido') return;
    if (f.cadernoGot) {
      playMusic('padaria');
      await say('* O Tacho Fervente borbulha atrás da barraca. "Olha o pastel! Três e cinquenta! Três e cinquenta!"', 'tacho');
      await say('* Você abre a tampa e mostra o caderno de fiado.');
      await say('* O óleo para de ferver.');
      await say('...Fiado. Fiado eterno. Dona Cida.', 'tacho');
      await say('* Ele lê devagar, página por página. O metal começa a esfriar e a ficar pálido, e depois cor de pele.');
      await say('Menino do fone. Dois de queijo. Paga segunda.', 'tacho');
      await say('* Na última página, ele para. A menina de giz de cera.');
      await say('...Bia.| A minha Bia. Eu ia voltar cedo naquele dia. Eu prometi.', 'ozorio');
      await say('* Onde estava o tacho, agora está um homem grande de avental, careca, de bigode grisalho, chorando em cima de um caderno.');
      await say('Ozório Ferreira. Pasteleiro. Banco nove. Eu lembro, rapaz. Eu lembro de tudo.', 'ozorio');
      await say('E você me deve dois pastéis.', 'ozorio');
      await say('Eu sou um baú.', 'me');
      await say('Baú paga também. Tá anotado.', 'ozorio');
      f.soul_ozorio = 'lembrou'; f.ozorioDone = true; f.ozorioLembrou = true;
      if (!soulOk('cida')) { f.soul_cida = 'lembrou'; await say('* A Dona Cida chega devagar e lê o próprio nome no caderno: "caldo de cana, fiado eterno". Ela ri, e o contorno dela volta a ficar firme.'); await say('Aparecida. Eu sou a Aparecida. Ai, meu Deus, que susto, meu bem.', 'cida'); }
      await say('Toma. Pregão da feira. Eu gritava isso toda segunda, cinco da manhã. Abre qualquer porta daqui.', 'ozorio');
      learnTune('pregao'); sfx('rune'); await say('* A Lume aprendeu o {o}Pregão da Feira{/}!');
      giveItem('pastel', 3); await say('* Você recebeu {y}Pastel de Feira{/} ×3. "Esses são por conta da casa. Os outros dois, não."');
      refreshEnts(); playMusic(WD.map.music); saveGame();
      return;
    }
    await say('* No fundo da feira, um tacho de ferro do tamanho de uma barraca, com chapéu de papel. O óleo dentro dele ferve e grita.');
    await say('OLHA O PASTEL! TRÊS E CINQUENTA! QUEIJO, CARNE, PALMITO! TRÊS E CINQUENTA!', 'tacho');
    await say('Seu Ozório? Sou eu, o menino do fone...', 'me');
    await say('FREGUÊS SEM DINHEIRO NÃO COME! TRÊS E CINQUENTA!', 'tacho');
    await say('Ele não lembra de nada, baú. A Dona Cida falou do caderno.', 'lume');
    const c = await choose('* O que fazer com o Tacho?', ['Procurar o caderno antes', 'Lutar agora'], 'n', 0);
    if (c === 0) { await say('Espera aqui, Seu Ozório. A gente já volta.', 'me'); await say('TRÊS E CINQUENTA!', 'tacho'); return; }
    await say('* A Lume fica quieta. Você sabe o que ela está pensando.');
    const r = await battle(['tacho'], { boss: true, music: 'boss6', noFlee: true, intro: '* O Tacho Fervente borbulha e cospe óleo!' });
    if (r !== 'win') return;
    f.soul_ozorio = 'perdido'; f.ozorioDone = true; f.ozorioPerdido = true; refreshEnts();
    await say('* O tacho esfria e fica cinza. Por um segundo, aparece o rosto de um homem de bigode, confuso.');
    await say('...Bia? Cadê o troco?', 'tacho');
    await say('* Ele levanta, de avental desbotado, e começa a andar pela faixa amarela, devagar, para o sul. Sem olhar para trás.');
    await say('...A gente devia ter procurado o caderno.', 'lume');
    await say('* Um papagaio pousa na barraca vazia. "OLHA O PASTEL! TRÊS E CINQUENTA!", ele repete, com a voz do dono.');
  },
  async papagaio6() {
    if (!tunes().includes('pregao')) {
      await say('OLHA O PASTEL! TRÊS E CINQUENTA! QUEIJO, CARNE, PALMITO!', 'papagaio');
      await say('Ele grita igual ao Seu Ozório. Dá pra tirar a melodia disso.', 'lume');
      learnTune('pregao'); sfx('rune'); await say('* A Lume aprendeu o {o}Pregão da Feira{/}!');
      return;
    }
    await say(pickOne(['TRÊS E CINQUENTA!', 'FIADO NÃO! FIADO NÃO!', 'BIA! BIA! VOLTA CEDO!']), 'papagaio');
  },
  // ---------- ESCOLA ----------
  async escolaFirst() {
    await wait(20);
    await say('* Uma escola estadual de muro pichado e corredor comprido. As portas das salas estão fechadas.');
    await say('* Lá de dentro vem um som de giz. Muito giz. Sem parar.');
    await say('"Copiem cem vezes." Eu reconheço esse tom de voz. Toda escola tem uma.', 'lume');
  },
  async chamada6(e) {
    const f = G.flags, q = e.q;
    if (f['cham' + q]) return;
    const Q = {
      1: { t: '* Uma porta de sala de aula. No vidro, um bilhete de giz: "CHAMADA. Quem senta no banco 12?"', o: ['Lume', 'Dona Cida', 'Tiago', 'Seu Ozório'], a: 'Lume', ok: 'Presente! ...Ops, era pra você responder. Mas vale.' },
      2: { t: '* Outra porta. No vidro: "CHAMADA. Quem senta no banco 7, o preferencial?"', o: ['Dona Cida', 'Seu Jorge', 'Dona Marlene', 'Lume'], a: 'Dona Cida', ok: 'A porta range: "Presente." Uma voz de velhinha, de longe.' },
      3: { t: '* A última porta, para o pátio. No vidro, a giz, uma letra que treme:\n* "E VOCÊ? QUEM É VOCÊ?"', o: [G.name, 'A alma 31', 'Um baú', 'Ninguém'], a: G.name, ok: '' }
    }[q];
    await say(Q.t);
    const opts = [...Q.o].sort(() => Math.random() - 0.5);
    const i = await choose('* O que você responde?', [...opts, 'Ainda não'], 'n', opts.length);
    if (i < 0 || i >= opts.length) return;
    if (opts[i] === Q.a) {
      f['cham' + q] = true; refreshEnts(); sfx('rune');
      if (q === 3) {
        await say(`${G.name}. Meu nome é ${G.name}.`, 'me');
        await say('* A porta demora a abrir. Como se precisasse confirmar.');
        await say('[...Presente.]', 'cat');
        await say('Você disse o seu nome, baú. Não o número. O seu nome.', 'lume');
      } else await say(Q.ok, q === 1 ? 'lume' : 'n');
      return;
    }
    sfx('cancel'); await say('* A porta escurece. Do fim do corredor, passos de bedel: "RESPOSTA ERRADA. PARA A DIRETORIA."');
    await battle(q === 3 ? ['bedel', 'lousa'] : ['bedel'], { noFlee: false, intro: '* O Bedel de Giz te pega no flagra!' });
  },
  async duda6() {
    const f = G.flags;
    if (!f.dudaMet) {
      f.dudaMet = true; f.soul_duda = 'lembrou';
      await say('* Dentro do banheiro da escola, sentada em cima de um skate quebrado, uma garota de armadura de heroína, com o cabelo cortado torto.');
      await say('Se você for um bedel, eu juro que eu mordo.', 'duda');
      await say('Engraçado você falar isso.', 'me');
      await say('...Um baú falante e um lustre. Tá. Hoje tá tudo normal.', 'duda');
      await say('Duda. Banco vinte e dois, do lado da porta. Eu tinha dezessete anos quando o 31 caiu. Ainda tenho, acho. Aqui o tempo não anda.', 'duda');
      await say('Me invocaram como heroína lá em cima. Me deram uma espada e me mandaram descer. Eu desci, vi o que eles fazem com os bichos... e vim parar no banheiro.', 'duda');
      await say('Os heróis do Andar 3 também estão sendo puxados. Os que já não lembram de casa. Eu vi três passarem pela faixa ontem, de olho vazio.', 'duda');
      await say('E você? Você lembra?', 'lume');
      await say('Lembro. Rua das Acácias, 40, portão verde. Minha mãe grita meu nome inteiro quando tá brava: Maria Eduarda.', 'duda');
      await say('Eu repito isso toda noite. Pra não esquecer.', 'duda');
      await say('* Ela te joga duas cordinhas de ônibus, arrancadas de algum lugar.');
      giveItem('cordinha', 2); sfx('item'); await say('* Você recebeu {y}Cordinha de Parada{/} ×2.');
      await say('Se precisar de mim no Ponto Final, puxa. Eu vou estar lá. Todo mundo vai estar lá, de um jeito ou de outro.', 'duda');
      return;
    }
    await say(pickOne(['Maria Eduarda. Rua das Acácias, 40. Portão verde.', 'A Professora Neide me deu zero em redação uma vez. Eu daria tudo pra ela me dar zero de novo.', 'Não conta pra ninguém que eu choro no banheiro, tá?']), 'duda');
  },
  async diario6() {
    if (G.flags.diarioGot) return;
    G.flags.diarioGot = true; sfx('item'); refreshEnts();
    await say('* Entre os livros inchados, um diário de classe de capa verde. "3º B — Língua Portuguesa — Profª Neide Aparecida Lins".');
    await say('* Lá dentro, a lista de chamada. Trinta e dois nomes. Do lado de cada um, ela escreveu alguma coisa à mão.');
    await say('* "Maria Eduarda — escreve bem, mas não acredita. Insistir." "Kauã — dorme na aula porque trabalha de madrugada. Não acordar."');
    await say('* (Você guardou o {y}Diário de Classe{/}.)');
  },
  async neide6() {
    const f = G.flags;
    if (f.soul_neide === 'lembrou') { await say(pickOne(['Corrigindo: "a gente vamos" não existe. Nem no fim do mundo.', 'Quando eu chamar, vocês respondem. Combinado?', 'A Maria Eduarda está aqui? ...Está. Ótimo. Ótimo.']), 'neide'); return; }
    if (f.soul_neide === 'perdido') return;
    if (!f.diarioGot) {
      await say('* No pátio, uma professora feita de pó de giz anda de um lado para o outro, com uma régua na mão. Os alunos de giz copiam, copiam, copiam.');
      await say('Fila! Em silêncio! Quem não sabe o próprio nome copia cem vezes!', 'neide');
      await say('A senhora sabe o seu?', 'me');
      await say('* Ela para. A régua treme.');
      await say('...Copie cem vezes. Copie cem vezes.', 'neide');
      await say('Ela também esqueceu, baú. Uma professora sem a lista de chamada... Deve estar em algum lugar da escola.', 'lume');
      return;
    }
    playMusic('padaria');
    await say('* Você mostra o diário de classe. A professora de giz pega com as duas mãos, como quem segura um passarinho.');
    await say('3º B. Língua Portuguesa.| ...Neide. Neide Aparecida Lins.', 'neide');
    await say('* O pó de giz cai do rosto dela. Embaixo, uma senhora de óculos de armação grossa e coque grisalho.');
    await say('Eu estava levando as provas para casa. Trinta e duas redações. Eu ia corrigir no ônibus. Eu sempre corrigia no ônibus.', 'neide');
    await say('Eu esqueci o nome deles. Um por um. Era como apagar o quadro.', 'neide');
    await say('* Ela abre o diário e começa a chamada, em voz alta. Cada nome que ela lê, um aluno de giz para de copiar e vai embora.');
    if (f.dudaMet) { await say('Maria Eduarda.', 'neide'); await say('* Do banheiro, lá longe, uma voz de menina responde: "PRESENTE!"'); }
    await say('Banco quinze. Profª Neide. Presente.', 'neide');
    f.soul_neide = 'lembrou';
    await say('Rapaz. Quando você precisar, faça a chamada. Quem lembra de si responde. Sempre.', 'neide');
    G.tech = G.tech || []; if (!G.tech.includes('chamada')) G.tech.push('chamada'); sfx('rune');
    await say(`[Técnica aprendida: {y}Chamada{/}. ${TECH.chamada.desc}]`, 'cat');
    if (!tunes().includes('recreio')) { learnTune('recreio'); await say('E leve o sinal do recreio. Toda criança corre quando ouve.', 'neide'); await say('* A Lume aprendeu o {c}Sinal do Recreio{/}!'); }
    playMusic(WD.map.music); saveGame();
  },
  async sino6() {
    if (tunes().includes('recreio')) { await say('* O sino do pátio. Ele ainda vibra um pouquinho.'); return; }
    await say('* Um sino de escola, de ferro, com uma cordinha. No metal está gravado: "RECREIO".');
    sfx('bell'); shake(4);
    await say('* BLÉN-BLÉN-BLÉN! Os alunos de giz param de copiar por um segundo e olham para a porta.');
    learnTune('recreio'); sfx('rune'); await say('* A Lume aprendeu o {c}Sinal do Recreio{/}!');
    if (G.flags.soul_neide !== 'lembrou') await say('A professora nem olhou. Ela continua contando cópias.', 'lume');
  },
  // ---------- CORETO ----------
  async coretoFirst() {
    await wait(20);
    await say('* Uma praça de cidade pequena, de noite. Postes de ferro, bancos de cimento, árvores podadas em bola.');
    await say('* No meio, um coreto branco. Uma banda inteira toca marcha, de farda encharcada, sem parar.');
    await say('* Embaixo do coreto alguma coisa enorme respira devagar.');
    await say('Essa praça não é do 31. Olha as placas: "Praça da Matriz — Velhágua".', 'lume');
    await say('É a praça que afundou. A do edital. Com a banda dentro.', 'me');
    await say('Então a masmorra não come só gente que cai de outro mundo. Ela tá comendo a cidade de cima também.', 'lume');
  },
  async marlene6() {
    const f = G.flags;
    if (f.marleneFate) { await say(f.marleneFate === 'junto' ? 'Vai, querido. A gente fica. Já dançamos o bastante pra uma vida e meia.' : 'Vamos, querido. Eu dou conta. Já dei conta de coisa pior que fim do mundo.', 'marlene'); return; }
    if (!f.marleneMet) {
      f.marleneMet = true;
      await say('* Num banco de cimento, uma senhora de bobes no cabelo, armadura de heroína por cima do vestido florido e uma espada no colo.');
      await say('Ah, finalmente alguém. Mocinho, você é da banda? Pede pra eles tocarem a valsa.', 'marlene');
      await say('Eu sou um baú, senhora.', 'me');
      await say('Eu tenho setenta e oito anos e me invocaram heroína. Baú falante é o de menos.', 'marlene');
      await say('Marlene. Banco cinco. O quatro era o do meu Valdir, a gente sentava junto há cinquenta e dois anos.', 'marlene');
      await say('A gente se conheceu num coreto igualzinho a esse. Ele me tirou pra dançar a valsa e pisou no meu pé a música inteira.', 'marlene');
      await say('Eu desci o Andar 3 inteiro atrás dele. Tenho certeza que ele tá aqui. Ele sempre ia onde tinha valsa.', 'marlene');
      await say('Mas essa banda só toca marcha. Faz dias. O maestro não deixa parar.', 'marlene');
      return;
    }
    if (f.maestroDone && tunes().includes('valsa')) { await say('A valsa! Eu ouvi a valsa! ...Mas cadê o Valdir? Toca de novo, mocinho, toca perto do coreto.', 'marlene'); return; }
    await say('O maestro fica lá em cima do coreto. Alguém tinha que fazer aquele homem descansar.', 'marlene');
  },
  async valdir6() {
    const f = G.flags;
    if (f.marleneFate) { await say(f.marleneFate === 'junto' ? '* O Seu Valdir dorme de novo, com a Dona Marlene sentada no casco dele, lendo em voz alta.' : '* O Seu Valdir dorme tranquilo. Ele sabe que ela foi. Ele confia.'); return; }
    if (!tunes().includes('valsa')) {
      await say('* Embaixo do coreto sai uma cabeça de jabuti do tamanho de um sofá, com sobrancelhas brancas e grossas. Ele ronca.');
      await say('Zzz... Marlene... a valsa... zzz...', 'valdir');
      await say('O coreto tá em cima dele. Ele virou o coreto, baú. O lugar onde eles se conheceram.', 'lume');
      return;
    }
    await say('* O jabuti ronca. A Lume flutua até perto das sobrancelhas dele.');
    const c = await choose('* Tocar a Valsa do Coreto para o Seu Valdir?', ['Tocar', 'Depois'], 'n', 1);
    if (c !== 0) return;
    const ok = await playTune('valsa'); if (!ok) return;
    playMusic('valsa');
    await say('* O jabuti abre um olho. Depois o outro. A praça inteira parece segurar a respiração.');
    await say('...Marlene?', 'valdir');
    await say('* Do banco, a Dona Marlene levanta tão rápido que um bobe voa longe.');
    await say('VALDIR! Seu velho teimoso! Eu desci três andares atrás de você!', 'marlene');
    await say('...Você... pisou... no meu pé. Na primeira valsa.', 'valdir');
    await say('Quem pisou foi VOCÊ!', 'marlene');
    await say('* Os dois riem. O riso dele é tão lento que termina depois do dela.');
    await say('Valdir Souza. Banco quatro. Marido. Lembro.', 'valdir');
    f.soul_valdir = 'lembrou'; f.soul_marlene = 'lembrou';
    await say('* Mas o chão treme. A faixa amarela começa a puxar a praça inteira para o sul, devagar, como uma toalha de mesa.');
    await say('Eu não saio daqui, Marlene. Eu sou o coreto agora. Se eu sair, a praça cai.', 'valdir');
    await say('Vai com eles. Vai com o menino. Ele vai precisar de alguém que saiba segurar uma espada.', 'valdir');
    await say('Cinquenta e dois anos e você ainda quer mandar em mim.', 'marlene');
    const c2 = await choose('* O que dizer para a Dona Marlene?', ['"Fica com ele."', '"Vem com a gente."'], 'n');
    if (c2 === 0) {
      f.marleneFate = 'junto';
      await say('Fica com ele, Dona Marlene. A gente cuida do resto.', 'me');
      await say('...Obrigada, querido. Eu já ia ficar de qualquer jeito. Mas é bom quando alguém concorda.', 'marlene');
      await say('* Ela sobe no casco dele e senta embaixo do coreto, de espada no colo. A banda, sem maestro, toca a valsa mais uma vez, só para os dois.');
    } else {
      f.marleneFate = 'conosco'; f.marleneGone = true;
      await say('Vem com a gente, Dona Marlene. O Seu Valdir tem razão.', 'me');
      await say('* Ela olha para ele por muito tempo. Ele faz que sim com a cabeça, devagar, como tudo que ele faz.');
      await say('Se eu voltar e você estiver dormindo, Valdir Souza, eu te acordo com a espada.', 'marlene');
      await say('...Promete.', 'valdir');
      await say('* Ela beija a testa dele, ajeita os bobes e anda até você, com a espada no ombro.');
      await say('Vamos, mocinho. Quem vai na frente sou eu.', 'marlene');
    }
    refreshEnts(); playMusic(WD.map.music); saveGame();
  },
  async maestro6() {
    const f = G.flags;
    if (f.maestroDone) return;
    if (!f.maestroSeen) {
      f.maestroSeen = true; playMusic(null);
      await say('* No alto do coreto, um homem de farda de banda, encharcado, de batuta na mão. Ele não para de reger.');
      await say('Fora do compasso! Quem está fora do compasso?!', 'maestro');
      await say('Maestro, a banda tá cansada. O senhor tá tocando há quanto tempo?', 'me');
      await say('Desde terça. A praça afundou numa terça, no meio da valsa. Eu levantei a batuta e não abaixei mais.', 'maestro');
      await say('Teodoro Prates, regente da Banda Municipal de Velhágua há quarenta anos. Se a música parar, a praça acaba. Entendeu? ACABA.', 'maestro');
      await say('Às vezes as coisas precisam acabar pra poder descansar.', 'lume');
      await say('...Uma lustre falando de descanso. Fora do compasso! FORA!', 'maestro');
    } else await say('Tempo! Um, dois, três!', 'maestro');
    const r = await battle(['maestro', 'musico'], { boss: true, music: 'boss6', noFlee: true, intro: '* O Maestro Afogado ergue a batuta. A banda inteira obedece!' });
    if (r !== 'win') return;
    f.maestroDone = true; refreshEnts(); playMusic(null);
    await say('* A batuta cai e quica no piso do coreto. Pela primeira vez em muitos dias, a praça fica em silêncio.');
    await say('* E a praça não acaba.');
    await say('...Ela continua aqui.', 'maestro');
    await say('* O Maestro olha para a banda. Os músicos baixam os instrumentos, um por um, e se sentam no chão do coreto, exaustos.');
    await say('Uma última, maestro. Mas a que a gente quiser.', 'lume');
    await say('* Ele levanta a batuta devagar. A banda toca uma valsa. A Valsa do Coreto. A Lume flutua no meio deles, gravando cada nota.');
    playMusic('valsa'); learnTune('valsa'); sfx('rune');
    await say('* A Lume aprendeu a {p}Valsa do Coreto{/}!');
    await say('Se você subir, menino... lá pra cima, pra Velhágua de verdade... diga que a banda tocou até o fim. Diga que ninguém saiu do compasso.', 'maestro');
    await say('* Ele se deita no chão do coreto, de farda molhada, e fecha os olhos. A banda some com ele, devagar, como bruma no sol.');
    G.flags.maestroBaton = true;
    await giveRune('coro', false, 1);
    await say('* Você guardou a {y}Batuta do Maestro{/}. Ela ainda está morna.');
    playMusic(WD.map.music); saveGame(); await checkEvo();
  },
  // ---------- PORTA FINAL ----------
  async portaFinal() {
    const f = G.flags, k = tunes(), need = ['pregao', 'recreio', 'valsa'];
    if (f.finalOpen) return;
    await say('* Uma porta de luz branca no fim da rua. Ela vibra em três tons diferentes, um depois do outro.');
    const miss = need.filter(t => !k.includes(t));
    if (miss.length) { await say(`Ela pede três músicas, baú. Faltam: ${miss.map(t => TUNES[t].name).join(', ')}.`, 'lume'); return; }
    const pend = [];
    if (f.soul_ozorio !== 'lembrou' && f.soul_ozorio !== 'perdido') pend.push('o Seu Ozório');
    if (f.soul_neide !== 'lembrou') pend.push('a Profª Neide');
    if (!soulOk('cida')) pend.push('a Dona Cida');
    if (pend.length) { await say(`Baú... ${pend.join(', ')} ainda não ${pend.length > 1 ? 'lembraram' : 'lembrou'} quem ${pend.length > 1 ? 'são' : 'é'}. Se a gente passar por essa porta, a linha leva ${pend.length > 1 ? 'eles' : 'a pessoa'}.`, 'lume'); }
    const c = await choose('* Tocar as três canções e abrir o caminho para o Ponto Final?' + (pend.length ? ' (Quem não lembrou será levado.)' : ''), ['Tocar', 'Ainda não'], 'n', 1);
    if (c !== 0) return;
    for (const t of need) { const ok = await playTune(t); if (!ok) { await say('* A porta perde o fio da música. Precisa recomeçar do zero.'); return; } }
    if (f.soul_ozorio !== 'lembrou') f.soul_ozorio = 'perdido';
    if (f.soul_neide !== 'lembrou') f.soul_neide = 'perdido';
    if (!soulOk('cida')) f.soul_cida = 'perdida';
    f.finalOpen = true; refreshEnts(); sfx('rune'); shake(10);
    await say('* As três melodias se juntam numa só. A porta de luz se abre como a porta de um ônibus: com um suspiro.');
    if (pend.length) await say(`* Ao longe, ${pend.join(', ')} ${pend.length > 1 ? 'começam' : 'começa'} a andar pela faixa amarela, para o sul, de olhos vazios.`);
    await say('* A rua continua para o sul, dentro de uma neblina branca. No fim dela, um letreiro aceso: PONTO FINAL.');
    saveGame();
  },
  // ---------- PONTO FINAL ----------
  async pontofinalFirst() {
    await wait(20);
    await say('* Neblina. Um ponto de ônibus no meio do nada, com uma placa: PONTO FINAL. Não tem rua depois dele.');
    await say('* Uma fila de passageiros sem rosto entra, um por um, num ônibus feito de névoa.');
    const lost = [];
    if (G.flags.soul_ozorio === 'perdido') lost.push('um avental de pasteleiro');
    if (G.flags.soul_neide === 'perdido') lost.push('um coque grisalho e uma régua');
    if (G.flags.soul_cida === 'perdida') lost.push('um guarda-chuva com cabo de gato');
    if (lost.length) await say(`* Na fila, você reconhece ${lost.join(', ')}.`);
    await say('* Na frente da fila, alguém de capa de chuva confere os bilhetes. Ele usa o quepe do Seu Jorge.');
  },
  async fila6() {
    await say(pickOne(['* Um passageiro sem rosto segura uma sacola de feira vazia. Ele não olha para você.', '* Uma passageira sem rosto tem um crachá: "TELEMARKETING — PRAZER, MEU NOME É". O resto está em branco.', '* Um passageiro sem rosto cantarola uma música que você quase reconhece.']));
  },
  async p32() {
    const f = G.flags;
    if (f.p32Done) return;
    if (!f.p32Seen) {
      f.p32Seen = true; playMusic(null);
      await say('* A figura de capa de chuva vira para você. Embaixo do capuz não tem rosto. Só escuro e um bilhete pendurado no peito: 32.');
      await say('Segura firme, que a próxima é longa.', 'p32');
      await say('* É a voz do Seu Jorge. Depois, a voz muda.');
      await say('Olha o pastel, três e cinquenta.| Copiem cem vezes.| Quem pisou foi VOCÊ.', 'p32');
      await say('Por que você fala com a voz deles?', 'me');
      await say('Porque é minha. Tudo que vocês largam no banco do ônibus fica comigo. O guarda-chuva. O nome dos alunos. O gosto do pastel.', 'p32');
      await say('Eu sou feito do que vocês esqueceram. Eu sou o passageiro trinta e dois. O que faltava pra coleção.', 'p32');
      await say('Ela me costurou com as suas sobras. E quando a fila entrar, a coleção fecha.', 'p32');
      if (f.marleneFate === 'conosco') await say('Sobra é o seu casaco, rapaz. Sai da frente que eu tenho setenta e oito anos e uma espada.', 'marlene');
      await say('Baú. Tem uma coisa minha naquele casaco. Eu sinto.', 'lume');
    } else await say('Bilhete, por favor.', 'p32');
    const r = await battle(['p32'], { boss: true, music: 'boss6', noFlee: true, intro: '* O Passageiro 32 ergue a alça do ônibus!' });
    if (r !== 'win') return;
    f.p32Done = true; refreshEnts();
    await STORY.p32End();
  },
  async p32End() {
    const f = G.flags; playMusic('pontofinal');
    await say('* O casaco de chuva se rasga nas costuras. De dentro dele saem luzes pequenas, de todas as cores, como vaga-lumes.');
    await say('* As luzes voam de volta para os donos. Um quepe sobe pela névoa, procurando alguém. Um guarda-chuva se abre sozinho.');
    if (soulsCount() > 4) await say('* Na fila, alguns passageiros sem rosto param. Um deles toca o próprio rosto, como quem procura os óculos.');
    await say('* Duas luzes ficam para trás, girando em volta da sua tampa. Elas estão enroscadas uma na outra.');
    await say('* Uma é quente e amarela, e cheira a óleo de feira. Você sabe o que é antes de tocar: o gosto do pastel de queijo. Segunda de manhã. Três e cinquenta.');
    await say('* A outra é pequena e azul, e vibra como uma corda. É o pedaço que faltava da música da Lume. O final.');
    await say('* As duas estão enroscadas. Se você puxar uma, a outra escorrega para o fundo e some.');
    await say('...Pega a sua, baú. É sua. Você pagou por ela.', 'lume');
    const c = await choose('* Qual lembrança você segura?', ['O sabor do pastel (sua)', 'O final da canção (da Lume)'], 'n');
    if (c === 0) {
      f.ch6Gift = 'pastel'; delete f.mem_pastel; f.pastelBack = true;
      await say('* Você abre a tampa e a luz amarela entra.');
      await say('* Queijo derretido que queima o céu da boca. Massa que estala. O Seu Ozório gritando "cuidado que tá quente!" toda segunda, e você nunca tomando cuidado.');
      await say('...Eu lembro. Eu lembro do gosto.', 'me');
      await say('* A luz azul escorrega e afunda na névoa, devagar, como uma nota que acaba.');
      await say('Que bom, baú. De verdade. Eu canto do jeito que eu sempre cantei. Ninguém nunca reclamou.', 'lume');
    } else {
      f.ch6Gift = 'cancao';
      await say('* Você empurra a luz azul na direção da Lume. A amarela escorrega e afunda na névoa, cheirando a feira.');
      await say('Baú... não. Era sua...', 'lume');
      await say('Eu já sei que eu gostava de pastel. Você nunca soube como a sua música termina.', 'me');
      await say('* A luz entra na Lume. O lustre inteiro acende de um jeito que você nunca viu.');
      await say('* Ela canta. A música do fundo do ônibus. Até o fim, pela primeira vez. Termina numa nota alta e comprida, que parece uma porta se abrindo.');
      await say('...Era assim. Era assim que terminava.', 'lume');
      await say('Eu fiz pra minha irmã mais nova dormir. Eu tinha esquecido dela também.| Ela se chama Lívia.', 'lume');
    }
    await wait(30); shake(30); sfx('rumble');
    await say('* O ônibus de névoa se desfaz. A fila de passageiros sem rosto continua andando, para baixo, por uma escada que não estava ali.');
    await say('* No fim da escada, uma porta redonda, enorme, de pedra. Ela tem trinta e uma fechaduras.');
    await say('* Estacionado na frente da porta, com as luzes acesas e o motor ligado, o 31.');
    if (f.tiagoTaken) await say('* Pela janela do ônibus, você vê o Seu Jorge e o Tiago, sentados lado a lado. Eles não se mexem.');
    else await say('* Pela janela do ônibus, você vê o Seu Jorge no banco do motorista, com as mãos no volante. Ele não se mexe.');
    await say('* Do outro lado da porta, alguém bate. Três vezes.');
    await say('OBRIGADA POR ORGANIZAR A FILA, TRINTA E UM.', 'fundo');
    await say('[Coleção: ' + (31 - Math.max(0, soulsCount() - 1)) + ' de 31 almas na porta.]', 'cat');
    await say('* Atrás de você, passos. Muitos.');
    await say('PEQUENO BAÚ. A RESISTÊNCIA DESCEU.', 'musgo');
    const allies = ['ratos-de-vela, cogumelos e lodos de tinta, de vela acesa'];
    if (f.dateDone) allies.push('a Rita, de armadura sem brasão');
    if (f.aprendizesDone || f.free_pip) allies.push('Pip, Nina e Tolo, de escudo erguido');
    if (soulOk('cida')) allies.push('a Dona Cida, de guarda-chuva');
    if (f.dudaMet) allies.push('a Duda, com a espada no ombro');
    if (f.soul_ozorio === 'lembrou') allies.push('o Seu Ozório, com o caderno debaixo do braço');
    if (f.soul_neide === 'lembrou') allies.push('a Profª Neide, de régua na mão');
    await say(`* Atrás do Musgo: ${allies.join('; ')}.`);
    await say('Cada um de vocês que lembrou do próprio nome tem um bilhete carimbado. Eu sinto daqui.', 'lume');
    await say('Trinta e uma fechaduras.| Trinta e um bilhetes.| Ela quer que a gente abra essa porta.', 'me');
    await say('Ou quer que a gente fique com medo de abrir.', 'lume');
    await endScreen(6);
    f.ch6done = true;
    saveGame();
  }
});
// primeiras visitas, gatilhos de chefes e portas
{ const _f = { feira: 'feiraFirst', escola: 'escolaFirst', coreto: 'coretoFirst', pontofinal: 'pontofinalFirst' };
  const _oe = onEnter; onEnter = async function (id) { await _oe(id); if (_f[id] && !G.flags['seen_' + id]) { G.flags['seen_' + id] = true; await STORY[_f[id]](); } }; }
{ const _os = STORY.onStep3; STORY.onStep3 = function () {
  if (_os && _os()) return true;
  if (WD.id === 'coreto' && !G.flags.maestroDone && WD.y <= 5 && WD.x >= 10 && WD.x <= 16) { runScript(STORY.maestro6); return true; }
  if (WD.id === 'pontofinal' && !G.flags.p32Done && WD.y >= 8 && WD.x >= 8 && WD.x <= 14) { runScript(STORY.p32); return true; }
  return false; }; }
// fim de capítulo
{ const _es = endScreen; endScreen = function (ch) { if (ch !== 6) return _es(ch); playMusic('ending');
    const w = { type: 'end', t: 0, update() { this.t++; if (this.t > 90 && btnp('a')) { sfx('select'); closeWin(this); } },
      draw() { bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H); const a = Math.min(1, this.t / 60);
        bx.globalAlpha = a; bx.drawImage(SP[spec().sp][0], 96, 22, 48, 48); bx.globalAlpha = 1;
        txt('FIM DO CAPÍTULO 6', 120, 80, { align: 'center', sz: 1.5, col: '#ffe066', alpha: a });
        txt('Almas do 31', 120, 100, { align: 'center', col: '#b8aecb', alpha: a });
        const L = [`${G.name} · ${spec().name} nv ${G.lv}`, `Almas que lembraram: ${soulsCount()} · Lembranças acalmadas: ${G.flags.calmed || 0}`, `Tempo: ${fmtTime(G.time)}`, G.flags.ch6Gift === 'cancao' ? 'A Lume cantou a música até o fim' : 'Você lembrou do gosto do pastel', G.flags.marleneFate === 'junto' ? 'Marlene ficou com o Valdir' : 'Marlene veio com você'];
        L.forEach((l, i) => txt(l, 120, 120 + i * 12, { align: 'center', col: i >= 3 ? '#8fe3ff' : '#ffffff', alpha: clamp((this.t - 40) / 40, 0, 1) }));
        txt('Próximo: Capítulo 7 — O Selado', 120, 190, { align: 'center', col: '#8fe3ff', alpha: clamp((this.t - 70) / 40, 0, 1) });
        if (this.t > 90 && FRAME % 50 < 34) txt('A para continuar', 120, 214, { align: 'center', col: '#8a8099' }); } };
    return openWin(w); }; }
// título, capítulo do save e retrato da Lume no fim
{ const _co = chapterOf; chapterOf = function (d) { const f = (d && d.flags) || {}; return f.ch6open ? 6 : _co(d); }; }
