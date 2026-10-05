#!/usr/bin/env python3
"""
Bitscriptum build script
========================

Repo ini menyimpan source dalam DUA bentuk yang selalu disinkronkan:

  1. Versi full       : src/id.html, src/en.html  (satu file per bahasa)
  2. Versi per bab    : src/chapters/<bab>/...    (CSS, HTML, JS dipecah per bab)

Edit di mana saja, lalu jalankan:

    python3 build.py

Skrip ini mendeteksi sisi mana yang kamu edit, menyinkronkan sisi lainnya,
lalu membuat index.html (satu file mandiri yang bisa dibuka offline).

Opsi:
    python3 build.py --check          cek semuanya sinkron (dipakai CI), tanpa menulis apa pun
    python3 build.py --from-chapters  paksa: susun ulang versi full dari src/chapters/
    python3 build.py --from-full      paksa: pecah ulang src/chapters/ dari versi full

Hanya memakai standard library Python (3.8+).
"""

import argparse
import base64
import hashlib
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
CHAPTERS = SRC / "chapters"
STATE_FILE = SRC / "sync-state.json"
SHELL = SRC / "shell.html"
OUT = ROOT / "index.html"
LANGS = ("id", "en")

INCLUDE = re.compile(r"^\{\{> (\S+) \}\}\r?\n?$")

# ---------------------------------------------------------------------------
# Nama folder dan judul tiap bab
# ---------------------------------------------------------------------------
CHAPTER_INFO = OrderedDict([
    ("shared",       ("_shared",       "Bersama (global, navigasi, ganti bahasa, dll.)", "Shared (global, navigation, language switch, etc.)")),
    ("welcome",      ("_welcome",      "Halaman Welcome", "Welcome page")),
    ("chapter-list", ("_daftar-bab",   "Daftar Bab", "Chapter list")),
    ("bab00", ("bab-00-prologue",                    "Prologue — Mengapa Bitcoin?", "Prologue — Why Bitcoin?")),
    ("bab01", ("bab-01-bitcoin-dari-10000-kaki",     "Bitcoin dari 10.000 Kaki", "Bitcoin from 10,000 Feet")),
    ("bab02", ("bab-02-wallet-dan-private-key",      "Wallet dan Private Key", "Wallets and Private Keys")),
    ("bab03", ("bab-03-anatomi-transaksi",           "Anatomi Sebuah Transaksi", "Anatomy of a Transaction")),
    ("bab04", ("bab-04-kriptografi-bitcoin",         "Kriptografi Bitcoin", "Bitcoin Cryptography")),
    ("bab05", ("bab-05-mining-dan-proof-of-work",    "Mining dan Proof of Work", "Mining and Proof of Work")),
    ("bab06", ("bab-06-script-dan-opcodes",          "Bitcoin Script dan Opcodes", "Bitcoin Script and Opcodes")),
    ("bab07", ("bab-07-lightning-network",           "Lightning Network", "Lightning Network")),
    ("bab08", ("bab-08-node-dan-jaringan-p2p",       "Node dan Jaringan P2P", "Nodes and the P2P Network")),
    ("bab09", ("bab-09-mempool-dan-fee-market",      "Mempool dan Fee Market", "The Mempool and the Fee Market")),
    ("bab10", ("bab-10-utxo-set-dan-state",          "UTXO Set dan State Bitcoin", "The UTXO Set and Bitcoin's State")),
    ("bab11", ("bab-11-mining-hardware-pool-ekonomi", "Mining: Hardware, Pool, dan Ekonomi", "Mining: Hardware, Pools, and Economics")),
    ("bab12", ("bab-12-privasi-on-chain",            "Privasi On-chain: CoinJoin dan Teknik Lainnya", "On-chain Privacy: CoinJoin and Other Techniques")),
    ("bab13", ("bab-13-soft-fork-dan-governance",    "Soft Fork: Sejarah, Proses, dan Governance", "Soft Forks: History, Process, and Governance")),
    ("bab14", ("bab-14-insiden-dan-kejadian-langka", "Insiden dan Kejadian Langka di Bitcoin", "Incidents and Rare Events in Bitcoin")),
    ("bab15", ("bab-15-waktu-dan-timelock",          "Waktu di Bitcoin: Timelock dan Sequence", "Time in Bitcoin: Timelocks and Sequence")),
    ("bab16", ("bab-16-menjalankan-node",            "Menjalankan Node: IBD dan Chainstate", "Running a Node: IBD and Chainstate")),
    ("bab17", ("bab-17-spv-dan-light-client",        "SPV & Light Clients", "SPV & Light Clients")),
    ("bab18", ("bab-18-wire-protocol",               "Wire Protocol & Block Propagation", "Wire Protocol & Block Propagation")),
    ("bab19", ("bab-19-ekonomi-mining",              "Mining Economics & Incentive Design", "Mining Economics & Incentive Design")),
    ("bab20", ("bab-20-rangkuman",                   "Rangkuman — Seluruh Protokol dalam Satu Bab", "Summary — The Whole Protocol in One Chapter")),
    ("bab21", ("bab-21-laboratorium",                "Laboratorium", "Laboratory")),
    ("appendix",     ("_lampiran",     "Lampiran (Daftar Pustaka, Catatan Penulis, Tentang)", "Appendix (Bibliography, Author's Notes, About)")),
])

