# J.P. Central School — Website

Static website (HTML + CSS + JS). No database or server is needed, so it can be hosted on any web host (Hostinger, GoDaddy cPanel), Netlify, Vercel or GitHub Pages.

## Pages
| File | Page |
|---|---|
| `index.html` | Home: hero, notices, stages, leaders, facilities, gallery, admission CTA |
| `about.html` | About, vision/mission/philosophy, Director & Principal messages |
| `academics.html` | Pre-Primary → Senior Secondary, assessment, activities |
| `admissions.html` | Process, documents, age criteria, WhatsApp enquiry form |
| `facilities.html` | Labs, library, sports, hostel, transport, safety |
| `gallery.html` | Filterable photo gallery with lightbox |
| `faculty.html` | Teaching staff |
| `disclosure.html` | CBSE Mandatory Public Disclosure |
| `contact.html` | Address, phones, map, enquiry form |

## How to edit
1. Edit the page content in `src/pages/*.html`.
   School details (phones, email, affiliation no., links) are set **once** in the `SCHOOL` object at the top of `src/build.js`.
   The header, menu and footer are also in `src/build.js`.
2. Rebuild: `node src/build.js`. This regenerates the `.html` files in the root folder.
3. Upload everything **except** `src/` and `.claude/` to the web host.

Do not edit the root `.html` files directly. They are overwritten on every build.

## Preview locally
```
python -m http.server 5520
```
Then open http://localhost:5520

## Still to do (needs information from the school)
- `docs/`: upload the CBSE disclosure PDFs (names listed in `docs/README.txt`).
- Confirm the teacher-section ratio, office hours, transport, and the Class XII result figures in `disclosure.html`.
- A high-resolution logo (the current one is 150 px from Instagram). Save it as `assets/img/logo.jpg` or `.png`.
- Add more photos to `assets/img/gallery/` and list them in `src/pages/gallery.html`.
- Forms open WhatsApp to +91 94304 41288. Change `whatsapp` in `src/build.js` if needed.
