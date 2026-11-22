// ================= A RUNA DO ROSTO NA SUPERFÍCIE (e por que as magias sumiram) =================
// Lore: as runas do Grimório foram escritas com o âmbar da Masmorra. Aqui em cima o âmbar "dorme" (e o que existe é da Coroa,
// contrabando). Só sobraram as runas GRAVADAS NA PRÓPRIA TAMPA: Brasa, Geada, Seiva e a do ROSTO. O resto do Grimório ficou
// em branco, não perdido: no Cap. 3 o grupo acha uma tinta de superfície (pista: as anotações da Ofélia) e ele acorda.
// A Runa do Rosto funciona, mas sem âmbar em volta ela queima a "memória quente" para segurar a cara: dura pouco.
// Mecânica: B no mapa vira gente / volta a ser baú. De rosto, Caçadores e moradores não desconfiam. O FÔLEGO gasta a cada
// passo (e devagar, parado). Com menos de 15 o rosto começa a derreter e o disfarce falha. No zero, volta a baú na hora
// (quem estiver olhando vê). Como baú o fôlego volta devagar; no Marco volta todo. Água desfaz o rosto (gente afunda, baú boia).
// Luta sempre começa em forma de baú (a forma humana de batalha fica para o Cap. 3, como na bíblia).
const FMAX = 100, F_PASSO = 1.5, F_MIN = 25, F_DERRETE = 15;
function rostoSt() { G.rosto = G.rosto || { on: false, f: FMAX }; return G.rosto; }
function deRosto() { const r = G.rosto; return !!(r && r.on); }
function rostoFirme() { return deRosto() && G.rosto.f >= F_DERRETE; }

// figurino herdado da linha de 4º grau (o mesmo da arte da forma humana na T1)
const FIG_ROSTO = {
  bastiao: { hair: '#2a2420', top: '#5a5a6a', bottom: '#3a3a4a', hairStyle: 'curto', look: 'armor' },
  abismo: { hair: '#1a1020', top: '#2a1a3a', bottom: '#1a1424', hairStyle: 'curto', look: 'collar' },
  ferrao: { hair: '#3a6a22', top: '#2a4a2a', bottom: '#2a3a22', hairStyle: 'curto', look: 'sting' },
  carniceiro: { hair: '#6a1a1a', top: '#3a1414', bottom: '#2a1a1a', hairStyle: 'curto', look: 'scarf' },
  biblioteca: { hair: '#5a3a22', top: '#e8dcc0', bottom: '#5a4a3a', hairStyle: 'curto', look: 'pages' },
  proibido: { hair: '#24245a', top: '#1e1636', bottom: '#1a1428', hairStyle: 'longo', look: 'runes' },
  eclipse: { hair: '#14101e', top: '#120e1a', bottom: '#0e0a14', hairStyle: 'longo', look: 'shadow' },
  constelacao: { hair: '#22306a', top: '#18204a', bottom: '#141a3a', hairStyle: 'longo', look: 'stars' }
};
function rostoKey() { const f = (G.her && G.her.face) || {}; return { body: f.body || (G.flags && G.flags.prev4) || 'bastiao', aura: f.aura || null, blur: f.blur ?? 1 }; }
function rostoSprite() {
  const k = rostoKey(), F = FIG_ROSTO[k.body] || FIG_ROSTO.bastiao;
  return humano('rosto_' + k.body + '_' + k.aura + '_' + k.blur, {
    skin: '#e8b890', hair: F.hair, top: F.top, bottom: F.bottom, hairStyle: F.hairStyle, h: 46,
    extra: (P, o) => {
      const { view, cx, hcY, tT } = o, side = view === 's', back = view === 'b';
      if (F.look === 'scarf') { for (let y = tT; y < tT + 3; y++) for (let x = cx - 5; x <= cx + 4 - (side ? 2 : 0); x++) P.p(x, y, y === tT ? '#ff6060' : '#c83838'); if (!back) { P.rect(cx + (side ? -1 : 2), tT + 3, 2, 5, '#a82828'); } }
      if (F.look === 'armor') for (const ax of side ? [cx - 2] : [cx - 8, cx + 5]) { P.rect(ax, tT - 1, 4, 3, '#8a90a8'); P.p(ax + 1, tT - 1, '#c8d0e0'); }
      if (F.look === 'collar') P.rect(cx - 4, tT, 8, 2, '#5a3a6a');
      if (F.look === 'sting') P.rect(cx - 1, tT + 4, 2, 4, '#8ac85a');
      if (F.look === 'pages') for (let y = tT + 6; y < tT + 14; y += 3) P.rect(cx - 4, y, 8, 1, '#a89068');
      if (F.look === 'runes' || F.look === 'stars') for (const [dx, dy] of [[-3, 5], [2, 9], [-1, 13]]) P.p(cx + dx, tT + dy, F.look === 'runes' ? '#b48cf0' : '#ffe066');
      if (F.look === 'shadow') for (let x = cx - 5; x < cx + 5; x += 2) P.p(x, tT + 16, '#2a1a3a');
      // a "mala" continua ali: uma alça de baú no cinto
      if (!back) { P.rect(cx - 2 + (side ? -1 : 0), tT + 13, 4, 1, '#f0c040'); P.p(cx - 1 + (side ? -1 : 0), tT + 14, '#a87818'); }
      // memórias perdidas: o rosto apagado como borracha (mais memória perdida, mais borrado)
      if (view === 'f') {
        const sk = '#e8b890', b = k.blur;
        if (b >= 1) { P.rect(cx - 1, hcY + 3, 3, 2, sk); P.p(cx - 3, hcY + 3, sk); }
        if (b >= 2) { P.rect(cx + 1, hcY - 1, 3, 3, sk); }
        if (b >= 3) { P.rect(cx - 4, hcY - 1, 8, 6, sk); }
        if (k.aura === 'arca') P.p(cx - 3, hcY + 1, '#e0a020');
      }
      if (side && k.blur >= 2) P.rect(cx - 6, hcY + 1, 3, 3, '#e8b890');
    }
  });
}

