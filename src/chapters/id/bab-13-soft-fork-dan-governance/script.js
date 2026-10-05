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

