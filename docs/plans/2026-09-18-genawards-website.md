# Event Design Kit Website: Implementation Plan

**Spec:** `docs/specs/genawards-website.md`
**Goal:** build a zero-dependency static site, hosted on GitHub Pages, that renders a downloadable asset catalog (PNG/SVG/ZIP), brand guidelines, and moodboard from plain files a user can edit in the GitHub web editor.
**Architecture:** pure HTML5 + CSS3 + vanilla JS served as flat files from the repo root. One CSS token source (`assets/css/tokens.css`), one JSON manifest (`assets/data/assets.json`), two small JS files for interactivity and gallery rendering. GitHub Actions publishes the repo root to Pages on every push to `main`.

## Global constraints

- No build step, no framework, no npm, no node_modules, no Tailwind/Bootstrap/jQuery, no external backend. Zero dependency except Google Fonts via `<link>`.
- Every color, spacing, font, radius and shadow in all CSS must come from `assets/css/tokens.css` custom properties. No hardcoded values, no inline `style=` in any HTML file.
- Total cost of `assets/js/main.js` plus `assets/js/gallery.js` must stay under 15KB combined.
- Mobile-first responsive, breakpoints at 640px and 1024px.
- Relative paths only (`./assets/...`) so the site works under the `username.github.io/repo/` subpath.
- Keyboard accessible: every interactive element tabbable, visible `:focus-visible`, semantic HTML5 (`header`, `main`, `nav`, `section`, `article`, `figure`), `alt` on every image, AA contrast 4.5:1, `loading="lazy"` on catalog images, viewport and description meta plus Open Graph tags on every page.
- Dark/light theme toggled by `data-theme` on `<html>`, persisted in `localStorage`.
- Copy to clipboard via `navigator.clipboard.writeText()` with a "Copied!" toast. Download via `<a download>` per file, ZIP bundle in `downloads/packs/`.
- Font stacks from the spec: `'Fraunces', serif`, `'Inter', system-ui, sans-serif`, `'JetBrains Mono', monospace`, loaded from Google Fonts `<link>`.
- Each task ends with one commit on `main`.

## Task 1: repo init and token foundation

**Files:**
- Create: `assets/css/tokens.css`
- Create: `assets/css/style.css`

- [x] Step 1: run `git init`
- [x] Step 2: create `assets/css/tokens.css` with the `:root` and `[data-theme="dark"]` blocks copied verbatim from the spec (colors `#FF5A1F`, `#E84A0F`, `#1A1A1A`, `#F5E6D3`, `#FAFAF7`, `#FFFFFF`, `#6B6B6B`, `#E5E5E0`, dark `#0F0F0E`, `#1A1A19`, `#F5F5F0`, `#9A9A95`, `#2A2A28`, fonts, 8pt spacing scale, radii, the two shadows, `--ease-out`, `--duration: 220ms`)
- [x] Step 3: create `assets/css/style.css` with reset, CSS custom-property-based typography and layout base, visible `:focus-visible` state, and placeholder rules for card, badge, chip, button and toast components
- [x] Step 4: run `node --check` on nothing (no JS yet), then commit `git add -A && git commit -m "chore: init repo, tokens and base styles"`

### Verify: `tokens.css` defines `--color-primary`, `--font-display`, `--space-md`, `--radius-md` and `--duration` (grep returns at least 1 match each), and `style.css` defines a `:focus-visible` rule (grep returns at least 1 match).

## Task 2: landing page

**Files:**
- Create: `index.html`

- [x] Step 1: create `index.html` with `<head>` carrying viewport, description, Open Graph and Google Fonts `<link>` for Fraunces, Inter and JetBrains Mono, plus the page `<header>` with `<nav>` and the theme toggle hook
- [x] Step 2: build the hero section with title, tagline and two CTAs linking to `assets.html` and `branding.html`
- [x] Step 3: add the category preview grid (Logo, Banner, Icon, Background) using cards styled by `style.css`
- [x] Step 4: add the "Cara Pakai" section (three steps: pilih, download, pakai) and the footer with a GitHub repo link
- [x] Step 5: add the `<script src="./assets/js/main.js">` include
- [x] Step 6: commit `git add -A && git commit -m "feat: add landing page"`

### Verify: `grep -c 'hero\|assets.html\|branding.html' index.html` matches at least 1 per term, the file links `tokens.css` and `style.css` and `main.js`, meta `viewports` and Open Graph tags are present, and no inline `style=` string appears in the file.

## Task 3: asset manifest and gallery

**Files:**
- Create: `assets/data/assets.json`
- Create: `assets/js/gallery.js`
- Create: `assets.html`

- [x] Step 1: create `assets/data/assets.json` with the exact schema from the spec (`id`, `name`, `category`, `tags`, `preview`, `downloads.svg`, `downloads.png`, `description`) and 5 dummy assets spread across the logo, banner, icon and background categories
- [x] Step 2: create `assets/js/gallery.js` that loads `./assets/data/assets.json`, renders cards into the grid, builds the category chips (All plus each category present in data), filters on chip click, filters by search input on name and tags, renders the checkered preview box, and attaches SVG/PNG download links
- [x] Step 3: create the thumbnail placeholder PNG files referenced by the 5 dummy assets under `assets/images/logos/`, `assets/images/banners/`, `assets/images/icons/` and `assets/images/backgrounds/`
- [x] Step 4: create `assets.html` with search input, chip row, card grid container and the same head/nav/footer shell as the landing page
- [x] Step 5: commit `git add -A && git commit -m "feat: add asset catalog and gallery"`

