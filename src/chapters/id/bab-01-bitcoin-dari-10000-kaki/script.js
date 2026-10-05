// PAGE 4 · BAB 1 · TOPBAR & BACK EVENTS
// ============================================================
document.getElementById('back-home-b1').addEventListener('click', () => navigate('page-welcome'));
document.getElementById('back-chapters-b1').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 4 · BAB 1 · SUB-BAB NAVIGATION
// Scoped ke #page-bab1 agar tidak konflik dengan Prologue
// ============================================================
function showSectionInContent(sectionId, sbId, contentId) {
  document.querySelectorAll('#page-bab1 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab1 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById(contentId);
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// tombol nav Bab 1 (data-target, data-sb, data-content)
document.querySelectorAll('#page-bab1 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target  = btn.getAttribute('data-target');
    const sb      = btn.getAttribute('data-sb');
    const content = btn.getAttribute('data-content') || 'bab1-content';
    if (target && sb) showSectionInContent(target, sb, content);
  });
});

// ============================================================
// PAGE 4 · BAB 1 · SIDEBAR EVENTS (1.1 - 1.6)
// ============================================================
document.getElementById('sb-1-1').addEventListener('click', () => showSectionInContent('section-1-1', 'sb-1-1', 'bab1-content'));
document.getElementById('sb-1-2').addEventListener('click', () => showSectionInContent('section-1-2', 'sb-1-2', 'bab1-content'));
document.getElementById('sb-1-3').addEventListener('click', () => showSectionInContent('section-1-3', 'sb-1-3', 'bab1-content'));
document.getElementById('sb-1-4').addEventListener('click', () => showSectionInContent('section-1-4', 'sb-1-4', 'bab1-content'));
document.getElementById('sb-1-5').addEventListener('click', () => showSectionInContent('section-1-5', 'sb-1-5', 'bab1-content'));
document.getElementById('sb-1-6').addEventListener('click', () => showSectionInContent('section-1-6', 'sb-1-6', 'bab1-content'));

