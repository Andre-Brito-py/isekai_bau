// ===== O ENCONTRO COM A RITA, refeito (v2.15) =====
// Pedido do usuário: a Rita também é reencarnada (do 31; ficava de olho nele no ônibus), reconhece o nome dele,
// e o encontro tem CENÁRIO PRÓPRIO (Plataforma 4 à meia-noite) com animações e uma dança no ritmo.

Object.assign(TRACKS, {
  radio8: {   // forró de radinho de pilha, chiado
    bpm: 118, bars: 8, chords: 'Am Am Dm Dm G G C E', bass: 'root5', bassVol: 0.13,
    lead: 'E5:2 A5:2 C6:2 B5:2 A5:2 G5:2 A5:4 | E5:2 A5:2 C6:2 E6:2 D6:4 .:4 | D5:2 F5:2 A5:2 G5:2 F5:2 E5:2 D5:4 | F5:2 A5:2 D6:2 C6:2 A5:4 .:4 | G5:2 B5:2 D6:2 C6:2 B5:2 A5:2 G5:4 | B4:2 D5:2 G5:4 F5:2 E5:2 D5:4 | C5:2 E5:2 G5:2 A5:2 G5:2 E5:2 C5:4 | B4:4 E5:4 G#5:4 B5:4',
    leadWave: 'square', leadVol: 0.05, arp: { rate: 2, vol: 0.016, pat: [0, 2, 1, 2] }, drums: 'k.hsk.hsk.hsk.hs', hatVol: 0.035
  }
});

