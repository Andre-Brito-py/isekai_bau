// ================= SUPER DA FORMA HUMANA: VÃO DE DENTES (pedido do usuário) =================
// "no mesmo estilo de magia espacial que a forma de baú, mas com o aro". O baú engole o mundo pelo Vão; o humano CORTA o
// espaço com o Aro de Dentes: traça um círculo no ar, o círculo vira uma FENDA, ele entra e sai de fendas atrás de cada
// inimigo dando duas dentadas de aro (0.8 cada, corte), e no fim a silhueta do baú que ele é aparece GIGANTE sobre a
// fileira inimiga e fecha a tampa em todos ao mesmo tempo (1.2, quebra +1, crítico). Mais fraco que o Engolir o Mundo
// num alvo só, bem melhor contra grupos. Ao voltar a ser baú, o super volta a ser o Engolir o Mundo.
function fenda(x, y, r, p, a = 1) {
  const rr = Math.max(1, r * p);
  bx.globalAlpha = a * 0.85; bx.fillStyle = '#0a0418'; bx.beginPath(); bx.ellipse(x, y, rr * 0.55, rr, 0, 0, Math.PI * 2); bx.fill();
  bx.globalAlpha = a; bx.strokeStyle = '#c8a0ff'; bx.lineWidth = 2; bx.beginPath(); bx.ellipse(x, y, rr * 0.55 + 1, rr + 1, 0, 0, Math.PI * 2); bx.stroke();
  bx.strokeStyle = '#ffffff'; bx.lineWidth = 1; bx.beginPath(); bx.ellipse(x, y, rr * 0.55 + 2, rr + 2, 0, -1.2 + p * 3, 0.2 + p * 3); bx.stroke();
  for (let i = 0; i < 3; i++) { const ang = FRAME * 0.15 + i * 2.1; bx.fillStyle = '#8fe3ff'; bx.fillRect(Math.round(x + Math.cos(ang) * rr * 0.4), Math.round(y + Math.sin(ang) * rr * 0.8), 1, 1); }
  bx.globalAlpha = 1;
}
async function superHumano(m, t) {
  const vivos = () => alive(BT.foes);
  const [x0, y0] = unitCenter(m), [hx0, hy0] = maoHum(m);
  m.ghosts = [];
  // 1) o aro se forma e traça o círculo no ar
  sfx('rune'); callout('VÃO DE DENTES', '#c8a0ff', 80);
  await tw(30, p => {
    const ang = p * Math.PI * 2.2;
    luzMagia(x0, y0, 10 + p * 14, '#c8a0ff', 0.25 + p * 0.4);
    desenhaAro(hx0 + Math.cos(ang) * 6, hy0 - 6 + Math.sin(ang) * 6, ang, Math.min(1, p * 1.6), p, 1, 1 + p * 0.3);
    bx.strokeStyle = '#c8a0ff'; bx.globalAlpha = 0.8; bx.lineWidth = 1; bx.beginPath(); bx.arc(hx0, hy0 - 6, 8, 0, ang); bx.stroke(); bx.globalAlpha = 1;
    if (FRAME % 2 === 0) part({ x: hx0 + rand(-10, 10), y: hy0 + rand(-14, 4), vy: -0.5, life: 16, col: '#c8a0ff' });
  });
  // 2) o círculo vira fenda e ele entra
  sfx('geada');
  await tw(16, p => { fenda(hx0 + 4, hy0 - 6, 16, ease.out(p)); m.alpha = 1 - p; m.sx = 1 - p * 0.4; });
  m.alpha = 0;
  await tw(8, p => fenda(hx0 + 4, hy0 - 6, 16, 1 - p));
  // 3) sai de fendas atrás de cada inimigo: duas dentadas de aro
  for (const e of vivos()) {
    if (e.hp <= 0) continue;
    const [tx, ty] = unitCenter(e);
    for (const lado of [-1, 1]) {
      if (e.hp <= 0) break;
      const fx = Math.max(12, Math.min(226, tx + lado * 22)), fy = ty - 6;
      sfx('select');
      await tw(8, p => fenda(fx, fy, 12, ease.out(p)));
      m.ox = fx - lado * 6 - m.x; m.oy = fy + m.h * 0.5 - m.y; m.alpha = 1; m.sx = 1;
      fantasma(m, 0.4);
      const a0 = lado < 0 ? -Math.PI * 0.9 : -Math.PI * 0.1, a1 = lado < 0 ? Math.PI * 0.2 : Math.PI * 1.2;
      await tw(10, p => { fenda(fx, fy, 12, 1 - p * 0.6); desenhaAro(fx - lado * 4, fy + 2, (lado < 0 ? -0.3 : Math.PI + 0.3) + p * 2.2 * -lado, 1, p); crescente(tx, ty, 14, a0, a1, p, 3); });
      hitstop(3); bshake(4, 1); sfx('hit'); dentinhos(tx, ty, 6);
      hitFoe(m, e, 0.8, { el: 'corte', brk: 1 });
      await tw(8, p => { mordidaMarca(tx, ty, p, false); });
      m.alpha = 0; fantasma(m, 0.25);
    }
  }
  // 4) a silhueta do baú que ele é aparece gigante sobre a fileira e fecha a tampa em todos
  const vs = vivos();
  if (vs.length) {
    const cx = Math.max(60, Math.min(180, vs.reduce((a, e) => a + unitCenter(e)[0], 0) / vs.length)), cy = Math.min(...vs.map(e => unitCenter(e)[1])) - 6;
    let fr = null; try { const T = arcaAtualImg(); fr = Array.isArray(T) ? T : T ? [T, T, T] : null; } catch (e) { }
    sfx('rune'); callout('...NHAC!', '#ffffff', 60);
    await tw(26, p => {
      bx.globalAlpha = 0.15 + p * 0.35; bx.fillStyle = '#c8a0ff'; bx.beginPath(); bx.arc(cx, cy, 30 + p * 20, 0, Math.PI * 2); bx.fill(); bx.globalAlpha = 1;
      if (fr) { const img = fr[p < 0.75 ? 2 : 0], sc = 2.4 + p * 0.4, w = img.width * sc, h = img.height * sc; bx.globalAlpha = 0.55; bx.drawImage(img, Math.round(cx - w / 2), Math.round(Math.max(40 + h / 2, cy) - h / 2 - 10 + (1 - p) * -20), Math.round(w), Math.round(h)); bx.globalAlpha = 1; }
      else fenda(cx, cy, 40, p);
    });
    flashW(3); hitstop(8); bshake(10, 2); sfx('crit');
    for (const e of vs) { if (e.hp <= 0) continue; const [tx, ty] = unitCenter(e); burst(tx, ty, 16, ['#ffffff', '#c8a0ff', '#ffd060']); hitFoe(m, e, 1.2, { el: 'corte', brk: 2, crit: true }); }
    await tw(14, p => { for (const e of vs) { const [tx, ty] = unitCenter(e); mordidaMarca(tx, ty, p, true); } });
  }
  // 5) volta pela fenda de origem
  await tw(10, p => fenda(hx0 + 4, hy0 - 6, 16, ease.out(p)));
  m.ox = 0; m.oy = 0; m.sx = 1; m.sy = 1;
  await tw(14, p => { fenda(hx0 + 4, hy0 - 6, 16, 1 - p); m.alpha = p; });
  m.alpha = 1; m.ghosts = [];
}
// ao virar gente, o super vira o Vão de Dentes; ao voltar a ser baú, volta o Engolir o Mundo
{ const _tfS = trocarForma; trocarForma = async function (m, volta) {
  await _tfS(m, volta);
  if (m.humano) { if (!m._superB) m._superB = { super: m.super, superNm: m.superNm, superDesc: m.superDesc, superTgt: m.superTgt };
    Object.assign(m, { super: superHumano, superNm: 'Vão de Dentes', superDesc: 'Corta o espaço com o Aro: sai de fendas atrás de cada inimigo (2 dentadas) e o baú fantasma fecha a tampa em todos. Quebra escudo.', superTgt: 'all' }); }
  else if (m._superB) { Object.assign(m, m._superB); m._superB = null; }
}; }
