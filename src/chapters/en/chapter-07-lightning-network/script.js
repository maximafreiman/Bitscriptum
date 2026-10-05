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
    t1: { label:'Bitcoin', note:'Bitcoin chooses decentralization and security fully. Scalability is delegated to the layer above it. This is a deliberate trade-off, not a weakness.', noteClass:'bitcoin', fill:[1.0,1.0,0.1], color:PURP, label2:'Chooses decentralization + security', tabClass:'active' },
    t2: { label:'Bitcoin + Lightning', note:'The Lightning Network adds scalability on top of Bitcoin without sacrificing decentralization or security. Bitcoin remains the secure settlement layer.', noteClass:'lightning', fill:[1.0,1.0,0.9], color:GREEN, label2:'The trilemma met together', tabClass:'active-green' },
    t3: { label:'Other approaches', note:'Approaches that prioritize scalability usually have to sacrifice decentralization (big blocks = expensive nodes) or security (selected validators, checkpoints).', noteClass:'others', fill:[0.25,0.5,0.95], color:RED, label2:'Scalable but sacrifices the others', tabClass:'active-red' },
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
    const labels = ['Decentralization','Security','Scalability'];
    const sublabels = ['many independent nodes','strong cryptography, PoW','fast & cheap transactions'];

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
    const items=[{color:PURP,label:'Bitcoin'},{color:GREEN,label:'Bitcoin + Lightning'},{color:RED,label:'Other approaches'}];
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
    1:{head:'Phase 1 · Open Channel (Funding Transaction)',note:'One on-chain transaction locks 0.1 BTC in a 2-of-2 multisig. No one can take the funds without both signatures. The channel is officially open.',noteClass:'info-note',
      rows:[{k:'Transaction type',v:'Funding transaction',cls:'purp'},{k:'On-chain',v:'Yes — recorded on the blockchain',cls:'purp'},{k:'Multisig',v:'2-of-2 (Alice + Bob)',cls:'purp'},{k:'Total locked',v:'0.1 BTC (0.05 Alice + 0.05 Bob)',cls:'purp'},{k:'Initial state',v:'Alice: 0.05 BTC | Bob: 0.05 BTC',cls:'purp'}],txs:null},
    2:{head:'Phase 2 · Transactions within the Channel (Off-chain)',note:'All transactions happen off-chain. The old state is revoked on each update — if Alice tries to broadcast an old state, Bob can claim all the channel funds as a penalty.',noteClass:'success-note',
      txs:[{label:'Alice → Bob',cls:'purp',amount:'0.010 BTC',result:'Alice: 0.040 | Bob: 0.060'},{label:'Alice → Bob',cls:'purp',amount:'0.005 BTC',result:'Alice: 0.035 | Bob: 0.065'},{label:'Bob → Alice',cls:'green',amount:'0.002 BTC',result:'Alice: 0.037 | Bob: 0.063'},{label:'Alice → Bob',cls:'purp',amount:'0.007 BTC',result:'Alice: 0.030 | Bob: 0.070'}],
      rows:[{k:'Transaction type',v:'Commitment transaction (off-chain)',cls:'green'},{k:'On-chain',v:'No — only exchanged between parties',cls:'green'},{k:'Number of transactions',v:'4 transactions, 0 on-chain',cls:'green'},{k:'Final state',v:'Alice: 0.03 BTC | Bob: 0.07 BTC',cls:'green'},{k:'Revocation',v:'The old state has been revoked — cannot be used',cls:'green'}]},
    3:{head:'Phase 3 · Close Channel (Settlement Transaction)',note:'Just one more on-chain transaction to close the channel. Total: 2 on-chain transactions for all the off-chain transactions. The blockchain fee is paid only twice.',noteClass:'warning-note',
      rows:[{k:'Transaction type',v:'Closing transaction',cls:'amber'},{k:'On-chain',v:'Yes — records the final balance',cls:'amber'},{k:'Alice receives',v:'0.03 BTC',cls:'purp'},{k:'Bob receives',v:'0.07 BTC',cls:'green'},{k:'Total on-chain',v:'2 transactions for the entire channel',cls:'amber'}],txs:null},
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

  /* ---- The "try cheating" branch: demonstrates the penalty transaction ----
     The prose in 7.2 claims cheating makes no economic sense.
     Here the reader can try it and watch the consequence. */
  const CHEAT = [
    {n:'1', cls:'bad', t:'Alice broadcasts an <b>old commitment transaction</b> to the blockchain, the version from when she still held 0.05 BTC.'},
    {n:'2', cls:'bad', t:'That transaction is <b>technically valid</b>. The blockchain accepts it. So far Alice appears to have gotten away with it.'},
    {n:'3', cls:'ok',  t:'But her funds do not settle immediately. They are locked by a <b>timelock</b> for hundreds of blocks, roughly a day.'},
    {n:'4', cls:'ok',  t:'Bob\u2019s node sees the old state appear on the blockchain, and he holds the <b>revocation key</b> Alice handed over when that state was revoked.'},
    {n:'5', cls:'ok',  t:'Before Alice\u2019s timelock expires, Bob broadcasts a <b>penalty transaction</b> using that key.'},
    {n:'6', cls:'ok',  t:'Bob takes <b>the entire channel</b>, 0.1 BTC. Alice gets nothing, not even the 0.03 BTC that was rightfully hers.'},
  ];
  const HONEST = [
    {n:'1', cls:'ok', t:'Alice and Bob both sign a <b>closing transaction</b> with the latest balances.'},
    {n:'2', cls:'ok', t:'One on-chain transaction, <b>no timelock</b>, no waiting period.'},
    {n:'3', cls:'ok', t:'Both receive what they are owed. Alice 0.03 BTC, Bob 0.07 BTC.'},
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
  const OUT_CHEAT='<div class="b07-s72-out lose"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.00 BTC</div><div class="b07-s72-out-tag">loses everything, including what was hers</div></div>'+
                  '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.10 BTC</div><div class="b07-s72-out-tag">the entire channel</div></div>';
  const OUT_HONEST='<div class="b07-s72-out win"><div class="b07-s72-out-name">Alice</div><div class="b07-s72-out-val">0.03 BTC</div><div class="b07-s72-out-tag">her latest balance</div></div>'+
                   '<div class="b07-s72-out win"><div class="b07-s72-out-name">Bob</div><div class="b07-s72-out-val">0.07 BTC</div><div class="b07-s72-out-tag">his latest balance</div></div>';
  const Q_AWAL='Alice\u2019s balance has dropped from 0.05 to 0.03 BTC. Her computer still holds the old state from when she had 0.05. Why doesn\u2019t she just broadcast that one instead? Go ahead and try, and see what happens.';
  const Q_CURANG='This is why cheating makes no sense. Alice risks the 0.03 BTC that is already certainly hers, for a shot at 0.05 BTC, and if it fails she loses all of it. No rule stops her from trying. Her own arithmetic does.';
  const Q_JUJUR='Closing honestly is far cheaper and faster: one transaction, no waiting period. Compare it against the cheating path next to it.';

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
    {l:'1 · Carol creates a secret',h:'Step 1 — Carol creates a secret R',d:'Carol creates a secret R that only she knows, then computes <b>H = hash(R)</b>. H is the padlock. R is the key. Carol gives H to Alice as the invoice.',nt:'This is the first step. Only Carol holds the secret key.',nc:'p',nd:[{n:'Alice',c:'a',b:'0.10 BTC',bc:'p',s:'Has H (the padlock) from Carol',hc:'No HTLC yet',hs:'no'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Not involved yet',hc:'No HTLC yet',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Has R (the secret key)\nHas H = hash(R)',hc:'R stored safely',hs:'ul'}],ar:[{l:'Alice → Bob',v:'none yet',vc:'d'},{l:'Bob → Carol',v:'none yet',vc:'d'}],hl:[2],hlg:true},
    {l:'2 · Alice locks to Bob',h:'Step 2 — Alice locks funds to Bob (HTLC 1)',d:'Alice says to Bob: <b>"You get 0.01 BTC if you can show R whose hash is H — but if you can’t within 24 hours, the money comes back to me."</b> Alice’s funds are locked. Bob hasn’t got anything yet.',nt:'The first HTLC is formed. Bob can’t run off with Alice’s money because he doesn’t have it yet.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC locked in the HTLC',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Waiting — has H from Alice',hc:'Nothing yet',hs:'no'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Waiting on Bob',hc:'Has R (the key)',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (locked)',vc:'p'},{l:'Bob → Carol',v:'none yet',vc:'d'}],hl:[0,1]},
    {l:'3 · Bob locks to Carol',h:'Step 3 — Bob locks funds to Carol (HTLC 2)',d:'Bob knows Carol has R, so Bob says to Carol: <b>"You get 0.01 BTC if you show R — but if there’s none within 12 hours, the money comes back to me."</b> Bob’s timelock to Carol (12 hours) is shorter than Alice’s to Bob (24 hours).',nt:'Two HTLCs are formed. The only way to unwind everything: Carol reveals R.',nc:'m',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'0.01 BTC locked in the HTLC',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'0.01 BTC locked to Carol',hc:'lock: hash(R) | 12 hours',hs:'lk'},{n:'Carol',c:'c',b:'0.00 BTC',bc:'g',s:'Ready to reveal R to claim',hc:'Has R — ready to claim!',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (locked)',vc:'p'},{l:'Bob → Carol',v:'HTLC: 0.01 BTC (locked)',vc:'p'}],hl:[1,2],hlg:true},
    {l:'4 · Carol reveals R',h:'Step 4 — Carol reveals R, claims the payment',d:'Carol shows R to Bob. Bob verifies: hash(R) = H? ✓ <b>Carol gets 0.01 BTC.</b> Bob now knows R and can use it to claim from Alice.',nt:'Funds flow to Carol. Bob doesn’t lose out because he still has a claim on Alice.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Waiting for Bob to claim',hc:'lock: hash(R) | 24 hours',hs:'lk'},{n:'Bob',c:'b',b:'0.09 BTC',bc:'m',s:'Got R from Carol!\nReady to claim from Alice',hc:'Has R — ready to claim Alice',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Success! Got 0.01 BTC ✓',hc:'HTLC complete ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'HTLC: 0.01 BTC (still locked)',vc:'p'},{l:'Bob → Carol',v:'✓ Carol claims 0.01 BTC',vc:'g'}],hl:[1,2],hlg:true},
    {l:'5 · Bob claims from Alice',h:'Step 5 — Bob reveals R to Alice, payment complete',d:'Bob shows R to Alice. Alice verifies: hash(R) = H? ✓ <b>Bob gets 0.01 BTC back.</b> The payment is complete. No trust was needed.',nt:'✅ Alice → Bob → Carol. Two HTLCs, zero trust, guaranteed by mathematics.',nc:'g',nd:[{n:'Alice',c:'a',b:'0.09 BTC',bc:'p',s:'Payment complete ✓',hc:'HTLC complete ✓',hs:'ul'},{n:'Bob',c:'b',b:'0.10 BTC',bc:'m',s:'Balance back to normal ✓',hc:'HTLC complete ✓',hs:'ul'},{n:'Carol',c:'c',b:'0.01 BTC',bc:'g',s:'Received 0.01 BTC ✓',hc:'HTLC complete ✓',hs:'ul'}],ar:[{l:'Alice → Bob',v:'✓ Bob claims 0.01 BTC',vc:'g'},{l:'Bob → Carol',v:'✓ Carol claims 0.01 BTC',vc:'g'}],hl:[0,1,2],hlg:true},
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
    c1:{head:'Cooperative close — both parties agree',note:'The best and most common way. No waiting, no risk. Both parties negotiate the fee and sign a closing transaction together.',nc:'g',cls:'coop',rows:[{k:'Who can',v:'Both parties, anytime',vc:''},{k:'Requirement',v:'Both parties must be online and agree',vc:''},{k:'Output',v:'Directly to each wallet',vc:'g'},{k:'Wait time',v:'None — right after confirmation',vc:'g'},{k:'Fee',v:'One transaction, cheapest',vc:'g'}],steps:[{n:'1',c:'g',t:'Alice and Bob negotiate the closing transaction fee'},{n:'2',c:'g',t:'Both sign the closing transaction'},{n:'3',c:'g',t:'One on-chain transaction — funds split immediately'}]},
    c2:{head:'Force close — one party is uncooperative',note:'Used when the other party disappears or won’t respond. Slower and more expensive because it needs two transactions and must wait out a time-lock.',nc:'m',cls:'force',rows:[{k:'Who starts',v:'One party unilaterally',vc:''},{k:'Transaction 1',v:'Commitment transaction — broadcast the latest state',vc:'m'},{k:'Time-lock',v:'~144 blocks (~1 day) — must wait',vc:'m'},{k:'Transaction 2',v:'Sweep transaction — take funds after the time-lock',vc:'m'},{k:'Why a time-lock',v:'Gives the other party time to detect cheating',vc:''}],steps:[{n:'1',c:'m',t:'Alice broadcasts the latest commitment transaction'},{n:'2',c:'m',t:'Bob has time to check — is this state valid?'},{n:'3',c:'m',t:'After the time-lock finishes, Alice sweeps her funds'}]},
    c3:{head:'Penalty close — punishment for the cheater',note:'Happens when someone tries to broadcast an old state. The honest party has a time window to prove the cheating and take ALL the funds.',nc:'r',cls:'pen',rows:[{k:'Trigger',v:'A cheating party broadcasts an old state',vc:'r'},{k:'Detection',v:'A watchtower or an online node detects it',vc:''},{k:'Justice transaction',v:'The honest party broadcasts proof of cheating',vc:'r'},{k:'Outcome for attacker',v:'Loses ALL funds in the channel',vc:'r'},{k:'Outcome for honest party',v:'Gets ALL funds including the attacker’s',vc:'g'}],steps:[{n:'1',c:'r',t:'Bob (cheating) broadcasts an old commitment transaction'},{n:'2',c:'r',t:'Alice detects it — this isn’t the latest state!'},{n:'3',c:'r',t:'Alice broadcasts a justice transaction with the revocation key'},{n:'4',c:'r',t:'Alice takes ALL funds in the channel as a penalty'}]},
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
    prefix:{head:'Network prefix',rows:[{k:'Value',v:'lnbc'},{k:'Meaning',v:'Lightning Network Bitcoin (mainnet)'},{k:'Testnet',v:'lntb — for testing'},{k:'Signet',v:'lntbs — for developers'}]},
    amount:{head:'Payment amount',rows:[{k:'Value',v:'1m'},{k:'Unit',v:'m = milli (0.001 BTC = 100.000 satoshi)'},{k:'Another example',v:'100u = 100 micro = 0.0001 BTC'},{k:'No number',v:'Open amount — the recipient decides'}]},
    timestamp:{head:'Creation timestamp',rows:[{k:'Format',v:'Unix timestamp (seconds)'},{k:'Function',v:'Determines when the invoice was created'},{k:'Combined with',v:'Validity period (expiry) to compute expiration'}]},
    phash:{head:'Payment hash (H)',rows:[{k:'Value',v:'pp5kw5... (32 bytes / 256 bit)'},{k:'Meaning',v:'H = hash(R) — hash of Carol’s secret'},{k:'Function',v:'The "padlock" at every HTLC in the payment chain'},{k:'Cannot be forged',v:'SHA-256 — no one can guess R from H'}]},
    nodeid:{head:'Recipient node ID',rows:[{k:'Value',v:'hz02a7... (33 bytes compressed pubkey)'},{k:'Meaning',v:'The public key of Carol’s Lightning node on the network'},{k:'Function',v:'The sender’s wallet uses this to find a route to Carol'},{k:'Private channel',v:'The invoice can contain routing hints for non-public channels'}]},
    expiry:{head:'Invoice validity period',rows:[{k:'Value',v:'3600 seconds (1 hour)'},{k:'Default',v:'3600 seconds if not specified'},{k:'After expiry',v:'The invoice can’t be used — the recipient creates a new one'},{k:'Why an expiry',v:'Protects the recipient from very delayed payments'}]},
    sig:{head:'Digital signature',rows:[{k:'Type',v:'ECDSA or Schnorr'},{k:'Created by',v:'The recipient node (Carol) with its private key'},{k:'Function',v:'Proves the invoice was really created by the claimed node'},{k:'Verification',v:'The sender’s wallet verifies automatically before paying'}]},
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

