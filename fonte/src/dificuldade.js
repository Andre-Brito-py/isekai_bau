// ===== Dificuldade revista (v2.11): o Desafio fica desafiador de verdade, e a Carruagem vira um chefe de três fases =====
// Pedido do usuário: "os monstros do mapa e a carruagem não apresentam muito desafio".

// --- Desafio mais duro (o modo História fica como estava) ---
// a curva sobe aos poucos: Caps. 1 e 2 ficam como eram (o jogador ainda está aprendendo), do Cap. 3 em diante aperta
{ const D0 = { atk: 1.25, hp: 1.25, boss: 1.15, perfect: [8.8, 11.6], good: [6.8, 13.6], flask: 0.35 },
        D1 = { atk: 1.3, hp: 1.36, boss: 1.22, perfect: [9.1, 11.3], good: [7.2, 13.2], flask: 0.32 };
  for (const k of Object.keys(D1)) Object.defineProperty(DIFF.desafio, k, { get: () => ((typeof G !== 'undefined' && G && G.flags && G.flags.ch2done) ? D1 : D0)[k], configurable: true, enumerable: true });
}

// --- Cavalo de Ferrugem: os cavalos da Carruagem, soltos na fase 2 ---
function cavaloSp(f) {
  const c = mk(26, 22), x = c.getContext('2d'), R = (a, b, w, h, col) => { x.fillStyle = PAL[col] || col; x.fillRect(a, b, w, h); };
  // contorno e corpo de ferrugem
  R(4, 7, 17, 9, 'k'); R(5, 8, 15, 7, '#8a4a2a'); R(6, 9, 12, 2, '#b06a3a'); R(5, 13, 15, 2, '#5a2a1a');
  // pescoço e cabeça (virada para a esquerda, para o baú)
  R(1, 2, 7, 8, 'k'); R(2, 3, 5, 6, '#8a4a2a'); R(0, 6, 4, 4, 'k'); R(1, 7, 3, 2, '#b06a3a');
  R(3, 4, 1, 1, f ? '#7ad0f0' : '#c0f0ff');           // olho de água
  // crina de alga
  R(6, 1, 2, 7, '#2a5a3a'); R(8, 6, 2, 3, '#4a9a4a'); R(10, 6, 2, 2, '#2a5a3a');
  // rebites e arreio arrebentado
  R(10, 10, 1, 1, '#f0c040'); R(15, 10, 1, 1, '#f0c040'); R(20, 8, 4, 1, '#5a3a24'); R(23, 9, 2, 1, '#5a3a24');
  // pernas (galope em dois quadros)
  const L = f ? [[5, 16, 0], [9, 16, 1], [15, 16, 1], [19, 16, 0]] : [[6, 16, 1], [9, 16, 0], [15, 16, 0], [18, 16, 1]];
  for (const [a, b, o] of L) { R(a, b, 2, 5 - o, 'k'); R(a, b, 1, 4 - o, '#8a4a2a'); }
  // cauda
  R(21, 7, 3, 2, 'k'); R(22, 9, 2, 4, '#2a5a3a');
  return c;
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); SP.cavaloF = [cavaloSp(0), cavaloSp(1)]; }; }
ENEMIES.cavaloF = { name: 'Cavalo de Ferrugem', sp: 'cavaloF', hp: 210, atk: 58, def: 14, xp: 0, elite: true, weak: { faisca: 1.5, sal: 1.2 },
  flavor: ['* O Cavalo de Ferrugem bufa água salgada.', '* Os cascos dele batem em um chão que não existe.'],
  check: 'Em parelha, os cavalos arrastam a Carruagem para longe: ela recebe METADE do dano. Derrube um e a proteção cai. FAÍSCA racha.',
  moves: [
    { k: 'dodge', p: 0.75, spd: 1.35, w: 2, t: '* O Cavalo de Ferrugem dispara na sua direção!' },
    { k: 'ring', p: 1.05, pierce: true, fast: true, w: 2, t: '* Coice de ferrugem!' },
    { k: 'buff', stat: 'atk', ally: true, turns: 2, w: 1, t: '* O cavalo relincha. O cocheiro sem cabeça estala o chicote com mais força.' }] };

