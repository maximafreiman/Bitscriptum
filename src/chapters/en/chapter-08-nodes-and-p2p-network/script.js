// ============================================================
// PAGE 11 · BAB 8 · NAVIGATION
// ============================================================
function showSectionInContentB8(sectionId, sbId) {
  document.querySelectorAll('#page-bab8 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab8 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab8-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 11 · BAB 8 · TOPBAR
// ============================================================
document.getElementById('back-home-b8').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b8').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 11 · BAB 8 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab8').addEventListener('click', () => navigate('page-bab8'));

// ============================================================
// PAGE 11 · BAB 8 · SIDEBAR EVENTS (8.1 - 8.6)
// ============================================================
document.getElementById('sb-8-1').addEventListener('click', () => showSectionInContentB8('section-8-1', 'sb-8-1'));
document.getElementById('sb-8-2').addEventListener('click', () => showSectionInContentB8('section-8-2', 'sb-8-2'));
document.getElementById('sb-8-3').addEventListener('click', () => showSectionInContentB8('section-8-3', 'sb-8-3'));
document.getElementById('sb-8-4').addEventListener('click', () => showSectionInContentB8('section-8-4', 'sb-8-4'));
document.getElementById('sb-8-5').addEventListener('click', () => showSectionInContentB8('section-8-5', 'sb-8-5'));
document.getElementById('sb-8-6').addEventListener('click', () => showSectionInContentB8('section-8-6', 'sb-8-6'));

// ============================================================
// PAGE 11 · BAB 8 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab8 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB8(target, sb);
  });
});

