// ================= A TAVERNA DO REMO TORTO, VIVA =================
// Salão maior (20x13): balcão com a Dona Neusa, porta da cozinha, lareira, seis mesas com comida e caneca,
// fregueses comendo, bebendo, brindando e rindo, um bardo de noite, e dois garçons que pegam a bandeja no balcão
// ou na cozinha e servem as mesas. De dia é almoço tranquilo; de noite enche (marujo, caçador de folga, música).

const PT_ = POS2.taverna;
Object.assign(HUMS, {
  quincas: { h: 49, skin: '#c8906a', hair: '#2a1a10', top: '#f2ecdc', coat: '#2a2a34', bottom: '#2a2a34', apron: '#e8e0d0' },
  bia: { h: 46, skin: '#a86a4a', hair: '#3a1a10', hairStyle: 'coque', top: '#b83a3a', bottom: '#5a2a2a', apron: '#f2ecdc' },
  lucio: { h: 48, skin: '#d8a078', hair: '#8a8a90', beard: true, top: '#4a7a4a', coat: '#3a5a3a', bottom: '#3a3a2a', hat: '#6a4a2a' },
  cleide: { h: 45, skin: '#e0b090', hair: '#c8a060', hairStyle: 'coque', top: '#8a5ab8', bottom: '#3a3050' },
  toninho: { h: 50, skin: '#b87850', hair: '#1a1010', top: '#d87a30', bottom: '#3a3a4a', beard: true },
  marujo: { h: 51, skin: '#a87050', hair: '#2a1a10', top: '#e8e8f0', bottom: '#2a3a6a', hat: '#2a3a6a', extra: (P, o) => { if (o.view !== 'b') for (let y = o.tT + 3; y < o.tB; y += 3) P.rect(o.cx - 5, y, 10, 1, '#3a5a9a'); } },
  folga: Object.assign({}, CAC_HUM, { hat: null, top: '#5a4a3a' })
});
Object.assign(WHO, {
  quincas: { name: () => 'Quincas', portrait: () => portHum('quincas'), voice: voz(380) },
  bia: { name: () => 'Bia', portrait: () => portHum('bia'), voice: voz(700) },
  lucio: { name: () => 'Seu Lúcio, o bardo', portrait: () => portHum('lucio'), voice: voz(300, 'blipTri') },
  cleide: { name: () => 'Dona Cleide', portrait: () => portHum('cleide'), voice: voz(620) },
  toninho: { name: () => 'Toninho', portrait: () => portHum('toninho'), voice: voz(240, 'blipLow') },
  marujo: { name: () => 'Marujo', portrait: () => portHum('marujo'), voice: voz(200, 'blipLow') },
  folga: { name: () => 'Caçador de folga', portrait: () => portHum('folga'), voice: voz(190, 'blipLow') }
});