// a forma humana DE VERDADE: a mesma do fim da Temporada 1 (arte do usuário, por linha de 4º grau; Vazio fica translúcido)
function iaRosto(e) {
  const c = mk(e.w, e.h), x = c.getContext('2d'), id = x.createImageData(e.w, e.h), b = atob(e.d), P = [];
  for (let i = 0; i < e.p.length; i += 6) P.push([parseInt(e.p.substr(i, 2), 16), parseInt(e.p.substr(i + 2, 2), 16), parseInt(e.p.substr(i + 4, 2), 16)]);
  for (let i = 0; i < b.length; i++) { const k = b.charCodeAt(i); if (!k) continue; const q = P[k - 1]; id.data[i * 4] = q[0]; id.data[i * 4 + 1] = q[1]; id.data[i * 4 + 2] = q[2]; id.data[i * 4 + 3] = 255; }
  x.putImageData(id, 0, 0); return c;
}
const ROSTO_C = {};
function rostoArte() {
  const k = rostoKey(), key = k.body + '_' + k.aura;
  if (ROSTO_C[key] !== undefined) return ROSTO_C[key];
  const A = typeof ARTE_ROSTO !== 'undefined' && (ARTE_ROSTO[k.body] || ARTE_ROSTO.bastiao);
  if (!A) return ROSTO_C[key] = null;
  const fx = cv => { if (k.aura === 'vazio') { const x = cv.getContext('2d'), d = x.getImageData(0, 0, cv.width, cv.height); for (let i = 0; i < d.data.length; i += 4) { const q = i >> 2; if (d.data[i + 3] && ((q % cv.width) + Math.floor(q / cv.width)) % 3 === 0) d.data[i + 3] = 120; } x.putImageData(d, 0, 0); } return cv; };
  return ROSTO_C[key] = { body: A.body.map(iaRosto).map(fx), port: A.port.map(iaRosto).map(fx) };
}
// quadro do mapa: a arte da T1 é de frente (como no fim da T1); de lado ela vira para onde anda; sem arte, cai no gerador
function rostoFrame(moving) {
  const A = rostoArte();
  if (!A) return humanoSprite(rostoSprite(), W2.dir, moving ? W2.t * 3 : W2.t * 0.4);
  const fr = A.body[Math.floor(W2.t / (moving ? 8 : 30)) % A.body.length];
  return W2.dir === 'left' ? flipC(fr) : fr;
}
WHO.rosto = { name: () => G.name, portrait: talking => { const A = rostoArte(); return A ? A.port[talking ? Math.floor(FRAME / 8) % 2 : 0] : PT('me'); }, voice: () => sfx('blip', 560) };

