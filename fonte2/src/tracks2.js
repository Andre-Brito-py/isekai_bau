// ================= TRILHAS NOVAS DA TEMPORADA 2 =================
// estrada2: a descida da serra (sol, poeira, baião); luta2: batalha comum; pedagio: o Espantalho do Pedágio.
Object.assign(TRACKS, {
  estrada2: {
    bpm: 96, bars: 8, chords: 'G D Em C G D C D', bass: 'root5', bassVol: 0.13,
    lead: 'B4:2 D5:2 G5:4 F#5:2 E5:2 D5:4 | A4:2 D5:2 F#5:4 E5:2 D5:2 A4:4 | B4:2 E5:2 G5:4 A5:2 G5:2 E5:4 | C5:4 E5:2 G5:2 E5:8 | D5:2 G5:2 B5:4 A5:2 G5:2 D5:4 | F#5:2 A5:2 D6:4 C6:2 A5:2 F#5:4 | E5:4 G5:2 C6:2 B5:4 A5:4 | A5:8 F#5:4 D5:4',
    leadWave: 'triangle', leadVol: 0.1, arp: { rate: 2, vol: 0.018, oct: 0 }, drums: 'k..hk.s.k..hk.s.', hatVol: 0.03
  },
  luta2: {
    bpm: 168, bars: 8, chords: 'Am F G E Am F Dm E', bass: 'oct8', bassVol: 0.16,
    lead: 'A5:2 E5:2 A5:2 C6:2 B5:3 A5:1 G5:2 E5:2 | F5:2 A5:2 C6:4 B5:2 A5:2 F5:4 | G5:2 B5:2 D6:4 C6:2 B5:2 G5:4 | G#5:4 B5:4 E6:6 .:2 | A5:2 C6:2 E6:4 D6:2 C6:2 A5:4 | F5:2 A5:2 C6:2 A5:2 F5:8 | D5:2 F5:2 A5:2 D6:2 C6:4 A5:4 | B5:4 G#5:4 E5:8',
    leadVol: 0.07, arp: { rate: 1, vol: 0.016, pat: [0, 1, 2, 1] }, drums: 'k.h.s.hkk.h.s.hs', hatVol: 0.04
  },
  pedagio: {
    bpm: 150, bars: 8, chords: 'Dm Dm Bb A Dm Gm A A', bass: 'oct8', bassVol: 0.18,
    lead: 'D5:3 D5:1 F5:2 A5:2 G#5:2 A5:2 F5:4 | D5:2 E5:2 F5:2 D5:2 C#5:4 A4:4 | Bb4:2 D5:2 F5:2 Bb5:2 A5:2 G5:2 F5:4 | E5:4 C#5:4 A4:6 .:2 | D6:2 C6:2 A5:2 F5:2 G#5:2 A5:2 D5:4 | G5:2 Bb5:2 D6:2 Bb5:2 A5:2 G5:2 Bb5:4 | A5:2 G5:2 F5:2 E5:2 C#5:4 E5:4 | A5:12 .:4',
    leadVol: 0.075, lead2: 'D4:4 A3:4 D4:4 F4:4 | D4:4 A3:4 D4:4 F4:4 | Bb3:4 F4:4 Bb4:4 F4:4 | A3:4 E4:4 A4:4 E4:4 | D4:4 A3:4 D4:4 F4:4 | G3:4 D4:4 G4:4 D4:4 | A3:4 E4:4 A4:4 E4:4 | A3:4 C#4:4 E4:4 A4:4',
    lead2Wave: 0.125, lead2Vol: 0.028, drums: 'k..sk.s.k..sk.ss', hatVol: 0.04
  }
});

// efeitos sonoros novos da T2 (respingo, porta, equipar)
{ const _sfx = sfx; sfx = function (name, p) {
  if (!AU.ctx || AU.muted) return;
  const t = AU.ctx.currentTime + 0.005, o = AU.sfx;
  if (name === 'splash') { noiseHit(t, 0.18, { vol: 0.12, out: o }); tone(t, 320, 0.08, { wave: 'sine', vol: 0.05, out: o, slide: 120 }); return; }
  if (name === 'door') { tone(t, 180, 0.06, { wave: 0.25, vol: 0.05, out: o }); tone(t + 0.07, 140, 0.08, { wave: 0.25, vol: 0.05, out: o }); return; }
  if (name === 'equip') { tone(t, 660, 0.05, { wave: 0.125, vol: 0.05, out: o }); tone(t + 0.06, 990, 0.08, { wave: 0.125, vol: 0.05, out: o }); return; }
  return _sfx(name, p);
}; }

