/* ==========================================================================
   CORE: SFX ENGINE - Web Audio API dengan cadangan HTMLAudio
   Latensi rendah untuk suara navigasi menu.
   ========================================================================== */
const SFX_FILES = {
  nav: "assets/sfx/navigation.wav",
  close: "assets/sfx/close-menu.mp3",
  start: "assets/sfx/menu-utama.mp3"
};

const Sfx = (() => {
  let ctx = null;
  const buffers = { nav: null, close: null, start: null };
  const pools = { nav: [], close: [], start: [] };
  const poolIdx = { nav: 0, close: 0, start: 0 };
  const volumes = { nav: 0.6, close: 0.75, start: 0.95 };
  let startPlayed = false;

  function getCtx() {
    if (!ctx) {
      const Klass = window.AudioContext || window.webkitAudioContext;
      if (Klass) ctx = new Klass({ latencyHint: "interactive" });
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  // Siapkan elemen audio cadangan
  Object.keys(SFX_FILES).forEach((key) => {
    for (let i = 0; i < 2; i++) {
      const a = new Audio(SFX_FILES[key]);
      a.preload = "auto";
      a.volume = volumes[key];
      pools[key].push(a);
    }
  });

  // Decode buffer di latar belakang (butuh http/Live Server, bila gagal otomatis pakai cadangan)
  async function loadBuffers() {
    if (location.protocol === "file:") return; // fetch tidak boleh lewat file://, pakai HTMLAudio saja
    try {
      const keys = Object.keys(SFX_FILES);
      const responses = await Promise.all(keys.map((k) => fetch(SFX_FILES[k])));
      const c = getCtx();
      if (!c) return;
      for (let i = 0; i < keys.length; i++) {
        if (!responses[i].ok || buffers[keys[i]]) continue;
        const data = await responses[i].arrayBuffer();
        buffers[keys[i]] = await c.decodeAudioData(data);
      }
    } catch (_) {}
  }

  function play(key) {
    const volume = volumes[key];
    const c = getCtx();
    if (c && c.state === "running" && buffers[key]) {
      try {
        const source = c.createBufferSource();
        const gain = c.createGain();
        gain.gain.value = volume;
        source.buffer = buffers[key];
        source.connect(gain);
        gain.connect(c.destination);
        source.start(0);
        return true;
      } catch (_) {}
    }
    const pool = pools[key];
    try {
      const sound = pool[poolIdx[key]];
      sound.currentTime = 0;
      sound.volume = volume;
      const p = sound.play();
      if (p !== undefined) p.catch(() => {});
      poolIdx[key] = (poolIdx[key] + 1) % pool.length;
      return true;
    } catch (_) {}
    return false;
  }

  // Buka kunci audio pada gestur pertama pengguna
  async function unlock() {
    const c = getCtx();
    if (!c) return;
    if (c.state !== "running") { try { await c.resume(); } catch (_) {} }
    try {
      const b = c.createBuffer(1, 1, 22050);
      const s = c.createBufferSource();
      s.buffer = b;
      s.connect(c.destination);
      s.start(0);
    } catch (_) {}
  }
  ["pointerdown", "mousedown", "touchstart", "click", "keydown"].forEach((evt) => {
    window.addEventListener(evt, unlock, { capture: true, passive: true });
  });

  return {
    load: loadBuffers,
    nav()   { if (Settings.sfx && Boot.started) play("nav"); },
    close() { if (Settings.sfx) play("close"); },
    start() {
      if (!Settings.sfx || startPlayed) return;
      startPlayed = true;
      play("start");
    },
    // dipakai halaman SYSTEM untuk memberi umpan balik ketika SFX baru dinyalakan
    preview() { play("nav"); }
  };
})();
