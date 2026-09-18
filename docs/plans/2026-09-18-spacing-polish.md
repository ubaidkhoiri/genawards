# Spacing Polish: Implementation Plan

**Spec:** docs/specs/2026-09-18-one-page-branding-design.md (approved) + jig mode product layer (jig.config.json surfaces "/" -> product)
**Goal:** Replace chaotic raw spacing with the jig semantic spacing scale so blocks stop stacking flush against each other.
**Architecture:** Pure CSS change. Every vertical rhythm value in assets/css/style.css now reads a semantic spacing token (--spacing-stack, --spacing-group, --spacing-heading-before, --spacing-heading-after, --spacing-section, --spacing-card, --spacing-inline, --spacing-label). index.html needs no structural change.

## Global constraints
- No value change that jig tokens do not already define: all semantic tokens come from assets/css/jig/mode.product.css (`--spacing-2xs:4px`, `--spacing-xs:8px`, `--spacing-s:16px`, `--spacing-m:24px`, `--spacing-l:32px`, `--spacing-xl:48px`, `--spacing-xxl:80px`; `--spacing-stack: var(--spacing-s)`, `--spacing-group: var(--spacing-xs)`, `--spacing-heading-before: var(--spacing-l)`, `--spacing-heading-after: var(--spacing-xs)`, `--spacing-section: var(--spacing-xl)`, `--spacing-section-sm: var(--spacing-l)`, `--spacing-card: var(--spacing-m)`, `--spacing-inline: var(--spacing-xs)`, `--spacing-label: var(--spacing-2xs)`).
- Only assets/css/style.css is modified. index.html, tokens.css, brand.genawards.css, mode.product.css, JS untouched.
- The 8pt ladder stays the only source of numeric intervals. No hardcoded px appears.
- Every heading now carries margin-block from semantic tokens, resolving the computed zero margins (`m00286`: all h2/h3 margin-top 0, margin-bottom 0).

## Task 1: Apply semantic spacing scale to style.css -> verify: no raw px/margin/gap/padding remains; semantic spacing tokens appear 20+ times

**Files:**
- Modify: `assets/css/style.css`

- [x] Step 1: Heading rhythm. In the typography block (lines 49-59), add margin-block using semantic tokens: `h2, h3 { margin-block: var(--spacing-heading-before) var(--spacing-heading-after); }` and `h1 { margin-block: 0 var(--spacing-stack); }`. Keep h4-h6 inherited (no rule). This yields 32px above / 8px below section headings and 16px below h1, giving every badge, title and intro a breathing slot without touching index.html.
- [x] Step 2: Section separator. `.section` (lines 202-204) becomes `padding-block: var(--spacing-section) var(--spacing-section-sm);`. This is the top-level rhythm: 48px above content, 32px below. The first section still opens tight under the header because the header's own block padding already precedes it.
- [x] Step 3: Intro prose. `.section__intro` (lines 327-331): `margin-bottom: var(--spacing-stack);` (16px between intro text and the grid it introduces).
- [x] Step 4: Subhead. `.subhead` (lines 333-335): `margin-top: var(--spacing-heading-before);` (aligns with the tokenized h2/h3 rhythm).
- [x] Step 5: Card padding via semantic token. `.card--do-dont` (line 412): `padding: var(--spacing-stack);`. `.card--logo` (line 405) already uses `--spacing-m`; replace it with `--spacing-card` (same resolved value, but the semantic name). `.figure__caption` (line 491): `padding: var(--spacing-xs) var(--spacing-s)` stays raw-free already, ok. Leave `.card--asset__body` (line 264) as `--spacing-s`.
- [x] Step 6: Type specimen rows. `.type` (lines 369-372): `padding-block: var(--spacing-stack);` resolves 16px like now but semantic; add none else. The last `.type` row needs no special bottom handling because `.subhead` and the h2 rhythm supply the following gap.
- [x] Step 7: Component gaps and micro-space. `.swatch` (line 340): `gap: var(--spacing-group);`. `.swatch__preview` (line 344): `height: var(--spacing-xl);` keep. `.chips` (line 248): `gap: var(--spacing-group);`. `.card--asset__actions` (line 274): `gap: var(--spacing-inline); margin-top: var(--spacing-stack);`. `.site-header__inner` gap (line 179): `var(--spacing-inline)`.
- [x] Step 8: Run `rg -n "(margin|padding|gap)(-top|-bottom|-block|-inline|-[a-z]+)?:" assets/css/style.css` and confirm every matching value is a `var(--spacing-...)` or the single `0` allowed by the block layout. (Raw `px` remains legal in non-spacing properties such as `border`, `max-width`, `minmax`; the scale governs spacing properties only.)
- [x] Step 9: Verify with browser that sections gain vertical rhythm (computed h2 margin-top 32px, h3 margin-top 32px, section padding-top 48px).
- [x] Step 10: Commit as `style: apply jig semantic spacing scale`.
