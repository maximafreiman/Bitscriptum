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
