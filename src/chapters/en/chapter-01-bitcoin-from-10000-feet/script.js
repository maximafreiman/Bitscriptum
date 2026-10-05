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
    { icon:'🧑', name:'Sender',         detail:'Initiate the transfer through the banking app.' },
    { icon:'🏦', name:'Sending Bank',   detail:'Verifies balance, identity, and compliance. Operating hours apply.' },
    { icon:'🔄', name:'Clearing House', detail:'Inter-bank intermediary. Batch processing, only runs during business hours.' },
    { icon:'🌐', name:'SWIFT Network',  detail:'For international transfers. May pass through 2-3 correspondent banks.' },
    { icon:'🏦', name:'Receiving Bank', detail:'Receives the funds, re-verifies, credits the account.' },
    { icon:'🧑', name:'Recipient',      detail:'Funds land in the account.' },
  ];
  const BTC_STEPS = [
    { icon:'🧑', name:'Sender',         detail:'Create the transaction, sign it with the private key.' },
    { icon:'📡', name:'Broadcast',      detail:'The transaction is broadcast to the entire network within seconds.' },
    { icon:'🌐', name:'Network Nodes',  detail:'Thousands of nodes verify the transaction simultaneously.' },
    { icon:'⛏️', name:'Mempool',        detail:'The transaction waits to be picked up by miners for inclusion in a block.' },
    { icon:'🧱', name:'Block Found',    detail:'A miner succeeds. The transaction enters its first block, 1 confirmation.' },
    { icon:'🧑', name:'Recipient',      detail:'After 6 confirmations (~1 hour), the funds are final and cannot be changed.' },
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
    document.getElementById('b01-s12-node-grid-label').textContent = 'The nodes are verifying the transaction...';
    renderNodes();
    await sleep(400);
    for (let i = 0; i < TOTAL_NODES; i++) {
      document.getElementById('b01-s12-node-' + i).className = 'node validating';
      document.getElementById('b01-s12-nlbl-' + i).textContent = '...';
      await sleep(80);
    }
    await sleep(600);
    document.getElementById('b01-s12-node-' + EVIL_NODE).className = 'node evil';
    document.getElementById('b01-s12-nlbl-' + EVIL_NODE).textContent = 'REJECT ✗';
    await sleep(400);
    for (let i = 0; i < TOTAL_NODES; i++) {
      if (i === EVIL_NODE) continue;
      document.getElementById('b01-s12-node-' + i).className = 'node valid';
      document.getElementById('b01-s12-nlbl-' + i).textContent = 'VALID ✓';
      await sleep(120);
    }
    await sleep(500);
    document.getElementById('b01-s12-node-' + EVIL_NODE).className = 'node rejected';
    document.getElementById('b01-s12-nlbl-' + EVIL_NODE).textContent = 'LOSES ✗';
    document.getElementById('b01-s12-node-grid-label').textContent =
      `${TOTAL_NODES - 1} valid nodes vs 1 rejecting node — majority consensus wins.`;
    const consensus = document.getElementById('b01-s12-node-consensus');
    consensus.className = 'node-consensus valid show';
    consensus.innerHTML = `✅ <strong>Consensus reached.</strong> ${TOTAL_NODES - 1} of ${TOTAL_NODES} nodes declare the transaction valid. The rejecting node is ignored by the network. To stop Bitcoin, someone would have to control more than 50% of all the nodes in the world at the same time.`;
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
    document.getElementById('b01-s12-confirm-count').textContent = '0 / 6 confirmations';
    document.getElementById('b01-s12-btn-start').disabled = false;
    document.getElementById('b01-s12-btn-start').textContent = 'Start Simulation ↗';
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
      desc.textContent = 'Money moves through a chain of institutions. Each intermediary has operating hours, rules, and the authority to hold or block a transaction at any time.';
      document.getElementById('b01-s12-stat-time').textContent  = '1-5 business days';
      document.getElementById('b01-s12-stat-time').className    = 'tx-stat-value bad';
      document.getElementById('b01-s12-stat-hops').textContent  = '3-5 institutions';
      document.getElementById('b01-s12-stat-hops').className    = 'tx-stat-value bad';
      document.getElementById('b01-s12-stat-block').textContent = 'Yes, at every point';
      document.getElementById('b01-s12-stat-block').className   = 'tx-stat-value bad';
      document.getElementById('b01-s12-sc-normal').style.display   = '';
      document.getElementById('b01-s12-sc-blocked').style.display  = '';
      document.getElementById('b01-s12-sc-btcblock').style.display = 'none';
      document.getElementById('b01-s12-scenario').classList.add('show');
      setTxScenario('normal', false);
    } else {
      document.getElementById('b01-s12-tab-btc').className = 'tx-tab active-btc';
      desc.className   = 'tx-desc btc';
      desc.textContent = 'Bitcoin moves directly from sender to recipient through a decentralized network. No institution can stop it.';
      document.getElementById('b01-s12-stat-time').textContent  = '~1 hour (6 confirmations)';
      document.getElementById('b01-s12-stat-time').className    = 'tx-stat-value good';
      document.getElementById('b01-s12-stat-hops').textContent  = 'None';
      document.getElementById('b01-s12-stat-hops').className    = 'tx-stat-value good';
      document.getElementById('b01-s12-stat-block').textContent = 'Requires more than 50% of the network';
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
      setStep(i, 'active', 'Processing...', 'pending');
      await sleep(delays[i]);
      if (scenario === 'blocked' && i === BLOCK_AT) {
        document.getElementById('b01-s12-detail-' + i).textContent = 'The transaction is flagged for compliance review. Access blocked by the authorities.';
        setStep(i, 'blocked', 'BLOCKED ✗', 'blocked');
        await sleep(400);
        freezeRemaining(i + 1, steps.length);
        const result = document.getElementById('b01-s12-result');
        result.className = 'tx-result fail show';
        result.innerHTML = '🚫 <strong>Transaction blocked.</strong> The SWIFT Network halted the transfer at the request of the authorities. The funds are returned after a review process that can take weeks. You have no control whatsoever over your own money.';
        return;
      }
      if (i === 2) { setStep(i, 'waiting', 'Batch queue', 'pending'); await sleep(600); }
      setStep(i, 'done', i === steps.length - 1 ? 'Funds received ✓' : 'Done ✓', 'ok');
      await sleep(150);
    }
    const result = document.getElementById('b01-s12-result');
    result.className = 'tx-result success show';
    result.innerHTML = '✅ <strong>Transfer complete.</strong> The funds arrived after passing through ' + (steps.length - 2) + ' institutional intermediaries. Each of these intermediaries could block the transaction at any time without your consent.';
  }

  async function runBtc() {
    const steps  = BTC_STEPS;
    const delays = [600, 800, 1000, 1000, 1200, 600];
    if (scenario === 'btcblock') {
      for (let i = 0; i < 3; i++) {
        setStep(i, 'active', 'Processing...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', 'Done ✓', 'ok');
        await sleep(150);
      }
      setStep(2, 'active', 'Verifying...', 'info');
      await runNodeConsensus();
      await sleep(500);
      setStep(2, 'done', '11/12 nodes valid ✓', 'ok');
      for (let i = 3; i < steps.length - 1; i++) {
        setStep(i, 'active', 'Processing...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', i === 4 ? '1 confirmation ✓' : 'Done ✓', 'ok');
        await sleep(150);
      }
    } else {
      for (let i = 0; i < steps.length - 1; i++) {
        setStep(i, 'active', 'Processing...', 'info');
        await sleep(delays[i]);
        setStep(i, 'done', i === 4 ? '1 confirmation ✓' : 'Done ✓', 'ok');
        await sleep(150);
      }
    }
    document.getElementById('b01-s12-confirm').classList.add('show');
    let count = 1;
    document.getElementById('b01-s12-cb-1').classList.add('confirmed');
    document.getElementById('b01-s12-confirm-count').textContent = '1 / 6 confirmations';
    confirmInterval = setInterval(() => {
      count++;
      const cb = document.getElementById('b01-s12-cb-' + count);
      if (cb) cb.classList.add('confirmed');
      document.getElementById('b01-s12-confirm-count').textContent = count + ' / 6 confirmations';
      if (count >= 6) {
        clearInterval(confirmInterval);
        setStep(steps.length - 1, 'done', 'Funds final ✓', 'ok');
        const result = document.getElementById('b01-s12-result');
        result.className = 'tx-result success show';
        result.innerHTML = '✅ <strong>Transaction final and unblockable.</strong> The majority consensus of the network ensures the transaction is valid. No bank, government, or node can stop it.';
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
    'Satoshi sends 50 BTC to Hal Finney',
    'Hal Finney sends 10 BTC to Alice',
    'Alice sends 5 BTC to Bob',
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
          <span class="bc-link-label">${linkValid ? 'hash matches' : 'hash does not match'}</span>`;
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
            <div class="bc-field-label">This Block’s Hash</div>
            <div class="bc-field-value">${hashDisplay}</div>
          </div>
          <div class="bc-field">
            <div class="bc-field-label">Previous Hash</div>
            <div class="bc-field-value ${prevClass}">${prevDisplay}</div>
          </div>
          <div class="bc-field">
            <div class="bc-field-label">Transaction Data</div>
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
      hint.textContent = 'Try changing the "Transaction Data" in Block #1 above. Its hash will change instantly, and Block #2 and #3 will become invalid because they store the old hash.';
    } else {
      result.className = 'bc-result invalid show';
      result.innerHTML = '🔗 <strong>Blockchain broken.</strong> Block #1’s hash changed because its data changed. Block #2 and #3 store Block #1’s old hash, which is now invalid. The entire chain after Block #1 must be recomputed, and to do that on the real Bitcoin network, someone would have to beat the entire running computation of the network. Impossible.';
      hint.textContent = 'Click "Reset Blockchain" to return to the initial state.';
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
    'Alice sends 10 BTC to Bob',
    'Bob sends 3 BTC to Charlie',
    'Charlie sends 1 BTC to Dave',
    'Dave sends 0.5 BTC to Eve',
    'Eve sends 0.1 BTC to Frank',
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
            <div style="color:#C4B5FD;font-size:8px;margin-bottom:2px">TRANSACTION</div>
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
    document.getElementById('b01-s14b-panel-head').textContent = `Manipulating Block #${blocksData[i].num}`;
    document.getElementById('b01-s14b-orig').textContent       = blocksData[i].tx;
    document.getElementById('b01-s14b-input').value            = '';
    document.getElementById('b01-s14b-input').focus();
    document.getElementById('b01-s14b-hint').textContent       = `Write a fake transaction for Block #${blocksData[i].num}, then click "Insert".`;
  }

  async function startRace(blockIdx) {
    const blocksToRecalc = blocksData.length - blockIdx;
    raceRunning = true;
    attackerPct = 0;
    networkPct  = 0;

    document.getElementById('b01-s14b-race').classList.add('show');
    document.getElementById('b01-s14b-race-label').textContent =
      `You must recompute ${blocksToRecalc} blocks. The network keeps adding new blocks...`;

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
        status.textContent = 'The network has already added a new block. You’ve fallen behind and must start over again.';
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
    result.innerHTML = `🚫 <strong>Attack failed.</strong> You must recompute ${blocksToRecalc} blocks in sequence, while the Bitcoin network of thousands of miners keeps adding a new block every 10 minutes. The total computing speed of the entire Bitcoin network currently reaches hundreds of exahashes per second. No single computer can beat that.`;
    document.getElementById('b01-s14b-hint').textContent = 'Click Reset to try again.';
    document.getElementById('b01-s14b-race-label').textContent = 'Attack failed. The network is too fast.';
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
    document.getElementById('b01-s14b-hint').textContent = 'Choose one of the blocks above to start attacking.';
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
      document.getElementById('b01-s14b-hint').textContent = 'The fake transaction was inserted. But now you must recompute all the broken hashes before the network adds a new block...';
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
    { era:'Genesis',     year:2009, block:0,       reward:50,      supply:10500000,  pct:50.000,  status:'past',    note:'Bitcoin’s first era. Satoshi Nakamoto mined the first block on January 3, 2009. The 50 BTC reward per block lasted about 4 years.' },
    { era:'Halving #1',  year:2012, block:210000,  reward:25,      supply:15750000,  pct:75.000,  status:'past',    note:'The first halving occurred on November 28, 2012. The reward was cut from 50 to 25 BTC. Total supply mined in this era: 5.250.000 BTC.' },
    { era:'Halving #2',  year:2016, block:420000,  reward:12.5,    supply:18375000,  pct:87.500,  status:'past',    note:'The second halving occurred on July 9, 2016. The reward was cut from 25 to 12,5 BTC. This era produced 2.625.000 new BTC.' },
    { era:'Halving #3',  year:2020, block:630000,  reward:6.25,    supply:19687500,  pct:93.750,  status:'past',    note:'The third halving occurred on May 11, 2020. The reward was cut from 12,5 to 6,25 BTC. This era produced 1.312.500 new BTC.' },
    { era:'Halving #4',  year:2024, block:840000,  reward:3.125,   supply:19843750,  pct:96.875,  status:'current', note:'The fourth halving occurred in April 2024. The current reward is 3,125 BTC per block. We are in this era right now.' },
    { era:'Halving #5',  year:2028, block:1050000, reward:1.5625,  supply:20671875,  pct:98.438,  status:'future',  note:'Expected to occur around 2028. The reward will be cut to 1,5625 BTC. More than 98% of Bitcoin will already be in circulation.' },
    { era:'Halving #6',  year:2032, block:1260000, reward:0.78125, supply:20999023,  pct:99.219,  status:'future',  note:'Expected to occur around 2032. The reward drops to 0,78125 BTC. The supply moves ever closer to the 21 million cap.' },
    { era:'Halving #10', year:2048, block:2100000, reward:0.04882, supply:20999023,  pct:99.995,  status:'future',  note:'By this era the reward is already very small. More than 99,99% of Bitcoin is already in circulation. Miners rely primarily on transaction fees.' },
    { era:'Final (~2140)',year:2140, block:6930000, reward:0,       supply:21000000,  pct:100.000, status:'future',  note:'Around the year 2140, the block reward approaches zero and all 21 million Bitcoin are in circulation. Miners receive only transaction fees. No new Bitcoin will ever be born again.' },
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
        <div class="hv-detail-label">% of 21 Million</div>
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
      id:'supply', label:'💰 Scarcity', icon:'💰', title:'Supply Scarcity',
      fiat:{ head:'Ordinary Money', body:'No supply cap. The central bank can print new money whenever there’s an economic or political need. The amount of money in circulation today differs from last month, and no one knows exactly how much.' },
      btc: { head:'Bitcoin',    body:'Supply is capped at exactly 21 million BTC, written into the code from day one. No one can change this number. The issuance schedule for new Bitcoin is already set out to around the year 2140.' },
      verdict:'Bitcoin is the only asset in the world with a supply that is truly verifiable and cannot be changed by anyone.',
    },
    {
      id:'control', label:'🔐 Control', icon:'🔐', title:'Who Is in Control?',
      fiat:{ head:'Ordinary Money', body:'A bank can freeze your account at any time. The government can seize your assets. A payment company can reject your transaction. Your money lives in someone else’s ledger.' },
      btc: { head:'Bitcoin',    body:'Whoever holds the private key holds the Bitcoin. No bank can freeze it. No government can seize it without access to your private key. Control is entirely in your hands.' },
      verdict:'With Bitcoin, if you hold your private key, no one can take it without your knowledge.',
    },
    {
      id:'transparency', label:'🔍 Transparency', icon:'🔍', title:'Transparency',
      fiat:{ head:'Ordinary Money', body:'Monetary policy is decided in closed meetings. The actual supply is not easy for the public to verify. You have to trust that the central bank reports accurate data.' },
      btc: { head:'Bitcoin',    body:'The entire history of Bitcoin transactions is stored on a blockchain that anyone can access. The actual supply can be calculated by anyone at any time. Nothing needs to be trusted, everything can be verified.' },
      verdict:'Bitcoin is the first financial system that needs no trust, because all of its data is open and can be independently verified.',
    },
    {
      id:'inflation', label:'📉 Inflation', icon:'📉', title:'Inflation & Purchasing Power',
      fiat:{ head:'Ordinary Money', body:'Every rupiah or dollar printed dilutes the value of the money already in circulation. The purchasing power of money falls over time. This isn’t a bug, it’s a deliberate feature to encourage consumption.' },
      btc: { head:'Bitcoin',    body:'The issuance schedule for new Bitcoin is already set and keeps decreasing through the halving mechanism. The supply can’t be accelerated. No one can print new Bitcoin outside the schedule written in the code.' },
      verdict:'Fiat money is designed to weaken over time. Bitcoin is designed with a supply that grows scarcer over time.',
    },
    {
      id:'access', label:'🌍 Access', icon:'🌍', title:'Access & Inclusivity',
      fiat:{ head:'Ordinary Money', body:'It requires a bank account, KYC, identity documents, institutional approval. More than 1,4 billion adults in the world have no access to the formal banking system.' },
      btc: { head:'Bitcoin',    body:'All you need is a smartphone and an internet connection. No account required, no permission required, no documents required. Anyone anywhere in the world can use Bitcoin from the same starting point.' },
      verdict:'Bitcoin is the first financial system that is truly open to everyone, with no conditions, no permission, no discrimination.',
    },
    {
      id:'censorship', label:'🚫 Censorship', icon:'🚫', title:'Censorship Resistance',
      fiat:{ head:'Ordinary Money', body:'Transactions can be blocked by a bank, a payment gateway, or the government. This can happen for political reasons, regulation, or even a system error. You have no choice.' },
      btc: { head:'Bitcoin',    body:'No single entity can block a valid Bitcoin transaction. The decentralized network ensures that as long as you pay a sufficient fee, your transaction will be processed.' },
      verdict:'Bitcoin is the first tool in history that enables a transfer of value that truly cannot be censored by anyone.',
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
        <div class="cmp-verdict"><strong>Conclusion:</strong> ${c.verdict}</div>
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

