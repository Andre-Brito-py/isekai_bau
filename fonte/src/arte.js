// ================= ARTE NOVA DOS PERSONAGENS (estilo da folha de referência enviada pelo usuário) =================
// Só o estilo: sprites maiores que o tile (16x24 no mapa), cabeça grande, contorno escuro grosso, 2 tons chapados
// por cor, cores saturadas, rosto simples. Vale para o baú, a Lume e os personagens com nome. Arte sempre original.
const DK = '#120e1a';
// desenha um personagem humano a partir de um "figurino"
function dtChar(o, f) {
  return cv4(16, 24, (r) => {
    const sk = o.skin || '#f0c8a0', skD = shade(sk, 0.8), hr = o.hair, hrD = shade(hr, 0.72), hrL = shade(hr, 1.3);
    const top = o.top, topD = shade(top, 0.72), pant = o.pants || '#2a2a4a', pantD = shade(pant, 0.75), shoe = o.shoes || '#3a2420';
    const b = f ? 1 : 0; // respiração
    // pernas e sapatos
    if (!o.dress) {
      r(3, 18, 4, 5, DK); r(9, 18, 4, 5, DK); r(4, 18, 2, 4, pant); r(10, 18, 2, 4, pant); r(5, 18, 1, 4, pantD); r(11, 18, 1, 4, pantD);
      r(3, 21, 4, 3, DK); r(9, 21, 4, 3, DK); r(4, 22, 3, 1, shoe); r(10, 22, 3, 1, shoe);
    } else {
      r(2, 15, 12, 8, DK); r(3, 15, 10, 7, o.dress); r(9, 15, 4, 7, shade(o.dress, 0.75)); r(3, 21, 10, 1, shade(o.dress, 1.25));
      if (!o.ghost) { r(4, 22, 3, 2, DK); r(9, 22, 3, 2, DK); r(5, 22, 1, 1, shoe); r(10, 22, 1, 1, shoe); }
    }
    // tronco e braços
    r(2, 11 + b, 12, 8 - b, DK); r(3, 12 + b, 10, 6 - b, top); r(9, 12 + b, 4, 6 - b, topD); r(3, 12 + b, 10, 1, shade(top, 1.25));
    r(1, 12 + b, 3, 6, DK); r(12, 12 + b, 3, 6, DK); r(2, 12 + b, 1, 4, o.sleeve || top); r(13, 12 + b, 1, 4, o.sleeve ? shade(o.sleeve, 0.75) : topD);
    r(2, 16 + b, 1, 1, sk); r(13, 16 + b, 1, 1, skD);
    if (o.belt) r(3, 17, 10, 1, o.belt);
    if (o.acc) o.acc(r, b);
    // cabeça grande
    r(2, 1 + b, 12, 11, DK); r(3, 2 + b, 10, 9, sk); r(10, 6 + b, 3, 5, skD);
    // cabelo
    const hs = o.hs || 'short';
    r(2, 0 + b, 12, 5, DK); r(3, 1 + b, 10, 3, hr); r(3, 1 + b, 10, 1, hrL);
    if (hs === 'short' || hs === 'spiky') { r(3, 4 + b, 2, 2, hr); r(11, 4 + b, 2, 3, hrD); r(6, 4 + b, 3, 1, hr); }
    if (hs === 'spiky') { r(2, 0 + b, 2, 2, DK); r(7, -1 + b + 1, 2, 1, DK); r(12, 0 + b, 2, 2, DK); r(4, 0 + b, 1, 1, hr); r(10, 0 + b, 1, 1, hr); }
    if (hs === 'long') { r(1, 3 + b, 3, 12, DK); r(12, 3 + b, 3, 12, DK); r(2, 4 + b, 2, 10, hr); r(12, 4 + b, 2, 10, hrD); r(4, 4 + b, 8, 1, hr); }
    if (hs === 'bun') { r(5, -1 + b + 1, 6, 2, DK); r(6, 0 + b, 4, 1, hrL); r(3, 4 + b, 1, 3, hr); r(12, 4 + b, 1, 3, hrD); }
    if (hs === 'pony') { r(12, 2 + b, 4, 3, DK); r(13, 3 + b, 3, 6, DK); r(13, 3 + b, 2, 5, hr); r(3, 4 + b, 2, 1, hr); }
    if (hs === 'bald') { r(3, 1 + b, 10, 2, sk); r(3, 3 + b, 1, 3, hr); r(12, 3 + b, 1, 3, hrD); }
    if (hs === 'curlers') { for (const x of [3, 6, 9, 12]) { r(x - 1, 0 + b, 3, 3, DK); r(x, 1 + b, 1, 1, '#ff8fb8'); } r(3, 4 + b, 1, 2, hr); r(12, 4 + b, 1, 2, hrD); }
    // rosto simples: olhos de dois pixels
    const ey = 6 + b;
    if (o.glasses) { r(4, ey - 1, 3, 3, o.glasses); r(9, ey - 1, 3, 3, o.glasses); r(7, ey, 2, 1, o.glasses); r(5, ey, 1, 1, '#ffffff'); r(10, ey, 1, 1, '#ffffff'); }
    else if (o.hideEyes) { r(3, ey - 1, 10, 3, hr); r(3, ey + 1, 10, 1, hrD); }
    else { r(5, ey, 1, 2, o.eyes || DK); r(10, ey, 1, 2, o.eyes || DK); }
    if (o.stache) { r(5, ey + 3, 6, 1, o.stache); r(5, ey + 2, 1, 1, o.stache); r(10, ey + 2, 1, 1, o.stache); }
    else r(7, ey + 3, 2, 1, o.mouth || '#a0505a');
    if (o.blush) { r(4, ey + 2, 1, 1, '#ff8f9f'); r(11, ey + 2, 1, 1, '#ff8f9f'); }
    if (o.hat) o.hat(r, b);
  });
}
const dt2 = o => [dtChar(o, 0), dtChar(o, 1)];
// figurinos dos personagens com nome
const DT = {
  jorge: { skin: '#d8a070', hair: '#9a9aa0', hs: 'short', top: '#3a70c0', pants: '#24346a', stache: '#7a7a80', belt: '#3a2420',
    acc: (r, b) => { r(11, 17, 2, 2, '#f0c040'); r(6, 12 + b, 1, 4, '#24346a'); },
    hat: (r, b) => { r(2, 0 + b, 12, 3, DK); r(3, 0 + b, 10, 2, '#1c3058'); r(1, 2 + b, 14, 2, DK); r(2, 3 + b, 12, 1, '#24346a'); r(7, 1 + b, 2, 1, '#f0c040'); } },
  tiago: { skin: '#d8a070', hair: '#3a2418', hs: 'spiky', top: '#3a5a8a', pants: '#3a3a52', sleeve: '#7a4a2a', belt: '#7a4a2a',
    acc: (r, b) => { r(3, 12 + b, 10, 2, '#c83838'); r(11, 14 + b, 2, 3, '#c83838'); r(4, 15 + b, 2, 2, '#f0c040'); } },
  rita: { skin: '#c8905a', hair: '#2a1410', hs: 'pony', top: '#6a7084', pants: '#5a3a2a', sleeve: '#7a4a2a', belt: '#5a3a1a',
    acc: (r, b) => { r(0, 11 + b, 4, 7, DK); r(0, 12 + b, 3, 5, '#7a2020'); r(1, 13 + b, 1, 3, '#f0c040'); r(5, 12 + b, 6, 3, shade('#a8b0c0', 1.2)); } },
  marlene: { skin: '#e8c0a0', hair: '#c8c8d8', hs: 'curlers', top: '#a85a8a', pants: '#3a2a4a', glasses: null,
    acc: (r, b) => { r(14, 8 + b, 1, 10, '#c0c8d0'); r(13, 16 + b, 3, 1, '#f0c040'); r(5, 14 + b, 1, 1, '#f0c040'); r(9, 14 + b, 1, 1, '#f0c040'); } },
  neide: { skin: '#e0c0a0', hair: '#a8a8b8', hs: 'bun', top: '#5a7aa8', pants: '#3a3a4a', glasses: '#8a6a3a', dress: '#3a4a6a',
    acc: (r, b) => { r(0, 13 + b, 4, 5, DK); r(1, 14 + b, 3, 3, '#f2ecdc'); r(1, 15 + b, 2, 1, '#c83838'); } },
  ozorio: { skin: '#d8a070', hair: '#8a8a90', hs: 'bald', top: '#e8e4dc', pants: '#5a4a3a', stache: '#6a6a70',
    acc: (r, b) => { r(4, 13 + b, 8, 5, '#e8dcc0'); r(4, 13 + b, 8, 1, '#c83838'); r(7, 15 + b, 2, 2, '#f0c040'); } },
  duda: { skin: '#a86a40', hair: '#2a1410', hs: 'short', top: '#3a70c0', pants: '#2a3a6a', sleeve: '#6a7084', blush: true,
    acc: (r, b) => { r(1, 11 + b, 2, 9, '#c83838'); r(13, 11 + b, 2, 9, '#a82828'); r(6, 12 + b, 4, 1, '#2a3a6a'); r(7, 13 + b, 2, 1, '#2a3a6a'); } },
  pip: { skin: '#e8b890', hair: '#c86a30', hs: 'spiky', top: '#4a9a4a', pants: '#4a3a2a', belt: '#3a2a1a', blush: true,
    acc: (r, b) => { r(3, 12 + b, 10, 1, '#c83838'); r(12, 14 + b, 2, 2, '#c8c0a8'); } },
  nina: { skin: '#e8b890', hair: '#3a2018', hs: 'long', top: '#6a4a2a', pants: '#4a3a2a', belt: '#3a2a1a', blush: true,
    acc: (r, b) => { r(3, 12 + b, 10, 1, '#c83838'); } },
  brida: { skin: '#d8a070', hair: '#8a2a1a', hs: 'pony', top: '#9a93b0', pants: '#3a2a20', sleeve: '#c83838', belt: '#5a3a1a',
    acc: (r, b) => { r(13, 10 + b, 3, 7, DK); r(14, 11 + b, 1, 5, '#8a6a4a'); r(13, 11 + b, 3, 1, '#c0c8d0'); r(5, 13 + b, 1, 4, '#f0c040'); },
    hat: (r, b) => { r(1, -1 + b + 1, 14, 3, DK); r(2, 0 + b, 12, 2, '#3a2a20'); r(6, 0 + b, 4, 1, '#f0c040'); } },
  maren: { skin: '#e8c0a0', hair: '#2a1a30', hs: 'long', top: '#7a48b0', dress: '#4a2a7a', sleeve: '#5a3a8a',
    acc: (r, b) => { r(6, 12 + b, 4, 6, '#e8e4f0'); r(7, 13 + b, 2, 3, '#f0c040'); },
    hat: (r, b) => { r(3, -1 + b + 1, 10, 3, DK); r(4, 0 + b, 8, 2, '#3a1a5a'); r(1, 2 + b, 14, 2, DK); r(2, 3 + b, 12, 1, '#5a2a7a'); r(7, 0 + b, 2, 1, '#f0c040'); } },
  maren5: { skin: '#e8c0a0', hair: '#2a1a30', hs: 'long', top: '#7a48b0', dress: '#4a2a7a', sleeve: '#5a3a8a', acc: (r, b) => { r(6, 12 + b, 4, 6, '#e8e4f0'); r(10, 4 + b, 1, 3, '#c87070'); } },
  clara: { skin: '#f0dcd0', hair: '#c8b088', hs: 'bun', top: '#e8e4f0', dress: '#c8d0e0', blush: true, acc: (r, b) => { r(6, 12 + b, 4, 1, '#7a6ab0'); } },
  anselmo: { skin: '#c89878', hair: '#7a7a7a', hs: 'short', top: '#3a2a20', pants: '#2a2a2a', stache: '#7a7a7a',
    hat: (r, b) => { r(3, -2 + b + 2, 10, 4, DK); r(4, 0 + b, 8, 3, '#1a1414'); r(2, 3 + b, 12, 1, DK); r(4, 2 + b, 8, 1, '#7a2020'); } }
};
// Ofélia: fantasma, sem pés, com um livro
function dtOfelia(f) {
  const c = dtChar({ skin: '#d8f0f8', hair: '#5a7a9a', hs: 'bun', top: '#8ab0d0', dress: '#a8c8e0', ghost: true, glasses: '#3a5a7a', acc: (r, b) => { r(5, 13 + b, 6, 4, DK); r(6, 14 + b, 4, 2, '#c83838'); r(8, 14 + b, 1, 2, '#f0c040'); } }, f);
  const x = c.getContext('2d'); x.clearRect(0, 22, 16, 2); x.fillStyle = '#a8c8e0'; for (let i = 0; i < 4; i++) x.fillRect(3 + i * 3, 22, 2, 1 + ((i + f) % 2));
  return c;
}
// Dona Cida: gata fantasma de óculos dourados
function dtCida(f) {
  return cv4(16, 16, (r) => {
    const g = '#9a9aa8', gD = '#6a6a7a', b = f;
    r(1, 6, 14, 9, DK); r(2, 7, 12, 7, g); r(9, 7, 5, 7, gD); r(2, 7, 12, 1, '#c0c0cc');
    r(1, 2 + b, 4, 5, DK); r(11, 2 + b, 4, 5, DK); r(2, 3 + b, 2, 3, g); r(12, 3 + b, 2, 3, gD); r(2, 4 + b, 1, 1, '#ff9aaa'); r(13, 4 + b, 1, 1, '#ff9aaa');
    r(3, 8, 4, 3, '#f0c040'); r(9, 8, 4, 3, '#f0c040'); r(4, 9, 2, 1, DK); r(10, 9, 2, 1, DK); r(7, 9, 2, 1, '#f0c040');
    r(7, 11, 2, 1, '#ff9aaa'); r(5, 12, 6, 1, gD);
    r(13, 11 - b, 3, 2, DK); r(14, 11 - b, 2, 1, g);
  });
}
// Musgo: golem de pedra coberto de musgo, grande
function dtMusgo(f) {
  return cv4(24, 24, (r) => {
    const st = '#7a7a88', stD = '#5a5a68', ms = '#5aa048', msL = '#8ad070', b = f;
    r(3, 4 + b, 18, 16, DK); r(4, 5 + b, 16, 14, st); r(13, 5 + b, 7, 14, stD); r(4, 5 + b, 16, 3, ms); r(4, 5 + b, 16, 1, msL); r(6, 8 + b, 3, 2, ms); r(15, 9 + b, 4, 2, ms);
    r(7, 10 + b, 3, 3, DK); r(14, 10 + b, 3, 3, DK); r(8, 11 + b, 1, 1, '#ffe066'); r(15, 11 + b, 1, 1, '#ffe066');
    r(9, 15 + b, 6, 1, DK);
    r(0, 9 + b, 4, 9, DK); r(1, 10 + b, 2, 7, st); r(20, 9 + b, 4, 9, DK); r(21, 10 + b, 2, 7, stD); r(1, 10 + b, 2, 1, ms);
    r(5, 20, 5, 4, DK); r(14, 20, 5, 4, DK); r(6, 20, 3, 3, stD); r(15, 20, 3, 3, stD);
  });
}
// Lume: lustre vivo com rosto, chamas nas pontas
function dtLume(f) {
  return cv4(16, 16, (r) => {
    const gold = '#f0c040', gD = '#c8962a';
    r(7, 0, 2, 3, DK); r(7, 0, 1, 2, gD);
    r(2, 3, 12, 8, DK); r(3, 4, 10, 6, gold); r(9, 4, 4, 6, gD); r(3, 4, 10, 1, '#fff4c0');
    r(5, 6, 1, 2, DK); r(10, 6, 1, 2, DK); r(7, 8, 2, 1, '#a05050'); r(4, 8, 1, 1, '#ff9aaa'); r(11, 8, 1, 1, '#ff9aaa');
    for (const x of [1, 7, 13]) { r(x - 1, 10, 3, 3, DK); r(x, 11, 1, 1, gD); r(x, 9 - (f && x !== 7 ? 1 : 0), 1, 2, f ? '#ffb040' : '#ffe066'); }
    r(4, 12, 1, 3, DK); r(11, 12, 1, 3, DK); r(5, 14, 6, 1, DK); r(6, 13, 4, 1, gD);
  });
}
function buildArte() {
  for (const k of Object.keys(DT)) SP[k] = dt2(DT[k]);
  SP.tiago = SP.tiago || dt2(DT.tiago);
  SP.ofelia = [dtOfelia(0), dtOfelia(1)];
  SP.cida = [dtCida(0), dtCida(1)];
  SP.musgo = [dtMusgo(0), dtMusgo(1)];
  SP.lume = [dtLume(0), dtLume(1)];
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildArte(); }; }
// o Tiago tinha o mesmo sprite dos caçadores comuns; agora ele tem o próprio
for (const m of Object.values(MAPS)) for (const e of m.ents || []) if (e.sp === 'hunter' && e.kind === 'npc2' && /tiago/i.test((e.talk || '') + (e.id || ''))) e.sp = 'tiago';
HELPERS8.tiago.sp = 'tiago';
WHO.tiago.portrait = t => portFrame('tiago', t);
// sprites mais altos que o tile: desenhados com os pés no tile
function drawTall(sp, sx, sy, flip, dy = 0) {
  const w = sp.width, h = sp.height, x = sx + 8 - w / 2, y = sy + 16 - h + dy;
  if (flip) { bx.save(); bx.translate(x + w, y); bx.scale(-1, 1); bx.drawImage(sp, 0, 0); bx.restore(); } else bx.drawImage(sp, x, y);
}
// ----- retratos no estilo novo (substitui o busto antigo para todos os humanos com nome) -----
bust = function (o) {
  return pcv((r, fr) => {
    const sk = o.skin, sd = o.skinD || shade(o.skin, 0.8), hr = o.hair, hd = shade(hr, 0.7), hl = shade(hr, 1.3), cl = o.cloth, c2 = o.cloth2 || shade(o.cloth, 0.72);
    const st = o.style;
    // cabelo de trás
    if (st === 'long' || st === 'pony') { r(4, 7, 24, 22, DK); r(5, 8, 22, 20, hd); }
    // ombros
    r(1, 25, 30, 7, DK); r(2, 26, 28, 6, cl); r(18, 26, 12, 6, c2); r(2, 26, 28, 1, shade(cl, 1.25));
    r(12, 23, 8, 4, DK); r(13, 23, 6, 3, sd);
    if (o.collar) { r(10, 25, 5, 3, DK); r(17, 25, 5, 3, DK); r(11, 26, 3, 1, o.collar); r(18, 26, 3, 1, o.collar); }
    if (o.vest) { r(2, 27, 7, 5, o.vest); r(23, 27, 7, 5, o.vest); }
    if (o.badge) { r(21, 28, 3, 2, o.badge); }
    // cabeça grande e redonda
    r(6, 5, 20, 20, DK); r(7, 4, 18, 1, DK); r(7, 6, 18, 18, sk); r(8, 24, 16, 1, DK); r(19, 10, 6, 14, sd); r(9, 23, 14, 1, sd);
    r(5, 13, 2, 5, DK); r(25, 13, 2, 5, DK); r(6, 14, 1, 3, sd); r(25, 14, 1, 3, sd);
    // olhos simples e expressivos
    const ey = 13;
    if (fr === 2) { r(10, ey + 2, 4, 1, DK); r(18, ey + 2, 4, 1, DK); }
    else { r(11, ey, 2, 4, o.eyes && o.eyes !== '#3a2418' ? o.eyes : DK); r(19, ey, 2, 4, o.eyes && o.eyes !== '#3a2418' ? o.eyes : DK); r(11, ey, 1, 1, '#ffffff'); r(19, ey, 1, 1, '#ffffff'); if (o.eyes && o.eyes !== '#3a2418') { r(11, ey + 3, 2, 1, DK); r(19, ey + 3, 2, 1, DK); } }
    r(10, ey - 2, 4, 1, o.brow || hd); r(18, ey - 2, 4, 1, o.brow || hd);
    if (o.blush) { r(9, 19, 2, 1, '#ff8f9f'); r(21, 19, 2, 1, '#ff8f9f'); }
    // boca
    if (fr === 1) { r(14, 20, 4, 2, DK); r(15, 21, 2, 1, '#e07080'); } else r(14, 20, 4, 1, o.lips && o.lips !== '#8a3a3a' ? o.lips : DK);
    if (o.stache) { r(11, 19, 10, 2, DK); r(12, 19, 8, 1, o.stache); }
    // cabelo da frente
    if (st !== 'bald') {
      r(5, 2, 22, 8, DK); r(6, 3, 20, 6, hr); r(6, 3, 20, 1, hl); r(6, 9, 4, 3, hr); r(22, 9, 4, 4, hd); r(12, 9, 6, 2, hr); r(5, 9, 1, 4, DK); r(26, 9, 1, 5, DK);
      if (st === 'long') { r(4, 9, 3, 18, DK); r(25, 9, 3, 18, DK); r(5, 10, 2, 16, hr); r(25, 10, 2, 16, hd); }
      if (st === 'pony') { r(25, 4, 6, 4, DK); r(26, 5, 5, 2, hr); r(27, 7, 4, 10, DK); r(28, 7, 2, 9, hr); }
      if (st === 'bun') { r(11, 0, 10, 4, DK); r(12, 0, 8, 3, hl); }
      if (st === 'messy') { for (const x of [6, 12, 18, 23]) { r(x, 0, 4, 4, DK); r(x + 1, 1, 2, 2, hr); } }
    } else { r(7, 6, 18, 3, sk); r(6, 9, 2, 5, hr); r(24, 9, 2, 5, hd); }
    if (o.glasses) { r(9, ey - 1, 6, 6, DK); r(17, ey - 1, 6, 6, DK); r(10, ey, 4, 4, '#d8e8f0'); r(18, ey, 4, 4, '#d8e8f0'); r(15, ey + 1, 2, 1, DK); if (fr !== 2) { r(11, ey + 1, 2, 2, DK); r(19, ey + 1, 2, 2, DK); } }
    if (o.scar) { r(21, 9, 1, 5, '#c85050'); r(20, 11, 3, 1, '#c85050'); }
    if (o.extra) o.extra(r, fr);
  });
};
// a forma humana também vira esse estilo, inclusive no retrato grande (48x48)
animeBust8 = function (fr) {
  const f = G.flags, A = ANIME8[f.prev4] || ANIME8.bastiao, aura = f.grau5, blur = faceBlur8();
  const SK = '#f0c8a0', SD = shade(SK, 0.8), H = A.hair, HD = shade(H, 0.7), HL = shade(H, 1.35), EYE = aura === 'arca' ? '#e0a020' : aura === 'vazio' ? '#a8b0c8' : A.eye;
  const long = ['proibido', 'eclipse', 'constelacao'].includes(f.prev4);
  const c = cv4(48, 48, (r) => {
    if (long) { r(7, 10, 34, 32, DK); r(8, 11, 32, 30, HD); }
    // ombros e roupa
    r(3, 38, 42, 10, DK); r(4, 39, 40, 9, A.cloth); r(27, 39, 17, 9, shade(A.cloth, 0.72)); r(4, 39, 40, 1, shade(A.cloth, 1.3));
    r(18, 34, 12, 6, DK); r(19, 34, 10, 5, SD);
    if (A.look === 'armor') for (const x of [3, 33]) { r(x, 37, 12, 7, DK); r(x + 1, 38, 10, 5, '#8a90a8'); r(x + 1, 38, 10, 1, '#c8d0e0'); r(x + 2, 40, 2, 2, '#f0c040'); r(x + 8, 40, 2, 2, '#f0c040'); }
    if (A.look === 'collar') { r(13, 33, 22, 7, DK); r(14, 34, 20, 5, '#2a1a3a'); r(14, 34, 20, 1, '#5a3a6a'); }
    if (A.look === 'sting') { r(22, 41, 4, 6, DK); r(23, 42, 2, 4, '#8ac85a'); }
    if (A.look === 'scarf') { r(11, 35, 26, 7, DK); r(12, 36, 24, 5, '#c83838'); r(12, 36, 24, 1, '#ff6060'); r(30, 40, 6, 8, DK); r(31, 40, 4, 7, '#a82828'); }
    if (A.look === 'pages') for (let y = 42; y < 48; y += 2) { r(6, y, 12, 1, '#a89068'); r(30, y, 12, 1, '#a89068'); }
    if (A.look === 'runes') for (const [x, y] of [[8, 42], [14, 44], [34, 42], [40, 45]]) { r(x, y, 3, 1, '#b48cf0'); r(x + 1, y - 1, 1, 3, '#b48cf0'); }
    if (A.look === 'shadow') for (let i = 0; i < 6; i++) r(3 + i * 7, 35 + (i % 2) * 2, 5, 4, '#2a1a3a');
    if (A.look === 'stars') for (const [x, y] of [[8, 43], [15, 45], [34, 42], [40, 46], [28, 46]]) { r(x, y, 1, 1, '#ffe066'); r(x - 1, y, 3, 1, '#ffe06680'); }
    r(21, 39, 6, 5, DK); r(22, 40, 4, 3, '#f0c040'); r(22, 40, 2, 1, '#fff4c0');
    // cabeça grande e redonda
    r(9, 6, 30, 30, DK); r(10, 5, 28, 1, DK); r(10, 7, 28, 28, SK); r(12, 35, 24, 1, DK); r(29, 14, 9, 20, SD); r(13, 33, 22, 2, SD);
    r(7, 18, 3, 8, DK); r(38, 18, 3, 8, DK); r(8, 19, 2, 6, SD); r(38, 19, 2, 6, SD);
    // olhos expressivos e simples
    const ey = 19;
    for (const x0 of [15, 29]) {
      if (fr === 2) { r(x0 - 1, ey + 3, 5, 2, DK); continue; }
      r(x0, ey, 4, 7, DK); r(x0 + 1, ey + 1, 2, 5, EYE); r(x0 + 1, ey + 4, 2, 2, shade(EYE, 0.6)); r(x0 + 1, ey + 1, 1, 2, '#ffffff');
      if (aura === 'arca') r(x0 + 2, ey + 3, 1, 1, '#fff4c0');
    }
    r(14, ey - 3, 6, 2, HD); r(28, ey - 3, 6, 2, HD);
    if (fr === 1) { r(21, 29, 6, 3, DK); r(22, 30, 4, 1, '#e07080'); } else r(21, 30, 6, 1, DK);
    r(13, 27, 3, 1, '#ff8f9f'); r(32, 27, 3, 1, '#ff8f9f');
    if (A.look === 'scarf') { r(33, 13, 1, 6, '#c85050'); r(32, 15, 3, 1, '#c85050'); }
    if (A.look === 'runes') { r(13, 28, 1, 4, '#8a5ad8'); r(34, 28, 1, 4, '#8a5ad8'); }
    if (A.look === 'stars') for (const [x, y] of [[14, 29], [17, 30], [30, 29], [33, 30]]) r(x, y, 1, 1, fr === 2 ? '#ffffff' : '#ffe066');
    if (A.look === 'pages') { r(13, ey - 1, 9, 9, DK); r(27, ey - 1, 9, 9, DK); r(14, ey, 7, 7, '#d8e8f0'); r(28, ey, 7, 7, '#d8e8f0'); r(22, ey + 2, 5, 1, DK); if (fr !== 2) { r(16, ey + 2, 3, 3, DK); r(30, ey + 2, 3, 3, DK); r(16, ey + 2, 1, 1, '#ffffff'); r(30, ey + 2, 1, 1, '#ffffff'); } }
    // cabelo em blocos, com a mecha rebelde
    r(7, 1, 34, 13, DK); r(8, 2, 32, 11, H); r(8, 2, 32, 2, HL);
    for (const [x, w, h] of [[8, 6, 6], [15, 6, 4], [22, 5, 6], [28, 6, 4], [34, 6, 7]]) { r(x - 1, 12, w + 2, h + 1, DK); r(x, 12, w, h, x > 26 ? HD : H); }
    r(6, 12, 3, long ? 26 : 16, DK); r(39, 12, 3, long ? 26 : 16, DK); r(7, 13, 2, long ? 24 : 14, H); r(39, 13, 2, long ? 24 : 14, HD);
    r(22, 0, 3, 3, DK); r(24, 0, 4, 2, DK); r(23, 1, 1, 2, H); r(25, 0, 2, 1, H);
    if (A.look === 'runes') { r(30, 2, 4, 12, '#5a6ad0'); r(31, 2, 1, 12, '#8a9af0'); }
    if (A.look === 'stars') for (const [x, y] of [[12, 5], [20, 3], [30, 6], [36, 9]]) r(x, y, 1, 1, '#ffe066');
    if (A.look === 'sting') for (const x of [9, 17, 30, 37]) { r(x, 0, 3, 3, DK); r(x + 1, 1, 1, 2, H); }
    // memórias perdidas: partes do rosto apagadas, como borracha
    const R = bgRand(311 + fr);
    for (let i = 0; i < blur * 4; i++) { const y = 24 + Math.floor(R() * (blur >= 3 ? 12 : 9)) - (blur >= 3 ? 7 : 0), x = 13 + Math.floor(R() * 18), w = 5 + Math.floor(R() * 8); r(x, y, w, 2, SK); }
  });
  if (aura === 'vazio') { const x = c.getContext('2d'), d = x.getImageData(0, 0, 48, 48); for (let i = 0; i < d.data.length; i += 4) { const p = i >> 2; if (d.data[i + 3] && ((p % 48) + Math.floor(p / 48)) % 3 === 0) d.data[i + 3] = 120; } x.putImageData(d, 0, 0); }
  return c;
};
// ----- o baú no estilo novo: sombra chapada do lado direito e brilho no canto da tampa (todas as formas) -----
function dtShade8(c, fromX, keep) {
  const x = c.getContext('2d'), w = c.width, h = c.height, d = x.getImageData(0, 0, w, h), D = d.data;
  const dark = i => D[i] + D[i + 1] + D[i + 2] < 90;
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
    const i = (yy * w + xx) * 4; if (!D[i + 3] || dark(i)) continue;
    if (xx >= Math.round(w * fromX)) { D[i] *= 0.78; D[i + 1] *= 0.76; D[i + 2] *= 0.82; }
  }
  x.putImageData(d, 0, 0); return c;
}
const DT_DONE = new WeakSet();
function dtShadeOnce(c, fx) { if (!c || DT_DONE.has(c)) return c; DT_DONE.add(c); return dtShade8(c, fx); }
function dtChests() {
  for (const k of Object.keys(SPECIES)) { const key = SPECIES[k].sp; if (SP[key]) SP[key].forEach(c => dtShadeOnce(c, 0.62)); if (SPD[key]) for (const dir of ['down', 'up']) (SPD[key][dir] || []).forEach(c => dtShadeOnce(c, 0.62)); }
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); dtChests(); }; }
{ const _pb = pbSprites; pbSprites = function (form) { const S = _pb(form); if (!S._dt) { S._dt = true; for (const p of Object.keys(S)) if (Array.isArray(S[p])) S[p].forEach(c => dtShadeOnce(c, 0.6)); } return S; }; }
// ----- artes enviadas pelo usuário (arte_ia.js): substituem os sprites e retratos dos personagens com nome -----
function iaCanvas(e) {
  const c = mk(e.w, e.h), x = c.getContext('2d'), id = x.createImageData(e.w, e.h), b = atob(e.d), P = [];
  for (let i = 0; i < e.p.length; i += 6) P.push([parseInt(e.p.substr(i, 2), 16), parseInt(e.p.substr(i + 2, 2), 16), parseInt(e.p.substr(i + 4, 2), 16)]);
  for (let i = 0; i < b.length; i++) { const k = b.charCodeAt(i); if (!k) continue; const p = P[k - 1]; id.data[i * 4] = p[0]; id.data[i * 4 + 1] = p[1]; id.data[i * 4 + 2] = p[2]; id.data[i * 4 + 3] = 255; }
  x.putImageData(id, 0, 0); return c;
}
function buildArteIA() {
  if (typeof ARTE_IA === 'undefined') return;
  for (const [k, fr] of Object.entries(ARTE_IA.sp)) SP[k] = fr.map(iaCanvas);
  SP.maren5 = SP.maren; SP.tiago = SP.tiago || SP.hunter;
  for (const [k, fr] of Object.entries(ARTE_IA.port)) PORT[k] = fr.map(iaCanvas);
  PORT.of = PORT.ofelia; PORT.maren5 = PORT.maren;
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildArteIA(); }; }
for (const k of ['jorge', 'tiago', 'marlene', 'neide', 'ozorio', 'duda', 'rita', 'brida', 'maren', 'maren5', 'clara', 'pip', 'nina', 'anselmo', 'escriba', 'lume', 'musgo', 'cida', 'bento', 'valdir'])
  if (WHO[k]) WHO[k].portrait = t => portFrame(k, t);
