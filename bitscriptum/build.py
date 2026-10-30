#!/usr/bin/env python3
"""
Bitscriptum build:  src/  ->  dist/
===================================
Sumber yang diedit ada di src/ dengan nama file polos (assets/main.id.js, dst).
Build menghasilkan dist/ yang siap di-deploy:

  1. Font, CSS, dan JS disalin dengan hash isi di namanya
     (main.id.js -> main.id.<hash>.js), supaya aman di-cache lama oleh browser.
     Setiap kali isi file berubah, namanya ikut berubah.
  2. Semua referensi assets/... di HTML dan url(fonts/...) di CSS diganti ke nama baru.
  3. Hash CSP (script-src) untuk script inline dihitung ulang otomatis.
  4. _headers (Netlify / Cloudflare Pages) dan .nojekyll ditulis ke output.

Pakai:
  python3 build.py              # -> dist/
  python3 build.py -o docs      # folder output lain (mis. GitHub Pages dari /docs)

Butuh Python 3.8+, tanpa library tambahan.
"""
import argparse
import base64
import hashlib
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
PAGES = ("index.html", "en.html")
HASHED_EXT = {".js", ".css", ".woff2"}
NO_HASH = {"chart-4.4.1.umd.min.js"}  # vendor: versinya sudah ada di nama file

HEADERS = """\
# Netlify / Cloudflare Pages. GitHub Pages tidak membaca file ini.
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: interest-cohort=(), browsing-topics=(), camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
"""


def die(msg):
    sys.exit("build gagal: " + msg)


def short_hash(data):
    return hashlib.sha256(data).hexdigest()[:10]


def read_text(path):
    # newline=None: CRLF dari checkout Windows dibaca sebagai LF
    return path.read_text("utf-8")


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def csp_hash(script_text):
    digest = hashlib.sha256(script_text.encode("utf-8")).digest()
    return "'sha256-" + base64.b64encode(digest).decode() + "'"


def hashed_name(rel, data):
    if rel.suffix not in HASHED_EXT or rel.name in NO_HASH:
        return rel
    return rel.with_name("%s.%s%s" % (rel.stem, short_hash(data), rel.suffix))


def build(out):
    if not SRC.is_dir():
        die("folder src/ tidak ada")
    if out.resolve() in (ROOT, SRC.resolve()):
        die("folder output tidak boleh root repo atau src/")
    if out.exists():
        shutil.rmtree(out)
    src_assets, out_assets = SRC / "assets", out / "assets"
    files = sorted(p.relative_to(src_assets) for p in src_assets.rglob("*") if p.is_file())
    mapping = {}  # "fonts/sora-latin.woff2" -> "fonts/sora-latin.<hash>.woff2"

    def emit(rel, data):
        new = hashed_name(rel, data)
        dest = out_assets / new
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        mapping[rel.as_posix()] = new.as_posix()

    # 1) file biner & selain CSS/JS (font, lisensi)
    for rel in files:
        if rel.suffix not in (".css", ".js"):
            emit(rel, (src_assets / rel).read_bytes())

    # 2) CSS: arahkan url(fonts/...) ke nama ber-hash
    url_re = re.compile(r"url\((['\"]?)([^)'\"]+)\1\)")
    for rel in files:
        if rel.suffix != ".css":
            continue
        css = read_text(src_assets / rel)
        base = rel.parent

        def fix_url(m):
            target = m.group(2)
            if re.match(r"^(data:|https?:|/|#)", target):
                return m.group(0)
            key = (base / target).as_posix()
            if key not in mapping:
                die("%s merujuk %s yang tidak ada di src/assets" % (rel, target))
            new = Path(mapping[key]).relative_to(base).as_posix() if str(base) != "." else mapping[key]
            return "url(%s%s%s)" % (m.group(1), new, m.group(1))

        emit(rel, url_re.sub(fix_url, css).encode("utf-8"))

    # 3) JS: periksa string 'assets/...' (mis. Chart.js yang dimuat lazy) memang ada
    for rel in files:
        if rel.suffix != ".js":
            continue
        js = read_text(src_assets / rel)
        for ref in set(re.findall(r"""['"]assets/([^'"]+)['"]""", js)):
            if ref not in mapping and not (src_assets / ref).is_file():
                die("%s merujuk assets/%s yang tidak ada" % (rel, ref))
            if ref in mapping and mapping[ref] != ref:
                die("%s merujuk assets/%s yang namanya di-hash; masukkan ke NO_HASH" % (rel, ref))
        emit(rel, js.encode("utf-8"))

    # 4) HTML: referensi aset + CSP
    attr_re = re.compile(r'((?:src|href)=")assets/([^"]+)(")')
    for page in PAGES:
        src_page = SRC / page
        if not src_page.is_file():
            die("src/%s tidak ada" % page)
        html = read_text(src_page)

        def fix_attr(m):
            ref = m.group(2)
            if ref not in mapping:
                die("%s merujuk assets/%s yang tidak ada" % (page, ref))
            return m.group(1) + "assets/" + mapping[ref] + m.group(3)

        html = attr_re.sub(fix_attr, html)

        for ext in re.findall(r'<(?:script|link)\b[^>]*(?:src|href)="(https?://[^"]+)"', html):
            print("peringatan: %s memuat %s; CSP akan memblokirnya" % (page, ext))

        inline = re.findall(r"<script>(.*?)</script>", html, re.S)
        csp_meta = re.compile(r"""(<meta http-equiv="Content-Security-Policy" content="[^"]*?script-src 'self')([^;"]*)(;)""")
        if len(csp_meta.findall(html)) != 1:
            die("%s: meta Content-Security-Policy dengan script-src 'self' harus ada tepat 1x" % page)
        hashes = "".join(" " + csp_hash(s) for s in inline)
        html = csp_meta.sub(lambda m: m.group(1) + hashes + m.group(3), html)

        write_text(out / page, html)

    write_text(out / "_headers", HEADERS)
    write_text(out / ".nojekyll", "")
    return mapping


def main():
    ap = argparse.ArgumentParser(description="Build Bitscriptum: src/ -> dist/")
    ap.add_argument("-o", "--out", default="dist", help="folder output (default: dist)")
    a = ap.parse_args()
    out = Path(a.out)
    if not out.is_absolute():
        out = ROOT / out
    mapping = build(out)
    n = sum(1 for f in out.rglob("*") if f.is_file())
    size = sum(f.stat().st_size for f in out.rglob("*") if f.is_file())
    try:
        shown = out.relative_to(ROOT)
    except ValueError:
        shown = out
    print("selesai -> %s/  (%d file, %.1f MB sebelum kompresi)" % (shown, n, size / 1e6))
    for old, new in sorted(mapping.items()):
        if old != new:
            print("  assets/%s -> assets/%s" % (old, new))


if __name__ == "__main__":
    main()
