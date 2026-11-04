// ================= COMBATE INIMIGO v2: defesas variadas, status, habilidades e magias =================
const DIRK = ['up', 'down', 'left', 'right'], ARROW = { up: '▲', down: '▼', left: '◄', right: '►' };
const EL_COL = { brasa: '#f07830', geada: '#7ad0f0', seiva: '#8ac85a', faisca: '#ffe066', tinta: '#5a6ad0', sombra: '#b48cf0', vento: '#c8f0e0', sal: '#e8e4dc' };
const isHist = () => G.diff === 'historia';
function drawArrow(dir, cx, cy, r, col) {
  bx.fillStyle = col;
  for (let i = 0; i <= r; i++) {
    const w = i * 2 + 1;
    if (dir === 'up') bx.fillRect(cx - i, cy - r + i, w, 1);
    if (dir === 'down') bx.fillRect(cx - i, cy + r - i, w, 1);
    if (dir === 'left') bx.fillRect(cx - r + i, cy - i, 1, w);
    if (dir === 'right') bx.fillRect(cx + r - i, cy - i, 1, w);
  }
  const [dx, dy] = DIRS[dir]; bx.fillRect(cx - (dy ? 1 : (dx > 0 ? r : 0)), cy - (dx ? 1 : (dy > 0 ? r : 0)), dy ? 3 : r, dx ? 3 : r);
}
const TUTS = {
  dodge: '[DESVIO: aperte a direção da seta quando o golpe estiver PERTO. Cedo demais também erra.]',
  seq: '[SEQUÊNCIA: repita as setas na ordem antes do tempo acabar. Cada erro é um golpe que entra.]',
  mash: '[AGARRÃO: aperte A o mais rápido que puder para se soltar.]',
  memo: '[MEMÓRIA: as setas aparecem por um instante e depois somem. Decore a ordem e repita de cabeça.]',
  swallow: '[FEITIÇO INIMIGO: aperte A quando o anel tocar o círculo para ENGOLIR a magia. Mímicos comem palavras: perfeito devolve PM.]'
};
async function tut(k) { if (G.flags['tut_' + k]) return; G.flags['tut_' + k] = true; sfx('catalog'); await bSay(TUTS[k], { cat: true }); }