// ============================================================
// PAGE 11 · BAB 8 · 8.6 SIMULATION (Network Health Dashboard)
// ============================================================
(function() {
  const cv = document.getElementById('b08-s86-donut');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const DATA = [
    {label:'North America', pct:28, color:'#534AB7'},
    {label:'Europe',        pct:35, color:'#7C3AED'},
    {label:'Asia',          pct:20, color:'#0F6E56'},
    {label:'Latin America', pct:8,  color:'#854F0B'},
    {label:'Other',         pct:9,  color:'#52524C'},
  ];

  function draw() {
    const dpr = devicePixelRatio || 1;
    const W   = cv.getBoundingClientRect().width || 200;
    const H   = 140;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W * 0.35, cy = H * 0.52, R = 50, r = 28;
    let angle = -Math.PI / 2;

    DATA.forEach(d => {
      const sweep = (d.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += sweep;
    });

    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = dark ? '#1A1A18' : '#fff';
    ctx.fill();

    ctx.fillStyle = dark ? '#E0DED8' : '#1A1A18';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('100+', cx, cy - 6);
    ctx.font = '8px sans-serif';
    ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
    ctx.fillText('countries', cx, cy + 6);

    const lx = W * 0.62, ly0 = H * 0.08;
    DATA.forEach((d, i) => {
      const ly = ly0 + i * 24;
      ctx.fillStyle = d.color;
      ctx.beginPath(); ctx.arc(lx, ly + 5, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = dark ? '#E0DED8' : '#1A1A18';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(d.label, lx + 10, ly);
      ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
      ctx.font = '9px sans-serif';
      ctx.fillText(d.pct + '%', lx + 10, ly + 11);
    });
  }

  draw();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => requestAnimationFrame(draw)).observe(cv);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.5 SIMULATION (Peer Discovery)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark?'#1A1A18':'#F4F4F0';
  const TXT  = dark?'#E0DED8':'#1A1A18';
  const TXT2 = dark?'#A0A098':'#3A3A35';
  const EDGE = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const C_NEW      = '#534AB7';
  const C_DNS      = '#854F0B';
  const C_PEER     = '#0F6E56';
  const C_INACTIVE = '#52524C';

  const NEW_NODE = {x:.50,y:.75,label:'New Node',type:'new'};
  const DNS_NODE = {x:.50,y:.12,label:'DNS Seed', type:'dns'};
  const PEERS = [
    {x:.15,y:.30,label:'Peer A'},
    {x:.38,y:.22,label:'Peer B'},
    {x:.62,y:.22,label:'Peer C'},
    {x:.85,y:.30,label:'Peer D'},
    {x:.12,y:.58,label:'Peer E'},
    {x:.88,y:.58,label:'Peer F'},
  ];

  const STEPS=[
    {label:'1 · New node',head:'Step 1 — A new node starts up',
     body:'The new node powers on but isn’t connected to anyone yet. It only knows one thing: there are DNS seed domains it can query to get a list of active nodes. Every Bitcoin node software implementation includes this list of DNS seeds.',
     note:'The new node has no friends yet. First step: ask the DNS seed.',nc:'p',
     vp:[],cp:[],dnsA:false,dnsC:false,pe:[]},
    {label:'2 · DNS query',head:'Step 2 — Query to the DNS seed',
     body:'The node sends a DNS query to a domain like <code>seed.bitcoin.sipa.be</code>. The DNS seed replies with a list of IP addresses of nodes currently active on the network. This isn’t blind trust: the node only uses this list as a starting point.',
     note:'The DNS seed provides a list of IPs. The node doesn’t trust anyone yet, it just knows where to start.',nc:'m',
     vp:[0,1,2,3],cp:[],dnsA:true,dnsC:false,pe:[]},
    {label:'3 · Initial connection',head:'Step 3 — Connect to the first peers',
     body:'The node picks a few addresses from the DNS seed list and tries to connect. Each connection starts with a handshake: exchanging <code>version</code> and <code>verack</code> messages to make sure both speak the same protocol.',
     note:'The first connection succeeds. The node starts participating in the network.',nc:'m',
     vp:[0,1,2,3],cp:[0,1],dnsA:true,dnsC:true,pe:[[0,1]]},
    {label:'4 · Peer exchange',head:'Step 4 — Peer exchange via getaddr',
     body:'The node sends a <code>getaddr</code> message to a connected peer. The peer replies with an <code>addr</code> message containing a list of hundreds of other peer addresses it knows. From here the node can find more peers without depending on the DNS seed anymore.',
     note:'Peer exchange complete. The node now has a peer database for future connections.',nc:'m',
     vp:[0,1,2,3,4,5],cp:[0,1,2,3,4,5],dnsA:false,dnsC:false,pe:[[0,1],[0,2],[1,3],[2,4],[3,5]]},
    {label:'5 · Fully connected',head:'Step 5 — Node connected to the network',
     body:'The node now has 8 active outbound connections. It starts receiving transactions and blocks from peers, verifying all of them, and forwarding the valid ones. The node saves its peer list to disk so that when it’s shut down and restarted, it doesn’t need to start from scratch.',
     note:'The new node is now a full part of the Bitcoin network. This process usually completes within minutes.',nc:'g',
     vp:[0,1,2,3,4,5],cp:[0,1,2,3,4,5],dnsA:false,dnsC:false,pe:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]]},
  ];

  let cur=0, W=0;
  const H=300, NR=16, DNR=18;

  function setupCv(){
    const cv=g('b08-s85-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
  }

  function nx(n){return n.x*W;}
  function ny(n){return n.y*H;}

  function draw(){
    const cv=g('b08-s85-cv'); if(!cv||!W) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const s=STEPS[cur];

    if(s.dnsA||s.dnsC){
      ctx.beginPath();
      ctx.moveTo(nx(DNS_NODE),ny(DNS_NODE)); ctx.lineTo(nx(NEW_NODE),ny(NEW_NODE));
      ctx.strokeStyle=s.dnsC?'rgba(133,79,11,0.5)':'rgba(133,79,11,0.3)';
      ctx.lineWidth=s.dnsC?1.5:1;
      ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(nx(DNS_NODE),ny(DNS_NODE),DNR,0,Math.PI*2);
      ctx.fillStyle=C_DNS; ctx.globalAlpha=.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('DNS',nx(DNS_NODE),ny(DNS_NODE));
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.fillText(DNS_NODE.label,nx(DNS_NODE),ny(DNS_NODE)+DNR+10);
    }

    s.pe.forEach(([a,b])=>{
      if(!s.vp.includes(a)||!s.vp.includes(b)) return;
      ctx.beginPath();
      ctx.moveTo(nx(PEERS[a]),ny(PEERS[a])); ctx.lineTo(nx(PEERS[b]),ny(PEERS[b]));
      ctx.strokeStyle=EDGE; ctx.lineWidth=.5; ctx.stroke();
    });

    s.cp.forEach(i=>{
      ctx.beginPath();
      ctx.moveTo(nx(NEW_NODE),ny(NEW_NODE)); ctx.lineTo(nx(PEERS[i]),ny(PEERS[i]));
      ctx.strokeStyle='rgba(83,74,183,0.45)'; ctx.lineWidth=1.5; ctx.stroke();
    });

    PEERS.forEach((p,i)=>{
      if(!s.vp.includes(i)) return;
      const connected=s.cp.includes(i);
      ctx.beginPath(); ctx.arc(nx(p),ny(p),NR,0,Math.PI*2);
      ctx.fillStyle=connected?C_PEER:C_INACTIVE;
      ctx.globalAlpha=connected?.9:.5; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(connected?'✓':'P',nx(p),ny(p));
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.fillText(p.label,nx(p),ny(p)+NR+10);
    });

    ctx.beginPath(); ctx.arc(nx(NEW_NODE),ny(NEW_NODE),NR+2,0,Math.PI*2);
    ctx.fillStyle=C_NEW; ctx.globalAlpha=.95; ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('★',nx(NEW_NODE),ny(NEW_NODE));
    ctx.fillStyle=TXT; ctx.font='500 9px sans-serif';
    ctx.fillText(NEW_NODE.label,nx(NEW_NODE),ny(NEW_NODE)+NR+12);

    const items=[
      {c:C_NEW,l:'New node (you)'},
      {c:C_DNS,l:'DNS seed'},
      {c:C_PEER,l:'Connected peer'},
      {c:C_INACTIVE,l:'Peer found'},
    ];
    let lx=12, ly=H-16;
    items.forEach(it=>{
      ctx.fillStyle=it.c;
      ctx.beginPath(); ctx.arc(lx+5,ly,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=TXT2; ctx.font='9px sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(it.l,lx+13,ly);
      lx+=ctx.measureText(it.l).width+26;
    });
  }

  function renderStep(){
    const s=STEPS[cur];
    const cont=g('b08-s85-steps'); if(!cont) return;
    cont.innerHTML='';
    STEPS.forEach((st,i)=>{
      const b=document.createElement('button');
      b.className='b08-s85-step-btn'+(i===cur?' active':'');
      b.textContent=st.label;
      b.addEventListener('click',()=>{cur=i;renderStep();});
      cont.appendChild(b);
    });
    const dh=g('b08-s85-dhead'); if(dh) dh.textContent=s.head;
    const db=g('b08-s85-dbody'); if(db) db.innerHTML=s.body;
    const nt=g('b08-s85-note');
    if(nt){nt.textContent=s.note;nt.className='b08-s85-note '+s.nc;}
    draw();
  }

  setupCv(); renderStep();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{setupCv();draw();})).observe(g('b08-s85-cv')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.4 SIMULATION (Propagasi Block)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG    = dark?'#1A1A18':'#F8F7F5';
  const ENORM = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const EACT1 = 'rgba(133,79,11,0.5)';
  const EACT2 = 'rgba(15,110,86,0.5)';
  const C1_IDLE='#854F0B', C1_RECV='#F0A050';
  const C2_IDLE='#0F6E56', C2_RECV='#5DCAA5';
  const C_SRC ='#534AB7';

  const NODES=[
    {x:.50,y:.08},{x:.15,y:.28},{x:.85,y:.28},
    {x:.05,y:.62},{x:.35,y:.55},{x:.65,y:.55},
    {x:.95,y:.62},{x:.50,y:.88},
  ];
  const EDGES=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,4],[4,5],[5,6],[3,7],[4,7],[5,7]];
  const NR=12, H=200;
  let W1=0, W2=0;
  let recv1=new Set(), recv2=new Set();
  let act1=new Set(), act2=new Set();
  let running=false, timerInt=null, startTime=0;
  let kb1=0, kb2=0;

  function setupCv(cvId){
    const cv=g(cvId); if(!cv) return 0;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||200;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
    return W;
  }

  function drawNet(cvId,W,recv,active,cIdle,cRecv,eAct){
    const cv=g(cvId); if(!cv||!W) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,8); ctx.fill();
    EDGES.forEach(([a,b])=>{
      const isAct=active.has(`${a}-${b}`)||active.has(`${b}-${a}`);
      ctx.beginPath();
      ctx.moveTo(NODES[a].x*W,NODES[a].y*H);
      ctx.lineTo(NODES[b].x*W,NODES[b].y*H);
      ctx.strokeStyle=isAct?eAct:ENORM;
      ctx.lineWidth=isAct?1.5:.5; ctx.stroke();
    });
    NODES.forEach((n,i)=>{
      const isSrc=i===0, rcv=recv.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*H,NR,0,Math.PI*2);
      ctx.fillStyle=isSrc?C_SRC:rcv?cRecv:cIdle;
      ctx.globalAlpha=rcv||isSrc?.9:.5; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(rcv||isSrc?'✓':'N', n.x*W, n.y*H);
    });
  }

  function draw(){
    drawNet('b08-s84-c1',W1,recv1,act1,C1_IDLE,C1_RECV,EACT1);
    drawNet('b08-s84-c2',W2,recv2,act2,C2_IDLE,C2_RECV,EACT2);
  }

  function elapsed(){return (Date.now()-startTime)/1000;}

  function updateStats(){
    const t=elapsed();
    const d1=g('b08-s84-data1'); if(d1) d1.textContent=kb1+' KB';
    const d2=g('b08-s84-data2'); if(d2) d2.textContent=kb2+' KB';
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' sec';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' sec';
    const dn1=g('b08-s84-done1'); if(dn1) dn1.textContent=`${recv1.size}/8`;
    const dn2=g('b08-s84-done2'); if(dn2) dn2.textContent=`${recv2.size}/8`;
  }

  function spreadNode(from,to,isCompact){
    const recv=isCompact?recv2:recv1;
    const active=isCompact?act2:act1;
    const delay=isCompact?120+Math.random()*150:400+Math.random()*500;
    const dataPerHop=isCompact?Math.round(15+Math.random()*10):Math.round(180+Math.random()*120);
    return new Promise(resolve=>{
      setTimeout(()=>{
        active.add(`${from}-${to}`);
        if(isCompact) kb2+=dataPerHop; else kb1+=dataPerHop;
        draw(); updateStats();
        setTimeout(()=>{recv.add(to);draw();updateStats();resolve();},100);
      },delay);
    });
  }

  async function runBFS(isCompact){
    const recv=isCompact?recv2:recv1;
    recv.add(0);
    const queue=[0],visited=new Set([0]);
    while(queue.length>0){
      const cur=queue.shift();
      const neighbors=EDGES
        .filter(([a,b])=>a===cur||b===cur)
        .map(([a,b])=>a===cur?b:a);
      await Promise.all(neighbors.map(async nb=>{
        await spreadNode(cur,nb,isCompact);
        if(!visited.has(nb)){visited.add(nb);queue.push(nb);}
      }));
    }
  }

  const runBtn=g('b08-s84-run');
  if(runBtn) runBtn.addEventListener('click',async()=>{
    if(running) return;
    running=true; runBtn.disabled=true;
    recv1=new Set(); recv2=new Set();
    act1=new Set(); act2=new Set();
    kb1=0; kb2=0;
    draw(); updateStats();
    const note=g('b08-s84-note1');
    if(note){note.textContent='A miner found a new block! Both methods spread simultaneously...';note.className='b08-s84-note run-note';}
    startTime=Date.now();
    timerInt=setInterval(()=>updateStats(),100);
    await Promise.all([runBFS(false),runBFS(true)]);
    clearInterval(timerInt);
    const t=elapsed();
    const d1=g('b08-s84-data1'); if(d1) d1.textContent=kb1+' KB';
    const d2=g('b08-s84-data2'); if(d2) d2.textContent=kb2+' KB';
    const t1=g('b08-s84-time1'); if(t1) t1.textContent=t.toFixed(1)+' sec';
    const t2=g('b08-s84-time2'); if(t2) t2.textContent=t.toFixed(1)+' sec';
    if(note){note.textContent=`✓ Done! Regular block: ~${kb1} KB. Compact Block: ~${kb2} KB. Compact Block saves ${Math.round((1-kb2/kb1)*100)}% bandwidth.`;note.className='b08-s84-note done-note';}
    running=false; runBtn.disabled=false;
  });

  const resetBtn=g('b08-s84-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt); running=false;
    recv1=new Set(); recv2=new Set();
    act1=new Set(); act2=new Set();
    kb1=0; kb2=0; draw(); updateStats();
    ['b08-s84-data1','b08-s84-data2'].forEach(id=>{const el=g(id);if(el)el.textContent='0 KB';});
    ['b08-s84-time1','b08-s84-time2'].forEach(id=>{const el=g(id);if(el)el.textContent='0.0 sec';});
    ['b08-s84-done1','b08-s84-done2'].forEach(id=>{const el=g(id);if(el)el.textContent='0/8';});
    const note=g('b08-s84-note1');
    if(note){note.textContent='A regular block sends all the data. Compact Block only sends the header + transaction IDs because the receiving node already has the transactions in its mempool.';note.className='b08-s84-note idle-note';}
    if(runBtn) runBtn.disabled=false;
  });

  const t1=g('b08-s84-t1'),t2=g('b08-s84-t2');
  const p1=g('b08-s84-p1'),p2=g('b08-s84-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b08-s84-tab s84-act'; t2.className='b08-s84-tab';
    p1.className='b08-s84-pane show';  p2.className='b08-s84-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b08-s84-tab s84-act'; t1.className='b08-s84-tab';
    p2.className='b08-s84-pane show';  p1.className='b08-s84-pane';
  });

  W1=setupCv('b08-s84-c1'); W2=setupCv('b08-s84-c2'); draw();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      W1=setupCv('b08-s84-c1'); W2=setupCv('b08-s84-c2'); draw();
    })).observe(g('b08-s84-p1')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.3 SIMULATION (Propagasi Transaksi)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG          = dark?'#1A1A18':'#F4F4F0';
  const EDGE_IDLE   = dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
  const EDGE_ACTIVE = 'rgba(83,74,183,0.5)';
  const C_IDLE   = '#534AB7';
  const C_SOURCE = '#0F6E56';
  const C_RECV   = '#7C3AED';

  const NODES=[
    {x:.50,y:.10},{x:.22,y:.22},{x:.78,y:.22},
    {x:.08,y:.48},{x:.36,y:.42},{x:.64,y:.42},
    {x:.92,y:.48},{x:.18,y:.72},{x:.42,y:.68},
    {x:.58,y:.68},{x:.82,y:.72},{x:.50,y:.88},
  ];
  const EDGES=[
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,5],[2,6],
    [3,4],[3,7],[4,5],[4,8],[5,6],[5,9],[6,10],
    [7,8],[7,11],[8,9],[9,10],[10,11],[8,11],
  ];
  const NR=15, H=300;
  let W=0, received=new Set(), activeEdges=new Set();
  let running=false, startTime=0, timerInt=null;

  function setupCv(){
    const cv=g('b08-s83-cv'); if(!cv) return;
    const dpr=devicePixelRatio||1;
    W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
  }

  function nx(i){return NODES[i].x*W;}
  function ny(i){return NODES[i].y*H;}

  function draw(){
    const cv=g('b08-s83-cv'); if(!cv) return;
    const ctx=cv.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    EDGES.forEach(([a,b])=>{
      const active=activeEdges.has(`${a}-${b}`)||activeEdges.has(`${b}-${a}`);
      ctx.beginPath();
      ctx.moveTo(nx(a),ny(a)); ctx.lineTo(nx(b),ny(b));
      ctx.strokeStyle=active?EDGE_ACTIVE:EDGE_IDLE;
      ctx.lineWidth=active?1.5:.5; ctx.stroke();
    });

    NODES.forEach((n,i)=>{
      const isSource=i===0&&received.has(0);
      const color=isSource?C_SOURCE:received.has(i)?C_RECV:C_IDLE;
      ctx.beginPath(); ctx.arc(nx(i),ny(i),NR,0,Math.PI*2);
      ctx.fillStyle=color;
      ctx.globalAlpha=received.has(i)?.95:.55;
      ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(received.has(i)?'✓':'N', nx(i),ny(i));
      ctx.fillStyle=dark?'#888':'#52524C'; ctx.font='9px sans-serif';
      ctx.fillText('N'+i, nx(i), ny(i)+NR+9);
    });
  }

  function addLog(t, msg, cls){
    const log=g('b08-s83-log'); if(!log) return;
    const row=document.createElement('div'); row.className='b08-s83-log-row';
    row.innerHTML=`<span class="b08-s83-log-t">${t.toFixed(1)}s</span><span class="b08-s83-log-m ${cls||''}">${msg}</span>`;
    log.appendChild(row);
    log.scrollTop=log.scrollHeight;
  }

  function elapsed(){return (Date.now()-startTime)/1000;}

  function updateStat(){
    const s=g('b08-s83-stat'); if(s) s.textContent=`Nodes received: ${received.size} / ${NODES.length}`;
  }

  function spread(from, to){
    return new Promise(resolve=>{
      const delay=180+Math.random()*280;
      setTimeout(()=>{
        activeEdges.add(`${from}-${to}`);
        draw();
        setTimeout(()=>{
          if(!received.has(to)){
            received.add(to);
            addLog(elapsed(),`N${to} received from N${from} — verification ok, forwarded`,'ok-log');
          } else {
            addLog(elapsed(),`N${to} already has this tx — duplicate, discarded`,'dup-log');
          }
          updateStat(); draw();
          resolve();
        },150);
      },delay);
    });
  }

  async function runPropagation(){
    running=true;
    const sendBtn=g('b08-s83-send'); if(sendBtn) sendBtn.disabled=true;

    received.add(0);
    updateStat(); draw();
    addLog(0,'N0 (sender) creates a transaction and broadcasts to peers','ok-log');

    const note=g('b08-s83-note');
    if(note){note.textContent='The transaction is spreading... Each node verifies before forwarding to its peers.';note.className='b08-s83-note running-note';}

    startTime=Date.now();
    timerInt=setInterval(()=>{
      const el=g('b08-s83-timer'); if(el) el.textContent=elapsed().toFixed(1)+' sec';
    },100);

    const queue=[0], visited=new Set([0]);
    while(queue.length>0){
      const cur=queue.shift();
      const neighbors=EDGES
        .filter(([a,b])=>a===cur||b===cur)
        .map(([a,b])=>a===cur?b:a);
      await Promise.all(neighbors.map(async nb=>{
        await spread(cur,nb);
        if(!visited.has(nb)){visited.add(nb);queue.push(nb);}
      }));
    }

    clearInterval(timerInt);
    const t=elapsed();
    const el=g('b08-s83-timer'); if(el) el.textContent=t.toFixed(1)+' sec';
    addLog(t,`✓ All ${NODES.length} nodes received the transaction in ${t.toFixed(1)} seconds`,'ok-log');
    if(note){note.textContent=`✓ The transaction spread to all ${NODES.length} nodes in ${t.toFixed(1)} seconds. In the real world with thousands of nodes, the process takes about 5-15 seconds.`;note.className='b08-s83-note done-note';}
    running=false;
    if(sendBtn) sendBtn.disabled=false;
  }

  const sendBtn=g('b08-s83-send');
  if(sendBtn) sendBtn.addEventListener('click',()=>{
    if(running) return;
    received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Nodes received: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 sec';
    draw(); runPropagation();
  });

  const resetBtn=g('b08-s83-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    clearInterval(timerInt);
    running=false; received=new Set(); activeEdges=new Set();
    const log=g('b08-s83-log');
    if(log) log.innerHTML='<div class="b08-s83-log-row"><span class="b08-s83-log-t">—</span><span class="b08-s83-log-m">Click "Send Transaction" to start the simulation</span></div>';
    const stat=g('b08-s83-stat'); if(stat) stat.textContent='Nodes received: 0 / 12';
    const timer=g('b08-s83-timer'); if(timer) timer.textContent='0.0 sec';
    const note=g('b08-s83-note'); if(note){note.textContent='The transaction will spread from the sending node to the whole network through the gossiping mechanism. Each node verifies before forwarding.';note.className='b08-s83-note idle-note';}
    const sendBtn2=g('b08-s83-send'); if(sendBtn2) sendBtn2.disabled=false;
    draw();
  });

  setupCv(); draw();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{setupCv();draw();})).observe(g('b08-s83-cv')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.2 SIMULATION (P2P vs Terpusat)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark?'#222':'#F4F4F0';
  const EDGEC= dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
  const EDGED= dark?'rgba(200,50,50,0.15)':'rgba(200,50,50,0.12)';
  const CA='#534AB7', CD='#A32D2D', CS='#0F6E56';

  // === P2P ===
  const PN=[
    {x:.50,y:.14},{x:.18,y:.30},{x:.82,y:.30},
    {x:.08,y:.60},{x:.36,y:.54},{x:.64,y:.54},
    {x:.92,y:.60},{x:.22,y:.84},{x:.50,y:.82},{x:.78,y:.84}
  ];
  const PE=[[0,1],[0,2],[1,2],[1,3],[1,4],[2,5],[2,6],[3,4],[3,7],[4,5],[4,8],[5,6],[5,9],[6,9],[7,8],[8,9]];
  const PR=16, PH=300;
  let pDead=new Set(), pW=0;

  function setupCv(cv,H){
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||300;
    cv.width=W*dpr; cv.height=H*dpr;
    cv.getContext('2d').scale(dpr,dpr);
    return W;
  }

  function drawP2P(){
    const cv=g('b08-s82-c1'); if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=pW||cv.getBoundingClientRect().width||300;
    ctx.clearRect(0,0,W,PH);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,PH,12); ctx.fill();

    PE.forEach(([a,b])=>{
      const ad=pDead.has(a), bd=pDead.has(b);
      ctx.beginPath();
      ctx.moveTo(PN[a].x*W,PN[a].y*PH); ctx.lineTo(PN[b].x*W,PN[b].y*PH);
      ctx.strokeStyle=(ad||bd)?EDGED:EDGEC;
      ctx.lineWidth=(ad||bd)?.5:1; ctx.stroke();
    });

    PN.forEach((n,i)=>{
      const dead=pDead.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*PH,PR,0,Math.PI*2);
      ctx.fillStyle=dead?CD:CA;
      ctx.globalAlpha=dead?.45:.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(dead?'✕':'N', n.x*W, n.y*PH);
    });

    const alive=PN.length-pDead.size;
    const s=g('b08-s82-s1'); if(s) s.textContent=`Active: ${alive} / ${PN.length}`;
    const note=g('b08-s82-n1'); if(!note) return;
    if(alive===0){
      note.textContent='💀 All nodes attacked — the network is completely dead. But this requires attacking '+PN.length+' nodes simultaneously around the world. Far harder than attacking one central server.';
      note.className='b08-s82-note dead-note';
    } else if(pDead.size===0){
      note.textContent='The P2P network is running fully. Try clicking a few nodes to attack them.';
      note.className='b08-s82-note safe-note';
    } else if(alive>=4){
      note.textContent=`✓ ${pDead.size} nodes attacked — the network keeps running with ${alive} active nodes. Other nodes automatically connect around the dead nodes.`;
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`⚠️ ${pDead.size} nodes attacked — the network is degraded, only ${alive} active nodes.`;
      note.className='b08-s82-note warn-note';
    }
  }

  const c1=g('b08-s82-c1');
  if(c1){
    c1.addEventListener('click',e=>{
      const rect=c1.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const W=pW||rect.width||300;
      PN.forEach((n,i)=>{
        const dx=mx-n.x*W, dy=my-n.y*PH;
        if(Math.sqrt(dx*dx+dy*dy)<=PR+5){
          if(pDead.has(i)) pDead.delete(i); else pDead.add(i);
        }
      });
      drawP2P();
    });
  }
  const r1=g('b08-s82-r1');
  if(r1) r1.addEventListener('click',()=>{ pDead=new Set(); drawP2P(); });

  // === CENTRALIZED ===
  const CN=[
    {x:.12,y:.15},{x:.50,y:.08},{x:.88,y:.15},
    {x:.06,y:.50},{x:.94,y:.50},
    {x:.12,y:.85},{x:.50,y:.92},{x:.88,y:.85},
    {x:.32,y:.50},{x:.68,y:.50}
  ];
  const SVR={x:.50,y:.50};
  const CR=15, CH=300, SR=24;
  let cDead=new Set(), svrDead=false, cW=0;

  function drawCentral(){
    const cv=g('b08-s82-c2'); if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cW||cv.getBoundingClientRect().width||300;
    ctx.clearRect(0,0,W,CH);
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,W,CH,12); ctx.fill();

    CN.forEach((n,i)=>{
      const dead=svrDead||cDead.has(i);
      ctx.beginPath();
      ctx.moveTo(n.x*W,n.y*CH); ctx.lineTo(SVR.x*W,SVR.y*CH);
      ctx.strokeStyle=dead?EDGED:EDGEC;
      ctx.lineWidth=dead?.5:1; ctx.stroke();
    });

    ctx.beginPath(); ctx.arc(SVR.x*W,SVR.y*CH,SR,0,Math.PI*2);
    ctx.fillStyle=svrDead?CD:CS;
    ctx.globalAlpha=svrDead?.45:.95; ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(svrDead?'✕':'SVR', SVR.x*W, SVR.y*CH);
    ctx.fillStyle=dark?'#888':'#3A3A35'; ctx.font='9px sans-serif';
    ctx.fillText(svrDead?'DEAD':'Central server', SVR.x*W, SVR.y*CH+SR+11);

    CN.forEach((n,i)=>{
      const dead=svrDead||cDead.has(i);
      ctx.beginPath(); ctx.arc(n.x*W,n.y*CH,CR,0,Math.PI*2);
      ctx.fillStyle=dead?CD:CA;
      ctx.globalAlpha=dead?.45:.9; ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(dead?'✕':'N', n.x*W, n.y*CH);
    });

    const alive=svrDead?0:CN.length-cDead.size;
    const s=g('b08-s82-s2');
    if(s) s.textContent=`Active: ${alive} / ${CN.length} \u00a0|\u00a0 Server: ${svrDead?'DEAD':'online'}`;
    const note=g('b08-s82-n2'); if(!note) return;
    if(svrDead){
      note.textContent='💀 The central server is attacked — the whole network is paralyzed instantly. All '+CN.length+' nodes die even though their hardware is still alive. This is the single point of failure: one attack, everything destroyed.';
      note.className='b08-s82-note dead-note';
    } else if(cDead.size===0){
      note.textContent='The central server is online. All nodes connected. Try clicking the central server (green in the center) to attack it.';
      note.className='b08-s82-note safe-note';
    } else {
      note.textContent=`${cDead.size} client nodes attacked. As long as the central server is alive, other nodes can still communicate. Try attacking the central server to see the difference.`;
      note.className='b08-s82-note warn-note';
    }
  }

  const c2=g('b08-s82-c2');
  if(c2){
    c2.addEventListener('click',e=>{
      const rect=c2.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const W=cW||rect.width||300;
      const dx=mx-SVR.x*W, dy=my-SVR.y*CH;
      if(Math.sqrt(dx*dx+dy*dy)<=SR+6){ svrDead=!svrDead; drawCentral(); return; }
      CN.forEach((n,i)=>{
        const dx2=mx-n.x*W, dy2=my-n.y*CH;
        if(Math.sqrt(dx2*dx2+dy2*dy2)<=CR+5){
          if(cDead.has(i)) cDead.delete(i); else cDead.add(i);
        }
      });
      drawCentral();
    });
  }
  const r2=g('b08-s82-r2');
  if(r2) r2.addEventListener('click',()=>{ cDead=new Set(); svrDead=false; drawCentral(); });

  // tabs
  const t1=g('b08-s82-t1'), t2=g('b08-s82-t2');
  const pp1=g('b08-s82-p1'), pp2=g('b08-s82-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b08-s82-tab active-p2p'; t2.className='b08-s82-tab';
    pp1.className='b08-s82-pane show';    pp2.className='b08-s82-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b08-s82-tab active-cl'; t1.className='b08-s82-tab';
    pp2.className='b08-s82-pane show';   pp1.className='b08-s82-pane';
  });

  // init
  if(c1){ pW=setupCv(c1,PH); drawP2P(); }
  if(c2){ cW=setupCv(c2,CH); drawCentral(); }

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{
      if(c1){ pW=setupCv(c1,PH); drawP2P(); }
      if(c2){ cW=setupCv(c2,CH); drawCentral(); }
    })).observe(g('b08-s82-p1')||document.body);
  }
})();

