# GenAwards Design Kit

Situs statis berisi katalog aset desain (PNG/SVG), panduan brand, dan moodboard untuk kebutuhan visual acara GenAwards. Dihosting di GitHub Pages tanpa proses build: tidak ada framework, tidak perlu instalasi apa pun untuk mengedit konten.

## Struktur folder

```
genawards/
├── index.html                 # Halaman beranda
├── branding.html              # Halaman panduan brand
├── moodboard.html             # Halaman moodboard
├── assets.html                # Halaman katalog aset
├── assets/
│   ├── css/
│   │   ├── style.css          # Gaya tampilan umum
│   │   └── tokens.css         # Token warna, tipografi, dan jarak
│   ├── js/
│   │   ├── main.js            # Perilaku umum semua halaman
│   │   └── gallery.js         # Logika galeri/katalog aset
│   ├── images/
│   │   ├── logos/             # Thumbnail preview aset logo
│   │   ├── banners/           # Thumbnail preview aset banner
│   │   ├── icons/             # Thumbnail preview aset ikon
│   │   └── backgrounds/       # Thumbnail preview aset latar
│   ├── moodboard/             # Gambar referensi moodboard
│   └── data/
│       └── assets.json        # Daftar aset yang ditampilkan di katalog
├── downloads/
│   ├── png/                   # File aset siap unduh (PNG)
│   └── svg/                   # File aset siap unduh (SVG)
└── .github/
    └── workflows/
        └── deploy.yml         # Workflow deploy otomatis ke GitHub Pages
```

## Menambah aset

1. Unggah file aset ke `downloads/svg/` dan `downloads/png/`.
2. Tambahkan satu entri di `assets/data/assets.json` mengikuti bentuk entri yang ada. Contoh (mirip aset `logo-primary`):

```json
{
  "id": "logo-primary",
  "name": "Logo Primary",
  "category": "logo",
  "tags": ["logo", "primary"],
  "preview": "./assets/images/logos/logo-primary-preview.png",
  "downloads": {
    "svg": "./downloads/svg/logo-primary.svg",
    "png": "./downloads/png/logo-primary.png"
  },
  "description": "Logo utama GenAwards untuk header dan banner."
}
```

3. Unggah thumbnail preview ke `assets/images/<kategori>/` dan isi kolom `preview` dengan path tersebut.
4. Commit perubahan. Katalog di `assets.html` otomatis membaca `assets.json` tanpa perlu mengubah kode.

## Mengubah warna brand

Edit nilai token warna di `assets/css/tokens.css` (misalnya `--color-primary`), lalu commit. Semua halaman mengikuti perubahan tersebut secara otomatis karena memakai token yang sama.

## Menambah item moodboard

1. Unggah gambar ke `assets/moodboard/`.
2. Tambahkan satu `<figure>` di `moodboard.html` di dalam `.grid`:

```html
<figure class="figure">
  <img class="figure__img" src="./assets/moodboard/nama-file.png" alt="Deskripsi singkat" loading="lazy">
  <figcaption class="figure__caption"><strong>Judul</strong> — sumber: ... Mood: ...</figcaption>
</figure>
```

3. Commit perubahan.

## Deploy

Push ke branch `main`. Workflow `.github/workflows/deploy.yml` membangun dan menerbitkan situs secara otomatis; situs live dalam sekitar 1 menit.

## Setup GitHub Pages (pertama kali)

Repo Settings, menu Pages, pada Source pilih "GitHub Actions", lalu lakukan push pertama ke `main`.

## Konstrain tanpa build

Situs ini nol build dan tanpa framework: cukup commit file lalu push, tidak perlu instalasi atau perintah build apa pun.