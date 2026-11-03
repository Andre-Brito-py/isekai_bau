// ================= RETRATOS DE DIÁLOGO (32x32) =================
// Personagens importantes ganham um busto próprio, mais detalhado que o sprite do mapa.
// Cada retrato tem 3 quadros: parado, falando (boca aberta) e piscando.
const PORT = {};
function pcv(fn) { return [0, 1, 2].map(fr => cv4(32, 32, (r, x) => fn(r, fr, x))); }
// busto humano parametrizado
function bust(o) {
  return pcv((r, fr) => {
    const k = PAL.k, sk = o.skin, sd = o.skinD || shade(o.skin), hr = o.hair, cl = o.cloth, c2 = o.cloth2 || shade(o.cloth);
    // cabelo de trás (comprido)
    if (o.style === 'long' || o.style === 'pony') { r(6, 8, 20, 20, k); r(7, 9, 18, 19, hr); }
    // ombros e roupa
    r(3, 25, 26, 7, k); r(4, 26, 24, 6, cl); r(4, 26, 24, 1, c2); r(12, 24, 8, 3, k); r(13, 24, 6, 3, sk);
    if (o.collar) { r(11, 26, 4, 3, o.collar); r(17, 26, 4, 3, o.collar); }
    if (o.vest) { r(4, 27, 6, 5, o.vest); r(22, 27, 6, 5, o.vest); }
    if (o.badge) r(21, 28, 3, 2, o.badge);
    // rosto
    r(9, 7, 14, 18, k); r(10, 8, 12, 16, sk); r(10, 21, 12, 3, sd); r(11, 23, 10, 1, sk);
    r(8, 13, 2, 4, k); r(22, 13, 2, 4, k); r(9, 14, 1, 2, sd); r(22, 14, 1, 2, sd);
    // olhos e sobrancelhas
    const ey = 14;
    if (fr === 2) { r(12, ey + 1, 3, 1, k); r(17, ey + 1, 3, 1, k); }
    else { r(12, ey, 3, 3, '#ffffff'); r(17, ey, 3, 3, '#ffffff'); r(13, ey, 2, 3, o.eyes || '#3a2418'); r(18, ey, 2, 3, o.eyes || '#3a2418'); r(13, ey, 1, 1, '#ffffff'); r(18, ey, 1, 1, '#ffffff'); r(12, ey - 1, 3, 1, k); r(17, ey - 1, 3, 1, k); }
    r(12, ey - 3, 3, 1, o.brow || shade(hr)); r(17, ey - 3, 3, 1, o.brow || shade(hr));
    r(15, 17, 2, 2, sd);
    if (o.blush) { r(11, 18, 2, 1, '#ff9aaa'); r(19, 18, 2, 1, '#ff9aaa'); }
    // boca
    if (fr === 1) { r(14, 20, 4, 2, '#5a1a1a'); r(15, 21, 2, 1, '#c85050'); } else r(14, 20, 4, 1, o.lips || '#8a3a3a');
    if (o.stache) { r(12, 19, 8, 1, o.stache); r(12, 18, 3, 1, o.stache); r(17, 18, 3, 1, o.stache); }
    // cabelo da frente
    if (o.style !== 'bald') {
      r(8, 4, 16, 6, k); r(9, 5, 14, 5, hr); r(9, 9, 3, 4, hr); r(20, 9, 3, 4, hr); r(12, 9, 5, 2, hr);
      r(9, 5, 14, 1, shade(hr, 1.25));
      if (o.style === 'long') { r(6, 10, 4, 16, hr); r(22, 10, 4, 16, hr); }
      if (o.style === 'pony') { r(23, 6, 5, 3, k); r(24, 7, 6, 2, hr); r(27, 8, 3, 8, hr); }
      if (o.style === 'bun') { r(12, 0, 8, 6, k); r(13, 1, 6, 4, hr); }
      if (o.style === 'messy') { r(8, 3, 3, 3, hr); r(14, 2, 3, 3, hr); r(20, 3, 3, 3, hr); }
    }
    if (o.glasses) { r(11, ey - 1, 5, 5, o.glasses); r(16, ey - 1, 5, 5, o.glasses); r(12, ey, 3, 3, '#ffffff'); r(17, ey, 3, 3, '#ffffff'); if (fr !== 2) { r(13, ey, 2, 3, o.eyes || '#3a2418'); r(18, ey, 2, 3, o.eyes || '#3a2418'); } else { r(12, ey + 1, 3, 1, k); r(17, ey + 1, 3, 1, k); } }
    if (o.scar) { r(19, 10, 1, 4, '#c87070'); r(20, 12, 1, 1, '#c87070'); }
    if (o.earring) { r(9, 18, 1, 2, o.earring); r(22, 18, 1, 2, o.earring); }
    if (o.extra) o.extra(r, fr);
  });
}
function shade(hex, m = 0.7) { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * m)))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); }

