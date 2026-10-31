/* ==========================================================================
   MAIN - merangkai semua modul. Urutan <script> di index.html sudah benar,
   file ini harus dimuat paling akhir.
   ========================================================================== */
(() => {
  // ---- Isi data profil ke halaman ----
  document.querySelectorAll("[data-profile]").forEach((node) => {
    const key = node.dataset.profile;
    if (key === "bio") node.innerHTML = PROFILE.bio.map((p) => `<p class="p3r-about-p">${p}</p>`).join("");
    else if (key === "quote-text") node.textContent = PROFILE.quote.text;
    else if (key === "quote-author") node.textContent = PROFILE.quote.author;
    else if (key === "photo") { node.src = PROFILE.photo; node.alt = PROFILE.name; }
    else if (PROFILE[key] !== undefined) node.textContent = PROFILE[key];
  });

  // ---- Menu & halaman ----
  Menu.render();
  Pages.bindBackButtons();

  const params = new URLSearchParams(window.location.search);
  const initial = parseInt(params.get("select"), 10);
  Menu.select(!isNaN(initial) && initial >= 0 && initial < MENU_OPTIONS.length ? initial : 0, true);

  // ---- Keyboard ----
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();

    if (!Boot.started) { Boot.onKey(e, k); return; }

    if (k === "m" && !e.repeat) { Music.toggle(); return; }
    if (k === "n" && !e.repeat) { Music.next(); return; }

    if (Pages.handleKey(e)) return;
    if (Transition.running) return;

    if (k === "arrowdown" || k === "s") { e.preventDefault(); Menu.move(1); }
    else if (k === "arrowup" || k === "w") { e.preventDefault(); Menu.move(-1); }
    else if (k === "enter" || k === " " || k === "b") { e.preventDefault(); Menu.confirm(); }
    else if (k === "escape" || k === "a") { Sfx.close(); }
  });

  // ---- Jalankan ----
  if (window.innerWidth >= 1024) Boot.run();

  // Akses cepat dari Console untuk debugging: P3.Pages.open("system")
  window.P3 = { Pages, Menu, Music, Settings, Boot };
})();
