/* ==========================================================================
   CORE: SETTINGS - pengaturan musik & efek suara (disimpan di localStorage)
   ========================================================================== */
const Settings = (() => {
  const KEY = "p3r-portfolio-settings";
  const state = { music: true, sfx: true };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      if (typeof saved.music === "boolean") state.music = saved.music;
      if (typeof saved.sfx === "boolean") state.sfx = saved.sfx;
    }
  } catch (_) {}

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  return {
    get music() { return state.music; },
    get sfx() { return state.sfx; },
    set(name, value) {
      state[name] = !!value;
      save();
    }
  };
})();