// ---------- minijogos de defesa ----------
async function ring(e, o = {}) {
  const elite = e.d.boss || e.d.elite;
  const fake = DF().tricks && o.fakeable !== false && elite && Math.random() < (e.d.boss ? 0.3 : 0.22) ? rand(18, 30) : 0;
  return bWait('guard', { ring: { r: 46, v: (o.fast ? 1.25 : rand(0.75, 1.05)) * (e.d.boss ? 1.1 : 1) * DF().ring * (o.spd || 1), state: 0, res: null, fake, hold: 0, label: o.label, col: o.col } });
}
async function dodge(spd = 1, fixedDir) {
  await tut('dodge');
  const dir = fixedDir || pickOne(DIRK), from = pickOne(['left', 'right', 'top']);
  const T = Math.round(60 / spd * (isHist() ? 1.25 : 1) / (DF().tricks ? 1.08 : 1));
  return bWait('dodge', { dg: { dir, from, T, t: 0, state: 0, res: null, hold: 0 } });
}
async function seq(n, spd = 1, hide = false) {
  await tut(hide ? 'memo' : 'seq');
  const keys = Array.from({ length: n }, () => pickOne(DIRK));
  const per = (isHist() ? 30 : DF().tricks ? 20 : 24) / spd;
  const prev = hide ? Math.round((isHist() ? 26 : 18) * n + 20) : 0;
  return bWait('seq', { sq: { keys, i: 0, ok: [], T: Math.round(per * n + 30 + (hide ? 20 : 0)), t: 0, state: 0, prev, hide } });
}
async function mash(need, T = 120) {
  await tut('mash');
  return bWait('mash', { ms: { n: 0, need: Math.round(need * (isHist() ? 0.7 : 1)), T, t: 0, state: 0 } });
}
const DEFMODES = {
  dodge: {
    update() {
      const g = BT.dg;
      if (g.state === 0) {
        g.t++; const p = g.t / g.T;
        for (const k of DIRK) if (btnp(k)) {
          const good = isHist() ? 0.4 : 0.5;
          g.res = k !== g.dir || p < good ? 'fail' : p >= 0.78 ? 'perfect' : 'good';
          g.state = 1; g.hold = 18; sfx(g.res === 'fail' ? 'cancel' : 'guard'); return;
        }
        if (p >= 1) { g.res = 'fail'; g.state = 1; g.hold = 14; }
      } else if (--g.hold <= 0) BT.res(g.res);
    },
    draw() {
      const g = BT.dg, cx = 120, cy = 152, p = Math.min(1, g.t / g.T);
      const sx = g.from === 'left' ? 20 : g.from === 'right' ? 220 : cx, sy = g.from === 'top' ? 124 : cy;
      const px = sx + (cx - sx) * p, py = sy + (cy - sy) * p;
      const ok = g.state === 1 && g.res !== 'fail', [dx, dy] = DIRS[g.dir];
      const mx = cx + (ok ? dx * 16 : 0), my = cy + (ok ? dy * 10 : 0);
      bx.fillStyle = '#f2ecdc'; bx.fillRect(mx - 5, my - 4, 10, 8); bx.fillStyle = '#7a4a2a'; bx.fillRect(mx - 4, my - 3, 8, 6);
      if (!(g.state === 1)) { bx.fillStyle = '#ff6b6b'; bx.fillRect(Math.round(px) - 3, Math.round(py) - 3, 6, 6); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 2, 2); }
      const zone = isHist() ? 0.4 : 0.5;
      bar(40, 178, 160, 3, p, p < zone ? '#5a5070' : p < 0.78 ? '#ffe066' : '#8fe3ff');
      txt(g.state === 1 ? (g.res === 'fail' ? 'Acertou você!' : g.res === 'perfect' ? 'DESVIO PERFEITO!' : 'DESVIOU!') : 'DESVIE! Aperte a seta na hora certa', 120, 124, { align: 'center', col: g.state === 1 && g.res === 'fail' ? '#ff6b6b' : '#ffe066' });
      drawArrow(g.dir, 194, 152, 8, g.state === 0 && p >= zone ? '#ffe066' : '#8a8099');
    }
  },
  seq: {
    update() {
      const s = BT.sq;
      if (s.state === 0) {
        if (s.prev > 0) { s.prev--; return; }
        s.t++;
        for (const k of DIRK) if (btnp(k)) { const ok = k === s.keys[s.i]; s.ok.push(ok); s.i++; sfx(ok ? 'move' : 'hurt'); if (!ok) { BT.hurt = 8; } break; }
        if (s.i >= s.keys.length || s.t >= s.T) { while (s.ok.length < s.keys.length) s.ok.push(false); s.state = 1; s.hold = 20; }
      } else if (--s.hold <= 0) BT.res(s.ok.filter(x => !x).length);
    },
    draw() {
      const s = BT.sq, n = s.keys.length, w = Math.min(28, Math.floor(200 / n)), x0 = 120 - (n * w) / 2;
      txt(s.state === 1 ? (s.ok.every(x => x) ? 'SEQUÊNCIA PERFEITA!' : `${s.ok.filter(x => !x).length} golpe(s) entraram`) : s.prev > 0 ? 'MEMORIZE!' : s.hide ? 'REPITA DE MEMÓRIA!' : 'REPITA A SEQUÊNCIA!', 120, 124, { align: 'center', col: s.prev > 0 ? '#8fe3ff' : '#ffe066' });
      s.keys.forEach((k, i) => {
        const done = i < s.ok.length, col = done ? (s.ok[i] ? '#9be58a' : '#ff6b6b') : i === s.i ? '#ffffff' : '#6a6078';
        box(x0 + i * w, 136, w - 3, 26, { bw: i === s.i && s.state === 0 ? 2 : 1, edge: col, fill: '#000' });
        if (s.hide && s.prev <= 0 && !done) txt('?', Math.round(x0 + i * w + (w - 3) / 2), 143, { align: 'center', col });
        else drawArrow(k, Math.round(x0 + i * w + (w - 3) / 2), 149, 7, col);
      });
      bar(40, 170, 160, 3, s.prev > 0 ? 1 : 1 - s.t / s.T, s.prev > 0 ? '#8fe3ff' : '#f28c28');
    }
  },
  mash: {
    update() {
      const m = BT.ms;
      if (m.state === 0) {
        m.t++; if (btnp('a') || btnp('b')) { m.n++; sfx('move'); BT.shakeBox = 3; }
        if (m.n >= m.need || m.t >= m.T) { m.state = 1; m.hold = 16; }
      } else if (--m.hold <= 0) BT.res(Math.min(1, m.n / m.need));
    },
    draw() {
      const m = BT.ms, f = Math.min(1, m.n / m.need), j = BT.shakeBox > 0 ? (BT.shakeBox--, rand(-2, 2)) : 0;
      txt(m.state === 1 ? (f >= 1 ? 'SE SOLTOU!' : 'Não deu tempo...') : 'SACUDA! Aperte A rápido!', 120, 124, { align: 'center', col: '#ffe066' });
      bx.fillStyle = '#f2ecdc'; bx.fillRect(114 + j, 142, 12, 10); bx.fillStyle = '#7a4a2a'; bx.fillRect(115 + j, 143, 10, 8);
      bx.fillStyle = '#4a9a4a'; for (let i = 0; i < 3; i++) bx.fillRect(110, 144 + i * 3, 20, 1);
      bar(40, 160, 160, 6, f, f >= 1 ? '#9be58a' : '#ffe066');
      bar(40, 170, 160, 3, 1 - m.t / m.T, '#f28c28');
    }
  }
};

