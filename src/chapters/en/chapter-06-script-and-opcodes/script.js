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

