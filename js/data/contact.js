/* ==========================================================================
   DATA: CONTACT (kotak surat di halaman CONTACT)
   Maksimal 5 slot (CONTACT_SLOTS). Slot yang tidak terisi tampil sebagai "No Message".
   Tiap kontak:
     label : nama di baris atas
     text  : tulisan yang tampil
     href  : tujuan saat diklik
     icon  : "mail" | "github" | "whatsapp" | "instagram" | "tiktok" | "link"
   Nomor WhatsApp memakai kode negara tanpa tanda + dan tanpa 0 di depan:
   0831-4196-8179  ->  https://wa.me/6283141968179
   ========================================================================== */
const CONTACT_SLOTS = 5;

const CONTACTS = [
  { label: "Gmail",     text: "setiawanp01433@gmail.com",       href: "mailto:setiawanp01433@gmail.com",       icon: "mail" },
  { label: "GitHub",    text: "github.com/panjicihuyy",         href: "https://github.com/panjicihuyy",         icon: "github" },
  { label: "WhatsApp",  text: "0831-4196-8179",                 href: "https://wa.me/6283141968179",            icon: "whatsapp" },
  { label: "Instagram", text: "@centtt_17",                     href: "https://www.instagram.com/centtt_17/",   icon: "instagram" },
  { label: "TikTok",    text: "@centanakbaik",                  href: "https://www.tiktok.com/@centanakbaik",   icon: "tiktok" }
];
