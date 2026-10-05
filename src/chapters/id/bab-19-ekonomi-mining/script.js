// ============================================================
function showSectionInContentB19(sectionId, sbId) {
  document.querySelectorAll('#page-bab19 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab19 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab19-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 22 · BAB 19 · TOPBAR
// ============================================================
document.getElementById('back-home-b19').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b19').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 22 · BAB 19 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab19').addEventListener('click', () => navigate('page-bab19'));

// ============================================================
// PAGE 22 · BAB 19 · SIDEBAR EVENTS (19.1 - 19.6)
// ============================================================
document.getElementById('sb-19-1').addEventListener('click', () => showSectionInContentB19('section-19-1', 'sb-19-1'));
document.getElementById('sb-19-2').addEventListener('click', () => showSectionInContentB19('section-19-2', 'sb-19-2'));
document.getElementById('sb-19-3').addEventListener('click', () => showSectionInContentB19('section-19-3', 'sb-19-3'));
document.getElementById('sb-19-4').addEventListener('click', () => showSectionInContentB19('section-19-4', 'sb-19-4'));
document.getElementById('sb-19-5').addEventListener('click', () => showSectionInContentB19('section-19-5', 'sb-19-5'));
document.getElementById('sb-19-6').addEventListener('click', () => showSectionInContentB19('section-19-6', 'sb-19-6'));

// ============================================================
// PAGE 22 · BAB 19 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab19 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB19(target, sb);
  });
});