// ============================================================
// PAGE 4 · BAB 1 · 1.2 SIMULATION (Transaksi Bank vs Bitcoin)
// ============================================================
(function() {
  const BANK_STEPS = [
    { icon:'🧑', name:'Pengirim',       detail:'Inisiasi transfer melalui aplikasi bank.' },
    { icon:'🏦', name:'Bank Pengirim',  detail:'Verifikasi saldo, identitas, dan compliance. Jam operasional berlaku.' },
    { icon:'🔄', name:'Clearing House', detail:'Perantara antar bank. Proses batch, hanya berjalan di jam kerja.' },
    { icon:'🌐', name:'SWIFT Network',  detail:'Untuk transfer internasional. Bisa melewati 2-3 bank koresponden.' },
    { icon:'🏦', name:'Bank Penerima',  detail:'Menerima dana, memverifikasi ulang, mengkredit rekening.' },
    { icon:'🧑', name:'Penerima',       detail:'Dana masuk ke rekening.' },
  ];
  const BTC_STEPS = [
    { icon:'🧑', name:'Pengirim',        detail:'Buat transaksi, tanda tangani dengan private key.' },
    { icon:'📡', name:'Broadcast',       detail:'Transaksi disiarkan ke seluruh jaringan dalam hitungan detik.' },
    { icon:'🌐', name:'Node Jaringan',   detail:'Ribuan node memverifikasi transaksi secara bersamaan.' },
    { icon:'⛏️', name:'Mempool',         detail:'Transaksi menunggu diambil miner untuk dimasukkan ke block.' },
    { icon:'🧱', name:'Block Ditemukan', detail:'Miner berhasil. Transaksi masuk block pertama, 1 konfirmasi.' },
    { icon:'🧑', name:'Penerima',        detail:'Setelah 6 konfirmasi (~1 jam), dana final dan tidak bisa diubah.' },
  ];
  const NODE_EMOJIS = ['💻','🖥️','💻','🖥️','💻','🖥️','💻','🖥️','💻','🖥️','💻','🖥️'];
  const EVIL_NODE   = 5;
  const TOTAL_NODES = 12;
  const BLOCK_AT    = 3;

  let mode     = 'bank';
  let scenario = 'normal';
  let running  = false;
  let confirmInterval = null;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function renderFlow(steps) {
    document.getElementById('b01-s12-flow').innerHTML = steps.map((s, i) =>
      `<div class="tx-step" id="b01-s12-step-${i}">
        <div class="tx-step-icon">${s.icon}</div>
        <div class="tx-step-info">
          <div class="tx-step-name">${s.name}</div>
          <div class="tx-step-detail" id="b01-s12-detail-${i}">${s.detail}</div>
        </div>
        <div class="tx-step-status" id="b01-s12-st-${i}"></div>
      </div>`
    ).join('');
  }

  function setStep(i, state, statusText, statusClass) {
    const el = document.getElementById('b01-s12-step-' + i);
    const st = document.getElementById('b01-s12-st-' + i);
    if (!el || !st) return;
    el.className = `tx-step ${state}`;
    st.textContent = statusText;
    st.className = `tx-step-status show ${statusClass}`;
  }

  function freezeRemaining(from, total) {
    for (let i = from; i < total; i++) {
      const el = document.getElementById('b01-s12-step-' + i);
      if (el) el.className = 'tx-step frozen';
    }
  }

  function renderNodes() {
    const grid = document.getElementById('b01-s12-node-grid');
    grid.innerHTML = '';
    for (let i = 0; i < TOTAL_NODES; i++) {
      const div = document.createElement('div');
      div.className = 'node';
      div.id = 'b01-s12-node-' + i;
      div.innerHTML = `<span>${NODE_EMOJIS[i]}</span><span class="node-label" id="b01-s12-nlbl-${i}"></span>`;
      grid.appendChild(div);
    }
  }

  async function runNodeConsensus() {
    document.getElementById('b01-s12-node-grid-wrap').classList.add('show');
    document.getElementById('b01-s12-node-grid-label').textContent = 'Node-node memverifikasi transaksi...';
    renderNodes();
    await sleep(400);
    for (let i = 0; i < TOTAL_NODES; i++) {
      document.getElementById('b01-s12-node-' + i).className = 'node validating';
      document.getElementById('b01-s12-nlbl-' + i).textContent = '...';
      await sleep(80);
    }
    await sleep(600);
    document.getElementById('b01-s12-node-' + EVIL_NODE).className = 'node evil';
    document.getElementById('b01-s12-nlbl-' + EVIL_NODE).textContent = 'TOLAK ✗';
    await sleep(400);
    for (let i = 0; i < TOTAL_NODES; i++) {
      if (i === EVIL_NODE) continue;
      document.getElementById('b01-s12-node-' + i).className = 'node valid';
      document.getElementById('b01-s12-nlbl-' + i).textContent = 'VALID ✓';
      await sleep(120);
    }
    await sleep(500);
    document.getElementById('b01-s12-node-' + EVIL_NODE).className = 'node rejected';
    document.getElementById('b01-s12-nlbl-' + EVIL_NODE).textContent = 'KALAH ✗';
    document.getElementById('b01-s12-node-grid-label').textContent =
      `${TOTAL_NODES - 1} node valid vs 1 node menolak — konsensus mayoritas menang.`;
    const consensus = document.getElementById('b01-s12-node-consensus');
    consensus.className = 'node-consensus valid show';
    consensus.innerHTML = `✅ <strong>Konsensus tercapai.</strong> ${TOTAL_NODES - 1} dari ${TOTAL_NODES} node menyatakan transaksi valid. Node yang menolak diabaikan jaringan. Untuk menghentikan Bitcoin, seseorang harus menguasai lebih dari 50% seluruh node di dunia secara bersamaan.`;
  }

  function resetTx() {
    document.getElementById('b01-s12-confirm').classList.remove('show');
    document.getElementById('b01-s12-result').className = 'tx-result';
    document.getElementById('b01-s12-result').innerHTML = '';
    document.getElementById('b01-s12-node-grid-wrap').classList.remove('show');
    document.getElementById('b01-s12-node-consensus').className = 'node-consensus';
    for (let i = 1; i <= 6; i++) {
      const cb = document.getElementById('b01-s12-cb-' + i);
      if (cb) cb.classList.remove('confirmed');
    }
    document.getElementById('b01-s12-confirm-count').textContent = '0 / 6 konfirmasi';
    document.getElementById('b01-s12-btn-start').disabled = false;
    document.getElementById('b01-s12-btn-start').textContent = 'Mulai Simulasi ↗';
    if (confirmInterval) { clearInterval(confirmInterval); confirmInterval = null; }
    running = false;
    renderFlow(mode === 'bank' ? BANK_STEPS : BTC_STEPS);
  }

  function setTxMode(m) {
    mode = m;
    document.getElementById('b01-s12-tab-bank').className = 'tx-tab';
    document.getElementById('b01-s12-tab-btc').className  = 'tx-tab';
    const desc = document.getElementById('b01-s12-desc');
    if (m === 'bank') {
      document.getElementById('b01-s12-tab-bank').className = 'tx-tab active-bank';
      desc.className   = 'tx-desc bank';
      desc.textContent = 'Uang bergerak melalui rantai institusi. Setiap perantara punya jam operasional, aturan, dan kewenangan untuk menahan atau memblokir transaksi kapanpun.';
      document.getElementById('b01-s12-stat-time').textContent  = '1-5 hari kerja';
      document.getElementById('b01-s12-stat-time').className    = 'tx-stat-value bad';
      document.getElementById('b01-s12-stat-hops').textContent  = '3-5 institusi';
      document.getElementById('b01-s12-stat-hops').className    = 'tx-stat-value bad';
      document.getElementById('b01-s12-stat-block').textContent = 'Ya, di setiap titik';
      document.getElementById('b01-s12-stat-block').className   = 'tx-stat-value bad';
      document.getElementById('b01-s12-sc-normal').style.display   = '';
      document.getElementById('b01-s12-sc-blocked').style.display  = '';
      document.getElementById('b01-s12-sc-btcblock').style.display = 'none';
      document.getElementById('b01-s12-scenario').classList.add('show');
      setTxScenario('normal', false);
    } else {
      document.getElementById('b01-s12-tab-btc').className = 'tx-tab active-btc';
      desc.className   = 'tx-desc btc';
      desc.textContent = 'Bitcoin bergerak langsung dari pengirim ke penerima melalui jaringan terdesentralisasi. Tidak ada institusi yang bisa menghentikannya.';
      document.getElementById('b01-s12-stat-time').textContent  = '~1 jam (6 konfirmasi)';
      document.getElementById('b01-s12-stat-time').className    = 'tx-stat-value good';
      document.getElementById('b01-s12-stat-hops').textContent  = 'Tidak ada';
      document.getElementById('b01-s12-stat-hops').className    = 'tx-stat-value good';
      document.getElementById('b01-s12-stat-block').textContent = 'Butuh lebih dari 50% jaringan';
      document.getElementById('b01-s12-stat-block').className   = 'tx-stat-value good';
      document.getElementById('b01-s12-sc-normal').style.display   = '';
      document.getElementById('b01-s12-sc-blocked').style.display  = 'none';
      document.getElementById('b01-s12-sc-btcblock').style.display = '';
      document.getElementById('b01-s12-scenario').classList.add('show');
      setTxScenario('normal', false);
    }
    resetTx();
  }

  function setTxScenario(s, doReset = true) {
    scenario = s;
    document.getElementById('b01-s12-sc-normal').className   = 'tx-scenario-btn';
    document.getElementById('b01-s12-sc-blocked').className  = 'tx-scenario-btn';
    document.getElementById('b01-s12-sc-btcblock').className = 'tx-scenario-btn';
    if (s === 'normal')   document.getElementById('b01-s12-sc-normal').className   = 'tx-scenario-btn active-normal';
    if (s === 'blocked')  document.getElementById('b01-s12-sc-blocked').className  = 'tx-scenario-btn active-blocked';
    if (s === 'btcblock') document.getElementById('b01-s12-sc-btcblock').className = 'tx-scenario-btn active-btcblock';
    if (doReset) resetTx();
  }

  async function runBank() {
    const steps  = BANK_STEPS;
    const delays = [600, 1000, 1400, 1200, 1000, 600];
    for (let i = 0; i < steps.length; i++) {
      setStep(i, 'active', 'Memproses...', 'pending');
      await sleep(delays[i]);
      if (scenario === 'blocked' && i === BLOCK_AT) {
        document.getElementById('b01-s12-detail-' + i).textContent = 'Transaksi ditandai untuk review kepatuhan. Akses diblokir oleh otoritas.';
        setStep(i, 'blocked', 'DIBLOKIR ✗', 'blocked');
        await sleep(400);
        freezeRemaining(i + 1, steps.length);
        const result = document.getElementById('b01-s12-result');
        result.className = 'tx-result fail show';
        result.innerHTML = '🚫 <strong>Transaksi diblokir.</strong> SWIFT Network menghentikan transfer atas permintaan otoritas. Dana dikembalikan setelah proses review yang bisa memakan berminggu-minggu. Kamu tidak punya kontrol apapun atas uangmu sendiri.';
        return;
      }
      if (i === 2) { setStep(i, 'waiting', 'Antri batch', 'pending'); await sleep(600); }
      setStep(i, 'done', i === steps.length - 1 ? 'Dana diterima ✓' : 'Selesai ✓', 'ok');
      await sleep(150);
    }
    const result = document.getElementById('b01-s12-result');
    result.className = 'tx-result success show';
    result.innerHTML = '✅ <strong>Transfer selesai.</strong> Dana tiba setelah melewati ' + (steps.length - 2) + ' perantara institusi. Setiap perantara ini bisa memblokir transaksi kapanpun tanpa persetujuanmu.';
  }

  async function runBtc() {
    const steps  = BTC_STEPS;
    const delays = [600, 800, 1000, 1000, 1200, 600];
    if (scenario === 'btcblock') {
      for (let i = 0; i < 3; i++) {
        setStep(i, 'active', 'Memproses...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', 'Selesai ✓', 'ok');
        await sleep(150);
      }
      setStep(2, 'active', 'Verifikasi...', 'info');
      await runNodeConsensus();
      await sleep(500);
      setStep(2, 'done', '11/12 node valid ✓', 'ok');
      for (let i = 3; i < steps.length - 1; i++) {
        setStep(i, 'active', 'Memproses...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', i === 4 ? '1 konfirmasi ✓' : 'Selesai ✓', 'ok');
        await sleep(150);
      }
    } else {
      for (let i = 0; i < steps.length - 1; i++) {
        setStep(i, 'active', 'Memproses...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', i === 4 ? '1 konfirmasi ✓' : 'Selesai ✓', 'ok');
        await sleep(150);
      }
    }
    document.getElementById('b01-s12-confirm').classList.add('show');
    let count = 1;
    document.getElementById('b01-s12-cb-1').classList.add('confirmed');
    document.getElementById('b01-s12-confirm-count').textContent = '1 / 6 konfirmasi';
    confirmInterval = setInterval(() => {
      count++;
      const cb = document.getElementById('b01-s12-cb-' + count);
      if (cb) cb.classList.add('confirmed');
      document.getElementById('b01-s12-confirm-count').textContent = count + ' / 6 konfirmasi';
      if (count >= 6) {
        clearInterval(confirmInterval);
        setStep(steps.length - 1, 'done', 'Dana final ✓', 'ok');
        const result = document.getElementById('b01-s12-result');
        result.className = 'tx-result success show';
        result.innerHTML = '✅ <strong>Transaksi final dan tidak bisa diblokir.</strong> Konsensus mayoritas jaringan memastikan transaksi valid. Tidak ada bank, pemerintah, atau node manapun yang bisa menghentikannya.';
      }
    }, 700);
  }

  async function startTx() {
    if (running) return;
    running = true;
    document.getElementById('b01-s12-btn-start').disabled = true;
    if (mode === 'bank') { await runBank(); running = false; }
    else await runBtc();
  }

  document.getElementById('b01-s12-tab-bank').addEventListener('click',    () => setTxMode('bank'));
  document.getElementById('b01-s12-tab-btc').addEventListener('click',     () => setTxMode('btc'));
  document.getElementById('b01-s12-sc-normal').addEventListener('click',   () => setTxScenario('normal'));
  document.getElementById('b01-s12-sc-blocked').addEventListener('click',  () => setTxScenario('blocked'));
  document.getElementById('b01-s12-sc-btcblock').addEventListener('click', () => setTxScenario('btcblock'));
  document.getElementById('b01-s12-btn-start').addEventListener('click', startTx);
  document.getElementById('b01-s12-btn-reset').addEventListener('click', resetTx);

  setTxMode('bank');
})();

