/*
 * J.P. Central School — tiny static site builder.
 *
 *   node src/build.js
 *
 * Takes every file in src/pages/, wraps it in the shared header + footer below,
 * and writes the finished page to the project root (index.html, about.html ...).
 * Edit school details ONCE in the SCHOOL object and rebuild.
 *
 * Each page file starts with a JSON comment:
 *   <!--{"title":"About Us","desc":"...","nav":"about"}-->
 * Inside pages, {{icon:name}} inserts an SVG icon and {{school.key}} inserts a value.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PAGES = path.join(__dirname, "pages");

const SCHOOL = {
  name: "J.P. Central School",
  short: "JPCS",
  tagline: "Nurturing Minds, Building Futures",
  motto: "सा विद्या या विमुक्तये",
  mottoEn: "Knowledge is that which liberates",
  affiliation: "330762",
  schoolCode: "65759",
  established: "2011",
  address: "Mathurapur Ghat, Samastipur, Bihar – 848101",
  phone1: "+91 94304 41288",
  phone1raw: "+919430441288",
  phone2: "+91 97095 33102",
  phone2raw: "+919709533102",
  phone3: "+91 98018 38725",
  phone3raw: "+919801838725",
  whatsapp: "919430441288",
  email: "jpcs.principal@gmail.com",
  instagram: "https://www.instagram.com/jpcs.samastipur/",
  facebook: "https://www.facebook.com/profile.php?id=100088490693469",
  youtube: "https://www.youtube.com/results?search_query=J.P.+Central+School+Samastipur",
  erp: "https://shikshaware.com/useraccount/AppLogin",
  onlineAdmission: "https://shikshaware.com/Client/AppAdmission?AppclientId=33",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=J.P.+Central+School+Mathurapur+Ghat+Samastipur",
  mapsEmbed: "https://www.google.com/maps?q=J.P.+Central+School,+Mathurapur+Ghat,+Samastipur,+Bihar&output=embed",
  siteUrl: "https://www.jpcentralschool.com/",
};

const ICONS = {
  phone: '<path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/>',
  mail: '<path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.2l-8 5-8-5V6l8 5 8-5z"/>',
  pin: '<path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/>',
  clock: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.4l3.5 2.1-.8 1.3L11 13V7h2z"/>',
  instagram: '<path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.3 5.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.1 5.5 2 7.1c-.1 1.7-.1 6.5 0 8.2.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.5.1-8.2zm-2.2 10.1a3.3 3.3 0 01-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 01-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8a3.3 3.3 0 011.9-1.9c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 011.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/>',
  facebook: '<path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-4 0-5 3-5 5v2H6v4h3v11h5V12h3.5l.5-4z"/>',
  youtube: '<path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15V9l5.8 3z"/>',
  whatsapp: '<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 01-4.1-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1.1 2.5 6 6 0 001.2 3.1 13.4 13.4 0 005.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1112 21.8zM20.5 3.5A11.8 11.8 0 001.9 17.7L.2 24l6.4-1.7a11.8 11.8 0 0017.6-10.3 11.7 11.7 0 00-3.7-8.5z"/>',
  book: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5zM4 19.5A2.5 2.5 0 006.5 22H20v-5"/>',
  flask: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 3h6M10 3v6L4.5 18.5A2 2 0 006.2 21h11.6a2 2 0 001.7-2.5L14 9V3M7 15h10"/>',
  monitor: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h18v12H3zM8 20h8M12 16v4"/>',
  trophy: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
  palette: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 22a10 10 0 110-20c5.5 0 10 4 10 9a5 5 0 01-5 5h-1.8a1.7 1.7 0 00-1.2 2.9A1.7 1.7 0 0112 22z"/><circle cx="7.5" cy="10.5" r="1.3"/><circle cx="12" cy="7" r="1.3"/><circle cx="16.5" cy="10.5" r="1.3"/>',
  bus: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 17V6a3 3 0 013-3h8a3 3 0 013 3v11M5 11h14M5 17h14v2H5zM7.5 14h.01M16.5 14h.01M7 19v2M17 19v2"/>',
  shield: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/>',
  users: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
  home: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2z"/>',
  smart: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 3h20v13H2zM7 21l5-5 5 5M8 8l3 3 5-5"/>',
  heart: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/>',
  bulb: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V16h8v-1.3A7 7 0 0012 2z"/>',
  target: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.5"/>',
  eye: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  compass: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  file: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
  login: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  award: '<circle cx="12" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M8.2 13L7 22l5-3 5 3-1.2-9"/>',
  calendar: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 5h18v16H3zM16 3v4M8 3v4M3 10h18"/>',
  music: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  bed: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9"/>',
  arrow: '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[n] || ""}</svg>`;

const NAV = [
  { id: "home", label: "Home", href: "index.html" },
  {
    id: "about", label: "About", href: "about.html",
    sub: [
      { label: "About the School", href: "about.html" },
      { label: "Director's Message", href: "about.html#director" },
      { label: "Principal's Message", href: "about.html#principal" },
      { label: "Our Faculty", href: "faculty.html" },
    ],
  },
  { id: "academics", label: "Academics", href: "academics.html" },
  { id: "facilities", label: "Facilities", href: "facilities.html" },
  { id: "gallery", label: "Gallery", href: "gallery.html" },
  { id: "disclosure", label: "Disclosure", href: "disclosure.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
  { id: "admissions", label: "Admissions 2026-27", href: "admissions.html", cta: true },
];

function navHtml(active) {
  return NAV.map((n) => {
    const cls = [n.sub ? "has-sub" : "", n.cta ? "nav-cta" : ""].filter(Boolean).join(" ");
    const a = `<a href="${n.href}"${n.id === active || (n.sub && active === "faculty" && n.id === "about") ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`;
    const sub = n.sub ? `<ul class="submenu">${n.sub.map((s) => `<li><a href="${s.href}">${s.label}</a></li>`).join("")}</ul>` : "";
    return `<li${cls ? ` class="${cls}"` : ""}>${a}${sub}</li>`;
  }).join("\n          ");
}

const S = SCHOOL;
const V = Date.now().toString(36); // cache-buster for CSS/JS
const header = (active) => `
<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar">
  <div class="container">
    <div class="topbar-left">
      <span class="topbar-item"><span class="cbse-badge">CBSE</span> Affiliation No. ${S.affiliation} &nbsp;|&nbsp; School Code ${S.schoolCode}</span>
      <a class="topbar-item hide-sm" href="tel:${S.phone1raw}">${icon("phone")} ${S.phone1}</a>
      <a class="topbar-item hide-sm" href="mailto:${S.email}">${icon("mail")} ${S.email}</a>
    </div>
    <div class="topbar-right">
      <a class="topbar-item" href="${S.erp}" target="_blank" rel="noopener">${icon("login")} ERP Login</a>
      <a class="topbar-item" href="${S.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
      <a class="topbar-item" href="${S.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="index.html" aria-label="${S.name} home">
      <img src="assets/img/logo.jpg" alt="${S.name} crest" width="58" height="58">
      <span><span class="brand-name">${S.name}</span><span class="brand-sub">Samastipur, Bihar · Nursery to XII</span></span>
    </a>
    <nav class="main-nav" aria-label="Main">
      <ul>
          ${navHtml(active)}
      </ul>
    </nav>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">${icon("menu")}</button>
  </div>
</header>
<div class="nav-backdrop"></div>`;

const footer = () => `
<footer class="site-footer">
  <div class="container footer-top">
    <div>
      <div class="footer-brand">
        <img src="assets/img/logo.jpg" alt="" width="56" height="56">
        <div><strong>${S.name}</strong><span>Affiliated to CBSE, New Delhi</span></div>
      </div>
      <p>A co-educational, English-medium school from Nursery to Class XII, with Science and Commerce streams at the senior secondary level. ${S.tagline}.</p>
      <p style="font-family:var(--font-hindi);color:var(--gold);font-size:1.15rem;margin:0">${S.motto}</p>
      <div class="socials">
        <a href="${S.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
        <a href="${S.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
        <a href="${S.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon("youtube")}</a>
        <a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("whatsapp")}</a>
      </div>
    </div>
    <div>
      <h4>Explore</h4>
      <ul class="footer-links">
        <li><a href="about.html">About Us</a></li>
        <li><a href="academics.html">Academics</a></li>
        <li><a href="facilities.html">Facilities</a></li>
        <li><a href="faculty.html">Our Faculty</a></li>
        <li><a href="gallery.html">Gallery</a></li>
      </ul>
    </div>
    <div>
      <h4>Parents &amp; Students</h4>
      <ul class="footer-links">
        <li><a href="admissions.html">Admission Process</a></li>
        <li><a href="${S.onlineAdmission}" target="_blank" rel="noopener">Online Registration</a></li>
        <li><a href="disclosure.html">Mandatory Disclosure</a></li>
        <li><a href="https://results.cbse.nic.in/" target="_blank" rel="noopener">CBSE Results</a></li>
        <li><a href="https://cbseacademic.nic.in/curriculum.html" target="_blank" rel="noopener">CBSE Curriculum</a></li>
        <li><a href="${S.erp}" target="_blank" rel="noopener">ERP Login</a></li>
      </ul>
    </div>
    <div>
      <h4>Get in Touch</h4>
      <ul class="footer-links f-contact">
        <li><svg viewBox="0 0 24 24">${ICONS.pin}</svg><span>${S.address}</span></li>
        <li><svg viewBox="0 0 24 24">${ICONS.phone}</svg><span><a href="tel:${S.phone1raw}">${S.phone1}</a><br><a href="tel:${S.phone2raw}">${S.phone2}</a><br><a href="tel:${S.phone3raw}">${S.phone3}</a></span></li>
        <li><svg viewBox="0 0 24 24">${ICONS.mail}</svg><a href="mailto:${S.email}">${S.email}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>© <span data-year>2026</span> ${S.name}, Samastipur. All rights reserved.</span>
      <span>CBSE Affiliation No. ${S.affiliation} · School Code ${S.schoolCode}</span>
    </div>
  </div>
</footer>
<a class="float-wa" href="https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Hello, I would like to know about admissions at J.P. Central School.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>
<button class="to-top" aria-label="Back to top">↑</button>`;

const schemaOrg = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "School",
  name: S.name,
  url: S.siteUrl,
  logo: S.siteUrl + "assets/img/logo.jpg",
  email: S.email,
  telephone: S.phone1raw,
  foundingDate: S.established,
  address: { "@type": "PostalAddress", streetAddress: "Mathurapur Ghat", addressLocality: "Samastipur", addressRegion: "Bihar", postalCode: "848101", addressCountry: "IN" },
  sameAs: [S.instagram, S.facebook],
});

function page(meta, body) {
  const title = meta.nav === "home" ? `${S.name}, Samastipur | CBSE School, Nursery to XII` : `${meta.title} | ${S.name}, Samastipur`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${meta.desc}">
<meta name="theme-color" content="#14254a">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${meta.desc}">
<meta property="og:image" content="assets/img/hero1.jpg">
<meta property="og:type" content="website">
<link rel="icon" href="assets/img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
<script type="application/ld+json">${schemaOrg}</script>
</head>
<body>
${header(meta.nav)}
<main id="main">
${body.trim()}
</main>
${footer()}
<script src="assets/js/main.js?v=${V}"></script>
</body>
</html>
`;
}

function fill(text) {
  return text
    .replace(/\{\{icon:([a-z]+)\}\}/g, (_, n) => icon(n))
    .replace(/\{\{school\.([a-zA-Z0-9]+)\}\}/g, (_, k) => (S[k] !== undefined ? S[k] : `{{school.${k}}}`));
}

let count = 0;
for (const file of fs.readdirSync(PAGES).filter((f) => f.endsWith(".html"))) {
  const raw = fs.readFileSync(path.join(PAGES, file), "utf8");
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->/);
  if (!m) { console.warn("skip (no meta):", file); continue; }
  const meta = JSON.parse(m[1]);
  const body = fill(raw.slice(m[0].length));
  fs.writeFileSync(path.join(ROOT, file), page(meta, body));
  count++;
  console.log("built", file);
}
console.log(`\nDone — ${count} pages.`);
