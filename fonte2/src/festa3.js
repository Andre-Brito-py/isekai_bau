// ================= O FESTIVAL DA LUZ TEM O QUE FAZER (pedido do usuário: "dar mais impressão de festival") =================
// Avenida do Festival (Auren), a partir da noite de abertura (c3Noite1). As barracas viraram atividades:
//  ARGOLAS (Seu Tonho): a mão balança, A solta a argola; encaixar no gargalo. 3 argolas.
//  PESCARIA (Dona Zuleide): patinhos rodam no laguinho; A desce o anzol. 3 tentativas; cada pato tem um número embaixo.
//  TIRO DE ROLHA (Seu Bené): a mira passeia; A atira; derrubar a pirâmide de latas. A Rita é quem atira.
//  CORREIO ELEGANTE (Dona Dalila): bilhete para a Lume, para a Rita ou para o Catálogo. Para a Lume conta no coração.
//  DOCES (Dona Cotinha): maçã do amor, pastel, café coado (itens de luta, mais baratos que na loja).
//  LANTERNA DOS DESEJOS (Seu Ambrósio): uma vez; o grupo solta uma lanterna e cada um diz um desejo.
//  PRÊMIOS (Seu Benevides): troca FICHAS (ganhas nos jogos) por itens e pelo Broche de Lata do Festival.
// Cada jogo custa 3 cobres. As fichas ficam em G.fichas.

// ---------- arte das barracas novas (mercadoria no balcão) ----------
{ const _mc = mercadoria; mercadoria = function (P, tipo) {
  if (tipo === 'argolas') { for (let i = 0; i < 5; i++) { const x = 7 + i * 8, c = ['#3a8a4a', '#8a5a2a', '#3a6a9a'][i % 3]; P.rect(x, 22, 4, 8, c); P.rect(x + 1, 19, 2, 3, c); P.p(x + 1, 23, '#ffffff'); } for (let i = 0; i < 3; i++) { P.rect(2 + i * 3, 16, 3, 1, '#e8c040'); P.p(2 + i * 3, 17, '#e8c040'); P.p(4 + i * 3, 17, '#e8c040'); } return; }
  if (tipo === 'patos') { P.rect(4, 25, 40, 5, '#3a7ab8'); for (let x = 4; x < 44; x += 3) P.p(x, 25, '#8fd0f0'); for (let i = 0; i < 4; i++) { const x = 7 + i * 10; P.rect(x, 22, 5, 3, '#f0d040'); P.rect(x + 3, 20, 3, 3, '#f0d040'); P.p(x + 6, 21, '#f08030'); P.p(x + 4, 21, '#2a2a2a'); } return; }
  if (tipo === 'latas') { const C = ['#c84a4a', '#e8e8e8', '#4a8ac8']; for (let r = 0; r < 3; r++) for (let i = 0; i <= r; i++) { const x = 24 - r * 3 + i * 6 - 3, y = 18 + r * 4; P.rect(x, y, 5, 4, C[(r + i) % 3]); P.p(x + 1, y, '#ffffff'); } P.rect(6, 26, 6, 2, '#8a5a2a'); P.p(12, 26, '#c8c8c8'); return; }
  if (tipo === 'correio') { for (let i = 0; i < 5; i++) { const x = 5 + i * 8; P.rect(x, 22 + (i % 2), 7, 5, '#f2ecdc'); P.p(x + 3, 24 + (i % 2), '#e84a7a'); P.p(x + 2, 23 + (i % 2), '#e84a7a'); P.p(x + 4, 23 + (i % 2), '#e84a7a'); } for (let i = 0; i < 3; i++) P.p(10 + i * 12, 17, '#ff7aa8'); return; }
  if (tipo === 'doces') { for (let i = 0; i < 3; i++) { const x = 6 + i * 13; P.rect(x, 22, 6, 6, '#c8283a'); P.p(x + 1, 23, '#ff8a9a'); P.rect(x + 2, 18, 1, 4, '#c8a060'); } for (let i = 0; i < 3; i++) { const x = 13 + i * 13; P.rect(x, 21, 3, 8, '#f0d040'); P.p(x + 1, 22, '#fff0a0'); P.rect(x, 29, 3, 1, '#4a9a4a'); } return; }
  if (tipo === 'desejo') { for (let i = 0; i < 4; i++) { const x = 6 + i * 10, y = 18 + (i % 2) * 3; P.rect(x, y, 6, 8, '#f8f0d8'); P.rect(x + 1, y + 2, 4, 4, '#ffe08a'); P.rect(x + 2, y + 8, 2, 1, '#e8a040'); } return; }
  if (tipo === 'premio') { const C = ['#c8a070', '#ff9ac8', '#8ad0f0', '#c8a070']; for (let i = 0; i < 4; i++) { const x = 6 + i * 10, c = C[i]; P.rect(x, 22, 7, 7, c); P.rect(x, 20, 2, 2, c); P.rect(x + 5, 20, 2, 2, c); P.p(x + 2, 24, '#2a2a2a'); P.p(x + 4, 24, '#2a2a2a'); P.p(x + 3, 26, '#5a3a3a'); } return; }
  return _mc(P, tipo);
}; }

