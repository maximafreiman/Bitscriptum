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
      {country:'United States',   pct:7, color:'#534AB7'},
      {country:'Russia',          pct:7, color:'#534AB7'},
      {country:'Kazakhstan',     pct:6, color:'#854F0B'},
      {country:'Malaysia',       pct:4, color:'#854F0B'},
      {country:'Other',           pct:11,color:'#52524C'},
    ],
    after:[
      {country:'United States',   pct:38,color:'#0F6E56'},
      {country:'Kazakhstan',     pct:14,color:'#534AB7'},
      {country:'Russia',          pct:11,color:'#534AB7'},
      {country:'Canada',         pct:7, color:'#534AB7'},
      {country:'Germany',         pct:4, color:'#854F0B'},
      {country:'Other',           pct:26,color:'#52524C'},
    ],
  };
  const GEO_NOTES={
    before:'Before the China ban (May 2021): China dominated ~65% of global hashrate, largely because of cheap hydropower in Sichuan and Yunnan. This high concentration in one country was a concern from a network resilience perspective.',
    after:'After the China ban (2021) and the migration: hashrate spread to more countries. The United States became the country with the largest hashrate. A broader distribution improves resilience to any local regulation.',
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
    {cls:'s195-d-idle',  label:'Initial Condition',
     title:'All miners work on the same block',
     text:'The network and the selfish miner are both working on top of block #100. The selfish miner has 35% hashrate, above the ~33% threshold.',
     analogy:'Like a footrace: all runners start from the same line.',
     chains:[
       {name:'Network (honest)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'}]},
       {name:'Selfish Miner',   cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'}]},
     ]},
    {cls:'s195-d-selfish',label:'Step 1',
     title:'The selfish miner finds #101 — but hides it',
     text:'The selfish miner finds block #101 first. Instead of propagating it, they keep it and continue working secretly on top of this hidden block.',
     analogy:'Like a runner secretly running on a hidden track while competitors are still on the normal track.',
     chains:[
       {name:'Network (still on #100)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'}]},
       {name:'Selfish Miner',          cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-selfish',label:'Step 2',
     title:'The selfish miner finds #102 — the network doesn’t know about #101 yet',
     text:'The selfish miner now has two hidden blocks. The network is still working on #100. A two-block lead is the ideal condition for the attack.',
     analogy:'The hidden runner is already two turns ahead. The competitors don’t know yet.',
     chains:[
       {name:'Network',     cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'?',c:'s195-b-network'},{t:'?',c:'s195-b-network'}]},
       {name:'Selfish Miner',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-hidden'},{t:'#102',c:'s195-b-hidden'}]},
     ]},
    {cls:'s195-d-result',label:'Step 3',
     title:'The network is about to find #101 — the selfish miner publishes their chain',
     text:'When the network gets close to block #101, the selfish miner immediately propagates their hidden chain. The selfish chain is longer — all nodes switch. The network’s work is orphaned.',
     analogy:'The cheating runner appears in front of the finish line just as the competitors are about to arrive.',
     chains:[
       {name:'Network chain (orphaned!)',cls:'s195-cn-network',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-orphan'}]},
       {name:'Winning chain (selfish)', cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
     ]},
    {cls:'s195-d-result',label:'Result',
     title:'The selfish miner gets 2 rewards, the network loses 1 reward',
     text:'The network’s work on #101 is lost. The selfish miner gets the reward for #101 and #102 despite having only 35% hashrate — proportionally more than their fair share.',
     analogy:'The cheating runner wins two prizes. The honest runners get nothing despite working hard.',
     chains:[
       {name:'Final result — the selfish chain wins',cls:'s195-cn-selfish',blocks:[{t:'#100',c:'s195-b-public'},{t:'#101',c:'s195-b-win'},{t:'#102',c:'s195-b-win'}]},
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
    const hrEl=g('b19-s195-honest-rev');if(hrEl) hrEl.textContent=pct+'% of total';
    const srEl=g('b19-s195-selfish-rev');if(srEl) srEl.textContent='~'+sr+'%';
    const ssEl=g('b19-s195-selfish-sub');
    const verdict=g('b19-s195-verdict');const vlEl=g('b19-s195-verdict-label');const vtEl=g('b19-s195-verdict-text');
    if(sr>pct+0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-danger';
      if(vlEl) vlEl.textContent='Selfish mining is PROFITABLE at this hashrate';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected selfish revenue (~${sr}%) is higher than honest (${pct}%). The extra gain comes from other miners’ work being orphaned.`;
      if(ssEl) ssEl.textContent='higher than honest mining';
    } else if(sr>pct-0.5){
      if(verdict) verdict.className='b19-s195-verdict s195-v-warn';
      if(vlEl) vlEl.textContent='Borderline zone — barely profitable';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected selfish revenue (~${sr}%) is almost the same as honest (${pct}%). The risk and complexity aren’t worth it.`;
      if(ssEl) ssEl.textContent='almost the same as honest mining';
    } else {
      if(verdict) verdict.className='b19-s195-verdict s195-v-safe';
      if(vlEl) vlEl.textContent='Selfish mining is NOT profitable at this hashrate';
      if(vtEl) vtEl.textContent=`With ${pct}% hashrate, the expected honest revenue (${pct}%) is higher than selfish (~${sr}%). At low hashrate, the risk of the hidden block being orphaned is greater.`;
      if(ssEl) ssEl.textContent='lower than honest mining';
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
      res.textContent=`Propagation ${pct}%: the selfish mining threshold rises to ~${threshold}%+ hashrate. The faster blocks spread, the harder it is for selfish mining to be profitable. Compact blocks contribute directly to this.`;
    } else if(pct>=40){
      res.className='b19-s195-prop-result s195-pr-mid';
      res.textContent=`Propagation ${pct}%: the selfish mining threshold is around ~${threshold}% hashrate. Still concerning if there’s a pool with large hashrate.`;
    } else {
      res.className='b19-s195-prop-result s195-pr-bad';
      res.textContent=`Propagation ${pct}% (slow): the selfish mining threshold drops to ~${threshold}% hashrate. Slow propagation gives the selfish miner more time to exploit their lead.`;
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
    if(days<1) return (days*24).toFixed(1)+' hours';
    if(days<365) return days.toFixed(1)+' days';
    const y=days/365;
    return y<1000?y.toFixed(1)+' years':'>1000 years';
  }
  function fmtBTC(btc){
    if(btc<0.0001) return btc.toExponential(2)+' BTC';
    return btc.toFixed(5)+' BTC';
  }

  function update(){
    const sl=g('b19-s194-hr-sl');if(!sl) return;
    const val=parseInt(sl.value);
    const hashrateTH=val*100;
    const label=hashrateTH>=1000?(hashrateTH/1000).toFixed(1)+' PH/s ('+hashrateTH.toLocaleString('en-US')+' TH/s)':hashrateTH+' TH/s';
    const vEl=g('b19-s194-hr-val');if(vEl) vEl.textContent=label;

    const soloDays=calcSoloDays(hashrateTH);
    const poolDaily=calcPoolDaily(hashrateTH);
    const poolWeekly=poolDaily*7;

    const st=g('b19-s194-solo-time');if(st) st.textContent='~'+fmtTime(soloDays);
    const pi=g('b19-s194-pool-income');if(pi) pi.textContent='~'+fmtBTC(poolDaily)+'/day';

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
      row.innerHTML=`<div class="b19-s194-tl-week">Week ${w}</div>
        <div class="b19-s194-tl-solo-wrap"><div class="b19-s194-tl-solo-bar" style="width:${soloWidth}%;"></div></div>
        <div class="b19-s194-tl-pool-wrap"><div class="b19-s194-tl-pool-bar" style="width:${poolWidth}%;"></div></div>`;
      el.appendChild(row);
    }

    const note=g('b19-s194-note');
    if(note) note.textContent=`With ${label} hashrate, a solo miner needs an average of ${fmtTime(soloDays)} to find one block. In a pool, income arrives consistently ${fmtBTC(poolDaily)}/day — the long-term total is the same, but the variance is far lower.`;
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
      {era:'2016 — 12.5 BTC', reward:12.5},
      {era:'2020 — 6.25 BTC', reward:6.25},
      {era:'2024 — 3,125 BTC',reward:3.125},
      {era:'2028 — 1.56 BTC', reward:1.5625},
      {era:'2032 — 0.78 BTC', reward:0.7813},
      {era:'2036 — 0.39 BTC', reward:0.3906},
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
    if(n>=1e9) return '$'+(n/1e9).toFixed(1)+'B';
    if(n>=1e6) return '$'+(n/1e6).toFixed(1)+'M';
    if(n>=1e3) return '$'+(n/1e3).toFixed(0)+'K';
    return '$'+n.toFixed(0);
  }

  function update(){
    const psl=g('b19-s193-price-sl');const fsl=g('b19-s193-fee-sl');
    if(!psl||!fsl) return;
    const price=parseInt(psl.value);
    const fee=parseInt(fsl.value)/100;
    const REWARD=3.125;

    const pv=g('b19-s193-price-val');if(pv) pv.textContent='$'+price.toLocaleString('en-US');
    const fv=g('b19-s193-fee-val'); if(fv) fv.textContent=fee.toFixed(2)+' BTC';

    const rewardPB=REWARD*price;
    const feePB=fee*price;
    const totalAnnual=(rewardPB+feePB)*BLOCKS_PER_YEAR;

    const rv=g('b19-s193-reward-usd');if(rv) rv.textContent=fmtUSD(rewardPB)+'/block';
    const rs=g('b19-s193-reward-sub');if(rs) rs.textContent=REWARD+' BTC × $'+price.toLocaleString('en-US');
    const fv2=g('b19-s193-fee-usd'); if(fv2) fv2.textContent=fmtUSD(feePB)+'/block';
    const tv=g('b19-s193-total-usd');if(tv)  tv.textContent=fmtUSD(totalAnnual)+'/yr';

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
     note:'Bitcoin’s early era. Almost no transactions besides the coinbase. Fees were practically zero because the network was still very small. The 50 BTC block reward dominated 100% of revenue.'},
    {key:'2012',label:'2012 (Halving 1)',reward:25,   fee:0.01,
     note:'After the first halving. Fees started to appear but were still very small. The block reward dropped to 25 BTC, but the Bitcoin price began to rise so the dollar value remained attractive to miners.'},
    {key:'2016',label:'2016 (Halving 2)',reward:12.5, fee:0.05,
     note:'After the second halving. The network started to get busier. Fees became significant during congestion periods but were still below 1% of total revenue on average.'},
    {key:'2020',label:'2020 (Halving 3)',reward:6.25, fee:0.15,
     note:'After the third halving. Fees began to play a larger role, especially during high-congestion periods. The block reward was still very dominant at around 97-98% of total revenue.'},
    {key:'2024',label:'2024 (Halving 4)',reward:3.125,fee:0.15,
     note:'After the fourth halving (April 2024). The block reward is now 3.125 BTC. Fees remain fluctuating. The proportion of fees in total revenue increases as a percentage because the block reward shrinks, not because fees rise drastically.'},
    {key:'2140',label:'2140 (Protocol endpoint)',reward:0,fee:0.3,
     note:'The mathematical consequence of the halving schedule fixed since the genesis block: the block reward reaches zero. Miners depend entirely on fees. Whether fees alone are enough to secure the network is the most important open question in long-term Bitcoin economics.'},
  ];

  function renderEra(key){
    const d=ERAS.find(e=>e.key===key);if(!d) return;
    const total=d.reward+d.fee;
    const rewardPct=total>0?Math.round(d.reward/total*100):0;
    const feePct=total>0?Math.round(d.fee/total*100):0;

    const rv=g('b19-s191-reward-val');if(rv) rv.textContent=d.reward>0?d.reward+' BTC':'0 BTC';
    const fv=g('b19-s191-fee-val');if(fv) fv.textContent='~'+d.fee+' BTC';
    const pv=g('b19-s191-pct-val');if(pv) pv.textContent='~'+feePct+'%';
    const ps=g('b19-s191-pct-sub');if(ps) ps.textContent=feePct===0?'fees almost nonexistent':feePct===100?'100% from fees alone':'the rest from the block reward';

    const br=g('b19-s191-bar-r');const bf=g('b19-s191-bar-f');
    const brt=g('b19-s191-bar-r-txt');const bft=g('b19-s191-bar-f-txt');
    if(br) br.style.width=rewardPct+'%';
    if(bf) bf.style.width=Math.max(feePct,feePct>0?3:0)+'%';
    if(brt) brt.textContent=rewardPct>20?'Block Reward '+rewardPct+'%':'';
    if(bft) bft.textContent=feePct>8?'Fee '+feePct+'%':'';

    const note=g('b19-s191-note');if(note) note.textContent=d.note;
    const cr=g('b19-s191-cb-reward');
    if(cr) cr.textContent=d.reward>0?d.reward+' BTC':'0 BTC (protocol endpoint)';

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
      adjustLabel:'+100% (2×)',adjustSub:'up: blocks harder',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'7 days (10,080 minutes)',desc:'Hashrate 2× higher, blocks found 2× faster'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'0.5 (7 ÷ 14)',desc:'Below 1.0 means blocks too fast, difficulty must rise'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× harder',desc:'New target = old target × 0.5, valid hash must be smaller'},
      ],
      chart:[
        {epoch:'Epoch N',  days:7, color:'#854F0B',label:'7 days (too fast)'},
        {epoch:'Epoch N+1',days:10,color:'#0F6E56',label:'~10 days'},
        {epoch:'Epoch N+2',days:13,color:'#0F6E56',label:'~13 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 days (stable)'},
      ],
    },
    down50:{
      col:'s192-sc-down',actualDays:28,
      adjustLabel:'-50% (0.5×)',adjustSub:'down: blocks easier',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'28 days (40,320 minutes)',desc:'Hashrate down 50%, blocks found 2× slower'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'2.0 (28 ÷ 14)',desc:'Above 1.0 means blocks too slow, difficulty must fall'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'2× easier',desc:'New target = old target × 2.0, valid hash can be larger'},
      ],
      chart:[
        {epoch:'Epoch N',  days:28,color:'#A32D2D',label:'28 days (too slow)'},
        {epoch:'Epoch N+1',days:18,color:'#854F0B',label:'~18 days'},
        {epoch:'Epoch N+2',days:15,color:'#0F6E56',label:'~15 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'~14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'~14 days (stable)'},
      ],
    },
    same:{
      col:'s192-sc-same',actualDays:14,
      adjustLabel:'0% (1×)',adjustSub:'unchanged',afterLabel:'~10 minutes',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'14 days (20,160 minutes)',desc:'Hashrate stable, blocks found exactly on target'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio of actual / target time',val:'1.0 (14 ÷ 14)',desc:'Exactly 1.0 means no adjustment is needed'},
        {cls:'s192-cs-result',num:'4',title:'New difficulty',val:'Unchanged',desc:'New target = old target × 1.0, difficulty identical'},
      ],
      chart:[
        {epoch:'Epoch N',  days:14,color:'#0F6E56',label:'14 days (exact)'},
        {epoch:'Epoch N+1',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+2',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+3',days:14,color:'#0F6E56',label:'14 days'},
        {epoch:'Epoch N+4',days:14,color:'#0F6E56',label:'14 days'},
      ],
    },
    up5x:{
      col:'s192-sc-up',actualDays:2.8,
      adjustLabel:'+300% (4×, capped)',adjustSub:'protocol limit applied',afterLabel:'Needs ~4 epochs',
      steps:[
        {cls:'s192-cs-input', num:'1',title:'Target time per epoch',val:'14 days (20,160 minutes)',desc:'2,016 blocks × 10 minutes = 20,160 minutes'},
        {cls:'s192-cs-actual',num:'2',title:'Actual time this epoch',val:'~2.8 days (4,032 minutes)',desc:'Hashrate 5× higher, blocks found very fast'},
        {cls:'s192-cs-ratio', num:'3',title:'Ratio before the limit',val:'0.2 (2.8 ÷ 14)',desc:'This means difficulty must rise 5× but there’s a maximum limit'},
        {cls:'s192-cs-cap',   num:'4',title:'Protocol limit applied',val:'max(0.25 ; min(4.0 ; 0.2)) = 0.25',desc:'The 0.2 ratio is below the 0.25 minimum limit. The protocol forces ratio = 0.25'},
        {cls:'s192-cs-result s192-warn',num:'5',title:'New difficulty (capped)',val:'4× harder (not 5×)',desc:'It needs a few epochs to fully stabilize. This is network protection.'},
      ],
      chart:[
        {epoch:'Epoch N',  days:2.8,color:'#A32D2D',label:'2.8 days (very fast)'},
        {epoch:'Epoch N+1',days:7,  color:'#854F0B',label:'~7 days (4× cap)'},
        {epoch:'Epoch N+2',days:11, color:'#0F6E56',label:'~11 days'},
        {epoch:'Epoch N+3',days:13, color:'#0F6E56',label:'~13 days'},
        {epoch:'Epoch N+4',days:14, color:'#0F6E56',label:'~14 days (stable)'},
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
    const at=g('b19-s192-actual-time');if(at) at.textContent=sc.actualDays+' days';
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
        <div class="b19-s192-chart-val">${r.days} days</div>`;
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



