# src/chapters/en — English

> ⚙️ This folder is kept in sync with `src/en.html` by `build.py`. Edit freely, then run `python3 build.py`.

| Folder | Content | Files |
|---|---|---|
| [`_shared/`](_shared/) | Shared: global, navigation, language switch, Chart.js | `animations.css`, `boot.js`, `chartjs-4.4.1.min.js`, `global.css`, `helper.js`, `language-switcher.css`, `language-switcher.js`, `narrow-screen.css`, `navigation.js`, `raw-data-panel.css`, `responsive-mobile.css`, `theme-sync.js`, `topbar-logo-events.js`, `topbar.css` |
| [`_welcome/`](_welcome/) | Welcome page | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`_chapter-list/`](_chapter-list/) | Chapter list | `page.html`, `script.js`, `style.css` |
| [`chapter-00-prologue/`](chapter-00-prologue/) | Prologue — Why Bitcoin? | `page.html`, `script.js`, `style.css` |
| [`chapter-01-bitcoin-from-10000-feet/`](chapter-01-bitcoin-from-10000-feet/) | Bitcoin from 10,000 Feet | `page.html`, `script.js`, `style.css` |
| [`chapter-02-wallets-and-private-keys/`](chapter-02-wallets-and-private-keys/) | Wallets and Private Keys | `page.html`, `script.js`, `style.css` |
| [`chapter-03-anatomy-of-a-transaction/`](chapter-03-anatomy-of-a-transaction/) | Anatomy of a Transaction | `page.html`, `script.js`, `style.css` |
| [`chapter-04-bitcoin-cryptography/`](chapter-04-bitcoin-cryptography/) | Bitcoin Cryptography | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`chapter-05-mining-and-proof-of-work/`](chapter-05-mining-and-proof-of-work/) | Mining and Proof of Work | `page.html`, `script-2.js`, `script.js`, `style.css` |
| [`chapter-06-script-and-opcodes/`](chapter-06-script-and-opcodes/) | Bitcoin Script and Opcodes | `page.html`, `script.js`, `style.css` |
| [`chapter-07-lightning-network/`](chapter-07-lightning-network/) | Lightning Network | `page.html`, `script.js`, `style.css` |
| [`chapter-08-nodes-and-p2p-network/`](chapter-08-nodes-and-p2p-network/) | Nodes and the P2P Network | `page.html`, `script.js`, `style.css` |
| [`chapter-09-mempool-and-fee-market/`](chapter-09-mempool-and-fee-market/) | The Mempool and the Fee Market | `page.html`, `script.js`, `style-2.css`, `style.css` |
| [`chapter-10-utxo-set-and-state/`](chapter-10-utxo-set-and-state/) | The UTXO Set and Bitcoin's State | `page.html`, `script.js`, `style.css` |
| [`chapter-11-mining-hardware-pools-economics/`](chapter-11-mining-hardware-pools-economics/) | Mining: Hardware, Pools, and Economics | `page.html`, `script.js`, `style.css` |
| [`chapter-12-on-chain-privacy/`](chapter-12-on-chain-privacy/) | On-chain Privacy: CoinJoin and Other Techniques | `page.html`, `script.js`, `style.css` |
| [`chapter-13-soft-forks-and-governance/`](chapter-13-soft-forks-and-governance/) | Soft Forks: History, Process, and Governance | `page.html`, `script-2.js`, `script.js`, `style-2.css`, `style.css` |
| [`chapter-14-incidents-and-rare-events/`](chapter-14-incidents-and-rare-events/) | Incidents and Rare Events in Bitcoin | `page.html`, `script.js`, `style.css` |
| [`chapter-15-time-and-timelocks/`](chapter-15-time-and-timelocks/) | Time in Bitcoin: Timelocks and Sequence | `page.html`, `script.js`, `style.css` |
| [`chapter-16-running-a-node/`](chapter-16-running-a-node/) | Running a Node: IBD and Chainstate | `page.html`, `script.js`, `style.css` |
| [`chapter-17-spv-and-light-clients/`](chapter-17-spv-and-light-clients/) | SPV & Light Clients | `page.html`, `script.js`, `style.css` |
| [`chapter-18-wire-protocol/`](chapter-18-wire-protocol/) | Wire Protocol & Block Propagation | `page.html`, `script.js`, `style.css` |
| [`chapter-19-mining-economics/`](chapter-19-mining-economics/) | Mining Economics & Incentive Design | `page.html`, `script.js`, `style.css` |
| [`chapter-20-summary/`](chapter-20-summary/) | Summary — The Whole Protocol in One Chapter | `page.html`, `script.js`, `style.css` |
| [`chapter-21-laboratory/`](chapter-21-laboratory/) | Laboratory | `page.html`, `script-2.js`, `script.js`, `style-2.css`, `style.css` |
| [`_appendix/`](_appendix/) | Appendix: bibliography, author's notes, about | `page.html`, `script.js`, `style.css` |

## File names

| File | Content |
|---|---|
| `style.css` | Chapter CSS |
| `page.html` | Chapter page markup |
| `script.js` | Chapter simulation JavaScript |
| `*-2.*`, `*-3.*` | Small pieces of the same chapter located elsewhere in the original document |
| `layout.html` | Document skeleton + assembly order of all files above |

The Indonesian version lives in [`../id/`](../id/) with the same layout. Bug fixes (JS/CSS) usually need to go into both folders.

## Adding a new section

The splitter reads comment headers to decide which chapter a block belongs to. When adding a new CSS/JS/HTML block directly to `src/en.html`, give it a header like:

```
/* ============================================================
   PAGE 12 · CHAPTER 9 · 9.7 SIMULATION (Simulation Name)
============================================================ */
```

(`PAGE n` = chapter `n − 3`; `PAGE 3` = Prologue.)

## Finding bugs fast

Simulation element IDs follow `bNN-sXY`, e.g. `b09-s93-rbf-btn` = chapter 9, section 9.3. Search for it to jump straight to the right file:

```bash
grep -rn "b09-s93" src/chapters/en/
```

Some classes used across chapters (e.g. `.bs-flow`) stay in the chapter where the original author placed them. If you can't find one in the chapter folder, search all of `src/chapters/en/`.
