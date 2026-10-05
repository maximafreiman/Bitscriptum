// ============================================================
// PAGE 3 · PROLOGUE · BACK TO CHAPTER LIST
// ============================================================
document.getElementById('back-chapters-pr').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 3 · PROLOGUE · SUB-BAB NAVIGATION
// Scoped ke #page-prologue agar tidak konflik dengan Bab 1
// ============================================================
function showSection(sectionId, sbId) {
  document.querySelectorAll('#page-prologue .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-prologue .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('prologue-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// tombol nav Prologue (data-target & data-sb, tanpa data-content)
document.querySelectorAll('#page-prologue .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSection(target, sb);
  });
});

// ============================================================
// PAGE 3 · PROLOGUE · SIDEBAR EVENTS (P.1 - P.8)
// ============================================================
document.getElementById('sb-p1').addEventListener('click', () => showSection('section-p1', 'sb-p1'));
document.getElementById('sb-p2').addEventListener('click', () => showSection('section-p2', 'sb-p2'));
document.getElementById('sb-p3').addEventListener('click', () => showSection('section-p3', 'sb-p3'));
document.getElementById('sb-p4').addEventListener('click', () => showSection('section-p4', 'sb-p4'));
document.getElementById('sb-p5').addEventListener('click', () => showSection('section-p5', 'sb-p5'));
document.getElementById('sb-p6').addEventListener('click', () => showSection('section-p6', 'sb-p6'));
document.getElementById('sb-p7').addEventListener('click', () => showSection('section-p7', 'sb-p7'));
document.getElementById('sb-p8').addEventListener('click', () => showSection('section-p8', 'sb-p8'));

