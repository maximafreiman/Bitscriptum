// ============================================================
// PAGE 16 · BAB 13 · NAVIGATION
// ============================================================
function showSectionInContentB13(sectionId, sbId) {
  document.querySelectorAll('#page-bab13 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab13 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab13-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 16 · BAB 13 · TOPBAR
// ============================================================
document.getElementById('back-home-b13').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b13').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 16 · BAB 13 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab13').addEventListener('click', () => navigate('page-bab13'));

// ============================================================
// PAGE 16 · BAB 13 · SIDEBAR EVENTS (13.1 - 13.6)
// ============================================================
document.getElementById('sb-13-1').addEventListener('click', () => showSectionInContentB13('section-13-1', 'sb-13-1'));
document.getElementById('sb-13-2').addEventListener('click', () => showSectionInContentB13('section-13-2', 'sb-13-2'));
document.getElementById('sb-13-3').addEventListener('click', () => showSectionInContentB13('section-13-3', 'sb-13-3'));
document.getElementById('sb-13-4').addEventListener('click', () => showSectionInContentB13('section-13-4', 'sb-13-4'));
document.getElementById('sb-13-5').addEventListener('click', () => showSectionInContentB13('section-13-5', 'sb-13-5'));
document.getElementById('sb-13-6').addEventListener('click', () => showSectionInContentB13('section-13-6', 'sb-13-6'));

// ============================================================
// PAGE 16 · BAB 13 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab13 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB13(target, sb);
  });
});

