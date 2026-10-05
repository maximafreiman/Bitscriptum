// ============================================================
// PAGE 14 · BAB 11 · NAVIGATION
// ============================================================
function showSectionInContentB11(sectionId, sbId) {
  document.querySelectorAll('#page-bab11 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab11 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab11-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 14 · BAB 11 · TOPBAR
// ============================================================
document.getElementById('back-home-b11').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b11').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 14 · BAB 11 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab11').addEventListener('click', () => navigate('page-bab11'));

// ============================================================
// PAGE 14 · BAB 11 · SIDEBAR EVENTS (11.1 - 11.6)
// ============================================================
document.getElementById('sb-11-1').addEventListener('click', () => showSectionInContentB11('section-11-1', 'sb-11-1'));
document.getElementById('sb-11-2').addEventListener('click', () => showSectionInContentB11('section-11-2', 'sb-11-2'));
document.getElementById('sb-11-3').addEventListener('click', () => showSectionInContentB11('section-11-3', 'sb-11-3'));
document.getElementById('sb-11-4').addEventListener('click', () => showSectionInContentB11('section-11-4', 'sb-11-4'));
document.getElementById('sb-11-5').addEventListener('click', () => showSectionInContentB11('section-11-5', 'sb-11-5'));
document.getElementById('sb-11-6').addEventListener('click', () => showSectionInContentB11('section-11-6', 'sb-11-6'));

// ============================================================
// PAGE 14 · BAB 11 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab11 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB11(target, sb);
  });
});

