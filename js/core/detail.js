/* ==========================================================================
   CORE: DETAIL PANEL - panel keterangan di kanan bawah (PROJECT, RESUME)
   ========================================================================== */
const Detail = {
  render(el, { kicker, title, text, tags = [], url = "", linkLabel = "" }) {
    if (!el) return;
    el.classList.remove("swap");
    void el.offsetWidth;
    el.classList.add("swap");
    el.innerHTML = `
      <div class="detail-plate">
        ${kicker ? `<div class="detail-kicker">${kicker}</div>` : ""}
        <h2 class="detail-title">${title}</h2>
        <p class="detail-text">${text}</p>
        ${tags.length ? `<ul class="detail-tags">${tags.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
        ${url ? `<div class="detail-link"><span class="control-key">ENTER</span><span class="control-text">${linkLabel || "Open"}</span></div>` : ""}
      </div>`;
  }
};