// ============================================================
// PAGE 16 · BAB 13 · 13.6 SIMULATION (Governance)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    dev:{
      icon:'💻',name:'Developer',
      sub:'Various implementations: Bitcoin Core, Bitcoin Knots, and others',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Technical influence',pct:80,color:'#534AB7'},
        {name:'Code control',pct:70,color:'#534AB7'},
        {name:'Protocol veto',pct:30,color:'#534AB7'},
        {name:'Force users',pct:10,color:'#534AB7'},
      ],
      strengths:['Write and review the code that the majority of nodes run','Can refuse to implement changes that aren’t agreed on','Reputation and community trust as influence capital'],
      limits:['Can’t force anyone to run their code','Anyone is free to fork the implementation and make their own version','No single implementation has absolute authority','The community can switch to another implementation at any time'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Taproot (2021): developers from various contributors designed and reviewed BIP 340-342 for almost 2 years. Great influence, but activation still needed miner signaling and node acceptance.',
    },
    miner:{
      icon:'⛏️',name:'Miner',
      sub:'Block production, network security, soft fork activation signaling',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      powers:[
        {name:'Block production',pct:100,color:'#854F0B'},
        {name:'MASF signaling',pct:90,color:'#854F0B'},
        {name:'Soft fork veto',pct:60,color:'#854F0B'},
        {name:'Force a hard fork',pct:20,color:'#854F0B'},
      ],
      strengths:['The only party that can produce new blocks','In MASF, the miners’ signal determines when a soft fork activates','Can delay soft fork activation by not signaling'],
      limits:['Can’t force users to accept bitcoin from a particular chain','The 2017 SegWit UASF proved miners can be forced by economic nodes','Blocks rejected by economic nodes generate no real income','Can’t create new bitcoin outside the halving schedule'],
      exBg:'#FAEEDA',exColor:'#633806',
      example:'SegWit (2017): miners refused to signal for almost 2 years. But when the BIP 148 UASF threatened to reject their blocks, miners finally signaled within weeks.',
    },
    node:{
      icon:'🖥️',name:'Node',
      sub:'Independent full nodes (home, community) and economic nodes (exchanges, wallets, businesses)',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      powers:[
        {name:'Consensus validation',pct:100,color:'#0F6E56'},
        {name:'Rule enforcement',pct:95,color:'#0F6E56'},
        {name:'Reject a soft fork',pct:80,color:'#0F6E56'},
        {name:'Force miners to follow',pct:75,color:'#0F6E56'},
      ],
      strengths:['The only party that truly validates and enforces the consensus rules','Independent nodes: one home node has the same weight as one exchange in validation','Economic nodes can make miner blocks worthless by rejecting them','Don’t depend on anyone to run the rules they believe are correct'],
      limits:['Independent nodes generate no income, relying on ideological motivation','The influence of independent nodes isn’t visible until a real conflict happens','Strong coordination is needed for UASF or URSF to succeed'],
      exBg:'#EAF3DE',exColor:'#0F6E56',
      example:'BIP 148 UASF (2017): thousands of independent and economic nodes threatened to reject miner blocks that didn’t support SegWit. The clearest demonstration that nodes are the true guardians of the consensus rules.',
    },
    user:{
      icon:'👤',name:'User',
      sub:'Individuals who store, send, and receive bitcoin',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      powers:[
        {name:'Value determination',pct:90,color:'#534AB7'},
        {name:'Technology adoption',pct:70,color:'#534AB7'},
        {name:'Direct pressure',pct:30,color:'#534AB7'},
        {name:'Protocol influence',pct:20,color:'#534AB7'},
      ],
      strengths:['In the long term, users determine whether Bitcoin has value','Can choose not to use Bitcoin if they don’t like its direction','User voice forms through public discussion, forums, and social media'],
      limits:['Individual influence is very small and hard to measure','Has no formal mechanism to influence the protocol','Split into many often-conflicting opinions'],
      exBg:'#EEEDFE',exColor:'#3C3489',
      example:'Scaling debate (2015-2017): users frustrated with high fees created significant public pressure. It didn’t directly change the protocol, but shaped the narrative that influenced all the other parties.',
    },
    biz:{
      icon:'🏢',name:'Economic Actors and Businesses',
      sub:'Exchanges, merchants, payment processors, financial institutions, and Bitcoin-based services',
      headBg:'#F4F4F0',headBorder:'rgba(26,26,24,0.15)',
      powers:[
        {name:'Economic power',pct:85,color:'#1A1A18'},
        {name:'Mass adoption',pct:80,color:'#1A1A18'},
        {name:'Chain veto',pct:70,color:'#1A1A18'},
        {name:'Protocol pressure',pct:60,color:'#1A1A18'},
      ],
      strengths:['Large exchanges can determine which chain gets liquidity','Merchants who accept Bitcoin expand adoption and give real value','Payment processors can choose which implementation they support'],
      limits:['Can’t force a protocol change directly','Depend on user trust — losing trust means losing business','Subject to regulation that can limit their technical choices'],
      exBg:'#F4F4F0',exColor:'#1A1A18',
      example:'SegWit2x (2017): more than 80% of hash rate and many large exchanges signed the New York Agreement for a hard fork. But when developers and users refused, they eventually canceled out of fear of losing legitimacy.',
    },
  };

  function render(actor){
    const d=DATA[actor]; if(!d) return;
    const el=g('b13-s136-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b13-s136-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b13-s136-detail-icon">${d.icon}</div>
        <div><div class="b13-s136-detail-name">${d.name}</div><div class="b13-s136-detail-sub">${d.sub}</div></div>
      </div>
      <div class="b13-s136-detail-body">
        <div class="b13-s136-powers">
          <div class="b13-s136-powers-label">Power dimensions:</div>
          ${d.powers.map(p=>`
            <div class="b13-s136-power-row">
              <div class="b13-s136-power-name">${p.name}</div>
              <div class="b13-s136-power-bg"><div class="b13-s136-power-fill" style="width:${p.pct}%;background:${p.color};"></div></div>
              <div class="b13-s136-power-pct">${p.pct}%</div>
            </div>`).join('')}
        </div>
        <div class="b13-s136-sl">
          <div class="b13-s136-strength">
            <div class="b13-s136-strength-label">Strengths</div>
            ${d.strengths.map(s=>`<div class="b13-s136-strength-item">${s}</div>`).join('')}
          </div>
          <div class="b13-s136-limit">
            <div class="b13-s136-limit-label">Limitations</div>
            ${d.limits.map(l=>`<div class="b13-s136-limit-item">${l}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s136-example" style="background:${d.exBg};color:${d.exColor};">
          <strong>Real example:</strong> ${d.example}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b13-s136-actor').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s136-actor').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      render(el.dataset.actor);
    });
  });

  render('dev');
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.5 SIMULATION (Taproot)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const t1=g('b13-s135-t1'), t2=g('b13-s135-t2');
  const p1=g('b13-s135-p1'), p2=g('b13-s135-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s135-tab s135-act'; t2.className='b13-s135-tab';
    p1.className='b13-s135-pane show'; p2.className='b13-s135-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s135-tab s135-act'; t1.className='b13-s135-tab';
    p2.className='b13-s135-pane show'; p1.className='b13-s135-pane';
  });
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.4 SIMULATION (SegWit Timeline)
// ============================================================
(function() {
  const filterMap={all:null,dev:'dev',miner:'miner',community:'community',result:'result'};

  document.querySelectorAll('.b13-s134-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s134-filter').forEach(b=>b.classList.remove('s134-act'));
      btn.classList.add('s134-act');
      const cur=filterMap[btn.dataset.f];
      document.querySelectorAll('.b13-s134-event').forEach(ev=>{
        const t=ev.dataset.t;
        const show=!cur || t===cur || (cur==='result' && (t==='result'||t==='split'));
        show ? ev.classList.remove('hidden') : ev.classList.add('hidden');
      });
    });
  });

  document.querySelectorAll('.b13-s134-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const wasExpanded=card.classList.contains('expanded');
      document.querySelectorAll('.b13-s134-card').forEach(c=>c.classList.remove('expanded'));
      if(!wasExpanded) card.classList.add('expanded');
    });
  });
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.3 SIMULATION (Soft Fork Activation)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    masf:{
      icon:'⛏️',name:'MASF',full:'Miner Activated Soft Fork',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      actors:[
        {role:'Developer',action:'Writes code, sets the threshold and signaling window',bg:'#F4F4F0'},
        {role:'Miner',action:'Signals support via version bits in the block header',bg:'#EEEDFE',roleColor:'#534AB7'},
        {role:'Node / User',action:'Waits for the threshold to be reached, then automatically follows the new rules',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft ready, parameters set',bg:'#EEEDFE',fg:'#534AB7'},
        {n:'2',txt:'Miners signal via version bits',bg:'#534AB7',fg:'#fff'},
        {n:'3',txt:'95% of 2016 blocks reached',bg:'#534AB7',fg:'#fff'},
        {n:'4',txt:'Soft fork locked in, can’t be canceled',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'New rules apply across the whole network',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(83,74,183,0.2)',
      pros:['Measurable with timing certainty','Miners are ready before it activates','A gradual and safe process'],
      cons:['Miners have a de facto veto','Can be sabotaged by a large mining pool','Doesn’t reflect the will of users'],
      exampleBg:'#EEEDFE',exampleColor:'#3C3489',
      example:'Used for many early Bitcoin upgrades. BIP 9 defines the version bits mechanism used by modern MASF. Example: the CSV (CheckSequenceVerify) activation in 2016.',
    },
    uasf:{
      icon:'👤',name:'UASF',full:'User Activated Soft Fork',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      actors:[
        {role:'Developer',action:'Writes code and sets a mandatory activation date',bg:'#F4F4F0'},
        {role:'Node / User',action:'Upgrades and starts rejecting non-conforming blocks on the activation date',bg:'#EAF3DE',roleColor:'#0F6E56'},
        {role:'Miner',action:'Forced to follow the new rules or their blocks are rejected by the economic network',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'BIP Draft, activation date set',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'2',txt:'Economic nodes start upgrading',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'3',txt:'The activation date arrives',bg:'#0F6E56',fg:'#fff'},
        {n:'4',txt:'Non-conforming blocks rejected',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'5',txt:'Miners follow or lose the reward',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(15,110,86,0.2)',
      pros:['Users have real power','Can’t be blocked by miners','Reflects the economic will of the network'],
      cons:['Risky if node adoption is low','A temporary split can occur','Requires strong community coordination'],
      exampleBg:'#EAF3DE',exampleColor:'#0F6E56',
      example:'BIP 148 (2017) is the most famous UASF. It threatened to reject miner blocks that didn’t support SegWit starting August 1, 2017. This pressure worked: miners finally signaled SegWit before the deadline.',
    },
    ursf:{
      icon:'🛡️',name:'URSF',full:'User Resisted Soft Fork',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      actors:[
        {role:'Miner',action:'Activates a soft fork not agreed on by the user community',bg:'#F4F4F0'},
        {role:'Node / User',action:'Coordinate to reject the soft fork by following the chain that doesn’t contain the new rules',bg:'#FCEBEB',roleColor:'#791F1F'},
        {role:'Developer',action:'Provides software for nodes that want to perform URSF',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'Miners activate the soft fork, the community disagrees',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'2',txt:'Economic nodes coordinate to reject',bg:'#FCEBEB',fg:'#791F1F'},
        {n:'3',txt:'Nodes reject blocks with the new rules',bg:'#A32D2D',fg:'#fff'},
        {n:'4',txt:'Miners lose the economic value of their blocks',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'5',txt:'The soft fork is canceled or a split happens',bg:'#F4F4F0',fg:'#3A3A35'},
      ],
      connColor:'rgba(163,45,45,0.2)',
      pros:['Users can reject unwanted changes','Proves miners aren’t the final ruler','Checks and balances in governance'],
      cons:['Never used fully before','Very risky if coordination fails','Can cause prolonged uncertainty'],
      exampleBg:'#FCEBEB',exampleColor:'#791F1F',
      example:'URSF has never been used fully in Bitcoin’s history. It’s more of a theoretical weapon showing that users have the final veto right over changes forced by miners.',
    },
    speedy:{
      icon:'⚡',name:'Speedy Trial',full:'Speedy Trial (variasi MASF)',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      actors:[
        {role:'Developer',action:'Sets a short 3-month window and a 90% threshold',bg:'#F4F4F0'},
        {role:'Miner',action:'Signals within the short window, must be fast or the chance is lost',bg:'#FAEEDA',roleColor:'#854F0B'},
        {role:'Node / User',action:'Monitors the signal, ready to apply the new rules if the threshold is reached',bg:'#F4F4F0'},
      ],
      steps:[
        {n:'1',txt:'The 3-month window begins',bg:'#FAEEDA',fg:'#854F0B'},
        {n:'2',txt:'Miners signal quickly',bg:'#854F0B',fg:'#fff'},
        {n:'3',txt:'90% threshold of 2016 blocks',bg:'#854F0B',fg:'#fff'},
        {n:'4',txt:'Soft fork locked in within the window',bg:'#EAF3DE',fg:'#0F6E56'},
        {n:'5',txt:'Rules apply after the grace period',bg:'#EAF3DE',fg:'#0F6E56'},
      ],
      connColor:'rgba(133,79,11,0.2)',
      pros:['Faster than ordinary MASF','Gives certainty without prolonged drama','Can be repeated if it fails'],
      cons:['Still depends on miner signaling','The short window can become its own pressure','Not yet tested in many situations'],
      exampleBg:'#FAEEDA',exampleColor:'#633806',
      example:'Used to activate Taproot (2021). Miners reached the 90% threshold in a short time. Taproot was activated at block 709,632 in November 2021, without meaningful controversy.',
    },
  };

  function render(mech){
    const d=DATA[mech];
    const el=g('b13-s133-detail'); if(!el) return;
    const stepsHtml=d.steps.map((s,i)=>`
      <div class="b13-s133-tl-step">
        <div class="b13-s133-tl-dot" style="background:${s.bg};color:${s.fg};">${s.n}</div>
        <div class="b13-s133-tl-txt">${s.txt}</div>
      </div>
      ${i<d.steps.length-1?`<div class="b13-s133-tl-conn" style="background:${d.connColor};"></div>`:''}`).join('');

    el.innerHTML=`
      <div class="b13-s133-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b13-s133-detail-icon">${d.icon}</div>
        <div><div class="b13-s133-detail-name">${d.name}</div><div class="b13-s133-detail-full">${d.full}</div></div>
      </div>
      <div class="b13-s133-detail-body">
        <div>
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Each party’s role:</div>
          <div class="b13-s133-actors">${d.actors.map(a=>`
            <div class="b13-s133-actor" style="background:${a.bg};">
              <div class="b13-s133-actor-role" style="color:${a.roleColor||'#3A3A35'};">${a.role}</div>
              <div class="b13-s133-actor-action">${a.action}</div>
            </div>`).join('')}
          </div>
        </div>
        <div>
          <div class="b13-s133-timeline-label" style="margin-bottom:6px;">Activation flow:</div>
          <div class="b13-s133-tl-steps">${stepsHtml}</div>
        </div>
        <div class="b13-s133-proscons">
          <div class="b13-s133-pros">
            <div class="b13-s133-pros-label">Advantages</div>
            ${d.pros.map(p=>`<div class="b13-s133-pros-item">${p}</div>`).join('')}
          </div>
          <div class="b13-s133-cons">
            <div class="b13-s133-cons-label">Weaknesses</div>
            ${d.cons.map(c=>`<div class="b13-s133-cons-item">${c}</div>`).join('')}
          </div>
        </div>
        <div class="b13-s133-example" style="background:${d.exampleBg};color:${d.exampleColor};">
          <strong>Real example:</strong> ${d.example}
        </div>
      </div>`;
  }

  document.querySelectorAll('.b13-s133-card').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s133-card').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      render(el.dataset.mech);
    });
  });

  render('masf');
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.2 SIMULATION (BIP Lifecycle)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const BIPS={
    32:{num:'BIP 32',name:'Hierarchical Deterministic Wallets',type:'Standards Track — Applications',
      author:'Pieter Wuille',year:'2012',
      duration:'Submitted 2012, Final 2012 (a few months)',
      status:'Final',statusCls:'s132-final',
      desc:'Defines how to generate many cryptographic keys from one seed phrase. This is what allows modern wallets to use one 12-word backup for all addresses. Almost all Bitcoin wallets today implement BIP 32.'},
    141:{num:'BIP 141',name:'Segregated Witness (SegWit)',type:'Standards Track — Consensus',
      author:'Eric Lombrozo, Johnson Lau, Pieter Wuille',year:'2015',
      duration:'Submitted 2015, activated August 2017 (about 2 full years of debate)',
      status:'Final',statusCls:'s132-final',
      desc:'Separates the signature data (witness) from the main transaction data. Effectively increases block capacity, fixes transaction malleability, and opens the way for the Lightning Network. Its activation process is one of the most controversial in Bitcoin’s history.'},
    148:{num:'BIP 148',name:'UASF — Mandatory activation of segwit',type:'Standards Track — Consensus',
      author:'Shaolin Fry',year:'2017',
      duration:'Submitted March 2017, applied August 2017',
      status:'Final',statusCls:'s132-final',
      desc:'BIP 148 is a UASF (User Activated Soft Fork) that threatened to reject miner blocks not supporting SegWit starting August 1, 2017. This pressure pushed miners to finally activate SegWit before the deadline. A real example of how users and economic nodes can force change without depending on miners.'},
    340:{num:'BIP 340',name:'Schnorr Signatures',type:'Standards Track — Consensus (part of Taproot)',
      author:'Pieter Wuille, Jonas Nick, Tim Ruffing',year:'2020',
      duration:'Submitted 2020, activated November 2021 (about 1 year via Speedy Trial)',
      status:'Final',statusCls:'s132-final',
      desc:'Defines the Schnorr signature scheme for Bitcoin. More efficient than ECDSA, enables signature aggregation, and opens the way for more sophisticated privacy and smart contract features. Activated together with BIP 341 and BIP 342 as the Taproot package.'},
    352:{num:'BIP 352',name:'Silent Payments',type:'Standards Track — Applications',
      author:'josibake, Ruben Somsen',year:'2022',
      duration:'Submitted 2022, still in the process of wallet adoption',
      status:'Active',statusCls:'s132-active',
      desc:'Defines a protocol to receive payments to a static address without exposing transaction history. Every payment produces a unique on-chain address that can’t be linked to one another. Already implemented in Cake Wallet and a few other wallets, but not yet universal.'},
  };

  function renderDetail(bipNum){
    const b=BIPS[bipNum]; if(!b) return;
    const el=g('b13-s132-detail'); if(!el) return;
    el.innerHTML=`
      <div class="b13-s132-detail-head">
        <div class="b13-s132-detail-num">${b.num}</div>
        <div class="b13-s132-detail-title">${b.name}</div>
        <span class="b13-s132-bip-status ${b.statusCls}" style="margin-left:auto;flex-shrink:0;">${b.status}</span>
      </div>
      <div class="b13-s132-detail-body">
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Type</div><div class="b13-s132-detail-val">${b.type}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Author</div><div class="b13-s132-detail-val">${b.author}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Submitted</div><div class="b13-s132-detail-val">${b.year}</div></div>
        <div class="b13-s132-detail-row"><div class="b13-s132-detail-key">Timeline</div><div class="b13-s132-detail-val">${b.duration}</div></div>
        <div class="b13-s132-detail-desc">${b.desc}</div>
      </div>`;
  }

  document.querySelectorAll('.b13-s132-bip').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b13-s132-bip').forEach(e=>e.classList.remove('active'));
      el.classList.add('active');
      renderDetail(parseInt(el.dataset.bip));
    });
  });

  document.querySelectorAll('.b13-s132-type-head').forEach(el=>{
    el.addEventListener('click',()=>{
      const body=el.nextElementSibling;
      if(body) body.classList.toggle('open');
    });
  });

  const t1=g('b13-s132-t1'), t2=g('b13-s132-t2');
  const p1=g('b13-s132-p1'), p2=g('b13-s132-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s132-tab s132-act'; t2.className='b13-s132-tab';
    p1.className='b13-s132-pane show'; p2.className='b13-s132-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s132-tab s132-act'; t1.className='b13-s132-tab';
    p2.className='b13-s132-pane show'; p1.className='b13-s132-pane';
  });

  renderDetail(32);
})();

// ============================================================
// PAGE 16 · BAB 13 · 13.1 SIMULATION (Fork Viz)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   =dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34, RD=6;

  function setupCanvas(id, h){
    const cv=g(id); if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr; cv.height=h*dpr;
    const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,h);
    return {ctx,W,H:h};
  }

  function drawBlock(ctx,x,y,lbl,bg,fg,border,dashed){
    ctx.save();
    if(dashed){ctx.setLineDash([3,2]);ctx.globalAlpha=0.5;}
    ctx.beginPath(); ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg; ctx.fill();
    ctx.strokeStyle=border||'transparent'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha=1;
    ctx.fillStyle=fg; ctx.font='bold 9px monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);
    ctx.restore();
  }

  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED; ctx.font='12px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('→',x,y);
  }

  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col; ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y);
  }

  function cornerX(ctx,x,y){
    const cx=x+BS-5, cy=y+5, s=3.5;
    ctx.save(); ctx.strokeStyle='#A32D2D'; ctx.lineWidth=1.8; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-s,cy-s); ctx.lineTo(cx+s,cy+s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+s,cy-s); ctx.lineTo(cx-s,cy+s); ctx.stroke();
    ctx.restore();
  }

  function cornerCheck(ctx,x,y){
    const cx=x+BS-6, cy=y+6;
    ctx.save(); ctx.strokeStyle='#0F6E56'; ctx.lineWidth=1.8; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(cx-3,cy); ctx.lineTo(cx-1,cy+3); ctx.lineTo(cx+4,cy-3); ctx.stroke();
    ctx.restore();
  }

  function drawHard(){
    const r=setupCanvas('b13-s131-cv-hard',195); if(!r) return;
    const {ctx,W,H}=r;
    const AW=18, GAP=6, STEP=BS+GAP+AW+GAP;
    const SX=14, midY=H/2, topY=28, botY=H-28-BS;

    drawBlock(ctx,SX,midY-BS/2,'100','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
    drawArrow(ctx,SX+BS+AW/2+GAP,midY);
    drawBlock(ctx,SX+STEP,midY-BS/2,'101','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');

    const stemX=SX+STEP+BS+GAP, forkX=stemX+18;
    ctx.save(); ctx.strokeStyle='rgba(124,58,237,0.2)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,midY); ctx.lineTo(forkX,midY);
    ctx.moveTo(forkX,midY); ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,midY); ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke(); ctx.restore();

    const CX=forkX+GAP;
    drawText(ctx,CX,topY-10,'Network A (upgraded nodes)','#534AB7',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Network B (old nodes)','#854F0B',9,true,'left');

    ['102*','103*','104*'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP-GAP,topY+BS/2,'← longest in A','#534AB7',9,false,'left');

    ['102','103','104'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,botY+BS/2,'rgba(133,79,11,0.4)');
      drawBlock(ctx,bx,botY,lbl,'#FAEEDA','#854F0B','rgba(133,79,11,0.3)');
    });
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← longest in B','#854F0B',9,false,'left');

    drawText(ctx,forkX,midY+10,'fork','#A32D2D',8,false,'center');
    const midCX=CX+STEP;
    drawText(ctx,midCX+BS/2,midY,'separate networks','#A32D2D',8,false,'center');
  }

  function drawSoft(){
    const r=setupCanvas('b13-s131-cv-soft',200); if(!r) return;
    const {ctx,W,H}=r;
    const AW=18, GAP=6, STEP=BS+GAP+AW+GAP;
    const SX=14, topY=28, botY=H-38-BS;
    const sharedCY=(topY+BS/2+botY+BS/2)/2;

    drawBlock(ctx,SX,sharedCY-BS/2,'100','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
    drawArrow(ctx,SX+BS+AW/2+GAP,sharedCY);
    drawBlock(ctx,SX+STEP,sharedCY-BS/2,'101','#EEEDFE','#534AB7','rgba(83,74,183,0.3)');

    const stemX=SX+STEP+BS+GAP, forkX=stemX+18;
    ctx.save(); ctx.strokeStyle='rgba(124,58,237,0.2)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,sharedCY); ctx.lineTo(forkX,sharedCY);
    ctx.moveTo(forkX,sharedCY); ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,sharedCY); ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke(); ctx.restore();

    const CX=forkX+GAP;
    drawText(ctx,CX,topY-10,'Majority — upgraded nodes (large hash rate)','#0F6E56',9,true,'left');
    drawText(ctx,CX,botY+BS+10,'Minority — not upgraded (small hash rate)','#854F0B',9,true,'left');

    ['102†','103†','104†','105†'].forEach((lbl,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(15,110,86,0.4)');
      drawBlock(ctx,bx,topY,lbl,'#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
      cornerCheck(ctx,bx,topY);
    });
    drawText(ctx,CX+4*STEP-GAP,topY+BS/2,'← longest ✓','#0F6E56',9,true,'left');

    drawBlock(ctx,CX,botY,'102†','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
    cornerCheck(ctx,CX,botY);
    drawArrow(ctx,CX+BS+AW/2+GAP,botY+BS/2,'rgba(133,79,11,0.4)');
    drawBlock(ctx,CX+STEP,botY,'103x','#FCEBEB','#791F1F','rgba(163,45,45,0.3)');
    cornerX(ctx,CX+STEP,botY);
    drawArrow(ctx,CX+2*STEP-AW/2-GAP+AW,botY+BS/2,'rgba(163,45,45,0.3)');
    drawBlock(ctx,CX+2*STEP,botY,'104?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
    drawText(ctx,CX+3*STEP-GAP,botY+BS/2,'← shorter, abandoned','#A32D2D',9,false,'left');

    drawText(ctx,forkX,sharedCY+12,'soft fork active','#52524C',8,false,'center');
  }

  function drawAll(){ drawHard(); drawSoft(); }
  drawAll();

  const t1=g('b13-s131-t1'), t2=g('b13-s131-t2');
  const p1=g('b13-s131-p1'), p2=g('b13-s131-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b13-s131-tab s131-act'; t2.className='b13-s131-tab';
    p1.className='b13-s131-pane show'; p2.className='b13-s131-pane';
    requestAnimationFrame(drawHard);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b13-s131-tab s131-act'; t1.className='b13-s131-tab';
    p2.className='b13-s131-pane show'; p1.className='b13-s131-pane';
    requestAnimationFrame(drawSoft);
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawAll)).observe(g('b13-s131-cv-hard')||document.body);
  }
})();

