# Jig Token Adoption: Implementation Plan

**Spec:** docs/specs/2026-09-18-one-page-branding-design.md
**Goal:** adopt the jig token layer as the single source of truth, fix all 22 mechanical findings, keep brand typography.
**Architecture:** jig init wrote `jig.config.json` (brand + surfaces mode=product), `assets/css/jig/brand.genawards.css`, `assets/css/jig/mode.product.css`, `assets/css/jig/theme.css`. `tokens.css` becomes an aggregator that imports the jig theme; `style.css` migrates every token reference from the legacy names to jig semantic names; `index.html` gets em-dash fixes and swatch values recomputed from the new palette. No build step, no dependency: the token barrel is plain CSS `@import`.

## Global constraints
- Pure HTML5/CSS3/vanilla JS; no dependency added to the page.
- No hardcoded color/pixel value at call sites in `style.css`: every color, size, radius, shadow, duration and font comes from a jig token.
- Self-hosted brand look kept: Fraunces display, Inter body, JetBrains Mono (Google Fonts link in `index.html` stays).
- Combined main.js+gallery.js stays under 15360 bytes (currently 5130).
- One commit per task, on `main`.
- Indonesian copy; plain rule: no em dash anywhere in `index.html`.

## Task 1: Wire jig tokens + brand font override → verify: `node --check is unaffected; index.css imports footer present; `rg -c '^@import' assets/css/tokens.css` returns at least 1

**Files:**
- Modify: `assets/css/tokens.css`
- Modify: `assets/css/jig/brand.genawards.css`
- Modify: `jig.config.json` (already committed as workspace state; confirm content, do not re-commit)

- [x] Step 1: Replace the entire body of `assets/css/tokens.css` with an aggregator: a header comment naming jig as the token source, then at the very top:
```css
@import "./jig/theme.css";
```
The full file content becomes:
```css
/* tokens.css — aggregator. The token source is the Jig token layer
   (assets/css/jig/). This file only wires it into the page. */
@import "./jig/theme.css";
```
- [x] Step 2: In `assets/css/jig/brand.genawards.css`, in the `:root` block, replace the `/* ================= TYPE ================= */` section (lines 123-127) so brand typography is kept:
```css
  --font-text:    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Fraunces", "Inter", serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", monospace;
  --font-numeric-features: "tnum" 1, "lnum" 1;
```
- [ ] Step 3: In the same brand file, add the warm cream accent the interface uses for badges, hover fills and the moodboard figure placeholder. In the `:root` block, after the brand foregrounds block (after the `--color-on-brand` line), append:
```css
  --color-accent:       oklch(0.93 0.04 80);   /* warm cream, brand-specific fill */
  --color-accent-text:  var(--color-text-strong);
```
Then mirror it in BOTH dark blocks (the `@media (prefers-color-scheme: dark)` block and the `:root[data-theme="dark"]` block), each after its own `--color-on-brand` line:
```css
  --color-accent:       oklch(0.30 0.02 80);   /* warm cream fill, dark adjusted   */
  --color-accent-text:  var(--color-text-strong);
```
- [x] Step 4: Verify the four blocks are present, then commit as `feat: adopt jig token layer, keep brand fonts`.

## Task 2: Migrate style.css to jig tokens → verify: `node`/`rg` checks below exit 0

**Files:**
- Modify: `assets/css/style.css`

Legacy → jig mapping (both axes observed from `tokens.css` and the generated jig files). Apply everywhere in this file, no exceptions:

| Legacy token | Jig token |
|---|---|
| `--font-body` | `--font-text` |
| `--font-display` | `--font-display` (already jig name) |
| `--font-mono` | `--font-mono` (already jig name) |
| `--color-primary` | `--color-brand` |
| `--color-primary-hover` | `--color-brand` (same; no separate hover color) |
| `--color-secondary` | `--color-text-strong` (toast background) |
| `--color-accent` | `--color-accent` (new brand token) |
| `--color-bg` | `--color-bg-base` |
| `--color-surface` | `--color-bg-raised` |
| `--color-text` | `--color-text-strong` |
| `--color-text-muted` | `--color-text-weak` |
| `--color-border` | `--color-stroke-weak` |
| `--space-xs` | `--spacing-2xs` |
| `--space-sm` | `--spacing-xs` |
| `--space-md` | `--spacing-s` |
| `--space-lg` | `--spacing-m` |
| `--space-xl` | `--spacing-l` |
| `--space-2xl` | `--spacing-xl` |
| `--radius-sm` | `--radius-sm` (jig 8px) |
| `--radius-md` | `--radius-md` (jig 16px) |
| `--radius-lg` | `--radius-lg` (jig 32px) |
| `--shadow-card` | `--shadow-raised` |
| `--shadow-hover` | `--shadow-overlay` |
| `--duration` | `--duration-base` (150ms) |
| `--ease-out` | `--ease-out` (same name) |

