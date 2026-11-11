// ===== Dificuldade do fim de jogo (v2.17) =====
// Pedido do usuário: "os status do jogador ficam muito fortes, os chefes não dão trabalho nas últimas formas/fases".
// Só no modo DESAFIO e só da metade do jogo em diante (Cap. 5+). O modo História fica como estava.
//  1) a curva de dificuldade continua subindo nos Caps. 5–6 e 7–8 (antes parava no Cap. 3);
//  2) DEF e MAG muito altas rendem cada vez menos (DEF acima de 60 vale metade; MAG acima de 100 vale 60%);
//  3) FÚRIA FINAL: chefe com menos de 30% da vida ganha um golpe extra rápido por turno;
//  4) a 4ª fase do chefe final (a Voz) fica mais longa e mais perigosa, e as ajudas do CHAMAR ficam menos generosas.
const lateTier = () => { const f = (typeof G !== 'undefined' && G && G.flags) || {}; return f.ch6done ? 2 : f.ch4done ? 1 : 0; };
const lateOn = () => typeof G !== 'undefined' && G && G.diff !== 'historia' && lateTier() > 0;

// --- 1) a curva continua subindo ---
{ const D2 = { atk: 1.32, hp: 1.42, boss: 1.2, perfect: [9.2, 11.2], good: [7.4, 13], flask: 0.31 },
        D3 = { atk: 1.35, hp: 1.5, boss: 1.12, perfect: [9.3, 11.1], good: [7.5, 12.9], flask: 0.3 };
  for (const k of Object.keys(D2)) {
    const old = Object.getOwnPropertyDescriptor(DIFF.desafio, k), get0 = old && old.get ? old.get : () => old.value;
    Object.defineProperty(DIFF.desafio, k, { get: () => { const t = (typeof G !== 'undefined' && G) ? lateTier() : 0; return t === 2 ? D3[k] : t === 1 ? D2[k] : get0(); }, configurable: true, enumerable: true });
  }
}

// --- 2) DEF/MAG com rendimento decrescente ---
const softStat8 = v => v <= 60 ? v : 60 + (v - 60) * 0.5;
{ const _h = hurt; hurt = function (e, pow, mult, res, o) {
  if (!lateOn()) return _h(e, pow, mult, res, o);
  const d0 = G.st.def, m0 = G.st.mag;
  G.st.def = softStat8(d0); G.st.mag = m0 <= 100 ? m0 : 100 + (m0 - 100) * 0.6;   // a magia (defesa do Arcano) corta menos
  try { return _h(e, pow, mult, res, o); } finally { G.st.def = d0; G.st.mag = m0; }
}; }

// --- 3) FÚRIA FINAL dos chefes ---
const FURY8 = [
  { k: 'ring', p: 0.75, pierce: true, fast: true, t: '* {r}Fúria final!{/} O %n ataca de novo, sem esperar a vez!' },
  { k: 'dodge', p: 0.32, hits: 3, spd: 1.5, t: '* {r}Fúria final!{/} O %n emenda uma rajada!' },
  { k: 'seq', n: 5, p: 0.32, spd: 1.25, t: '* {r}Fúria final!{/} O %n não para. Acompanhe!' }];
{ const _et = enemyTurn; enemyTurn = async function (e) {
  const r = await _et(e);
  if (!lateOn() || !e || !e.d || !e.d.boss || e.d.noFury || !BT.on || G.hp <= 0 || !e.alive || e.hp <= 0) return r;
  if (e.hp > e.mhp * 0.3 || e.dying || e.frozen > 0 || e.stunned > 0 || e.charge) return r;
  if (!e.fury8) { e.fury8 = true; e.flash = 12; shake(14); sfx('encounter'); await bSay(`* O ${e.name} está nas últimas e entra em {r}FÚRIA FINAL{/}! (Um golpe extra por turno.)`, { auto: 55 }); }
  const mv = FURY8[(e.turns + (e.fury8n = (e.fury8n || 0) + 1)) % FURY8.length];
  return runMove(e, { ...mv, t: mv.t.replace('%n', e.name) });
}; }

// --- 4) a Voz (4ª fase do chefe final) ---
ENEMIES.voz8.hp = 1650; ENEMIES.voz8.atk = 110;
ENEMIES.catalogo.noFury = true;   // a 3ª fase do Catálogo já ataca duas vezes; a fúria fica com a Voz
ENEMIES.catalogo.atk = 102;