// ============================================================
// PAGE 14 · BAB 11 · 11.6 SIMULATION (Hash Rate Distribution)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;

  const POOLS=[
    {name:'Foundry USA',pct:28,color:'#534AB7'},
    {name:'AntPool',pct:19,color:'#0F6E56'},
    {name:'F2Pool',pct:12,color:'#854F0B'},
    {name:'ViaBTC',pct:10,color:'#7C3AED'},
    {name:'Binance Pool',pct:8,color:'#5DCAA5'},
    {name:'Lainnya',pct:23,color:'#52524C'},
  ];

  const GEO=[
    {flag:'🇺🇸',name:'Amerika Serikat',pct:38,color:'#534AB7'},
    {flag:'🇰🇿',name:'Kazakhstan',pct:14,color:'#854F0B'},
    {flag:'🇷🇺',name:'Rusia',pct:11,color:'#A32D2D'},
    {flag:'🇨🇦',name:'Kanada',pct:7,color:'#0F6E56'},
    {flag:'🇩🇪',name:'Jerman',pct:5,color:'#5DCAA5'},
    {flag:'🇨🇳',name:'China (estimasi)',pct:4,color:'#52524C'},
    {flag:'🌍',name:'Lainnya',pct:21,color:'#3A3A35'},
  ];

  function drawPie(cvId, legendId, data){
    const cv=g(cvId); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    const H=200;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;
    const R=Math.min(W,H)*0.42, r=Math.min(W,H)*0.22;
    let angle=-Math.PI/2;
    data.forEach(d=>{
      const sweep=(d.pct/100)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle,angle+sweep);ctx.closePath();
      ctx.fillStyle=d.color;ctx.fill();
      ctx.strokeStyle=dark?'#1A1A18':'#fff';ctx.lineWidth=1.5;ctx.stroke();
      angle+=sweep;
    });
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle=dark?'#1A1A18':'#fff';ctx.fill();
    ctx.fillStyle=dark?'#E0DED8':'#1A1A18';
    ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('Hash Rate',cx,cy-6);
    ctx.font='9px sans-serif';ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.fillText('distribusi',cx,cy+8);
    const leg=g(legendId); if(!leg) return;
    leg.innerHTML=data.map(d=>`
      <div class="b11-s116-leg">
        <div class="b11-s116-leg-dot" style="background:${d.color};"></div>
        <div class="b11-s116-leg-label">${d.name}</div>
        <div class="b11-s116-leg-pct" style="color:${d.color};">${d.pct}%</div>
      </div>`).join('');
  }

  function renderGeo(){
    const el=g('b11-s116-geo-bars'); if(!el) return;
    const max=Math.max(...GEO.map(d=>d.pct));
    el.innerHTML=GEO.map(d=>`
      <div class="b11-s116-geo-row">
        <div class="b11-s116-geo-flag">${d.flag}</div>
        <div class="b11-s116-geo-label">${d.name}</div>
        <div class="b11-s116-geo-track">
          <div class="b11-s116-geo-fill" style="width:${Math.round(d.pct/max*100)}%;background:${d.color==='#EEEDFE'?'#52524C':d.color};">${d.pct}%</div>
        </div>
        <div class="b11-s116-geo-pct">${d.pct}%</div>
      </div>`).join('');
  }

  const t1=g('b11-s116-t1'), t2=g('b11-s116-t2');
  const p1=g('b11-s116-p1'), p2=g('b11-s116-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b11-s116-tab s116-act'; t2.className='b11-s116-tab';
    p1.className='b11-s116-pane show'; p2.className='b11-s116-pane';
    requestAnimationFrame(()=>drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b11-s116-tab s116-act'; t1.className='b11-s116-tab';
    p2.className='b11-s116-pane show'; p1.className='b11-s116-pane';
    renderGeo();
  });

  drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawPie('b11-s116-cv-pool','b11-s116-legend-pool',POOLS);
    })).observe(g('b11-s116-cv-pool')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.5 SIMULATION (Mining Energy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;

  const DONUT_DATA=[
    {pct:26,color:'#0F6E56'},{pct:17,color:'#5DCAA5'},
    {pct:25,color:'#534AB7'},{pct:22,color:'#854F0B'},{pct:10,color:'#52524C'},
  ];

  function drawDonut(){
    const cv=g('b11-s115-donut'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||180;
    const H=180;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;
    const R=Math.min(W,H)*0.42, r=Math.min(W,H)*0.24;
    let angle=-Math.PI/2;
    DONUT_DATA.forEach(d=>{
      const sweep=(d.pct/100)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle,angle+sweep);ctx.closePath();
      ctx.fillStyle=d.color;ctx.fill();
      angle+=sweep;
    });
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle=dark?'#1A1A18':'#fff';ctx.fill();
    ctx.fillStyle=dark?'#E0DED8':'#1A1A18';
    ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('~55%',cx,cy-6);
    ctx.font='9px sans-serif';ctx.fillStyle=dark?'#A0A098':'#3A3A35';
    ctx.fillText('terbarukan',cx,cy+8);
  }

  const t1=g('b11-s115-t1'), t2=g('b11-s115-t2');
  const p1=g('b11-s115-p1'), p2=g('b11-s115-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b11-s115-tab s115-act'; t2.className='b11-s115-tab';
    p1.className='b11-s115-pane show'; p2.className='b11-s115-pane';
    requestAnimationFrame(drawDonut);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b11-s115-tab s115-act'; t1.className='b11-s115-tab';
    p2.className='b11-s115-pane show'; p1.className='b11-s115-pane';
  });

  drawDonut();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawDonut)).observe(g('b11-s115-donut')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.4 SIMULATION (Mining Profitability)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function val(id){return parseFloat(g(id)?.value||0);}

  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const NETWORK_HASHRATE=600e18;
  const BLOCK_REWARD=3.125;
  const BLOCKS_PER_DAY=144;

  function btcPerDay(hashTH){
    return (hashTH*1e12/NETWORK_HASHRATE)*BLOCK_REWARD*BLOCKS_PER_DAY;
  }

  function calc(){
    const btcPrice=val('b11-s114-btc');
    const elecPrice=val('b11-s114-elec');
    const hashTH=val('b11-s114-hash');
    const watt=val('b11-s114-watt');
    if(!btcPrice||!elecPrice||!hashTH||!watt) return;

    const bpd=btcPerDay(hashTH);
    const incUSD=bpd*btcPrice;
    const elecCost=watt/1000*24*elecPrice;
    const profit=incUSD-elecCost;
    const eff=+(watt/hashTH).toFixed(1);
    const hashprice=+(incUSD/hashTH).toFixed(4);
    const breakeven=bpd>0?Math.round(elecCost/bpd):0;

    const pv=g('b11-s114-profit');
    if(pv){pv.textContent=(profit>=0?'+$':'−$')+Math.abs(profit).toFixed(2);pv.className='b11-s114-profit-val '+(profit>1?'s114-profit':profit<-1?'s114-loss':'s114-breakeven');}
    const ib=g('b11-s114-inc-btc'); if(ib) ib.textContent=bpd.toFixed(8)+' BTC';
    const iu=g('b11-s114-inc-usd'); if(iu) iu.textContent='$'+incUSD.toFixed(2);
    const ec=g('b11-s114-elec-cost'); if(ec) ec.textContent='$'+elecCost.toFixed(2);
    const ef=g('b11-s114-eff'); if(ef) ef.textContent=eff+' W/TH';
    const be=g('b11-s114-breakeven'); if(be) be.textContent='$'+breakeven.toLocaleString();
    const hp=g('b11-s114-hashprice'); if(hp) hp.textContent='$'+hashprice+' / TH/day';

    const mf=g('b11-s114-margin-fill');
    if(mf){
      if(profit>0){
        const pct=Math.min(95,Math.round(profit/(profit+elecCost)*100));
        mf.style.width=pct+'%'; mf.style.background='#0F6E56';
      } else {
        const pct=Math.min(95,Math.round(Math.abs(profit)/(Math.abs(profit)+incUSD)*100));
        mf.style.width=pct+'%'; mf.style.background='#A32D2D';
      }
    }

    const note=g('b11-s114-note');
    if(note){
      if(profit>1){note.textContent=`Profitable! Dengan harga BTC $${btcPrice.toLocaleString()} dan listrik $${elecPrice}/kWh, estimasi profit $${profit.toFixed(2)} per hari. Break-even price di $${breakeven.toLocaleString()}.`;note.className='b11-s114-note s114-profit';}
      else if(profit<-1){note.textContent=`Rugi. Biaya listrik ($${elecCost.toFixed(2)}/hari) melebihi pendapatan ($${incUSD.toFixed(2)}/hari). Butuh harga BTC minimal $${breakeven.toLocaleString()} untuk break-even.`;note.className='b11-s114-note s114-loss';}
      else{note.textContent='Hampir break-even. Pendapatan dan biaya hampir seimbang. Sedikit perubahan harga BTC atau biaya listrik bisa membalik situasi.';note.className='b11-s114-note s114-breakeven';}
    }

    drawChart(btcPrice, elecPrice, hashTH, watt);
  }

  function drawChart(curBtc, elecPrice, hashTH, watt){
    const cv=g('b11-s114-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=120;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill();

    const minP=Math.max(1000,Math.round(curBtc*0.2));
    const maxP=Math.round(curBtc*2.5);
    const steps=50;
    const prices=Array.from({length:steps+1},(_,i)=>minP+(maxP-minP)*i/steps);
    const elecCost=watt/1000*24*elecPrice;
    const profits=prices.map(p=>btcPerDay(hashTH)*p-elecCost);

    const maxP2=Math.max(...profits), minP2=Math.min(...profits);
    const range=maxP2-minP2||1;
    const pad={t:10,r:10,b:22,l:10};
    const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;

    function xp(i){return pad.l+i/steps*cw;}
    function yp(v){return pad.t+ch*(1-(v-minP2)/range);}

    const zeroY=yp(0);
    ctx.beginPath();ctx.moveTo(pad.l,zeroY);ctx.lineTo(pad.l+cw,zeroY);
    ctx.strokeStyle='rgba(163,45,45,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);

    ctx.beginPath();
    profits.forEach((v,i)=>{i===0?ctx.moveTo(xp(i),yp(v)):ctx.lineTo(xp(i),yp(v));});
    ctx.lineTo(xp(steps),yp(minP2));ctx.lineTo(xp(0),yp(minP2));ctx.closePath();
    ctx.fillStyle='rgba(83,74,183,0.12)';ctx.fill();

    ctx.beginPath();
    profits.forEach((v,i)=>{i===0?ctx.moveTo(xp(i),yp(v)):ctx.lineTo(xp(i),yp(v));});
    ctx.strokeStyle='#534AB7';ctx.lineWidth=1.5;ctx.stroke();

    const curIdx=prices.findIndex(p=>p>=curBtc);
    if(curIdx>=0){
      const cx=xp(curIdx), cy=yp(profits[curIdx]);
      ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);
      ctx.fillStyle=profits[curIdx]>=0?'#0F6E56':'#A32D2D';ctx.fill();
    }

    [minP,curBtc,maxP].forEach(p=>{
      const i=Math.round((p-minP)/(maxP-minP)*steps);
      ctx.fillStyle=dark?'#A0A098':'#3A3A35';
      ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText('$'+Math.round(p/1000)+'k',xp(i),H-pad.b+4);
    });

    ctx.fillStyle='rgba(163,45,45,0.7)';ctx.font='9px sans-serif';ctx.textAlign='left';ctx.textBaseline='bottom';
    ctx.fillText('break-even',pad.l+2,zeroY-2);
  }

  ['b11-s114-btc','b11-s114-elec','b11-s114-hash','b11-s114-watt'].forEach(id=>{
    const el=g(id); if(el) el.addEventListener('input',calc);
  });

  document.querySelectorAll('.b11-s114-preset').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b11-s114-preset').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const h=g('b11-s114-hash'); if(h) h.value=btn.dataset.hash;
      const w=g('b11-s114-watt'); if(w) w.value=btn.dataset.watt;
      calc();
    });
  });

  calc();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(calc)).observe(g('b11-s114-cv')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.3 SIMULATION (Mining Pool vs Solo)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const BLOCKS=20, SOLO_PROB=0.01, MY_SHARE=0.01, POOL_FEE=0.02, REWARD=3.125;

  let soloData=[], poolData=[], shareData=[], running=false;

  function drawChart(cvId, data, color, maxVal){
    const cv=g(cvId); if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    const H=100;
    cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext('2d');
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);
    if(data.length<1) return;
    const max=Math.max(maxVal,...data,0.01);
    const bw=W/BLOCKS;
    data.forEach((v,i)=>{
      const bh=Math.round((v/max)*(H-10));
      const x=i*bw+1, y=H-bh-2;
      ctx.fillStyle=v>0?color:'rgba(160,160,152,0.15)';
      ctx.globalAlpha=v>0?0.85:0.4;
      ctx.fillRect(x,y,bw-2,bh);
      ctx.globalAlpha=1;
    });
    ctx.beginPath();ctx.moveTo(0,H-2);ctx.lineTo(W,H-2);
    ctx.strokeStyle='rgba(160,160,152,0.2)';ctx.lineWidth=0.5;ctx.stroke();
  }

  function renderShares(){
    const el=g('b11-s113-shares'); if(!el) return;
    el.innerHTML=shareData.map(s=>`<div class="b11-s113-share ${s}"></div>`).join('');
  }

  function updateStats(){
    const soloBlocks=soloData.filter(v=>v>0).length;
    const soloTotal=soloData.reduce((a,b)=>a+b,0);
    const poolTotal=poolData.reduce((a,b)=>a+b,0);
    const poolRounds=poolData.filter(v=>v>0).length;
    const sb=g('b11-s113-solo-blocks'); if(sb){sb.textContent=`${soloBlocks} / ${soloData.length}`;sb.className='b11-s113-stat-val '+(soloBlocks>2?'s113-good':soloBlocks>0?'s113-warn':'s113-bad');}
    const si=g('b11-s113-solo-income'); if(si){si.textContent=soloTotal.toFixed(4)+' BTC';si.className='b11-s113-stat-val '+(soloTotal>0?'s113-good':'s113-warn');}
    const pr=g('b11-s113-pool-rewards'); if(pr){pr.textContent=`${poolRounds} / ${poolData.length}`;pr.className='b11-s113-stat-val s113-good';}
    const pi=g('b11-s113-pool-income'); if(pi){pi.textContent=poolTotal.toFixed(4)+' BTC';pi.className='b11-s113-stat-val s113-good';}
  }

  async function simulate(){
    running=true;
    const rb=g('b11-s113-run'); if(rb) rb.disabled=true;
    soloData=[]; poolData=[]; shareData=[];
    const note=g('b11-s113-note');
    const poolReward=+(REWARD*MY_SHARE*(1-POOL_FEE)).toFixed(6);

    for(let b=0;b<BLOCKS;b++){
      const soloWin=Math.random()<SOLO_PROB;
      soloData.push(soloWin?REWARD:0);
      poolData.push(poolReward);

      const sharesPerBlock=40;
      const myIdx=Math.floor(Math.random()*sharesPerBlock);
      const winIdx=Math.floor(Math.random()*sharesPerBlock);
      for(let s=0;s<sharesPerBlock;s++){
        if(s===winIdx) shareData.push('winning');
        else if(s===myIdx) shareData.push('mine');
        else shareData.push('normal');
      }

      drawChart('b11-s113-cv-solo',soloData,'#854F0B',REWARD);
      drawChart('b11-s113-cv-pool',poolData,'#0F6E56',poolReward*2);
      renderShares(); updateStats();

      if(note){
        note.textContent=`Block ${b+1}/${BLOCKS}: ${soloWin?'Solo miner menemukan block! +'+REWARD+' BTC':'Solo miner tidak menemukan block (0 BTC)'}. Pool memberikan ${poolReward} BTC.`;
        note.className='b11-s113-note s113-run';
      }
      await new Promise(r=>setTimeout(r,300));
    }

    const soloTotal=soloData.reduce((a,b)=>a+b,0);
    const poolTotal=poolData.reduce((a,b)=>a+b,0);
    const soloBlocks=soloData.filter(v=>v>0).length;
    if(note){
      note.textContent=`Simulasi selesai! Solo: ${soloBlocks} block ditemukan, total ${soloTotal.toFixed(4)} BTC. Pool: ${BLOCKS} kali menerima reward, total ${poolTotal.toFixed(4)} BTC. Total pendapatan jangka panjang hampir sama, tapi pool jauh lebih predictable.`;
      note.className='b11-s113-note s113-done';
    }
    running=false;
    if(rb) rb.disabled=false;
  }

  const runBtn=g('b11-s113-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) simulate();});
  const rstBtn=g('b11-s113-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(running) return;
    soloData=[]; poolData=[]; shareData=[];
    drawChart('b11-s113-cv-solo',[],'#854F0B',REWARD);
    drawChart('b11-s113-cv-pool',[],'#0F6E56',0.03);
    renderShares(); updateStats();
    ['b11-s113-solo-blocks','b11-s113-pool-rewards'].forEach(id=>{const el=g(id);if(el) el.textContent='0 / 0';});
    ['b11-s113-solo-income','b11-s113-pool-income'].forEach(id=>{const el=g(id);if(el) el.textContent='0 BTC';});
    if(runBtn) runBtn.disabled=false;
    const note=g('b11-s113-note');
    if(note){note.textContent='Kamu punya 1% dari hash rate jaringan. Sebagai solo miner, probabilitas menemukan block sangat rendah. Bergabung ke pool memastikan pendapatan kecil tapi konsisten setiap block.';note.className='b11-s113-note s113-idle';}
  });

  drawChart('b11-s113-cv-solo',[],'#854F0B',REWARD);
  drawChart('b11-s113-cv-pool',[],'#0F6E56',0.03);
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      drawChart('b11-s113-cv-solo',soloData,'#854F0B',REWARD);
      drawChart('b11-s113-cv-pool',poolData,'#0F6E56',0.03);
    })).observe(g('b11-s113-cv-solo')||document.body);
  }
})();