// ---------- arte ----------
function lareiraArt(f) {
  const P = new Pix(48, 58), St = ramp('#7a7480'), Bk = ramp('#3a2a24');
  for (let y = 0; y < 58; y++) for (let x = 0; x < 48; x++) { const row = y >> 2, off = (row % 2) * 4, edge = (y % 4 === 3) || ((x + off) % 8 === 0); P.p(x, y, P.tone(St, (edge ? 0.25 : 0.55) - y / 200, x, y)); }
  P.rect(8, 26, 32, 28, Bk[0]); P.rect(10, 28, 28, 26, '#140c0a');
  P.rect(4, 22, 40, 4, ramp('#5a3a24')[2]); P.rect(4, 22, 40, 1, ramp('#5a3a24')[3]);
  // lenha e fogo (dois quadros)
  P.rect(13, 49, 22, 3, ramp('#6a4a2a')[1]); P.rect(15, 47, 18, 2, ramp('#6a4a2a')[2]);
  const fl = f ? [[16, 46, 4, 8], [22, 46, 5, 12], [29, 46, 4, 9]] : [[17, 46, 4, 10], [23, 46, 4, 9], [28, 46, 5, 11]];
  for (const [x, y, w, h] of fl) { for (let j = 0; j < h; j++) { const ww = Math.max(1, Math.round(w * (1 - j / h))); P.rect(x + Math.floor((w - ww) / 2), y - j, ww, 1, j < h * 0.4 ? '#ffd060' : j < h * 0.75 ? '#f07830' : '#c83a18'); } }
  P.p(24, 40, '#fff0c0'); P.rect(6, 18, 6, 4, ramp('#c8a060')[2]); P.rect(36, 16, 5, 6, ramp('#7ad0f0')[1]);
  return P.outline().canvas();
}
const lareira = [memo(() => lareiraArt(0)), memo(() => lareiraArt(1))];
function mesaTav(v) {
  const c = mesaArt(), x = c.getContext('2d'), R = rng(v + 3);
  const it = [['caneca', 6], ['prato', 16], ['caneca', 28], ['jarra', 22]].slice(0, 2 + (v % 3));
  for (const [k, px] of it) {
    if (k === 'caneca') { x.fillStyle = '#2a1a10'; x.fillRect(px - 1, 0, 6, 7); x.fillStyle = '#c8a060'; x.fillRect(px, 1, 4, 5); x.fillStyle = '#f2ecdc'; x.fillRect(px, 0, 4, 2); x.fillStyle = '#8a6a3a'; x.fillRect(px + 4, 2, 2, 3); }
    if (k === 'prato') { x.fillStyle = '#2a1a10'; x.fillRect(px - 1, 2, 10, 4); x.fillStyle = '#e8e8f0'; x.fillRect(px, 3, 8, 2); x.fillStyle = R() < 0.5 ? '#c87a3a' : '#e8c040'; x.fillRect(px + 2, 2, 4, 2); }
    if (k === 'jarra') { x.fillStyle = '#2a1a10'; x.fillRect(px - 1, -1, 7, 8); x.fillStyle = '#7ab0d0'; x.fillRect(px, 0, 5, 6); }
  }
  return c;
}
const mesasT = [0, 1, 2, 3, 4, 5].map(i => memo(() => mesaTav(i)));
const banquinho = memo(() => { const P = new Pix(12, 10), Wd = ramp('#7a4a2a'); P.cyl(0, 0, 12, 3, Wd, true); P.rect(1, 3, 2, 7, Wd[1]); P.rect(9, 3, 2, 7, Wd[1]); return P.outline().canvas(); });
const portaCozinha = memo(() => { const P = new Pix(22, 38), Wd = ramp('#6a4a2a'); for (let y = 0; y < 38; y++) for (let x = 0; x < 22; x++) P.p(x, y, P.tone(Wd, 0.5 - (x % 7 === 0 ? 0.2 : 0) - y / 120, x, y)); P.rect(4, 8, 14, 8, '#2a1a10'); P.rect(5, 9, 12, 6, '#ffd890'); P.rect(15, 22, 2, 3, ramp('#c8a040')[3]); return P.outline().canvas(); });
const lampiao = memo(() => { const P = new Pix(10, 16); P.rect(4, 0, 2, 4, '#3a3a44'); P.rect(1, 4, 8, 10, '#2a2a34'); P.rect(2, 5, 6, 8, '#ffd060'); P.rect(3, 6, 4, 6, '#fff0c0'); return P.outline().canvas(); });
const lousa = memo(() => { const P = new Pix(30, 20); P.rect(0, 0, 30, 20, '#5a3a24'); P.rect(2, 2, 26, 16, '#1a2a24'); for (let i = 0; i < 4; i++) P.rect(4, 4 + i * 4, 10 + (i * 5) % 12, 1, '#d8d8c8'); for (let i = 0; i < 4; i++) P.rect(22, 4 + i * 4, 4, 1, '#ffd060'); return P.outline().canvas(); });