// ---------- desenho no mapa ----------
let PUFF = null;
function puffRosto() { PUFF = { t: 0, x: W2.px + 8, y: W2.py + 4 }; }
{ const _dp = drawPlayer; drawPlayer = function (ox, oy) {
  if (deRosto() && !W2.float) {
    const moving = !!W2.mv, fr = rostoFrame(moving);
    const x = W2.px - ox, y = W2.py - oy, hop = moving ? -Math.abs(Math.sin(W2.mv.k / 8 * Math.PI)) * 1 : 0;
    bx.globalAlpha = 0.3; bx.fillStyle = '#000'; bx.fillRect(Math.round(x + 2), Math.round(y + 14), 12, 2); bx.globalAlpha = 1;
    // derretendo: o rosto treme e pisca
    const der = G.rosto.f < F_DERRETE, jit = der && W2.t % 8 < 2 ? 1 : 0;
    if (der && W2.t % 20 < 3) bx.globalAlpha = 0.6;
    bx.drawImage(fr, Math.round(x + 8 - fr.width / 2 + jit), Math.round(y + 16 - fr.height + 1 + hop));
    bx.globalAlpha = 1;
    if (der && W2.t % 30 < 15) { bx.fillStyle = '#e8b890'; bx.fillRect(Math.round(x + 7), Math.round(y + 16 - fr.height + 14 + (W2.t % 30) / 3), 1, 2); }
  } else _dp(ox, oy);
  if (PUFF) {
    const p = PUFF, k = p.t++ / 24, xx = p.x - ox, yy = p.y - oy;
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = 4 + k * 14; bx.globalAlpha = Math.max(0, 1 - k); bx.fillStyle = i % 2 ? '#fff4d8' : '#ffd870'; bx.fillRect(Math.round(xx + Math.cos(a) * r), Math.round(yy + Math.sin(a) * r * 0.7 - k * 6), 2, 2); }
    bx.globalAlpha = 1; if (p.t > 24) PUFF = null;
  }
}; }

