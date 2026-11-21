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
