# Bitscriptum

Materi belajar Bitcoin interaktif, dua bahasa: Bahasa Indonesia (`index.html`) dan English (`en.html`). Situs statis murni, tanpa server, tanpa CDN, tanpa tracker.

## Struktur

```
src/                      ← sumber, yang diedit
  index.html              Bahasa Indonesia
  en.html                 English
  assets/
    app.css               CSS bersama (ID + EN)
    main.id.js  main.en.js     simulasi & navigasi per bahasa
    lang.id.js  lang.en.js     tombol ganti bahasa
    theme.id.js theme.en.js    tema + lab interaktif
    chart-4.4.1.umd.min.js     Chart.js, dimuat saat grafik 5.5 hampir terlihat
    fonts/                Sora + Courier Prime (self-host, lisensi OFL)
build.py                  src/ → dist/
.github/workflows/        deploy otomatis ke GitHub Pages
dist/                     hasil build (tidak di-commit)
```

## Mengedit

Edit langsung file di `src/`. Nama file di sana polos (`main.id.js`, bukan `main.id.880045f73e.js`), jadi tidak perlu mengubah referensi di HTML.

Kalau konten diubah di satu bahasa, jangan lupa padanannya di bahasa lain: `index.html` ↔ `en.html`, `main.id.js` ↔ `main.en.js`, dan seterusnya.

## Preview lokal

```
python3 -m http.server -d src 8000
```

Buka http://localhost:8000. Buka lewat server seperti ini, bukan double-click file HTML.

## Build

```
python3 build.py
```

Hasilnya di `dist/`. Butuh Python 3.8+ tanpa library tambahan. Build melakukan empat hal:

1. Menyalin font, CSS, dan JS dengan hash isi di namanya (`main.id.js` → `main.id.<hash>.js`), supaya browser bisa menyimpannya lama dan otomatis mengambil versi baru setiap isinya berubah.
2. Mengganti semua referensi `assets/...` di HTML dan `url(fonts/...)` di CSS ke nama baru.
3. Menghitung ulang hash CSP untuk script inline. Kalau script inline di HTML diubah, tidak perlu menghitung apa-apa secara manual.
4. Menulis `_headers` dan `.nojekyll`.

Build berhenti dengan pesan yang jelas kalau ada referensi ke file yang tidak ada.

## Deploy ke GitHub Pages

1. Buat repo baru di GitHub, kosong (tanpa README, .gitignore, atau lisensi).
2. Dari folder ini:
   ```
   git init
   git add .
   git commit -m "Bitscriptum"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Buka tab **Actions**. Kalau run pertama gagal karena Pages belum diaktifkan, klik **Re-run all jobs**.

Setelah itu setiap push ke `main` otomatis di-build dan di-deploy ke `https://USERNAME.github.io/NAMA-REPO/`. Semua path di situs ini relatif, jadi jalan di subfolder itu maupun di custom domain (**Settings → Pages → Custom domain**).

### Yang perlu diketahui soal GitHub Pages

GitHub Pages tidak membaca `_headers`, jadi dua hal ini tidak berlaku di sana:

- **Cache aset 1 tahun.** GitHub Pages memakai cache sekitar 10 menit untuk semua file. Situs tetap jalan normal, hanya pengunjung lama mengunduh ulang aset lebih sering.
- **Header keamanan tambahan** (`X-Frame-Options`, `Permissions-Policy`, `X-Content-Type-Options`).

Content-Security-Policy dan `Referrer-Policy: no-referrer` tetap aktif karena dipasang lewat `<meta>` di HTML.

Kalau header-header itu dibutuhkan, repo yang sama bisa disambungkan ke **Cloudflare Pages** atau **Netlify** dengan build command `python3 build.py` dan output directory `dist`. Keduanya membaca `_headers` secara otomatis.

### Alternatif tanpa GitHub Actions

```
python3 build.py -o docs
```

Commit folder `docs/`, lalu pilih **Settings → Pages → Source: Deploy from a branch → `main` / `docs`**. Build harus dijalankan ulang dan di-commit setiap kali `src/` berubah.

## Catatan teknis

- **Jangan memuat apa pun dari domain lain.** CSP hanya mengizinkan file dari situs sendiri, jadi script, font, atau gambar dari CDN akan diblokir browser. Build memberi peringatan kalau menemukannya.
- **Line ending dipaksa LF** lewat `.gitattributes`, supaya hash CSP konsisten di Windows maupun Linux.
- **Chart.js tidak di-hash** karena versinya sudah ada di nama file. Kalau di-upgrade, ganti nama filenya (mis. `chart-4.5.0.umd.min.js`), ubah referensinya di `main.id.js` dan `main.en.js`, dan perbarui `NO_HASH` di `build.py`.
- **Dependabot** mengusulkan update versi GitHub Actions lewat pull request sebulan sekali.

## Lisensi

- Font Sora dan Courier Prime: SIL Open Font License 1.1, teks lisensinya ada di `src/assets/fonts/`.
- Chart.js 4.4.1: MIT License.
- Konten dan kode Bitscriptum: belum ada file `LICENSE`. Tambahkan sesuai keinginan sebelum repo dibuat publik.