// ---------- dano e status no jogador ----------
const ST_NAME = { poison: 'VENENO', burn: 'QUEIMADO', silence: 'SILÊNCIO', blind: 'CEGO', forget: 'ESQUECIDO' };
const ST_TXT = {
  poison: 'Você está {g}envenenado{/}: perde PV a cada turno. (O frasco e a Seiva curam.)',
  burn: 'Sua tampa está {o}queimando{/}: perde PV a cada turno. (O frasco e a Seiva curam.)',
  silence: 'Você foi {p}silenciado{/}: não pode usar magia no próximo turno.',
  blind: 'Você está {c}cego de tinta{/}: a próxima mordida fica mais difícil.'
};
// a cegueira diz de onde veio: tinta, luz, sombra ou sal
function blindTxt(mv) {
  const by = (mv && mv.blindBy) || (mv && mv.el === 'sombra' ? 'sombra' : mv && mv.el === 'sal' ? 'sal' : mv && /luz|clarão|farol/i.test(mv.t || '') ? 'luz' : 'tinta');
  BT.blindBy = by;
  return { tinta: 'Você está {c}cego de tinta{/}: a próxima mordida fica mais difícil.', luz: 'A luz te deixou {y}ofuscado{/}: a próxima mordida fica mais difícil.', sombra: 'A sombra cobriu seus olhos. Você está {p}no escuro{/}: a próxima mordida fica mais difícil.', sal: 'O sal ardeu nos seus olhos. Você está {w}cego de sal{/}: a próxima mordida fica mais difícil.' }[by];
}
function giveStatus(st, turns = 3, mv = null) {
  if (BT.saltCrust > 0) return 'A crosta de sal segurou o efeito. Nada pegou em você.';
  if (st === 'forget') {
    const pool = [...G.spells.map((s, i) => 'sp:' + i), ...(G.tech || []).filter(k => TECH[k]).map(k => 'tc:' + k)];
    if (!pool.length) return 'Você sente que esqueceu alguma coisa, mas não tinha nada para esquecer.';
    BT.forgot = pickOne(pool); BT.ps = BT.ps || {}; BT.ps.forget = 2;
    const nm = BT.forgot.startsWith('sp:') ? G.spells[+BT.forgot.slice(3)].name : TECH[BT.forgot.slice(3)].name;
    return `Você {c}esqueceu{/} como usar {y}${nm}{/} por 2 turnos.`;
  }
  if (st === 'blind') { BT.inked = true; return blindTxt(mv); }
  BT.ps = BT.ps || {}; BT.ps[st] = st === 'silence' ? 1 : turns; return ST_TXT[st];
}
function cureStatus() { BT.ps = {}; BT.inked = false; }
async function tickStatus() {
  if (!BT.ps) return;
  for (const st of ['poison', 'burn']) if (BT.ps[st] > 0 && G.hp > 0) {
    BT.ps[st]--; const d = Math.max(1, Math.round(G.st.mhp * (st === 'poison' ? 0.06 : 0.05)));
    G.hp = Math.max(1, G.hp - d); pbPose('hurt', 12); BT.nums.push({ x: BPX, y: BPY - 42, s: '-' + d, col: st === 'poison' ? '#9be58a' : '#ffa94d', t: 40 }); sfx('hurt');
    await bSay(st === 'poison' ? `* O veneno arde. -${d} PV.` : `* A queimadura arde. -${d} PV.`, { auto: 28 });
  }
  if (BT.ps.silence > 0) BT.ps.silence--;
  if (BT.ps.forget > 0 && --BT.ps.forget === 0) { BT.forgot = null; await bSay('* Você lembrou de novo o que tinha esquecido.', { auto: 30 }); }
}
function hurt(e, pow, mult, res, o = {}) {
  const am = e.atkBuff && e.atkBuff.t > 0 ? e.atkBuff.m : 1;
  let gm = mult; if (gm < 1 && gm > 0 && spec().guard) gm *= spec().guard;
  if (gm <= 0) return 0;
  if (BT.orbit > 0) { BT.orbit--; BT.nums.push({ x: BPX, y: BPY - 42, s: 'ÓRBITA', col: '#ffe066', t: 50 }); sfx('guard'); return 0; }
  if (e.blinded) { gm *= 0.5; e.blinded = 0; }
  if (BT.stance > 0) gm *= 0.4;
  if (BT.dark > 0) gm *= 0.75;
  if (BT.guildShield > 0) gm *= 0.5;
  if (BT.bulwark > 0) gm *= 0.6;
  if (BT.frenzy > 0) gm *= 1.2;
  if (spec().passive2 === 'guardian') gm *= 0.85;
  const dstat = o.magic ? G.st.mag * 1.1 : o.pierce ? G.st.def * 0.5 : G.st.def;
  let dmg = e.atk * am * pow * rand(0.85, 1.15) * 60 / (60 + dstat);
  dmg = Math.max(1, Math.round(dmg * gm * BT.buff.defM));
  G.hp = Math.max(0, G.hp - dmg);
  BT.nums.push({ x: BPX, y: BPY - 42, s: '-' + dmg, col: res === 'fail' ? '#ff6b6b' : '#8fe3ff', t: 50 });
  if (res === 'fail') { sfx('hurt'); BT.hurt = 14; shake(8); } else sfx('guard');
  pbPose(res === 'fail' ? 'hurt' : 'shut', 16); e.lunge = 16;
  return dmg;
}
function passives(e, dmg, res) {
  let extra = '';
  if (spec().passive === 'counter' && res === 'perfect' && e.alive) { const c = Math.max(1, Math.round(G.st.atk * 0.6 * (BT.stance > 0 ? 2 : 1))); hitEnemy(e, c, 'hit'); extra = ` {c}Contra-ataque!{/} ${c} no ${e.name}.`; }
  if (BT.bulwark > 0 && res === 'perfect' && e.alive) { const c = Math.max(1, Math.round(G.st.atk * 0.8)); hitEnemy(e, c, 'hit', '#f0c040'); extra += ` {y}Baluarte!{/} ${c} no ${e.name}.`; }
  if (spec().passive === 'thorns' && dmg > 0 && e.alive) { const c = Math.max(1, Math.round(dmg * 0.3)); hitEnemy(e, c, 'hit', '#ffa94d'); extra += ` {o}Espinhos!{/} ${c} no ${e.name}.`; }
  return extra;
}
const gmult = r => r === 'perfect' ? 0.3 : r === 'good' ? 0.5 : 1;
// mantém compatibilidade com código antigo
async function guardAndHit(e, pow, label, o = {}) {
  const res = await ring(e, o); const dmg = hurt(e, pow, gmult(res), res);
  const head = res === 'perfect' ? '* {c}DEFESA PERFEITA!{/} A tampa nem tremeu.' : res === 'good' ? '* Você fechou a tampa a tempo!' : '* Ai!';
  return { dmg, res, text: `${head} ${dmg} de dano.${passives(e, dmg, res)}` };
}