KIND_BASE = {"css": ("style", "css"), "html": ("page", "html"), "js": ("script", "js")}

# Petunjuk nama file untuk bagian _shared yang tidak punya header jelas.
SHARED_NAME_HINTS = [
    (re.compile(r"Chart\.js v([\d.]+)"), lambda m: "chartjs-%s.min" % m.group(1)),
    (re.compile(r"#bs-lang-toggle"), lambda m: "language-switcher"),
]


# ---------------------------------------------------------------------------
# Util
# ---------------------------------------------------------------------------
def read_text(path):
    return path.read_bytes().decode("utf-8").replace("\r\n", "\n")


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text.encode("utf-8"))


def sha(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def folder_of(key):
    if key in CHAPTER_INFO:
        return CHAPTER_INFO[key][0]
    m = re.match(r"bab(\d+)$", key)
    return "bab-%02d" % int(m.group(1)) if m else "_" + key


def slugify(text, max_words=4):
    text = re.split(r"[(:—.,]", text, 1)[0]
    text = re.sub(r"^\s*SHARED\b\s*·?\s*", "", text)
    words = re.findall(r"[a-z0-9]+", text.lower())
    return "-".join(words[:max_words]) or "misc"


# ---------------------------------------------------------------------------
# Pemecah (splitter)
#
# Setiap baris dokumen dimasukkan ke satu bab, berdasarkan header komentar
# terakhir yang terlihat, misalnya:
#     /* ====  PAGE 12 · BAB 9 · Mempool  ==== */
#     // PAGE 12 · BAB 9 · 9.1 SIMULATION (Mempool)
#     <!-- ====  PAGE 12 · BAB 9 · ...  ==== -->
# ditambah beberapa aturan cadangan untuk bagian tanpa header.
# Urutan asli dokumen tidak pernah diubah, jadi hasil susun ulang selalu
# identik byte-per-byte dengan versi full.
# ---------------------------------------------------------------------------
RULE = re.compile(r"={8,}")
STRUCT_TAG = re.compile(
    r"^(<!DOCTYPE html>|<html\b[^>]*>|</html>|<head>|</head>|<body>|</body>|<style>|</style>|<script>|</script>)$",
    re.I,
)


def page_key(n):
    n = int(n)
    if n == 1:
        return "welcome"
    if n == 2:
        return "chapter-list"
    return "bab%02d" % (n - 3)  # PAGE 3 = Prologue (bab00), PAGE 4 = Bab 1, ...


def classify_title(t):
    t = t.strip()
    m = re.match(r"(?:END\s+)?PAGE\s+(\d+)\b", t)
    if m:
        return page_key(m.group(1))
    if re.match(r"(?:END\s+)?PAGE\s+APPENDIX", t):
        return "appendix"
    m = re.match(r"(?:BAB|CHAPTER)\s+(\d+)\b", t)
    if m:
        return "bab%02d" % int(m.group(1))
    if re.match(r"(LAB\b|LABORATORIUM|[CDF]\d\s|Jembatan prosa ke Laboratorium)", t):
        return "bab21"
    if re.match(r"WELCOME PAGE\b", t):
        return "welcome"
    if re.match(r"(GLOBAL|SHARED|RESPONSIVE|LAYAR SEMPIT|NAVIGATION|BOOT|LANGUAGE SWITCHER)\b", t):
        return "shared"
    return None


def clean_comment(line):
    t = RULE.sub("", line).strip()
    t = re.sub(r"^(//|/\*|<!--|\*)", "", t)
    t = re.sub(r"(\*/|-->)$", "", t)
    return t.strip()


def split_document(text):
    """Kembalikan list segmen: dict(key, kind, text, title)."""
    lines = text.splitlines(keepends=True)
    n = len(lines)

    # 1) jenis tiap baris: skel / css / js / html
    kind, mode, in_body = [], "html", False
    for ln in lines:
        s = ln.strip()
        if mode == "html":
            if STRUCT_TAG.match(s):
                kind.append("skel")
                low = s.lower()
                if low == "<style>":
                    mode = "css"
                elif low == "<script>":
                    mode = "js"
                elif low == "<body>":
                    in_body = True
                elif low == "</body>":
                    in_body = False
                continue
            kind.append("html" if in_body else "skel")
        else:
            if (mode == "css" and s.lower() == "</style>") or (mode == "js" and s.lower() == "</script>"):
                kind.append("skel")
                mode = "html"
                continue
            kind.append(mode)

    # 2) baris komentar
    comment, in_block = [False] * n, False
    for i, ln in enumerate(lines):
        s = ln.strip()
        if kind[i] == "skel":
            in_block = False
            continue
        starts = s.startswith(("/*", "<!--"))
        comment[i] = bool(s) and (in_block or starts or s.startswith("//"))
        if in_block or starts:
            closed = ("*/" in s) or ("-->" in s)
            in_block = not closed

    # 3) pemicu statis
    triggers = {}

    def walk_back(i):
        while i > 0 and comment[i - 1] and kind[i - 1] == kind[i]:
            i -= 1
        return i

    i = 0
    while i < n:
        if comment[i]:
            j = i
            while j < n and comment[j] and kind[j] == kind[i]:
                j += 1
            run = range(i, j)
            if any(RULE.search(lines[k]) for k in run):
                for k in run:
                    t = clean_comment(lines[k])
                    key = classify_title(t) if t else None
                    if key:
                        triggers[i] = (key, t)
                        break
            i = j
            continue
        ln = lines[i]
        if kind[i] == "html":
            m = re.match(r'\s*<div class="page[^"]*" id="page-([a-z0-9]+)"', ln)
            if m:
                p = m.group(1)
                key = {"welcome": "welcome", "chapters": "chapter-list",
                       "prologue": "bab00", "appendix": "appendix"}.get(p)
                if not key and re.match(r"bab\d+$", p):
                    key = "bab%02d" % int(p[3:])
                if key:
                    triggers.setdefault(walk_back(i), (key, ""))
        elif kind[i] == "js":
            m = re.match(r"function showSectionInContentB(\d+)\(", ln)
            if m:
                triggers.setdefault(walk_back(i), ("bab%02d" % int(m.group(1)), ""))
        elif kind[i] == "css" and ln.startswith(".apx-"):
            run_len = 0
            while i + run_len < n and lines[i + run_len].startswith(".apx-"):
                run_len += 1
            if run_len >= 5 and (i == 0 or not lines[i - 1].startswith(".apx-")):
                triggers.setdefault(i, ("appendix", ""))
        i += 1

    # 4) tetapkan bab tiap baris, lalu gabungkan jadi segmen
    segs, cur = [], "shared"
    for i, ln in enumerate(lines):
        new_shared_section = False
        if kind[i] == "skel":
            cur = "shared"
            key, k, title = "shared", "skel", ""
        else:
            title = ""
            if i in triggers:
                cur, title = triggers[i]
                new_shared_section = cur == "shared"
            elif kind[i] == "css" and cur.startswith("bab"):
                # selector milik bab lain di kolom 0, mis. ".b13-lab" di tengah CSS lab
                m = re.match(r"\.b(\d\d)-", ln)
                if m and ("bab" + m.group(1)) != cur:
                    cur = "bab" + m.group(1)
            key, k = cur, kind[i]
        if segs and segs[-1]["key"] == key and segs[-1]["kind"] == k and not new_shared_section:
            segs[-1]["lines"].append(ln)
        else:
            segs.append({"key": key, "kind": k, "lines": [ln], "title": title})

    # 5) segmen yang isinya cuma baris kosong digabung ke tetangga sejenis
    #    (kalau tidak ada tetangga sejenis, baris kosong itu jadi bagian kerangka)
    merged = []
    for idx, sg in enumerate(segs):
        blank = sg["kind"] != "skel" and all(not l.strip() for l in sg["lines"])
        if blank:
            nxt = segs[idx + 1] if idx + 1 < len(segs) else None
            if nxt is not None and nxt["kind"] == sg["kind"]:
                nxt["lines"] = sg["lines"] + nxt["lines"]
                continue
            if merged and merged[-1]["kind"] == sg["kind"]:
                merged[-1]["lines"].extend(sg["lines"])
                continue
            sg["key"], sg["kind"] = "shared", "skel"
        if merged and sg["kind"] == "skel" and merged[-1]["kind"] == "skel":
            merged[-1]["lines"].extend(sg["lines"])
            continue
        merged.append(sg)

    for sg in merged:
        sg["text"] = "".join(sg.pop("lines"))
    return merged


def shared_name(seg):
    for rx, fn in SHARED_NAME_HINTS:
        m = rx.search(seg["text"])
        if m:
            return fn(m)
    if seg["title"]:
        return slugify(seg["title"])
    for ln in seg["text"].splitlines():
        t = clean_comment(ln)
        if t and (ln.strip().startswith(("//", "/*", "<!--"))):
            return slugify(t, 3)
    return "misc"


def plan_files(segs_by_lang):
    """Tentukan nama file tiap segmen. Return (layouts, files)."""
    ids, ens = segs_by_lang["id"], segs_by_lang["en"]
    aligned = len(ids) == len(ens) and all(
        a["key"] == b["key"] and a["kind"] == b["kind"] for a, b in zip(ids, ens)
    )
    files = OrderedDict()

    def name_groups(entries):
        """entries: list of dict(seg_index, folder, base, ext, size). Set e['name']."""
        groups = OrderedDict()
        for e in entries:
            groups.setdefault((e["folder"], e["base"], e["ext"]), []).append(e)
        for (_, base, _), grp in groups.items():
            if len(grp) == 1:
                grp[0]["name"] = base
                continue
            main = max(grp, key=lambda e: e["size"])
            main["name"] = base
            n = 2
            for e in grp:
                if e is not main:
                    e["name"] = "%s-%d" % (base, n)
                    n += 1

    if aligned:
        entries, doc_n = [], 0
        for idx, (a, b) in enumerate(zip(ids, ens)):
            same = a["text"] == b["text"]
            if a["kind"] == "skel":
                if same:
                    continue
                doc_n += 1
                base = "document-start" if "<html" in a["text"] else "document-%d" % doc_n
                entries.append({"i": idx, "folder": "_shared", "base": base,
                                "ext": "html", "size": 0, "same": False})
                continue
            folder = folder_of(a["key"])
            if a["key"] == "shared":
                base, ext = shared_name(a), KIND_BASE[a["kind"]][1]
            else:
                base, ext = KIND_BASE[a["kind"]]
            entries.append({"i": idx, "folder": folder, "base": base, "ext": ext,
                            "size": len(a["text"]) + len(b["text"]), "same": same})
        name_groups(entries)
        by_i = {e["i"]: e for e in entries}
        layout = []
        for idx, (a, b) in enumerate(zip(ids, ens)):
            e = by_i.get(idx)
            if e is None:
                layout.append(a["text"])
                continue
            if e["same"]:
                rel = "%s/%s.%s" % (e["folder"], e["name"], e["ext"])
                files[rel] = a["text"]
            else:
                rel = "%s/%s.{lang}.%s" % (e["folder"], e["name"], e["ext"])
                files[rel.replace("{lang}", "id")] = a["text"]
                files[rel.replace("{lang}", "en")] = b["text"]
            layout.append("{{> %s }}\n" % rel)
        return {"layout.html": "".join(layout)}, files

    # Struktur kedua bahasa berbeda: layout terpisah per bahasa.
    layouts = {}
    for lang in LANGS:
        segs, entries = segs_by_lang[lang], []
        for idx, s in enumerate(segs):
            if s["kind"] == "skel":
                continue
            folder = folder_of(s["key"])
            if s["key"] == "shared":
                base, ext = shared_name(s), KIND_BASE[s["kind"]][1]
            else:
                base, ext = KIND_BASE[s["kind"]]
            entries.append({"i": idx, "folder": folder, "base": base, "ext": ext, "size": len(s["text"])})
        name_groups(entries)
        by_i = {e["i"]: e for e in entries}
        out = []
        for idx, s in enumerate(segs):
            e = by_i.get(idx)
            if e is None:
                out.append(s["text"])
                continue
            rel = "%s/%s.%s.%s" % (e["folder"], e["name"], lang, e["ext"])
            files[rel] = s["text"]
            out.append("{{> %s }}\n" % rel)
        layouts["layout.%s.html" % lang] = "".join(out)
    return layouts, files


def tracked_files():
    """File yang saat ini dikelola oleh layout (untuk dibersihkan saat pecah ulang)."""
    found = set()
    for layout in CHAPTERS.glob("layout*.html"):
        found.add(layout)
        for line in read_text(layout).splitlines():
            m = INCLUDE.match(line)
            if m:
                for lang in LANGS:
                    found.add(CHAPTERS / m.group(1).replace("{lang}", lang))
    readme = CHAPTERS / "README.md"
    if readme.exists():
        found.add(readme)
    return found


def chapters_readme(layouts, files):
    folders = OrderedDict()
    for rel in files:
        folder, name = rel.split("/", 1)
        folders.setdefault(folder, []).append(name)
    info = {v[0]: (v[1], v[2]) for v in CHAPTER_INFO.values()}
    order = [v[0] for v in CHAPTER_INFO.values()]
    ordered = sorted(folders, key=lambda f: (order.index(f) if f in order else 999, f))
    out = [
        "# src/chapters — source per bab / per-chapter source\n\n",
        "> ⚙️ Folder ini dibuat dan disinkronkan oleh `build.py`. "
        "Boleh diedit langsung, lalu jalankan `python3 build.py`.\n",
        "> Generated and kept in sync by `build.py`. Edit freely, then run `python3 build.py`.\n\n",
        "| Folder | Isi (ID) | Content (EN) | File |\n",
        "|---|---|---|---|\n",
    ]
    for f in ordered:
        ti, te = info.get(f, ("", ""))
        names = ", ".join("`%s`" % n for n in sorted(folders[f]))
        out.append("| [`%s/`](%s/) | %s | %s | %s |\n" % (f, f, ti, te, names))
    out.append(
        "\n## Arti nama file / File names\n\n"
        "| File | Isi |\n|---|---|\n"
        "| `style.css` | CSS bab ini (dipakai kedua bahasa) |\n"
        "| `page.id.html` / `page.en.html` | Markup halaman bab |\n"
        "| `script.id.js` / `script.en.js` | JavaScript simulasi bab |\n"
        "| `*-2.*`, `*-3.*` | Potongan kecil bab yang sama yang letaknya terpisah di dokumen asli |\n"
        "| `layout.html` | Kerangka dokumen + urutan penyusunan semua file di atas |\n\n"
        "File tanpa `.id`/`.en` dipakai **kedua bahasa**, jadi cukup diedit sekali. "
        "File `.id`/`.en` berisi teks yang diterjemahkan, jadi perbaikan bug di JS/HTML "
        "biasanya perlu diterapkan di keduanya.\n\n"
        "Files without `.id`/`.en` are shared by **both languages** (edit once). "
        "`.id`/`.en` files contain translated text, so JS/HTML bug fixes usually need to go into both.\n\n"
        "## Menambah bagian baru / Adding a new section\n\n"
        "Pemecah membaca header komentar untuk tahu sebuah bagian masuk bab mana. "
        "Kalau menambah blok CSS/JS/HTML baru langsung di versi full, beri header seperti:\n\n"
        "```\n/* ============================================================\n"
        "   PAGE 12 · BAB 9 · 9.7 SIMULATION (Nama Simulasi)\n"
        "============================================================ */\n```\n\n"
        "(`PAGE n` = bab `n − 3`; `PAGE 3` = Prologue.)\n\n"
        "## Tips mencari bug / Finding bugs fast\n\n"
        "ID elemen simulasi memakai pola `bNN-sXY`, contoh `b09-s93-rbf-btn` = Bab 9, subbab 9.3. "
        "Cari pola itu untuk langsung ke file yang tepat:\n\n"
        "Simulation element IDs follow `bNN-sXY` (e.g. `b09-s93-rbf-btn` = chapter 9, section 9.3). "
        "Search for it to jump straight to the right file:\n\n"
        "```bash\ngrep -rn \"b09-s93\" src/chapters/\n```\n\n"
        "Beberapa class yang dipakai lintas bab (mis. `.bs-flow`) tetap berada di bab tempat penulis "
        "aslinya meletakkannya. Kalau tidak ketemu di folder bab, cari di seluruh `src/chapters/`.\n"
    )
    return "".join(out)


def split_all(fulls):
    segs_by_lang = {lang: split_document(fulls[lang]) for lang in LANGS}
    for lang, segs in segs_by_lang.items():
        for s in segs:
            if s["kind"] == "skel":
                for ln in s["text"].splitlines():
                    if INCLUDE.match(ln + "\n"):
                        sys.exit("error: baris di src/%s.html bentrok dengan sintaks include: %r" % (lang, ln))
    layouts, files = plan_files(segs_by_lang)

    for path in tracked_files():
        if path.exists():
            path.unlink()
    for name, text in layouts.items():
        write_text(CHAPTERS / name, text)
    for rel, text in files.items():
        write_text(CHAPTERS / rel, text)
    write_text(CHAPTERS / "README.md", chapters_readme(layouts, files))
    for d in sorted(CHAPTERS.rglob("*"), key=lambda p: -len(p.parts)):
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()

    for lang in LANGS:
        if assemble(lang) != fulls[lang]:
            sys.exit("error: hasil pecah src/%s.html tidak bisa disusun ulang dengan identik (bug di build.py)" % lang)
    n_dirs = len({rel.split("/")[0] for rel in files})
    print("  src/chapters/ ditulis ulang: %d folder, %d file" % (n_dirs, len(files)))


# ---------------------------------------------------------------------------
# Penyusun (assembler)
# ---------------------------------------------------------------------------
def layout_for(lang):
    p = CHAPTERS / ("layout.%s.html" % lang)
    return p if p.exists() else CHAPTERS / "layout.html"


def chapters_exist():
    return any(CHAPTERS.glob("layout*.html"))


def assemble(lang):
    out = []
    for line in read_text(layout_for(lang)).splitlines(keepends=True):
        m = INCLUDE.match(line)
        if not m:
            out.append(line)
            continue
        part_path = CHAPTERS / m.group(1).replace("{lang}", lang)
        if not part_path.exists():
            sys.exit("error: layout menyebut file yang tidak ada: src/chapters/%s"
                     % m.group(1).replace("{lang}", lang))
        part = read_text(part_path)
        if line.endswith("\n") and part and not part.endswith("\n"):
            part += "\n"
        out.append(part)
    return "".join(out)


# ---------------------------------------------------------------------------
# Bundle index.html
# ---------------------------------------------------------------------------
def bundle(fulls):
    shell = read_text(SHELL)
    for lang in LANGS:
        token = "__BITSCRIPTUM_DOC_%s__" % lang.upper()
        if token not in shell:
            sys.exit("error: placeholder %s tidak ada di src/shell.html" % token)
        b64 = base64.b64encode(fulls[lang].encode("utf-8")).decode("ascii")
        shell = shell.replace(token, b64)
    return shell


# ---------------------------------------------------------------------------
# Sinkronisasi
# ---------------------------------------------------------------------------
def load_state():
    try:
        return json.loads(read_text(STATE_FILE))
    except (OSError, ValueError):
        return {}


def save_state(fulls):
    state = OrderedDict(
        (lang, sha(fulls[lang])) for lang in LANGS
    )
    text = json.dumps(state, indent=2) + "\n"
    if not STATE_FILE.exists() or read_text(STATE_FILE) != text:
        write_text(STATE_FILE, text)


def sync(mode):
    fulls = {lang: read_text(SRC / ("%s.html" % lang)) for lang in LANGS}

    if not chapters_exist():
        print("src/chapters/ belum ada, membuat dari versi full...")
        split_all(fulls)
        save_state(fulls)
        return fulls

    if mode == "from-full":
        print("Memecah ulang src/chapters/ dari versi full (--from-full)...")
        split_all(fulls)
        save_state(fulls)
        return fulls

    asm = {lang: assemble(lang) for lang in LANGS}

    if mode == "from-chapters":
        for lang in LANGS:
            if fulls[lang] != asm[lang]:
                write_text(SRC / ("%s.html" % lang), asm[lang])
                fulls[lang] = asm[lang]
                print("  src/%s.html disusun ulang dari src/chapters/ (--from-chapters)" % lang)
        save_state(fulls)
        return fulls

    state = load_state()
    need_split, conflicts = False, []
    for lang in LANGS:
        if fulls[lang] == asm[lang]:
            continue
        last = state.get(lang)
        full_changed = sha(fulls[lang]) != last
        parts_changed = sha(asm[lang]) != last
        if parts_changed and not full_changed:
            write_text(SRC / ("%s.html" % lang), asm[lang])
            fulls[lang] = asm[lang]
            print("  Perubahan di src/chapters/ -> src/%s.html diperbarui" % lang)
        elif full_changed and not parts_changed:
            need_split = True
            print("  Perubahan di src/%s.html -> src/chapters/ akan dipecah ulang" % lang)
        else:
            conflicts.append(lang)

    if conflicts:
        print("\nKONFLIK: src/%s.html DAN src/chapters/ sama-sama berubah sejak sinkron terakhir,"
              % "/".join(conflicts))
        print("jadi build.py tidak tahu mana yang harus dipakai. Pilih salah satu:")
        print("  python3 build.py --from-chapters   # pakai isi src/chapters/ (versi full ditimpa)")
        print("  python3 build.py --from-full       # pakai versi full (src/chapters/ ditimpa)")
        sys.exit(1)

    if need_split:
        split_all(fulls)
    save_state(fulls)
    return fulls


def check():
    ok = True
    fulls = {lang: read_text(SRC / ("%s.html" % lang)) for lang in LANGS}
    if not chapters_exist():
        print("FAIL  src/chapters/ belum ada. Jalankan: python3 build.py")
        ok = False
    else:
        for lang in LANGS:
            if assemble(lang) == fulls[lang]:
                print("OK    src/chapters/ == src/%s.html" % lang)
            else:
                print("FAIL  src/chapters/ tidak sinkron dengan src/%s.html" % lang)
                ok = False
    current = read_text(OUT) if OUT.exists() else ""
    if current == bundle(fulls):
        print("OK    index.html up to date")
    else:
        print("FAIL  index.html belum diperbarui")
        ok = False
    if not ok:
        print("\nJalankan `python3 build.py` lalu commit semua perubahannya.")
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Sinkronkan src/ dan buat index.html")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--check", action="store_true", help="cek sinkron tanpa menulis apa pun (CI)")
    g.add_argument("--from-chapters", action="store_true", help="paksa susun versi full dari src/chapters/")
    g.add_argument("--from-full", action="store_true", help="paksa pecah ulang src/chapters/ dari versi full")
    args = ap.parse_args()

    if args.check:
        check()
        return

    mode = "from-chapters" if args.from_chapters else "from-full" if args.from_full else "auto"
    fulls = sync(mode)
    output = bundle(fulls)
    if not OUT.exists() or read_text(OUT) != output:
        write_text(OUT, output)
        print("index.html diperbarui (%.1f MB)" % (len(output.encode("utf-8")) / 1048576))
    else:
        print("Semua sudah sinkron. index.html tidak berubah.")


if __name__ == "__main__":
    main()