Font-size hardcodes (H-47, 12 sites) → text tokens from `mode.product.css`:

| Hardcode (line) | Token |
|---|---|
| `16px` (body, line 17) | `var(--text-body)` |
| `0.75rem` (badge 102, btn 311, swatch__meta 355, type__meta 395, scale__label 431) | `var(--text-caption)` |
| `1.125rem` (site-header__brand 186) | `var(--text-prose)` |
| `0.875rem` (card__body p 269, mono sample 389, figure caption 492) | `var(--text-caption)` |
| `3rem` (display sample 376) | `var(--text-h1)` |
| `1rem` (body sample 383) | `var(--text-body)` |

Focus ring: `.focus-visible` uses `outline: 2px solid var(--color-brand); outline-offset: 2px;` (keep values, swap token).

Buttons (C-19, lines 133 and 141): `.button` background `var(--color-brand)`, text `var(--color-on-brand)`. `.button:hover` keeps `background-color: var(--color-brand)` (no lighten step; the darker brand color now clears 4.5:1) and its own `color: var(--color-on-brand)`. Delete the `:hover` background change.

- [ ] Step 1: Apply the token mapping above across the whole file (every legacy `--color-*`, `--space-*`, `--shadow-*`, `--duration`, `--font-body`, `--radius-*` occurrence). No occurrence may remain.
- [ ] Step 2: Replace the 12 hardcoded font sizes per the table. No `font-size` may carry a raw length.
- [ ] Step 3: Fix the two C-19 sites (`.button` and `.button:hover`, lines 133 and 141) per the buttons paragraph.
- [ ] Step 4: Run `rg -c 'var\(--color-(primary|primary-hover|secondary|surface|bg\)|var\(--space-|var\(--shadow-card)|var\(--shadow-hover)|var\(--duration\)|var\(--font-body\)' assets/css/style.css`, expect no match (count 0). Run `rg -c 'font-size: [0-9]' assets/css/style.css`, expect no match. Run `node --check assets/js/main.js` and `node --check assets/js/gallery.js`, expect exit code 0 each (guards against a stray edit).
- [ ] Step 5: Commit as `refactor: migrate styles to jig tokens`.

## Task 3: Fix index.html em dashes + recompute swatch values → verify: `rg -c '—' index.html` returns 0; all `data-copy` values match computed token hexes

**Files:**
- Modify: `index.html`

- [ ] Step 1: Replace every em dash (`—`) in interface text with a comma or colon. Sites observed:
  - line 7 `og:title content="GenAwards — Design Kit Event"` and line 11 `<title>`: replace ` — ` with ` · `
  - lines 255, 259, 263, 267, 271, 275 figcaption: replace `<strong>…</strong> — sumber:` with `<strong>…</strong>. Sumber:` (period after the close tag, then a space). Keep the Indonesian copy otherwise.
- [ ] Step 2: Compute the resolved hex of every rendered swatch color. Source of truth is the jig token file after Task 1, evaluated in light mode against `--color-bg-raised` (the card/surface the swatch sits on), and in the two dark blocks for the dark swatches. Resolve with a browser or by converting the token value to sRGB hex offscreen (e.g. a headless Chromium `getComputedStyle`). Record the result as a table.
- [ ] Step 3: Update every swatch `data-copy` and its `swatch__meta` text (`#HEX · RGB r, g, b`) to the computed hex/RGB from step 2. The nine light swatches: `swatch--primary`, `swatch--primary-hover`, `swatch--secondary`, `swatch--accent`, `swatch--bg`, `swatch--surface`, `swatch--text`, `swatch--text-muted`, `swatch--border` (lines 38-81). The five dark swatches: `swatch--bg`, `swatch--surface`, `swatch--text`, `swatch--text-muted`, `swatch--border` under "Palet Gelap" (lines 88-111). `swatch--secondary` maps to `--color-text-strong` per Task 2 mapping; `swatch--primary-hover` label value equals the primary value.
- [ ] Step 4: Verify: `rg -c '—' index.html` returns 0. Confirm each `data-copy` matches the resolved table. Run `node --check assets/js/main.js` exit 0 and `node --check assets/js/gallery.js` exit 0.
- [ ] Step 5: Commit as `fix: replace em dashes, publish recomputed swatch values`.

## Task 4: Re-run jig check, close remaining findings → verify: `jig check --json` reports 0 errors

**Files:**
- Any of the above, as the check dictates

- [ ] Step 1: Run `npx jig-ui@0.12.0 check --all --json`. Expect 0 errors (warnings may remain and are logged, not gated).
- [ ] Step 2: If any `error`-severity finding remains, resolve it within the token layer or `style.css`: a finding that needs a new token is a value added to `assets/css/jig/brand.genawards.css` (edited file, safe from `jig update`), never a raw value at a call site.
- [ ] Step 3: Commit only if a code change was made, as `fix: resolve remaining jig findings`.
- [ ] Step 4: Run `git status --porcelain`, expect clean.