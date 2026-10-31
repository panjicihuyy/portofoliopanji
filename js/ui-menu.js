/* ==========================================================================
   UI: MENU UTAMA - opsi miring dengan topeng SVG (teks merah di atas banner putih)
   ========================================================================== */
const Menu = (() => {
  const COLORS = ["fill-button-1", "fill-button-2", "fill-button-3"];
  const SELECTOR_PATH = "M 24.853754, 93.31573 135.14625, 49.684266 114.14751, 97.331142 Z";
  const SELECTOR_BG_PATH = "M 12.7428765,95.50088 144.25712,47.499123 116.75625,95.465764 Z";

  const listEl = document.getElementById("options-list");
  const sideNumber = document.getElementById("side-number");
  const descEl = document.getElementById("menu-description");
  let items = [];
  let selected = 0;

  function render() {
    listEl.innerHTML = "";
    items = [];

    MENU_OPTIONS.forEach((opt, index) => {
      const colorClass = COLORS[(index + 2) % COLORS.length];
      const cleanName = opt.name.replace(/ /g, "");
      const scaleX = (cleanName.length * 0.52 + 1.6) * (opt.bannerScaleX || 1);
      const transform = `translate(-60, -9) rotate(8, 0, 100) scale(${scaleX}, ${opt.bannerScaleY || 3.2})`;
      const maskId = `selector-mask-${index}`;
      const fontSize = opt.fontSize || "4.8rem";

      const item = document.createElement("div");
      item.className = "option-item";
      item.id = `option-item-${index}`;
      item.style.zIndex = opt.zIndex;
      item.innerHTML = `
        <button class="option-hitbox" data-index="${index}" aria-label="${opt.name}: ${opt.description}"></button>
        <svg width="950" height="200" xmlns="http://www.w3.org/2000/svg" class="option-svg"
             style="transform: translate(${opt.offsetX}px, ${opt.offsetY}px) rotate(${opt.rotation}deg);">
          <defs>
            <mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="950" height="200">
              <rect width="100%" height="100%" fill="black" />
              <g transform="${transform}" transform-origin="left center">
                <path fill="white" d="${SELECTOR_PATH}" />
                <path class="pulse-anim" transform-origin="52 100" fill="white" d="${SELECTOR_BG_PATH}" />
              </g>
            </mask>
          </defs>
          <g class="selector-group" transform="${transform}" transform-origin="left center">
            <path class="fill-pink pulse-anim" transform-origin="52 100" d="${SELECTOR_BG_PATH}" />
            <path class="fill-fg" d="${SELECTOR_PATH}" />
          </g>
          <text x="150" y="122" class="option-text base-text ${colorClass}" style="font-size: ${fontSize};">${opt.name}</text>
          <g class="masked-red-group" mask="url(#${maskId})">
            <text x="150" y="122" class="option-text fill-red" style="font-size: ${fontSize};">${opt.name}</text>
          </g>
        </svg>`;

      const hitbox = item.querySelector(".option-hitbox");
      hitbox.addEventListener("mouseenter", () => { if (!Pages.current && selected !== index) select(index); });
      hitbox.addEventListener("click", (e) => {
        if (Pages.current) return;
        select(index);
        confirm(e);
      });

      listEl.appendChild(item);
      items.push(item);
    });
  }

  function select(index, silent) {
    if (index === selected && items.length && items[index].classList.contains("selected")) return;
    selected = index;
    if (!silent) Sfx.nav();
    if (sideNumber) sideNumber.textContent = String(selected + 1).padStart(2, "0");
    if (descEl) descEl.textContent = MENU_OPTIONS[selected].description;

    // muat video halaman tujuan lebih awal
    const page = Pages.all[MENU_OPTIONS[selected].page];
    if (page) Background.preload(page.video);

    items.forEach((el, i) => {
      const on = i === selected;
      el.classList.toggle("selected", on);
      el.style.zIndex = on ? 15 : MENU_OPTIONS[i].zIndex;
    });
  }

  function move(delta) { select((selected + delta + MENU_OPTIONS.length) % MENU_OPTIONS.length); }
  function confirm(evt) { Pages.open(MENU_OPTIONS[selected].page, evt); }

  return { render, select, move, confirm, get selected() { return selected; } };
})();
