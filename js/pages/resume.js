/* ==========================================================================
   PAGE: RESUME - linimasa sekolah & proyek
   ========================================================================== */
(() => {
  const el = document.getElementById("resume-page");
  const detailEl = document.getElementById("resume-detail");

  const list = createListController({
    container: document.getElementById("resume-cards-container"),
    items: () => RESUME,
    isActive: () => Pages.current && Pages.current.id === "resume",
    build: (r) => `
      <div class="card-unified-row">
        <div class="card-numeral-box"><span class="card-numeral-text">${r.numeral}</span></div>
        <div class="card-main-body">
          <div class="card-title-text">${r.title}</div>
          <div class="card-subtitle-text">${r.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>`,
    onSelect: (i) => {
      const r = RESUME[i];
      Detail.render(detailEl, { kicker: r.category, title: r.title, text: r.description });
    },
    onConfirm: () => Sfx.nav()
  });

  Pages.register({
    id: "resume",
    el,
    video: document.getElementById("resume-bg-video"),
    backBtn: document.getElementById("resume-back-btn"),
    onOpen() {
      list.reset();
      list.render();
      replayBannerAnimation(document.getElementById("resume-header-div"));
    },
    onKey(e, k) {
      if (k === "arrowdown" || k === "s") { list.move(1); return true; }
      if (k === "arrowup" || k === "w") { list.move(-1); return true; }
      return false;
    }
  });
})();
