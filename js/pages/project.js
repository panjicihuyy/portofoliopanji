/* ==========================================================================
   PAGE: PROJECT - kartu S.Link + panel keterangan
   ========================================================================== */
(() => {
  const el = document.getElementById("project-page");
  const detailEl = document.getElementById("project-detail");

  const list = createListController({
    container: document.getElementById("slink-cards-container"),
    items: () => PROJECTS,
    isActive: () => Pages.current && Pages.current.id === "project",
    build: (p) => `
      <div class="card-unified-row">
        <div class="card-numeral-box"><span class="card-numeral-text">${p.numeral}</span></div>
        <div class="card-main-body">
          <div class="card-title-text">${p.title}</div>
          <div class="card-subtitle-text">${p.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>`,
    onSelect: (i) => {
      const p = PROJECTS[i];
      Detail.render(detailEl, { kicker: "Project", title: p.title, text: p.description, tags: p.tags, url: p.url, linkLabel: p.linkLabel });
    },
    onConfirm: (i) => {
      const p = PROJECTS[i];
      if (p.url) window.open(p.url, "_blank", "noopener");
      Sfx.nav();
    }
  });

  Pages.register({
    id: "project",
    el,
    video: document.getElementById("slink-bg-video"),
    backBtn: document.getElementById("slink-back-btn"),
    onOpen() {
      list.reset();
      list.render();
      replayBannerAnimation(document.getElementById("slink-project-div"));
    },
    onKey(e, k) {
      if (k === "arrowdown" || k === "s") { list.move(1); return true; }
      if (k === "arrowup" || k === "w") { list.move(-1); return true; }
      if (k === "enter" || k === " " || k === "a") { list.confirm(); return true; }
      return false;
    }
  });
  document.getElementById("slink-confirm-btn").addEventListener("click", () => { if (Pages.current && Pages.current.id === "project") list.confirm(); });
})();