// PAGE 3 · PROLOGUE · P.3 SIMULATION (Cantillon Effect)
// ============================================================
(function() {
  const CHARS = [
    { id:'bs', icon:'🏛️', name:'Central Bank',   role:'Money printer',   base:500, ratio:0.45 },
    { id:'bb', icon:'🏦', name:'Big Banks',      role:'Receive first',  base:200, ratio:0.30 },
    { id:'pg', icon:'💼', name:'Business Owners', role:'Cheap loans',    base:150, ratio:0.15 },
    { id:'pk', icon:'👷', name:'Workers',        role:'Fixed salary',   base:100, ratio:0.07 },
    { id:'pn', icon:'👴', name:'Retirees',       role:'Fixed savings',  base:50,  ratio:0.03 },
  ];
  const GOODS = [
    { name:'House', base:100 },
    { name:'Groceries', base:20 },
    { name:'Gasoline', base:10 },
    { name:'Instant noodles', base:3 },
  ];
  const PRINT = 200;
  const INFLATE = 0.15;
  let st = {}, busy = false;

  function fmt(n) { return 'Rp ' + Math.round(n); }
  function fmtL(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function initSim() {
    st = {
      round: 0,
      supply: 1000,
      priceIdx: 100,
      chars: CHARS.map(c => ({ ...c, money: c.base, power: 100 })),
      goods: GOODS.map(g => ({ ...g, cur: g.base })),
      logs: [],
    };
  }

  function renderSimChars() {
    document.getElementById('prl-s03-chars').innerHTML = st.chars.map(c => {
      const pw = Math.max(0, Math.min(100, c.power));
      return `<div class="sim-char" id="prl-s03-sc-${c.id}">
        <div class="sim-char-icon">${c.icon}</div>
        <div class="sim-char-name">${c.name}</div>
        <div class="sim-char-role">${c.role}</div>
        <div class="sim-char-money" id="prl-s03-sm-${c.id}">${fmt(c.money)}</div>
        <div class="sim-char-powerlabel">Purchasing power: <span id="prl-s03-sp-${c.id}">${Math.round(c.power)}%</span></div>
        <div class="sim-bar-bg"><div class="sim-bar ${pw < 75 ? 'danger' : ''}" id="prl-s03-sb-${c.id}" style="width:${pw}%"></div></div>
        <div class="sim-flow" id="prl-s03-sf-${c.id}"></div>
      </div>`;
    }).join('');
  }

  function renderSimGoods() {
    document.getElementById('prl-s03-prices').innerHTML = st.goods.map(g =>
      `<div class="sim-price-item">
        <div class="sim-price-name">${g.name}</div>
        <div class="sim-price-val ${st.round > 0 ? 'rising' : ''}" id="prl-s03-sg-${g.name}">${fmt(g.cur)}</div>
      </div>`
    ).join('');
  }

  function renderSimStats() {
    document.getElementById('prl-s03-total').textContent = fmtL(st.supply);
    document.getElementById('prl-s03-price-idx').textContent = Math.round(st.priceIdx);
  }

  function updateSimAlert() {
    const bottom = st.chars.slice(3);
    const avg = bottom.reduce((s, c) => s + c.power, 0) / bottom.length;
    const el = document.getElementById('prl-s03-alert');
    const title = document.getElementById('prl-s03-alert-title');
    const sub = document.getElementById('prl-s03-alert-sub');
    if (avg < 40) {
      title.textContent = '🚨 PURCHASING POWER CRISIS!';
      sub.textContent = `Workers & Retirees can only afford ${Math.round(avg)}% of what they could before.`;
      el.classList.add('show');
    } else if (avg < 65) {
      title.textContent = '⚠️ PURCHASING POWER PLUMMETING!';
      sub.textContent = `Lost ${Math.round(100 - avg)}% of purchasing power from the start.`;
      el.classList.add('show');
    } else if (avg < 85) {
      title.textContent = '⚠️ PURCHASING POWER FALLING!';
      sub.textContent = `Prices rise faster than the income of Workers & Retirees.`;
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  }

  function addSimLog(msg, warn) {
    st.logs.unshift({ msg, warn: !!warn });
    document.getElementById('prl-s03-log').innerHTML = st.logs.map(l =>
      `<div class="sim-log-entry ${l.warn ? 'warn' : ''}">${l.msg}</div>`
    ).join('');
  }

  function showSimFlow(id, amt, pos) {
    const el = document.getElementById('prl-s03-sf-' + id);
    if (!el) return;
    el.className = `sim-flow show ${pos ? 'pos' : 'neg'}`;
    el.textContent = (pos ? '+' : '') + fmt(amt);
    setTimeout(() => el.classList.remove('show'), 2000);
  }

  function hlCard(id, cls) {
    const el = document.getElementById('prl-s03-sc-' + id);
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 2000);
  }

  async function runPrint() {
    if (busy) return;
    busy = true;
    document.getElementById('prl-s03-print').disabled = true;

    st.round++;
    st.supply += PRINT;
    addSimLog(`<strong>Round ${st.round}:</strong> The Central Bank prints ${fmt(PRINT)} of new money.`);

    for (let i = 0; i < st.chars.length; i++) {
      const c = st.chars[i];
      await sleep(280 * i);
      const share = PRINT * c.ratio;
      c.money += share;
      st.goods.forEach(g => { g.cur = g.cur * (1 + INFLATE); });
      st.priceIdx = st.priceIdx * (1 + INFLATE);
      c.power = (c.money / (st.priceIdx / 100)) / c.base * 100;
      const pw = Math.max(0, Math.min(100, c.power));
      document.getElementById('prl-s03-sm-' + c.id).textContent = fmt(c.money);
      document.getElementById('prl-s03-sp-' + c.id).textContent = Math.round(c.power) + '%';
      const bar = document.getElementById('prl-s03-sb-' + c.id);
      bar.style.width = pw + '%';
      bar.className = `sim-bar ${pw < 75 ? 'danger' : ''}`;
      st.goods.forEach(g => {
        const el = document.getElementById('prl-s03-sg-' + g.name);
        if (el) { el.textContent = fmt(g.cur); el.classList.add('rising'); }
      });
      renderSimStats();
      showSimFlow(c.id, Math.round(share), true);
      hlCard(c.id, c.ratio >= 0.15 ? 'receiving' : 'losing');
      const diff = Math.round(c.power - 100);
      addSimLog(`<strong>${c.name}:</strong> Received ${fmt(share)}, purchasing power ${diff >= 0 ? '+' : ''}${diff}% from the start.`);
    }

    updateSimAlert();
    const loser = st.chars[st.chars.length - 1];
    if (loser.power < 60) {
      addSimLog(`<strong>Warning:</strong> ${loser.name} can only buy ${Math.round(loser.power)}% of their original needs.`, true);
    }
    busy = false;
    document.getElementById('prl-s03-print').disabled = false;
  }

  function resetSim() {
    initSim();
    renderSimChars();
    renderSimGoods();
    renderSimStats();
    document.getElementById('prl-s03-log').innerHTML = '';
    document.getElementById('prl-s03-alert').classList.remove('show');
    document.getElementById('prl-s03-print').disabled = false;
  }

  document.getElementById('prl-s03-print').addEventListener('click', runPrint);
  document.getElementById('prl-s03-reset').addEventListener('click', resetSim);

  initSim();
  renderSimChars();
  renderSimGoods();
  renderSimStats();
})();

// ============================================================
// PAGE 3 · PROLOGUE · P.4 SIMULATION (Double-Spend Problem)
// ============================================================
(function() {
  let mode = 'cash';
  let tx1done = false;
  let busy = false;
  let logs = [];

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function addLog(msg, type) {
    logs.push({ msg, type });
    const el = document.getElementById('prl-s04-log');
    el.innerHTML = logs.map(l => `<div class="ds-log-entry ${l.type}">${l.msg}</div>`).join('');
    el.scrollTop = el.scrollHeight;
  }

  function setStatus(id, text, type) {
    const el = document.getElementById('prl-s04-st-' + id);
    el.textContent = text;
    el.className = `ds-actor-status show ${type}`;
  }

  function setArrow(lineId, lblId, state, label) {
    document.getElementById(lineId).className = `ds-arrow-line ${state}`;
    const lbl = document.getElementById(lblId);
    lbl.textContent = label;
    lbl.className = `ds-arrow-label ${state}`;
  }

  function setActor(id, state) {
    document.getElementById('prl-s04-actor-' + id).className = `ds-actor ${state}`;
  }

  function resetDS() {
    ['pengirim','tokoa','tokob'].forEach(id => {
      setActor(id, 'neutral');
      const st = document.getElementById('prl-s04-st-' + id);
      st.className = 'ds-actor-status';
      st.textContent = '';
    });
    document.getElementById('prl-s04-icon-pengirim').textContent  = mode === 'cash' ? '🧑' : '😈';
    document.getElementById('prl-s04-name-pengirim').textContent  = mode === 'cash' ? 'Buyer' : 'Fraudster';
    document.getElementById('prl-s04-bal-pengirim').textContent   = mode === 'cash' ? 'Balance: Rp 100.000' : 'Money file: Rp 100.000';
    document.getElementById('prl-s04-bal-tokoa').textContent      = 'Waiting...';
    document.getElementById('prl-s04-bal-tokob').textContent      = 'Waiting...';
    setArrow('prl-s04-arrow-a', 'prl-s04-lbl-a', '', 'Tx #1');
    setArrow('prl-s04-arrow-b', 'prl-s04-lbl-b', '', 'Tx #2');
    const result = document.getElementById('prl-s04-result');
    result.className = 'ds-result';
    result.innerHTML = '';
    document.getElementById('prl-s04-btn-tx1').disabled = false;
    document.getElementById('prl-s04-btn-tx2').disabled = true;
    tx1done = false;
    busy = false;
    logs = [];
    document.getElementById('prl-s04-log').innerHTML = '';
  }

  function setDSMode(m) {
    mode = m;
    const desc = document.getElementById('prl-s04-desc');
    document.getElementById('prl-s04-tab-cash').className = 'ds-tab';
    document.getElementById('prl-s04-tab-no').className   = 'ds-tab';
    document.getElementById('prl-s04-tab-btc').className  = 'ds-tab';
    if (m === 'cash') {
      document.getElementById('prl-s04-tab-cash').className = 'ds-tab active-cash';
      desc.className   = 'ds-desc cash';
      desc.textContent = 'Cash moves physically. Once handed to Store A, that money is no longer in your hands. To pay Store B, you need money again. This is what makes cash naturally safe.';
    } else if (m === 'no') {
      document.getElementById('prl-s04-tab-no').className = 'ds-tab active-no';
      desc.className   = 'ds-desc no';
      desc.textContent = 'Digital money is a file. Files can be copied. A fraudster can send the same Rp 100.000 file to Store A and Store B at once, like forwarding an email to two different people.';
    } else {
      document.getElementById('prl-s04-tab-btc').className = 'ds-tab active-btc';
      desc.className   = 'ds-desc btc';
      desc.textContent = 'Bitcoin works like cash in the digital world. When you send Bitcoin, it truly moves and cannot be sent again. The network verifies every transaction automatically.';
    }
    resetDS();
  }

  async function doTx1() {
    if (busy) return;
    busy = true;
    document.getElementById('prl-s04-btn-tx1').disabled = true;
    const label = mode === 'cash' ? 'Rp 100.000 (cash)' : 'an Rp 100.000 file';
    addLog(`<strong>Tx #1:</strong> Sending ${label} to Store A...`, 'info');
    await sleep(700);
    setArrow('prl-s04-arrow-a', 'prl-s04-lbl-a', 'sent', 'Sent ✓');
    setActor('tokoa', 'success');
    document.getElementById('prl-s04-bal-tokoa').textContent = 'Received: Rp 100.000';
    setStatus('tokoa', 'Funds received!', 'ok');
    addLog('<strong>Store A:</strong> Received Rp 100.000. Goods shipped.', 'ok');
    if (mode === 'cash') {
      document.getElementById('prl-s04-bal-pengirim').textContent = 'Balance: Rp 0';
      setActor('pengirim', 'danger');
      setStatus('pengirim', 'Out of money', 'bad');
      addLog('<strong>Buyer:</strong> The money has physically changed hands. Balance Rp 0. Can’t pay Store B.', 'bad');
      await sleep(300);
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result neutral show';
      result.innerHTML = '✅ <strong>Cash is naturally safe.</strong> The money physically moved to Store A. To pay Store B, another Rp 100.000 is needed. A double-spend is impossible.';
      busy = false;
    } else {
      document.getElementById('prl-s04-bal-pengirim').textContent = 'The file is still here!';
      addLog('<strong>Fraudster:</strong> The file still exists. It can be sent again to Store B!', 'bad');
      await sleep(300);
      document.getElementById('prl-s04-btn-tx2').disabled = false;
      tx1done = true;
      busy = false;
    }
  }

  async function doTx2() {
    if (busy || !tx1done) return;
    busy = true;
    document.getElementById('prl-s04-btn-tx2').disabled = true;
    addLog('<strong>Tx #2:</strong> Sending the SAME Rp 100.000 file to Store B...', 'info');
    await sleep(700);
    if (mode === 'no') {
      setArrow('prl-s04-arrow-b', 'prl-s04-lbl-b', 'sent', 'Sent ✓');
      setActor('tokob', 'success');
      setActor('pengirim', 'danger');
      document.getElementById('prl-s04-bal-tokob').textContent  = 'Received: Rp 100.000';
      document.getElementById('prl-s04-bal-pengirim').textContent = 'File still exists 😈';
      setStatus('pengirim', 'Double-spend!', 'bad');
      setStatus('tokob', 'Funds received!', 'ok');
      addLog('<strong>Store B:</strong> Received Rp 100.000. Goods shipped.', 'ok');
      await sleep(400);
      addLog('<strong>Result:</strong> The fraudster got goods from TWO stores with the same money!', 'bad');
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result danger show';
      result.innerHTML = '😱 <strong>Double-spend succeeded!</strong> The same file was sent to two stores. One of the stores will never receive a real payment, but has already shipped the goods.';
    } else {
      setArrow('prl-s04-arrow-b', 'prl-s04-lbl-b', 'blocked', 'REJECTED ✗');
      setActor('tokob', 'blocked');
      setActor('pengirim', 'danger');
      document.getElementById('prl-s04-bal-tokob').textContent   = 'Transaction rejected';
      document.getElementById('prl-s04-bal-pengirim').textContent = 'Double-spend failed';
      setStatus('pengirim', 'Rejected by network', 'bad');
      setStatus('tokob', 'Protected ✓', 'info');
      addLog('<strong>Bitcoin Network:</strong> This money was already used in Tx #1. Transaction rejected automatically.', 'info');
      await sleep(400);
      addLog('<strong>Store B:</strong> No funds received. Goods not shipped. Safe.', 'info');
      addLog('<strong>Conclusion:</strong> Bitcoin works like cash; money that has already been sent cannot be sent again.', 'info');
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result safe show';
      result.innerHTML = '🛡️ <strong>Double-spend failed!</strong> Bitcoin behaves like cash. Money that has already been sent cannot be sent again. The network rejects Tx #2 automatically, without a bank, without a third party.';
    }
    busy = false;
  }

  document.getElementById('prl-s04-tab-cash').addEventListener('click', () => setDSMode('cash'));
  document.getElementById('prl-s04-tab-no').addEventListener('click',   () => setDSMode('no'));
  document.getElementById('prl-s04-tab-btc').addEventListener('click',  () => setDSMode('btc'));
  document.getElementById('prl-s04-btn-tx1').addEventListener('click', doTx1);
  document.getElementById('prl-s04-btn-tx2').addEventListener('click', doTx2);
  document.getElementById('prl-s04-btn-ds-reset').addEventListener('click', resetDS);
})();

// ============================================================
// PAGE 3 · PROLOGUE · P.5 SIMULATION (Public-Key Cryptography)
// Note: this is an educational simulation, not real cryptography
// ============================================================
(function() {
  let pubKey = '', privKey = '', signature = '', signedMsg = '';

  function randHex(n) {
    return Array.from({length:n}, () => Math.floor(Math.random()*16).toString(16)).join('');
  }

  function simpleHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  function makeSignature(msg, priv) {
    const mh = simpleHash(msg);
    const ph = simpleHash(priv);
    const c  = simpleHash(mh + ph);
    return c + simpleHash(c + mh) + simpleHash(ph + c);
  }

  function setStep(id, state) {
    document.getElementById(id).className = `pk-step ${state}`;
  }

  // STEP 1 — Generate
  document.getElementById('prl-s05-btn-generate').addEventListener('click', () => {
    pubKey    = '02' + randHex(32);
    privKey   = randHex(32);
    signature = '';
    signedMsg = '';

    document.getElementById('prl-s05-pub-key').textContent  = pubKey;
    document.getElementById('prl-s05-priv-key').textContent = privKey;
    document.getElementById('prl-s05-key-display').style.display = 'grid';
    document.getElementById('prl-s05-step1-sub').textContent = 'Done ✓';
    setStep('prl-s05-step1', 'done');

    document.getElementById('prl-s05-msg-input').disabled        = false;
    document.getElementById('prl-s05-btn-sign').disabled         = false;
    document.getElementById('prl-s05-step2-sub').textContent     = 'Ready';
    setStep('prl-s05-step2', 'active');

    document.getElementById('prl-s05-sig-box').style.display     = 'none';
    document.getElementById('prl-s05-sig-value').textContent     = '';
    document.getElementById('prl-s05-step3-sub').textContent     = 'Wait for step 2';
    setStep('prl-s05-step3', '');
    document.getElementById('prl-s05-btn-verify').disabled       = true;
    document.getElementById('prl-s05-verify-msg-input').disabled = true;
    document.getElementById('prl-s05-verify-result').className   = 'pk-result';
    document.getElementById('prl-s05-tamper-note').style.display = 'none';
    document.getElementById('prl-s05-v-msg').textContent         = '';
    document.getElementById('prl-s05-v-pub').textContent         = '';
    document.getElementById('prl-s05-v-sig').textContent         = '';
  });

  // STEP 2 — Sign
  document.getElementById('prl-s05-btn-sign').addEventListener('click', () => {
    const msg = document.getElementById('prl-s05-msg-input').value.trim();
    if (!msg) { document.getElementById('prl-s05-msg-input').focus(); return; }

    signature = makeSignature(msg, privKey);
    signedMsg = msg;

    document.getElementById('prl-s05-sig-value').textContent    = signature;
    document.getElementById('prl-s05-sig-box').style.display    = 'block';
    document.getElementById('prl-s05-step2-sub').textContent    = 'Done ✓';
    setStep('prl-s05-step2', 'done');

    document.getElementById('prl-s05-v-msg').textContent        = msg.length > 28 ? msg.slice(0,28) + '...' : msg;
    document.getElementById('prl-s05-v-pub').textContent        = pubKey.slice(0,12) + '...';
    document.getElementById('prl-s05-v-sig').textContent        = signature.slice(0,12) + '...';

    document.getElementById('prl-s05-verify-msg-input').value    = msg;
    document.getElementById('prl-s05-verify-msg-input').disabled = false;
    document.getElementById('prl-s05-btn-verify').disabled       = false;
    document.getElementById('prl-s05-step3-sub').textContent     = 'Ready to verify';
    setStep('prl-s05-step3', 'active');
    document.getElementById('prl-s05-verify-result').className   = 'pk-result';
    document.getElementById('prl-s05-tamper-note').style.display = 'none';
  });

  // STEP 3 — Verify
  document.getElementById('prl-s05-btn-verify').addEventListener('click', () => {
    const inputMsg = document.getElementById('prl-s05-verify-msg-input').value;
    const isValid  = makeSignature(inputMsg, privKey) === signature;
    const result   = document.getElementById('prl-s05-verify-result');

    if (isValid) {
      result.className = 'pk-result valid show';
      result.innerHTML = '✅ <strong>Signature valid!</strong><div class="pk-result-sub">The message matches the signature and public key. The transaction is legitimate. The network accepts it.</div>';
      document.getElementById('prl-s05-step3-sub').textContent     = 'Valid ✓';
      setStep('prl-s05-step3', 'done');
      document.getElementById('prl-s05-tamper-note').style.display = 'block';
    } else {
      result.className = 'pk-result invalid show';
      result.innerHTML = '❌ <strong>Signature invalid!</strong><div class="pk-result-sub">The message has been altered. The signature doesn’t match. The network rejects this transaction.</div>';
      document.getElementById('prl-s05-step3-sub').textContent     = 'Invalid ✗';
      setStep('prl-s05-step3', 'invalid');
      document.getElementById('prl-s05-tamper-note').style.display = 'none';
    }
  });
})();

// ============================================================
// PAGE 3 · PROLOGUE · P.6 TIMELINE (Cypherpunk)
// ============================================================
(function() {
  const EVENTS = [
    { year:'1969', tag:'Internet',     type:'normal',    title:'ARPANET is born — the first internet',                  detail:'Designed by a military and academia that trusted each other. No encryption, no privacy — none was needed. Data moved in the open, like a postcard anyone along the way could read.' },
    { year:'1976', tag:'Cryptography',  type:'milestone', title:'Diffie-Hellman: public-key cryptography is discovered',  detail:'Whitfield Diffie and Martin Hellman publish "New Directions in Cryptography". For the first time, two people could communicate secretly without ever meeting to exchange a key. The foundation of all modern internet security.' },
    { year:'1983', tag:'Internet',     type:'normal',    title:'The public internet begins to grow',                    detail:'ARPANET switches to the TCP/IP protocol. The internet begins opening to the public. Data is still unencrypted. Anyone on the connection path can read the traffic — governments, companies, anyone.' },
    { year:'1991', tag:'Cryptography',  type:'milestone', title:'PGP is released — encryption for the people',            detail:'Phil Zimmermann releases Pretty Good Privacy for free. For the first time, ordinary people could encrypt their email. The U.S. government responded with a three-year criminal investigation — because encryption was considered a "weapon".' },
    { year:'1992', tag:'Cypherpunk',   type:'milestone', title:'The Cypherpunks mailing list is founded',               detail:'Eric Hughes, Timothy C. May, and John Gilmore found a mailing list gathering cryptographers, programmers, and privacy activists. At its peak, more than 700 active members. This is the community that gave birth to Bitcoin.' },
    { year:'1993', tag:'Cypherpunk',   type:'milestone', title:'The Cypherpunk Manifesto is written',                   detail:'"Privacy is necessary for an open society in the electronic age." Eric Hughes writes the manifesto that became the movement’s compass. Its final line: "Cypherpunks write code." Not petitions. Not lobbying. Code.' },
    { year:'1997', tag:'Cypherpunk',   type:'normal',    title:'Hashcash — the precursor to proof of work',             detail:'Adam Back creates Hashcash, a system to prevent email spam using computational work. This concept would later become the basis of Bitcoin’s mining mechanism.' },
    { year:'1998', tag:'Cypherpunk',   type:'normal',    title:'b-money by Wei Dai',                                    detail:'Wei Dai publishes b-money — a proposal for digital money without a central authority. Never implemented, but its ideas were directly cited by Satoshi in the Bitcoin whitepaper.' },
    { year:'2004', tag:'Cryptography',  type:'normal',    title:'Reusable Proof of Work by Hal Finney',                  detail:'Hal Finney — who would later become the first person to receive Bitcoin from Satoshi — creates a digital money system based on proof of work. One step closer.' },
    { year:'2008', tag:'Bitcoin',      type:'bitcoin',   title:'Satoshi releases the Bitcoin whitepaper',               detail:'October 31, 2008. In the middle of a global financial crisis, Satoshi Nakamoto sends an email to a cryptography mailing list: "Bitcoin: A Peer-to-Peer Electronic Cash System." Every thread from the previous 40 years was finally tied together.' },
  ];

  const container = document.getElementById('prl-s06-items');
  let activeIdx = null;

  EVENTS.forEach((ev, i) => {
    const item = document.createElement('div');
    item.className = `tl-item tl-${ev.type}`;
    item.innerHTML = `
      <div class="tl-left">
        <div class="tl-year">${ev.year}</div>
        <div class="tl-dot"></div>
      </div>
      <div class="tl-right">
        <div class="tl-tag">${ev.tag}</div>
        <div class="tl-title">${ev.title}</div>
        <div class="tl-detail">${ev.detail}</div>
      </div>`;
    item.addEventListener('click', () => {
      if (activeIdx === i) {
        item.classList.remove('tl-active');
        activeIdx = null;
      } else {
        if (activeIdx !== null) container.children[activeIdx].classList.remove('tl-active');
        item.classList.add('tl-active');
        activeIdx = i;
      }
    });
    container.appendChild(item);
  });
})();
