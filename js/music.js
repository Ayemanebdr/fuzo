// Musique d'ambiance générée en direct (WebAudio) : une humeur par univers, douce et en boucle.
const N = n => 440 * Math.pow(2, (n - 69) / 12);
// accords en notes MIDI ; arp = motif d'arpège (indices dans l'accord, -1 = silence)
const MOODS = {
  home:   { bpm: 92,  chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], arp: [0, 2, 1, 3, 2, -1, 1, -1], oct: 12, kick: false, wave: 'triangle' },
  tele:   { bpm: 68,  chords: [[57, 60, 64, 71], [53, 57, 60, 67], [48, 52, 55, 62], [55, 59, 62, 66]], arp: [0, -1, 3, -1, 2, -1, -1, 1], oct: 24, kick: false, wave: 'sine' },
  dev:    { bpm: 80,  chords: [[50, 53, 57, 60], [55, 59, 62, 65], [50, 53, 57, 62], [48, 52, 55, 59]], arp: [0, 1, 2, -1, 3, 2, 1, -1], oct: 12, kick: false, wave: 'triangle' },
  cq:     { bpm: 104, chords: [[53, 57, 60, 64], [50, 53, 57, 60], [58, 62, 65, 69], [48, 52, 55, 58]], arp: [0, 2, 3, 2, 1, 2, 3, -1], oct: 12, kick: true, wave: 'square' },
  mot:    { bpm: 76,  chords: [[55, 59, 62, 66], [52, 55, 59, 62], [48, 52, 55, 59], [50, 54, 57, 60]], arp: [0, -1, 2, -1, 1, -1, 3, -1], oct: 12, kick: false, wave: 'sine' },
  ut:     { bpm: 112, chords: [[52, 55, 59, 62], [48, 52, 55, 59], [55, 59, 62, 66], [50, 54, 57, 60]], arp: [0, 1, 2, 1, 3, 1, 2, 1], oct: 12, kick: true, wave: 'triangle' },
  p4:     { bpm: 116, chords: [[58, 62, 65, 69], [55, 58, 62, 65], [51, 55, 58, 62], [53, 57, 60, 63]], arp: [0, 2, 1, 2, 3, 2, 1, 2], oct: 12, kick: true, wave: 'square' },
  quiz:   { bpm: 120, chords: [[60, 64, 67, 72], [57, 60, 64, 69], [62, 65, 69, 74], [55, 59, 62, 67]], arp: [0, 2, 1, 3, 0, 2, 1, 3], oct: 12, kick: true, wave: 'triangle' },
  mens:   { bpm: 88,  chords: [[57, 60, 64, 67], [53, 57, 60, 64], [52, 56, 59, 62], [57, 60, 64, 69]], arp: [0, -1, 2, 1, -1, 3, -1, 2], oct: 12, kick: false, wave: 'triangle' },
  nav:    { bpm: 96,  chords: [[50, 53, 57, 62], [48, 52, 55, 60], [46, 50, 53, 58], [45, 49, 52, 57]], arp: [0, 1, 2, 3, 2, 1, -1, -1], oct: 12, kick: true, wave: 'sine' },
  interdit:{ bpm: 126, chords: [[52, 56, 59, 64], [57, 61, 64, 69], [54, 57, 61, 66], [59, 63, 66, 71]], arp: [0, 2, 3, 2, 0, 2, 3, 1], oct: 12, kick: true, wave: 'square' },
  bac:    { bpm: 132, chords: [[60, 64, 67, 71], [62, 65, 69, 72], [64, 67, 71, 74], [65, 69, 72, 76]], arp: [0, 1, 2, 1, 3, 1, 2, 1], oct: 0, kick: true, wave: 'triangle' },
  hist:   { bpm: 72,  chords: [[53, 57, 60, 65], [50, 53, 57, 62], [55, 58, 62, 67], [48, 52, 55, 60]], arp: [0, -1, 1, 2, -1, 3, 2, -1], oct: 12, kick: false, wave: 'sine' },
  photo:  { bpm: 100, chords: [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 68]], arp: [3, 2, 0, 2, 1, -1, 2, -1], oct: 0, kick: false, wave: 'triangle' },
  cartes: { bpm: 84,  chords: [[60, 64, 67, 71], [62, 65, 69, 72], [55, 59, 62, 65], [57, 60, 64, 67]], arp: [3, -1, 2, 1, -1, 0, 2, -1], oct: 0, kick: false, wave: 'sine' },
};

export function makeMusic(getCtx, getOut) {
  let mood = null, timer = null, step = 0, nextT = 0, bus = null;
  const pad = (ctx, t, notes, dur) => {
    const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + dur * .35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    f.connect(g); g.connect(bus);
    for (const n of notes) for (const det of [-6, 6]) { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = N(n - 12); o.detune.value = det; o.connect(f); o.start(t); o.stop(t + dur + .05); }
  };
  const pluck = (ctx, t, n, wave) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400;
    o.type = wave; o.frequency.value = N(n); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(wave === 'square' ? .022 : .05, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + .45);
    o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + .5);
  };
  const kick = (ctx, t) => {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + .12);
    g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .18); o.connect(g); g.connect(bus); o.start(t); o.stop(t + .2);
  };
  function schedule() {
    const ctx = getCtx(); if (!ctx || !mood) return;
    const M = MOODS[mood]; const eighth = 60 / M.bpm / 2;
    while (nextT < ctx.currentTime + .25) {
      const bar = Math.floor(step / 8) % M.chords.length, s = step % 8, ch = M.chords[bar];
      if (s === 0) pad(ctx, nextT, ch, eighth * 8.2);
      const a = M.arp[s]; if (a >= 0) pluck(ctx, nextT, ch[a] + M.oct, M.wave);
      if (M.kick && (s === 0 || s === 4)) kick(ctx, nextT);
      nextT += eighth; step++;
    }
  }
  return {
    set(m) {
      const ctx = getCtx(); const want = m && MOODS[m] ? m : null;
      if (want === mood) return; mood = want;
      if (timer) { clearInterval(timer); timer = null; }
      if (bus) { const old = bus; try { old.gain.setTargetAtTime(0.0001, ctx.currentTime, .4); } catch (e) { } setTimeout(() => { try { old.disconnect(); } catch (e) { } }, 1500); bus = null; }
      if (!mood || !ctx) return;
      bus = ctx.createGain(); bus.gain.setValueAtTime(0.0001, ctx.currentTime); bus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.2); bus.connect(getOut());
      step = 0; nextT = ctx.currentTime + .1; schedule(); timer = setInterval(schedule, 90);
    },
    current: () => mood,
  };
}
