// ============================================================
// PAGE 12 · BAB 9 · NAVIGATION
// ============================================================
function showSectionInContentB9(sectionId, sbId) {
  document.querySelectorAll('#page-bab9 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab9 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab9-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 12 · BAB 9 · TOPBAR
// ============================================================
document.getElementById('back-home-b9').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b9').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 12 · BAB 9 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab9').addEventListener('click', () => navigate('page-bab9'));

// ============================================================
// PAGE 12 · BAB 9 · SIDEBAR EVENTS (9.1 - 9.6)
// ============================================================
document.getElementById('sb-9-1').addEventListener('click', () => showSectionInContentB9('section-9-1', 'sb-9-1'));
document.getElementById('sb-9-2').addEventListener('click', () => showSectionInContentB9('section-9-2', 'sb-9-2'));
document.getElementById('sb-9-3').addEventListener('click', () => showSectionInContentB9('section-9-3', 'sb-9-3'));
document.getElementById('sb-9-4').addEventListener('click', () => showSectionInContentB9('section-9-4', 'sb-9-4'));
document.getElementById('sb-9-5').addEventListener('click', () => showSectionInContentB9('section-9-5', 'sb-9-5'));
document.getElementById('sb-9-6').addEventListener('click', () => showSectionInContentB9('section-9-6', 'sb-9-6'));

// ============================================================
// PAGE 12 · BAB 9 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab9 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB9(target, sb);
  });
});

