// ================= ÁUDIO (chiptune gerado em código) =================
const AU = { ctx: null, master: null, music: null, sfx: null, muted: false, cur: null, curName: null, timer: null, pulse: {}, noise: null, jingleUntil: 0 };
try { AU.muted = localStorage.getItem('rcb_mute') === '1'; } catch (e) { }

function unlockAudio() {
  try {
    if (!AU.ctx) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      const ctx = AU.ctx = new C();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000;
      AU.master = ctx.createGain(); AU.master.gain.value = AU.muted ? 0 : 0.8;
      AU.music = ctx.createGain(); AU.music.gain.value = 0.55;
      AU.sfx = ctx.createGain(); AU.sfx.gain.value = 0.6;
      AU.music.connect(lp); AU.sfx.connect(lp); lp.connect(AU.master); AU.master.connect(ctx.destination);
      for (const d of [0.125, 0.25]) {
        const n = 32, re = new Float32Array(n), im = new Float32Array(n);
        for (let i = 1; i < n; i++) re[i] = 2 / (i * Math.PI) * Math.sin(i * Math.PI * d);
        AU.pulse[d] = ctx.createPeriodicWave(re, im);
      }
      const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      AU.noise = buf;
      if (AU.pending) { const p = AU.pending; AU.pending = null; AU.curName = null; playMusic(p); }
    }
    if (AU.ctx.state === 'suspended') AU.ctx.resume();
  } catch (e) { }
}
function setMuted(m) {
  AU.muted = m; try { localStorage.setItem('rcb_mute', m ? '1' : '0'); } catch (e) { }
  if (AU.master) AU.master.gain.setTargetAtTime(m ? 0 : 0.8, AU.ctx.currentTime, 0.05);
}
const NOTE_I = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function midi(n) { const m = /^([A-G])([#b]?)(-?\d)$/.exec(n); if (!m) return null; return 12 * (+m[3] + 1) + NOTE_I[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); }
function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

function tone(t, f, dur, opt = {}) {
  const ctx = AU.ctx, o = ctx.createOscillator(), g = ctx.createGain();
  if (opt.wave && AU.pulse[opt.wave]) o.setPeriodicWave(AU.pulse[opt.wave]); else o.type = opt.wave || 'square';
  o.frequency.setValueAtTime(f, t);
  if (opt.slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, opt.slide), t + dur);
  if (opt.vib && dur > 0.3) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = f * 0.012; l.connect(lg); lg.connect(o.frequency); l.start(t + 0.15); l.stop(t + dur + 0.1); }
  const v = opt.vol ?? 0.1, a = opt.att ?? 0.004, rel = opt.rel ?? 0.05;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a);
  g.gain.setTargetAtTime(v * (opt.sus ?? 0.7), t + a, opt.dec ?? 0.08);
  g.gain.setValueAtTime(v * (opt.sus ?? 0.7), t + Math.max(a, dur - rel)); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g); g.connect(opt.out || AU.music); o.start(t); o.stop(t + dur + 0.02);
}
function noiseHit(t, dur, opt = {}) {
  const ctx = AU.ctx, s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  s.buffer = AU.noise; f.type = opt.type || 'highpass'; f.frequency.value = opt.freq || 2000; if (opt.q) f.Q.value = opt.q;
  if (opt.sweep) f.frequency.exponentialRampToValueAtTime(opt.sweep, t + dur);
  const v = opt.vol ?? 0.1; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(f); f.connect(g); g.connect(opt.out || AU.music); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}
function kick(t, out) { const ctx = AU.ctx, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15); o.connect(g); g.connect(out || AU.music); o.start(t); o.stop(t + 0.16); }

