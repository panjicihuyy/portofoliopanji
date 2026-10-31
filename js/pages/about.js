/* ==========================================================================
   PAGE: ABOUT - kartu profil di kiri; isi diambil dari js/data/profile.js
   ========================================================================== */
(() => {
  const el = document.getElementById("about-page");

  Pages.register({
    id: "about",
    el,
    video: document.getElementById("about-bg-video"),
    backBtn: document.getElementById("about-back-btn"),
    onOpen() { replayBannerAnimation(document.getElementById("about-header-div")); }
  });
})();