// ============================================================
// PAGE 11 · BAB 8 · 8.1 SIMULATION (P2P Network)
// ============================================================
(function() {
  const canvas = document.getElementById('b08-s81-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG   = dark ? '#1A1A18' : '#F4F4F0';
  const LINE = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const LACT = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';

  const NODES = [
    {id:0, label:'Full Node A',  type:'full',   color:'#534AB7', x:0.18, y:0.25,
     detail:{head:'Full Node — Jakarta', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                    vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                       vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',      vc:'p'},
      {k:'Connections',   v:'Connected to 8 peers',                         vc:''},
      {k:'Main function', v:'Keeps the consensus rules — no need to trust anyone', vc:''},
    ]}},
    {id:1, label:'Mining Node',  type:'mining',  color:'#0F6E56', x:0.50, y:0.12,
     detail:{head:'Mining Node — Singapore', color:'#0F6E56', rows:[
      {k:'Type',          v:'Mining node (full node + mining)',              vc:'g'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'g'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'g'},
      {k:'Mining',        v:'Actively searching for a nonce to create a new block',  vc:'g'},
      {k:'Main function', v:'Secures the network and earns the block reward', vc:''},
    ]}},
    {id:2, label:'Full Node B',  type:'full',   color:'#534AB7', x:0.82, y:0.25,
     detail:{head:'Full Node — Frankfurt', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                     vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'p'},
      {k:'Connections',   v:'Connected to 6 peers',                          vc:''},
      {k:'Main function', v:'Keeps the consensus rules independently',       vc:''},
    ]}},
    {id:3, label:'Pruned Node',  type:'pruned', color:'#854F0B', x:0.25, y:0.68,
     detail:{head:'Pruned Node — Tokyo', color:'#854F0B', rows:[
      {k:'Type',          v:'Pruned node',                                   vc:'m'},
      {k:'Blockchain',    v:'Only ~10 GB of the latest blocks',             vc:'m'},
      {k:'Verification',  v:'Verifies all rules — old data deleted after verification', vc:'m'},
      {k:'Storage',       v:'Far more economical than a full node',          vc:''},
      {k:'Main function', v:'Full verification with limited storage',        vc:''},
    ]}},
    {id:4, label:'Full Node C',  type:'full',   color:'#534AB7', x:0.50, y:0.72,
     detail:{head:'Full Node — Sao Paulo', color:'#534AB7', rows:[
      {k:'Type',          v:'Full node',                                     vc:'p'},
      {k:'Blockchain',    v:'Entire chain (~600 GB)',                        vc:'p'},
      {k:'Verification',  v:'Every transaction & block independently',       vc:'p'},
      {k:'Connections',   v:'Connected to 7 peers',                          vc:''},
      {k:'Main function', v:'No central point — every node is independent',   vc:''},
    ]}},
    {id:5, label:'SPV Node',     type:'spv',    color:'#52524C', x:0.75, y:0.68,
     detail:{head:'SPV Node — Mobile Wallet', color:'#888780', rows:[
      {k:'Type',          v:'SPV (Simplified Payment Verification)',         vc:''},
      {k:'Data',          v:'Only block headers — ~60 MB',                  vc:''},
      {k:'Verification',  v:'Does not fully verify transactions',            vc:'r'},
      {k:'Trust',         v:'Trusts miners that the longest chain is valid', vc:'r'},
      {k:'Main function', v:'Lightweight for mobile — suitable for everyday payments', vc:''},
    ]}},
  ];

  const EDGES = [[0,1],[0,3],[0,4],[1,2],[1,4],[2,4],[2,5],[3,4],[4,5]];

  let selected = null;
  let W = 0, H = 300;

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  const R = 18;
  function nx(n){ return n.x * W; }
  function ny(n){ return n.y * H; }

  function draw() {
    setup();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0, 0, W, H, 12); ctx.fill();

    EDGES.forEach(([a, b]) => {
      const na = NODES[a], nb = NODES[b];
      const isSel = (selected === a || selected === b);
      ctx.beginPath();
      ctx.moveTo(nx(na), ny(na)); ctx.lineTo(nx(nb), ny(nb));
      ctx.strokeStyle = isSel ? LACT : LINE;
      ctx.lineWidth   = isSel ? 1.5 : 0.5;
      ctx.stroke();
    });

    NODES.forEach((n, i) => {
      const isSel = selected === i;
      if (isSel) {
        ctx.save();
        ctx.shadowColor = n.color; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(nx(n), ny(n), R + 2, 0, Math.PI * 2);
        ctx.fillStyle = n.color; ctx.fill();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(nx(n), ny(n), R, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = isSel ? 1 : 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (isSel) {
        ctx.beginPath(); ctx.arc(nx(n), ny(n), R + 4, 0, Math.PI * 2);
        ctx.strokeStyle = n.color; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const letter = n.type === 'full' ? 'F' : n.type === 'mining' ? 'M' : n.type === 'pruned' ? 'P' : 'S';
      ctx.fillText(letter, nx(n), ny(n));
      ctx.fillStyle = dark ? '#A0A098' : '#3A3A35';
      ctx.font = '10px sans-serif';
      ctx.fillText(n.label, nx(n), ny(n) + R + 10);
    });
  }

  function getNodeAt(mx, my) {
    for (let i = 0; i < NODES.length; i++) {
      const n = NODES[i];
      const dx = mx - nx(n), dy = my - ny(n);
      if (Math.sqrt(dx*dx + dy*dy) <= R + 6) return i;
    }
    return -1;
  }

  function showDetail(i) {
    const n = NODES[i];
    const d = n.detail;
    const head = document.getElementById('b08-s81-dhead');
    const body = document.getElementById('b08-s81-dbody');
    const det  = document.getElementById('b08-s81-detail');
    const hint = document.getElementById('b08-s81-hint');
    if (!head || !body || !det) return;
    head.textContent = d.head;
    head.style.background = d.color;
    body.innerHTML = '';
    d.rows.forEach(r => {
      const el = document.createElement('div');
      el.className = 'b08-s81-drow';
      el.innerHTML = `<span class="b08-s81-dk">${r.k}</span><span class="b08-s81-dv ${r.vc}">${r.v}</span>`;
      body.appendChild(el);
    });
    det.style.display = 'block';
    if (hint) hint.style.display = 'none';
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const hit = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (hit >= 0) {
      selected = selected === hit ? null : hit;
      const det  = document.getElementById('b08-s81-detail');
      const hint = document.getElementById('b08-s81-hint');
      if (selected !== null) {
        showDetail(selected);
      } else {
        if (det)  det.style.display  = 'none';
        if (hint) hint.style.display = 'block';
      }
    }
    draw();
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const hit  = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    canvas.style.cursor = hit >= 0 ? 'pointer' : 'default';
  });

  draw();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => requestAnimationFrame(() => draw())).observe(canvas);
})();

