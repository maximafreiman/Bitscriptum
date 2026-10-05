// ============================================================
// PAGE 6 · BAB 3 · TOPBAR & BACK EVENTS
// ============================================================
document.getElementById('back-home-b3').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b3').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 6 · BAB 3 · SUB-BAB NAVIGATION
// ============================================================
function showSectionInContentB3(sectionId, sbId) {
  document.querySelectorAll('#page-bab3 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab3 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab3-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// tombol nav Bab 3
document.querySelectorAll('#page-bab3 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB3(target, sb);
  });
});

// ============================================================
// PAGE 6 · BAB 3 · SIDEBAR EVENTS (3.1 - 3.6)
// ============================================================
document.getElementById('sb-3-1').addEventListener('click', () => showSectionInContentB3('section-3-1', 'sb-3-1'));
document.getElementById('sb-3-2').addEventListener('click', () => showSectionInContentB3('section-3-2', 'sb-3-2'));
document.getElementById('sb-3-3').addEventListener('click', () => showSectionInContentB3('section-3-3', 'sb-3-3'));
document.getElementById('sb-3-4').addEventListener('click', () => showSectionInContentB3('section-3-4', 'sb-3-4'));
document.getElementById('sb-3-5').addEventListener('click', () => showSectionInContentB3('section-3-5', 'sb-3-5'));
document.getElementById('sb-3-6').addEventListener('click', () => showSectionInContentB3('section-3-6', 'sb-3-6'));

