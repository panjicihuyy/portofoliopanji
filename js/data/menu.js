/* ==========================================================================
   DATA: MENU UTAMA
   Urutan di sini = urutan di menu. "page" harus sama dengan id di Pages.register().
   rotation / offsetX / offsetY / fontSize mengatur kemiringan tiap tulisan.
   ========================================================================== */
const MENU_OPTIONS = [
  { page: "project", name: "PROJECT", description: "View the apps and websites I built",
    rotation: -20, zIndex: 1, offsetX: -40, offsetY: 25, fontSize: "5.15rem", bannerScaleX: 1.07, bannerScaleY: 3.35,
    origin: [0.62, 0.30] },
  { page: "skills", name: "SKILLS", description: "View my technical abilities",
    rotation: -12, zIndex: 2, offsetX: -65, offsetY: 30, fontSize: "4.55rem", bannerScaleX: 0.96, bannerScaleY: 3.05,
    origin: [0.60, 0.40] },
  { page: "about", name: "ABOUT", description: "Read who I am and what I design",
    rotation: -4, zIndex: 3, offsetX: -80, offsetY: 35, fontSize: "4.85rem", bannerScaleX: 1.02, bannerScaleY: 3.25,
    origin: [0.58, 0.50] },
  { page: "resume", name: "RESUME", description: "Follow my school and project timeline",
    rotation: -9, zIndex: 2, offsetX: -55, offsetY: 38, fontSize: "4.7rem", bannerScaleX: 1.0, bannerScaleY: 3.15,
    origin: [0.58, 0.60] },
  { page: "contact", name: "CONTACT", description: "Send me a message",
    rotation: 5, zIndex: 4, offsetX: -85, offsetY: 34, fontSize: "4.65rem", bannerScaleX: 1.04, bannerScaleY: 3.2,
    origin: [0.57, 0.70] },
  { page: "system", name: "SYSTEM", description: "Change music and sound settings",
    rotation: 6, zIndex: 1, offsetX: -45, offsetY: 44, fontSize: "4.6rem", bannerScaleX: 1.0, bannerScaleY: 3.2,
    origin: [0.55, 0.80] }
];