// ============================================================
// PAGE 4 · BAB 1 · 1.4 SIMULATION (Blockchain)
// ============================================================
(function() {
  const GENESIS_PREV = '0000000000000000000000000000000000000000000000000000000000000000';
  const INIT_DATA = [
    'Satoshi mengirim 50 BTC ke Hal Finney',
    'Hal Finney mengirim 10 BTC ke Alice',
    'Alice mengirim 5 BTC ke Bob',
  ];

  function simHash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const r = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    return '0000' + r + h.toString(16).padStart(8, '0');
  }

  function computeHash(num, prev, data) {
    return simHash(`block:${num}|prev:${prev}|data:${data}`);
  }

  let blocks = [];

  function initBlocks() {
    blocks = [];
    let prev = GENESIS_PREV;
    for (let i = 0; i < 3; i++) {
      const hash = computeHash(i + 1, prev, INIT_DATA[i]);
      blocks.push({ num: i + 1, prevHash: prev, data: INIT_DATA[i], hash });
      prev = hash;
    }
  }

  function renderChain() {
    const chain = document.getElementById('b01-s14a-chain');
    if (!chain) return;
    chain.innerHTML = '';

    let chainBroken = false;

    blocks.forEach((b, i) => {
      const expectedPrev = i === 0 ? GENESIS_PREV : blocks[i - 1].hash;
      const ownValid     = b.prevHash === expectedPrev;
      const valid        = ownValid && !chainBroken;
      if (!valid) chainBroken = true;

      if (i > 0) {
        const linkValid = valid;
        const link      = document.createElement('div');
        link.className  = `bc-link ${linkValid ? '' : 'invalid'}`;
        link.innerHTML  = `
          <span class="bc-link-arrow">↑</span>
          <span class="bc-link-label">${linkValid ? 'hash cocok' : 'hash tidak cocok'}</span>`;
        chain.appendChild(link);
      }

      const blockEl      = document.createElement('div');
      blockEl.className  = `bc-block ${valid ? 'valid' : 'invalid'}`;
      const prevDisplay  = b.prevHash.slice(0, 24) + '...';
      const hashDisplay  = b.hash.slice(0, 24) + '...';
      const prevClass    = valid ? '' : 'invalid';

      blockEl.innerHTML = `
        <div class="bc-block-header">
          <div class="bc-block-num">Block #${b.num}</div>
          <div class="bc-block-status">${valid ? 'Valid ✓' : 'Invalid ✗'}</div>
        </div>
        <div class="bc-block-body">
          <div class="bc-field">
            <div class="bc-field-label">Hash Block Ini</div>
            <div class="bc-field-value">${hashDisplay}</div>
          </div>
          <div class="bc-field">
            <div class="bc-field-label">Hash Sebelumnya</div>
            <div class="bc-field-value ${prevClass}">${prevDisplay}</div>
          </div>
          <div class="bc-field">
            <div class="bc-field-label">Data Transaksi</div>
            <textarea class="bc-data-input" rows="2" ${i > 0 ? 'disabled' : ''}>${b.data}</textarea>
          </div>
        </div>`;

      chain.appendChild(blockEl);

      if (i === 0) {
        const input = blockEl.querySelector('textarea');
        input.addEventListener('input', () => {
          blocks[0].data = input.value;
          blocks[0].hash = computeHash(1, GENESIS_PREV, input.value);
          updateResult();
          renderChain();
        });
      }
    });

    updateResult();
  }

  function updateResult() {
    const result  = document.getElementById('b01-s14a-result');
    const hint    = document.getElementById('b01-s14a-hint');
    if (!result || !hint) return;
    const changed = blocks[0].data !== INIT_DATA[0];
    if (!changed) {
      result.className = 'bc-result';
      hint.textContent = 'Coba ubah isi "Data Transaksi" di Block #1 di atas. Hash-nya akan langsung berubah, dan Block #2 dan #3 akan menjadi invalid karena menyimpan hash lama.';
    } else {
      result.className = 'bc-result invalid show';
      result.innerHTML = '🔗 <strong>Blockchain rusak.</strong> Hash Block #1 berubah karena datanya berubah. Block #2 dan #3 menyimpan hash lama Block #1 yang sudah tidak valid. Seluruh rantai setelah Block #1 harus dihitung ulang, dan untuk melakukannya di jaringan Bitcoin sungguhan, seseorang harus mengalahkan seluruh komputasi jaringan yang sedang berjalan. Mustahil.';
      hint.textContent = 'Klik "Reset Blockchain" untuk mengembalikan ke kondisi awal.';
    }
  }

  const resetBtn = document.getElementById('b01-s14a-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initBlocks();
      renderChain();
    });
  }

  initBlocks();
  renderChain();
})();