// ---------- trocar de forma ----------
function viramRosto() {
  // quem estava olhando para você vê a troca (Caçador olhando ou morador de frente)
  for (const e of W2.ents) {
    if (e.t === 'hunter' && e.olhando && inCone(e, W2.x, W2.y)) return e;
    if (e.t === 'npc' && CURIOSOS[e.id]) { const v0 = e.vis; e.vis = 3; const viu = Math.abs(e.x - W2.x) + Math.abs(e.y - W2.y) <= 4 && inCone(e, W2.x, W2.y); e.vis = v0; if (viu) return e; }
  }
  return null;
}
function flagraTroca(fala) {
  const e = viramRosto(); if (!e) return;
  e.emote = { s: fala, t: 90 }; e.sustoAte = W2.t + 600;
  if (W2.map.hunters) { W2.sus = Math.min(3, W2.sus + 1); W2.toast = { s: 'Viram você trocar de forma!', t: 0 }; if (W2.sus >= 3) { W2.sus = 0; const h = e.t === 'hunter' ? e : W2.ents.find(q => q.t === 'hunter'); if (h) run2(() => cacadoresAtacam(h)); } }
}
function vestirRosto() {
  const r = rostoSt();
  if (W2.float) { W2.toast = { s: 'Na água, não: gente afunda.', t: 0 }; sfx('bump'); return; }
  if (r.f < F_MIN) { W2.toast = { s: 'Fôlego baixo. Descanse um pouco como baú.', t: 0 }; sfx('bump'); return; }
  r.on = true; puffRosto(); sfx('rune'); flagraTroca(pickOne(['A mala virou GENTE?!', 'Eu vi! Eu vi!']));
}
function desfazRosto(motivo) {
  const r = rostoSt(); if (!r.on) return;
  r.on = false; puffRosto(); sfx('cancel');
  if (motivo === 'fim') { flagraTroca(pickOne(['A pessoa virou MALA!', 'Credo! Virou baú!'])); if (!G.flags.rostoFimTut) { G.flags.rostoFimTut = true; run2(async () => { await say('* O rosto escorrega como cera quente. Plof: baú de novo.'); await say('[Fôlego esgotado. A Runa do Rosto precisa de descanso. Como baú, ele volta devagar. No Marco, volta todo.]', 'cat'); }); } }
}
{ const _uw = updateWorld2; updateWorld2 = function () {
  if (V.scene === 'world' && G.flags && G.flags.c2Init) {
    const r = rostoSt();
    // fôlego: parado de rosto gasta devagar; como baú, volta
    if (W2.t % 60 === 0) { if (r.on) r.f = Math.max(0, r.f - 0.4); else r.f = Math.min(FMAX, r.f + 1.2); }
    if (r.on && r.f <= 0) desfazRosto('fim');
    if (G.flags.c2Chegada && !G.flags.rostoCena && !worldBusy2() && !W2.mv && W2.t > 80) { run2(cenaRosto); return; }
    if (G.flags.rostoCena && !W2.mv && !worldBusy2() && btnp('b')) { if (r.on) desfazRosto(); else vestirRosto(); return; }
  }
  _uw();
}; }
// cada passo de rosto gasta fôlego; entrar na água desfaz
{ const _ts = tryStep; tryStep = function (nx, ny) {
  if (deRosto()) {
    if (tileOf(W2.map, nx, ny).water) { desfazRosto(); if (!G.flags.rostoAgua) { G.flags.rostoAgua = true; run2(() => say('* Gente afunda. Baú boia. O rosto sai sozinho na primeira onda.')); } }
    else { G.rosto.f = Math.max(0, G.rosto.f - F_PASSO); if (G.rosto.f < F_DERRETE && !G.flags.rostoDerTut) { G.flags.rostoDerTut = true; W2.toast = { s: 'O rosto está derretendo! O disfarce falha.', t: 0 }; } }
  }
  return _ts(nx, ny);
}; }
// de rosto firme, ninguém desconfia de você andando
{ const _hs = hunterSeesMove; hunterSeesMove = function () { if (rostoFirme()) return; return _hs(); }; }
{ const _mv = moradoresVeem; moradoresVeem = function () { if (rostoFirme()) return; return _mv(); }; }
// luta: o susto desfaz o rosto (a forma humana de batalha fica para o Cap. 3)
{ const _lm = lutaMapa; lutaMapa = async function (g, o) { if (deRosto()) { G.rosto.on = false; PUFF = null; } return _lm(g, o); }; }
// o Marco devolve o fôlego todo
{ const _um = usarMarco; usarMarco = async function (e) { rostoSt().f = FMAX; return _um(e); }; }

