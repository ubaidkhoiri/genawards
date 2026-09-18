---
title: One-page Branding Consolidation
date: 2026-09-18
status: approved
---

# One-page Branding Consolidation: Design

## Problem

The site is split into four pages: index, branding, assets and moodboard. The user wants one page, branding first, that also shows the asset catalog and the moodboard. The current landing hero and the "Cara Pakai" section occupy space without serving the branding-first goal. The index "Cara Pakai" step cards also render without internal padding, because `.card--step` has no rule in `assets/css/style.css`.

## Goals

- The whole site renders as one HTML page, `index.html`, served by GitHub Pages as before.
- The page opens directly into the branding section, first on the page, before assets and moodboard.
- The asset catalog (search, filter chips, card grid) works on the same page, fed by `assets/data/assets.json`, with download and copy actions intact.
- The moodboard masonry grid renders on the same page.
- The step cards on the compact page render with correct internal padding.
- Page remains a static site, no frameworks, no build step, JS below 15KB combined.
- `branding.html`, `assets.html`, `moodboard.html` are deleted from the repository.

## Non-goals

- No new pages, no routing, no frameworks.
- No change to `assets/data/assets.json` schema or the asset files themselves.
- No new visual design language: colors and tokens stay as-is.
- No lightbox for moodboard.
- No other sections added to the page.

## Constraints

- Pure HTML5 + CSS3 + Vanilla JS. Zero dependency, zero build step.
- Every CSS value from `assets/css/tokens.css`, no hardcoded hex inside `style.css`.
- No `style=` attribute inside any HTML file.
- Combined `main.js` + `gallery.js` below 15360 bytes.
- Mobile-first, breakpoints at 640px and 1024px.
- Keyboard accessible: interactive elements tabbable, visible `:focus-visible`.
- Semantic HTML, alt text on all images, AA contrast for text.
- Relative paths only, for GitHub Pages subpath hosting.
- Indonesian copy, consistent with the existing pages.
- One commit per implementation task.

## Approach

Restructure `index.html` into one long page.

1. Delete `branding.html`, `assets.html`, `moodboard.html` from the repo.
2. Rebuild `index.html` with:
   - `<header>`: site brand and theme toggle only. No nav links, no anchor links.
   - `<section id="branding">`: the branding content, moved from `branding.html`. Subsections: color palette (light + dark swatch grids), typography specimens, logo usage variants, do/don't grid, spacing and radius reference. The section leads the page with a compact title line in place of the old hero.
   - `<section id="assets">`: search input, filter chips, asset card grid, rendered by `gallery.js` from `assets/data/assets.json`.
   - `<section id="moodboard">`: the masonry grid and its six figures, moved from `moodboard.html`.
   - `<footer>`: the existing footer with the GitHub repo link.
3. Section spacing on the compact page uses a tighter rhythm than the current `--space-2xl`/`--space-xl` section padding, so the page reads as high density.
4. Fix the missing `.card--step` padding: add a rule (step number, title, body) in `assets/css/style.css` sized from tokens, or fold the pattern into the branding section layout that replaces the old "Cara Pakai" cards.
5. `main.js` keeps the theme toggle, toast and copy-to-clipboard. Its active-nav logic no longer has page links to mark, so it is trimmed. `gallery.js` is unchanged in behaviour.

The page copy keeps the event branding voice. The old hero heading and the "Cara Pakai" section are dropped; their content does not move into the new page.

## Alternatives considered

- Second approach considered: keep separate pages and add a prominent branding anchor from the landing. Rejected: the user asked for one page, and the current separate pages would still duplicate the same HTML shell three times.
- Third approach considered: embed assets and moodboard via `<iframe>`. Rejected: iframes block keyboard focus, hurt the compact density goal, and break the shared theme toggle and copy-to-clipboard behaviour.

## Testing

- `node --check` passes on `assets/js/main.js` and `assets/js/gallery.js`.
- `grep -c "class.*card--step"` report in CSS: step card padding rule exists and pads the card interior.
- `grep -L "assets.html" index.html` reports no leftover link to deleted pages; `grep -c "branding.html" index.html` is 0, same for `moodboard.html`.
- `assets.html`, `branding.html`, `moodboard.html` do not exist on disk after the change.
- `git diff --stat` shows the three page deletes plus `index.html`, `style.css`, `main.js` changes.
- Combined `main.js` + `gallery.js` byte size below 15360.
- `assets/data/assets.json` parses as JSON.
- Relative asset paths resolve on disk.
- Dark theme toggle still flips `data-theme` on `<html>` and persists to localStorage.

## Open questions

None. The design and page structure are settled with the user.