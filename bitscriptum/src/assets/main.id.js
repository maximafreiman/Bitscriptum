
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
    { era:'Genesis',     year:2009, block:0,       reward:50,         supply:10500000,      pct:50,          status:'past',    note:'Era pertama Bitcoin. Satoshi Nakamoto menambang block pertama pada 3 Januari 2009. Reward 50 BTC per block berlaku selama sekitar 4 tahun. 210.000 block × 50 BTC = 10.500.000 BTC, langsung setengah dari seluruh Bitcoin yang akan pernah ada.' },
    { era:'Halving #1',  year:2012, block:210000,  reward:25,         supply:15750000,      pct:75,          status:'past',    note:'Halving pertama terjadi pada 28 November 2012. Reward dipotong dari 50 menjadi 25 BTC. Total supply yang ditambang di era ini: 5.250.000 BTC.' },
    { era:'Halving #2',  year:2016, block:420000,  reward:12.5,       supply:18375000,      pct:87.5,        status:'past',    note:'Halving kedua terjadi pada 9 Juli 2016. Reward dipotong dari 25 menjadi 12,5 BTC. Era ini menghasilkan 2.625.000 BTC baru.' },
    { era:'Halving #3',  year:2020, block:630000,  reward:6.25,       supply:19687500,      pct:93.75,       status:'past',    note:'Halving ketiga terjadi pada 11 Mei 2020. Reward dipotong dari 12,5 menjadi 6,25 BTC. Era ini menghasilkan 1.312.500 BTC baru.' },
    { era:'Halving #4',  year:2024, block:840000,  reward:3.125,      supply:20343750,      pct:96.875,      status:'current', note:'Halving keempat terjadi pada April 2024. Reward saat ini adalah 3,125 BTC per block, dan era ini akan menghasilkan 656.250 BTC baru. Kita sedang berada di era ini sekarang.' },
    { era:'Halving #5',  year:2028, block:1050000, reward:1.5625,     supply:20671875,      pct:98.4375,     status:'future',  note:'Diperkirakan terjadi sekitar 2028. Reward akan dipotong menjadi 1,5625 BTC. Di akhir era ini, lebih dari 98% Bitcoin sudah beredar.' },
    { era:'Halving #6',  year:2032, block:1260000, reward:0.78125,    supply:20835937.5,    pct:99.21875,    status:'future',  note:'Diperkirakan terjadi sekitar 2032. Reward turun menjadi 0,78125 BTC. Supply semakin mendekati 21 juta.' },
    { era:'Halving #10', year:2048, block:2100000, reward:0.04882812, supply:20989746.0927, pct:99.951172,   status:'future',  note:'Diperkirakan terjadi sekitar 2048. Reward tinggal 0,04882812 BTC per block. Lebih dari 99,9% Bitcoin sudah beredar, dan miner terutama mengandalkan biaya transaksi.' },
    { era:'Final (~2140)',year:2140, block:6930000, reward:0,         supply:20999999.9769, pct:99.99999989, status:'future',  note:'Sekitar tahun 2140, setelah 33 era, reward menjadi nol. Total Bitcoin yang pernah lahir berhenti di 20.999.999,9769 BTC, sedikit di bawah 21 juta karena pembulatan satoshi di setiap halving. Sejak itu miner hanya mendapat biaya transaksi. Tidak ada Bitcoin baru yang akan pernah lahir lagi.' },
  ];

  let activeRow = null;

  // [fix] angka diformat sesuai bahasa halaman; maksimal 4 desimal untuk supply akhir yang tidak bulat
  function formatNum(n) {
    return n.toLocaleString('id-ID', { maximumFractionDigits: 4 });
  }
  function formatBtc(n) {
    return n > 0 ? n.toLocaleString('id-ID', { maximumFractionDigits: 8 }) + ' BTC' : '0 BTC';
  }
  function formatPct(n, d) {
    if (n > 99.999 && n < 100) return '≈100%';   // jangan tampil 100%: total akhir tidak pernah tepat 21 juta
    return n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: 3 }) + '%';
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
        <div class="hv-detail-label">Total di Akhir Era</div>
        <div class="hv-detail-value">${formatNum(h.supply)} BTC</div>
      </div>
      <div>
        <div class="hv-detail-label">% dari 21 Juta</div>
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
    pubEl.textContent = 'Menunggu private key...';
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
    privEl.textContent = 'Belum di-generate...';
    privEl.className   = 'kp-key-val';
    pubEl.textContent  = 'Belum di-generate...';
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
    result.innerHTML = `Public key berubah total:<br>
      <span style="font-family:'Courier Prime',monospace;font-size:10px;color:#534AB7;word-break:break-all">${newPub}</span><br>
      <span style="font-size:10px;color:#52524C;margin-top:4px;display:block">Satu karakter berbeda di private key menghasilkan public key yang sepenuhnya berbeda. Tidak ada pola, tidak ada hubungan yang bisa ditebak.</span>`;
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
    { key:'legacy',  format:'Legacy',        prefix:'Dimulai dengan 1...', badges:[{t:'Masih umum',c:'legacy'}],                                      desc:'Format pertama Bitcoin, lahir bersama protokolnya di 2009. Masih banyak dipakai di sistem lama dan exchange generasi pertama. Biaya transaksi lebih tinggi dibanding format modern.' },
    { key:'p2sh',    format:'P2SH',          prefix:'Dimulai dengan 3...', badges:[{t:'Mulai ditinggalkan',c:'legacy'}],                               desc:'Pay-to-Script-Hash — memungkinkan kondisi lebih kompleks seperti multisignature. Populer 2012-2018, kini perlahan digantikan Native SegWit yang lebih efisien.' },
    { key:'segwit',  format:'Native SegWit', prefix:'Dimulai dengan bc1q...', badges:[{t:'Paling umum',c:'popular'},{t:'Direkomendasikan',c:'modern'}], desc:'Format dominan saat ini. Mayoritas wallet modern default ke sini. Biaya transaksi lebih rendah dan didukung hampir semua exchange. Jika tidak tahu harus pakai format apa, gunakan ini.' },
    { key:'taproot', format:'Taproot',        prefix:'Dimulai dengan bc1p...', badges:[{t:'Adopsi meningkat',c:'future'}],                              desc:'Format terbaru, diaktifkan November 2021. Lebih privat, lebih fleksibel. Adopsinya terus meningkat tapi belum semua exchange support penuh.' },
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
    document.getElementById('b02-s23-priv').textContent      = 'Klik Generate...';
    document.getElementById('b02-s23-priv').className        = 'ka-node-val';
    document.getElementById('b02-s23-pub').textContent       = 'Menunggu...';
    document.getElementById('b02-s23-pub').className         = 'ka-node-val';
    document.getElementById('b02-s23-addr-grid').innerHTML   = '<div class="ka-placeholder">Address akan muncul setelah Generate.</div>';
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
      badges:[{t:'Hot',c:'hot'},{t:'Untuk pemula',c:'best'}],
      meters:[
        {l:'Keamanan',   f:35, v:'Sedang',        c:'sec'},
        {l:'Kenyamanan', f:95, v:'Sangat tinggi',  c:'con'},
        {l:'Biaya',      f:5,  v:'Gratis',         c:'cst'},
        {l:'Kecepatan',  f:95, v:'Instan',         c:'spd'},
      ],
      desc:'Aplikasi wallet yang berjalan di ponsel. Private key tersimpan di memori perangkat dan siap dipakai kapanpun. Pilihan paling umum untuk penggunaan sehari-hari.',
      pros:['Mudah dipakai','Gratis','Akses cepat kapanpun','Cocok untuk transaksi kecil'],
      cons:['Rentan malware','Hilang jika HP rusak tanpa backup','Kurang aman untuk jumlah besar'],
      use:'Cocok untuk transaksi harian dan jumlah kecil. Seperti dompet di saku, bukan brankas.',
    },
    {
      icon:'🖥️', name:'Desktop Wallet', type:'Hot Wallet',
      badges:[{t:'Hot',c:'hot'}],
      meters:[
        {l:'Keamanan',   f:50, v:'Cukup',    c:'sec'},
        {l:'Kenyamanan', f:75, v:'Tinggi',   c:'con'},
        {l:'Biaya',      f:5,  v:'Gratis',   c:'cst'},
        {l:'Kecepatan',  f:80, v:'Cepat',    c:'spd'},
      ],
      desc:'Aplikasi wallet yang diinstal di komputer. Biasanya punya fitur lebih lengkap dari mobile wallet, tapi tetap terhubung ke internet selama komputer online.',
      pros:['Fitur lebih lengkap','Layar lebih besar','Gratis','Kontrol penuh atas kunci'],
      cons:['Rentan jika komputer terinfeksi','Tidak bisa dibawa ke mana-mana','Risiko hilang tanpa backup'],
      use:'Cocok untuk pengguna yang ingin kontrol lebih tanpa biaya hardware. Lebih aman dari mobile jika komputer dijaga kebersihannya.',
    },
    {
      icon:'🔑', name:'Hardware Wallet', type:'Cold Wallet',
      badges:[{t:'Cold',c:'cold'},{t:'Paling aman',c:'best'}],
      meters:[
        {l:'Keamanan',   f:97, v:'Sangat tinggi', c:'sec'},
        {l:'Kenyamanan', f:55, v:'Cukup',         c:'con'},
        {l:'Biaya',      f:70, v:'Berbayar',       c:'cst'},
        {l:'Kecepatan',  f:50, v:'Perlu setup',    c:'spd'},
      ],
      desc:'Perangkat fisik khusus yang menyimpan private key di dalam chip terisolasi. Private key tidak pernah keluar dari perangkat, bahkan saat menandatangani transaksi.',
      pros:['Private key tidak pernah online','Tahan serangan digital','Backup via seed phrase','Cocok untuk jumlah besar'],
      cons:['Perlu beli perangkat','Kurang praktis untuk transaksi cepat','Perlu backup seed phrase'],
      use:'Cocok untuk menyimpan jumlah besar jangka panjang. Seperti brankas di rumah, bukan dompet harian.',
    },
    {
      icon:'📄', name:'Paper Wallet', type:'Cold Wallet',
      badges:[{t:'Cold',c:'cold'},{t:'Paling sederhana',c:'warn'}],
      meters:[
        {l:'Keamanan',   f:80, v:'Tinggi (jika dijaga)', c:'sec'},
        {l:'Kenyamanan', f:15, v:'Rendah',               c:'con'},
        {l:'Biaya',      f:2,  v:'Hampir nol',            c:'cst'},
        {l:'Kecepatan',  f:10, v:'Lambat',                c:'spd'},
      ],
      desc:'Private key dan seed phrase dicetak atau ditulis di atas kertas, lalu disimpan di tempat aman. Tidak ada yang bisa meretasnya secara digital karena ia tidak digital sama sekali.',
      pros:['Tidak bisa diretas secara online','Biaya hampir nol','Tidak butuh perangkat khusus'],
      cons:['Rentan kerusakan fisik','Bisa terbakar atau basah','Sulit untuk transaksi','Perlu keamanan fisik ekstra'],
      use:'Cocok untuk backup jangka sangat panjang. Perlu proteksi fisik ekstra seperti laminasi atau penyimpanan tahan api.',
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
              <div class="wt-pc-label">Kelebihan</div>
              ${w.pros.map(p => `<div class="wt-pc-item">${p}</div>`).join('')}
            </div>
            <div class="wt-cons">
              <div class="wt-pc-label">Kekurangan</div>
              ${w.cons.map(c => `<div class="wt-pc-item">${c}</div>`).join('')}
            </div>
          </div>
          <div class="wt-usecase"><strong>Rekomendasi:</strong> ${w.use}</div>
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
        { dot:'bad',  text:'Exchange Mt. Gox ditembus hacker.',            sub:'2014' },
        { dot:'bad',  text:'850.000 BTC milik nasabah hilang seketika.',    sub:'Tidak ada yang bisa dilakukan' },
        { dot:'bad',  text:'Penarikan dibekukan tanpa pemberitahuan.',       sub:'Nasabah tidak tahu alasannya' },
        { dot:'bad',  text:'Proses hukum berlangsung lebih dari 10 tahun.', sub:'Sebagian besar dana tidak pernah kembali' },
      ],
      non: [
        { dot:'ok', text:'Kamu memegang private key sendiri.',              sub:'Private key tidak ada di server Mt. Gox' },
        { dot:'ok', text:'Hacker tidak bisa menyentuh wallet-mu.',          sub:'Tidak ada akses ke private key-mu' },
        { dot:'ok', text:'Bitcoin-mu aman sepenuhnya.',                     sub:'Tidak terpengaruh sama sekali' },
      ],
      verdict:'😱 Pengguna custodial Mt. Gox kehilangan rata-rata 6,5 BTC per orang. Pengguna non-custodial tidak kehilangan apapun karena private key mereka tidak pernah ada di server exchange.',
    },
    {
      cust: [
        { dot:'bad',  text:'FTX menggunakan dana nasabah untuk spekulasi.',  sub:'Lewat perusahaan afiliasi Alameda Research' },
        { dot:'bad',  text:'FTX kolaps dalam 72 jam.',                       sub:'November 2022' },
        { dot:'bad',  text:'Lebih dari 8 miliar dolar dana nasabah raib.',   sub:'1 juta lebih pengguna terdampak' },
        { dot:'warn', text:'Proses kebangkrutan dimulai.',                   sub:'Pengembalian dana tidak jelas kapan dan berapa' },
      ],
      non: [
        { dot:'ok', text:'Kamu memegang private key sendiri.',               sub:'Bitcoin tidak pernah masuk ke wallet FTX' },
        { dot:'ok', text:'Kolaps FTX tidak memengaruhi wallet-mu.',          sub:'Private key hanya ada di perangkatmu' },
        { dot:'ok', text:'Kamu bisa bertransaksi seperti biasa.',             sub:'Jaringan Bitcoin tidak peduli FTX bangkrut' },
      ],
      verdict:'😱 Sam Bankman-Fried, pendiri FTX, divonis 25 tahun penjara. Tapi dana nasabah tidak bisa kembali begitu saja. Pengguna non-custodial tidak terpengaruh sama sekali karena Bitcoin mereka tidak pernah diserahkan ke FTX.',
    },
    {
      cust: [
        { dot:'warn', text:'Pemerintah memerintahkan exchange memblokir akunmu.', sub:'Bisa karena regulasi, sanksi, atau alasan lain' },
        { dot:'bad',  text:'Exchange mematuhi perintah dalam hitungan jam.',      sub:'Mereka tidak punya pilihan' },
        { dot:'bad',  text:'Kamu tidak bisa login, tidak bisa menarik.',           sub:'Tidak ada yang bisa kamu lakukan' },
        { dot:'bad',  text:'Bitcoin-mu terjebak tanpa tahu sampai kapan.',         sub:'Proses hukum bisa berlangsung bertahun-tahun' },
      ],
      non: [
        { dot:'ok', text:'Private key ada di tanganmu, bukan di exchange.',       sub:'Tidak ada entitas yang bisa menyitanya secara digital' },
        { dot:'ok', text:'Tidak ada yang bisa memblokir transaksi yang valid.',    sub:'Jaringan Bitcoin tidak mengenal otoritas terpusat' },
        { dot:'ok', text:'Kamu tetap bisa mengirim dan menerima Bitcoin.',         sub:'Selama kamu punya private key, kamu punya aksesnya' },
      ],
      verdict:'🔒 Custodial wallet patuh pada hukum yurisdiksi tempat mereka beroperasi. Artinya akunmu bisa dibekukan kapanpun ada perintah dari otoritas. Non-custodial wallet tidak bisa dibekukan secara digital karena private key hanya ada di tanganmu.',
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
      hashEl.textContent = 'Ketik sesuatu untuk melihat hash-nya...';
      hashEl.className   = 'hp-hash-val hp-hash-empty';
      lastHash = '';
      avBody.innerHTML = '<div style="font-size:12px;color:#52524C;">Ketik sesuatu di atas untuk melihat perbandingan dengan versi yang berbeda satu huruf.</div>';
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
        <div class="hp-av-input">"${shared}<span>${altC}</span>" <span style="font-size:10px;color:#52524C;">(1 karakter berbeda)</span></div>
        <div class="hp-av-hash b">${highlightDiff(altHash, hash)}</div>
      </div>
      <div class="hp-av-diff">
        <strong>${diff} dari 64 karakter berbeda</strong> (${pct}%), satu perubahan kecil, hash berubah hampir setengahnya.
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
    ctx.fillText('G (titik awal)',gx+10*dpr,gy-6*dpr);

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
    ctx.fillText(`${k} lompatan`,W-8*dpr,8*dpr);

    const px=last[0], py=last[1];
    const privEl  = document.getElementById('b04-s42-priv');
    const coordEl = document.getElementById('b04-s42-coord');
    const pubEl   = document.getElementById('b04-s42-pub');
    const subEl   = document.getElementById('b04-s42-pub-sub');
    const noteEl  = document.getElementById('b04-s42-note');

    if (privEl)  privEl.textContent  = `${k} lompatan`;
    if (coordEl) coordEl.textContent = `(${px.toFixed(6)},  ${py.toFixed(6)})`;

    const prefix = py >= 0 ? '02' : '03';
    const xHex   = coordToHex(px, py, 32);
    if (pubEl) pubEl.innerHTML = `<span class="ecc-prefix">${prefix}</span>${xHex}`;

    const sign = py >= 0 ? 'positif' : 'negatif';
    if (subEl) subEl.innerHTML =
      `Prefix <span class="ecc-prefix">${prefix}</span> karena y ${sign} (${py.toFixed(4)}). ` +
      `Hanya koordinat x yang disimpan dalam hex. Penerima bisa menghitung ulang y dari x dan prefix ini.`;

    if (noteEl) noteEl.textContent = k === 1
      ? 'Private key = 1. Titik akhir adalah G itu sendiri.'
      : `Private key = ${k}. Dari public key ini, tidak ada cara menemukan berapa lompatan yang dilakukan. Coba tambah atau kurangi 1 — seluruh public key berubah total.`;
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
    const msgEl=g('b04-s43-msg');if(msgEl)msgEl.value='Kirim 0.05 BTC ke bc1q...3f8a';
    const wrap=g('b04-s43-sign-wrap');if(wrap)wrap.style.display='none';
    ['b04-s43-priv','b04-s43-nonce','b04-s43-sig','b04-s43-v-sig','b04-s43-v-pub'].forEach(id=>{const el=g(id);if(el)el.textContent='—';});
    const vm=g('b04-s43-v-msg');if(vm)vm.textContent='Selesaikan Tahap 1 terlebih dahulu.';
    const tm=g('b04-s43-t-msg-val');if(tm)tm.textContent='Selesaikan Tahap 1 terlebih dahulu.';
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
      el.textContent='Belum ada tanda tangan. Selesaikan Tahap 1 terlebih dahulu.';
      return;
    }
    const msgEl=g(msgId);const sigEl=g(sigId);
    if(!msgEl||!sigEl)return;
    const ok=(msgEl.textContent===state.origMsg)&&(sigEl.textContent===state.origSig);
    el.className='ec-result show '+(ok?'ok':'bad');
    el.textContent=ok
      ?'✓ Tanda tangan valid. Pesan tidak dimodifikasi dan tanda tangan cocok dengan public key pengirim. Jaringan menerima transaksi ini.'
      :'✗ Tanda tangan tidak valid. Pesan atau tanda tangan telah dimodifikasi. Jaringan menolak transaksi ini seketika.';
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
    if (!d) return 'Tanda tangani transaksi di Tahap 1 terlebih dahulu.';
    return `<span class="raw-comment">// ECDSA signature dalam format DER (Distinguished Encoding Rules)</span>
<span class="raw-comment">// Ini yang masuk ke dalam scriptSig atau witness field transaksi Bitcoin</span>

<span class="raw-comment">// Struktur DER:</span>
<span class="raw-key">30</span>                    <span class="raw-comment">// marker: ini DER sequence</span>
<span class="raw-key">${(d.der.length/2-1).toString(16).padStart(2,'0')}</span>                    <span class="raw-comment">// total length: ${d.der.length/2-1} bytes</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (nilai r)</span>
  <span class="raw-key">${d.rLen}</span>                  <span class="raw-comment">// r length: ${parseInt(d.rLen,16)} bytes${d.rPadded.length>64?' (diawali 00 karena high bit set)':''}</span>
  <span class="raw-num">${d.rPadded}</span>  <span class="raw-comment">// r</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (nilai s)</span>
  <span class="raw-key">${d.sLen}</span>                  <span class="raw-comment">// s length: ${parseInt(d.sLen,16)} bytes${d.sPadded.length>64?' (diawali 00 karena high bit set)':''}</span>
  <span class="raw-num">${d.sPadded}</span>  <span class="raw-comment">// s</span>
<span class="raw-key">01</span>                    <span class="raw-comment">// SIGHASH_ALL: tanda tangan mencakup seluruh transaksi</span>

<span class="raw-comment">// Hasil akhir (DER + sighash flag):</span>
<span class="raw-str">${d.derWithSighash}</span>

<span class="raw-comment">// Public key (compressed, 33 bytes):</span>
<span class="raw-str">${d.pub ? d.pub.slice(0,66) : '—'}</span>

<span class="raw-comment">// Keduanya masuk ke witness field (SegWit) atau scriptSig (Legacy).</span>
<span class="raw-comment">// Total signature size: ~${Math.round(d.derWithSighash.length/2)} bytes</span>
<span class="raw-comment">// Catatan: setiap tanda tangan ECDSA berbeda ukurannya (71-73 bytes)</span>
<span class="raw-comment">// karena r dan s bisa membutuhkan padding 0x00 atau tidak.</span>`;
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
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
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
  }  // Ukuran nyata: ECDSA DER 71-72 byte per tanda tangan, Schnorr tetap 64 byte
  // berapapun jumlah penandatangan, karena MuSig menggabungkannya jadi satu.
  const SIG_ECDSA = 72, SIG_SCHNORR = 64, FEE_RATE = 20; // sat/vB
  const MAX_SIGNERS = 15;

  function fmtSat(n){ return n.toLocaleString('id-ID'); }

  function renderAgg(){
    const sl = document.getElementById('b04-s44-signers');
    if(!sl) return;
    const n = parseInt(sl.value, 10);
    const eBytes = n * SIG_ECDSA;
    const sBytes = SIG_SCHNORR;
    const maxBytes = MAX_SIGNERS * SIG_ECDSA;

    const lbl = document.getElementById('b04-s44-signers-val');
    if(lbl) lbl.textContent = n + ' dari ' + n;

    const be = document.getElementById('b04-s44-bar-e');
    const bs = document.getElementById('b04-s44-bar-s');
    if(be) be.style.width = Math.max(2, (eBytes / maxBytes) * 100) + '%';
    if(bs) bs.style.width = Math.max(2, (sBytes / maxBytes) * 100) + '%';

    const ve = document.getElementById('b04-s44-val-e');
    const vs = document.getElementById('b04-s44-val-s');
    if(ve) ve.textContent = n + ' sig \u00b7 ' + eBytes + ' byte';
    if(vs) vs.textContent = '1 sig \u00b7 ' + sBytes + ' byte';

    const v = document.getElementById('b04-s44-verdict');
    if(v){
      if(n === 1){
        v.innerHTML = 'Dengan satu penandatangan, selisihnya tipis: <b>72 byte lawan 64 byte</b>. Geser ke kanan untuk melihat apa yang terjadi begitu penandatangannya bertambah.';
      } else {
        const hemat = eBytes - sBytes;
        const feeHemat = Math.round(hemat / 4) * FEE_RATE; // witness didiskon 4x
        v.innerHTML = 'ECDSA menyimpan <b>' + n + ' tanda tangan</b> terpisah, jadi ukurannya ikut tumbuh. Schnorr menggabungkan ' + n + ' tanda tangan menjadi <b>satu</b>, dan tetap 64 byte. Hemat <b>' + hemat + ' byte</b>, atau sekitar <b>' + fmtSat(feeHemat) + ' satoshi</b> pada fee rate 20 sat/vB. Dan karena hasilnya cuma satu tanda tangan, tidak ada yang bisa menebak bahwa transaksi ini melibatkan ' + n + ' orang.';
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
        :`<span class="sc-tx-head-badge single">1 tanda tangan</span>`;
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
          <div class="sc-tx-head s"><span class="sc-tx-head-id">${tx.label} · ${txid}</span><span class="sc-tx-head-badge unknown">1 tanda tangan</span></div>
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
    if(eObs) eObs.innerHTML='🔍 Di ECDSA: Tx #1 jelas 1 orang, Tx #2 jelas multisig '+_n+' orang, Tx #3 jelas multisig 2 orang. <strong>Siapapun bisa menganalisis pola kepemilikan.</strong>';
    if(sObs) sObs.innerHTML='🔒 Di Schnorr: ketiga transaksi terlihat identik, masing-masing hanya punya 1 tanda tangan. <strong>Tidak ada yang bisa tahu mana yang 1 orang, mana yang '+_n+' orang.</strong>';
    if(note) note.textContent='Di blockchain Bitcoin hari ini dengan Taproot, transaksi multisig yang menggunakan MuSig terlihat persis sama dengan transaksi biasa. Observer tidak bisa membedakan keduanya — semua terlihat seperti transaksi 1 tanda tangan biasa.';
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
      ctx.fillText('↑ Klik salah satu Tx (baris bawah) untuk lihat Merkle Proof-nya', W/2, H-10);

      // Legend kecil di kanan bawah
      const lx=W-12, ly=H-30;
      ctx.fillStyle=isDark?'#2D2A45':'#EEEDFE';
      ctx.strokeStyle='#7C5CFC'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(lx-60,ly,58,20,4); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#7C5CFC'; ctx.font=`500 9px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('Tx = bisa diklik', lx-31, ly+10);
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
        Dengan ${proof.length} hash ini, siapapun bisa menghitung ulang jalur dari Tx${txIdx+1} sampai Root dan memverifikasi bahwa transaksi ini ada di block — tanpa perlu melihat ${TX_COUNT-proof.length-1} transaksi lainnya.
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
  <span class="raw-key">"merkleroot"</span>: <span class="raw-str">"${rootLE}"</span>, <span class="raw-comment">// little-endian, seperti di block header</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">1713000000</span>,
  <span class="raw-key">"bits"</span>: <span class="raw-str">"1703a30c"</span>,
  <span class="raw-key">"nonce"</span>: <span class="raw-num">3850463748</span>,
  <span class="raw-key">"ntx"</span>: <span class="raw-num">${TX_COUNT}</span>
}

<span class="raw-comment">// Tx yang dipilih: Tx${txIdx+1}</span>
<span class="raw-key">"txid"</span>: <span class="raw-str">"${txidLE}"</span> <span class="raw-comment">// little-endian TXID</span>

<span class="raw-comment">// Merkle Proof untuk verifikasi Tx${txIdx+1}:</span>
<span class="raw-comment">// Dengan ${proof.length} hash ini + TXID, siapapun bisa menghitung ulang</span>
<span class="raw-comment">// Merkle Root dan membuktikan Tx${txIdx+1} ada di block ini.</span>
[
${proofLines}
]

<span class="raw-comment">// Merkle Root yang dihitung: "${merkleRoot}"</span>
<span class="raw-comment">// Cocok dengan merkleroot di block header? ${merkleRoot.match(/.{2}/g).reverse().join('') === rootLE ? '✓ Ya' : '✓ Ya'}</span>`;
  }

  function updateRaw45() {
    if (!rawOpen45 || !rawBody45) return;
    if (selectedTx === null) {
      rawBody45.innerHTML = 'Klik salah satu Tx untuk melihat Merkle Root dan Merkle Proof dalam format raw.';
    } else {
      rawBody45.innerHTML = buildRaw45(selectedTx);
    }
  }

  if (rawBtn45) rawBtn45.addEventListener('click', () => {
    rawOpen45 = !rawOpen45;
    rawBtn45.classList.toggle('active', rawOpen45);
    rawBtn45.innerHTML = rawOpen45
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
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
      id:'hash', name:'Fungsi Hash (SHA-256)', color:'purple', tag:'Integritas',
      role:'Menjaga rantai block tidak bisa dimanipulasi',
      menjaga:'Integritas blockchain',
      cara:'Setiap block berisi hash dari block sebelumnya. Mengubah satu transaksi lama berarti menghitung ulang hash seluruh rantai sesudahnya — secara komputasi mustahil.',
      tanpa:'Tanpa hash, riwayat transaksi bisa dimanipulasi oleh siapapun.',
      dipakai:['Header block','Mining (PoW)','TXID','Alamat Bitcoin'],
    },
    {
      id:'ecc', name:'Elliptic Curve (ECC)', color:'teal', tag:'Kepemilikan',
      role:'Menghasilkan keypair yang tidak bisa dipalsukan',
      menjaga:'Kepemilikan Bitcoin',
      cara:'Private key menghasilkan public key melalui perkalian titik di atas kurva. Satu arah, tidak bisa dibalik. Tanpa private key, tidak ada yang bisa mengklaim kepemilikan UTXO-mu.',
      tanpa:'Tanpa ECC, siapapun bisa memalsukan klaim kepemilikan Bitcoin orang lain.',
      dipakai:['Generate keypair','Dasar ECDSA','Dasar Schnorr','Alamat Bitcoin'],
    },
    {
      id:'ecdsa', name:'ECDSA & Schnorr', color:'amber', tag:'Otorisasi',
      role:'Membuktikan kepemilikan tanpa mengungkapkan rahasia',
      menjaga:'Validitas setiap transaksi',
      cara:'Private key menandatangani transaksi. Jaringan memverifikasi tanda tangan menggunakan public key tanpa pernah melihat private key. Schnorr menggabungkan banyak tanda tangan menjadi satu.',
      tanpa:'Tanpa tanda tangan digital, siapapun bisa memindahkan Bitcoin orang lain.',
      dipakai:['Setiap input transaksi','Multisig (MuSig)','Taproot','Script Bitcoin'],
    },
    {
      id:'merkle', name:'Merkle Tree', color:'green', tag:'Efisiensi',
      role:'Memungkinkan verifikasi tanpa mengunduh seluruh data',
      menjaga:'Efisiensi dan skalabilitas verifikasi',
      cara:'Seluruh transaksi dalam sebuah block dirangkum dalam satu Merkle Root. Untuk membuktikan satu transaksi, hanya butuh log₂(n) hash, bukan seluruh isi block.',
      tanpa:'Tanpa Merkle Tree, smartphone tidak bisa memverifikasi transaksi tanpa mengunduh ratusan GB data.',
      dipakai:['Header block','SPV wallet','Light client','Block explorer'],
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
        <span class="csm-detail-label">Menjaga</span>
        <span class="csm-detail-val">${c.menjaga}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Cara kerja</span>
        <span class="csm-detail-val">${c.cara}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Jika tidak ada</span>
        <span class="csm-detail-val">${c.tanpa}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Dipakai di</span>
        <div class="csm-chain">${c.dipakai.map(d=>`<span class="csm-chain-item">${d}</span>`).join('')}</div>
      </div>`;
    det.classList.add('show');
    sum.textContent = 'Keempat komponen ini bekerja bersama. Tidak ada satu pun yang bisa dihilangkan tanpa meruntuhkan seluruh sistem kepercayaan Bitcoin.';
  }

  function hide(){
    const det = g('b04-s46-detail');
    const sum = g('b04-s46-summary');
    if(det) det.classList.remove('show');
    if(sum) sum.textContent = 'Klik salah satu komponen di atas untuk melihat perannya dalam sistem Bitcoin.';
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
    t1: { main:8, outsiders:[], note:'✅ Semua node membentuk satu konsensus dan bergerak bersama.', ok:true },
    t2: { main:7, outsiders:[{label:'N8'}], note:'⚠️ 1 node menolak dan keluar dari konsensus. Sisanya tetap berjalan bersama.', ok:false },
    t3: { main:6, outsiders:[{label:'N7'},{label:'N8'}], note:'⚠️ 2 node memisahkan diri dan membentuk rantai fork sendiri. Dua jaringan yang berbeda.', ok:false },
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
      ctx.fillText('keluar', ox, oy+NR+4);
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
    ctx.fillText('Konsensus', W/2, H-8);
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
    ctx.fillText('titik fork',splitX,78);

    // Rantai baru — lebih panjang
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,5,newY,PURP,splitX+gap,gap);
    drawLabel(ctx,splitX+5*gap+4,newY,'node baru (lebih panjang)',PURP);

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

    drawLabel(ctx,sx,185,'Rantai terpanjang menang',PURP);
    drawLabel(ctx,sx,198,'Node lama ikut tanpa sadar',TXT);
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
    ctx.fillText('titik fork',splitX,78);

    // Rantai baru
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,newY,PURP,splitX+gap,gap);
    // Titik-titik lanjutan
    ctx.fillStyle=PURP;
    ctx.fillText('...', splitX+5*gap, newY);
    drawLabel(ctx,splitX+5*gap+8,newY,'Jaringan baru',PURP);

    // Rantai lama — terus tumbuh sendiri
    const oldY=155;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,oldY);
    ctx.strokeStyle=RED; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,oldY,RED,splitX+gap,gap);
    ctx.fillStyle=RED;
    ctx.fillText('...', splitX+5*gap, oldY);
    drawLabel(ctx,splitX+5*gap+8,oldY,'Jaringan lama',RED);

    // Label tidak kompatibel
    const midX=splitX+2*gap;
    ctx.strokeStyle=dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
    ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(midX,newY+8); ctx.lineTo(midX,oldY-8); ctx.stroke();
    ctx.fillStyle=TXT; ctx.font='8px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('tidak kompatibel',midX,(newY+oldY)/2);

    drawLabel(ctx,sx,185,'Split permanen — dua jaringan',RED);
    drawLabel(ctx,sx,198,'Contoh: Bitcoin Cash (2017)',TXT);
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
        if (stEl) stEl.textContent = 'ditemukan!';
        const res = g('b05-s52-result');
        if (res) {
          res.textContent = `Nonce ${nonce.toLocaleString('id')} ditemukan setelah ${attempts.toLocaleString('id')} percobaan (${((Date.now()-startTime)/1000).toFixed(1)}s). Hash dimulai dengan ${diff} angka nol — bukti kerja yang valid.`;
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
    if (stEl) stEl.textContent = 'menambang...';
    const res = g('b05-s52-result');
    if (res) { res.textContent = 'Mencari nonce yang valid...'; res.className = 'pw-result show running'; }
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
    if (stEl)    stEl.textContent = 'siap';
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
      desc:'Versi software Bitcoin yang membuat block ini. Menentukan aturan validasi mana yang berlaku.',
      note:'Jarang berubah' },
    { name:'Previous block hash', bytes:'32B', val:PREV_HASH,
      desc:'Hash dari block sebelumnya. Inilah yang menyambungkan satu block ke block berikutnya — itulah kenapa disebut blockchain.',
      note:'Yang membentuk rantai', isChain:true },
    { name:'Merkle root', bytes:'32B', val:'7f3c1a2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      desc:'1 hash ringkasan dari seluruh hash transaksi di block ini. Kalau satu transaksi berubah, merkle root ikut berubah.',
      note:'1 hash ringkasan seluruh hash tx, dibahas di 4.5' },
    { name:'Timestamp', bytes:'4B', val:'67a3bc14',
      desc:'Waktu block dibuat, dalam format Unix time (detik sejak 1 Januari 1970).',
      note:'Unix timestamp' },
    { name:'Bits (difficulty target)', bytes:'4B', val:'1703a30c',
      desc:'Representasi compact dari target difficulty saat ini. Menentukan seberapa sulit teka-teki yang harus dipecahkan miner.',
      note:'Diperbarui tiap 2016 block' },
    { name:'Nonce', bytes:'4B', val:'3850463748',
      desc:'Angka yang dicari miner. Satu-satunya field yang berubah-ubah selama proses mining. Miner mencoba triliunan nilai nonce sampai hash yang valid ditemukan.',
      note:'Yang dimining', isNonce:true },
  ];

  const chainHTML = `
    <div class="ba-chain-sim">
      <div class="ba-chain-block-sim">
        <div class="ba-chain-head-sim prev-sim">Block sebelumnya (#882418)</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
        <div class="ba-chain-row-sim hash-sim">hash: ${PREV_HASH.slice(0,20)}...</div>
      </div>
      <div class="ba-chain-arrow-sim">→</div>
      <div class="ba-chain-block-sim current-sim">
        <div class="ba-chain-head-sim curr-sim">Block ini (#882419)</div>
        <div class="ba-chain-row-sim match-sim">prev_hash: ${PREV_HASH.slice(0,20)}...</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
      </div>
    </div>
    <div class="ba-chain-note-sim">prev_hash di block ini = hash block sebelumnya. Itulah rantainya.</div>`;

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
              title:ctx=>'Tahun '+ctx[0].label,
              label:ctx=>{
                if(ctx.datasetIndex===0) return 'Supply: '+ctx.raw.toLocaleString('id-ID',{maximumFractionDigits:4})+' BTC';
                return 'Reward: '+ctx.raw.toLocaleString('id-ID',{maximumFractionDigits:8})+' BTC/block';
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
      p.textContent='Grafik tidak bisa ditampilkan karena pustaka grafik gagal dimuat. Isi halaman lainnya tetap utuh.';
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
      st.textContent='✅ Algoritma hashing diganti. Rantai penyerang tidak valid. Semua hardware ASIC penyerang seketika tidak berguna. Jaringan kembali aman.';
      if(fb) fb.style.display='none';
      return;
    }
    if(pct<50){
      st.className='at-status-sim safe-sim';
      st.textContent=`✅ Penyerang (${pct}% hashrate) tidak bisa mengejar. Probabilitas berhasil mendekati nol semakin panjang rantai jujur.`;
      if(fb) fb.style.display='none';
    } else if(attack<=honest){
      st.className='at-status-sim danger-sim';
      st.textContent=`⚠️ Penyerang (${pct}% hashrate) sedang mengejar — tertinggal ${honest-attack} block. Ancaman nyata.`;
      if(fb) fb.style.display='none';
    } else {
      st.className='at-status-sim attacking-sim';
      st.textContent=`🚨 Serangan berhasil — rantai penyerang lebih panjang ${attack-honest} block. Double-spend bisa dilakukan.`;
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
    if(st){st.className='at-status-sim safe-sim';st.textContent='Atur hashrate penyerang dan klik Mulai untuk melihat race attack.';}
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
    {label:'Penjumlahan sederhana', tokens:[
      {t:'1',       type:'data', desc:'Push angka 1 ke stack.', fn(s){s.push('1');}},
      {t:'2',       type:'data', desc:'Push angka 2 ke stack.', fn(s){s.push('2');}},
      {t:'OP_ADD',  type:'op',   desc:'Pop 1 dan 2 dari stack, jumlahkan, push hasilnya (3).', fn(s){const b=+s.pop(),a=+s.pop();s.push(String(a+b));}},
      {t:'3',       type:'data', desc:'Push angka 3 — nilai yang diharapkan sebagai hasil.', fn(s){s.push('3');}},
      {t:'OP_EQUAL',type:'op',   desc:'Pop dua nilai dari stack, bandingkan. Kalau sama, push TRUE.', fn(s){const b=s.pop(),a=s.pop();s.push(a===b?'TRUE':'FALSE');}},
    ], ok:s=>s.length===1&&s[0]==='TRUE'},

    {label:'P2PKH', tokens:[
      {t:'Tanda Tangan',    type:'data', desc:'scriptSig: push tanda tangan digital milik pengirim — bukti bahwa ia punya private key.', fn(s){s.push('Tanda Tangan');}},
      {t:'Kunci Publik',    type:'data', desc:'scriptSig: push kunci publik milik pengirim.', fn(s){s.push('Kunci Publik');}},
      {t:'OP_DUP',          type:'op',   desc:'Duplikasi nilai teratas — sekarang ada dua salinan Kunci Publik di stack.', fn(s){s.push(s[s.length-1]);}},
      {t:'OP_HASH160',      type:'op',   desc:'Pop satu Kunci Publik, hitung SHA-256 lalu RIPEMD-160, push hasilnya. Hasilnya akan dibandingkan dengan hash kunci publik penerima.', fn(s){s.pop();s.push('Hash Kunci Publik Pengirim');}},
      {t:'Hash PKH Penerima', type:'data', desc:'scriptPubKey: push hash kunci publik penerima yang dititipkan pemberi di output — inilah yang menentukan siapa yang berhak membelanjakan bitcoin ini.', fn(s){s.push('Hash PKH Penerima');}},
      {t:'OP_EQUALVERIFY',  type:'op',   desc:'Pop kedua hash, bandingkan. Kalau sama, buang keduanya dan lanjut. Membuktikan pengirim adalah pemegang kunci yang dituju penerima. Kalau beda, script gagal.', fn(s){s.pop();s.pop();}},
      {t:'OP_CHECKSIG',     type:'op',   desc:'Pop Kunci Publik dan Tanda Tangan, verifikasi secara kriptografis. Push TRUE kalau valid.', fn(s){s.pop();s.pop();s.push('TRUE');}},
    ], ok:s=>s.length===1&&s[0]==='TRUE'},

    {label:'Multisig 2-dari-3', tokens:[
      {t:'OP_0',             type:'op',   desc:'Push 0 — nilai dummy karena ada bug lama di OP_CHECKMULTISIG yang selalu membuang satu nilai ekstra dari stack.', fn(s){s.push('0');}},
      {t:'Tanda Tangan 1',   type:'data', desc:'Push tanda tangan dari penandatangan pertama.', fn(s){s.push('Tanda Tangan 1');}},
      {t:'Tanda Tangan 2',   type:'data', desc:'Push tanda tangan dari penandatangan kedua.', fn(s){s.push('Tanda Tangan 2');}},
      {t:'OP_2',             type:'op',   desc:'Push angka 2 — jumlah tanda tangan yang dibutuhkan.', fn(s){s.push('2');}},
      {t:'Kunci Publik 1',   type:'data', desc:'Push kunci publik anggota pertama.', fn(s){s.push('Kunci Publik 1');}},
      {t:'Kunci Publik 2',   type:'data', desc:'Push kunci publik anggota kedua.', fn(s){s.push('Kunci Publik 2');}},
      {t:'Kunci Publik 3',   type:'data', desc:'Push kunci publik anggota ketiga.', fn(s){s.push('Kunci Publik 3');}},
      {t:'OP_3',             type:'op',   desc:'Push angka 3 — total kunci publik yang tersedia.', fn(s){s.push('3');}},
      {t:'OP_CHECKMULTISIG', type:'op',   desc:'Verifikasi bahwa 2 dari 3 tanda tangan valid. Buang semua elemen, push TRUE kalau berhasil.', fn(s){s.length=0;s.push('TRUE');}},
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
      e.textContent = 'kosong';
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
      opEl.textContent = 'Selesai';
      descEl.textContent = 'Eksekusi script selesai.';
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
    el.textContent = ok ? '✅ TRUE — script valid, transaksi diterima jaringan' : '❌ FALSE — script gagal, transaksi ditolak';
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
      e.className='od-empty-sim'; e.textContent='kosong'; el.appendChild(e); return;
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
    {name:'OP_DUP',long:'Duplicate',desc:'Menyalin nilai teratas stack dan menambahkannya lagi ke atas.',
      inputs:[{label:'Nilai A',key:'a',ph:'hello'}],
      run(i){const a=i.a||'hello';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',[a,a]);setNote(`"${a}" disalin. Stack sekarang punya dua salinan nilai yang sama.`,'ok');}},
    {name:'OP_DROP',long:'Drop',desc:'Membuang nilai teratas stack.',
      inputs:[{label:'Nilai A',key:'a',ph:'hello'},{label:'Nilai B',key:'b',ph:'world'}],
      run(i){const a=i.a||'hello',b=i.b||'world';renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[a]);setNote(`"${b}" dibuang dari atas stack.`,'ok');}},
    {name:'OP_SWAP',long:'Swap',desc:'Menukar posisi dua nilai teratas stack.',
      inputs:[{label:'Nilai A',key:'a',ph:'pertama'},{label:'Nilai B',key:'b',ph:'kedua'}],
      run(i){const a=i.a||'pertama',b=i.b||'kedua';renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[b,a]);setNote(`"${a}" dan "${b}" bertukar posisi.`,'ok');}},
    {name:'OP_ADD',long:'Add',desc:'Mengambil dua angka dari stack, menjumlahkannya, dan menyimpan hasilnya.',
      inputs:[{label:'Angka A',key:'a',ph:'3'},{label:'Angka B',key:'b',ph:'4'}],
      run(i){const a=parseInt(i.a)||3,b=parseInt(i.b)||4,r=a+b;renderStack('b06-s62-before',[String(a),String(b)]);renderStack('b06-s62-after',[String(r)]);setNote(`${a} + ${b} = ${r}`,'ok');}},
    {name:'OP_SUB',long:'Subtract',desc:'Mengambil dua angka dari stack, mengurangi nilai kedua dari nilai pertama.',
      inputs:[{label:'Angka A',key:'a',ph:'10'},{label:'Angka B',key:'b',ph:'3'}],
      run(i){const a=parseInt(i.a)||10,b=parseInt(i.b)||3,r=a-b;renderStack('b06-s62-before',[String(a),String(b)]);renderStack('b06-s62-after',[String(r)]);setNote(`${a} - ${b} = ${r}`,'ok');}},
    {name:'OP_EQUAL',long:'Equal',desc:'Mengambil dua nilai dari stack dan membandingkannya. Menyimpan TRUE kalau sama, FALSE kalau beda.',
      inputs:[{label:'Nilai A',key:'a',ph:'42'},{label:'Nilai B',key:'b',ph:'42'}],
      run(i){const a=i.a||'42',b=i.b||'42',eq=a===b;renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[eq?'TRUE':'FALSE']);setNote(eq?`"${a}" = "${b}" → TRUE`:`"${a}" ≠ "${b}" → FALSE`,eq?'ok':'fail');}},
    {name:'OP_EQUALVERIFY',long:'Equal Verify',desc:'Seperti OP_EQUAL, tapi kalau tidak sama script langsung gagal.',
      inputs:[{label:'Nilai A',key:'a',ph:'abc'},{label:'Nilai B',key:'b',ph:'abc'}],
      run(i){const a=i.a||'abc',b=i.b||'abc',eq=a===b;renderStack('b06-s62-before',[a,b]);renderStack('b06-s62-after',[]);setNote(eq?`"${a}" = "${b}" — kedua nilai dibuang, script lanjut.`:`"${a}" ≠ "${b}" — script langsung GAGAL.`,eq?'ok':'fail');}},
    {name:'OP_SHA256',long:'SHA-256',desc:'Menghitung hash SHA-256 dari nilai teratas dan menyimpan hasilnya.',
      inputs:[{label:'Input',key:'a',ph:'hello'}],
      run(i){const a=i.a||'hello';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',['SHA256('+a+')']);setNote(`"${a}" di-hash dengan SHA-256. Output selalu 32 bytes, tidak peduli panjang input.`,'ok');}},
    {name:'OP_HASH160',long:'Hash 160-bit',desc:'Menghitung SHA-256 lalu RIPEMD-160. Hasilnya 20 bytes — dipakai untuk membuat alamat Bitcoin.',
      inputs:[{label:'Kunci Publik',key:'a',ph:'pubkey'}],
      run(i){const a=i.a||'pubkey';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',['HASH160('+a+')']);setNote(`"${a}" di-hash dua kali: SHA-256 → RIPEMD-160. Hasilnya 20 bytes — inilah yang tersimpan di dalam alamat Bitcoin.`,'ok');}},
    {name:'OP_CHECKSIG',long:'Check Signature',desc:'Mengambil kunci publik dan tanda tangan, memverifikasi secara kriptografis. TRUE kalau valid.',
      inputs:[{label:'Tanda Tangan',key:'sig',ph:'valid'},{label:'Kunci Publik',key:'pk',ph:'pubkey'}],
      run(i){const sig=i.sig||'valid',pk=i.pk||'pubkey',v=sig==='valid'||sig==='benar';renderStack('b06-s62-before',[sig,pk]);renderStack('b06-s62-after',[v?'TRUE':'FALSE']);setNote(v?'Tanda tangan diverifikasi. Valid → TRUE.':'Tanda tangan tidak valid → FALSE.',v?'ok':'fail');}},
    {name:'OP_CHECKMULTISIG',long:'Check Multisig',desc:'Memverifikasi m-dari-n tanda tangan. Semua kunci publik dan tanda tangan diambil dari stack.',
      inputs:[],
      run(){const before=['0','Tanda Tangan 1','Tanda Tangan 2','2','Kunci Publik 1','Kunci Publik 2','Kunci Publik 3','3'];renderStack('b06-s62-before',before);renderStack('b06-s62-after',['TRUE']);setNote('2 dari 3 tanda tangan diverifikasi. Cukup → TRUE. Stack dikosongkan.','ok');}},
    {name:'OP_IF',long:'If',desc:'Memeriksa nilai teratas stack. Kalau TRUE blok IF dijalankan, kalau FALSE dilewati.',
      inputs:[{label:'Kondisi',key:'a',ph:'true'}],
      run(i){const a=(i.a||'true').toLowerCase(),t=a==='true'||a==='1'||a==='ya';renderStack('b06-s62-before',[t?'TRUE':'FALSE']);renderStack('b06-s62-after',[]);setNote(t?'TRUE — blok IF dijalankan, nilai dibuang.':'FALSE — blok IF dilewati.',t?'ok':'warn');}},
    {name:'OP_VERIFY',long:'Verify',desc:'Mengambil nilai teratas. Kalau TRUE script lanjut. Kalau FALSE script langsung gagal.',
      inputs:[{label:'Kondisi',key:'a',ph:'true'}],
      run(i){const a=(i.a||'true').toLowerCase(),t=a==='true'||a==='1'||a==='ya';renderStack('b06-s62-before',[t?'TRUE':'FALSE']);renderStack('b06-s62-after',[]);setNote(t?'TRUE — nilai dibuang, script lanjut.':'FALSE — script langsung GAGAL.',t?'ok':'fail');}},
    {name:'OP_RETURN',long:'Return',desc:'Menghentikan eksekusi script sepenuhnya. Output ditandai tidak bisa dibelanjakan. Dipakai untuk menyematkan data ke blockchain.',
      inputs:[{label:'Data (batas: policy per node)',key:'a',ph:'pesan saya'}],
      run(i){const a=i.a||'pesan saya';renderStack('b06-s62-before',[a]);renderStack('b06-s62-after',[]);setNote(`Script berhenti total. Data "${a.slice(0,24)}${a.length>24?'…':''}" tersematkan ke blockchain secara permanen. Output ini tidak bisa dibelanjakan.`,'warn');}},
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
      btn.textContent='Jalankan ↗';
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
    {id:'all',label:'Semua'},{id:'stack',label:'Stack'},{id:'arith',label:'Aritmatika'},
    {id:'bit',label:'Perbandingan'},{id:'crypto',label:'Kriptografi'},
    {id:'flow',label:'Flow control'},{id:'lock',label:'Timelock'},{id:'disabled',label:'Dinonaktifkan'},
  ];

  const OPCODES=[
    {name:'OP_DUP',hex:'0x76',long:'Duplicate',cat:'stack',desc:'Salin nilai teratas ke atas stack.'},
    {name:'OP_DROP',hex:'0x75',long:'Drop',cat:'stack',desc:'Buang nilai teratas.'},
    {name:'OP_SWAP',hex:'0x7c',long:'Swap',cat:'stack',desc:'Tukar dua nilai teratas.'},
    {name:'OP_2DUP',hex:'0x6e',long:'Duplicate Two',cat:'stack',desc:'Salin dua nilai teratas ke atas stack.'},
    {name:'OP_OVER',hex:'0x78',long:'Over',cat:'stack',desc:'Salin nilai kedua dari atas ke paling atas.'},
    {name:'OP_ROT',hex:'0x7b',long:'Rotate',cat:'stack',desc:'Pindahkan nilai ketiga ke paling atas.'},
    {name:'OP_IFDUP',hex:'0x73',long:'If Duplicate',cat:'stack',desc:'Salin nilai teratas hanya kalau bukan nol.'},
    {name:'OP_ADD',hex:'0x93',long:'Add',cat:'arith',desc:'Ambil dua nilai, jumlahkan, simpan hasilnya.'},
    {name:'OP_SUB',hex:'0x94',long:'Subtract',cat:'arith',desc:'Ambil dua nilai, kurangi, simpan hasilnya.'},
    {name:'OP_1ADD',hex:'0x8b',long:'Add One',cat:'arith',desc:'Tambahkan 1 ke nilai teratas.'},
    {name:'OP_1SUB',hex:'0x8c',long:'Subtract One',cat:'arith',desc:'Kurangi 1 dari nilai teratas.'},
    {name:'OP_NEGATE',hex:'0x8f',long:'Negate',cat:'arith',desc:'Balik tanda nilai teratas.'},
    {name:'OP_ABS',hex:'0x90',long:'Absolute',cat:'arith',desc:'Ubah nilai teratas menjadi nilai absolut.'},
    {name:'OP_NOT',hex:'0x91',long:'Not',cat:'arith',desc:'Simpan 1 kalau nilai teratas nol, sebaliknya simpan 0.'},
    {name:'OP_MIN',hex:'0xa3',long:'Minimum',cat:'arith',desc:'Ambil dua nilai, simpan yang lebih kecil.'},
    {name:'OP_MAX',hex:'0xa4',long:'Maximum',cat:'arith',desc:'Ambil dua nilai, simpan yang lebih besar.'},
    {name:'OP_EQUAL',hex:'0x87',long:'Equal',cat:'bit',desc:'Ambil dua nilai — simpan TRUE kalau sama, FALSE kalau beda.'},
    {name:'OP_EQUALVERIFY',hex:'0x88',long:'Equal Verify',cat:'bit',desc:'Seperti OP_EQUAL, tapi langsung gagalkan script kalau tidak sama.'},
    {name:'OP_NUMEQUAL',hex:'0x9c',long:'Numeric Equal',cat:'bit',desc:'Bandingkan dua angka — simpan TRUE kalau sama.'},
    {name:'OP_NUMEQUALVERIFY',hex:'0x9d',long:'Numeric Equal Verify',cat:'bit',desc:'Seperti OP_NUMEQUAL, tapi langsung gagalkan kalau tidak sama.'},
    {name:'OP_LESSTHAN',hex:'0x9f',long:'Less Than',cat:'bit',desc:'Simpan TRUE kalau nilai pertama lebih kecil dari kedua.'},
    {name:'OP_GREATERTHAN',hex:'0xa0',long:'Greater Than',cat:'bit',desc:'Simpan TRUE kalau nilai pertama lebih besar dari kedua.'},
    {name:'OP_SHA256',hex:'0xa8',long:'SHA-256',cat:'crypto',desc:'Hash nilai teratas dengan SHA-256.'},
    {name:'OP_HASH160',hex:'0xa9',long:'Hash 160-bit',cat:'crypto',desc:'Hash nilai teratas dengan SHA-256 lalu RIPEMD-160. Dipakai di P2PKH dan P2SH.'},
    {name:'OP_HASH256',hex:'0xaa',long:'Hash 256-bit',cat:'crypto',desc:'Hash nilai teratas dua kali dengan SHA-256 (SHA-256d).'},
    {name:'OP_CHECKSIG',hex:'0xac',long:'Check Signature',cat:'crypto',desc:'Verifikasi satu tanda tangan. Simpan TRUE kalau valid.'},
    {name:'OP_CHECKSIGVERIFY',hex:'0xad',long:'Check Signature Verify',cat:'crypto',desc:'Seperti OP_CHECKSIG, tapi langsung gagalkan kalau tidak valid.'},
    {name:'OP_CHECKMULTISIG',hex:'0xae',long:'Check Multisig',cat:'crypto',desc:'Verifikasi m-dari-n tanda tangan. Simpan TRUE kalau cukup tanda tangan valid.'},
    {name:'OP_CHECKSIGADD',hex:'0xba',long:'Check Signature Add',cat:'crypto',desc:'Taproot: verifikasi tanda tangan Schnorr dan tambahkan ke counter. Pengganti OP_CHECKMULTISIG.'},
    {name:'OP_IF',hex:'0x63',long:'If',cat:'flow',desc:'Jalankan blok berikutnya hanya kalau nilai teratas TRUE.'},
    {name:'OP_NOTIF',hex:'0x64',long:'Not If',cat:'flow',desc:'Jalankan blok berikutnya hanya kalau nilai teratas FALSE.'},
    {name:'OP_ELSE',hex:'0x67',long:'Else',cat:'flow',desc:'Blok alternatif kalau kondisi IF tidak terpenuhi.'},
    {name:'OP_ENDIF',hex:'0x68',long:'End If',cat:'flow',desc:'Tutup blok kondisional.'},
    {name:'OP_VERIFY',hex:'0x69',long:'Verify',cat:'flow',desc:'Ambil nilai teratas — kalau FALSE, script langsung gagal.'},
    {name:'OP_RETURN',hex:'0x6a',long:'Return',cat:'flow',desc:'Hentikan script sepenuhnya. Output tidak bisa dibelanjakan. Dipakai untuk menyematkan data — batas ukurannya relay policy per node (konvensi lama: 80 bytes).'},
    {name:'OP_CHECKLOCKTIMEVERIFY',hex:'0xb1',long:'Check Lock Time Verify',cat:'lock',desc:'Tolak transaksi kalau belum melewati waktu atau block height tertentu (absolute timelock).'},
    {name:'OP_CHECKSEQUENCEVERIFY',hex:'0xb2',long:'Check Sequence Verify',cat:'lock',desc:'Tolak transaksi kalau belum melewati sejumlah block sejak output dikonfirmasi (relative timelock).'},
    {name:'OP_MUL',hex:'0x95',long:'Multiply',cat:'disabled',desc:'Kalikan dua nilai teratas.',reason:'Dinonaktifkan 2010. Perkalian integer besar bisa dieksploitasi untuk membuat script yang membutuhkan komputasi sangat lama, berpotensi melumpuhkan node.'},
    {name:'OP_DIV',hex:'0x96',long:'Divide',cat:'disabled',desc:'Bagi dua nilai teratas.',reason:'Dinonaktifkan 2010. Pembagian dengan nol tidak didefinisikan dengan baik, menciptakan celah yang bisa dieksploitasi untuk crash node.'},
    {name:'OP_MOD',hex:'0x97',long:'Modulo',cat:'disabled',desc:'Ambil sisa bagi dua nilai teratas.',reason:'Dinonaktifkan 2010. Modulo dengan nol bisa crash node dan perilakunya tidak konsisten di berbagai platform.'},
    {name:'OP_CAT',hex:'0x7e',long:'Concatenate',cat:'disabled',desc:'Gabungkan dua string menjadi satu.',reason:'Dinonaktifkan 2010. Penggabungan string berulang bisa membuat stack tumbuh secara eksponensial — serangan DoS dengan script kecil tapi memakan memori besar.'},
    {name:'OP_SUBSTR',hex:'0x7f',long:'Substring',cat:'disabled',desc:'Ambil sebagian karakter dari sebuah string.',reason:'Dinonaktifkan 2010. Indeks di luar batas tidak ditangani dengan baik, menyebabkan perilaku tak terdefinisi yang bisa dieksploitasi untuk crash node.'},
    {name:'OP_LEFT',hex:'0x80',long:'Left',cat:'disabled',desc:'Ambil karakter dari sisi kiri sebuah string.',reason:'Dinonaktifkan 2010. Operasi string dianggap tidak aman — perilaku edge case tidak konsisten di berbagai implementasi.'},
    {name:'OP_RIGHT',hex:'0x81',long:'Right',cat:'disabled',desc:'Ambil karakter dari sisi kanan sebuah string.',reason:'Dinonaktifkan 2010. Alasan sama dengan OP_LEFT.'},
    {name:'OP_INVERT',hex:'0x83',long:'Invert Bits',cat:'disabled',desc:'Balik semua bit dari nilai teratas (bitwise NOT).',reason:'Dinonaktifkan 2010. Operasi bitwise pada data berukuran besar bisa menghasilkan perilaku tidak terduga yang sulit diaudit keamanannya.'},
    {name:'OP_AND',hex:'0x84',long:'Bitwise AND',cat:'disabled',desc:'Lakukan operasi AND pada setiap bit dua nilai teratas.',reason:'Dinonaktifkan 2010. Operasi bitwise pada byte string panjang berpotensi membuat script sulit dianalisis dan bisa dieksploitasi.'},
    {name:'OP_OR',hex:'0x85',long:'Bitwise OR',cat:'disabled',desc:'Lakukan operasi OR pada setiap bit dua nilai teratas.',reason:'Dinonaktifkan 2010. Alasan sama dengan OP_AND.'},
    {name:'OP_XOR',hex:'0x86',long:'Bitwise XOR',cat:'disabled',desc:'Lakukan operasi XOR pada setiap bit dua nilai teratas.',reason:'Dinonaktifkan 2010. Alasan sama dengan OP_AND dan OP_OR.'},
    {name:'OP_2MUL',hex:'0x8d',long:'Multiply by Two',cat:'disabled',desc:'Kalikan nilai teratas dengan 2.',reason:'Dinonaktifkan 2010. Dinonaktifkan bersamaan operasi aritmatika lain sebagai tindakan pencegahan menyeluruh.'},
    {name:'OP_2DIV',hex:'0x8e',long:'Divide by Two',cat:'disabled',desc:'Bagi nilai teratas dengan 2.',reason:'Dinonaktifkan 2010. Alasan sama dengan OP_2MUL.'},
    {name:'OP_LSHIFT',hex:'0x98',long:'Left Shift',cat:'disabled',desc:'Geser bit nilai teratas ke kiri.',reason:'Dinonaktifkan 2010. Left shift tanpa batas atas yang jelas bisa menghasilkan angka yang sangat besar, berpotensi overflow dan crash node.'},
    {name:'OP_RSHIFT',hex:'0x99',long:'Right Shift',cat:'disabled',desc:'Geser bit nilai teratas ke kanan.',reason:'Dinonaktifkan 2010. Alasan sama dengan OP_LSHIFT.'},
  ];

  const BADGE_CLS={stack:'stack',arith:'arith',crypto:'crypto',flow:'flow',lock:'lock',bit:'bit',disabled:'disabled'};
  const BADGE_LBL={stack:'Stack',arith:'Aritmatika',crypto:'Kriptografi',flow:'Flow',lock:'Timelock',bit:'Perbandingan',disabled:'Nonaktif'};

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
    if(!list.length){body.innerHTML=`<tr><td colspan="5" style="padding:20px;text-align:center;font-size:12px;color:#52524C;">Tidak ada opcode di kategori ini.</td></tr>`;return;}
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
    {tok:0,label:'Tanda Tangan',desc:'scriptSig: push tanda tangan digital pengirim ke stack. Bukti bahwa ia punya private key.',fn(s){s.push('Tanda Tangan');}},
    {tok:1,label:'Kunci Publik', desc:'scriptSig: push kunci publik pengirim ke stack.',fn(s){s.push('Kunci Publik');}},
    {tok:2,label:'OP_DUP',       desc:'Duplikasi nilai teratas. Kunci Publik sekarang ada dua salinan — satu untuk di-hash, satu untuk OP_CHECKSIG.',fn(s){s.push(s[s.length-1]);}},
    {tok:3,label:'OP_HASH160',   desc:'Pop satu Kunci Publik, hitung SHA-256 lalu RIPEMD-160, push hasilnya (20 bytes). Ini yang akan dibandingkan dengan hash kunci publik penerima.',fn(s){s.pop();s.push('Hash Kunci Publik Pengirim');}},
    {tok:4,label:'Hash PKH Penerima',  desc:'scriptPubKey: push hash kunci publik penerima yang tersimpan di output — inilah yang dititipkan pemberi saat output dibuat. Harus cocok dengan hash kunci publik pengirim.',fn(s){s.push('Hash PKH Penerima');}},
    {tok:5,label:'OP_EQUALVERIFY',desc:'Pop kedua hash, bandingkan. Kalau sama, buang keduanya dan lanjut. Ini membuktikan bahwa pengirim memang pemegang kunci yang dituju penerima.',fn(s){s.pop();s.pop();}},
    {tok:6,label:'OP_CHECKSIG',  desc:'Pop Kunci Publik dan Tanda Tangan, verifikasi secara kriptografis. Kalau valid, push TRUE.',fn(s){s.pop();s.pop();s.push('TRUE');}},
  ];

  const TOK_DEFS=[
    {label:'Tanda Tangan',cls:'data-tok'},
    {label:'Kunci Publik', cls:'data-tok'},
    {label:'OP_DUP',       cls:'op-tok'},
    {label:'OP_HASH160',   cls:'op-tok'},
    {label:'Hash PKH Penerima',cls:'hash-tok'},
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
      const e=document.createElement('div'); e.className='b06-s63-empty'; e.textContent='kosong'; el.appendChild(e); return;
    }
    stack.forEach(v=>el.appendChild(makeItem(v)));
  }

  function renderInfo(){
    const opEl=g('b06-s63-op'), descEl=g('b06-s63-desc');
    if(!opEl||!descEl) return;
    if(step>=STEPS.length){opEl.textContent='Selesai';descEl.textContent='Script selesai dijalankan.';}
    else{opEl.textContent=STEPS[step].label;descEl.textContent=STEPS[step].desc;}
  }

  function renderResult(){
    const el=g('b06-s63-result'); if(!el) return;
    if(step<STEPS.length){el.className='b06-s63-result';return;}
    const ok=stack.length===1&&stack[0]==='TRUE';
    el.className='b06-s63-result '+(ok?'show-ok':'show-fail');
    el.textContent=ok?'✅ TRUE — identitas terverifikasi, transaksi sah':'❌ FALSE — verifikasi gagal, transaksi ditolak';
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
    rawb.textContent=show?'Sembunyikan raw data ↑':'Lihat raw data →';
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
    btn.textContent = show ? 'Sembunyikan raw data ↑' : 'Lihat raw data P2WPKH →';
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
      btn.textContent=show?'Sembunyikan raw data ↑':'Lihat raw data '+label+' →';
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
      btn.textContent=show?'Sembunyikan raw data ↑':'Lihat raw data '+label+' →';
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
    t1: { label:'Bitcoin', note:'Bitcoin memilih desentralisasi dan keamanan secara penuh. Skalabilitas diserahkan ke layer di atasnya. Ini adalah trade-off yang disengaja, bukan kelemahan.', noteClass:'bitcoin', fill:[1.0,1.0,0.1], color:PURP, label2:'Memilih desentralisasi + keamanan', tabClass:'active' },
    t2: { label:'Bitcoin + Lightning', note:'Lightning Network menambahkan skalabilitas di atas Bitcoin tanpa mengorbankan desentralisasi atau keamanan. Bitcoin tetap menjadi settlement layer yang aman.', noteClass:'lightning', fill:[1.0,1.0,0.9], color:GREEN, label2:'Trilemma terpenuhi bersama-sama', tabClass:'active-green' },
    t3: { label:'Pendekatan lain', note:'Pendekatan yang memprioritaskan skalabilitas biasanya harus mengorbankan desentralisasi (block besar = node mahal) atau keamanan (validator terpilih, checkpoint).', noteClass:'others', fill:[0.25,0.5,0.95], color:RED, label2:'Skalabel tapi mengorbankan yang lain', tabClass:'active-red' },
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
    const labels = ['Desentralisasi','Keamanan','Skalabilitas'];
    const sublabels = ['banyak node independen','kriptografi kuat, PoW','transaksi cepat & murah'];

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
    const items=[{color:PURP,label:'Bitcoin'},{color:GREEN,label:'Bitcoin + Lightning'},{color:RED,label:'Pendekatan lain'}];
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
    1:{head:'Fase 1 · Buka Channel (Funding Transaction)',note:'Satu transaksi on-chain mengunci 0.1 BTC di multisig 2-dari-2. Tidak ada yang bisa mengambil dana tanpa tanda tangan keduanya. Channel resmi terbuka.',noteClass:'info-note',
      rows:[{k:'Jenis transaksi',v:'Funding transaction',cls:'purp'},{k:'On-chain',v:'Ya — tercatat di blockchain',cls:'purp'},{k:'Multisig',v:'2-dari-2 (Alice + Bob)',cls:'purp'},{k:'Total dikunci',v:'0.1 BTC (0.05 Alice + 0.05 Bob)',cls:'purp'},{k:'State awal',v:'Alice: 0.05 BTC | Bob: 0.05 BTC',cls:'purp'}],txs:null},
    2:{head:'Fase 2 · Transaksi dalam Channel (Off-chain)',note:'Semua transaksi terjadi off-chain. State lama dicabut tiap update — kalau Alice mencoba menyiarkan state lama, Bob bisa mengklaim seluruh dana channel sebagai hukuman.',noteClass:'success-note',
      txs:[{label:'Alice → Bob',cls:'purp',amount:'0.010 BTC',result:'Alice: 0.040 | Bob: 0.060'},{label:'Alice → Bob',cls:'purp',amount:'0.005 BTC',result:'Alice: 0.035 | Bob: 0.065'},{label:'Bob → Alice',cls:'green',amount:'0.002 BTC',result:'Alice: 0.037 | Bob: 0.063'},{label:'Alice → Bob',cls:'purp',amount:'0.007 BTC',result:'Alice: 0.030 | Bob: 0.070'}],
      rows:[{k:'Jenis transaksi',v:'Commitment transaction (off-chain)',cls:'green'},{k:'On-chain',v:'Tidak — hanya ditukar antar pihak',cls:'green'},{k:'Jumlah transaksi',v:'4 transaksi, 0 on-chain',cls:'green'},{k:'State akhir',v:'Alice: 0.03 BTC | Bob: 0.07 BTC',cls:'green'},{k:'Revocation',v:'State lama sudah dicabut — tidak bisa digunakan',cls:'green'}]},
    3:{head:'Fase 3 · Tutup Channel (Settlement Transaction)',note:'Hanya satu transaksi on-chain lagi untuk menutup channel. Total: 2 transaksi on-chain untuk semua transaksi off-chain. Fee blockchain dibayar hanya dua kali.',noteClass:'warning-note',
      rows:[{k:'Jenis transaksi',v:'Closing transaction',cls:'amber'},{k:'On-chain',v:'Ya — mencatat saldo akhir',cls:'amber'},{k:'Alice menerima',v:'0.03 BTC',cls:'purp'},{k:'Bob menerima',v:'0.07 BTC',cls:'green'},{k:'Total on-chain',v:'2 transaksi untuk seluruh channel',cls:'amber'}],txs:null},
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

  /* ---- Cabang "coba curang": memperagakan penalty transaction ----
     Prosa 7.2 mengklaim curang itu tidak masuk akal secara ekonomi.
     Di sini pembaca bisa mencobanya dan melihat sendiri akibatnya. */
  const CHEAT = [
    {n:'1', cls:'bad', t:'Alice menyiarkan <b>commitment transaction lama</b> ke blockchain, versi saat saldonya masih 0.05 BTC.'},
    {n:'2', cls:'bad', t:'Transaksi itu <b>sah secara teknis</b>. Blockchain menerimanya. Sampai sini Alice terlihat berhasil.'},
    {n:'3', cls:'ok',  t:'Tapi dana Alice tidak langsung cair. Ia terkunci oleh <b>timelock</b> selama ratusan block, sekitar satu hari.'},
    {n:'4', cls:'ok',  t:'Node Bob melihat state lama itu muncul di blockchain, dan ia menyimpan <b>revocation key</b> yang Alice serahkan waktu state itu dicabut.'},
    {n:'5', cls:'ok',  t:'Sebelum timelock Alice habis, Bob menyiarkan <b>penalty transaction</b> memakai kunci tersebut.'},
    {n:'6', cls:'ok',  t:'Bob mengambil <b>seluruh isi channel</b>, 0.1 BTC. Alice tidak mendapat apa-apa, bahkan tidak 0.03 BTC yang sebenarnya haknya.'},
  ];
  const HONEST = [
    {n:'1', cls:'ok', t:'Alice dan Bob sama-sama menandatangani <b>closing transaction</b> dengan saldo terakhir.'},
    {n:'2', cls:'ok', t:'Satu transaksi on-chain, <b>tanpa timelock</b>, tanpa masa tunggu.'},
    {n:'3', cls:'ok', t:'Keduanya menerima haknya. Alice 0.03 BTC, Bob 0.07 BTC.'},
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
  const OUT_CHEAT='<div class="b07-s72-out lose"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.00 BTC</div><div class="b07-s72-out-tag">kehilangan semuanya, termasuk haknya</div></div>'+
                  '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.10 BTC</div><div class="b07-s72-out-tag">seluruh isi channel</div></div>';
  const OUT_HONEST='<div class="b07-s72-out win"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.03 BTC</div><div class="b07-s72-out-tag">sesuai saldo terakhir</div></div>'+
                   '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.07 BTC</div><div class="b07-s72-out-tag">sesuai saldo terakhir</div></div>';
  const Q_AWAL='Saldo Alice sudah turun dari 0.05 ke 0.03 BTC. Di komputernya masih tersimpan state lama waktu ia masih punya 0.05. Kenapa ia tidak menyiarkan yang itu saja? Coba saja, dan lihat apa yang terjadi.';
  const Q_CURANG='Inilah kenapa curang tidak masuk akal. Alice mempertaruhkan 0.03 BTC yang sudah pasti miliknya, demi peluang mendapat 0.05 BTC, dan kalau gagal ia kehilangan semuanya. Bukan aturan yang melarangnya mencoba, melainkan hitungannya sendiri yang membuatnya rugi.';
  const Q_JUJUR='Menutup secara jujur jauh lebih murah dan lebih cepat: satu transaksi, tanpa masa tunggu. Bandingkan dengan jalur curang di sebelahnya.';

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
    {l:'1 · Carol buat rahasia',h:'Langkah 1 — Carol membuat rahasia R',d:'Carol membuat rahasia R yang hanya ia tahu, lalu menghitung <b>H = hash(R)</b>. H adalah gembok. R adalah kuncinya. Carol memberikan H kepada Alice sebagai invoice.',nt:'Ini langkah awal. Hanya Carol yang pegang kunci rahasia.',nc:'p',nd:[{n:'Alice',c:'a',b:'0.10 BTC',bc:'p',s:'Punya H (gembok) dari Carol',hc:'Belum ada HTLC',hs:'no'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Belum terlibat',hc:'Belum ada HTLC',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Punya R (kunci rahasia)\\nPunya H = hash(R)',hc:'R tersimpan aman',hs:'ul'}],ar:[{l:'Alice → Bob',v:'belum ada',vc:'d'},{l:'Bob → Carol',v:'belum ada',vc:'d'}],hl:[2],hlg:true},
    {l:'2 · Alice lock ke Bob',h:'Langkah 2 — Alice mengunci dana ke Bob (HTLC 1)',d:'Alice berkata ke Bob: <b>"Kamu dapat 0.01 BTC kalau bisa tunjukkan R yang hash-nya H — tapi kalau 24 jam tidak bisa, uang balik ke aku."</b> Dana Alice terkunci. Bob belum dapat apa-apa.',nt:'HTLC pertama terbentuk. Bob tidak bisa kabur dengan uang Alice karena ia belum punya uangnya.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC terkunci di HTLC',hc:'lock: hash(R) | 24 jam',hs:'lk'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Menunggu — punya H dari Alice',hc:'Belum dapat apa-apa',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Menunggu dari Bob',hc:'Punya R (kunci)',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (terkunci)',vc:'p'},{l:'Bob → Carol',v:'belum ada',vc:'d'}],hl:[0,1]},
    {l:'3 · Bob lock ke Carol',h:'Langkah 3 — Bob mengunci dana ke Carol (HTLC 2)',d:'Bob tahu Carol punya R, jadi Bob berkata ke Carol: <b>"Kamu dapat 0.01 BTC kalau tunjukkan R — tapi kalau 12 jam tidak ada, uang balik ke aku."</b> Timelock Bob ke Carol (12 jam) lebih pendek dari Alice ke Bob (24 jam).',nt:'Dua HTLC terbentuk. Satu-satunya cara mengurai semuanya: Carol ungkap R.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC terkunci di HTLC',hc:'lock: hash(R) | 24 jam',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'0.01 BTC terkunci ke Carol',hc:'lock: hash(R) | 12 jam',hs:'lk'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Siap ungkap R untuk klaim',hc:'Punya R — siap klaim!',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (terkunci)',vc:'p'},{l:'Bob → Carol',v:'HTLC: 0.01 BTC (terkunci)',vc:'p'}],hl:[1,2],hlg:true},
    {l:'4 · Carol ungkap R',h:'Langkah 4 — Carol mengungkapkan R, mengklaim pembayaran',d:'Carol tunjukkan R ke Bob. Bob verifikasi: hash(R) = H? ✓ <b>Carol mendapat 0.01 BTC.</b> Bob sekarang tahu R dan bisa pakai untuk klaim dari Alice.',nt:'Dana mengalir ke Carol. Bob tidak rugi karena masih punya klaim ke Alice.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Menunggu Bob mengklaim',hc:'lock: hash(R) | 24 jam',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'Dapat R dari Carol!\\nSiap klaim dari Alice',hc:'Punya R — siap klaim Alice',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Berhasil! Dapat 0.01 BTC ✓',hc:'HTLC selesai ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (masih terkunci)',vc:'p'},{l:'Bob → Carol',v:'✓ Carol klaim 0.01 BTC',vc:'g'}],hl:[1,2],hlg:true},
    {l:'5 · Bob klaim dari Alice',h:'Langkah 5 — Bob mengungkapkan R ke Alice, pembayaran selesai',d:'Bob tunjukkan R ke Alice. Alice verifikasi: hash(R) = H? ✓ <b>Bob mendapat 0.01 BTC kembali.</b> Pembayaran selesai. Tidak ada kepercayaan yang dibutuhkan.',nt:'✅ Alice → Bob → Carol. Dua HTLC, nol kepercayaan, dijamin matematika.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Pembayaran selesai ✓',hc:'HTLC selesai ✓',hs:'ul'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Saldo kembali normal ✓',hc:'HTLC selesai ✓',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Menerima 0.01 BTC ✓',hc:'HTLC selesai ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'✓ Bob klaim 0.01 BTC',vc:'g'},{l:'Bob → Carol',v:'✓ Carol klaim 0.01 BTC',vc:'g'}],hl:[0,1,2],hlg:true},
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
    c1:{head:'Cooperative close — kedua pihak sepakat',note:'Cara terbaik dan paling umum. Tidak ada penantian, tidak ada risiko. Kedua pihak bernegosiasi fee dan menandatangani closing transaction bersama.',nc:'g',cls:'coop',rows:[{k:'Siapa yang bisa',v:'Kedua pihak, kapan saja',vc:''},{k:'Syarat',v:'Kedua pihak harus online dan setuju',vc:''},{k:'Output',v:'Langsung ke wallet masing-masing',vc:'g'},{k:'Waktu tunggu',v:'Tidak ada — langsung setelah konfirmasi',vc:'g'},{k:'Fee',v:'Satu transaksi, paling murah',vc:'g'}],steps:[{n:'1',c:'g',t:'Alice dan Bob bernegosiasi fee closing transaction'},{n:'2',c:'g',t:'Keduanya menandatangani closing transaction'},{n:'3',c:'g',t:'Satu transaksi on-chain — dana langsung terbagi'}]},
    c2:{head:'Force close — salah satu pihak tidak kooperatif',note:'Dipakai saat pihak lain menghilang atau tidak mau merespons. Lebih lambat dan lebih mahal karena perlu dua transaksi dan harus menunggu time-lock.',nc:'m',cls:'force',rows:[{k:'Siapa yang memulai',v:'Salah satu pihak secara unilateral',vc:''},{k:'Transaksi 1',v:'Commitment transaction — siarkan state terakhir',vc:'m'},{k:'Time-lock',v:'~144 block (~1 hari) — harus menunggu',vc:'m'},{k:'Transaksi 2',v:'Sweep transaction — ambil dana setelah time-lock',vc:'m'},{k:'Kenapa ada time-lock',v:'Memberi waktu pihak lain mendeteksi kecurangan',vc:''}],steps:[{n:'1',c:'m',t:'Alice menyiarkan commitment transaction terakhir'},{n:'2',c:'m',t:'Bob punya waktu untuk memeriksa — apakah state ini valid?'},{n:'3',c:'m',t:'Setelah time-lock selesai, Alice sweep dananya'}]},
    c3:{head:'Penalty close — hukuman untuk yang curang',note:'Terjadi ketika seseorang mencoba menyiarkan state lama. Pihak yang jujur punya window waktu untuk membuktikan kecurangan dan mengambil SEMUA dana.',nc:'r',cls:'pen',rows:[{k:'Pemicu',v:'Pihak curang menyiarkan state lama',vc:'r'},{k:'Deteksi',v:'Watchtower atau node yang online mendeteksi',vc:''},{k:'Justice transaction',v:'Pihak jujur menyiarkan bukti kecurangan',vc:'r'},{k:'Hasil untuk penyerang',v:'Kehilangan SEMUA dana di channel',vc:'r'},{k:'Hasil untuk pihak jujur',v:'Mendapat SEMUA dana termasuk milik penyerang',vc:'g'}],steps:[{n:'1',c:'r',t:'Bob (curang) menyiarkan commitment transaction lama'},{n:'2',c:'r',t:'Alice mendeteksi — ini bukan state terbaru!'},{n:'3',c:'r',t:'Alice menyiarkan justice transaction dengan revocation key'},{n:'4',c:'r',t:'Alice mengambil SEMUA dana di channel sebagai hukuman'}]},
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
    prefix:{head:'Prefix jaringan',rows:[{k:'Nilai',v:'lnbc'},{k:'Artinya',v:'Lightning Network Bitcoin (mainnet)'},{k:'Testnet',v:'lntb — untuk testing'},{k:'Signet',v:'lntbs — untuk developer'}]},
    amount:{head:'Jumlah pembayaran',rows:[{k:'Nilai',v:'1m'},{k:'Satuan',v:'m = milli (0.001 BTC = 100.000 satoshi)'},{k:'Contoh lain',v:'100u = 100 mikro = 0.0001 BTC'},{k:'Tanpa angka',v:'Jumlah bebas — penerima yang tentukan'}]},
    timestamp:{head:'Timestamp pembuatan',rows:[{k:'Format',v:'Unix timestamp (detik)'},{k:'Fungsi',v:'Menentukan kapan invoice dibuat'},{k:'Kombinasi dengan',v:'Masa berlaku (expiry) untuk hitung kadaluwarsa'}]},
    phash:{head:'Payment hash (H)',rows:[{k:'Nilai',v:'pp5kw5... (32 bytes / 256 bit)'},{k:'Artinya',v:'H = hash(R) — hash dari rahasia Carol'},{k:'Fungsi',v:'"Gembok" di setiap HTLC dalam rantai pembayaran'},{k:'Tidak bisa dipalsukan',v:'SHA-256 — tidak ada yang bisa menebak R dari H'}]},
    nodeid:{head:'Node ID penerima',rows:[{k:'Nilai',v:'hz02a7... (33 bytes compressed pubkey)'},{k:'Artinya',v:'Kunci publik node Lightning Carol di jaringan'},{k:'Fungsi',v:'Wallet pengirim pakai ini untuk menemukan rute ke Carol'},{k:'Channel privat',v:'Invoice bisa berisi routing hints untuk channel tidak publik'}]},
    expiry:{head:'Masa berlaku invoice',rows:[{k:'Nilai',v:'3600 detik (1 jam)'},{k:'Default',v:'3600 detik kalau tidak disebutkan'},{k:'Setelah expired',v:'Invoice tidak bisa dipakai — penerima buat invoice baru'},{k:'Kenapa ada expiry',v:'Melindungi penerima dari pembayaran yang sangat tertunda'}]},
    sig:{head:'Tanda tangan digital',rows:[{k:'Jenis',v:'ECDSA atau Schnorr'},{k:'Dibuat oleh',v:'Node penerima (Carol) dengan private key-nya'},{k:'Fungsi',v:'Membuktikan invoice benar-benar dibuat oleh node yang mengklaim'},{k:'Verifikasi',v:'Wallet pengirim otomatis verifikasi sebelum bayar'}]},
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
    {label:'Amerika Utara', pct:28, color:'#534AB7'},
    {label:'Eropa',         pct:35, color:'#7C3AED'},
    {label:'Asia',          pct:20, color:'#0F6E56'},
    {label:'Amerika Latin', pct:8,  color:'#854F0B'},
    {label:'Lainnya',       pct:9,  color:'#52524C'},
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
    ctx.fillText('negara', cx, cy + 6);

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

  const NEW_NODE = {x:.50,y:.75,label:'Node Baru',type:'new'};
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
    {label:'1 · Node baru',head:'Langkah 1 — Node baru dijalankan',
     body:'Node baru menyala tapi belum terhubung ke siapapun. Ia hanya tahu satu hal: ada domain DNS seed yang bisa ditanya untuk mendapat daftar node aktif. Semua implementasi software node Bitcoin menyertakan daftar DNS seed ini.',
     note:'Node baru belum punya teman. Langkah pertama: tanya DNS seed.',nc:'p',
     vp:[],cp:[],dnsA:false,dnsC:false,pe:[]},
    {label:'2 · DNS query',head:'Langkah 2 — Query ke DNS seed',
     body:'Node mengirim DNS query ke domain seperti <code>seed.bitcoin.sipa.be</code>. DNS seed membalas dengan daftar IP address node-node yang sedang aktif di jaringan. Ini bukan kepercayaan buta: node hanya menggunakan daftar ini sebagai titik awal.',
     note:'DNS seed memberikan daftar IP. Node belum percaya siapapun, hanya tahu di mana harus mulai.',nc:'m',
     vp:[0,1,2,3],cp:[],dnsA:true,dnsC:false,pe:[]},
    {label:'3 · Koneksi awal',head:'Langkah 3 — Koneksi ke peer pertama',
     body:'Node memilih beberapa alamat dari daftar DNS seed dan mencoba terhubung. Setiap koneksi dimulai dengan handshake: bertukar pesan <code>version</code> dan <code>verack</code> untuk memastikan keduanya berbicara protokol yang sama.',
     note:'Koneksi pertama berhasil. Node mulai berpartisipasi dalam jaringan.',nc:'m',
     vp:[0,1,2,3],cp:[0,1],dnsA:true,dnsC:true,pe:[[0,1]]},
    {label:'4 · Peer exchange',head:'Langkah 4 — Peer exchange via getaddr',
     body:'Node mengirim pesan <code>getaddr</code> ke peer yang sudah terhubung. Peer membalas dengan pesan <code>addr</code> berisi daftar ratusan alamat peer lain yang diketahuinya. Dari sini node bisa menemukan lebih banyak peer tanpa tergantung DNS seed lagi.',
     note:'Peer exchange selesai. Node sekarang punya database peer untuk koneksi berikutnya.',nc:'m',
     vp:[0,1,2,3,4,5],cp:[0,1,2,3,4,5],dnsA:false,dnsC:false,pe:[[0,1],[0,2],[1,3],[2,4],[3,5]]},
    {label:'5 · Terhubung penuh',head:'Langkah 5 — Node terhubung ke jaringan',
     body:'Node sekarang punya 8 koneksi outbound aktif. Ia mulai menerima transaksi dan block dari peer, memverifikasi semuanya, dan meneruskan yang valid. Node menyimpan daftar peer ke disk sehingga saat dimatikan dan dinyalakan ulang, ia tidak perlu mulai dari awal.',
     note:'Node baru sudah menjadi bagian penuh dari jaringan Bitcoin. Proses ini biasanya selesai dalam hitungan menit.',nc:'g',
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
      {c:C_NEW,l:'Node baru (kamu)'},
      {c:C_DNS,l:'DNS seed'},
      {c:C_PEER,l:'Peer terhubung'},
      {c:C_INACTIVE,l:'Peer ditemukan'},
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
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' dtk';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' dtk';
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
    if(note){note.textContent='Miner menemukan block baru! Kedua metode menyebar secara bersamaan...';note.className='b08-s84-note run-note';}
    startTime=Date.now();
    timerInt=setInterval(()=>updateStats(),100);
    await Promise.all([runBFS(false),runBFS(true)]);
    clearInterval(timerInt);
    const t=elapsed();
    const d1=g('b08-s84-data1'); if(d1) d1.textContent=kb1+' KB';
    const d2=g('b08-s84-data2'); if(d2) d2.textContent=kb2+' KB';
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' dtk';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' dtk';
    if(note){note.textContent=`✓ Selesai! Block biasa: ~${kb1} KB. Compact Block: ~${kb2} KB. Compact Block menghemat ${Math.round((1-kb2/kb1)*100)}% bandwidth.`;note.className='b08-s84-note done-note';}
    running=false; runBtn.disabled=false;
  });

  const resetBtn=g('b08-s84-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt); running=false;
    recv1=new Set(); recv2=new Set();
    act1=new Set(); act2=new Set();
    kb1=0; kb2=0; draw(); updateStats();
    ['b08-s84-data1','b08-s84-data2'].forEach(id=>{const el=g(id);if(el)el.textContent='0 KB';});
    ['b08-s84-time1','b08-s84-time2'].forEach(id=>{const el=g(id);if(el)el.textContent='0.0 dtk';});
    ['b08-s84-done1','b08-s84-done2'].forEach(id=>{const el=g(id);if(el)el.textContent='0/8';});
    const note=g('b08-s84-note1');
    if(note){note.textContent='Block biasa mengirim seluruh data. Compact Block hanya mengirim header + ID transaksi karena node penerima sudah punya transaksinya di mempool.';note.className='b08-s84-note idle-note';}
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
    const s=g('b08-s83-stat'); if(s) s.textContent=`Node menerima: ${received.size} / ${NODES.length}`;
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
            addLog(elapsed(),`N${to} menerima dari N${from} — verifikasi ok, diteruskan`,'ok-log');
          } else {
            addLog(elapsed(),`N${to} sudah punya tx ini — duplikat, dibuang`,'dup-log');
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
    addLog(0,'N0 (pengirim) membuat transaksi dan menyiarkan ke peer','ok-log');

    const note=g('b08-s83-note');
    if(note){note.textContent='Transaksi sedang menyebar... Setiap node memverifikasi sebelum meneruskan ke peer-nya.';note.className='b08-s83-note running-note';}

    startTime=Date.now();
    timerInt=setInterval(()=>{
      const el=g('b08-s83-timer'); if(el) el.textContent=elapsed().toFixed(1)+' dtk';
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
    const el=g('b08-s83-timer'); if(el) el.textContent=t.toFixed(1)+' dtk';
    addLog(t,`✓ Semua ${NODES.length} node menerima transaksi dalam ${t.toFixed(1)} detik`,'ok-log');
    if(note){note.textContent=`✓ Transaksi menyebar ke semua ${NODES.length} node dalam ${t.toFixed(1)} detik. Di dunia nyata dengan ribuan node, prosesnya butuh sekitar 5-15 detik.`;note.className='b08-s83-note done-note';}
    running=false;
    if(sendBtn) sendBtn.disabled=false;
  }

  const sendBtn=g('b08-s83-send');
  if(sendBtn) sendBtn.addEventListener('click',()=>{
    if(running) return;
    received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Node menerima: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 dtk';
    draw(); runPropagation();
  });

  const resetBtn=g('b08-s83-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt);
    running=false; received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='<div class="b08-s83-log-row"><span class="b08-s83-log-t">—</span><span class="b08-s83-log-m">Klik "Kirim Transaksi" untuk memulai simulasi</span></div>';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Node menerima: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 dtk';
    const note=g('b08-s83-note'); if(note){note.textContent='Transaksi akan menyebar dari node pengirim ke seluruh jaringan melalui mekanisme gossiping. Setiap node memverifikasi sebelum meneruskan.';note.className='b08-s83-note idle-note';}
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
    const s=g('b08-s82-s1'); if(s) s.textContent=`Aktif: ${alive} / ${PN.length}`;
    const note=g('b08-s82-n1'); if(!note) return;
    if(alive===0){
      note.textContent='💀 Semua node diserang — jaringan mati total. Tapi ini butuh menyerang '+PN.length+' node secara bersamaan di seluruh dunia. Jauh lebih sulit dari menyerang satu server pusat.';
      note.className='b08-s82-note dead-note';
    } else if(pDead.size===0){
      note.textContent='Jaringan P2P berjalan penuh. Coba klik beberapa node untuk menyerangnya.';
      note.className='b08-s82-note safe-note';
    } else if(alive>=4){
      note.textContent=`✓ ${pDead.size} node diserang — jaringan tetap berjalan dengan ${alive} node aktif. Node lain otomatis terhubung melewati node yang mati.`;
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`⚠️ ${pDead.size} node diserang — jaringan terdegradasi, hanya ${alive} node aktif.`;
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
    ctx.fillText(svrDead?'MATI':'Server pusat', SVR.x*W, SVR.y*CH+SR+11);

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
    if(s) s.textContent=`Aktif: ${alive} / ${CN.length} \u00a0|\u00a0 Server: ${svrDead?'MATI':'online'}`;
    const note=g('b08-s82-n2'); if(!note) return;
    if(svrDead){
      note.textContent='💀 Server pusat diserang — seluruh jaringan lumpuh seketika. Semua '+CN.length+' node mati meskipun hardware mereka masih hidup. Inilah single point of failure: satu serangan, semua hancur.';
      note.className='b08-s82-note dead-note';
    } else if(cDead.size===0){
      note.textContent='Server pusat online. Semua node terhubung. Coba klik server pusat (hijau di tengah) untuk menyerangnya.';
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`${cDead.size} node klien diserang. Selama server pusat hidup, node lain masih bisa berkomunikasi. Coba serang server pusat untuk melihat perbedaannya.`;
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
      {k:'Tipe',         v:'Full node',                                    vc:'p'},
      {k:'Blockchain',   v:'Seluruh chain (~600 GB)',                      vc:'p'},
      {k:'Verifikasi',   v:'Setiap transaksi & block secara mandiri',      vc:'p'},
      {k:'Koneksi',      v:'Terhubung ke 8 peer',                          vc:''},
      {k:'Fungsi utama', v:'Menjaga aturan konsensus — tidak perlu percaya siapapun', vc:''},
    ]}},
    {id:1, label:'Mining Node',  type:'mining',  color:'#0F6E56', x:0.50, y:0.12,
     detail:{head:'Mining Node — Singapore', color:'#0F6E56', rows:[
      {k:'Tipe',         v:'Mining node (full node + mining)',              vc:'g'},
      {k:'Blockchain',   v:'Seluruh chain (~600 GB)',                       vc:'g'},
      {k:'Verifikasi',   v:'Setiap transaksi & block secara mandiri',       vc:'g'},
      {k:'Mining',       v:'Aktif mencari nonce untuk membuat block baru',  vc:'g'},
      {k:'Fungsi utama', v:'Mengamankan jaringan dan menghasilkan block reward', vc:''},
    ]}},
    {id:2, label:'Full Node B',  type:'full',   color:'#534AB7', x:0.82, y:0.25,
     detail:{head:'Full Node — Frankfurt', color:'#534AB7', rows:[
      {k:'Tipe',         v:'Full node',                                     vc:'p'},
      {k:'Blockchain',   v:'Seluruh chain (~600 GB)',                       vc:'p'},
      {k:'Verifikasi',   v:'Setiap transaksi & block secara mandiri',       vc:'p'},
      {k:'Koneksi',      v:'Terhubung ke 6 peer',                           vc:''},
      {k:'Fungsi utama', v:'Menjaga aturan konsensus secara independen',    vc:''},
    ]}},
    {id:3, label:'Pruned Node',  type:'pruned', color:'#854F0B', x:0.25, y:0.68,
     detail:{head:'Pruned Node — Tokyo', color:'#854F0B', rows:[
      {k:'Tipe',         v:'Pruned node',                                   vc:'m'},
      {k:'Blockchain',   v:'Hanya ~10 GB block terbaru',                   vc:'m'},
      {k:'Verifikasi',   v:'Memverifikasi semua aturan — data lama dihapus setelah diverifikasi', vc:'m'},
      {k:'Storage',      v:'Jauh lebih hemat dari full node',               vc:''},
      {k:'Fungsi utama', v:'Full verification dengan storage terbatas',     vc:''},
    ]}},
    {id:4, label:'Full Node C',  type:'full',   color:'#534AB7', x:0.50, y:0.72,
     detail:{head:'Full Node — Sao Paulo', color:'#534AB7', rows:[
      {k:'Tipe',         v:'Full node',                                     vc:'p'},
      {k:'Blockchain',   v:'Seluruh chain (~600 GB)',                       vc:'p'},
      {k:'Verifikasi',   v:'Setiap transaksi & block secara mandiri',       vc:'p'},
      {k:'Koneksi',      v:'Terhubung ke 7 peer',                           vc:''},
      {k:'Fungsi utama', v:'Tidak ada titik pusat — setiap node mandiri',   vc:''},
    ]}},
    {id:5, label:'SPV Node',     type:'spv',    color:'#52524C', x:0.75, y:0.68,
     detail:{head:'SPV Node — Mobile Wallet', color:'#888780', rows:[
      {k:'Tipe',         v:'SPV (Simplified Payment Verification)',         vc:''},
      {k:'Data',         v:'Hanya block header — ~60 MB',                  vc:''},
      {k:'Verifikasi',   v:'Tidak memverifikasi transaksi secara penuh',    vc:'r'},
      {k:'Kepercayaan',  v:'Mempercayai miner bahwa chain terpanjang valid', vc:'r'},
      {k:'Fungsi utama', v:'Ringan untuk mobile — cocok untuk pembayaran sehari-hari', vc:''},
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
      next: {rate:2,  eta:'Block berikutnya (~10 menit)',          conf:'Tinggi',        cls:'s95-good', blocks:1},
      '3blk':{rate:1, eta:'1-2 block (~10-20 menit)',              conf:'Tinggi',        cls:'s95-good', blocks:1},
      '6blk':{rate:1, eta:'1-3 block (~10-30 menit)',              conf:'Tinggi',        cls:'s95-good', blocks:1},
      '1day':{rate:1, eta:'Block berikutnya — mempool sangat sepi',conf:'Sangat tinggi', cls:'s95-good', blocks:1},
    },
    normal:{
      next: {rate:15, eta:'1-2 block (~10-20 menit)',   conf:'Sedang', cls:'s95-warn', blocks:2},
      '3blk':{rate:8, eta:'2-4 block (~20-40 menit)',   conf:'Sedang', cls:'s95-warn', blocks:3},
      '6blk':{rate:5, eta:'4-8 block (~40-80 menit)',   conf:'Sedang', cls:'s95-warn', blocks:6},
      '1day':{rate:2, eta:'Beberapa jam hingga 1 hari', conf:'Rendah', cls:'s95-warn', blocks:10},
    },
    busy:{
      next: {rate:80, eta:'1-3 block (~10-30 menit)', conf:'Sedang', cls:'s95-warn', blocks:3},
      '3blk':{rate:50,eta:'3-6 block (~30-60 menit)', conf:'Sedang', cls:'s95-warn', blocks:5},
      '6blk':{rate:30,eta:'6-12 block (~1-2 jam)',    conf:'Rendah', cls:'s95-warn', blocks:10},
      '1day':{rate:10,eta:'Bisa lebih dari 1 hari',   conf:'Rendah', cls:'s95-bad',  blocks:20},
    },
    vbusy:{
      next: {rate:180,eta:'1-5 block (~10-50 menit)',  conf:'Rendah',       cls:'s95-bad', blocks:5},
      '3blk':{rate:120,eta:'3-8 block (~30-80 menit)', conf:'Rendah',       cls:'s95-bad', blocks:8},
      '6blk':{rate:80, eta:'6-20 block (~1-3 jam)',    conf:'Rendah',       cls:'s95-bad', blocks:18},
      '1day':{rate:30, eta:'Bisa berhari-hari',         conf:'Sangat rendah',cls:'s95-bad', blocks:30},
    },
  };

  const EXPLAIN={
    quiet:{
      next:'Mempool sepi. Hampir semua transaksi dikonfirmasi dalam block berikutnya bahkan dengan fee sangat rendah.',
      '3blk':'Mempool sepi. Fee 1 sat/vB sudah lebih dari cukup — transaksi kemungkinan dikonfirmasi dalam block pertama.',
      '6blk':'Mempool sepi. Tidak perlu membayar lebih dari minimum. Semua transaksi dikonfirmasi cepat.',
      '1day':'Mempool sepi. Bahkan fee minimum 1 sat/vB sudah cukup. Ini saat terbaik untuk kirim transaksi non-urgent.',
    },
    normal:{
      next:'Mempool normal. Fee 15 sat/vB menempatkan transaksi di atas mayoritas antrian. Estimator menganalisis distribusi fee mempool saat ini.',
      '3blk':'Mempool normal. Fee 8 sat/vB cukup untuk konfirmasi dalam beberapa block. Miner akan memproses ini setelah antrian di atasnya selesai.',
      '6blk':'Mempool normal. Fee 5 sat/vB menempatkan transaksi di zona menengah. Ada risiko delay kalau ada lonjakan transaksi mendadak.',
      '1day':'Mempool normal tapi fee rendah ini berisiko. Kalau kondisi mempool memburuk, transaksi bisa stuck lebih lama dari perkiraan.',
    },
    busy:{
      next:'Mempool ramai. Fee 80 sat/vB diperlukan untuk bersaing dengan antrian panjang. Estimator memperkirakan butuh beberapa block untuk giliran kamu.',
      '3blk':'Mempool ramai. Fee 50 sat/vB menempatkan transaksi di zona prioritas menengah. Ada ketidakpastian cukup tinggi.',
      '6blk':'Mempool ramai. Fee 30 sat/vB adalah minimum untuk dikonfirmasi dalam jam ini. Pertimbangkan menunggu kalau tidak urgent.',
      '1day':'Mempool ramai dan fee ini sangat rendah. Transaksi mungkin tidak dikonfirmasi hari ini. Gunakan hanya kalau benar-benar tidak urgent.',
    },
    vbusy:{
      next:'Mempool sangat ramai. Fee 180 sat/vB diperlukan untuk masuk block berikutnya tapi kepercayaan rendah. Pertimbangkan apakah ini benar-benar urgent.',
      '3blk':'Mempool sangat ramai. Fee 120 sat/vB masih sangat mahal. Kalau tidak urgent, tunggu sampai kondisi mereda.',
      '6blk':'Mempool sangat ramai. Fee 80 sat/vB mungkin tidak cukup kalau kondisi memburuk lagi. Risiko stuck sangat nyata.',
      '1day':'Mempool sangat ramai. Fee 30 sat/vB bisa stuck berhari-hari. Sangat disarankan untuk menunggu kondisi mempool mereda.',
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
    if(n>20) html+=`<span class="b09-s95-more">+${n-20} block lagi</span>`;
    track.innerHTML=html;
  }

  function update(){
    const d=DATA[curMp][curTgt];
    const ex=EXPLAIN[curMp][curTgt];
    const szEl=document.getElementById('b09-s95-size');
    const nIn=szEl?parseInt(szEl.value,10):1;
    const vb=Math.round(11+nIn*68+2*31);          // P2WPKH: overhead + input + 2 output
    const totalSat=d.rate*vb;
    const szv=document.getElementById('b09-s95-size-val');
    if(szv) szv.textContent=nIn+' input';
    const szn=document.getElementById('b09-s95-size-note');
    if(szn){
      szn.innerHTML = nIn===1
        ? 'Transaksi paling sederhana: <b>1 input, 2 output</b>, sekitar <b>'+vb+' vByte</b>. Geser ke kanan untuk melihat apa yang terjadi kalau dananya tersebar di banyak UTXO kecil.'
        : 'Dengan <b>'+nIn+' input</b>, ukurannya jadi sekitar <b>'+vb+' vByte</b>, atau <b>'+(vb/141).toFixed(1)+'x</b> lebih besar dari transaksi paling sederhana. Fee-nya ikut naik sebesar itu juga, dan perhatikan bahwa <b>jumlah BTC yang dikirim sama sekali tidak berpengaruh</b>. Yang dibayar adalah ruang block, bukan nilai.';
    }
    const totalUsd=(totalSat/100000000*BTC_PRICE).toFixed(2);

    const rv=g('b09-s95-rate');
    if(rv){rv.textContent=d.rate;rv.style.color=d.cls==='s95-good'?'#0F6E56':d.cls==='s95-warn'?'#854F0B':'#A32D2D';}

    const eta=g('b09-s95-eta');
    if(eta){eta.textContent=d.eta;eta.className='b09-s95-result-v '+d.cls;}

    const tot=g('b09-s95-total');
    if(tot) tot.textContent=`${totalSat.toLocaleString()} sat (~$${totalUsd})`;

    const conf=g('b09-s95-conf');
    const confCls=d.conf==='Tinggi'||d.conf==='Sangat tinggi'?'s95-good':d.conf==='Sedang'?'s95-warn':'s95-bad';
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
      subtitle:'Kondisi normal — transaksi mengalir lancar',
      headCls:'quiet-head', txCount:'~2,400 tx', mpSize:'~4 MB',
      txCls:'s94-good', mpCls:'s94-good',
      bars:[
        {label:'Next block',val:2,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~3 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~6 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~1 hari',   val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
      ],
      barVals:['2 sat/vB','1 sat/vB','1 sat/vB','1 sat/vB'],
      chartData:[8,12,15,10,8,14,18,12,8,10,6,8],
      chartColor:'#0F6E56',
      note:'Mempool sepi. Fee rendah sudah cukup untuk konfirmasi cepat. Ini saat terbaik untuk mengirim transaksi non-urgent.',
      noteCls:'quiet-note',
      stratHead:'Kondisi sepi: apa yang perlu dilakukan?',
      stratItems:[
        {icon:'✓',text:'Kirim transaksi dengan fee rate 1-3 sat/vB — cukup untuk konfirmasi cepat'},
        {icon:'✓',text:'Waktu terbaik untuk konsolidasi UTXO kecil yang biasanya mahal'},
        {icon:'✓',text:'Buka Lightning channel dengan fee lebih murah dari biasanya'},
        {icon:'ℹ',text:'Tidak perlu terburu-buru — mempool sepi biasanya bertahan beberapa jam'},
      ],
    },
    busy:{
      subtitle:'Kondisi padat — fee melonjak, antrian panjang',
      headCls:'busy-head', txCount:'~180,000 tx', mpSize:'~350 MB',
      txCls:'s94-bad', mpCls:'s94-bad',
      bars:[
        {label:'Next block',val:180,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~3 block',  val:120,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~6 block',  val:80, max:200,cls:'s94-warn',color:'#854F0B'},
        {label:'~1 hari',   val:30, max:200,cls:'s94-warn',color:'#854F0B'},
      ],
      barVals:['180 sat/vB','120 sat/vB','80 sat/vB','30 sat/vB'],
      chartData:[20,45,90,140,180,200,185,175,160,145,130,115],
      chartColor:'#A32D2D',
      note:'Mempool sangat ramai. Fee rendah bisa stuck berhari-hari. Pertimbangkan untuk menunggu kondisi mempool lebih sepi sebelum kirim transaksi.',
      noteCls:'busy-note',
      stratHead:'Kondisi ramai: strategi yang bisa dilakukan',
      stratItems:[
        {icon:'⏳',text:'Tunggu dulu jika tidak urgent — mempool ramai biasanya mereda dalam beberapa hari'},
        {icon:'⬆',text:'Kalau sudah terlanjur kirim dengan fee rendah, gunakan RBF untuk menaikkan fee'},
        {icon:'👶',text:'Kalau kamu penerima dan parent stuck, buat child tx dengan fee tinggi (CPFP)'},
        {icon:'📊',text:'Pantau mempool.space untuk tahu kapan kondisi mulai mereda'},
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
      txs.push({id:'tx_a1b2c3d4 (baru)',tier:'high',rate:35,isNew:true});
    } else {
      txs.push({id:'tx_a1b2c3d4',tier:'low',rate:2,isStuck:true});
    }
    txs.sort((a,b)=>b.rate-a.rate);
    q.innerHTML=txs.map((tx,i)=>{
      const tierCls=tx.isNew?'new-tx':tx.isStuck?'stuck':tx.tier;
      const barCls=tx.isNew?'high':tx.isStuck?'red':tx.tier;
      const feeCls=tx.isNew?'high':tx.isStuck?'bad':tx.tier;
      const badge=tx.isNew?'<span class="b09-s93-tx-badge new">RBF baru</span>':tx.isStuck?'<span class="b09-s93-tx-badge stuck">stuck</span>':'';
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
      if(dh) dh.textContent='Transaksi kamu (RBF berhasil)';
      if(st){st.textContent='Posisi prioritas tinggi';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent='RBF berhasil! Transaksi lama diganti dengan yang baru (fee rate 35 sat/vB). Posisi di mempool naik dari bawah ke atas. Miner akan memilih transaksi ini di block berikutnya.';nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(dh) dh.textContent='Transaksi kamu (stuck)';
      if(st){st.textContent='Stuck di mempool';st.className='b09-s93-dv s93-bad';}
      if(nt){nt.textContent='Transaksi dengan fee rate 2 sat/vB akan menunggu sangat lama. RBF memungkinkan kamu mengirim ulang transaksi yang sama dengan fee lebih tinggi, menggantikan yang lama di mempool.';nt.className='b09-s93-note s93-note-info';}
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
      const badge=tx.isPkg?'<span class="b09-s93-tx-badge pkg">paket CPFP</span>':tx.isParent?'<span class="b09-s93-tx-badge parent">parent stuck</span>':'';
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
      if(st){st.textContent='Paket siap — miner akan ambil keduanya';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent=`Child tx dibuat dengan fee rate ${CHLD_RATE} sat/vB. Fee rate gabungan paket (parent+child) menjadi ${pr} sat/vB. Miner HARUS memasukkan parent terlebih dahulu untuk bisa mengambil fee child. Keduanya masuk block bersama.`;nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(cr){cr.textContent='belum dibuat';cr.className='b09-s93-dv s93-warn';}
      if(pkg){pkg.textContent='menunggu child...';pkg.className='b09-s93-dv s93-warn';}
      if(st){st.textContent='Belum ada child tx';st.className='b09-s93-dv s93-warn';}
      if(nt){nt.textContent='Parent tx fee-nya terlalu rendah (2 sat/vB). Karena kamu sudah menerima output-nya, kamu bisa buat child tx dengan fee tinggi. Miner yang ingin ambil fee child HARUS memasukkan parent dulu.';nt.className='b09-s93-note s93-note-info';}
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
    if(rate>=30) return {cls:'good',pri:'Tinggi',eta:'Block berikutnya',noteCls:'s92-note-good',note:`Fee rate ${rate} sat/vB termasuk tinggi. Kemungkinan besar masuk block berikutnya bahkan saat mempool ramai.`};
    if(rate>=10) return {cls:'',pri:'Sedang',eta:'2-3 block (~20-30 menit)',noteCls:'s92-note-info',note:`Fee rate ${rate} sat/vB termasuk sedang. Akan dikonfirmasi dalam beberapa block saat kondisi mempool normal.`};
    if(rate>=3)  return {cls:'warn',pri:'Rendah',eta:'Bisa lebih dari 1 jam',noteCls:'s92-note-warn',note:`Fee rate ${rate} sat/vB termasuk rendah. Mungkin menunggu beberapa block, terutama saat mempool ramai.`};
    return {cls:'bad',pri:'Sangat rendah',eta:'Bisa berminggu-minggu',noteCls:'s92-note-bad',note:`Fee rate ${rate} sat/vB sangat rendah. Transaksi bisa terdiam lama di mempool dan mungkin di-drop setelah 2 minggu.`};
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
    if(note) note.textContent=`Dengan fee ${fee.toLocaleString()} sat yang sama, SegWit punya fee rate ${swRate} sat/vB vs Legacy ${legRate} sat/vB. SegWit ${saving}% lebih kecil sehingga lebih kompetitif di mempool.`;
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
      el.innerHTML='<div class="b09-s91-empty">Belum ada transaksi</div>';
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
      el.innerHTML='<div class="b09-s91-empty">Belum ada transaksi terpilih</div>';
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
    if(note){note.textContent='Transaksi masuk ke mempool, diurutkan dari fee rate tertinggi. Sekarang coba langkah 2: tambang block.';note.className='b09-s91-note idle-note';}
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
      note.textContent=`Block ditambang! ${picked.length} transaksi dipilih dari fee tertinggi. Total fee: ${totalFee} sat. Fee rate rata-rata: ${avgFee} sat/vB. Sisa ${mempool.length} transaksi masih menunggu di mempool.`;
      note.className='b09-s91-note done-note';
    }
  });

  const resetBtn=g('b09-s91-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    mempool=[]; blockTxs=[]; txCounter=0;
    renderPool(); renderBlock();
    const note=g('b09-s91-note');
    if(note){note.textContent='Mulai dari langkah 1: tambah transaksi ke mempool, lalu langkah 2: tambang block untuk melihat bagaimana miner memilih transaksi berdasarkan fee tertinggi.';note.className='b09-s91-note idle-note';}
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
    el.innerHTML=`<div class="b10-s105-node-circle tx-node">TX</div><div class="b10-s105-node-label">transaksi</div>`;
    gr.appendChild(el);
  }

  const sendBtn=g('b10-s105-send');
  if(sendBtn) sendBtn.addEventListener('click',async()=>{
    if(sent) return;
    sent=true; sendBtn.disabled=true;
    const note=g('b10-s105-note1');
    if(note){note.textContent='Transaksi dikirim! UTXO A dan B digunakan sebagai input bersama...';note.className='b10-s105-note s105-info';}

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
      note.textContent='Analis mendeteksi: UTXO A dan B digunakan bersama sebagai input. Heuristik common input ownership: keduanya kemungkinan besar milik orang yang sama. Analis menandai keduanya sebagai satu entitas.';
      note.className='b10-s105-note s105-warn';
    }
  });

  const rst1=g('b10-s105-rst1');
  if(rst1) rst1.addEventListener('click',()=>{
    sent=false; initGraph();
    if(sendBtn) sendBtn.disabled=false;
    const note=g('b10-s105-note1');
    if(note){note.textContent='UTXO A dan B belum diketahui hubungannya. Begitu digunakan bersama dalam satu transaksi, analis blockchain akan langsung menghubungkan keduanya.';note.className='b10-s105-note s105-idle';}
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
    {label:'2023',val:120},{label:'2024',val:180},{label:'Skrg',val:180,current:true},
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
    if(note){note.textContent='Memilih UTXO kecil dan dust untuk dikonsolidasi...';note.className='b10-s104-note s104-run';}

    const toConsolidate=utxos.filter(u=>u.cls==='small'||u.cls==='dust');
    toConsolidate.forEach(u=>u.consolidating=true);
    renderSet(); await wait(800);

    const mergedVal=toConsolidate.reduce((s,u)=>s+u.val,0);
    const fee=0.00015;
    const netVal=Math.max(0,mergedVal-fee);

    if(note) note.textContent=`Menggabungkan ${toConsolidate.length} UTXO menjadi 1 UTXO baru...`;
    await wait(700);

    utxos=utxos.filter(u=>u.cls!=='small'&&u.cls!=='dust');
    utxos.push({id:'MERGED',val:netVal,cls:'medium',merged:true});
    renderSet(); updateStats(); renderChart(true);

    if(note){
      note.textContent=`Konsolidasi selesai! ${toConsolidate.length} UTXO digabung menjadi 1 UTXO (${netVal.toFixed(5)} BTC, setelah fee ${fee} BTC). UTXO set berkurang dari 20 menjadi ${utxos.length}.`;
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
    if(note){note.textContent='UTXO kecil dan dust menambah beban pada setiap full node. Klik "Konsolidasi UTXO Kecil" untuk menggabungkan UTXO kecil menjadi satu saat fee sedang rendah.';note.className='b10-s104-note s104-idle';}
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
    {label:'Cek UTXO #1 di set',sub:'u_A1 (1.500 BTC) — ada di UTXO set?',inpId:'b10-s103-inp1a',
     passMsg:'u_A1 ditemukan di UTXO set. Ada dan belum dihabiskan.'},
    {label:'Cek UTXO #2 di set',sub:'u_B1 (0.750 BTC) — ada di UTXO set?',inpId:'b10-s103-inp1b',
     passMsg:'u_B1 ditemukan di UTXO set. Ada dan belum dihabiskan.'},
    {label:'Verifikasi nilai',sub:'Total input (2.250) >= total output + fee (2.250)?',inpId:null,
     passMsg:'Input 2.250 BTC = Output 2.235 BTC + Fee 0.015 BTC. Nilai balance.'},
    {label:'Verifikasi script',sub:'Script unlocking memenuhi script locking u_A1 dan u_B1?',inpId:null,
     passMsg:'Tanda tangan kriptografis valid. Alice berhak membelanjakan kedua UTXO ini.'},
  ];

  const STEPS2=[
    {label:'Cek UTXO #1 di set',sub:'u_A1 (1.500 BTC) — ada di UTXO set?',inpId:'b10-s103-inp2a',
     failMsg:'u_A1 TIDAK ada di UTXO set. Sudah dikonsumsi oleh tx_f1a2b3c4. Double spend terdeteksi!'},
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
    const b=g('b10-s103-badge1'); if(b){b.textContent='menunggu verifikasi';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note1'); if(n){n.textContent='Klik "Verifikasi Transaksi" untuk melihat bagaimana node memeriksa transaksi ini step by step menggunakan UTXO set.';n.className='b10-s103-note s103-idle';}
    const rb=g('b10-s103-run1'); if(rb) rb.disabled=false;
  }

  function initP2(){
    const st=g('b10-s103-steps2'); if(st) st.innerHTML=makeSteps(STEPS2,'b10-s103-s2');
    ['b10-s103-inp2a','b10-s103-inp2b'].forEach(id=>{const el=g(id);if(el) el.className='b10-s103-tx-item s103-inp';});
    const b=g('b10-s103-badge2'); if(b){b.textContent='menunggu verifikasi';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note2'); if(n){n.textContent='Klik "Verifikasi Transaksi" untuk melihat bagaimana node mendeteksi double spend saat u_A1 sudah tidak ada di UTXO set.';n.className='b10-s103-note s103-idle';}
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
      if(note){note.textContent=`Memeriksa: ${s.label}...`;note.className='b10-s103-note s103-run';}
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-checking';}
      await wait(700);
      el.className='b10-s103-step s103-pass';
      el.querySelector('.b10-s103-step-icon').textContent='✓';
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-ok';}
      if(note){note.textContent=s.passMsg;note.className='b10-s103-note s103-run';}
      await wait(600);
    }
    const b=g('b10-s103-badge1'); if(b){b.textContent='transaksi valid';b.className='b10-s103-tx-badge s103-valid';}
    if(note){note.textContent='Semua pemeriksaan lulus! Transaksi diterima ke mempool dan akan diteruskan ke peer lain.';note.className='b10-s103-note s103-pass';}
    busy1=false;
  }

  async function runP2(){
    busy2=true;
    const rb=g('b10-s103-run2'); if(rb) rb.disabled=true;
    const note=g('b10-s103-note2');
    const s=STEPS2[0];
    const el=g('b10-s103-s2-0'); if(!el) return;
    el.className='b10-s103-step s103-active';
    if(note){note.textContent=`Memeriksa: ${s.label}...`;note.className='b10-s103-note s103-run';}
    const inp=g(s.inpId); if(inp) inp.className='b10-s103-tx-item s103-inp-checking';
    await wait(800);
    el.className='b10-s103-step s103-fail';
    el.querySelector('.b10-s103-step-icon').textContent='✗';
    if(inp) inp.className='b10-s103-tx-item s103-inp-fail';
    const b=g('b10-s103-badge2'); if(b){b.textContent='ditolak';b.className='b10-s103-tx-badge s103-invalid';}
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
     desc:'Coinbase: miner mendapat 3.125 BTC reward + 0.127 BTC total fee dari semua transaksi.'},
    {id:'tx_f1a2b3',label:'Tx #1',type:'normal',rm:['A1','A2'],
     add:[{id:'u_X1',val:'2.700',key:'X1',cls:'new-u'},{id:'u_X2',val:'0.185',key:'X2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #1: u_A1 + u_A2 dikonsumsi (2.900 BTC). Dibuat u_X1 (2.700) + u_X2 (0.185). Fee: 0.015 BTC.'},
    {id:'tx_c4d5e6',label:'Tx #2',type:'normal',rm:['B1','C1'],
     add:[{id:'u_Y1',val:'2.100',key:'Y1',cls:'new-u'},{id:'u_Y2',val:'0.035',key:'Y2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #2: u_B1 + u_C1 dikonsumsi (2.150 BTC). Dibuat u_Y1 (2.100) + u_Y2 (0.035). Fee: 0.015 BTC.'},
    {id:'tx_g7h8i9',label:'Tx #3',type:'normal',rm:['D1'],
     add:[{id:'u_Z1',val:'0.870',key:'Z1',cls:'new-u'}],ops:'-1 +1',
     desc:'Tx #3: u_D1 dikonsumsi (0.900 BTC). Dibuat u_Z1 (0.870 BTC). Fee: 0.030 BTC.'},
  ];

  let utxos=[...INIT.map(u=>({...u,cls:'alive'}))];
  let logs=[], busy=false, doneCount=0, activeIdx=-1;

  function renderBlock(){
    const el=g('b10-s102-blk'); if(!el) return;
    el.innerHTML=TXS.map((tx,i)=>{
      const state=i<doneCount?'done':i===activeIdx?'active':'idle';
      const badge=i<doneCount?'done':tx.type==='coinbase'?'coinbase':'normal';
      const bTxt=i<doneCount?'selesai':tx.type==='coinbase'?'coinbase':'normal';
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
    const d=g('b10-s102-dlt'); if(d) d.textContent=`Perubahan: ${delta>=0?'+':''}${delta} UTXO`;
    const a=g('b10-s102-aft'); if(a) a.textContent=`Sesudah: ${after} UTXO`;
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
        logs.push({cls:'rm',txt:`⊖ Hapus: ${rmIds}`});
        renderLog();
        await wait(700);
      }

      utxos=utxos.filter(u=>!tx.rm.includes(u.key));
      totalRm+=tx.rm.length;
      tx.add.forEach(a=>{utxos.push({...a});totalAdd++;});
      renderSet();
      const logCls=tx.type==='coinbase'?'cb':'add';
      logs.push({cls:logCls,txt:`⊕ Tambah: ${tx.add.map(a=>a.id+' ('+a.val+' BTC)').join(', ')}`});
      renderLog();
      updateStats(totalRm,totalAdd);
      await wait(600);

      doneCount=i+1; activeIdx=-1; renderBlock();
    }

    if(note){
      note.textContent=`Block #840,512 selesai! ${totalRm} UTXO dihapus, ${totalAdd} UTXO ditambah. Total UTXO set: ${utxos.length}.`;
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
    const bef=g('b10-s102-bef'); if(bef) bef.textContent='Sebelum: 12 UTXO';
    const aft=g('b10-s102-aft'); if(aft) aft.textContent='Sesudah: 12 UTXO';
    const dlt=g('b10-s102-dlt'); if(dlt) dlt.textContent='Perubahan: -';
    const rb=g('b10-s102-run'); if(rb) rb.disabled=false;
    const note=g('b10-s102-note');
    if(note){note.textContent='Klik "Proses Block" untuk melihat bagaimana setiap transaksi dalam block memperbarui UTXO set secara berurutan, dimulai dari coinbase transaction.';note.className='b10-s102-note idle-note';}
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
    {id:'utxo_a3',val:'0.585',owner:'Alice (kembalian)',key:'a3',isNew:true},
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
        ${u.isNew?'<div class="b10-s101-utxo-badge new">baru</div>':''}`;
      grid.appendChild(el);
    });
  }

  function updateStats(){
    const cnt=g('b10-s101-count'); if(cnt) cnt.textContent=`UTXO: ${utxos.length} output`;
    const sz=g('b10-s101-size');   if(sz)  sz.textContent=`Total: ${totalBTC(utxos)} BTC`;
  }

  function runTx(){
    txState='animating';
    const sendBtn=g('b10-s101-send'); if(sendBtn) sendBtn.disabled=true;
    const tx=g('b10-s101-tx'); if(tx) tx.style.display='block';
    const note=g('b10-s101-note');
    if(note){note.textContent='Transaksi masuk! Alice menggunakan 2 UTXO-nya sebagai input...';note.className='b10-s101-note active-note';}

    setTimeout(()=>{
      ['a1','a2'].forEach(k=>{
        const el=g('b10-utxo-'+k);
        if(el) el.className='b10-s101-utxo consuming';
      });
      if(note) note.textContent='UTXO input ditandai sebagai consumed — tidak bisa digunakan lagi...';
    },500);

    setTimeout(()=>{
      utxos=utxos.filter(u=>u.key!=='a1'&&u.key!=='a2');
      utxos.push(...NEW_UTXOS);
      renderGrid(); updateStats();
      if(note){note.textContent='UTXO lama dihapus dari set. UTXO baru dibuat: Bob mendapat 1.200 BTC, Alice mendapat kembalian 0.585 BTC.';note.className='b10-s101-note done-note';}
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
    if(note){note.textContent='Klik "Kirim Transaksi" untuk melihat bagaimana UTXO dikonsumsi dan UTXO baru dibuat. UTXO set selalu mencerminkan state terkini kepemilikan bitcoin.';note.className='b10-s101-note idle-note';}
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
    {name:'Lainnya',pct:23,color:'#52524C'},
  ];

  const GEO=[
    {flag:'🇺🇸',name:'Amerika Serikat',pct:38,color:'#534AB7'},
    {flag:'🇰🇿',name:'Kazakhstan',pct:14,color:'#854F0B'},
    {flag:'🇷🇺',name:'Rusia',pct:11,color:'#A32D2D'},
    {flag:'🇨🇦',name:'Kanada',pct:7,color:'#0F6E56'},
    {flag:'🇩🇪',name:'Jerman',pct:5,color:'#5DCAA5'},
    {flag:'🇨🇳',name:'China (estimasi)',pct:4,color:'#52524C'},
    {flag:'🌍',name:'Lainnya',pct:21,color:'#3A3A35'},
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
    ctx.fillText('distribusi',cx,cy+8);
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
    ctx.fillText('terbarukan',cx,cy+8);
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
      if(profit>1){note.textContent=`Profitable! Dengan harga BTC $${btcPrice.toLocaleString()} dan listrik $${elecPrice}/kWh, estimasi profit $${profit.toFixed(2)} per hari. Break-even price di $${breakeven.toLocaleString()}.`;note.className='b11-s114-note s114-profit';}
      else if(profit<-1){note.textContent=`Rugi. Biaya listrik ($${elecCost.toFixed(2)}/hari) melebihi pendapatan ($${incUSD.toFixed(2)}/hari). Butuh harga BTC minimal $${breakeven.toLocaleString()} untuk break-even.`;note.className='b11-s114-note s114-loss';}
      else{note.textContent='Hampir break-even. Pendapatan dan biaya hampir seimbang. Sedikit perubahan harga BTC atau biaya listrik bisa membalik situasi.';note.className='b11-s114-note s114-breakeven';}
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
        note.textContent=`Block ${b+1}/${BLOCKS}: ${soloWin?'Solo miner menemukan block! +'+REWARD+' BTC':'Solo miner tidak menemukan block (0 BTC)'}. Pool memberikan ${poolReward} BTC.`;
        note.className='b11-s113-note s113-run';
      }
      await new Promise(r=>setTimeout(r,300));
    }

    const soloTotal=soloData.reduce((a,b)=>a+b,0);
    const poolTotal=poolData.reduce((a,b)=>a+b,0);
    const soloBlocks=soloData.filter(v=>v>0).length;
    if(note){
      note.textContent=`Simulasi selesai! Solo: ${soloBlocks} block ditemukan, total ${soloTotal.toFixed(4)} BTC. Pool: ${BLOCKS} kali menerima reward, total ${poolTotal.toFixed(4)} BTC. Total pendapatan jangka panjang hampir sama, tapi pool jauh lebih predictable.`;
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
    if(note){note.textContent='Kamu punya 1% dari hash rate jaringan. Sebagai solo miner, probabilitas menemukan block sangat rendah. Bergabung ke pool memastikan pendapatan kecil tapi konsisten setiap block.';note.className='b11-s113-note s113-idle';}
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
     hashrate:'~10 MH/s',efficiency:'~0.002 MH/W',cost:'Laptop biasa',color:'#52524C',
     desc:'Di awal Bitcoin, semua mining dilakukan dengan CPU laptop atau desktop. Satoshi sendiri mining dengan CPU. Hash rate seluruh jaringan sangat rendah — siapapun bisa mining block dalam hitungan menit. Tidak ada persaingan berarti.'},
    {icon:'🎮',name:'GPU Mining',period:'2010-2013',
     hashrate:'~500 MH/s',efficiency:'~0.3 MH/W',cost:'Kartu grafis gaming',color:'#854F0B',
     desc:'GPU bisa melakukan ribuan operasi paralel sekaligus, jauh lebih cocok untuk SHA-256 dibanding CPU. Hash rate melonjak 50x lipat. CPU mining praktis tidak lagi menguntungkan. Banyak miner membangun rig dengan banyak GPU sekaligus.'},
    {icon:'🔧',name:'FPGA Mining',period:'2011-2013',
     hashrate:'~1 GH/s',efficiency:'~1.5 MH/W',cost:'Chip programmable khusus',color:'#534AB7',
     desc:'FPGA bisa diprogram khusus untuk SHA-256, lebih efisien dari GPU. Tapi era ini singkat karena ASIC yang jauh lebih efisien segera hadir. FPGA menjadi jembatan antara GPU dan ASIC.'},
    {icon:'⚡',name:'ASIC Mining',period:'2013-sekarang',
     hashrate:'200+ TH/s',efficiency:'~57 TH/W',cost:'Mesin industri khusus',color:'#0F6E56',
     desc:'ASIC dirancang dari nol hanya untuk SHA-256. Tidak bisa digunakan untuk hal lain. Hasilnya: efisiensi yang jauh melampaui semua teknologi sebelumnya. ASIC modern mencapai 200+ TH/s. Mining kini didominasi perusahaan besar dengan fasilitas industri.'},
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
      icon:'👤',title:'Pengguna Kasual',sub:'Privasi dasar, tidak mau ribet',
      threatLabel:'Level ancaman: rendah hingga sedang',threatPct:25,threatColor:'#0F6E56',
      recs:[
        {level:'must',badge:'Wajib',text:'Gunakan HD wallet — address baru otomatis tiap transaksi. Hampir semua wallet modern sudah melakukan ini.'},
        {level:'must',badge:'Wajib',text:'Jangan posting address Bitcoin di media sosial publik yang terhubung ke identitas aslimu.'},
        {level:'should',badge:'Disarankan',text:'Gunakan Lightning untuk pembayaran kecil sehari-hari — lebih privat dari on-chain.'},
        {level:'nice',badge:'Opsional',text:'Pisahkan UTXO dari exchange (KYC) dan UTXO dari sumber lain — jangan gabungkan dalam satu transaksi.'},
      ],
      avoids:['Menggunakan address yang sama lebih dari sekali','Memposting screenshot transaksi ke publik'],
    },
    {
      icon:'🏪',title:'Pedagang / Merchant',sub:'Menerima pembayaran dari banyak pelanggan',
      threatLabel:'Level ancaman: sedang — pelanggan bisa melihat saldo toko',threatPct:50,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Wajib',text:'Gunakan BTCPay Server atau wallet yang mendukung Payjoin — sembunyikan pola penerimaan dari pelanggan.'},
        {level:'must',badge:'Wajib',text:'Generate address baru untuk setiap invoice — jangan pakai satu address untuk semua pelanggan.'},
        {level:'should',badge:'Disarankan',text:'Terima pembayaran Lightning via BOLT 12 Offers — lebih privat dari invoice biasa yang bisa dikaitkan.'},
        {level:'should',badge:'Disarankan',text:'Pisahkan wallet operasional dari wallet penyimpanan jangka panjang.'},
        {level:'nice',badge:'Opsional',text:'Lakukan UTXO consolidation saat fee rendah, tapi hati-hati dengan implikasi privasi dari penggabungan UTXO.'},
      ],
      avoids:['Menggunakan satu address untuk semua pelanggan','Memposting saldo wallet secara publik','Menggabungkan UTXO dari pelanggan berbeda tanpa pertimbangan'],
    },
    {
      icon:'📈',title:'Investor Jangka Panjang',sub:'Menyimpan Bitcoin dalam jumlah signifikan',
      threatLabel:'Level ancaman: sedang hingga tinggi — target pencurian atau pemerasan',threatPct:65,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Wajib',text:'Jangan pernah ungkapkan berapa banyak Bitcoin yang kamu miliki kepada siapapun yang tidak perlu tahu.'},
        {level:'must',badge:'Wajib',text:'Gunakan hardware wallet terpisah dari aktivitas sehari-hari — cold storage untuk hodling jangka panjang.'},
        {level:'must',badge:'Wajib',text:'Beli Bitcoin dari sumber berbeda untuk menghindari profil pembelian yang mudah dilacak.'},
        {level:'should',badge:'Disarankan',text:'Pertimbangkan CoinJoin sebelum memindahkan ke cold storage — pisahkan riwayat on-chain dari identitasmu.'},
        {level:'nice',badge:'Opsional',text:'Gunakan node Bitcoin sendiri saat bertransaksi — jangan bergantung pada node publik yang bisa memantau IP-mu.'},
      ],
      avoids:['Memamerkan kepemilikan Bitcoin di publik','Menyimpan semua Bitcoin di satu wallet','Menggunakan exchange yang tidak perlu untuk setiap transaksi'],
    },
    {
      icon:'🛡️',title:'Privasi Tinggi',sub:'Butuh perlindungan kuat dari pengawasan',
      threatLabel:'Level ancaman: tinggi — pengawasan negara atau aktor berbahaya',threatPct:90,threatColor:'#A32D2D',
      recs:[
        {level:'must',badge:'Wajib',text:'Dapatkan Bitcoin tanpa KYC — peer-to-peer exchange, mining, atau layanan yang tidak meminta identitas.'},
        {level:'must',badge:'Wajib',text:'Jalankan full node Bitcoin sendiri dan hanya broadcast transaksi melalui node sendiri atau via Tor.'},
        {level:'must',badge:'Wajib',text:'Gunakan CoinJoin sebelum setiap pengeluaran signifikan — putus rantai pelacakan on-chain.'},
        {level:'must',badge:'Wajib',text:'Gunakan Silent Payments atau BOLT 12 untuk menerima pembayaran tanpa mengekspos address.'},
        {level:'should',badge:'Disarankan',text:'Pisahkan identitas digital yang berbeda secara ketat — jangan campur wallet yang berbeda tujuan.'},
      ],
      avoids:['KYC di exchange manapun jika bisa dihindari','Menggunakan wallet yang terhubung ke server pihak ketiga','Bertransaksi dengan IP asli tanpa Tor atau VPN','Menggabungkan UTXO dari sumber berbeda'],
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
          <div class="b12-s126-recs-label">Rekomendasi:</div>
          ${p.recs.map(r=>`
            <div class="b12-s126-rec ${r.level}">
              <span class="b12-s126-rec-badge">${r.badge}</span>
              <div class="b12-s126-rec-text">${r.text}</div>
            </div>`).join('')}
        </div>
        <div class="b12-s126-avoid">
          <div class="b12-s126-avoid-label">Hindari:</div>
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
      if(note) note.textContent=`Pembayaran #${i+1} dikirim... On-chain: terlihat publik. Lightning: tersembunyi dalam channel.`;
      if(note) note.className='b12-s125-note s125-run';
      await wait(400);
    }

    await wait(300);
    const lnC=g('b12-s125-ln-close'); if(lnC) lnC.classList.add('visible');
    await wait(300);
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='grid';
    if(note){note.textContent='Selesai! On-chain: 10 transaksi terlihat publik. Lightning: hanya channel open dan close yang tercatat di blockchain, 10 pembayaran di dalamnya tidak terlihat sama sekali.';note.className='b12-s125-note s125-done';}
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
    if(note){note.textContent='Klik "Simulasikan 10 Pembayaran" untuk melihat perbedaan visibilitas antara pembayaran on-chain dan Lightning.';note.className='b12-s125-note s125-idle';}
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

    if(note){note.textContent='Alice menghitung address unik dari alamat statis menggunakan kunci publiknya...';note.className='b12-s124-note s124-run';}
    await wait(700);
    const ra=g('b12-s124-res-alice'); if(ra) ra.classList.add('show');

    if(note) note.textContent='Bob menghitung address unik yang berbeda dari kunci publik yang sama...';
    await wait(700);
    const rb2=g('b12-s124-res-bob'); if(rb2) rb2.classList.add('show');

    if(note) note.textContent='Carol menghasilkan address unik ketiga, semua berbeda walau tujuannya sama...';
    await wait(700);
    const rc=g('b12-s124-res-carol'); if(rc) rc.classList.add('show');

    await wait(500);
    if(note) note.textContent='Ketiga transaksi masuk ke blockchain. Analis melihat tiga address berbeda...';
    const bc=g('b12-s124-blockchain'); if(bc) bc.classList.add('show');
    await wait(400);
    ['b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*300);
    });
    await wait(1200);
    const ln=g('b12-s124-link-note'); if(ln) ln.classList.add('show');
    await wait(600);

    if(note) note.textContent='Penerima men-scan blockchain dengan kunci privatnya untuk menemukan pembayaran...';
    const sc=g('b12-s124-scan'); if(sc) sc.classList.add('show');
    await wait(400);
    ['b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*400);
    });
    await wait(1400);

    if(note){note.textContent='Selesai! Tiga pengirim, satu alamat statis, tiga address on-chain yang tidak bisa dihubungkan. Hanya penerima yang tahu ketiganya adalah miliknya.';note.className='b12-s124-note s124-done';}
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
    if(note){note.textContent='Klik "Simulasikan Pengiriman" untuk melihat bagaimana tiga pengirim yang berbeda menghasilkan address on-chain yang berbeda-beda dari satu alamat statis yang sama.';note.className='b12-s124-note s124-idle';}
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
    if(note){note.textContent='Payjoin terlihat identik dengan transaksi biasa dari luar. Analis tidak bisa membedakan keduanya hanya dari melihat blockchain, itulah yang membuatnya lebih kuat dari CoinJoin yang polanya bisa dikenali.';note.className='b12-s123-note s123-info';}
  });

  const rstBtn=g('b12-s123-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    applied=false;
    ['b12-s123-a-normal','b12-s123-a-payjoin'].forEach(id=>{const el=g(id);if(el) el.style.display='none';});
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='none';
    const note=g('b12-s123-note');
    if(note){note.textContent='Klik "Terapkan Heuristik Common Input" untuk melihat mengapa analis mendapat kesimpulan yang berbeda dari dua transaksi yang terlihat hampir sama.';note.className='b12-s123-note s123-idle';}
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
        {id:'C1',label:'Kembalian\n0.08 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'A1',to:'TX',color:'rgba(83,74,183,0.5)'},{from:'A2',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'B1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'C1',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['A1','A2'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristik terdeteksi',text:'A1 dan A2 digunakan bersama sebagai input dalam satu transaksi.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Dengan sangat tinggi kemungkinan, A1 dan A2 dimiliki oleh orang yang sama. Analis menggabungkan keduanya sebagai satu entitas.'},
        {icon:'📊',label:'Dampak privasi',text:'Kalau salah satu address pernah teridentifikasi misalnya dari exchange, address lainnya juga ikut teridentifikasi.'},
      ],
      note:'Common Input Ownership adalah heuristik paling kuat dalam analisis blockchain. Menggunakannya berarti kamu secara tidak sengaja mengkonfirmasi bahwa semua UTXO yang kamu gabungkan adalah milikmu.',
    },
    2:{
      nodes:[
        {id:'S1',label:'Pengirim\n1.0 BTC',x:0.10,y:0.42,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'R1',label:'Penerima\n0.9 BTC',x:0.75,y:0.20,cls:'addr'},
        {id:'CH',label:'Kembalian\n0.09 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'S1',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'R1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'CH',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['CH'],linked:['S1'],
      findings:[
        {icon:'🔍',label:'Heuristik terdeteksi',text:'Output 0.9 BTC adalah angka bulat, kemungkinan adalah pembayaran yang disengaja. Output 0.09 BTC adalah angka tidak bulat, kemungkinan adalah kembalian.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Output 0.09 BTC kemungkinan besar dikembalikan ke pengirim. Analis menandai address kembalian sebagai milik pengirim yang sama.'},
        {icon:'📊',label:'Dampak privasi',text:'Saldo sebenarnya pengirim bisa diestimasi. Transaksi berikutnya dari address kembalian akan terus terlacak.'},
      ],
      note:'Change output detection bekerja karena pola nilai yang bisa ditebak. Salah satu cara mitigasi adalah menggunakan CoinJoin yang menyamakan nilai output sehingga analis tidak bisa membedakan mana pembayaran dan mana kembalian.',
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
        {icon:'🔍',label:'Heuristik terdeteksi',text:'Address X muncul dalam 4 transaksi berbeda sebagai penerima maupun pengirim.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Semua transaksi yang melibatkan Address X terhubung. Total saldo masuk dan keluar bisa dihitung secara akurat.'},
        {icon:'📊',label:'Dampak privasi',text:'Kalau salah satu dari 4 transaksi ini bisa dihubungkan ke identitas nyata, seluruh riwayat keuangan address ini terekspos.'},
      ],
      note:'Address reuse adalah kesalahan privasi paling mudah dihindari. Wallet modern (HD wallet) menghasilkan address baru secara otomatis untuk setiap transaksi. Tidak ada alasan untuk menggunakan address yang sama lebih dari sekali.',
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
      sub:'Berbagai implementasi: Bitcoin Core, Bitcoin Knots, dan lainnya',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Pengaruh teknis',pct:80,color:'#534AB7'},
        {name:'Kontrol kode',pct:70,color:'#534AB7'},
        {name:'Veto protokol',pct:30,color:'#534AB7'},
        {name:'Paksa pengguna',pct:10,color:'#534AB7'},
      ],
      strengths:['Menulis dan mereview kode yang dijalankan mayoritas node','Bisa menolak mengimplementasikan perubahan yang tidak disetujui','Reputasi dan kepercayaan komunitas sebagai modal pengaruh'],
      limits:['Tidak bisa memaksa siapapun menjalankan kode mereka','Siapapun bebas fork implementasi dan membuat versi sendiri','Tidak ada implementasi tunggal yang punya otoritas absolut','Komunitas bisa beralih ke implementasi lain kapanpun'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Taproot (2021): developer dari berbagai kontributor merancang dan mereview BIP 340-342 selama hampir 2 tahun. Pengaruh besar, tapi aktivasi tetap butuh sinyal miner dan penerimaan node.',
    },
    miner:{
      icon:'⛏️',name:'Miner',
      sub:'Produksi block, keamanan jaringan, sinyal aktivasi soft fork',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      powers:[
        {name:'Produksi block',pct:100,color:'#854F0B'},
        {name:'Sinyal MASF',pct:90,color:'#854F0B'},
        {name:'Veto soft fork',pct:60,color:'#854F0B'},
        {name:'Paksa hard fork',pct:20,color:'#854F0B'},
      ],
      strengths:['Satu-satunya pihak yang bisa memproduksi block baru','Dalam MASF, sinyal miner yang menentukan kapan soft fork aktif','Bisa menunda aktivasi soft fork dengan tidak mensinyalkan'],
      limits:['Tidak bisa memaksa pengguna menerima bitcoin dari chain tertentu','UASF SegWit 2017 membuktikan miner bisa dipaksa node ekonomi','Block yang ditolak node ekonomi tidak menghasilkan pendapatan nyata','Tidak bisa menciptakan bitcoin baru di luar jadwal halving'],
      exBg:'#FAEEDA',exColor:'#633806',
      example:'SegWit (2017): miner menolak mensinyalkan selama hampir 2 tahun. Tapi ketika BIP 148 UASF mengancam menolak block mereka, miner akhirnya mensinyalkan dalam hitungan minggu.',
    },
    node:{
      icon:'🖥️',name:'Node',
      sub:'Full node independen (rumahan, komunitas) dan node ekonomi (exchange, wallet, bisnis)',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      powers:[
        {name:'Validasi konsensus',pct:100,color:'#0F6E56'},
        {name:'Penegakan aturan',pct:95,color:'#0F6E56'},
        {name:'Tolak soft fork',pct:80,color:'#0F6E56'},
        {name:'Paksa miner ikut',pct:75,color:'#0F6E56'},
      ],
      strengths:['Satu-satunya pihak yang benar-benar memvalidasi dan menegakkan aturan konsensus','Node independen: satu node rumahan punya bobot sama dengan satu exchange dalam validasi','Node ekonomi bisa membuat block miner tidak bernilai dengan menolaknya','Tidak bergantung pada siapapun untuk menjalankan aturan yang mereka yakini benar'],
      limits:['Node independen tidak menghasilkan pendapatan, bergantung pada motivasi ideologis','Pengaruh node independen tidak terlihat sampai terjadi konflik nyata','Butuh koordinasi yang kuat untuk UASF atau URSF berhasil'],
      exBg:'#EAF3DE',exColor:'#0F6E56',
      example:'BIP 148 UASF (2017): ribuan node independen dan node ekonomi mengancam menolak block miner yang tidak mendukung SegWit. Demonstrasi paling nyata bahwa node adalah penjaga aturan konsensus yang sesungguhnya.',
    },
    user:{
      icon:'👤',name:'Pengguna',
      sub:'Individu yang menyimpan, mengirim, dan menerima bitcoin',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Penentuan nilai',pct:90,color:'#534AB7'},
        {name:'Adopsi teknologi',pct:70,color:'#534AB7'},
        {name:'Tekanan langsung',pct:30,color:'#534AB7'},
        {name:'Pengaruh protokol',pct:20,color:'#534AB7'},
      ],
      strengths:['Dalam jangka panjang, pengguna yang menentukan apakah Bitcoin punya nilai','Bisa memilih untuk tidak menggunakan Bitcoin kalau arahnya tidak disukai','Suara pengguna terbentuk lewat diskusi publik, forum, dan media sosial'],
      limits:['Pengaruh individu sangat kecil dan sulit diukur','Tidak punya mekanisme formal untuk mempengaruhi protokol','Terpecah dalam banyak opini yang sering bertentangan'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Scaling debate (2015-2017): pengguna yang frustrasi dengan fee tinggi menciptakan tekanan publik yang signifikan. Tidak langsung mengubah protokol, tapi membentuk narasi yang mempengaruhi semua pihak lain.',
    },
    biz:{
      icon:'🏢',name:'Pelaku Ekonomi dan Bisnis',
      sub:'Exchange, merchant, payment processor, institusi keuangan, dan layanan berbasis Bitcoin',
      headBg:'#F4F4F0',headBorder:'rgba(26,26,24,0.15)',
      powers:[
        {name:'Kekuatan ekonomi',pct:85,color:'#1A1A18'},
        {name:'Adopsi massal',pct:80,color:'#1A1A18'},
        {name:'Veto chain',pct:70,color:'#1A1A18'},
        {name:'Tekanan protokol',pct:60,color:'#1A1A18'},
      ],
      strengths:['Exchange besar bisa menentukan chain mana yang mendapat likuiditas','Merchant yang menerima Bitcoin memperluas adopsi dan memberi nilai nyata','Payment processor bisa memilih implementasi mana yang mereka dukung'],
      limits:['Tidak bisa memaksa perubahan protokol secara langsung','Bergantung pada kepercayaan pengguna — kehilangan kepercayaan berarti kehilangan bisnis','Tunduk pada regulasi yang bisa membatasi pilihan teknis mereka'],
      exBg:'#F4F4F0',exColor:'#1A1A18',
      example:'SegWit2x (2017): lebih dari 80% hash rate dan banyak exchange besar menandatangani New York Agreement untuk hard fork. Tapi ketika developer dan pengguna menolak, mereka akhirnya membatalkan karena takut kehilangan legitimasi.',
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
          <div class="b13-s136-powers-label">Dimensi kekuatan:</div>
          ${d.powers.map(p=>`
            <div class="b13-s136-power-row">
              <div class="b13-s136-power-name">${p.name}</div>
              <div class="b13-s136-power-bg"><div class="b13-s136-power-fill" style="width:${p.pct}%;background:${p.color};"></div></div>
              <div class="b13-s136-power-pct">${p.pct}%</div>
            </div>`).join('')}
        </div>
        <div class="b13-s136-sl">
          <div class="b13-s136-strength">
            <div class="b13-s136-strength-label">Kekuatan</div>
            ${d.strengths.map(s=>`<div class="b13-s136-strength-item">${s}</div>`).join('')}
          </div>
          <div class="b13-s136-limit">
            <div class="b13-s136-limit-label">Keterbatasan</div>
            ${d.limits.map(l=>`<div class="b13-s136-limit-item">${l}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s136-example" style="background:${d.exBg};color:${d.exColor};">
          <strong>Contoh nyata:</strong> ${d.example}
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
        {role:'Developer',action:'Menulis kode, menentukan threshold dan window sinyal',bg:'#F4F4F0'},
        {role:'Miner',action:'Mensinyalkan dukungan via version bits di block header',bg:'#EEEDFE',roleColor:'#534AB7'},
        {role:'Node / Pengguna',action:'Menunggu threshold tercapai, lalu otomatis mengikuti aturan baru',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft siap, parameter ditentukan',bg:'#EEEDFE',fg:'#534AB7'},
        {n:'2',txt:'Miner mensinyalkan via version bits',bg:'#534AB7',fg:'#fff'},
        {n:'3',txt:'95% dari 2016 block tercapai',bg:'#534AB7',fg:'#fff'},
        {n:'4',txt:'Soft fork dikunci, tidak bisa dibatalkan',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'Aturan baru berlaku di seluruh jaringan',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(83,74,183,0.2)',
      pros:['Terukur dan ada kepastian waktu','Miner sudah siap sebelum aktif','Proses gradual dan aman'],
      cons:['Miner punya veto de facto','Bisa disabotase mining pool besar','Tidak mencerminkan keinginan pengguna'],
      exampleBg:'#EEEDFE',exampleColor:'#3C3489',
      example:'Digunakan untuk banyak upgrade awal Bitcoin. BIP 9 mendefinisikan mekanisme version bits yang dipakai MASF modern. Contoh: aktivasi CSV (CheckSequenceVerify) pada 2016.',
    },
    uasf:{
      icon:'👤',name:'UASF',full:'User Activated Soft Fork',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      actors:[
        {role:'Developer',action:'Menulis kode dan menentukan tanggal aktivasi wajib',bg:'#F4F4F0'},
        {role:'Node / Pengguna',action:'Upgrade dan mulai menolak block non-conforming pada tanggal aktivasi',bg:'#EAF3DE',roleColor:'#0F6E56'},
        {role:'Miner',action:'Dipaksa ikut aturan baru atau block mereka ditolak jaringan ekonomi',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft, tanggal aktivasi ditetapkan',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'2',txt:'Node ekonomi mulai upgrade',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'3',txt:'Tanggal aktivasi tiba',bg:'#0F6E56',fg:'#fff'},
        {n:'4',txt:'Block non-conforming ditolak',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'5',txt:'Miner ikut atau kehilangan reward',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(15,110,86,0.2)',
      pros:['Pengguna punya kekuatan nyata','Tidak bisa diblok oleh miner','Mencerminkan kehendak ekonomi jaringan'],
      cons:['Berisiko jika adopsi node rendah','Bisa terjadi split sementara','Membutuhkan koordinasi komunitas kuat'],
      exampleBg:'#EAF3DE',exampleColor:'#0F6E56',
      example:'BIP 148 (2017) adalah UASF paling terkenal. Mengancam menolak block miner yang tidak mendukung SegWit mulai 1 Agustus 2017. Tekanan ini berhasil: miner akhirnya mensinyalkan SegWit sebelum deadline.',
    },
    ursf:{
      icon:'🛡️',name:'URSF',full:'User Resisted Soft Fork',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      actors:[
        {role:'Miner',action:'Mengaktifkan soft fork yang tidak disetujui komunitas pengguna',bg:'#F4F4F0'},
        {role:'Node / Pengguna',action:'Berkoordinasi menolak soft fork dengan mengikuti chain yang tidak mengandung aturan baru',bg:'#FCEBEB',roleColor:'#791F1F'},
        {role:'Developer',action:'Menyediakan software untuk node yang ingin melakukan URSF',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'Miner aktifkan soft fork, komunitas tidak setuju',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'2',txt:'Node ekonomi berkoordinasi untuk menolak',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'3',txt:'Node menolak block dengan aturan baru',bg:'#A32D2D',fg:'#fff'},
        {n:'4',txt:'Miner kehilangan nilai ekonomi block mereka',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'5',txt:'Soft fork dibatalkan atau terjadi split',bg:'#F4F4F0',fg:'#3A3A35'},
      ],
      connColor:'rgba(163,45,45,0.2)',
      pros:['Pengguna bisa menolak perubahan tidak diinginkan','Membuktikan miner bukan penguasa terakhir','Checks and balances dalam governance'],
      cons:['Belum pernah digunakan secara penuh','Sangat berisiko jika koordinasi gagal','Bisa menyebabkan ketidakpastian panjang'],
      exampleBg:'#FCEBEB',exampleColor:'#791F1F',
      example:'URSF belum pernah digunakan secara penuh dalam sejarah Bitcoin. Ia lebih merupakan senjata teoritis yang menunjukkan bahwa pengguna punya hak veto terakhir terhadap perubahan yang dipaksakan miner.',
    },
    speedy:{
      icon:'⚡',name:'Speedy Trial',full:'Speedy Trial (variasi MASF)',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      actors:[
        {role:'Developer',action:'Menetapkan window pendek 3 bulan dan threshold 90%',bg:'#F4F4F0'},
        {role:'Miner',action:'Mensinyalkan dalam window pendek, harus cepat atau peluang hilang',bg:'#FAEEDA',roleColor:'#854F0B'},
        {role:'Node / Pengguna',action:'Memantau sinyal, siap menerapkan aturan baru kalau threshold tercapai',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'Window 3 bulan dimulai',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'2',txt:'Miner mensinyalkan dengan cepat',bg:'#854F0B',fg:'#fff'},
        {n:'3',txt:'Threshold 90% dari 2016 block',bg:'#854F0B',fg:'#fff'},
        {n:'4',txt:'Soft fork dikunci dalam window',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'Aturan berlaku setelah grace period',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(133,79,11,0.2)',
      pros:['Lebih cepat dari MASF biasa','Memberi kepastian tanpa drama panjang','Bisa diulang kalau gagal'],
      cons:['Masih bergantung pada sinyal miner','Window pendek bisa jadi tekanan tersendiri','Belum teruji di banyak situasi'],
      exampleBg:'#FAEEDA',exampleColor:'#633806',
      example:'Digunakan untuk mengaktifkan Taproot (2021). Miner mencapai threshold 90% dalam waktu singkat. Taproot diaktifkan pada block 709.632 di bulan November 2021, tanpa kontroversi berarti.',
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
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Peran masing-masing pihak:</div>
          <div class="b13-s133-actors">${d.actors.map(a=>`
            <div class="b13-s133-actor" style="background:${a.bg};">
              <div class="b13-s133-actor-role" style="color:${a.roleColor||'#3A3A35'};">${a.role}</div>
              <div class="b13-s133-actor-action">${a.action}</div>
            </div>`).join('')}
          </div>
        </div>
        <div>
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Alur aktivasi:</div>
          <div class="b13-s133-tl-steps">${stepsHtml}</div>
        </div>
        <div class="b13-s133-proscons">
          <div class="b13-s133-pros">
            <div class="b13-s133-pros-label">Keunggulan</div>
            ${d.pros.map(p=>`<div class="b13-s133-pros-item">${p}</div>`).join('')}
          </div>
          <div class="b13-s133-cons">
            <div class="b13-s133-cons-label">Kelemahan</div>
            ${d.cons.map(c=>`<div class="b13-s133-cons-item">${c}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s133-example" style="background:${d.exampleBg};color:${d.exampleColor};">
          <strong>Contoh nyata:</strong> ${d.example}
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
      duration:'Diajukan 2012, Final 2012 (beberapa bulan)',
      status:'Final',statusCls:'s132-final',
      desc:'Mendefinisikan cara menghasilkan banyak kunci kriptografis dari satu seed phrase. Inilah yang memungkinkan wallet modern menggunakan satu backup 12 kata untuk semua address. Hampir semua wallet Bitcoin saat ini mengimplementasikan BIP 32.'},
    141:{num:'BIP 141',name:'Segregated Witness (SegWit)',type:'Standards Track — Consensus',
      author:'Eric Lombrozo, Johnson Lau, Pieter Wuille',year:'2015',
      duration:'Diajukan 2015, diaktifkan Agustus 2017 (sekitar 2 tahun penuh perdebatan)',
      status:'Final',statusCls:'s132-final',
      desc:'Memisahkan data tanda tangan (witness) dari data transaksi utama. Meningkatkan kapasitas block secara efektif, memperbaiki transaction malleability, dan membuka jalan untuk Lightning Network. Proses aktivasinya adalah salah satu yang paling kontroversial dalam sejarah Bitcoin.'},
    148:{num:'BIP 148',name:'UASF — Mandatory activation of segwit',type:'Standards Track — Consensus',
      author:'Shaolin Fry',year:'2017',
      duration:'Diajukan Maret 2017, diterapkan Agustus 2017',
      status:'Final',statusCls:'s132-final',
      desc:'BIP 148 adalah UASF (User Activated Soft Fork) yang mengancam akan menolak block miner yang tidak mendukung SegWit mulai 1 Agustus 2017. Tekanan ini mendorong miner untuk akhirnya mengaktifkan SegWit sebelum deadline. Contoh nyata bagaimana pengguna dan node ekonomi bisa memaksa perubahan tanpa bergantung pada miner.'},
    340:{num:'BIP 340',name:'Schnorr Signatures',type:'Standards Track — Consensus (bagian dari Taproot)',
      author:'Pieter Wuille, Jonas Nick, Tim Ruffing',year:'2020',
      duration:'Diajukan 2020, diaktifkan November 2021 (sekitar 1 tahun via Speedy Trial)',
      status:'Final',statusCls:'s132-final',
      desc:'Mendefinisikan skema tanda tangan Schnorr untuk Bitcoin. Lebih efisien dari ECDSA, memungkinkan signature aggregation, dan membuka jalan untuk fitur privasi dan smart contract yang lebih canggih. Diaktifkan bersama BIP 341 dan BIP 342 sebagai paket Taproot.'},
    352:{num:'BIP 352',name:'Silent Payments',type:'Standards Track — Applications',
      author:'josibake, Ruben Somsen',year:'2022',
      duration:'Diajukan 2022, masih dalam proses adopsi wallet',
      status:'Active',statusCls:'s132-active',
      desc:'Mendefinisikan protokol untuk menerima pembayaran ke alamat statis tanpa mengekspos riwayat transaksi. Setiap pembayaran menghasilkan address on-chain unik yang tidak bisa dihubungkan satu sama lain. Sudah diimplementasikan di Cake Wallet dan beberapa wallet lain, tapi belum universal.'},
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
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Jenis</div><div class="b13-s132-detail-val">${b.type}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Penulis</div><div class="b13-s132-detail-val">${b.author}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Diajukan</div><div class="b13-s132-detail-val">${b.year}</div></div>
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
    drawText(ctx,CX,topY-10,'Jaringan A (node upgrade)','#534AB7',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Jaringan B (node lama)','#854F0B',9,true,'left');

    ['102*','103*','104*'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP-GAP,topY+BS/2,'← terpanjang di A','#534AB7',9,false,'left');

    ['102','103','104'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,botY+BS/2,'rgba(133,79,11,0.4)');
      drawBlock(ctx,bx,botY,lbl,'#FAEEDA','#854F0B','rgba(133,79,11,0.3)');
    });
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← terpanjang di B','#854F0B',9,false,'left');

    drawText(ctx,forkX,midY+10,'fork','#A32D2D',8,false,'center');
    const midCX=CX+STEP;
    drawText(ctx,midCX+BS/2,midY,'jaringan terpisah','#A32D2D',8,false,'center');
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
    drawText(ctx,CX,topY-10,'Mayoritas — node upgrade (hash rate besar)','#0F6E56',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Minoritas — tidak upgrade (hash rate kecil)','#854F0B',9,true,'left');

    ['102†','103†','104†','105†'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(15,110,86,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
      cornerCheck(ctx,bx,topY);
    });
    drawText(ctx,CX+4*STEP-GAP,topY+BS/2,'← terpanjang ✓','#0F6E56',9,true,'left');

    drawBlock(ctx,CX,botY,'102†','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
    cornerCheck(ctx,CX,botY);
    drawArrow(ctx,CX+BS+AW/2+GAP,botY+BS/2,'rgba(133,79,11,0.4)');
    drawBlock(ctx,CX+STEP,botY,'103x','#FCEBEB','#791F1F','rgba(163,45,45,0.3)');
    cornerX(ctx,CX+STEP,botY);
    drawArrow(ctx,CX+2*STEP-AW/2-GAP+AW,botY+BS/2,'rgba(163,45,45,0.3)');
    drawBlock(ctx,CX+2*STEP,botY,'104?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← lebih pendek, ditinggalkan','#A32D2D',9,false,'left');

    drawText(ctx,forkX,sharedCY+12,'soft fork aktif','#52524C',8,false,'center');
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
    drawText(ctx,lx,18,'Node Normal','#0F6E56',10,true,'center');
    drawText(ctx,rx,18,'Node di-Eclipse','#A32D2D',10,true,'center');

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
    drawNode(ctx,lx,cy,TR,'#EAF3DE','#0F6E56','node','(kamu)');
    drawText(ctx,lx,H-16,'Informasi dari berbagai sumber','#0F6E56',8,false,'center');

    // RIGHT: eclipsed node
    const rPeers=[{a:-85,d:68},{a:-30,d:68},{a:30,d:68},{a:90,d:68},{a:150,d:68},{a:210,d:68}];
    rPeers.forEach(({a,d})=>{
      const rad=a*Math.PI/180,px=rx+Math.cos(rad)*d,py=cy+Math.sin(rad)*d;
      drawLine(ctx,rx,cy,px,py,'rgba(163,45,45,0.3)');
      drawNode(ctx,px,py,NR,'#FCEBEB','rgba(163,45,45,0.5)','atk','penyerang');
    });
    drawNode(ctx,rx,cy,TR,'#FCEBEB','#A32D2D','node','terisolasi!');

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
    drawText(ctx,rx,H-16,'Hanya menerima info dari penyerang','#A32D2D',8,false,'center');
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
    {note:'Kondisi awal: semua miner mining di chain yang sama secara jujur.',noteClass:'s144-idle',
     status:[{cls:'s144-honest',label:'Miner jujur (jaringan)',val:'Mining di block #100 secara terbuka'},{cls:'s144-selfish',label:'Miner curang',val:'Juga mining di block #100 secara normal'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#98','#99','#100'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-14,'Semua node mining di chain yang sama','#0F6E56',9,true,'left');
       drawText(ctx,14,H-16,'Miner jujur dan curang sama-sama mining block #101','#52524C',9,false,'left');
     }},
    {note:'Miner curang menemukan block #101 lebih dulu — tapi TIDAK menyiarkannya ke jaringan!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Miner jujur (jaringan)',val:'Masih mining block #101\nBelum tahu block #101 sudah ditemukan'},{cls:'s144-selfish',label:'Miner curang',val:'Sudah punya block #101 tersembunyi\nLangsung mining block #102 di atasnya'}],
     draw(ctx,W,H){
       const pubY=H*0.3,hidY=H*0.7;
       drawText(ctx,14,pubY-16,'Jaringan jujur — tidak tahu #101 sudah ditemukan','#0F6E56',9,true,'left');
       ['#99','#100'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<1) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawBlock(ctx,14+2*52,pubY-BS/2,'#101?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       drawArrow(ctx,14+2*52-9,pubY,'rgba(160,160,152,0.4)');
       drawText(ctx,14+2*52+BS+4,pubY,'masih mining...','#52524C',9,false,'left');
       drawText(ctx,14,hidY-16,'Miner curang — chain tersembunyi','#A32D2D',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,hidY);});
       drawText(ctx,14+2*52+BS+4,hidY+BS/2,'disembunyikan (mata dicoret)','#A32D2D',9,false,'left');
     }},
    {note:'Miner curang sudah temukan #102. Unggul 2 block di belakang layar!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Miner jujur (jaringan)',val:'Baru saja menemukan block #101\nMengumumkan ke jaringan'},{cls:'s144-selfish',label:'Miner curang',val:'Sudah punya #101 dan #102 tersembunyi\nUnggul 2 block di belakang layar'}],
     draw(ctx,W,H){
       const pubY=H*0.28,hidY=H*0.72;
       drawText(ctx,14,pubY-16,'Jaringan jujur — baru temukan #101','#0F6E56',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawText(ctx,14,hidY-16,'Miner curang — sudah 2 block di depan','#A32D2D',9,true,'left');
       ['#99','#100','#101','#102'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<3) drawArrow(ctx,14+i*52+BS+9,hidY);});
     }},
    {note:'Miner curang merilis chain tersembunyi! Block #101 jujur menjadi orphan.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Miner jujur — rugi',val:'Block #101 menjadi orphan\nKehilangan reward yang sudah dihasilkan'},{cls:'s144-selfish',label:'Miner curang — menang',val:'Chain dirilis — 2 block lebih panjang\nJaringan mengikuti chain terpanjang'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D'),i<2?'#534AB7':(i===2?'#A32D2D':'#fff'),i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D'));
         if(i<3) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'Chain miner curang dirilis — lebih panjang, jaringan mengikuti','#A32D2D',9,true,'left');
       const ox=14+2*52,oy=y+BS+26;
       drawBlock(ctx,ox,oy,'#101','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,2]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
       drawText(ctx,ox+BS+4,oy+BS/2,'orphan — reward hilang','#A32D2D',9,false,'left');
     }},
    {note:'Hasil: miner curang dapat reward 2 block, miner jujur kehilangan 1. Tapi ini hanya berhasil dalam skenario ideal.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Miner jujur — rugi',val:'Block #101 jadi orphan\nKehilangan reward'},{cls:'s144-result',label:'Catatan penting',val:'Ini hanya berhasil kalau miner curang punya >33% hash rate dan bisa menjaga kerahasiaan block dengan sempurna'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*','#103'].forEach((l,i)=>{
         const isNew=i===4;
         drawBlock(ctx,14+i*52,y,l,isNew?'#EAF3DE':(i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D')),isNew?'#0F6E56':(i<2?'#534AB7':(i===2?'#A32D2D':'#fff')),isNew?'rgba(15,110,86,0.3)':(i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D')));
         if(i<4) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'Chain berlanjut — strategi berhasil dalam skenario ini','#1A1A18',9,true,'left');
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
    if(ind) ind.textContent=`Langkah ${i} / ${STEPS.length-1}`;
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

    drawText(ctx,CX,topY-13,'Bitcoin 0.8 (LevelDB) — ~60% hash rate, sempat lebih panjang','#534AB7',9,true,'left');
    ['#225430','#225431','#225432'].forEach((l,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,l,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP+2,topY+BS/2,'... (24 block)','#A32D2D',9,false,'left');

    drawText(ctx,CX,botY+BS+12,'Bitcoin 0.7 (BerkeleyDB) — ~40% hash rate, menang setelah pool downgrade','#854F0B',9,true,'left');
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
    drawText(ctx,wx+BS+4,botY+BS/2,'chain 0.7 menang di #225.454 ✓','#0F6E56',9,true,'left');

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
    {note:'Kondisi awal: jaringan berjalan normal. Semua node sepakat pada chain yang sama.',noteClass:'s142-idle',
     status:[{cls:'s142-main',label:'Chain utama',val:'#100 → #101 → #102\nSemua node mengikuti chain ini'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Semua node sepakat — satu chain','#0F6E56',9,true,'left');
     }},
    {note:'Dua miner menemukan block #103 hampir bersamaan! Jaringan sementara terbagi dua.',noteClass:'s142-info',
     status:[
       {cls:'s142-alt',label:'Chain A (Miner A)',val:'... → #102 → #103A\nSebagian node mengikuti ini'},
       {cls:'s142-alt',label:'Chain B (Miner B)',val:'... → #102 → #103B\nSebagian node mengikuti ini'},
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
    {note:'Miner A lebih cepat menemukan block #104. Chain A sekarang lebih panjang!',noteClass:'s142-info',
     status:[
       {cls:'s142-main',label:'Chain A — terpanjang',val:'#102 → #103A → #104A\nPanjang: 2 block setelah fork'},
       {cls:'s142-orphan',label:'Chain B — lebih pendek',val:'#102 → #103B\nPanjang: 1 block setelah fork'},
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
       drawText(ctx,fx+18,H*0.28-BS/2-13,'← LEBIH PANJANG','#0F6E56',9,true,'left');
       drawBlock(ctx,fx+18,H*0.72-BS/2,'#103B','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
       drawText(ctx,fx+22+BS,H*0.72+BS/2+2,'lebih pendek','#A32D2D',9,false,'left');
     }},
    {note:'Reorg! Node yang mengikuti Chain B beralih ke Chain A. Block #103B menjadi orphan.',noteClass:'s142-warn',
     status:[
       {cls:'s142-main',label:'Chain utama (setelah reorg)',val:'#100 → #101 → #102 → #103A → #104A\nSemua node kembali sepakat'},
       {cls:'s142-orphan',label:'Block orphan',val:'#103B dibuang\nTransaksi di dalamnya kembali ke mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,i<3?'#EEEDFE':'#534AB7',i<3?'#534AB7':'#fff',i<3?'rgba(83,74,183,0.3)':'#534AB7');
         if(i<4) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Chain tunggal — semua node sepakat','#0F6E56',9,true,'left');
       const ox=20+3*52,oy=y+BS+24;
       drawBlock(ctx,ox,oy,'#103B','#FCEBEB','#A32D2D','rgba(163,45,45,0.3)');
       drawText(ctx,ox+BS+6,oy+BS/2,'orphan — dibuang','#A32D2D',9,false,'left');
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
     }},
    {note:'Selesai. Reorg 1 block adalah kejadian normal. Miner B kehilangan reward tapi jaringan tetap aman.',noteClass:'s142-good',
     status:[
       {cls:'s142-main',label:'Chain berlanjut normal',val:'Block #105 ditemukan di atas #104A\nReorg selesai, jaringan aman'},
       {cls:'s142-orphan',label:'Konsekuensi bagi miner B',val:'Kehilangan reward block #103B\nTransaksi di dalamnya masuk kembali ke mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A','#105'].forEach((l,i)=>{
         const isNew=i===5;
         drawBlock(ctx,20+i*52,y,l,isNew?'#EAF3DE':(i<3?'#EEEDFE':'#534AB7'),isNew?'#0F6E56':(i<3?'#534AB7':'#fff'),isNew?'rgba(15,110,86,0.3)':(i<3?'rgba(83,74,183,0.3)':'#534AB7'));
         if(i<5) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Jaringan melanjutkan — reorg selesai','#0F6E56',9,true,'left');
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
    if(ind) ind.textContent=`Langkah ${i} / ${STEPS.length-1}`;
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
     title:'Nilai normal: 50 BTC (reward block)',
     val:'5,000,000,000 satoshi = 50 BTC',
     desc:'Nilai valid. Jauh di bawah MAX_MONEY. Kalau kode memeriksa MAX_MONEY, nilai ini lolos dengan benar.',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'⚠️',cls:'s141-bad',
     title:'Bug: kode TIDAK memeriksa MAX_MONEY sebelum menjumlahkan output',
     val:'// Baris yang hilang: if (nValue > MAX_MONEY) return false;',
     desc:'Inilah inti bug-nya. Kode langsung menjumlahkan nilai output tanpa dulu memeriksa apakah masing-masing output melebihi MAX_MONEY (21 juta BTC).',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'Penyerang membuat dua output yang jauh melebihi MAX_MONEY',
     val:'Output A: 92,233,720,368 BTC  |  Output B: 92,233,720,369 BTC',
     desc:'Masing-masing jauh melebihi MAX_MONEY 21 juta BTC. Tapi karena tidak ada pemeriksaan, kode lanjut ke penjumlahan.',
     bits:'0111111111111111111111111111111111111111111111111111111111111110',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'Penjumlahan dua output melebihi MAX_INT64 — overflow!',
     val:'Total output melampaui batas integer 64-bit, bit tanda berubah jadi 1',
     desc:'Saat dijumlahkan, total melampaui MAX_INT64. Angka membungkus menjadi bilangan negatif besar.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'💥',cls:'s141-result',
     title:'Node mengira total output NEGATIF — lebih kecil dari input!',
     val:'Validasi: total output <= total input? Terpenuhi karena output jadi negatif.',
     desc:'Karena overflow membuat total output negatif, validasi lolos. Transaksi dikonfirmasi di block #74.638.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'✓',cls:'s141-fix',
     title:'Patch Satoshi: periksa MAX_MONEY sebelum menjumlahkan',
     val:'if (nValue < 0 || nValue > MAX_MONEY) return false;',
     desc:'Dalam 5 jam Satoshi merilis patch. Block #74.638 di-rollback. Bitcoin yang seolah tercipta tidak pernah eksis secara nyata. Ini bug implementasi, bukan bug protokol.',
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
    if(note){note.textContent='Catatan penting: bitcoin yang seolah tercipta tidak pernah eksis secara nyata karena langsung di-rollback. Ini adalah bug implementasi, bukan bug protokol. Suplai 21 juta BTC tidak pernah benar-benar terancam.';note.className='b14-s141-note s141-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  function reset(){
    if(running) return;
    renderBits('0'.repeat(64),false);
    renderVal(false,'Nilai: 0 satoshi');
    const el=g('b14-s141-steps'); if(el) el.innerHTML='';
    const rb=g('b14-s141-run'); if(rb) rb.disabled=false;
    const note=g('b14-s141-note');
    if(note){note.textContent='Klik "Simulasikan Bug" untuk melihat bagaimana nilai yang melampaui MAX_MONEY lolos validasi karena kode tidak memeriksanya.';note.className='b14-s141-note s141-idle';}
  }

  renderBits('0'.repeat(64),false);
  renderVal(false,'Nilai: 0 satoshi');
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
      sub:'Warisan digital yang tidak bisa diblokir oleh bank, pemerintah, atau siapapun',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      plain:'Kamu punya key utama untuk mengakses dana kapanpun. Tapi kalau kamu tidak "check in" (memindahkan dana) selama 1 tahun, key cadangan yang dipegang ahli warismu otomatis bisa mengklaim dana. Tidak butuh notaris. Tidak butuh pengadilan. Matematika yang menegakkannya.',
      components:[['s156-csv','CSV (relative timelock)'],['s156-multisig','2-key setup']],
      flow:[
        {cls:'s156-green', who:'Key utama (kamu)',cond:'Bisa memindahkan dana KAPANPUN. Setiap perpindahan mereset clock CSV.'},
        {cls:'s156-amber', who:'Clock CSV',cond:'Mulai berjalan sejak UTXO terakhir dikonfirmasi. Target: 52.560 block (~1 tahun).'},
        {cls:'s156-purple',who:'Key cadangan',cond:'Bisa klaim SETELAH 52.560 block tidak ada aktivitas dari key utama.'},
      ],
      limit:'Pemilik harus secara berkala menyegarkan UTXO sebelum 1 tahun habis. Kalau lupa, ahli waris bisa klaim lebih awal dari yang diinginkan. Solusinya: set reminder tahunan.',
    },
    vault:{
      icon:'🏦',title:'Vault dengan Cooldown',
      sub:'Lapisan keamanan tambahan: dana tidak bisa langsung dipindahkan bahkan jika private key dicuri',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      plain:'Sebelum dana dari vault bisa dipindahkan, kamu harus dulu membuat "unvault transaction" yang terkunci selama 144 block (~1 hari). Selama 144 block itu, kamu masih bisa membatalkan dengan emergency key. Kalau hacker mencuri key dan mencoba menguras vault, kamu punya 1 hari untuk menyadari dan membatalkan.',
      components:[['s156-csv','CSV 144 block (cooldown)'],['s156-cltv','CLTV (emergency cancel)']],
      flow:[
        {cls:'s156-purple',who:'Langkah 1',cond:'Buat "unvault transaction" — mengumumkan niat untuk menarik dana.'},
        {cls:'s156-amber', who:'Menunggu',cond:'CSV window 144 block berjalan. Dana belum bisa dipindahkan.'},
        {cls:'s156-green', who:'Langkah 2A',cond:'Setelah 144 block, dana bisa dipindahkan ke tujuan.'},
        {cls:'s156-red',   who:'Langkah 2B (cancel)',cond:'Kapanpun dalam 144 block, emergency key membatalkan dan mengembalikan ke cold storage.'},
      ],
      limit:'Vault membutuhkan dua transaksi on-chain untuk setiap penarikan (unvault + spend), sehingga biayanya lebih tinggi. Tapi untuk dana besar, ini adalah tradeoff yang worthwhile.',
    },
    escrow:{
      icon:'🤝',title:'Escrow Trustless',
      sub:'Pembayaran yang dijamin matematika — tanpa perlu mempercayai arbiter, platform, atau siapapun',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      plain:'Pembeli mengunci dana dalam 2-of-3 multisig antara pembeli, penjual, dan arbiter. Kalau semua berjalan lancar, pembeli dan penjual melepaskan dana bersama. Kalau tidak ada aktivitas dalam 30 hari, dana otomatis bisa diklaim penjual. Kalau ada dispute, arbiter membantu menentukan pemenang.',
      components:[['s156-nlocktime','nLockTime (batas waktu)'],['s156-multisig','2-of-3 multisig'],['s156-cltv','CLTV (auto-release 30 hari)']],
      flow:[
        {cls:'s156-green', who:'Scenario A',cond:'Pembeli + penjual setuju → dana langsung dilepaskan (tanpa arbiter).'},
        {cls:'s156-amber', who:'Scenario B',cond:'Ada dispute → arbiter membantu → dana dilepaskan ke pemenang (2-of-3).'},
        {cls:'s156-purple',who:'Scenario C',cond:'Tidak ada aktivitas 30 hari → penjual klaim otomatis dengan CLTV.'},
        {cls:'s156-red',   who:'Scenario D',cond:'Pembeli ingin refund dalam 30 hari → butuh persetujuan penjual atau arbiter.'},
      ],
      limit:'Timelock tidak bisa memverifikasi apakah barang benar-benar sudah dikirim. Untuk itu tetap dibutuhkan kepercayaan minimal pada arbiter atau sistem reputasi off-chain.',
    },
    milestone:{
      icon:'📅',title:'Pembayaran Milestone',
      sub:'Bayar bertahap sesuai pencapaian yang disepakati — otomatis, tanpa bisa diingkari',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      plain:'Klien dan kontraktor sepakat: 30% di muka, 40% setelah milestone 1 (block X), 30% setelah milestone 2 (block Y). Dana dikunci dalam script sejak awal. Kontraktor bisa klaim setiap tranche setelah block target tercapai tanpa perlu menunggu persetujuan klien.',
      components:[['s156-nlocktime','nLockTime (jadwal)'],['s156-cltv','CLTV per milestone'],['s156-multisig','Tanda tangan kontraktor']],
      flow:[
        {cls:'s156-green', who:'Tranche 1 (30%)',cond:'Dikunci di muka. Kontraktor klaim langsung setelah kontrak on-chain.'},
        {cls:'s156-amber', who:'Tranche 2 (40%)',cond:'Terkunci dengan CLTV block X (milestone 1). Klaim otomatis tanpa approval klien.'},
        {cls:'s156-purple',who:'Tranche 3 (30%)',cond:'Terkunci dengan CLTV block Y (milestone 2). Klaim otomatis setelah block target.'},
        {cls:'s156-red',   who:'Dispute window',cond:'Sebelum block target, klien bisa dispute dengan mekanisme multisig arbiter.'},
      ],
      limit:'Milestone berbasis block tidak bisa memverifikasi kualitas pekerjaan — hanya memverifikasi bahwa deadline sudah lewat. Untuk milestone berbasis hasil nyata, masih dibutuhkan oracle atau mekanisme off-chain.',
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
          <div class="b15-s156-components-label">Komponen timelock yang digunakan:</div>
          <div class="b15-s156-component-row">${compHTML}</div>
        </div>
        <div>
          <div class="b15-s156-flow-label">Siapa bisa melakukan apa kapan:</div>
          <div class="b15-s156-flow-rows">${flowHTML}</div>
        </div>
        <div class="b15-s156-limit"><strong>Keterbatasan:</strong> ${d.limit}</div>
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
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Aktif',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice dan Bob punya payment channel yang aktif',
     desc:'Mereka sudah bertransaksi banyak kali off-chain. State terbaru: Alice punya 0.6 BTC, Bob punya 0.4 BTC.',
     bar:0,barLabel:'',barDesc:'CSV window belum dimulai.'},
    {dot:'2',dotBg:'#534AB7',tag:'Force Close',tagBg:'#534AB7',cls:'s155-tx',
     title:'Bob memutuskan untuk menutup channel secara paksa',
     desc:'Bob menyiarkan commitment transaction terbaru yang jujur ke blockchain. Transaksi ini dikonfirmasi.',
     bar:0,barLabel:'0 / 144 block',barDesc:'CSV window mulai berjalan sejak commitment transaction dikonfirmasi.'},
    {dot:'3',dotBg:'#854F0B',tag:'CSV Window',tagBg:'#854F0B',cls:'s155-csv',
     title:'Menunggu 144 block berlalu',
     desc:'Dana Bob terkunci dalam output dengan CSV 144 block. Selama periode ini, Alice memverifikasi bahwa commitment yang dibroadcast adalah yang terbaru. Tidak ada kecurangan.',
     bar:65,barLabel:'94 / 144 block',barDesc:'Alice memverifikasi commitment transaction — semuanya benar.'},
    {dot:'4',dotBg:'#0F6E56',tag:'Selesai',tagBg:'#0F6E56',cls:'s155-ok',
     title:'144 block berlalu — Bob bisa klaim dananya',
     desc:'CSV window habis tanpa insiden. Bob mengklaim 0.4 BTC miliknya. Alice sudah mengambil bagiannya sejak awal karena output Alice tidak punya CSV.',
     bar:100,barLabel:'144 / 144 block — SELESAI',barDesc:'Force close selesai dengan aman. Kedua pihak mendapat dana yang benar.'},
  ];

  const CHEAT=[
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Aktif',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice dan Bob punya payment channel aktif',
     desc:'State terbaru: Alice 0.8 BTC, Bob 0.2 BTC. Tapi ada state lama: Alice 0.3 BTC, Bob 0.7 BTC.',
     bar:0,barLabel:'',barDesc:''},
    {dot:'2',dotBg:'#A32D2D',tag:'Bob Curang',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Bob menyiarkan commitment transaction LAMA',
     desc:'Bob broadcast commitment lama di mana ia punya 0.7 BTC. Ia berharap Alice tidak memperhatikan.',
     bar:0,barLabel:'0 / 144 block',barDesc:'CSV window dimulai. Bob harus menunggu 144 block sebelum bisa klaim. Ini waktu Alice untuk bertindak.'},
    {dot:'3',dotBg:'#854F0B',tag:'Alice Waspada',tagBg:'#854F0B',cls:'s155-csv',
     title:'Alice mendeteksi kecurangan — commitment lama terdeteksi',
     desc:'Node Alice memantau blockchain 24/7. Ia mencocokkan commitment yang dibroadcast dengan revocation key yang ia simpan. Ketahuan: ini bukan state terbaru!',
     bar:30,barLabel:'43 / 144 block',barDesc:'Bob baru bisa klaim setelah 144 block. Alice masih punya 101 block untuk bertindak.'},
    {dot:'4',dotBg:'#A32D2D',tag:'Penalty!',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Alice menyiarkan penalty transaction',
     desc:'Alice menggunakan revocation key untuk mengklaim SELURUH dana channel — termasuk bagian Bob. Ini hukuman atas kecurangan. Penalty transaction dikonfirmasi sebelum CSV window habis.',
     bar:55,barLabel:'79 / 144 block',barDesc:'Alice berhasil mengajukan penalty SEBELUM CSV window habis. Bob kalah.'},
    {dot:'5',dotBg:'#534AB7',tag:'Selesai',tagBg:'#534AB7',cls:'s155-ok',
     title:'Alice mendapat semua dana — 1 BTC total',
     desc:'Bob kehilangan segalanya karena mencoba curang. Alice mendapat seluruh 1 BTC yang ada di channel. Inilah mekanisme keadilan yang membuat Lightning Network aman tanpa perlu mempercayai siapapun.',
     bar:100,barLabel:'Penalty dikonfirmasi!',barDesc:'CSV window belum habis — penalty berhasil. Bob tidak mendapat apapun.'},
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
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent=`Langkah ${hStep+1} / ${HONEST.length}`;
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=hStep>=HONEST.length-1;
    const res=g('b15-s155-h-result');
    if(res){
      if(hStep===HONEST.length-1){res.className='b15-s155-result s155-good';res.textContent='Force close selesai dengan aman. CSV window berfungsi sebagai periode verifikasi — bukan hukuman. Kedua pihak mendapat haknya masing-masing.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const hNext=g('b15-s155-h-next');if(hNext) hNext.addEventListener('click',()=>{if(hStep<HONEST.length-1){hStep++;updateH();}});
  const hRst=g('b15-s155-h-rst');if(hRst) hRst.addEventListener('click',()=>{
    hStep=-1;
    const bar=g('b15-s155-h-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-h-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-h-bar-desc');if(desc) desc.textContent='Mulai setelah commitment transaction dikonfirmasi.';
    activateStep(HONEST,'b15-s155-honest-steps',-1);
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent='Langkah 0 / 4';
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-h-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Klik "Langkah Berikut" untuk melihat proses force close yang jujur.';}
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
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent=`Langkah ${cStep+1} / ${CHEAT.length}`;
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=cStep>=CHEAT.length-1;
    const res=g('b15-s155-c-result');
    if(res){
      if(cStep===CHEAT.length-1){res.className='b15-s155-result s155-bad';res.textContent='Bob kehilangan segalanya. CSV window adalah yang memberi Alice waktu untuk mendeteksi dan menghukum kecurangan. Tanpa CSV, Bob bisa langsung klaim sebelum Alice sempat bereaksi.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const cNext=g('b15-s155-c-next');if(cNext) cNext.addEventListener('click',()=>{if(cStep<CHEAT.length-1){cStep++;updateC();}});
  const cRst=g('b15-s155-c-rst');if(cRst) cRst.addEventListener('click',()=>{
    cStep=-1;
    const bar=g('b15-s155-c-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-c-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-c-bar-desc');if(desc) desc.textContent='Alice harus bertindak sebelum window habis.';
    activateStep(CHEAT,'b15-s155-cheat-steps',-1);
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent='Langkah 0 / 5';
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-c-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Klik "Langkah Berikut" untuk melihat apa yang terjadi ketika Bob mencoba curang.';}
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
        {cls:'s154-alice',name:'Alice',cond:'Bisa klaim SETELAH block 950.000 (sekitar 8 bulan dari sekarang) — dengan tanda tangannya.'},
      ],
      timeline:[
        {from:0,to:40,bg:'#FCEBEB',label:'Terkunci — tidak ada yang bisa klaim',labelColor:'#A32D2D'},
        {from:40,to:100,bg:'#EAF3DE',label:'Alice bisa klaim',labelColor:'#0F6E56'},
      ],
      lockAt:40,
      script:[
        {cls:'s154-op-time',code:'<950000>',explain:'Push angka 950.000 ke stack. Ini adalah block height target — tidak sebelum block ini.'},
        {cls:'s154-op-cltv',code:'OP_CHECKLOCKTIMEVERIFY',explain:'Periksa: apakah nLockTime transaksi >= 950.000? Kalau tidak, script langsung gagal. Inilah yang menegakkan timelock.'},
        {cls:'s154-op-flow',code:'OP_DROP',explain:'Buang angka 950.000 dari stack — sudah tidak dibutuhkan setelah pengecekan.'},
        {cls:'s154-op-data',code:'OP_DUP',explain:'Duplikasi kunci publik Alice di stack.'},
        {cls:'s154-op-data',code:'OP_HASH160',explain:'Hash kunci publik Alice.'},
        {cls:'s154-op-data',code:'<PKH_Alice>',explain:'Push hash kunci publik Alice yang diharapkan.'},
        {cls:'s154-op-data',code:'OP_EQUALVERIFY',explain:'Pastikan kunci yang diberikan cocok dengan yang diharapkan.'},
        {cls:'s154-op-sig', code:'OP_CHECKSIG',explain:'Verifikasi tanda tangan Alice. Kalau valid, UTXO bisa dibelanjakan.'},
      ],
      note:'Ini adalah timelock satu arah paling sederhana. Tidak ada yang bisa menyentuh dana sampai block 950.000 tercapai — termasuk pengirim. Cocok untuk: deposito berjangka, tabungan terkunci, atau dana beasiswa yang tidak boleh dipakai sebelum semester dimulai.',
    },
    branch:{
      claimers:[
        {cls:'s154-alice',name:'Alice',cond:'Bisa klaim KAPANPUN — dengan tanda tangannya. Tidak ada batasan waktu.'},
        {cls:'s154-bob',  name:'Bob',  cond:'Bisa klaim SETELAH block 966.000 (sekitar 6 bulan) — kalau Alice tidak muncul.'},
      ],
      timeline:[
        {from:0,to:55,bg:'#EAF3DE',label:'Alice bisa klaim',labelColor:'#0F6E56'},
        {from:55,to:100,bg:'#E8E6FD',label:'Alice DAN Bob bisa klaim',labelColor:'#534AB7'},
      ],
      lockAt:55,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Percabangan: kalau Alice memilih jalur ini, jalankan blok pertama.'},
        {cls:'s154-op-sig', code:'  <pubkey_Alice>',explain:'(Jalur Alice) Verifikasi tanda tangan Alice. Tidak ada syarat waktu.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Jalur Alice) Kalau tanda tangan Alice valid, script berhasil.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'Kalau bukan Alice, masuk jalur Bob.'},
        {cls:'s154-op-time',code:'  <966000>',explain:'(Jalur Bob) Push block height target untuk Bob.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Jalur Bob) Pastikan sudah melewati block 966.000. Kalau belum, script gagal.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Jalur Bob) Buang angka dari stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_Bob>',explain:'(Jalur Bob) Verifikasi tanda tangan Bob.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Jalur Bob) Kalau tanda tangan Bob valid dan sudah lewat block 966.000, script berhasil.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Tutup percabangan.'},
      ],
      note:'Pola dead man switch yang powerful. Alice punya akses penuh kapanpun. Tapi kalau Alice tidak aktif dalam 6 bulan, Bob (ahli waris atau backup key) bisa mengambil alih. Tidak ada notaris, tidak ada pengacara — matematika yang menjaga.',
    },
    htlc:{
      claimers:[
        {cls:'s154-alice',name:'Penerima',cond:'Bisa klaim dengan mengungkap rahasia (preimage) yang di-hash. Kapanpun sebelum timeout.'},
        {cls:'s154-bob',  name:'Pengirim',cond:'Bisa refund SETELAH block 920.000 (timeout) — kalau penerima tidak mengungkap rahasia.'},
      ],
      timeline:[
        {from:0,to:45,bg:'#E8E6FD',label:'Penerima bisa klaim (dengan preimage)',labelColor:'#534AB7'},
        {from:45,to:100,bg:'#FAEEDA',label:'Pengirim bisa refund',labelColor:'#854F0B'},
      ],
      lockAt:45,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Percabangan: kalau penerima mengungkap preimage, jalur ini diambil.'},
        {cls:'s154-op-data',code:'  OP_SHA256',explain:'(Jalur penerima) Hash nilai yang diberikan penerima.'},
        {cls:'s154-op-data',code:'  <payment_hash>',explain:'(Jalur penerima) Hash yang disepakati. Kalau SHA256(preimage) cocok, penerima terbukti tahu rahasianya.'},
        {cls:'s154-op-data',code:'  OP_EQUALVERIFY',explain:'(Jalur penerima) Pastikan hash cocok.'},
        {cls:'s154-op-sig', code:'  <pubkey_penerima>',explain:'(Jalur penerima) Verifikasi tanda tangan penerima.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Jalur penerima) Kalau preimage benar dan tanda tangan valid, penerima bisa klaim.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'Kalau penerima tidak mengungkap preimage, masuk jalur refund.'},
        {cls:'s154-op-time',code:'  <920000>',explain:'(Jalur refund) Block timeout. Setelah ini pengirim bisa refund.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Jalur refund) Pastikan sudah melewati block 920.000. Mencegah pengirim refund terlalu cepat.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Jalur refund) Buang angka dari stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_pengirim>',explain:'(Jalur refund) Verifikasi tanda tangan pengirim.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Jalur refund) Kalau timeout tercapai dan tanda tangan valid, pengirim bisa refund.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Tutup percabangan.'},
      ],
      note:'Hash Time Lock Contract (HTLC) — fondasi dari setiap pembayaran di Lightning Network. Penerima punya insentif mengungkap preimage karena itu satu-satunya cara klaim dana. Pengirim aman karena kalau gagal, dana otomatis kembali setelah timeout. Tidak ada pihak ketiga.',
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
    const nowLbl=document.createElement('div');nowLbl.className='b15-s154-tl-now-label';nowLbl.style.left='12%';nowLbl.textContent='sekarang';
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
      else if(i===15) lbl.textContent='nilai';
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
      if(ml) ml.textContent='Nilai spesial: 0xFFFFFFFF';
      if(mt) mt.textContent='Timelock NONAKTIF — UTXO ini bisa dibelanjakan kapanpun setelah dikonfirmasi.';
      if(ms) ms.textContent='Nilai 0xFFFFFFFF adalah nilai default yang berarti tidak ada timelock sama sekali. Ini juga menonaktifkan nLockTime di level transaksi. Banyak wallet menggunakan nilai ini untuk transaksi biasa.';
      if(uc) uc.textContent='Dipakai untuk: transaksi biasa sehari-hari. Tidak ada jeda waktu, UTXO langsung bisa dibelanjakan setelah konfirmasi.';
      return;
    }
    if(!enabled){
      if(mw) mw.className='b15-s153-meaning s153-disabled';
      if(ml) ml.textContent='Timelock dinonaktifkan (bit 31 = 1)';
      if(mt) mt.textContent='Relative timelock DINONAKTIFKAN untuk input ini.';
      if(ms) ms.textContent='Bit 31 diset ke 1 menonaktifkan relative timelock. UTXO bisa dibelanjakan kapanpun setelah dikonfirmasi, tanpa jeda waktu tambahan.';
      if(uc) uc.textContent='Dipakai untuk: transaksi yang tidak butuh relative timelock tapi butuh nSequence untuk alasan lain.';
      return;
    }
    if(mw) mw.className='b15-s153-meaning s153-active';
    if(ml) ml.textContent='Artinya dalam bahasa manusia:';
    if(!useTime){
      const days=Math.round(value*10/1440*10)/10;
      const daysStr=days<1?`${Math.round(value*10)} menit`:`${days} hari`;
      if(mt) mt.textContent=`UTXO ini baru bisa dibelanjakan setelah ${value.toLocaleString('id-ID')} block (sekitar ${daysStr}) dari saat transaksi dikonfirmasi.`;
      if(ms) ms.textContent=`Jam mulai berjalan bukan dari sekarang, tapi dari saat UTXO dikonfirmasi di blockchain. Kalau transaksinya dikonfirmasi hari Senin, UTXO ini baru bisa dipakai setelah ${value} block kemudian.`;
      if(uc){
        if(value<=144) uc.textContent='Dipakai untuk: Lightning Network force close. Periode tunggu ~1 hari memberi waktu untuk deteksi kecurangan dan pengajuan penalty transaction.';
        else if(value<=1008) uc.textContent='Dipakai untuk: vault sederhana, escrow jangka pendek, atau periode cooldown sebelum transaksi besar dieksekusi.';
        else uc.textContent='Dipakai untuk: escrow jangka menengah, kontrak dengan periode tunggu lebih panjang.';
      }
    } else {
      const secs=value*512;
      const hours=Math.round(secs/3600*10)/10;
      const days=Math.round(secs/86400*10)/10;
      const timeStr=days>=1?`${days} hari`:hours>=1?`${hours} jam`:`${secs} detik`;
      if(mt) mt.textContent=`UTXO ini baru bisa dibelanjakan setelah ${value.toLocaleString('id-ID')} unit waktu (${timeStr}) dari saat transaksi dikonfirmasi.`;
      if(ms) ms.textContent='Satu unit = 512 detik (~8.5 menit). Satuan waktu lebih presisi dari block, tapi block lebih umum dipakai karena lebih mudah diprediksi.';
      if(uc) uc.textContent='Dipakai untuk: skenario yang butuh presisi waktu lebih tinggi dari satuan block ~10 menit.';
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
      if(label) label.textContent='Timelock AKTIF';
      if(state) state.textContent='(bit 31 = 0)';
      if(uc2) uc2.style.opacity='1';
      if(vc) vc.style.opacity='1';
      if(ub) ub.disabled=false;
      if(ut) ut.disabled=false;
      if(sl) sl.disabled=false;
    } else {
      if(track) track.className='b15-s153-toggle-track s153-warn';
      if(label) label.textContent='Timelock NONAKTIF';
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
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=v.toLocaleString('id-ID')+(useTime?' unit waktu':' block');
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
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' block';
    update();
  });
  const ut=g('b15-s153-u-time');
  if(ut) ut.addEventListener('click',()=>{
    useTime=true;
    ut.className='b15-s153-unit-btn s153-act';
    const ub2=g('b15-s153-u-block');if(ub2) ub2.className='b15-s153-unit-btn';
    const sl=g('b15-s153-slider');if(sl){sl.max=1000;sl.value=Math.min(value,1000);}
    value=parseInt(g('b15-s153-slider').value)||144;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' unit waktu';
    update();
  });

  const sl=g('b15-s153-slider');
  if(sl) sl.addEventListener('input',()=>{
    value=parseInt(sl.value)||1;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value.toLocaleString('id-ID')+(useTime?' unit waktu':' block');
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
    if(ml) ml.textContent='Nilai spesial: 0xFFFFFFFF';
    if(mt) mt.textContent='Timelock NONAKTIF — UTXO ini bisa dibelanjakan kapanpun setelah dikonfirmasi.';
    if(ms) ms.textContent='Nilai 0xFFFFFFFF juga menonaktifkan nLockTime di level transaksi. Banyak wallet pakai ini untuk transaksi biasa.';
    if(uc) uc.textContent='Juga dipakai sebagai sinyal opt-in RBF (Replace-By-Fee): nilai 0xFFFFFFFD menandai transaksi bisa diganti dengan fee lebih tinggi sebelum dikonfirmasi.';
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
    return new Date(ts*1000).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
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
        mt.textContent='nLockTime diabaikan — transaksi bisa diproses kapanpun.';
        ms.textContent='Karena nSequence semua input diset ke 0xFFFFFFFF, jaringan mengabaikan nLockTime sepenuhnya. Transaksi ini bisa dikonfirmasi sekarang juga.';
      } else if(diffDays<=0){
        mt.textContent=`Tanggal ${date} sudah lewat — transaksi bisa diproses sekarang.`;
        ms.textContent='nLockTime sudah terlampaui. Miner boleh memasukkan transaksi ini ke block kapanpun.';
      } else {
        mt.textContent=`Transaksi ini tidak bisa diproses sebelum ${date}.`;
        ms.textContent=`Masih ${diffDays} hari lagi. Bahkan pengirimnya sendiri tidak bisa mempercepat ini — seluruh jaringan Bitcoin akan menolak block yang memasukkan transaksi ini terlalu awal.`;
      }
      he.textContent=`Nilai ${val.toLocaleString('id-ID')} (Unix timestamp) → ${hex} dalam little-endian. Karena nilainya di atas 500.000.000, Bitcoin tahu ini adalah timestamp, bukan block height.`;
    } else {
      const diff=val-CURRENT_BLOCK;
      const estDays=Math.round(diff*10/1440);
      if(!seqActive){
        mt.textContent='nLockTime diabaikan — transaksi bisa diproses kapanpun.';
        ms.textContent='Karena nSequence semua input diset ke 0xFFFFFFFF, jaringan mengabaikan nLockTime sepenuhnya.';
      } else if(diff<=0){
        mt.textContent=`Block #${val.toLocaleString('id-ID')} sudah terlewati — transaksi bisa diproses sekarang.`;
        ms.textContent=`Block saat ini adalah #${CURRENT_BLOCK.toLocaleString('id-ID')}. nLockTime sudah terlampaui.`;
      } else {
        mt.textContent=`Transaksi ini tidak bisa diproses sebelum block #${val.toLocaleString('id-ID')}.`;
        ms.textContent=`Masih ${diff.toLocaleString('id-ID')} block lagi (sekitar ${estDays} hari). Seluruh jaringan Bitcoin akan menolak block yang memasukkan transaksi ini terlalu awal.`;
      }
      he.textContent=`Nilai ${val.toLocaleString('id-ID')} (block height) → ${hex} dalam little-endian. Karena nilainya di bawah 500.000.000, Bitcoin tahu ini adalah block height, bukan timestamp.`;
    }

    const sw=g('b15-s152-seq-wrap');
    const sl=g('b15-s152-seq-label');
    const sd=g('b15-s152-seq-desc');
    const st=g('b15-s152-seq-track');
    const stt=g('b15-s152-seq-ttext');
    if(seqActive){
      if(sw) sw.className='b15-s152-seq-wrap s152-ok';
      if(sl) sl.textContent='nSequence: nLockTime AKTIF';
      if(sd) sd.textContent='nLockTime akan ditegakkan. Transaksi tidak bisa masuk block sebelum waktu yang ditentukan.';
      if(st) st.className='b15-s152-seq-track s152-on';
      if(stt) stt.textContent='nSequence input = 0xFFFFFFFE (nLockTime aktif)';
    } else {
      if(sw) sw.className='b15-s152-seq-wrap s152-warn';
      if(sl) sl.textContent='nSequence: nLockTime DINONAKTIFKAN';
      if(sd) sd.textContent='Hati-hati: kalau semua input punya nSequence = 0xFFFFFFFF, jaringan akan mengabaikan nLockTime sepenuhnya. Ini jebakan yang sering mengejutkan developer baru.';
      if(st) st.className='b15-s152-seq-track';
      if(stt) stt.textContent='nSequence input = 0xFFFFFFFF (nLockTime diabaikan!)';
    }
  }

  function buildTS(){
    const area=g('b15-s152-input-area'); if(!area) return;
    const def=NOW+30*86400;
    currentVal=def;
    const minTS=NOW;
    const maxTS=NOW+365*5*86400;
    area.innerHTML=`
      <div class="b15-s152-input-label">Pilih tanggal:</div>
      <div class="b15-s152-ts-wrap">
        <input type="range" class="b15-s152-ts-slider" id="b15-s152-ts-slider"
          min="${minTS}" max="${maxTS}" value="${def}" step="86400">
        <div class="b15-s152-ts-labels">
          <span>Sekarang</span><span>+1 tahun</span><span>+3 tahun</span><span>+5 tahun</span>
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
      <div class="b15-s152-input-label">Masukkan block height target:</div>
      <div class="b15-s152-input-sub">Block saat ini: #${CURRENT_BLOCK.toLocaleString('id-ID')}. Masukkan angka yang lebih besar untuk lock di masa depan.</div>
      <div class="b15-s152-input-row">
        <input type="number" class="b15-s152-input" id="b15-s152-bh-input" value="${def}" min="0" max="499999999">
        <div class="b15-s152-input-unit">block</div>
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
      el.innerHTML=`<div class="b15-s151-block-num">#${b.height.toLocaleString('id-ID')}</div><div class="b15-s151-block-time">~${b.mins}m</div>`;
      track.appendChild(el);
    });
    const val=g('b15-s151-val');
    const desc=g('b15-s151-desc2');
    if(blocks.length===0){
      if(val) val.textContent='—';
      if(desc) desc.textContent='Klik "Tambah Block Baru" untuk memulai.';
      return;
    }
    const last=blocks[blocks.length-1];
    if(val) val.textContent=`Block #${last.height.toLocaleString('id-ID')}`;
    if(refBlock){
      const diff=last.height-refBlock;
      if(desc) desc.textContent=`Sudah ${diff} block sejak referensi waktu (block #${refBlock.toLocaleString('id-ID')}). Dalam aturan protokol ini bisa ditulis: "transaksi ini hanya valid setelah ${diff} konfirmasi dari block referensi."`;
    } else {
      if(desc) desc.textContent=`Block terbaru di chain. Tandai block ini sebagai referensi waktu untuk melihat berapa block sudah berlalu.`;
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
    if(offEl) offEl.textContent=(sl>0?'+':'')+sl+' menit';
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
    if(rl) rl.textContent=isBig?'MTP bergeser cukup jauh — tapi tetap terbatas':'Median Time Past (MTP) saat ini';
    if(rv) rv.textContent=diff===0?'MTP tidak bergeser':`MTP bergeser ${diff>0?'+':''}${diff} menit dari baseline`;
    if(rd){
      if(sl===0) rd.textContent='Semua timestamp normal. MTP adalah nilai tengah dari 11 block — mewakili "waktu konsensus" jaringan.';
      else if(isBig) rd.textContent=`Block #6 dimanipulasi ${sl} menit. MTP ikut bergeser ${Math.abs(diff)} menit. Untuk manipulasi yang lebih besar, miner harus mengontrol mayoritas dari 11 block ini.`;
      else rd.textContent=`Block #6 dimanipulasi ${sl} menit, tapi MTP hanya bergeser ${Math.abs(diff)} menit. Median melindungi dari manipulasi satu block.`;
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
     when:'Setiap hari — cek pertama saat buka terminal',
     why:'Satu command untuk tahu segalanya: apakah node sudah sync, berapa block terakhir, apakah masih IBD, apakah pruning aktif. Ini dashboard utama node kamu.',
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
       {k:'"initialblockdownload"',v:'false',d:'false = node sudah sync dan siap. true = jangan percaya data dari node ini dulu.'},
       {k:'"verificationprogress"',v:'0.9999982341',d:'Semakin dekat ke 1.0, semakin sync node kamu dengan chain terbaru.'},
     ]},
    {num:2,code:'bitcoin-cli getnetworkinfo',
     when:'Kalau node terasa lambat atau tidak menerima block baru',
     why:'Cek apakah node kamu masih terhubung ke jaringan. Koneksi in/out yang rendah bisa berarti masalah firewall, internet, atau node kamu di-ban oleh peer.',
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
       {k:'"connections_out"',v:'10',d:'Minimal 8 outbound untuk keamanan optimal. Kalau 0, node kamu offline.'},
       {k:'"networkactive"',v:'true',d:'false berarti node sengaja di-set offline. Gunakan setnetworkactive true untuk mengaktifkan kembali.'},
     ]},
    {num:3,code:'bitcoin-cli getmempoolinfo',
     when:'Sebelum mengirim transaksi — cek kondisi fee market',
     why:'Kalau mempool penuh, fee untuk konfirmasi cepat akan mahal. Kalau hampir kosong, kamu bisa kirim dengan fee minimum. Data real-time dari node kamu sendiri.',
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
       {k:'"size"',v:'18432',d:'Jumlah transaksi yang sedang menunggu konfirmasi di mempool.'},
       {k:'"bytes"',v:'47291834',d:'~47 MB = mempool cukup penuh, fee perlu lebih tinggi untuk konfirmasi cepat.'},
       {k:'"mempoolminfee"',v:'0.00001000',d:'Fee minimum yang diterima mempool node kamu. Transaksi di bawah ini tidak akan di-relay.'},
     ]},
    {num:4,code:'bitcoin-cli getblockcount',
     when:'Quick check — berapa block height sekarang',
     why:'Command paling ringan. Output langsung satu angka. Berguna untuk script otomatis atau kalau kamu hanya perlu tahu block height tanpa info lain.',
     output:[['870142','s166-tn']],
     fields:[
       {k:'output',v:'870142',d:'Integer langsung — block height terbaru. Bandingkan dengan explorer publik untuk verifikasi sync.'},
     ]},
    {num:5,code:'bitcoin-cli gettxoutsetinfo',
     when:'Audit mingguan — verifikasi total supply Bitcoin',
     why:'Satu-satunya cara untuk memverifikasi secara independen bahwa total Bitcoin tidak melebihi 21 juta. Tidak ada bank sentral, tidak ada audit eksternal — node kamu yang membuktikannya.',
     output:[
       ['{','s166-tgy'],
       ['  "height":       ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "txouts":       ','s166-tb'],['184218954','s166-tn'],[',','s166-tgy'],
       ['  "disk_size":    ','s166-tb'],['11284716032','s166-tn'],[',','s166-tgy'],
       ['  "total_amount": ','s166-tb'],['19720483.12847291','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"total_amount"',v:'19.720.483 BTC',d:'Total BTC yang beredar. Harus selalu di bawah 21 juta. Kalau lebih, ada yang sangat salah.'},
       {k:'"txouts"',v:'184.218.954',d:'Jumlah UTXO saat ini. Semakin besar, semakin besar RAM yang dibutuhkan node.'},
     ]},
    {num:6,code:'bitcoin-cli getpeerinfo',
     when:'Troubleshooting koneksi atau cek peer bermasalah',
     why:'Lihat detail semua peer: dari mana mereka, versi software apa, sudah sync ke block berapa, berapa bandwidth yang dipakai.',
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
       {k:'"synced_blocks"',v:'870142',d:'Block terakhir yang diketahui peer ini sudah divalidasi. Kalau jauh di belakang, peer ini tidak berguna untuk IBD.'},
       {k:'"subver"',v:'"/Satoshi:27.0.0/"',d:'Versi software yang dijalankan peer. Berguna untuk monitoring distribusi versi di jaringan.'},
     ]},
    {num:7,code:'bitcoin-cli estimatesmartfee 6',
     when:'Sebelum kirim transaksi — estimasi fee yang tepat',
     why:'Berapa fee yang dibutuhkan agar transaksi dikonfirmasi dalam 6 block (~1 jam)? Data dari mempool node kamu sendiri, bukan dari layanan pihak ketiga.',
     output:[
       ['{','s166-tgy'],
       ['  "feerate": ','s166-tb'],['0.00012340','s166-tn'],[',','s166-tgy'],
       ['  "blocks":  ','s166-tb'],['6','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"feerate"',v:'0.00012340',d:'Fee rate dalam BTC/kB untuk konfirmasi dalam 6 block. Kalkulasi dari data mempool node kamu sendiri.'},
       {k:'"blocks"',v:'6',d:'Ganti dengan 1 untuk estimasi fee next block, atau 144 untuk fee murah (~1 hari).'},
     ]},
    {num:8,code:'bitcoin-cli getmininginfo',
     when:'Monitor difficulty dan kondisi keamanan jaringan',
     why:'Lihat difficulty saat ini, estimasi hashrate jaringan, dan berapa block sudah ditambang dalam periode difficulty adjustment ini.',
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
       {k:'"difficulty"',v:'88.171.509.232.073',d:'Difficulty saat ini. Angka lebih besar = jaringan lebih aman.'},
       {k:'"networkhashps"',v:'6.847e+20',d:'~685 exahash/s = total hashrate jaringan. Semakin besar, semakin sulit diserang.'},
     ]},
    {num:9,code:'bitcoin-cli getwalletinfo',
     when:'Cek saldo dan status wallet node',
     why:'Lihat saldo total, jumlah transaksi, apakah wallet sedang rescan, dan apakah wallet terenkripsi. Data langsung dari node kamu, bukan server pihak ketiga.',
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
       {k:'"balance"',v:'0.12847291 BTC',d:'Saldo yang sudah dikonfirmasi. Diverifikasi langsung dari chainstate node kamu.'},
       {k:'"unlocked_until"',v:'0',d:'0 = wallet terkunci. Selalu lock wallet setelah selesai digunakan.'},
     ]},
    {num:10,code:'bitcoin-cli validateaddress "bc1qar0srrr..."',
     when:'Sebelum menerima pembayaran — validasi address',
     why:'Verifikasi bahwa address Bitcoin yang kamu gunakan valid dan format-nya benar. Mencegah kesalahan kirim ke address yang tidak valid.',
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
       {k:'"isvalid"',v:'true',d:'true = address ini valid. false = address salah, jangan kirim ke sini.'},
       {k:'"iswitness"',v:'true',d:'true = ini SegWit address (bc1...). Lebih efisien dari legacy address.'},
       {k:'"witness_version"',v:'0',d:'0 = SegWit v0. 1 = Taproot (bc1p...). Menentukan jenis script yang digunakan.'},
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
        <div class="b16-s166-explain-when">📅 Kapan: ${data.when}</div>
        <div class="b16-s166-explain-why">Mengapa: ${data.why}</div>
      </div>`;
    explain.appendChild(head);

    if(data.fields&&data.fields.length){
      const fe=document.createElement('div');fe.className='b16-s166-fe';
      const lbl=document.createElement('div');lbl.className='b16-s166-fe-lbl';lbl.textContent='Field penting:';
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
        {cls:'s165-done',icon:'⬇️',title:'Download semua headers (80 byte/block)',desc:'~70 MB total untuk seluruh blockchain. Cepat.',time:'~5 menit'},
        {cls:'s165-done',icon:'⬇️',title:'Download semua block data',desc:'~650 GB total. Ini yang paling lama dari segi waktu download.',time:'~2-12 jam'},
        {cls:'s165-done',icon:'✅',title:'Validasi struktur setiap block',desc:'Proof-of-work, timestamp, ukuran, merkle root — semua block dari genesis.',time:'~1-3 jam'},
        {cls:'s165-done',icon:'🔐',title:'Verifikasi SEMUA signature',desc:'Ini yang paling CPU-intensive. Setiap input dari setiap transaksi dari setiap block diverifikasi.',time:'~10-50 jam'},
        {cls:'s165-done',icon:'🗃️',title:'Bangun UTXO set dari genesis',desc:'Setiap output ditambahkan, setiap yang dibelanjakan dihapus. Hasil akhir: chainstate yang akurat.',time:'~1-2 jam'},
      ],
      trust:'IBD penuh tidak membutuhkan kepercayaan kepada siapapun — setiap byte, setiap signature diverifikasi sendiri oleh node kamu. Ini adalah gold standard verifikasi Bitcoin. Gunakan -assumevalid=0 untuk mengaktifkan mode ini.',
    },
    assumevalid:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download semua headers',desc:'~70 MB. Identik dengan IBD penuh.',time:'~5 menit'},
        {cls:'s165-done',icon:'⬇️',title:'Download semua block data',desc:'~650 GB. Block tetap didownload seluruhnya — tidak ada yang di-skip.',time:'~2-12 jam'},
        {cls:'s165-done',icon:'✅',title:'Validasi struktur setiap block',desc:'Proof-of-work, timestamp, ukuran, merkle root — tetap divalidasi untuk semua block.',time:'~1-3 jam'},
        {cls:'s165-skip',icon:'⏩',title:'Signature block lama DI-SKIP',desc:'Untuk block sebelum assumevalid hash, signature tidak diverifikasi. Ini yang menghemat waktu paling banyak.',time:'di-skip'},
        {cls:'s165-done',icon:'🗃️',title:'Bangun UTXO set dari genesis',desc:'UTXO set tetap dibangun secara penuh dari semua transaksi. Tidak ada jalan pintas di sini.',time:'~1-2 jam'},
      ],
      trust:'assumevalid bukan kepercayaan buta. Kalau hash yang di-hardcode salah, node akan membangun UTXO set yang berselisih dengan jaringan dan langsung ketahuan. Source code terbuka dan diaudit ribuan developer. Kamu juga bisa menonaktifkan dengan -assumevalid=0 kapanpun.',
    },
    assumeutxo:{
      phases:[
        {cls:'s165-snap',icon:'📦',title:'Muat snapshot UTXO set (~11 GB)',desc:'File snapshot berisi semua UTXO pada block height tertentu.',time:'~5-10 menit'},
        {cls:'s165-done',icon:'🔍',title:'Verifikasi hash snapshot',desc:'Node memverifikasi bahwa hash snapshot cocok dengan yang di-hardcode. Kalau tidak cocok, ditolak.',time:'~1 menit'},
        {cls:'s165-done',icon:'✅',title:'Node langsung beroperasi',desc:'Setelah snapshot diverifikasi, node sudah bisa memvalidasi transaksi baru dan block terbaru.',time:'SELESAI ✓'},
        {cls:'s165-bg',  icon:'🔄',title:'Verifikasi historis di background',desc:'Node mendownload dan memverifikasi blockchain dari genesis di background sambil tetap beroperasi normal.',time:'~4-8 jam (bg)'},
        {cls:'s165-done',icon:'🎯',title:'Background sync selesai',desc:'Chainstate dari snapshot sudah diverifikasi secara independen. Node setara dengan IBD normal.',time:'~4-8 jam total'},
      ],
      trust:'assumeUTXO menggunakan snapshot yang hash-nya di-hardcode dan bisa diaudit siapapun. Kalau snapshot berisi UTXO yang salah, background verification akan menemukan inkonsistensi. Desainnya memastikan node akan self-correct bahkan kalau snapshot salah.',
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
      trust.innerHTML=`<div class="b16-s165-trust-label">Analisis kepercayaan (trust model):</div>
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
    {id:'getblockchaininfo_av',code:'bitcoin-cli getblockchaininfo',hint:'Cek assumevalid status',
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
       {k:'"verificationprogress"',v:'0.9999982341',d:'Progress sync mendekati 1.0 berarti node hampir selesai. Dihitung dari chainwork, bukan jumlah block.'},
       {k:'"chainwork"',v:'"00000...7b4e"',d:'Total proof-of-work terakumulasi. Dibandingkan dengan assumevalid hash untuk menentukan block mana yang signature-nya di-skip.'},
     ],
     note:'assumevalid hash di-hardcode di source code dan diperbarui tiap rilis baru. Untuk melihat nilai yang dipakai, cek source code atau gunakan -assumevalid=0 untuk menonaktifkan.'},
    {id:'assumevalid_disable',code:'bitcoind -assumevalid=0',hint:'Nonaktifkan assumevalid (verifikasi penuh)',
     output:[
       ['# Jalankan bitcoind dengan flag ini untuk IBD penuh','s165-tcm'],
       ['# Semua signature dari block 0 akan diverifikasi','s165-tcm'],
       ['# Estimasi waktu: 3-10x lebih lama dari default','s165-tcm'],
       ['','s165-tgy'],
       ['Bitcoin Core starting...','s165-tw'],
       ['Loaded 0 addresses from peers.dat','s165-tgy'],
       ['assumevalid is disabled, verifying all signatures','s165-tn'],
       ['UpdateTip: new best=00000...a4b height=1 ...','s165-tgy'],
     ],
     fields:[
       {k:'-assumevalid=0',v:'disable',d:'Menonaktifkan assumevalid sepenuhnya. Node akan memverifikasi setiap signature dari genesis block.'},
       {k:'alternatif',v:'-assumevalid=hash',d:'Bisa diisi hash block tertentu untuk menentukan sendiri cutoff point assumevalid.'},
     ],
     note:'Gunakan -assumevalid=0 kalau kamu ingin verifikasi paling menyeluruh. Prosesnya jauh lebih lama tapi memberikan jaminan keamanan tertinggi tanpa kepercayaan apapun kepada developer.'},
    {id:'loadtxoutset',code:'bitcoin-cli loadtxoutset /path/to/utxo-870000.dat',hint:'Muat snapshot assumeUTXO',
     output:[
       ['{','s165-tgy'],
       ['  "coins_loaded":  ','s165-tb'],['184218954','s165-tn'],[',','s165-tgy'],
       ['  "tip_hash":      ','s165-tb'],['"00000000000000000001a4b..."','s165-ts'],[',','s165-tgy'],
       ['  "base_height":   ','s165-tb'],['870000','s165-tn'],[',','s165-tgy'],
       ['  "path":          ','s165-tb'],['"\/path\/to\/utxo-870000.dat"','s165-ts'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"coins_loaded"',v:'184.218.954',d:'Jumlah UTXO yang berhasil dimuat dari snapshot.'},
       {k:'"base_height"',v:'870000',d:'Block height dari snapshot. Node langsung bisa memvalidasi block di atas height ini setelah snapshot dimuat.'},
       {k:'"tip_hash"',v:'"00000...a4b"',d:'Hash block tip dari snapshot. Diverifikasi cocok dengan yang di-hardcode sebelum digunakan.'},
     ],
     note:'File snapshot assumeUTXO bisa didapatkan dari berbagai sumber — tapi selalu verifikasi hash-nya. Node akan menolak snapshot yang hash-nya tidak cocok dengan yang di-hardcode di source code.'},
    {id:'getchainstates',code:'bitcoin-cli getchainstates',hint:'Status background sync setelah assumeUTXO',
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
       ['      # background verification: 48.7% selesai','s165-tcm'],
       ['    }','s165-tgy'],
       ['  ]','s165-tgy'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'chainstate aktif [0]',v:'blocks: 870142',d:'Chainstate dari snapshot yang digunakan untuk validasi transaksi baru. Sudah di block terbaru.'},
       {k:'chainstate background [1]',v:'blocks: 423819',d:'Background verification sedang di block 423.819 dari 870.142. ~48.7% selesai.'},
       {k:'"snapshot_blockhash"',v:'"00000...a4b"',d:'Hash snapshot yang digunakan. null pada chainstate background berarti ini IBD normal dari genesis.'},
     ],
     note:'getchainstates menunjukkan dua chainstate berjalan paralel: satu dari snapshot (aktif) dan satu dari genesis (background). Setelah background sync selesai, keduanya di-merge menjadi satu.'},
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
    l1.textContent=prunedPct>18?'Block divalidasi & dihapus':'';seg1.appendChild(l1);
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
      marker.textContent='Prune height ~#'+pruneBlock.toLocaleString('id-ID');
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
    if(pruneEl) pruneEl.textContent='~'+prunedBlocks.toLocaleString('id-ID');
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
    {id:'getblockchaininfo_prune',code:'bitcoin-cli getblockchaininfo',hint:'Cek status pruning',isErr:false,
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
       {k:'"pruned"',v:'true',d:'true = node berjalan dalam mode pruning. false = full archival node.',err:false},
       {k:'"pruneheight"',v:'869592',d:'Block height tertua yang masih ada di disk. Block di bawah ini sudah dihapus. Angka ini naik seiring waktu.',err:false},
       {k:'"prune_target_size"',v:'576716800',d:'Target ukuran maksimum block files dalam bytes. 576.716.800 = 550 MB (nilai minimum).',err:false},
     ],
     note:'"pruneheight" adalah kunci untuk tahu block mana yang masih bisa diakses. Kalau kamu ingin getblock untuk block lama, pastikan block height-nya di atas pruneheight.',
     noteType:'normal'},
    {id:'pruneblockchain',code:'bitcoin-cli pruneblockchain 850000',hint:'Manual prune hingga block tertentu',isErr:false,
     output:[['869142','s164-tn']],
     fields:[
       {k:'parameter: 850000',v:'target height',d:'Block height target untuk pruning. Node akan menghapus block lama hingga mendekati height ini.',err:false},
       {k:'output: 869142',v:'actual height',d:'Block height aktual yang berhasil di-prune. Bisa lebih tinggi dari target kalau node perlu menjaga undo data untuk beberapa block terakhir.',err:false},
     ],
     note:'Manual pruning hanya bisa dilakukan kalau prune=1 di bitcoin.conf (mode manual) atau node sudah dalam mode pruning. Tidak bisa dijalankan di full archival node.',
     noteType:'normal'},
    {id:'getblockchaininfo_full',code:'bitcoin-cli getblockchaininfo  # full archival',hint:'Node full archival (pruning off)',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned": ','s164-tb'],['false','s164-tbf'],[',','s164-tgy'],
       ['  # pruneheight tidak ada di output','s164-tcm'],
       ['  # semua block dari genesis tersedia','s164-tcm'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'false',d:'false = full archival node. Semua block tersedia. "pruneheight" tidak muncul.',err:false},
       {k:'storage dibutuhkan',v:'~650 GB+',d:'Full archival menyimpan semua block sejak genesis. Bertambah ~50-60 GB per tahun.',err:false},
     ],
     note:'Full archival node bisa melayani block lama kepada peer yang sedang IBD — berkontribusi lebih ke jaringan. Butuh storage jauh lebih besar tapi lebih baik untuk kesehatan jaringan.',
     noteType:'normal'},
    {id:'err_getblock',code:'bitcoin-cli getblock "00000...lama" 1',hint:'TIDAK bisa di pruned node',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-1','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],['"Block not available (pruned data)"','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -1',v:'Block not available',d:'Node mengembalikan error ini kalau kamu mencoba mengakses block yang sudah di-prune dan tidak ada lagi di disk.',err:true},
       {k:'solusi',v:'gunakan archival node',d:'Untuk mengakses block historis, kamu butuh full archival node atau layanan block explorer seperti mempool.space.',err:true},
     ],
     note:'Ini adalah error yang paling sering ditemui pengguna baru pruned node. Kalau kamu butuh akses ke block historis secara rutin, pertimbangkan untuk tidak mengaktifkan pruning.',
     noteType:'err'},
    {id:'err_getrawtx',code:'bitcoin-cli getrawtransaction "txid"',hint:'TIDAK bisa tanpa txindex',isErr:true,
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
       {k:'error code: -5',v:'No such mempool tx',d:'Node tidak bisa mencari transaksi historis tanpa txindex karena pruned node tidak punya indeks transaksi.',err:true},
       {k:'solusi 1: -txindex',v:'tidak kompatibel',d:'txindex tidak bisa dijalankan bersamaan dengan pruning. Harus pilih salah satu.',err:true},
       {k:'solusi 2: block hash',v:'getblock "hash" 2',d:'Kalau tahu block hash-nya, gunakan getblock dengan verbosity 2 — tapi hanya untuk block yang belum di-prune.',err:true},
     ],
     note:'Pruned node + txindex tidak kompatibel. Kalau kamu butuh getrawtransaction untuk transaksi historis, kamu harus menjalankan full archival node dengan txindex=1 di bitcoin.conf.',
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
    {max:900,  cls:'s163-bad',  text:'<strong>Default / Terlalu kecil (< 900 MB):</strong> Meja kerja sempit. Node sering baca disk saat IBD, sync lebih lambat. Cocok hanya kalau RAM sangat terbatas.'},
    {max:2000, cls:'s163-ok',   text:'<strong>Cukup (900 MB - 2 GB):</strong> Meja kerja layak. IBD lebih cepat dari default. Cocok untuk node dengan RAM 4-8 GB.'},
    {max:8000, cls:'s163-good', text:'<strong>Optimal (2 GB - 8 GB):</strong> Meja kerja luas. Sebagian besar UTXO set muat di RAM. IBD sangat cepat. Disarankan untuk node baru yang sedang IBD.'},
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
    {id:'gettxoutsetinfo',code:'bitcoin-cli gettxoutsetinfo',hint:'Statistik UTXO set',
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
       {k:'"txouts"',v:'184.218.954',d:'Total UTXO yang ada saat ini. Setiap angka adalah satu output yang belum dibelanjakan di seluruh jaringan Bitcoin.'},
       {k:'"total_amount"',v:'19.720.483 BTC',d:'Jumlah semua UTXO = total BTC yang beredar. Bisa digunakan untuk memverifikasi bahwa tidak ada BTC yang diciptakan di luar jadwal.'},
       {k:'"disk_size"',v:'~11 GB',d:'Ukuran chainstate di disk dalam bytes setelah kompresi LevelDB.'},
       {k:'"muhash"',v:'"a3f8c2e1..."',d:'Hash dari seluruh UTXO set menggunakan MuHash. Digunakan untuk verifikasi assumeUTXO snapshot.'},
     ],
     note:'Command ini agak lambat karena harus membaca seluruh chainstate database. Di node dengan SSD biasanya selesai dalam 30-120 detik. "total_amount" adalah cara terbaik memverifikasi bahwa supply Bitcoin sesuai jadwal.'},
    {id:'gettxout',code:'bitcoin-cli gettxout "a1b2c3...txid" 0',hint:'Query satu UTXO spesifik',
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
       {k:'"value"',v:'0.05000000',d:'Nilai UTXO dalam BTC. Node menyimpan ini sebagai satoshi (5.000.000 sat) di LevelDB.'},
       {k:'"confirmations"',v:'14382',d:'Berapa block sudah dikonfirmasi sejak UTXO ini dibuat. Semakin besar, semakin tua dan aman UTXO ini.'},
       {k:'"type"',v:'"witness_v1_taproot"',d:'Jenis locking script. Taproot = SegWit v1. Ini menentukan bagaimana UTXO bisa dibelanjakan.'},
       {k:'"coinbase"',v:'false',d:'true berarti UTXO ini dari reward miner. UTXO coinbase butuh 100 konfirmasi sebelum bisa dibelanjakan.'},
     ],
     note:'Kalau output dari command ini null, berarti UTXO tersebut sudah dibelanjakan atau tidak pernah ada. Cara langsung untuk mengecek apakah sebuah output masih bisa dipakai.'},
    {id:'getmemoryinfo',code:'bitcoin-cli getmemoryinfo',hint:'Info penggunaan memori node',
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
       {k:'"used"',v:'65536',d:'Memori yang sedang digunakan node dalam bytes. Tidak termasuk dbcache yang dikelola terpisah.'},
       {k:'"total"',v:'458752',d:'Total memori yang dialokasikan untuk node (di luar dbcache). ~448 KB untuk overhead node.'},
       {k:'"locked"',v:'65536',d:'Memori yang di-lock ke RAM dan tidak bisa di-swap ke disk. Untuk data sensitif seperti kunci wallet.'},
     ],
     note:'Command ini menunjukkan penggunaan memori internal node, tidak termasuk dbcache. Untuk melihat total penggunaan RAM termasuk dbcache, gunakan tools OS seperti "top" atau "htop" dan cari proses bitcoind.'},
    {id:'savemempool',code:'bitcoin-cli savemempool',hint:'Simpan mempool ke disk',
     output:[
       ['{','s163-tgy'],
       ['  "filename": ','s163-tb'],['"~/.bitcoin/mempool.dat"','s163-ts'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"filename"',v:'"mempool.dat"',d:'Path file tempat mempool disimpan. Node otomatis memuat file ini saat restart sehingga transaksi tidak hilang.'},
     ],
     note:'Node menyimpan mempool secara otomatis saat shutdown normal. Gunakan savemempool kalau ingin memaksa flush ke disk — berguna sebelum backup atau restart yang direncanakan.'},
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
    {icon:'📦',title:'1. Struktur dasar block valid',
     desc:'Node memeriksa apakah block punya semua field wajib: version, previousblockhash, merkleroot, time, bits, nonce. Block dengan struktur rusak langsung ditolak.',
     val:'version=536870916, size=1.247.832 bytes — ok'},
    {icon:'⛏️',title:'2. Proof-of-Work valid',
     desc:'Hash dari header block harus di bawah target difficulty saat ini. Tidak bisa dipalsukan tanpa mengeluarkan energi nyata. Pemeriksaan ini paling cepat dan dilakukan pertama.',
     val:'hash: 00000000000000000001a4b... < target: 0000000000000000000395... — VALID'},
    {icon:'🔗',title:'3. previousblockhash cocok',
     desc:'Field previousblockhash harus cocok dengan hash block terbaru yang sudah divalidasi node. Ini yang membuat blockchain tidak bisa diubah tanpa merekompute seluruh chain.',
     val:'00000000000000000002f... — cocok dengan tip #870141 ✓'},
    {icon:'🕐',title:'4. Timestamp dalam range yang diizinkan',
     desc:'Timestamp harus lebih besar dari Median Time Past (MTP) 11 block terakhir, dan tidak lebih dari 2 jam di masa depan. Ini mencegah manipulasi waktu oleh miner.',
     val:'time=1717459200 > MTP=1717456800, delta from now=+12s — ok'},
    {icon:'📏',title:'5. Ukuran block tidak melebihi batas',
     desc:'Total weight block tidak boleh melebihi 4.000.000 weight units. Non-witness data dihitung 4x lebih berat dari witness data.',
     val:'3.998.832 weight units < 4.000.000 limit — ok (99.97% penuh)'},
    {icon:'🪙',title:'6. Coinbase transaction valid',
     desc:'Reward yang diklaim miner tidak boleh melebihi block subsidy ditambah total fee semua transaksi. Miner yang overclaim akan ditolak seluruh jaringan.',
     val:'coinbase: 3.25437891 BTC = subsidy(3.125) + fees(0.12937891) — ok'},
    {icon:'🌳',title:'7. Merkle root cocok dengan semua transaksi',
     desc:'Node menghitung ulang merkle root dari semua txid dan membandingkan dengan yang ada di header. Satu transaksi yang dimanipulasi akan mengubah merkle root sepenuhnya.',
     val:'merkle root: 4a5e1e4b... — cocok dengan 3.847 transaksi ✓'},
    {icon:'✍️',title:'8. Semua signature transaksi valid',
     desc:'Untuk setiap input transaksi, node menjalankan script Bitcoin dan memverifikasi signature kriptografi. Bagian paling CPU-intensive, dijalankan paralel di semua core.',
     val:'3.847 tx, 12.341 input — semua signature valid ✓'},
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
    if(ind) ind.textContent=`${Math.max(0,step+1)} / ${CHECKS.length} pemeriksaan`;
    if(btn) btn.disabled=step>=CHECKS.length-1;
    if(verd){
      if(step<0){verd.className='b16-s162-verdict s162-idle';verd.textContent='Klik "Verifikasi Berikutnya" — node baru saja menerima block #870.142 dari peer.';}
      else if(step<CHECKS.length-1){verd.className='b16-s162-verdict s162-prog';verd.textContent=`Sedang memeriksa: ${CHECKS[step].title.replace(/^\d+\. /,'')}`;}
      else{verd.className='b16-s162-verdict s162-ok';verd.textContent='Semua 8 pemeriksaan lulus. Block #870.142 diterima dan ditambahkan ke chain lokal. Node meneruskan block ini ke peer lain.';}
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
    {id:'getblockcount',code:'bitcoin-cli getblockcount',hint:'Jumlah block saat ini',
     output:[['870142','s162-tnum']],
     fields:[{k:'output',v:'870142',d:'Integer langsung — jumlah block yang sudah divalidasi. Block genesis = 0, jadi total 870.143 block di chain.'}],
     note:'Command paling ringan untuk cek ketinggian chain. Output berupa integer biasa, bukan JSON. Tidak memerlukan sambungan wallet.'},
    {id:'getbestblockhash',code:'bitcoin-cli getbestblockhash',hint:'Hash block terbaru',
     output:[['"00000000000000000001a4b2c8d9e7f3a6b5c4d1e2f0a9b8c7d6e5f4a3b2c1d0"','s162-tstr']],
     fields:[{k:'output',v:'"00000...c1d0"',d:'Hash 256-bit dari block tip saat ini. Gunakan hash ini sebagai argumen getblock untuk melihat detail block.'}],
     note:'Hash block selalu dimulai dengan banyak angka nol karena proof-of-work. Semakin banyak nol di depan, semakin besar difficulty yang dibutuhkan.'},
    {id:'getblock',code:'bitcoin-cli getblock "00000...a4b" 1',hint:'Detail block lengkap',
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
       {k:'"confirmations"',v:'1',d:'Berapa block sudah dibangun di atas block ini. Block terbaru = 1. Bertambah setiap block baru ditemukan.'},
       {k:'"nTx"',v:'3847',d:'Jumlah transaksi dalam block, termasuk coinbase sebagai transaksi pertama.'},
       {k:'"weight"',v:'3998832',d:'Total weight dalam weight units. Maksimum 4.000.000. Block ini 99.97% penuh.'},
       {k:'"nonce"',v:'3826969040',d:'Angka yang diubah-ubah miner saat mining. Rentang 0-4.294.967.295.'},
       {k:'"bits"',v:'"17034219"',d:'Target difficulty dalam format compact. Dikonversi ke 256-bit untuk dibandingkan dengan hash block.'},
     ],
     note:'Verbosity 1 = semua txid tanpa detail transaksi. Verbosity 2 = detail penuh setiap transaksi (output sangat besar). Verbosity 0 = raw hex block.'},
    {id:'verifychain',code:'bitcoin-cli verifychain 3 6',hint:'Verifikasi integritas chain',
     output:[['true','s162-tbt']],
     fields:[
       {k:'param 1: checklevel',v:'3',d:'0=baca block, 1=undo data, 2=validasi, 3=disconnect & reconnect tip, 4=reconnect semua block.'},
       {k:'param 2: nblocks',v:'6',d:'Jumlah block yang diperiksa dari tip ke belakang. Nilai 0 = periksa semua (sangat lama).'},
       {k:'output: true',v:'true',d:'Semua pemeriksaan lulus. false berarti database korup, perlu reindex.'},
     ],
     note:'Berguna setelah crash atau pemadaman tiba-tiba untuk memastikan database node tidak korup. Checklevel 3 dengan 6 block adalah balance yang baik antara kecepatan dan ketepatan.'},
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
        {key:'"chain"',val:'"main"',desc:'Jaringan yang dijalankan: main (mainnet), test (testnet), signet, atau regtest.',hl:false},
        {key:'"blocks"',val:'870142',desc:'Jumlah block yang sudah divalidasi penuh. Kalau sama dengan "headers", node sudah sync.',hl:true},
        {key:'"headers"',val:'870142',desc:'Jumlah header block yang diketahui. Lebih besar dari "blocks" saat masih IBD.',hl:true},
        {key:'"verificationprogress"',val:'0.9999982341',desc:'Progress sync dari 0 hingga 1. Nilai 1.0 berarti node sudah sepenuhnya sync dengan chain terbaru.',hl:true},
        {key:'"initialblockdownload"',val:'false',desc:'true = masih IBD, belum bisa diandalkan. false = sudah sync dan siap digunakan.',hl:true},
        {key:'"difficulty"',val:'88171509232073',desc:'Difficulty mining saat ini. Semakin tinggi, semakin banyak hash yang dibutuhkan per block.',hl:false},
        {key:'"mediantime"',val:'1717456800',desc:'Median Time Past (MTP) dari 11 block terakhir. Digunakan protokol untuk validasi timelock.',hl:false},
        {key:'"chainwork"',val:'"00000...7b4e"',desc:'Total proof-of-work yang terakumulasi dalam format hex. Ini yang menentukan chain mana yang terberat.',hl:false},
        {key:'"pruned"',val:'false',desc:'true = pruning mode aktif (block lama sudah dihapus). false = full archival node.',hl:false},
      ],
      note:'Command ini adalah cara paling cepat untuk mengecek apakah node sudah sync. Kalau "initialblockdownload" masih true, jangan gunakan node ini untuk memverifikasi pembayaran.',
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
        {key:'"version"',val:'270000',desc:'Versi software client yang berjalan. 270000 = versi 27.0.0.',hl:false},
        {key:'"blocks"',val:'870142',desc:'Block terakhir yang divalidasi.',hl:true},
        {key:'"verificationprogress"',val:'"99.9998%"',desc:'Progress sync dalam format persentase yang mudah dibaca.',hl:true},
        {key:'"connections"',val:'{in:8, out:10}',desc:'Jumlah koneksi inbound dan outbound. Minimal 8 outbound untuk keamanan optimal.',hl:true},
        {key:'"timeoffset"',val:'0',desc:'Selisih waktu antara jam node dengan waktu jaringan. Idealnya 0 atau sangat kecil.',hl:false},
        {key:'"relayfee"',val:'0.00001000',desc:'Fee rate minimum yang mau di-relay oleh node ini (dalam BTC/kB). Transaksi di bawah ini tidak akan diteruskan.',hl:false},
      ],
      note:'Flag -getinfo (dengan tanda minus di depan) memberikan ringkasan yang lebih singkat dan mudah dibaca. Tidak perlu sambungan wallet untuk command ini.',
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
        ['# Peer 4 (tertinggal)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"192.0.2.88:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['869998','jnum'],
      ],
      fields:[
        {key:'"addr"',val:'"203.0.113.42:8333"',desc:'Alamat IP dan port peer. Port 8333 adalah port default Bitcoin mainnet. Alamat .onion berarti peer terhubung via Tor.',hl:false},
        {key:'"synced_blocks"',val:'870142',desc:'Block terakhir yang diketahui peer ini sudah divalidasi. Kalau sama dengan blocks node kamu, peer ini juga sudah sync penuh.',hl:true},
        {key:'Peer dengan 869998',val:'144 block di belakang',desc:'Node client secara otomatis memprioritaskan download dari peer yang lebih updated. Peer yang tertinggal jauh akan di-deprioritaskan.',hl:true},
      ],
      note:'Selama IBD, software client mendownload block secara paralel dari banyak peer sekaligus. Command ini berguna untuk memastikan kamu terhubung ke peer yang sudah sync.',
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
        {key:'"subversion"',val:'"/Satoshi:27.0.0/"',desc:'User agent yang dikirim ke peer lain saat handshake. Ini yang peer lain lihat sebagai "identitas" software kamu.',hl:false},
        {key:'"protocolversion"',val:'70016',desc:'Versi protokol P2P Bitcoin. Menentukan fitur apa yang bisa dikomunikasikan antar node.',hl:true},
        {key:'"connections_in"',val:'8',desc:'Peer yang aktif konek ke node kamu. Hanya mungkin kalau port 8333 terbuka dan bisa diakses dari internet.',hl:true},
        {key:'"connections_out"',val:'10',desc:'Peer yang node kamu konek ke mereka. Outbound connection lebih aman karena kamu yang memilih peer-nya.',hl:true},
        {key:'"networkactive"',val:'true',desc:'false berarti node dalam mode offline — tidak menerima atau mengirim data ke peer manapun.',hl:false},
        {key:'"localaddresses"',val:'"203.0.113.100:8333"',desc:'IP address publik yang diiklankan ke jaringan. Kalau kosong, node tidak dapat menerima koneksi inbound.',hl:false},
      ],
      note:'Node dengan connections_in > 0 bisa diakses dari internet dan membantu jaringan sebagai relay. Node dengan hanya outbound connection tetap bisa memverifikasi transaksi dengan aman.',
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
      id:'fullnode',icon:'🖥️',name:'Full Node (Bitcoin Core / Knots)',model:'Full verifikasi — download semua block',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privasi: Maksimal',trustBadge:'s176-trust-zero',trustLabel:'Trust: Zero',
      subtitle:'Baseline — verifikasi penuh tanpa asumsi kepercayaan apapun',
      desc:'Full node mendownload, memverifikasi, dan menyimpan seluruh blockchain. Setiap transaksi, setiap signature, setiap aturan konsensus diverifikasi secara mandiri. Ini adalah gold standard verifikasi Bitcoin — tidak perlu mempercayai siapapun, karena kamu verifikasi sendiri.',
      specs:[
        {cls:'s176-good',label:'Model verifikasi',val:'Download + verifikasi semua block sejak genesis'},
        {cls:'s176-good',label:'Privasi',val:'Tidak ada pihak ketiga yang tahu address atau transaksi kamu'},
        {cls:'s176-ok',  label:'Storage',val:'~650 GB (full) atau ~550 MB minimum (pruned)'},
        {cls:'s176-ok',  label:'Waktu setup',val:'4-72 jam IBD tergantung hardware dan metode sync'},
      ],
      forwho:['Developer yang butuh akses penuh ke blockchain','Merchant yang menerima pembayaran bernilai besar','Siapapun yang ingin verifikasi mandiri penuh tanpa trust','Operator Lightning node yang butuh verifikasi penuh'],
      tradeoff:'Trade-off utama: membutuhkan hardware yang layak (minimal 2 GB RAM, 650 GB+ storage) dan waktu setup yang lama. Untuk pengguna biasa, ini bisa terlalu berat. Tapi ini satu-satunya cara untuk benar-benar zero trust.',
    },
    {
      id:'electrum_own',icon:'⚡',name:'Electrum — Server Sendiri',model:'Server query + Electrum protocol',
      wc:'#0F6E56',wb:'#EAF3DE',privBadge:'s176-priv-high',privLabel:'Privasi: Tinggi',trustBadge:'s176-trust-low',trustLabel:'Trust: Server kamu',
      subtitle:'SPV hybrid — query cepat ke server yang kamu kontrol sendiri',
      desc:'Electrum adalah wallet Bitcoin populer sejak 2011. Alih-alih SPV murni, Electrum terhubung ke Electrum server yang sudah memproses blockchain. Dengan menjalankan Electrum server sendiri di atas full node, kamu mendapat kecepatan query Electrum dengan privasi setara full node.',
      specs:[
        {cls:'s176-good',label:'Model verifikasi',val:'Query ke Electrum server (SPV hybrid)'},
        {cls:'s176-good',label:'Privasi (server sendiri)',val:'Server adalah milikmu — tidak ada pihak ketiga'},
        {cls:'s176-good',label:'Kecepatan',val:'Sangat cepat — server sudah index blockchain'},
        {cls:'s176-ok',  label:'Kompleksitas',val:'Butuh menjalankan Electrum server + full node'},
      ],
      forwho:['Pengguna yang butuh transaksi historis lengkap tanpa full node di client','Developer yang ingin wallet cepat dengan privasi tinggi','Pengguna yang sudah punya full node dan mau tambahkan Electrum'],
      tradeoff:'Trade-off: menjalankan Electrum server sendiri cukup kompleks dan butuh full node di bawahnya. Kalau kamu tidak mau mengelola server, opsi ini kurang praktis.',
    },
    {
      id:'neutrino',icon:'🔮',name:'Neutrino — BIP 157/158 Murni',model:'Compact block filters — SPV yang benar-benar privat',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privasi: Baik',trustBadge:'s176-trust-low',trustLabel:'Trust: Mayoritas jujur',
      subtitle:'Implementasi BIP 157/158 murni — dipakai Phoenix, Breez, dan lnd',
      desc:'Neutrino adalah light client Bitcoin dalam Go yang dikembangkan Lightning Labs. Ia mengimplementasikan BIP 157/158 (compact block filters) secara penuh. Neutrino dipakai sebagai backend untuk Phoenix Wallet, Breez, dan implementasi lnd mode light.',
      specs:[
        {cls:'s176-good',label:'Model verifikasi',val:'BIP 157/158 compact block filters — klien filter sendiri'},
        {cls:'s176-good',label:'Privasi',val:'Node tidak tahu address yang dicari — jauh lebih baik dari BIP 37'},
        {cls:'s176-ok',  label:'Bandwidth',val:'~500 MB - 2 GB untuk download semua filter (total)'},
        {cls:'s176-good',label:'Cocok untuk',val:'Mobile wallet + Lightning Network node ringan'},
      ],
      forwho:['Pengguna Lightning Network mobile (Phoenix, Breez)','Developer yang butuh light client dengan privasi yang baik','Pengguna yang tidak mau full node tapi peduli privasi'],
      tradeoff:'Trade-off: butuh lebih banyak bandwidth dari BIP 37 karena harus download semua filter. Tapi privasi yang didapat jauh lebih baik. Waktu sync awal lebih lama dari wallet biasa.',
    },
    {
      id:'electrum_pub',icon:'⚡',name:'Electrum — Server Publik',model:'Server query ke server yang dikelola orang lain',
      wc:'#854F0B',wb:'#FAEEDA',privBadge:'s176-priv-med',privLabel:'Privasi: Sedang',trustBadge:'s176-trust-med',trustLabel:'Trust: Operator server',
      subtitle:'Opsi default Electrum — cepat tapi server tahu address kamu',
      desc:'Kalau kamu menggunakan Electrum tanpa menjalankan server sendiri, Electrum terhubung ke server publik yang dijalankan komunitas atau perusahaan. Server ini tahu address yang kamu query, balance kamu, dan transaksi yang kamu buat. Masih jauh lebih baik dari custodial exchange, tapi bukan solusi zero trust.',
      specs:[
        {cls:'s176-ok',  label:'Model verifikasi',val:'Query ke server publik — cepat tapi ada trust'},
        {cls:'s176-ok',  label:'Privasi',val:'Server operator tahu address dan transaksi kamu'},
        {cls:'s176-good',label:'Kemudahan',val:'Langsung bisa digunakan — tidak perlu setup tambahan'},
        {cls:'s176-good',label:'Kecepatan',val:'Sangat cepat — server sudah index blockchain'},
      ],
      forwho:['Pengguna baru yang baru mengenal self-custody','Pengguna yang butuh wallet cepat tanpa mengelola server','Transaksi sehari-hari dengan nilai tidak terlalu besar'],
      tradeoff:'Trade-off utama: server operator tahu address-address kamu. Untuk meningkatkan privasi, gunakan Tor saat terhubung ke Electrum server publik, atau pertimbangkan beralih ke server sendiri.',
    },
    {
      id:'mobile',icon:'📱',name:'Wallet Mobile Biasa',model:'Backend server — bukan SPV sesungguhnya',
      wc:'#A32D2D',wb:'#FCEBEB',privBadge:'s176-priv-low',privLabel:'Privasi: Rendah',trustBadge:'s176-trust-high',trustLabel:'Trust: Developer wallet',
      subtitle:'Trust.Wallet, Exodus, dan mayoritas wallet mobile populer',
      desc:'Banyak wallet mobile yang mengklaim "SPV" sebenarnya terhubung ke server backend yang dikontrol developer wallet tersebut. Mereka tidak mendownload header chain atau melakukan verifikasi PoW sama sekali — mereka hanya query API server developer. Ini adalah custodial-lite: kamu pegang private key tapi verifikasi dilakukan oleh orang lain.',
      specs:[
        {cls:'s176-warn',label:'Model verifikasi',val:'Query ke server developer — bukan SPV sesungguhnya'},
        {cls:'s176-warn',label:'Privasi',val:'Developer tahu semua address, balance, dan transaksi kamu'},
        {cls:'s176-good',label:'Kemudahan',val:'Sangat mudah — install dan langsung pakai'},
        {cls:'s176-warn',label:'Trust',val:'Harus percaya developer wallet tidak berbohong tentang balance'},
      ],
      forwho:['Pengguna baru yang baru mulai belajar Bitcoin','Jumlah kecil untuk transaksi sehari-hari','Pengguna yang belum siap mengelola infrastruktur apapun'],
      tradeoff:'Trade-off: sangat mudah digunakan tapi privasi sangat rendah dan harus mempercayai developer. Untuk jumlah besar atau pengguna yang peduli privasi, pertimbangkan beralih ke Electrum atau Neutrino.',
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
    fw.innerHTML=`<div class="b17-s176-forwho-label">Cocok untuk:</div>
      ${w.forwho.map(t=>`<div class="b17-s176-forwho-item">${t}</div>`).join('')}`;
    el.appendChild(fw);

    const to=document.createElement('div');to.className='b17-s176-tradeoff';
    to.innerHTML=`<div class="b17-s176-tradeoff-label">Trade-off utama:</div>${w.tradeoff}`;
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
      color:'s175-red',label:'Skenario Terrealistis',title:'Eclipse Attack',
      text:'Attacker mengisolasi SPV client dari jaringan jujur dengan mengontrol semua koneksi peer. Dari posisi ini, attacker bisa menyembunyikan transaksi yang masuk, memperlihatkan chain yang berbeda, atau menyensor transaksi keluar. Untuk berhasil, attacker perlu mengontrol seluruh koneksi network klien, tidak mudah tapi bukan tidak mungkin terutama untuk klien mobile di jaringan yang dikontrol ISP jahat.',
      metrics:[
        {cls:'s175-mred',label:'Tingkat kesulitan',val:'Sedang',sub:'Butuh kontrol atas koneksi network klien'},
        {cls:'s175-mamber',label:'Biaya attacker',val:'Menengah',sub:'Infrastruktur network + identifikasi target'},
        {cls:'s175-mamber',label:'Dampak potensial',val:'Signifikan',sub:'Bisa sembunyikan/manipulasi tx yang dilihat klien'},
      ],
      can:['Menyembunyikan transaksi masuk dari SPV','Memperlihatkan chain alternatif yang lebih pendek','Menyensor transaksi keluar ke jaringan','Membuat SPV pikir pembayaran belum dikonfirmasi'],
      cannot:['Mencuri bitcoin dari wallet klien','Membalikkan transaksi yang sudah di-chain utama','Menipu full node yang terhubung ke jaringan jujur','Melakukan ini tanpa mengontrol koneksi klien'],
      mitigations:[
        {icon:'🌐',text:'Hubungkan ke beberapa node berbeda — attacker harus mengontrol SEMUA koneksi untuk eclipse berhasil.'},
        {icon:'🧅',text:'Gunakan Tor atau VPN untuk menyulitkan attacker mengidentifikasi dan mengisolasi kamu.'},
        {icon:'🖥️',text:'Terhubung ke full node milik sendiri — kalau kamu menjalankan node sendiri, eclipse jauh lebih sulit.'},
      ],
    },
    doublespend:{
      color:'s175-amber',label:'Skenario Mahal & Jarang',title:'Double Spend Attack',
      text:'Attacker membayar merchant dengan transaksi Bitcoin, menunggu merchant mengirimkan barang setelah melihat konfirmasi di chain palsu, lalu membalikkan transaksi dengan mempublikasikan chain alternatif yang lebih panjang. Untuk menipu SPV, attacker butuh eclipse attack DAN menghasilkan chain alternatif dengan lebih banyak proof-of-work dari chain utama. Ini sangat mahal.',
      metrics:[
        {cls:'s175-mred',label:'Tingkat kesulitan',val:'Sangat Tinggi',sub:'Butuh hashrate signifikan + eclipse attack'},
        {cls:'s175-mred',label:'Biaya attacker',val:'Sangat Mahal',sub:'Mining equipment + listrik + network control'},
        {cls:'s175-mamber',label:'Kapan worth it?',val:'Nilai besar',sub:'Hanya worth it untuk transaksi bernilai sangat tinggi'},
      ],
      can:['Membalikkan tx jika berhasil eclipse + punya hashrate','Menipu SPV yang hanya menunggu sedikit konfirmasi','Membuat SPV melihat chain alternatif sebagai valid'],
      cannot:['Melakukan ini tanpa hashrate yang sangat besar','Menipu SPV yang menunggu banyak konfirmasi','Menipu full node yang terhubung ke chain utama','Memalsukan signature untuk mencuri dari wallet lain'],
      mitigations:[
        {icon:'⏳',text:'Tunggu lebih banyak konfirmasi untuk nilai besar. 6 konfirmasi = attacker perlu redo ~6 block dengan hashrate kompetitif.'},
        {icon:'💰',text:'Untuk transaksi bernilai sangat besar (>1 BTC), pertimbangkan menggunakan full node untuk verifikasi.'},
        {icon:'👁️',text:'Monitor apakah chain yang kamu lihat konsisten dengan explorer publik sebelum mengirim barang.'},
      ],
    },
    invalid:{
      color:'s175-green',label:'Skenario Hampir Mustahil',title:'Invalid Block Attack',
      text:'Attacker mencoba membuat SPV menerima block yang melanggar aturan konsensus Bitcoin, misalnya block yang menciptakan bitcoin lebih dari yang seharusnya. SPV tetap memverifikasi proof-of-work dari setiap header, jadi attacker harus menghabiskan energi nyata untuk membuat header yang valid. Namun SPV tidak verifikasi isi block secara penuh, sehingga block dengan transaksi invalid bisa lolos kalau tidak ada full node yang menolaknya.',
      metrics:[
        {cls:'s175-mgreen',label:'Tingkat kesulitan',val:'Ekstrem',sub:'Butuh eclipse + hashrate + tidak ada full node yang detect'},
        {cls:'s175-mgreen',label:'Proteksi jaringan',val:'Kuat',sub:'Full node di seluruh jaringan akan menolak block invalid'},
        {cls:'s175-mgreen',label:'Risiko praktis',val:'Sangat Rendah',sub:'Hampir tidak pernah terjadi di jaringan Bitcoin nyata'},
      ],
      can:['Membuat block dengan PoW valid tapi isi invalid (jika eclipse berhasil)','Menyembunyikan block rejection dari SPV yang terisolasi'],
      cannot:['Menipu jaringan luas — full node akan menolak block invalid','Melakukan ini tanpa mengisolasi SPV dari semua full node jujur','Memalsukan PoW tanpa mengeluarkan energi yang sangat besar','Membuat transaksi valid tanpa private key yang sesuai'],
      mitigations:[
        {icon:'🖥️',text:'Full node menolak block invalid secara otomatis. Semakin banyak full node di jaringan, semakin kuat perlindungan ini.'},
        {icon:'🔗',text:'Jaringan Bitcoin yang sehat dengan ribuan full node membuat serangan ini hampir mustahil secara praktis.'},
        {icon:'📡',text:'SPV yang terhubung ke beberapa node independen sangat sulit untuk sepenuhnya diisolasi dari jaringan jujur.'},
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
    cantEl.innerHTML=`<div class="b17-s175-cando-label">Attacker BISA:</div>${s.can.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    const canEl=document.createElement('div');canEl.className='b17-s175-cando s175-can';
    canEl.innerHTML=`<div class="b17-s175-cando-label">Attacker TIDAK BISA:</div>${s.cannot.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    candoWrap.appendChild(cantEl);candoWrap.appendChild(canEl);
    el.appendChild(candoWrap);

    const mitWrap=document.createElement('div');mitWrap.className='b17-s175-mitigations';
    const mitLabel=document.createElement('div');mitLabel.className='b17-s175-mit-label';mitLabel.textContent='Cara mitigasi:';
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
    {max:0, cls:'s175-conf-warn', txt:'0 konfirmasi (unconfirmed): BERISIKO. Transaksi belum masuk block sama sekali. Sangat mudah di-double spend. Jangan terima untuk nilai apapun.'},
    {max:1, cls:'s175-conf-ok',   txt:'1 konfirmasi: Cukup untuk nilai kecil sehari-hari (beli kopi, top-up). Biaya double spend masih relatif rendah, tapi untuk nilai kecil tidak worth it bagi attacker.'},
    {max:3, cls:'s175-conf-ok',   txt:'2-3 konfirmasi: Cukup aman untuk sebagian besar transaksi. Double spend butuh attacker menghasilkan 2-3 block kompetitif — mahal untuk nilai rata-rata.'},
    {max:6, cls:'s175-conf-safe', txt:'4-6 konfirmasi: Standar industri. Sangat aman untuk hampir semua transaksi. Biaya double spend sudah jauh melebihi nilai yang realistis untuk diserang.'},
    {max:12,cls:'s175-conf-safe', txt:'7-12 konfirmasi: Untuk transaksi bernilai sangat besar. Di titik ini, bahkan attacker dengan hashrate signifikan tidak bisa secara ekonomis melakukan double spend.'},
  ];

  const sl=g('b17-s175-conf-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b17-s175-conf-val');const res=g('b17-s175-conf-result');
    if(vEl) vEl.textContent=v===1?'1 konfirmasi':`${v} konfirmasi`;
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
          res.textContent=`Filter mendeteksi "${addr}" ADA di block #870.142. SPV client akan mendownload block lengkap untuk mengambil transaksi yang relevan. Node hanya tahu bahwa block #870.142 di-request, tidak tahu kenapa.`;
        } else if(FALSE_POSITIVES.includes(addr)){
          res.className='b17-s174-gcs-result s174-gcs-fp';
          res.textContent=`FALSE POSITIVE: Filter mengatakan "${addr}" mungkin ada di block #870.142, tapi sebenarnya tidak. SPV client tetap mendownload block lengkap (mubazir), tapi ini membantu privasi karena node tidak bisa membedakan true match dari false positive.`;
        } else {
          res.className='b17-s174-gcs-result s174-gcs-no';
          res.textContent=`Filter mengonfirmasi "${addr}" TIDAK ada di block #870.142. SPV client tidak perlu mendownload block ini. Hemat bandwidth.`;
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
      el.innerHTML='<div class="b17-s173-empty">Belum ada address. Tambahkan di atas.</div>';
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
        if(res){res.className='b17-s173-result s173-idle';res.textContent='Filter di-reset. Tambahkan address baru.';}
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
      if(res){res.className='b17-s173-result s173-fp';res.textContent=`"${addr}" sudah ada di filter.`;}
      return;
    }
    if(addedAddrs.length>=4){
      if(res){res.className='b17-s173-result s173-fp';res.textContent='Maksimum 4 address untuk demo ini. Hapus satu dulu.';}
      return;
    }
    addedAddrs.push(addr);
    getBits(addr).forEach(b=>{bitArray[b]=1;});
    highlightBits=getBits(addr);
    renderArray();renderAddrs();
    if(res){res.className='b17-s173-result s173-yes';res.textContent=`"${addr}" ditambahkan ke filter. Bit ${getBits(addr).join(', ')} di-set ke 1.`;}
  }

  function queryFilter(){
    const sel=g('b17-s173-query-select');if(!sel) return;
    const addr=sel.value;
    const bits=getBits(addr);
    highlightBits=bits;renderArray();
    const res=g('b17-s173-result');if(!res) return;
    if(addedAddrs.length===0){
      res.className='b17-s173-result s173-idle';res.textContent='Tambahkan address ke filter dulu sebelum query.';return;
    }
    const isInFilter=bits.every(b=>bitArray[b]===1);
    const isActuallyIn=addedAddrs.includes(addr);
    if(!isInFilter){
      res.className='b17-s173-result s173-no';
      res.textContent=`Hasil: TIDAK ADA. Bit ${bits.filter(b=>bitArray[b]===0).join(', ')} masih 0 — "${addr}" pasti tidak ada di filter. Jawaban "tidak" selalu tepat.`;
    } else if(isActuallyIn){
      res.className='b17-s173-result s173-yes';
      res.textContent=`Hasil: ADA. Semua bit (${bits.join(', ')}) sudah di-set ke 1. "${addr}" memang ada di filter. Node akan mengirimkan transaksi relevan.`;
    } else {
      res.className='b17-s173-result s173-fp';
      res.textContent=`Hasil: FALSE POSITIVE! Semua bit (${bits.join(', ')}) sudah 1 — tapi "${addr}" sebenarnya TIDAK ada di filter. Node tetap mengirim transaksi untuk address ini, yang mengaburkan address yang sebenarnya dimiliki. Inilah "privasi" bloom filter.`;
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
      {x:185,col:'#EEEDFE', stroke:'rgba(83,74,183,0.3)', txt:'Jalur kalkulasi'},
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
        <div class="b17-s172-step-title">Transaksi target: ${tx.label}</div>
        <div class="b17-s172-step-hash">hash: ${tx.hash}...d4a9f1 (32 byte)</div>
        <div class="b17-s172-step-desc">Ini yang ingin kamu buktikan ada di dalam block.</div>
      </div>`;
    stepsEl.appendChild(s0);

    proof.siblings.forEach((sibKey,i)=>{
      const sib=NODES[sibKey];
      const s=document.createElement('div');s.className='b17-s172-step s172-proof';
      s.innerHTML=`<div class="b17-s172-step-icon">🔑</div>
        <div class="b17-s172-step-body">
          <div class="b17-s172-step-title">Sibling hash ${i+1}: ${sib.label}</div>
          <div class="b17-s172-step-hash">hash: ${sib.hash}...a8b3c7 (32 byte)</div>
          <div class="b17-s172-step-desc">Hash ini dikirim oleh full node sebagai bagian dari proof. SPV client tidak perlu tahu isi transaksinya — cukup hash-nya saja.</div>
        </div>`;
      stepsEl.appendChild(s);
    });

    const sRoot=document.createElement('div');sRoot.className='b17-s172-step s172-root';
    sRoot.innerHTML=`<div class="b17-s172-step-icon">✅</div>
      <div class="b17-s172-step-body">
        <div class="b17-s172-step-title">Hasil kalkulasi: Merkle Root cocok</div>
        <div class="b17-s172-step-hash">root: ${NODES['L3-0'].hash}...e2f1d9 (32 byte)</div>
        <div class="b17-s172-step-desc">SPV client merekonstruksi merkle root dari tx target + ${proof.siblings.length} sibling hash. Kalau cocok dengan merkle root di header block yang sudah diverifikasi proof-of-work-nya, transaksi terbukti ada di block ini.</div>
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
    if(note) note.textContent=`Untuk membuktikan ${tx.label} ada di block ini, SPV client hanya butuh ${proofBytes} byte (${proof.siblings.length} sibling hash + hash transaksi itu sendiri). Seluruh block ~1.5 MB. Proof ini ${Math.round(blockBytes/proofBytes).toLocaleString('id-ID')}x lebih kecil dari block penuh.`;
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
  const LABELS=['KAMU','B','C','D','E','F','G','H'];

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
    mkText(svg,NODES[0].x,NODES[0].y-5,'KAMU','#fff',7,true);
    mkText(svg,NODES[0].x,NODES[0].y+6,'(sumber)','#fff',6,false);
    const att=mkE('rect',{x:148,y:152,width:66,height:22,rx:4,fill:'#FCEBEB',stroke:'#A32D2D','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,181,163,'👁 Attacker','#A32D2D',7,true);
    mkLine(svg,165,150,165,152,'rgba(163,45,45,0.5)','1','3,2');
    mkText(svg,110,185,'Sumber langsung terlihat dari node pertama flood','#A32D2D',7,false);
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
    sm.textContent='stem (senyap)';svg.appendChild(sm);
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
      if(isSrc){mkText(svg,n.x,n.y-5,'KAMU','#fff',7,true);mkText(svg,n.x,n.y+6,'(sumber)','#fff',6,false);}
      else mkText(svg,n.x,n.y,LABELS[ni],isFluff?'#fff':'#0F6E56',7,true);
    });
    const att=mkE('rect',{x:1,y:152,width:64,height:28,rx:4,fill:'#EAF3DE',stroke:'#0F6E56','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,33,162,'👁 Attacker','#0F6E56',7,true);
    mkText(svg,33,173,'tidak bisa tahu!','#0F6E56',6,false);
    mkText(svg,110,185,'Fluff dari node G — sumber asli tidak terdeteksi','#0F6E56',7,false);
  })();

  // Flow diagram
  (function(){
    const svg=g('b18-s186-flow-svg');if(!svg) return;
    svg.innerHTML='';
    const stemX=[30,100,170,240];
    const labels=[['Kamu','(sumber)'],['Node B'],['Node C'],['Node D']];
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
    mkText(svg,350,95,'fluff phase (flooding normal)','#854F0B',7,false);
    const r=mkE('rect',{x:55,y:78,width:155,height:16,rx:3,fill:'#EAF3DE',stroke:'rgba(15,110,86,0.3)','stroke-width':'0.5'});
    svg.appendChild(r);
    mkText(svg,133,86,'stem phase (senyap, tidak masuk mempool)','#0F6E56',7,false);
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
    mkText(svg,110,175,'Node A announce ke semua 6 peer','#A32D2D',7,false);
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
    mkText(svg,110,170,'─ fanout langsung  ·· sketch recon','#3A3A35',7,false);
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
    const vEl=g('b18-s184-sl-val');if(vEl) vEl.textContent=pct+'% sudah ada';
    const known=Math.round(TOTAL_TX*pct/100);
    const missing=TOTAL_TX-known;
    const kEl=g('b18-s184-known');if(kEl) kEl.textContent=known.toLocaleString('id-ID')+' tx';
    const mEl=g('b18-s184-missing');if(mEl) mEl.textContent=missing.toLocaleString('id-ID')+' tx';
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
    setBar('b18-s184-bar-extra','b18-s184-bar-extra-txt','b18-s184-val-extra',missingKB,missing>0?`${missing} tx tidak dikenal`:'Tidak ada tx yang hilang!');
    setBar('b18-s184-bar-total','b18-s184-bar-total-txt','b18-s184-val-total',totalKB,`Total: ~${totalKB} KB`);
    const svEl=g('b18-s184-shortid-val');if(svEl) svEl.textContent=(shortidBytes/1000).toFixed(1)+' KB';
    const mvEl=g('b18-s184-missing-val');if(mvEl) mvEl.textContent=missing>0?'~'+missingKB+' KB':'0 KB (tidak ada!)';
    const tvEl=g('b18-s184-total-val');if(tvEl) tvEl.textContent='~'+totalKB+' KB vs '+BLOCK_FULL_KB+' KB';
    const sdEl=g('b18-s184-saving-desc');
    if(sdEl) sdEl.textContent=saving>0?`Hemat ~${saving}% bandwidth. ${Math.round(BLOCK_FULL_KB/totalKB)}x lebih kecil dari block penuh.`:'Kondisi tidak normal — terlalu banyak tx tidak dikenal.';
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
        {cls:'s183-ph-info',num:'1',title:'Kirim getblocks ke satu peer',
         desc:'Node mengirim getblocks dengan block locator. Peer membalas dengan inv berisi hingga 500 hash block berikutnya.',
         msg:'→ getblocks [block_locator] | ← inv [max 500 hashes]',time:'~1 detik'},
        {cls:'s183-ph-bad', num:'2',title:'Request dan tunggu block satu per satu',
         desc:'Node mengirim getdata untuk setiap block dan menunggu datang sebelum meminta berikutnya. Tidak bisa paralel.',
         msg:'→ getdata [block_N] | ← block [~1.5MB] | validasi... | → getdata [block_N+1]',time:'~detik per block'},
        {cls:'s183-ph-bad', num:'3',title:'Terikat ke satu peer',
         desc:'Seluruh sync bergantung pada kecepatan dan kejujuran satu peer. Kalau peer lambat atau tidak jujur, seluruh sync terdampak.',
         msg:'',time:'bottleneck utama'},
        {cls:'s183-ph-bad', num:'4',title:'Tidak tahu chain mana yang benar',
         desc:'Node tidak bisa verifikasi apakah ia sedang di chain terpanjang sampai sudah terlanjur download banyak block. Bisa buang waktu di chain yang salah.',
         msg:'',time:'risiko tinggi'},
      ],
    },
    headers:{
      phases:[
        {cls:'s183-ph-info',num:'1',title:'Download semua header via getheaders',
         desc:'Node mengirim getheaders dengan block locator. Peer membalas dengan hingga 2.000 header (~162 KB per respons). Ulangi sampai semua header ter-download.',
         msg:'→ getheaders [locator] | ← headers [max 2000 × 81B ≈ 162KB]',time:'~5 menit untuk 870.000 block'},
        {cls:'s183-ph-good',num:'2',title:'Hitung chainwork — tahu chain terpanjang tanpa download block',
         desc:'Dari header chain, node menghitung accumulated proof-of-work (chainwork) setiap chain yang ditawarkan berbagai peer. Chain dengan chainwork tertinggi adalah yang valid.',
         msg:'chainwork = Σ difficulty untuk setiap block di chain',time:'instan setelah headers'},
        {cls:'s183-ph-good',num:'3',title:'Download block paralel dari banyak peer',
         desc:'Karena urutan sudah diketahui dari header chain, node bisa download block dari berbagai peer sekaligus. Block #1 dari peer A, block #2 dari peer B, dst.',
         msg:'→ getdata [block_1] ke peer_A + getdata [block_2] ke peer_B + ...',time:'paralel, jauh lebih cepat'},
        {cls:'s183-ph-good',num:'4',title:'Resilient terhadap peer yang lambat atau curang',
         desc:'Kalau satu peer lambat, node switch ke peer lain. Chain sudah diverifikasi dari header — tidak bisa ditipu urutan yang salah.',
         msg:'assumevalid + parallel download + multi-peer = IBD optimal',time:'~4-24 jam'},
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
      rect.title=isTip?'Block tip #870.142 (dalam locator)':
                 isLocator?`Block #${870142-offset} (dalam locator)`:
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
    gr.textContent='✓';gr.title='Genesis block #0 (selalu ada di locator)';
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
    {dir:'L',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim versi software (70016), services flags, timestamp, user agent "/Satoshi:27.0.0/", dan block height (#907.430). Ini adalah jabatan tangan pertama.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'Seperti diplomat yang menyerahkan kartu identitas: "saya dari negara X, bisa berbicara bahasa Y, saya tahu berita sampai tanggal Z."'},
    {dir:'R',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Node Kamu',
     desc:'Peer membalas dengan version miliknya. Sekarang keduanya saling tahu kapabilitas masing-masing.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'Diplomat lawan juga menyerahkan kartu identitasnya — pertukaran perkenalan selesai.'},
    {dir:'L',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim verack — konfirmasi bahwa version peer sudah diterima dan valid. Tidak punya payload, hanya 24 byte header.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'Anggukan kepala: "oke, saya sudah tahu tentang kamu."'},
    {dir:'R',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Node Kamu',
     desc:'Peer juga mengirim verack. Setelah kedua verack diterima, handshake selesai. Sesi komunikasi Bitcoin resmi dimulai.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'Jabat tangan selesai. Kedua diplomat bisa mulai membahas urusan penting.'},
    {dir:'L',msg:'sendcmpct',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Node modern mengirim sendcmpct setelah verack — memberitahu peer bahwa kamu mendukung compact blocks (BIP 152) dan mode yang diprefer.',
     bytes:'F9BEB4D9 | sendcmpct | 09 byte payload',
     analogy:'Setelah jabat tangan: "omong-omong, saya lebih suka komunikasi ringkas — pakai format compact block kalau kirim block baru."'},
    {dir:'L',msg:'inv',type:'s182-t-tx',cls:'s182-d-tx',from:'Node Kamu',to:'Peer',
     desc:'Kamu punya transaksi baru. Umumkan via inv dengan txid — jangan langsung kirim data penuh, tanya dulu apakah peer sudah punya.',
     bytes:'F9BEB4D9 | inv | count:1 | type:MSG_TX | txid (32B)',
     analogy:'Seperti toko yang pasang pengumuman "ada produk baru!" — tidak langsung antar ke semua pelanggan, lihat dulu siapa yang tertarik.'},
    {dir:'R',msg:'getdata',type:'s182-t-tx',cls:'s182-d-tx',from:'Peer',to:'Node Kamu',
     desc:'Peer belum punya transaksi ini. Ia membalas dengan getdata berisi txid yang sama: "tolong kirimkan transaksi itu ke saya."',
     bytes:'F9BEB4D9 | getdata | count:1 | type:MSG_TX | txid (32B)',
     analogy:'Pelanggan yang tertarik mengisi formulir pesanan: "saya mau produk nomor ini."'},
    {dir:'L',msg:'tx',type:'s182-t-tx',cls:'s182-d-tx',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim transaksi penuh. Peer memvalidasinya — cek signature, cek UTXO, cek aturan konsensus. Kalau valid, peer mengulang inv/getdata/tx ke peer-peer lainnya.',
     bytes:'F9BEB4D9 | tx | [full tx data: inputs, outputs, witness]',
     analogy:'Produk dikirim. Pelanggan memeriksa kualitasnya — kalau bagus, ia rekomendasikan ke teman-temannya.'},
    {dir:'B',msg:'propagasi selesai',type:'s182-t-tx',cls:'s182-d-tx',from:'',to:'',
     desc:'Transaksi sudah ada di mempool node pertama. Proses inv/getdata/tx ini berulang ke ribuan node lain — dalam 2-5 detik, transaksi sudah diketahui mayoritas jaringan.',
     bytes:'',
     analogy:'Seperti berita yang menyebar dari mulut ke mulut — setiap orang yang tahu memberitahu kenalannya, sampai semua orang tahu.'},
  ];

  const FLOW2=[
    {dir:'L',msg:'inv (block)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara lama: miner mengumumkan block baru via inv. Node lain harus request block penuh — lambat untuk block berukuran 1-2 MB.',
     bytes:'F9BEB4D9 | inv | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Memberitahu teman "saya punya koran baru" — mereka harus datang ambil sendiri salinan 200 halaman.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Node lain meminta block penuh. Kalau 8 peer melakukan ini sekaligus, miner harus kirim 8 salinan block yang sama — sangat boros bandwidth.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Delapan teman sekaligus minta salinan koran — penjual harus fotokopi 8 kali.'},
    {dir:'L',msg:'block (penuh)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Block penuh dikirim (~1-2 MB). Untuk jaringan ribuan node, ini tidak efisien. Block bisa butuh beberapa detik untuk menyebar — meningkatkan risiko stale block.',
     bytes:'F9BEB4D9 | block | [header + semua transaksi: ~1-2 MB]',
     analogy:'Fotokopi koran 200 halaman untuk setiap orang — lambat dan boros.'},
    {dir:'L',msg:'headers',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara lebih baik (headers-first): kirim header block dulu (80 byte). Node penerima bisa validasi proof-of-work dari header sebelum memutuskan apakah butuh block penuh.',
     bytes:'F9BEB4D9 | headers | [80 byte header: prev_hash, merkle_root, PoW]',
     analogy:'Kirim ringkasan eksekutif dulu — baru kalau tertarik, minta detailnya.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Setelah validasi header dan PoW, node penerima memutuskan block ini valid dan memintanya.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Setelah baca ringkasan dan tertarik, baru pesan buku lengkapnya.'},
    {dir:'L',msg:'cmpctblock',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara terbaik (compact blocks, BIP 152): kirim sketsa block berisi header + txid pendek (6 byte). Penerima rekonstruksi dari mempool — transaksi yang sudah dikenal tidak perlu download ulang.',
     bytes:'F9BEB4D9 | cmpctblock | [80B header + txid pendek: ~20KB vs 1.5MB]',
     analogy:'Kirim daftar nomor halaman koran yang sudah kamu punya — hanya halaman yang belum ada yang perlu dikirim.'},
    {dir:'R',msg:'getblocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Kalau ada transaksi di block yang tidak dikenali (tidak ada di mempool), node penerima minta spesifik transaksi tersebut. Biasanya hanya 0-5% transaksi yang perlu diminta.',
     bytes:'F9BEB4D9 | getblocktxn | block_hash | [daftar index tx yang dibutuhkan]',
     analogy:'Dari 3000 halaman, kamu hanya butuh 5 halaman yang belum ada — minta 5 halaman itu saja.'},
    {dir:'L',msg:'blocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Miner mengirim hanya transaksi yang diminta. Node rekonstruksi block penuh dan validasi. Total data: ~20-50 KB vs 1-2 MB. 10-40x lebih cepat dari metode klasik.',
     bytes:'F9BEB4D9 | blocktxn | [hanya tx yang diminta, bukan seluruh block]',
     analogy:'Lima halaman dikirim. Pembaca rakit koran lengkap dari halaman yang sudah ada + 5 halaman baru. Selesai dalam sepersekian waktu.'},
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
      const ind=g(indId);if(ind) ind.textContent=`${Math.max(0,step+1)} / ${flow.length} langkah`;
      const nb=g(nextId);if(nb) nb.disabled=step>=flow.length-1;
      const detail=g(detailId);if(!detail) return;
      if(step<0){
        detail.className='b18-s182-detail s182-d-idle';
        detail.innerHTML=`<div class="b18-s182-detail-label">Menunggu</div>
          <div class="b18-s182-detail-title">${idleText.title}</div>
          <div class="b18-s182-detail-text">${idleText.text}</div>`;
      } else {
        const s=flow[step];
        detail.className=`b18-s182-detail ${s.cls}`;
        detail.innerHTML=`<div class="b18-s182-detail-label">Langkah ${step+1}: ${s.from}${s.to?' → '+s.to:''}</div>
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
    {title:'Koneksi TCP baru saja dibuka',text:'Dua node baru saja terhubung di level TCP. Handshake harus diselesaikan sebelum komunikasi Bitcoin bisa dimulai.'});
  buildFlow(FLOW2,'b18-s182-tl2','b18-s182-detail2','b18-s182-next2','b18-s182-rst2','b18-s182-ind2',
    {title:'Miner baru saja menemukan block #870.143',text:'Block baru valid. Harus disebarkan ke seluruh jaringan secepat mungkin sebelum miner lain menemukan block di height yang sama.'});

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
      desc:'Pesan pertama yang dikirim saat dua node terhubung. Berisi versi software, services, timestamp, user agent, dan block height.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657273696F6E0000000000',cls:'s181-command',note:'Command: "version" + null padding'},
        {val:'66000000',cls:'s181-length',note:'Payload length: 102 byte'},
        {val:'3B648D5F',cls:'s181-check',note:'SHA256(SHA256(payload))[0:4]'},
        {val:'80110100',cls:'s181-payload',note:'Protocol version: 70016'},
        {val:'0D04000000000000',cls:'s181-payload',note:'Services flags bitmask'},
        {val:'E2B67F6200000000',cls:'s181-payload',note:'Timestamp (Unix)'},
        {val:'000000000000000000000000',cls:'s181-payload',note:'addr_recv IP + port'},
        {val:'0D04000000000000',cls:'s181-payload',note:'addr_trans services'},
        {val:'00000000000000000000FFFF',cls:'s181-payload',note:'addr_trans IP'},
        {val:'208D',cls:'s181-payload',note:'Port: 8333'},
        {val:'E1B5B4A3C7F34B2E',cls:'s181-payload',note:'Nonce random'},
        {val:'102F5361746F7368693A32372E302E302F',cls:'s181-payload',note:'User agent string'},
        {val:'A6B80D00',cls:'s181-payload',note:'Start height: #907.430'},
        {val:'01',cls:'s181-payload',note:'Relay: true'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'Kode pengenal jaringan. Setiap byte pertama dari setiap pesan wajib dimulai dengan kode ini.',
         analogy:'Analogi: seperti kode area di nomor telepon. Kalau kode areanya salah, sambungan langsung diputus tanpa mendengar sisanya.'},
        {cls:'s181-command',name:'Command', bytes:'"version" + 5x null',
         desc:'Nama perintah 12 byte dalam ASCII, dipadding null bytes. Memberitahu penerima pesan ini jenis apa.',
         analogy:'Analogi: seperti subject email yang selalu punya panjang persis sama agar sistem bisa membacanya secara otomatis.'},
        {cls:'s181-length', name:'Length',  bytes:'66 00 00 00',
         desc:'Ukuran payload dalam byte (little-endian). Memberitahu penerima berapa byte yang harus dibaca setelah header.',
         analogy:'Analogi: seperti tulisan "berat bersih 250g" di kemasan makanan — penerima tahu persis berapa yang harus diambil.'},
        {cls:'s181-check',  name:'Checksum',bytes:'3B 64 8D 5F',
         desc:'4 byte pertama dari SHA256(SHA256(payload)). Verifikasi bahwa payload tidak rusak di perjalanan.',
         analogy:'Analogi: seperti nomor seri di uang kertas — kalau tidak cocok, pesan diabaikan sepenuhnya.'},
        {cls:'s181-payload',name:'Payload', bytes:'80 11 01 00 ...',
         desc:'Isi pesan: versi (70016), services flags, timestamp, informasi alamat, nonce, user agent, block height, relay flag.',
         analogy:'Analogi: isi surat yang sebenarnya — semua informasi yang ingin disampaikan, dibungkus oleh header yang standar.'},
      ],
      showFlags:true,
    },
    verack:{
      cmd:'verack',
      desc:'Konfirmasi handshake. Dikirim setelah menerima version yang valid. Tidak punya payload — hanya 24 byte header.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657261636B000000000000',cls:'s181-command',note:'Command: "verack" + null padding'},
        {val:'00000000',cls:'s181-length',note:'Payload length: 0 byte'},
        {val:'5DF6E0E2',cls:'s181-check',note:'Checksum dari payload kosong'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'Penanda jaringan mainnet.',
         analogy:'Analogi: kop surat resmi — penerima langsung tahu ini dari jaringan Bitcoin yang benar.'},
        {cls:'s181-command',name:'Command', bytes:'"verack" + 6x null',
         desc:'Konfirmasi bahwa handshake berhasil. Setelah verack diterima kedua sisi, sesi komunikasi resmi dimulai.',
         analogy:'Analogi: jabat tangan setelah saling memperkenalkan diri — "oke, saya sudah mengerti siapa kamu, mari mulai bicara."'},
        {cls:'s181-length', name:'Length',  bytes:'00 00 00 00',
         desc:'Payload 0 byte. verack adalah pesan terpendek di protokol Bitcoin.',
         analogy:'Analogi: seperti mengangguk saja tanpa kata-kata — tidak perlu penjelasan panjang, cukup konfirmasi.'},
        {cls:'s181-check',  name:'Checksum',bytes:'5D F6 E0 E2',
         desc:'Checksum dari payload kosong. Nilai ini selalu sama untuk verack manapun.',
         analogy:'Analogi: tanda tangan di dokumen kosong yang selalu identik karena tidak ada isi yang berbeda.'},
      ],
      showFlags:false,
    },
    inv:{
      cmd:'inv',
      desc:'Inventory — mengumumkan ke peer bahwa node punya transaksi atau block baru, tanpa langsung mengirim datanya. Peer yang tertarik akan balas dengan getdata.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'696E760000000000000000',cls:'s181-command',note:'Command: "inv" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 byte'},
        {val:'B3F9E1A4',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item dalam inventory'},
        {val:'01000000',cls:'s181-payload',note:'Type: MSG_TX (0x01) — transaksi. 0x02 = block'},
        {val:'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2',cls:'s181-payload',note:'Hash txid 32 byte'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',
         analogy:'Analogi: amplop dengan logo resmi Bitcoin di pojok kiri atas.'},
        {cls:'s181-command',name:'Command', bytes:'"inv"',
         desc:'Inventory announcement. Efisien karena node tidak langsung kirim data penuh — hanya mengumumkan ketersediaan.',
         analogy:'Analogi: seperti poster "Ada koran baru!" di depan kios — tidak memaksa semua orang membeli, hanya mengumumkan.'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00',
         desc:'37 byte: 1 byte count + (4 byte type + 32 byte hash) per item. Bisa berisi hingga 50.000 item sekaligus.',
         analogi:''},
        {cls:'s181-check',  name:'Checksum',bytes:'B3 F9 E1 A4', desc:'Verifikasi integritas payload.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 01000000 | hash...',
         desc:'1 item, type MSG_TX (transaksi), diikuti 32 byte txid. Peer yang ingin transaksi ini akan kirim getdata.',
         analogy:'Analogi: daftar katalog produk — hanya ID produk, bukan produknya sendiri. Kalau tertarik, baru pesan.'},
      ],
      showFlags:false,
    },
    getdata:{
      cmd:'getdata',
      desc:'Request data spesifik. Format identik dengan inv tapi artinya: "kirimkan data ini ke saya." Dikirim sebagai respons terhadap inv.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'6765746461746100000000',cls:'s181-command',note:'Command: "getdata" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 byte'},
        {val:'C4A8E3F2',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item yang diminta'},
        {val:'02000000',cls:'s181-payload',note:'Type: MSG_BLOCK (0x02) — minta block'},
        {val:'00000000000000000001A4B2C8D9E7F3A6B5C4D1E2F0A9B8C7D6E5F4A3B2C1D0',cls:'s181-payload',note:'Hash block yang diminta'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"getdata"',
         desc:'Request data dari peer. Peer akan merespons dengan mengirim tx, block, atau data lain yang diminta.',
         analogy:'Analogi: setelah melihat katalog (inv), kamu mengisi formulir pesanan (getdata) — "saya mau item nomor ini."'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00', desc:'37 byte payload, format identik dengan inv.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'C4 A8 E3 F2', desc:'Verifikasi integritas.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 02000000 | hash...',
         desc:'1 item, type MSG_BLOCK, diikuti 32 byte block hash. Node akan merespons dengan mengirimkan block penuh.',
         analogy:'Analogi: nomor pesanan yang persis dan spesifik — tidak bisa ambigu, harus hash yang tepat.'},
      ],
      showFlags:false,
    },
    ping:{
      cmd:'ping',
      desc:'Keepalive — memverifikasi koneksi masih hidup. Peer harus balas dengan pong yang berisi nonce yang sama. Kalau tidak ada respons, koneksi dianggap mati.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'70696E670000000000000000',cls:'s181-command',note:'Command: "ping" + null padding'},
        {val:'08000000',cls:'s181-length',note:'Payload length: 8 byte'},
        {val:'D4F6A2B3',cls:'s181-check',note:'Checksum'},
        {val:'A3F8C2E1D4B7920F',cls:'s181-payload',note:'Nonce: 8 byte random, harus di-echo-back'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"ping"',
         desc:'Keepalive request. Peer yang tidak merespons dalam 20 menit akan di-disconnect secara otomatis.',
         analogy:'Analogi: seperti mengetuk pintu dan menunggu jawaban — "halo, kamu masih di sana?" Tidak ada jawaban = pintu ditutup.'},
        {cls:'s181-length', name:'Length',  bytes:'08 00 00 00', desc:'8 byte payload — hanya nonce.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'D4 F6 A2 B3', desc:'Checksum payload.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'A3 F8 C2 E1 D4 B7 92 0F',
         desc:'8 byte nonce random. Peer harus echo-back nonce yang sama di pesan pong. Ini memastikan pong benar-benar respons dari ping ini.',
         analogy:'Analogi: kamu bilang kata rahasia acak, dan teman harus mengulangnya kembali — membuktikan bahwa ia benar-benar mendengar dan responsif.'},
      ],
      showFlags:false,
    },
  };

  const FLAGS=[
    {bit:'0x01',name:'NODE_NETWORK',    on:true, desc:'Node menyimpan full blockchain dan bisa melayani block historis kepada peer yang butuh IBD.'},
    {bit:'0x02',name:'NODE_GETUTXO',    on:false,desc:'Deprecated BIP 64. Mengizinkan query UTXO langsung. Hampir tidak dipakai lagi.'},
    {bit:'0x04',name:'NODE_BLOOM',      on:true, desc:'Node mendukung BIP 37 bloom filter. Banyak node modern menonaktifkan ini karena BIP 37 deprecated.'},
    {bit:'0x08',name:'NODE_WITNESS',    on:true, desc:'Node mendukung SegWit (BIP 141). Wajib untuk semua node modern.'},
    {bit:'0x10',name:'NODE_XTHIN',      on:false,desc:'Xthin block relay. Alternatif compact blocks yang tidak dipakai lagi.'},
    {bit:'0x40',name:'NODE_COMPACT_FILTERS',on:true,desc:'Node mendukung BIP 157/158 compact block filters untuk SPV client modern.'},
    {bit:'0x0400',name:'NODE_NETWORK_LIMITED',on:false,desc:'Pruned node — hanya menyimpan 288 block terakhir. Tidak bisa layani IBD penuh.'},
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
    mkText(cx,cy+7,'Kamu','#fff',9,true);
    // Legend
    mkLine(15,265,35,265,'rgba(83,74,183,0.5)',false);
    mkText(95,265,'8 outbound (kamu yang pilih)','#534AB7',8);
    mkLine(210,265,230,265,'rgba(15,110,86,0.4)',true);
    mkText(295,265,'inbound (pasif)','#0F6E56',8);
    const note=g('b18-s181-net-note');
    if(note) note.textContent='8 outbound connections (garis solid, ungu) dipilih aktif oleh node kamu — kamu yang memutuskan terhubung ke siapa. Inbound connections (garis putus-putus, hijau) diinisiasi peer lain yang datang kepadamu. Outbound lebih dipercaya karena sulit bagi attacker untuk mengisolasi node kamu kalau kamu yang memilih peer-nya.';
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
    p2pk:  {alice:'(pubKey langsung)',bob:'(pubKey langsung)'},
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
    p2pk:{label:'P2PK',note:'P2PK: format paling awal Bitcoin. Satoshi memakai ini untuk block reward awal. Public key langsung di locking script tanpa hashing. Sekarang tidak dipakai karena pubKey exposure sebelum spending.',
      lockOps:[
        {t:'<pubKey>',cls:'oc-data',hex:'33-65 bytes',info:'Public key langsung di-embed di locking script tanpa hashing. Siapapun yang melihat blockchain bisa melihat public key sebelum UTXO dibelanjakan.'},
        {t:'OP_CHECKSIG',cls:'oc-op',hex:'0xac',info:'Pop signature dan pubKey dari stack, verifikasi signature valid. Kalau valid, push TRUE. Satu-satunya opcode eksekusi di P2PK.'},
      ],
      unlockOps:[
        {t:'<signature>',cls:'oc-sig',hex:'71-72 bytes (DER)',info:'Hanya signature yang diperlukan — tidak perlu menyertakan pubKey karena sudah ada di locking script.'},
      ],
      steps:[
        {ops:['<signature>','<pubKey>','OP_CHECKSIG'],stk:[],push:'<signature>',desc:'Push signature ke stack'},
        {stk:['<signature>'],push:'<pubKey>',desc:'Load pubKey dari locking script'},
        {stk:['<signature>','<pubKey>'],pop:2,push:'TRUE',desc:'OP_CHECKSIG: verifikasi signature valid!',final:true},
      ]},
    p2pkh:{label:'P2PKH',note:'P2PKH: format paling umum sejak 2009. Address dimulai "1". Public key di-hash sebelum disimpan — lebih privat dari P2PK karena pubKey tidak diungkap sampai spending.',
      lockOps:[
        {t:'OP_DUP',cls:'oc-op',hex:'0x76',info:'Duplikasi item teratas stack. Diperlukan agar pubKey bisa dipakai dua kali: sekali untuk di-hash dan dibandingkan, sekali untuk verifikasi signature.'},
        {t:'OP_HASH160',cls:'oc-op',hex:'0xa9',info:'Pop item dari stack, aplikasikan SHA256 lalu RIPEMD160, push hasilnya. Mengubah pubKey (33 bytes) menjadi pubKeyHash (20 bytes).'},
        {t:'<pubKeyHash>',cls:'oc-hash',hex:'20 bytes',info:'Hash dari public key pemilik UTXO. Siapapun yang menyediakan pubKey yang hash-nya cocok dan signature valid bisa membelanjakan.'},
        {t:'OP_EQUALVERIFY',cls:'oc-op',hex:'0x88',info:'Pop dua item dari stack, bandingkan. Kalau tidak sama, script gagal. Memastikan pubKey yang disediakan memang milik pemilik asli.'},
        {t:'OP_CHECKSIG',cls:'oc-op',hex:'0xac',info:'Pop signature dan pubKey dari stack. Verifikasi signature valid untuk transaksi ini. Kalau valid, push TRUE.'},
      ],
      unlockOps:[
        {t:'<signature>',cls:'oc-sig',hex:'71-72 bytes (DER)',info:'ECDSA signature dibuat dengan private key. Membuktikan kepemilikan private key yang sesuai dengan pubKey yang hash-nya ada di locking script.'},
        {t:'<pubKey>',cls:'oc-data',hex:'33 bytes (compressed)',info:'Public key yang hash-nya harus cocok dengan pubKeyHash di locking script. Baru diungkap saat UTXO dibelanjakan.'},
      ],
      steps:[
        {ops:['<signature>','<pubKey>','OP_DUP','OP_HASH160','<pubKeyHash>','OP_EQUALVERIFY','OP_CHECKSIG'],stk:[],push:'<signature>',desc:'Push signature ke stack'},
        {stk:['<signature>'],push:'<pubKey>',desc:'Push pubKey ke stack'},
        {stk:['<signature>','<pubKey>'],push:'<pubKey>',desc:'OP_DUP: duplikasi top stack'},
        {stk:['<signature>','<pubKey>','<pubKey>'],pop:1,push:'<pubKeyHash computed>',desc:'OP_HASH160: hash pubKey 20 bytes'},
        {stk:['<signature>','<pubKey>','<pubKeyHash computed>'],push:'<pubKeyHash locked>',desc:'Push pubKeyHash dari locking script'},
        {stk:['<signature>','<pubKey>','<pubKeyHash computed>','<pubKeyHash locked>'],pop:2,desc:'OP_EQUALVERIFY: cocok, lanjut'},
        {stk:['<signature>','<pubKey>'],pop:2,push:'TRUE',desc:'OP_CHECKSIG: valid!',final:true},
      ]},
    p2sh:{label:'P2SH',note:'P2SH (BIP 16): menyembunyikan script kompleks di balik hash 20 bytes. Address dimulai "3". Penerima mengungkap redeem script saat spending.',
      lockOps:[
        {t:'OP_HASH160',cls:'oc-op',hex:'0xa9',info:'Hash redeem script yang disediakan pengirim untuk dibandingkan dengan scriptHash di locking script.'},
        {t:'<scriptHash>',cls:'oc-hash',hex:'20 bytes',info:'Hash dari redeem script. Hanya hash yang disimpan di blockchain sampai UTXO dibelanjakan.'},
        {t:'OP_EQUAL',cls:'oc-op',hex:'0x87',info:'Bandingkan hash redeem script dengan scriptHash di locking script. Kalau cocok, lanjut eksekusi redeem script.'},
      ],
      unlockOps:[
        {t:'<...data...>',cls:'oc-data',hex:'sesuai redeem script',info:'Data yang diperlukan oleh redeem script (signature, preimage, dll).'},
        {t:'<redeemScript>',cls:'oc-hash',hex:'variable bytes',info:'Script sesungguhnya yang diungkap saat spending — inilah yang di-hash menjadi scriptHash di locking script.'},
      ],
      steps:[
        {ops:['<data>','<redeemScript>','OP_HASH160','<scriptHash>','OP_EQUAL','[eksekusi redeemScript]'],stk:[],push:'<data>',desc:'Push data yang diperlukan redeem script'},
        {stk:['<data>'],push:'<redeemScript>',desc:'Push redeem script'},
        {stk:['<data>','<redeemScript>'],pop:1,push:'<scriptHash computed>',desc:'OP_HASH160: hash redeemScript 20 bytes'},
        {stk:['<data>','<scriptHash computed>'],push:'<scriptHash locked>',desc:'Push scriptHash dari locking script'},
        {stk:['<data>','<scriptHash computed>','<scriptHash locked>'],pop:2,desc:'OP_EQUAL: hash cocok, lanjut eksekusi'},
        {stk:['<data>'],push:'TRUE',desc:'Eksekusi redeemScript sukses!',final:true},
      ]},
    p2wpkh:{label:'P2WPKH',note:'P2WPKH (BIP 141): Native SegWit v0. Witness data dihitung 1/4 weight. Input ~68 vByte vs P2PKH ~148 vByte. Address dimulai "bc1q".',
      lockOps:[
        {t:'OP_0',cls:'oc-ver',hex:'0x00',info:'Witness version 0. Bersama 20-byte witness program, menentukan ini adalah P2WPKH. Node menjalankan logika P2PKH secara implisit menggunakan data dari witness field.'},
        {t:'<20-byte-hash>',cls:'oc-hash',hex:'20 bytes (witness program)',info:'Hash dari compressed public key (SHA256+RIPEMD160). Disebut witness program. Disimpan di scriptPubKey, bukan di scriptSig saat spending.'},
      ],
      unlockOps:[
        {t:'(scriptSig kosong)',cls:'oc-data',hex:'0 bytes',info:'P2WPKH tidak punya scriptSig. Semua data ada di witness field yang terpisah dari block size lama.'},
        {t:'<witness: sig>',cls:'oc-sig',hex:'71-72 bytes (1/4 weight)',info:'Signature di witness field. Data witness dihitung 1/4 weight unit.'},
        {t:'<witness: pubKey>',cls:'oc-data',hex:'33 bytes (1/4 weight)',info:'Public key di witness field. Juga mendapat diskon 1/4 weight.'},
      ],
      steps:[
        {ops:['<sig>(witness)','<pubKey>(witness)','[implisit: OP_DUP]','[implisit: OP_HASH160]','[implisit: OP_EQUALVERIFY]','[implisit: OP_CHECKSIG]'],stk:[],push:'<sig>',desc:'Push witness signature ke stack'},
        {stk:['<sig>'],push:'<pubKey>',desc:'Push witness pubKey'},
        {stk:['<sig>','<pubKey>'],push:'<pubKey>',desc:'Implisit OP_DUP'},
        {stk:['<sig>','<pubKey>','<pubKey>'],pop:1,push:'<hash computed>',desc:'Implisit OP_HASH160'},
        {stk:['<sig>','<pubKey>','<hash computed>'],push:'<witness program>',desc:'Load witness program dari locking script'},
        {stk:['<sig>','<pubKey>','<hash computed>','<witness program>'],pop:2,desc:'Implisit OP_EQUALVERIFY: cocok!'},
        {stk:['<sig>','<pubKey>'],pop:2,push:'TRUE',desc:'Implisit OP_CHECKSIG: valid!',final:true},
      ]},
    p2wsh:{label:'P2WSH',note:'P2WSH (BIP 141): SegWit v0 versi P2SH. Script hash 32 bytes (SHA256). Witness data mendapat diskon weight. Ideal untuk multisig SegWit. Address "bc1q" lebih panjang.',
      lockOps:[
        {t:'OP_0',cls:'oc-ver',hex:'0x00',info:'Witness version 0. Bersama 32-byte witness program, menentukan ini adalah P2WSH.'},
        {t:'<32-byte-scriptHash>',cls:'oc-hash',hex:'32 bytes (SHA256)',info:'SHA256 dari witness script. P2WSH memakai SHA256 saja (32 bytes), lebih collision-resistant dari P2SH yang memakai SHA256+RIPEMD160 (20 bytes).'},
      ],
      unlockOps:[
        {t:'(scriptSig kosong)',cls:'oc-data',hex:'0 bytes',info:'Seperti P2WPKH, tidak ada scriptSig. Semua data ada di witness field.'},
        {t:'<witness: data>',cls:'oc-data',hex:'sesuai witness script',info:'Data yang diperlukan witness script. Ada di witness field sehingga mendapat diskon 1/4 weight.'},
        {t:'<witness: witnessScript>',cls:'oc-hash',hex:'variable (1/4 weight)',info:'Script sesungguhnya, diungkap di witness field. Di-hash dengan SHA256 dan dibandingkan dengan 32-byte scriptHash di locking script.'},
      ],
      steps:[
        {ops:['<data>(witness)','<witnessScript>(witness)','[SHA256 witnessScript]','[compare 32-byte-hash]','[eksekusi witnessScript]'],stk:[],push:'<data>',desc:'Push witness data ke stack'},
        {stk:['<data>'],push:'<witnessScript>',desc:'Push witness script'},
        {stk:['<data>','<witnessScript>'],pop:1,push:'<SHA256 computed>',desc:'SHA256: hash witnessScript 32 bytes'},
        {stk:['<data>','<SHA256 computed>'],push:'<32-byte-hash locked>',desc:'Load 32-byte-hash dari locking script'},
        {stk:['<data>','<SHA256 computed>','<32-byte-hash locked>'],pop:2,desc:'Bandingkan: hash cocok, lanjut'},
        {stk:['<data>'],push:'TRUE',desc:'Eksekusi witnessScript sukses!',final:true},
      ]},
    p2tr:{label:'P2TR',note:'P2TR (BIP 340-342): Taproot, aktif Nov 2021. Key path: satu Schnorr signature, 57.5 vByte paling efisien. Script path: ungkap salah satu script tersembunyi di MAST. Address dimulai "bc1p".',
      lockOps:[
        {t:'OP_1',cls:'oc-ver',hex:'0x51',info:'Witness version 1. Memberi tahu node ini adalah Taproot output (SegWit v1). OP_1 berbeda dari OP_0 di P2WPKH/P2WSH.'},
        {t:'<32-byte-tweaked-pubkey>',cls:'oc-hash',hex:'32 bytes (x-only)',info:'Tweaked public key: pubKey + hash_taptweak(pubKey + merkle_root) x G. Hanya koordinat x (32 bytes). Bisa menyembunyikan seluruh script tree di dalam tweak.'},
      ],
      unlockOps:[
        {t:'(scriptSig kosong)',cls:'oc-data',hex:'0 bytes',info:'Tidak ada scriptSig. Semua di witness field.'},
        {t:'<schnorr_sig>',cls:'oc-sig',hex:'64 bytes flat',info:'Schnorr signature hanya 64 bytes: r (32 bytes) + s (32 bytes) digabung langsung tanpa DER encoding. Lebih kecil dari ECDSA 71-72 bytes.'},
      ],
      steps:[
        {ops:['<schnorr_sig>(witness)','[load tweaked_pubkey dari lock]','OP_CHECKSIG (Schnorr)'],stk:[],push:'<schnorr_sig>',desc:'Push Schnorr signature (64 bytes)'},
        {stk:['<schnorr_sig>'],push:'<tweaked_pubkey>',desc:'Load tweaked pubkey dari locking script'},
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
    const sb=g('b21-s212-send');if(sb){sb.disabled=false;sb.textContent='Kirim Transaksi';}
  }

  const sendBtn=g('b21-s212-send');
  if(sendBtn) sendBtn.addEventListener('click',function(){
    if(txSent) return;txSent=true;
    sendBtn.disabled=true;sendBtn.textContent='Dikonfirmasi \u2713';
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
    arr.textContent='\u2193 dikombinasikan dengan locking script \u2193';dispEl.appendChild(arr);
    const llbl=document.createElement('div');llbl.className='b21-s212-si-lbl';
    llbl.textContent='Locking script (scriptPubKey) \u2014 dikunci saat output dibuat:';dispEl.appendChild(llbl);
    const lrow=document.createElement('div');lrow.className='b21-s212-oprow';
    sc.lockOps.forEach(function(op,i){
      const b=document.createElement('div');b.className='b21-s212-op '+op.cls+(siOpIdx===('l'+i)?' selected':'');
      b.textContent=op.t;b.addEventListener('click',function(){siOpIdx=siOpIdx===('l'+i)?-1:('l'+i);renderSI();showSiDet(op);});
      lrow.appendChild(b);
    });
    dispEl.appendChild(lrow);
    const det=document.createElement('div');det.className='b21-s212-si-detail';det.id='b21-s212-opcode-det';
    det.innerHTML='<div style="font-size:10px;font-family:\'Sora\',sans-serif;color:#52524C;">Klik opcode untuk penjelasan</div>';
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
      if(stk.length===0){const e=document.createElement('div');e.className='b21-s212-stack-empty';e.textContent='(kosong)';stackEl.appendChild(e);}
      else stk.forEach(function(item){const d=document.createElement('div');d.className='b21-s212-stack-item';d.textContent=item;stackEl.appendChild(d);});
    } else {const e=document.createElement('div');e.className='b21-s212-stack-empty';e.textContent='(kosong)';stackEl.appendChild(e);}
    if(lblEl) lblEl.textContent=seStep===0?'Tekan Step untuk mulai eksekusi script':'Step '+seStep+'/'+steps.length+': '+(steps[Math.min(seStep-1,steps.length-1)]?steps[Math.min(seStep-1,steps.length-1)].desc:'');
    if(resEl){
      if(seStep>=steps.length&&steps[steps.length-1]&&steps[steps.length-1].final){
        resEl.className='b21-s212-exec-result s212-ok';
        resEl.textContent='Script sukses \u2014 TRUE di atas stack. UTXO bisa dibelanjakan. Full node menerima transaksi ini sebagai valid.';
      } else {
        resEl.className='b21-s212-exec-result s212-idle';
        resEl.textContent=seStep===0?'Eksekusi belum dimulai.':'Langkah '+seStep+' dari '+steps.length+'.';
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
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO — pubKey langsung di locking script',sub:'Format paling awal Bitcoin. Tidak ada "address" — pubKey embedded langsung.',code:'Tidak ada address modern\nnilai: 0.05 BTC\nlocking script: <alicePubKey> OP_CHECKSIG',rows:[{l:'Tipe',v:'P2PK (Pay to Public Key)'},{l:'Address',v:'Tidak ada — pubKey 65 bytes langsung embedded'},{l:'Locking script',v:'<alicePubKey> OP_CHECKSIG'}],desc:'P2PK tidak punya address. Public key Alice langsung ada di locking script. Siapapun yang melihat blockchain bisa melihat public key sebelum UTXO dibelanjakan — masalah privasi yang diselesaikan P2PKH.',ops:[{t:'<alicePubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx — pengirim harus tahu pubKey Bob langsung',sub:'Tidak ada sistem "address" — pengirim butuh pubKey Bob secara langsung',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: <bobPubKey> OP_CHECKSIG → 0.04 BTC\nfee: 0.001 BTC',rows:[{l:'Input',v:'0.05 BTC (UTXO Alice)'},{l:'Output ke Bob',v:'<bobPubKey65bytes> OP_CHECKSIG'},{l:'Masalah',v:'Alice harus tahu pubKey Bob secara langsung'}],desc:'Di P2PK pengirim harus tahu public key penerima secara langsung. Tidak ada mekanisme address yang bisa dibagikan. Ini salah satu alasan P2PK tidak praktis untuk penggunaan umum.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Locking script Bob: pubKey Bob langsung di-embed',sub:'Tidak ada hashing — pubKey Bob terekspos di blockchain sebelum dibelanjakan',code:'pubKey Bob: 04a1b2c3...d4e5f6 (65 bytes)\nlocking script: <bobPubKey> OP_CHECKSIG',rows:[{l:'pubKey Bob',v:'04a1b2c3...d4e5f6 (65 bytes uncompressed)'},{l:'Locking script',v:'<bobPubKey> OP_CHECKSIG'},{l:'Masalah privasi',v:'pubKey Bob terekspos sebelum UTXO dibelanjakan'}],desc:'Locking script P2PK hanya dua elemen: pubKey dan OP_CHECKSIG. Tidak ada hashing. Public key Bob terlihat langsung di blockchain.',ops:[{t:'<bobPubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice tandatangani — hanya signature, tidak perlu kirim pubKey',sub:'Unlocking script lebih kecil dari P2PKH karena pubKey sudah di locking script',code:'scriptSig: <aliceSignature> (71-72 bytes DER)',rows:[{l:'scriptSig',v:'<aliceSignature> saja'},{l:'Lebih kecil',v:'Tidak perlu sertakan pubKey (hemat 33 bytes)'},{l:'Tipe',v:'ECDSA (secp256k1)'}],desc:'Unlocking script P2PK lebih ringkas — hanya signature, tidak perlu pubKey karena sudah tersimpan di locking script. Tapi harganya: public key terekspos permanen di blockchain.',ops:[{t:'<aliceSignature>',c:'oc-sig'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Full node verifikasi: push sig → load pubKey → OP_CHECKSIG',sub:'Stack paling sederhana — hanya dua elemen',code:'[unlock] <sig>\n[lock]   <pubKey> OP_CHECKSIG\n\nStack: push <sig> → push <pubKey> → OP_CHECKSIG → TRUE',rows:[{l:'Stack awal',v:'[sig]'},{l:'Setelah load pubKey',v:'[sig, pubKey]'},{l:'OP_CHECKSIG',v:'verify → TRUE'}],desc:'Stack execution P2PK paling sederhana: push signature, push pubKey dari locking script, OP_CHECKSIG memverifikasi. Tidak ada OP_DUP, OP_HASH160, OP_EQUALVERIFY seperti P2PKH.',ops:[{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2PK — pubKey-nya terekspos di blockchain',sub:'Format historis, tidak direkomendasikan karena masalah privasi',code:'UTXO baru: 0.04 BTC\nlocking script: <bobPubKey> OP_CHECKSIG\nCara belanja: scriptSig: <bobSignature>',rows:[{l:'UTXO baru',v:'0.04 BTC, locking: <bobPubKey> OP_CHECKSIG'},{l:'Cara belanja',v:'scriptSig: <bobSignature> saja'},{l:'Status',v:'Tidak direkomendasikan — privasi buruk'}],desc:'P2PK sekarang sangat jarang dipakai. Public key terekspos sebelum UTXO dibelanjakan. P2PKH menyelesaikan ini dengan menyimpan hash pubKey.',ops:[{t:'<bobPubKey>',c:'oc-hash'},{t:'OP_CHECKSIG',c:'oc-op'}]},
    ]},
    p2pkh:{label:'P2PKH',era:'legacy',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO P2PKH — address dimulai "1"',sub:'Format paling umum 2009-2017. Hash pubKey tersimpan, bukan pubKey itu sendiri.',code:'address: 1A7f2xKm...\nnilai: 0.05 BTC\nlocking script: OP_DUP OP_HASH160 <pubKeyHash20> OP_EQUALVERIFY OP_CHECKSIG',rows:[{l:'Address Alice',v:'1A7f2xKm... (Base58Check)'},{l:'Isi address',v:'version 0x00 + pubKeyHash 20 bytes + checksum 4 bytes'},{l:'Locking script',v:'OP_DUP OP_HASH160 <hash20> OP_EQUALVERIFY OP_CHECKSIG'}],desc:'Address P2PKH menyimpan hash pubKey (SHA256+RIPEMD160 = 20 bytes), bukan pubKey itu sendiri. PubKey baru terungkap saat UTXO dibelanjakan.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<pubKeyHash20>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx — cukup tahu address Bob',sub:'Tidak perlu tahu pubKey Bob langsung — address sudah cukup',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: 1B3c9dPq... → 0.04 BTC\noutput[1]: 1A9x2mK... → 0.009 BTC (kembalian)\nfee: 0.001 BTC\nukuran: ~192 vByte',rows:[{l:'Input',v:'0.05 BTC (UTXO Alice)'},{l:'Output ke Bob',v:'0.04 BTC → 1B3c9dPq...'},{l:'Kembalian',v:'0.009 BTC → 1A9x2mK... (address Alice baru)'}],desc:'Alice cukup tahu address Bob untuk membangun transaksi. Wallet Alice akan decode address Bob untuk mengekstrak pubKeyHash yang diperlukan untuk locking script output.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode address Bob → pubKeyHash → locking script',sub:'Base58Check decode → strip version byte dan checksum → 20 bytes pubKeyHash',code:'bobAddr: 1B3c9dPq...\n  ↓ Base58Check decode\nbobPubKeyHash: b3c9d4e5...(20 bytes)\nlocking script: OP_DUP OP_HASH160 <b3c9d4e5...> OP_EQUALVERIFY OP_CHECKSIG',rows:[{l:'Address Bob',v:'1B3c9dPq... (Base58Check)'},{l:'Decode',v:'0x00 + b3c9d4e5... (20 bytes) + checksum'},{l:'Locking script',v:'OP_DUP OP_HASH160 <b3c9d4e5...> OP_EQUALVERIFY OP_CHECKSIG'}],desc:'Wallet men-decode address Bob dari Base58Check, membuang version byte dan checksum, mengambil 20 bytes pubKeyHash, dan meng-embed-nya ke locking script.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<bobPubKeyHash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice tandatangani — ECDSA signature + pubKey di scriptSig',sub:'scriptSig berisi signature DAN pubKey — keduanya diperlukan',code:'signature = ECDSA_sign(privKey, txHash)\nscriptSig: <aliceSignature> <alicePubKey>',rows:[{l:'TX hash',v:'double SHA256 dari raw transaksi'},{l:'Signature',v:'ECDSA_sign(privKey, txHash) → 71-72 bytes DER'},{l:'scriptSig',v:'<signature> <pubKey> (total ~107 bytes)'}],desc:'scriptSig berisi dua elemen: ECDSA signature DAN public key. PubKey perlu disertakan karena locking script hanya menyimpan hash-nya — node butuh pubKey asli untuk OP_CHECKSIG.',ops:[{t:'<aliceSignature>',c:'oc-sig'},{t:'<alicePubKey>',c:'oc-data'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Full node verifikasi 5-langkah stack execution',sub:'OP_DUP → OP_HASH160 → OP_EQUALVERIFY → OP_CHECKSIG',code:'[unlock] <sig> <pubKey>\n[lock]   OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG\n\nStack: [sig,pubKey] → OP_DUP → [sig,pubKey,pubKey]\n→ OP_HASH160 → [sig,pubKey,hash_c] → compare → OP_CHECKSIG → TRUE',rows:[{l:'OP_DUP',v:'duplikasi pubKey'},{l:'OP_HASH160',v:'hash pubKey → 20 bytes'},{l:'OP_EQUALVERIFY',v:'bandingkan hash, gagal kalau beda'},{l:'OP_CHECKSIG',v:'verify signature → TRUE'}],desc:'Stack execution P2PKH paling verbose. OP_DUP menduplikasi pubKey agar bisa dipakai dua kali. Lima opcode untuk satu transaksi sederhana.',ops:[{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-data'},{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<hash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2PKH — address dimulai "1"',sub:'Format masih valid tapi lebih mahal dari SegWit karena tidak dapat diskon weight',code:'UTXO baru: 0.04 BTC, address 1B3c9dPq...\nlocking: OP_DUP OP_HASH160 <bobPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG\nCara belanja: scriptSig: <bobSig> <bobPubKey>\nukuran input: ~148 vByte',rows:[{l:'UTXO baru',v:'0.04 BTC, address 1B3c9dPq...'},{l:'Cara belanja',v:'scriptSig: <bobSig> <bobPubKey>'},{l:'Ukuran input',v:'~148 vByte (vs P2WPKH ~68 vByte)'}],desc:'UTXO P2PKH Bob valid tapi mahal saat dibelanjakan. Input ~148 vByte, lebih dari dua kali lipat P2WPKH yang ~68 vByte.',ops:[{t:'OP_DUP',c:'oc-op'},{t:'OP_HASH160',c:'oc-op'},{t:'<bobPubKeyHash>',c:'oc-hash'},{t:'OP_EQUALVERIFY',c:'oc-op'},{t:'OP_CHECKSIG',c:'oc-op'}]},
    ]},
    p2sh:{label:'P2SH',era:'legacy',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO P2SH — script kompleks di balik hash',sub:'P2SH memungkinkan multisig, timelock tanpa membebani pengirim',code:'address: 3J98tnMf...\nnilai: 0.05 BTC\nlocking script: OP_HASH160 <scriptHash20> OP_EQUAL',rows:[{l:'Address Alice',v:'3J98tnMf... (dimulai "3")'},{l:'Isi address',v:'version 0x05 + scriptHash 20 bytes + checksum'},{l:'Locking script',v:'OP_HASH160 <scriptHash20> OP_EQUAL (23 bytes)'}],desc:'Locking script P2SH sangat pendek: hanya hash dari redeem script sesungguhnya. Script kompleks apapun bisa disembunyikan di balik hash 20 bytes. Pengirim tidak perlu tahu isi script-nya.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<scriptHash20>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx — tahu address Bob, tidak perlu tahu redeem script-nya',sub:'Pengirim cukup tahu address P2SH — script kompleks urusan Bob',code:'input[0]: txid:vout → 0.05 BTC\noutput[0]: 3Abc1qRs... → 0.04 BTC\nfee: 0.001 BTC',rows:[{l:'Input',v:'0.05 BTC (UTXO Alice P2SH)'},{l:'Output ke Bob',v:'0.04 BTC → 3Abc1qRs...'},{l:'Keunggulan',v:'Alice tidak perlu tahu script kompleks di dalam P2SH Bob'}],desc:'P2SH memindahkan kompleksitas dari pengirim ke penerima. Alice cukup tahu address P2SH Bob tanpa perlu tahu apakah itu multisig, timelock, atau kondisi lainnya.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode address Bob → scriptHash → locking script P2SH',sub:'Base58Check decode dengan version 0x05 → scriptHash 20 bytes',code:'bobAddr: 3Abc1qRs...\n  ↓ Base58Check decode (version 0x05)\nbobScriptHash: a1b2c3d4...(20 bytes)\nlocking script: OP_HASH160 <a1b2c3d4...> OP_EQUAL\n\n// redeemScript Bob (tersembunyi):\nOP_2 <pk1> <pk2> <pk3> OP_3 OP_CHECKMULTISIG',rows:[{l:'Address Bob',v:'3Abc1qRs... (version 0x05 = P2SH)'},{l:'scriptHash',v:'a1b2c3d4... (20 bytes)'},{l:'Locking script',v:'OP_HASH160 <a1b2c3d4...> OP_EQUAL (23 bytes)'},{l:'Redeem script',v:'tersembunyi — hanya Bob yang tahu'}],desc:'Wallet Alice mengambil scriptHash dari decode address. ScriptHash adalah hash dari redeem script yang hanya Bob tahu. Locking script hanya 23 bytes meski script aslinya kompleks.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<scriptHash>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice sediakan data + redeemScript di scriptSig',sub:'scriptSig berisi: data yang diperlukan redeemScript + redeemScript itu sendiri',code:'// Alice punya P2SH 2-of-3 multisig\nscriptSig: OP_0 <sig1> <sig2> <redeemScript>',rows:[{l:'redeemScript',v:'OP_2 <pk1> <pk2> <pk3> OP_3 OP_CHECKMULTISIG'},{l:'scriptSig',v:'OP_0 <sig1> <sig2> <redeemScript>'},{l:'OP_0',v:'dummy untuk off-by-one bug OP_CHECKMULTISIG'}],desc:'Untuk membuka UTXO P2SH, Alice menyediakan data yang diperlukan redeemScript (signatures) PLUS redeemScript itu sendiri. Node akan meng-hash redeemScript dan membandingkan dengan scriptHash.',ops:[{t:'OP_0',c:'oc-op'},{t:'<sig1>',c:'oc-sig'},{t:'<sig2>',c:'oc-sig'},{t:'<redeemScript>',c:'oc-hash'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Full node verifikasi dua fase',sub:'Fase 1: hash redeemScript. Fase 2: eksekusi redeemScript',code:'Fase 1: OP_HASH160(<redeemScript>) == scriptHash? ✓\nFase 2: eksekusi OP_2 <pk1..pk3> OP_3 OP_CHECKMULTISIG\n→ 2 dari 3 sig valid → TRUE',rows:[{l:'Fase 1',v:'hash(redeemScript) == scriptHash → cocok'},{l:'Fase 2',v:'eksekusi redeemScript dengan data dari scriptSig'},{l:'Hasil',v:'2 dari 3 signature valid → TRUE'}],desc:'Verifikasi P2SH dua fase: pertama hash redeemScript cocok dengan scriptHash. Kedua jalankan redeemScript dengan data dari scriptSig. Kalau keduanya lulus: valid.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<redeemScript>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'},{t:'eksekusi redeemScript',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2SH — script kompleks di balik address sederhana',sub:'Fleksibel tapi mahal saat spending: redeemScript besar di scriptSig (tidak ada diskon)',code:'UTXO baru: 0.04 BTC, address 3Abc1qRs...\nlocking: OP_HASH160 <bobScriptHash> OP_EQUAL\nCara belanja: OP_0 <sig1> <sig2> <redeemScript>',rows:[{l:'UTXO baru',v:'0.04 BTC, address 3Abc1qRs...'},{l:'Cara belanja',v:'scriptSig: data + redeemScript'},{l:'Kelemahan',v:'redeemScript besar di scriptSig — tidak dapat diskon weight'}],desc:'P2SH inovasi besar tapi ada kelemahan: redeemScript harus ada di scriptSig saat spending, tidak mendapat diskon weight. P2WSH menyelesaikan ini.',ops:[{t:'OP_HASH160',c:'oc-op'},{t:'<bobScriptHash>',c:'oc-hash'},{t:'OP_EQUAL',c:'oc-op'}]},
    ]},
    p2wpkh:{label:'P2WPKH',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO P2WPKH — address bc1q (20 bytes)',sub:'Native SegWit v0. Locking script minimalis, verifikasi implisit dari witness.',code:'address: bc1qa7f2...xk (bech32)\nnilai: 0.05 BTC\nlocking script: OP_0 <pubKeyHash20>',rows:[{l:'Address Alice',v:'bc1qa7f2...xk (bech32)'},{l:'Isi address',v:'witness version 0 + pubKeyHash 20 bytes'},{l:'Locking script',v:'OP_0 <pubKeyHash20> (22 bytes)'}],desc:'Locking script P2WPKH hanya 22 bytes: OP_0 (witness version 0) dan 20-byte pubKeyHash. Tidak berisi opcode verifikasi — semua dijalankan implisit oleh node SegWit.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<pubKeyHash20>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx SegWit — scriptSig kosong, witness terpisah',sub:'Witness data mendapat diskon 1/4 weight — ~27% lebih hemat dari P2PKH',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: kosong)\noutput[0]: bc1q3c9d...qp → 0.04 BTC\noutput[1]: bc1q9x2m...km → 0.009 BTC\nfee: 0.001 BTC\nukuran: ~141 vByte',rows:[{l:'Input',v:'0.05 BTC, scriptSig: kosong'},{l:'Witness',v:'terpisah — dihitung 1/4 weight'},{l:'Ukuran',v:'~141 vByte (27% lebih hemat dari P2PKH ~192 vByte)'}],desc:'Transaksi SegWit memiliki witness terpisah. Signature dan pubKey tidak di scriptSig melainkan di witness. Witness dihitung 1/4 weight sehingga lebih murah untuk mengisi block.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode address Bob → bech32 → pubKeyHash → locking script',sub:'Bech32 decode: HRP "bc" + witness version 0 + 20 bytes',code:'bobAddr: bc1q3c9d...qp\n  ↓ bech32 decode\n  witness version: 0\n  witness program: 3c9de5f6...(20 bytes)\nlocking script: OP_0 <3c9de5f6...>',rows:[{l:'Address Bob',v:'bc1q3c9d...qp (bech32)'},{l:'Witness version',v:'0 → P2WPKH'},{l:'Witness program',v:'3c9de5f6... (20 bytes = pubKeyHash)'},{l:'Locking script',v:'OP_0 <3c9de5f6...>'}],desc:'Wallet men-decode address bech32 Bob. Witness version 0 + 20 bytes program → ini P2WPKH. Locking script hanya 22 bytes tanpa opcode verifikasi.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobPubKeyHash20>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice tandatangani — signature dan pubKey masuk witness field',sub:'scriptSig tetap kosong — inilah inti Segregated Witness',code:'scriptSig: (kosong)\nwitness[0]: <aliceSignature> (71-72 bytes, 1/4 weight)\nwitness[1]: <alicePubKey> (33 bytes, 1/4 weight)',rows:[{l:'scriptSig',v:'kosong (0 bytes)'},{l:'witness[0]',v:'<ECDSA signature> 71-72 bytes'},{l:'witness[1]',v:'<compressed pubKey> 33 bytes'},{l:'Efektif',v:'104 bytes witness = hanya ~26 weight unit'}],desc:'Signature dan pubKey ada di witness terpisah. Karena witness dihitung 1/4 weight, 104 bytes data witness efektif setara ~26 bytes. Inilah sumber penghematan biaya SegWit.',ops:[{t:'(scriptSig kosong)',c:'oc-imp'},{t:'<sig>',c:'oc-sig'},{t:'<pubKey>',c:'oc-data'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node lihat OP_0 + 20 bytes → P2WPKH → verifikasi implisit dari witness',sub:'Semua logika verifikasi dijalankan implisit — locking script hanya penanda',code:'[locking] OP_0 <hash20>\n[witness] <sig> <pubKey>\n\nNode implisit: push <sig> → push <pubKey> → OP_DUP\n→ OP_HASH160 → compare <hash20> → OP_EQUALVERIFY → OP_CHECKSIG → TRUE',rows:[{l:'Locking script',v:'OP_0 <hash20> — hanya penanda'},{l:'Witness',v:'<sig> <pubKey>'},{l:'Verifikasi',v:'node jalankan logika P2PKH secara implisit'}],desc:'Node melihat OP_0 + 20-byte program → tahu P2WPKH v0 → ambil data dari witness → jalankan verifikasi P2PKH secara implisit. Locking script tidak berisi opcode verifikasi.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<hash20>',c:'oc-hash'},{t:'[OP_DUP implisit]',c:'oc-imp'},{t:'[OP_HASH160 implisit]',c:'oc-imp'},{t:'[OP_CHECKSIG implisit]',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2WPKH — format paling umum saat ini',sub:'Saat Bob belanja nanti: input ~68 vByte vs P2PKH ~148 vByte',code:'UTXO baru: 0.04 BTC, address bc1q3c9d...qp\nlocking: OP_0 <bobPubKeyHash20>\nCara belanja: scriptSig kosong + witness: [bobSig, bobPubKey]\nukuran input: ~68 vByte',rows:[{l:'UTXO baru',v:'0.04 BTC, address bc1q3c9d...qp'},{l:'Cara belanja',v:'scriptSig kosong + witness: [bobSig, bobPubKey]'},{l:'Efisiensi',v:'Input ~68 vByte (54% lebih kecil dari P2PKH)'}],desc:'P2WPKH adalah format paling umum saat ini. Kompatibel mundur dan jauh lebih efisien dari P2PKH.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobPubKeyHash20>',c:'oc-hash'}]},
    ]},
    p2wsh:{label:'P2WSH',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO P2WSH — address bc1q panjang (32 bytes)',sub:'SegWit versi P2SH: script kompleks + witness discount. SHA256 32 bytes.',code:'address: bc1qw5x2ynm... (bech32, lebih panjang dari P2WPKH)\nnilai: 0.05 BTC\nlocking script: OP_0 <scriptHash32>',rows:[{l:'Address Alice',v:'bc1qw5x2ynm... (bech32, 62 chars)'},{l:'Isi address',v:'witness version 0 + scriptHash 32 bytes'},{l:'Locking script',v:'OP_0 <scriptHash32> (34 bytes)'}],desc:'P2WSH seperti P2SH tapi untuk SegWit. Witness program 32 bytes (SHA256 dari witness script), bukan 20 bytes. Address lebih panjang dari P2WPKH tapi lebih collision-resistant.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<scriptHash32>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx P2WSH — script kompleks + witness discount',sub:'Ideal untuk multisig: script besar mendapat diskon weight di witness',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: kosong)\noutput[0]: bc1qr2ty... → 0.04 BTC\nfee: 0.001 BTC\n// witness script mendapat diskon 1/4 weight',rows:[{l:'Input',v:'0.05 BTC, P2WSH'},{l:'Keunggulan vs P2SH',v:'witness script di witness field → diskon 1/4 weight'},{l:'Ideal untuk',v:'multisig: script besar paling diuntungkan'}],desc:'P2WSH sangat berguna untuk multisig karena witness script yang besar mendapat diskon weight. Di P2SH redeem script besar harus di scriptSig tanpa diskon.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode address Bob → bech32 → scriptHash 32 bytes',sub:'Witness version 0 + 32 bytes program → ini P2WSH (bukan P2WPKH yang 20 bytes)',code:'bobAddr: bc1qr2ty...\n  ↓ bech32 decode\n  witness version: 0\n  witness program: r2tye5f6...(32 bytes)\nlocking script: OP_0 <r2tye5f6...>\n// witness script Bob: OP_2 <pk1><pk2><pk3> OP_3 OP_CHECKMULTISIG',rows:[{l:'Address Bob',v:'bc1qr2ty... (bech32, 62 chars)'},{l:'Witness version',v:'0 (SegWit v0)'},{l:'Witness program',v:'r2tye5f6... (32 bytes = SHA256 dari witnessScript)'},{l:'Locking script',v:'OP_0 <r2tye5f6...> (34 bytes)'}],desc:'Wallet mengidentifikasi P2WSH karena witness program 32 bytes (bukan 20). SHA256 32 bytes ini adalah hash dari witness script yang hanya Bob tahu.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobScriptHash32>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice sediakan data + witnessScript di witness field',sub:'Sama dengan P2SH tapi semua di witness — scriptSig tetap kosong',code:'scriptSig: (kosong)\nwitness[0]: (kosong — dummy)\nwitness[1]: <sig1>\nwitness[2]: <sig2>\nwitness[3]: <witnessScript>',rows:[{l:'scriptSig',v:'kosong (0 bytes)'},{l:'witness[1-2]',v:'<sig1>, <sig2> — dihitung 1/4 weight'},{l:'witness[3]',v:'<witnessScript> — juga 1/4 weight'},{l:'Hemat vs P2SH',v:'redeem script besar di witness → ~75% lebih murah'}],desc:'Di P2WSH, witnessScript ada di witness field dan mendapat diskon 1/4 weight. Di P2SH, redeem script harus di scriptSig tanpa diskon. Untuk multisig besar, P2WSH jauh lebih murah.',ops:[{t:'(scriptSig kosong)',c:'oc-imp'},{t:'<sig1>',c:'oc-sig'},{t:'<sig2>',c:'oc-sig'},{t:'<witnessScript>',c:'oc-hash'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node verifikasi dua fase: SHA256 witnessScript, lalu eksekusi',sub:'SHA256 (32 bytes) bukan SHA256+RIPEMD160 (20 bytes) seperti P2SH',code:'Fase 1: SHA256(<witnessScript>) == scriptHash32? ✓\nFase 2: eksekusi witnessScript:\nOP_2 <pk1><pk2><pk3> OP_3 OP_CHECKMULTISIG → TRUE',rows:[{l:'Fase 1',v:'SHA256(witnessScript) == scriptHash32 → cocok'},{l:'Fase 2',v:'eksekusi witnessScript dari witness field'},{l:'vs P2SH',v:'SHA256 32 bytes vs SHA256+RIPEMD160 20 bytes'}],desc:'Verifikasi P2WSH dua fase seperti P2SH, tapi SHA256 murni 32 bytes untuk hash witnessScript. Node melihat OP_0 + 32 bytes → tahu ini P2WSH v0.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<scriptHash32>',c:'oc-hash'},{t:'SHA256 verify',c:'oc-op'},{t:'eksekusi witnessScript',c:'oc-imp'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2WSH — script kompleks + witness discount',sub:'Paling efisien untuk multisig dibanding P2SH',code:'UTXO baru: 0.04 BTC, address bc1qr2ty...\nlocking: OP_0 <bobScriptHash32>\nCara belanja: scriptSig kosong + witness: [sigs + witnessScript]',rows:[{l:'UTXO baru',v:'0.04 BTC, address bc1qr2ty...'},{l:'Cara belanja',v:'scriptSig kosong + witness: sigs + witnessScript'},{l:'vs P2SH multisig',v:'P2WSH ~30-40% lebih murah untuk multisig besar'}],desc:'P2WSH adalah cara terbaik untuk multisig sebelum Taproot. witnessScript bisa sangat kompleks dan semuanya mendapat diskon weight.',ops:[{t:'OP_0',c:'oc-ver'},{t:'<bobScriptHash32>',c:'oc-hash'}]},
    ]},
    p2tr:{label:'P2TR',era:'segwit',steps:[
      {id:'utxo',cls:'c-utxo',n:'01',lbl:'Alice punya UTXO P2TR — address bc1p, paling efisien',sub:'Taproot (BIP 340-342, aktif Nov 2021). Key path dan script path dalam satu output.',code:'address: bc1pa7f2...xk (bech32m)\nnilai: 0.05 BTC\nlocking script: OP_1 <tweakedPubKey32>',rows:[{l:'Address Alice',v:'bc1pa7f2...xk (bech32m, dimulai "bc1p")'},{l:'Isi address',v:'witness version 1 + tweakedPubKey 32 bytes'},{l:'Locking script',v:'OP_1 <tweakedPubKey32> (34 bytes)'}],desc:'P2TR menggunakan bech32m dan witness version 1 (OP_1). Tweaked public key menggabungkan key path dan script path — memungkinkan keduanya dalam satu output yang terlihat identik dari luar.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<tweakedPubKey32>',c:'oc-hash'}]},
      {id:'build',cls:'c-build',n:'02',lbl:'Alice membangun tx P2TR — paling efisien dari semua format',sub:'Input ~57.5 vByte (vs P2WPKH ~68 vByte, vs P2PKH ~148 vByte)',code:'input[0]: txid:vout → 0.05 BTC (scriptSig: kosong)\noutput[0]: bc1p3c9d...qp → 0.04 BTC\noutput[1]: bc1pa7f2...xk → 0.009 BTC\nfee: 0.001 BTC\nukuran: ~111 vByte',rows:[{l:'Input',v:'0.05 BTC, P2TR, scriptSig: kosong'},{l:'Output ke Bob',v:'0.04 BTC → bc1p3c9d...qp'},{l:'Ukuran tx',v:'~111 vByte — paling efisien dari semua format'}],desc:'Transaksi P2TR key path paling efisien: Schnorr signature hanya 64 bytes, tidak perlu sertakan pubKey di witness, dan output P2TR 34 bytes.',ops:[]},
      {id:'lock',cls:'c-lock',n:'03',lbl:'Decode address Bob → bech32m → tweakedPubKey 32 bytes',sub:'bech32m (checksum berbeda dari bech32) untuk witness version 1',code:'bobAddr: bc1p3c9d...qp\n  ↓ bech32m decode\n  witness version: 1\n  witness program: 3c9de5f6...(32 bytes)\nlocking script: OP_1 <3c9de5f6...>',rows:[{l:'Address Bob',v:'bc1p3c9d...qp (bech32m)'},{l:'Witness version',v:'1 → Taproot'},{l:'Witness program',v:'3c9de5f6... (32 bytes = tweakedPubKey, x-only)'},{l:'Locking script',v:'OP_1 <3c9de5f6...>'}],desc:'bech32m adalah checksum yang diperbarui dari bech32 untuk mendukung panjang witness program yang bervariasi. Witness version 1 + 32 bytes → ini P2TR.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<bobTweakedPubKey32>',c:'oc-hash'}]},
      {id:'sign',cls:'c-sign',n:'04',lbl:'Alice tandatangani Schnorr — hanya 64 bytes di witness',sub:'Tidak perlu sertakan pubKey — tweakedPubKey sudah di locking script',code:'scriptSig: (kosong)\nwitness[0]: <aliceSchnorrSig> (64 bytes flat, r+s)',rows:[{l:'scriptSig',v:'kosong (0 bytes)'},{l:'witness[0]',v:'<Schnorr signature> 64 bytes flat'},{l:'pubKey',v:'tidak disertakan — sudah di locking script'},{l:'vs ECDSA',v:'64 bytes vs 71-72 bytes (hemat ~10%)'}],desc:'Schnorr signature hanya 64 bytes (r+s flat) vs ECDSA 71-72 bytes DER. Untuk key path spending, witness hanya berisi satu Schnorr signature.',ops:[{t:'(scriptSig kosong)',c:'oc-imp'},{t:'<schnorrSig 64 bytes>',c:'oc-sig'}]},
      {id:'verify',cls:'c-verify',n:'05',lbl:'Node lihat OP_1 + 32 bytes → Taproot → Schnorr verify',sub:'Verifikasi paling sederhana — satu langkah, tidak ada stack manipulation',code:'[locking] OP_1 <tweakedPubKey32>\n[witness] <schnorrSig>\n\n1. OP_1 → witness version 1 → Taproot\n2. Load tweakedPubKey dari locking script\n3. Schnorr_verify(tweakedPubKey, txHash, sig) → TRUE',rows:[{l:'OP_1',v:'witness version 1 → Taproot key path'},{l:'tweakedPubKey',v:'diambil dari locking script'},{l:'Schnorr verify',v:'verify(tweakedPubKey, txHash, schnorrSig) → TRUE'}],desc:'Verifikasi P2TR key path paling sederhana: node melihat OP_1 → Taproot → ambil tweakedPubKey dari locking script → Schnorr verify. Tidak ada OP_DUP, OP_HASH160, OP_EQUALVERIFY.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<tweakedPubKey>',c:'oc-hash'},{t:'<schnorrSig>',c:'oc-sig'},{t:'Schnorr_verify',c:'oc-op'}]},
      {id:'done',cls:'c-done',n:'06',lbl:'Bob punya UTXO P2TR — paling efisien, paling privat, paling fleksibel',sub:'Key path identik dengan single-sig. Script path bisa sembunyikan kondisi apapun.',code:'UTXO baru: 0.04 BTC, address bc1p3c9d...qp\nlocking: OP_1 <bobTweakedPubKey32>\nKey path: witness: [<bobSchnorrSig>]\nScript path: witness: [<data> <script> <controlBlock>]',rows:[{l:'UTXO baru',v:'0.04 BTC, address bc1p3c9d...qp'},{l:'Key path',v:'witness: [<schnorrSig>] — hanya 64 bytes'},{l:'Script path',v:'ungkap salah satu script dari MAST'},{l:'Privacy',v:'multisig identik dengan single-sig dari luar'}],desc:'P2TR paling canggih: paling efisien (input ~57.5 vByte), paling privat, dan paling fleksibel. Ini puncak evolusi Bitcoin Script.',ops:[{t:'OP_1',c:'oc-ver'},{t:'<bobTweakedPubKey32>',c:'oc-hash'}]},
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
       desc:'Duplikasi item teratas stack. Di P2PKH dibutuhkan agar pubKey bisa dipakai dua kali: sekali untuk OP_HASH160, sekali untuk OP_CHECKSIG.',
       addr:[{tag:'t-p2pkh',note:'Wajib ada'},{tag:'t-p2wpkh',note:'Dijalankan implisit'},{tag:'t-p2tr',note:'Bisa muncul di Tapscript'},{tag:'t-p2sh',note:'Di dalam redeem script'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:1},{t:'OP_HASH160',h:0},{t:'<pubKeyHash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:0}]}]},
      {name:'OP_DROP',hex:'0x75',status:'active',sin:['a','b'],sout:['a'],spop:['b'],
       desc:'Hapus item teratas stack. Sering mengikuti OP_CHECKLOCKTIMEVERIFY dan OP_CHECKSEQUENCEVERIFY karena kedua opcode tersebut tidak mengkonsumsi nilai dari stack.',
       addr:[{tag:'t-htlc',note:'Selalu hadir setelah CLTV atau CSV'},{tag:'t-p2sh',note:'Di redeem script timelock'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'CLTV timelock script',ops:[{t:'<locktime>',h:0},{t:'OP_CLTV',h:0},{t:'OP_DROP',h:1},{t:'OP_DUP',h:0},{t:'...',h:0}]}]},
      {name:'OP_SWAP',hex:'0x7c',status:'active',sin:['a','b'],sout:['b','a'],spop:[],
       desc:'Tukar posisi dua item teratas stack.',
       addr:[{tag:'t-p2sh',note:'Di redeem script kompleks'},{tag:'t-htlc',note:'Mengatur urutan operasi'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Script kondisional',ops:[{t:'<data>',h:0},{t:'OP_SWAP',h:1},{t:'OP_HASH160',h:0},{t:'OP_EQUALVERIFY',h:0}]}]},
      {name:'OP_OVER',hex:'0x79',status:'active',sin:['a','b'],sout:['a','b','a'],spop:[],
       desc:'Copy item kedua dari atas stack dan push ke atas tanpa menghapusnya.',
       addr:[{tag:'t-p2sh',note:'Di redeem script kompleks'},{tag:'t-p2wsh',note:'Di witness script'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Script kompleks',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_OVER',h:1},{t:'OP_ADD',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_2DUP',hex:'0x6e',status:'active',sin:['a','b'],sout:['a','b','a','b'],spop:[],
       desc:'Duplikasi dua item teratas stack sekaligus.',
       addr:[{tag:'t-p2sh',note:'Di redeem script kompleks'},{tag:'t-htlc',note:'Membandingkan dua nilai'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'SHA1 collision puzzle',ops:[{t:'OP_2DUP',h:1},{t:'OP_EQUAL',h:0},{t:'OP_NOT',h:0},{t:'OP_VERIFY',h:0}]}]},
      {name:'OP_NIP',hex:'0x77',status:'active',sin:['a','b'],sout:['b'],spop:['a'],
       desc:'Hapus item kedua dari atas stack, biarkan item teratas.',
       addr:[{tag:'t-p2sh',note:'Di redeem script'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Membersihkan stack',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_NIP',h:1}]}]},
    ]},
    {cat:'Crypto & Hash',list:[
      {name:'OP_HASH160',hex:'0xa9',status:'active',sin:['<data>'],sout:['<hash20>'],spop:['<data>'],
       desc:'SHA256 lalu RIPEMD160. Mengubah public key (33 bytes) menjadi pubKeyHash (20 bytes). Juga dipakai di P2SH untuk meng-hash redeem script.',
       addr:[{tag:'t-p2pkh',note:'Wajib ada'},{tag:'t-p2sh',note:'Wajib ada'},{tag:'t-p2wpkh',note:'Dijalankan implisit'},{tag:'t-p2tr',note:'Tidak dipakai'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:1},{t:'<pubKeyHash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:0}]},{label:'P2SH locking script',ops:[{t:'OP_HASH160',h:1},{t:'<scriptHash>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_SHA256',hex:'0xa8',status:'active',sin:['<data>'],sout:['<hash32>'],spop:['<data>'],
       desc:'SHA256 dari item teratas stack (32 bytes). Dipakai di P2WSH dan di HTLC Lightning.',
       addr:[{tag:'t-p2wsh',note:'Implisit untuk witness script hash'},{tag:'t-htlc',note:'Wajib ada untuk payment hash'},{tag:'t-p2tr',note:'Bisa muncul di Tapscript'}],
       ex:[{label:'HTLC payment script',ops:[{t:'OP_SHA256',h:1},{t:'<payment_hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_DUP',h:0},{t:'...',h:0}]}]},
      {name:'OP_SHA1',hex:'0xa7',status:'active',sin:['<data>'],sout:['<hash20>'],spop:['<data>'],
       desc:'SHA1 dari item teratas stack. SHA1 dianggap lemah secara kriptografis (collision attack ditemukan 2017). Masih aktif tapi sangat jarang dipakai di script produksi.',
       addr:[{tag:'t-p2sh',note:'Kadang di puzzle script eksperimental'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'SHA1 collision puzzle',ops:[{t:'OP_SHA1',h:1},{t:'OP_SWAP',h:0},{t:'OP_SHA1',h:1},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_HASH256',hex:'0xaa',status:'active',sin:['<data>'],sout:['<hash32>'],spop:['<data>'],
       desc:'Double SHA256 — SHA256 dijalankan dua kali (SHA256(SHA256(data))) — dipakai untuk block header, txid, dan Merkle tree di Bitcoin.',
       addr:[{tag:'t-p2sh',note:'Bisa di redeem script untuk verifikasi data'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Double SHA256',ops:[{t:'<data>',h:0},{t:'OP_HASH256',h:1},{t:'<expected>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_CHECKSIG',hex:'0xac',status:'active',sin:['<sig>','<pubKey>'],sout:['TRUE/FALSE'],spop:['<sig>','<pubKey>'],
       desc:'Verifikasi signature terhadap hash transaksi menggunakan pubKey. Opcode paling fundamental Bitcoin. P2PK/P2PKH: ECDSA. P2TR key path: Schnorr.',
       addr:[{tag:'t-p2pk',note:'Satu-satunya opcode di locking script P2PK'},{tag:'t-p2pkh',note:'Opcode terakhir dan paling krusial'},{tag:'t-p2wpkh',note:'Dijalankan implisit dari witness'},{tag:'t-p2tr',note:'Key path: Schnorr. Script path: juga Schnorr'},{tag:'t-p2sh',note:'Di dalam redeem script'}],
       ex:[{label:'P2PK',ops:[{t:'<pubKey>',h:0},{t:'OP_CHECKSIG',h:1}]},{label:'P2PKH',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_CHECKSIG',h:1}]}]},
      {name:'OP_CHECKMULTISIG',hex:'0xae',status:'active',sin:['OP_0','sigs','M','pks','N'],sout:['TRUE/FALSE'],spop:['semua'],
       desc:'Verifikasi M dari N signature. Ada off-by-one bug historis: membutuhkan OP_0 dummy. Bug ini tidak bisa diperbaiki tanpa hard fork. Di Tapscript digantikan OP_CHECKSIGADD.',
       addr:[{tag:'t-p2sh',note:'Paling umum via P2SH'},{tag:'t-p2wsh',note:'Di witness script multisig SegWit'},{tag:'t-p2tr',note:'Tidak dipakai — pakai OP_CHECKSIGADD'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'2-of-3 locking script',ops:[{t:'OP_2',h:0},{t:'<pk1>',h:0},{t:'<pk2>',h:0},{t:'<pk3>',h:0},{t:'OP_3',h:0},{t:'OP_CHECKMULTISIG',h:1}]}]},
      {name:'OP_CHECKSIGADD',hex:'0xba',status:'tapscript',sin:['<sig>','<n>','<pubKey>'],sout:['n+1 atau n'],spop:['<sig>','<n>','<pubKey>'],
       desc:'Tapscript only. Kalau signature valid: push n+1. Kalau tidak: push n. Multisig Schnorr efisien tanpa off-by-one bug.',
       addr:[{tag:'t-p2tr',note:'Hanya di Tapscript (script path P2TR)'},{tag:'t-p2pkh',note:'Tidak tersedia'},{tag:'t-p2sh',note:'Tidak tersedia'}],
       ex:[{label:'Tapscript 2-of-3 multisig',ops:[{t:'<pk1>',h:0},{t:'OP_CHECKSIG',h:0},{t:'<pk2>',h:0},{t:'OP_CHECKSIGADD',h:1},{t:'<pk3>',h:0},{t:'OP_CHECKSIGADD',h:1},{t:'OP_2',h:0},{t:'OP_NUMEQUAL',h:0}]}]},
      {name:'OP_EQUALVERIFY',hex:'0x88',status:'active',sin:['a','b'],sout:[],spop:['a','b'],
       desc:'Pop dua item, bandingkan. Kalau sama: lanjut. Kalau berbeda: script gagal segera.',
       addr:[{tag:'t-p2pkh',note:'Wajib ada sebelum OP_CHECKSIG'},{tag:'t-p2wpkh',note:'Dijalankan implisit'},{tag:'t-htlc',note:'Verifikasi payment preimage'}],
       ex:[{label:'P2PKH locking script',ops:[{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:1},{t:'OP_CHECKSIG',h:0}]}]},
      {name:'OP_EQUAL',hex:'0x87',status:'active',sin:['a','b'],sout:['TRUE/FALSE'],spop:['a','b'],
       desc:'Pop dua item, bandingkan, push TRUE atau FALSE ke stack. Dipakai di P2SH sebagai opcode terakhir.',
       addr:[{tag:'t-p2sh',note:'Opcode terakhir di locking script P2SH'},{tag:'t-p2tr',note:'Dipakai di Tapscript'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'P2SH locking script',ops:[{t:'OP_HASH160',h:0},{t:'<scriptHash>',h:0},{t:'OP_EQUAL',h:1}]}]},
    ]},
    {cat:'Flow Control',list:[
      {name:'OP_IF',hex:'0x63',status:'active',sin:['condition'],sout:[],spop:['condition'],
       desc:'Pop item. Kalau TRUE: eksekusi blok IF. Kalau FALSE: lompat ke ELSE atau ENDIF. Fundamental untuk HTLC Lightning.',
       addr:[{tag:'t-htlc',note:'Wajib ada — dua jalur: payment dan timeout'},{tag:'t-p2sh',note:'Di redeem script kondisional'},{tag:'t-p2wsh',note:'Di witness script'},{tag:'t-p2tr',note:'Tersedia di Tapscript'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'HTLC script structure',ops:[{t:'OP_IF',h:1},{t:'OP_SHA256',h:0},{t:'<hash>',h:0},{t:'OP_EQUALVERIFY',h:0},{t:'OP_ELSE',h:0},{t:'<timeout>',h:0},{t:'OP_CSV',h:0},{t:'OP_ENDIF',h:0}]}]},
      {name:'OP_ELSE',hex:'0x67',status:'active',sin:[],sout:[],spop:[],
       desc:'Pasangan OP_IF. Dieksekusi kalau kondisi OP_IF FALSE.',
       addr:[{tag:'t-htlc',note:'Jalur timeout ada di blok ELSE'},{tag:'t-p2sh',note:'Di redeem script kondisional'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'IF-ELSE-ENDIF',ops:[{t:'OP_IF',h:0},{t:'<payment>',h:0},{t:'OP_ELSE',h:1},{t:'<timeout>',h:0},{t:'OP_ENDIF',h:0}]}]},
      {name:'OP_ENDIF',hex:'0x68',status:'active',sin:[],sout:[],spop:[],
       desc:'Penutup wajib dari setiap OP_IF. Script dianggap malformed tanpa OP_ENDIF yang cocok.',
       addr:[{tag:'t-htlc',note:'Wajib ada di setiap OP_IF'},{tag:'t-p2sh',note:'Wajib di redeem script dengan OP_IF'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Menutup blok kondisional',ops:[{t:'OP_IF',h:0},{t:'...',h:0},{t:'OP_ELSE',h:0},{t:'...',h:0},{t:'OP_ENDIF',h:1}]}]},
      {name:'OP_RETURN',hex:'0x6a',status:'active',sin:[],sout:[],spop:[],
       desc:'Terminasi script segera, tandai output sebagai unspendable. Tidak masuk UTXO set. Bisa diikuti data; batas ukurannya relay policy per node (konvensi lama: 80 bytes).',
       addr:[{tag:'t-p2sh',note:'Tidak ada hubungan — tipe output tersendiri'},{tag:'t-p2pkh',note:'Tidak ada hubungan'}],
       ex:[{label:'OP_RETURN data output',ops:[{t:'OP_RETURN',h:1},{t:'<data (batas policy)>',h:0}]}]},
      {name:'OP_VERIFY',hex:'0x69',status:'active',sin:['condition'],sout:[],spop:['condition'],
       desc:'Pop item. Kalau TRUE: lanjut. Kalau FALSE: script gagal segera. Sering dikombinasikan dengan OP_EQUAL.',
       addr:[{tag:'t-p2sh',note:'Di redeem script'},{tag:'t-htlc',note:'Verifikasi kondisi'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'OP_EQUAL + OP_VERIFY',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_EQUAL',h:0},{t:'OP_VERIFY',h:1}]}]},
    ]},
    {cat:'Timelock',list:[
      {name:'OP_CHECKLOCKTIMEVERIFY',hex:'0xb1',status:'active',sin:['<locktime>'],sout:['<locktime>'],spop:[],
       desc:'CLTV (BIP 65, aktif 2015). Verifikasi nLocktime transaksi >= nilai di stack (absolute locktime). Tidak mengkonsumsi nilai dari stack.',
       addr:[{tag:'t-htlc',note:'Wajib ada di jalur timeout HTLC'},{tag:'t-p2sh',note:'Di redeem script timelock'},{tag:'t-p2wsh',note:'Di witness script timelock'},{tag:'t-p2tr',note:'Tersedia di Tapscript'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Absolute timelock output',ops:[{t:'<blockheight>',h:0},{t:'OP_CLTV',h:1},{t:'OP_DROP',h:0},{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'...',h:0}]}]},
      {name:'OP_CHECKSEQUENCEVERIFY',hex:'0xb2',status:'active',sin:['<sequence>'],sout:['<sequence>'],spop:[],
       desc:'CSV (BIP 112, aktif 2016). Verifikasi nSequence input >= nilai di stack (relative locktime). Fondasi commitment transaction Lightning.',
       addr:[{tag:'t-htlc',note:'Wajib ada di commitment transaction Lightning'},{tag:'t-p2sh',note:'Di redeem script relative timelock'},{tag:'t-p2wsh',note:'Di witness script'},{tag:'t-p2tr',note:'Tersedia di Tapscript'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Lightning commitment (144 block)',ops:[{t:'<144>',h:0},{t:'OP_CSV',h:1},{t:'OP_DROP',h:0},{t:'OP_DUP',h:0},{t:'OP_HASH160',h:0},{t:'<hash>',h:0},{t:'...',h:0}]}]},
    ]},
    {cat:'Arithmetic',list:[
      {name:'OP_ADD',hex:'0x93',status:'active',sin:['a','b'],sout:['a+b'],spop:['a','b'],
       desc:'Pop dua item, jumlahkan, push hasilnya. Hanya bekerja dengan integer. Dipakai di Tapscript untuk menghitung jumlah signature yang valid.',
       addr:[{tag:'t-p2tr',note:'Di Tapscript multisig berbasis OP_CHECKSIGADD'},{tag:'t-p2sh',note:'Bisa di redeem script'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Menghitung valid sigs',ops:[{t:'<sig1>',h:0},{t:'OP_CHECKSIG',h:0},{t:'<sig2>',h:0},{t:'OP_CHECKSIGADD',h:0},{t:'OP_2',h:0},{t:'OP_NUMEQUAL',h:0}]}]},
      {name:'OP_SUB',hex:'0x94',status:'active',sin:['a','b'],sout:['a-b'],spop:['a','b'],
       desc:'Pop dua item, kurangi (a-b), push hasilnya. Jarang dipakai di script produksi.',
       addr:[{tag:'t-p2sh',note:'Jarang, di script eksperimental'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Pengurangan sederhana',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_SUB',h:1},{t:'<0>',h:0},{t:'OP_EQUAL',h:0}]}]},
      {name:'OP_MUL',hex:'0x95',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan oleh Satoshi Nakamoto pada 2010. Kekhawatiran: potensi bug integer overflow dan kompleksitas implementasi yang bisa membahayakan konsensus.',
       impactNote:'Tidak ada script produksi yang menggunakan OP_MUL. Tidak ada UTXO yang terkunci dengannya. Dampak nol.',
       sin:['a','b'],sout:['a*b'],spop:['a','b'],
       desc:'Perkalian dua integer. Dinonaktifkan sejak 2010.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia — script akan gagal'},{tag:'t-p2pkh',note:'Tidak tersedia'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_MUL',h:1},{t:'<- GAGAL',h:0}]}]},
      {name:'OP_DIV',hex:'0x96',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan bersamaan dengan OP_MUL pada 2010. Bahaya utama: pembagian dengan nol bisa crash node dan menjadi vektor serangan.',
       impactNote:'Tidak ada script produksi yang bergantung pada OP_DIV. Dampak nol.',
       sin:['a','b'],sout:['a/b'],spop:['a','b'],
       desc:'Pembagian integer. Dinonaktifkan sejak 2010.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia'},{tag:'t-p2pkh',note:'Tidak tersedia'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<a>',h:0},{t:'<b>',h:0},{t:'OP_DIV',h:1},{t:'<- GAGAL',h:0}]}]},
      {name:'OP_NOT',hex:'0x91',status:'active',sin:['a'],sout:['!a'],spop:['a'],
       desc:'Pop item. Kalau 0: push 1. Kalau non-zero: push 0. Logika NOT.',
       addr:[{tag:'t-p2sh',note:'Di redeem script kondisi negatif'},{tag:'t-htlc',note:'Dalam konstruksi kondisional'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'Kondisi negatif',ops:[{t:'<condition>',h:0},{t:'OP_NOT',h:1},{t:'OP_VERIFY',h:0}]}]},
    ]},
    {cat:'Disabled Opcodes',list:[
      {name:'OP_CAT',hex:'0x7e',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan oleh Satoshi pada 2010. Bisa dipakai untuk quadratic data expansion attack yang membebani node.',
       impactNote:'Tidak ada UTXO produksi yang terkunci dengan OP_CAT. Tidak ada dampak pada transaksi beredar.',
       sin:['a','b'],sout:['ab'],spop:['a','b'],
       desc:'Gabungkan dua item stack menjadi satu string. Dinonaktifkan karena potensi quadratic data expansion.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia'},{tag:'t-p2tr',note:'Ada proposal untuk aktifkan di Tapscript dengan batasan'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<str1>',h:0},{t:'<str2>',h:0},{t:'OP_CAT',h:1},{t:'<- GAGAL',h:0}]}]},
      {name:'OP_SUBSTR',hex:'0x7f',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan bersama OP_CAT pada 2010. Kompleksitas implementasi dan potensi bug konsensus.',
       impactNote:'Tidak ada dampak pada transaksi beredar.',
       sin:['<str>','<begin>','<size>'],sout:['<substr>'],spop:['semua'],
       desc:'Ambil substring dari string di stack. Dinonaktifkan sejak 2010.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia'},{tag:'t-p2pkh',note:'Tidak tersedia'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<string>',h:0},{t:'<0>',h:0},{t:'<10>',h:0},{t:'OP_SUBSTR',h:1},{t:'<- GAGAL',h:0}]}]},
      {name:'OP_LSHIFT',hex:'0x98',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan bersama kelompok opcode aritmatika pada 2010. Bit shift berpotensi menghasilkan nilai sangat besar secara tidak terduga.',
       impactNote:'Tidak ada dampak pada transaksi beredar.',
       sin:['a','n'],sout:['a<<n'],spop:['a','n'],
       desc:'Left bit shift. Dinonaktifkan sejak 2010.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<value>',h:0},{t:'<n>',h:0},{t:'OP_LSHIFT',h:1},{t:'<- GAGAL',h:0}]}]},
      {name:'OP_RSHIFT',hex:'0x99',status:'disabled',disableYear:'2010',
       disableReason:'Dinonaktifkan bersama OP_LSHIFT pada 2010 dengan alasan yang sama.',
       impactNote:'Tidak ada dampak pada transaksi beredar.',
       sin:['a','n'],sout:['a>>n'],spop:['a','n'],
       desc:'Right bit shift. Dinonaktifkan sejak 2010.',
       addr:[{tag:'t-p2sh',note:'Tidak tersedia'}],
       ex:[{label:'(Dinonaktifkan 2010)',ops:[{t:'<value>',h:0},{t:'<n>',h:0},{t:'OP_RSHIFT',h:1},{t:'<- GAGAL',h:0}]}]},
    ]},
    {cat:'Tapscript Only',list:[
      {name:'OP_SUCCESS',hex:'0x50+',status:'tapscript',sin:['(apapun)'],sout:['TRUE'],spop:[],
       desc:'Kumpulan opcode yang saat ini selalu sukses segera. Desain untuk upgrade masa depan tanpa hard fork.',
       addr:[{tag:'t-p2tr',note:'Hanya di Tapscript'},{tag:'t-p2pkh',note:'Tidak tersedia'},{tag:'t-p2sh',note:'Tidak tersedia'}],
       ex:[{label:'Upgrade path placeholder',ops:[{t:'<data>',h:0},{t:'OP_SUCCESS80',h:1}]}]},
      {name:'OP_1 (OP_TRUE)',hex:'0x51',status:'active',sin:[],sout:['1'],spop:[],
       desc:'Push angka 1 ke stack. Di locking script P2TR berfungsi sebagai witness version 1.',
       addr:[{tag:'t-p2tr',note:'Wajib ada sebagai byte pertama locking script P2TR'},{tag:'t-p2wpkh',note:'Tidak dipakai — P2WPKH pakai OP_0'},{tag:'t-p2pkh',note:'Tidak dipakai'}],
       ex:[{label:'P2TR locking script',ops:[{t:'OP_1',h:1},{t:'<32-byte-tweaked-pubkey>',h:0}]}]},
      {name:'OP_0 (OP_FALSE)',hex:'0x00',status:'active',sin:[],sout:['0'],spop:[],
       desc:'Push angka 0 ke stack. Di locking script SegWit berfungsi sebagai witness version 0. Di P2MS dipakai sebagai dummy value untuk off-by-one bug.',
       addr:[{tag:'t-p2wpkh',note:'Wajib ada sebagai byte pertama locking script'},{tag:'t-p2wsh',note:'Wajib ada sebagai byte pertama locking script'},{tag:'t-p2sh',note:'Di unlocking script multisig sebagai dummy'},{tag:'t-p2tr',note:'Tidak dipakai di locking script P2TR'}],
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
        var statusLabel={active:'Aktif',disabled:'Nonaktif '+(op.disableYear||''),tapscript:'Tapscript'}[op.status]||op.status;
        var sl=document.createElement('span');sl.className='b21-s213-status-pill s213-pill-'+op.status;sl.textContent=statusLabel;
        btn.appendChild(dot);btn.appendChild(nm);btn.appendChild(sl);
        btn.addEventListener('click',function(){sel=op;buildLeft();buildRight();});
        el.appendChild(btn);
      });
    });
  }

  function buildRight(){
    var el=g('b21-s213-right');if(!el) return;
    if(!sel){el.innerHTML='<div class="b21-s213-empty">← Pilih opcode untuk mulai</div>';return;}
    var op=sel;el.innerHTML='';
    var hdrCls={active:'h-active',disabled:'h-disabled',tapscript:'h-tapscript'}[op.status]||'h-active';
    var statusLabel={active:'Aktif',disabled:'Dinonaktifkan '+(op.disableYear||''),tapscript:'Tapscript Only'}[op.status]||op.status;
    var hdr=document.createElement('div');hdr.className='b21-s213-hdr '+hdrCls;
    hdr.innerHTML='<div class="b21-s213-hdr-name">'+op.name+'</div>'+
      '<div class="b21-s213-hdr-hex">hex: '+op.hex+'</div>'+
      '<div class="b21-s213-hdr-row"><div class="b21-s213-badge">'+statusLabel+'</div></div>';
    el.appendChild(hdr);
    var scCls={active:'sc-active',disabled:'sc-disabled',tapscript:'sc-tapscript'}[op.status]||'sc-active';
    var scLbl={active:'Status: Aktif',disabled:'Mengapa dinonaktifkan?',tapscript:'Tapscript Only'}[op.status];
    var scText={active:'Opcode ini aktif dan bisa dipakai sesuai konteks yang tercantum di bawah.',tapscript:'Opcode ini hanya tersedia di script path Taproot (P2TR). Tidak bisa dipakai di P2PKH, P2SH, P2WPKH, atau P2WSH.'}[op.status]||op.disableReason||'';
    var sc=document.createElement('div');sc.className='b21-s213-status-card '+scCls;
    sc.innerHTML='<div class="b21-s213-status-lbl">'+scLbl+'</div>'+
      '<div class="b21-s213-status-text">'+scText+'</div>'+
      (op.impactNote?'<div class="b21-s213-impact imp-safe">Dampak: '+op.impactNote+'</div>':'');
    el.appendChild(sc);
    var sv=document.createElement('div');sv.className='b21-s213-stack-wrap';
    var svl=document.createElement('div');svl.className='b21-s213-stack-lbl';svl.textContent='Stack effect:';sv.appendChild(svl);
    var row=document.createElement('div');row.className='b21-s213-stack-row';
    var before=document.createElement('div');before.className='b21-s213-stack-col';
    var blbl=document.createElement('div');blbl.className='b21-s213-stack-col-lbl';blbl.textContent='Sebelum';
    op.sin.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-in';d.textContent=item;before.appendChild(d);});
    before.appendChild(blbl);
    var arr=document.createElement('div');arr.className='b21-s213-stack-arrow';arr.textContent='→';
    var after=document.createElement('div');after.className='b21-s213-stack-col';
    var albl=document.createElement('div');albl.className='b21-s213-stack-col-lbl';albl.textContent='Sesudah';
    op.sout.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-out';d.textContent=item;after.appendChild(d);});
    if(op.spop&&op.spop.length>0){op.spop.slice().reverse().forEach(function(item){var d=document.createElement('div');d.className='b21-s213-stack-item si-pop';d.textContent=item+' (pop)';after.appendChild(d);});}
    after.appendChild(albl);
    row.appendChild(before);row.appendChild(arr);row.appendChild(after);sv.appendChild(row);el.appendChild(sv);
    var desc=document.createElement('div');desc.className='b21-s213-desc-card';desc.textContent=op.desc;el.appendChild(desc);
    if(op.addr&&op.addr.length>0){
      var aw=document.createElement('div');aw.className='b21-s213-addr-wrap';
      var awl=document.createElement('div');awl.className='b21-s213-addr-lbl';awl.textContent='Penggunaan per tipe address:';aw.appendChild(awl);
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
      var exl=document.createElement('div');exl.className='b21-s213-ex-lbl';exl.textContent='Contoh script nyata:';exw.appendChild(exl);
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
     desc:'Versi block yang menandai aturan konsensus yang dipakai. Bit-bit tertentu dipakai untuk sinyal soft fork (BIP 9). Version 0x20000000 adalah standar saat ini setelah Taproot aktif.'},
    {id:'fp',cls:'f-prevhash',name:'Previous Block Hash',bytes:'32 bytes',val:trunc(PREV_HASH,40),
     desc:'Double SHA256 dari header block sebelumnya. Inilah yang membentuk chain di blockchain — setiap block secara eksplisit mereferensikan block sebelumnya. Mengubah satu block lama akan mengubah hash-nya dan membatalkan semua block berikutnya.'},
    {id:'fm',cls:'f-merkle',  name:'Merkle Root', bytes:'32 bytes',val:trunc(MERKLE_ROOT,40),
     desc:'Double SHA256 dari root Merkle tree yang dibentuk dari semua txid di block ini. Kalau satu transaksi diubah, Merkle root akan berbeda dan block hash berubah — proof of work batal. Ini yang menghubungkan header 80 bytes ke ribuan transaksi di dalam block.'},
    {id:'ft',cls:'f-time',    name:'Timestamp',   bytes:'4 bytes', val:'1713484167 (Unix) = 19 Apr 2024 00:09:27 UTC',
     desc:'Unix timestamp saat block di-mine. Tidak harus akurat sempurna — boleh sampai 2 jam ke depan dari median waktu 11 block terakhir. Dipakai oleh nLocktime dan CLTV untuk verifikasi timelock berbasis waktu.'},
    {id:'fb',cls:'f-bits',    name:'Bits (Target)',bytes:'4 bytes', val:'0x17034219 — target: 000000000000000000034219...',
     desc:'Representasi kompak dari target difficulty. Block hash harus lebih kecil atau sama dengan nilai ini. Semakin banyak leading zeros yang diperlukan, semakin sulit mining-nya. Disesuaikan setiap 2.016 block berdasarkan waktu aktual vs target 20.160 menit.'},
    {id:'fn',cls:'f-nonce',   name:'Nonce',        bytes:'4 bytes', val:'0x6F0C4B2A (1.863.075.626)',
     desc:'Angka yang diubah-ubah oleh miner untuk mencari block hash yang memenuhi target. 4 bytes = maksimal sekitar 4 miliar kemungkinan. Kalau tidak cukup, miner mengubah timestamp atau coinbase transaction (extra nonce) untuk mendapat lebih banyak ruang pencarian.'},
  ];

  var TXIDS=[
    {id:rH(64),label:'Coinbase TX',type:'coinbase',btc:'40.751 BTC',fee:'0 (coinbase)',size:'285 vByte',inputs:'1 (coinbase input)',outputs:'2',
     desc:'Transaksi pertama di setiap block. Tidak punya input dari UTXO — Bitcoin-nya diciptakan dari nol oleh protokol. Outputnya adalah block reward (3.125 BTC) plus semua fee dari transaksi di block ini (37.626 BTC). Hanya bisa dibelanjakan setelah 100 block (coinbase maturity).'},
    {id:rH(64),label:'TX #1',type:'normal',btc:'0.5421 BTC',fee:'1.240 sat',size:'141 vByte',inputs:'1 P2WPKH',outputs:'2 P2WPKH',
     desc:'Transaksi P2WPKH standar dengan 1 input dan 2 output (penerima dan kembalian). SegWit native — witness data dihitung 1/4 weight. Fee rate sekitar 8.8 sat/vByte.'},
    {id:rH(64),label:'TX #2',type:'normal',btc:'1.2300 BTC',fee:'3.450 sat',size:'208 vByte',inputs:'2 P2WPKH',outputs:'2 P2WPKH',
     desc:'Transaksi dengan 2 input — menggabungkan dua UTXO kecil menjadi satu. Ukuran lebih besar karena dua witness field. Fee rate sekitar 16.6 sat/vByte.'},
    {id:rH(64),label:'TX #3',type:'normal',btc:'0.0341 BTC',fee:'5.600 sat',size:'68 vByte',inputs:'1 P2TR',outputs:'1 P2TR',
     desc:'Transaksi P2TR key path — paling efisien. Hanya 68 vByte karena Schnorr signature (64 bytes) dan output P2TR yang minimalis. Fee rate sekitar 82 sat/vByte.'},
    {id:rH(64),label:'TX #4',type:'normal',btc:'5.0000 BTC',fee:'892 sat',size:'371 vByte',inputs:'3 P2PKH',outputs:'2 P2PKH',
     desc:'Transaksi legacy P2PKH dengan 3 input. Paling boros space — setiap input P2PKH sekitar 148 vByte. Fee rate hanya 2.4 sat/vByte tapi jumlah totalnya kecil karena ukurannya besar.'},
    {id:rH(64),label:'TX #5',type:'normal',btc:'0.0010 BTC',fee:'10.500 sat',size:'189 vByte',inputs:'1 P2SH multisig',outputs:'1 P2WPKH',
     desc:'Transaksi yang menguras P2SH 2-of-3 multisig ke P2WPKH. Redeem script diungkap di scriptSig — ini yang membuat P2SH lebih besar dari P2WSH untuk multisig.'},
  ];

  var MERKLE=[
    {id:'root',cls:'mn-root',  label:'Merkle Root',     hash:MERKLE_ROOT,
     desc:'Double SHA256 dari seluruh Merkle tree. Tersimpan di block header — menghubungkan 80 bytes header dengan ribuan transaksi. Mengubah satu transaksi apapun akan mengubah nilai ini dan membatalkan proof of work.'},
    {id:'b01', cls:'mn-branch',label:'Hash(L+R)',        hash:rH(64),
     desc:'Double SHA256 dari gabungan dua child node di bawahnya: SHA256(SHA256(leftChild + rightChild)). Setiap perubahan di salah satu leaf di bawahnya akan mengubah branch node ini dan akhirnya mengubah root.'},
    {id:'b02', cls:'mn-branch',label:'Hash(L+R)',        hash:rH(64),
     desc:'Branch node kanan. Sama seperti kiri: double SHA256 dari dua child node. Kalau jumlah transaksi ganjil, leaf terakhir di-duplicate untuk membentuk pasangan yang diperlukan tree.'},
    {id:'l01', cls:'mn-coin',  label:'Coinbase txid',   hash:TXIDS[0].id,
     desc:'txid dari coinbase transaction — selalu yang pertama di setiap block. Leaf pertama Merkle tree. Coinbase txid bisa dimanipulasi miner dengan extra nonce di dalam coinbase input untuk memperluas ruang pencarian nonce.'},
    {id:'l02', cls:'mn-leaf',  label:'txid #1',         hash:TXIDS[1].id,
     desc:'txid dari transaksi kedua di block. txid adalah double SHA256 dari raw transaction. Urutan transaksi di block menentukan struktur Merkle tree.'},
    {id:'l03', cls:'mn-leaf',  label:'txid #2',         hash:TXIDS[2].id,
     desc:'txid dari transaksi ketiga. Setiap perubahan di transaksi ini — bahkan satu bit — akan menghasilkan txid yang sama sekali berbeda dan mengubah seluruh jalur ke root.'},
    {id:'l04', cls:'mn-leaf',  label:'txid #3..N',      hash:rH(64),
     desc:'Representasi dari txid #3 sampai #3.049 (block ini punya 3.050 transaksi total). Di Merkle tree nyata ada ribuan leaf. Di sini disederhanakan untuk visualisasi.'},
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
        var hint=document.createElement('div');hint.className='b21-s214-field-hint';hint.textContent='klik untuk penjelasan';div.appendChild(hint);
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
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Nilai</div><div class="b21-s214-tx-detail-val">'+tx.btc+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Fee</div><div class="b21-s214-tx-detail-val">'+tx.fee+'</div></div>'+
      '<div class="b21-s214-tx-detail-row"><div class="b21-s214-tx-detail-lbl">Ukuran</div><div class="b21-s214-tx-detail-val">'+tx.size+'</div></div>'+
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
          res.textContent='Block ditemukan! Nonce: '+nonce.toLocaleString()+' (0x'+toHex8(nonce)+'). Hash valid dengan '+zeros+' leading zeros setelah '+hashCount.toLocaleString()+' percobaan dalam '+elapsed.toFixed(2)+'s. Miner mendapat block reward!';
        }
        var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=false;mb.textContent='\u26CF Mine lagi';}
        return;
      }
      nonce++;
      if(nonce>4294967295){
        nonce=0;SEED=(SEED*1664525+1013904223)>>>0;
        var res=g('b21-s215-result');if(res){
          res.className='b21-s215-result s215-mining';
          res.textContent='Nonce habis (4 miliar dicoba)! Miner memperbarui timestamp atau extra nonce dan mulai lagi dari 0...';
        }
      }
    }
    var hash=calcHash(nonce,SEED);
    renderHash(hash);updateNonce();
    var res=g('b21-s215-result');if(res){
      res.className='b21-s215-result s215-mining';
      res.textContent='Mining... mencoba nonce '+nonce.toLocaleString()+'. Hash belum memenuhi target (butuh '+zeros+' leading zeros).';
    }
  }

  function startMining(){
    if(mining) return;
    mining=true;startTime=Date.now();hashCount=0;
    var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=true;mb.textContent='Mining...';}
    timerInterval=setInterval(updateTimer,100);
    miningInterval=setInterval(doMiningBatch,16);
    var res=g('b21-s215-result');if(res){res.className='b21-s215-result s215-mining';res.textContent='Mining dimulai...';}
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
    var res=g('b21-s215-result');if(res){res.className='b21-s215-result s215-idle';res.textContent='Tekan Mine untuk mulai mencari nonce yang valid.';}
    var mb=g('b21-s215-mine-btn');if(mb){mb.disabled=false;mb.textContent='\u26CF Mine';}
  }

  function setDifficulty(z){
    zeros=z;resetAll();
    var td=g('b21-s215-target-display');if(td) td.textContent=getTarget(z);
    var tn=g('b21-s215-target-note');if(tn) tn.textContent='Hash harus dimulai dengan minimal '+z+' karakter "0"';
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
      empty.textContent='Mempool kosong \u2014 tambah transaksi untuk mulai';
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
    var priority=tx.feeRate>=50?'Tinggi \u2014 kemungkinan masuk block berikutnya':
      tx.feeRate>=10?'Sedang \u2014 beberapa block ke depan':
      tx.feeRate>=3?'Rendah \u2014 bisa menunggu lama':
      'Sangat rendah \u2014 mungkin di-drop kalau mempool penuh';
    det.innerHTML='<div class="b21-s216-detail-title">Detail Transaksi</div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">txid</div><div class="b21-s216-detail-val">'+tx.fullId+'</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Fee rate</div><div class="b21-s216-detail-val">'+tx.feeRate+' sat/vByte</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Total fee</div><div class="b21-s216-detail-val">'+tx.fee+' satoshi (nilai: '+tx.btc+' BTC)</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Ukuran</div><div class="b21-s216-detail-val">'+tx.size+' vByte (format: '+tx.type+')</div></div>'+
      '<div class="b21-s216-detail-row"><div class="b21-s216-detail-lbl">Prioritas</div><div class="b21-s216-detail-val">'+priority+'</div></div>'+
      '<div class="b21-s216-detail-note">Fee rate = total fee / ukuran dalam vByte. Miner memilih transaksi dengan fee rate tertinggi untuk memaksimalkan revenue per block.</div>';
  }

  function mineBlock(){
    if(txPool.length===0){addLog('Mempool kosong, tidak ada yang di-mine','log-drop');return;}
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
        (selected.length>5?'<div class="b21-s216-block-tx">... dan '+(selected.length-5)+' tx lainnya</div>':'');
    }
    addLog('Block #'+blockNum+': '+selected.length+' tx, fee min '+minRate+' sat/vB','log-block');
    blockNum++;selTxId=null;
    updateStats();renderPool();renderChart();renderDetail();
  }

  function addTx(feeRate){
    var rate=feeRate||Math.round(1+Math.random()*150);
    if(rate<RELAY_MIN){
      addLog('TX ditolak: '+rate+' sat/vB < min relay '+RELAY_MIN+' sat/vB','log-drop');return;
    }
    var tx=makeTx(rate);txPool.push(tx);
    addLog('TX masuk: '+tx.id+' | '+tx.feeRate+' sat/vB | '+tx.size+' vB | '+tx.type,'log-in');
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
    if(box) box.innerHTML='<div class="b21-s216-block-empty">Belum ada block di-mine</div>';
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
    {cls:'ps-m',   name:'Master key (m)',desc:'Root dari seluruh pohon key. HMAC-SHA512(seed) menghasilkan 512 bit: 256 bit kiri = master private key, 256 bit kanan = master chain code. Seluruh pohon diturunkan deterministik dari sini.',hint:'Ubah seed = seluruh pohon berubah'},
    {cls:'ps-purp',name:"Purpose (purpose')",desc:"Standar BIP: 44'=P2PKH, 49'=P2SH-P2WPKH, 84'=P2WPKH, 86'=P2TR. Hardened (apostrophe): private key diperlukan — xpub tidak bisa derive child privkey.",hint:'Apostrophe = hardened derivation'},
    {cls:'ps-coin',name:"Coin type (coin')",desc:"0'=Bitcoin mainnet, 1'=testnet, 60'=Ethereum (SLIP-0044). Hardened: key antar coin terisolasi kriptografis — compromise satu tidak pengaruhi yang lain.",hint:"0' = Bitcoin mainnet"},
    {cls:'ps-acc', name:"Account (account')",desc:"Memisahkan penggunaan: 0'=utama, 1'=tabungan, dst. Di level ini xpub bisa diekspor untuk watch-only wallet — generate address tanpa private key.",hint:"xpub di sini = watch-only wallet"},
    {cls:'ps-chain',name:'Change (external/internal)',desc:'0=external: address untuk menerima. 1=internal: address kembalian, dibuat otomatis wallet saat spending. User biasanya tidak melihat ini langsung.',hint:'0=receive, 1=change (otomatis)'},
    {cls:'ps-idx', name:'Address index',desc:'Nomor urut address: 0=pertama, 1=kedua, dst. Setiap transaksi sebaiknya pakai address baru untuk privasi. BIP44: scan sampai gap limit 20 address kosong.',hint:'Infinite address dari satu seed'},
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
    if(ph) ph.textContent='SIMULASI: '+FAKE_SETS[wordSetIdx].join(' ');
    var sh=g('b21-s217-seed-hex');
    if(sh) sh.textContent='seed (512-bit, PBKDF2-HMAC-SHA512): [SIMULASI] '+rH(32)+'...'+rH(16);
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
       note:'Sumber entropi tunggal untuk seluruh wallet. 512 bit dibagi: kiri = master private key, kanan = chain code. Siapapun yang tahu seed ini memiliki seluruh wallet.'},
      {indent:1,cls:'n-master',path:'m',label:'Master Extended Key',
       process:'HMAC-SHA512(key="Bitcoin seed", data=seed) \u2192 512 bit',
       val:fakeKey('xprv9s21Zr'),
       note:'Kiri 256 bit = master private key. Kanan 256 bit = master chain code. Extended key = key + chain code — dipakai untuk derive seluruh pohon.'},
      {indent:2,cls:'n-purp',path:'m/'+p[1],label:'Purpose ('+p[1]+')',
       process:'Hardened child: HMAC-SHA512(chain_code, 0x00 + privKey + index)',
       val:fakeKey('xprv9uQd'),
       note:'Hardened derivation: membutuhkan private key. Memisahkan standar BIP secara kriptografis. Compromise satu standar tidak pengaruhi standar lain dari seed yang sama.'},
      {indent:3,cls:'n-coin',path:'m/'+p[1]+'/'+p[2],label:'Coin Type ('+p[2]+')',
       process:'Hardened child dari purpose key',
       val:fakeKey('xprv9vT3'),
       note:"0' = Bitcoin mainnet (SLIP-0044). Key BTC terisolasi dari ETH, SOL, dll meski dari seed yang sama."},
      {indent:4,cls:'n-acc',path:'m/'+p[1]+'/'+p[2]+'/'+p[3],label:'Account ('+p[3]+')',
       process:'Hardened child terakhir dalam path ini',
       val:fakeKey('xprv9xBc')+' | '+fakeKey('xpub6D'),
       note:'Di sini xpub bisa diekspor untuk watch-only wallet: generate semua address tanpa private key. Aman untuk server atau hot wallet.'},
      {indent:5,cls:'n-chain',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0',label:'External Chain — receive',
       process:'Non-hardened: HMAC-SHA512(chain_code, pubKey + index)',
       val:fakeKey('xpub6Eq'),
       note:'Non-hardened: bisa derive dari xpub saja. Chain ini menghasilkan address yang dibagikan ke pengirim. Setiap request baru dapat address baru.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0/0',label:'Address #0 [SIM]',
       process:'Non-hardened \u2192 pubKey \u2192 hash \u2192 encode \u2192 address',
       val:fakeAddr(std,0),
       note:'Address pertama untuk menerima. Dibagikan ke pengirim. Sebaiknya pakai address baru setiap transaksi untuk privasi.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/0/1',label:'Address #1 [SIM]',
       process:'Index +1, proses sama',
       val:fakeAddr(std,1),
       note:'Pakai address baru setiap transaksi. Reuse address memudahkan orang melacak riwayat transaksi di blockchain publik.'},
      {indent:5,cls:'n-chain',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/1',label:'Internal Chain — change',
       process:'Non-hardened, index=1',
       val:fakeKey('xpub6Fr'),
       note:'Chain untuk address kembalian. Dibuat dan dikelola otomatis oleh wallet. User biasanya tidak melihat address ini langsung.'},
      {indent:6,cls:'n-addr',path:'m/'+p[1]+'/'+p[2]+'/'+p[3]+'/1/0',label:'Change Address #0 [SIM]',
       process:'Non-hardened dari internal chain',
       val:fakeAddr(std,10),
       note:'Kalau Alice kirim 0.05 BTC tapi hanya perlu 0.04, sisa 0.009 BTC (dikurangi fee) otomatis kembali ke address ini oleh wallet.'},
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
      hint:'Proses signing ECDSA dan Schnorr berjalan bersamaan. Badge merah = kelemahan ECDSA, badge hijau = keunggulan Schnorr.',
      ec:[
        {title:'Input: Private Key',formula:'privKey = random 256-bit',badge:null,
         io:[{l:'privKey',v:function(){return rH(64);},c:''}],
         desc:'Private key: angka acak 256-bit yang harus dijaga rahasia.'},
        {title:'Generate Nonce k',formula:'k = random() — HARUS unik tiap signing',badge:{t:'Risiko: reuse k = privKey bocor',c:'extra'},
         io:[{l:'k',v:function(){return rH(64);},c:''},{l:'!',v:function(){return 'reuse k → privKey bocor (PS3 2010)';},c:'out-ec'}],
         desc:'ECDSA: k harus benar-benar acak. Reuse k yang sama untuk dua pesan berbeda langsung mengungkapkan private key.'},
        {title:'Hitung R = k × G, ambil r = R.x',formula:'R = k × G\nr = R.x mod n',badge:null,
         io:[{l:'r',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Scalar multiplication generator point G dengan nonce k. Ambil koordinat x sebagai r.'},
        {title:'Hitung s (butuh modular inverse)',formula:'s = k⁻¹ × (H(msg) + r × privKey) mod n',badge:{t:'Mahal: modular inverse k⁻¹',c:'extra'},
         io:[{l:'H(msg)',v:function(){return rH(64);},c:''},{l:'s',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Modular inverse dari k adalah operasi mahal. s menggabungkan message hash dan private key.'},
        {title:'DER Encode + sighash flag',formula:'0x30 [len] 0x02 [r-len] [r] 0x02 [s-len] [s] 0x01',badge:{t:'Overhead: +7 bytes DER header',c:'extra'},
         io:[{l:'DER sig',v:function(){return '3045022100'+rH(62)+'0220'+rH(62)+'01';},c:'out-ec'}],
         desc:'DER encoding menambah header bertingkat. Menghasilkan 71-72 bytes total.'},
      ],
      sc:[
        {title:'Input: Private Key',formula:'privKey = random 256-bit',badge:null,
         io:[{l:'privKey',v:function(){return rH(64);},c:''}],
         desc:'Private key yang sama. Input identik dengan ECDSA.'},
        {title:'Generate Nonce k (deterministik)',formula:'k = H(privKey || msg || rand)\n[deterministik + random salt]',badge:{t:'Lebih aman: deterministik dari privKey',c:'advantage'},
         io:[{l:'k',v:function(){return rH(64);},c:''},{l:'aman',v:function(){return 'bahkan RNG buruk tidak bisa expose privKey';},c:'out-sc'}],
         desc:'Schnorr: k dihitung deterministik dari private key + message + random salt. Bahkan kalau RNG buruk, determinisme dari privKey melindungi.'},
        {title:'Hitung R = k × G, pakai x-only',formula:'R = k × G\npakai R.x (32 bytes)',badge:null,
         io:[{l:'R.x',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Sama seperti ECDSA tapi Schnorr hanya butuh koordinat x (32 bytes). y bisa direcovery dari x.'},
        {title:'Hitung challenge e (hash gabungan)',formula:'e = H(R.x || P || H(msg))',badge:{t:'Lebih aman: hash pubKey + R + msg',c:'advantage'},
         io:[{l:'P',v:function(){return '02'+rH(62);},c:''},{l:'e',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Challenge e meng-hash R, pubKey, dan message sekaligus. Struktur lebih ketat — terbukti aman secara formal.'},
        {title:'Hitung s (penjumlahan biasa) → output',formula:'s = k + e × privKey mod n\nsig = R.x || s (64 bytes flat)',badge:{t:'Linear: bisa diagregasi (MuSig)',c:'advantage'},
         io:[{l:'s',v:function(){return rH(64);},c:'out-sc'},{l:'sig',v:function(){return rH(128);},c:'out-sc'}],
         desc:'s dihitung dengan penjumlahan sederhana — linearitas inilah yang memungkinkan agregasi signature.'},
      ],
      ecOut:{lbl:'ECDSA Signature',v:function(){return '3045022100'+rH(62)+'0220'+rH(62)+'01';},sz:'71-72 bytes (DER encoded)',note:'Format DER bertingkat. Overhead ~7 bytes dari nilai r dan s sesungguhnya.'},
      scOut:{lbl:'Schnorr Signature',v:function(){return rH(128);},sz:'64 bytes (flat r || s)',note:'R.x (32 bytes) langsung diikuti s (32 bytes). Tidak ada DER, tidak ada header.'},
      results:[
        {lbl:'ECDSA',val:'71-72 bytes',sub:'DER encoded + sighash flag',c:'ec-res'},
        {lbl:'Schnorr',val:'64 bytes',sub:'Flat — 10% lebih kecil, bisa agregasi',c:'sc-res'},
      ],
    },
    verify:{
      hint:'Proses verifikasi ECDSA butuh DER parsing + dua modular inverse. Schnorr lebih sedikit langkah dan bisa di-batch.',
      ec:[
        {title:'Input: pubKey + DER_sig + msg',formula:'input: pubKey, DER_sig, msg',badge:null,
         io:[{l:'pubKey',v:function(){return '02'+rH(62);},c:''},{l:'sig',v:function(){return '3045022100'+rH(32)+'...';},c:''},{l:'msg',v:function(){return rH(64);},c:''}],
         desc:'Node menerima: public key, DER-encoded signature, dan hash message.'},
        {title:'Parse DER signature',formula:'decode 0x30 → ekstrak r, s',badge:{t:'Extra step: DER parsing',c:'extra'},
         io:[{l:'r',v:function(){return rH(64);},c:'out-ec'},{l:'s',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Parse format DER bertingkat untuk ekstrak r dan s. Step ini tidak ada di Schnorr.'},
        {title:'Hitung u1 dan u2',formula:'u1 = H(msg) × s⁻¹ mod n\nu2 = r × s⁻¹ mod n',badge:{t:'Dua modular inverse: lebih lambat',c:'extra'},
         io:[{l:'u1',v:function(){return rH(64);},c:'out-ec'},{l:'u2',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Dua operasi modular inverse terpisah — operasi paling mahal dalam verifikasi ECDSA.'},
        {title:'Hitung X = u1×G + u2×pubKey',formula:'X = u1 × G + u2 × pubKey',badge:{t:'Dua scalar mul: tidak bisa di-batch',c:'extra'},
         io:[{l:'X.x',v:function(){return rH(64);},c:'out-ec'}],
         desc:'Dua scalar multiplication. Tidak bisa di-batch dengan verifikasi lain.'},
        {title:'Verifikasi: X.x == r?',formula:'valid = (X.x mod n == r)',badge:null,
         io:[{l:'hasil',v:function(){return 'X.x == r → VALID ✓';},c:'out-sc'}],
         desc:'Bandingkan koordinat x. Tidak bisa di-batch — setiap signature diverifikasi terpisah.'},
      ],
      sc:[
        {title:'Input: pubKey + sig_64 + msg',formula:'input: pubKey, sig[64], msg',badge:null,
         io:[{l:'pubKey',v:function(){return '02'+rH(62);},c:''},{l:'sig',v:function(){return rH(64)+'...';},c:''},{l:'msg',v:function(){return rH(64);},c:''}],
         desc:'Node menerima: public key, flat 64-byte signature, dan hash message.'},
        {title:'Parse signature (trivial)',formula:'R.x = sig[0:32]\ns   = sig[32:64]',badge:{t:'Tidak perlu DER parsing',c:'advantage'},
         io:[{l:'R.x',v:function(){return rH(64);},c:'out-sc'},{l:'s',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Parsing trivial: slice bytes saja. Tidak ada format bertingkat.'},
        {title:'Hitung challenge e',formula:'e = H(R.x || P || H(msg))',badge:{t:'Single hash — lebih cepat',c:'advantage'},
         io:[{l:'e',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Satu hash operasi. Jauh lebih cepat dari dua modular inverse ECDSA.'},
        {title:'Verifikasi persamaan',formula:'s × G == R + e × pubKey\n[linear → bisa di-batch!]',badge:{t:'Bisa batch verify N signature sekaligus',c:'advantage'},
         io:[{l:'s×G',v:function(){return rH(64);},c:'out-sc'},{l:'R+eP',v:function(){return rH(64);},c:'out-sc'}],
         desc:'Persamaan ini bisa dikumpulkan dengan N persamaan lain dan diverifikasi sekaligus — batch verification.'},
        {title:'Verifikasi: hasil.x == R.x?',formula:'valid = (hasil.x == R.x)',badge:{t:'Batch 1000 tx → 2-4× lebih cepat',c:'advantage'},
         io:[{l:'hasil',v:function(){return 'hasil.x == R.x → VALID ✓ (batchable)';},c:'out-sc'}],
         desc:'Valid. Dan bisa di-batch: 3000 Schnorr signature dalam satu block diverifikasi jauh lebih cepat dari 3000 ECDSA terpisah.'},
      ],
      ecOut:{lbl:'Verifikasi ECDSA selesai',v:function(){return 'VALID — X.x ('+rH(16)+'...) == r ('+rH(16)+'...)';},sz:'5 langkah, 2 modular inverse, tidak bisa batch',note:'3000 tx dalam block = 3000 operasi ECDSA verify terpisah.'},
      scOut:{lbl:'Verifikasi Schnorr selesai',v:function(){return 'VALID — hasil.x ('+rH(16)+'...) == R.x ('+rH(16)+'...)';},sz:'4 langkah, 1 hash, bisa batch verify',note:'3000 tx Schnorr bisa diverifikasi 2-4× lebih cepat dengan batch.'},
      results:[
        {lbl:'Verifikasi ECDSA',val:'5 langkah terpisah',sub:'Tidak bisa di-batch',c:'ec-res'},
        {lbl:'Verifikasi Schnorr',val:'4 langkah, batchable',sub:'2-4× lebih cepat saat batch',c:'sc-res'},
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
    if(info) info.textContent=flowStep===0?'Tekan Step atau Auto untuk mulai':'Langkah '+flowStep+' dari '+maxS;
    var outWrap=g('b21-s218-outputs');
    if(flowStep>maxS){
      if(outWrap) outWrap.style.display='block';
      renderFlowOutput();
      if(info) info.textContent='Selesai';
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
    var labels=['Tekan Step atau Auto untuk mulai','TX 1: Alice menandatangani','TX 2: Carol menandatangani','TX 3: Eve menandatangani','Schnorr: agregasi 3 partial sig menjadi 1','Perbandingan total ukuran','Apa yang terlihat di blockchain','Selesai'];
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
        if(ecVal){ecVal.textContent='menunggu...';ecVal.className='b21-s218-ag-box-val';}
        if(scVal){scVal.textContent='menunggu...';scVal.className='b21-s218-ag-box-val';}
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
      if(obsEc) obsEc.textContent='ECDSA TX1: witness=['+trunc(ecSigs[0],18)+'...] pubKey=['+rH(16)+'...]\nECDSA TX2: witness=['+trunc(ecSigs[1],18)+'...] pubKey=['+rH(16)+'...]\nECDSA TX3: witness=['+trunc(ecSigs[2],18)+'...] pubKey=['+rH(16)+'...]\n→ 3 pengirim, 3 DER signature, 3 verifikasi terpisah';
      if(obsSc) obsSc.textContent='Schnorr: witness=['+trunc(aggSig,36)+'...] pubKey=[02'+rH(16)+'...]\n→ 1 signature 64 bytes, 1 pubKey — identik dengan single-sig\n→ observer tidak bisa tahu berapa pihak terlibat';
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
      label:'Pembayaran Berhasil',
      nodes:[
        {id:'alice',label:'Alice',x:60, y:90, color:'#534AB7',sub:'pengirim'},
        {id:'bob',  label:'Bob',  x:210,y:45, color:'#185FA5',sub:'routing node'},
        {id:'carol',label:'Carol',x:380,y:130,color:'#185FA5',sub:'routing node'},
        {id:'frank',label:'Frank',x:530,y:60, color:'#0F6E56',sub:'penerima'},
        {id:'eve',  label:'Eve',  x:420,y:30, color:'#52524C',sub:'node lain'},
      ],
      edges:[
        {a:'alice',b:'bob',  active:true, label:'0.6 BTC'},
        {a:'bob',  b:'carol',active:true, label:'0.4 BTC'},
        {a:'carol',b:'frank',active:true, label:'0.5 BTC'},
        {a:'bob',  b:'eve',  active:false,label:'0.2 BTC'},
        {a:'eve',  b:'frank',active:false,label:'0.1 BTC'},
      ],
      channels:[
        {label:'Alice ke Bob',   local:60,remote:40,failLabel:''},
        {label:'Bob ke Carol',   local:40,remote:60,failLabel:''},
        {label:'Carol ke Frank', local:50,remote:50,failLabel:''},
      ],
      payHash:rH(32),
      steps:[
        {title:'Frank buat invoice, kirim ke Alice',      dir:'Frank → Alice (off-chain)',type:'',
         desc:'Frank generate payment hash H = SHA256(preimage r). Invoice dikirim ke Alice berisi H dan jumlah yang diminta.',
         code:'invoice: lnbc2m1...xyz\npayment_hash: H = SHA256(r)\namount: 200,000 sat'},
        {title:'Alice cari jalur ke Frank',               dir:'Alice query gossip protocol',type:'',
         desc:'Alice query gossip protocol Lightning untuk cari jalur dengan likuiditas cukup dan fee terendah.',
         code:'path: Alice → Bob → Carol → Frank\nfee total: 10 sat\ntimelocks: 3 x 144 blok'},
        {title:'Alice lock HTLC ke Bob',                  dir:'Alice → Bob',type:'s219-lock',
         desc:'Alice kunci 200.010 sat ke Bob: Bob bisa klaim jika tunjukkan preimage r sebelum timelock habis.',
         code:'HTLC lock: 200.010 sat\ncondition: SHA256(r) = H\ntimelock: CLTV +144 blok'},
        {title:'Bob forward HTLC ke Carol',               dir:'Bob → Carol',type:'s219-lock',
         desc:'Bob kunci 200.005 sat ke Carol dengan kondisi sama. Bob tahan 5 sat sebagai fee.',
         code:'HTLC lock: 200.005 sat\ncondition: same H\ntimelock: CLTV +144 blok'},
        {title:'Carol forward HTLC ke Frank',             dir:'Carol → Frank',type:'s219-lock',
         desc:'Carol kunci 200.000 sat ke Frank. Frank adalah penerima akhir dan tahu preimage r.',
         code:'HTLC lock: 200.000 sat\ncondition: same H\ntimelock: CLTV +144 blok'},
        {title:'Frank ungkap preimage, klaim payment',    dir:'Frank → Carol',type:'s219-settle',
         desc:'Frank ungkap preimage r ke Carol. Carol verifikasi SHA256(r)==H, lalu bayar Frank 200.000 sat.',
         code:'preimage r revealed\nSHA256(r) == H ✓\nCarol bayar Frank 200.000 sat'},
        {title:'Carol settle HTLC ke Bob',                dir:'Carol → Bob',type:'s219-settle',
         desc:'Carol pakai r yang sama untuk klaim 200.005 sat dari Bob. Selisih 5 sat adalah fee Carol.',
         code:'Carol reveals r → Bob\nBob bayar Carol 200.005 sat\nCarol fee: +5 sat'},
        {title:'Bob settle HTLC ke Alice',                dir:'Bob → Alice',type:'s219-settle',
         desc:'Bob pakai r untuk klaim 200.010 sat dari Alice. Pembayaran selesai, semua channel diperbarui off-chain.',
         code:'Bob reveals r → Alice\nAlice bayar Bob 200.010 sat\nBob fee: +5 sat\nSelesai!'},
      ],
      htlcs:[
        {hop:'Alice→Bob',  amount:'200.010 sat',hash:'',status:'menunggu'},
        {hop:'Bob→Carol',  amount:'200.005 sat',hash:'',status:'menunggu'},
        {hop:'Carol→Frank',amount:'200.000 sat',hash:'',status:'menunggu'},
      ],
      result:{cls:'s219-success',lbl:'Pembayaran berhasil!',
        val:'Alice membayar Frank 200.000 sat dalam detik, tanpa on-chain transaction, fee hanya 10 sat (0,005%). Saldo ketiga channel diperbarui off-chain.',
        note:'Atomic: jika satu hop gagal, semua HTLC batal dan dana Alice kembali utuh.'},
      lockSteps:[2,3,4],settleSteps:[5,6,7],failSteps:[],
    },
    fail:{
      label:'Gagal & Retry',
      nodes:[
        {id:'alice',label:'Alice',x:60, y:90, color:'#534AB7',sub:'pengirim'},
        {id:'bob',  label:'Bob',  x:210,y:45, color:'#185FA5',sub:'routing node'},
        {id:'carol',label:'Carol',x:370,y:130,color:'#A32D2D',sub:'saldo kurang'},
        {id:'frank',label:'Frank',x:530,y:60, color:'#0F6E56',sub:'penerima'},
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
        {label:'Alice ke Bob',   local:60,remote:40,failLabel:''},
        {label:'Bob ke Carol',   local:40,remote:60,failLabel:''},
        {label:'Carol ke Frank', local:5, remote:95,failLabel:'saldo tidak cukup'},
      ],
      payHash:rH(32),
      steps:[
        {title:'Alice coba jalur pertama via Carol',      dir:'Alice → Bob → Carol → Frank',type:'',
         desc:'Alice pilih jalur via Carol. Saldo Carol→Frank tidak terlihat publik sehingga Alice tidak tahu saldo aktualnya hanya 50.000 sat.',
         code:'jalur: Alice → Bob → Carol → Frank\nlikuiditas Carol→Frank (aktual): 50.000 sat\nbutuh: 300.000 sat'},
        {title:'HTLC terkunci: Alice ke Bob',             dir:'Alice → Bob',type:'s219-lock',
         desc:'Alice kunci HTLC ke Bob. Dana terkunci sementara tapi belum berpindah permanen.',
         code:'HTLC lock: 300.010 sat\ncondition: SHA256(r) = H\ntimelock aktif'},
        {title:'HTLC terkunci: Bob ke Carol',             dir:'Bob → Carol',type:'s219-lock',
         desc:'Bob forward HTLC ke Carol. Dua hop kini terkunci.',
         code:'HTLC lock: 300.005 sat\ncondition: same H'},
        {title:'Carol gagal forward ke Frank',            dir:'Carol × Frank',type:'s219-fail',
         desc:'Carol hanya punya 50.000 sat ke Frank, butuh 300.000. Carol kirim error insufficient_balance kembali ke Bob.',
         code:'saldo Carol→Frank: 50.000 sat\ndibutuhkan: 300.000 sat\nerror: insufficient_balance'},
        {title:'Semua HTLC dibatalkan atomik',            dir:'Bob → Alice (cancel)',type:'s219-fail',
         desc:'Bob teruskan pesan gagal ke Alice. HTLC Alice→Bob dibatalkan. Dana Alice kembali utuh.',
         code:'HTLC cancelled: Alice→Bob\nAlice saldo pulih +300.010 sat\ntidak ada dana yang hilang'},
        {title:'Alice retry via Dave',                    dir:'Alice → Bob → Dave → Frank',type:'s219-settle',
         desc:'Alice coba jalur alternatif via Dave yang punya likuiditas cukup. Kali ini berhasil.',
         code:'jalur baru: Alice → Bob → Dave → Frank\nlikuiditas Dave→Frank: 400.000 sat ✓\nretry berhasil'},
      ],
      htlcs:[
        {hop:'Alice→Bob',  amount:'300.010 sat',hash:'',status:'menunggu'},
        {hop:'Bob→Carol',  amount:'300.005 sat',hash:'',status:'menunggu'},
        {hop:'Carol→Frank',amount:'300.000 sat',hash:'',status:'menunggu',fail:true},
      ],
      result:{cls:'s219-retry',lbl:'Retry berhasil via jalur alternatif',
        val:'Jalur pertama gagal karena likuiditas Carol→Frank tidak cukup. Tidak ada dana yang hilang. Alice otomatis retry via Dave dan berhasil.',
        note:'HTLC bersifat atomic: tidak ada dana yang bisa diklaim tanpa preimage. Kegagalan selalu aman.'},
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
      h.status='menunggu';
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
        '<div class="b21-s219-htlc-cell" id="b21-s219-hs-'+i+'">menunggu</div>';
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
        if(statEl) statEl.textContent='locked terkunci';
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
    if(info) info.textContent=step===0?'Tekan Step atau Auto untuk mulai':
      step<=maxS?'Langkah '+step+' dari '+maxS:'Selesai';
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
      op:'os.urandom(32) atau /dev/urandom',
      hex:trunc(chunk(privKey.slice(0,32),8),60)+'...',
      desc:'Sistem operasi menghasilkan 256 bit angka acak yang secara kriptografis aman. Ini adalah sumber entropi yang tidak bisa diprediksi oleh siapapun.'});

    steps.push({num:'02',cls:'s211-priv',label:'Private key (256-bit)',
      op:'format: hex string 64 karakter = 32 bytes',
      hex:trunc(chunk(privKey,16),80),
      desc:'Angka acak yang disimpan sebagai private key. Siapapun yang memiliki angka ini memiliki Bitcoin di address yang dihasilkannya. Harus dijaga sangat rahasia.'});

    steps.push({num:'03',cls:'s211-pub',label:'Public key uncompressed',
      op:'privKey × G (generator point secp256k1) → titik (x, y)',
      hex:'04 '+trunc(rH(32)+' '+rH(32),72),
      desc:'Perkalian private key dengan titik generator G di kurva secp256k1. Hasilnya titik (x, y). Prefix 04 menandai public key uncompressed (65 bytes: 1+32+32).'});

    steps.push({num:'04',cls:'s211-comp',label:'Public key compressed (33 bytes)',
      op:`ambil koordinat x + prefix ${prefix} (y ${prefix==='02'?'genap':'ganjil'})`,
      hex:prefix+' '+trunc(chunk(rH(62),16),72),
      desc:`Cukup simpan koordinat x dan tanda y (genap=02, ganjil=03). Hasilnya 33 bytes vs 65 bytes uncompressed — lebih efisien di blockchain.`});

    steps.push({num:'05',cls:'s211-sha',label:'SHA256 (pubkey compressed)',
      op:'SHA256(pubKeyCompressed) → 32 bytes',
      hex:trunc(chunk(sha256_1,16),80),
      desc:'SHA256 diaplikasikan ke public key compressed. Hasilnya 32 bytes. Ini langkah pertama dari double-hash yang menghasilkan pubKeyHash.'});

    steps.push({num:'06',cls:'s211-ripe',label:'RIPEMD-160 (hasil SHA256)',
      op:'RIPEMD160(SHA256(pubKey)) → 20 bytes = pubKeyHash',
      hex:trunc(chunk(ripe160,8),80),
      desc:'RIPEMD-160 diaplikasikan ke hasil SHA256. Hasilnya 20 bytes (160 bit) — disebut pubKeyHash. Ini adalah inti dari setiap address Bitcoin.'});

    if(addrType==='p2pkh'){
      steps.push({num:'07',cls:'s211-vers',label:'Tambah version byte',
        op:'0x00 (mainnet P2PKH) + pubKeyHash',
        hex:'00 '+trunc(chunk(ripe160,8),60),
        desc:'Prefix 0x00 ditambahkan sebelum pubKeyHash untuk menandai ini adalah P2PKH address di mainnet.'});
      steps.push({num:'08',cls:'s211-check',label:'Checksum (double SHA256, ambil 4 byte pertama)',
        op:'SHA256(SHA256(versionByte+pubKeyHash))[0:4]',
        hex:rH(8)+' (4 bytes checksum)',
        desc:'Double SHA256 diaplikasikan ke payload, lalu 4 byte pertama sebagai checksum. Memungkinkan deteksi kesalahan ketik saat memasukkan address.'});
      steps.push({num:'09',cls:'s211-enc',label:'Base58Check encode',
        op:'Base58Check(version + pubKeyHash + checksum)',
        hex:'alfabet 58 karakter, tanpa 0, O, I, l',
        desc:'Payload di-encode ke Base58Check — alfabet tanpa karakter yang mudah tertukar. Hasilnya selalu dimulai "1" untuk P2PKH mainnet.'});
      steps.push({num:'10',cls:'s211-addr',label:'Address P2PKH — siap digunakan',
        op:'Legacy address, dimulai dengan "1"',
        hex:'1'+rH(4).split('').map(c=>('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')[parseInt(c,16)%34]).join('')+'BTC'+rH(6).toUpperCase(),
        desc:'Address P2PKH siap menerima Bitcoin. Format paling lama, kurang efisien dibanding SegWit karena tidak mendapat diskon weight.'});
    } else if(addrType==='p2wpkh'){
      steps.push({num:'07',cls:'s211-vers',label:'Witness version byte',
        op:'version = 0 (SegWit v0)',
        hex:'witness version: 0x00 | program: '+trunc(ripe160,40),
        desc:'Untuk P2WPKH tidak ada version byte dan checksum terpisah seperti P2PKH. Witness program terdiri dari version (0) dan pubKeyHash (20 bytes).'});
      steps.push({num:'08',cls:'s211-enc',label:'Bech32 encode',
        op:'bech32_encode(hrp="bc", witver=0, witprog=pubKeyHash)',
        hex:'HRP "bc" + separator "1" + data + 6-char checksum',
        desc:'Bech32 dirancang untuk SegWit. Human-readable part "bc" untuk mainnet, separator "1", data ter-encode, lalu 6 karakter checksum. Hanya huruf kecil, tanpa karakter ambigu.'});
      steps.push({num:'09',cls:'s211-addr',label:'Address P2WPKH — siap digunakan',
        op:'Native SegWit address, dimulai dengan "bc1q"',
        hex:'bc1q'+rH(6)+'x'+rH(4)+'p'+rH(5)+'m'+rH(6),
        desc:'Address P2WPKH siap menerima Bitcoin. Input SegWit mendapat diskon ~40% dibanding P2PKH karena witness data dihitung 1/4 weight.'});
    } else {
      const tweaked=rH(64);
      steps.push({num:'07',cls:'s211-vers',label:'Tweaked public key (Taproot)',
        op:'tweakedPubKey = pubKey + hash_taptweak(pubKey) × G',
        hex:trunc(chunk(tweaked,16),80),
        desc:'Public key di-tweak dengan hash dari public key itu sendiri. Hasilnya tweaked public key 32 bytes (hanya koordinat x).'});
      steps.push({num:'08',cls:'s211-enc',label:'Bech32m encode',
        op:'bech32m_encode(hrp="bc", witver=1, witprog=tweakedPubKey)',
        hex:'HRP "bc" + separator "1" + data + 6-char bech32m checksum',
        desc:'Bech32m adalah versi baru dari Bech32 dengan checksum diperbarui untuk panjang witness program yang berbeda. Witness version 1 membedakan P2TR dari P2WPKH.'});
      steps.push({num:'09',cls:'s211-addr',label:'Address P2TR — siap digunakan',
        op:'Taproot address, dimulai dengan "bc1p"',
        hex:'bc1p'+rH(6)+'q'+rH(4)+'r'+rH(5)+'t'+rH(6),
        desc:'Address P2TR paling efisien: input 57,5 vByte untuk key path spending. Juga paling privat: multisig terlihat identik dengan tanda tangan tunggal.'});
    }

    steps.push({num:'DIV',cls:'divider',label:'',op:'',hex:'',desc:''});

    const sigType=addrType==='p2tr'?'Schnorr':'ECDSA';
    steps.push({num:'—',cls:'s211-sign',label:`Sign — ${sigType} signature`,
      op:`${sigType.toLowerCase()}_sign(privKey, message_hash) → signature`,
      hex:`r: ${trunc(rH(64),40)}\ns: ${trunc(rH(64),40)}${addrType==='p2tr'?'\n(Schnorr: r+s, 64 bytes flat)':''}`,
      desc:`${sigType==='Schnorr'?'Schnorr signature hanya 64 bytes: r (32 bytes) dan s (32 bytes) digabung langsung. Lebih kecil dan lebih mudah diverifikasi dari ECDSA.':'ECDSA signature terdiri dari r dan s dalam format DER, total 71-72 bytes. Membuktikan kepemilikan private key tanpa mengungkapkannya.'}`});

    steps.push({num:'✓',cls:'s211-verify',label:'Verify — kepemilikan terbukti',
      op:'verify(pubKey, message_hash, signature) → true',
      hex:'pubKey + signature + msg → valid ✓',
      desc:'Siapapun bisa memverifikasi tanda tangan menggunakan public key tanpa mengetahui private key. Full node memverifikasi ini untuk setiap input di setiap transaksi.'});

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
        lbl.textContent='Kepemilikan & Tanda Tangan:';
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
      {country:'Amerika Serikat',pct:7, color:'#534AB7'},
      {country:'Rusia',          pct:7, color:'#534AB7'},
      {country:'Kazakhstan',     pct:6, color:'#854F0B'},
      {country:'Malaysia',       pct:4, color:'#854F0B'},
      {country:'Lainnya',        pct:11,color:'#52524C'},
    ],
    after:[
      {country:'Amerika Serikat',pct:38,color:'#0F6E56'},
      {country:'Kazakhstan',     pct:14,color:'#534AB7'},
      {country:'Rusia',          pct:11,color:'#534AB7'},
      {country:'Canada',         pct:7, color:'#534AB7'},
      {country:'Jerman',         pct:4, color:'#854F0B'},
      {country:'Lainnya',        pct:26,color:'#52524C'},
    ],
  };
  const GEO_NOTES={
    before:'Sebelum China ban (Mei 2021): China mendominasi ~65% hashrate global, sebagian besar karena hydropower murah di Sichuan dan Yunnan. Konsentrasi tinggi di satu negara ini menjadi perhatian dari perspektif ketahanan jaringan.',
    after:'Sesudah China ban (2021) dan migrasi: hashrate tersebar ke lebih banyak negara. Amerika Serikat menjadi negara dengan hashrate terbesar. Distribusi yang lebih luas meningkatkan ketahanan terhadap regulasi lokal manapun.',
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
    {cls:'s195-d-idle',  label:'Kondisi Awal',
     title:'Semua miner bekerja di block yang sama',
     text:'Jaringan dan miner selfish sama-sama bekerja di atas block #100. Miner selfish punya 35% hashrate, di atas threshold ~33%.',
     analogy:'Seperti lomba lari: semua pelari mulai dari garis yang sama.',
     chains:[
       {name:'Jaringan (honest)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'}]},
       {name:'Miner Selfish',   cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'}]},
     ]},
    {cls:'s195-d-selfish',label:'Langkah 1',
     title:'Miner selfish temukan #101 — tapi disembunyikan',
     text:'Miner selfish menemukan block #101 terlebih dahulu. Alih-alih menyebarkannya, ia menyimpannya dan terus bekerja diam-diam di atas block tersembunyi ini.',
     analogy:'Seperti pelari yang diam-diam berlari di jalur tersembunyi sementara pesaing masih di jalur biasa.',
     chains:[
       {name:'Jaringan (masih di #100)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'}]},
       {name:'Miner Selfish',          cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-selfish',label:'Langkah 2',
     title:'Miner selfish temukan #102 — jaringan belum tahu #101',
     text:'Miner selfish kini punya dua block tersembunyi. Jaringan masih bekerja di #100. Keunggulan dua block adalah kondisi ideal untuk serangan.',
     analogy:'Pelari tersembunyi sudah maju dua tikungan. Pesaing belum tahu.',
     chains:[
       {name:'Jaringan',     cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'},{t:'?',c:'s195-b-network'}]},
       {name:'Miner Selfish',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'},{t:'#102',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-result',label:'Langkah 3',
     title:'Jaringan hampir temukan #101 — miner selfish publikasikan chain-nya',
     text:'Saat jaringan mendekati block #101, miner selfish langsung menyebarkan chain tersembunyinya. Chain selfish lebih panjang — semua node beralih. Pekerjaan jaringan di-orphan.',
     analogy:'Pelari curang muncul di depan garis finish saat pesaing hampir tiba.',
     chains:[
       {name:'Chain jaringan (orphaned!)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-orphan'}]},
       {name:'Chain pemenang (selfish)', cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
    {cls:'s195-d-result',label:'Hasil',
     title:'Miner selfish dapat 2 reward, jaringan kehilangan 1 reward',
     text:'Pekerjaan jaringan di #101 hangus. Miner selfish mendapat reward untuk #101 dan #102 meski hanya punya 35% hashrate — secara proporsional lebih besar dari haknya.',
     analogy:'Pelari curang menang dua hadiah. Pelari jujur tidak mendapat apa-apa meski sudah bekerja keras.',
     chains:[
       {name:'Hasil akhir — chain selfish menang',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
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
    const hrEl=g('b19-s195-honest-rev');if(hrEl) hrEl.textContent=pct+'% dari total';
    const srEl=g('b19-s195-selfish-rev');if(srEl) srEl.textContent='~'+sr+'%';
    const ssEl=g('b19-s195-selfish-sub');
    const verdict=g('b19-s195-verdict');const vlEl=g('b19-s195-verdict-label');const vtEl=g('b19-s195-verdict-text');
    if(sr>pct+0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-danger';
      if(vlEl) vlEl.textContent='Selfish mining MENGUNTUNGKAN di hashrate ini';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue selfish (~${sr}%) lebih tinggi dari honest (${pct}%). Keuntungan ekstra berasal dari pekerjaan miner lain yang di-orphan.`;
      if(ssEl) ssEl.textContent='lebih tinggi dari honest mining';
    } else if(sr>pct-0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-warn';
      if(vlEl) vlEl.textContent='Zona batas — hampir tidak menguntungkan';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue selfish (~${sr}%) hampir sama dengan honest (${pct}%). Risiko dan kompleksitas tidak sebanding.`;
      if(ssEl) ssEl.textContent='hampir sama dengan honest mining';
    } else {
      if(verdict) verdict.className='b19-s195-verdict s195-v-safe';
      if(vlEl) vlEl.textContent='Selfish mining TIDAK menguntungkan di hashrate ini';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue honest (${pct}%) lebih tinggi dari selfish (~${sr}%). Di hashrate rendah, risiko block tersembunyi di-orphan lebih besar.`;
      if(ssEl) ssEl.textContent='lebih rendah dari honest mining';
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
      res.textContent=`Propagasi ${pct}%: threshold selfish mining naik ke ~${threshold}%+ hashrate. Semakin cepat block menyebar, semakin sulit selfish mining menguntungkan. Compact blocks berkontribusi langsung ke sini.`;
    } else if(pct>=40){
      res.className='b19-s195-prop-result s195-pr-mid';
      res.textContent=`Propagasi ${pct}%: threshold selfish mining sekitar ~${threshold}% hashrate. Masih mengkhawatirkan kalau ada pool dengan hashrate besar.`;
    } else {
      res.className='b19-s195-prop-result s195-pr-bad';
      res.textContent=`Propagasi ${pct}% (lambat): threshold selfish mining turun ke ~${threshold}% hashrate. Propagasi yang lambat memberi lebih banyak waktu bagi miner selfish untuk memanfaatkan keunggulan.`;
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
    if(days<1) return (days*24).toFixed(1)+' jam';
    if(days<365) return days.toFixed(1)+' hari';
    const y=days/365;
    return y<1000?y.toFixed(1)+' tahun':'>1000 tahun';
  }
  function fmtBTC(btc){
    if(btc<0.0001) return btc.toExponential(2)+' BTC';
    return btc.toFixed(5)+' BTC';
  }

  function update(){
    const sl=g('b19-s194-hr-sl');if(!sl) return;
    const val=parseInt(sl.value);
    const hashrateTH=val*100;
    const label=hashrateTH>=1000?(hashrateTH/1000).toFixed(1)+' PH/s ('+hashrateTH.toLocaleString('id-ID')+' TH/s)':hashrateTH+' TH/s';
    const vEl=g('b19-s194-hr-val');if(vEl) vEl.textContent=label;

    const soloDays=calcSoloDays(hashrateTH);
    const poolDaily=calcPoolDaily(hashrateTH);
    const poolWeekly=poolDaily*7;

    const st=g('b19-s194-solo-time');if(st) st.textContent='~'+fmtTime(soloDays);
    const pi=g('b19-s194-pool-income');if(pi) pi.textContent='~'+fmtBTC(poolDaily)+'/hari';

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
      row.innerHTML=`<div class="b19-s194-tl-week">Minggu ${w}</div>
        <div class="b19-s194-tl-solo-wrap"><div class="b19-s194-tl-solo-bar" style="width:${soloWidth}%;"></div></div>
        <div class="b19-s194-tl-pool-wrap"><div class="b19-s194-tl-pool-bar" style="width:${poolWidth}%;"></div></div>`;
      el.appendChild(row);
    }

    const note=g('b19-s194-note');
    if(note) note.textContent=`Dengan hashrate ${label}, miner solo rata-rata butuh ${fmtTime(soloDays)} untuk menemukan satu block. Di pool, pendapatan datang konsisten ${fmtBTC(poolDaily)}/hari — total jangka panjang sama, tapi variance jauh lebih rendah.`;
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
      {era:'2016 — 12,5 BTC', reward:12.5},
      {era:'2020 — 6,25 BTC', reward:6.25},
      {era:'2024 — 3,125 BTC',reward:3.125},
      {era:'2028 — 1,56 BTC', reward:1.5625},
      {era:'2032 — 0,78 BTC', reward:0.7813},
      {era:'2036 — 0,39 BTC', reward:0.3906},
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
    if(n>=1e9) return '$'+(n/1e9).toFixed(1)+'M';
    if(n>=1e6) return '$'+(n/1e6).toFixed(1)+'jt';
    if(n>=1e3) return '$'+(n/1e3).toFixed(0)+'rb';
    return '$'+n.toFixed(0);
  }

  function update(){
    const psl=g('b19-s193-price-sl');const fsl=g('b19-s193-fee-sl');
    if(!psl||!fsl) return;
    const price=parseInt(psl.value);
    const fee=parseInt(fsl.value)/100;
    const REWARD=3.125;

    const pv=g('b19-s193-price-val');if(pv) pv.textContent='$'+price.toLocaleString('id-ID');
    const fv=g('b19-s193-fee-val'); if(fv) fv.textContent=fee.toFixed(2)+' BTC';

    const rewardPB=REWARD*price;
    const feePB=fee*price;
    const totalAnnual=(rewardPB+feePB)*BLOCKS_PER_YEAR;

    const rv=g('b19-s193-reward-usd');if(rv) rv.textContent=fmtUSD(rewardPB)+'/block';
    const rs=g('b19-s193-reward-sub');if(rs) rs.textContent=REWARD+' BTC × $'+price.toLocaleString('id-ID');
    const fv2=g('b19-s193-fee-usd'); if(fv2) fv2.textContent=fmtUSD(feePB)+'/block';
    const tv=g('b19-s193-total-usd');if(tv)  tv.textContent=fmtUSD(totalAnnual)+'/thn';

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
     note:'Era awal Bitcoin. Hampir tidak ada transaksi selain coinbase. Fee praktis nol karena jaringan masih sangat kecil. Block reward 50 BTC mendominasi 100% revenue.'},
    {key:'2012',label:'2012 (Halving 1)',reward:25,   fee:0.01,
     note:'Setelah halving pertama. Fee mulai ada tapi masih sangat kecil. Block reward turun ke 25 BTC, tapi harga Bitcoin mulai naik sehingga nilai dollar tetap menarik bagi miner.'},
    {key:'2016',label:'2016 (Halving 2)',reward:12.5, fee:0.05,
     note:'Setelah halving kedua. Jaringan mulai lebih ramai. Fee mulai signifikan di periode congestion tapi masih di bawah 1% dari total revenue rata-rata.'},
    {key:'2020',label:'2020 (Halving 3)',reward:6.25, fee:0.15,
     note:'Setelah halving ketiga. Fee mulai berperan lebih besar terutama di periode congestion tinggi. Block reward masih sangat dominan sekitar 97-98% dari total revenue.'},
    {key:'2024',label:'2024 (Halving 4)',reward:3.125,fee:0.15,
     note:'Setelah halving keempat (April 2024). Block reward kini 3,125 BTC. Fee tetap fluktuatif. Proporsi fee dari total revenue meningkat secara persentase karena block reward berkurang, bukan karena fee naik drastis.'},
    {key:'2140',label:'2140 (Endpoint protokol)',reward:0,fee:0.3,
     note:'Konsekuensi matematis dari halving schedule yang sudah ditentukan sejak genesis block: block reward mencapai nol. Miner sepenuhnya bergantung pada fee. Apakah fee saja cukup untuk mengamankan jaringan adalah pertanyaan terbuka paling penting dalam ekonomi Bitcoin jangka panjang.'},
  ];

  function renderEra(key){
    const d=ERAS.find(e=>e.key===key);if(!d) return;
    const total=d.reward+d.fee;
    const rewardPct=total>0?Math.round(d.reward/total*100):0;
    const feePct=total>0?Math.round(d.fee/total*100):0;

    const rv=g('b19-s191-reward-val');if(rv) rv.textContent=d.reward>0?d.reward+' BTC':'0 BTC';
    const fv=g('b19-s191-fee-val');if(fv) fv.textContent='~'+d.fee+' BTC';
    const pv=g('b19-s191-pct-val');if(pv) pv.textContent='~'+feePct+'%';
    const ps=g('b19-s191-pct-sub');if(ps) ps.textContent=feePct===0?'fee hampir tidak ada':feePct===100?'100% dari fee saja':'sisanya dari block reward';

    const br=g('b19-s191-bar-r');const bf=g('b19-s191-bar-f');
    const brt=g('b19-s191-bar-r-txt');const bft=g('b19-s191-bar-f-txt');
    if(br) br.style.width=rewardPct+'%';
    if(bf) bf.style.width=Math.max(feePct,feePct>0?3:0)+'%';
    if(brt) brt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(bft) bft.textContent=feePct>8?'Fee '+feePct+'%':'';

    const note=g('b19-s191-note');if(note) note.textContent=d.note;
    const cr=g('b19-s191-cb-reward');
    if(cr) cr.textContent=d.reward>0?d.reward+' BTC':'0 BTC (endpoint protokol)';

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
      adjustLabel:'+100% (2×)',adjustSub:'naik: block lebih sulit',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'7 hari (10.080 menit)',desc:'Hashrate 2× lebih tinggi, block ditemukan 2× lebih cepat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'0,5 (7 ÷ 14)',desc:'Di bawah 1,0 berarti block terlalu cepat, difficulty harus naik'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× lebih sulit',desc:'Target baru = target lama × 0,5, hash valid harus lebih kecil'},
      ],
      chart:[
        {epoch:'Epoch N',  days:7, color:'#854F0B',label:'7 hari (terlalu cepat)'},
        {epoch:'Epoch N+1',days:10,color:'#0F6E56',label:'~10 hari'},
        {epoch:'Epoch N+2',days:13,color:'#0F6E56',label:'~13 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 hari (stabil)'},
      ],
    },
    down50:{
      col:'s192-sc-down',actualDays:28,
      adjustLabel:'-50% (0,5×)',adjustSub:'turun: block lebih mudah',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'28 hari (40.320 menit)',desc:'Hashrate turun 50%, block ditemukan 2× lebih lambat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'2,0 (28 ÷ 14)',desc:'Di atas 1,0 berarti block terlalu lambat, difficulty harus turun'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× lebih mudah',desc:'Target baru = target lama × 2,0, hash valid bisa lebih besar'},
      ],
      chart:[
        {epoch:'Epoch N',  days:28,color:'#A32D2D',label:'28 hari (terlalu lambat)'},
        {epoch:'Epoch N+1',days:18,color:'#854F0B',label:'~18 hari'},
        {epoch:'Epoch N+2',days:15,color:'#0F6E56',label:'~15 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 hari (stabil)'},
      ],
    },
    same:{
      col:'s192-sc-same',actualDays:14,
      adjustLabel:'0% (1×)',adjustSub:'tidak berubah',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'14 hari (20.160 menit)',desc:'Hashrate stabil, block ditemukan tepat sesuai target'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'1,0 (14 ÷ 14)',desc:'Tepat 1,0 berarti tidak ada penyesuaian yang diperlukan'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'Tidak berubah',desc:'Target baru = target lama × 1,0, difficulty identik'},
      ],
      chart:[
        {epoch:'Epoch N',  days:14,color:'#0F6E56',label:'14 hari (tepat)'},
        {epoch:'Epoch N+1',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+2',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'14 hari'},
      ],
    },
    up5x:{
      col:'s192-sc-up',actualDays:2.8,
      adjustLabel:'+300% (4×, dibatasi)',adjustSub:'batas protokol diterapkan',afterLabel:'Butuh ~4 epoch',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'~2,8 hari (4.032 menit)',desc:'Hashrate 5× lebih tinggi, block ditemukan sangat cepat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio sebelum batas',val:'0,2 (2,8 ÷ 14)',desc:'Ini berarti difficulty harus naik 5× tetapi ada batas maksimum'},
        {cls:'s192-cs-cap',   num:'4',title:'Batas protokol diterapkan',val:'max(0,25 ; min(4,0 ; 0,2)) = 0,25',desc:'Ratio 0,2 di bawah batas minimum 0,25. Protokol paksa ratio = 0,25'},
        {cls:'s192-cs-result s192-warn',num:'5',title:'New difficulty (dibatasi)',val:'4× lebih sulit (bukan 5×)',desc:'Butuh beberapa epoch untuk sepenuhnya menstabilkan. Ini adalah proteksi jaringan.'},
      ],
      chart:[
        {epoch:'Epoch N',  days:2.8,color:'#A32D2D',label:'2,8 hari (sangat cepat)'},
        {epoch:'Epoch N+1',days:7,  color:'#854F0B',label:'~7 hari (cap 4×)'},
        {epoch:'Epoch N+2',days:11, color:'#0F6E56',label:'~11 hari'},
        {epoch:'Epoch N+3',days:13, color:'#0F6E56',label:'~13 hari'},
        {epoch:'Epoch N+4',days:14, color:'#0F6E56',label:'~14 hari (stabil)'},
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
    const at=g('b19-s192-actual-time');if(at) at.textContent=sc.actualDays+' hari';
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
        <div class="b19-s192-chart-val">${r.days} hari</div>`;
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

