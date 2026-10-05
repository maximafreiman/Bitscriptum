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

