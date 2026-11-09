// ===== Apito da Brida (v2.14): Pip, Nina e Tolo entram de verdade na batalha, atacam, se despedem e vão embora =====
// Pedido do usuário. Usa os sprites dos três (arte do elenco); quem tem vista de lado corre de lado.
TECH_FX.aprendizes = async () => {};   // a coreografia inteira mora no use(), para o dano cair no golpe
const APR8 = [
  { k: 'pip', nm: 'Pip', col: '#f0c040', grito: 'Formação, gente!', tchau: 'Pela capitã!' },
  { k: 'nina', nm: 'Nina', col: '#e86890', grito: 'Escudo erguido!', tchau: 'Até mais, baú!' },
  { k: 'tolo', nm: 'Tolo', col: '#7ad0f0', grito: 'É agora? É agora!', tchau: 'Não morde ninguém!' }];
function aprDraw(a, x, y, mode, k, face) {
  // mode: 'run' (correndo de lado), 'stand' (de frente), 'hop' (pulando de alegria)
  const side = SPF[a.k] && SPF[a.k].s, front = SP[a.k] || SP.pip;
  let fr, by = 0;
  if (mode === 'run' && side) fr = side[Math.floor(k / 4) % side.length];
  else fr = front[Math.floor(k / 10) % front.length];
  if (mode === 'run') by = Math.abs(Math.sin(k / 3)) * 3;
  if (mode === 'hop') by = Math.abs(Math.sin(k / 5 + a.ph)) * 6;
  const w = fr.width, h = fr.height, X = Math.round(x - w / 2), Y = Math.round(y - h - by);
  bx.save(); bx.globalAlpha = 0.35; bx.fillStyle = '#000'; bx.fillRect(Math.round(x - w * 0.4), Math.round(y - 1), Math.round(w * 0.8), 2); bx.restore();
  bx.save();
  if (face < 0) { bx.translate(X + w, Y); bx.scale(-1, 1); bx.drawImage(fr, 0, 0); } else bx.drawImage(fr, X, Y);
  bx.restore();
}
TECH.aprendizes.use = async function () {
  sfx('catalog');
  const alive = () => BT.en.filter(e => e.alive && e.hp > 0);
  if (!alive().length) return;
  const base = feet({ y: BPY - 16, h: 32 }) - 2;
  const homes = [82, 102, 122].map((x, i) => ({ x, y: base + (i % 2) * 4 }));
  const S = APR8.map((a, i) => Object.assign({}, a, { x: -20 - i * 18, y: homes[i].y, ph: i * 1.3 }));
  const log = [];
  // 1) o apito e a corrida de entrada
  await fxRun(18, (k, p) => { for (let i = 0; i < 3; i++) txt('♪', BPX + 4 + i * 7 + p * 6, BPY - 40 - p * (12 + i * 4), { col: i % 2 ? '#ffb040' : '#ffe066', alpha: 1 - p * 0.5 }); });
  await fxRun(30, (k, p) => {
    const q = 1 - Math.pow(1 - p, 2);
    S.forEach((a, i) => { a.x = -20 - i * 18 + (homes[i].x + 20 + i * 18) * q; aprDraw(a, a.x, a.y, p < 1 ? 'run' : 'stand', k, 1); });
    if (p > 0.55) { const a = S[0]; txt(a.grito, Math.max(50, a.x), a.y - 56, { align: 'center', col: a.col }); }
  });
  // 2) cada um ataca um inimigo
  for (let i = 0; i < 3; i++) {
    const al = alive(); if (!al.length) break;
    const t = pickOne(al), a = S[i], hx = homes[i].x, tx = t.x - (t.w || 32) / 2 - 6, ty = feet(t);
    let hit = false;
    await fxRun(26, (k, p) => {
      S.forEach((b, j) => { if (j !== i) aprDraw(b, b.x, b.y, 'stand', k, 1); });
      let x, y, mode = 'run', face = 1;
      if (p < 0.45) { const q = p / 0.45; x = hx + (tx - hx) * q; y = a.y + (ty - a.y) * q - Math.sin(q * Math.PI) * 14; }
      else if (p < 0.6) { x = tx + Math.sin((p - 0.45) * 60) * 2; y = ty; mode = 'stand';
        if (!hit) { hit = true; const d = Math.max(1, Math.round((G.st.atk * 0.7 + G.st.mag * 0.5) * rand(0.9, 1.1))); hitEnemy(t, d, 'hit', a.col); impactAt('estrela', t, 0.9); sfx('hit'); log.push(`* ${a.nm} acerta o ${t.name}: ${d}.`); } }
      else { const q = (p - 0.6) / 0.4; x = tx + (hx - tx) * q; y = ty + (a.y - ty) * q - Math.sin(q * Math.PI) * 8; face = -1; }
      a.x = x; aprDraw(a, x, y, mode, k, face);
      if (p < 0.5) txt(a.nm + '!', x, y - 50, { align: 'center', col: a.col });
    });
    a.x = hx;
  }
  const s = pickOne(alive().filter(e => !e.d.boss)); if (s) { s.stunned = 1; log.push(`* O ${s.name} ficou tonto!`); }
  // 3) a despedida: pulinhos, acenos e cada um diz uma coisa
  sfx('select');
  await fxRun(96, (k, p) => {
    const who = Math.min(2, Math.floor(p * 3));
    S.forEach((a, i) => {
      aprDraw(a, a.x, a.y, 'hop', k, -1);
      if (i === who) txt(a.tchau, Math.min(170, Math.max(56, a.x)), a.y - 56, { align: 'center', col: a.col });
      // aceno: uma mãozinha balançando ao lado
      fxR(a.x + 7 + Math.round(Math.sin(k / 3 + i) * 2), a.y - 34, 2, 3, '#e8c8a0');
    });
  });
  // 4) e vão embora correndo (o Tolo volta pra dar tchau de novo)
  await fxRun(34, (k, p) => {
    S.forEach((a, i) => {
      const x = a.x - (a.x + 30) * Math.min(1, p * 1.4 - i * 0.12 + (i === 2 && p < 0.35 ? 0.3 : 0));
      aprDraw(a, x, a.y, 'run', k, -1);
      if (i === 2 && p > 0.6 && p < 0.95) txt('TCHAU!', 18, a.y - 50, { align: 'center', col: a.col });
    });
  });
  await bSay(log.slice(0, 5).join('\n'));
};
