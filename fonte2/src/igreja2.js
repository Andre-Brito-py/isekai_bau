// ================= A IGREJA DE VELHÁGUA (por dentro, alagada) =================
// (relato do usuário: "não dá pra entrar na igreja". O portal em arco já aparecia meio debaixo d'água na arte.)
// Por dentro, a nave está alagada até os bancos: só entra quem BOIA (depois da escadaria e do Sargento Brás).
// Conteúdo opcional: o livro de batismos da Dona Badalada, o mural, um bilhete da Irmã Celeste e um baú no altar.
const ROWS_IGR = [
  'wwwwwwwwwwwwww',
  'wwwwwwwwwwwwww',
  'wwwwwwwwwwwwww',
  'woooooooooooow',
  'woooooooooooow',
  'woooooooooooow',
  'w~~~~~~~~~~~~w',
  'w~~~~~~~~~~~~w',
  'w~~~~~~~~~~~~w',
  'wwwwoooooowwww',
  'wwwwwwoowwwwww'
];
{ const _mmI = montarMapas2; montarMapas2 = function () {
  _mmI.apply(this, arguments);
  MAPS2.igreja = { rows: ROWS_IGR, name: 'Velhágua · Igreja do Sino', music: 'afogado', bg: '#0c1e2c', tint: 'rgba(30,50,110,0.10)',
    props: [
      { img: memo(mesaArt), x: 5.5, y: 4.2, solid: [[6, 3, 2, 1]] },
      { img: memo(bancoHArt), x: 2, y: 7.3, by: 90 }, { img: memo(bancoHArt), x: 9, y: 7.3, by: 90 },
      { img: memo(bancoHArt), x: 2, y: 8.6, by: 120 }, { img: memo(bancoHArt), x: 9, y: 8.6, by: 120 }
    ],
    ents: [
      ...[[6, 10], [7, 10]].map(([x, y]) => porta(x, y, 'praca', 28, 20, 'down')),
      { t: 'sign', x: 6, y: 3, h: 26, talk: livroBatismos },
      { t: 'sign', x: 3, y: 2, h: 40, talk: muralBadalada },
      { t: 'sign', x: 10, y: 2, h: 40, talk: bilheteCeleste },
      bauEnt('igreja', 'a', 11, 4, async () => { await dar('pluma', 1); await dar('cobres', 30); })
    ],
    onEnter: async () => { if (!G.flags.igrejaVista) { G.flags.igrejaVista = true;
      await say('* Por dentro, a igreja é um lago. A água cobre os bancos até o encosto. Velas boiando em pratinhos de lata, acesas por alguém que vem aqui todo dia.');
      await say('Missa com bóia. Eu nunca vi isso nem na Terra.', 'me');
      await say('A Irmã Celeste acende essas velas sozinha. De barco? Nadando? De fé?', 'lume');
    } }
  };
  // a porta da igreja, no alto da escadaria (o portal em arco fica em cima do tile 28)
  const pr = MAPS2.praca; if (pr && !pr._igreja) { pr._igreja = true; for (const x of [28, 29]) pr.ents.push({ t: 'sign', x, y: 19, h: 60, talk: entrarIgreja }); }
}; }
async function entrarIgreja() {
  if (!G.flags.boiar) {
    await say('* A porta da igreja está aberta. Lá dentro, a água chega até os bancos. A nave inteira virou um lago escuro.');
    await say('Sem barco não dá. E eu não vou nadar numa igreja. Tem limite.', 'rita');
    return;
  }
  sfx('door'); await fadeOut(10); loadMap2('igreja', 6, 9, 'up'); await fadeIn(10);
  if (MAPS2.igreja.onEnter) await MAPS2.igreja.onEnter();
}
async function livroBatismos() {
  await say('* No altar, um livro enorme, inchado de umidade: o LIVRO DE BATISMOS E CASAMENTOS. Cem anos de nomes.');
  await say('* Ao lado de cada casamento, a mesma anotação, com letras diferentes: "tocou a Badalada". Trezentas e doze vezes.');
  await say('Ela lembra de todo mundo porque todo mundo escreveu que ela estava lá.', 'lume');
  await say('Então é isso que segura uma lembrança. Alguém anotar.', 'me');
}
async function muralBadalada() {
  await say('* Um mural pintado na parede, com a tinta descascando: um sino de bronze enorme sendo içado na torre, e a cidade inteira puxando a corda.');
  await say('* Embaixo, gente de todas as idades. Uma menina de trança segura a ponta da corda. Pela cara, a futura Irmã Celeste.');
}
async function bilheteCeleste() {
  await say('* Um bilhete preso num prego, com letra redonda: "Para quem entrar boiando. Se você chegou até aqui, as velas são suas também. Acenda uma por quem você esqueceu."');
  if (!G.flags.velaIgreja) {
    G.flags.velaIgreja = true;
    await say('* Você empurra um pratinho de lata com a tampa até perto de uma vela acesa. Acende. Fica boiando, pequena, teimosa.');
    await say('É pra quem?', 'rita');
    await say('Não sei. Por isso mesmo.', 'me');
  }
}
