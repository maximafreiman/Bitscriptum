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