function buildPortraits() {
  PORT.tiago = bust({ skin: '#d8a070', hair: '#3a2418', style: 'messy', cloth: '#3a5a8a', vest: '#7a4a2a', badge: '#f0c040', eyes: '#3a2418' });
  PORT.brida = bust({ skin: '#d8a070', hair: '#8a2a1a', style: 'pony', cloth: '#9a93b0', collar: '#c83838', eyes: '#2a4a2a', scar: true,
    extra: (r) => { r(18, 0, 3, 6, '#c83838'); r(20, 0, 3, 3, '#ff6b6b'); } });
  PORT.maren = bust({ skin: '#e8c0a0', hair: '#2a1a30', style: 'long', cloth: '#7a48b0', collar: '#f0c040', eyes: '#5a2a8a', lips: '#7a2a5a',
    extra: (r) => { r(7, 0, 18, 6, PAL.k); r(10, 0, 12, 5, '#3a2050'); r(10, 3, 12, 1, '#f0c040'); r(5, 5, 22, 3, PAL.k); r(6, 6, 20, 1, '#3a2050'); } });
  PORT.maren5 = bust({ skin: '#e8c0a0', hair: '#2a1a30', style: 'messy', cloth: '#5a3a7a', eyes: '#5a2a8a', lips: '#7a2a5a',
    extra: (r) => { r(12, 22, 1, 2, '#3a2050'); r(19, 12, 1, 3, '#3a2050'); } });
  PORT.jorge = bust({ skin: '#d8a070', hair: '#9a9aa0', style: 'short', cloth: '#3a70c0', collar: '#e8e4dc', badge: '#f0c040', stache: '#7a7a80', eyes: '#3a2418',
    extra: (r) => { r(7, 2, 18, 6, PAL.k); r(8, 3, 16, 4, '#2a4a8a'); r(13, 3, 6, 2, '#f0c040'); r(6, 7, 20, 2, PAL.k); } });
  PORT.rita = bust({ skin: '#c8905a', hair: '#2a1410', style: 'pony', cloth: '#6a7084', collar: '#3a70c0', eyes: '#3a2418', earring: '#f0c040', lips: '#a04040' });
  PORT.pip = bust({ skin: '#e8b890', hair: '#c86a30', style: 'messy', cloth: '#4a9a4a', eyes: '#3a5a2a', blush: true });
  PORT.nina = bust({ skin: '#a86a40', hair: '#1a1410', style: 'bun', cloth: '#4a9a4a', eyes: '#3a2418' });
  // Ofélia: fantasma bibliotecária, coque e óculos redondos
  const ghost = (body, hair, rim, eyes) => pcv((r, fr) => {
    const k = PAL.k;
    r(4, 22, 24, 10, k); r(5, 23, 22, 9, body); r(13, 23, 6, 4, shade(body, 0.85)); r(15, 24, 2, 8, rim);
    r(8, 6, 16, 18, k); r(9, 7, 14, 16, body); r(9, 20, 14, 3, shade(body, 0.88));
    r(8, 3, 16, 6, k); r(9, 4, 14, 5, hair); r(12, 0, 8, 5, k); r(13, 1, 6, 3, hair); r(8, 8, 3, 7, hair); r(21, 8, 3, 7, hair);
    r(10, 12, 6, 6, rim); r(16, 12, 6, 6, rim); r(11, 13, 4, 4, '#ffffff'); r(17, 13, 4, 4, '#ffffff');
    if (fr === 2) { r(11, 15, 4, 1, k); r(17, 15, 4, 1, k); } else { r(12, 13, 2, 4, eyes); r(18, 13, 2, 4, eyes); r(12, 13, 1, 1, '#ffffff'); r(18, 13, 1, 1, '#ffffff'); }
    if (fr === 1) { r(14, 19, 4, 2, '#3a2050'); } else r(14, 19, 4, 1, '#7a5aa0');
    r(25, 12, 2, 2, '#ffffff'); r(4, 18, 1, 1, '#ffffff');
  });
  PORT.of = ghost('#e8e0f8', '#c0a0f0', '#f0c040', '#5a3a8a');
  PORT.clara = ghost('#d8eef8', '#8ac0d8', '#7ad0f0', '#1c3058');
  // Lume: lustre com rosto
  PORT.lume = pcv((r, fr) => {
    const k = PAL.k, au = '#f0c040', au2 = '#b88a20';
    r(15, 0, 2, 6, k); r(6, 8, 20, 4, k); r(7, 9, 18, 2, au); r(7, 10, 18, 1, au2);
    for (const cx of [5, 26]) { r(cx - 1, 4, 4, 6, k); r(cx, 5, 2, 4, '#f2ecdc'); r(cx, 1 + (FRAME >> 3) % 2, 2, 3, '#ffb040'); r(cx, 2 + (FRAME >> 3) % 2, 2, 1, '#fff4c0'); }
    r(9, 11, 14, 16, k); r(10, 12, 12, 14, '#fff0b0'); r(10, 12, 12, 2, '#ffffff'); r(10, 23, 12, 3, '#f0d070');
    if (fr === 2) { r(12, 17, 3, 1, k); r(17, 17, 3, 1, k); } else { r(12, 16, 3, 3, k); r(17, 16, 3, 3, k); r(12, 16, 1, 1, '#ffffff'); r(17, 16, 1, 1, '#ffffff'); }
    r(11, 20, 2, 1, '#ff9aaa'); r(19, 20, 2, 1, '#ff9aaa');
    if (fr === 1) r(14, 21, 4, 2, '#8a3a3a'); else r(14, 21, 4, 1, '#8a3a3a');
    if (G.flags && G.flags.lumeFone) { r(8, 13, 2, 6, '#3a3a48'); r(22, 13, 2, 6, '#3a3a48'); r(9, 11, 14, 1, '#3a3a48'); r(8, 16, 2, 1, '#e8dcc0'); }
    r(13, 27, 6, 3, k); r(14, 27, 4, 2, au); r(15, 30, 2, 2, '#ffb040');
  });
  // Bento: caranguejo-ermitão num bule
  PORT.bento = pcv((r, fr) => {
    const k = PAL.k;
    r(4, 14, 24, 17, k); r(5, 15, 22, 15, '#f2ecdc'); r(5, 27, 22, 2, '#c8c0d8'); r(9, 19, 4, 4, '#e86890'); r(19, 21, 3, 3, '#3a70c0'); r(14, 24, 3, 2, '#8ac85a');
    r(26, 17, 6, 4, k); r(27, 18, 4, 2, '#f2ecdc'); r(0, 17, 5, 8, k); r(1, 18, 3, 6, '#f2ecdc');
    r(8, 10, 16, 5, k); r(9, 11, 14, 3, '#9a93b0'); r(17, 4 - (fr === 1 ? 1 : 0), 7, 4, k); r(18, 5 - (fr === 1 ? 1 : 0), 5, 2, '#b87838');
    r(11, 2, 2, 9, k); r(19, 2, 2, 9, k); r(10, 0, 4, 4, k); r(18, 0, 4, 4, k);
    if (fr === 2) { r(11, 2, 2, 1, '#ffffff'); r(19, 2, 2, 1, '#ffffff'); } else { r(11, 1, 2, 2, '#ffffff'); r(19, 1, 2, 2, '#ffffff'); }
    r(10, 6, 8, 3, k); r(11, 6, 6, 2, '#d8d0c0'); r(13, 5, 2, 1, '#d8d0c0');
  });
  // Dona Cida: gata fantasma de óculos
  PORT.cida = pcv((r, fr) => {
    const k = PAL.k, f = '#c0a0f0';
    r(6, 2, 6, 10, k); r(20, 2, 6, 10, k); r(7, 4, 4, 7, f); r(21, 4, 4, 7, f); r(8, 6, 2, 4, '#e86890'); r(22, 6, 2, 4, '#e86890');
    r(5, 9, 22, 18, k); r(6, 10, 20, 16, f); r(6, 22, 20, 4, shade(f, 0.85)); r(4, 26, 24, 6, k); r(5, 27, 22, 5, f);
    r(9, 14, 6, 5, '#f0c040'); r(17, 14, 6, 5, '#f0c040'); r(10, 15, 4, 3, '#ffffff'); r(18, 15, 4, 3, '#ffffff'); r(15, 16, 2, 1, '#f0c040');
    if (fr === 2) { r(10, 16, 4, 1, k); r(18, 16, 4, 1, k); } else { r(11, 15, 2, 3, '#3a8a3a'); r(19, 15, 2, 3, '#3a8a3a'); }
    r(15, 20, 2, 1, '#e86890'); r(14, 21 + (fr === 1 ? 1 : 0), 4, 1, k);
    for (const y of [20, 22]) { r(3, y, 6, 1, '#ffffff'); r(23, y, 6, 1, '#ffffff'); }
  });
  // Musgo: golem de pedra com musgo
  PORT.musgo = pcv((r, fr) => {
    const k = PAL.k;
    r(4, 4, 24, 26, k); r(5, 5, 22, 24, '#6a6078'); r(5, 5, 22, 6, '#4a9a4a'); r(8, 3, 6, 4, '#2a5a3a'); r(17, 2, 7, 4, '#4a9a4a');
    r(9, 14, 5, 4, k); r(18, 14, 5, 4, k); if (fr !== 2) { r(10, 15, 3, 2, '#f0c040'); r(19, 15, 3, 2, '#f0c040'); }
    r(10, 23, 12, fr === 1 ? 3 : 2, k); r(7, 20, 2, 6, '#5a5068'); r(23, 8, 3, 9, '#5a5068'); r(14, 18, 4, 2, '#5a5068');
    r(20, 24, 4, 3, '#f2ecdc'); r(21, 23, 2, 1, '#ffb040');
  });
  // Escriba: figura de tinta encapuzada, com correntes
  PORT.escriba = pcv((r, fr) => {
    const k = PAL.k;
    r(5, 3, 22, 29, k); r(6, 4, 20, 28, '#3a3070'); r(9, 9, 14, 13, '#1c1840'); r(6, 4, 20, 2, '#5a4a9a');
    if (fr !== 2) { r(12, 13, 3, 2, '#d8d0f0'); r(18, 13, 3, 2, '#d8d0f0'); }
    if (fr === 1) r(14, 18, 4, 1, '#d8d0f0');
    for (let i = 0; i < 32; i += 3) { r(i, 26, 2, 2, '#8a8099'); }
    r(24, 18, 2, 10, '#f2ecdc'); r(25, 16, 1, 3, '#f2ecdc');
  });
  // Madame Pavio: vela elegante
  PORT.pavio = pcv((r, fr) => {
    const k = PAL.k;
    r(8, 9, 16, 23, k); r(9, 10, 14, 22, '#f2e2c0'); r(9, 10, 14, 2, '#fff4dc'); r(20, 12, 2, 8, '#fff4dc');
    const fl = (FRAME >> 3) % 2; r(10, 0 + fl, 12, 11, k); r(11, 1 + fl, 10, 9, '#ffb040'); r(13, 3 + fl, 6, 5, '#fff4c0'); r(8, 5, 3, 6, '#ffb040'); r(21, 5, 3, 6, '#ffb040');
    if (fr === 2) { r(12, 16, 3, 1, k); r(17, 16, 3, 1, k); } else { r(12, 15, 3, 3, '#3a2418'); r(17, 15, 3, 3, '#3a2418'); r(12, 15, 1, 1, '#ffffff'); r(17, 15, 1, 1, '#ffffff'); r(11, 14, 1, 1, k); r(20, 14, 1, 1, k); }
    r(11, 19, 2, 1, '#ff9aaa'); r(19, 19, 2, 1, '#ff9aaa'); if (fr === 1) r(14, 21, 4, 2, '#c83838'); else r(14, 21, 4, 1, '#c83838');
    r(6, 28, 20, 4, k); r(7, 29, 18, 3, '#c8962a');
  });
  PORT.knight = bust({ skin: '#2a2638', hair: '#4f4a66', style: 'short', cloth: '#4f4a66', eyes: '#ff5050',
    extra: (r) => { r(8, 4, 16, 20, PAL.k); r(9, 5, 14, 18, '#5a5468'); r(10, 13, 12, 3, PAL.k); r(12, 14, 2, 1, '#ff5050'); r(18, 14, 2, 1, '#ff5050'); for (let i = 11; i < 22; i += 2) r(i, 18, 1, 4, PAL.k); } });
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildPortraits(); }; }
// o retrato recebe "falando" para animar a boca, e pisca de vez em quando
const portFrame = (k, talking) => PORT[k][FRAME % 160 < 6 ? 2 : talking && FRAME % 12 < 6 ? 1 : 0];
for (const k of ['tiago', 'brida', 'maren', 'maren5', 'jorge', 'rita', 'pip', 'lume', 'bento', 'cida', 'musgo', 'escriba', 'pavio', 'clara', 'knight']) if (WHO[k]) WHO[k].portrait = t => portFrame(k, t);
WHO.of.portrait = t => portFrame(G.flags.ofeliaRemembers && G.flags.ch4done ? 'clara' : 'of', t);
WHO.guard.portrait = t => SP.hunter[0];
// a aprendiz Nina tem o próprio retrato quando fala
{ const _ap = STORY.aprendiz5; if (_ap) STORY.aprendiz5 = async e => { WHO.pip.portrait = t => portFrame(e.id === 'nina5' ? 'nina' : 'pip', t); return _ap(e); }; }