// ---- Cap. 2: Velhágua (barcarola), Bairro Afogado (eco debaixo d'água) e a Âncora-Mãe (sino e corrente) ----
Object.assign(TRACKS, {
  velhagua: {
    bpm: 104, bars: 8, chords: 'F C Dm Bb F C Bb C', bass: 'root5', bassVol: 0.12,
    lead: 'A4:3 C5:1 F5:4 E5:2 D5:2 C5:4 | G4:3 C5:1 E5:4 D5:2 C5:2 G4:4 | A4:3 D5:1 F5:4 A5:2 G5:2 F5:4 | D5:4 F5:2 D5:2 Bb4:8 | C5:3 F5:1 A5:4 G5:2 F5:2 C5:4 | E5:3 G5:1 C6:4 Bb5:2 A5:2 G5:4 | F5:4 D5:2 F5:2 Bb5:4 A5:4 | G5:8 E5:4 C5:4',
    leadWave: 'triangle', leadVol: 0.09, arp: { rate: 2, vol: 0.016, oct: 0 }, drums: 'k...h.s.k.h.h.s.', hatVol: 0.022
  },
  afogado: {
    bpm: 72, bars: 8, chords: 'Am Am F F Dm Dm E E', bass: 'root5', bassVol: 0.1,
    lead: 'E5:8 .:4 C5:4 | B4:8 A4:8 | C5:6 D5:2 E5:8 | .:16 | D5:6 E5:2 F5:4 A5:4 | G5:8 F5:4 E5:4 | E5:4 D5:4 C5:4 B4:4 | G#4:16',
    leadWave: 'triangle', leadVol: 0.07, lead2: 'A3:8 E4:8 | A3:8 C4:8 | F3:8 C4:8 | F3:8 A3:8 | D3:8 A3:8 | D3:8 F3:8 | E3:8 B3:8 | E3:8 G#3:8',
    lead2Wave: 'sine', lead2Vol: 0.035, arp: { rate: 4, vol: 0.012, oct: 1 }, drums: '................', hatVol: 0
  },
  ancora: {
    bpm: 140, bars: 8, chords: 'Em Em C D Em Em Am B', bass: 'oct8', bassVol: 0.17,
    lead: 'E5:4 B5:4 G5:2 F#5:2 E5:4 | E5:2 F#5:2 G5:2 A5:2 B5:4 E6:4 | C6:4 B5:2 A5:2 G5:4 E5:4 | D5:2 F#5:2 A5:2 D6:2 C6:4 A5:4 | E5:4 B5:4 G5:2 A5:2 B5:4 | G5:2 A5:2 B5:2 E6:2 D6:4 B5:4 | A5:2 C6:2 E6:4 D6:2 C6:2 A5:4 | B5:4 D#6:4 F#6:8',
    leadVol: 0.075, lead2: 'E4:4 B4:4 E5:4 B4:4 | E4:4 B4:4 E5:4 G5:4 | C4:4 G4:4 C5:4 G4:4 | D4:4 A4:4 D5:4 F#5:4 | E4:4 B4:4 E5:4 B4:4 | E4:4 G4:4 B4:4 E5:4 | A3:4 E4:4 A4:4 C5:4 | B3:4 D#4:4 F#4:4 B4:4',
    lead2Wave: 0.125, lead2Vol: 0.03, drums: 'k..sk.s.k.ks..s.', hatVol: 0.04
  }
});
{ const _sfx2 = sfx; sfx = function (name, p) {
  if (name !== 'sino' || !AU.ctx || AU.muted) return _sfx2(name, p);
  const t = AU.ctx.currentTime + 0.005, o = AU.sfx, b = p || 196;
  for (const [k, v, d] of [[1, 0.1, 2.2], [2.4, 0.05, 1.6], [3, 0.04, 1.2], [4.2, 0.025, 0.9]]) tone(t, b * k, d, { wave: 'sine', vol: v, out: o, sus: 0.2, dec: d * 0.8 });
}; }