// ---------- executor de golpes ----------
function allyOf(e) { return BT.en.filter(x => x !== e && x.alive); }
async function runMove(e, mv) {
  if (mv.t) await bSay(mv.t, { auto: mv.k === 'buff' || mv.k === 'heal' ? 40 : 16, fx: mv.fx });
  let total = 0, msg = '', worst = 'perfect';
  const rank = { perfect: 0, good: 1, fail: 2 };
  const note = r => { if (rank[r] > rank[worst]) worst = r; };
  switch (mv.k) {
    case 'ring': {
      for (let h = 0; h < (mv.hits || 1); h++) { const r = await ring(e, mv); note(r); const d = hurt(e, mv.p, gmult(r), r, mv); total += d; msg += passives(e, d, r); if (G.hp <= 0) return; }
      const head = worst === 'perfect' ? '* {c}DEFESA PERFEITA!{/}' : worst === 'good' ? '* Você fechou a tampa a tempo!' : '* Ai!';
      msg = `${head} ${total} de dano.` + msg; break;
    }
    case 'dodge': {
      for (let h = 0; h < (mv.hits || 1); h++) { const r = await dodge(mv.spd || 1, mv.dir); note(r); const d = hurt(e, mv.p, r === 'perfect' ? 0.15 : r === 'good' ? 0.45 : 1, r, mv); total += d; msg += passives(e, d, r); if (G.hp <= 0) return; }
      msg = (worst === 'perfect' ? `* Desvio perfeito! Só um arranhão: ${total}.` : worst === 'fail' ? `* Acertou em cheio! ${total} de dano.` : `* Raspou de leve. ${total} de dano.`) + msg; break;
    }
    case 'seq': {
      const miss = await seq(mv.n, mv.spd || 1, mv.hide);
      for (let h = 0; h < miss; h++) { total += hurt(e, mv.p, 1, 'fail', mv); if (G.hp <= 0) return; }
      if (mv.n - miss > 0) total += hurt(e, mv.p * (mv.n - miss), 0.15, 'good', mv);
      worst = miss ? 'fail' : 'perfect';
      msg = miss === 0 ? `* Você bloqueou os ${mv.n} golpes! Só ${total} de dano.` : `* ${miss} de ${mv.n} golpes entraram: ${total} de dano.`;
      if (miss === 0 && spec().passive === 'counter') msg += passives(e, 0, 'perfect');
      else if (spec().passive === 'thorns') msg += passives(e, total, miss ? 'fail' : 'perfect');
      break;
    }
    case 'mash': {
      const f = await mash(mv.need || 12, mv.T || 110);
      total = hurt(e, mv.p, f >= 1 ? 0.25 : 1 - 0.6 * f, f >= 1 ? 'good' : 'fail', mv); worst = f >= 1 ? 'good' : 'fail';
      msg = f >= 1 ? `* Você se soltou! Só ${total} de dano.` : `* Te apertou! ${total} de dano.`;
      if (spec().passive === 'thorns') msg += passives(e, total, f >= 1 ? 'good' : 'fail');
      if (mv.bind && f < 0.6 && !(BT.guildShield > 0)) { BT.netted = true; msg += ' Você ainda está PRESO e vai perder o próximo turno.'; }
      break;
    }
    case 'spell': {
      await tut('swallow');
      const r = await ring(e, { label: 'ENGULA!', col: EL_COL[mv.el], spd: mv.spd, fakeable: false, fast: mv.fast });
      worst = r;
      for (let i = 0; i < 18; i++) BT.parts.push({ x: e.x + rand(-6, 6), y: e.y, vx: (120 - e.x) / 18 + rand(-0.4, 0.4), vy: (150 - e.y) / 18, life: 18, col: EL_COL[mv.el] || '#fff', sz: 2, then: true });
      if (BT.reflect > 0 && r !== 'fail') {
        BT.reflect = 0; const d = Math.max(1, Math.round(e.atk * mv.p * (r === 'perfect' ? 1.6 : 1.1) * (mv.hits || 1)));
        if (r === 'good') total += hurt(e, mv.p, 0.25, r, { magic: true });
        hitEnemy(e, d, 'crit', EL_COL[mv.el] || '#ffffff'); sfx('crit');
        msg = `* {y}DEVOLVIDO AO REMETENTE!{/} ${mv.name} volta e acerta o ${e.name}: ${d} de dano.` + (total ? ` Você levou ${total}.` : ''); break;
      }
      if (r === 'perfect') { const g = Math.max(2, Math.round(G.st.mmp * 0.15)); G.mp = Math.min(G.st.mmp, G.mp + g); sfx('rune'); msg = `* NHAC! Você {y}ENGOLIU{/} ${mv.name}! +${g} PM.`; msg += crystallize(mv); if (BT.copy) msg += copySpell(mv); break; }
      const hits = mv.hits || 1;
      for (let h = 0; h < hits; h++) total += hurt(e, mv.p, r === 'good' ? 0.5 : 1, r, { magic: true });
      msg = r === 'good' ? `* Você mordeu metade do feitiço. ${total} de dano.` : `* ${mv.name} acertou em cheio! ${total} de dano.`;
      if (mv.heal) { const h = Math.round(total * mv.heal); e.hp = Math.min(e.mhp, e.hp + h); msg += ` O ${e.name} recuperou ${h} PV.`; }
      break;
    }
    case 'buff': {
      const tgt = mv.ally ? (pickOne(allyOf(e)) || e) : e;
      if (mv.stat === 'atk') { tgt.atkBuff = { m: mv.v || 1.3, t: mv.turns || 3 }; msg = `* O ataque do ${tgt.name} aumentou!`; }
      if (mv.stat === 'shell') { tgt.shell = mv.turns || 2; msg = `* O ${tgt.name} está protegido: dano recebido pela metade. (FAÍSCA quebra.)`; }
      if (mv.stat === 'hide') { tgt.hide = mv.turns || 2; msg = `* O ${tgt.name} ficou difícil de acertar com mordidas. Magia acerta normal.`; }
      sfx('buff'); tgt.flash = 10; await bSay(msg, { auto: 50 }); return;
    }
    case 'heal': {
      const pool = [e, ...allyOf(e)].sort((a, b) => a.hp / a.mhp - b.hp / b.mhp), tgt = pool[0];
      const h = Math.round(tgt.mhp * (mv.frac || 0.25)); tgt.hp = Math.min(tgt.mhp, tgt.hp + h); sfx('heal'); burst(tgt.x, tgt.y, '#9be58a', 18);
      await bSay(`* ${mv.name ? mv.name + ': o' : 'O'} ${tgt.name} recuperou ${h} PV.`, { auto: 50 }); return;
    }
  }
  if (mv.st && G.hp > 0 && (worst === 'fail' || (worst === 'good' && mv.st !== 'silence' && Math.random() < 0.4)) && !(mv.k === 'spell' && worst === 'perfect')) msg += '\n* ' + giveStatus(mv.st, 3, mv);
  if (mv.drain && G.mp > 0 && worst !== 'perfect') { const l = Math.min(G.mp, mv.drain); G.mp -= l; msg += ` Você perdeu ${l} PM.`; }
  await bSay(msg, { auto: 50 });
}
function pickMove(e, list) {
  const ok = list.filter(m => {
    if (m.k === 'buff' && m.stat === 'atk' && !m.ally && e.atkBuff && e.atkBuff.t > 0) return false;
    if (m.k === 'buff' && m.stat === 'shell' && e.shell > 0) return false;
    if (m.k === 'buff' && m.stat === 'hide' && e.hide > 0) return false;
    if (m.k === 'buff' && m.ally && !allyOf(e).length) return false;
    if (m.k === 'heal' && ![e, ...allyOf(e)].some(x => x.hp < x.mhp * 0.6)) return false;
    if (m.once && e['used_' + m.once]) return false;
    if (m.st && m.st !== 'blind' && BT.ps && BT.ps[m.st] > 0) return false;
    return true;
  });
  let tot = ok.reduce((a, m) => a + (m.w || 1), 0), r = Math.random() * tot;
  for (const m of ok) { r -= (m.w || 1); if (r <= 0) { if (m.once) e['used_' + m.once] = true; return m; } }
  return ok[0];
}
async function enemyTurn(e) {
  e.turns++;
  if (e.mine > 0) { const d = e.mine; e.mine = 0; hitEnemy(e, d, 'crit', '#f07830'); sfx('crit'); burst(e.x, e.y, '#f07830', 18); await bSay(`* O ${e.name} se mexe e a mina explode: ${d} de dano!`, { auto: 40 }); if (e.hp <= 0) return; }
  if (e.atkBuff && e.atkBuff.t > 0) e.atkBuff.t--;
  if (e.shell > 0) e.shell--;
  if (e.hide > 0) e.hide--;
  if (e.dot && e.dot.t > 0) { e.dot.t--; const ic = e.dot.icon || 'bleed'; hitEnemy(e, e.dot.d, 'hit', ic === 'poison' ? '#9be58a' : ic === 'selo' ? (e.dot.col || '#ff8fa8') : '#ff6b6b'); await bSay(ic === 'selo' ? `* O selo queima o ${e.name}: ${e.dot.d} de dano.` : ic === 'poison' ? `* O veneno corrói o ${e.name}: ${e.dot.d} de dano.` : `* O ${e.name} sangra: ${e.dot.d} de dano.`, { auto: 30 }); if (e.hp <= 0) return; }
  if (e.frozen > 0) { e.frozen--; await bSay(`* O ${e.name} está congelado e não consegue se mexer.`, { auto: 40 }); return; }
  if (e.stunned > 0) { e.stunned--; await bSay(`* O ${e.name} está atordoado, vendo estrelinhas.`, { auto: 40 }); return; }
  if (e.skip) { const t = e.skip; e.skip = null; await bSay(t.replace('%', e.name), { auto: 45 }); return; }
  if (e.confused > 0) { e.confused--; await bSay(`* O ${e.name} procura você... e só encontra um baú comum. Ele perdeu o turno.`, { auto: 45 }); return; }
  if (e.d.ai) return AI[e.d.ai](e);
  if (DF().tricks) {
    if (!e.enraged && e.hp > 0 && e.hp < e.mhp * 0.4) { e.enraged = true; e.atk = Math.round(e.atk * 1.25); e.flash = 10; sfx('encounter'); await bSay(`* O ${e.name} fica {r}furioso{/}! O ataque dele aumentou.`, { auto: 40 }); }
    if (e.charge) { e.charge = false; const big = e.d.big || { k: 'ring', p: 1.8, fast: true }; return runMove(e, { ...big, t: `* O ${e.name} solta o golpe que estava preparando!`, fx: 'shake' }); }
    if (e.turns > 1 && Math.random() < 0.15) { e.charge = true; await bSay(`* O ${e.name} está se preparando para um golpe forte! (Prepare a defesa.)`, { auto: 55 }); return; }
  }
  return runMove(e, pickMove(e, e.d.moves));
}