// PAGE 6 · BAB 3 · 3.2 SIMULATION (UTXO)
// ============================================================
(function() {
  const UTXOS = [
    { id:0, val:0.05, label:'dari: Alice',    age:'3 hari lalu',    spent:false },
    { id:1, val:0.12, label:'dari: Bob',      age:'1 minggu lalu',  spent:false },
    { id:2, val:0.08, label:'Mining reward',  age:'2 minggu lalu',  spent:false },
    { id:3, val:0.30, label:'dari: Charlie',  age:'1 bulan lalu',   spent:false },
  ];
  const FEE = 0.001;
  let selected = new Set();
  let sendAmt  = 0.05;
  let sent     = false;

  function fmt(n) { return n.toFixed(3) + ' BTC'; }

  function renderCoins() {
    const el = document.getElementById('b03-s32-coins');
    if (!el) return;
    el.innerHTML = UTXOS.map(u => `
      <div class="utxo-coin${selected.has(u.id) ? ' selected' : ''}${u.spent ? ' spent' : ''}" id="b03-s32-uc-${u.id}">
        <div class="utxo-coin-val">${fmt(u.val)}</div>
        <div class="utxo-coin-label">${u.label}</div>
        <div class="utxo-coin-age">${u.age}</div>
      </div>`).join('');
    UTXOS.forEach(u => {
      const coin = document.getElementById('b03-s32-uc-' + u.id);
      if (coin && !u.spent) coin.addEventListener('click', () => toggleCoin(u.id));
    });
  }

  function toggleCoin(id) {
    if (sent) return;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    update();
  }

  function selTotal() {
    return [...selected].reduce((s, id) => s + UTXOS[id].val, 0);
  }

  function update() {
    const total   = selTotal();
    const change  = Math.max(0, +(total - sendAmt - FEE).toFixed(3));
    const canSend = total >= sendAmt + FEE;

    const countEl  = document.getElementById('b03-s32-sel-count');
    const totalEl  = document.getElementById('b03-s32-sel-total');
    const changeEl = document.getElementById('b03-s32-change');
    const sendBtn  = document.getElementById('b03-s32-send');
    const noteEl   = document.getElementById('b03-s32-note');

    if (countEl)  countEl.textContent  = selected.size + ' UTXO';
    if (totalEl)  totalEl.textContent  = fmt(total);
    if (changeEl) {
      changeEl.textContent = fmt(change);
      changeEl.className   = 'utxo-stat-val' + (canSend ? ' ok' : ' warn');
    }
    if (sendBtn) sendBtn.disabled = !canSend || sent;

    if (noteEl) {
      if (selected.size === 0) {
        noteEl.textContent = 'Pilih UTXO secara manual atau klik "Pilih otomatis". Setiap UTXO harus digunakan seluruhnya. Sisanya kembali sebagai UTXO baru (kembalian).';
      } else if (!canSend) {
        noteEl.textContent = 'Total UTXO yang dipilih belum cukup untuk menutupi jumlah pengiriman + fee (' + fmt(sendAmt + FEE) + '). Pilih lebih banyak UTXO.';
      } else {
        noteEl.textContent = 'UTXO yang dipilih cukup. Kembalian ' + fmt(change) + ' akan menjadi UTXO baru di wallet-mu.';
      }
    }
    renderCoins();
  }

  function autoSelect() {
    if (sent) return;
    selected.clear();
    const need   = sendAmt + FEE;
    const sorted = [...UTXOS].filter(u => !u.spent).sort((a, b) => a.val - b.val);
    let acc = 0;
    for (const u of sorted) {
      selected.add(u.id);
      acc += u.val;
      if (acc >= need) break;
    }
    update();
  }

  function sendTx() {
    if (sent) return;
    const total  = selTotal();
    const change = +(total - sendAmt - FEE).toFixed(3);
    sent = true;
    selected.forEach(id => { UTXOS[id].spent = true; });

    const body = document.getElementById('b03-s32-result-body');
    if (!body) return;

    const inputRows = [...selected].map(id => `
      <div class="utxo-flow-row">
        <span class="utxo-flow-tag consumed">Dikonsumsi</span>
        <span class="utxo-flow-val">${fmt(UTXOS[id].val)}</span>
        <span class="utxo-flow-arrow">←</span>
        <span class="utxo-flow-sub">${UTXOS[id].label}</span>
      </div>`).join('');

    const outputRows = `
      <div class="utxo-flow-row">
        <span class="utxo-flow-tag created">Output baru</span>
        <span class="utxo-flow-val">${fmt(sendAmt)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">ke penerima</span>
      </div>
      ${change > 0 ? `<div class="utxo-flow-row">
        <span class="utxo-flow-tag created">Kembalian</span>
        <span class="utxo-flow-val">${fmt(change)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">kembali ke wallet-mu (UTXO baru)</span>
      </div>` : ''}
      <div class="utxo-flow-row">
        <span class="utxo-flow-tag fee">Fee miner</span>
        <span class="utxo-flow-val">${fmt(FEE)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">untuk miner yang memproses transaksi</span>
      </div>`;

    body.innerHTML = inputRows + '<hr class="utxo-hr">' + outputRows;

    const resultEl = document.getElementById('b03-s32-result');
    const noteEl   = document.getElementById('b03-s32-note');
    if (resultEl) resultEl.classList.add('show');
    if (noteEl)   noteEl.textContent = 'UTXO yang dikonsumsi sudah tidak bisa dipakai lagi. Output baru (termasuk kembalian) menjadi UTXO segar yang bisa dipakai di transaksi berikutnya.';
    const sendBtn = document.getElementById('b03-s32-send');
    if (sendBtn) sendBtn.disabled = true;
    renderCoins();
  }

  function resetSim() {
    selected.clear();
    sent = false;
    UTXOS.forEach(u => u.spent = false);
    const resultEl = document.getElementById('b03-s32-result');
    const bodyEl   = document.getElementById('b03-s32-result-body');
    const sendBtn  = document.getElementById('b03-s32-send');
    if (resultEl) resultEl.classList.remove('show');
    if (bodyEl)   bodyEl.innerHTML = '';
    if (sendBtn)  sendBtn.disabled = true;
    update();
  }

  const slider  = document.getElementById('b03-s32-slider');
  const autoBtn = document.getElementById('b03-s32-auto');
  const sendBtn = document.getElementById('b03-s32-send');
  const resetBtn= document.getElementById('b03-s32-reset');

  if (slider) slider.addEventListener('input', function() {
    sendAmt = +(this.value / 1000).toFixed(3);
    const valEl = document.getElementById('b03-s32-slider-val');
    if (valEl) valEl.textContent = fmt(sendAmt);
    selected.clear();
    update();
  });
  if (autoBtn)  autoBtn.addEventListener('click', autoSelect);
  if (sendBtn)  sendBtn.addEventListener('click', sendTx);
  if (resetBtn) resetBtn.addEventListener('click', resetSim);

  // Raw data toggle
  function buildRawUtxo(spentUtxos, sendAmt, change) {
    const inputs = spentUtxos.map((u, i) => {
      const txid = '3a7b2c' + (i*9+1).toString().padStart(2,'0') + 'f4e8d1a' + u.id + '9b5c6e7f8a2d4b1c3e5f7a9b';
      return `  {
    <span class="raw-key">"txid"</span>: <span class="raw-str">"${txid.slice(0,64)}"</span>,
    <span class="raw-key">"vout"</span>: <span class="raw-num">0</span>,
    <span class="raw-key">"address"</span>: <span class="raw-str">"bc1q${txid.slice(0,8)}...${txid.slice(-4)}"</span>, <span class="raw-comment">// dihitung node dari scriptPubKey — bukan data on-chain</span>
    <span class="raw-key">"label"</span>: <span class="raw-str">"${u.label}"</span>,
    <span class="raw-key">"amount"</span>: <span class="raw-num">${u.val.toFixed(8)}</span>,
    <span class="raw-key">"confirmations"</span>: <span class="raw-num">${Math.floor(Math.random()*1000)+6}</span>,
    <span class="raw-key">"spendable"</span>: <span class="raw-bool">true</span>,
    <span class="raw-key">"solvable"</span>: <span class="raw-bool">true</span>
  }`;
    }).join(',\n');

    const outputTo = `  {
    <span class="raw-key">"value"</span>: <span class="raw-num">${sendAmt.toFixed(8)}</span>,
    <span class="raw-key">"n"</span>: <span class="raw-num">0</span>,
    <span class="raw-key">"scriptPubKey"</span>: {
      <span class="raw-key">"asm"</span>: <span class="raw-str">"OP_0 OP_PUSHBYTES_20 a1b2c3..."</span>, <span class="raw-comment">// data on-chain yang sebenarnya</span>
      <span class="raw-key">"hex"</span>: <span class="raw-str">"0014a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"</span>,
      <span class="raw-key">"type"</span>: <span class="raw-str">"witness_v0_keyhash"</span>,
      <span class="raw-key">"address"</span>: <span class="raw-str">"bc1qpenerima...3f8a"</span> <span class="raw-comment">// dihitung node — bukan on-chain</span>
    }
  }`;

    const outputChange = change > 0 ? `,
  {
    <span class="raw-key">"value"</span>: <span class="raw-num">${change.toFixed(8)}</span>,
    <span class="raw-key">"n"</span>: <span class="raw-num">1</span>,
    <span class="raw-key">"scriptPubKey"</span>: {
      <span class="raw-key">"asm"</span>: <span class="raw-str">"OP_0 OP_PUSHBYTES_20 d4e5f6..."</span>,
      <span class="raw-key">"hex"</span>: <span class="raw-str">"0014d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"</span>,
      <span class="raw-key">"type"</span>: <span class="raw-str">"witness_v0_keyhash"</span>,
      <span class="raw-key">"address"</span>: <span class="raw-str">"bc1qkembalian...9c2d"</span> <span class="raw-comment">// dihitung node — bukan on-chain</span>
    }
  }` : '';

    return `<span class="raw-comment">// Input UTXO yang dikonsumsi (listunspent sebelum transaksi):</span>
[
${inputs}
]

<span class="raw-comment">// Output transaksi yang dibuat:</span>
<span class="raw-comment">// Yang tersimpan on-chain: scriptPubKey hex — bukan alamat!</span>
<span class="raw-comment">// Field "address" ditambahkan node saat menampilkan output untuk kemudahan membaca.</span>
{
  <span class="raw-key">"vout"</span>: [
${outputTo}${outputChange}
  ],
  <span class="raw-key">"fee"</span>: <span class="raw-num">0.00100000</span> <span class="raw-comment">// BTC (implicit: total_in - total_out)</span>
}`;
  }

  const rawBtn   = document.getElementById('b03-s32-raw-btn');
  const rawPanel = document.getElementById('b03-s32-raw-panel');
  const rawBody  = document.getElementById('b03-s32-raw-body');
  let rawOpen = false;

  if (rawBtn) rawBtn.addEventListener('click', () => {
    rawOpen = !rawOpen;
    rawBtn.classList.toggle('active', rawOpen);
    rawBtn.innerHTML = rawOpen
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if (rawOpen && rawPanel) rawPanel.classList.add('show');
    else if (rawPanel) rawPanel.classList.remove('show');
  });

  // Update raw data setelah sendTx dipanggil
  const origSendTx = sendTx;
  function sendTxWithRaw() {
    origSendTx();
    const spent = [...selected].map(id => UTXOS[id]);
    const total = spent.reduce((s, u) => s + u.val, 0);
    const chg   = +(total - sendAmt - FEE).toFixed(3);
    if (rawBody) rawBody.innerHTML = buildRawUtxo(spent, sendAmt, chg);
  }
  if (sendBtn) {
    sendBtn.removeEventListener('click', sendTx);
    sendBtn.addEventListener('click', sendTxWithRaw);
  }

  update();
})();

// PAGE 6 · BAB 3 · 3.3 SIMULATION (Input dan Output)
// ============================================================
(function() {
  const PRESETS = [
    {
      label:'Transaksi sederhana',
      inputs:[
        { tag:'inp', val:0.10, sub:'UTXO dari Alice · 3 hari lalu',
          detail:'Input ini mereferensikan sebuah UTXO senilai 0.10 BTC yang pernah diterima dari Alice. Untuk menggunakannya, transaksi ini menyertakan tanda tangan kriptografi yang membuktikan kepemilikan private key yang sesuai.' },
      ],
      outputs:[
        { tag:'out', val:0.06,  sub:'ke: Bob (bc1q...3f8a)',
          detail:'Output utama: 0.06 BTC dikirim ke alamat Bob. Kondisi untuk membelanjakan output ini adalah siapapun yang bisa membuktikan mereka memiliki private key yang sesuai dengan alamat bc1q...3f8a.' },
        { tag:'chg', val:0.039, sub:'kembalian (bc1q...9c2d)',
          detail:'Kembalian dikembalikan ke wallet pengirim sebagai UTXO baru. Ini bukan saldo yang "disimpan", melainkan output terpisah yang bisa dipakai di transaksi berikutnya.' },
        { tag:'fee', val:0.001, sub:'fee miner',
          detail:'Fee tidak ditulis eksplisit. Ia adalah selisih antara total input (0.10) dan total output (0.06 + 0.039 = 0.099). Selisih 0.001 BTC otomatis menjadi reward bagi miner yang memasukkan transaksi ini ke block.' },
      ],
    },
    {
      label:'Gabungkan UTXO kecil',
      inputs:[
        { tag:'inp', val:0.03, sub:'UTXO #1 · mining reward',
          detail:'Input pertama: UTXO kecil dari mining reward. Satu UTXO tidak cukup untuk membayar, jadi beberapa UTXO digabung menjadi satu transaksi.' },
        { tag:'inp', val:0.05, sub:'UTXO #2 · dari Charlie',
          detail:'Input kedua: UTXO dari Charlie. Ketika wallet perlu membayar lebih dari nilai satu UTXO, ia menggabungkan beberapa UTXO sebagai input dalam satu transaksi.' },
        { tag:'inp', val:0.04, sub:'UTXO #3 · dari kembalian lama',
          detail:'Input ketiga: UTXO dari kembalian transaksi sebelumnya. Ini menunjukkan bahwa kembalian dari transaksi lama bisa digunakan sebagai input di transaksi baru.' },
      ],
      outputs:[
        { tag:'out', val:0.11, sub:'ke: Dana (bc1q...7e1b)',
          detail:'Output ke Dana: 0.11 BTC. Tiga UTXO kecil (0.03 + 0.05 + 0.04 = 0.12 BTC) digabung untuk membayar satu output besar. Ini adalah pola umum ketika wallet mengumpulkan UTXO kecil-kecil.' },
        { tag:'fee', val:0.009, sub:'fee miner',
          detail:'Fee lebih besar karena transaksi ini punya 3 input. Fee di Bitcoin dihitung berdasarkan ukuran transaksi dalam bytes, bukan nilai Bitcoin. Lebih banyak input berarti transaksi lebih besar, fee lebih tinggi.' },
      ],
    },
    {
      label:'Kirim ke banyak alamat',
      inputs:[
        { tag:'inp', val:0.50, sub:'UTXO besar · dari Bob',
          detail:'Satu UTXO besar dipakai sebagai satu-satunya input. Bitcoin tidak memaksa satu input untuk satu output — satu input bisa menghasilkan banyak output sekaligus.' },
      ],
      outputs:[
        { tag:'out', val:0.15,  sub:'ke: Alice (bc1q...2a4f)',
          detail:'Output pertama ke Alice: 0.15 BTC. Mengirim ke banyak alamat sekaligus lebih efisien daripada membuat transaksi terpisah karena hanya membayar satu fee.' },
        { tag:'out', val:0.20,  sub:'ke: Bob (bc1q...8b3c)',
          detail:'Output kedua ke Bob: 0.20 BTC. Ini bisa digunakan untuk membayar gaji, membagi tagihan, atau distribusi apapun dalam satu transaksi tunggal.' },
        { tag:'chg', val:0.149, sub:'kembalian (bc1q...5d9e)',
          detail:'Kembalian ke pengirim: 0.149 BTC. Dari 0.50 BTC input, 0.15 + 0.20 = 0.35 dikirim, 0.149 kembali, dan 0.001 menjadi fee.' },
        { tag:'fee', val:0.001, sub:'fee miner',
          detail:'Fee tetap sama meski ada dua output karena ukuran transaksi tidak berbeda jauh dengan transaksi satu output.' },
      ],
    },
  ];

  const TAG_LABEL = { inp:'Input', out:'Output', chg:'Kembalian', fee:'Fee Miner' };
  const TAG_CLASS = { inp:'input-item', out:'output-item', chg:'change-item', fee:'fee-item' };

  let activePreset = 0;
  let activeItem   = null;

  function fmt(n) { return n.toFixed(3) + ' BTC'; }

  function renderPresets() {
    const el = document.getElementById('b03-s33-presets');
    if (!el) return;
    el.innerHTML = PRESETS.map((p, i) => `
      <button class="tx-preset-btn${i === activePreset ? ' active' : ''}" id="b03-s33-p-${i}">${p.label}</button>
    `).join('');
    PRESETS.forEach((_, i) => {
      const btn = document.getElementById('b03-s33-p-' + i);
      if (btn) btn.addEventListener('click', () => { activePreset = i; activeItem = null; render(); });
    });
  }

  function renderItems(containerId, items, prefix) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map((item, i) => `
      <div class="tx-item ${TAG_CLASS[item.tag]}${activeItem === prefix+i ? ' active' : ''}" id="${prefix}${i}">
        <div class="tx-item-top">
          <span class="tx-item-tag ${item.tag}">${TAG_LABEL[item.tag]}</span>
          <span class="tx-item-val">${fmt(item.val)}</span>
        </div>
        <div class="tx-item-sub">${item.sub}</div>
      </div>`).join('');

    items.forEach((item, i) => {
      const card = document.getElementById(prefix + i);
      if (!card) return;
      card.addEventListener('click', () => {
        if (activeItem === prefix + i) {
          activeItem = null;
          document.getElementById('b03-s33-detail').classList.remove('show');
          document.querySelectorAll('#page-bab3 .tx-item').forEach(e => e.classList.remove('active'));
        } else {
          activeItem = prefix + i;
          document.querySelectorAll('#page-bab3 .tx-item').forEach(e => e.classList.remove('active'));
          card.classList.add('active');
          const head = document.getElementById('b03-s33-detail-head');
          const body = document.getElementById('b03-s33-detail-body');
          const det  = document.getElementById('b03-s33-detail');
          if (head) head.textContent = TAG_LABEL[item.tag] + ' · ' + fmt(item.val);
          if (body) body.textContent = item.detail;
          if (det)  det.classList.add('show');
        }
      });
    });
  }

  function renderBalance() {
    const p       = PRESETS[activePreset];
    const totalIn  = +(p.inputs.reduce((s, i) => s + i.val, 0)).toFixed(3);
    const totalOut = +(p.outputs.reduce((s, o) => s + o.val, 0)).toFixed(3);
    const fee      = +(totalIn - totalOut).toFixed(3);
    const el = document.getElementById('b03-s33-balance');
    if (!el) return;
    el.innerHTML = `
      <span style="font-size:11px;color:#3A3A35">Total input:</span>
      <span class="tx-balance-item">${fmt(totalIn)}</span>
      <span class="tx-balance-sep">=</span>
      <span style="font-size:11px;color:#3A3A35">Total output:</span>
      <span class="tx-balance-item">${fmt(totalOut)}</span>
      <span class="tx-balance-sep">+</span>
      <span style="font-size:11px;color:#3A3A35">Fee:</span>
      <span class="${fee >= 0 ? 'tx-balance-ok' : 'tx-balance-bad'}">${fmt(fee)}</span>`;
  }

  function render() {
    renderPresets();
    const p = PRESETS[activePreset];
    renderItems('b03-s33-inputs',  p.inputs,  'b03-s33-i-');
    renderItems('b03-s33-outputs', p.outputs, 'b03-s33-o-');
    renderBalance();
    const det = document.getElementById('b03-s33-detail');
    if (det) det.classList.remove('show');
  }

  function xorshiftRaw(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHexRaw(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshiftRaw(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}

  function buildRawTx(preset) {
    const p=PRESETS[preset];
    const txid=makeHexRaw(preset*0xdeadbeef,32);
    const vinRows=p.inputs.map((inp,i)=>{
      const prevTxid=makeHexRaw((preset*10+i+1)*0x1234abcd,32);
      const scriptHex=makeHexRaw((preset*10+i+1)*0xabcdef12,72);
      return `    {\n      <span class="raw-key">"txid"</span>: <span class="raw-str">"${prevTxid}"</span>,\n      <span class="raw-key">"vout"</span>: <span class="raw-num">0</span>,\n      <span class="raw-key">"scriptSig"</span>: { <span class="raw-key">"hex"</span>: <span class="raw-str">"${scriptHex.slice(0,32)}..."</span> },\n      <span class="raw-key">"txinwitness"</span>: [<span class="raw-str">"${makeHexRaw(i*0x1337,71)}"</span>],\n      <span class="raw-key">"sequence"</span>: <span class="raw-num">4294967293</span>,\n      <span class="raw-key">"value"</span>: <span class="raw-num">${inp.val.toFixed(8)}</span> <span class="raw-comment">// ${inp.sub}</span>\n    }`;
    }).join(',\n');
    const voutRows=p.outputs.map((out,i)=>{
      if(out.tag==='fee') return `    <span class="raw-comment">// Fee: ${out.val.toFixed(8)} BTC — implicit, selisih total input dan output</span>`;
      const addr=out.tag==='chg'?'bc1qkembalian...9c2d':`bc1qpenerima${i}...${makeHexRaw(i*0xabcd,2)}`;
      const sh=makeHexRaw((preset*20+i)*0x5678,22);
      return `    {\n      <span class="raw-key">"value"</span>: <span class="raw-num">${out.val.toFixed(8)}</span>,\n      <span class="raw-key">"n"</span>: <span class="raw-num">${i}</span>,\n      <span class="raw-key">"scriptPubKey"</span>: {\n        <span class="raw-key">"asm"</span>: <span class="raw-str">"OP_0 OP_PUSHBYTES_20 ${sh.slice(0,20)}"</span>, <span class="raw-comment">// data on-chain yang sebenarnya</span>\n        <span class="raw-key">"hex"</span>: <span class="raw-str">"0014${sh}"</span>, <span class="raw-comment">// on-chain</span>\n        <span class="raw-key">"type"</span>: <span class="raw-str">"witness_v0_keyhash"</span>,\n        <span class="raw-key">"address"</span>: <span class="raw-str">"${addr}"</span> <span class="raw-comment">// dihitung node dari hex — bukan on-chain</span>\n      } <span class="raw-comment">// ${out.sub}</span>\n    }`;
    }).join(',\n');
    const totalIn =(p.inputs.reduce((s,i)=>s+i.val,0)).toFixed(8);
    const totalOut=(p.outputs.reduce((s,o)=>s+o.val,0)).toFixed(8);
    const fee=(p.inputs.reduce((s,i)=>s+i.val,0)-p.outputs.reduce((s,o)=>s+o.val,0)).toFixed(8);
    return `<span class="raw-comment">// Yang tersimpan on-chain: txid, vin, vout (scriptPubKey hex)</span>\n<span class="raw-comment">// Field "address" ditambahkan node saat decode — tidak ada di data on-chain!</span>\n{\n  <span class="raw-key">"txid"</span>: <span class="raw-str">"${txid}"</span>,\n  <span class="raw-key">"version"</span>: <span class="raw-num">2</span>,\n  <span class="raw-key">"size"</span>: <span class="raw-num">${180+p.inputs.length*68+p.outputs.length*31}</span>,\n  <span class="raw-key">"vsize"</span>: <span class="raw-num">${110+p.inputs.length*41+p.outputs.length*31}</span>,\n  <span class="raw-key">"locktime"</span>: <span class="raw-num">0</span>,\n  <span class="raw-key">"vin"</span>: [\n${vinRows}\n  ],\n  <span class="raw-key">"vout"</span>: [\n${voutRows}\n  ],\n  <span class="raw-comment">// total_in: ${totalIn} | total_out: ${totalOut} | fee: ${fee} BTC</span>\n}`;
  }

  const rawBtn33=document.getElementById('b03-s33-raw-btn');
  const rawPanel33=document.getElementById('b03-s33-raw-panel');
  const rawBody33=document.getElementById('b03-s33-raw-body');
  let rawOpen33=false;

  function updateRaw33(){if(rawOpen33&&rawBody33)rawBody33.innerHTML=buildRawTx(activePreset);}

  if(rawBtn33) rawBtn33.addEventListener('click',()=>{
    rawOpen33=!rawOpen33;
    rawBtn33.classList.toggle('active',rawOpen33);
    rawBtn33.innerHTML=rawOpen33?'<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data':'<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if(rawOpen33&&rawPanel33){rawPanel33.classList.add('show');updateRaw33();}
    else if(rawPanel33) rawPanel33.classList.remove('show');
  });

  // Update raw saat preset berubah
  const origRender33=render;
  function renderWithRaw33(){origRender33();updateRaw33();}
  PRESETS.forEach((_,i)=>{
    const btn=document.getElementById('b03-s33-p-'+i);
    if(btn){btn.removeEventListener('click',btn._origHandler);btn._origHandler=()=>{activePreset=i;activeItem=null;renderWithRaw33();};btn.addEventListener('click',btn._origHandler);}
  });

  render();
})();

// PAGE 6 · BAB 3 · 3.4 SIMULATION (Transaction Fee)
// ============================================================
(function() {
  const RATES = {
    low:  { sat:5,   time:'~1-6 jam',          blocks:'~36 block' },
    med:  { sat:20,  time:'~10-30 menit',       blocks:'~2 block'  },
    high: { sat:100, time:'~block berikutnya',  blocks:'~1 block'  },
  };

  let numInputs  = 2;
  let numOutputs = 2;
  let rateKey    = 'med';

  function calcSize() {
    const overhead = 10;
    const inputSz  = numInputs  * 68;
    const outputSz = numOutputs * 31;
    return { overhead, inputSz, outputSz, total: overhead + inputSz + outputSz };
  }

  function update() {
    const sz      = calcSize();
    const rate    = RATES[rateKey];
    const feeSat  = sz.total * rate.sat;
    const feeBtc  = (feeSat / 1e8).toFixed(6);

    const get = id => document.getElementById(id);

    if (get('b03-s34-size-total'))    get('b03-s34-size-total').textContent    = sz.total + ' vB';
    if (get('b03-s34-overhead-bytes'))get('b03-s34-overhead-bytes').textContent = sz.overhead + ' vB';
    if (get('b03-s34-input-bytes'))   get('b03-s34-input-bytes').textContent   = sz.inputSz + ' vB';
    if (get('b03-s34-output-bytes'))  get('b03-s34-output-bytes').textContent  = sz.outputSz + ' vB';

    const bar = get('b03-s34-size-bar');
    if (bar) bar.innerHTML = `
      <div class="fee-size-bar overhead" style="flex:${sz.overhead}"></div>
      <div class="fee-size-bar inputs"   style="flex:${sz.inputSz}"></div>
      <div class="fee-size-bar outputs"  style="flex:${sz.outputSz}"></div>`;

    if (get('b03-s34-total-sat'))   get('b03-s34-total-sat').textContent   = feeSat.toLocaleString('id-ID') + ' sat';
    if (get('b03-s34-total-btc'))   get('b03-s34-total-btc').textContent   = feeBtc + ' BTC';
    if (get('b03-s34-rate-chosen')) get('b03-s34-rate-chosen').textContent = rate.sat + ' sat/vB';
    if (get('b03-s34-conf-time'))   get('b03-s34-conf-time').textContent   = rate.time;
    if (get('b03-s34-conf-blocks')) get('b03-s34-conf-blocks').textContent = rate.blocks;

    const mbar = get('b03-s34-mempool-bar');
    if (mbar) {
      const pos = rateKey === 'high' ? 0.05 : rateKey === 'med' ? 0.35 : 0.75;
      mbar.innerHTML = `
        <div class="fee-mempool-seg high" style="flex:${pos}"></div>
        <div class="fee-mempool-seg mine" style="flex:0.05"></div>
        <div class="fee-mempool-seg ${rateKey === 'low' ? 'low' : 'med'}" style="flex:${1 - pos - 0.05}"></div>`;
    }
  }

  const inpSlider = document.getElementById('b03-s34-inputs');
  const outSlider = document.getElementById('b03-s34-outputs');
  if (inpSlider) inpSlider.addEventListener('input', function() {
    numInputs = +this.value;
    const v = document.getElementById('b03-s34-inputs-val');
    if (v) v.textContent = numInputs + ' input';
    update();
  });
  if (outSlider) outSlider.addEventListener('input', function() {
    numOutputs = +this.value;
    const v = document.getElementById('b03-s34-outputs-val');
    if (v) v.textContent = numOutputs + ' output';
    update();
  });

  ['low','med','high'].forEach(k => {
    const card = document.getElementById('b03-s34-rate-' + k);
    if (card) card.addEventListener('click', () => {
      rateKey = k;
      ['low','med','high'].forEach(r => {
        const c = document.getElementById('b03-s34-rate-' + r);
        if (c) c.className = 'fee-rate-card' + (r === k ? ' active' : '');
      });
      update();
      updateRaw34();
    });
  });

  function xorshift34(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex34(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift34(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}

  function buildRawFee() {
    const sz      = calcSize();
    const rate    = RATES[rateKey];
    const feeSat  = sz.total * rate.sat;
    const feeBtc  = (feeSat / 1e8).toFixed(8);
    const txid    = makeHex34((numInputs*100+numOutputs)*0xdeadbeef, 32);
    const timeVal = Math.floor(Date.now()/1000) - Math.floor(Math.random()*120);
    const heightVal = 882417 - Math.floor(Math.random()*3);
    const confTime = rateKey==='high'?'~10 menit':rateKey==='med'?'~20-30 menit':'~1-6 jam';

    return `<span class="raw-comment">// bitcoin-cli getmempoolentry "${txid.slice(0,16)}..."</span>
{
  <span class="raw-key">"txid"</span>: <span class="raw-str">"${txid}"</span>,
  <span class="raw-key">"vsize"</span>: <span class="raw-num">${sz.total}</span>, <span class="raw-comment">// virtual bytes — dasar perhitungan fee</span>
  <span class="raw-key">"weight"</span>: <span class="raw-num">${sz.total * 4}</span>, <span class="raw-comment">// vsize x 4 (SegWit weight units)</span>
  <span class="raw-key">"fee"</span>: <span class="raw-num">${feeBtc}</span>, <span class="raw-comment">// BTC</span>
  <span class="raw-key">"fees"</span>: {
    <span class="raw-key">"base"</span>: <span class="raw-num">${feeBtc}</span>, <span class="raw-comment">// fee transaksi ini</span>
    <span class="raw-key">"modified"</span>: <span class="raw-num">${feeBtc}</span>
  },
  <span class="raw-key">"feerate"</span>: <span class="raw-num">${rate.sat}</span>, <span class="raw-comment">// sat/vB — ini yang menentukan prioritas di mempool</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeVal}</span>, <span class="raw-comment">// unix timestamp saat masuk mempool</span>
  <span class="raw-key">"height"</span>: <span class="raw-num">${heightVal}</span>, <span class="raw-comment">// block height saat broadcast</span>
  <span class="raw-key">"descendantcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"descendantsize"</span>: <span class="raw-num">${sz.total}</span>,
  <span class="raw-key">"ancestorcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"ancestorsize"</span>: <span class="raw-num">${sz.total}</span>,
  <span class="raw-key">"depends"</span>: [], <span class="raw-comment">// UTXO parent yang belum dikonfirmasi</span>
  <span class="raw-key">"spentby"</span>: [],

  <span class="raw-comment">// --- info tambahan dari node (tidak on-chain) ---</span>
  <span class="raw-key">"inputs"</span>: <span class="raw-num">${numInputs}</span>, <span class="raw-comment">// ${numInputs} input x 68 vB = ${sz.inputSz} vB</span>
  <span class="raw-key">"outputs"</span>: <span class="raw-num">${numOutputs}</span>, <span class="raw-comment">// ${numOutputs} output x 31 vB = ${sz.outputSz} vB</span>
  <span class="raw-key">"overhead"</span>: <span class="raw-num">${sz.overhead}</span>, <span class="raw-comment">// vB — header, version, locktime</span>
  <span class="raw-comment">// estimasi konfirmasi: ${confTime} pada ${rate.sat} sat/vB</span>
}`;
  }

  const rawBtn34   = document.getElementById('b03-s34-raw-btn');
  const rawPanel34 = document.getElementById('b03-s34-raw-panel');
  const rawBody34  = document.getElementById('b03-s34-raw-body');
  let rawOpen34 = false;

  function updateRaw34() {
    if (rawOpen34 && rawBody34) rawBody34.innerHTML = buildRawFee();
  }

  if (rawBtn34) rawBtn34.addEventListener('click', () => {
    rawOpen34 = !rawOpen34;
    rawBtn34.classList.toggle('active', rawOpen34);
    rawBtn34.innerHTML = rawOpen34
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if (rawOpen34 && rawPanel34) { rawPanel34.classList.add('show'); updateRaw34(); }
    else if (rawPanel34) rawPanel34.classList.remove('show');
  });

  // Update raw saat slider berubah
  const inpSlider34 = document.getElementById('b03-s34-inputs');
  const outSlider34 = document.getElementById('b03-s34-outputs');
  if (inpSlider34) inpSlider34.addEventListener('input', updateRaw34);
  if (outSlider34) outSlider34.addEventListener('input', updateRaw34);

  update();
})();

// PAGE 6 · BAB 3 · 3.5 SIMULATION (Mempool)
// ============================================================
(function() {
  const OTHERS = [
    {id:'a3f8...',fee:85,lbl:'tx orang lain'},
    {id:'7c2e...',fee:60,lbl:'tx orang lain'},
    {id:'1b9d...',fee:45,lbl:'tx orang lain'},
    {id:'4f1a...',fee:12,lbl:'tx orang lain'},
    {id:'9e3c...',fee:8, lbl:'tx orang lain'},
  ];
  const RATES   = {low:5, med:20, high:100};
  const MAX_CONF = 6;

  let rateKey = 'med', running = false, blockNum = 882417;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function txCard(id, fee, lbl, yours) {
    return `<div class="mp-tx ${yours?'yours':'other'}">
      <div class="mp-tx-top">
        <span class="mp-tx-id">${id}</span>
        <span class="mp-tx-fee ${yours?'y':'o'}">${fee} sat/vB</span>
      </div>
      <div class="mp-tx-lbl">${lbl}</div>
    </div>`;
  }

  function poolSorted(rate) {
    return [...OTHERS, {id:'txmu...',fee:rate,lbl:'transaksimu',yours:true}]
      .sort((a,b) => b.fee - a.fee);
  }

  function renderPool(rate, hideYours) {
    const el = document.getElementById('b03-s35-mempool');
    if (!el) return;
    el.innerHTML = poolSorted(rate).filter(t => hideYours ? !t.yours : true)
      .map(t => txCard(t.id, t.fee, t.lbl, t.yours)).join('');
  }

  function setStatus(n, txt) {
    const el = document.getElementById('b03-s35-status');
    if (el) el.innerHTML = `<div class="mp-status-step">Langkah ${n}</div>${txt}`;
  }

  function addBlock(num, label, txLine) {
    const bc = document.getElementById('b03-s35-blockchain');
    if (!bc) return;
    const el = document.createElement('div');
    el.className = 'mp-block';
    el.innerHTML = `<div class="mp-block-head">
      <span class="mp-block-num">#${num.toLocaleString('id-ID')}</span>
      <span class="mp-block-conf">${label}</span>
    </div><div class="mp-block-txs">${txLine}</div>`;
    bc.insertBefore(el, bc.firstChild);
  }

  function renderConf(n) {
    const wrap = document.getElementById('b03-s35-conf');
    const dots = document.getElementById('b03-s35-dots');
    const note = document.getElementById('b03-s35-conf-note');
    if (!wrap || !dots || !note) return;
    wrap.classList.add('show');
    dots.innerHTML = Array.from({length:MAX_CONF}, (_, i) => {
      const on = i < n;
      return `<div class="mp-dot ${on ? (n >= MAX_CONF ? 'done' : 'on') : ''}">${i+1}</div>`;
    }).join('');
    note.textContent = n === 1 ? '1 konfirmasi — cukup untuk transaksi kecil sehari-hari.' :
      n < MAX_CONF ? `${n} konfirmasi — semakin banyak, semakin final.` :
      '6 konfirmasi — dianggap final oleh seluruh jaringan. Selesai!';
  }

  async function run() {
    if (running) return;
    running = true;
    const bcBtn = document.getElementById('b03-s35-bc-btn');
    const pills = document.getElementById('b03-s35-pills');
    if (bcBtn)  bcBtn.disabled = true;
    if (pills)  { pills.style.pointerEvents = 'none'; pills.style.opacity = '0.5'; }

    const rate = RATES[rateKey];

    // Broadcast
    setStatus(2, 'Transaksimu disiarkan ke jaringan...');
    const bcast = document.getElementById('b03-s35-broadcast');
    if (bcast) bcast.innerHTML = txCard('txmu...', rate, 'transaksimu', true);
    await sleep(900);

    // Masuk mempool
    if (bcast) bcast.innerHTML = '';
    renderPool(rate, false);
    const skipBlocks = rateKey === 'high' ? 0 : rateKey === 'med' ? 1 : 3;
    const msg = rateKey === 'high' ? 'Fee-mu tertinggi, langsung masuk block berikutnya.' :
      rateKey === 'med' ? 'Fee-mu normal. Miner memilih fee tertinggi dulu.' :
      'Fee-mu rendah. Miner melewatimu beberapa kali sebelum memilihmu.';
    setStatus(3, 'Transaksimu ada di mempool. ' + msg);
    await sleep(1000);

    // Block tanpa tx kita
    for (let i = 0; i < skipBlocks; i++) {
      blockNum++;
      addBlock(blockNum, 'tx lain', '3 tx · ○ transaksimu dilewati');
      setStatus(3, `Block #${blockNum.toLocaleString('id-ID')} ditambang tapi transaksimu belum dipilih miner.`);
      await sleep(1200);
    }

    // Tx masuk block
    blockNum++;
    renderPool(rate, true);
    addBlock(blockNum, '1 konfirmasi', '3 tx · ✓ termasuk transaksimu');
    setStatus(4, 'Transaksimu masuk block #' + blockNum.toLocaleString('id-ID') + '! Mendapat 1 konfirmasi pertama.');
    renderConf(1);
    await sleep(1000);

    // Tambah konfirmasi sampai 6
    for (let c = 2; c <= MAX_CONF; c++) {
      blockNum++;
      addBlock(blockNum, `+1 konfirmasi (total ${c})`, '3 tx · konfirmasi tambahan');
      renderConf(c);
      if (c < MAX_CONF) setStatus(4, `${c} konfirmasi. Block baru terus ditambang di atas block transaksimu.`);
      else setStatus(5, '6 konfirmasi tercapai. Transaksimu sekarang dianggap final oleh seluruh jaringan.');
      await sleep(800);
    }

    running = false;
  }

  function resetSim() {
    if (running) return;
    rateKey = 'med'; blockNum = 882417;
    ['broadcast','mempool','blockchain'].forEach(id => {
      const el = document.getElementById('b03-s35-' + id);
      if (el) el.innerHTML = '';
    });
    const conf = document.getElementById('b03-s35-conf');
    if (conf) conf.classList.remove('show');
    const bcBtn = document.getElementById('b03-s35-bc-btn');
    const pills = document.getElementById('b03-s35-pills');
    if (bcBtn) bcBtn.disabled = false;
    if (pills) { pills.style.pointerEvents = ''; pills.style.opacity = ''; }
    ['low','med','high'].forEach(k => {
      const p = document.getElementById('b03-s35-pill-' + k);
      if (p) p.className = 'mp-pill' + (k === 'med' ? ' active' : '');
    });
    setStatus(1, 'Pilih fee rate, lalu klik "Broadcast". Simulasi akan berjalan otomatis sampai transaksimu dikonfirmasi.');
  }

  ['low','med','high'].forEach(k => {
    const pill = document.getElementById('b03-s35-pill-' + k);
    if (pill) pill.addEventListener('click', () => {
      if (running) return;
      rateKey = k;
      ['low','med','high'].forEach(r => {
        const p = document.getElementById('b03-s35-pill-' + r);
        if (p) p.className = 'mp-pill' + (r === k ? ' active' : '');
      });
    });
  });

  const bcBtn    = document.getElementById('b03-s35-bc-btn');
  const resetBtn = document.getElementById('b03-s35-reset-btn');

  // Raw data
  function xorshift35(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex35(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift35(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}

  const rawBtn35   = document.getElementById('b03-s35-raw-btn');
  const rawPanel35 = document.getElementById('b03-s35-raw-panel');
  const rawBody35  = document.getElementById('b03-s35-raw-body');
  let rawOpen35 = false;
  let rawState35 = 'idle'; // idle | mempool | confirmed
  let rawConf35  = 0;
  const rawTxid35 = makeHex35(0xcafe1234, 32);
  const rawBlock35 = 882418;

  function buildRaw35() {
    if (rawState35 === 'idle') {
      return 'Broadcast transaksi terlebih dahulu untuk melihat raw data-nya.';
    }
    const rate = RATES[rateKey];
    const vsize = 208;
    const feeSat = vsize * rate.sat;
    const feeBtc = (feeSat / 1e8).toFixed(8);
    const timeNow = Math.floor(Date.now()/1000);

    if (rawState35 === 'mempool') {
      return `<span class="raw-comment">// Transaksi ada di mempool — belum dikonfirmasi</span>
<span class="raw-comment">// bitcoin-cli getmempoolentry "${rawTxid35.slice(0,16)}..."</span>
{
  <span class="raw-key">"txid"</span>: <span class="raw-str">"${rawTxid35}"</span>,
  <span class="raw-key">"vsize"</span>: <span class="raw-num">${vsize}</span>,
  <span class="raw-key">"fee"</span>: <span class="raw-num">${feeBtc}</span>,
  <span class="raw-key">"feerate"</span>: <span class="raw-num">${rate.sat}</span>, <span class="raw-comment">// sat/vB</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeNow}</span>,
  <span class="raw-key">"height"</span>: <span class="raw-num">${rawBlock35 - 1}</span>, <span class="raw-comment">// block height saat broadcast</span>
  <span class="raw-key">"descendantcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"ancestorcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"depends"</span>: [],
  <span class="raw-comment">// STATUS: menunggu di mempool — belum masuk block</span>
}`;
    }

    // confirmed
    const blockHash = makeHex35(rawBlock35 * 0xdeadbeef, 32);
    return `<span class="raw-comment">// Transaksi sudah dikonfirmasi — ${rawConf35} konfirmasi</span>
<span class="raw-comment">// bitcoin-cli getrawtransaction "${rawTxid35.slice(0,16)}..." true</span>
{
  <span class="raw-key">"txid"</span>: <span class="raw-str">"${rawTxid35}"</span>,
  <span class="raw-key">"version"</span>: <span class="raw-num">2</span>,
  <span class="raw-key">"size"</span>: <span class="raw-num">${vsize + 40}</span>,
  <span class="raw-key">"vsize"</span>: <span class="raw-num">${vsize}</span>,
  <span class="raw-key">"locktime"</span>: <span class="raw-num">0</span>,
  <span class="raw-key">"fee"</span>: <span class="raw-num">${feeBtc}</span>,
  <span class="raw-key">"blockhash"</span>: <span class="raw-str">"${blockHash}"</span>,
  <span class="raw-key">"blockheight"</span>: <span class="raw-num">${rawBlock35}</span>,
  <span class="raw-key">"confirmations"</span>: <span class="raw-num">${rawConf35}</span>, <span class="raw-comment">// bertambah setiap block baru</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeNow + rawConf35 * 600}</span>, <span class="raw-comment">// unix timestamp block</span>
  <span class="raw-comment">// STATUS: ${rawConf35 >= 6 ? 'FINAL — dianggap tidak bisa dibalik' : `${rawConf35} konfirmasi — menunggu lebih banyak konfirmasi`}</span>
}`;
  }

  function updateRaw35() {
    if (rawOpen35 && rawBody35) rawBody35.innerHTML = buildRaw35();
  }

  if (rawBtn35) rawBtn35.addEventListener('click', () => {
    rawOpen35 = !rawOpen35;
    rawBtn35.classList.toggle('active', rawOpen35);
    rawBtn35.innerHTML = rawOpen35
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if (rawOpen35 && rawPanel35) { rawPanel35.classList.add('show'); updateRaw35(); }
    else if (rawPanel35) rawPanel35.classList.remove('show');
  });

  // Hook ke run() — update raw di setiap tahap
  const origRun35 = run;
  async function runWithRaw() {
    rawState35 = 'mempool';
    rawConf35  = 0;
    updateRaw35();
    await origRun35();
    rawState35 = 'confirmed';
    rawConf35  = 6;
    updateRaw35();
  }

  const origResetSim35 = resetSim;
  function resetWithRaw35() {
    origResetSim35();
    rawState35 = 'idle';
    rawConf35  = 0;
    updateRaw35();
  }

  if (bcBtn)    bcBtn.addEventListener('click', runWithRaw);
  if (resetBtn) resetBtn.addEventListener('click', resetWithRaw35);
})();

// ============================================================
// PAGE 6 · BAB 3 · 3.6 SIMULATION (Lifecycle Transaksi)
// ============================================================
(function() {
  const STEPS = [
    { num:'01', title:'Pembuatan',          body:'Wallet memilih UTXO yang cukup untuk menutupi jumlah yang ingin dikirim plus fee. Ia menyusun transaksi dengan input yang mereferensikan UTXO tersebut, output ke penerima, dan output kembalian ke pengirim kalau ada sisa.' },
    { num:'02', title:'Penandatanganan',    body:'Private key pengirim digunakan untuk membuat tanda tangan kriptografi yang membuktikan kepemilikan UTXO yang direferensikan. Tanda tangan ini unik untuk transaksi ini dan tidak bisa dipakai ulang untuk transaksi lain.' },
    { num:'03', title:'Broadcast',          body:'Transaksi yang sudah ditandatangani disiarkan ke jaringan. Node pertama yang menerimanya memvalidasi: apakah UTXO-nya ada dan belum dipakai? Apakah tanda tangannya valid? Kalau ya, ia meneruskan ke node-node tetangganya.' },
    { num:'04', title:'Mempool',            body:'Transaksi masuk ke mempool di setiap node yang menerimanya. Ia menunggu di sana bersama ribuan transaksi lain. Fee rate menentukan seberapa cepat miner memilihnya.' },
    { num:'05', title:'Seleksi miner',      body:'Ketika seorang miner sedang menyusun block baru, ia memilih transaksi dari mempool berdasarkan fee per vbyte tertinggi. Transaksimu masuk ke kandidat block yang sedang ditambang.' },
    { num:'06', title:'Block ditemukan',    body:'Miner menemukan bukti kerja yang valid dan menyiarkan block ke jaringan. Node-node lain memverifikasi dan menambahkannya ke blockchain. UTXO yang direferensikan ditandai spent. Output baru menjadi UTXO segar milik penerima.' },
    { num:'07', title:'Konfirmasi bertambah', body:'Setiap block baru yang ditambang di atas block tersebut menambah satu konfirmasi. Semakin banyak konfirmasi, semakin dalam transaksi tertanam di blockchain, semakin tidak mungkin dibalik.' },
  ];

  let currentStep = -1;
  let running     = false;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function renderTimeline() {
    const tl = document.getElementById('b03-s36-timeline');
    if (!tl) return;
    tl.innerHTML = STEPS.map((s, i) => {
      const isDone   = i < currentStep;
      const isActive = i === currentStep;
      const isLast   = i === STEPS.length - 1;
      const dotCls   = isDone ? 'done' : isActive ? 'active' : '';
      const titleCls = isDone ? 'done' : isActive ? 'active' : '';
      const bodyCls  = isActive ? 'show active-body' : isDone ? 'show' : '';
      const lineCls  = isDone ? 'done' : '';
      return `
        <div class="lc-step" id="b03-s36-step-${i}">
          <div class="lc-left">
            <div class="lc-dot ${dotCls}">${isDone ? '✓' : s.num}</div>
            ${!isLast ? `<div class="lc-line ${lineCls}"></div>` : ''}
          </div>
          <div class="lc-right">
            <div class="lc-step-head">
              <span class="lc-step-num">Tahap ${s.num}</span>
            </div>
            <div class="lc-step-title ${titleCls}">${s.title}</div>
            <div class="lc-step-body ${bodyCls}">${s.body}</div>
          </div>
        </div>`;
    }).join('');

    STEPS.forEach((_, i) => {
      if (i > currentStep) return;
      const el = document.getElementById('b03-s36-step-' + i);
      if (!el) return;
      el.addEventListener('click', () => {
        const body = el.querySelector('.lc-step-body');
        if (!body) return;
        if (body.classList.contains('show')) {
          body.classList.remove('show');
          body.classList.remove('active-body');
        } else {
          body.classList.add('show');
          if (i === currentStep) body.classList.add('active-body');
        }
      });
    });
  }

  async function startSim() {
    if (running) return;
    running = true;
    const startBtn = document.getElementById('b03-s36-start');
    if (startBtn) startBtn.disabled = true;

    for (let i = 0; i < STEPS.length; i++) {
      currentStep = i;
      renderTimeline();
      const el = document.getElementById('b03-s36-step-' + i);
      if (el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
      await sleep(i === STEPS.length - 1 ? 600 : 1200);
    }

    currentStep = STEPS.length;
    renderTimeline();
    running = false;
  }

  function resetSim() {
    if (running) return;
    currentStep = -1;
    renderTimeline();
    const startBtn = document.getElementById('b03-s36-start');
    if (startBtn) startBtn.disabled = false;
  }

  const startBtn = document.getElementById('b03-s36-start');
  const resetBtn = document.getElementById('b03-s36-reset');
  if (startBtn) startBtn.addEventListener('click', startSim);
  if (resetBtn) resetBtn.addEventListener('click', resetSim);

  renderTimeline();
})();

