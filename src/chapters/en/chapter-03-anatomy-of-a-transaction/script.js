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
    { id:0, val:0.05, label:'from: Alice',    age:'3 days ago',    spent:false },
    { id:1, val:0.12, label:'from: Bob',      age:'1 week ago',    spent:false },
    { id:2, val:0.08, label:'Mining reward',  age:'2 weeks ago',   spent:false },
    { id:3, val:0.30, label:'from: Charlie',  age:'1 month ago',   spent:false },
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
        noteEl.textContent = 'Choose UTXOs manually or click "Auto-select". Each UTXO must be used in full. The remainder comes back as a new UTXO (change).';
      } else if (!canSend) {
        noteEl.textContent = 'The selected UTXOs aren’t enough yet to cover the send amount + fee (' + fmt(sendAmt + FEE) + '). Choose more UTXOs.';
      } else {
        noteEl.textContent = 'The selected UTXOs are enough. Change of ' + fmt(change) + ' will become a new UTXO in your wallet.';
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
        <span class="utxo-flow-tag consumed">Consumed</span>
        <span class="utxo-flow-val">${fmt(UTXOS[id].val)}</span>
        <span class="utxo-flow-arrow">←</span>
        <span class="utxo-flow-sub">${UTXOS[id].label}</span>
      </div>`).join('');

    const outputRows = `
      <div class="utxo-flow-row">
        <span class="utxo-flow-tag created">New output</span>
        <span class="utxo-flow-val">${fmt(sendAmt)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">to the recipient</span>
      </div>
      ${change > 0 ? `<div class="utxo-flow-row">
        <span class="utxo-flow-tag created">Change</span>
        <span class="utxo-flow-val">${fmt(change)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">back to your wallet (new UTXO)</span>
      </div>` : ''}
      <div class="utxo-flow-row">
        <span class="utxo-flow-tag fee">Miner fee</span>
        <span class="utxo-flow-val">${fmt(FEE)}</span>
        <span class="utxo-flow-arrow">→</span>
        <span class="utxo-flow-sub">for the miner who processes the transaction</span>
      </div>`;

    body.innerHTML = inputRows + '<hr class="utxo-hr">' + outputRows;

    const resultEl = document.getElementById('b03-s32-result');
    const noteEl   = document.getElementById('b03-s32-note');
    if (resultEl) resultEl.classList.add('show');
    if (noteEl)   noteEl.textContent = 'The consumed UTXOs can no longer be used. The new outputs (including change) become fresh UTXOs that can be used in the next transaction.';
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
    <span class="raw-key">"address"</span>: <span class="raw-str">"bc1q${txid.slice(0,8)}...${txid.slice(-4)}"</span>, <span class="raw-comment">// computed by the node from the scriptPubKey — not on-chain data</span>
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
      <span class="raw-key">"asm"</span>: <span class="raw-str">"OP_0 OP_PUSHBYTES_20 a1b2c3..."</span>, <span class="raw-comment">// the actual on-chain data</span>
      <span class="raw-key">"hex"</span>: <span class="raw-str">"0014a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"</span>,
      <span class="raw-key">"type"</span>: <span class="raw-str">"witness_v0_keyhash"</span>,
      <span class="raw-key">"address"</span>: <span class="raw-str">"bc1qrecipient...3f8a"</span> <span class="raw-comment">// computed by the node — not on-chain</span>
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
      <span class="raw-key">"address"</span>: <span class="raw-str">"bc1qchange...9c2d"</span> <span class="raw-comment">// computed by the node — not on-chain</span>
    }
  }` : '';

    return `<span class="raw-comment">// Consumed input UTXOs (listunspent before the transaction):</span>
[
${inputs}
]

<span class="raw-comment">// Transaction outputs created:</span>
<span class="raw-comment">// What is stored on-chain: scriptPubKey hex — not the address!</span>
<span class="raw-comment">// The "address" field is added by the node when displaying outputs for readability.</span>
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
      ? '<span class="raw-toggle-icon">{}</span> Hide Raw Data'
      : '<span class="raw-toggle-icon">{}</span> View Raw Data';
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
      label:'Simple transaction',
      inputs:[
        { tag:'inp', val:0.10, sub:'UTXO from Alice · 3 days ago',
          detail:'This input references a UTXO worth 0.10 BTC once received from Alice. To use it, this transaction includes a cryptographic signature proving ownership of the matching private key.' },
      ],
      outputs:[
        { tag:'out', val:0.06,  sub:'to: Bob (bc1q...3f8a)',
          detail:'Main output: 0.06 BTC sent to Bob’s address. The condition to spend this output is anyone who can prove they hold the private key matching the address bc1q...3f8a.' },
        { tag:'chg', val:0.039, sub:'change (bc1q...9c2d)',
          detail:'The change is returned to the sender’s wallet as a new UTXO. This isn’t a "stored" balance, but a separate output that can be used in the next transaction.' },
        { tag:'fee', val:0.001, sub:'miner fee',
          detail:'The fee isn’t written explicitly. It is the difference between the total input (0.10) and total output (0.06 + 0.039 = 0.099). The 0.001 BTC difference automatically becomes the reward for the miner who includes this transaction in a block.' },
      ],
    },
    {
      label:'Combine small UTXOs',
      inputs:[
        { tag:'inp', val:0.03, sub:'UTXO #1 · mining reward',
          detail:'First input: a small UTXO from a mining reward. One UTXO isn’t enough to pay, so several UTXOs are combined into one transaction.' },
        { tag:'inp', val:0.05, sub:'UTXO #2 · from Charlie',
          detail:'Second input: a UTXO from Charlie. When a wallet needs to pay more than the value of a single UTXO, it combines several UTXOs as inputs in one transaction.' },
        { tag:'inp', val:0.04, sub:'UTXO #3 · from old change',
          detail:'Third input: a UTXO from a previous transaction’s change. This shows that change from an old transaction can be used as an input in a new one.' },
      ],
      outputs:[
        { tag:'out', val:0.11, sub:'to: Dana (bc1q...7e1b)',
          detail:'Output to Dana: 0.11 BTC. Three small UTXOs (0.03 + 0.05 + 0.04 = 0.12 BTC) are combined to pay a single large output. This is a common pattern when a wallet consolidates small UTXOs.' },
        { tag:'fee', val:0.009, sub:'miner fee',
          detail:'The fee is larger because this transaction has 3 inputs. Fees in Bitcoin are calculated based on transaction size in bytes, not Bitcoin value. More inputs means a larger transaction, a higher fee.' },
      ],
    },
    {
      label:'Send to many addresses',
      inputs:[
        { tag:'inp', val:0.50, sub:'Large UTXO · from Bob',
          detail:'One large UTXO is used as the only input. Bitcoin doesn’t force one input per output — a single input can produce many outputs at once.' },
      ],
      outputs:[
        { tag:'out', val:0.15,  sub:'to: Alice (bc1q...2a4f)',
          detail:'First output to Alice: 0.15 BTC. Sending to many addresses at once is more efficient than making separate transactions because you pay only one fee.' },
        { tag:'out', val:0.20,  sub:'to: Bob (bc1q...8b3c)',
          detail:'Second output to Bob: 0.20 BTC. This can be used to pay salaries, split a bill, or any distribution in a single transaction.' },
        { tag:'chg', val:0.149, sub:'change (bc1q...5d9e)',
          detail:'Change to the sender: 0.149 BTC. Of the 0.50 BTC input, 0.15 + 0.20 = 0.35 is sent, 0.149 returns, and 0.001 becomes the fee.' },
        { tag:'fee', val:0.001, sub:'miner fee',
          detail:'The fee stays the same despite two outputs because the transaction size doesn’t differ much from a one-output transaction.' },
      ],
    },
  ];

  const TAG_LABEL = { inp:'Input', out:'Output', chg:'Change', fee:'Miner Fee' };
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
      if(out.tag==='fee') return `    <span class="raw-comment">// Fee: ${out.val.toFixed(8)} BTC — implicit, the difference between total input and output</span>`;
      const addr=out.tag==='chg'?'bc1qchange...9c2d':`bc1qrecipient${i}...${makeHexRaw(i*0xabcd,2)}`;
      const sh=makeHexRaw((preset*20+i)*0x5678,22);
      return `    {\n      <span class="raw-key">"value"</span>: <span class="raw-num">${out.val.toFixed(8)}</span>,\n      <span class="raw-key">"n"</span>: <span class="raw-num">${i}</span>,\n      <span class="raw-key">"scriptPubKey"</span>: {\n        <span class="raw-key">"asm"</span>: <span class="raw-str">"OP_0 OP_PUSHBYTES_20 ${sh.slice(0,20)}"</span>, <span class="raw-comment">// the actual on-chain data</span>\n        <span class="raw-key">"hex"</span>: <span class="raw-str">"0014${sh}"</span>, <span class="raw-comment">// on-chain</span>\n        <span class="raw-key">"type"</span>: <span class="raw-str">"witness_v0_keyhash"</span>,\n        <span class="raw-key">"address"</span>: <span class="raw-str">"${addr}"</span> <span class="raw-comment">// computed by the node from hex — not on-chain</span>\n      } <span class="raw-comment">// ${out.sub}</span>\n    }`;
    }).join(',\n');
    const totalIn =(p.inputs.reduce((s,i)=>s+i.val,0)).toFixed(8);
    const totalOut=(p.outputs.reduce((s,o)=>s+o.val,0)).toFixed(8);
    const fee=(p.inputs.reduce((s,i)=>s+i.val,0)-p.outputs.reduce((s,o)=>s+o.val,0)).toFixed(8);
    return `<span class="raw-comment">// What is stored on-chain: txid, vin, vout (scriptPubKey hex)</span>\n<span class="raw-comment">// The "address" field is added by the node when decoding — it is not in the on-chain data!</span>\n{\n  <span class="raw-key">"txid"</span>: <span class="raw-str">"${txid}"</span>,\n  <span class="raw-key">"version"</span>: <span class="raw-num">2</span>,\n  <span class="raw-key">"size"</span>: <span class="raw-num">${180+p.inputs.length*68+p.outputs.length*31}</span>,\n  <span class="raw-key">"vsize"</span>: <span class="raw-num">${110+p.inputs.length*41+p.outputs.length*31}</span>,\n  <span class="raw-key">"locktime"</span>: <span class="raw-num">0</span>,\n  <span class="raw-key">"vin"</span>: [\n${vinRows}\n  ],\n  <span class="raw-key">"vout"</span>: [\n${voutRows}\n  ],\n  <span class="raw-comment">// total_in: ${totalIn} | total_out: ${totalOut} | fee: ${fee} BTC</span>\n}`;
  }

  const rawBtn33=document.getElementById('b03-s33-raw-btn');
  const rawPanel33=document.getElementById('b03-s33-raw-panel');
  const rawBody33=document.getElementById('b03-s33-raw-body');
  let rawOpen33=false;

  function updateRaw33(){if(rawOpen33&&rawBody33)rawBody33.innerHTML=buildRawTx(activePreset);}

  if(rawBtn33) rawBtn33.addEventListener('click',()=>{
    rawOpen33=!rawOpen33;
    rawBtn33.classList.toggle('active',rawOpen33);
    rawBtn33.innerHTML=rawOpen33?'<span class="raw-toggle-icon">{}</span> Hide Raw Data':'<span class="raw-toggle-icon">{}</span> View Raw Data';
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
    low:  { sat:5,   time:'~1-6 hours',          blocks:'~36 block' },
    med:  { sat:20,  time:'~10-30 minutes',       blocks:'~2 block'  },
    high: { sat:100, time:'~next block',          blocks:'~1 block'  },
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
    const confTime = rateKey==='high'?'~10 minutes':rateKey==='med'?'~20-30 minutes':'~1-6 hours';

    return `<span class="raw-comment">// bitcoin-cli getmempoolentry "${txid.slice(0,16)}..."</span>
{
  <span class="raw-key">"txid"</span>: <span class="raw-str">"${txid}"</span>,
  <span class="raw-key">"vsize"</span>: <span class="raw-num">${sz.total}</span>, <span class="raw-comment">// virtual bytes — the basis for fee calculation</span>
  <span class="raw-key">"weight"</span>: <span class="raw-num">${sz.total * 4}</span>, <span class="raw-comment">// vsize x 4 (SegWit weight units)</span>
  <span class="raw-key">"fee"</span>: <span class="raw-num">${feeBtc}</span>, <span class="raw-comment">// BTC</span>
  <span class="raw-key">"fees"</span>: {
    <span class="raw-key">"base"</span>: <span class="raw-num">${feeBtc}</span>, <span class="raw-comment">// this transaction&#39;s fee</span>
    <span class="raw-key">"modified"</span>: <span class="raw-num">${feeBtc}</span>
  },
  <span class="raw-key">"feerate"</span>: <span class="raw-num">${rate.sat}</span>, <span class="raw-comment">// sat/vB — this determines priority in the mempool</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeVal}</span>, <span class="raw-comment">// unix timestamp when it entered the mempool</span>
  <span class="raw-key">"height"</span>: <span class="raw-num">${heightVal}</span>, <span class="raw-comment">// block height at broadcast</span>
  <span class="raw-key">"descendantcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"descendantsize"</span>: <span class="raw-num">${sz.total}</span>,
  <span class="raw-key">"ancestorcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"ancestorsize"</span>: <span class="raw-num">${sz.total}</span>,
  <span class="raw-key">"depends"</span>: [], <span class="raw-comment">// unconfirmed parent UTXOs</span>
  <span class="raw-key">"spentby"</span>: [],

  <span class="raw-comment">// --- additional info from the node (not on-chain) ---</span>
  <span class="raw-key">"inputs"</span>: <span class="raw-num">${numInputs}</span>, <span class="raw-comment">// ${numInputs} input x 68 vB = ${sz.inputSz} vB</span>
  <span class="raw-key">"outputs"</span>: <span class="raw-num">${numOutputs}</span>, <span class="raw-comment">// ${numOutputs} output x 31 vB = ${sz.outputSz} vB</span>
  <span class="raw-key">"overhead"</span>: <span class="raw-num">${sz.overhead}</span>, <span class="raw-comment">// vB — header, version, locktime</span>
  <span class="raw-comment">// confirmation estimate: ${confTime} at ${rate.sat} sat/vB</span>
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
      ? '<span class="raw-toggle-icon">{}</span> Hide Raw Data'
      : '<span class="raw-toggle-icon">{}</span> View Raw Data';
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
    {id:'a3f8...',fee:85,lbl:'someone else’s tx'},
    {id:'7c2e...',fee:60,lbl:'someone else’s tx'},
    {id:'1b9d...',fee:45,lbl:'someone else’s tx'},
    {id:'4f1a...',fee:12,lbl:'someone else’s tx'},
    {id:'9e3c...',fee:8, lbl:'someone else’s tx'},
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
    return [...OTHERS, {id:'txmu...',fee:rate,lbl:'your transaction',yours:true}]
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
    if (el) el.innerHTML = `<div class="mp-status-step">Step ${n}</div>${txt}`;
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
    note.textContent = n === 1 ? '1 confirmation — enough for small everyday transactions.' :
      n < MAX_CONF ? `${n} confirmations — the more, the more final.` :
      '6 confirmations — considered final by the entire network. Done!';
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
    setStatus(2, 'Your transaction is broadcast to the network...');
    const bcast = document.getElementById('b03-s35-broadcast');
    if (bcast) bcast.innerHTML = txCard('txmu...', rate, 'your transaction', true);
    await sleep(900);

    // Masuk mempool
    if (bcast) bcast.innerHTML = '';
    renderPool(rate, false);
    const skipBlocks = rateKey === 'high' ? 0 : rateKey === 'med' ? 1 : 3;
    const msg = rateKey === 'high' ? 'Your fee is the highest, going straight into the next block.' :
      rateKey === 'med' ? 'Your fee is normal. Miners pick the highest fees first.' :
      'Your fee is low. Miners skip you several times before picking you.';
    setStatus(3, 'Your transaction is in the mempool. ' + msg);
    await sleep(1000);

    // Block tanpa tx kita
    for (let i = 0; i < skipBlocks; i++) {
      blockNum++;
      addBlock(blockNum, 'other tx', '3 tx · ○ your transaction skipped');
      setStatus(3, `Block #${blockNum.toLocaleString('id-ID')} is mined but your transaction hasn’t been picked by a miner yet.`);
      await sleep(1200);
    }

    // Tx masuk block
    blockNum++;
    renderPool(rate, true);
    addBlock(blockNum, '1 confirmation', '3 tx · ✓ includes your transaction');
    setStatus(4, 'Your transaction entered block #' + blockNum.toLocaleString('id-ID') + '! It got its first confirmation.');
    renderConf(1);
    await sleep(1000);

    // Tambah konfirmasi sampai 6
    for (let c = 2; c <= MAX_CONF; c++) {
      blockNum++;
      addBlock(blockNum, `+1 confirmation (total ${c})`, '3 tx · additional confirmation');
      renderConf(c);
      if (c < MAX_CONF) setStatus(4, `${c} confirmations. New blocks keep being mined on top of your transaction’s block.`);
      else setStatus(5, '6 confirmations reached. Your transaction is now considered final by the entire network.');
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
    setStatus(1, 'Choose a fee rate, then click "Broadcast". The simulation will run automatically until your transaction is confirmed.');
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
      return 'Broadcast a transaction first to see its raw data.';
    }
    const rate = RATES[rateKey];
    const vsize = 208;
    const feeSat = vsize * rate.sat;
    const feeBtc = (feeSat / 1e8).toFixed(8);
    const timeNow = Math.floor(Date.now()/1000);

    if (rawState35 === 'mempool') {
      return `<span class="raw-comment">// Transaction is in the mempool — not yet confirmed</span>
<span class="raw-comment">// bitcoin-cli getmempoolentry "${rawTxid35.slice(0,16)}..."</span>
{
  <span class="raw-key">"txid"</span>: <span class="raw-str">"${rawTxid35}"</span>,
  <span class="raw-key">"vsize"</span>: <span class="raw-num">${vsize}</span>,
  <span class="raw-key">"fee"</span>: <span class="raw-num">${feeBtc}</span>,
  <span class="raw-key">"feerate"</span>: <span class="raw-num">${rate.sat}</span>, <span class="raw-comment">// sat/vB</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeNow}</span>,
  <span class="raw-key">"height"</span>: <span class="raw-num">${rawBlock35 - 1}</span>, <span class="raw-comment">// block height at broadcast</span>
  <span class="raw-key">"descendantcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"ancestorcount"</span>: <span class="raw-num">1</span>,
  <span class="raw-key">"depends"</span>: [],
  <span class="raw-comment">// STATUS: waiting in the mempool — not yet in a block</span>
}`;
    }

    // confirmed
    const blockHash = makeHex35(rawBlock35 * 0xdeadbeef, 32);
    return `<span class="raw-comment">// Transaction confirmed — ${rawConf35} confirmations</span>
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
  <span class="raw-key">"confirmations"</span>: <span class="raw-num">${rawConf35}</span>, <span class="raw-comment">// increases with each new block</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">${timeNow + rawConf35 * 600}</span>, <span class="raw-comment">// unix timestamp block</span>
  <span class="raw-comment">// STATUS: ${rawConf35 >= 6 ? 'FINAL — considered irreversible' : `${rawConf35} confirmations — waiting for more confirmations`}</span>
}`;
  }

  function updateRaw35() {
    if (rawOpen35 && rawBody35) rawBody35.innerHTML = buildRaw35();
  }

  if (rawBtn35) rawBtn35.addEventListener('click', () => {
    rawOpen35 = !rawOpen35;
    rawBtn35.classList.toggle('active', rawOpen35);
    rawBtn35.innerHTML = rawOpen35
      ? '<span class="raw-toggle-icon">{}</span> Hide Raw Data'
      : '<span class="raw-toggle-icon">{}</span> View Raw Data';
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
    { num:'01', title:'Creation',          body:'The wallet chooses UTXOs sufficient to cover the amount to be sent plus the fee. It assembles a transaction with inputs referencing those UTXOs, an output to the recipient, and a change output back to the sender if there’s a remainder.' },
    { num:'02', title:'Signing',    body:'The sender’s private key is used to create a cryptographic signature that proves ownership of the referenced UTXO. This signature is unique to this transaction and can’t be reused for another transaction.' },
    { num:'03', title:'Broadcast',          body:'The signed transaction is broadcast to the network. The first node that receives it validates: do its UTXOs exist and are they unspent? Is the signature valid? If yes, it forwards it to its neighboring nodes.' },
    { num:'04', title:'Mempool',            body:'The transaction enters the mempool on every node that receives it. It waits there alongside thousands of other transactions. The fee rate determines how quickly a miner picks it.' },
    { num:'05', title:'Miner selection',      body:'When a miner is assembling a new block, it chooses transactions from the mempool based on the highest fee per vbyte. Your transaction enters the candidate block being mined.' },
    { num:'06', title:'Block found',    body:'The miner finds a valid proof of work and broadcasts the block to the network. Other nodes verify it and add it to the blockchain. The referenced UTXOs are marked spent. The new outputs become fresh UTXOs belonging to the recipient.' },
    { num:'07', title:'Confirmations accumulate', body:'Each new block mined on top of that block adds one confirmation. The more confirmations, the deeper the transaction is embedded in the blockchain, the more impossible it is to reverse.' },
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
              <span class="lc-step-num">Stage ${s.num}</span>
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

