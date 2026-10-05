// ============================================================
// PAGE 19 · BAB 16 · NAVIGATION
// ============================================================
function showSectionInContentB16(sectionId, sbId) {
  document.querySelectorAll('#page-bab16 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab16 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab16-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 19 · BAB 16 · TOPBAR
// ============================================================
document.getElementById('back-home-b16').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b16').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 19 · BAB 16 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab16').addEventListener('click', () => navigate('page-bab16'));

// ============================================================
// PAGE 19 · BAB 16 · SIDEBAR EVENTS (16.1 - 16.6)
// ============================================================
document.getElementById('sb-16-1').addEventListener('click', () => showSectionInContentB16('section-16-1', 'sb-16-1'));
document.getElementById('sb-16-2').addEventListener('click', () => showSectionInContentB16('section-16-2', 'sb-16-2'));
document.getElementById('sb-16-3').addEventListener('click', () => showSectionInContentB16('section-16-3', 'sb-16-3'));
document.getElementById('sb-16-4').addEventListener('click', () => showSectionInContentB16('section-16-4', 'sb-16-4'));
document.getElementById('sb-16-5').addEventListener('click', () => showSectionInContentB16('section-16-5', 'sb-16-5'));
document.getElementById('sb-16-6').addEventListener('click', () => showSectionInContentB16('section-16-6', 'sb-16-6'));

// ============================================================
// PAGE 19 · BAB 16 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab16 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB16(target, sb);
  });
});

