<p align="center">
  <img src="assets/logo.svg" width="72" alt="Bitscriptum logo">
</p>

<h1 align="center">Bitscriptum</h1>

<p align="center">
  Buku interaktif untuk mempelajari protokol Bitcoin — dari genesis block hingga Lightning Network.<br>
  <em>An interactive book for learning the Bitcoin protocol — from the genesis block to the Lightning Network.</em>
</p>

<p align="center">
  <a href="#-bahasa-indonesia">🇮🇩 Bahasa Indonesia</a>
  &nbsp;·&nbsp;
  <a href="#-english">🇬🇧 English</a>
</p>

---

## 🇮🇩 Bahasa Indonesia

### Tentang

Bitscriptum adalah buku Bitcoin interaktif dalam satu file HTML. Isinya:

- **Prologue + 20 bab + Laboratorium + Lampiran**, dari konsep dasar sampai wire protocol, timelock, dan ekonomi mining
- **120+ simulasi interaktif**: mempool, fee market, UTXO set, mining, CoinJoin, soft fork, HTLC, timelock, dan banyak lagi
- **Dua bahasa** (Indonesia / English) yang bisa diganti kapan saja tanpa kehilangan posisi halaman
- **Mode terang/gelap** otomatis mengikuti pengaturan sistem
- **Bisa offline**: cukup buka `index.html`, tidak perlu server atau instalasi

<details>
<summary><b>Daftar isi</b></summary>

| # | Bab |
|---|-----|
| 00 | Prologue — Mengapa Bitcoin? |
| 01 | Bitcoin dari 10.000 Kaki |
| 02 | Wallet dan Private Key |
| 03 | Anatomi Sebuah Transaksi |
| 04 | Kriptografi Bitcoin |
| 05 | Mining dan Proof of Work |
| 06 | Bitcoin Script dan Opcodes |
| 07 | Lightning Network |
| 08 | Node dan Jaringan P2P |
| 09 | Mempool dan Fee Market |
| 10 | UTXO Set dan State Bitcoin |
| 11 | Mining: Hardware, Pool, dan Ekonomi |
| 12 | Privasi On-chain: CoinJoin dan Teknik Lainnya |
| 13 | Soft Fork: Sejarah, Proses, dan Governance |
| 14 | Insiden dan Kejadian Langka di Bitcoin |
| 15 | Waktu di Bitcoin: Timelock, Sequence, dan Kontrak Berbasis Waktu |
| 16 | Menjalankan Node: IBD, Chainstate, dan Verifikasi dari Dalam |
| 17 | SPV & Light Clients: Verifikasi Tanpa Download Semua Data |
| 18 | Wire Protocol & Block Propagation |
| 19 | Mining Economics & Incentive Design |
| 20 | Rangkuman — Seluruh Protokol Bitcoin dalam Satu Bab |
| LAB | Laboratorium — Bongkar isinya, bukan cuma pakai |
| — | Lampiran: Daftar Pustaka, Catatan Penulis, Tentang |

</details>

### Cara membaca

- **Online:** bitscriptum.xyz (rilis tanggal 31 Oktober 2026).
- **Offline:** download repo ini, lalu klik dua kali `index.html`.

### Mengaktifkan GitHub Pages

1. Buka repo di GitHub → **Settings** → **Pages**
2. Di **Build and deployment**, pilih **Source: Deploy from a branch**
3. Pilih branch **`main`** dan folder **`/ (root)`**, lalu **Save**
4. Tunggu 1–2 menit. Situs akan aktif di `https://USERNAME.github.io/bitscriptum/`

### Struktur repo

Source disimpan dalam **dua bentuk** yang selalu sinkron:

| Bentuk | Lokasi | Cocok untuk |
|---|---|---|
| **Full** | `src/id.html`, `src/en.html` | Melihat/mencari di seluruh buku sekaligus |
| **Per bab** | `src/chapters/<bab>/` | Memperbaiki bug di bab tertentu tanpa scroll 43 ribu baris |

