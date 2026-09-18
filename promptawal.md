```markdown
# ROLE & MISSION

Kamu adalah senior frontend engineer + design system architect. Tugasmu membangun **website statis untuk kebutuhan event design kit** yang di-host di GitHub Pages. Website ini berfungsi sebagai katalog asset siap pakai (PNG/SVG/ZIP), branding guide, dan moodboard untuk kebutuhan event (poster, banner, ID card, backdrop, dsb).

Target: user cukup upload file ke folder `assets/`, push ke GitHub, dan asset otomatis tampil di web dengan preview + tombol download.

# TECH STACK (WAJIB)

- **Pure HTML5 + CSS3 + Vanilla JavaScript** — TANPA build step, TANPA framework, TANPA npm/node_modules.
- **GitHub Pages** sebagai hosting (deploy dari branch `main`).
- **GitHub Actions** untuk auto-deploy setiap push.
- Semua harus bisa di-edit langsung via GitHub web editor tanpa install apapun.
- Zero dependency eksternal kecuali Google Fonts (opsional, boleh self-host).

# STRUKTUR FOLDER (WAJIB DIIKUTI)

```text
/
├── index.html                    # Landing page
├── branding.html                 # Brand guideline (warna, font, logo usage)
├── moodboard.html                # Moodboard visual direction
├── assets.html                   # Katalog asset + download
├── assets/
│   ├── css/
│   │   ├── style.css             # Global styles
│   │   └── tokens.css            # Design tokens (warna, spacing, font)
│   ├── js/
│   │   ├── main.js               # Nav, theme toggle, copy-to-clipboard
│   │   └── gallery.js            # Render asset cards dari data JSON
│   ├── images/
│   │   ├── logos/                # Logo PNG/SVG
│   │   ├── banners/              # Banner event
│   │   ├── icons/                # Ikon SVG
│   │   └── backgrounds/          # Background/texture
│   ├── moodboard/                # Gambar referensi moodboard
│   └── data/
│       └── assets.json           # Manifest asset (nama, kategori, path, deskripsi)
├── downloads/
│   ├── png/                      # File PNG siap download
│   ├── svg/                      # File SVG siap download
│   └── packs/                    # ZIP bundle (logo-pack.zip, dsb)
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

# DESIGN TOKENS (WAJIB DIPAKAI)

Buat `assets/css/tokens.css` sebagai sumber kebenaran tunggal:

```css
:root {
  /* Warna — sesuaikan dengan brand event, contoh: */
  --color-primary: #FF5A1F;
  --color-primary-hover: #E84A0F;
  --color-secondary: #1A1A1A;
  --color-accent: #F5E6D3;
  --color-bg: #FAFAF7;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6B6B;
  --color-border: #E5E5E0;

  /* Typography */
  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing scale (8pt) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;

  /* Radius & shadow */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.08);

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration: 220ms;
}

[data-theme="dark"] {
  --color-bg: #0F0F0E;
  --color-surface: #1A1A19;
  --color-text: #F5F5F0;
  --color-text-muted: #9A9A95;
  --color-border: #2A2A28;
}
```

**Aturan:** SEMUA warna, spacing, font, radius di seluruh CSS HARUS pakai variabel dari tokens.css. Dilarang hardcode nilai.

# HALAMAN & FITUR

## 1. index.html — Landing
- Hero section: judul event kit, tagline, 2 CTA ("Lihat Asset" → assets.html, "Brand Guide" → branding.html).
- Grid 3-4 preview kategori (Logo, Banner, Icon, Background) dengan jumlah file.
- Section "Cara Pakai" (3 langkah: pilih → download → pakai).
- Footer dengan link GitHub repo.

## 2. assets.html — Katalog Asset
- Search bar (filter by nama/tag) — pure JS, filter `assets.json` di client.
- Filter chips per kategori (All, Logo, Banner, Icon, Background).
- Grid card asset. Setiap card:
  - Preview thumbnail (background checkered untuk PNG transparan).
  - Judul + kategori badge.
  - Tombol download per format: SVG / PNG / ZIP.
  - Tombol "Copy path" (copy relatif path ke clipboard).
- Data asset di-render dari `assets/data/assets.json`.

**Format `assets.json`:**
```json
{
  "assets": [
    {
      "id": "logo-primary",
      "name": "Primary Logo",
      "category": "logo",
      "tags": ["logo", "primary", "horizontal"],
      "preview": "assets/images/logos/logo-primary-preview.png",
      "downloads": {
        "svg": "downloads/svg/logo-primary.svg",
        "png": "downloads/png/logo-primary.png"
      },
      "description": "Logo utama untuk header dan banner."
    }
  ]
}
```

## 3. branding.html — Brand Guideline
- **Color palette**: swatch grid, klik untuk copy hex (`navigator.clipboard.writeText`). Tampilkan hex + RGB + nama.
- **Typography**: specimen font display, body, mono. Tampilkan nama, weight, ukuran, line-height.
- **Logo usage**: primary, white, icon-only, horizontal, vertical. Setiap varian ada tombol download.
- **Do & Don't**: contoh penggunaan logo yang benar/salah (grid 2 kolom).
- **Spacing & radius**: visual scale referensi.

