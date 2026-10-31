/* ==========================================================================
   PAGE: SKILLS - tab kategori + bar status bergaya P3R
   ========================================================================== */
(() => {
  const el = document.getElementById("skill-page");
  const tabsNav = document.getElementById("skill-tabs-nav");
  const container = document.getElementById("p3r-skills-container");
  let currentTab = SKILL_TABS[0].id;

  function renderTabs() {
    tabsNav.innerHTML = "";
    SKILL_TABS.forEach((tab) => {
      const on = tab.id === currentTab;
      const btn = document.createElement("button");
      btn.className = `p3r-skill-tab ${on ? "active" : ""}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.innerHTML = `<span class="p3r-tab-tag">${tab.code}</span><span class="p3r-tab-label">${tab.label}</span>`;
      btn.addEventListener("click", () => { if (currentTab !== tab.id) setTab(tab.id); });
      tabsNav.appendChild(btn);
    });
  }

  function renderStats() {
    container.innerHTML = "";
    SKILL_GROUPS.filter((g) => g.id === currentTab).forEach((group) => {
      const rows = group.skills.map((s, idx) => `
        <div class="p3r-stat-row" style="animation-delay: ${idx * 0.06}s;">
          <div class="p3r-stat-name-col"><span class="p3r-stat-name">${s.name}</span></div>
          <div class="p3r-stat-bar-track">
            <div class="p3r-stat-bar-fill" style="width: ${s.level}%;"><div class="p3r-stat-bar-tip" aria-hidden="true"></div></div>
          </div>
          <div class="p3r-stat-lv"><span class="p3r-stat-lv-prefix">LV</span><span class="p3r-stat-lv-val">${s.level}</span></div>
        </div>`).join("");

      const div = document.createElement("div");
      div.className = "p3r-skill-group";
      div.innerHTML = `
        <div class="p3r-skill-group-header"><h3 class="p3r-group-title">${group.title}</h3><div class="p3r-group-line"></div></div>
        <div class="p3r-skill-rows-list">${rows}</div>`;
      container.appendChild(div);
    });
  }

  function setTab(id) {
    currentTab = id;
    Sfx.nav();
    renderTabs();
    renderStats();
  }

  function shiftTab(delta) {
    const i = SKILL_TABS.findIndex((t) => t.id === currentTab);
    setTab(SKILL_TABS[(i + delta + SKILL_TABS.length) % SKILL_TABS.length].id);
  }

  Pages.register({
    id: "skills",
    bodyClass: "skill-screen-active",
    el,
    video: document.getElementById("skill-bg-video"),
    backBtn: document.getElementById("skill-back-btn"),
    onOpen() {
      renderTabs();
      renderStats();
      replayBannerAnimation(document.getElementById("skill-header-div"));
    },
    onKey(e, k) {
      if (k === "q" || k === "arrowleft") { shiftTab(-1); return true; }
      if (k === "e" || k === "arrowright") { shiftTab(1); return true; }
      return false;
    }
  });
  document.getElementById("skill-tab-prev-btn").addEventListener("click", () => { if (Pages.current && Pages.current.id === "skills") shiftTab(-1); });
  document.getElementById("skill-tab-next-btn").addEventListener("click", () => { if (Pages.current && Pages.current.id === "skills") shiftTab(1); });
})();
