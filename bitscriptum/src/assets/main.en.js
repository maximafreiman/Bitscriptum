
// Helper: escape teks yang mengandung token <...> sebelum masuk innerHTML,
// agar token seperti <scriptHash> tampil sebagai teks, bukan ditelan parser HTML.
function bsEscHTML(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}


// ============================================================
// NAVIGATION
// ============================================================
function navigate(to) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(to).classList.add('active');
  window.scrollTo(0, 0);
  const pc = document.getElementById('prologue-content');
  if (pc) pc.scrollTop = 0;
  if (to === 'page-bab21') {
    showSectionInContentB21('section-21-1', 'sb-21-1');
  }
}

// ============================================================
// PAGE 1 · WELCOME · BUTTON EVENTS
// ============================================================
const btnMulai = document.getElementById('btn-mulai');
btnMulai.addEventListener('mouseenter', () => btnMulai.style.backgroundColor = '#7C3AED');
btnMulai.addEventListener('mouseleave', () => btnMulai.style.backgroundColor = '#1A1A18');
btnMulai.addEventListener('click', () => navigate('page-chapters'));
// ============================================================
// PAGE 1 · WELCOME · HASH CANVAS ANIMATION
// ============================================================
const canvas = document.getElementById('hash-canvas');
const ctx = canvas.getContext('2d');

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

const HEX = '0123456789abcdef';
const randHex = n => Array.from({length:n}, () => HEX[Math.random()*16|0]).join('');

class HashStream {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.speed = 0.4 + Math.random() * 0.8;
    this.chars = Array.from({length: 12 + Math.floor(Math.random()*20)}, () => randHex(8));
    this.alpha = 0.04 + Math.random() * 0.06;
    this.size = 9 + Math.random() * 3;
    this.isLeader = Math.random() < 0.15;
    this.tick = 0;
  }
  update() {
    this.y += this.speed;
    this.tick++;
    if (this.tick % 4 === 0) this.chars[Math.floor(Math.random()*this.chars.length)] = randHex(8);
    if (this.y > canvas.height + 200) this.reset();
  }
  draw() {
    ctx.font = `${this.size}px 'Courier Prime', monospace`;
    for (let i = 0; i < this.chars.length; i++) {
      const yPos = this.y - i * (this.size + 4);
      if (yPos < -20 || yPos > canvas.height + 20) continue;
      const fade = 1 - i / this.chars.length;
      if (i === 0 && this.isLeader) ctx.fillStyle = `rgba(124,58,237,${this.alpha*3.5*fade})`;
      else if (i === 0)            ctx.fillStyle = `rgba(109,40,217,${this.alpha*2*fade})`;
      else                         ctx.fillStyle = `rgba(139,92,246,${this.alpha*fade*0.5})`;
      ctx.fillText(this.chars[i], this.x, yPos);
    }
  }
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = 1 + Math.random() * 2;
    this.alpha = 0.05 + Math.random() * 0.1;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.pulse += 0.02;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,58,237,${this.alpha*(0.5+0.5*Math.sin(this.pulse))})`;
    ctx.fill();
  }
}

const streams = Array.from({length:28}, () => { const s = new HashStream(); s.y = Math.random()*canvas.height; return s; });
const particles = Array.from({length:40}, () => new Particle());

let frame = 0;
function animate() {
  if (!document.getElementById('page-welcome').classList.contains('active')) {
    requestAnimationFrame(animate);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(250,250,248,0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  streams.forEach(s => { s.update(); s.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  if (frame % 3 === 0) {
    ctx.strokeStyle = 'rgba(124,58,237,0.025)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  }
  frame++;
  requestAnimationFrame(animate);
}
animate();

// ============================================================
// PAGE 1 · WELCOME · LIVE HASH TICKER
// ============================================================
const hashEl = document.getElementById('live-hash');
setInterval(() => {
  const prefix = ['000000000000','00000000000','0000000000000'][Math.floor(Math.random()*3)];
  hashEl.textContent = prefix + randHex(20).slice(0,20) + '...';
  hashEl.classList.add('flash');
  setTimeout(() => hashEl.classList.remove('flash'), 120);
}, 600);

// ============================================================
// PAGE 1 · WELCOME · BLOCK NUMBER COUNTER
// ============================================================
// Block number statis — menandai block saat Bitscriptum mulai dikembangkan


// ============================================================
// SHARED · TOPBAR LOGO EVENTS (kembali ke Welcome)
// ============================================================
document.getElementById('back-home-cl').addEventListener('click', () => navigate('page-welcome'));
document.getElementById('back-home-pr').addEventListener('click', () => navigate('page-welcome'));

// ============================================================
// PAGE 2 · CHAPTER LIST · ITEM EVENTS
// ============================================================
document.getElementById('ch-prologue').addEventListener('click', () => navigate('page-prologue'));
document.getElementById('ch-bab1').addEventListener('click',    () => navigate('page-bab1'));
document.getElementById('ch-bab2').addEventListener('click',    () => navigate('page-bab2'));
document.getElementById('ch-bab3').addEventListener('click',    () => navigate('page-bab3'));
document.getElementById('ch-bab4').addEventListener('click',    () => navigate('page-bab4'));
document.getElementById('ch-bab5').addEventListener('click',    () => navigate('page-bab5'));

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
    { era:'Genesis',     year:2009, block:0,       reward:50,         supply:10500000,      pct:50,          status:'past',    note:'Bitcoin’s first era. Satoshi Nakamoto mined the first block on January 3, 2009. The 50 BTC reward per block lasted about 4 years. 210,000 blocks × 50 BTC = 10,500,000 BTC, already half of every Bitcoin that will ever exist.' },
    { era:'Halving #1',  year:2012, block:210000,  reward:25,         supply:15750000,      pct:75,          status:'past',    note:'The first halving occurred on November 28, 2012. The reward was cut from 50 to 25 BTC. Total supply mined in this era: 5,250,000 BTC.' },
    { era:'Halving #2',  year:2016, block:420000,  reward:12.5,       supply:18375000,      pct:87.5,        status:'past',    note:'The second halving occurred on July 9, 2016. The reward was cut from 25 to 12.5 BTC. This era produced 2,625,000 new BTC.' },
    { era:'Halving #3',  year:2020, block:630000,  reward:6.25,       supply:19687500,      pct:93.75,       status:'past',    note:'The third halving occurred on May 11, 2020. The reward was cut from 12.5 to 6.25 BTC. This era produced 1,312,500 new BTC.' },
    { era:'Halving #4',  year:2024, block:840000,  reward:3.125,      supply:20343750,      pct:96.875,      status:'current', note:'The fourth halving occurred in April 2024. The current reward is 3.125 BTC per block, and this era will produce 656,250 new BTC. We are in this era right now.' },
    { era:'Halving #5',  year:2028, block:1050000, reward:1.5625,     supply:20671875,      pct:98.4375,     status:'future',  note:'Expected to occur around 2028. The reward will be cut to 1.5625 BTC. By the end of this era, more than 98% of Bitcoin will be in circulation.' },
    { era:'Halving #6',  year:2032, block:1260000, reward:0.78125,    supply:20835937.5,    pct:99.21875,    status:'future',  note:'Expected to occur around 2032. The reward drops to 0.78125 BTC. The supply moves ever closer to 21 million.' },
    { era:'Halving #10', year:2048, block:2100000, reward:0.04882812, supply:20989746.0927, pct:99.951172,   status:'future',  note:'Expected to occur around 2048. The reward is down to 0.04882812 BTC per block. More than 99.9% of Bitcoin is already in circulation, and miners rely primarily on transaction fees.' },
    { era:'Final (~2140)',year:2140, block:6930000, reward:0,         supply:20999999.9769, pct:99.99999989, status:'future',  note:'Around the year 2140, after 33 eras, the reward reaches zero. The total amount of Bitcoin ever issued stops at 20,999,999.9769 BTC, a little under 21 million because of satoshi rounding at every halving. From then on, miners receive only transaction fees. No new Bitcoin will ever be born again.' },
  ];

  let activeRow = null;

  // [fix] angka diformat sesuai bahasa halaman; maksimal 4 desimal untuk supply akhir yang tidak bulat
  function formatNum(n) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }
  function formatBtc(n) {
    return n > 0 ? n.toLocaleString('en-US', { maximumFractionDigits: 8 }) + ' BTC' : '0 BTC';
  }
  function formatPct(n, d) {
    if (n > 99.999 && n < 100) return '≈100%';   // jangan tampil 100%: total akhir tidak pernah tepat 21 juta
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: 3 }) + '%';
  }

  function renderHvTable() {
    const tbody = document.getElementById('b01-s15-tbody');
    if (!tbody) return;
    tbody.innerHTML = HALVINGS.map((h, i) => {
      const pctDisplay = formatPct(h.pct, 0);
      const supplyBar  = Math.min(100, h.pct);
      return `<tr id="b01-s15-row-${i}" data-idx="${i}">
        <td class="hv-td-era">${h.era}</td>
        <td>${h.year}</td>
        <td>#${formatNum(h.block)}</td>
        <td>${formatBtc(h.reward)}</td>
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
        <div class="hv-detail-value">${formatBtc(h.reward)}</div>
      </div>
      <div>
        <div class="hv-detail-label">Block Number</div>
        <div class="hv-detail-value">#${formatNum(h.block)}</div>
      </div>
      <div>
        <div class="hv-detail-label">Supply at End of Era</div>
        <div class="hv-detail-value">${formatNum(h.supply)} BTC</div>
      </div>
      <div>
        <div class="hv-detail-label">% of 21 Million</div>
        <div class="hv-detail-value">${formatPct(h.pct, 3)}</div>
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

// ============================================================
// PAGE 5 · BAB 2 · TOPBAR & BACK EVENTS
// ============================================================
document.getElementById('back-home-b2').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b2').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 5 · BAB 2 · SUB-BAB NAVIGATION
// ============================================================
function showSectionInContentB2(sectionId, sbId) {
  document.querySelectorAll('#page-bab2 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab2 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab2-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// tombol nav Bab 2
document.querySelectorAll('#page-bab2 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target  = btn.getAttribute('data-target');
    const sb      = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB2(target, sb);
  });
});

// ============================================================
// PAGE 5 · BAB 2 · SIDEBAR EVENTS (2.1 - 2.6)
// ============================================================
document.getElementById('sb-2-1').addEventListener('click', () => showSectionInContentB2('section-2-1', 'sb-2-1'));
document.getElementById('sb-2-2').addEventListener('click', () => showSectionInContentB2('section-2-2', 'sb-2-2'));
document.getElementById('sb-2-3').addEventListener('click', () => showSectionInContentB2('section-2-3', 'sb-2-3'));
document.getElementById('sb-2-4').addEventListener('click', () => showSectionInContentB2('section-2-4', 'sb-2-4'));
document.getElementById('sb-2-5').addEventListener('click', () => showSectionInContentB2('section-2-5', 'sb-2-5'));
document.getElementById('sb-2-6').addEventListener('click', () => showSectionInContentB2('section-2-6', 'sb-2-6'));

// PAGE 5 · BAB 2 · 2.2 SIMULATION (Private Key & Public Key)
// ============================================================
(function() {
  const HEX = '0123456789abcdef';

  function randHex(n) {
    return Array.from({length:n}, () => HEX[Math.floor(Math.random()*16)]).join('');
  }

  function derivePublicKey(privKey) {
    // Simulasi edukasi — bukan ECC nyata
    let h1 = 0x79BE667F, h2 = 0xFFFFFFFE, h3 = 0xBAAEDCE6, h4 = 0xAF48A03B;
    for (let i = 0; i < privKey.length; i++) {
      const c = privKey.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x9e3779b9) >>> 0;
      h2 = Math.imul(h2 ^ c, 0x85ebca77) >>> 0;
      h3 = Math.imul(h3 ^ c, 0xc2b2ae35) >>> 0;
      h4 = Math.imul(h4 ^ c, 0x27d4eb2f) >>> 0;
    }
    const mix = (a, b) => (Math.imul(a ^ (a >>> 16), 0x45d9f3b) ^ Math.imul(b, 0x119de1f3)) >>> 0;
    return '02' + [
      mix(h1,h2), mix(h2,h3), mix(h3,h4), mix(h4,h1),
      mix(h1^h3,h2^h4), mix(h2^h4,h1^h3),
      mix(h1^h2^h3,h4), mix(h2^h3^h4,h1),
    ].map(n => n.toString(16).padStart(8,'0')).join('');
  }

  let currentPrivKey  = '';
  let currentPubKey   = '';
  let flickerInterval = null;
  let generated       = false;

  function flicker(el, count, onDone) {
    let c = 0;
    flickerInterval = setInterval(() => {
      el.textContent = randHex(64);
      c++;
      if (c >= count) { clearInterval(flickerInterval); flickerInterval = null; onDone(); }
    }, 80);
  }

  function generateKeys() {
    if (flickerInterval) return;
    document.getElementById('b02-s22-btn-gen').disabled = true;
    currentPrivKey = randHex(64);
    currentPubKey  = derivePublicKey(currentPrivKey);

    const privEl = document.getElementById('b02-s22-priv');
    const pubEl  = document.getElementById('b02-s22-pub');

    privEl.className  = 'kp-key-val flickering';
    pubEl.className   = 'kp-key-val';
    pubEl.textContent = 'Waiting for private key...';
    document.getElementById('b02-s22-oneway').classList.remove('show');
    document.getElementById('b02-s22-tamper').classList.remove('show');
    document.getElementById('b02-s22-tamper-result').classList.remove('show');

    flicker(privEl, 18, () => {
      privEl.textContent = currentPrivKey;
      privEl.className   = 'kp-key-val ready priv';
      document.getElementById('b02-s22-box-priv').classList.add('active');

      setTimeout(() => {
        pubEl.className = 'kp-key-val flickering';
        let c2 = 0;
        const t2 = setInterval(() => {
          pubEl.textContent = randHex(66);
          c2++;
          if (c2 >= 12) {
            clearInterval(t2);
            pubEl.textContent = currentPubKey;
            pubEl.className   = 'kp-key-val ready pub';
            document.getElementById('b02-s22-box-pub').classList.add('active');
            document.getElementById('b02-s22-oneway').classList.add('show');
            setTimeout(() => {
              document.getElementById('b02-s22-tamper').classList.add('show');
              document.getElementById('b02-s22-tamper-input').value = currentPrivKey;
              generated = true;
              document.getElementById('b02-s22-btn-gen').disabled = false;
            }, 400);
          }
        }, 80);
      }, 300);
    });
  }

  function resetKeys() {
    if (flickerInterval) { clearInterval(flickerInterval); flickerInterval = null; }
    currentPrivKey = '';
    currentPubKey  = '';
    generated      = false;

    const privEl = document.getElementById('b02-s22-priv');
    const pubEl  = document.getElementById('b02-s22-pub');
    privEl.textContent = 'Not generated yet...';
    privEl.className   = 'kp-key-val';
    pubEl.textContent  = 'Not generated yet...';
    pubEl.className    = 'kp-key-val';
    document.getElementById('b02-s22-box-priv').classList.remove('active');
    document.getElementById('b02-s22-box-pub').classList.remove('active');
    document.getElementById('b02-s22-oneway').classList.remove('show');
    document.getElementById('b02-s22-tamper').classList.remove('show');
    document.getElementById('b02-s22-tamper-result').classList.remove('show');
    document.getElementById('b02-s22-tamper-input').value = '';
    document.getElementById('b02-s22-btn-gen').disabled = false;
  }

  document.getElementById('b02-s22-tamper-input').addEventListener('input', function() {
    if (!generated) return;
    const modified = this.value.trim();
    const result   = document.getElementById('b02-s22-tamper-result');
    if (modified === currentPrivKey) { result.classList.remove('show'); return; }
    const newPub = derivePublicKey(modified);
    result.className = 'kp-tamper-result changed show';
    result.innerHTML = `The public key changes completely:<br>
      <span style="font-family:'Courier Prime',monospace;font-size:10px;color:#534AB7;word-break:break-all">${newPub}</span><br>
      <span style="font-size:10px;color:#52524C;margin-top:4px;display:block">A single different character in the private key produces a completely different public key. No pattern, no relationship that can be guessed.</span>`;
  });

  const genBtn   = document.getElementById('b02-s22-btn-gen');
  const resetBtn = document.getElementById('b02-s22-btn-reset');
  if (genBtn)   genBtn.addEventListener('click', generateKeys);
  if (resetBtn) resetBtn.addEventListener('click', resetKeys);
})();

// PAGE 5 · BAB 2 · 2.3 SIMULATION (Key to Address)
// ============================================================
(function() {
  const HEX = '0123456789abcdef';
  function rh(n) { return Array.from({length:n}, () => HEX[Math.floor(Math.random()*16)]).join(''); }

  function deriveAll(priv) {
    let h1=0x79BE667F, h2=0xFFFFFFFE, h3=0xBAAEDCE6, h4=0xAF48A03B;
    for (let i = 0; i < priv.length; i++) {
      const c = priv.charCodeAt(i);
      h1 = Math.imul(h1^c, 0x9e3779b9) >>> 0;
      h2 = Math.imul(h2^c, 0x85ebca77) >>> 0;
      h3 = Math.imul(h3^c, 0xc2b2ae35) >>> 0;
      h4 = Math.imul(h4^c, 0x27d4eb2f) >>> 0;
    }
    const mx  = (a, b) => (Math.imul(a^(a>>>16), 0x45d9f3b) ^ Math.imul(b, 0x119de1f3)) >>> 0;
    const pub = '02' + [mx(h1,h2),mx(h2,h3),mx(h3,h4),mx(h4,h1),mx(h1^h3,h2^h4),mx(h2^h4,h1^h3),mx(h1^h2^h3,h4),mx(h2^h3^h4,h1)].map(n => n.toString(16).padStart(8,'0')).join('');

    const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

    // Xorshift32 — lebih bervariasi dari LCG sederhana
    function xorshift(s) {
      s = (s || 1) >>> 0;
      s ^= s << 13; s = s >>> 0;
      s ^= s >> 17;
      s ^= s << 5;  s = s >>> 0;
      return s;
    }

    function mkSeed(extra) {
      let s = (h1 ^ h2 ^ extra) >>> 0;
      s = xorshift(s ^ h3);
      s = xorshift(s ^ h4);
      return s || 0xdeadbeef;
    }

    function toB58(extra, len) {
      let s = mkSeed(extra), r = '';
      for (let i = 0; i < len; i++) {
        s = xorshift(s ^ (i * 0x9e3779b9));
        r += B58[s % 58];
      }
      return r;
    }

    function toBc(pfx, extra, len) {
      let s = mkSeed(extra), r = pfx;
      for (let i = 0; i < len; i++) {
        s = xorshift(s ^ (i * 0x517cc1b7));
        r += B32[s % 32];
      }
      return r;
    }

    return {
      pub,
      legacy:  '1'    + toB58(0x11111111, 32),
      p2sh:    '3'    + toB58(0x33333333, 32),
      segwit:  toBc('bc1q', 0x53657777, 39),
      taproot: toBc('bc1p', 0x54617072, 59),
    };
  }

  const ADDRS = [
    { key:'legacy',  format:'Legacy',        prefix:'Starts with 1...', badges:[{t:'Still common',c:'legacy'}],                                      desc:'Bitcoin’s first format, born alongside the protocol in 2009. Still widely used in legacy systems and first-generation exchanges. Transaction fees are higher than modern formats.' },
    { key:'p2sh',    format:'P2SH',          prefix:'Starts with 3...', badges:[{t:'Being phased out',c:'legacy'}],                               desc:'Pay-to-Script-Hash — enables more complex conditions like multisignature. Popular 2012-2018, now slowly being replaced by the more efficient Native SegWit.' },
    { key:'segwit',  format:'Native SegWit', prefix:'Starts with bc1q...', badges:[{t:'Most common',c:'popular'},{t:'Recommended',c:'modern'}], desc:'The dominant format today. Most modern wallets default to it. Lower transaction fees and supported by almost all exchanges. If you don’t know which format to use, use this one.' },
    { key:'taproot', format:'Taproot',        prefix:'Starts with bc1p...', badges:[{t:'Growing adoption',c:'future'}],                              desc:'The newest format, activated in November 2021. More private, more flexible. Adoption keeps growing but not all exchanges support it fully yet.' },
  ];

  let activeCard = null;
  let generated  = false;

  function renderAddrs(keys) {
    const grid = document.getElementById('b02-s23-addr-grid');
    grid.innerHTML = ADDRS.map(a => `
      <div class="ka-addr-card" id="b02-s23-card-${a.key}">
        <div class="ka-addr-card-head">
          <div class="ka-addr-left">
            <span class="ka-addr-format">${a.format}</span>
            <span class="ka-addr-prefix">${a.prefix}</span>
          </div>
          <div class="ka-badge-wrap">${a.badges.map(b => `<span class="ka-badge ${b.c}">${b.t}</span>`).join('')}</div>
        </div>
        <div class="ka-addr-body">
          <div class="ka-addr-val">${keys[a.key]}</div>
          <div class="ka-addr-desc">${a.desc}</div>
        </div>
      </div>`).join('');

    ADDRS.forEach(a => {
      const card = document.getElementById('b02-s23-card-' + a.key);
      card.addEventListener('click', () => {
        if (activeCard === a.key) {
          activeCard = null;
          card.classList.remove('active');
        } else {
          if (activeCard) document.getElementById('b02-s23-card-' + activeCard).classList.remove('active');
          activeCard = a.key;
          card.classList.add('active');
        }
      });
    });
    setTimeout(() => { activeCard = 'segwit'; document.getElementById('b02-s23-card-segwit').classList.add('active'); }, 200);
  }

  function generate() {
    if (generated) return;
    document.getElementById('b02-s23-btn-gen').disabled = true;
    const priv = rh(64);
    const keys = deriveAll(priv);
    const privEl = document.getElementById('b02-s23-priv');
    const pubEl  = document.getElementById('b02-s23-pub');
    let c1 = 0;
    const t1 = setInterval(() => {
      privEl.textContent = rh(64); c1++;
      if (c1 >= 15) {
        clearInterval(t1);
        privEl.textContent = priv;
        privEl.className   = 'ka-node-val priv';
        setTimeout(() => {
          let c2 = 0;
          const t2 = setInterval(() => {
            pubEl.textContent = rh(66); c2++;
            if (c2 >= 10) {
              clearInterval(t2);
              pubEl.textContent = keys.pub;
              pubEl.className   = 'ka-node-val pub';
              setTimeout(() => {
                renderAddrs(keys);
                document.getElementById('b02-s23-hint-bottom').style.display = 'block';
                generated = true;
              }, 300);
            }
          }, 80);
        }, 300);
      }
    }, 80);
  }

  function resetKa() {
    generated  = false;
    activeCard = null;
    document.getElementById('b02-s23-priv').textContent      = 'Click Generate...';
    document.getElementById('b02-s23-priv').className        = 'ka-node-val';
    document.getElementById('b02-s23-pub').textContent       = 'Waiting...';
    document.getElementById('b02-s23-pub').className         = 'ka-node-val';
    document.getElementById('b02-s23-addr-grid').innerHTML   = '<div class="ka-placeholder">Addresses will appear after Generate.</div>';
    document.getElementById('b02-s23-hint-bottom').style.display = 'none';
    document.getElementById('b02-s23-btn-gen').disabled      = false;
  }

  const genBtn   = document.getElementById('b02-s23-btn-gen');
  const resetBtn = document.getElementById('b02-s23-btn-reset');
  if (genBtn)   genBtn.addEventListener('click', generate);
  if (resetBtn) resetBtn.addEventListener('click', resetKa);
})();

// PAGE 5 · BAB 2 · 2.4 SIMULATION (Seed Phrase)
// ============================================================
(function() {
  const WORDS = [
    'abandon','ability','able','about','above','absent','absorb','abstract','absurd','abuse',
    'access','accident','account','accuse','achieve','acid','acoustic','acquire','across','act',
    'action','actor','actual','adapt','add','addict','address','adjust','admit','adult',
    'advance','advice','afford','afraid','again','age','agent','agree','ahead','aim',
    'airport','aisle','alarm','album','alcohol','alert','alien','all','alley','allow',
    'almost','alone','alpha','already','also','alter','always','amateur','amazing','among',
    'amount','amused','analyst','anchor','ancient','anger','angle','angry','animal','another',
    'answer','antenna','antique','anxiety','any','apart','apology','appear','apple','approve',
    'april','arch','arctic','area','arena','argue','arm','armed','armor','army',
    'around','arrange','arrest','arrive','arrow','artist','artwork','ask','aspect','assault',
    'assist','assume','asthma','athlete','atom','attack','attend','attitude','attract','auction',
    'audit','august','aunt','author','auto','autumn','average','avocado','avoid','awake',
    'aware','away','awesome','awful','awkward','axis','baby','balance','bamboo','banana',
    'banner','barely','bargain','barrel','base','basic','basket','battle','beach','bean',
    'beauty','because','become','beef','before','begin','behave','behind','believe','below',
    'belt','bench','benefit','best','betray','better','between','beyond','bicycle','bid',
    'bike','bind','biology','bird','birth','bitter','black','blade','blame','blanket',
    'blast','bleak','bless','blind','blood','blossom','blouse','blue','blur','blush',
    'board','boat','body','boil','bomb','bone','book','boost','border','boring',
  ];

  const B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

  function xorshift(s) {
    s = (s || 1) >>> 0;
    s ^= s << 13; s = s >>> 0;
    s ^= s >> 17;
    s ^= s << 5;  s = s >>> 0;
    return s;
  }

  function deriveAddr(seed, idx) {
    let s = idx * 0x9e3779b9 >>> 0;
    for (let i = 0; i < seed.length; i++) {
      s ^= seed.charCodeAt(i) * (i + 1);
      s = xorshift(s);
    }
    let r = 'bc1q';
    for (let i = 0; i < 39; i++) { s = xorshift(s); r += B32[s % 32]; }
    return r;
  }

  let wordCount   = 12;
  let generated   = false;
  let currentSeed = '';

  function renderGrid(words) {
    const grid = document.getElementById('b02-s24-grid');
    if (!grid) return;
    grid.style.gridTemplateColumns = wordCount === 24 ? 'repeat(4,1fr)' : 'repeat(3,1fr)';
    grid.innerHTML = Array.from({length: wordCount}, (_, i) => `
      <div class="sp-word" id="b02-s24-w-${i}">
        <span class="sp-word-num">${String(i+1).padStart(2,'0')}</span>
        <span class="sp-word-text placeholder" id="b02-s24-wt-${i}">${words ? words[i] : '...'}</span>
      </div>`
    ).join('');
  }

  async function generate() {
    if (generated) return;
    document.getElementById('b02-s24-btn-gen').disabled = true;
    document.getElementById('b02-s24-warning').classList.remove('show');
    document.getElementById('b02-s24-derive').classList.remove('show');

    const picked = [];
    let s = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    for (let i = 0; i < wordCount; i++) {
      s = xorshift(s);
      picked.push(WORDS[s % WORDS.length]);
    }
    currentSeed = picked.join(' ');

    renderGrid(null);
    for (let i = 0; i < wordCount; i++) {
      const box  = document.getElementById('b02-s24-w-' + i);
      const text = document.getElementById('b02-s24-wt-' + i);
      if (!box || !text) continue;
      box.classList.add('flickering');
      let fc = 0;
      await new Promise(resolve => {
        const t = setInterval(() => {
          let rs = xorshift(Date.now() + i * 13 + fc * 7);
          text.textContent = WORDS[rs % WORDS.length];
          text.classList.remove('placeholder');
          fc++;
          if (fc >= 5) {
            clearInterval(t);
            text.textContent = picked[i];
            box.classList.remove('flickering');
            box.classList.add('done');
            resolve();
          }
        }, 60);
      });
      await new Promise(r => setTimeout(r, 30));
    }

    document.getElementById('b02-s24-warning').classList.add('show');
    document.getElementById('b02-s24-addr-1').textContent = deriveAddr(currentSeed, 0);
    document.getElementById('b02-s24-addr-2').textContent = deriveAddr(currentSeed, 1);
    document.getElementById('b02-s24-addr-3').textContent = deriveAddr(currentSeed, 2);
    document.getElementById('b02-s24-derive').classList.add('show');

    generated = true;
    document.getElementById('b02-s24-btn-gen').disabled = false;
  }

  function resetSP() {
    generated   = false;
    currentSeed = '';
    renderGrid(null);
    document.getElementById('b02-s24-warning').classList.remove('show');
    document.getElementById('b02-s24-derive').classList.remove('show');
    document.getElementById('b02-s24-btn-gen').disabled = false;
  }

  function setCount(n) {
    wordCount = n;
    document.getElementById('b02-s24-btn-12').className = 'sp-toggle-btn' + (n===12?' active':'');
    document.getElementById('b02-s24-btn-24').className = 'sp-toggle-btn' + (n===24?' active':'');
    resetSP();
  }

  const btn12  = document.getElementById('b02-s24-btn-12');
  const btn24  = document.getElementById('b02-s24-btn-24');
  const btnGen = document.getElementById('b02-s24-btn-gen');
  const btnRst = document.getElementById('b02-s24-btn-reset');

  if (btn12)  btn12.addEventListener('click',  () => setCount(12));
  if (btn24)  btn24.addEventListener('click',  () => setCount(24));
  if (btnGen) btnGen.addEventListener('click', generate);
  if (btnRst) btnRst.addEventListener('click', resetSP);

  renderGrid(null);
})();

// ============================================================
// PAGE 5 · BAB 2 · 2.5 SIMULATION (Jenis-jenis Wallet)
// ============================================================
(function() {
  const WALLETS = [
    {
      icon:'📱', name:'Mobile Wallet', type:'Hot Wallet',
      badges:[{t:'Hot',c:'hot'},{t:'For beginners',c:'best'}],
      meters:[
        {l:'Security',    f:35, v:'Medium',      c:'sec'},
        {l:'Convenience', f:95, v:'Very high',   c:'con'},
        {l:'Cost',        f:5,  v:'Free',        c:'cst'},
        {l:'Speed',       f:95, v:'Instant',     c:'spd'},
      ],
      desc:'A wallet app that runs on your phone. The private key is stored in the device’s memory and ready to use anytime. The most common choice for everyday use.',
      pros:['Easy to use','Free','Fast access anytime','Good for small transactions'],
      cons:['Vulnerable to malware','Lost if the phone breaks without a backup','Less safe for large amounts'],
      use:'Suited for daily transactions and small amounts. Like the wallet in your pocket, not a safe.',
    },
    {
      icon:'🖥️', name:'Desktop Wallet', type:'Hot Wallet',
      badges:[{t:'Hot',c:'hot'}],
      meters:[
        {l:'Security',    f:50, v:'Decent',  c:'sec'},
        {l:'Convenience', f:75, v:'High',    c:'con'},
        {l:'Cost',        f:5,  v:'Free',    c:'cst'},
        {l:'Speed',       f:80, v:'Fast',    c:'spd'},
      ],
      desc:'A wallet app installed on a computer. Usually has more complete features than a mobile wallet, but still connected to the internet while the computer is online.',
      pros:['More complete features','Bigger screen','Free','Full control over keys'],
      cons:['Vulnerable if the computer is infected','Can’t be carried around','Risk of loss without a backup'],
      use:'Suited for users who want more control without hardware cost. Safer than mobile if the computer is kept clean.',
    },
    {
      icon:'🔑', name:'Hardware Wallet', type:'Cold Wallet',
      badges:[{t:'Cold',c:'cold'},{t:'Most secure',c:'best'}],
      meters:[
        {l:'Security',    f:97, v:'Very high',   c:'sec'},
        {l:'Convenience', f:55, v:'Decent',      c:'con'},
        {l:'Cost',        f:70, v:'Paid',        c:'cst'},
        {l:'Speed',       f:50, v:'Needs setup', c:'spd'},
      ],
      desc:'A dedicated physical device that stores the private key inside an isolated chip. The private key never leaves the device, even when signing a transaction.',
      pros:['Private key never goes online','Resistant to digital attacks','Backup via seed phrase','Good for large amounts'],
      cons:['Need to buy the device','Less practical for quick transactions','Need to back up the seed phrase'],
      use:'Suited for storing large amounts long-term. Like a safe at home, not a daily wallet.',
    },
    {
      icon:'📄', name:'Paper Wallet', type:'Cold Wallet',
      badges:[{t:'Cold',c:'cold'},{t:'Simplest',c:'warn'}],
      meters:[
        {l:'Security',    f:80, v:'High (if protected)', c:'sec'},
        {l:'Convenience', f:15, v:'Low',                c:'con'},
        {l:'Cost',        f:2,  v:'Almost zero',        c:'cst'},
        {l:'Speed',       f:10, v:'Slow',               c:'spd'},
      ],
      desc:'The private key and seed phrase are printed or written on paper, then kept in a safe place. Nothing can hack it digitally because it isn’t digital at all.',
      pros:['Can’t be hacked online','Almost zero cost','No special device needed'],
      cons:['Vulnerable to physical damage','Can burn or get wet','Hard to transact','Needs extra physical security'],
      use:'Suited for very long-term backup. Needs extra physical protection such as lamination or fireproof storage.',
    },
  ];

  let activeWt = null;

  function renderWallets() {
    const grid = document.getElementById('b02-s25-grid');
    if (!grid) return;
    grid.innerHTML = WALLETS.map((w, i) => `
      <div class="wt-card" id="b02-s25-wtc-${i}">
        <div class="wt-card-head">
          <div class="wt-head-left">
            <span class="wt-icon">${w.icon}</span>
            <div>
              <div class="wt-name">${w.name}</div>
              <div class="wt-type">${w.type}</div>
            </div>
          </div>
          <div class="wt-badges">${w.badges.map(b => `<span class="wt-badge ${b.c}">${b.t}</span>`).join('')}</div>
        </div>
        <div class="wt-card-body">
          <div class="wt-meters">${w.meters.map(m => `
            <div>
              <div class="wt-meter-label">${m.l}</div>
              <div class="wt-meter-track"><div class="wt-meter-fill ${m.c}" style="width:${m.f}%"></div></div>
              <div class="wt-meter-val">${m.v}</div>
            </div>`).join('')}
          </div>
          <div class="wt-desc">${w.desc}</div>
          <div class="wt-pros-cons">
            <div class="wt-pros">
              <div class="wt-pc-label">Pros</div>
              ${w.pros.map(p => `<div class="wt-pc-item">${p}</div>`).join('')}
            </div>
            <div class="wt-cons">
              <div class="wt-pc-label">Cons</div>
              ${w.cons.map(c => `<div class="wt-pc-item">${c}</div>`).join('')}
            </div>
          </div>
          <div class="wt-usecase"><strong>Recommendation:</strong> ${w.use}</div>
        </div>
      </div>`).join('');

    WALLETS.forEach((_, i) => {
      const card = document.getElementById('b02-s25-wtc-' + i);
      if (!card) return;
      card.addEventListener('click', () => {
        if (activeWt === i) {
          activeWt = null;
          card.classList.remove('active');
        } else {
          if (activeWt !== null) {
            const prev = document.getElementById('b02-s25-wtc-' + activeWt);
            if (prev) prev.classList.remove('active');
          }
          activeWt = i;
          card.classList.add('active');
        }
      });
    });

    // Auto-expand hardware wallet
    setTimeout(() => {
      activeWt = 2;
      const hw = document.getElementById('b02-s25-wtc-2');
      if (hw) hw.classList.add('active');
    }, 200);
  }

  renderWallets();
})();
// ============================================================
// PAGE 5 · BAB 2 · 2.6 SIMULATION (Custodial vs Non-Custodial)
// ============================================================
(function() {
  const SCENARIOS = [
    {
      cust: [
        { dot:'bad',  text:'The Mt. Gox exchange is breached by hackers.',     sub:'2014' },
        { dot:'bad',  text:'850.000 BTC of customer funds vanish instantly.',  sub:'Nothing can be done' },
        { dot:'bad',  text:'Withdrawals frozen without notice.',               sub:'Customers don’t know why' },
        { dot:'bad',  text:'Legal proceedings drag on for more than 10 years.', sub:'Most of the funds never came back' },
      ],
      non: [
        { dot:'ok', text:'You hold your own private key.',                     sub:'The private key isn’t on Mt. Gox’s servers' },
        { dot:'ok', text:'Hackers can’t touch your wallet.',                  sub:'No access to your private key' },
        { dot:'ok', text:'Your Bitcoin is completely safe.',                   sub:'Not affected at all' },
      ],
      verdict:'😱 Custodial Mt. Gox users lost an average of 6,5 BTC each. Non-custodial users lost nothing because their private keys were never on the exchange’s servers.',
    },
    {
      cust: [
        { dot:'bad',  text:'FTX used customer funds for speculation.',          sub:'Through its affiliate Alameda Research' },
        { dot:'bad',  text:'FTX collapsed within 72 hours.',                    sub:'November 2022' },
        { dot:'bad',  text:'More than 8 billion dollars of customer funds vanished.', sub:'Over 1 million users affected' },
        { dot:'warn', text:'Bankruptcy proceedings begin.',                     sub:'When and how much will be refunded is unclear' },
      ],
      non: [
        { dot:'ok', text:'You hold your own private key.',                      sub:'The Bitcoin never entered FTX’s wallet' },
        { dot:'ok', text:'The FTX collapse doesn’t affect your wallet.',       sub:'The private key exists only on your device' },
        { dot:'ok', text:'You can transact as usual.',                          sub:'The Bitcoin network doesn’t care that FTX went bankrupt' },
      ],
      verdict:'😱 Sam Bankman-Fried, FTX’s founder, was sentenced to 25 years in prison. But customer funds can’t simply come back. Non-custodial users were unaffected because their Bitcoin was never handed to FTX.',
    },
    {
      cust: [
        { dot:'warn', text:'The government orders the exchange to block your account.', sub:'Could be due to regulation, sanctions, or other reasons' },
        { dot:'bad',  text:'The exchange complies within hours.',                    sub:'They have no choice' },
        { dot:'bad',  text:'You can’t log in, can’t withdraw.',                  sub:'There’s nothing you can do' },
        { dot:'bad',  text:'Your Bitcoin is stuck with no idea until when.',          sub:'Legal proceedings can take years' },
      ],
      non: [
        { dot:'ok', text:'The private key is in your hands, not at the exchange.',      sub:'No entity can seize it digitally' },
        { dot:'ok', text:'No one can block a valid transaction.',                       sub:'The Bitcoin network knows no central authority' },
        { dot:'ok', text:'You can still send and receive Bitcoin.',                     sub:'As long as you have the private key, you have access' },
      ],
      verdict:'🔒 Custodial wallets comply with the laws of the jurisdiction where they operate. That means your account can be frozen anytime there’s an order from the authorities. A non-custodial wallet can’t be frozen digitally because the private key exists only in your hands.',
    },
  ];

  let activeScenario = null;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function showScenario(idx) {
    if (activeScenario === idx) return;
    activeScenario = idx;

    [0,1,2].forEach(i => {
      const pill = document.getElementById('b02-s26-pill-' + i);
      if (pill) pill.className = 'cv-pill' + (i === idx ? ' active' : '');
    });

    const s       = SCENARIOS[idx];
    const custTl  = document.getElementById('b02-s26-cust-tl');
    const nonTl   = document.getElementById('b02-s26-non-tl');
    const verdict = document.getElementById('b02-s26-verdict');
    const compare = document.getElementById('b02-s26-compare');
    if (!custTl || !nonTl || !verdict || !compare) return;

    custTl.innerHTML  = '';
    nonTl.innerHTML   = '';
    verdict.className = 'cv-verdict';
    verdict.innerHTML = '';

    function renderEvents(container, events) {
      container.innerHTML = events.map((e, i) => `
        <div class="cv-event" id="${container.id}-ev-${i}">
          <div class="cv-event-dot ${e.dot}"></div>
          <div class="cv-event-text">${e.text}<span>${e.sub}</span></div>
        </div>`).join('');
    }

    renderEvents(custTl, s.cust);
    renderEvents(nonTl,  s.non);
    compare.classList.add('show');

    for (let i = 0; i < s.cust.length; i++) {
      await sleep(300);
      const el = document.getElementById(custTl.id + '-ev-' + i);
      if (el) el.classList.add('show');
    }
    for (let i = 0; i < s.non.length; i++) {
      await sleep(300);
      const el = document.getElementById(nonTl.id + '-ev-' + i);
      if (el) el.classList.add('show');
    }

    await sleep(400);
    verdict.className = 'cv-verdict danger show';
    verdict.innerHTML = s.verdict;
  }

  function resetCV() {
    activeScenario = null;
    [0,1,2].forEach(i => {
      const pill = document.getElementById('b02-s26-pill-' + i);
      if (pill) pill.className = 'cv-pill';
    });
    const compare = document.getElementById('b02-s26-compare');
    const verdict = document.getElementById('b02-s26-verdict');
    if (compare) compare.classList.remove('show');
    if (verdict) { verdict.className = 'cv-verdict'; verdict.innerHTML = ''; }
  }

  [0,1,2].forEach(i => {
    const pill = document.getElementById('b02-s26-pill-' + i);
    if (pill) pill.addEventListener('click', () => showScenario(i));
  });
  const resetBtn = document.getElementById('b02-s26-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetCV);
})();

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

// ============================================================
// PAGE 7 · BAB 4 · TOPBAR & BACK EVENTS
// ============================================================
document.getElementById('back-home-b4').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b4').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 7 · BAB 4 · SUB-BAB NAVIGATION
// ============================================================
function showSectionInContentB4(sectionId, sbId) {
  document.querySelectorAll('#page-bab4 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab4 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab4-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
  // Redraw canvas simulasi jika section 4.5 dibuka
  if (sectionId === 'section-4-5') {
    requestAnimationFrame(() => {
      const c = document.getElementById('b04-s45-canvas');
      if (c) c.dispatchEvent(new Event('mt-redraw'));
    });
  }
}

// tombol nav Bab 4
document.querySelectorAll('#page-bab4 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB4(target, sb);
  });
});

// ============================================================
// PAGE 7 · BAB 4 · SIDEBAR EVENTS (4.1 - 4.6)
// ============================================================
document.getElementById('sb-4-1').addEventListener('click', () => showSectionInContentB4('section-4-1', 'sb-4-1'));
document.getElementById('sb-4-2').addEventListener('click', () => showSectionInContentB4('section-4-2', 'sb-4-2'));
document.getElementById('sb-4-3').addEventListener('click', () => showSectionInContentB4('section-4-3', 'sb-4-3'));
document.getElementById('sb-4-4').addEventListener('click', () => showSectionInContentB4('section-4-4', 'sb-4-4'));
document.getElementById('sb-4-5').addEventListener('click', () => showSectionInContentB4('section-4-5', 'sb-4-5'));
document.getElementById('sb-4-6').addEventListener('click', () => showSectionInContentB4('section-4-6', 'sb-4-6'));

// PAGE 7 · BAB 4 · 4.1 SIMULATION (Hash Playground + Hash Comparison)
// ============================================================
(function() {
  async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function diffCount(a, b) {
    let d = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i] !== b[i]) d++; }
    return d;
  }

  function highlightDiff(a, b) {
    return a.split('').map((c, i) =>
      b[i] !== c ? `<span style="background:#534AB7;color:#fff;border-radius:2px;padding:0 1px">${c}</span>` : c
    ).join('');
  }

  let lastHash = '';
  let debounceTimer = null;

  async function updateHash(val) {
    const hashEl  = document.getElementById('b04-s41-hash');
    const lenEl   = document.getElementById('b04-s41-len');
    const avBody  = document.getElementById('b04-s41-av-body');
    if (!hashEl || !lenEl || !avBody) return;

    lenEl.textContent = val.length;

    if (!val) {
      hashEl.textContent = 'Type something to see its hash...';
      hashEl.className   = 'hp-hash-val hp-hash-empty';
      lastHash = '';
      avBody.innerHTML = '<div style="font-size:12px;color:#52524C;">Type something above to see a comparison with a version that differs by one letter.</div>';
      updateComparison('');
      return;
    }

    const hash = await sha256(val);

    if (hash !== lastHash && lastHash) {
      hashEl.classList.add('changed');
      setTimeout(() => hashEl.classList.remove('changed'), 600);
    }

    hashEl.textContent = hash;
    hashEl.className   = 'hp-hash-val';
    lastHash = hash;

    // Avalanche demo
    const altVal  = val.slice(0, -1) + String.fromCharCode(val.charCodeAt(val.length - 1) + 1);
    const altHash = await sha256(altVal);
    const diff    = diffCount(hash, altHash);
    const pct     = Math.round(diff / 64 * 100);
    const shared  = val.slice(0, -1);
    const origC   = val.slice(-1);
    const altC    = altVal.slice(-1);

    avBody.innerHTML = `
      <div class="hp-av-row">
        <div class="hp-av-input">"${shared}<span>${origC}</span>"</div>
        <div class="hp-av-hash a">${highlightDiff(hash, altHash)}</div>
      </div>
      <div class="hp-av-row">
        <div class="hp-av-input">"${shared}<span>${altC}</span>" <span style="font-size:10px;color:#52524C;">(1 character different)</span></div>
        <div class="hp-av-hash b">${highlightDiff(altHash, hash)}</div>
      </div>
      <div class="hp-av-diff">
        <strong>${diff} of 64 characters different</strong> (${pct}%), one small change, the hash changes by almost half.
      </div>`;

    updateComparison(val);
  }

  // Hash comparison — SHA-256 dan SHA-256d via Web Crypto, Hash160 via RIPEMD-160 RFC 2286
  function ripemd160(msgBytes) {
    function rotl(x,n){return((x<<n)|(x>>>(32-n)))>>>0;}
    function f(x,y,z){return(x^y^z)>>>0;}
    function g(x,y,z){return((x&y)|(~x&z))>>>0;}
    function h(x,y,z){return((x|~y)^z)>>>0;}
    function i(x,y,z){return((x&z)|(y&~z))>>>0;}
    function j(x,y,z){return(x^(y|~z))>>>0;}
    const msg=Array.from(msgBytes),origLen=msg.length;
    msg.push(0x80);
    while(msg.length%64!==56)msg.push(0x00);
    const bl=origLen*8;
    for(let k=0;k<4;k++)msg.push((bl>>>(k*8))&0xff);
    for(let k=0;k<4;k++)msg.push(0x00);
    let h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0;
    const KL=[0x00000000,0x5A827999,0x6ED9EBA1,0x8F1BBCDC,0xA953FD4E];
    const KR=[0x50A28BE6,0x5C4DD124,0x6D703EF3,0x7A6D76E9,0x00000000];
    const RL=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
    const RR=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
    const SL=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
    const SR=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
    for(let blk=0;blk<msg.length;blk+=64){
      const W=[];
      for(let t=0;t<16;t++)W[t]=(msg[blk+t*4])|(msg[blk+t*4+1]<<8)|(msg[blk+t*4+2]<<16)|(msg[blk+t*4+3]<<24);
      let al=h0,bl2=h1,cl=h2,dl=h3,el=h4,ar=h0,br=h1,cr=h2,dr=h3,er=h4;
      for(let t=0;t<80;t++){
        const r=Math.floor(t/16);
        const FL=[f,g,h,i,j][r],FR=[j,i,h,g,f][r];
        let tl=(rotl((al+FL(bl2,cl,dl)+W[RL[t]]+KL[r])>>>0,SL[t])+el)>>>0;
        al=el;el=dl;dl=rotl(cl,10)>>>0;cl=bl2;bl2=tl;
        let tr=(rotl((ar+FR(br,cr,dr)+W[RR[t]]+KR[r])>>>0,SR[t])+er)>>>0;
        ar=er;er=dr;dr=rotl(cr,10)>>>0;cr=br;br=tr;
      }
      const tmp=(h1+cl+dr)>>>0;h1=(h2+dl+er)>>>0;h2=(h3+el+ar)>>>0;
      h3=(h4+al+br)>>>0;h4=(h0+bl2+cr)>>>0;h0=tmp;
    }
    function le32(x){return[x&0xff,(x>>>8)&0xff,(x>>>16)&0xff,(x>>>24)&0xff];}
    return [...le32(h0),...le32(h1),...le32(h2),...le32(h3),...le32(h4)]
      .map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  async function updateComparison(val) {
    const el256   = document.getElementById('b04-s41-cmp-sha256');
    const el256d  = document.getElementById('b04-s41-cmp-sha256d');
    const el160   = document.getElementById('b04-s41-cmp-hash160');
    if (!val) {
      if (el256)  el256.textContent  = '—';
      if (el256d) el256d.textContent = '—';
      if (el160)  el160.textContent  = '—';
      return;
    }
    // SHA-256 via Web Crypto (akurat)
    const buf1 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
    const h1   = Array.from(new Uint8Array(buf1)).map(b=>b.toString(16).padStart(2,'0')).join('');
    // SHA-256d: SHA-256 lagi dari hasil pertama
    const buf2 = await crypto.subtle.digest('SHA-256', new Uint8Array(buf1));
    const h1d  = Array.from(new Uint8Array(buf2)).map(b=>b.toString(16).padStart(2,'0')).join('');
    // Hash160: RIPEMD-160 dari hasil SHA-256 (RFC 2286)
    const h160 = ripemd160(new Uint8Array(buf1));
    if (el256)  el256.textContent  = h1;
    if (el256d) el256d.textContent = h1d;
    if (el160)  el160.textContent  = h160;
  }

  const inp = document.getElementById('b04-s41-input');
  if (inp) {
    inp.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => updateHash(this.value), 80);
    });
  }

  for (let i = 0; i <= 5; i++) {
    const btn = document.getElementById('b04-s41-pr-' + i);
    if (btn) btn.addEventListener('click', () => {
      const input = document.getElementById('b04-s41-input');
      if (input) { input.value = btn.getAttribute('data-text'); updateHash(input.value); }
    });
  }
})();


// PAGE 7 · BAB 4 · 4.2 SIMULATION (Elliptic Curve)
// ============================================================
(function() {
  const canvas = document.getElementById('b04-s42-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const isDark = matchMedia('(prefers-color-scheme: dark)').matches;

  const BG     = isDark ? '#1A1A18' : '#F4F4F0';
  const CURVE  = isDark ? '#3C3489' : '#C4B5FD';
  const GRID   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const GCOL   = '#3B6D11';
  const PUBCOL = '#534AB7';
  const PTCOL  = '#534AB7';
  const LINECOL= isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)';

  function curveY(x) {
    const y2 = x*x*x - x + 1;
    return y2 >= 0 ? Math.sqrt(y2) : NaN;
  }

  let W, H, cx, cy, scale;
  function setup() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width * dpr; H = 300 * dpr;
    canvas.width = W; canvas.height = H;
    cx = W*0.5; cy = H*0.5; scale = W*0.10;
  }
  function toCanvas(x, y) { return [cx + x*scale, cy - y*scale]; }

  const XS = [-2.2,-1.8,-1.2,-0.5,0.2,0.8,1.4,1.9,2.3,
               -2.0,-1.5,-0.8,0.0,0.6,1.1,1.7,2.1,
               -1.9,-1.3,-0.6,0.3,0.9,1.5,2.0,
               -2.1,-1.6,-0.9,0.1,0.7,1.2,1.8,2.2];

  function getPoints(k) {
    const pts = [];
    for (let i = 0; i < k; i++) {
      const x  = XS[i % XS.length];
      const yv = curveY(x);
      if (isNaN(yv) || yv === 0) continue;
      const sign = (Math.floor(i * 1.618) % 2 === 0) ? 1 : -1;
      pts.push([x, sign * yv]);
    }
    // Fallback: pastikan minimal 1 titik selalu ada
    if (pts.length === 0) pts.push([-1.2, curveY(-1.2)]);
    return pts;
  }

  function xorshift(s) {
    s = (s || 1) >>> 0;
    s ^= s << 13; s = s >>> 0;
    s ^= s >> 17;
    s ^= s << 5;  s = s >>> 0;
    return s;
  }

  function coordToHex(x, y, bytes) {
    let s = ((Math.abs(x) * 1e6) ^ (Math.abs(y) * 1e4) * 137) >>> 0;
    s = s || 0xdeadbeef;
    let hex = '';
    for (let i = 0; i < bytes; i++) {
      s = xorshift(s ^ (i * 0x9e3779b9));
      hex += (s & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }

  function draw(k) {
    setup();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12*dpr); ctx.fill();

    ctx.strokeStyle = GRID; ctx.lineWidth = 0.5;
    for (let x=-4;x<=4;x++){const[px]=toCanvas(x,0);ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.stroke();}
    for (let y=-3;y<=3;y++){const[,py]=toCanvas(0,y);ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(W,py);ctx.stroke();}

    ctx.strokeStyle=isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)'; ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(toCanvas(-4,0)[0],cy);ctx.lineTo(toCanvas(4,0)[0],cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,toCanvas(0,-3)[1]);ctx.lineTo(cx,toCanvas(0,3)[1]);ctx.stroke();

    ctx.strokeStyle=CURVE; ctx.lineWidth=2;
    for (const sign of [1,-1]) {
      ctx.beginPath(); let first=true;
      for (let xi=-240;xi<=240;xi++){
        const x=xi/80, yv=curveY(x);
        if(isNaN(yv)){first=true;continue;}
        const[px,py]=toCanvas(x,sign*yv);
        if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);
      }
      ctx.stroke();
    }

    const pts = getPoints(k);

    ctx.strokeStyle=LINECOL; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    for(let i=0;i<pts.length-1;i++){
      const[x1,y1]=toCanvas(pts[i][0],pts[i][1]);
      const[x2,y2]=toCanvas(pts[i+1][0],pts[i+1][1]);
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    }
    ctx.setLineDash([]);

    for(let i=1;i<pts.length-1;i++){
      const[px,py]=toCanvas(pts[i][0],pts[i][1]);
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
      ctx.fillStyle=PTCOL;ctx.globalAlpha=0.35;ctx.fill();ctx.globalAlpha=1;
    }

    if (pts.length === 0) return;

    const[gx,gy]=toCanvas(pts[0][0],pts[0][1]);
    ctx.beginPath();ctx.arc(gx,gy,7,0,Math.PI*2);
    ctx.fillStyle=GCOL;ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font=`500 ${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('G',gx,gy);
    ctx.fillStyle=GCOL;
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='left';ctx.textBaseline='bottom';
    ctx.fillText('G (starting point)',gx+10*dpr,gy-6*dpr);

    const last=pts[pts.length-1];
    const[lx,ly]=toCanvas(last[0],last[1]);
    ctx.beginPath();ctx.arc(lx,ly,9,0,Math.PI*2);
    ctx.fillStyle=PUBCOL;ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font=`500 ${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('P',lx,ly);

    const labelSide=lx>W*0.72?'right':'left';
    ctx.fillStyle=isDark?'#C4B5FD':'#534AB7';
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign=labelSide;ctx.textBaseline='bottom';
    ctx.fillText('Public key',lx+(labelSide==='right'?-12:12)*dpr,ly-6*dpr);

    ctx.fillStyle=isDark?'rgba(196,181,253,0.6)':'rgba(83,74,183,0.5)';
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='right';ctx.textBaseline='top';
    ctx.fillText(`${k} jumps`,W-8*dpr,8*dpr);

    const px=last[0], py=last[1];
    const privEl  = document.getElementById('b04-s42-priv');
    const coordEl = document.getElementById('b04-s42-coord');
    const pubEl   = document.getElementById('b04-s42-pub');
    const subEl   = document.getElementById('b04-s42-pub-sub');
    const noteEl  = document.getElementById('b04-s42-note');

    if (privEl)  privEl.textContent  = `${k} jumps`;
    if (coordEl) coordEl.textContent = `(${px.toFixed(6)},  ${py.toFixed(6)})`;

    const prefix = py >= 0 ? '02' : '03';
    const xHex   = coordToHex(px, py, 32);
    if (pubEl) pubEl.innerHTML = `<span class="ecc-prefix">${prefix}</span>${xHex}`;

    const sign = py >= 0 ? 'positive' : 'negative';
    if (subEl) subEl.innerHTML =
      `Prefix <span class="ecc-prefix">${prefix}</span> because y is ${sign} (${py.toFixed(4)}). ` +
      `Only the x coordinate is stored in hex. The recipient can recompute y from x and this prefix.`;

    if (noteEl) noteEl.textContent = k === 1
      ? 'Private key = 1. The final point is G itself.'
      : `Private key = ${k}. From this public key, there’s no way to find how many jumps were made. Try adding or subtracting 1 — the entire public key changes completely.`;
  }

  let k = 7;
  draw(k);

  const slider = document.getElementById('b04-s42-slider');
  if (slider) slider.addEventListener('input', function() {
    k = +this.value;
    const kEl = document.getElementById('b04-s42-k');
    if (kEl) kEl.textContent = k;
    draw(k);
  });

  window.addEventListener('resize', () => draw(k));
})();

// PAGE 7 · BAB 4 · 4.3 SIMULATION (ECDSA)
// ============================================================
(function() {
  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function strSeed(str){let s=0x811c9dc5;for(let i=0;i<str.length;i++){s^=str.charCodeAt(i);s=Math.imul(s,0x01000193)>>>0;}return s;}

  let state={msg:'',priv:'',nonce:'',sig:'',pub:'',origMsg:'',origSig:'',signed:false};

  function g(id){return document.getElementById(id);}

  function resetAll(){
    state={msg:'',priv:'',nonce:'',sig:'',pub:'',origMsg:'',origSig:'',signed:false};
    const msgEl=g('b04-s43-msg');if(msgEl)msgEl.value='Send 0.05 BTC to bc1q...3f8a';
    const wrap=g('b04-s43-sign-wrap');if(wrap)wrap.style.display='none';
    ['b04-s43-priv','b04-s43-nonce','b04-s43-sig','b04-s43-v-sig','b04-s43-v-pub'].forEach(id=>{const el=g(id);if(el)el.textContent='—';});
    const vm=g('b04-s43-v-msg');if(vm)vm.textContent='Complete Stage 1 first.';
    const tm=g('b04-s43-t-msg-val');if(tm)tm.textContent='Complete Stage 1 first.';
    const ts=g('b04-s43-t-sig-val');if(ts)ts.textContent='—';
    const vr=g('b04-s43-v-result');if(vr)vr.className='ec-result';
    const tr=g('b04-s43-t-result');if(tr)tr.className='ec-result';
  }

  function sign(){
    const msgEl=g('b04-s43-msg');
    if(!msgEl) return;
    const msg=msgEl.value.trim();
    if(!msg) return;
    const seed=strSeed(msg+Date.now());
    const priv=makeHex(seed,32);
    const nonce=makeHex(xorshift(seed),32);
    const pub='02'+makeHex(xorshift(seed^0xabcdef),32);
    const rs=strSeed(msg+priv+nonce);
    const r=makeHex(rs,32);
    const s=makeHex(xorshift(rs),32);
    const sig=r+s;
    state={msg,priv,nonce,sig,pub,origMsg:msg,origSig:sig,signed:true};
    const privEl=g('b04-s43-priv');if(privEl)privEl.textContent=priv;
    const nonceEl=g('b04-s43-nonce');if(nonceEl)nonceEl.textContent=nonce;
    const sigEl=g('b04-s43-sig');if(sigEl)sigEl.textContent=sig;
    const wrap=g('b04-s43-sign-wrap');if(wrap)wrap.style.display='block';
    const vm=g('b04-s43-v-msg');if(vm)vm.textContent=msg;
    const vs=g('b04-s43-v-sig');if(vs)vs.textContent=sig;
    const vp=g('b04-s43-v-pub');if(vp)vp.textContent=pub;
    const vr=g('b04-s43-v-result');if(vr)vr.className='ec-result';
    const tm=g('b04-s43-t-msg-val');if(tm)tm.textContent=msg;
    const ts=g('b04-s43-t-sig-val');if(ts)ts.textContent=sig;
    const tr=g('b04-s43-t-result');if(tr)tr.className='ec-result';
  }

  function verify(msgId,sigId,resultId){
    const el=g(resultId);if(!el)return;
    if(!state.signed){
      el.className='ec-result bad show';
      el.textContent='No signature yet. Complete Stage 1 first.';
      return;
    }
    const msgEl=g(msgId);const sigEl=g(sigId);
    if(!msgEl||!sigEl)return;
    const ok=(msgEl.textContent===state.origMsg)&&(sigEl.textContent===state.origSig);
    el.className='ec-result show '+(ok?'ok':'bad');
    el.textContent=ok
      ?'✓ Signature valid. The message was not modified and the signature matches the sender’s public key. The network accepts this transaction.'
      :'✗ Signature invalid. The message or signature has been modified. The network rejects this transaction instantly.';
  }

  // Tamper buttons
  const tMsg=g('b04-s43-t-msg');
  if(tMsg)tMsg.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-msg-val');if(el)el.textContent=state.origMsg.replace('0.05','0.50');
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tAddr=g('b04-s43-t-addr');
  if(tAddr)tAddr.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-msg-val');if(el)el.textContent=state.origMsg.replace('bc1q...3f8a','bc1q...9z99');
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tSig=g('b04-s43-t-sig');
  if(tSig)tSig.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-sig-val');if(el)el.textContent='ff'+state.origSig.slice(2);
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tReset=g('b04-s43-t-reset');
  if(tReset)tReset.addEventListener('click',()=>{
    if(!state.signed)return;
    const m=g('b04-s43-t-msg-val');if(m)m.textContent=state.origMsg;
    const s=g('b04-s43-t-sig-val');if(s)s.textContent=state.origSig;
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });

  // Tab switching
  [1,2,3].forEach(i=>{
    const tab=g('b04-s43-tab-'+i);
    if(tab)tab.addEventListener('click',()=>{
      [1,2,3].forEach(j=>{
        const t=g('b04-s43-tab-'+j);const p=g('b04-s43-panel-'+j);
        if(t)t.className='ec-step-tab'+(j===i?' active':'');
        if(p)p.className='ec-panel'+(j===i?' show':'');
      });
    });
  });

  const btnSign=g('b04-s43-btn-sign');
  const btnReset=g('b04-s43-btn-reset');
  const btnVerify=g('b04-s43-btn-verify');
  const btnTV=g('b04-s43-btn-t-verify');

  // DER encoding builder
  function buildDER(sig, pub) {
    if (!sig || sig.length < 128) return null;
    const r = sig.slice(0, 64);
    const s = sig.slice(64, 128);
    // DER format: 0x30 [total-len] 0x02 [r-len] [r] 0x02 [s-len] [s]
    // Prefix 00 if high bit set (ambiguity prevention)
    const rPadded = parseInt(r.slice(0,2),16) >= 0x80 ? '00'+r : r;
    const sPadded = parseInt(s.slice(0,2),16) >= 0x80 ? '00'+s : s;
    const rLen = (rPadded.length/2).toString(16).padStart(2,'0');
    const sLen = (sPadded.length/2).toString(16).padStart(2,'0');
    const inner = '02'+rLen+rPadded+'02'+sLen+sPadded;
    const totalLen = (inner.length/2).toString(16).padStart(2,'0');
    const der = '30'+totalLen+inner;
    const derWithSighash = der + '01'; // SIGHASH_ALL
    return { r, s, rPadded, sPadded, rLen, sLen, der, derWithSighash, pub };
  }

  function renderDER(d) {
    if (!d) return 'Sign the transaction in Stage 1 first.';
    return `<span class="raw-comment">// ECDSA signature in DER (Distinguished Encoding Rules) format</span>
<span class="raw-comment">// This is what goes into the scriptSig or witness field of a Bitcoin transaction</span>

<span class="raw-comment">// DER structure:</span>
<span class="raw-key">30</span>                    <span class="raw-comment">// marker: this is a DER sequence</span>
<span class="raw-key">${(d.der.length/2-1).toString(16).padStart(2,'0')}</span>                    <span class="raw-comment">// total length: ${d.der.length/2-1} bytes</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (the r value)</span>
  <span class="raw-key">${d.rLen}</span>                  <span class="raw-comment">// r length: ${parseInt(d.rLen,16)} bytes${d.rPadded.length>64?' (prefixed with 00 because the high bit is set)':''}</span>
  <span class="raw-num">${d.rPadded}</span>  <span class="raw-comment">// r</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (the s value)</span>
  <span class="raw-key">${d.sLen}</span>                  <span class="raw-comment">// s length: ${parseInt(d.sLen,16)} bytes${d.sPadded.length>64?' (prefixed with 00 because the high bit is set)':''}</span>
  <span class="raw-num">${d.sPadded}</span>  <span class="raw-comment">// s</span>
<span class="raw-key">01</span>                    <span class="raw-comment">// SIGHASH_ALL: the signature covers the entire transaction</span>

<span class="raw-comment">// Final result (DER + sighash flag):</span>
<span class="raw-str">${d.derWithSighash}</span>

<span class="raw-comment">// Public key (compressed, 33 bytes):</span>
<span class="raw-str">${d.pub ? d.pub.slice(0,66) : '—'}</span>

<span class="raw-comment">// Both go into the witness field (SegWit) or scriptSig (Legacy).</span>
<span class="raw-comment">// Total signature size: ~${Math.round(d.derWithSighash.length/2)} bytes</span>
<span class="raw-comment">// Note: each ECDSA signature differs in size (71-73 bytes)</span>
<span class="raw-comment">// because r and s may or may not require 0x00 padding.</span>`;
  }

  const rawBtn43   = g('b04-s43-raw-btn');
  const rawPanel43 = g('b04-s43-raw-panel');
  const rawBody43  = g('b04-s43-raw-body');
  let rawOpen43 = false;
  let lastDER   = null;

  function updateRaw43() {
    if (rawOpen43 && rawBody43) rawBody43.innerHTML = renderDER(lastDER);
  }

  if (rawBtn43) rawBtn43.addEventListener('click', () => {
    rawOpen43 = !rawOpen43;
    rawBtn43.classList.toggle('active', rawOpen43);
    rawBtn43.innerHTML = rawOpen43
      ? '<span class="raw-toggle-icon">{}</span> Hide Raw Data'
      : '<span class="raw-toggle-icon">{}</span> View Raw Data';
    if (rawOpen43 && rawPanel43) { rawPanel43.classList.add('show'); updateRaw43(); }
    else if (rawPanel43) rawPanel43.classList.remove('show');
  });

  // Hook ke sign function — update DER setiap kali sign
  const origSign43 = sign;
  function signWithRaw() {
    origSign43();
    // Ambil sig dan pub yang baru di-set
    setTimeout(() => {
      const sigEl = g('b04-s43-sig');
      const pubEl = g('b04-s43-v-pub');
      if (sigEl && pubEl) {
        lastDER = buildDER(sigEl.textContent, pubEl.textContent);
        updateRaw43();
      }
    }, 50);
  }

  if(btnSign)  btnSign.addEventListener('click', signWithRaw);
  if(btnReset) btnReset.addEventListener('click', () => { resetAll(); lastDER=null; updateRaw43(); });
  if(btnVerify)btnVerify.addEventListener('click',()=>verify('b04-s43-v-msg','b04-s43-v-sig','b04-s43-v-result'));
  if(btnTV)    btnTV.addEventListener('click',()=>verify('b04-s43-t-msg-val','b04-s43-t-sig-val','b04-s43-t-result'));
})();

// PAGE 7 · BAB 4 · 4.4 SIMULATION (Schnorr)
// ============================================================
(function() {
  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function short(hex){return hex.slice(0,8)+'...';}

  function currentSigners(){
    const sl=document.getElementById('b04-s44-signers');
    return sl ? parseInt(sl.value,10) : 3;
  }
  function buildTxs(){
    const n=currentSigners();
    return [
      {label:'Tx #1', signers:1, amount:'0.050 BTC'},
      {label:'Tx #2', signers:n, amount:'0.320 BTC'},
      {label:'Tx #3', signers:2, amount:'1.200 BTC'},
    ];
  }  // Real sizes: ECDSA DER is 71-72 bytes per signature, Schnorr stays 64 bytes
  // no matter how many signers, because MuSig aggregates them into one.
  const SIG_ECDSA = 72, SIG_SCHNORR = 64, FEE_RATE = 20; // sat/vB
  const MAX_SIGNERS = 15;

  function fmtSat(n){ return n.toLocaleString('en-US'); }

  function renderAgg(){
    const sl = document.getElementById('b04-s44-signers');
    if(!sl) return;
    const n = parseInt(sl.value, 10);
    const eBytes = n * SIG_ECDSA;
    const sBytes = SIG_SCHNORR;
    const maxBytes = MAX_SIGNERS * SIG_ECDSA;

    const lbl = document.getElementById('b04-s44-signers-val');
    if(lbl) lbl.textContent = n + ' of ' + n;

    const be = document.getElementById('b04-s44-bar-e');
    const bs = document.getElementById('b04-s44-bar-s');
    if(be) be.style.width = Math.max(2, (eBytes / maxBytes) * 100) + '%';
    if(bs) bs.style.width = Math.max(2, (sBytes / maxBytes) * 100) + '%';

    const ve = document.getElementById('b04-s44-val-e');
    const vs = document.getElementById('b04-s44-val-s');
    if(ve) ve.textContent = n + ' sig \u00b7 ' + eBytes + ' bytes';
    if(vs) vs.textContent = '1 sig \u00b7 ' + sBytes + ' bytes';

    const v = document.getElementById('b04-s44-verdict');
    if(v){
      if(n === 1){
        v.innerHTML = 'With a single signer the gap is thin: <b>72 bytes against 64</b>. Drag right to see what happens as signers are added.';
      } else {
        const saved = eBytes - sBytes;
        const feeSaved = Math.round(saved / 4) * FEE_RATE; // witness gets a 4x discount
        v.innerHTML = 'ECDSA stores <b>' + n + ' separate signatures</b>, so the size grows with them. Schnorr collapses those ' + n + ' signatures into <b>one</b>, and stays at 64 bytes. That saves <b>' + saved + ' bytes</b>, or roughly <b>' + fmtSat(feeSaved) + ' satoshis</b> at a 20 sat/vB fee rate. And because the result is just one signature, nobody can tell this transaction involved ' + n + ' people.';
      }
    }
    render();
  }


  function render(){
    const eBody=document.getElementById('b04-s44-e-body');
    const sBody=document.getElementById('b04-s44-s-body');
    if(!eBody||!sBody) return;
    eBody.innerHTML=''; sBody.innerHTML='';

    buildTxs().forEach((tx,ti)=>{
      const txid=short(makeHex((ti+1)*0x1234abcd,16));
      const inp =short(makeHex((ti+1)*0xdeadbeef,16));
      const sigs=[];
      for(let i=0;i<tx.signers;i++) sigs.push(short(makeHex((ti*10+i+1)*0xcafe1234,32)));
      const aggSig=short(makeHex((ti+1)*0x9a8b7c6d,32));

      // ECDSA card
      let eSigRows='';
      sigs.forEach((s,i)=>{eSigRows+=`<div class="sc-tx-row"><span class="sc-tx-key">sig[${i+1}]</span><span class="sc-tx-val red">${s}</span></div>`;});
      const eBadge=tx.signers>1
        ?`<span class="sc-tx-head-badge multi">multisig ${tx.signers}×</span>`
        :`<span class="sc-tx-head-badge single">1 signature</span>`;
      eBody.innerHTML+=`
        <div class="sc-tx e">
          <div class="sc-tx-head e"><span class="sc-tx-head-id">${tx.label} · ${txid}</span>${eBadge}</div>
          <div class="sc-tx-body">
            <div class="sc-tx-row"><span class="sc-tx-key">input</span><span class="sc-tx-val">${inp}</span></div>
            <hr class="sc-tx-divider">
            ${eSigRows}
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">amount</span><span class="sc-tx-val">${tx.amount}</span></div>
          </div>
        </div>`;

      // Schnorr card
      sBody.innerHTML+=`
        <div class="sc-tx s">
          <div class="sc-tx-head s"><span class="sc-tx-head-id">${tx.label} · ${txid}</span><span class="sc-tx-head-badge unknown">1 signature</span></div>
          <div class="sc-tx-body">
            <div class="sc-tx-row"><span class="sc-tx-key">input</span><span class="sc-tx-val">${inp}</span></div>
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">sig</span><span class="sc-tx-val purple">${aggSig}</span></div>
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">amount</span><span class="sc-tx-val">${tx.amount}</span></div>
          </div>
        </div>`;
    });

    const eObs=document.getElementById('b04-s44-e-obs');
    const sObs=document.getElementById('b04-s44-s-obs');
    const note=document.getElementById('b04-s44-note');
    const _n = currentSigners();
    if(eObs) eObs.innerHTML='🔍 In ECDSA: Tx #1 is clearly 1 person, Tx #2 is clearly a '+_n+'-person multisig, Tx #3 is clearly a 2-person multisig. <strong>Anyone can analyze the ownership pattern.</strong>';
    if(sObs) sObs.innerHTML='🔒 In Schnorr: all three transactions look identical, each with only 1 signature. <strong>No one can tell which is 1 person and which is '+_n+'.</strong>';
    if(note) note.textContent='On the Bitcoin blockchain today with Taproot, a multisig transaction using MuSig looks exactly the same as an ordinary transaction. An observer can’t tell them apart — they all look like an ordinary 1-signature transaction.';
  }

  const _sl = document.getElementById('b04-s44-signers');
  if(_sl) _sl.addEventListener('input', renderAgg);
  renderAgg();
})();

// PAGE 7 · BAB 4 · 4.5 SIMULATION (Merkle Tree)
// ============================================================
(function() {
  const canvas = document.getElementById('b04-s45-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isDark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG    = isDark ? '#1A1A18' : '#F4F4F0';
  const COL   = isDark ? '#2A2A28' : '#FAFAF8';
  const BORD  = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.15)';
  const TXT2  = isDark ? '#A0A098' : '#3A3A35';
  const HI    = '#534AB7';
  const HIL   = isDark ? 'rgba(83,74,183,0.3)' : '#EEEDFE';
  const SIB   = isDark ? '#3A3830' : '#F4F4F0';
  const GREEN = '#3B6D11';
  const GREENL= isDark ? 'rgba(59,109,17,0.25)' : '#EAF3DE';

  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function short(h){return h.slice(0,6)+'...';}
  function combineHash(a,b){const seed=parseInt(a.slice(0,8),16)^parseInt(b.slice(0,8),16);return makeHex(seed*0x9e3779b9,16);}

  const TX_COUNT = 8;
  const txHashes = Array.from({length:TX_COUNT},(_,i)=>makeHex((i+1)*0xdeadbeef,16));

  const levels = [txHashes];
  let cur = txHashes;
  while(cur.length > 1){
    const next=[];
    for(let i=0;i<cur.length;i+=2) next.push(combineHash(cur[i],cur[i+1]));
    levels.push(next); cur=next;
  }

  let selectedTx = null;

  function setup(){
    const dpr  = window.devicePixelRatio||1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width*dpr;
    canvas.height = 340*dpr;
    ctx.scale(dpr,dpr);
    return {W:rect.width, H:340};
  }

  function getPositions(W){
    const pos=[];
    const LEVEL_Y=[280,200,130,60];
    const NODE_W=70, NODE_H=28;
    levels.forEach((level,li)=>{
      const n=level.length;
      const total=n*NODE_W+(n-1)*16;
      const startX=(W-total)/2;
      pos.push(level.map((hash,i)=>({
        x:startX+i*(NODE_W+16), y:LEVEL_Y[li]-NODE_H/2,
        w:NODE_W, h:NODE_H, hash, li, i
      })));
    });
    return pos;
  }

  function getMerkleProof(txIdx){
    const proof=[];
    let idx=txIdx;
    for(let li=0;li<levels.length-1;li++){
      const sibIdx=idx%2===0?idx+1:idx-1;
      if(sibIdx<levels[li].length) proof.push({hash:levels[li][sibIdx],level:li,sibIdx});
      idx=Math.floor(idx/2);
    }
    return proof;
  }

  function getProofNodeIds(txIdx){
    const ids=new Set();
    ids.add(`0-${txIdx}`);
    let idx=txIdx;
    for(let li=0;li<levels.length-1;li++){
      const sibIdx=idx%2===0?idx+1:idx-1;
      if(sibIdx<levels[li].length) ids.add(`${li}-${sibIdx}`);
      idx=Math.floor(idx/2);
      ids.add(`${li+1}-${idx}`);
    }
    return ids;
  }

  function draw(sel){
    const {W,H}=setup();
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const pos=getPositions(W);
    const proofIds=sel!==null?getProofNodeIds(sel):new Set();

    // Lines
    for(let li=0;li<levels.length-1;li++){
      for(let i=0;i<levels[li].length;i++){
        const node=pos[li][i];
        const parent=pos[li+1][Math.floor(i/2)];
        const onPath=proofIds.has(`${li}-${i}`)&&proofIds.has(`${li+1}-${Math.floor(i/2)}`);
        ctx.beginPath();
        ctx.moveTo(node.x+node.w/2, node.y);
        ctx.lineTo(parent.x+parent.w/2, parent.y+parent.h);
        ctx.strokeStyle=onPath?HI:(isDark?'rgba(255,255,255,0.1)':'rgba(124,58,237,0.1)');
        ctx.lineWidth=onPath?1.5:0.5;
        ctx.stroke();
      }
    }

    // Nodes
    for(let li=0;li<levels.length;li++){
      for(let i=0;i<levels[li].length;i++){
        const n=pos[li][i];
        const key=`${li}-${i}`;
        const isLeaf   =li===0;
        const isTarget =sel!==null&&li===0&&i===sel;
        const isSibling=sel!==null&&proofIds.has(key)&&!isTarget&&li<levels.length-1;
        const isParent =sel!==null&&proofIds.has(key)&&li>0&&li<levels.length-1;
        const isRoot   =li===levels.length-1;
        const onPath   =proofIds.has(key);

        let fillColor=COL, strokeColor=BORD, strokeW=0.5;
        if(isTarget)       {fillColor=HI;    strokeColor=HI;    strokeW=1.5;}
        else if(isSibling) {fillColor=SIB;   strokeColor=isDark?'rgba(255,255,255,0.15)':BORD;}
        else if(isParent)  {fillColor=HIL;   strokeColor=HI;    strokeW=1;}
        else if(isRoot)    {fillColor=GREENL;strokeColor=GREEN; strokeW=1;}
        else if(isLeaf)    {fillColor=isDark?'#2D2A45':'#EEEDFE'; strokeColor='#7C5CFC'; strokeW=1.5;}

        ctx.fillStyle=fillColor; ctx.strokeStyle=strokeColor; ctx.lineWidth=strokeW;
        ctx.beginPath(); ctx.roundRect(n.x,n.y,n.w,n.h,6); ctx.fill(); ctx.stroke();

        const label=li===0?`Tx${i+1}`:li===levels.length-1?'Root':`H${li}${i}`;
        ctx.fillStyle=isTarget?'#fff':isRoot?GREEN:(isLeaf&&!isTarget?'#7C5CFC':(onPath?HI:TXT2));
        ctx.font=`600 10px sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label, n.x+n.w/2, n.y+10);
        ctx.fillStyle=isTarget?'rgba(255,255,255,0.85)':(isLeaf?'rgba(124,92,252,0.7)':(isDark?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.35)'));
        ctx.font=`9px monospace`;
        ctx.fillText(short(n.hash), n.x+n.w/2, n.y+21);
      }
    }

    if(sel===null){
      ctx.fillStyle=isDark?'rgba(124,92,252,0.6)':'rgba(83,74,183,0.5)';
      ctx.font=`11px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillText('↑ Click one of the Txs (bottom row) to see its Merkle Proof', W/2, H-10);

      // Legend kecil di kanan bawah
      const lx=W-12, ly=H-30;
      ctx.fillStyle=isDark?'#2D2A45':'#EEEDFE';
      ctx.strokeStyle='#7C5CFC'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(lx-60,ly,58,20,4); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#7C5CFC'; ctx.font=`500 9px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('Tx = clickable', lx-31, ly+10);
    }
  }

  function showProof(txIdx){
    const proof=getMerkleProof(txIdx);
    const proofEl=document.getElementById('b04-s45-proof');
    const bodyEl =document.getElementById('b04-s45-proof-body');
    const titleEl=document.getElementById('b04-s45-proof-title');
    if(!proofEl||!bodyEl||!titleEl) return;
    titleEl.textContent=`Tx${txIdx+1} · ${short(txHashes[txIdx])}`;
    let html=`
      <div class="mt-proof-row">
        <span class="mt-proof-tag target">Target</span>
        <span class="mt-proof-val">${txHashes[txIdx]}</span>
      </div>`;
    proof.forEach(p=>{
      html+=`
        <div class="mt-proof-row">
          <span class="mt-proof-tag sibling">Sibling L${p.level}</span>
          <span class="mt-proof-val">${p.hash}</span>
        </div>`;
    });
    html+=`
      <div class="mt-proof-row">
        <span class="mt-proof-tag root">Merkle Root</span>
        <span class="mt-proof-val">${levels[levels.length-1][0]}</span>
      </div>
      <div class="mt-proof-note">
        With these ${proof.length} hashes, anyone can recompute the path from Tx${txIdx+1} to the Root and verify that this transaction is in the block — without needing to see the other ${TX_COUNT-proof.length-1} transactions.
      </div>`;
    bodyEl.innerHTML=html;
    proofEl.classList.add('show');
  }

  canvas.addEventListener('mousemove', function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    const pos=getPositions(rect.width);
    const leaves=pos[0];
    let onLeaf=false;
    for(let i=0;i<leaves.length;i++){
      const n=leaves[i];
      if(mx>=n.x&&mx<=n.x+n.w&&my>=n.y&&my<=n.y+n.h){onLeaf=true;break;}
    }
    canvas.style.cursor=onLeaf?'pointer':'default';
  });

  canvas.addEventListener('mouseleave', function(){
    canvas.style.cursor='default';
  });

  canvas.addEventListener('click', function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    const pos=getPositions(rect.width);
    const leaves=pos[0];
    for(let i=0;i<leaves.length;i++){
      const n=leaves[i];
      if(mx>=n.x&&mx<=n.x+n.w&&my>=n.y&&my<=n.y+n.h){
        if(selectedTx===i){
          selectedTx=null;
          const proofEl=document.getElementById('b04-s45-proof');
          if(proofEl) proofEl.classList.remove('show');
          draw(null);
        } else {
          selectedTx=i;
          showProof(i);
          draw(i);
        }
        return;
      }
    }
  });

  draw(null);
  window.addEventListener('resize', ()=>draw(selectedTx));

  // Fix: render saat section pertama kali dibuka
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => { requestAnimationFrame(() => draw(selectedTx)); });
    ro.observe(canvas);
  }
  canvas.addEventListener('mt-redraw', () => draw(selectedTx));
  requestAnimationFrame(() => draw(selectedTx));

  // Raw data toggle
  const rawBtn45   = document.getElementById('b04-s45-raw-btn');
  const rawPanel45 = document.getElementById('b04-s45-raw-panel');
  const rawBody45  = document.getElementById('b04-s45-raw-body');
  let rawOpen45 = false;

  function buildRaw45(txIdx) {
    const merkleRoot = levels[levels.length-1][0];
    const proof      = getMerkleProof(txIdx);
    const txid       = txHashes[txIdx];
    // Simulasi block header fields
    const blockHash  = makeHex(0xcafe1234 * (txIdx+1), 32);
    const prevHash   = makeHex(0xdeadbeef, 32);
    const txidLE     = txid.match(/.{2}/g).reverse().join(''); // little-endian
    const rootLE     = merkleRoot.match(/.{2}/g).reverse().join('');

    const proofLines = proof.map((p,i) =>
      `  "${p.hash}" <span class="raw-comment">// sibling level ${p.level}</span>`
    ).join(',\n');

    return `<span class="raw-comment">// bitcoin-cli getblockheader "${blockHash.slice(0,16)}..."</span>
{
  <span class="raw-key">"hash"</span>: <span class="raw-str">"${blockHash}"</span>,
  <span class="raw-key">"version"</span>: <span class="raw-num">536870912</span>,
  <span class="raw-key">"previousblockhash"</span>: <span class="raw-str">"${prevHash}"</span>,
  <span class="raw-key">"merkleroot"</span>: <span class="raw-str">"${rootLE}"</span>, <span class="raw-comment">// little-endian, as in the block header</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">1713000000</span>,
  <span class="raw-key">"bits"</span>: <span class="raw-str">"1703a30c"</span>,
  <span class="raw-key">"nonce"</span>: <span class="raw-num">3850463748</span>,
  <span class="raw-key">"ntx"</span>: <span class="raw-num">${TX_COUNT}</span>
}

<span class="raw-comment">// Selected Tx: Tx${txIdx+1}</span>
<span class="raw-key">"txid"</span>: <span class="raw-str">"${txidLE}"</span> <span class="raw-comment">// little-endian TXID</span>

<span class="raw-comment">// Merkle Proof to verify Tx${txIdx+1}:</span>
<span class="raw-comment">// With these ${proof.length} hashes + TXID, anyone can recompute</span>
<span class="raw-comment">// the Merkle Root and prove Tx${txIdx+1} is in this block.</span>
[
${proofLines}
]

<span class="raw-comment">// Computed Merkle Root: "${merkleRoot}"</span>
<span class="raw-comment">// Matches the merkleroot in the block header? ${merkleRoot.match(/.{2}/g).reverse().join('') === rootLE ? '✓ Yes' : '✓ Yes'}</span>`;
  }

  function updateRaw45() {
    if (!rawOpen45 || !rawBody45) return;
    if (selectedTx === null) {
      rawBody45.innerHTML = 'Click one of the Txs to see the Merkle Root and Merkle Proof in raw format.';
    } else {
      rawBody45.innerHTML = buildRaw45(selectedTx);
    }
  }

  if (rawBtn45) rawBtn45.addEventListener('click', () => {
    rawOpen45 = !rawOpen45;
    rawBtn45.classList.toggle('active', rawOpen45);
    rawBtn45.innerHTML = rawOpen45
      ? '<span class="raw-toggle-icon">{}</span> Hide Raw Data'
      : '<span class="raw-toggle-icon">{}</span> View Raw Data';
    if (rawOpen45 && rawPanel45) { rawPanel45.classList.add('show'); updateRaw45(); }
    else if (rawPanel45) rawPanel45.classList.remove('show');
  });

  // Update raw setiap kali Tx dipilih — hook ke canvas click
  const origCanvasClick = canvas.onclick;
  canvas.addEventListener('click', () => {
    setTimeout(() => updateRaw45(), 50);
  });
})();

// PAGE 7 · BAB 4 · 4.6 SIMULATION (System Map)
// ============================================================
(function() {
  const COMPONENTS = [
    {
      id:'hash', name:'Hash Function (SHA-256)', color:'purple', tag:'Integrity',
      role:'Keeps the chain of blocks tamper-proof',
      protects:'Blockchain integrity',
      method:'Each block contains the hash of the previous block. Changing one old transaction means recomputing the hash of the entire chain that follows — computationally impossible.',
      without:'Without hashing, the transaction history could be manipulated by anyone.',
      usedIn:['Block header','Mining (PoW)','TXID','Bitcoin address'],
    },
    {
      id:'ecc', name:'Elliptic Curve (ECC)', color:'teal', tag:'Ownership',
      role:'Produces keypairs that can’t be forged',
      protects:'Bitcoin ownership',
      method:'The private key produces the public key through point multiplication on the curve. One-way, irreversible. Without the private key, no one can claim ownership of your UTXO.',
      without:'Without ECC, anyone could forge a claim of ownership over someone else’s Bitcoin.',
      usedIn:['Generate keypair','Basis of ECDSA','Basis of Schnorr','Bitcoin address'],
    },
    {
      id:'ecdsa', name:'ECDSA & Schnorr', color:'amber', tag:'Authorization',
      role:'Proves ownership without revealing the secret',
      protects:'The validity of every transaction',
      method:'The private key signs a transaction. The network verifies the signature using the public key without ever seeing the private key. Schnorr combines many signatures into one.',
      without:'Without digital signatures, anyone could move someone else’s Bitcoin.',
      usedIn:['Every transaction input','Multisig (MuSig)','Taproot','Bitcoin Script'],
    },
    {
      id:'merkle', name:'Merkle Tree', color:'green', tag:'Efficiency',
      role:'Enables verification without downloading all the data',
      protects:'Verification efficiency and scalability',
      method:'All transactions in a block are summarized in a single Merkle Root. To prove one transaction, you only need log₂(n) hashes, not the entire block.',
      without:'Without the Merkle Tree, a smartphone couldn’t verify transactions without downloading hundreds of GB of data.',
      usedIn:['Block header','SPV wallet','Light client','Block explorer'],
    },
  ];

  let activeId = null;

  function g(id){ return document.getElementById(id); }

  function render(){
    const grid = g('b04-s46-grid');
    if(!grid) return;
    grid.innerHTML = COMPONENTS.map(c => `
      <div class="csm-card${activeId===c.id?' active':''} ${c.color}" id="b04-s46-${c.id}">
        <div class="csm-card-top">
          <div class="csm-dot ${c.color}"></div>
          <div class="csm-name">${c.name}</div>
          <span class="csm-tag ${c.color}">${c.tag}</span>
        </div>
        <div class="csm-role">${c.role}</div>
      </div>`).join('');

    COMPONENTS.forEach(c => {
      const el = g('b04-s46-'+c.id);
      if(el) el.addEventListener('click', () => {
        if(activeId===c.id){ activeId=null; hide(); }
        else { activeId=c.id; show(c); }
        render();
      });
    });
  }

  function show(c){
    const head = g('b04-s46-detail-head');
    const body = g('b04-s46-detail-body');
    const det  = g('b04-s46-detail');
    const sum  = g('b04-s46-summary');
    if(!head||!body||!det||!sum) return;
    head.className = `csm-detail-head ${c.color}`;
    head.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block"></span>${c.name} — ${c.tag}`;
    body.innerHTML = `
      <div class="csm-detail-row">
        <span class="csm-detail-label">Protects</span>
        <span class="csm-detail-val">${c.protects}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">How it works</span>
        <span class="csm-detail-val">${c.method}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">If it didn’t exist</span>
        <span class="csm-detail-val">${c.without}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Used in</span>
        <div class="csm-chain">${c.usedIn.map(d=>`<span class="csm-chain-item">${d}</span>`).join('')}</div>
      </div>`;
    det.classList.add('show');
    sum.textContent = 'These four components work together. None of them can be removed without collapsing the entire trust system of Bitcoin.';
  }

  function hide(){
    const det = g('b04-s46-detail');
    const sum = g('b04-s46-summary');
    if(det) det.classList.remove('show');
    if(sum) sum.textContent = 'Click one of the components above to see its role in the Bitcoin system.';
  }

  render();
})();

// ============================================================
// PAGE 8 · BAB 5 · NAVIGATION
// ============================================================
function showSectionInContentB5(sectionId, sbId) {
  document.querySelectorAll('#page-bab5 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab5 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab5-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 8 · BAB 5 · TOPBAR
// ============================================================
document.getElementById('back-home-b5').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b5').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 8 · BAB 5 · SIDEBAR EVENTS (5.1 - 5.6)
// ============================================================
document.getElementById('sb-5-1').addEventListener('click', () => showSectionInContentB5('section-5-1', 'sb-5-1'));
document.getElementById('sb-5-2').addEventListener('click', () => showSectionInContentB5('section-5-2', 'sb-5-2'));
document.getElementById('sb-5-3').addEventListener('click', () => showSectionInContentB5('section-5-3', 'sb-5-3'));
document.getElementById('sb-5-4').addEventListener('click', () => showSectionInContentB5('section-5-4', 'sb-5-4'));
document.getElementById('sb-5-5').addEventListener('click', () => showSectionInContentB5('section-5-5', 'sb-5-5'));
document.getElementById('sb-5-6').addEventListener('click', () => showSectionInContentB5('section-5-6', 'sb-5-6'));

// ============================================================
// PAGE 8 · BAB 5 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab5 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB5(target, sb);
  });
});

// ============================================================
// PAGE 8 · BAB 5 · 5.1 SIMULATION (Konsensus)
// ============================================================
(function() {
  const canvas = document.getElementById('b05-s51-canvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG   = dark ? '#1A1A18' : '#F4F4F0';
  const LINE = dark ? 'rgba(124,92,252,0.3)' : 'rgba(83,74,183,0.2)';
  const PURP = '#534AB7';
  const RED  = '#A32D2D';
  const TXT2 = dark ? '#A0A098' : '#3A3A35';
  const NR   = 15;

  function polygon(n, cx, cy, r) {
    return Array.from({length:n}, (_,i) => {
      const a = (i/n)*Math.PI*2 - Math.PI/2;
      return {x: cx + r*Math.cos(a), y: cy + r*Math.sin(a)};
    });
  }

  function drawNode(x, y, label, color, pulse) {
    const rr = NR + (pulse||0);
    ctx.fillStyle = color===PURP ? (dark?'rgba(83,74,183,0.2)':'#EEEDFE') : (dark?'rgba(163,45,45,0.2)':'#FCEBEB');
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x,y,rr,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.font = '500 9px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  }

  function drawDashed(x1,y1,x2,y2) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.strokeStyle='rgba(163,45,45,0.3)'; ctx.lineWidth=0.8;
    ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }

  const SCENARIOS = {
    t1: { main:8, outsiders:[], note:'✅ All nodes form one consensus and move together.', ok:true },
    t2: { main:7, outsiders:[{label:'N8'}], note:'⚠️ 1 node refuses and leaves the consensus. The rest keep going together.', ok:false },
    t3: { main:6, outsiders:[{label:'N7'},{label:'N8'}], note:'⚠️ 2 nodes separate and form their own fork chain. Two different networks.', ok:false },
  };

  let active = 't1';
  let animT  = 0;

  function draw() {
    const dpr = window.devicePixelRatio||1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = 300;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const sc = SCENARIOS[active];
    const cx = W*0.55, cy = H/2 - 8;
    const r  = Math.min(W,H)*0.27;
    const pulse = 0.7*Math.sin(animT*0.04);
    const pts = polygon(sc.main, cx, cy, r);

    // Edges konsensus
    pts.forEach((p,i) => {
      const j=(i+1)%pts.length;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pts[j].x,pts[j].y);
      ctx.strokeStyle=LINE; ctx.lineWidth=1; ctx.stroke();
    });

    // Node konsensus
    pts.forEach((p,i) => drawNode(p.x,p.y,`N${i+1}`,PURP,pulse));

    const out = sc.outsiders;
    const leftmost = pts.reduce((b,p)=>p.x<b.x?p:b, pts[0]);

    if (out.length === 1) {
      const ox = cx - r*1.75, oy = cy;
      drawDashed(leftmost.x - NR - 2, leftmost.y, ox + NR + 4, oy);
      drawNode(ox, oy, out[0].label, RED);
      ctx.fillStyle=RED; ctx.font='9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText('leaves', ox, oy+NR+4);
    } else if (out.length === 2) {
      const ox = cx - r*1.75, oy1 = cy - 22, oy2 = cy + 22;
      ctx.beginPath(); ctx.moveTo(ox,oy1); ctx.lineTo(ox,oy2);
      ctx.strokeStyle='rgba(163,45,45,0.35)'; ctx.lineWidth=1; ctx.stroke();
      drawDashed(leftmost.x - NR - 2, leftmost.y, ox + NR + 4, (oy1+oy2)/2);
      drawNode(ox, oy1, out[0].label, RED);
      drawNode(ox, oy2, out[1].label, RED);
      ctx.fillStyle=RED; ctx.font='9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText('fork', ox, oy2+NR+4);
    }

    ctx.fillStyle=TXT2; ctx.font='10px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText('Consensus', W/2, H-8);
  }

  function animate(){animT++;draw();requestAnimationFrame(animate);}

  function setScenario(id){
    active=id;
    ['t1','t2','t3'].forEach(t=>{
      const btn=document.getElementById('b05-s51-'+t);
      if(!btn)return;
      btn.className='cs-tab'+(t!=='t1'?' cs-fork':'')+(t===id?' active':'');
    });
    const sc=SCENARIOS[id];
    const el=document.getElementById('b05-s51-result');
    if(el){el.textContent=sc.note;el.className='cs-result '+(sc.ok?'ok':'fork');}
  }

  ['t1','t2','t3'].forEach(t=>{
    const btn=document.getElementById('b05-s51-'+t);
    if(btn) btn.addEventListener('click',()=>setScenario(t));
  });

  setScenario('t1');
  animate();
  if(typeof ResizeObserver!=='undefined') new ResizeObserver(()=>requestAnimationFrame(()=>draw())).observe(canvas);
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.1 FORK SIMULATION (Soft fork vs Hard fork)
// ============================================================
(function() {
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark ? '#1A1A18' : '#F8F8F6';
  const PURP = '#534AB7';
  const GRAY = dark ? '#6A6A68' : '#52524C';
  const RED  = '#A32D2D';
  const TXT  = dark ? '#A0A098' : '#3A3A35';

  function setupCanvas(id) {
    const c = document.getElementById(id);
    if (!c) return null;
    const dpr = window.devicePixelRatio||1;
    const w   = c.getBoundingClientRect().width || 200;
    const h   = 220;
    c.width   = w*dpr; c.height = h*dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr,dpr);
    return {ctx, w, h};
  }

  function drawBlock(ctx, x, y, color) {
    const bw=22, bh=15;
    ctx.fillStyle = color===PURP?(dark?'rgba(83,74,183,0.25)':'#EEEDFE')
                  : color===RED ?(dark?'rgba(163,45,45,0.25)':'#FCEBEB')
                  : (dark?'rgba(100,100,100,0.2)':'#F0EFEA');
    ctx.strokeStyle=color; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.roundRect(x-bw/2,y-bh/2,bw,bh,3); ctx.fill(); ctx.stroke();
  }

  function drawChain(ctx, n, y, color, startX, gap) {
    for(let i=0;i<n;i++){
      const x=startX+i*gap;
      if(i>0){
        ctx.beginPath(); ctx.moveTo(x-gap+11,y); ctx.lineTo(x-11,y);
        ctx.strokeStyle=color; ctx.lineWidth=0.7; ctx.stroke();
      }
      drawBlock(ctx,x,y,color);
    }
  }

  function drawLabel(ctx, x, y, txt, color) {
    ctx.fillStyle=color; ctx.font='9px sans-serif';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y);
  }

  function drawSoftFork() {
    const res = setupCanvas('b05-s51-fk-soft');
    if(!res) return;
    const {ctx,w,h}=res;
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,w,h,8); ctx.fill();

    const gap=30, sx=22, sharedN=3;
    // Rantai bersama
    drawChain(ctx,sharedN,65,PURP,sx,gap);

    const splitX=sx+(sharedN-1)*gap;
    ctx.fillStyle=TXT; ctx.font='8px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('fork point',splitX,78);

    // Rantai baru — lebih panjang
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,5,newY,PURP,splitX+gap,gap);
    drawLabel(ctx,splitX+5*gap+4,newY,'new nodes (longer)',PURP);

    // Rantai lama — lebih pendek, lalu menyerah
    const oldY=150;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,oldY);
    ctx.strokeStyle=GRAY; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,2,oldY,GRAY,splitX+gap,gap);

    // X di rantai lama (abandoned)
    const ex=splitX+2*gap;
    ctx.strokeStyle=RED; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(ex-8,oldY-5); ctx.lineTo(ex+8,oldY+5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+8,oldY-5); ctx.lineTo(ex-8,oldY+5); ctx.stroke();

    // Panah menyerah ke rantai panjang
    ctx.beginPath();
    ctx.moveTo(splitX+gap,oldY-8);
    ctx.lineTo(splitX+gap+24,newY+8);
    ctx.strokeStyle=GRAY; ctx.lineWidth=0.7;
    ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);

    drawLabel(ctx,sx,185,'Longest chain wins',PURP);
    drawLabel(ctx,sx,198,'Old nodes follow unaware',TXT);
  }

  function drawHardFork() {
    const res = setupCanvas('b05-s51-fk-hard');
    if(!res) return;
    const {ctx,w,h}=res;
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,w,h,8); ctx.fill();

    const gap=30, sx=22, sharedN=3;
    drawChain(ctx,sharedN,65,PURP,sx,gap);

    const splitX=sx+(sharedN-1)*gap;
    ctx.fillStyle=TXT; ctx.font='8px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('fork point',splitX,78);

    // Rantai baru
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,newY,PURP,splitX+gap,gap);
    // Titik-titik lanjutan
    ctx.fillStyle=PURP;
    ctx.fillText('...', splitX+5*gap, newY);
    drawLabel(ctx,splitX+5*gap+8,newY,'New network',PURP);

    // Rantai lama — terus tumbuh sendiri
    const oldY=155;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,oldY);
    ctx.strokeStyle=RED; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,oldY,RED,splitX+gap,gap);
    ctx.fillStyle=RED;
    ctx.fillText('...', splitX+5*gap, oldY);
    drawLabel(ctx,splitX+5*gap+8,oldY,'Old network',RED);

    // Label tidak kompatibel
    const midX=splitX+2*gap;
    ctx.strokeStyle=dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
    ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(midX,newY+8); ctx.lineTo(midX,oldY-8); ctx.stroke();
    ctx.fillStyle=TXT; ctx.font='8px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('incompatible',midX,(newY+oldY)/2);

    drawLabel(ctx,sx,185,'Permanent split — two networks',RED);
    drawLabel(ctx,sx,198,'Example: Bitcoin Cash (2017)',TXT);
  }

  function renderForks() {
    drawSoftFork();
    drawHardFork();
  }

  renderForks();

  if(typeof ResizeObserver!=='undefined'){
    const ro=new ResizeObserver(()=>requestAnimationFrame(renderForks));
    const sc=document.getElementById('b05-s51-fk-soft');
    const hc=document.getElementById('b05-s51-fk-hard');
    if(sc) ro.observe(sc);
    if(hc) ro.observe(hc);
  }
})();

// PAGE 8 · BAB 5 · 5.2 SIMULATION (Proof of Work)
// ============================================================
(function() {
  const DATA = 'Block #882419 | prev: 000000000000 | tx: 3a7b2c...';
  let diff = 2, nonce = 0, running = false, found = false;
  let startTime = 0, attempts = 0, rafId = null;

  async function sha256(buf) {
    return crypto.subtle.digest('SHA-256', buf instanceof ArrayBuffer ? buf : buf.buffer || buf);
  }
  async function sha256d(str) {
    const enc = new TextEncoder().encode(str);
    const h1  = await crypto.subtle.digest('SHA-256', enc);
    const h2  = await crypto.subtle.digest('SHA-256', h1);
    return Array.from(new Uint8Array(h2)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function g(id){ return document.getElementById(id); }

  function renderHash(hash, zeros, isFound) {
    const el = g('b05-s52-hash');
    if (!el) return;
    if (!hash || hash === '—') { el.innerHTML = '—'; el.className = 'pw-hash'; return; }
    el.innerHTML = `<span class="pw-zero">${hash.slice(0,zeros)}</span><span class="pw-rest">${hash.slice(zeros)}</span>`;
    el.className = 'pw-hash' + (isFound ? ' found' : '');
  }

  function updateStats() {
    const elapsed = (Date.now() - startTime) / 1000;
    const speed = elapsed > 0.1 ? Math.round(attempts / elapsed) : 0;
    const attEl = g('b05-s52-attempts');
    const spEl  = g('b05-s52-speed');
    if (attEl) attEl.textContent = attempts.toLocaleString('id');
    if (spEl)  spEl.textContent  = speed > 0 ? speed.toLocaleString('id') + '/s' : '—';
  }

  async function mineStep() {
    if (!running) return;
    const BATCH = 50;
    for (let i = 0; i < BATCH; i++) {
      const hash = await sha256d(DATA + '|nonce:' + nonce);
      attempts++;
      const nonceEl = g('b05-s52-nonce');
      if (nonceEl) nonceEl.textContent = nonce.toLocaleString('id');
      const target = '0'.repeat(diff);
      if (hash.startsWith(target)) {
        running = false; found = true;
        renderHash(hash, diff, true);
        updateStats();
        const stEl = g('b05-s52-status');
        if (stEl) stEl.textContent = 'found!';
        const res = g('b05-s52-result');
        if (res) {
          res.textContent = `Nonce ${nonce.toLocaleString('id')} found after ${attempts.toLocaleString('id')} attempts (${((Date.now()-startTime)/1000).toFixed(1)}s). The hash starts with ${diff} zeros — a valid proof of work.`;
          res.className = 'pw-result show ok';
        }
        return;
      }
      renderHash(hash, diff, false);
      nonce++;
    }
    updateStats();
    rafId = requestAnimationFrame(mineStep);
  }

  function startMining() {
    if (running || found) return;
    running = true; startTime = Date.now(); attempts = 0;
    const stEl = g('b05-s52-status');
    if (stEl) stEl.textContent = 'mining...';
    const res = g('b05-s52-result');
    if (res) { res.textContent = 'Searching for a valid nonce...'; res.className = 'pw-result show running'; }
    mineStep();
  }

  function reset() {
    running = false; found = false; nonce = 0; attempts = 0;
    if (rafId) cancelAnimationFrame(rafId);
    const nonceEl = g('b05-s52-nonce');
    const hashEl  = g('b05-s52-hash');
    const attEl   = g('b05-s52-attempts');
    const spEl    = g('b05-s52-speed');
    const stEl    = g('b05-s52-status');
    const res     = g('b05-s52-result');
    if (nonceEl) nonceEl.textContent = '0';
    if (hashEl)  { hashEl.innerHTML = '—'; hashEl.className = 'pw-hash'; }
    if (attEl)   attEl.textContent = '0';
    if (spEl)    spEl.textContent = '—';
    if (stEl)    stEl.textContent = 'ready';
    if (res)     res.className = 'pw-result';
  }

  const diffEl = g('b05-s52-diff');
  if (diffEl) diffEl.addEventListener('input', function() {
    diff = +this.value;
    const label = diff === 1 ? '1 zero' : `${diff} zeros`;
    const dv = g('b05-s52-diff-val');
    const tg = g('b05-s52-target');
    if (dv) dv.textContent = label;
    if (tg) tg.textContent = '0'.repeat(diff) + '...';
    reset();
  });

  const startBtn = g('b05-s52-start');
  const resetBtn = g('b05-s52-reset');
  if (startBtn) startBtn.addEventListener('click', startMining);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  // Init target display
  const tg = g('b05-s52-target');
  if (tg) tg.textContent = '00...';
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.3 SIMULATION (Block Anatomy)
// ============================================================
(function() {
  const PREV_HASH = '000000000000000000029abc3f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2';

  const FIELDS = [
    { name:'Version', bytes:'4B', val:'00000020',
      desc:'The version of the Bitcoin software that created this block. Determines which validation rules apply.',
      note:'Rarely changes' },
    { name:'Previous block hash', bytes:'32B', val:PREV_HASH,
      desc:'The hash of the previous block. This is what connects one block to the next — that’s why it’s called a blockchain.',
      note:'What forms the chain', isChain:true },
    { name:'Merkle root', bytes:'32B', val:'7f3c1a2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      desc:'A single summary hash of all transaction hashes in this block. If one transaction changes, the merkle root changes too.',
      note:'One summary hash of all tx hashes, covered in 4.5' },
    { name:'Timestamp', bytes:'4B', val:'67a3bc14',
      desc:'The time the block was created, in Unix time format (seconds since 1 January 1970).',
      note:'Unix timestamp' },
    { name:'Bits (difficulty target)', bytes:'4B', val:'1703a30c',
      desc:'A compact representation of the current difficulty target. Determines how hard the puzzle the miner must solve is.',
      note:'Updated every 2016 blocks' },
    { name:'Nonce', bytes:'4B', val:'3850463748',
      desc:'The number the miner is searching for. The only field that changes during mining. The miner tries trillions of nonce values until a valid hash is found.',
      note:'What gets mined', isNonce:true },
  ];

  const chainHTML = `
    <div class="ba-chain-sim">
      <div class="ba-chain-block-sim">
        <div class="ba-chain-head-sim prev-sim">Previous block (#882418)</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
        <div class="ba-chain-row-sim hash-sim">hash: ${PREV_HASH.slice(0,20)}...</div>
      </div>
      <div class="ba-chain-arrow-sim">→</div>
      <div class="ba-chain-block-sim current-sim">
        <div class="ba-chain-head-sim curr-sim">This block (#882419)</div>
        <div class="ba-chain-row-sim match-sim">prev_hash: ${PREV_HASH.slice(0,20)}...</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
      </div>
    </div>
    <div class="ba-chain-note-sim">prev_hash in this block = the hash of the previous block. That’s the chain.</div>`;

  const container = document.getElementById('b05-s53-fields');
  if (!container) return;
  let activeIdx = null;

  FIELDS.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'ba-field-sim' + (f.isNonce ? ' nonce-sim' : '');
    row.id = 'b05-s53-field-' + i;
    row.innerHTML = `
      <div class="ba-field-bytes-sim">${f.bytes}</div>
      <div class="ba-field-name-sim">${f.name}<span class="ba-field-note-sim">${f.note}</span></div>
      <div class="ba-field-arrow-sim">›</div>`;

    const detail = document.createElement('div');
    detail.className = 'ba-detail-sim';
    detail.id = 'b05-s53-detail-' + i;
    detail.innerHTML = `
      <div class="ba-detail-val-sim">${f.val}</div>
      <div class="ba-detail-desc-sim">${f.desc}</div>
      ${f.isChain ? chainHTML : ''}`;

    row.addEventListener('click', () => {
      if (activeIdx === i) {
        row.classList.remove('active');
        detail.classList.remove('show');
        activeIdx = null;
      } else {
        if (activeIdx !== null) {
          const prev = document.getElementById('b05-s53-field-' + activeIdx);
          const prevD = document.getElementById('b05-s53-detail-' + activeIdx);
          if (prev) prev.classList.remove('active');
          if (prevD) prevD.classList.remove('show');
        }
        row.classList.add('active');
        detail.classList.add('show');
        activeIdx = i;
      }
    });

    container.appendChild(row);
    container.appendChild(detail);
  });
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.5 SIMULATION (Halving Chart)
// ============================================================
(function() {
  function initHalvingChart() {
    const canvas = document.getElementById('b05-s55-chart');
    if (!canvas || !window.Chart) return;

    // [fix] Supply dihitung per era halving persis seperti protokol: setiap era 210.000 block,
    // reward dalam satoshi dibagi dua (dibulatkan ke bawah) tiap era, 33 era sampai reward nol (~2140).
    const ERA_BLOCKS=210000, ERAS=33;
    const eraStart=k=>k===0?2009:2008+4*k;   // 2009, 2012, 2016, ... 2140
    const labels=[], rewards=[], supply=[];
    let minedSat=0;
    for(let k=0;k<ERAS;k++){
      const sat=Math.floor(5e9/Math.pow(2,k));
      const y0=eraStart(k), y1=eraStart(k+1);
      for(let y=y0;y<y1;y++){
        labels.push(y);
        rewards.push(sat/1e8);
        supply.push(+((minedSat+sat*ERA_BLOCKS*(y-y0)/(y1-y0))/1e8).toFixed(4));
      }
      minedSat+=sat*ERA_BLOCKS;
    }
    labels.push(eraStart(ERAS)); rewards.push(0); supply.push(+(minedSat/1e8).toFixed(4));

    const isDark=matchMedia('(prefers-color-scheme:dark)').matches;
    const gridC=isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)';
    const txtC =isDark?'#A0A098':'#3A3A35';

    new window.Chart(canvas, {
      type:'bar',
      data:{
        labels,
        datasets:[
          {
            type:'line', label:'Total supply (BTC)', data:supply,
            yAxisID:'y2', borderColor:'#3B6D11',
            backgroundColor:'rgba(59,109,17,0.07)',
            borderWidth:1.5, pointRadius:0, fill:true, tension:0.3,
            borderDash:[4,3], order:1,
          },
          {
            type:'bar', label:'Block reward (BTC)', data:rewards,
            yAxisID:'y1', backgroundColor:'#534AB7',
            borderRadius:2, borderSkipped:false,
            barPercentage:0.9, categoryPercentage:1, order:2,
          },
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        interaction:{mode:'index',intersect:false},
        plugins:{
          legend:{display:false},
          tooltip:{
            callbacks:{
              title:ctx=>'Year '+ctx[0].label,
              label:ctx=>{
                if(ctx.datasetIndex===0) return 'Supply: '+ctx.raw.toLocaleString('en-US',{maximumFractionDigits:4})+' BTC';
                return 'Reward: '+ctx.raw.toLocaleString('en-US',{maximumFractionDigits:8})+' BTC/block';
              }
            }
          },
        },
        scales:{
          x:{ticks:{color:txtC,font:{size:10},maxTicksLimit:10,autoSkip:true},grid:{color:gridC}},
          y1:{
            type:'linear',position:'left',
            title:{display:true,text:'Block reward (BTC)',color:txtC,font:{size:10}},
            ticks:{color:'#534AB7',font:{size:10}},
            grid:{color:gridC},
          },
          y2:{
            type:'linear',position:'right',
            title:{display:true,text:'Total supply (BTC)',color:txtC,font:{size:10}},
            ticks:{color:'#3B6D11',font:{size:10},callback:v=>v>=1000000?(v/1000000).toFixed(0)+'M':v},
            grid:{drawOnChartArea:false},
            max:21000000,
          },
        }
      }
    });
  }

  /* [build] Chart.js dimuat lazy: baru diunduh saat grafik 5.5 hampir terlihat. */
  (function(){
    var cv=document.getElementById('b05-s55-chart');
    if(!cv) return;
    var started=false;
    function fail(){
      console.warn('Chart.js tidak tersedia; grafik dilewati.');
      if(cv.dataset.drawn||!cv.parentNode) return;
      var p=document.createElement('div');
      p.style.cssText='font-family:Sora,sans-serif;font-size:11px;color:#854F0B;background:#FAEEDA;padding:10px 13px;border-radius:6px';
      p.textContent='The chart could not be drawn because the charting library failed to load. The rest of the page is unaffected.';
      cv.parentNode.insertBefore(p,cv);
    }
    function go(){
      if(started) return; started=true;
      if(window.Chart){ initHalvingChart(); return; }
      var s=document.createElement('script');
      s.src='assets/chart-4.4.1.umd.min.js';
      s.onload=function(){ if(window.Chart) initHalvingChart(); else fail(); };
      s.onerror=fail;
      document.head.appendChild(s);
    }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){
        for(var k=0;k<es.length;k++){ if(es[k].isIntersecting){ io.disconnect(); go(); return; } }
      },{rootMargin:'400px 0px'});
      io.observe(cv);
    } else { go(); }
  })();
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.6 SIMULATION (Serangan 51%)
// ============================================================
(function() {
  let honest=3, attack=0, running=false, forked=false, animating=false;
  let intervalId=null, pct=30;
  const MAX_SHOW=18;

  function g(id){ return document.getElementById(id); }

  function renderBlocks() {
    const hEl=g('b05-s56-honest-blocks');
    const aEl=g('b05-s56-attack-blocks');
    if(!hEl||!aEl) return;
    const shared=Math.min(3,Math.min(honest,attack));

    // Honest
    let hHtml='';
    const hStart=Math.max(0,honest-MAX_SHOW);
    if(honest>MAX_SHOW) hHtml+=`<span style="font-size:10px;color:#52524C;margin-right:4px;">+${honest-MAX_SHOW}</span>`;
    for(let i=hStart;i<honest;i++){
      const cls='at-block-sim '+(i<shared?'shared-blk':'honest-blk'+(i===shared&&attack>0?' fork-pt':''));
      hHtml+=`<div class="${cls}">${i+1}</div>`;
    }
    hEl.innerHTML=hHtml;

    // Attack
    let aHtml='';
    const aStart=Math.max(0,attack-MAX_SHOW);
    if(attack>MAX_SHOW) aHtml+=`<span style="font-size:10px;color:#52524C;margin-right:4px;">+${attack-MAX_SHOW}</span>`;
    for(let i=aStart;i<attack;i++){
      const cls='at-block-sim '+(i<shared?'shared-blk':'attack-blk'+(i===shared?' fork-pt':''));
      aHtml+=`<div id="b05-s56-ab-${i}" class="${cls}">${i+1}</div>`;
    }
    aEl.innerHTML=aHtml;

    const hl=g('b05-s56-honest-len'); if(hl) hl.textContent=honest+' block';
    const al=g('b05-s56-attack-len'); if(al) al.textContent=attack+' block';
  }

  function updateStatus() {
    const st=g('b05-s56-status');
    const fb=g('b05-s56-fork');
    if(!st) return;
    if(forked){
      st.className='at-status-sim forked-sim';
      st.textContent='✅ The hashing algorithm has been changed. The attacker’s chain is invalid. All the attacker’s ASIC hardware is instantly useless. The network is safe again.';
      if(fb) fb.style.display='none';
      return;
    }
    if(pct<50){
      st.className='at-status-sim safe-sim';
      st.textContent=`✅ The attacker (${pct}% hashrate) can’t catch up. The probability of success approaches zero the longer the honest chain gets.`;
      if(fb) fb.style.display='none';
    } else if(attack<=honest){
      st.className='at-status-sim danger-sim';
      st.textContent=`⚠️ The attacker (${pct}% hashrate) is catching up — ${honest-attack} blocks behind. A real threat.`;
      if(fb) fb.style.display='none';
    } else {
      st.className='at-status-sim attacking-sim';
      st.textContent=`🚨 Attack succeeded — the attacker’s chain is ${attack-honest} blocks longer. A double-spend can be performed.`;
      if(fb) fb.style.display='inline-flex';
    }
  }

  function step(){
    if(!running||animating) return;
    if(Math.random()*100<pct) attack++;
    else honest++;
    renderBlocks();
    updateStatus();
    if(honest>=40||attack>=40){ running=false; clearInterval(intervalId); }
  }

  async function doFork(){
    if(animating) return;
    running=false; clearInterval(intervalId);
    animating=true;
    const fb=g('b05-s56-fork');
    if(fb) fb.disabled=true;
    while(attack>0){
      const aEl=g('b05-s56-attack-blocks');
      const last=aEl?aEl.lastElementChild:null;
      if(last&&last.classList.contains('at-block-sim')) last.classList.add('dying');
      await new Promise(r=>setTimeout(r,80));
      attack--;
      renderBlocks();
      const al=g('b05-s56-attack-len');
      if(al) al.textContent=attack+' block';
    }
    forked=true; animating=false;
    updateStatus();
    if(fb){ fb.disabled=false; fb.style.display='none'; }
  }

  function reset(){
    running=false; forked=false; animating=false;
    clearInterval(intervalId);
    honest=3; attack=0;
    renderBlocks();
    const st=g('b05-s56-status');
    if(st){st.className='at-status-sim safe-sim';st.textContent='Set the attacker hashrate and click Start to see the race attack.';}
    const fb=g('b05-s56-fork');
    if(fb){fb.style.display='none';fb.disabled=false;}
  }

  const slider=g('b05-s56-slider');
  if(slider) slider.addEventListener('input',function(){
    pct=+this.value;
    const pv=g('b05-s56-pct');
    if(pv) pv.textContent=pct+'%';
    reset();
  });
  const startBtn=g('b05-s56-start');
  const forkBtn =g('b05-s56-fork');
  const resetBtn=g('b05-s56-reset');
  if(startBtn) startBtn.addEventListener('click',()=>{ if(running||animating) return; running=true; intervalId=setInterval(step,180); });
  if(forkBtn)  forkBtn.addEventListener('click',doFork);
  if(resetBtn) resetBtn.addEventListener('click',reset);

  renderBlocks();
})();

// ============================================================
// ============================================================
// PAGE 9 · BAB 6 · NAVIGATION
// ============================================================
function showSectionInContentB6(sectionId, sbId) {
  document.querySelectorAll('#page-bab6 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab6 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab6-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 9 · BAB 6 · TOPBAR
// ============================================================
document.getElementById('back-home-b6').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b6').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 9 · BAB 6 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab6').addEventListener('click', () => navigate('page-bab6'));

// ============================================================
// PAGE 9 · BAB 6 · SIDEBAR EVENTS (6.1 - 6.6)
// ============================================================
document.getElementById('sb-6-1').addEventListener('click', () => showSectionInContentB6('section-6-1', 'sb-6-1'));
document.getElementById('sb-6-2').addEventListener('click', () => showSectionInContentB6('section-6-2', 'sb-6-2'));
document.getElementById('sb-6-3').addEventListener('click', () => showSectionInContentB6('section-6-3', 'sb-6-3'));
document.getElementById('sb-6-4').addEventListener('click', () => showSectionInContentB6('section-6-4', 'sb-6-4'));
document.getElementById('sb-6-5').addEventListener('click', () => showSectionInContentB6('section-6-5', 'sb-6-5'));
document.getElementById('sb-6-6').addEventListener('click', () => showSectionInContentB6('section-6-6', 'sb-6-6'));

// ============================================================
// PAGE 9 · BAB 6 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab6 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB6(target, sb);
  });
});

// ============================================================
// PAGE 9 · BAB 6 · 6.1 SIMULATION (Stack Visualizer)
// ============================================================
(function() {
  const PURPLE = '#534AB7', WHITE = '#ffffff';

  const SCRIPTS = [
    {label:'Simple addition', tokens:[
      {t:'1',       type:'data', desc:'Push the number 1 onto the stack.', fn(s){s.push('1');}},
      {t:'2',       type:'data', desc:'Push the number 2 onto the stack.', fn(s){s.push('2');}},
      {t:'OP_ADD',  type:'op',   desc:'Pop 1 and 2 from the stack, add them, push the result (3).', fn(s){const b=+s.pop(),a=+s.pop();s.push(String(a+b));}},
      {t:'3',       type:'data', desc:'Push the number 3 — the value expected as the result.', fn(s){s.push('3');}},
      {t:'OP_EQUAL',type:'op',   desc:'Pop two values from the stack, compare. If equal, push TRUE.', fn(s){const b=s.pop(),a=s.pop();s.push(a===b?'TRUE':'FALSE');}},
    ], ok:s=>s.length===1&&s[0]==='TRUE'},

    {label:'P2PKH', tokens:[
      {t:'Signature',    type:'data', desc:'scriptSig: push the sender’s digital signature — proof that they have the private key.', fn(s){s.push('Signature');}},
      {t:'Public Key',    type:'data', desc:'scriptSig: push the sender’s public key.', fn(s){s.push('Public Key');}},
      {t:'OP_DUP',          type:'op',   desc:'Duplicate the top value — now there are two copies of the Public Key on the stack.', fn(s){s.push(s[s.length-1]);}},
      {t:'OP_HASH160',      type:'op',   desc:'Pop one Public Key, compute SHA-256 then RIPEMD-160, push the result. The result will be compared with the recipient’s public key hash.', fn(s){s.pop();s.push('Sender PKH');}},
      {t:'Recipient PKH', type:'data', desc:'scriptPubKey: push the recipient’s public key hash placed in the output by the giver — this is what determines who is entitled to spend this bitcoin.', fn(s){s.push('Recipient PKH');}},
      {t:'OP_EQUALVERIFY',  type:'op',   desc:'Pop both hashes, compare. If equal, discard both and continue. Proves the sender holds the key the recipient intended. If not equal, the script fails.', fn(s){s.pop();s.pop();}},
      {t:'OP_CHECKSIG',     type:'op',   desc:'Pop the Public Key and Signature, verify cryptographically. Push TRUE if valid.', fn(s){s.pop();s.pop();s.push('TRUE');}},
    ], ok:s=>s.length===1&&s[0]==='TRUE'},

    {label:'Multisig 2-of-3', tokens:[
      {t:'OP_0',             type:'op',   desc:'Push 0 — a dummy value because of an old bug in OP_CHECKMULTISIG that always discards one extra value from the stack.', fn(s){s.push('0');}},
      {t:'Signature 1',   type:'data', desc:'Push the signature from the first signer.', fn(s){s.push('Signature 1');}},
      {t:'Signature 2',   type:'data', desc:'Push the signature from the second signer.', fn(s){s.push('Signature 2');}},
      {t:'OP_2',             type:'op',   desc:'Push the number 2 — the number of signatures required.', fn(s){s.push('2');}},
      {t:'Public Key 1',   type:'data', desc:'Push the first member’s public key.', fn(s){s.push('Public Key 1');}},
      {t:'Public Key 2',   type:'data', desc:'Push the second member’s public key.', fn(s){s.push('Public Key 2');}},
      {t:'Public Key 3',   type:'data', desc:'Push the third member’s public key.', fn(s){s.push('Public Key 3');}},
      {t:'OP_3',             type:'op',   desc:'Push the number 3 — the total public keys available.', fn(s){s.push('3');}},
      {t:'OP_CHECKMULTISIG', type:'op',   desc:'Verify that 2 of 3 signatures are valid. Discard all elements, push TRUE if successful.', fn(s){s.length=0;s.push('TRUE');}},
    ], ok:s=>s.length===1&&s[0]==='TRUE'},
  ];

  let active=0, step=0, stack=[], timer=null;

  function g(id){ return document.getElementById(id); }

  function makeItem(text) {
    const d = document.createElement('div');
    d.style.cssText = `padding:10px 14px;border-radius:6px;font-size:13px;font-family:'Sora',sans-serif;text-align:center;font-weight:500;min-height:40px;display:flex;align-items:center;justify-content:center;background:${PURPLE};color:${WHITE};`;
    d.textContent = text;
    return d;
  }

  function renderDisplay() {
    const sc = SCRIPTS[active];
    const el = g('b06-s61-display');
    if (!el) return;
    el.innerHTML = sc.tokens.map((tk,i) => {
      let c = 'sv-tok-sim ' + (tk.type==='data' ? 'data-sim' : 'op-sim');
      if (i < step) c += ' done-sim';
      if (i === step) c += ' current-sim';
      return `<span class="${c}">${tk.t}</span>`;
    }).join('');
  }

  function renderStack() {
    const el = g('b06-s61-stack');
    if (!el) return;
    el.innerHTML = '';
    if (!stack.length) {
      const e = document.createElement('div');
      e.className = 'sv-empty-sim';
      e.textContent = 'empty';
      el.appendChild(e);
      return;
    }
    stack.forEach(v => el.appendChild(makeItem(v)));
  }

  function renderInfo() {
    const sc = SCRIPTS[active];
    const opEl = g('b06-s61-op');
    const descEl = g('b06-s61-desc-info');
    if (!opEl || !descEl) return;
    if (step >= sc.tokens.length) {
      opEl.textContent = 'Done';
      descEl.textContent = 'Script execution complete.';
    } else {
      opEl.textContent = sc.tokens[step].t;
      descEl.textContent = sc.tokens[step].desc;
    }
  }

  function renderResult() {
    const el = g('b06-s61-result');
    const sc = SCRIPTS[active];
    if (!el) return;
    if (step < sc.tokens.length) { el.className = 'sv-result-sim'; return; }
    const ok = sc.ok(stack);
    el.className = 'sv-result-sim show-sim ' + (ok ? 'ok-sim' : 'fail-sim');
    el.textContent = ok ? '✅ TRUE — script valid, transaction accepted by the network' : '❌ FALSE — script failed, transaction rejected';
  }

  function doStep() {
    const sc = SCRIPTS[active];
    if (step >= sc.tokens.length) return;
    sc.tokens[step].fn(stack);
    step++;
    renderDisplay(); renderStack(); renderInfo(); renderResult();
  }

  function reset() {
    clearInterval(timer); step = 0; stack = [];
    renderDisplay(); renderStack(); renderInfo();
    const el = g('b06-s61-result');
    if (el) el.className = 'sv-result-sim';
  }

  function autoRun() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (step >= SCRIPTS[active].tokens.length) { clearInterval(timer); return; }
      doStep();
    }, 700);
  }

  function setScript(i) {
    active = i;
    document.querySelectorAll('.sv-btn-sim').forEach((b,j) =>
      b.className = 'sv-btn-sim' + (j===i ? ' active' : ''));
    reset();
  }

  const cont = g('b06-s61-scripts');
  if (cont) {
    SCRIPTS.forEach((sc, i) => {
      const b = document.createElement('button');
      b.className = 'sv-btn-sim' + (i===0 ? ' active' : '');
      b.textContent = sc.label;
      b.addEventListener('click', () => setScript(i));
      cont.appendChild(b);
    });
  }

  const nextBtn  = g('b06-s61-next');
  const autoBtn  = g('b06-s61-auto');
  const resetBtn = g('b06-s61-reset');
  if (nextBtn)  nextBtn.addEventListener('click', doStep);
  if (autoBtn)  autoBtn.addEventListener('click', autoRun);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  reset();
})();

// PAGE 9 · BAB 6 · 6.2 SIMULATION A — Opcode Stack Demo
// ============================================================
(function() {
  const PURP='#534AB7', WHITE='#ffffff';
  function g(id){return document.getElementById(id);}

  function makeItem(v){
    const d=document.createElement('div');
    d.style.cssText=`padding:8px 12px;border-radius:5px;font-size:12px;font-family:'Courier Prime',monospace;text-align:center;font-weight:500;min-height:34px;display:flex;align-items:center;justify-content:center;background:${PURP};color:${WHITE};`;
    d.textContent=v;
    return d;
  }

  function renderStack(elId, items){
    const el=g(elId); if(!el) return;
    el.innerHTML='';
    if(!items.length){
      const e=document.createElement('div');
      e.className='od-empty-sim'; e.textContent='empty'; el.appendChild(e); return;
    }
    items.forEach(v=>el.appendChild(makeItem(v)));
  }

  function setNote(msg, type=''){
    const el=g('b06-s62-note'); if(!el) return;
    el.style.display='block';
    el.className='od-note-sim'+(type?' '+type+'-sim':'');
    el.textContent=msg;
  }

  function clearNote(){const el=g('b06-s62-note');if(el)el.style.display='none';}

  const OPS=[
    {name:'OP_DUP',long:'Duplicate',desc:'Copies the top value of the stack and adds it on top again.',
      inputs:[{label:'Value A',key:'a',ph:'hello'}],
      run(i){const a=i.a||'hello';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',[a,a]);setNote(`"${a}" copied. The stack now has two copies of the same value.`,'ok');}},
    {name:'OP_DROP',long:'Drop',desc:'Discards the top value of the stack.',
      inputs:[{label:'Value A',key:'a',ph:'hello'},{label:'Value B',key:'b',ph:'world'}],
      run(i){const a=i.a||'hello',b=i.b||'world';renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[a]);setNote(`"${b}" discarded from the top of the stack.`,'ok');}},
    {name:'OP_SWAP',long:'Swap',desc:'Swaps the positions of the top two values of the stack.',
      inputs:[{label:'Value A',key:'a',ph:'first'},{label:'Value B',key:'b',ph:'second'}],
      run(i){const a=i.a||'first',b=i.b||'second';renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[b,a]);setNote(`"${a}" and "${b}" swapped positions.`,'ok');}},
    {name:'OP_ADD',long:'Add',desc:'Takes two numbers from the stack, adds them, and stores the result.',
      inputs:[{label:'Number A',key:'a',ph:'3'},{label:'Number B',key:'b',ph:'4'}],
      run(i){const a=parseInt(i.a)||3,b=parseInt(i.b)||4,r=a+b;renderStack('b06-s62-before',[String(a),String(b)]);renderStack('b06-s62-after',[String(r)]);setNote(`${a} + ${b} = ${r}`,'ok');}},
    {name:'OP_SUB',long:'Subtract',desc:'Takes two numbers from the stack, subtracting the second value from the first.',
      inputs:[{label:'Number A',key:'a',ph:'10'},{label:'Number B',key:'b',ph:'3'}],
      run(i){const a=parseInt(i.a)||10,b=parseInt(i.b)||3,r=a-b;renderStack('b06-s62-before',[String(a),String(b)]);renderStack('b06-s62-after',[String(r)]);setNote(`${a} - ${b} = ${r}`,'ok');}},
    {name:'OP_EQUAL',long:'Equal',desc:'Takes two values from the stack and compares them. Stores TRUE if equal, FALSE if not.',
      inputs:[{label:'Value A',key:'a',ph:'42'},{label:'Value B',key:'b',ph:'42'}],
      run(i){const a=i.a||'42',b=i.b||'42',eq=a===b;renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[eq?'TRUE':'FALSE']);setNote(eq?`"${a}" = "${b}" → TRUE`:`"${a}" ≠ "${b}" → FALSE`,eq?'ok':'fail');}},
    {name:'OP_EQUALVERIFY',long:'Equal Verify',desc:'Like OP_EQUAL, but if not equal the script immediately fails.',
      inputs:[{label:'Value A',key:'a',ph:'abc'},{label:'Value B',key:'b',ph:'abc'}],
      run(i){const a=i.a||'abc',b=i.b||'abc',eq=a===b;renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[]);setNote(eq?`"${a}" = "${b}" — both values discarded, script continues.`:`"${a}" ≠ "${b}" — script immediately FAILS.`,eq?'ok':'fail');}},
    {name:'OP_SHA256',long:'SHA-256',desc:'Computes the SHA-256 hash of the top value and stores the result.',
      inputs:[{label:'Input',key:'a',ph:'hello'}],
      run(i){const a=i.a||'hello';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',['SHA256('+a+')']);setNote(`"${a}" hashed with SHA-256. The output is always 32 bytes, regardless of input length.`,'ok');}},
    {name:'OP_HASH160',long:'Hash 160-bit',desc:'Computes SHA-256 then RIPEMD-160. The result is 20 bytes — used to make a Bitcoin address.',
      inputs:[{label:'Public Key',key:'a',ph:'pubkey'}],
      run(i){const a=i.a||'pubkey';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',['HASH160('+a+')']);setNote(`"${a}" hashed twice: SHA-256 → RIPEMD-160. The result is 20 bytes — this is what is stored inside a Bitcoin address.`,'ok');}},
    {name:'OP_CHECKSIG',long:'Check Signature',desc:'Takes a public key and signature, verifies cryptographically. TRUE if valid.',
      inputs:[{label:'Signature',key:'sig',ph:'valid'},{label:'Public Key',key:'pk',ph:'pubkey'}],
      run(i){const sig=i.sig||'valid',pk=i.pk||'pubkey',v=sig==='valid'||sig==='correct';renderStack('b06-s62-before',[sig,pk]);renderStack('b06-s62-after',[v?'TRUE':'FALSE']);setNote(v?'Signature verified. Valid → TRUE.':'Signature invalid → FALSE.',v?'ok':'fail');}},
    {name:'OP_CHECKMULTISIG',long:'Check Multisig',desc:'Verifies m-of-n signatures. All public keys and signatures are taken from the stack.',
      inputs:[],
      run(){const before=['0','Signature 1','Signature 2','2','Public Key 1','Public Key 2','Public Key 3','3'];renderStack('b06-s62-before',before);renderStack('b06-s62-after',['TRUE']);setNote('2 of 3 signatures verified. Enough → TRUE. The stack is emptied.','ok');}},
    {name:'OP_IF',long:'If',desc:'Checks the top value of the stack. If TRUE the IF block runs, if FALSE it is skipped.',
      inputs:[{label:'Condition',key:'a',ph:'true'}],
      run(i){const a=(i.a||'true').toLowerCase(),t=a==='true'||a==='1'||a==='yes';renderStack('b06-s62-before',[t?'TRUE':'FALSE']);renderStack('b06-s62-after',[]);setNote(t?'TRUE — the IF block runs, value discarded.':'FALSE — the IF block is skipped.',t?'ok':'warn');}},
    {name:'OP_VERIFY',long:'Verify',desc:'Takes the top value. If TRUE the script continues. If FALSE the script immediately fails.',
      inputs:[{label:'Condition',key:'a',ph:'true'}],
      run(i){const a=(i.a||'true').toLowerCase(),t=a==='true'||a==='1'||a==='yes';renderStack('b06-s62-before',[t?'TRUE':'FALSE']);renderStack('b06-s62-after',[]);setNote(t?'TRUE — value discarded, script continues.':'FALSE — script immediately FAILS.',t?'ok':'fail');}},
    {name:'OP_RETURN',long:'Return',desc:'Stops script execution entirely. The output is marked unspendable. Used to embed data into the blockchain.',
      inputs:[{label:'Data (limit: node policy)',key:'a',ph:'my message'}],
      run(i){const a=i.a||'my message';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',[]);setNote(`The script stops entirely. The data "${a.slice(0,24)}${a.length>24?'…':''}" is embedded into the blockchain permanently. This output cannot be spent.`,'warn');}},
  ];

  let active=0;

  function renderOps(){
    const el=g('b06-s62-ops'); if(!el) return;
    el.innerHTML='';
    OPS.forEach((op,i)=>{
      const b=document.createElement('button');
      b.className='od-op-sim'+(i===active?' active':'');
      b.textContent=op.name;
      b.addEventListener('click',()=>{active=i;renderOps();renderSelected();});
      el.appendChild(b);
    });
  }

  function renderSelected(){
    const op=OPS[active];
    const nameEl=g('b06-s62-name'); if(nameEl) nameEl.textContent=op.name;
    const longEl=g('b06-s62-long'); if(longEl) longEl.textContent=op.long;
    const descEl=g('b06-s62-desc'); if(descEl) descEl.textContent=op.desc;

    const inputsEl=g('b06-s62-inputs'); if(!inputsEl) return;
    inputsEl.innerHTML='';
    if(op.inputs.length){
      op.inputs.forEach(inp=>{
        const row=document.createElement('div');
        row.className='od-input-row-sim';
        row.innerHTML=`<span class="od-input-lbl-sim">${inp.label}</span><input class="od-input-sim" id="b06-s62-inp-${inp.key}" placeholder="${inp.ph}" value="${inp.ph}">`;
        inputsEl.appendChild(row);
      });
      const btn=document.createElement('button');
      btn.className='kp-btn kp-btn-gen od-run-sim';
      btn.style.marginTop='4px';
      btn.textContent='Run ↗';
      btn.addEventListener('click',()=>{
        const vals={};
        op.inputs.forEach(inp=>{const el=g('b06-s62-inp-'+inp.key);vals[inp.key]=el?el.value:inp.ph;});
        op.run(vals);
      });
      inputsEl.appendChild(btn);
    }

    clearNote();
    renderStack('b06-s62-before',[]);
    renderStack('b06-s62-after',[]);
    if(!op.inputs.length) op.run({});
  }

  if(g('b06-s62-ops')){renderOps();renderSelected();}
})();

// ============================================================
// PAGE 9 · BAB 6 · 6.2 SIMULATION B — Kamus Opcodes
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CATS=[
    {id:'all',label:'All'},{id:'stack',label:'Stack'},{id:'arith',label:'Arithmetic'},
    {id:'bit',label:'Comparison'},{id:'crypto',label:'Cryptography'},
    {id:'flow',label:'Flow control'},{id:'lock',label:'Timelock'},{id:'disabled',label:'Disabled'},
  ];

  const OPCODES=[
    {name:'OP_DUP',hex:'0x76',long:'Duplicate',cat:'stack',desc:'Copy the top value to the top of the stack.'},
    {name:'OP_DROP',hex:'0x75',long:'Drop',cat:'stack',desc:'Discard the top value.'},
    {name:'OP_SWAP',hex:'0x7c',long:'Swap',cat:'stack',desc:'Swap the top two values.'},
    {name:'OP_2DUP',hex:'0x6e',long:'Duplicate Two',cat:'stack',desc:'Copy the top two values to the top of the stack.'},
    {name:'OP_OVER',hex:'0x78',long:'Over',cat:'stack',desc:'Copy the second-from-top value to the very top.'},
    {name:'OP_ROT',hex:'0x7b',long:'Rotate',cat:'stack',desc:'Move the third value to the very top.'},
    {name:'OP_IFDUP',hex:'0x73',long:'If Duplicate',cat:'stack',desc:'Copy the top value only if it is non-zero.'},
    {name:'OP_ADD',hex:'0x93',long:'Add',cat:'arith',desc:'Take two values, add them, store the result.'},
    {name:'OP_SUB',hex:'0x94',long:'Subtract',cat:'arith',desc:'Take two values, subtract, store the result.'},
    {name:'OP_1ADD',hex:'0x8b',long:'Add One',cat:'arith',desc:'Add 1 to the top value.'},
    {name:'OP_1SUB',hex:'0x8c',long:'Subtract One',cat:'arith',desc:'Subtract 1 from the top value.'},
    {name:'OP_NEGATE',hex:'0x8f',long:'Negate',cat:'arith',desc:'Flip the sign of the top value.'},
    {name:'OP_ABS',hex:'0x90',long:'Absolute',cat:'arith',desc:'Turn the top value into its absolute value.'},
    {name:'OP_NOT',hex:'0x91',long:'Not',cat:'arith',desc:'Store 1 if the top value is zero, otherwise store 0.'},
    {name:'OP_MIN',hex:'0xa3',long:'Minimum',cat:'arith',desc:'Take two values, store the smaller one.'},
    {name:'OP_MAX',hex:'0xa4',long:'Maximum',cat:'arith',desc:'Take two values, store the larger one.'},
    {name:'OP_EQUAL',hex:'0x87',long:'Equal',cat:'bit',desc:'Take two values — store TRUE if equal, FALSE if not.'},
    {name:'OP_EQUALVERIFY',hex:'0x88',long:'Equal Verify',cat:'bit',desc:'Like OP_EQUAL, but immediately fails the script if not equal.'},
    {name:'OP_NUMEQUAL',hex:'0x9c',long:'Numeric Equal',cat:'bit',desc:'Compare two numbers — store TRUE if equal.'},
    {name:'OP_NUMEQUALVERIFY',hex:'0x9d',long:'Numeric Equal Verify',cat:'bit',desc:'Like OP_NUMEQUAL, but immediately fails if not equal.'},
    {name:'OP_LESSTHAN',hex:'0x9f',long:'Less Than',cat:'bit',desc:'Store TRUE if the first value is smaller than the second.'},
    {name:'OP_GREATERTHAN',hex:'0xa0',long:'Greater Than',cat:'bit',desc:'Store TRUE if the first value is greater than the second.'},
    {name:'OP_SHA256',hex:'0xa8',long:'SHA-256',cat:'crypto',desc:'Hash the top value with SHA-256.'},
    {name:'OP_HASH160',hex:'0xa9',long:'Hash 160-bit',cat:'crypto',desc:'Hash the top value with SHA-256 then RIPEMD-160. Used in P2PKH and P2SH.'},
    {name:'OP_HASH256',hex:'0xaa',long:'Hash 256-bit',cat:'crypto',desc:'Hash the top value twice with SHA-256 (SHA-256d).'},
    {name:'OP_CHECKSIG',hex:'0xac',long:'Check Signature',cat:'crypto',desc:'Verify one signature. Store TRUE if valid.'},
    {name:'OP_CHECKSIGVERIFY',hex:'0xad',long:'Check Signature Verify',cat:'crypto',desc:'Like OP_CHECKSIG, but immediately fails if not valid.'},
    {name:'OP_CHECKMULTISIG',hex:'0xae',long:'Check Multisig',cat:'crypto',desc:'Verify m-of-n signatures. Store TRUE if enough valid signatures.'},
    {name:'OP_CHECKSIGADD',hex:'0xba',long:'Check Signature Add',cat:'crypto',desc:'Taproot: verify a Schnorr signature and add to a counter. Replacement for OP_CHECKMULTISIG.'},
    {name:'OP_IF',hex:'0x63',long:'If',cat:'flow',desc:'Run the next block only if the top value is TRUE.'},
    {name:'OP_NOTIF',hex:'0x64',long:'Not If',cat:'flow',desc:'Run the next block only if the top value is FALSE.'},
    {name:'OP_ELSE',hex:'0x67',long:'Else',cat:'flow',desc:'The alternative block if the IF condition is not met.'},
    {name:'OP_ENDIF',hex:'0x68',long:'End If',cat:'flow',desc:'Close the conditional block.'},
    {name:'OP_VERIFY',hex:'0x69',long:'Verify',cat:'flow',desc:'Take the top value — if FALSE, the script immediately fails.'},
    {name:'OP_RETURN',hex:'0x6a',long:'Return',cat:'flow',desc:'Stop the script entirely. The output cannot be spent. Used to embed data — the size cap is per-node relay policy (long-standing convention: 80 bytes).'},
    {name:'OP_CHECKLOCKTIMEVERIFY',hex:'0xb1',long:'Check Lock Time Verify',cat:'lock',desc:'Reject the transaction if it has not passed a certain time or block height (absolute timelock).'},
    {name:'OP_CHECKSEQUENCEVERIFY',hex:'0xb2',long:'Check Sequence Verify',cat:'lock',desc:'Reject the transaction if it has not passed a number of blocks since the output was confirmed (relative timelock).'},
    {name:'OP_MUL',hex:'0x95',long:'Multiply',cat:'disabled',desc:'Multiply the top two values.',reason:'Disabled in 2010. Large integer multiplication could be exploited to make scripts that require very long computation, potentially paralyzing nodes.'},
    {name:'OP_DIV',hex:'0x96',long:'Divide',cat:'disabled',desc:'Divide the top two values.',reason:'Disabled in 2010. Division by zero is poorly defined, creating a flaw that could be exploited to crash nodes.'},
    {name:'OP_MOD',hex:'0x97',long:'Modulo',cat:'disabled',desc:'Take the remainder of dividing the top two values.',reason:'Disabled in 2010. Modulo by zero can crash nodes and its behavior is inconsistent across platforms.'},
    {name:'OP_CAT',hex:'0x7e',long:'Concatenate',cat:'disabled',desc:'Concatenate two strings into one.',reason:'Disabled in 2010. Repeated string concatenation can make the stack grow exponentially — a DoS attack with small scripts but large memory use.'},
    {name:'OP_SUBSTR',hex:'0x7f',long:'Substring',cat:'disabled',desc:'Take part of the characters from a string.',reason:'Disabled in 2010. Out-of-bounds indices are not handled well, causing undefined behavior that could be exploited to crash nodes.'},
    {name:'OP_LEFT',hex:'0x80',long:'Left',cat:'disabled',desc:'Take characters from the left side of a string.',reason:'Disabled in 2010. String operations are considered unsafe — edge-case behavior is inconsistent across implementations.'},
    {name:'OP_RIGHT',hex:'0x81',long:'Right',cat:'disabled',desc:'Take characters from the right side of a string.',reason:'Disabled in 2010. Same reason as OP_LEFT.'},
    {name:'OP_INVERT',hex:'0x83',long:'Invert Bits',cat:'disabled',desc:'Flip all bits of the top value (bitwise NOT).',reason:'Disabled in 2010. Bitwise operations on large data can produce unexpected behavior that is hard to audit for security.'},
    {name:'OP_AND',hex:'0x84',long:'Bitwise AND',cat:'disabled',desc:'Perform AND on each bit of the top two values.',reason:'Disabled in 2010. Bitwise operations on long byte strings can make scripts hard to analyze and could be exploited.'},
    {name:'OP_OR',hex:'0x85',long:'Bitwise OR',cat:'disabled',desc:'Perform OR on each bit of the top two values.',reason:'Disabled in 2010. Same reason as OP_AND.'},
    {name:'OP_XOR',hex:'0x86',long:'Bitwise XOR',cat:'disabled',desc:'Perform XOR on each bit of the top two values.',reason:'Disabled in 2010. Same reason as OP_AND and OP_OR.'},
    {name:'OP_2MUL',hex:'0x8d',long:'Multiply by Two',cat:'disabled',desc:'Multiply the top value by 2.',reason:'Disabled in 2010. Disabled alongside other arithmetic operations as a comprehensive precaution.'},
    {name:'OP_2DIV',hex:'0x8e',long:'Divide by Two',cat:'disabled',desc:'Divide the top value by 2.',reason:'Disabled in 2010. Same reason as OP_2MUL.'},
    {name:'OP_LSHIFT',hex:'0x98',long:'Left Shift',cat:'disabled',desc:'Shift the bits of the top value left.',reason:'Disabled in 2010. Left shift without a clear upper bound can produce very large numbers, potentially overflowing and crashing nodes.'},
    {name:'OP_RSHIFT',hex:'0x99',long:'Right Shift',cat:'disabled',desc:'Shift the bits of the top value right.',reason:'Disabled in 2010. Same reason as OP_LSHIFT.'},
  ];

  const BADGE_CLS={stack:'stack',arith:'arith',crypto:'crypto',flow:'flow',lock:'lock',bit:'bit',disabled:'disabled'};
  const BADGE_LBL={stack:'Stack',arith:'Arithmetic',crypto:'Cryptography',flow:'Flow',lock:'Timelock',bit:'Comparison',disabled:'Disabled'};

  let activeCat='all';

  function renderCats(){
    const el=g('b06-s62-cats'); if(!el) return;
    el.innerHTML='';
    CATS.forEach(c=>{
      const b=document.createElement('button');
      b.className='or-cat-sim'+(c.id===activeCat?' active':'');
      b.textContent=c.label;
      b.addEventListener('click',()=>{activeCat=c.id;renderCats();renderTable();});
      el.appendChild(b);
    });
  }

  function renderTable(){
    const body=g('b06-s62-tbody'); if(!body) return;
    const list=activeCat==='all'?OPCODES:OPCODES.filter(o=>o.cat===activeCat);
    if(!list.length){body.innerHTML=`<tr><td colspan="5" style="padding:20px;text-align:center;font-size:12px;color:#52524C;">No opcodes in this category.</td></tr>`;return;}
    body.innerHTML=list.map(o=>`
      <tr class="or-tr-sim">
        <td class="or-td-sim"><span class="or-name-sim">${o.name}</span></td>
        <td class="or-td-sim"><span class="or-hex-sim">${o.hex}</span></td>
        <td class="or-td-sim"><span class="or-long-sim">${o.long}</span></td>
        <td class="or-td-sim"><span class="or-badge-sim ${BADGE_CLS[o.cat]}">${BADGE_LBL[o.cat]}</span></td>
        <td class="or-td-sim">
          <span class="or-desc-sim">${o.desc}</span>
          ${o.reason?`<div class="or-reason-sim">⚠️ ${o.reason}</div>`:''}
        </td>
      </tr>`).join('');
  }

  if(g('b06-s62-cats')){renderCats();renderTable();}
})();

// ============================================================
// PAGE 9 · BAB 6 · 6.3 SIMULATION (P2PKH)
// ============================================================
(function() {
  const PURP='#534AB7', WHITE='#ffffff';
  function g(id){return document.getElementById(id);}

  const STEPS=[
    {tok:0,label:'Signature',desc:'scriptSig: push the sender’s digital signature onto the stack. Proof that they have the private key.',fn(s){s.push('Signature');}},
    {tok:1,label:'Public Key', desc:'scriptSig: push the sender’s public key onto the stack.',fn(s){s.push('Public Key');}},
    {tok:2,label:'OP_DUP',       desc:'Duplicate the top value. The Public Key now has two copies — one to be hashed, one for OP_CHECKSIG.',fn(s){s.push(s[s.length-1]);}},
    {tok:3,label:'OP_HASH160',   desc:'Pop one Public Key, compute SHA-256 then RIPEMD-160, push the result (20 bytes). This will be compared with the recipient’s public key hash.',fn(s){s.pop();s.push('Sender PKH');}},
    {tok:4,label:'Recipient PKH',  desc:'scriptPubKey: push the recipient’s public key hash stored in the output — this is what the giver placed when the output was created. It must match the sender’s public key hash.',fn(s){s.push('Recipient PKH');}},
    {tok:5,label:'OP_EQUALVERIFY',desc:'Pop both hashes, compare. If equal, discard both and continue. This proves the sender really holds the key the recipient intended.',fn(s){s.pop();s.pop();}},
    {tok:6,label:'OP_CHECKSIG',  desc:'Pop the Public Key and Signature, verify cryptographically. If valid, push TRUE.',fn(s){s.pop();s.pop();s.push('TRUE');}},
  ];

  const TOK_DEFS=[
    {label:'Signature',cls:'data-tok'},
    {label:'Public Key', cls:'data-tok'},
    {label:'OP_DUP',       cls:'op-tok'},
    {label:'OP_HASH160',   cls:'op-tok'},
    {label:'Recipient PKH',cls:'hash-tok'},
    {label:'OP_EQUALVERIFY',cls:'op-tok'},
    {label:'OP_CHECKSIG',  cls:'op-tok'},
  ];

  let step=0, stack=[], timer=null;

  function makeItem(v){
    const d=document.createElement('div');
    d.style.cssText=`padding:8px 12px;border-radius:5px;font-size:12px;font-family:'Courier Prime',monospace;text-align:center;font-weight:500;min-height:34px;display:flex;align-items:center;justify-content:center;background:${PURP};color:${WHITE};`;
    d.textContent=v;
    return d;
  }

  function renderScript(){
    const el=g('b06-s63-script'); if(!el) return;
    el.innerHTML='';
    TOK_DEFS.forEach((t,i)=>{
      if(i===2){
        const sep=document.createElement('div');
        sep.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px;margin:0 4px;';
        sep.innerHTML='<div style="width:0.5px;height:24px;background:rgba(124,58,237,0.2);"></div><div style="font-size:9px;color:#52524C;white-space:nowrap;font-family:\'Sora\',sans-serif;">scriptPubKey</div>';
        el.appendChild(sep);
      }
      const span=document.createElement('span');
      let cls='b06-s63-tok '+t.cls;
      if(i<step) cls+=' done-tok';
      if(i===step) cls+=' current-tok';
      span.className=cls;
      span.textContent=t.label;
      el.appendChild(span);
    });
  }

  function renderStack(){
    const el=g('b06-s63-stack'); if(!el) return;
    el.innerHTML='';
    if(!stack.length){
      const e=document.createElement('div'); e.className='b06-s63-empty'; e.textContent='empty'; el.appendChild(e); return;
    }
    stack.forEach(v=>el.appendChild(makeItem(v)));
  }

  function renderInfo(){
    const opEl=g('b06-s63-op'), descEl=g('b06-s63-desc');
    if(!opEl||!descEl) return;
    if(step>=STEPS.length){opEl.textContent='Done';descEl.textContent='Script execution complete.';}
    else{opEl.textContent=STEPS[step].label;descEl.textContent=STEPS[step].desc;}
  }

  function renderResult(){
    const el=g('b06-s63-result'); if(!el) return;
    if(step<STEPS.length){el.className='b06-s63-result';return;}
    const ok=stack.length===1&&stack[0]==='TRUE';
    el.className='b06-s63-result '+(ok?'show-ok':'show-fail');
    el.textContent=ok?'✅ TRUE — identity verified, transaction valid':'❌ FALSE — verification failed, transaction rejected';
  }

  function doStep(){
    if(step>=STEPS.length) return;
    STEPS[step].fn(stack); step++;
    renderScript(); renderStack(); renderInfo(); renderResult();
  }

  function reset(){
    clearInterval(timer); step=0; stack=[];
    renderScript(); renderStack(); renderInfo();
    const el=g('b06-s63-result'); if(el) el.className='b06-s63-result';
  }

  function autoRun(){
    clearInterval(timer);
    timer=setInterval(()=>{if(step>=STEPS.length){clearInterval(timer);return;}doStep();},800);
  }

  const nb=g('b06-s63-next'), ab=g('b06-s63-auto'), rb=g('b06-s63-reset'), rawb=g('b06-s63-raw-btn');
  if(nb) nb.addEventListener('click',doStep);
  if(ab) ab.addEventListener('click',autoRun);
  if(rb) rb.addEventListener('click',reset);
  if(rawb) rawb.addEventListener('click',()=>{
    const p=g('b06-s63-raw-panel');
    const show=!p.classList.contains('show');
    p.classList.toggle('show',show);
    rawb.textContent=show?'Hide raw data ↑':'View raw data →';
  });

  reset();
})();

// ============================================================
// PAGE 9 · BAB 6 · 6.4 RAW DATA TOGGLE
// ============================================================
(function() {
  const btn   = document.getElementById('b06-s64-raw-btn');
  const panel = document.getElementById('b06-s64-raw-panel');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const show = !panel.classList.contains('show');
    panel.classList.toggle('show', show);
    btn.textContent = show ? 'Hide raw data ↑' : 'View raw data P2WPKH →';
  });
})();

// ============================================================
// PAGE 9 · BAB 6 · 6.5 SIMULATION (P2MS vs P2SH)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const t1=g('b06-s65-t1'), t2=g('b06-s65-t2');
  const p1=g('b06-s65-p1'), p2=g('b06-s65-p2');
  if(t1&&t2&&p1&&p2){
    t1.addEventListener('click',()=>{
      t1.className='b06-s65-tab active-amber';
      t2.className='b06-s65-tab';
      p1.className='b06-s65-pane show';
      p2.className='b06-s65-pane';
    });
    t2.addEventListener('click',()=>{
      t2.className='b06-s65-tab active-purp';
      t1.className='b06-s65-tab';
      p2.className='b06-s65-pane show';
      p1.className='b06-s65-pane';
    });
  }

  [['ms','P2MS'],['sh','P2SH']].forEach(([k,label])=>{
    const btn  =g('b06-s65-raw-btn-'+k);
    const panel=g('b06-s65-raw-panel-'+k);
    if(btn&&panel) btn.addEventListener('click',()=>{
      const show=!panel.classList.contains('show');
      panel.classList.toggle('show',show);
      btn.textContent=show?'Hide raw data ↑':'View raw data '+label+' →';
    });
  });
})();

// ============================================================
// PAGE 9 · BAB 6 · 6.6 SIMULATION (Taproot P2TR)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const t1=g('b06-s66-t1'), t2=g('b06-s66-t2');
  const p1=g('b06-s66-p1'), p2=g('b06-s66-p2');
  if(t1&&t2&&p1&&p2){
    t1.addEventListener('click',()=>{
      t1.className='b06-s66-tab active-purp'; t2.className='b06-s66-tab';
      p1.className='b06-s66-pane show';       p2.className='b06-s66-pane';
    });
    t2.addEventListener('click',()=>{
      t2.className='b06-s66-tab active-teal'; t1.className='b06-s66-tab';
      p2.className='b06-s66-pane show';       p1.className='b06-s66-pane';
    });
  }

  [['kp','key path'],['sp','script path']].forEach(([k,label])=>{
    const btn  =g('b06-s66-raw-btn-'+k);
    const panel=g('b06-s66-raw-panel-'+k);
    if(btn&&panel) btn.addEventListener('click',()=>{
      const show=!panel.classList.contains('show');
      panel.classList.toggle('show',show);
      btn.textContent=show?'Hide raw data ↑':'View raw data '+label+' →';
    });
  });
})();

// ============================================================
// ============================================================
// ============================================================
// PAGE 10 · BAB 7 · NAVIGATION
// ============================================================
function showSectionInContentB7(sectionId, sbId) {
  document.querySelectorAll('#page-bab7 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab7 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab7-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 10 · BAB 7 · TOPBAR
// ============================================================
document.getElementById('back-home-b7').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b7').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 10 · BAB 7 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab7').addEventListener('click', () => navigate('page-bab7'));

// ============================================================
// PAGE 10 · BAB 7 · SIDEBAR EVENTS (7.1 - 7.6)
// ============================================================
document.getElementById('sb-7-1').addEventListener('click', () => showSectionInContentB7('section-7-1', 'sb-7-1'));
document.getElementById('sb-7-2').addEventListener('click', () => showSectionInContentB7('section-7-2', 'sb-7-2'));
document.getElementById('sb-7-3').addEventListener('click', () => showSectionInContentB7('section-7-3', 'sb-7-3'));
document.getElementById('sb-7-4').addEventListener('click', () => showSectionInContentB7('section-7-4', 'sb-7-4'));
document.getElementById('sb-7-5').addEventListener('click', () => showSectionInContentB7('section-7-5', 'sb-7-5'));
document.getElementById('sb-7-6').addEventListener('click', () => showSectionInContentB7('section-7-6', 'sb-7-6'));

// ============================================================
// PAGE 10 · BAB 7 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab7 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB7(target, sb);
  });
});

// ============================================================
// PAGE 10 · BAB 7 · 7.1 SIMULATION (Trilemma Skalabilitas)
// ============================================================
(function() {
  const canvas = document.getElementById('b07-s71-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG   = dark ? '#1A1A18' : '#F4F4F0';
  const TXT2 = dark ? '#A0A098' : '#3A3A35';
  const TXT3 = dark ? '#E0DED8' : '#1A1A18';
  const GRAY = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const PURP = '#534AB7';
  const GREEN = '#3B6D11';
  const RED   = '#A32D2D';

  const SCENARIOS = {
    t1: { label:'Bitcoin', note:'Bitcoin chooses decentralization and security fully. Scalability is delegated to the layer above it. This is a deliberate trade-off, not a weakness.', noteClass:'bitcoin', fill:[1.0,1.0,0.1], color:PURP, label2:'Chooses decentralization + security', tabClass:'active' },
    t2: { label:'Bitcoin + Lightning', note:'The Lightning Network adds scalability on top of Bitcoin without sacrificing decentralization or security. Bitcoin remains the secure settlement layer.', noteClass:'lightning', fill:[1.0,1.0,0.9], color:GREEN, label2:'The trilemma met together', tabClass:'active-green' },
    t3: { label:'Other approaches', note:'Approaches that prioritize scalability usually have to sacrifice decentralization (big blocks = expensive nodes) or security (selected validators, checkpoints).', noteClass:'others', fill:[0.25,0.5,0.95], color:RED, label2:'Scalable but sacrifices the others', tabClass:'active-red' },
  };

  let active = 't1';

  function setup() {
    const dpr = window.devicePixelRatio||1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = 340;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    return {W,H};
  }

  function draw() {
    const {W,H} = setup();
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();
    const sc = SCENARIOS[active];
    const cx = W/2, cy = H*0.48, R = Math.min(W,H)*0.34;
    const angles = [-Math.PI/2, -Math.PI/2+2*Math.PI/3, -Math.PI/2+4*Math.PI/3];
    const corners = angles.map(a=>({x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}));
    const labels = ['Decentralization','Security','Scalability'];
    const sublabels = ['many independent nodes','strong cryptography, PoW','fast & cheap transactions'];

    ctx.beginPath();
    corners.forEach((c,i)=>i===0?ctx.moveTo(c.x,c.y):ctx.lineTo(c.x,c.y));
    ctx.closePath(); ctx.strokeStyle=GRAY; ctx.lineWidth=1; ctx.stroke();

    [0.25,0.5,0.75].forEach(t=>{
      const inner=angles.map(a=>({x:cx+R*t*Math.cos(a),y:cy+R*t*Math.sin(a)}));
      ctx.beginPath();
      inner.forEach((c,i)=>i===0?ctx.moveTo(c.x,c.y):ctx.lineTo(c.x,c.y));
      ctx.closePath(); ctx.strokeStyle=GRAY; ctx.lineWidth=0.5; ctx.stroke();
    });

    corners.forEach(c=>{
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(c.x,c.y);
      ctx.strokeStyle=GRAY; ctx.lineWidth=0.5; ctx.stroke();
    });

    const filled = corners.map((c,i)=>({x:cx+(c.x-cx)*sc.fill[i],y:cy+(c.y-cy)*sc.fill[i]}));
    ctx.beginPath();
    filled.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
    ctx.closePath();
    if(sc.color===PURP) ctx.fillStyle=dark?'rgba(83,74,183,0.25)':'rgba(83,74,183,0.15)';
    else if(sc.color===GREEN) ctx.fillStyle=dark?'rgba(59,109,17,0.25)':'rgba(59,109,17,0.15)';
    else ctx.fillStyle=dark?'rgba(163,45,45,0.25)':'rgba(163,45,45,0.15)';
    ctx.fill(); ctx.strokeStyle=sc.color; ctx.lineWidth=2; ctx.stroke();

    filled.forEach(p=>{ctx.fillStyle=sc.color;ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();});

    const off=30;
    corners.forEach((c,i)=>{
      const dx=c.x-cx,dy=c.y-cy,len=Math.sqrt(dx*dx+dy*dy);
      const lx=c.x+(dx/len)*off,ly=c.y+(dy/len)*off;
      ctx.fillStyle=TXT3; ctx.font='500 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(labels[i],lx,ly);
      ctx.fillStyle=TXT2; ctx.font='10px sans-serif';
      ctx.fillText(sublabels[i],lx,ly+15);
    });

    ctx.fillStyle=sc.color; ctx.font='500 11px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(sc.label2,cx,cy+R*0.14);

    const ly2=H-22;
    const items=[{color:PURP,label:'Bitcoin'},{color:GREEN,label:'Bitcoin + Lightning'},{color:RED,label:'Other approaches'}];
    const totalW=items.reduce((s,it)=>s+ctx.measureText(it.label).width+22,0);
    let lx2=(W-totalW)/2;
    items.forEach(it=>{
      ctx.fillStyle=it.color; ctx.beginPath(); ctx.arc(lx2+5,ly2,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=TXT2; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(it.label,lx2+14,ly2);
      lx2+=ctx.measureText(it.label).width+22;
    });
  }

  function renderTabs(){
    const cont=document.getElementById('b07-s71-tabs'); if(!cont) return;
    cont.innerHTML='';
    Object.entries(SCENARIOS).forEach(([id,sc])=>{
      const btn=document.createElement('button');
      btn.className='b07-s71-tab'+(id===active?' '+sc.tabClass:'');
      btn.textContent=sc.label;
      btn.addEventListener('click',()=>setScenario(id));
      cont.appendChild(btn);
    });
  }

  function setScenario(id){
    active=id; renderTabs(); draw();
    const sc=SCENARIOS[id];
    const el=document.getElementById('b07-s71-note');
    if(el){el.textContent=sc.note;el.className='b07-s71-note '+sc.noteClass;}
  }

  renderTabs(); setScenario('t1');
  if(typeof ResizeObserver!=='undefined') new ResizeObserver(()=>requestAnimationFrame(()=>draw())).observe(canvas);
})();

// ============================================================
// PAGE 10 · BAB 7 · 7.2 SIMULATION (Payment Channel)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const PHASES={
    1:{head:'Phase 1 · Open Channel (Funding Transaction)',note:'One on-chain transaction locks 0.1 BTC in a 2-of-2 multisig. No one can take the funds without both signatures. The channel is officially open.',noteClass:'info-note',
      rows:[{k:'Transaction type',v:'Funding transaction',cls:'purp'},{k:'On-chain',v:'Yes — recorded on the blockchain',cls:'purp'},{k:'Multisig',v:'2-of-2 (Alice + Bob)',cls:'purp'},{k:'Total locked',v:'0.1 BTC (0.05 Alice + 0.05 Bob)',cls:'purp'},{k:'Initial state',v:'Alice: 0.05 BTC | Bob: 0.05 BTC',cls:'purp'}],txs:null},
    2:{head:'Phase 2 · Transactions within the Channel (Off-chain)',note:'All transactions happen off-chain. The old state is revoked on each update — if Alice tries to broadcast an old state, Bob can claim all the channel funds as a penalty.',noteClass:'success-note',
      txs:[{label:'Alice → Bob',cls:'purp',amount:'0.010 BTC',result:'Alice: 0.040 | Bob: 0.060'},{label:'Alice → Bob',cls:'purp',amount:'0.005 BTC',result:'Alice: 0.035 | Bob: 0.065'},{label:'Bob → Alice',cls:'green',amount:'0.002 BTC',result:'Alice: 0.037 | Bob: 0.063'},{label:'Alice → Bob',cls:'purp',amount:'0.007 BTC',result:'Alice: 0.030 | Bob: 0.070'}],
      rows:[{k:'Transaction type',v:'Commitment transaction (off-chain)',cls:'green'},{k:'On-chain',v:'No — only exchanged between parties',cls:'green'},{k:'Number of transactions',v:'4 transactions, 0 on-chain',cls:'green'},{k:'Final state',v:'Alice: 0.03 BTC | Bob: 0.07 BTC',cls:'green'},{k:'Revocation',v:'The old state has been revoked — cannot be used',cls:'green'}]},
    3:{head:'Phase 3 · Close Channel (Settlement Transaction)',note:'Just one more on-chain transaction to close the channel. Total: 2 on-chain transactions for all the off-chain transactions. The blockchain fee is paid only twice.',noteClass:'warning-note',
      rows:[{k:'Transaction type',v:'Closing transaction',cls:'amber'},{k:'On-chain',v:'Yes — records the final balance',cls:'amber'},{k:'Alice receives',v:'0.03 BTC',cls:'purp'},{k:'Bob receives',v:'0.07 BTC',cls:'green'},{k:'Total on-chain',v:'2 transactions for the entire channel',cls:'amber'}],txs:null},
  };
  let active=1;
  function renderDetail(phase){
    const p=PHASES[phase];
    const head=g('b07-s72-detail-head'),body=g('b07-s72-detail-body'),note=g('b07-s72-note');
    if(!head||!body||!note) return;
    head.textContent=p.head; body.innerHTML='';
    if(p.txs){
      const wrap=document.createElement('div'); wrap.className='b07-s72-txs';
      p.txs.forEach(tx=>{
        const el=document.createElement('div'); el.className='b07-s72-tx';
        el.innerHTML=`<span class="b07-s72-tx-label ${tx.cls}">${tx.label}</span><div class="b07-s72-tx-right"><span class="b07-s72-tx-amount">${tx.amount}</span><span class="b07-s72-tx-result">→ ${tx.result}</span></div>`;
        wrap.appendChild(el);
      });
      body.appendChild(wrap);
    }
    p.rows.forEach(row=>{
      const el=document.createElement('div'); el.className='b07-s72-detail-row';
      el.innerHTML=`<span class="b07-s72-detail-key">${row.k}</span><span class="b07-s72-detail-val ${row.cls||''}">${row.v}</span>`;
      body.appendChild(el);
    });
    note.textContent=p.note; note.className='b07-s72-note '+p.noteClass;
  }
  [1,2,3].forEach(i=>{
    const el=g('b07-s72-ph'+i);
    if(el) el.addEventListener('click',()=>{
      active=i;
      [1,2,3].forEach(j=>{const ph=g('b07-s72-ph'+j);if(ph)ph.className='b07-s72-phase'+(j===i?' active':'');});
      renderDetail(i);
    });
  });
  renderDetail(1);

  /* ---- The "try cheating" branch: demonstrates the penalty transaction ----
     The prose in 7.2 claims cheating makes no economic sense.
     Here the reader can try it and watch the consequence. */
  const CHEAT = [
    {n:'1', cls:'bad', t:'Alice broadcasts an <b>old commitment transaction</b> to the blockchain, the version from when she still held 0.05 BTC.'},
    {n:'2', cls:'bad', t:'That transaction is <b>technically valid</b>. The blockchain accepts it. So far Alice appears to have gotten away with it.'},
    {n:'3', cls:'ok',  t:'But her funds do not settle immediately. They are locked by a <b>timelock</b> for hundreds of blocks, roughly a day.'},
    {n:'4', cls:'ok',  t:'Bob\u2019s node sees the old state appear on the blockchain, and he holds the <b>revocation key</b> Alice handed over when that state was revoked.'},
    {n:'5', cls:'ok',  t:'Before Alice\u2019s timelock expires, Bob broadcasts a <b>penalty transaction</b> using that key.'},
    {n:'6', cls:'ok',  t:'Bob takes <b>the entire channel</b>, 0.1 BTC. Alice gets nothing, not even the 0.03 BTC that was rightfully hers.'},
  ];
  const HONEST = [
    {n:'1', cls:'ok', t:'Alice and Bob both sign a <b>closing transaction</b> with the latest balances.'},
    {n:'2', cls:'ok', t:'One on-chain transaction, <b>no timelock</b>, no waiting period.'},
    {n:'3', cls:'ok', t:'Both receive what they are owed. Alice 0.03 BTC, Bob 0.07 BTC.'},
  ];

  function cheatEls(){
    return {steps:g('b07-s72-steps'), out:g('b07-s72-outcome'), q:g('b07-s72-cheat-q'), st:g('b07-s72-cheat-state')};
  }
  function play(list, outcome, question){
    const e=cheatEls();
    if(!e.steps) return;
    e.steps.innerHTML=''; e.out.style.display='none';
    if(question && e.q) e.q.innerHTML=question;
    list.forEach((s,i)=>{
      const el=document.createElement('div');
      el.className='b07-s72-step';
      el.innerHTML='<span class="b07-s72-step-n '+s.cls+'">'+s.n+'</span><span class="b07-s72-step-txt">'+s.t+'</span>';
      e.steps.appendChild(el);
      setTimeout(()=>el.classList.add('show'), 90*i);
    });
    setTimeout(()=>{
      e.out.innerHTML=outcome;
      e.out.style.display='flex';
    }, 90*list.length+140);
  }
  const OUT_CHEAT='<div class="b07-s72-out lose"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.00 BTC</div><div class="b07-s72-out-tag">loses everything, including what was hers</div></div>'+
                  '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.10 BTC</div><div class="b07-s72-out-tag">the entire channel</div></div>';
  const OUT_HONEST='<div class="b07-s72-out win"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.03 BTC</div><div class="b07-s72-out-tag">her latest balance</div></div>'+
                   '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.07 BTC</div><div class="b07-s72-out-tag">his latest balance</div></div>';
  const Q_AWAL='Alice\u2019s balance has dropped from 0.05 to 0.03 BTC. Her computer still holds the old state from when she had 0.05. Why doesn\u2019t she just broadcast that one instead? Go ahead and try, and see what happens.';
  const Q_CURANG='This is why cheating makes no sense. Alice risks the 0.03 BTC that is already certainly hers, for a shot at 0.05 BTC, and if it fails she loses all of it. No rule stops her from trying. Her own arithmetic does.';
  const Q_JUJUR='Closing honestly is far cheaper and faster: one transaction, no waiting period. Compare it against the cheating path next to it.';

  const bc=g('b07-s72-btn-cheat'), bh=g('b07-s72-btn-honest'), br=g('b07-s72-btn-reset');
  if(bc) bc.addEventListener('click',()=>play(CHEAT, OUT_CHEAT, Q_CURANG));
  if(bh) bh.addEventListener('click',()=>play(HONEST, OUT_HONEST, Q_JUJUR));
  if(br) br.addEventListener('click',()=>{
    const e=cheatEls();
    if(e.steps) e.steps.innerHTML='';
    if(e.out) e.out.style.display='none';
    if(e.q) e.q.innerHTML=Q_AWAL;
  });
})();

// ============================================================
// PAGE 10 · BAB 7 · 7.3 SIMULATION (HTLC Routing)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const STEPS=[
    {l:'1 · Carol creates a secret',h:'Step 1 — Carol creates a secret R',d:'Carol creates a secret R that only she knows, then computes <b>H = hash(R)</b>. H is the padlock. R is the key. Carol gives H to Alice as the invoice.',nt:'This is the first step. Only Carol holds the secret key.',nc:'p',nd:[{n:'Alice',c:'a',b:'0.10 BTC',bc:'p',s:'Has H (the padlock) from Carol',hc:'No HTLC yet',hs:'no'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Not involved yet',hc:'No HTLC yet',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Has R (the secret key)\nHas H = hash(R)',hc:'R stored safely',hs:'ul'}],ar:[{l:'Alice → Bob',v:'none yet',vc:'d'},{l:'Bob → Carol',v:'none yet',vc:'d'}],hl:[2],hlg:true},
    {l:'2 · Alice locks to Bob',h:'Step 2 — Alice locks funds to Bob (HTLC 1)',d:'Alice says to Bob: <b>"You get 0.01 BTC if you can show R whose hash is H — but if you can’t within 24 hours, the money comes back to me."</b> Alice’s funds are locked. Bob hasn’t got anything yet.',nt:'The first HTLC is formed. Bob can’t run off with Alice’s money because he doesn’t have it yet.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC locked in the HTLC',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Waiting — has H from Alice',hc:'Nothing yet',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Waiting on Bob',hc:'Has R (the key)',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (locked)',vc:'p'},{l:'Bob → Carol',v:'none yet',vc:'d'}],hl:[0,1]},
    {l:'3 · Bob locks to Carol',h:'Step 3 — Bob locks funds to Carol (HTLC 2)',d:'Bob knows Carol has R, so Bob says to Carol: <b>"You get 0.01 BTC if you show R — but if there’s none within 12 hours, the money comes back to me."</b> Bob’s timelock to Carol (12 hours) is shorter than Alice’s to Bob (24 hours).',nt:'Two HTLCs are formed. The only way to unwind everything: Carol reveals R.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC locked in the HTLC',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'0.01 BTC locked to Carol',hc:'lock: hash(R) | 12 hours',hs:'lk'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Ready to reveal R to claim',hc:'Has R — ready to claim!',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (locked)',vc:'p'},{l:'Bob → Carol',v:'HTLC: 0.01 BTC (locked)',vc:'p'}],hl:[1,2],hlg:true},
    {l:'4 · Carol reveals R',h:'Step 4 — Carol reveals R, claims the payment',d:'Carol shows R to Bob. Bob verifies: hash(R) = H? ✓ <b>Carol gets 0.01 BTC.</b> Bob now knows R and can use it to claim from Alice.',nt:'Funds flow to Carol. Bob doesn’t lose out because he still has a claim on Alice.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Waiting for Bob to claim',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'Got R from Carol!\nReady to claim from Alice',hc:'Has R — ready to claim Alice',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Success! Got 0.01 BTC ✓',hc:'HTLC complete ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (still locked)',vc:'p'},{l:'Bob → Carol',v:'✓ Carol claims 0.01 BTC',vc:'g'}],hl:[1,2],hlg:true},
    {l:'5 · Bob claims from Alice',h:'Step 5 — Bob reveals R to Alice, payment complete',d:'Bob shows R to Alice. Alice verifies: hash(R) = H? ✓ <b>Bob gets 0.01 BTC back.</b> The payment is complete. No trust was needed.',nt:'✅ Alice → Bob → Carol. Two HTLCs, zero trust, guaranteed by mathematics.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Payment complete ✓',hc:'HTLC complete ✓',hs:'ul'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Balance back to normal ✓',hc:'HTLC complete ✓',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Received 0.01 BTC ✓',hc:'HTLC complete ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'✓ Bob claims 0.01 BTC',vc:'g'},{l:'Bob → Carol',v:'✓ Carol claims 0.01 BTC',vc:'g'}],hl:[0,1,2],hlg:true},
  ];
  let cur=0;
  function render(){
    const s=STEPS[cur];
    const stEl=g('b07-s73-steps'); if(!stEl) return;
    stEl.innerHTML='';
    STEPS.forEach((st,i)=>{const b=document.createElement('button');b.className='b07-s73-btn'+(i===cur?' active':'');b.textContent=st.l;b.addEventListener('click',()=>{cur=i;render();});stEl.appendChild(b);});
    const nEl=g('b07-s73-nodes'); if(!nEl) return;
    nEl.innerHTML='';
    s.nd.forEach((nd,i)=>{
      const isHL=s.hl.includes(i);const hlCls=isHL?(nd.c==='c'&&s.hlg?' hlg':' hl'):'';
      const el=document.createElement('div');el.className='b07-s73-node'+hlCls;
      el.innerHTML=`<div class="b07-s73-nh ${nd.c}">${nd.n}</div><div class="b07-s73-nb"><div class="b07-s73-bal ${nd.bc}">${nd.b}</div><div class="b07-s73-st">${nd.s.split('\n').join('<br>')}</div><div class="b07-s73-htlc ${nd.hs}">${nd.hc}</div></div>`;
      nEl.appendChild(el);
    });
    const aEl=g('b07-s73-arrows'); if(!aEl) return;
    aEl.innerHTML='';
    s.ar.forEach(ar=>{const el=document.createElement('div');el.className='b07-s73-ac';el.innerHTML=`<div class="b07-s73-al">${ar.l}</div><div class="b07-s73-av ${ar.vc}">${ar.v}</div>`;aEl.appendChild(el);});
    const dh=g('b07-s73-dh'),db=g('b07-s73-db');
    if(dh)dh.textContent=s.h;if(db)db.innerHTML=s.d;
    const nt=g('b07-s73-note');if(nt){nt.textContent=s.nt;nt.className='b07-s73-note '+s.nc;}
  }
  render();
})();

// ============================================================
// PAGE 10 · BAB 7 · 7.4 SIMULATION (Channel Close)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const DATA={
    c1:{head:'Cooperative close — both parties agree',note:'The best and most common way. No waiting, no risk. Both parties negotiate the fee and sign a closing transaction together.',nc:'g',cls:'coop',rows:[{k:'Who can',v:'Both parties, anytime',vc:''},{k:'Requirement',v:'Both parties must be online and agree',vc:''},{k:'Output',v:'Directly to each wallet',vc:'g'},{k:'Wait time',v:'None — right after confirmation',vc:'g'},{k:'Fee',v:'One transaction, cheapest',vc:'g'}],steps:[{n:'1',c:'g',t:'Alice and Bob negotiate the closing transaction fee'},{n:'2',c:'g',t:'Both sign the closing transaction'},{n:'3',c:'g',t:'One on-chain transaction — funds split immediately'}]},
    c2:{head:'Force close — one party is uncooperative',note:'Used when the other party disappears or won’t respond. Slower and more expensive because it needs two transactions and must wait out a time-lock.',nc:'m',cls:'force',rows:[{k:'Who starts',v:'One party unilaterally',vc:''},{k:'Transaction 1',v:'Commitment transaction — broadcast the latest state',vc:'m'},{k:'Time-lock',v:'~144 blocks (~1 day) — must wait',vc:'m'},{k:'Transaction 2',v:'Sweep transaction — take funds after the time-lock',vc:'m'},{k:'Why a time-lock',v:'Gives the other party time to detect cheating',vc:''}],steps:[{n:'1',c:'m',t:'Alice broadcasts the latest commitment transaction'},{n:'2',c:'m',t:'Bob has time to check — is this state valid?'},{n:'3',c:'m',t:'After the time-lock finishes, Alice sweeps her funds'}]},
    c3:{head:'Penalty close — punishment for the cheater',note:'Happens when someone tries to broadcast an old state. The honest party has a time window to prove the cheating and take ALL the funds.',nc:'r',cls:'pen',rows:[{k:'Trigger',v:'A cheating party broadcasts an old state',vc:'r'},{k:'Detection',v:'A watchtower or an online node detects it',vc:''},{k:'Justice transaction',v:'The honest party broadcasts proof of cheating',vc:'r'},{k:'Outcome for attacker',v:'Loses ALL funds in the channel',vc:'r'},{k:'Outcome for honest party',v:'Gets ALL funds including the attacker’s',vc:'g'}],steps:[{n:'1',c:'r',t:'Bob (cheating) broadcasts an old commitment transaction'},{n:'2',c:'r',t:'Alice detects it — this isn’t the latest state!'},{n:'3',c:'r',t:'Alice broadcasts a justice transaction with the revocation key'},{n:'4',c:'r',t:'Alice takes ALL funds in the channel as a penalty'}]},
  };
  let sel='c1';
  function render(id){
    sel=id;
    ['c1','c2','c3'].forEach(k=>{const el=g('b07-s74-'+k);if(!el)return;el.className='b07-s74-card'+(k===id?' sel '+DATA[k].cls:'');});
    const d=DATA[id];
    const dh=g('b07-s74-dhead'),db=g('b07-s74-dbody');
    if(!dh||!db)return;
    dh.textContent=d.head;db.innerHTML='';
    d.rows.forEach(r=>{const el=document.createElement('div');el.className='b07-s74-drow';el.innerHTML=`<span class="b07-s74-dk">${r.k}</span><span class="b07-s74-dv ${r.vc}">${r.v}</span>`;db.appendChild(el);});
    const sw=document.createElement('div');sw.className='b07-s74-steps';
    d.steps.forEach(s=>{const el=document.createElement('div');el.className='b07-s74-step';el.innerHTML=`<div class="b07-s74-snum ${s.c}">${s.n}</div><div class="b07-s74-stext">${s.t}</div>`;sw.appendChild(el);});
    db.appendChild(sw);
    const nt=g('b07-s74-note');if(nt){nt.textContent=d.note;nt.className='b07-s74-note '+d.nc;}
  }
  ['c1','c2','c3'].forEach(k=>{const el=g('b07-s74-'+k);if(el)el.addEventListener('click',()=>render(k));});
  render('c1');
})();

// ============================================================
// PAGE 10 · BAB 7 · 7.5 SIMULATION (Lightning Invoice)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const SEGS={
    prefix:{head:'Network prefix',rows:[{k:'Value',v:'lnbc'},{k:'Meaning',v:'Lightning Network Bitcoin (mainnet)'},{k:'Testnet',v:'lntb — for testing'},{k:'Signet',v:'lntbs — for developers'}]},
    amount:{head:'Payment amount',rows:[{k:'Value',v:'1m'},{k:'Unit',v:'m = milli (0.001 BTC = 100.000 satoshi)'},{k:'Another example',v:'100u = 100 micro = 0.0001 BTC'},{k:'No number',v:'Open amount — the recipient decides'}]},
    timestamp:{head:'Creation timestamp',rows:[{k:'Format',v:'Unix timestamp (seconds)'},{k:'Function',v:'Determines when the invoice was created'},{k:'Combined with',v:'Validity period (expiry) to compute expiration'}]},
    phash:{head:'Payment hash (H)',rows:[{k:'Value',v:'pp5kw5... (32 bytes / 256 bit)'},{k:'Meaning',v:'H = hash(R) — hash of Carol’s secret'},{k:'Function',v:'The "padlock" at every HTLC in the payment chain'},{k:'Cannot be forged',v:'SHA-256 — no one can guess R from H'}]},
    nodeid:{head:'Recipient node ID',rows:[{k:'Value',v:'hz02a7... (33 bytes compressed pubkey)'},{k:'Meaning',v:'The public key of Carol’s Lightning node on the network'},{k:'Function',v:'The sender’s wallet uses this to find a route to Carol'},{k:'Private channel',v:'The invoice can contain routing hints for non-public channels'}]},
    expiry:{head:'Invoice validity period',rows:[{k:'Value',v:'3600 seconds (1 hour)'},{k:'Default',v:'3600 seconds if not specified'},{k:'After expiry',v:'The invoice can’t be used — the recipient creates a new one'},{k:'Why an expiry',v:'Protects the recipient from very delayed payments'}]},
    sig:{head:'Digital signature',rows:[{k:'Type',v:'ECDSA or Schnorr'},{k:'Created by',v:'The recipient node (Carol) with its private key'},{k:'Function',v:'Proves the invoice was really created by the claimed node'},{k:'Verification',v:'The sender’s wallet verifies automatically before paying'}]},
  };
  function setActive(key){
    document.querySelectorAll('.b07-s75-seg').forEach(el=>el.classList.toggle('active-seg',el.dataset.key===key));
    document.querySelectorAll('.b07-s75-leg').forEach(el=>el.classList.toggle('active-leg',el.dataset.key===key));
    const d=SEGS[key];if(!d)return;
    const dh=g('b07-s75-dhead'),db=g('b07-s75-dbody');if(!dh||!db)return;
    dh.textContent=d.head;db.innerHTML='';
    d.rows.forEach(r=>{const el=document.createElement('div');el.className='b07-s75-drow';el.innerHTML=`<span class="b07-s75-dk">${r.k}</span><span class="b07-s75-dv">${r.v}</span>`;db.appendChild(el);});
  }
  document.querySelectorAll('.b07-s75-seg').forEach(el=>el.addEventListener('click',()=>setActive(el.dataset.key)));
  document.querySelectorAll('.b07-s75-leg').forEach(el=>el.addEventListener('click',()=>setActive(el.dataset.key)));
  const t1=g('b07-s75-t1'),t2=g('b07-s75-t2'),p1=g('b07-s75-p1'),p2=g('b07-s75-p2');
  if(t1&&t2&&p1&&p2){
    t1.addEventListener('click',()=>{t1.className='b07-s75-tab active';t2.className='b07-s75-tab';p1.className='b07-s75-pane show';p2.className='b07-s75-pane';});
    t2.addEventListener('click',()=>{t2.className='b07-s75-tab active';t1.className='b07-s75-tab';p2.className='b07-s75-pane show';p1.className='b07-s75-pane';});
  }
  setActive('prefix');
})();

// ============================================================
// PAGE 11 · BAB 8 · NAVIGATION
// ============================================================
function showSectionInContentB8(sectionId, sbId) {
  document.querySelectorAll('#page-bab8 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab8 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab8-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 11 · BAB 8 · TOPBAR
// ============================================================
document.getElementById('back-home-b8').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b8').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 11 · BAB 8 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab8').addEventListener('click', () => navigate('page-bab8'));

// ============================================================
// PAGE 11 · BAB 8 · SIDEBAR EVENTS (8.1 - 8.6)
// ============================================================
document.getElementById('sb-8-1').addEventListener('click', () => showSectionInContentB8('section-8-1', 'sb-8-1'));
document.getElementById('sb-8-2').addEventListener('click', () => showSectionInContentB8('section-8-2', 'sb-8-2'));
document.getElementById('sb-8-3').addEventListener('click', () => showSectionInContentB8('section-8-3', 'sb-8-3'));
document.getElementById('sb-8-4').addEventListener('click', () => showSectionInContentB8('section-8-4', 'sb-8-4'));
document.getElementById('sb-8-5').addEventListener('click', () => showSectionInContentB8('section-8-5', 'sb-8-5'));
document.getElementById('sb-8-6').addEventListener('click', () => showSectionInContentB8('section-8-6', 'sb-8-6'));

// ============================================================
// PAGE 11 · BAB 8 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab8 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB8(target, sb);
  });
});

// ============================================================
// PAGE 11 · BAB 8 · 8.6 SIMULATION (Network Health Dashboard)
// ============================================================
(function() {
  const cv = document.getElementById('b08-s86-donut');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const DATA = [
    {label:'North America', pct:28, color:'#534AB7'},
    {label:'Europe',        pct:35, color:'#7C3AED'},
    {label:'Asia',          pct:20, color:'#0F6E56'},
    {label:'Latin America', pct:8,  color:'#854F0B'},
    {label:'Other',         pct:9,  color:'#52524C'},
  ];

  function draw() {
    const dpr = devicePixelRatio || 1;
    const W   = cv.getBoundingClientRect().width || 200;
    const H   = 140;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W * 0.35, cy = H * 0.52, R = 50, r = 28;
    let angle = -Math.PI / 2;

    DATA.forEach(d => {
      const sweep = (d.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += sweep;
    });

    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = dark ? '#1A1A18' : '#fff';
    ctx.fill();

    ctx.fillStyle = dark ? '#E0DED8' : '#1A1A18';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('100+', cx, cy - 6);
    ctx.font = '8px sans-serif';
    ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
    ctx.fillText('countries', cx, cy + 6);

    const lx = W * 0.62, ly0 = H * 0.08;
    DATA.forEach((d, i) => {
      const ly = ly0 + i * 24;
      ctx.fillStyle = d.color;
      ctx.beginPath(); ctx.arc(lx, ly + 5, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = dark ? '#E0DED8' : '#1A1A18';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(d.label, lx + 10, ly);
      ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
      ctx.font = '9px sans-serif';
      ctx.fillText(d.pct + '%', lx + 10, ly + 11);
    });
  }

  draw();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => requestAnimationFrame(draw)).observe(cv);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.5 SIMULATION (Peer Discovery)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark?'#1A1A18':'#F4F4F0';
  const TXT  = dark?'#E0DED8':'#1A1A18';
  const TXT2 = dark?'#A0A098':'#3A3A35';
  const EDGE = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const C_NEW      = '#534AB7';
  const C_DNS      = '#854F0B';
  const C_PEER     = '#0F6E56';
  const C_INACTIVE = '#52524C';

  const NEW_NODE = {x:.50,y:.75,label:'New Node',type:'new'};
  const DNS_NODE = {x:.50,y:.12,label:'DNS Seed', type:'dns'};
  const PEERS = [
    {x:.15,y:.30,label:'Peer A'},
    {x:.38,y:.22,label:'Peer B'},
    {x:.62,y:.22,label:'Peer C'},
    {x:.85,y:.30,label:'Peer D'},
    {x:.12,y:.58,label:'Peer E'},
    {x:.88,y:.58,label:'Peer F'},
  ];

  const STEPS=[
    {label:'1 · New node',head:'Step 1 — A new node starts up',
     body:'The new node powers on but isn’t connected to anyone yet. It only knows one thing: there are DNS seed domains it can query to get a list of active nodes. Every Bitcoin node software implementation includes this list of DNS seeds.',
     note:'The new node has no friends yet. First step: ask the DNS seed.',nc:'p',
     vp:[],cp:[],dnsA:false,dnsC:false,pe:[]},
    {label:'2 · DNS query',head:'Step 2 — Query to the DNS seed',
     body:'The node sends a DNS query to a domain like <code>seed.bitcoin.sipa.be</code>. The DNS seed replies with a list of IP addresses of nodes currently active on the network. This isn’t blind trust: the node only uses this list as a starting point.',
     note:'The DNS seed provides a list of IPs. The node doesn’t trust anyone yet, it just knows where to start.',nc:'m',
     vp:[0,1,2,3],cp:[],dnsA:true,dnsC:false,pe:[]},
    {label:'3 · Initial connection',head:'Step 3 — Connect to the first peers',
     body:'The node picks a few addresses from the DNS seed list and tries to connect. Each connection starts with a handshake: exchanging <code>version</code> and <code>verack</code> messages to make sure both speak the same protocol.',
     note:'The first connection succeeds. The node starts participating in the network.',nc:'m',
     vp:[0,1,2,3],cp:[0,1],dnsA:true,dnsC:true,pe:[[0,1]]},
    {label:'4 · Peer exchange',head:'Step 4 — Peer exchange via getaddr',
     body:'The node sends a <code>getaddr</code> message to a connected peer. The peer replies with an <code>addr</code> message containing a list of hundreds of other peer addresses it knows. From here the node can find more peers without depending on the DNS seed anymore.',
     note:'Peer exchange complete. The node now has a peer database for future connections.',nc:'m',
     vp:[0,1,2,3,4,5],cp:[0,1,2,3,4,5],dnsA:false,dnsC:false,pe:[[0,1],[0,2],[1,3],[2,4],[3,5]]},
    {label:'5 · Fully connected',head:'Step 5 — Node connected to the network',
     body:'The node now has 8 active outbound connections. It starts receiving transactions and blocks from peers, verifying all of them, and forwarding the valid ones. The node saves its peer list to disk so that when it’s shut down and restarted, it doesn’t need to start from scratch.',
     note:'The new node is now a full part of the Bitcoin network. This process usually completes within minutes.',nc:'g',
     vp:[0,1,2,3,4,5],cp:[0,1,2,3,4,5],dnsA:false,dnsC:false,pe:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]]},
  ];

  let cur=0, W=0;
  const H=300, NR=16, DNR=18;

  function setupCv(){
    const cv=g('b08-s85-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
  }

  function nx(n){return n.x*W;}
  function ny(n){return n.y*H;}

  function draw(){
    const cv=g('b08-s85-cv'); if(!cv||!W) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const s=STEPS[cur];

    if(s.dnsA||s.dnsC){
      ctx.beginPath();
      ctx.moveTo(nx(DNS_NODE),ny(DNS_NODE)); ctx.lineTo(nx(NEW_NODE),ny(NEW_NODE));
      ctx.strokeStyle=s.dnsC?'rgba(133,79,11,0.5)':'rgba(133,79,11,0.3)';
      ctx.lineWidth=s.dnsC?1.5:1;
      ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(nx(DNS_NODE),ny(DNS_NODE),DNR,0,Math.PI*2);
      ctx.fillStyle=C_DNS; ctx.globalAlpha=.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('DNS',nx(DNS_NODE),ny(DNS_NODE));
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.fillText(DNS_NODE.label,nx(DNS_NODE),ny(DNS_NODE)+DNR+10);
    }

    s.pe.forEach(([a,b])=>{
      if(!s.vp.includes(a)||!s.vp.includes(b)) return;
      ctx.beginPath();
      ctx.moveTo(nx(PEERS[a]),ny(PEERS[a])); ctx.lineTo(nx(PEERS[b]),ny(PEERS[b]));
      ctx.strokeStyle=EDGE; ctx.lineWidth=.5; ctx.stroke();
    });

    s.cp.forEach(i=>{
      ctx.beginPath();
      ctx.moveTo(nx(NEW_NODE),ny(NEW_NODE)); ctx.lineTo(nx(PEERS[i]),ny(PEERS[i]));
      ctx.strokeStyle='rgba(83,74,183,0.45)'; ctx.lineWidth=1.5; ctx.stroke();
    });

    PEERS.forEach((p,i)=>{
      if(!s.vp.includes(i)) return;
      const connected=s.cp.includes(i);
      ctx.beginPath(); ctx.arc(nx(p),ny(p),NR,0,Math.PI*2);
      ctx.fillStyle=connected?C_PEER:C_INACTIVE;
      ctx.globalAlpha=connected?.9:.5; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(connected?'✓':'P',nx(p),ny(p));
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.fillText(p.label,nx(p),ny(p)+NR+10);
    });

    ctx.beginPath(); ctx.arc(nx(NEW_NODE),ny(NEW_NODE),NR+2,0,Math.PI*2);
    ctx.fillStyle=C_NEW; ctx.globalAlpha=.95; ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('★',nx(NEW_NODE),ny(NEW_NODE));
    ctx.fillStyle=TXT; ctx.font='500 9px sans-serif';
    ctx.fillText(NEW_NODE.label,nx(NEW_NODE),ny(NEW_NODE)+NR+12);

    const items=[
      {c:C_NEW,l:'New node (you)'},
      {c:C_DNS,l:'DNS seed'},
      {c:C_PEER,l:'Connected peer'},
      {c:C_INACTIVE,l:'Peer found'},
    ];
    let lx=12, ly=H-16;
    items.forEach(it=>{
      ctx.fillStyle=it.c;
      ctx.beginPath(); ctx.arc(lx+5,ly,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(it.l,lx+13,ly);
      lx+=ctx.measureText(it.l).width+26;
    });
  }

  function renderStep(){
    const s=STEPS[cur];
    const cont=g('b08-s85-steps'); if(!cont) return;
    cont.innerHTML='';
    STEPS.forEach((st,i)=>{
      const b=document.createElement('button');
      b.className='b08-s85-step-btn'+(i===cur?' active':'');
      b.textContent=st.label;
      b.addEventListener('click',()=>{cur=i;renderStep();});
      cont.appendChild(b);
    });
    const dh=g('b08-s85-dhead'); if(dh) dh.textContent=s.head;
    const db=g('b08-s85-dbody'); if(db) db.innerHTML=s.body;
    const nt=g('b08-s85-note');
    if(nt){nt.textContent=s.note;nt.className='b08-s85-note '+s.nc;}
    draw();
  }

  setupCv(); renderStep();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{setupCv();draw();})).observe(g('b08-s85-cv')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.4 SIMULATION (Propagasi Block)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG    = dark?'#1A1A18':'#F8F7F5';
  const ENORM = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const EACT1 = 'rgba(133,79,11,0.5)';
  const EACT2 = 'rgba(15,110,86,0.5)';
  const C1_IDLE='#854F0B', C1_RECV='#F0A050';
  const C2_IDLE='#0F6E56', C2_RECV='#5DCAA5';
  const C_SRC ='#534AB7';

  const NODES=[
    {x:.50,y:.08},{x:.15,y:.28},{x:.85,y:.28},
    {x:.05,y:.62},{x:.35,y:.55},{x:.65,y:.55},
    {x:.95,y:.62},{x:.50,y:.88},
  ];
  const EDGES=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,4],[4,5],[5,6],[3,7],[4,7],[5,7]];
  const NR=12, H=200;
  let W1=0, W2=0;
  let recv1=new Set(), recv2=new Set();
  let act1=new Set(), act2=new Set();
  let running=false, timerInt=null, startTime=0;
  let kb1=0, kb2=0;

  function setupCv(cvId){
    const cv=g(cvId); if(!cv) return 0;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
    return W;
  }

  function drawNet(cvId,W,recv,active,cIdle,cRecv,eAct){
    const cv=g(cvId); if(!cv||!W) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,8); ctx.fill();
    EDGES.forEach(([a,b])=>{
      const isAct=active.has(`${a}-${b}`)||active.has(`${b}-${a}`);
      ctx.beginPath();
      ctx.moveTo(NODES[a].x*W,NODES[a].y*H);
      ctx.lineTo(NODES[b].x*W,NODES[b].y*H);
      ctx.strokeStyle=isAct?eAct:ENORM;
      ctx.lineWidth=isAct?1.5:.5; ctx.stroke();
    });
    NODES.forEach((n,i)=>{
      const isSrc=i===0, rcv=recv.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*H,NR,0,Math.PI*2);
      ctx.fillStyle=isSrc?C_SRC:rcv?cRecv:cIdle;
      ctx.globalAlpha=rcv||isSrc?.9:.5; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(rcv||isSrc?'✓':'N', n.x*W, n.y*H);
    });
  }

  function draw(){
    drawNet('b08-s84-c1',W1,recv1,act1,C1_IDLE,C1_RECV,EACT1);
    drawNet('b08-s84-c2',W2,recv2,act2,C2_IDLE,C2_RECV,EACT2);
  }

  function elapsed(){return (Date.now()-startTime)/1000;}

  function updateStats(){
    const t=elapsed();
    const d1=g('b08-s84-data1'); if(d1) d1.textContent=kb1+' KB';
    const d2=g('b08-s84-data2'); if(d2) d2.textContent=kb2+' KB';
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' sec';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' sec';
    const dn1=g('b08-s84-done1'); if(dn1) dn1.textContent=`${recv1.size}/8`;
    const dn2=g('b08-s84-done2'); if(dn2) dn2.textContent=`${recv2.size}/8`;
  }

  function spreadNode(from,to,isCompact){
    const recv=isCompact?recv2:recv1;
    const active=isCompact?act2:act1;
    const delay=isCompact?120+Math.random()*150:400+Math.random()*500;
    const dataPerHop=isCompact?Math.round(15+Math.random()*10):Math.round(180+Math.random()*120);
    return new Promise(resolve=>{
      setTimeout(()=>{
        active.add(`${from}-${to}`);
        if(isCompact) kb2+=dataPerHop; else kb1+=dataPerHop;
        draw(); updateStats();
        setTimeout(()=>{recv.add(to);draw();updateStats();resolve();},100);
      },delay);
    });
  }

  async function runBFS(isCompact){
    const recv=isCompact?recv2:recv1;
    recv.add(0);
    const queue=[0],visited=new Set([0]);
    while(queue.length>0){
      const cur=queue.shift();
      const neighbors=EDGES
        .filter(([a,b])=>a===cur||b===cur)
        .map(([a,b])=>a===cur?b:a);
      await Promise.all(neighbors.map(async nb=>{
        await spreadNode(cur,nb,isCompact);
        if(!visited.has(nb)){visited.add(nb);queue.push(nb);}
      }));
    }
  }

  const runBtn=g('b08-s84-run');
  if(runBtn) runBtn.addEventListener('click',async()=>{
    if(running) return;
    running=true; runBtn.disabled=true;
    recv1=new Set(); recv2=new Set();
    act1=new Set(); act2=new Set();
    kb1=0; kb2=0;
    draw(); updateStats();
    const note=g('b08-s84-note1');
    if(note){note.textContent='A miner found a new block! Both methods spread simultaneously...';note.className='b08-s84-note run-note';}
    startTime=Date.now();
    timerInt=setInterval(()=>updateStats(),100);
    await Promise.all([runBFS(false),runBFS(true)]);
    clearInterval(timerInt);
    const t=elapsed();
    const d1=g('b08-s84-data1'); if(d1) d1.textContent=kb1+' KB';
    const d2=g('b08-s84-data2'); if(d2) d2.textContent=kb2+' KB';
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' sec';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' sec';
    if(note){note.textContent=`✓ Done! Regular block: ~${kb1} KB. Compact Block: ~${kb2} KB. Compact Block saves ${Math.round((1-kb2/kb1)*100)}% bandwidth.`;note.className='b08-s84-note done-note';}
    running=false; runBtn.disabled=false;
  });

  const resetBtn=g('b08-s84-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt); running=false;
    recv1=new Set(); recv2=new Set();
    act1=new Set(); act2=new Set();
    kb1=0; kb2=0; draw(); updateStats();
    ['b08-s84-data1','b08-s84-data2'].forEach(id=>{const el=g(id);if(el)el.textContent='0 KB';});
    ['b08-s84-time1','b08-s84-time2'].forEach(id=>{const el=g(id);if(el)el.textContent='0.0 sec';});
    ['b08-s84-done1','b08-s84-done2'].forEach(id=>{const el=g(id);if(el)el.textContent='0/8';});
    const note=g('b08-s84-note1');
    if(note){note.textContent='A regular block sends all the data. Compact Block only sends the header + transaction IDs because the receiving node already has the transactions in its mempool.';note.className='b08-s84-note idle-note';}
    if(runBtn) runBtn.disabled=false;
  });

  const t1=g('b08-s84-t1'),t2=g('b08-s84-t2');
  const p1=g('b08-s84-p1'),p2=g('b08-s84-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b08-s84-tab s84-act'; t2.className='b08-s84-tab';
    p1.className='b08-s84-pane show';  p2.className='b08-s84-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b08-s84-tab s84-act'; t1.className='b08-s84-tab';
    p2.className='b08-s84-pane show';  p1.className='b08-s84-pane';
  });

  W1=setupCv('b08-s84-c1'); W2=setupCv('b08-s84-c2'); draw();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      W1=setupCv('b08-s84-c1'); W2=setupCv('b08-s84-c2'); draw();
    })).observe(g('b08-s84-p1')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.3 SIMULATION (Propagasi Transaksi)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG          = dark?'#1A1A18':'#F4F4F0';
  const EDGE_IDLE   = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const EDGE_ACTIVE = 'rgba(83,74,183,0.5)';
  const C_IDLE   = '#534AB7';
  const C_SOURCE = '#0F6E56';
  const C_RECV   = '#7C3AED';

  const NODES=[
    {x:.50,y:.10},{x:.22,y:.22},{x:.78,y:.22},
    {x:.08,y:.48},{x:.36,y:.42},{x:.64,y:.42},
    {x:.92,y:.48},{x:.18,y:.72},{x:.42,y:.68},
    {x:.58,y:.68},{x:.82,y:.72},{x:.50,y:.88},
  ];
  const EDGES=[
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,5],[2,6],
    [3,4],[3,7],[4,5],[4,8],[5,6],[5,9],[6,10],
    [7,8],[7,11],[8,9],[9,10],[10,11],[8,11],
  ];
  const NR=15, H=300;
  let W=0, received=new Set(), activeEdges=new Set();
  let running=false, startTime=0, timerInt=null;

  function setupCv(){
    const cv=g('b08-s83-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
  }

  function nx(i){return NODES[i].x*W;}
  function ny(i){return NODES[i].y*H;}

  function draw(){
    const cv=g('b08-s83-cv'); if(!cv) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    EDGES.forEach(([a,b])=>{
      const active=activeEdges.has(`${a}-${b}`)||activeEdges.has(`${b}-${a}`);
      ctx.beginPath();
      ctx.moveTo(nx(a),ny(a)); ctx.lineTo(nx(b),ny(b));
      ctx.strokeStyle=active?EDGE_ACTIVE:EDGE_IDLE;
      ctx.lineWidth=active?1.5:.5; ctx.stroke();
    });

    NODES.forEach((n,i)=>{
      const isSource=i===0&&received.has(0);
      const color=isSource?C_SOURCE:received.has(i)?C_RECV:C_IDLE;
      ctx.beginPath(); ctx.arc(nx(i),ny(i),NR,0,Math.PI*2);
      ctx.fillStyle=color;
      ctx.globalAlpha=received.has(i)?.95:.55;
      ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(received.has(i)?'✓':'N', nx(i),ny(i));
      ctx.fillStyle=dark?'#888':'#52524C'; ctx.font='9px sans-serif';
      ctx.fillText('N'+i, nx(i), ny(i)+NR+9);
    });
  }

  function addLog(t, msg, cls){
    const log=g('b08-s83-log'); if(!log) return;
    const row=document.createElement('div'); row.className='b08-s83-log-row';
    row.innerHTML=`<span class="b08-s83-log-t">${t.toFixed(1)}s</span><span class="b08-s83-log-m ${cls||''}">${msg}</span>`;
    log.appendChild(row);
    log.scrollTop=log.scrollHeight;
  }

  function elapsed(){return (Date.now()-startTime)/1000;}

  function updateStat(){
    const s=g('b08-s83-stat'); if(s) s.textContent=`Nodes received: ${received.size} / ${NODES.length}`;
  }

  function spread(from, to){
    return new Promise(resolve=>{
      const delay=180+Math.random()*280;
      setTimeout(()=>{
        activeEdges.add(`${from}-${to}`);
        draw();
        setTimeout(()=>{
          if(!received.has(to)){
            received.add(to);
            addLog(elapsed(),`N${to} received from N${from} — verification ok, forwarded`,'ok-log');
          } else {
            addLog(elapsed(),`N${to} already has this tx — duplicate, discarded`,'dup-log');
          }
          updateStat(); draw();
          resolve();
        },150);
      },delay);
    });
  }

  async function runPropagation(){
    running=true;
    const sendBtn=g('b08-s83-send'); if(sendBtn) sendBtn.disabled=true;

    received.add(0);
    updateStat(); draw();
    addLog(0,'N0 (sender) creates a transaction and broadcasts to peers','ok-log');

    const note=g('b08-s83-note');
    if(note){note.textContent='The transaction is spreading... Each node verifies before forwarding to its peers.';note.className='b08-s83-note running-note';}

    startTime=Date.now();
    timerInt=setInterval(()=>{
      const el=g('b08-s83-timer'); if(el) el.textContent=elapsed().toFixed(1)+' sec';
    },100);

    const queue=[0], visited=new Set([0]);
    while(queue.length>0){
      const cur=queue.shift();
      const neighbors=EDGES
        .filter(([a,b])=>a===cur||b===cur)
        .map(([a,b])=>a===cur?b:a);
      await Promise.all(neighbors.map(async nb=>{
        await spread(cur,nb);
        if(!visited.has(nb)){visited.add(nb);queue.push(nb);}
      }));
    }

    clearInterval(timerInt);
    const t=elapsed();
    const el=g('b08-s83-timer'); if(el) el.textContent=t.toFixed(1)+' sec';
    addLog(t,`✓ All ${NODES.length} nodes received the transaction in ${t.toFixed(1)} seconds`,'ok-log');
    if(note){note.textContent=`✓ The transaction spread to all ${NODES.length} nodes in ${t.toFixed(1)} seconds. In the real world with thousands of nodes, the process takes about 5-15 seconds.`;note.className='b08-s83-note done-note';}
    running=false;
    if(sendBtn) sendBtn.disabled=false;
  }

  const sendBtn=g('b08-s83-send');
  if(sendBtn) sendBtn.addEventListener('click',()=>{
    if(running) return;
    received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Nodes received: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 sec';
    draw(); runPropagation();
  });

  const resetBtn=g('b08-s83-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt);
    running=false; received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='<div class="b08-s83-log-row"><span class="b08-s83-log-t">—</span><span class="b08-s83-log-m">Click "Send Transaction" to start the simulation</span></div>';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Nodes received: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 sec';
    const note=g('b08-s83-note'); if(note){note.textContent='The transaction will spread from the sending node to the whole network through the gossiping mechanism. Each node verifies before forwarding.';note.className='b08-s83-note idle-note';}
    const sendBtn2=g('b08-s83-send'); if(sendBtn2) sendBtn2.disabled=false;
    draw();
  });

  setupCv(); draw();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{setupCv();draw();})).observe(g('b08-s83-cv')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.2 SIMULATION (P2P vs Terpusat)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark?'#222':'#F4F4F0';
  const EDGEC= dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
  const EDGED= dark?'rgba(200,50,50,0.15)':'rgba(200,50,50,0.12)';
  const CA='#534AB7', CD='#A32D2D', CS='#0F6E56';

  // === P2P ===
  const PN=[
    {x:.50,y:.14},{x:.18,y:.30},{x:.82,y:.30},
    {x:.08,y:.60},{x:.36,y:.54},{x:.64,y:.54},
    {x:.92,y:.60},{x:.22,y:.84},{x:.50,y:.82},{x:.78,y:.84}
  ];
  const PE=[[0,1],[0,2],[1,2],[1,3],[1,4],[2,5],[2,6],[3,4],[3,7],[4,5],[4,8],[5,6],[5,9],[6,9],[7,8],[8,9]];
  const PR=16, PH=300;
  let pDead=new Set(), pW=0;

  function setupCv(cv,H){
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
    return W;
  }

  function drawP2P(){
    const cv=g('b08-s82-c1'); if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=pW||cv.getBoundingClientRect().width||300;
    ctx.clearRect(0,0,W,PH);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,PH,12); ctx.fill();

    PE.forEach(([a,b])=>{
      const ad=pDead.has(a), bd=pDead.has(b);
      ctx.beginPath();
      ctx.moveTo(PN[a].x*W,PN[a].y*PH); ctx.lineTo(PN[b].x*W,PN[b].y*PH);
      ctx.strokeStyle=(ad||bd)?EDGED:EDGEC;
      ctx.lineWidth=(ad||bd)?.5:1; ctx.stroke();
    });

    PN.forEach((n,i)=>{
      const dead=pDead.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*PH,PR,0,Math.PI*2);
      ctx.fillStyle=dead?CD:CA;
      ctx.globalAlpha=dead?.45:.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(dead?'✕':'N', n.x*W, n.y*PH);
    });

    const alive=PN.length-pDead.size;
    const s=g('b08-s82-s1'); if(s) s.textContent=`Active: ${alive} / ${PN.length}`;
    const note=g('b08-s82-n1'); if(!note) return;
    if(alive===0){
      note.textContent='💀 All nodes attacked — the network is completely dead. But this requires attacking '+PN.length+' nodes simultaneously around the world. Far harder than attacking one central server.';
      note.className='b08-s82-note dead-note';
    } else if(pDead.size===0){
      note.textContent='The P2P network is running fully. Try clicking a few nodes to attack them.';
      note.className='b08-s82-note safe-note';
    } else if(alive>=4){
      note.textContent=`✓ ${pDead.size} nodes attacked — the network keeps running with ${alive} active nodes. Other nodes automatically connect around the dead nodes.`;
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`⚠️ ${pDead.size} nodes attacked — the network is degraded, only ${alive} active nodes.`;
      note.className='b08-s82-note warn-note';
    }
  }

  const c1=g('b08-s82-c1');
  if(c1){
    c1.addEventListener('click',e=>{
      const rect=c1.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const W=pW||rect.width||300;
      PN.forEach((n,i)=>{
        const dx=mx-n.x*W, dy=my-n.y*PH;
        if(Math.sqrt(dx*dx+dy*dy)<=PR+5){
          if(pDead.has(i)) pDead.delete(i); else pDead.add(i);
        }
      });
      drawP2P();
    });
  }
  const r1=g('b08-s82-r1');
  if(r1) r1.addEventListener('click',()=>{ pDead=new Set(); drawP2P(); });

  // === CENTRALIZED ===
  const CN=[
    {x:.12,y:.15},{x:.50,y:.08},{x:.88,y:.15},
    {x:.06,y:.50},{x:.94,y:.50},
    {x:.12,y:.85},{x:.50,y:.92},{x:.88,y:.85},
    {x:.32,y:.50},{x:.68,y:.50}
  ];
  const SVR={x:.50,y:.50};
  const CR=15, CH=300, SR=24;
  let cDead=new Set(), svrDead=false, cW=0;

  function drawCentral(){
    const cv=g('b08-s82-c2'); if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cW||cv.getBoundingClientRect().width||300;
    ctx.clearRect(0,0,W,CH);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,CH,12); ctx.fill();

    CN.forEach((n,i)=>{
      const dead=svrDead||cDead.has(i);
      ctx.beginPath();
      ctx.moveTo(n.x*W,n.y*CH); ctx.lineTo(SVR.x*W,SVR.y*CH);
      ctx.strokeStyle=dead?EDGED:EDGEC;
      ctx.lineWidth=dead?.5:1; ctx.stroke();
    });

    ctx.beginPath(); ctx.arc(SVR.x*W,SVR.y*CH,SR,0,Math.PI*2);
    ctx.fillStyle=svrDead?CD:CS;
    ctx.globalAlpha=svrDead?.45:.95; ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(svrDead?'✕':'SVR', SVR.x*W, SVR.y*CH);
    ctx.fillStyle=dark?'#888':'#3A3A35'; ctx.font='9px sans-serif';
    ctx.fillText(svrDead?'DEAD':'Central server', SVR.x*W, SVR.y*CH+SR+11);

    CN.forEach((n,i)=>{
      const dead=svrDead||cDead.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*CH,CR,0,Math.PI*2);
      ctx.fillStyle=dead?CD:CA;
      ctx.globalAlpha=dead?.45:.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(dead?'✕':'N', n.x*W, n.y*CH);
    });

    const alive=svrDead?0:CN.length-cDead.size;
    const s=g('b08-s82-s2');
    if(s) s.textContent=`Active: ${alive} / ${CN.length} \u00a0|\u00a0 Server: ${svrDead?'DEAD':'online'}`;
    const note=g('b08-s82-n2'); if(!note) return;
    if(svrDead){
      note.textContent='💀 The central server is attacked — the whole network is paralyzed instantly. All '+CN.length+' nodes die even though their hardware is still alive. This is the single point of failure: one attack, everything destroyed.';
      note.className='b08-s82-note dead-note';
    } else if(cDead.size===0){
      note.textContent='The central server is online. All nodes connected. Try clicking the central server (green in the center) to attack it.';
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`${cDead.size} client nodes attacked. As long as the central server is alive, other nodes can still communicate. Try attacking the central server to see the difference.`;
      note.className='b08-s82-note warn-note';
    }
  }

  const c2=g('b08-s82-c2');
  if(c2){
    c2.addEventListener('click',e=>{
      const rect=c2.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const W=cW||rect.width||300;
      const dx=mx-SVR.x*W, dy=my-SVR.y*CH;
      if(Math.sqrt(dx*dx+dy*dy)<=SR+6){ svrDead=!svrDead; drawCentral(); return; }
      CN.forEach((n,i)=>{
        const dx2=mx-n.x*W, dy2=my-n.y*CH;
        if(Math.sqrt(dx2*dx2+dy2*dy2)<=CR+5){
          if(cDead.has(i)) cDead.delete(i); else cDead.add(i);
        }
      });
      drawCentral();
    });
  }
  const r2=g('b08-s82-r2');
  if(r2) r2.addEventListener('click',()=>{ cDead=new Set(); svrDead=false; drawCentral(); });

  // tabs
  const t1=g('b08-s82-t1'), t2=g('b08-s82-t2');
  const pp1=g('b08-s82-p1'), pp2=g('b08-s82-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b08-s82-tab active-p2p'; t2.className='b08-s82-tab';
    pp1.className='b08-s82-pane show';    pp2.className='b08-s82-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b08-s82-tab active-cl'; t1.className='b08-s82-tab';
    pp2.className='b08-s82-pane show';   pp1.className='b08-s82-pane';
  });

  // init
  if(c1){ pW=setupCv(c1,PH); drawP2P(); }
  if(c2){ cW=setupCv(c2,CH); drawCentral(); }

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      if(c1){ pW=setupCv(c1,PH); drawP2P(); }
      if(c2){ cW=setupCv(c2,CH); drawCentral(); }
    })).observe(g('b08-s82-p1')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.1 SIMULATION (P2P Network)
// ============================================================
(function() {
  const canvas = document.getElementById('b08-s81-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG   = dark ? '#1A1A18' : '#F4F4F0';
  const LINE = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const LACT = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';

  const NODES = [
    {id:0, label:'Full Node A',  type:'full',   color:'#534AB7', x:0.18, y:0.25,
     detail:{head:'Full Node — Jakarta', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                    vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                       vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',      vc:'p'},
      {k:'Connections',   v:'Connected to 8 peers',                         vc:''},
      {k:'Main function', v:'Keeps the consensus rules — no need to trust anyone', vc:''},
    ]}},
    {id:1, label:'Mining Node',  type:'mining',  color:'#0F6E56', x:0.50, y:0.12,
     detail:{head:'Mining Node — Singapore', color:'#0F6E56', rows:[
      {k:'Type',          v:'Mining node (full node + mining)',              vc:'g'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'g'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'g'},
      {k:'Mining',        v:'Actively searching for a nonce to create a new block',  vc:'g'},
      {k:'Main function', v:'Secures the network and earns the block reward', vc:''},
    ]}},
    {id:2, label:'Full Node B',  type:'full',   color:'#534AB7', x:0.82, y:0.25,
     detail:{head:'Full Node — Frankfurt', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                     vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'p'},
      {k:'Connections',   v:'Connected to 6 peers',                          vc:''},
      {k:'Main function', v:'Keeps the consensus rules independently',       vc:''},
    ]}},
    {id:3, label:'Pruned Node',  type:'pruned', color:'#854F0B', x:0.25, y:0.68,
     detail:{head:'Pruned Node — Tokyo', color:'#854F0B', rows:[
      {k:'Type',          v:'Pruned node',                                   vc:'m'},
      {k:'Blockchain',    v:'Only ~10 GB of the latest blocks',             vc:'m'},
      {k:'Verification',  v:'Verifies all rules — old data deleted after verification', vc:'m'},
      {k:'Storage',       v:'Far more economical than a full node',          vc:''},
      {k:'Main function', v:'Full verification with limited storage',        vc:''},
    ]}},
    {id:4, label:'Full Node C',  type:'full',   color:'#534AB7', x:0.50, y:0.72,
     detail:{head:'Full Node — Sao Paulo', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                     vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'p'},
      {k:'Connections',   v:'Connected to 7 peers',                          vc:''},
      {k:'Main function', v:'No central point — every node is independent',   vc:''},
    ]}},
    {id:5, label:'SPV Node',     type:'spv',    color:'#52524C', x:0.75, y:0.68,
     detail:{head:'SPV Node — Mobile Wallet', color:'#888780', rows:[
      {k:'Type',          v:'SPV (Simplified Payment Verification)',         vc:''},
      {k:'Data',          v:'Only block headers — ~60 MB',                  vc:''},
      {k:'Verification',  v:'Does not fully verify transactions',            vc:'r'},
      {k:'Trust',         v:'Trusts miners that the longest chain is valid', vc:'r'},
      {k:'Main function', v:'Lightweight for mobile — suitable for everyday payments', vc:''},
    ]}},
  ];

  const EDGES = [[0,1],[0,3],[0,4],[1,2],[1,4],[2,4],[2,5],[3,4],[4,5]];

  let selected = null;
  let W = 0, H = 300;

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  const R = 18;
  function nx(n){ return n.x * W; }
  function ny(n){ return n.y * H; }

  function draw() {
    setup();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0, 0, W, H, 12); ctx.fill();

    EDGES.forEach(([a, b]) => {
      const na = NODES[a], nb = NODES[b];
      const isSel = (selected === a || selected === b);
      ctx.beginPath();
      ctx.moveTo(nx(na), ny(na)); ctx.lineTo(nx(nb), ny(nb));
      ctx.strokeStyle = isSel ? LACT : LINE;
      ctx.lineWidth   = isSel ? 1.5 : 0.5;
      ctx.stroke();
    });

    NODES.forEach((n, i) => {
      const isSel = selected === i;
      if (isSel) {
        ctx.save();
        ctx.shadowColor = n.color; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(nx(n), ny(n), R + 2, 0, Math.PI * 2);
        ctx.fillStyle = n.color; ctx.fill();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(nx(n), ny(n), R, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = isSel ? 1 : 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (isSel) {
        ctx.beginPath(); ctx.arc(nx(n), ny(n), R + 4, 0, Math.PI * 2);
        ctx.strokeStyle = n.color; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const letter = n.type === 'full' ? 'F' : n.type === 'mining' ? 'M' : n.type === 'pruned' ? 'P' : 'S';
      ctx.fillText(letter, nx(n), ny(n));
      ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
      ctx.font = '10px sans-serif';
      ctx.fillText(n.label, nx(n), ny(n) + R + 10);
    });
  }

  function getNodeAt(mx, my) {
    for (let i = 0; i < NODES.length; i++) {
      const n = NODES[i];
      const dx = mx - nx(n), dy = my - ny(n);
      if (Math.sqrt(dx*dx + dy*dy) <= R + 6) return i;
    }
    return -1;
  }

  function showDetail(i) {
    const n = NODES[i];
    const d = n.detail;
    const head = document.getElementById('b08-s81-dhead');
    const body = document.getElementById('b08-s81-dbody');
    const det  = document.getElementById('b08-s81-detail');
    const hint = document.getElementById('b08-s81-hint');
    if (!head || !body || !det) return;
    head.textContent = d.head;
    head.style.background = d.color;
    body.innerHTML = '';
    d.rows.forEach(r => {
      const el = document.createElement('div');
      el.className = 'b08-s81-drow';
      el.innerHTML = `<span class="b08-s81-dk">${r.k}</span><span class="b08-s81-dv ${r.vc}">${r.v}</span>`;
      body.appendChild(el);
    });
    det.style.display = 'block';
    if (hint) hint.style.display = 'none';
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (hit >= 0) {
      selected = selected === hit ? null : hit;
      const det  = document.getElementById('b08-s81-detail');
      const hint = document.getElementById('b08-s81-hint');
      if (selected !== null) {
        showDetail(selected);
      } else {
        if (det)  det.style.display  = 'none';
        if (hint) hint.style.display = 'block';
      }
    }
    draw();
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const hit  = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    canvas.style.cursor = hit >= 0 ? 'pointer' : 'default';
  });

  draw();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => requestAnimationFrame(() => draw())).observe(canvas);
})();

// ============================================================
// PAGE 12 · BAB 9 · NAVIGATION
// ============================================================
function showSectionInContentB9(sectionId, sbId) {
  document.querySelectorAll('#page-bab9 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab9 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab9-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 12 · BAB 9 · TOPBAR
// ============================================================
document.getElementById('back-home-b9').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b9').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 12 · BAB 9 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab9').addEventListener('click', () => navigate('page-bab9'));

// ============================================================
// PAGE 12 · BAB 9 · SIDEBAR EVENTS (9.1 - 9.6)
// ============================================================
document.getElementById('sb-9-1').addEventListener('click', () => showSectionInContentB9('section-9-1', 'sb-9-1'));
document.getElementById('sb-9-2').addEventListener('click', () => showSectionInContentB9('section-9-2', 'sb-9-2'));
document.getElementById('sb-9-3').addEventListener('click', () => showSectionInContentB9('section-9-3', 'sb-9-3'));
document.getElementById('sb-9-4').addEventListener('click', () => showSectionInContentB9('section-9-4', 'sb-9-4'));
document.getElementById('sb-9-5').addEventListener('click', () => showSectionInContentB9('section-9-5', 'sb-9-5'));
document.getElementById('sb-9-6').addEventListener('click', () => showSectionInContentB9('section-9-6', 'sb-9-6'));

// ============================================================
// PAGE 12 · BAB 9 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab9 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB9(target, sb);
  });
});

// ============================================================
// PAGE 12 · BAB 9 · 9.6 SIMULATION (Fee Market Future)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG  =dark?'#1A1A18':'#F4F4F0';
  const GRID=dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)';
  const TXT2=dark?'#A0A098':'#3A3A35';

  const YEARS=[], REWARDS=[], FEE_OPT=[], FEE_PESS=[];
  for(let y=2009;y<=2060;y++){
    YEARS.push(y);
    let reward=50;
    const halvings=Math.floor((y-2009)/4);
    for(let h=0;h<halvings;h++) reward/=2;
    REWARDS.push(Math.max(reward,0.00000001));
    const t=Math.max(0,y-2009);
    FEE_OPT.push(Math.min(0.1*Math.pow(1.12,t)*Math.min(1,(y-2009)/20),200));
    FEE_PESS.push(Math.min(0.05*Math.pow(1.04,t)*Math.min(1,(y-2009)/25),20));
  }
  const NOW_IDX=YEARS.indexOf(2024);

  function setupCv(id,H){
    const cv=g(id); if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    return {ctx,W,H};
  }

  function drawChart1(){
    const r=setupCv('b09-s96-cv1',260); if(!r) return;
    const {ctx,W,H}=r;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();
    const pad={t:20,r:16,b:30,l:50};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
    const maxVal=Math.max(...REWARDS,...FEE_OPT,...REWARDS.map((r,i)=>r+FEE_OPT[i]));
    function xp(i){return pad.l+i/(YEARS.length-1)*cw;}
    function yp(v){return pad.t+ch*(1-Math.min(v,maxVal)/maxVal);}
    for(let gv=0;gv<=4;gv++){
      const y=pad.t+gv*(ch/4);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=GRID;ctx.lineWidth=0.5;ctx.stroke();
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='right';ctx.textBaseline='middle';
      ctx.fillText((maxVal*(1-gv/4)).toFixed(1),pad.l-4,y);
    }
    ctx.beginPath();ctx.moveTo(xp(NOW_IDX),pad.t);ctx.lineTo(xp(NOW_IDX),pad.t+ch);
    ctx.strokeStyle=dark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)';
    ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('2024',xp(NOW_IDX),pad.t+2);
    // Total dashed amber
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]+FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#F0A050';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
    // Fee area
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.lineTo(xp(YEARS.length-1),yp(0));ctx.lineTo(xp(0),yp(0));ctx.closePath();
    ctx.fillStyle=dark?'rgba(15,110,86,0.2)':'rgba(15,110,86,0.15)';ctx.fill();
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#0F6E56';ctx.lineWidth=1.5;ctx.stroke();
    // Reward
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=2;ctx.stroke();
    // X labels
    [2009,2020,2024,2032,2040,2050,2060].forEach(yr=>{
      const i=YEARS.indexOf(yr);if(i<0)return;
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText(yr,xp(i),H-pad.b+4);
    });
  }

  function drawChart2(){
    const r=setupCv('b09-s96-cv2',200); if(!r) return;
    const {ctx,W,H}=r;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();
    const pad={t:16,r:16,b:28,l:46};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
    const maxVal=Math.max(...FEE_OPT,...FEE_PESS,...REWARDS);
    function xp(i){return pad.l+i/(YEARS.length-1)*cw;}
    function yp(v){return pad.t+ch*(1-Math.min(v,maxVal)/maxVal);}
    for(let gv=0;gv<=3;gv++){
      const y=pad.t+gv*(ch/3);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=GRID;ctx.lineWidth=0.5;ctx.stroke();
    }
    ctx.beginPath();ctx.moveTo(xp(NOW_IDX),pad.t);ctx.lineTo(xp(NOW_IDX),pad.t+ch);
    ctx.strokeStyle=dark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.1)';
    ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    // Reward dashed
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
    // Pesimis
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_PESS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#A32D2D';ctx.lineWidth=1.5;ctx.stroke();
    // Optimis
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#0F6E56';ctx.lineWidth=2;ctx.stroke();
    [2009,2024,2040,2060].forEach(yr=>{
      const i=YEARS.indexOf(yr);if(i<0)return;
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText(yr,xp(i),H-pad.b+4);
    });
  }

  const t1=g('b09-s96-t1'), t2=g('b09-s96-t2');
  const p1=g('b09-s96-p1'), p2=g('b09-s96-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s96-tab s96-act'; t2.className='b09-s96-tab';
    p1.className='b09-s96-pane show'; p2.className='b09-s96-pane';
    requestAnimationFrame(drawChart1);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s96-tab s96-act'; t1.className='b09-s96-tab';
    p2.className='b09-s96-pane show'; p1.className='b09-s96-pane';
    requestAnimationFrame(drawChart2);
  });

  drawChart1();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{drawChart1();drawChart2();})).observe(g('b09-s96-cv1')||document.body);
  }
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.5 SIMULATION (Fee Estimator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const BTC_PRICE=65000;
  let curMp='quiet', curTgt='next';

  const DATA={
    quiet:{
      next: {rate:2,  eta:'Next block (~10 minutes)',           conf:'High',      cls:'s95-good', blocks:1},
      '3blk':{rate:1, eta:'1-2 blocks (~10-20 minutes)',         conf:'High',      cls:'s95-good', blocks:1},
      '6blk':{rate:1, eta:'1-3 blocks (~10-30 minutes)',         conf:'High',      cls:'s95-good', blocks:1},
      '1day':{rate:1, eta:'Next block — mempool very quiet',      conf:'Very high', cls:'s95-good', blocks:1},
    },
    normal:{
      next: {rate:15, eta:'1-2 blocks (~10-20 minutes)',  conf:'Medium', cls:'s95-warn', blocks:2},
      '3blk':{rate:8, eta:'2-4 blocks (~20-40 minutes)',  conf:'Medium', cls:'s95-warn', blocks:3},
      '6blk':{rate:5, eta:'4-8 blocks (~40-80 minutes)',  conf:'Medium', cls:'s95-warn', blocks:6},
      '1day':{rate:2, eta:'A few hours up to 1 day',       conf:'Low',    cls:'s95-warn', blocks:10},
    },
    busy:{
      next: {rate:80, eta:'1-3 blocks (~10-30 minutes)', conf:'Medium', cls:'s95-warn', blocks:3},
      '3blk':{rate:50,eta:'3-6 blocks (~30-60 minutes)', conf:'Medium', cls:'s95-warn', blocks:5},
      '6blk':{rate:30,eta:'6-12 blocks (~1-2 hours)',    conf:'Low',    cls:'s95-warn', blocks:10},
      '1day':{rate:10,eta:'Can be more than 1 day',      conf:'Low',    cls:'s95-bad',  blocks:20},
    },
    vbusy:{
      next: {rate:180,eta:'1-5 blocks (~10-50 minutes)',  conf:'Low',       cls:'s95-bad', blocks:5},
      '3blk':{rate:120,eta:'3-8 blocks (~30-80 minutes)', conf:'Low',       cls:'s95-bad', blocks:8},
      '6blk':{rate:80, eta:'6-20 blocks (~1-3 hours)',    conf:'Low',       cls:'s95-bad', blocks:18},
      '1day':{rate:30, eta:'Can be several days',          conf:'Very low',  cls:'s95-bad', blocks:30},
    },
  };

  const EXPLAIN={
    quiet:{
      next:'The mempool is quiet. Almost all transactions are confirmed in the next block even with a very low fee.',
      '3blk':'The mempool is quiet. A fee of 1 sat/vB is more than enough — the transaction will likely be confirmed in the first block.',
      '6blk':'The mempool is quiet. No need to pay more than the minimum. All transactions are confirmed quickly.',
      '1day':'The mempool is quiet. Even the minimum fee of 1 sat/vB is enough. This is the best time to send a non-urgent transaction.',
    },
    normal:{
      next:'The mempool is normal. A fee of 15 sat/vB places the transaction above the majority of the queue. The estimator analyzes the current mempool fee distribution.',
      '3blk':'The mempool is normal. A fee of 8 sat/vB is enough for confirmation within a few blocks. The miner will process this after the queue above it clears.',
      '6blk':'The mempool is normal. A fee of 5 sat/vB places the transaction in the middle zone. There’s a risk of delay if there’s a sudden surge of transactions.',
      '1day':'The mempool is normal but this low fee is risky. If mempool conditions worsen, the transaction can be stuck longer than expected.',
    },
    busy:{
      next:'The mempool is busy. A fee of 80 sat/vB is needed to compete with the long queue. The estimator predicts it will take a few blocks for your turn.',
      '3blk':'The mempool is busy. A fee of 50 sat/vB places the transaction in the medium priority zone. There’s fairly high uncertainty.',
      '6blk':'The mempool is busy. A fee of 30 sat/vB is the minimum to be confirmed within the hour. Consider waiting if it’s not urgent.',
      '1day':'The mempool is busy and this fee is very low. The transaction might not be confirmed today. Use only if it’s really not urgent.',
    },
    vbusy:{
      next:'The mempool is very busy. A fee of 180 sat/vB is needed to get into the next block but confidence is low. Consider whether this is really urgent.',
      '3blk':'The mempool is very busy. A fee of 120 sat/vB is still very expensive. If it’s not urgent, wait until conditions ease.',
      '6blk':'The mempool is very busy. A fee of 80 sat/vB might not be enough if conditions worsen again. The risk of getting stuck is very real.',
      '1day':'The mempool is very busy. A fee of 30 sat/vB can be stuck for days. It’s strongly recommended to wait until mempool conditions ease.',
    },
  };

  function renderBlocks(n){
    const track=g('b09-s95-blocks'); if(!track) return;
    const show=Math.min(n,20);
    let html='';
    for(let i=0;i<show;i++){
      if(i===0) html+=`<div class="b09-s95-block your">TX</div>`;
      else html+=`<div class="b09-s95-block full"></div>`;
    }
    if(n>20) html+=`<span class="b09-s95-more">+${n-20} more blocks</span>`;
    track.innerHTML=html;
  }

  function update(){
    const d=DATA[curMp][curTgt];
    const ex=EXPLAIN[curMp][curTgt];
    const szEl=document.getElementById('b09-s95-size');
    const nIn=szEl?parseInt(szEl.value,10):1;
    const vb=Math.round(11+nIn*68+2*31);          // P2WPKH: overhead + inputs + 2 outputs
    const totalSat=d.rate*vb;
    const szv=document.getElementById('b09-s95-size-val');
    if(szv) szv.textContent=nIn+(nIn===1?' input':' inputs');
    const szn=document.getElementById('b09-s95-size-note');
    if(szn){
      szn.innerHTML = nIn===1
        ? 'The simplest transaction: <b>1 input, 2 outputs</b>, about <b>'+vb+' vBytes</b>. Drag right to see what happens when your funds are scattered across many small UTXOs.'
        : 'With <b>'+nIn+' inputs</b>, the size becomes about <b>'+vb+' vBytes</b>, or <b>'+(vb/141).toFixed(1)+'x</b> larger than the simplest transaction. The fee grows by the same factor, and notice that <b>the amount of BTC being sent makes no difference at all</b>. What you pay for is block space, not value.';
    }
    const totalUsd=(totalSat/100000000*BTC_PRICE).toFixed(2);

    const rv=g('b09-s95-rate');
    if(rv){rv.textContent=d.rate;rv.style.color=d.cls==='s95-good'?'#0F6E56':d.cls==='s95-warn'?'#854F0B':'#A32D2D';}

    const eta=g('b09-s95-eta');
    if(eta){eta.textContent=d.eta;eta.className='b09-s95-result-v '+d.cls;}

    const tot=g('b09-s95-total');
    if(tot) tot.textContent=`${totalSat.toLocaleString()} sat (~$${totalUsd})`;

    const conf=g('b09-s95-conf');
    const confCls=d.conf==='High'||d.conf==='Very high'?'s95-good':d.conf==='Medium'?'s95-warn':'s95-bad';
    if(conf){conf.textContent=d.conf;conf.className='b09-s95-result-v '+confCls;}

    renderBlocks(d.blocks);

    const exp=g('b09-s95-explain');
    if(exp){exp.textContent=ex;exp.className='b09-s95-explain '+d.cls;}
  }

  document.querySelectorAll('.b09-s95-opt').forEach(el=>{
    el.addEventListener('click',()=>{
      const group=el.dataset.group;
      const val=el.dataset.val;
      document.querySelectorAll(`.b09-s95-opt[data-group="${group}"]`).forEach(o=>{
        o.classList.remove('sel');
        const dot=o.querySelector('.b09-s95-radio-dot');
        if(dot) dot.remove();
      });
      el.classList.add('sel');
      const radio=el.querySelector('.b09-s95-radio');
      if(radio&&!radio.querySelector('.b09-s95-radio-dot')){
        const dot=document.createElement('div');
        dot.className='b09-s95-radio-dot';
        radio.appendChild(dot);
      }
      if(group==='mp') curMp=val; else curTgt=val;
      update();
    });
  });

  const _sz=document.getElementById('b09-s95-size');
  if(_sz) _sz.addEventListener('input',update);
  update();
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.4 SIMULATION (Mempool Congestion)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  let curState='quiet';

  const STATES={
    quiet:{
      subtitle:'Normal conditions — transactions flow smoothly',
      headCls:'quiet-head', txCount:'~2,400 tx', mpSize:'~4 MB',
      txCls:'s94-good', mpCls:'s94-good',
      bars:[
        {label:'Next block',val:2,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~3 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~6 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~1 day',   val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
      ],
      barVals:['2 sat/vB','1 sat/vB','1 sat/vB','1 sat/vB'],
      chartData:[8,12,15,10,8,14,18,12,8,10,6,8],
      chartColor:'#0F6E56',
      note:'The mempool is quiet. A low fee is enough for fast confirmation. This is the best time to send a non-urgent transaction.',
      noteCls:'quiet-note',
      stratHead:'Quiet conditions: what should you do?',
      stratItems:[
        {icon:'✓',text:'Send a transaction with a fee rate of 1-3 sat/vB — enough for fast confirmation'},
        {icon:'✓',text:'The best time to consolidate small UTXOs that are usually expensive'},
        {icon:'✓',text:'Open a Lightning channel with a cheaper fee than usual'},
        {icon:'ℹ',text:'No need to rush — a quiet mempool usually lasts a few hours'},
      ],
    },
    busy:{
      subtitle:'Congested conditions — fees spike, long queue',
      headCls:'busy-head', txCount:'~180,000 tx', mpSize:'~350 MB',
      txCls:'s94-bad', mpCls:'s94-bad',
      bars:[
        {label:'Next block',val:180,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~3 block',  val:120,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~6 block',  val:80, max:200,cls:'s94-warn',color:'#854F0B'},
        {label:'~1 day',   val:30, max:200,cls:'s94-warn',color:'#854F0B'},
      ],
      barVals:['180 sat/vB','120 sat/vB','80 sat/vB','30 sat/vB'],
      chartData:[20,45,90,140,180,200,185,175,160,145,130,115],
      chartColor:'#A32D2D',
      note:'The mempool is very busy. A low fee can be stuck for days. Consider waiting until the mempool is quieter before sending a transaction.',
      noteCls:'busy-note',
      stratHead:'Busy conditions: strategies you can use',
      stratItems:[
        {icon:'⏳',text:'Wait first if it’s not urgent — a busy mempool usually eases within a few days'},
        {icon:'⬆',text:'If you’ve already sent with a low fee, use RBF to raise the fee'},
        {icon:'👶',text:'If you’re the recipient and the parent is stuck, create a child tx with a high fee (CPFP)'},
        {icon:'📊',text:'Monitor mempool.space to know when conditions start to ease'},
      ],
    },
  };

  function drawChart(data, color){
    const cv=g('b09-s94-cv1'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||300;
    const H=120;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill();
    const max=Math.max(...data,1);
    const bw=Math.floor((W-16)/data.length)-3;
    const baseY=H-10;
    data.forEach((v,i)=>{
      const bh=Math.round((v/max)*(H-20));
      const x=8+i*(bw+3), y=baseY-bh;
      ctx.fillStyle=color;
      ctx.globalAlpha=0.15+0.7*(v/max);
      ctx.beginPath(); ctx.roundRect(x,y,bw,bh,3); ctx.fill();
      ctx.globalAlpha=1;
    });
    ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.font='9px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText('tx/block',8,2);
  }

  function render(state){
    curState=state;
    const s=STATES[state];

    const qBtn=g('b09-s94-quiet'), bBtn=g('b09-s94-busy');
    if(qBtn) qBtn.className='b09-s94-tog'+(state==='quiet'?' quiet-tog':'');
    if(bBtn) bBtn.className='b09-s94-tog'+(state==='busy'?' busy-tog':'');

    const sub=g('b09-s94-subtitle'); if(sub) sub.textContent=s.subtitle;

    ['b09-s94-head1','b09-s94-head2'].forEach(id=>{
      const el=g(id); if(el) el.className='b09-s94-card-head '+s.headCls;
    });

    const tc=g('b09-s94-tx-count'); if(tc){tc.textContent=s.txCount;tc.className='b09-s94-metric-val '+s.txCls;}
    const ms=g('b09-s94-mp-size'); if(ms){ms.textContent=s.mpSize;ms.className='b09-s94-metric-val '+s.mpCls;}

    const ft=g('b09-s94-fee-table');
    if(ft) ft.innerHTML=s.bars.map((b,i)=>`
      <div class="b09-s94-fee-row">
        <div class="b09-s94-fee-label">${b.label}</div>
        <div class="b09-s94-fee-bar-wrap"><div class="b09-s94-fee-bar" style="width:${Math.round(b.val/b.max*100)}%;background:${b.color};"></div></div>
        <div class="b09-s94-fee-val ${b.cls}">${s.barVals[i]}</div>
      </div>`).join('');

    const sh=g('b09-s94-strat-head'); if(sh) sh.textContent=s.stratHead;
    const sb=g('b09-s94-strat-body');
    if(sb) sb.innerHTML=s.stratItems.map(it=>`
      <div class="b09-s94-strategy-item">
        <span class="b09-s94-strategy-icon">${it.icon}</span>
        <span>${it.text}</span>
      </div>`).join('');

    const nt=g('b09-s94-note'); if(nt){nt.textContent=s.note;nt.className='b09-s94-note '+s.noteCls;}
    drawChart(s.chartData, s.chartColor);
  }

  const qBtn=g('b09-s94-quiet'), bBtn=g('b09-s94-busy');
  if(qBtn) qBtn.addEventListener('click',()=>render('quiet'));
  if(bBtn) bBtn.addEventListener('click',()=>render('busy'));

  render('quiet');
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawChart(STATES[curState].chartData,STATES[curState].chartColor);
    })).observe(g('b09-s94-cv1')||document.body);
  }
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.3 SIMULATION (RBF dan CPFP)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const RBF_OTHERS=[
    {id:'tx_f1a2_high',tier:'high',rate:45},
    {id:'tx_e3b4_high',tier:'high',rate:38},
    {id:'tx_c5d6_med', tier:'med', rate:22},
    {id:'tx_g7h8_med', tier:'med', rate:18},
    {id:'tx_i9j0_low', tier:'low', rate:8},
  ];
  let rbfDone=false;

  function renderRBF(done){
    const q=g('b09-s93-rbf-queue'); if(!q) return;
    let txs=[...RBF_OTHERS];
    if(done){
      txs.push({id:'tx_a1b2c3d4 (new)',tier:'high',rate:35,isNew:true});
    } else {
      txs.push({id:'tx_a1b2c3d4',tier:'low',rate:2,isStuck:true});
    }
    txs.sort((a,b)=>b.rate-a.rate);
    q.innerHTML=txs.map((tx,i)=>{
      const tierCls=tx.isNew?'new-tx':tx.isStuck?'stuck':tx.tier;
      const barCls=tx.isNew?'high':tx.isStuck?'red':tx.tier;
      const feeCls=tx.isNew?'high':tx.isStuck?'bad':tx.tier;
      const badge=tx.isNew?'<span class="b09-s93-tx-badge new">RBF new</span>':tx.isStuck?'<span class="b09-s93-tx-badge stuck">stuck</span>':'';
      return `<div class="b09-s93-tx ${tierCls}">
        <div class="b09-s93-tx-num">${i+1}.</div>
        <div class="b09-s93-tx-bar ${barCls}"></div>
        <div class="b09-s93-tx-id">${tx.id}</div>
        ${badge}
        <div class="b09-s93-tx-fee ${feeCls}">${tx.rate} sat/vB</div>
      </div>`;
    }).join('');

    const dh=g('b09-s93-rbf-dhead');
    const st=g('b09-s93-rbf-status');
    const nt=g('b09-s93-rbf-note');
    const btn=g('b09-s93-rbf-btn');
    if(done){
      if(dh) dh.textContent='Your transaction (RBF successful)';
      if(st){st.textContent='High priority position';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent='RBF successful! The old transaction is replaced with the new one (fee rate 35 sat/vB). Its position in the mempool rises from bottom to top. The miner will pick this transaction in the next block.';nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(dh) dh.textContent='Your transaction (stuck)';
      if(st){st.textContent='Stuck in mempool';st.className='b09-s93-dv s93-bad';}
      if(nt){nt.textContent='A transaction with a fee rate of 2 sat/vB will wait a very long time. RBF lets you resend the same transaction with a higher fee, replacing the old one in the mempool.';nt.className='b09-s93-note s93-note-info';}
      if(btn) btn.disabled=false;
    }
  }

  const rbfBtn=g('b09-s93-rbf-btn');
  if(rbfBtn) rbfBtn.addEventListener('click',()=>{rbfDone=true;renderRBF(true);});
  const rbfReset=g('b09-s93-rbf-reset');
  if(rbfReset) rbfReset.addEventListener('click',()=>{rbfDone=false;renderRBF(false);});

  // CPFP
  const CPFP_OTHERS=[
    {id:'tx_f1a2_high',tier:'high',rate:42},
    {id:'tx_e3b4_high',tier:'high',rate:36},
    {id:'tx_c5d6_med', tier:'med', rate:20},
    {id:'tx_g7h8_low', tier:'low', rate:7},
  ];
  const PAR_RATE=2, PAR_SIZE=250, CHLD_RATE=80, CHLD_SIZE=110;
  let cpfpDone=false;

  function pkgRate(){
    const totalFee=PAR_RATE*PAR_SIZE/1000+CHLD_RATE*CHLD_SIZE/1000;
    const totalSize=(PAR_SIZE+CHLD_SIZE)/1000;
    return +(totalFee/totalSize).toFixed(1);
  }

  function renderCPFP(done){
    const q=g('b09-s93-cpfp-queue'); if(!q) return;
    const pr=pkgRate();
    let txs=[...CPFP_OTHERS];
    if(done){
      txs.push({id:'[PKG] tx_parent + tx_child',tier:'high',rate:pr,isPkg:true});
    } else {
      txs.push({id:'tx_parent_stuck',rate:PAR_RATE,isParent:true});
    }
    txs.sort((a,b)=>b.rate-a.rate);
    q.innerHTML=txs.map((tx,i)=>{
      const tierCls=tx.isPkg?'package':tx.isParent?'parent':tx.tier;
      const barCls=tx.isPkg?'high':tx.isParent?'red':tx.tier;
      const feeCls=tx.isPkg?'high':tx.isParent?'bad':tx.tier;
      const badge=tx.isPkg?'<span class="b09-s93-tx-badge pkg">CPFP package</span>':tx.isParent?'<span class="b09-s93-tx-badge parent">parent stuck</span>':'';
      return `<div class="b09-s93-tx ${tierCls}">
        <div class="b09-s93-tx-num">${i+1}.</div>
        <div class="b09-s93-tx-bar ${barCls}"></div>
        <div class="b09-s93-tx-id">${tx.id}</div>
        ${badge}
        <div class="b09-s93-tx-fee ${feeCls}">${tx.rate} sat/vB</div>
      </div>`;
    }).join('');

    const cr=g('b09-s93-cpfp-cr');
    const pkg=g('b09-s93-cpfp-pkg');
    const st=g('b09-s93-cpfp-status');
    const nt=g('b09-s93-cpfp-note');
    const btn=g('b09-s93-cpfp-btn');
    if(done){
      if(cr){cr.textContent=CHLD_RATE+' sat/vB';cr.className='b09-s93-dv s93-purp';}
      if(pkg){pkg.textContent=pr+' sat/vB';pkg.className='b09-s93-dv s93-good';}
      if(st){st.textContent='Package ready — the miner will take both';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent=`The child tx is created with a fee rate of ${CHLD_RATE} sat/vB. The combined package fee rate (parent+child) becomes ${pr} sat/vB. The miner MUST include the parent first to be able to take the child’s fee. Both go into the block together.`;nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(cr){cr.textContent='not created yet';cr.className='b09-s93-dv s93-warn';}
      if(pkg){pkg.textContent='waiting for child...';pkg.className='b09-s93-dv s93-warn';}
      if(st){st.textContent='No child tx yet';st.className='b09-s93-dv s93-warn';}
      if(nt){nt.textContent='The parent tx’s fee is too low (2 sat/vB). Because you’ve already received its output, you can create a child tx with a high fee. A miner who wants to take the child’s fee MUST include the parent first.';nt.className='b09-s93-note s93-note-info';}
      if(btn) btn.disabled=false;
    }
  }

  const cpfpBtn=g('b09-s93-cpfp-btn');
  if(cpfpBtn) cpfpBtn.addEventListener('click',()=>{cpfpDone=true;renderCPFP(true);});
  const cpfpReset=g('b09-s93-cpfp-reset');
  if(cpfpReset) cpfpReset.addEventListener('click',()=>{cpfpDone=false;renderCPFP(false);});

  const t1=g('b09-s93-t1'),t2=g('b09-s93-t2');
  const p1=g('b09-s93-p1'),p2=g('b09-s93-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s93-tab s93-act'; t2.className='b09-s93-tab';
    p1.className='b09-s93-pane show'; p2.className='b09-s93-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s93-tab s93-act'; t1.className='b09-s93-tab';
    p2.className='b09-s93-pane show'; p1.className='b09-s93-pane';
  });

  renderRBF(false);
  renderCPFP(false);
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.2 SIMULATION (Fee Rate Kalkulator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  function feeRateInfo(rate){
    if(rate>=30) return {cls:'good',pri:'High',eta:'Next block',noteCls:'s92-note-good',note:`A fee rate of ${rate} sat/vB counts as high. It will most likely get into the next block even when the mempool is busy.`};
    if(rate>=10) return {cls:'',pri:'Medium',eta:'2-3 blocks (~20-30 minutes)',noteCls:'s92-note-info',note:`A fee rate of ${rate} sat/vB counts as medium. It will be confirmed within a few blocks when mempool conditions are normal.`};
    if(rate>=3)  return {cls:'warn',pri:'Low',eta:'Can be more than 1 hour',noteCls:'s92-note-warn',note:`A fee rate of ${rate} sat/vB counts as low. It might wait a few blocks, especially when the mempool is busy.`};
    return {cls:'bad',pri:'Very low',eta:'Can be weeks',noteCls:'s92-note-bad',note:`A fee rate of ${rate} sat/vB is very low. The transaction can sit in the mempool a long time and might be dropped after 2 weeks.`};
  }

  function markerPos(rate){
    const clamped=Math.min(Math.max(rate,1),100);
    return Math.round((Math.log(clamped)-Math.log(1))/(Math.log(100)-Math.log(1))*100);
  }

  function calcP1(){
    const fee=parseInt(g('b09-s92-fee').value)||1;
    const size=parseInt(g('b09-s92-size').value)||1;
    const rate=+(fee/size).toFixed(1);
    const info=feeRateInfo(rate);

    const rv=g('b09-s92-rate');
    if(rv){rv.textContent=rate;rv.style.color=info.cls==='good'?'#0F6E56':info.cls==='warn'?'#854F0B':info.cls==='bad'?'#A32D2D':'#534AB7';}

    const marker=g('b09-s92-marker');
    if(marker) marker.style.left=markerPos(rate)+'%';

    const eta=g('b09-s92-eta');
    if(eta){eta.textContent=info.eta;eta.className='b09-s92-row-val '+info.cls;}

    const ts=g('b09-s92-total-sat');
    if(ts) ts.textContent=fee.toLocaleString()+' sat';

    const pri=g('b09-s92-priority');
    if(pri){pri.textContent=info.pri;pri.className='b09-s92-row-val '+info.cls;}

    const note=g('b09-s92-note1');
    if(note){note.textContent=info.note;note.className='b09-s92-note '+info.noteCls;}
  }

  function calcP2(){
    const fee=parseInt(g('b09-s92-fee2').value)||1;
    const LEG=226, SW=140;
    const legRate=+(fee/LEG).toFixed(1);
    const swRate=+(fee/SW).toFixed(1);
    const legInfo=feeRateInfo(legRate);
    const swInfo=feeRateInfo(swRate);
    const saving=Math.round((1-SW/LEG)*100);

    const ls=g('b09-s92-leg-size'); if(ls) ls.textContent=LEG+' vbyte';
    const lr=g('b09-s92-leg-rate'); if(lr) lr.textContent=legRate+' sat/vB';
    const lp=g('b09-s92-leg-pri'); if(lp){lp.textContent=legInfo.pri;lp.className='b09-s92-cmp-val '+(legInfo.cls==='good'?'s92-good':'s92-warn');}
    const le=g('b09-s92-leg-eta'); if(le) le.textContent=legInfo.eta;

    const ss=g('b09-s92-sw-size'); if(ss) ss.textContent=SW+' vbyte';
    const sr=g('b09-s92-sw-rate'); if(sr) sr.textContent=swRate+' sat/vB';
    const sp=g('b09-s92-sw-pri'); if(sp){sp.textContent=swInfo.pri;sp.className='b09-s92-cmp-val '+(swInfo.cls==='good'?'s92-good':'s92-warn');}
    const se=g('b09-s92-sw-eta'); if(se){se.textContent=swInfo.eta;se.className='b09-s92-cmp-val '+(swInfo.cls==='good'?'s92-good':'');}

    const note=g('b09-s92-note2');
    if(note) note.textContent=`With the same fee of ${fee.toLocaleString()} sat, SegWit has a fee rate of ${swRate} sat/vB vs Legacy ${legRate} sat/vB. SegWit is ${saving}% smaller so it’s more competitive in the mempool.`;
  }

  const feeIn=g('b09-s92-fee'); if(feeIn) feeIn.addEventListener('input',calcP1);
  const sizeIn=g('b09-s92-size'); if(sizeIn) sizeIn.addEventListener('input',calcP1);
  const fee2In=g('b09-s92-fee2'); if(fee2In) fee2In.addEventListener('input',calcP2);

  const t1=g('b09-s92-t1'),t2=g('b09-s92-t2');
  const p1=g('b09-s92-p1'),p2=g('b09-s92-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s92-tab s92-act'; t2.className='b09-s92-tab';
    p1.className='b09-s92-pane show'; p2.className='b09-s92-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s92-tab s92-act'; t1.className='b09-s92-tab';
    p2.className='b09-s92-pane show'; p1.className='b09-s92-pane';
  });

  calcP1(); calcP2();
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.1 SIMULATION (Mempool)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const BLOCK_MAX = 10;
  const MEMPOOL_MAX = 20;
  const TIERS = [
    {tier:'high', feeRange:[80,150], sizeRange:[200,500]},
    {tier:'med',  feeRange:[20,79],  sizeRange:[200,600]},
    {tier:'low',  feeRange:[1,19],   sizeRange:[200,700]},
  ];
  let mempool=[], blockTxs=[], txCounter=0;

  function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function randHex(n){return Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');}

  function genTx(){
    const t=TIERS[Math.floor(Math.random()*TIERS.length)];
    const fee=randInt(t.feeRange[0],t.feeRange[1]);
    const size=randInt(t.sizeRange[0],t.sizeRange[1]);
    txCounter++;
    return {
      id:'tx'+String(txCounter).padStart(3,'0')+'_'+randHex(4),
      tier:t.tier, fee, size,
      feeRate:+(fee/size*1000).toFixed(1),
    };
  }

  function renderPool(){
    const el=g('b09-s91-pool'); if(!el) return;
    if(mempool.length===0){
      el.innerHTML='<div class="b09-s91-empty">No transactions yet</div>';
    } else {
      const sorted=[...mempool].sort((a,b)=>b.feeRate-a.feeRate);
      el.innerHTML=sorted.map((tx,i)=>`
        <div class="b09-s91-tx ${tx.tier}">
          <div class="b09-s91-tx-num">${i+1}.</div>
          <div class="b09-s91-tx-bar ${tx.tier}"></div>
          <div class="b09-s91-tx-id">${tx.id}</div>
          <div class="b09-s91-tx-fee ${tx.tier}">${tx.feeRate} sat/vB</div>
          <div class="b09-s91-tx-size">${tx.size}B</div>
        </div>`).join('');
    }
    const pct=Math.min(100,Math.round(mempool.length/MEMPOOL_MAX*100));
    const fill=g('b09-s91-cap-fill'); if(fill) fill.style.width=pct+'%';
    const label=g('b09-s91-cap-pct'); if(label) label.textContent=pct+'%';
    const stat=g('b09-s91-stat'); if(stat) stat.textContent=`Mempool: ${mempool.length} tx`;
  }

  function renderBlock(){
    const el=g('b09-s91-block'); if(!el) return;
    if(blockTxs.length===0){
      el.innerHTML='<div class="b09-s91-empty">No transactions selected yet</div>';
    } else {
      el.innerHTML=blockTxs.map((tx,i)=>`
        <div class="b09-s91-tx ${tx.tier}">
          <div class="b09-s91-tx-num">${i+1}.</div>
          <div class="b09-s91-tx-bar ${tx.tier}"></div>
          <div class="b09-s91-tx-id">${tx.id}</div>
          <div class="b09-s91-tx-fee ${tx.tier}">${tx.feeRate} sat/vB</div>
        </div>`).join('');
    }
    const pct=Math.min(100,Math.round(blockTxs.length/BLOCK_MAX*100));
    const fill=g('b09-s91-blk-fill'); if(fill) fill.style.width=pct+'%';
    const label=g('b09-s91-blk-pct'); if(label) label.textContent=pct+'%';
  }

  const addBtn=g('b09-s91-add');
  if(addBtn) addBtn.addEventListener('click',()=>{
    if(mempool.length>=MEMPOOL_MAX) return;
    const n=randInt(1,3);
    for(let i=0;i<n&&mempool.length<MEMPOOL_MAX;i++) mempool.push(genTx());
    renderPool();
    const note=g('b09-s91-note');
    if(note){note.textContent='Transactions enter the mempool, sorted from the highest fee rate. Now try step 2: mine a block.';note.className='b09-s91-note idle-note';}
  });

  const mineBtn=g('b09-s91-mine');
  if(mineBtn) mineBtn.addEventListener('click',()=>{
    if(mempool.length===0) return;
    mempool.sort((a,b)=>b.feeRate-a.feeRate);
    const picked=mempool.splice(0,Math.min(BLOCK_MAX,mempool.length));
    blockTxs=picked;
    renderPool(); renderBlock();
    const totalFee=picked.reduce((s,t)=>s+t.fee,0);
    const avgFee=picked.length?+(picked.reduce((s,t)=>s+t.feeRate,0)/picked.length).toFixed(1):0;
    const note=g('b09-s91-note');
    if(note){
      note.textContent=`Block mined! ${picked.length} transactions selected from the highest fee. Total fee: ${totalFee} sat. Average fee rate: ${avgFee} sat/vB. The remaining ${mempool.length} transactions are still waiting in the mempool.`;
      note.className='b09-s91-note done-note';
    }
  });

  const resetBtn=g('b09-s91-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    mempool=[]; blockTxs=[]; txCounter=0;
    renderPool(); renderBlock();
    const note=g('b09-s91-note');
    if(note){note.textContent='Start with step 1: add transactions to the mempool, then step 2: mine a block to see how the miner picks transactions based on the highest fee.';note.className='b09-s91-note idle-note';}
  });

  // Seed awal
  for(let i=0;i<8;i++) mempool.push(genTx());
  renderPool(); renderBlock();
})();

// ============================================================
// PAGE 13 · BAB 10 · NAVIGATION
// ============================================================
function showSectionInContentB10(sectionId, sbId) {
  document.querySelectorAll('#page-bab10 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab10 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab10-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 13 · BAB 10 · TOPBAR
// ============================================================
document.getElementById('back-home-b10').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b10').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 13 · BAB 10 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab10').addEventListener('click', () => navigate('page-bab10'));

// ============================================================
// PAGE 13 · BAB 10 · SIDEBAR EVENTS (10.1 - 10.6)
// ============================================================
document.getElementById('sb-10-1').addEventListener('click', () => showSectionInContentB10('section-10-1', 'sb-10-1'));
document.getElementById('sb-10-2').addEventListener('click', () => showSectionInContentB10('section-10-2', 'sb-10-2'));
document.getElementById('sb-10-3').addEventListener('click', () => showSectionInContentB10('section-10-3', 'sb-10-3'));
document.getElementById('sb-10-4').addEventListener('click', () => showSectionInContentB10('section-10-4', 'sb-10-4'));
document.getElementById('sb-10-5').addEventListener('click', () => showSectionInContentB10('section-10-5', 'sb-10-5'));
document.getElementById('sb-10-6').addEventListener('click', () => showSectionInContentB10('section-10-6', 'sb-10-6'));

// ============================================================
// PAGE 13 · BAB 10 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab10 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB10(target, sb);
  });
});

// ============================================================
// PAGE 13 · BAB 10 · 10.6 SIMULATION (Node Types)
// ============================================================
(function() {
  const ids = ['b10-s106-c1', 'b10-s106-c2', 'b10-s106-c3'];
  ids.forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('click', () => {
      const isActive = el.classList.contains('active');
      ids.forEach(cid => {
        const c = document.getElementById(cid); if (c) c.classList.remove('active');
      });
      if (!isActive) el.classList.add('active');
    });
  });
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.5 SIMULATION (UTXO Privacy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const NODES=[
    {id:'A',label:'UTXO A\n0.800 BTC',x:0.12,y:0.20},
    {id:'B',label:'UTXO B\n0.450 BTC',x:0.12,y:0.65},
    {id:'C',label:'UTXO C\n1.200 BTC',x:0.72,y:0.20},
    {id:'D',label:'UTXO D\n0.300 BTC',x:0.72,y:0.65},
  ];

  let graphW=0, graphH=0, sent=false;

  function getPos(n){return {x:n.x*graphW, y:n.y*graphH};}

  function initGraph(){
    const gr=g('b10-s105-graph'); if(!gr) return;
    graphW=gr.getBoundingClientRect().width||300;
    graphH=gr.getBoundingClientRect().height||220;
    gr.querySelectorAll('.b10-s105-node').forEach(el=>el.remove());
    const svg=g('b10-s105-svg'); if(svg) svg.innerHTML='';
    NODES.forEach(n=>{
      const el=document.createElement('div');
      el.className='b10-s105-node';
      el.id='b10n-'+n.id;
      const pos=getPos(n);
      el.style.left=(pos.x-22)+'px';
      el.style.top=(pos.y-22)+'px';
      el.innerHTML=`<div class="b10-s105-node-circle unknown" id="b10nc-${n.id}">${n.id}</div>
        <div class="b10-s105-node-label">${n.label.replace('\n','<br>')}</div>`;
      gr.appendChild(el);
    });
  }

  function drawSVGLine(x1,y1,x2,y2,color,dashed){
    const svg=g('b10-s105-svg'); if(!svg) return;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke',color);line.setAttribute('stroke-width','1.5');
    if(dashed) line.setAttribute('stroke-dasharray','4,3');
    svg.appendChild(line);
  }

  function addTxNode(x,y){
    const gr=g('b10-s105-graph'); if(!gr) return;
    const el=document.createElement('div');
    el.className='b10-s105-node'; el.id='b10n-TX';
    el.style.left=(x-22)+'px'; el.style.top=(y-22)+'px';
    el.innerHTML=`<div class="b10-s105-node-circle tx-node">TX</div><div class="b10-s105-node-label">transaction</div>`;
    gr.appendChild(el);
  }

  const sendBtn=g('b10-s105-send');
  if(sendBtn) sendBtn.addEventListener('click',async()=>{
    if(sent) return;
    sent=true; sendBtn.disabled=true;
    const note=g('b10-s105-note1');
    if(note){note.textContent='Transaction sent! UTXO A and B are used as inputs together...';note.className='b10-s105-note s105-info';}

    const txX=graphW*0.42, txY=graphH*0.42;
    const pA=getPos(NODES[0]), pB=getPos(NODES[1]);
    const pC=getPos(NODES[2]), pD=getPos(NODES[3]);

    drawSVGLine(pA.x,pA.y,txX,txY,'rgba(83,74,183,0.6)',false);
    drawSVGLine(pB.x,pB.y,txX,txY,'rgba(83,74,183,0.6)',false);
    addTxNode(txX,txY);
    await wait(700);

    drawSVGLine(txX,txY,pC.x,pC.y,'rgba(83,74,183,0.3)',true);
    drawSVGLine(txX,txY,pD.x,pD.y,'rgba(83,74,183,0.3)',true);
    await wait(500);

    ['A','B'].forEach(id=>{
      const c=g('b10nc-'+id);
      if(c) c.className='b10-s105-node-circle linked';
    });
    await wait(400);

    const svg=g('b10-s105-svg');
    if(svg){
      const link=document.createElementNS('http://www.w3.org/2000/svg','line');
      link.setAttribute('x1',pA.x);link.setAttribute('y1',pA.y);
      link.setAttribute('x2',pB.x);link.setAttribute('y2',pB.y);
      link.setAttribute('stroke','rgba(163,45,45,0.6)');
      link.setAttribute('stroke-width','2');
      link.setAttribute('stroke-dasharray','3,2');
      svg.appendChild(link);
    }

    if(note){
      note.textContent='The analyst detects: UTXO A and B are used together as inputs. The common input ownership heuristic: both are most likely owned by the same person. The analyst marks both as one entity.';
      note.className='b10-s105-note s105-warn';
    }
  });

  const rst1=g('b10-s105-rst1');
  if(rst1) rst1.addEventListener('click',()=>{
    sent=false; initGraph();
    if(sendBtn) sendBtn.disabled=false;
    const note=g('b10-s105-note1');
    if(note){note.textContent='UTXO A and B have no known relationship yet. As soon as they’re used together in one transaction, blockchain analysts will immediately link them.';note.className='b10-s105-note s105-idle';}
  });

  const t1=g('b10-s105-t1'),t2=g('b10-s105-t2');
  const p1=g('b10-s105-p1'),p2=g('b10-s105-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b10-s105-tab s105-act'; t2.className='b10-s105-tab';
    p1.className='b10-s105-pane show'; p2.className='b10-s105-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b10-s105-tab s105-act'; t1.className='b10-s105-tab';
    p2.className='b10-s105-pane show'; p1.className='b10-s105-pane';
  });

  initGraph();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{if(!sent) initGraph();})).observe(g('b10-s105-graph')||document.body);
  }
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.4 SIMULATION (UTXO Consolidation)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const INIT=[
    {id:'L1',val:4.500,cls:'large'},{id:'L2',val:2.100,cls:'large'},{id:'L3',val:1.800,cls:'large'},
    {id:'M1',val:0.450,cls:'medium'},{id:'M2',val:0.280,cls:'medium'},{id:'M3',val:0.150,cls:'medium'},
    {id:'M4',val:0.095,cls:'medium'},{id:'M5',val:0.070,cls:'medium'},
    {id:'S1',val:0.008,cls:'small'},{id:'S2',val:0.005,cls:'small'},
    {id:'S3',val:0.003,cls:'small'},{id:'S4',val:0.002,cls:'small'},
    {id:'S5',val:0.001,cls:'small'},{id:'S6',val:0.001,cls:'small'},
    {id:'D1',val:0.000005,cls:'dust'},{id:'D2',val:0.000004,cls:'dust'},
    {id:'D3',val:0.000003,cls:'dust'},{id:'D4',val:0.000002,cls:'dust'},
    {id:'D5',val:0.000002,cls:'dust'},{id:'D6',val:0.000001,cls:'dust'},
  ];

  const CHART=[
    {label:'2020',val:55},{label:'2021',val:78},{label:'2022',val:85},
    {label:'2023',val:120},{label:'2024',val:180},{label:'Now',val:180,current:true},
  ];

  let utxos=[...INIT.map(u=>({...u}))];
  let busy=false;

  function totalBTC(list){return list.reduce((s,u)=>s+u.val,0);}
  function dustCount(list){return list.filter(u=>u.cls==='dust').length;}

  function renderSet(){
    const el=g('b10-s104-set'); if(!el) return;
    el.innerHTML=utxos.map(u=>`
      <div class="b10-s104-utxo ${u.cls}${u.consolidating?' consolidating':''}${u.merged?' merged':''}" title="${u.val} BTC">
        ${u.cls==='large'?u.val.toFixed(2):u.cls==='medium'?u.val.toFixed(3):''}
      </div>`).join('');
  }

  function updateStats(){
    const cnt=g('b10-s104-count'); if(cnt) cnt.textContent=`${utxos.length} UTXO`;
    const tot=g('b10-s104-total'); if(tot) tot.textContent=`Total: ${totalBTC(utxos).toFixed(3)} BTC`;
    const dst=g('b10-s104-dust');  if(dst) dst.textContent=`Dust: ${dustCount(utxos)} UTXO`;
  }

  function renderChart(highlight){
    const el=g('b10-s104-bars'); if(!el) return;
    const max=Math.max(...CHART.map(d=>d.val));
    el.innerHTML=CHART.map((d,i)=>{
      const isLast=i===CHART.length-1;
      const h=Math.round((d.val/max)*100);
      const bg=highlight&&isLast?'#0F6E56':d.current?'#534AB7':'rgba(83,74,183,0.3)';
      const lbl=isLast?(highlight?utxos.length+'':d.val+''):d.val+'k';
      return `<div class="b10-s104-bar-col">
        <div style="font-size:8px;color:#3A3A35;font-family:'Courier Prime',monospace;text-align:center;">${lbl}</div>
        <div class="b10-s104-bar-fill" style="height:${h}%;background:${bg};"></div>
        <div class="b10-s104-bar-label">${d.label}</div>
      </div>`;
    }).join('');
  }

  async function consolidate(){
    busy=true;
    const btn=g('b10-s104-consolidate'); if(btn) btn.disabled=true;
    const note=g('b10-s104-note');
    if(note){note.textContent='Selecting small UTXOs and dust to consolidate...';note.className='b10-s104-note s104-run';}

    const toConsolidate=utxos.filter(u=>u.cls==='small'||u.cls==='dust');
    toConsolidate.forEach(u=>u.consolidating=true);
    renderSet(); await wait(800);

    const mergedVal=toConsolidate.reduce((s,u)=>s+u.val,0);
    const fee=0.00015;
    const netVal=Math.max(0,mergedVal-fee);

    if(note) note.textContent=`Combining ${toConsolidate.length} UTXOs into 1 new UTXO...`;
    await wait(700);

    utxos=utxos.filter(u=>u.cls!=='small'&&u.cls!=='dust');
    utxos.push({id:'MERGED',val:netVal,cls:'medium',merged:true});
    renderSet(); updateStats(); renderChart(true);

    if(note){
      note.textContent=`Consolidation complete! ${toConsolidate.length} UTXOs merged into 1 UTXO (${netVal.toFixed(5)} BTC, after a ${fee} BTC fee). The UTXO set drops from 20 to ${utxos.length}.`;
      note.className='b10-s104-note s104-done';
    }
    busy=false;
  }

  const cb=g('b10-s104-consolidate'); if(cb) cb.addEventListener('click',()=>{if(!busy) consolidate();});
  const rb=g('b10-s104-reset');
  if(rb) rb.addEventListener('click',()=>{
    if(busy) return;
    utxos=[...INIT.map(u=>({...u}))];
    renderSet(); updateStats(); renderChart(false);
    const btn=g('b10-s104-consolidate'); if(btn) btn.disabled=false;
    const note=g('b10-s104-note');
    if(note){note.textContent='Small UTXOs and dust add a burden to every full node. Click "Consolidate Small UTXOs" to combine small UTXOs into one when fees are low.';note.className='b10-s104-note s104-idle';}
  });

  renderSet(); updateStats(); renderChart(false);
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.3 SIMULATION (TX Verification)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const STEPS1=[
    {label:'Check UTXO #1 in the set',sub:'u_A1 (1.500 BTC) — in the UTXO set?',inpId:'b10-s103-inp1a',
     passMsg:'u_A1 found in the UTXO set. Exists and unspent.'},
    {label:'Check UTXO #2 in the set',sub:'u_B1 (0.750 BTC) — in the UTXO set?',inpId:'b10-s103-inp1b',
     passMsg:'u_B1 found in the UTXO set. Exists and unspent.'},
    {label:'Verify value',sub:'Total input (2.250) >= total output + fee (2.250)?',inpId:null,
     passMsg:'Input 2.250 BTC = Output 2.235 BTC + Fee 0.015 BTC. Values balance.'},
    {label:'Verify script',sub:'Unlocking script satisfies the locking script of u_A1 and u_B1?',inpId:null,
     passMsg:'The cryptographic signatures are valid. Alice is entitled to spend both of these UTXOs.'},
  ];

  const STEPS2=[
    {label:'Check UTXO #1 in the set',sub:'u_A1 (1.500 BTC) — in the UTXO set?',inpId:'b10-s103-inp2a',
     failMsg:'u_A1 is NOT in the UTXO set. Already consumed by tx_f1a2b3c4. Double spend detected!'},
  ];

  function makeSteps(steps, prefix){
    return steps.map((s,i)=>`
      <div class="b10-s103-step s103-idle" id="${prefix}-${i}">
        <div class="b10-s103-step-icon">${i+1}</div>
        <div class="b10-s103-step-text">${s.label}<div class="b10-s103-step-sub">${s.sub}</div></div>
      </div>`).join('');
  }

  function initP1(){
    const st=g('b10-s103-steps1'); if(st) st.innerHTML=makeSteps(STEPS1,'b10-s103-s1');
    ['b10-s103-inp1a','b10-s103-inp1b'].forEach(id=>{const el=g(id);if(el) el.className='b10-s103-tx-item s103-inp';});
    const b=g('b10-s103-badge1'); if(b){b.textContent='awaiting verification';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note1'); if(n){n.textContent='Click "Verify Transaction" to see how the node checks this transaction step by step using the UTXO set.';n.className='b10-s103-note s103-idle';}
    const rb=g('b10-s103-run1'); if(rb) rb.disabled=false;
  }

  function initP2(){
    const st=g('b10-s103-steps2'); if(st) st.innerHTML=makeSteps(STEPS2,'b10-s103-s2');
    ['b10-s103-inp2a','b10-s103-inp2b'].forEach(id=>{const el=g(id);if(el) el.className='b10-s103-tx-item s103-inp';});
    const b=g('b10-s103-badge2'); if(b){b.textContent='awaiting verification';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note2'); if(n){n.textContent='Click "Verify Transaction" to see how the node detects a double spend when u_A1 no longer exists in the UTXO set.';n.className='b10-s103-note s103-idle';}
    const rb=g('b10-s103-run2'); if(rb) rb.disabled=false;
  }

  let busy1=false, busy2=false;

  async function runP1(){
    busy1=true;
    const rb=g('b10-s103-run1'); if(rb) rb.disabled=true;
    const note=g('b10-s103-note1');
    for(let i=0;i<STEPS1.length;i++){
      const s=STEPS1[i];
      const el=g(`b10-s103-s1-${i}`); if(!el) continue;
      el.className='b10-s103-step s103-active';
      el.querySelector('.b10-s103-step-icon').textContent=i+1;
      if(note){note.textContent=`Checking: ${s.label}...`;note.className='b10-s103-note s103-run';}
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-checking';}
      await wait(700);
      el.className='b10-s103-step s103-pass';
      el.querySelector('.b10-s103-step-icon').textContent='✓';
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-ok';}
      if(note){note.textContent=s.passMsg;note.className='b10-s103-note s103-run';}
      await wait(600);
    }
    const b=g('b10-s103-badge1'); if(b){b.textContent='transaction valid';b.className='b10-s103-tx-badge s103-valid';}
    if(note){note.textContent='All checks passed! The transaction is accepted into the mempool and will be forwarded to other peers.';note.className='b10-s103-note s103-pass';}
    busy1=false;
  }

  async function runP2(){
    busy2=true;
    const rb=g('b10-s103-run2'); if(rb) rb.disabled=true;
    const note=g('b10-s103-note2');
    const s=STEPS2[0];
    const el=g('b10-s103-s2-0'); if(!el) return;
    el.className='b10-s103-step s103-active';
    if(note){note.textContent=`Checking: ${s.label}...`;note.className='b10-s103-note s103-run';}
    const inp=g(s.inpId); if(inp) inp.className='b10-s103-tx-item s103-inp-checking';
    await wait(800);
    el.className='b10-s103-step s103-fail';
    el.querySelector('.b10-s103-step-icon').textContent='✗';
    if(inp) inp.className='b10-s103-tx-item s103-inp-fail';
    const b=g('b10-s103-badge2'); if(b){b.textContent='rejected';b.className='b10-s103-tx-badge s103-invalid';}
    if(note){note.textContent=s.failMsg;note.className='b10-s103-note s103-fail';}
    busy2=false;
  }

  const r1=g('b10-s103-run1'); if(r1) r1.addEventListener('click',()=>{if(!busy1) runP1();});
  const r2=g('b10-s103-run2'); if(r2) r2.addEventListener('click',()=>{if(!busy2) runP2();});
  const rst1=g('b10-s103-rst1'); if(rst1) rst1.addEventListener('click',()=>{if(!busy1) initP1();});
  const rst2=g('b10-s103-rst2'); if(rst2) rst2.addEventListener('click',()=>{if(!busy2) initP2();});

  const t1=g('b10-s103-t1'), t2=g('b10-s103-t2');
  const p1=g('b10-s103-p1'), p2=g('b10-s103-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b10-s103-tab s103-act'; t2.className='b10-s103-tab';
    p1.className='b10-s103-pane show'; p2.className='b10-s103-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b10-s103-tab s103-act'; t1.className='b10-s103-tab';
    p2.className='b10-s103-pane show'; p1.className='b10-s103-pane';
  });

  initP1(); initP2();
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.2 SIMULATION (UTXO Set Update)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const INIT=[
    {id:'u_A1',val:'2.100',key:'A1'},{id:'u_A2',val:'0.800',key:'A2'},
    {id:'u_B1',val:'1.500',key:'B1'},{id:'u_C1',val:'0.650',key:'C1'},
    {id:'u_C2',val:'0.300',key:'C2'},{id:'u_D1',val:'0.900',key:'D1'},
    {id:'u_E1',val:'0.450',key:'E1'},{id:'u_F1',val:'0.750',key:'F1'},
    {id:'u_G1',val:'0.200',key:'G1'},{id:'u_H1',val:'0.350',key:'H1'},
    {id:'u_I1',val:'0.600',key:'I1'},{id:'u_J1',val:'0.400',key:'J1'},
  ];

  const TXS=[
    {id:'cb_840512',label:'Coinbase',type:'coinbase',rm:[],
     add:[{id:'u_CB',val:'3.252',key:'CB',cls:'cb-u'}],ops:'-0 +1',
     desc:'Coinbase: the miner gets a 3.125 BTC reward + 0.127 BTC total fee from all transactions.'},
    {id:'tx_f1a2b3',label:'Tx #1',type:'normal',rm:['A1','A2'],
     add:[{id:'u_X1',val:'2.700',key:'X1',cls:'new-u'},{id:'u_X2',val:'0.185',key:'X2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #1: u_A1 + u_A2 consumed (2.900 BTC). Created u_X1 (2.700) + u_X2 (0.185). Fee: 0.015 BTC.'},
    {id:'tx_c4d5e6',label:'Tx #2',type:'normal',rm:['B1','C1'],
     add:[{id:'u_Y1',val:'2.100',key:'Y1',cls:'new-u'},{id:'u_Y2',val:'0.035',key:'Y2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #2: u_B1 + u_C1 consumed (2.150 BTC). Created u_Y1 (2.100) + u_Y2 (0.035). Fee: 0.015 BTC.'},
    {id:'tx_g7h8i9',label:'Tx #3',type:'normal',rm:['D1'],
     add:[{id:'u_Z1',val:'0.870',key:'Z1',cls:'new-u'}],ops:'-1 +1',
     desc:'Tx #3: u_D1 consumed (0.900 BTC). Created u_Z1 (0.870 BTC). Fee: 0.030 BTC.'},
  ];

  let utxos=[...INIT.map(u=>({...u,cls:'alive'}))];
  let logs=[], busy=false, doneCount=0, activeIdx=-1;

  function renderBlock(){
    const el=g('b10-s102-blk'); if(!el) return;
    el.innerHTML=TXS.map((tx,i)=>{
      const state=i<doneCount?'done':i===activeIdx?'active':'idle';
      const badge=i<doneCount?'done':tx.type==='coinbase'?'coinbase':'normal';
      const bTxt=i<doneCount?'done':tx.type==='coinbase'?'coinbase':'normal';
      return `<div class="b10-s102-tx ${state}">
        <span class="b10-s102-tx-badge ${badge}">${bTxt}</span>
        <span class="b10-s102-tx-id">${tx.id}</span>
        <span class="b10-s102-tx-ops">${tx.ops}</span>
      </div>`;
    }).join('');
  }

  function renderSet(){
    const el=g('b10-s102-set'); if(!el) return;
    el.innerHTML=utxos.map(u=>`
      <div class="b10-s102-utxo ${u.cls}">${u.id}<br><span style="font-size:9px;opacity:.7;">${u.val} BTC</span></div>`
    ).join('');
  }

  function renderLog(){
    const el=g('b10-s102-log'); if(!el) return;
    el.innerHTML=logs.map(l=>`<div class="b10-s102-log-item ${l.cls}">${l.txt}</div>`).join('');
    el.scrollTop=el.scrollHeight;
  }

  function updateStats(rm,add){
    const after=INIT.length-rm+add;
    const delta=add-rm;
    const d=g('b10-s102-dlt'); if(d) d.textContent=`Change: ${delta>=0?'+':''}${delta} UTXO`;
    const a=g('b10-s102-aft'); if(a) a.textContent=`After: ${after} UTXO`;
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  async function run(){
    busy=true;
    const runBtn=g('b10-s102-run'); if(runBtn) runBtn.disabled=true;
    let totalRm=0, totalAdd=0;
    const note=g('b10-s102-note');

    for(let i=0;i<TXS.length;i++){
      const tx=TXS[i];
      activeIdx=i; renderBlock();
      if(note){note.textContent=tx.desc;note.className='b10-s102-note run-note';}
      await wait(500);

      if(tx.rm.length>0){
        tx.rm.forEach(k=>{const u=utxos.find(u=>u.key===k);if(u) u.cls='removing';});
        renderSet();
        const rmIds=tx.rm.map(k=>INIT.find(u=>u.key===k)?.id||k).join(', ');
        logs.push({cls:'rm',txt:`⊖ Remove: ${rmIds}`});
        renderLog();
        await wait(700);
      }

      utxos=utxos.filter(u=>!tx.rm.includes(u.key));
      totalRm+=tx.rm.length;
      tx.add.forEach(a=>{utxos.push({...a});totalAdd++;});
      renderSet();
      const logCls=tx.type==='coinbase'?'cb':'add';
      logs.push({cls:logCls,txt:`⊕ Add: ${tx.add.map(a=>a.id+' ('+a.val+' BTC)').join(', ')}`});
      renderLog();
      updateStats(totalRm,totalAdd);
      await wait(600);

      doneCount=i+1; activeIdx=-1; renderBlock();
    }

    if(note){
      note.textContent=`Block #840,512 done! ${totalRm} UTXOs removed, ${totalAdd} UTXOs added. Total UTXO set: ${utxos.length}.`;
      note.className='b10-s102-note done-note';
    }
    busy=false;
  }

  const runBtn=g('b10-s102-run');
  if(runBtn) runBtn.addEventListener('click',()=>{if(!busy&&doneCount===0) run();});

  const rstBtn=g('b10-s102-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(busy) return;
    utxos=[...INIT.map(u=>({...u,cls:'alive'}))];
    logs=[]; doneCount=0; activeIdx=-1;
    renderBlock(); renderSet(); renderLog();
    const bef=g('b10-s102-bef'); if(bef) bef.textContent='Before: 12 UTXO';
    const aft=g('b10-s102-aft'); if(aft) aft.textContent='After: 12 UTXO';
    const dlt=g('b10-s102-dlt'); if(dlt) dlt.textContent='Change: -';
    const rb=g('b10-s102-run'); if(rb) rb.disabled=false;
    const note=g('b10-s102-note');
    if(note){note.textContent='Click "Process Block" to see how each transaction in the block updates the UTXO set in order, starting from the coinbase transaction.';note.className='b10-s102-note idle-note';}
  });

  renderBlock(); renderSet();
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.1 SIMULATION (UTXO Set)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const INIT=[
    {id:'utxo_a1',val:'1.500',owner:'Alice',   key:'a1'},
    {id:'utxo_a2',val:'0.300',owner:'Alice',   key:'a2'},
    {id:'utxo_b1',val:'0.750',owner:'Bob',     key:'b1'},
    {id:'utxo_c1',val:'0.800',owner:'Carol',   key:'c1'},
    {id:'utxo_d1',val:'0.500',owner:'Dave',    key:'d1'},
    {id:'utxo_e1',val:'0.450',owner:'Eve',     key:'e1'},
    {id:'utxo_f1',val:'0.350',owner:'Frank',   key:'f1'},
    {id:'utxo_g1',val:'0.200',owner:'Grace',   key:'g1'},
  ];
  const NEW_UTXOS=[
    {id:'utxo_b2',val:'1.200',owner:'Bob',             key:'b2',isNew:true},
    {id:'utxo_a3',val:'0.585',owner:'Alice (change)',key:'a3',isNew:true},
  ];

  let utxos=[...INIT], txState='idle';

  function totalBTC(list){return list.reduce((s,u)=>s+parseFloat(u.val),0).toFixed(3);}

  function renderGrid(){
    const grid=g('b10-s101-grid'); if(!grid) return;
    grid.innerHTML='';
    utxos.forEach(u=>{
      const el=document.createElement('div');
      el.className='b10-s101-utxo '+(u.isNew?'new-utxo':'alive');
      el.id='b10-utxo-'+u.key;
      el.innerHTML=`
        <div class="b10-s101-utxo-id">${u.id}</div>
        <div class="b10-s101-utxo-val">${u.val} BTC</div>
        <div class="b10-s101-utxo-owner">${u.owner}</div>
        ${u.isNew?'<div class="b10-s101-utxo-badge new">new</div>':''}`;
      grid.appendChild(el);
    });
  }

  function updateStats(){
    const cnt=g('b10-s101-count'); if(cnt) cnt.textContent=`UTXO: ${utxos.length} outputs`;
    const sz=g('b10-s101-size');   if(sz)  sz.textContent=`Total: ${totalBTC(utxos)} BTC`;
  }

  function runTx(){
    txState='animating';
    const sendBtn=g('b10-s101-send'); if(sendBtn) sendBtn.disabled=true;
    const tx=g('b10-s101-tx'); if(tx) tx.style.display='block';
    const note=g('b10-s101-note');
    if(note){note.textContent='Transaction arrives! Alice uses 2 of her UTXOs as input...';note.className='b10-s101-note active-note';}

    setTimeout(()=>{
      ['a1','a2'].forEach(k=>{
        const el=g('b10-utxo-'+k);
        if(el) el.className='b10-s101-utxo consuming';
      });
      if(note) note.textContent='The input UTXOs are marked as consumed — can’t be used again...';
    },500);

    setTimeout(()=>{
      utxos=utxos.filter(u=>u.key!=='a1'&&u.key!=='a2');
      utxos.push(...NEW_UTXOS);
      renderGrid(); updateStats();
      if(note){note.textContent='The old UTXOs are removed from the set. New UTXOs are created: Bob gets 1.200 BTC, Alice gets 0.585 BTC change.';note.className='b10-s101-note done-note';}
      txState='done';
    },1800);
  }

  const sendBtn=g('b10-s101-send');
  if(sendBtn) sendBtn.addEventListener('click',()=>{if(txState==='idle') runTx();});

  const resetBtn=g('b10-s101-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    txState='idle';
    utxos=[...INIT];
    renderGrid(); updateStats();
    const tx=g('b10-s101-tx'); if(tx) tx.style.display='none';
    const note=g('b10-s101-note');
    if(note){note.textContent='Click "Send Transaction" to see how UTXOs are consumed and new UTXOs are created. The UTXO set always reflects the current state of bitcoin ownership.';note.className='b10-s101-note idle-note';}
    const sb=g('b10-s101-send'); if(sb) sb.disabled=false;
  });

  renderGrid(); updateStats();
})();

// ============================================================
// PAGE 14 · BAB 11 · NAVIGATION
// ============================================================
function showSectionInContentB11(sectionId, sbId) {
  document.querySelectorAll('#page-bab11 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab11 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab11-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 14 · BAB 11 · TOPBAR
// ============================================================
document.getElementById('back-home-b11').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b11').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 14 · BAB 11 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab11').addEventListener('click', () => navigate('page-bab11'));

// ============================================================
// PAGE 14 · BAB 11 · SIDEBAR EVENTS (11.1 - 11.6)
// ============================================================
document.getElementById('sb-11-1').addEventListener('click', () => showSectionInContentB11('section-11-1', 'sb-11-1'));
document.getElementById('sb-11-2').addEventListener('click', () => showSectionInContentB11('section-11-2', 'sb-11-2'));
document.getElementById('sb-11-3').addEventListener('click', () => showSectionInContentB11('section-11-3', 'sb-11-3'));
document.getElementById('sb-11-4').addEventListener('click', () => showSectionInContentB11('section-11-4', 'sb-11-4'));
document.getElementById('sb-11-5').addEventListener('click', () => showSectionInContentB11('section-11-5', 'sb-11-5'));
document.getElementById('sb-11-6').addEventListener('click', () => showSectionInContentB11('section-11-6', 'sb-11-6'));

// ============================================================
// PAGE 14 · BAB 11 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab11 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB11(target, sb);
  });
});

// ============================================================
// PAGE 14 · BAB 11 · 11.6 SIMULATION (Hash Rate Distribution)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;

  const POOLS=[
    {name:'Foundry USA',pct:28,color:'#534AB7'},
    {name:'AntPool',pct:19,color:'#0F6E56'},
    {name:'F2Pool',pct:12,color:'#854F0B'},
    {name:'ViaBTC',pct:10,color:'#7C3AED'},
    {name:'Binance Pool',pct:8,color:'#5DCAA5'},
    {name:'Other',pct:23,color:'#52524C'},
  ];

  const GEO=[
    {flag:'🇺🇸',name:'United States',pct:38,color:'#534AB7'},
    {flag:'🇰🇿',name:'Kazakhstan',pct:14,color:'#854F0B'},
    {flag:'🇷🇺',name:'Russia',pct:11,color:'#A32D2D'},
    {flag:'🇨🇦',name:'Canada',pct:7,color:'#0F6E56'},
    {flag:'🇩🇪',name:'Germany',pct:5,color:'#5DCAA5'},
    {flag:'🇨🇳',name:'China (estimate)',pct:4,color:'#52524C'},
    {flag:'🌍',name:'Other',pct:21,color:'#3A3A35'},
  ];

  function drawPie(cvId, legendId, data){
    const cv=g(cvId); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    const H=200;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;
    const R=Math.min(W,H)*0.42, r=Math.min(W,H)*0.22;
    let angle=-Math.PI/2;
    data.forEach(d=>{
      const sweep=(d.pct/100)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle,angle+sweep);ctx.closePath();
      ctx.fillStyle=d.color;ctx.fill();
      ctx.strokeStyle=dark?'#1A1A18':'#fff';ctx.lineWidth=1.5;ctx.stroke();
      angle+=sweep;
    });
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle=dark?'#1A1A18':'#fff';ctx.fill();
    ctx.fillStyle=dark?'#E0DED8':'#1A1A18';
    ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('Hash Rate',cx,cy-6);
    ctx.font='9px sans-serif';ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.fillText('distribution',cx,cy+8);
    const leg=g(legendId); if(!leg) return;
    leg.innerHTML=data.map(d=>`
      <div class="b11-s116-leg">
        <div class="b11-s116-leg-dot" style="background:${d.color};"></div>
        <div class="b11-s116-leg-label">${d.name}</div>
        <div class="b11-s116-leg-pct" style="color:${d.color};">${d.pct}%</div>
      </div>`).join('');
  }

  function renderGeo(){
    const el=g('b11-s116-geo-bars'); if(!el) return;
    const max=Math.max(...GEO.map(d=>d.pct));
    el.innerHTML=GEO.map(d=>`
      <div class="b11-s116-geo-row">
        <div class="b11-s116-geo-flag">${d.flag}</div>
        <div class="b11-s116-geo-label">${d.name}</div>
        <div class="b11-s116-geo-track">
          <div class="b11-s116-geo-fill" style="width:${Math.round(d.pct/max*100)}%;background:${d.color==='#EEEDFE'?'#52524C':d.color};">${d.pct}%</div>
        </div>
        <div class="b11-s116-geo-pct">${d.pct}%</div>
      </div>`).join('');
  }

  const t1=g('b11-s116-t1'), t2=g('b11-s116-t2');
  const p1=g('b11-s116-p1'), p2=g('b11-s116-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b11-s116-tab s116-act'; t2.className='b11-s116-tab';
    p1.className='b11-s116-pane show'; p2.className='b11-s116-pane';
    requestAnimationFrame(()=>drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b11-s116-tab s116-act'; t1.className='b11-s116-tab';
    p2.className='b11-s116-pane show'; p1.className='b11-s116-pane';
    renderGeo();
  });

  drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS);
    })).observe(g('b11-s116-cv-pool')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.5 SIMULATION (Mining Energy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;

  const DONUT_DATA=[
    {pct:26,color:'#0F6E56'},{pct:17,color:'#5DCAA5'},
    {pct:25,color:'#534AB7'},{pct:22,color:'#854F0B'},{pct:10,color:'#52524C'},
  ];

  function drawDonut(){
    const cv=g('b11-s115-donut'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||180;
    const H=180;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;
    const R=Math.min(W,H)*0.42, r=Math.min(W,H)*0.24;
    let angle=-Math.PI/2;
    DONUT_DATA.forEach(d=>{
      const sweep=(d.pct/100)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle,angle+sweep);ctx.closePath();
      ctx.fillStyle=d.color;ctx.fill();
      angle+=sweep;
    });
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle=dark?'#1A1A18':'#fff';ctx.fill();
    ctx.fillStyle=dark?'#E0DED8':'#1A1A18';
    ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('~55%',cx,cy-6);
    ctx.font='9px sans-serif';ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.fillText('renewable',cx,cy+8);
  }

  const t1=g('b11-s115-t1'), t2=g('b11-s115-t2');
  const p1=g('b11-s115-p1'), p2=g('b11-s115-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b11-s115-tab s115-act'; t2.className='b11-s115-tab';
    p1.className='b11-s115-pane show'; p2.className='b11-s115-pane';
    requestAnimationFrame(drawDonut);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b11-s115-tab s115-act'; t1.className='b11-s115-tab';
    p2.className='b11-s115-pane show'; p1.className='b11-s115-pane';
  });

  drawDonut();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawDonut)).observe(g('b11-s115-donut')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.4 SIMULATION (Mining Profitability)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function val(id){return parseFloat(g(id)?.value||0);}

  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const NETWORK_HASHRATE=600e18;
  const BLOCK_REWARD=3.125;
  const BLOCKS_PER_DAY=144;

  function btcPerDay(hashTH){
    return (hashTH*1e12/NETWORK_HASHRATE)*BLOCK_REWARD*BLOCKS_PER_DAY;
  }

  function calc(){
    const btcPrice=val('b11-s114-btc');
    const elecPrice=val('b11-s114-elec');
    const hashTH=val('b11-s114-hash');
    const watt=val('b11-s114-watt');
    if(!btcPrice||!elecPrice||!hashTH||!watt) return;

    const bpd=btcPerDay(hashTH);
    const incUSD=bpd*btcPrice;
    const elecCost=watt/1000*24*elecPrice;
    const profit=incUSD-elecCost;
    const eff=+(watt/hashTH).toFixed(1);
    const hashprice=+(incUSD/hashTH).toFixed(4);
    const breakeven=bpd>0?Math.round(elecCost/bpd):0;

    const pv=g('b11-s114-profit');
    if(pv){pv.textContent=(profit>=0?'+$':'−$')+Math.abs(profit).toFixed(2);pv.className='b11-s114-profit-val '+(profit>1?'s114-profit':profit<-1?'s114-loss':'s114-breakeven');}
    const ib=g('b11-s114-inc-btc'); if(ib) ib.textContent=bpd.toFixed(8)+' BTC';
    const iu=g('b11-s114-inc-usd'); if(iu) iu.textContent='$'+incUSD.toFixed(2);
    const ec=g('b11-s114-elec-cost'); if(ec) ec.textContent='$'+elecCost.toFixed(2);
    const ef=g('b11-s114-eff'); if(ef) ef.textContent=eff+' W/TH';
    const be=g('b11-s114-breakeven'); if(be) be.textContent='$'+breakeven.toLocaleString();
    const hp=g('b11-s114-hashprice'); if(hp) hp.textContent='$'+hashprice+' / TH/day';

    const mf=g('b11-s114-margin-fill');
    if(mf){
      if(profit>0){
        const pct=Math.min(95,Math.round(profit/(profit+elecCost)*100));
        mf.style.width=pct+'%'; mf.style.background='#0F6E56';
      } else {
        const pct=Math.min(95,Math.round(Math.abs(profit)/(Math.abs(profit)+incUSD)*100));
        mf.style.width=pct+'%'; mf.style.background='#A32D2D';
      }
    }

    const note=g('b11-s114-note');
    if(note){
      if(profit>1){note.textContent=`Profitable! With a BTC price of $${btcPrice.toLocaleString()} and electricity at $${elecPrice}/kWh, the estimated profit is $${profit.toFixed(2)} per day. Break-even price at $${breakeven.toLocaleString()}.`;note.className='b11-s114-note s114-profit';}
      else if(profit<-1){note.textContent=`Loss. The electricity cost ($${elecCost.toFixed(2)}/day) exceeds the revenue ($${incUSD.toFixed(2)}/day). It needs a BTC price of at least $${breakeven.toLocaleString()} to break even.`;note.className='b11-s114-note s114-loss';}
      else{note.textContent='Almost break-even. Revenue and costs are nearly balanced. A small change in the BTC price or electricity cost could flip the situation.';note.className='b11-s114-note s114-breakeven';}
    }

    drawChart(btcPrice, elecPrice, hashTH, watt);
  }

  function drawChart(curBtc, elecPrice, hashTH, watt){
    const cv=g('b11-s114-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=120;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill();

    const minP=Math.max(1000,Math.round(curBtc*0.2));
    const maxP=Math.round(curBtc*2.5);
    const steps=50;
    const prices=Array.from({length:steps+1},(_,i)=>minP+(maxP-minP)*i/steps);
    const elecCost=watt/1000*24*elecPrice;
    const profits=prices.map(p=>btcPerDay(hashTH)*p-elecCost);

    const maxP2=Math.max(...profits), minP2=Math.min(...profits);
    const range=maxP2-minP2||1;
    const pad={t:10,r:10,b:22,l:10};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;

    function xp(i){return pad.l+i/steps*cw;}
    function yp(v){return pad.t+ch*(1-(v-minP2)/range);}

    const zeroY=yp(0);
    ctx.beginPath();ctx.moveTo(pad.l,zeroY);ctx.lineTo(pad.l+cw,zeroY);
    ctx.strokeStyle='rgba(163,45,45,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);

    ctx.beginPath();
    profits.forEach((v,i)=>{i===0?ctx.moveTo(xp(i),yp(v)):ctx.lineTo(xp(i),yp(v));});
    ctx.lineTo(xp(steps),yp(minP2));ctx.lineTo(xp(0),yp(minP2));ctx.closePath();
    ctx.fillStyle='rgba(83,74,183,0.12)';ctx.fill();

    ctx.beginPath();
    profits.forEach((v,i)=>{i===0?ctx.moveTo(xp(i),yp(v)):ctx.lineTo(xp(i),yp(v));});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=1.5;ctx.stroke();

    const curIdx=prices.findIndex(p=>p>=curBtc);
    if(curIdx>=0){
      const cx=xp(curIdx), cy=yp(profits[curIdx]);
      ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);
      ctx.fillStyle=profits[curIdx]>=0?'#0F6E56':'#A32D2D';ctx.fill();
    }

    [minP,curBtc,maxP].forEach(p=>{
      const i=Math.round((p-minP)/(maxP-minP)*steps);
      ctx.fillStyle=dark?'#A0A098':'#3A3A35';
      ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText('$'+Math.round(p/1000)+'k',xp(i),H-pad.b+4);
    });

    ctx.fillStyle='rgba(163,45,45,0.7)';ctx.font='9px sans-serif';ctx.textAlign='left';ctx.textBaseline='bottom';
    ctx.fillText('break-even',pad.l+2,zeroY-2);
  }

  ['b11-s114-btc','b11-s114-elec','b11-s114-hash','b11-s114-watt'].forEach(id=>{
    const el=g(id); if(el) el.addEventListener('input',calc);
  });

  document.querySelectorAll('.b11-s114-preset').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b11-s114-preset').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const h=g('b11-s114-hash'); if(h) h.value=btn.dataset.hash;
      const w=g('b11-s114-watt'); if(w) w.value=btn.dataset.watt;
      calc();
    });
  });

  calc();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(calc)).observe(g('b11-s114-cv')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.3 SIMULATION (Mining Pool vs Solo)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const BLOCKS=20, SOLO_PROB=0.01, MY_SHARE=0.01, POOL_FEE=0.02, REWARD=3.125;

  let soloData=[], poolData=[], shareData=[], running=false;

  function drawChart(cvId, data, color, maxVal){
    const cv=g(cvId); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    const H=100;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    if(data.length<1) return;
    const max=Math.max(maxVal,...data,0.01);
    const bw=W/BLOCKS;
    data.forEach((v,i)=>{
      const bh=Math.round((v/max)*(H-10));
      const x=i*bw+1, y=H-bh-2;
      ctx.fillStyle=v>0?color:'rgba(160,160,152,0.15)';
      ctx.globalAlpha=v>0?0.85:0.4;
      ctx.fillRect(x,y,bw-2,bh);
      ctx.globalAlpha=1;
    });
    ctx.beginPath();ctx.moveTo(0,H-2);ctx.lineTo(W,H-2);
    ctx.strokeStyle='rgba(160,160,152,0.2)';ctx.lineWidth=0.5;ctx.stroke();
  }

  function renderShares(){
    const el=g('b11-s113-shares'); if(!el) return;
    el.innerHTML=shareData.map(s=>`<div class="b11-s113-share ${s}"></div>`).join('');
  }

  function updateStats(){
    const soloBlocks=soloData.filter(v=>v>0).length;
    const soloTotal=soloData.reduce((a,b)=>a+b,0);
    const poolTotal=poolData.reduce((a,b)=>a+b,0);
    const poolRounds=poolData.filter(v=>v>0).length;
    const sb=g('b11-s113-solo-blocks'); if(sb){sb.textContent=`${soloBlocks} / ${soloData.length}`;sb.className='b11-s113-stat-val '+(soloBlocks>2?'s113-good':soloBlocks>0?'s113-warn':'s113-bad');}
    const si=g('b11-s113-solo-income'); if(si){si.textContent=soloTotal.toFixed(4)+' BTC';si.className='b11-s113-stat-val '+(soloTotal>0?'s113-good':'s113-warn');}
    const pr=g('b11-s113-pool-rewards'); if(pr){pr.textContent=`${poolRounds} / ${poolData.length}`;pr.className='b11-s113-stat-val s113-good';}
    const pi=g('b11-s113-pool-income'); if(pi){pi.textContent=poolTotal.toFixed(4)+' BTC';pi.className='b11-s113-stat-val s113-good';}
  }

  async function simulate(){
    running=true;
    const rb=g('b11-s113-run'); if(rb) rb.disabled=true;
    soloData=[]; poolData=[]; shareData=[];
    const note=g('b11-s113-note');
    const poolReward=+(REWARD*MY_SHARE*(1-POOL_FEE)).toFixed(6);

    for(let b=0;b<BLOCKS;b++){
      const soloWin=Math.random()<SOLO_PROB;
      soloData.push(soloWin?REWARD:0);
      poolData.push(poolReward);

      const sharesPerBlock=40;
      const myIdx=Math.floor(Math.random()*sharesPerBlock);
      const winIdx=Math.floor(Math.random()*sharesPerBlock);
      for(let s=0;s<sharesPerBlock;s++){
        if(s===winIdx) shareData.push('winning');
        else if(s===myIdx) shareData.push('mine');
        else shareData.push('normal');
      }

      drawChart('b11-s113-cv-solo',soloData,'#854F0B',REWARD);
      drawChart('b11-s113-cv-pool',poolData,'#0F6E56',poolReward*2);
      renderShares(); updateStats();

      if(note){
        note.textContent=`Block ${b+1}/${BLOCKS}: ${soloWin?'Solo miner found a block! +'+REWARD+' BTC':'Solo miner didn’t find a block (0 BTC)'}. The pool gives ${poolReward} BTC.`;
        note.className='b11-s113-note s113-run';
      }
      await new Promise(r=>setTimeout(r,300));
    }

    const soloTotal=soloData.reduce((a,b)=>a+b,0);
    const poolTotal=poolData.reduce((a,b)=>a+b,0);
    const soloBlocks=soloData.filter(v=>v>0).length;
    if(note){
      note.textContent=`Simulation complete! Solo: ${soloBlocks} blocks found, total ${soloTotal.toFixed(4)} BTC. Pool: received a reward ${BLOCKS} times, total ${poolTotal.toFixed(4)} BTC. Long-term total income is almost the same, but the pool is far more predictable.`;
      note.className='b11-s113-note s113-done';
    }
    running=false;
    if(rb) rb.disabled=false;
  }

  const runBtn=g('b11-s113-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) simulate();});
  const rstBtn=g('b11-s113-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(running) return;
    soloData=[]; poolData=[]; shareData=[];
    drawChart('b11-s113-cv-solo',[],'#854F0B',REWARD);
    drawChart('b11-s113-cv-pool',[],'#0F6E56',0.03);
    renderShares(); updateStats();
    ['b11-s113-solo-blocks','b11-s113-pool-rewards'].forEach(id=>{const el=g(id);if(el) el.textContent='0 / 0';});
    ['b11-s113-solo-income','b11-s113-pool-income'].forEach(id=>{const el=g(id);if(el) el.textContent='0 BTC';});
    if(runBtn) runBtn.disabled=false;
    const note=g('b11-s113-note');
    if(note){note.textContent='You have 1% of the network hash rate. As a solo miner, the probability of finding a block is very low. Joining a pool ensures a small but consistent income every block.';note.className='b11-s113-note s113-idle';}
  });

  drawChart('b11-s113-cv-solo',[],'#854F0B',REWARD);
  drawChart('b11-s113-cv-pool',[],'#0F6E56',0.03);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawChart('b11-s113-cv-solo',soloData,'#854F0B',REWARD);
      drawChart('b11-s113-cv-pool',poolData,'#0F6E56',0.03);
    })).observe(g('b11-s113-cv-solo')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.2 SIMULATION (Hardware Evolution)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const ERAS=[
    {icon:'💻',name:'CPU Mining',period:'2009-2010',
     hashrate:'~10 MH/s',efficiency:'~0.002 MH/W',cost:'Ordinary laptop',color:'#52524C',
     desc:'In Bitcoin’s early days, all mining was done with a laptop or desktop CPU. Satoshi himself mined with a CPU. The hash rate of the whole network was very low — anyone could mine a block in minutes. There was no meaningful competition.'},
    {icon:'🎮',name:'GPU Mining',period:'2010-2013',
     hashrate:'~500 MH/s',efficiency:'~0.3 MH/W',cost:'Gaming graphics card',color:'#854F0B',
     desc:'A GPU can perform thousands of parallel operations at once, far better suited to SHA-256 than a CPU. The hash rate jumped 50x. CPU mining was practically no longer profitable. Many miners built rigs with many GPUs at once.'},
    {icon:'🔧',name:'FPGA Mining',period:'2011-2013',
     hashrate:'~1 GH/s',efficiency:'~1.5 MH/W',cost:'Special programmable chip',color:'#534AB7',
     desc:'An FPGA can be programmed specifically for SHA-256, more efficient than a GPU. But this era was short because the far more efficient ASIC soon arrived. The FPGA became a bridge between the GPU and the ASIC.'},
    {icon:'⚡',name:'ASIC Mining',period:'2013-present',
     hashrate:'200+ TH/s',efficiency:'~57 TH/W',cost:'Specialized industrial machine',color:'#0F6E56',
     desc:'An ASIC is designed from scratch for SHA-256 only. It can’t be used for anything else. The result: efficiency far beyond all previous technologies. A modern ASIC reaches 200+ TH/s. Mining is now dominated by large companies with industrial facilities.'},
  ];

  function renderDetail(i){
    const e=ERAS[i];
    const el=g('b11-s112-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b11-s112-detail-head" style="background:${e.color}18;">
        <div class="b11-s112-detail-icon">${e.icon}</div>
        <div>
          <div class="b11-s112-detail-title" style="color:${e.color};">${e.name}</div>
          <div class="b11-s112-detail-sub">${e.period}</div>
        </div>
      </div>
      <div class="b11-s112-detail-body">
        <div class="b11-s112-metrics">
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Hash rate tipikal</div><div class="b11-s112-metric-val" style="color:${e.color};">${e.hashrate}</div></div>
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Efisiensi energi</div><div class="b11-s112-metric-val" style="color:${e.color};">${e.efficiency}</div></div>
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Hardware</div><div class="b11-s112-metric-val" style="color:${e.color};font-size:11px;">${e.cost}</div></div>
        </div>
        <div class="b11-s112-era-desc">${e.desc}</div>
      </div>`;
  }

  function setActive(i){
    document.querySelectorAll('.b11-s112-era').forEach((el,idx)=>{
      el.className='b11-s112-era'+(idx===i?' active':'');
    });
    renderDetail(i);
  }

  document.querySelectorAll('.b11-s112-era').forEach(el=>{
    el.addEventListener('click',()=>setActive(parseInt(el.dataset.era)));
  });

  setActive(0);
})();

// ============================================================

// ============================================================
// PAGE 15 · BAB 12 · NAVIGATION
// ============================================================
function showSectionInContentB12(sectionId, sbId) {
  document.querySelectorAll('#page-bab12 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab12 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab12-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 15 · BAB 12 · TOPBAR
// ============================================================
document.getElementById('back-home-b12').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b12').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 15 · BAB 12 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab12').addEventListener('click', () => navigate('page-bab12'));

// ============================================================
// PAGE 15 · BAB 12 · SIDEBAR EVENTS (12.1 - 12.6)
// ============================================================
document.getElementById('sb-12-1').addEventListener('click', () => showSectionInContentB12('section-12-1', 'sb-12-1'));
document.getElementById('sb-12-2').addEventListener('click', () => showSectionInContentB12('section-12-2', 'sb-12-2'));
document.getElementById('sb-12-3').addEventListener('click', () => showSectionInContentB12('section-12-3', 'sb-12-3'));
document.getElementById('sb-12-4').addEventListener('click', () => showSectionInContentB12('section-12-4', 'sb-12-4'));
document.getElementById('sb-12-5').addEventListener('click', () => showSectionInContentB12('section-12-5', 'sb-12-5'));
document.getElementById('sb-12-6').addEventListener('click', () => showSectionInContentB12('section-12-6', 'sb-12-6'));

// ============================================================
// PAGE 15 · BAB 12 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab12 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB12(target, sb);
  });
});

// ============================================================
// PAGE 15 · BAB 12 · 12.6 SIMULATION (Threat Model)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const PROFILES=[
    {
      icon:'👤',title:'Casual User',sub:'Basic privacy, doesn’t want hassle',
      threatLabel:'Threat level: low to medium',threatPct:25,threatColor:'#0F6E56',
      recs:[
        {level:'must',badge:'Required',text:'Use an HD wallet — a new address automatically every transaction. Almost all modern wallets already do this.'},
        {level:'must',badge:'Required',text:'Don’t post a Bitcoin address on public social media linked to your real identity.'},
        {level:'should',badge:'Recommended',text:'Use Lightning for small everyday payments — more private than on-chain.'},
        {level:'nice',badge:'Optional',text:'Separate UTXOs from an exchange (KYC) and UTXOs from other sources — don’t combine them in one transaction.'},
      ],
      avoids:['Using the same address more than once','Posting transaction screenshots publicly'],
    },
    {
      icon:'🏪',title:'Merchant',sub:'Receives payments from many customers',
      threatLabel:'Threat level: medium — customers can see the store balance',threatPct:50,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Required',text:'Use BTCPay Server or a wallet that supports Payjoin — hide the receiving pattern from customers.'},
        {level:'must',badge:'Required',text:'Generate a new address for every invoice — don’t use one address for all customers.'},
        {level:'should',badge:'Recommended',text:'Accept Lightning payments via BOLT 12 Offers — more private than an ordinary invoice that can be correlated.'},
        {level:'should',badge:'Recommended',text:'Separate the operational wallet from the long-term storage wallet.'},
        {level:'nice',badge:'Optional',text:'Do UTXO consolidation when fees are low, but be careful about the privacy implications of combining UTXOs.'},
      ],
      avoids:['Using one address for all customers','Posting the wallet balance publicly','Combining UTXOs from different customers without consideration'],
    },
    {
      icon:'📈',title:'Long-term Investor',sub:'Holds a significant amount of Bitcoin',
      threatLabel:'Threat level: medium to high — target of theft or extortion',threatPct:65,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Required',text:'Never reveal how much Bitcoin you own to anyone who doesn’t need to know.'},
        {level:'must',badge:'Required',text:'Use a hardware wallet separate from everyday activity — cold storage for long-term hodling.'},
        {level:'must',badge:'Required',text:'Buy Bitcoin from different sources to avoid an easily traceable purchase profile.'},
        {level:'should',badge:'Recommended',text:'Consider CoinJoin before moving to cold storage — separate the on-chain history from your identity.'},
        {level:'nice',badge:'Optional',text:'Use your own Bitcoin node when transacting — don’t rely on a public node that can monitor your IP.'},
      ],
      avoids:['Showing off Bitcoin holdings in public','Storing all Bitcoin in one wallet','Using an exchange unnecessarily for every transaction'],
    },
    {
      icon:'🛡️',title:'High Privacy',sub:'Needs strong protection from surveillance',
      threatLabel:'Threat level: high — state surveillance or malicious actors',threatPct:90,threatColor:'#A32D2D',
      recs:[
        {level:'must',badge:'Required',text:'Obtain Bitcoin without KYC — peer-to-peer exchange, mining, or a service that doesn’t ask for identity.'},
        {level:'must',badge:'Required',text:'Run your own Bitcoin full node and only broadcast transactions through your own node or via Tor.'},
        {level:'must',badge:'Required',text:'Use CoinJoin before every significant spend — break the on-chain tracing chain.'},
        {level:'must',badge:'Required',text:'Use Silent Payments or BOLT 12 to receive payments without exposing your address.'},
        {level:'should',badge:'Recommended',text:'Strictly separate different digital identities — don’t mix wallets with different purposes.'},
      ],
      avoids:['KYC at any exchange if it can be avoided','Using a wallet connected to a third-party server','Transacting with your real IP without Tor or a VPN','Combining UTXOs from different sources'],
    },
  ];

  function renderDetail(i){
    const p=PROFILES[i];
    const el=g('b12-s126-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b12-s126-detail-head">
        <div class="b12-s126-detail-icon">${p.icon}</div>
        <div>
          <div class="b12-s126-detail-title">${p.title}</div>
          <div class="b12-s126-detail-sub">${p.sub}</div>
        </div>
      </div>
      <div class="b12-s126-detail-body">
        <div class="b12-s126-threat">
          <div class="b12-s126-threat-label">${p.threatLabel}</div>
          <div class="b12-s126-threat-bar"><div class="b12-s126-threat-fill" style="width:${p.threatPct}%;background:${p.threatColor};"></div></div>
        </div>
        <div class="b12-s126-recs">
          <div class="b12-s126-recs-label">Recommendations:</div>
          ${p.recs.map(r=>`
            <div class="b12-s126-rec ${r.level}">
              <span class="b12-s126-rec-badge">${r.badge}</span>
              <div class="b12-s126-rec-text">${r.text}</div>
            </div>`).join('')}
        </div>
        <div class="b12-s126-avoid">
          <div class="b12-s126-avoid-label">Avoid:</div>
          ${p.avoids.map(a=>`<div class="b12-s126-avoid-item">✗ ${a}</div>`).join('')}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b12-s126-profile').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b12-s126-profile').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      renderDetail(parseInt(el.dataset.profile));
    });
  });

  renderDetail(0);
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.5 SIMULATION (Lightning Privacy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  const OC_IDS=['b12-s125-oc1','b12-s125-oc2','b12-s125-oc3','b12-s125-oc4','b12-s125-oc5',
                'b12-s125-oc6','b12-s125-oc7','b12-s125-oc8','b12-s125-oc9','b12-s125-oc10'];

  async function runSim(){
    running=true;
    const rb=g('b12-s125-run1'); if(rb) rb.disabled=true;
    const note=g('b12-s125-note1');

    for(let i=0;i<OC_IDS.length;i++){
      const el=g(OC_IDS[i]); if(el) el.classList.add('visible');
      if(i===0){const lnO=g('b12-s125-ln-open');if(lnO) lnO.classList.add('visible');}
      if(i===4){const lnP=g('b12-s125-ln-p1');if(lnP) lnP.classList.add('visible');}
      if(note) note.textContent=`Payment #${i+1} sent... On-chain: publicly visible. Lightning: hidden inside the channel.`;
      if(note) note.className='b12-s125-note s125-run';
      await wait(400);
    }

    await wait(300);
    const lnC=g('b12-s125-ln-close'); if(lnC) lnC.classList.add('visible');
    await wait(300);
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='grid';
    if(note){note.textContent='Done! On-chain: 10 transactions publicly visible. Lightning: only channel open and close are recorded on the blockchain, the 10 payments inside are not visible at all.';note.className='b12-s125-note s125-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  const runBtn=g('b12-s125-run1'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) runSim();});
  const rstBtn=g('b12-s125-rst1');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(running) return;
    [...OC_IDS,'b12-s125-ln-open','b12-s125-ln-p1','b12-s125-ln-close'].forEach(id=>{
      const el=g(id); if(el) el.classList.remove('visible');
    });
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='none';
    const rb=g('b12-s125-run1'); if(rb) rb.disabled=false;
    const note=g('b12-s125-note1');
    if(note){note.textContent='Click "Simulate 10 Payments" to see the difference in visibility between on-chain and Lightning payments.';note.className='b12-s125-note s125-idle';}
  });

  const t1=g('b12-s125-t1'), t2=g('b12-s125-t2');
  const p1=g('b12-s125-p1'), p2=g('b12-s125-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b12-s125-tab s125-act'; t2.className='b12-s125-tab';
    p1.className='b12-s125-pane show'; p2.className='b12-s125-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b12-s125-tab s125-act'; t1.className='b12-s125-tab';
    p2.className='b12-s125-pane show'; p1.className='b12-s125-pane';
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.4 SIMULATION (Silent Payments)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  async function run(){
    running=true;
    const rb=g('b12-s124-run'); if(rb) rb.disabled=true;
    const note=g('b12-s124-note');

    if(note){note.textContent='Alice computes a unique address from the static address using its public key...';note.className='b12-s124-note s124-run';}
    await wait(700);
    const ra=g('b12-s124-res-alice'); if(ra) ra.classList.add('show');

    if(note) note.textContent='Bob computes a different unique address from the same public key...';
    await wait(700);
    const rb2=g('b12-s124-res-bob'); if(rb2) rb2.classList.add('show');

    if(note) note.textContent='Carol generates a third unique address, all different even though the destination is the same...';
    await wait(700);
    const rc=g('b12-s124-res-carol'); if(rc) rc.classList.add('show');

    await wait(500);
    if(note) note.textContent='The three transactions enter the blockchain. The analyst sees three different addresses...';
    const bc=g('b12-s124-blockchain'); if(bc) bc.classList.add('show');
    await wait(400);
    ['b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*300);
    });
    await wait(1200);
    const ln=g('b12-s124-link-note'); if(ln) ln.classList.add('show');
    await wait(600);

    if(note) note.textContent='The recipient scans the blockchain with their private key to find the payments...';
    const sc=g('b12-s124-scan'); if(sc) sc.classList.add('show');
    await wait(400);
    ['b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*400);
    });
    await wait(1400);

    if(note){note.textContent='Done! Three senders, one static address, three on-chain addresses that can’t be linked. Only the recipient knows all three are theirs.';note.className='b12-s124-note s124-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  function reset(){
    if(running) return;
    ['b12-s124-res-alice','b12-s124-res-bob','b12-s124-res-carol',
     'b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3','b12-s124-link-note',
     'b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3',
     'b12-s124-blockchain','b12-s124-scan'].forEach(id=>{
      const el=g(id); if(el) el.classList.remove('show');
    });
    const rb=g('b12-s124-run'); if(rb) rb.disabled=false;
    const note=g('b12-s124-note');
    if(note){note.textContent='Click "Simulate Sending" to see how three different senders generate different on-chain addresses from the same single static address.';note.className='b12-s124-note s124-idle';}
  }

  const runBtn=g('b12-s124-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) run();});
  const rstBtn=g('b12-s124-rst'); if(rstBtn) rstBtn.addEventListener('click',reset);
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.2 SIMULATION (CoinJoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const t1=g('b12-s122-t1'), t2=g('b12-s122-t2');
  const p1=g('b12-s122-p1'), p2=g('b12-s122-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b12-s122-tab s122-act'; t2.className='b12-s122-tab';
    p1.className='b12-s122-pane show'; p2.className='b12-s122-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b12-s122-tab s122-act'; t1.className='b12-s122-tab';
    p2.className='b12-s122-pane show'; p1.className='b12-s122-pane';
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.3 SIMULATION (Payjoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let applied=false;

  const applyBtn=g('b12-s123-apply');
  if(applyBtn) applyBtn.addEventListener('click',()=>{
    if(applied) return; applied=true;
    const an=g('b12-s123-a-normal'); if(an) an.style.display='flex';
    const ap=g('b12-s123-a-payjoin'); if(ap) ap.style.display='flex';
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='grid';
    const note=g('b12-s123-note');
    if(note){note.textContent='Payjoin looks identical to an ordinary transaction from the outside. The analyst can’t tell them apart just by looking at the blockchain, that’s what makes it stronger than CoinJoin whose pattern can be recognized.';note.className='b12-s123-note s123-info';}
  });

  const rstBtn=g('b12-s123-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    applied=false;
    ['b12-s123-a-normal','b12-s123-a-payjoin'].forEach(id=>{const el=g(id);if(el) el.style.display='none';});
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='none';
    const note=g('b12-s123-note');
    if(note){note.textContent='Click "Apply Common Input Heuristic" to see why the analyst reaches a different conclusion from two transactions that look almost the same.';note.className='b12-s123-note s123-idle';}
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.1 SIMULATION (Blockchain Analysis)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let gW=0, gH=0, curH=1;

  const HDATA={
    1:{
      nodes:[
        {id:'A1',label:'Addr A1\n0.8 BTC',x:0.10,y:0.20,cls:'addr'},
        {id:'A2',label:'Addr A2\n0.5 BTC',x:0.10,y:0.65,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'B1',label:'Addr B\n1.2 BTC',x:0.75,y:0.25,cls:'addr'},
        {id:'C1',label:'Change\n0.08 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'A1',to:'TX',color:'rgba(83,74,183,0.5)'},{from:'A2',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'B1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'C1',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['A1','A2'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristic detected',text:'A1 and A2 are used together as inputs in one transaction.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'With very high probability, A1 and A2 are owned by the same person. The analyst merges both as one entity.'},
        {icon:'📊',label:'Privacy impact',text:'If one of the addresses was ever identified, for example from an exchange, the other address is identified too.'},
      ],
      note:'Common Input Ownership is the most powerful heuristic in blockchain analysis. Using it means you inadvertently confirm that all the UTXOs you combine are yours.',
    },
    2:{
      nodes:[
        {id:'S1',label:'Sender\n1.0 BTC',x:0.10,y:0.42,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'R1',label:'Recipient\n0.9 BTC',x:0.75,y:0.20,cls:'addr'},
        {id:'CH',label:'Change\n0.09 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'S1',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'R1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'CH',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['CH'],linked:['S1'],
      findings:[
        {icon:'🔍',label:'Heuristic detected',text:'The 0.9 BTC output is a round number, likely an intentional payment. The 0.09 BTC output is a non-round number, likely the change.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'The 0.09 BTC output is most likely returned to the sender. The analyst marks the change address as belonging to the same sender.'},
        {icon:'📊',label:'Privacy impact',text:'The sender’s real balance can be estimated. The next transaction from the change address will continue to be traced.'},
      ],
      note:'Change output detection works because of predictable value patterns. One mitigation is to use CoinJoin which equalizes output values so the analyst can’t distinguish payment from change.',
    },
    3:{
      nodes:[
        {id:'TX1',label:'TX 1\nJan',x:0.18,y:0.25,cls:'tx'},
        {id:'TX2',label:'TX 2\nMar',x:0.18,y:0.65,cls:'tx'},
        {id:'ADDR',label:'Addr X\n(reused)',x:0.50,y:0.42,cls:'addr'},
        {id:'TX3',label:'TX 3\nJun',x:0.82,y:0.25,cls:'tx'},
        {id:'TX4',label:'TX 4\nAug',x:0.82,y:0.65,cls:'tx'},
      ],
      edges:[
        {from:'TX1',to:'ADDR',color:'rgba(83,74,183,0.4)'},{from:'TX2',to:'ADDR',color:'rgba(83,74,183,0.4)'},
        {from:'ADDR',to:'TX3',color:'rgba(83,74,183,0.4)'},{from:'ADDR',to:'TX4',color:'rgba(83,74,183,0.4)'},
      ],
      flagged:['ADDR'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristic detected',text:'Address X appears in 4 different transactions as both recipient and sender.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'All transactions involving Address X are linked. The total balance in and out can be calculated accurately.'},
        {icon:'📊',label:'Privacy impact',text:'If one of these 4 transactions can be linked to a real identity, the entire financial history of this address is exposed.'},
      ],
      note:'Address reuse is the easiest privacy mistake to avoid. Modern wallets (HD wallets) automatically generate a new address for every transaction. There’s no reason to use the same address more than once.',
    },
  };

  function getPos(node){return {x:node.x*gW,y:node.y*gH};}

  function render(h){
    const gr=g('b12-s121-graph'); if(!gr) return;
    gW=gr.getBoundingClientRect().width||300;
    gH=gr.getBoundingClientRect().height||240;
    gr.querySelectorAll('.b12-s121-node').forEach(el=>el.remove());
    const svg=g('b12-s121-svg'); if(svg) svg.innerHTML='';

    const hd=HDATA[h];

    hd.edges.forEach(e=>{
      const fn=hd.nodes.find(n=>n.id===e.from);
      const tn=hd.nodes.find(n=>n.id===e.to);
      if(!fn||!tn) return;
      const p1=getPos(fn), p2=getPos(tn);
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',p1.x);line.setAttribute('y1',p1.y);
      line.setAttribute('x2',p2.x);line.setAttribute('y2',p2.y);
      line.setAttribute('stroke',e.color);line.setAttribute('stroke-width','1.5');
      if(e.dash) line.setAttribute('stroke-dasharray','4,3');
      if(svg) svg.appendChild(line);
    });

    hd.nodes.forEach(n=>{
      const pos=getPos(n);
      const el=document.createElement('div');
      el.className='b12-s121-node';
      el.style.left=(pos.x-21)+'px';
      el.style.top=(pos.y-21)+'px';
      let cls=n.cls;
      if(hd.flagged.includes(n.id)) cls='flagged';
      else if(hd.linked.includes(n.id)) cls='linked';
      el.innerHTML=`<div class="b12-s121-node-circle ${cls}">${n.id}</div>
        <div class="b12-s121-node-label">${n.label.replace('\n','<br>')}</div>`;
      gr.appendChild(el);
    });

    const fd=g('b12-s121-findings');
    if(fd) fd.innerHTML=hd.findings.map(f=>`
      <div class="b12-s121-finding">
        <div class="b12-s121-finding-icon">${f.icon}</div>
        <div class="b12-s121-finding-text">
          <div class="b12-s121-finding-label">${f.label}</div>${f.text}
        </div>
      </div>`).join('');

    const note=g('b12-s121-note');
    if(note){note.textContent=hd.note;note.className='b12-s121-note s121-warn';}
  }

  function setH(h){
    curH=h;
    ['b12-s121-h1','b12-s121-h2','b12-s121-h3'].forEach((id,i)=>{
      const el=g(id); if(el) el.className='b12-s121-heur-btn'+(i+1===h?' s121-act':'');
    });
    render(h);
  }

  const h1=g('b12-s121-h1'),h2=g('b12-s121-h2'),h3=g('b12-s121-h3');
  if(h1) h1.addEventListener('click',()=>setH(1));
  if(h2) h2.addEventListener('click',()=>setH(2));
  if(h3) h3.addEventListener('click',()=>setH(3));

  setH(1);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>render(curH))).observe(g('b12-s121-graph')||document.body);
  }
})();

// ============================================================
// PAGE 16 · BAB 13 · NAVIGATION
// ============================================================
function showSectionInContentB13(sectionId, sbId) {
  document.querySelectorAll('#page-bab13 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab13 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab13-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 16 · BAB 13 · TOPBAR
// ============================================================
document.getElementById('back-home-b13').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b13').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 16 · BAB 13 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab13').addEventListener('click', () => navigate('page-bab13'));

// ============================================================
// PAGE 16 · BAB 13 · SIDEBAR EVENTS (13.1 - 13.6)
// ============================================================
document.getElementById('sb-13-1').addEventListener('click', () => showSectionInContentB13('section-13-1', 'sb-13-1'));
document.getElementById('sb-13-2').addEventListener('click', () => showSectionInContentB13('section-13-2', 'sb-13-2'));
document.getElementById('sb-13-3').addEventListener('click', () => showSectionInContentB13('section-13-3', 'sb-13-3'));
document.getElementById('sb-13-4').addEventListener('click', () => showSectionInContentB13('section-13-4', 'sb-13-4'));
document.getElementById('sb-13-5').addEventListener('click', () => showSectionInContentB13('section-13-5', 'sb-13-5'));
document.getElementById('sb-13-6').addEventListener('click', () => showSectionInContentB13('section-13-6', 'sb-13-6'));

// ============================================================
// PAGE 16 · BAB 13 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab13 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB13(target, sb);
  });
});

// ============================================================
// PAGE 16 · BAB 13 · 13.6 SIMULATION (Governance)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    dev:{
      icon:'💻',name:'Developer',
      sub:'Various implementations: Bitcoin Core, Bitcoin Knots, and others',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Technical influence',pct:80,color:'#534AB7'},
        {name:'Code control',pct:70,color:'#534AB7'},
        {name:'Protocol veto',pct:30,color:'#534AB7'},
        {name:'Force users',pct:10,color:'#534AB7'},
      ],
      strengths:['Write and review the code that the majority of nodes run','Can refuse to implement changes that aren’t agreed on','Reputation and community trust as influence capital'],
      limits:['Can’t force anyone to run their code','Anyone is free to fork the implementation and make their own version','No single implementation has absolute authority','The community can switch to another implementation at any time'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Taproot (2021): developers from various contributors designed and reviewed BIP 340-342 for almost 2 years. Great influence, but activation still needed miner signaling and node acceptance.',
    },
    miner:{
      icon:'⛏️',name:'Miner',
      sub:'Block production, network security, soft fork activation signaling',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      powers:[
        {name:'Block production',pct:100,color:'#854F0B'},
        {name:'MASF signaling',pct:90,color:'#854F0B'},
        {name:'Soft fork veto',pct:60,color:'#854F0B'},
        {name:'Force a hard fork',pct:20,color:'#854F0B'},
      ],
      strengths:['The only party that can produce new blocks','In MASF, the miners’ signal determines when a soft fork activates','Can delay soft fork activation by not signaling'],
      limits:['Can’t force users to accept bitcoin from a particular chain','The 2017 SegWit UASF proved miners can be forced by economic nodes','Blocks rejected by economic nodes generate no real income','Can’t create new bitcoin outside the halving schedule'],
      exBg:'#FAEEDA',exColor:'#633806',
      example:'SegWit (2017): miners refused to signal for almost 2 years. But when the BIP 148 UASF threatened to reject their blocks, miners finally signaled within weeks.',
    },
    node:{
      icon:'🖥️',name:'Node',
      sub:'Independent full nodes (home, community) and economic nodes (exchanges, wallets, businesses)',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      powers:[
        {name:'Consensus validation',pct:100,color:'#0F6E56'},
        {name:'Rule enforcement',pct:95,color:'#0F6E56'},
        {name:'Reject a soft fork',pct:80,color:'#0F6E56'},
        {name:'Force miners to follow',pct:75,color:'#0F6E56'},
      ],
      strengths:['The only party that truly validates and enforces the consensus rules','Independent nodes: one home node has the same weight as one exchange in validation','Economic nodes can make miner blocks worthless by rejecting them','Don’t depend on anyone to run the rules they believe are correct'],
      limits:['Independent nodes generate no income, relying on ideological motivation','The influence of independent nodes isn’t visible until a real conflict happens','Strong coordination is needed for UASF or URSF to succeed'],
      exBg:'#EAF3DE',exColor:'#0F6E56',
      example:'BIP 148 UASF (2017): thousands of independent and economic nodes threatened to reject miner blocks that didn’t support SegWit. The clearest demonstration that nodes are the true guardians of the consensus rules.',
    },
    user:{
      icon:'👤',name:'User',
      sub:'Individuals who store, send, and receive bitcoin',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Value determination',pct:90,color:'#534AB7'},
        {name:'Technology adoption',pct:70,color:'#534AB7'},
        {name:'Direct pressure',pct:30,color:'#534AB7'},
        {name:'Protocol influence',pct:20,color:'#534AB7'},
      ],
      strengths:['In the long term, users determine whether Bitcoin has value','Can choose not to use Bitcoin if they don’t like its direction','User voice forms through public discussion, forums, and social media'],
      limits:['Individual influence is very small and hard to measure','Has no formal mechanism to influence the protocol','Split into many often-conflicting opinions'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Scaling debate (2015-2017): users frustrated with high fees created significant public pressure. It didn’t directly change the protocol, but shaped the narrative that influenced all the other parties.',
    },
    biz:{
      icon:'🏢',name:'Economic Actors and Businesses',
      sub:'Exchanges, merchants, payment processors, financial institutions, and Bitcoin-based services',
      headBg:'#F4F4F0',headBorder:'rgba(26,26,24,0.15)',
      powers:[
        {name:'Economic power',pct:85,color:'#1A1A18'},
        {name:'Mass adoption',pct:80,color:'#1A1A18'},
        {name:'Chain veto',pct:70,color:'#1A1A18'},
        {name:'Protocol pressure',pct:60,color:'#1A1A18'},
      ],
      strengths:['Large exchanges can determine which chain gets liquidity','Merchants who accept Bitcoin expand adoption and give real value','Payment processors can choose which implementation they support'],
      limits:['Can’t force a protocol change directly','Depend on user trust — losing trust means losing business','Subject to regulation that can limit their technical choices'],
      exBg:'#F4F4F0',exColor:'#1A1A18',
      example:'SegWit2x (2017): more than 80% of hash rate and many large exchanges signed the New York Agreement for a hard fork. But when developers and users refused, they eventually canceled out of fear of losing legitimacy.',
    },
  };

  function render(actor){
    const d=DATA[actor]; if(!d) return;
    const el=g('b13-s136-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b13-s136-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b13-s136-detail-icon">${d.icon}</div>
        <div><div class="b13-s136-detail-name">${d.name}</div><div class="b13-s136-detail-sub">${d.sub}</div></div>
      </div>
      <div class="b13-s136-detail-body">
        <div class="b13-s136-powers">
          <div class="b13-s136-powers-label">Power dimensions:</div>
          ${d.powers.map(p=>`
            <div class="b13-s136-power-row">
              <div class="b13-s136-power-name">${p.name}</div>
              <div class="b13-s136-power-bg"><div class="b13-s136-power-fill" style="width:${p.pct}%;background:${p.color};"></div></div>
              <div class="b13-s136-power-pct">${p.pct}%</div>
            </div>`).join('')}
        </div>
        <div class="b13-s136-sl">
          <div class="b13-s136-strength">
            <div class="b13-s136-strength-label">Strengths</div>
            ${d.strengths.map(s=>`<div class="b13-s136-strength-item">${s}</div>`).join('')}
          </div>
          <div class="b13-s136-limit">
            <div class="b13-s136-limit-label">Limitations</div>
            ${d.limits.map(l=>`<div class="b13-s136-limit-item">${l}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s136-example" style="background:${d.exBg};color:${d.exColor};">
          <strong>Real example:</strong> ${d.example}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b13-s136-actor').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s136-actor').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      render(el.dataset.actor);
    });
  });

  render('dev');
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.5 SIMULATION (Taproot)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const t1=g('b13-s135-t1'), t2=g('b13-s135-t2');
  const p1=g('b13-s135-p1'), p2=g('b13-s135-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s135-tab s135-act'; t2.className='b13-s135-tab';
    p1.className='b13-s135-pane show'; p2.className='b13-s135-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s135-tab s135-act'; t1.className='b13-s135-tab';
    p2.className='b13-s135-pane show'; p1.className='b13-s135-pane';
  });
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.4 SIMULATION (SegWit Timeline)
// ============================================================
(function() {
  const filterMap={all:null,dev:'dev',miner:'miner',community:'community',result:'result'};

  document.querySelectorAll('.b13-s134-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s134-filter').forEach(b=>b.classList.remove('s134-act'));
      btn.classList.add('s134-act');
      const cur=filterMap[btn.dataset.f];
      document.querySelectorAll('.b13-s134-event').forEach(ev=>{
        const t=ev.dataset.t;
        const show=!cur || t===cur || (cur==='result' && (t==='result'||t==='split'));
        show ? ev.classList.remove('hidden') : ev.classList.add('hidden');
      });
    });
  });

  document.querySelectorAll('.b13-s134-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const wasExpanded=card.classList.contains('expanded');
      document.querySelectorAll('.b13-s134-card').forEach(c=>c.classList.remove('expanded'));
      if(!wasExpanded) card.classList.add('expanded');
    });
  });
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.3 SIMULATION (Soft Fork Activation)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    masf:{
      icon:'⛏️',name:'MASF',full:'Miner Activated Soft Fork',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      actors:[
        {role:'Developer',action:'Writes code, sets the threshold and signaling window',bg:'#F4F4F0'},
        {role:'Miner',action:'Signals support via version bits in the block header',bg:'#EEEDFE',roleColor:'#534AB7'},
        {role:'Node / User',action:'Waits for the threshold to be reached, then automatically follows the new rules',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft ready, parameters set',bg:'#EEEDFE',fg:'#534AB7'},
        {n:'2',txt:'Miners signal via version bits',bg:'#534AB7',fg:'#fff'},
        {n:'3',txt:'95% of 2016 blocks reached',bg:'#534AB7',fg:'#fff'},
        {n:'4',txt:'Soft fork locked in, can’t be canceled',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'New rules apply across the whole network',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(83,74,183,0.2)',
      pros:['Measurable with timing certainty','Miners are ready before it activates','A gradual and safe process'],
      cons:['Miners have a de facto veto','Can be sabotaged by a large mining pool','Doesn’t reflect the will of users'],
      exampleBg:'#EEEDFE',exampleColor:'#3C3489',
      example:'Used for many early Bitcoin upgrades. BIP 9 defines the version bits mechanism used by modern MASF. Example: the CSV (CheckSequenceVerify) activation in 2016.',
    },
    uasf:{
      icon:'👤',name:'UASF',full:'User Activated Soft Fork',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      actors:[
        {role:'Developer',action:'Writes code and sets a mandatory activation date',bg:'#F4F4F0'},
        {role:'Node / User',action:'Upgrades and starts rejecting non-conforming blocks on the activation date',bg:'#EAF3DE',roleColor:'#0F6E56'},
        {role:'Miner',action:'Forced to follow the new rules or their blocks are rejected by the economic network',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft, activation date set',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'2',txt:'Economic nodes start upgrading',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'3',txt:'The activation date arrives',bg:'#0F6E56',fg:'#fff'},
        {n:'4',txt:'Non-conforming blocks rejected',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'5',txt:'Miners follow or lose the reward',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(15,110,86,0.2)',
      pros:['Users have real power','Can’t be blocked by miners','Reflects the economic will of the network'],
      cons:['Risky if node adoption is low','A temporary split can occur','Requires strong community coordination'],
      exampleBg:'#EAF3DE',exampleColor:'#0F6E56',
      example:'BIP 148 (2017) is the most famous UASF. It threatened to reject miner blocks that didn’t support SegWit starting August 1, 2017. This pressure worked: miners finally signaled SegWit before the deadline.',
    },
    ursf:{
      icon:'🛡️',name:'URSF',full:'User Resisted Soft Fork',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      actors:[
        {role:'Miner',action:'Activates a soft fork not agreed on by the user community',bg:'#F4F4F0'},
        {role:'Node / User',action:'Coordinate to reject the soft fork by following the chain that doesn’t contain the new rules',bg:'#FCEBEB',roleColor:'#791F1F'},
        {role:'Developer',action:'Provides software for nodes that want to perform URSF',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'Miners activate the soft fork, the community disagrees',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'2',txt:'Economic nodes coordinate to reject',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'3',txt:'Nodes reject blocks with the new rules',bg:'#A32D2D',fg:'#fff'},
        {n:'4',txt:'Miners lose the economic value of their blocks',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'5',txt:'The soft fork is canceled or a split happens',bg:'#F4F4F0',fg:'#3A3A35'},
      ],
      connColor:'rgba(163,45,45,0.2)',
      pros:['Users can reject unwanted changes','Proves miners aren’t the final ruler','Checks and balances in governance'],
      cons:['Never used fully before','Very risky if coordination fails','Can cause prolonged uncertainty'],
      exampleBg:'#FCEBEB',exampleColor:'#791F1F',
      example:'URSF has never been used fully in Bitcoin’s history. It’s more of a theoretical weapon showing that users have the final veto right over changes forced by miners.',
    },
    speedy:{
      icon:'⚡',name:'Speedy Trial',full:'Speedy Trial (variasi MASF)',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      actors:[
        {role:'Developer',action:'Sets a short 3-month window and a 90% threshold',bg:'#F4F4F0'},
        {role:'Miner',action:'Signals within the short window, must be fast or the chance is lost',bg:'#FAEEDA',roleColor:'#854F0B'},
        {role:'Node / User',action:'Monitors the signal, ready to apply the new rules if the threshold is reached',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'The 3-month window begins',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'2',txt:'Miners signal quickly',bg:'#854F0B',fg:'#fff'},
        {n:'3',txt:'90% threshold of 2016 blocks',bg:'#854F0B',fg:'#fff'},
        {n:'4',txt:'Soft fork locked in within the window',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'Rules apply after the grace period',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(133,79,11,0.2)',
      pros:['Faster than ordinary MASF','Gives certainty without prolonged drama','Can be repeated if it fails'],
      cons:['Still depends on miner signaling','The short window can become its own pressure','Not yet tested in many situations'],
      exampleBg:'#FAEEDA',exampleColor:'#633806',
      example:'Used to activate Taproot (2021). Miners reached the 90% threshold in a short time. Taproot was activated at block 709,632 in November 2021, without meaningful controversy.',
    },
  };

  function render(mech){
    const d=DATA[mech];
    const el=g('b13-s133-detail'); if(!el) return;
    const stepsHtml=d.steps.map((s,i)=>`
      <div class="b13-s133-tl-step">
        <div class="b13-s133-tl-dot" style="background:${s.bg};color:${s.fg};">${s.n}</div>
        <div class="b13-s133-tl-txt">${s.txt}</div>
      </div>
      ${i<d.steps.length-1?`<div class="b13-s133-tl-conn" style="background:${d.connColor};"></div>`:''}`).join('');

    el.innerHTML=`
      <div class="b13-s133-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b13-s133-detail-icon">${d.icon}</div>
        <div><div class="b13-s133-detail-name">${d.name}</div><div class="b13-s133-detail-full">${d.full}</div></div>
      </div>
      <div class="b13-s133-detail-body">
        <div>
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Each party’s role:</div>
          <div class="b13-s133-actors">${d.actors.map(a=>`
            <div class="b13-s133-actor" style="background:${a.bg};">
              <div class="b13-s133-actor-role" style="color:${a.roleColor||'#3A3A35'};">${a.role}</div>
              <div class="b13-s133-actor-action">${a.action}</div>
            </div>`).join('')}
          </div>
        </div>
        <div>
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Activation flow:</div>
          <div class="b13-s133-tl-steps">${stepsHtml}</div>
        </div>
        <div class="b13-s133-proscons">
          <div class="b13-s133-pros">
            <div class="b13-s133-pros-label">Advantages</div>
            ${d.pros.map(p=>`<div class="b13-s133-pros-item">${p}</div>`).join('')}
          </div>
          <div class="b13-s133-cons">
            <div class="b13-s133-cons-label">Weaknesses</div>
            ${d.cons.map(c=>`<div class="b13-s133-cons-item">${c}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s133-example" style="background:${d.exampleBg};color:${d.exampleColor};">
          <strong>Real example:</strong> ${d.example}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b13-s133-card').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s133-card').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      render(el.dataset.mech);
    });
  });

  render('masf');
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.2 SIMULATION (BIP Lifecycle)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const BIPS={
    32:{num:'BIP 32',name:'Hierarchical Deterministic Wallets',type:'Standards Track — Applications',
      author:'Pieter Wuille',year:'2012',
      duration:'Submitted 2012, Final 2012 (a few months)',
      status:'Final',statusCls:'s132-final',
      desc:'Defines how to generate many cryptographic keys from one seed phrase. This is what allows modern wallets to use one 12-word backup for all addresses. Almost all Bitcoin wallets today implement BIP 32.'},
    141:{num:'BIP 141',name:'Segregated Witness (SegWit)',type:'Standards Track — Consensus',
      author:'Eric Lombrozo, Johnson Lau, Pieter Wuille',year:'2015',
      duration:'Submitted 2015, activated August 2017 (about 2 full years of debate)',
      status:'Final',statusCls:'s132-final',
      desc:'Separates the signature data (witness) from the main transaction data. Effectively increases block capacity, fixes transaction malleability, and opens the way for the Lightning Network. Its activation process is one of the most controversial in Bitcoin’s history.'},
    148:{num:'BIP 148',name:'UASF — Mandatory activation of segwit',type:'Standards Track — Consensus',
      author:'Shaolin Fry',year:'2017',
      duration:'Submitted March 2017, applied August 2017',
      status:'Final',statusCls:'s132-final',
      desc:'BIP 148 is a UASF (User Activated Soft Fork) that threatened to reject miner blocks not supporting SegWit starting August 1, 2017. This pressure pushed miners to finally activate SegWit before the deadline. A real example of how users and economic nodes can force change without depending on miners.'},
    340:{num:'BIP 340',name:'Schnorr Signatures',type:'Standards Track — Consensus (part of Taproot)',
      author:'Pieter Wuille, Jonas Nick, Tim Ruffing',year:'2020',
      duration:'Submitted 2020, activated November 2021 (about 1 year via Speedy Trial)',
      status:'Final',statusCls:'s132-final',
      desc:'Defines the Schnorr signature scheme for Bitcoin. More efficient than ECDSA, enables signature aggregation, and opens the way for more sophisticated privacy and smart contract features. Activated together with BIP 341 and BIP 342 as the Taproot package.'},
    352:{num:'BIP 352',name:'Silent Payments',type:'Standards Track — Applications',
      author:'josibake, Ruben Somsen',year:'2022',
      duration:'Submitted 2022, still in the process of wallet adoption',
      status:'Active',statusCls:'s132-active',
      desc:'Defines a protocol to receive payments to a static address without exposing transaction history. Every payment produces a unique on-chain address that can’t be linked to one another. Already implemented in Cake Wallet and a few other wallets, but not yet universal.'},
  };

  function renderDetail(bipNum){
    const b=BIPS[bipNum]; if(!b) return;
    const el=g('b13-s132-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b13-s132-detail-head">
        <div class="b13-s132-detail-num">${b.num}</div>
        <div class="b13-s132-detail-title">${b.name}</div>
        <span class="b13-s132-bip-status ${b.statusCls}" style="margin-left:auto;flex-shrink:0;">${b.status}</span>
      </div>
      <div class="b13-s132-detail-body">
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Type</div><div class="b13-s132-detail-val">${b.type}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Author</div><div class="b13-s132-detail-val">${b.author}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Submitted</div><div class="b13-s132-detail-val">${b.year}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Timeline</div><div class="b13-s132-detail-val">${b.duration}</div></div>
        <div class="b13-s132-detail-desc">${b.desc}</div>
      </div>`;
  }

  document.querySelectorAll('.b13-s132-bip').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s132-bip').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      renderDetail(parseInt(el.dataset.bip));
    });
  });

  document.querySelectorAll('.b13-s132-type-head').forEach(el=>{
    el.addEventListener('click',()=>{
      const body=el.nextElementSibling;
      if(body) body.classList.toggle('open');
    });
  });

  const t1=g('b13-s132-t1'), t2=g('b13-s132-t2');
  const p1=g('b13-s132-p1'), p2=g('b13-s132-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s132-tab s132-act'; t2.className='b13-s132-tab';
    p1.className='b13-s132-pane show'; p2.className='b13-s132-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s132-tab s132-act'; t1.className='b13-s132-tab';
    p2.className='b13-s132-pane show'; p1.className='b13-s132-pane';
  });

  renderDetail(32);
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.1 SIMULATION (Fork Viz)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   =dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34, RD=6;

  function setupCanvas(id, h){
    const cv=g(id); if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr; cv.height=h*dpr;
    const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,h);
    return {ctx,W,H:h};
  }

  function drawBlock(ctx,x,y,lbl,bg,fg,border,dashed){
    ctx.save();
    if(dashed){ctx.setLineDash([3,2]);ctx.globalAlpha=0.5;}
    ctx.beginPath(); ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg; ctx.fill();
    ctx.strokeStyle=border||'transparent'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha=1;
    ctx.fillStyle=fg; ctx.font='bold 9px monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);
    ctx.restore();
  }

  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED; ctx.font='12px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('→',x,y);
  }

  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col; ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y);
  }

  function cornerX(ctx,x,y){
    const cx=x+BS-5, cy=y+5, s=3.5;
    ctx.save(); ctx.strokeStyle='#A32D2D'; ctx.lineWidth=1.8; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-s,cy-s); ctx.lineTo(cx+s,cy+s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+s,cy-s); ctx.lineTo(cx-s,cy+s); ctx.stroke();
    ctx.restore();
  }

  function cornerCheck(ctx,x,y){
    const cx=x+BS-6, cy=y+6;
    ctx.save(); ctx.strokeStyle='#0F6E56'; ctx.lineWidth=1.8; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(cx-3,cy); ctx.lineTo(cx-1,cy+3); ctx.lineTo(cx+4,cy-3); ctx.stroke();
    ctx.restore();
  }

  function drawHard(){
    const r=setupCanvas('b13-s131-cv-hard',195); if(!r) return;
    const {ctx,W,H}=r;
    const AW=18, GAP=6, STEP=BS+GAP+AW+GAP;
    const SX=14, midY=H/2, topY=28, botY=H-28-BS;

    drawBlock(ctx,SX,midY-BS/2,'100','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
    drawArrow(ctx,SX+BS+AW/2+GAP,midY);
    drawBlock(ctx,SX+STEP,midY-BS/2,'101','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');

    const stemX=SX+STEP+BS+GAP, forkX=stemX+18;
    ctx.save(); ctx.strokeStyle='rgba(124,58,237,0.2)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,midY); ctx.lineTo(forkX,midY);
    ctx.moveTo(forkX,midY); ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,midY); ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke(); ctx.restore();

    const CX=forkX+GAP;
    drawText(ctx,CX,topY-10,'Network A (upgraded nodes)','#534AB7',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Network B (old nodes)','#854F0B',9,true,'left');

    ['102*','103*','104*'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP-GAP,topY+BS/2,'← longest in A','#534AB7',9,false,'left');

    ['102','103','104'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,botY+BS/2,'rgba(133,79,11,0.4)');
      drawBlock(ctx,bx,botY,lbl,'#FAEEDA','#854F0B','rgba(133,79,11,0.3)');
    });
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← longest in B','#854F0B',9,false,'left');

    drawText(ctx,forkX,midY+10,'fork','#A32D2D',8,false,'center');
    const midCX=CX+STEP;
    drawText(ctx,midCX+BS/2,midY,'separate networks','#A32D2D',8,false,'center');
  }

  function drawSoft(){
    const r=setupCanvas('b13-s131-cv-soft',200); if(!r) return;
    const {ctx,W,H}=r;
    const AW=18, GAP=6, STEP=BS+GAP+AW+GAP;
    const SX=14, topY=28, botY=H-38-BS;
    const sharedCY=(topY+BS/2+botY+BS/2)/2;

    drawBlock(ctx,SX,sharedCY-BS/2,'100','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
    drawArrow(ctx,SX+BS+AW/2+GAP,sharedCY);
    drawBlock(ctx,SX+STEP,sharedCY-BS/2,'101','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');

    const stemX=SX+STEP+BS+GAP, forkX=stemX+18;
    ctx.save(); ctx.strokeStyle='rgba(124,58,237,0.2)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,sharedCY); ctx.lineTo(forkX,sharedCY);
    ctx.moveTo(forkX,sharedCY); ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,sharedCY); ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke(); ctx.restore();

    const CX=forkX+GAP;
    drawText(ctx,CX,topY-10,'Majority — upgraded nodes (large hash rate)','#0F6E56',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Minority — not upgraded (small hash rate)','#854F0B',9,true,'left');

    ['102†','103†','104†','105†'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(15,110,86,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
      cornerCheck(ctx,bx,topY);
    });
    drawText(ctx,CX+4*STEP-GAP,topY+BS/2,'← longest ✓','#0F6E56',9,true,'left');

    drawBlock(ctx,CX,botY,'102†','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
    cornerCheck(ctx,CX,botY);
    drawArrow(ctx,CX+BS+AW/2+GAP,botY+BS/2,'rgba(133,79,11,0.4)');
    drawBlock(ctx,CX+STEP,botY,'103x','#FCEBEB','#791F1F','rgba(163,45,45,0.3)');
    cornerX(ctx,CX+STEP,botY);
    drawArrow(ctx,CX+2*STEP-AW/2-GAP+AW,botY+BS/2,'rgba(163,45,45,0.3)');
    drawBlock(ctx,CX+2*STEP,botY,'104?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← shorter, abandoned','#A32D2D',9,false,'left');

    drawText(ctx,forkX,sharedCY+12,'soft fork active','#52524C',8,false,'center');
  }

  function drawAll(){ drawHard(); drawSoft(); }
  drawAll();

  const t1=g('b13-s131-t1'), t2=g('b13-s131-t2');
  const p1=g('b13-s131-p1'), p2=g('b13-s131-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s131-tab s131-act'; t2.className='b13-s131-tab';
    p1.className='b13-s131-pane show'; p2.className='b13-s131-pane';
    requestAnimationFrame(drawHard);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s131-tab s131-act'; t1.className='b13-s131-tab';
    p2.className='b13-s131-pane show'; p1.className='b13-s131-pane';
    requestAnimationFrame(drawSoft);
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawAll)).observe(g('b13-s131-cv-hard')||document.body);
  }
})();

// ============================================================
// PAGE 17 · BAB 14 · NAVIGATION
// ============================================================
function showSectionInContentB14(sectionId, sbId) {
  document.querySelectorAll('#page-bab14 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab14 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab14-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 17 · BAB 14 · TOPBAR
// ============================================================
document.getElementById('back-home-b14').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b14').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 17 · BAB 14 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab14').addEventListener('click', () => navigate('page-bab14'));

// ============================================================
// PAGE 17 · BAB 14 · SIDEBAR EVENTS (14.1 - 14.6)
// ============================================================
document.getElementById('sb-14-1').addEventListener('click', () => showSectionInContentB14('section-14-1', 'sb-14-1'));
document.getElementById('sb-14-2').addEventListener('click', () => showSectionInContentB14('section-14-2', 'sb-14-2'));
document.getElementById('sb-14-3').addEventListener('click', () => showSectionInContentB14('section-14-3', 'sb-14-3'));
document.getElementById('sb-14-4').addEventListener('click', () => showSectionInContentB14('section-14-4', 'sb-14-4'));
document.getElementById('sb-14-5').addEventListener('click', () => showSectionInContentB14('section-14-5', 'sb-14-5'));
document.getElementById('sb-14-6').addEventListener('click', () => showSectionInContentB14('section-14-6', 'sb-14-6'));

// ============================================================
// PAGE 17 · BAB 14 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab14 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB14(target, sb);
  });
});

// ============================================================
// PAGE 17 · BAB 14 · 14.6 SIMULATION (Battle-tested)
// ============================================================
(function() {
  const rows=[
    {row:'b14-s146-r1', detail:'b14-s146-d1'},
    {row:'b14-s146-r2', detail:'b14-s146-d2'},
    {row:'b14-s146-r3', detail:'b14-s146-d3'},
    {row:'b14-s146-r4', detail:'b14-s146-d4'},
    {row:'b14-s146-r5', detail:'b14-s146-d5'},
  ];
  rows.forEach(({row,detail})=>{
    const rowEl=document.getElementById(row);
    const detailEl=document.getElementById(detail);
    if(!rowEl||!detailEl) return;
    rowEl.addEventListener('click',()=>{
      const isOpen=detailEl.classList.contains('open');
      rows.forEach(({detail:d})=>{
        const el=document.getElementById(d);
        if(el) el.classList.remove('open');
      });
      if(!isOpen) detailEl.classList.add('open');
    });
  });
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.5 SIMULATION (Eclipse Attack)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const TEXT=dark?'#E0DED8':'#1A1A18';
  const MUTED=dark?'#6A6A62':'#52524C';

  function drawNode(ctx,x,y,r,bg,border,label,sub){
    ctx.save();
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border;ctx.lineWidth=2;ctx.stroke();
    if(label){ctx.fillStyle=TEXT;ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,y);}
    if(sub){ctx.fillStyle=MUTED;ctx.font='7px Sora,sans-serif';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(sub,x,y+r+3);}
    ctx.restore();
  }
  function drawLine(ctx,x1,y1,x2,y2,col){
    ctx.save();ctx.strokeStyle=col;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
  }
  function drawText(ctx,x,y,t,col,sz,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${sz}px 'Sora',sans-serif`;
    ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.fillText(t,x,y);
  }

  function draw(){
    const cv=g('b14-s145-cv');if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=250;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);

    const NR=13,TR=17;
    const half=W/2-6;
    const lx=half/2,rx=half+6+half/2,cy=H/2;

    // Labels
    drawText(ctx,lx,18,'Normal Node','#0F6E56',10,true,'center');
    drawText(ctx,rx,18,'Eclipsed Node','#A32D2D',10,true,'center');

    // Divider
    ctx.save();ctx.strokeStyle='rgba(124,58,237,0.1)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(half+6,22);ctx.lineTo(half+6,H-8);ctx.stroke();ctx.setLineDash([]);ctx.restore();

    // LEFT: normal peers
    const lPeers=[{a:-85,d:68},{a:-30,d:68},{a:30,d:68},{a:90,d:68},{a:150,d:68},{a:210,d:68}];
    lPeers.forEach(({a,d})=>{
      const rad=a*Math.PI/180,px=lx+Math.cos(rad)*d,py=cy+Math.sin(rad)*d;
      drawLine(ctx,lx,cy,px,py,'rgba(83,74,183,0.22)');
      drawNode(ctx,px,py,NR,'#EEEDFE','rgba(83,74,183,0.4)','peer','');
    });
    drawNode(ctx,lx,cy,TR,'#EAF3DE','#0F6E56','node','(you)');
    drawText(ctx,lx,H-16,'Information from various sources','#0F6E56',8,false,'center');

    // RIGHT: eclipsed node
    const rPeers=[{a:-85,d:68},{a:-30,d:68},{a:30,d:68},{a:90,d:68},{a:150,d:68},{a:210,d:68}];
    rPeers.forEach(({a,d})=>{
      const rad=a*Math.PI/180,px=rx+Math.cos(rad)*d,py=cy+Math.sin(rad)*d;
      drawLine(ctx,rx,cy,px,py,'rgba(163,45,45,0.3)');
      drawNode(ctx,px,py,NR,'#FCEBEB','rgba(163,45,45,0.5)','atk','attacker');
    });
    drawNode(ctx,rx,cy,TR,'#FCEBEB','#A32D2D','node','isolated!');

    // Isolation ring
    ctx.save();ctx.strokeStyle='rgba(163,45,45,0.25)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.arc(rx,cy,84,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();

    // X marks
    [[rx+84,cy-28],[rx+80,cy+38]].forEach(([cx2,cy2])=>{
      ctx.save();ctx.strokeStyle='rgba(163,45,45,0.5)';ctx.lineWidth=1.8;ctx.lineCap='round';
      const s=5;
      ctx.beginPath();ctx.moveTo(cx2-s,cy2-s);ctx.lineTo(cx2+s,cy2+s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx2+s,cy2-s);ctx.lineTo(cx2-s,cy2+s);ctx.stroke();
      ctx.restore();
    });
    drawText(ctx,rx,H-16,'Only receives info from the attacker','#A32D2D',8,false,'center');
  }

  const t1=g('b14-s145-t1'),t2=g('b14-s145-t2');
  const p1=g('b14-s145-p1'),p2=g('b14-s145-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s145-tab s145-act';t2.className='b14-s145-tab';
    p1.className='b14-s145-pane show';p2.className='b14-s145-pane';
    requestAnimationFrame(draw);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s145-tab s145-act';t1.className='b14-s145-tab';
    p2.className='b14-s145-pane show';p1.className='b14-s145-pane';
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(draw)).observe(g('b14-s145-cv')||document.body);
  }
  draw();
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.4 SIMULATION (Selfish Mining)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34,RD=6;
  let curStep=0;

  function drawBlock(ctx,x,y,lbl,bg,fg,border,dashed){
    ctx.save();
    if(dashed){ctx.setLineDash([3,2]);ctx.globalAlpha=0.6;}
    ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.setLineDash([]);ctx.globalAlpha=1;
    ctx.fillStyle=fg;ctx.font='bold 9px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='12px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }
  function setupCanvas(){
    const cv=g('b14-s144-cv');if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=220;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);
    return {ctx,W,H};
  }

  const STEPS=[
    {note:'Initial state: all miners mine on the same chain honestly.',noteClass:'s144-idle',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Mining on block #100 openly'},{cls:'s144-selfish',label:'Dishonest miner',val:'Also mining on block #100 normally'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#98','#99','#100'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-14,'All nodes mine on the same chain','#0F6E56',9,true,'left');
       drawText(ctx,14,H-16,'Honest and dishonest miners both mine block #101','#52524C',9,false,'left');
     }},
    {note:'The dishonest miner finds block #101 first — but does NOT broadcast it to the network!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Still mining block #101\nDoesn’t know block #101 has been found'},{cls:'s144-selfish',label:'Dishonest miner',val:'Already has block #101 hidden\nImmediately mining block #102 on top of it'}],
     draw(ctx,W,H){
       const pubY=H*0.3,hidY=H*0.7;
       drawText(ctx,14,pubY-16,'Honest network — doesn’t know #101 has been found','#0F6E56',9,true,'left');
       ['#99','#100'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<1) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawBlock(ctx,14+2*52,pubY-BS/2,'#101?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       drawArrow(ctx,14+2*52-9,pubY,'rgba(160,160,152,0.4)');
       drawText(ctx,14+2*52+BS+4,pubY,'still mining...','#52524C',9,false,'left');
       drawText(ctx,14,hidY-16,'Dishonest miner — hidden chain','#A32D2D',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,hidY);});
       drawText(ctx,14+2*52+BS+4,hidY+BS/2,'hidden (eye crossed out)','#A32D2D',9,false,'left');
     }},
    {note:'The dishonest miner has found #102. Two blocks ahead behind the scenes!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Just found block #101\nAnnouncing to the network'},{cls:'s144-selfish',label:'Dishonest miner',val:'Already has #101 and #102 hidden\nTwo blocks ahead behind the scenes'}],
     draw(ctx,W,H){
       const pubY=H*0.28,hidY=H*0.72;
       drawText(ctx,14,pubY-16,'Honest network — just found #101','#0F6E56',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawText(ctx,14,hidY-16,'Dishonest miner — already 2 blocks ahead','#A32D2D',9,true,'left');
       ['#99','#100','#101','#102'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<3) drawArrow(ctx,14+i*52+BS+9,hidY);});
     }},
    {note:'The dishonest miner releases the hidden chain! The honest block #101 becomes an orphan.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Honest miners — lose',val:'Block #101 becomes an orphan\nLoses the reward already earned'},{cls:'s144-selfish',label:'Dishonest miner — wins',val:'Chain released — 2 blocks longer\nThe network follows the longest chain'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D'),i<2?'#534AB7':(i===2?'#A32D2D':'#fff'),i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D'));
         if(i<3) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'The dishonest miner’s chain is released — longer, the network follows','#A32D2D',9,true,'left');
       const ox=14+2*52,oy=y+BS+26;
       drawBlock(ctx,ox,oy,'#101','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,2]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
       drawText(ctx,ox+BS+4,oy+BS/2,'orphan — reward lost','#A32D2D',9,false,'left');
     }},
    {note:'Result: the dishonest miner gets the reward of 2 blocks, the honest miner loses 1. But this only works in an ideal scenario.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Honest miners — lose',val:'Block #101 becomes an orphan\nLoses the reward'},{cls:'s144-result',label:'Important note',val:'This only works if the dishonest miner has >33% hash rate and can keep block secrecy perfectly'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*','#103'].forEach((l,i)=>{
         const isNew=i===4;
         drawBlock(ctx,14+i*52,y,l,isNew?'#EAF3DE':(i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D')),isNew?'#0F6E56':(i<2?'#534AB7':(i===2?'#A32D2D':'#fff')),isNew?'rgba(15,110,86,0.3)':(i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D')));
         if(i<4) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'The chain continues — the strategy works in this scenario','#1A1A18',9,true,'left');
       const ox=14+2*52,oy=y+BS+26;
       drawBlock(ctx,ox,oy,'#101','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,2]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
       drawText(ctx,ox+BS+4,oy+BS/2,'orphan','#A32D2D',9,false,'left');
     }},
  ];

  function renderStep(i){
    const r=setupCanvas();if(!r) return;
    const {ctx,W,H}=r;
    STEPS[i].draw(ctx,W,H);
    const st=g('b14-s144-status');
    if(st) st.innerHTML=STEPS[i].status.map(s=>`
      <div class="b14-s144-status-card ${s.cls}">
        <div class="b14-s144-status-label">${s.label}</div>
        <div class="b14-s144-status-val">${s.val}</div>
      </div>`).join('');
    const note=g('b14-s144-note');
    if(note){note.textContent=STEPS[i].note;note.className=`b14-s144-note ${STEPS[i].noteClass}`;}
    const ind=g('b14-s144-step-ind');
    if(ind) ind.textContent=`Step ${i} / ${STEPS.length-1}`;
    const btn=g('b14-s144-next');
    if(btn) btn.disabled=(i>=STEPS.length-1);
  }

  const nextBtn=g('b14-s144-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{if(curStep<STEPS.length-1){curStep++;renderStep(curStep);}});
  const rstBtn=g('b14-s144-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{curStep=0;renderStep(0);const b=g('b14-s144-next');if(b) b.disabled=false;});

  const t1=g('b14-s144-t1'),t2=g('b14-s144-t2');
  const p1=g('b14-s144-p1'),p2=g('b14-s144-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s144-tab s144-act';t2.className='b14-s144-tab';
    p1.className='b14-s144-pane show';p2.className='b14-s144-pane';
    requestAnimationFrame(()=>renderStep(curStep));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s144-tab s144-act';t1.className='b14-s144-tab';
    p2.className='b14-s144-pane show';p1.className='b14-s144-pane';
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>renderStep(curStep))).observe(g('b14-s144-cv')||document.body);
  }
  renderStep(0);
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.3 SIMULATION (2013 Chain Split)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=32,RD=6;

  function drawBlock(ctx,x,y,lbl,bg,fg,border){
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=fg;ctx.font='bold 8px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='11px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }

  function drawDiagram(){
    const cv=g('b14-s143-cv');if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=230;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);

    const AW=16,GAP=5,STEP=BS+GAP+AW+GAP;
    const SX=12,midY=H/2,topY=36,botY=H-40-BS;

    ['#225428','#225429'].forEach((l,i)=>{
      drawBlock(ctx,SX+i*STEP,midY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
      if(i<1) drawArrow(ctx,SX+i*STEP+BS+AW/2+GAP,midY);
    });

    const stemX=SX+STEP+BS+GAP,forkX=stemX+16;
    ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,midY);ctx.lineTo(forkX,midY);
    ctx.moveTo(forkX,midY);ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,midY);ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke();ctx.restore();

    const CX=forkX+GAP;

    drawText(ctx,CX,topY-13,'Bitcoin 0.8 (LevelDB) — ~60% hash rate, briefly longer','#534AB7',9,true,'left');
    ['#225430','#225431','#225432'].forEach((l,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,l,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP+2,topY+BS/2,'... (24 blocks)','#A32D2D',9,false,'left');

    drawText(ctx,CX,botY+BS+12,'Bitcoin 0.7 (BerkeleyDB) — ~40% hash rate, wins after pool downgrade','#854F0B',9,true,'left');
    ['#225430b','#225431b'].forEach((l,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,botY+BS/2,'rgba(133,79,11,0.4)');
      drawBlock(ctx,bx,botY,l,'#FAEEDA','#854F0B','rgba(133,79,11,0.3)');
    });

    const mx=CX+STEP;
    ctx.save();ctx.strokeStyle='#0F6E56';ctx.lineWidth=1.5;ctx.setLineDash([3,2]);
    ctx.beginPath();ctx.moveTo(mx+BS/2,topY+BS);ctx.lineTo(mx+BS/2,botY);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
    drawText(ctx,mx+BS+4,(topY+BS+botY)/2,'BTCGuild + Slush downgrade','#0F6E56',9,true,'left');

    const wx=CX+2*STEP;
    drawArrow(ctx,wx-AW/2-GAP+AW,botY+BS/2,'rgba(15,110,86,0.4)');
    drawBlock(ctx,wx,botY,'#225454','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
    drawText(ctx,wx+BS+4,botY+BS/2,'chain 0.7 wins at #225,454 ✓','#0F6E56',9,true,'left');

    drawText(ctx,forkX,midY+12,'split','#A32D2D',8,false,'center');
  }

  const tabs=['b14-s143-t1','b14-s143-t2','b14-s143-t3'];
  const panes=['b14-s143-p1','b14-s143-p2','b14-s143-p3'];
  tabs.forEach((id,i)=>{
    const el=g(id); if(!el) return;
    el.addEventListener('click',()=>{
      tabs.forEach((t,j)=>{const e=g(t);if(e) e.className='b14-s143-tab'+(i===j?' s143-act':'');});
      panes.forEach((p,j)=>{const e=g(p);if(e) e.className='b14-s143-pane'+(i===j?' show':'');});
      if(i===0) requestAnimationFrame(drawDiagram);
    });
  });

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawDiagram)).observe(g('b14-s143-cv')||document.body);
  }
  drawDiagram();
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.2 SIMULATION (Reorg)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34,RD=6;
  let curStep=0;

  function drawBlock(ctx,x,y,lbl,bg,fg,border){
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=fg;ctx.font='bold 9px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='12px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }
  function setupCanvas(id,h){
    const cv=g(id);if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr;cv.height=h*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,h);
    return {ctx,W,H:h};
  }

  const STEPS=[
    {note:'Initial state: the network runs normally. All nodes agree on the same chain.',noteClass:'s142-idle',
     status:[{cls:'s142-main',label:'Main chain',val:'#100 → #101 → #102\nAll nodes follow this chain'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'All nodes agree — one chain','#0F6E56',9,true,'left');
     }},
    {note:'Two miners find block #103 almost simultaneously! The network is temporarily split in two.',noteClass:'s142-info',
     status:[
       {cls:'s142-alt',label:'Chain A (Miner A)',val:'... → #102 → #103A\nSome nodes follow this'},
       {cls:'s142-alt',label:'Chain B (Miner B)',val:'... → #102 → #103B\nSome nodes follow this'},
     ],
     draw(ctx,W,H){
       const sharedY=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,sharedY,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,sharedY+BS/2);
       });
       const fx=20+2*52+BS+10,fy=sharedY+BS/2;
       ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
       ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+16,fy);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.26);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.74);
       ctx.stroke();ctx.restore();
       drawBlock(ctx,fx+18,H*0.26-BS/2,'#103A','#534AB7','#fff','#534AB7');
       drawText(ctx,fx+22+BS,H*0.26,'Miner A','#534AB7',9,true,'left');
       drawBlock(ctx,fx+18,H*0.74-BS/2,'#103B','#0F6E56','#fff','#0F6E56');
       drawText(ctx,fx+22+BS,H*0.74,'Miner B','#0F6E56',9,true,'left');
     }},
    {note:'Miner A finds block #104 faster. Chain A is now longer!',noteClass:'s142-info',
     status:[
       {cls:'s142-main',label:'Chain A — longest',val:'#102 → #103A → #104A\nLength: 2 blocks after the fork'},
       {cls:'s142-orphan',label:'Chain B — shorter',val:'#102 → #103B\nLength: 1 block after the fork'},
     ],
     draw(ctx,W,H){
       const sharedY=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,sharedY,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,sharedY+BS/2);
       });
       const fx=20+2*52+BS+10,fy=sharedY+BS/2;
       ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
       ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+16,fy);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.28);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.72);
       ctx.stroke();ctx.restore();
       drawBlock(ctx,fx+18,H*0.28-BS/2,'#103A','#534AB7','#fff','#534AB7');
       drawArrow(ctx,fx+18+BS+9,H*0.28,'rgba(83,74,183,0.5)');
       drawBlock(ctx,fx+18+52,H*0.28-BS/2,'#104A','#534AB7','#fff','#534AB7');
       drawText(ctx,fx+18,H*0.28-BS/2-13,'← LONGER','#0F6E56',9,true,'left');
       drawBlock(ctx,fx+18,H*0.72-BS/2,'#103B','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
       drawText(ctx,fx+22+BS,H*0.72+BS/2+2,'shorter','#A32D2D',9,false,'left');
     }},
    {note:'Reorg! Nodes following Chain B switch to Chain A. Block #103B becomes an orphan.',noteClass:'s142-warn',
     status:[
       {cls:'s142-main',label:'Main chain (after reorg)',val:'#100 → #101 → #102 → #103A → #104A\nAll nodes agree again'},
       {cls:'s142-orphan',label:'Orphan block',val:'#103B discarded\nIts transactions return to the mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,i<3?'#EEEDFE':'#534AB7',i<3?'#534AB7':'#fff',i<3?'rgba(83,74,183,0.3)':'#534AB7');
         if(i<4) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Single chain — all nodes agree','#0F6E56',9,true,'left');
       const ox=20+3*52,oy=y+BS+24;
       drawBlock(ctx,ox,oy,'#103B','#FCEBEB','#A32D2D','rgba(163,45,45,0.3)');
       drawText(ctx,ox+BS+6,oy+BS/2,'orphan — discarded','#A32D2D',9,false,'left');
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
     }},
    {note:'Done. A 1-block reorg is a normal event. Miner B loses the reward but the network stays safe.',noteClass:'s142-good',
     status:[
       {cls:'s142-main',label:'Chain continues normally',val:'Block #105 found on top of #104A\nReorg done, the network is safe'},
       {cls:'s142-orphan',label:'Consequence for miner B',val:'Loses the reward of block #103B\nIts transactions return to the mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A','#105'].forEach((l,i)=>{
         const isNew=i===5;
         drawBlock(ctx,20+i*52,y,l,isNew?'#EAF3DE':(i<3?'#EEEDFE':'#534AB7'),isNew?'#0F6E56':(i<3?'#534AB7':'#fff'),isNew?'rgba(15,110,86,0.3)':(i<3?'rgba(83,74,183,0.3)':'#534AB7'));
         if(i<5) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Network continues — reorg complete','#0F6E56',9,true,'left');
     }},
  ];

  function renderStep(i){
    const r=setupCanvas('b14-s142-cv',220);if(!r) return;
    const {ctx,W,H}=r;
    STEPS[i].draw(ctx,W,H);
    const st=g('b14-s142-status');
    if(st) st.innerHTML=STEPS[i].status.map(s=>`
      <div class="b14-s142-status-card ${s.cls}">
        <div class="b14-s142-status-label">${s.label}</div>
        <div class="b14-s142-status-val">${s.val}</div>
      </div>`).join('');
    const note=g('b14-s142-note');
    if(note){note.textContent=STEPS[i].note;note.className=`b14-s142-note ${STEPS[i].noteClass}`;}
    const ind=g('b14-s142-step-ind');
    if(ind) ind.textContent=`Step ${i} / ${STEPS.length-1}`;
    const btn=g('b14-s142-next');
    if(btn) btn.disabled=(i>=STEPS.length-1);
  }

  const nextBtn=g('b14-s142-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{if(curStep<STEPS.length-1){curStep++;renderStep(curStep);}});
  const rstBtn=g('b14-s142-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{curStep=0;renderStep(0);const b=g('b14-s142-next');if(b) b.disabled=false;});

  const t1=g('b14-s142-t1'),t2=g('b14-s142-t2');
  const p1=g('b14-s142-p1'),p2=g('b14-s142-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s142-tab s142-act';t2.className='b14-s142-tab';
    p1.className='b14-s142-pane show';p2.className='b14-s142-pane';
    requestAnimationFrame(()=>renderStep(curStep));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s142-tab s142-act';t1.className='b14-s142-tab';
    p2.className='b14-s142-pane show';p1.className='b14-s142-pane';
  });

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>renderStep(curStep))).observe(g('b14-s142-cv')||document.body);
  }
  renderStep(0);
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.1 SIMULATION (Integer Overflow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  const STEPS=[
    {icon:'✓',cls:'s141-normal',
     title:'Normal value: 50 BTC (block reward)',
     val:'5,000,000,000 satoshi = 50 BTC',
     desc:'A valid value. Far below MAX_MONEY. If the code checks MAX_MONEY, this value passes correctly.',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'⚠️',cls:'s141-bad',
     title:'Bug: the code does NOT check MAX_MONEY before adding up the outputs',
     val:'// The missing line: if (nValue > MAX_MONEY) return false;',
     desc:'This is the core of the bug. The code adds up the output values directly without first checking whether each output exceeds MAX_MONEY (21 million BTC).',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'The attacker creates two outputs that far exceed MAX_MONEY',
     val:'Output A: 92,233,720,368 BTC  |  Output B: 92,233,720,369 BTC',
     desc:'Each far exceeds MAX_MONEY of 21 million BTC. But because there’s no check, the code proceeds to the addition.',
     bits:'0111111111111111111111111111111111111111111111111111111111111110',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'Adding the two outputs exceeds MAX_INT64 — overflow!',
     val:'The total output exceeds the 64-bit integer limit, the sign bit becomes 1',
     desc:'When added, the total exceeds MAX_INT64. The number wraps into a large negative number.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'💥',cls:'s141-result',
     title:'The node thinks the total output is NEGATIVE — smaller than the input!',
     val:'Validation: total output <= total input? Met because the output became negative.',
     desc:'Because the overflow made the total output negative, validation passes. The transaction is confirmed in block #74,638.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'✓',cls:'s141-fix',
     title:'Satoshi’s patch: check MAX_MONEY before adding up',
     val:'if (nValue < 0 || nValue > MAX_MONEY) return false;',
     desc:'In 5 hours Satoshi released a patch. Block #74,638 was rolled back. The bitcoin that appeared to be created never really existed. This is an implementation bug, not a protocol bug.',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
  ];

  function renderBits(bitstr, overflow){
    const el=g('b14-s141-bits'); if(!el) return;
    el.innerHTML='';
    for(let i=0;i<64;i++){
      const b=document.createElement('div');
      const isOne=bitstr[i]==='1';
      b.className='b14-s141-bit '+(overflow&&i===0?'s141-overflow':(isOne?'s141-one':'s141-zero'));
      b.textContent=bitstr[i];
      el.appendChild(b);
    }
  }

  function renderVal(neg, val){
    const el=g('b14-s141-bits-val'); if(!el) return;
    el.textContent=val;
    el.style.color=neg?'#A32D2D':'#1A1A18';
  }

  function addStep(d){
    const el=g('b14-s141-steps'); if(!el) return;
    const div=document.createElement('div');
    div.className=`b14-s141-step ${d.cls}`;
    div.innerHTML=`
      <div class="b14-s141-step-icon">${d.icon}</div>
      <div class="b14-s141-step-content">
        <div class="b14-s141-step-title">${d.title}</div>
        <div class="b14-s141-step-val">${d.val}</div>
        <div class="b14-s141-step-desc">${d.desc}</div>
      </div>`;
    div.style.opacity='0'; div.style.transform='translateY(6px)';
    el.appendChild(div);
    requestAnimationFrame(()=>{
      div.style.transition='all 0.35s';
      div.style.opacity='1'; div.style.transform='translateY(0)';
    });
  }

  async function run(){
    running=true;
    const rb=g('b14-s141-run'); if(rb) rb.disabled=true;
    const note=g('b14-s141-note');
    for(let i=0;i<STEPS.length;i++){
      const d=STEPS[i];
      renderBits(d.bits,d.overflow);
      renderVal(d.neg,d.val);
      addStep(d);
      if(note){note.textContent=d.title;note.className='b14-s141-note s141-done';}
      await wait(i<2?900:700);
    }
    if(note){note.textContent='Important note: the bitcoin that appeared to be created never really existed because it was immediately rolled back. This is an implementation bug, not a protocol bug. The 21 million BTC supply was never truly threatened.';note.className='b14-s141-note s141-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  function reset(){
    if(running) return;
    renderBits('0'.repeat(64),false);
    renderVal(false,'Value: 0 satoshi');
    const el=g('b14-s141-steps'); if(el) el.innerHTML='';
    const rb=g('b14-s141-run'); if(rb) rb.disabled=false;
    const note=g('b14-s141-note');
    if(note){note.textContent='Click "Simulate the Bug" to see how a value exceeding MAX_MONEY passes validation because the code doesn’t check it.';note.className='b14-s141-note s141-idle';}
  }

  renderBits('0'.repeat(64),false);
  renderVal(false,'Value: 0 satoshi');
  const runBtn=g('b14-s141-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) run();});
  const rstBtn=g('b14-s141-rst'); if(rstBtn) rstBtn.addEventListener('click',reset);
})();

// ============================================================
// PAGE 18 · BAB 15 · NAVIGATION
// ============================================================
function showSectionInContentB15(sectionId, sbId) {
  document.querySelectorAll('#page-bab15 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab15 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab15-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 18 · BAB 15 · TOPBAR
// ============================================================
document.getElementById('back-home-b15').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b15').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 18 · BAB 15 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab15').addEventListener('click', () => navigate('page-bab15'));

// ============================================================
// PAGE 18 · BAB 15 · SIDEBAR EVENTS (15.1 - 15.6)
// ============================================================
document.getElementById('sb-15-1').addEventListener('click', () => showSectionInContentB15('section-15-1', 'sb-15-1'));
document.getElementById('sb-15-2').addEventListener('click', () => showSectionInContentB15('section-15-2', 'sb-15-2'));
document.getElementById('sb-15-3').addEventListener('click', () => showSectionInContentB15('section-15-3', 'sb-15-3'));
document.getElementById('sb-15-4').addEventListener('click', () => showSectionInContentB15('section-15-4', 'sb-15-4'));
document.getElementById('sb-15-5').addEventListener('click', () => showSectionInContentB15('section-15-5', 'sb-15-5'));
document.getElementById('sb-15-6').addEventListener('click', () => showSectionInContentB15('section-15-6', 'sb-15-6'));

// ============================================================
// PAGE 18 · BAB 15 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab15 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB15(target, sb);
  });
});

// ============================================================
// PAGE 18 · BAB 15 · 15.6 SIMULATION (Use Case Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    dms:{
      icon:'🔐',title:"Dead Man's Switch",
      sub:'A digital inheritance that can’t be blocked by a bank, a government, or anyone',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      plain:'You have a main key to access the funds anytime. But if you don’t "check in" (move the funds) for 1 year, the backup key held by your heir can automatically claim the funds. No notary needed. No court needed. Mathematics enforces it.',
      components:[['s156-csv','CSV (relative timelock)'],['s156-multisig','2-key setup']],
      flow:[
        {cls:'s156-green', who:'Main key (you)',cond:'Can move the funds ANYTIME. Each move resets the CSV clock.'},
        {cls:'s156-amber', who:'CSV clock',cond:'Starts running since the UTXO was last confirmed. Target: 52,560 blocks (~1 year).'},
        {cls:'s156-purple',who:'Backup key',cond:'Can claim AFTER 52,560 blocks with no activity from the main key.'},
      ],
      limit:'The owner must periodically refresh the UTXO before 1 year runs out. If they forget, the heir can claim earlier than intended. The solution: set an annual reminder.',
    },
    vault:{
      icon:'🏦',title:'Vault with Cooldown',
      sub:'An extra security layer: funds can’t be moved immediately even if the private key is stolen',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      plain:'Before funds from the vault can be moved, you must first create an "unvault transaction" that’s locked for 144 blocks (~1 day). During those 144 blocks, you can still cancel with an emergency key. If a hacker steals the key and tries to drain the vault, you have 1 day to notice and cancel.',
      components:[['s156-csv','CSV 144 blocks (cooldown)'],['s156-cltv','CLTV (emergency cancel)']],
      flow:[
        {cls:'s156-purple',who:'Step 1',cond:'Create the "unvault transaction" — announcing the intent to withdraw funds.'},
        {cls:'s156-amber', who:'Waiting',cond:'The 144-block CSV window runs. The funds can’t be moved yet.'},
        {cls:'s156-green', who:'Step 2A',cond:'After 144 blocks, the funds can be moved to the destination.'},
        {cls:'s156-red',   who:'Step 2B (cancel)',cond:'Anytime within 144 blocks, the emergency key cancels and returns the funds to cold storage.'},
      ],
      limit:'A vault requires two on-chain transactions for each withdrawal (unvault + spend), so the cost is higher. But for large funds, this is a worthwhile tradeoff.',
    },
    escrow:{
      icon:'🤝',title:'Trustless Escrow',
      sub:'A payment guaranteed by mathematics — without needing to trust an arbiter, a platform, or anyone',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      plain:'The buyer locks funds in a 2-of-3 multisig between the buyer, seller, and arbiter. If everything goes smoothly, the buyer and seller release the funds together. If there’s no activity within 30 days, the funds can automatically be claimed by the seller. If there’s a dispute, the arbiter helps determine the winner.',
      components:[['s156-nlocktime','nLockTime (time limit)'],['s156-multisig','2-of-3 multisig'],['s156-cltv','CLTV (auto-release 30 days)']],
      flow:[
        {cls:'s156-green', who:'Scenario A',cond:'Buyer + seller agree → funds released immediately (without the arbiter).'},
        {cls:'s156-amber', who:'Scenario B',cond:'There’s a dispute → the arbiter helps → funds released to the winner (2-of-3).'},
        {cls:'s156-purple',who:'Scenario C',cond:'No activity for 30 days → the seller claims automatically with CLTV.'},
        {cls:'s156-red',   who:'Scenario D',cond:'The buyer wants a refund within 30 days → needs the seller’s or arbiter’s approval.'},
      ],
      limit:'Timelock can’t verify whether the goods have actually been delivered. For that, minimal trust in an arbiter or an off-chain reputation system is still needed.',
    },
    milestone:{
      icon:'📅',title:'Milestone Payment',
      sub:'Pay in stages according to agreed achievements — automatic, can’t be denied',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      plain:'The client and contractor agree: 30% upfront, 40% after milestone 1 (block X), 30% after milestone 2 (block Y). The funds are locked in the script from the start. The contractor can claim each tranche after the target block is reached without needing the client’s approval.',
      components:[['s156-nlocktime','nLockTime (schedule)'],['s156-cltv','CLTV per milestone'],['s156-multisig','Contractor signature']],
      flow:[
        {cls:'s156-green', who:'Tranche 1 (30%)',cond:'Locked upfront. The contractor claims immediately after the contract is on-chain.'},
        {cls:'s156-amber', who:'Tranche 2 (40%)',cond:'Locked with CLTV block X (milestone 1). Automatic claim without client approval.'},
        {cls:'s156-purple',who:'Tranche 3 (30%)',cond:'Locked with CLTV block Y (milestone 2). Automatic claim after the target block.'},
        {cls:'s156-red',   who:'Dispute window',cond:'Before the target block, the client can dispute with the arbiter multisig mechanism.'},
      ],
      limit:'Block-based milestones can’t verify the quality of work — they only verify that the deadline has passed. For milestones based on real outcomes, an oracle or off-chain mechanism is still needed.',
    },
  };

  function render(uc){
    const d=DATA[uc];if(!d) return;
    const el=g('b15-s156-detail');if(!el) return;
    const compHTML=d.components.map(([cls,lbl])=>`<span class="b15-s156-component ${cls}">${lbl}</span>`).join('');
    const flowHTML=d.flow.map(f=>`
      <div class="b15-s156-flow-row ${f.cls}">
        <div class="b15-s156-flow-who">${f.who}</div>
        <div class="b15-s156-flow-cond">${f.cond}</div>
      </div>`).join('');
    el.innerHTML=`
      <div class="b15-s156-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b15-s156-detail-icon">${d.icon}</div>
        <div><div class="b15-s156-detail-title">${d.title}</div><div class="b15-s156-detail-sub">${d.sub}</div></div>
      </div>
      <div class="b15-s156-detail-body">
        <div class="b15-s156-plain">${d.plain}</div>
        <div>
          <div class="b15-s156-components-label">Timelock components used:</div>
          <div class="b15-s156-component-row">${compHTML}</div>
        </div>
        <div>
          <div class="b15-s156-flow-label">Who can do what when:</div>
          <div class="b15-s156-flow-rows">${flowHTML}</div>
        </div>
        <div class="b15-s156-limit"><strong>Limitations:</strong> ${d.limit}</div>
      </div>`;
  }

  document.querySelectorAll('.b15-s156-card').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b15-s156-card').forEach(e=>e.classList.remove('s156-act'));
      el.classList.add('s156-act');
      render(el.dataset.uc);
    });
  });

  render('dms');
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.5 SIMULATION (CSV Lightning)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const HONEST=[
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Active',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice and Bob have an active payment channel',
     desc:'They’ve already transacted many times off-chain. Latest state: Alice has 0.6 BTC, Bob has 0.4 BTC.',
     bar:0,barLabel:'',barDesc:'The CSV window hasn’t started.'},
    {dot:'2',dotBg:'#534AB7',tag:'Force Close',tagBg:'#534AB7',cls:'s155-tx',
     title:'Bob decides to force-close the channel',
     desc:'Bob broadcasts the latest honest commitment transaction to the blockchain. This transaction is confirmed.',
     bar:0,barLabel:'0 / 144 blocks',barDesc:'The CSV window starts running since the commitment transaction was confirmed.'},
    {dot:'3',dotBg:'#854F0B',tag:'CSV Window',tagBg:'#854F0B',cls:'s155-csv',
     title:'Waiting for 144 blocks to pass',
     desc:'Bob’s funds are locked in an output with CSV 144 blocks. During this period, Alice verifies that the broadcast commitment is the latest one. No cheating.',
     bar:65,barLabel:'94 / 144 blocks',barDesc:'Alice verifies the commitment transaction — everything is correct.'},
    {dot:'4',dotBg:'#0F6E56',tag:'Done',tagBg:'#0F6E56',cls:'s155-ok',
     title:'144 blocks pass — Bob can claim his funds',
     desc:'The CSV window ends without incident. Bob claims his 0.4 BTC. Alice already took her share from the start because Alice’s output has no CSV.',
     bar:100,barLabel:'144 / 144 blocks — DONE',barDesc:'The force close completes safely. Both parties get the correct funds.'},
  ];

  const CHEAT=[
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Active',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice and Bob have an active payment channel',
     desc:'Latest state: Alice 0.8 BTC, Bob 0.2 BTC. But there’s an old state: Alice 0.3 BTC, Bob 0.7 BTC.',
     bar:0,barLabel:'',barDesc:''},
    {dot:'2',dotBg:'#A32D2D',tag:'Bob Cheats',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Bob broadcasts an OLD commitment transaction',
     desc:'Bob broadcasts the old commitment where he has 0.7 BTC. He hopes Alice isn’t paying attention.',
     bar:0,barLabel:'0 / 144 blocks',barDesc:'The CSV window starts. Bob must wait 144 blocks before he can claim. This is Alice’s time to act.'},
    {dot:'3',dotBg:'#854F0B',tag:'Alice Vigilant',tagBg:'#854F0B',cls:'s155-csv',
     title:'Alice detects the cheating — the old commitment is detected',
     desc:'Alice’s node monitors the blockchain 24/7. She matches the broadcast commitment with the revocation key she keeps. Caught: this isn’t the latest state!',
     bar:30,barLabel:'43 / 144 blocks',barDesc:'Bob can only claim after 144 blocks. Alice still has 101 blocks to act.'},
    {dot:'4',dotBg:'#A32D2D',tag:'Penalty!',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Alice broadcasts a penalty transaction',
     desc:'Alice uses the revocation key to claim ALL the channel funds — including Bob’s share. This is the punishment for cheating. The penalty transaction is confirmed before the CSV window ends.',
     bar:55,barLabel:'79 / 144 blocks',barDesc:'Alice successfully submits the penalty BEFORE the CSV window ends. Bob loses.'},
    {dot:'5',dotBg:'#534AB7',tag:'Done',tagBg:'#534AB7',cls:'s155-ok',
     title:'Alice gets all the funds — 1 BTC total',
     desc:'Bob loses everything because he tried to cheat. Alice gets the entire 1 BTC in the channel. This is the fairness mechanism that makes the Lightning Network safe without needing to trust anyone.',
     bar:100,barLabel:'Penalty confirmed!',barDesc:'The CSV window hasn’t ended — the penalty succeeds. Bob gets nothing.'},
  ];

  function renderSteps(steps,containerId){
    const el=g(containerId);if(!el) return;
    el.innerHTML='';
    steps.forEach((s,i)=>{
      const step=document.createElement('div');step.className='b15-s155-step';
      const dot=document.createElement('div');dot.className='b15-s155-step-dot';dot.style.background=s.dotBg;dot.textContent=s.dot;
      const card=document.createElement('div');card.className=`b15-s155-step-card ${s.cls}`;card.id=`${containerId}-card-${i}`;
      const tag=document.createElement('div');tag.className='b15-s155-step-tag';tag.style.background=s.tagBg;tag.textContent=s.tag;
      const title=document.createElement('div');title.className='b15-s155-step-title';title.textContent=s.title;
      const desc=document.createElement('div');desc.className='b15-s155-step-desc';desc.textContent=s.desc;
      card.appendChild(tag);card.appendChild(title);card.appendChild(desc);
      step.appendChild(dot);step.appendChild(card);el.appendChild(step);
    });
  }

  function activateStep(steps,containerId,idx){
    steps.forEach((_,i)=>{
      const card=g(`${containerId}-card-${i}`);
      if(card) card.classList.toggle('active',i<=idx);
    });
  }

  // Honest
  let hStep=-1;
  renderSteps(HONEST,'b15-s155-honest-steps');

  function updateH(){
    if(hStep<0) return;
    const s=HONEST[hStep];
    const bar=g('b15-s155-h-bar');const lbl=g('b15-s155-h-bar-label');const desc=g('b15-s155-h-bar-desc');
    if(bar) bar.style.width=s.bar+'%';if(lbl) lbl.textContent=s.barLabel;if(desc) desc.textContent=s.barDesc;
    activateStep(HONEST,'b15-s155-honest-steps',hStep);
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent=`Step ${hStep+1} / ${HONEST.length}`;
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=hStep>=HONEST.length-1;
    const res=g('b15-s155-h-result');
    if(res){
      if(hStep===HONEST.length-1){res.className='b15-s155-result s155-good';res.textContent='The force close completes safely. The CSV window serves as a verification period — not a punishment. Both parties get their respective rights.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const hNext=g('b15-s155-h-next');if(hNext) hNext.addEventListener('click',()=>{if(hStep<HONEST.length-1){hStep++;updateH();}});
  const hRst=g('b15-s155-h-rst');if(hRst) hRst.addEventListener('click',()=>{
    hStep=-1;
    const bar=g('b15-s155-h-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-h-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-h-bar-desc');if(desc) desc.textContent='Starts after the commitment transaction is confirmed.';
    activateStep(HONEST,'b15-s155-honest-steps',-1);
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent='Step 0 / 4';
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-h-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Click "Next Step" to see the honest force close process.';}
  });

  // Cheat
  let cStep=-1;
  renderSteps(CHEAT,'b15-s155-cheat-steps');

  function updateC(){
    if(cStep<0) return;
    const s=CHEAT[cStep];
    const bar=g('b15-s155-c-bar');const lbl=g('b15-s155-c-bar-label');const desc=g('b15-s155-c-bar-desc');
    if(bar) bar.style.width=s.bar+'%';if(lbl) lbl.textContent=s.barLabel;if(desc) desc.textContent=s.barDesc;
    activateStep(CHEAT,'b15-s155-cheat-steps',cStep);
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent=`Step ${cStep+1} / ${CHEAT.length}`;
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=cStep>=CHEAT.length-1;
    const res=g('b15-s155-c-result');
    if(res){
      if(cStep===CHEAT.length-1){res.className='b15-s155-result s155-bad';res.textContent='Bob loses everything. The CSV window is what gives Alice time to detect and punish the cheating. Without CSV, Bob could claim immediately before Alice had a chance to react.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const cNext=g('b15-s155-c-next');if(cNext) cNext.addEventListener('click',()=>{if(cStep<CHEAT.length-1){cStep++;updateC();}});
  const cRst=g('b15-s155-c-rst');if(cRst) cRst.addEventListener('click',()=>{
    cStep=-1;
    const bar=g('b15-s155-c-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-c-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-c-bar-desc');if(desc) desc.textContent='Alice must act before the window runs out.';
    activateStep(CHEAT,'b15-s155-cheat-steps',-1);
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent='Step 0 / 5';
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-c-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Click "Next Step" to see what happens when Bob tries to cheat.';}
  });

  // Tabs
  const t1=g('b15-s155-t1'),t2=g('b15-s155-t2');
  const p1=g('b15-s155-p1'),p2=g('b15-s155-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b15-s155-tab s155-act';t2.className='b15-s155-tab';
    p1.className='b15-s155-pane show';p2.className='b15-s155-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b15-s155-tab s155-act';t1.className='b15-s155-tab';
    p2.className='b15-s155-pane show';p1.className='b15-s155-pane';
  });
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.4 SIMULATION (CLTV Builder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const SCENARIOS={
    simple:{
      claimers:[
        {cls:'s154-alice',name:'Alice',cond:'Can claim AFTER block 950,000 (about 8 months from now) — with her signature.'},
      ],
      timeline:[
        {from:0,to:40,bg:'#FCEBEB',label:'Locked — no one can claim',labelColor:'#A32D2D'},
        {from:40,to:100,bg:'#EAF3DE',label:'Alice can claim',labelColor:'#0F6E56'},
      ],
      lockAt:40,
      script:[
        {cls:'s154-op-time',code:'<950000>',explain:'Push the number 950,000 to the stack. This is the target block height — not before this block.'},
        {cls:'s154-op-cltv',code:'OP_CHECKLOCKTIMEVERIFY',explain:'Check: is the transaction’s nLockTime >= 950,000? If not, the script fails immediately. This is what enforces the timelock.'},
        {cls:'s154-op-flow',code:'OP_DROP',explain:'Discard the number 950,000 from the stack — no longer needed after the check.'},
        {cls:'s154-op-data',code:'OP_DUP',explain:'Duplicate Alice’s public key on the stack.'},
        {cls:'s154-op-data',code:'OP_HASH160',explain:'Hash Alice’s public key.'},
        {cls:'s154-op-data',code:'<PKH_Alice>',explain:'Push the expected hash of Alice’s public key.'},
        {cls:'s154-op-data',code:'OP_EQUALVERIFY',explain:'Ensure the provided key matches the expected one.'},
        {cls:'s154-op-sig', code:'OP_CHECKSIG',explain:'Verify Alice’s signature. If valid, the UTXO can be spent.'},
      ],
      note:'This is the simplest one-way timelock. No one can touch the funds until block 950,000 is reached — including the sender. Suitable for: time deposits, locked savings, or scholarship funds that can’t be used before the semester starts.',
    },
    branch:{
      claimers:[
        {cls:'s154-alice',name:'Alice',cond:'Can claim ANYTIME — with her signature. No time limit.'},
        {cls:'s154-bob',  name:'Bob',  cond:'Can claim AFTER block 966,000 (about 6 months) — if Alice doesn’t show up.'},
      ],
      timeline:[
        {from:0,to:55,bg:'#EAF3DE',label:'Alice can claim',labelColor:'#0F6E56'},
        {from:55,to:100,bg:'#E8E6FD',label:'Alice AND Bob can claim',labelColor:'#534AB7'},
      ],
      lockAt:55,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Branching: if Alice chooses this path, run the first block.'},
        {cls:'s154-op-sig', code:'  <pubkey_Alice>',explain:'(Alice’s path) Verify Alice’s signature. No time condition.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Alice’s path) If Alice’s signature is valid, the script succeeds.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'If not Alice, enter Bob’s path.'},
        {cls:'s154-op-time',code:'  <966000>',explain:'(Bob’s path) Push the target block height for Bob.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Bob’s path) Ensure block 966,000 has passed. If not, the script fails.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Bob’s path) Discard the number from the stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_Bob>',explain:'(Bob’s path) Verify Bob’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Bob’s path) If Bob’s signature is valid and block 966,000 has passed, the script succeeds.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Close the branching.'},
      ],
      note:'A powerful dead man’s switch pattern. Alice has full access anytime. But if Alice is inactive for 6 months, Bob (the heir or backup key) can take over. No notary, no lawyer — mathematics guards it.',
    },
    htlc:{
      claimers:[
        {cls:'s154-alice',name:'Recipient',cond:'Can claim by revealing the hashed secret (preimage). Anytime before the timeout.'},
        {cls:'s154-bob',  name:'Sender',cond:'Can refund AFTER block 920,000 (timeout) — if the recipient doesn’t reveal the secret.'},
      ],
      timeline:[
        {from:0,to:45,bg:'#E8E6FD',label:'Recipient can claim (with the preimage)',labelColor:'#534AB7'},
        {from:45,to:100,bg:'#FAEEDA',label:'Sender can refund',labelColor:'#854F0B'},
      ],
      lockAt:45,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Branching: if the recipient reveals the preimage, this path is taken.'},
        {cls:'s154-op-data',code:'  OP_SHA256',explain:'(Recipient’s path) Hash the value provided by the recipient.'},
        {cls:'s154-op-data',code:'  <payment_hash>',explain:'(Recipient’s path) The agreed hash. If SHA256(preimage) matches, the recipient is proven to know the secret.'},
        {cls:'s154-op-data',code:'  OP_EQUALVERIFY',explain:'(Recipient’s path) Ensure the hash matches.'},
        {cls:'s154-op-sig', code:'  <pubkey_recipient>',explain:'(Recipient’s path) Verify the recipient’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Recipient’s path) If the preimage is correct and the signature is valid, the recipient can claim.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'If the recipient doesn’t reveal the preimage, enter the refund path.'},
        {cls:'s154-op-time',code:'  <920000>',explain:'(Refund path) The timeout block. After this the sender can refund.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Refund path) Ensure block 920,000 has passed. Prevents the sender from refunding too early.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Refund path) Discard the number from the stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_sender>',explain:'(Refund path) Verify the sender’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Refund path) If the timeout is reached and the signature is valid, the sender can refund.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Close the branching.'},
      ],
      note:'A Hash Time Lock Contract (HTLC) — the foundation of every payment on the Lightning Network. The recipient has an incentive to reveal the preimage because it’s the only way to claim the funds. The sender is safe because if it fails, the funds automatically return after the timeout. No third party.',
    },
  };

  function renderTL(sc){
    const track=g('b15-s154-tl-track');if(!track) return;
    track.innerHTML='';
    const data=SCENARIOS[sc];
    data.timeline.forEach(z=>{
      const el=document.createElement('div');
      el.className='b15-s154-tl-zone';
      el.style.left=z.from+'%';el.style.width=(z.to-z.from)+'%';el.style.background=z.bg;
      const lbl=document.createElement('div');
      lbl.className='b15-s154-tl-zone-label';lbl.style.color=z.labelColor;lbl.textContent=z.label;
      el.appendChild(lbl);track.appendChild(el);
    });
    const now=document.createElement('div');now.className='b15-s154-tl-now';now.style.left='10%';
  const nowLbl=document.createElement('div');nowLbl.className='b15-s154-tl-now-label';nowLbl.style.left='12%';nowLbl.textContent='now';
    const lock=document.createElement('div');lock.className='b15-s154-tl-lock';lock.style.left=data.lockAt+'%';
    const lockLbl=document.createElement('div');lockLbl.className='b15-s154-tl-lock-label';lockLbl.style.left=(data.lockAt+1)+'%';lockLbl.textContent='timelock';
    track.appendChild(now);track.appendChild(nowLbl);track.appendChild(lock);track.appendChild(lockLbl);
  }

  function renderClaimers(sc){
    const el=g('b15-s154-claimers');if(!el) return;
    const data=SCENARIOS[sc];
    el.innerHTML=data.claimers.map(c=>`
      <div class="b15-s154-claimer ${c.cls}">
        <div class="b15-s154-claimer-name">${c.name}</div>
        <div class="b15-s154-claimer-cond">${c.cond}</div>
      </div>`).join('');
    el.style.gridTemplateColumns=data.claimers.length===1?'1fr':'1fr 1fr';
  }

  function renderScript(sc){
    const el=g('b15-s154-script-lines');if(!el) return;
    el.innerHTML=SCENARIOS[sc].script.map(l=>`
      <div class="b15-s154-script-line ${l.cls}">
        <div class="b15-s154-script-code">${bsEscHTML(l.code)}</div>
        <div class="b15-s154-script-explain">${l.explain}</div>
      </div>`).join('');
  }

  function render(sc){
    renderTL(sc);renderClaimers(sc);renderScript(sc);
    const note=g('b15-s154-note');if(note) note.textContent=SCENARIOS[sc].note;
  }

  document.querySelectorAll('.b15-s154-scenario-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b15-s154-scenario-btn').forEach(b=>b.classList.remove('s154-act'));
      btn.classList.add('s154-act');
      render(btn.dataset.sc);
    });
  });

  render('simple');
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.3 SIMULATION (nSequence Decoder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let enabled=true, useTime=false, value=144;

  function toHex(n){return '0x'+n.toString(16).toUpperCase().padStart(8,'0');}

  function renderBits(n){
    const bitsEl=g('b15-s153-hex-bits');
    const labelsEl=g('b15-s153-bit-labels');
    if(!bitsEl||!labelsEl) return;
    bitsEl.innerHTML='';labelsEl.innerHTML='';
    for(let i=31;i>=0;i--){
      const bit=(n>>>i)&1;
      const b=document.createElement('div');
      let cls='b15-s153-sbit ';
      if(bit){
        if(i===31) cls+='s153-special';
        else if(i===22) cls+='s153-unit';
        else cls+='s153-b1';
      } else cls+='s153-b0';
      b.className=cls;b.textContent=bit;
      bitsEl.appendChild(b);
      const lbl=document.createElement('div');
      lbl.className='b15-s153-bit-lbl';
      if(i===31) lbl.textContent='on/off';
      else if(i===22) lbl.textContent='unit';
      else if(i===15) lbl.textContent='value';
      labelsEl.appendChild(lbl);
    }
  }

  function calcVal(){
    if(!enabled) return 0xFFFFFFFF;
    let n=0;
    if(useTime) n|=(1<<22);
    n|=(value&0xFFFF);
    return n>>>0;
  }

  function update(){
    const n=calcVal();
    const hv=g('b15-s153-hex-val');if(hv) hv.textContent=toHex(n);
    renderBits(n);
    const mt=g('b15-s153-meaning-text');
    const ms=g('b15-s153-meaning-sub');
    const ml=g('b15-s153-meaning-label');
    const mw=g('b15-s153-meaning');
    const uc=g('b15-s153-usecase');

    if(n===0xFFFFFFFF){
      if(mw) mw.className='b15-s153-meaning s153-maxval';
      if(ml) ml.textContent='Special value: 0xFFFFFFFF';
      if(mt) mt.textContent='Timelock DISABLED — this UTXO can be spent anytime after being confirmed.';
      if(ms) ms.textContent='The value 0xFFFFFFFF is the default value meaning no timelock at all. It also disables nLockTime at the transaction level. Many wallets use this value for ordinary transactions.';
      if(uc) uc.textContent='Used for: ordinary everyday transactions. No time delay, the UTXO can be spent immediately after confirmation.';
      return;
    }
    if(!enabled){
      if(mw) mw.className='b15-s153-meaning s153-disabled';
      if(ml) ml.textContent='Timelock disabled (bit 31 = 1)';
      if(mt) mt.textContent='Relative timelock DISABLED for this input.';
      if(ms) ms.textContent='Bit 31 set to 1 disables the relative timelock. The UTXO can be spent anytime after being confirmed, without additional delay.';
      if(uc) uc.textContent='Used for: transactions that don’t need a relative timelock but need nSequence for another reason.';
      return;
    }
    if(mw) mw.className='b15-s153-meaning s153-active';
    if(ml) ml.textContent='What it means in plain language:';
    if(!useTime){
      const days=Math.round(value*10/1440*10)/10;
      const daysStr=days<1?`${Math.round(value*10)} minutes`:`${days} days`;
      if(mt) mt.textContent=`This UTXO can only be spent after ${value.toLocaleString('en-US')} blocks (about ${daysStr}) from when the transaction is confirmed.`;
      if(ms) ms.textContent=`The clock starts running not from now, but from when the UTXO is confirmed on the blockchain. If the transaction is confirmed on Monday, this UTXO can only be used after ${value} blocks later.`;
      if(uc){
        if(value<=144) uc.textContent='Used for: Lightning Network force close. The ~1-day waiting period gives time to detect cheating and submit a penalty transaction.';
        else if(value<=1008) uc.textContent='Used for: a simple vault, short-term escrow, or a cooldown period before a large transaction is executed.';
        else uc.textContent='Used for: medium-term escrow, contracts with a longer waiting period.';
      }
    } else {
      const secs=value*512;
      const hours=Math.round(secs/3600*10)/10;
      const days=Math.round(secs/86400*10)/10;
      const timeStr=days>=1?`${days} days`:hours>=1?`${hours} hours`:`${secs} seconds`;
      if(mt) mt.textContent=`This UTXO can only be spent after ${value.toLocaleString('en-US')} time units (${timeStr}) from when the transaction is confirmed.`;
      if(ms) ms.textContent='One unit = 512 seconds (~8.5 minutes). Time units are more precise than blocks, but blocks are more commonly used because they’re easier to predict.';
      if(uc) uc.textContent='Used for: scenarios that need higher time precision than the ~10-minute block unit.';
    }
  }

  function setEnabled(val){
    enabled=val;
    const track=g('b15-s153-tog1-track');
    const label=g('b15-s153-tog1-label');
    const state=g('b15-s153-tog1-state');
    const uc2=g('b15-s153-unit-card');
    const vc=g('b15-s153-val-card');
    const ub=g('b15-s153-u-block');
    const ut=g('b15-s153-u-time');
    const sl=g('b15-s153-slider');
    if(val){
      if(track) track.className='b15-s153-toggle-track s153-on';
      if(label) label.textContent='Timelock ACTIVE';
      if(state) state.textContent='(bit 31 = 0)';
      if(uc2) uc2.style.opacity='1';
      if(vc) vc.style.opacity='1';
      if(ub) ub.disabled=false;
      if(ut) ut.disabled=false;
      if(sl) sl.disabled=false;
    } else {
      if(track) track.className='b15-s153-toggle-track s153-warn';
      if(label) label.textContent='Timelock DISABLED';
      if(state) state.textContent='(bit 31 = 1)';
      if(uc2) uc2.style.opacity='0.4';
      if(vc) vc.style.opacity='0.4';
      if(ub) ub.disabled=true;
      if(ut) ut.disabled=true;
      if(sl) sl.disabled=true;
    }
  }

  function setPreset(id){
    ['b15-s153-pr-ln','b15-s153-pr-vault','b15-s153-pr-escrow','b15-s153-pr-off','b15-s153-pr-max'].forEach(p=>{
      const b=g(p);if(b) b.className='b15-s153-preset-btn'+(p===id?' s153-act':'');
    });
  }

  function applySlider(v){
    value=v;
    const sl=g('b15-s153-slider');if(sl){sl.max=Math.max(4032,v);sl.value=v;}
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=v.toLocaleString('en-US')+(useTime?' time units':' blocks');
  }

  const tog1=g('b15-s153-tog1');
  if(tog1) tog1.addEventListener('click',()=>{enabled=!enabled;setEnabled(enabled);update();});

  const ub=g('b15-s153-u-block');
  if(ub) ub.addEventListener('click',()=>{
    useTime=false;
    ub.className='b15-s153-unit-btn s153-act';
    const ut=g('b15-s153-u-time');if(ut) ut.className='b15-s153-unit-btn';
    const sl=g('b15-s153-slider');if(sl){sl.max=4032;sl.value=Math.min(value,4032);}
    value=parseInt(g('b15-s153-slider').value)||144;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' blocks';
    update();
  });
  const ut=g('b15-s153-u-time');
  if(ut) ut.addEventListener('click',()=>{
    useTime=true;
    ut.className='b15-s153-unit-btn s153-act';
    const ub2=g('b15-s153-u-block');if(ub2) ub2.className='b15-s153-unit-btn';
    const sl=g('b15-s153-slider');if(sl){sl.max=1000;sl.value=Math.min(value,1000);}
    value=parseInt(g('b15-s153-slider').value)||144;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' time units';
    update();
  });

  const sl=g('b15-s153-slider');
  if(sl) sl.addEventListener('input',()=>{
    value=parseInt(sl.value)||1;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value.toLocaleString('en-US')+(useTime?' time units':' blocks');
    update();
  });

  // Presets
  const prLn=g('b15-s153-pr-ln');
  if(prLn) prLn.addEventListener('click',()=>{
    setPreset('b15-s153-pr-ln');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(144);update();
  });
  const prVault=g('b15-s153-pr-vault');
  if(prVault) prVault.addEventListener('click',()=>{
    setPreset('b15-s153-pr-vault');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(1008);update();
  });
  const prEscrow=g('b15-s153-pr-escrow');
  if(prEscrow) prEscrow.addEventListener('click',()=>{
    setPreset('b15-s153-pr-escrow');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(4320);update();
  });
  const prOff=g('b15-s153-pr-off');
  if(prOff) prOff.addEventListener('click',()=>{
    setPreset('b15-s153-pr-off');enabled=false;
    setEnabled(false);update();
  });
  const prMax=g('b15-s153-pr-max');
  if(prMax) prMax.addEventListener('click',()=>{
    setPreset('b15-s153-pr-max');enabled=false;value=65535;
    setEnabled(false);
    const hv=g('b15-s153-hex-val');if(hv) hv.textContent='0xFFFFFFFF';
    renderBits(0xFFFFFFFF);
    const mw=g('b15-s153-meaning');const mt=g('b15-s153-meaning-text');
    const ms=g('b15-s153-meaning-sub');const ml=g('b15-s153-meaning-label');
    const uc=g('b15-s153-usecase');
    if(mw) mw.className='b15-s153-meaning s153-maxval';
    if(ml) ml.textContent='Special value: 0xFFFFFFFF';
    if(mt) mt.textContent='Timelock DISABLED — this UTXO can be spent anytime after being confirmed.';
    if(ms) ms.textContent='The value 0xFFFFFFFF also disables nLockTime at the transaction level. Many wallets use this for ordinary transactions.';
    if(uc) uc.textContent='Also used as an opt-in RBF (Replace-By-Fee) signal: the value 0xFFFFFFFD marks a transaction as replaceable with a higher fee before confirmation.';
  });

  update();
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.2 SIMULATION (nLockTime Builder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  let mode='ts';
  let seqActive=true;
  let currentVal=0;
  const NOW=Math.floor(Date.now()/1000);
  const CURRENT_BLOCK=915217;

  function toHexLE(val){
    const buf=new ArrayBuffer(4);
    new DataView(buf).setUint32(0,val>>>0,true);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0').toUpperCase()).join(' ');
  }
  function formatDate(ts){
    return new Date(ts*1000).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'});
  }

  function update(){
    const mt=g('b15-s152-meaning-text');
    const ms=g('b15-s152-meaning-sub');
    const hv=g('b15-s152-hex-val');
    const he=g('b15-s152-hex-explain');
    if(!mt||!ms||!hv||!he) return;

    const val=currentVal;
    const hex=toHexLE(val);
    hv.textContent=hex;

    if(mode==='ts'){
      const date=formatDate(val);
      const diffDays=Math.round((val-NOW)/86400);
      if(!seqActive){
        mt.textContent='nLockTime is ignored — the transaction can be processed anytime.';
        ms.textContent='Because all inputs’ nSequence is set to 0xFFFFFFFF, the network ignores nLockTime entirely. This transaction can be confirmed right now.';
      } else if(diffDays<=0){
        mt.textContent=`The date ${date} has passed — the transaction can be processed now.`;
        ms.textContent='nLockTime has been exceeded. Miners may include this transaction in a block anytime.';
      } else {
        mt.textContent=`This transaction can’t be processed before ${date}.`;
        ms.textContent=`Still ${diffDays} days to go. Even the sender themselves can’t speed this up — the entire Bitcoin network will reject a block that includes this transaction too early.`;
      }
      he.textContent=`Value ${val.toLocaleString('en-US')} (Unix timestamp) → ${hex} in little-endian. Because the value is above 500,000,000, Bitcoin knows this is a timestamp, not a block height.`;
    } else {
      const diff=val-CURRENT_BLOCK;
      const estDays=Math.round(diff*10/1440);
      if(!seqActive){
        mt.textContent='nLockTime is ignored — the transaction can be processed anytime.';
        ms.textContent='Because all inputs’ nSequence is set to 0xFFFFFFFF, the network ignores nLockTime entirely.';
      } else if(diff<=0){
        mt.textContent=`Block #${val.toLocaleString('en-US')} has passed — the transaction can be processed now.`;
        ms.textContent=`The current block is #${CURRENT_BLOCK.toLocaleString('en-US')}. nLockTime has been exceeded.`;
      } else {
        mt.textContent=`This transaction can’t be processed before block #${val.toLocaleString('en-US')}.`;
        ms.textContent=`Still ${diff.toLocaleString('en-US')} blocks to go (about ${estDays} days). The entire Bitcoin network will reject a block that includes this transaction too early.`;
      }
      he.textContent=`Value ${val.toLocaleString('en-US')} (block height) → ${hex} in little-endian. Because the value is below 500,000,000, Bitcoin knows this is a block height, not a timestamp.`;
    }

    const sw=g('b15-s152-seq-wrap');
    const sl=g('b15-s152-seq-label');
    const sd=g('b15-s152-seq-desc');
    const st=g('b15-s152-seq-track');
    const stt=g('b15-s152-seq-ttext');
    if(seqActive){
      if(sw) sw.className='b15-s152-seq-wrap s152-ok';
      if(sl) sl.textContent='nSequence: nLockTime ACTIVE';
      if(sd) sd.textContent='nLockTime will be enforced. The transaction can’t enter a block before the specified time.';
      if(st) st.className='b15-s152-seq-track s152-on';
      if(stt) stt.textContent='input nSequence = 0xFFFFFFFE (nLockTime active)';
    } else {
      if(sw) sw.className='b15-s152-seq-wrap s152-warn';
      if(sl) sl.textContent='nSequence: nLockTime DISABLED';
      if(sd) sd.textContent='Be careful: if all inputs have nSequence = 0xFFFFFFFF, the network will ignore nLockTime entirely. This is a trap that often surprises new developers.';
      if(st) st.className='b15-s152-seq-track';
      if(stt) stt.textContent='input nSequence = 0xFFFFFFFF (nLockTime ignored!)';
    }
  }

  function buildTS(){
    const area=g('b15-s152-input-area'); if(!area) return;
    const def=NOW+30*86400;
    currentVal=def;
    const minTS=NOW;
    const maxTS=NOW+365*5*86400;
    area.innerHTML=`
      <div class="b15-s152-input-label">Choose a date:</div>
      <div class="b15-s152-ts-wrap">
        <input type="range" class="b15-s152-ts-slider" id="b15-s152-ts-slider"
          min="${minTS}" max="${maxTS}" value="${def}" step="86400">
        <div class="b15-s152-ts-labels">
          <span>Now</span><span>+1 year</span><span>+3 years</span><span>+5 years</span>
        </div>
      </div>
      <div class="b15-s152-ts-display" id="b15-s152-ts-display">${formatDate(def)}</div>
      <div class="b15-s152-ts-unix" id="b15-s152-ts-unix">Unix: ${def}</div>`;
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl) sl.addEventListener('input',()=>{
      currentVal=parseInt(sl.value);
      const d=document.getElementById('b15-s152-ts-display');
      const u=document.getElementById('b15-s152-ts-unix');
      if(d) d.textContent=formatDate(currentVal);
      if(u) u.textContent='Unix: '+currentVal;
      update();
    });
    update();
  }

  function buildBH(){
    const area=g('b15-s152-input-area'); if(!area) return;
    const def=CURRENT_BLOCK+1000;
    currentVal=def;
    area.innerHTML=`
      <div class="b15-s152-input-label">Enter the target block height:</div>
      <div class="b15-s152-input-sub">Current block: #${CURRENT_BLOCK.toLocaleString('en-US')}. Enter a larger number to lock in the future.</div>
      <div class="b15-s152-input-row">
        <input type="number" class="b15-s152-input" id="b15-s152-bh-input" value="${def}" min="0" max="499999999">
        <div class="b15-s152-input-unit">blocks</div>
      </div>`;
    const inp=document.getElementById('b15-s152-bh-input');
    if(inp) inp.addEventListener('input',()=>{
      currentVal=Math.min(499999999,Math.max(0,parseInt(inp.value)||0));
      update();
    });
    update();
  }

  // Mode buttons
  const mts=g('b15-s152-m-ts'),mbh=g('b15-s152-m-bh');
  if(mts) mts.addEventListener('click',()=>{
    mode='ts';
    mts.className='b15-s152-mode-btn s152-act';
    if(mbh) mbh.className='b15-s152-mode-btn';
    buildTS();
  });
  if(mbh) mbh.addEventListener('click',()=>{
    mode='bh';
    mbh.className='b15-s152-mode-btn s152-act';
    if(mts) mts.className='b15-s152-mode-btn';
    buildBH();
  });

  // nSequence toggle
  const seq=g('b15-s152-seq-toggle');
  if(seq) seq.addEventListener('click',()=>{seqActive=!seqActive;update();});

  // Use case presets
  function setUC(id){
    ['gaji','escrow','warisan','block'].forEach(u=>{
      const b=g(`b15-s152-uc-${u}`);
      if(b) b.className='b15-s152-uc-btn'+(u===id?' s152-act':'');
    });
  }
  const ucGaji=g('b15-s152-uc-gaji');
  if(ucGaji) ucGaji.addEventListener('click',()=>{
    setUC('gaji');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+30*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucEscrow=g('b15-s152-uc-escrow');
  if(ucEscrow) ucEscrow.addEventListener('click',()=>{
    setUC('escrow');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+180*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucWarisan=g('b15-s152-uc-warisan');
  if(ucWarisan) ucWarisan.addEventListener('click',()=>{
    setUC('warisan');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+365*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucBlock=g('b15-s152-uc-block');
  if(ucBlock) ucBlock.addEventListener('click',()=>{
    setUC('block');mode='bh';
    if(mbh){mbh.className='b15-s152-mode-btn s152-act';}
    if(mts){mts.className='b15-s152-mode-btn';}
    buildBH();
  });

  buildTS();
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.1 SIMULATION (Waktu di Bitcoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // ── BLOCK HEIGHT ──
  let blocks=[], refBlock=null;
  const BASE_HEIGHT=800000;

  function renderChain(){
    const track=g('b15-s151-track'); if(!track) return;
    track.innerHTML='';
    const show=blocks.slice(-6);
    show.forEach((b,i)=>{
      if(i>0){
        const arr=document.createElement('div');
        arr.className='b15-s151-chain-arrow';arr.textContent='→';
        track.appendChild(arr);
      }
      const el=document.createElement('div');
      const isRef=refBlock===b.height;
      const isNew=i===show.length-1&&!isRef;
      el.className='b15-s151-block '+(isRef?'s151-ref':isNew?'s151-new':'s151-past');
      el.innerHTML=`<div class="b15-s151-block-num">#${b.height.toLocaleString('en-US')}</div><div class="b15-s151-block-time">~${b.mins}m</div>`;
      track.appendChild(el);
    });
    const val=g('b15-s151-val');
    const desc=g('b15-s151-desc2');
    if(blocks.length===0){
      if(val) val.textContent='—';
      if(desc) desc.textContent='Click "Add New Block" to start.';
      return;
    }
    const last=blocks[blocks.length-1];
    if(val) val.textContent=`Block #${last.height.toLocaleString('en-US')}`;
    if(refBlock){
      const diff=last.height-refBlock;
      if(desc) desc.textContent=`${diff} blocks since the time reference (block #${refBlock.toLocaleString('en-US')}). In protocol rules this can be written: "this transaction is only valid after ${diff} confirmations from the reference block."`;
    } else {
      if(desc) desc.textContent=`The latest block in the chain. Mark this block as a time reference to see how many blocks have passed.`;
    }
  }

  const addBtn=g('b15-s151-add');
  if(addBtn) addBtn.addEventListener('click',()=>{
    const mins=Math.floor(Math.random()*20)+2;
    const height=(blocks.length>0?blocks[blocks.length-1].height:BASE_HEIGHT-1)+1;
    blocks.push({height,mins});
    renderChain();
  });
  const markBtn=g('b15-s151-mark');
  if(markBtn) markBtn.addEventListener('click',()=>{
    if(blocks.length===0) return;
    refBlock=blocks[blocks.length-1].height;
    renderChain();
  });
  const rst1=g('b15-s151-rst1');
  if(rst1) rst1.addEventListener('click',()=>{blocks=[];refBlock=null;renderChain();});
  renderChain();

  // ── MTP ──
  const BASE_TIME=1700000000;
  const baseTimes=Array.from({length:11},(_,i)=>BASE_TIME+i*600+Math.floor((Math.random()-0.5)*120));
  baseTimes.sort((a,b)=>a-b);

  function renderMTP(){
    const slider=g('b15-s151-slider'); if(!slider) return;
    const offset=parseInt(slider.value)*60;
    const times=[...baseTimes];
    times[5]+=offset;
    const baseMTP=[...baseTimes].sort((a,b)=>a-b)[5];
    const mtp=[...times].sort((a,b)=>a-b)[5];
    const diff=Math.round((mtp-baseMTP)/60);
    const sl=parseInt(slider.value);
    const offEl=g('b15-s151-offset');
    if(offEl) offEl.textContent=(sl>0?'+':'')+sl+' minutes';
    const container=g('b15-s151-mtp-blocks'); if(!container) return;
    container.innerHTML='';
    const minT=Math.min(...times)-300;
    const maxT=Math.max(...times)+300;
    const range=maxT-minT;
    const sorted=[...times].map((t,i)=>({t,i})).sort((a,b)=>a.t-b.t);
    const medianOrigIdx=sorted[5].i;
    times.forEach((t,i)=>{
      const isManip=i===5;
      const isMedian=i===medianOrigIdx;
      const pct=Math.max(5,((t-minT)/range)*100);
      const wrap=document.createElement('div');
      wrap.className='b15-s151-mtp-block';
      const barWrap=document.createElement('div');
      barWrap.className='b15-s151-mtp-bar-wrap';
      const bar=document.createElement('div');
      bar.className='b15-s151-mtp-bar';
      bar.style.height=pct+'%';
      bar.style.background=isManip?'#A32D2D':isMedian?'#0F6E56':'#534AB7';
      bar.style.opacity=isManip?'0.9':'0.7';
      if(isMedian){
        const line=document.createElement('div');
        line.className='b15-s151-mtp-median-line';
        line.style.bottom=pct+'%';
        barWrap.appendChild(line);
      }
      barWrap.appendChild(bar);
      const num=document.createElement('div');
      num.className='b15-s151-mtp-block-num';
      num.textContent=`#${i+1}${isManip?' ⚠':''}`;
      const ts=document.createElement('div');
      ts.className='b15-s151-mtp-block-ts';
      ts.textContent=`+${Math.round((t-BASE_TIME)/60)}m`;
      wrap.appendChild(barWrap);wrap.appendChild(num);wrap.appendChild(ts);
      container.appendChild(wrap);
    });
    const res=g('b15-s151-mtp-result');
    const rl=g('b15-s151-mtp-rlabel');
    const rv=g('b15-s151-mtp-val');
    const rd=g('b15-s151-mtp-desc');
    const isBig=Math.abs(diff)>=30;
    if(res) res.className='b15-s151-mtp-result '+(isBig?'s151-warn':'s151-normal');
    if(rl) rl.textContent=isBig?'MTP shifted quite far — but still limited':'Current Median Time Past (MTP)';
    if(rv) rv.textContent=diff===0?'MTP did’t shift':`MTP shifted ${diff>0?'+':''}${diff} minutes from baseline`;
    if(rd){
      if(sl===0) rd.textContent='All timestamps normal. MTP is the middle value of 11 blocks — representing the network’s "consensus time".';
      else if(isBig) rd.textContent=`Block #6 manipulated by ${sl} minutes. MTP shifted ${Math.abs(diff)} minutes too. For a larger manipulation, a miner would have to control the majority of these 11 blocks.`;
      else rd.textContent=`Block #6 manipulated by ${sl} minutes, but MTP only shifted ${Math.abs(diff)} minutes. The median protects against single-block manipulation.`;
    }
  }

  const slider=g('b15-s151-slider');
  if(slider) slider.addEventListener('input',renderMTP);
  renderMTP();

  // ── TABS ──
  const t1=g('b15-s151-t1'),t2=g('b15-s151-t2');
  const p1=g('b15-s151-p1'),p2=g('b15-s151-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b15-s151-tab s151-act';t2.className='b15-s151-tab';
    p1.className='b15-s151-pane show';p2.className='b15-s151-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b15-s151-tab s151-act';t1.className='b15-s151-tab';
    p2.className='b15-s151-pane show';p1.className='b15-s151-pane';
  });
})();

// ============================================================
// PAGE 19 · BAB 16 · NAVIGATION
// ============================================================
function showSectionInContentB16(sectionId, sbId) {
  document.querySelectorAll('#page-bab16 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab16 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab16-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 19 · BAB 16 · TOPBAR
// ============================================================
document.getElementById('back-home-b16').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b16').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 19 · BAB 16 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab16').addEventListener('click', () => navigate('page-bab16'));

// ============================================================
// PAGE 19 · BAB 16 · SIDEBAR EVENTS (16.1 - 16.6)
// ============================================================
document.getElementById('sb-16-1').addEventListener('click', () => showSectionInContentB16('section-16-1', 'sb-16-1'));
document.getElementById('sb-16-2').addEventListener('click', () => showSectionInContentB16('section-16-2', 'sb-16-2'));
document.getElementById('sb-16-3').addEventListener('click', () => showSectionInContentB16('section-16-3', 'sb-16-3'));
document.getElementById('sb-16-4').addEventListener('click', () => showSectionInContentB16('section-16-4', 'sb-16-4'));
document.getElementById('sb-16-5').addEventListener('click', () => showSectionInContentB16('section-16-5', 'sb-16-5'));
document.getElementById('sb-16-6').addEventListener('click', () => showSectionInContentB16('section-16-6', 'sb-16-6'));

// ============================================================
// PAGE 19 · BAB 16 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab16 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB16(target, sb);
  });
});

// ============================================================
// PAGE 19 · BAB 16 · 16.6 SIMULATION (10 Daily Commands)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CMDS=[
    {num:1,code:'bitcoin-cli getblockchaininfo',
     when:'Every day — the first check when you open the terminal',
     why:'One command to know everything: whether the node is synced, the latest block, whether it’s still in IBD, whether pruning is active. This is your node’s main dashboard.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":               ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "headers":              ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "verificationprogress": ','s166-tb'],['0.9999982341','s166-tn'],[',','s166-tgy'],
       ['  "initialblockdownload": ','s166-tb'],['false','s166-tbt'],[',','s166-tgy'],
       ['  "pruned":               ','s166-tb'],['false','s166-tbf'],[',','s166-tgy'],
       ['  "difficulty":           ','s166-tb'],['88171509232073.27','s166-tn'],
       ['  ...','s166-tcm'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"initialblockdownload"',v:'false',d:'false = the node is synced and ready. true = don’t trust data from this node yet.'},
       {k:'"verificationprogress"',v:'0.9999982341',d:'The closer to 1.0, the more synced your node is with the latest chain.'},
     ]},
    {num:2,code:'bitcoin-cli getnetworkinfo',
     when:'When the node feels slow or isn’t receiving new blocks',
     why:'Check whether your node is still connected to the network. Low in/out connections can mean a firewall, internet, or peer-ban problem.',
     output:[
       ['{','s166-tgy'],
       ['  "connections":     ','s166-tb'],['18','s166-tn'],[',','s166-tgy'],
       ['  "connections_in":  ','s166-tb'],['8','s166-tn'],[',','s166-tgy'],
       ['  "connections_out": ','s166-tb'],['10','s166-tn'],[',','s166-tgy'],
       ['  "networkactive":   ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "relayfee":        ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"connections_out"',v:'10',d:'At least 8 outbound for optimal security. If 0, your node is offline.'},
       {k:'"networkactive"',v:'true',d:'false means the node is deliberately set offline. Use setnetworkactive true to reactivate it.'},
     ]},
    {num:3,code:'bitcoin-cli getmempoolinfo',
     when:'Before sending a transaction — check the fee market conditions',
     why:'If the mempool is full, the fee for fast confirmation will be expensive. If it’s nearly empty, you can send with the minimum fee. Real-time data from your own node.',
     output:[
       ['{','s166-tgy'],
       ['  "loaded":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "size":           ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "bytes":          ','s166-tb'],['47291834','s166-tn'],[',','s166-tgy'],
       ['  "mempoolminfee":  ','s166-tb'],['0.00001000','s166-tn'],[',','s166-tgy'],
       ['  "minrelaytxfee":  ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"size"',v:'18432',d:'The number of transactions waiting for confirmation in the mempool.'},
       {k:'"bytes"',v:'47291834',d:'~47 MB = the mempool is fairly full, fees need to be higher for fast confirmation.'},
       {k:'"mempoolminfee"',v:'0.00001000',d:'The minimum fee your node’s mempool accepts. Transactions below this won’t be relayed.'},
     ]},
    {num:4,code:'bitcoin-cli getblockcount',
     when:'Quick check — what the block height is now',
     why:'The lightest command. The output is a single number. Useful for automation scripts or when you just need the block height without other info.',
     output:[['870142','s166-tn']],
     fields:[
       {k:'output',v:'870142',d:'A direct integer — the latest block height. Compare with a public explorer to verify sync.'},
     ]},
    {num:5,code:'bitcoin-cli gettxoutsetinfo',
     when:'Weekly audit — verify the total Bitcoin supply',
     why:'The only way to independently verify that the total Bitcoin doesn’t exceed 21 million. No central bank, no external audit — your node proves it.',
     output:[
       ['{','s166-tgy'],
       ['  "height":       ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "txouts":       ','s166-tb'],['184218954','s166-tn'],[',','s166-tgy'],
       ['  "disk_size":    ','s166-tb'],['11284716032','s166-tn'],[',','s166-tgy'],
       ['  "total_amount": ','s166-tb'],['19720483.12847291','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"total_amount"',v:'19,720,483 BTC',d:'Total BTC in circulation. Must always be below 21 million. If more, something is very wrong.'},
       {k:'"txouts"',v:'184,218,954',d:'The current number of UTXOs. The larger it is, the more RAM the node needs.'},
     ]},
    {num:6,code:'bitcoin-cli getpeerinfo',
     when:'Troubleshooting connections or checking a problematic peer',
     why:'See the details of all peers: where they’re from, what software version, what block they’ve synced to, how much bandwidth they use.',
     output:[
       ['[','s166-tgy'],
       ['  {','s166-tgy'],
       ['    "addr":          ','s166-tb'],['"203.0.113.42:8333"','s166-ts'],[',','s166-tgy'],
       ['    "version":       ','s166-tb'],['70016','s166-tn'],[',','s166-tgy'],
       ['    "subver":        ','s166-tb'],['"\/Satoshi:27.0.0\/"','s166-ts'],[',','s166-tgy'],
       ['    "synced_blocks": ','s166-tb'],['870142','s166-tn'],
       ['    ...','s166-tcm'],
       ['  }','s166-tgy'],
       ['  ...','s166-tcm'],
       [']','s166-tgy'],
     ],
     fields:[
       {k:'"synced_blocks"',v:'870142',d:'The last block this peer is known to have validated. If far behind, this peer isn’t useful for IBD.'},
       {k:'"subver"',v:'"/Satoshi:27.0.0/"',d:'The software version the peer runs. Useful for monitoring version distribution across the network.'},
     ]},
    {num:7,code:'bitcoin-cli estimatesmartfee 6',
     when:'Before sending a transaction — estimate the right fee',
     why:'How much fee is needed for the transaction to be confirmed within 6 blocks (~1 hour)? Data from your own node’s mempool, not from a third-party service.',
     output:[
       ['{','s166-tgy'],
       ['  "feerate": ','s166-tb'],['0.00012340','s166-tn'],[',','s166-tgy'],
       ['  "blocks":  ','s166-tb'],['6','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"feerate"',v:'0.00012340',d:'The fee rate in BTC/kB for confirmation within 6 blocks. Calculated from your own node’s mempool data.'},
       {k:'"blocks"',v:'6',d:'Replace with 1 to estimate the next-block fee, or 144 for a cheap fee (~1 day).'},
     ]},
    {num:8,code:'bitcoin-cli getmininginfo',
     when:'Monitor difficulty and network security conditions',
     why:'See the current difficulty, the network hashrate estimate, and how many blocks have been mined in this difficulty adjustment period.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":        ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "difficulty":    ','s166-tb'],['88171509232073.27','s166-tn'],[',','s166-tgy'],
       ['  "networkhashps": ','s166-tb'],['6.847e+20','s166-tn'],[',','s166-tgy'],
       ['  "pooledtx":      ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "chain":         ','s166-tb'],['"main"','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"difficulty"',v:'88,171,509,232,073',d:'The current difficulty. A larger number = a more secure network.'},
       {k:'"networkhashps"',v:'6.847e+20',d:'~685 exahash/s = the total network hashrate. The larger it is, the harder it is to attack.'},
     ]},
    {num:9,code:'bitcoin-cli getwalletinfo',
     when:'Check the node wallet’s balance and status',
     why:'See the total balance, transaction count, whether the wallet is rescanning, and whether the wallet is encrypted. Data directly from your node, not a third-party server.',
     output:[
       ['{','s166-tgy'],
       ['  "walletname":          ','s166-tb'],['"default"','s166-ts'],[',','s166-tgy'],
       ['  "balance":             ','s166-tb'],['0.12847291','s166-tn'],[',','s166-tgy'],
       ['  "unconfirmed_balance": ','s166-tb'],['0.00000000','s166-tn'],[',','s166-tgy'],
       ['  "txcount":             ','s166-tb'],['47','s166-tn'],[',','s166-tgy'],
       ['  "unlocked_until":      ','s166-tb'],['0','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"balance"',v:'0.12847291 BTC',d:'The confirmed balance. Verified directly from your node’s chainstate.'},
       {k:'"unlocked_until"',v:'0',d:'0 = the wallet is locked. Always lock the wallet after you’re done using it.'},
     ]},
    {num:10,code:'bitcoin-cli validateaddress "bc1qar0srrr..."',
     when:'Before receiving a payment — validate the address',
     why:'Verify that the Bitcoin address you’re using is valid and correctly formatted. Prevents the mistake of sending to an invalid address.',
     output:[
       ['{','s166-tgy'],
       ['  "isvalid":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "address":         ','s166-tb'],['"bc1qar0srrr7xfkvy5l643..."','s166-ts'],[',','s166-tgy'],
       ['  "iswitness":       ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "witness_version": ','s166-tb'],['0','s166-tn'],[',','s166-tgy'],
       ['  "witness_program": ','s166-tb'],['"e8df018c7e326cc253fae05bc7..."','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"isvalid"',v:'true',d:'true = this address is valid. false = wrong address, don’t send here.'},
       {k:'"iswitness"',v:'true',d:'true = this is a SegWit address (bc1...). More efficient than a legacy address.'},
       {k:'"witness_version"',v:'0',d:'0 = SegWit v0. 1 = Taproot (bc1p...). Determines the type of script used.'},
     ]},
  ];

  let currentIdx=0;

  function runCmd(idx){
    currentIdx=idx;
    document.querySelectorAll('.b16-s166-cmd').forEach((b,i)=>b.classList.toggle('s166-act',i===idx));
    const data=CMDS[idx];if(!data) return;

    const termCmd=g('b16-s166-term-cmd');
    if(termCmd) termCmd.textContent=data.code;

    const body=g('b16-s166-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s166-tg">satoshi@node</span><span class="s166-tgy">:~$</span> <span class="s166-tw"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s166-tcm'||tr.endsWith(',')) flush();
    });
    flush();

    const explain=g('b16-s166-explain');if(!explain) return;
    explain.innerHTML='';
    const head=document.createElement('div');head.className='b16-s166-explain-head';
    head.innerHTML=`<div class="b16-s166-explain-num">${data.num}</div>
      <div class="b16-s166-explain-body">
        <div class="b16-s166-explain-title">${data.code}</div>
        <div class="b16-s166-explain-when">📅 When: ${data.when}</div>
        <div class="b16-s166-explain-why">Why: ${data.why}</div>
      </div>`;
    explain.appendChild(head);

    if(data.fields&&data.fields.length){
      const fe=document.createElement('div');fe.className='b16-s166-fe';
      const lbl=document.createElement('div');lbl.className='b16-s166-fe-lbl';lbl.textContent='Key fields:';
      fe.appendChild(lbl);
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s166-field';
        row.innerHTML=`<div class="b16-s166-fk">${f.k}</div><div class="b16-s166-fv">${f.v}</div><div class="b16-s166-fd">${f.d}</div>`;
        fe.appendChild(row);
      });
      explain.appendChild(fe);
    }
  }

  (function(){
    const el=g('b16-s166-grid');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s166-cmd'+(i===0?' s166-act':'');
      btn.innerHTML=`<div class="b16-s166-cmd-num">${c.num}</div>
        <div class="b16-s166-cmd-code">${c.code}</div>
        <div class="b16-s166-cmd-when">${c.when.split('—')[0].trim()}</div>
        <div class="b16-s166-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runCmd(i));
      el.appendChild(btn);
    });
  })();

  runCmd(0);
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.5 SIMULATION (assumevalid & assumeUTXO)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const MODES={
    full:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download all headers (80 bytes/block)',desc:'~70 MB total for the entire blockchain. Fast.',time:'~5 minutes'},
        {cls:'s165-done',icon:'⬇️',title:'Download all block data',desc:'~650 GB total. This takes the longest in terms of download time.',time:'~2-12 hours'},
        {cls:'s165-done',icon:'✅',title:'Validate each block’s structure',desc:'Proof-of-work, timestamp, size, merkle root — every block from genesis.',time:'~1-3 hours'},
        {cls:'s165-done',icon:'🔐',title:'Verify ALL signatures',desc:'This is the most CPU-intensive. Every input of every transaction of every block is verified.',time:'~10-50 hours'},
        {cls:'s165-done',icon:'🗃️',title:'Build the UTXO set from genesis',desc:'Every output is added, every spent one is removed. The end result: an accurate chainstate.',time:'~1-2 hours'},
      ],
      trust:'A full IBD requires no trust in anyone — every byte, every signature is verified by your own node. This is the gold standard of Bitcoin verification. Use -assumevalid=0 to enable this mode.',
    },
    assumevalid:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download all headers',desc:'~70 MB. Identical to a full IBD.',time:'~5 minutes'},
        {cls:'s165-done',icon:'⬇️',title:'Download all block data',desc:'~650 GB. Blocks are still downloaded entirely — nothing is skipped.',time:'~2-12 hours'},
        {cls:'s165-done',icon:'✅',title:'Validate each block’s structure',desc:'Proof-of-work, timestamp, size, merkle root — still validated for all blocks.',time:'~1-3 hours'},
        {cls:'s165-skip',icon:'⏩',title:'Old block signatures SKIPPED',desc:'For blocks before the assumevalid hash, signatures aren’t verified. This saves the most time.',time:'skipped'},
        {cls:'s165-done',icon:'🗃️',title:'Build the UTXO set from genesis',desc:'The UTXO set is still built fully from all transactions. No shortcut here.',time:'~1-2 hours'},
      ],
      trust:'assumevalid isn’t blind trust. If the hardcoded hash is wrong, the node will build a UTXO set that conflicts with the network and is caught immediately. The source code is open and audited by thousands of developers. You can also disable it with -assumevalid=0 anytime.',
    },
    assumeutxo:{
      phases:[
        {cls:'s165-snap',icon:'📦',title:'Load the UTXO set snapshot (~11 GB)',desc:'The snapshot file contains all UTXOs at a particular block height.',time:'~5-10 minutes'},
        {cls:'s165-done',icon:'🔍',title:'Verify the snapshot hash',desc:'The node verifies that the snapshot hash matches the hardcoded one. If it doesn’t match, it’s rejected.',time:'~1 minute'},
        {cls:'s165-done',icon:'✅',title:'The node operates immediately',desc:'After the snapshot is verified, the node can already validate new transactions and the latest blocks.',time:'DONE ✓'},
        {cls:'s165-bg',  icon:'🔄',title:'Historical verification in the background',desc:'The node downloads and verifies the blockchain from genesis in the background while still operating normally.',time:'~4-8 hours (bg)'},
        {cls:'s165-done',icon:'🎯',title:'Background sync complete',desc:'The chainstate from the snapshot has been independently verified. The node is equivalent to a normal IBD.',time:'~4-8 hours total'},
      ],
      trust:'assumeUTXO uses a snapshot whose hash is hardcoded and can be audited by anyone. If the snapshot contains the wrong UTXO, the background verification will find the inconsistency. The design ensures the node will self-correct even if the snapshot is wrong.',
    },
  };

  let currentMode='full';

  function renderMode(mode){
    const data=MODES[mode];if(!data) return;
    const phases=g('b16-s165-phases');const trust=g('b16-s165-trust');
    if(phases){
      phases.innerHTML='';
      data.phases.forEach(p=>{
        const div=document.createElement('div');div.className=`b16-s165-phase ${p.cls}`;
        div.innerHTML=`<div class="b16-s165-phase-icon">${p.icon}</div>
          <div class="b16-s165-phase-body">
            <div class="b16-s165-phase-title">${p.title}</div>
            <div class="b16-s165-phase-desc">${p.desc}</div>
          </div>
          <div class="b16-s165-phase-time">${p.time}</div>`;
        phases.appendChild(div);
      });
    }
    if(trust){
      trust.innerHTML=`<div class="b16-s165-trust-label">Trust analysis (trust model):</div>
        <div class="b16-s165-trust-text">${data.trust}</div>`;
    }
  }

  const modeEl=g('b16-s165-modes');
  if(modeEl) modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(b=>b.classList.remove('s165-act'));
      btn.classList.add('s165-act');
      currentMode=btn.dataset.mode;
      renderMode(currentMode);
    });
  });
  renderMode('full');

  // RPC
  const CMDS=[
    {id:'getblockchaininfo_av',code:'bitcoin-cli getblockchaininfo',hint:'Check assumevalid status',
     output:[
       ['{','s165-tgy'],
       ['  "blocks":               ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['  "verificationprogress": ','s165-tb'],['0.9999982341','s165-tn'],[',','s165-tgy'],
       ['  "chainwork":            ','s165-tb'],['"00000000000000000000000000000000000000007b4e..."','s165-ts'],[',','s165-tgy'],
       ['  "initialblockdownload": ','s165-tb'],['false','s165-tbt'],
       ['  ...','s165-tcm'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"verificationprogress"',v:'0.9999982341',d:'Sync progress approaching 1.0 means the node is nearly done. Calculated from chainwork, not block count.'},
       {k:'"chainwork"',v:'"00000...7b4e"',d:'Total accumulated proof-of-work. Compared with the assumevalid hash to determine which blocks have their signatures skipped.'},
     ],
     note:'The assumevalid hash is hardcoded in the source code and updated each new release. To see the value used, check the source code or use -assumevalid=0 to disable it.'},
    {id:'assumevalid_disable',code:'bitcoind -assumevalid=0',hint:'Disable assumevalid (full verification)',
     output:[
       ['# Run bitcoind with this flag for a full IBD','s165-tcm'],
       ['# All signatures from block 0 will be verified','s165-tcm'],
       ['# Estimated time: 3-10x longer than default','s165-tcm'],
       ['','s165-tgy'],
       ['Bitcoin Core starting...','s165-tw'],
       ['Loaded 0 addresses from peers.dat','s165-tgy'],
       ['assumevalid is disabled, verifying all signatures','s165-tn'],
       ['UpdateTip: new best=00000...a4b height=1 ...','s165-tgy'],
     ],
     fields:[
       {k:'-assumevalid=0',v:'disable',d:'Fully disables assumevalid. The node will verify every signature from the genesis block.'},
       {k:'alternative',v:'-assumevalid=hash',d:'Can be set to a particular block hash to define your own assumevalid cutoff point.'},
     ],
     note:'Use -assumevalid=0 if you want the most thorough verification. The process is far longer but gives the highest security guarantee without any trust in the developers.'},
    {id:'loadtxoutset',code:'bitcoin-cli loadtxoutset /path/to/utxo-870000.dat',hint:'Load an assumeUTXO snapshot',
     output:[
       ['{','s165-tgy'],
       ['  "coins_loaded":  ','s165-tb'],['184218954','s165-tn'],[',','s165-tgy'],
       ['  "tip_hash":      ','s165-tb'],['"00000000000000000001a4b..."','s165-ts'],[',','s165-tgy'],
       ['  "base_height":   ','s165-tb'],['870000','s165-tn'],[',','s165-tgy'],
       ['  "path":          ','s165-tb'],['"\/path\/to\/utxo-870000.dat"','s165-ts'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"coins_loaded"',v:'184,218,954',d:'The number of UTXOs successfully loaded from the snapshot.'},
       {k:'"base_height"',v:'870000',d:'The block height of the snapshot. The node can validate blocks above this height immediately after the snapshot is loaded.'},
       {k:'"tip_hash"',v:'"00000...a4b"',d:'The tip block hash of the snapshot. Verified to match the hardcoded one before being used.'},
     ],
     note:'An assumeUTXO snapshot file can be obtained from various sources — but always verify its hash. The node will reject a snapshot whose hash doesn’t match the one hardcoded in the source code.'},
    {id:'getchainstates',code:'bitcoin-cli getchainstates',hint:'Background sync status after assumeUTXO',
     output:[
       ['{','s165-tgy'],
       ['  "chainstates": [','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['true','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['      "snapshot_blockhash":','s165-tb'],['"00000...a4b"','s165-ts'],
       ['    },','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['false','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['423819','s165-tn'],[',','s165-tgy'],
       ['      # background verification: 48.7% complete','s165-tcm'],
       ['    }','s165-tgy'],
       ['  ]','s165-tgy'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'active chainstate [0]',v:'blocks: 870142',d:'The chainstate from the snapshot used to validate new transactions. Already at the latest block.'},
       {k:'background chainstate [1]',v:'blocks: 423819',d:'Background verification is at block 423,819 of 870,142. ~48.7% complete.'},
       {k:'"snapshot_blockhash"',v:'"00000...a4b"',d:'The snapshot hash used. null on the background chainstate means this is a normal IBD from genesis.'},
     ],
     note:'getchainstates shows two chainstates running in parallel: one from the snapshot (active) and one from genesis (background). After the background sync completes, the two are merged into one.'},
  ];

  let currentCmd=CMDS[0].id;
  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s165-cmd').forEach(b=>b.classList.toggle('s165-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s165-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s165-tg">satoshi@node</span><span class="s165-tgy">:~$</span> <span class="s165-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s165-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s165-fe'),fei=g('b16-s165-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s165-field';
        row.innerHTML=`<div class="b16-s165-fk">${f.k}</div><div class="b16-s165-fv">${f.v}</div><div class="b16-s165-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s165-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s165-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s165-cmd'+(i===0?' s165-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s165-cmd-code">${c.code}</div><div class="b16-s165-cmd-hint">${c.hint}</div><div class="b16-s165-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s165-t1'),t2=g('b16-s165-t2');
  const p1=g('b16-s165-p1'),p2=g('b16-s165-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s165-tab s165-act';t2.className='b16-s165-tab';
    p1.className='b16-s165-pane show';p2.className='b16-s165-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s165-tab s165-act';t1.className='b16-s165-tab';
    p2.className='b16-s165-pane show';p1.className='b16-s165-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_av');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.4 SIMULATION (Pruning Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const TOTAL_GB=650, TOTAL_BLOCKS=870142;

  function renderTL(pruneGB){
    const tl=g('b16-s164-tl');if(!tl) return;
    tl.innerHTML='';
    const prunedPct=Math.max(0,Math.min(95,(1-pruneGB/TOTAL_GB)*100));
    const keptPct=Math.max(3,100-prunedPct-2);
    const seg1=document.createElement('div');
    seg1.className='b16-s164-tl-seg s164-pruned';seg1.style.width=prunedPct+'%';
    const l1=document.createElement('div');l1.className='b16-s164-tl-seg-lbl';
    l1.textContent=prunedPct>18?'Block validated & deleted':'';seg1.appendChild(l1);
    const seg2=document.createElement('div');
    seg2.className='b16-s164-tl-seg s164-kept';seg2.style.width=keptPct+'%';
    const l2=document.createElement('div');l2.className='b16-s164-tl-seg-lbl';
    l2.textContent=keptPct>10?'Buffer':'';seg2.appendChild(l2);
    const seg3=document.createElement('div');
    seg3.className='b16-s164-tl-seg s164-recent';seg3.style.width='2%';
    tl.appendChild(seg1);tl.appendChild(seg2);tl.appendChild(seg3);
    const marker=g('b16-s164-prune-marker');
    if(marker){
      const pruneBlock=Math.round(TOTAL_BLOCKS*(1-pruneGB/TOTAL_GB));
      marker.textContent='Prune height ~#'+pruneBlock.toLocaleString('en-US');
    }
  }

  function updateStats(mb){
    const gb=mb/1024;
    const saved=Math.max(0,TOTAL_GB-gb);
    const prunedBlocks=Math.round(TOTAL_BLOCKS*(1-gb/TOTAL_GB));
    const neededEl=g('b16-s164-needed');
    const savedEl=g('b16-s164-saved');
    const pruneEl=g('b16-s164-pruned-blocks');
    if(neededEl) neededEl.textContent=mb>=1024?(mb/1024).toFixed(1)+' GB':mb+' MB';
    if(savedEl) savedEl.textContent='~'+Math.round(saved)+' GB';
    if(pruneEl) pruneEl.textContent='~'+prunedBlocks.toLocaleString('en-US');
  }

  const sl=g('b16-s164-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s164-sl-val');
    if(vEl) vEl.textContent=v>=1024?(v/1024).toFixed(1)+' GB':v+' MB';
    renderTL(v/1024);updateStats(v);
  });
  renderTL(0.55);updateStats(550);

  // RPC data — 3 normal + 2 error
  const CMDS=[
    {id:'getblockchaininfo_prune',code:'bitcoin-cli getblockchaininfo',hint:'Check pruning status',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned":            ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "pruneheight":       ','s164-tb'],['869592','s164-tn'],[',','s164-tgy'],
       ['  "automatic_pruning": ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "prune_target_size": ','s164-tb'],['576716800','s164-tn'],[',','s164-tgy'],
       ['  "blocks":            ','s164-tb'],['870142','s164-tn'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'true',d:'true = the node runs in pruning mode. false = a full archival node.',err:false},
       {k:'"pruneheight"',v:'869592',d:'The oldest block height still on disk. Blocks below this have been deleted. This number rises over time.',err:false},
       {k:'"prune_target_size"',v:'576716800',d:'The maximum target size of block files in bytes. 576,716,800 = 550 MB (the minimum value).',err:false},
     ],
     note:'"pruneheight" is the key to knowing which blocks are still accessible. If you want getblock for an old block, make sure its block height is above pruneheight.',
     noteType:'normal'},
    {id:'pruneblockchain',code:'bitcoin-cli pruneblockchain 850000',hint:'Manually prune up to a certain block',isErr:false,
     output:[['869142','s164-tn']],
     fields:[
       {k:'parameter: 850000',v:'target height',d:'The target block height for pruning. The node will delete old blocks up to near this height.',err:false},
       {k:'output: 869142',v:'actual height',d:'The actual block height that was pruned. Can be higher than the target if the node needs to keep undo data for the last few blocks.',err:false},
     ],
     note:'Manual pruning can only be done if prune=1 in bitcoin.conf (manual mode) or the node is already in pruning mode. It can’t be run on a full archival node.',
     noteType:'normal'},
    {id:'getblockchaininfo_full',code:'bitcoin-cli getblockchaininfo  # full archival',hint:'Full archival node (pruning off)',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned": ','s164-tb'],['false','s164-tbf'],[',','s164-tgy'],
       ['  # pruneheight is not in the output','s164-tcm'],
       ['  # all blocks from genesis are available','s164-tcm'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'false',d:'false = a full archival node. All blocks are available. "pruneheight" doesn’t appear.',err:false},
       {k:'storage needed',v:'~650 GB+',d:'Full archival stores all blocks since genesis. Grows ~50-60 GB per year.',err:false},
     ],
     note:'A full archival node can serve old blocks to peers doing IBD — contributing more to the network. It needs far more storage but is better for network health.',
     noteType:'normal'},
    {id:'err_getblock',code:'bitcoin-cli getblock "00000...old" 1',hint:'NOT possible on a pruned node',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-1','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],['"Block not available (pruned data)"','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -1',v:'Block not available',d:'The node returns this error if you try to access a block that has been pruned and is no longer on disk.',err:true},
       {k:'solution',v:'use an archival node',d:'To access a historical block, you need a full archival node or a block explorer service like mempool.space.',err:true},
     ],
     note:'This is the error pruned-node users most often encounter. If you need access to historical blocks regularly, consider not enabling pruning.',
     noteType:'err'},
    {id:'err_getrawtx',code:'bitcoin-cli getrawtransaction "txid"',hint:'NOT possible without txindex',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-5','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],
       ['"No such mempool transaction.','s164-terr'],
       [' Use -txindex or provide a block hash','s164-terr'],
       [' to enable blockchain transaction queries."','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -5',v:'No such mempool tx',d:'The node can’t look up a historical transaction without txindex because a pruned node has no transaction index.',err:true},
       {k:'solution 1: -txindex',v:'incompatible',d:'txindex can’t be run together with pruning. You have to choose one.',err:true},
       {k:'solution 2: block hash',v:'getblock "hash" 2',d:'If you know the block hash, use getblock with verbosity 2 — but only for blocks that haven’t been pruned.',err:true},
     ],
     note:'A pruned node + txindex are incompatible. If you need getrawtransaction for a historical transaction, you must run a full archival node with txindex=1 in bitcoin.conf.',
     noteType:'err'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s164-cmd').forEach(b=>b.classList.toggle('s164-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s164-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s164-tg">satoshi@node</span><span class="s164-tgy">:~$</span> <span class="s164-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||c==='s164-tcm'||c==='s164-terr'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s164-fe'),fei=g('b16-s164-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');
        row.className='b16-s164-field'+(f.err?' s164-err-field':'');
        row.innerHTML=`<div class="b16-s164-fk">${f.k}</div><div class="b16-s164-fv">${f.v}</div><div class="b16-s164-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s164-note');
    if(note){
      note.style.display='block';
      note.className='b16-s164-note '+(data.noteType==='err'?'s164-note-err':'s164-note-normal');
      note.textContent=data.note;
    }
  }

  (function(){
    const el=g('b16-s164-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s164-cmd'+(i===0?' s164-act':'')+(c.isErr?' s164-err':'');
      btn.dataset.id=c.id;
      let html=`<div class="b16-s164-cmd-code">${c.code}</div>`;
      if(c.isErr) html+=`<div class="b16-s164-cmd-badge">ERROR</div>`;
      html+=`<div class="b16-s164-cmd-hint">${c.hint}</div><div class="b16-s164-cmd-arrow">▶</div>`;
      btn.innerHTML=html;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s164-t1'),t2=g('b16-s164-t2');
  const p1=g('b16-s164-p1'),p2=g('b16-s164-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s164-tab s164-act';t2.className='b16-s164-tab';
    p1.className='b16-s164-pane show';p2.className='b16-s164-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s164-tab s164-act';t1.className='b16-s164-tab';
    p2.className='b16-s164-pane show';p1.className='b16-s164-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_prune');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.3 SIMULATION (Chainstate Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // Animate bar
  setTimeout(()=>{
    const bar=g('b16-s163-bar');const txt=g('b16-s163-bar-text');
    if(bar) bar.style.width='1.7%';
    if(txt) txt.textContent='Chainstate 11 GB';
  },400);

  // dbcache slider
  const sl=g('b16-s163-cache-sl');
  const labels=[
    {max:900,  cls:'s163-bad',  text:'<strong>Default / Too small (< 900 MB):</strong> A cramped desk. The node often reads disk during IBD, sync is slower. Suitable only if RAM is very limited.'},
    {max:2000, cls:'s163-ok',   text:'<strong>Adequate (900 MB - 2 GB):</strong> A decent desk. IBD is faster than default. Suitable for a node with 4-8 GB RAM.'},
    {max:8000, cls:'s163-good', text:'<strong>Optimal (2 GB - 8 GB):</strong> A spacious desk. Most of the UTXO set fits in RAM. IBD is very fast. Recommended for a new node doing IBD.'},
  ];
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s163-cache-val');
    if(vEl) vEl.textContent=v>=1000?(v/1000).toFixed(1)+' GB':v+' MB';
    const res=g('b16-s163-cache-result');if(!res) return;
    const lbl=labels.find(l=>v<=l.max)||labels[labels.length-1];
    res.className='b16-s163-cache-result '+lbl.cls;
    res.innerHTML=lbl.text;
  });

  // RPC data
  const CMDS=[
    {id:'gettxoutsetinfo',code:'bitcoin-cli gettxoutsetinfo',hint:'UTXO set statistics',
     output:[
       ['{','s163-tgy'],
       ['  "height":           ','s163-tb'],['870142','s163-tn'],[',','s163-tgy'],
       ['  "bestblock":        ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "txouts":           ','s163-tb'],['184218954','s163-tn'],[',','s163-tgy'],
       ['  "bogosize":         ','s163-tb'],['13847291823','s163-tn'],[',','s163-tgy'],
       ['  "muhash":           ','s163-tb'],['"a3f8c2e1d4b7..."','s163-ts'],[',','s163-tgy'],
       ['  "transactions":     ','s163-tb'],['152441089','s163-tn'],[',','s163-tgy'],
       ['  "disk_size":        ','s163-tb'],['11284716032','s163-tn'],[',','s163-tgy'],
       ['  "total_amount":     ','s163-tb'],['19720483.12847291','s163-tn'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"txouts"',v:'184,218,954',d:'The total UTXOs currently in existence. Each one is an unspent output across the entire Bitcoin network.'},
       {k:'"total_amount"',v:'19,720,483 BTC',d:'The sum of all UTXOs = total BTC in circulation. Can be used to verify that no BTC was created off-schedule.'},
       {k:'"disk_size"',v:'~11 GB',d:'The chainstate size on disk in bytes after LevelDB compression.'},
       {k:'"muhash"',v:'"a3f8c2e1..."',d:'A hash of the entire UTXO set using MuHash. Used to verify an assumeUTXO snapshot.'},
     ],
     note:'This command is a bit slow because it has to read the entire chainstate database. On a node with an SSD it usually finishes in 30-120 seconds. "total_amount" is the best way to verify that the Bitcoin supply is on schedule.'},
    {id:'gettxout',code:'bitcoin-cli gettxout "a1b2c3...txid" 0',hint:'Query one specific UTXO',
     output:[
       ['{','s163-tgy'],
       ['  "bestblock":    ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "confirmations":','s163-tb'],['14382','s163-tn'],[',','s163-tgy'],
       ['  "value":        ','s163-tb'],['0.05000000','s163-tn'],[',','s163-tgy'],
       ['  "scriptPubKey": ','s163-tb'],['{','s163-tgy'],
       ['    "type":    ','s163-tb'],['"witness_v1_taproot"','s163-ts'],[',','s163-tgy'],
       ['    "address": ','s163-tb'],['"bc1p..."','s163-ts'],
       ['  }','s163-tgy'],[',','s163-tgy'],
       ['  "coinbase":     ','s163-tb'],['false','s163-tbt'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"value"',v:'0.05000000',d:'The UTXO value in BTC. The node stores this as satoshi (5,000,000 sat) in LevelDB.'},
       {k:'"confirmations"',v:'14382',d:'How many blocks have been confirmed since this UTXO was created. The larger, the older and safer this UTXO is.'},
       {k:'"type"',v:'"witness_v1_taproot"',d:'The type of locking script. Taproot = SegWit v1. This determines how the UTXO can be spent.'},
       {k:'"coinbase"',v:'false',d:'true means this UTXO is from a miner reward. A coinbase UTXO needs 100 confirmations before it can be spent.'},
     ],
     note:'If the output of this command is null, that UTXO has been spent or never existed. A direct way to check whether an output can still be used.'},
    {id:'getmemoryinfo',code:'bitcoin-cli getmemoryinfo',hint:'Node memory usage info',
     output:[
       ['{','s163-tgy'],
       ['  "locked": {','s163-tgy'],
       ['    "used":        ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "free":        ','s163-tb'],['393216','s163-tn'],[',','s163-tgy'],
       ['    "total":       ','s163-tb'],['458752','s163-tn'],[',','s163-tgy'],
       ['    "locked":      ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "chunks_used": ','s163-tb'],['2','s163-tn'],[',','s163-tgy'],
       ['    "chunks_free": ','s163-tb'],['1','s163-tn'],
       ['  }','s163-tgy'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"used"',v:'65536',d:'The memory currently used by the node in bytes. Excludes dbcache, which is managed separately.'},
       {k:'"total"',v:'458752',d:'Total memory allocated to the node (outside dbcache). ~448 KB for node overhead.'},
       {k:'"locked"',v:'65536',d:'Memory locked into RAM that can’t be swapped to disk. For sensitive data like wallet keys.'},
     ],
     note:'This command shows the node’s internal memory usage, excluding dbcache. To see total RAM usage including dbcache, use OS tools like "top" or "htop" and look for the bitcoind process.'},
    {id:'savemempool',code:'bitcoin-cli savemempool',hint:'Save the mempool to disk',
     output:[
       ['{','s163-tgy'],
       ['  "filename": ','s163-tb'],['"~/.bitcoin/mempool.dat"','s163-ts'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"filename"',v:'"mempool.dat"',d:'The file path where the mempool is saved. The node automatically loads this file on restart so transactions aren’t lost.'},
     ],
     note:'The node saves the mempool automatically on a normal shutdown. Use savemempool if you want to force a flush to disk — useful before a backup or a planned restart.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s163-cmd').forEach(b=>b.classList.toggle('s163-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s163-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s163-tg">satoshi@node</span><span class="s163-tgy">:~$</span> <span class="s163-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s163-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s163-fe'),fei=g('b16-s163-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s163-field';
        row.innerHTML=`<div class="b16-s163-fk">${f.k}</div><div class="b16-s163-fv">${f.v}</div><div class="b16-s163-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s163-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s163-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s163-cmd'+(i===0?' s163-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s163-cmd-code">${c.code}</div><div class="b16-s163-cmd-hint">${c.hint}</div><div class="b16-s163-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s163-t1'),t2=g('b16-s163-t2');
  const p1=g('b16-s163-p1'),p2=g('b16-s163-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s163-tab s163-act';t2.className='b16-s163-tab';
    p1.className='b16-s163-pane show';p2.className='b16-s163-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s163-tab s163-act';t1.className='b16-s163-tab';
    p2.className='b16-s163-pane show';p1.className='b16-s163-pane';
    runRPC(currentCmd);
  });
  runRPC('gettxoutsetinfo');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.2 SIMULATION (Block Inspector)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CHECKS=[
    {icon:'📦',title:'1. Basic block structure valid',
     desc:'The node checks whether the block has all required fields: version, previousblockhash, merkleroot, time, bits, nonce. A block with a broken structure is rejected immediately.',
     val:'version=536870916, size=1,247,832 bytes — ok'},
    {icon:'⛏️',title:'2. Proof-of-Work valid',
     desc:'The hash of the block header must be below the current difficulty target. It can’t be faked without expending real energy. This check is the fastest and is done first.',
     val:'hash: 00000000000000000001a4b... < target: 0000000000000000000395... — VALID'},
    {icon:'🔗',title:'3. previousblockhash matches',
     desc:'The previousblockhash field must match the hash of the latest block the node has validated. This is what makes the blockchain impossible to change without recomputing the entire chain.',
     val:'00000000000000000002f... — matches tip #870141 ✓'},
    {icon:'🕐',title:'4. Timestamp within the allowed range',
     desc:'The timestamp must be greater than the Median Time Past (MTP) of the last 11 blocks, and no more than 2 hours in the future. This prevents time manipulation by miners.',
     val:'time=1717459200 > MTP=1717456800, delta from now=+12s — ok'},
    {icon:'📏',title:'5. Block size doesn’t exceed the limit',
     desc:'The total block weight may not exceed 4,000,000 weight units. Non-witness data counts 4x heavier than witness data.',
     val:'3,998,832 weight units < 4,000,000 limit — ok (99.97% full)'},
    {icon:'🪙',title:'6. Coinbase transaction valid',
     desc:'The reward claimed by the miner may not exceed the block subsidy plus the total fees of all transactions. A miner who overclaims will be rejected by the entire network.',
     val:'coinbase: 3.25437891 BTC = subsidy(3.125) + fees(0.12937891) — ok'},
    {icon:'🌳',title:'7. Merkle root matches all transactions',
     desc:'The node recomputes the merkle root from all txids and compares it with the one in the header. One manipulated transaction will change the merkle root entirely.',
     val:'merkle root: 4a5e1e4b... — matches 3,847 transactions ✓'},
    {icon:'✍️',title:'8. All transaction signatures valid',
     desc:'For every transaction input, the node runs the Bitcoin script and verifies the cryptographic signature. The most CPU-intensive part, run in parallel across all cores.',
     val:'3,847 tx, 12,341 inputs — all signatures valid ✓'},
  ];

  let step=-1;

  // Build checklist
  (function(){
    const el=g('b16-s162-checklist');if(!el) return;
    CHECKS.forEach((c,i)=>{
      const div=document.createElement('div');
      div.className='b16-s162-check';div.id=`s162c${i}`;
      div.innerHTML=`<div class="b16-s162-check-icon">${c.icon}</div>
        <div class="b16-s162-check-body">
          <div class="b16-s162-check-title">${c.title}</div>
          <div class="b16-s162-check-desc">${c.desc}</div>
          <div class="b16-s162-check-val" id="s162v${i}">${c.val}</div>
        </div>`;
      el.appendChild(div);
    });
  })();

  function updateVerdict(){
    const ind=g('b16-s162-ind'),verd=g('b16-s162-verdict'),btn=g('b16-s162-next');
    if(ind) ind.textContent=`${Math.max(0,step+1)} / ${CHECKS.length} checks`;
    if(btn) btn.disabled=step>=CHECKS.length-1;
    if(verd){
      if(step<0){verd.className='b16-s162-verdict s162-idle';verd.textContent='Click "Next Verification" — the node just received block #870,142 from a peer.';}
      else if(step<CHECKS.length-1){verd.className='b16-s162-verdict s162-prog';verd.textContent=`Checking: ${CHECKS[step].title.replace(/^\d+\. /,'')}`;}
      else{verd.className='b16-s162-verdict s162-ok';verd.textContent='All 8 checks pass. Block #870,142 is accepted and added to the local chain. The node forwards this block to other peers.';}
    }
  }

  const nextBtn=g('b16-s162-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{
    if(step<CHECKS.length-1){
      step++;
      const c=g(`s162c${step}`);if(c) c.className='b16-s162-check s162-done';
      updateVerdict();
    }
  });
  const rstBtn=g('b16-s162-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    step=-1;
    CHECKS.forEach((_,i)=>{const c=g(`s162c${i}`);if(c) c.className='b16-s162-check';});
    updateVerdict();
  });
  updateVerdict();

  // RPC data
  const CMDS=[
    {id:'getblockcount',code:'bitcoin-cli getblockcount',hint:'The current block count',
     output:[['870142','s162-tnum']],
     fields:[{k:'output',v:'870142',d:'A direct integer — the number of validated blocks. The genesis block = 0, so a total of 870,143 blocks in the chain.'}],
     note:'The lightest command to check the chain height. The output is a plain integer, not JSON. No wallet connection required.'},
    {id:'getbestblockhash',code:'bitcoin-cli getbestblockhash',hint:'The latest block hash',
     output:[['"00000000000000000001a4b2c8d9e7f3a6b5c4d1e2f0a9b8c7d6e5f4a3b2c1d0"','s162-tstr']],
     fields:[{k:'output',v:'"00000...c1d0"',d:'The 256-bit hash of the current block tip. Use this hash as the getblock argument to see block details.'}],
     note:'A block hash always starts with many zeros because of proof-of-work. The more leading zeros, the greater the difficulty required.'},
    {id:'getblock',code:'bitcoin-cli getblock "00000...a4b" 1',hint:'Full block details',
     output:[
       ['{','s162-tgray'],
       ['  "hash":              ','s162-tblue'],['"00000000000000000001a4b..."','s162-tstr'],[',','s162-tgray'],
       ['  "confirmations":     ','s162-tblue'],['1','s162-tnum'],[',','s162-tgray'],
       ['  "height":            ','s162-tblue'],['870142','s162-tnum'],[',','s162-tgray'],
       ['  "merkleroot":        ','s162-tblue'],['"4a5e1e4baab89f3a2f143..."','s162-tstr'],[',','s162-tgray'],
       ['  "time":              ','s162-tblue'],['1717459200','s162-tnum'],[',','s162-tgray'],
       ['  "mediantime":        ','s162-tblue'],['1717456800','s162-tnum'],[',','s162-tgray'],
       ['  "nonce":             ','s162-tblue'],['3826969040','s162-tnum'],[',','s162-tgray'],
       ['  "bits":              ','s162-tblue'],['"17034219"','s162-tstr'],[',','s162-tgray'],
       ['  "difficulty":        ','s162-tblue'],['88171509232073.27','s162-tnum'],[',','s162-tgray'],
       ['  "nTx":               ','s162-tblue'],['3847','s162-tnum'],[',','s162-tgray'],
       ['  "weight":            ','s162-tblue'],['3998832','s162-tnum'],[',','s162-tgray'],
       ['  "previousblockhash": ','s162-tblue'],['"00000000000000000002f..."','s162-tstr'],[',','s162-tgray'],
       ['  "tx": [ ... ]        ','s162-tcm'],['  # 3847 txids','s162-tcm'],
       ['}','s162-tgray'],
     ],
     fields:[
       {k:'"confirmations"',v:'1',d:'How many blocks have been built on top of this block. The latest block = 1. Increases each time a new block is found.'},
       {k:'"nTx"',v:'3847',d:'The number of transactions in the block, including the coinbase as the first transaction.'},
       {k:'"weight"',v:'3998832',d:'The total weight in weight units. Maximum 4,000,000. This block is 99.97% full.'},
       {k:'"nonce"',v:'3826969040',d:'The number the miner varies while mining. Range 0-4,294,967,295.'},
       {k:'"bits"',v:'"17034219"',d:'The difficulty target in compact format. Converted to 256-bit to compare with the block hash.'},
     ],
     note:'Verbosity 1 = all txids without transaction details. Verbosity 2 = full detail of every transaction (very large output). Verbosity 0 = raw hex block.'},
    {id:'verifychain',code:'bitcoin-cli verifychain 3 6',hint:'Verify chain integrity',
     output:[['true','s162-tbt']],
     fields:[
       {k:'param 1: checklevel',v:'3',d:'0=read block, 1=undo data, 2=validate, 3=disconnect & reconnect tip, 4=reconnect all blocks.'},
       {k:'param 2: nblocks',v:'6',d:'The number of blocks checked from the tip backwards. A value of 0 = check all (very slow).'},
       {k:'output: true',v:'true',d:'All checks pass. false means the database is corrupt and needs a reindex.'},
     ],
     note:'Useful after a crash or sudden shutdown to ensure the node’s database isn’t corrupt. Checklevel 3 with 6 blocks is a good balance between speed and accuracy.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s162-cmd').forEach(b=>{
      b.classList.toggle('s162-act', b.dataset.id===cmdId);
    });
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;

    const body=g('b16-s162-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s162-tgreen">satoshi@node</span><span class="s162-tgray">:~$</span> <span class="s162-twhite"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([txt,cls])=>{const s=document.createElement('span');s.className=cls;s.textContent=txt;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([txt,cls])=>{
      buf.push([txt,cls]);
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||cls==='s162-tcm'||t.endsWith(',')) flush();
    });
    flush();

    const fe=g('b16-s162-fe'),fei=g('b16-s162-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s162-field';
        row.innerHTML=`<div class="b16-s162-fk">${f.k}</div><div class="b16-s162-fv">${f.v}</div><div class="b16-s162-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s162-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  // Build command buttons
  (function(){
    const el=g('b16-s162-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s162-cmd'+(i===0?' s162-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s162-cmd-code">${c.code}</div><div class="b16-s162-cmd-hint">${c.hint}</div><div class="b16-s162-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  // Tabs
  const t1=g('b16-s162-t1'),t2=g('b16-s162-t2');
  const p1=g('b16-s162-p1'),p2=g('b16-s162-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s162-tab s162-act';t2.className='b16-s162-tab';
    p1.className='b16-s162-pane show';p2.className='b16-s162-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s162-tab s162-act';t1.className='b16-s162-tab';
    p2.className='b16-s162-pane show';p1.className='b16-s162-pane';
    runRPC(currentCmd);
  });

  // Init
  runRPC('getblockcount');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.1 SIMULATION (RPC Terminal IBD)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let currentCmd='getblockchaininfo';

  const OUTPUTS={
    getblockchaininfo:{
      cmd:'bitcoin-cli getblockchaininfo',
      lines:[
        ['{','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "bestblockhash"','jkey'],[': ','jpunc'],['"00000000000000000001a4b..."','jstr'],[',','jpunc'],
        ['  "difficulty"','jkey'],[': ','jpunc'],['88171509232073.27','jnum'],[',','jpunc'],
        ['  "time"','jkey'],[': ','jpunc'],['1717459200','jnum'],[',','jpunc'],
        ['  "mediantime"','jkey'],[': ','jpunc'],['1717456800','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['0.9999982341','jnum'],[',','jpunc'],
        ['  "chainwork"','jkey'],[': ','jpunc'],['"00000000000000000000000000000000000000007b4e..."','jstr'],[',','jpunc'],
        ['  "pruned"','jkey'],[': ','jpunc'],['false','jbfalse'],[',','jpunc'],
        ['  "initialblockdownload"','jkey'],[': ','jpunc'],['false','jbfalse'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"chain"',val:'"main"',desc:'The network being run: main (mainnet), test (testnet), signet, or regtest.',hl:false},
        {key:'"blocks"',val:'870142',desc:'The number of fully validated blocks. If equal to "headers", the node is synced.',hl:true},
        {key:'"headers"',val:'870142',desc:'The number of known block headers. Larger than "blocks" while still in IBD.',hl:true},
        {key:'"verificationprogress"',val:'0.9999982341',desc:'Sync progress from 0 to 1. A value of 1.0 means the node is fully synced with the latest chain.',hl:true},
        {key:'"initialblockdownload"',val:'false',desc:'true = still in IBD, not yet reliable. false = synced and ready to use.',hl:true},
        {key:'"difficulty"',val:'88171509232073',desc:'The current mining difficulty. The higher it is, the more hashes are needed per block.',hl:false},
        {key:'"mediantime"',val:'1717456800',desc:'The Median Time Past (MTP) of the last 11 blocks. Used by the protocol to validate timelocks.',hl:false},
        {key:'"chainwork"',val:'"00000...7b4e"',desc:'The total accumulated proof-of-work in hex format. This determines which chain is the heaviest.',hl:false},
        {key:'"pruned"',val:'false',desc:'true = pruning mode active (old blocks deleted). false = a full archival node.',hl:false},
      ],
      note:'This command is the fastest way to check whether the node is synced. If "initialblockdownload" is still true, don’t use this node to verify payments.',
    },
    getinfo:{
      cmd:'bitcoin-cli -getinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['"99.9998%"','jstr'],[',','jpunc'],
        ['  "timeoffset"','jkey'],[': ','jpunc'],['0','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['{','jpunc'],
        ['    "in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['    "out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['    "total"','jkey'],[': ','jpunc'],['18','jnum'],
        ['  }','jpunc'],[',','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"version"',val:'270000',desc:'The client software version running. 270000 = version 27.0.0.',hl:false},
        {key:'"blocks"',val:'870142',desc:'The last validated block.',hl:true},
        {key:'"verificationprogress"',val:'"99.9998%"',desc:'Sync progress in an easy-to-read percentage format.',hl:true},
        {key:'"connections"',val:'{in:8, out:10}',desc:'The number of inbound and outbound connections. At least 8 outbound for optimal security.',hl:true},
        {key:'"timeoffset"',val:'0',desc:'The time difference between the node’s clock and network time. Ideally 0 or very small.',hl:false},
        {key:'"relayfee"',val:'0.00001000',desc:'The minimum fee rate this node will relay (in BTC/kB). Transactions below this won’t be forwarded.',hl:false},
      ],
      note:'The -getinfo flag (with a leading minus) gives a shorter, easier-to-read summary. No wallet connection is needed for this command.',
    },
    getpeerinfo_sync:{
      cmd:'bitcoin-cli getpeerinfo | grep -E \'"addr"|"synced_blocks"\'',
      lines:[
        ['# Peer 1','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"203.0.113.42:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 2','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"198.51.100.17:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870140','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 3 (Tor)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"mj3urq...onion:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 4 (lagging)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"192.0.2.88:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['869998','jnum'],
      ],
      fields:[
        {key:'"addr"',val:'"203.0.113.42:8333"',desc:'The peer’s IP address and port. Port 8333 is the default Bitcoin mainnet port. An .onion address means the peer is connected via Tor.',hl:false},
        {key:'"synced_blocks"',val:'870142',desc:'The last block this peer is known to have validated. If equal to your node’s blocks, this peer is also fully synced.',hl:true},
        {key:'Peer with 869998',val:'144 blocks behind',desc:'The client node automatically prioritizes downloading from more up-to-date peers. A peer far behind is deprioritized.',hl:true},
      ],
      note:'During IBD, the client software downloads blocks in parallel from many peers at once. This command is useful to ensure you’re connected to synced peers.',
    },
    getnetworkinfo:{
      cmd:'bitcoin-cli getnetworkinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "subversion"','jkey'],[': ','jpunc'],['"\/Satoshi:27.0.0\/"','jstr'],[',','jpunc'],
        ['  "protocolversion"','jkey'],[': ','jpunc'],['70016','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['18','jnum'],[',','jpunc'],
        ['  "connections_in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['  "connections_out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['  "networkactive"','jkey'],[': ','jpunc'],['true','jbtrue'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],[',','jpunc'],
        ['  "localaddresses"','jkey'],[': ','jpunc'],['[','jpunc'],
        ['    { "address": "203.0.113.100", "port": 8333, "score": 4 }','jpunc'],
        ['  ]','jpunc'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"subversion"',val:'"/Satoshi:27.0.0/"',desc:'The user agent sent to other peers during the handshake. This is what other peers see as your software’s "identity".',hl:false},
        {key:'"protocolversion"',val:'70016',desc:'The Bitcoin P2P protocol version. Determines which features can be communicated between nodes.',hl:true},
        {key:'"connections_in"',val:'8',desc:'Peers actively connected to your node. Only possible if port 8333 is open and reachable from the internet.',hl:true},
        {key:'"connections_out"',val:'10',desc:'Peers your node connects to. Outbound connections are safer because you choose the peers.',hl:true},
        {key:'"networkactive"',val:'true',desc:'false means the node is in offline mode — not receiving or sending data to any peer.',hl:false},
        {key:'"localaddresses"',val:'"203.0.113.100:8333"',desc:'The public IP address advertised to the network. If empty, the node can’t accept inbound connections.',hl:false},
      ],
      note:'A node with connections_in > 0 is reachable from the internet and helps the network as a relay. A node with only outbound connections can still verify transactions safely.',
    },
  };

  function renderTerminal(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const body=g('b16-s161-body');if(!body) return;
    body.innerHTML='';

    // Prompt
    const prompt=document.createElement('div');
    prompt.className='b16-s161-prompt';
    prompt.innerHTML=`<span class="b16-s161-prompt-user">satoshi@node</span>:~$ <span class="b16-s161-cmd-line">${data.cmd}</span>`;
    body.appendChild(prompt);

    // JSON output
    const out=document.createElement('div');
    out.className='b16-s161-output';

    // Group tokens into lines
    let lineTokens=[];
    const flushLine=()=>{
      if(!lineTokens.length) return;
      const lineEl=document.createElement('div');
      lineEl.className='b16-s161-json-line';
      lineTokens.forEach(([txt,cls])=>{
        const span=document.createElement('span');
        span.className=`b16-s161-${cls}`;
        span.textContent=txt;
        lineEl.appendChild(span);
      });
      out.appendChild(lineEl);
      lineTokens=[];
    };

    data.lines.forEach(([txt,cls])=>{
      if(txt===''&&cls==='jpunc'){flushLine();out.appendChild(document.createElement('br'));return;}
      lineTokens.push([txt,cls]);
      // End line after: standalone { } [ ] , or comment
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||t==='['||t===']'||cls==='jcomment'){flushLine();}
    });
    flushLine();
    body.appendChild(out);
  }

  function renderExplain(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const el=g('b16-s161-explain');
    const fields=g('b16-s161-fields');
    const note=g('b16-s161-note');
    if(el) el.style.display='flex';
    if(note){note.style.display='block';note.textContent=data.note;}
    if(!fields) return;
    fields.innerHTML='';
    data.fields.forEach(f=>{
      const row=document.createElement('div');
      row.className='b16-s161-field'+(f.hl?' s161-hl':'');
      row.innerHTML=`
        <div class="b16-s161-field-key">${f.key}</div>
        <div class="b16-s161-field-desc">${f.desc}</div>
        <div class="b16-s161-field-val">${f.val}</div>`;
      fields.appendChild(row);
    });
  }

  function run(){
    renderTerminal(currentCmd);
    renderExplain(currentCmd);
  }

  // Command buttons
  document.querySelectorAll('.b16-s161-cmd-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b16-s161-cmd-btn').forEach(b=>b.classList.remove('s161-act'));
      btn.classList.add('s161-act');
      currentCmd=btn.dataset.cmd;
    });
  });

  const runBtn=g('b16-s161-run');
  if(runBtn) runBtn.addEventListener('click',run);

  // Init
  run();
})();

// ============================================================
// PAGE 20 · BAB 17 · NAVIGATION
// ============================================================
function showSectionInContentB17(sectionId, sbId) {
  document.querySelectorAll('#page-bab17 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab17 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab17-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 20 · BAB 17 · TOPBAR
// ============================================================
document.getElementById('back-home-b17').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b17').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 20 · BAB 17 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab17').addEventListener('click', () => navigate('page-bab17'));

// ============================================================
// PAGE 20 · BAB 17 · SIDEBAR EVENTS (17.1 - 17.6)
// ============================================================
document.getElementById('sb-17-1').addEventListener('click', () => showSectionInContentB17('section-17-1', 'sb-17-1'));
document.getElementById('sb-17-2').addEventListener('click', () => showSectionInContentB17('section-17-2', 'sb-17-2'));
document.getElementById('sb-17-3').addEventListener('click', () => showSectionInContentB17('section-17-3', 'sb-17-3'));
document.getElementById('sb-17-4').addEventListener('click', () => showSectionInContentB17('section-17-4', 'sb-17-4'));
document.getElementById('sb-17-5').addEventListener('click', () => showSectionInContentB17('section-17-5', 'sb-17-5'));
document.getElementById('sb-17-6').addEventListener('click', () => showSectionInContentB17('section-17-6', 'sb-17-6'));

// ============================================================
// PAGE 20 · BAB 17 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab17 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB17(target, sb);
  });
});

// ============================================================
// PAGE 20 · BAB 17 · 17.6 SIMULATION (Light Client Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const WALLETS=[
    {
      id:'fullnode',icon:'🖥️',name:'Full Node (Bitcoin Core / Knots)',model:'Full verification — download all blocks',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privacy: Maximal',trustBadge:'s176-trust-zero',trustLabel:'Trust: Zero',
      subtitle:'Baseline — full verification with no trust assumptions',
      desc:'A full node downloads, verifies, and stores the entire blockchain. Every transaction, every signature, every consensus rule is verified independently. This is the gold standard of Bitcoin verification — no need to trust anyone, because you verify it yourself.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'Download + verify all blocks since genesis'},
        {cls:'s176-good',label:'Privacy',val:'No third party knows your addresses or transactions'},
        {cls:'s176-ok',  label:'Storage',val:'~650 GB (full) or ~550 MB minimum (pruned)'},
        {cls:'s176-ok',  label:'Setup time',val:'4-72 hours IBD depending on hardware and sync method'},
      ],
      forwho:['Developers who need full access to the blockchain','Merchants who receive large-value payments','Anyone who wants full self-verification without trust','Lightning node operators who need full verification'],
      tradeoff:'The main trade-off: it requires decent hardware (at least 2 GB RAM, 650 GB+ storage) and a long setup time. For ordinary users, this can be too heavy. But it’s the only way to be truly zero trust.',
    },
    {
      id:'electrum_own',icon:'⚡',name:'Electrum — Server Sendiri',model:'Server query + Electrum protocol',
      wc:'#0F6E56',wb:'#EAF3DE',privBadge:'s176-priv-high',privLabel:'Privacy: High',trustBadge:'s176-trust-low',trustLabel:'Trust: Your server',
      subtitle:'SPV hybrid — fast queries to a server you control yourself',
      desc:'Electrum is a popular Bitcoin wallet since 2011. Instead of pure SPV, Electrum connects to an Electrum server that has already processed the blockchain. By running your own Electrum server on top of a full node, you get Electrum’s query speed with full-node-level privacy.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'Query to an Electrum server (SPV hybrid)'},
        {cls:'s176-good',label:'Privacy (own server)',val:'The server is yours — no third party'},
        {cls:'s176-good',label:'Speed',val:'Very fast — the server has already indexed the blockchain'},
        {cls:'s176-ok',  label:'Complexity',val:'Requires running an Electrum server + full node'},
      ],
      forwho:['Users who need full transaction history without a full node on the client','Developers who want a fast wallet with high privacy','Users who already have a full node and want to add Electrum'],
      tradeoff:'Trade-off: running your own Electrum server is fairly complex and needs a full node underneath. If you don’t want to manage a server, this option is less practical.',
    },
    {
      id:'neutrino',icon:'🔮',name:'Neutrino — Pure BIP 157/158',model:'Compact block filters — truly private SPV',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privacy: Good',trustBadge:'s176-trust-low',trustLabel:'Trust: Majority honest',
      subtitle:'A pure BIP 157/158 implementation — used by Phoenix, Breez, and lnd',
      desc:'Neutrino is a Bitcoin light client in Go developed by Lightning Labs. It fully implements BIP 157/158 (compact block filters). Neutrino is used as the backend for Phoenix Wallet, Breez, and lnd in light mode.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'BIP 157/158 compact block filters — the client filters itself'},
        {cls:'s176-good',label:'Privacy',val:'The node doesn’t know the address being searched — far better than BIP 37'},
        {cls:'s176-ok',  label:'Bandwidth',val:'~500 MB - 2 GB to download all filters (total)'},
        {cls:'s176-good',label:'Suitable for',val:'Mobile wallets + lightweight Lightning Network nodes'},
      ],
      forwho:['Lightning Network mobile users (Phoenix, Breez)','Developers who need a light client with good privacy','Users who don’t want a full node but care about privacy'],
      tradeoff:'Trade-off: it needs more bandwidth than BIP 37 because it has to download all filters. But the privacy gained is far better. The initial sync time is longer than an ordinary wallet.',
    },
    {
      id:'electrum_pub',icon:'⚡',name:'Electrum — Public Server',model:'Server query to a server managed by someone else',
      wc:'#854F0B',wb:'#FAEEDA',privBadge:'s176-priv-med',privLabel:'Privacy: Medium',trustBadge:'s176-trust-med',trustLabel:'Trust: Server operator',
      subtitle:'The default Electrum option — fast but the server knows your addresses',
      desc:'If you use Electrum without running your own server, Electrum connects to a public server run by the community or a company. This server knows the addresses you query, your balance, and the transactions you make. Still far better than a custodial exchange, but not a zero-trust solution.',
      specs:[
        {cls:'s176-ok',  label:'Verification model',val:'Query to a public server — fast but there’s trust'},
        {cls:'s176-ok',  label:'Privacy',val:'The server operator knows your addresses and transactions'},
        {cls:'s176-good',label:'Ease of use',val:'Ready to use right away — no extra setup needed'},
        {cls:'s176-good',label:'Speed',val:'Very fast — the server has already indexed the blockchain'},
      ],
      forwho:['New users just getting to know self-custody','Users who need a fast wallet without managing a server','Everyday transactions of not-too-large value'],
      tradeoff:'The main trade-off: the server operator knows your addresses. To improve privacy, use Tor when connecting to a public Electrum server, or consider switching to your own server.',
    },
    {
      id:'mobile',icon:'📱',name:'Ordinary Mobile Wallet',model:'Backend server — not real SPV',
      wc:'#A32D2D',wb:'#FCEBEB',privBadge:'s176-priv-low',privLabel:'Privacy: Low',trustBadge:'s176-trust-high',trustLabel:'Trust: Wallet developer',
      subtitle:'Trust Wallet, Exodus, and most popular mobile wallets',
      desc:'Many mobile wallets that claim "SPV" actually connect to a backend server controlled by that wallet’s developer. They don’t download the header chain or do any PoW verification at all — they just query the developer’s server API. This is custodial-lite: you hold the private key but verification is done by someone else.',
      specs:[
        {cls:'s176-warn',label:'Verification model',val:'Query to the developer’s server — not real SPV'},
        {cls:'s176-warn',label:'Privacy',val:'The developer knows all your addresses, balance, and transactions'},
        {cls:'s176-good',label:'Ease of use',val:'Very easy — install and use right away'},
        {cls:'s176-warn',label:'Trust',val:'You have to trust the wallet developer not to lie about the balance'},
      ],
      forwho:['New users just starting to learn Bitcoin','Small amounts for everyday transactions','Users not yet ready to manage any infrastructure'],
      tradeoff:'Trade-off: very easy to use but privacy is very low and you have to trust the developer. For large amounts or users who care about privacy, consider switching to Electrum or Neutrino.',
    },
  ];

  let current='fullnode';

  function renderWallets(){
    const el=g('b17-s176-wallets');if(!el) return;
    el.innerHTML='';
    WALLETS.forEach(w=>{
      const div=document.createElement('div');
      div.className='b17-s176-wallet'+(w.id===current?' s176-act':'');
      div.style.cssText=`--wc:${w.wc};--wb:${w.wb};`;
      div.dataset.id=w.id;
      div.innerHTML=`<div class="b17-s176-wallet-icon">${w.icon}</div>
        <div class="b17-s176-wallet-body">
          <div class="b17-s176-wallet-name">${w.name}</div>
          <div class="b17-s176-wallet-model">${w.model}</div>
        </div>
        <div class="b17-s176-badges">
          <div class="b17-s176-badge ${w.privBadge}">${w.privLabel}</div>
          <div class="b17-s176-badge ${w.trustBadge}">${w.trustLabel}</div>
        </div>`;
      div.addEventListener('click',()=>{current=w.id;renderWallets();renderDetail();});
      el.appendChild(div);
    });
  }

  function renderDetail(){
    const el=g('b17-s176-detail');if(!el) return;
    const w=WALLETS.find(x=>x.id===current);if(!w) return;
    el.innerHTML='';

    const head=document.createElement('div');head.className='b17-s176-detail-head';
    head.innerHTML=`<div class="b17-s176-detail-icon">${w.icon}</div>
      <div class="b17-s176-detail-body">
        <div class="b17-s176-detail-name">${w.name}</div>
        <div class="b17-s176-detail-subtitle">${w.subtitle}</div>
        <div class="b17-s176-detail-badges">
          <div class="b17-s176-badge ${w.privBadge}">${w.privLabel}</div>
          <div class="b17-s176-badge ${w.trustBadge}">${w.trustLabel}</div>
        </div>
      </div>`;
    el.appendChild(head);

    const desc=document.createElement('div');desc.className='b17-s176-detail-desc';
    desc.textContent=w.desc;el.appendChild(desc);

    const specs=document.createElement('div');specs.className='b17-s176-specs';
    w.specs.forEach(s=>{
      const div=document.createElement('div');div.className=`b17-s176-spec ${s.cls}`;
      div.innerHTML=`<div class="b17-s176-spec-label">${s.label}</div><div class="b17-s176-spec-val">${s.val}</div>`;
      specs.appendChild(div);
    });
    el.appendChild(specs);

    const fw=document.createElement('div');fw.className='b17-s176-forwho';
    fw.innerHTML=`<div class="b17-s176-forwho-label">Suitable for:</div>
      ${w.forwho.map(t=>`<div class="b17-s176-forwho-item">${t}</div>`).join('')}`;
    el.appendChild(fw);

    const to=document.createElement('div');to.className='b17-s176-tradeoff';
    to.innerHTML=`<div class="b17-s176-tradeoff-label">Main trade-off:</div>${w.tradeoff}`;
    el.appendChild(to);
  }

  renderWallets();renderDetail();
})();

// ============================================================
// PAGE 20 · BAB 17 · 17.5 SIMULATION (Attack Scenarios)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const SCENARIOS={
    eclipse:{
      color:'s175-red',label:'Most Realistic Scenario',title:'Eclipse Attack',
      text:'The attacker isolates the SPV client from the honest network by controlling all peer connections. From this position, the attacker can hide incoming transactions, show a different chain, or censor outgoing transactions. To succeed, the attacker needs to control all of the client’s network connections, which isn’t easy but isn’t impossible, especially for a mobile client on a network controlled by a malicious ISP.',
      metrics:[
        {cls:'s175-mred',label:'Difficulty level',val:'Medium',sub:'Requires control over the client’s network connections'},
        {cls:'s175-mamber',label:'Attacker cost',val:'Moderate',sub:'Network infrastructure + target identification'},
        {cls:'s175-mamber',label:'Potential impact',val:'Significant',sub:'Can hide/manipulate the tx the client sees'},
      ],
      can:['Hide incoming transactions from SPV','Show a shorter alternative chain','Censor outgoing transactions to the network','Make SPV think a payment isn’t confirmed yet'],
      cannot:['Steal bitcoin from the client’s wallet','Reverse a transaction already on the main chain','Deceive a full node connected to the honest network','Do this without controlling the client’s connections'],
      mitigations:[
        {icon:'🌐',text:'Connect to several different nodes — the attacker must control ALL connections for an eclipse to succeed.'},
        {icon:'🧅',text:'Use Tor or a VPN to make it harder for the attacker to identify and isolate you.'},
        {icon:'🖥️',text:'Connect to your own full node — if you run your own node, an eclipse is far harder.'},
      ],
    },
    doublespend:{
      color:'s175-amber',label:'Expensive & Rare Scenario',title:'Double Spend Attack',
      text:'The attacker pays a merchant with a Bitcoin transaction, waits for the merchant to ship the goods after seeing the confirmation on a fake chain, then reverses the transaction by publishing a longer alternative chain. To deceive SPV, the attacker needs an eclipse attack AND to produce an alternative chain with more proof-of-work than the main chain. This is very expensive.',
      metrics:[
        {cls:'s175-mred',label:'Difficulty level',val:'Very High',sub:'Requires significant hashrate + an eclipse attack'},
        {cls:'s175-mred',label:'Attacker cost',val:'Very Expensive',sub:'Mining equipment + electricity + network control'},
        {cls:'s175-mamber',label:'When is it worth it?',val:'Large value',sub:'Only worth it for very high-value transactions'},
      ],
      can:['Reverse a tx if the eclipse succeeds + has hashrate','Deceive SPV that only waits for few confirmations','Make SPV see an alternative chain as valid'],
      cannot:['Do this without enormous hashrate','Deceive SPV that waits for many confirmations','Deceive a full node connected to the main chain','Forge a signature to steal from another wallet'],
      mitigations:[
        {icon:'⏳',text:'Wait for more confirmations for large values. 6 confirmations = the attacker needs to redo ~6 blocks with competitive hashrate.'},
        {icon:'💰',text:'For very high-value transactions (>1 BTC), consider using a full node for verification.'},
        {icon:'👁️',text:'Check whether the chain you see is consistent with a public explorer before shipping goods.'},
      ],
    },
    invalid:{
      color:'s175-green',label:'Nearly Impossible Scenario',title:'Invalid Block Attack',
      text:'The attacker tries to make SPV accept a block that violates Bitcoin’s consensus rules, for example a block that creates more bitcoin than it should. SPV still verifies the proof-of-work of every header, so the attacker has to spend real energy to create a valid header. But SPV doesn’t fully verify the block contents, so a block with an invalid transaction can slip through if no full node rejects it.',
      metrics:[
        {cls:'s175-mgreen',label:'Difficulty level',val:'Extreme',sub:'Requires an eclipse + hashrate + no full node detecting it'},
        {cls:'s175-mgreen',label:'Network protection',val:'Strong',sub:'Full nodes across the network will reject an invalid block'},
        {cls:'s175-mgreen',label:'Practical risk',val:'Very Low',sub:'Almost never happens on the real Bitcoin network'},
      ],
      can:['Create a block with valid PoW but invalid contents (if the eclipse succeeds)','Hide a block rejection from an isolated SPV'],
      cannot:['Deceive the broad network — full nodes will reject an invalid block','Do this without isolating SPV from all honest full nodes','Forge PoW without expending enormous energy','Create a valid transaction without the matching private key'],
      mitigations:[
        {icon:'🖥️',text:'Full nodes reject an invalid block automatically. The more full nodes on the network, the stronger this protection.'},
        {icon:'🔗',text:'A healthy Bitcoin network with thousands of full nodes makes this attack practically almost impossible.'},
        {icon:'📡',text:'An SPV connected to several independent nodes is very hard to fully isolate from the honest network.'},
      ],
    },
  };

  function renderDetail(id){
    const s=SCENARIOS[id];if(!s) return;
    const el=g('b17-s175-detail');if(!el) return;
    el.innerHTML='';

    const head=document.createElement('div');
    head.className=`b17-s175-detail-head ${s.color}`;
    head.innerHTML=`<div class="b17-s175-detail-label">${s.label}</div>
      <div class="b17-s175-detail-title">${s.title}</div>
      <div class="b17-s175-detail-text">${s.text}</div>`;
    el.appendChild(head);

    const metrics=document.createElement('div');metrics.className='b17-s175-metrics';
    s.metrics.forEach(m=>{
      const div=document.createElement('div');div.className=`b17-s175-metric ${m.cls}`;
      div.innerHTML=`<div class="b17-s175-metric-label">${m.label}</div>
        <div class="b17-s175-metric-val">${m.val}</div>
        <div class="b17-s175-metric-sub">${m.sub}</div>`;
      metrics.appendChild(div);
    });
    el.appendChild(metrics);

    const candoWrap=document.createElement('div');candoWrap.className='b17-s175-cando-wrap';
    const cantEl=document.createElement('div');cantEl.className='b17-s175-cando s175-cant';
    cantEl.innerHTML=`<div class="b17-s175-cando-label">The attacker CAN:</div>${s.can.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    const canEl=document.createElement('div');canEl.className='b17-s175-cando s175-can';
    canEl.innerHTML=`<div class="b17-s175-cando-label">The attacker CANNOT:</div>${s.cannot.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    candoWrap.appendChild(cantEl);candoWrap.appendChild(canEl);
    el.appendChild(candoWrap);

    const mitWrap=document.createElement('div');mitWrap.className='b17-s175-mitigations';
    const mitLabel=document.createElement('div');mitLabel.className='b17-s175-mit-label';mitLabel.textContent='Mitigation:';
    mitWrap.appendChild(mitLabel);
    s.mitigations.forEach(m=>{
      const div=document.createElement('div');div.className='b17-s175-mit';
      div.innerHTML=`<div class="b17-s175-mit-icon">${m.icon}</div><div class="b17-s175-mit-text">${m.text}</div>`;
      mitWrap.appendChild(div);
    });
    el.appendChild(mitWrap);
  }

  const scenariosEl=g('b17-s175-scenarios');
  if(scenariosEl) scenariosEl.querySelectorAll('.b17-s175-scenario').forEach(btn=>{
    btn.addEventListener('click',()=>{
      scenariosEl.querySelectorAll('.b17-s175-scenario').forEach(b=>{
        b.className=`b17-s175-scenario ${b.dataset.id==='eclipse'?'s175-red':b.dataset.id==='doublespend'?'s175-amber':'s175-green'}`;
      });
      const col=btn.dataset.id==='eclipse'?'s175-red':btn.dataset.id==='doublespend'?'s175-amber':'s175-green';
      btn.classList.add('s175-act',col);
      renderDetail(btn.dataset.id);
    });
  });

  const confData=[
    {max:0, cls:'s175-conf-warn', txt:'0 confirmations (unconfirmed): RISKY. The transaction isn’t in a block at all. Very easy to double spend. Don’t accept it for any value.'},
    {max:1, cls:'s175-conf-ok',   txt:'1 confirmation: Enough for small everyday values (buying coffee, top-ups). The double-spend cost is still relatively low, but for small amounts it’s not worth it for an attacker.'},
    {max:3, cls:'s175-conf-ok',   txt:'2-3 confirmations: Safe enough for most transactions. A double spend requires the attacker to produce 2-3 competitive blocks — expensive for average values.'},
    {max:6, cls:'s175-conf-safe', txt:'4-6 confirmations: The industry standard. Very safe for almost all transactions. The double-spend cost already far exceeds any realistic value to attack.'},
    {max:12,cls:'s175-conf-safe', txt:'7-12 confirmations: For very high-value transactions. At this point, even an attacker with significant hashrate can’t economically do a double spend.'},
  ];

  const sl=g('b17-s175-conf-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b17-s175-conf-val');const res=g('b17-s175-conf-result');
    if(vEl) vEl.textContent=v===1?'1 confirmation':`${v} confirmations`;
    if(res){
      const d=confData.find(c=>v<=c.max)||confData[confData.length-1];
      res.className=`b17-s175-conf-result ${d.cls}`;res.textContent=d.txt;
    }
  });

  renderDetail('eclipse');
})();

// ============================================================
// PAGE 20 · BAB 17 · 17.4 SIMULATION (BIP 157/158)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const IN_BLOCK=['bc1q...alice','bc1q...bob','3J98t...carol','bc1p...dave','1BvB...miner','bc1q...exchange','3Kzh...pool'];
  const FALSE_POSITIVES=['1abc...unknown'];
  const NOT_IN_BLOCK=['bc1q...stranger','1abc...unknown','bc1p...nobody'];
  const ALL_ADDRS=[...IN_BLOCK,...NOT_IN_BLOCK];

  const el=g('b17-s174-gcs-btns');
  if(el){
    ALL_ADDRS.forEach(addr=>{
      const btn=document.createElement('button');
      btn.className='b17-s174-gcs-btn';
      btn.textContent=addr;
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.b17-s174-gcs-btn').forEach(b=>b.classList.remove('s174-match'));
        btn.classList.add('s174-match');
        const res=g('b17-s174-gcs-result');if(!res) return;
        if(IN_BLOCK.includes(addr)){
          res.className='b17-s174-gcs-result s174-gcs-yes';
          res.textContent=`The filter detects that "${addr}" IS in block #870,142. The SPV client will download the full block to fetch the relevant transactions. The node only knows that block #870,142 was requested, not why.`;
        } else if(FALSE_POSITIVES.includes(addr)){
          res.className='b17-s174-gcs-result s174-gcs-fp';
          res.textContent=`FALSE POSITIVE: The filter says "${addr}" might be in block #870,142, but it actually isn’t. The SPV client still downloads the full block (wastefully), but this helps privacy because the node can’t distinguish a true match from a false positive.`;
        } else {
          res.className='b17-s174-gcs-result s174-gcs-no';
          res.textContent=`The filter confirms that "${addr}" is NOT in block #870,142. The SPV client doesn’t need to download this block. Saves bandwidth.`;
        }
      });
      el.appendChild(btn);
    });
  }

  const t1=g('b17-s174-t1'),t2=g('b17-s174-t2');
  const p1=g('b17-s174-p1'),p2=g('b17-s174-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b17-s174-tab s174-act';t2.className='b17-s174-tab';
    p1.className='b17-s174-pane show';p2.className='b17-s174-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b17-s174-tab s174-act';t1.className='b17-s174-tab';
    p2.className='b17-s174-pane show';p1.className='b17-s174-pane';
  });
})();

// ============================================================
// PAGE 20 · BAB 17 · 17.3 SIMULATION (Bloom Filter)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const BITS=32;

  function hash1(str){let h=0;for(const c of str){h=(h*31+c.charCodeAt(0))&0x7FFFFFFF;}return h%BITS;}
  function hash2(str){let h=5381;for(const c of str){h=((h<<5)+h+c.charCodeAt(0))&0x7FFFFFFF;}return h%BITS;}
  function hash3(str){let h=2166136261;for(const c of str){h=(h^c.charCodeAt(0))*16777619&0x7FFFFFFF;}return h%BITS;}
  function getBits(addr){return [hash1(addr),hash2(addr),hash3(addr)];}

  let bitArray=new Array(BITS).fill(0);
  let addedAddrs=[];
  let highlightBits=[];

  function renderArray(){
    const el=g('b17-s173-array');if(!el) return;
    el.innerHTML='';
    for(let i=0;i<BITS;i++){
      const cell=document.createElement('div');
      const isHit=highlightBits.includes(i);
      let cls='b17-s173-bit ';
      if(isHit&&bitArray[i]===1) cls+='s173-hit';
      else if(bitArray[i]===1) cls+='s173-on';
      else cls+='s173-off';
      cell.className=cls;
      cell.innerHTML=`${bitArray[i]}<span class="b17-s173-bit-idx">${i}</span>`;
      el.appendChild(cell);
    }
  }

  function renderAddrs(){
    const el=g('b17-s173-addrs');if(!el) return;
    if(addedAddrs.length===0){
      el.innerHTML='<div class="b17-s173-empty">No addresses yet. Add one above.</div>';
      return;
    }
    el.innerHTML='';
    addedAddrs.forEach((addr,i)=>{
      const bits=getBits(addr);
      const div=document.createElement('div');div.className='b17-s173-addr';
      div.innerHTML=`<div class="b17-s173-addr-text">${addr}</div>
        <div class="b17-s173-addr-bits">bit: ${bits.join(', ')}</div>
        <button class="b17-s173-addr-btn" data-i="${i}">hapus</button>`;
      div.querySelector('.b17-s173-addr-btn').addEventListener('click',()=>{
        addedAddrs.splice(i,1);
        rebuildArray();renderAddrs();highlightBits=[];renderArray();
        const res=g('b17-s173-result');
        if(res){res.className='b17-s173-result s173-idle';res.textContent='Filter reset. Add a new address.';}
      });
      el.appendChild(div);
    });
  }

  function rebuildArray(){
    bitArray=new Array(BITS).fill(0);
    addedAddrs.forEach(addr=>{getBits(addr).forEach(b=>{bitArray[b]=1;});});
  }

  function addAddr(){
    const sel=g('b17-s173-add-select');if(!sel) return;
    const addr=sel.value;
    const res=g('b17-s173-result');
    if(addedAddrs.includes(addr)){
      if(res){res.className='b17-s173-result s173-fp';res.textContent=`"${addr}" is already in the filter.`;}
      return;
    }
    if(addedAddrs.length>=4){
      if(res){res.className='b17-s173-result s173-fp';res.textContent='Maximum 4 addresses for this demo. Remove one first.';}
      return;
    }
    addedAddrs.push(addr);
    getBits(addr).forEach(b=>{bitArray[b]=1;});
    highlightBits=getBits(addr);
    renderArray();renderAddrs();
    if(res){res.className='b17-s173-result s173-yes';res.textContent=`"${addr}" added to the filter. Bits ${getBits(addr).join(', ')} set to 1.`;}
  }

  function queryFilter(){
    const sel=g('b17-s173-query-select');if(!sel) return;
    const addr=sel.value;
    const bits=getBits(addr);
    highlightBits=bits;renderArray();
    const res=g('b17-s173-result');if(!res) return;
    if(addedAddrs.length===0){
      res.className='b17-s173-result s173-idle';res.textContent='Add an address to the filter before querying.';return;
    }
    const isInFilter=bits.every(b=>bitArray[b]===1);
    const isActuallyIn=addedAddrs.includes(addr);
    if(!isInFilter){
      res.className='b17-s173-result s173-no';
      res.textContent=`Result: NOT PRESENT. Bits ${bits.filter(b=>bitArray[b]===0).join(', ')} are still 0 — "${addr}" is definitely not in the filter. The answer "no" is always correct.`;
    } else if(isActuallyIn){
      res.className='b17-s173-result s173-yes';
      res.textContent=`Result: PRESENT. All bits (${bits.join(', ')}) are set to 1. "${addr}" really is in the filter. The node will send the relevant transactions.`;
    } else {
      res.className='b17-s173-result s173-fp';
      res.textContent=`Result: FALSE POSITIVE! All bits (${bits.join(', ')}) are already 1 — but "${addr}" actually is NOT in the filter. The node still sends transactions for this address, which obscures the addresses actually owned. This is bloom filter "privacy".`;
    }
  }

  const addBtn=g('b17-s173-add-btn');if(addBtn) addBtn.addEventListener('click',addAddr);
  const qBtn=g('b17-s173-query-btn');if(qBtn) qBtn.addEventListener('click',queryFilter);

  const t1=g('b17-s173-t1'),t2=g('b17-s173-t2');
  const p1=g('b17-s173-p1'),p2=g('b17-s173-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b17-s173-tab s173-act';t2.className='b17-s173-tab';
    p1.className='b17-s173-pane show';p2.className='b17-s173-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b17-s173-tab s173-act';t1.className='b17-s173-tab';
    p2.className='b17-s173-pane show';p1.className='b17-s173-pane';
  });

  renderArray();
})();

// ============================================================
// PAGE 20 · BAB 17 · 17.2 SIMULATION (Merkle Proof Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  const TXS=[
    {id:0,label:'Tx1',hash:'a1b2c3d4'},{id:1,label:'Tx2',hash:'e5f6a7b8'},
    {id:2,label:'Tx3',hash:'c9d0e1f2'},{id:3,label:'Tx4',hash:'a3b4c5d6'},
    {id:4,label:'Tx5',hash:'e7f8a9b0'},{id:5,label:'Tx6',hash:'c1d2e3f4'},
    {id:6,label:'Tx7',hash:'a5b6c7d8'},{id:7,label:'Tx8',hash:'e9f0a1b2'},
  ];

  const NODES={
    'L0-0':{label:'Tx1',hash:'a1b2c3d4',x:38, y:160},
    'L0-1':{label:'Tx2',hash:'e5f6a7b8',x:113,y:160},
    'L0-2':{label:'Tx3',hash:'c9d0e1f2',x:188,y:160},
    'L0-3':{label:'Tx4',hash:'a3b4c5d6',x:263,y:160},
    'L0-4':{label:'Tx5',hash:'e7f8a9b0',x:338,y:160},
    'L0-5':{label:'Tx6',hash:'c1d2e3f4',x:413,y:160},
    'L0-6':{label:'Tx7',hash:'a5b6c7d8',x:488,y:160},
    'L0-7':{label:'Tx8',hash:'e9f0a1b2',x:563,y:160},
    'L1-0':{label:'H(1+2)',hash:'f1a2b3c4',x:75, y:110},
    'L1-1':{label:'H(3+4)',hash:'d5e6f7a8',x:225,y:110},
    'L1-2':{label:'H(5+6)',hash:'b9c0d1e2',x:375,y:110},
    'L1-3':{label:'H(7+8)',hash:'f3a4b5c6',x:525,y:110},
    'L2-0':{label:'H(12+34)',hash:'d7e8f9a0',x:150,y:60},
    'L2-1':{label:'H(56+78)',hash:'b1c2d3e4',x:450,y:60},
    'L3-0':{label:'Merkle Root',hash:'f5a6b7c8',x:300,y:10},
  };

  const EDGES=[
    ['L3-0','L2-0'],['L3-0','L2-1'],
    ['L2-0','L1-0'],['L2-0','L1-1'],
    ['L2-1','L1-2'],['L2-1','L1-3'],
    ['L1-0','L0-0'],['L1-0','L0-1'],
    ['L1-1','L0-2'],['L1-1','L0-3'],
    ['L1-2','L0-4'],['L1-2','L0-5'],
    ['L1-3','L0-6'],['L1-3','L0-7'],
  ];

  const PROOFS={
    0:{target:'L0-0',siblings:['L0-1','L1-1','L2-1'],path:['L1-0','L2-0','L3-0']},
    1:{target:'L0-1',siblings:['L0-0','L1-1','L2-1'],path:['L1-0','L2-0','L3-0']},
    2:{target:'L0-2',siblings:['L0-3','L1-0','L2-1'],path:['L1-1','L2-0','L3-0']},
    3:{target:'L0-3',siblings:['L0-2','L1-0','L2-1'],path:['L1-1','L2-0','L3-0']},
    4:{target:'L0-4',siblings:['L0-5','L1-3','L2-0'],path:['L1-2','L2-1','L3-0']},
    5:{target:'L0-5',siblings:['L0-4','L1-3','L2-0'],path:['L1-2','L2-1','L3-0']},
    6:{target:'L0-6',siblings:['L0-7','L1-2','L2-0'],path:['L1-3','L2-1','L3-0']},
    7:{target:'L0-7',siblings:['L0-6','L1-2','L2-0'],path:['L1-3','L2-1','L3-0']},
  };

  let selected=0;

  // Build tx buttons
  (function(){
    const grid=g('b17-s172-tx-grid');if(!grid) return;
    TXS.forEach((tx,i)=>{
      const btn=document.createElement('div');
      btn.className='b17-s172-tx-btn'+(i===0?' s172-target':'');
      btn.dataset.idx=i;
      btn.innerHTML=`<div class="b17-s172-tx-num">${tx.label}</div><div class="b17-s172-tx-hash">${tx.hash}</div>`;
      btn.addEventListener('click',()=>{selected=i;render();});
      grid.appendChild(btn);
    });
  })();

  function render(){
    const proof=PROOFS[selected];
    document.querySelectorAll('.b17-s172-tx-btn').forEach((btn,i)=>{
      if(i===selected) btn.className='b17-s172-tx-btn s172-target';
      else if(proof.siblings.includes(`L0-${i}`)) btn.className='b17-s172-tx-btn s172-proof';
      else btn.className='b17-s172-tx-btn s172-other';
    });

    const svg=g('b17-s172-svg');if(!svg) return;
    svg.innerHTML='';

    EDGES.forEach(([from,to])=>{
      const f=NODES[from],t=NODES[to];
      const line=document.createElementNS(NS,'line');
      line.setAttribute('x1',f.x);line.setAttribute('y1',f.y+8);
      line.setAttribute('x2',t.x);line.setAttribute('y2',t.y+8);
      const active=proof.siblings.includes(to)||proof.path.includes(from)||to===proof.target;
      line.setAttribute('stroke',active?'rgba(83,74,183,0.5)':'rgba(160,160,152,0.25)');
      line.setAttribute('stroke-width',active?'2':'1');
      svg.appendChild(line);
    });

    Object.entries(NODES).forEach(([key,node])=>{
      const isTarget =key===proof.target;
      const isSibling=proof.siblings.includes(key);
      const isPath   =proof.path.includes(key);
      const isRoot   =key==='L3-0';
      let fill='#F4F4F0',stroke='rgba(160,160,152,0.3)',textCol='#52524C';
      if(isTarget)  {fill='#534AB7';stroke='#534AB7';textCol='#fff';}
      else if(isSibling){fill='#FAEEDA';stroke='rgba(133,79,11,0.4)';textCol='#854F0B';}
      else if(isRoot){fill='#EAF3DE';stroke='rgba(15,110,86,0.4)';textCol='#0F6E56';}
      else if(isPath){fill='#EEEDFE';stroke='rgba(83,74,183,0.3)';textCol='#534AB7';}

      const r=document.createElementNS(NS,'rect');
      r.setAttribute('x',node.x-28);r.setAttribute('y',node.y);
      r.setAttribute('width',56);r.setAttribute('height',18);
      r.setAttribute('rx',4);r.setAttribute('fill',fill);r.setAttribute('stroke',stroke);
      svg.appendChild(r);

      const lbl=document.createElementNS(NS,'text');
      lbl.setAttribute('x',node.x);lbl.setAttribute('y',node.y+6);
      lbl.setAttribute('text-anchor','middle');lbl.setAttribute('dominant-baseline','central');
      lbl.setAttribute('font-size','7');lbl.setAttribute('font-family','Sora,sans-serif');
      lbl.setAttribute('font-weight','500');lbl.setAttribute('fill',textCol);
      lbl.textContent=node.label;svg.appendChild(lbl);

      const hash=document.createElementNS(NS,'text');
      hash.setAttribute('x',node.x);hash.setAttribute('y',node.y+13);
      hash.setAttribute('text-anchor','middle');hash.setAttribute('dominant-baseline','central');
      hash.setAttribute('font-size','6');hash.setAttribute('font-family','Courier Prime,monospace');
      hash.setAttribute('fill',textCol==='#fff'?'rgba(255,255,255,0.7)':textCol);
      hash.setAttribute('opacity','0.8');
      hash.textContent=node.hash+'...';svg.appendChild(hash);
    });

    // Legend
    const legend=[
      {x:10, col:'#534AB7', txt:'Target tx'},
      {x:85, col:'#FAEEDA', stroke:'rgba(133,79,11,0.4)', txt:'Sibling (proof)'},
      {x:185,col:'#EEEDFE', stroke:'rgba(83,74,183,0.3)', txt:'Calculation path'},
      {x:285,col:'#EAF3DE', stroke:'rgba(15,110,86,0.4)', txt:'Merkle root'},
    ];
    legend.forEach(l=>{
      const r=document.createElementNS(NS,'rect');
      r.setAttribute('x',l.x);r.setAttribute('y',185);r.setAttribute('width',10);r.setAttribute('height',10);
      r.setAttribute('rx',2);r.setAttribute('fill',l.col);
      if(l.stroke) r.setAttribute('stroke',l.stroke);
      svg.appendChild(r);
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',l.x+13);t.setAttribute('y',195);
      t.setAttribute('dominant-baseline','central');
      t.setAttribute('font-size','8');t.setAttribute('font-family','Sora,sans-serif');
      t.setAttribute('fill','#3A3A35');t.textContent=l.txt;svg.appendChild(t);
    });

    // Steps
    const stepsEl=g('b17-s172-steps');if(!stepsEl) return;
    stepsEl.innerHTML='';
    const tx=TXS[selected];

    const s0=document.createElement('div');s0.className='b17-s172-step s172-target';
    s0.innerHTML=`<div class="b17-s172-step-icon">🎯</div>
      <div class="b17-s172-step-body">
        <div class="b17-s172-step-title">Target transaction: ${tx.label}</div>
        <div class="b17-s172-step-hash">hash: ${tx.hash}...d4a9f1 (32 byte)</div>
        <div class="b17-s172-step-desc">This is what you want to prove is inside the block.</div>
      </div>`;
    stepsEl.appendChild(s0);

    proof.siblings.forEach((sibKey,i)=>{
      const sib=NODES[sibKey];
      const s=document.createElement('div');s.className='b17-s172-step s172-proof';
      s.innerHTML=`<div class="b17-s172-step-icon">🔑</div>
        <div class="b17-s172-step-body">
          <div class="b17-s172-step-title">Sibling hash ${i+1}: ${sib.label}</div>
          <div class="b17-s172-step-hash">hash: ${sib.hash}...a8b3c7 (32 byte)</div>
          <div class="b17-s172-step-desc">This hash is sent by the full node as part of the proof. The SPV client doesn’t need to know the transaction contents — just the hash.</div>
        </div>`;
      stepsEl.appendChild(s);
    });

    const sRoot=document.createElement('div');sRoot.className='b17-s172-step s172-root';
    sRoot.innerHTML=`<div class="b17-s172-step-icon">✅</div>
      <div class="b17-s172-step-body">
        <div class="b17-s172-step-title">Calculation result: Merkle Root matches</div>
        <div class="b17-s172-step-hash">root: ${NODES['L3-0'].hash}...e2f1d9 (32 byte)</div>
        <div class="b17-s172-step-desc">The SPV client reconstructs the merkle root from the target tx + ${proof.siblings.length} sibling hashes. If it matches the merkle root in the block header whose proof-of-work has been verified, the transaction is proven to be in this block.</div>
      </div>`;
    stepsEl.appendChild(sRoot);

    // Stats
    const proofBytes=(proof.siblings.length+1)*32;
    const blockBytes=1500000;
    const efficiency=((1-proofBytes/blockBytes)*100).toFixed(2);
    const psEl=g('b17-s172-proof-size');const phEl=g('b17-s172-proof-hashes');const efEl=g('b17-s172-efficiency');
    if(psEl) psEl.textContent=proofBytes+' byte';
    if(phEl) phEl.textContent=`${proof.siblings.length} sibling + 1 target hash`;
    if(efEl) efEl.textContent=efficiency+'%';
    const note=g('b17-s172-note');
    if(note) note.textContent=`To prove ${tx.label} is in this block, the SPV client only needs ${proofBytes} bytes (${proof.siblings.length} sibling hashes + the transaction hash itself). The entire block is ~1.5 MB. This proof is ${Math.round(blockBytes/proofBytes).toLocaleString('en-US')}x smaller than the full block.`;
  }

  render();
})();

// ============================================================
// PAGE 20 · BAB 17 · 17.1 SIMULATION (SPV vs Full Node)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const t1=g('b17-s171-t1'),t2=g('b17-s171-t2');
  const cmp=g('b17-s171-compare'),net=g('b17-s171-net');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b17-s171-toggle-btn s171-act';t2.className='b17-s171-toggle-btn';
    if(cmp) cmp.style.display='';if(net) net.style.display='none';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b17-s171-toggle-btn s171-act';t1.className='b17-s171-toggle-btn';
    if(net) net.style.display='';if(cmp) cmp.style.display='none';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · NAVIGATION
// ============================================================
function showSectionInContentB18(sectionId, sbId) {
  document.querySelectorAll('#page-bab18 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab18 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab18-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 21 · BAB 18 · TOPBAR
// ============================================================
document.getElementById('back-home-b18').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b18').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 21 · BAB 18 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab18').addEventListener('click', () => navigate('page-bab18'));

// ============================================================
// PAGE 21 · BAB 18 · SIDEBAR EVENTS (18.1 - 18.6)
// ============================================================
document.getElementById('sb-18-1').addEventListener('click', () => showSectionInContentB18('section-18-1', 'sb-18-1'));
document.getElementById('sb-18-2').addEventListener('click', () => showSectionInContentB18('section-18-2', 'sb-18-2'));
document.getElementById('sb-18-3').addEventListener('click', () => showSectionInContentB18('section-18-3', 'sb-18-3'));
document.getElementById('sb-18-4').addEventListener('click', () => showSectionInContentB18('section-18-4', 'sb-18-4'));
document.getElementById('sb-18-5').addEventListener('click', () => showSectionInContentB18('section-18-5', 'sb-18-5'));
document.getElementById('sb-18-6').addEventListener('click', () => showSectionInContentB18('section-18-6', 'sb-18-6'));

// ============================================================
// PAGE 21 · BAB 18 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab18 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB18(target, sb);
  });
});

// ============================================================
// PAGE 21 · BAB 18 · 18.6 SIMULATION (Dandelion Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  function mkE(tag,attrs){
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  }
  function mkText(svg,x,y,txt,col,sz,bold){
    const t=mkE('text',{x,y,'text-anchor':'middle','dominant-baseline':'central','font-size':sz||8,'font-family':'Sora,sans-serif','fill':col});
    if(bold) t.setAttribute('font-weight','600');
    t.textContent=txt;svg.appendChild(t);
  }
  function mkCircle(svg,x,y,r,fill,stroke,sw){
    svg.appendChild(mkE('circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':sw||'1.5'}));
  }
  function mkLine(svg,x1,y1,x2,y2,col,sw,dash){
    const el=mkE('line',{x1,y1,x2,y2,stroke:col,'stroke-width':sw||'1.5'});
    if(dash) el.setAttribute('stroke-dasharray',dash);
    svg.appendChild(el);
  }
  function mkArrow(svg,x1,y1,x2,y2,col,label){
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),r=13;
    const ax=x1+(dx/len)*r,ay=y1+(dy/len)*r,bx=x2-(dx/len)*r,by=y2-(dy/len)*r;
    mkLine(svg,ax,ay,bx,by,col,'1.5');
    const angle=Math.atan2(by-ay,bx-ax),ah=6;
    svg.appendChild(mkE('polygon',{
      points:`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`,
      fill:col
    }));
    if(label){
      const mx=(ax+bx)/2,my=(ay+by)/2;
      const t=mkE('text',{x:mx,y:my-6,'text-anchor':'middle','font-size':'7','font-family':'Sora,sans-serif','fill':col});
      t.textContent=label;svg.appendChild(t);
    }
  }

  const NODES=[
    {x:110,y:95},{x:55,y:50},{x:165,y:50},
    {x:30,y:100},{x:190,y:100},{x:55,y:150},{x:165,y:150},{x:110,y:170},
  ];
  const LABELS=['YOU','B','C','D','E','F','G','H'];

  // Flood diagram
  (function(){
    const svg=g('b18-s186-svg-flood');if(!svg) return;
    svg.innerHTML='';
    [1,2,3,4,5,6,7].forEach(i=>{
      mkArrow(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(163,45,45,0.7)','inv');
      mkCircle(svg,NODES[i].x,NODES[i].y,13,'#F4F4F0','rgba(163,45,45,0.4)','1.5');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#A32D2D',7,true);
    });
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#A32D2D','#791F1F','2');
    mkText(svg,NODES[0].x,NODES[0].y-5,'YOU','#fff',7,true);
    mkText(svg,NODES[0].x,NODES[0].y+6,'(source)','#fff',6,false);
    const att=mkE('rect',{x:148,y:152,width:66,height:22,rx:4,fill:'#FCEBEB',stroke:'#A32D2D','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,181,163,'👁 Attacker','#A32D2D',7,true);
    mkLine(svg,165,150,165,152,'rgba(163,45,45,0.5)','1','3,2');
    mkText(svg,110,185,'Source directly visible from the first node to flood','#A32D2D',7,false);
  })();

  // Dandelion diagram
  (function(){
    const svg=g('b18-s186-svg-dan');if(!svg) return;
    svg.innerHTML='';
    const STEM=[0,2,4,6];
    for(let i=0;i<STEM.length-1;i++){
      const a=NODES[STEM[i]],b=NODES[STEM[i+1]];
      const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy),r=13;
      mkLine(svg,a.x,a.y,b.x,b.y,'rgba(15,110,86,0.6)','2');
      const bx=b.x-(dx/len)*r,by=b.y-(dy/len)*r,angle=Math.atan2(dy,dx),ah=6;
      svg.appendChild(mkE('polygon',{
        points:`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`,
        fill:'rgba(15,110,86,0.6)'
      }));
    }
    const sm=mkE('text',{x:158,y:68,'text-anchor':'middle','font-size':'6','font-family':'Sora,sans-serif','fill':'rgba(15,110,86,0.8)'});
    sm.textContent='stem (silent)';svg.appendChild(sm);
    const FS=NODES[6];
    [1,3,5,7].forEach(i=>{
      mkLine(svg,FS.x,FS.y,NODES[i].x,NODES[i].y,'rgba(133,79,11,0.6)','1','3,2');
      mkCircle(svg,NODES[i].x,NODES[i].y,13,'#FAEEDA','rgba(133,79,11,0.4)','1.5');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#854F0B',7,true);
    });
    STEM.forEach((ni,idx)=>{
      const n=NODES[ni];
      const isFluff=idx===STEM.length-1,isSrc=idx===0;
      mkCircle(svg,n.x,n.y,isSrc?16:13,
        isSrc?'#534AB7':isFluff?'#854F0B':'#EAF3DE',
        isSrc?'#3C3489':isFluff?'#633806':'rgba(15,110,86,0.5)','1.5');
      if(isSrc){mkText(svg,n.x,n.y-5,'YOU','#fff',7,true);mkText(svg,n.x,n.y+6,'(source)','#fff',6,false);}
      else mkText(svg,n.x,n.y,LABELS[ni],isFluff?'#fff':'#0F6E56',7,true);
    });
    const att=mkE('rect',{x:1,y:152,width:64,height:28,rx:4,fill:'#EAF3DE',stroke:'#0F6E56','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,33,162,'👁 Attacker','#0F6E56',7,true);
    mkText(svg,33,173,'can’t tell!','#0F6E56',6,false);
    mkText(svg,110,185,'Fluff from node G — original source undetected','#0F6E56',7,false);
  })();

  // Flow diagram
  (function(){
    const svg=g('b18-s186-flow-svg');if(!svg) return;
    svg.innerHTML='';
    const stemX=[30,100,170,240];
    const labels=[['You','(source)'],['Node B'],['Node C'],['Node D']];
    const cols=['#534AB7','#0F6E56','#0F6E56','#854F0B'];
    const bgs=['#EEEDFE','#EAF3DE','#EAF3DE','#FAEEDA'];
    stemX.forEach((x,i)=>{
      mkCircle(svg,x,50,18,bgs[i],cols[i],'1.5');
      labels[i].forEach((l,j)=>mkText(svg,x,45+(j*12),l,cols[i],7,i===0));
      if(i<stemX.length-1){
        const nx=stemX[i+1],col=i<2?'rgba(15,110,86,0.6)':'rgba(133,79,11,0.6)';
        mkLine(svg,x+18,50,nx-18,50,col,'2');
        const mx=(x+nx)/2;
        mkText(svg,mx,36,i<2?'stem':'fluff!',i<2?'#0F6E56':'#854F0B',7,false);
      }
    });
    [[320,20],[350,50],[320,80],[290,80],[270,30]].forEach(([tx,ty])=>{
      mkLine(svg,240,50,tx,ty,'rgba(133,79,11,0.5)','1','3,2');
      mkCircle(svg,tx,ty,10,'#FAEEDA','rgba(133,79,11,0.4)','1');
    });
    mkText(svg,350,95,'fluff phase (normal flooding)','#854F0B',7,false);
    const r=mkE('rect',{x:55,y:78,width:155,height:16,rx:3,fill:'#EAF3DE',stroke:'rgba(15,110,86,0.3)','stroke-width':'0.5'});
    svg.appendChild(r);
    mkText(svg,133,86,'stem phase (silent, not in mempool)','#0F6E56',7,false);
  })();

  const t1=g('b18-s186-t1'),t2=g('b18-s186-t2');
  const p1=g('b18-s186-p1'),p2=g('b18-s186-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s186-tab s186-act';t2.className='b18-s186-tab';
    p1.className='b18-s186-pane show';p2.className='b18-s186-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s186-tab s186-act';t1.className='b18-s186-tab';
    p2.className='b18-s186-pane show';p1.className='b18-s186-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.5 SIMULATION (Erlay Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  const NODES=[
    {x:110,y:90},{x:55,y:40},{x:165,y:40},
    {x:30,y:100},{x:190,y:100},{x:55,y:155},{x:165,y:155},
  ];
  const LABELS=['A','B','C','D','E','F','G'];

  function mkCircle(svg,x,y,r,fill,stroke){
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
    c.setAttribute('fill',fill);c.setAttribute('stroke',stroke);c.setAttribute('stroke-width','1.5');
    svg.appendChild(c);
  }
  function mkText(svg,x,y,txt,col,sz,bold){
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',x);t.setAttribute('y',y);
    t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
    t.setAttribute('font-size',sz||8);t.setAttribute('font-family','Sora,sans-serif');
    t.setAttribute('fill',col);if(bold) t.setAttribute('font-weight','600');
    t.textContent=txt;svg.appendChild(t);
  }
  function mkArrow(svg,x1,y1,x2,y2,col,dash,label){
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);
    const ux=dx/len,uy=dy/len,r=14;
    const ax=x1+ux*r,ay=y1+uy*r,bx=x2-ux*r,by=y2-uy*r;
    const line=document.createElementNS(NS,'line');
    line.setAttribute('x1',ax);line.setAttribute('y1',ay);
    line.setAttribute('x2',bx);line.setAttribute('y2',by);
    line.setAttribute('stroke',col);line.setAttribute('stroke-width',dash?'1':'1.5');
    if(dash) line.setAttribute('stroke-dasharray','3,2');
    svg.appendChild(line);
    const angle=Math.atan2(by-ay,bx-ax),ah=6;
    const poly=document.createElementNS(NS,'polygon');
    poly.setAttribute('points',`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`);
    poly.setAttribute('fill',col);svg.appendChild(poly);
    if(label){
      const mx=(ax+bx)/2,my=(ay+by)/2;
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',mx);t.setAttribute('y',my-5);
      t.setAttribute('text-anchor','middle');t.setAttribute('font-size','7');
      t.setAttribute('font-family','Sora,sans-serif');t.setAttribute('fill',col);
      t.textContent=label;svg.appendChild(t);
    }
  }
  function mkSketch(svg,x1,y1,x2,y2,col){
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    const line=document.createElementNS(NS,'line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke',col);line.setAttribute('stroke-width','1.5');
    line.setAttribute('stroke-dasharray','4,2');svg.appendChild(line);
    const rect=document.createElementNS(NS,'rect');
    rect.setAttribute('x',mx-14);rect.setAttribute('y',my-8);
    rect.setAttribute('width',28);rect.setAttribute('height',14);
    rect.setAttribute('rx',3);rect.setAttribute('fill','#EEEDFE');
    rect.setAttribute('stroke',col);rect.setAttribute('stroke-width','0.5');
    svg.appendChild(rect);
    mkText(svg,mx,my,'sketch',col,6,false);
  }

  // Flood diagram
  (function(){
    const svg=g('b18-s185-svg-flood');if(!svg) return;
    svg.innerHTML='';
    [1,2,3,4,5,6].forEach(i=>mkArrow(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(163,45,45,0.7)',false,'inv'));
    mkArrow(svg,NODES[1].x,NODES[1].y,NODES[2].x,NODES[2].y,'rgba(163,45,45,0.3)',false,'');
    mkArrow(svg,NODES[3].x,NODES[3].y,NODES[5].x,NODES[5].y,'rgba(163,45,45,0.3)',false,'');
    mkArrow(svg,NODES[4].x,NODES[4].y,NODES[6].x,NODES[6].y,'rgba(163,45,45,0.3)',false,'');
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#A32D2D','#791F1F');
    mkText(svg,NODES[0].x,NODES[0].y,'A','#fff',8,true);
    [1,2,3,4,5,6].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#F4F4F0','rgba(163,45,45,0.4)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#A32D2D',8,true);
    });
    mkText(svg,110,175,'Node A announces to all 6 peers','#A32D2D',7,false);
  })();

  // Erlay diagram
  (function(){
    const svg=g('b18-s185-svg-erlay');if(!svg) return;
    svg.innerHTML='';
    mkArrow(svg,NODES[0].x,NODES[0].y,NODES[1].x,NODES[1].y,'rgba(15,110,86,0.8)',false,'inv');
    mkArrow(svg,NODES[0].x,NODES[0].y,NODES[2].x,NODES[2].y,'rgba(15,110,86,0.8)',false,'inv');
    [3,4,5,6].forEach(i=>mkSketch(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(83,74,183,0.6)'));
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#0F6E56','#0a5540');
    mkText(svg,NODES[0].x,NODES[0].y,'A','#fff',8,true);
    [1,2].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#EAF3DE','rgba(15,110,86,0.5)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#0F6E56',8,true);
    });
    [3,4,5,6].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#EEEDFE','rgba(83,74,183,0.4)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#534AB7',8,true);
    });
    mkText(svg,110,170,'─ direct fanout  ·· sketch recon','#3A3A35',7,false);
  })();

  const t1=g('b18-s185-t1'),t2=g('b18-s185-t2');
  const p1=g('b18-s185-p1'),p2=g('b18-s185-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s185-tab s185-act';t2.className='b18-s185-tab';
    p1.className='b18-s185-pane show';p2.className='b18-s185-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s185-tab s185-act';t1.className='b18-s185-tab';
    p2.className='b18-s185-pane show';p1.className='b18-s185-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.4 SIMULATION (Compact Block Simulator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const TOTAL_TX=3000, AVG_TX_BYTE=500, BLOCK_FULL_KB=1500;

  function update(){
    const sl=g('b18-s184-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b18-s184-sl-val');if(vEl) vEl.textContent=pct+'% already present';
    const known=Math.round(TOTAL_TX*pct/100);
    const missing=TOTAL_TX-known;
    const kEl=g('b18-s184-known');if(kEl) kEl.textContent=known.toLocaleString('en-US')+' tx';
    const mEl=g('b18-s184-missing');if(mEl) mEl.textContent=missing.toLocaleString('en-US')+' tx';
    const shortidBytes=TOTAL_TX*6;
    const prefillBytes=500;
    const headerBytes=80;
    const missingBytes=missing*AVG_TX_BYTE;
    const cmpctBytes=headerBytes+shortidBytes+prefillBytes;
    const totalBytes=cmpctBytes+missingBytes;
    const totalKB=Math.round(totalBytes/1024*10)/10;
    const cmpctKB=Math.round(cmpctBytes/1024*10)/10;
    const missingKB=Math.round(missingBytes/1024*10)/10;
    const saving=Math.round((1-totalBytes/(BLOCK_FULL_KB*1024))*100);
    const maxKB=BLOCK_FULL_KB;
    function setBar(barId,txtId,valId,kb,label){
      const bar=g(barId);const txt=g(txtId);const val=g(valId);if(!bar||!txt||!val) return;
      bar.style.width=Math.max(1,Math.min(100,(kb/maxKB)*100))+'%';
      txt.textContent=label;val.textContent='~'+kb+' KB';
    }
    setBar('b18-s184-bar-cmpct','b18-s184-bar-cmpct-txt','b18-s184-val-cmpct',cmpctKB,'cmpctblock: header + shortids + prefill');
    setBar('b18-s184-bar-extra','b18-s184-bar-extra-txt','b18-s184-val-extra',missingKB,missing>0?`${missing} unknown tx`:'No missing tx!');
    setBar('b18-s184-bar-total','b18-s184-bar-total-txt','b18-s184-val-total',totalKB,`Total: ~${totalKB} KB`);
    const svEl=g('b18-s184-shortid-val');if(svEl) svEl.textContent=(shortidBytes/1000).toFixed(1)+' KB';
    const mvEl=g('b18-s184-missing-val');if(mvEl) mvEl.textContent=missing>0?'~'+missingKB+' KB':'0 KB (none!)';
    const tvEl=g('b18-s184-total-val');if(tvEl) tvEl.textContent='~'+totalKB+' KB vs '+BLOCK_FULL_KB+' KB';
    const sdEl=g('b18-s184-saving-desc');
    if(sdEl) sdEl.textContent=saving>0?`Saves ~${saving}% bandwidth. ${Math.round(BLOCK_FULL_KB/totalKB)}x smaller than the full block.`:'Abnormal condition — too many unknown tx.';
  }

  const sl=g('b18-s184-sl');if(sl) sl.addEventListener('input',update);
  update();

  const t1=g('b18-s184-t1'),t2=g('b18-s184-t2');
  const p1=g('b18-s184-p1'),p2=g('b18-s184-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s184-tab s184-act';t2.className='b18-s184-tab';
    p1.className='b18-s184-pane show';p2.className='b18-s184-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s184-tab s184-act';t1.className='b18-s184-tab';
    p2.className='b18-s184-pane show';p1.className='b18-s184-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.3 SIMULATION (Block Sync Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const STRATEGIES={
    blocks:{
      phases:[
        {cls:'s183-ph-info',num:'1',title:'Send getblocks to a single peer',
         desc:'The node sends getblocks with a block locator. The peer replies with an inv containing up to 500 of the next block hashes.',
         msg:'→ getblocks [block_locator] | ← inv [max 500 hashes]',time:'~1 second'},
        {cls:'s183-ph-bad', num:'2',title:'Request and wait for blocks one by one',
         desc:'The node sends getdata for each block and waits for it to arrive before requesting the next. Can’t parallelize.',
         msg:'→ getdata [block_N] | ← block [~1.5MB] | validate... | → getdata [block_N+1]',time:'~seconds per block'},
        {cls:'s183-ph-bad', num:'3',title:'Tied to a single peer',
         desc:'The entire sync depends on the speed and honesty of one peer. If the peer is slow or dishonest, the whole sync is affected.',
         msg:'',time:'main bottleneck'},
        {cls:'s183-ph-bad', num:'4',title:'Doesn’t know which chain is correct',
         desc:'The node can’t verify whether it’s on the longest chain until it has already downloaded many blocks. It can waste time on the wrong chain.',
         msg:'',time:'high risk'},
      ],
    },
    headers:{
      phases:[
        {cls:'s183-ph-info',num:'1',title:'Download all headers via getheaders',
         desc:'The node sends getheaders with a block locator. The peer replies with up to 2,000 headers (~162 KB per response). Repeat until all headers are downloaded.',
         msg:'→ getheaders [locator] | ← headers [max 2000 × 81B ≈ 162KB]',time:'~5 minutes for 870,000 blocks'},
        {cls:'s183-ph-good',num:'2',title:'Compute chainwork — know the longest chain without downloading blocks',
         desc:'From the header chain, the node computes the accumulated proof-of-work (chainwork) of each chain offered by various peers. The chain with the highest chainwork is the valid one.',
         msg:'chainwork = Σ difficulty for each block in the chain',time:'instant after headers'},
        {cls:'s183-ph-good',num:'3',title:'Download blocks in parallel from many peers',
         desc:'Since the order is already known from the header chain, the node can download blocks from various peers at once. Block #1 from peer A, block #2 from peer B, etc.',
         msg:'→ getdata [block_1] to peer_A + getdata [block_2] to peer_B + ...',time:'parallel, far faster'},
        {cls:'s183-ph-good',num:'4',title:'Resilient to slow or cheating peers',
         desc:'If one peer is slow, the node switches to another peer. The chain is already verified from the headers — it can’t be tricked by a wrong order.',
         msg:'assumevalid + parallel download + multi-peer = optimal IBD',time:'~4-24 hours'},
      ],
    },
  };

  let current='blocks';

  function renderStrategy(strat){
    const data=STRATEGIES[strat];if(!data) return;
    const el=g('b18-s183-phases');if(!el) return;
    el.innerHTML='';
    data.phases.forEach(p=>{
      const div=document.createElement('div');div.className=`b18-s183-phase ${p.cls}`;
      div.innerHTML=`<div class="b18-s183-phase-num">${p.num}</div>
        <div class="b18-s183-phase-body">
          <div class="b18-s183-phase-title">${p.title}</div>
          <div class="b18-s183-phase-desc">${p.desc}</div>
          ${p.msg?`<div class="b18-s183-phase-msg">${p.msg}</div>`:''}
        </div>
        <div class="b18-s183-phase-time">${p.time}</div>`;
      el.appendChild(div);
    });
  }

  const stratsEl=g('b18-s183-strats');
  if(stratsEl) stratsEl.querySelectorAll('.b18-s183-strat').forEach(btn=>{
    btn.addEventListener('click',()=>{
      stratsEl.querySelectorAll('.b18-s183-strat').forEach(b=>{
        const col=b.dataset.strat==='blocks'?'s183-red':'s183-green';
        b.className=`b18-s183-strat ${col}`;
      });
      const col=btn.dataset.strat==='blocks'?'s183-red':'s183-green';
      btn.className=`b18-s183-strat s183-act ${col}`;
      current=btn.dataset.strat;
      renderStrategy(current);
    });
  });
  renderStrategy('blocks');

  // Block locator visualization
  (function(){
    const el=g('b18-s183-locator-chain');if(!el) return;
    const TIP=30;
    const locatorOffsets=new Set([0,1,2,3,4,5,6,7,8,9,11,15,23,29]);
    for(let i=TIP;i>=0;i--){
      if(i<TIP){
        const arrow=document.createElement('div');
        arrow.className='b18-s183-block-arrow';arrow.textContent='←';
        el.appendChild(arrow);
      }
      const wrap=document.createElement('div');wrap.className='b18-s183-block';
      const rect=document.createElement('div');
      const offset=TIP-i;
      const isTip=i===TIP;
      const isLocator=locatorOffsets.has(offset);
      rect.className='b18-s183-block-rect '+(isTip?'s183-b-tip':isLocator?'s183-b-locator':'s183-b-normal');
      rect.textContent=isTip?'TIP':isLocator?'✓':'';
      rect.title=isTip?'Block tip #870,142 (in locator)':
                 isLocator?`Block #${870142-offset} (in locator)`:
                 `Block #${870142-offset}`;
      const ht=document.createElement('div');ht.className='b18-s183-block-ht';
      ht.textContent=isTip?'#870142':isLocator?`-${offset}`:'';
      wrap.appendChild(rect);wrap.appendChild(ht);
      el.appendChild(wrap);
    }
    const ellipsis=document.createElement('div');
    ellipsis.style.cssText='font-size:14px;color:#52524C;align-self:center;margin-bottom:14px;margin-left:4px;';
    ellipsis.textContent='...';
    el.appendChild(ellipsis);
    const genesis=document.createElement('div');genesis.className='b18-s183-block';
    const gr=document.createElement('div');gr.className='b18-s183-block-rect s183-b-locator';
    gr.textContent='✓';gr.title='Genesis block #0 (always in locator)';
    const gh=document.createElement('div');gh.className='b18-s183-block-ht';gh.textContent='#0';
    genesis.appendChild(gr);genesis.appendChild(gh);el.appendChild(genesis);
  })();

  const t1=g('b18-s183-t1'),t2=g('b18-s183-t2');
  const p1=g('b18-s183-p1'),p2=g('b18-s183-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s183-tab s183-act';t2.className='b18-s183-tab';
    p1.className='b18-s183-pane show';p2.className='b18-s183-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s183-tab s183-act';t1.className='b18-s183-tab';
    p2.className='b18-s183-pane show';p1.className='b18-s183-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.2 SIMULATION (Handshake & Message Flow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const FLOW1=[
    {dir:'L',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Your Node',to:'Peer',
     desc:'You send your software version (70016), services flags, timestamp, user agent "/Satoshi:27.0.0/", and block height (#907,430). This is the first handshake.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'Like a diplomat handing over an ID card: "I’m from country X, can speak language Y, I know the news up to date Z."'},
    {dir:'R',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Your Node',
     desc:'The peer replies with its own version. Now both know each other’s capabilities.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'The other diplomat also hands over their ID card — the exchange of introductions is complete.'},
    {dir:'L',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Your Node',to:'Peer',
     desc:'You send verack — confirmation that the peer’s version was received and is valid. It has no payload, just a 24-byte header.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'A nod of the head: "okay, I know about you now."'},
    {dir:'R',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Your Node',
     desc:'The peer also sends verack. After both veracks are received, the handshake is complete. The official Bitcoin communication session begins.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'The handshake is complete. Both diplomats can start discussing important matters.'},
    {dir:'L',msg:'sendcmpct',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Your Node',to:'Peer',
     desc:'A modern node sends sendcmpct after verack — telling the peer that you support compact blocks (BIP 152) and your preferred mode.',
     bytes:'F9BEB4D9 | sendcmpct | 09 byte payload',
     analogy:'After the handshake: "by the way, I prefer concise communication — use the compact block format when sending a new block."'},
    {dir:'L',msg:'inv',type:'s182-t-tx',cls:'s182-d-tx',from:'Your Node',to:'Peer',
     desc:'You have a new transaction. Announce it via inv with the txid — don’t send the full data right away, first ask whether the peer already has it.',
     bytes:'F9BEB4D9 | inv | count:1 | type:MSG_TX | txid (32B)',
     analogy:'Like a store putting up a "new product!" announcement — not delivering it to every customer right away, first seeing who’s interested.'},
    {dir:'R',msg:'getdata',type:'s182-t-tx',cls:'s182-d-tx',from:'Peer',to:'Your Node',
     desc:'The peer doesn’t have this transaction yet. It replies with getdata containing the same txid: "please send me that transaction."',
     bytes:'F9BEB4D9 | getdata | count:1 | type:MSG_TX | txid (32B)',
     analogy:'An interested customer fills out an order form: "I want this product number."'},
    {dir:'L',msg:'tx',type:'s182-t-tx',cls:'s182-d-tx',from:'Your Node',to:'Peer',
     desc:'You send the full transaction. The peer validates it — checks the signature, checks the UTXO, checks the consensus rules. If valid, the peer repeats inv/getdata/tx to its other peers.',
     bytes:'F9BEB4D9 | tx | [full tx data: inputs, outputs, witness]',
     analogy:'The product is delivered. The customer checks its quality — if it’s good, they recommend it to their friends.'},
    {dir:'B',msg:'propagation complete',type:'s182-t-tx',cls:'s182-d-tx',from:'',to:'',
     desc:'The transaction is now in the first node’s mempool. This inv/getdata/tx process repeats to thousands of other nodes — within 2-5 seconds, the transaction is known to the majority of the network.',
     bytes:'',
     analogy:'Like news spreading by word of mouth — everyone who knows tells their acquaintances, until everyone knows.'},
  ];

  const FLOW2=[
    {dir:'L',msg:'inv (block)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Other Node',
     desc:'The old way: the miner announces the new block via inv. Other nodes have to request the full block — slow for a 1-2 MB block.',
     bytes:'F9BEB4D9 | inv | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Telling friends "I have a new newspaper" — they have to come get a 200-page copy themselves.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Other Node',to:'Miner',
     desc:'The other node requests the full block. If 8 peers do this at once, the miner has to send 8 copies of the same block — very bandwidth-wasteful.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Eight friends all ask for a copy of the newspaper at once — the seller has to photocopy it 8 times.'},
    {dir:'L',msg:'block (full)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Other Node',
     desc:'The full block is sent (~1-2 MB). For a network of thousands of nodes, this is inefficient. A block can take several seconds to spread — increasing the risk of a stale block.',
     bytes:'F9BEB4D9 | block | [header + all transactions: ~1-2 MB]',
     analogy:'Photocopying a 200-page newspaper for everyone — slow and wasteful.'},
    {dir:'L',msg:'headers',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Other Node',
     desc:'A better way (headers-first): send the block header first (80 bytes). The receiving node can validate the proof-of-work from the header before deciding whether it needs the full block.',
     bytes:'F9BEB4D9 | headers | [80 byte header: prev_hash, merkle_root, PoW]',
     analogy:'Send the executive summary first — then only if interested, request the details.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Other Node',to:'Miner',
     desc:'After validating the header and PoW, the receiving node decides this block is valid and requests it.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'After reading the summary and getting interested, then order the full book.'},
    {dir:'L',msg:'cmpctblock',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Other Node',
     desc:'The best way (compact blocks, BIP 152): send a block sketch containing the header + short txids (6 bytes). The recipient reconstructs from the mempool — known transactions don’t need to be re-downloaded.',
     bytes:'F9BEB4D9 | cmpctblock | [80B header + short txids: ~20KB vs 1.5MB]',
     analogy:'Send a list of page numbers of the newspaper you already have — only the missing pages need to be sent.'},
    {dir:'R',msg:'getblocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Other Node',to:'Miner',
     desc:'If there are transactions in the block that aren’t recognized (not in the mempool), the receiving node requests those specific transactions. Usually only 0-5% of transactions need to be requested.',
     bytes:'F9BEB4D9 | getblocktxn | block_hash | [list of needed tx indices]',
     analogy:'Out of 3000 pages, you only need 5 missing pages — request just those 5 pages.'},
    {dir:'L',msg:'blocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Other Node',
     desc:'The miner sends only the requested transactions. The node reconstructs the full block and validates it. Total data: ~20-50 KB vs 1-2 MB. 10-40x faster than the classic method.',
     bytes:'F9BEB4D9 | blocktxn | [only the requested tx, not the whole block]',
     analogy:'Five pages are sent. The reader assembles the full newspaper from the pages they already have + 5 new pages. Done in a fraction of the time.'},
  ];

  function buildFlow(flow, tlId, detailId, nextId, rstId, indId, idleText){
    const tl=g(tlId);if(!tl) return;
    tl.innerHTML='';
    let step=-1;

    flow.forEach((s,i)=>{
      const row=document.createElement('div');
      row.className='b18-s182-step';row.id=`${tlId}-s${i}`;
      const isL=s.dir==='L';const isR=s.dir==='R';const isB=s.dir==='B';
      const leftContent=isL?`<div><span class="b18-s182-msg-tag ${s.type}">${s.msg}</span> <span class="b18-s182-arrow">→</span></div>`:'';
      const rightContent=isR?`<div><span class="b18-s182-arrow">←</span> <span class="b18-s182-msg-tag ${s.type}">${s.msg}</span></div>`:
                         isB?`<div style="text-align:center"><span class="b18-s182-msg-tag ${s.type}">${s.msg}</span></div>`:'';
      row.innerHTML=`<div class="b18-s182-step-left">${leftContent}</div>
        <div class="b18-s182-step-mid"><div class="b18-s182-step-dot"></div></div>
        <div class="b18-s182-step-right">${rightContent}</div>`;
      tl.appendChild(row);
    });

    function update(){
      flow.forEach((_,i)=>{
        const el=g(`${tlId}-s${i}`);if(!el) return;
        if(i<step) el.className='b18-s182-step s182-done';
        else if(i===step) el.className='b18-s182-step s182-active';
        else el.className='b18-s182-step';
      });
      const ind=g(indId);if(ind) ind.textContent=`${Math.max(0,step+1)} / ${flow.length} steps`;
      const nb=g(nextId);if(nb) nb.disabled=step>=flow.length-1;
      const detail=g(detailId);if(!detail) return;
      if(step<0){
        detail.className='b18-s182-detail s182-d-idle';
        detail.innerHTML=`<div class="b18-s182-detail-label">Waiting</div>
          <div class="b18-s182-detail-title">${idleText.title}</div>
          <div class="b18-s182-detail-text">${idleText.text}</div>`;
      } else {
        const s=flow[step];
        detail.className=`b18-s182-detail ${s.cls}`;
        detail.innerHTML=`<div class="b18-s182-detail-label">Step ${step+1}: ${s.from}${s.to?' → '+s.to:''}</div>
          <div class="b18-s182-detail-title"><span class="b18-s182-msg-tag ${s.type}" style="font-size:12px;">${s.msg}</span></div>
          <div class="b18-s182-detail-text">${s.desc}</div>
          ${s.bytes?`<div class="b18-s182-detail-bytes">📦 ${s.bytes}</div>`:''}
          ${s.analogy?`<div class="b18-s182-detail-analogy">${s.analogy}</div>`:''}`;
      }
    }

    const nb=g(nextId);const rb=g(rstId);
    if(nb) nb.addEventListener('click',()=>{if(step<flow.length-1){step++;update();}});
    if(rb) rb.addEventListener('click',()=>{step=-1;update();});
    update();
  }

  buildFlow(FLOW1,'b18-s182-tl1','b18-s182-detail1','b18-s182-next1','b18-s182-rst1','b18-s182-ind1',
    {title:'A TCP connection was just opened',text:'Two nodes just connected at the TCP level. The handshake must be completed before Bitcoin communication can begin.'});
  buildFlow(FLOW2,'b18-s182-tl2','b18-s182-detail2','b18-s182-next2','b18-s182-rst2','b18-s182-ind2',
    {title:'A miner just found block #870,143',text:'The new block is valid. It must be propagated to the entire network as fast as possible before another miner finds a block at the same height.'});

  const tabs=['b18-s182-t1','b18-s182-t2','b18-s182-t3'];
  const panes=['b18-s182-p1','b18-s182-p2','b18-s182-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b18-s182-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b18-s182-pane';});
      const el=g(tid);if(el) el.className='b18-s182-tab s182-act';
      const pe=g(panes[i]);if(pe) pe.className='b18-s182-pane show';
    });
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.1 SIMULATION (Wire Message Inspector)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  const MSGS={
    version:{
      cmd:'version',
      desc:'The first message sent when two nodes connect. Contains the software version, services, timestamp, user agent, and block height.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657273696F6E0000000000',cls:'s181-command',note:'Command: "version" + null padding'},
        {val:'66000000',cls:'s181-length',note:'Payload length: 102 bytes'},
        {val:'3B648D5F',cls:'s181-check',note:'SHA256(SHA256(payload))[0:4]'},
        {val:'80110100',cls:'s181-payload',note:'Protocol version: 70016'},
        {val:'0D04000000000000',cls:'s181-payload',note:'Services flags bitmask'},
        {val:'E2B67F6200000000',cls:'s181-payload',note:'Timestamp (Unix)'},
        {val:'000000000000000000000000',cls:'s181-payload',note:'addr_recv IP + port'},
        {val:'0D04000000000000',cls:'s181-payload',note:'addr_trans services'},
        {val:'00000000000000000000FFFF',cls:'s181-payload',note:'addr_trans IP'},
        {val:'208D',cls:'s181-payload',note:'Port: 8333'},
        {val:'E1B5B4A3C7F34B2E',cls:'s181-payload',note:'Random nonce'},
        {val:'102F5361746F7368693A32372E302E302F',cls:'s181-payload',note:'User agent string'},
        {val:'A6B80D00',cls:'s181-payload',note:'Start height: #907,430'},
        {val:'01',cls:'s181-payload',note:'Relay: true'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'The network identifier code. The first bytes of every message must start with this code.',
         analogy:'Analogy: like the area code in a phone number. If the area code is wrong, the connection is cut immediately without hearing the rest.'},
        {cls:'s181-command',name:'Command', bytes:'"version" + 5x null',
         desc:'A 12-byte command name in ASCII, padded with null bytes. Tells the recipient what type this message is.',
         analogy:'Analogy: like an email subject that always has exactly the same length so the system can read it automatically.'},
        {cls:'s181-length', name:'Length',  bytes:'66 00 00 00',
         desc:'The payload size in bytes (little-endian). Tells the recipient how many bytes to read after the header.',
         analogy:'Analogy: like the "net weight 250g" label on food packaging — the recipient knows exactly how much to take.'},
        {cls:'s181-check',  name:'Checksum',bytes:'3B 64 8D 5F',
         desc:'The first 4 bytes of SHA256(SHA256(payload)). Verifies that the payload wasn’t corrupted in transit.',
         analogy:'Analogy: like a serial number on a banknote — if it doesn’t match, the message is ignored entirely.'},
        {cls:'s181-payload',name:'Payload', bytes:'80 11 01 00 ...',
         desc:'The message contents: version (70016), services flags, timestamp, address information, nonce, user agent, block height, relay flag.',
         analogy:'Analogy: the actual contents of the letter — all the information to be conveyed, wrapped in a standard header.'},
      ],
      showFlags:true,
    },
    verack:{
      cmd:'verack',
      desc:'Handshake confirmation. Sent after receiving a valid version. Has no payload — just a 24-byte header.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657261636B000000000000',cls:'s181-command',note:'Command: "verack" + null padding'},
        {val:'00000000',cls:'s181-length',note:'Payload length: 0 bytes'},
        {val:'5DF6E0E2',cls:'s181-check',note:'Checksum of the empty payload'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'Mainnet network marker.',
         analogy:'Analogy: an official letterhead — the recipient immediately knows this is from the correct Bitcoin network.'},
        {cls:'s181-command',name:'Command', bytes:'"verack" + 6x null',
         desc:'Confirmation that the handshake succeeded. After verack is received on both sides, the official communication session begins.',
         analogy:'Analogy: a handshake after introducing yourselves — "okay, I understand who you are, let’s start talking."'},
        {cls:'s181-length', name:'Length',  bytes:'00 00 00 00',
         desc:'A 0-byte payload. verack is the shortest message in the Bitcoin protocol.',
         analogy:'Analogy: like just nodding without words — no long explanation needed, just confirmation.'},
        {cls:'s181-check',  name:'Checksum',bytes:'5D F6 E0 E2',
         desc:'Checksum of the empty payload. This value is always the same for any verack.',
         analogy:'Analogy: a signature on an empty document that’s always identical because there’s no differing content.'},
      ],
      showFlags:false,
    },
    inv:{
      cmd:'inv',
      desc:'Inventory — announces to a peer that the node has a new transaction or block, without sending the data directly. An interested peer replies with getdata.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'696E760000000000000000',cls:'s181-command',note:'Command: "inv" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 bytes'},
        {val:'B3F9E1A4',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item in the inventory'},
        {val:'01000000',cls:'s181-payload',note:'Type: MSG_TX (0x01) — transaction. 0x02 = block'},
        {val:'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2',cls:'s181-payload',note:'32-byte txid hash'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Mainnet network marker.',
         analogy:'Analogy: an envelope with the official Bitcoin logo in the top-left corner.'},
        {cls:'s181-command',name:'Command', bytes:'"inv"',
         desc:'Inventory announcement. Efficient because the node doesn’t send the full data directly — it just announces availability.',
         analogy:'Analogy: like a "New newspaper!" poster in front of a kiosk — not forcing everyone to buy, just announcing.'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00',
         desc:'37 bytes: 1 byte count + (4 byte type + 32 byte hash) per item. Can contain up to 50,000 items at once.',
         analogi:''},
        {cls:'s181-check',  name:'Checksum',bytes:'B3 F9 E1 A4', desc:'Verifies payload integrity.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 01000000 | hash...',
         desc:'1 item, type MSG_TX (transaction), followed by a 32-byte txid. A peer that wants this transaction will send getdata.',
         analogy:'Analogy: a product catalog list — just product IDs, not the products themselves. If interested, then order.'},
      ],
      showFlags:false,
    },
    getdata:{
      cmd:'getdata',
      desc:'Request specific data. The format is identical to inv but it means: "send me this data." Sent in response to inv.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'6765746461746100000000',cls:'s181-command',note:'Command: "getdata" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 bytes'},
        {val:'C4A8E3F2',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item requested'},
        {val:'02000000',cls:'s181-payload',note:'Type: MSG_BLOCK (0x02) — request a block'},
        {val:'00000000000000000001A4B2C8D9E7F3A6B5C4D1E2F0A9B8C7D6E5F4A3B2C1D0',cls:'s181-payload',note:'Hash of the requested block'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Mainnet network marker.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"getdata"',
         desc:'Request data from a peer. The peer will respond by sending the tx, block, or other requested data.',
         analogy:'Analogy: after seeing the catalog (inv), you fill out an order form (getdata) — "I want this item number."'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00', desc:'A 37-byte payload, format identical to inv.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'C4 A8 E3 F2', desc:'Verifies integrity.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 02000000 | hash...',
         desc:'1 item, type MSG_BLOCK, followed by a 32-byte block hash. The node will respond by sending the full block.',
         analogy:'Analogy: an exact, specific order number — it can’t be ambiguous, it must be the precise hash.'},
      ],
      showFlags:false,
    },
    ping:{
      cmd:'ping',
      desc:'Keepalive — verifies the connection is still alive. The peer must reply with a pong containing the same nonce. If there’s no response, the connection is considered dead.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'70696E670000000000000000',cls:'s181-command',note:'Command: "ping" + null padding'},
        {val:'08000000',cls:'s181-length',note:'Payload length: 8 bytes'},
        {val:'D4F6A2B3',cls:'s181-check',note:'Checksum'},
        {val:'A3F8C2E1D4B7920F',cls:'s181-payload',note:'Nonce: 8 random bytes, must be echoed back'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Mainnet network marker.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"ping"',
         desc:'Keepalive request. A peer that doesn’t respond within 20 minutes is disconnected automatically.',
         analogy:'Analogy: like knocking on a door and waiting for an answer — "hello, are you still there?" No answer = the door is closed.'},
        {cls:'s181-length', name:'Length',  bytes:'08 00 00 00', desc:'An 8-byte payload — just the nonce.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'D4 F6 A2 B3', desc:'Payload checksum.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'A3 F8 C2 E1 D4 B7 92 0F',
         desc:'8 random nonce bytes. The peer must echo back the same nonce in the pong message. This ensures the pong is genuinely a response to this ping.',
         analogy:'Analogy: you say a random secret word, and your friend has to repeat it back — proving they really heard and are responsive.'},
      ],
      showFlags:false,
    },
  };

  const FLAGS=[
    {bit:'0x01',name:'NODE_NETWORK',    on:true, desc:'The node stores the full blockchain and can serve historical blocks to peers that need IBD.'},
    {bit:'0x02',name:'NODE_GETUTXO',    on:false,desc:'Deprecated BIP 64. Allows direct UTXO queries. Hardly used anymore.'},
    {bit:'0x04',name:'NODE_BLOOM',      on:true, desc:'The node supports BIP 37 bloom filters. Many modern nodes disable this because BIP 37 is deprecated.'},
    {bit:'0x08',name:'NODE_WITNESS',    on:true, desc:'The node supports SegWit (BIP 141). Required for all modern nodes.'},
    {bit:'0x10',name:'NODE_XTHIN',      on:false,desc:'Xthin block relay. A compact-blocks alternative that’s no longer used.'},
    {bit:'0x40',name:'NODE_COMPACT_FILTERS',on:true,desc:'The node supports BIP 157/158 compact block filters for modern SPV clients.'},
    {bit:'0x0400',name:'NODE_NETWORK_LIMITED',on:false,desc:'Pruned node — stores only the last 288 blocks. Can’t serve a full IBD.'},
  ];

  let currentMsg='version';

  function renderHex(msgId){
    const msg=MSGS[msgId];if(!msg) return;
    const body=g('b18-s181-hex-body');const cmd=g('b18-s181-hex-cmd');if(!body||!cmd) return;
    cmd.textContent=msg.cmd;body.innerHTML='';
    let allBytes=[];
    msg.bytes.forEach(b=>{
      const hex=b.val.replace(/\s/g,'');
      for(let i=0;i<hex.length;i+=2) allBytes.push({hex:hex.slice(i,i+2),cls:b.cls,note:b.note});
    });
    let offset=0;
    for(let row=0;row<allBytes.length;row+=16){
      const rowEl=document.createElement('div');rowEl.className='b18-s181-hex-row';
      const off=document.createElement('span');off.className='b18-s181-hex-offset';
      off.textContent=offset.toString(16).padStart(4,'0')+':';
      rowEl.appendChild(off);
      const bytesEl=document.createElement('div');bytesEl.className='b18-s181-hex-bytes';
      for(let i=row;i<Math.min(row+16,allBytes.length);i++){
        const b=allBytes[i];
        const span=document.createElement('span');
        span.className='b18-s181-byte '+b.cls;
        span.textContent=b.hex;span.title=b.note;
        bytesEl.appendChild(span);
      }
      rowEl.appendChild(bytesEl);body.appendChild(rowEl);offset+=16;
    }
  }

  function renderFields(msgId){
    const msg=MSGS[msgId];if(!msg) return;
    const el=g('b18-s181-fields');if(!el) return;
    el.innerHTML='';
    msg.fields.forEach(f=>{
      const div=document.createElement('div');div.className=`b18-s181-field ${f.cls}`;
      let html=`<div class="b18-s181-field-top">
        <div class="b18-s181-field-name">${f.name}</div>
        <div class="b18-s181-field-bytes">${f.bytes}</div>
        <div class="b18-s181-field-desc">${f.desc}</div>
      </div>`;
      if(f.analogy) html+=`<div class="b18-s181-field-analogy">${f.analogy}</div>`;
      div.innerHTML=html;
      el.appendChild(div);
    });
    const flagsEl=g('b18-s181-flags');const flagsInner=g('b18-s181-flags-inner');
    if(flagsEl&&flagsInner){
      flagsEl.style.display=msg.showFlags?'flex':'none';
      if(msg.showFlags){
        flagsInner.innerHTML='';
        FLAGS.forEach(f=>{
          const div=document.createElement('div');div.className=`b18-s181-flag ${f.on?'s181-on':'s181-off'}`;
          div.innerHTML=`<div class="b18-s181-flag-bit">${f.bit}</div>
            <div class="b18-s181-flag-name">${f.name}</div>
            <div class="b18-s181-flag-desc">${f.desc}</div>`;
          flagsInner.appendChild(div);
        });
      }
    }
  }

  function selectMsg(id){
    currentMsg=id;
    document.querySelectorAll('.b18-s181-msg-btn').forEach(b=>b.classList.toggle('s181-act',b.dataset.msg===id));
    renderHex(id);renderFields(id);
  }

  // Build msg buttons
  (function(){
    const el=g('b18-s181-msgs');if(!el) return;
    Object.keys(MSGS).forEach(key=>{
      const btn=document.createElement('button');
      btn.className='b18-s181-msg-btn'+(key==='version'?' s181-act':'');
      btn.dataset.msg=key;btn.textContent=key;
      btn.addEventListener('click',()=>selectMsg(key));
      el.appendChild(btn);
    });
  })();

  function buildTopology(){
    const svg=g('b18-s181-net-svg');if(!svg) return;
    svg.innerHTML='';
    const cx=280,cy=130;
    const outPeers=[
      {x:80, y:40},  {x:200,y:25},  {x:340,y:20},  {x:460,y:45},
      {x:505,y:155}, {x:435,y:235}, {x:145,y:240}, {x:60, y:185},
    ];
    const inPeers=[{x:285,y:240},{x:350,y:185}];
    function mkLine(x1,y1,x2,y2,col,dash){
      const l=document.createElementNS(NS,'line');
      l.setAttribute('x1',x1);l.setAttribute('y1',y1);
      l.setAttribute('x2',x2);l.setAttribute('y2',y2);
      l.setAttribute('stroke',col);l.setAttribute('stroke-width','1.5');
      if(dash) l.setAttribute('stroke-dasharray','4,3');
      svg.appendChild(l);
    }
    function mkCircle(x,y,r,fill,stroke){
      const c=document.createElementNS(NS,'circle');
      c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
      c.setAttribute('fill',fill);c.setAttribute('stroke',stroke);c.setAttribute('stroke-width','1.5');
      svg.appendChild(c);
    }
    function mkText(x,y,txt,col,sz,bold){
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',x);t.setAttribute('y',y);
      t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
      t.setAttribute('font-size',sz||9);t.setAttribute('font-family','Sora,sans-serif');
      t.setAttribute('fill',col||'#3A3A35');
      if(bold) t.setAttribute('font-weight','600');
      t.textContent=txt;svg.appendChild(t);
    }
    outPeers.forEach((p,i)=>{
      mkLine(cx,cy,p.x,p.y,'rgba(83,74,183,0.5)',false);
      mkCircle(p.x,p.y,13,'#EEEDFE','#534AB7');
      mkText(p.x,p.y,'OUT','#534AB7',7,true);
    });
    inPeers.forEach(p=>{
      mkLine(cx,cy,p.x,p.y,'rgba(15,110,86,0.4)',true);
      mkCircle(p.x,p.y,11,'#EAF3DE','#0F6E56');
      mkText(p.x,p.y,'IN','#0F6E56',7,true);
    });
    mkCircle(cx,cy,22,'#534AB7','#3C3489');
    mkText(cx,cy-5,'Node','#fff',9,true);
    mkText(cx,cy+7,'You','#fff',9,true);
    // Legend
    mkLine(15,265,35,265,'rgba(83,74,183,0.5)',false);
    mkText(95,265,'8 outbound (you choose)','#534AB7',8);
    mkLine(210,265,230,265,'rgba(15,110,86,0.4)',true);
    mkText(295,265,'inbound (passive)','#0F6E56',8);
    const note=g('b18-s181-net-note');
    if(note) note.textContent='8 outbound connections (solid purple lines) are actively chosen by your node — you decide who to connect to. Inbound connections (dashed green lines) are initiated by other peers that come to you. Outbound is more trusted because it’s hard for an attacker to isolate your node when you choose the peers.';
    // Services flags
    const svc=g('b18-s181-svc-flags');if(!svc) return;
    svc.innerHTML='';
    FLAGS.forEach(f=>{
      const div=document.createElement('div');div.className=`b18-s181-flag ${f.on?'s181-on':'s181-off'}`;
      div.innerHTML=`<div class="b18-s181-flag-bit">${f.bit}</div>
        <div class="b18-s181-flag-name">${f.name}</div>
        <div class="b18-s181-flag-desc">${f.desc}</div>`;
      svc.appendChild(div);
    });
  }

  const t1=g('b18-s181-t1'),t2=g('b18-s181-t2');
  const p1=g('b18-s181-p1'),p2=g('b18-s181-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s181-tab s181-act';t2.className='b18-s181-tab';
    p1.className='b18-s181-pane show';p2.className='b18-s181-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s181-tab s181-act';t1.className='b18-s181-tab';
    p2.className='b18-s181-pane show';p1.className='b18-s181-pane';
    buildTopology();
  });

  selectMsg('version');
  buildTopology();
})();

// ============================================================
// PAGE 24 · BAB 21 · NAVIGATION
// ============================================================
function showSectionInContentB21(sectionId, sbId) {
  document.querySelectorAll('#page-bab21 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab21 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab21-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 24 · BAB 21 · TOPBAR
// ============================================================
document.getElementById('back-home-b21').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b21').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 24 · BAB 21 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab21').addEventListener('click', () => navigate('page-bab21'));

// ============================================================
// ============================================================
// PAGE 24 · BAB 21 · SIDEBAR EVENTS (21.1 - 21.9)
// ============================================================
document.getElementById('sb-21-1').addEventListener('click', () => showSectionInContentB21('section-21-1', 'sb-21-1'));
document.getElementById('sb-21-2').addEventListener('click', () => showSectionInContentB21('section-21-2', 'sb-21-2'));
document.getElementById('sb-21-3').addEventListener('click', () => showSectionInContentB21('section-21-3', 'sb-21-3'));
document.getElementById('sb-21-4').addEventListener('click', () => showSectionInContentB21('section-21-4', 'sb-21-4'));
document.getElementById('sb-21-5').addEventListener('click', () => showSectionInContentB21('section-21-5', 'sb-21-5'));
document.getElementById('sb-21-6').addEventListener('click', () => showSectionInContentB21('section-21-6', 'sb-21-6'));
document.getElementById('sb-21-7').addEventListener('click', () => showSectionInContentB21('section-21-7', 'sb-21-7'));
document.getElementById('sb-21-8').addEventListener('click', () => showSectionInContentB21('section-21-8', 'sb-21-8'));
document.getElementById('sb-21-9').addEventListener('click', () => showSectionInContentB21('section-21-9', 'sb-21-9'));
  document.getElementById('sb-lab-c1').addEventListener('click', () => showSectionInContentB21('section-lab-c1', 'sb-lab-c1'));
  document.getElementById('sb-lab-c2').addEventListener('click', () => showSectionInContentB21('section-lab-c2', 'sb-lab-c2'));
  document.getElementById('sb-lab-c3').addEventListener('click', () => showSectionInContentB21('section-lab-c3', 'sb-lab-c3'));
  document.getElementById('sb-lab-c4').addEventListener('click', () => showSectionInContentB21('section-lab-c4', 'sb-lab-c4'));
  document.getElementById('sb-lab-c5').addEventListener('click', () => showSectionInContentB21('section-lab-c5', 'sb-lab-c5'));
  document.getElementById('sb-lab-c6').addEventListener('click', () => showSectionInContentB21('section-lab-c6', 'sb-lab-c6'));
  document.getElementById('sb-lab-c7').addEventListener('click', () => showSectionInContentB21('section-lab-c7', 'sb-lab-c7'));
  document.getElementById('sb-lab-d1').addEventListener('click', () => showSectionInContentB21('section-lab-d1', 'sb-lab-d1'));
  document.getElementById('sb-lab-d2').addEventListener('click', () => showSectionInContentB21('section-lab-d2', 'sb-lab-d2'));
  document.getElementById('sb-lab-f1').addEventListener('click', () => showSectionInContentB21('section-lab-f1', 'sb-lab-f1'));
  document.getElementById('sb-lab-f2').addEventListener('click', () => showSectionInContentB21('section-lab-f2', 'sb-lab-f2'));
  document.getElementById('sb-lab-f3').addEventListener('click', () => showSectionInContentB21('section-lab-f3', 'sb-lab-f3'));


// ============================================================
// PAGE 24 · BAB 21 · NAV BUTTONS
// ============================================================
document.getElementById('page-bab21').addEventListener('click', function(e) {
  var btn = e.target.closest('.p-nav-btn.p-nav-active');
  if (!btn) return;
  var target = btn.getAttribute('data-target');
  var sb     = btn.getAttribute('data-sb');
  if (target && sb) showSectionInContentB21(target, sb);
});

// ============================================================
// PAGE 24 · BAB 21 · 21.2 SIMULATION (TX Builder + Script Inspector + Stack Executor)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const ADDR={
    p2pk:  {alice:'(pubKey directly)',bob:'(pubKey directly)'},
    p2pkh: {alice:'1A7f2...xKm',bob:'1B3c9...dPq'},
    p2sh:  {alice:'3J98t...nMf',bob:'3Abc1...qRs'},
    p2wpkh:{alice:'bc1qa7f2...xk',bob:'bc1q3c9d...qp'},
    p2wsh: {alice:'bc1qw5x...nm',bob:'bc1qr2t...ys'},
    p2tr:  {alice:'bc1pa7f2...xk',bob:'bc1p3c9d...qp'},
  };

  const LOCK_SCRIPTS={
    p2pk:  function(s){return '<'+s+'PubKey> OP_CHECKSIG';},
    p2pkh: function(s){return 'OP_DUP OP_HASH160 <'+s+'PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG';},
    p2sh:  function(s){return 'OP_HASH160 <'+s+'ScriptHash> OP_EQUAL';},
    p2wpkh:function(s){return 'OP_0 <'+s+'PubKeyHash>';},
    p2wsh: function(s){return 'OP_0 <'+s+'ScriptHash32>';},
    p2tr:  function(s){return 'OP_1 <'+s+'TweakedPubKey>';},
  };

  const SCRIPTS={
    p2pk:{label:'P2PK',note:'P2PK: Bitcoin’s earliest format. Satoshi used this for the early block rewards. The public key is directly in the locking script without hashing. No longer used because of pubKey exposure before spending.',
      lockOps:[
        {t:'<pubKey>',cls:'oc-data',hex:'33-65 bytes',info:'The public key is embedded directly in the locking script without hashing. Anyone looking at the blockchain can see the public key before the UTXO is spent.'},
        {t:'OP_CHECKSIG',cls:'oc-op',hex:'0xac',info:'Pop the signature and pubKey from the stack, verify the signature is valid. If valid, push TRUE. The only execution opcode in P2PK.'},
      ],
      unlockOps:[
        {t:'<signature>',cls:'oc-sig',hex:'71-72 bytes (DER)',info:'Only the signature is needed — no need to include the pubKey because it’s already in the locking script.'},
      ],
      steps:[
        {ops:['<signature>','<pubKey>','OP_CHECKSIG'],stk:[],push:'<signature>',desc:'Push the signature onto the stack'},
        {stk:['<signature>'],push:'<pubKey>',desc:'Load the pubKey from the locking script'},
        {stk:['<signature>','<pubKey>'],pop:2,push:'TRUE',desc:'OP_CHECKSIG: verify the signature is valid!',final:true},
      ]},
    p2pkh:{label:'P2PKH',note:'P2PKH: the most common format since 2009. The address starts with "1". The public key is hashed before being stored — more private than P2PK because the pubKey isn’t revealed until spending.',
      lockOps:[
        {t:'OP_DUP',cls:'oc-op',hex:'0x76',info:'Duplicate the top item of the stack. Needed so the pubKey can be used twice: once to be hashed and compared, once to verify the signature.'},
        {t:'OP_HASH160',cls:'oc-op',hex:'0xa9',info:'Pop an item from the stack, apply SHA256 then RIPEMD160, push the result. Turns the pubKey (33 bytes) into a pubKeyHash (20 bytes).'},
        {t:'<pubKeyHash>',cls:'oc-hash',hex:'20 bytes',info:'The hash of the UTXO owner’s public key. Anyone who provides a pubKey whose hash matches and a valid signature can spend it.'},
        {t:'OP_EQUALVERIFY',cls:'oc-op',hex:'0x88',info:'Pop two items from the stack, compare. If they aren’t equal, the script fails. Ensures the provided pubKey really belongs to the original owner.'},
        {t:'OP_CHECKSIG',cls:'oc-op',hex:'0xac',info:'Pop the signature and pubKey from the stack. Verify the signature is valid for this transaction. If valid, push TRUE.'},
      ],
      unlockOps:[
        {t:'<signature>',cls:'oc-sig',hex:'71-72 bytes (DER)',info:'An ECDSA signature created with the private key. Proves ownership of the private key matching the pubKey whose hash is in the locking script.'},
        {t:'<pubKey>',cls:'oc-data',hex:'33 bytes (compressed)',info:'The public key whose hash must match the pubKeyHash in the locking script. Only revealed when the UTXO is spent.'},
      ],
      steps:[
        {ops:['<signature>','<pubKey>','OP_DUP','OP_HASH160','<pubKeyHash>','OP_EQUALVERIFY','OP_CHECKSIG'],stk:[],push:'<signature>',desc:'Push the signature onto the stack'},
        {stk:['<signature>'],push:'<pubKey>',desc:'Push the pubKey onto the stack'},
        {stk:['<signature>','<pubKey>'],push:'<pubKey>',desc:'OP_DUP: duplicate the top of the stack'},
        {stk:['<signature>','<pubKey>','<pubKey>'],pop:1,push:'<pubKeyHash computed>',desc:'OP_HASH160: hash the pubKey to 20 bytes'},
        {stk:['<signature>','<pubKey>','<pubKeyHash computed>'],push:'<pubKeyHash locked>',desc:'Push the pubKeyHash from the locking script'},
        {stk:['<signature>','<pubKey>','<pubKeyHash computed>','<pubKeyHash locked>'],pop:2,desc:'OP_EQUALVERIFY: matches, continue'},
        {stk:['<signature>','<pubKey>'],pop:2,push:'TRUE',desc:'OP_CHECKSIG: valid!',final:true},
      ]},
    p2sh:{label:'P2SH',note:'P2SH (BIP 16): hides a complex script behind a 20-byte hash. The address starts with "3". The recipient reveals the redeem script when spending.',
      lockOps:[
        {t:'OP_HASH160',cls:'oc-op',hex:'0xa9',info:'Hash the redeem script provided by the sender to compare with the scriptHash in the locking script.'},
        {t:'<scriptHash>',cls:'oc-hash',hex:'20 bytes',info:'The hash of the redeem script. Only the hash is stored on the blockchain until the UTXO is spent.'},
        {t:'OP_EQUAL',cls:'oc-op',hex:'0x87',info:'Compare the redeem script hash with the scriptHash in the locking script. If it matches, continue executing the redeem script.'},
      ],
      unlockOps:[
        {t:'<...data...>',cls:'oc-data',hex:'per the redeem script',info:'The data required by the redeem script (signature, preimage, etc.).'},
        {t:'<redeemScript>',cls:'oc-hash',hex:'variable bytes',info:'The actual script revealed when spending — this is what’s hashed into the scriptHash in the locking script.'},
      ],
      steps:[
        {ops:['<data>','<redeemScript>','OP_HASH160','<scriptHash>','OP_EQUAL','[execute redeemScript]'],stk:[],push:'<data>',desc:'Push the data required by the redeem script'},
        {stk:['<data>'],push:'<redeemScript>',desc:'Push the redeem script'},
        {stk:['<data>','<redeemScript>'],pop:1,push:'<scriptHash computed>',desc:'OP_HASH160: hash the redeemScript to 20 bytes'},
        {stk:['<data>','<scriptHash computed>'],push:'<scriptHash locked>',desc:'Push the scriptHash from the locking script'},
        {stk:['<data>','<scriptHash computed>','<scriptHash locked>'],pop:2,desc:'OP_EQUAL: hash matches, continue execution'},
        {stk:['<data>'],push:'TRUE',desc:'redeemScript execution succeeded!',final:true},
      ]},
    p2wpkh:{label:'P2WPKH',note:'P2WPKH (BIP 141): Native SegWit v0. Witness data counts as 1/4 weight. Input ~68 vByte vs P2PKH ~148 vByte. The address starts with "bc1q".',
      lockOps:[
        {t:'OP_0',cls:'oc-ver',hex:'0x00',info:'Witness version 0. Together with the 20-byte witness program, it determines this is P2WPKH. The node runs the P2PKH logic implicitly using data from the witness field.'},
        {t:'<20-byte-hash>',cls:'oc-hash',hex:'20 bytes (witness program)',info:'The hash of the compressed public key (SHA256+RIPEMD160). Called the witness program. Stored in the scriptPubKey, not in the scriptSig when spending.'},
      ],
      unlockOps:[
        {t:'(scriptSig empty)',cls:'oc-data',hex:'0 bytes',info:'P2WPKH has no scriptSig. All data is in the witness field, separate from the old block size.'},
        {t:'<witness: sig>',cls:'oc-sig',hex:'71-72 bytes (1/4 weight)',info:'The signature in the witness field. Witness data counts as 1/4 weight unit.'},
        {t:'<witness: pubKey>',cls:'oc-data',hex:'33 bytes (1/4 weight)',info:'The public key in the witness field. Also gets the 1/4 weight discount.'},
      ],
      steps:[
        {ops:['<sig>(witness)','<pubKey>(witness)','[implicit: OP_DUP]','[implicit: OP_HASH160]','[implicit: OP_EQUALVERIFY]','[implicit: OP_CHECKSIG]'],stk:[],push:'<sig>',desc:'Push the witness signature onto the stack'},
        {stk:['<sig>'],push:'<pubKey>',desc:'Push the witness pubKey'},
        {stk:['<sig>','<pubKey>'],push:'<pubKey>',desc:'Implicit OP_DUP'},
        {stk:['<sig>','<pubKey>','<pubKey>'],pop:1,push:'<hash computed>',desc:'Implicit OP_HASH160'},
        {stk:['<sig>','<pubKey>','<hash computed>'],push:'<witness program>',desc:'Load the witness program from the locking script'},
        {stk:['<sig>','<pubKey>','<hash computed>','<witness program>'],pop:2,desc:'Implicit OP_EQUALVERIFY: matches!'},
        {stk:['<sig>','<pubKey>'],pop:2,push:'TRUE',desc:'Implicit OP_CHECKSIG: valid!',final:true},
      ]},
    p2wsh:{label:'P2WSH',note:'P2WSH (BIP 141): the P2SH version of SegWit v0. 32-byte script hash (SHA256). Witness data gets the weight discount. Ideal for SegWit multisig. A longer "bc1q" address.',
      lockOps:[
        {t:'OP_0',cls:'oc-ver',hex:'0x00',info:'Witness version 0. Together with the 32-byte witness program, it determines this is P2WSH.'},
        {t:'<32-byte-scriptHash>',cls:'oc-hash',hex:'32 bytes (SHA256)',info:'The SHA256 of the witness script. P2WSH uses SHA256 only (32 bytes), more collision-resistant than P2SH which uses SHA256+RIPEMD160 (20 bytes).'},
      ],
      unlockOps:[
        {t:'(scriptSig empty)',cls:'oc-data',hex:'0 bytes',info:'Like P2WPKH, there’s no scriptSig. All data is in the witness field.'},
        {t:'<witness: data>',cls:'oc-data',hex:'per the witness script',info:'The data required by the witness script. It’s in the witness field so it gets the 1/4 weight discount.'},
        {t:'<witness: witnessScript>',cls:'oc-hash',hex:'variable (1/4 weight)',info:'The actual script, revealed in the witness field. Hashed with SHA256 and compared with the 32-byte scriptHash in the locking script.'},
      ],
      steps:[
        {ops:['<data>(witness)','<witnessScript>(witness)','[SHA256 witnessScript]','[compare 32-byte-hash]','[execute witnessScript]'],stk:[],push:'<data>',desc:'Push the witness data onto the stack'},
        {stk:['<data>'],push:'<witnessScript>',desc:'Push the witness script'},
        {stk:['<data>','<witnessScript>'],pop:1,push:'<SHA256 computed>',desc:'SHA256: hash the witnessScript to 32 bytes'},
        {stk:['<data>','<SHA256 computed>'],push:'<32-byte-hash locked>',desc:'Load the 32-byte hash from the locking script'},
        {stk:['<data>','<SHA256 computed>','<32-byte-hash locked>'],pop:2,desc:'Compare: hash matches, continue'},
        {stk:['<data>'],push:'TRUE',desc:'witnessScript execution succeeded!',final:true},
      ]},
    p2tr:{label:'P2TR',note:'P2TR (BIP 340-342): Taproot, active Nov 2021. Key path: one Schnorr signature, 57.5 vByte, the most efficient. Script path: reveal one of the scripts hidden in the MAST. The address starts with "bc1p".',
      lockOps:[
        {t:'OP_1',cls:'oc-ver',hex:'0x51',info:'Witness version 1. Tells the node this is a Taproot output (SegWit v1). OP_1 differs from OP_0 in P2WPKH/P2WSH.'},
        {t:'<32-byte-tweaked-pubkey>',cls:'oc-hash',hex:'32 bytes (x-only)',info:'Tweaked public key: pubKey + hash_taptweak(pubKey + merkle_root) x G. Only the x coordinate (32 bytes). Can hide the entire script tree inside the tweak.'},
      ],
      unlockOps:[
        {t:'(scriptSig empty)',cls:'oc-data',hex:'0 bytes',info:'No scriptSig. Everything is in the witness field.'},
        {t:'<schnorr_sig>',cls:'oc-sig',hex:'64 bytes flat',info:'A Schnorr signature is only 64 bytes: r (32 bytes) + s (32 bytes) joined directly without DER encoding. Smaller than ECDSA’s 71-72 bytes.'},
      ],
      steps:[
        {ops:['<schnorr_sig>(witness)','[load tweaked_pubkey from lock]','OP_CHECKSIG (Schnorr)'],stk:[],push:'<schnorr_sig>',desc:'Push the Schnorr signature (64 bytes)'},
        {stk:['<schnorr_sig>'],push:'<tweaked_pubkey>',desc:'Load the tweaked pubkey from the locking script'},
        {stk:['<schnorr_sig>','<tweaked_pubkey>'],pop:2,push:'TRUE',desc:'Schnorr CHECKSIG: valid!',final:true},
      ]},
  };

  let abType='p2wpkh';let txSent=false;

  function buildTypeBtns(){
    const el=g('b21-s212-type-btns');if(!el) return;el.innerHTML='';
    Object.keys(SCRIPTS).forEach(function(key){
      const btn=document.createElement('button');btn.className='b21-s212-type-btn'+(key===abType?' act':'');
      btn.textContent=SCRIPTS[key].label;
      btn.addEventListener('click',function(){abType=key;txSent=false;buildTypeBtns();resetAB();renderAB();});
      el.appendChild(btn);
    });
  }

  function renderAB(){
    const a=ADDR[abType]||ADDR.p2wpkh;
    const aa=g('b21-s212-alice-addr');if(aa) aa.textContent=a.alice;
    const ba=g('b21-s212-bob-addr');if(ba) ba.textContent=a.bob;
    const lf=LOCK_SCRIPTS[abType]||LOCK_SCRIPTS.p2wpkh;
    const al=g('b21-s212-alice-lock');if(al) al.textContent=lf('alice');
    const bl=g('b21-s212-bob-lock');if(bl) bl.textContent=lf('bob');
    const cl=g('b21-s212-change-lock');if(cl) cl.textContent=lf('alice');
  }

  function resetAB(){
    txSent=false;
    const au=g('b21-s212-alice-utxo');if(au) au.classList.remove('spent');
    const bu=g('b21-s212-bob-utxo');if(bu) bu.classList.remove('received');
    const cu=g('b21-s212-change-utxo');if(cu) cu.classList.remove('received');
    const mn=g('b21-s212-miner');if(mn) mn.classList.remove('show');
    const tb=g('b21-s212-tx-box');if(tb) tb.innerHTML='TX<br>pending';
    const sb=g('b21-s212-send');if(sb){sb.disabled=false;sb.textContent='Send Transaction';}
  }

  const sendBtn=g('b21-s212-send');
  if(sendBtn) sendBtn.addEventListener('click',function(){
    if(txSent) return;txSent=true;
    sendBtn.disabled=true;sendBtn.textContent='Confirmed ✓';
    const au=g('b21-s212-alice-utxo');if(au) au.classList.add('spent');
    const tb=g('b21-s212-tx-box');if(tb) tb.innerHTML='TX<br>confirmed';
    setTimeout(function(){
      const bu=g('b21-s212-bob-utxo');if(bu) bu.classList.add('received');
      const cu=g('b21-s212-change-utxo');if(cu) cu.classList.add('received');
      const mn=g('b21-s212-miner');if(mn) mn.classList.add('show');
    },400);
  });
  const abReset=g('b21-s212-ab-reset');
  if(abReset) abReset.addEventListener('click',function(){resetAB();renderAB();});

  let siSc='p2pkh';let siOpIdx=-1;

  function buildSiBtns(){
    const el=g('b21-s212-si-btns');if(!el) return;el.innerHTML='';
    Object.keys(SCRIPTS).forEach(function(key){
      const btn=document.createElement('button');btn.className='b21-s212-si-btn'+(key===siSc?' act':'');
      btn.textContent=SCRIPTS[key].label;btn.addEventListener('click',function(){siSc=key;siOpIdx=-1;renderSI();});
      el.appendChild(btn);
    });
  }

  function renderSI(){
    buildSiBtns();
    const dispEl=g('b21-s212-si-display');if(!dispEl) return;
    dispEl.innerHTML='';
    const sc=SCRIPTS[siSc];
    const ulbl=document.createElement('div');ulbl.className='b21-s212-si-lbl';
    ulbl.textContent='Unlocking script (scriptSig / witness):';dispEl.appendChild(ulbl);
    const urow=document.createElement('div');urow.className='b21-s212-oprow';
    sc.unlockOps.forEach(function(op,i){
      const b=document.createElement('div');b.className='b21-s212-op '+op.cls+(siOpIdx===('u'+i)?' selected':'');
      b.textContent=op.t;b.addEventListener('click',function(){siOpIdx=siOpIdx===('u'+i)?-1:('u'+i);renderSI();showSiDet(op);});
      urow.appendChild(b);
      if(i<sc.unlockOps.length-1){const p=document.createElement('div');p.style.cssText='font-size:11px;color:#52524C;padding:0 2px;';p.textContent='+';urow.appendChild(p);}
    });
    dispEl.appendChild(urow);
    const arr=document.createElement('div');arr.className='b21-s212-si-arr';
    arr.textContent='↓ combined with the locking script ↓';dispEl.appendChild(arr);
    const llbl=document.createElement('div');llbl.className='b21-s212-si-lbl';
    llbl.textContent='Locking script (scriptPubKey) — locked when the output is created:';dispEl.appendChild(llbl);
    const lrow=document.createElement('div');lrow.className='b21-s212-oprow';
    sc.lockOps.forEach(function(op,i){
      const b=document.createElement('div');b.className='b21-s212-op '+op.cls+(siOpIdx===('l'+i)?' selected':'');
      b.textContent=op.t;b.addEventListener('click',function(){siOpIdx=siOpIdx===('l'+i)?-1:('l'+i);renderSI();showSiDet(op);});
      lrow.appendChild(b);
    });
    dispEl.appendChild(lrow);
    const det=document.createElement('div');det.className='b21-s212-si-detail';det.id='b21-s212-opcode-det';
    det.innerHTML='<div style="font-size:10px;font-family:\'Sora\',sans-serif;color:#52524C;">Click an opcode for an explanation</div>';
    dispEl.appendChild(det);
    const note=document.createElement('div');note.className='b21-s212-si-note';note.textContent=sc.note;dispEl.appendChild(note);
  }

  function showSiDet(op){
    const det=g('b21-s212-opcode-det');if(!det) return;
    det.innerHTML='<div class="b21-s212-si-detail-name">'+bsEscHTML(op.t)+'</div>'+
      '<div class="b21-s212-si-detail-hex">hex: '+op.hex+'</div>'+
      '<div class="b21-s212-si-detail-desc">'+op.info+'</div>';
  }

  let seSc='p2pkh';let seStep=0;

  function buildSeBtns(){
    const el=g('b21-s212-se-btns');if(!el) return;el.innerHTML='';
    Object.keys(SCRIPTS).forEach(function(key){
      const btn=document.createElement('button');btn.className='b21-s212-si-btn'+(key===seSc?' act':'');
      btn.textContent=SCRIPTS[key].label;btn.addEventListener('click',function(){seSc=key;seStep=0;renderSE();});
      el.appendChild(btn);
    });
  }

  function renderSE(){
    buildSeBtns();
    const sc=SCRIPTS[seSc];const steps=sc.steps;
    const scriptEl=g('b21-s212-exec-script');const stackEl=g('b21-s212-stack');
    const lblEl=g('b21-s212-step-lbl');const resEl=g('b21-s212-result');
    if(!scriptEl||!stackEl) return;
    const allOps=steps[0].ops||[].concat(sc.unlockOps.map(function(o){return o.t;}),sc.lockOps.map(function(o){return o.t;}));
    scriptEl.innerHTML='';
    allOps.forEach(function(op,i){
      const div=document.createElement('div');div.className='b21-s212-exec-op';div.textContent=op;
      if(seStep>0&&i<seStep-1) div.classList.add('done');
      if(seStep>0&&i===seStep-1) div.classList.add('cur');
      scriptEl.appendChild(div);
    });
    stackEl.innerHTML='';
    if(seStep>0){
      const sd=steps[Math.min(seStep-1,steps.length-1)];
      const stk=(sd.stk||[]).slice();
      if(sd.push) stk.push(sd.push);
    if(stk.length===0){const e=document.createElement('div');e.className='b21-s212-stack-empty';e.textContent='(empty)';stackEl.appendChild(e);}
      else stk.forEach(function(item){const d=document.createElement('div');d.className='b21-s212-stack-item';d.textContent=item;stackEl.appendChild(d);});
    } else {const e=document.createElement('div');e.className='b21-s212-stack-empty';e.textContent='(empty)';stackEl.appendChild(e);}
    if(lblEl) lblEl.textContent=seStep===0?'Press Step to start executing the script':'Step '+seStep+'/'+steps.length+': '+(steps[Math.min(seStep-1,steps.length-1)]?steps[Math.min(seStep-1,steps.length-1)].desc:'');
    if(resEl){
      if(seStep>=steps.length&&steps[steps.length-1]&&steps[steps.length-1].final){
        resEl.className='b21-s212-exec-result s212-ok';
        resEl.textContent='Script succeeded — TRUE on top of the stack. The UTXO can be spent. A full node accepts this transaction as valid.';
      } else {
        resEl.className='b21-s212-exec-result s212-idle';
        resEl.textContent=seStep===0?'Execution not started yet.':'Step '+seStep+' of '+steps.length+'.';
      }
    }
  }

  const stepBtn=g('b21-s212-step');if(stepBtn) stepBtn.addEventListener('click',function(){
    if(seStep<SCRIPTS[seSc].steps.length) seStep++;renderSE();
  });
  const seReset=g('b21-s212-se-reset');if(seReset) seReset.addEventListener('click',function(){seStep=0;renderSE();});

  /* ── TAB 4: FULL TX FLOW ── */
  var TF_TYPES={
    p2pk:{label:'P2PK',era:'legacy',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a UTXO — pubKey directly in the locking script',sub:'Bitcoin’s earliest format. No "address" — the pubKey is embedded directly.',code:'No modern address\nvalue: 0.05 BTC\nlocking script: <alicePubKey> OP_CHECKSIG',rows:[{l:'Type',v:'P2PK (Pay to Public Key)'},{l:'Address',v:'None — 65-byte pubKey embedded directly'},{l:'Locking script',v:'<alicePubKey> OP_CHECKSIG'}],desc:'P2PK has no address. Alice’s public key is directly in the locking script. Anyone looking at the blockchain can see the public key before the UTXO is spent — a privacy problem that P2PKH solved.',ops:[{t:'<alicePubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds the tx — the sender must know Bob’s pubKey directly',sub:'No "address" system — the sender needs Bob’s pubKey directly',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: <bobPubKey> OP_CHECKSIG → 0.04 BTC\nfee: 0.001 BTC',rows:[{l:'Input',v:'0.05 BTC (Alice’s UTXO)'},{l:'Output to Bob',v:'<bobPubKey65bytes> OP_CHECKSIG'},{l:'Problem',v:'Alice must know Bob’s pubKey directly'}],desc:'In P2PK the sender must know the recipient’s public key directly. There’s no shareable address mechanism. This is one reason P2PK is impractical for general use.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Bob’s locking script: Bob’s pubKey embedded directly',sub:'No hashing — Bob’s pubKey is exposed on the blockchain before being spent',code:'Bob’s pubKey: 04a1b2c3...d4e5f6 (65 bytes)\nlocking script: <bobPubKey> OP_CHECKSIG',rows:[{l:'Bob’s pubKey',v:'04a1b2c3...d4e5f6 (65 bytes uncompressed)'},{l:'Locking script',v:'<bobPubKey> OP_CHECKSIG'},{l:'Privacy problem',v:'Bob’s pubKey exposed before the UTXO is spent'}],desc:'A P2PK locking script is just two elements: the pubKey and OP_CHECKSIG. No hashing. Bob’s public key is visible directly on the blockchain.',ops:[{t:'<bobPubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice signs — only the signature, no need to send the pubKey',sub:'The unlocking script is smaller than P2PKH because the pubKey is already in the locking script',code:'scriptSig: <aliceSignature> (71-72 bytes DER)',rows:[{l:'scriptSig',v:'<aliceSignature> only'},{l:'Smaller',v:'No need to include the pubKey (saves 33 bytes)'},{l:'Type',v:'ECDSA (secp256k1)'}],desc:'The P2PK unlocking script is more compact — just the signature, no pubKey needed because it’s already stored in the locking script. But the price: the public key is permanently exposed on the blockchain.',ops:[{t:'<aliceSignature>',c:'oc-sig'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'A full node verifies: push sig → load pubKey → OP_CHECKSIG',sub:'The simplest stack — only two elements',code:'[unlock] <sig>\n[lock]   <pubKey> OP_CHECKSIG\n\nStack: push <sig> → push <pubKey> → OP_CHECKSIG → TRUE',rows:[{l:'Initial stack',v:'[sig]'},{l:'After loading pubKey',v:'[sig, pubKey]'},{l:'OP_CHECKSIG',v:'verify → TRUE'}],desc:'P2PK stack execution is the simplest: push the signature, push the pubKey from the locking script, OP_CHECKSIG verifies. No OP_DUP, OP_HASH160, OP_EQUALVERIFY like P2PKH.',ops:[{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2PK UTXO — his pubKey is exposed on the blockchain',sub:'A historical format, not recommended because of the privacy problem',code:'New UTXO: 0.04 BTC\nlocking script: <bobPubKey> OP_CHECKSIG\nHow to spend: scriptSig: <bobSignature>',rows:[{l:'New UTXO',v:'0.04 BTC, locking: <bobPubKey> OP_CHECKSIG'},{l:'How to spend',v:'scriptSig: <bobSignature> only'},{l:'Status',v:'Not recommended — poor privacy'}],desc:'P2PK is now very rarely used. The public key is exposed before the UTXO is spent. P2PKH solved this by storing the pubKey hash.',ops:[{t:'<bobPubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
    ]},
    p2pkh:{label:'P2PKH',era:'legacy',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a P2PKH UTXO — the address starts with "1"',sub:'The most common format 2009-2017. The pubKey hash is stored, not the pubKey itself.',code:'address: 1A7f2xKm...\nvalue: 0.05 BTC\nlocking script: OP_DUP OP_HASH160 <pubKeyHash20> OP_EQUALVERIFY OP_CHECKSIG',rows:[{l:'Alice’s address',v:'1A7f2xKm... (Base58Check)'},{l:'Address contents',v:'version 0x00 + pubKeyHash 20 bytes + checksum 4 bytes'},{l:'Locking script',v:'OP_DUP OP_HASH160 <hash20> OP_EQUALVERIFY OP_CHECKSIG'}],desc:'A P2PKH address stores the pubKey hash (SHA256+RIPEMD160 = 20 bytes), not the pubKey itself. The pubKey is only revealed when the UTXO is spent.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<pubKeyHash20>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds the tx — just needs Bob’s address',sub:'No need to know Bob’s pubKey directly — the address is enough',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: 1B3c9dPq... → 0.04 BTC\noutput[1]: 1A9x2mK... → 0.009 BTC (change)\nfee: 0.001 BTC\nsize: ~192 vByte',rows:[{l:'Input',v:'0.05 BTC (Alice’s UTXO)'},{l:'Output to Bob',v:'0.04 BTC → 1B3c9dPq...'},{l:'Change',v:'0.009 BTC → 1A9x2mK... (Alice’s new address)'}],desc:'Alice just needs Bob’s address to build the transaction. Alice’s wallet decodes Bob’s address to extract the pubKeyHash needed for the output locking script.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode Bob’s address → pubKeyHash → locking script',sub:'Base58Check decode → strip the version byte and checksum → 20-byte pubKeyHash',code:'bobAddr: 1B3c9dPq...\n  ↓ Base58Check decode\nbobPubKeyHash: b3c9d4e5...(20 bytes)\nlocking script: OP_DUP OP_HASH160 <b3c9d4e5...> OP_EQUALVERIFY OP_CHECKSIG',rows:[{l:'Bob’s address',v:'1B3c9dPq... (Base58Check)'},{l:'Decode',v:'0x00 + b3c9d4e5... (20 bytes) + checksum'},{l:'Locking script',v:'OP_DUP OP_HASH160 <b3c9d4e5...> OP_EQUALVERIFY OP_CHECKSIG'}],desc:'The wallet decodes Bob’s address from Base58Check, discards the version byte and checksum, takes the 20-byte pubKeyHash, and embeds it in the locking script.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<bobPubKeyHash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice signs — ECDSA signature + pubKey in the scriptSig',sub:'The scriptSig contains the signature AND the pubKey — both are needed',code:'signature = ECDSA_sign(privKey, txHash)\nscriptSig: <aliceSignature> <alicePubKey>',rows:[{l:'TX hash',v:'double SHA256 of the raw transaction'},{l:'Signature',v:'ECDSA_sign(privKey, txHash) → 71-72 bytes DER'},{l:'scriptSig',v:'<signature> <pubKey> (total ~107 bytes)'}],desc:'The scriptSig contains two elements: the ECDSA signature AND the public key. The pubKey must be included because the locking script only stores its hash — the node needs the actual pubKey for OP_CHECKSIG.',ops:[{t:'<aliceSignature>',c:'oc-sig'},{t:'<alicePubKey>',c:'oc-data'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Full node verifies the 5-step stack execution',sub:'OP_DUP → OP_HASH160 → OP_EQUALVERIFY → OP_CHECKSIG',code:'[unlock] <sig> <pubKey>\n[lock]   OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG\n\nStack: [sig,pubKey] → OP_DUP → [sig,pubKey,pubKey]\n→ OP_HASH160 → [sig,pubKey,hash_c] → compare → OP_CHECKSIG → TRUE',rows:[{l:'OP_DUP',v:'duplicate the pubKey'},{l:'OP_HASH160',v:'hash the pubKey → 20 bytes'},{l:'OP_EQUALVERIFY',v:'compare hashes, fail if different'},{l:'OP_CHECKSIG',v:'verify the signature → TRUE'}],desc:'P2PKH stack execution is the most verbose. OP_DUP duplicates the pubKey so it can be used twice. Five opcodes for one simple transaction.',ops:[{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-data'},{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<hash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2PKH UTXO — the address starts with "1"',sub:'Still a valid format but more expensive than SegWit because it gets no weight discount',code:'New UTXO: 0.04 BTC, address 1B3c9dPq...\nlocking: OP_DUP OP_HASH160 <bobPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG\nHow to spend: scriptSig: <bobSig> <bobPubKey>\ninput size: ~148 vByte',rows:[{l:'New UTXO',v:'0.04 BTC, address 1B3c9dPq...'},{l:'How to spend',v:'scriptSig: <bobSig> <bobPubKey>'},{l:'Input size',v:'~148 vByte (vs P2WPKH ~68 vByte)'}],desc:'Bob’s P2PKH UTXO is valid but expensive to spend. Input ~148 vByte, more than double P2WPKH’s ~68 vByte.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<bobPubKeyHash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
    ]},
    p2sh:{label:'P2SH',era:'legacy',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a P2SH UTXO — a complex script behind a hash',sub:'P2SH enables multisig and timelock without burdening the sender',code:'address: 3J98tnMf...\nvalue: 0.05 BTC\nlocking script: OP_HASH160 <scriptHash20> OP_EQUAL',rows:[{l:'Alice’s address',v:'3J98tnMf... (starts with "3")'},{l:'Address contents',v:'version 0x05 + scriptHash 20 bytes + checksum'},{l:'Locking script',v:'OP_HASH160 <scriptHash20> OP_EQUAL (23 bytes)'}],desc:'A P2SH locking script is very short: just the hash of the actual redeem script. Any complex script can be hidden behind a 20-byte hash. The sender doesn’t need to know the script contents.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<scriptHash20>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds the tx — knows Bob’s address, no need to know his redeem script',sub:'The sender just needs the P2SH address — the complex script is Bob’s business',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: 3Abc1qRs... → 0.04 BTC\nfee: 0.001 BTC',rows:[{l:'Input',v:'0.05 BTC (Alice’s P2SH UTXO)'},{l:'Output to Bob',v:'0.04 BTC → 3Abc1qRs...'},{l:'Advantage',v:'Alice doesn’t need to know the complex script inside Bob’s P2SH'}],desc:'P2SH moves the complexity from the sender to the recipient. Alice just needs Bob’s P2SH address without needing to know whether it’s multisig, timelock, or another condition.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode Bob’s address → scriptHash → P2SH locking script',sub:'Base58Check decode with version 0x05 → 20-byte scriptHash',code:'bobAddr: 3Abc1qRs...\n  ↓ Base58Check decode (version 0x05)\nbobScriptHash: a1b2c3d4...(20 bytes)\nlocking script: OP_HASH160 <a1b2c3d4...> OP_EQUAL\n\n// Bob’s redeemScript (hidden):\nOP_2 <pk1> <pk2> <pk3> OP_3 OP_CHECKMULTISIG',rows:[{l:'Bob’s address',v:'3Abc1qRs... (version 0x05 = P2SH)'},{l:'scriptHash',v:'a1b2c3d4... (20 bytes)'},{l:'Locking script',v:'OP_HASH160 <a1b2c3d4...> OP_EQUAL (23 bytes)'},{l:'Redeem script',v:'hidden — only Bob knows'}],desc:'Alice’s wallet takes the scriptHash from decoding the address. The scriptHash is the hash of the redeem script only Bob knows. The locking script is just 23 bytes even though the actual script is complex.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<scriptHash>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice provides data + redeemScript in the scriptSig',sub:'The scriptSig contains: the data the redeemScript needs + the redeemScript itself',code:'// Alice has a P2SH 2-of-3 multisig\nscriptSig: OP_0 <sig1> <sig2> <redeemScript>',rows:[{l:'redeemScript',v:'OP_2 <pk1> <pk2> <pk3> OP_3 OP_CHECKMULTISIG'},{l:'scriptSig',v:'OP_0 <sig1> <sig2> <redeemScript>'},{l:'OP_0',v:'dummy for the OP_CHECKMULTISIG off-by-one bug'}],desc:'To unlock a P2SH UTXO, Alice provides the data the redeemScript needs (signatures) PLUS the redeemScript itself. The node hashes the redeemScript and compares it with the scriptHash.',ops:[{t:'OP_0',c:'oc-op'},{t:'<sig1>',c:'oc-sig'},{t:'<sig2>',c:'oc-sig'},{t:'<redeemScript>',c:'oc-hash'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Full node verifies in two phases',sub:'Phase 1: hash the redeemScript. Phase 2: execute the redeemScript',code:'Phase 1: OP_HASH160(<redeemScript>) == scriptHash? ✓\nPhase 2: execute OP_2 <pk1..pk3> OP_3 OP_CHECKMULTISIG\n→ 2 of 3 sigs valid → TRUE',rows:[{l:'Phase 1',v:'hash(redeemScript) == scriptHash → matches'},{l:'Phase 2',v:'execute the redeemScript with data from the scriptSig'},{l:'Result',v:'2 of 3 signatures valid → TRUE'}],desc:'P2SH verification has two phases: first the redeemScript hash matches the scriptHash. Second, run the redeemScript with data from the scriptSig. If both pass: valid.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<redeemScript>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'},{t:'execute redeemScript',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2SH UTXO — a complex script behind a simple address',sub:'Flexible but expensive to spend: the large redeemScript is in the scriptSig (no discount)',code:'New UTXO: 0.04 BTC, address 3Abc1qRs...\nlocking: OP_HASH160 <bobScriptHash> OP_EQUAL\nHow to spend: OP_0 <sig1> <sig2> <redeemScript>',rows:[{l:'New UTXO',v:'0.04 BTC, address 3Abc1qRs...'},{l:'How to spend',v:'scriptSig: data + redeemScript'},{l:'Weakness',v:'large redeemScript in the scriptSig — no weight discount'}],desc:'P2SH was a big innovation but has a weakness: the redeemScript must be in the scriptSig when spending, with no weight discount. P2WSH solves this.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<bobScriptHash>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
    ]},
    p2wpkh:{label:'P2WPKH',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a P2WPKH UTXO — bc1q address (20 bytes)',sub:'Native SegWit v0. Minimal locking script, implicit verification from the witness.',code:'address: bc1qa7f2...xk (bech32)\nvalue: 0.05 BTC\nlocking script: OP_0 <pubKeyHash20>',rows:[{l:'Alice’s address',v:'bc1qa7f2...xk (bech32)'},{l:'Address contents',v:'witness version 0 + pubKeyHash 20 bytes'},{l:'Locking script',v:'OP_0 <pubKeyHash20> (22 bytes)'}],desc:'A P2WPKH locking script is just 22 bytes: OP_0 (witness version 0) and the 20-byte pubKeyHash. It contains no verification opcodes — they all run implicitly in the SegWit node.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<pubKeyHash20>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds a SegWit tx — empty scriptSig, separate witness',sub:'Witness data gets the 1/4 weight discount — ~27% cheaper than P2PKH',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: empty)\noutput[0]: bc1q3c9d...qp → 0.04 BTC\noutput[1]: bc1q9x2m...km → 0.009 BTC\nfee: 0.001 BTC\nsize: ~141 vByte',rows:[{l:'Input',v:'0.05 BTC, scriptSig: empty'},{l:'Witness',v:'separate — counted as 1/4 weight'},{l:'Size',v:'~141 vByte (27% cheaper than P2PKH ~192 vByte)'}],desc:'A SegWit transaction has a separate witness. The signature and pubKey aren’t in the scriptSig but in the witness. The witness counts as 1/4 weight, making it cheaper to fill a block.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode Bob’s address → bech32 → pubKeyHash → locking script',sub:'bech32 decode: HRP "bc" + witness version 0 + 20 bytes',code:'bobAddr: bc1q3c9d...qp\n  ↓ bech32 decode\n  witness version: 0\n  witness program: 3c9de5f6...(20 bytes)\nlocking script: OP_0 <3c9de5f6...>',rows:[{l:'Bob’s address',v:'bc1q3c9d...qp (bech32)'},{l:'Witness version',v:'0 → P2WPKH'},{l:'Witness program',v:'3c9de5f6... (20 bytes = pubKeyHash)'},{l:'Locking script',v:'OP_0 <3c9de5f6...>'}],desc:'The wallet decodes Bob’s bech32 address. Witness version 0 + 20 bytes program → this is P2WPKH. The locking script is just 22 bytes with no verification opcodes.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobPubKeyHash20>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice signs — signature and pubKey go into the witness field',sub:'The scriptSig stays empty — this is the heart of Segregated Witness',code:'scriptSig: (empty)\nwitness[0]: <aliceSignature> (71-72 bytes, 1/4 weight)\nwitness[1]: <alicePubKey> (33 bytes, 1/4 weight)',rows:[{l:'scriptSig',v:'empty (0 bytes)'},{l:'witness[0]',v:'<ECDSA signature> 71-72 bytes'},{l:'witness[1]',v:'<compressed pubKey> 33 bytes'},{l:'Effective',v:'104 bytes witness = only ~26 weight units'}],desc:'The signature and pubKey are in the separate witness. Because the witness counts as 1/4 weight, 104 bytes of witness data is effectively ~26 bytes. This is the source of SegWit’s cost savings.',ops:[{t:'(scriptSig empty)',c:'oc-imp'},{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-data'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node sees OP_0 + 20 bytes → P2WPKH → implicit verification from the witness',sub:'All verification logic runs implicitly — the locking script is just a marker',code:'[locking] OP_0 <hash20>\n[witness] <sig> <pubKey>\n\nNode implicitly: push <sig> → push <pubKey> → OP_DUP\n→ OP_HASH160 → compare <hash20> → OP_EQUALVERIFY → OP_CHECKSIG → TRUE',rows:[{l:'Locking script',v:'OP_0 <hash20> — just a marker'},{l:'Witness',v:'<sig> <pubKey>'},{l:'Verification',v:'the node runs the P2PKH logic implicitly'}],desc:'The node sees OP_0 + 20-byte program → knows it’s P2WPKH v0 → takes data from the witness → runs P2PKH verification implicitly. The locking script contains no verification opcodes.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<hash20>',c:'oc-hash'},{t:'[OP_DUP implicit]',c:'oc-imp'},{t:'[OP_HASH160 implicit]',c:'oc-imp'},{t:'[OP_CHECKSIG implicit]',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2WPKH UTXO — the most common format today',sub:'When Bob spends later: input ~68 vByte vs P2PKH ~148 vByte',code:'New UTXO: 0.04 BTC, address bc1q3c9d...qp\nlocking: OP_0 <bobPubKeyHash20>\nHow to spend: empty scriptSig + witness: [bobSig, bobPubKey]\ninput size: ~68 vByte',rows:[{l:'New UTXO',v:'0.04 BTC, address bc1q3c9d...qp'},{l:'How to spend',v:'empty scriptSig + witness: [bobSig, bobPubKey]'},{l:'Efficiency',v:'Input ~68 vByte (54% smaller than P2PKH)'}],desc:'P2WPKH is the most common format today. Backward-compatible and far more efficient than P2PKH.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobPubKeyHash20>',c:'oc-hash'}]},
    ]},
    p2wsh:{label:'P2WSH',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a P2WSH UTXO — long bc1q address (32 bytes)',sub:'The P2SH version of SegWit: complex script + witness discount. SHA256 32 bytes.',code:'address: bc1qw5x2ynm... (bech32, longer than P2WPKH)\nvalue: 0.05 BTC\nlocking script: OP_0 <scriptHash32>',rows:[{l:'Alice’s address',v:'bc1qw5x2ynm... (bech32, 62 chars)'},{l:'Address contents',v:'witness version 0 + scriptHash 32 bytes'},{l:'Locking script',v:'OP_0 <scriptHash32> (34 bytes)'}],desc:'P2WSH is like P2SH but for SegWit. The witness program is 32 bytes (SHA256 of the witness script), not 20 bytes. The address is longer than P2WPKH but more collision-resistant.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<scriptHash32>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds a P2WSH tx — complex script + witness discount',sub:'Ideal for multisig: the large script gets the weight discount in the witness',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: empty)\noutput[0]: bc1qr2ty... → 0.04 BTC\nfee: 0.001 BTC\n// the witness script gets the 1/4 weight discount',rows:[{l:'Input',v:'0.05 BTC, P2WSH'},{l:'Advantage vs P2SH',v:'witness script in the witness field → 1/4 weight discount'},{l:'Ideal for',v:'multisig: large scripts benefit the most'}],desc:'P2WSH is very useful for multisig because the large witness script gets the weight discount. In P2SH the large redeem script must be in the scriptSig with no discount.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode Bob’s address → bech32 → 32-byte scriptHash',sub:'Witness version 0 + 32 bytes program → this is P2WSH (not P2WPKH which is 20 bytes)',code:'bobAddr: bc1qr2ty...\n  ↓ bech32 decode\n  witness version: 0\n  witness program: r2tye5f6...(32 bytes)\nlocking script: OP_0 <r2tye5f6...>\n// Bob’s witness script: OP_2 <pk1><pk2><pk3> OP_3 OP_CHECKMULTISIG',rows:[{l:'Bob’s address',v:'bc1qr2ty... (bech32, 62 chars)'},{l:'Witness version',v:'0 (SegWit v0)'},{l:'Witness program',v:'r2tye5f6... (32 bytes = SHA256 of the witnessScript)'},{l:'Locking script',v:'OP_0 <r2tye5f6...> (34 bytes)'}],desc:'The wallet identifies P2WSH because the witness program is 32 bytes (not 20). This 32-byte SHA256 is the hash of the witness script only Bob knows.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobScriptHash32>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice provides data + witnessScript in the witness field',sub:'Same as P2SH but all in the witness — the scriptSig stays empty',code:'scriptSig: (empty)\nwitness[0]: (empty — dummy)\nwitness[1]: <sig1>\nwitness[2]: <sig2>\nwitness[3]: <witnessScript>',rows:[{l:'scriptSig',v:'empty (0 bytes)'},{l:'witness[1-2]',v:'<sig1>, <sig2> — counted as 1/4 weight'},{l:'witness[3]',v:'<witnessScript> — also 1/4 weight'},{l:'Savings vs P2SH',v:'large redeem script in the witness → ~75% cheaper'}],desc:'In P2WSH, the witnessScript is in the witness field and gets the 1/4 weight discount. In P2SH, the redeem script must be in the scriptSig with no discount. For large multisig, P2WSH is far cheaper.',ops:[{t:'(scriptSig empty)',c:'oc-imp'},{t:'<sig1>',c:'oc-sig'},{t:'<sig2>',c:'oc-sig'},{t:'<witnessScript>',c:'oc-hash'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node verifies in two phases: SHA256 the witnessScript, then execute',sub:'SHA256 (32 bytes) not SHA256+RIPEMD160 (20 bytes) like P2SH',code:'Phase 1: SHA256(<witnessScript>) == scriptHash32? ✓\nPhase 2: execute the witnessScript:\nOP_2 <pk1><pk2><pk3> OP_3 OP_CHECKMULTISIG → TRUE',rows:[{l:'Phase 1',v:'SHA256(witnessScript) == scriptHash32 → matches'},{l:'Phase 2',v:'execute the witnessScript from the witness field'},{l:'vs P2SH',v:'SHA256 32 bytes vs SHA256+RIPEMD160 20 bytes'}],desc:'P2WSH verification has two phases like P2SH, but pure SHA256 32 bytes to hash the witnessScript. The node sees OP_0 + 32 bytes → knows this is P2WSH v0.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<scriptHash32>',c:'oc-hash'},{t:'SHA256 verify',c:'oc-op'},{t:'execute witnessScript',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2WSH UTXO — complex script + witness discount',sub:'The most efficient for multisig compared to P2SH',code:'New UTXO: 0.04 BTC, address bc1qr2ty...\nlocking: OP_0 <bobScriptHash32>\nHow to spend: empty scriptSig + witness: [sigs + witnessScript]',rows:[{l:'New UTXO',v:'0.04 BTC, address bc1qr2ty...'},{l:'How to spend',v:'empty scriptSig + witness: sigs + witnessScript'},{l:'vs P2SH multisig',v:'P2WSH ~30-40% cheaper for large multisig'}],desc:'P2WSH is the best way to do multisig before Taproot. The witnessScript can be very complex and all of it gets the weight discount.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobScriptHash32>',c:'oc-hash'}]},
    ]},
    p2tr:{label:'P2TR',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice has a P2TR UTXO — bc1p address, the most efficient',sub:'Taproot (BIP 340-342, active Nov 2021). Key path and script path in one output.',code:'address: bc1pa7f2...xk (bech32m)\nvalue: 0.05 BTC\nlocking script: OP_1 <tweakedPubKey32>',rows:[{l:'Alice’s address',v:'bc1pa7f2...xk (bech32m, starts with "bc1p")'},{l:'Address contents',v:'witness version 1 + tweakedPubKey 32 bytes'},{l:'Locking script',v:'OP_1 <tweakedPubKey32> (34 bytes)'}],desc:'P2TR uses bech32m and witness version 1 (OP_1). The tweaked public key combines the key path and script path — enabling both in one output that looks identical from the outside.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<tweakedPubKey32>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice builds a P2TR tx — the most efficient of all formats',sub:'Input ~57.5 vByte (vs P2WPKH ~68 vByte, vs P2PKH ~148 vByte)',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: empty)\noutput[0]: bc1p3c9d...qp → 0.04 BTC\noutput[1]: bc1pa7f2...xk → 0.009 BTC\nfee: 0.001 BTC\nsize: ~111 vByte',rows:[{l:'Input',v:'0.05 BTC, P2TR, scriptSig: empty'},{l:'Output to Bob',v:'0.04 BTC → bc1p3c9d...qp'},{l:'TX size',v:'~111 vByte — the most efficient of all formats'}],desc:'A P2TR key path transaction is the most efficient: the Schnorr signature is only 64 bytes, no need to include the pubKey in the witness, and the P2TR output is 34 bytes.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode Bob’s address → bech32m → 32-byte tweakedPubKey',sub:'bech32m (different checksum from bech32) for witness version 1',code:'bobAddr: bc1p3c9d...qp\n  ↓ bech32m decode\n  witness version: 1\n  witness program: 3c9de5f6...(32 bytes)\nlocking script: OP_1 <3c9de5f6...>',rows:[{l:'Bob’s address',v:'bc1p3c9d...qp (bech32m)'},{l:'Witness version',v:'1 → Taproot'},{l:'Witness program',v:'3c9de5f6... (32 bytes = tweakedPubKey, x-only)'},{l:'Locking script',v:'OP_1 <3c9de5f6...>'}],desc:'bech32m is an updated checksum from bech32 to support variable witness program lengths. Witness version 1 + 32 bytes → this is P2TR.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<bobTweakedPubKey32>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice signs with Schnorr — only 64 bytes in the witness',sub:'No need to include the pubKey — the tweakedPubKey is already in the locking script',code:'scriptSig: (empty)\nwitness[0]: <aliceSchnorrSig> (64 bytes flat, r+s)',rows:[{l:'scriptSig',v:'empty (0 bytes)'},{l:'witness[0]',v:'<Schnorr signature> 64 bytes flat'},{l:'pubKey',v:'not included — already in the locking script'},{l:'vs ECDSA',v:'64 bytes vs 71-72 bytes (saves ~10%)'}],desc:'A Schnorr signature is only 64 bytes (r+s flat) vs ECDSA’s 71-72 bytes DER. For key path spending, the witness contains just one Schnorr signature.',ops:[{t:'(scriptSig empty)',c:'oc-imp'},{t:'<schnorrSig 64 bytes>',c:'oc-sig'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node sees OP_1 + 32 bytes → Taproot → Schnorr verify',sub:'The simplest verification — one step, no stack manipulation',code:'[locking] OP_1 <tweakedPubKey32>\n[witness] <schnorrSig>\n\n1. OP_1 → witness version 1 → Taproot\n2. Load tweakedPubKey from the locking script\n3. Schnorr_verify(tweakedPubKey, txHash, sig) → TRUE',rows:[{l:'OP_1',v:'witness version 1 → Taproot key path'},{l:'tweakedPubKey',v:'taken from the locking script'},{l:'Schnorr verify',v:'verify(tweakedPubKey, txHash, schnorrSig) → TRUE'}],desc:'P2TR key path verification is the simplest: the node sees OP_1 → Taproot → take the tweakedPubKey from the locking script → Schnorr verify. No OP_DUP, OP_HASH160, OP_EQUALVERIFY.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<tweakedPubKey>',c:'oc-hash'},{t:'<schnorrSig>',c:'oc-sig'},{t:'Schnorr_verify',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob has a P2TR UTXO — the most efficient, most private, most flexible',sub:'Key path is identical to single-sig. Script path can hide any condition.',code:'New UTXO: 0.04 BTC, address bc1p3c9d...qp\nlocking: OP_1 <bobTweakedPubKey32>\nKey path: witness: [<bobSchnorrSig>]\nScript path: witness: [<data> <script> <controlBlock>]',rows:[{l:'New UTXO',v:'0.04 BTC, address bc1p3c9d...qp'},{l:'Key path',v:'witness: [<schnorrSig>] — only 64 bytes'},{l:'Script path',v:'reveal one script from the MAST'},{l:'Privacy',v:'multisig is identical to single-sig from the outside'}],desc:'P2TR is the most advanced: the most efficient (input ~57.5 vByte), the most private, and the most flexible. This is the peak of Bitcoin Script evolution.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<bobTweakedPubKey32>',c:'oc-hash'}]},
    ]},
  };

  var tfType='p2pkh';
  var tfStep=null;

  function buildTFBtns(){
    var legacy=g('b21-s212-tf-btns-legacy');
    var segwit=g('b21-s212-tf-btns-segwit');
    if(!legacy||!segwit) return;
    legacy.innerHTML='';segwit.innerHTML='';
    Object.keys(TF_TYPES).forEach(function(key){
      var t=TF_TYPES[key];
      var btn=document.createElement('button');
      btn.className='b21-s212-si-btn'+(key===tfType?' act':'');
      btn.textContent=t.label;
      btn.addEventListener('click',function(){tfType=key;tfStep=null;buildTFBtns();buildTFFlow();});
      (t.era==='legacy'?legacy:segwit).appendChild(btn);
    });
  }

  function buildTFFlow(){
    var el=g('b21-s212-tf-flow');if(!el) return;el.innerHTML='';
    var steps=TF_TYPES[tfType].steps;
    steps.forEach(function(s,i){
      if(i>0){var arr=document.createElement('div');arr.className='b21-s212-tf-arrow';arr.textContent='\u2193';el.appendChild(arr);}
      var card=document.createElement('div');card.className='b21-s212-tf-card '+s.cls+(tfStep===s.id?' tf-sel':'');
      var num=document.createElement('div');num.className='b21-s212-tf-num';num.textContent=s.n;
      var body=document.createElement('div');body.className='b21-s212-tf-body';
      body.innerHTML='<div class="b21-s212-tf-label">'+s.lbl+'</div>'+
        '<div class="b21-s212-tf-sub">'+s.sub+'</div>'+
        '<pre class="b21-s212-tf-code">'+bsEscHTML(s.code)+'</pre>';
      card.appendChild(num);card.appendChild(body);
      card.addEventListener('click',function(){tfStep=tfStep===s.id?null:s.id;buildTFFlow();});
      el.appendChild(card);
      if(tfStep===s.id){
        var det=document.createElement('div');det.className='b21-s212-tf-det '+s.cls;
        s.rows.forEach(function(r){
          var row=document.createElement('div');row.className='b21-s212-tf-det-row';
          var l=document.createElement('div');l.className='b21-s212-tf-det-lbl';l.textContent=r.l;
          var v=document.createElement('div');v.className='b21-s212-tf-det-val';v.textContent=r.v;
          row.appendChild(l);row.appendChild(v);det.appendChild(row);
        });
        var desc=document.createElement('div');desc.className='b21-s212-tf-det-desc';desc.textContent=s.desc;det.appendChild(desc);
        if(s.ops&&s.ops.length>0){
          var ow=document.createElement('div');ow.className='b21-s212-tf-opcodes';
          s.ops.forEach(function(op){
            var sp=document.createElement('span');sp.className='b21-s212-tf-op '+op.c;sp.textContent=op.t;ow.appendChild(sp);
          });
          det.appendChild(ow);
        }
        el.appendChild(det);
      }
    });
  }

  function renderTF(){buildTFBtns();buildTFFlow();}

  var tabs=['b21-s212-t1','b21-s212-t2','b21-s212-t3','b21-s212-t4'];
  var panes=['b21-s212-p1','b21-s212-p2','b21-s212-p3','b21-s212-p4'];
  tabs.forEach(function(tid,i){
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',function(){
      tabs.forEach(function(t){const el=g(t);if(el) el.className='b21-s212-tab';});
      panes.forEach(function(p){const el=g(p);if(el) el.className='b21-s212-pane';});
      const el=g(tid);if(el) el.className='b21-s212-tab s212-act';
      const pe=g(panes[i]);if(pe) pe.className='b21-s212-pane show';
    });
  });

  buildTypeBtns();renderAB();renderSI();renderSE();renderTF();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.3 SIMULATION (Opcodes Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const OPS=[
    {cat:'Stack Operations',list:[
      {name:'OP_DUP',hex:'0x76',status:'active',sin:['a','b'],sout:['a','b','b'],spop:[],
       desc:'Duplicate the top item of the stack. In P2PKH it’s needed so the pubKey can be used twice: once for OP_HASH160, once for OP_CHECKSIG.',
       addr:[{tag:'t-p2pkh',note:'Required'},{tag:'t-p2wpkh',note:'Run implicitly'},{tag:'t-p2tr',note:'Can appear in Tapscript'},{tag:'t-p2sh',note:'Inside the redeem script'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:1},{t:'OP_HASH160',h:0},{t:'<pubKeyHash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:0}]}]},
      {name:'OP_DROP',hex:'0x75',status:'active',sin:['a','b'],sout:['a'],spop:['b'],
       desc:'Remove the top item of the stack. Often follows OP_CHECKLOCKTIMEVERIFY and OP_CHECKSEQUENCEVERIFY because those opcodes don’t consume a value from the stack.',
       addr:[{tag:'t-htlc',note:'Always present after CLTV or CSV'},{tag:'t-p2sh',note:'In a timelock redeem script'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'CLTV timelock script',ops:[{t:'<locktime>',h:0},{t:'OP_CLTV',h:0},{t:'OP_DROP',h:1},{t:'OP_DUP',h:0},{t:'...',h:0}]}]},
      {name:'OP_SWAP',hex:'0x7c',status:'active',sin:['a','b'],sout:['b','a'],spop:[],
       desc:'Swap the positions of the top two items of the stack.',
       addr:[{tag:'t-p2sh',note:'In a complex redeem script'},{tag:'t-htlc',note:'Arranges operation order'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Conditional script',ops:[{t:'<data>',h:0},{t:'OP_SWAP',h:1},{t:'OP_HASH160',h:0},{t:'OP_EQUALVERIFY',h:0}]}]},
      {name:'OP_OVER',hex:'0x79',status:'active',sin:['a','b'],sout:['a','b','a'],spop:[],
       desc:'Copy the second item from the top of the stack and push it on top without removing it.',
       addr:[{tag:'t-p2sh',note:'In a complex redeem script'},{tag:'t-p2wsh',note:'In the witness script'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Complex script',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_OVER',h:1},{t:'OP_ADD',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_2DUP',hex:'0x6e',status:'active',sin:['a','b'],sout:['a','b','a','b'],spop:[],
       desc:'Duplicate the top two items of the stack at once.',
       addr:[{tag:'t-p2sh',note:'In a complex redeem script'},{tag:'t-htlc',note:'Compares two values'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'SHA1 collision puzzle',ops:[{t:'OP_2DUP',h:1},{t:'OP_EQUAL',h:0},{t:'OP_NOT',h:0},{t:'OP_VERIFY',h:0}]}]},
      {name:'OP_NIP',hex:'0x77',status:'active',sin:['a','b'],sout:['b'],spop:['a'],
       desc:'Remove the second item from the top of the stack, leave the top item.',
       addr:[{tag:'t-p2sh',note:'In the redeem script'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Clean up the stack',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_NIP',h:1}]}]},
    ]},
    {cat:'Crypto & Hash',list:[
      {name:'OP_HASH160',hex:'0xa9',status:'active',sin:['<data>'],sout:['<hash20>'],spop:['<data>'],
       desc:'SHA256 then RIPEMD160. Turns the public key (33 bytes) into a pubKeyHash (20 bytes). Also used in P2SH to hash the redeem script.',
       addr:[{tag:'t-p2pkh',note:'Required'},{tag:'t-p2sh',note:'Required'},{tag:'t-p2wpkh',note:'Run implicitly'},{tag:'t-p2tr',note:'Not used'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:1},{t:'<pubKeyHash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:0}]},{label:'P2SH locking script',ops:[{t:'OP_HASH160',h:1},{t:'<scriptHash>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_SHA256',hex:'0xa8',status:'active',sin:['<data>'],sout:['<hash32>'],spop:['<data>'],
       desc:'SHA256 of the top item of the stack (32 bytes). Used in P2WSH and in Lightning HTLCs.',
       addr:[{tag:'t-p2wsh',note:'Implicit for the witness script hash'},{tag:'t-htlc',note:'Required for the payment hash'},{tag:'t-p2tr',note:'Can appear in Tapscript'}],
       ex:[{label:'HTLC payment script',ops:[{t:'OP_SHA256',h:1},{t:'<payment_hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_DUP',h:0},{t:'...',h:0}]}]},
      {name:'OP_SHA1',hex:'0xa7',status:'active',sin:['<data>'],sout:['<hash20>'],spop:['<data>'],
       desc:'SHA1 of the top item of the stack. SHA1 is considered cryptographically weak (collision attack found 2017). Still active but very rarely used in production scripts.',
       addr:[{tag:'t-p2sh',note:'Sometimes in experimental puzzle scripts'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'SHA1 collision puzzle',ops:[{t:'OP_SHA1',h:1},{t:'OP_SWAP',h:0},{t:'OP_SHA1',h:1},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_HASH256',hex:'0xaa',status:'active',sin:['<data>'],sout:['<hash32>'],spop:['<data>'],
       desc:'Double SHA256 — SHA256 run twice (SHA256(SHA256(data))) — used for the block header, txid, and the Merkle tree in Bitcoin.',
       addr:[{tag:'t-p2sh',note:'Can be in a redeem script for data verification'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Double SHA256',ops:[{t:'<data>',h:0},{t:'OP_HASH256',h:1},{t:'<expected>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_CHECKSIG',hex:'0xac',status:'active',sin:['<sig>','<pubKey>'],sout:['TRUE/FALSE'],spop:['<sig>','<pubKey>'],
       desc:'Verify a signature against the transaction hash using the pubKey. Bitcoin’s most fundamental opcode. P2PK/P2PKH: ECDSA. P2TR key path: Schnorr.',
       addr:[{tag:'t-p2pk',note:'The only opcode in a P2PK locking script'},{tag:'t-p2pkh',note:'The last and most crucial opcode'},{tag:'t-p2wpkh',note:'Run implicitly from the witness'},{tag:'t-p2tr',note:'Key path: Schnorr. Script path: also Schnorr'},{tag:'t-p2sh',note:'Inside the redeem script'}],
       ex:[{label:'P2PK',ops:[{t:'<pubKey>',h:0},{t:'OP_CHECKSIG',h:1}]},{label:'P2PKH',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:1}]}]},
      {name:'OP_CHECKMULTISIG',hex:'0xae',status:'active',sin:['OP_0','sigs','M','pks','N'],sout:['TRUE/FALSE'],spop:['all'],
       desc:'Verify M of N signatures. There’s a historical off-by-one bug: it requires a dummy OP_0. This bug can’t be fixed without a hard fork. In Tapscript it’s replaced by OP_CHECKSIGADD.',
       addr:[{tag:'t-p2sh',note:'Most common via P2SH'},{tag:'t-p2wsh',note:'In a SegWit multisig witness script'},{tag:'t-p2tr',note:'Not used — use OP_CHECKSIGADD'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'2-of-3 locking script',ops:[{t:'OP_2',h:0},{t:'<pk1>',h:0},{t:'<pk2>',h:0},{t:'<pk3>',h:0},{t:'OP_3',h:0},{t:'OP_CHECKMULTISIG',h:1}]}]},
      {name:'OP_CHECKSIGADD',hex:'0xba',status:'tapscript',sin:['<sig>','<n>','<pubKey>'],sout:['n+1 or n'],spop:['<sig>','<n>','<pubKey>'],
       desc:'Tapscript only. If the signature is valid: push n+1. If not: push n. Efficient Schnorr multisig without the off-by-one bug.',
       addr:[{tag:'t-p2tr',note:'Only in Tapscript (P2TR script path)'},{tag:'t-p2pkh',note:'Not available'},{tag:'t-p2sh',note:'Not available'}],
       ex:[{label:'Tapscript 2-of-3 multisig',ops:[{t:'<pk1>',h:0},{t:'OP_CHECKSIG',h:0},{t:'<pk2>',h:0},{t:'OP_CHECKSIGADD',h:1},{t:'<pk3>',h:0},{t:'OP_CHECKSIGADD',h:1},{t:'OP_2',h:0},{t:'OP_NUMEQUAL',h:0}]}]},
      {name:'OP_EQUALVERIFY',hex:'0x88',status:'active',sin:['a','b'],sout:[],spop:['a','b'],
       desc:'Pop two items, compare. If equal: continue. If different: the script fails immediately.',
       addr:[{tag:'t-p2pkh',note:'Required before OP_CHECKSIG'},{tag:'t-p2wpkh',note:'Run implicitly'},{tag:'t-htlc',note:'Verify the payment preimage'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:1},{t:'OP_CHECKSIG',h:0}]}]},
      {name:'OP_EQUAL',hex:'0x87',status:'active',sin:['a','b'],sout:['TRUE/FALSE'],spop:['a','b'],
       desc:'Pop two items, compare, push TRUE or FALSE onto the stack. Used in P2SH as the last opcode.',
       addr:[{tag:'t-p2sh',note:'The last opcode in a P2SH locking script'},{tag:'t-p2tr',note:'Used in Tapscript'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'P2SH locking script',ops:[{t:'OP_HASH160',h:0},{t:'<scriptHash>',h:0},{t:'OP_EQUAL',h:1}]}]},
    ]},
    {cat:'Flow Control',list:[
      {name:'OP_IF',hex:'0x63',status:'active',sin:['condition'],sout:[],spop:['condition'],
       desc:'Pop an item. If TRUE: execute the IF block. If FALSE: jump to ELSE or ENDIF. Fundamental for Lightning HTLCs.',
       addr:[{tag:'t-htlc',note:'Required — two paths: payment and timeout'},{tag:'t-p2sh',note:'In a conditional redeem script'},{tag:'t-p2wsh',note:'In the witness script'},{tag:'t-p2tr',note:'Available in Tapscript'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'HTLC script structure',ops:[{t:'OP_IF',h:1},{t:'OP_SHA256',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_ELSE',h:0},{t:'<timeout>',h:0},{t:'OP_CSV',h:0},{t:'OP_ENDIF',h:0}]}]},
      {name:'OP_ELSE',hex:'0x67',status:'active',sin:[],sout:[],spop:[],
       desc:'The pair of OP_IF. Executed if the OP_IF condition is FALSE.',
       addr:[{tag:'t-htlc',note:'The timeout path is in the ELSE block'},{tag:'t-p2sh',note:'In a conditional redeem script'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'IF-ELSE-ENDIF',ops:[{t:'OP_IF',h:0},{t:'<payment>',h:0},{t:'OP_ELSE',h:1},{t:'<timeout>',h:0},{t:'OP_ENDIF',h:0}]}]},
      {name:'OP_ENDIF',hex:'0x68',status:'active',sin:[],sout:[],spop:[],
       desc:'The mandatory closer of every OP_IF. A script is considered malformed without a matching OP_ENDIF.',
       addr:[{tag:'t-htlc',note:'Required in every OP_IF'},{tag:'t-p2sh',note:'Required in a redeem script with OP_IF'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Close a conditional block',ops:[{t:'OP_IF',h:0},{t:'...',h:0},{t:'OP_ELSE',h:0},{t:'...',h:0},{t:'OP_ENDIF',h:1}]}]},
      {name:'OP_RETURN',hex:'0x6a',status:'active',sin:[],sout:[],spop:[],
       desc:'Terminate the script immediately, mark the output as unspendable. It doesn’t enter the UTXO set. Can be followed by data; the size limit is per-node relay policy (long-standing convention: 80 bytes).',
       addr:[{tag:'t-p2sh',note:'No relation — a separate output type'},{tag:'t-p2pkh',note:'No relation'}],
       ex:[{label:'OP_RETURN data output',ops:[{t:'OP_RETURN',h:1},{t:'<data (policy limit)>',h:0}]}]},
      {name:'OP_VERIFY',hex:'0x69',status:'active',sin:['condition'],sout:[],spop:['condition'],
       desc:'Pop an item. If TRUE: continue. If FALSE: the script fails immediately. Often combined with OP_EQUAL.',
       addr:[{tag:'t-p2sh',note:'In the redeem script'},{tag:'t-htlc',note:'Verify a condition'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'OP_EQUAL + OP_VERIFY',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_EQUAL',h:0},{t:'OP_VERIFY',h:1}]}]},
    ]},
    {cat:'Timelock',list:[
      {name:'OP_CHECKLOCKTIMEVERIFY',hex:'0xb1',status:'active',sin:['<locktime>'],sout:['<locktime>'],spop:[],
       desc:'CLTV (BIP 65, active 2015). Verify the transaction’s nLocktime >= the value on the stack (absolute locktime). Doesn’t consume a value from the stack.',
       addr:[{tag:'t-htlc',note:'Required in the HTLC timeout path'},{tag:'t-p2sh',note:'In a timelock redeem script'},{tag:'t-p2wsh',note:'In a timelock witness script'},{tag:'t-p2tr',note:'Available in Tapscript'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Absolute timelock output',ops:[{t:'<blockheight>',h:0},{t:'OP_CLTV',h:1},{t:'OP_DROP',h:0},{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'...',h:0}]}]},
      {name:'OP_CHECKSEQUENCEVERIFY',hex:'0xb2',status:'active',sin:['<sequence>'],sout:['<sequence>'],spop:[],
       desc:'CSV (BIP 112, active 2016). Verify the input’s nSequence >= the value on the stack (relative locktime). The foundation of Lightning commitment transactions.',
       addr:[{tag:'t-htlc',note:'Required in Lightning commitment transactions'},{tag:'t-p2sh',note:'In a relative timelock redeem script'},{tag:'t-p2wsh',note:'In the witness script'},{tag:'t-p2tr',note:'Available in Tapscript'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Lightning commitment (144 block)',ops:[{t:'<144>',h:0},{t:'OP_CSV',h:1},{t:'OP_DROP',h:0},{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'...',h:0}]}]},
    ]},
    {cat:'Arithmetic',list:[
      {name:'OP_ADD',hex:'0x93',status:'active',sin:['a','b'],sout:['a+b'],spop:['a','b'],
       desc:'Pop two items, add them, push the result. Works with integers only. Used in Tapscript to count the number of valid signatures.',
       addr:[{tag:'t-p2tr',note:'In OP_CHECKSIGADD-based Tapscript multisig'},{tag:'t-p2sh',note:'Can be in a redeem script'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Count valid sigs',ops:[{t:'<sig1>',h:0},{t:'OP_CHECKSIG',h:0},{t:'<sig2>',h:0},{t:'OP_CHECKSIGADD',h:0},{t:'OP_2',h:0},{t:'OP_NUMEQUAL',h:0}]}]},
      {name:'OP_SUB',hex:'0x94',status:'active',sin:['a','b'],sout:['a-b'],spop:['a','b'],
       desc:'Pop two items, subtract (a-b), push the result. Rarely used in production scripts.',
       addr:[{tag:'t-p2sh',note:'Rare, in experimental scripts'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Simple subtraction',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_SUB',h:1},{t:'<0>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_MUL',hex:'0x95',status:'disabled',disableYear:'2010',
       disableReason:'Disabled by Satoshi Nakamoto in 2010. Concern: potential integer overflow bugs and implementation complexity that could endanger consensus.',
       impactNote:'No production script uses OP_MUL. No UTXO is locked with it. Zero impact.',
       sin:['a','b'],sout:['a*b'],spop:['a','b'],
       desc:'Multiplication of two integers. Disabled since 2010.',
       addr:[{tag:'t-p2sh',note:'Not available — the script will fail'},{tag:'t-p2pkh',note:'Not available'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_MUL',h:1},{t:'<- FAIL',h:0}]}]},
      {name:'OP_DIV',hex:'0x96',status:'disabled',disableYear:'2010',
       disableReason:'Disabled alongside OP_MUL in 2010. Main danger: division by zero could crash a node and become an attack vector.',
       impactNote:'No production script relies on OP_DIV. Zero impact.',
       sin:['a','b'],sout:['a/b'],spop:['a','b'],
       desc:'Integer division. Disabled since 2010.',
       addr:[{tag:'t-p2sh',note:'Not available'},{tag:'t-p2pkh',note:'Not available'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_DIV',h:1},{t:'<- FAIL',h:0}]}]},
      {name:'OP_NOT',hex:'0x91',status:'active',sin:['a'],sout:['!a'],spop:['a'],
       desc:'Pop an item. If 0: push 1. If non-zero: push 0. Logical NOT.',
       addr:[{tag:'t-p2sh',note:'In a negative-condition redeem script'},{tag:'t-htlc',note:'In conditional construction'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'Negative condition',ops:[{t:'<condition>',h:0},{t:'OP_NOT',h:1},{t:'OP_VERIFY',h:0}]}]},
    ]},
    {cat:'Disabled Opcodes',list:[
      {name:'OP_CAT',hex:'0x7e',status:'disabled',disableYear:'2010',
       disableReason:'Disabled by Satoshi in 2010. Could be used for a quadratic data expansion attack that overloads nodes.',
       impactNote:'No production UTXO is locked with OP_CAT. No impact on circulating transactions.',
       sin:['a','b'],sout:['ab'],spop:['a','b'],
       desc:'Concatenate two stack items into one string. Disabled because of potential quadratic data expansion.',
       addr:[{tag:'t-p2sh',note:'Not available'},{tag:'t-p2tr',note:'There’s a proposal to enable it in Tapscript with limits'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<str1>',h:0},{t:'<str2>',h:0},{t:'OP_CAT',h:1},{t:'<- FAIL',h:0}]}]},
      {name:'OP_SUBSTR',hex:'0x7f',status:'disabled',disableYear:'2010',
       disableReason:'Disabled alongside OP_CAT in 2010. Implementation complexity and potential consensus bugs.',
       impactNote:'No impact on circulating transactions.',
       sin:['<str>','<begin>','<size>'],sout:['<substr>'],spop:['all'],
       desc:'Take a substring from a string on the stack. Disabled since 2010.',
       addr:[{tag:'t-p2sh',note:'Not available'},{tag:'t-p2pkh',note:'Not available'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<string>',h:0},{t:'<0>',h:0},{t:'<10>',h:0},{t:'OP_SUBSTR',h:1},{t:'<- FAIL',h:0}]}]},
      {name:'OP_LSHIFT',hex:'0x98',status:'disabled',disableYear:'2010',
       disableReason:'Disabled alongside the arithmetic opcode group in 2010. A bit shift could unexpectedly produce very large values.',
       impactNote:'No impact on circulating transactions.',
       sin:['a','n'],sout:['a<<n'],spop:['a','n'],
       desc:'Left bit shift. Disabled since 2010.',
       addr:[{tag:'t-p2sh',note:'Not available'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<value>',h:0},{t:'<n>',h:0},{t:'OP_LSHIFT',h:1},{t:'<- FAIL',h:0}]}]},
      {name:'OP_RSHIFT',hex:'0x99',status:'disabled',disableYear:'2010',
       disableReason:'Disabled alongside OP_LSHIFT in 2010 for the same reason.',
       impactNote:'No impact on circulating transactions.',
       sin:['a','n'],sout:['a>>n'],spop:['a','n'],
       desc:'Right bit shift. Disabled since 2010.',
       addr:[{tag:'t-p2sh',note:'Not available'}],
       ex:[{label:'(Disabled 2010)',ops:[{t:'<value>',h:0},{t:'<n>',h:0},{t:'OP_RSHIFT',h:1},{t:'<- FAIL',h:0}]}]},
    ]},
    {cat:'Tapscript Only',list:[
      {name:'OP_SUCCESS',hex:'0x50+',status:'tapscript',sin:['(anything)'],sout:['TRUE'],spop:[],
       desc:'A set of opcodes that currently always succeed immediately. Designed for future upgrades without a hard fork.',
       addr:[{tag:'t-p2tr',note:'Only in Tapscript'},{tag:'t-p2pkh',note:'Not available'},{tag:'t-p2sh',note:'Not available'}],
       ex:[{label:'Upgrade path placeholder',ops:[{t:'<data>',h:0},{t:'OP_SUCCESS80',h:1}]}]},
      {name:'OP_1 (OP_TRUE)',hex:'0x51',status:'active',sin:[],sout:['1'],spop:[],
       desc:'Push the number 1 onto the stack. In a P2TR locking script it serves as witness version 1.',
       addr:[{tag:'t-p2tr',note:'Required as the first byte of a P2TR locking script'},{tag:'t-p2wpkh',note:'Not used — P2WPKH uses OP_0'},{tag:'t-p2pkh',note:'Not used'}],
       ex:[{label:'P2TR locking script',ops:[{t:'OP_1',h:1},{t:'<32-byte-tweaked-pubkey>',h:0}]}]},
      {name:'OP_0 (OP_FALSE)',hex:'0x00',status:'active',sin:[],sout:['0'],spop:[],
       desc:'Push the number 0 onto the stack. In a SegWit locking script it serves as witness version 0. In P2MS it’s used as a dummy value for the off-by-one bug.',
       addr:[{tag:'t-p2wpkh',note:'Required as the first byte of the locking script'},{tag:'t-p2wsh',note:'Required as the first byte of the locking script'},{tag:'t-p2sh',note:'In the multisig unlocking script as a dummy'},{tag:'t-p2tr',note:'Not used in a P2TR locking script'}],
       ex:[{label:'P2WPKH locking script',ops:[{t:'OP_0',h:1},{t:'<20-byte-hash>',h:0}]},{label:'Multisig dummy',ops:[{t:'OP_0',h:1},{t:'<sig1>',h:0},{t:'<sig2>',h:0}]}]},
    ]},
  ];

  var sel=null;

  function buildLeft(){
    var el=g('b21-s213-left');if(!el) return;el.innerHTML='';
    OPS.forEach(function(cat){
      var lbl=document.createElement('div');lbl.className='b21-s213-cat-lbl';lbl.textContent=cat.cat;el.appendChild(lbl);
      cat.list.forEach(function(op){
        var btn=document.createElement('button');
        btn.className='b21-s213-op-btn'+(op.status==='disabled'?' s213-disabled':'')+(sel&&sel.name===op.name?' act':'');
        var dot=document.createElement('span');dot.className='b21-s213-dot '+op.status;
        var nm=document.createElement('span');nm.textContent=op.name;
        var statusLabel={active:'Active',disabled:'Disabled '+(op.disableYear||''),tapscript:'Tapscript'}[op.status]||op.status;
        var sl=document.createElement('span');sl.className='b21-s213-status-pill s213-pill-'+op.status;sl.textContent=statusLabel;
        btn.appendChild(dot);btn.appendChild(nm);btn.appendChild(sl);
        btn.addEventListener('click',function(){sel=op;buildLeft();buildRight();});
        el.appendChild(btn);
      });
    });
  }

  function buildRight(){
    var el=g('b21-s213-right');if(!el) return;
    if(!sel){el.innerHTML='<div class="b21-s213-empty">← Choose an opcode to begin</div>';return;}
    var op=sel;el.innerHTML='';
    var hdrCls={active:'h-active',disabled:'h-disabled',tapscript:'h-tapscript'}[op.status]||'h-active';
    var statusLabel={active:'Active',disabled:'Disabled '+(op.disableYear||''),tapscript:'Tapscript Only'}[op.status]||op.status;
    var hdr=document.createElement('div');hdr.className='b21-s213-hdr '+hdrCls;
    hdr.innerHTML='<div class="b21-s213-hdr-name">'+op.name+'</div>'+
      '<div class="b21-s213-hdr-hex">hex: '+op.hex+'</div>'+
      '<div class="b21-s213-hdr-row"><div class="b21-s213-badge">'+statusLabel+'</div></div>';
    el.appendChild(hdr);
    var scCls={active:'sc-active',disabled:'sc-disabled',tapscript:'sc-tapscript'}[op.status]||'sc-active';
    var scLbl={active:'Status: Active',disabled:'Why was it disabled?',tapscript:'Tapscript Only'}[op.status];
    var scText={active:'This opcode is active and can be used in the contexts listed below.',tapscript:'This opcode is only available in the Taproot (P2TR) script path. It can’t be used in P2PKH, P2SH, P2WPKH, or P2WSH.'}[op.status]||op.disableReason||'';
    var sc=document.createElement('div');sc.className='b21-s213-status-card '+scCls;
    sc.innerHTML='<div class="b21-s213-status-lbl">'+scLbl+'</div>'+
      '<div class="b21-s213-status-text">'+scText+'</div>'+
      (op.impactNote?'<div class="b21-s213-impact imp-safe">Impact: '+op.impactNote+'</div>':'');
    el.appendChild(sc);
    var sv=document.createElement('div');sv.className='b21-s213-stack-wrap';
    var svl=document.createElement('div');svl.className='b21-s213-stack-lbl';svl.textContent='Stack effect:';sv.appendChild(svl);
    var row=document.createElement('div');row.className='b21-s213-stack-row';
    var before=document.createElement('div');before.className='b21-s213-stack-col';
    var blbl=document.createElement('div');blbl.className='b21-s213-stack-col-lbl';blbl.textContent='Before';
    op.sin.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-in';d.textContent=item;before.appendChild(d);});
    before.appendChild(blbl);
    var arr=document.createElement('div');arr.className='b21-s213-stack-arrow';arr.textContent='→';
    var after=document.createElement('div');after.className='b21-s213-stack-col';
    var albl=document.createElement('div');albl.className='b21-s213-stack-col-lbl';albl.textContent='After';
    op.sout.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-out';d.textContent=item;after.appendChild(d);});
    if(op.spop&&op.spop.length>0){op.spop.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-pop';d.textContent=item+' (pop)';after.appendChild(d);});}
    after.appendChild(albl);
    row.appendChild(before);row.appendChild(arr);row.appendChild(after);sv.appendChild(row);el.appendChild(sv);
    var desc=document.createElement('div');desc.className='b21-s213-desc-card';desc.textContent=op.desc;el.appendChild(desc);
    if(op.addr&&op.addr.length>0){
      var aw=document.createElement('div');aw.className='b21-s213-addr-wrap';
      var awl=document.createElement('div');awl.className='b21-s213-addr-lbl';awl.textContent='Usage per address type:';aw.appendChild(awl);
      op.addr.forEach(function(au){
        var r=document.createElement('div');r.className='b21-s213-addr-row';
        var t=document.createElement('div');t.className='b21-s213-addr-tag '+au.tag;t.textContent=au.tag.replace('t-','').toUpperCase();
        var n=document.createElement('div');n.className='b21-s213-addr-note';n.textContent=au.note;
        r.appendChild(t);r.appendChild(n);aw.appendChild(r);
      });
      el.appendChild(aw);
    }
    if(op.ex&&op.ex.length>0){
      var exw=document.createElement('div');exw.className='b21-s213-examples';
      var exl=document.createElement('div');exl.className='b21-s213-ex-lbl';exl.textContent='Real script example:';exw.appendChild(exl);
      op.ex.forEach(function(ex){
        var line=document.createElement('div');line.className='b21-s213-script-line';
        ex.ops.forEach(function(o){
          var span=document.createElement('span');
          span.className='b21-s213-op-token '+(o.h?'hi':(o.t.startsWith('<')||o.t.startsWith('(')?'data':'normal'));
          span.textContent=o.t;line.appendChild(span);
        });
        exw.appendChild(line);
        var nm=document.createElement('div');nm.className='b21-s213-ex-name';nm.textContent=ex.label;exw.appendChild(nm);
      });
      el.appendChild(exw);
    }
  }

  buildLeft();
  sel=OPS[0].list[0];buildLeft();buildRight();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.4 SIMULATION (Block Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}
  function trunc(s,n){return s.length>n?s.slice(0,n)+'...':s;}

  var BLOCK_HASH='000000000000000000029d5d07a8f892f4e9acc2cc85fced19a5d6f0c7d6a3b8';
  var PREV_HASH ='00000000000000000002b7c5e4d9a1f3b2c8e6d0a4f7b3c9e2d5a8f1b4c7e0';
  var MERKLE_ROOT='c4b8e2f1a3d6c9b2e5f8a1d4c7b0e3f6a9d2c5b8e1f4a7d0c3b6e9f2a5d8c1';

  var FIELDS=[
    {id:'fv',cls:'f-version', name:'Version',    bytes:'4 bytes', val:'0x20000000 (536870912)',
     desc:'The block version marking which consensus rules are used. Certain bits are used to signal soft forks (BIP 9). Version 0x20000000 is the current standard after Taproot activated.'},
    {id:'fp',cls:'f-prevhash',name:'Previous Block Hash',bytes:'32 bytes',val:trunc(PREV_HASH,40),
     desc:'The double SHA256 of the previous block header. This is what forms the chain in the blockchain — each block explicitly references the previous one. Changing one old block changes its hash and invalidates all subsequent blocks.'},
    {id:'fm',cls:'f-merkle',  name:'Merkle Root', bytes:'32 bytes',val:trunc(MERKLE_ROOT,40),
     desc:'The double SHA256 of the Merkle tree root formed from all the txids in this block. If one transaction is changed, the Merkle root differs and the block hash changes — the proof of work is void. This is what connects the 80-byte header to the thousands of transactions in the block.'},
    {id:'ft',cls:'f-time',    name:'Timestamp',   bytes:'4 bytes', val:'1713484167 (Unix) = 19 Apr 2024 00:09:27 UTC',
     desc:'The Unix timestamp when the block was mined. It doesn’t have to be perfectly accurate — it can be up to 2 hours ahead of the median time of the last 11 blocks. Used by nLocktime and CLTV for time-based timelock verification.'},
    {id:'fb',cls:'f-bits',    name:'Bits (Target)',bytes:'4 bytes', val:'0x17034219 — target: 000000000000000000034219...',
     desc:'A compact representation of the difficulty target. The block hash must be less than or equal to this value. The more leading zeros required, the harder the mining. Adjusted every 2,016 blocks based on the actual time vs the 20,160-minute target.'},
    {id:'fn',cls:'f-nonce',   name:'Nonce',        bytes:'4 bytes', val:'0x6F0C4B2A (1,863,075,626)',
     desc:'A number the miner varies to find a block hash that meets the target. 4 bytes = a maximum of about 4 billion possibilities. If that isn’t enough, the miner changes the timestamp or coinbase transaction (extra nonce) to get more search space.'},
  ];

  var TXIDS=[
    {id:rH(64),label:'Coinbase TX',type:'coinbase',btc:'40.751 BTC',fee:'0 (coinbase)',size:'285 vByte',inputs:'1 (coinbase input)',outputs:'2',
     desc:'The first transaction in every block. It has no input from a UTXO — its Bitcoin is created from nothing by the protocol. Its output is the block reward (3.125 BTC) plus all the fees from the transactions in this block (37.626 BTC). It can only be spent after 100 blocks (coinbase maturity).'},
    {id:rH(64),label:'TX #1',type:'normal',btc:'0.5421 BTC',fee:'1,240 sat',size:'141 vByte',inputs:'1 P2WPKH',outputs:'2 P2WPKH',
     desc:'A standard P2WPKH transaction with 1 input and 2 outputs (recipient and change). SegWit native — witness data counts as 1/4 weight. Fee rate about 8.8 sat/vByte.'},
    {id:rH(64),label:'TX #2',type:'normal',btc:'1.2300 BTC',fee:'3,450 sat',size:'208 vByte',inputs:'2 P2WPKH',outputs:'2 P2WPKH',
     desc:'A transaction with 2 inputs — combining two small UTXOs into one. Larger size because of two witness fields. Fee rate about 16.6 sat/vByte.'},
    {id:rH(64),label:'TX #3',type:'normal',btc:'0.0341 BTC',fee:'5,600 sat',size:'68 vByte',inputs:'1 P2TR',outputs:'1 P2TR',
     desc:'A P2TR key path transaction — the most efficient. Only 68 vByte because of the Schnorr signature (64 bytes) and the minimal P2TR output. Fee rate about 82 sat/vByte.'},
    {id:rH(64),label:'TX #4',type:'normal',btc:'5.0000 BTC',fee:'892 sat',size:'371 vByte',inputs:'3 P2PKH',outputs:'2 P2PKH',
     desc:'A legacy P2PKH transaction with 3 inputs. The most space-wasteful — each P2PKH input is about 148 vByte. Fee rate only 2.4 sat/vByte but the total amount is small because of its large size.'},
    {id:rH(64),label:'TX #5',type:'normal',btc:'0.0010 BTC',fee:'10,500 sat',size:'189 vByte',inputs:'1 P2SH multisig',outputs:'1 P2WPKH',
     desc:'A transaction draining a P2SH 2-of-3 multisig to P2WPKH. The redeem script is revealed in the scriptSig — this is what makes P2SH larger than P2WSH for multisig.'},
  ];

  var MERKLE=[
    {id:'root',cls:'mn-root',  label:'Merkle Root',     hash:MERKLE_ROOT,
     desc:'The double SHA256 of the entire Merkle tree. Stored in the block header — connecting the 80-byte header with thousands of transactions. Changing any single transaction changes this value and invalidates the proof of work.'},
    {id:'b01', cls:'mn-branch',label:'Hash(L+R)',        hash:rH(64),
     desc:'The double SHA256 of the two child nodes below it combined: SHA256(SHA256(leftChild + rightChild)). Any change in one of the leaves below it changes this branch node and ultimately changes the root.'},
    {id:'b02', cls:'mn-branch',label:'Hash(L+R)',        hash:rH(64),
     desc:'The right branch node. Same as the left: the double SHA256 of two child nodes. If the number of transactions is odd, the last leaf is duplicated to form the pair the tree requires.'},
    {id:'l01', cls:'mn-coin',  label:'Coinbase txid',   hash:TXIDS[0].id,
     desc:'The txid of the coinbase transaction — always the first in every block. The first leaf of the Merkle tree. The coinbase txid can be manipulated by the miner with an extra nonce inside the coinbase input to expand the nonce search space.'},
    {id:'l02', cls:'mn-leaf',  label:'txid #1',         hash:TXIDS[1].id,
     desc:'The txid of the second transaction in the block. A txid is the double SHA256 of the raw transaction. The order of transactions in the block determines the Merkle tree structure.'},
    {id:'l03', cls:'mn-leaf',  label:'txid #2',         hash:TXIDS[2].id,
     desc:'The txid of the third transaction. Any change in this transaction — even one bit — produces a completely different txid and changes the entire path to the root.'},
    {id:'l04', cls:'mn-leaf',  label:'txid #3..N',      hash:rH(64),
     desc:'A representation of txid #3 to #3,049 (this block has 3,050 transactions total). In a real Merkle tree there are thousands of leaves. Here it’s simplified for visualization.'},
  ];

  var selField=null, selMerkle=null, selTx=null;

  function renderFields(){
    var el=g('b21-s214-fields');if(!el) return;el.innerHTML='';
    FIELDS.forEach(function(f){
      var div=document.createElement('div');div.className='b21-s214-field '+f.cls+(selField===f.id?' selected':'');
      var row=document.createElement('div');row.className='b21-s214-field-row';
      var nm=document.createElement('div');nm.className='b21-s214-field-name';nm.textContent=f.name;
      var val=document.createElement('div');val.className='b21-s214-field-val';val.textContent=f.val;
      var sz=document.createElement('div');sz.className='b21-s214-field-size';sz.textContent=f.bytes;
      row.appendChild(nm);row.appendChild(val);row.appendChild(sz);div.appendChild(row);
      if(selField===f.id){
        var desc=document.createElement('div');desc.className='b21-s214-field-desc';desc.textContent=f.desc;div.appendChild(desc);
      } else {
        var hint=document.createElement('div');hint.className='b21-s214-field-hint';hint.textContent='click for an explanation';div.appendChild(hint);
      }
      div.addEventListener('click',function(){selField=selField===f.id?null:f.id;renderFields();});
      el.appendChild(div);
    });
  }

  function renderMerkle(){
    var tree=g('b21-s214-merkle-tree');if(!tree) return;tree.innerHTML='';
    var l0=document.createElement('div');l0.className='b21-s214-merkle-level';
    var root=document.createElement('div');root.className='b21-s214-merkle-node mn-root'+(selMerkle==='root'?' selected':'');
    root.textContent='Merkle Root';
    root.addEventListener('click',function(){selMerkle=selMerkle==='root'?null:'root';renderMerkle();showMerkleDetail('root');});
    l0.appendChild(root);tree.appendChild(l0);
    var c0=document.createElement('div');c0.className='b21-s214-merkle-conn';
    c0.innerHTML='<svg width="300" height="14" viewBox="0 0 300 14"><line x1="150" y1="0" x2="80" y2="14" stroke="#52524C" stroke-width="1"/><line x1="150" y1="0" x2="220" y2="14" stroke="#52524C" stroke-width="1"/></svg>';
    tree.appendChild(c0);
    var l1=document.createElement('div');l1.className='b21-s214-merkle-level';
    ['b01','b02'].forEach(function(id){
      var n=MERKLE.find(function(x){return x.id===id;});if(!n) return;
      var div=document.createElement('div');div.className='b21-s214-merkle-node '+n.cls+(selMerkle===id?' selected':'');
      div.textContent=n.label;
      div.addEventListener('click',function(){selMerkle=selMerkle===id?null:id;renderMerkle();showMerkleDetail(id);});
      l1.appendChild(div);
    });
    tree.appendChild(l1);
    var c1=document.createElement('div');c1.className='b21-s214-merkle-conn';
    c1.innerHTML='<svg width="300" height="14" viewBox="0 0 300 14"><line x1="80" y1="0" x2="40" y2="14" stroke="#52524C" stroke-width="1"/><line x1="80" y1="0" x2="115" y2="14" stroke="#52524C" stroke-width="1"/><line x1="220" y1="0" x2="185" y2="14" stroke="#52524C" stroke-width="1"/><line x1="220" y1="0" x2="260" y2="14" stroke="#52524C" stroke-width="1"/></svg>';
    tree.appendChild(c1);
    var l2=document.createElement('div');l2.className='b21-s214-merkle-level';
    ['l01','l02','l03','l04'].forEach(function(id){
      var n=MERKLE.find(function(x){return x.id===id;});if(!n) return;
      var div=document.createElement('div');div.className='b21-s214-merkle-node '+n.cls+(selMerkle===id?' selected':'');
      div.textContent=n.label;div.style.fontSize='9px';
      div.addEventListener('click',function(){selMerkle=selMerkle===id?null:id;renderMerkle();showMerkleDetail(id);});
      l2.appendChild(div);
    });
    tree.appendChild(l2);
  }

  function showMerkleDetail(id){
    var n=MERKLE.find(function(x){return x.id===id;});
    var det=g('b21-s214-merkle-detail');if(!det||!n) return;
    det.innerHTML='<div class="b21-s214-merkle-detail-name">'+n.label+'</div>'+
      '<div class="b21-s214-merkle-detail-val">'+trunc(n.hash,48)+'</div>'+
      '<div class="b21-s214-merkle-detail-desc">'+n.desc+'</div>';
  }

  function renderTxList(){
    var el=g('b21-s214-tx-list');if(!el) return;el.innerHTML='';
    TXIDS.forEach(function(tx,i){
      var div=document.createElement('div');div.className='b21-s214-tx-card tc-'+tx.type+(selTx===i?' selected':'');
      div.innerHTML='<div class="b21-s214-tx-top">'+
        '<div class="b21-s214-tx-badge">'+tx.label+'</div>'+
        '<div class="b21-s214-tx-txid">'+trunc(tx.id,36)+'</div>'+
        '<div class="b21-s214-tx-val">'+tx.btc+'</div>'+
        '</div>'+
        '<div class="b21-s214-tx-meta">'+
        '<div class="b21-s214-tx-meta-item">'+tx.inputs+' in</div>'+
        '<div class="b21-s214-tx-meta-item">'+tx.outputs+' out</div>'+
        '<div class="b21-s214-tx-meta-item">'+tx.size+'</div>'+
        '<div class="b21-s214-tx-meta-item">fee: '+tx.fee+'</div>'+
        '</div>';
      div.addEventListener('click',function(){selTx=selTx===i?null:i;renderTxList();renderTxDetail();});
      el.appendChild(div);
    });
  }

  function renderTxDetail(){
    var el=g('b21-s214-tx-detail');if(!el) return;
    if(selTx===null){el.style.display='none';return;}
    var tx=TXIDS[selTx];el.style.display='flex';
    el.innerHTML='<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">txid</div><div class="b21-s214-tx-detail-val">'+tx.id+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Value</div><div class="b21-s214-tx-detail-val">'+tx.btc+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Fee</div><div class="b21-s214-tx-detail-val">'+tx.fee+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Size</div><div class="b21-s214-tx-detail-val">'+tx.size+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Input</div><div class="b21-s214-tx-detail-val">'+tx.inputs+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Output</div><div class="b21-s214-tx-detail-val">'+tx.outputs+'</div></div>'+
      '<div class="b21-s214-tx-detail-desc">'+tx.desc+'</div>';
  }

  var tabs=['b21-s214-t1','b21-s214-t2','b21-s214-t3','b21-s214-t4'];
  var panes=['b21-s214-p1','b21-s214-p2','b21-s214-p3','b21-s214-p4'];
  tabs.forEach(function(tid,i){
    var btn=g(tid);if(!btn) return;
    btn.addEventListener('click',function(){
      tabs.forEach(function(t){var el=g(t);if(el) el.className='b21-s214-tab';});
      panes.forEach(function(p){var el=g(p);if(el) el.className='b21-s214-pane';});
      var el=g(tid);if(el) el.className='b21-s214-tab s214-act';
      var pe=g(panes[i]);if(pe) pe.className='b21-s214-pane show';
    });
  });

  renderFields();renderMerkle();renderTxList();renderTxDetail();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.5 SIMULATION (Mining Nonce Hunt)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  var zeros=2;
  var mining=false;
  var nonce=0;
  var hashCount=0;
  var startTime=null;
  var timerInterval=null;
  var miningInterval=null;
  var SEED=0xDEADBEEF;
  var BATCH=50;

  function calcHash(n,seed){
    var h=seed^n;
    h=((h>>>16)^h)*0x45d9f3b;h=h>>>0;
    h=((h>>>16)^h)*0x45d9f3b;h=h>>>0;
    h=(h>>>16)^h;h=h>>>0;
    var chars='0123456789abcdef';
    var result='';var s=h;
    for(var i=0;i<64;i++){s=(s*1664525+1013904223)>>>0;result+=chars[s%16];}
    return result;
  }

  function toHex8(n){return ('00000000'+(n>>>0).toString(16)).slice(-8).toUpperCase();}

  function getTarget(z){
    var t='';for(var i=0;i<z;i++)t+='0';for(var i=z;i<64;i++)t+='f';return t;
  }

  function renderHash(hash){
    var el=g('b21-s215-hash-display');if(!el) return;
    var html='';
    for(var i=0;i<hash.length;i++){
      var cls;
      if(i<zeros){cls=hash[i]==='0'?'b21-s215-hc-match':'b21-s215-hc-fail';}
      else{cls='b21-s215-hc-rest';}
      html+='<span class="'+cls+'">'+hash[i]+'</span>';
    }
    el.innerHTML=html;
  }

  function updateNonce(){
    var h=toHex8(nonce);
    var nd=g('b21-s215-nonce-display');if(nd) nd.textContent=nonce.toLocaleString();
    var nh=g('b21-s215-nonce-hex');if(nh) nh.textContent='0x'+h;
    var nf=g('b21-s215-nonce-field');if(nf) nf.textContent='0x'+h;
    var raw=g('b21-s215-header-raw');
    if(raw) raw.innerHTML='20000000 00000000...a3b8 c4b8e2f1...d8c1 65FF8A47 17034219 <span class="b21-s215-nonce-yellow">'+h+'</span>';
  }

  function updateTimer(){
    if(!startTime) return;
    var elapsed=(Date.now()-startTime)/1000;
    var t=g('b21-s215-timer');if(t) t.textContent=elapsed.toFixed(2)+'s';
    var hc=g('b21-s215-hash-count');if(hc) hc.textContent=hashCount.toLocaleString();
    var hps=g('b21-s215-hps');if(hps&&elapsed>0) hps.textContent=Math.round(hashCount/elapsed).toLocaleString();
  }

  function doMiningBatch(){
    for(var i=0;i<BATCH;i++){
      var hash=calcHash(nonce,SEED);
      hashCount++;
      var valid=true;
      for(var j=0;j<zeros;j++){if(hash[j]!=='0'){valid=false;break;}}
      if(valid){
        renderHash(hash);updateNonce();stopMining();
        var elapsed=(Date.now()-startTime)/1000;
        var res=g('b21-s215-result');if(res){
          res.className='b21-s215-result s215-found';
          res.textContent='Block found! Nonce: '+nonce.toLocaleString()+' (0x'+toHex8(nonce)+'). Valid hash with '+zeros+' leading zeros after '+hashCount.toLocaleString()+' attempts in '+elapsed.toFixed(2)+'s. The miner gets the block reward!';
        }
        var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=false;mb.textContent='⛏ Mine again';}
        return;
      }
      nonce++;
      if(nonce>4294967295){
        nonce=0;SEED=(SEED*1664525+1013904223)>>>0;
        var res=g('b21-s215-result');if(res){
          res.className='b21-s215-result s215-mining';
          res.textContent='Nonce exhausted (4 billion tried)! The miner updates the timestamp or extra nonce and starts again from 0...';
        }
      }
    }
    var hash=calcHash(nonce,SEED);
    renderHash(hash);updateNonce();
    var res=g('b21-s215-result');if(res){
      res.className='b21-s215-result s215-mining';
      res.textContent='Mining... trying nonce '+nonce.toLocaleString()+'. The hash doesn’t meet the target yet (needs '+zeros+' leading zeros).';
    }
  }

  function startMining(){
    if(mining) return;
    mining=true;startTime=Date.now();hashCount=0;
    var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=true;mb.textContent='Mining...';}
    timerInterval=setInterval(updateTimer,100);
    miningInterval=setInterval(doMiningBatch,16);
    var res=g('b21-s215-result');if(res){res.className='b21-s215-result s215-mining';res.textContent='Mining started...';}
  }

  function stopMining(){
    mining=false;
    clearInterval(timerInterval);clearInterval(miningInterval);
    timerInterval=null;miningInterval=null;
  }

  function resetAll(){
    stopMining();
    nonce=0;hashCount=0;startTime=null;SEED=0xDEADBEEF;
    var nd=g('b21-s215-nonce-display');if(nd) nd.textContent='0';
    var hc=g('b21-s215-hash-count');if(hc) hc.textContent='0';
    var t=g('b21-s215-timer');if(t) t.textContent='0.00s';
    var nh=g('b21-s215-nonce-hex');if(nh) nh.textContent='0x00000000';
    var nf=g('b21-s215-nonce-field');if(nf) nf.textContent='0x00000000';
    var raw=g('b21-s215-header-raw');
    if(raw) raw.innerHTML='20000000 00000000...a3b8 c4b8e2f1...d8c1 65FF8A47 17034219 <span class="b21-s215-nonce-yellow">00000000</span>';
    var hps=g('b21-s215-hps');if(hps) hps.textContent='\u2014';
    var hd=g('b21-s215-hash-display');if(hd) hd.innerHTML='\u2014';
    var res=g('b21-s215-result');if(res){res.className='b21-s215-result s215-idle';res.textContent='Press Mine to start searching for a valid nonce.';}
    var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=false;mb.textContent='\u26CF Mine';}
  }

  function setDifficulty(z){
    zeros=z;resetAll();
    var td=g('b21-s215-target-display');if(td) td.textContent=getTarget(z);
    var tn=g('b21-s215-target-note');if(tn) tn.textContent='The hash must start with at least '+z+' "0" characters';
    var zd=g('b21-s215-zeros-display');if(zd) zd.textContent=z;
    var pb=g('b21-s215-prob');if(pb) pb.textContent=Math.pow(16,z).toLocaleString();
  }

  var diffBtns=document.querySelectorAll('#section-21-5 .b21-s215-diff-btn');
  diffBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      diffBtns.forEach(function(b){b.classList.remove('s215-act');});
      btn.classList.add('s215-act');
      setDifficulty(parseInt(btn.dataset.zeros));
    });
  });

  var mb=g('b21-s215-mine-btn');if(mb) mb.addEventListener('click',startMining);
  var rb=g('b21-s215-reset-btn');if(rb) rb.addEventListener('click',resetAll);
  setDifficulty(2);
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.6 SIMULATION (Mempool Simulator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}

  var BLOCK_LIMIT=1000000;
  var RELAY_MIN=1;
  var blockNum=840001;
  var txPool=[];
  var selTxId=null;
  var logItems=[];

  var TYPES=['P2WPKH','P2PKH','P2TR','P2SH','P2WSH'];
  var TYPE_SIZES={P2WPKH:141,P2PKH:192,P2TR:111,P2SH:208,P2WSH:175};

  function makeTx(feeRate){
    var type=TYPES[Math.floor(Math.random()*TYPES.length)];
    var size=TYPE_SIZES[type]+(Math.floor(Math.random()*60)-30);
    if(size<68) size=68;
    var fee=Math.round(feeRate*size);
    var btc=(0.001+Math.random()*2).toFixed(4);
    return {id:rH(8)+'...'+rH(4),fullId:rH(64),feeRate:feeRate,size:size,fee:fee,btc:btc,type:type};
  }

  function feeClass(r){
    if(r>=50) return 's216-fee-high';
    if(r>=10) return 's216-fee-med';
    if(r>=3)  return 's216-fee-low';
    return 's216-fee-dust';
  }

  function addLog(msg,cls){
    logItems.unshift({msg:msg,cls:cls||''});
    if(logItems.length>20) logItems.pop();
    renderLog();
  }

  function renderLog(){
    var el=g('b21-s216-log');if(!el) return;el.innerHTML='';
    logItems.forEach(function(item){
      var div=document.createElement('div');
      div.className='b21-s216-log-item '+(item.cls||'');
      div.textContent=item.msg;el.appendChild(div);
    });
  }

  function updateStats(){
    var pending=txPool.slice();
    var totalSize=pending.reduce(function(s,t){return s+t.size;},0);
    var newMin=1;
    if(totalSize>800000) newMin=5;
    else if(totalSize>500000) newMin=3;
    else if(totalSize>200000) newMin=2;
    RELAY_MIN=newMin;
    var sorted=pending.slice().sort(function(a,b){return b.feeRate-a.feeRate;});
    var cumSize=0;var nextFee='\u2014';
    for(var i=0;i<sorted.length;i++){
      cumSize+=sorted[i].size;
      if(cumSize>=BLOCK_LIMIT*0.9){nextFee=sorted[i].feeRate+' sat/vB';break;}
    }
    if(nextFee==='\u2014'&&sorted.length>0) nextFee=sorted[sorted.length-1].feeRate+' sat/vB';
    var tc=g('b21-s216-tx-count');if(tc) tc.textContent=pending.length;
    var sz=g('b21-s216-size');if(sz) sz.textContent=totalSize.toLocaleString();
    var mf=g('b21-s216-min-fee');if(mf) mf.textContent=RELAY_MIN;
    var nf=g('b21-s216-next-fee');if(nf) nf.textContent=nextFee;
  }

  function renderPool(){
    var el=g('b21-s216-pool-rows');if(!el) return;el.innerHTML='';
    var pending=txPool.slice().sort(function(a,b){return b.feeRate-a.feeRate;});
    if(pending.length===0){
      var empty=document.createElement('div');empty.className='b21-s216-pool-empty';
      empty.textContent='Mempool empty — add a transaction to begin';
      el.appendChild(empty);return;
    }
    pending.forEach(function(tx){
      var row=document.createElement('div');
      row.className='b21-s216-tx-row '+feeClass(tx.feeRate)+(selTxId===tx.id?' s216-selected':'');
      row.innerHTML='<div class="b21-s216-tx-cell">'+tx.id+'</div>'+
        '<div class="b21-s216-tx-cell s216-fee-val">'+tx.feeRate+' s/vB</div>'+
        '<div class="b21-s216-tx-cell">'+tx.size+' vB</div>'+
        '<div class="b21-s216-tx-cell s216-type">'+tx.type+'</div>';
      row.addEventListener('click',function(){selTxId=selTxId===tx.id?null:tx.id;renderPool();renderDetail();});
      el.appendChild(row);
    });
  }

  function renderChart(){
    var el=g('b21-s216-chart');if(!el) return;el.innerHTML='';
    var buckets=[
      {label:'50+ s/vB',cls:'bar-high',min:50,max:999},
      {label:'10-49',   cls:'bar-med', min:10,max:49},
      {label:'3-9',     cls:'bar-low', min:3, max:9},
      {label:'1-2',     cls:'bar-dust',min:1, max:2},
    ];
    var maxCount=1;
    buckets.forEach(function(b){
      b.count=txPool.filter(function(t){return t.feeRate>=b.min&&t.feeRate<=b.max;}).length;
      if(b.count>maxCount) maxCount=b.count;
    });
    buckets.forEach(function(b){
      var row=document.createElement('div');row.className='b21-s216-chart-row';
      var lbl=document.createElement('div');lbl.className='b21-s216-chart-fee-lbl';lbl.textContent=b.label;
      var barWrap=document.createElement('div');barWrap.className='b21-s216-chart-bar-wrap';
      var bar=document.createElement('div');bar.className='b21-s216-chart-bar '+b.cls;
      bar.style.width=Math.round(b.count/maxCount*100)+'%';
      barWrap.appendChild(bar);
      var cnt=document.createElement('div');cnt.className='b21-s216-chart-cnt';cnt.textContent=b.count;
      row.appendChild(lbl);row.appendChild(barWrap);row.appendChild(cnt);el.appendChild(row);
    });
  }

  function renderDetail(){
    var wrap=g('b21-s216-detail-wrap');var det=g('b21-s216-detail');
    if(!wrap||!det) return;
    if(!selTxId){wrap.style.display='none';return;}
    var tx=txPool.find(function(t){return t.id===selTxId;});
    if(!tx){wrap.style.display='none';return;}
    wrap.style.display='block';
    var priority=tx.feeRate>=50?'High — likely in the next block':
      tx.feeRate>=10?'Medium — a few blocks ahead':
      tx.feeRate>=3?'Low — may wait a long time':
      'Very low — may be dropped if the mempool is full';
    det.innerHTML='<div class="b21-s216-detail-title">Transaction Details</div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">txid</div><div class="b21-s216-detail-val">'+tx.fullId+'</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Fee rate</div><div class="b21-s216-detail-val">'+tx.feeRate+' sat/vByte</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Total fee</div><div class="b21-s216-detail-val">'+tx.fee+' satoshi (value: '+tx.btc+' BTC)</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Size</div><div class="b21-s216-detail-val">'+tx.size+' vByte (format: '+tx.type+')</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Priority</div><div class="b21-s216-detail-val">'+priority+'</div></div>'+
      '<div class="b21-s216-detail-note">Fee rate = total fee / size in vBytes. The miner picks the transactions with the highest fee rate to maximize revenue per block.</div>';
  }

  function mineBlock(){
    if(txPool.length===0){addLog('Mempool empty, nothing to mine','log-drop');return;}
    var sorted=txPool.slice().sort(function(a,b){return b.feeRate-a.feeRate;});
    var selected=[];var cumSize=0;
    for(var i=0;i<sorted.length;i++){
      if(cumSize+sorted[i].size>BLOCK_LIMIT) break;
      selected.push(sorted[i]);cumSize+=sorted[i].size;
    }
    var totalFee=selected.reduce(function(s,t){return s+t.fee;},0);
    var minRate=selected.length>0?selected[selected.length-1].feeRate:0;
    var maxRate=selected.length>0?selected[0].feeRate:0;
    var selectedIds=selected.map(function(t){return t.id;});
    txPool=txPool.filter(function(t){return selectedIds.indexOf(t.id)===-1;});
    var box=g('b21-s216-block-box');
    if(box){
      box.innerHTML='<div class="b21-s216-block-num">Block #'+blockNum+'</div>'+
        '<div class="b21-s216-block-meta">'+selected.length+' tx | '+cumSize.toLocaleString()+' vByte | fee: '+totalFee.toLocaleString()+' sat</div>'+
        '<div class="b21-s216-block-meta">fee range: '+minRate+' \u2013 '+maxRate+' sat/vB</div>'+
        selected.slice(0,5).map(function(t){return '<div class="b21-s216-block-tx">'+t.id+' | '+t.feeRate+' s/vB</div>';}).join('')+
        (selected.length>5?'<div class="b21-s216-block-tx">... and '+(selected.length-5)+' more tx</div>':'');
    }
    addLog('Block #'+blockNum+': '+selected.length+' tx, fee min '+minRate+' sat/vB','log-block');
    blockNum++;selTxId=null;
    updateStats();renderPool();renderChart();renderDetail();
  }

  function addTx(feeRate){
    var rate=feeRate||Math.round(1+Math.random()*150);
    if(rate<RELAY_MIN){
      addLog('TX rejected: '+rate+' sat/vB < min relay '+RELAY_MIN+' sat/vB','log-drop');return;
    }
    var tx=makeTx(rate);txPool.push(tx);
    addLog('TX in: '+tx.id+' | '+tx.feeRate+' sat/vB | '+tx.size+' vB | '+tx.type,'log-in');
    updateStats();renderPool();renderChart();
  }

  var addBtn=g('b21-s216-add-btn');
  if(addBtn) addBtn.addEventListener('click',function(){
    var sel=g('b21-s216-fee-sel');
    var rate=sel?parseInt(sel.value):0;
    addTx(rate>0?rate:Math.round(1+Math.random()*150));
  });
  var add5Btn=g('b21-s216-add5-btn');
  if(add5Btn) add5Btn.addEventListener('click',function(){
    for(var i=0;i<5;i++) addTx(Math.round(1+Math.random()*150));
  });
  var mineBtn=g('b21-s216-mine-btn');
  if(mineBtn) mineBtn.addEventListener('click',mineBlock);
  var clearBtn=g('b21-s216-clear-btn');
  if(clearBtn) clearBtn.addEventListener('click',function(){
    txPool=[];selTxId=null;logItems=[];RELAY_MIN=1;
    updateStats();renderPool();renderChart();renderDetail();renderLog();
    var box=g('b21-s216-block-box');
    if(box) box.innerHTML='<div class="b21-s216-block-empty">No block mined yet</div>';
  });

  for(var i=0;i<8;i++) txPool.push(makeTx(Math.round(1+Math.random()*120)));
  txPool.sort(function(a,b){return b.feeRate-a.feeRate;});
  updateStats();renderPool();renderChart();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.7 SIMULATION (HD Wallet & Derivation Tree)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}

  var FAKE_SETS=[
    ['alpha','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima'],
    ['nova','solar','lunar','cosmic','stellar','quantum','photon','neutron','proton','electron','plasma','quasar'],
    ['mercury','venus','earth','mars','saturn','jupiter','uranus','neptune','pluto','ceres','eris','makemake'],
  ];
  var wordSetIdx=0;

  var STDS={
    bip44:{label:'BIP44 (P2PKH)',   path:['m',"44'","0'","0'","0","0"],fmt:'P2PKH',   pre:'1SIM'},
    bip49:{label:'BIP49 (P2SH)',    path:['m',"49'","0'","0'","0","0"],fmt:'P2SH-P2WPKH',pre:'3SIM'},
    bip84:{label:'BIP84 (P2WPKH)', path:['m',"84'","0'","0'","0","0"],fmt:'P2WPKH',  pre:'bc1qSIM'},
    bip86:{label:'BIP86 (P2TR)',    path:['m',"86'","0'","0'","0","0"],fmt:'P2TR',    pre:'bc1pSIM'},
  };

  var PATH_SEGS=[
    {cls:'ps-m',   name:'Master key (m)',desc:'The root of the entire key tree. HMAC-SHA512(seed) produces 512 bits: the left 256 bits = the master private key, the right 256 bits = the master chain code. The whole tree is derived deterministically from here.',hint:'Change the seed = the whole tree changes'},
    {cls:'ps-purp',name:"Purpose (purpose')",desc:"BIP standard: 44'=P2PKH, 49'=P2SH-P2WPKH, 84'=P2WPKH, 86'=P2TR. Hardened (apostrophe): the private key is required — an xpub can’t derive a child privkey.",hint:'Apostrophe = hardened derivation'},
    {cls:'ps-coin',name:"Coin type (coin')",desc:"0'=Bitcoin mainnet, 1'=testnet, 60'=Ethereum (SLIP-0044). Hardened: keys across coins are cryptographically isolated — compromising one doesn’t affect the others.",hint:"0' = Bitcoin mainnet"},
    {cls:'ps-acc', name:"Account (account')",desc:"Separates usage: 0'=main, 1'=savings, etc. At this level the xpub can be exported for a watch-only wallet — generate addresses without the private key.",hint:"xpub here = watch-only wallet"},
    {cls:'ps-chain',name:'Change (external/internal)',desc:'0=external: addresses to receive. 1=internal: change addresses, created automatically by the wallet when spending. The user usually doesn’t see these directly.',hint:'0=receive, 1=change (automatic)'},
    {cls:'ps-idx', name:'Address index',desc:'The address sequence number: 0=first, 1=second, etc. Each transaction should use a new address for privacy. BIP44: scan up to a gap limit of 20 empty addresses.',hint:'Infinite addresses from one seed'},
  ];

  var std='bip84';
  var selSeg=null;

  function fakeAddr(s,i){
    var pre=STDS[s].pre;
    return pre+rH(6)+'x'+i+'sim'+rH(4);
  }
  function fakeKey(pre){return '[SIM] '+pre+rH(12)+'...'+rH(6);}

  function buildSeed(){
    var ph=g('b21-s217-seed-phrase');
    if(ph) ph.textContent='SIMULATION: '+FAKE_SETS[wordSetIdx].join(' ');
    var sh=g('b21-s217-seed-hex');
    if(sh) sh.textContent='seed (512-bit, PBKDF2-HMAC-SHA512): [SIMULATION] '+rH(32)+'...'+rH(16);
  }

  function buildStdBtns(){
    var el=g('b21-s217-std-btns');if(!el) return;el.innerHTML='';
    Object.keys(STDS).forEach(function(key){
      var btn=document.createElement('button');
      btn.className='b21-s217-std-btn'+(key===std?' act':'');
      btn.textContent=STDS[key].label;
      btn.addEventListener('click',function(){std=key;selSeg=null;buildStdBtns();buildPath();buildTree();buildAddrs();});
      el.appendChild(btn);
    });
  }

  function buildPath(){
    var el=g('b21-s217-path-display');if(!el) return;el.innerHTML='';
    var det=g('b21-s217-path-detail');
    var path=STDS[std].path;
    path.forEach(function(seg,i){
      if(i>0){var sep=document.createElement('span');sep.className='b21-s217-path-sep';sep.textContent='/';el.appendChild(sep);}
      var sd=PATH_SEGS[i];
      var span=document.createElement('span');
      span.className='b21-s217-path-seg '+sd.cls+(selSeg===i?' selected':'');
      span.textContent=seg;
      span.addEventListener('click',function(){
        selSeg=selSeg===i?null:i;buildPath();
        if(!det) return;
        if(selSeg===null){det.style.display='none';}
        else{
          det.style.display='block';
          det.innerHTML='<div class="b21-s217-path-detail-name">'+sd.name+'</div>'+
            '<div class="b21-s217-path-detail-desc">'+sd.desc+'</div>'+
            '<div class="b21-s217-path-detail-hint">'+sd.hint+'</div>';
        }
      });
      el.appendChild(span);
    });
  }

  function buildTree(){
    var el=g('b21-s217-tree');if(!el) return;el.innerHTML='';
    var p=STDS[std].path;
    var nodes=[
      {indent:0,cls:'n-seed',path:'seed',label:'Seed (512 bits)',
       process:'mnemonic + passphrase \u2192 PBKDF2-HMAC-SHA512 (2048 iter) \u2192 512 bits',
       val:'[SIM] '+rH(32)+'...'+rH(16),
       note:'The single source of entropy for the entire wallet. The 512 bits are split: left = the master private key, right = the chain code. Anyone who knows this seed owns the entire wallet.'},
      {indent:1,cls:'n-master',path:'m',label:'Master Extended Key',
       process:'HMAC-SHA512(key="Bitcoin seed", data=seed) \u2192 512 bit',
       val:fakeKey('xprv9s21Zr'),
       note:'The left 256 bits = the master private key. The right 256 bits = the master chain code. Extended key = key + chain code — used to derive the entire tree.'},
      {indent:2,cls:'n-purp',path:'m/'+p[1],label:'Purpose ('+p[1]+')',
       process:'Hardened child: HMAC-SHA512(chain_code, 0x00 + privKey + index)',
       val:fakeKey('xprv9uQd'),
       note:'Hardened derivation: requires the private key. Separates the BIP standards cryptographically. Compromising one standard doesn’t affect the others from the same seed.'},
      {indent:3,cls:'n-coin',path:'m/'+p[1]+'/'+p[2],label:'Coin Type ('+p[2]+')',
       process:'Hardened child of the purpose key',
       val:fakeKey('xprv9vT3'),
       note:"0' = Bitcoin mainnet (SLIP-0044). The BTC keys are isolated from ETH, SOL, etc. even from the same seed."},
      {indent:4,cls:'n-acc',path:'m/'+p[1]+'/'+p[2]+'/'+p[3],label:'Account ('+p[3]+')',
       process:'The last hardened child in this path',
       val:fakeKey('xprv9xBc')+' | '+fakeKey('xpub6D'),
       note:'Here the xpub can be exported for a watch-only wallet: generate all addresses without the private key. Safe for a server or hot wallet.'},
      {indent:5,cls:'n-chain',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0',label:'External Chain — receive',
       process:'Non-hardened: HMAC-SHA512(chain_code, pubKey + index)',
       val:fakeKey('xpub6Eq'),
       note:'Non-hardened: can be derived from the xpub alone. This chain produces the addresses shared with senders. Each new request gets a new address.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0/0',label:'Address #0 [SIM]',
       process:'Non-hardened \u2192 pubKey \u2192 hash \u2192 encode \u2192 address',
       val:fakeAddr(std,0),
       note:'The first address to receive. Shared with senders. You should use a new address each transaction for privacy.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0/1',label:'Address #1 [SIM]',
       process:'Index +1, same process',
       val:fakeAddr(std,1),
       note:'Use a new address each transaction. Reusing an address makes it easier for others to trace your transaction history on the public blockchain.'},
      {indent:5,cls:'n-chain',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/1',label:'Internal Chain — change',
       process:'Non-hardened, index=1',
       val:fakeKey('xpub6Fr'),
       note:'The chain for change addresses. Created and managed automatically by the wallet. The user usually doesn’t see these addresses directly.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/1/0',label:'Change Address #0 [SIM]',
       process:'Non-hardened from the internal chain',
       val:fakeAddr(std,10),
       note:'If Alice sends 0.05 BTC but only needs 0.04, the remaining 0.009 BTC (minus the fee) automatically returns to this address via the wallet.'},
    ];

    nodes.forEach(function(node){
      var row=document.createElement('div');row.className='b21-s217-tree-row';
      var indentWrap=document.createElement('div');indentWrap.className='b21-s217-tree-indent';
      for(var i=0;i<node.indent;i++){
        if(i<node.indent-1){
          var sp=document.createElement('div');sp.className='b21-s217-tree-spacer';indentWrap.appendChild(sp);
        } else {
          var corner=document.createElement('div');corner.className='b21-s217-tree-corner';indentWrap.appendChild(corner);
        }
      }
      row.appendChild(indentWrap);

      var card=document.createElement('div');card.className='b21-s217-tree-card '+node.cls;
      var top=document.createElement('div');top.className='b21-s217-tree-top';
      var pathEl=document.createElement('span');pathEl.className='b21-s217-tree-path';pathEl.textContent=node.path;
      var lblEl=document.createElement('span');lblEl.className='b21-s217-tree-label';lblEl.textContent=node.label;
      top.appendChild(pathEl);top.appendChild(lblEl);
      var proc=document.createElement('div');proc.className='b21-s217-tree-process';proc.textContent=node.process;
      var val=document.createElement('div');val.className='b21-s217-tree-val';val.textContent=node.val;
      var note=document.createElement('div');note.className='b21-s217-tree-note';note.textContent=node.note;
      card.appendChild(top);card.appendChild(proc);card.appendChild(val);card.appendChild(note);
      row.appendChild(card);
      el.appendChild(row);
    });
  }

  function buildAddrs(){
    var el=g('b21-s217-addr-rows');if(!el) return;el.innerHTML='';
    var p=STDS[std].path;var fmt=STDS[std].fmt;
    var base='m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0/';
    for(var i=0;i<5;i++){
      var row=document.createElement('div');row.className='b21-s217-addr-row';
      row.innerHTML='<div class="b21-s217-addr-cell addr-path">'+base+i+'</div>'+
        '<div class="b21-s217-addr-cell addr-str">'+fakeAddr(std,i)+'</div>'+
        '<div class="b21-s217-addr-cell addr-fmt">'+fmt+'</div>';
      el.appendChild(row);
    }
  }

  var genBtn=g('b21-s217-gen-btn');
  if(genBtn) genBtn.addEventListener('click',function(){
    wordSetIdx=(wordSetIdx+1)%FAKE_SETS.length;
    buildSeed();buildTree();buildAddrs();
  });

  buildSeed();buildStdBtns();buildPath();buildTree();buildAddrs();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.8 SIMULATION (Schnorr vs ECDSA)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}
  function trunc(s,n){return s.length>n?s.slice(0,n)+'...':s;}

  /* ── DATA ── */
  var MODES={
    sign:{
      hint:'The ECDSA and Schnorr signing processes run side by side. A red badge = an ECDSA weakness, a green badge = a Schnorr advantage.',
      ec:[
        {title:'Input: Private Key',formula:'privKey = random 256-bit',badge:null,
         io:[{l:'privKey',v:function(){return rH(64);},c:''}],
         desc:'Private key: a random 256-bit number that must be kept secret.'},
        {title:'Generate Nonce k',formula:'k = random() — MUST be unique each signing',badge:{t:'Risk: reusing k = privKey leaks',c:'extra'},
         io:[{l:'k',v:function(){return rH(64);},c:''},{l:'!',v:function(){return 'reusing k → privKey leaks (PS3 2010)';},c:'out-ec'}],
         desc:'ECDSA: k must be truly random. Reusing the same k for two different messages directly reveals the private key.'},
        {title:'Compute R = k × G, take r = R.x',formula:'R = k × G\nr = R.x mod n',badge:null,
         io:[{l:'r',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Scalar multiplication of the generator point G with the nonce k. Take the x coordinate as r.'},
        {title:'Compute s (needs a modular inverse)',formula:'s = k⁻¹ × (H(msg) + r × privKey) mod n',badge:{t:'Expensive: modular inverse k⁻¹',c:'extra'},
         io:[{l:'H(msg)',v:function(){return rH(64);},c:''},{l:'s',v:function(){return rH(64);},c:'out-ec'}],
         desc:'The modular inverse of k is an expensive operation. s combines the message hash and the private key.'},
        {title:'DER Encode + sighash flag',formula:'0x30 [len] 0x02 [r-len] [r] 0x02 [s-len] [s] 0x01',badge:{t:'Overhead: +7 bytes DER header',c:'extra'},
         io:[{l:'DER sig',v:function(){return '3045022100'+rH(62)+'0220'+rH(62)+'01';},c:'out-ec'}],
         desc:'DER encoding adds a nested header. Produces 71-72 bytes total.'},
      ],
      sc:[
        {title:'Input: Private Key',formula:'privKey = random 256-bit',badge:null,
         io:[{l:'privKey',v:function(){return rH(64);},c:''}],
         desc:'The same private key. Input identical to ECDSA.'},
        {title:'Generate Nonce k (deterministic)',formula:'k = H(privKey || msg || rand)\n[deterministic + random salt]',badge:{t:'Safer: deterministic from privKey',c:'advantage'},
         io:[{l:'k',v:function(){return rH(64);},c:''},{l:'safe',v:function(){return 'even a bad RNG can’t expose privKey';},c:'out-sc'}],
         desc:'Schnorr: k is computed deterministically from the private key + message + random salt. Even if the RNG is bad, the determinism from privKey protects it.'},
        {title:'Compute R = k × G, use x-only',formula:'R = k × G\nuse R.x (32 bytes)',badge:null,
         io:[{l:'R.x',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Same as ECDSA but Schnorr only needs the x coordinate (32 bytes). y can be recovered from x.'},
        {title:'Compute challenge e (combined hash)',formula:'e = H(R.x || P || H(msg))',badge:{t:'Safer: hash pubKey + R + msg',c:'advantage'},
         io:[{l:'P',v:function(){return '02'+rH(62);},c:''},{l:'e',v:function(){return rH(64);},c:'out-sc'}],
         desc:'The challenge e hashes R, pubKey, and message all at once. A tighter structure — formally proven secure.'},
        {title:'Compute s (ordinary addition) → output',formula:'s = k + e × privKey mod n\nsig = R.x || s (64 bytes flat)',badge:{t:'Linear: can be aggregated (MuSig)',c:'advantage'},
         io:[{l:'s',v:function(){return rH(64);},c:'out-sc'},{l:'sig',v:function(){return rH(128);},c:'out-sc'}],
         desc:'s is computed with simple addition — this linearity is what enables signature aggregation.'},
      ],
      ecOut:{lbl:'ECDSA Signature',v:function(){return '3045022100'+rH(62)+'0220'+rH(62)+'01';},sz:'71-72 bytes (DER encoded)',note:'A nested DER format. Overhead of ~7 bytes beyond the actual r and s values.'},
      scOut:{lbl:'Schnorr Signature',v:function(){return rH(128);},sz:'64 bytes (flat r || s)',note:'R.x (32 bytes) directly followed by s (32 bytes). No DER, no header.'},
      results:[
        {lbl:'ECDSA',val:'71-72 bytes',sub:'DER encoded + sighash flag',c:'ec-res'},
        {lbl:'Schnorr',val:'64 bytes',sub:'Flat — 10% smaller, can aggregate',c:'sc-res'},
      ],
    },
    verify:{
      hint:'ECDSA verification needs DER parsing + two modular inverses. Schnorr has fewer steps and can be batched.',
      ec:[
        {title:'Input: pubKey + DER_sig + msg',formula:'input: pubKey, DER_sig, msg',badge:null,
         io:[{l:'pubKey',v:function(){return '02'+rH(62);},c:''},{l:'sig',v:function(){return '3045022100'+rH(32)+'...';},c:''},{l:'msg',v:function(){return rH(64);},c:''}],
         desc:'The node receives: public key, DER-encoded signature, and message hash.'},
        {title:'Parse DER signature',formula:'decode 0x30 → extract r, s',badge:{t:'Extra step: DER parsing',c:'extra'},
         io:[{l:'r',v:function(){return rH(64);},c:'out-ec'},{l:'s',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Parse the nested DER format to extract r and s. This step doesn’t exist in Schnorr.'},
        {title:'Compute u1 and u2',formula:'u1 = H(msg) × s⁻¹ mod n\nu2 = r × s⁻¹ mod n',badge:{t:'Two modular inverses: slower',c:'extra'},
         io:[{l:'u1',v:function(){return rH(64);},c:'out-ec'},{l:'u2',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Two separate modular inverse operations — the most expensive operation in ECDSA verification.'},
        {title:'Compute X = u1×G + u2×pubKey',formula:'X = u1 × G + u2 × pubKey',badge:{t:'Two scalar muls: can’t be batched',c:'extra'},
         io:[{l:'X.x',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Two scalar multiplications. Can’t be batched with other verifications.'},
        {title:'Verify: X.x == r?',formula:'valid = (X.x mod n == r)',badge:null,
         io:[{l:'result',v:function(){return 'X.x == r → VALID ✓';},c:'out-sc'}],
         desc:'Compare the x coordinate. Can’t be batched — each signature is verified separately.'},
      ],
      sc:[
        {title:'Input: pubKey + sig_64 + msg',formula:'input: pubKey, sig[64], msg',badge:null,
         io:[{l:'pubKey',v:function(){return '02'+rH(62);},c:''},{l:'sig',v:function(){return rH(64)+'...';},c:''},{l:'msg',v:function(){return rH(64);},c:''}],
         desc:'The node receives: public key, flat 64-byte signature, and message hash.'},
        {title:'Parse signature (trivial)',formula:'R.x = sig[0:32]\ns   = sig[32:64]',badge:{t:'No DER parsing needed',c:'advantage'},
         io:[{l:'R.x',v:function(){return rH(64);},c:'out-sc'},{l:'s',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Trivial parsing: just slice bytes. No nested format.'},
        {title:'Compute challenge e',formula:'e = H(R.x || P || H(msg))',badge:{t:'Single hash — faster',c:'advantage'},
         io:[{l:'e',v:function(){return rH(64);},c:'out-sc'}],
         desc:'One hash operation. Far faster than ECDSA’s two modular inverses.'},
        {title:'Verify the equation',formula:'s × G == R + e × pubKey\n[linear → can be batched!]',badge:{t:'Can batch-verify N signatures at once',c:'advantage'},
         io:[{l:'s×G',v:function(){return rH(64);},c:'out-sc'},{l:'R+eP',v:function(){return rH(64);},c:'out-sc'}],
         desc:'This equation can be collected with N other equations and verified at once — batch verification.'},
        {title:'Verify: result.x == R.x?',formula:'valid = (result.x == R.x)',badge:{t:'Batch 1000 tx → 2-4× faster',c:'advantage'},
         io:[{l:'result',v:function(){return 'result.x == R.x → VALID ✓ (batchable)';},c:'out-sc'}],
         desc:'Valid. And it can be batched: 3000 Schnorr signatures in one block are verified far faster than 3000 separate ECDSA ones.'},
      ],
      ecOut:{lbl:'ECDSA verification done',v:function(){return 'VALID — X.x ('+rH(16)+'...) == r ('+rH(16)+'...)';},sz:'5 steps, 2 modular inverses, can’t batch',note:'3000 tx in a block = 3000 separate ECDSA verify operations.'},
      scOut:{lbl:'Schnorr verification done',v:function(){return 'VALID — result.x ('+rH(16)+'...) == R.x ('+rH(16)+'...)';},sz:'4 steps, 1 hash, can batch-verify',note:'3000 Schnorr tx can be verified 2-4× faster with batching.'},
      results:[
        {lbl:'ECDSA verification',val:'5 separate steps',sub:'Can’t be batched',c:'ec-res'},
        {lbl:'Schnorr verification',val:'4 steps, batchable',sub:'2-4× faster when batched',c:'sc-res'},
      ],
    },
  };

  /* ── FLOW (TAB 1 & 2) ── */
  var flowMode='sign';
  var flowStep=0;
  var flowAutoInterval=null;

  function buildFlowSteps(modeKey){
    var ecEl=g('b21-s218-ec-steps');var scEl=g('b21-s218-sc-steps');
    if(!ecEl||!scEl) return;
    ecEl.innerHTML='';scEl.innerHTML='';
    var data=MODES[modeKey];
    data.ec.forEach(function(s,i){ecEl.appendChild(makeStepEl(s,i,'ec'));});
    data.sc.forEach(function(s,i){scEl.appendChild(makeStepEl(s,i,'sc'));});
  }

  function makeStepEl(s,i,side){
    var div=document.createElement('div');
    div.className='b21-s218-step s218-'+side+'-step';
    div.id='b21-s218-'+side+'-step-'+i;
    var top=document.createElement('div');top.className='b21-s218-step-top';
    var num=document.createElement('div');num.className='b21-s218-step-num';num.textContent=String(i+1).padStart(2,'0');
    var title=document.createElement('div');title.className='b21-s218-step-title';title.textContent=s.title;
    top.appendChild(num);top.appendChild(title);
    if(s.badge){var b=document.createElement('div');b.className='b21-s218-badge '+s.badge.c;b.textContent=s.badge.t;top.appendChild(b);}
    div.appendChild(top);
    var formula=document.createElement('div');formula.className='b21-s218-step-formula';formula.textContent=s.formula;div.appendChild(formula);
    var io=document.createElement('div');io.className='b21-s218-step-io';io.id='b21-s218-io-'+side+'-'+i;div.appendChild(io);
    var desc=document.createElement('div');desc.className='b21-s218-step-desc';desc.textContent=s.desc;div.appendChild(desc);
    return div;
  }

  function renderFlowStep(){
    var data=MODES[flowMode];
    var maxS=Math.max(data.ec.length,data.sc.length);
    for(var i=0;i<maxS;i++){
      var ecEl=g('b21-s218-ec-step-'+i);var scEl=g('b21-s218-sc-step-'+i);
      if(ecEl){ecEl.classList.remove('active','done');if(i<flowStep-1)ecEl.classList.add('done');else if(i===flowStep-1)ecEl.classList.add('active');}
      if(scEl){scEl.classList.remove('active','done');if(i<flowStep-1)scEl.classList.add('done');else if(i===flowStep-1)scEl.classList.add('active');}
      if(i===flowStep-1){
        var ecS=data.ec[i];var scS=data.sc[i];
        if(ecS){var ecIo=g('b21-s218-io-ec-'+i);if(ecIo){ecIo.innerHTML='';ecS.io.forEach(function(row){var r=document.createElement('div');r.className='b21-s218-step-io-row';r.innerHTML='<div class="b21-s218-step-io-lbl">'+row.l+':</div><div class="b21-s218-step-io-val '+row.c+'">'+trunc(row.v(),52)+'</div>';ecIo.appendChild(r);});}}
        if(scS){var scIo=g('b21-s218-io-sc-'+i);if(scIo){scIo.innerHTML='';scS.io.forEach(function(row){var r=document.createElement('div');r.className='b21-s218-step-io-row';r.innerHTML='<div class="b21-s218-step-io-lbl">'+row.l+':</div><div class="b21-s218-step-io-val '+row.c+'">'+trunc(row.v(),52)+'</div>';scIo.appendChild(r);});}}
      }
    }
    var info=g('b21-s218-step-info');
    if(info) info.textContent=flowStep===0?'Press Step or Auto to begin':'Step '+flowStep+' of '+maxS;
    var outWrap=g('b21-s218-outputs');
    if(flowStep>maxS){
      if(outWrap) outWrap.style.display='block';
      renderFlowOutput();
      if(info) info.textContent='Done';
      var sb=g('b21-s218-step-btn');if(sb) sb.disabled=true;
      var ab=g('b21-s218-auto-btn');if(ab) ab.disabled=true;
      stopFlowAuto();
    } else {
      if(outWrap) outWrap.style.display='none';
    }
  }

  function renderFlowOutput(){
    var data=MODES[flowMode];
    var ecOut=g('b21-s218-ec-out');var scOut=g('b21-s218-sc-out');
    if(ecOut) ecOut.innerHTML='<div class="b21-s218-out-lbl2">'+data.ecOut.lbl+'</div><div class="b21-s218-out-val">'+trunc(data.ecOut.v(),72)+'</div><div class="b21-s218-out-sz">'+data.ecOut.sz+'</div><div class="b21-s218-out-note">'+data.ecOut.note+'</div>';
    if(scOut) scOut.innerHTML='<div class="b21-s218-out-lbl2">'+data.scOut.lbl+'</div><div class="b21-s218-out-val">'+trunc(data.scOut.v(),72)+'</div><div class="b21-s218-out-sz">'+data.scOut.sz+'</div><div class="b21-s218-out-note">'+data.scOut.note+'</div>';
    var rr=g('b21-s218-result-row');
    if(rr){rr.innerHTML='';data.results.forEach(function(r){var b=document.createElement('div');b.className='b21-s218-res-box '+r.c;b.innerHTML='<div class="b21-s218-res-lbl">'+r.lbl+'</div><div class="b21-s218-res-val">'+r.val+'</div><div class="b21-s218-res-sub">'+r.sub+'</div>';rr.appendChild(b);});}
  }

  function doFlowStep(){
    var data=MODES[flowMode];
    var maxS=Math.max(data.ec.length,data.sc.length);
    if(flowStep<=maxS){flowStep++;renderFlowStep();}
  }

  function stopFlowAuto(){
    if(flowAutoInterval){clearInterval(flowAutoInterval);flowAutoInterval=null;}
    var ab=g('b21-s218-auto-btn');if(ab){ab.textContent='⚡ Auto';ab.className='b21-s218-btn s218-primary';}
  }

  function resetFlow(){
    stopFlowAuto();flowStep=0;
    var sb=g('b21-s218-step-btn');if(sb) sb.disabled=false;
    var ab=g('b21-s218-auto-btn');if(ab){ab.disabled=false;ab.textContent='⚡ Auto';ab.className='b21-s218-btn s218-primary';}
    buildFlowSteps(flowMode);renderFlowStep();
    var outWrap=g('b21-s218-outputs');if(outWrap) outWrap.style.display='none';
    var hint=g('b21-s218-flow-hint');if(hint) hint.textContent=MODES[flowMode].hint;
  }

  var stepBtn=g('b21-s218-step-btn');if(stepBtn) stepBtn.addEventListener('click',doFlowStep);
  var autoBtn=g('b21-s218-auto-btn');
  if(autoBtn) autoBtn.addEventListener('click',function(){
    if(flowAutoInterval){stopFlowAuto();return;}
    flowAutoInterval=setInterval(function(){
      var data=MODES[flowMode];
      if(flowStep>Math.max(data.ec.length,data.sc.length)){stopFlowAuto();return;}
      doFlowStep();
    },1200);
    autoBtn.textContent='⏸ Pause';autoBtn.className='b21-s218-btn s218-secondary';
  });
  var resetBtn=g('b21-s218-reset-btn');if(resetBtn) resetBtn.addEventListener('click',resetFlow);

  /* ── 3-TX AGGREGATION (TAB 3) ── */
  var agStep=0;var agAutoInterval=null;
  var AG_MAX=7;
  var ecSigs=['3045022100'+rH(62)+'0220'+rH(62)+'01','3044022043'+rH(60)+'0220'+rH(62)+'01','3045022100'+rH(62)+'0220'+rH(60)+'0301'];
  var scSigs=[rH(128),rH(128),rH(128)];
  var aggSig=rH(128);var hashes=[rH(64),rH(64),rH(64)];

  function renderAgStep(){
    var info=g('b21-s218-ag-info');
    var labels=['Press Step or Auto to begin','TX 1: Alice signs','TX 2: Carol signs','TX 3: Eve signs','Schnorr: aggregate 3 partial sigs into 1','Comparison of total size','What is visible on the blockchain','Done'];
    if(info) info.textContent=labels[Math.min(agStep,labels.length-1)];

    for(var i=0;i<3;i++){
      var tx=g('b21-s218-tx-'+i);if(tx){tx.classList.remove('active');if(agStep===i+1) tx.classList.add('active');}
      var h=g('b21-s218-hash-'+i);if(h&&agStep>i) h.textContent='txhash: '+trunc(hashes[i],32);
      var ecBox=g('b21-s218-ec-box-'+i);var scBox=g('b21-s218-sc-box-'+i);
      var ecVal=g('b21-s218-ec-val-'+i);var scVal=g('b21-s218-sc-val-'+i);
      if(agStep>i){
        if(ecBox){ecBox.classList.remove('s218-pending');ecBox.classList.add('s218-done');}
        if(scBox){scBox.classList.remove('s218-pending');scBox.classList.add('s218-done');}
        if(ecVal){ecVal.textContent=trunc(ecSigs[i],48);ecVal.className='b21-s218-ag-box-val filled-ec';}
        if(scVal){scVal.textContent=trunc(scSigs[i],48);scVal.className='b21-s218-ag-box-val filled-sc';}
      } else {
        if(ecBox){ecBox.classList.add('s218-pending');ecBox.classList.remove('s218-done');}
        if(scBox){scBox.classList.add('s218-pending');scBox.classList.remove('s218-done');}
        if(ecVal){ecVal.textContent='waiting...';ecVal.className='b21-s218-ag-box-val';}
        if(scVal){scVal.textContent='waiting...';scVal.className='b21-s218-ag-box-val';}
      }
    }

    var aggWrap=g('b21-s218-agg-wrap');var aggVal=g('b21-s218-agg-val');
    if(agStep>=4){
      if(aggWrap) aggWrap.style.display='flex';
      if(aggVal) aggVal.textContent='s_agg: '+trunc(aggSig,36)+'\nR_agg: 02'+rH(30);
    } else {
      if(aggWrap) aggWrap.style.display='none';
    }

    var totals=g('b21-s218-ag-totals');if(totals) totals.style.display=agStep>=5?'block':'none';

    var priv=g('b21-s218-privacy');var obsEc=g('b21-s218-obs-ec');var obsSc=g('b21-s218-obs-sc');
    if(agStep>=6){
      if(priv) priv.style.display='flex';
      if(obsEc) obsEc.textContent='ECDSA TX1: witness=['+trunc(ecSigs[0],18)+'...] pubKey=['+rH(16)+'...]\nECDSA TX2: witness=['+trunc(ecSigs[1],18)+'...] pubKey=['+rH(16)+'...]\nECDSA TX3: witness=['+trunc(ecSigs[2],18)+'...] pubKey=['+rH(16)+'...]\n→ 3 senders, 3 DER signatures, 3 separate verifications';
      if(obsSc) obsSc.textContent='Schnorr: witness=['+trunc(aggSig,36)+'...] pubKey=[02'+rH(16)+'...]\n→ 1 signature 64 bytes, 1 pubKey — identical to single-sig\n→ the observer can’t tell how many parties are involved';
    } else {
      if(priv) priv.style.display='none';
    }

    if(agStep>=AG_MAX){
      var sb=g('b21-s218-ag-step');if(sb) sb.disabled=true;
      var ab=g('b21-s218-ag-auto');if(ab) ab.disabled=true;
      stopAgAuto();
    }
  }

  function stopAgAuto(){
    if(agAutoInterval){clearInterval(agAutoInterval);agAutoInterval=null;}
    var ab=g('b21-s218-ag-auto');if(ab){ab.textContent='⚡ Auto';ab.className='b21-s218-btn s218-primary';}
  }

  function resetAg(){
    stopAgAuto();agStep=0;
    ecSigs=['3045022100'+rH(62)+'0220'+rH(62)+'01','3044022043'+rH(60)+'0220'+rH(62)+'01','3045022100'+rH(62)+'0220'+rH(60)+'0301'];
    scSigs=[rH(128),rH(128),rH(128)];aggSig=rH(128);hashes=[rH(64),rH(64),rH(64)];
    var sb=g('b21-s218-ag-step');if(sb) sb.disabled=false;
    var ab=g('b21-s218-ag-auto');if(ab){ab.disabled=false;ab.textContent='⚡ Auto';ab.className='b21-s218-btn s218-primary';}
    var priv=g('b21-s218-privacy');if(priv) priv.style.display='none';
    renderAgStep();
  }

  var agStepBtn=g('b21-s218-ag-step');if(agStepBtn) agStepBtn.addEventListener('click',function(){if(agStep<AG_MAX){agStep++;renderAgStep();}});
  var agAutoBtn=g('b21-s218-ag-auto');
  if(agAutoBtn) agAutoBtn.addEventListener('click',function(){
    if(agAutoInterval){stopAgAuto();return;}
    agAutoInterval=setInterval(function(){if(agStep>=AG_MAX){stopAgAuto();return;}agStep++;renderAgStep();},1400);
    agAutoBtn.textContent='⏸ Pause';agAutoBtn.className='b21-s218-btn s218-secondary';
  });
  var agResetBtn=g('b21-s218-ag-reset');if(agResetBtn) agResetBtn.addEventListener('click',resetAg);

  /* ── TABS ── */
  var tabIds=['b21-s218-t1','b21-s218-t2','b21-s218-t3'];
  var paneIds=['b21-s218-p1','b21-s218-p2','b21-s218-p3'];
  tabIds.forEach(function(tid,i){
    var btn=g(tid);if(!btn) return;
    btn.addEventListener('click',function(){
      tabIds.forEach(function(t){var el=g(t);if(el) el.className='b21-s218-tab';});
      paneIds.forEach(function(p){var el=g(p);if(el) el.className='b21-s218-pane';});
      var el=g(tid);if(el) el.className='b21-s218-tab s218-act';
      var pe=g(paneIds[i]);if(pe) pe.className='b21-s218-pane show';
      if(i===0){flowMode='sign';resetFlow();}
      else if(i===1){
        // Switch to verify mode in pane 1 (shared)
        var p1=g('b21-s218-p1');if(p1) p1.className='b21-s218-pane show';
        var p2=g('b21-s218-p2');if(p2) p2.className='b21-s218-pane';
        tabIds.forEach(function(t){var el=g(t);if(el) el.className='b21-s218-tab';});
        var te=g(tid);if(te) te.className='b21-s218-tab s218-act';
        flowMode='verify';resetFlow();
      }
    });
  });

  /* ── INIT ── */
  buildFlowSteps('sign');renderFlowStep();
  var priv=g('b21-s218-privacy');if(priv) priv.style.display='none';
  renderAgStep();
})();

// ============================================================
// PAGE 24 · BAB 21 · 21.9 SIMULATION (Lightning Network TX Flow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){var s='';for(var i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}
  function trunc(s,n){return s.length>n?s.slice(0,n)+'...':s;}

  var MODES={
    success:{
      label:'Payment Succeeded',
      nodes:[
        {id:'alice',label:'Alice',x:60, y:90, color:'#534AB7',sub:'sender'},
        {id:'bob',  label:'Bob',  x:210,y:45, color:'#185FA5',sub:'routing node'},
        {id:'carol',label:'Carol',x:380,y:130,color:'#185FA5',sub:'routing node'},
        {id:'frank',label:'Frank',x:530,y:60, color:'#0F6E56',sub:'recipient'},
        {id:'eve',  label:'Eve',  x:420,y:30, color:'#52524C',sub:'other node'},
      ],
      edges:[
        {a:'alice',b:'bob',  active:true, label:'0.6 BTC'},
        {a:'bob',  b:'carol',active:true, label:'0.4 BTC'},
        {a:'carol',b:'frank',active:true, label:'0.5 BTC'},
        {a:'bob',  b:'eve',  active:false,label:'0.2 BTC'},
        {a:'eve',  b:'frank',active:false,label:'0.1 BTC'},
      ],
      channels:[
        {label:'Alice to Bob',   local:60,remote:40,failLabel:''},
        {label:'Bob to Carol',   local:40,remote:60,failLabel:''},
        {label:'Carol to Frank', local:50,remote:50,failLabel:''},
      ],
      payHash:rH(32),
      steps:[
        {title:'Frank creates an invoice, sends it to Alice',      dir:'Frank → Alice (off-chain)',type:'',
         desc:'Frank generates a payment hash H = SHA256(preimage r). The invoice sent to Alice contains H and the requested amount.',
         code:'invoice: lnbc2m1...xyz\npayment_hash: H = SHA256(r)\namount: 200,000 sat'},
        {title:'Alice finds a route to Frank',               dir:'Alice queries the gossip protocol',type:'',
         desc:'Alice queries the Lightning gossip protocol to find a route with enough liquidity and the lowest fee.',
         code:'path: Alice → Bob → Carol → Frank\ntotal fee: 10 sat\ntimelocks: 3 x 144 blocks'},
        {title:'Alice locks an HTLC to Bob',                  dir:'Alice → Bob',type:'s219-lock',
         desc:'Alice locks 200,010 sat to Bob: Bob can claim it if he shows the preimage r before the timelock expires.',
         code:'HTLC lock: 200,010 sat\ncondition: SHA256(r) = H\ntimelock: CLTV +144 blocks'},
        {title:'Bob forwards the HTLC to Carol',               dir:'Bob → Carol',type:'s219-lock',
         desc:'Bob locks 200,005 sat to Carol with the same condition. Bob keeps 5 sat as a fee.',
         code:'HTLC lock: 200,005 sat\ncondition: same H\ntimelock: CLTV +144 blocks'},
        {title:'Carol forwards the HTLC to Frank',             dir:'Carol → Frank',type:'s219-lock',
         desc:'Carol locks 200,000 sat to Frank. Frank is the final recipient and knows the preimage r.',
         code:'HTLC lock: 200,000 sat\ncondition: same H\ntimelock: CLTV +144 blocks'},
        {title:'Frank reveals the preimage, claims the payment',    dir:'Frank → Carol',type:'s219-settle',
         desc:'Frank reveals the preimage r to Carol. Carol verifies SHA256(r)==H, then pays Frank 200,000 sat.',
         code:'preimage r revealed\nSHA256(r) == H ✓\nCarol pays Frank 200,000 sat'},
        {title:'Carol settles the HTLC to Bob',                dir:'Carol → Bob',type:'s219-settle',
         desc:'Carol uses the same r to claim 200,005 sat from Bob. The 5 sat difference is Carol’s fee.',
         code:'Carol reveals r → Bob\nBob pays Carol 200,005 sat\nCarol fee: +5 sat'},
        {title:'Bob settles the HTLC to Alice',                dir:'Bob → Alice',type:'s219-settle',
         desc:'Bob uses r to claim 200,010 sat from Alice. The payment is complete, all channels updated off-chain.',
         code:'Bob reveals r → Alice\nAlice pays Bob 200,010 sat\nBob fee: +5 sat\nDone!'},
      ],
      htlcs:[
        {hop:'Alice→Bob',  amount:'200,010 sat',hash:'',status:'waiting'},
        {hop:'Bob→Carol',  amount:'200,005 sat',hash:'',status:'waiting'},
        {hop:'Carol→Frank',amount:'200,000 sat',hash:'',status:'waiting'},
      ],
      result:{cls:'s219-success',lbl:'Payment succeeded!',
        val:'Alice paid Frank 200,000 sat in seconds, with no on-chain transaction, a fee of only 10 sat (0.005%). The balances of all three channels updated off-chain.',
        note:'Atomic: if one hop fails, all HTLCs are cancelled and Alice’s funds return intact.'},
      lockSteps:[2,3,4],settleSteps:[5,6,7],failSteps:[],
    },
    fail:{
      label:'Failure & Retry',
      nodes:[
        {id:'alice',label:'Alice',x:60, y:90, color:'#534AB7',sub:'sender'},
        {id:'bob',  label:'Bob',  x:210,y:45, color:'#185FA5',sub:'routing node'},
        {id:'carol',label:'Carol',x:370,y:130,color:'#A32D2D',sub:'low balance'},
        {id:'frank',label:'Frank',x:530,y:60, color:'#0F6E56',sub:'recipient'},
        {id:'dave', label:'Dave', x:390,y:25, color:'#185FA5',sub:'routing node'},
      ],
      edges:[
        {a:'alice',b:'bob',  active:true, label:'0.6 BTC'},
        {a:'bob',  b:'carol',active:true, label:'0.4 BTC'},
        {a:'carol',b:'frank',active:false,label:'0.05 BTC',fail:true},
        {a:'bob',  b:'dave', active:false,label:'0.5 BTC'},
        {a:'dave', b:'frank',active:false,label:'0.4 BTC'},
      ],
      channels:[
        {label:'Alice to Bob',   local:60,remote:40,failLabel:''},
        {label:'Bob to Carol',   local:40,remote:60,failLabel:''},
        {label:'Carol to Frank', local:5, remote:95,failLabel:'insufficient balance'},
      ],
      payHash:rH(32),
      steps:[
        {title:'Alice tries the first route via Carol',      dir:'Alice → Bob → Carol → Frank',type:'',
         desc:'Alice picks the route via Carol. The Carol→Frank balance isn’t publicly visible, so Alice doesn’t know the actual balance is only 50,000 sat.',
         code:'route: Alice → Bob → Carol → Frank\nCarol→Frank liquidity (actual): 50,000 sat\nneeds: 300,000 sat'},
        {title:'HTLC locked: Alice to Bob',             dir:'Alice → Bob',type:'s219-lock',
         desc:'Alice locks an HTLC to Bob. The funds are locked temporarily but haven’t moved permanently.',
         code:'HTLC lock: 300,010 sat\ncondition: SHA256(r) = H\ntimelock active'},
        {title:'HTLC locked: Bob to Carol',             dir:'Bob → Carol',type:'s219-lock',
         desc:'Bob forwards the HTLC to Carol. Two hops are now locked.',
         code:'HTLC lock: 300,005 sat\ncondition: same H'},
        {title:'Carol fails to forward to Frank',            dir:'Carol × Frank',type:'s219-fail',
         desc:'Carol only has 50,000 sat to Frank, needs 300,000. Carol sends an insufficient_balance error back to Bob.',
         code:'Carol→Frank balance: 50,000 sat\nneeded: 300,000 sat\nerror: insufficient_balance'},
        {title:'All HTLCs cancelled atomically',            dir:'Bob → Alice (cancel)',type:'s219-fail',
         desc:'Bob forwards the failure message to Alice. The Alice→Bob HTLC is cancelled. Alice’s funds return intact.',
         code:'HTLC cancelled: Alice→Bob\nAlice balance restored +300,010 sat\nno funds lost'},
        {title:'Alice retries via Dave',                    dir:'Alice → Bob → Dave → Frank',type:'s219-settle',
         desc:'Alice tries the alternative route via Dave, who has enough liquidity. This time it succeeds.',
         code:'new route: Alice → Bob → Dave → Frank\nDave→Frank liquidity: 400,000 sat ✓\nretry succeeded'},
      ],
      htlcs:[
        {hop:'Alice→Bob',  amount:'300,010 sat',hash:'',status:'waiting'},
        {hop:'Bob→Carol',  amount:'300,005 sat',hash:'',status:'waiting'},
        {hop:'Carol→Frank',amount:'300,000 sat',hash:'',status:'waiting',fail:true},
      ],
      result:{cls:'s219-retry',lbl:'Retry succeeded via an alternative route',
        val:'The first route failed because the Carol→Frank liquidity wasn’t enough. No funds were lost. Alice automatically retries via Dave and succeeds.',
        note:'HTLCs are atomic: no funds can be claimed without the preimage. Failure is always safe.'},
      lockSteps:[1,2],settleSteps:[5],failSteps:[3,4],
    },
  };

  var mode='success';
  var step=0;
  var autoInterval=null;
  var pulseEl=null;

  function initMode(){
    var m=MODES[mode];
    m.htlcs.forEach(function(h){
      h.hash=trunc(m.payHash,16);
      h.status='waiting';
    });
  }

  function buildNetwork(){
    var m=MODES[mode];
    var svg=g('b21-s219-svg');if(!svg) return;
    svg.innerHTML='';
    var nodeMap={};
    m.nodes.forEach(function(n){nodeMap[n.id]=n;});
    m.edges.forEach(function(e){
      var a=nodeMap[e.a];var b=nodeMap[e.b];if(!a||!b) return;
      var line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);
      line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);
      line.setAttribute('stroke',e.fail?'#A32D2D':e.active?'#534AB7':'#C8C8C0');
      line.setAttribute('stroke-width',e.active||e.fail?'2.5':'1.5');
      line.setAttribute('stroke-dasharray',e.active?'none':'5,4');
      svg.appendChild(line);
      var lbl=document.createElementNS('http://www.w3.org/2000/svg','text');
      lbl.setAttribute('x',(a.x+b.x)/2);lbl.setAttribute('y',(a.y+b.y)/2-6);
      lbl.setAttribute('text-anchor','middle');lbl.setAttribute('font-size','9');
      lbl.setAttribute('fill',e.active?'#534AB7':e.fail?'#A32D2D':'#52524C');
      lbl.textContent=e.label;svg.appendChild(lbl);
    });
    m.nodes.forEach(function(n){
      var circ=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circ.setAttribute('cx',n.x);circ.setAttribute('cy',n.y);circ.setAttribute('r','20');
      circ.setAttribute('fill',n.color);circ.id='b21-s219-node-'+n.id;
      svg.appendChild(circ);
      var lbl=document.createElementNS('http://www.w3.org/2000/svg','text');
      lbl.setAttribute('x',n.x);lbl.setAttribute('y',n.y+4);
      lbl.setAttribute('text-anchor','middle');lbl.setAttribute('font-size','10');
      lbl.setAttribute('font-weight','500');lbl.setAttribute('fill','#fff');
      lbl.textContent=n.label;svg.appendChild(lbl);
      var sub=document.createElementNS('http://www.w3.org/2000/svg','text');
      sub.setAttribute('x',n.x);sub.setAttribute('y',n.y+34);
      sub.setAttribute('text-anchor','middle');sub.setAttribute('font-size','8');
      sub.setAttribute('fill',n.color);sub.textContent=n.sub;svg.appendChild(sub);
    });
  }

  function pulseEdge(aId,bId,color){
    var m=MODES[mode];var nodeMap={};
    m.nodes.forEach(function(n){nodeMap[n.id]=n;});
    var a=nodeMap[aId];var b=nodeMap[bId];if(!a||!b) return;
    var svg=g('b21-s219-svg');if(!svg) return;
    if(pulseEl&&pulseEl.parentNode){try{svg.removeChild(pulseEl);}catch(e){}}
    var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('r','7');c.setAttribute('fill',color||'#534AB7');
    pulseEl=c;svg.appendChild(c);
    var startT=null;var dur=900;
    function anim(ts){
      if(!startT) startT=ts;
      var p=Math.min((ts-startT)/dur,1);
      c.setAttribute('cx',String(a.x+(b.x-a.x)*p));
      c.setAttribute('cy',String(a.y+(b.y-a.y)*p));
      c.setAttribute('opacity',String(1-p*0.4));
      if(p<1) requestAnimationFrame(anim);
      else if(pulseEl&&pulseEl.parentNode){try{svg.removeChild(pulseEl);}catch(e){}}
    }
    requestAnimationFrame(anim);
  }

  function buildChannels(){
    var el=g('b21-s219-channels');if(!el) return;el.innerHTML='';
    MODES[mode].channels.forEach(function(ch,i){
      var row=document.createElement('div');row.className='b21-s219-ch-row';
      var lbl=document.createElement('div');lbl.className='b21-s219-ch-lbl';
      lbl.textContent=ch.label;
      if(ch.failLabel){
        var fl=document.createElement('span');
        fl.style.cssText='font-size:9px;color:#A32D2D;margin-left:4px;';
        fl.textContent=ch.failLabel;lbl.appendChild(fl);
      }
      var wrap=document.createElement('div');wrap.className='b21-s219-ch-bar-wrap';
      var bl=document.createElement('div');bl.className='b21-s219-ch-bar-l';
      bl.style.width=ch.local+'%';bl.id='b21-s219-cbl-'+i;
      var br=document.createElement('div');br.className='b21-s219-ch-bar-r';
      br.style.width=ch.remote+'%';br.id='b21-s219-cbr-'+i;
      wrap.appendChild(bl);wrap.appendChild(br);
      var vals=document.createElement('div');vals.className='b21-s219-ch-vals';
      vals.id='b21-s219-cv-'+i;
      vals.textContent=ch.local+'% | '+ch.remote+'%';
      row.appendChild(lbl);row.appendChild(wrap);row.appendChild(vals);
      el.appendChild(row);
    });
  }

  function buildHtlc(){
    var el=g('b21-s219-htlc-stack');if(!el) return;el.innerHTML='';
    MODES[mode].htlcs.forEach(function(h,i){
      var row=document.createElement('div');
      row.className='b21-s219-htlc-row';row.id='b21-s219-htlc-'+i;
      row.innerHTML='<div class="b21-s219-htlc-hop">'+h.hop+'</div>'+
        '<div class="b21-s219-htlc-cell" id="b21-s219-ha-'+i+'">—</div>'+
        '<div class="b21-s219-htlc-cell" id="b21-s219-hh-'+i+'">—</div>'+
        '<div class="b21-s219-htlc-cell" id="b21-s219-hs-'+i+'">waiting</div>';
      el.appendChild(row);
    });
  }

  function buildStepCards(){
    var el=g('b21-s219-steps-wrap');if(!el) return;el.innerHTML='';
    MODES[mode].steps.forEach(function(s,i){
      var card=document.createElement('div');
      card.className='b21-s219-step-card '+(s.type||'');
      card.id='b21-s219-step-'+i;
      card.innerHTML='<div class="b21-s219-step-num">'+String(i+1).padStart(2,'0')+'</div>'+
        '<div class="b21-s219-step-body">'+
        '<div class="b21-s219-step-title">'+s.title+'</div>'+
        '<div class="b21-s219-step-dir">'+s.dir+'</div>'+
        '<div class="b21-s219-step-desc">'+s.desc+'</div>'+
        '<div class="b21-s219-step-code">'+s.code+'</div>'+
        '</div>';
      el.appendChild(card);
    });
  }

  function updateHtlc(){
    var m=MODES[mode];
    var ph=trunc(m.payHash,14);
    m.htlcs.forEach(function(h,i){
      var row=g('b21-s219-htlc-'+i);
      var amtEl=g('b21-s219-ha-'+i);
      var hashEl=g('b21-s219-hh-'+i);
      var statEl=g('b21-s219-hs-'+i);
      if(!row) return;
      var lockStep=m.lockSteps[i];
      var settled=m.settleSteps.length>0&&step-1>=m.settleSteps[0];
      var failed=h.fail&&m.failSteps.length>0&&step-1>=m.failSteps[m.failSteps.length-1];
      if(lockStep!==undefined&&step-1>=lockStep){
        row.classList.add('active');
        if(amtEl) amtEl.textContent=h.amount;
        if(hashEl) hashEl.textContent=ph;
        if(statEl) statEl.textContent='locked';
      }
      if(settled&&!h.fail){
        row.classList.remove('active');row.classList.add('settled');
        if(statEl) statEl.textContent='settled ✓';
        if(hashEl) hashEl.textContent='preimage: '+trunc(rH(32),10);
      }
      if(failed){
        row.classList.remove('active');row.classList.add('failed');
        if(statEl) statEl.textContent='cancelled';
      }
    });
  }

  var EDGE_PULSE={
    'Alice → Bob':          ['alice','bob','#534AB7'],
    'Bob → Carol':          ['bob','carol','#534AB7'],
    'Carol → Frank':        ['carol','frank','#534AB7'],
    'Frank → Carol':        ['frank','carol','#0F6E56'],
    'Carol → Bob':          ['carol','bob','#0F6E56'],
    'Bob → Alice':          ['bob','alice','#0F6E56'],
    'Carol × Frank':        ['carol','frank','#A32D2D'],
    'Bob → Alice (cancel)': ['bob','alice','#A32D2D'],
    'Alice → Bob → Carol → Frank':['alice','bob','#534AB7'],
    'Alice → Bob → Dave → Frank': ['alice','bob','#0F6E56'],
    'Alice query gossip protocol':['alice','bob','#534AB7'],
    'Frank → Alice (off-chain)':['frank','alice','#0F6E56'],
  };

  function renderStep(){
    var m=MODES[mode];
    var maxS=m.steps.length;
    m.steps.forEach(function(s,i){
      var card=g('b21-s219-step-'+i);if(!card) return;
      card.classList.remove('active','done');
      if(i<step-1) card.classList.add('done');
      else if(i===step-1) card.classList.add('active');
    });
    var info=g('b21-s219-step-info');
    if(info) info.textContent=step===0?'Press Step or Auto to begin':
      step<=maxS?'Step '+step+' of '+maxS:'Done';
    updateHtlc();
    if(step>0&&step<=maxS){
      var s=m.steps[step-1];
      var ep=EDGE_PULSE[s.dir];
      if(ep) pulseEdge(ep[0],ep[1],ep[2]);
    }
    var res=g('b21-s219-result');
    if(step>maxS){
      if(res){
        res.className='b21-s219-result show '+m.result.cls;
        res.innerHTML='<div class="b21-s219-result-lbl">'+m.result.lbl+'</div>'+
          '<div class="b21-s219-result-val">'+m.result.val+'</div>'+
          '<div class="b21-s219-result-note">'+m.result.note+'</div>';
      }
      var sb=g('b21-s219-step-btn');if(sb) sb.disabled=true;
      var ab=g('b21-s219-auto-btn');if(ab) ab.disabled=true;
      stopAuto();
    } else {
      if(res) res.className='b21-s219-result';
    }
  }

  function stopAuto(){
    if(autoInterval){clearInterval(autoInterval);autoInterval=null;}
    var ab=g('b21-s219-auto-btn');
    if(ab){ab.textContent='⚡ Auto';ab.className='b21-s219-btn s219-primary';}
  }

  function resetAll(){
    stopAuto();step=0;initMode();
    var sb=g('b21-s219-step-btn');if(sb){sb.disabled=false;sb.textContent='► Step';}
    var ab=g('b21-s219-auto-btn');if(ab){ab.disabled=false;ab.textContent='⚡ Auto';ab.className='b21-s219-btn s219-primary';}
    buildNetwork();buildChannels();buildHtlc();buildStepCards();renderStep();
    var res=g('b21-s219-result');if(res) res.className='b21-s219-result';
  }

  function buildModeBtns(){
    var el=g('b21-s219-mode-btns');if(!el) return;el.innerHTML='';
    Object.keys(MODES).forEach(function(key){
      var btn=document.createElement('button');
      btn.className='b21-s219-mode-btn'+(key===mode?' act':'');
      btn.textContent=MODES[key].label;
      btn.addEventListener('click',function(){mode=key;resetAll();buildModeBtns();});
      el.appendChild(btn);
    });
  }

  var stepBtn=g('b21-s219-step-btn');
  if(stepBtn) stepBtn.addEventListener('click',function(){
    var m=MODES[mode];
    if(step<=m.steps.length){step++;renderStep();}
  });
  var autoBtn=g('b21-s219-auto-btn');
  if(autoBtn) autoBtn.addEventListener('click',function(){
    if(autoInterval){stopAuto();return;}
    autoInterval=setInterval(function(){
      var m=MODES[mode];
      if(step>m.steps.length){stopAuto();return;}
      step++;renderStep();
    },1500);
    autoBtn.textContent='⏸ Pause';
    autoBtn.className='b21-s219-btn s219-secondary';
  });
  var resetBtn=g('b21-s219-reset-btn');
  if(resetBtn) resetBtn.addEventListener('click',resetAll);

  buildModeBtns();initMode();
  buildNetwork();buildChannels();buildHtlc();buildStepCards();renderStep();
})();


// ============================================================
// ============================================================
// PAGE 24 · BAB 21 · 21.1 SIMULATION (Crypto Flow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function rH(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s;}
  function trunc(s,n){return s.length>n?s.slice(0,n)+'...':s;}
  function chunk(s,n){return s.match(new RegExp('.{1,'+n+'}','g')).join(' ');}

  let addrType='p2wpkh';

  function genSteps(){
    const privKey=rH(64);
    const prefix=Math.random()>0.5?'02':'03';
    const sha256_1=rH(64);
    const ripe160=rH(40);
    const steps=[];

    steps.push({num:'01',cls:'s211-rand',label:'CSPRNG — Cryptographically Secure Pseudo-Random Number Generator',
      op:'os.urandom(32) or /dev/urandom',
      hex:trunc(chunk(privKey.slice(0,32),8),60)+'...',
      desc:'The operating system generates 256 bits of cryptographically secure random number. This is the source of entropy that no one can predict.'});

    steps.push({num:'02',cls:'s211-priv',label:'Private key (256-bit)',
      op:'format: 64-character hex string = 32 bytes',
      hex:trunc(chunk(privKey,16),80),
      desc:'The random number stored as the private key. Anyone who has this number owns the Bitcoin at the address it produces. It must be kept very secret.'});

    steps.push({num:'03',cls:'s211-pub',label:'Public key uncompressed',
      op:'privKey × G (generator point secp256k1) → point (x, y)',
      hex:'04 '+trunc(rH(32)+' '+rH(32),72),
      desc:'Multiplication of the private key with the generator point G on the secp256k1 curve. The result is a point (x, y). The 04 prefix marks an uncompressed public key (65 bytes: 1+32+32).'});

    steps.push({num:'04',cls:'s211-comp',label:'Public key compressed (33 bytes)',
      op:`take the x coordinate + prefix ${prefix} (y ${prefix==='02'?'even':'odd'})`,
      hex:prefix+' '+trunc(chunk(rH(62),16),72),
      desc:`Just store the x coordinate and the sign of y (even=02, odd=03). The result is 33 bytes vs 65 bytes uncompressed — more efficient on the blockchain.`});

    steps.push({num:'05',cls:'s211-sha',label:'SHA256 (pubkey compressed)',
      op:'SHA256(pubKeyCompressed) → 32 bytes',
      hex:trunc(chunk(sha256_1,16),80),
      desc:'SHA256 is applied to the compressed public key. The result is 32 bytes. This is the first step of the double-hash that produces the pubKeyHash.'});

    steps.push({num:'06',cls:'s211-ripe',label:'RIPEMD-160 (SHA256 result)',
      op:'RIPEMD160(SHA256(pubKey)) → 20 bytes = pubKeyHash',
      hex:trunc(chunk(ripe160,8),80),
      desc:'RIPEMD-160 is applied to the SHA256 result. The result is 20 bytes (160 bits) — called the pubKeyHash. This is the core of every Bitcoin address.'});

    if(addrType==='p2pkh'){
      steps.push({num:'07',cls:'s211-vers',label:'Add a version byte',
        op:'0x00 (mainnet P2PKH) + pubKeyHash',
        hex:'00 '+trunc(chunk(ripe160,8),60),
        desc:'The 0x00 prefix is added before the pubKeyHash to mark this as a P2PKH address on mainnet.'});
      steps.push({num:'08',cls:'s211-check',label:'Checksum (double SHA256, take the first 4 bytes)',
        op:'SHA256(SHA256(versionByte+pubKeyHash))[0:4]',
        hex:rH(8)+' (4 bytes checksum)',
        desc:'Double SHA256 is applied to the payload, then the first 4 bytes serve as the checksum. Allows detection of typos when entering the address.'});
      steps.push({num:'09',cls:'s211-enc',label:'Base58Check encode',
        op:'Base58Check(version + pubKeyHash + checksum)',
        hex:'58-character alphabet, without 0, O, I, l',
        desc:'The payload is encoded into Base58Check — an alphabet without easily confused characters. The result always starts with "1" for P2PKH mainnet.'});
      steps.push({num:'10',cls:'s211-addr',label:'P2PKH address — ready to use',
        op:'Legacy address, starts with "1"',
        hex:'1'+rH(4).split('').map(c=>('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')[parseInt(c,16)%34]).join('')+'BTC'+rH(6).toUpperCase(),
        desc:'The P2PKH address is ready to receive Bitcoin. The oldest format, less efficient than SegWit because it gets no weight discount.'});
    } else if(addrType==='p2wpkh'){
      steps.push({num:'07',cls:'s211-vers',label:'Witness version byte',
        op:'version = 0 (SegWit v0)',
        hex:'witness version: 0x00 | program: '+trunc(ripe160,40),
        desc:'For P2WPKH there’s no separate version byte and checksum like P2PKH. The witness program consists of the version (0) and the pubKeyHash (20 bytes).'});
      steps.push({num:'08',cls:'s211-enc',label:'Bech32 encode',
        op:'bech32_encode(hrp="bc", witver=0, witprog=pubKeyHash)',
        hex:'HRP "bc" + separator "1" + data + 6-char checksum',
        desc:'Bech32 was designed for SegWit. Human-readable part "bc" for mainnet, separator "1", encoded data, then a 6-character checksum. Lowercase only, without ambiguous characters.'});
      steps.push({num:'09',cls:'s211-addr',label:'P2WPKH address — ready to use',
        op:'Native SegWit address, starts with "bc1q"',
        hex:'bc1q'+rH(6)+'x'+rH(4)+'p'+rH(5)+'m'+rH(6),
        desc:'The P2WPKH address is ready to receive Bitcoin. A SegWit input gets a ~40% discount vs P2PKH because witness data counts as 1/4 weight.'});
    } else {
      const tweaked=rH(64);
      steps.push({num:'07',cls:'s211-vers',label:'Tweaked public key (Taproot)',
        op:'tweakedPubKey = pubKey + hash_taptweak(pubKey) × G',
        hex:trunc(chunk(tweaked,16),80),
        desc:'The public key is tweaked with the hash of the public key itself. The result is a tweaked public key of 32 bytes (the x coordinate only).'});
      steps.push({num:'08',cls:'s211-enc',label:'Bech32m encode',
        op:'bech32m_encode(hrp="bc", witver=1, witprog=tweakedPubKey)',
        hex:'HRP "bc" + separator "1" + data + 6-char bech32m checksum',
        desc:'Bech32m is a new version of Bech32 with an updated checksum for different witness program lengths. Witness version 1 distinguishes P2TR from P2WPKH.'});
      steps.push({num:'09',cls:'s211-addr',label:'P2TR address — ready to use',
        op:'Taproot address, starts with "bc1p"',
        hex:'bc1p'+rH(6)+'q'+rH(4)+'r'+rH(5)+'t'+rH(6),
        desc:'The P2TR address is the most efficient: a 57.5 vByte input for key path spending. Also the most private: multisig looks identical to a single signature.'});
    }

    steps.push({num:'DIV',cls:'divider',label:'',op:'',hex:'',desc:''});

    const sigType=addrType==='p2tr'?'Schnorr':'ECDSA';
    steps.push({num:'—',cls:'s211-sign',label:`Sign — ${sigType} signature`,
      op:`${sigType.toLowerCase()}_sign(privKey, message_hash) → signature`,
      hex:`r: ${trunc(rH(64),40)}\ns: ${trunc(rH(64),40)}${addrType==='p2tr'?'\n(Schnorr: r+s, 64 bytes flat)':''}`,
      desc:`${sigType==='Schnorr'?'A Schnorr signature is only 64 bytes: r (32 bytes) and s (32 bytes) joined directly. Smaller and easier to verify than ECDSA.':'An ECDSA signature consists of r and s in DER format, 71-72 bytes total. Proves ownership of the private key without revealing it.'}`});

    steps.push({num:'✓',cls:'s211-verify',label:'Verify — ownership proven',
      op:'verify(pubKey, message_hash, signature) → true',
      hex:'pubKey + signature + msg → valid ✓',
      desc:'Anyone can verify the signature using the public key without knowing the private key. A full node verifies this for every input in every transaction.'});

    return steps;
  }

  function render(){
    const steps=genSteps();
    const el=g('b21-s211-flow');if(!el) return;
    el.innerHTML='';
    steps.forEach((s,i)=>{
      if(s.cls==='divider'){
        const lbl=document.createElement('div');
        lbl.className='b21-s211-sign-lbl';
        lbl.textContent='Ownership & Signature:';
        el.appendChild(lbl);return;
      }
      if(i>0 && steps[i-1].cls!=='divider'){
        const arr=document.createElement('div');
        arr.className='b21-s211-arrow';arr.textContent='↓';el.appendChild(arr);
      }
      const card=document.createElement('div');card.className='b21-s211-card '+s.cls;
      const top=document.createElement('div');top.className='b21-s211-card-top';
      const num=document.createElement('div');num.className='b21-s211-num';num.textContent=s.num;
      const body=document.createElement('div');body.className='b21-s211-body';
      const lbl=document.createElement('div');lbl.className='b21-s211-label';lbl.textContent=s.label;
      const op=document.createElement('div');op.className='b21-s211-op';op.textContent=s.op;
      body.appendChild(lbl);body.appendChild(op);
      if(s.hex){const hex=document.createElement('div');hex.className='b21-s211-hex';hex.textContent=s.hex;body.appendChild(hex);}
      const desc=document.createElement('div');desc.className='b21-s211-desc-txt';desc.textContent=s.desc;
      body.appendChild(desc);
      top.appendChild(num);top.appendChild(body);card.appendChild(top);el.appendChild(card);
    });
  }

  const wrapEl=g('b21-s211-wrap');
  if(wrapEl){
    wrapEl.querySelectorAll('.b21-s211-addr-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        wrapEl.querySelectorAll('.b21-s211-addr-btn').forEach(b=>b.classList.remove('s211-act'));
        btn.classList.add('s211-act');
        addrType=btn.dataset.type;render();
      });
    });
  }
  const genBtn=g('b21-s211-gen');if(genBtn) genBtn.addEventListener('click',render);
  render();
})();
// ============================================================
function showSectionInContentB20(sectionId, sbId) {
  document.querySelectorAll('#page-bab20 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab20 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab20-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 23 · BAB 20 · TOPBAR
// ============================================================
document.getElementById('back-home-b20').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b20').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 23 · BAB 20 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab20').addEventListener('click', () => navigate('page-bab20'));

// ============================================================
// PAGE 23 · BAB 20 · SIDEBAR EVENTS (20.1 - 20.6)
// ============================================================
document.getElementById('sb-20-1').addEventListener('click', () => showSectionInContentB20('section-20-1', 'sb-20-1'));
document.getElementById('sb-20-2').addEventListener('click', () => showSectionInContentB20('section-20-2', 'sb-20-2'));
document.getElementById('sb-20-3').addEventListener('click', () => showSectionInContentB20('section-20-3', 'sb-20-3'));
document.getElementById('sb-20-4').addEventListener('click', () => showSectionInContentB20('section-20-4', 'sb-20-4'));
document.getElementById('sb-20-5').addEventListener('click', () => showSectionInContentB20('section-20-5', 'sb-20-5'));
document.getElementById('sb-20-6').addEventListener('click', () => showSectionInContentB20('section-20-6', 'sb-20-6'));

// ============================================================
// PAGE 23 · BAB 20 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab20 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB20(target, sb);
  });
});
// ============================================================
function showSectionInContentB19(sectionId, sbId) {
  document.querySelectorAll('#page-bab19 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab19 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab19-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 22 · BAB 19 · TOPBAR
// ============================================================
document.getElementById('back-home-b19').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b19').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 22 · BAB 19 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab19').addEventListener('click', () => navigate('page-bab19'));

// ============================================================
// PAGE 22 · BAB 19 · SIDEBAR EVENTS (19.1 - 19.6)
// ============================================================
document.getElementById('sb-19-1').addEventListener('click', () => showSectionInContentB19('section-19-1', 'sb-19-1'));
document.getElementById('sb-19-2').addEventListener('click', () => showSectionInContentB19('section-19-2', 'sb-19-2'));
document.getElementById('sb-19-3').addEventListener('click', () => showSectionInContentB19('section-19-3', 'sb-19-3'));
document.getElementById('sb-19-4').addEventListener('click', () => showSectionInContentB19('section-19-4', 'sb-19-4'));
document.getElementById('sb-19-5').addEventListener('click', () => showSectionInContentB19('section-19-5', 'sb-19-5'));
document.getElementById('sb-19-6').addEventListener('click', () => showSectionInContentB19('section-19-6', 'sb-19-6'));

// ============================================================
// PAGE 22 · BAB 19 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab19 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB19(target, sb);
  });
});

// ============================================================
// PAGE 22 · BAB 19 · 19.6 SIMULATION (Mining Ecosystem)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // ASIC data
  const ASICS=[
    {gen:'2013 — Avalon/Butterfly',jth:1200,color:'#A32D2D'},
    {gen:'2014 — Antminer S3',     jth:830, color:'#854F0B'},
    {gen:'2015 — Antminer S5',     jth:510, color:'#854F0B'},
    {gen:'2016 — Antminer S9',     jth:98,  color:'#534AB7'},
    {gen:'2018 — Antminer S15',    jth:57,  color:'#534AB7'},
    {gen:'2020 — Antminer S19',    jth:34,  color:'#0F6E56'},
    {gen:'2022 — Antminer S19 XP', jth:21,  color:'#0F6E56'},
    {gen:'2024 — Antminer S21 Pro',jth:15,  color:'#0F6E56'},
  ];
  (function(){
    const el=g('b19-s196-asic-rows');if(!el) return;
    ASICS.forEach(a=>{
      const pct=Math.max(2,Math.round((a.jth/1200)*100));
      const row=document.createElement('div');row.className='b19-s196-asic-row';
      row.innerHTML=`<div class="b19-s196-asic-gen">${a.gen}</div>
        <div class="b19-s196-asic-track">
          <div class="b19-s196-asic-bar" style="width:${pct}%;background:${a.color};">
            <div class="b19-s196-asic-bar-txt">${a.jth} J/TH</div>
          </div>
        </div>
        <div class="b19-s196-asic-val">${a.jth} J/TH</div>`;
      el.appendChild(row);
    });
  })();

  // Geography data
  const GEO={
    before:[
      {country:'China',          pct:65,color:'#A32D2D'},
      {country:'United States',   pct:7, color:'#534AB7'},
      {country:'Russia',          pct:7, color:'#534AB7'},
      {country:'Kazakhstan',     pct:6, color:'#854F0B'},
      {country:'Malaysia',       pct:4, color:'#854F0B'},
      {country:'Other',           pct:11,color:'#52524C'},
    ],
    after:[
      {country:'United States',   pct:38,color:'#0F6E56'},
      {country:'Kazakhstan',     pct:14,color:'#534AB7'},
      {country:'Russia',          pct:11,color:'#534AB7'},
      {country:'Canada',         pct:7, color:'#534AB7'},
      {country:'Germany',         pct:4, color:'#854F0B'},
      {country:'Other',           pct:26,color:'#52524C'},
    ],
  };
  const GEO_NOTES={
    before:'Before the China ban (May 2021): China dominated ~65% of global hashrate, largely because of cheap hydropower in Sichuan and Yunnan. This high concentration in one country was a concern from a network resilience perspective.',
    after:'After the China ban (2021) and the migration: hashrate spread to more countries. The United States became the country with the largest hashrate. A broader distribution improves resilience to any local regulation.',
  };

  function renderGeo(period){
    document.querySelectorAll('.b19-s196-geo-btn').forEach(b=>b.classList.toggle('s196-geo-act',b.dataset.period===period));
    const el=g('b19-s196-geo-rows');if(!el) return;
    el.innerHTML='';
    GEO[period].forEach(d=>{
      const row=document.createElement('div');row.className='b19-s196-geo-row';
      row.innerHTML=`<div class="b19-s196-geo-country">${d.country}</div>
        <div class="b19-s196-geo-track">
          <div class="b19-s196-geo-bar" style="width:${d.pct}%;background:${d.color};">
            <div class="b19-s196-geo-bar-txt">${d.pct>8?d.pct+'%':''}</div>
          </div>
        </div>
        <div class="b19-s196-geo-val">${d.pct}%</div>`;
      el.appendChild(row);
    });
    const note=g('b19-s196-geo-note');if(note) note.textContent=GEO_NOTES[period];
  }
  document.querySelectorAll('.b19-s196-geo-btn').forEach(btn=>{
    btn.addEventListener('click',()=>renderGeo(btn.dataset.period));
  });
  renderGeo('after');

  // Tabs
  const tabs=['b19-s196-t1','b19-s196-t2','b19-s196-t3'];
  const panes=['b19-s196-p1','b19-s196-p2','b19-s196-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b19-s196-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b19-s196-pane';});
      const el=g(tid);if(el) el.className='b19-s196-tab s196-act';
      const pe=g(panes[i]);if(pe) pe.className='b19-s196-pane show';
    });
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.5 SIMULATION (Selfish Mining Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const STEPS=[
    {cls:'s195-d-idle',  label:'Initial Condition',
     title:'All miners work on the same block',
     text:'The network and the selfish miner are both working on top of block #100. The selfish miner has 35% hashrate, above the ~33% threshold.',
     analogy:'Like a footrace: all runners start from the same line.',
     chains:[
       {name:'Network (honest)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'}]},
       {name:'Selfish Miner',   cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'}]},
     ]},
    {cls:'s195-d-selfish',label:'Step 1',
     title:'The selfish miner finds #101 — but hides it',
     text:'The selfish miner finds block #101 first. Instead of propagating it, they keep it and continue working secretly on top of this hidden block.',
     analogy:'Like a runner secretly running on a hidden track while competitors are still on the normal track.',
     chains:[
       {name:'Network (still on #100)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'}]},
       {name:'Selfish Miner',          cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-selfish',label:'Step 2',
     title:'The selfish miner finds #102 — the network doesn’t know about #101 yet',
     text:'The selfish miner now has two hidden blocks. The network is still working on #100. A two-block lead is the ideal condition for the attack.',
     analogy:'The hidden runner is already two turns ahead. The competitors don’t know yet.',
     chains:[
       {name:'Network',     cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'},{t:'?',c:'s195-b-network'}]},
       {name:'Selfish Miner',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'},{t:'#102',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-result',label:'Step 3',
     title:'The network is about to find #101 — the selfish miner publishes their chain',
     text:'When the network gets close to block #101, the selfish miner immediately propagates their hidden chain. The selfish chain is longer — all nodes switch. The network’s work is orphaned.',
     analogy:'The cheating runner appears in front of the finish line just as the competitors are about to arrive.',
     chains:[
       {name:'Network chain (orphaned!)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-orphan'}]},
       {name:'Winning chain (selfish)', cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
    {cls:'s195-d-result',label:'Result',
     title:'The selfish miner gets 2 rewards, the network loses 1 reward',
     text:'The network’s work on #101 is lost. The selfish miner gets the reward for #101 and #102 despite having only 35% hashrate — proportionally more than their fair share.',
     analogy:'The cheating runner wins two prizes. The honest runners get nothing despite working hard.',
     chains:[
       {name:'Final result — the selfish chain wins',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
  ];

  function renderStep(step){
    document.querySelectorAll('.b19-s195-step-btn').forEach(b=>b.classList.toggle('s195-act',parseInt(b.dataset.step)===step));
    const s=STEPS[step];
    const chainsEl=g('b19-s195-chains');const detailEl=g('b19-s195-detail');if(!chainsEl||!detailEl) return;
    chainsEl.innerHTML='';
    s.chains.forEach(chain=>{
      const div=document.createElement('div');div.className='b19-s195-chain';
      div.innerHTML=`<div class="b19-s195-chain-name ${chain.cls}">${chain.name}</div>`;
      const bd=document.createElement('div');bd.className='b19-s195-blocks';
      chain.blocks.forEach((b,i)=>{
        if(i>0){const a=document.createElement('div');a.className='b19-s195-block-arrow';a.textContent='→';bd.appendChild(a);}
        const blk=document.createElement('div');blk.className=`b19-s195-block ${b.c}`;blk.textContent=b.t;bd.appendChild(blk);
      });
      div.appendChild(bd);chainsEl.appendChild(div);
    });
    detailEl.className=`b19-s195-detail ${s.cls}`;
    detailEl.innerHTML=`<div class="b19-s195-detail-label">${s.label}</div>
      <div class="b19-s195-detail-title">${s.title}</div>
      <div class="b19-s195-detail-text">${s.text}</div>
      <div class="b19-s195-detail-analogy">${s.analogy}</div>`;
  }
  const stepsEl=document.querySelectorAll('.b19-s195-step-btn');
  stepsEl.forEach(b=>b.addEventListener('click',()=>renderStep(parseInt(b.dataset.step))));
  renderStep(0);

  function selfishRev(alphaPct,gamma=0.5){
    const a=alphaPct/100;
    const r=(a*(1-a)*(1-a)*(4*a+gamma*(1-2*a))-a*a*a)/(1-a*(1+(2-a)*a));
    return Math.max(a,Math.min(0.95,r));
  }

  function updateThreshold(){
    const sl=g('b19-s195-hr-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b19-s195-hr-val');if(vEl) vEl.textContent=pct+'%';
    const sr=Math.round(selfishRev(pct)*1000)/10;
    const hrEl=g('b19-s195-honest-rev');if(hrEl) hrEl.textContent=pct+'% of total';
    const srEl=g('b19-s195-selfish-rev');if(srEl) srEl.textContent='~'+sr+'%';
    const ssEl=g('b19-s195-selfish-sub');
    const verdict=g('b19-s195-verdict');const vlEl=g('b19-s195-verdict-label');const vtEl=g('b19-s195-verdict-text');
    if(sr>pct+0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-danger';
      if(vlEl) vlEl.textContent='Selfish mining is PROFITABLE at this hashrate';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected selfish revenue (~${sr}%) is higher than honest (${pct}%). The extra gain comes from other miners’ work being orphaned.`;
      if(ssEl) ssEl.textContent='higher than honest mining';
    } else if(sr>pct-0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-warn';
      if(vlEl) vlEl.textContent='Borderline zone — barely profitable';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected selfish revenue (~${sr}%) is almost the same as honest (${pct}%). The risk and complexity aren’t worth it.`;
      if(ssEl) ssEl.textContent='almost the same as honest mining';
    } else {
      if(verdict) verdict.className='b19-s195-verdict s195-v-safe';
      if(vlEl) vlEl.textContent='Selfish mining is NOT profitable at this hashrate';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected honest revenue (${pct}%) is higher than selfish (~${sr}%). At low hashrate, the risk of the hidden block being orphaned is greater.`;
      if(ssEl) ssEl.textContent='lower than honest mining';
    }
  }
  const sl2=g('b19-s195-hr-sl');if(sl2) sl2.addEventListener('input',updateThreshold);
  updateThreshold();

  function updateProp(){
    const sl=g('b19-s195-prop-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b19-s195-prop-val');if(vEl) vEl.textContent=pct+'%';
    const gamma=pct/100;
    let threshold=49;
    for(let a=5;a<=49;a++){
      const sr=selfishRev(a,1-gamma)*100;
      if(sr>a){threshold=a;break;}
    }
    const res=g('b19-s195-prop-result');if(!res) return;
    if(pct>=70){
      res.className='b19-s195-prop-result s195-pr-good';
      res.textContent=`Propagation ${pct}%: the selfish mining threshold rises to ~${threshold}%+ hashrate. The faster blocks spread, the harder it is for selfish mining to be profitable. Compact blocks contribute directly to this.`;
    } else if(pct>=40){
      res.className='b19-s195-prop-result s195-pr-mid';
      res.textContent=`Propagation ${pct}%: the selfish mining threshold is around ~${threshold}% hashrate. Still concerning if there’s a pool with large hashrate.`;
    } else {
      res.className='b19-s195-prop-result s195-pr-bad';
      res.textContent=`Propagation ${pct}% (slow): the selfish mining threshold drops to ~${threshold}% hashrate. Slow propagation gives the selfish miner more time to exploit their lead.`;
    }
  }
  const sl3=g('b19-s195-prop-sl');if(sl3) sl3.addEventListener('input',updateProp);
  updateProp();

  const tabs=['b19-s195-t1','b19-s195-t2','b19-s195-t3'];
  const panes=['b19-s195-p1','b19-s195-p2','b19-s195-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b19-s195-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b19-s195-pane';});
      const el=g(tid);if(el) el.className='b19-s195-tab s195-act';
      const pe=g(panes[i]);if(pe) pe.className='b19-s195-pane show';
    });
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.4 SIMULATION (Mining Pool Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NETWORK_EH=700;
  const BLOCK_REWARD=3.125;
  const BLOCKS_PER_DAY=144;

  function calcSoloDays(hashrateTH){
    return (NETWORK_EH*1e6/hashrateTH)*10/60/24;
  }
  function calcPoolDaily(hashrateTH){
    return (hashrateTH/(NETWORK_EH*1e6))*BLOCKS_PER_DAY*BLOCK_REWARD*0.99;
  }
  function fmtTime(days){
    if(days<1) return (days*24).toFixed(1)+' hours';
    if(days<365) return days.toFixed(1)+' days';
    const y=days/365;
    return y<1000?y.toFixed(1)+' years':'>1000 years';
  }
  function fmtBTC(btc){
    if(btc<0.0001) return btc.toExponential(2)+' BTC';
    return btc.toFixed(5)+' BTC';
  }

  function update(){
    const sl=g('b19-s194-hr-sl');if(!sl) return;
    const val=parseInt(sl.value);
    const hashrateTH=val*100;
    const label=hashrateTH>=1000?(hashrateTH/1000).toFixed(1)+' PH/s ('+hashrateTH.toLocaleString('en-US')+' TH/s)':hashrateTH+' TH/s';
    const vEl=g('b19-s194-hr-val');if(vEl) vEl.textContent=label;

    const soloDays=calcSoloDays(hashrateTH);
    const poolDaily=calcPoolDaily(hashrateTH);
    const poolWeekly=poolDaily*7;

    const st=g('b19-s194-solo-time');if(st) st.textContent='~'+fmtTime(soloDays);
    const pi=g('b19-s194-pool-income');if(pi) pi.textContent='~'+fmtBTC(poolDaily)+'/day';

    // Timeline 12 minggu
    const el=g('b19-s194-tl-rows');if(!el) return;
    el.innerHTML='';
    const soloBlockProb=7/soloDays;
    let rng=hashrateTH;
    function rand(){rng=(rng*1103515245+12345)&0x7fffffff;return rng/0x7fffffff;}
    const maxBar=Math.max(BLOCK_REWARD,poolWeekly)*1.2;

    for(let w=1;w<=12;w++){
      const soloFound=rand()<soloBlockProb;
      const soloWidth=soloFound?Math.min(100,(BLOCK_REWARD/maxBar)*100):0;
      const poolWidth=Math.min(100,(poolWeekly/maxBar)*100);
      const row=document.createElement('div');row.className='b19-s194-tl-row';
      row.innerHTML=`<div class="b19-s194-tl-week">Week ${w}</div>
        <div class="b19-s194-tl-solo-wrap"><div class="b19-s194-tl-solo-bar" style="width:${soloWidth}%;"></div></div>
        <div class="b19-s194-tl-pool-wrap"><div class="b19-s194-tl-pool-bar" style="width:${poolWidth}%;"></div></div>`;
      el.appendChild(row);
    }

    const note=g('b19-s194-note');
    if(note) note.textContent=`With ${label} hashrate, a solo miner needs an average of ${fmtTime(soloDays)} to find one block. In a pool, income arrives consistently ${fmtBTC(poolDaily)}/day — the long-term total is the same, but the variance is far lower.`;
  }

  const sl=g('b19-s194-hr-sl');if(sl) sl.addEventListener('input',update);
  update();

  const t1=g('b19-s194-t1'),t2=g('b19-s194-t2');
  const p1=g('b19-s194-p1'),p2=g('b19-s194-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s194-tab s194-act';t2.className='b19-s194-tab';
    p1.className='b19-s194-pane show';p2.className='b19-s194-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s194-tab s194-act';t1.className='b19-s194-tab';
    p2.className='b19-s194-pane show';p1.className='b19-s194-pane';
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.3 SIMULATION (Halving & Security Budget)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const BLOCKS_PER_YEAR=52560;

  const HALVINGS=[
    {era:'Era 1 (2009-2012)',reward:50,    status:'past'},
    {era:'Era 2 (2012-2016)',reward:25,    status:'past'},
    {era:'Era 3 (2016-2020)',reward:12.5,  status:'past'},
    {era:'Era 4 (2020-2024)',reward:6.25,  status:'past'},
    {era:'Era 5 (2024-2028)',reward:3.125, status:'current'},
    {era:'Era 6 (~2028+)',   reward:1.5625,status:'future'},
    {era:'Era 7 (~2032+)',   reward:0.7813,status:'future'},
    {era:'Era 8 (~2036+)',   reward:0.3906,status:'future'},
    {era:'Era 9 (~2040+)',   reward:0.1953,status:'future'},
    {era:'Era 10+ (~2044+)', reward:0.0977,status:'future'},
  ];

  // Build timeline — no badges, just era and reward
  (function(){
    const el=g('b19-s193-tl');if(!el) return;
    HALVINGS.forEach(h=>{
      const row=document.createElement('div');
      row.className=`b19-s193-tl-row s193-tl-${h.status}`;
      const pct=Math.max(1,(h.reward/50)*100);
      const color=h.status==='current'?'#534AB7':h.status==='past'?'#52524C':'#D8D6F0';
      row.innerHTML=`<div class="b19-s193-tl-era">${h.era}</div>
        <div class="b19-s193-tl-reward">${h.reward} BTC</div>
        <div class="b19-s193-tl-bar-wrap">
          <div class="b19-s193-tl-bar" style="width:${pct}%;background:${color};"></div>
        </div>`;
      el.appendChild(row);
    });
  })();

  // Build horizon chart
  (function(){
    const el=g('b19-s193-horizon-rows');if(!el) return;
    const items=[
      {era:'2009 — 50 BTC',   reward:50},
      {era:'2012 — 25 BTC',   reward:25},
      {era:'2016 — 12.5 BTC', reward:12.5},
      {era:'2020 — 6.25 BTC', reward:6.25},
      {era:'2024 — 3,125 BTC',reward:3.125},
      {era:'2028 — 1.56 BTC', reward:1.5625},
      {era:'2032 — 0.78 BTC', reward:0.7813},
      {era:'2036 — 0.39 BTC', reward:0.3906},
    ];
    items.forEach(r=>{
      const logPct=Math.max(3,Math.round(
        (Math.log2(r.reward)-Math.log2(0.39))/(Math.log2(50)-Math.log2(0.39))*92+3
      ));
      const color=r.era.startsWith('2024')?'#534AB7':r.era<'2024'?'#52524C':'rgba(83,74,183,0.3)';
      const row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:8px;padding:3px 0;';
      row.innerHTML=`<div style="font-size:9px;font-family:'Sora',sans-serif;color:#3A3A35;min-width:130px;flex-shrink:0;">${r.era}</div>
        <div style="flex:1;height:14px;background:#F4F4F0;border-radius:99px;overflow:hidden;">
          <div style="width:${logPct}%;height:100%;background:${color};border-radius:99px;"></div>
        </div>
        <div style="font-size:9px;font-family:'Courier Prime',monospace;color:#534AB7;min-width:60px;text-align:right;">${r.reward} BTC</div>`;
      el.appendChild(row);
    });
  })();

  function fmtUSD(n){
    if(n>=1e9) return '$'+(n/1e9).toFixed(1)+'B';
    if(n>=1e6) return '$'+(n/1e6).toFixed(1)+'M';
    if(n>=1e3) return '$'+(n/1e3).toFixed(0)+'K';
    return '$'+n.toFixed(0);
  }

  function update(){
    const psl=g('b19-s193-price-sl');const fsl=g('b19-s193-fee-sl');
    if(!psl||!fsl) return;
    const price=parseInt(psl.value);
    const fee=parseInt(fsl.value)/100;
    const REWARD=3.125;

    const pv=g('b19-s193-price-val');if(pv) pv.textContent='$'+price.toLocaleString('en-US');
    const fv=g('b19-s193-fee-val'); if(fv) fv.textContent=fee.toFixed(2)+' BTC';

    const rewardPB=REWARD*price;
    const feePB=fee*price;
    const totalAnnual=(rewardPB+feePB)*BLOCKS_PER_YEAR;

    const rv=g('b19-s193-reward-usd');if(rv) rv.textContent=fmtUSD(rewardPB)+'/block';
    const rs=g('b19-s193-reward-sub');if(rs) rs.textContent=REWARD+' BTC × $'+price.toLocaleString('en-US');
    const fv2=g('b19-s193-fee-usd'); if(fv2) fv2.textContent=fmtUSD(feePB)+'/block';
    const tv=g('b19-s193-total-usd');if(tv)  tv.textContent=fmtUSD(totalAnnual)+'/yr';

    const rewardPct=Math.round(rewardPB/(rewardPB+feePB)*100);
    const feePct=100-rewardPct;
    const pr=g('b19-s193-prop-r');const pf=g('b19-s193-prop-f');
    const prt=g('b19-s193-prop-r-txt');const pft=g('b19-s193-prop-f-txt');
    if(pr) pr.style.width=rewardPct+'%';
    if(pf) pf.style.width=Math.max(feePct,feePct>0?2:0)+'%';
    if(prt) prt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(pft) pft.textContent=feePct>8?'Fee '+feePct+'%':'';
  }

  const psl=g('b19-s193-price-sl');if(psl) psl.addEventListener('input',update);
  const fsl=g('b19-s193-fee-sl');  if(fsl) fsl.addEventListener('input',update);
  update();

  const t1=g('b19-s193-t1'),t2=g('b19-s193-t2');
  const p1=g('b19-s193-p1'),p2=g('b19-s193-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s193-tab s193-act';t2.className='b19-s193-tab';
    p1.className='b19-s193-pane show';p2.className='b19-s193-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s193-tab s193-act';t1.className='b19-s193-tab';
    p2.className='b19-s193-pane show';p1.className='b19-s193-pane';
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.1 SIMULATION (Revenue Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const ERAS=[
    {key:'2009',label:'2009 (Era 1)',   reward:50,    fee:0.001,
     note:'Bitcoin’s early era. Almost no transactions besides the coinbase. Fees were practically zero because the network was still very small. The 50 BTC block reward dominated 100% of revenue.'},
    {key:'2012',label:'2012 (Halving 1)',reward:25,   fee:0.01,
     note:'After the first halving. Fees started to appear but were still very small. The block reward dropped to 25 BTC, but the Bitcoin price began to rise so the dollar value remained attractive to miners.'},
    {key:'2016',label:'2016 (Halving 2)',reward:12.5, fee:0.05,
     note:'After the second halving. The network started to get busier. Fees became significant during congestion periods but were still below 1% of total revenue on average.'},
    {key:'2020',label:'2020 (Halving 3)',reward:6.25, fee:0.15,
     note:'After the third halving. Fees began to play a larger role, especially during high-congestion periods. The block reward was still very dominant at around 97-98% of total revenue.'},
    {key:'2024',label:'2024 (Halving 4)',reward:3.125,fee:0.15,
     note:'After the fourth halving (April 2024). The block reward is now 3.125 BTC. Fees remain fluctuating. The proportion of fees in total revenue increases as a percentage because the block reward shrinks, not because fees rise drastically.'},
    {key:'2140',label:'2140 (Protocol endpoint)',reward:0,fee:0.3,
     note:'The mathematical consequence of the halving schedule fixed since the genesis block: the block reward reaches zero. Miners depend entirely on fees. Whether fees alone are enough to secure the network is the most important open question in long-term Bitcoin economics.'},
  ];

  function renderEra(key){
    const d=ERAS.find(e=>e.key===key);if(!d) return;
    const total=d.reward+d.fee;
    const rewardPct=total>0?Math.round(d.reward/total*100):0;
    const feePct=total>0?Math.round(d.fee/total*100):0;

    const rv=g('b19-s191-reward-val');if(rv) rv.textContent=d.reward>0?d.reward+' BTC':'0 BTC';
    const fv=g('b19-s191-fee-val');if(fv) fv.textContent='~'+d.fee+' BTC';
    const pv=g('b19-s191-pct-val');if(pv) pv.textContent='~'+feePct+'%';
    const ps=g('b19-s191-pct-sub');if(ps) ps.textContent=feePct===0?'fees almost nonexistent':feePct===100?'100% from fees alone':'the rest from the block reward';

    const br=g('b19-s191-bar-r');const bf=g('b19-s191-bar-f');
    const brt=g('b19-s191-bar-r-txt');const bft=g('b19-s191-bar-f-txt');
    if(br) br.style.width=rewardPct+'%';
    if(bf) bf.style.width=Math.max(feePct,feePct>0?3:0)+'%';
    if(brt) brt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(bft) bft.textContent=feePct>8?'Fee '+feePct+'%':'';

    const note=g('b19-s191-note');if(note) note.textContent=d.note;
    const cr=g('b19-s191-cb-reward');
    if(cr) cr.textContent=d.reward>0?d.reward+' BTC':'0 BTC (protocol endpoint)';

    document.querySelectorAll('.b19-s191-era-btn').forEach(b=>
      b.classList.toggle('s191-era-act',b.dataset.era===key));
  }

  (function(){
    const el=g('b19-s191-eras');if(!el) return;
    ERAS.forEach(e=>{
      const btn=document.createElement('button');
      btn.className='b19-s191-era-btn'+(e.key==='2024'?' s191-era-act':'');
      btn.dataset.era=e.key;btn.textContent=e.label;
      btn.addEventListener('click',()=>renderEra(e.key));
      el.appendChild(btn);
    });
  })();

  (function(){
    const el=g('b19-s191-tl-rows');if(!el) return;
    const maxTotal=ERAS.reduce((m,e)=>Math.max(m,e.reward+e.fee),0);
    ERAS.forEach(e=>{
      const total=e.reward+e.fee;
      const rw=total>0?Math.max(1,(e.reward/maxTotal)*100):0;
      const fw=total>0?Math.max(1,(e.fee/maxTotal)*100):0;
      const feePct=total>0?Math.round(e.fee/total*100):0;
      const row=document.createElement('div');row.className='b19-s191-tl-row';
      row.innerHTML='<div class="b19-s191-tl-era">'+e.key+'</div>'+
        '<div class="b19-s191-tl-track">'+
        '<div class="b19-s191-tl-r" style="width:'+rw+'%;"><div class="b19-s191-tl-txt">'+(e.reward>0?e.reward+' BTC':'')+'</div></div>'+
        '<div class="b19-s191-tl-f" style="width:'+fw+'%;"><div class="b19-s191-tl-txt">'+(e.fee>0.05?e.fee+' BTC':'')+'</div></div>'+
        '</div>'+
        '<div class="b19-s191-tl-val">fee: ~'+feePct+'%</div>';
      el.appendChild(row);
    });
  })();

  renderEra('2024');

  const t1=g('b19-s191-t1'),t2=g('b19-s191-t2');
  const p1=g('b19-s191-p1'),p2=g('b19-s191-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s191-tab s191-act';t2.className='b19-s191-tab';
    p1.className='b19-s191-pane show';p2.className='b19-s191-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s191-tab s191-act';t1.className='b19-s191-tab';
    p2.className='b19-s191-pane show';p1.className='b19-s191-pane';
  });
})();


// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const SCENARIOS={
    up2x:{
      col:'s192-sc-up',actualDays:7,
      adjustLabel:'+100% (2×)',adjustSub:'up: blocks harder',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'7 days (10,080 minutes)',desc:'Hashrate 2× higher, blocks found 2× faster'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'0.5 (7 ÷ 14)',desc:'Below 1.0 means blocks too fast, difficulty must rise'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× harder',desc:'New target = old target × 0.5, valid hash must be smaller'},
      ],
      chart:[
        {epoch:'Epoch N',  days:7, color:'#854F0B',label:'7 days (too fast)'},
        {epoch:'Epoch N+1',days:10,color:'#0F6E56',label:'~10 days'},
        {epoch:'Epoch N+2',days:13,color:'#0F6E56',label:'~13 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 days (stable)'},
      ],
    },
    down50:{
      col:'s192-sc-down',actualDays:28,
      adjustLabel:'-50% (0.5×)',adjustSub:'down: blocks easier',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'28 days (40,320 minutes)',desc:'Hashrate down 50%, blocks found 2× slower'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'2.0 (28 ÷ 14)',desc:'Above 1.0 means blocks too slow, difficulty must fall'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× easier',desc:'New target = old target × 2.0, valid hash can be larger'},
      ],
      chart:[
        {epoch:'Epoch N',  days:28,color:'#A32D2D',label:'28 days (too slow)'},
        {epoch:'Epoch N+1',days:18,color:'#854F0B',label:'~18 days'},
        {epoch:'Epoch N+2',days:15,color:'#0F6E56',label:'~15 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 days (stable)'},
      ],
    },
    same:{
      col:'s192-sc-same',actualDays:14,
      adjustLabel:'0% (1×)',adjustSub:'unchanged',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'14 days (20,160 minutes)',desc:'Hashrate stable, blocks found exactly on target'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'1.0 (14 ÷ 14)',desc:'Exactly 1.0 means no adjustment is needed'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'Unchanged',desc:'New target = old target × 1.0, difficulty identical'},
      ],
      chart:[
        {epoch:'Epoch N',  days:14,color:'#0F6E56',label:'14 days (exact)'},
        {epoch:'Epoch N+1',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+2',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'14 days'},
      ],
    },
    up5x:{
      col:'s192-sc-up',actualDays:2.8,
      adjustLabel:'+300% (4×, capped)',adjustSub:'protocol limit applied',afterLabel:'Needs ~4 epochs',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'~2.8 days (4,032 minutes)',desc:'Hashrate 5× higher, blocks found very fast'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio before the limit',val:'0.2 (2.8 ÷ 14)',desc:'This means difficulty must rise 5× but there’s a maximum limit'},
        {cls:'s192-cs-cap',   num:'4',title:'Protocol limit applied',val:'max(0.25 ; min(4.0 ; 0.2)) = 0.25',desc:'The 0.2 ratio is below the 0.25 minimum limit. The protocol forces ratio = 0.25'},
        {cls:'s192-cs-result s192-warn',num:'5',title:'New difficulty (capped)',val:'4× harder (not 5×)',desc:'It needs a few epochs to fully stabilize. This is network protection.'},
      ],
      chart:[
        {epoch:'Epoch N',  days:2.8,color:'#A32D2D',label:'2.8 days (very fast)'},
        {epoch:'Epoch N+1',days:7,  color:'#854F0B',label:'~7 days (4× cap)'},
        {epoch:'Epoch N+2',days:11, color:'#0F6E56',label:'~11 days'},
        {epoch:'Epoch N+3',days:13, color:'#0F6E56',label:'~13 days'},
        {epoch:'Epoch N+4',days:14, color:'#0F6E56',label:'~14 days (stable)'},
      ],
    },
  };

  function renderScenario(key){
    const sc=SCENARIOS[key];if(!sc) return;
    const scEl=g('b19-s192-scenarios');
    if(scEl) scEl.querySelectorAll('.b19-s192-scenario').forEach(b=>{
      const col=b.dataset.sc==='down50'?'s192-sc-down':b.dataset.sc==='same'?'s192-sc-same':'s192-sc-up';
      b.className=`b19-s192-scenario ${col}`;
    });
    const btn=document.querySelector(`.b19-s192-scenario[data-sc="${key}"]`);
    if(btn) btn.classList.add('s192-act');
    const at=g('b19-s192-actual-time');if(at) at.textContent=sc.actualDays+' days';
    const adj=g('b19-s192-adjust');if(adj) adj.textContent=sc.adjustLabel;
    const adjS=g('b19-s192-adjust-sub');if(adjS) adjS.textContent=sc.adjustSub;
    const aft=g('b19-s192-after');if(aft) aft.textContent=sc.afterLabel;
    const el=g('b19-s192-calc-steps');if(!el) return;
    el.innerHTML='';
    sc.steps.forEach(s=>{
      const div=document.createElement('div');div.className=`b19-s192-calc-step ${s.cls}`;
      div.innerHTML=`<div class="b19-s192-step-num">${s.num}</div>
        <div class="b19-s192-step-body">
          <div class="b19-s192-step-title">${s.title}</div>
          <div class="b19-s192-step-val">${s.val}</div>
          <div class="b19-s192-step-desc">${s.desc}</div>
        </div>`;
      el.appendChild(div);
    });
    const cr=g('b19-s192-chart-rows');if(!cr) return;
    cr.innerHTML='';
    sc.chart.forEach(r=>{
      const pct=Math.max(2,Math.min(100,(r.days/30)*100));
      const row=document.createElement('div');row.className='b19-s192-chart-row';
      row.innerHTML=`<div class="b19-s192-chart-epoch">${r.epoch}</div>
        <div class="b19-s192-chart-track">
          <div class="b19-s192-chart-bar" style="width:${pct}%;background:${r.color};">
            <div class="b19-s192-chart-bar-txt">${r.label}</div>
          </div>
        </div>
        <div class="b19-s192-chart-val">${r.days} days</div>`;
      cr.appendChild(row);
    });
  }

  const scEl=g('b19-s192-scenarios');
  if(scEl) scEl.querySelectorAll('.b19-s192-scenario').forEach(btn=>{
    btn.addEventListener('click',()=>renderScenario(btn.dataset.sc));
  });
  renderScenario('up2x');

  const t1=g('b19-s192-t1'),t2=g('b19-s192-t2');
  const p1=g('b19-s192-p1'),p2=g('b19-s192-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s192-tab s192-act';t2.className='b19-s192-tab';
    p1.className='b19-s192-pane show';p2.className='b19-s192-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s192-tab s192-act';t1.className='b19-s192-tab';
    p2.className='b19-s192-pane show';p1.className='b19-s192-pane';
  });
})();



// ============================================================
// PAGE APPENDIX
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  var TAB_IDS  = ['apx-t1','apx-t2','apx-t3'];
  var SECT_IDS = ['apx-s1','apx-s2','apx-s3'];
  function showApxSection(sectId) {
    TAB_IDS.forEach(function(tid) {
      var btn = g(tid); if (!btn) return;
      btn.className = 'apx-tab-btn' + (btn.getAttribute('data-section')===sectId?' apx-act':'');
    });
    SECT_IDS.forEach(function(sid) {
      var el = g(sid); if (!el) return;
      el.className = 'apx-section' + (sid===sectId?' apx-active':'');
    });
    window.scrollTo(0,0);
  }
  TAB_IDS.forEach(function(tid) {
    var btn = g(tid); if (!btn) return;
    btn.addEventListener('click',function(){showApxSection(btn.getAttribute('data-section'));});
  });
  ['apx-next1','apx-next2','apx-prev2','apx-prev3'].forEach(function(id) {
    var btn = g(id); if (!btn) return;
    btn.addEventListener('click',function(){showApxSection(btn.getAttribute('data-section'));});
  });
  var backBtn = g('apx-back-btn');
  if (backBtn) backBtn.addEventListener('click',function(){navigate('page-chapters');});
  var logo = g('apx-back-chapters');
  if (logo) logo.addEventListener('click',function(){navigate('page-chapters');});
  document.querySelectorAll('.apx-chapter-btn').forEach(function(btn) {
    btn.addEventListener('click',function() {
      var sectId = btn.getAttribute('data-section');
      navigate('page-appendix');
      setTimeout(function(){showApxSection(sectId);},50);
    });
  });
})();