// ---------- HUD: barra de fôlego embaixo do painel do grupo ----------
const ROSTO_IC = (() => { const c = mk(8, 8), x = c.getContext('2d'); x.fillStyle = '#5a3a2a'; x.fillRect(1, 0, 6, 8); x.fillRect(0, 1, 8, 6); x.fillStyle = '#e8b890'; x.fillRect(1, 1, 6, 6); x.fillStyle = '#4a2a1a'; x.fillRect(1, 1, 6, 2); x.fillStyle = '#2a1a1a'; x.fillRect(2, 4, 1, 1); x.fillRect(5, 4, 1, 1); x.fillStyle = '#d8a078'; x.fillRect(3, 6, 2, 1); return c; })();
{ const _hm = hudMundo; hudMundo = function (m) {
  _hm(m);
  if (!G.flags || !G.flags.rostoCena) return;
  const gs = HUD_G || [], h = 8 + gs.length * 11 + 12 + (m.hunters ? 11 : 0), y = 4 + h + 2, r = rostoSt();
  box(4, y, 92, 14, { bw: 1 });
  bx.globalAlpha = r.on ? 1 : 0.55; { const A = rostoArte(); if (A) bx.drawImage(A.port[0], 8, y + 2, 10, 10); else bx.drawImage(ROSTO_IC, 9, y + 3); } bx.globalAlpha = 1;
  const n = Math.ceil(r.f / FMAX * 10), cor = r.f < F_DERRETE ? '#ff6b6b' : r.f < F_MIN ? '#ffd060' : '#ffd8a8';
  for (let k = 0; k < 10; k++) { const pis = r.on && r.f < F_DERRETE && W2.t % 16 < 8; bx.fillStyle = k < n ? (pis ? '#fff' : cor) : 'rgba(255,216,168,0.14)'; bx.fillRect(22 + k * 7, y + 4, 6, 5); }
  if (!r.on) txt('B', 92 - 7, y + 2, { col: 'rgba(255,216,168,0.6)' });
}; }

// ---------- a cena: por que as magias sumiram e por que o Rosto dura pouco ----------
async function cenaRosto() {
  G.flags.rostoCena = true;
  await say('@, uma pergunta. No fim da masmorra você ganhou uma CARA. A Runa do Rosto. Por que você não usa aqui fora?', 'lume');
  await say('E as magias. Você soltava fogo, gelo, raio, um troço roxo que eu nunca entendi. Agora só sai faísca.', 'rita');
  await say('* Você abre o Grimório dentro da tampa. As páginas estão em branco. Não rasgadas, não queimadas: em branco, como se a tinta tivesse ido dormir.');
  await say('[Diagnóstico. As runas do Grimório foram escritas com âmbar da Masmorra. Aqui em cima, o âmbar dorme.]', 'cat');
  await say('[Restaram só as runas GRAVADAS NA TAMPA: Brasa, Geada, Seiva. E uma quarta, mais funda: a Runa do Rosto.]', 'cat');
  await say('[As outras não morreram. Estão mudas. Com a tinta certa, elas acordam.]', 'cat');
  await say('E onde se compra tinta de acordar runa?', 'lume');
  await say('Âmbar aqui em cima é da Coroa. Quem anda com âmbar no bolso é preso. Tinta de runa, então, nem se fala.', 'rita');
  await say('[As anotações da Ofélia citam uma tinta "de superfície", feita sem âmbar. Registro incompleto. Investigação futura.]', 'cat');
  await say('[Sobre o Rosto: ele funciona. Mas sem âmbar em volta, a runa queima memória quente para segurar a cara. Dura pouco. E cansa.]', 'cat');
  await say('Então é uma máscara com hora pra acabar.', 'rita');
  await say('Deixa eu ver! Vai, @! Só um pouquinho!', 'lume');
  puffRosto(); sfx('rune'); rostoSt().on = true; await wait(40);
  await say('...É você. A mesma cara lá do fim da masmorra. Eu tinha esquecido como era. Não conta pra ninguém que eu esqueci.', 'lume');
  await say('* Você olha as próprias mãos. Dez dedos. Já está doendo um pouco, lá no fundo da tampa.', 'rosto');
  await say('Cara de quem não dorme há três dias. Serve. Gente assim passa na rua e ninguém olha duas vezes.', 'rita');
  await say('* (FORMA HUMANA: aperte {y}B{/} no mapa para usar a Runa do Rosto e de novo para voltar a ser baú. De rosto, Caçadores e moradores não desconfiam de você andando.)');
  await say('* (O {y}FÔLEGO{/} (barra embaixo do grupo) gasta a cada passo. Quando fica vermelho, o rosto derrete e o disfarce falha. No zero, você vira baú na hora, e quem estiver olhando vê.)');
  await say('* (Como baú, o fôlego volta devagar. No Marco, volta todo. Na água o rosto sai, e as lutas sempre começam em forma de baú.)');
  await say('[Recomendação: use o Rosto para atravessar. E volte a ser baú longe dos olhos. De preferência, não no meio da praça.]', 'cat');
  save2();
}
