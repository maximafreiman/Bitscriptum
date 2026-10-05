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