// ---------- golpes dos monstros (complexidade cresce por área) ----------
Object.assign(ENEMIES.rat, { moves: [
  { k: 'ring', p: 1, w: 3, t: '* O Rato-de-Vela avança com a vela acesa!' },
  { k: 'ring', p: 1.25, w: 2, t: '* O Rato-de-Vela sacode o corpo. Respingos de cera quente!' },
  { k: 'buff', stat: 'atk', v: 1.3, turns: 3, w: 1, once: 'vela', t: '* A chama nas costas do Rato cresce e estala!' }] });
Object.assign(ENEMIES.mush, { moves: [
  { k: 'ring', p: 1.1, w: 2, t: '* O Cogumelo cabeceia você com o chapéu!' },
  { k: 'ring', p: 0.7, st: 'poison', w: 2, t: '* O Cogumelo tosse uma nuvem de esporos roxos!' },
  { k: 'heal', frac: 0.3, w: 2, name: 'Esporos curativos', t: '* O Cogumelo espalha esporos dourados no aliado.' }] });
Object.assign(ENEMIES.bat, { elite: false, big: { k: 'dodge', p: 1.7, spd: 1.2 }, moves: [
  { k: 'dodge', p: 1, w: 3, t: '* O Morcego de Papel mergulha num rasante!' },
  { k: 'dodge', p: 0.65, hits: 2, w: 2, t: '* Rasante duplo! Ele vai e volta!' },
  { k: 'buff', stat: 'hide', turns: 2, w: 1, t: '* O Morcego se dobra até ficar fino como uma folha.' }] });
