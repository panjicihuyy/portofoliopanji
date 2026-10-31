/* ==========================================================================
   PAGE: CONTACT - kotak surat ala ponsel P3R; slot dari js/data/contact.js
   ========================================================================== */
(() => {
  const el = document.getElementById("contact-page");
  const listEl = document.getElementById("contact-list");
  let rows = [];
  let selected = 0;

  // Ikon 24x24, diwarnai lewat currentColor
  const ICONS = {
    mail: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
    github: '<path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3"/>',
    whatsapp: '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.25"/>',
    tiktok: '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>',
    link: '<path d="M3.9 12a3.1 3.1 0 013.1-3.1h4V7H7a5 5 0 000 10h4v-1.9H7A3.1 3.1 0 013.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 010 6.2h-4V17h4a5 5 0 000-10z"/>'
  };

  // Teks yang tampil dibuat aman supaya karakter seperti & atau < tidak merusak HTML
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  function render() {
    listEl.innerHTML = "";
    for (let i = 0; i < CONTACT_SLOTS; i++) {
      const c = CONTACTS[i];
      const row = document.createElement(c ? "a" : "div");
      if (c) {
        row.href = c.href;
        if (!c.href.startsWith("mailto:")) { row.target = "_blank"; row.rel = "noopener"; }
        const type = ICONS[c.icon] ? c.icon : "link";
        row.className = `p3r-mail-row p3r-mail-row-${type}`;
        row.setAttribute("aria-label", `${c.label}: ${c.text}`);
        row.innerHTML = `
          <div class="p3r-mail-icon-block p3r-mail-${type}" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">${ICONS[type]}</svg>
          </div>
          <div class="p3r-mail-content-block">
            <div class="p3r-mail-sender-row">
              <svg class="p3r-mail-env-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[type]}</svg>
              <span class="p3r-mail-sender-name">${esc(c.label)}</span>
            </div>
            <div class="p3r-mail-row-line" aria-hidden="true"></div>
            <div class="p3r-mail-msg-text">${esc(c.text)}</div>
          </div>`;
      } else {
        row.className = "p3r-mail-row p3r-mail-row-empty";
        row.setAttribute("aria-hidden", "true");
        row.innerHTML = `
          <div class="p3r-mail-icon-block p3r-mail-empty-icon" aria-hidden="true"></div>
          <div class="p3r-mail-content-block">
            <div class="p3r-mail-sender-row"><span class="p3r-mail-sender-name"></span></div>
            <div class="p3r-mail-row-line" aria-hidden="true"></div>
            <div class="p3r-mail-msg-text p3r-mail-empty-text">No Message</div>
          </div>`;
      }
      listEl.appendChild(row);
    }
    rows = Array.from(listEl.querySelectorAll(".p3r-mail-row"));
    rows.forEach((row, i) => row.addEventListener("mouseenter", () => { if (!row.classList.contains("p3r-mail-row-empty")) select(i); }));
  }

  function select(i, silent) {
    const filled = rows.map((r, idx) => (r.classList.contains("p3r-mail-row-empty") ? -1 : idx)).filter((x) => x >= 0);
    if (!filled.length) return;
    selected = filled.includes(i) ? i : filled[0];
    rows.forEach((r, idx) => r.classList.toggle("active", idx === selected));
    if (!silent) Sfx.nav();
  }

  function move(delta) {
    const filled = rows.map((r, idx) => (r.classList.contains("p3r-mail-row-empty") ? -1 : idx)).filter((x) => x >= 0);
    if (filled.length < 2) return;
    const pos = filled.indexOf(selected);
    select(filled[(pos + delta + filled.length) % filled.length]);
  }

  Pages.register({
    id: "contact",
    el,
    video: document.getElementById("contact-bg-video"),
    backBtn: document.getElementById("contact-back-btn"),
    exitX: 80,
    exitY: window.innerHeight - 60,
    onOpen() {
      render();
      select(0, true);
      const phone = document.querySelector(".p3r-mail-phone-wrap");
      if (phone) { phone.style.animation = "none"; void phone.offsetWidth; phone.style.animation = ""; }
    },
    onKey(e, k) {
      if (k === "arrowdown" || k === "s") { move(1); return true; }
      if (k === "arrowup" || k === "w") { move(-1); return true; }
      if ((k === "enter" || k === " ") && rows[selected]) { rows[selected].click(); return true; }
      return false;
    }
  });
})();
