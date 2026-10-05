// ============================================================
// PAGE 15 · BAB 12 · NAVIGATION
// ============================================================
function showSectionInContentB12(sectionId, sbId) {
  document.querySelectorAll('#page-bab12 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab12 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab12-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 15 · BAB 12 · TOPBAR
// ============================================================
document.getElementById('back-home-b12').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b12').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 15 · BAB 12 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab12').addEventListener('click', () => navigate('page-bab12'));

// ============================================================
// PAGE 15 · BAB 12 · SIDEBAR EVENTS (12.1 - 12.6)
// ============================================================
document.getElementById('sb-12-1').addEventListener('click', () => showSectionInContentB12('section-12-1', 'sb-12-1'));
document.getElementById('sb-12-2').addEventListener('click', () => showSectionInContentB12('section-12-2', 'sb-12-2'));
document.getElementById('sb-12-3').addEventListener('click', () => showSectionInContentB12('section-12-3', 'sb-12-3'));
document.getElementById('sb-12-4').addEventListener('click', () => showSectionInContentB12('section-12-4', 'sb-12-4'));
document.getElementById('sb-12-5').addEventListener('click', () => showSectionInContentB12('section-12-5', 'sb-12-5'));
document.getElementById('sb-12-6').addEventListener('click', () => showSectionInContentB12('section-12-6', 'sb-12-6'));

// ============================================================
// PAGE 15 · BAB 12 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab12 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB12(target, sb);
  });
});