Object.assign(ENEMIES.slime, { moves: [
  { k: 'ring', p: 1, w: 2, t: '* O Lodo de Tinta te cobre de tinta!' },
  { k: 'mash', p: 1.3, need: 10, w: 2, t: '* O Lodo se estica e tenta te ENGOLIR!' },
  { k: 'spell', p: 0.9, el: 'tinta', name: 'Onda de Tinta', st: 'blind', w: 1, t: '* O Lodo borbulha palavras... e lança uma {c}Onda de Tinta{/}!' }] });
Object.assign(ENEMIES.crab, { big: { k: 'seq', n: 4, p: 0.6 }, moves: [
  { k: 'ring', p: 1, w: 2, t: '* O Caranguejo-Balança belisca com a pinça grande!' },
  { k: 'seq', n: 2, p: 0.65, w: 2, t: '* Pinçada dupla! Esquerda, direita!' },
  { k: 'buff', stat: 'shell', turns: 2, w: 1, t: '* O Caranguejo se fecha dentro da carapaça.' }] });
Object.assign(ENEMIES.lamp, { moves: [
  { k: 'spell', p: 1, el: 'brasa', name: 'Dardo de Brasa', st: 'burn', w: 2, t: '* A Lamparina conjura um {o}Dardo de Brasa{/}!' },
  { k: 'ring', p: 0.6, hits: 2, fast: true, w: 2, t: '* A Lamparina gira e solta faíscas em espiral!' },
  { k: 'buff', stat: 'hide', turns: 2, w: 1, t: '* A Lamparina apaga a própria chama e some no escuro.' }] });