for (const m of Object.values(MAPS)) for (const e of m.ents || []) if (e.id === 'tolo' && e.sp === 'pip') e.sp = 'tolo';
// a Lume (agora maior) desenhada flutuando, centralizada no lugar dela
function drawLume8(x, y, alpha) {
  const L = SP.lume, f = L[Math.floor(FRAME / 14) % L.length], bob = Math.round(Math.sin(FRAME * 0.06) * 1.5);
  if (alpha != null) bx.globalAlpha = alpha;
  bx.drawImage(f, Math.round(x + 8 - f.width / 2), Math.round(y + 12 - f.height + bob));
  bx.globalAlpha = 1;
}
// ----- parte 2 das artes do usuário (arte_ia2.js): lado/costas, baús, Lume, Pavio, Bento e forma humana -----
const SPF = {}, CHEST8 = {}; let HUMAN8 = null;
function buildArteIA2() {
  if (typeof ARTE_IA2 === 'undefined') return;
  const D = ARTE_IA2, dec = a => a.map(iaCanvas);
  for (const [k, fr] of Object.entries(D.sp)) {
    const m = k.match(/^(.*)_(s|b)$/);
    if (m) (SPF[m[1]] = SPF[m[1]] || {})[m[2]] = dec(fr); else SP[k] = dec(fr);
  }
  for (const [k, fr] of Object.entries(D.port)) PORT[k] = dec(fr);
  if (D.port.ofelia) PORT.of = PORT.ofelia;
  // baús: mapa e batalha
  for (const [k, v] of Object.entries(D.chest)) {
    const sp = SPECIES[k] && SPECIES[k].sp; if (!sp) continue;
    const [f, t, c] = dec(v.map), [bf, bt, bc] = dec(v.bat), tl = flipH(t), btl = flipH(bt);
    const hop = (cv, dy) => { const o = mk(cv.width, cv.height + 2); o.getContext('2d').drawImage(cv, 0, 2 - dy); return o; };
    SP[sp] = [f, f, f];
    SPD[sp] = { down: [f, f, f], up: [c, c, c], right: [tl, tl, tl, hop(tl, 1), hop(tl, 2), tl], left: [t, t, t, hop(t, 1), hop(t, 2), t] };
    CHEST8[k] = { closed: c, bat: { front: bf, three: bt, three_l: btl, closed: bc } };
  }
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildArteIA2(); }; }
// os personagens se viram para o baú quando ele chega perto
function faceSp8(e) {
  const F = SPF[e.sp]; if (!F || V.scene !== 'world') return null;
  const ex = e.tx ?? e.x, ey = e.ty ?? e.y, dx = WD.x - ex, dy = WD.y - ey;
  if (Math.abs(dx) + Math.abs(dy) > 3) return null;
  if (dy < 0 && Math.abs(dy) >= Math.abs(dx) && F.b) return [F.b, false];
  if (Math.abs(dx) > Math.abs(dy) && F.s) return [F.s, dx < 0];
  return null;
}
// o baú na batalha: aberto de frente, fechado na defesa, de lado na vitória
{ const _pb = pbSprites; pbSprites = function (form) {
  const C = CHEST8[form] && CHEST8[form].bat;
  if (!C) return _pb(form);
  if (C._S) return C._S;
  const sh = (cv, dx, dy, s = 1) => { const o = mk(cv.width + 4, cv.height + 4); const x = o.getContext('2d'); x.imageSmoothingEnabled = false; const w = Math.round(cv.width * s), h = Math.round(cv.height / s); x.drawImage(cv, 2 + dx + (cv.width - w) / 2, 2 + dy + cv.height - h, w, h); return o; };
  const S = { idle: [sh(C.front, 0, 0), sh(C.front, 0, 0, 1.03), sh(C.front, 0, 0), sh(C.front, 0, 0, 0.97)],
    open: [sh(C.front, 0, -1, 1.08), sh(C.front, 0, -2, 1.1), sh(C.front, 0, -1, 1.08), sh(C.front, 0, 0, 1.04)],
    shut: [sh(C.closed, 0, 0), sh(C.closed, 0, 0, 1.02), sh(C.closed, 0, 0), sh(C.closed, 0, 0, 0.98)],
    hurt: [sh(C.front, -2, 0, 0.94), sh(C.front, -1, 0, 0.96), sh(C.front, -2, 0, 0.94), sh(C.front, -1, 0, 0.96)],
    win: [sh(C.three_l, 0, 0), sh(C.three_l, 0, -2), sh(C.front, 0, -3), sh(C.three_l, 0, -1)] };
  S._dt = true; C._S = S; return S;
}; }
// a Lume: dorme quando você fica parado, ri quando canta na batalha
drawLume8 = function (x, y, alpha) {
  const L = WD.idle > 420 && SP.lumeSleep ? SP.lumeSleep : SP.lume, f = L[Math.floor(FRAME / (L === SP.lume ? 14 : 40)) % L.length], bob = Math.round(Math.sin(FRAME * 0.06) * 1.5);
  if (alpha != null) bx.globalAlpha = alpha;
  bx.drawImage(f, Math.round(x + 8 - f.width / 2), Math.round(y + 12 - f.height + bob));
  bx.globalAlpha = 1;
};
for (const k of ['pavio', 'bento']) if (WHO[k]) WHO[k].portrait = t => portFrame(k, t);
// forma humana com a arte do usuário (linha de 4º grau); Arca brilha dourado, Vazio fica translúcido
function humanArt8() {
  if (typeof ARTE_IA2 === 'undefined') return null;
  const H = ARTE_IA2.human[G.flags.prev4] || ARTE_IA2.human.bastiao; if (!H) return null;
  const dec = a => a.map(iaCanvas), aura = G.flags.grau5;
  const fx = cv => { if (aura === 'vazio') { const x = cv.getContext('2d'), d = x.getImageData(0, 0, cv.width, cv.height); for (let i = 0; i < d.data.length; i += 4) { const p = i >> 2; if (d.data[i + 3] && ((p % cv.width) + Math.floor(p / cv.width)) % 3 === 0) d.data[i + 3] = 120; } x.putImageData(d, 0, 0); } return cv; };
  const big = dec(H.big).map(fx), port = dec(H.port).map(fx), body = dec(H.body).map(fx);
  return { big: [big[0], big[1], big[0], big[2], big[3]], port: [port[0], port[1], port[0]], body };
}
{ const _hp = humanPort8; humanPort8 = function () { const A = humanArt8(); if (!A) return _hp(); PORT.humano48 = A.big; HUMAN8 = A.body; return A.port; }; }
// ----- chefes com a arte do usuário (arte_ia3.js) -----
const BOSS8 = {};
function pngCanvas(e) { const c = mk(e.w, e.h), im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = 'data:image/png;base64,' + e.png; return c; }
function buildArteIA3() {
  if (typeof ARTE_IA3 === 'undefined') return;
  for (const [k, v] of Object.entries(ARTE_IA3)) {
    const S = {}; for (const [st, fr] of Object.entries(v)) { S[st] = fr.map(pngCanvas); SP[k + 'IA_' + st] = S[st]; }
    BOSS8[k] = S;
    if (ENEMIES[k] && k !== 'catalogo') { ENEMIES[k].sp = k + 'IA_idle'; ENEMIES[k].bsc = 1; }
  }
}
{ const _bs = buildSprites; buildSprites = function () { _bs(); buildArteIA3(); }; }
// chefes largos não saem da tela
{ const _mk = mkEnemy; mkEnemy = function (id, i, n) { const e = _mk(id, i, n); const S = BOSS8[id]; if (S && id !== 'catalogo') { const w = S.idle[0].width; e.x = Math.max(40 + w / 2, Math.min(e.x, 238 - w / 2)); } return e; }; }
// cada chefe troca de quadro conforme o que está acontecendo
function bossState8(e) {
  const S = BOSS8[e.id]; if (!S) return null;
  if (!e.alive) return 'dead';
  if (e.flash > 0 || e.shake > 10) return 'hurt';
  if (e.lunge > 0) return 'atk';
  if ((e.phase8 || e.phase || 1) >= 3 && S.p3) return 'p3';
  if ((e.phase8 || e.phase || 1) >= 2) return 'p2';
  return 'idle';
}
// ----- animação dos chefes (desenho próprio: respiração, sombra, preparo do golpe, rastro, recuo, aura de fase e dissolução) -----
const AURA8 = { boss: '#9ad070', octo: '#e070d0', brida: '#ff5a5a', jailer: '#c0a0ff', knight: '#b070ff', maren: '#c890ff', clara: '#a8c0ff', maren5: '#e0a0ff', fiscal: '#ffd070', jorge: '#ffd040', tacho: '#ff9a30', maestro: '#8fb0ff', p32: '#ffb0d0', carro: '#c090ff', timoneiro: '#ffc040', capitao: '#ff4a4a', lacre: '#ff3a4a', escriba8: '#9a80ff' };
// partículas de ambiente de cada um: [cores, modo]  sobe | cai | flutua
const AMB8 = { boss: [['#9ad070', '#6a8a4a'], 'cai'], octo: [['#e070d0', '#ffffff'], 'sobe'], brida: [['#ff8a5a', '#ffd040'], 'sobe'], jailer: [['#8a8099', '#c0a0ff'], 'cai'], knight: [['#b070ff', '#5a3a8a'], 'flutua'], maren: [['#c890ff', '#ffe066'], 'flutua'], clara: [['#a8c0ff', '#ffffff'], 'flutua'], maren5: [['#e0a0ff', '#ffffff'], 'flutua'], fiscal: [['#ffd070', '#f2ecdc'], 'cai'], jorge: [['#8a8099', '#b8aecb'], 'sobe'], tacho: [['#f2ecdc', '#ffb070'], 'sobe'], maestro: [['#8fb0ff', '#ffffff'], 'flutua'], p32: [['#ffb0d0', '#f2ecdc'], 'flutua'], carro: [['#c090ff', '#8a8099'], 'cai'], timoneiro: [['#ffc040', '#ffe066'], 'flutua'], capitao: [['#ff4a4a', '#ffb070'], 'sobe'], lacre: [['#ff3a4a', '#a01a2a'], 'cai'], escriba8: [['#9a80ff', '#f2ecdc'], 'flutua'] };
const FLOAT8 = { clara: 3, escriba8: 3, maren5: 1.5, maestro: 1 };
function shadow8(cx, y, w, a) { bx.save(); bx.globalAlpha = a; bx.fillStyle = '#05030a'; for (let r = -2; r <= 2; r++) { const ww = Math.round(w * Math.sqrt(1 - (r / 3) * (r / 3))); bx.fillRect(Math.round(cx - ww / 2), Math.round(y + r), ww, 1); } bx.restore(); }
function drawBoss8(e) {
  const S = BOSS8[e.id], col = AURA8[e.id] || '#ffffff';
  if (e.seed8 === undefined) e.seed8 = Math.floor(Math.random() * 90);
  e.t8 = (e.t8 || 0) + 1;
  const t = FRAME + e.seed8, st = bossState8(e), ph = e.phase8 || e.phase || 1;
  if (!e.alive && !e.d8) { e.d8 = 1; e.dying = 84; }
  const base = S.idle[0], H0 = base.height, by = Math.round(e.y + H0 / 2);   // linha dos pés
  // quadro
  let fr;
  if (st === 'dead') fr = S.dead[0];
  else if (st === 'hurt') fr = S.hurt[0];
  else if (st === 'atk') fr = S.atk[0];
  else if (st === 'p3') fr = S.p3[0];
  else if (st === 'p2') fr = (t % 96) < 64 ? S.p2[0] : S.idle[Math.floor(t / 30) % S.idle.length];
  else fr = S.idle[Math.floor(t / 30) % S.idle.length];
  // corpo: respiração ancorada nos pés
  const br = Math.sin(t * 0.065);
  let sx = 1 - br * 0.012, sy = 1 + br * 0.02, dx = 0, dy = 0, alpha = 1, ghosts = 0;
  const fl = FLOAT8[e.id] || 0; if (fl) dy -= 4 + Math.sin(t * 0.05) * fl;
  // entrada: sobe do chão
  const ent = Math.min(1, e.t8 / 32), entE = 1 - Math.pow(1 - ent, 3); dy += (1 - entE) * 14; alpha *= entE;
  // golpe: prepara (recua e encolhe) e avança esticado, deixando rastro
  if (e.lunge > 0) {
    const u = 1 - e.lunge / 16;
    if (u < 0.35) { const k = u / 0.35; dx += k * 6; sx *= 1 + k * 0.06; sy *= 1 - k * 0.06; }
    else { const k = (u - 0.35) / 0.65; dx += 6 - Math.sin(k * Math.PI) * 30; sx *= 1.07 - k * 0.07; sy *= 0.95 + k * 0.05; ghosts = 3; }
  }
  // dano: tranco para trás e tremida
  if (e.shake > 0) { dx += Math.sin(e.shake * 1.7) * 3 + Math.min(e.shake, 12) * 0.5; sx *= 1 + Math.min(e.shake, 10) * 0.004; sy *= 1 - Math.min(e.shake, 10) * 0.006; }
  const w = Math.round(fr.width * sx), h = Math.round(fr.height * sy), X = Math.round(e.x + dx - w / 2), Y = Math.round(by + dy - h);
  // sombra
  const sw = Math.round(base.width * 0.62 * entE * (fl ? 0.8 - Math.sin(t * 0.05) * 0.06 : 1));
  if (e.alive || e.dying > 40) shadow8(e.x + dx * 0.5, by - 1, sw, 0.42 * alpha);
  bx.save();
  if (!e.alive) {
    // derrota: pisca, treme e se desfaz de cima para baixo em cinzas da cor do chefe
    const k = e.dying / 84, X2 = X + (k > 0.7 ? Math.round(Math.sin(e.dying * 2.1) * 2) : 0);
    if (k > 0.7) { bx.drawImage(e.dying % 6 < 3 ? silhouette(fr, '#ffffff') : fr, X2, Y, w, h); }
    else {
      const cut = Math.round(h * (1 - k / 0.7));
      bx.globalAlpha = Math.min(1, k / 0.15);
      bx.drawImage(fr, 0, Math.round(cut / sy), fr.width, fr.height - Math.round(cut / sy), X2, Y + cut, w, h - cut);
      if (e.dying % 2 === 0) for (let i = 0; i < 3; i++) fxPart(X2 + Math.random() * w, Y + cut + Math.random() * 3, rand(-0.4, 0.4), rand(-1.2, -0.3), rand(24, 44), pickOne([col, '#ffffff', '#3a2a4a']), Math.random() < 0.4 ? 2 : 1);
    }
    bx.restore(); return;
  }
  bx.globalAlpha = alpha;
  // aura de fase: contorno brilhante pulsando
  if (st === 'p2' || st === 'p3' || ph >= 2) {
    const pu = 0.35 + Math.sin(t * 0.12) * 0.2, sil = silhouette(fr, st === 'p3' ? '#ffd040' : col);
    bx.globalAlpha = alpha * pu;
    for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1]]) bx.drawImage(sil, X + ox, Y + oy, w, h);
    if (t % 5 === 0) fxPart(X + Math.random() * w, Y + h * (0.3 + Math.random() * 0.6), rand(-0.2, 0.2), rand(-1.1, -0.4), rand(30, 50), Math.random() < 0.3 ? '#ffffff' : col, Math.random() < 0.3 ? 2 : 1);
    bx.globalAlpha = alpha;
  }
  // rastro do avanço
  if (ghosts) { const sil = silhouette(fr, col); for (let g = ghosts; g >= 1; g--) { bx.globalAlpha = alpha * 0.12 * (4 - g); bx.drawImage(sil, X + g * 7, Y, w, h); } bx.globalAlpha = alpha; }
  bx.drawImage(fr, X, Y, w, h);
  if (e.flash > 0 && e.flash % 4 < 2) { bx.globalAlpha = 0.85; bx.drawImage(silhouette(fr, '#ffffff'), X, Y, w, h); }
  if (e.frozen > 0) { bx.globalAlpha = 0.45; bx.drawImage(silhouette(fr, '#7ad0f0'), X, Y, w, h); }
  bx.restore();
  // ambiente
  const A = AMB8[e.id];
  if (A && t % 11 === 0 && ent >= 1) {
    const c = pickOne(A[0]);
    if (A[1] === 'sobe') fxPart(X + w * (0.2 + Math.random() * 0.6), Y + h * 0.3 * Math.random(), rand(-0.15, 0.15), rand(-0.6, -0.25), rand(40, 60), c, 1);
    else if (A[1] === 'cai') fxPart(X + w * Math.random(), Y + h * (0.3 + Math.random() * 0.5), rand(-0.1, 0.1), 0.2, rand(25, 40), c, 1, 1);
    else fxPart(X + w * Math.random(), Y + h * Math.random(), rand(-0.2, 0.2), rand(-0.3, 0.1), rand(40, 70), c, 1);
  }
  if (e.flash === 1 || (e.shake > 0 && !e.hit8)) { e.hit8 = 1; for (let i = 0; i < 6; i++) fxPart(e.x + rand(-w / 3, w / 3), Y + h * 0.4 + rand(-10, 10), rand(0.4, 1.6), rand(-1.2, 0.2), rand(14, 24), pickOne([col, '#ffffff']), 1, 1); }
  if (!e.shake) e.hit8 = 0;
}
{ const _dp = drawParty; drawParty = function () {
  _dp();
  if (BT.on && BT.en) for (const e of BT.en) if (BOSS8[e.id] && e.id !== 'catalogo' && (e.alive || e.dying > 0)) drawBoss8(e);
}; }
// o laço padrão só desenha a barra de vida e os ícones (o corpo é desenhado acima)
{ const _db = drawBattle; drawBattle = function () {
  if (BT.on && BT.en) for (const e of BT.en) { if (e.id === 'catalogo' || !BOSS8[e.id]) continue; const st = bossState8(e); if (!st) continue; const k = e.id + 'IA_blank'; if (!SP[k]) SP[k] = [mk(BOSS8[e.id].idle[0].width, BOSS8[e.id].idle[0].height)]; e.sp = k; }
  return _db();
}; }
// o Catálogo: corpo com a arte do usuário, mantendo o halo e as letras orbitando
{ const _dc = drawCatalogo8; drawCatalogo8 = function (e) {
  const S = BOSS8.catalogo; if (!S) return _dc(e);
  const ph = e.phase8 || 1, t = FRAME, burn = ph === 3, fade = e.alive ? 1 : Math.max(0, e.dying / 36), sh = e.shake ? Math.sin(e.shake * 1.7) * 4 : 0;
  const st = !e.alive ? 'dead' : (e.flash > 0 ? 'hurt' : ph === 3 ? 'p3' : ph === 2 ? 'p2' : e.lunge > 0 ? 'atk' : 'idle');
  const fr = S[st][Math.floor(t / 24) % S[st].length], cx = e.x + sh, cy = e.y + Math.sin(t * 0.05) * 2;
  bx.save(); bx.globalAlpha = 0.18 * fade; fxDisc(cx, cy, 58 + Math.sin(t * 0.04) * 3, burn ? '#ff8030' : ph === 2 ? '#ff5a6a' : '#5a9ae0'); bx.globalAlpha = 0.1 * fade; fxDisc(cx, cy, 70, burn ? '#ffd040' : '#a8ecff'); bx.globalAlpha = fade;
  bx.drawImage(fr, Math.round(cx - fr.width / 2), Math.round(cy - fr.height / 2));
  const L = '[ÍNDICE]';
  for (let i = 0; i < L.length; i++) { const a = t * 0.025 + i / L.length * Math.PI * 2; txt(L[i], cx + Math.cos(a) * 70 - 3, cy + Math.sin(a) * 44 - 6, { col: burn ? '#ffb040' : '#8fe3ff', alpha: 0.75 * fade }); }
  if (e.flash > 0 && e.flash % 4 < 2) { bx.globalAlpha = 0.5; bx.drawImage(silhouette(fr, '#ffffff'), Math.round(cx - fr.width / 2), Math.round(cy - fr.height / 2)); }
  bx.restore();
}; }