// ---------- gestos novos ----------
Object.assign(ACT2, {
  comer(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), up = (t % 90) < 25 ? 9 : 0; px2(mx - 1, my - up, '#c8c8d8', 3, 1); if ((t % 90) < 25) px2(mx - 1, my - up - 1, '#e8a030', 2, 1); if (t % 30 < 15) px2(mx + 2, my - 14 - (t % 30) / 3, 'rgba(255,255,255,0.5)'); },
  brindar(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), k = t % 160, up = k < 30 ? 12 : 3; px2(mx - 2, my - up - 2, '#c8a060', 5, 6); px2(mx - 2, my - up - 2, '#f2ecdc', 5, 2); if (k > 12 && k < 26) { txt('tim!', x + 8, y + 15 - fr.height - 12, { align: 'center', col: '#ffe066' }); } },
  rir(e, x, y, t, fr) { if (t % 140 < 50) balao(x + 8, y + 15 - fr.height - 3, ['hahaha', 'kkkk', 'hehe'][Math.floor(t / 140) % 3], { ent: e }); },
  tocar(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr); px2(mx - 6, my - 2, '#a86a3a', 9, 6); px2(mx - 5, my - 1, '#5a3a24', 3, 3); px2(mx + 3, my - 6, '#6a4a2a', 1, 6); if (t % 6 < 3) px2(mx - 3, my + 1, '#ffffff'); if (t % 40 < 30) txt(Math.floor(t / 40) % 2 ? '♫' : '♪', x + 14, y + 15 - fr.height - 4 - (t % 40) / 4, { col: '#ffe066' }); },
  pegar(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), k = Math.min(1, (t % 60) / 30); bandejaEm(mx - 4, my - 4 - k * 4); },
  servir(e, x, y, t, fr) { const { mx, my } = maoDe(e, x, y, fr), k = Math.min(1, (t % 80) / 30); if (k < 1) bandejaEm(mx - 4 + DIR2[e.dir][0] * 6 * k, my - 8 + DIR2[e.dir][1] * 6 * k); else if (t % 80 < 60) balao(x + 8, y + 15 - fr.height - 3, ['Prontinho!', 'Bom apetite!', 'Cuidado, quente!'][Math.floor(t / 80) % 3], { ent: e }); },
  bandeja(e, x, y, t, fr) { const top = y + 15 - fr.height; bandejaEm(x + 3 + (e.dir === 'left' ? -4 : 4), top + 14 + (Math.floor(t / 8) % 2)); }
});
function bandejaEm(x, y) { x = Math.round(x); y = Math.round(y); px2(x - 1, y + 3, '#2a1a10', 12, 2); px2(x, y + 3, '#a8a8b8', 10, 1); px2(x + 1, y - 2, '#c8a060', 3, 5); px2(x + 1, y - 2, '#f2ecdc', 3, 1); px2(x + 6, y, '#e8e8f0', 4, 3); px2(x + 7, y - 1, '#c87a3a', 2, 1); }

// ---------- falas ----------
const falaT = (who, ls) => async () => { await say(pickOne(ls), who); };
async function falaFolga() {
  if (!G.flags.folgaVista) { G.flags.folgaVista = true; await say('Tô de folga. Se uma mala andar na minha frente, eu culpo o vinho e peço outro.', 'folga'); await say('...Ele te viu, @. Ele piscou pra você.', 'lume'); return; }
  await say(pickOne(['Trezentos frascos pela mala. Eu ganho quatro cobres por dia. Faz a conta e me diz se eu vou correr atrás de mala de noite.', 'O Brás voltou da escadaria massageando o orgulho. Disse que perdeu pra uma "bagagem muito determinada". A Guilda inteira riu.']), 'folga');
}
async function falaLucio() {
  if (G.flags.c2Boss && !G.flags.lucioBalada) { G.flags.lucioBalada = true; await say('Fiz uma música nova: "A Badalada e o Baú". Rima "tampa" com "estampa". Não é minha melhor, mas o povo pede.', 'lucio'); return; }
  await say(pickOne(['Toco aqui toda noite por um prato de caldo. A fonte da praça paga melhor que eu: leve a moça lá, que ela tem voz de gente que já cantou pra muita gente.', 'Dizem que o Acendedor-Mor paga até músico pra tocar nos postes novos. Música pra poste. Que tempo.', 'Lá embaixo tem um sino que canta sozinho. Eu sempre quis fazer dueto com ele.']), 'lucio');
}

