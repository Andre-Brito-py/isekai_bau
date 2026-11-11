// ===== O CHEFE FINAL, 4ª FASE (v2.12): "A Voz na Lombada" =====
// Quando o Catálogo está quase vencido, ele trava, lembra que não era ele quem tinha fome, e a Voz sai de dentro da
// lombada. O Catálogo vira aliado (cai aberto, quieto). FICHA vira CHAMAR: cada pessoa que você ajudou na jornada
// pode intervir UMA vez, e a Voz pode engolir nomes da sua lista. A cada 3 turnos ela lê a ÚLTIMA PÁGINA.
// (Pistas da trilogia ficam só no jogo: a cabeça da Voz é uma lanterna com um olho.)

// ---------- sprite da Voz: tinta, âmbar e uma lanterna com um olho ----------
function vozSp(f, blink) {
  const W = 66, H = 86, c = mk(W, H), x = c.getContext('2d'), img = x.createImageData(W, H), d = img.data;
  const col = { k: [7, 5, 12], i: [20, 22, 44], i2: [34, 40, 74], a: [240, 160, 48], a2: [255, 224, 102], g: [176, 128, 48], g2: [232, 184, 80], w: [242, 236, 220], e: [214, 120, 30], p: [10, 6, 4], gl: [120, 200, 230] };
  const P = (px, py, k) => { if (px < 0 || py < 0 || px >= W || py >= H) return; const o = (py * W + px) * 4, cc = col[k]; d[o] = cc[0]; d[o + 1] = cc[1]; d[o + 2] = cc[2]; d[o + 3] = 255; };
  const ph = f * 2.1;
  for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) {
    const dx = x2 - 33;
    // corpo de tinta: coluna que ondula e se alarga embaixo, saindo da lombada
    const half = y >= 34 ? 8 + (y - 34) * 0.22 + 2.2 * Math.sin(y / 7 + ph) : -1;
    const inBody = y >= 34 && Math.abs(dx - 1.5 * Math.sin(y / 11 + ph)) < half;
    // braços: curvas de tinta saindo dos ombros
    let inArm = false;
    for (const s of [-1, 1]) { const ax = 33 + s * (9 + (y - 38) * 1.15), ok = y >= 38 && y <= 66; if (ok && Math.abs(x2 - ax - s * 3 * Math.sin(y / 5 + ph + s)) < 2.6 - (y - 38) * 0.03) inArm = true; }
    // dedos de página na ponta dos braços
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const fx = 33 + s * (41 + k * 2), fy = 64 + k * 3 + (f % 2); if (Math.abs(x2 - fx) <= 1 && Math.abs(y - fy) <= 2) inArm = true; }
    // a lanterna (cabeça): tampa dourada, vidro, grades
    const cap = y >= 4 && y <= 9 && Math.abs(dx) <= 7 - (9 - y) * 0.6;
    const ring = y >= 1 && y <= 4 && Math.abs(dx) <= 2 && !(y >= 2 && y <= 3 && Math.abs(dx) <= 1);
    const glass = ((dx * dx) / 144 + ((y - 22) * (y - 22)) / 160) <= 1 && y >= 10;
    const base = y >= 33 && y <= 36 && Math.abs(dx) <= 10;
    if (cap || ring) P(x2, y, y <= 5 ? 'g2' : 'g');
    else if (base) P(x2, y, y === 33 ? 'g2' : 'g');
    else if (glass) {
      const bar = Math.abs(dx) === 8 || dx === 0 && (y < 16 || y > 28);
      if (bar) P(x2, y, 'g');
      else {
        // o olho
        const ex = dx, ey = y - 22, sc = (ex * ex) / 49 + (ey * ey) / (blink ? 1 : 20);
        if (sc <= 1) { const ir = Math.hypot(ex, ey); P(x2, y, blink ? 'k' : ir < 1.6 ? 'p' : ir < 3.6 ? (ir < 2.6 ? 'e' : 'a') : 'w'); if (!blink && ex === -2 && ey === -2) P(x2, y, 'w'); }
        else P(x2, y, ((x2 + y + f) % 7 === 0) ? 'a2' : 'a');
      }
    } else if (inBody || inArm) {
      const crack = ((x2 * 7 + y * 3 + f * 5) % 23 === 0) || (Math.abs(dx - 3 * Math.sin(y / 4 + ph)) < 0.6 && y > 44 && (y % 9) < 5);
      P(x2, y, crack ? 'a' : ((x2 + y) % 5 === 0 ? 'i2' : 'i'));
    }
  }
  // contorno
  const a = d.slice(); for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) { const o = (y * W + x2) * 4; if (a[o + 3]) continue; for (const [u, v] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = ((y + v) * W + (x2 + u)) * 4; if (x2 + u >= 0 && x2 + u < W && y + v >= 0 && y + v < H && a[q + 3]) { d[o] = 5; d[o + 1] = 3; d[o + 2] = 10; d[o + 3] = 255; break; } } }
  x.putImageData(img, 0, 0); return c;
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); SP.voz8 = [vozSp(0), vozSp(1), vozSp(2), vozSp(1, true)]; }; }

