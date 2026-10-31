/* ==========================================================================
   DATA: SKILLS
   level = 0 sampai 100. Angka di bawah adalah PERKIRAAN AWAL, ubah sesuai kemampuanmu.
   ========================================================================== */
const SKILL_TABS = [
  { id: "frontend",  code: "01", label: "FRONTEND" },
  { id: "backend",   code: "02", label: "BACKEND" },
  { id: "mobile",    code: "03", label: "MOBILE" },
  { id: "languages", code: "04", label: "LANGUAGES" }
];

const SKILL_GROUPS = [
  { id: "frontend", title: "FRONTEND & WEB DESIGN", skills: [
    { name: "HTML5 \u00b7 Semantic Markup", level: 90 },
    { name: "CSS3 \u00b7 Flexbox \u00b7 Grid \u00b7 Animation", level: 88 },
    { name: "JavaScript (ES6+)", level: 80 },
    { name: "Responsive Layout", level: 82 },
    { name: "UI Design \u00b7 Figma", level: 78 }
  ]},
  { id: "backend", title: "BACKEND & DATABASE", skills: [
    { name: "PHP \u00b7 Custom MVC", level: 75 },
    { name: "MySQL", level: 75 },
    { name: "Node.js \u00b7 REST API", level: 62 },
    { name: "SQL Server", level: 58 }
  ]},
  { id: "mobile", title: "MOBILE APPS", skills: [
    { name: "Android Studio", level: 60 },
    { name: "Figma to App Screens", level: 70 },
    { name: "Flutter", level: 50 }
  ]},
  { id: "languages", title: "LANGUAGES", skills: [
    { name: "Bahasa Indonesia (Native)", level: 100 },
    { name: "English", level: 70 }
  ]}
];