// ============================================================
// PAGE 4 · BAB 1 · 1.4 SIMULATION (Blockchain Attack)
// ============================================================
(function() {
  const INIT_TXS = [
    'Alice mengirim 10 BTC ke Bob',
    'Bob mengirim 3 BTC ke Charlie',
    'Charlie mengirim 1 BTC ke Dave',
    'Dave mengirim 0.5 BTC ke Eve',
    'Eve mengirim 0.1 BTC ke Frank',
  ];

  let blocksData    = INIT_TXS.map((tx, i) => ({ num: i + 1, tx }));
  let selectedBlock = null;
  let raceInterval  = null;
  let attackerPct   = 0;
  let networkPct    = 0;
  let raceRunning   = false;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function renderAtkChain(compromisedIdx) {
    const chain = document.getElementById('b01-s14b-chain');
    if (!chain) return;
    chain.innerHTML = blocksData.map((b, i) => {
      const isSelected    = selectedBlock === i;
      const isCompromised = compromisedIdx === i;
      const isInvalid     = compromisedIdx !== null && i > compromisedIdx;
      let cls = 'b01-s14b-block';
      if (isSelected)    cls += ' selected';
      if (isCompromised) cls += ' compromised';
      else if (isInvalid) cls += ' invalid';
      else if (compromisedIdx === null) cls += ' valid';
      return `
        <div class="${cls}" id="b01-s14b-blk-${i}">
          <div class="atk-block-head">
            <span>Block #${b.num}</span>
            <span style="font-size:9px">${isCompromised || isInvalid ? '✗' : '✓'}</span>
          </div>
          <div class="atk-block-body">
            <div style="color:#C4B5FD;font-size:8px;margin-bottom:2px">TRANSAKSI</div>
            <div class="atk-block-tx">${b.tx}</div>
          </div>
        </div>`;
    }).join('');

    blocksData.forEach((_, i) => {
      const el = document.getElementById('b01-s14b-blk-' + i);
      if (el) el.addEventListener('click', () => {
        if (raceRunning || compromisedIdx !== null) return;
        selectAtkBlock(i);
      });
    });
  }

  function selectAtkBlock(i) {
    selectedBlock = i;
    renderAtkChain(null);
    const panel = document.getElementById('b01-s14b-panel');
    if (!panel) return;
    panel.classList.add('show');
    document.getElementById('b01-s14b-panel-head').textContent = `Memanipulasi Block #${blocksData[i].num}`;
    document.getElementById('b01-s14b-orig').textContent       = blocksData[i].tx;
    document.getElementById('b01-s14b-input').value            = '';
    document.getElementById('b01-s14b-input').focus();
    document.getElementById('b01-s14b-hint').textContent       = `Tulis transaksi palsu untuk Block #${blocksData[i].num}, lalu klik "Masukkan".`;
  }

  async function startRace(blockIdx) {
    const blocksToRecalc = blocksData.length - blockIdx;
    raceRunning = true;
    attackerPct = 0;
    networkPct  = 0;

    document.getElementById('b01-s14b-race').classList.add('show');
    document.getElementById('b01-s14b-race-label').textContent =
      `Kamu harus menghitung ulang ${blocksToRecalc} block. Jaringan terus menambah block baru...`;

    const attackerSpeed = 0.6;
    const networkSpeed  = 2.1;
    const status = document.getElementById('b01-s14b-race-status');

    raceInterval = setInterval(() => {
      attackerPct = Math.min(100, attackerPct + attackerSpeed);
      networkPct  = Math.min(100, networkPct  + networkSpeed);

      document.getElementById('b01-s14b-bar-attacker').style.width = attackerPct + '%';
      document.getElementById('b01-s14b-bar-network').style.width  = networkPct + '%';
      document.getElementById('b01-s14b-pct-attacker').textContent = Math.round(attackerPct) + '%';
      document.getElementById('b01-s14b-pct-network').textContent  = Math.round(networkPct)  + '%';

      if (networkPct >= 100 && attackerPct < 100) {
        status.className = 'b01-s14b-race-status fail show';
        status.textContent = 'Jaringan sudah menambah block baru. Kamu tertinggal dan harus mulai dari awal lagi.';
        attackerPct = 0;
        networkPct  = 0;
        document.getElementById('b01-s14b-bar-attacker').style.width = '0%';
        document.getElementById('b01-s14b-bar-network').style.width  = '0%';
        document.getElementById('b01-s14b-pct-attacker').textContent = '0%';
        document.getElementById('b01-s14b-pct-network').textContent  = '0%';
      }
    }, 80);

    await sleep(9000);
    if (raceRunning) {
      clearInterval(raceInterval);
      raceRunning = false;
      showAtkResult(blockIdx);
    }
  }

  function showAtkResult(blockIdx) {
    const blocksToRecalc = blocksData.length - blockIdx;
    const result = document.getElementById('b01-s14b-result');
    if (!result) return;
    result.className = 'b01-s14b-result fail show';
    result.innerHTML = `🚫 <strong>Serangan gagal.</strong> Kamu harus menghitung ulang ${blocksToRecalc} block secara berurutan, sementara jaringan Bitcoin yang terdiri dari ribuan miner terus menambah block baru setiap 10 menit. Kecepatan komputasi seluruh jaringan Bitcoin saat ini mencapai ratusan exahash per detik. Tidak ada komputer tunggal yang bisa mengalahkan itu.`;
    document.getElementById('b01-s14b-hint').textContent = 'Klik Reset untuk mencoba lagi.';
    document.getElementById('b01-s14b-race-label').textContent = 'Serangan gagal. Jaringan terlalu cepat.';
  }

  function resetAtk() {
    clearInterval(raceInterval);
    raceRunning   = false;
    selectedBlock = null;
    blocksData    = INIT_TXS.map((tx, i) => ({ num: i + 1, tx }));
    const ids = ['b01-s14b-panel','b01-s14b-race','b01-s14b-result'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('show');
    });
    const status = document.getElementById('b01-s14b-race-status');
    if (status) status.className = 'b01-s14b-race-status fail';
    ['bar-attacker','bar-network'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.width = '0%';
    });
    ['pct-attacker','pct-network'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0%';
    });
    document.getElementById('b01-s14b-result').className = 'b01-s14b-result';
    document.getElementById('b01-s14b-hint').textContent = 'Pilih salah satu block di atas untuk mulai menyerang.';
    renderAtkChain(null);
  }

  const commitBtn = document.getElementById('b01-s14b-commit');
  if (commitBtn) {
    commitBtn.addEventListener('click', () => {
      const fakeTx = document.getElementById('b01-s14b-input').value.trim();
      if (!fakeTx || selectedBlock === null) return;
      blocksData[selectedBlock].tx = fakeTx;
      document.getElementById('b01-s14b-panel').classList.remove('show');
      renderAtkChain(selectedBlock);
      document.getElementById('b01-s14b-hint').textContent = 'Transaksi palsu berhasil dimasukkan. Tapi sekarang kamu harus menghitung ulang semua hash yang rusak sebelum jaringan menambah block baru...';
      startRace(selectedBlock);
    });
  }

  const resetBtn = document.getElementById('b01-s14b-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetAtk);

  renderAtkChain(null);
})();