ENEMIES.voz8 = { name: 'A Voz na Lombada', sp: 'voz8', hp: 1500, atk: 106, def: 30, xp: 0, boss: true, ai: 'voz8', sc: 1, weak: { ceu: 1.4, canto: 1.3, faisca: 1.1 },
  flavor: ['* A Voz não tem boca. Ela fala mesmo assim, de dentro da lanterna.', '* O olho dentro da lanterna não pisca. Quase nunca.', '* A tinta escorre dela e volta para cima, como se o chão fosse o teto.'],
  flavor2: ['* A Voz pega fogo cor de âmbar. Ela não parece sentir.', '* "EU SÓ QUERIA QUE NINGUÉM FOSSE ESQUECIDO." Ela diz isso como quem pede desculpas por um crime.'],
  check: 'Não é o Catálogo: é quem tinha fome por ele. A cada 3 turnos lê a ÚLTIMA PÁGINA (golpe enorme). Âncora, Sino de Bolso ou o Seu Jorge interrompem. CHAMAR (no lugar de FICHA) traz quem você ajudou; ela pode ENGOLIR nomes da sua lista. CÉU e CANTO.' };

const voz8 = () => BT.on && BT.en && BT.en.find(e => e.id === 'voz8' && e.alive);
// quem pode ajudar, montado a partir do save
function allies8() {
  const f = G.flags, L = [];
  if (f.lumeJoined) L.push({ k: 'lume', who: 'Lume', what: 'canta, cura' });
  if (f.claraDone || f.metOfelia) L.push({ k: 'of', who: f.claraDone ? 'Ofélia/Clara' : 'Ofélia', what: 'DEVOLVIDO' });
  if (f.jorgeDone) L.push({ k: 'jorge', who: 'Seu Jorge', what: 'buzina' });
  if (f.musgoDone) L.push({ k: 'musgo', who: 'Musgo', what: 'trincheira' });
  if (f.dateDone) L.push({ k: 'rita', who: 'Rita', what: 'lança' });
  const n = (typeof soulsNames === 'function' ? soulsNames().length : 0) + (f.saved7 || []).length;
  if (n) L.push({ k: 'povo', who: 'Os passageiros', what: 'Presente!' });
  if (f.pages8Done) L.push({ k: 'cat', who: 'O Catálogo', what: 'segura a Voz' });
  return L.filter(a => !(BT.called8 || []).includes(a.k) && !(BT.eaten8 || []).includes(a.k));
}
async function callAlly8() {
  const v = voz8(); const L = allies8();
  if (!L.length) { await bSay('* Você chama. Ninguém mais responde: os nomes que sobraram foram engolidos ou já ajudaram.', { auto: 40 }); return 'block'; }
  const i = await list({ x: 8, y: 132, w: 224, h: 92, title: 'Chamar · quem você guardou', maxVis: 5, items: L.map(a => ({ label: `${a.who}: ${a.what}` })) });
  if (i < 0) return 'block';
  const a = L[i]; BT.called8 = [...(BT.called8 || []), a.k]; markAct('chamar'); sfx('select');
  const heart = G.flags.lumeHeart || 0;
  if (a.k === 'lume') {
    cureStatus(); for (const k of ['nome', 'especie', 'registro']) clearErr8(k);
    const h = Math.round(G.st.mhp * (heart >= 8 ? 0.3 : 0.22)); G.hp = Math.min(G.st.mhp, G.hp + h); sfx('heal');
    await bSay(heart >= 8 ? '* A Lume voa até a frente e fica entre você e a Voz. "Ninguém lê ele. Ele é MEU baú." E canta, alto, desafinando de propósito na última nota só pra você rir.' : '* A Lume canta o refrão, alto, por cima da leitura da Voz. A tinta recua um palmo.', { auto: 70 });
    await bSay(`* (+${h} PV, estados e correções limpos)`, { auto: 40 });
  } else if (a.k === 'of') {
    v.stun8 = true; sfx('guard'); shake(10);
    await bSay('* A Ofélia aparece com o carimbo da biblioteca e bate com toda a força na testa da lanterna: {r}DEVOLVIDO.{/} "Fora do horário de atendimento."', { auto: 70 });
  } else if (a.k === 'jorge') {
    v.charge = false; v.cd8 = 4; v.shake = 20; sfx('rumble'); shake(16);
    await bSay('* BÉÉÉÉÉÉM. A buzina do 31 atravessa a parede da masmorra. A Voz perde a linha que estava lendo. (Leitura reiniciada)', { auto: 65 });
  } else if (a.k === 'musgo') {
    BT.buff.defM = 0.5; BT.buff.defT = 3; sfx('guard');
    await bSay('* O Musgo atravessa o índice de lado, abaixado, e finca as patas na sua frente. "Trincheira." (Dano recebido pela metade por 2 turnos)', { auto: 65 });
  } else if (a.k === 'rita') {
    const d = Math.round(v.mhp * 0.06); BT.trueHit8 = true; hitEnemy(v, d, 'crit', '#ffe066'); BT.trueHit8 = false;
    await bSay(`* Um assobio. A Rita arremessa a lança de escudeira por cima da sua tampa, direto no vidro da lanterna. "Eu falei que o pastel era por minha conta." {y}${d} de dano.{/}`, { auto: 70 });
  } else if (a.k === 'povo') {
    BT.presNames8 = [...(typeof soulsNames === 'function' ? soulsNames() : []), ...((G.flags.saved7 || []).map(k => CRYSTALS[k] && CRYSTALS[k].n).filter(Boolean))];
    BT.presente8 = (BT.presente8 || 0) + 2; sfx('item');
    await bSay('* Lá de cima, do 31, todo mundo grita junto, como numa chamada de escola: "PRESENTE!" (As próximas pancadas podem ser seguradas por eles)', { auto: 65 });
  } else if (a.k === 'cat') {
    BT.vozExposed = 3; sfx('catalog'); shake(12);
    await bSay('[Eu li as minhas páginas. Eu sei quem eu fui.] * O Catálogo fecha a capa em cima da tinta da Voz e segura. (A Voz recebe +60% de dano por 2 turnos)', { cat: true, auto: 70 });
  }
  return 'acted';
}
// FICHA vira CHAMAR na 4ª fase
{ const _bo = btnOverride; btnOverride = function (i) { if (i === 4 && voz8()) return 'CHAMAR'; return _bo(i); }; }
{ const _fg = fichaGate; fichaGate = function (c) { if (voz8()) { if (c === 4) return callAlly8(); return null; } return _fg(c); }; }
{ const _fd = fichaDmg; fichaDmg = function (e, dmg) { if (e.id === 'voz8') return BT.vozExposed > 0 ? Math.round(dmg * 1.6) : dmg; return _fd(e, dmg); }; }
{ const _re = roundEnd; roundEnd = async function () { if (BT.vozExposed > 0) BT.vozExposed--; return _re(); }; }
// "Presente!" também segura golpes da Voz
{ const _h = hurt; hurt = function (e, pow, mult, res, o) {
  if (BT.presente8 > 0 && e && e.id === 'voz8' && mult > 0 && Math.random() < 0.45) {
    BT.presente8--; const nm = pickOne(BT.presNames8 || ['Lume']); BT.nums.push({ x: BPX, y: BPY - 56, s: nm + ': PRESENTE!', col: '#ffe066', t: 60 }); sfx('guard'); return 0;
  }
  return _h(e, pow, mult, res, o);
}; }
// o Catálogo não cai antes da Voz sair: na 3ª fase ele trava em 6% da vida
{ const _he = hitEnemy; hitEnemy = function (e, dmg, kind, col) {
  if (e && e.id === 'catalogo' && e.phase8 === 3 && !e.voz8 && e.hp - dmg < e.mhp * 0.06) { dmg = Math.max(0, e.hp - Math.ceil(e.mhp * 0.06)); e.vozNow = true; }
  return _he(e, dmg, kind, col);
}; }