// --- a Carruagem Afogada: 3 fases ---
Object.assign(ENEMIES.carro, { hp: 1700, atk: 71, def: 26, xp: 1100,
  check: 'GALOPA a cada três turnos (desvie). Na fase 2 solta os cavalos: com a parelha inteira, ela leva só METADE do dano. Na fase 3 tenta te levar de passageiro. FAÍSCA e SAL.' });
const carroHorses = () => BT.en.filter(x => x.alive && x.id === 'cavaloF');
AI.carro = async function (e) {
  const des = G.diff !== 'historia';
  // fase 2: os cavalos arrebentam os arreios e entram na luta
  if (!e.p2 && e.hp <= e.mhp * 0.6) {
    e.p2 = true; e.phase = 2; shake(30); sfx('rumble');
    await bSay('* Os cavalos de ferrugem arrebentam os arreios!', { auto: 50 });
    BT.en.push(Object.assign(mkEnemy('cavaloF', 1, 3), { x: 116, y: 92 }));
    if (des) BT.en.push(Object.assign(mkEnemy('cavaloF', 2, 3), { x: 128, y: 138 }));
    await bSay('* Eles correm em volta de você e arrastam a carruagem para longe. (Com a parelha inteira, ela leva metade do dano. Derrube um cavalo!)', { auto: 70 });
    return;
  }
  // fase 3: a última viagem
  if (!e.p3 && e.hp <= e.mhp * 0.25) {
    e.p3 = true; e.phase = 3; e.atk += 4; shake(40); sfx('rumble');
    await bSay('"PASSAGEIROS, PRA DENTRO! ÚLTIMA VIAGEM!"', { col: '#c0f0ff' });
    return runMove(e, { k: 'mash', p: 1.0, need: 15, bind: true, t: '* A porta escancara e um vento de estrada molhada te puxa para dentro!', fx: 'shake' });
  }
  if (carroHorses().length >= (des ? 2 : 1)) e.shell = 2;   // a parelha arrasta a carruagem: dano pela metade (derrubar um cavalo já quebra)
  if (e.charge) {
    e.charge = false;
    return runMove(e, { k: 'dodge', p: 0.7, hits: 3, spd: e.p3 ? 1.45 : e.p2 ? 1.35 : 1.25, pierce: true, t: '* GALOPE! As patas de ferrugem passam por cima de você!', fx: 'shake' });
  }
  if (e.turns % 3 === 0) {
    e.charge = true;
    await bSay('* Os cavalos empinam. O cocheiro sem cabeça estala o chicote. (Prepare-se para desviar!)', { auto: 50 });
    if (des) return runMove(e, { k: 'ring', p: 0.65, fast: true, t: '* ...e o chicote já vem junto!' });
    return;
  }
  // enquanto houver cavalo, a carruagem é arrastada em círculos: ela só galopa, não ataca de outro jeito
  if (carroHorses().length >= 1) { await bSay(pickOne(['* A carruagem é arrastada em círculos. O cocheiro sem cabeça puxa as rédeas, sem sucesso.', '* A parelha arrasta a carruagem de um lado para o outro. As rodas raspam no nada.']), { auto: 40 }); return; }
  if (e.p3 && e.turns % 2 === 0) return runMove(e, { k: 'spell', p: 1.0, el: 'sal', name: 'Lamento dos Passageiros', st: 'blind', t: '* Doze vozes de dentro da carruagem choram juntas. É um {w}Lamento dos Passageiros{/}.' });
  return runMove(e, pickMove(e, [
    { k: 'seq', n: e.p2 ? 7 : 6, p: 0.5, spd: e.p2 ? 1.2 : 1.05, w: 2, t: '* As rodas giram e espirram água em todas as direções!' },
    { k: 'ring', p: 1.3, pierce: true, w: 2, t: '* Chicote do cocheiro!' },
    { k: 'spell', p: 0.95, el: 'sal', name: 'Neblina de Sal', st: 'blind', w: 1, t: '* A carruagem solta uma {w}Neblina de Sal{/}. Foi assim que começou.' },
    { k: 'mash', p: 0.95, need: 15, bind: true, w: e.p2 ? 2 : 1, t: '* A porta da carruagem abre e te puxa pra dentro!' }]));
};