// ---------- quem atende ----------
Object.assign(HUMS, {
  tonho: { h: 47, skin: '#c8906a', hair: '#3a2a1a', beard: true, top: '#c84a7a', bottom: '#3a3048', hat: '#e8c040' },
  zuleide: { h: 44, skin: '#a8704a', hair: '#1a1010', hairStyle: 'coque', top: '#5a8ab8', bottom: '#4a3a4a', apron: '#f2ecdc' },
  bene: { h: 46, skin: '#d8a078', hair: '#8a8a8a', hairStyle: 'careca', top: '#8a6ab8', bottom: '#2a2a34' },
  dalila: { h: 45, skin: '#e0b090', hair: '#c84a3a', hairStyle: 'longo', top: '#4a9a7a', bottom: '#3a3048' },
  cotinha: { h: 42, skin: '#b8805a', hair: '#e8e4e0', hairStyle: 'coque', top: '#c84a7a', bottom: '#4a3a4a', apron: '#f2ecdc' },
  ambrosio: { h: 47, skin: '#c8906a', hair: '#e8e4e0', beard: true, top: '#e8a040', bottom: '#3a3a4a' },
  benevides: { h: 46, skin: '#a8704a', hair: '#2a1a1a', top: '#5a8ab8', bottom: '#2a2a34', hat: '#3a2a3a' }
});
Object.assign(WHO, {
  tonho: { name: () => 'Seu Tonho', portrait: () => portHum('tonho'), voice: voz(240, 'blipLow') },
  zuleide: { name: () => 'Dona Zuleide', portrait: () => portHum('zuleide'), voice: voz(500) },
  bene: { name: () => 'Seu Bené', portrait: () => portHum('bene'), voice: voz(300) },
  dalila: { name: () => 'Dona Dalila', portrait: () => portHum('dalila'), voice: voz(560) },
  cotinha: { name: () => 'Dona Cotinha', portrait: () => portHum('cotinha'), voice: voz(600) },
  ambrosio: { name: () => 'Seu Ambrósio', portrait: () => portHum('ambrosio'), voice: voz(220, 'blipLow') },
  benevides: { name: () => 'Seu Benevides', portrait: () => portHum('benevides'), voice: voz(280) }
});

// ---------- fichas ----------
function fichas() { return G.fichas || 0; }
function ganhaFichas(n) { if (n <= 0) return; G.fichas = fichas() + n; sfx('item'); W2.toast = { s: `+${n} ficha${n > 1 ? 's' : ''} (${G.fichas})`, t: 0 }; }
async function pagaJogo(quem) {
  if ((G.cobres || 0) < 3) { await say('Três cobres a rodada. Sem cobre, sem argola. Regra de festa.', quem); return false; }
  G.cobres -= 3; sfx('select'); return true;
}
const JOGOU = k => { G.flags.feira = G.flags.feira || {}; G.flags.feira[k] = true; };

// ---------- moldura comum dos jogos ----------
function moldura(tit, col, w) {
  box(10, 26, 220, 196, { edge: col });
  txt(tit, 120, 30, { align: 'center', col });
  txt(`Tentativas: ${w.tries}`, 18, 44, { col: '#c8d4dc' }); txt(`Pontos: ${w.pts}`, 222, 44, { align: 'right', col: '#ffd060' });
  bx.fillStyle = '#1a2440'; bx.fillRect(16, 58, 208, 130);
  for (let i = 0; i < 14; i++) { const x = 20 + i * 15, y = 62 + Math.sin(i * 1.3 + FRAME * 0.03) * 2; bx.fillStyle = ['#ff7aa8', '#ffd060', '#8fe3d8', '#ff9a50', '#c8a0ff'][i % 5]; bx.fillRect(x, Math.round(y), 4, 5); }
}
function rodape(s) { txt(s, 120, 196, { align: 'center', col: '#9aa8b4' }); }

