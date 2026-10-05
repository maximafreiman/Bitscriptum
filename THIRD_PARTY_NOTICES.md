# Third-Party Notices

Bitscriptum embeds the following third-party software inline in `src/id.html`
and `src/en.html` (also split out as `src/chapters/_shared/chartjs-4.4.1.min.js`,
and therefore included in the built `index.html`) so that the charts keep
working offline.

---

## Chart.js v4.4.1

- Homepage: https://www.chartjs.org
- Source: https://github.com/chartjs/Chart.js
- License: MIT

```
The MIT License (MIT)

Copyright (c) 2023 Chart.js Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## @kurkle/color v0.3.2 (bundled inside Chart.js)

- Source: https://github.com/kurkle/color
- License: MIT

```
The MIT License (MIT)

Copyright (c) 2023 Jukka Kurkela

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Loaded at runtime (not redistributed)

- **Sora** and **Courier Prime** fonts are loaded from Google Fonts when online.
  When offline, the browser falls back to its default sans-serif / monospace fonts.

## Data

- The BIP-39 English wordlist used in the seed-phrase simulation comes from the
  [bitcoin/bips](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt) repository.
