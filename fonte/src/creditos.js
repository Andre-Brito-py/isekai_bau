// ===== Créditos da Temporada 1 (pedido do usuário: engraçados, "tudo André Pereira Brito", e o baú no fim) =====
const AUTOR8 = 'André Pereira Brito';
const CREDITS8 = [
  ['T', 'RENASCI COMO BAÚ'], ['s', 'Temporada 1'], [],
  ['h', 'Direção'], ['n', AUTOR8], [],
  ['h', 'Roteiro'], ['n', AUTOR8], [],
  ['h', 'Level design'], ['n', AUTOR8], [],
  ['h', 'Arte'], ['n', AUTOR8], [],
  ['h', 'Arte das partes que ninguém olhou'], ['n', AUTOR8], [],
  ['h', 'História'], ['n', AUTOR8], [],
  ['h', 'Reviravoltas que ninguém esperava'], ['n', AUTOR8], [],
  ['h', 'Trilha sonora'], ['n', AUTOR8], ['s', '(cantarolando)'], [],
  ['h', 'Efeitos sonoros'], ['n', AUTOR8], ['s', '(com a boca)'], [],
  ['h', 'Dublagem do Catálogo'], ['n', '[Não consta.]'], [],
  ['h', 'Controle de qualidade'], ['n', AUTOR8], ['s', '(no celular, dentro do ônibus)'], [],
  ['h', 'Achou o bug da porta piscando'], ['n', AUTOR8], [],
  ['h', 'Balanceamento'], ['n', AUTOR8], ['s', '(apanhando da Carruagem)'], [],
  ['h', 'Departamento de Dificuldade'], ['n', AUTOR8], ['s', '"tá fácil demais, aumenta"'], [],
  ['h', 'Recursos Humanos'], ['n', AUTOR8], [],
  ['h', 'Café da equipe'], ['n', AUTOR8], [],
  ['h', 'A equipe'], ['n', AUTOR8], [],
  ['h', 'Estagiário que digitava o código'], ['n', 'Claude'], ['s', '(pago em tokens)'], [],
  [], ['T', 'ELENCO'], [],
  ['h', 'O Baú'], ['n', 'ele mesmo'], [],
  ['h', 'Lume'], ['n', 'Lume'], ['s', '(ela exigiu o nome em letras maiores)'], [],
  ['h', 'Ofélia'], ['n', 'Clara'], ['s', '(ops)'], [],
  ['h', 'Seu Jorge'], ['n', 'Seu Jorge, ao volante'], [],
  ['h', 'Musgo'], ['n', 'Musgo'], ['s', '(ocupou três cadeiras no camarim)'], [],
  ['h', 'Cocheiro sem cabeça'], ['n', 'não compareceu às gravações'], [],
  ['h', 'Os Cavalos de Ferrugem'], ['n', 'dublês'], [],
  ['h', 'A meia que aparece na tampa'], ['n', 'ninguém sabe'], [],
  ['h', 'Figuração'], ['n', 'os passageiros do 31'], [],
  [], ['T', 'AGRADECIMENTOS'], [],
  ['n', 'Ao pastel de queijo da feira,'], ['n', 'que nunca foi pago.'], [],
  ['n', 'À Madame Pavio,'], ['n', 'por motivos que a Lume prefere não comentar.'], [],
  ['n', 'A todos os baús do mundo'], ['n', 'que nunca foram abertos.'], [],
  ['s', 'Nenhum baú foi ferido durante a produção.'], ['s', '(mentira: vários foram mordidos)'], [],
  ['h', 'E a você,'], ['n', 'que jogou até aqui.'], [], [], []
];
const CR8H = { T: 18, h: 11, n: 13, s: 11 };
async function creditsRoll8() {
  playMusic('ceu8');
  let total = 0; for (const l of CREDITS8) total += l.length ? CR8H[l[0]] + 2 : 9;
  await openWin({ type: 'credits8', t: 0, y: 0, end: 0, k: 0,
    update() {
      this.t++;
      if (!this.end) { this.y += (KEYS.a || KEYS.b) ? 1.6 : 0.36; if (this.y > total + 250) { this.end = this.t; sfx('catalog'); } }
      else { this.k = this.t - this.end; if (this.k > 290 && btnp('a')) { sfx('select'); closeWin(this); } }
    },
    draw() {
      bx.fillStyle = '#05030a'; bx.fillRect(0, 0, W, H);
      for (let i = 0; i < 36; i++) { const x = (i * 71 + 13) % 240, y = ((i * 37 + 5) - this.t * 0.1 * (1 + i % 3)) % 240; if ((FRAME + i * 13) % 90 < 64) { bx.fillStyle = i % 4 ? '#5a5070' : '#ffe066'; bx.fillRect(x, (y + 240) % 240, 1, 1); } }
      if (!this.end) {
        let y = 240 - this.y;
        for (const l of CREDITS8) {
          if (!l.length) { y += 9; continue; }
          const [k, s] = l, h = CR8H[k];
          if (y > -20 && y < 250) {
            const fadeE = Math.min(1, Math.min(y + 10, 240 - y) / 30);
            const st = { T: { sz: 1.5, col: '#ffe066' }, h: { col: '#8fe3ff' }, n: { col: '#ffffff' }, s: { col: '#8a8099' } }[k];
            txt(s, 120, Math.round(y), { align: 'center', sz: st.sz, col: st.col, alpha: Math.max(0, fadeE) });
          }
          y += h + 2;
        }
        if (this.t < 400) txt('segure A para acelerar', 236, 4, { align: 'right', col: '#3a3448' });
        return;
      }
      // o baú agradece
      const k = this.k, sp = (SP[spec().sp] || SP.chest), fr = sp[Math.floor(k / 14) % sp.length];
      const hop = k < 60 ? Math.abs(Math.sin(k / 8)) * 10 * (1 - k / 60) : Math.abs(Math.sin(k / 12)) * 2;
      const S = 4, w = fr.width * S, h = fr.height * S, x = 120 - w / 2, y = 156 - h - hop;
      bx.save(); bx.imageSmoothingEnabled = false;
      bx.globalAlpha = 0.35; bx.fillStyle = '#000'; bx.fillRect(120 - w * 0.35, 158, w * 0.7, 3); bx.globalAlpha = 1;
      bx.drawImage(fr, Math.round(x), Math.round(y), w, h); bx.restore();
      if (SP.lume && k > 40) { const lf = SP.lume[Math.floor(k / 10) % SP.lume.length]; bx.drawImage(lf, Math.round(150 + w / 2 - 8), Math.round(70 + Math.sin(k / 15) * 4)); }
      const say1 = 'OBRIGADO POR JOGAR!', say2 = 'Sério. Eu sou um baú.', say3 = 'Ninguém nunca me abriu', say4 = 'com tanto carinho.';
      const n1 = Math.max(0, Math.min(say1.length, Math.floor((k - 20) / 2))), n2 = Math.max(0, Math.min(say2.length, Math.floor((k - 70) / 2)));
      txt(say1.slice(0, n1), 120, 16, { align: 'center', sz: 1.5, col: '#ffe066' });
      if (n2) txt(say2.slice(0, n2), 120, 38, { align: 'center', col: '#ffffff' });
      const n3 = Math.max(0, Math.min(say3.length, Math.floor((k - 70 - say2.length * 2) / 2))); if (n3) txt(say3.slice(0, n3), 120, 50, { align: 'center', col: '#ffffff' });
      const n4 = Math.max(0, Math.min(say4.length, Math.floor((k - 70 - (say2.length + say3.length) * 2) / 2))); if (n4) txt(say4.slice(0, n4), 120, 62, { align: 'center', col: '#ffffff' });
      if (k > 230) {
        const a = Math.min(1, (k - 230) / 40);
        txt('TEMPORADA 2', 120, 170, { align: 'center', sz: 1.5, col: '#ff8fa8', alpha: a });
        txt('em desenvolvimento', 120, 190, { align: 'center', col: '#8fe3ff', alpha: a });
        txt('A superfície espera. O pastel também.', 120, 204, { align: 'center', col: '#b8aecb', alpha: a });
      }
      if (k > 290 && FRAME % 50 < 34) txt('A para continuar', 120, 228, { align: 'center', col: '#8a8099' });
    } });
}
