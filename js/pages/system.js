/* ==========================================================================
   PAGE: SYSTEM - pengaturan musik / efek suara + daftar lagu
   Baris 1-2 = saklar. Baris berikutnya = lagu (Enter untuk memutar).
   ========================================================================== */
(() => {
  const el = document.getElementById("system-page");
  const detailEl = document.getElementById("system-detail");
  const container = document.getElementById("system-cards-container");

  const rows = () => [
    { type: "toggle", key: "music", numeral: "BGM", title: "MUSIC", subtitle: "Background music" },
    { type: "toggle", key: "sfx", numeral: "SE", title: "SOUND EFFECTS", subtitle: "Menu navigation sounds" },
    ...TRACKS.map((t, i) => ({ type: "track", index: i, numeral: String(i + 1).padStart(2, "0"), title: t.title, subtitle: t.jp || "Persona 3 Reload OST" }))
  ];

  const isActive = () => Pages.current && Pages.current.id === "system";

  const list = createListController({
    container,
    items: rows,
    isActive,
    build: (r) => `
      <div class="card-unified-row">
        <div class="card-numeral-box ${r.type === "toggle" ? "is-toggle" : ""}"><span class="card-numeral-text">${r.numeral}</span></div>
        <div class="card-main-body">
          <div class="card-title-text">${r.title}</div>
          <div class="card-subtitle-text">${r.subtitle}</div>
          <span class="sys-state" aria-hidden="true"></span>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>`,
    onSelect: () => {},
    onConfirm: (i) => activate(i)
  });

  function activate(i) {
    const r = rows()[i];
    if (!r) return;
    if (r.type === "toggle" && r.key === "music") Music.setEnabled(!Settings.music);
    else if (r.type === "toggle" && r.key === "sfx") {
      Settings.set("sfx", !Settings.sfx);
      if (Settings.sfx) Sfx.preview();
    } else if (r.type === "track") Music.select(r.index);
    refresh();
  }

  // Perbarui tulisan ON/OFF dan penanda lagu yang sedang diputar tanpa menggambar ulang kartu
  function refresh() {
    const data = rows();
    const m = Music.state;
    list.cards.forEach((card, i) => {
      const r = data[i];
      const state = card.querySelector(".sys-state");
      if (!state || !r) return;
      if (r.type === "toggle") {
        const on = Settings[r.key];
        state.textContent = on ? "ON" : "OFF";
        state.className = `sys-state ${on ? "is-on" : "is-off"}`;
      } else {
        const now = m.index === r.index && m.playing;
        state.textContent = "";
        state.className = `sys-state sys-eq ${now ? "is-playing" : ""}`;
        state.innerHTML = now ? "<i></i><i></i><i></i><i></i>" : "";
      }
    });
    Detail.render(detailEl, {
      kicker: m.playing ? "Now playing" : (Settings.music ? "Paused" : "Music off"),
      title: m.track.title,
      text: m.track.jp ? `${m.track.jp}. Persona 3 Reload original soundtrack.` : "Persona 3 Reload original soundtrack."
    });
  }

  Music.onChange(() => { if (isActive()) refresh(); });

  Pages.register({
    id: "system",
    el,
    video: document.getElementById("system-bg-video"),
    backBtn: document.getElementById("system-back-btn"),
    onOpen() {
      list.reset();
      list.render();
      refresh();
      replayBannerAnimation(document.getElementById("system-header-div"));
    },
    onKey(e, k) {
      if (k === "arrowdown" || k === "s") { list.move(1); return true; }
      if (k === "arrowup" || k === "w") { list.move(-1); return true; }
      if (k === "arrowright" || k === "e") { Music.next(); return true; }
      if (k === "arrowleft" || k === "q") { Music.prev(); return true; }
      if (k === "enter" || k === " " || k === "a") { list.confirm(); return true; }
      return false;
    }
  });
  document.getElementById("system-confirm-btn").addEventListener("click", () => { if (isActive()) list.confirm(); });
})();
