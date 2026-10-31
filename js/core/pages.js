/* ==========================================================================
   CORE: PAGES - daftar halaman + buka / tutup + navigasi keyboard per halaman
   Cara menambah halaman baru:
     1. tambah <section id="xxx-page"> di index.html
     2. buat js/pages/xxx.js yang memanggil Pages.register({...})
     3. tambah satu baris di js/data/menu.js
   ========================================================================== */
const Pages = (() => {
  const registry = {};
  let current = null;

  function register(config) {
    registry[config.id] = Object.assign({ bodyClass: `${config.id}-screen-active` }, config);
  }

  function open(id, clickEvent) {
    const page = registry[id];
    if (!page || current || Transition.running) return;
    current = page;
    Sfx.nav();
    const idx = MENU_OPTIONS.findIndex((o) => o.page === id);

    Transition.reveal({
      pageEl: page.el,
      origin: Transition.optionOrigin(idx, clickEvent),
      bodyClass: page.bodyClass,
      videoEl: page.video,
      onStart: () => { if (page.onOpen) page.onOpen(); }
    });
  }

  function close() {
    const page = current;
    if (!page || Transition.running) return;
    current = null;
    if (page.onClose) page.onClose();
    Transition.close({
      pageEl: page.el,
      exitOrigin: Transition.buttonOrigin(page.backBtn, page.exitX, page.exitY),
      bodyClass: page.bodyClass,
      videoEl: page.video
    });
  }

  // Mengembalikan true bila tombol sudah ditangani halaman aktif
  function handleKey(e) {
    if (!current) return false;
    const k = e.key.toLowerCase();
    if (k === "escape" || k === "b" || k === "backspace") {
      e.preventDefault();
      close();
      return true;
    }
    if (current.onKey && current.onKey(e, k)) {
      e.preventDefault();
      return true;
    }
    return true; // halaman aktif menelan semua tombol lain
  }

  // Wire tombol "ESC / Close" pada tiap halaman
  function bindBackButtons() {
    Object.values(registry).forEach((p) => {
      if (p.backBtn) p.backBtn.addEventListener("click", close);
    });
  }

  return {
    register, open, close, handleKey, bindBackButtons,
    get current() { return current; },
    get all() { return registry; }
  };
})();

// Helper untuk memutar animasi judul banner "shattered"
function replayBannerAnimation(el) {
  if (!el) return;
  el.classList.remove("animating");
  void el.offsetWidth;
  el.classList.add("animating");
}

// Helper umum: daftar kartu bergaya S.Link (dipakai PROJECT, RESUME dan SYSTEM)
function createListController({ container, items, build, onSelect, onConfirm, isActive }) {
  let selected = 0;
  let cards = [];

  function render() {
    container.innerHTML = "";
    cards = items().map((item, idx) => {
      const card = document.createElement("button");
      card.className = "slink-card";
      card.setAttribute("role", "tab");
      card.style.setProperty("--card-idx", idx);
      card.innerHTML = build(item, idx);
      card.addEventListener("mouseenter", () => { if (isActive() && !Transition.running && selected !== idx) select(idx); });
      card.addEventListener("click", () => {
        if (!isActive() || Transition.running) return;
        if (selected !== idx) select(idx); else onConfirm(idx);
      });
      container.appendChild(card);
      return card;
    });
    select(selected, true);
  }

  function select(i, silent) {
    selected = Math.max(0, Math.min(i, cards.length - 1));
    cards.forEach((c, idx) => {
      c.classList.toggle("active", idx === selected);
      c.setAttribute("aria-selected", idx === selected ? "true" : "false");
    });
    if (onSelect) onSelect(selected, silent);
    if (!silent) Sfx.nav();
  }

  return {
    render,
    select,
    reset() { selected = 0; },
    move(delta) { if (cards.length) select((selected + delta + cards.length) % cards.length); },
    confirm() { onConfirm(selected); },
    get selected() { return selected; },
    get cards() { return cards; }
  };
}