// ============================================================
// PAGE 15 · BAB 12 · 12.6 SIMULATION (Threat Model)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const PROFILES=[
    {
      icon:'👤',title:'Pengguna Kasual',sub:'Privasi dasar, tidak mau ribet',
      threatLabel:'Level ancaman: rendah hingga sedang',threatPct:25,threatColor:'#0F6E56',
      recs:[
        {level:'must',badge:'Wajib',text:'Gunakan HD wallet — address baru otomatis tiap transaksi. Hampir semua wallet modern sudah melakukan ini.'},
        {level:'must',badge:'Wajib',text:'Jangan posting address Bitcoin di media sosial publik yang terhubung ke identitas aslimu.'},
        {level:'should',badge:'Disarankan',text:'Gunakan Lightning untuk pembayaran kecil sehari-hari — lebih privat dari on-chain.'},
        {level:'nice',badge:'Opsional',text:'Pisahkan UTXO dari exchange (KYC) dan UTXO dari sumber lain — jangan gabungkan dalam satu transaksi.'},
      ],
      avoids:['Menggunakan address yang sama lebih dari sekali','Memposting screenshot transaksi ke publik'],
    },
    {
      icon:'🏪',title:'Pedagang / Merchant',sub:'Menerima pembayaran dari banyak pelanggan',
      threatLabel:'Level ancaman: sedang — pelanggan bisa melihat saldo toko',threatPct:50,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Wajib',text:'Gunakan BTCPay Server atau wallet yang mendukung Payjoin — sembunyikan pola penerimaan dari pelanggan.'},
        {level:'must',badge:'Wajib',text:'Generate address baru untuk setiap invoice — jangan pakai satu address untuk semua pelanggan.'},
        {level:'should',badge:'Disarankan',text:'Terima pembayaran Lightning via BOLT 12 Offers — lebih privat dari invoice biasa yang bisa dikaitkan.'},
        {level:'should',badge:'Disarankan',text:'Pisahkan wallet operasional dari wallet penyimpanan jangka panjang.'},
        {level:'nice',badge:'Opsional',text:'Lakukan UTXO consolidation saat fee rendah, tapi hati-hati dengan implikasi privasi dari penggabungan UTXO.'},
      ],
      avoids:['Menggunakan satu address untuk semua pelanggan','Memposting saldo wallet secara publik','Menggabungkan UTXO dari pelanggan berbeda tanpa pertimbangan'],
    },
    {
      icon:'📈',title:'Investor Jangka Panjang',sub:'Menyimpan Bitcoin dalam jumlah signifikan',
      threatLabel:'Level ancaman: sedang hingga tinggi — target pencurian atau pemerasan',threatPct:65,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Wajib',text:'Jangan pernah ungkapkan berapa banyak Bitcoin yang kamu miliki kepada siapapun yang tidak perlu tahu.'},
        {level:'must',badge:'Wajib',text:'Gunakan hardware wallet terpisah dari aktivitas sehari-hari — cold storage untuk hodling jangka panjang.'},
        {level:'must',badge:'Wajib',text:'Beli Bitcoin dari sumber berbeda untuk menghindari profil pembelian yang mudah dilacak.'},
        {level:'should',badge:'Disarankan',text:'Pertimbangkan CoinJoin sebelum memindahkan ke cold storage — pisahkan riwayat on-chain dari identitasmu.'},
        {level:'nice',badge:'Opsional',text:'Gunakan node Bitcoin sendiri saat bertransaksi — jangan bergantung pada node publik yang bisa memantau IP-mu.'},
      ],
      avoids:['Memamerkan kepemilikan Bitcoin di publik','Menyimpan semua Bitcoin di satu wallet','Menggunakan exchange yang tidak perlu untuk setiap transaksi'],
    },
    {
      icon:'🛡️',title:'Privasi Tinggi',sub:'Butuh perlindungan kuat dari pengawasan',
      threatLabel:'Level ancaman: tinggi — pengawasan negara atau aktor berbahaya',threatPct:90,threatColor:'#A32D2D',
      recs:[
        {level:'must',badge:'Wajib',text:'Dapatkan Bitcoin tanpa KYC — peer-to-peer exchange, mining, atau layanan yang tidak meminta identitas.'},
        {level:'must',badge:'Wajib',text:'Jalankan full node Bitcoin sendiri dan hanya broadcast transaksi melalui node sendiri atau via Tor.'},
        {level:'must',badge:'Wajib',text:'Gunakan CoinJoin sebelum setiap pengeluaran signifikan — putus rantai pelacakan on-chain.'},
        {level:'must',badge:'Wajib',text:'Gunakan Silent Payments atau BOLT 12 untuk menerima pembayaran tanpa mengekspos address.'},
        {level:'should',badge:'Disarankan',text:'Pisahkan identitas digital yang berbeda secara ketat — jangan campur wallet yang berbeda tujuan.'},
      ],
      avoids:['KYC di exchange manapun jika bisa dihindari','Menggunakan wallet yang terhubung ke server pihak ketiga','Bertransaksi dengan IP asli tanpa Tor atau VPN','Menggabungkan UTXO dari sumber berbeda'],
    },
  ];

  function renderDetail(i){
    const p=PROFILES[i];
    const el=g('b12-s126-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b12-s126-detail-head">
        <div class="b12-s126-detail-icon">${p.icon}</div>
        <div>
          <div class="b12-s126-detail-title">${p.title}</div>
          <div class="b12-s126-detail-sub">${p.sub}</div>
        </div>
      </div>
      <div class="b12-s126-detail-body">
        <div class="b12-s126-threat">
          <div class="b12-s126-threat-label">${p.threatLabel}</div>
          <div class="b12-s126-threat-bar"><div class="b12-s126-threat-fill" style="width:${p.threatPct}%;background:${p.threatColor};"></div></div>
        </div>
        <div class="b12-s126-recs">
          <div class="b12-s126-recs-label">Rekomendasi:</div>
          ${p.recs.map(r=>`
            <div class="b12-s126-rec ${r.level}">
              <span class="b12-s126-rec-badge">${r.badge}</span>
              <div class="b12-s126-rec-text">${r.text}</div>
            </div>`).join('')}
        </div>
        <div class="b12-s126-avoid">
          <div class="b12-s126-avoid-label">Hindari:</div>
          ${p.avoids.map(a=>`<div class="b12-s126-avoid-item">✗ ${a}</div>`).join('')}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b12-s126-profile').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b12-s126-profile').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      renderDetail(parseInt(el.dataset.profile));
    });
  });

  renderDetail(0);
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.5 SIMULATION (Lightning Privacy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  const OC_IDS=['b12-s125-oc1','b12-s125-oc2','b12-s125-oc3','b12-s125-oc4','b12-s125-oc5',
                'b12-s125-oc6','b12-s125-oc7','b12-s125-oc8','b12-s125-oc9','b12-s125-oc10'];

  async function runSim(){
    running=true;
    const rb=g('b12-s125-run1'); if(rb) rb.disabled=true;
    const note=g('b12-s125-note1');

    for(let i=0;i<OC_IDS.length;i++){
      const el=g(OC_IDS[i]); if(el) el.classList.add('visible');
      if(i===0){const lnO=g('b12-s125-ln-open');if(lnO) lnO.classList.add('visible');}
      if(i===4){const lnP=g('b12-s125-ln-p1');if(lnP) lnP.classList.add('visible');}
      if(note) note.textContent=`Pembayaran #${i+1} dikirim... On-chain: terlihat publik. Lightning: tersembunyi dalam channel.`;
      if(note) note.className='b12-s125-note s125-run';
      await wait(400);
    }

    await wait(300);
    const lnC=g('b12-s125-ln-close'); if(lnC) lnC.classList.add('visible');
    await wait(300);
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='grid';
    if(note){note.textContent='Selesai! On-chain: 10 transaksi terlihat publik. Lightning: hanya channel open dan close yang tercatat di blockchain, 10 pembayaran di dalamnya tidak terlihat sama sekali.';note.className='b12-s125-note s125-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  const runBtn=g('b12-s125-run1'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) runSim();});
  const rstBtn=g('b12-s125-rst1');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(running) return;
    [...OC_IDS,'b12-s125-ln-open','b12-s125-ln-p1','b12-s125-ln-close'].forEach(id=>{
      const el=g(id); if(el) el.classList.remove('visible');
    });
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='none';
    const rb=g('b12-s125-run1'); if(rb) rb.disabled=false;
    const note=g('b12-s125-note1');
    if(note){note.textContent='Klik "Simulasikan 10 Pembayaran" untuk melihat perbedaan visibilitas antara pembayaran on-chain dan Lightning.';note.className='b12-s125-note s125-idle';}
  });

  const t1=g('b12-s125-t1'), t2=g('b12-s125-t2');
  const p1=g('b12-s125-p1'), p2=g('b12-s125-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b12-s125-tab s125-act'; t2.className='b12-s125-tab';
    p1.className='b12-s125-pane show'; p2.className='b12-s125-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b12-s125-tab s125-act'; t1.className='b12-s125-tab';
    p2.className='b12-s125-pane show'; p1.className='b12-s125-pane';
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.4 SIMULATION (Silent Payments)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  async function run(){
    running=true;
    const rb=g('b12-s124-run'); if(rb) rb.disabled=true;
    const note=g('b12-s124-note');

    if(note){note.textContent='Alice menghitung address unik dari alamat statis menggunakan kunci publiknya...';note.className='b12-s124-note s124-run';}
    await wait(700);
    const ra=g('b12-s124-res-alice'); if(ra) ra.classList.add('show');

    if(note) note.textContent='Bob menghitung address unik yang berbeda dari kunci publik yang sama...';
    await wait(700);
    const rb2=g('b12-s124-res-bob'); if(rb2) rb2.classList.add('show');

    if(note) note.textContent='Carol menghasilkan address unik ketiga, semua berbeda walau tujuannya sama...';
    await wait(700);
    const rc=g('b12-s124-res-carol'); if(rc) rc.classList.add('show');

    await wait(500);
    if(note) note.textContent='Ketiga transaksi masuk ke blockchain. Analis melihat tiga address berbeda...';
    const bc=g('b12-s124-blockchain'); if(bc) bc.classList.add('show');
    await wait(400);
    ['b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*300);
    });
    await wait(1200);
    const ln=g('b12-s124-link-note'); if(ln) ln.classList.add('show');
    await wait(600);

    if(note) note.textContent='Penerima men-scan blockchain dengan kunci privatnya untuk menemukan pembayaran...';
    const sc=g('b12-s124-scan'); if(sc) sc.classList.add('show');
    await wait(400);
    ['b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*400);
    });
    await wait(1400);

    if(note){note.textContent='Selesai! Tiga pengirim, satu alamat statis, tiga address on-chain yang tidak bisa dihubungkan. Hanya penerima yang tahu ketiganya adalah miliknya.';note.className='b12-s124-note s124-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  function reset(){
    if(running) return;
    ['b12-s124-res-alice','b12-s124-res-bob','b12-s124-res-carol',
     'b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3','b12-s124-link-note',
     'b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3',
     'b12-s124-blockchain','b12-s124-scan'].forEach(id=>{
      const el=g(id); if(el) el.classList.remove('show');
    });
    const rb=g('b12-s124-run'); if(rb) rb.disabled=false;
    const note=g('b12-s124-note');
    if(note){note.textContent='Klik "Simulasikan Pengiriman" untuk melihat bagaimana tiga pengirim yang berbeda menghasilkan address on-chain yang berbeda-beda dari satu alamat statis yang sama.';note.className='b12-s124-note s124-idle';}
  }

  const runBtn=g('b12-s124-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) run();});
  const rstBtn=g('b12-s124-rst'); if(rstBtn) rstBtn.addEventListener('click',reset);
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.2 SIMULATION (CoinJoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const t1=g('b12-s122-t1'), t2=g('b12-s122-t2');
  const p1=g('b12-s122-p1'), p2=g('b12-s122-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b12-s122-tab s122-act'; t2.className='b12-s122-tab';
    p1.className='b12-s122-pane show'; p2.className='b12-s122-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b12-s122-tab s122-act'; t1.className='b12-s122-tab';
    p2.className='b12-s122-pane show'; p1.className='b12-s122-pane';
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.3 SIMULATION (Payjoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let applied=false;

  const applyBtn=g('b12-s123-apply');
  if(applyBtn) applyBtn.addEventListener('click',()=>{
    if(applied) return; applied=true;
    const an=g('b12-s123-a-normal'); if(an) an.style.display='flex';
    const ap=g('b12-s123-a-payjoin'); if(ap) ap.style.display='flex';
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='grid';
    const note=g('b12-s123-note');
    if(note){note.textContent='Payjoin terlihat identik dengan transaksi biasa dari luar. Analis tidak bisa membedakan keduanya hanya dari melihat blockchain, itulah yang membuatnya lebih kuat dari CoinJoin yang polanya bisa dikenali.';note.className='b12-s123-note s123-info';}
  });

  const rstBtn=g('b12-s123-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    applied=false;
    ['b12-s123-a-normal','b12-s123-a-payjoin'].forEach(id=>{const el=g(id);if(el) el.style.display='none';});
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='none';
    const note=g('b12-s123-note');
    if(note){note.textContent='Klik "Terapkan Heuristik Common Input" untuk melihat mengapa analis mendapat kesimpulan yang berbeda dari dua transaksi yang terlihat hampir sama.';note.className='b12-s123-note s123-idle';}
  });
})();

// ============================================================
// PAGE 15 · BAB 12 · 12.1 SIMULATION (Blockchain Analysis)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let gW=0, gH=0, curH=1;

  const HDATA={
    1:{
      nodes:[
        {id:'A1',label:'Addr A1\n0.8 BTC',x:0.10,y:0.20,cls:'addr'},
        {id:'A2',label:'Addr A2\n0.5 BTC',x:0.10,y:0.65,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'B1',label:'Addr B\n1.2 BTC',x:0.75,y:0.25,cls:'addr'},
        {id:'C1',label:'Kembalian\n0.08 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'A1',to:'TX',color:'rgba(83,74,183,0.5)'},{from:'A2',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'B1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'C1',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['A1','A2'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristik terdeteksi',text:'A1 dan A2 digunakan bersama sebagai input dalam satu transaksi.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Dengan sangat tinggi kemungkinan, A1 dan A2 dimiliki oleh orang yang sama. Analis menggabungkan keduanya sebagai satu entitas.'},
        {icon:'📊',label:'Dampak privasi',text:'Kalau salah satu address pernah teridentifikasi misalnya dari exchange, address lainnya juga ikut teridentifikasi.'},
      ],
      note:'Common Input Ownership adalah heuristik paling kuat dalam analisis blockchain. Menggunakannya berarti kamu secara tidak sengaja mengkonfirmasi bahwa semua UTXO yang kamu gabungkan adalah milikmu.',
    },
    2:{
      nodes:[
        {id:'S1',label:'Pengirim\n1.0 BTC',x:0.10,y:0.42,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'R1',label:'Penerima\n0.9 BTC',x:0.75,y:0.20,cls:'addr'},
        {id:'CH',label:'Kembalian\n0.09 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'S1',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'R1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'CH',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['CH'],linked:['S1'],
      findings:[
        {icon:'🔍',label:'Heuristik terdeteksi',text:'Output 0.9 BTC adalah angka bulat, kemungkinan adalah pembayaran yang disengaja. Output 0.09 BTC adalah angka tidak bulat, kemungkinan adalah kembalian.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Output 0.09 BTC kemungkinan besar dikembalikan ke pengirim. Analis menandai address kembalian sebagai milik pengirim yang sama.'},
        {icon:'📊',label:'Dampak privasi',text:'Saldo sebenarnya pengirim bisa diestimasi. Transaksi berikutnya dari address kembalian akan terus terlacak.'},
      ],
      note:'Change output detection bekerja karena pola nilai yang bisa ditebak. Salah satu cara mitigasi adalah menggunakan CoinJoin yang menyamakan nilai output sehingga analis tidak bisa membedakan mana pembayaran dan mana kembalian.',
    },
    3:{
      nodes:[
        {id:'TX1',label:'TX 1\nJan',x:0.18,y:0.25,cls:'tx'},
        {id:'TX2',label:'TX 2\nMar',x:0.18,y:0.65,cls:'tx'},
        {id:'ADDR',label:'Addr X\n(reused)',x:0.50,y:0.42,cls:'addr'},
        {id:'TX3',label:'TX 3\nJun',x:0.82,y:0.25,cls:'tx'},
        {id:'TX4',label:'TX 4\nAug',x:0.82,y:0.65,cls:'tx'},
      ],
      edges:[
        {from:'TX1',to:'ADDR',color:'rgba(83,74,183,0.4)'},{from:'TX2',to:'ADDR',color:'rgba(83,74,183,0.4)'},
        {from:'ADDR',to:'TX3',color:'rgba(83,74,183,0.4)'},{from:'ADDR',to:'TX4',color:'rgba(83,74,183,0.4)'},
      ],
      flagged:['ADDR'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristik terdeteksi',text:'Address X muncul dalam 4 transaksi berbeda sebagai penerima maupun pengirim.'},
        {icon:'⚠️',label:'Kesimpulan analis',text:'Semua transaksi yang melibatkan Address X terhubung. Total saldo masuk dan keluar bisa dihitung secara akurat.'},
        {icon:'📊',label:'Dampak privasi',text:'Kalau salah satu dari 4 transaksi ini bisa dihubungkan ke identitas nyata, seluruh riwayat keuangan address ini terekspos.'},
      ],
      note:'Address reuse adalah kesalahan privasi paling mudah dihindari. Wallet modern (HD wallet) menghasilkan address baru secara otomatis untuk setiap transaksi. Tidak ada alasan untuk menggunakan address yang sama lebih dari sekali.',
    },
  };

  function getPos(node){return {x:node.x*gW,y:node.y*gH};}

  function render(h){
    const gr=g('b12-s121-graph'); if(!gr) return;
    gW=gr.getBoundingClientRect().width||300;
    gH=gr.getBoundingClientRect().height||240;
    gr.querySelectorAll('.b12-s121-node').forEach(el=>el.remove());
    const svg=g('b12-s121-svg'); if(svg) svg.innerHTML='';

    const hd=HDATA[h];

    hd.edges.forEach(e=>{
      const fn=hd.nodes.find(n=>n.id===e.from);
      const tn=hd.nodes.find(n=>n.id===e.to);
      if(!fn||!tn) return;
      const p1=getPos(fn), p2=getPos(tn);
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',p1.x);line.setAttribute('y1',p1.y);
      line.setAttribute('x2',p2.x);line.setAttribute('y2',p2.y);
      line.setAttribute('stroke',e.color);line.setAttribute('stroke-width','1.5');
      if(e.dash) line.setAttribute('stroke-dasharray','4,3');
      if(svg) svg.appendChild(line);
    });

    hd.nodes.forEach(n=>{
      const pos=getPos(n);
      const el=document.createElement('div');
      el.className='b12-s121-node';
      el.style.left=(pos.x-21)+'px';
      el.style.top=(pos.y-21)+'px';
      let cls=n.cls;
      if(hd.flagged.includes(n.id)) cls='flagged';
      else if(hd.linked.includes(n.id)) cls='linked';
      el.innerHTML=`<div class="b12-s121-node-circle ${cls}">${n.id}</div>
        <div class="b12-s121-node-label">${n.label.replace('\n','<br>')}</div>`;
      gr.appendChild(el);
    });

    const fd=g('b12-s121-findings');
    if(fd) fd.innerHTML=hd.findings.map(f=>`
      <div class="b12-s121-finding">
        <div class="b12-s121-finding-icon">${f.icon}</div>
        <div class="b12-s121-finding-text">
          <div class="b12-s121-finding-label">${f.label}</div>${f.text}
        </div>
      </div>`).join('');

    const note=g('b12-s121-note');
    if(note){note.textContent=hd.note;note.className='b12-s121-note s121-warn';}
  }

  function setH(h){
    curH=h;
    ['b12-s121-h1','b12-s121-h2','b12-s121-h3'].forEach((id,i)=>{
      const el=g(id); if(el) el.className='b12-s121-heur-btn'+(i+1===h?' s121-act':'');
    });
    render(h);
  }

  const h1=g('b12-s121-h1'),h2=g('b12-s121-h2'),h3=g('b12-s121-h3');
  if(h1) h1.addEventListener('click',()=>setH(1));
  if(h2) h2.addEventListener('click',()=>setH(2));
  if(h3) h3.addEventListener('click',()=>setH(3));

  setH(1);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>render(curH))).observe(g('b12-s121-graph')||document.body);
  }
})();

