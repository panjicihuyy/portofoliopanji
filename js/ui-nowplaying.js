/* ==========================================================================
   UI: NOW PLAYING - penanda lagu di pojok kiri bawah menu utama
   ========================================================================== */
(() => {
  const el = document.getElementById("nowplaying");
  if (!el) return;
  const titleEl = el.querySelector(".np-title");
  const subEl = el.querySelector(".np-sub");

  Music.onChange((s) => {
    el.classList.toggle("is-playing", s.playing);
    el.classList.toggle("is-off", !Settings.music);
    titleEl.textContent = s.track.title;
    subEl.textContent = !Settings.music ? "Music off. Press M to turn on" : (s.track.jp || "Persona 3 Reload OST");
  });

  el.addEventListener("click", () => Music.toggle());
})();