// ---------- a passagem para a 4ª fase ----------
{ const _ac = AI.catalogo; AI.catalogo = async function (e) {
  if (e.phase8 === 3 && !e.voz8 && (e.vozNow || e.hp <= e.mhp * 0.06)) {
    e.voz8 = true; e.charge = false; playMusic(null); shake(30); sfx('rumble');
    await bSay('* O Catálogo trava no meio de uma página. As letras param de orbitar e caem no chão, uma por uma.');
    await bSay('[...Trinta e um. Eu... lembro de uma coisa.]', { cat: true });
    await bSay('[Eu não queria a coleção. Eu só lia. Quem tem fome nunca fui eu.]', { cat: true });
    await bSay('* A lombada se rasga de cima a baixo. De dentro sobe uma coisa feita de tinta e âmbar. No lugar da cabeça, uma lanterna. Dentro da lanterna, um olho.', { fx: 'shake' });
    await bSay('BIBLIOTECÁRIO QUE PARA DE LER NÃO SERVE PRA NADA. EU MESMA LEIO.', { col: '#5fb0d0', fx: 'shake' });
    // o Catálogo cai aberto e vira aliado: sai do combate
    e.phase8 = 4; e.alive = false; e.hp = 1; e.dying = 1e9; e.charge = false;
    for (const k of ['nome', 'especie', 'registro']) clearErr8(k);
    const v = Object.assign(mkEnemy('voz8', 0, 1), { x: 180, y: 50 }); v.cd8 = 3; BT.en.push(v);
    playMusic('final8b'); sfx('catalog');
    await bSay('[Trinta e um. A sua ficha está limpa: eu apaguei as correções. Agora use a ficha ao contrário.]', { cat: true });
    await bSay('[Chame quem você guardou. Eles respondem. Mas cuidado: ela come nomes.]', { cat: true });
    await bSay('* {y}FICHA{/} virou {y}CHAMAR{/}. Cada pessoa que você ajudou pode intervir uma vez. A cada 3 turnos a Voz lê a {r}ÚLTIMA PÁGINA{/}.', { auto: 80 });
    return;
  }
  return _ac(e);
}; }