const CHORD_Q = { '': [0, 4, 7], 'm': [0, 3, 7], 'dim': [0, 3, 6], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'sus': [0, 5, 7] };
function chord(name) { const m = /^([A-G][#b]?)(.*)$/.exec(name); return { root: midi(m[1] + '3') % 12, q: CHORD_Q[m[2]] || CHORD_Q[''] }; }

function compile(T) {
  const steps = T.bars * 16, ev = [];
  const chords = T.chords.split(/\s+/).map(chord);
  const parseLine = (s, ch, opt) => {
    let t = 0;
    for (const tok of s.replace(/\|/g, ' ').split(/\s+/).filter(Boolean)) {
      const [n, l] = tok.split(':'); const len = +(l || 1);
      if (n !== '.') { const m = midi(n); if (m != null) ev.push({ t, len, m, ch, ...opt }); }
      t += len;
    }
  };
  if (T.lead) parseLine(T.lead, 'lead');
  if (T.lead2) parseLine(T.lead2, 'lead2');
  chords.forEach((c, bar) => {
    const b0 = bar * 16, r2 = 36 + c.root + (c.root > 7 ? -12 : 0) + 12;
    const fifth = r2 + 7;
    switch (T.bass) {
      case 'whole': ev.push({ t: b0, len: 16, m: r2, ch: 'bass' }); break;
      case 'root5': ev.push({ t: b0, len: 8, m: r2, ch: 'bass' }, { t: b0 + 8, len: 8, m: fifth > r2 + 7 ? fifth - 12 : fifth, ch: 'bass' }); break;
      case 'oct8': for (let i = 0; i < 16; i += 2) ev.push({ t: b0 + i, len: 2, m: r2 + ((i / 2) % 2 ? 12 : 0), ch: 'bass' }); break;
      case 'pulse': for (let i = 0; i < 16; i += 4) ev.push({ t: b0 + i, len: 3, m: r2, ch: 'bass' }); break;
      case 'walk': [0, 4, 8, 12].forEach((i, k) => ev.push({ t: b0 + i, len: 4, m: r2 + [0, 7, 12, 7][k], ch: 'bass' })); break;
    }
    if (T.arp) {
      const tones = [...c.q, 12].map(x => 60 + c.root + x + (T.arp.oct || 0) * 12 - (c.root > 5 ? 12 : 0));
      const pat = T.arp.pat || [0, 1, 2, 3, 2, 1];
      for (let i = 0, k = 0; i < 16; i += T.arp.rate, k++) ev.push({ t: b0 + i, len: T.arp.rate, m: tones[pat[k % pat.length]], ch: 'arp' });
    }
    if (T.pad) ev.push({ t: b0, len: 16, m: 60 + c.root + c.q[1] - (c.root > 5 ? 12 : 0), ch: 'pad' });
    if (T.drums) for (let i = 0; i < 16; i++) { const d = T.drums[i % T.drums.length]; if (d !== '.') ev.push({ t: b0 + i, len: 1, d, ch: 'drum' }); }
  });
  ev.sort((a, b) => a.t - b.t);
  return { ...T, steps, ev };
}

function playMusic(name) {
  if (AU.curName === name) return;
  AU.curName = name;
  if (!AU.ctx) { AU.pending = name; return; }
  stopMusicNodes();
  if (!name || !TRACKS[name]) { AU.cur = null; return; }
  const tr = TRACKS[name]._c || (TRACKS[name]._c = compile(TRACKS[name]));
  const out = AU.ctx.createGain(); out.gain.value = 0; out.connect(AU.music);
  out.gain.linearRampToValueAtTime(1, AU.ctx.currentTime + 0.4);
  AU.cur = { tr, out, step: 0, next: AU.ctx.currentTime + 0.1, idx: 0 };
  clearInterval(AU.timer); AU.timer = setInterval(schedule, 25); schedule();
}
function stopMusicNodes() {
  if (AU.cur) { const o = AU.cur.out; try { o.gain.cancelScheduledValues(AU.ctx.currentTime); o.gain.setTargetAtTime(0, AU.ctx.currentTime, 0.08); setTimeout(() => o.disconnect(), 600); } catch (e) { } }
  AU.cur = null;
}
function schedule() {
  const c = AU.cur; if (!c || !AU.ctx) return;
  const tr = c.tr, sp = 60 / tr.bpm / 4;
  while (c.next < AU.ctx.currentTime + 0.15) {
    if (AU.ctx.currentTime < AU.jingleUntil) { c.next += sp; c.step = (c.step + 1) % tr.steps; continue; }
    for (const e of tr.ev) {
      if (e.t !== c.step) continue;
      const t = c.next, d = e.len * sp;
      if (e.ch === 'lead') tone(t, hz(e.m), d * 0.95, { wave: tr.leadWave || 0.25, vol: tr.leadVol ?? 0.07, out: c.out, vib: true, sus: 0.6 });
      else if (e.ch === 'lead2') tone(t, hz(e.m), d * 0.9, { wave: tr.lead2Wave || 'triangle', vol: tr.lead2Vol ?? 0.06, out: c.out });
      else if (e.ch === 'bass') tone(t, hz(e.m), d * 0.92, { wave: 'triangle', vol: tr.bassVol ?? 0.16, out: c.out, sus: 0.9 });
      else if (e.ch === 'arp') tone(t, hz(e.m), d * 0.7, { wave: tr.arp.wave || 0.125, vol: tr.arp.vol ?? 0.025, out: c.out, sus: 0.4, dec: 0.05 });
      else if (e.ch === 'pad') tone(t, hz(e.m), d, { wave: 'triangle', vol: tr.padVol ?? 0.03, out: c.out, att: 0.3, rel: 0.4, sus: 1 });
      else if (e.ch === 'drum') {
        if (e.d === 'k') kick(t, c.out);
        else if (e.d === 's') noiseHit(t, 0.12, { freq: 1200, vol: 0.12, out: c.out });
        else if (e.d === 'h') noiseHit(t, 0.035, { freq: 7000, vol: tr.hatVol ?? 0.05, out: c.out });
      }
    }
    c.next += sp; c.step = (c.step + 1) % tr.steps;
  }
}
function jingle(notes, bpm = 180, opt = {}) {
  if (!AU.ctx) return;
  const sp = 60 / bpm / 4; let t = AU.ctx.currentTime + 0.03, total = 0;
  for (const tok of notes.split(/\s+/)) {
    const [n, l] = tok.split(':'); const len = +(l || 1);
    for (const nn of n.split('+')) { const m = midi(nn); if (m != null) tone(t, hz(m), len * sp * 0.95, { wave: opt.wave || 0.25, vol: opt.vol || 0.09, out: AU.sfx, sus: 0.6 }); }
    t += len * sp; total += len * sp;
  }
  if (opt.duck !== false) AU.jingleUntil = AU.ctx.currentTime + total + 0.05;
}
// ---- efeitos ----
function sfx(name, p = 0) {
  if (!AU.ctx || AU.muted) return;
  const t = AU.ctx.currentTime + 0.005, o = AU.sfx;
  switch (name) {
    case 'blip': tone(t, p || 520, 0.04, { wave: 0.25, vol: 0.05, out: o, sus: 1 }); break;
    case 'blipLow': tone(t, p || 180, 0.05, { wave: 'sawtooth', vol: 0.05, out: o, sus: 1 }); break;
    case 'blipTri': tone(t, p || 880, 0.05, { wave: 'triangle', vol: 0.09, out: o, sus: 1 }); break;
    case 'move': tone(t, 660, 0.03, { wave: 0.25, vol: 0.05, out: o }); break;
    case 'select': tone(t, 880, 0.04, { wave: 0.25, vol: 0.06, out: o }); tone(t + 0.04, 1320, 0.05, { wave: 0.25, vol: 0.05, out: o }); break;
    case 'cancel': tone(t, 440, 0.05, { wave: 0.25, vol: 0.05, out: o, slide: 220 }); break;
    case 'bump': tone(t, 90, 0.05, { wave: 'triangle', vol: 0.12, out: o }); break;
    case 'step': noiseHit(t, 0.02, { freq: 3000, vol: 0.015, out: o }); break;
    case 'hit': noiseHit(t, 0.15, { freq: 800, vol: 0.2, out: o, type: 'lowpass', sweep: 200 }); tone(t, 320, 0.12, { wave: 'square', vol: 0.06, out: o, slide: 70 }); break;
    case 'bite': noiseHit(t, 0.06, { freq: 1800, vol: 0.18, out: o, type: 'bandpass', q: 2 }); noiseHit(t + 0.08, 0.08, { freq: 1200, vol: 0.2, out: o, type: 'bandpass', q: 2 }); break;
    case 'crit': sfx('hit'); tone(t + 0.02, 1760, 0.12, { wave: 0.125, vol: 0.06, out: o }); tone(t + 0.08, 2640, 0.15, { wave: 0.125, vol: 0.05, out: o }); break;
    case 'miss': tone(t, 600, 0.12, { wave: 'triangle', vol: 0.06, out: o, slide: 300 }); break;
    case 'hurt': tone(t, 220, 0.2, { wave: 'square', vol: 0.09, out: o, slide: 55 }); noiseHit(t, 0.12, { freq: 600, vol: 0.12, out: o, type: 'lowpass' }); break;
    case 'guard': tone(t, 1200, 0.15, { wave: 0.125, vol: 0.07, out: o }); tone(t, 1800, 0.2, { wave: 'triangle', vol: 0.06, out: o }); break;
    case 'brasa': noiseHit(t, 0.4, { freq: 300, vol: 0.18, out: o, type: 'lowpass', sweep: 3000 }); tone(t, 200, 0.3, { wave: 'sawtooth', vol: 0.05, out: o, slide: 600 }); break;
    case 'geada': [0, 1, 2, 3, 4].forEach(i => tone(t + i * 0.04, 1400 + i * 300, 0.08, { wave: 'triangle', vol: 0.06, out: o })); noiseHit(t, 0.3, { freq: 6000, vol: 0.05, out: o }); break;
    case 'seiva': [523, 659, 784, 1046].forEach((f, i) => tone(t + i * 0.06, f, 0.14, { wave: 'sine', vol: 0.09, out: o })); break;
    case 'heal': [523, 659, 784, 1046, 1318].forEach((f, i) => tone(t + i * 0.05, f, 0.12, { wave: 'triangle', vol: 0.09, out: o })); break;
    case 'buff': [392, 523, 659].forEach((f, i) => tone(t + i * 0.06, f, 0.15, { wave: 0.25, vol: 0.06, out: o })); break;
    case 'rune': noiseHit(t, 0.08, { freq: 1500, vol: 0.2, out: o, type: 'bandpass' }); [784, 988, 1175, 1568].forEach((f, i) => tone(t + 0.12 + i * 0.07, f, 0.18, { wave: 'triangle', vol: 0.08, out: o })); break;
    case 'item': [880, 1175, 1568].forEach((f, i) => tone(t + i * 0.05, f, 0.1, { wave: 0.25, vol: 0.06, out: o })); break;
    case 'save': [659, 784, 988, 1318].forEach((f, i) => tone(t + i * 0.09, f, 0.3, { wave: 'triangle', vol: 0.08, out: o })); break;
    case 'encounter': [1760, 1320, 880].forEach((f, i) => tone(t + i * 0.05, f, 0.06, { wave: 0.25, vol: 0.08, out: o })); break;
    case 'flee': [880, 660, 440, 330].forEach((f, i) => tone(t + i * 0.04, f, 0.05, { wave: 0.25, vol: 0.06, out: o })); break;
    case 'die': [440, 415, 392, 370, 349].forEach((f, i) => tone(t + i * 0.12, f, 0.14, { wave: 0.25, vol: 0.07, out: o })); break;
    case 'rumble': noiseHit(t, 1.2, { freq: 120, vol: 0.3, out: o, type: 'lowpass' }); break;
    case 'gate': noiseHit(t, 0.8, { freq: 400, vol: 0.2, out: o, type: 'lowpass', sweep: 100 }); [196, 247, 294, 392].forEach((f, i) => tone(t + 0.3 + i * 0.1, f, 0.3, { wave: 'triangle', vol: 0.08, out: o })); break;
    case 'catalog': tone(t, 1046, 0.05, { wave: 0.125, vol: 0.05, out: o }); tone(t + 0.06, 1568, 0.08, { wave: 0.125, vol: 0.05, out: o }); break;
  }
}
const J = {
  victory: () => jingle('C5:2 E5:2 G5:2 C6:4 G5:2 C6:8', 200),
  level: () => jingle('G4:1 C5:1 E5:1 G5:1 C6:2 E5+G5+C6:8', 220, { wave: 0.125 }),
  evolve: () => jingle('C4:2 G4:2 C5:2 E5:2 G5:2 C6:2 B5:2 G5:2 D5+G5+B5:4 E5+G5+C6:12', 170, { wave: 0.25, vol: 0.08 }),
  gameover: () => jingle('E5:4 D5:4 C5:4 B4:4 A4:12', 120, { wave: 'triangle', vol: 0.1 }),
  rune: () => jingle('E5:1 G5:1 B5:1 E6:4', 240, { wave: 0.125, vol: 0.06 })
};

// ---- TRILHA SONORA ----
const TRACKS = {
  title: {
    bpm: 84, bars: 8, chords: 'F C Dm Bb F C Bb C', bass: 'root5', bassVol: 0.13,
    lead: 'A4:4 C5:4 F5:6 E5:2 | E5:4 D5:4 C5:8 | D5:4 F5:4 A5:4 G5:2 F5:2 | F5:8 D5:8 | A5:4 G5:2 F5:2 C5:8 | G5:4 F5:2 E5:2 C5:8 | D5:4 F5:4 Bb5:4 A5:4 | G5:12 .:4',
    leadWave: 'triangle', leadVol: 0.11, arp: { rate: 2, vol: 0.022, oct: 0 }, padVol: 0.02, pad: true
  },
  despertar: {
    bpm: 70, bars: 4, chords: 'Am F C E', bass: 'whole', bassVol: 0.1,
    lead: 'E5:8 C5:8 | A4:12 .:4 | G4:4 C5:4 E5:8 | G#4:12 .:4', leadWave: 'triangle', leadVol: 0.07, arp: { rate: 4, vol: 0.02, pat: [0, 2, 1, 3] }, pad: true, padVol: 0.02
  },
  galeria: {
    bpm: 96, bars: 8, chords: 'Am F G E Am F Dm E', bass: 'root5', bassVol: 0.14,
    lead: 'E5:4 A4:2 C5:2 B4:4 A4:4 | C5:6 B4:2 A4:4 F4:4 | G4:4 B4:2 D5:2 C5:4 B4:4 | G#4:6 A4:2 B4:8 | E5:4 A5:4 G5:2 E5:2 C5:4 | D5:4 C5:4 A4:8 | F5:4 E5:4 D5:4 C5:4 | B4:8 G#4:4 E4:4',
    leadVol: 0.06, arp: { rate: 2, vol: 0.022 }, drums: '..h...h...h...h.', hatVol: 0.03
  },
  biblioteca: {
    bpm: 80, bars: 8, chords: 'Dm Bb F C Dm Bb Gm A', bass: 'whole', bassVol: 0.12,
    lead: 'A5:4 F5:4 D5:4 F5:4 | G5:6 F5:2 D5:8 | C5:4 F5:4 A5:4 G5:4 | E5:12 .:4 | A5:4 Bb5:4 A5:4 F5:4 | D5:6 E5:2 F5:8 | G5:4 F5:4 E5:4 D5:4 | C#5:8 E5:4 A4:4',
    leadWave: 'triangle', leadVol: 0.1, arp: { rate: 2, vol: 0.02, wave: 'triangle', pat: [0, 2, 3, 2] }, pad: true, padVol: 0.02
  },
  poco: {
    bpm: 100, bars: 8, chords: 'Em D C B Em D C B', bass: 'root5', bassVol: 0.12,
    lead: 'B4:8 G5:8 | F#5:8 A5:4 F#5:4 | E5:8 G5:4 E5:4 | D#5:12 .:4 | E5:4 G5:4 B5:8 | A5:4 F#5:4 D5:8 | C5:4 E5:4 G5:4 B5:4 | B5:8 F#5:8',
    leadWave: 0.125, leadVol: 0.05, arp: { rate: 1, vol: 0.02, pat: [0, 1, 2, 3, 2, 1, 2, 3] }, drums: 'h.......h.h.....', hatVol: 0.025
  },
  battle: {
    bpm: 150, bars: 8, chords: 'Em C D B Em C Am B', bass: 'oct8', bassVol: 0.16,
    lead: 'E5:2 E5:2 G5:2 E5:2 B5:3 A5:1 G5:2 F#5:2 | E5:2 G5:2 C6:4 B5:2 A5:2 G5:4 | F#5:2 A5:2 D6:4 C6:2 B5:2 A5:4 | D#5:4 F#5:4 B5:6 .:2 | B5:2 A5:2 G5:2 F#5:2 E5:4 G5:4 | A5:4 G5:2 E5:2 C5:8 | C6:4 B5:2 A5:2 E5:4 A5:4 | F#5:4 D#5:4 B4:8',
    leadVol: 0.07, arp: { rate: 1, vol: 0.015, pat: [0, 1, 2, 1] }, drums: 'k.h.s.h.k.k.s.h.', hatVol: 0.04
  },
  boss: {
    bpm: 164, bars: 8, chords: 'Dm Bb Gm A Dm Bb C A', bass: 'oct8', bassVol: 0.18,
    lead: 'D5:2 .:1 D5:1 A5:4 F5:2 E5:2 D5:4 | D5:2 F5:2 Bb5:4 A5:2 G5:2 F5:4 | G5:3 F5:1 E5:2 D5:2 Bb4:4 G4:4 | C#5:4 E5:4 A5:8 | A5:2 G5:2 F5:2 E5:2 D5:4 F5:4 | G5:4 F5:2 D5:2 Bb4:8 | E5:4 G5:4 C6:4 Bb5:4 | A5:6 G#5:2 A5:4 E5:4',
    leadVol: 0.075, lead2: 'D4:4 F4:4 A4:4 F4:4 | Bb3:4 D4:4 F4:4 D4:4 | G3:4 Bb3:4 D4:4 Bb3:4 | A3:4 C#4:4 E4:4 C#4:4 | D4:4 F4:4 A4:4 F4:4 | Bb3:4 D4:4 F4:4 D4:4 | C4:4 E4:4 G4:4 E4:4 | A3:4 C#4:4 E4:4 A4:4',
    lead2Wave: 0.125, lead2Vol: 0.03, drums: 'k.hsk.hsk.hsk.ss', hatVol: 0.04
  },
  ending: {
    bpm: 76, bars: 8, chords: 'F Am Bb C F Am Bb C', bass: 'root5', bassVol: 0.12,
    lead: 'C5:4 F5:4 A5:8 | G5:4 E5:4 C5:8 | D5:4 F5:4 Bb5:6 A5:2 | G5:16 | A5:4 C6:4 A5:8 | G5:4 E5:4 C5:8 | Bb4:4 D5:4 F5:4 A5:4 | G5:12 .:4',
    leadWave: 'triangle', leadVol: 0.11, arp: { rate: 2, vol: 0.022 }, pad: true, padVol: 0.025
  }
};