Object.assign(ENEMIES.hunter, { elite: true, moves: [
  { k: 'ring', p: 1, w: 2, t: '* O Caçador golpeia com a espada!' },
  { k: 'seq', n: 3, p: 0.5, w: 2, t: '* Combo de espada! Três golpes rápidos!' },
  { k: 'ring', p: 1.3, w: 1, t: '* O Caçador enfia o PÉ DE CABRA na sua tampa!' },
  { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* "Pega ele!" O Caçador anima o parceiro.' }] });
Object.assign(ENEMIES.archer, { elite: true, moves: [
  { k: 'dodge', p: 0.6, hits: 2, w: 2, t: '* A Arqueira dispara duas flechas!' },
  { k: 'dodge', p: 0.7, st: 'silence', w: 1, t: '* {p}Flecha do Silêncio{/}! Tem uma runa amarrada nela.' },
  { k: 'dodge', p: 1.15, spd: 1.3, w: 1, t: '* A Arqueira mira com calma... e solta.' }] });
Object.assign(ENEMIES.polvo, { big: { k: 'seq', n: 6, p: 0.4 }, moves: [
  { k: 'seq', n: 4, p: 0.4, w: 2, t: '* Quatro tentáculos, quatro tapas!' },
  { k: 'ring', p: 0.8, st: 'blind', w: 1, t: '* O Polvo espirra tinta na sua cara!' },
  { k: 'mash', p: 1.1, need: 12, w: 1, t: '* O Polvo te dá um ABRAÇO apertado!' }] });
Object.assign(ENEMIES.lampBig, { moves: [
  { k: 'spell', p: 0.85, el: 'brasa', name: 'Onda de Brasa', st: 'burn', w: 2, t: '* A Lamparina Grande ergue uma {o}Onda de Brasa{/}!' },
  { k: 'ring', p: 0.5, hits: 3, fast: true, w: 2, t: '* Chuva de brasas! Três de uma vez!' },
  { k: 'buff', stat: 'atk', ally: true, v: 1.3, turns: 3, w: 1, t: '* A Lamparina Grande aquece o aliado. Ele ferve de raiva.' }] });
Object.assign(ENEMIES.vet, { elite: true, big: { k: 'seq', n: 6, p: 0.45, spd: 1.2 }, moves: [
  { k: 'seq', n: 4, p: 0.45, spd: 1.15, w: 2, t: '* O Veterano encadeia golpes com a espada!' },
  { k: 'ring', p: 1.2, w: 2, t: '* O Veterano desce a espada com as duas mãos!' },
  { k: 'buff', stat: 'shell', turns: 2, w: 1, t: '* O Veterano ergue o escudo. Postura defensiva.' },
  { k: 'buff', stat: 'atk', ally: true, v: 1.35, turns: 3, w: 1, t: '* "Agora!" O Veterano dá cobertura à parceira.' }] });
Object.assign(ENEMIES.archerVet, { elite: true, big: { k: 'dodge', p: 0.6, hits: 4, spd: 1.3 }, moves: [
  { k: 'dodge', p: 0.5, hits: 3, spd: 1.25, w: 2, t: '* Três flechas, quase ao mesmo tempo!' },
  { k: 'dodge', p: 0.7, st: 'silence', spd: 1.2, w: 1, t: '* {p}Flecha do Silêncio{/}! Mirada na sua boca.' },
  { k: 'spell', p: 1.1, el: 'faisca', name: 'Dardo de Faísca', w: 1, spd: 1.1, t: '* A Arqueira Veterana encanta a flecha: {y}Dardo de Faísca{/}!' }] });

// ---------- chefes ----------
async function bossPhase(e) {
  if (e.pendingPhase !== undefined && e.pendingPhase !== null && e.d.ai === 'golem') {
    e.pendingPhase = null; e.phase = 2; e.sp = 'bossStone'; shake(40); sfx('rumble'); burst(e.x, e.y - 10, '#4a9a4a', 40);
    await bSay(e.lastFire ? '* O musgo do Guarda-Musgo pega fogo e vira cinza!' : '* O musgo se solta em pedaços, revelando pedra nua por baixo.', { auto: 60 });
    await bSay('A... CASCA... É SÓ... A PRIMEIRA... PÁGINA.', { fx: 'shake', col: '#d8f0b8' });
    e.weak = { brasa: 0.5, geada: 1.3, bite: 1.25, seiva: 1 }; e.atk += 2; e.def += 2; e.charge = false; e.turns = 0;
    await bSay('* O Guarda-Musgo agora é só pedra. Fogo não vai adiantar muito. Mordidas, por outro lado...', { auto: 70 });
    return true;
  }
  return false;
}
const AI = {
  async golem(e) {
    if (await bossPhase(e)) return;
    if (e.charge) { e.charge = false; return e.phase === 1 ? runMove(e, { k: 'dodge', p: 2.0, spd: 1.1, t: '* PEDREGULHO! Uma pedra enorme vem rolando!', fx: 'shake' }) : runMove(e, { k: 'seq', n: 5, p: 0.55, spd: 1.1, t: '* AVALANCHE! O teto inteiro desaba em pedaços!', fx: 'shake' }); }
    if (e.turns % 3 === 0) { e.charge = true; await bSay('* O Guarda-Musgo ergue os punhos acima da cabeça. Algo GRANDE vem aí! (Prepare a defesa.)', { auto: 70 }); return; }
    if (e.phase === 1) return runMove(e, pickMove(e, [
      { k: 'ring', p: 1, w: 3, t: '* O Guarda-Musgo dá um soco coberto de musgo!' },
      { k: 'ring', p: 0.7, st: 'poison', drain: 3, w: 2, t: '* O Guarda-Musgo sacode as costas. Esporos venenosos!' },
      { k: 'mash', p: 0.9, need: 12, bind: true, w: 2, t: '* Raízes saem do chão e te AMARRAM!' },
      { k: 'heal', frac: 0.12, name: 'Véu de Seiva', w: 1, once: 'veu', t: '* O musgo brilha verde. O Guarda-Musgo conjura {g}Véu de Seiva{/}!' }]));
    return runMove(e, pickMove(e, [
      { k: 'seq', n: 3, p: 0.55, w: 3, t: '* Chuva de cascalho! Três pedras!' },
      { k: 'ring', p: 1.2, w: 2, t: '* O Guarda-Musgo desce uma pancada de pedra!' },
      { k: 'spell', p: 1, el: 'geada', name: 'Onda de Geada', w: 2, t: '* A runa do peito gela. {c}Onda de Geada{/}!' }]));
  },
  async octo(e) {
    if (!e.p2 && e.hp <= e.mhp * 0.5) {
      e.p2 = true; e.phase = 2; shake(30); sfx('rumble'); e.atk += 4;
      await bSay('O PÚBLICO... NÃO APLAUDIU?! SEGUNDO ATO!', { fx: 'shake', col: '#ffb0b0' });
      await bSay('* O Polvo do Camarote fica vermelho-vivo. Ele ataca mais rápido agora.', { auto: 60 }); return;
    }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'seq', n: e.p2 ? 7 : 6, p: 0.42, spd: 1.15, t: '* GRANDE FINALE! Todos os tentáculos descem de uma vez!', fx: 'shake' }); }
    if (e.turns % 4 === 0) { e.charge = true; await bSay('* O Polvo do Camarote puxa a cortina com os oito braços. Vai vir um golpe enorme! (Prepare a defesa.)', { auto: 70 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'seq', n: e.p2 ? 5 : 4, p: 0.42, w: 3, t: `* ABRAÇO DE ${e.p2 ? 'CINCO' : 'QUATRO'} BRAÇOS! Bloqueie cada tentáculo!` },
      { k: 'mash', p: 1.1, need: 14, bind: true, w: 2, t: '* O Polvo te agarra e te ergue até o lustre!' },
      { k: 'ring', p: 0.85, st: 'blind', w: 1, t: '* O Polvo esguicha um jato de tinta!' },
      { k: 'spell', p: 0.6, hits: 2, el: 'tinta', name: 'Corrente de Tinta', w: 2, t: '* O Polvo rege a orquestra: {c}Corrente de Tinta{/}!' }]));
  },
  async hound(e) {
    const brida = BT.en.find(x => x.id === 'brida' && x.alive);
    if (brida && !BT.marked && Math.random() < 0.45) { BT.marked = true; sfx('encounter'); await bSay('* O Farejador fareja você e uiva! Você está {r}MARCADO{/}: o próximo golpe da Brida será muito mais forte.', { auto: 60 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'dodge', p: 1.1, spd: 1.15, w: 2, t: '* O Farejador dá um bote!' },
      { k: 'ring', p: 1, w: 2, t: '* O Farejador morde sua dobradiça!' },
      { k: 'buff', stat: 'atk', ally: true, v: 1.25, turns: 2, w: 1, t: '* O Farejador uiva para a Brida. Ela sorri.' }]));
  },
  async brida(e) {
    const mk = BT.marked ? 1.6 : 1; if (BT.marked) BT.marked = false;
    if (!e.p2 && e.hp <= e.mhp * 0.5) {
      e.p2 = true; e.phase = 2; G.flags.bridaP2 = true;
      const h = Math.round(e.mhp * 0.18); e.hp += h; burst(e.x, e.y, '#9be58a', 24); sfx('heal');
      await bSay('Você é bom, baú. Mas eu sou MELHOR.', { col: '#ffd0d0' });
      await bSay(`* A Capitã Brida bebe uma poção. +${h} PV. Ela tira a capa e fica mais rápida.`, { auto: 60 }); e.atk += 3; return;
    }
    if (e.charge) { e.charge = false; return runMove(e, { k: 'dodge', p: 2.2 * mk, spd: 1.3, t: '* INVESTIDA DA GUILDA! A Brida atravessa a ponte com o escudo na frente!', fx: 'shake' }); }
    if (e.turns % 4 === 3) { e.charge = true; await bSay('* A Capitã Brida recua e abaixa o escudo. Ela vai investir! (Prepare-se para desviar.)', { auto: 70 }); return; }
    return runMove(e, pickMove(e, [
      { k: 'ring', p: 1.1 * mk, w: 2, t: mk > 1 ? '* A Brida mira exatamente onde o Farejador marcou!' : '* A Capitã Brida desce a espada!' },
      { k: 'seq', n: e.p2 ? 5 : 3, p: 0.6 * mk, spd: e.p2 ? 1.2 : 1, w: 2, t: '* Golpe de escudo, estocada, rasteira!' },
      { k: 'mash', p: 0.5, need: 15, bind: true, w: e.p2 ? 2 : 1, t: '* A Brida joga uma REDE de caçador!' },
      { k: 'spell', p: 1.1 * mk, el: 'faisca', name: 'Dardo de Faísca Selado', st: 'silence', w: 2, t: '* A Brida encanta a espada com runas: {y}Dardo de Faísca Selado{/}!' }]));
  }
};