// ARGOLAS
function jogoArgolas() {
  return new Promise(res => {
    const garr = [60, 90, 120, 150, 180];
    const w = { type: 'feira', t: 0, tries: 3, pts: 0, voo: null, msg: null, msgT: 0, fim: 0,
      update() {
        this.t++;
        if (this.fim) { if (++this.fim > 50) { closeWin(this); res(this.pts); } return; }
        if (this.msgT > 0) this.msgT--;
        const vel = 0.05 + (3 - this.tries) * 0.018, hx = 120 + Math.sin(this.t * vel) * 78;
        if (this.voo) {
          this.voo.k++;
          if (this.voo.k >= 22) {
            const d = Math.min(...garr.map(g => Math.abs(g - this.voo.x)));
            if (d <= 3) { this.pts++; this.msg = 'ENCAIXOU!'; sfx('blipTri', 1200); } else { this.msg = d <= 7 ? 'Bateu no gargalo...' : 'Nada.'; sfx('cancel'); }
            this.msgT = 40; this.voo = null; if (this.tries <= 0) this.fim = 1;
          }
        } else if (btnp('a') && this.tries > 0) { this.voo = { x: Math.round(hx), k: 0 }; this.tries--; sfx('select'); }
        this.hx = hx;
      },
      draw() {
        moldura('Argolas do Seu Tonho', '#e8c040', this);
        bx.fillStyle = '#5a3a2a'; bx.fillRect(40, 150, 160, 6);
        for (const g of garr) { bx.fillStyle = '#3a8a4a'; bx.fillRect(g - 5, 124, 10, 26); bx.fillRect(g - 2, 112, 4, 12); bx.fillStyle = '#8ad8a0'; bx.fillRect(g - 3, 128, 1, 14); bx.fillStyle = '#e8e0c0'; bx.fillRect(g - 2, 111, 4, 1); }
        const ring = (x, y, s) => { bx.strokeStyle = '#ffd060'; bx.lineWidth = 2; bx.beginPath(); bx.ellipse(x, y, 7 * s, 3 * s, 0, 0, Math.PI * 2); bx.stroke(); };
        if (this.voo) { const p = this.voo.k / 22; ring(this.voo.x, 176 - p * 66 - Math.sin(p * Math.PI) * 30, 1 - p * 0.3); }
        else if (!this.fim && this.tries > 0) { bx.fillStyle = '#d8a078'; bx.fillRect(Math.round(this.hx) - 4, 172, 8, 8); ring(Math.round(this.hx), 170, 1); }
        if (this.msgT > 0) txt(this.msg, 120, 90, { align: 'center', col: this.msg === 'ENCAIXOU!' ? '#9be58a' : '#ff8a8a' });
        rodape(this.fim ? 'Fim de rodada!' : 'A: soltar a argola no gargalo');
      } };
    openWin(w);
  });
}
// PESCARIA
function jogoPesca() {
  return new Promise(res => {
    const patos = [0, 1, 2, 3, 4, 5].map(i => ({ b: i * 36, v: 0.7 + (i % 3) * 0.25, n: [1, 1, 2, 1, 3, 1][i], pego: false }));
    const w = { type: 'feira', t: 0, tries: 3, pts: 0, anzol: null, msg: null, msgT: 0, fim: 0,
      px(p) { return 28 + ((p.b + this.t * p.v) % 184); },
      update() {
        this.t++;
        if (this.fim) { if (++this.fim > 50) { closeWin(this); res(this.pts); } return; }
        if (this.msgT > 0) this.msgT--;
        if (this.anzol) {
          this.anzol.k++;
          if (this.anzol.k === 16) { const p = patos.find(q => !q.pego && Math.abs(this.px(q) - 120) <= 7); if (p) { p.pego = true; this.pts += p.n; this.msg = `Pato nº ${p.n}!`; sfx('blipTri', 1100); } else { this.msg = 'Só água.'; sfx('cancel'); } this.msgT = 40; }
          if (this.anzol.k >= 32) { this.anzol = null; if (this.tries <= 0) this.fim = 1; }
        } else if (btnp('a') && this.tries > 0) { this.anzol = { k: 0 }; this.tries--; sfx('select'); }
      },
      draw() {
        moldura('Pescaria da Dona Zuleide', '#8fd0f0', this);
        bx.fillStyle = '#5a3a2a'; bx.fillRect(22, 132, 196, 34); bx.fillStyle = '#3a7ab8'; bx.fillRect(26, 136, 188, 26);
        for (let x = 26; x < 214; x += 6) { bx.fillStyle = '#8fd0f0'; bx.fillRect(x + Math.round(Math.sin(this.t * 0.1 + x) * 1), 137, 3, 1); }
        for (const p of patos) { if (p.pego) continue; const x = Math.round(this.px(p)), y = 140 + Math.round(Math.sin(this.t * 0.15 + p.b) * 1); bx.fillStyle = '#f0d040'; bx.fillRect(x - 5, y, 10, 6); bx.fillRect(x + 1, y - 4, 5, 5); bx.fillStyle = '#f08030'; bx.fillRect(x + 6, y - 2, 2, 1); bx.fillStyle = '#2a2a2a'; bx.fillRect(x + 3, y - 3, 1, 1); }
        const k = this.anzol ? this.anzol.k : 0, d = k <= 16 ? k / 16 : (32 - k) / 16, yA = 76 + d * 64;
        bx.fillStyle = '#c8c8c8'; bx.fillRect(120, 74, 1, Math.round(yA - 74)); bx.fillStyle = '#e8e8e8'; bx.fillRect(119, Math.round(yA), 3, 3); bx.fillRect(121, Math.round(yA) - 2, 1, 2);
        bx.fillStyle = '#8a5a2a'; bx.fillRect(96, 72, 26, 3);
        if (this.msgT > 0) txt(this.msg, 120, 92, { align: 'center', col: this.msg.startsWith('Pato') ? '#9be58a' : '#ff8a8a' });
        rodape(this.fim ? 'Fim de rodada!' : 'A: descer o anzol quando o pato passar');
      } };
    openWin(w);
  });
}
// TIRO DE ROLHA
function jogoLatas() {
  return new Promise(res => {
    const latas = []; for (let r = 0; r < 3; r++) for (let i = 0; i <= r; i++) latas.push({ x: 120 - r * 9 + i * 18, y: 104 + r * 14, cai: 0 });
    const w = { type: 'feira', t: 0, tries: 3, pts: 0, msg: null, msgT: 0, fim: 0, flash: 0,
      update() {
        this.t++;
        if (this.fim) { if (++this.fim > 50) { closeWin(this); res(this.pts); } return; }
        if (this.msgT > 0) this.msgT--; if (this.flash > 0) this.flash--;
        for (const l of latas) if (l.cai) l.cai++;
        this.mx = 120 + Math.sin(this.t * 0.045) * 64; this.my = 118 + Math.sin(this.t * 0.071 + 1) * 34;
        if (btnp('a') && this.tries > 0 && !this.flash) {
          this.tries--; this.flash = 14; sfx('hit');
          let n = 0; for (const l of latas) if (!l.cai && Math.abs(l.x - this.mx) <= 9 && Math.abs(l.y - this.my) <= 8) { l.cai = 1; n++; }
          if (n) { for (const l of latas) if (!l.cai && l.y < this.my - 2 && Math.abs(l.x - this.mx) <= 14) { l.cai = 1; n++; } }
          this.pts += n; this.msg = n >= 3 ? `CAÍRAM ${n}!` : n ? `Caiu ${n}!` : 'Rolha no pano.'; this.msgT = 40;
          if (this.tries <= 0) setTimeout(() => { this.fim = 1; }, 600);
        }
      },
      draw() {
        moldura('Tiro de Rolha do Seu Bené', '#ff8a8a', this);
        bx.fillStyle = '#7a1a3a'; bx.fillRect(40, 70, 160, 100); bx.fillStyle = '#5a3a2a'; bx.fillRect(60, 142, 120, 6);
        const C = ['#c84a4a', '#e8e8e8', '#4a8ac8'];
        latas.forEach((l, i) => { const y = l.y + (l.cai ? Math.min(60, l.cai * l.cai * 0.3) : 0); if (y > 170) return; bx.fillStyle = C[i % 3]; bx.fillRect(Math.round(l.x - 6), Math.round(y - 6), 12, 13); bx.fillStyle = '#ffffff'; bx.fillRect(Math.round(l.x - 4), Math.round(y - 4), 2, 8); bx.fillStyle = '#8a8a8a'; bx.fillRect(Math.round(l.x - 6), Math.round(y - 7), 12, 1); });
        if (!this.fim && this.tries > 0 || this.flash) { const x = Math.round(this.mx), y = Math.round(this.my); bx.fillStyle = this.flash ? '#ffffff' : '#ffd060'; bx.fillRect(x - 8, y, 6, 1); bx.fillRect(x + 3, y, 6, 1); bx.fillRect(x, y - 8, 1, 6); bx.fillRect(x, y + 3, 1, 6); fxRing(x, y, 5, bx.fillStyle, 0.9); }
        if (this.msgT > 0) txt(this.msg, 120, 76, { align: 'center', col: this.msg.startsWith('Rolha') ? '#ff8a8a' : '#9be58a' });
        rodape(this.fim ? 'Fim de rodada!' : 'A: atirar quando a mira passar nas latas');
      } };
    openWin(w);
  });
}