// ============================================================
// PAGE 12 · BAB 9 · 9.6 SIMULATION (Fee Market Future)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG  =dark?'#1A1A18':'#F4F4F0';
  const GRID=dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)';
  const TXT2=dark?'#A0A098':'#3A3A35';

  const YEARS=[], REWARDS=[], FEE_OPT=[], FEE_PESS=[];
  for(let y=2009;y<=2060;y++){
    YEARS.push(y);
    let reward=50;
    const halvings=Math.floor((y-2009)/4);
    for(let h=0;h<halvings;h++) reward/=2;
    REWARDS.push(Math.max(reward,0.00000001));
    const t=Math.max(0,y-2009);
    FEE_OPT.push(Math.min(0.1*Math.pow(1.12,t)*Math.min(1,(y-2009)/20),200));
    FEE_PESS.push(Math.min(0.05*Math.pow(1.04,t)*Math.min(1,(y-2009)/25),20));
  }
  const NOW_IDX=YEARS.indexOf(2024);

  function setupCv(id,H){
    const cv=g(id); if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    return {ctx,W,H};
  }

  function drawChart1(){
    const r=setupCv('b09-s96-cv1',260); if(!r) return;
    const {ctx,W,H}=r;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();
    const pad={t:20,r:16,b:30,l:50};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
    const maxVal=Math.max(...REWARDS,...FEE_OPT,...REWARDS.map((r,i)=>r+FEE_OPT[i]));
    function xp(i){return pad.l+i/(YEARS.length-1)*cw;}
    function yp(v){return pad.t+ch*(1-Math.min(v,maxVal)/maxVal);}
    for(let gv=0;gv<=4;gv++){
      const y=pad.t+gv*(ch/4);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=GRID;ctx.lineWidth=0.5;ctx.stroke();
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='right';ctx.textBaseline='middle';
      ctx.fillText((maxVal*(1-gv/4)).toFixed(1),pad.l-4,y);
    }
    ctx.beginPath();ctx.moveTo(xp(NOW_IDX),pad.t);ctx.lineTo(xp(NOW_IDX),pad.t+ch);
    ctx.strokeStyle=dark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)';
    ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('2024',xp(NOW_IDX),pad.t+2);
    // Total dashed amber
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]+FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#F0A050';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
    // Fee area
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.lineTo(xp(YEARS.length-1),yp(0));ctx.lineTo(xp(0),yp(0));ctx.closePath();
    ctx.fillStyle=dark?'rgba(15,110,86,0.2)':'rgba(15,110,86,0.15)';ctx.fill();
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#0F6E56';ctx.lineWidth=1.5;ctx.stroke();
    // Reward
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=2;ctx.stroke();
    // X labels
    [2009,2020,2024,2032,2040,2050,2060].forEach(yr=>{
      const i=YEARS.indexOf(yr);if(i<0)return;
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText(yr,xp(i),H-pad.b+4);
    });
  }

  function drawChart2(){
    const r=setupCv('b09-s96-cv2',200); if(!r) return;
    const {ctx,W,H}=r;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();
    const pad={t:16,r:16,b:28,l:46};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
    const maxVal=Math.max(...FEE_OPT,...FEE_PESS,...REWARDS);
    function xp(i){return pad.l+i/(YEARS.length-1)*cw;}
    function yp(v){return pad.t+ch*(1-Math.min(v,maxVal)/maxVal);}
    for(let gv=0;gv<=3;gv++){
      const y=pad.t+gv*(ch/3);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=GRID;ctx.lineWidth=0.5;ctx.stroke();
    }
    ctx.beginPath();ctx.moveTo(xp(NOW_IDX),pad.t);ctx.lineTo(xp(NOW_IDX),pad.t+ch);
    ctx.strokeStyle=dark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.1)';
    ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    // Reward dashed
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(REWARDS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
    // Pesimis
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_PESS[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#A32D2D';ctx.lineWidth=1.5;ctx.stroke();
    // Optimis
    ctx.beginPath();
    YEARS.forEach((_,i)=>{const x=xp(i),y=yp(FEE_OPT[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle='#0F6E56';ctx.lineWidth=2;ctx.stroke();
    [2009,2024,2040,2060].forEach(yr=>{
      const i=YEARS.indexOf(yr);if(i<0)return;
      ctx.fillStyle=TXT2;ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText(yr,xp(i),H-pad.b+4);
    });
  }

  const t1=g('b09-s96-t1'), t2=g('b09-s96-t2');
  const p1=g('b09-s96-p1'), p2=g('b09-s96-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s96-tab s96-act'; t2.className='b09-s96-tab';
    p1.className='b09-s96-pane show'; p2.className='b09-s96-pane';
    requestAnimationFrame(drawChart1);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s96-tab s96-act'; t1.className='b09-s96-tab';
    p2.className='b09-s96-pane show'; p1.className='b09-s96-pane';
    requestAnimationFrame(drawChart2);
  });

  drawChart1();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{drawChart1();drawChart2();})).observe(g('b09-s96-cv1')||document.body);
  }
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.5 SIMULATION (Fee Estimator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const BTC_PRICE=65000;
  let curMp='quiet', curTgt='next';

  const DATA={
    quiet:{
      next: {rate:2,  eta:'Block berikutnya (~10 menit)',          conf:'Tinggi',        cls:'s95-good', blocks:1},
      '3blk':{rate:1, eta:'1-2 block (~10-20 menit)',              conf:'Tinggi',        cls:'s95-good', blocks:1},
      '6blk':{rate:1, eta:'1-3 block (~10-30 menit)',              conf:'Tinggi',        cls:'s95-good', blocks:1},
      '1day':{rate:1, eta:'Block berikutnya — mempool sangat sepi',conf:'Sangat tinggi', cls:'s95-good', blocks:1},
    },
    normal:{
      next: {rate:15, eta:'1-2 block (~10-20 menit)',   conf:'Sedang', cls:'s95-warn', blocks:2},
      '3blk':{rate:8, eta:'2-4 block (~20-40 menit)',   conf:'Sedang', cls:'s95-warn', blocks:3},
      '6blk':{rate:5, eta:'4-8 block (~40-80 menit)',   conf:'Sedang', cls:'s95-warn', blocks:6},
      '1day':{rate:2, eta:'Beberapa jam hingga 1 hari', conf:'Rendah', cls:'s95-warn', blocks:10},
    },
    busy:{
      next: {rate:80, eta:'1-3 block (~10-30 menit)', conf:'Sedang', cls:'s95-warn', blocks:3},
      '3blk':{rate:50,eta:'3-6 block (~30-60 menit)', conf:'Sedang', cls:'s95-warn', blocks:5},
      '6blk':{rate:30,eta:'6-12 block (~1-2 jam)',    conf:'Rendah', cls:'s95-warn', blocks:10},
      '1day':{rate:10,eta:'Bisa lebih dari 1 hari',   conf:'Rendah', cls:'s95-bad',  blocks:20},
    },
    vbusy:{
      next: {rate:180,eta:'1-5 block (~10-50 menit)',  conf:'Rendah',       cls:'s95-bad', blocks:5},
      '3blk':{rate:120,eta:'3-8 block (~30-80 menit)', conf:'Rendah',       cls:'s95-bad', blocks:8},
      '6blk':{rate:80, eta:'6-20 block (~1-3 jam)',    conf:'Rendah',       cls:'s95-bad', blocks:18},
      '1day':{rate:30, eta:'Bisa berhari-hari',         conf:'Sangat rendah',cls:'s95-bad', blocks:30},
    },
  };

  const EXPLAIN={
    quiet:{
      next:'Mempool sepi. Hampir semua transaksi dikonfirmasi dalam block berikutnya bahkan dengan fee sangat rendah.',
      '3blk':'Mempool sepi. Fee 1 sat/vB sudah lebih dari cukup — transaksi kemungkinan dikonfirmasi dalam block pertama.',
      '6blk':'Mempool sepi. Tidak perlu membayar lebih dari minimum. Semua transaksi dikonfirmasi cepat.',
      '1day':'Mempool sepi. Bahkan fee minimum 1 sat/vB sudah cukup. Ini saat terbaik untuk kirim transaksi non-urgent.',
    },
    normal:{
      next:'Mempool normal. Fee 15 sat/vB menempatkan transaksi di atas mayoritas antrian. Estimator menganalisis distribusi fee mempool saat ini.',
      '3blk':'Mempool normal. Fee 8 sat/vB cukup untuk konfirmasi dalam beberapa block. Miner akan memproses ini setelah antrian di atasnya selesai.',
      '6blk':'Mempool normal. Fee 5 sat/vB menempatkan transaksi di zona menengah. Ada risiko delay kalau ada lonjakan transaksi mendadak.',
      '1day':'Mempool normal tapi fee rendah ini berisiko. Kalau kondisi mempool memburuk, transaksi bisa stuck lebih lama dari perkiraan.',
    },
    busy:{
      next:'Mempool ramai. Fee 80 sat/vB diperlukan untuk bersaing dengan antrian panjang. Estimator memperkirakan butuh beberapa block untuk giliran kamu.',
      '3blk':'Mempool ramai. Fee 50 sat/vB menempatkan transaksi di zona prioritas menengah. Ada ketidakpastian cukup tinggi.',
      '6blk':'Mempool ramai. Fee 30 sat/vB adalah minimum untuk dikonfirmasi dalam jam ini. Pertimbangkan menunggu kalau tidak urgent.',
      '1day':'Mempool ramai dan fee ini sangat rendah. Transaksi mungkin tidak dikonfirmasi hari ini. Gunakan hanya kalau benar-benar tidak urgent.',
    },
    vbusy:{
      next:'Mempool sangat ramai. Fee 180 sat/vB diperlukan untuk masuk block berikutnya tapi kepercayaan rendah. Pertimbangkan apakah ini benar-benar urgent.',
      '3blk':'Mempool sangat ramai. Fee 120 sat/vB masih sangat mahal. Kalau tidak urgent, tunggu sampai kondisi mereda.',
      '6blk':'Mempool sangat ramai. Fee 80 sat/vB mungkin tidak cukup kalau kondisi memburuk lagi. Risiko stuck sangat nyata.',
      '1day':'Mempool sangat ramai. Fee 30 sat/vB bisa stuck berhari-hari. Sangat disarankan untuk menunggu kondisi mempool mereda.',
    },
  };

  function renderBlocks(n){
    const track=g('b09-s95-blocks'); if(!track) return;
    const show=Math.min(n,20);
    let html='';
    for(let i=0;i<show;i++){
      if(i===0) html+=`<div class="b09-s95-block your">TX</div>`;
      else html+=`<div class="b09-s95-block full"></div>`;
    }
    if(n>20) html+=`<span class="b09-s95-more">+${n-20} block lagi</span>`;
    track.innerHTML=html;
  }

  function update(){
    const d=DATA[curMp][curTgt];
    const ex=EXPLAIN[curMp][curTgt];
    const szEl=document.getElementById('b09-s95-size');
    const nIn=szEl?parseInt(szEl.value,10):1;
    const vb=Math.round(11+nIn*68+2*31);          // P2WPKH: overhead + input + 2 output
    const totalSat=d.rate*vb;
    const szv=document.getElementById('b09-s95-size-val');
    if(szv) szv.textContent=nIn+' input';
    const szn=document.getElementById('b09-s95-size-note');
    if(szn){
      szn.innerHTML = nIn===1
        ? 'Transaksi paling sederhana: <b>1 input, 2 output</b>, sekitar <b>'+vb+' vByte</b>. Geser ke kanan untuk melihat apa yang terjadi kalau dananya tersebar di banyak UTXO kecil.'
        : 'Dengan <b>'+nIn+' input</b>, ukurannya jadi sekitar <b>'+vb+' vByte</b>, atau <b>'+(vb/141).toFixed(1)+'x</b> lebih besar dari transaksi paling sederhana. Fee-nya ikut naik sebesar itu juga, dan perhatikan bahwa <b>jumlah BTC yang dikirim sama sekali tidak berpengaruh</b>. Yang dibayar adalah ruang block, bukan nilai.';
    }
    const totalUsd=(totalSat/100000000*BTC_PRICE).toFixed(2);

    const rv=g('b09-s95-rate');
    if(rv){rv.textContent=d.rate;rv.style.color=d.cls==='s95-good'?'#0F6E56':d.cls==='s95-warn'?'#854F0B':'#A32D2D';}

    const eta=g('b09-s95-eta');
    if(eta){eta.textContent=d.eta;eta.className='b09-s95-result-v '+d.cls;}

    const tot=g('b09-s95-total');
    if(tot) tot.textContent=`${totalSat.toLocaleString()} sat (~$${totalUsd})`;

    const conf=g('b09-s95-conf');
    const confCls=d.conf==='Tinggi'||d.conf==='Sangat tinggi'?'s95-good':d.conf==='Sedang'?'s95-warn':'s95-bad';
    if(conf){conf.textContent=d.conf;conf.className='b09-s95-result-v '+confCls;}

    renderBlocks(d.blocks);

    const exp=g('b09-s95-explain');
    if(exp){exp.textContent=ex;exp.className='b09-s95-explain '+d.cls;}
  }

  document.querySelectorAll('.b09-s95-opt').forEach(el=>{
    el.addEventListener('click',()=>{
      const group=el.dataset.group;
      const val=el.dataset.val;
      document.querySelectorAll(`.b09-s95-opt[data-group="${group}"]`).forEach(o=>{
        o.classList.remove('sel');
        const dot=o.querySelector('.b09-s95-radio-dot');
        if(dot) dot.remove();
      });
      el.classList.add('sel');
      const radio=el.querySelector('.b09-s95-radio');
      if(radio&&!radio.querySelector('.b09-s95-radio-dot')){
        const dot=document.createElement('div');
        dot.className='b09-s95-radio-dot';
        radio.appendChild(dot);
      }
      if(group==='mp') curMp=val; else curTgt=val;
      update();
    });
  });

  const _sz=document.getElementById('b09-s95-size');
  if(_sz) _sz.addEventListener('input',update);
  update();
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.4 SIMULATION (Mempool Congestion)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  let curState='quiet';

  const STATES={
    quiet:{
      subtitle:'Kondisi normal — transaksi mengalir lancar',
      headCls:'quiet-head', txCount:'~2,400 tx', mpSize:'~4 MB',
      txCls:'s94-good', mpCls:'s94-good',
      bars:[
        {label:'Next block',val:2,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~3 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~6 block',  val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
        {label:'~1 hari',   val:1,  max:200,cls:'s94-good',color:'#0F6E56'},
      ],
      barVals:['2 sat/vB','1 sat/vB','1 sat/vB','1 sat/vB'],
      chartData:[8,12,15,10,8,14,18,12,8,10,6,8],
      chartColor:'#0F6E56',
      note:'Mempool sepi. Fee rendah sudah cukup untuk konfirmasi cepat. Ini saat terbaik untuk mengirim transaksi non-urgent.',
      noteCls:'quiet-note',
      stratHead:'Kondisi sepi: apa yang perlu dilakukan?',
      stratItems:[
        {icon:'✓',text:'Kirim transaksi dengan fee rate 1-3 sat/vB — cukup untuk konfirmasi cepat'},
        {icon:'✓',text:'Waktu terbaik untuk konsolidasi UTXO kecil yang biasanya mahal'},
        {icon:'✓',text:'Buka Lightning channel dengan fee lebih murah dari biasanya'},
        {icon:'ℹ',text:'Tidak perlu terburu-buru — mempool sepi biasanya bertahan beberapa jam'},
      ],
    },
    busy:{
      subtitle:'Kondisi padat — fee melonjak, antrian panjang',
      headCls:'busy-head', txCount:'~180,000 tx', mpSize:'~350 MB',
      txCls:'s94-bad', mpCls:'s94-bad',
      bars:[
        {label:'Next block',val:180,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~3 block',  val:120,max:200,cls:'s94-bad', color:'#A32D2D'},
        {label:'~6 block',  val:80, max:200,cls:'s94-warn',color:'#854F0B'},
        {label:'~1 hari',   val:30, max:200,cls:'s94-warn',color:'#854F0B'},
      ],
      barVals:['180 sat/vB','120 sat/vB','80 sat/vB','30 sat/vB'],
      chartData:[20,45,90,140,180,200,185,175,160,145,130,115],
      chartColor:'#A32D2D',
      note:'Mempool sangat ramai. Fee rendah bisa stuck berhari-hari. Pertimbangkan untuk menunggu kondisi mempool lebih sepi sebelum kirim transaksi.',
      noteCls:'busy-note',
      stratHead:'Kondisi ramai: strategi yang bisa dilakukan',
      stratItems:[
        {icon:'⏳',text:'Tunggu dulu jika tidak urgent — mempool ramai biasanya mereda dalam beberapa hari'},
        {icon:'⬆',text:'Kalau sudah terlanjur kirim dengan fee rendah, gunakan RBF untuk menaikkan fee'},
        {icon:'👶',text:'Kalau kamu penerima dan parent stuck, buat child tx dengan fee tinggi (CPFP)'},
        {icon:'📊',text:'Pantau mempool.space untuk tahu kapan kondisi mulai mereda'},
      ],
    },
  };

  function drawChart(data, color){
    const cv=g('b09-s94-cv1'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||300;
    const H=120;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill();
    const max=Math.max(...data,1);
    const bw=Math.floor((W-16)/data.length)-3;
    const baseY=H-10;
    data.forEach((v,i)=>{
      const bh=Math.round((v/max)*(H-20));
      const x=8+i*(bw+3), y=baseY-bh;
      ctx.fillStyle=color;
      ctx.globalAlpha=0.15+0.7*(v/max);
      ctx.beginPath(); ctx.roundRect(x,y,bw,bh,3); ctx.fill();
      ctx.globalAlpha=1;
    });
    ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.font='9px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText('tx/block',8,2);
  }

  function render(state){
    curState=state;
    const s=STATES[state];

    const qBtn=g('b09-s94-quiet'), bBtn=g('b09-s94-busy');
    if(qBtn) qBtn.className='b09-s94-tog'+(state==='quiet'?' quiet-tog':'');
    if(bBtn) bBtn.className='b09-s94-tog'+(state==='busy'?' busy-tog':'');

    const sub=g('b09-s94-subtitle'); if(sub) sub.textContent=s.subtitle;

    ['b09-s94-head1','b09-s94-head2'].forEach(id=>{
      const el=g(id); if(el) el.className='b09-s94-card-head '+s.headCls;
    });

    const tc=g('b09-s94-tx-count'); if(tc){tc.textContent=s.txCount;tc.className='b09-s94-metric-val '+s.txCls;}
    const ms=g('b09-s94-mp-size'); if(ms){ms.textContent=s.mpSize;ms.className='b09-s94-metric-val '+s.mpCls;}

    const ft=g('b09-s94-fee-table');
    if(ft) ft.innerHTML=s.bars.map((b,i)=>`
      <div class="b09-s94-fee-row">
        <div class="b09-s94-fee-label">${b.label}</div>
        <div class="b09-s94-fee-bar-wrap"><div class="b09-s94-fee-bar" style="width:${Math.round(b.val/b.max*100)}%;background:${b.color};"></div></div>
        <div class="b09-s94-fee-val ${b.cls}">${s.barVals[i]}</div>
      </div>`).join('');

    const sh=g('b09-s94-strat-head'); if(sh) sh.textContent=s.stratHead;
    const sb=g('b09-s94-strat-body');
    if(sb) sb.innerHTML=s.stratItems.map(it=>`
      <div class="b09-s94-strategy-item">
        <span class="b09-s94-strategy-icon">${it.icon}</span>
        <span>${it.text}</span>
      </div>`).join('');

    const nt=g('b09-s94-note'); if(nt){nt.textContent=s.note;nt.className='b09-s94-note '+s.noteCls;}
    drawChart(s.chartData, s.chartColor);
  }

  const qBtn=g('b09-s94-quiet'), bBtn=g('b09-s94-busy');
  if(qBtn) qBtn.addEventListener('click',()=>render('quiet'));
  if(bBtn) bBtn.addEventListener('click',()=>render('busy'));

  render('quiet');
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawChart(STATES[curState].chartData,STATES[curState].chartColor);
    })).observe(g('b09-s94-cv1')||document.body);
  }
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.3 SIMULATION (RBF dan CPFP)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const RBF_OTHERS=[
    {id:'tx_f1a2_high',tier:'high',rate:45},
    {id:'tx_e3b4_high',tier:'high',rate:38},
    {id:'tx_c5d6_med', tier:'med', rate:22},
    {id:'tx_g7h8_med', tier:'med', rate:18},
    {id:'tx_i9j0_low', tier:'low', rate:8},
  ];
  let rbfDone=false;

  function renderRBF(done){
    const q=g('b09-s93-rbf-queue'); if(!q) return;
    let txs=[...RBF_OTHERS];
    if(done){
      txs.push({id:'tx_a1b2c3d4 (baru)',tier:'high',rate:35,isNew:true});
    } else {
      txs.push({id:'tx_a1b2c3d4',tier:'low',rate:2,isStuck:true});
    }
    txs.sort((a,b)=>b.rate-a.rate);
    q.innerHTML=txs.map((tx,i)=>{
      const tierCls=tx.isNew?'new-tx':tx.isStuck?'stuck':tx.tier;
      const barCls=tx.isNew?'high':tx.isStuck?'red':tx.tier;
      const feeCls=tx.isNew?'high':tx.isStuck?'bad':tx.tier;
      const badge=tx.isNew?'<span class="b09-s93-tx-badge new">RBF baru</span>':tx.isStuck?'<span class="b09-s93-tx-badge stuck">stuck</span>':'';
      return `<div class="b09-s93-tx ${tierCls}">
        <div class="b09-s93-tx-num">${i+1}.</div>
        <div class="b09-s93-tx-bar ${barCls}"></div>
        <div class="b09-s93-tx-id">${tx.id}</div>
        ${badge}
        <div class="b09-s93-tx-fee ${feeCls}">${tx.rate} sat/vB</div>
      </div>`;
    }).join('');

    const dh=g('b09-s93-rbf-dhead');
    const st=g('b09-s93-rbf-status');
    const nt=g('b09-s93-rbf-note');
    const btn=g('b09-s93-rbf-btn');
    if(done){
      if(dh) dh.textContent='Transaksi kamu (RBF berhasil)';
      if(st){st.textContent='Posisi prioritas tinggi';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent='RBF berhasil! Transaksi lama diganti dengan yang baru (fee rate 35 sat/vB). Posisi di mempool naik dari bawah ke atas. Miner akan memilih transaksi ini di block berikutnya.';nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(dh) dh.textContent='Transaksi kamu (stuck)';
      if(st){st.textContent='Stuck di mempool';st.className='b09-s93-dv s93-bad';}
      if(nt){nt.textContent='Transaksi dengan fee rate 2 sat/vB akan menunggu sangat lama. RBF memungkinkan kamu mengirim ulang transaksi yang sama dengan fee lebih tinggi, menggantikan yang lama di mempool.';nt.className='b09-s93-note s93-note-info';}
      if(btn) btn.disabled=false;
    }
  }

  const rbfBtn=g('b09-s93-rbf-btn');
  if(rbfBtn) rbfBtn.addEventListener('click',()=>{rbfDone=true;renderRBF(true);});
  const rbfReset=g('b09-s93-rbf-reset');
  if(rbfReset) rbfReset.addEventListener('click',()=>{rbfDone=false;renderRBF(false);});

  // CPFP
  const CPFP_OTHERS=[
    {id:'tx_f1a2_high',tier:'high',rate:42},
    {id:'tx_e3b4_high',tier:'high',rate:36},
    {id:'tx_c5d6_med', tier:'med', rate:20},
    {id:'tx_g7h8_low', tier:'low', rate:7},
  ];
  const PAR_RATE=2, PAR_SIZE=250, CHLD_RATE=80, CHLD_SIZE=110;
  let cpfpDone=false;

  function pkgRate(){
    const totalFee=PAR_RATE*PAR_SIZE/1000+CHLD_RATE*CHLD_SIZE/1000;
    const totalSize=(PAR_SIZE+CHLD_SIZE)/1000;
    return +(totalFee/totalSize).toFixed(1);
  }

  function renderCPFP(done){
    const q=g('b09-s93-cpfp-queue'); if(!q) return;
    const pr=pkgRate();
    let txs=[...CPFP_OTHERS];
    if(done){
      txs.push({id:'[PKG] tx_parent + tx_child',tier:'high',rate:pr,isPkg:true});
    } else {
      txs.push({id:'tx_parent_stuck',rate:PAR_RATE,isParent:true});
    }
    txs.sort((a,b)=>b.rate-a.rate);
    q.innerHTML=txs.map((tx,i)=>{
      const tierCls=tx.isPkg?'package':tx.isParent?'parent':tx.tier;
      const barCls=tx.isPkg?'high':tx.isParent?'red':tx.tier;
      const feeCls=tx.isPkg?'high':tx.isParent?'bad':tx.tier;
      const badge=tx.isPkg?'<span class="b09-s93-tx-badge pkg">paket CPFP</span>':tx.isParent?'<span class="b09-s93-tx-badge parent">parent stuck</span>':'';
      return `<div class="b09-s93-tx ${tierCls}">
        <div class="b09-s93-tx-num">${i+1}.</div>
        <div class="b09-s93-tx-bar ${barCls}"></div>
        <div class="b09-s93-tx-id">${tx.id}</div>
        ${badge}
        <div class="b09-s93-tx-fee ${feeCls}">${tx.rate} sat/vB</div>
      </div>`;
    }).join('');

    const cr=g('b09-s93-cpfp-cr');
    const pkg=g('b09-s93-cpfp-pkg');
    const st=g('b09-s93-cpfp-status');
    const nt=g('b09-s93-cpfp-note');
    const btn=g('b09-s93-cpfp-btn');
    if(done){
      if(cr){cr.textContent=CHLD_RATE+' sat/vB';cr.className='b09-s93-dv s93-purp';}
      if(pkg){pkg.textContent=pr+' sat/vB';pkg.className='b09-s93-dv s93-good';}
      if(st){st.textContent='Paket siap — miner akan ambil keduanya';st.className='b09-s93-dv s93-good';}
      if(nt){nt.textContent=`Child tx dibuat dengan fee rate ${CHLD_RATE} sat/vB. Fee rate gabungan paket (parent+child) menjadi ${pr} sat/vB. Miner HARUS memasukkan parent terlebih dahulu untuk bisa mengambil fee child. Keduanya masuk block bersama.`;nt.className='b09-s93-note s93-note-good';}
      if(btn) btn.disabled=true;
    } else {
      if(cr){cr.textContent='belum dibuat';cr.className='b09-s93-dv s93-warn';}
      if(pkg){pkg.textContent='menunggu child...';pkg.className='b09-s93-dv s93-warn';}
      if(st){st.textContent='Belum ada child tx';st.className='b09-s93-dv s93-warn';}
      if(nt){nt.textContent='Parent tx fee-nya terlalu rendah (2 sat/vB). Karena kamu sudah menerima output-nya, kamu bisa buat child tx dengan fee tinggi. Miner yang ingin ambil fee child HARUS memasukkan parent dulu.';nt.className='b09-s93-note s93-note-info';}
      if(btn) btn.disabled=false;
    }
  }

  const cpfpBtn=g('b09-s93-cpfp-btn');
  if(cpfpBtn) cpfpBtn.addEventListener('click',()=>{cpfpDone=true;renderCPFP(true);});
  const cpfpReset=g('b09-s93-cpfp-reset');
  if(cpfpReset) cpfpReset.addEventListener('click',()=>{cpfpDone=false;renderCPFP(false);});

  const t1=g('b09-s93-t1'),t2=g('b09-s93-t2');
  const p1=g('b09-s93-p1'),p2=g('b09-s93-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s93-tab s93-act'; t2.className='b09-s93-tab';
    p1.className='b09-s93-pane show'; p2.className='b09-s93-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s93-tab s93-act'; t1.className='b09-s93-tab';
    p2.className='b09-s93-pane show'; p1.className='b09-s93-pane';
  });

  renderRBF(false);
  renderCPFP(false);
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.2 SIMULATION (Fee Rate Kalkulator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  function feeRateInfo(rate){
    if(rate>=30) return {cls:'good',pri:'Tinggi',eta:'Block berikutnya',noteCls:'s92-note-good',note:`Fee rate ${rate} sat/vB termasuk tinggi. Kemungkinan besar masuk block berikutnya bahkan saat mempool ramai.`};
    if(rate>=10) return {cls:'',pri:'Sedang',eta:'2-3 block (~20-30 menit)',noteCls:'s92-note-info',note:`Fee rate ${rate} sat/vB termasuk sedang. Akan dikonfirmasi dalam beberapa block saat kondisi mempool normal.`};
    if(rate>=3)  return {cls:'warn',pri:'Rendah',eta:'Bisa lebih dari 1 jam',noteCls:'s92-note-warn',note:`Fee rate ${rate} sat/vB termasuk rendah. Mungkin menunggu beberapa block, terutama saat mempool ramai.`};
    return {cls:'bad',pri:'Sangat rendah',eta:'Bisa berminggu-minggu',noteCls:'s92-note-bad',note:`Fee rate ${rate} sat/vB sangat rendah. Transaksi bisa terdiam lama di mempool dan mungkin di-drop setelah 2 minggu.`};
  }

  function markerPos(rate){
    const clamped=Math.min(Math.max(rate,1),100);
    return Math.round((Math.log(clamped)-Math.log(1))/(Math.log(100)-Math.log(1))*100);
  }

  function calcP1(){
    const fee=parseInt(g('b09-s92-fee').value)||1;
    const size=parseInt(g('b09-s92-size').value)||1;
    const rate=+(fee/size).toFixed(1);
    const info=feeRateInfo(rate);

    const rv=g('b09-s92-rate');
    if(rv){rv.textContent=rate;rv.style.color=info.cls==='good'?'#0F6E56':info.cls==='warn'?'#854F0B':info.cls==='bad'?'#A32D2D':'#534AB7';}

    const marker=g('b09-s92-marker');
    if(marker) marker.style.left=markerPos(rate)+'%';

    const eta=g('b09-s92-eta');
    if(eta){eta.textContent=info.eta;eta.className='b09-s92-row-val '+info.cls;}

    const ts=g('b09-s92-total-sat');
    if(ts) ts.textContent=fee.toLocaleString()+' sat';

    const pri=g('b09-s92-priority');
    if(pri){pri.textContent=info.pri;pri.className='b09-s92-row-val '+info.cls;}

    const note=g('b09-s92-note1');
    if(note){note.textContent=info.note;note.className='b09-s92-note '+info.noteCls;}
  }

  function calcP2(){
    const fee=parseInt(g('b09-s92-fee2').value)||1;
    const LEG=226, SW=140;
    const legRate=+(fee/LEG).toFixed(1);
    const swRate=+(fee/SW).toFixed(1);
    const legInfo=feeRateInfo(legRate);
    const swInfo=feeRateInfo(swRate);
    const saving=Math.round((1-SW/LEG)*100);

    const ls=g('b09-s92-leg-size'); if(ls) ls.textContent=LEG+' vbyte';
    const lr=g('b09-s92-leg-rate'); if(lr) lr.textContent=legRate+' sat/vB';
    const lp=g('b09-s92-leg-pri'); if(lp){lp.textContent=legInfo.pri;lp.className='b09-s92-cmp-val '+(legInfo.cls==='good'?'s92-good':'s92-warn');}
    const le=g('b09-s92-leg-eta'); if(le) le.textContent=legInfo.eta;

    const ss=g('b09-s92-sw-size'); if(ss) ss.textContent=SW+' vbyte';
    const sr=g('b09-s92-sw-rate'); if(sr) sr.textContent=swRate+' sat/vB';
    const sp=g('b09-s92-sw-pri'); if(sp){sp.textContent=swInfo.pri;sp.className='b09-s92-cmp-val '+(swInfo.cls==='good'?'s92-good':'s92-warn');}
    const se=g('b09-s92-sw-eta'); if(se){se.textContent=swInfo.eta;se.className='b09-s92-cmp-val '+(swInfo.cls==='good'?'s92-good':'');}

    const note=g('b09-s92-note2');
    if(note) note.textContent=`Dengan fee ${fee.toLocaleString()} sat yang sama, SegWit punya fee rate ${swRate} sat/vB vs Legacy ${legRate} sat/vB. SegWit ${saving}% lebih kecil sehingga lebih kompetitif di mempool.`;
  }

  const feeIn=g('b09-s92-fee'); if(feeIn) feeIn.addEventListener('input',calcP1);
  const sizeIn=g('b09-s92-size'); if(sizeIn) sizeIn.addEventListener('input',calcP1);
  const fee2In=g('b09-s92-fee2'); if(fee2In) fee2In.addEventListener('input',calcP2);

  const t1=g('b09-s92-t1'),t2=g('b09-s92-t2');
  const p1=g('b09-s92-p1'),p2=g('b09-s92-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b09-s92-tab s92-act'; t2.className='b09-s92-tab';
    p1.className='b09-s92-pane show'; p2.className='b09-s92-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b09-s92-tab s92-act'; t1.className='b09-s92-tab';
    p2.className='b09-s92-pane show'; p1.className='b09-s92-pane';
  });

  calcP1(); calcP2();
})();