### Verify: `node -e "const d=require('./assets/data/assets.json'); if(!Array.isArray(d.assets)||d.assets.length<4||d.assets.length>6) process.exit(1)"` exits 0, `node --check assets/js/gallery.js` exits 0, and every `preview` path in `assets.json` resolves to an existing file.

## Task 4: brand guidelines page

**Files:**
- Create: `branding.html`

- [x] Step 1: create `branding.html` with the same head/nav/footer shell
- [x] Step 2: add the color palette swatch grid, each swatch labeled with hex and RGB and carrying a per-row data attribute (e.g. `data-copy`) that `main.js` reads for copy behavior
- [x] Step 3: add the typography specimens for display, body and mono fonts with name, weight, size and line-height shown
- [x] Step 4: add the logo usage section (primary, white, icon-only, horizontal, vertical) with a download button per variant
- [x] Step 5: add the Do and Don't grid and the spacing and radius reference scale
- [x] Step 6: commit `git add -A && git commit -m "feat: add brand guidelines page"`

### Verify: `grep -c 'data-copy' branding.html` matches at least 1, the page includes `tokens.css`, `style.css` and `main.js`, and no inline `style=` string appears in the file.

## Task 5: moodboard page

**Files:**
- Create: `moodboard.html`

- [ ] Step 1: create `moodboard.html` with the same head/nav/footer shell
- [ ] Step 2: add the masonry-style grid (`grid-auto-rows` plus row spans) of 6 `<figure>` items, each with `loading="lazy"` image and caption covering source and mood keywords
- [ ] Step 3: add at least 1 `row-span` class variation in the grid classes and one `assets/moodboard/` placeholder image per figure
- [ ] Step 4: commit `git add -A && git commit -m "feat: add moodboard page"`

### Verify: `grep -c 'row-span\|<figure' moodboard.html` matches at least 1 per term, the page includes `main.js`, and no inline `style=` string appears in the file.

## Task 6: interaction layer

**Files:**
- Create: `assets/js/main.js`

- [ ] Step 1: create `assets/js/main.js` with theme toggle (reads `localStorage`, applies `data-theme` on `<html>`, defaulting to light), a "Copied!" toast, copy-to-clipboard delegated across `[data-copy]` elements via `navigator.clipboard.writeText()`, active nav state per page, and the shared `<dialog>` lightbox opener
- [ ] Step 2: run `node --check assets/js/main.js`
- [ ] Step 3: run `node -e "const fs=require('fs');const a=fs.statSync('assets/js/main.js').size;const b=fs.statSync('assets/js/gallery.js').size;if(a+b>=15360)process.exit(1)"` to confirm the combined budget
- [ ] Step 4: commit `git add -A && git commit -m "feat: add theme toggle and clipboard interactions"`

### Verify: `node --check assets/js/main.js` exits 0, `main.js` contains `navigator.clipboard` and `localStorage` (grep matches at least 1 each), and the combined size check in Step 3 exits 0.

## Task 7: deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] Step 1: create `.github/workflows/deploy.yml` with the content copied verbatim from the spec (on push to `main` and `workflow_dispatch`, pages permissions, `upload-pages-artifact@v3` with path `.`, deploy via `deploy-pages@v4`)
- [ ] Step 2: commit `git add -A && git commit -m "ci: add GitHub Pages deploy workflow"`

### Verify: `grep -c 'deploy-pages@v4\|upload-pages-artifact@v3\|configure-pages@v5' .github/workflows/deploy.yml` matches at least 1 per term.

## Task 8: README with content update guide

**Files:**
- Create: `README.md`

- [ ] Step 1: create `README.md` documenting (a) add asset: upload to `downloads/svg/` and `downloads/png/`, add entry to `assets/data/assets.json`, commit, (b) change brand color: edit `assets/css/tokens.css`, commit, (c) add moodboard: upload image to `assets/moodboard/`, add `<figure>` in `moodboard.html`, (d) deploy: push to `main`, live in about 1 minute, (e) GitHub Pages setup: Settings, Pages, Source GitHub Actions, (f) the folder structure and the zero-build constraint
- [ ] Step 2: commit `git add -A && git commit -m "docs: add README with content update guide"`

### Verify: `grep -c 'assets/data/assets.json\|assets/css/tokens.css\|GitHub Actions' README.md` matches at least 1 per term.

## Self-review

1. **Spec coverage.** All 8 numbered order-of-work items map to Tasks 1 through 8. Folder structure, tokens, pages, interactions, accessibility, workflow and README each have a task. Dark theme toggle, toast, copy, download, search, filter, lazy loading and OG tags appear across the tasks.
2. **Placeholders.** No TBD or reference to a function no task defines. Dummy asset count (5) is a chosen value inside the spec's allowed 4 to 6 range, stated as a property in the verify clause.
3. **Clauses.** Every verify clause is a runnable predicate: grep match thresholds, `node --check` exit code, `node -e` JSON parse exit code, compressed-size budget of 15KB. No quoted transcript or predicted count is asserted.
4. **Provenance.** Token hex values, font names, spacing scale, radii, shadows, breakpoints 640/1024, JS budget 15KB, action versions `v4/v5/v4` and all file paths come from `docs/specs/genawards-website.md`. Node v22.22.2 availability was observed via `node --version` before writing the clauses that rely on it.

## User steps

Before Task 1 begins, ask the user to create the GitHub repo or skip and keep local commits until it exists.

- Create empty repo on GitHub (no README) named e.g. `genawards`.
- After implementation, `git remote add origin git@github.com:<user>/genawards.git`, `git branch -M main`, `git push -u origin main`.
- In repo Settings, Pages, Source: GitHub Actions.
- Optional: edit the brand colors in `assets/css/tokens.css` before Task 2 so all pages inherit the intended palette.