// ---------- o cenário: Plataforma 4, quase meia-noite ----------
const DATE8_BOARD = ['19:40  31  ATRASADO', '20:15  12  CANCELADO', '21:00  31  ATRASADO', '23:59  31  ?????'];
function drawDate8() {
  const D = V.date8, t = FRAME;
  D.t = (D.t || 0) + 1;
  // parede e chão
  for (let y = 0; y < 110; y++) { const k = y / 110; bx.fillStyle = `rgb(${18 + k * 10 | 0},${20 + k * 12 | 0},${38 + k * 18 | 0})`; bx.fillRect(0, y, W, 1); }
  bx.fillStyle = '#232a44'; for (let x = 0; x < W; x += 24) bx.fillRect(x, 0, 1, 110);
  bx.fillStyle = '#2c3352'; bx.fillRect(0, 106, W, 4);
  for (let y = 110; y < 150; y++) { bx.fillStyle = y % 6 < 3 ? '#3a3448' : '#342e42'; bx.fillRect(0, y, W, 1); }
  for (let x = -40; x < W + 40; x += 22) { bx.fillStyle = '#2a2436'; const bxx = x + (x - 120) * 0.2; bx.fillRect(Math.round(bxx), 110, 1, 40); }
  bx.fillStyle = '#f0c040'; bx.fillRect(0, 148, W, 2);   // faixa amarela de segurança
  bx.fillStyle = '#100c18'; bx.fillRect(0, 150, W, 90);  // o fosso dos trilhos
  bx.fillStyle = '#5a5070'; bx.fillRect(0, 164, W, 2); bx.fillRect(0, 178, W, 2);
  bx.fillStyle = '#2a2436'; for (let x = (t / 2) % 12 - 12; x < W; x += 12) bx.fillRect(Math.round(x), 160, 6, 22);
  // lâmpada fluorescente que pisca
  const flick = (t % 173 < 4) || (t % 251 < 2);
  bx.fillStyle = '#5a5070'; bx.fillRect(98, 4, 44, 3);
  bx.fillStyle = flick ? '#3a3448' : '#e8f4ff'; bx.fillRect(100, 7, 40, 2);
  if (!flick) { bx.save(); bx.globalAlpha = D.mode === 'danca' ? 0.04 : 0.08; bx.fillStyle = '#e8f4ff'; bx.beginPath(); bx.moveTo(100, 9); bx.lineTo(140, 9); bx.lineTo(200, 148); bx.lineTo(40, 148); bx.fill(); bx.restore(); }
  // painel de PARTIDAS (com as letras que viram)
  bx.fillStyle = '#05030a'; bx.fillRect(6, 22, 92, 48); bx.fillStyle = '#5a5070'; bx.fillRect(6, 22, 92, 1); bx.fillRect(6, 69, 92, 1);
  txt('PARTIDAS', 52, 24, { align: 'center', col: '#f0c040' });
  DATE8_BOARD.forEach((l, i) => { let s = l; if ((t + i * 40) % 300 < 10) s = l.replace(/[A-Z?]/g, () => String.fromCharCode(65 + ((t + i) * 7) % 26)); txt(s.slice(0, 19), 9, 34 + i * 9, { col: i === 3 ? '#ff6b6b' : '#ffb040', sz: 0.75 }); });
  // a Lume "lendo os horários"
  if (SP.lume) {
    const lf = SP.lume[Math.floor(t / 10) % SP.lume.length], ly = 30 + Math.sin(t / 18) * 2, lx = 100;
    bx.save(); if (D.lume === 'out') bx.globalAlpha = 0.35; bx.drawImage(lf, lx, Math.round(ly)); bx.restore();
    if (D.lume === 'flare') for (let i = 0; i < 3; i++) fxR(lx + 6 + i * 9 + Math.sin(t / 2 + i) * 2, ly - 6 - (t + i * 5) % 10, 2, 3, i % 2 ? '#ff6b3a' : '#ffe066');
    if (D.lume === 'peek' && t % 120 < 60) txt('...', lx + 16, ly - 10, { align: 'center', col: '#ffe066' });
  }
  // máquina de café
  bx.fillStyle = '#3a3448'; bx.fillRect(210, 50, 28, 62); bx.fillStyle = '#c83838'; bx.fillRect(212, 52, 24, 10);
  txt('CAFÉ', 224, 53, { align: 'center', col: '#ffffff', sz: 0.75 });
  bx.fillStyle = '#7ad0f0'; bx.fillRect(214, 66, 20, 14); bx.fillStyle = t % 60 < 30 ? '#ff4040' : '#601010'; bx.fillRect(231, 84, 3, 3);
  bx.fillStyle = '#120e1a'; bx.fillRect(216, 92, 16, 12);
  // banco
  bx.fillStyle = '#7a4a2a'; bx.fillRect(112, 112, 92, 5); bx.fillStyle = '#5a3a24'; bx.fillRect(112, 117, 92, 2);
  bx.fillStyle = '#3a3448'; bx.fillRect(116, 119, 3, 14); bx.fillRect(197, 119, 3, 14);
  // radinho de pilha
  if (D.radio) { bx.fillStyle = '#c84a3a'; bx.fillRect(190, 102, 14, 10); bx.fillStyle = '#f2ecdc'; bx.fillRect(192, 104, 6, 6); bx.fillStyle = '#120e1a'; bx.fillRect(199, 104, 3, 3); bx.fillRect(202, 96, 1, 6); }
  // luzes de festa durante a dança
  const beat = Math.floor(D.t / (3600 / 118 / 1)) ;   // ~30.5 quadros por batida
  if (D.mode === 'danca') {
    const cols = ['#ff6b9a', '#8fe3ff', '#ffe066', '#a0f070'];
    for (let i = 0; i < 4; i++) { bx.save(); bx.globalAlpha = 0.07; bx.fillStyle = cols[(i + beat) % 4]; bx.beginPath(); bx.moveTo(30 + i * 60, 0); bx.lineTo(10 + i * 60 + Math.sin(t / 20 + i) * 30, 150); bx.lineTo(60 + i * 60 + Math.sin(t / 20 + i) * 30, 150); bx.fill(); bx.restore(); }
    for (let i = 0; i < 5; i++) { const nx = (i * 47 + t * 0.6) % 250 - 5, ny = 100 - ((t + i * 30) % 80); txt('♪', nx, ny, { col: cols[i % 4] }); }
  }
  // personagens
  const sp = SP[spec().sp] || SP.chest;
  const bt = (D.t % 30.5) / 30.5;
  let cx = 140, cy = 114, cHop = 0, tilt = 0;
  if (D.mode === 'danca') { cx = 120; cy = 142; cHop = Math.abs(Math.sin(bt * Math.PI)) * (D.bigHop > 0 ? 12 : 4); }
  if (D.trip > 0) { tilt = 0.4; D.trip--; }
  if (D.bigHop > 0) D.bigHop--;
  const cf = sp[Math.floor(D.t / 14) % sp.length];
  const CS = 2; bx.save(); bx.imageSmoothingEnabled = false; bx.translate(Math.round(cx), Math.round(cy - cHop)); bx.rotate(tilt); bx.drawImage(cf, -cf.width * CS / 2, -cf.height * CS, cf.width * CS, cf.height * CS); bx.restore();
  if (D.steam || D.kiss > 0) for (let i = 0; i < 3; i++) txt('~', cx - 6 + i * 6, cy - cf.height * 2 - 6 - ((D.t + i * 7) % 16), { col: '#f2ecdc', alpha: 0.7 });
  const rs = SP.rita, rf = rs ? rs[Math.floor(D.t / 12) % rs.length] : null;
  if (rf) {
    let rx = 178, ry = 118, flip = false, rb = 0;
    if (D.mode === 'danca') { const a = D.t / 24; rx = 146 + Math.cos(a) * 38; ry = 146 + Math.sin(a) * 3; flip = Math.sin(a) > 0; rb = Math.abs(Math.sin(bt * Math.PI)) * 5; if (D.spin > 0) { flip = Math.floor(D.spin / 3) % 2 === 0; D.spin--; } }
    if (D.kiss > 0) { rx = cx + 24 - Math.min(8, (60 - D.kiss) / 4); ry = cy + 4; }
    bx.save(); bx.translate(Math.round(rx), Math.round(ry - rb)); if (flip) bx.scale(-1, 1); bx.drawImage(rf, -rf.width / 2, -rf.height); bx.restore();
    // os copinhos de café
    if (D.mode === 'cafe') {
      if (D.drop == null) { bx.fillStyle = '#f2ecdc'; bx.fillRect(rx - 10, ry - 22, 4, 5); txt('~', rx - 9, ry - 32 - (D.t % 12) / 2, { col: '#d8d0e8', sz: 0.75 }); }
      else { const k = D.t - D.drop, fy = Math.min(140, ry - 22 + k * k * 0.12); bx.fillStyle = '#f2ecdc'; bx.fillRect(rx - 10, fy, 4, 5); if (fy >= 140) { bx.fillStyle = '#5a3a24'; bx.fillRect(rx - 18, 144, 20, 2); } }
      bx.fillStyle = '#f2ecdc'; bx.fillRect(cx + 20, cy - 4, 4, 5);
    }
    if (D.kiss > 0) { D.kiss--; const hy = cy - 44 - (60 - D.kiss) * 0.4; txt('♥', cx + 10, hy, { col: '#ff6b9a', sz: 1.5 }); }
  }
  // o minijogo de dança
  if (D.game) drawDance8(D.game);
}
// ---------- dança no ritmo: aperte A quando a nota chegar no baú ----------
function drawDance8(g) {
  bx.fillStyle = 'rgba(5,3,10,0.7)'; bx.fillRect(0, 188, W, 30);
  bx.fillStyle = '#5a5070'; bx.fillRect(10, 202, 220, 1);
  bx.fillStyle = '#ffe066'; bx.fillRect(36, 192, 2, 22); bx.fillRect(28, 192, 18, 1); bx.fillRect(28, 213, 18, 1);
  for (const n of g.notes) { if (n.done) continue; const x = 37 + (n.at - g.t) * 2.2; if (x > 236 || x < 0) continue; txt('♪', x, 196, { align: 'center', col: n.miss ? '#5a5070' : '#ff8fa8', sz: 1.25 }); }
  if (g.msg && g.msgT > 0) { txt(g.msg, 120, 176, { align: 'center', col: g.msgCol, sz: 1.25 }); g.msgT--; }
  txt(`${g.hits}/${g.notes.length}`, 228, 192, { align: 'right', col: '#8fe3ff' });
}
function danceGame8() {
  return new Promise(res => {
    const step = 30.5, notes = [];
    for (let i = 0; i < 10; i++) notes.push({ at: 80 + i * step * (i % 3 === 2 ? 1.5 : 1) + (i > 5 ? step * 0.5 : 0) });
    // reorganiza para ficar crescente
    let acc = 80; notes.forEach((n, i) => { n.at = acc; acc += step * (i % 4 === 3 ? 2 : 1); });
    const g = { t: 0, notes, hits: 0, msg: '', msgT: 0, msgCol: '#fff' }; V.date8.game = g;
    openWin({ type: 'danca8', draw() {}, update() {
      g.t++;
      if (btnp('a')) {
        const n = g.notes.find(n => !n.done && Math.abs(n.at - g.t) <= 9);
        if (n) { n.done = true; g.hits++; V.date8.bigHop = 14; V.date8.spin = 12; sfx('select'); g.msg = Math.abs(n.at - g.t) <= 4 ? 'PERFEITO!' : 'BOA!'; g.msgCol = '#a0f070'; g.msgT = 22; }
        else { V.date8.trip = 10; sfx('bump'); g.msg = 'ops'; g.msgCol = '#ff6b6b'; g.msgT = 18; }
      }
      for (const n of g.notes) if (!n.done && g.t - n.at > 9) { n.done = true; n.miss = true; V.date8.trip = 8; }
      if (g.notes.every(n => n.done) && g.t > g.notes[g.notes.length - 1].at + 40) { closeWin(this); V.date8.game = null; res(g.hits); }
    } });
  });
}
// o cenário substitui o mapa enquanto o encontro acontece (o embrulho entra no boot: o arte.js mexe no drawWorld depois)
let DATE8_WRAPPED = false;
{ const _bs = buildSprites; buildSprites = function () { _bs(); if (DATE8_WRAPPED) return; DATE8_WRAPPED = true;
  const _dw = drawWorld; drawWorld = function () { if (V.date8) return drawDate8(); return _dw(); }; }; }