// ============================================================
// PAGE 19 · BAB 16 · 16.6 SIMULATION (10 Daily Commands)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CMDS=[
    {num:1,code:'bitcoin-cli getblockchaininfo',
     when:'Setiap hari — cek pertama saat buka terminal',
     why:'Satu command untuk tahu segalanya: apakah node sudah sync, berapa block terakhir, apakah masih IBD, apakah pruning aktif. Ini dashboard utama node kamu.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":               ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "headers":              ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "verificationprogress": ','s166-tb'],['0.9999982341','s166-tn'],[',','s166-tgy'],
       ['  "initialblockdownload": ','s166-tb'],['false','s166-tbt'],[',','s166-tgy'],
       ['  "pruned":               ','s166-tb'],['false','s166-tbf'],[',','s166-tgy'],
       ['  "difficulty":           ','s166-tb'],['88171509232073.27','s166-tn'],
       ['  ...','s166-tcm'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"initialblockdownload"',v:'false',d:'false = node sudah sync dan siap. true = jangan percaya data dari node ini dulu.'},
       {k:'"verificationprogress"',v:'0.9999982341',d:'Semakin dekat ke 1.0, semakin sync node kamu dengan chain terbaru.'},
     ]},
    {num:2,code:'bitcoin-cli getnetworkinfo',
     when:'Kalau node terasa lambat atau tidak menerima block baru',
     why:'Cek apakah node kamu masih terhubung ke jaringan. Koneksi in/out yang rendah bisa berarti masalah firewall, internet, atau node kamu di-ban oleh peer.',
     output:[
       ['{','s166-tgy'],
       ['  "connections":     ','s166-tb'],['18','s166-tn'],[',','s166-tgy'],
       ['  "connections_in":  ','s166-tb'],['8','s166-tn'],[',','s166-tgy'],
       ['  "connections_out": ','s166-tb'],['10','s166-tn'],[',','s166-tgy'],
       ['  "networkactive":   ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "relayfee":        ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"connections_out"',v:'10',d:'Minimal 8 outbound untuk keamanan optimal. Kalau 0, node kamu offline.'},
       {k:'"networkactive"',v:'true',d:'false berarti node sengaja di-set offline. Gunakan setnetworkactive true untuk mengaktifkan kembali.'},
     ]},
    {num:3,code:'bitcoin-cli getmempoolinfo',
     when:'Sebelum mengirim transaksi — cek kondisi fee market',
     why:'Kalau mempool penuh, fee untuk konfirmasi cepat akan mahal. Kalau hampir kosong, kamu bisa kirim dengan fee minimum. Data real-time dari node kamu sendiri.',
     output:[
       ['{','s166-tgy'],
       ['  "loaded":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "size":           ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "bytes":          ','s166-tb'],['47291834','s166-tn'],[',','s166-tgy'],
       ['  "mempoolminfee":  ','s166-tb'],['0.00001000','s166-tn'],[',','s166-tgy'],
       ['  "minrelaytxfee":  ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"size"',v:'18432',d:'Jumlah transaksi yang sedang menunggu konfirmasi di mempool.'},
       {k:'"bytes"',v:'47291834',d:'~47 MB = mempool cukup penuh, fee perlu lebih tinggi untuk konfirmasi cepat.'},
       {k:'"mempoolminfee"',v:'0.00001000',d:'Fee minimum yang diterima mempool node kamu. Transaksi di bawah ini tidak akan di-relay.'},
     ]},
    {num:4,code:'bitcoin-cli getblockcount',
     when:'Quick check — berapa block height sekarang',
     why:'Command paling ringan. Output langsung satu angka. Berguna untuk script otomatis atau kalau kamu hanya perlu tahu block height tanpa info lain.',
     output:[['870142','s166-tn']],
     fields:[
       {k:'output',v:'870142',d:'Integer langsung — block height terbaru. Bandingkan dengan explorer publik untuk verifikasi sync.'},
     ]},
    {num:5,code:'bitcoin-cli gettxoutsetinfo',
     when:'Audit mingguan — verifikasi total supply Bitcoin',
     why:'Satu-satunya cara untuk memverifikasi secara independen bahwa total Bitcoin tidak melebihi 21 juta. Tidak ada bank sentral, tidak ada audit eksternal — node kamu yang membuktikannya.',
     output:[
       ['{','s166-tgy'],
       ['  "height":       ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "txouts":       ','s166-tb'],['184218954','s166-tn'],[',','s166-tgy'],
       ['  "disk_size":    ','s166-tb'],['11284716032','s166-tn'],[',','s166-tgy'],
       ['  "total_amount": ','s166-tb'],['19720483.12847291','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"total_amount"',v:'19.720.483 BTC',d:'Total BTC yang beredar. Harus selalu di bawah 21 juta. Kalau lebih, ada yang sangat salah.'},
       {k:'"txouts"',v:'184.218.954',d:'Jumlah UTXO saat ini. Semakin besar, semakin besar RAM yang dibutuhkan node.'},
     ]},
    {num:6,code:'bitcoin-cli getpeerinfo',
     when:'Troubleshooting koneksi atau cek peer bermasalah',
     why:'Lihat detail semua peer: dari mana mereka, versi software apa, sudah sync ke block berapa, berapa bandwidth yang dipakai.',
     output:[
       ['[','s166-tgy'],
       ['  {','s166-tgy'],
       ['    "addr":          ','s166-tb'],['"203.0.113.42:8333"','s166-ts'],[',','s166-tgy'],
       ['    "version":       ','s166-tb'],['70016','s166-tn'],[',','s166-tgy'],
       ['    "subver":        ','s166-tb'],['"\/Satoshi:27.0.0\/"','s166-ts'],[',','s166-tgy'],
       ['    "synced_blocks": ','s166-tb'],['870142','s166-tn'],
       ['    ...','s166-tcm'],
       ['  }','s166-tgy'],
       ['  ...','s166-tcm'],
       [']','s166-tgy'],
     ],
     fields:[
       {k:'"synced_blocks"',v:'870142',d:'Block terakhir yang diketahui peer ini sudah divalidasi. Kalau jauh di belakang, peer ini tidak berguna untuk IBD.'},
       {k:'"subver"',v:'"/Satoshi:27.0.0/"',d:'Versi software yang dijalankan peer. Berguna untuk monitoring distribusi versi di jaringan.'},
     ]},
    {num:7,code:'bitcoin-cli estimatesmartfee 6',
     when:'Sebelum kirim transaksi — estimasi fee yang tepat',
     why:'Berapa fee yang dibutuhkan agar transaksi dikonfirmasi dalam 6 block (~1 jam)? Data dari mempool node kamu sendiri, bukan dari layanan pihak ketiga.',
     output:[
       ['{','s166-tgy'],
       ['  "feerate": ','s166-tb'],['0.00012340','s166-tn'],[',','s166-tgy'],
       ['  "blocks":  ','s166-tb'],['6','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"feerate"',v:'0.00012340',d:'Fee rate dalam BTC/kB untuk konfirmasi dalam 6 block. Kalkulasi dari data mempool node kamu sendiri.'},
       {k:'"blocks"',v:'6',d:'Ganti dengan 1 untuk estimasi fee next block, atau 144 untuk fee murah (~1 hari).'},
     ]},
    {num:8,code:'bitcoin-cli getmininginfo',
     when:'Monitor difficulty dan kondisi keamanan jaringan',
     why:'Lihat difficulty saat ini, estimasi hashrate jaringan, dan berapa block sudah ditambang dalam periode difficulty adjustment ini.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":        ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "difficulty":    ','s166-tb'],['88171509232073.27','s166-tn'],[',','s166-tgy'],
       ['  "networkhashps": ','s166-tb'],['6.847e+20','s166-tn'],[',','s166-tgy'],
       ['  "pooledtx":      ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "chain":         ','s166-tb'],['"main"','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"difficulty"',v:'88.171.509.232.073',d:'Difficulty saat ini. Angka lebih besar = jaringan lebih aman.'},
       {k:'"networkhashps"',v:'6.847e+20',d:'~685 exahash/s = total hashrate jaringan. Semakin besar, semakin sulit diserang.'},
     ]},
    {num:9,code:'bitcoin-cli getwalletinfo',
     when:'Cek saldo dan status wallet node',
     why:'Lihat saldo total, jumlah transaksi, apakah wallet sedang rescan, dan apakah wallet terenkripsi. Data langsung dari node kamu, bukan server pihak ketiga.',
     output:[
       ['{','s166-tgy'],
       ['  "walletname":          ','s166-tb'],['"default"','s166-ts'],[',','s166-tgy'],
       ['  "balance":             ','s166-tb'],['0.12847291','s166-tn'],[',','s166-tgy'],
       ['  "unconfirmed_balance": ','s166-tb'],['0.00000000','s166-tn'],[',','s166-tgy'],
       ['  "txcount":             ','s166-tb'],['47','s166-tn'],[',','s166-tgy'],
       ['  "unlocked_until":      ','s166-tb'],['0','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"balance"',v:'0.12847291 BTC',d:'Saldo yang sudah dikonfirmasi. Diverifikasi langsung dari chainstate node kamu.'},
       {k:'"unlocked_until"',v:'0',d:'0 = wallet terkunci. Selalu lock wallet setelah selesai digunakan.'},
     ]},
    {num:10,code:'bitcoin-cli validateaddress "bc1qar0srrr..."',
     when:'Sebelum menerima pembayaran — validasi address',
     why:'Verifikasi bahwa address Bitcoin yang kamu gunakan valid dan format-nya benar. Mencegah kesalahan kirim ke address yang tidak valid.',
     output:[
       ['{','s166-tgy'],
       ['  "isvalid":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "address":         ','s166-tb'],['"bc1qar0srrr7xfkvy5l643..."','s166-ts'],[',','s166-tgy'],
       ['  "iswitness":       ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "witness_version": ','s166-tb'],['0','s166-tn'],[',','s166-tgy'],
       ['  "witness_program": ','s166-tb'],['"e8df018c7e326cc253fae05bc7..."','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"isvalid"',v:'true',d:'true = address ini valid. false = address salah, jangan kirim ke sini.'},
       {k:'"iswitness"',v:'true',d:'true = ini SegWit address (bc1...). Lebih efisien dari legacy address.'},
       {k:'"witness_version"',v:'0',d:'0 = SegWit v0. 1 = Taproot (bc1p...). Menentukan jenis script yang digunakan.'},
     ]},
  ];

  let currentIdx=0;

  function runCmd(idx){
    currentIdx=idx;
    document.querySelectorAll('.b16-s166-cmd').forEach((b,i)=>b.classList.toggle('s166-act',i===idx));
    const data=CMDS[idx];if(!data) return;

    const termCmd=g('b16-s166-term-cmd');
    if(termCmd) termCmd.textContent=data.code;

    const body=g('b16-s166-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s166-tg">satoshi@node</span><span class="s166-tgy">:~$</span> <span class="s166-tw"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s166-tcm'||tr.endsWith(',')) flush();
    });
    flush();

    const explain=g('b16-s166-explain');if(!explain) return;
    explain.innerHTML='';
    const head=document.createElement('div');head.className='b16-s166-explain-head';
    head.innerHTML=`<div class="b16-s166-explain-num">${data.num}</div>
      <div class="b16-s166-explain-body">
        <div class="b16-s166-explain-title">${data.code}</div>
        <div class="b16-s166-explain-when">📅 Kapan: ${data.when}</div>
        <div class="b16-s166-explain-why">Mengapa: ${data.why}</div>
      </div>`;
    explain.appendChild(head);

    if(data.fields&&data.fields.length){
      const fe=document.createElement('div');fe.className='b16-s166-fe';
      const lbl=document.createElement('div');lbl.className='b16-s166-fe-lbl';lbl.textContent='Field penting:';
      fe.appendChild(lbl);
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s166-field';
        row.innerHTML=`<div class="b16-s166-fk">${f.k}</div><div class="b16-s166-fv">${f.v}</div><div class="b16-s166-fd">${f.d}</div>`;
        fe.appendChild(row);
      });
      explain.appendChild(fe);
    }
  }

  (function(){
    const el=g('b16-s166-grid');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s166-cmd'+(i===0?' s166-act':'');
      btn.innerHTML=`<div class="b16-s166-cmd-num">${c.num}</div>
        <div class="b16-s166-cmd-code">${c.code}</div>
        <div class="b16-s166-cmd-when">${c.when.split('—')[0].trim()}</div>
        <div class="b16-s166-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runCmd(i));
      el.appendChild(btn);
    });
  })();

  runCmd(0);
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.5 SIMULATION (assumevalid & assumeUTXO)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const MODES={
    full:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download semua headers (80 byte/block)',desc:'~70 MB total untuk seluruh blockchain. Cepat.',time:'~5 menit'},
        {cls:'s165-done',icon:'⬇️',title:'Download semua block data',desc:'~650 GB total. Ini yang paling lama dari segi waktu download.',time:'~2-12 jam'},
        {cls:'s165-done',icon:'✅',title:'Validasi struktur setiap block',desc:'Proof-of-work, timestamp, ukuran, merkle root — semua block dari genesis.',time:'~1-3 jam'},
        {cls:'s165-done',icon:'🔐',title:'Verifikasi SEMUA signature',desc:'Ini yang paling CPU-intensive. Setiap input dari setiap transaksi dari setiap block diverifikasi.',time:'~10-50 jam'},
        {cls:'s165-done',icon:'🗃️',title:'Bangun UTXO set dari genesis',desc:'Setiap output ditambahkan, setiap yang dibelanjakan dihapus. Hasil akhir: chainstate yang akurat.',time:'~1-2 jam'},
      ],
      trust:'IBD penuh tidak membutuhkan kepercayaan kepada siapapun — setiap byte, setiap signature diverifikasi sendiri oleh node kamu. Ini adalah gold standard verifikasi Bitcoin. Gunakan -assumevalid=0 untuk mengaktifkan mode ini.',
    },
    assumevalid:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download semua headers',desc:'~70 MB. Identik dengan IBD penuh.',time:'~5 menit'},
        {cls:'s165-done',icon:'⬇️',title:'Download semua block data',desc:'~650 GB. Block tetap didownload seluruhnya — tidak ada yang di-skip.',time:'~2-12 jam'},
        {cls:'s165-done',icon:'✅',title:'Validasi struktur setiap block',desc:'Proof-of-work, timestamp, ukuran, merkle root — tetap divalidasi untuk semua block.',time:'~1-3 jam'},
        {cls:'s165-skip',icon:'⏩',title:'Signature block lama DI-SKIP',desc:'Untuk block sebelum assumevalid hash, signature tidak diverifikasi. Ini yang menghemat waktu paling banyak.',time:'di-skip'},
        {cls:'s165-done',icon:'🗃️',title:'Bangun UTXO set dari genesis',desc:'UTXO set tetap dibangun secara penuh dari semua transaksi. Tidak ada jalan pintas di sini.',time:'~1-2 jam'},
      ],
      trust:'assumevalid bukan kepercayaan buta. Kalau hash yang di-hardcode salah, node akan membangun UTXO set yang berselisih dengan jaringan dan langsung ketahuan. Source code terbuka dan diaudit ribuan developer. Kamu juga bisa menonaktifkan dengan -assumevalid=0 kapanpun.',
    },
    assumeutxo:{
      phases:[
        {cls:'s165-snap',icon:'📦',title:'Muat snapshot UTXO set (~11 GB)',desc:'File snapshot berisi semua UTXO pada block height tertentu.',time:'~5-10 menit'},
        {cls:'s165-done',icon:'🔍',title:'Verifikasi hash snapshot',desc:'Node memverifikasi bahwa hash snapshot cocok dengan yang di-hardcode. Kalau tidak cocok, ditolak.',time:'~1 menit'},
        {cls:'s165-done',icon:'✅',title:'Node langsung beroperasi',desc:'Setelah snapshot diverifikasi, node sudah bisa memvalidasi transaksi baru dan block terbaru.',time:'SELESAI ✓'},
        {cls:'s165-bg',  icon:'🔄',title:'Verifikasi historis di background',desc:'Node mendownload dan memverifikasi blockchain dari genesis di background sambil tetap beroperasi normal.',time:'~4-8 jam (bg)'},
        {cls:'s165-done',icon:'🎯',title:'Background sync selesai',desc:'Chainstate dari snapshot sudah diverifikasi secara independen. Node setara dengan IBD normal.',time:'~4-8 jam total'},
      ],
      trust:'assumeUTXO menggunakan snapshot yang hash-nya di-hardcode dan bisa diaudit siapapun. Kalau snapshot berisi UTXO yang salah, background verification akan menemukan inkonsistensi. Desainnya memastikan node akan self-correct bahkan kalau snapshot salah.',
    },
  };

  let currentMode='full';

  function renderMode(mode){
    const data=MODES[mode];if(!data) return;
    const phases=g('b16-s165-phases');const trust=g('b16-s165-trust');
    if(phases){
      phases.innerHTML='';
      data.phases.forEach(p=>{
        const div=document.createElement('div');div.className=`b16-s165-phase ${p.cls}`;
        div.innerHTML=`<div class="b16-s165-phase-icon">${p.icon}</div>
          <div class="b16-s165-phase-body">
            <div class="b16-s165-phase-title">${p.title}</div>
            <div class="b16-s165-phase-desc">${p.desc}</div>
          </div>
          <div class="b16-s165-phase-time">${p.time}</div>`;
        phases.appendChild(div);
      });
    }
    if(trust){
      trust.innerHTML=`<div class="b16-s165-trust-label">Analisis kepercayaan (trust model):</div>
        <div class="b16-s165-trust-text">${data.trust}</div>`;
    }
  }

  const modeEl=g('b16-s165-modes');
  if(modeEl) modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(b=>b.classList.remove('s165-act'));
      btn.classList.add('s165-act');
      currentMode=btn.dataset.mode;
      renderMode(currentMode);
    });
  });
  renderMode('full');

  // RPC
  const CMDS=[
    {id:'getblockchaininfo_av',code:'bitcoin-cli getblockchaininfo',hint:'Cek assumevalid status',
     output:[
       ['{','s165-tgy'],
       ['  "blocks":               ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['  "verificationprogress": ','s165-tb'],['0.9999982341','s165-tn'],[',','s165-tgy'],
       ['  "chainwork":            ','s165-tb'],['"00000000000000000000000000000000000000007b4e..."','s165-ts'],[',','s165-tgy'],
       ['  "initialblockdownload": ','s165-tb'],['false','s165-tbt'],
       ['  ...','s165-tcm'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"verificationprogress"',v:'0.9999982341',d:'Progress sync mendekati 1.0 berarti node hampir selesai. Dihitung dari chainwork, bukan jumlah block.'},
       {k:'"chainwork"',v:'"00000...7b4e"',d:'Total proof-of-work terakumulasi. Dibandingkan dengan assumevalid hash untuk menentukan block mana yang signature-nya di-skip.'},
     ],
     note:'assumevalid hash di-hardcode di source code dan diperbarui tiap rilis baru. Untuk melihat nilai yang dipakai, cek source code atau gunakan -assumevalid=0 untuk menonaktifkan.'},
    {id:'assumevalid_disable',code:'bitcoind -assumevalid=0',hint:'Nonaktifkan assumevalid (verifikasi penuh)',
     output:[
       ['# Jalankan bitcoind dengan flag ini untuk IBD penuh','s165-tcm'],
       ['# Semua signature dari block 0 akan diverifikasi','s165-tcm'],
       ['# Estimasi waktu: 3-10x lebih lama dari default','s165-tcm'],
       ['','s165-tgy'],
       ['Bitcoin Core starting...','s165-tw'],
       ['Loaded 0 addresses from peers.dat','s165-tgy'],
       ['assumevalid is disabled, verifying all signatures','s165-tn'],
       ['UpdateTip: new best=00000...a4b height=1 ...','s165-tgy'],
     ],
     fields:[
       {k:'-assumevalid=0',v:'disable',d:'Menonaktifkan assumevalid sepenuhnya. Node akan memverifikasi setiap signature dari genesis block.'},
       {k:'alternatif',v:'-assumevalid=hash',d:'Bisa diisi hash block tertentu untuk menentukan sendiri cutoff point assumevalid.'},
     ],
     note:'Gunakan -assumevalid=0 kalau kamu ingin verifikasi paling menyeluruh. Prosesnya jauh lebih lama tapi memberikan jaminan keamanan tertinggi tanpa kepercayaan apapun kepada developer.'},
    {id:'loadtxoutset',code:'bitcoin-cli loadtxoutset /path/to/utxo-870000.dat',hint:'Muat snapshot assumeUTXO',
     output:[
       ['{','s165-tgy'],
       ['  "coins_loaded":  ','s165-tb'],['184218954','s165-tn'],[',','s165-tgy'],
       ['  "tip_hash":      ','s165-tb'],['"00000000000000000001a4b..."','s165-ts'],[',','s165-tgy'],
       ['  "base_height":   ','s165-tb'],['870000','s165-tn'],[',','s165-tgy'],
       ['  "path":          ','s165-tb'],['"\/path\/to\/utxo-870000.dat"','s165-ts'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"coins_loaded"',v:'184.218.954',d:'Jumlah UTXO yang berhasil dimuat dari snapshot.'},
       {k:'"base_height"',v:'870000',d:'Block height dari snapshot. Node langsung bisa memvalidasi block di atas height ini setelah snapshot dimuat.'},
       {k:'"tip_hash"',v:'"00000...a4b"',d:'Hash block tip dari snapshot. Diverifikasi cocok dengan yang di-hardcode sebelum digunakan.'},
     ],
     note:'File snapshot assumeUTXO bisa didapatkan dari berbagai sumber — tapi selalu verifikasi hash-nya. Node akan menolak snapshot yang hash-nya tidak cocok dengan yang di-hardcode di source code.'},
    {id:'getchainstates',code:'bitcoin-cli getchainstates',hint:'Status background sync setelah assumeUTXO',
     output:[
       ['{','s165-tgy'],
       ['  "chainstates": [','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['true','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['      "snapshot_blockhash":','s165-tb'],['"00000...a4b"','s165-ts'],
       ['    },','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['false','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['423819','s165-tn'],[',','s165-tgy'],
       ['      # background verification: 48.7% selesai','s165-tcm'],
       ['    }','s165-tgy'],
       ['  ]','s165-tgy'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'chainstate aktif [0]',v:'blocks: 870142',d:'Chainstate dari snapshot yang digunakan untuk validasi transaksi baru. Sudah di block terbaru.'},
       {k:'chainstate background [1]',v:'blocks: 423819',d:'Background verification sedang di block 423.819 dari 870.142. ~48.7% selesai.'},
       {k:'"snapshot_blockhash"',v:'"00000...a4b"',d:'Hash snapshot yang digunakan. null pada chainstate background berarti ini IBD normal dari genesis.'},
     ],
     note:'getchainstates menunjukkan dua chainstate berjalan paralel: satu dari snapshot (aktif) dan satu dari genesis (background). Setelah background sync selesai, keduanya di-merge menjadi satu.'},
  ];

  let currentCmd=CMDS[0].id;
  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s165-cmd').forEach(b=>b.classList.toggle('s165-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s165-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s165-tg">satoshi@node</span><span class="s165-tgy">:~$</span> <span class="s165-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s165-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s165-fe'),fei=g('b16-s165-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s165-field';
        row.innerHTML=`<div class="b16-s165-fk">${f.k}</div><div class="b16-s165-fv">${f.v}</div><div class="b16-s165-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s165-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s165-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s165-cmd'+(i===0?' s165-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s165-cmd-code">${c.code}</div><div class="b16-s165-cmd-hint">${c.hint}</div><div class="b16-s165-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s165-t1'),t2=g('b16-s165-t2');
  const p1=g('b16-s165-p1'),p2=g('b16-s165-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s165-tab s165-act';t2.className='b16-s165-tab';
    p1.className='b16-s165-pane show';p2.className='b16-s165-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s165-tab s165-act';t1.className='b16-s165-tab';
    p2.className='b16-s165-pane show';p1.className='b16-s165-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_av');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.4 SIMULATION (Pruning Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const TOTAL_GB=650, TOTAL_BLOCKS=870142;

  function renderTL(pruneGB){
    const tl=g('b16-s164-tl');if(!tl) return;
    tl.innerHTML='';
    const prunedPct=Math.max(0,Math.min(95,(1-pruneGB/TOTAL_GB)*100));
    const keptPct=Math.max(3,100-prunedPct-2);
    const seg1=document.createElement('div');
    seg1.className='b16-s164-tl-seg s164-pruned';seg1.style.width=prunedPct+'%';
    const l1=document.createElement('div');l1.className='b16-s164-tl-seg-lbl';
    l1.textContent=prunedPct>18?'Block divalidasi & dihapus':'';seg1.appendChild(l1);
    const seg2=document.createElement('div');
    seg2.className='b16-s164-tl-seg s164-kept';seg2.style.width=keptPct+'%';
    const l2=document.createElement('div');l2.className='b16-s164-tl-seg-lbl';
    l2.textContent=keptPct>10?'Buffer':'';seg2.appendChild(l2);
    const seg3=document.createElement('div');
    seg3.className='b16-s164-tl-seg s164-recent';seg3.style.width='2%';
    tl.appendChild(seg1);tl.appendChild(seg2);tl.appendChild(seg3);
    const marker=g('b16-s164-prune-marker');
    if(marker){
      const pruneBlock=Math.round(TOTAL_BLOCKS*(1-pruneGB/TOTAL_GB));
      marker.textContent='Prune height ~#'+pruneBlock.toLocaleString('id-ID');
    }
  }

  function updateStats(mb){
    const gb=mb/1024;
    const saved=Math.max(0,TOTAL_GB-gb);
    const prunedBlocks=Math.round(TOTAL_BLOCKS*(1-gb/TOTAL_GB));
    const neededEl=g('b16-s164-needed');
    const savedEl=g('b16-s164-saved');
    const pruneEl=g('b16-s164-pruned-blocks');
    if(neededEl) neededEl.textContent=mb>=1024?(mb/1024).toFixed(1)+' GB':mb+' MB';
    if(savedEl) savedEl.textContent='~'+Math.round(saved)+' GB';
    if(pruneEl) pruneEl.textContent='~'+prunedBlocks.toLocaleString('id-ID');
  }

  const sl=g('b16-s164-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s164-sl-val');
    if(vEl) vEl.textContent=v>=1024?(v/1024).toFixed(1)+' GB':v+' MB';
    renderTL(v/1024);updateStats(v);
  });
  renderTL(0.55);updateStats(550);

  // RPC data — 3 normal + 2 error
  const CMDS=[
    {id:'getblockchaininfo_prune',code:'bitcoin-cli getblockchaininfo',hint:'Cek status pruning',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned":            ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "pruneheight":       ','s164-tb'],['869592','s164-tn'],[',','s164-tgy'],
       ['  "automatic_pruning": ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "prune_target_size": ','s164-tb'],['576716800','s164-tn'],[',','s164-tgy'],
       ['  "blocks":            ','s164-tb'],['870142','s164-tn'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'true',d:'true = node berjalan dalam mode pruning. false = full archival node.',err:false},
       {k:'"pruneheight"',v:'869592',d:'Block height tertua yang masih ada di disk. Block di bawah ini sudah dihapus. Angka ini naik seiring waktu.',err:false},
       {k:'"prune_target_size"',v:'576716800',d:'Target ukuran maksimum block files dalam bytes. 576.716.800 = 550 MB (nilai minimum).',err:false},
     ],
     note:'"pruneheight" adalah kunci untuk tahu block mana yang masih bisa diakses. Kalau kamu ingin getblock untuk block lama, pastikan block height-nya di atas pruneheight.',
     noteType:'normal'},
    {id:'pruneblockchain',code:'bitcoin-cli pruneblockchain 850000',hint:'Manual prune hingga block tertentu',isErr:false,
     output:[['869142','s164-tn']],
     fields:[
       {k:'parameter: 850000',v:'target height',d:'Block height target untuk pruning. Node akan menghapus block lama hingga mendekati height ini.',err:false},
       {k:'output: 869142',v:'actual height',d:'Block height aktual yang berhasil di-prune. Bisa lebih tinggi dari target kalau node perlu menjaga undo data untuk beberapa block terakhir.',err:false},
     ],
     note:'Manual pruning hanya bisa dilakukan kalau prune=1 di bitcoin.conf (mode manual) atau node sudah dalam mode pruning. Tidak bisa dijalankan di full archival node.',
     noteType:'normal'},
    {id:'getblockchaininfo_full',code:'bitcoin-cli getblockchaininfo  # full archival',hint:'Node full archival (pruning off)',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned": ','s164-tb'],['false','s164-tbf'],[',','s164-tgy'],
       ['  # pruneheight tidak ada di output','s164-tcm'],
       ['  # semua block dari genesis tersedia','s164-tcm'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'false',d:'false = full archival node. Semua block tersedia. "pruneheight" tidak muncul.',err:false},
       {k:'storage dibutuhkan',v:'~650 GB+',d:'Full archival menyimpan semua block sejak genesis. Bertambah ~50-60 GB per tahun.',err:false},
     ],
     note:'Full archival node bisa melayani block lama kepada peer yang sedang IBD — berkontribusi lebih ke jaringan. Butuh storage jauh lebih besar tapi lebih baik untuk kesehatan jaringan.',
     noteType:'normal'},
    {id:'err_getblock',code:'bitcoin-cli getblock "00000...lama" 1',hint:'TIDAK bisa di pruned node',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-1','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],['"Block not available (pruned data)"','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -1',v:'Block not available',d:'Node mengembalikan error ini kalau kamu mencoba mengakses block yang sudah di-prune dan tidak ada lagi di disk.',err:true},
       {k:'solusi',v:'gunakan archival node',d:'Untuk mengakses block historis, kamu butuh full archival node atau layanan block explorer seperti mempool.space.',err:true},
     ],
     note:'Ini adalah error yang paling sering ditemui pengguna baru pruned node. Kalau kamu butuh akses ke block historis secara rutin, pertimbangkan untuk tidak mengaktifkan pruning.',
     noteType:'err'},
    {id:'err_getrawtx',code:'bitcoin-cli getrawtransaction "txid"',hint:'TIDAK bisa tanpa txindex',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-5','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],
       ['"No such mempool transaction.','s164-terr'],
       [' Use -txindex or provide a block hash','s164-terr'],
       [' to enable blockchain transaction queries."','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -5',v:'No such mempool tx',d:'Node tidak bisa mencari transaksi historis tanpa txindex karena pruned node tidak punya indeks transaksi.',err:true},
       {k:'solusi 1: -txindex',v:'tidak kompatibel',d:'txindex tidak bisa dijalankan bersamaan dengan pruning. Harus pilih salah satu.',err:true},
       {k:'solusi 2: block hash',v:'getblock "hash" 2',d:'Kalau tahu block hash-nya, gunakan getblock dengan verbosity 2 — tapi hanya untuk block yang belum di-prune.',err:true},
     ],
     note:'Pruned node + txindex tidak kompatibel. Kalau kamu butuh getrawtransaction untuk transaksi historis, kamu harus menjalankan full archival node dengan txindex=1 di bitcoin.conf.',
     noteType:'err'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s164-cmd').forEach(b=>b.classList.toggle('s164-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s164-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s164-tg">satoshi@node</span><span class="s164-tgy">:~$</span> <span class="s164-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||c==='s164-tcm'||c==='s164-terr'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s164-fe'),fei=g('b16-s164-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');
        row.className='b16-s164-field'+(f.err?' s164-err-field':'');
        row.innerHTML=`<div class="b16-s164-fk">${f.k}</div><div class="b16-s164-fv">${f.v}</div><div class="b16-s164-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s164-note');
    if(note){
      note.style.display='block';
      note.className='b16-s164-note '+(data.noteType==='err'?'s164-note-err':'s164-note-normal');
      note.textContent=data.note;
    }
  }

  (function(){
    const el=g('b16-s164-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s164-cmd'+(i===0?' s164-act':'')+(c.isErr?' s164-err':'');
      btn.dataset.id=c.id;
      let html=`<div class="b16-s164-cmd-code">${c.code}</div>`;
      if(c.isErr) html+=`<div class="b16-s164-cmd-badge">ERROR</div>`;
      html+=`<div class="b16-s164-cmd-hint">${c.hint}</div><div class="b16-s164-cmd-arrow">▶</div>`;
      btn.innerHTML=html;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s164-t1'),t2=g('b16-s164-t2');
  const p1=g('b16-s164-p1'),p2=g('b16-s164-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s164-tab s164-act';t2.className='b16-s164-tab';
    p1.className='b16-s164-pane show';p2.className='b16-s164-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s164-tab s164-act';t1.className='b16-s164-tab';
    p2.className='b16-s164-pane show';p1.className='b16-s164-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_prune');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.3 SIMULATION (Chainstate Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // Animate bar
  setTimeout(()=>{
    const bar=g('b16-s163-bar');const txt=g('b16-s163-bar-text');
    if(bar) bar.style.width='1.7%';
    if(txt) txt.textContent='Chainstate 11 GB';
  },400);

  // dbcache slider
  const sl=g('b16-s163-cache-sl');
  const labels=[
    {max:900,  cls:'s163-bad',  text:'<strong>Default / Terlalu kecil (< 900 MB):</strong> Meja kerja sempit. Node sering baca disk saat IBD, sync lebih lambat. Cocok hanya kalau RAM sangat terbatas.'},
    {max:2000, cls:'s163-ok',   text:'<strong>Cukup (900 MB - 2 GB):</strong> Meja kerja layak. IBD lebih cepat dari default. Cocok untuk node dengan RAM 4-8 GB.'},
    {max:8000, cls:'s163-good', text:'<strong>Optimal (2 GB - 8 GB):</strong> Meja kerja luas. Sebagian besar UTXO set muat di RAM. IBD sangat cepat. Disarankan untuk node baru yang sedang IBD.'},
  ];
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s163-cache-val');
    if(vEl) vEl.textContent=v>=1000?(v/1000).toFixed(1)+' GB':v+' MB';
    const res=g('b16-s163-cache-result');if(!res) return;
    const lbl=labels.find(l=>v<=l.max)||labels[labels.length-1];
    res.className='b16-s163-cache-result '+lbl.cls;
    res.innerHTML=lbl.text;
  });

  // RPC data
  const CMDS=[
    {id:'gettxoutsetinfo',code:'bitcoin-cli gettxoutsetinfo',hint:'Statistik UTXO set',
     output:[
       ['{','s163-tgy'],
       ['  "height":           ','s163-tb'],['870142','s163-tn'],[',','s163-tgy'],
       ['  "bestblock":        ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "txouts":           ','s163-tb'],['184218954','s163-tn'],[',','s163-tgy'],
       ['  "bogosize":         ','s163-tb'],['13847291823','s163-tn'],[',','s163-tgy'],
       ['  "muhash":           ','s163-tb'],['"a3f8c2e1d4b7..."','s163-ts'],[',','s163-tgy'],
       ['  "transactions":     ','s163-tb'],['152441089','s163-tn'],[',','s163-tgy'],
       ['  "disk_size":        ','s163-tb'],['11284716032','s163-tn'],[',','s163-tgy'],
       ['  "total_amount":     ','s163-tb'],['19720483.12847291','s163-tn'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"txouts"',v:'184.218.954',d:'Total UTXO yang ada saat ini. Setiap angka adalah satu output yang belum dibelanjakan di seluruh jaringan Bitcoin.'},
       {k:'"total_amount"',v:'19.720.483 BTC',d:'Jumlah semua UTXO = total BTC yang beredar. Bisa digunakan untuk memverifikasi bahwa tidak ada BTC yang diciptakan di luar jadwal.'},
       {k:'"disk_size"',v:'~11 GB',d:'Ukuran chainstate di disk dalam bytes setelah kompresi LevelDB.'},
       {k:'"muhash"',v:'"a3f8c2e1..."',d:'Hash dari seluruh UTXO set menggunakan MuHash. Digunakan untuk verifikasi assumeUTXO snapshot.'},
     ],
     note:'Command ini agak lambat karena harus membaca seluruh chainstate database. Di node dengan SSD biasanya selesai dalam 30-120 detik. "total_amount" adalah cara terbaik memverifikasi bahwa supply Bitcoin sesuai jadwal.'},
    {id:'gettxout',code:'bitcoin-cli gettxout "a1b2c3...txid" 0',hint:'Query satu UTXO spesifik',
     output:[
       ['{','s163-tgy'],
       ['  "bestblock":    ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "confirmations":','s163-tb'],['14382','s163-tn'],[',','s163-tgy'],
       ['  "value":        ','s163-tb'],['0.05000000','s163-tn'],[',','s163-tgy'],
       ['  "scriptPubKey": ','s163-tb'],['{','s163-tgy'],
       ['    "type":    ','s163-tb'],['"witness_v1_taproot"','s163-ts'],[',','s163-tgy'],
       ['    "address": ','s163-tb'],['"bc1p..."','s163-ts'],
       ['  }','s163-tgy'],[',','s163-tgy'],
       ['  "coinbase":     ','s163-tb'],['false','s163-tbt'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"value"',v:'0.05000000',d:'Nilai UTXO dalam BTC. Node menyimpan ini sebagai satoshi (5.000.000 sat) di LevelDB.'},
       {k:'"confirmations"',v:'14382',d:'Berapa block sudah dikonfirmasi sejak UTXO ini dibuat. Semakin besar, semakin tua dan aman UTXO ini.'},
       {k:'"type"',v:'"witness_v1_taproot"',d:'Jenis locking script. Taproot = SegWit v1. Ini menentukan bagaimana UTXO bisa dibelanjakan.'},
       {k:'"coinbase"',v:'false',d:'true berarti UTXO ini dari reward miner. UTXO coinbase butuh 100 konfirmasi sebelum bisa dibelanjakan.'},
     ],
     note:'Kalau output dari command ini null, berarti UTXO tersebut sudah dibelanjakan atau tidak pernah ada. Cara langsung untuk mengecek apakah sebuah output masih bisa dipakai.'},
    {id:'getmemoryinfo',code:'bitcoin-cli getmemoryinfo',hint:'Info penggunaan memori node',
     output:[
       ['{','s163-tgy'],
       ['  "locked": {','s163-tgy'],
       ['    "used":        ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "free":        ','s163-tb'],['393216','s163-tn'],[',','s163-tgy'],
       ['    "total":       ','s163-tb'],['458752','s163-tn'],[',','s163-tgy'],
       ['    "locked":      ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "chunks_used": ','s163-tb'],['2','s163-tn'],[',','s163-tgy'],
       ['    "chunks_free": ','s163-tb'],['1','s163-tn'],
       ['  }','s163-tgy'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"used"',v:'65536',d:'Memori yang sedang digunakan node dalam bytes. Tidak termasuk dbcache yang dikelola terpisah.'},
       {k:'"total"',v:'458752',d:'Total memori yang dialokasikan untuk node (di luar dbcache). ~448 KB untuk overhead node.'},
       {k:'"locked"',v:'65536',d:'Memori yang di-lock ke RAM dan tidak bisa di-swap ke disk. Untuk data sensitif seperti kunci wallet.'},
     ],
     note:'Command ini menunjukkan penggunaan memori internal node, tidak termasuk dbcache. Untuk melihat total penggunaan RAM termasuk dbcache, gunakan tools OS seperti "top" atau "htop" dan cari proses bitcoind.'},
    {id:'savemempool',code:'bitcoin-cli savemempool',hint:'Simpan mempool ke disk',
     output:[
       ['{','s163-tgy'],
       ['  "filename": ','s163-tb'],['"~/.bitcoin/mempool.dat"','s163-ts'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"filename"',v:'"mempool.dat"',d:'Path file tempat mempool disimpan. Node otomatis memuat file ini saat restart sehingga transaksi tidak hilang.'},
     ],
     note:'Node menyimpan mempool secara otomatis saat shutdown normal. Gunakan savemempool kalau ingin memaksa flush ke disk — berguna sebelum backup atau restart yang direncanakan.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s163-cmd').forEach(b=>b.classList.toggle('s163-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s163-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s163-tg">satoshi@node</span><span class="s163-tgy">:~$</span> <span class="s163-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s163-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s163-fe'),fei=g('b16-s163-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s163-field';
        row.innerHTML=`<div class="b16-s163-fk">${f.k}</div><div class="b16-s163-fv">${f.v}</div><div class="b16-s163-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s163-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s163-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s163-cmd'+(i===0?' s163-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s163-cmd-code">${c.code}</div><div class="b16-s163-cmd-hint">${c.hint}</div><div class="b16-s163-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s163-t1'),t2=g('b16-s163-t2');
  const p1=g('b16-s163-p1'),p2=g('b16-s163-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s163-tab s163-act';t2.className='b16-s163-tab';
    p1.className='b16-s163-pane show';p2.className='b16-s163-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s163-tab s163-act';t1.className='b16-s163-tab';
    p2.className='b16-s163-pane show';p1.className='b16-s163-pane';
    runRPC(currentCmd);
  });
  runRPC('gettxoutsetinfo');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.2 SIMULATION (Block Inspector)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CHECKS=[
    {icon:'📦',title:'1. Struktur dasar block valid',
     desc:'Node memeriksa apakah block punya semua field wajib: version, previousblockhash, merkleroot, time, bits, nonce. Block dengan struktur rusak langsung ditolak.',
     val:'version=536870916, size=1.247.832 bytes — ok'},
    {icon:'⛏️',title:'2. Proof-of-Work valid',
     desc:'Hash dari header block harus di bawah target difficulty saat ini. Tidak bisa dipalsukan tanpa mengeluarkan energi nyata. Pemeriksaan ini paling cepat dan dilakukan pertama.',
     val:'hash: 00000000000000000001a4b... < target: 0000000000000000000395... — VALID'},
    {icon:'🔗',title:'3. previousblockhash cocok',
     desc:'Field previousblockhash harus cocok dengan hash block terbaru yang sudah divalidasi node. Ini yang membuat blockchain tidak bisa diubah tanpa merekompute seluruh chain.',
     val:'00000000000000000002f... — cocok dengan tip #870141 ✓'},
    {icon:'🕐',title:'4. Timestamp dalam range yang diizinkan',
     desc:'Timestamp harus lebih besar dari Median Time Past (MTP) 11 block terakhir, dan tidak lebih dari 2 jam di masa depan. Ini mencegah manipulasi waktu oleh miner.',
     val:'time=1717459200 > MTP=1717456800, delta from now=+12s — ok'},
    {icon:'📏',title:'5. Ukuran block tidak melebihi batas',
     desc:'Total weight block tidak boleh melebihi 4.000.000 weight units. Non-witness data dihitung 4x lebih berat dari witness data.',
     val:'3.998.832 weight units < 4.000.000 limit — ok (99.97% penuh)'},
    {icon:'🪙',title:'6. Coinbase transaction valid',
     desc:'Reward yang diklaim miner tidak boleh melebihi block subsidy ditambah total fee semua transaksi. Miner yang overclaim akan ditolak seluruh jaringan.',
     val:'coinbase: 3.25437891 BTC = subsidy(3.125) + fees(0.12937891) — ok'},
    {icon:'🌳',title:'7. Merkle root cocok dengan semua transaksi',
     desc:'Node menghitung ulang merkle root dari semua txid dan membandingkan dengan yang ada di header. Satu transaksi yang dimanipulasi akan mengubah merkle root sepenuhnya.',
     val:'merkle root: 4a5e1e4b... — cocok dengan 3.847 transaksi ✓'},
    {icon:'✍️',title:'8. Semua signature transaksi valid',
     desc:'Untuk setiap input transaksi, node menjalankan script Bitcoin dan memverifikasi signature kriptografi. Bagian paling CPU-intensive, dijalankan paralel di semua core.',
     val:'3.847 tx, 12.341 input — semua signature valid ✓'},
  ];

  let step=-1;

  // Build checklist
  (function(){
    const el=g('b16-s162-checklist');if(!el) return;
    CHECKS.forEach((c,i)=>{
      const div=document.createElement('div');
      div.className='b16-s162-check';div.id=`s162c${i}`;
      div.innerHTML=`<div class="b16-s162-check-icon">${c.icon}</div>
        <div class="b16-s162-check-body">
          <div class="b16-s162-check-title">${c.title}</div>
          <div class="b16-s162-check-desc">${c.desc}</div>
          <div class="b16-s162-check-val" id="s162v${i}">${c.val}</div>
        </div>`;
      el.appendChild(div);
    });
  })();

  function updateVerdict(){
    const ind=g('b16-s162-ind'),verd=g('b16-s162-verdict'),btn=g('b16-s162-next');
    if(ind) ind.textContent=`${Math.max(0,step+1)} / ${CHECKS.length} pemeriksaan`;
    if(btn) btn.disabled=step>=CHECKS.length-1;
    if(verd){
      if(step<0){verd.className='b16-s162-verdict s162-idle';verd.textContent='Klik "Verifikasi Berikutnya" — node baru saja menerima block #870.142 dari peer.';}
      else if(step<CHECKS.length-1){verd.className='b16-s162-verdict s162-prog';verd.textContent=`Sedang memeriksa: ${CHECKS[step].title.replace(/^\d+\. /,'')}`;}
      else{verd.className='b16-s162-verdict s162-ok';verd.textContent='Semua 8 pemeriksaan lulus. Block #870.142 diterima dan ditambahkan ke chain lokal. Node meneruskan block ini ke peer lain.';}
    }
  }

  const nextBtn=g('b16-s162-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{
    if(step<CHECKS.length-1){
      step++;
      const c=g(`s162c${step}`);if(c) c.className='b16-s162-check s162-done';
      updateVerdict();
    }
  });
  const rstBtn=g('b16-s162-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    step=-1;
    CHECKS.forEach((_,i)=>{const c=g(`s162c${i}`);if(c) c.className='b16-s162-check';});
    updateVerdict();
  });
  updateVerdict();

  // RPC data
  const CMDS=[
    {id:'getblockcount',code:'bitcoin-cli getblockcount',hint:'Jumlah block saat ini',
     output:[['870142','s162-tnum']],
     fields:[{k:'output',v:'870142',d:'Integer langsung — jumlah block yang sudah divalidasi. Block genesis = 0, jadi total 870.143 block di chain.'}],
     note:'Command paling ringan untuk cek ketinggian chain. Output berupa integer biasa, bukan JSON. Tidak memerlukan sambungan wallet.'},
    {id:'getbestblockhash',code:'bitcoin-cli getbestblockhash',hint:'Hash block terbaru',
     output:[['"00000000000000000001a4b2c8d9e7f3a6b5c4d1e2f0a9b8c7d6e5f4a3b2c1d0"','s162-tstr']],
     fields:[{k:'output',v:'"00000...c1d0"',d:'Hash 256-bit dari block tip saat ini. Gunakan hash ini sebagai argumen getblock untuk melihat detail block.'}],
     note:'Hash block selalu dimulai dengan banyak angka nol karena proof-of-work. Semakin banyak nol di depan, semakin besar difficulty yang dibutuhkan.'},
    {id:'getblock',code:'bitcoin-cli getblock "00000...a4b" 1',hint:'Detail block lengkap',
     output:[
       ['{','s162-tgray'],
       ['  "hash":              ','s162-tblue'],['"00000000000000000001a4b..."','s162-tstr'],[',','s162-tgray'],
       ['  "confirmations":     ','s162-tblue'],['1','s162-tnum'],[',','s162-tgray'],
       ['  "height":            ','s162-tblue'],['870142','s162-tnum'],[',','s162-tgray'],
       ['  "merkleroot":        ','s162-tblue'],['"4a5e1e4baab89f3a2f143..."','s162-tstr'],[',','s162-tgray'],
       ['  "time":              ','s162-tblue'],['1717459200','s162-tnum'],[',','s162-tgray'],
       ['  "mediantime":        ','s162-tblue'],['1717456800','s162-tnum'],[',','s162-tgray'],
       ['  "nonce":             ','s162-tblue'],['3826969040','s162-tnum'],[',','s162-tgray'],
       ['  "bits":              ','s162-tblue'],['"17034219"','s162-tstr'],[',','s162-tgray'],
       ['  "difficulty":        ','s162-tblue'],['88171509232073.27','s162-tnum'],[',','s162-tgray'],
       ['  "nTx":               ','s162-tblue'],['3847','s162-tnum'],[',','s162-tgray'],
       ['  "weight":            ','s162-tblue'],['3998832','s162-tnum'],[',','s162-tgray'],
       ['  "previousblockhash": ','s162-tblue'],['"00000000000000000002f..."','s162-tstr'],[',','s162-tgray'],
       ['  "tx": [ ... ]        ','s162-tcm'],['  # 3847 txids','s162-tcm'],
       ['}','s162-tgray'],
     ],
     fields:[
       {k:'"confirmations"',v:'1',d:'Berapa block sudah dibangun di atas block ini. Block terbaru = 1. Bertambah setiap block baru ditemukan.'},
       {k:'"nTx"',v:'3847',d:'Jumlah transaksi dalam block, termasuk coinbase sebagai transaksi pertama.'},
       {k:'"weight"',v:'3998832',d:'Total weight dalam weight units. Maksimum 4.000.000. Block ini 99.97% penuh.'},
       {k:'"nonce"',v:'3826969040',d:'Angka yang diubah-ubah miner saat mining. Rentang 0-4.294.967.295.'},
       {k:'"bits"',v:'"17034219"',d:'Target difficulty dalam format compact. Dikonversi ke 256-bit untuk dibandingkan dengan hash block.'},
     ],
     note:'Verbosity 1 = semua txid tanpa detail transaksi. Verbosity 2 = detail penuh setiap transaksi (output sangat besar). Verbosity 0 = raw hex block.'},
    {id:'verifychain',code:'bitcoin-cli verifychain 3 6',hint:'Verifikasi integritas chain',
     output:[['true','s162-tbt']],
     fields:[
       {k:'param 1: checklevel',v:'3',d:'0=baca block, 1=undo data, 2=validasi, 3=disconnect & reconnect tip, 4=reconnect semua block.'},
       {k:'param 2: nblocks',v:'6',d:'Jumlah block yang diperiksa dari tip ke belakang. Nilai 0 = periksa semua (sangat lama).'},
       {k:'output: true',v:'true',d:'Semua pemeriksaan lulus. false berarti database korup, perlu reindex.'},
     ],
     note:'Berguna setelah crash atau pemadaman tiba-tiba untuk memastikan database node tidak korup. Checklevel 3 dengan 6 block adalah balance yang baik antara kecepatan dan ketepatan.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s162-cmd').forEach(b=>{
      b.classList.toggle('s162-act', b.dataset.id===cmdId);
    });
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;

    const body=g('b16-s162-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s162-tgreen">satoshi@node</span><span class="s162-tgray">:~$</span> <span class="s162-twhite"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([txt,cls])=>{const s=document.createElement('span');s.className=cls;s.textContent=txt;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([txt,cls])=>{
      buf.push([txt,cls]);
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||cls==='s162-tcm'||t.endsWith(',')) flush();
    });
    flush();

    const fe=g('b16-s162-fe'),fei=g('b16-s162-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s162-field';
        row.innerHTML=`<div class="b16-s162-fk">${f.k}</div><div class="b16-s162-fv">${f.v}</div><div class="b16-s162-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s162-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  // Build command buttons
  (function(){
    const el=g('b16-s162-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s162-cmd'+(i===0?' s162-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s162-cmd-code">${c.code}</div><div class="b16-s162-cmd-hint">${c.hint}</div><div class="b16-s162-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  // Tabs
  const t1=g('b16-s162-t1'),t2=g('b16-s162-t2');
  const p1=g('b16-s162-p1'),p2=g('b16-s162-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s162-tab s162-act';t2.className='b16-s162-tab';
    p1.className='b16-s162-pane show';p2.className='b16-s162-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s162-tab s162-act';t1.className='b16-s162-tab';
    p2.className='b16-s162-pane show';p1.className='b16-s162-pane';
    runRPC(currentCmd);
  });

  // Init
  runRPC('getblockcount');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.1 SIMULATION (RPC Terminal IBD)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let currentCmd='getblockchaininfo';

  const OUTPUTS={
    getblockchaininfo:{
      cmd:'bitcoin-cli getblockchaininfo',
      lines:[
        ['{','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "bestblockhash"','jkey'],[': ','jpunc'],['"00000000000000000001a4b..."','jstr'],[',','jpunc'],
        ['  "difficulty"','jkey'],[': ','jpunc'],['88171509232073.27','jnum'],[',','jpunc'],
        ['  "time"','jkey'],[': ','jpunc'],['1717459200','jnum'],[',','jpunc'],
        ['  "mediantime"','jkey'],[': ','jpunc'],['1717456800','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['0.9999982341','jnum'],[',','jpunc'],
        ['  "chainwork"','jkey'],[': ','jpunc'],['"00000000000000000000000000000000000000007b4e..."','jstr'],[',','jpunc'],
        ['  "pruned"','jkey'],[': ','jpunc'],['false','jbfalse'],[',','jpunc'],
        ['  "initialblockdownload"','jkey'],[': ','jpunc'],['false','jbfalse'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"chain"',val:'"main"',desc:'Jaringan yang dijalankan: main (mainnet), test (testnet), signet, atau regtest.',hl:false},
        {key:'"blocks"',val:'870142',desc:'Jumlah block yang sudah divalidasi penuh. Kalau sama dengan "headers", node sudah sync.',hl:true},
        {key:'"headers"',val:'870142',desc:'Jumlah header block yang diketahui. Lebih besar dari "blocks" saat masih IBD.',hl:true},
        {key:'"verificationprogress"',val:'0.9999982341',desc:'Progress sync dari 0 hingga 1. Nilai 1.0 berarti node sudah sepenuhnya sync dengan chain terbaru.',hl:true},
        {key:'"initialblockdownload"',val:'false',desc:'true = masih IBD, belum bisa diandalkan. false = sudah sync dan siap digunakan.',hl:true},
        {key:'"difficulty"',val:'88171509232073',desc:'Difficulty mining saat ini. Semakin tinggi, semakin banyak hash yang dibutuhkan per block.',hl:false},
        {key:'"mediantime"',val:'1717456800',desc:'Median Time Past (MTP) dari 11 block terakhir. Digunakan protokol untuk validasi timelock.',hl:false},
        {key:'"chainwork"',val:'"00000...7b4e"',desc:'Total proof-of-work yang terakumulasi dalam format hex. Ini yang menentukan chain mana yang terberat.',hl:false},
        {key:'"pruned"',val:'false',desc:'true = pruning mode aktif (block lama sudah dihapus). false = full archival node.',hl:false},
      ],
      note:'Command ini adalah cara paling cepat untuk mengecek apakah node sudah sync. Kalau "initialblockdownload" masih true, jangan gunakan node ini untuk memverifikasi pembayaran.',
    },
    getinfo:{
      cmd:'bitcoin-cli -getinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['"99.9998%"','jstr'],[',','jpunc'],
        ['  "timeoffset"','jkey'],[': ','jpunc'],['0','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['{','jpunc'],
        ['    "in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['    "out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['    "total"','jkey'],[': ','jpunc'],['18','jnum'],
        ['  }','jpunc'],[',','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"version"',val:'270000',desc:'Versi software client yang berjalan. 270000 = versi 27.0.0.',hl:false},
        {key:'"blocks"',val:'870142',desc:'Block terakhir yang divalidasi.',hl:true},
        {key:'"verificationprogress"',val:'"99.9998%"',desc:'Progress sync dalam format persentase yang mudah dibaca.',hl:true},
        {key:'"connections"',val:'{in:8, out:10}',desc:'Jumlah koneksi inbound dan outbound. Minimal 8 outbound untuk keamanan optimal.',hl:true},
        {key:'"timeoffset"',val:'0',desc:'Selisih waktu antara jam node dengan waktu jaringan. Idealnya 0 atau sangat kecil.',hl:false},
        {key:'"relayfee"',val:'0.00001000',desc:'Fee rate minimum yang mau di-relay oleh node ini (dalam BTC/kB). Transaksi di bawah ini tidak akan diteruskan.',hl:false},
      ],
      note:'Flag -getinfo (dengan tanda minus di depan) memberikan ringkasan yang lebih singkat dan mudah dibaca. Tidak perlu sambungan wallet untuk command ini.',
    },
    getpeerinfo_sync:{
      cmd:'bitcoin-cli getpeerinfo | grep -E \'"addr"|"synced_blocks"\'',
      lines:[
        ['# Peer 1','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"203.0.113.42:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 2','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"198.51.100.17:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870140','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 3 (Tor)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"mj3urq...onion:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 4 (tertinggal)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"192.0.2.88:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['869998','jnum'],
      ],
      fields:[
        {key:'"addr"',val:'"203.0.113.42:8333"',desc:'Alamat IP dan port peer. Port 8333 adalah port default Bitcoin mainnet. Alamat .onion berarti peer terhubung via Tor.',hl:false},
        {key:'"synced_blocks"',val:'870142',desc:'Block terakhir yang diketahui peer ini sudah divalidasi. Kalau sama dengan blocks node kamu, peer ini juga sudah sync penuh.',hl:true},
        {key:'Peer dengan 869998',val:'144 block di belakang',desc:'Node client secara otomatis memprioritaskan download dari peer yang lebih updated. Peer yang tertinggal jauh akan di-deprioritaskan.',hl:true},
      ],
      note:'Selama IBD, software client mendownload block secara paralel dari banyak peer sekaligus. Command ini berguna untuk memastikan kamu terhubung ke peer yang sudah sync.',
    },
    getnetworkinfo:{
      cmd:'bitcoin-cli getnetworkinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "subversion"','jkey'],[': ','jpunc'],['"\/Satoshi:27.0.0\/"','jstr'],[',','jpunc'],
        ['  "protocolversion"','jkey'],[': ','jpunc'],['70016','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['18','jnum'],[',','jpunc'],
        ['  "connections_in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['  "connections_out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['  "networkactive"','jkey'],[': ','jpunc'],['true','jbtrue'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],[',','jpunc'],
        ['  "localaddresses"','jkey'],[': ','jpunc'],['[','jpunc'],
        ['    { "address": "203.0.113.100", "port": 8333, "score": 4 }','jpunc'],
        ['  ]','jpunc'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"subversion"',val:'"/Satoshi:27.0.0/"',desc:'User agent yang dikirim ke peer lain saat handshake. Ini yang peer lain lihat sebagai "identitas" software kamu.',hl:false},
        {key:'"protocolversion"',val:'70016',desc:'Versi protokol P2P Bitcoin. Menentukan fitur apa yang bisa dikomunikasikan antar node.',hl:true},
        {key:'"connections_in"',val:'8',desc:'Peer yang aktif konek ke node kamu. Hanya mungkin kalau port 8333 terbuka dan bisa diakses dari internet.',hl:true},
        {key:'"connections_out"',val:'10',desc:'Peer yang node kamu konek ke mereka. Outbound connection lebih aman karena kamu yang memilih peer-nya.',hl:true},
        {key:'"networkactive"',val:'true',desc:'false berarti node dalam mode offline — tidak menerima atau mengirim data ke peer manapun.',hl:false},
        {key:'"localaddresses"',val:'"203.0.113.100:8333"',desc:'IP address publik yang diiklankan ke jaringan. Kalau kosong, node tidak dapat menerima koneksi inbound.',hl:false},
      ],
      note:'Node dengan connections_in > 0 bisa diakses dari internet dan membantu jaringan sebagai relay. Node dengan hanya outbound connection tetap bisa memverifikasi transaksi dengan aman.',
    },
  };

  function renderTerminal(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const body=g('b16-s161-body');if(!body) return;
    body.innerHTML='';

    // Prompt
    const prompt=document.createElement('div');
    prompt.className='b16-s161-prompt';
    prompt.innerHTML=`<span class="b16-s161-prompt-user">satoshi@node</span>:~$ <span class="b16-s161-cmd-line">${data.cmd}</span>`;
    body.appendChild(prompt);

    // JSON output
    const out=document.createElement('div');
    out.className='b16-s161-output';

    // Group tokens into lines
    let lineTokens=[];
    const flushLine=()=>{
      if(!lineTokens.length) return;
      const lineEl=document.createElement('div');
      lineEl.className='b16-s161-json-line';
      lineTokens.forEach(([txt,cls])=>{
        const span=document.createElement('span');
        span.className=`b16-s161-${cls}`;
        span.textContent=txt;
        lineEl.appendChild(span);
      });
      out.appendChild(lineEl);
      lineTokens=[];
    };

    data.lines.forEach(([txt,cls])=>{
      if(txt===''&&cls==='jpunc'){flushLine();out.appendChild(document.createElement('br'));return;}
      lineTokens.push([txt,cls]);
      // End line after: standalone { } [ ] , or comment
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||t==='['||t===']'||cls==='jcomment'){flushLine();}
    });
    flushLine();
    body.appendChild(out);
  }

  function renderExplain(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const el=g('b16-s161-explain');
    const fields=g('b16-s161-fields');
    const note=g('b16-s161-note');
    if(el) el.style.display='flex';
    if(note){note.style.display='block';note.textContent=data.note;}
    if(!fields) return;
    fields.innerHTML='';
    data.fields.forEach(f=>{
      const row=document.createElement('div');
      row.className='b16-s161-field'+(f.hl?' s161-hl':'');
      row.innerHTML=`
        <div class="b16-s161-field-key">${f.key}</div>
        <div class="b16-s161-field-desc">${f.desc}</div>
        <div class="b16-s161-field-val">${f.val}</div>`;
      fields.appendChild(row);
    });
  }

  function run(){
    renderTerminal(currentCmd);
    renderExplain(currentCmd);
  }

  // Command buttons
  document.querySelectorAll('.b16-s161-cmd-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b16-s161-cmd-btn').forEach(b=>b.classList.remove('s161-act'));
      btn.classList.add('s161-act');
      currentCmd=btn.dataset.cmd;
    });
  });

  const runBtn=g('b16-s161-run');
  if(runBtn) runBtn.addEventListener('click',run);

  // Init
  run();
})();