// ---------- técnicas: utilidades ----------
function techCost(T) { return T.pmFn ? T.pmFn() : (T.pm || 0); }
async function roundEnd() {
  for (const k in BT.cd) if (BT.cd[k] > 0) BT.cd[k]--;
  for (const e of BT.en) if (e.corrode > 0 && --e.corrode === 0) { e.def = e.def0; }
  if (BT.saltCrust > 0) BT.saltCrust--;
  if (BT.bulwark > 0) BT.bulwark--;
  if (BT.frenzy > 0) BT.frenzy--;
  if (BT.magT > 0) BT.magT--;
  if (BT.starHeal > 0 && G.hp > 0) { BT.starHeal--; const h = Math.round(G.st.mhp * 0.06); G.hp = Math.min(G.st.mhp, G.hp + h); BT.nums.push({ x: BPX, y: BPY - 42, s: '+' + h, col: '#ffe066', t: 40 }); }
  if (BT.powder && BT.powder.length && BT.en.some(e => e.alive && e.hp > 0)) {
    const p = BT.powder.reduce((a, b) => a + b, 0); BT.powder = []; sfx('crit'); shake(10); const log = [];
    for (const e of BT.en.filter(e => e.alive && e.hp > 0)) { const d = Math.max(1, Math.round(p * (e.weak.polvora ?? 1))); hitEnemy(e, d, 'hit', '#f07830'); burst(e.x, e.y, '#f07830', 14); log.push(`* ${e.name}: ${d}.`); }
    await bSay('* {o}A pólvora explode!{/}\n' + log.join('\n'), { auto: 45 }); await killDead();
  }
  if (BT.reflect > 0) BT.reflect--;
  if (BT.tideQ && BT.en.some(e => e.alive && e.hp > 0)) {
    const q = BT.tideQ; BT.tideQ = null; BT.tideRecast = true; BT.nextSpellM = 0.6;
    await castSpell(q.sp, q.target && q.target.alive && q.target.hp > 0 ? q.target : null);
    BT.tideRecast = false; await killDead();
  } else BT.tideQ = null;
  if (BT.stance > 0) BT.stance--;
  if (BT.dark > 0) BT.dark--;
  if (BT.guildShield > 0) BT.guildShield--;
  if (BT.star > 0 && BT.en.some(e => e.alive)) {
    BT.star--; const t = pickOne(BT.en.filter(e => e.alive)); const d = Math.round((10 + G.st.mag * 1.1) * rand(0.9, 1.1));
    burst(t.x, t.y - 20, '#ffe066', 14); hitEnemy(t, d, 'hit', '#ffe066'); await bSay(`* A estrela invocada mergulha no ${t.name}: ${d} de dano.${BT.star ? '' : ' Ela se apaga.'}`, { auto: 35 });
    await killDead();
  }
}
function crystallize(mv) {
  const el = ({ tinta: 'sombra', brasa: 'brasa', geada: 'geada', faisca: 'faisca', seiva: 'seiva', sombra: 'sombra', vento: 'vento', sal: 'sal' })[mv.el];
  if (!el || !G.runes.includes(el) || Math.random() >= 0.35) return '';
  addRune(el, 1); return ` A magia {${RUNES[el].col}}cristalizou{/}: +1 runa ${RUNES[el].name}!`;
}
function copySpell(mv) {
  BT.copy = false;
  const el = ({ tinta: 'sombra', brasa: 'brasa', geada: 'geada', faisca: 'faisca', seiva: 'seiva', sombra: 'sombra', vento: 'vento', sal: 'sal' })[mv.el] || 'sombra';
  if (G.spells.some(s => s.name === mv.name)) return ' Você já conhecia esse feitiço.';
  if (G.spells.length >= 8) return ' O grimório está cheio demais para copiar.';
  G.spells.push({ el, form: mv.hits > 1 ? 'corrente' : /Onda/.test(mv.name) ? 'onda' : 'dardo', mod: /Selad/.test(mv.name) ? 'selo' : null, name: mv.name, copied: true });
  return ` {p}Você COPIOU ${mv.name} para o grimório!{/}`;
}
