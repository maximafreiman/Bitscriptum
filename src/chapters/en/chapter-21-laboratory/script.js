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