// ---------- as barracas ----------
async function barracaArgolas() {
  if (!G.flags.feiraArg) { G.flags.feiraArg = true; await say('Argola no gargalo, ganha ficha! Três argolas, três cobres! A mão é sua, o azar é seu!', 'tonho'); }
  const c = await choose('* Jogar argolas? (3 cobres)', ['Jogar', 'Agora não'], 'n', 1); if (c !== 0 || !(await pagaJogo('tonho'))) return;
  const p = await jogoArgolas(); JOGOU('argolas'); ganhaFichas(p);
  await say(p === 3 ? 'TRÊS! Olha a mala acertando tudo! Alguém chama o jornal!' : p ? `${p} no gargalo. Volta amanhã que a garrafa esquece.` : 'Nenhuma? A garrafa tá rindo de você. Eu também, mas por educação, por dentro.', 'tonho');
  if (p === 3 && !G.flags.feiraArg3) { G.flags.feiraArg3 = true; await say('Você nem tem mão. Como é que você fez isso?', 'rita'); await say('Tampa. Muita prática de fechar.', 'me'); }
}
async function barracaPesca() {
  if (!G.flags.feiraPes) { G.flags.feiraPes = true; await say('Pescaria! Pato com número embaixo, número vira ficha. Os patos são honestos. O laguinho, não muito.', 'zuleide'); }
  const c = await choose('* Pescar? (3 cobres)', ['Pescar', 'Agora não'], 'n', 1); if (c !== 0 || !(await pagaJogo('zuleide'))) return;
  const p = await jogoPesca(); JOGOU('pesca'); ganhaFichas(p);
  await say(p >= 5 ? 'Pegou o pato TRÊS! Esse pato não sai faz dois festivais!' : p ? `${p} ficha${p > 1 ? 's' : ''}. Pato bom é pato que volta pro lago.` : 'Nenhum? Eles sentem quando é baú. Dizem.', 'zuleide');
  if (!G.flags.feiraPesLume) { G.flags.feiraPesLume = true; await say('Pato nº 3... Eu queria um pato. Não de ficha. Um pato mesmo. De estimação. Que andasse atrás de mim.', 'lume'); await say('Você já tem um baú que anda atrás de você.', 'rita'); await say('...É verdade. Retiro o pedido.', 'lume'); }
}
async function barracaLatas() {
  if (!G.flags.feiraLat) { G.flags.feiraLat = true; await say('Tiro de rolha! Derruba a pirâmide, leva ficha! Rolha de verdade, espingarda de mentira!', 'bene'); await say('Me dá isso. Escudeira com licença atira em qualquer coisa que não seja gente. Lata não é gente.', 'rita'); }
  const c = await choose('* A Rita atira? (3 cobres)', ['Atirar', 'Agora não'], 'n', 1); if (c !== 0 || !(await pagaJogo('bene'))) return;
  const p = await jogoLatas(); JOGOU('latas'); const f = p >= 6 ? 3 : p >= 4 ? 2 : p >= 2 ? 1 : 0; ganhaFichas(f);
  await say(p >= 6 ? 'A pirâmide INTEIRA! Moça, você tá proibida de voltar. Leva as fichas e some.' : p ? `${p} latas no chão. A rolha tem mira, a moça tem braço.` : 'Errou tudo? Com essa lança nas costas?', 'bene');
  if (p >= 6 && !G.flags.feiraLat6) { G.flags.feiraLat6 = true; await say('Seis latas. Seis anos de serviço. Eu sabia que um dia isso ia servir pra alguma coisa.', 'rita'); }
}
async function barracaDoces() {
  if (!G.flags.feiraDoce) { G.flags.feiraDoce = true; await say('Maçã do amor, milho, pastel, café coado! Doce de festa cura até saudade. Quase.', 'cotinha'); }
  await comprar3('doces', 'cotinha');
}
async function barracaCorreio() {
  if (!G.flags.feiraCor) { G.flags.feiraCor = true; await say('Correio elegante! Você escreve, meu sobrinho entrega. Dois cobres, e o segredo é por conta da casa.', 'dalila'); }
  const quem = [['lume', 'Para a Lume'], ['rita', 'Para a Rita'], ['cat', 'Para o Catálogo']].filter(([k]) => !(G.flags.correio || {})[k]);
  if (!quem.length) { await say('Já mandou pra todo mundo! Agora só sobrou mandar pra você mesmo. Já vi gente fazer. Funciona.', 'dalila'); return; }
  const c = await choose('* Mandar um correio elegante? (2 cobres)', [...quem.map(q => q[1]), 'Agora não'], 'n', quem.length); if (c < 0 || c >= quem.length) return;
  if ((G.cobres || 0) < 2) { await say('Dois cobres, meu bem. Amor de graça só no fim do mês.', 'dalila'); return; }
  G.cobres -= 2; const k = quem[c][0]; (G.flags.correio = G.flags.correio || {})[k] = true; JOGOU('correio');
  if (k === 'lume') {
    const m = await choose('* O que vai no bilhete?', ['"Você é a luz mais bonita da avenida."', '"Dança comigo depois do discurso?"', '"Ass.: alguém de tampa."'], 'n');
    await say('* Um menino de boné corre entre as pernas do povo e entrega um papel dobrado para a Lume. Ela lê. Lê de novo. Olha para você. Olha para o papel.');
    if (m === 0) await say('Tem DUZENTAS lanternas nessa avenida, @. ...Ganhei de duzentas? Só pra ter certeza.', 'lume');
    else if (m === 1) await say('Dançar? Você é um BAÚ. ...Tá. Tá bom. Mas eu conduzo. Você só gira.', 'lume');
    else await say('"Alguém de tampa." Que mistério. Quem será. Hmm. Quem. Será. ...Eu vou guardar isso pra sempre, tá?', 'lume');
    await say('* Ela dobra o bilhete em quatro e guarda dentro do lustre, onde ninguém mais alcança.');
    if (typeof maisCoracao2 === 'function') maisCoracao2(1);
  } else if (k === 'rita') {
    const m = await choose('* O que vai no bilhete?', ['"Obrigado pelo pastel. Por todos."', '"Melhor escudeira da superfície."', '"Você ainda me deve um pastel."'], 'n');
    await say('* O menino de boné entrega o bilhete para a Rita. Ela lê com a cara de quem está lendo multa.');
    if (m === 0) await say('...Todos? Só teve um. ...Tá. Os outros vão ter. Promessa de escudeira.', 'rita');
    else if (m === 1) await say('"Da superfície." Lá embaixo eu era melhor ainda. Mas aceito. Vou pendurar na lança.', 'rita');
    else await say('EU devo? Quem pagou fui EU! ...Tá bom. Dois. Amanhã. Pra fechar a conta.', 'rita');
  } else {
    await say('* O menino olha para o Catálogo. O Catálogo olha para o menino. O menino deixa o bilhete no chão e foge.');
    await say('[Correio recebido. Conteúdo: carinhoso. Classificação: irregular. Resposta: ...obrigado. Este registro será apagado. Não foi apagado.]', 'cat');
  }
}
async function barracaDesejo() {
  if (G.flags.feiraDes) { await say(pickOne(['A lanterna de vocês ainda tá lá em cima. Olha. Aquela torta. É a de vocês.', 'Desejo é que nem pastel: um por noite, senão faz mal.']), 'ambrosio'); return; }
  await say('Lanterna dos desejos. Cinco cobres, papel de arroz, fogo de vela. Cada um diz um desejo baixinho, e a lanterna leva.', 'ambrosio');
  const c = await choose('* Soltar uma lanterna? (5 cobres)', ['Soltar', 'Agora não'], 'n', 1); if (c !== 0) return;
  if ((G.cobres || 0) < 5) { await say('Cinco cobres. Desejo de graça a lanterna não leva: fica pesado.', 'ambrosio'); return; }
  G.cobres -= 5; G.flags.feiraDes = true; JOGOU('desejo');
  const cena = { type: 'lanterna', f0: FRAME, fim: false, get t() { return FRAME - this.f0; }, update() { }, draw() {
    bx.fillStyle = '#0c1028'; bx.fillRect(-200, 0, 640, 240);
    for (let i = 0; i < 40; i++) { bx.fillStyle = i % 5 ? '#4a4a7a' : '#c8c8f0'; bx.fillRect((i * 53) % 240, (i * 31) % 150, 1, 1); }
    for (let i = 0; i < 14; i++) { const y = 230 - ((this.t * (0.25 + (i % 4) * 0.08) + i * 40) % 260), x = 20 + ((i * 37) % 200) + Math.sin(this.t * 0.02 + i) * 4; bx.fillStyle = '#e8a040'; bx.fillRect(Math.round(x), Math.round(y), 4, 5); bx.fillStyle = '#ffe08a'; bx.fillRect(Math.round(x) + 1, Math.round(y) + 1, 2, 3); }
    const y = Math.max(46, 150 - this.t * 0.45), x = 120 + Math.sin(this.t * 0.03) * 6;
    { const X = Math.round(x), Y = Math.round(y); for (let r = 16; r >= 8; r -= 4) { bx.globalAlpha = 0.12; bx.fillStyle = '#ffd070'; bx.beginPath(); bx.arc(X, Y + 2, r, 0, Math.PI * 2); bx.fill(); } bx.globalAlpha = 1;
      bx.fillStyle = '#f8e8c0'; bx.fillRect(X - 5, Y - 6, 10, 2); bx.fillRect(X - 6, Y - 4, 12, 11); bx.fillRect(X - 5, Y + 7, 10, 1); bx.fillStyle = '#ffd060'; bx.fillRect(X - 4, Y - 2, 8, 8); bx.fillStyle = '#fff8d8'; bx.fillRect(X - 1, Y + 1, 2, 4); bx.fillStyle = '#e8a040'; bx.fillRect(X - 2, Y + 8, 4, 1); }
    bx.fillStyle = '#2a1830'; bx.fillRect(-200, 214, 640, 26); for (let i = -9; i < 21; i++) { bx.fillStyle = '#3a2440'; bx.fillRect(i * 22, 206 - (i % 3) * 4, 16, 12); }
  } };
  UI.stack.push(cena);
  await say('* Vocês seguram a lanterna pelas pontas. O papel enche de ar quente e puxa, como um bicho que quer ir embora.');
  await say('Que o Seu Jorge leve o 31 pra casa. Ele merece uma estrada que termine.', 'rita');
  await say('Que a sorveteria da Cidade Alta abra de noite também. ...E que ninguém esqueça ninguém. Nessa ordem. Não, na ordem contrária.', 'lume');
  const d = await choose('* E você?', ['"Que a gente continue junto."', '"Um rosto que não derrete."', '"Pastel toda sexta."'], 'n');
  if (d === 0) { await say('* A Lume não diz nada. Ela só encosta a luz dela de leve na sua tampa, e a lanterna sobe um pouco mais rápido.'); }
  else if (d === 1) { await say('Esse é bom. Mas eu gosto do rosto que derrete. Avisa quando vai embora.', 'rita'); }
  else { await say('* A Rita ri tão alto que três pessoas olham. A lanterna sobe assim mesmo, carregando um desejo de pastel. É um bom desejo.'); }
  await say('* Vocês soltam. A lanterna sobe, torta, entre as outras, até virar uma estrela que ninguém vai conseguir apontar depois.');
  const i = UI.stack.indexOf(cena); if (i >= 0) UI.stack.splice(i, 1);
  save2();
}
const PREMIOS = [['frasco', 'Frasco de Âmbar', 2, () => { G.items.frasco = (G.items.frasco || 0) + 1; }], ['maca', 'Maçã do Amor x2', 2, () => { G.items.maca = (G.items.maca || 0) + 2; }], ['tintaS', 'Tinta de Superfície x2', 3, () => { G.items.tintaS = (G.items.tintaS || 0) + 2; }],
  ['pluma', 'Pena de Fênix?', 5, () => { G.items.pluma = (G.items.pluma || 0) + 1; }], ['broche', 'Broche de Lata do Festival', 12, () => { ganharEquip('brocheFesta'); G.flags.brocheFesta = true; }]];
