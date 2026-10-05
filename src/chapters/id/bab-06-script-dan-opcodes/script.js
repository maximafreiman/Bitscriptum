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

