# src/chapters/id — Bahasa Indonesia

> ⚙️ Folder ini disinkronkan oleh `build.py` dengan `src/id.html`. Boleh diedit langsung, lalu jalankan `python3 build.py`.

| Folder | Isi | File |
|---|---|---|
| [`_bersama/`](_bersama/) | Bersama: global, navigasi, ganti bahasa, Chart.js | `animations.css`, `boot.js`, `chartjs-4.4.1.min.js`, `global.css`, `helper.js`, `language-switcher.css`, `language-switcher.js`, `layar-sempit.css`, `navigation.js`, `raw-data-panel.css`, `responsive-mobile.css`, `theme-sync.js`, `topbar-logo-events.js`, `topbar.css` |
| [`_beranda/`](_beranda/) | Halaman pembuka (welcome) | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`_daftar-bab/`](_daftar-bab/) | Daftar bab | `page.html`, `script.js`, `style.css` |
| [`bab-00-prologue/`](bab-00-prologue/) | Prologue — Mengapa Bitcoin? | `page.html`, `script.js`, `style.css` |
| [`bab-01-bitcoin-dari-10000-kaki/`](bab-01-bitcoin-dari-10000-kaki/) | Bitcoin dari 10.000 Kaki | `page.html`, `script.js`, `style.css` |
| [`bab-02-wallet-dan-private-key/`](bab-02-wallet-dan-private-key/) | Wallet dan Private Key | `page.html`, `script.js`, `style.css` |
| [`bab-03-anatomi-transaksi/`](bab-03-anatomi-transaksi/) | Anatomi Sebuah Transaksi | `page.html`, `script.js`, `style.css` |
| [`bab-04-kriptografi-bitcoin/`](bab-04-kriptografi-bitcoin/) | Kriptografi Bitcoin | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`bab-05-mining-dan-proof-of-work/`](bab-05-mining-dan-proof-of-work/) | Mining dan Proof of Work | `page.html`, `script-2.js`, `script.js`, `style.css` |
| [`bab-06-script-dan-opcodes/`](bab-06-script-dan-opcodes/) | Bitcoin Script dan Opcodes | `page.html`, `script.js`, `style.css` |
| [`bab-07-lightning-network/`](bab-07-lightning-network/) | Lightning Network | `page.html`, `script.js`, `style.css` |
| [`bab-08-node-dan-jaringan-p2p/`](bab-08-node-dan-jaringan-p2p/) | Node dan Jaringan P2P | `page.html`, `script.js`, `style.css` |
| [`bab-09-mempool-dan-fee-market/`](bab-09-mempool-dan-fee-market/) | Mempool dan Fee Market | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`bab-10-utxo-set-dan-state/`](bab-10-utxo-set-dan-state/) | UTXO Set dan State Bitcoin | `page.html`, `script.js`, `style.css` |
| [`bab-11-mining-hardware-pool-ekonomi/`](bab-11-mining-hardware-pool-ekonomi/) | Mining: Hardware, Pool, dan Ekonomi | `page.html`, `script.js`, `style.css` |
| [`bab-12-privasi-on-chain/`](bab-12-privasi-on-chain/) | Privasi On-chain: CoinJoin dan Teknik Lainnya | `page.html`, `script.js`, `style.css` |
| [`bab-13-soft-fork-dan-governance/`](bab-13-soft-fork-dan-governance/) | Soft Fork: Sejarah, Proses, dan Governance | `page.html`, `script-2.js`, `script.js`, `style-2.css`, `style.css` |
| [`bab-14-insiden-dan-kejadian-langka/`](bab-14-insiden-dan-kejadian-langka/) | Insiden dan Kejadian Langka di Bitcoin | `page.html`, `script.js`, `style.css` |
| [`bab-15-waktu-dan-timelock/`](bab-15-waktu-dan-timelock/) | Waktu di Bitcoin: Timelock dan Sequence | `page.html`, `script.js`, `style.css` |
| [`bab-16-menjalankan-node/`](bab-16-menjalankan-node/) | Menjalankan Node: IBD dan Chainstate | `page.html`, `script.js`, `style.css` |
| [`bab-17-spv-dan-light-client/`](bab-17-spv-dan-light-client/) | SPV & Light Clients | `page.html`, `script.js`, `style.css` |
| [`bab-18-wire-protocol/`](bab-18-wire-protocol/) | Wire Protocol & Block Propagation | `page.html`, `script.js`, `style.css` |
| [`bab-19-ekonomi-mining/`](bab-19-ekonomi-mining/) | Ekonomi Mining & Desain Insentif | `page.html`, `script.js`, `style.css` |
| [`bab-20-rangkuman/`](bab-20-rangkuman/) | Rangkuman — Seluruh Protokol dalam Satu Bab | `page.html`, `script.js`, `style.css` |
| [`bab-21-laboratorium/`](bab-21-laboratorium/) | Laboratorium | `page.html`, `script-2.js`, `script.js`, `style-2.css`, `style.css` |
| [`_lampiran/`](_lampiran/) | Lampiran: daftar pustaka, catatan penulis, tentang | `page.html`, `script.js`, `style.css` |

## Arti nama file

| File | Isi |
|---|---|
| `style.css` | CSS bab ini |
| `page.html` | Markup halaman bab |
| `script.js` | JavaScript simulasi bab |
| `*-2.*`, `*-3.*` | Potongan kecil bab yang sama yang letaknya terpisah di dokumen asli |
| `layout.html` | Kerangka dokumen + urutan penyusunan semua file di atas |

Versi bahasa Inggris ada di [`../en/`](../en/) dengan susunan yang sama. Perbaikan bug (JS/CSS) biasanya perlu diterapkan di kedua folder.

## Menambah bagian baru

Pemecah membaca header komentar untuk tahu sebuah bagian masuk bab mana. Kalau menambah blok CSS/JS/HTML baru langsung di `src/id.html`, beri header seperti:

```
/* ============================================================
   PAGE 12 · BAB 9 · 9.7 SIMULATION (Nama Simulasi)
============================================================ */
```

(`PAGE n` = bab `n − 3`; `PAGE 3` = Prologue.)

## Tips mencari bug

ID elemen simulasi memakai pola `bNN-sXY`, contoh `b09-s93-rbf-btn` = Bab 9, subbab 9.3. Cari pola itu untuk langsung ke file yang tepat:

```bash
grep -rn "b09-s93" src/chapters/id/
```

Beberapa class yang dipakai lintas bab (mis. `.bs-flow`) tetap berada di bab tempat penulis aslinya meletakkannya. Kalau tidak ketemu di folder bab, cari di seluruh `src/chapters/id/`.
