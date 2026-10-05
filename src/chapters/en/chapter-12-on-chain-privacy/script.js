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
      icon:'👤',title:'Casual User',sub:'Basic privacy, doesn’t want hassle',
      threatLabel:'Threat level: low to medium',threatPct:25,threatColor:'#0F6E56',
      recs:[
        {level:'must',badge:'Required',text:'Use an HD wallet — a new address automatically every transaction. Almost all modern wallets already do this.'},
        {level:'must',badge:'Required',text:'Don’t post a Bitcoin address on public social media linked to your real identity.'},
        {level:'should',badge:'Recommended',text:'Use Lightning for small everyday payments — more private than on-chain.'},
        {level:'nice',badge:'Optional',text:'Separate UTXOs from an exchange (KYC) and UTXOs from other sources — don’t combine them in one transaction.'},
      ],
      avoids:['Using the same address more than once','Posting transaction screenshots publicly'],
    },
    {
      icon:'🏪',title:'Merchant',sub:'Receives payments from many customers',
      threatLabel:'Threat level: medium — customers can see the store balance',threatPct:50,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Required',text:'Use BTCPay Server or a wallet that supports Payjoin — hide the receiving pattern from customers.'},
        {level:'must',badge:'Required',text:'Generate a new address for every invoice — don’t use one address for all customers.'},
        {level:'should',badge:'Recommended',text:'Accept Lightning payments via BOLT 12 Offers — more private than an ordinary invoice that can be correlated.'},
        {level:'should',badge:'Recommended',text:'Separate the operational wallet from the long-term storage wallet.'},
        {level:'nice',badge:'Optional',text:'Do UTXO consolidation when fees are low, but be careful about the privacy implications of combining UTXOs.'},
      ],
      avoids:['Using one address for all customers','Posting the wallet balance publicly','Combining UTXOs from different customers without consideration'],
    },
    {
      icon:'📈',title:'Long-term Investor',sub:'Holds a significant amount of Bitcoin',
      threatLabel:'Threat level: medium to high — target of theft or extortion',threatPct:65,threatColor:'#854F0B',
      recs:[
        {level:'must',badge:'Required',text:'Never reveal how much Bitcoin you own to anyone who doesn’t need to know.'},
        {level:'must',badge:'Required',text:'Use a hardware wallet separate from everyday activity — cold storage for long-term hodling.'},
        {level:'must',badge:'Required',text:'Buy Bitcoin from different sources to avoid an easily traceable purchase profile.'},
        {level:'should',badge:'Recommended',text:'Consider CoinJoin before moving to cold storage — separate the on-chain history from your identity.'},
        {level:'nice',badge:'Optional',text:'Use your own Bitcoin node when transacting — don’t rely on a public node that can monitor your IP.'},
      ],
      avoids:['Showing off Bitcoin holdings in public','Storing all Bitcoin in one wallet','Using an exchange unnecessarily for every transaction'],
    },
    {
      icon:'🛡️',title:'High Privacy',sub:'Needs strong protection from surveillance',
      threatLabel:'Threat level: high — state surveillance or malicious actors',threatPct:90,threatColor:'#A32D2D',
      recs:[
        {level:'must',badge:'Required',text:'Obtain Bitcoin without KYC — peer-to-peer exchange, mining, or a service that doesn’t ask for identity.'},
        {level:'must',badge:'Required',text:'Run your own Bitcoin full node and only broadcast transactions through your own node or via Tor.'},
        {level:'must',badge:'Required',text:'Use CoinJoin before every significant spend — break the on-chain tracing chain.'},
        {level:'must',badge:'Required',text:'Use Silent Payments or BOLT 12 to receive payments without exposing your address.'},
        {level:'should',badge:'Recommended',text:'Strictly separate different digital identities — don’t mix wallets with different purposes.'},
      ],
      avoids:['KYC at any exchange if it can be avoided','Using a wallet connected to a third-party server','Transacting with your real IP without Tor or a VPN','Combining UTXOs from different sources'],
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
          <div class="b12-s126-recs-label">Recommendations:</div>
          ${p.recs.map(r=>`
            <div class="b12-s126-rec ${r.level}">
              <span class="b12-s126-rec-badge">${r.badge}</span>
              <div class="b12-s126-rec-text">${r.text}</div>
            </div>`).join('')}
        </div>
        <div class="b12-s126-avoid">
          <div class="b12-s126-avoid-label">Avoid:</div>
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
      if(note) note.textContent=`Payment #${i+1} sent... On-chain: publicly visible. Lightning: hidden inside the channel.`;
      if(note) note.className='b12-s125-note s125-run';
      await wait(400);
    }

    await wait(300);
    const lnC=g('b12-s125-ln-close'); if(lnC) lnC.classList.add('visible');
    await wait(300);
    const sum=g('b12-s125-summary'); if(sum) sum.style.display='grid';
    if(note){note.textContent='Done! On-chain: 10 transactions publicly visible. Lightning: only channel open and close are recorded on the blockchain, the 10 payments inside are not visible at all.';note.className='b12-s125-note s125-done';}
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
    if(note){note.textContent='Click "Simulate 10 Payments" to see the difference in visibility between on-chain and Lightning payments.';note.className='b12-s125-note s125-idle';}
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

    if(note){note.textContent='Alice computes a unique address from the static address using its public key...';note.className='b12-s124-note s124-run';}
    await wait(700);
    const ra=g('b12-s124-res-alice'); if(ra) ra.classList.add('show');

    if(note) note.textContent='Bob computes a different unique address from the same public key...';
    await wait(700);
    const rb2=g('b12-s124-res-bob'); if(rb2) rb2.classList.add('show');

    if(note) note.textContent='Carol generates a third unique address, all different even though the destination is the same...';
    await wait(700);
    const rc=g('b12-s124-res-carol'); if(rc) rc.classList.add('show');

    await wait(500);
    if(note) note.textContent='The three transactions enter the blockchain. The analyst sees three different addresses...';
    const bc=g('b12-s124-blockchain'); if(bc) bc.classList.add('show');
    await wait(400);
    ['b12-s124-chain-1','b12-s124-chain-2','b12-s124-chain-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*300);
    });
    await wait(1200);
    const ln=g('b12-s124-link-note'); if(ln) ln.classList.add('show');
    await wait(600);

    if(note) note.textContent='The recipient scans the blockchain with their private key to find the payments...';
    const sc=g('b12-s124-scan'); if(sc) sc.classList.add('show');
    await wait(400);
    ['b12-s124-scan-1','b12-s124-scan-2','b12-s124-scan-3'].forEach((id,i)=>{
      setTimeout(()=>{const el=g(id);if(el) el.classList.add('show');},i*400);
    });
    await wait(1400);

    if(note){note.textContent='Done! Three senders, one static address, three on-chain addresses that can’t be linked. Only the recipient knows all three are theirs.';note.className='b12-s124-note s124-done';}
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
    if(note){note.textContent='Click "Simulate Sending" to see how three different senders generate different on-chain addresses from the same single static address.';note.className='b12-s124-note s124-idle';}
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
    if(note){note.textContent='Payjoin looks identical to an ordinary transaction from the outside. The analyst can’t tell them apart just by looking at the blockchain, that’s what makes it stronger than CoinJoin whose pattern can be recognized.';note.className='b12-s123-note s123-info';}
  });

  const rstBtn=g('b12-s123-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    applied=false;
    ['b12-s123-a-normal','b12-s123-a-payjoin'].forEach(id=>{const el=g(id);if(el) el.style.display='none';});
    const vd=g('b12-s123-verdict'); if(vd) vd.style.display='none';
    const note=g('b12-s123-note');
    if(note){note.textContent='Click "Apply Common Input Heuristic" to see why the analyst reaches a different conclusion from two transactions that look almost the same.';note.className='b12-s123-note s123-idle';}
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
        {id:'C1',label:'Change\n0.08 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'A1',to:'TX',color:'rgba(83,74,183,0.5)'},{from:'A2',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'B1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'C1',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['A1','A2'],linked:[],
      findings:[
        {icon:'🔍',label:'Heuristic detected',text:'A1 and A2 are used together as inputs in one transaction.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'With very high probability, A1 and A2 are owned by the same person. The analyst merges both as one entity.'},
        {icon:'📊',label:'Privacy impact',text:'If one of the addresses was ever identified, for example from an exchange, the other address is identified too.'},
      ],
      note:'Common Input Ownership is the most powerful heuristic in blockchain analysis. Using it means you inadvertently confirm that all the UTXOs you combine are yours.',
    },
    2:{
      nodes:[
        {id:'S1',label:'Sender\n1.0 BTC',x:0.10,y:0.42,cls:'addr'},
        {id:'TX',label:'TX',x:0.42,y:0.42,cls:'tx'},
        {id:'R1',label:'Recipient\n0.9 BTC',x:0.75,y:0.20,cls:'addr'},
        {id:'CH',label:'Change\n0.09 BTC',x:0.75,y:0.65,cls:'addr'},
      ],
      edges:[
        {from:'S1',to:'TX',color:'rgba(83,74,183,0.5)'},
        {from:'TX',to:'R1',color:'rgba(83,74,183,0.3)',dash:true},{from:'TX',to:'CH',color:'rgba(83,74,183,0.3)',dash:true},
      ],
      flagged:['CH'],linked:['S1'],
      findings:[
        {icon:'🔍',label:'Heuristic detected',text:'The 0.9 BTC output is a round number, likely an intentional payment. The 0.09 BTC output is a non-round number, likely the change.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'The 0.09 BTC output is most likely returned to the sender. The analyst marks the change address as belonging to the same sender.'},
        {icon:'📊',label:'Privacy impact',text:'The sender’s real balance can be estimated. The next transaction from the change address will continue to be traced.'},
      ],
      note:'Change output detection works because of predictable value patterns. One mitigation is to use CoinJoin which equalizes output values so the analyst can’t distinguish payment from change.',
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
        {icon:'🔍',label:'Heuristic detected',text:'Address X appears in 4 different transactions as both recipient and sender.'},
        {icon:'⚠️',label:'Analyst conclusion',text:'All transactions involving Address X are linked. The total balance in and out can be calculated accurately.'},
        {icon:'📊',label:'Privacy impact',text:'If one of these 4 transactions can be linked to a real identity, the entire financial history of this address is exposed.'},
      ],
      note:'Address reuse is the easiest privacy mistake to avoid. Modern wallets (HD wallets) automatically generate a new address for every transaction. There’s no reason to use the same address more than once.',
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

