/* ==========================================================================
   CORE: BACKGROUND - video menu utama: intro lalu loop mulus
   ========================================================================== */
const Background = (() => {
  const intro = document.getElementById("background-video-intro");
  const loop = document.getElementById("background-video-loop");
  let switched = false;

  function switchToLoop() {
    if (switched || !loop) return;
    switched = true;
    if (loop.preload !== "auto") loop.preload = "auto";
    loop.currentTime = 0;
    const p = loop.play();
    const hideIntro = () => {
      if (!intro) return;
      intro.classList.add("fade-out");
      setTimeout(() => { intro.pause(); intro.style.display = "none"; }, 300);
    };
    if (p !== undefined) p.then(hideIntro).catch(() => { if (intro) intro.classList.add("fade-out"); });
    else hideIntro();
  }

  if (intro) {
    intro.addEventListener("ended", switchToLoop);
    intro.addEventListener("error", switchToLoop);
    intro.addEventListener("timeupdate", () => {
      if (switched || !(intro.duration > 0)) return;
      if (intro.currentTime >= intro.duration * 0.4 && loop && loop.preload !== "auto") loop.preload = "auto";
      if (intro.currentTime >= intro.duration - 0.08) switchToLoop();
    });
  }

  return {
    prepare() {
      [intro, loop].forEach((v) => { if (v) { v.muted = true; v.defaultMuted = true; } });
    },
    playIntro() {
      if (!intro) return;
      if (intro.preload !== "auto") intro.preload = "auto";
      intro.currentTime = 0;
      intro.muted = true;
      const p = intro.play();
      if (p !== undefined) p.catch(() => switchToLoop());
    },
    // hemat GPU: jeda video menu saat halaman lain tampil
    pauseMenuLoop() { if (loop && !loop.paused) loop.pause(); },
    resumeMenuLoop() { if (loop && switched && loop.paused) loop.play().catch(() => {}); },
    preload(video) { if (video && video.preload !== "auto") video.preload = "auto"; }
  };
})();
