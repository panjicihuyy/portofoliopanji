/* ==========================================================================
   CORE: MUSIC PLAYER - memutar OST, fade in/out, lanjut otomatis ke lagu berikutnya
   Event: Music.onChange(cb) dipanggil saat lagu / status putar berubah.
   ========================================================================== */
const Music = (() => {
  const audio = new Audio();
  audio.preload = "auto";
  audio.volume = 0;

  const TARGET_VOLUME = 0.5;
  let index = Math.floor(Math.random() * TRACKS.length);
  let playing = false;
  let fadeTimer = null;
  const listeners = [];

  function emit() { listeners.forEach((cb) => cb(state())); }

  function state() {
    return { index, track: TRACKS[index], playing };
  }

  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    const from = audio.volume;
    const start = performance.now();
    fadeTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
      if (t >= 1) {
        clearInterval(fadeTimer);
        if (done) done();
      }
    }, 40);
  }

  function setTrack(i) {
    index = (i + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[index].file;
    audio.load();
  }

  function play() {
    if (!Settings.music) return;
    if (!audio.src) setTrack(index);
    const p = audio.play();
    const onStart = () => {
      playing = true;
      fadeTo(TARGET_VOLUME, 900);
      emit();
    };
    if (p !== undefined) p.then(onStart).catch(() => { playing = false; emit(); });
    else onStart();
  }

  function pause() {
    fadeTo(0, 400, () => {
      audio.pause();
      playing = false;
      emit();
    });
  }

  audio.addEventListener("ended", () => { setTrack(index + 1); play(); });
  audio.addEventListener("error", () => {
    // file hilang atau tidak bisa diputar: lewati ke lagu berikutnya, berhenti setelah satu putaran penuh
    skipErrors += 1;
    if (skipErrors < TRACKS.length) { setTrack(index + 1); play(); }
    else { playing = false; emit(); }
  });
  audio.addEventListener("playing", () => { skipErrors = 0; });
  let skipErrors = 0;

  return {
    onChange(cb) { listeners.push(cb); cb(state()); },
    get state() { return state(); },
    start() { if (Settings.music) play(); },
    setEnabled(on) {
      Settings.set("music", on);
      if (on) play(); else pause();
    },
    toggle() { this.setEnabled(!Settings.music); },
    next() { setTrack(index + 1); if (Settings.music) play(); else emit(); },
    prev() { setTrack(index - 1); if (Settings.music) play(); else emit(); },
    select(i) {
      if (i === index && playing) return;
      setTrack(i);
      Settings.set("music", true);
      play();
    }
  };
})();