Object.assign(EQ2, { brocheFesta: { nm: 'Broche de Lata do Festival', slot: 'amuleto', who: ['lume', 'rita'], mod: { atk: 2, mag: 2, spd: 1 }, fx: [], preco: 0, d: 'Um sol de lata, igual ao do palco. Prêmio de 12 fichas. +2 ATQ, +2 MAG, +1 VEL.' } });
async function barracaPremios() {
  if (!G.flags.feiraPre) { G.flags.feiraPre = true; await say('Ficha vira prêmio! Prêmio vira lembrança! Lembrança não vira nada, mas é bonita.', 'benevides'); }
  while (true) {
    const its = PREMIOS.filter(p => !(p[0] === 'broche' && G.flags.brocheFesta)).map(p => ({ k: p[0], label: p[1], right: p[2] + ' fichas', disabled: fichas() < p[2], d: p[0] === 'broche' ? EQ2.brocheFesta.d : (ITEM2[p[0]] || {}).d }));
    const i = await list({ x: 24, y: 30, w: 192, title: `Prêmios     Fichas: ${fichas()}`, items: its, desc: j => its[j] && its[j].d, descY: 150 });
    if (i < 0) return;
    const P = PREMIOS.find(p => p[0] === its[i].k); if (fichas() < P[2]) { sfx('cancel'); continue; }
    G.fichas -= P[2]; P[3](); sfx('item'); await say(P[0] === 'broche' ? 'O broche! Ninguém leva o broche! Faz três festivais que ninguém leva o broche! ...Tá, leva. Pode levar. Leva.' : 'Prêmio entregue! Volte sempre, e traga mais sorte.', 'benevides');
    if (P[0] === 'broche') await say('* (Broche de Lata do Festival: amuleto da Lume ou da Rita. Equipe pelo MENU.)');
    save2();
  }
}
// estoque dos doces
{ const _e3 = estoque3; estoque3 = function (id) { if (id !== 'doces') return _e3(id); return [{ k: 'maca', preco: 15 }, { k: 'pastel', preco: 25 }, { k: 'cafe', preco: 22 }]; }; }