// ============================================================
// PAGE 4 · BAB 1 · 1.5 SIMULATION (Halving Table)
// ============================================================
(function() {
  const HALVINGS = [
    { era:'Genesis',     year:2009, block:0,       reward:50,      supply:10500000,  pct:50.000,  status:'past',    note:'Era pertama Bitcoin. Satoshi Nakamoto menambang block pertama pada 3 Januari 2009. Reward 50 BTC per block berlaku selama sekitar 4 tahun.' },
    { era:'Halving #1',  year:2012, block:210000,  reward:25,      supply:15750000,  pct:75.000,  status:'past',    note:'Halving pertama terjadi pada 28 November 2012. Reward dipotong dari 50 menjadi 25 BTC. Total supply yang ditambang di era ini: 5.250.000 BTC.' },
    { era:'Halving #2',  year:2016, block:420000,  reward:12.5,    supply:18375000,  pct:87.500,  status:'past',    note:'Halving kedua terjadi pada 9 Juli 2016. Reward dipotong dari 25 menjadi 12,5 BTC. Era ini menghasilkan 2.625.000 BTC baru.' },
    { era:'Halving #3',  year:2020, block:630000,  reward:6.25,    supply:19687500,  pct:93.750,  status:'past',    note:'Halving ketiga terjadi pada 11 Mei 2020. Reward dipotong dari 12,5 menjadi 6,25 BTC. Era ini menghasilkan 1.312.500 BTC baru.' },
    { era:'Halving #4',  year:2024, block:840000,  reward:3.125,   supply:19843750,  pct:96.875,  status:'current', note:'Halving keempat terjadi pada April 2024. Reward saat ini adalah 3,125 BTC per block. Kita sedang berada di era ini sekarang.' },
    { era:'Halving #5',  year:2028, block:1050000, reward:1.5625,  supply:20671875,  pct:98.438,  status:'future',  note:'Diperkirakan terjadi sekitar 2028. Reward akan dipotong menjadi 1,5625 BTC. Lebih dari 98% Bitcoin sudah akan beredar.' },
    { era:'Halving #6',  year:2032, block:1260000, reward:0.78125, supply:20999023,  pct:99.219,  status:'future',  note:'Diperkirakan terjadi sekitar 2032. Reward turun menjadi 0,78125 BTC. Supply semakin mendekati batas 21 juta.' },
    { era:'Halving #10', year:2048, block:2100000, reward:0.04882, supply:20999023,  pct:99.995,  status:'future',  note:'Pada era ini reward sudah sangat kecil. Lebih dari 99,99% Bitcoin sudah beredar. Miner terutama mengandalkan biaya transaksi.' },
    { era:'Final (~2140)',year:2140, block:6930000, reward:0,       supply:21000000,  pct:100.000, status:'future',  note:'Sekitar tahun 2140, reward block mendekati nol dan seluruh 21 juta Bitcoin sudah beredar. Miner hanya mendapat biaya transaksi. Tidak ada Bitcoin baru yang akan pernah lahir lagi.' },
  ];

  let activeRow = null;

  function formatNum(n) {
    return n.toLocaleString('id-ID');
  }

  function renderHvTable() {
    const tbody = document.getElementById('b01-s15-tbody');
    if (!tbody) return;
    tbody.innerHTML = HALVINGS.map((h, i) => {
      const pctDisplay = h.pct.toFixed(3).replace(/\.?0+$/, '') + '%';
      const supplyBar  = Math.min(100, h.pct);
      return `<tr id="b01-s15-row-${i}" data-idx="${i}">
        <td class="hv-td-era">${h.era}</td>
        <td>${h.year}</td>
        <td>#${formatNum(h.block)}</td>
        <td>${h.reward > 0 ? h.reward + ' BTC' : '~0 BTC'}</td>
        <td>${formatNum(h.supply)} BTC</td>
        <td>
          <div class="hv-supply-bar-wrap">
            <div class="hv-supply-bar-track">
              <div class="hv-supply-bar-fill" style="width:${supplyBar}%"></div>
            </div>
            <span>${pctDisplay}</span>
          </div>
        </td>
      </tr>`;
    }).join('');

    HALVINGS.forEach((_, i) => {
      const row = document.getElementById('b01-s15-row-' + i);
      if (row) row.addEventListener('click', () => showHvDetail(i));
    });
  }

  function showHvDetail(i) {
    const h = HALVINGS[i];
    if (activeRow === i) {
      activeRow = null;
      document.getElementById('b01-s15-detail').classList.remove('show');
      document.querySelectorAll('.hv-tbody tr').forEach(r => r.classList.remove('active'));
      return;
    }
    activeRow = i;
    document.querySelectorAll('.hv-tbody tr').forEach(r => r.classList.remove('active'));
    const row = document.getElementById('b01-s15-row-' + i);
    if (row) row.classList.add('active');
    document.getElementById('b01-s15-detail-head').textContent = h.era + ' (' + h.year + ')';
    document.getElementById('b01-s15-detail-body').innerHTML = `
      <div>
        <div class="hv-detail-label">Reward per Block</div>
        <div class="hv-detail-value">${h.reward > 0 ? h.reward + ' BTC' : '~0 BTC'}</div>
      </div>
      <div>
        <div class="hv-detail-label">Block Number</div>
        <div class="hv-detail-value">#${formatNum(h.block)}</div>
      </div>
      <div>
        <div class="hv-detail-label">Total Supply</div>
        <div class="hv-detail-value">${formatNum(h.supply)} BTC</div>
      </div>
      <div>
        <div class="hv-detail-label">% dari 21 Juta</div>
        <div class="hv-detail-value">${h.pct.toFixed(3)}%</div>
      </div>
      <div class="hv-detail-note">${h.note}</div>`;
    document.getElementById('b01-s15-detail').classList.add('show');
  }

  renderHvTable();
})();

