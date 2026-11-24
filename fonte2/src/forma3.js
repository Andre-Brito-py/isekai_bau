// ================= A FORMA HUMANA TEM JEITO PRÓPRIO DE LUTAR (pedido do usuário) =================
// Baú = aguenta, morde, protege. Gente = mãos, pés e o outro do lado. Ao virar gente, as técnicas de BOCA e de TAMPA
// (Guardar, Baluarte, Farol, Guardar Dentro, Mordida Gulosa, Mastigar, Cuspe, Tampa Refletora, Boca do Vão) somem e
// entram três técnicas que só gente tem:
//  PASSO LIGEIRO (15 Tensão, leve): esquiva o próximo golpe nele.
//  GOLPE A DOIS (30 Tensão): ele e a Rita (ou a Lume, se a Rita caiu) batem juntos. Quebra 2 de escudo.
//  MÃO FIRME (20 Tensão, leve, aliado): segura a mão de alguém: cura 15%, tira os maus estados e devolve PM.
// O fôlego da forma cresce com a história: 3 vezes; 4 a partir do Cap. 6; 5 a partir do Cap. 9.
const SO_BAU = ['guardar', 'baluarte', 'farol', 'guardarDentro', 'mordidaGulosa', 'mastigar', 'cuspeTralha', 'tampaRefletora', 'bocaVao'];
const SO_GENTE = ['passoLigeiro', 'golpeADois', 'maoFirme'];
function folegoForma() { const c = typeof capAtual === 'function' ? capAtual() : 3; return 3 + (c >= 6 ? 1 : 0) + (c >= 9 ? 1 : 0); }
Object.assign(TECH2, {
  passoLigeiro: { nm: 'Passo Ligeiro', cost: 15, tgt: 'self', w: 'leve', d: 'Só de gente. Pé leve: o próximo golpe nele erra. Leve.', run: async (m) => {
    sfx('select'); m.st.esquiva = 2; const [x, y] = unitCenter(m);
    await tw(16, p => { for (let i = 0; i < 3; i++) { bx.globalAlpha = (1 - p) * 0.4; bx.fillStyle = '#ffe8c0'; bx.fillRect(Math.round(x - 10 - i * 6 - p * 10), Math.round(y - 14 + i * 8), 8, 2); } bx.globalAlpha = 1; });
    callout('Passo ligeiro: o próximo golpe erra', '#ffe8c0', 50);
  } },
  golpeADois: { nm: 'Golpe a Dois', cost: 30, tgt: 'enemy', d: 'Só de gente. Ele e a Rita (ou a Lume) atacam juntos, lado a lado. Quebra 2 de escudo.', run: async (m, t) => {
    const par = alive(BT.party).find(u => u.id === 'rita') || alive(BT.party).find(u => u.id === 'lume');
    const [tx, ty] = unitCenter(t), dx = tx - 24 - m.x;
    if (!par) { await golpeHumano(m, t); return; }
    const dp = tx - 34 - par.x; sfx('select');
    callout(par.id === 'rita' ? 'Golpe a Dois: tampa e lança!' : 'Golpe a Dois: dentes e luz!', '#ffe8c0', 50);
    await tw(12, p => { m.ox = dx * ease.io(p); par.ox = dp * ease.io(p); m.oy = par.oy = -Math.sin(p * Math.PI) * 6; });
    const ok = await timedPrompt(t, 18);
    slashFx(tx, ty, '#ffe8c0', 1.3); hitstop(6); bshake(8, 2); sfx('hit');
    hitFoe(m, t, ok ? 1.1 : 0.85, { el: 'corte', crit: ok, brk: 1 });
    await wait(6);
    if (t.hp > 0) { if (par.id === 'rita') { slashFx(tx, ty, '#ff9a50', -1.4); hitFoe(par, t, ok ? 1.15 : 0.9, { el: 'corte', crit: ok, brk: 1 }); } else { luzMagia(tx, ty, 26, '#ffe066', 1); hitFoe(par, t, ok ? 1.2 : 0.95, { el: 'luz', mag: true, brk: 1 }); } }
    burst(tx, ty, 18, ['#ffffff', '#ffe8c0', '#ffd060']);
    await tw(12, p => { m.ox = dx * (1 - p); par.ox = dp * (1 - p); m.oy = par.oy = 0; }); m.ox = par.ox = 0;
  } },
  maoFirme: { nm: 'Mão Firme', cost: 20, tgt: 'ally', w: 'leve', d: 'Só de gente. Segura a mão de um aliado: cura 15% da vida, tira os maus estados e devolve 10 PM. Leve.', run: async (m, t) => {
    if (t === m) { callout('Segure a mão de outra pessoa', '#ff6b6b', 40); BT.tension += 20; return; }
    sfx('heal'); const [x, y] = unitCenter(t);
    await tw(20, p => { fxRing(x, y, 6 + p * 12, '#ffd0a8', 1 - p); bx.fillStyle = '#ffd0a8'; bx.fillRect(Math.round(x - 1), Math.round(y - 18 - p * 8), 3, 3); });
    healUnit(t, Math.round(t.mhp * 0.15)); for (const q of ['queimado', 'frio', 'tonto', 'esquecido', 'molhado']) t.st[q] = 0; if (t.mmp) t.mp = Math.min(t.mmp, t.mp + 10);
    callout(t.id === 'lume' ? 'A luz dela fica mais quente' : t.id === 'rita' ? 'A Rita aperta de volta. Forte demais.' : 'Mão firme', '#ffd0a8', 60);
  } }
});
// troca as técnicas ao mudar de forma, e o fôlego cresce
{ const _tf3 = trocarForma; trocarForma = async function (m, volta) {
  await _tf3(m, volta);
  if (m.humano) { m.techs0 = m.techs; m.techs = [...(m.techs || []).filter(k => !SO_BAU.includes(k)), ...SO_GENTE]; m.humTurnos = folegoForma(); }
  else if (m.techs0) { m.techs = m.techs0; m.techs0 = null; }
}; }
// esquiva do Passo Ligeiro
{ const _hM3 = hurtMember; hurtMember = function (m, d0, o = {}) {
  if (m.hp > 0 && m.st && m.st.esquiva > 0 && BT._foe) { m.st.esquiva = 0; const [x, y] = unitCenter(m); popNum(x, y - 10, 'ESQUIVOU', '#ffe8c0'); sfx('select'); m.ox = -8; setTimeout(() => { m.ox = 0; }, 160); return 0; }
  return _hM3(m, d0, o);
}; }
TECH2.trocaForma.d = 'Baú <-> humano (ação leve). Humano: +4 VEL, +3 MAG, -4 DEF, ataca com o Aro de Dentes (corte), feitiços -2 PM, e troca as técnicas de tampa por técnicas de gente (Passo Ligeiro, Golpe a Dois, Mão Firme). Dura 3 vezes (4 a partir do Cap. 6, 5 a partir do Cap. 9).';