// ---------- o salão ----------
{ const _mm3 = montarMapas2; montarMapas2 = function () {
  _mm3();
  const M = PT_.mesas, R = rot;
  const servirEm = [[8, 6, 'down'], [3, 9, 'down'], [13, 6, 'down'], [17, 6, 'down'], [13, 9, 'down'], [3, 6, 'down']], sv = i => [servirEm[i][0], servirEm[i][1], 'servir', 70, servirEm[i][2]];
  MAPS2.taverna = { rows: ROWS2.taverna, name: 'Taverna do Remo Torto', music: 'taverna', showMoney: true,
    props: [
      { img: memo(() => estanteArt(3)), x: 1, y: 3 }, { img: memo(() => estanteArt(2)), x: 4, y: 3 },
      { img: memo(() => balcaoArt(6)), x: 1, y: 5, solid: [[1, 4, 6, 1]] },
      { img: () => lareira[Math.floor(W2.t / 9) % 2](), x: 15, y: 4, solid: [[15, 3, 3, 1]] },
      { img: portaCozinha, x: 8.6, y: 3, by: 2 }, { img: lousa, x: 6.4, y: 2.1, by: 1 }, { img: quadroC, x: 10.4, y: 3.1, by: 1 },
      { img: lampiao, x: 5, y: 1.4, by: 400 }, { img: lampiao, x: 14, y: 1.4, by: 400 },
      ...M.map(([x, y], i) => ({ img: mesasT[i], x: x + 0.25, y: y + 1, solid: [[x, y, 3, 1]] })),
      ...[[1, 7], [6, 7], [11, 7], [5, 10], [1, 10], [15, 10], [10, 7], [15, 7]].map(([x, y]) => ({ img: banquinho, x: x + 0.12, y: y + 1, by: y * TS + 2 })),
      { img: memo(barrilArt), x: 18, y: 11 }, { img: memo(barrilArt), x: 18, y: 12 }, { img: memo(barrilArt), x: 17.2, y: 11.6, by: 300 }
    ],
    lights: [[5, 2, 50], [14, 2, 50], [16, 3, 70]],
    ents: [
      ...portas(PT_.door, 'praca', ...PP.tavOut, 'down'),
      morador('neusa', ...PT_.neusa, { rotina: R([3, 3, 'limpar', 400, 'down'], [1, 3, 'olhar', 200, 'up'], [5, 3, 'limpar', 300, 'down']), talk: falaNeusa }),
      { t: 'sign', x: PT_.balcao[0], y: PT_.balcao[1], h: 30, talk: falaNeusa },
      { t: 'sign', x: PT_.quadro[0], y: PT_.quadro[1], h: 30, talk: quadroPedidos },
      // garçons: pegam bandeja no balcão ou na cozinha e servem as mesas, um em cada ordem
      morador('quincas', ...PT_.garcom, { passo: 12, rotina: R([7, 4, 'pegar', 50, 'left'], sv(0), [7, 4, 'pegar', 50, 'left'], sv(1), [9, 3, 'pegar', 50, 'up'], sv(2), [7, 4, 'pegar', 50, 'left'], sv(5)).map((r, i) => (i % 2 ? Object.assign(r, { leva: 'bandeja' }) : r)), talk: falaT('quincas', ['Licença! Bandeja quente! Bandeja quente!', 'Mesa três quer caldo, mesa cinco quer briga. Eu sirvo os dois.', 'A mala de vocês quer alguma coisa? ...Ela abriu a boca. Isso é um sim?']) }),
      morador('bia', ...PT_.garconete, { passo: 13, rotina: R([9, 3, 'pegar', 60, 'up'], sv(3), [7, 4, 'pegar', 50, 'left'], sv(4), [9, 3, 'pegar', 60, 'up'], sv(2)).map((r, i) => (i % 2 ? Object.assign(r, { leva: 'bandeja' }) : r)), talk: falaT('bia', ['O Herói nº 30 tomou caldo aqui antes de ir pra capital. Deixou gorjeta e uma piada ruim sobre catraca.', 'De noite enche de marujo. De dia é almoço de pescador. Eu prefiro de dia: pescador dá menos trabalho e mais peixe.', 'Dizem que os Pavios não comem. Nunca vi um sentar aqui. Nem pra água.']) }),
      morador('bebum', ...PT_.bebum, { rotina: R([1, 7, 'beber', 500, 'right'], [1, 7, 'cochilar', 600, 'right']), talk: falaBebum }),
      morador('lia', ...PT_.lia, { rotina: R([5, 10, 'comer', 600, 'left'], [5, 10, 'remendar', 500, 'left']), talk: falaLia }),
      morador('cleide', ...PT_.cleide, { rotina: R([6, 7, 'comer', 500, 'right'], [6, 7, 'conversar', 400, 'right']), talk: falaT('cleide', ['Vim almoçar e fiquei pra janta. A comida da Neusa é ruim de um jeito que dá saudade.', 'Você viu a filha do Tobias? Mora num telhado. Num TELHADO.']) }),
      morador('toninho', ...PT_.toninho, { rotina: R([11, 7, 'brindar', 400, 'right'], [11, 7, 'rir', 300, 'right'], [11, 7, 'comer', 300, 'right']), talk: falaT('toninho', ['Um brinde a quem segura essa cidade em pé! ...Ninguém segura. Um brinde mesmo assim!', 'Eu trabalhava na mina da Coroa. Desde que a água subiu, a mina paga o dobro e ninguém volta igual. Volta... quieto.']) }),
      morador('marujo', ...PT_.marujo, { gone: () => !ehNoite(), rotina: R([1, 10, 'brindar', 300, 'right'], [1, 10, 'rir', 300, 'right']), talk: falaT('marujo', ['Barco de carga chega da capital toda semana. Volta cheio de âmbar. Leva âmbar, traz poste. Leva âmbar, traz poste.', 'Nunca vi baú olhar pra mim desse jeito. Nem baú de navio.']) }),
      morador('folga', ...PT_.cacadorF, { gone: () => !ehNoite(), rotina: R([15, 10, 'beber', 500, 'left'], [15, 10, 'cochilar', 300, 'left']), talk: falaFolga }),
      morador('lucio', ...PT_.bardo, { gone: () => !ehNoite(), rotina: R([14, 3, 'tocar', 9000, 'down']), talk: falaLucio })
    ]
  };
}; }
// a taverna tem trilha própria (forró de salão)
Object.assign(TRACKS, { taverna: {
  bpm: 132, bars: 8, chords: 'G G C D G Em C D', bass: 'root5', bassVol: 0.12,
  lead: 'D5:2 G5:2 B5:2 G5:2 A5:2 G5:2 E5:4 | D5:2 G5:2 B5:2 D6:2 C6:4 B5:4 | C6:2 B5:2 A5:2 G5:2 E5:2 G5:2 C6:4 | A5:2 B5:2 A5:2 F#5:2 D5:8 | D5:2 G5:2 B5:2 G5:2 A5:2 G5:2 E5:4 | E5:2 G5:2 B5:2 E6:2 D6:4 B5:4 | C6:2 E6:2 D6:2 C6:2 B5:2 A5:2 G5:4 | A5:4 F#5:4 G5:8',
  leadWave: 0.25, leadVol: 0.07, arp: { rate: 2, vol: 0.02, oct: 0 }, drums: 'k.hsk.hsk.hsk.hs', hatVol: 0.035
} });