// ============================================================
// PAGE 14 · BAB 11 · 11.2 SIMULATION (Hardware Evolution)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const ERAS=[
    {icon:'💻',name:'CPU Mining',period:'2009-2010',
     hashrate:'~10 MH/s',efficiency:'~0.002 MH/W',cost:'Laptop biasa',color:'#52524C',
     desc:'Di awal Bitcoin, semua mining dilakukan dengan CPU laptop atau desktop. Satoshi sendiri mining dengan CPU. Hash rate seluruh jaringan sangat rendah — siapapun bisa mining block dalam hitungan menit. Tidak ada persaingan berarti.'},
    {icon:'🎮',name:'GPU Mining',period:'2010-2013',
     hashrate:'~500 MH/s',efficiency:'~0.3 MH/W',cost:'Kartu grafis gaming',color:'#854F0B',
     desc:'GPU bisa melakukan ribuan operasi paralel sekaligus, jauh lebih cocok untuk SHA-256 dibanding CPU. Hash rate melonjak 50x lipat. CPU mining praktis tidak lagi menguntungkan. Banyak miner membangun rig dengan banyak GPU sekaligus.'},
    {icon:'🔧',name:'FPGA Mining',period:'2011-2013',
     hashrate:'~1 GH/s',efficiency:'~1.5 MH/W',cost:'Chip programmable khusus',color:'#534AB7',
     desc:'FPGA bisa diprogram khusus untuk SHA-256, lebih efisien dari GPU. Tapi era ini singkat karena ASIC yang jauh lebih efisien segera hadir. FPGA menjadi jembatan antara GPU dan ASIC.'},
    {icon:'⚡',name:'ASIC Mining',period:'2013-sekarang',
     hashrate:'200+ TH/s',efficiency:'~57 TH/W',cost:'Mesin industri khusus',color:'#0F6E56',
     desc:'ASIC dirancang dari nol hanya untuk SHA-256. Tidak bisa digunakan untuk hal lain. Hasilnya: efisiensi yang jauh melampaui semua teknologi sebelumnya. ASIC modern mencapai 200+ TH/s. Mining kini didominasi perusahaan besar dengan fasilitas industri.'},
  ];

  function renderDetail(i){
    const e=ERAS[i];
    const el=g('b11-s112-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b11-s112-detail-head" style="background:${e.color}18;">
        <div class="b11-s112-detail-icon">${e.icon}</div>
        <div>
          <div class="b11-s112-detail-title" style="color:${e.color};">${e.name}</div>
          <div class="b11-s112-detail-sub">${e.period}</div>
        </div>
      </div>
      <div class="b11-s112-detail-body">
        <div class="b11-s112-metrics">
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Hash rate tipikal</div><div class="b11-s112-metric-val" style="color:${e.color};">${e.hashrate}</div></div>
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Efisiensi energi</div><div class="b11-s112-metric-val" style="color:${e.color};">${e.efficiency}</div></div>
          <div class="b11-s112-metric"><div class="b11-s112-metric-label">Hardware</div><div class="b11-s112-metric-val" style="color:${e.color};font-size:11px;">${e.cost}</div></div>
        </div>
        <div class="b11-s112-era-desc">${e.desc}</div>
      </div>`;
  }

  function setActive(i){
    document.querySelectorAll('.b11-s112-era').forEach((el,idx)=>{
      el.className='b11-s112-era'+(idx===i?' active':'');
    });
    renderDetail(i);
  }

  document.querySelectorAll('.b11-s112-era').forEach(el=>{
    el.addEventListener('click',()=>setActive(parseInt(el.dataset.era)));
  });

  setActive(0);
})();

// ============================================================