// ---------- o roteiro ----------
STORY.encontro = async function () {
  const f = G.flags;
  await fadeOut(10);
  V.date8 = { t: 0, mode: 'cafe', lume: 'peek', steam: false, radio: false };
  playMusic('terminal'); await fadeIn(12);
  await say('* Plataforma 4, quase meia-noite. A lâmpada fluorescente pisca no ritmo de um coração nervoso.');
  await say('* Dois copinhos de café de máquina. Você não tem como segurar o seu. A Rita segura os dois.');
  await say('* Do outro lado, um lustre finge ler o painel de PARTIDAS com MUITA atenção.');
  let clima = 0;
  const meter = () => `[Clima do encontro: ${'♥'.repeat(Math.max(0, clima))}${clima <= 0 ? '...' : ''}]`;
  await say('Então. Eu tô tomando café com uma mala e nem sei o nome dela.| Como é que eu te chamo?', 'rita');
  await say('@. Meu nome é @.', 'me');
  V.date8.drop = V.date8.t; sfx('bump');
  await say('* O copinho escorrega da mão dela.| PLOC.');
  await say('...@?', 'rita');
  await say('@ do 31? Das dezoito e quarenta? Fone de ouvido remendado com fita isolante?', 'rita');
  await say('...Como você sabe da fita isolante?', 'me');
  shake(6);
  await say('Porque eu passei DOIS ANOS sentando duas fileiras na sua frente, @! Dois anos olhando o seu reflexo na janela!', 'rita');
  await say('Você dormia encostado no vidro e acordava EXATAMENTE no seu ponto, sem abrir o olho. Eu achava isso a coisa mais misteriosa do mundo.', 'rita');
  await say('Espera. Você... era do ônibus?', 'me');
  await say('Era. Eu também morri naquela curva.| Só que eu acordei aqui faz vinte e três anos. Num berço. Numa vila de pescadores de Auren.', 'rita');
  await say('Aprendi a andar de novo, a falar de novo, a ter dente de novo. Virei escudeira. E todo dia eu pensava: "será que o moço do fone também veio?"', 'rita');
  await say('* Ela olha para você. Para a madeira, as ferragens, a fechadura.');
  await say('E você veio.| Como MÓVEL.', 'rita');
  let c = await choose('* O que você diz?', ['"Eu lembro de você!" (mentira)', '"Eu lembro de um cheiro de laranja."', '"Desculpa. Eu dormia."']);
  if (c === 0) { clima += 1; await say('Mentiroso.| Mas é uma mentira bonita. Vou aceitar.', 'rita'); }
  else if (c === 1) { clima += 2; V.date8.steam = true; blush(300); await say('...', 'rita'); await say('Era o meu xampu.| Você lembrava do meu XAMPU.', 'rita'); await say('* Ela esconde o rosto na gola da armadura. A sua tampa solta vapor.'); }
  else { clima += 1; await say('Eu sei. Eu ensaiei "oi" umas trezentas vezes. Na primeira vez que eu tive coragem, você roncou.', 'rita'); }
  sfx('catalog'); await say(meter(), 'cat');
  V.date8.lume = 'flare'; shake(4);
  await say('* Lá do painel de PARTIDAS, uma vela estala tão alto que a Rita vira para trás.');
  await say('Peraí. Aquele lustre... tem cara de...| É a moça que cantava no fundo do ônibus?!', 'rita');
  await say('EU ESTOU LENDO OS HORÁRIOS.', 'lume');
  await say('Ela cantava toda noite a mesma música e parava sempre no mesmo verso. Eu ODIAVA.| Hoje eu dava tudo pra ouvir de novo.', 'rita');
  V.date8.lume = 'peek';
  await say('* A chama da Lume abaixa um pouco. De vergonha, ou de outra coisa.');
  await say('Se eu tivesse dito "oi" naquele ônibus... você teria respondido?', 'rita');
  c = await choose('* Ela pergunta sem olhar para você.', ['"Teria."', '"Eu teria tirado o fone."', '"Eu teria perguntado se o próximo era o meu ponto."']);
  if (c === 0) { clima += 1; await say('Hm. Resposta curta. Resposta de quem tá nervoso.| Gostei.', 'rita'); }
  else if (c === 1) { clima += 2; await say('* A Rita fica um tempão quieta.'); await say('Tirar o fone. Pra mim.| Isso é a coisa mais romântica que alguém já me disse, e você é uma CAIXA.', 'rita'); }
  else { clima += 1; await say('* Ela ri tanto que quase cai do banco.'); await say('Era! Era o seu ponto! Eu ia te avisar! Eu tinha um plano INTEIRO!', 'rita'); }
  sfx('catalog'); await say(meter(), 'cat');
  // o radinho e a dança
  await say('Sabe o que tinha no 31, de madrugada? O radinho do Seu Jorge. Forró chiado.', 'rita');
  V.date8.radio = true; sfx('item');
  await say('* Ela tira da bolsa um radinho de pilha remendado e liga. Sai um forró chiado, de outro mundo.');
  V.date8.mode = 'danca'; V.date8.lume = 'peek'; playMusic('radio8');
  await say('Dança comigo. Eu sei que você não tem pé.| Pula no tempo. Eu conduzo.', 'rita');
  await say('[Aperte A quando a nota chegar no baú. Pule no tempo da música.]', 'cat');
  const hits = await danceGame8();
  if (hits >= 8) { clima += 2; await say('* Vocês terminam a música juntos, a Rita girando e você pulando no último tempo. Lá no alto, uma gárgula de pedra aplaude devagar.'); await say('VOCÊ DANÇA! Uma mala que DANÇA!', 'rita'); }
  else if (hits >= 5) { clima += 1; await say('* Você erra alguns tempos, mas a Rita ri e conduz de novo. É a dança mais desajeitada e mais bonita da plataforma 4.'); }
  else { await say('* Você tropeça na própria tampa três vezes e cai de lado. A Rita cai junto, de rir.'); await say('Tá. Dança não é o seu forte. Mas cair é.', 'rita'); clima += hits >= 3 ? 1 : 0; }
  V.date8.mode = 'cafe'; V.date8.radio = true;
  playMusic('terminal');
  sfx('catalog'); await say(meter(), 'cat');
  await say('Esse foi o encontro mais esquisito da minha vida.| E eu já saí com um bardo.', 'rita');
  f.dateDone = true; f.dateScore = clima; f.ritaReborn = true;
  if (clima >= 5) {
    f.ritaPromise = true; blush(600); V.date8.kiss = 60;
    await say('* Ela se abaixa e dá um beijinho rápido na sua tampa. Bem na fechadura.');
    await say('Vinte e três anos esperando, @. Quando você arranjar um rosto, me procura. O pastel é por minha conta.', 'rita');
    V.date8.steam = true;
    await say('* Você não consegue falar nada. Você só solta vapor.');
    V.date8.lume = 'out';
    await say('* Do painel de PARTIDAS, as três velas da Lume se apagam ao mesmo tempo. Ela acende de novo, uma por uma, devagar.');
    await say('Ele travou. Acho que você quebrou ele.', 'lume');
    await say('* A voz dela sai alegre. Alegre demais.');
  } else if (clima >= 2) {
    blush(300);
    await say('Foi bom, @. Sério. Fazia vinte e três anos que eu não ria assim.', 'rita');
    await say('* A Rita olha para o painel de PARTIDAS e depois para você, com um meio sorriso de quem entendeu alguma coisa.');
    await say('E vai falar com ela, hein. Ela cantava pra alguém, naquele ônibus. Acho que agora eu sei pra quem.', 'rita');
  } else {
    await say('Vamos ser amigos. Amigos de ônibus. Combinado?', 'rita');
    V.date8.lume = 'peek';
    await say('* A Lume volta flutuando do painel. Ela parece mais leve. Bem mais leve.');
  }
  giveItem('sache', 2); sfx('item');
  await say('* A Rita enfia dois sachês de lavanda na sua tampa. "Pra tirar o cheiro de pólvora." Você recebeu {y}Sachê de Lavanda{/} ×2.');
  await say('Eu tô corado? Baú cora?', 'me');
  await say('Cora. Você tá cor de goiaba de novo.| Combina com você.', 'lume');
  await say('* Ela diz a última parte tão baixinho que você não tem certeza se ouviu.');
  await fadeOut(10); V.date8 = null; await fadeIn(10);
};
// depois do encontro, a Rita fala do 31 quando você volta ao guarda-volumes
{ const _r = STORY.rita; STORY.rita = async function () {
  const f = G.flags;
  if (f.dateDone && f.ritaReborn && Math.random() < 0.5) {
    await say(pickOne(['Eu ainda tenho o bilhete do 31 daquele dia. Guardei por vinte e três anos sem saber por quê.', 'Se o Seu Jorge aparecer, eu quero um forró. Ele me deve um.', 'Fita isolante no fone. Até hoje eu acho charmoso. Não conta pra ninguém.', f.ritaPromise ? 'O pastel continua de pé, @. Eu espero. Eu sou boa em esperar.' : 'Amigos de ônibus, né? Duas fileiras na frente, como sempre.']), 'rita');
    return;
  }
  return _r();
}; }
