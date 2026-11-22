// ================= INIMIGOS DO CAP. 5: CIDADE ALTA, ACENDEDORIA E TELHADOS =================
// VIGIA DE VIDRO (ESPELHA: o próximo FEITIÇO nele volta pela metade para quem lançou; corte e mordida racham),
// MARIPOSA DE VIDRO (voa; pó de vidro rouba PM; fogo e corte), GUARDA REAL (alabarda; chama reforço; lanterna nos
// olhos atrasa a vez; mordida e gelo), o mini-chefe VITRAL VIVO (muda de COR: vermelho racha com gelo e devolve fogo,
// azul racha com fogo e devolve gelo, verde racha com corte e devolve seiva; Prisma preparado) e o chefe GRANDE
// HOLOFOTE (Varredura em todos, Facho Total preparado, Cegar; a lente racha a 50% e chama a Guarda).
Object.assign(ENEMY2, {
  vigia: { name: 'Vigia de Vidro', kind: 'vigia', mhp: 430, atk: 33, def: 16, mdef: 18, spd: 11, shield: 4, maxShield: 4, weak: ['corte', 'mordida'], ai: 'vigia', h: 60, cobres: 20,
    frame: u => vigiaArt(Math.floor(BT.t / 14 + u.x) % 2, !!u.espelho), dieCols: ['#bff0ff', '#5ab0e0', '#ffffff', '#c89a30'] },
  mvidro: { name: 'Mariposa de Vidro', kind: 'mvidro', fly: true, mhp: 300, atk: 31, def: 9, mdef: 10, spd: 15, shield: 3, maxShield: 3, weak: ['fogo', 'corte'], ai: 'mvidro', h: 30, cobres: 15,
    frame: u => mariposaVidroArt(Math.floor(BT.t / 6 + u.x) % 2), dieCols: ['#a8e0f0', '#ffffff', '#c8a040'] },
  guardaR: { name: 'Guarda Real', kind: 'guardaR', mhp: 470, atk: 34, def: 15, mdef: 10, spd: 10, shield: 4, maxShield: 4, weak: ['mordida', 'gelo'], ai: 'guardaR', h: 56, cobres: 22,
    frame: u => guardaRealArt(Math.floor(BT.t / 16 + u.x) % 2), dieCols: ['#2a3a7a', '#c89a30', '#ffffff'] },
  vitral: { name: 'Vitral Vivo', kind: 'vitral', boss: true, mhp: 4300, atk: 35, def: 14, mdef: 14, spd: 10, shield: 6, maxShield: 6, weak: ['gelo', 'mordida'], ai: 'vitral', h: 116, cobres: 140, cor: 'r',
    frame: u => vitralArt(Math.floor(BT.t / 12) % 2, u.cor || 'r', !!u.armando), dieCols: ['#d83a4a', '#3a7ad8', '#3ab04a', '#ffd870', '#ffffff'], cancelTxt: 'O prisma rachou! Nada de arco-íris!' },
  holofote: { name: 'Grande Holofote', kind: 'holofote', boss: true, mhp: 6500, atk: 38, def: 16, mdef: 12, spd: 10, shield: 7, maxShield: 7, weak: ['corte', 'mordida'], ai: 'holofote', h: 112, cobres: 220, ph: 1,
    frame: u => holofoteBossArt(Math.floor(BT.t / 10) % 2, u.ph || 1, !!u.armando), dieCols: ['#ffe8a0', '#c89a30', '#4a4a5a', '#ffffff'], cancelTxt: 'A lente engasgou! Facho cancelado!' }
});
Object.assign(FICHA, {
  vigia: 'Vigia de Vidro: guarda da Acendedoria. ESPELHA feitiços (o escudo-espelho brilha): bata com o corpo ou espere ele baixar. Corte e mordida.',
  mvidro: 'Mariposa de Vidro: o pó das asas rouba PM. Fogo e corte.',
  guardaR: 'Guarda Real: alabarda, lanterna e apito. Chama reforço. Mordida e gelo.',
  vitral: 'Vitral Vivo: MUDA DE COR. Vermelho: gelo racha, fogo volta. Azul: fogo racha, gelo volta. Verde: corte racha. Prisma preparado: quebre o escudo!',
  holofote: 'Grande Holofote: Varredura em todos, Facho Total (quebre o escudo!), Cegar atrasa a vez. Lente: corte e mordida.'
});
// VITRAL: a cor manda na fraqueza e no reflexo
const VIT = { r: { nm: 'VERMELHO', weak: ['gelo', 'mordida'], volta: 'fogo', col: '#ff8a8a' }, b: { nm: 'AZUL', weak: ['fogo', 'mordida'], volta: 'gelo', col: '#8ab8ff' }, g: { nm: 'VERDE', weak: ['corte', 'mordida'], volta: null, col: '#8ae88a' } };
function vitralCor(e, cor) { e.cor = cor; e.weak = VIT[cor].weak.slice(); e.known = {}; const [x, y] = unitCenter(e); callout('O vitral fica ' + VIT[cor].nm + '!', VIT[cor].col, 70); burst(x, y, 20, VITCOR_CORES[cor]); }
const VITCOR_CORES = { r: ['#d83a4a', '#ff8a8a', '#ffd870'], b: ['#3a7ad8', '#8ab8ff', '#ffffff'], g: ['#3ab04a', '#8ae88a', '#ffd870'] };
// ESPELHO (vigia) e REFLEXO (vitral): feitiço volta pela metade
{ const _hf6 = hitFoe; hitFoe = function (a, t, pow, o = {}) {
  if (t && a && a.side === 'p' && o.mag && t.hp > 0) {
    const ref = (t.kind === 'vigia' && t.espelho) || (t.kind === 'vitral' && VIT[t.cor] && VIT[t.cor].volta && o.el === VIT[t.cor].volta);
    if (ref) {
      if (t.kind === 'vigia') t.espelho = 0;
      const [x, y] = unitCenter(t); popNum(x, y - 30, 'ESPELHADO!', '#ffffff'); sfx('guard'); flashW(2);
      const r = _hf6(a, t, pow * 0.5, o);
      if (a.hp > 0) { const d = Math.max(1, Math.round((r || 0) * 0.8 + 6)); hurtMember(a, d); const [ax, ay] = unitCenter(a); burst(ax, ay, 10, ['#ffffff', '#bff0ff']); }
      return r;
    }
  }
  return _hf6(a, t, pow, o);
}; }
Object.assign(AI2, {
  async vigia(e) {
    const t = foeTarget(); if (!t) return;
    const [ex, ey] = unitCenter(e), [tx, ty] = unitCenter(t);
    if (!e.espelho && Math.random() < 0.35) { e.espelho = 1; callout('O Vigia ergue o escudo-ESPELHO', '#ffffff', 60); sfx('guard'); await tw(18, p => fxRing(ex - 10, ey, 6 + p * 14, '#ffffff', 1 - p)); return; }
    if (Math.random() < 0.5) {
      callout('Facho', '#ffe08a', 30); sfx('rune');
      await tw(16, p => { bx.strokeStyle = `rgba(255,232,150,${0.9 * (1 - p * 0.5)})`; bx.lineWidth = 3; bx.beginPath(); bx.moveTo(ex, ey - 22); bx.lineTo(ex + (tx - ex) * Math.min(1, p * 2), ey - 22 + (ty - ey + 22) * Math.min(1, p * 2)); bx.stroke(); });
      await foeStrike(e, t, 1.15, { n: 22, longe: true }); return;
    }
    callout('Golpe de Escudo', '#d0a8ff', 30); await foeLunge(e, t, 12, 14); await foeStrike(e, t, 1.0, { n: 24 }); await foeBack(e);
  },
  async mvidro(e) {
    const t = foeTarget(); if (!t) return;
    const [tx, ty] = unitCenter(t);
    if (Math.random() < 0.45) {
      callout('Pó de Vidro', '#a8e0f0', 40);
      await tw(20, p => { for (let i = 0; i < 8; i++) { bx.fillStyle = i % 2 ? '#ffffff' : '#a8e0f0'; bx.fillRect(Math.round(tx - 10 + Math.sin(p * 9 + i) * 10), Math.round(ty - 30 + p * 30 + i * 2), 1, 1); } });
      const r = await foeStrike(e, t, 0.6, { n: 22, longe: true });
      if (r !== 'perfeito' && t.mmp) { const n = Math.min(t.mp, 8); t.mp -= n; if (n) popNum(tx, ty - 30, '-' + n + ' PM', '#8ab8ff'); }
      return;
    }
    callout('Asa de Vidro', '#d0a8ff', 30); await foeLunge(e, t, 14, 12); await foeStrike(e, t, 1.0, { n: 22 }); await foeBack(e);
  },
  async guardaR(e) {
    const t = foeTarget(); if (!t) return;
    const n = alive(BT.foes).length;
    if (n < 3 && !e.chamou && Math.random() < 0.4) {
      e.chamou = true; callout('"REFORÇO NA CUMEEIRA!"', '#ffd8a0', 60); sfx('encounter');
      const c = mkFoe(ENEMY2.guardaR, 150 - BT.foes.length * 6, 164); c.ct = 0; c.alpha = 0; c.chamou = true; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return;
    }
    if (Math.random() < 0.3) { callout('Lanterna nos Olhos', '#ffe08a', 40); const [tx, ty] = unitCenter(t); await tw(14, p => luzMagia(tx, ty - 20, 10 + p * 20, 'rgba(255,240,180,0.6)', 1 - p)); await foeStrike(e, t, 0.6, { n: 20, longe: true }); t.ct = Math.max(0, t.ct - 35); popNum(tx, ty - 30, 'OFUSCADO', '#ffe08a'); return; }
    callout('Alabarda', '#d0a8ff', 30); await foeLunge(e, t, 16, 14); await foeStrike(e, t, 1.2, { n: 26 }); await foeBack(e);
  },
  async vitral(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('PRISMA!', '#ffffff', 70); sfx('crit'); flashW(4); bshake(16, 3);
      await tw(26, p => { const cs = ['#ff5a6a', '#ffd870', '#8ae88a', '#8ab8ff', '#c8a0ff']; for (let i = 0; i < 5; i++) { bx.globalAlpha = 0.6 * (1 - p); bx.fillStyle = cs[i]; bx.fillRect(0, Math.round(ey - 40 + i * 8 - p * 10), W, 6); bx.globalAlpha = 1; } });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.35 : 1.25, { n: 30, noCounter: true, longe: true });
      vitralCor(e, { r: 'b', b: 'g', g: 'r' }[e.cor]); return;
    }
    // troca de cor a cada 2 vezes (toda vez, na fase 2)
    if (e.turns > 0 && e.turns % (e.ph >= 2 ? 1 : 2) === 0) { vitralCor(e, { r: 'b', b: 'g', g: 'r' }[e.cor]); await wait(10); }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A luz junta no peito do vitral... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(22, p => luzMagia(ex, ey - 10, 12 + p * 24, 'rgba(255,255,255,0.6)', p)); return; }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.45) {
      callout('Estilhaços', '#ffffff', 40); sfx('rumble');
      for (const m of alive(BT.party)) { const [mx, my] = unitCenter(m); await tw(8, p => { for (let i = 0; i < 4; i++) { bx.fillStyle = VITCOR_CORES[e.cor][i % 3]; bx.fillRect(Math.round(ex + (mx - ex) * p + i * 3), Math.round(ey + (my - ey) * p - i * 2), 2, 2); } }); await foeStrike(e, m, 0.7, { n: 20, noCounter: true, longe: true }); }
      return;
    }
    callout('Raio ' + VIT[e.cor].nm.toLowerCase(), VIT[e.cor].col, 40);
    const [tx, ty] = unitCenter(t);
    await tw(16, p => { bx.strokeStyle = VIT[e.cor].col; bx.lineWidth = 3; bx.globalAlpha = 1 - p * 0.5; bx.beginPath(); bx.moveTo(ex, ey - 10); bx.lineTo(tx, ty - 10); bx.stroke(); bx.globalAlpha = 1; });
    await foeStrike(e, t, 1.3, { n: 26, longe: true });
  },
  async holofote(e) {
    const [ex, ey] = unitCenter(e);
    if (e.charge) {
      e.charge = null; e.armando = false; callout('FACHO TOTAL!', '#ffffff', 70); sfx('crit'); flashW(6); bshake(20, 4);
      await tw(30, p => { bx.fillStyle = `rgba(255,248,210,${0.85 * (1 - p)})`; bx.beginPath(); bx.moveTo(ex, ey - 20); bx.lineTo(0, ey - 80); bx.lineTo(0, ey + 60); bx.closePath(); bx.fill(); });
      for (const m of alive(BT.party)) await foeStrike(e, m, e.ph >= 2 ? 1.55 : 1.45, { n: 32, noCounter: true, longe: true });
      return;
    }
    if (e.turns % 4 === 3) { e.charge = { t: null }; e.armando = true; callout('A lente esquenta, branca... (quebre o escudo!)', '#ff6b6b', 90); sfx('rumble'); await tw(24, p => luzMagia(ex + 4, ey - 6, 14 + p * 26, 'rgba(255,250,220,0.7)', p)); return; }
    const guardas = alive(BT.foes).filter(f => f.kind === 'guardaR').length;
    if (e.ph >= 2 && guardas < 1 && e.turns % 3 === 1) { callout('"Guarda! Na torre do sino!"', '#ffd8a0', 60); sfx('encounter'); const c = mkFoe(ENEMY2.guardaR, 150, 164); c.ct = 0; c.alpha = 0; c.chamou = true; BT.foes.push(c); await tw(18, p => { c.alpha = p; }); return; }
    const t = foeTarget(); if (!t) return;
    if (Math.random() < 0.5) {
      callout('Varredura', '#ffe08a', 40); sfx('rumble');
      const alvos = alive(BT.party);
      await tw(28, p => { const a = -0.6 + p * 1.2; bx.fillStyle = 'rgba(255,240,180,0.35)'; bx.beginPath(); bx.moveTo(ex, ey - 20); bx.lineTo(ex - 260, ey - 20 + Math.tan(a) * 260 - 30); bx.lineTo(ex - 260, ey - 20 + Math.tan(a) * 260 + 30); bx.closePath(); bx.fill(); });
      for (const m of alvos) await foeStrike(e, m, m === t ? 1.1 : 0.75, { n: 22, noCounter: true, longe: true });
      return;
    }
    callout('Cegar', '#ffffff', 40); const [tx, ty] = unitCenter(t);
    await tw(16, p => luzMagia(tx, ty - 20, 8 + p * 30, 'rgba(255,255,255,0.8)', 1 - p));
    await foeStrike(e, t, 0.85, { n: 24, longe: true }); t.ct = Math.max(0, t.ct - 45); popNum(tx, ty - 30, 'CEGO', '#ffffff');
  }
});
function fasesVitral() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(24, 3); flashW(4);
    await say('* Uma rachadura atravessa o vitral de cima a baixo. Pela fresta, a luz sai em todas as cores ao mesmo tempo.');
    await say('[A cor agora troca TODA vez. Fique de olho no nome da cor antes de lançar.]', 'cat');
    e.ph = 2; e.spd = 12; e.maxShield = 7; e.shield = 7;
  } }];
}
function fasesHolofote() {
  return [{ at: 0.5, run: async (e) => {
    sfx('rumble'); bshake(26, 3); flashW(4);
    await say('* A lente racha com um estalo de gelo. O facho sai torto, para todo lado, e o operador grita lá de cima.');
    await say('"GUARDA! NA TORRE DO SINO! TRAZ O QUE TIVER!"', 'n');
    await say('[A lente rachada: agora o fogo também a faz estalar. Ele vai chamar reforço.]', 'cat');
    e.ph = 2; e.weak = ['corte', 'mordida', 'fogo']; e.known = {}; e.maxShield = 8; e.shield = 8; e.spd = 11;
  } }];
}
