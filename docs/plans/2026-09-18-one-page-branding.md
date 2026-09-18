# One-page Branding Consolidation: Implementation Plan

**Spec:** docs/specs/2026-09-18-one-page-branding-design.md
**Goal:** one compact HTML page, branding first, with the asset catalog and moodboard on the same page.
**Architecture:** rewrite `index.html` as the only page, moving the branding, assets and moodboard content of the three deleted pages into it, trim the theme/copy JS, tighten section spacing, and remove the hero, the category cards and the Cara Pakai section.

## Global constraints

- Pure HTML5 + CSS3 + Vanilla JS, zero dependency, zero build step.
- Every CSS value from `assets/css/tokens.css`; no hardcoded hex inside `style.css`.
- No `style=` attribute inside any HTML file.
- Combined `main.js` + `gallery.js` below 15360 bytes.
- Mobile-first, breakpoints at 640px and 1024px.
- Keyboard accessible: interactive elements tabbable, visible `:focus-visible`.
- Semantic HTML, alt text on all images, AA contrast for text.
- Relative paths only, for GitHub Pages subpath hosting.
- Indonesian copy.
- One commit per task, on `main` (GitHub Pages deploys from `main`).

---

### Task 1: Rebuild index.html as one compact page → verify: `branding`, `assets` and `moodboard` section ids each present, and no `hero`, `card--step`, `<nav` or link to a deleted page anywhere in the file

**Files:**
- Modify: `index.html`

- [x] Step 1: Rewrite `index.html` from the current landing page into a single-page layout.
- [x] Step 2: Keep the existing `<head>` verbatim: viewport, description, OG tags, Google Fonts link, `tokens.css`, `style.css`, title.
- [x] Step 3: `<header class="site-header">` holds only the brand link and the theme toggle button. Remove the `<nav>` block entirely.
- [x] Step 4: Open `<main>` with `<section class="section" id="branding">`. Inside: badge "Panduan brand", `<h1 id="panduan-title">Panduan Brand GenAwards</h1>`, the intro paragraph, then move in order from `branding.html`: Palet Warna (light swatch grid of 9 exactly as-is, then "Palet Gelap" subhead + dark swatch grid of 5 exactly as-is), Tipografi (3 type specimens exactly as-is), Penggunaan Logo (5 card--logo blocks exactly as-is), Lakukan dan Jangan (4 card--do-dont exactly as-is), Spacing dan Radius (both scale groups exactly as-is). Change each subsequent heading from `<h2>` with decorated ids to `<h2>` with the same ids (warna-title, tipografi-title, logo-title, aturan-title, skala-title) and keep every `data-copy`, swatch token class, href and download attribute byte-for-byte.
- [x] Step 5: Close the branding section, then open `<section class="section" id="assets">`. Inside: badge "Katalog asset", `<h2 id="katalog-title">Semua asset siap unduh</h2>`, then exactly the three elements from `assets.html`: the search input (`id="search"`), the chips container (`id="chips"`), the grid container (`id="grid"`).
- [x] Step 6: Close the assets section, then open `<section class="section" id="moodboard">`. Inside: badge "Inspirasi visual", `<h2 id="moodboard-title">Moodboard Event</h2>`, the intro paragraph, then the masonry grid with all 6 `<figure>` elements from `moodboard.html` byte-for-byte.
- [x] Step 7: Close `<main>`. Keep the existing footer verbatim.
- [x] Step 8: Keep both script tags at the end: `<script src="./assets/js/main.js"></script>` then `<script src="./assets/js/gallery.js"></script>`.
- [x] Step 9: Run verify, then commit as `feat: consolidate site into one branding page`.

---

### Task 2: Delete old pages, tighten spacing, trim JS → verify: no page other than `index.html` tracked under `*.html`, combined JS under 15360 bytes, and `node --check` passes

**Files:**
- Delete: `branding.html`, `assets.html`, `moodboard.html`
- Modify: `assets/css/style.css`
- Modify: `assets/js/main.js`

- [x] Step 1: `git rm branding.html assets.html moodboard.html`.
- [x] Step 2: In `assets/css/style.css`, change the `.section` rule so the page reads compact: replace `padding-block: var(--space-2xl) var(--space-xl);` with `padding-block: var(--space-xl) var(--space-lg);`. The first section gets top padding from the header, so the page opens tight against the brand bar.
- [x] Step 3: In `assets/css/style.css`, remove the now-dead rules that served only the landing page: the `.hero` block (lines 221-244), `.card--link` and `.card--link:hover` (lines 256-264), and `.card__meta` (lines 266-270). Leave `.button--ghost` in place (gallery uses the paired `.btn--ghost`).
- [x] Step 4: In `assets/js/main.js`, remove the active-nav block (the final statement block: the `if (!document.querySelector('.nav__link[aria-current]'))` guard through the closing brace before the IIFE ends). No nav exists anymore.
- [x] Step 5: Run verify, then commit as `refactor: delete legacy pages, compact spacing, trim nav js`.