// ============================================================
// PAGE 22 · BAB 19 · 19.6 SIMULATION (Mining Ecosystem)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // ASIC data
  const ASICS=[
    {gen:'2013 — Avalon/Butterfly',jth:1200,color:'#A32D2D'},
    {gen:'2014 — Antminer S3',     jth:830, color:'#854F0B'},
    {gen:'2015 — Antminer S5',     jth:510, color:'#854F0B'},
    {gen:'2016 — Antminer S9',     jth:98,  color:'#534AB7'},
    {gen:'2018 — Antminer S15',    jth:57,  color:'#534AB7'},
    {gen:'2020 — Antminer S19',    jth:34,  color:'#0F6E56'},
    {gen:'2022 — Antminer S19 XP', jth:21,  color:'#0F6E56'},
    {gen:'2024 — Antminer S21 Pro',jth:15,  color:'#0F6E56'},
  ];
  (function(){
    const el=g('b19-s196-asic-rows');if(!el) return;
    ASICS.forEach(a=>{
      const pct=Math.max(2,Math.round((a.jth/1200)*100));
      const row=document.createElement('div');row.className='b19-s196-asic-row';
      row.innerHTML=`<div class="b19-s196-asic-gen">${a.gen}</div>
        <div class="b19-s196-asic-track">
          <div class="b19-s196-asic-bar" style="width:${pct}%;background:${a.color};">
            <div class="b19-s196-asic-bar-txt">${a.jth} J/TH</div>
          </div>
        </div>
        <div class="b19-s196-asic-val">${a.jth} J/TH</div>`;
      el.appendChild(row);
    });
  })();

  // Geography data
  const GEO={
    before:[
      {country:'China',          pct:65,color:'#A32D2D'},
      {country:'Amerika Serikat',pct:7, color:'#534AB7'},
      {country:'Rusia',          pct:7, color:'#534AB7'},
      {country:'Kazakhstan',     pct:6, color:'#854F0B'},
      {country:'Malaysia',       pct:4, color:'#854F0B'},
      {country:'Lainnya',        pct:11,color:'#52524C'},
    ],
    after:[
      {country:'Amerika Serikat',pct:38,color:'#0F6E56'},
      {country:'Kazakhstan',     pct:14,color:'#534AB7'},
      {country:'Rusia',          pct:11,color:'#534AB7'},
      {country:'Canada',         pct:7, color:'#534AB7'},
      {country:'Jerman',         pct:4, color:'#854F0B'},
      {country:'Lainnya',        pct:26,color:'#52524C'},
    ],
  };
  const GEO_NOTES={
    before:'Sebelum China ban (Mei 2021): China mendominasi ~65% hashrate global, sebagian besar karena hydropower murah di Sichuan dan Yunnan. Konsentrasi tinggi di satu negara ini menjadi perhatian dari perspektif ketahanan jaringan.',
    after:'Sesudah China ban (2021) dan migrasi: hashrate tersebar ke lebih banyak negara. Amerika Serikat menjadi negara dengan hashrate terbesar. Distribusi yang lebih luas meningkatkan ketahanan terhadap regulasi lokal manapun.',
  };

  function renderGeo(period){
    document.querySelectorAll('.b19-s196-geo-btn').forEach(b=>b.classList.toggle('s196-geo-act',b.dataset.period===period));
    const el=g('b19-s196-geo-rows');if(!el) return;
    el.innerHTML='';
    GEO[period].forEach(d=>{
      const row=document.createElement('div');row.className='b19-s196-geo-row';
      row.innerHTML=`<div class="b19-s196-geo-country">${d.country}</div>
        <div class="b19-s196-geo-track">
          <div class="b19-s196-geo-bar" style="width:${d.pct}%;background:${d.color};">
            <div class="b19-s196-geo-bar-txt">${d.pct>8?d.pct+'%':''}</div>
          </div>
        </div>
        <div class="b19-s196-geo-val">${d.pct}%</div>`;
      el.appendChild(row);
    });
    const note=g('b19-s196-geo-note');if(note) note.textContent=GEO_NOTES[period];
  }
  document.querySelectorAll('.b19-s196-geo-btn').forEach(btn=>{
    btn.addEventListener('click',()=>renderGeo(btn.dataset.period));
  });
  renderGeo('after');

  // Tabs
  const tabs=['b19-s196-t1','b19-s196-t2','b19-s196-t3'];
  const panes=['b19-s196-p1','b19-s196-p2','b19-s196-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b19-s196-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b19-s196-pane';});
      const el=g(tid);if(el) el.className='b19-s196-tab s196-act';
      const pe=g(panes[i]);if(pe) pe.className='b19-s196-pane show';
    });
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.5 SIMULATION (Selfish Mining Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const STEPS=[
    {cls:'s195-d-idle',  label:'Kondisi Awal',
     title:'Semua miner bekerja di block yang sama',
     text:'Jaringan dan miner selfish sama-sama bekerja di atas block #100. Miner selfish punya 35% hashrate, di atas threshold ~33%.',
     analogy:'Seperti lomba lari: semua pelari mulai dari garis yang sama.',
     chains:[
       {name:'Jaringan (honest)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'}]},
       {name:'Miner Selfish',   cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'}]},
     ]},
    {cls:'s195-d-selfish',label:'Langkah 1',
     title:'Miner selfish temukan #101 — tapi disembunyikan',
     text:'Miner selfish menemukan block #101 terlebih dahulu. Alih-alih menyebarkannya, ia menyimpannya dan terus bekerja diam-diam di atas block tersembunyi ini.',
     analogy:'Seperti pelari yang diam-diam berlari di jalur tersembunyi sementara pesaing masih di jalur biasa.',
     chains:[
       {name:'Jaringan (masih di #100)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'}]},
       {name:'Miner Selfish',          cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-selfish',label:'Langkah 2',
     title:'Miner selfish temukan #102 — jaringan belum tahu #101',
     text:'Miner selfish kini punya dua block tersembunyi. Jaringan masih bekerja di #100. Keunggulan dua block adalah kondisi ideal untuk serangan.',
     analogy:'Pelari tersembunyi sudah maju dua tikungan. Pesaing belum tahu.',
     chains:[
       {name:'Jaringan',     cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'},{t:'?',c:'s195-b-network'}]},
       {name:'Miner Selfish',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'},{t:'#102',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-result',label:'Langkah 3',
     title:'Jaringan hampir temukan #101 — miner selfish publikasikan chain-nya',
     text:'Saat jaringan mendekati block #101, miner selfish langsung menyebarkan chain tersembunyinya. Chain selfish lebih panjang — semua node beralih. Pekerjaan jaringan di-orphan.',
     analogy:'Pelari curang muncul di depan garis finish saat pesaing hampir tiba.',
     chains:[
       {name:'Chain jaringan (orphaned!)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-orphan'}]},
       {name:'Chain pemenang (selfish)', cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
    {cls:'s195-d-result',label:'Hasil',
     title:'Miner selfish dapat 2 reward, jaringan kehilangan 1 reward',
     text:'Pekerjaan jaringan di #101 hangus. Miner selfish mendapat reward untuk #101 dan #102 meski hanya punya 35% hashrate — secara proporsional lebih besar dari haknya.',
     analogy:'Pelari curang menang dua hadiah. Pelari jujur tidak mendapat apa-apa meski sudah bekerja keras.',
     chains:[
       {name:'Hasil akhir — chain selfish menang',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
  ];

  function renderStep(step){
    document.querySelectorAll('.b19-s195-step-btn').forEach(b=>b.classList.toggle('s195-act',parseInt(b.dataset.step)===step));
    const s=STEPS[step];
    const chainsEl=g('b19-s195-chains');const detailEl=g('b19-s195-detail');if(!chainsEl||!detailEl) return;
    chainsEl.innerHTML='';
    s.chains.forEach(chain=>{
      const div=document.createElement('div');div.className='b19-s195-chain';
      div.innerHTML=`<div class="b19-s195-chain-name ${chain.cls}">${chain.name}</div>`;
      const bd=document.createElement('div');bd.className='b19-s195-blocks';
      chain.blocks.forEach((b,i)=>{
        if(i>0){const a=document.createElement('div');a.className='b19-s195-block-arrow';a.textContent='→';bd.appendChild(a);}
        const blk=document.createElement('div');blk.className=`b19-s195-block ${b.c}`;blk.textContent=b.t;bd.appendChild(blk);
      });
      div.appendChild(bd);chainsEl.appendChild(div);
    });
    detailEl.className=`b19-s195-detail ${s.cls}`;
    detailEl.innerHTML=`<div class="b19-s195-detail-label">${s.label}</div>
      <div class="b19-s195-detail-title">${s.title}</div>
      <div class="b19-s195-detail-text">${s.text}</div>
      <div class="b19-s195-detail-analogy">${s.analogy}</div>`;
  }
  const stepsEl=document.querySelectorAll('.b19-s195-step-btn');
  stepsEl.forEach(b=>b.addEventListener('click',()=>renderStep(parseInt(b.dataset.step))));
  renderStep(0);

  function selfishRev(alphaPct,gamma=0.5){
    const a=alphaPct/100;
    const r=(a*(1-a)*(1-a)*(4*a+gamma*(1-2*a))-a*a*a)/(1-a*(1+(2-a)*a));
    return Math.max(a,Math.min(0.95,r));
  }

  function updateThreshold(){
    const sl=g('b19-s195-hr-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b19-s195-hr-val');if(vEl) vEl.textContent=pct+'%';
    const sr=Math.round(selfishRev(pct)*1000)/10;
    const hrEl=g('b19-s195-honest-rev');if(hrEl) hrEl.textContent=pct+'% dari total';
    const srEl=g('b19-s195-selfish-rev');if(srEl) srEl.textContent='~'+sr+'%';
    const ssEl=g('b19-s195-selfish-sub');
    const verdict=g('b19-s195-verdict');const vlEl=g('b19-s195-verdict-label');const vtEl=g('b19-s195-verdict-text');
    if(sr>pct+0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-danger';
      if(vlEl) vlEl.textContent='Selfish mining MENGUNTUNGKAN di hashrate ini';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue selfish (~${sr}%) lebih tinggi dari honest (${pct}%). Keuntungan ekstra berasal dari pekerjaan miner lain yang di-orphan.`;
      if(ssEl) ssEl.textContent='lebih tinggi dari honest mining';
    } else if(sr>pct-0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-warn';
      if(vlEl) vlEl.textContent='Zona batas — hampir tidak menguntungkan';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue selfish (~${sr}%) hampir sama dengan honest (${pct}%). Risiko dan kompleksitas tidak sebanding.`;
      if(ssEl) ssEl.textContent='hampir sama dengan honest mining';
    } else {
      if(verdict) verdict.className='b19-s195-verdict s195-v-safe';
      if(vlEl) vlEl.textContent='Selfish mining TIDAK menguntungkan di hashrate ini';
      if(vtEl) vtEl.textContent=`Dengan ${pct}% hashrate, expected revenue honest (${pct}%) lebih tinggi dari selfish (~${sr}%). Di hashrate rendah, risiko block tersembunyi di-orphan lebih besar.`;
      if(ssEl) ssEl.textContent='lebih rendah dari honest mining';
    }
  }
  const sl2=g('b19-s195-hr-sl');if(sl2) sl2.addEventListener('input',updateThreshold);
  updateThreshold();

  function updateProp(){
    const sl=g('b19-s195-prop-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b19-s195-prop-val');if(vEl) vEl.textContent=pct+'%';
    const gamma=pct/100;
    let threshold=49;
    for(let a=5;a<=49;a++){
      const sr=selfishRev(a,1-gamma)*100;
      if(sr>a){threshold=a;break;}
    }
    const res=g('b19-s195-prop-result');if(!res) return;
    if(pct>=70){
      res.className='b19-s195-prop-result s195-pr-good';
      res.textContent=`Propagasi ${pct}%: threshold selfish mining naik ke ~${threshold}%+ hashrate. Semakin cepat block menyebar, semakin sulit selfish mining menguntungkan. Compact blocks berkontribusi langsung ke sini.`;
    } else if(pct>=40){
      res.className='b19-s195-prop-result s195-pr-mid';
      res.textContent=`Propagasi ${pct}%: threshold selfish mining sekitar ~${threshold}% hashrate. Masih mengkhawatirkan kalau ada pool dengan hashrate besar.`;
    } else {
      res.className='b19-s195-prop-result s195-pr-bad';
      res.textContent=`Propagasi ${pct}% (lambat): threshold selfish mining turun ke ~${threshold}% hashrate. Propagasi yang lambat memberi lebih banyak waktu bagi miner selfish untuk memanfaatkan keunggulan.`;
    }
  }
  const sl3=g('b19-s195-prop-sl');if(sl3) sl3.addEventListener('input',updateProp);
  updateProp();

  const tabs=['b19-s195-t1','b19-s195-t2','b19-s195-t3'];
  const panes=['b19-s195-p1','b19-s195-p2','b19-s195-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b19-s195-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b19-s195-pane';});
      const el=g(tid);if(el) el.className='b19-s195-tab s195-act';
      const pe=g(panes[i]);if(pe) pe.className='b19-s195-pane show';
    });
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.4 SIMULATION (Mining Pool Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NETWORK_EH=700;
  const BLOCK_REWARD=3.125;
  const BLOCKS_PER_DAY=144;

  function calcSoloDays(hashrateTH){
    return (NETWORK_EH*1e6/hashrateTH)*10/60/24;
  }
  function calcPoolDaily(hashrateTH){
    return (hashrateTH/(NETWORK_EH*1e6))*BLOCKS_PER_DAY*BLOCK_REWARD*0.99;
  }
  function fmtTime(days){
    if(days<1) return (days*24).toFixed(1)+' jam';
    if(days<365) return days.toFixed(1)+' hari';
    const y=days/365;
    return y<1000?y.toFixed(1)+' tahun':'>1000 tahun';
  }
  function fmtBTC(btc){
    if(btc<0.0001) return btc.toExponential(2)+' BTC';
    return btc.toFixed(5)+' BTC';
  }

  function update(){
    const sl=g('b19-s194-hr-sl');if(!sl) return;
    const val=parseInt(sl.value);
    const hashrateTH=val*100;
    const label=hashrateTH>=1000?(hashrateTH/1000).toFixed(1)+' PH/s ('+hashrateTH.toLocaleString('id-ID')+' TH/s)':hashrateTH+' TH/s';
    const vEl=g('b19-s194-hr-val');if(vEl) vEl.textContent=label;

    const soloDays=calcSoloDays(hashrateTH);
    const poolDaily=calcPoolDaily(hashrateTH);
    const poolWeekly=poolDaily*7;

    const st=g('b19-s194-solo-time');if(st) st.textContent='~'+fmtTime(soloDays);
    const pi=g('b19-s194-pool-income');if(pi) pi.textContent='~'+fmtBTC(poolDaily)+'/hari';

    // Timeline 12 minggu
    const el=g('b19-s194-tl-rows');if(!el) return;
    el.innerHTML='';
    const soloBlockProb=7/soloDays;
    let rng=hashrateTH;
    function rand(){rng=(rng*1103515245+12345)&0x7fffffff;return rng/0x7fffffff;}
    const maxBar=Math.max(BLOCK_REWARD,poolWeekly)*1.2;

    for(let w=1;w<=12;w++){
      const soloFound=rand()<soloBlockProb;
      const soloWidth=soloFound?Math.min(100,(BLOCK_REWARD/maxBar)*100):0;
      const poolWidth=Math.min(100,(poolWeekly/maxBar)*100);
      const row=document.createElement('div');row.className='b19-s194-tl-row';
      row.innerHTML=`<div class="b19-s194-tl-week">Minggu ${w}</div>
        <div class="b19-s194-tl-solo-wrap"><div class="b19-s194-tl-solo-bar" style="width:${soloWidth}%;"></div></div>
        <div class="b19-s194-tl-pool-wrap"><div class="b19-s194-tl-pool-bar" style="width:${poolWidth}%;"></div></div>`;
      el.appendChild(row);
    }

    const note=g('b19-s194-note');
    if(note) note.textContent=`Dengan hashrate ${label}, miner solo rata-rata butuh ${fmtTime(soloDays)} untuk menemukan satu block. Di pool, pendapatan datang konsisten ${fmtBTC(poolDaily)}/hari — total jangka panjang sama, tapi variance jauh lebih rendah.`;
  }

  const sl=g('b19-s194-hr-sl');if(sl) sl.addEventListener('input',update);
  update();

  const t1=g('b19-s194-t1'),t2=g('b19-s194-t2');
  const p1=g('b19-s194-p1'),p2=g('b19-s194-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s194-tab s194-act';t2.className='b19-s194-tab';
    p1.className='b19-s194-pane show';p2.className='b19-s194-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s194-tab s194-act';t1.className='b19-s194-tab';
    p2.className='b19-s194-pane show';p1.className='b19-s194-pane';
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.3 SIMULATION (Halving & Security Budget)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const BLOCKS_PER_YEAR=52560;

  const HALVINGS=[
    {era:'Era 1 (2009-2012)',reward:50,    status:'past'},
    {era:'Era 2 (2012-2016)',reward:25,    status:'past'},
    {era:'Era 3 (2016-2020)',reward:12.5,  status:'past'},
    {era:'Era 4 (2020-2024)',reward:6.25,  status:'past'},
    {era:'Era 5 (2024-2028)',reward:3.125, status:'current'},
    {era:'Era 6 (~2028+)',   reward:1.5625,status:'future'},
    {era:'Era 7 (~2032+)',   reward:0.7813,status:'future'},
    {era:'Era 8 (~2036+)',   reward:0.3906,status:'future'},
    {era:'Era 9 (~2040+)',   reward:0.1953,status:'future'},
    {era:'Era 10+ (~2044+)', reward:0.0977,status:'future'},
  ];

  // Build timeline — no badges, just era and reward
  (function(){
    const el=g('b19-s193-tl');if(!el) return;
    HALVINGS.forEach(h=>{
      const row=document.createElement('div');
      row.className=`b19-s193-tl-row s193-tl-${h.status}`;
      const pct=Math.max(1,(h.reward/50)*100);
      const color=h.status==='current'?'#534AB7':h.status==='past'?'#52524C':'#D8D6F0';
      row.innerHTML=`<div class="b19-s193-tl-era">${h.era}</div>
        <div class="b19-s193-tl-reward">${h.reward} BTC</div>
        <div class="b19-s193-tl-bar-wrap">
          <div class="b19-s193-tl-bar" style="width:${pct}%;background:${color};"></div>
        </div>`;
      el.appendChild(row);
    });
  })();

  // Build horizon chart
  (function(){
    const el=g('b19-s193-horizon-rows');if(!el) return;
    const items=[
      {era:'2009 — 50 BTC',   reward:50},
      {era:'2012 — 25 BTC',   reward:25},
      {era:'2016 — 12,5 BTC', reward:12.5},
      {era:'2020 — 6,25 BTC', reward:6.25},
      {era:'2024 — 3,125 BTC',reward:3.125},
      {era:'2028 — 1,56 BTC', reward:1.5625},
      {era:'2032 — 0,78 BTC', reward:0.7813},
      {era:'2036 — 0,39 BTC', reward:0.3906},
    ];
    items.forEach(r=>{
      const logPct=Math.max(3,Math.round(
        (Math.log2(r.reward)-Math.log2(0.39))/(Math.log2(50)-Math.log2(0.39))*92+3
      ));
      const color=r.era.startsWith('2024')?'#534AB7':r.era<'2024'?'#52524C':'rgba(83,74,183,0.3)';
      const row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:8px;padding:3px 0;';
      row.innerHTML=`<div style="font-size:9px;font-family:'Sora',sans-serif;color:#3A3A35;min-width:130px;flex-shrink:0;">${r.era}</div>
        <div style="flex:1;height:14px;background:#F4F4F0;border-radius:99px;overflow:hidden;">
          <div style="width:${logPct}%;height:100%;background:${color};border-radius:99px;"></div>
        </div>
        <div style="font-size:9px;font-family:'Courier Prime',monospace;color:#534AB7;min-width:60px;text-align:right;">${r.reward} BTC</div>`;
      el.appendChild(row);
    });
  })();

  function fmtUSD(n){
    if(n>=1e9) return '$'+(n/1e9).toFixed(1)+'M';
    if(n>=1e6) return '$'+(n/1e6).toFixed(1)+'jt';
    if(n>=1e3) return '$'+(n/1e3).toFixed(0)+'rb';
    return '$'+n.toFixed(0);
  }

  function update(){
    const psl=g('b19-s193-price-sl');const fsl=g('b19-s193-fee-sl');
    if(!psl||!fsl) return;
    const price=parseInt(psl.value);
    const fee=parseInt(fsl.value)/100;
    const REWARD=3.125;

    const pv=g('b19-s193-price-val');if(pv) pv.textContent='$'+price.toLocaleString('id-ID');
    const fv=g('b19-s193-fee-val'); if(fv) fv.textContent=fee.toFixed(2)+' BTC';

    const rewardPB=REWARD*price;
    const feePB=fee*price;
    const totalAnnual=(rewardPB+feePB)*BLOCKS_PER_YEAR;

    const rv=g('b19-s193-reward-usd');if(rv) rv.textContent=fmtUSD(rewardPB)+'/block';
    const rs=g('b19-s193-reward-sub');if(rs) rs.textContent=REWARD+' BTC × $'+price.toLocaleString('id-ID');
    const fv2=g('b19-s193-fee-usd'); if(fv2) fv2.textContent=fmtUSD(feePB)+'/block';
    const tv=g('b19-s193-total-usd');if(tv)  tv.textContent=fmtUSD(totalAnnual)+'/thn';

    const rewardPct=Math.round(rewardPB/(rewardPB+feePB)*100);
    const feePct=100-rewardPct;
    const pr=g('b19-s193-prop-r');const pf=g('b19-s193-prop-f');
    const prt=g('b19-s193-prop-r-txt');const pft=g('b19-s193-prop-f-txt');
    if(pr) pr.style.width=rewardPct+'%';
    if(pf) pf.style.width=Math.max(feePct,feePct>0?2:0)+'%';
    if(prt) prt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(pft) pft.textContent=feePct>8?'Fee '+feePct+'%':'';
  }

  const psl=g('b19-s193-price-sl');if(psl) psl.addEventListener('input',update);
  const fsl=g('b19-s193-fee-sl');  if(fsl) fsl.addEventListener('input',update);
  update();

  const t1=g('b19-s193-t1'),t2=g('b19-s193-t2');
  const p1=g('b19-s193-p1'),p2=g('b19-s193-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s193-tab s193-act';t2.className='b19-s193-tab';
    p1.className='b19-s193-pane show';p2.className='b19-s193-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s193-tab s193-act';t1.className='b19-s193-tab';
    p2.className='b19-s193-pane show';p1.className='b19-s193-pane';
  });
})();

// ============================================================
// PAGE 22 · BAB 19 · 19.1 SIMULATION (Revenue Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const ERAS=[
    {key:'2009',label:'2009 (Era 1)',   reward:50,    fee:0.001,
     note:'Era awal Bitcoin. Hampir tidak ada transaksi selain coinbase. Fee praktis nol karena jaringan masih sangat kecil. Block reward 50 BTC mendominasi 100% revenue.'},
    {key:'2012',label:'2012 (Halving 1)',reward:25,   fee:0.01,
     note:'Setelah halving pertama. Fee mulai ada tapi masih sangat kecil. Block reward turun ke 25 BTC, tapi harga Bitcoin mulai naik sehingga nilai dollar tetap menarik bagi miner.'},
    {key:'2016',label:'2016 (Halving 2)',reward:12.5, fee:0.05,
     note:'Setelah halving kedua. Jaringan mulai lebih ramai. Fee mulai signifikan di periode congestion tapi masih di bawah 1% dari total revenue rata-rata.'},
    {key:'2020',label:'2020 (Halving 3)',reward:6.25, fee:0.15,
     note:'Setelah halving ketiga. Fee mulai berperan lebih besar terutama di periode congestion tinggi. Block reward masih sangat dominan sekitar 97-98% dari total revenue.'},
    {key:'2024',label:'2024 (Halving 4)',reward:3.125,fee:0.15,
     note:'Setelah halving keempat (April 2024). Block reward kini 3,125 BTC. Fee tetap fluktuatif. Proporsi fee dari total revenue meningkat secara persentase karena block reward berkurang, bukan karena fee naik drastis.'},
    {key:'2140',label:'2140 (Endpoint protokol)',reward:0,fee:0.3,
     note:'Konsekuensi matematis dari halving schedule yang sudah ditentukan sejak genesis block: block reward mencapai nol. Miner sepenuhnya bergantung pada fee. Apakah fee saja cukup untuk mengamankan jaringan adalah pertanyaan terbuka paling penting dalam ekonomi Bitcoin jangka panjang.'},
  ];

  function renderEra(key){
    const d=ERAS.find(e=>e.key===key);if(!d) return;
    const total=d.reward+d.fee;
    const rewardPct=total>0?Math.round(d.reward/total*100):0;
    const feePct=total>0?Math.round(d.fee/total*100):0;

    const rv=g('b19-s191-reward-val');if(rv) rv.textContent=d.reward>0?d.reward+' BTC':'0 BTC';
    const fv=g('b19-s191-fee-val');if(fv) fv.textContent='~'+d.fee+' BTC';
    const pv=g('b19-s191-pct-val');if(pv) pv.textContent='~'+feePct+'%';
    const ps=g('b19-s191-pct-sub');if(ps) ps.textContent=feePct===0?'fee hampir tidak ada':feePct===100?'100% dari fee saja':'sisanya dari block reward';

    const br=g('b19-s191-bar-r');const bf=g('b19-s191-bar-f');
    const brt=g('b19-s191-bar-r-txt');const bft=g('b19-s191-bar-f-txt');
    if(br) br.style.width=rewardPct+'%';
    if(bf) bf.style.width=Math.max(feePct,feePct>0?3:0)+'%';
    if(brt) brt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(bft) bft.textContent=feePct>8?'Fee '+feePct+'%':'';

    const note=g('b19-s191-note');if(note) note.textContent=d.note;
    const cr=g('b19-s191-cb-reward');
    if(cr) cr.textContent=d.reward>0?d.reward+' BTC':'0 BTC (endpoint protokol)';

    document.querySelectorAll('.b19-s191-era-btn').forEach(b=>
      b.classList.toggle('s191-era-act',b.dataset.era===key));
  }

  (function(){
    const el=g('b19-s191-eras');if(!el) return;
    ERAS.forEach(e=>{
      const btn=document.createElement('button');
      btn.className='b19-s191-era-btn'+(e.key==='2024'?' s191-era-act':'');
      btn.dataset.era=e.key;btn.textContent=e.label;
      btn.addEventListener('click',()=>renderEra(e.key));
      el.appendChild(btn);
    });
  })();

  (function(){
    const el=g('b19-s191-tl-rows');if(!el) return;
    const maxTotal=ERAS.reduce((m,e)=>Math.max(m,e.reward+e.fee),0);
    ERAS.forEach(e=>{
      const total=e.reward+e.fee;
      const rw=total>0?Math.max(1,(e.reward/maxTotal)*100):0;
      const fw=total>0?Math.max(1,(e.fee/maxTotal)*100):0;
      const feePct=total>0?Math.round(e.fee/total*100):0;
      const row=document.createElement('div');row.className='b19-s191-tl-row';
      row.innerHTML='<div class="b19-s191-tl-era">'+e.key+'</div>'+
        '<div class="b19-s191-tl-track">'+
        '<div class="b19-s191-tl-r" style="width:'+rw+'%;"><div class="b19-s191-tl-txt">'+(e.reward>0?e.reward+' BTC':'')+'</div></div>'+
        '<div class="b19-s191-tl-f" style="width:'+fw+'%;"><div class="b19-s191-tl-txt">'+(e.fee>0.05?e.fee+' BTC':'')+'</div></div>'+
        '</div>'+
        '<div class="b19-s191-tl-val">fee: ~'+feePct+'%</div>';
      el.appendChild(row);
    });
  })();

  renderEra('2024');

  const t1=g('b19-s191-t1'),t2=g('b19-s191-t2');
  const p1=g('b19-s191-p1'),p2=g('b19-s191-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s191-tab s191-act';t2.className='b19-s191-tab';
    p1.className='b19-s191-pane show';p2.className='b19-s191-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s191-tab s191-act';t1.className='b19-s191-tab';
    p2.className='b19-s191-pane show';p1.className='b19-s191-pane';
  });
})();


// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const SCENARIOS={
    up2x:{
      col:'s192-sc-up',actualDays:7,
      adjustLabel:'+100% (2×)',adjustSub:'naik: block lebih sulit',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'7 hari (10.080 menit)',desc:'Hashrate 2× lebih tinggi, block ditemukan 2× lebih cepat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'0,5 (7 ÷ 14)',desc:'Di bawah 1,0 berarti block terlalu cepat, difficulty harus naik'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× lebih sulit',desc:'Target baru = target lama × 0,5, hash valid harus lebih kecil'},
      ],
      chart:[
        {epoch:'Epoch N',  days:7, color:'#854F0B',label:'7 hari (terlalu cepat)'},
        {epoch:'Epoch N+1',days:10,color:'#0F6E56',label:'~10 hari'},
        {epoch:'Epoch N+2',days:13,color:'#0F6E56',label:'~13 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 hari (stabil)'},
      ],
    },
    down50:{
      col:'s192-sc-down',actualDays:28,
      adjustLabel:'-50% (0,5×)',adjustSub:'turun: block lebih mudah',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'28 hari (40.320 menit)',desc:'Hashrate turun 50%, block ditemukan 2× lebih lambat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'2,0 (28 ÷ 14)',desc:'Di atas 1,0 berarti block terlalu lambat, difficulty harus turun'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× lebih mudah',desc:'Target baru = target lama × 2,0, hash valid bisa lebih besar'},
      ],
      chart:[
        {epoch:'Epoch N',  days:28,color:'#A32D2D',label:'28 hari (terlalu lambat)'},
        {epoch:'Epoch N+1',days:18,color:'#854F0B',label:'~18 hari'},
        {epoch:'Epoch N+2',days:15,color:'#0F6E56',label:'~15 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 hari (stabil)'},
      ],
    },
    same:{
      col:'s192-sc-same',actualDays:14,
      adjustLabel:'0% (1×)',adjustSub:'tidak berubah',afterLabel:'~10 menit',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'14 hari (20.160 menit)',desc:'Hashrate stabil, block ditemukan tepat sesuai target'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio waktu aktual / target',val:'1,0 (14 ÷ 14)',desc:'Tepat 1,0 berarti tidak ada penyesuaian yang diperlukan'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'Tidak berubah',desc:'Target baru = target lama × 1,0, difficulty identik'},
      ],
      chart:[
        {epoch:'Epoch N',  days:14,color:'#0F6E56',label:'14 hari (tepat)'},
        {epoch:'Epoch N+1',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+2',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'14 hari'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'14 hari'},
      ],
    },
    up5x:{
      col:'s192-sc-up',actualDays:2.8,
      adjustLabel:'+300% (4×, dibatasi)',adjustSub:'batas protokol diterapkan',afterLabel:'Butuh ~4 epoch',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target waktu per epoch',val:'14 hari (20.160 menit)',desc:'2.016 block × 10 menit = 20.160 menit'},
        {cls:'s192-cs-actual',num:'2',title:'Waktu aktual epoch ini',val:'~2,8 hari (4.032 menit)',desc:'Hashrate 5× lebih tinggi, block ditemukan sangat cepat'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio sebelum batas',val:'0,2 (2,8 ÷ 14)',desc:'Ini berarti difficulty harus naik 5× tetapi ada batas maksimum'},
        {cls:'s192-cs-cap',   num:'4',title:'Batas protokol diterapkan',val:'max(0,25 ; min(4,0 ; 0,2)) = 0,25',desc:'Ratio 0,2 di bawah batas minimum 0,25. Protokol paksa ratio = 0,25'},
        {cls:'s192-cs-result s192-warn',num:'5',title:'New difficulty (dibatasi)',val:'4× lebih sulit (bukan 5×)',desc:'Butuh beberapa epoch untuk sepenuhnya menstabilkan. Ini adalah proteksi jaringan.'},
      ],
      chart:[
        {epoch:'Epoch N',  days:2.8,color:'#A32D2D',label:'2,8 hari (sangat cepat)'},
        {epoch:'Epoch N+1',days:7,  color:'#854F0B',label:'~7 hari (cap 4×)'},
        {epoch:'Epoch N+2',days:11, color:'#0F6E56',label:'~11 hari'},
        {epoch:'Epoch N+3',days:13, color:'#0F6E56',label:'~13 hari'},
        {epoch:'Epoch N+4',days:14, color:'#0F6E56',label:'~14 hari (stabil)'},
      ],
    },
  };

  function renderScenario(key){
    const sc=SCENARIOS[key];if(!sc) return;
    const scEl=g('b19-s192-scenarios');
    if(scEl) scEl.querySelectorAll('.b19-s192-scenario').forEach(b=>{
      const col=b.dataset.sc==='down50'?'s192-sc-down':b.dataset.sc==='same'?'s192-sc-same':'s192-sc-up';
      b.className=`b19-s192-scenario ${col}`;
    });
    const btn=document.querySelector(`.b19-s192-scenario[data-sc="${key}"]`);
    if(btn) btn.classList.add('s192-act');
    const at=g('b19-s192-actual-time');if(at) at.textContent=sc.actualDays+' hari';
    const adj=g('b19-s192-adjust');if(adj) adj.textContent=sc.adjustLabel;
    const adjS=g('b19-s192-adjust-sub');if(adjS) adjS.textContent=sc.adjustSub;
    const aft=g('b19-s192-after');if(aft) aft.textContent=sc.afterLabel;
    const el=g('b19-s192-calc-steps');if(!el) return;
    el.innerHTML='';
    sc.steps.forEach(s=>{
      const div=document.createElement('div');div.className=`b19-s192-calc-step ${s.cls}`;
      div.innerHTML=`<div class="b19-s192-step-num">${s.num}</div>
        <div class="b19-s192-step-body">
          <div class="b19-s192-step-title">${s.title}</div>
          <div class="b19-s192-step-val">${s.val}</div>
          <div class="b19-s192-step-desc">${s.desc}</div>
        </div>`;
      el.appendChild(div);
    });
    const cr=g('b19-s192-chart-rows');if(!cr) return;
    cr.innerHTML='';
    sc.chart.forEach(r=>{
      const pct=Math.max(2,Math.min(100,(r.days/30)*100));
      const row=document.createElement('div');row.className='b19-s192-chart-row';
      row.innerHTML=`<div class="b19-s192-chart-epoch">${r.epoch}</div>
        <div class="b19-s192-chart-track">
          <div class="b19-s192-chart-bar" style="width:${pct}%;background:${r.color};">
            <div class="b19-s192-chart-bar-txt">${r.label}</div>
          </div>
        </div>
        <div class="b19-s192-chart-val">${r.days} hari</div>`;
      cr.appendChild(row);
    });
  }

  const scEl=g('b19-s192-scenarios');
  if(scEl) scEl.querySelectorAll('.b19-s192-scenario').forEach(btn=>{
    btn.addEventListener('click',()=>renderScenario(btn.dataset.sc));
  });
  renderScenario('up2x');

  const t1=g('b19-s192-t1'),t2=g('b19-s192-t2');
  const p1=g('b19-s192-p1'),p2=g('b19-s192-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b19-s192-tab s192-act';t2.className='b19-s192-tab';
    p1.className='b19-s192-pane show';p2.className='b19-s192-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b19-s192-tab s192-act';t1.className='b19-s192-tab';
    p2.className='b19-s192-pane show';p1.className='b19-s192-pane';
  });
})();



