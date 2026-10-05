// ============================================================
// PAGE 18 · BAB 15 · NAVIGATION
// ============================================================
function showSectionInContentB15(sectionId, sbId) {
  document.querySelectorAll('#page-bab15 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab15 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab15-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 18 · BAB 15 · TOPBAR
// ============================================================
document.getElementById('back-home-b15').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b15').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 18 · BAB 15 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab15').addEventListener('click', () => navigate('page-bab15'));

// ============================================================
// PAGE 18 · BAB 15 · SIDEBAR EVENTS (15.1 - 15.6)
// ============================================================
document.getElementById('sb-15-1').addEventListener('click', () => showSectionInContentB15('section-15-1', 'sb-15-1'));
document.getElementById('sb-15-2').addEventListener('click', () => showSectionInContentB15('section-15-2', 'sb-15-2'));
document.getElementById('sb-15-3').addEventListener('click', () => showSectionInContentB15('section-15-3', 'sb-15-3'));
document.getElementById('sb-15-4').addEventListener('click', () => showSectionInContentB15('section-15-4', 'sb-15-4'));
document.getElementById('sb-15-5').addEventListener('click', () => showSectionInContentB15('section-15-5', 'sb-15-5'));
document.getElementById('sb-15-6').addEventListener('click', () => showSectionInContentB15('section-15-6', 'sb-15-6'));

// ============================================================
// PAGE 18 · BAB 15 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab15 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB15(target, sb);
  });
});