## 4. moodboard.html — Moodboard
- CSS Grid masonry-style (pakai `grid-auto-rows` + `row-span`).
- Setiap item: gambar + caption singkat (sumber, keyword mood).
- Tanpa JavaScript framework. Lightbox optional pakai `<dialog>`.

# INTERAKSI WAJIB

1. **Copy-to-clipboard** untuk hex code & asset path — pakai `navigator.clipboard.writeText()`, tampilkan toast "Copied!".
2. **Dark/light toggle** — simpan preferensi di `localStorage`, apply `data-theme` di `<html>`.
3. **Download** — pakai `<a href="..." download>` untuk single file. Untuk bundle, sediakan ZIP di `downloads/packs/`.
4. **Search & filter** — client-side, filter array dari `assets.json`, re-render grid.
5. **Keyboard accessible** — semua tombol/interaktif harus bisa di-tab, ada `:focus-visible` style.

# AKSESIBILITAS & PERFORMANCE

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`).
- Alt text di semua gambar.
- Kontras warna minimal AA (4.5:1 untuk text).
- `loading="lazy"` di gambar katalog.
- Total JS < 15KB. Tidak ada library.
- Responsive: mobile-first, breakpoint di 640px, 1024px.
- `<meta name="viewport">` + `<meta name="description">` + Open Graph tags.

# GITHUB ACTIONS WORKFLOW

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

# CARA USER UPDATE KONTEN (WAJIB DIDOKUMENTASIKAN DI README)

README harus menjelaskan:
1. **Tambah asset baru**: upload file ke `downloads/svg/` dan `downloads/png/`, tambah entry ke `assets/data/assets.json`, commit. Selesai.
2. **Ganti warna brand**: edit `assets/css/tokens.css`, commit.
3. **Tambah moodboard**: upload gambar ke `assets/moodboard/`, tambah `<figure>` di `moodboard.html`.
4. **Deploy**: push ke `main` → otomatis live dalam ~1 menit.

# CONSTRAINT & LARANGAN

- ❌ JANGAN pakai React, Vue, Svelte, Tailwind CDN, Bootstrap, jQuery.
- ❌ JANGAN pakai build step (Vite, Webpack, Parcel).
- ❌ JANGAN pakai backend/API eksternal.
- ❌ JANGAN hardcode warna — selalu pakai CSS variable.
- ❌ JANGAN pakai inline style kecuali untuk dynamic value dari JS.
- ✅ BOLEH pakai Google Fonts via `<link>`.
- ✅ BOLEH pakai `<dialog>` untuk lightbox/modal.
- ✅ BOLEH pakai CSS Grid, Flexbox, container queries, `:has()`, `clamp()`.

# URUTAN PENGERJAAN

1. Buat `tokens.css` + `style.css` dasar (reset, typography, layout).
2. Buat `index.html` (hero + preview kategori + cara pakai).
3. Buat `assets.html` + `gallery.js` + `assets.json` (sample 4-6 asset dummy).
4. Buat `branding.html` (color, typography, logo, do/don't).
5. Buat `moodboard.html`.
6. Buat `main.js` (theme toggle, copy-to-clipboard, nav active state).
7. Buat `.github/workflows/deploy.yml`.
8. Buat `README.md` lengkap dengan instruksi update konten.

# OUTPUT YANG DIHARAPKAN

- Semua file siap copy-paste ke repo GitHub baru.
- Bisa langsung di-preview dengan buka `index.html` di browser (tanpa server).
- Semua path pakai relative (`./assets/...`) supaya kompatibel dengan GitHub Pages subpath (`username.github.io/repo-name/`).
- Berikan instruksi setup GitHub Pages (Settings → Pages → Source: GitHub Actions) di README.

Mulai dari struktur folder, lalu tokens.css, lalu halaman satu per satu. Setiap selesai satu halaman, konfirmasi sebelum lanjut ke halaman berikutnya.
```

---

## 🎯 Cara Pakai Prompt Ini

1. **Buka agent kamu** (Cursor / Claude Code / Windsurf / Cline).
2. **Buat repo GitHub baru** kosong (jangan init README dulu, biar agent yang buat).
3. **Paste prompt di atas** sebagai instruksi awal.
4. Agent akan mulai dari struktur folder → tokens → halaman. Konfirmasi setiap tahap.
5. Setelah selesai, **aktifkan GitHub Pages**: repo → Settings → Pages → Source: **GitHub Actions**.
6. Push ke `main`, tunggu ~1 menit, web live di `https://username.github.io/nama-repo/`.

## 💡 Tips Vibecoding

- **Ganti contoh warna di tokens.css** dulu sesuai brand event kamu sebelum agent generate halaman lain — supaya konsisten dari awal.
- **Sample `assets.json`** minta agent isi 4-6 dummy asset supaya kamu bisa lihat pola. Ganti dengan asset asli nanti.
- **Setelah live**, kalau mau tambah asset: cukup upload file + edit `assets.json` via GitHub web editor. Tidak perlu sentuh HTML/CSS.
- **Kalau ingin ganti tema visual** (misal dari warm jadi dark editorial): cukup minta agent "ganti nilai tokens.css jadi [referensi]", semua halaman otomatis ikut.
