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
      id:'fullnode',icon:'🖥️',name:'Full Node (Bitcoin Core / Knots)',model:'Full verification — download all blocks',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privacy: Maximal',trustBadge:'s176-trust-zero',trustLabel:'Trust: Zero',
      subtitle:'Baseline — full verification with no trust assumptions',
      desc:'A full node downloads, verifies, and stores the entire blockchain. Every transaction, every signature, every consensus rule is verified independently. This is the gold standard of Bitcoin verification — no need to trust anyone, because you verify it yourself.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'Download + verify all blocks since genesis'},
        {cls:'s176-good',label:'Privacy',val:'No third party knows your addresses or transactions'},
        {cls:'s176-ok',  label:'Storage',val:'~650 GB (full) or ~550 MB minimum (pruned)'},
        {cls:'s176-ok',  label:'Setup time',val:'4-72 hours IBD depending on hardware and sync method'},
      ],
      forwho:['Developers who need full access to the blockchain','Merchants who receive large-value payments','Anyone who wants full self-verification without trust','Lightning node operators who need full verification'],
      tradeoff:'The main trade-off: it requires decent hardware (at least 2 GB RAM, 650 GB+ storage) and a long setup time. For ordinary users, this can be too heavy. But it’s the only way to be truly zero trust.',
    },
    {
      id:'electrum_own',icon:'⚡',name:'Electrum — Server Sendiri',model:'Server query + Electrum protocol',
      wc:'#0F6E56',wb:'#EAF3DE',privBadge:'s176-priv-high',privLabel:'Privacy: High',trustBadge:'s176-trust-low',trustLabel:'Trust: Your server',
      subtitle:'SPV hybrid — fast queries to a server you control yourself',
      desc:'Electrum is a popular Bitcoin wallet since 2011. Instead of pure SPV, Electrum connects to an Electrum server that has already processed the blockchain. By running your own Electrum server on top of a full node, you get Electrum’s query speed with full-node-level privacy.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'Query to an Electrum server (SPV hybrid)'},
        {cls:'s176-good',label:'Privacy (own server)',val:'The server is yours — no third party'},
        {cls:'s176-good',label:'Speed',val:'Very fast — the server has already indexed the blockchain'},
        {cls:'s176-ok',  label:'Complexity',val:'Requires running an Electrum server + full node'},
      ],
      forwho:['Users who need full transaction history without a full node on the client','Developers who want a fast wallet with high privacy','Users who already have a full node and want to add Electrum'],
      tradeoff:'Trade-off: running your own Electrum server is fairly complex and needs a full node underneath. If you don’t want to manage a server, this option is less practical.',
    },
    {
      id:'neutrino',icon:'🔮',name:'Neutrino — Pure BIP 157/158',model:'Compact block filters — truly private SPV',
      wc:'#534AB7',wb:'#EEEDFE',privBadge:'s176-priv-high',privLabel:'Privacy: Good',trustBadge:'s176-trust-low',trustLabel:'Trust: Majority honest',
      subtitle:'A pure BIP 157/158 implementation — used by Phoenix, Breez, and lnd',
      desc:'Neutrino is a Bitcoin light client in Go developed by Lightning Labs. It fully implements BIP 157/158 (compact block filters). Neutrino is used as the backend for Phoenix Wallet, Breez, and lnd in light mode.',
      specs:[
        {cls:'s176-good',label:'Verification model',val:'BIP 157/158 compact block filters — the client filters itself'},
        {cls:'s176-good',label:'Privacy',val:'The node doesn’t know the address being searched — far better than BIP 37'},
        {cls:'s176-ok',  label:'Bandwidth',val:'~500 MB - 2 GB to download all filters (total)'},
        {cls:'s176-good',label:'Suitable for',val:'Mobile wallets + lightweight Lightning Network nodes'},
      ],
      forwho:['Lightning Network mobile users (Phoenix, Breez)','Developers who need a light client with good privacy','Users who don’t want a full node but care about privacy'],
      tradeoff:'Trade-off: it needs more bandwidth than BIP 37 because it has to download all filters. But the privacy gained is far better. The initial sync time is longer than an ordinary wallet.',
    },
    {
      id:'electrum_pub',icon:'⚡',name:'Electrum — Public Server',model:'Server query to a server managed by someone else',
      wc:'#854F0B',wb:'#FAEEDA',privBadge:'s176-priv-med',privLabel:'Privacy: Medium',trustBadge:'s176-trust-med',trustLabel:'Trust: Server operator',
      subtitle:'The default Electrum option — fast but the server knows your addresses',
      desc:'If you use Electrum without running your own server, Electrum connects to a public server run by the community or a company. This server knows the addresses you query, your balance, and the transactions you make. Still far better than a custodial exchange, but not a zero-trust solution.',
      specs:[
        {cls:'s176-ok',  label:'Verification model',val:'Query to a public server — fast but there’s trust'},
        {cls:'s176-ok',  label:'Privacy',val:'The server operator knows your addresses and transactions'},
        {cls:'s176-good',label:'Ease of use',val:'Ready to use right away — no extra setup needed'},
        {cls:'s176-good',label:'Speed',val:'Very fast — the server has already indexed the blockchain'},
      ],
      forwho:['New users just getting to know self-custody','Users who need a fast wallet without managing a server','Everyday transactions of not-too-large value'],
      tradeoff:'The main trade-off: the server operator knows your addresses. To improve privacy, use Tor when connecting to a public Electrum server, or consider switching to your own server.',
    },
    {
      id:'mobile',icon:'📱',name:'Ordinary Mobile Wallet',model:'Backend server — not real SPV',
      wc:'#A32D2D',wb:'#FCEBEB',privBadge:'s176-priv-low',privLabel:'Privacy: Low',trustBadge:'s176-trust-high',trustLabel:'Trust: Wallet developer',
      subtitle:'Trust Wallet, Exodus, and most popular mobile wallets',
      desc:'Many mobile wallets that claim "SPV" actually connect to a backend server controlled by that wallet’s developer. They don’t download the header chain or do any PoW verification at all — they just query the developer’s server API. This is custodial-lite: you hold the private key but verification is done by someone else.',
      specs:[
        {cls:'s176-warn',label:'Verification model',val:'Query to the developer’s server — not real SPV'},
        {cls:'s176-warn',label:'Privacy',val:'The developer knows all your addresses, balance, and transactions'},
        {cls:'s176-good',label:'Ease of use',val:'Very easy — install and use right away'},
        {cls:'s176-warn',label:'Trust',val:'You have to trust the wallet developer not to lie about the balance'},
      ],
      forwho:['New users just starting to learn Bitcoin','Small amounts for everyday transactions','Users not yet ready to manage any infrastructure'],
      tradeoff:'Trade-off: very easy to use but privacy is very low and you have to trust the developer. For large amounts or users who care about privacy, consider switching to Electrum or Neutrino.',
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
    fw.innerHTML=`<div class="b17-s176-forwho-label">Suitable for:</div>
      ${w.forwho.map(t=>`<div class="b17-s176-forwho-item">${t}</div>`).join('')}`;
    el.appendChild(fw);

    const to=document.createElement('div');to.className='b17-s176-tradeoff';
    to.innerHTML=`<div class="b17-s176-tradeoff-label">Main trade-off:</div>${w.tradeoff}`;
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
      color:'s175-red',label:'Most Realistic Scenario',title:'Eclipse Attack',
      text:'The attacker isolates the SPV client from the honest network by controlling all peer connections. From this position, the attacker can hide incoming transactions, show a different chain, or censor outgoing transactions. To succeed, the attacker needs to control all of the client’s network connections, which isn’t easy but isn’t impossible, especially for a mobile client on a network controlled by a malicious ISP.',
      metrics:[
        {cls:'s175-mred',label:'Difficulty level',val:'Medium',sub:'Requires control over the client’s network connections'},
        {cls:'s175-mamber',label:'Attacker cost',val:'Moderate',sub:'Network infrastructure + target identification'},
        {cls:'s175-mamber',label:'Potential impact',val:'Significant',sub:'Can hide/manipulate the tx the client sees'},
      ],
      can:['Hide incoming transactions from SPV','Show a shorter alternative chain','Censor outgoing transactions to the network','Make SPV think a payment isn’t confirmed yet'],
      cannot:['Steal bitcoin from the client’s wallet','Reverse a transaction already on the main chain','Deceive a full node connected to the honest network','Do this without controlling the client’s connections'],
      mitigations:[
        {icon:'🌐',text:'Connect to several different nodes — the attacker must control ALL connections for an eclipse to succeed.'},
        {icon:'🧅',text:'Use Tor or a VPN to make it harder for the attacker to identify and isolate you.'},
        {icon:'🖥️',text:'Connect to your own full node — if you run your own node, an eclipse is far harder.'},
      ],
    },
    doublespend:{
      color:'s175-amber',label:'Expensive & Rare Scenario',title:'Double Spend Attack',
      text:'The attacker pays a merchant with a Bitcoin transaction, waits for the merchant to ship the goods after seeing the confirmation on a fake chain, then reverses the transaction by publishing a longer alternative chain. To deceive SPV, the attacker needs an eclipse attack AND to produce an alternative chain with more proof-of-work than the main chain. This is very expensive.',
      metrics:[
        {cls:'s175-mred',label:'Difficulty level',val:'Very High',sub:'Requires significant hashrate + an eclipse attack'},
        {cls:'s175-mred',label:'Attacker cost',val:'Very Expensive',sub:'Mining equipment + electricity + network control'},
        {cls:'s175-mamber',label:'When is it worth it?',val:'Large value',sub:'Only worth it for very high-value transactions'},
      ],
      can:['Reverse a tx if the eclipse succeeds + has hashrate','Deceive SPV that only waits for few confirmations','Make SPV see an alternative chain as valid'],
      cannot:['Do this without enormous hashrate','Deceive SPV that waits for many confirmations','Deceive a full node connected to the main chain','Forge a signature to steal from another wallet'],
      mitigations:[
        {icon:'⏳',text:'Wait for more confirmations for large values. 6 confirmations = the attacker needs to redo ~6 blocks with competitive hashrate.'},
        {icon:'💰',text:'For very high-value transactions (>1 BTC), consider using a full node for verification.'},
        {icon:'👁️',text:'Check whether the chain you see is consistent with a public explorer before shipping goods.'},
      ],
    },
    invalid:{
      color:'s175-green',label:'Nearly Impossible Scenario',title:'Invalid Block Attack',
      text:'The attacker tries to make SPV accept a block that violates Bitcoin’s consensus rules, for example a block that creates more bitcoin than it should. SPV still verifies the proof-of-work of every header, so the attacker has to spend real energy to create a valid header. But SPV doesn’t fully verify the block contents, so a block with an invalid transaction can slip through if no full node rejects it.',
      metrics:[
        {cls:'s175-mgreen',label:'Difficulty level',val:'Extreme',sub:'Requires an eclipse + hashrate + no full node detecting it'},
        {cls:'s175-mgreen',label:'Network protection',val:'Strong',sub:'Full nodes across the network will reject an invalid block'},
        {cls:'s175-mgreen',label:'Practical risk',val:'Very Low',sub:'Almost never happens on the real Bitcoin network'},
      ],
      can:['Create a block with valid PoW but invalid contents (if the eclipse succeeds)','Hide a block rejection from an isolated SPV'],
      cannot:['Deceive the broad network — full nodes will reject an invalid block','Do this without isolating SPV from all honest full nodes','Forge PoW without expending enormous energy','Create a valid transaction without the matching private key'],
      mitigations:[
        {icon:'🖥️',text:'Full nodes reject an invalid block automatically. The more full nodes on the network, the stronger this protection.'},
        {icon:'🔗',text:'A healthy Bitcoin network with thousands of full nodes makes this attack practically almost impossible.'},
        {icon:'📡',text:'An SPV connected to several independent nodes is very hard to fully isolate from the honest network.'},
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
    cantEl.innerHTML=`<div class="b17-s175-cando-label">The attacker CAN:</div>${s.can.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    const canEl=document.createElement('div');canEl.className='b17-s175-cando s175-can';
    canEl.innerHTML=`<div class="b17-s175-cando-label">The attacker CANNOT:</div>${s.cannot.map(t=>`<div class="b17-s175-cando-item">${t}</div>`).join('')}`;
    candoWrap.appendChild(cantEl);candoWrap.appendChild(canEl);
    el.appendChild(candoWrap);

    const mitWrap=document.createElement('div');mitWrap.className='b17-s175-mitigations';
    const mitLabel=document.createElement('div');mitLabel.className='b17-s175-mit-label';mitLabel.textContent='Mitigation:';
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
    {max:0, cls:'s175-conf-warn', txt:'0 confirmations (unconfirmed): RISKY. The transaction isn’t in a block at all. Very easy to double spend. Don’t accept it for any value.'},
    {max:1, cls:'s175-conf-ok',   txt:'1 confirmation: Enough for small everyday values (buying coffee, top-ups). The double-spend cost is still relatively low, but for small amounts it’s not worth it for an attacker.'},
    {max:3, cls:'s175-conf-ok',   txt:'2-3 confirmations: Safe enough for most transactions. A double spend requires the attacker to produce 2-3 competitive blocks — expensive for average values.'},
    {max:6, cls:'s175-conf-safe', txt:'4-6 confirmations: The industry standard. Very safe for almost all transactions. The double-spend cost already far exceeds any realistic value to attack.'},
    {max:12,cls:'s175-conf-safe', txt:'7-12 confirmations: For very high-value transactions. At this point, even an attacker with significant hashrate can’t economically do a double spend.'},
  ];

  const sl=g('b17-s175-conf-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b17-s175-conf-val');const res=g('b17-s175-conf-result');
    if(vEl) vEl.textContent=v===1?'1 confirmation':`${v} confirmations`;
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
          res.textContent=`The filter detects that "${addr}" IS in block #870,142. The SPV client will download the full block to fetch the relevant transactions. The node only knows that block #870,142 was requested, not why.`;
        } else if(FALSE_POSITIVES.includes(addr)){
          res.className='b17-s174-gcs-result s174-gcs-fp';
          res.textContent=`FALSE POSITIVE: The filter says "${addr}" might be in block #870,142, but it actually isn’t. The SPV client still downloads the full block (wastefully), but this helps privacy because the node can’t distinguish a true match from a false positive.`;
        } else {
          res.className='b17-s174-gcs-result s174-gcs-no';
          res.textContent=`The filter confirms that "${addr}" is NOT in block #870,142. The SPV client doesn’t need to download this block. Saves bandwidth.`;
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
      el.innerHTML='<div class="b17-s173-empty">No addresses yet. Add one above.</div>';
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
        if(res){res.className='b17-s173-result s173-idle';res.textContent='Filter reset. Add a new address.';}
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
      if(res){res.className='b17-s173-result s173-fp';res.textContent=`"${addr}" is already in the filter.`;}
      return;
    }
    if(addedAddrs.length>=4){
      if(res){res.className='b17-s173-result s173-fp';res.textContent='Maximum 4 addresses for this demo. Remove one first.';}
      return;
    }
    addedAddrs.push(addr);
    getBits(addr).forEach(b=>{bitArray[b]=1;});
    highlightBits=getBits(addr);
    renderArray();renderAddrs();
    if(res){res.className='b17-s173-result s173-yes';res.textContent=`"${addr}" added to the filter. Bits ${getBits(addr).join(', ')} set to 1.`;}
  }

  function queryFilter(){
    const sel=g('b17-s173-query-select');if(!sel) return;
    const addr=sel.value;
    const bits=getBits(addr);
    highlightBits=bits;renderArray();
    const res=g('b17-s173-result');if(!res) return;
    if(addedAddrs.length===0){
      res.className='b17-s173-result s173-idle';res.textContent='Add an address to the filter before querying.';return;
    }
    const isInFilter=bits.every(b=>bitArray[b]===1);
    const isActuallyIn=addedAddrs.includes(addr);
    if(!isInFilter){
      res.className='b17-s173-result s173-no';
      res.textContent=`Result: NOT PRESENT. Bits ${bits.filter(b=>bitArray[b]===0).join(', ')} are still 0 — "${addr}" is definitely not in the filter. The answer "no" is always correct.`;
    } else if(isActuallyIn){
      res.className='b17-s173-result s173-yes';
      res.textContent=`Result: PRESENT. All bits (${bits.join(', ')}) are set to 1. "${addr}" really is in the filter. The node will send the relevant transactions.`;
    } else {
      res.className='b17-s173-result s173-fp';
      res.textContent=`Result: FALSE POSITIVE! All bits (${bits.join(', ')}) are already 1 — but "${addr}" actually is NOT in the filter. The node still sends transactions for this address, which obscures the addresses actually owned. This is bloom filter "privacy".`;
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
      {x:185,col:'#EEEDFE', stroke:'rgba(83,74,183,0.3)', txt:'Calculation path'},
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
        <div class="b17-s172-step-title">Target transaction: ${tx.label}</div>
        <div class="b17-s172-step-hash">hash: ${tx.hash}...d4a9f1 (32 byte)</div>
        <div class="b17-s172-step-desc">This is what you want to prove is inside the block.</div>
      </div>`;
    stepsEl.appendChild(s0);

    proof.siblings.forEach((sibKey,i)=>{
      const sib=NODES[sibKey];
      const s=document.createElement('div');s.className='b17-s172-step s172-proof';
      s.innerHTML=`<div class="b17-s172-step-icon">🔑</div>
        <div class="b17-s172-step-body">
          <div class="b17-s172-step-title">Sibling hash ${i+1}: ${sib.label}</div>
          <div class="b17-s172-step-hash">hash: ${sib.hash}...a8b3c7 (32 byte)</div>
          <div class="b17-s172-step-desc">This hash is sent by the full node as part of the proof. The SPV client doesn’t need to know the transaction contents — just the hash.</div>
        </div>`;
      stepsEl.appendChild(s);
    });

    const sRoot=document.createElement('div');sRoot.className='b17-s172-step s172-root';
    sRoot.innerHTML=`<div class="b17-s172-step-icon">✅</div>
      <div class="b17-s172-step-body">
        <div class="b17-s172-step-title">Calculation result: Merkle Root matches</div>
        <div class="b17-s172-step-hash">root: ${NODES['L3-0'].hash}...e2f1d9 (32 byte)</div>
        <div class="b17-s172-step-desc">The SPV client reconstructs the merkle root from the target tx + ${proof.siblings.length} sibling hashes. If it matches the merkle root in the block header whose proof-of-work has been verified, the transaction is proven to be in this block.</div>
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
    if(note) note.textContent=`To prove ${tx.label} is in this block, the SPV client only needs ${proofBytes} bytes (${proof.siblings.length} sibling hashes + the transaction hash itself). The entire block is ~1.5 MB. This proof is ${Math.round(blockBytes/proofBytes).toLocaleString('en-US')}x smaller than the full block.`;
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

