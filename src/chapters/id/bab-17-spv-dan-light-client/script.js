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

