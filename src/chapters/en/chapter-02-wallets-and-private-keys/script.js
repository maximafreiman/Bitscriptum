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

