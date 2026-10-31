/* ==========================================================================
   CORE: BOOT - layar loading, layar pilihan (gate), lalu masuk ke menu
   Gate dibutuhkan karena browser baru mengizinkan suara setelah ada klik / tombol.
   ========================================================================== */
const Boot = (() => {
  const loadingScreen = document.getElementById("loading-screen");
  const bar = document.getElementById("loading-bar");
  const percent = document.getElementById("loading-percent");
  const gate = document.getElementById("start-gate");
  const gateRows = Array.from(document.querySelectorAll(".gate-row"));
  const gateSelector = document.getElementById("gate-selector");
  const enterBtn = document.getElementById("gate-enter");

  const boot = { started: false, ready: false };
  let progress = 0;
  let target = 8;
  let gateIndex = 0;

  function paint(v) {
    const n = Math.min(100, Math.max(0, Math.round(v)));
    bar.style.width = `${n}%`;
    percent.textContent = `${n}%`;
    loadingScreen.setAttribute("aria-valuenow", n);
  }

  function raise(v) { target = Math.min(100, Math.max(target, Math.round(v))); }

  function ticker() {
    return new Promise((resolve) => {
      (function tick() {
        if (progress < target) {
          progress = Math.min(target, progress + Math.max(1, Math.ceil((target - progress) * 0.3)));
          paint(progress);
        }
        if (progress >= 100) resolve(); else requestAnimationFrame(tick);
      })();
    });
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function videoReady(video, ms) {
    return new Promise((resolve) => {
      if (!video || video.readyState >= 3) return resolve();
      const done = () => resolve();
      video.addEventListener("canplay", done, { once: true });
      video.addEventListener("error", done, { once: true });
      video.preload = "auto";
      video.load();
      setTimeout(done, ms);
    });
  }

  async function run() {
    const done = ticker();
    Background.prepare();
    const introEl = document.getElementById("background-video-intro");
    const awalEl = document.getElementById("awal-bg-video");
    if (awalEl) { awalEl.muted = true; awalEl.play().catch(() => {}); }

    // tiga tugas nyata; masing-masing menambah progres, dengan batas waktu supaya tidak macet
    const tasks = [
      (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, wait(1500)]) : Promise.resolve()).then(() => raise(40)),
      Promise.race([Sfx.load(), wait(1500)]).then(() => raise(65)),
      videoReady(introEl, 3500).then(() => raise(95))
    ];
    await Promise.all(tasks);
    raise(100);
    await done;
    await wait(120);
    showGate();
  }

  // ---- Gate ----
  function syncGate() {
    gateRows.forEach((row) => {
      const key = row.dataset.setting;
      const on = Settings[key];
      row.querySelector(".gate-state").textContent = on ? "ON" : "OFF";
      row.classList.toggle("is-off", !on);
    });
  }

  function selectGate(i, silent) {
    gateIndex = (i + gateRows.length) % gateRows.length;
    gateRows.forEach((r, idx) => r.classList.toggle("selected", idx === gateIndex));
    gateSelector.style.transform = `translateY(${gateIndex * 100}%)`;
    if (!silent) Sfx.preview();
  }

  function toggleGate(i) {
    const key = gateRows[i].dataset.setting;
    Settings.set(key, !Settings[key]);
    syncGate();
    if (key === "sfx" && Settings.sfx) Sfx.preview();
  }

  function showGate() {
    boot.ready = true;
    loadingScreen.classList.add("ready");
    gate.hidden = false;
    syncGate();
    selectGate(0, true);
  }

  gateRows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => { if (boot.ready && !boot.started && gateIndex !== i) selectGate(i); });
    row.addEventListener("click", (e) => { e.stopPropagation(); selectGate(i, true); toggleGate(i); });
  });
  enterBtn.addEventListener("click", (e) => { e.stopPropagation(); enter(); });

  function onKey(e, k) {
    if (!boot.ready) return;
    if (k === "enter") { e.preventDefault(); enter(); }
    else if (k === "arrowdown" || k === "s") { e.preventDefault(); selectGate(gateIndex + 1); }
    else if (k === "arrowup" || k === "w") { e.preventDefault(); selectGate(gateIndex - 1); }
    else if (k === "arrowleft" || k === "arrowright" || k === " ") { e.preventDefault(); toggleGate(gateIndex); }
  }

  function enter() {
    if (boot.started) return;
    boot.started = true;

    Sfx.start();
    Music.start();

    loadingScreen.classList.add("dismissed");
    setTimeout(() => {
      loadingScreen.style.display = "none";
      const awal = document.getElementById("awal-bg-video");
      if (awal) awal.pause(); // hemat GPU setelah masuk menu
    }, 450);

    document.getElementById("menu-column").classList.add("menu-entered");
    document.getElementById("menu-profile-header").classList.add("menu-entered");
    document.body.classList.add("experience-started");
    Background.playIntro();
  }

  boot.onKey = onKey;
  boot.run = run;
  return boot;
})();