// ============================================================
// PAGE 18 · BAB 15 · 15.6 SIMULATION (Use Case Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const DATA={
    dms:{
      icon:'🔐',title:"Dead Man's Switch",
      sub:'A digital inheritance that can’t be blocked by a bank, a government, or anyone',
      headBg:'#EAF3DE',headBorder:'rgba(15,110,86,0.15)',
      plain:'You have a main key to access the funds anytime. But if you don’t "check in" (move the funds) for 1 year, the backup key held by your heir can automatically claim the funds. No notary needed. No court needed. Mathematics enforces it.',
      components:[['s156-csv','CSV (relative timelock)'],['s156-multisig','2-key setup']],
      flow:[
        {cls:'s156-green', who:'Main key (you)',cond:'Can move the funds ANYTIME. Each move resets the CSV clock.'},
        {cls:'s156-amber', who:'CSV clock',cond:'Starts running since the UTXO was last confirmed. Target: 52,560 blocks (~1 year).'},
        {cls:'s156-purple',who:'Backup key',cond:'Can claim AFTER 52,560 blocks with no activity from the main key.'},
      ],
      limit:'The owner must periodically refresh the UTXO before 1 year runs out. If they forget, the heir can claim earlier than intended. The solution: set an annual reminder.',
    },
    vault:{
      icon:'🏦',title:'Vault with Cooldown',
      sub:'An extra security layer: funds can’t be moved immediately even if the private key is stolen',
      headBg:'#EEEDFE',headBorder:'rgba(83,74,183,0.15)',
      plain:'Before funds from the vault can be moved, you must first create an "unvault transaction" that’s locked for 144 blocks (~1 day). During those 144 blocks, you can still cancel with an emergency key. If a hacker steals the key and tries to drain the vault, you have 1 day to notice and cancel.',
      components:[['s156-csv','CSV 144 blocks (cooldown)'],['s156-cltv','CLTV (emergency cancel)']],
      flow:[
        {cls:'s156-purple',who:'Step 1',cond:'Create the "unvault transaction" — announcing the intent to withdraw funds.'},
        {cls:'s156-amber', who:'Waiting',cond:'The 144-block CSV window runs. The funds can’t be moved yet.'},
        {cls:'s156-green', who:'Step 2A',cond:'After 144 blocks, the funds can be moved to the destination.'},
        {cls:'s156-red',   who:'Step 2B (cancel)',cond:'Anytime within 144 blocks, the emergency key cancels and returns the funds to cold storage.'},
      ],
      limit:'A vault requires two on-chain transactions for each withdrawal (unvault + spend), so the cost is higher. But for large funds, this is a worthwhile tradeoff.',
    },
    escrow:{
      icon:'🤝',title:'Trustless Escrow',
      sub:'A payment guaranteed by mathematics — without needing to trust an arbiter, a platform, or anyone',
      headBg:'#FAEEDA',headBorder:'rgba(133,79,11,0.15)',
      plain:'The buyer locks funds in a 2-of-3 multisig between the buyer, seller, and arbiter. If everything goes smoothly, the buyer and seller release the funds together. If there’s no activity within 30 days, the funds can automatically be claimed by the seller. If there’s a dispute, the arbiter helps determine the winner.',
      components:[['s156-nlocktime','nLockTime (time limit)'],['s156-multisig','2-of-3 multisig'],['s156-cltv','CLTV (auto-release 30 days)']],
      flow:[
        {cls:'s156-green', who:'Scenario A',cond:'Buyer + seller agree → funds released immediately (without the arbiter).'},
        {cls:'s156-amber', who:'Scenario B',cond:'There’s a dispute → the arbiter helps → funds released to the winner (2-of-3).'},
        {cls:'s156-purple',who:'Scenario C',cond:'No activity for 30 days → the seller claims automatically with CLTV.'},
        {cls:'s156-red',   who:'Scenario D',cond:'The buyer wants a refund within 30 days → needs the seller’s or arbiter’s approval.'},
      ],
      limit:'Timelock can’t verify whether the goods have actually been delivered. For that, minimal trust in an arbiter or an off-chain reputation system is still needed.',
    },
    milestone:{
      icon:'📅',title:'Milestone Payment',
      sub:'Pay in stages according to agreed achievements — automatic, can’t be denied',
      headBg:'#FCEBEB',headBorder:'rgba(163,45,45,0.15)',
      plain:'The client and contractor agree: 30% upfront, 40% after milestone 1 (block X), 30% after milestone 2 (block Y). The funds are locked in the script from the start. The contractor can claim each tranche after the target block is reached without needing the client’s approval.',
      components:[['s156-nlocktime','nLockTime (schedule)'],['s156-cltv','CLTV per milestone'],['s156-multisig','Contractor signature']],
      flow:[
        {cls:'s156-green', who:'Tranche 1 (30%)',cond:'Locked upfront. The contractor claims immediately after the contract is on-chain.'},
        {cls:'s156-amber', who:'Tranche 2 (40%)',cond:'Locked with CLTV block X (milestone 1). Automatic claim without client approval.'},
        {cls:'s156-purple',who:'Tranche 3 (30%)',cond:'Locked with CLTV block Y (milestone 2). Automatic claim after the target block.'},
        {cls:'s156-red',   who:'Dispute window',cond:'Before the target block, the client can dispute with the arbiter multisig mechanism.'},
      ],
      limit:'Block-based milestones can’t verify the quality of work — they only verify that the deadline has passed. For milestones based on real outcomes, an oracle or off-chain mechanism is still needed.',
    },
  };

  function render(uc){
    const d=DATA[uc];if(!d) return;
    const el=g('b15-s156-detail');if(!el) return;
    const compHTML=d.components.map(([cls,lbl])=>`<span class="b15-s156-component ${cls}">${lbl}</span>`).join('');
    const flowHTML=d.flow.map(f=>`
      <div class="b15-s156-flow-row ${f.cls}">
        <div class="b15-s156-flow-who">${f.who}</div>
        <div class="b15-s156-flow-cond">${f.cond}</div>
      </div>`).join('');
    el.innerHTML=`
      <div class="b15-s156-detail-head" style="background:${d.headBg};border-bottom:0.5px solid ${d.headBorder};">
        <div class="b15-s156-detail-icon">${d.icon}</div>
        <div><div class="b15-s156-detail-title">${d.title}</div><div class="b15-s156-detail-sub">${d.sub}</div></div>
      </div>
      <div class="b15-s156-detail-body">
        <div class="b15-s156-plain">${d.plain}</div>
        <div>
          <div class="b15-s156-components-label">Timelock components used:</div>
          <div class="b15-s156-component-row">${compHTML}</div>
        </div>
        <div>
          <div class="b15-s156-flow-label">Who can do what when:</div>
          <div class="b15-s156-flow-rows">${flowHTML}</div>
        </div>
        <div class="b15-s156-limit"><strong>Limitations:</strong> ${d.limit}</div>
      </div>`;
  }

  document.querySelectorAll('.b15-s156-card').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.b15-s156-card').forEach(e=>e.classList.remove('s156-act'));
      el.classList.add('s156-act');
      render(el.dataset.uc);
    });
  });

  render('dms');
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.5 SIMULATION (CSV Lightning)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const HONEST=[
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Active',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice and Bob have an active payment channel',
     desc:'They’ve already transacted many times off-chain. Latest state: Alice has 0.6 BTC, Bob has 0.4 BTC.',
     bar:0,barLabel:'',barDesc:'The CSV window hasn’t started.'},
    {dot:'2',dotBg:'#534AB7',tag:'Force Close',tagBg:'#534AB7',cls:'s155-tx',
     title:'Bob decides to force-close the channel',
     desc:'Bob broadcasts the latest honest commitment transaction to the blockchain. This transaction is confirmed.',
     bar:0,barLabel:'0 / 144 blocks',barDesc:'The CSV window starts running since the commitment transaction was confirmed.'},
    {dot:'3',dotBg:'#854F0B',tag:'CSV Window',tagBg:'#854F0B',cls:'s155-csv',
     title:'Waiting for 144 blocks to pass',
     desc:'Bob’s funds are locked in an output with CSV 144 blocks. During this period, Alice verifies that the broadcast commitment is the latest one. No cheating.',
     bar:65,barLabel:'94 / 144 blocks',barDesc:'Alice verifies the commitment transaction — everything is correct.'},
    {dot:'4',dotBg:'#0F6E56',tag:'Done',tagBg:'#0F6E56',cls:'s155-ok',
     title:'144 blocks pass — Bob can claim his funds',
     desc:'The CSV window ends without incident. Bob claims his 0.4 BTC. Alice already took her share from the start because Alice’s output has no CSV.',
     bar:100,barLabel:'144 / 144 blocks — DONE',barDesc:'The force close completes safely. Both parties get the correct funds.'},
  ];

  const CHEAT=[
    {dot:'1',dotBg:'#0F6E56',tag:'Channel Active',tagBg:'#0F6E56',cls:'s155-open',
     title:'Alice and Bob have an active payment channel',
     desc:'Latest state: Alice 0.8 BTC, Bob 0.2 BTC. But there’s an old state: Alice 0.3 BTC, Bob 0.7 BTC.',
     bar:0,barLabel:'',barDesc:''},
    {dot:'2',dotBg:'#A32D2D',tag:'Bob Cheats',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Bob broadcasts an OLD commitment transaction',
     desc:'Bob broadcasts the old commitment where he has 0.7 BTC. He hopes Alice isn’t paying attention.',
     bar:0,barLabel:'0 / 144 blocks',barDesc:'The CSV window starts. Bob must wait 144 blocks before he can claim. This is Alice’s time to act.'},
    {dot:'3',dotBg:'#854F0B',tag:'Alice Vigilant',tagBg:'#854F0B',cls:'s155-csv',
     title:'Alice detects the cheating — the old commitment is detected',
     desc:'Alice’s node monitors the blockchain 24/7. She matches the broadcast commitment with the revocation key she keeps. Caught: this isn’t the latest state!',
     bar:30,barLabel:'43 / 144 blocks',barDesc:'Bob can only claim after 144 blocks. Alice still has 101 blocks to act.'},
    {dot:'4',dotBg:'#A32D2D',tag:'Penalty!',tagBg:'#A32D2D',cls:'s155-warn',
     title:'Alice broadcasts a penalty transaction',
     desc:'Alice uses the revocation key to claim ALL the channel funds — including Bob’s share. This is the punishment for cheating. The penalty transaction is confirmed before the CSV window ends.',
     bar:55,barLabel:'79 / 144 blocks',barDesc:'Alice successfully submits the penalty BEFORE the CSV window ends. Bob loses.'},
    {dot:'5',dotBg:'#534AB7',tag:'Done',tagBg:'#534AB7',cls:'s155-ok',
     title:'Alice gets all the funds — 1 BTC total',
     desc:'Bob loses everything because he tried to cheat. Alice gets the entire 1 BTC in the channel. This is the fairness mechanism that makes the Lightning Network safe without needing to trust anyone.',
     bar:100,barLabel:'Penalty confirmed!',barDesc:'The CSV window hasn’t ended — the penalty succeeds. Bob gets nothing.'},
  ];

  function renderSteps(steps,containerId){
    const el=g(containerId);if(!el) return;
    el.innerHTML='';
    steps.forEach((s,i)=>{
      const step=document.createElement('div');step.className='b15-s155-step';
      const dot=document.createElement('div');dot.className='b15-s155-step-dot';dot.style.background=s.dotBg;dot.textContent=s.dot;
      const card=document.createElement('div');card.className=`b15-s155-step-card ${s.cls}`;card.id=`${containerId}-card-${i}`;
      const tag=document.createElement('div');tag.className='b15-s155-step-tag';tag.style.background=s.tagBg;tag.textContent=s.tag;
      const title=document.createElement('div');title.className='b15-s155-step-title';title.textContent=s.title;
      const desc=document.createElement('div');desc.className='b15-s155-step-desc';desc.textContent=s.desc;
      card.appendChild(tag);card.appendChild(title);card.appendChild(desc);
      step.appendChild(dot);step.appendChild(card);el.appendChild(step);
    });
  }

  function activateStep(steps,containerId,idx){
    steps.forEach((_,i)=>{
      const card=g(`${containerId}-card-${i}`);
      if(card) card.classList.toggle('active',i<=idx);
    });
  }

  // Honest
  let hStep=-1;
  renderSteps(HONEST,'b15-s155-honest-steps');

  function updateH(){
    if(hStep<0) return;
    const s=HONEST[hStep];
    const bar=g('b15-s155-h-bar');const lbl=g('b15-s155-h-bar-label');const desc=g('b15-s155-h-bar-desc');
    if(bar) bar.style.width=s.bar+'%';if(lbl) lbl.textContent=s.barLabel;if(desc) desc.textContent=s.barDesc;
    activateStep(HONEST,'b15-s155-honest-steps',hStep);
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent=`Step ${hStep+1} / ${HONEST.length}`;
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=hStep>=HONEST.length-1;
    const res=g('b15-s155-h-result');
    if(res){
      if(hStep===HONEST.length-1){res.className='b15-s155-result s155-good';res.textContent='The force close completes safely. The CSV window serves as a verification period — not a punishment. Both parties get their respective rights.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const hNext=g('b15-s155-h-next');if(hNext) hNext.addEventListener('click',()=>{if(hStep<HONEST.length-1){hStep++;updateH();}});
  const hRst=g('b15-s155-h-rst');if(hRst) hRst.addEventListener('click',()=>{
    hStep=-1;
    const bar=g('b15-s155-h-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-h-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-h-bar-desc');if(desc) desc.textContent='Starts after the commitment transaction is confirmed.';
    activateStep(HONEST,'b15-s155-honest-steps',-1);
    const ind=g('b15-s155-h-ind');if(ind) ind.textContent='Step 0 / 4';
    const btn=g('b15-s155-h-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-h-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Click "Next Step" to see the honest force close process.';}
  });

  // Cheat
  let cStep=-1;
  renderSteps(CHEAT,'b15-s155-cheat-steps');

  function updateC(){
    if(cStep<0) return;
    const s=CHEAT[cStep];
    const bar=g('b15-s155-c-bar');const lbl=g('b15-s155-c-bar-label');const desc=g('b15-s155-c-bar-desc');
    if(bar) bar.style.width=s.bar+'%';if(lbl) lbl.textContent=s.barLabel;if(desc) desc.textContent=s.barDesc;
    activateStep(CHEAT,'b15-s155-cheat-steps',cStep);
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent=`Step ${cStep+1} / ${CHEAT.length}`;
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=cStep>=CHEAT.length-1;
    const res=g('b15-s155-c-result');
    if(res){
      if(cStep===CHEAT.length-1){res.className='b15-s155-result s155-bad';res.textContent='Bob loses everything. The CSV window is what gives Alice time to detect and punish the cheating. Without CSV, Bob could claim immediately before Alice had a chance to react.';}
      else{res.className='b15-s155-result s155-info';res.textContent=s.title;}
    }
  }

  const cNext=g('b15-s155-c-next');if(cNext) cNext.addEventListener('click',()=>{if(cStep<CHEAT.length-1){cStep++;updateC();}});
  const cRst=g('b15-s155-c-rst');if(cRst) cRst.addEventListener('click',()=>{
    cStep=-1;
    const bar=g('b15-s155-c-bar');if(bar) bar.style.width='0%';
    const lbl=g('b15-s155-c-bar-label');if(lbl) lbl.textContent='';
    const desc=g('b15-s155-c-bar-desc');if(desc) desc.textContent='Alice must act before the window runs out.';
    activateStep(CHEAT,'b15-s155-cheat-steps',-1);
    const ind=g('b15-s155-c-ind');if(ind) ind.textContent='Step 0 / 5';
    const btn=g('b15-s155-c-next');if(btn) btn.disabled=false;
    const res=g('b15-s155-c-result');if(res){res.className='b15-s155-result s155-idle';res.textContent='Click "Next Step" to see what happens when Bob tries to cheat.';}
  });

  // Tabs
  const t1=g('b15-s155-t1'),t2=g('b15-s155-t2');
  const p1=g('b15-s155-p1'),p2=g('b15-s155-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b15-s155-tab s155-act';t2.className='b15-s155-tab';
    p1.className='b15-s155-pane show';p2.className='b15-s155-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b15-s155-tab s155-act';t1.className='b15-s155-tab';
    p2.className='b15-s155-pane show';p1.className='b15-s155-pane';
  });
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.4 SIMULATION (CLTV Builder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const SCENARIOS={
    simple:{
      claimers:[
        {cls:'s154-alice',name:'Alice',cond:'Can claim AFTER block 950,000 (about 8 months from now) — with her signature.'},
      ],
      timeline:[
        {from:0,to:40,bg:'#FCEBEB',label:'Locked — no one can claim',labelColor:'#A32D2D'},
        {from:40,to:100,bg:'#EAF3DE',label:'Alice can claim',labelColor:'#0F6E56'},
      ],
      lockAt:40,
      script:[
        {cls:'s154-op-time',code:'<950000>',explain:'Push the number 950,000 to the stack. This is the target block height — not before this block.'},
        {cls:'s154-op-cltv',code:'OP_CHECKLOCKTIMEVERIFY',explain:'Check: is the transaction’s nLockTime >= 950,000? If not, the script fails immediately. This is what enforces the timelock.'},
        {cls:'s154-op-flow',code:'OP_DROP',explain:'Discard the number 950,000 from the stack — no longer needed after the check.'},
        {cls:'s154-op-data',code:'OP_DUP',explain:'Duplicate Alice’s public key on the stack.'},
        {cls:'s154-op-data',code:'OP_HASH160',explain:'Hash Alice’s public key.'},
        {cls:'s154-op-data',code:'<PKH_Alice>',explain:'Push the expected hash of Alice’s public key.'},
        {cls:'s154-op-data',code:'OP_EQUALVERIFY',explain:'Ensure the provided key matches the expected one.'},
        {cls:'s154-op-sig', code:'OP_CHECKSIG',explain:'Verify Alice’s signature. If valid, the UTXO can be spent.'},
      ],
      note:'This is the simplest one-way timelock. No one can touch the funds until block 950,000 is reached — including the sender. Suitable for: time deposits, locked savings, or scholarship funds that can’t be used before the semester starts.',
    },
    branch:{
      claimers:[
        {cls:'s154-alice',name:'Alice',cond:'Can claim ANYTIME — with her signature. No time limit.'},
        {cls:'s154-bob',  name:'Bob',  cond:'Can claim AFTER block 966,000 (about 6 months) — if Alice doesn’t show up.'},
      ],
      timeline:[
        {from:0,to:55,bg:'#EAF3DE',label:'Alice can claim',labelColor:'#0F6E56'},
        {from:55,to:100,bg:'#E8E6FD',label:'Alice AND Bob can claim',labelColor:'#534AB7'},
      ],
      lockAt:55,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Branching: if Alice chooses this path, run the first block.'},
        {cls:'s154-op-sig', code:'  <pubkey_Alice>',explain:'(Alice’s path) Verify Alice’s signature. No time condition.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Alice’s path) If Alice’s signature is valid, the script succeeds.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'If not Alice, enter Bob’s path.'},
        {cls:'s154-op-time',code:'  <966000>',explain:'(Bob’s path) Push the target block height for Bob.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Bob’s path) Ensure block 966,000 has passed. If not, the script fails.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Bob’s path) Discard the number from the stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_Bob>',explain:'(Bob’s path) Verify Bob’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Bob’s path) If Bob’s signature is valid and block 966,000 has passed, the script succeeds.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Close the branching.'},
      ],
      note:'A powerful dead man’s switch pattern. Alice has full access anytime. But if Alice is inactive for 6 months, Bob (the heir or backup key) can take over. No notary, no lawyer — mathematics guards it.',
    },
    htlc:{
      claimers:[
        {cls:'s154-alice',name:'Recipient',cond:'Can claim by revealing the hashed secret (preimage). Anytime before the timeout.'},
        {cls:'s154-bob',  name:'Sender',cond:'Can refund AFTER block 920,000 (timeout) — if the recipient doesn’t reveal the secret.'},
      ],
      timeline:[
        {from:0,to:45,bg:'#E8E6FD',label:'Recipient can claim (with the preimage)',labelColor:'#534AB7'},
        {from:45,to:100,bg:'#FAEEDA',label:'Sender can refund',labelColor:'#854F0B'},
      ],
      lockAt:45,
      script:[
        {cls:'s154-op-flow',code:'OP_IF',explain:'Branching: if the recipient reveals the preimage, this path is taken.'},
        {cls:'s154-op-data',code:'  OP_SHA256',explain:'(Recipient’s path) Hash the value provided by the recipient.'},
        {cls:'s154-op-data',code:'  <payment_hash>',explain:'(Recipient’s path) The agreed hash. If SHA256(preimage) matches, the recipient is proven to know the secret.'},
        {cls:'s154-op-data',code:'  OP_EQUALVERIFY',explain:'(Recipient’s path) Ensure the hash matches.'},
        {cls:'s154-op-sig', code:'  <pubkey_recipient>',explain:'(Recipient’s path) Verify the recipient’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Recipient’s path) If the preimage is correct and the signature is valid, the recipient can claim.'},
        {cls:'s154-op-flow',code:'OP_ELSE',explain:'If the recipient doesn’t reveal the preimage, enter the refund path.'},
        {cls:'s154-op-time',code:'  <920000>',explain:'(Refund path) The timeout block. After this the sender can refund.'},
        {cls:'s154-op-cltv',code:'  OP_CHECKLOCKTIMEVERIFY',explain:'(Refund path) Ensure block 920,000 has passed. Prevents the sender from refunding too early.'},
        {cls:'s154-op-flow',code:'  OP_DROP',explain:'(Refund path) Discard the number from the stack.'},
        {cls:'s154-op-sig', code:'  <pubkey_sender>',explain:'(Refund path) Verify the sender’s signature.'},
        {cls:'s154-op-sig', code:'  OP_CHECKSIG',explain:'(Refund path) If the timeout is reached and the signature is valid, the sender can refund.'},
        {cls:'s154-op-flow',code:'OP_ENDIF',explain:'Close the branching.'},
      ],
      note:'A Hash Time Lock Contract (HTLC) — the foundation of every payment on the Lightning Network. The recipient has an incentive to reveal the preimage because it’s the only way to claim the funds. The sender is safe because if it fails, the funds automatically return after the timeout. No third party.',
    },
  };

  function renderTL(sc){
    const track=g('b15-s154-tl-track');if(!track) return;
    track.innerHTML='';
    const data=SCENARIOS[sc];
    data.timeline.forEach(z=>{
      const el=document.createElement('div');
      el.className='b15-s154-tl-zone';
      el.style.left=z.from+'%';el.style.width=(z.to-z.from)+'%';el.style.background=z.bg;
      const lbl=document.createElement('div');
      lbl.className='b15-s154-tl-zone-label';lbl.style.color=z.labelColor;lbl.textContent=z.label;
      el.appendChild(lbl);track.appendChild(el);
    });
    const now=document.createElement('div');now.className='b15-s154-tl-now';now.style.left='10%';
  const nowLbl=document.createElement('div');nowLbl.className='b15-s154-tl-now-label';nowLbl.style.left='12%';nowLbl.textContent='now';
    const lock=document.createElement('div');lock.className='b15-s154-tl-lock';lock.style.left=data.lockAt+'%';
    const lockLbl=document.createElement('div');lockLbl.className='b15-s154-tl-lock-label';lockLbl.style.left=(data.lockAt+1)+'%';lockLbl.textContent='timelock';
    track.appendChild(now);track.appendChild(nowLbl);track.appendChild(lock);track.appendChild(lockLbl);
  }

  function renderClaimers(sc){
    const el=g('b15-s154-claimers');if(!el) return;
    const data=SCENARIOS[sc];
    el.innerHTML=data.claimers.map(c=>`
      <div class="b15-s154-claimer ${c.cls}">
        <div class="b15-s154-claimer-name">${c.name}</div>
        <div class="b15-s154-claimer-cond">${c.cond}</div>
      </div>`).join('');
    el.style.gridTemplateColumns=data.claimers.length===1?'1fr':'1fr 1fr';
  }

  function renderScript(sc){
    const el=g('b15-s154-script-lines');if(!el) return;
    el.innerHTML=SCENARIOS[sc].script.map(l=>`
      <div class="b15-s154-script-line ${l.cls}">
        <div class="b15-s154-script-code">${bsEscHTML(l.code)}</div>
        <div class="b15-s154-script-explain">${l.explain}</div>
      </div>`).join('');
  }

  function render(sc){
    renderTL(sc);renderClaimers(sc);renderScript(sc);
    const note=g('b15-s154-note');if(note) note.textContent=SCENARIOS[sc].note;
  }

  document.querySelectorAll('.b15-s154-scenario-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b15-s154-scenario-btn').forEach(b=>b.classList.remove('s154-act'));
      btn.classList.add('s154-act');
      render(btn.dataset.sc);
    });
  });

  render('simple');
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.3 SIMULATION (nSequence Decoder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let enabled=true, useTime=false, value=144;

  function toHex(n){return '0x'+n.toString(16).toUpperCase().padStart(8,'0');}

  function renderBits(n){
    const bitsEl=g('b15-s153-hex-bits');
    const labelsEl=g('b15-s153-bit-labels');
    if(!bitsEl||!labelsEl) return;
    bitsEl.innerHTML='';labelsEl.innerHTML='';
    for(let i=31;i>=0;i--){
      const bit=(n>>>i)&1;
      const b=document.createElement('div');
      let cls='b15-s153-sbit ';
      if(bit){
        if(i===31) cls+='s153-special';
        else if(i===22) cls+='s153-unit';
        else cls+='s153-b1';
      } else cls+='s153-b0';
      b.className=cls;b.textContent=bit;
      bitsEl.appendChild(b);
      const lbl=document.createElement('div');
      lbl.className='b15-s153-bit-lbl';
      if(i===31) lbl.textContent='on/off';
      else if(i===22) lbl.textContent='unit';
      else if(i===15) lbl.textContent='value';
      labelsEl.appendChild(lbl);
    }
  }

  function calcVal(){
    if(!enabled) return 0xFFFFFFFF;
    let n=0;
    if(useTime) n|=(1<<22);
    n|=(value&0xFFFF);
    return n>>>0;
  }

  function update(){
    const n=calcVal();
    const hv=g('b15-s153-hex-val');if(hv) hv.textContent=toHex(n);
    renderBits(n);
    const mt=g('b15-s153-meaning-text');
    const ms=g('b15-s153-meaning-sub');
    const ml=g('b15-s153-meaning-label');
    const mw=g('b15-s153-meaning');
    const uc=g('b15-s153-usecase');

    if(n===0xFFFFFFFF){
      if(mw) mw.className='b15-s153-meaning s153-maxval';
      if(ml) ml.textContent='Special value: 0xFFFFFFFF';
      if(mt) mt.textContent='Timelock DISABLED — this UTXO can be spent anytime after being confirmed.';
      if(ms) ms.textContent='The value 0xFFFFFFFF is the default value meaning no timelock at all. It also disables nLockTime at the transaction level. Many wallets use this value for ordinary transactions.';
      if(uc) uc.textContent='Used for: ordinary everyday transactions. No time delay, the UTXO can be spent immediately after confirmation.';
      return;
    }
    if(!enabled){
      if(mw) mw.className='b15-s153-meaning s153-disabled';
      if(ml) ml.textContent='Timelock disabled (bit 31 = 1)';
      if(mt) mt.textContent='Relative timelock DISABLED for this input.';
      if(ms) ms.textContent='Bit 31 set to 1 disables the relative timelock. The UTXO can be spent anytime after being confirmed, without additional delay.';
      if(uc) uc.textContent='Used for: transactions that don’t need a relative timelock but need nSequence for another reason.';
      return;
    }
    if(mw) mw.className='b15-s153-meaning s153-active';
    if(ml) ml.textContent='What it means in plain language:';
    if(!useTime){
      const days=Math.round(value*10/1440*10)/10;
      const daysStr=days<1?`${Math.round(value*10)} minutes`:`${days} days`;
      if(mt) mt.textContent=`This UTXO can only be spent after ${value.toLocaleString('en-US')} blocks (about ${daysStr}) from when the transaction is confirmed.`;
      if(ms) ms.textContent=`The clock starts running not from now, but from when the UTXO is confirmed on the blockchain. If the transaction is confirmed on Monday, this UTXO can only be used after ${value} blocks later.`;
      if(uc){
        if(value<=144) uc.textContent='Used for: Lightning Network force close. The ~1-day waiting period gives time to detect cheating and submit a penalty transaction.';
        else if(value<=1008) uc.textContent='Used for: a simple vault, short-term escrow, or a cooldown period before a large transaction is executed.';
        else uc.textContent='Used for: medium-term escrow, contracts with a longer waiting period.';
      }
    } else {
      const secs=value*512;
      const hours=Math.round(secs/3600*10)/10;
      const days=Math.round(secs/86400*10)/10;
      const timeStr=days>=1?`${days} days`:hours>=1?`${hours} hours`:`${secs} seconds`;
      if(mt) mt.textContent=`This UTXO can only be spent after ${value.toLocaleString('en-US')} time units (${timeStr}) from when the transaction is confirmed.`;
      if(ms) ms.textContent='One unit = 512 seconds (~8.5 minutes). Time units are more precise than blocks, but blocks are more commonly used because they’re easier to predict.';
      if(uc) uc.textContent='Used for: scenarios that need higher time precision than the ~10-minute block unit.';
    }
  }

  function setEnabled(val){
    enabled=val;
    const track=g('b15-s153-tog1-track');
    const label=g('b15-s153-tog1-label');
    const state=g('b15-s153-tog1-state');
    const uc2=g('b15-s153-unit-card');
    const vc=g('b15-s153-val-card');
    const ub=g('b15-s153-u-block');
    const ut=g('b15-s153-u-time');
    const sl=g('b15-s153-slider');
    if(val){
      if(track) track.className='b15-s153-toggle-track s153-on';
      if(label) label.textContent='Timelock ACTIVE';
      if(state) state.textContent='(bit 31 = 0)';
      if(uc2) uc2.style.opacity='1';
      if(vc) vc.style.opacity='1';
      if(ub) ub.disabled=false;
      if(ut) ut.disabled=false;
      if(sl) sl.disabled=false;
    } else {
      if(track) track.className='b15-s153-toggle-track s153-warn';
      if(label) label.textContent='Timelock DISABLED';
      if(state) state.textContent='(bit 31 = 1)';
      if(uc2) uc2.style.opacity='0.4';
      if(vc) vc.style.opacity='0.4';
      if(ub) ub.disabled=true;
      if(ut) ut.disabled=true;
      if(sl) sl.disabled=true;
    }
  }

  function setPreset(id){
    ['b15-s153-pr-ln','b15-s153-pr-vault','b15-s153-pr-escrow','b15-s153-pr-off','b15-s153-pr-max'].forEach(p=>{
      const b=g(p);if(b) b.className='b15-s153-preset-btn'+(p===id?' s153-act':'');
    });
  }

  function applySlider(v){
    value=v;
    const sl=g('b15-s153-slider');if(sl){sl.max=Math.max(4032,v);sl.value=v;}
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=v.toLocaleString('en-US')+(useTime?' time units':' blocks');
  }

  const tog1=g('b15-s153-tog1');
  if(tog1) tog1.addEventListener('click',()=>{enabled=!enabled;setEnabled(enabled);update();});

  const ub=g('b15-s153-u-block');
  if(ub) ub.addEventListener('click',()=>{
    useTime=false;
    ub.className='b15-s153-unit-btn s153-act';
    const ut=g('b15-s153-u-time');if(ut) ut.className='b15-s153-unit-btn';
    const sl=g('b15-s153-slider');if(sl){sl.max=4032;sl.value=Math.min(value,4032);}
    value=parseInt(g('b15-s153-slider').value)||144;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' blocks';
    update();
  });
  const ut=g('b15-s153-u-time');
  if(ut) ut.addEventListener('click',()=>{
    useTime=true;
    ut.className='b15-s153-unit-btn s153-act';
    const ub2=g('b15-s153-u-block');if(ub2) ub2.className='b15-s153-unit-btn';
    const sl=g('b15-s153-slider');if(sl){sl.max=1000;sl.value=Math.min(value,1000);}
    value=parseInt(g('b15-s153-slider').value)||144;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value+' time units';
    update();
  });

  const sl=g('b15-s153-slider');
  if(sl) sl.addEventListener('input',()=>{
    value=parseInt(sl.value)||1;
    const sv=g('b15-s153-slider-val');if(sv) sv.textContent=value.toLocaleString('en-US')+(useTime?' time units':' blocks');
    update();
  });

  // Presets
  const prLn=g('b15-s153-pr-ln');
  if(prLn) prLn.addEventListener('click',()=>{
    setPreset('b15-s153-pr-ln');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(144);update();
  });
  const prVault=g('b15-s153-pr-vault');
  if(prVault) prVault.addEventListener('click',()=>{
    setPreset('b15-s153-pr-vault');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(1008);update();
  });
  const prEscrow=g('b15-s153-pr-escrow');
  if(prEscrow) prEscrow.addEventListener('click',()=>{
    setPreset('b15-s153-pr-escrow');enabled=true;useTime=false;
    setEnabled(true);
    g('b15-s153-u-block').className='b15-s153-unit-btn s153-act';
    g('b15-s153-u-time').className='b15-s153-unit-btn';
    applySlider(4320);update();
  });
  const prOff=g('b15-s153-pr-off');
  if(prOff) prOff.addEventListener('click',()=>{
    setPreset('b15-s153-pr-off');enabled=false;
    setEnabled(false);update();
  });
  const prMax=g('b15-s153-pr-max');
  if(prMax) prMax.addEventListener('click',()=>{
    setPreset('b15-s153-pr-max');enabled=false;value=65535;
    setEnabled(false);
    const hv=g('b15-s153-hex-val');if(hv) hv.textContent='0xFFFFFFFF';
    renderBits(0xFFFFFFFF);
    const mw=g('b15-s153-meaning');const mt=g('b15-s153-meaning-text');
    const ms=g('b15-s153-meaning-sub');const ml=g('b15-s153-meaning-label');
    const uc=g('b15-s153-usecase');
    if(mw) mw.className='b15-s153-meaning s153-maxval';
    if(ml) ml.textContent='Special value: 0xFFFFFFFF';
    if(mt) mt.textContent='Timelock DISABLED — this UTXO can be spent anytime after being confirmed.';
    if(ms) ms.textContent='The value 0xFFFFFFFF also disables nLockTime at the transaction level. Many wallets use this for ordinary transactions.';
    if(uc) uc.textContent='Also used as an opt-in RBF (Replace-By-Fee) signal: the value 0xFFFFFFFD marks a transaction as replaceable with a higher fee before confirmation.';
  });

  update();
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.2 SIMULATION (nLockTime Builder)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  let mode='ts';
  let seqActive=true;
  let currentVal=0;
  const NOW=Math.floor(Date.now()/1000);
  const CURRENT_BLOCK=915217;

  function toHexLE(val){
    const buf=new ArrayBuffer(4);
    new DataView(buf).setUint32(0,val>>>0,true);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0').toUpperCase()).join(' ');
  }
  function formatDate(ts){
    return new Date(ts*1000).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'});
  }

  function update(){
    const mt=g('b15-s152-meaning-text');
    const ms=g('b15-s152-meaning-sub');
    const hv=g('b15-s152-hex-val');
    const he=g('b15-s152-hex-explain');
    if(!mt||!ms||!hv||!he) return;

    const val=currentVal;
    const hex=toHexLE(val);
    hv.textContent=hex;

    if(mode==='ts'){
      const date=formatDate(val);
      const diffDays=Math.round((val-NOW)/86400);
      if(!seqActive){
        mt.textContent='nLockTime is ignored — the transaction can be processed anytime.';
        ms.textContent='Because all inputs’ nSequence is set to 0xFFFFFFFF, the network ignores nLockTime entirely. This transaction can be confirmed right now.';
      } else if(diffDays<=0){
        mt.textContent=`The date ${date} has passed — the transaction can be processed now.`;
        ms.textContent='nLockTime has been exceeded. Miners may include this transaction in a block anytime.';
      } else {
        mt.textContent=`This transaction can’t be processed before ${date}.`;
        ms.textContent=`Still ${diffDays} days to go. Even the sender themselves can’t speed this up — the entire Bitcoin network will reject a block that includes this transaction too early.`;
      }
      he.textContent=`Value ${val.toLocaleString('en-US')} (Unix timestamp) → ${hex} in little-endian. Because the value is above 500,000,000, Bitcoin knows this is a timestamp, not a block height.`;
    } else {
      const diff=val-CURRENT_BLOCK;
      const estDays=Math.round(diff*10/1440);
      if(!seqActive){
        mt.textContent='nLockTime is ignored — the transaction can be processed anytime.';
        ms.textContent='Because all inputs’ nSequence is set to 0xFFFFFFFF, the network ignores nLockTime entirely.';
      } else if(diff<=0){
        mt.textContent=`Block #${val.toLocaleString('en-US')} has passed — the transaction can be processed now.`;
        ms.textContent=`The current block is #${CURRENT_BLOCK.toLocaleString('en-US')}. nLockTime has been exceeded.`;
      } else {
        mt.textContent=`This transaction can’t be processed before block #${val.toLocaleString('en-US')}.`;
        ms.textContent=`Still ${diff.toLocaleString('en-US')} blocks to go (about ${estDays} days). The entire Bitcoin network will reject a block that includes this transaction too early.`;
      }
      he.textContent=`Value ${val.toLocaleString('en-US')} (block height) → ${hex} in little-endian. Because the value is below 500,000,000, Bitcoin knows this is a block height, not a timestamp.`;
    }

    const sw=g('b15-s152-seq-wrap');
    const sl=g('b15-s152-seq-label');
    const sd=g('b15-s152-seq-desc');
    const st=g('b15-s152-seq-track');
    const stt=g('b15-s152-seq-ttext');
    if(seqActive){
      if(sw) sw.className='b15-s152-seq-wrap s152-ok';
      if(sl) sl.textContent='nSequence: nLockTime ACTIVE';
      if(sd) sd.textContent='nLockTime will be enforced. The transaction can’t enter a block before the specified time.';
      if(st) st.className='b15-s152-seq-track s152-on';
      if(stt) stt.textContent='input nSequence = 0xFFFFFFFE (nLockTime active)';
    } else {
      if(sw) sw.className='b15-s152-seq-wrap s152-warn';
      if(sl) sl.textContent='nSequence: nLockTime DISABLED';
      if(sd) sd.textContent='Be careful: if all inputs have nSequence = 0xFFFFFFFF, the network will ignore nLockTime entirely. This is a trap that often surprises new developers.';
      if(st) st.className='b15-s152-seq-track';
      if(stt) stt.textContent='input nSequence = 0xFFFFFFFF (nLockTime ignored!)';
    }
  }

  function buildTS(){
    const area=g('b15-s152-input-area'); if(!area) return;
    const def=NOW+30*86400;
    currentVal=def;
    const minTS=NOW;
    const maxTS=NOW+365*5*86400;
    area.innerHTML=`
      <div class="b15-s152-input-label">Choose a date:</div>
      <div class="b15-s152-ts-wrap">
        <input type="range" class="b15-s152-ts-slider" id="b15-s152-ts-slider"
          min="${minTS}" max="${maxTS}" value="${def}" step="86400">
        <div class="b15-s152-ts-labels">
          <span>Now</span><span>+1 year</span><span>+3 years</span><span>+5 years</span>
        </div>
      </div>
      <div class="b15-s152-ts-display" id="b15-s152-ts-display">${formatDate(def)}</div>
      <div class="b15-s152-ts-unix" id="b15-s152-ts-unix">Unix: ${def}</div>`;
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl) sl.addEventListener('input',()=>{
      currentVal=parseInt(sl.value);
      const d=document.getElementById('b15-s152-ts-display');
      const u=document.getElementById('b15-s152-ts-unix');
      if(d) d.textContent=formatDate(currentVal);
      if(u) u.textContent='Unix: '+currentVal;
      update();
    });
    update();
  }

  function buildBH(){
    const area=g('b15-s152-input-area'); if(!area) return;
    const def=CURRENT_BLOCK+1000;
    currentVal=def;
    area.innerHTML=`
      <div class="b15-s152-input-label">Enter the target block height:</div>
      <div class="b15-s152-input-sub">Current block: #${CURRENT_BLOCK.toLocaleString('en-US')}. Enter a larger number to lock in the future.</div>
      <div class="b15-s152-input-row">
        <input type="number" class="b15-s152-input" id="b15-s152-bh-input" value="${def}" min="0" max="499999999">
        <div class="b15-s152-input-unit">blocks</div>
      </div>`;
    const inp=document.getElementById('b15-s152-bh-input');
    if(inp) inp.addEventListener('input',()=>{
      currentVal=Math.min(499999999,Math.max(0,parseInt(inp.value)||0));
      update();
    });
    update();
  }

  // Mode buttons
  const mts=g('b15-s152-m-ts'),mbh=g('b15-s152-m-bh');
  if(mts) mts.addEventListener('click',()=>{
    mode='ts';
    mts.className='b15-s152-mode-btn s152-act';
    if(mbh) mbh.className='b15-s152-mode-btn';
    buildTS();
  });
  if(mbh) mbh.addEventListener('click',()=>{
    mode='bh';
    mbh.className='b15-s152-mode-btn s152-act';
    if(mts) mts.className='b15-s152-mode-btn';
    buildBH();
  });

  // nSequence toggle
  const seq=g('b15-s152-seq-toggle');
  if(seq) seq.addEventListener('click',()=>{seqActive=!seqActive;update();});

  // Use case presets
  function setUC(id){
    ['gaji','escrow','warisan','block'].forEach(u=>{
      const b=g(`b15-s152-uc-${u}`);
      if(b) b.className='b15-s152-uc-btn'+(u===id?' s152-act':'');
    });
  }
  const ucGaji=g('b15-s152-uc-gaji');
  if(ucGaji) ucGaji.addEventListener('click',()=>{
    setUC('gaji');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+30*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucEscrow=g('b15-s152-uc-escrow');
  if(ucEscrow) ucEscrow.addEventListener('click',()=>{
    setUC('escrow');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+180*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucWarisan=g('b15-s152-uc-warisan');
  if(ucWarisan) ucWarisan.addEventListener('click',()=>{
    setUC('warisan');mode='ts';
    if(mts){mts.className='b15-s152-mode-btn s152-act';}
    if(mbh){mbh.className='b15-s152-mode-btn';}
    buildTS();
    const sl=document.getElementById('b15-s152-ts-slider');
    if(sl){sl.value=NOW+365*86400;sl.dispatchEvent(new Event('input'));}
  });
  const ucBlock=g('b15-s152-uc-block');
  if(ucBlock) ucBlock.addEventListener('click',()=>{
    setUC('block');mode='bh';
    if(mbh){mbh.className='b15-s152-mode-btn s152-act';}
    if(mts){mts.className='b15-s152-mode-btn';}
    buildBH();
  });

  buildTS();
})();

// ============================================================
// PAGE 18 · BAB 15 · 15.1 SIMULATION (Waktu di Bitcoin)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // ── BLOCK HEIGHT ──
  let blocks=[], refBlock=null;
  const BASE_HEIGHT=800000;

  function renderChain(){
    const track=g('b15-s151-track'); if(!track) return;
    track.innerHTML='';
    const show=blocks.slice(-6);
    show.forEach((b,i)=>{
      if(i>0){
        const arr=document.createElement('div');
        arr.className='b15-s151-chain-arrow';arr.textContent='→';
        track.appendChild(arr);
      }
      const el=document.createElement('div');
      const isRef=refBlock===b.height;
      const isNew=i===show.length-1&&!isRef;
      el.className='b15-s151-block '+(isRef?'s151-ref':isNew?'s151-new':'s151-past');
      el.innerHTML=`<div class="b15-s151-block-num">#${b.height.toLocaleString('en-US')}</div><div class="b15-s151-block-time">~${b.mins}m</div>`;
      track.appendChild(el);
    });
    const val=g('b15-s151-val');
    const desc=g('b15-s151-desc2');
    if(blocks.length===0){
      if(val) val.textContent='—';
      if(desc) desc.textContent='Click "Add New Block" to start.';
      return;
    }
    const last=blocks[blocks.length-1];
    if(val) val.textContent=`Block #${last.height.toLocaleString('en-US')}`;
    if(refBlock){
      const diff=last.height-refBlock;
      if(desc) desc.textContent=`${diff} blocks since the time reference (block #${refBlock.toLocaleString('en-US')}). In protocol rules this can be written: "this transaction is only valid after ${diff} confirmations from the reference block."`;
    } else {
      if(desc) desc.textContent=`The latest block in the chain. Mark this block as a time reference to see how many blocks have passed.`;
    }
  }

  const addBtn=g('b15-s151-add');
  if(addBtn) addBtn.addEventListener('click',()=>{
    const mins=Math.floor(Math.random()*20)+2;
    const height=(blocks.length>0?blocks[blocks.length-1].height:BASE_HEIGHT-1)+1;
    blocks.push({height,mins});
    renderChain();
  });
  const markBtn=g('b15-s151-mark');
  if(markBtn) markBtn.addEventListener('click',()=>{
    if(blocks.length===0) return;
    refBlock=blocks[blocks.length-1].height;
    renderChain();
  });
  const rst1=g('b15-s151-rst1');
  if(rst1) rst1.addEventListener('click',()=>{blocks=[];refBlock=null;renderChain();});
  renderChain();

  // ── MTP ──
  const BASE_TIME=1700000000;
  const baseTimes=Array.from({length:11},(_,i)=>BASE_TIME+i*600+Math.floor((Math.random()-0.5)*120));
  baseTimes.sort((a,b)=>a-b);

  function renderMTP(){
    const slider=g('b15-s151-slider'); if(!slider) return;
    const offset=parseInt(slider.value)*60;
    const times=[...baseTimes];
    times[5]+=offset;
    const baseMTP=[...baseTimes].sort((a,b)=>a-b)[5];
    const mtp=[...times].sort((a,b)=>a-b)[5];
    const diff=Math.round((mtp-baseMTP)/60);
    const sl=parseInt(slider.value);
    const offEl=g('b15-s151-offset');
    if(offEl) offEl.textContent=(sl>0?'+':'')+sl+' minutes';
    const container=g('b15-s151-mtp-blocks'); if(!container) return;
    container.innerHTML='';
    const minT=Math.min(...times)-300;
    const maxT=Math.max(...times)+300;
    const range=maxT-minT;
    const sorted=[...times].map((t,i)=>({t,i})).sort((a,b)=>a.t-b.t);
    const medianOrigIdx=sorted[5].i;
    times.forEach((t,i)=>{
      const isManip=i===5;
      const isMedian=i===medianOrigIdx;
      const pct=Math.max(5,((t-minT)/range)*100);
      const wrap=document.createElement('div');
      wrap.className='b15-s151-mtp-block';
      const barWrap=document.createElement('div');
      barWrap.className='b15-s151-mtp-bar-wrap';
      const bar=document.createElement('div');
      bar.className='b15-s151-mtp-bar';
      bar.style.height=pct+'%';
      bar.style.background=isManip?'#A32D2D':isMedian?'#0F6E56':'#534AB7';
      bar.style.opacity=isManip?'0.9':'0.7';
      if(isMedian){
        const line=document.createElement('div');
        line.className='b15-s151-mtp-median-line';
        line.style.bottom=pct+'%';
        barWrap.appendChild(line);
      }
      barWrap.appendChild(bar);
      const num=document.createElement('div');
      num.className='b15-s151-mtp-block-num';
      num.textContent=`#${i+1}${isManip?' ⚠':''}`;
      const ts=document.createElement('div');
      ts.className='b15-s151-mtp-block-ts';
      ts.textContent=`+${Math.round((t-BASE_TIME)/60)}m`;
      wrap.appendChild(barWrap);wrap.appendChild(num);wrap.appendChild(ts);
      container.appendChild(wrap);
    });
    const res=g('b15-s151-mtp-result');
    const rl=g('b15-s151-mtp-rlabel');
    const rv=g('b15-s151-mtp-val');
    const rd=g('b15-s151-mtp-desc');
    const isBig=Math.abs(diff)>=30;
    if(res) res.className='b15-s151-mtp-result '+(isBig?'s151-warn':'s151-normal');
    if(rl) rl.textContent=isBig?'MTP shifted quite far — but still limited':'Current Median Time Past (MTP)';
    if(rv) rv.textContent=diff===0?'MTP did’t shift':`MTP shifted ${diff>0?'+':''}${diff} minutes from baseline`;
    if(rd){
      if(sl===0) rd.textContent='All timestamps normal. MTP is the middle value of 11 blocks — representing the network’s "consensus time".';
      else if(isBig) rd.textContent=`Block #6 manipulated by ${sl} minutes. MTP shifted ${Math.abs(diff)} minutes too. For a larger manipulation, a miner would have to control the majority of these 11 blocks.`;
      else rd.textContent=`Block #6 manipulated by ${sl} minutes, but MTP only shifted ${Math.abs(diff)} minutes. The median protects against single-block manipulation.`;
    }
  }

  const slider=g('b15-s151-slider');
  if(slider) slider.addEventListener('input',renderMTP);
  renderMTP();

  // ── TABS ──
  const t1=g('b15-s151-t1'),t2=g('b15-s151-t2');
  const p1=g('b15-s151-p1'),p2=g('b15-s151-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b15-s151-tab s151-act';t2.className='b15-s151-tab';
    p1.className='b15-s151-pane show';p2.className='b15-s151-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b15-s151-tab s151-act';t1.className='b15-s151-tab';
    p2.className='b15-s151-pane show';p1.className='b15-s151-pane';
  });
})();