```
.
├── index.html                ← hasil build: file yang dibuka pembaca & dipakai GitHub Pages
├── build.py                  ← sinkronisasi + build (Python 3, tanpa dependensi)
├── src/
│   ├── id.html, en.html      ← versi FULL (satu file per bahasa)
│   ├── shell.html            ← pembungkus: iframe + logika ganti bahasa
│   ├── sync-state.json       ← catatan sinkron terakhir (dikelola build.py)
│   └── chapters/             ← versi PER BAB
│       ├── layout.html       ← kerangka dokumen + urutan penyusunan
│       ├── _shared/          ← CSS/JS global, navigasi, ganti bahasa, Chart.js
│       ├── _welcome/  _daftar-bab/  _lampiran/
│       ├── bab-00-prologue/
│       ├── bab-01-bitcoin-dari-10000-kaki/
│       │   ├── style.css             ← CSS bab (dipakai kedua bahasa)
│       │   ├── page.id.html / page.en.html
│       │   └── script.id.js / script.en.js
│       └── ... sampai bab-21-laboratorium/
├── assets/logo.svg
└── .github/workflows/build.yml   ← sinkron + build otomatis di setiap push
```

Daftar lengkap folder per bab ada di [`src/chapters/README.md`](src/chapters/README.md).

**Cara kerjanya:** `index.html` menyimpan kedua dokumen bahasa (dalam bentuk base64) dan menampilkannya di dalam iframe. Saat bahasa diganti, pembungkus memuat dokumen yang lain lalu mengembalikan posisi halaman. Karena semuanya ada di satu file, buku ini tetap jalan walau dibuka langsung dari disk.

### Mengedit konten

Edit di versi mana saja, **full atau per bab**, lalu jalankan:

```bash
python3 build.py
```

`build.py` mendeteksi sisi mana yang kamu ubah, menyinkronkan sisi lainnya, dan memperbarui `index.html`. Commit semua file yang berubah.

**Contoh: ada bug di simulasi 9.3 (RBF & CPFP)**

1. Buka `src/chapters/bab-09-mempool-dan-fee-market/`
2. Perbaiki di `script.id.js` **dan** `script.en.js` (keduanya berisi teks terjemahan, jadi logikanya ada di dua file). Kalau bugnya di CSS, cukup edit `style.css` sekali karena dipakai kedua bahasa.
3. Jalankan `python3 build.py`, lalu commit

> Tips: ID elemen simulasi memakai pola `bNN-sXY`, contoh `b09-s93-rbf-btn` = Bab 9, subbab 9.3. Jalankan `grep -rn "b09-s93" src/chapters/` untuk langsung menemukan file yang tepat.

**Tanpa Python?** Tidak masalah. Edit langsung di GitHub, lalu commit. GitHub Actions akan menjalankan `build.py` dan meng-commit hasil sinkronnya otomatis dalam satu atau dua menit.

| Perintah | Fungsi |
|---|---|
| `python3 build.py` | Sinkron otomatis + build `index.html` |
| `python3 build.py --check` | Cek semuanya sinkron tanpa mengubah apa pun |
| `python3 build.py --from-chapters` | Paksa: versi full disusun ulang dari `src/chapters/` |
| `python3 build.py --from-full` | Paksa: `src/chapters/` dipecah ulang dari versi full |

Kalau kamu mengedit **kedua** versi sebelum menjalankan build, `build.py` akan berhenti dan memintamu memilih `--from-chapters` atau `--from-full`, supaya tidak ada perubahan yang tertimpa diam-diam.

### Catatan data

Angka-angka snapshot di buku ini (harga, hashrate, difficulty, block height, distribusi software node, ukuran dataset) diambil pada berbagai titik sepanjang 2024–2025 dan tidak diperbarui otomatis.

### Penulis

