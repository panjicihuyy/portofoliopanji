/* ==========================================================================
   CORE: WAVY TRANSITION - lingkaran bergelombang (clip-path) saat buka / tutup halaman
   ========================================================================== */
const Transition = (() => {
  let running = false;

  function wavyPolygon(cx, cy, r, numPoints = 72, waves1 = 7, amp1 = 0.085, waves2 = 14, amp2 = 0.035, phase = 0, scaleX = 1.25, scaleY = 1.05) {
    if (r <= 0.5) {
      const pt = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      return `polygon(${new Array(numPoints).fill(pt).join(", ")})`;
    }
    const points = [];
    const step = (2 * Math.PI) / numPoints;
    for (let i = 0; i < numPoints; i++) {
      const theta = i * step;
      const wave = 1 + amp1 * Math.sin(waves1 * theta + phase) + amp2 * Math.cos(waves2 * theta + phase * 1.6);
      points.push(`${(cx + r * wave * Math.cos(theta) * scaleX).toFixed(1)}px ${(cy + r * wave * Math.sin(theta) * scaleY).toFixed(1)}px`);
    }
    return `polygon(${points.join(", ")})`;
  }

  function targetRadius(origin) {
    const maxDist = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    );
    return Math.ceil(maxDist * 1.85);
  }

  // Titik awal lingkaran: posisi klik, atau tengah tulisan opsi menu
  function optionOrigin(optionIndex, clickEvent) {
    if (clickEvent && typeof clickEvent.clientX === "number" && (clickEvent.clientX > 0 || clickEvent.clientY > 0)) {
      return { x: clickEvent.clientX, y: clickEvent.clientY };
    }
    const item = document.getElementById(`option-item-${optionIndex}`);
    if (item) {
      const texts = item.querySelectorAll(".option-text");
      for (const el of texts) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
      }
    }
    const [fx, fy] = (MENU_OPTIONS[optionIndex] && MENU_OPTIONS[optionIndex].origin) || [0.57, 0.5];
    return { x: window.innerWidth * fx, y: window.innerHeight * fy };
  }

  // Titik akhir lingkaran: tombol ESC di halaman
  function buttonOrigin(btn, fallbackX, fallbackY) {
    if (btn) {
      const r = btn.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
    }
    return {
      x: fallbackX !== undefined ? fallbackX : window.innerWidth - 120,
      y: fallbackY !== undefined ? fallbackY : window.innerHeight - 55
    };
  }

  function reveal({ pageEl, origin, bodyClass, videoEl, onStart, onComplete, duration = 520 }) {
    running = true;
    if (onStart) onStart();
    const R = targetRadius(origin);

    pageEl.classList.remove("active");
    pageEl.classList.add("circle-transitioning");
    pageEl.setAttribute("aria-hidden", "false");
    Background.pauseMenuLoop();

    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.muted = true;
      videoEl.play().catch(() => {});
    }

    const anim = pageEl.animate([
      { clipPath: wavyPolygon(origin.x, origin.y, 0, 72, 7, 0.085, 14, 0.035, 0.0, 1.25, 1.05) },
      { clipPath: wavyPolygon(origin.x + 22, origin.y - 12, R * 0.45, 72, 7, 0.09, 14, 0.035, 1.2, 1.25, 1.05), offset: 0.38 },
      { clipPath: wavyPolygon(origin.x + 10, origin.y - 5, R * 0.85, 72, 7, 0.075, 14, 0.025, 2.2, 1.20, 1.05), offset: 0.70 },
      { clipPath: wavyPolygon(origin.x, origin.y, R, 72, 7, 0.05, 14, 0.015, 3.4, 1.15, 1.02) }
    ], { duration, easing: "cubic-bezier(0.2, 1, 0.35, 1)", fill: "forwards" });

    anim.onfinish = () => {
      pageEl.classList.remove("circle-transitioning");
      pageEl.classList.add("active");
      pageEl.style.clipPath = "";
      if (bodyClass) document.body.classList.add(bodyClass);
      try { anim.cancel(); } catch (_) {}
      running = false;
      if (onComplete) onComplete();
    };
  }

  function close({ pageEl, exitOrigin, bodyClass, videoEl, onComplete, duration = 480 }) {
    Sfx.close();
    running = true;
    const R = targetRadius(exitOrigin);
    if (bodyClass) document.body.classList.remove(bodyClass);

    pageEl.classList.remove("active");
    pageEl.classList.add("circle-transitioning");

    const anim = pageEl.animate([
      { clipPath: wavyPolygon(exitOrigin.x, exitOrigin.y, R, 72, 9, 0.07, 18, 0.025, 0.0, 1.15, 1.25) },
      { clipPath: wavyPolygon(exitOrigin.x - 20, exitOrigin.y - 12, R * 0.80, 72, 9, 0.08, 18, 0.03, 1.0, 1.15, 1.25), offset: 0.32 },
      { clipPath: wavyPolygon(exitOrigin.x - 28, exitOrigin.y - 18, R * 0.42, 72, 9, 0.085, 18, 0.03, 2.0, 1.15, 1.25), offset: 0.65 },
      { clipPath: wavyPolygon(exitOrigin.x, exitOrigin.y, 0, 72, 9, 0.08, 18, 0.025, 3.0, 1.15, 1.25) }
    ], { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });

    anim.onfinish = () => {
      pageEl.classList.remove("circle-transitioning", "active");
      pageEl.style.clipPath = "";
      pageEl.setAttribute("aria-hidden", "true");
      if (videoEl) videoEl.pause();
      Background.resumeMenuLoop();
      try { anim.cancel(); } catch (_) {}
      running = false;
      if (onComplete) onComplete();
    };
  }

  return { reveal, close, optionOrigin, buttonOrigin, get running() { return running; } };
})();