// ---------- a Voz ----------
AI.voz8 = async function (e) {
  if (e.cd8 == null) e.cd8 = 3;
  if (e.stun8) { e.stun8 = false; e.charge = false; e.cd8 = Math.max(e.cd8, 2); await bSay('* A Voz se debate com o carimbo de DEVOLVIDO na lanterna e perde o turno.', { auto: 45 }); return; }
  if (!e.p2 && e.hp <= e.mhp * 0.5) {
    e.p2 = true; e.phase = 2; e.atk += 6; shake(30); sfx('rumble');
    await bSay('EU SÓ QUERIA QUE NINGUÉM FOSSE ESQUECIDO.', { col: '#5fb0d0' });
    await bSay('* A tinta da Voz pega fogo cor de âmbar. A leitura fica mais rápida.', { auto: 50 });
    e.cd8 = Math.min(e.cd8, 2); return;
  }
  if (e.charge) {
    e.charge = false; e.cd8 = e.p2 ? 2 : 3;
    return runMove(e, { k: 'spell', p: e.p2 ? 2.7 : 2.4, el: 'ambar', name: 'Última Página', t: '* {r}ÚLTIMA PÁGINA.{/} A Voz lê o seu nome inteiro, devagar, e cada letra pega fogo.', fx: 'shake' });
  }
  e.cd8--;
  if (e.cd8 <= 0) {
    e.charge = true;
    await bSay('* A Voz abre a lanterna e começa a ler a ÚLTIMA PÁGINA. (No próximo turno! Âncora, Sino de Bolso ou o Seu Jorge interrompem.)', { auto: 60 });
    return runMove(e, { k: 'dodge', p: 0.42, hits: 3, spd: 1.6, t: '* Letras em brasa escapam da leitura!' });
  }
  // engolir um nome da sua lista (no máximo duas vezes na luta)
  const L = allies8();
  if ((e.ate8 || 0) < 2 && L.length > 1 && e.turns % 4 === 2) {
    const a = pickOne(L); e.ate8 = (e.ate8 || 0) + 1; BT.eaten8 = [...(BT.eaten8 || []), a.k]; sfx('bite'); shake(10);
    await bSay(`* A Voz respira fundo e ENGOLE um nome da sua lista: {r}${a.who}{/}. (${a.who} não vai poder responder ao CHAMAR)`, { auto: 60 });
    return runMove(e, { k: 'ring', p: 1.2, pierce: true, fast: true, t: '* E, de boca cheia, ela bate com a lanterna!' });
  }
  return runMove(e, pickMove(e, [
    { k: 'seq', n: e.p2 ? 9 : 8, p: 0.38, hide: true, spd: 1.1, w: 2, t: '* A Voz recita os nomes do 31, de cor, e apaga as setas. Repita!' },
    { k: 'dodge', p: 0.42, hits: e.p2 ? 6 : 5, spd: 1.6, w: 2, t: '* Gotas de tinta em brasa chovem de todos os lados!' },
    { k: 'mash', p: 1.1, need: 20, bind: true, w: 1, t: '* Os braços de tinta te seguram e tentam te enfiar na lombada!' },
    { k: 'spell', p: 1.25, el: 'sombra', name: 'Apagar', st: 'forget', w: 1, t: '* {p}Apagar{/}! A Voz passa o dedo de tinta na sua ficha.' },
    { k: 'ring', p: 1.5, pierce: true, w: 2, t: '* A lanterna desce como um martelo!' }]));
};
// quando a Voz cai, o Catálogo também fecha
{ const _b = battle; battle = async function (group, opts) {
  const r = await _b(group, opts);
  BT.called8 = null; BT.eaten8 = null; BT.vozExposed = 0;
  return r;
}; }
{ const _kd = killDead; killDead = async function () {
  const r = await _kd(); const v = BT.en && BT.en.find(e => e.id === 'voz8');
  if (v && !v.alive) { const c = BT.en.find(e => e.id === 'catalogo'); if (c && c.dying > 1000) c.dying = 40; }
  return r;
}; }
// contador na tela
{ const _db = drawBattle; drawBattle = function () {
  _db();
  const v = voz8(); if (!v || V.scene !== 'battle') return;
  const n = v.charge ? 0 : v.cd8; const t = v.charge ? 'ÚLTIMA PÁGINA: AGORA' : `ÚLTIMA PÁGINA: ${n}`;
  txt(t, 118, 6, { align: 'center', col: v.charge && FRAME % 20 < 10 ? '#ff6b6b' : '#ffe066' });
  const L = allies8(); txt(`CHAMAR: ${L.length}`, 118, 16, { align: 'center', col: '#a8ecff' });
}; }
// a luta ficou mais longa (4 fases): o Catálogo perde vida para a Voz caber
Object.assign(ENEMIES.catalogo, { hp: 6000, atk: 100 }); ENEMIES.voz8.hp = 1300;
// ajustes de balanceamento da luta inteira (mais fases, picos menores)
ENEMIES.catalogo.atk = 96;