**Maxima Freiman** — [github.com/maximafreiman](https://github.com/maximafreiman)

Komponen pihak ketiga yang disertakan tercantum di [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

---

## 🇬🇧 English

### About

Bitscriptum is an interactive Bitcoin book in a single HTML file. It includes:

- **Prologue + 20 chapters + a Laboratory + Appendix**, from first principles to the wire protocol, timelocks, and mining economics
- **120+ interactive simulations**: mempool, fee market, UTXO set, mining, CoinJoin, soft forks, HTLCs, timelocks, and more
- **Two languages** (Indonesian / English), switchable at any time without losing your place
- **Light/dark mode** that follows your system setting
- **Works offline**: just open `index.html` — no server or install needed

<details>
<summary><b>Table of contents</b></summary>

| # | Chapter |
|---|---------|
| 00 | Prologue — Why Bitcoin? |
| 01 | Bitcoin from 10,000 Feet |
| 02 | Wallets and Private Keys |
| 03 | Anatomy of a Transaction |
| 04 | Bitcoin Cryptography |
| 05 | Mining and Proof of Work |
| 06 | Bitcoin Script and Opcodes |
| 07 | Lightning Network |
| 08 | Nodes and the P2P Network |
| 09 | The Mempool and the Fee Market |
| 10 | The UTXO Set and Bitcoin's State |
| 11 | Mining: Hardware, Pools, and Economics |
| 12 | On-chain Privacy: CoinJoin and Other Techniques |
| 13 | Soft Forks: History, Process, and Governance |
| 14 | Incidents and Rare Events in Bitcoin |
| 15 | Time in Bitcoin: Timelocks, Sequence, and Time-Based Contracts |
| 16 | Running a Node: IBD, Chainstate, and Verification from the Inside |
| 17 | SPV & Light Clients: Verification Without Downloading All the Data |
| 18 | Wire Protocol & Block Propagation |
| 19 | Mining Economics & Incentive Design |
| 20 | Summary — The Entire Bitcoin Protocol in One Chapter |
| LAB | Laboratory — Open it up, do not just use it |
| — | Appendix: Bibliography, Author's Notes, About |

</details>

### Reading

- **Online:** bitscriptum.xyz (Released on October 31, 2026).
- **Offline:** download this repo and double-click `index.html`.

### Enabling GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, choose **Source: Deploy from a branch**
3. Select branch **`main`** and folder **`/ (root)`**, then **Save**
4. Wait a minute or two. The site will be live at `https://USERNAME.github.io/bitscriptum/`

### Repository layout

The source is stored in **two forms** that are always kept in sync:

| Form | Location | Best for |
|---|---|---|
| **Full** | `src/id.html`, `src/en.html` | Viewing/searching the whole book at once |
| **Per chapter** | `src/chapters/<chapter>/` | Fixing a bug in one chapter without scrolling 43k lines |

```
.
├── index.html                ← build output: what readers open & what GitHub Pages serves
├── build.py                  ← sync + build (Python 3, no dependencies)
├── src/
│   ├── id.html, en.html      ← FULL version (one file per language)
│   ├── shell.html            ← wrapper: iframe + language-switch logic
│   ├── sync-state.json       ← last-sync record (managed by build.py)
│   └── chapters/             ← PER-CHAPTER version
│       ├── layout.html       ← document skeleton + assembly order
│       ├── _shared/          ← global CSS/JS, navigation, language switch, Chart.js
│       ├── _welcome/  _daftar-bab/  _lampiran/
│       ├── bab-00-prologue/
│       ├── bab-01-bitcoin-dari-10000-kaki/
│       │   ├── style.css             ← chapter CSS (shared by both languages)
│       │   ├── page.id.html / page.en.html
│       │   └── script.id.js / script.en.js
│       └── ... up to bab-21-laboratorium/
├── assets/logo.svg
└── .github/workflows/build.yml   ← automatic sync + build on every push
```

The full folder list is in [`src/chapters/README.md`](src/chapters/README.md).

**How it works:** `index.html` stores both language documents (base64-encoded) and renders the active one inside an iframe. Switching languages makes the wrapper load the other document and restore your position. Because everything lives in one file, the book works even when opened straight from disk.

### Editing content

Edit either version, **full or per chapter**, then run:

```bash
python3 build.py
```

`build.py` detects which side you changed, syncs the other side, and rebuilds `index.html`. Commit everything that changed.

**Example: a bug in simulation 9.3 (RBF & CPFP)**

1. Open `src/chapters/bab-09-mempool-dan-fee-market/`
2. Fix it in `script.id.js` **and** `script.en.js` (both contain translated text, so the logic lives in two files). For a CSS bug, edit `style.css` once, since both languages share it.
3. Run `python3 build.py`, then commit

> Tip: simulation element IDs follow `bNN-sXY`, e.g. `b09-s93-rbf-btn` = chapter 9, section 9.3. Run `grep -rn "b09-s93" src/chapters/` to jump to the right file.

**No Python?** No problem. Edit directly on GitHub and commit. GitHub Actions runs `build.py` and commits the synced result automatically within a minute or two.

| Command | What it does |
|---|---|
| `python3 build.py` | Auto-sync + build `index.html` |
| `python3 build.py --check` | Verify everything is in sync without changing anything |
| `python3 build.py --from-chapters` | Force: rebuild the full version from `src/chapters/` |
| `python3 build.py --from-full` | Force: re-split `src/chapters/` from the full version |

If you edit **both** versions before building, `build.py` stops and asks you to choose `--from-chapters` or `--from-full`, so nothing gets silently overwritten.

### Data note

Snapshot figures in this book (price, hashrate, difficulty, block height, node software distribution, dataset sizes) were taken at various points during 2024–2025 and are not updated automatically.

### Author

**Maxima Freiman** — [github.com/maximafreiman](https://github.com/maximafreiman)

Bundled third-party components are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
