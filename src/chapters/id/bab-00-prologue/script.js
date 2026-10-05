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
    { id:'bs', icon:'🏛️', name:'Bank Sentral', role:'Pencetak uang',   base:500, ratio:0.45 },
    { id:'bb', icon:'🏦', name:'Bank Besar',   role:'Terima pertama', base:200, ratio:0.30 },
    { id:'pg', icon:'💼', name:'Pengusaha',    role:'Pinjaman murah', base:150, ratio:0.15 },
    { id:'pk', icon:'👷', name:'Pekerja',      role:'Gaji tetap',     base:100, ratio:0.07 },
    { id:'pn', icon:'👴', name:'Pensiunan',    role:'Tabungan tetap', base:50,  ratio:0.03 },
  ];
  const GOODS = [
    { name:'Rumah', base:100 },
    { name:'Sembako', base:20 },
    { name:'Bensin', base:10 },
    { name:'Mie instan', base:3 },
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
        <div class="sim-char-powerlabel">Daya beli: <span id="prl-s03-sp-${c.id}">${Math.round(c.power)}%</span></div>
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
      title.textContent = '🚨 KRISIS DAYA BELI!';
      sub.textContent = `Pekerja & Pensiunan hanya mampu beli ${Math.round(avg)}% dari sebelumnya.`;
      el.classList.add('show');
    } else if (avg < 65) {
      title.textContent = '⚠️ DAYA BELI TURUN DRASTIS!';
      sub.textContent = `Kehilangan ${Math.round(100 - avg)}% daya beli dari awal.`;
      el.classList.add('show');
    } else if (avg < 85) {
      title.textContent = '⚠️ DAYA BELI TURUN!';
      sub.textContent = `Harga naik lebih cepat dari pendapatan Pekerja & Pensiunan.`;
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
    addSimLog(`<strong>Putaran ${st.round}:</strong> Bank Sentral mencetak ${fmt(PRINT)} uang baru.`);

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
      addSimLog(`<strong>${c.name}:</strong> Dapat ${fmt(share)}, daya beli ${diff >= 0 ? '+' : ''}${diff}% dari awal.`);
    }

    updateSimAlert();
    const loser = st.chars[st.chars.length - 1];
    if (loser.power < 60) {
      addSimLog(`<strong>Peringatan:</strong> ${loser.name} hanya bisa beli ${Math.round(loser.power)}% dari kebutuhan awal.`, true);
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
    document.getElementById('prl-s04-name-pengirim').textContent  = mode === 'cash' ? 'Pembeli' : 'Penipu';
    document.getElementById('prl-s04-bal-pengirim').textContent   = mode === 'cash' ? 'Saldo: Rp 100.000' : 'File uang: Rp 100.000';
    document.getElementById('prl-s04-bal-tokoa').textContent      = 'Menunggu...';
    document.getElementById('prl-s04-bal-tokob').textContent      = 'Menunggu...';
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
      desc.textContent = 'Uang cash berpindah secara fisik. Setelah diberikan ke Toko A, uang itu tidak ada lagi di tanganmu. Untuk bayar Toko B, kamu butuh uang lagi. Inilah yang membuat cash aman secara alami.';
    } else if (m === 'no') {
      document.getElementById('prl-s04-tab-no').className = 'ds-tab active-no';
      desc.className   = 'ds-desc no';
      desc.textContent = 'Uang digital adalah file. File bisa dicopy. Penipu bisa kirim file Rp 100.000 yang sama ke Toko A dan Toko B sekaligus, seperti forward email ke dua orang berbeda.';
    } else {
      document.getElementById('prl-s04-tab-btc').className = 'ds-tab active-btc';
      desc.className   = 'ds-desc btc';
      desc.textContent = 'Bitcoin bekerja seperti uang cash di dunia digital. Ketika kamu kirim Bitcoin, ia benar-benar berpindah dan tidak bisa dikirim ulang. Jaringan memverifikasi setiap transaksi secara otomatis.';
    }
    resetDS();
  }

  async function doTx1() {
    if (busy) return;
    busy = true;
    document.getElementById('prl-s04-btn-tx1').disabled = true;
    const label = mode === 'cash' ? 'Rp 100.000 (cash)' : 'file Rp 100.000';
    addLog(`<strong>Tx #1:</strong> Mengirim ${label} ke Toko A...`, 'info');
    await sleep(700);
    setArrow('prl-s04-arrow-a', 'prl-s04-lbl-a', 'sent', 'Terkirim ✓');
    setActor('tokoa', 'success');
    document.getElementById('prl-s04-bal-tokoa').textContent = 'Terima: Rp 100.000';
    setStatus('tokoa', 'Dana masuk!', 'ok');
    addLog('<strong>Toko A:</strong> Menerima Rp 100.000. Barang dikirim.', 'ok');
    if (mode === 'cash') {
      document.getElementById('prl-s04-bal-pengirim').textContent = 'Saldo: Rp 0';
      setActor('pengirim', 'danger');
      setStatus('pengirim', 'Uang habis', 'bad');
      addLog('<strong>Pembeli:</strong> Uang sudah berpindah fisik. Saldo Rp 0. Tidak bisa bayar Toko B.', 'bad');
      await sleep(300);
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result neutral show';
      result.innerHTML = '✅ <strong>Cash aman secara alami.</strong> Uang berpindah fisik ke Toko A. Untuk bayar Toko B dibutuhkan Rp 100.000 lagi. Double-spend tidak mungkin terjadi.';
      busy = false;
    } else {
      document.getElementById('prl-s04-bal-pengirim').textContent = 'File masih ada di sini!';
      addLog('<strong>Penipu:</strong> File masih ada. Bisa dikirim lagi ke Toko B!', 'bad');
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
    addLog('<strong>Tx #2:</strong> Mengirim file Rp 100.000 yang SAMA ke Toko B...', 'info');
    await sleep(700);
    if (mode === 'no') {
      setArrow('prl-s04-arrow-b', 'prl-s04-lbl-b', 'sent', 'Terkirim ✓');
      setActor('tokob', 'success');
      setActor('pengirim', 'danger');
      document.getElementById('prl-s04-bal-tokob').textContent  = 'Terima: Rp 100.000';
      document.getElementById('prl-s04-bal-pengirim').textContent = 'File masih ada 😈';
      setStatus('pengirim', 'Double-spend!', 'bad');
      setStatus('tokob', 'Dana masuk!', 'ok');
      addLog('<strong>Toko B:</strong> Menerima Rp 100.000. Barang dikirim.', 'ok');
      await sleep(400);
      addLog('<strong>Hasil:</strong> Penipu dapat barang dari DUA toko dengan uang yang sama!', 'bad');
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result danger show';
      result.innerHTML = '😱 <strong>Double-spend berhasil!</strong> File yang sama dikirim ke dua toko. Salah satu toko tidak akan pernah mendapat pembayaran nyata, tapi sudah terlanjur kirim barang.';
    } else {
      setArrow('prl-s04-arrow-b', 'prl-s04-lbl-b', 'blocked', 'DITOLAK ✗');
      setActor('tokob', 'blocked');
      setActor('pengirim', 'danger');
      document.getElementById('prl-s04-bal-tokob').textContent   = 'Transaksi ditolak';
      document.getElementById('prl-s04-bal-pengirim').textContent = 'Gagal double-spend';
      setStatus('pengirim', 'Ditolak jaringan', 'bad');
      setStatus('tokob', 'Terlindungi ✓', 'info');
      addLog('<strong>Jaringan Bitcoin:</strong> Uang ini sudah dipakai di Tx #1. Transaksi ditolak otomatis.', 'info');
      await sleep(400);
      addLog('<strong>Toko B:</strong> Tidak ada dana masuk. Barang tidak dikirim. Aman.', 'info');
      addLog('<strong>Kesimpulan:</strong> Bitcoin bekerja seperti cash, uang yang sudah terkirim tidak bisa dikirim ulang.', 'info');
      const result = document.getElementById('prl-s04-result');
      result.className = 'ds-result safe show';
      result.innerHTML = '🛡️ <strong>Double-spend gagal!</strong> Bitcoin berperilaku seperti cash. Uang yang sudah terkirim tidak bisa dikirim ulang. Jaringan menolak Tx #2 secara otomatis, tanpa bank, tanpa pihak ketiga.';
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
// Catatan: ini adalah simulasi edukasi, bukan kriptografi nyata
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
    document.getElementById('prl-s05-step1-sub').textContent = 'Selesai ✓';
    setStep('prl-s05-step1', 'done');

    document.getElementById('prl-s05-msg-input').disabled        = false;
    document.getElementById('prl-s05-btn-sign').disabled         = false;
    document.getElementById('prl-s05-step2-sub').textContent     = 'Siap';
    setStep('prl-s05-step2', 'active');

    document.getElementById('prl-s05-sig-box').style.display     = 'none';
    document.getElementById('prl-s05-sig-value').textContent     = '';
    document.getElementById('prl-s05-step3-sub').textContent     = 'Tunggu step 2';
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
    document.getElementById('prl-s05-step2-sub').textContent    = 'Selesai ✓';
    setStep('prl-s05-step2', 'done');

    document.getElementById('prl-s05-v-msg').textContent        = msg.length > 28 ? msg.slice(0,28) + '...' : msg;
    document.getElementById('prl-s05-v-pub').textContent        = pubKey.slice(0,12) + '...';
    document.getElementById('prl-s05-v-sig').textContent        = signature.slice(0,12) + '...';

    document.getElementById('prl-s05-verify-msg-input').value    = msg;
    document.getElementById('prl-s05-verify-msg-input').disabled = false;
    document.getElementById('prl-s05-btn-verify').disabled       = false;
    document.getElementById('prl-s05-step3-sub').textContent     = 'Siap diverifikasi';
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
      result.innerHTML = '✅ <strong>Signature valid!</strong><div class="pk-result-sub">Pesan cocok dengan signature dan public key. Transaksi sah. Jaringan menerimanya.</div>';
      document.getElementById('prl-s05-step3-sub').textContent     = 'Valid ✓';
      setStep('prl-s05-step3', 'done');
      document.getElementById('prl-s05-tamper-note').style.display = 'block';
    } else {
      result.className = 'pk-result invalid show';
      result.innerHTML = '❌ <strong>Signature tidak valid!</strong><div class="pk-result-sub">Pesan telah diubah. Signature tidak cocok. Jaringan menolak transaksi ini.</div>';
      document.getElementById('prl-s05-step3-sub').textContent     = 'Tidak valid ✗';
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
    { year:'1969', tag:'Internet',   type:'normal',    title:'ARPANET lahir — internet pertama',                     detail:'Dirancang oleh militer dan akademisi yang saling percaya. Tidak ada enkripsi, tidak ada privasi — memang tidak dibutuhkan. Data bergerak terbuka, seperti kartu pos yang bisa dibaca siapapun di jalan.' },
    { year:'1976', tag:'Kriptografi',type:'milestone', title:'Diffie-Hellman: public-key cryptography ditemukan',    detail:'Whitfield Diffie dan Martin Hellman mempublikasikan "New Directions in Cryptography". Untuk pertama kalinya, dua orang bisa berkomunikasi secara rahasia tanpa pernah bertemu untuk bertukar kunci. Fondasi seluruh keamanan internet modern.' },
    { year:'1983', tag:'Internet',   type:'normal',    title:'Internet publik mulai tumbuh',                         detail:'ARPANET beralih ke protokol TCP/IP. Internet mulai terbuka untuk umum. Data tetap tidak terenkripsi. Siapapun yang berada di jalur koneksi bisa membaca lalu lintas data — pemerintah, perusahaan, siapapun.' },
    { year:'1991', tag:'Kriptografi',type:'milestone', title:'PGP dirilis — enkripsi untuk rakyat',                  detail:'Phil Zimmermann merilis Pretty Good Privacy secara gratis. Untuk pertama kalinya, orang biasa bisa mengenkripsi email mereka. Pemerintah AS meresponnya dengan investigasi kriminal selama tiga tahun — karena enkripsi dianggap "senjata".' },
    { year:'1992', tag:'Cypherpunk', type:'milestone', title:'Mailing list Cypherpunks berdiri',                     detail:'Eric Hughes, Timothy C. May, dan John Gilmore mendirikan mailing list yang mengumpulkan kriptografer, programmer, dan aktivis privasi. Di puncaknya lebih dari 700 anggota aktif. Ini adalah komunitas yang melahirkan Bitcoin.' },
    { year:'1993', tag:'Cypherpunk', type:'milestone', title:'The Cypherpunk Manifesto ditulis',                     detail:'"Privacy is necessary for an open society in the electronic age." Eric Hughes menulis manifesto yang menjadi kompas gerakan ini. Kalimat terakhirnya: "Cypherpunks write code." Bukan petisi. Bukan lobi. Kode.' },
    { year:'1997', tag:'Cypherpunk', type:'normal',    title:'Hashcash — cikal bakal proof of work',                 detail:'Adam Back menciptakan Hashcash, sistem untuk mencegah spam email menggunakan computational work. Konsep ini kelak menjadi dasar mekanisme mining Bitcoin.' },
    { year:'1998', tag:'Cypherpunk', type:'normal',    title:'b-money oleh Wei Dai',                                 detail:'Wei Dai mempublikasikan b-money — proposal uang digital tanpa otoritas pusat. Tidak pernah diimplementasikan, tapi idenya secara langsung dikutip oleh Satoshi dalam whitepaper Bitcoin.' },
    { year:'2004', tag:'Kriptografi',type:'normal',    title:'Reusable Proof of Work oleh Hal Finney',               detail:'Hal Finney — yang kelak menjadi orang pertama menerima Bitcoin dari Satoshi — menciptakan sistem uang digital berbasis proof of work. Satu langkah lebih dekat.' },
    { year:'2008', tag:'Bitcoin',    type:'bitcoin',   title:'Satoshi merilis whitepaper Bitcoin',                   detail:'31 Oktober 2008. Di tengah krisis keuangan global, Satoshi Nakamoto mengirim email ke mailing list kriptografi: "Bitcoin: A Peer-to-Peer Electronic Cash System." Semua benang dari 40 tahun sebelumnya akhirnya tersimpul.' },
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
