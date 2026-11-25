/* ==========================================================================
   CORE: PLATFORM - deteksi layar sentuh / HP, dipakai agar portfolio nyaman
   dibuka di handphone. Dimuat paling awal setelah data.
   - menambah class "is-touch" dan "is-small" pada <html>
   - mengisi variabel CSS --ui-scale (dipakai menu utama di HP)
   - memakai video latar yang lebih ringan di HP
   - mengganti tulisan tombol keyboard (ENTER / ESC) menjadi tulisan sentuh
   ========================================================================== */
const Platform = (() => {
  const mq = (q) => !!(window.matchMedia && window.matchMedia(q).matches);
  const root = document.documentElement;

  const touch = mq("(hover: none) and (pointer: coarse)");
  const canHover = mq("(hover: hover)");
  const isSmall = () => window.innerWidth < 1024;

  // Tulisan pada kunci tombol: di layar sentuh tidak ada keyboard
  const KEY_LABELS = { ENTER: "TAP", ESC: "\u00d7" };
  function keyLabel(name) { return touch && KEY_LABELS[name] ? KEY_LABELS[name] : name; }

  function applyKeyLabels(scope) {
    if (!touch) return;
    (scope || document).querySelectorAll(".control-key").forEach((el) => {
      const t = el.textContent.trim();
      if (KEY_LABELS[t]) el.textContent = KEY_LABELS[t];
    });
  }

  // Skala menu utama mengikuti lebar & tinggi layar HP (SVG menu berukuran tetap 950 x 200)
  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    root.classList.toggle("is-small", isSmall());
    root.classList.toggle("is-landscape", w > h);
    const scale = Math.max(0.3, Math.min(w / 520, h / 700, 1.2));
    root.style.setProperty("--ui-scale", scale.toFixed(3));
    root.style.setProperty("--vh", `${(h * 0.01).toFixed(2)}px`);
  }

  // Video latar menu 2560x1440 (8 MB + 7 MB) diganti versi 720p (sekitar 0,6 MB) di HP
  function lightVideos() {
    if (!(touch || isSmall())) return;
    const swap = (id, file) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("src", file);
    };
    swap("background-video-intro", "assets/video/bg-intro-mobile.mp4");
    swap("background-video-loop", "assets/video/bg-loop-mobile.mp4");
  }

  if (touch) root.classList.add("is-touch");
  layout();
  lightVideos();
  applyKeyLabels();

  // Tampilan petunjuk di layar pilihan suara
  if (touch) {
    const hint = document.querySelector(".gate-hint");
    if (hint) hint.innerHTML = "<span>Tap a row to switch ON / OFF</span>";
  }

  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", () => setTimeout(layout, 120));

  return { touch, canHover, isSmall, keyLabel, applyKeyLabels, layout };
})();