// ============================================================
// PAGE 4 · BAB 1 · 1.6 SIMULATION (Bitcoin vs Uang Biasa)
// ============================================================
(function() {
  const CATEGORIES = [
    {
      id:'supply', label:'💰 Kelangkaan', icon:'💰', title:'Kelangkaan Supply',
      fiat:{ head:'Uang Biasa', body:'Tidak ada batas supply. Bank sentral bisa mencetak uang baru kapanpun ada kebutuhan ekonomi atau politik. Jumlah uang yang beredar hari ini berbeda dari bulan lalu, dan tidak ada yang tahu pasti berapa.' },
      btc: { head:'Bitcoin',    body:'Supply dibatasi tepat 21 juta BTC, tertulis dalam kode sejak hari pertama. Tidak ada yang bisa mengubah angka ini. Jadwal penerbitan Bitcoin baru sudah ditentukan hingga sekitar tahun 2140.' },
      verdict:'Bitcoin adalah satu-satunya aset di dunia dengan supply yang benar-benar dapat diverifikasi dan tidak bisa diubah oleh siapapun.',
    },
    {
      id:'control', label:'🔐 Kontrol', icon:'🔐', title:'Siapa yang Mengontrol?',
      fiat:{ head:'Uang Biasa', body:'Bank bisa membekukan rekeningmu kapanpun. Pemerintah bisa menyita asetmu. Perusahaan pembayaran bisa menolak transaksimu. Uangmu ada di buku besar milik orang lain.' },
      btc: { head:'Bitcoin',    body:'Siapapun yang memegang private key, memegang Bitcoin. Tidak ada bank yang bisa membekukannya. Tidak ada pemerintah yang bisa menyitanya tanpa akses ke private key-mu. Kendali sepenuhnya ada di tanganmu.' },
      verdict:'Dengan Bitcoin, jika kamu memegang private key-mu, tidak ada yang bisa mengambilnya tanpa sepengetahuanmu.',
    },
    {
      id:'transparency', label:'🔍 Transparansi', icon:'🔍', title:'Transparansi',
      fiat:{ head:'Uang Biasa', body:'Kebijakan moneter diputuskan dalam rapat tertutup. Supply aktual tidak mudah diverifikasi publik. Kamu harus percaya bahwa bank sentral melaporkan data yang akurat.' },
      btc: { head:'Bitcoin',    body:'Seluruh riwayat transaksi Bitcoin tersimpan di blockchain yang bisa diakses siapapun. Supply aktual bisa dihitung oleh siapapun kapanpun. Tidak ada yang perlu dipercaya, semuanya bisa diverifikasi.' },
      verdict:'Bitcoin adalah sistem keuangan pertama yang tidak butuh kepercayaan karena semua datanya terbuka dan bisa diverifikasi secara independen.',
    },
    {
      id:'inflation', label:'📉 Inflasi', icon:'📉', title:'Inflasi & Daya Beli',
      fiat:{ head:'Uang Biasa', body:'Setiap rupiah atau dolar yang dicetak mengencerkan nilai uang yang sudah beredar. Daya beli uang turun seiring waktu. Ini bukan bug, ini fitur yang disengaja untuk mendorong konsumsi.' },
      btc: { head:'Bitcoin',    body:'Jadwal penerbitan Bitcoin baru sudah ditentukan dan terus berkurang lewat mekanisme halving. Supply tidak bisa dipercepat. Tidak ada yang bisa mencetak Bitcoin baru di luar jadwal yang sudah tertulis di kode.' },
      verdict:'Uang fiat dirancang untuk melemah seiring waktu. Bitcoin dirancang dengan supply yang semakin langka seiring waktu.',
    },
    {
      id:'access', label:'🌍 Akses', icon:'🌍', title:'Akses & Inklusivitas',
      fiat:{ head:'Uang Biasa', body:'Butuh rekening bank, KYC, dokumen identitas, persetujuan institusi. Lebih dari 1,4 miliar orang dewasa di dunia tidak punya akses ke sistem perbankan formal.' },
      btc: { head:'Bitcoin',    body:'Cukup punya smartphone dan koneksi internet. Tidak butuh rekening, tidak butuh izin, tidak butuh dokumen. Siapapun di manapun di dunia bisa menggunakan Bitcoin dengan modal yang sama.' },
      verdict:'Bitcoin adalah sistem keuangan pertama yang benar-benar terbuka untuk semua orang, tanpa syarat, tanpa izin, tanpa diskriminasi.',
    },
    {
      id:'censorship', label:'🚫 Sensor', icon:'🚫', title:'Resistansi Sensor',
      fiat:{ head:'Uang Biasa', body:'Transaksi bisa diblokir oleh bank, gateway pembayaran, atau pemerintah. Ini bisa terjadi karena alasan politik, regulasi, atau bahkan kesalahan sistem. Kamu tidak punya pilihan.' },
      btc: { head:'Bitcoin',    body:'Tidak ada entitas tunggal yang bisa memblokir transaksi Bitcoin yang valid. Jaringan yang terdesentralisasi memastikan bahwa selama kamu membayar biaya yang cukup, transaksimu akan diproses.' },
      verdict:'Bitcoin adalah alat pertama dalam sejarah yang memungkinkan transfer nilai yang benar-benar tidak bisa disensor oleh siapapun.',
    },
  ];

  let activeId = null;

  function renderCmpPills() {
    const el = document.getElementById('b01-s16-pills');
    if (!el) return;
    el.innerHTML = CATEGORIES.map(c =>
      `<button class="cmp-pill" id="b01-s16-pill-${c.id}">${c.label}</button>`
    ).join('');
    CATEGORIES.forEach(c => {
      const btn = document.getElementById('b01-s16-pill-' + c.id);
      if (btn) btn.addEventListener('click', () => showCmpCategory(c.id));
    });
  }

  function renderCmpCards() {
    const el = document.getElementById('b01-s16-cards');
    if (!el) return;
    el.innerHTML = CATEGORIES.map(c => `
      <div class="cmp-card" id="b01-s16-card-${c.id}">
        <div class="cmp-card-head">
          <span class="cmp-card-icon">${c.icon}</span>
          ${c.title}
        </div>
        <div class="cmp-cols">
          <div class="cmp-col">
            <div class="cmp-col-head fiat">${c.fiat.head}</div>
            <div class="cmp-col-body">${c.fiat.body}</div>
          </div>
          <div class="cmp-col">
            <div class="cmp-col-head btc">${c.btc.head}</div>
            <div class="cmp-col-body">${c.btc.body}</div>
          </div>
        </div>
        <div class="cmp-verdict"><strong>Kesimpulan:</strong> ${c.verdict}</div>
      </div>`
    ).join('');
  }

  function showCmpCategory(id) {
    if (activeId === id) {
      activeId = null;
      document.querySelectorAll('.cmp-pill').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.cmp-card').forEach(c => c.classList.remove('show'));
      return;
    }
    activeId = id;
    document.querySelectorAll('.cmp-pill').forEach(p => p.classList.remove('active'));
    const pill = document.getElementById('b01-s16-pill-' + id);
    if (pill) pill.classList.add('active');
    document.querySelectorAll('.cmp-card').forEach(c => c.classList.remove('show'));
    const card = document.getElementById('b01-s16-card-' + id);
    if (card) card.classList.add('show');
  }

  renderCmpPills();
  renderCmpCards();
  showCmpCategory('supply');
})();