// ---------- liga as barracas no mapa ----------
const BARR_JOGO = { 0: barracaArgolas, 2: barracaPesca, 3: barracaLatas, 4: barracaCorreio, 5: barracaDoces, 6: barracaDesejo, 7: barracaPremios };
{ const _mmF = montarMapas2; montarMapas2 = function () {
  _mmF.apply(this, arguments);
  const M = MAPS2.festival; if (!M || M._feira) return; M._feira = true;
  for (const [i, fn] of Object.entries(BARR_JOGO)) { const [x, y] = FE.barracas[i]; M.ents.push({ t: 'sign', x: x + 1, y, h: 40, talk: async () => { if (!G.flags.c3Noite1) { await say('* A barraca ainda está coberta com lona. Abre na noite do festival.'); return; } W2.mv = null; await fn(); } }); }
}; }
DIARIO.push({ tipo: 'side', cap: 'Festival da Luz', quem: 'a Avenida', tit: 'Noite de festa', vis: () => !!G.flags.c3Noite1, feita: () => ['argolas', 'pesca', 'latas', 'correio', 'desejo'].every(k => (G.flags.feira || {})[k]), recompensa: 'fichas, prêmios e o Broche de Lata', desc: 'As barracas da Avenida do Festival: argolas, pescaria, tiro de rolha, correio elegante e a lanterna dos desejos. As fichas viram prêmio com o Seu Benevides.',
  passos: [['Argolas do Seu Tonho', () => !!(G.flags.feira || {}).argolas], ['Pescaria da Dona Zuleide', () => !!(G.flags.feira || {}).pesca], ['Tiro de rolha do Seu Bené', () => !!(G.flags.feira || {}).latas], ['Correio elegante', () => !!(G.flags.feira || {}).correio], ['Lanterna dos desejos', () => !!(G.flags.feira || {}).desejo]] });