// ============================================================
// PAGE 12 · BAB 9 · 9.1 SIMULATION (Mempool)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const BLOCK_MAX = 10;
  const MEMPOOL_MAX = 20;
  const TIERS = [
    {tier:'high', feeRange:[80,150], sizeRange:[200,500]},
    {tier:'med',  feeRange:[20,79],  sizeRange:[200,600]},
    {tier:'low',  feeRange:[1,19],   sizeRange:[200,700]},
  ];
  let mempool=[], blockTxs=[], txCounter=0;

  function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function randHex(n){return Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');}

  function genTx(){
    const t=TIERS[Math.floor(Math.random()*TIERS.length)];
    const fee=randInt(t.feeRange[0],t.feeRange[1]);
    const size=randInt(t.sizeRange[0],t.sizeRange[1]);
    txCounter++;
    return {
      id:'tx'+String(txCounter).padStart(3,'0')+'_'+randHex(4),
      tier:t.tier, fee, size,
      feeRate:+(fee/size*1000).toFixed(1),
    };
  }

  function renderPool(){
    const el=g('b09-s91-pool'); if(!el) return;
    if(mempool.length===0){
      el.innerHTML='<div class="b09-s91-empty">Belum ada transaksi</div>';
    } else {
      const sorted=[...mempool].sort((a,b)=>b.feeRate-a.feeRate);
      el.innerHTML=sorted.map((tx,i)=>`
        <div class="b09-s91-tx ${tx.tier}">
          <div class="b09-s91-tx-num">${i+1}.</div>
          <div class="b09-s91-tx-bar ${tx.tier}"></div>
          <div class="b09-s91-tx-id">${tx.id}</div>
          <div class="b09-s91-tx-fee ${tx.tier}">${tx.feeRate} sat/vB</div>
          <div class="b09-s91-tx-size">${tx.size}B</div>
        </div>`).join('');
    }
    const pct=Math.min(100,Math.round(mempool.length/MEMPOOL_MAX*100));
    const fill=g('b09-s91-cap-fill'); if(fill) fill.style.width=pct+'%';
    const label=g('b09-s91-cap-pct'); if(label) label.textContent=pct+'%';
    const stat=g('b09-s91-stat'); if(stat) stat.textContent=`Mempool: ${mempool.length} tx`;
  }

  function renderBlock(){
    const el=g('b09-s91-block'); if(!el) return;
    if(blockTxs.length===0){
      el.innerHTML='<div class="b09-s91-empty">Belum ada transaksi terpilih</div>';
    } else {
      el.innerHTML=blockTxs.map((tx,i)=>`
        <div class="b09-s91-tx ${tx.tier}">
          <div class="b09-s91-tx-num">${i+1}.</div>
          <div class="b09-s91-tx-bar ${tx.tier}"></div>
          <div class="b09-s91-tx-id">${tx.id}</div>
          <div class="b09-s91-tx-fee ${tx.tier}">${tx.feeRate} sat/vB</div>
        </div>`).join('');
    }
    const pct=Math.min(100,Math.round(blockTxs.length/BLOCK_MAX*100));
    const fill=g('b09-s91-blk-fill'); if(fill) fill.style.width=pct+'%';
    const label=g('b09-s91-blk-pct'); if(label) label.textContent=pct+'%';
  }

  const addBtn=g('b09-s91-add');
  if(addBtn) addBtn.addEventListener('click',()=>{
    if(mempool.length>=MEMPOOL_MAX) return;
    const n=randInt(1,3);
    for(let i=0;i<n&&mempool.length<MEMPOOL_MAX;i++) mempool.push(genTx());
    renderPool();
    const note=g('b09-s91-note');
    if(note){note.textContent='Transaksi masuk ke mempool, diurutkan dari fee rate tertinggi. Sekarang coba langkah 2: tambang block.';note.className='b09-s91-note idle-note';}
  });

  const mineBtn=g('b09-s91-mine');
  if(mineBtn) mineBtn.addEventListener('click',()=>{
    if(mempool.length===0) return;
    mempool.sort((a,b)=>b.feeRate-a.feeRate);
    const picked=mempool.splice(0,Math.min(BLOCK_MAX,mempool.length));
    blockTxs=picked;
    renderPool(); renderBlock();
    const totalFee=picked.reduce((s,t)=>s+t.fee,0);
    const avgFee=picked.length?+(picked.reduce((s,t)=>s+t.feeRate,0)/picked.length).toFixed(1):0;
    const note=g('b09-s91-note');
    if(note){
      note.textContent=`Block ditambang! ${picked.length} transaksi dipilih dari fee tertinggi. Total fee: ${totalFee} sat. Fee rate rata-rata: ${avgFee} sat/vB. Sisa ${mempool.length} transaksi masih menunggu di mempool.`;
      note.className='b09-s91-note done-note';
    }
  });

  const resetBtn=g('b09-s91-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    mempool=[]; blockTxs=[]; txCounter=0;
    renderPool(); renderBlock();
    const note=g('b09-s91-note');
    if(note){note.textContent='Mulai dari langkah 1: tambah transaksi ke mempool, lalu langkah 2: tambang block untuk melihat bagaimana miner memilih transaksi berdasarkan fee tertinggi.';note.className='b09-s91-note idle-note';}
  });

  // Seed awal
  for(let i=0;i<8;i++) mempool.push(genTx());
  renderPool(); renderBlock();
})();

